# 進路診断アプリ（滋賀の高校生向け・一般版）

スマホで使える単一HTMLの進路診断アプリ。診断（評定・偏差値・興味・職業・地域・入試方式・RIASEC適性）から、収録183大学・1086学部を3ゾーン（実力相応/チャレンジ/安全圏）でおすすめする。

- **公開URL**: https://ganchi2014-tech.github.io/shinro-shindan-general/ （masterへpushすると約1分で自動反映。GitHub Pagesがルートを配信）
- 本体: `進路診断_v2.html`（ビルド生成物。直接編集しない）

## ビルド・テスト（Node.jsのみ。Python不要）

```
node work/build_v2ui.js      # テンプレ work/app_v2ui.html + data_v2.json → 進路診断_v2.html を生成
node work/test_engine_v2.js  # エンジンのテスト（ALL OK が出れば緑）
node work/test_bridge_v2.js
node work/test_agg_v2.js
node work/check_v2.js        # データ検収（CHECK PASS）
```

ローカル確認は任意の静的サーバで `進路診断_v2.html` を開く（例: `npx http-server -p 8899`）。

## リポジトリ構成

| 場所 | 内容 |
|---|---|
| `work/app_v2ui.html` | **編集対象のテンプレ**（CSS/HTML/JSすべてここ。ビルドでデータがインライン化される） |
| `work/data_v2.json` | 大学183校・学部1086件のデータ（編集用にpretty。ビルド時に自動ミニファイ） |
| `work/build_v2ui.js` | ビルドスクリプト |
| `work/engine_v2.js` ほか | 診断エンジン・ブリッジ・大学集約（それぞれ test_*.js とペア） |
| `work/merge_v2_add.js` | **大学/学部の追加用マージ**（検証つき。使い方は冒頭コメント） |
| `work/merge_research.js` | 調査結果による後追い検証マージ（research/*.json → data_v2） |
| `work/research/_gen_20260717/` | 2026-07-17拡充分の生成ソースJSON（60校+fill15校分） |
| `docs/superpowers/plans/` | **実装計画・引き継ぎ資料**（下記参照） |
| `docs/data-verification/` | データ検証記録・拡充時の注意点 |

## 作業履歴（2026-07）

| 日付 | コミット | 内容 |
|---|---|---|
| 〜07-13 | | v1UI×engine_v2移植、学部単位データ基盤、学部/大学ページ分離、国公立+8補正、総点検22件 |
| 07-16 | `e281c90` | **進路タブ**（就職の強み8分野バー・警察消防・卒業生・留学）、**入試タブ**（評定チップ・倍率ヒートバッジ・日程タイムライン）、**学部ページ**（偏差値出典・倍率前年比・同レベル併願候補）。4担当レビュー反映 |
| 07-17 | `6e61bed` | **全画面改善4パック**: ①誤誘導修正（地域/通学の絞り込み表現+件数、ゾーン件数正直表示、方式〇✕ほか）②生活タブ全面改修（4年間費用シミュ・東海圏旧スキーマ吸収）③結果カード（理由チップ具体化・通学タグ）④診断UX（評定ライブカウンタ・興味バッジ・RIASEC警告・←戻る修正） |
| 07-17 | `bf0865a` | **データ拡充 123→183校 / 650→1086学部**（近畿私立20+国公立13+関東全国27+既存15校へ66学部）。全新規分は推定データ（estimated・要確認表示）。ビルドJSONミニファイ導入 |

詳細な経緯・レビュー指摘・実装方針は各コミットメッセージと計画docに記録。

## 重要ドキュメント

- `docs/superpowers/plans/2026-07-16-nyushi-shinro-improvements.md` — **メインの計画doc**。実施済み一覧＋「採用済み・未実装」の次回候補（Android戻る対応・印刷CSS・favsソート/コピー・一覧の分野絞込・空結果緩和ボタンなど）
- `docs/data-verification/2026-07-17-expansion-notes.md` — 拡充データの注意点（2025年前後の共学化・改組、学科単位分割、医系学費など）と後追い検証の方法
- `docs/superpowers/_salvage_ideas.json` — 改善アイデア生データ136案+批評66件

## 別PCでの再開手順

1. `git clone https://github.com/ganchi2014-tech/shinro-shindan-general.git`
2. Claude（Claude Code）に「**このリポジトリのREADMEと docs/superpowers/plans/ の計画docを読んで、進路診断の続き**」と伝える
   - このREADME＋計画docだけで文脈復元できるように書いてある（Claudeのメモリに依存しない）
3. 編集は必ず `work/app_v2ui.html` → ビルド → テスト → コミット → push の順（本体HTMLの直接編集禁止）

## データ品質の方針

- `data_status`: verified（出典+検証日あり）/ estimated（推定。アプリが推定バナー表示）/ unconfirmed（未確認警告）
- 推定値には「（要確認）」を付け、日程・年度別倍率・ゼミは出典なしでは載せない（merge_v2_add.jsが機械的に排除）
- 後追い検証: パスナビ等で調査 → `work/research/<uni>.json` → `node work/merge_research.js` でマージ（差分がdocs/data-verificationに記録される）
