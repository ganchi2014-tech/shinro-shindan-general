// 学部名にも資格欄にも言葉が出ないが、その分野を専攻として学べる学部に印を付ける（今は心理だけ）。
//  例: 関西学院大 文学部（総合心理科学科）、京都大 文学部（心理学専修）。学部名で寄せる方式だと落ちるため、公式サイトで確かめた分だけ足す。
//  使い方: node add_field_extra.js crawl/muse_shinri_20261120.txt
//   行の形: 大学id|P|学部名|専攻・学科・コースの名前|根拠のURL   （P = 心理。^ は https:// の略）
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const KIND = { P: 'shinri' };
const NOTE = { 'kyoto-sangyo|現代社会学部': '2027年4月に新設予定' };   // Museの注記（公式資料に「仮称・設置構想中」）
let n = 0; const miss = [];
for (const f of process.argv.slice(2)) {
  for (const l of fs.readFileSync(f, 'utf8').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'))) {
    const [id, k, gakubu, senko, url] = l.split('|').map((x) => x.trim().replace(/^\^/, 'https://'));
    const field = KIND[k]; if (!field) continue;
    const hits = d.departments.filter((x) => x.uni_id === id && x.name.includes(gakubu));
    if (!hits.length) { miss.push(id + ' ' + gakubu); continue; }
    for (const x of hits) {
      const note = NOTE[id + '|' + gakubu];
      x.fields_extra = Object.assign(x.fields_extra || {}, { [field]: { name: senko + (note ? '・' + note : ''), source_url: url, checked: '2026-11-20' } });
      n++;
    }
  }
}
fs.writeFileSync(P, JSON.stringify(d, null, 1));
console.log('印を付けた学部: ' + n + (miss.length ? '\n学部が見つからない: ' + miss.join(' / ') : ''));
