#!/usr/bin/env node
// 新規大学/学部を data_v2.json に検証つきでマージする
// 使い方: node merge_v2_add.js <dir1> [dir2 ...]
//   dir 内の *.json を読む。形状は2種:
//   A) 新規大学:      { uni: {...}, departments: [...] }
//   B) 既存大学に学部: { uni_id: "...", departments: [...] }
// 方針: 推定データ前提。data_status は estimated/unconfirmed のみ許可（verifiedは自動降格）。
//       出典の無い zemi / nyushi_details は捏造防止のため落とす。
const fs = require('fs');
const path = require('path');
const { validate } = require('./check_v2.js');

const WORK = __dirname;
const DATA_PATH = path.join(WORK, 'data_v2.json');
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const VALID_INTEREST = new Set([...data.tags.interest.map(t => t.id), 'unclassified']);
const VALID_EMP = new Set(data.tags.employment.map(t => t.id));
const RATING_KEYS = ['kyoin', 'shogakkō', 'keisatsu', 'shōbō', 'kōmuin_ippan', 'kigyō_ippan', 'kigyō_supotsu', 'iryō'];
const METHOD_TYPES = ['sogo', 'koubo', 'ippan', 'kyotsu'];
const UNI_REQUIRED = ['id', 'name', 'name_short', 'prefecture', 'type', 'feature', 'official_links', 'employment', 'entry_method_details', 'living_cost', 'shingaku_jisseki', 'access_from_shiga_min', 'commute_possible', 'tuition_yen_per_year'];

function regionOf(pref) {
  if (!pref) return 'other';
  if (/東京|神奈川|千葉|埼玉|茨城/.test(pref)) return 'kanto'; // 「東京都」の京都誤マッチ防止で先に判定
  if (pref.includes('滋賀')) return 'shiga';
  if (pref.includes('京都')) return 'kyoto';
  if (pref.includes('大阪')) return 'osaka';
  if (pref.includes('兵庫')) return 'hyogo';
  if (pref.includes('奈良') || pref.includes('和歌山')) return 'nara-wakayama';
  if (/愛知|岐阜|三重|静岡/.test(pref)) return 'tokai';
  return 'other';
}

const errors = [];
const warns = [];
const uniIds = new Set(data.universities.map(u => u.id));
const deptIds = new Set(data.departments.map(d => d.dept_id));
let addedUnis = 0, addedDepts = 0;

function sanitizeDept(d, uniId, label) {
  if (!d.dept_id || !d.dept_id.startsWith(uniId)) { errors.push(`${label}: dept_id が uni_id で始まらない (${d.dept_id})`); return null; }
  if (deptIds.has(d.dept_id)) { errors.push(`${label}: dept_id 重複 (${d.dept_id})`); return null; }
  if (!d.name) { errors.push(`${label}: name がない`); return null; }
  const h = d.hensachi || {};
  if (typeof h.min !== 'number' || typeof h.max !== 'number' || h.min > h.max || h.min < 30 || h.max > 75) {
    errors.push(`${label} ${d.dept_id}: hensachi が不正 (${JSON.stringify(h)})`); return null;
  }
  // 推定データ: 出典なし＝verified不可。zemiも出典必須のため空に。
  const status = (d.data_status === 'verified') ? 'estimated' : (d.data_status || 'estimated');
  if (d.data_status === 'verified') warns.push(`${d.dept_id}: verified→estimated に降格（出典なし）`);
  if ((d.zemi || []).length) warns.push(`${d.dept_id}: zemi ${d.zemi.length}件を破棄（出典なし）`);
  const em = [];
  for (const tp of METHOD_TYPES) {
    const src = (d.entry_methods || []).find(m => m && m.type === tp) || {};
    em.push({ type: tp, available: (typeof src.available === 'boolean') ? src.available : null, note: src.note || null, verified: false });
  }
  const itags = (d.interest_tags || []).filter(t => VALID_INTEREST.has(t));
  (d.interest_tags || []).filter(t => !VALID_INTEREST.has(t)).forEach(t => warns.push(`${d.dept_id}: 不正interest_tag破棄 (${t})`));
  const etags = (d.employment_fields || []).filter(t => VALID_EMP.has(t));
  (d.employment_fields || []).filter(t => !VALID_EMP.has(t)).forEach(t => warns.push(`${d.dept_id}: 不正employment_field破棄 (${t})`));
  return {
    dept_id: d.dept_id, uni_id: uniId, name: d.name,
    campus: d.campus || null,
    hensachi: { min: h.min, max: h.max, basis: 'kawai', source_url: null, verified_date: null },
    bairitsu: { ippan: {}, source_url: null, verified_date: null },   // 年度別実数は捏造しない
    entry_methods: em,
    qualifications: Array.isArray(d.qualifications) ? d.qualifications : [],
    interest_tags: itags.length ? itags : ['unclassified'],
    employment_fields: etags,
    zemi: [],
    data_status: status,
  };
}

