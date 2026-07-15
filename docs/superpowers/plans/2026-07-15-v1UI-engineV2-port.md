# v1 UI × engine_v2 移植 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, checkpoints) to implement this plan task-by-task. 単一の巨大HTMLを編集するため並列subagentは競合する。Steps use checkbox (`- [ ]`) syntax.

**Goal:** v1（app.html）の完成されたUI・CSS・文言を器として、中身の診断をengine_v2（学部単位・3ゾーン・RIASEC適性）に載せ替え、`進路診断_v2.html` を再生成する。

**Architecture:** ベースはv1のテンプレ（`work/app.html`）を複製した `work/app_v2ui.html`。データ源を data_v2 に一本化し、v1の `state.diag` → engine_v2 の `userProfile` へ変換する「ブリッジ層」を新設。結果は engine_v2 の3ゾーン出力を v1 のカード品質で学部単位に描画。詳細は data_v2 の大学項目に再接続。ビルドは `work/build_v2ui.js` が data_v2 / engine_v2 / riasec_def / interest_riasec_map をインライン化して `進路診断_v2.html` を出力。

**Tech Stack:** 単一ファイルHTML + バニラJS。engine_v2 は CommonJS（`module.exports`）なのでブラウザ用に `window.ENGINE_V2` を生やすラッパをビルド時に付与。テストは node（`work/test_*.js`）＋ ブラウザ実機目視。

**確定した設計判断（ユーザー承認済み）:**
- RIASEC12問：**残す（スキップ可）**。v1フローに任意画面として挿入。
- 評定：**画面は残す（情報・推薦目安の注記のみ）**。engine_v2のスコアには影響させない。
- 挑戦度：**画面（radio group）は削除**。engine_v2の自動3ゾーンが上位互換。
- 結果：**学部単位で3ゾーン**表示。

---

## File Structure

- Create: `work/app_v2ui.html` — 移植テンプレ（`app.html` の複製から改変）
- Create: `work/bridge_v2.js` — `state.diag` → engine_v2 `userProfile` 変換 ＋ 語彙マッピング表（node test 対象の純関数群）
- Create: `work/build_v2ui.js` — テンプレに data/engine/riasec/bridge をインライン化 → `進路診断_v2.html`
- Create: `work/test_bridge_v2.js` — bridge の node テスト
- Modify: `進路診断_v2.html`（ビルド生成物・出力先。手編集しない）
- 参照のみ（変更しない）: `work/engine_v2.js`, `work/data_v2.json`, `work/riasec_def.json`, `work/interest_riasec_map.json`, `work/app.html`, `work/app_v2.html`

---

## Task 1: ブリッジ層（語彙マッピング＋userProfile変換）を純関数で実装

engine_v2 は `userProfile = { regions[], commuteOnly, hensachi, examSource, riasecAnswers[], interests[], careers[], examMethods[], budgetMax }` を要求する。v1 の `state.diag` はこれと語彙・粒度が異なるので変換表と変換関数を作る。これが移植の心臓部。node で単体テストできる純関数として切り出す。

**Files:**
- Create: `work/bridge_v2.js`
- Test: `work/test_bridge_v2.js`

- [ ] **Step 1: マッピング表と変換関数を書く（`work/bridge_v2.js`）**

