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

// ---- deptRiasecVector / riasecFitScore ----
{
  const map = { keizai: { R: 0, I: 0.4, A: 0.1, S: 0.3, E: 0.8, C: 0.6 },
                joho:   { R: 0.4, I: 0.8, A: 0.2, S: 0.1, E: 0.3, C: 0.6 },
                unclassified: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } };
  const dv1 = E.deptRiasecVector({ interest_tags: ['keizai'] }, map);
  assert.strictEqual(dv1.E, 0.8);
  const dv2 = E.deptRiasecVector({ interest_tags: ['keizai', 'joho'] }, map);
  assert.ok(Math.abs(dv2.I - 0.6) < 1e-9, 'I avg 0.6: ' + dv2.I);
  const dv3 = E.deptRiasecVector({ interest_tags: [] }, map);
  assert.strictEqual(dv3.E, 0);
  const uv = { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 };
  const fit = E.riasecFitScore(uv, dv1);
  assert.ok(Math.abs(fit - 0.8 / 2.2) < 1e-9, 'riasecFit: ' + fit);
  assert.strictEqual(E.riasecFitScore(uv, dv3), 0);
}
// ---- computeFit ----
{
  const map = { keizai: { R: 0, I: 0.4, A: 0.1, S: 0.3, E: 0.8, C: 0.6 },
                unclassified: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } };
  const dept = {
    interest_tags: ['keizai'], employment_fields: ['kinyu', 'it'],
    entry_methods: [{ type: 'ippan', available: true }, { type: 'kyotsu', available: false }],
    zemi: [{ name: 'Aゼミ' }],
  };
  const uni = { prefecture: '滋賀県', commute_possible: true, tuition_yen_per_year: 1200000 };
  const ctx = {
    riasecProfile: { R: 0, I: 0, A: 0, S: 0, E: 1, C: 0 }, hollandCode: 'EC...',
    interests: new Set(['keizai']), careers: new Set(['kinyu']),
    examMethods: new Set(['ippan']), budgetMax: null, riasecMap: map,
  };
  const r = E.computeFit(dept, uni, ctx);
  assert.ok(r.fitScore > 50 && r.fitScore < 61, 'fitScore around 55: ' + r.fitScore);
  assert.strictEqual(r.breakdown.emp, 8);
  assert.ok(r.reasons.length > 0 && r.reasons.length <= 5);
  const r2 = E.computeFit(dept, uni, { ...ctx, budgetMax: 1000000 });
  assert.ok(r2.fitScore < r.fitScore, '予算超過で減点');
  const deptSogoOnly = { ...dept, entry_methods: [{ type: 'sogo', available: true }] };
  const r3 = E.computeFit(deptSogoOnly, uni, ctx);
  assert.ok(r3.breakdown.soft < r.breakdown.soft, '方式不一致で減点');
  const bad = E.computeFit(deptSogoOnly, { prefecture: '東京都', tuition_yen_per_year: 5000000 },
    { riasecProfile: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }, hollandCode: '',
      interests: new Set(), careers: new Set(), examMethods: new Set(['ippan']), budgetMax: 1000000, riasecMap: map });
  assert.ok(bad.fitScore >= 0, 'クランプ下限0: ' + bad.fitScore);
}

// ---- diagnose 統合（合成フィクスチャ）----
{
  const riasecMap = require('./interest_riasec_map.json').map;
  const universities = [
    { id: 'u1', name: '滋賀A大', region: 'shiga', prefecture: '滋賀県', commute_possible: true, tuition_yen_per_year: 1200000 },
    { id: 'u2', name: '関東B大', region: 'kanto', prefecture: '東京都', commute_possible: false, tuition_yen_per_year: 1300000 },
  ];
  const mkDept = (id, uni, tags, hmin, hmax, status = 'verified') => ({
    dept_id: id, uni_id: uni, name: id + '学部', campus: 'C', data_status: status,
    hensachi: { min: hmin, max: hmax }, bairitsu: { ippan: {} },
    entry_methods: [{ type: 'ippan', available: true }], interest_tags: tags,
    employment_fields: ['kinyu'], zemi: [],
  });
  const departments = [
    mkDept('u1-keizai', 'u1', ['keizai'], 50, 52),   // mid51 gap+1 → 実力(換算50)
    mkDept('u1-joho', 'u1', ['joho'], 55, 57),       // mid56 gap+6 → 挑戦
    mkDept('u1-kyoiku', 'u1', ['kyoiku'], 44, 46),   // mid45 gap-5 → 安全
    mkDept('u2-keizai', 'u2', ['keizai'], 50, 52),   // 関東 → 地域除外
    mkDept('u1-x', 'u1', ['keizai'], 65, 67, 'unconfirmed'), // unconfirmed除外
  ];
  const dataV2 = { universities, departments };
  const profile = {
    hensachi: 50, examSource: 'kawai', regions: ['shiga'], commuteOnly: false,
    riasecAnswers: [0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0], // I高E高
    interests: ['keizai'], careers: ['kinyu'], examMethods: ['ippan'], budgetMax: null,
  };
  const res = E.diagnose(profile, dataV2, null, riasecMap);
  assert.strictEqual(res.zones.match.length, 1);
  assert.strictEqual(res.zones.match[0].dept_id, 'u1-keizai');
  assert.strictEqual(res.zones.challenge[0].dept_id, 'u1-joho');
  assert.strictEqual(res.zones.safe[0].dept_id, 'u1-kyoiku');
  assert.strictEqual(res.excluded.byRegion, 1);
  assert.strictEqual(res.excluded.unconfirmed, 1);
  assert.strictEqual(res.meta.adjustedHensachi, 50);
  assert.ok(res.meta.hollandCode.length === 3);
  assert.strictEqual(res.meta.lowSignal, false);
  assert.ok(res.zones.match[0].fitScore > 0);
  const res2 = E.diagnose({ ...profile, hensachi: null }, dataV2, null, riasecMap);
  assert.strictEqual(res2.zones.challenge.length, 0);
  assert.ok(res2.ungrouped.length >= 3);
  const res3 = E.diagnose({ ...profile, riasecAnswers: [], interests: [] }, dataV2, null, riasecMap);
  assert.strictEqual(res3.meta.lowSignal, true);
}

console.log('ALL OK');
