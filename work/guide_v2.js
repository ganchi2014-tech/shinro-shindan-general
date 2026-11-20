// guide_v2: 生徒に「届く」ための補助ロジック（純モジュール、依存なし）
//  1) 仕事 → その仕事に必要な資格が取れる学部かどうかの判定
//  2) 仕事 → 大学以外の道（専門学校・短大・高卒採用）の案内。学校別には分けない（種類別のみ）
//  3) 出発駅 → 大学（学部のキャンパス）までの通学時間の目安
//  4) 適性チェックの回答 → 向いていそうな分野（根拠つき）
// 採点エンジン(engine_v2)には手を入れない。結果の「見せ方」だけをここで決める。

// ------------------------------------------------------------
// 1) 資格で分ける
// ------------------------------------------------------------
// 資格が決め手になる仕事だけを対象にする（一般企業・公務員・マスコミ等は対象外）。
// 中高教員は取れる学部が多すぎて絞りにならないので対象外。
const QUAL_RULES = {
  kango:          { label: '看護師',                       re: /看護師/ },
  hokenshi:       { label: '保健師・助産師',               re: /保健師|助産師/ },
  pt_ot:          { label: 'リハビリの国家資格（理学療法士・作業療法士など）', re: /理学療法士|作業療法士|言語聴覚士/ },
  gishi:          { label: '診療放射線技師・臨床検査技師', re: /放射線技師|臨床検査技師/ },
  'jūdōseifuku':  { label: '柔道整復師',                   re: /柔道整復師/ },
  'eiyō':         { label: '管理栄養士',                   re: /管理栄養士/ },
  yakuzai:        { label: '薬剤師',                       re: /薬剤師/ },
  shafuku:        { label: '社会福祉士',                   re: /社会福祉士/ },
  ishi:           { label: '医師',                         re: /(^|[^科獣])医師/ },
  shika_ishi:     { label: '歯科医師',                     re: /歯科医師/ },
  'jūi':          { label: '獣医師',                       re: /獣医師/ },
  'shogakkō':     { label: '小学校の先生の免許',           re: /小学校/ },
  hoiku:          { label: '保育士・幼稚園の先生の資格',   re: /保育士|幼稚園/ },
  'yōgo':         { label: '養護教諭（保健室の先生）の免許', re: /養護教諭/ },
  kenchiku:       { label: '建築士',                       re: /建築士/ },
};

function qualCareers(careerIds) {
  return [...(careerIds || [])].filter((id) => QUAL_RULES[id]);
}

// dept がその仕事の資格を取れるか（資格欄の表記ゆれは正規表現で吸収）
function deptHasQual(dept, careerId) {
  const rule = QUAL_RULES[careerId];
  if (!rule || !dept) return false;
  const q = dept.qualifications;
  const list = Array.isArray(q) ? q : (typeof q === 'string' && q ? [q] : []);
  return list.some((s) => typeof s === 'string' && rule.re.test(s));
}

// 選んだ仕事のうち、この学部で資格が取れるもののラベル配列（空なら「取れると確認できない」）
function matchedQualLabels(dept, careerIds) {
  return qualCareers(careerIds).filter((id) => deptHasQual(dept, id)).map((id) => QUAL_RULES[id].label);
}

