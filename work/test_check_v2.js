// work/test_check_v2.js — node test_check_v2.js で実行
const assert = require('assert');
const { validate } = require('./check_v2.js');

function makeDept(over = {}) {
  return {
    dept_id: 'u1-keiei', uni_id: 'u1', name: '経営学部', campus: 'C',
    hensachi: { min: 50, max: 55, basis: 'kawai', source_url: null, verified_date: null },
    bairitsu: { ippan: {}, source_url: null, verified_date: null },
    entry_methods: [{ type: 'ippan', available: true, note: null, verified: false }],
    qualifications: [], interest_tags: ['keizai'], employment_fields: [], zemi: [],
    data_status: 'estimated',
    ...over,
  };
}
const baseData = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };

// 正常系: エラーなし
{
  const r = validate(baseData);
  assert.deepStrictEqual(r.errors, []);
  assert.strictEqual(r.stats.total, 1);
  assert.strictEqual(r.stats.byStatus.estimated, 1);
  assert.strictEqual(r.stats.campusMissing, 0);
}
// campus:null はエラーにしないが統計に出す
{
  const r = validate({ ...baseData, departments: [makeDept({ campus: null })] });
  assert.deepStrictEqual(r.errors, []);
  assert.strictEqual(r.stats.campusMissing, 1);
}
// dept_id重複
{
  const r = validate({ ...baseData, departments: [makeDept(), makeDept()] });
  assert.ok(r.errors.some(e => e.includes('重複')));
}
// uni_id参照切れ
{
  const r = validate({ ...baseData, departments: [makeDept({ uni_id: 'nai' , dept_id: 'nai-x'})] });
  assert.ok(r.errors.some(e => e.includes('存在しない大学')));
}
// verifiedなのに出典なし
{
  const r = validate({ ...baseData, departments: [makeDept({ data_status: 'verified' })] });
  assert.ok(r.errors.some(e => e.includes('source_url')));
}
// verified + 出典あり → OK、ゼミカバー率
{
  const d = makeDept({
    data_status: 'verified',
    hensachi: { min: 50, max: 55, basis: 'kawai', source_url: 'https://x', verified_date: '2026-07-14' },
    zemi: [{ name: 'テストゼミ', theme: 't', source_url: 'https://x', verified_date: '2026-07-14' }],
  });
  const r = validate({ ...baseData, departments: [d] });
  assert.deepStrictEqual(r.errors, []);
  assert.strictEqual(r.stats.zemiCoverage, 1);
}
// 不正ステータス
{
  const r = validate({ ...baseData, departments: [makeDept({ data_status: '要確認' })] });
  assert.ok(r.errors.some(e => e.includes('data_status')));
}
// 必須フィールド欠落
{
  const d = makeDept();
  delete d.zemi;
  const r = validate({ ...baseData, departments: [d] });
  assert.ok(r.errors.some(e => e.includes('zemi がない')));
}
// hensachi の source_url/verified_date 片方のみ → ペア違反
{
  const d = makeDept({ hensachi: { min: 50, max: 55, basis: 'kawai', source_url: 'https://x', verified_date: null } });
  const r = validate({ ...baseData, departments: [d] });
  assert.ok(r.errors.some(e => e.includes('ペア')));
}
{
  const d = makeDept({ hensachi: { min: 50, max: 55, basis: 'kawai', source_url: null, verified_date: '2026-07-14' } });
  const r = validate({ ...baseData, departments: [d] });
  assert.ok(r.errors.some(e => e.includes('ペア')));
}
// zemi 要素の source_url 欠落
{
  const d = makeDept({ zemi: [{ name: 'ゼミ', theme: 't', source_url: null, verified_date: '2026-07-14' }] });
  const r = validate({ ...baseData, departments: [d] });
  assert.ok(r.errors.some(e => e.includes('zemi に name/source_url/verified_date が欠落')));
}
// zemi 3件ちょうどはOK / 4件は超過エラー
{
  const z = i => ({ name: `ゼミ${i}`, theme: 't', source_url: 'https://x', verified_date: '2026-07-14' });
  const r3 = validate({ ...baseData, departments: [makeDept({ zemi: [z(1), z(2), z(3)] })] });
  assert.deepStrictEqual(r3.errors, []);
  const r4 = validate({ ...baseData, departments: [makeDept({ zemi: [z(1), z(2), z(3), z(4)] })] });
  assert.ok(r4.errors.some(e => e.includes('3件を超えている')));
}
// 不正な入力形状でもクラッシュしない
{
  const r = validate({});
  assert.ok(r.errors.some(e => e.includes('データ形状が不正')));
  assert.strictEqual(r.stats.total, 0);
}
console.log('ALL OK');
