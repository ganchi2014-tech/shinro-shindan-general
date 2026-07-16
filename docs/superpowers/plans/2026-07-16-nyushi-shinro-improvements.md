# 入試ページ・進路（就職）ページ 改善 実装計画（引き継ぎ）

> 別セッションで再開するための引き継ぎ資料。2026-07-16 作成。
> 多エージェントで「改善案136件を生成 → data_v2実データで批評 → 現実的な31件を抽出」した結果（統合前で停止したため生データ由来）。

## 現在の状態（すべて push 済み・master `45a2513` 時点）
- 公開URL: https://ganchi2014-tech.github.io/shinro-shindan-general/ （GitHub Pages。masterへpushで約1分後に自動反映。要ハード更新）
- リポジトリ: https://github.com/ganchi2014-tech/shinro-shindan-general
- ビルド: テンプレ `work/app_v2ui.html` を `node work/build_v2ui.js` で `進路診断_v2.html` に生成
- テスト: `node work/test_engine_v2.js` / `test_bridge_v2.js` / `test_agg_v2.js`（全緑）
- 実装済みの主要機能:
  - v1のUIにengine_v2を移植（学部単位3ゾーン診断＋RIASEC適性）
  - 学部/大学の情報分離（学部ページ＝学部固有、大学ページ＝5タブで大学共通）
  - 結果の学部/大学ビュー切替、大学単位集約（agg_v2 / ゾーン優先 match>challenge>safe）
  - 総点検22件の修正（集約過少・loading詰み・二重表示・データ形状 等）
  - 通学を滋賀からの距離で採点（厳しめ90分/緩め120分）
  - 「進む」ボタン（forwardスタック）
  - **国公立は偏差値+8補正でゾーン判定・表示も「＋8」**（`engine_v2.js` KOKKORITSU_BONUS=8）
  - 入試ページ充実（検証バナー・方式別 試験科目/入学手続〆切/想定倍率(baiio吸収)/必要書類/募集要項リンク、学部倍率の年度推移＋出典）

## この計画の使い方（再開手順）
1. 下記の改善案は **data_v2 の実データで裏付け済み（保有件数つき）**。上から（価値高×コスト低）順に実装する。
2. 各案の「配置」に**学部/大学分離方針の是正コメント**が入っている（例: 案は入試タブと言うが偏差値ベースなので学部ページが正、等）。**配置の指示に従うこと**。
3. 実装前に必ず該当フィールドの形状・件数を `node -e` で再確認（データは揺れがある: string/object混在・綴り誤りキー`baiio`/`tokuaisei`等）。
4. 実装は `work/app_v2ui.html` を編集 → `node work/build_v2ui.js` → ブラウザ実機確認（ローカル: `python -m http.server 8899`）。
5. まだ批評していない生アイデアが約70件残っている（ワークフローは批評66/136で停止）。必要なら再実行:
   `Workflow({scriptPath: ".../workflows/scripts/nyushi-shinro-improve-wf_15d1cf22-6f3.js"})`
   生アイデア全136件と批評66件の生データ: `docs/superpowers/_salvage_ideas.json`

## 補足（クリティが却下した主なもの＝データ不足）
学部別の詳細就職先/職種内訳、共テ得点率・配点の構造化、合格可能性%（模試判定）、口コミ、リアルタイム倍率、動画/画像 等は data_v2 に構造化データが無いため見送り。自由文(notes/subjects)に混在する範囲でのみ露出する方針。

---

# 現実的な改善案（価値高→低、コスト低→高）
<!-- 以下は自動抽出（配置の是正コメント込み）。重複気味の案（例: employment.ratings可視化が複数、倍率注記が複数）は実装時に統合する。 -->

## A. 進路（就職）タブ〔大学ページ〕（15件）

### 【high価値／lowコスト】
- **配置**: 進路タブ(uniTabEmployment, L3309)の最上部。ratings は uni オブジェクト直下の大学共通の就職強み指標なので、学部/大学分離方針に整合（学部ページには置かない）。分離方針を壊さない。
- **データ根拠**: uni.employment.ratings.{kyoin,shogakkō,keisatsu,shōbō,kōmuin_ippan,kigyō_ippan,kigyō_supotsu,iryō} 各1-5。保有=101/123大学（22大学は欠損）。分布は各分野で1〜5に実際にばらけており（例 keisatsu:16/21/38/18/8、iryō:14/18/28/18/23）プレースホルダーではない実データ。ラベルは既存 CAREER_LABEL(L1978) が8キー全てを日本語化済み(中高教員/小学校教員/警察官/消防士・救命士/一般公務員/一般企業/スポーツ関連企業/医療・専門職)。星描画は uniTabEmployment 内の stars() ヘルパー(L3313) が既存で流用可。
- **実装方針**: uniTabEmployment(L3309) の _dl([...]) の直前に emp.ratings ミニ可視化ブロックを差し込む。CAREER_LABEL の8ラベルをループし、値を横棒(width: val/5*100%)または既存 stars(val) で描画。強み順に降順sortして上位分野を先頭に。emp.ratings が無い22大学は `if(!emp.ratings)` でブロックごとスキップ（フォールバックは現状の強みテキストのまま）。さらに state.diag.careers で選んだ職種の rating 軸（getCareerOption(id).rating）をハイライトすれば、scoreUni(L2522) の就職マッチ加点の根拠がユーザーに可視化され、診断結果とタブ表示が接続する。真のSVGレーダー多角形はMEDIUM工数になるので、星/横棒版を推奨（stars()・CAREER_LABEL 流用でlow）。

### 【high価値／lowコスト】
- **配置**: お気に入り・比較画面（favs / renderFavs）。入試タブ・進路タブ・学部ページには置かない。比較表は複数校を横断集約する読み取り専用ビューであり、フィールドの所有ページを移す訳ではないので学部/大学分離方針は壊さない（分離方針は各詳細ページの主たる表示責務を規定するもの）。CSSも .compare-uni-head 等で大学単位のグルーピングを想定済み。
- **データ根拠**: 全6フィールドが data_v2.json に実在。dept.hensachi.min=650/650(数値)、dept.bairitsu.ippan=650/650(ただし{年:値}オブジェクトで最新年抽出が必要、非null年を持つのは625/650)、uni.tuition_yen_per_year=123/123、uni.access_from_shiga_min=123/123、uni.shingaku_jisseki.shushoku_rate=123/123(ただし"約97%"の文字列)、uni.career_center.quality=83/123(int3-5、40件null)。連結: dept.uni_id→uni.id は findDeptV2(deptId) が {dept,uni} で解決済み。お気に入りは dept_id 配列で localStorage 保存(getFavs)。
- **実装方針**: renderFavs()(line3967)を、現状の deptCard 縦積みから <table class="compare-table"> 生成に差し替える。既存の未使用CSS(.compare-wrap/.compare-table/.compare-uni-head/.compare-fav-rm, line1435-1476)をそのまま流用。行=お気に入り学部、getFavs()の各 dept_id を findDeptV2 で {dept,uni} 解決。列: 学部名(tbody th、大学名は .compare-uni-head で表示)/偏差値(dept.hensachi.min)/一般倍率(dept.bairitsu.ippan の最大年キーを取る getLatestBairitsu ヘルパー。倍率推移表 line3669 に既存の年キー処理があるので再利用/共通化)/学費(uni.tuition_yen_per_year を1万円単位に整形)/滋賀から(uni.access_from_shiga_min+'分')/就職率(uni.shingaku_jisseki.shushoku_rate をそのまま文字列表示)/キャリア充実度(uni.career_center.quality を★×n)。欠損は必ず '—' フォールバック(特に quality 40件null・bairitsu 25件・整形前nullチェック)。各行に .compare-fav-rm の解除ボタン(既存 removeFav/toggle 経路を使い、押下後 renderFavs 再描画)。表は .compare-wrap の overflow-x:auto で横スクロール、thead は position:sticky 済み。就職率は文字列なので数値ソートは非対応(表示のみ)と割り切る。データ追加・スキーマ変更は不要、renderFavs の書き換えのみで完結。

### 【medium価値／lowコスト】
- **配置**: 進路タブ = uniTabEmployment（app_v2ui.html:3309-3324、呼出し3234）。keisatsu/shobo は shingaku_jisseki 配下の大学共通実績数値なので大学ページ配置で分離方針に合致・違反なし。
- **データ根拠**: node -e 実測: uni.shingaku_jisseki.keisatsu_count=85/123件（うち実数値63件・"要確認"22件）, uni.shingaku_jisseki.shobo_count=85/123件（うち実数値42件・"要確認"43件）。型はすべて文字列レンジ（例:"10-20名""約15名""若干名""なし""要確認"）で精密な人数ではない。比較対象の kyoin_count は91件（実数値74/"要確認"17）。提案の「各85大学」は正確。
- **実装方針**: uniTabEmployment の _row('教員就職', sj.kyoin_count ...)（3317行）直後に2行追加: _row('警察官', sj.keisatsu_count && sj.keisatsu_count!=='要確認' ? _esc(sj.keisatsu_count) : null), _row('消防・救命', sj.shobo_count && sj.shobo_count!=='要確認' ? _esc(sj.shobo_count) : null), _row/_esc は既存ヘルパでそのまま使える。'要確認'除外が必須（除外しないと警察22件/消防43件のプレースホルダ行が氾濫）。既存 kyoin_count 行も truthy チェックのみで"要確認"17件を素通し表示しているので、同じフィルタを付けると統一的で品質向上。補足: 未使用デッドコード renderEmploymentTab(3917) は既に警察合格/消防・救命カードを実装済み＝v2書換時に落ちた表示の実質復活。値がレンジ止まりのため学生への訴求は中程度。

