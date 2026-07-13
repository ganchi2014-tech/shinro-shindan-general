// work/test_to_v2.js — node test_to_v2.js で実行
const assert = require('assert');
const { slugify, autoTags, buildDepartments, buildUniversity } = require('./to_v2.js');

const tagsDef = require('./tags_def.json');

// --- slugify: マップにある学部名 ---
{
  const used = new Set();
  assert.strictEqual(slugify('経営学部', used), 'keiei');
  assert.strictEqual(slugify('経営学部', used), 'keiei2'); // 重複時は連番
}
// --- slugify: マップにない学部名はフォールバック連番 ---
{
  const used = new Set();
  assert.strictEqual(slugify('グローバル・コミュニケーション学部', used), 'd01');
  assert.strictEqual(slugify('未知の学部', used), 'd02');
}
// --- autoTags: キーワードマッチ ---
{
  const t1 = autoTags('経営学部', tagsDef);
  assert.ok(t1.includes('keizai'), 'keizai expected: ' + t1);
  const t2 = autoTags('謎学部', tagsDef);
  assert.deepStrictEqual(t2, ['unclassified']);
}
// --- buildDepartments: 1大学分の学部レコード生成 ---
{
  const ippanUni = {
    id: 'testuni', name: 'テスト大学',
    departments: [
      { name: '経営学部', campus: '本キャンパス', hensachi_min: 50, hensachi_max: 55, qualifications: ['簿記'] },
      { name: '経営学部', campus: '第2', hensachi_min: 45, hensachi_max: 47.5, qualifications: [] }
    ]
  };
  const catAvail = { sogo: true, koubo: false, kokkoritsu: false };
  const depts = buildDepartments(ippanUni, catAvail, tagsDef);
  assert.strictEqual(depts.length, 2);
  assert.strictEqual(depts[0].dept_id, 'testuni-keiei');
  assert.strictEqual(depts[1].dept_id, 'testuni-keiei2');
  assert.strictEqual(depts[0].hensachi.min, 50);
  assert.strictEqual(depts[0].hensachi.basis, 'kawai');
  assert.strictEqual(depts[0].hensachi.source_url, null);
  assert.strictEqual(depts[0].data_status, 'estimated');
  assert.deepStrictEqual(depts[0].zemi, []);
  const sogo = depts[0].entry_methods.find(m => m.type === 'sogo');
  const koubo = depts[0].entry_methods.find(m => m.type === 'koubo');
  assert.strictEqual(sogo.available, true);
  assert.strictEqual(koubo.available, false);
}
// --- buildUniversity: base+employment統合、departmentsは持たない ---
{
  const base = { id: 'testuni', name: 'テスト大学', type: '私立', region: 'shiga', zemi_features: 'ゼミ紹介文' };
  const emp = { id: 'testuni', ratings: { kyoin: 3 }, strengths: ['a'], representative_employers: ['X社'], summary: 's' };
  const detail = { sogo: [{ method_name: 'AO' }], koubo: [], ippan: [] };
  const u = buildUniversity(base, emp, detail);
  assert.strictEqual(u.id, 'testuni');
  assert.strictEqual(u.zemi_features, 'ゼミ紹介文');       // フォールバック用に残す
  assert.strictEqual(u.employment.summary, 's');
  assert.strictEqual(u.entry_method_details.sogo[0].method_name, 'AO');
  assert.strictEqual(u.departments, undefined);
}
// --- 実データ統合テスト: 誤タグ（心理→riko / 療法→hokei）が無いこと ---
{
  const data = require('./data_final.json');
  for (const uni of data.ippan.universities) {
    for (const d of (uni.departments || [])) {
      const tags = autoTags(d.name, tagsDef);
      if (d.name.includes('心理')) {
        assert.ok(!tags.includes('riko'), `riko誤付与: ${uni.id} ${d.name} → ${tags}`);
      }
      if (d.name.includes('療法')) {
        assert.ok(!tags.includes('hokei'), `hokei誤付与: ${uni.id} ${d.name} → ${tags}`);
      }
    }
  }
}
// --- slugify: 複合名（学部 学科）はSLUG_MAPに当たる ---
{
  assert.strictEqual(slugify('経済学部 経済学科', new Set()), 'keizai');
}
console.log('ALL OK');