function sanitizeUni(u) {
  for (const f of UNI_REQUIRED) if (!(f in u)) errors.push(`${u.id || '?'}: 大学の必須フィールド ${f} がない`);
  if (uniIds.has(u.id)) { errors.push(`${u.id}: 大学ID重複`); return null; }
  if (!/^[a-z0-9-]+$/.test(u.id || '')) { errors.push(`${u.id}: idはkebab-caseの英数のみ`); return null; }
  if (!['国立', '公立', '私立'].includes(u.type)) errors.push(`${u.id}: type不正 (${u.type})`);
  const r = (u.employment || {}).ratings || {};
  for (const k of RATING_KEYS) {
    if (typeof r[k] !== 'number' || r[k] < 1 || r[k] > 5) errors.push(`${u.id}: employment.ratings.${k} 不正 (${r[k]})`);
  }
  if (typeof u.access_from_shiga_min !== 'number') errors.push(`${u.id}: access_from_shiga_min が数値でない`);
  if (u.nyushi_details) { warns.push(`${u.id}: nyushi_details を破棄（日程の捏造防止）`); delete u.nyushi_details; }
  const ol = u.official_links || {};
  u.official_links = { official_url: ol.official_url || null, nyushi_url: ol.nyushi_url || null, shingaku_url: ol.shingaku_url || null, youkou_url: ol.youkou_url || null, verified: false };
  u.region = regionOf(u.prefecture);
  const emd = u.entry_method_details || {};
  u.entry_method_details = { sogo: emd.sogo || [], koubo: emd.koubo || [], ippan: emd.ippan || [] };
  return u;
}

const dirs = process.argv.slice(2);
if (!dirs.length) { console.error('使い方: node merge_v2_add.js <dir> ...'); process.exit(1); }
const files = dirs.flatMap(dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => path.join(dir, f)) : []);
console.log(`入力ファイル: ${files.length}件`);

for (const file of files) {
  let j;
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { errors.push(`${path.basename(file)}: JSONパース失敗 (${e.message})`); continue; }
  if (j.uni) {                                        // A) 新規大学
    const u = sanitizeUni(j.uni);
    if (!u) continue;
    const depts = (j.departments || []).map(d => sanitizeDept(d, u.id, path.basename(file))).filter(Boolean);
    if (!depts.length) { errors.push(`${u.id}: 有効な学部が0件`); continue; }
    data.universities.push(u);
    uniIds.add(u.id);
    depts.forEach(d => { data.departments.push(d); deptIds.add(d.dept_id); });
    addedUnis++; addedDepts += depts.length;
  } else if (j.uni_id) {                              // B) 既存大学に学部追加
    if (!uniIds.has(j.uni_id)) { errors.push(`${path.basename(file)}: 不明な uni_id (${j.uni_id})`); continue; }
    const depts = (j.departments || []).map(d => sanitizeDept(d, j.uni_id, path.basename(file))).filter(Boolean);
    depts.forEach(d => { data.departments.push(d); deptIds.add(d.dept_id); });
    addedDepts += depts.length;
  } else {
    errors.push(`${path.basename(file)}: uni / uni_id のどちらも無い`);
  }
}

if (errors.length) {
  console.error(`\nエラー ${errors.length}件（マージ中止・data_v2.json 未変更）:`);
  errors.slice(0, 60).forEach(e => console.error(' -', e));
  process.exit(1);
}

// 全体検収（check_v2 と同じルール）
const { errors: postErrors, stats } = validate(data);
if (postErrors.length) {
  console.error(`\ncheck_v2 検収エラー ${postErrors.length}件（マージ中止）:`);
  postErrors.slice(0, 60).forEach(e => console.error(' -', e));
  process.exit(1);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 1));
console.log(`\nマージ完了: 大学 +${addedUnis} → ${data.universities.length}校 / 学部 +${addedDepts} → ${stats.total}`);
console.log(`ステータス: verified=${stats.byStatus.verified} estimated=${stats.byStatus.estimated} unconfirmed=${stats.byStatus.unconfirmed}`);
if (warns.length) { console.log(`\n警告 ${warns.length}件:`); warns.slice(0, 30).forEach(w => console.log(' -', w)); if (warns.length > 30) console.log(` ... 他${warns.length - 30}件`); }