// ------------------------------------------------------------
// 1b) 資格では決まらない仕事: 「学ぶ内容で寄せる仕事」と「学部を問わない仕事」
// ------------------------------------------------------------
// 以前は仕事を「医療・福祉」「サービス」など10個の就職系統に寄せていたため、
// 弁護士で体育学部、心理カウンセラーで薬学部、デザイナーで文学部が並んでいた（1職種あたり100〜360学部が無関係）。
// 学ぶ内容で寄せる仕事は、学部名の言葉 / 資格欄の言葉 / 分野タグ のどれかに当たる学部だけを上段に出す。
//   name: 学部名に含まれる言葉  ex: 除外する言葉  qual: 資格欄の言葉  tags: 分野タグ（広すぎる職種では使わない）
const FIELD_RULES = {
  IT:              { label: 'IT・情報',           name: /情報|データサイエンス|システム|コンピュータ|メディア情報|デジタル/, qual: /基本情報|応用情報|ITパスポート|情報処理/, tags: ['joho'] },
  design:          { label: 'デザイン・制作',     name: /デザイン|芸術|美術|造形|マンガ|映像|メディア表現|アート/, qual: /デザイン|色彩|CG|インテリア/, tags: ['geijutsu', 'kenchiku'] },
  kikai_denki:     { label: '機械・電気',         name: /機械|電気|電子|工学部|理工|基礎工|ロボ|メカ/, ex: /情報工学科|建築|医療|人間/, qual: /電気主任|電気工事|機械設計/ },
  doboku:          { label: '土木・まちづくり',   name: /土木|社会基盤|都市工|都市環境|都市科学|建築都市|建設|環境都市|社会環境工/, qual: /測量士|土木施工|技術士/ },
  'nōshoku':       { label: '食・農・バイオ',     name: /農|食|バイオ|生命|生物|水産|園芸/, ex: /食物栄養|管理栄養|人間生命|生命医科/, qual: /食品衛生|HACCP|フードスペシャリスト/, tags: ['nogaku'] },
  masucomi:        { label: 'マスコミ・広告',     name: /メディア|マスコミ|広告|コミュニケーション|社会学|文芸|放送|ジャーナリ/, qual: /社会調査士/ },
  kaikei:          { label: '会計・税務',         name: /会計|商学|経営|商経|経済経営/, qual: /公認会計士|税理士|簿記/ },
  'hōsō':          { label: '法律',               name: /(^|[^療])法学|法律|法政/, qual: /司法|法曹|弁護士|法科大学院/ },
  kokusai:         { label: '語学・国際',         name: /外国語|国際|英語|英米|グローバル|中国語|言語/, qual: /通訳|国連英検/, tags: ['gaikokugo'] },
  'kankō':         { label: '観光・ホテル・航空', name: /観光|ホスピタリティ|国際|外国語|英語|グローバル/, qual: /旅行業務|観光|ホテル/ },
  shinri:          { label: '心理',               name: /心理/, qual: /公認心理師|認定心理士|臨床心理/ },
  AT:              { label: 'トレーナー・健康運動', name: /スポーツ|体育|健康科学|健康スポーツ|トレーナー/, qual: /アスレティックトレーナー|健康運動|トレーニング指導|NSCA/, tags: ['sports'] },
  coach:           { label: 'スポーツ指導',       name: /スポーツ|体育|コーチ/, qual: /コーチ|スポーツ指導|保健体育/, tags: ['sports'] },
  'kigyō_supotsu': { label: 'スポーツビジネス',   name: /スポーツ|体育/, tags: ['sports'] },
};
// 学部を問わない仕事: 学部では絞らず、その旨を言い切る。rating は大学ごとの就職の強み（本アプリの5段階の目安）の軸
const OPEN_JOBS = {
  keisatsu:       { rating: 'keisatsu',     text: '警察官は採用試験で決まり、学部は問われません。法律・体育系の出身者が多めですが、どの学部からでも受けられます。' },
  'shōbō':        { rating: 'shōbō',        text: '消防士は採用試験で決まり、学部は問われません。救急救命士の資格も取りたい場合だけ、救急救命の学科が近道です。' },
  jieikan:        { rating: 'keisatsu',     text: '自衛官は採用試験で決まり、学部は問われません。' },
  'kōmuin_ippan': { rating: 'kōmuin_ippan', text: '市役所・県庁などは採用試験で決まり、学部は問われません。法律・経済・政策系の学部は試験科目と授業が重なります。' },
  'kokka_kōmuin': { rating: 'kōmuin_ippan', text: '国家公務員も採用試験で決まり、学部は問われません。法律・経済・政策系の学部は試験科目と授業が重なります。' },
  'kigyō_ippan':  { rating: 'kigyō_ippan',  text: '一般企業の多くは学部を問いません。技術職だけは理工・情報系が条件になります。学部より、大学ごとの就職の実績を見る方が役に立ちます。' },
  'kinyū':        { rating: 'kigyō_ippan',  text: '銀行・保険なども学部を問いません。経済・経営・商・法の出身者が多めです。' },
  kyoin:          { rating: 'kyoin',        text: '中学・高校の先生の免許は多くの学部で取れますが、取れる教科は学部で決まります。教えたい教科から学部を選んでください（国語→文学、数学→理学・教育、保健体育→体育・スポーツ など）。' },
};