### 【medium価値／lowコスト】
- **配置**: 大学ページ 進路タブ（uniTabEmployment, app_v2ui.html:3309-3324）。notable_alumniは大学共通属性のため学部/大学分離方針に適合し是正不要。
- **データ根拠**: uni.notable_alumni（string配列）を保有する大学は 123中22件（18%）。実在例: 南山[2]、愛知[2]、名古屋外国語[3:ANA/JAL CA多数・国際機関職員・通訳翻訳家]、名古屋商科[3:経営者・コンサル・起業家]、至学館[4:吉田沙保里・伊調馨/千春・登坂絵莉ほか]、藤田医科[3]、愛知工業[3:トヨタ系/デンソー系技術者・プロ野球選手]、岐阜協立[2:地銀職員・公務員]等。残り101件はフィールド無し。
- **実装方針**: uniTabEmployment の _dl 配列末尾に _row('活躍する卒業生例', _joinArr(uni.notable_alumni)) を1行追加するだけで実装可（_joinArr が配列→「、」結合、null時は_rowが行ごと非表示。22件のみ表示され残101件は自然に出ない）。より目立たせるなら _dl の後に uni.notable_alumni?.length で条件分岐した独立セクション（見出し+ul）を追加。ロジックは既存のdead code renderBasicTab(3842-3847, 現状どこからも呼ばれず未使用)をそのまま流用可能。重要: ラベルは「有名OB・OG」でなく「卒業生の活躍例」等に。実データの多くは『東海地区中小企業経営者』『地元教員多数』等の集合的な進路類型で、名前入りの著名人は至学館・名古屋外国語・名商大など一部に限られるため、「有名OB・OG」の看板は誇大。

