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

console.log('ALL OK');