```js
// v1 state.diag → engine_v2 userProfile 変換（純モジュール）

// 興味: v1 id（長音符付き）→ v2 tag id
const INTEREST_MAP = {
  bungaku:'bungaku', gaikokugo:'gaikokugo', 'hōkei':'hokei', keizai:'keizai',
  shakai:'shakai', 'kyōiku':'kyoiku', 'rikō':'riko', 'jōhō':'joho',
  kenchiku:'kenchiku', 'nōgaku':'nogaku', 'iryō':'iryo', 'eiyō':'eiyo',
  'supōtsu':'sports', geijutsu:'geijutsu',
};

// 職業37 → v2 employment tag（複数可）。曖昧なものは近い系統に寄せる
const CAREER_MAP = {
  // 教育・保育
  kyoin:['kyoiku'], 'shogakkō':['kyoiku'], hoiku:['kyoiku'], 'yōgo':['kyoiku','iryo_fukushi'],
  // 公務員・公安
  keisatsu:['koumuin'], 'shōbō':['koumuin'], jieikan:['koumuin'],
  'kōmuin_ippan':['koumuin'], 'kokka_kōmuin':['koumuin'],
  // 医療・福祉
  ishi:['iryo_fukushi'], shika_ishi:['iryo_fukushi'], 'jūi':['iryo_fukushi'],
  kango:['iryo_fukushi'], hokenshi:['iryo_fukushi'], pt_ot:['iryo_fukushi'],
  gishi:['iryo_fukushi'], 'jūdōseifuku':['iryo_fukushi'], 'eiyō':['iryo_fukushi','shokuhin'],
  yakuzai:['iryo_fukushi'], shafuku:['iryo_fukushi'],
  // スポーツ
  AT:['sports_kenko'], coach:['sports_kenko','kyoiku'], 'kigyō_supotsu':['sports_kenko'],
  // 技術・建築・IT
  kenchiku:['kensetsu'], doboku:['kensetsu'], kikai_denki:['maker'],
  IT:['it'], design:['media'], 'nōshoku':['shokuhin','maker'],
  // ビジネス・士業
  'kigyō_ippan':['maker','ryutsu'], 'kinyū':['kinyu'], masucomi:['media'],
  kaikei:['kinyu'], 'hōsō':['koumuin'], kokusai:['service'],
  'kankō':['service'], shinri:['iryo_fukushi'],
};

// エリア: v1 workArea → v2 region id 配列（空配列=フィルタなし）
const REGION_MAP = {
  shiga: ['shiga'],
  kansai: ['shiga','kyoto','osaka','hyogo','nara-wakayama'],
  any: [],
  unknown: [],
};

// 入試方式: v1 method → v2 examMethod（any/nullは除外）
const METHOD_MAP = { sogo:'sogo', koubo:'koubo', ippan:'ippan', kokkoritsu:'kyotsu' };

function mapSet(srcSet, map) {
  const out = new Set();
  for (const id of srcSet) {
    const v = map[id];
    if (!v) continue;
    (Array.isArray(v) ? v : [v]).forEach(x => out.add(x));
  }
  return [...out];
}

// diag: v1 state.diag（careers/interests/methods は Set）
// 戻り値: engine_v2 diagnose に渡す userProfile
function toUserProfile(diag, riasecAnswers) {
  const regions = REGION_MAP[diag.workArea] || [];
  const commuteOnly = diag.commute === 'jitaku' || diag.commute === 'jitaku-flex';
  const hensachi = diag.hensachiUnknown ? null : Number(diag.hensachi);
  const interests = mapSet(diag.interests, INTEREST_MAP);
  const careers = mapSet(diag.careers, CAREER_MAP);
  const methodSet = new Set([...diag.methods].filter(m => m !== 'any'));
  const examMethods = mapSet(methodSet, METHOD_MAP);
  return {
    regions, commuteOnly, hensachi,
    examSource: diag.examSource || 'unknown',
    riasecAnswers: riasecAnswers || [],
    interests, careers, examMethods,
    budgetMax: null, // 費用優先は将来のsoft減点で対応（現状は結果側で注記）
  };
}

module.exports = { INTEREST_MAP, CAREER_MAP, REGION_MAP, METHOD_MAP, mapSet, toUserProfile };
```

- [ ] **Step 2: テストを書く（`work/test_bridge_v2.js`）**