### 【medium価値／lowコスト】
- **配置**: 大学ページ進路タブ（uniTabEmployment / app_v2ui.html:3309-3324）。notes は大学単位の進路実績に対する注意点なので大学ページに置くのが正しく、学部/大学分離方針（大学共通の実績・注意点＝大学ページ）に合致。方針違反なし。
- **データ根拠**: uni.employment.notes は実在。ただしキーは全101 employment オブジェクトに存在するものの、非空は13大学のみ（123校中約10.6%）／残り88校は空文字列。非空の実例: 大阪体育大・日本体育大・びわこ成蹊スポーツ大「教員養成は保健体育が中心（教科全般の養成課程は限定的）」、京都看護大「学部1つで看護以外の進路なし」、神戸親和大「2023年に共学化したばかり。男子学生は少数派」、大阪青山大/大阪信愛学院大（女子大出自・男子少数）、帝塚山大/大手前大（知名度・ブランド中位）、大阪学院大/京都文教大/太成学院大（データ限定的）。同階層 emp.strengths=101件・emp.summary=101件は存在するがいずれもポジティブ寄りで notes と内容重複なし。現行 uniTabEmployment(app_v2ui.html 3309-3324) は strengths は表示するが notes は完全未使用。
- **実装方針**: uniTabEmployment の _dl 配列内、'強み' 行(3318)の直後に `_row('注意点', emp.notes)` を1行追加するだけ（_row は v==='' を空扱い、_dl が falsy をフィルタするので、空文字88校では行自体が出ず、非空13校のみ表示。emp.notes をそのまま渡してよい）。控えめ表示にするなら値を `emp.notes ? '<span class=\"detail-caution\">'+_esc(emp.notes)+'</span>' : null` の形にして CSS で .detail-caution{color:#8a8a8a;font-size:.9em} を足す。ラベルは内容が「教員養成の制約」「看護以外の進路なし」等の本質的注意と「データ限定的」等のデータ品質メタが混在するため『注意点』が無難。追加データ・DB改修は不要、実質約1行。

### 【medium価値／lowコスト】
- **配置**: 進路タブ＝uniTabEmployment（大学ページ）。notable_programsはuni専用フィールド（departmentsは0件）なので大学共通情報として大学ページ進路タブが正位置。学部/大学分離方針に適合し是正不要。
- **データ根拠**: uni.notable_programs＝実在。56/123大学が非空（配列, 2〜4件/校, 計168項目）。keyword内訳: 公務員15/看護国試14/留学13/教員採用13/資格13。departmentsは0/650でuni専用フィールド。既存の参照はrenderBasicTab(L3834-3839)のみだが同関数は呼出0の死コードで、実UIの進路タブ(uniTabEmployment L3309)には未表示。cc.features(進路タブ「キャリア支援」で既表示)との重複は軽微＝ファジー重複9/56校・完全一致6項目/168のみ。
- **実装方針**: uniTabEmployment(L3309)の_dl配列に、既存「キャリア支援」(_row('キャリア支援', _joinArr(cc.features)))行の直後へ1行追加する。重複回避のため表示前にdedupする: const progs = (uni.notable_programs||[]).filter(p => !(cc.features||[]).some(f => f===p || (p.length>3&&f.length>3&&(p.includes(f)||f.includes(p))))); を作り、_row('力を入れている支援', _joinArr(progs)) を追加（progsが空なら_rowはnull返しで非表示になる想定）。ラベルはcc.featuresの「キャリア支援」と区別できる語（例:「注力プログラム」）にする。56校のみ表示・残り67校は条件で自動非表示。完全一致重複6件+ファジー9校だけなので上記の簡易filterで足り、career_center.featuresとの重複表示を防げる。あわせて死コードrenderBasicTab(およびrenderMethodTab/renderIppanTab/renderEntranceTab等の未呼出関数群)は別タスクで整理検討推奨。

### 【medium価値／lowコスト】
- **配置**: 進路タブ = uniTabEmployment（work/app_v2ui.html 3309行）。大学レベルタブなので学部/大学分離方針に適合(ryugakuは大学共通情報)。見出しは既存の_dl就職情報の下に『🌏 グローバルな進路（留学）』として別セクション追加。※生活タブuniTabLife(3326)に置く選択肢も同等に妥当だが、案の意図どおり進路タブに配置しつつ、留学が在学中制度である点は見出し文言で誤解を避ける。
- **データ根拠**: uni.ryugaku（85/123大学に有効値・38大学は空）。ただし同一意味で2スキーマ併存: Shape A {available(bool), destinations(str), scholarship(str)}=45件（立命館/近畿/同志社/関学等）、Shape B {umu(bool), ryugakusaki(str), shogakukin(str)}=40件（中京/中部/名城/広島大等）。正規化(avail=available||umu, dest=destinations||ryugakusaki, schol=scholarship||shogakukin)すると avail/dest/schol とも85件充足。destinations例『アメリカ、イギリス…協定校世界70カ国以上』、scholarship例『あり（多数の留学奨学金プログラム）』。奨学金文字列: あり系63/要確認系5/その他17。案が推測した3フィールドはShape A(45件)しか拾えず、40件を取りこぼす。
- **実装方針**: uniTabEmployment(3309)を単一return式から文字列組み立てに小改修し、就職情報_dlの後ろに正規化した留学セクションを条件描画する。実装: `const ry = uni.ryugaku || {}; const avail = ry.available !== undefined ? ry.available : ry.umu; const dest = ry.destinations || ry.ryugakusaki; const schol = ry.scholarship || ry.shogakukin; if (avail === true || dest || schol) { html += '<h4 class=\"detail-h\">🌏 グローバルな進路（留学）</h4>' + _dl([ _row('留学制度', avail === true ? '✅ 協定校への留学制度あり' : (avail === false ? '❌ なし' : '要確認')), _row('主な留学先', dest ? _esc(dest) : null), _row('留学奨学金', schol ? _esc(schol) : null) ]); }` 既存の_esc/_dl/_rowをそのまま流用。両スキーマ吸収がキモで、これにより45→85件に拡大。ryugaku未保有38件は条件falseで非表示(空セクション出ない)。デッドコードrenderLifeTab(3694)は流用せず新規に書く(呼ばれていないため)。コスト低: 1関数・追加約10行・新規フィールド不要。

### 【medium価値／lowコスト】
- **配置**: 大学ページ進路タブ = uniTabEmployment(uni)（work/app_v2ui.html 3309行、dispatch 3234行）。両フィールドともuniオブジェクト直下＝大学共通情報なので大学ページが正しく、学部/大学分離方針を壊さない。
- **データ根拠**: uni.employment.summary=実在101/123件（9-37字/avg21字。例:大阪体育大学「日本のスポーツ指導者の総本山。」立命館「関関同立屈指の総合力…」）。uni.shingaku_jisseki.note=実在だが27/123件のみ（shingaku_jistekiオブジェクト自体は123件だが.noteフィールドは27件。提案の「123大学」は誤り。9-49字/avg24字。例:日体大「教員・警察・消防の合格者数は全国トップ級」）。両方保有27件/summaryのみ74件/noteのみ0件/両方無し22件。
- **実装方針**: live関数 uniTabEmployment(uni) の return を修正。現状は _dl([...]) 定義リストのみ。冒頭にリード文を差し込む: `const emp=uni.employment||{}; const sj=uni.shingaku_jisseki||{}; const lead = (emp.summary?`<p class="detail-lead">${_esc(emp.summary)}</p>`:'') + (sj.note?`<p class="note">${_esc(sj.note)}</p>`:'');` を作り、`return lead + _dl([...]) + (official_links...)` の順で結合。summaryは既存 .detail-lead クラス（キャッチ用）、noteは既存 .note クラス（小さめ補足）で視覚差別化。注意点: (1)実装先は uniTabEmployment のみ。renderEmploymentTab(3949/3951)・renderBasicTab(3829) は既に両フィールドを参照するが未呼出のデッドコードなのでそちらを触らない。(2)summary(82%)を主リード、note(22%)は補足という主従で置く。両方持つ27件は「見出し＋具体実績」で自然だが、内容が重なる場合の冗長さを避けるためsummary優先・note従属の並びにする。

### 【medium価値／lowコスト】
- **配置**: 大学ページ進路タブ（uniTabEmployment / app_v2ui.html line3309）。uni共通フィールドなので分離方針OK、学部ページには置かない。dead codeの renderEmploymentTab(3917)/detailEmploymentV2(3503) は触らない。
- **データ根拠**: uni.shikaku_gokakuritsu 保有85/123件。型が混在: string型45件（散文「司法試験・公認会計士・公務員試験合格者多数」等）／object型40件（{kyoin_saiyo,kouchikuin,note}×30、{kyoin_menkyo_shutoku,athletic_trainer,notes}×10）。uni.shikaku_gokakuritsu_data は同フィールドの100%重複コピー（deep-equal 85/85）で不要—guessedDataが同名を2回挙げているのは冗長。現状ライブ描画はuniTabEmployment(line3319)の_row('資格に強い',_shikakuText())の1行のみ。
- **実装方針**: (1) uniTabEmploymentの_dl配列から'資格に強い'行を外し、_dlの後ろに独立ブロックとして追記: uni.shikaku_gokakuritsuがある時だけ`<h4 class="detail-subhead">資格・採用試験の強み</h4>`+本体を出力（38件のnull大学では見出しごと非表示）。(2) object型は_shikakuTextの' / '結合をやめ、ラベル付きサブ_dlに構造化: kyoin_saiyo→教員採用試験 / kouchikuin→公務員試験 / kyoin_menkyo_shutoku→取得できる教員免許 / athletic_trainer→アスレティックトレーナー等 / note・notes→備考。string型はそのまま1段落表示。(3) 参照はuni.shikaku_gokakuritsuのみ（_dataは無視）。(4) 見出し語は「合格実績」でなく「資格・採用試験の強み」等にする—中身は『合格者多数』系の定性表現が大半で、具体合格数/率を約束すると乖離するため。既存_shikakuTextは構造化サブ_dlを返す別関数に置換or拡張。

### 【medium価値／lowコスト】
- **配置**: 大学ページ進路タブ(uniTabEmployment L3309)と大学ページ入試タブ(uniTabEntrance L3252)。ratingsは大学集計値・評定条件も大学共通データなので両方とも大学ページに置くのが分離方針に合致。学部ページ(deptOnlyBody)には出さない——ratingsは学部別ではないため学部ページに置くと分離破壊かつミスリード。
- **データ根拠**: uni.employment.ratings=101/123件・8キー(kyoin/shogakkō/keisatsu/shōbō/kōmuin_ippan/kigyō_ippan/kigyō_supotsu/iryō, 値1-5, 大学間で有意にばらつき有)。career→ratingの写像はapp_v2ui.html内にCAREER_OPTIONS(24職種, rating/alt_rating付, L1999-2048)として既存。state.diag.careers(Set, chipで投入 L2347)・state.diag.hyoutei(数値)・state.diag.interests(Set)も既存。入試側=uni.entry_method_details.{sogo,koubo,ippan}[].hyoutei_min/hyoutei_note(入試タブで既表示 L3275)。補強用にuni.shingaku_jisseki.kyoin_count/keisatsu_count/shobo_count。※提案のguessedDataにあるinterest_riasec_map.jsonは「学問興味タグ→RIASEC」専用で、8職種ratingへの橋渡しには使えない(誤り)。
- **実装方針**: 正しい橋渡しはRIASECではなくstate.diag.careers→getCareerOption(id).rating→uni.employment.ratings[key]（この写像は既存、interest_riasec_mapは不使用）。(A)進路タブ uniTabEmployment(L3309): state.diag.careersが非空なら本文先頭に「あなたの志望にマッチ」ブロックを追加し、各careerId毎に『👮 警察官: ★★★★☆ (4/5)』を出す。ratingsがnullの職種は「評価データ未整備」で中立表示、★4以上は強調色。alt_ratingは併記か0.5加重。加えてshingaku_jisseki.keisatsu_count等の実数があれば併記(scoreUni L2548-2551の既存ロジックを流用)。現状この進路タブはratingsを一切出していない(旧renderEmploymentTabは呼出無しの死コード)ので純増。(B)入試タブ uniTabEntrance(L3275)の評定条件_rowに、hyouteiUnknown=false かつ r.hyoutei_min!=null のとき『✅ あなたの評定3.8で出願可』/未達は『⚠️ あと+0.2必要』バッジを付与(scoreUni L2618の足切り判定を表示へ転用)。

### 【medium価値／lowコスト】
- **配置**: 学部ページ deptOnlyBody の既存「この学部の就職分野」行を置換して実装(employment_fieldsは学部固有データなので分離方針に合致)。案の page:進路 は是正: 大学ページ進路タブ uniTabEmployment は uni 専用引数で dept 非表示のため据え置き、就職実績数値は大学共通のまま維持。分離方針は壊さない。
- **データ根拠**: dept.employment_fields = 611/650学部に存在(39空)。12カテゴリ実測件数: maker209/koumuin209/service208/kinyu197/ryutsu159/it158/iryo_fukushi152/kyoiku130/media66/kensetsu54/sports_kenko44/shokuhin35。tags.employment=12件のID→ラベル対応(koumuin→公務員・行政 等)も存在。ただし『仕事イメージの説明文・具体的職種例』は data_v2 に無く、コード側の12件固定辞書として実装者が記述するもの(既存 METHOD_TYPE_LABEL と同型)。追加のper-dept JSONデータは不要。
- **実装方針**: (1)コード側に12カテゴリの静的辞書を追加: 例 EMP_FIELD_INFO = { koumuin:{label:'公務員・行政', jobs:'市役所・県庁・警察官・消防・国家公務員 など'}, service:{label:'サービス・観光', jobs:'ホテル・旅行・ブライダル・テーマパーク など'}, iryo_fukushi:{...}, ... 全12ID }。ラベルは tags.employment から流用可。(2)deptOnlyBody(line3427)の `_row('この学部の就職分野', _joinArr(empf))` を、リード文『この学部からは、こんな仕事に進む人が多いです』＋dept.employment_fields各IDをチップ表示＋その職種例1行、という構造ブロックに置換。(3)フォールバック: employment_fields空の39学部は当該ブロックを非表示(または interest_tags で代替)。単一HTML内で完結、データ改変なし・カテゴリ12件辞書のみで工数小。dead codeの detailEmploymentV2 は触らない。

### 【medium価値／lowコスト】
- **配置**: お気に入り・比較画面（renderFavs）。単一大学の進路タブではない——1大学ページからは複数校を並べられず「読み比べ」が成立しないため。案のpage=進路は要是正。employment.strengths/summaryは大学共通データなので、比較画面に大学単位ブロックとして置けば学部/大学分離方針を壊さない（学部ページには置かない）。
- **データ根拠**: uni.employment.summary（101/123校、1行の個性ヘッドライン）＋uni.employment.strengths[]（101/123校、各3〜4項目）。101校すべてで両方同時に存在。summary===strengths[0]は0件でsummaryは独立した価値。欠損22校はほぼ東海地方で主対象圏外。現状strengthsはuniTabEmployment@3318で単一大学の「強み」行として既出だが、summaryはアクティブ経路で未表示（renderBasicTab@3829/detailEmploymentV2@3949は共にdead code）。横並び比較ビューは非存在（compare-table CSS@1435-1476は残骸でJS未使用、renderFavs@3967はdeptCard縦積みのみ）。
- **実装方針**: renderFavs（お気に入り・比較画面、3967行）に「就職の個性 読み比べ」セクションを追加。お気に入りdept群からfindDeptV2でuniを取り、uni.idで重複排除（同一大学の複数学部登録で強みが重複しないように）。各大学カードに uni.name＋employment.summary をヘッドライン、strengths[] を箇条書きで並べて縦カード/2カラムで表示。これで(1)現状死んでいるsummaryを初めて活用し(2)単一大学ページでは不可能な複数校の横並び読み比較を実現する。employment欠損22校はカードから除外またはnull表示でガード。残骸のcompare CSSを再利用可。

### 【medium価値／lowコスト】
- **配置**: 大学ページ進路タブ = uniTabEmployment（app_v2ui.html 3309-3324）。就職率は大学共通データなので分離方針に合致（学部ページには置かない）。なお同種の dept 版 detailEmploymentV2(3503) は未呼出しの死にコードなので対象外。
- **データ根拠**: この注記は本来「静的な定義キャプション」で、表示に新規データは不要。現状表示に使う shingaku_jisseki.shushoku_rate=123/123 存在（例:「約97%」）。guessedDataのうち shingaku_jisseki.note は field自体はあるが非null 27/123、employment.notes は非null 13/123 で、いずれも今回の注記実装には不要（誤ったguess）。分母概念(希望者/分母/卒業者)に言及済みの大学=0/123 なので未実装＝REDUNDANTではない。脚注CSS .detail-note は既存(1579-1580、dept側3431で使用実績)。official_links.shingaku_url=85/123 で公式進路データへのCTAは既にuniTabEmploymentに実装済み。
- **実装方針**: uniTabEmployment の就職率行の下（またはタブ末尾）に既存 class="detail-note" の静的脚注を1つ追加。sj.shushoku_rate がある時だけ描画。ただし提案文どおりの断定「就職率=就職者÷就職希望者と必ず添える」はデータ実態に反するため要修正: 本アプリの shushoku_rate は手入力の概算値で、26/123 は算出基準が違う修飾付き（例 筑波大「進学含め概ね95%以上」=進学を含みむしろ卒業者ベース寄り、医療系「約99%」「約100%（看護師需要高）」等）。特定分母を断言すると自データを誤表示する。よって「多くの大学の公表就職率は『就職者÷就職希望者』で算出され、進学者や未活動者を分母に含まないため、卒業生全体に対する就職者割合とは異なります。本アプリの値は目安で算出基準は大学ごとに異なるため、正確な定義・最新値は公式の進路データでご確認ください」という緩めのリテラシー注記にする（既存の進路実績リンクへ誘導）。実装は文字列1本追加のみ。

### 【medium価値／mediumコスト】
- **配置**: 大学ページ「進路タブ」= uniTabEmployment(3309行) の先頭。ratingsは uni.employment 直下＝大学共通データのため、学部/大学分離方針に適合（違反なし）。学部ページには置かない。
- **データ根拠**: uni.employment.ratings.{kyoin,shogakkō,keisatsu,shōbō,kōmuin_ippan,kigyō_ippan,kigyō_supotsu,iryō} を node -e で確認。保有 101/123校(82%)。全101校が8軸完全一致(distinct keyset=1)・値1〜5・欠損ゼロ(値分布 1:116/2:139/3:283/4:166/5:104=808=101×8)。8軸の日本語ラベルは既存 CAREER_LABEL(app_v2ui.html 1978-1987行) にそのまま存在し流用可。現状ratingsは診断スコアリング(2522,2527行)のみで消費、可視化は未実装。SVG/polygon/canvas描画は本体に皆無(faviconのdata URI以外ヒットなし)＝REDUNDANTでない。
- **実装方針**: 新規 renderEmpRadar(ratings) を追加し、uniTabEmployment の返却HTML先頭（_dl テキスト行の前）に挿入。実装: (1)8軸を22.5度オフセット45度刻みで円周配置、値/5で半径スケール→SVG <polygon>で塗り＋各軸に1〜5のグリッドリング(<polygon>薄線)と軸線・端点ラベルを描画。ラベルは CAREER_LABEL を流用(中高教員/小学校教員/警察官/消防士・救命士/一般公務員/一般企業/スポーツ関連企業/医療・専門職)。(2)色はテーマ変数(currentColor/CSS var)で light/dark 対応、viewBox固定＋width:100%でモバイル可変。(3)ガード: emp.ratings が無い22校(!emp.ratings)ではレーダーを描画せず既存テキスト行のみ返す。(4)caveat: 値は編集部の5段階主観評価のため、既存の推定バナー系スタイルで「※就職の傾向を示す編集部評価（5段階）」の注記を1行添える。追加規模は自己完結のJS+CSSで約60〜100行、外部ライブラリ不要。

### 【low価値／lowコスト】
- **配置**: 大学ページ進路タブ（uniTabEmployment、app_v2ui.html:3309-3324）。career_centerは大学共通情報で既にこのタブに集約済み＝学部/大学分離方針に完全適合、是正不要。
- **データ根拠**: uni.career_center.note（string）。noteキーは123大学全件に存在するが、実データ(非null)はわずか10件のみ＝約8%（早稲田/慶應/明治/中央/法政/筑波/順天堂/日体大/国士舘/東海）。残り113件はnull、空文字は0件。現状uniTabEmployment(app_v2ui.html:3309-3324)は cc.features を「キャリア支援」、cc.quality を「支援の充実度★」として描画するのみで、note は完全に未使用。
- **実装方針**: uniTabEmployment内、既存の _row('支援の充実度', stars(cc.quality)) の直後に1行追加するだけ。_row/_dl は null/空を自動フィルタするので条件分岐は不要: _row('キャリアセンターの一言', cc.note ? _esc(cc.note) : null)。noteが無い113大学では行ごと非表示、あってもqualityがnullな早稲田等（quality:null,note有）でも独立行として正しく出る。「★の横に一言」を厳密にやるなら quality行のvalueに `(stars(cc.quality)||'') + (cc.note?` <span class=\"cc-note\">${_esc(cc.note)}</span>`:'')` を合成する手もあるが、早稲田のようにstarsがnullでnoteのみのケースがあるため独立行の方が堅牢で推奨。既存の _esc でXSS対策済み。

## B. 入試タブ〔大学ページ〕（15件）

### 【high価値／lowコスト】
- **配置**: 学部ページ deptOnlyBody（既存の偏差値／一般倍率年度推移ブロックの直後）。提案の「入試タブ」は uniTabEntrance＝大学ページのタブで、大学は複数学部を持ち単一の偏差値／系統を持たないため、そこにこの機能を置くと分離方針違反かつ挙動が破綻する。この機能は本質的に「この学部の偏差値・この学部の系統」を軸にした学部固有の横断比較なので、分離方針（偏差値・入試方式可否・就職分野＝学部ページ）に完全準拠して学部ページ側に配置するのが正しい。是正して採用。
- **データ根拠**: 推測フィールドは全て実在・カバレッジ完璧。dept.hensachi.min=650/650（かつbasisが全件"kawai"＝河合塾の単一スケールなので大学横断比較が妥当）、dept.hensachi.max=650/650（レンジ帯表示に流用可）、dept.interest_tags=650/650（ただし"unclassified"のみ32件はマッチ対象外にする必要あり）、dept.uni_id/dept.dept_id/dept.name=650/650（dept_idは650件全ユニーク→ピア学部ページへ直リンク可能）。uni側: uni.region=123/123（全値がd.regions[region]で解決、.label＋.colorが取れるので地域チップに色付け可）、uni.type=国立15/公立4/私立104（国公私の3値クリーン）、uni.name/name_short。実測ピア分布（他大学・同系統実タグ・偏差値min±2）: median 6件/p75 9件/p90 13件、ピア0件は21件(3.2%)のみ。サンプル: 立命館 経済(min55,keizai)→関学商/関学経済/中央経済/法政経済/関大商/南山経営…と的確に列挙。
- **実装方針**: 単一HTMLに全650学部が読込済みなので新規データ収集ゼロ、クライアント側O(650)フィルタ＋描画のみ。関数 renderSameLevelDepts(dept){ const anchorTags = dept.interest_tags.filter(t=>t!=='unclassified'); if(!anchorTags.length) return 空状態; const peers = departments.filter(o=> o.dept_id!==dept.dept_id && o.uni_id!==dept.uni_id && o.interest_tags.some(t=>anchorTags.includes(t)) && Math.abs(o.hensachi.min - dept.hensachi.min)<=2); 並べ替えは |Δmin| 昇順→uni.type(国立→公立→私立)→region。各行= uniById[o.uni_id].name_short + o.name + 偏差値min(max≠minならmin–max帯) + 地域チップ(d.regions[u.region].label, backgroundは.color) + 国公私バッジ、行クリックでo.dept_idの学部ページへ遷移。件数は上位8〜10件でクランプし「他N件」を折り畳み。}。空状態2種を明示: (a)ピア0件(21学部)→「同レベルの同系統学部が近畿圏データ内に見つかりません」、(b)実タグ無し(unclassifiedのみ32学部)→「系統タグ未分類のため比較対象を抽出できません」。max−min帯は基準を注記(「偏差値は河合塾ボーダー・学部最小値で±2抽出」)して比較の前提を透明化。

### 【high価値／mediumコスト】
- **配置**: 学部ページ = deptOnlyBody() 末尾（既存の偏差値/一般倍率推移/入試方式可否セクションの直後）。※提案の「入試タブ(uniTabEntrance)」は大学ページ側=大学共通の日程/評定条件を扱う枠であり、偏差値ベースの併願提案は学部固有機能。ここに置くと学部/大学分離方針に違反するため where を学部ページへ是正。偏差値・入試方式可否は既に学部ページに載っており、その文脈の延長として自然。
- **データ根拠**: 全650学部で必要フィールドが揃っており、しかも比較可能性が担保されている点が決め手。node -e で確認: (1) dept.hensachi.min/max = 650/650が数値、範囲35〜70、basisは全件"kawai"の1種のみ→全学部が同一予備校基準で偏差値比較可能（異基準混在なら不成立だがクリア）。 (2) dept.name = 650/650。 (3) dept.uni_id → universities[].id で650/650解決（uni.name表示可、id欠損ゼロ）。 (4) dept.entry_methods[].type + .available = 全650学部が sogo/koubo/ippan/kyotsu の4方式すべてを available:true/false 付きで保有（各type 650件）→「方式が使えるか併記」は完全に裏付けあり。 (5) 追加武器: uni.access_from_shiga_min / commute_possible / prefecture が全大学にあり、滋賀通学圏の重み付け・バッジ付与が可能。 (6) 帯域密度: 中心偏差値ヒストグラムは各値6〜63件、高帯(68→5,70→3)でも±レンジ集計で候補は十分。既存 renderDetail(deptId)/data-detail ナビ・deptCard() 描画関数も流用可。
- **実装方針**: buildHeiganSuggestions(currentDept): center=(hensachi.min+hensachi.max)/2 を基準に全650学部を走査。同一学部は除外、同一大学は任意（残すなら1大学1件に間引き推奨）。帯分け=挑戦:center+3〜+5 / 相応:center-2〜+2(自校除く) / 安全:center-5〜-3。各帯を|center差|昇順ソートし上位3〜4校。任意で uni.access_from_shiga_min<=90 または commute_possible を優先加点。描画=3カラム横並び(挑戦/相応/安全)。各カードは uni.name + dept.name + 偏差値(min-max) + 使える方式チップ(entry_methods を available:true で filter→ラベル 総合/公募/一般/共通)。滋賀通学圏には「滋賀から通える」バッジ。カードは既存 data-detail=\"${dept_id}\" を付与し renderDetail() 遷移を流用（新規ナビ不要）。deptToItem/deptCard も再利用可能でコスト圧縮。

### 【high価値／mediumコスト】
- **配置**: 入試タブ（uniTabEntrance / 大学ページ）。detailEntranceV2 の emd行ループ（app_v2ui.html:3479-3487）を拡張。評定条件は分離方針で「大学共通」に割当済みのため、大学ページ入試タブに置くのは方針に完全合致。学部/大学分離は壊さない（REJECT不要）。
- **データ根拠**: work/data_v2.json 実測: uni.entry_method_details[type][].hyoutei_min（数値）=105方式（sogo 38 + koubo 67 + ippan 0）で、案の「105方式」主張と完全一致。分布 3.5:32, 3.0:20, 4.0:17, 3.2:11, 2.7:8, 3.8:7, 4.3:3, 2.5:3, 3.3:3, 2.8:1。hyoutei_note（文字列）=全方式に存在（例「3.0以上」「3.5以上（英検2級以上推奨）」「学部により3.8〜4.3（要確認）」）。数値化不能な note-only=26方式（「学部により条件あり（要確認）」「設定なし（不要）」等）、null/「指定なし」=205方式。sogo/koubo保有123大学中、数値min≧1を持つ=77大学、数値min無し（要確認に縮退）=46大学。全123大学が entry_method_details 保有。
- **実装方針**: 3状態フィルタとして実装（二値にしない）。(1)uniTabEntrance 冒頭に「あなたの評定平均」number入力（step0.1, 2.0〜5.0）を追加し localStorage 保存で大学間を跨いで保持。(2)detailEntranceV2 の emd rows.forEach（3479-3487）で各方式の状態を算出: g=userGPA として、typeof r.hyoutei_min==='number' なら（min<=g → 状態=出願可能／min>g → 状態=届かない＝グレーアウト）；hyoutei_min==null かつ hyoutei_note が「指定なし/なし/不問/評定不問」→ 状態=評定不問（常に可、ippan 139方式もここ）；hyoutei_min==null かつ note が「学部により…/要確認/設定なし（不要）/実施なし」等の有意文字列 → 状態=要確認（グレーアウトも誤ハイライトもしない中立）。(3)method-item にバッジ（出願可能/届かない/評定不問/要確認）と class（.method-ok/.method-out/.method-neutral）を付与、CSSで .method-out を opacity/グレー。(4)hyoutei_note は既存表示（3482行）を維持し全状態で併記、note に「学部/学科/要確認」を含む数値minは「出願可能（学部により要確認）」表記に。(5)GPA未入力時は現状の全表示にフォールバック。新規データ不要、既存レンダリング済みカードへのclass切替のみで再描画も軽い。

### 【high価値／mediumコスト】
- **配置**: 学部ページ（deptOnlyBody）。提案の「入試タブ＝大学ページ」は偏差値起点のため学部/大学分離方針(偏差値=学部固有)に違反する。大学は複数偏差値帯を内包し単一基準を取れないので、現在閲覧中の学部のhensachi+interest_tagsを基準にする学部ページが正。通学/下宿の判定に使うaccess_from_shiga_min・commute_possible自体は大学共通データだが、抽出のアンカー(偏差値・分野)が学部固有なので配置は学部ページで方針整合。
- **データ根拠**: 全guessedDataが実在・高保有。uni.access_from_shiga_min=123/123(数値・分単位)、uni.commute_possible=123/123(bool;true55/false68)、uni.commute_note(表示文字列)、dept.hensachi.min/max=650/650(basis:kawai等)。加えて同レベル抽出を「同分野」で意味あるものにするdept.interest_tags=650/650、dept.uni_id→uni連結=650/650(欠損0)。※employment_fieldsは611/650でやや欠けるためフィルタ主軸には非推奨。
- **実装方針**: deptOnlyBodyに「🏠 滋賀から通える同レベルの併願候補」節を追加。抽出関数extractCommutablePeers(refDept): refMid=(hensachi.min+max)/2、refTags=Set(interest_tags)を作り、departmentsを走査してuni_id≠自校 かつ |mid-refMid|<=2.5 かつ interest_tagsが1つ以上共有 の学部を候補化。既存uById(uni_idマップ)でuniを引き、u.commute_possible===trueを「通学可」群、falseを「下宿前提」群に分割。各群をu.access_from_shiga_min昇順ソートし上位6〜8件にcap。表示: 通学可群「下宿せず通える(片道X分/偏差値H)」、下宿群「下宿前提なら広がる選択肢」。各行は学部名/大学name_short/片道分/hensachiを出し、既存の学部ページ遷移ヘルパでその学部にディープリンク。通学可群が空なら「この学部レベルでは滋賀から通える同分野校が見つかりません（下宿前提の選択肢のみ）」を注記。commute_noteは代表校の補足として任意表示。

### 【high価値／mediumコスト】
- **配置**: お気に入り・比較画面（renderFavs / #favsContent）。提案の page=「入試」は誤り。単一大学の入試タブに「他校を横断集約した書類まとめ」を置くのは筋が通らない。複数校を既に集めている唯一の画面＝比較(favs)画面の先頭にサマリーブロックを追加するのが正しい。これは学部/大学分離方針に違反しない（比較画面は横断ビューであり、大学共通データのrequired_documents/日程を読むのは方針通り。学部ページ・大学ページの改変ではない）。
- **データ根拠**: 実在確認済み（node -eでdata_v2.json精査）。(1) uni.nyushi_details.sogo[].required_documents / .koubo[].required_documents = 総合型+推薦の187方式中174方式が保有（nyushi_details保有は85大学/123）。ラベルは18種で正規化可能: 調査書174・志望理由書105・推薦書85(＋変種「推薦書（校長）」14/「推薦書（顧問・校長）」1)・活動報告書75・自己推薦書4・志願票4等。(2) 締切データも高被覆: application_period 187/187・enrollment_deadline 180/187・exam_date 187/187・result_date 187/187。(3) dept.entry_methods[].{type:'sogo'|'koubo',available} = 650/650学部が保有（学部単位の方式可否）。(4) お気に入りはgetFovs()がdept_idを保存、findDeptV2(deptId)→{dept,uni}でuni.nyushi_detailsに到達可能。単一校のrequired_documentsは既にL3627/L3639(入試タブ)とL3293(詳細)で表示済みだが、横断集約は未実装＝REDUNDANTではない。【データ欠落】書類を「共通で使える(再利用可)」と判定するフィールドは無い。志望理由書は各校別執筆で実際は再利用不可、調査書のみ学校一括請求可、という区別はデータに存在しないため「共通で使える書類も表示」はデータ駆動不可＝アプリ側の固定ラベル分類で近似するしかない。
- **実装方針**: renderFavs()の先頭に集約ブロックを追加。手順: (a) getFavs()の各dept_idをfindDeptV2で{dept,uni}化。(b) 各学部のdept.entry_methodsでsogo/kouboがavailableな方式だけ対象化し、uni.nyushi_details[sogo|koubo][].required_documentsを収集。(c) ラベル正規化マップで括弧書き修飾を除去(例:「推薦書（校長）」→「推薦書」)し、志望理由書/調査書/活動報告書はそのまま。(d) ラベル別に「必要校数」を集計→『志望理由書×3・推薦書×2・調査書×3』とタグ表示。(e) 各方式のapplication_period(締切)を昇順ソートし、直近の出願締切トップ3を「最短締切」として警告表示、enrollment_deadlineも併記。(f) 「共通で使える」はデータ無しのため、固定分類で『調査書＝高校に一括請求可(枚数だけ)／志望理由書＝各校ごとに執筆が必要』の注記を出す(アプリ側ロジック、データ駆動不可を明記)。実装規模: renderFavs内に約60-100行のJS＋正規化マップ＋小CSS、新規データ不要。方式選択が保存されていない点は「総合型・学校推薦型で出願する場合」という前提文言で吸収する。

### 【medium価値／lowコスト】
- **配置**: 大学ページ入試タブ（uniTabEntrance）の「想定倍率」行のみ。line 3279 の _row('想定倍率', …) を差し替える。学部ページには触れない。
- **データ根拠**: uni.entry_method_details.{sogo,koubo,ippan}[].bairitsu = 非null 203件、綴り誤りキー baiio = 44件（両者は排他、both:0）。合計247/336方式エントリ（73.5%、全123大学に分布）が値あり。残89は値なし（うちbairitsu:null 24件含む）。値は全て「2.0〜3.5倍」「1.1倍程度」「5.0〜15.0倍（医）」等の範囲文字列で、正規表現 /[0-9]+(?:\.[0-9]+)?/g により247件すべて数値抽出成功（parseFail:0）。上限値バケットの分布 ≤2:49 / 2-3:79 / 3-5:71 / 5-8:34 / >8:14 でヒートスケールに十分な広がりあり。dept側の一般倍率（dept.bairitsu.ippan 年度推移）とは別データで、この案は触れない＝分離方針は保たれる。
- **実装方針**: (1) ヘルパー _bairitsuBadge(str) を新規追加：文字列から /[0-9]+(?:\.[0-9]+)?/g で数値配列を取り、上限=Math.max(...nums) を代表値にする。閾値で5段階に色分け（例 ≤2=緑, ≤3=黄緑, ≤5=琥珀, ≤8=橙, >8=赤）。返り値は `<span class="heat-badge" style="--hb:色">${_esc(str)}</span>`。数値抽出0件の異常系は素の _esc(str) を返す。(2) CSSに .heat-badge { display:inline-block; padding:1px 8px; border-radius:10px; font-size:12px; font-weight:600; background:var(--hb); color:#fff } を1つ追加。(3) line 3279 を `_row('想定倍率', (r.bairitsu||r.baiio) ? _bairitsuBadge(r.bairitsu||r.baiio) : null)` に変更。_row は v を `<dd>${v}</dd>` と生挿入（エスケープは呼び出し側責務）なのでバッジHTMLをそのまま渡せる。既存の _esc は badge内で行うのでXSSリスク無し。注意：値は「想定倍率＝推定値」であり既存の⚠️推定バナーがあるため、原色の強い赤緑ではなく彩度を落とした色にし、精度過信を招かないこと。範囲の代表値は上限採用（＝最も厳しい側）を明示。line 3872/3901 の m.bairitsu は renderEntranceTab 経由の到達不能な旧コード（liveディスパッチャ line3233 は uniTabEntrance を使用）なので改修不要。

### 【medium価値／lowコスト】
- **配置**: 入試タブ（uniTabEntrance）冒頭。verified/estimated バナー直後、sogo/koubo/ippan の h4 ループ（app_v2ui.html 3268行〜）の前に chip 列を挿入。評定条件は大学共通データなので大学ページ配置は分離方針と整合（学部固有の可否は学部ページ側のまま）。分離方針は壊さない。
- **データ根拠**: uni.entry_method_details（objectキー sogo/koubo/ippan、各value配列）＝全123大学に存在。hyoutei_note 非null件数: koubo 85/119 methods・sogo 47/78 methods・ippan 0/139。hyoutei_min 非null: koubo 67・sogo 38・ippan 0。sogo は47大学が空配列（総合型なし）、koubo 空5、ippan 空0。koubo の hyoutei_note のうち33件が「学部により…/要確認」表記。ippan は hyoutei_min/note が全null で『評定不問』は notes 自由文にのみ存在（139中55件が評定/不問に言及）。多方式は稀（koubo>1が1大学・sogo>1が2大学）。現状は評定条件が各 method カードの _dl 先頭 _row（3275行）に埋もれており、タブ冒頭サマリーは未実装＝REDUNDANTではない。
- **実装方針**: uniTabEntrance で banner 生成後・h4ループ前に、['sogo','koubo','ippan'] を走査してチップ列 `<div class="hyoutei-chips">` を組む。各カテゴリの代表評定を hyoutei(arr) で算出: (1) 配列内で hyoutei_note が非nullの最初値をそのテキストのまま採用（「学部により異なる」等も verbatim 表示し数値捏造による誤誘導を回避）、(2) 無ければ hyoutei_min!=null で `${min}以上`、(3) 両方無い場合、ippan は全nullのため固定ラベル『評定不問（学科試験）』を静的付与（一般選抜は定義上GPA足切りが無く安全）、sogo/koubo で null は『要確認』。空配列カテゴリ（総合型なし47大学）はチップを出さない。出力例 `<span class="chip">総合: 指定なし</span><span class="chip">公募: 3.2以上</span><span class="chip">一般: 評定不問</span>`。ラベルは既存 METHOD_TYPE_LABEL を流用、複数distinct値は「/」連結。CSSは既存 .chip 系を再利用（新規スタイル数行）。ippanの静的ラベルと『学部により異なる』表記は既存 estimated-banner（学部で評定条件が異なる旨の警告）と整合するため注記の追加不要。

### 【medium価値／lowコスト】
- **配置**: 学部ページ（deptOnlyBody, app_v2ui.html L3386〜）。案のpage:"入試"は誤り。dept.bairitsu.ippanは学部固有データであり、大学ページ入試タブ(uniTabEntrance)に置くと学部/大学分離方針を壊す。入試タブには既に大学共通のuni.bairitsu_trend（123/123大学が保有、L3658の方式別倍率推移テーブル）がありレイヤーが別。矢印は既存「倍率（一般）」行(L3395付近, bai変数)の直下に置く。
- **データ根拠**: dept.bairitsu.ippan（650/650学部が保有）。年度キー実測: 2026=449件, 2025=621件, 2024=13件。矢印計算に必要な「2025と2026の両方が数値」は447/650件（69%）。値は全1070個すべてtypeof number・非数値ゼロで、パース失敗の心配なし。ただし2024/2025/2026の3年連続を持つ学部は0件（2024保有13件は25・26の両方とは重ならない）＝トレンドは常に2点(2025→2026)の単年差分に限定。dept.bairitsu.source_url/verified_dateも各学部にあり出典表示済み。
- **実装方針**: deptOnlyBodyの既存bai行(baiE配列)の直後に追記。const a=ippan['2025'], b=ippan['2026']; 両方が数値のときのみ描画（447件。単年174件・データ無27件は矢印非表示）。const diff=b-a; 閾値±0.3で3分岐: diff>=0.3→「↑ 前年より難化（{a}→{b}倍）」赤、diff<=-0.3→「↓ 前年より易化（{a}→{b}倍）」緑、それ以外→「→ ほぼ横ばい」灰。実測分布(閾値0.3): 難化193/易化80/横ばい174と偏りなく機能する。色付きバッジ＋一言をspanで既存行に付与、約15行・純粋なUI計算で新規データ不要。文言注意: 3年連続データが0件＝隔年現象を検出できない単年差分のため、コピーは「前年比」の相対表現に固定し「狙い目/避けるべき」等の絶対的な合否示唆は避ける（案のwhyにある『狙い目/避ける』は言い過ぎ→『前年より易化/難化』止まりにする）。

### 【medium価値／lowコスト】
- **配置**: 学部ページ deptOnlyBody（app_v2ui.html:3386, 既存の _row('偏差値', band) の直後）。案の page:"入試" は誤り。偏差値は学部固有データで分離方針上は学部ページに置くもの。大学ページの入試タブ(uniTabEntrance)は評定条件・日程など大学共通のみを扱い学部固有hensachiを持たない設計なので、そこにゲージを置くと分離方針を壊す。学部ページなら uni も引数で渡っており国公立補正も計算できるため矛盾なく実装可。REDUNDANTではない: 結果一覧の偏差値帯マップ(app_v2ui.html:2975)と scoreの挑戦圏/安全圏reasonは「一覧レベルで uni代表偏差値ベース」の距離表示で、個別学部詳細ページには本人偏差値との比較が一切無い（grep で adjustedHensachi/gap/あと の参照ゼロを確認済み）。しかも詳細では uni.hensachi_representative より精緻な dept.hensachi を使えるため加点的。
- **データ根拠**: 目標側: dept.hensachi.min = 650/650件が非null（range 35-70, basis全件kawai）。dept.hensachi.max も650/650（min===max が291件、min<max が359件）。source_url/verified_date/basis も全件保有。ユーザ側: state.diag.hensachi（30-75, クイックボタン52/48/43 or 直接入力, app_v2ui.html:2426-2450）と adjustedHensachi()（app_v2ui.html:2074 = 偏差値+EXAM_SOURCE_OFFSET[examSource] 河合換算）が既に存在。国公立補正 kkBonus()=8（app_v2ui.html:3173）と isKokkoritsuUni(uni) も deptOnlyBody 内で既に呼べる。guessedData の dept.hensachi.min は実在・全件保有で正しい。
- **実装方針**: deptOnlyBody 内で myHen = adjustedHensachi() を取得。未入力ガード（state.diag.hensachiUnknown || !state.diag.hensachi → ゲージ非表示 or「偏差値を入力すると『あと何』が出ます」CTA。既存 line2942 と同パターン）。比較の目標値は表示中の band と一致させるため国公立補正込みで target = h.min + (kk ? kb : 0)（kk/kb は同関数内で既算出）。gap = target - myHen。gap<=0 なら「✓ 到達（達成）」緑表示、gap>0 なら「あと ${gap.toFixed(1)}」。ゲージは (target-15)〜(h.max+kk補正) を軸に myHen の位置を CSS width%（clamp 0-100）で塗る横バー1本＋目標マーカー。挑戦/安全の色は既存帯マップ境界(±3.5 / +3.5〜+10 / -3.5〜-10)を流用して色分けし一貫性を担保。max行はサブに「合格圏まで満たすには ${h.max} まで」。新規レンダ1ブロック（~30行）＋既存CSS変数流用のみでロジック追加ほぼ不要。

### 【medium価値／lowコスト】
- **配置**: 学部ページ（deptOnlyBody）の既存「倍率（一般）」行の直後。入試タブ(uniTabEntrance)ではない。bairitsuは学部固有データで既に学部ページに表示されており、大学入試タブに置くと分離方針違反＆重複になるため、案のpage="入試"は却下し学部ページに是正する。
- **データ根拠**: 実在確認済(node -e): dept.bairitsu.ippan=650/650だが空{}が25件・実データ625件 / dept.bairitsu.verified_date=625件(例"2026-07-13") / dept.bairitsu.source_url=625件。最新年度の分布=2026が449件/2025が174件/2024が2件のみ。HTML側でverified_dateは現在0箇所使用(未活用)、鮮度バッジ未実装。
- **実装方針**: deptOnlyBody(app_v2ui.html:3392付近)で既にbaiE(年度昇順配列)を算出済み。最終年度 latestY=Number(baiE[baiE.length-1][0]) を取り、DATASET_MAX=2026(data_v2.updated基準の定数)と比較。(1)latestY<DATASET_MAX なら『最新◯◯年・より新しい年度の可能性あり』の注意バッジを倍率行に付す(該当176件=2025止まり174+2024の2で全体の27%、実用的)。案の『2年以上前(≤2024)』閾値は2件しか光らず無価値なので閾値を『最新でない=<DATASET_MAX』に是正。(2)年度キーに欠番があれば(例2024と2026だけで2025欠落)『年度に飛びあり』注記。(3)verified_dateを『確認: 2026-07』形式で小さく併記(現在完全未使用)。(4)ippanが空{}の25件はbaiがnullで倍率行自体が非表示→『一般倍率データなし(要確認)』の代替行を追加。既存baiE/source_urlロジックに数行追加のみでcost低。

### 【medium価値／lowコスト】
- **配置**: 2箇所。(1)大学ページ入試タブ=uniTabEntrance(3252) に静的の誘導注記のみ。(2)学部ページ=deptOnlyBody(3386-3432) に共テ可否の明示行。学部/大学分離方針は維持：可否データ本体は学部側(entry_methods)に置き、大学側は「学部ページで確認」の誘導文のみ。可否そのものは大学ページに載せないので方針は壊れない。
- **データ根拠**: dept.entry_methods[type=kyotsu] は全650学部が保有（type分布 sogo/koubo/ippan/kyotsu 各650）。available=true 614件 / false 13件 / null 23件、note は 650/650 が非空、verified=true 619件。null 23件の note は「共テ利用の有無は要調査」「記載なし（未確認）」等で"不可"とは別物。ラベル定数 METHOD_TYPE_LABEL.kyotsu='共テ利用' は既存(app_v2ui.html:3198)。大学ページ入試タブ uniTabEntrance(3252-3307) は ['sogo','koubo','ippan'] のみループしkyotsuを意図的に除外済み(3268にコメント「可否は学部ページ」)。学部ページ deptOnlyBody(3404-3411) は avail=filter(m=>m.available) で available truthy のみ表示。
- **実装方針**: (1)uniTabEntrance: sogo/koubo/ippanのループ後、return文のhtml末尾（公式リンク前）に静的注記1行を追加。例 `<p class="detail-note">💡 共通テスト利用の可否・理由は学部ごとに異なります。各学部ページの「使える入試方式」欄で確認してください。</p>`。データ参照不要。 (2)deptOnlyBody: 現状 avail=filter(m=>m.available) は available=true の614件だけ「共テ利用 ✓確認済」+noteを表示し、false13/null23の計36件は沈黙して「不可なのか未記載なのか」判別不能。そこで methodsHtml とは別に kyotsu 専用行を常時出す。const ky=(dept.entry_methods||[]).find(m=>m.type==='kyotsu'); で取り出し、ky.available===true→「共テ利用：可」、===false→「共テ利用：不可」、それ以外(null)→「共テ利用：要確認」に3分岐（null を false と混同しないことが必須。noteが「要調査」のため）、ky.note を method-note、ky.verified で ✓確認済バッジ。既存の「使える入試方式」で true が二重表示にならないよう、availフィルタから kyotsu を除外し kyotsu だけこの専用行に集約するのが綺麗。

### 【medium価値／lowコスト】
- **配置**: 大学ページ入試タブ（renderMethodTab の koubo カード）。評定の定義・「実施なし/指定校のみ」但し書きは大学共通情報なので大学ページ配置で分離方針に整合。学部固有の入試方式可否(dept.entry_methods)は学部ページのまま触らない。
- **データ根拠**: node -e で work/data_v2.json (大学123/学部650) を確認。(1) uni.entry_method_details.koubo[].hyoutei_note = 85/119件、うち「実施なし/指定校のみ」パターン=8件(立命館「設定なし（指定校のみ）」/同志社/関学/早稲田/慶應/明治/法政/南山)。(2) uni.entry_method_details.koubo[].notes = 56/119件、指定校言及7件(「一般向けの公募制推薦は実施なし。推薦は指定校…が中心」等)。(3) uni.entry_method_details.koubo[].type = 42/119件のみ、値は専願30/両方あり8/併願可4 → 専願/併願の区別であり公募/指定校ではない。(4) 「評定=3年1学期まで/全体の学習成績の状況」の定義テキストはdata_v2に0件(『学習成績の状況』0/『3年1学期』0/『全体の学習成績』0)。診断Step1(app_v2ui.html:1704)に類似定義が既存。
- **実装方針**: renderMethodTab(app_v2ui.html:3858-3881, key='koubo')を改修。(1)【評定定義・固定文】kouboカード群の先頭に静的注記を1回だけ挿入(データ不要):「評定＝高3は『3年1学期まで』の全体の学習成績の状況（全科目の5段階平均）」。診断Step1(行1704)の文言を流用し重複表現を避ける。(2)【実施なし警告の昇格】各koubo方式で m.hyoutei_note/m.notes を /実施(なし|していない)|指定校のみ|限定的/ で判定し、該当時(8件)は表セル内ではなく method-card 上部に警告バナー(例: ⚠️『一般向けの公募制推薦は実施なし。推薦は指定校・スポーツ/AO等が中心』)を昇格表示。バナー本文は hyoutei_note+notes の実文をそのまま使う。(3)【誤前提の是正】typeは公募/指定校の区別に使わない(=専願/併願で確定、line3869は現状維持)。指定校/公募の構造化区別は不可のため、専用の区別ラベルは作らず自由文の強調に限定する。学部ページ側(detailEntranceV2/dept.entry_methods)は変更しない。

### 【medium価値／mediumコスト】
- **配置**: 入試タブ（uniTabEntrance＝大学ページ）。日程は大学共通データなので学部/大学分離方針と整合し、置き場所の是正は不要。既存の縦dl（app_v2ui.html:3284-3296）の直前または置換で横タイムラインを追加。
- **データ根拠**: uni.nyushi_details.{sogo,koubo,ippan}[].{application_period, exam_date, result_date, enrollment_deadline}。保有: 85/123大学・308方式。存在率 application_period 308/308・exam_date 308/308・result_date 308/308・enrollment_deadline 286/308（22件空）。ただし全て自由記述の和暦文字列。日精度で3コア日付が揃うのは100/308（32%）のみ、月精度なら298/308（96.7%）が配置可。明示年あり244/308、月のみで年推定要64/308、年跨ぎ明示12件。nyushi_details無し38大学は対象外。
- **実装方針**: (1) 和暦→{month, half}パーサを新設: parseJpDate(str, seasonYear) — 正規表現で[年]?(\d+)月((\d+)日|上旬|中旬|下旬)?を抽出、年は明示があれば採用・無ければ月から推定（9-12月=seasonYear, 1-3月=seasonYear+1）、範囲(〜)は先頭を開始点に。返り値は月軸座標 pos = (month-9+12)%12 + (上旬0/中旬0.33/下旬0.66/日→day/31)。パース不能(—/未実施/面接のみ/非公開)はnullを返す。(2) 軸は9月始まりの固定7〜8区間（9,10,11,12,1,2,3月）。方式ごとに1本の横trackを描画: 出願(application_period開始)〜手続〆(enrollment_deadline、無ければresult_date)を帯、試験日(exam_date)と合格発表(result_date)をマーカー点で重畳。CSSはflex/gridの%配置でレスポンシブ、色は既存のprefers-color-scheme/data-theme変数を流用しダーク両対応。(3) 各方式でコア3点がnull（10件相当）または nyushi_details無し（38大学）は従来の_dl表示にフォールバック。全方式を同一軸に積むと併願比較が一目化。(4) 既存の_dl（試験科目/必要書類/special_notes）はタイムライン下に残す（日付以外の情報は縦dlが適切）。実装規模: parser約40行＋描画約60行＋CSS約30行、単一HTML内で完結。

### 【low価値／lowコスト】
- **配置**: 大学ページ 入試タブ（uniTabEntrance, app_v2ui.html:3252）の検証バナー直後。特待生は大学単位の制度で、評定条件・入試日程と同じ「大学ページの入試情報群」に属すため、学部/大学分離方針に違反しない（学部固有情報ではない）。学部ページには置かない。
- **データ根拠**: node -eで実データ確認（work/data_v2.json, 大学123件）。shogakukinは2スキーマ混在: 【variant A：83校】sports_tokutai / general_shogakukin / shogakukin_official_url ・sports_tokutai: キー保有45件、意味ある値18件（内訳:「スポーツ特待生制度」等の一文が16件、ランク/免除の詳細ありは大阪体育大「S・A・Bランク。学費全額〜一部免除」とびわこ成蹊スポーツ大「学費全額・半額・1/4等」の2件のみ）、null 16件、「要確認」10件、「なし」1件。 【variant B：40校】tokuaisei(綴り誤りキー) / shogakukin / url ・tokuaisei にスポーツ特待が入る: 日本体育大/筑波/国士舘/明治/順天堂 の5件が意味あり値。★guessedDataはこのフィールドを漏らしている。 ・合算でスポーツ特待の意味ある大学 = 23/123（19%）。この23校は全て奨学金URL(shogakukin_official_url 45件 or url 40件)を保有。 ・スポーツ特待専用URLは存在せず、あるのは一般奨学金ページURLのみ。 ・現状の表示: 能動コードでsports_tokutaiを表示している箇所はゼロ（uniTabLife/uniTabEntranceとも未使用。唯一表示するrenderLifeTabは呼び出し元0件の死にコード）。よって「未使用」の前提は入試タブに限らずアプリ全体で真=REDUNDANTではない。
- **実装方針**: uniTabEntranceのbanner生成直後に次を追加。両スキーマvariantをORで吸収するのが肝: const sg = uni.shogakukin || {}; const sports = sg.sports_tokutai || sg.tokuaisei; // ★typoキーtokuaiseiも必ず拾う const surl = sg.shogakukin_official_url || sg.url; // ★URLも両variant const BAD = ['要確認','不明','なし','']; if (sports && !BAD.includes(sports)) { banner += `<div class="tokutai-badge">🏅 スポーツ特待生制度: ${_esc(sports)}` + (surl ? ' ' + _link(surl, '奨学金情報') : '') + `</div>`; } 表示方針: 値は原文一文をそのまま表示（ランク/免除の構造化データが無いため、S/A/Bランク別UIは実装不可。該当2校のみ文中にランク文字列が含まれる形で表示される）。「要確認/なし/不明/null」はバッジ非表示にフィルタ済み。CSSは既存のバッジ系クラス（verified-banner等）に倣い薄い枠+🏅で軽量に。23校のみ表示され残り100校は非表示になる点は許容（該当時のみ意味を持つバッジ）。

### 【low価値／lowコスト】
- **配置**: 学部ページ=倍率（一般）行の直後に注記(dept固有の年度推移に添える)。大学ページ入試タブ=倍率推移表(renderBairitsuTrend)の下＋想定倍率(uniTabEntrance)付近に凡例。分離方針は維持: 方式別の想定倍率数値は大学ページ側に置き、学部ページからは「入試タブの方式別想定倍率を参照」とリンク誘導のみにする。
- **データ根拠**: 
- **実装方針**: honestな部分のみ実装し、分母・志願/実質の断定はしない。(1)学部ページ deptOnlyBody の「倍率（一般）」行(app_v2ui.html:3423)直後にdetail-noteを1行追加:「この倍率は一般選抜のみ。総合型/公募推薦の倍率は大学ページ入試タブの方式別『想定倍率』を参照(=別物)。志願倍率/実質倍率の別・分母は各大学の出典要項で異なるため要確認」。(2)大学ページ renderBairitsuTrend の表下(3687付近)と uniTabEntrance の想定倍率セクション(3279付近)に共通凡例1行:「A総合/B公募/C一般は別方式=倍率も別。数値の定義(志願倍率/実質倍率・分母)は大学の出典により異なる」。(3)志願/実質・分母の具体値はデータに無いので変数化せず静的文言のみ。個別数値へ「志願倍率」等の断定ラベルは付けない。

## C. 学部ページ（1件）

### 【medium価値／lowコスト】
- **配置**: 学部ページ（deptOnlyBody の偏差値行）。偏差値は学部固有データなので分離方針どおり学部ページで正しい。大学ページ側は触らない=方針維持。
- **データ根拠**: work/data_v2.json の departments[].hensachi を node -e で全650件検査。全650件が {min,max,basis,source_url,verified_date} を持つオブジェクト。実在フィールドと保有件数: dept.hensachi.basis=650/650（全て "kawai"）, dept.hensachi.min/max=650/650（全て数値）, dept.hensachi.source_url=643/650（7件null: ritsumeikan-d04, sophia-kokusaikyoyo 等）, dept.hensachi.verified_date=643/650（全て "2026-07-13"、7件null）。現状 deptOnlyBody（L3390-3391,3422）は band に basis のみ描画＝『45（kawai基準）』。source_url と verified_date は存在するが未描画（grep で hensachi の source_url/verified_date 描画箇所ゼロ、_link は bairitsu.source_url にのみ使用 L3395）。案の guessedData は basis/min/max/source_url/verified_date すべて実在。
- **実装方針**: deptOnlyBody（L3386-3391）の band 生成後、偏差値 dd に既存 _link ヘルパー（L3197）で出典リンクと検証日バッジを追記: `_row('偏差値', band + (h.source_url ? ' '+_link(h.source_url,'出典') : '') + (h.verified_date ? ` <span class="ok-badge">${h.verified_date}時点</span>` : ''))`。7件のnullは三項でリンク/日付を省略しbasisバンドのみ残す（既存 baiSrc と同じ堅牢化パターン）。定義注記は静的テキストで既存 .detail-note を流用: 偏差値行直後に `<p class="detail-note">📐 これは合格可能性50%のボーダー偏差値です。模試の種類（進研/駿台など）で数値が変わるため、上の『どの模試？』の基準で自動換算しています。</p>`。データ不要。ただし1点是正必須: source_url は passnavi.obunsha.co.jp（旺文社パスナビ）だが basis は "kawai"（河合塾）。出典リンク文言と基準表記が不一致なので、注記は『河合塾偏差値』と断定せず『旺文社パスナビ掲載の河合塾ボーダー偏差値』等に整合させること。basisバッジ『（kawai基準）』は既に表示済み=この部分のみREDUNDANT、net-newは出典リンク＋検証日＋50%定義注記。
