// Muse（別のAI）が公式サイト・公式PDFから取った日程とリンク、および巡回スクリプトのリンク(TSV)を data_v2.json に反映する。
//  使い方: node crawl/apply_muse.js <取得日 YYYY-MM-DD> <ファイル...>
//   *.txt = Museの行  id|S/K/I|方式名|出願 …|試験 …|発表 …[|年度=2026]   /   id|L|入試ページ|日程の資料|募集要項|オープンキャンパス
//   *.tsv = 巡回スクリプトのリンク  id<TAB>入試ページ<TAB>入試日程<TAB>募集要項<TAB>オープンキャンパス（~ は入試ページと同じサイト）
//  すでに人の目で整えた日程（official_*.json 由来）がある大学の日程は上書きしない。リンクは空でない値だけ上書きする。
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const [fetched, ...files] = process.argv.slice(2);
if (!/^\d{4}-\d\d-\d\d$/.test(fetched || '') || !files.length) { console.error('使い方: node crawl/apply_muse.js YYYY-MM-DD ファイル...'); process.exit(1); }
const U = Object.fromEntries(d.universities.map((u) => [u.id, u]));
const okUrl = (u) => /^https?:\/\/[^\s|]+$/.test(u || '');
const warn = [], sched = {}, links = {};
const DATEISH = /^\d{1,2}\/\d{1,2}/;
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  if (f.endsWith('.tsv')) {
    for (const l of fs.readFileSync(f, 'utf8').split('\n').filter((x) => x.trim() && !x.startsWith('#'))) {
      const [id, n, s, y, o] = l.split('\t').map((x) => (x || '').trim());
      if (!U[id]) { warn.push('不明なid: ' + id); continue; }
      const origin = okUrl(n) ? new URL(n).origin : (U[id].official_links && okUrl(U[id].official_links.official_url) ? new URL(U[id].official_links.official_url).origin : '');
      const ex = (x) => (x && x[0] === '~' ? origin + x.slice(1) : x);
      links[id] = Object.assign(links[id] || {}, Object.fromEntries(Object.entries({ nyushi: n, schedule: ex(s), youkou: ex(y), oc: ex(o) }).filter(([, v]) => okUrl(v))));
    }
    continue;
  }
  for (const l of lines) {
    const c = l.split('|').map((x) => x.trim().replace(/^\^/, 'https://'));   // ^ は https:// の略
    const id = c[0], k = c[1];
    if (!U[id]) { if (!/見つからず/.test(l)) warn.push('不明なid: ' + l.slice(0, 40)); continue; }
    if (k === 'L') {
      links[id] = Object.assign(links[id] || {}, Object.fromEntries(Object.entries({ nyushi: c[2], schedule: c[3], youkou: c[4], oc: c[5] }).filter(([, v]) => okUrl(v))));
      continue;
    }
    if (!['S', 'K', 'I'].includes(k)) continue;                      // 「見つからず：…」などは読み飛ばす
    const old = (c.find((x) => /^年度=/.test(x)) || '').replace('年度=', '');
    const parts = c.slice(3).filter((x) => x && !/^年度=/.test(x) && !/^https?:/.test(x))
      .map((x) => x.replace(/^(出願|試験|発表)\s*$/, '')).filter(Boolean);
    const dated = parts.filter((x) => DATEISH.test(x.replace(/^(出願|試験|発表)\s*/, '')));
    if (!c[2] || !dated.length) { warn.push('日付なしで読み飛ばし: ' + l.slice(0, 50)); continue; }
    const key = { S: 'sogo', K: 'koubo', I: 'ippan' }[k];
    const s = (sched[id] = sched[id] || { sogo: [], koubo: [], ippan: [], years: new Set() });
    s.years.add(old || '2027');
    if (s[key].length < 4) s[key].push([c[2], ...parts].join('｜'));
  }
}
let nl = 0, ns = 0, kept = 0;
for (const [id, l] of Object.entries(links)) {
  const u = U[id], ol = (u.official_links = u.official_links || {});
  if (l.nyushi) ol.nyushi_url = l.nyushi;
  if (l.schedule) ol.schedule_url = l.schedule;
  if (l.youkou) ol.youkou_url = l.youkou;
  if (l.oc) { u.open_campus = u.open_campus || {}; u.open_campus.open_campus_url = l.oc; }
  ol.verified = true; ol.verified_date = fetched; nl++;
}
for (const [id, s] of Object.entries(sched)) {
  const u = U[id];
  if (u.nyushi_official && u.nyushi_official.by !== 'muse') { kept++; continue; }
  const years = [...s.years];
  u.nyushi_official = { year: (years.length === 1 ? years[0] : '2027') + '年度入試', fetched, by: 'muse',
    source_url: (links[id] && (links[id].schedule || links[id].youkou)) || (u.official_links && (u.official_links.schedule_url || u.official_links.nyushi_url)) || null,
    sogo: s.sogo, koubo: s.koubo, ippan: s.ippan };
  ns++;
}
fs.writeFileSync(P, JSON.stringify(d, null, 1));
const tot = d.universities.length;
console.log(`リンク更新 ${nl}校 / 日程を反映 ${ns}校（既存を残した ${kept}校）`);
console.log(`現在: 公式リンク確認済み ${d.universities.filter((u) => u.official_links && u.official_links.verified_date).length}/${tot} / 日程あり ${d.universities.filter((u) => u.nyushi_official).length}/${tot}`);
if (warn.length) console.log('注意:\n - ' + warn.slice(0, 20).join('\n - '));
