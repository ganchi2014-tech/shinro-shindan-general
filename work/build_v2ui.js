// v1UI × engine_v2 移植版ビルド
// app_v2ui.html の <!-- INLINE_V2 --> に data_v2 / engine_v2 / bridge_v2 / riasec を注入し
// 進路診断_v2.html を生成する。
const fs = require('fs');
const path = require('path');
const R = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');

// JSON文字列中の </script を無害化（HTML埋め込み安全化）
const safeJson = (s) => s.replace(/<\/script/gi, '<\\/script');

let html = R('app_v2ui.html');
const data = safeJson(R('data_v2.json'));
const riasecDef = safeJson(R('riasec_def.json'));
const riasecMap = safeJson(R('interest_riasec_map.json'));
const engine = R('engine_v2.js');
const bridge = R('bridge_v2.js');

// CommonJS を ブラウザ global へ。module.exports を横取りして window に載せる
const wrap = (src, globalName) =>
  `<script>(function(){var module={exports:{}};var exports=module.exports;\n${src}\n;window.${globalName}=module.exports;})();</script>`;

const inlineBlocks =
  `<script type="application/json" id="inlineDataV2">${data}</script>\n` +
  `<script type="application/json" id="inlineRiasecDef">${riasecDef}</script>\n` +
  `<script type="application/json" id="inlineRiasecMap">${riasecMap}</script>\n` +
  wrap(engine, 'ENGINE_V2') + '\n' +
  wrap(bridge, 'BRIDGE_V2') + '\n';

if (!html.includes('<!-- INLINE_V2 -->')) {
  console.error('ERROR: マーカー <!-- INLINE_V2 --> が見つかりません');
  process.exit(1);
}
html = html.replace('<!-- INLINE_V2 -->', inlineBlocks);

const out = path.join(__dirname, '..', '進路診断_v2.html');
fs.writeFileSync(out, html);
console.log('built 進路診断_v2.html', html.length, 'bytes');
