// app_v2.html ＋ data_v2/engine_v2/riasec定義 → ../進路診断_v2.html
const fs = require('fs');
const path = require('path');
const D = __dirname;

let s = fs.readFileSync(path.join(D, 'app_v2.html'), 'utf8');

function injectJSON(html, id, jsonText) {
  const tag = `<script type="application/json" id="${id}">`;
  const i = html.indexOf(tag);
  if (i < 0) throw new Error(`tag not found: ${id}`);
  const start = i + tag.length;
  const end = html.indexOf('</' + 'script>', start);
  return html.slice(0, start) + '\n' + jsonText + '\n' + html.slice(end);
}
function injectRaw(html, id, srcText) {
  const tag = `<script id="${id}">`;
  const i = html.indexOf(tag);
  if (i < 0) throw new Error(`tag not found: ${id}`);
  const start = i + tag.length;
  const end = html.indexOf('</' + 'script>', start);
  return html.slice(0, start) + '\n' + srcText + '\n' + html.slice(end);
}

const dataText = fs.readFileSync(path.join(D, 'data_v2.json'), 'utf8');
const riasecDefText = fs.readFileSync(path.join(D, 'riasec_def.json'), 'utf8');
const riasecMapText = fs.readFileSync(path.join(D, 'interest_riasec_map.json'), 'utf8');
const engineText = fs.readFileSync(path.join(D, 'engine_v2.js'), 'utf8');

// 妥当性
JSON.parse(dataText); JSON.parse(riasecDefText); JSON.parse(riasecMapText);

s = injectJSON(s, 'inlineData', dataText);
s = injectJSON(s, 'inlineRiasecDef', riasecDefText);
s = injectJSON(s, 'inlineRiasecMap', riasecMapText);
s = injectRaw(s, 'engineSrc', engineText);

// engine必須関数の存在チェック（評価して確認）
(function checkEngine() {
  const module = { exports: {} };
  new Function('module', 'exports', engineText)(module, module.exports);
  for (const fn of ['diagnose', 'computeRiasecProfile', 'hardFilter', 'classifyZone', 'computeFit']) {
    if (typeof module.exports[fn] !== 'function') throw new Error(`engine missing: ${fn}`);
  }
})();

// メインJS（最後の<script>）の構文チェック
const jsStart = s.lastIndexOf('<script>');
const jsEnd = s.indexOf('</' + 'script>', jsStart);
try { new Function(s.slice(jsStart + 8, jsEnd)); }
catch (e) { console.error('メインJS構文エラー:', e.message); process.exit(1); }

const out = path.join(D, '..', '進路診断_v2.html');
fs.writeFileSync(out, s);
console.log('出力:', out, Math.round(fs.statSync(out).size / 1024), 'KB');
