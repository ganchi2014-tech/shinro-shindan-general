// guide_v2 のテスト（node work/test_guide_v2.js）
const assert = require('assert');
const G = require('./guide_v2.js');
const d = require('./data_v2.json');
const rm = require('./interest_riasec_map.json').map;
const U = Object.fromEntries(d.universities.map((u) => [u.id, u]));
const byName = (n) => d.universities.find((u) => u.name === n);
const deptsOf = (n) => d.departments.filter((x) => x.uni_id === byName(n).id);

// --- 資格 ---
const kango = d.departments.filter((x) => G.deptHasQual(x, 'kango'));
assert(kango.length >= 60, '看護師の資格が取れる学部が60以上: ' + kango.length);
assert(!kango.some((x) => /薬学部/.test(x.name) && !/看護/.test(x.name)), '薬学部が看護師に混ざらない');
const ishi = d.departments.filter((x) => G.deptHasQual(x, 'ishi'));
assert(ishi.length > 0 && !ishi.some((x) => /獣医|歯学/.test(x.name) && !/医学/.test(x.name)), '医師に獣医・歯科が混ざらない');
assert.deepStrictEqual(G.qualCareers(new Set(['kango', 'kigyō_ippan', 'kyoin'])), ['kango'], '資格が決め手の仕事だけ残る');
assert.strictEqual(G.deptHasQual({ qualifications: '看護師、保健師' }, 'kango'), true, '資格欄が文字列でも判定できる');
assert.strictEqual(G.deptHasQual({ qualifications: null }, 'kango'), false);
assert.deepStrictEqual(G.matchedQualLabels({ qualifications: ['看護師国家試験受験資格', '保健師'] }, ['kango', 'hokenshi', 'yakuzai']), ['看護師', '保健師・助産師']);

// --- 学ぶ内容で寄せる仕事・学部を問わない仕事 ---
const fm = (id) => d.departments.filter((x) => G.deptMatchesField(x, id));
const names = (id) => fm(id).map((x) => x.name).join('｜');
assert(!/体育学部/.test(names('hōsō')) && /法学部/.test(names('hōsō')), '弁護士に体育学部が出ない');
assert(!/療法/.test(names('hōsō')), '弁護士に理学療法が混ざらない（「法」の誤一致）');
assert(!/薬学部|医学部（/.test(names('shinri')) && /心理/.test(names('shinri')), '心理に薬学部・医学部が出ない');
assert(/デザイン/.test(names('design')) && !/^文学部$/m.test(fm('design').map((x) => x.name).join('\n')), 'デザイナーに文学部が出ない');
for (const id of Object.keys(G.FIELD_RULES)) { const n = fm(id).length; assert(n >= 15 && n <= 260, `${id} の該当学部数が極端: ${n}`); }
assert.deepStrictEqual(G.fieldCareers(['design', 'kango', 'keisatsu']), ['design']);
assert.deepStrictEqual(G.openCareers(['design', 'kango', 'keisatsu', 'kyoin']), ['keisatsu', 'kyoin']);
assert.deepStrictEqual(G.strongOpenJobs({ employment: { ratings: { keisatsu: 4, kōmuin_ippan: 2 } } }, ['keisatsu', 'kōmuin_ippan']), ['keisatsu']);
assert.deepStrictEqual(G.strongOpenJobs({}, ['keisatsu']), []);

// --- 大学以外の道 ---
assert.strictEqual(G.pathwayOf('jūdōseifuku').route, 'senmon');
assert.strictEqual(G.pathwayOf('yakuzai').route, 'daigaku');
assert.strictEqual(G.pathwayOf('keisatsu').route, 'kosotsu');
assert.strictEqual(G.pathwayOf('kigyō_ippan'), null);

// --- 通学 ---
const tachibana = byName('京都橘大学');
const fromOtsu = G.commuteMin(tachibana, null, 'otsu');
const fromNagahama = G.commuteMin(tachibana, null, 'nagahama');
assert(fromNagahama - fromOtsu === 56, '長浜は大津より56分遠い（京都方面）: ' + fromOtsu + '/' + fromNagahama);
assert.strictEqual(G.commuteMin(tachibana, null, null), tachibana.access_from_shiga_min, '出発駅なしは既存値');
const asahi = byName('朝日大学');
assert(G.commuteMin(asahi, null, 'hikone') < G.commuteMin(asahi, null, 'otsu'), '岐阜方面は彦根の方が近い');
// 立命館: 学部でキャンパスが違う
const rits = deptsOf('立命館大学');
const bkc = rits.find((x) => /BKC/.test(x.campus)), oic = rits.find((x) => /OIC/.test(x.campus)), kinu = rits.find((x) => /衣笠/.test(x.campus));
assert(G.commuteMin(byName('立命館大学'), bkc, 'kusatsu') < 30, 'BKCは草津から近い');
assert(G.commuteMin(byName('立命館大学'), oic, 'kusatsu') === 50, 'OICは草津から京都20+30');
assert(G.commuteMin(byName('立命館大学'), kinu, 'kusatsu') === 65);
// 県内
assert(G.commuteMin(byName('長浜バイオ大学'), null, 'nagahama') <= 10);
assert(G.commuteMin(byName('長浜バイオ大学'), null, 'otsu') >= 50);
assert(G.commuteMin(byName('びわこ成蹊スポーツ大学'), null, 'katata') === 17);
// 関東は通学の対象外
assert.strictEqual(G.commuteMin(d.universities.find((u) => u.region === 'kanto'), null, 'otsu'), null);
// どの出発駅でも、通学対象の大学は正の数になる
for (const o of G.ORIGINS) for (const x of d.departments) {
  const m = G.commuteMin(U[x.uni_id], x, o.id);
  assert(m === null || (Number.isFinite(m) && m > 0), `通学時間が不正: ${U[x.uni_id].name} ${o.id} ${m}`);
}
assert.strictEqual(G.commuteBucket(85, 90), 'in');
assert.strictEqual(G.commuteBucket(100, 90), 'near');
assert.strictEqual(G.commuteBucket(111, 90), 'far');
assert.strictEqual(G.commuteBucket(null, 90), 'far');
assert.strictEqual(G.commuteBucket(999, null), 'in');

// --- 向いていそうな分野 ---
const tf = G.topFields({ R: 0, I: 0.2, A: 0, S: 1, E: 0.2, C: 0.2 }, rm, d.tags.interest, 3);
assert.strictEqual(tf.fields.length, 3);
assert.strictEqual(tf.fields[0].id, 'kyoiku', '人を助けるが高い人は教育が1位: ' + tf.fields.map((x) => x.id));
assert(tf.mine[0].includes('人に教える'), 'あなたの答えの1位');
assert(tf.fields[0].overlap.some((x) => x.includes('人に教える')), '重なる点が出る');
const tf2 = G.topFields({ R: 1, I: 1, A: 0, S: 0, E: 0, C: 0.3 }, rm, d.tags.interest, 3);
assert(['riko', 'nogaku'].includes(tf2.fields[0].id), '作る＋調べるが高い人は理工か農: ' + tf2.fields.map((x) => x.id));
assert.deepStrictEqual(G.topFields({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }, rm, d.tags.interest, 3).mine, [], '全部あてはまらないなら根拠なし');

console.log('guide_v2: ALL OK');
