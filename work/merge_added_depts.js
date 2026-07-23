// add-missing-depts ワークフローの確定レコードを data_v2.json にマージする
// 入力: docs/superpowers/_add_depts.json（{confirmedRecords:[{uni_id,rec,...}]}）
// 実行: node work/merge_added_depts.js
// ガード: ID衝突/不明uni/不正タグ/偏差値値域/entry_methods不備 は例外で停止
const fs = require('fs');
const path = require('path');
const P = path.join(__dirname, 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const input = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'superpowers', '_add_depts.json'), 'utf8'));

const uniIds = new Set(d.universities.map((u) => u.id));
const deptIds = new Set(d.departments.map((x) => x.dept_id));
const IT = new Set(d.tags.interest.map((t) => t.id));
const ET = new Set(d.tags.employment.map((t) => t.id));
const TYPES = ['sogo', 'koubo', 'ippan', 'kyotsu'];

let added = 0;
for (const { uni_id, rec } of input.confirmedRecords) {
  if (!uniIds.has(uni_id)) throw new Error('不明uni: ' + uni_id);
  if (deptIds.has(rec.dept_id)) throw new Error('dept_id衝突: ' + rec.dept_id);
  const h = rec.hensachi || {};
  if (!(h.min >= 30 && h.max <= 80 && h.min <= h.max)) throw new Error('偏差値異常 ' + rec.dept_id + ': ' + h.min + '-' + h.max);
  const badIt = (rec.interest_tags || []).filter((t) => !IT.has(t));
  if (badIt.length) throw new Error('不正interest_tag ' + rec.dept_id + ': ' + badIt.join(','));
  const badEt = (rec.employment_fields || []).filter((t) => !ET.has(t));
  if (badEt.length) throw new Error('不正employment_field ' + rec.dept_id + ': ' + badEt.join(','));
  const emTypes = (rec.entry_methods || []).map((m) => m.type).sort().join(',');
  if (emTypes !== TYPES.slice().sort().join(',')) throw new Error('entry_methods不備 ' + rec.dept_id + ': ' + emTypes);

  d.departments.push({
    dept_id: rec.dept_id,
    uni_id,
    name: rec.name,
    campus: rec.campus || null,
    hensachi: {
      min: h.min, max: h.max,
      basis: h.basis || '推定',
      source_url: h.source_url || null,
      verified_date: h.source_url ? new Date().toISOString().slice(0, 10) : null,
    },
    bairitsu: { ippan: {} },
    entry_methods: rec.entry_methods.map((m) => ({ type: m.type, available: m.available, note: m.note || null, verified: !!m.verified })),
    qualifications: rec.qualifications || [],
    interest_tags: rec.interest_tags || [],
    employment_fields: rec.employment_fields || [],
    zemi: [],
    data_status: 'estimated',
  });
  deptIds.add(rec.dept_id);
  added++;
  console.log('add ' + rec.dept_id + ' 「' + rec.name + '」 ' + h.min + '-' + h.max + (h.source_url ? ' (出典あり)' : ''));
}

fs.writeFileSync(P, JSON.stringify(d));
console.log('\n追加 ' + added + '件 → 学部総数 ' + d.departments.length);