```js
const assert = require('assert');
const { toUserProfile, mapSet, CAREER_MAP, INTEREST_MAP } = require('./bridge_v2.js');

// 興味の長音符が正規化される
assert.deepStrictEqual(mapSet(new Set(['iryō','rikō']), INTEREST_MAP).sort(), ['iryo','riko']);

// 職業が就職タグに集約される（重複除去）
assert.deepStrictEqual(mapSet(new Set(['ishi','kango']), CAREER_MAP), ['iryo_fukushi']);

// 関西エリア→5地域、any→フィルタなし
const p1 = toUserProfile({ workArea:'kansai', commute:'any', hensachi:52, hensachiUnknown:false,
  examSource:'kawai', interests:new Set(['keizai']), careers:new Set(['kinyū']), methods:new Set(['any']) }, []);
assert.deepStrictEqual(p1.regions, ['shiga','kyoto','osaka','hyogo','nara-wakayama']);
assert.strictEqual(p1.commuteOnly, false);
assert.deepStrictEqual(p1.careers, ['kinyu']);
assert.deepStrictEqual(p1.examMethods, []); // any は除外

// 偏差値未定→null / 通学厳しめ→commuteOnly / 方式変換
const p2 = toUserProfile({ workArea:'shiga', commute:'jitaku', hensachi:50, hensachiUnknown:true,
  examSource:'shinken', interests:new Set(), careers:new Set(), methods:new Set(['sogo','kokkoritsu']) }, [3,3,0,0,0,0,0,0,0,0,0,0]);
assert.strictEqual(p2.hensachi, null);
assert.strictEqual(p2.commuteOnly, true);
assert.deepStrictEqual(p2.examMethods.sort(), ['kyotsu','sogo']);
assert.strictEqual(p2.riasecAnswers.length, 12);

console.log('bridge_v2: all pass');
```

- [ ] **Step 3: テスト実行して通す**

Run: `node work/test_bridge_v2.js`
Expected: `bridge_v2: all pass`

- [ ] **Step 4: エンジンと結線した統合テストを追記**（bridge出力を engine_v2.diagnose に流し、zones が返ることを確認）

`work/test_bridge_v2.js` 末尾に追記:

```js
const engine = require('./engine_v2.js');
const data = require('./data_v2.json');
const riasecMap = require('./interest_riasec_map.json').map;
const prof = toUserProfile({ workArea:'kansai', commute:'any', hensachi:52, hensachiUnknown:false,
  examSource:'kawai', interests:new Set(['keizai']), careers:new Set(['kinyū']), methods:new Set(['any']) },
  [0,0,0,0,0,0,0,0,3,3,2,2]);
const r = engine.diagnose(prof, data, data.tags, riasecMap);
assert.ok(r.zones && Array.isArray(r.zones.match), 'zones.match is array');
const total = r.zones.challenge.length + r.zones.match.length + r.zones.safe.length;
assert.ok(total > 0, 'at least one department in zones');
console.log('bridge_v2 integration: pass ('+total+' depts zoned)');
```

- [ ] **Step 5: 実行して通す**

Run: `node work/test_bridge_v2.js`
Expected: `bridge_v2: all pass` と `bridge_v2 integration: pass (N depts zoned)`（N>0）

- [ ] **Step 6: commit**

```bash
git add work/bridge_v2.js work/test_bridge_v2.js
git commit -m "feat(v2ui): state.diag→engine_v2 userProfile変換ブリッジ＋語彙マッピング表"
```

---

## Task 2: 移植テンプレを複製し、データ源をdata_v2に切替

**Files:**
- Create: `work/app_v2ui.html`（`work/app.html` を複製）
- Modify: `work/app_v2ui.html`（データ読込部・エンジン結線部）

- [ ] **Step 1: v1テンプレを複製**

```bash
cp work/app.html work/app_v2ui.html
```

- [ ] **Step 2: インラインデータのプレースホルダを確認**

`work/app.html` のデータ埋め込み方式を確認（`grep -n "inlineData\|__DATA__\|application/json\|allUnis\|getByid" work/app_v2ui.html`）。ビルドが差し込むJSONの `id` と、`allUnis()`/`getByid()` がどの構造を読むかを把握してから Step 3 へ。

- [ ] **Step 3: data_v2 と engine を読み込むローダを追加**

`work/app_v2ui.html` のスクリプト冒頭（既存データロード箇所）に、data_v2 とengineを読むローダを差し込む。ビルドが以下IDでインラインする前提:
- `<script type="application/json" id="inlineDataV2">…data_v2…</script>`
- `<script id="inlineEngineV2">…engine_v2（window.ENGINE_V2=…でexport）…</script>`
- `<script type="application/json" id="inlineRiasecDef">…</script>`
- `<script type="application/json" id="inlineRiasecMap">…</script>`
- `<script id="inlineBridgeV2">…bridge_v2（window.BRIDGE_V2=…）…</script>`

ローダ:
```js
const DATA_V2 = JSON.parse(document.getElementById('inlineDataV2').textContent);
const RIASEC_DEF = JSON.parse(document.getElementById('inlineRiasecDef').textContent);
const RIASEC_MAP = JSON.parse(document.getElementById('inlineRiasecMap').textContent).map;
const ENGINE = window.ENGINE_V2;
const BRIDGE = window.BRIDGE_V2;
```

