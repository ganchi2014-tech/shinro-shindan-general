// 新規大学を data_general.json にマージ → data_final.json
const fs = require('fs');
const path = require('path');
const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'data_general.json'), 'utf8'));
const NEW = [...require('./new_unis_kokkoritsu.js'), ...require('./new_unis_shiritsu.js'), ...require('./new_unis_kanto.js'), ...require('./new_unis_extra.js')];

function regionOf(pref) {
  if (!pref) return 'other';
  if (/東京|神奈川|千葉|埼玉|茨城/.test(pref)) return 'kanto'; // 「東京都」が「京都」に誤マッチしないよう先に判定
  if (pref.includes('滋賀')) return 'shiga';
  if (pref.includes('京都')) return 'kyoto';
  if (pref.includes('大阪')) return 'osaka';
  if (pref.includes('兵庫')) return 'hyogo';
  if (pref.includes('奈良') || pref.includes('和歌山')) return 'nara-wakayama';
  if (/愛知|岐阜|三重|静岡/.test(pref)) return 'tokai';
  if (/東京|神奈川|千葉|埼玉|茨城/.test(pref)) return 'kanto';
  return 'other';
}

const existingIds = new Set(j.base.universities.map(u => u.id));
let added = 0;
for (const nu of NEW) {
  const b = nu.base;
  if (existingIds.has(b.id)) { console.log('skip duplicate:', b.id); continue; }
  const region = regionOf(b.prefecture);
  j.base.universities.push({ ...b, region });
  j.ippan.universities.push({ id: b.id, name: b.name, region, ...nu.ippan });
  if (nu.sogo) j.sogo.universities.push({ id: b.id, name: b.name, region, ...nu.sogo });
  if (nu.koubo) j.koubo.universities.push({ id: b.id, name: b.name, region, ...nu.koubo });
  if (nu.employment) j.employment.universities.push({ id: b.id, name: b.name, region, notes: null, ...nu.employment });
  added++;
}

j.base.updated = '2026-07-10';
j.base.schema = 'universities-base-general';

// 検証: idの整合・必須フィールド
const baseIds = new Set(j.base.universities.map(u => u.id));
for (const cat of ['sogo', 'koubo', 'ippan', 'employment']) {
  for (const u of j[cat].universities) {
    if (!baseIds.has(u.id)) console.log('WARN: orphan in', cat, u.id);
  }
}
let noHensachi = 0;
for (const u of j.ippan.universities) if (u.hensachi_representative == null) noHensachi++;
console.log('追加:', added, '/ 合計:', j.base.universities.length, '/ hensachi欠落:', noHensachi);
console.log('国公立:', j.base.universities.filter(u => /国立|公立/.test(u.type)).length);

fs.writeFileSync(path.join(__dirname, 'data_final.json'), JSON.stringify(j));
console.log('data_final.json 書き出し完了:', Math.round(fs.statSync(path.join(__dirname, 'data_final.json')).size / 1024), 'KB');
