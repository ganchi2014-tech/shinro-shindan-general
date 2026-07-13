// 新規追加(第2弾): 滋賀県内私大3校＋東海・北陸国立4校＋京都府立医科大
// クリティ②の指摘（地元受け皿の欠落・現実的な国公立進学先の欠落）への対応
// 数値はベストエフォート推定。要確認表示前提。アクセス分は草津駅起点目安
module.exports = [
{
 base: {
  id: 'nagahama-bio', name: '長浜バイオ大学', name_short: '長浜バイオ', prefecture: '滋賀県', type: '私立',
  campus_main: '長浜キャンパス（JR田村駅すぐ）', tuition_yen_per_year: 1550000,
  access_from_shiga_min: 60, commute_possible: true, commute_note: '県内自宅通学圏。JR琵琶湖線・田村駅から徒歩約2分',
  feature: 'バイオ専門の単科大学。バイオサイエンス学部の下にフロンティアバイオ・メディカルバイオ・アニマルバイオの3学科を持ち、臨床検査技師課程や動物系の学びまでバイオ一本で深掘りできる。県内私大では珍しい理系専門校。',
  living_cost: { rent_min: 0, rent_max: 35000, food_monthly: 15000, monthly_total: 20000, four_year_total: 1000000, note: '県内自宅通学が基本。長浜の家賃は安い' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['食品・製薬メーカー', '臨床検査センター', '病院（検査）', '大学院進学'], note: '臨床検査技師課程あり（メディカルバイオ）' },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR田村駅 徒歩2分', walking_min_from_station: 2, nearby_amenities: '長浜市街まで1駅', area_description: '琵琶湖北岸ののどかな環境' },
  shogakukin: { general_shogakukin: '特待生制度・独自奨学金あり', shogakukin_official_url: null },
  career_center: { features: ['バイオ業界特化の求人', '臨床検査技師国家試験対策'], quality: 3, note: null },
  official_links: { official_url: 'https://www.nagahama-i-bio.ac.jp/', nyushi_url: 'https://www.nagahama-i-bio.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「家から通える理系・バイオ系」の県内の受け皿。生物が好き・検査技師や食品研究に興味がある生徒に、下宿なしで専門を学べる現実的な選択肢。'
 },
 ippan: {
  departments: [
   { name: 'バイオサイエンス学部（フロンティアバイオ）', campus: '長浜', hensachi_min: 40, hensachi_max: 42.5, qualifications: ['バイオ技術者認定', '食品・製薬系技術職'] },
   { name: 'バイオサイエンス学部（メディカルバイオ）', campus: '長浜', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['臨床検査技師（受験資格・選抜制）'] },
   { name: 'バイオサイエンス学部（アニマルバイオ）', campus: '長浜', hensachi_min: 40, hensachi_max: 42.5, qualifications: ['実験動物技術者', '動物関連産業職'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期・後期）', subjects: '2〜3教科（理科重視）', notes: '評定不問。共通テスト利用あり', bairitsu: '1.5〜2.5倍（要確認）' } ],
  hensachi_representative: 42.5
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.0, hyoutei_note: '3.0前後（要確認）', selection_content: ['書類', '基礎テスト', '面接'], bairitsu: '1.2〜2倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 2, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 3 },
  strengths: ['食品・製薬・検査業界へのバイオ特化就職', '臨床検査技師課程で医療系国家資格も狙える', '県内自宅通学で費用を抑えて理系を学べる'],
  representative_employers: ['食品メーカー', '臨床検査センター', '製薬関連企業'],
  summary: '県内で通えるバイオ専門大学。'
 }
},
{
 base: {
  id: 'seisen', name: '聖泉大学', name_short: '聖泉大', prefecture: '滋賀県', type: '私立',
  campus_main: '彦根キャンパス', tuition_yen_per_year: 1350000,
  access_from_shiga_min: 50, commute_possible: true, commute_note: '県内自宅通学圏。JRひこね芹川駅近く',
  feature: '人間学部と看護学部の2学部からなる小規模大学。少人数で面倒見がよく、看護学部は彦根市立病院など県内医療機関との連携が強い。心理・カウンセリング系の学びも特色。',
  living_cost: { rent_min: 0, rent_max: 35000, food_monthly: 15000, monthly_total: 20000, four_year_total: 1000000, note: '県内自宅通学が基本' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['県内病院（看護）', '福祉施設', '一般企業', '公務員'], note: '看護師国家試験の合格率は高水準（要確認）' },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JRひこね芹川駅 徒歩約10分', walking_min_from_station: 10, nearby_amenities: '彦根市街が生活圏', area_description: '彦根市の住宅エリア' },
  shogakukin: { general_shogakukin: '特待生・独自奨学金あり', shogakukin_official_url: null },
  career_center: { features: ['少人数の個別就職支援', '県内医療機関とのつながり'], quality: 3, note: null },
  official_links: { official_url: 'https://www.seisen.ac.jp/', nyushi_url: 'https://www.seisen.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「県内で看護師・心理系を学びたい、家から通いたい」場合の身近な選択肢。偏差値のハードルが比較的低く、面接・小論文型の入試が中心。'
 },
 ippan: {
  departments: [
   { name: '人間学部（人間心理・カウンセリング）', campus: '彦根', hensachi_min: 37.5, hensachi_max: 40, qualifications: ['認定心理士', '社会福祉主事（任用）'] },
   { name: '看護学部', campus: '彦根', hensachi_min: 42.5, hensachi_max: 45, qualifications: ['看護師', '保健師（選抜制）'] },
  ],
  entry_methods: [ { method_name: '一般選抜', subjects: '2教科＋面接等', notes: '評定不問。共通テスト利用あり', bairitsu: '1.1〜2倍（要確認）' } ],
  hensachi_representative: 40
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 3.0, hyoutei_note: '3.0前後（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '1.1〜1.5倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 2, 'kigyō_supotsu': 1, 'iryō': 4 },
  strengths: ['県内医療機関への看護就職に直結', '少人数で学習・就職支援が手厚い', '自宅通学で費用を抑えられる'],
  representative_employers: ['彦根市立病院など県内病院', '福祉施設', '県内企業'],
  summary: '県内完結の看護・心理系。'
 }
},
{
 base: {
  id: 'biwako-gakuin', name: 'びわこ学院大学', name_short: 'びわこ学院', prefecture: '滋賀県', type: '私立',
  campus_main: '東近江キャンパス', tuition_yen_per_year: 1350000,
  access_from_shiga_min: 45, commute_possible: true, commute_note: '県内自宅通学圏。近江鉄道大学前駅すぐ',
  feature: '教育福祉学部の単科大学。小学校教員・保育士・スポーツ指導者の養成に特化し、滋賀県内の小学校・幼稚園・保育所への就職に強い。少人数の実践型教育。',
  living_cost: { rent_min: 0, rent_max: 35000, food_monthly: 15000, monthly_total: 20000, four_year_total: 1000000, note: '県内自宅通学が基本' },
  shingaku_jisseki: { shushoku_rate: '約98%（要確認）', kyoin_count: '小学校教員・保育士 多数（県内中心・要確認）', top_employers: ['県内小学校', '幼稚園・保育所', '福祉施設', 'スポーツ関連'], note: null },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '近江鉄道 大学前駅 徒歩1分', walking_min_from_station: 1, nearby_amenities: '八日市市街が生活圏', area_description: '東近江市の落ち着いた環境' },
  shogakukin: { general_shogakukin: '特待生・独自奨学金あり', shogakukin_official_url: null },
  career_center: { features: ['県内学校・園への就職ネットワーク', '教員採用・保育士試験の個別対策'], quality: 3, note: null },
  official_links: { official_url: 'https://www.newton.ac.jp/', nyushi_url: 'https://www.newton.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「滋賀で先生・保育士になりたい、家から通いたい」に特化した県内の受け皿。評定・偏差値のハードルは低めで、意欲重視の入試。'
 },
 ippan: {
  departments: [
   { name: '教育福祉学部（子ども学科）', campus: '東近江', hensachi_min: 37.5, hensachi_max: 40, qualifications: ['小学校教諭一種', '幼稚園教諭一種', '保育士'] },
   { name: '教育福祉学部（スポーツ教育学科）', campus: '東近江', hensachi_min: 37.5, hensachi_max: 40, qualifications: ['中学・高校教諭一種（保健体育）', '小学校教諭（コースによる）'] },
  ],
  entry_methods: [ { method_name: '一般選抜', subjects: '2教科', notes: '評定不問。共通テスト利用あり', bairitsu: '1.1〜1.5倍（要確認）' } ],
  hensachi_representative: 37.5
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（公募制）', hyoutei_min: 2.8, hyoutei_note: '2.8〜3.0（要確認）', selection_content: ['書類', '面接'], bairitsu: '1.0〜1.3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 4, keisatsu: 2, 'shōbō': 2, 'kōmuin_ippan': 2, 'kigyō_ippan': 2, 'kigyō_supotsu': 3, 'iryō': 2 },
  strengths: ['県内の小学校・幼稚園・保育所への就職に直結', '保育士・教員志望を少人数で個別支援', '自宅通学で費用最小'],
  representative_employers: ['滋賀県内小学校', '幼稚園・保育所', '福祉施設'],
  summary: '県内で先生・保育士への近道。'
 }
},
{
 base: {
  id: 'nagoya-univ', name: '名古屋大学', name_short: '名大', prefecture: '愛知県', type: '国立',
  campus_main: '東山キャンパス（名古屋市）', tuition_yen_per_year: 535800,
  access_from_shiga_min: 120, commute_possible: false, commute_note: '新幹線利用で片道約2時間。下宿が基本（新幹線通学の例もあり）',
  feature: '旧帝大の一つでノーベル賞受賞者を多数輩出した研究大学。トヨタをはじめ東海圏産業界との結びつきが強く、理系就職は全国屈指。京大阪大と並ぶ最難関国立の一角。',
  living_cost: { rent_min: 35000, rent_max: 55000, food_monthly: 25000, monthly_total: 85000, four_year_total: 4100000, note: '名古屋の家賃は京阪神よりやや安い' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['トヨタ自動車', 'デンソー', '中部電力', '国家公務員', '大学院進学多数'], note: null },
  bairitsu_trend: { ippan: { '2025': '約2.5〜3倍（要確認）' } },
  campus_neighborhood: { nearest_station: '地下鉄名古屋大学駅 直結', walking_min_from_station: 1, nearby_amenities: '本山エリアが生活圏', area_description: '名古屋市東部の文教地区' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['東海圏製造業への圧倒的パイプ', '研究職・院進学のキャリア支援'], quality: 5, note: null },
  official_links: { official_url: 'https://www.nagoya-u.ac.jp/', nyushi_url: 'https://www.nagoya-u.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '京大阪大に次ぐ選択肢として滋賀からも現実的な旧帝大。特に理系・製造業志望なら東海圏就職の強さは阪大以上の面もある。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '東山', hensachi_min: 60, hensachi_max: 60, qualifications: ['中高教員', '学芸員'] },
   { name: '教育学部', campus: '東山', hensachi_min: 60, hensachi_max: 60, qualifications: ['中高教員', '公認心理師(要院)'] },
   { name: '法学部', campus: '東山', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
   { name: '経済学部', campus: '東山', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
   { name: '情報学部', campus: '東山', hensachi_min: 57.5, hensachi_max: 62.5, qualifications: ['ITエンジニア職', '統計検定'] },
   { name: '理学部', campus: '東山', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['中高教員(数理)'] },
   { name: '工学部', campus: '東山', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['技術士補', '建築士（環境土木系）'] },
   { name: '農学部', campus: '東山', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: [] },
   { name: '医学部（医・保健）', campus: '鶴舞・大幸', hensachi_min: 52.5, hensachi_max: 67.5, qualifications: ['医師', '看護師', '理学療法士', '検査技師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 75〜85%が目安。評定不問', bairitsu: '2.5〜3倍（要確認）' } ],
  hensachi_representative: 60, kyotsu_ratio: '75〜85%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（学部別）', hyoutei_min: null, hyoutei_note: '学部により条件あり（要確認）', selection_content: ['書類', '面接', '共通テスト'], bairitsu: '2〜4倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 5, 'kigyō_ippan': 5, 'kigyō_supotsu': 2, 'iryō': 5 },
  strengths: ['トヨタ系はじめ東海圏製造業への就職は全国最強クラス', '研究職・院進学ルートが確立', '国家公務員・インフラ系にも強い'],
  representative_employers: ['トヨタ自動車', 'デンソー', '三菱重工', 'NTT', '国家公務員'],
  summary: '東海圏の頂点・旧帝大。'
 }
},
{
 base: {
  id: 'gifu-univ', name: '岐阜大学', name_short: '岐阜大', prefecture: '岐阜県', type: '国立',
  campus_main: '柳戸キャンパス（岐阜市）', tuition_yen_per_year: 535800,
  access_from_shiga_min: 90, commute_possible: true, commute_note: '米原経由JRで岐阜駅まで約70分＋バス。通学圏ぎりぎり・下宿併用',
  feature: '教育・医・工・応用生物（共同獣医学科あり）を持つ地方国立の中核校。名古屋大学と法人統合（東海国立大学機構）しており、教育資源の共有が進む。獣医学科は東海圏で貴重。',
  living_cost: { rent_min: 25000, rent_max: 40000, food_monthly: 22000, monthly_total: 70000, four_year_total: 3400000, note: '岐阜の家賃・物価は安い。通学も一応可能' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['岐阜県・市職員', '教員', '東海圏メーカー', '病院'], note: null },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR岐阜駅からバス約25分', walking_min_from_station: 30, nearby_amenities: '大学周辺に学生向け店舗', area_description: '岐阜市郊外の文教エリア' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['東海圏の教員・公務員への実績', '医・獣医の専門キャリア'], quality: 3, note: null },
  official_links: { official_url: 'https://www.gifu-u.ac.jp/', nyushi_url: 'https://www.gifu-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '滋賀（湖東・湖北）からは通学も視野に入る国立。獣医志望・教員志望・工学系で「国立にこだわるが京阪神は厳しい」層の現実的な選択肢。'
 },
 ippan: {
  departments: [
   { name: '教育学部', campus: '柳戸', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['小学校教員', '中高教員（全教科）'] },
   { name: '地域科学部', campus: '柳戸', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['公務員試験に有利'] },
   { name: '工学部', campus: '柳戸', hensachi_min: 45, hensachi_max: 50, qualifications: ['技術士補', '建築士（社会基盤）'] },
   { name: '応用生物科学部（共同獣医学科含む）', campus: '柳戸', hensachi_min: 47.5, hensachi_max: 62.5, qualifications: ['獣医師（共同獣医）', '食品衛生管理者（任用）'] },
   { name: '医学部（医・看護）', campus: '柳戸', hensachi_min: 50, hensachi_max: 65, qualifications: ['医師', '看護師', '保健師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 58〜72%が目安（医・獣医は80%超）。評定不問', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 50, kyotsu_ratio: '58〜72%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜', hyoutei_min: 4.0, hyoutei_note: '学部により4.0〜4.3（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 4, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['岐阜・東海圏の教員・公務員に強い', '共同獣医学科は東海圏唯一級', '名大との機構統合で研究環境が向上'],
  representative_employers: ['岐阜県庁', '小中学校教員', '東海圏メーカー', '病院'],
  summary: '通える範囲の堅実な地方国立。'
 }
},
{
 base: {
  id: 'mie-univ', name: '三重大学', name_short: '三重大', prefecture: '三重県', type: '国立',
  campus_main: '上浜キャンパス（津市）', tuition_yen_per_year: 535800,
  access_from_shiga_min: 130, commute_possible: false, commute_note: '草津線・関西本線経由で片道2時間超。下宿が基本',
  feature: '人文・教育・医・工・生物資源の5学部が1キャンパスに集まる地方国立。海に面したキャンパスで、水産・海洋系の学びも特色。三重県内就職と東海圏就職の両方に実績。',
  living_cost: { rent_min: 25000, rent_max: 40000, food_monthly: 22000, monthly_total: 70000, four_year_total: 3400000, note: '津市の生活費は安い' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['三重県・市職員', '教員', '東海圏メーカー', '病院'], note: null },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '近鉄江戸橋駅 徒歩15分', walking_min_from_station: 15, nearby_amenities: '津市街が生活圏', area_description: '伊勢湾に面した開放的なキャンパス' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['県内公務員・教員への実績', '5学部ワンキャンパスの一体感'], quality: 3, note: null },
  official_links: { official_url: 'https://www.mie-u.ac.jp/', nyushi_url: 'https://www.mie-u.ac.jp/exam/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '甲賀・湖南エリアからは草津線で通じる縁のある国立。共テ6割前後から狙える学部もあり、「国立で教員・公務員・技術職」の堅実路線に合う。'
 },
 ippan: {
  departments: [
   { name: '人文学部', campus: '上浜', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(国社英)', '学芸員'] },
   { name: '教育学部', campus: '上浜', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['小学校教員', '中高教員（全教科）'] },
   { name: '工学部', campus: '上浜', hensachi_min: 45, hensachi_max: 50, qualifications: ['技術士補', '建築士（受験資格）'] },
   { name: '生物資源学部', campus: '上浜', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['食品衛生管理者（任用）', '海技士（水産）'] },
   { name: '医学部（医・看護）', campus: '上浜', hensachi_min: 50, hensachi_max: 65, qualifications: ['医師', '看護師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 58〜70%が目安（医は80%超）。評定不問', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 50, kyotsu_ratio: '58〜70%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜', hyoutei_min: 4.0, hyoutei_note: '学部により3.8〜4.3（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 4, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['三重県内の教員・公務員採用に強い', '水産・海洋・農業系の学びが特色', 'ワンキャンパスで転学部級の幅広い履修'],
  representative_employers: ['三重県庁', '小中学校教員', '中部電力', '病院'],
  summary: '堅実路線の中堅国立。'
 }
},
{
 base: {
  id: 'fukui-univ', name: '福井大学', name_short: '福井大', prefecture: '福井県', type: '国立',
  campus_main: '文京キャンパス（福井市）', tuition_yen_per_year: 535800,
  access_from_shiga_min: 110, commute_possible: false, commute_note: '米原・敦賀経由で片道約2時間。下宿が基本',
  feature: '「就職率の高さ」で全国の国立大トップ常連として知られる実就職重視の大学。教育・工・医・国際地域の4学部で、教員就職率も全国上位。北陸新幹線の敦賀延伸でアクセスが改善。',
  living_cost: { rent_min: 25000, rent_max: 40000, food_monthly: 22000, monthly_total: 65000, four_year_total: 3200000, note: '福井の家賃・物価は全国最安クラス' },
  shingaku_jisseki: { shushoku_rate: '約98%（国立大トップ常連）', kyoin_count: '教員就職率 全国上位常連', top_employers: ['福井県・市職員', '教員', '北陸のメーカー・電力', '病院'], note: null },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '福井鉄道 田原町駅 徒歩5分', walking_min_from_station: 5, nearby_amenities: '福井市街が生活圏', area_description: '福井市の文教エリア' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['実就職率で国立大随一の実績', '教員採用・地元企業への手厚い支援'], quality: 5, note: null },
  official_links: { official_url: 'https://www.u-fukui.ac.jp/', nyushi_url: 'https://www.u-fukui.ac.jp/nyushi/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「国立で確実に就職」を最優先するなら偏差値以上の価値がある大学。湖北からは敦賀経由で心理的距離も近い。生活費の安さも大きい。'
 },
 ippan: {
  departments: [
   { name: '教育学部', campus: '文京', hensachi_min: 45, hensachi_max: 50, qualifications: ['小学校教員', '中高教員（全教科）'] },
   { name: '工学部', campus: '文京', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['技術士補', '建築士（受験資格）'] },
   { name: '国際地域学部', campus: '文京', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['公務員試験に有利', 'TOEIC上位級'] },
   { name: '医学部（医・看護）', campus: '松岡', hensachi_min: 47.5, hensachi_max: 62.5, qualifications: ['医師', '看護師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 55〜68%が目安（医は80%前後）。評定不問', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 47.5, kyotsu_ratio: '55〜68%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜', hyoutei_min: 3.8, hyoutei_note: '学部により3.8〜4.3（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 5, 'shogakkō': 5, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['実就職率・教員就職率で国立大トップ常連', '北陸の優良メーカー・電力への安定就職', '生活費が安く総費用を抑えられる'],
  representative_employers: ['福井県庁', '小中学校教員', '北陸電力', 'セーレンなど地元優良企業'],
  summary: '就職力で選ぶ国立。'
 }
},
{
 base: {
  id: 'kyoto-furitsu-ika', name: '京都府立医科大学', name_short: '京府医', prefecture: '京都府', type: '公立',
  campus_main: '河原町キャンパス（京都市上京区）', tuition_yen_per_year: 535800,
  access_from_shiga_min: 70, commute_possible: true, commute_note: '草津からJR＋京阪で約70分。自宅通学圏',
  feature: '1872年創立の日本有数の歴史を持つ公立医科大学。医学科と看護学科のみの医療特化で、京都府立病院群との連携による臨床教育が強み。学費は公立標準で、私立医学部の10分の1以下。',
  living_cost: { rent_min: 0, rent_max: 55000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1500000, note: '自宅通学可能（医学科は6年制）' },
  shingaku_jisseki: { shushoku_rate: '医師国家試験合格率 約95%（要確認）', top_employers: ['京都府立医大附属病院', '京都府内基幹病院'], note: null },
  bairitsu_trend: { ippan: { '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '京阪神宮丸太町駅 徒歩10分', walking_min_from_station: 10, nearby_amenities: '御所東の落ち着いた環境', area_description: '京都市中心部の歴史あるエリア' },
  shogakukin: { general_shogakukin: '日本学生支援機構、府の修学資金制度', shogakukin_official_url: null },
  career_center: { features: ['府立病院群での臨床実習', '京都府の地域医療との連携'], quality: 4, note: null },
  official_links: { official_url: 'https://www.kpu-m.ac.jp/', nyushi_url: 'https://www.kpu-m.ac.jp/doc/exam/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '滋賀から通学圏の公立医大。医学科は関西の公立医大の名門で、滋賀医大と並ぶ「自宅から通える医学部」の選択肢。'
 },
 ippan: {
  departments: [
   { name: '医学部 医学科（6年制）', campus: '河原町', hensachi_min: 62.5, hensachi_max: 65, qualifications: ['医師（国家試験受験資格）'] },
   { name: '医学部 看護学科', campus: '広小路', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['看護師', '保健師（選抜制）', '助産師（選抜制）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次（数理英・面接）', notes: '医学科は共テ得点率 80%以上が目安。評定不問', bairitsu: '2.5〜4倍（要確認）' } ],
  hensachi_representative: 62.5, kyotsu_ratio: '医80%〜 / 看護60%〜'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（府内枠等）', hyoutei_min: 4.3, hyoutei_note: '医学科4.3以上・府内高校対象枠あり（要確認）', selection_content: ['書類', '面接', '小論文', '共通テスト'], bairitsu: '2〜4倍（要確認）', notes: '滋賀からは一般選抜が基本' } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 1, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['歴史ある公立医大で臨床教育の評価が高い', '公立学費で医師を目指せる', '京都府内医療ネットワークに直結'],
  representative_employers: ['府立医大附属病院', '京都府内基幹病院'],
  summary: '通学圏で医師を目指すもう一つの道。'
 }
}
];
