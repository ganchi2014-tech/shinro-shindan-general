// crawl/official_*.json を data_v2.json に反映する。
//  - official_links: nyushi_url / schedule_url / youkou_url を公式サイトで確認した値に置き換え、verified_date を付ける
//  - open_campus.open_campus_url
//  - nyushi_official: 公式ページから取った日程の行（年度つき）。古い nyushi_details は消さずに残す（表示側で扱いを分ける）
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const files = process.argv.slice(2);
if (!files.length) { console.error('使い方: node crawl/apply_official.js crawl/official_YYYYMMDD.json'); process.exit(1); }
let nl = 0, ns = 0; const miss = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [id, l] of Object.entries(j.links || {})) {
    const u = d.universities.find((x) => x.id === id); if (!u) { miss.push(id); continue; }
    const ol = (u.official_links = u.official_links || {});
    if (l.nyushi) ol.nyushi_url = l.nyushi;
    if (l.schedule) ol.schedule_url = l.schedule;
    if (l.youkou) ol.youkou_url = l.youkou;
    ol.verified = true; ol.verified_date = j.fetched;
    if (l.oc) { u.open_campus = u.open_campus || {}; u.open_campus.open_campus_url = l.oc; }
    nl++;
  }
  for (const [id, s] of Object.entries(j.schedule || {})) {
    const u = d.universities.find((x) => x.id === id); if (!u) { miss.push(id); continue; }
    u.nyushi_official = { year: '2027年度入試', fetched: j.fetched, source_url: ((j.links || {})[id] || {}).schedule || ((j.links || {})[id] || {}).nyushi || null, sogo: s.sogo || [], koubo: s.koubo || [], ippan: s.ippan || [] };
    ns++;
  }
}
fs.writeFileSync(P, JSON.stringify(d, null, 1));
console.log(`公式リンクを更新: ${nl}校 / 公式の日程を反映: ${ns}校` + (miss.length ? ` / データに無いid: ${miss.join(',')}` : ''));
