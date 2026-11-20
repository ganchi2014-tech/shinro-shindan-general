// Museの画面にある行と、こちらに書き写した行が同じかを確かめる。行ごとに短いハッシュを出す（ブラウザ側でも同じ式で計算して突き合わせる）。
//  使い方: node crawl/linehash.js crawl/muse_xxx.txt   →  「id|種別|方式名の先頭」ごとではなく、行そのもののハッシュを1行ずつ出す
const fs = require('fs');
const h = (s) => { let x = 5381; for (const ch of s) x = ((x * 33) ^ ch.codePointAt(0)) >>> 0; return (x % 46656).toString(36).padStart(3, '0'); };
const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
console.log(lines.map(h).join(''));
module.exports = { h };