- [ ] **Step 4: ビルド前の暫定検証**（テンプレ単体では動かないのでビルド Task 5 後に実機確認。ここでは構文だけ）

Run: `node -e "require('fs').readFileSync('work/app_v2ui.html','utf8')"`（存在確認）

- [ ] **Step 5: commit**

```bash
git add work/app_v2ui.html
git commit -m "feat(v2ui): v1テンプレ複製＋data_v2/engine_v2ローダ結線（土台）"
```

---

## Task 3: 挑戦度画面を削除・評定を情報表示化・RIASEC画面を挿入

**Files:**
- Modify: `work/app_v2ui.html`

- [ ] **Step 1: 挑戦度 radio group を削除**

`work/app_v2ui.html` の diag-hensachi 内、挑戦度ブロック（v1 app.html:1630-1636 相当「挑戦度の方針:」〜challengeList `</div>`）を削除。あわせて `state.diag.challenge` 参照・`name="challenge"` のイベントハンドラ・スコア利用箇所を削除。見出し「あなたの偏差値と挑戦度は？」→「あなたの偏差値は？」に変更。

- [ ] **Step 2: 評定画面を情報表示化**

diag-1（評定）の値は保持しつつ、engine_v2スコアには渡さない（Task1でuserProfileに評定を含めていない＝OK）。評定画面の説明に「※推薦・総合型の出願条件の目安。診断スコアには影響しません」の注記を1行追加。

- [ ] **Step 3: RIASEC画面のマークアップを追加（スキップ可）**

diag-5（入試方式）と result の間に diag-riasec 画面を追加。app_v2.html の RIASEC 実装（`buildRiasecScreen`, `RIASEC_LABELS`, 4段ボタン, 進捗 `0/12`, スキップ）を移植。マークアップ雛形:
```html
<section class="screen" data-screen="diag-riasec" hidden>
  <div class="step-indicator">適性チェック（任意）</div>
  <h2 class="step-title">適性チェック（<span id="riasecProgress">0</span>/12）</h2>
  <p class="step-sub">直感でOK。時間がなければスキップできます。回答すると「向いている学び方」で並びが良くなります。</p>
  <div id="riasecItems"></div>
  <div class="nav-row">
    <button class="secondary-btn" data-go="diag-5">← 戻る</button>
    <button class="primary-btn" id="runDiagBtn2">この回答で診断</button>
    <button class="ghost-btn" id="skipRiasecBtn">スキップして診断</button>
  </div>
</section>
```

- [ ] **Step 4: フロー接続を変更**

diag-5 の「🔍 診断する」ボタン（`runDiagBtn`）の遷移先を `result` 直行から `diag-riasec` へ変更。診断実行は diag-riasec の「この回答で診断」/「スキップ」で行う（Task4の `runDiagnose` を呼ぶ）。

- [ ] **Step 5: RIASEC回答state追加**

`state.riasecAnswers = []`（12要素）。`buildRiasecScreen()` は app_v2.html:1659-1682 を移植し、回答を `state.riasecAnswers[i]=v` に格納、進捗表示更新。スキップ時は `[]` のまま `runDiagnose([])`。

- [ ] **Step 6: 実機確認**（ビルド Task5後にまとめて。ここでは commit のみ）

```bash
git add work/app_v2ui.html
git commit -m "feat(v2ui): 挑戦度削除・評定を注記化・RIASEC任意画面を挿入"
```

---

## Task 4: 診断実行と結果描画をengine_v2の学部単位3ゾーンに差し替え

**Files:**
- Modify: `work/app_v2ui.html`

- [ ] **Step 1: 旧 `diagnose()`/`scoreUni()` を無効化し `runDiagnose()` を新設**

v1の `diagnose()`（app.html:2263）と `scoreUni()`（2294〜）は使わない。新関数:
```js
function runDiagnose(riasecArr) {
  go('loading');
  const profile = BRIDGE.toUserProfile(state.diag, riasecArr);
  state.lastResult = ENGINE.diagnose(profile, DATA_V2, DATA_V2.tags, RIASEC_MAP);
  renderResults(state.lastResult);
  go('result');
}
```

