// クリティ②の事実監査で判明した誤りの修正＋学費データ補完
// patch_depts.js の後、enrich_quals.js の前に実行（data_final.json を上書き）
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data_final.json');
const j = JSON.parse(fs.readFileSync(file, 'utf8'));

const base = id => j.base.universities.find(u => u.id === id);
const ippan = id => j.ippan.universities.find(u => u.id === id);
const fixes = [];

// ---------- 1. 東洋大学: ライフデザイン学部は2023年改組で消滅 ----------
{
  const u = ippan('toyo-univ');
  if (u) {
    u.departments = (u.departments || []).filter(d => !d.name.includes('ライフデザイン'));
    u.departments.push(
      { name: '福祉社会デザイン学部（2023年改組）', campus: '白山・赤羽台', hensachi_min: 45, hensachi_max: 50, qualifications: ['社会福祉士（受験資格）', '保育士（子ども支援学）'] },
      { name: '健康スポーツ科学部（2023年改組）', campus: '赤羽台', hensachi_min: 45, hensachi_max: 50, qualifications: ['中学・高校教諭一種（保健体育）', '健康運動指導士', '管理栄養士（栄養科学）'] },
    );
    fixes.push('東洋大: ライフデザイン学部→福祉社会デザイン/健康スポーツ科学（2023改組）');
  }
}

// ---------- 2. 立命館 デザイン・アート学部の設置場所: OIC→衣笠 ----------
{
  const u = ippan('ritsumeikan');
  const d = u?.departments?.find(x => x.name.includes('デザイン・アート'));
  if (d) { d.campus = '京都衣笠'; fixes.push('立命館デザイン・アート学部: 設置場所を衣笠に修正'); }
}

// ---------- 3. 滋賀大学 教育学部の最寄駅 ----------
{
  const u = base('shiga-univ');
  if (u?.campus_neighborhood) {
    u.campus_neighborhood.nearest_station = 'JR彦根駅 徒歩15分（経済・DS）/ JR石山駅からバス約10分（教育）';
    fixes.push('滋賀大: 教育学部の最寄駅をJR石山駅からバスに修正');
  }
}

// ---------- 4. 立教 スポーツウエルネス学部の偏差値 ----------
{
  const u = ippan('rikkyo');
  const d = u?.departments?.find(x => x.name.includes('スポーツウエルネス'));
  if (d) { d.hensachi_min = 55; d.hensachi_max = 57.5; fixes.push('立教スポーツウエルネス: 偏差値55〜57.5に修正'); }
}

// ---------- 5. リンク切れURLの修正 ----------
{
  const urlFix = { 'gifu-keizai': 'https://www.gku.ac.jp/', shigakkan: 'https://www.sgk.ac.jp/' };
  for (const u of j.base.universities) {
    if (/岐阜協立/.test(u.name) && u.official_links) {
      for (const k of Object.keys(u.official_links)) {
        if (typeof u.official_links[k] === 'string' && u.official_links[k].includes('gifu-keizai')) u.official_links[k] = 'https://www.gku.ac.jp/';
      }
      fixes.push('岐阜協立大: 公式URLを gku.ac.jp に修正');
    }
    if (/至学館/.test(u.name) && u.official_links) {
      for (const k of Object.keys(u.official_links)) {
        if (typeof u.official_links[k] === 'string' && u.official_links[k].includes('shigakkan')) u.official_links[k] = 'https://www.sgk.ac.jp/';
      }
      fixes.push('至学館大: 公式URLを sgk.ac.jp に修正');
    }
  }
}

// ---------- 6. 関東校のアクセス分数を統一（新幹線利用・草津起点の目安） ----------
// 旧収録組(180分)と新規追加(330分)の二重基準を、都心200/郊外220-240に統一
{
  const accessFix = {
    waseda: 200, keio: 200, chuo: 210, meiji: 200, hosei: 200, juntendo: 200,
    sophia: 200, 'tokyo-rika': 200, 'aoyama-gakuin': 210, rikkyo: 200, gakushuin: 200,
    'nihon-univ': 210, 'toyo-univ': 200, komazawa: 220, senshu: 220,
    nittaidai: 220, kokushikan: 220, 'tokai-univ': 230, tsukuba: 240,
  };
  for (const [id, min] of Object.entries(accessFix)) {
    const u = base(id);
    if (u && u.access_from_shiga_min !== min) {
      u.access_from_shiga_min = min;
      u.commute_possible = false;
      u.commute_note = '下宿前提。新幹線利用で片道約' + Math.round(min / 60 * 10) / 10 + '時間';
    }
  }
  fixes.push('関東校のアクセス分数を統一（都心200分・郊外220-240分）');
}

// ---------- 7. 甲南/関学のアクセス逆転を修正 ----------
{
  const konan = base('konan');
  if (konan) { konan.access_from_shiga_min = 95; konan.commute_note = '新快速＋JR神戸線で約1時間35分。通学者もいる'; }
  const kangaku = base('kangaku');
  if (kangaku && kangaku.access_from_shiga_min < 105) { kangaku.access_from_shiga_min = 110; }
  fixes.push('甲南95分/関学110分に修正（岡本の方が近い実態に合わせた）');
}

// ---------- 8. 学費（年間授業料等の目安）補完 ----------
// 個別値（特色ある学費の大学）
const TUITION_EXPLICIT = {
  'toyota-kogyo': 730000,       // トヨタの社会貢献で私立最安級
  'kanazawa-kogyo': 1770000,
  'kyoto-yakka': 2300000,       // 薬6年制
  'osaka-ika-yakka': 2300000,   // 薬基準（医は別格）
  sophia: 1350000, 'tokyo-rika': 1650000, 'aoyama-gakuin': 1400000, rikkyo: 1400000, gakushuin: 1350000,
  'nihon-univ': 1350000, 'toyo-univ': 1300000, komazawa: 1250000, senshu: 1250000,
  'kyoto-joshi': 1300000, 'doshisha-joshi': 1350000, 'mukogawa-joshi': 1400000, 'kobe-jogakuin': 1400000,
  'yamato-univ': 1400000, 'nagahama-bio': 1550000, seisen: 1350000, 'biwako-gakuin': 1350000,
};
let tuitionFilled = 0;
for (const u of j.base.universities) {
  if (u.tuition_yen_per_year) continue;
  if (TUITION_EXPLICIT[u.id]) { u.tuition_yen_per_year = TUITION_EXPLICIT[u.id]; u.tuition_note = '代表的な学部の年間学費目安（学部により異なる）'; tuitionFilled++; continue; }
  if (/国立|公立/.test(u.type || '')) {
    u.tuition_yen_per_year = 535800; // 国公立標準（入学金別・公立は地域外で差あり）
    u.tuition_note = '国公立標準額。入学金（約28万円）別。公立は府県外出身者の入学金が高い場合あり';
    tuitionFilled++;
  } else {
    u.tuition_yen_per_year = 1300000; // 私立文系ベースの目安
    u.tuition_note = '私立文系ベースの目安（理系+30〜50万/医療系はさらに高い。要確認）';
    tuitionFilled++;
  }
}
fixes.push(`学費補完: ${tuitionFilled}校（国公立53.58万・私立は文系目安130万＋個別値）`);

fs.writeFileSync(file, JSON.stringify(j));
fixes.forEach(f => console.log('✔', f));
console.log('大学数:', j.base.universities.length);
