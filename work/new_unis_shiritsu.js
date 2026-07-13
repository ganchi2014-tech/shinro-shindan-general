// 新規追加: 女子大4校＋就職に強い私立5校（数値はベストエフォート推定。要確認表示前提）
module.exports = [
{
 base: {
  id: 'kyoto-joshi', name: '京都女子大学', name_short: '京女', prefecture: '京都府', type: '私立',
  campus_main: '東山キャンパス（京都市東山区）',
  access_from_shiga_min: 70, commute_possible: true, commute_note: '草津からJR＋バスで約70分。自宅通学圏',
  feature: '西日本最大級の女子総合大学。「京女」ブランドは関西の企業・教育界で伝統的に評価が高い。教員・管理栄養士・金融一般職など手堅い就職に強く、キャリア支援の面倒見が良い。2023年にデータサイエンス学部を新設。',
  living_cost: { rent_min: 0, rent_max: 55000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1200000, note: '自宅通学圏。下宿の場合は東山周辺でやや高め' },
  shingaku_jisseki: { shushoku_rate: '約98%', kyoin_count: '教員・保育者 約150名/年（要確認）', top_employers: ['京都銀行・滋賀銀行など金融', '小学校教員・幼稚園', '食品・製薬メーカー', '公務員'], note: '就職率・就職先満足度は女子大トップクラス' },
  bairitsu_trend: { ippan: { '2024': '約2〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '京阪七条駅 徒歩15分＋プリンセスラインバス', walking_min_from_station: 15, nearby_amenities: '東山の観光エリアに隣接', area_description: '京都市東山区の高台。清水寺に近い' },
  shogakukin: { general_shogakukin: '成績優秀者特待、家計急変支援など独自奨学金が充実', shogakukin_official_url: null },
  career_center: { features: ['女子大特有のきめ細かい個別就職支援', '教員採用・公務員講座', '卒業生ネットワークが強い'], quality: 5, note: null },
  official_links: { official_url: 'https://www.kyoto-wu.ac.jp/', nyushi_url: 'https://www.kyoto-wu.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「手堅い就職＋通学圏＋伝統ブランド」の三拍子。教員・栄養士・金融志望の女子生徒の有力候補。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '東山', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['中高教員(国英)', '学芸員'] },
   { name: '発達教育学部', campus: '東山', hensachi_min: 45, hensachi_max: 50, qualifications: ['小学校教員', '幼稚園教諭'] },
   { name: '心理共生学部', campus: '東山', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['公認心理師(要院)', '社会福祉士'] },
   { name: '家政学部', campus: '東山', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['管理栄養士', '一級建築士（生活造形）'] },
   { name: '現代社会学部', campus: '東山', hensachi_min: 47.5, hensachi_max: 50, qualifications: [] },
   { name: '法学部', campus: '東山', hensachi_min: 47.5, hensachi_max: 47.5, qualifications: [] },
   { name: 'データサイエンス学部', campus: '東山', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['統計検定'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期A/B方式）', subjects: '2〜3教科（英語・国語・選択）', notes: '評定不問。共通テスト利用方式あり', bairitsu: '2〜4倍（要確認）' } ],
  hensachi_representative: 47.5
 },
 sogo: { entry_methods: [ { method_name: '総合型選抜', hyoutei_min: 3.5, hyoutei_note: '学部により3.5前後（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.5, hyoutei_note: '学部により3.3〜4.0（要確認）', selection_content: ['書類', '基礎テスト', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: '関西女子大では公募枠が比較的多い' } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 5, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 3 },
  strengths: ['小学校・幼稚園教員の採用実績は関西女子大トップクラス', '管理栄養士国家試験の高い合格率', '金融・メーカー一般職就職の伝統的な強さ'],
  representative_employers: ['京都銀行', '小学校・幼稚園', '食品メーカー', '公務員'],
  summary: '手堅い就職力の伝統女子大。'
 }
},
{
 base: {
  id: 'doshisha-joshi', name: '同志社女子大学', name_short: '同女', prefecture: '京都府', type: '私立',
  campus_main: '京田辺キャンパス・今出川キャンパス',
  access_from_shiga_min: 75, commute_possible: true, commute_note: '今出川へは草津から約70分、京田辺へは約100分',
  feature: '同志社系列の女子大学。薬学部（6年制）・看護学部・音楽学科を持ち、資格系と教養系の両方が充実。系列の安心感と落ち着いた校風で、就職支援も丁寧。',
  living_cost: { rent_min: 0, rent_max: 55000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1200000, note: '今出川なら自宅通学圏。京田辺は通学長め' },
  shingaku_jisseki: { shushoku_rate: '約98%', top_employers: ['病院（薬剤師・看護師）', '金融一般職', '教員・保育', 'メーカー'], note: '薬学部の薬剤師国家試験合格率は安定して高い' },
  bairitsu_trend: { ippan: { '2024': '約2〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '近鉄興戸駅 徒歩10分（京田辺）/ 地下鉄今出川駅 徒歩3分', walking_min_from_station: 10, nearby_amenities: '今出川は御所隣接の京都中心部', area_description: '京田辺は緑豊かな丘陵、今出川は都心' },
  shogakukin: { general_shogakukin: '同志社女子大学奨学金（給付）ほか', shogakukin_official_url: null },
  career_center: { features: ['薬・看護の国家試験対策が体系化', '同志社ブランドの就職ネットワーク'], quality: 4, note: null },
  official_links: { official_url: 'https://www.dwc.doshisha.ac.jp/', nyushi_url: 'https://www.dwc.doshisha.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '薬剤師・看護師を目指す女子生徒に、同志社系列の環境で学べる選択肢。文系学部も就職の面倒見が良い。'
 },
 ippan: {
  departments: [
   { name: '薬学部（6年制）', campus: '京田辺', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['薬剤師'] },
   { name: '看護学部', campus: '京田辺', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['看護師', '保健師'] },
   { name: '現代社会学部', campus: '京田辺', hensachi_min: 45, hensachi_max: 50, qualifications: [] },
   { name: '学芸学部', campus: '京田辺', hensachi_min: 42.5, hensachi_max: 50, qualifications: ['中高教員(音楽)', 'メディア系'] },
   { name: '表象文化学部', campus: '今出川', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['中高教員(英)'] },
   { name: '生活科学部', campus: '今出川', hensachi_min: 45, hensachi_max: 50, qualifications: ['管理栄養士', '小学校教員（児童学）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期）', subjects: '2〜3教科', notes: '評定不問。共通テスト利用あり', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 47.5
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.5, hyoutei_note: '学部により異なる（要確認）', selection_content: ['書類', '小論文/基礎テスト', '面接'], bairitsu: '1.5〜2.5倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 4, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['薬剤師・看護師・管理栄養士の資格就職に直結', '同志社系列ブランドで一般企業就職も安定', '保育・小学校教員養成に伝統'],
  representative_employers: ['京都・大阪の病院', '調剤薬局', '金融一般職', '小学校・幼稚園'],
  summary: '資格系に強い系列女子大。'
 }
},
{
 base: {
  id: 'mukogawa-joshi', name: '武庫川女子大学', name_short: '武庫女', prefecture: '兵庫県', type: '私立',
  campus_main: '中央キャンパス（西宮市鳴尾）',
  access_from_shiga_min: 115, commute_possible: false, commute_note: '片道約2時間。下宿併用が現実的',
  feature: '学生数日本最大の女子大学。薬学・看護・教育・食物栄養・建築など資格直結の学部を12学部揃える「資格の武庫女」。就職率・国家試験合格率の高さで全国的に知られる。',
  living_cost: { rent_min: 35000, rent_max: 55000, food_monthly: 22000, monthly_total: 85000, four_year_total: 4100000, note: '西宮は住みやすいが家賃は関西で高め' },
  shingaku_jisseki: { shushoku_rate: '約98%', top_employers: ['病院・薬局', '小学校・幼稚園・保育所', '食品メーカー', '金融一般職', '建設・住宅'], note: '管理栄養士・保育士の就職者数は全国最大級' },
  bairitsu_trend: { ippan: { '2024': '約2〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '阪神鳴尾・武庫川女子大前駅 徒歩7分', walking_min_from_station: 7, nearby_amenities: '西宮・甲子園エリアで生活便利', area_description: '阪神間の住宅地。海が近い' },
  shogakukin: { general_shogakukin: '成績優秀者奨学金、ファミリー入学優遇など独自制度多数', shogakukin_official_url: null },
  career_center: { features: ['資格別の就職支援チーム', '女子大最大級の求人数', '国家試験対策講座'], quality: 5, note: null },
  official_links: { official_url: 'https://www.mukogawa-u.ac.jp/', nyushi_url: 'https://www.mukogawa-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「資格を取って確実に就職する」なら女子大最強クラス。薬学・栄養・保育・看護・建築と選択肢の幅が広い。'
 },
 ippan: {
  departments: [
   { name: '薬学部（6年制）', campus: '浜甲子園', hensachi_min: 42.5, hensachi_max: 47.5, qualifications: ['薬剤師'] },
   { name: '看護学部', campus: '中央', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['看護師', '保健師'] },
   { name: '教育学部', campus: '中央', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['小学校教員', '幼稚園教諭', '保育士'] },
   { name: '食物栄養科学部', campus: '中央', hensachi_min: 45, hensachi_max: 50, qualifications: ['管理栄養士'] },
   { name: '建築学部', campus: '上甲子園', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['一級建築士（要実務）'] },
   { name: '文学部', campus: '中央', hensachi_min: 42.5, hensachi_max: 47.5, qualifications: ['中高教員(国英)', '公認心理師(要院)'] },
   { name: '経営学部', campus: '中央', hensachi_min: 42.5, hensachi_max: 45, qualifications: [] },
   { name: '社会情報学部', campus: '中央', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['IT系資格'] },
   { name: '健康スポーツ科学部', campus: '中央', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['中高教員(体)', '健康運動指導士'] },
  ],
  entry_methods: [ { method_name: '一般選抜（A/B日程）', subjects: '2〜3教科', notes: '評定不問。共通テスト利用あり', bairitsu: '2〜4倍（要確認）' } ],
  hensachi_representative: 45
 },
 sogo: { entry_methods: [ { method_name: '総合型選抜', hyoutei_min: null, hyoutei_note: '学部により条件あり（要確認）', selection_content: ['書類', '面接', '課題'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.3, hyoutei_note: '学部により3.0〜3.8（要確認）', selection_content: ['書類', '基礎テスト', '面接'], bairitsu: '1.5〜3倍（要確認）', notes: '公募枠が広く滋賀からの合格者も多い' } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 5, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 4, 'kigyō_supotsu': 2, 'iryō': 5 },
  strengths: ['管理栄養士・保育士・薬剤師など資格就職で全国最大級の実績', '求人数が女子大随一で就職課の支援が手厚い', '建築など女子大では希少な専門学部'],
  representative_employers: ['病院・調剤薬局', '小学校・保育所', '食品メーカー', '積水ハウス'],
  summary: '「資格×就職」の総合力女子大。'
 }
},
{
 base: {
  id: 'kobe-jogakuin', name: '神戸女学院大学', name_short: '神戸女学院', prefecture: '兵庫県', type: '私立',
  campus_main: '岡田山キャンパス（西宮市）',
  access_from_shiga_min: 110, commute_possible: false, commute_note: '片道約2時間。下宿併用が現実的',
  feature: '1875年創立の伝統女子大学。英文学・音楽で長い歴史を持ち、重要文化財のヴォーリズ建築キャンパスは日本一美しいと評される。少人数リベラルアーツ教育で、英語教育の質は関西女子大随一。2024年に国際学部・心理学部を新設。',
  living_cost: { rent_min: 35000, rent_max: 55000, food_monthly: 22000, monthly_total: 85000, four_year_total: 4100000, note: '西宮の閑静な住宅地。阪急沿線でアクセス良好' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['外資系・商社の一般職', '航空・ホテル業界', '教員（英語・音楽）', '金融'], note: 'エアライン・ホスピタリティ業界に伝統的に強い' },
  bairitsu_trend: { ippan: { '2024': '約1.5〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '阪急門戸厄神駅 徒歩10分', walking_min_from_station: 10, nearby_amenities: '西宮北口が生活圏', area_description: '西宮の高台の緑豊かな文教地区' },
  shogakukin: { general_shogakukin: '入学時成績優秀者奨学金ほか', shogakukin_official_url: null },
  career_center: { features: ['少人数ゆえの個別キャリア支援', '英語力を活かす業界への伝統パイプ'], quality: 4, note: null },
  official_links: { official_url: 'https://www.kobe-c.ac.jp/', nyushi_url: 'https://www.kobe-c.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '英語・国際系・音楽で「質の高い少人数教育」を求める女子生徒向け。ブランドと教育の質は偏差値以上。'
 },
 ippan: {
  departments: [
   { name: '文学部（英文）', campus: '岡田山', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['中高教員(英)', '英検・TOEIC上位'] },
   { name: '国際学部', campus: '岡田山', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['通訳・翻訳系'] },
   { name: '心理学部', campus: '岡田山', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['公認心理師(要院)', '認定心理士'] },
   { name: '音楽学部', campus: '岡田山', hensachi_min: 40, hensachi_max: 45, qualifications: ['中高教員(音楽)'] },
   { name: '人間科学部', campus: '岡田山', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['社会福祉士', '環境系'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期）', subjects: '2〜3教科（英語重視）', notes: '評定不問。英語資格利用方式あり', bairitsu: '1.5〜3倍（要確認）' } ],
  hensachi_representative: 45
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.5, hyoutei_note: '学科により異なる（要確認）', selection_content: ['書類', '面接', '小論文/実技'], bairitsu: '1.5〜2.5倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 2, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 2 },
  strengths: ['航空・ホテル・外資系一般職への伝統的な強さ', '英語教員養成の長い実績', '少人数教育での個別就職支援'],
  representative_employers: ['ANA・JAL系列', '外資系企業', '中高教員(英)', '金融一般職'],
  summary: '英語×少人数教育の伝統校。'
 }
},
{
 base: {
  id: 'yamato-univ', name: '大和大学', name_short: '大和大', prefecture: '大阪府', type: '私立',
  campus_main: '吹田キャンパス（JR吹田駅すぐ）',
  access_from_shiga_min: 100, commute_possible: false, commute_note: '片道約1時間40分。新快速＋JR京都線で通学者もいる',
  feature: '西大和学園が2014年に設立した新興大学。「東の早慶、西の大和」を掲げ、教育・保健医療・政治経済・理工・社会・情報学部を展開。教員採用・看護師国家試験・公務員試験の合格実績を急速に伸ばしている注目校。',
  living_cost: { rent_min: 40000, rent_max: 60000, food_monthly: 25000, monthly_total: 90000, four_year_total: 4300000, note: 'JR吹田駅前で通学利便性は抜群' },
  shingaku_jisseki: { shushoku_rate: '約98%（要確認）', kyoin_count: '教員採用 合格者数を毎年更新中（要確認）', top_employers: ['小中高教員', '病院（看護・リハビリ）', '公務員', '大手企業'], note: '新設ながら国家試験・採用試験の合格率が高水準' },
  bairitsu_trend: { ippan: { '2024': '約3〜6倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR吹田駅 徒歩7分', walking_min_from_station: 7, nearby_amenities: '駅前商店街・商業施設充実', area_description: '大阪都心へのアクセスが良い住宅都市' },
  shogakukin: { general_shogakukin: '特待生制度（入試成績上位者の学費減免）が手厚い', shogakukin_official_url: null },
  career_center: { features: ['教員採用試験対策の徹底指導（西大和学園ノウハウ）', '公務員試験講座', '少人数担任制の進路指導'], quality: 4, note: null },
  official_links: { official_url: 'https://www.yamato-u.ac.jp/', nyushi_url: 'https://www.yamato-u.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '勢いのある新興校で、教員・看護・公務員など「資格・採用試験に直結する学び」に特化。特待生制度で学費を抑えられる可能性も。'
 },
 ippan: {
  departments: [
   { name: '教育学部', campus: '吹田', hensachi_min: 50, hensachi_max: 55, qualifications: ['小学校教員', '中高教員', '幼稚園教諭'] },
   { name: '保健医療学部', campus: '吹田', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['看護師', '理学療法士', '作業療法士', '言語聴覚士'] },
   { name: '政治経済学部', campus: '吹田', hensachi_min: 50, hensachi_max: 55, qualifications: ['公務員試験対策'] },
   { name: '理工学部', campus: '吹田', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['建築士', '技術士補', 'IT系'] },
   { name: '社会学部', campus: '吹田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['社会調査士'] },
   { name: '情報学部', campus: '吹田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['IT系資格'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期・中期・後期）', subjects: '2〜3教科', notes: '評定不問。共通テスト利用あり。特待生選抜を兼ねる', bairitsu: '3〜6倍（要確認）' } ],
  hensachi_representative: 50
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.0, hyoutei_note: '基礎テスト重視で評定基準は緩め（要確認）', selection_content: ['基礎テスト', '書類'], bairitsu: '2〜4倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 5, 'shogakkō': 5, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 4 },
  strengths: ['教員採用試験の合格実績が新設校として異例の伸び', '看護・リハビリ職の国家試験合格率が高い', '公務員試験対策が学部教育に組み込まれている'],
  representative_employers: ['小中高教員', '大阪の基幹病院', '国家・地方公務員'],
  summary: '採用試験・国家試験に強い新興校。'
 }
},
{
 base: {
  id: 'kyoto-yakka', name: '京都薬科大学', name_short: '京薬', prefecture: '京都府', type: '私立',
  campus_main: '山科キャンパス（京都市山科区）',
  access_from_shiga_min: 50, commute_possible: true, commute_note: '草津からJRで山科まで約30分＋徒歩。自宅通学圏',
  feature: '創立140年を超える単科薬科大学の名門。薬剤師国家試験の合格率・製薬企業への就職実績は西日本私立薬学の最高峰。研究力も高く、製薬企業の研究開発職に進む卒業生が多い。',
  living_cost: { rent_min: 0, rent_max: 50000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1500000, note: '滋賀から自宅通学可能（6年制なので総費用は6年分）。学費は薬学私大standard（年約190万円）' },
  shingaku_jisseki: { shushoku_rate: '約100%（薬剤師）', top_employers: ['武田薬品・塩野義など製薬大手', '病院薬剤師', '調剤薬局・ドラッグストア', '厚労省・PMDA'], note: '国家試験合格率は全国私立上位常連' },
  bairitsu_trend: { ippan: { '2024': '約2〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR山科駅・地下鉄御陵駅 徒歩5〜10分', walking_min_from_station: 5, nearby_amenities: '山科駅前で生活便利', area_description: '京都市山科区。滋賀との県境エリア' },
  shogakukin: { general_shogakukin: '特待生制度・同窓会奨学金', shogakukin_official_url: null },
  career_center: { features: ['製薬企業への伝統的パイプ', '国家試験対策カリキュラム'], quality: 5, note: null },
  official_links: { official_url: 'https://www.kyoto-phu.ac.jp/', nyushi_url: 'https://www.kyoto-phu.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '薬剤師志望で滋賀から通える最高峰の私立薬科大。学費は高いが就職はほぼ確実で、製薬研究職への道もある。'
 },
 ippan: {
  departments: [ { name: '薬学部（6年制）', campus: '山科', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['薬剤師'] } ],
  entry_methods: [ { method_name: '一般選抜（A/B方式）', subjects: '英語・数学・化学', notes: '評定不問。共通テスト利用あり', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 55
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.5, hyoutei_note: '3.5以上目安（要確認）', selection_content: ['書類', '基礎学力試験（化学含む）', '面接'], bairitsu: '2〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['薬剤師国家試験合格率は私立トップクラス', '製薬大手の研究・開発・MR職への実績', '病院・薬局への就職はほぼ100%'],
  representative_employers: ['武田薬品', '塩野義製薬', '京大病院ほか病院薬剤部', '大手調剤チェーン'],
  summary: '通学圏の名門薬科大。'
 }
},
{
 base: {
  id: 'osaka-ika-yakka', name: '大阪医科薬科大学', name_short: '大医薬大', prefecture: '大阪府', type: '私立',
  campus_main: '高槻キャンパス（高槻市）',
  access_from_shiga_min: 75, commute_possible: true, commute_note: '草津からJR新快速で高槻まで約45分＋徒歩。自宅通学圏',
  feature: '大阪医科大学と大阪薬科大学が2021年に統合した医療系総合大学。医学部・薬学部・看護学部を持ち、附属病院での臨床教育が充実。JR高槻駅前という抜群の立地。',
  living_cost: { rent_min: 0, rent_max: 55000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1500000, note: '自宅通学可能。医学部は6年制・学費要確認' },
  shingaku_jisseki: { shushoku_rate: '医師・薬剤師・看護師 国家試験合格率いずれも高水準', top_employers: ['附属病院', '関西の基幹病院', '製薬企業'], note: null },
  bairitsu_trend: { ippan: { '2024': '要確認', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR高槻駅 徒歩3分 / 阪急高槻市駅 徒歩8分', walking_min_from_station: 3, nearby_amenities: '高槻駅前で商業施設充実', area_description: '京都と大阪の中間の中核市' },
  shogakukin: { general_shogakukin: '特待生・奨学金制度あり（学部別）', shogakukin_official_url: null },
  career_center: { features: ['附属病院での実習・就職', '国家試験対策'], quality: 4, note: null },
  official_links: { official_url: 'https://www.ompu.ac.jp/', nyushi_url: 'https://www.ompu.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '医・薬・看護がそろう医療系大学に滋賀から通える。医療系志望で通学時間を抑えたい生徒の有力候補。'
 },
 ippan: {
  departments: [
   { name: '医学部（6年制）', campus: '高槻', hensachi_min: 62.5, hensachi_max: 65, qualifications: ['医師'] },
   { name: '薬学部（6年制）', campus: '高槻', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['薬剤師'] },
   { name: '看護学部', campus: '高槻', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['看護師', '保健師'] },
  ],
  entry_methods: [ { method_name: '一般選抜', subjects: '学部別（医: 数理英＋面接 / 薬: 英数化）', notes: '評定不問。共通テスト利用あり', bairitsu: '医 10倍超 / 薬・看護 2〜4倍（要確認）' } ],
  hensachi_representative: 50
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制・薬/看護）', hyoutei_min: 3.5, hyoutei_note: '学部により異なる（要確認）', selection_content: ['書類', '基礎学力試験', '面接'], bairitsu: '2〜3倍（要確認）', notes: '医学部は「至誠仁術」入試等の特色方式あり' } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['医・薬・看護の国家資格に直結', '附属病院を含む関西医療ネットワークへの就職', '高槻駅前の立地で実習・通学の負担が小さい'],
  representative_employers: ['大阪医科薬科大学病院', '関西の基幹病院', '製薬企業'],
  summary: '通学圏の医療系総合大学。'
 }
},
{
 base: {
  id: 'toyota-kogyo', name: '豊田工業大学', name_short: '豊田工大', prefecture: '愛知県', type: '私立',
  campus_main: '名古屋キャンパス（名古屋市天白区）',
  access_from_shiga_min: 150, commute_possible: false, commute_note: '下宿前提（名古屋市内）',
  feature: 'トヨタ自動車が社会貢献として設立した工学単科大学。1学年約100名の超少人数で、学費は私立工学系の半分以下（国立並み）。ほぼ全員に企業実習があり、就職は大手メーカー中心に「日本一就職に強い大学」と評されることも。',
  living_cost: { rent_min: 30000, rent_max: 50000, food_monthly: 25000, monthly_total: 80000, four_year_total: 3800000, note: '学生寮あり（1年次は全寮制）。学費が安いため総費用は国立下宿と同等' },
  shingaku_jisseki: { shushoku_rate: '約100%', top_employers: ['トヨタ自動車', 'デンソー', 'アイシン', '三菱電機', '大学院進学（推薦枠多数）'], note: '求人倍率は1人あたり数十倍' },
  bairitsu_trend: { ippan: { '2024': '約5〜10倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '地下鉄原駅 徒歩10分', walking_min_from_station: 10, nearby_amenities: '名古屋市内の住宅地', area_description: '天白区の落ち着いた環境' },
  shogakukin: { general_shogakukin: '学費自体が私立工学系の半額以下＋各種奨学金', shogakukin_official_url: null },
  career_center: { features: ['トヨタグループへの直結パイプ', '全員参加の企業実習（インターン）', '1学年100名への個別支援'], quality: 5, note: null },
  official_links: { official_url: 'https://www.toyota-ti.ac.jp/', nyushi_url: 'https://www.toyota-ti.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「私立なのに国立並みの学費で、就職は日本トップクラス」という唯一無二の工学大学。理系で製造業志望なら偏差値以上の価値がある。'
 },
 ippan: {
  departments: [ { name: '工学部（先端工学基礎学科）', campus: '名古屋', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['技術士補', '機械・電気系資格'] } ],
  entry_methods: [ { method_name: '一般選抜（前期）', subjects: '数学・理科・英語', notes: '評定不問。共通テスト利用あり。倍率高め', bairitsu: '5〜10倍（要確認）' } ],
  hensachi_representative: 57.5
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 4.0, hyoutei_note: '4.0以上目安（要確認）', selection_content: ['書類', '基礎学力試験', '面接'], bairitsu: '2〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 5, 'kigyō_supotsu': 1, 'iryō': 1 },
  strengths: ['トヨタグループ中心に就職率ほぼ100%', '学費が私立工学系の半分以下', '全員企業実習で実践力がつく'],
  representative_employers: ['トヨタ自動車', 'デンソー', 'アイシン', '豊田自動織機'],
  summary: '就職力で全国屈指の工学単科大。'
 }
},
{
 base: {
  id: 'kanazawa-kogyo', name: '金沢工業大学', name_short: '金沢工大', prefecture: '石川県', type: '私立',
  campus_main: '扇が丘キャンパス（野々市市）',
  access_from_shiga_min: 180, commute_possible: false, commute_note: '下宿前提（金沢・野々市）',
  feature: '「教育付加価値日本一」を掲げる工科系大学。入学時の偏差値に対して就職実績が突出して高いことで全国的に有名。プロジェクト型教育・夢考房での「ものづくり」体験、24時間使える自習環境など、面倒見の良さは日本トップクラス。',
  living_cost: { rent_min: 25000, rent_max: 40000, food_monthly: 22000, monthly_total: 70000, four_year_total: 3400000, note: '北陸は家賃・物価が安く、下宿コストは関西より低い' },
  shingaku_jisseki: { shushoku_rate: '約99%', top_employers: ['大手メーカー（電機・機械・建設）', 'IT企業', '北陸の優良企業'], note: '有名企業400社への実就職率で私大上位常連' },
  bairitsu_trend: { ippan: { '2024': '約1.5〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR金沢駅からバス約30分／野々市駅', walking_min_from_station: 20, nearby_amenities: '大学周辺に学生向け店舗・アパート多数', area_description: '金沢近郊の学園都市' },
  shogakukin: { general_shogakukin: '特待生制度（学費減免）、リーダーシップアワードなど独自制度', shogakukin_official_url: null },
  career_center: { features: ['1年次からのキャリア教育', '企業との共同プロジェクト多数', '学内合同説明会の規模が大きい'], quality: 5, note: null },
  official_links: { official_url: 'https://www.kanazawa-it.ac.jp/', nyushi_url: 'https://www.kanazawa-it.ac.jp/nyusi/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「今の偏差値は控えめでも、工学系で確実に大手に就職したい」生徒に全国で最も適した大学の一つ。面倒見の良さで4年間の成長幅が大きい。'
 },
 ippan: {
  departments: [
   { name: '工学部', campus: '扇が丘', hensachi_min: 42.5, hensachi_max: 47.5, qualifications: ['技術士補', '電気主任技術者ほか'] },
   { name: '情報デザイン学部', campus: '扇が丘', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['IT系資格'] },
   { name: '情報理工学部', campus: '扇が丘', hensachi_min: 42.5, hensachi_max: 47.5, qualifications: ['基本情報技術者ほか'] },
   { name: '建築学部', campus: '扇が丘', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['一級建築士（要実務）'] },
   { name: 'バイオ・化学部', campus: '扇が丘', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['危険物取扱者ほか'] },
  ],
  entry_methods: [ { method_name: '一般選抜（A/B試験）', subjects: '数学・英語・理科', notes: '評定不問。共通テスト利用あり', bairitsu: '1.5〜3倍（要確認）' } ],
  hensachi_representative: 45
 },
 sogo: { entry_methods: [ { method_name: '総合型選抜（AO入学）', hyoutei_min: null, hyoutei_note: '意欲重視・評定基準緩め（要確認）', selection_content: ['書類', '面接', '課題'], bairitsu: '1.2〜2倍（要確認）', notes: 'ものづくりへの意欲を評価' } ] },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.0, hyoutei_note: '3.0以上目安（要確認）', selection_content: ['書類', '面接'], bairitsu: '1.2〜2倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 5, 'kigyō_supotsu': 1, 'iryō': 1 },
  strengths: ['入学偏差値に対する就職実績の伸びが日本屈指', '大手メーカー・IT企業への実就職率が私大上位', 'プロジェクト教育で「作れるエンジニア」になれる'],
  representative_employers: ['パナソニック', '大和ハウス', 'NEC', '北陸電力', 'IT大手'],
  summary: '成長幅で勝負する工科大の雄。'
 }
}
];
