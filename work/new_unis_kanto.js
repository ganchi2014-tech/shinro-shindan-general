// 新規追加: 関東人気私大9校（上智・理科大・MARCH残り・日東駒専）
// 数値はベストエフォート推定。要確認表示前提。滋賀からは全校下宿前提（アクセス分は新幹線利用目安）
module.exports = [
{
 base: {
  id: 'sophia', name: '上智大学', name_short: '上智', prefecture: '東京都', type: '私立',
  campus_main: '四谷キャンパス（千代田区）',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（東京）',
  feature: '早慶と並び称される難関私大。語学・国際系は日本トップクラスで、少人数教育と国際色の強さが特徴。外資系・国際機関への就職に伝統的な強みを持つ。',
  living_cost: { rent_min: 60000, rent_max: 90000, food_monthly: 30000, monthly_total: 130000, four_year_total: 6200000, note: '都心立地のため生活費は全国最高水準' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['外資系企業', '商社', '航空', '国際機関', 'マスコミ'], note: null },
  bairitsu_trend: { ippan: { '2024': '約3〜6倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR・地下鉄四ツ谷駅 徒歩3分', walking_min_from_station: 3, nearby_amenities: '都心で全て揃う', area_description: '皇居にほど近い都心の文教地区' },
  shogakukin: { general_shogakukin: '新入生奨学金（入学前予約型）など', shogakukin_official_url: null },
  career_center: { features: ['外資・国際系企業への強力パイプ', '語学力を活かすキャリア支援'], quality: 5, note: null },
  official_links: { official_url: 'https://www.sophia.ac.jp/', nyushi_url: 'https://adm.sophia.ac.jp/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '英語・国際系で全国レベルを目指すなら早慶と並ぶ選択肢。TEAP利用など英語資格を活かす入試が充実。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '四谷', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['中高教員', '学芸員'] },
   { name: '外国語学部', campus: '四谷', hensachi_min: 57.5, hensachi_max: 62.5, qualifications: ['中高教員(英)', '通訳系'] },
   { name: '国際教養学部', campus: '四谷', hensachi_min: 65, hensachi_max: 65, qualifications: [] },
   { name: '法学部', campus: '四谷', hensachi_min: 57.5, hensachi_max: 60, qualifications: [] },
   { name: '経済学部', campus: '四谷', hensachi_min: 57.5, hensachi_max: 60, qualifications: [] },
   { name: '総合人間科学部', campus: '四谷', hensachi_min: 55, hensachi_max: 62.5, qualifications: ['看護師', '社会福祉士', '公認心理師(要院)'] },
   { name: '理工学部', campus: '四谷', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['技術士補'] },
  ],
  entry_methods: [ { method_name: '一般選抜（TEAP利用・学部学科試験）', subjects: '3教科＋英語外部資格', notes: '評定不問。共通テスト利用・併用あり', bairitsu: '3〜6倍（要確認）' } ],
  hensachi_representative: 60
 },
 koubo: { entry_methods: [ { method_name: '推薦入学試験（公募制）', hyoutei_min: 4.0, hyoutei_note: '学科により4.0以上＋英語資格（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: '英検準1級レベルの資格が必要な学科が多い' } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 4, 'kigyō_ippan': 5, 'kigyō_supotsu': 1, 'iryō': 3 },
  strengths: ['外資系・国際機関への就職は私大トップクラス', '商社・航空・マスコミに伝統的な強み', '語学教育の質による英語キャリアの広さ'],
  representative_employers: ['外資系コンサル', '三菱商事', 'ANA・JAL', 'NHK'],
  summary: '国際系志望の最有力私大。'
 }
},
{
 base: {
  id: 'tokyo-rika', name: '東京理科大学', name_short: '理科大', prefecture: '東京都', type: '私立',
  campus_main: '神楽坂・葛飾・野田キャンパス',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（東京・千葉）',
  feature: '「実力主義」で知られる理系私大の雄。進級判定が厳しい分、企業からの信頼は絶大で、理系就職・大学院進学実績は私大トップクラス。国公立理系の併願先としても定番。',
  living_cost: { rent_min: 50000, rent_max: 80000, food_monthly: 28000, monthly_total: 115000, four_year_total: 5500000, note: 'キャンパスにより家賃相場が異なる（野田は安め）' },
  shingaku_jisseki: { shushoku_rate: '約98%', top_employers: ['大手メーカー', 'IT大手', '製薬', '大学院進学（過半数）'], note: '院進学率は私大最高水準' },
  bairitsu_trend: { ippan: { '2024': '約2.5〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR飯田橋駅 徒歩5分（神楽坂）', walking_min_from_station: 5, nearby_amenities: '神楽坂の学生街', area_description: '都心の文教地区（神楽坂）ほか' },
  shogakukin: { general_shogakukin: '新生のいぶき奨学金（入学前予約型）など', shogakukin_official_url: null },
  career_center: { features: ['理系専門職への圧倒的な求人数', '院進学を含めたキャリア設計支援'], quality: 5, note: null },
  official_links: { official_url: 'https://www.tus.ac.jp/', nyushi_url: 'https://www.tus.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「私大で本気の理系」なら首都圏第一候補。厳しさの分だけ就職・院進学で報われる大学として企業評価が高い。'
 },
 ippan: {
  departments: [
   { name: '理学部', campus: '神楽坂', hensachi_min: 55, hensachi_max: 60, qualifications: ['中高教員(数理)'] },
   { name: '工学部', campus: '葛飾', hensachi_min: 55, hensachi_max: 60, qualifications: ['建築士', '技術士補'] },
   { name: '創域理工学部', campus: '野田', hensachi_min: 52.5, hensachi_max: 57.5, qualifications: ['建築士', '技術士補'] },
   { name: '先進工学部', campus: '葛飾', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '薬学部（6年制）', campus: '野田', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: ['薬剤師'] },
   { name: '経営学部', campus: '神楽坂', hensachi_min: 52.5, hensachi_max: 57.5, qualifications: [] },
  ],
  entry_methods: [ { method_name: '一般選抜（A方式=共テ利用/B方式=独自）', subjects: '数学・理科・英語', notes: '評定不問', bairitsu: '2.5〜4倍（要確認）' } ],
  hensachi_representative: 57.5
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 4.0, hyoutei_note: '4.0以上目安（要確認）', selection_content: ['書類', '面接', '基礎学力'], bairitsu: '1.5〜2.5倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 5, 'kigyō_supotsu': 1, 'iryō': 4 },
  strengths: ['理系技術職の就職実績は私大トップクラス', '数学・理科の教員養成に伝統', '大学院進学→研究職ルートが確立'],
  representative_employers: ['ソニー', '日立製作所', 'NTTデータ', '大手製薬'],
  summary: '理系実力派の定番私大。'
 }
},
{
 base: {
  id: 'aoyama-gakuin', name: '青山学院大学', name_short: '青学', prefecture: '東京都', type: '私立',
  campus_main: '青山キャンパス（渋谷区）・相模原キャンパス',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（東京・神奈川）',
  feature: 'MARCHの一角。渋谷・表参道という日本屈指の立地と洗練されたイメージで人気が高い。英語教育（英文科は日本私大の草分け）と箱根駅伝で全国的知名度。',
  living_cost: { rent_min: 55000, rent_max: 85000, food_monthly: 30000, monthly_total: 125000, four_year_total: 6000000, note: '渋谷周辺は高いが、神奈川方面に住む学生も多い' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['航空・旅行', '広告・マスコミ', '金融', '商社'], note: null },
  bairitsu_trend: { ippan: { '2024': '約3〜6倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR渋谷駅 徒歩10分 / 表参道駅 徒歩5分', walking_min_from_station: 5, nearby_amenities: '渋谷・表参道で全て揃う', area_description: '日本屈指の都心立地' },
  shogakukin: { general_shogakukin: '地の塩、世の光奨学金（入学前予約型）など', shogakukin_official_url: null },
  career_center: { features: ['航空・マスコミ・広告業界への強さ', '英語キャリア支援'], quality: 4, note: null },
  official_links: { official_url: 'https://www.aoyama.ac.jp/', nyushi_url: 'https://www.aoyama.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '英語・国際系＋都会的キャンパスライフを求めるならMARCH随一。全学部入試の英語比重が高く、英語が得意な生徒に有利。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '青山', hensachi_min: 55, hensachi_max: 60, qualifications: ['中高教員(英)', '学芸員'] },
   { name: '教育人間科学部', campus: '青山', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: ['小学校教員', '中高教員'] },
   { name: '経済学部', campus: '青山', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: [] },
   { name: '法学部', campus: '青山', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '経営学部', campus: '青山', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: [] },
   { name: '国際政治経済学部', campus: '青山', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
   { name: '総合文化政策学部', campus: '青山', hensachi_min: 57.5, hensachi_max: 60, qualifications: [] },
   { name: '理工学部', campus: '相模原', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['技術士補'] },
   { name: 'コミュニティ人間科学部', campus: '相模原', hensachi_min: 52.5, hensachi_max: 55, qualifications: [] },
  ],
  entry_methods: [ { method_name: '一般選抜（全学部日程・個別学部日程）', subjects: '3教科（英語重視・共テ併用型あり）', notes: '評定不問', bairitsu: '3〜6倍（要確認）' } ],
  hensachi_representative: 57.5
 },
 sogo: { entry_methods: [ { method_name: '総合型選抜（自己推薦）', hyoutei_min: 3.5, hyoutei_note: '学部により3.5〜4.0＋英語資格（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '2〜5倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 3, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 5, 'kigyō_supotsu': 2, 'iryō': 1 },
  strengths: ['航空・広告・マスコミなど人気業界への就職に強い', '英語力を武器にした就職支援', 'ブランドイメージによる人気企業への強さ'],
  representative_employers: ['ANA・JAL', '電通・博報堂', '三菱UFJ銀行', '大手商社'],
  summary: '英語×都心のMARCH人気校。'
 }
},
{
 base: {
  id: 'rikkyo', name: '立教大学', name_short: '立教', prefecture: '東京都', type: '私立',
  campus_main: '池袋キャンパス・新座キャンパス',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（東京・埼玉）',
  feature: 'MARCHの一角。蔦のからまるレンガ校舎で知られるミッション系大学。観光学部・異文化コミュニケーション学部など特色学部を持ち、リベラルアーツ教育に定評。',
  living_cost: { rent_min: 50000, rent_max: 80000, food_monthly: 28000, monthly_total: 115000, four_year_total: 5500000, note: '池袋周辺〜埼玉方面で幅がある' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['金融', '航空・観光', 'マスコミ', 'メーカー'], note: null },
  bairitsu_trend: { ippan: { '2024': '約3〜5倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR池袋駅 徒歩7分', walking_min_from_station: 7, nearby_amenities: '池袋で全て揃う', area_description: '都心ターミナル立地' },
  shogakukin: { general_shogakukin: 'セントポール奨学金（入学前予約型）など', shogakukin_official_url: null },
  career_center: { features: ['観光・航空業界への伝統的パイプ', 'リーダーシップ教育を活かす就職支援'], quality: 4, note: null },
  official_links: { official_url: 'https://www.rikkyo.ac.jp/', nyushi_url: 'https://www.rikkyo.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '観光・国際・心理など特色学部が強み。一般入試は英語資格スコア利用が基本で、英検などを持っていると有利。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '池袋', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['中高教員', '学芸員'] },
   { name: '異文化コミュニケーション学部', campus: '池袋', hensachi_min: 62.5, hensachi_max: 62.5, qualifications: [] },
   { name: '経済学部', campus: '池袋', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '経営学部', campus: '池袋', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
   { name: '社会学部', campus: '池袋', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['社会調査士'] },
   { name: '法学部', campus: '池袋', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '観光学部', campus: '新座', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['旅行業務取扱管理者'] },
   { name: '現代心理学部', campus: '新座', hensachi_min: 52.5, hensachi_max: 57.5, qualifications: ['公認心理師(要院)'] },
   { name: '理学部', campus: '池袋', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['中高教員(数理)'] },
   { name: 'スポーツウエルネス学部', campus: '新座', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(体)', '健康運動指導士'] },
  ],
  entry_methods: [ { method_name: '一般入試（英語資格利用型）', subjects: '2教科＋英語外部資格/共テ英語', notes: '評定不問。英検2級〜準1級のスコアが実質必要', bairitsu: '3〜5倍（要確認）' } ],
  hensachi_representative: 57.5
 },
 sogo: { entry_methods: [ { method_name: '自由選抜入試（総合型）', hyoutei_min: 3.5, hyoutei_note: '学部により3.5以上＋活動実績（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '2〜5倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 2, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 5, 'kigyō_supotsu': 2, 'iryō': 2 },
  strengths: ['金融・観光・航空業界への安定した実績', '観光学部は業界での知名度抜群', '英語資格を活かす入試・就職の一貫性'],
  representative_employers: ['みずほFG', 'JTB', 'ANA', '大手メーカー'],
  summary: '特色学部で選ぶMARCH。'
 }
},
{
 base: {
  id: 'gakushuin', name: '学習院大学', name_short: '学習院', prefecture: '東京都', type: '私立',
  campus_main: '目白キャンパス（豊島区）',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（東京）',
  feature: 'MARCHと並び「GMARCH」と括られる伝統校。ワンキャンパスの落ち着いた環境と少人数教育が特徴で、就職の面倒見の良さに定評。皇室ゆかりの品格あるブランド。',
  living_cost: { rent_min: 50000, rent_max: 80000, food_monthly: 28000, monthly_total: 115000, four_year_total: 5500000, note: '目白は落ち着いた住宅地' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['金融', 'メーカー', '公務員', 'マスコミ'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2.5〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR目白駅 徒歩1分', walking_min_from_station: 1, nearby_amenities: '池袋・新宿が至近', area_description: '緑豊かなワンキャンパス' },
  shogakukin: { general_shogakukin: '入学前予約型給付奨学金など', shogakukin_official_url: null },
  career_center: { features: ['少人数ゆえの手厚い個別就職支援', '金融・老舗企業への伝統パイプ'], quality: 4, note: null },
  official_links: { official_url: 'https://www.univ.gakushuin.ac.jp/', nyushi_url: 'https://www.univ.gakushuin.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: 'MARCHクラスの学力で「駅近ワンキャンパス・少人数・面倒見」を重視するなら有力。国際社会科学部は英語×社会科学の実践型。'
 },
 ippan: {
  departments: [
   { name: '法学部', campus: '目白', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '経済学部', campus: '目白', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '文学部', campus: '目白', hensachi_min: 52.5, hensachi_max: 57.5, qualifications: ['中高教員', '学芸員'] },
   { name: '理学部', campus: '目白', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(数理)'] },
   { name: '国際社会科学部', campus: '目白', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
  ],
  entry_methods: [ { method_name: '一般選抜（コア試験・プラス試験）', subjects: '3教科', notes: '評定不問', bairitsu: '2.5〜4倍（要確認）' } ],
  hensachi_representative: 55
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.8, hyoutei_note: '学部により3.8〜4.0（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 4, 'kigyō_ippan': 5, 'kigyō_supotsu': 1, 'iryō': 1 },
  strengths: ['学生数に対する大手就職率が高い（面倒見型）', '金融・メーカーの伝統的な採用実績', 'ワンキャンパスの落ち着いた学習環境'],
  representative_employers: ['三井住友銀行', '大手保険', '老舗メーカー', '公務員'],
  summary: '少人数・面倒見型のGMARCH。'
 }
},
{
 base: {
  id: 'nihon-univ', name: '日本大学', name_short: '日大', prefecture: '東京都', type: '私立',
  campus_main: '学部ごとに独立キャンパス（東京・千葉ほか）',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（学部により所在地が異なる）',
  feature: '学生数日本一のマンモス総合大学。16学部が独立キャンパスを持ち、医・歯・獣医・芸術・スポーツ科学まで学部の幅は全国随一。卒業生130万人のOBネットワークは就職での隠れた強み。',
  living_cost: { rent_min: 45000, rent_max: 75000, food_monthly: 28000, monthly_total: 110000, four_year_total: 5300000, note: '学部キャンパスの立地で大きく変わる' },
  shingaku_jisseki: { shushoku_rate: '約96%', top_employers: ['建設・不動産', '公務員（警察・消防含む）', '中堅〜大手メーカー', 'マスコミ（芸術）'], note: '警察官・消防官の採用数は全国最多クラス' },
  bairitsu_trend: { ippan: { '2024': '約2〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '学部により異なる', walking_min_from_station: 10, nearby_amenities: '学部により異なる', area_description: '首都圏各地に学部キャンパス' },
  shogakukin: { general_shogakukin: '日本大学特待生制度など', shogakukin_official_url: null },
  career_center: { features: ['全国最大級のOBネットワーク', '公務員試験対策の規模'], quality: 3, note: null },
  official_links: { official_url: 'https://www.nihon-u.ac.jp/', nyushi_url: 'https://www.nihon-u.ac.jp/admission_info/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「首都圏で学部の選択肢を最大化」するならまず候補。N方式（全学統一）で複数学部の併願がしやすい。警察・消防志望にも実績大。'
 },
 ippan: {
  departments: [
   { name: '法学部', campus: '神田三崎町', hensachi_min: 50, hensachi_max: 52.5, qualifications: [] },
   { name: '経済学部', campus: '水道橋', hensachi_min: 50, hensachi_max: 52.5, qualifications: [] },
   { name: '商学部', campus: '砧', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['会計士基礎'] },
   { name: '文理学部', campus: '桜上水', hensachi_min: 47.5, hensachi_max: 55, qualifications: ['中高教員（全教科）', '公認心理師(要院)'] },
   { name: '理工学部', campus: '駿河台・船橋', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['建築士', '土木系資格'] },
   { name: '芸術学部', campus: '江古田', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['映像・写真・放送系'] },
   { name: 'スポーツ科学部', campus: '三軒茶屋', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['中高教員(体)', 'トレーナー系'] },
   { name: '医学部（6年制）', campus: '板橋', hensachi_min: 65, hensachi_max: 65, qualifications: ['医師'] },
   { name: '生物資源科学部', campus: '藤沢', hensachi_min: 45, hensachi_max: 52.5, qualifications: ['獣医師（獣医）', '管理栄養士'] },
  ],
  entry_methods: [ { method_name: '一般選抜（N全学統一方式・A個別方式）', subjects: '3教科', notes: '評定不問。N方式は1回の試験で複数学部併願可', bairitsu: '2〜4倍（要確認）' } ],
  hensachi_representative: 50
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制・学部別）', hyoutei_min: 3.5, hyoutei_note: '学部により3.0〜4.0（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 2, keisatsu: 5, 'shōbō': 4, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 3, 'iryō': 3 },
  strengths: ['警察官・消防官の採用数は全国最多クラス', '建設・不動産業界への伝統的な強さ', '卒業生130万人のOBネットワーク'],
  representative_employers: ['警視庁・各県警', '大手ゼネコン', '国土交通省', 'TV業界（芸術）'],
  summary: '選択肢の広さ日本一の総合大。'
 }
},
{
 base: {
  id: 'toyo-univ', name: '東洋大学', name_short: '東洋大', prefecture: '東京都', type: '私立',
  campus_main: '白山キャンパス（文京区）ほか',
  access_from_shiga_min: 330, commute_possible: false, commute_note: '下宿前提（東京）',
  feature: '日東駒専の一角。「哲学の東洋」として創立され、近年は国際化・情報系の強化で人気上昇。夜間部（イブニングコース）は学費が半額程度で、働きながら学ぶ選択肢も。箱根駅伝の常連校。',
  living_cost: { rent_min: 45000, rent_max: 75000, food_monthly: 28000, monthly_total: 110000, four_year_total: 5300000, note: '白山は文京区の落ち着いた学生街' },
  shingaku_jisseki: { shushoku_rate: '約96%', top_employers: ['金融', '流通・サービス', 'IT', '公務員'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2.5〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '都営三田線白山駅 徒歩5分', walking_min_from_station: 5, nearby_amenities: '文京区の文教エリア', area_description: '落ち着いた都心キャンパス' },
  shogakukin: { general_shogakukin: '独自給付奨学金＋イブニングコースの学費優遇', shogakukin_official_url: null },
  career_center: { features: ['キャリア支援プログラムの規模', '公務員試験講座'], quality: 3, note: null },
  official_links: { official_url: 'https://www.toyo.ac.jp/', nyushi_url: 'https://www.toyo.ac.jp/nyushi/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '日東駒専の中で最も勢いがある。イブニングコース（夜間）なら学費を大きく抑えて首都圏私大に通える。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '白山', hensachi_min: 50, hensachi_max: 55, qualifications: ['中高教員', '学芸員'] },
   { name: '経済学部', campus: '白山', hensachi_min: 50, hensachi_max: 52.5, qualifications: [] },
   { name: '経営学部', campus: '白山', hensachi_min: 50, hensachi_max: 52.5, qualifications: [] },
   { name: '法学部', campus: '白山', hensachi_min: 50, hensachi_max: 52.5, qualifications: [] },
   { name: '社会学部', campus: '白山', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['社会調査士', '社会福祉士'] },
   { name: '国際学部', campus: '白山', hensachi_min: 50, hensachi_max: 55, qualifications: [] },
   { name: '情報連携学部', campus: '赤羽台', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['IT系資格'] },
   { name: 'ライフデザイン学部（福祉スポーツ）', campus: '赤羽台', hensachi_min: 45, hensachi_max: 50, qualifications: ['社会福祉士', '保育士', '健康運動指導士'] },
   { name: '理工学部', campus: '川越', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['建築士', '技術士補'] },
   { name: '食環境科学部', campus: '朝霞', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['管理栄養士（食環境）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期・中期・後期）', subjects: '3教科（ベスト2判定など多様）', notes: '評定不問。共通テスト利用が充実', bairitsu: '2.5〜4倍（要確認）' } ],
  hensachi_representative: 50
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.3, hyoutei_note: '学部により3.0〜3.8（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 2, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 2, 'iryō': 3 },
  strengths: ['金融・流通への安定した就職実績', '情報系学部の新設で IT就職が伸長', 'イブニングコースの学費コスパ'],
  representative_employers: ['りそな銀行', 'イオングループ', '富士通', '特別区職員'],
  summary: '勢いのある日東駒専筆頭。'
 }
},
{
 base: {
  id: 'komazawa', name: '駒澤大学', name_short: '駒澤', prefecture: '東京都', type: '私立',
  campus_main: '駒沢キャンパス（世田谷区）',
  access_from_shiga_min: 340, commute_possible: false, commute_note: '下宿前提（東京）',
  feature: '日東駒専の一角。禅・仏教研究の伝統を持つワンキャンパス大学。駒沢オリンピック公園に隣接する環境と、マスコミ・スポーツ界に多い卒業生が特徴。箱根駅伝の強豪。',
  living_cost: { rent_min: 50000, rent_max: 75000, food_monthly: 28000, monthly_total: 110000, four_year_total: 5300000, note: '世田谷の住宅地。三軒茶屋・渋谷が近い' },
  shingaku_jisseki: { shushoku_rate: '約95%', top_employers: ['金融', '流通', 'マスコミ', '公務員'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2.5〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '東急田園都市線駒沢大学駅 徒歩10分', walking_min_from_station: 10, nearby_amenities: '駒沢公園隣接・三軒茶屋が生活圏', area_description: '世田谷の緑豊かな環境' },
  shogakukin: { general_shogakukin: '新人の英知（入学前予約型）など', shogakukin_official_url: null },
  career_center: { features: ['ワンキャンパスの一体感ある支援', 'マスコミ講座の伝統'], quality: 3, note: null },
  official_links: { official_url: 'https://www.komazawa-u.ac.jp/', nyushi_url: 'https://www.komazawa-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '渋谷から2駅のワンキャンパスで4年間過ごせる。GMS学部（グローバル・メディア・スタディーズ）はメディア×英語の人気学部。'
 },
 ippan: {
  departments: [
   { name: '仏教学部', campus: '駒沢', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['宗教系'] },
   { name: '文学部', campus: '駒沢', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['中高教員', '学芸員', '公認心理師(要院)'] },
   { name: '経済学部', campus: '駒沢', hensachi_min: 47.5, hensachi_max: 50, qualifications: [] },
   { name: '法学部', campus: '駒沢', hensachi_min: 47.5, hensachi_max: 50, qualifications: [] },
   { name: '経営学部', campus: '駒沢', hensachi_min: 47.5, hensachi_max: 50, qualifications: [] },
   { name: 'グローバル・メディア・スタディーズ学部', campus: '駒沢', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['メディア系'] },
   { name: '医療健康科学部', campus: '駒沢', hensachi_min: 47.5, hensachi_max: 47.5, qualifications: ['診療放射線技師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（全学部統一・T方式）', subjects: '3教科', notes: '評定不問', bairitsu: '2.5〜4倍（要確認）' } ],
  hensachi_representative: 47.5
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.2, hyoutei_note: '学部により3.0〜3.5（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 3, 'kigyō_ippan': 4, 'kigyō_supotsu': 3, 'iryō': 3 },
  strengths: ['金融・流通の中堅就職に安定感', '放射線技師など医療技術系の資格学部', 'スポーツ・マスコミ界の卒業生ネットワーク'],
  representative_employers: ['地方銀行', '小売大手', 'TV制作会社', '公務員'],
  summary: 'ワンキャンパスの日東駒専。'
 }
},
{
 base: {
  id: 'senshu', name: '専修大学', name_short: '専修', prefecture: '東京都', type: '私立',
  campus_main: '生田キャンパス（川崎市）・神田キャンパス（千代田区）',
  access_from_shiga_min: 340, commute_possible: false, commute_note: '下宿前提（東京・神奈川）',
  feature: '日東駒専の一角。日本初の私立法律経済学校として創立された社会科学の伝統校。公認会計士・公務員試験の対策講座「専修大学育友会計士講座」など資格支援が手厚い。',
  living_cost: { rent_min: 45000, rent_max: 70000, food_monthly: 28000, monthly_total: 105000, four_year_total: 5000000, note: '生田周辺は家賃が都心より安い' },
  shingaku_jisseki: { shushoku_rate: '約96%', top_employers: ['金融', '公務員', '流通', '会計事務所'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2.5〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '小田急向ヶ丘遊園駅 バス/徒歩15分（生田）/ 神保町駅 徒歩3分（神田）', walking_min_from_station: 15, nearby_amenities: '生田は学生街、神田は都心', area_description: '丘の上の緑豊かなキャンパス（生田）' },
  shogakukin: { general_shogakukin: '進学サポート奨学生（入学前予約型）など', shogakukin_official_url: null },
  career_center: { features: ['会計士・公務員試験の学内講座が伝統', '資格取得支援の手厚さ'], quality: 3, note: null },
  official_links: { official_url: 'https://www.senshu-u.ac.jp/', nyushi_url: 'https://www.senshu-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '法律・経済・会計の伝統校。学内ダブルスクール的な資格講座で、公認会計士・公務員を安価に目指せる。'
 },
 ippan: {
  departments: [
   { name: '法学部', campus: '神田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['法律系資格'] },
   { name: '経済学部', campus: '生田', hensachi_min: 47.5, hensachi_max: 50, qualifications: [] },
   { name: '経営学部', campus: '生田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['公認会計士'] },
   { name: '商学部', campus: '神田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['公認会計士', '税理士'] },
   { name: '文学部', campus: '生田', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['中高教員', '学芸員'] },
   { name: '人間科学部', campus: '生田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['公認心理師(要院)', '社会調査士'] },
   { name: '国際コミュニケーション学部', campus: '神田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(英)'] },
   { name: 'ネットワーク情報学部', campus: '生田', hensachi_min: 47.5, hensachi_max: 47.5, qualifications: ['IT系資格'] },
  ],
  entry_methods: [ { method_name: '一般選抜（全学部統一・学部個別）', subjects: '3教科', notes: '評定不問。共通テスト利用あり', bairitsu: '2.5〜4倍（要確認）' } ],
  hensachi_representative: 50
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.3, hyoutei_note: '学部により3.0〜3.8（要確認）', selection_content: ['書類', '小論文', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 2, 'iryō': 1 },
  strengths: ['公認会計士・税理士の学内講座による合格実績', '公務員試験対策の伝統', '金融・流通の中堅就職に安定'],
  representative_employers: ['地方銀行・信金', '国税専門官', '会計事務所', '流通大手'],
  summary: '資格に強い社会科学の伝統校。'
 }
}
];
