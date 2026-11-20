// 日程の「年度の取り違え」を見つけるための検査。
//  秋（9〜12月）の試験日は土日・祝日に置かれることが多い。2027年度入試（=2026年の秋）の暦で数えた土日祝の数と、
//  1年前（2025年の秋）の暦で数えた数を大学ごとに比べ、1年前の暦のほうがはっきり合う大学を「要確認」として出す。
//  使い方: node crawl/check_year.js
const d = require('../data_v2.json');
const HOL = { 2026: ['9/21', '9/22', '9/23', '10/12', '11/3', '11/23'], 2025: ['9/15', '9/23', '10/13', '11/3', '11/24'] };
const off = (y, m, dd) => { const w = new Date(y, m - 1, dd).getDay(); return w === 0 || w === 6 || HOL[y].includes(m + '/' + dd); };
// 平日に試験を置くと分かっている大学（確かめた内容）。ここにある大学は「確認済み」として出す
const KNOWN_WEEKDAY = {
  tsukuba: '推薦入試は令和8年11月26日(木)〜27日(金)。別の出どころ（予備校の2027年度まとめ）でも同じ日付',
  'tokyo-kagaku': '医歯学系の特別選抜Ⅰは例年11月下旬の平日（2024年は11/25月・26火）。2026年は11/24火・25水で曜日の並びが合う',
};
const out = [], known = [];
let tot = 0, hit26 = 0, hit25 = 0;
for (const u of d.universities) {
  const no = u.nyushi_official; if (!no || !/2027/.test(no.year)) continue;
  const days = [];
  for (const line of [...(no.sogo || []), ...(no.koubo || [])]) {
    const m = line.match(/試験\s*([^｜]*)/); if (!m) continue;
    for (const x of m[1].matchAll(/(\d{1,2})\/(\d{1,2})/g)) { const mo = +x[1], dd = +x[2]; if (mo >= 9 && mo <= 12) days.push([mo, dd]); }
  }
  if (!days.length) continue;
  const a = days.filter(([m, dd]) => off(2026, m, dd)).length, b = days.filter(([m, dd]) => off(2025, m, dd)).length;
  tot += days.length; hit26 += a; hit25 += b;
  if (b - a >= 2 || (a === 0 && b >= 1 && days.length >= 2)) (KNOWN_WEEKDAY[u.id] ? known : out).push((KNOWN_WEEKDAY[u.id] ? '[' + KNOWN_WEEKDAY[u.id] + '] ' : '') + `${u.id}（${u.name}）: 秋の試験日${days.length}件 → 2026年の暦で土日祝 ${a} / 2025年の暦で ${b}  [${days.map((x) => x.join('/')).join(' ')}]`);
}
console.log(`秋の試験日 ${tot}件: 2026年の暦で土日祝 ${hit26}件（${Math.round(hit26 / tot * 100)}%） / 2025年の暦で ${hit25}件（${Math.round(hit25 / tot * 100)}%）`);
console.log(out.length ? '要確認:\n - ' + out.join('\n - ') : '要確認の大学なし');
if (known.length) console.log('確認済み（平日に試験を置く大学）:\n - ' + known.join('\n - '));