- [ ] **Step 2: `renderResults()` を3ゾーン描画に差し替え**

v1の `renderResults()`（app.html:2521）を置換。engine_v2出力（`zones.{challenge,match,safe}`, `ungrouped`, `meta`）を、ゾーン見出し＋v1品質の学部カードで描画。要旨:
```js
const HOLLAND_JP = { R:'現実', I:'研究', A:'芸術', S:'社会', E:'企業', C:'慣習' };
function renderResults(r) {
  const m = r.meta || {};
  const holland = m.hollandCode
    ? `${m.hollandCode}（${[...m.hollandCode].map(c=>HOLLAND_JP[c]||c).join('・')}）` : '—';
  const sum = document.getElementById('resultSummary');
  sum.innerHTML =
    `<div class="result-band">換算偏差値 <b>${m.adjustedHensachi ?? '—'}</b>｜適性 <b>${holland}</b></div>` +
    (m.lowSignal ? `<div class="nudge">適性チェック・興味選択を足すと精度が上がります</div>` : '') +
    (state.diag.costPriority ? `<div class="nudge">💴 学費重視：国公立・自宅圏を優先的に確認しましょう</div>` : '');
  const body = document.getElementById('resultBody'); body.innerHTML = '';
  const z = r.zones || {challenge:[],match:[],safe:[]};
  const has = z.challenge.length + z.match.length + z.safe.length > 0;
  if (m.adjustedHensachi == null || !has) {
    const list = (r.ungrouped && r.ungrouped.length) ? r.ungrouped : [...z.match,...z.challenge,...z.safe];
    if (!list.length) { body.innerHTML = `<p class="empty">条件に合う学部が見つかりませんでした。エリアや偏差値を見直してください。</p>`; return; }
    body.appendChild(zoneSection('おすすめ（適性順）', list, '')); return;
  }
  [['🎯 実力相応','match','あなたの偏差値に近い'],
   ['🚀 チャレンジ','challenge','背伸びして狙える'],
   ['🛡️ 安全圏','safe','余裕をもって出願']].forEach(([t,k,sub])=>{
    const s = zoneSection(t, z[k], sub); if (s) body.appendChild(s);
  });
  const u = zoneSection('偏差値データなし', r.ungrouped, ''); if (u) body.appendChild(u);
}
function zoneSection(title, arr, sub) {
  if (!arr || !arr.length) return null;
  const sec = document.createElement('div'); sec.className = 'zone-block';
  sec.innerHTML = `<h3 class="zone-title">${title} <span class="zone-count">${arr.length}</span></h3>` +
    (sub ? `<p class="zone-sub">${sub}</p>` : '');
  arr.forEach(it => sec.appendChild(deptCard(it)));
  return sec;
}
```

- [ ] **Step 3: `deptCard()` を v1カード品質で新設（お気に入りボタン付き）**

```js
function deptCard(item) {
  const el = document.createElement('div'); el.className = 'uni-card';
  const h = item.hensachi || {};
  const band = (h.min != null && h.max != null)
    ? (h.min === h.max ? `偏差値 ${h.min}` : `偏差値 ${h.min}〜${h.max}`) : '偏差値データなし';
  const fav = isFav(item.dept_id) ? '❤️' : '🤍';
  el.innerHTML =
    `<div class="uc-head"><div class="uc-name">${item.uni_name}</div>` +
    `<button class="fav-btn" data-fav="${item.dept_id}">${fav}</button></div>` +
    `<div class="uc-dept">${item.dept_name}</div>` +
    `<div class="uc-meta"><span class="uc-band">${band}</span>` +
    `<span class="fit-badge">適性 ${item.fitScore}</span></div>` +
    `<div class="uc-reasons">${(item.reasons||[]).map(x=>`<span class="reason-chip">${x}</span>`).join('')}</div>` +
    `<button class="uc-detail-btn" data-detail="${item.dept_id}">詳しく見る →</button>`;
  return el;
}
```
イベントは result 画面のコンテナに委譲（`data-fav` / `data-detail`）。`isFav`/`toggleFav` は Task6でdept_idキーに調整。

- [ ] **Step 4: ビルド後に実機で診断→3ゾーン表示を確認**（Task5後）。ここでは commit。

