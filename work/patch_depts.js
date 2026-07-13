// 主要大学の欠落学部の補完＋2025-2026年新設学部＋体育系大学の教員rating調整
// merge_new.js の後、enrich_quals.js の前に実行（data_final.json を上書き）
// 偏差値はベストエフォート推定（河合基準目安）。新設学部は名称に付記。
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data_final.json');
const j = JSON.parse(fs.readFileSync(file, 'utf8'));

// id → 追加学部（既存と同名の学部はスキップ）
const ADD_DEPTS = {
  // ---------- 立命館（理系・薬・映像などが丸ごと欠落していた） ----------
  ritsumeikan: [
    { name: '理工学部', campus: '滋賀びわこ(BKC)', hensachi_min: 50, hensachi_max: 55, qualifications: ['技術士補', '建築士（環境都市系）'] },
    { name: '情報理工学部', campus: '大阪いばらき(OIC)', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['基本情報技術者', 'ITエンジニア職'] },
    { name: '生命科学部', campus: '滋賀びわこ(BKC)', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['食品・製薬系研究職', '危険物取扱者'] },
    { name: '薬学部（6年制/4年制）', campus: '滋賀びわこ(BKC)', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['薬剤師（6年制）', '創薬研究職（4年制）'] },
    { name: '映像学部', campus: '大阪いばらき(OIC)', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['映像・メディア業界職'] },
    { name: '食マネジメント学部', campus: '滋賀びわこ(BKC)', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['フードスペシャリスト', '食品業界職'] },
    { name: 'グローバル教養学部', campus: '大阪いばらき(OIC)', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['国際系キャリア（英語学位）'] },
    { name: 'デザイン・アート学部（2026年4月新設予定・要確認）', campus: '大阪いばらき(OIC)', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['デザイナー・クリエイター職'] },
  ],
  // ---------- 同志社 ----------
  doshisha: [
    { name: '文学部', campus: '今出川', hensachi_min: 60, hensachi_max: 62.5, qualifications: ['中高教員(国英社)', '学芸員'] },
    { name: '経済学部', campus: '今出川', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
    { name: '政策学部', campus: '今出川', hensachi_min: 60, hensachi_max: 60, qualifications: ['公務員試験に有利'] },
    { name: 'グローバル・コミュニケーション学部', campus: '京田辺', hensachi_min: 60, hensachi_max: 62.5, qualifications: ['中高教員(英)', '通訳・翻訳系'] },
    { name: 'グローバル地域文化学部', campus: '今出川', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
    { name: '神学部', campus: '今出川', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
    { name: '生命医科学部', campus: '京田辺', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['臨床工学技士（課程による）', '医療機器・製薬系研究職'] },
  ],
  // ---------- 関西大学 ----------
  'kansai-univ': [
    { name: '文学部', campus: '千里山', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: ['中高教員', '学芸員'] },
    { name: '政策創造学部', campus: '千里山', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['公務員試験に有利'] },
    { name: '外国語学部', campus: '千里山', hensachi_min: 60, hensachi_max: 60, qualifications: ['中高教員(英)', '通訳・翻訳系'] },
    { name: '総合情報学部', campus: '高槻', hensachi_min: 55, hensachi_max: 55, qualifications: ['基本情報技術者', 'ITエンジニア職'] },
    { name: '社会安全学部', campus: '高槻ミューズ', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['防災士', '公務員（防災・危機管理）'] },
    { name: 'システム理工学部', campus: '千里山', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['技術士補', '電気主任技術者（課程による）'] },
    { name: '環境都市工学部', campus: '千里山', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['一級・二級建築士（受験資格）', '測量士補'] },
    { name: '化学生命工学部', campus: '千里山', hensachi_min: 52.5, hensachi_max: 52.5, qualifications: ['危険物取扱者', '化学系技術職'] },
    { name: 'ビジネスデータサイエンス学部（2025年新設）', campus: '吹田みらい', hensachi_min: 55, hensachi_max: 55, qualifications: ['統計検定', 'データサイエンティスト職'] },
  ],
  // ---------- 関西学院 ----------
  kangaku: [
    { name: '神学部', campus: '西宮上ケ原', hensachi_min: 50, hensachi_max: 52.5, qualifications: [] },
    { name: '総合政策学部', campus: '神戸三田', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['公務員試験に有利'] },
    { name: '理学部', campus: '神戸三田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(数理)'] },
    { name: '工学部', campus: '神戸三田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['技術士補', 'ITエンジニア職'] },
    { name: '生命環境学部', campus: '神戸三田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['食品・環境系技術職'] },
    { name: '建築学部', campus: '神戸三田', hensachi_min: 52.5, hensachi_max: 52.5, qualifications: ['一級・二級建築士（受験資格）'] },
  ],
  // ---------- 近畿大学 ----------
  kindai: [
    { name: '建築学部', campus: '東大阪', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['一級・二級建築士（受験資格）'] },
    { name: '薬学部（6年制/4年制）', campus: '東大阪', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['薬剤師（6年制）'] },
    { name: '農学部', campus: '奈良', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['食品衛生管理者（任用）', '樹木医補（課程による）'] },
    { name: '医学部（6年制）', campus: '堺・泉ヶ丘', hensachi_min: 65, hensachi_max: 65, qualifications: ['医師（国家試験受験資格）'] },
    { name: '生物理工学部', campus: '和歌山', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['食品・バイオ系技術職'] },
    { name: '国際学部', campus: '東大阪', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['TOEIC/英検上位級'] },
  ],
  // ---------- 龍谷大学 ----------
  ryukoku: [
    { name: '文学部', campus: '京都深草・大宮', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['中高教員', '学芸員', '図書館司書'] },
    { name: '国際学部', campus: '京都深草', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['TOEIC/英検上位級'] },
    { name: '先端理工学部', campus: '滋賀瀬田', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['技術士補', '基本情報技術者'] },
    { name: '農学部', campus: '滋賀瀬田', hensachi_min: 45, hensachi_max: 50, qualifications: ['食品衛生管理者（任用）', '管理栄養士（食品栄養）'] },
    { name: '心理学部（2023年新設）', campus: '京都深草', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['公認心理師（要大学院）', '認定心理士'] },
  ],
  // ---------- 甲南大学 ----------
  konan: [
    { name: '文学部', campus: '岡本', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員', '学芸員'] },
    { name: '知能情報学部', campus: '岡本', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['基本情報技術者', 'ITエンジニア職'] },
    { name: 'マネジメント創造学部', campus: '西宮', hensachi_min: 50, hensachi_max: 50, qualifications: [] },
    { name: 'フロンティアサイエンス学部', campus: 'ポートアイランド', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['バイオ・化学系技術職'] },
  ],
  // ---------- 京都産業大学 ----------
  'kyoto-sangyo': [
    { name: '理学部', campus: '京都上賀茂', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['中高教員(数理)'] },
    { name: '情報理工学部', campus: '京都上賀茂', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['基本情報技術者', 'ITエンジニア職'] },
    { name: '生命科学部', campus: '京都上賀茂', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['バイオ・食品系技術職'] },
  ],
  // ---------- 佛教大学 ----------
  bukkyo: [
    { name: '仏教学部', campus: '紫野', hensachi_min: 42.5, hensachi_max: 45, qualifications: [] },
    { name: '文学部', campus: '紫野', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['中高教員(国社)', '学芸員'] },
    { name: '社会福祉学部', campus: '紫野', hensachi_min: 45, hensachi_max: 45, qualifications: ['社会福祉士（受験資格）', '精神保健福祉士'] },
  ],
  // ---------- 京都橘大学 ----------
  'kyoto-tachibana': [
    { name: '国際英語学部', campus: '山科', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['中高教員(英)', 'TOEIC/英検上位級'] },
    { name: '文学部', campus: '山科', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['中高教員(国社)', '学芸員'] },
    { name: '総合心理学部', campus: '山科', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['公認心理師（要大学院）', '認定心理士'] },
    { name: '経済学部', campus: '山科', hensachi_min: 47.5, hensachi_max: 47.5, qualifications: [] },
    { name: '工学部（情報工・建築デザイン）', campus: '山科', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['基本情報技術者', '一級・二級建築士（受験資格）'] },
  ],
  // ---------- 武庫川女子大学 ----------
  'mukogawa-joshi': [
    { name: '心理・社会福祉学部', campus: '中央', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['公認心理師（要大学院）', '社会福祉士（受験資格）'] },
    { name: '環境共生学部（2025年新設）', campus: '中央', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['環境系技術職'] },
    { name: '音楽学部', campus: '中央', hensachi_min: 40, hensachi_max: 42.5, qualifications: ['中高教員(音楽)'] },
  ],
  // ---------- 摂南大学 ----------
  setsunan: [
    { name: '外国語学部', campus: '寝屋川', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['中高教員(英)', 'TOEIC/英検上位級'] },
    { name: '経済学部', campus: '寝屋川', hensachi_min: 45, hensachi_max: 47.5, qualifications: [] },
    { name: '現代社会学部（2023年新設）', campus: '寝屋川', hensachi_min: 47.5, hensachi_max: 47.5, qualifications: ['社会調査士'] },
    { name: '農学部（2020年新設）', campus: '枚方', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['管理栄養士（食品栄養）', '食品衛生管理者（任用）'] },
  ],
};

let added = 0, skipped = 0;
for (const [id, depts] of Object.entries(ADD_DEPTS)) {
  const u = j.ippan.universities.find(x => x.id === id);
  if (!u) { console.log('WARN: id not found:', id); continue; }
  u.departments = u.departments || [];
  for (const d of depts) {
    const baseName = d.name.replace(/（.*$/, '');
    if (u.departments.some(x => (x.name || '').replace(/（.*$/, '').startsWith(baseName))) { skipped++; continue; }
    u.departments.push(d);
    added++;
  }
}

// ---------- 体育・スポーツ系単科大学の教員ratingを一般教員基準に補正 ----------
// （kyoin=5 は「保健体育教員に強い」意味だったため、教科全般の指標としては 3 に引き下げ）
let adjusted = 0;
for (const e of j.employment.universities) {
  const b = j.base.universities.find(x => x.id === e.id);
  if (!b || !e.ratings) continue;
  if (/体育大|スポーツ大/.test(b.name)) {
    if (e.ratings.kyoin > 3) { e.ratings.kyoin = 3; adjusted++; }
    if (e.ratings['shogakkō'] > 2) e.ratings['shogakkō'] = 2;
    e.notes = ((e.notes || '') + ' 教員養成は保健体育が中心（教科全般の養成課程は限定的）。').trim();
  }
}

fs.writeFileSync(file, JSON.stringify(j));
console.log(`学部追加: ${added} / 重複スキップ: ${skipped} / 体育系rating補正: ${adjusted}校`);
