const assert = require('assert');
const { aggregateByUni, aggregateZone } = require('./agg_v2.js');

// 同一大学の複数学部が代表学部（最大fit）で1件に集約される
const zoneItems = [
  { uni_id: 'A', uni_name: '大学A', dept_id: 'A-1', dept_name: '経営', fitScore: 40, hensachi: { min: 50, max: 52, mid: 51 }, reasons: ['r1'], zone: 'match' },
  { uni_id: 'A', uni_name: '大学A', dept_id: 'A-2', dept_name: '経済', fitScore: 60, hensachi: { min: 53, max: 55, mid: 54 }, reasons: ['r2'], zone: 'match' },
  { uni_id: 'B', uni_name: '大学B', dept_id: 'B-1', dept_name: '法', fitScore: 55, hensachi: { min: 48, max: 49, mid: 48.5 }, reasons: ['r3'], zone: 'match' },
];
const agg = aggregateZone(zoneItems);
assert.strictEqual(agg.length, 2, '2大学に集約');
// 代表fit降順: A(60) が先頭
assert.strictEqual(agg[0].uni_id, 'A');
assert.strictEqual(agg[0].repDept.dept_id, 'A-2', '最大fitの学部が代表');
assert.strictEqual(agg[0].fitScore, 60);
assert.strictEqual(agg[0].deptCount, 2, 'そのゾーンの学部数');
assert.strictEqual(agg[1].uni_id, 'B');

// ゾーンごとに集約される
const result = {
  zones: {
    challenge: [{ uni_id: 'C', uni_name: '大学C', dept_id: 'C-1', dept_name: '工', fitScore: 30, hensachi: { min: 58, max: 60, mid: 59 }, reasons: [], zone: 'challenge' }],
    match: zoneItems,
    safe: [],
  },
  ungrouped: [],
};
const byUni = aggregateByUni(result);
assert.strictEqual(byUni.challenge.length, 1);
assert.strictEqual(byUni.match.length, 2);
assert.strictEqual(byUni.safe.length, 0);
assert.strictEqual(byUni.ungrouped.length, 0);

// 大学が複数ゾーンに跨る場合、優先度 match>challenge>safe で1ゾーンにのみ出る（重複排除）
const spanResult = {
  zones: {
    challenge: [{ uni_id: 'X', uni_name: 'X大', dept_id: 'X-1', dept_name: 'a', fitScore: 20, hensachi: { min: 60, max: 60, mid: 60 }, reasons: [], zone: 'challenge' }],
    match: [{ uni_id: 'X', uni_name: 'X大', dept_id: 'X-2', dept_name: 'b', fitScore: 50, hensachi: { min: 52, max: 52, mid: 52 }, reasons: [], zone: 'match' }],
    safe: [{ uni_id: 'X', uni_name: 'X大', dept_id: 'X-3', dept_name: 'c', fitScore: 90, hensachi: { min: 45, max: 45, mid: 45 }, reasons: [], zone: 'safe' }],
  },
  ungrouped: [],
};
const sp = aggregateByUni(spanResult);
assert.strictEqual(sp.match.length, 1, 'X大はmatchに1件のみ');
assert.strictEqual(sp.match[0].uni_id, 'X');
assert.strictEqual(sp.match[0].repDept.dept_id, 'X-2', 'match内の学部が代表（safeのfit90は採らない）');
assert.strictEqual(sp.match[0].deptCount, 1, 'matchゾーン内の学部数=1');
assert.strictEqual(sp.challenge.length, 0, 'challengeに重複表示しない');
assert.strictEqual(sp.safe.length, 0, 'safeに重複表示しない');

console.log('agg_v2: all pass');

// 実データ結線: engine → aggregate
const engine = require('./engine_v2.js');
const bridge = require('./bridge_v2.js');
const data = require('./data_v2.json');
const riasecMap = require('./interest_riasec_map.json').map;
const prof = bridge.toUserProfile({
  workArea: 'kansai', commute: 'any', hensachi: 52, hensachiUnknown: false,
  examSource: 'kawai', interests: new Set(['keizai']), careers: new Set(['kinyū']), methods: new Set(['any']),
}, [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2]);
const r = engine.diagnose(prof, data, data.tags, riasecMap);
const uni = aggregateByUni(r);
const deptTotal = r.zones.challenge.length + r.zones.match.length + r.zones.safe.length;
const uniTotal = uni.challenge.length + uni.match.length + uni.safe.length;
assert.ok(uniTotal > 0, '大学集約が1件以上');
assert.ok(uniTotal <= deptTotal, '大学数<=学部数');
console.log('agg_v2 integration: pass (dept ' + deptTotal + ' -> uni ' + uniTotal + ')');
