#!/usr/bin/env node
// v1 data_final.json（5カテゴリ）→ v2 2層構造（universities + departments）骨格変換
// 使い方: node to_v2.js  → data_v2.json / dept_manifest.json を生成
const fs = require('fs');
const path = require('path');

// 学部名→スラッグ（頻出のみ。無ければ d01, d02... フォールバック）
const SLUG_MAP = {
  '文学部': 'bungaku', '人文学部': 'jinbun', '人間学部': 'ningen', '人間科学部': 'ningenkagaku',
  '経済学部': 'keizai', '経営学部': 'keiei', '商学部': 'sho', '経済経営学部': 'keizaikeiei',
  '法学部': 'ho', '政策科学部': 'seisaku', '総合政策学部': 'sogoseisaku', '政治経済学部': 'seikei',
  '社会学部': 'shakai', '社会科学部': 'shakaikagaku', '現代社会学部': 'gendaishakai',
  '国際学部': 'kokusai', '国際関係学部': 'kokusaikankei', '外国語学部': 'gaikokugo', '国際教養学部': 'kokusaikyoyo',
  '教育学部': 'kyoiku', '教育学域': 'kyoiku', '発達教育学部': 'hattatsukyoiku', 'こども教育学部': 'kodomokyoiku',
  '理学部': 'ri', '工学部': 'ko', '理工学部': 'riko', '基礎工学部': 'kisoko', '先進工学部': 'senshinko',
  '情報学部': 'joho', '情報理工学部': 'johoriko', 'データサイエンス学部': 'datascience', '総合情報学部': 'sogojoho',
  '建築学部': 'kenchiku', 'デザイン工学部': 'designko',
  '農学部': 'no', '生命科学部': 'seimei', '生命環境学部': 'seimeikankyou', '環境学部': 'kankyo',
  '医学部': 'i', '歯学部': 'shi', '薬学部': 'yaku', '看護学部': 'kango', '保健医療学部': 'hokeniryo',
  'リハビリテーション学部': 'reha', '健康科学部': 'kenkokagaku',
  '栄養学部': 'eiyo', '家政学部': 'kasei', '生活科学部': 'seikatsukagaku', '食物栄養科学部': 'shokumotsueiyo',
  'スポーツ健康科学部': 'sportskenko', 'スポーツ科学部': 'sportskagaku', '体育学部': 'taiiku', '健康スポーツ科学部': 'kenkosports',
  '芸術学部': 'geijutsu', '音楽学部': 'ongaku', '文芸学部': 'bungei',
  '心理学部': 'shinri', '総合心理学部': 'sogoshinri', '福祉学部': 'fukushi', '社会福祉学部': 'shakaifukushi',
  '産業社会学部': 'sanshakai', '観光学部': 'kanko', 'グローバル地域文化学部': 'globalchiiki',
};

function slugify(deptName, used) {
  // 「経済学部 経済学科」のような複合名は最初の空白より前でSLUG_MAPを照合
  const lookupKey = deptName.split(/[\s　]/)[0];
  let base = SLUG_MAP[lookupKey];
  if (!base) {
    // フォールバック: d01, d02...（この大学内で未使用の最小番号）
    let i = 1;
    while (used.has('d' + String(i).padStart(2, '0'))) i++;
    base = 'd' + String(i).padStart(2, '0');
    used.add(base);
    return base;
  }
  if (!used.has(base)) { used.add(base); return base; }
  let n = 2;
  while (used.has(base + n)) n++;
  used.add(base + n);
  return base + n;
}

function autoTags(deptName, tagsDef) {
  // dept_keywords_exclude: 部分一致の誤爆防止（例:「心理学部」⊃「理学部」、「療法学科」⊃「法学」）
  const tags = tagsDef.interest
    .filter(t => !(t.dept_keywords_exclude || []).some(k => deptName.includes(k)))
    .filter(t => t.dept_keywords.some(k => deptName.includes(k)))
    .map(t => t.id);
  return tags.length ? tags : ['unclassified'];
}

