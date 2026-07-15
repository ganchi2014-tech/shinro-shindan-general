const assert = require('assert');
const { toUserProfile, mapSet, CAREER_MAP, INTEREST_MAP } = require('./bridge_v2.js');

// 興味の長音符が正規化される
assert.deepStrictEqual(mapSet(new Set(['iryō', 'rikō']), INTEREST_MAP).sort(), ['iryo', 'riko']);

// 職業が就職タグに集約される（重複除去）
assert.deepStrictEqual(mapSet(new Set(['ishi', 'kango']), CAREER_MAP), ['iryo_fukushi']);

// 関西エリア→5地域、any→フィルタなし
const p1 = toUserProfile({
  workArea: 'kansai', commute: 'any', hensachi: 52, hensachiUnknown: false,
  examSource: 'kawai', interests: new Set(['keizai']), careers: new Set(['kinyū']), methods: new Set(['any']),
}, []);
assert.deepStrictEqual(p1.regions, ['shiga', 'kyoto', 'osaka', 'hyogo', 'nara-wakayama']);
assert.strictEqual(p1.commuteOnly, false);
assert.deepStrictEqual(p1.careers, ['kinyu']);
assert.deepStrictEqual(p1.examMethods, []); // any は除外

// 偏差値未定→null / 通学厳しめ→commuteOnly / 方式変換
const p2 = toUserProfile({
  workArea: 'shiga', commute: 'jitaku', hensachi: 50, hensachiUnknown: true,
  examSource: 'shinken', interests: new Set(), careers: new Set(), methods: new Set(['sogo', 'kokkoritsu']),
}, [3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
assert.strictEqual(p2.hensachi, null);
assert.strictEqual(p2.commuteOnly, true);
assert.deepStrictEqual(p2.examMethods.sort(), ['kyotsu', 'sogo']);
assert.strictEqual(p2.riasecAnswers.length, 12);

console.log('bridge_v2: all pass');

// --- 統合: bridge出力を engine_v2.diagnose に流す ---
const engine = require('./engine_v2.js');
const data = require('./data_v2.json');
const riasecMap = require('./interest_riasec_map.json').map;
const prof = toUserProfile({
  workArea: 'kansai', commute: 'any', hensachi: 52, hensachiUnknown: false,
  examSource: 'kawai', interests: new Set(['keizai']), careers: new Set(['kinyū']), methods: new Set(['any']),
}, [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2]);
const r = engine.diagnose(prof, data, data.tags, riasecMap);
assert.ok(r.zones && Array.isArray(r.zones.match), 'zones.match is array');
const total = r.zones.challenge.length + r.zones.match.length + r.zones.safe.length;
assert.ok(total > 0, 'at least one department in zones');
console.log('bridge_v2 integration: pass (' + total + ' depts zoned)');
