const fs = require('fs');
let s = fs.readFileSync('app.html', 'utf8');
const before = s.length;

// 1) advisor画面のHTMLセクション削除
let a = s.indexOf('    <!-- ============================ AI 進路相談 ============================ -->');
let b = s.indexOf('    <!-- ============================ お気に入り・比較 ============================ -->');
if (a < 0 || b < 0 || b <= a) { console.error('HTML markers not found', a, b); process.exit(1); }
s = s.slice(0, a) + s.slice(b);

// 2) JS: 進路相談ブロック（ADVISOR_RULES〜renderAdvisor）削除
a = s.indexOf('// ============================================================\n// 進路相談 AI (ルールベース)');
b = s.indexOf('// ============================================================\n// ホーム');
if (a < 0 || b < 0 || b <= a) { console.error('JS markers not found', a, b); process.exit(1); }
s = s.slice(0, a) + s.slice(b);

fs.writeFileSync('app.html', s);
console.log('deleted', before - s.length, 'chars');
for (const k of ['ADVISOR_RULES', 'runAdvisor', 'setupAdvisor', 'renderAdvisor', 'advisorChat', 'advisor']) {
  const m = s.match(new RegExp(k, 'g'));
  console.log(k + ':', m ? m.length : 0);
}
