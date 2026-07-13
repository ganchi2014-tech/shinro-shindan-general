# 調査エージェント用プロンプト雛形

以下を1エージェントあたり3〜5校分埋めて使う。

---

あなたは日本の大学入試データの調査員です。以下の大学について、指定スキーマのJSONを作成してください。

## 対象大学と学部一覧（dept_idはこれを厳守。改変・追加・省略しない）

{{dept_manifest.json から対象校分を貼り付け}}

## 調査項目（学部ごと）
1. **偏差値**: 河合塾Kei-Net（https://www.keinet.ne.jp/）の最新値を最優先。学部内に複数学科があれば min/max で幅を表現。2.5刻み
2. **一般入試倍率**: 大学公式サイトの入試結果ページから直近2年分。学部単位（学科は代表値または平均）
3. **入試方式**: 総合型/公募推薦/一般/共通テスト利用の有無（学部単位で判明する範囲）
4. **看板ゼミ・研究室**: 学部公式ページで紹介されている代表的なゼミ・研究室を1件（容易に見つかれば最大3件、看板を先頭に）。名称＋テーマ1行＋掲載ページURL
5. **主な就職系統**: 学部の進路実績ページから業界タグを2〜4個（許可ID: koumuin, kyoiku, kinyu, maker, it, ryutsu, iryo_fukushi, kensetsu, media, service, shokuhin, sports_kenko）

## 厳守事項
- **すべての値に source_url を付ける。出典が確認できない値は出力しない**（フィールドごと省略する）
- 推測で埋めない。見つからなければキーごと省略、学部ごと信頼できる情報が皆無なら "unconfirmed": true（学部オブジェクト直下）
- qualifications / employment_fields は確認できなかったら**キーごと省略**。空配列 [] は「0件が確定」の意味になるので送らない
- entry_methods は available の真偽を確認できた方式だけ記載（available 必須。確認できない方式はエントリごと省略）
- ゼミ調査に1学部あたり数分以上かけない（見つからなければ即スキップ）
- 出力は下記スキーマのJSONのみ（1大学=1オブジェクト、複数校は配列で）

## 出力スキーマ

```json
{
  "uni_id": "対象のuni_id",
  "researched_date": "YYYY-MM-DD（今日）",
  "sources": ["主要な出典URL一覧"],
  "departments": [
    {
      "dept_id": "manifest記載のID",
      "hensachi": { "min": 50.0, "max": 55.0, "source_url": "..." },
      "bairitsu": { "ippan": { "2025": 3.4, "2026": 3.1 }, "source_url": "..." },
      "entry_methods": [ { "type": "kyotsu", "available": true, "note": "..." } ],
      "employment_fields": ["kinyu"],
      "zemi": [ { "name": "...", "theme": "...", "source_url": "..." } ],
      "unconfirmed": false
    }
  ],
  "notes": "特記事項（学部改組の予定、データの注意点など）"
}
```