```bash
git add work/app_v2ui.html
git commit -m "feat(v2ui): runDiagnose＋3ゾーン学部カード描画（engine_v2結線）"
```

---

## Task 5: ビルドスクリプトで `進路診断_v2.html` を生成

**Files:**
- Create: `work/build_v2ui.js`
- Modify: `進路診断_v2.html`（出力）

- [ ] **Step 1: ビルドスクリプトを書く**

`work/build_v2.js`（既存）のインライン手法を踏襲しつつ、テンプレを `app_v2ui.html`、追加で bridge を注入、engine/bridge は `module.exports` を `window.*` に載せ替えるラッパで包む。

```js
const fs = require('fs');
const path = require('path');
const R = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');

let html = R('app_v2ui.html');
const data = R('data_v2.json');
const riasecDef = R('riasec_def.json');
const riasecMap = R('interest_riasec_map.json');

// CommonJS を ブラウザ globalへ。module.exports を横取りして window に載せる
const wrap = (src, globalName) =>
  `<script>(function(){const module={exports:{}};const exports=module.exports;\n${src}\n;window.${globalName}=module.exports;})();</script>`;

const engine = R('engine_v2.js');
const bridge = R('bridge_v2.js');

const inlineBlocks =
  `<script type="application/json" id="inlineDataV2">${data}</script>\n` +
  `<script type="application/json" id="inlineRiasecDef">${riasecDef}</script>\n` +
  `<script type="application/json" id="inlineRiasecMap">${riasecMap}</script>\n` +
  wrap(engine, 'ENGINE_V2') + '\n' +
  wrap(bridge, 'BRIDGE_V2') + '\n';

// テンプレ内のマーカー <!-- INLINE_V2 --> を差し替え（Task2でテンプレ側に用意）
html = html.replace('<!-- INLINE_V2 -->', inlineBlocks);

fs.writeFileSync(path.join(__dirname, '..', '進路診断_v2.html'), html);
console.log('built 進路診断_v2.html', html.length, 'bytes');
```

- [ ] **Step 2: テンプレにマーカーを用意**（Task2に戻り、`app_v2ui.html` の `</head>` 直前 or bodyスクリプト前に `<!-- INLINE_V2 -->` を1行追加。ローダ Task2-Step3 はこのマーカーで差し込まれたIDを読む）

- [ ] **Step 3: JSON安全性**：data_v2 に `</script>` を含む文字列がないか確認。あればビルドで `</script` を `<\/script` にエスケープ。

Run: `node -e "const s=require('fs').readFileSync('work/data_v2.json','utf8'); console.log(/<\/script/i.test(s)?'NEEDS-ESCAPE':'ok')"`
対処: NEEDS-ESCAPE の場合、build_v2ui.js の data 埋込前に `.replace(/<\/script/gi,'<\\/script')`。

- [ ] **Step 4: ビルド実行**

Run: `node work/build_v2ui.js`
Expected: `built 進路診断_v2.html <N> bytes`（N > 1,600,000 目安）

- [ ] **Step 5: commit**

```bash
git add work/build_v2ui.js work/app_v2ui.html 進路診断_v2.html
git commit -m "feat(v2ui): build_v2ui でdata/engine/bridgeインライン化→進路診断_v2.html生成"
```

---

## Task 6: 詳細画面と お気に入りを data_v2 / dept_id に再接続

**Files:**
- Modify: `work/app_v2ui.html`

- [ ] **Step 1: `renderDetail(deptId)` を data_v2 大学項目で再構成**

v1の詳細タブ（renderEntranceTab/renderLifeTab/renderBasicTab/renderEmploymentTab 等）は v1データ依存なので、data_v2 の大学フィールドに再接続する。app_v2.html:1775-1807 の `showDetail` を出発点に、v1のタブUI・CSSで肉付け:
- 基本：`uni.feature`, `uni.type`, `dept.campus`, `dept.qualifications`, `dept.hensachi`, `dept.bairitsu`
- 入試：`dept.entry_methods`（ENTRY_METHOD_LABELS）, `uni.nyushi_details`, `uni.entry_method_details`
- 生活：`uni.living_cost`, `uni.tuition_yen_per_year`, `uni.access_from_shiga_min`, `uni.commute_note`, `uni.additional_costs`
- 就職：`uni.shingaku_jisseki`, `uni.employment`, `dept.employment_fields`（empMap でラベル化）, `uni.career_center`
- 資格：`uni.shikaku_gokakuritsu`
- リンク：`uni.official_links`（LINK_LABELS）

