// work/test_engine_v2.js — node test_engine_v2.js で実行
const assert = require('assert');
const E = require('./engine_v2.js');

// ---- computeRiasecProfile ----
{
  // R2問=3,3 / I2問=3,0 / 他0 → R=1.0, I=0.5, 他0。hollandCode先頭はR
  const ans = [3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const { profile, hollandCode, answered } = E.computeRiasecProfile(ans);
  assert.strictEqual(answered, true);
  assert.strictEqual(profile.R, 1.0);
  assert.ok(Math.abs(profile.I - 0.5) < 1e-9, 'I=0.5 expected: ' + profile.I);
  assert.strictEqual(profile.A, 0);
  assert.strictEqual(hollandCode[0], 'R');
  assert.strictEqual(hollandCode.length, 3);
}
{
  // 未回答 → 全0・answered=false
  const { profile, hollandCode, answered } = E.computeRiasecProfile([]);
  assert.strictEqual(answered, false);
  assert.strictEqual(hollandCode, '');
  assert.strictEqual(profile.S, 0);
}

// ---- adjustedHensachi ----
{
  assert.strictEqual(E.adjustedHensachi(55, 'kawai'), 55);
  assert.strictEqual(E.adjustedHensachi(55, 'shinken'), 48); // 進研は-7換算（v1準拠）
  assert.strictEqual(E.adjustedHensachi(55, 'sundai'), 60);  // 駿台は+5換算（v1準拠）
  assert.strictEqual(E.adjustedHensachi(null, 'kawai'), null);
  assert.strictEqual(E.adjustedHensachi(55, 'unknownsrc'), 55); // 未知キーは0オフセット
}
// ---- classifyZone ----
{
  const adj = 50;
  assert.strictEqual(E.classifyZone(52.5, adj), 'challenge'); // gap+2.5
  assert.strictEqual(E.classifyZone(60, adj), 'challenge');   // gap+10
  assert.strictEqual(E.classifyZone(52.4, adj), 'match');     // gap+2.4
  assert.strictEqual(E.classifyZone(47.5, adj), 'match');     // gap-2.5
  assert.strictEqual(E.classifyZone(47.4, adj), 'safe');      // gap-2.6
  assert.strictEqual(E.classifyZone(40, adj), 'safe');        // gap-10
  assert.strictEqual(E.classifyZone(60.1, adj), 'out');       // gap>+10
  assert.strictEqual(E.classifyZone(39.9, adj), 'out');       // gap<-10
  assert.strictEqual(E.classifyZone(55, null), 'ungrouped');  // 偏差値未入力
}

// ---- hardFilter ----
{
  const universities = [
    { id: 'ushiga', name: '滋賀大', region: 'shiga', commute_possible: true },
    { id: 'ukanto', name: '関東大', region: 'kanto', commute_possible: false },
  ];
  const departments = [
    { dept_id: 'ushiga-a', uni_id: 'ushiga', data_status: 'verified' },
    { dept_id: 'ushiga-b', uni_id: 'ushiga', data_status: 'unconfirmed' },
    { dept_id: 'ukanto-a', uni_id: 'ukanto', data_status: 'verified' },
  ];
  const r1 = E.hardFilter(departments, universities, { regions: ['shiga'] });
  assert.strictEqual(r1.passed.length, 1);
  assert.strictEqual(r1.passed[0].dept.dept_id, 'ushiga-a');
  assert.strictEqual(r1.excluded.byRegion, 1);
  assert.strictEqual(r1.excluded.unconfirmed, 1);
  const r2 = E.hardFilter(departments, universities, { regions: [] });
  assert.strictEqual(r2.passed.length, 2);
  assert.strictEqual(r2.excluded.byRegion, 0);
  const r3 = E.hardFilter(departments, universities, { regions: [], commuteOnly: true });
  assert.strictEqual(r3.passed.length, 1);
  assert.strictEqual(r3.passed[0].dept.dept_id, 'ushiga-a');
}

console.log('ALL OK');