function fieldCareers(careerIds) { return [...(careerIds || [])].filter((id) => FIELD_RULES[id]); }
function openCareers(careerIds) { return [...(careerIds || [])].filter((id) => OPEN_JOBS[id]); }
function _quals(dept) { const q = dept && dept.qualifications; return Array.isArray(q) ? q : (typeof q === 'string' && q ? [q] : []); }
// dept がその仕事につながる内容か（学部名 / 資格欄 / 分野タグ のどれか）
function deptMatchesField(dept, careerId) {
  const r = FIELD_RULES[careerId];
  if (!r || !dept) return false;
  const name = dept.name || '';
  if (r.name && r.name.test(name) && !(r.ex && r.ex.test(name))) return true;
  if (r.qual && _quals(dept).some((s) => typeof s === 'string' && r.qual.test(s))) return true;
  if (r.tags && (dept.interest_tags || []).some((t) => r.tags.includes(t))) return true;
  return false;
}
function matchedFieldLabels(dept, careerIds) {
  return fieldCareers(careerIds).filter((id) => deptMatchesField(dept, id)).map((id) => FIELD_RULES[id].label);
}
// 学部を問わない仕事について、その大学の就職の強み（4以上）に当たるラベル
function strongOpenJobs(uni, careerIds) {
  const r = (uni && uni.employment && uni.employment.ratings) || null;
  if (!r) return [];
  return openCareers(careerIds).filter((id) => (r[OPEN_JOBS[id].rating] || 0) >= 4);
}

// ------------------------------------------------------------
// 2) 大学以外の道（種類別の案内。個別の学校名は持たない）
// ------------------------------------------------------------
// route: 'senmon'   = 専門学校・短大が主な道のひとつ
//        'daigaku'  = 大学でしか取れない
//        'kosotsu'  = 高卒で受けられる採用試験がある
// 年数・受験資格は国家資格の養成課程の一般的な枠組み。細部は学校・年度で違うので必ず進路指導室で確認。
const PATHWAYS = {
  kango:         { route: 'senmon',  text: '看護の専門学校（3年）でも看護師の国家試験を受けられます。大学（4年）は保健師などもあわせて目指せる学校があります。' },
  hokenshi:      { route: 'daigaku', text: '保健師・助産師は、看護師の資格に加えて専用の課程が必要です。大学（4年）で選抜される形か、看護師になってから1年以上の課程に進む形が一般的です。' },
  pt_ot:         { route: 'senmon',  text: 'リハビリの専門学校（3年または4年）でも国家試験を受けられます。大学は4年です。' },
  gishi:         { route: 'senmon',  text: '放射線技師・臨床検査技師は、専門学校（3年以上）でも国家試験を受けられます。' },
  'jūdōseifuku': { route: 'senmon',  text: '柔道整復師は専門学校（3年）が主な道です。大学で取れる所は少数です。' },
  'eiyō':        { route: 'senmon',  text: '管理栄養士は4年制の養成課程（大学・一部の専門学校）が近道です。短大・専門学校（2年）で栄養士になり、働いてから管理栄養士の試験を受ける道もあります。' },
  yakuzai:       { route: 'daigaku', text: '薬剤師は大学の薬学部（6年制）でしか目指せません。' },
  ishi:          { route: 'daigaku', text: '医師は大学の医学部（6年）でしか目指せません。' },
  shika_ishi:    { route: 'daigaku', text: '歯科医師は大学の歯学部（6年）でしか目指せません。' },
  'jūi':         { route: 'daigaku', text: '獣医師は大学の獣医学系の学部（6年）でしか目指せません。' },
  shafuku:       { route: 'daigaku', text: '社会福祉士は福祉系の大学（4年）が最短です。短大・専門学校からは、卒業後に働く期間が必要になります。' },
  'shogakkō':    { route: 'daigaku', text: '小学校の先生の免許は大学（一種）が基本です。短大で取れる免許（二種）もあります。' },
  kyoin:         { route: 'daigaku', text: '中学・高校の先生の免許は大学で取ります（高校は大学のみ）。取れる教科は学部で決まるので、教えたい教科から学部を選びます。' },
  hoiku:         { route: 'senmon',  text: '短大・専門学校（2年）でも保育士の資格と幼稚園の免許（二種）が取れます。大学（4年）は幼稚園の免許が一種になります。' },
  'yōgo':        { route: 'daigaku', text: '養護教諭の免許は大学（一種）が基本です。短大で取れる免許（二種）や、看護師・保健師から目指す道もあります。' },
  'shōbō':       { route: 'kosotsu', text: '消防士は市町などの採用試験で、高卒で受けられる枠があります。救急救命士は専門学校（2〜3年）や大学で国家試験の受験資格を取る道と、消防に入ってから取る道があります。' },
  keisatsu:      { route: 'kosotsu', text: '警察官は採用試験で、高卒で受けられる枠があります。大卒の枠もあります。' },
  jieikan:       { route: 'kosotsu', text: '自衛官は高卒で受けられる採用があります。大卒向けの幹部候補生の道もあります。' },
  'kōmuin_ippan':{ route: 'kosotsu', text: '市役所・県庁などは高卒で受けられる枠（初級）があります。公務員試験の対策をする専門学校（1〜2年）から受ける人もいます。' },
  kenchiku:      { route: 'senmon',  text: '建築の専門学校（2年〜）でも二級建築士の試験を受けられます。一級建築士は、大学や専門学校で指定の科目を修めてから目指します。' },
  IT:            { route: 'senmon',  text: 'IT系は資格が必須ではありません。専門学校（2〜4年）から就職する道もあります。' },
  design:        { route: 'senmon',  text: 'デザイン系は資格が必須ではありません。専門学校（2〜3年）で作品づくりを中心に学ぶ道もあります。' },
  'kankō':       { route: 'senmon',  text: '観光・ホテル・エアライン系は、専門学校（2年）から就職する道もあります。' },
  AT:            { route: 'senmon',  text: 'トレーナー系は、専門学校（2〜3年）で学ぶ道もあります。体を治療する資格（柔道整復師・理学療法士など）と組み合わせる人も多い分野です。' },
};

