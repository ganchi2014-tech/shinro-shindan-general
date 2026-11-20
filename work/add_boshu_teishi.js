// 学生募集を停止した大学に印を付ける（画面では大学ページに知らせを出し、診断の結果から外す）。
//  使い方: node add_boshu_teishi.js
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const LIST = {
  // 愛知文教大学: 令和9(2027)年度以降の学生募集を停止。Museが大学の公式サイトで確認、検索でも同じ記述を確認（2026-11-20）
  'aichi-bunkyo': { from: '2027年度', checked: '2026-11-20', source_url: 'https://www.abu.ac.jp/' },
};
let n = 0;
for (const u of d.universities) if (LIST[u.id]) { u.boshu_teishi = LIST[u.id]; n++; }
fs.writeFileSync(P, JSON.stringify(d, null, 1));
console.log('募集停止の印: ' + n + '校');
