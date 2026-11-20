// Museが2027年度の要項で確かめた「総合型・公募に出願するための評定の条件」（H行）を data_v2.json に反映する。
//  使い方: node crawl/apply_hyoutei.js 2026-11-20 crawl/muse_hyoutei_20261120.txt
//  大学ごとに hyoutei_official = { year, fetched, by, rows:[{name, cond, min, none, url}] } を持たせる。
//   min … 「3.5以上」のように全体の評定だけで決まる条件のときの数字（学部・教科で違うものは null＝画面で✅/⚠️を付けない）
//   none … 「条件なし」と確かめられた方式
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const [fetched, ...files] = process.argv.slice(2);
const U = Object.fromEntries(d.universities.map((u) => [u.id, u]));
const rows = {};
for (const f of files) for (const l of fs.readFileSync(f, 'utf8').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'))) {
  const [id, k, name, cond, url] = l.split('|').map((x) => x.trim().replace(/^\^/, 'https://'));
  if (k !== 'H' || !U[id] || !name || !cond) continue;
  const m = cond.match(/^(?:全体)?([0-9]\.[0-9])以上(?:（全学部）)?$/);   // 「3.0以上（看護学科は3.7以上）」のように学科で違うものは数字にしない
  (rows[id] = rows[id] || []).push({ name, cond, min: m ? parseFloat(m[1]) : null, none: /^条件なし/.test(cond), url: /^https?:\/\//.test(url || '') ? url : null });
}
for (const [id, r] of Object.entries(rows)) U[id].hyoutei_official = { year: '2027年度入試', fetched, by: 'muse', rows: r };
fs.writeFileSync(P, JSON.stringify(d, null, 1));
const all = Object.values(rows).flat();
console.log(`評定の条件を入れた大学 ${Object.keys(rows).length} / 方式 ${all.length}（条件なし ${all.filter((x) => x.none).length}・全体の数字で決まる ${all.filter((x) => x.min != null).length}・学部や教科で違う ${all.filter((x) => !x.none && x.min == null).length}）`);
