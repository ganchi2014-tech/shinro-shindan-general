// school_v2.js — 学校の数字（校内の模試の平均・ばらつき）で、偏差値の目安を学校に合わせる。
// 数字そのものはこのリポジトリに置かない。先生が作った配布リンクの後ろ（#s=…）に入れ、開いた端末が覚える。
//
// 使う所は2つだけ（2026-11-20 に先生・Claude・Museで決めた形）:
//   1) 何も入れない人の初期値 … 全国の平均50ではなく「校内の模試平均を河合の基準に直した値」
//   2) 目安ボタン … 「校内で上の方／まん中くらい／下の方」。値は 校内平均 ±（つながりの強さ r × 1.09 × ばらつき）
//      1.09 は、集団を3等分したときの上・下の群の平均の位置（平均から標準偏差の約1.09倍）。
//      校内での位置と模試の成績は別の物差しなので、つながりの強さ r（相関）で縮める。
// 使わない所: 評定から偏差値を出して段分けに使うこと（誤差が±8〜9で段の境±2.5より大きい）、「学年の上位○%」の表示。
//
// 配布リンクに入れる形（短い名前にしてリンクを短くする）:
//   { v:1, n:'学校名', t:'2026年度 2年・11月', x:'shinken'|'kawai'|'sundai', r:0.5,
//     c:[ { l:'コース名', m:校内平均, s:ばらつき（標準偏差）, k:人数 }, ... ] }
'use strict';
const TERCILE = 1.09;
const _b64 = {
  enc: (str) => (typeof Buffer !== 'undefined' ? Buffer.from(str, 'utf8').toString('base64')
    : btoa(String.fromCharCode.apply(null, Array.from(new TextEncoder().encode(str))))),
  dec: (b) => (typeof Buffer !== 'undefined' ? Buffer.from(b, 'base64').toString('utf8')
    : new TextDecoder().decode(Uint8Array.from(atob(b), (ch) => ch.charCodeAt(0)))),
};
function encode(obj) { return _b64.enc(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function decode(str) {
  try {
    const b = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
    return validate(JSON.parse(_b64.dec(b + '==='.slice((b.length + 3) % 4))));
  } catch (e) { return null; }
}
// 形と数字の範囲を確かめる。おかしければ null（その端末は一般版のまま動く）
function validate(o) {
  if (!o || o.v !== 1 || typeof o.n !== 'string' || !o.n.trim() || !Array.isArray(o.c) || !o.c.length || o.c.length > 12) return null;
  if (!['shinken', 'kawai', 'sundai'].includes(o.x)) return null;
  const r = Number(o.r);
  if (!(r >= 0 && r <= 1)) return null;
  const c = o.c.map((x) => ({ l: String((x && x.l) || '').slice(0, 30), m: Number(x && x.m), s: Number(x && x.s), k: x && x.k != null ? Number(x.k) : null }));
  if (c.some((x) => !x.l || !(x.m >= 20 && x.m <= 80) || !(x.s >= 1 && x.s <= 20))) return null;
  return { v: 1, n: o.n.trim().slice(0, 40), t: String(o.t || '').slice(0, 40), x: o.x, r, c };
}
const half = (v) => Math.round(v * 2) / 2;   // 0.5刻み
// 3つの目安ボタンの値（河合の基準）。offset は その模試→河合 の換算（進研なら -7）
function buttons(course, r, offset) {
  const d = r * TERCILE * course.s;
  return { hi: half(course.m + d + offset), mid: half(course.m + offset), lo: half(course.m - d + offset) };
}
// ボタンで選んだ値の「ぶれ」の目安（±いくつ）。校内での位置から模試の成績を当てるときに残るばらつき
function spread(course, r) { return Math.round(course.s * Math.sqrt(1 - r * r)); }
module.exports = { TERCILE, encode, decode, validate, buttons, spread };