// 仕事の一覧に無いが、専門学校が主な道になる仕事（ホームの案内用）
const SENMON_MAIN_JOBS = ['美容師・理容師', '調理師・パティシエ', '自動車整備士', '歯科衛生士', '介護福祉士', '動物看護・トリマー', 'ゲーム・アニメ・声優', '医療事務'];

function pathwayOf(careerId) { return PATHWAYS[careerId] || null; }

// ------------------------------------------------------------
// 3) 通学時間（出発駅から）
// ------------------------------------------------------------
// 駅から駅の所要時間は JR 新快速の時刻表（京都→長浜、2026年秋ダイヤ）から。
// pos = 京都駅からの分数（琵琶湖線）。乗り換えの待ち時間は入っていない＝あくまで目安。
// 堅田・貴生川は琵琶湖線の外なので概算（approx: true）。
const ORIGINS = [
  { id: 'otsu',        label: '大津・膳所・石山',         toKyoto: 9,  toMaibara: 44, pos: 9 },
  { id: 'kusatsu',     label: '草津・南草津・守山・栗東', toKyoto: 20, toMaibara: 33, pos: 20 },
  { id: 'omihachiman', label: '近江八幡・野洲・能登川',   toKyoto: 34, toMaibara: 19, pos: 34 },
  { id: 'hikone',      label: '彦根・米原',               toKyoto: 48, toMaibara: 5,  pos: 48 },
  { id: 'nagahama',    label: '長浜',                     toKyoto: 65, toMaibara: 12, pos: 65 },
  { id: 'katata',      label: '堅田・湖西線ぞい',         toKyoto: 22, toMaibara: 70, pos: null, kosei: true, approx: true },
  { id: 'kibukawa',    label: '貴生川・甲賀・水口',       toKyoto: 50, toMaibara: 62, pos: 20, extra: 30, approx: true },
];
function originById(id) { return ORIGINS.find((o) => o.id === id) || null; }

