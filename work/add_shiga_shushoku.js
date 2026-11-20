// 滋賀県内に就職した人の割合を大学データに足す（出典: 滋賀県 第30回滋賀県首長会議 資料1-2「魅力ある地方大学の実現と県内進学・就職の促進について」2024年1月16日）
//  県内大学 = 就職者に占める県内就職者の割合（2022年度卒業）
//  県外大学 = 県と就職支援協定を結ぶ大学の、卒業生に占める県内就職者の割合と滋賀県出身者の割合（2023年3月卒）
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const SRC = 'https://www.pref.shiga.lg.jp/file/attachment/5446699.pdf';
const KENNAI = { '聖泉大学': 74, 'びわこ学院大学': 72, '滋賀医科大学': 50, '滋賀大学': 22, '滋賀県立大学': 22, '長浜バイオ大学': 18, '成安造形大学': 16, '龍谷大学': 10, 'びわこ成蹊スポーツ大学': 10, '立命館大学': 2 };
const KENGAI = { '京都橘大学': [14.0, 29.8], '大谷大学': [11.7, 22.8], '京都光華大学': [11.6, 25.4], '佛教大学': [9.6, 15.9], '京都文教大学': [8.4, 21.9], '花園大学': [7.9, 18.3], '京都女子大学': [5.0, 8.7], '京都産業大学': [2.7, 8.1], '追手門学院大学': [1.6, 5.3], '同志社大学': [0.9, 4.6], '近畿大学': [0.3, 1.1], '神戸学院大学': [0.3, 0.5], '関西学院大学': [0.2, 1.0], '中央大学': [0.0, 0.1], '専修大学': [0.1, 0.1] };
let n = 0; const miss = [];
for (const [name, rate] of Object.entries(KENNAI)) {
  const u = d.universities.find((x) => x.name === name); if (!u) { miss.push(name); continue; }
  u.shiga_shushoku = { rate_pct: rate, base: '就職した人のうち', cohort: '2022年度卒業', shusshin_pct: null, source_url: SRC }; n++;
}
for (const [name, [rate, shusshin]] of Object.entries(KENGAI)) {
  const u = d.universities.find((x) => x.name === name); if (!u) { miss.push(name); continue; }
  u.shiga_shushoku = { rate_pct: rate, base: '卒業した人のうち', cohort: '2023年3月卒業', shusshin_pct: shusshin, source_url: SRC }; n++;
}
fs.writeFileSync(P, JSON.stringify(d, null, 1));
console.log('県内就職率を追加:', n, '校 / データに無い大学:', miss.join('、') || 'なし');
