// work/test_merge_research.js — node test_merge_research.js で実行
const assert = require('assert');
const { mergeUni } = require('./merge_research.js');

function makeDept(over = {}) {
  return {
    dept_id: 'u1-keiei', uni_id: 'u1', name: '経営学部', campus: 'C',
    hensachi: { min: 50, max: 55, basis: 'kawai', source_url: null, verified_date: null },
    bairitsu: { ippan: {}, source_url: null, verified_date: null },
    entry_methods: [
      { type: 'ippan', available: true, note: null, verified: false },
      { type: 'kyotsu', available: null, note: '共テ利用の有無は要調査', verified: false },
    ],
    qualifications: ['簿記'], interest_tags: ['keizai'], employment_fields: [], zemi: [],
    data_status: 'estimated',
    ...over,
  };
}

// 正常マージ: 偏差値更新→verified化、差分記録、ゼミ・共テ反映
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const research = {
    uni_id: 'u1', researched_date: '2026-07-14',
    departments: [{
      dept_id: 'u1-keiei',
      hensachi: { min: 52.5, max: 55, source_url: 'https://kei-net.example' },
      bairitsu: { ippan: { '2026': 3.2 }, source_url: 'https://uni.example' },
      entry_methods: [{ type: 'kyotsu', available: true, note: '共テ利用あり' }],
      employment_fields: ['kinyu'],
      zemi: [{ name: 'Aゼミ', theme: 'マーケティング', source_url: 'https://uni.example/zemi' }],
    }],
  };
  const diffs = mergeUni(data, research);
  const d = data.departments[0];
  assert.strictEqual(d.hensachi.min, 52.5);
  assert.strictEqual(d.hensachi.verified_date, '2026-07-14');
  assert.strictEqual(d.data_status, 'verified');
  assert.strictEqual(d.bairitsu.ippan['2026'], 3.2);
  const ky = d.entry_methods.find(m => m.type === 'kyotsu');
  assert.strictEqual(ky.available, true);
  assert.strictEqual(ky.verified, true);
  assert.strictEqual(d.zemi.length, 1);
  assert.strictEqual(d.zemi[0].verified_date, '2026-07-14');
  assert.deepStrictEqual(d.employment_fields, ['kinyu']);
  assert.strictEqual(d.qualifications[0], '簿記'); // 未提供フィールドは不変
  assert.ok(diffs.some(x => x.field === 'hensachi.min' && x.old === 50 && x.new === 52.5));
}
// unconfirmed指定: 上書きしてもステータスはunconfirmed
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const research = {
    uni_id: 'u1', researched_date: '2026-07-14',
    departments: [{ dept_id: 'u1-keiei', unconfirmed: true }],
  };
  mergeUni(data, research);
  assert.strictEqual(data.departments[0].data_status, 'unconfirmed');
}
// 不明なdept_id → throw
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const research = { uni_id: 'u1', researched_date: '2026-07-14', departments: [{ dept_id: 'u1-nai' }] };
  assert.throws(() => mergeUni(data, research), /u1-nai/);
}
// ゼミ4件以上 → throw
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const z = { name: 'x', theme: 't', source_url: 'https://x' };
  const research = { uni_id: 'u1', researched_date: '2026-07-14', departments: [{ dept_id: 'u1-keiei', zemi: [z, z, z, z] }] };
  assert.throws(() => mergeUni(data, research), /3件/);
}
// uni_id不一致のdept_id混入 → throw（他大学の学部を書き換えない）
{
  const data = {
    universities: [{ id: 'u1', name: 'テスト大学' }, { id: 'u2', name: '別大学' }],
    departments: [makeDept(), makeDept({ dept_id: 'u2-hoka', uni_id: 'u2' })],
  };
  const research = { uni_id: 'u1', researched_date: '2026-07-14', departments: [{ dept_id: 'u2-hoka' }] };
  assert.throws(() => mergeUni(data, research), /学部ではない/);
}
// entry_methods available省略（noteのみ）→ 既存available保持・キー存在・verifiedはfalseのまま
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const research = {
    uni_id: 'u1', researched_date: '2026-07-14',
    departments: [{ dept_id: 'u1-keiei', entry_methods: [{ type: 'kyotsu', note: '要確認のまま' }] }],
  };
  mergeUni(data, research);
  const ky = data.departments[0].entry_methods.find(m => m.type === 'kyotsu');
  assert.ok('available' in ky); // キーが消えていない
  assert.strictEqual(ky.available, null); // 既存値を保持
  assert.strictEqual(ky.verified, false); // 未確認のままverified化しない
  assert.strictEqual(ky.note, '要確認のまま');
}
// 不明な entry_method type → throw
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const research = {
    uni_id: 'u1', researched_date: '2026-07-14',
    departments: [{ dept_id: 'u1-keiei', entry_methods: [{ type: 'sonzai-shinai', available: true }] }],
  };
  assert.throws(() => mergeUni(data, research), /entry_method type/);
}
// bairitsu 既存 {'2025':4.0} に {'2026':3.2} をマージ → 両年度残存
{
  const dept = makeDept();
  dept.bairitsu.ippan = { '2025': 4.0 };
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [dept] };
  const research = {
    uni_id: 'u1', researched_date: '2026-07-14',
    departments: [{ dept_id: 'u1-keiei', bairitsu: { ippan: { '2026': 3.2 } } }],
  };
  mergeUni(data, research);
  assert.strictEqual(data.departments[0].bairitsu.ippan['2025'], 4.0);
  assert.strictEqual(data.departments[0].bairitsu.ippan['2026'], 3.2);
}
// source_url 更新が diffs に現れる
{
  const data = { universities: [{ id: 'u1', name: 'テスト大学' }], departments: [makeDept()] };
  const research = {
    uni_id: 'u1', researched_date: '2026-07-14',
    departments: [{ dept_id: 'u1-keiei', hensachi: { source_url: 'https://kei-net.example' } }],
  };
  const diffs = mergeUni(data, research);
  assert.ok(diffs.some(x => x.field === 'hensachi.source_url' && x.new === 'https://kei-net.example'));
  assert.ok(diffs.some(x => x.field === 'hensachi.verified_date' && x.new === '2026-07-14'));
}
console.log('ALL OK');