// 県内キャンパス: 琵琶湖線上の位置(pos)＋駅からの時間(last)。kosei は湖西線側（fromKyoto=京都駅から）。
// キャンパス名（学部の campus 欄）か大学名で引く。数字は駅からのバス・徒歩を含む概算。
const SHIGA_CAMPUS = [
  { key: /びわこ・くさつ|BKC/,        pos: 17, last: 20 },                 // 立命館BKC: 南草津＋バス
  { key: /瀬田キャンパス|瀬田大江/,   pos: 16, last: 15 },                 // 龍谷 瀬田: 瀬田＋バス
  { key: /彦根キャンパス（滋賀県彦根市馬場）|滋賀大学.*彦根/, pos: 48, last: 15 }, // 滋賀大 彦根
  { key: /大津キャンパス（滋賀県大津市平津）/, pos: 13, last: 20 },       // 滋賀大 教育: 石山＋バス
];
const SHIGA_UNI = {
  '滋賀大学':                         { pos: 48, last: 15 },
  '滋賀県立大学':                     { pos: 45, last: 15 },               // 南彦根＋バス
  '滋賀医科大学':                     { pos: 16, last: 15 },               // 瀬田＋バス
  '長浜バイオ大学':                   { pos: 61, last: 3 },                // 田村
  '聖泉大学':                         { pos: 43, last: 15 },               // 稲枝方面
  'びわこ学院大学':                   { pos: 34, last: 30 },               // 近江八幡→近江鉄道
  'びわこリハビリテーション専門職大学': { pos: 34, last: 35 },             // 近江八幡→近江鉄道 八日市
  'びわこ成蹊スポーツ大学':           { kosei: true, fromKyoto: 38, fromKatata: 12, last: 5 }, // 比良
  '成安造形大学':                     { kosei: true, fromKyoto: 18, fromKatata: 5,  last: 10 }, // おごと温泉＋バス
};
// 県外だが学部でキャンパスが分かれる大学（京都駅からの分数）
const KYOTO_CAMPUS = [
  { key: /いばらき|OIC/,   min: 30 },   // 立命館OIC
  { key: /衣笠/,           min: 45 },   // 立命館 衣笠
  { key: /深草/,           min: 15 },   // 龍谷 深草
  { key: /今出川/,         min: 15 },   // 同志社・同志社女子 今出川
  { key: /京田辺/,         min: 50 },   // 同志社・同志社女子 京田辺
];

function _noteOrigin(note) {
  const n = note || '';
  if (/米原/.test(n)) return 'maibara';
  if (/大津/.test(n)) return 'otsu';
  if (/草津/.test(n)) return 'kusatsu';
  return 'unknown';
}

// 大学（＋学部キャンパス）の「拠点からの分数」を求める
//  戻り値: { hub:'shiga', ... } | { hub:'kyoto', min } | { hub:'maibara', min } | null（通学の対象外）
function campusBase(uni, dept) {
  if (!uni) return null;
  const campus = (dept && dept.campus) || '';
  for (const c of SHIGA_CAMPUS) if (c.key.test(campus)) return { hub: 'shiga', pos: c.pos, last: c.last };
  for (const c of KYOTO_CAMPUS) if (c.key.test(campus)) return { hub: 'kyoto', min: c.min };
  if (SHIGA_UNI[uni.name] && uni.name !== '滋賀大学') return Object.assign({ hub: 'shiga' }, SHIGA_UNI[uni.name]);
  if (uni.name === '滋賀大学') return Object.assign({ hub: 'shiga' }, SHIGA_UNI['滋賀大学']);
  const acc = uni.access_from_shiga_min;
  if (acc == null) return null;
  const org = _noteOrigin(uni.commute_note);
  const WEST = ['kyoto', 'osaka', 'hyogo', 'nara-wakayama', 'shiga'];
  if (WEST.includes(uni.region)) {
    // 既存の「滋賀から○分」は起点が大学ごとに違う（大津/草津/不明）。起点ぶんを引いて京都駅からに直す
    const off = org === 'otsu' ? 9 : org === 'kusatsu' ? 20 : 15;
    return { hub: 'kyoto', min: Math.max(5, acc - off) };
  }
  if (uni.region === 'tokai') {
    const off = org === 'otsu' ? 44 : org === 'kusatsu' ? 33 : 0; // 米原起点・不明はそのまま米原からとみなす
    return { hub: 'maibara', min: Math.max(5, acc - off) };
  }
  return null; // 関東・その他は通学の対象外
}