// catAvail: { sogo: bool, koubo: bool, kokkoritsu: bool }（大学単位カテゴリの有無から初期値を推定）
function buildDepartments(ippanUni, catAvail, tagsDef) {
  const used = new Set();
  return (ippanUni.departments || []).map(d => {
    const slug = slugify(d.name, used);
    return {
      dept_id: `${ippanUni.id}-${slug}`,
      uni_id: ippanUni.id,
      name: d.name,
      campus: d.campus ?? null,
      hensachi: {
        min: d.hensachi_min ?? null,
        max: d.hensachi_max ?? null,
        basis: 'kawai',
        source_url: null,
        verified_date: null,
      },
      bairitsu: { ippan: {}, source_url: null, verified_date: null },
      entry_methods: [
        { type: 'sogo',   available: catAvail.sogo,        note: null, verified: false },
        { type: 'koubo',  available: catAvail.koubo,       note: null, verified: false },
        { type: 'ippan',  available: true,                 note: null, verified: false },
        { type: 'kyotsu', available: catAvail.kokkoritsu ? true : null, note: catAvail.kokkoritsu ? null : '共テ利用の有無は要調査', verified: false },
      ],
      qualifications: d.qualifications || [],
      interest_tags: autoTags(d.name, tagsDef),
      employment_fields: [],
      zemi: [],
      data_status: 'estimated',
    };
  });
}

function buildUniversity(baseUni, empUni, entryMethodDetails) {
  const u = { ...baseUni };
  delete u.departments; // 学部は第2層へ
  u.employment = empUni
    ? { ratings: empUni.ratings, strengths: empUni.strengths, representative_employers: empUni.representative_employers, summary: empUni.summary, notes: empUni.notes ?? null }
    : null;
  u.entry_method_details = entryMethodDetails; // v1の大学単位入試詳細（評定基準等）を温存
  return u;
}

function main() {
  const WORK = __dirname;
  const data = JSON.parse(fs.readFileSync(path.join(WORK, 'data_final.json'), 'utf8'));
  const tagsDef = JSON.parse(fs.readFileSync(path.join(WORK, 'tags_def.json'), 'utf8'));

  const byId = (cat) => Object.fromEntries((data[cat].universities || []).map(u => [u.id, u]));
  const sogoBy = byId('sogo'), kouboBy = byId('koubo'), ippanBy = byId('ippan'), empBy = byId('employment');

  const universities = [];
  const departments = [];
  for (const baseUni of data.base.universities) {
    const id = baseUni.id;
    const detail = {
      sogo: sogoBy[id]?.entry_methods || [],
      koubo: kouboBy[id]?.entry_methods || [],
      ippan: ippanBy[id]?.entry_methods || [],
    };
    universities.push(buildUniversity(baseUni, empBy[id] || null, detail));
    const catAvail = {
      sogo: (detail.sogo.length > 0),
      koubo: (detail.koubo.length > 0),
      kokkoritsu: (baseUni.type || '').includes('国立') || (baseUni.type || '').includes('公立'),
    };
    if (ippanBy[id]) {
      departments.push(...buildDepartments(ippanBy[id], catAvail, tagsDef));
    } else {
      console.warn(`WARN: ippanエントリなし（学部0件で出力されます）: ${id} (${baseUni.name})`);
    }
  }

  const out = {
    schema: 'shinro-general-v2',
    updated: new Date().toISOString().slice(0, 10),
    regions: data.base.regions,
    tags: tagsDef,
    universities,
    departments,
  };
  fs.writeFileSync(path.join(WORK, 'data_v2.json'), JSON.stringify(out, null, 1), 'utf8');

  const uniNameById = new Map(universities.map(u => [u.id, u.name]));
  const manifest = departments.map(d => ({ dept_id: d.dept_id, uni_id: d.uni_id, uni_name: uniNameById.get(d.uni_id), dept_name: d.name }));
  fs.writeFileSync(path.join(WORK, 'dept_manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');

  console.log(`universities: ${universities.length} / departments: ${departments.length}`);
  console.log('wrote data_v2.json, dept_manifest.json');
}

module.exports = { slugify, autoTags, buildDepartments, buildUniversity };
if (require.main === module) main();
