// school_v2 の検査。数字は検査用の作りもの（実在の学校の数字ではない）
const assert = require('assert');
const S = require('./school_v2.js');
const p = { v: 1, n: 'テスト高校', t: '2026年度 2年・11月', x: 'shinken', r: 0.5, c: [{ l: '普通', m: 46, s: 8, k: 200 }, { l: '国際', m: 50, s: 9, k: 60 }] };
const link = S.encode(p);
assert(/^[A-Za-z0-9_-]+$/.test(link), 'リンクに使える文字だけ');
assert.deepStrictEqual(S.decode(link), p, '入れた数字がそのまま戻る（日本語の学校名も）');
assert.strictEqual(S.decode('こわれた文字'), null);
assert.strictEqual(S.decode(S.encode({ v: 1, n: 'x', x: 'shinken', r: 0.5, c: [{ l: 'a', m: 146, s: 8 }] })), null, '範囲外の平均は受けつけない');
assert.strictEqual(S.decode(S.encode({ v: 1, n: 'x', x: 'benesse', r: 0.5, c: [{ l: 'a', m: 46, s: 8 }] })), null, '知らない模試は受けつけない');
assert.strictEqual(S.decode(S.encode({ v: 2, n: 'x', x: 'kawai', r: 0.5, c: [{ l: 'a', m: 46, s: 8 }] })), null, '版が違えば受けつけない');
// 平均46・ばらつき8・つながり0.5・進研(-7) → 上 43.5 / まん中 39 / 下 34.5
assert.deepStrictEqual(S.buttons(p.c[0], 0.5, -7), { hi: 43.5, mid: 39, lo: 34.5 });
// つながりが0なら3つとも同じ（位置から何も分からない）、1ならばらつきの1.09倍ぶん開く
assert.deepStrictEqual(S.buttons(p.c[0], 0, 0), { hi: 46, mid: 46, lo: 46 });
assert.deepStrictEqual(S.buttons(p.c[0], 1, 0), { hi: 54.5, mid: 46, lo: 37.5 });
assert.strictEqual(S.spread(p.c[0], 0.5), 7, 'つながり0.5なら残るぶれは約±7（8×0.87）');
assert.strictEqual(S.spread(p.c[0], 1), 0);
console.log('school_v2: ALL OK');
