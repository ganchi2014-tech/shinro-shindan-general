// 新規追加: 国公立12校（数値は2026-07時点のベストエフォート推定。要確認表示前提）
// 滋賀からのアクセス分数は草津駅起点の目安
module.exports = [
{
 base: {
  id: 'shiga-univ', name: '滋賀大学', name_short: '滋賀大', prefecture: '滋賀県', type: '国立',
  campus_main: '彦根キャンパス（経済）・大津キャンパス（教育）・彦根（データサイエンス）',
  access_from_shiga_min: 40, commute_possible: true, commute_note: '県内なので自宅通学が基本。彦根へはJR琵琶湖線',
  feature: '日本初のデータサイエンス学部を持つ地元国立大学。経済学部は旧彦根高商以来の伝統で、滋賀銀行はじめ地元金融・企業への就職に圧倒的に強い。学費は国立標準（年約53.6万円）で経済的負担が小さい。',
  living_cost: { rent_min: 0, rent_max: 45000, food_monthly: 15000, monthly_total: 20000, four_year_total: 1000000, note: '自宅通学なら生活費は最小限。彦根で下宿しても家賃3〜4.5万円と安い' },
  shingaku_jisseki: { shushoku_rate: '約98%（要確認）', kyoin_count: '教育学部から小学校教員 約100名/年（滋賀県内最多）', top_employers: ['滋賀銀行', '京都銀行', '国家公務員・滋賀県庁', '大手メーカー', 'IT企業（データサイエンス）', '小中学校教員'], note: 'データサイエンス学部は初年度からIT大手・金融の引き合い多数' },
  bairitsu_trend: { ippan: { '2024': '要確認', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR彦根駅（経済・DS）/ 京阪石場駅（教育）', walking_min_from_station: 15, nearby_amenities: '彦根駅前に生活施設一通りあり', area_description: '彦根城のふもとの落ち着いた城下町' },
  shogakukin: { general_shogakukin: '日本学生支援機構、滋賀大学独自の授業料免除制度（家計基準）', shogakukin_official_url: null },
  career_center: { features: ['地元金融・県庁への強力なOBネットワーク', '教員採用試験対策（滋賀県特化）', 'データサイエンス学部専用の企業マッチング'], quality: 4, note: null },
  official_links: { official_url: 'https://www.shiga-u.ac.jp/', nyushi_url: 'https://www.shiga-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「家から通える国立大学」として滋賀の高校生の最有力候補。学費・通学費を最小化しつつ、地元就職（金融・公務員・教員）で最強レベルの実績。データサイエンス学部は全国区の人気。'
 },
 ippan: {
  departments: [
   { name: '経済学部', campus: '彦根', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(社)', '税理士・会計士基礎'] },
   { name: '教育学部', campus: '大津', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['小学校教員', '中高教員', '幼稚園教諭'] },
   { name: 'データサイエンス学部', campus: '彦根', hensachi_min: 50, hensachi_max: 55, qualifications: ['統計検定', 'IT系資格'] },
  ],
  entry_methods: [
   { method_name: '一般選抜（前期日程）', subjects: '共通テスト（5教科7科目目安）＋二次試験', notes: '共テ得点率目安 60〜70%。評定不問', bairitsu: '2〜4倍（要確認）' },
   { method_name: '一般選抜（後期日程）', subjects: '共通テスト＋小論文等', notes: '前期より高得点率が必要', bairitsu: '3〜7倍（要確認）' },
  ],
  hensachi_representative: 50, kyotsu_ratio: '60〜70%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜', hyoutei_min: 4.0, hyoutei_note: '学部により4.0〜4.3以上（要確認）', selection_content: ['書類', '面接', '小論文', '共通テスト（課す学部あり）'], bairitsu: '2〜3倍（要確認）', notes: '地元枠・専門高校枠あり。教育学部は面接重視' } ] },
 employment: {
  ratings: { kyoin: 5, 'shogakkō': 5, keisatsu: 3, 'shōbō': 3, 'kōmuin_ippan': 5, 'kigyō_ippan': 4, 'kigyō_supotsu': 2, 'iryō': 1 },
  strengths: ['滋賀県内の小学校教員採用は県内最多クラス', '滋賀銀行・県庁など地元優良就職に直結', 'データサイエンス学部はIT・金融大手から高評価'],
  representative_employers: ['滋賀銀行', '滋賀県庁', '小中学校教員', 'NTTデータ', '京セラ'],
  summary: '地元志向なら費用対効果が最も高い選択肢。'
 }
},
{
 base: {
  id: 'shiga-kenritsu', name: '滋賀県立大学', name_short: '滋賀県立大', prefecture: '滋賀県', type: '公立',
  campus_main: '彦根キャンパス',
  access_from_shiga_min: 50, commute_possible: true, commute_note: '県内自宅通学圏。JR南彦根からバス',
  feature: '環境科学・工学・人間文化・人間看護の4学部。県内出身者は入学金が半額。琵琶湖畔の広大なキャンパスで、環境分野は全国的に評価が高い。少人数教育で教員との距離が近い。',
  living_cost: { rent_min: 0, rent_max: 40000, food_monthly: 15000, monthly_total: 20000, four_year_total: 1000000, note: '自宅通学が基本。学費は公立標準（年約53.6万円）＋県内生は入学金優遇' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['滋賀県庁・県内市役所', '京セラ', 'ダイキン工業', '建設コンサルタント', '病院（看護）'], note: '看護学部は県内病院への就職ほぼ100%' },
  bairitsu_trend: { ippan: { '2024': '要確認', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR南彦根駅からバス約10分', walking_min_from_station: 30, nearby_amenities: '大学周辺は静か。南彦根駅前に商業施設', area_description: '琵琶湖畔の開放的な環境' },
  shogakukin: { general_shogakukin: '日本学生支援機構、県立大独自の授業料減免', shogakukin_official_url: null },
  career_center: { features: ['県内企業・自治体との太いパイプ', '看護・工学の専門職支援'], quality: 3, note: null },
  official_links: { official_url: 'https://www.usp.ac.jp/', nyushi_url: 'https://www.usp.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '県内生への経済優遇＋自宅通学で、4年間の総費用を最も抑えられる進学先の一つ。看護師志望・環境/工学系志望で県内に残りたい生徒に最適。'
 },
 ippan: {
  departments: [
   { name: '環境科学部', campus: '彦根', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['技術士補', '環境系資格'] },
   { name: '工学部', campus: '彦根', hensachi_min: 45, hensachi_max: 50, qualifications: ['機械/電気系資格'] },
   { name: '人間文化学部', campus: '彦根', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['学芸員', '管理栄養士（生活栄養）'] },
   { name: '人間看護学部', campus: '彦根', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['看護師', '保健師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率目安 55〜65%。評定不問', bairitsu: '2〜4倍（要確認）' }, { method_name: '一般選抜（後期日程）', subjects: '共通テスト＋面接/小論文', notes: null, bairitsu: '3〜8倍（要確認）' } ],
  hensachi_representative: 47.5, kyotsu_ratio: '55〜65%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（県内高校枠あり）', hyoutei_min: 4.0, hyoutei_note: '学部により3.8〜4.3（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '2〜3倍（要確認）', notes: '県内枠は地元生徒に有利' } ] },
 employment: {
  ratings: { kyoin: 2, 'shogakkō': 1, keisatsu: 3, 'shōbō': 3, 'kōmuin_ippan': 4, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['看護学部は県内医療機関への就職がほぼ確実', '県庁・市役所など地元公務員に強い', '工学部は県内製造業から安定した求人'],
  representative_employers: ['滋賀県庁', '県内総合病院', '京セラ', '村田製作所'],
  summary: '県内完結型のキャリアなら最有力。'
 }
},
{
 base: {
  id: 'shiga-ika', name: '滋賀医科大学', name_short: '滋賀医大', prefecture: '滋賀県', type: '国立',
  campus_main: '瀬田キャンパス（大津市）',
  access_from_shiga_min: 20, commute_possible: true, commute_note: 'JR瀬田駅からバス。県内自宅通学可',
  feature: '医学部医学科と看護学科のみの医科大学。県内唯一の医学部で、地域医療枠など滋賀の高校生向けの入試枠がある。附属病院での実習環境が整い、卒業後の県内医療キャリアに直結。',
  living_cost: { rent_min: 0, rent_max: 45000, food_monthly: 15000, monthly_total: 20000, four_year_total: 1500000, note: '医学科は6年制なので総費用は6年分で計算。国立なので学費は年約53.6万円' },
  shingaku_jisseki: { shushoku_rate: '医師国家試験合格率 約95%（要確認）', top_employers: ['滋賀医大附属病院', '県内・京阪神の病院'], note: '看護学科は保健師・助産師課程あり' },
  bairitsu_trend: { ippan: { '2024': '要確認', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR瀬田駅からバス約15分', walking_min_from_station: 40, nearby_amenities: '瀬田駅周辺に生活施設', area_description: '大津市南部の文教エリア（龍谷大瀬田キャンパス隣接）' },
  shogakukin: { general_shogakukin: '日本学生支援機構、地域医療枠の修学資金貸与（返還免除条件あり）', shogakukin_official_url: null },
  career_center: { features: ['地域医療枠で県内勤務とセットの学費支援', '附属病院での豊富な臨床実習'], quality: 4, note: null },
  official_links: { official_url: 'https://www.shiga-med.ac.jp/', nyushi_url: 'https://www.shiga-med.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '医師・看護師を目指す滋賀の生徒の第一候補。地域医療枠は学力上位で県内医療に貢献したい生徒に大きなチャンス。'
 },
 ippan: {
  departments: [
   { name: '医学部 医学科（6年制）', campus: '瀬田', hensachi_min: 65, hensachi_max: 67.5, qualifications: ['医師'] },
   { name: '医学部 看護学科', campus: '瀬田', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['看護師', '保健師', '助産師（選抜）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次（数理英・面接）', notes: '医学科は共テ得点率 82%以上が目安。評定不問', bairitsu: '3〜5倍（要確認）' } ],
  hensachi_representative: 65, kyotsu_ratio: '医82%〜 / 看護60%〜'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（地域医療枠等）', hyoutei_min: 4.3, hyoutei_note: '医学科4.3以上（要確認）', selection_content: ['書類', '面接', '小論文', '共通テスト'], bairitsu: '2〜4倍（要確認）', notes: '県内高校出身者対象の枠あり' } ] },
 employment: {
  ratings: { kyoin: 1, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 2, 'kigyō_ippan': 1, 'kigyō_supotsu': 1, 'iryō': 5 },
  strengths: ['県内唯一の医学部。医師・看護師への最短ルート', '地域医療枠は学費支援と県内キャリアがセット'],
  representative_employers: ['滋賀医大附属病院', '県内基幹病院'],
  summary: '医療系最上位志望者向け。'
 }
},
{
 base: {
  id: 'kyoto-univ', name: '京都大学', name_short: '京大', prefecture: '京都府', type: '国立',
  campus_main: '吉田キャンパス（京都市左京区)',
  access_from_shiga_min: 60, commute_possible: true, commute_note: '草津からJR＋バスで約1時間。自宅通学者も多い',
  feature: '西日本の最高学府。自由の学風で知られ、研究力は世界トップクラス。滋賀からは自宅通学圏で、学費は国立標準。全国から集まる学生との出会いも大きな財産になる。',
  living_cost: { rent_min: 0, rent_max: 60000, food_monthly: 20000, monthly_total: 30000, four_year_total: 1500000, note: '自宅通学可能。下宿する場合は左京区で家賃4.5〜6万円' },
  shingaku_jisseki: { shushoku_rate: '約97%（院進学者多数）', top_employers: ['国家公務員総合職', '大手メーカー研究職', '商社・金融・コンサル', '大学院進学（理系は約8割）'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2.5〜3.5倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '京阪出町柳駅 徒歩15分 / 市バス百万遍', walking_min_from_station: 15, nearby_amenities: '学生街で安い食堂・書店多数', area_description: '京都市左京区の落ち着いた文教地区' },
  shogakukin: { general_shogakukin: '日本学生支援機構、京大独自の授業料免除・給付奨学金', shogakukin_official_url: null },
  career_center: { features: ['研究職・国家公務員への圧倒的実績', '院進学前提のキャリア設計支援'], quality: 5, note: null },
  official_links: { official_url: 'https://www.kyoto-u.ac.jp/', nyushi_url: 'https://www.kyoto-u.ac.jp/ja/admissions', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '滋賀から自宅通学できる日本トップ大学。挑戦圏の学力があるなら、費用面でも将来の選択肢の広さでも最高の投資対効果。'
 },
 ippan: {
  departments: [
   { name: '総合人間学部', campus: '吉田', hensachi_min: 65, hensachi_max: 67.5, qualifications: [] },
   { name: '文学部', campus: '吉田', hensachi_min: 65, hensachi_max: 67.5, qualifications: ['中高教員', '学芸員'] },
   { name: '法学部', campus: '吉田', hensachi_min: 67.5, hensachi_max: 67.5, qualifications: ['法曹（要院）'] },
   { name: '経済学部', campus: '吉田', hensachi_min: 65, hensachi_max: 67.5, qualifications: ['公認会計士'] },
   { name: '理学部', campus: '吉田', hensachi_min: 65, hensachi_max: 67.5, qualifications: ['中高教員(数理)'] },
   { name: '工学部', campus: '吉田', hensachi_min: 62.5, hensachi_max: 67.5, qualifications: ['建築士', '技術士補'] },
   { name: '農学部', campus: '吉田', hensachi_min: 62.5, hensachi_max: 65, qualifications: ['食品・バイオ系'] },
   { name: '教育学部', campus: '吉田', hensachi_min: 65, hensachi_max: 65, qualifications: ['中高教員', '公認心理師(要院)'] },
   { name: '医学部（医・人間健康科学）', campus: '吉田', hensachi_min: 60, hensachi_max: 72.5, qualifications: ['医師', '看護師', '理学療法士'] },
   { name: '薬学部', campus: '吉田', hensachi_min: 65, hensachi_max: 65, qualifications: ['薬剤師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験（学部別・記述重視）', notes: '共テ得点率 80%以上が目安。二次の配点比率が高い。評定不問', bairitsu: '2.5〜3.5倍' } ],
  hensachi_representative: 65, kyotsu_ratio: '80%〜'
 },
 sogo: { entry_methods: [ { method_name: '特色入試', hyoutei_min: null, hyoutei_note: '学部により学業成績上位等の条件', selection_content: ['書類', '論文', '面接', '共通テスト'], bairitsu: '3〜10倍（要確認)', notes: '学ぶ意欲と突出した実績を評価。募集人数は少ない' } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 5, 'kigyō_ippan': 5, 'kigyō_supotsu': 2, 'iryō': 4 },
  strengths: ['研究職・国家公務員総合職で全国トップクラス', '大手企業からの評価は無条件に高い', '院進学で研究者・専門職への道が開ける'],
  representative_employers: ['国家公務員総合職', 'トヨタ自動車', 'ソニー', '三菱商事', '外資コンサル'],
  summary: '最難関だが滋賀から通える最高の選択肢。'
 }
},
{
 base: {
  id: 'osaka-univ', name: '大阪大学', name_short: '阪大', prefecture: '大阪府', type: '国立',
  campus_main: '豊中・吹田・箕面キャンパス',
  access_from_shiga_min: 110, commute_possible: false, commute_note: '通学は片道約2時間。下宿する学生が多い',
  feature: '旧帝大の一つで学生数国内最大級の国立総合大学。理系の研究力・産学連携に定評があり、外国語学部（箕面）は言語の選択肢が全国一。就職・院進学とも全国トップクラス。',
  living_cost: { rent_min: 40000, rent_max: 60000, food_monthly: 25000, monthly_total: 90000, four_year_total: 4300000, note: '豊中・吹田周辺で下宿。学費は国立標準' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['大手メーカー', '製薬・化学', '商社・金融', '国家公務員', '大学院進学多数'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '阪急石橋阪大前駅（豊中）/ モノレール阪大病院前（吹田）', walking_min_from_station: 15, nearby_amenities: '石橋商店街など学生向けの店が充実', area_description: '北摂の住宅地。京阪神いずれもアクセス良好' },
  shogakukin: { general_shogakukin: '日本学生支援機構、阪大独自の授業料免除', shogakukin_official_url: null },
  career_center: { features: ['理系の研究職・技術職への強力な実績', '企業との共同研究からの就職パイプ'], quality: 5, note: null },
  official_links: { official_url: 'https://www.osaka-u.ac.jp/', nyushi_url: 'https://www.osaka-u.ac.jp/ja/admissions', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '京大に次ぐ関西国立の頂点。理系・外国語志望で全国レベルを目指すなら第一候補。下宿前提だが国立なので総費用は大手私大下宿と大差ない。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '豊中', hensachi_min: 62.5, hensachi_max: 65, qualifications: ['中高教員', '学芸員'] },
   { name: '法学部', campus: '豊中', hensachi_min: 62.5, hensachi_max: 65, qualifications: [] },
   { name: '経済学部', campus: '豊中', hensachi_min: 62.5, hensachi_max: 65, qualifications: [] },
   { name: '理学部', campus: '豊中', hensachi_min: 60, hensachi_max: 62.5, qualifications: ['中高教員(数理)'] },
   { name: '工学部', campus: '吹田', hensachi_min: 60, hensachi_max: 62.5, qualifications: ['建築士', '技術士補'] },
   { name: '基礎工学部', campus: '豊中', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
   { name: '外国語学部', campus: '箕面', hensachi_min: 57.5, hensachi_max: 62.5, qualifications: ['中高教員(英他)'] },
   { name: '人間科学部', campus: '吹田', hensachi_min: 62.5, hensachi_max: 62.5, qualifications: ['公認心理師(要院)', '社会福祉士'] },
   { name: '医学部（医・保健）', campus: '吹田', hensachi_min: 57.5, hensachi_max: 70, qualifications: ['医師', '看護師', '放射線技師', '検査技師'] },
   { name: '薬学部', campus: '吹田', hensachi_min: 62.5, hensachi_max: 62.5, qualifications: ['薬剤師'] },
   { name: '歯学部', campus: '吹田', hensachi_min: 60, hensachi_max: 60, qualifications: ['歯科医師'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 75〜85%が目安。評定不問', bairitsu: '2〜3倍' } ],
  hensachi_representative: 62.5, kyotsu_ratio: '75〜85%'
 },
 sogo: { entry_methods: [ { method_name: '総合型選抜・学校推薦型選抜（学部別）', hyoutei_min: null, hyoutei_note: '学部により条件あり', selection_content: ['書類', '面接', '小論文', '共通テスト'], bairitsu: '3〜8倍（要確認）', notes: '共通テストを課す方式が中心' } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 5, 'kigyō_ippan': 5, 'kigyō_supotsu': 2, 'iryō': 5 },
  strengths: ['理系技術職・研究職で全国トップクラスの実績', '製薬・化学・重工など関西本社企業に太いパイプ', '外国語学部は商社・国際機関に強い'],
  representative_employers: ['パナソニック', 'ダイキン工業', '武田薬品', '住友商事', '国家公務員'],
  summary: '関西理系の頂点候補。'
 }
},
{
 base: {
  id: 'kobe-univ', name: '神戸大学', name_short: '神大', prefecture: '兵庫県', type: '国立',
  campus_main: '六甲台キャンパス（神戸市灘区）',
  access_from_shiga_min: 130, commute_possible: false, commute_note: '片道2時間超。下宿推奨',
  feature: '旧三商大の流れをくむ経営学部が看板の国立総合大学。文系（経営・経済・法）の就職力は関西国立で随一。六甲山麓から神戸の街と海を見下ろすキャンパスは全国有数のロケーション。',
  living_cost: { rent_min: 40000, rent_max: 60000, food_monthly: 25000, monthly_total: 90000, four_year_total: 4300000, note: '六甲周辺で下宿。坂が多いので原付・バス利用者多数' },
  shingaku_jisseki: { shushoku_rate: '約97%', top_employers: ['大手金融・商社', 'メーカー', '監査法人', '国家・地方公務員'], note: '経営学部は公認会計士合格者数で全国上位' },
  bairitsu_trend: { ippan: { '2024': '約2.5〜3.5倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '阪急六甲駅からバス/徒歩20分', walking_min_from_station: 20, nearby_amenities: '六甲・三宮が生活圏で買い物便利', area_description: '神戸市灘区の高台文教地区' },
  shogakukin: { general_shogakukin: '日本学生支援機構、神戸大基金奨学金・授業料免除', shogakukin_official_url: null },
  career_center: { features: ['金融・商社・監査法人への伝統的パイプ', '経営学部の会計士講座'], quality: 5, note: null },
  official_links: { official_url: 'https://www.kobe-u.ac.jp/', nyushi_url: 'https://www.kobe-u.ac.jp/ja/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '文系で「ビジネス・会計・金融」の全国レベルを狙うなら関西国立の第一候補。京大阪大よりわずかに入りやすく、就職力は互角以上の分野もある。'
 },
 ippan: {
  departments: [
   { name: '経営学部', campus: '六甲台', hensachi_min: 62.5, hensachi_max: 62.5, qualifications: ['公認会計士', '税理士'] },
   { name: '経済学部', campus: '六甲台', hensachi_min: 60, hensachi_max: 62.5, qualifications: [] },
   { name: '法学部', campus: '六甲台', hensachi_min: 60, hensachi_max: 62.5, qualifications: ['法曹（要院）'] },
   { name: '文学部', campus: '六甲台', hensachi_min: 60, hensachi_max: 62.5, qualifications: ['中高教員', '学芸員'] },
   { name: '国際人間科学部', campus: '六甲台', hensachi_min: 57.5, hensachi_max: 62.5, qualifications: ['中高教員', '社会福祉士'] },
   { name: '理学部', campus: '六甲台', hensachi_min: 55, hensachi_max: 60, qualifications: ['中高教員(数理)'] },
   { name: '工学部', campus: '六甲台', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['建築士', '技術士補'] },
   { name: '農学部', campus: '六甲台', hensachi_min: 57.5, hensachi_max: 60, qualifications: [] },
   { name: '海洋政策科学部', campus: '深江', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['海技士'] },
   { name: '医学部（医・保健）', campus: '楠・名谷', hensachi_min: 55, hensachi_max: 67.5, qualifications: ['医師', '看護師', '理学療法士', '作業療法士'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 72〜82%が目安。評定不問', bairitsu: '2.5〜3.5倍' } ],
  hensachi_representative: 60, kyotsu_ratio: '72〜82%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜・総合型選抜（学部別）', hyoutei_min: null, hyoutei_note: '学部により評定・条件あり（要確認）', selection_content: ['書類', '面接', '小論文', '共通テスト'], bairitsu: '3〜6倍（要確認）', notes: '「志」特別選抜など特色ある方式あり' } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 5, 'kigyō_ippan': 5, 'kigyō_supotsu': 2, 'iryō': 4 },
  strengths: ['金融・商社・監査法人で全国上位の就職実績', '公認会計士合格者数は全国トップクラス', '神戸・大阪の企業への地の利'],
  representative_employers: ['三井住友銀行', '野村證券', '伊藤忠商事', '監査法人（Big4）', '川崎重工'],
  summary: 'ビジネス系文系の最有力国立。'
 }
},
{
 base: {
  id: 'osaka-koritsu', name: '大阪公立大学', name_short: '大阪公立大', prefecture: '大阪府', type: '公立',
  campus_main: '杉本キャンパス・中百舌鳥キャンパス・森之宮キャンパス',
  access_from_shiga_min: 110, commute_possible: false, commute_note: '片道約2時間。下宿する学生が多いが新快速利用で通学者もいる',
  feature: '大阪市立大と大阪府立大が統合して生まれた全国最大級の公立総合大学。学部の幅が国立並みに広く、学費は国公立標準。獣医・看護・工学など専門分野が充実。森之宮の新キャンパスが2025年開設。',
  living_cost: { rent_min: 35000, rent_max: 55000, food_monthly: 25000, monthly_total: 85000, four_year_total: 4100000, note: '大阪市内南部は家賃が比較的安い' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['大阪府・市職員', '関西大手メーカー', '金融', '病院（看護・リハビリ）'], note: null },
  bairitsu_trend: { ippan: { '2024': '約3〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: 'JR杉本町駅（杉本）/ 地下鉄なかもず駅（中百舌鳥）/ JR森ノ宮駅（森之宮）', walking_min_from_station: 5, nearby_amenities: '市内なので生活利便性は高い', area_description: '大阪市南部〜堺市の都市部' },
  shogakukin: { general_shogakukin: '日本学生支援機構、大阪府の授業料等支援制度（府内在住者向け・所得条件）', shogakukin_official_url: null },
  career_center: { features: ['大阪府・市とのつながりで公務員に強い', '理系は関西メーカーへの実績豊富'], quality: 4, note: null },
  official_links: { official_url: 'https://www.omu.ac.jp/', nyushi_url: 'https://www.omu.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '国立3強（京阪神）の次に位置する関西国公立の有力候補。学部の選択肢が広く、共テ得点率も京阪神よりやや低めで狙いやすい。'
 },
 ippan: {
  departments: [
   { name: '現代システム科学域', campus: '中百舌鳥', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['社会福祉士', 'IT系'] },
   { name: '文学部', campus: '杉本', hensachi_min: 57.5, hensachi_max: 60, qualifications: ['中高教員', '学芸員'] },
   { name: '法学部', campus: '杉本', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: [] },
   { name: '商学部', campus: '杉本', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: ['公認会計士'] },
   { name: '経済学部', campus: '杉本', hensachi_min: 57.5, hensachi_max: 57.5, qualifications: [] },
   { name: '理学部', campus: '杉本', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['中高教員(数理)'] },
   { name: '工学部', campus: '中百舌鳥', hensachi_min: 55, hensachi_max: 60, qualifications: ['建築士', '技術士補'] },
   { name: '農学部', campus: '中百舌鳥', hensachi_min: 55, hensachi_max: 57.5, qualifications: [] },
   { name: '獣医学部', campus: 'りんくう', hensachi_min: 62.5, hensachi_max: 62.5, qualifications: ['獣医師'] },
   { name: '医学部（医・リハビリ）', campus: '阿倍野', hensachi_min: 55, hensachi_max: 65, qualifications: ['医師', '理学療法士', '作業療法士'] },
   { name: '看護学部', campus: '森之宮', hensachi_min: 52.5, hensachi_max: 52.5, qualifications: ['看護師', '保健師'] },
   { name: '生活科学部', campus: '森之宮', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['管理栄養士', '一級建築士（居住）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 65〜78%が目安。評定不問', bairitsu: '3〜4倍' }, { method_name: '一般選抜（後期日程）', subjects: '共通テスト＋二次試験', notes: null, bairitsu: '5〜10倍（要確認）' } ],
  hensachi_representative: 57.5, kyotsu_ratio: '65〜78%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（学部別）', hyoutei_min: 4.0, hyoutei_note: '学部により4.0〜4.3（要確認）', selection_content: ['書類', '面接', '小論文', '共通テスト'], bairitsu: '2〜4倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 1, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 5, 'kigyō_ippan': 4, 'kigyō_supotsu': 2, 'iryō': 5 },
  strengths: ['大阪府・市の公務員に圧倒的に強い', '看護・リハビリ・獣医など専門職学部が充実', '関西メーカー技術職への安定した実績'],
  representative_employers: ['大阪府庁・大阪市役所', 'パナソニック', 'ダイハツ', '市中病院'],
  summary: '学部の幅×国公立の学費が魅力。'
 }
},
{
 base: {
  id: 'kyoto-furitsu', name: '京都府立大学', name_short: '京都府立大', prefecture: '京都府', type: '公立',
  campus_main: '下鴨キャンパス（京都市左京区）',
  access_from_shiga_min: 70, commute_possible: true, commute_note: '草津からJR＋地下鉄/バスで約70分。自宅通学圏',
  feature: '文学部・和食文化科学部・生命環境系を持つ小規模公立大学。少人数教育で教員との距離が近く、京都文化・食文化の研究は全国唯一級。学費は公立標準で通学圏。',
  living_cost: { rent_min: 0, rent_max: 55000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1200000, note: '自宅通学可能。学費年約53.6万円' },
  shingaku_jisseki: { shushoku_rate: '約96%（要確認）', top_employers: ['京都府庁・市役所', '食品メーカー', '教員', '出版・文化系'], note: null },
  bairitsu_trend: { ippan: { '2024': '約3〜5倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '地下鉄北山駅 徒歩10分', walking_min_from_station: 10, nearby_amenities: '北山通のおしゃれエリア。植物園隣接', area_description: '京都市左京区の閑静な文教地区' },
  shogakukin: { general_shogakukin: '日本学生支援機構、府大独自の授業料減免', shogakukin_official_url: null },
  career_center: { features: ['京都府内自治体・企業への地元パイプ', '少人数ゆえのきめ細かい個別支援'], quality: 3, note: null },
  official_links: { official_url: 'https://www.kpu.ac.jp/', nyushi_url: 'https://www.kpu.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「京都で文学・食・環境を少人数で学ぶ」個性派の国公立。通学圏で学費が安く、共テ得点率も京阪神より控えめ。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '下鴨', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['中高教員(国英)', '学芸員'] },
   { name: '和食文化科学部', campus: '下鴨', hensachi_min: 50, hensachi_max: 55, qualifications: ['管理栄養士（栄養科学）', 'フードスペシャリスト'] },
   { name: '生命理工情報学部', campus: '下鴨', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['技術系資格'] },
   { name: '環境科学部', campus: '下鴨', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['建築士（環境デザイン）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 62〜72%が目安。評定不問', bairitsu: '3〜5倍（要確認）' } ],
  hensachi_representative: 52.5, kyotsu_ratio: '62〜72%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜（府内枠あり）', hyoutei_min: 4.0, hyoutei_note: '学部により異なる（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '2〜4倍（要確認）', notes: '京都府内高校対象の枠あり。滋賀からは一般で' } ] },
 employment: {
  ratings: { kyoin: 3, 'shogakkō': 2, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 4, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 3 },
  strengths: ['京都府内の公務員・文化系職に強い', '和食文化・栄養は業界で独自の評価', '少人数で就職支援が手厚い'],
  representative_employers: ['京都府庁', '食品メーカー', '中高教員'],
  summary: '通学圏の個性派国公立。'
 }
},
{
 base: {
  id: 'kyoto-kosen', name: '京都工芸繊維大学', name_short: '京工繊', prefecture: '京都府', type: '国立',
  campus_main: '松ヶ崎キャンパス（京都市左京区）',
  access_from_shiga_min: 65, commute_possible: true, commute_note: '草津からJR＋地下鉄で約65分。自宅通学圏',
  feature: '工学とデザインに特化した国立大学。「工繊」ブランドは製造業・建築業界で高評価。デザイン×工学の融合教育は全国でも希少で、就職率・大学院進学率とも非常に高い。',
  living_cost: { rent_min: 0, rent_max: 55000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1200000, note: '自宅通学可能。学費は国立標準' },
  shingaku_jisseki: { shushoku_rate: '約98%', top_employers: ['京セラ', '村田製作所', '任天堂', '建設・設計事務所', '大学院進学 約7割'], note: '院進学込みで技術職就職はほぼ100%' },
  bairitsu_trend: { ippan: { '2024': '約3〜4倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '地下鉄松ヶ崎駅 徒歩8分', walking_min_from_station: 8, nearby_amenities: '北山エリアで環境良好', area_description: '京都市左京区の文教地区' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['京都のものづくり企業への強力パイプ', '建築・デザイン系の専門就職支援'], quality: 4, note: null },
  official_links: { official_url: 'https://www.kit.ac.jp/', nyushi_url: 'https://www.kit.ac.jp/admissions/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '理系・建築・デザイン志望で通学圏の国立を狙うなら最有力。企業からの評価が偏差値以上に高い「お得な」大学として有名。'
 },
 ippan: {
  departments: [
   { name: '工芸科学部（設計工学域）', campus: '松ヶ崎', hensachi_min: 52.5, hensachi_max: 57.5, qualifications: ['建築士', '技術士補'] },
   { name: '工芸科学部（物質・材料/生命系）', campus: '松ヶ崎', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['危険物取扱者ほか'] },
   { name: '工芸科学部（デザイン科学域）', campus: '松ヶ崎', hensachi_min: 55, hensachi_max: 57.5, qualifications: ['一級建築士（要実務）'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次（数理英）', notes: '共テ得点率 65〜75%が目安。評定不問', bairitsu: '3〜4倍（要確認）' }, { method_name: '一般選抜（後期日程）', subjects: '共通テスト＋二次', notes: null, bairitsu: '5〜8倍（要確認）' } ],
  hensachi_representative: 55, kyotsu_ratio: '65〜75%'
 },
 sogo: { entry_methods: [ { method_name: 'ダビンチ入試（総合型）', hyoutei_min: null, hyoutei_note: '評定条件なし（要確認）', selection_content: ['書類', '課題', '面接', '共通テスト'], bairitsu: '2〜5倍（要確認）', notes: 'デザイン・工学への意欲を多面評価' } ] },
 employment: {
  ratings: { kyoin: 2, 'shogakkō': 1, keisatsu: 1, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 5, 'kigyō_supotsu': 1, 'iryō': 1 },
  strengths: ['京都本社の優良メーカー（京セラ・村田・任天堂等）に強い', '建築・デザイン職の専門就職で高評価', '院進学率が高く技術職キャリアが安定'],
  representative_employers: ['京セラ', '村田製作所', '任天堂', 'GSユアサ', '大手設計事務所'],
  summary: '通学圏の理系国立の狙い目。'
 }
},
{
 base: {
  id: 'kyoto-kyoiku', name: '京都教育大学', name_short: '京教大', prefecture: '京都府', type: '国立',
  campus_main: '藤森キャンパス（京都市伏見区）',
  access_from_shiga_min: 60, commute_possible: true, commute_note: '草津からJR＋京阪で約60分。自宅通学圏',
  feature: '教員養成に特化した国立大学。京都・滋賀の小中学校教員採用に太いパイプを持ち、教員採用試験の合格実績・支援体制は関西トップクラス。',
  living_cost: { rent_min: 0, rent_max: 50000, food_monthly: 20000, monthly_total: 25000, four_year_total: 1200000, note: '自宅通学可能。学費は国立標準' },
  shingaku_jisseki: { shushoku_rate: '教員就職率 約70%（正規＋講師、要確認）', kyoin_count: '小中高教員 約200名/年', top_employers: ['京都府・市の小中学校', '滋賀県の小中学校', '公務員', '教育系企業'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '京阪墨染駅 徒歩7分 / JR藤森駅 徒歩15分', walking_min_from_station: 7, nearby_amenities: '伏見の住宅街。生活費は京都市内では安め', area_description: '京都市伏見区の落ち着いた環境' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['教員採用試験対策が体系化（模擬授業・面接練習）', '附属学校での豊富な教育実習'], quality: 4, note: null },
  official_links: { official_url: 'https://www.kyokyo-u.ac.jp/', nyushi_url: 'https://www.kyokyo-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「先生になる」と決めている生徒には通学圏で最短ルートの国立。滋賀県の教員採用にも実績豊富。'
 },
 ippan: {
  departments: [
   { name: '教育学部（学校教育・各教科専攻）', campus: '藤森', hensachi_min: 47.5, hensachi_max: 52.5, qualifications: ['小学校教員', '中高教員（全教科）', '幼稚園教諭', '特別支援'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次（専攻別）', notes: '共テ得点率 58〜68%が目安。評定不問', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 50, kyotsu_ratio: '58〜68%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜', hyoutei_min: 4.0, hyoutei_note: '専攻により4.0〜4.3（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '2〜3倍（要確認）', notes: '教員志望動機が重視される' } ] },
 employment: {
  ratings: { kyoin: 5, 'shogakkō': 5, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 3, 'kigyō_ippan': 2, 'kigyō_supotsu': 2, 'iryō': 1 },
  strengths: ['京都・滋賀の教員採用試験に圧倒的実績', '全教科の中高免許＋小学校免許を取得可能', '附属校実習で実践力がつく'],
  representative_employers: ['京都府・市立学校', '滋賀県立・市立学校', '国私立学校'],
  summary: '教員志望の通学圏国立の本命。'
 }
},
{
 base: {
  id: 'wakayama-univ', name: '和歌山大学', name_short: '和大', prefecture: '和歌山県', type: '国立',
  campus_main: '栄谷キャンパス（和歌山市）',
  access_from_shiga_min: 150, commute_possible: false, commute_note: '片道2.5時間。下宿前提',
  feature: '観光学部を持つ数少ない国立大学。システム工学部は情報・デザイン系の学びが幅広い。地方国立ならではの少人数教育と、関西圏で最も入りやすい水準の国立という位置づけ。',
  living_cost: { rent_min: 25000, rent_max: 40000, food_monthly: 22000, monthly_total: 70000, four_year_total: 3400000, note: '和歌山市の家賃は関西で最安クラス。生活費全体が安い' },
  shingaku_jisseki: { shushoku_rate: '約96%（要確認）', top_employers: ['和歌山県・市職員', '観光・ホテル業界', 'IT企業', '教員'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '南海和歌山大学前駅 徒歩20分', walking_min_from_station: 20, nearby_amenities: '駅前にイオンモール', area_description: '和歌山市郊外の丘陵キャンパス' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['観光業界への全国唯一級のパイプ', '地方公務員試験のサポート'], quality: 3, note: null },
  official_links: { official_url: 'https://www.wakayama-u.ac.jp/', nyushi_url: 'https://www.wakayama-u.ac.jp/admission/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '「国立にこだわるが偏差値は控えめにしたい」場合の現実的な選択肢。観光学部は業界で知名度抜群。生活費の安さも魅力。'
 },
 ippan: {
  departments: [
   { name: '教育学部', campus: '栄谷', hensachi_min: 45, hensachi_max: 50, qualifications: ['小学校教員', '中高教員'] },
   { name: '経済学部', campus: '栄谷', hensachi_min: 45, hensachi_max: 47.5, qualifications: [] },
   { name: 'システム工学部', campus: '栄谷', hensachi_min: 45, hensachi_max: 47.5, qualifications: ['IT系資格', '建築士（デザイン系）'] },
   { name: '観光学部', campus: '栄谷', hensachi_min: 47.5, hensachi_max: 50, qualifications: ['旅行業務取扱管理者'] },
   { name: '社会インフォマティクス学環', campus: '栄谷', hensachi_min: 47.5, hensachi_max: 47.5, qualifications: ['データサイエンス系'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 55〜65%が目安。評定不問', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 47.5, kyotsu_ratio: '55〜65%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜・総合型選抜', hyoutei_min: 3.8, hyoutei_note: '学部により3.8〜4.3（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '1.5〜3倍（要確認）', notes: null } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 4, keisatsu: 3, 'shōbō': 2, 'kōmuin_ippan': 4, 'kigyō_ippan': 3, 'kigyō_supotsu': 1, 'iryō': 1 },
  strengths: ['観光・ホテル業界への就職は国立随一', '和歌山県内公務員・教員に強い', '少人数で面倒見が良い'],
  representative_employers: ['和歌山県庁', 'JTB・ホテル業界', 'IT企業', '小中学校教員'],
  summary: '控えめな得点率で狙える関西国立。'
 }
},
{
 base: {
  id: 'nara-joshi', name: '奈良女子大学', name_short: '奈良女子大', prefecture: '奈良県', type: '国立',
  campus_main: '奈良キャンパス（奈良市）',
  access_from_shiga_min: 90, commute_possible: true, commute_note: '草津から京都経由近鉄で約90分。通学ぎりぎり圏・下宿併用',
  feature: 'お茶の水女子大と並ぶ国立女子大学の双璧。2022年に女子大初の工学部を設置。少人数の丁寧な教育と、研究者・専門職を多く輩出する伝統。落ち着いた奈良の環境で学べる。',
  living_cost: { rent_min: 30000, rent_max: 45000, food_monthly: 22000, monthly_total: 75000, four_year_total: 3600000, note: '通学も可能だが奈良市内下宿の学生も多い' },
  shingaku_jisseki: { shushoku_rate: '約97%（要確認）', top_employers: ['教員・公務員', '食品・化学メーカー', '金融', '大学院進学（理系は過半）'], note: null },
  bairitsu_trend: { ippan: { '2024': '約2〜3倍', '2025': '要確認' } },
  campus_neighborhood: { nearest_station: '近鉄奈良駅 徒歩5分', walking_min_from_station: 5, nearby_amenities: '奈良市中心部で生活便利', area_description: '奈良公園そばの歴史的環境' },
  shogakukin: { general_shogakukin: '日本学生支援機構、授業料免除制度', shogakukin_official_url: null },
  career_center: { features: ['女性のキャリア形成支援に特化した歴史', '研究職・専門職への進学サポート'], quality: 4, note: null },
  official_links: { official_url: 'https://www.nara-wu.ac.jp/', nyushi_url: 'https://www.nara-wu.ac.jp/nyusi/', shingaku_url: null, youkou_url: null, verified: false },
  unique_point: '国立女子大ならではの少人数教育と就職・院進学実績。理系女子（特に工学部）には全国的にも希少な環境。'
 },
 ippan: {
  departments: [
   { name: '文学部', campus: '奈良', hensachi_min: 52.5, hensachi_max: 55, qualifications: ['中高教員', '学芸員'] },
   { name: '理学部', campus: '奈良', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['中高教員(数理)'] },
   { name: '生活環境学部', campus: '奈良', hensachi_min: 52.5, hensachi_max: 57.5, qualifications: ['管理栄養士', '一級建築士（住環境）', '看護師（看護学科新設）'] },
   { name: '工学部', campus: '奈良', hensachi_min: 50, hensachi_max: 52.5, qualifications: ['技術士補'] },
  ],
  entry_methods: [ { method_name: '一般選抜（前期日程）', subjects: '共通テスト＋二次試験', notes: '共テ得点率 62〜72%が目安。評定不問。女子のみ出願可', bairitsu: '2〜3倍（要確認）' } ],
  hensachi_representative: 52.5, kyotsu_ratio: '62〜72%'
 },
 koubo: { entry_methods: [ { method_name: '学校推薦型選抜・総合型選抜', hyoutei_min: 4.0, hyoutei_note: '学部により異なる（要確認）', selection_content: ['書類', '面接', '小論文'], bairitsu: '2〜3倍（要確認）', notes: '女子のみ' } ] },
 employment: {
  ratings: { kyoin: 4, 'shogakkō': 3, keisatsu: 2, 'shōbō': 1, 'kōmuin_ippan': 4, 'kigyō_ippan': 4, 'kigyō_supotsu': 1, 'iryō': 3 },
  strengths: ['国立女子大ブランドで教員・公務員・研究職に強い', '管理栄養士・建築など専門資格に直結する学科構成', '女子大初の工学部で理系女子のロールモデル多数'],
  representative_employers: ['中高教員', '公務員', '食品メーカー', '大学院進学'],
  summary: '女子の国立進学の有力候補。'
 }
}
];
