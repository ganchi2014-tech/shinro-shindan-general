// Museが公式サイトで確かめた「その学部でその資格が取れるか」（Q行）を data_v2.json に反映する。
//  使い方: node crawl/apply_qual_check.js 2026-11-20 crawl/muse_qual_20261120.txt
//  ○ … 資格の欄の「要確認」を外す（欄に無ければ足す）   × だけ … 資格の欄から外す
//  学部ごとに quals_checked = {date, by, source_url} を付ける（画面で「公式で確認」と出すための印）
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const [date, ...files] = process.argv.slice(2);
const RE = { 看護師: /看護師/, 保健師: /保健師/, 助産師: /助産師/, 小学校: /小学校/, 保育士: /保育士/, 幼稚園: /幼稚園/, 理学療法士: /理学療法士/, 作業療法士: /作業療法士/,
  言語聴覚士: /言語聴覚士/, 管理栄養士: /管理栄養士/, 薬剤師: /薬剤師/, 社会福祉士: /社会福祉士/, 建築士: /建築士/, 養護教諭: /養護教諭/, 臨床検査技師: /臨床検査技師/, 診療放射線技師: /診療放射線技師/ };
const ADD = { 助産師: '助産師（国家試験受験資格）', 養護教諭: '養護教諭一種免許' };   // ○なのに欄に無かったときに足す書き方
// 行だけでは決められない所（理由つき）
const SPECIAL = {
  // 児童福祉学科は2026年度より募集停止（Museが公式で確認）。資格は取れるが新入生は入れないので、欄から外す
  'hanazono-fukushi': { remove: [/保育士/, /幼稚園/] },
  // 助産師は学科の課程には無く、卒業後に助産学専攻科で取る形。説明の文は残す
  'morinomiya-iryo-kango': { keep: [/助産師/] },
};
// 学部そのものが無かったもの（Museの指摘をClaudeが公式ページで確認）
const DELETE_DEPT = { 'osaka-kokusai-hokeniryo': '大阪国際大に保健医療学部・看護学科は無い（公式の学部は人間科学・国際教養・経営経済）' };
const clean = (s) => s.replace(/（要確認）/g, '').replace(/・要確認）/g, '）');
const marks = {};   // dept_id -> { 資格: {ok:bool, ng:bool, url} }
const miss = [];
for (const f of files) for (const l of fs.readFileSync(f, 'utf8').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'))) {
  const [id, k, name, qual, mark, url] = l.split('|').map((x) => x.trim().replace(/^\^/, 'https://'));
  if (k !== 'Q' || !RE[qual]) { if (k === 'Q') miss.push('知らない資格: ' + l.slice(0, 40)); continue; }
  const t = name.split(/\s+/);
  const hits = d.departments.filter((x) => x.uni_id === id && x.name.includes(t[0]) && (!/学科/.test(x.name) || !t[1] || x.name.includes(t[1])));
  if (!hits.length) { miss.push('学部が見つからない: ' + id + ' ' + name); continue; }
  for (const x of hits) { const m = ((marks[x.dept_id] = marks[x.dept_id] || {})[qual] = marks[x.dept_id][qual] || {}); if (mark === '○') m.ok = true; else m.ng = true; m.url = m.url || url; }
}
let changed = 0, checked = 0;
for (const x of d.departments) {
  const m = marks[x.dept_id]; if (!m || DELETE_DEPT[x.dept_id]) continue;
  const before = JSON.stringify(x.qualifications);
  let q = (Array.isArray(x.qualifications) ? x.qualifications : [x.qualifications]).filter((s) => typeof s === 'string');
  const sp = SPECIAL[x.dept_id] || {};
  for (const [qual, v] of Object.entries(m)) {
    const re = RE[qual];
    if (v.ok) { if (q.some((s) => re.test(s))) q = q.map((s) => (re.test(s) ? clean(s) : s)); else q.push(ADD[qual] || qual); }
    else if (!(sp.keep || []).some((k) => String(k) === String(re))) q = q.filter((s) => !re.test(s));
    else q = q.map((s) => (re.test(s) ? clean(s) : s));
  }
  for (const re of sp.remove || []) q = q.filter((s) => !re.test(s));
  x.qualifications = q;
  x.quals_checked = { date, by: 'muse', source_url: Object.values(m)[0].url };
  checked++;
  if (JSON.stringify(q) !== before) { changed++; console.log(`${x.dept_id}\n   前: ${before}\n   後: ${JSON.stringify(q)}`); }
}
const n0 = d.departments.length;
d.departments = d.departments.filter((x) => { if (DELETE_DEPT[x.dept_id]) { console.log('学部を外す: ' + x.dept_id + ' … ' + DELETE_DEPT[x.dept_id]); return false; } return true; });
fs.writeFileSync(P, JSON.stringify(d, null, 1));
console.log(`確かめた印を付けた学部 ${checked} / 資格の欄が変わった学部 ${changed} / 外した学部 ${n0 - d.departments.length}`);
if (miss.length) console.log('注意:\n - ' + miss.join('\n - '));
