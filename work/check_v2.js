#!/usr/bin/env node
// data_v2.json の検収チェック。使い方: node check_v2.js
const fs = require('fs');
const path = require('path');

const REQUIRED = ['dept_id', 'uni_id', 'name', 'campus', 'hensachi', 'bairitsu', 'entry_methods', 'qualifications', 'interest_tags', 'employment_fields', 'zemi', 'data_status'];
const STATUSES = ['verified', 'estimated', 'unconfirmed'];

function validate(data) {
  const errors = [];
  const uniIds = new Set(data.universities.map(u => u.id));
  const seen = new Set();
  const byStatus = { verified: 0, estimated: 0, unconfirmed: 0 };
  let zemiCount = 0;

  for (const d of data.departments) {
    const label = d.dept_id || d.name || '(不明)';
    for (const f of REQUIRED) {
      if (!(f in d)) errors.push(`${label}: 必須フィールド ${f} がない`);
    }
    if (seen.has(d.dept_id)) errors.push(`${d.dept_id}: dept_id重複`);
    seen.add(d.dept_id);
    if (!uniIds.has(d.uni_id)) errors.push(`${label}: 存在しない大学を参照 (${d.uni_id})`);
    if (!STATUSES.includes(d.data_status)) errors.push(`${label}: data_status が不正 (${d.data_status})`);
    else byStatus[d.data_status]++;
    if (d.data_status === 'verified') {
      if (!d.hensachi?.source_url || !d.hensachi?.verified_date) {
        errors.push(`${label}: verified なのに hensachi の source_url / verified_date がない`);
      }
    }
    // 出典と検証日は必ずペア
    for (const [fname, obj] of [['hensachi', d.hensachi], ['bairitsu', d.bairitsu]]) {
      if (obj && ((obj.source_url && !obj.verified_date) || (!obj.source_url && obj.verified_date))) {
        errors.push(`${label}: ${fname} の source_url と verified_date がペアになっていない`);
      }
    }
    for (const z of d.zemi || []) {
      if (!z.name || !z.source_url || !z.verified_date) errors.push(`${label}: zemi に name/source_url/verified_date が欠落`);
    }
    if ((d.zemi || []).length > 0) zemiCount++;
    if ((d.zemi || []).length > 3) errors.push(`${label}: zemi が3件を超えている`);
  }
  const total = data.departments.length;
  return { errors, stats: { total, byStatus, zemiCount, zemiCoverage: total ? zemiCount / total : 0 } };
}

function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data_v2.json'), 'utf8'));
  const { errors, stats } = validate(data);
  console.log(`学部総数: ${stats.total}`);
  console.log(`ステータス: verified=${stats.byStatus.verified} estimated=${stats.byStatus.estimated} unconfirmed=${stats.byStatus.unconfirmed}`);
  console.log(`ゼミカバー率: ${(stats.zemiCoverage * 100).toFixed(1)}% (${stats.zemiCount}/${stats.total})`);
  if (errors.length) {
    console.error(`\nエラー ${errors.length}件:`);
    for (const e of errors.slice(0, 50)) console.error(' -', e);
    if (errors.length > 50) console.error(` ... 他${errors.length - 50}件`);
    process.exit(1);
  }
  console.log('\nCHECK PASS');
}

module.exports = { validate };
if (require.main === module) main();
