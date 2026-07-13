// app.html + data_final.json → ../進路診断_一般版.html
const fs = require('fs');
const path = require('path');
let s = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');
const data = fs.readFileSync(path.join(__dirname, 'data_final.json'), 'utf8');

const tag = '<script type="application/json" id="inlineBundleData">';
const i = s.indexOf(tag);
const start = i + tag.length;
const end = s.indexOf('</' + 'script>', start);
if (i < 0 || end < 0) { console.error('data tag not found'); process.exit(1); }
s = s.slice(0, start) + '\n' + data + '\n' + s.slice(end);

// JS部分の構文チェック
const jsStart = s.lastIndexOf('<script>');
const jsEnd = s.indexOf('</' + 'script>', jsStart);
const js = s.slice(jsStart + 8, jsEnd);
try {
  new Function(js);
  console.log('JS構文: OK');
} catch (e) {
  console.error('JS構文エラー:', e.message);
  process.exit(1);
}
// 埋め込みJSONの妥当性
JSON.parse(data);
console.log('JSON: OK');

const out = path.join(__dirname, '..', '進路診断_一般版.html');
fs.writeFileSync(out, s);
console.log('出力:', out, Math.round(fs.statSync(out).size / 1024), 'KB');