- [ ] **Step 2: お気に入りを dept_id キーに変更**

`state.favs` を dept_id の Set に。`isFav(deptId)`/`toggleFav(deptId)`/`renderFavs()` を dept_id ベースに修正。`renderFavs` は `DATA_V2.departments.find` で学部を引き、`deptCard` を再利用して一覧表示。localStorage キーは新設（旧v1キーと混ざらないよう `shinro_favs_v2`）。

- [ ] **Step 3: 全大学一覧（list画面）を data_v2 学部一覧に再接続**

`renderList()` を DATA_V2.departments ベースに（偏差値降順、大学名・学部名・偏差値・詳細ボタン）。検索/フィルタがあれば dept.name/uni.name 対象に。

- [ ] **Step 4: ビルド＆実機確認**

Run: `node work/build_v2ui.js`
その後ブラウザで詳細・お気に入り・一覧を確認（Task7の検証で一括）。

- [ ] **Step 5: commit**

```bash
git add work/app_v2ui.html 進路診断_v2.html
git commit -m "feat(v2ui): 詳細タブ/お気に入り/全学部一覧をdata_v2・dept_idに再接続"
```

---

## Task 7: 実機E2E検証（ローカルサーバ＋ブラウザ）

**Files:** なし（検証のみ）

- [ ] **Step 1: ローカルサーバ起動**

Run: `python -m http.server 8899`（プロジェクト直下）

- [ ] **Step 2: ブラウザで `進路診断_v2.html` を開き、以下フローを目視確認**
  - ホーム：注意書き・費用知識・専門学校配慮・版の有効期限が表示される（v1文言が生きている）
  - 評定→偏差値（模試換算・挑戦度が消えている）→就職→エリア（**日本語表示**：滋賀/関西圏等）→興味→通学/費用→入試方式→RIASEC（スキップ可）→診断
  - 結果：🎯実力相応 / 🚀チャレンジ / 🛡️安全圏 の3ゾーンに学部カードが並ぶ。適性バッジ・理由チップ表示
  - 換算偏差値・Hollandコードのサマリが出る
  - 学部カード「詳しく見る」→詳細タブ（基本/入試/生活/就職/資格/リンク）が data_v2 で埋まる
  - お気に入り❤️ → お気に入り一覧に出る（リロードで保持）
  - エリアに生スラッグ（osaka等）が出ない

- [ ] **Step 3: コンソールエラーが無いこと**（read_console_messages / DevToolsで確認）

- [ ] **Step 4: スマホ幅（375px）でレイアウト崩れが無いこと**（resize_window mobile）

- [ ] **Step 5: 発見した不具合を修正 → 再ビルド → 再確認**（ループ）。全項目パスで完了。

- [ ] **Step 6: 最終 commit**

```bash
git add -A
git commit -m "feat(v2ui): v1UI×engine_v2移植 実機E2E検証完了"
```

---

## Self-Review（計画↔spec 突き合わせ）

- 承認判断のカバレッジ：RIASEC残す=Task3 / 評定情報化=Task3 / 挑戦度削除=Task3 / 学部3ゾーン=Task4 ✓
- エリア生スラッグ問題：data_v2.regions は `{id:{label}}`。結果・詳細では `DATA_V2.regions[id].label`、入力エリアはv1の日本語radio（workArea）をそのまま使うので生スラッグは出ない ✓
- 語彙差（職業37→就職12・エリア→地域8・方式）：Task1のマッピング表で吸収、node testで検証 ✓
- 型整合：`toUserProfile`/`runDiagnose`/`renderResults`/`deptCard`/`zoneSection`/`renderDetail`/`isFav/toggleFav` の名称は全タスクで一貫 ✓
- 未使用入力：評定・費用優先はスコア非影響だが結果側で注記（Task4 Step2）。budgetMaxはnull固定＝将来拡張 ✓
- ビルドのCommonJS→browser：wrap() で module.exports を window に載せ替え ✓
```