// 出発駅からの片道の目安（分）。originId が無いときは既存の「滋賀から○分」をそのまま返す
function commuteMin(uni, dept, originId) {
  if (!uni) return null;
  const o = originById(originId);
  if (!o) return uni.access_from_shiga_min != null ? uni.access_from_shiga_min : null;
  const b = campusBase(uni, dept);
  if (!b) return null;
  if (b.hub === 'kyoto') return o.toKyoto + b.min;
  if (b.hub === 'maibara') return o.toMaibara + b.min;
  // 県内
  if (b.kosei) {
    if (o.kosei) return b.fromKatata + b.last;
    return o.toKyoto + b.fromKyoto - 5 + b.last;              // 山科で乗り換え（京都まで行かない分 -5、待ち +5 で相殺）
  }
  if (o.kosei) return 17 + 5 + Math.max(0, b.pos - 5) + b.last; // 堅田→山科17分＋乗り換え＋山科から
  return Math.abs(o.pos - b.pos) + (o.extra || 0) + b.last;
}

// 通学の上限に対する区分: 'in'（上限内） / 'near'（少し超える） / 'far'（大きく超える・対象外）
const NEAR_MARGIN = 20;
function commuteBucket(min, limit) {
  if (limit == null) return 'in';
  if (min == null) return 'far';
  if (min <= limit) return 'in';
  if (min <= limit + NEAR_MARGIN) return 'near';
  return 'far';
}

// ------------------------------------------------------------
// 4) 向いていそうな分野（適性チェックの回答から）
// ------------------------------------------------------------
const TYPE_PHRASE = {
  R: '手や体を動かして作る・現場で動く',
  I: '仕組みを調べる・理由を考える',
  A: '表現する・自由な発想で作る',
  S: '人に教える・人を助ける',
  E: '人をまとめる・目標に挑む',
  C: '正確に整理する・こつこつ進める',
};
const TYPES = ['R', 'I', 'A', 'S', 'E', 'C'];

// profile: {R..C: 0〜1}, riasecMap: {tag:{R..C}}, tags: [{id,label}]
// 戻り値: { mine:[あなたが高く答えたこと…], fields:[{ id, label, score(0-1), overlap:[重なる点…], core:[この分野の中心…] }] }
//  根拠を見せるため、「あなたの答え（上位）」と「分野の中心」と「その重なり」を分けて返す
function topFields(profile, riasecMap, tags, n) {
  const mineTypes = TYPES.filter((k) => (profile[k] || 0) > 0).sort((a, b) => (profile[b] || 0) - (profile[a] || 0)).slice(0, 3);
  const fields = [];
  for (const t of tags || []) {
    const w = riasecMap && riasecMap[t.id];
    if (!w) continue;
    const sum = TYPES.reduce((s, k) => s + (w[k] || 0), 0);
    if (!sum) continue;
    const score = TYPES.reduce((s, k) => s + (profile[k] || 0) * (w[k] || 0), 0) / sum;
    const coreTypes = TYPES.slice().sort((a, b) => (w[b] || 0) - (w[a] || 0)).slice(0, 2);
    fields.push({
      id: t.id, label: t.label, score,
      core: coreTypes.map((k) => TYPE_PHRASE[k]),
      overlap: coreTypes.filter((k) => mineTypes.includes(k)).map((k) => TYPE_PHRASE[k]),
    });
  }
  fields.sort((a, b) => b.score - a.score);
  return { mine: mineTypes.map((k) => TYPE_PHRASE[k]), fields: fields.slice(0, n || 3) };
}

module.exports = {
  QUAL_RULES, qualCareers, deptHasQual, matchedQualLabels,
  FIELD_RULES, OPEN_JOBS, fieldCareers, openCareers, deptMatchesField, matchedFieldLabels, strongOpenJobs,
  PATHWAYS, SENMON_MAIN_JOBS, pathwayOf,
  ORIGINS, originById, campusBase, commuteMin, commuteBucket, NEAR_MARGIN,
  TYPE_PHRASE, topFields,
};
