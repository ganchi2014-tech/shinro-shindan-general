#!/usr/bin/env node
// 調査結果JSONを data_v2.json にマージし、差分を docs/data-verification/ に記録
// 使い方: node merge_research.js research/ritsumeikan.json [research/xxx.json ...]
const fs = require('fs');
const path = require('path');

const WORK = __dirname;
const VERIF_DIR = path.join(WORK, '..', 'docs', 'data-verification');

function setAndDiff(diffs, deptId, obj, field, newVal, pathLabel) {
  const oldVal = obj[field];
  if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return;
  diffs.push({ dept_id: deptId, field: pathLabel, old: oldVal ?? null, new: newVal });
  obj[field] = newVal;
}

// data を破壊的に更新し、差分配列を返す
function mergeUni(data, research) {
  const date = research.researched_date;
  if (!date) throw new Error(`${research.uni_id}: researched_date がない`);
  const diffs = [];
  const byId = Object.fromEntries(data.departments.map(d => [d.dept_id, d]));

  for (const r of research.departments || []) {
    const d = byId[r.dept_id];
    if (!d) throw new Error(`不明な dept_id: ${r.dept_id}（dept_manifest.json を確認）`);
    if (d.uni_id !== research.uni_id) throw new Error(`${r.dept_id} は ${research.uni_id} の学部ではない（uni_id=${d.uni_id}）`);

    if (r.hensachi) {
      setAndDiff(diffs, d.dept_id, d.hensachi, 'min', r.hensachi.min ?? d.hensachi.min, 'hensachi.min');
      setAndDiff(diffs, d.dept_id, d.hensachi, 'max', r.hensachi.max ?? d.hensachi.max, 'hensachi.max');
      if (r.hensachi.source_url) {
        setAndDiff(diffs, d.dept_id, d.hensachi, 'source_url', r.hensachi.source_url, 'hensachi.source_url');
        setAndDiff(diffs, d.dept_id, d.hensachi, 'verified_date', date, 'hensachi.verified_date');
      }
    }
    if (r.bairitsu) {
      setAndDiff(diffs, d.dept_id, d.bairitsu, 'ippan', { ...d.bairitsu.ippan, ...r.bairitsu.ippan }, 'bairitsu.ippan');
      if (r.bairitsu.source_url) {
        setAndDiff(diffs, d.dept_id, d.bairitsu, 'source_url', r.bairitsu.source_url, 'bairitsu.source_url');
        setAndDiff(diffs, d.dept_id, d.bairitsu, 'verified_date', date, 'bairitsu.verified_date');
      }
    }
    for (const m of r.entry_methods || []) {
      const target = d.entry_methods.find(x => x.type === m.type);
      if (!target) throw new Error(`${r.dept_id}: 不明な entry_method type ${m.type}`);
      if ('available' in m && m.available !== undefined) {
        setAndDiff(diffs, d.dept_id, target, 'available', m.available, `entry_methods.${m.type}.available`);
        target.verified = true;
      }
      if (m.note !== undefined) target.note = m.note;
    }
    if (r.qualifications) setAndDiff(diffs, d.dept_id, d, 'qualifications', r.qualifications, 'qualifications');
    if (r.employment_fields) setAndDiff(diffs, d.dept_id, d, 'employment_fields', r.employment_fields, 'employment_fields');
    if (r.zemi) {
      if (r.zemi.length > 3) throw new Error(`${r.dept_id}: zemi は最大3件（${r.zemi.length}件指定）`);
      const zemi = r.zemi.map(z => ({ name: z.name, theme: z.theme ?? null, source_url: z.source_url, verified_date: date }));
      setAndDiff(diffs, d.dept_id, d, 'zemi', zemi, 'zemi');
    }
    if (r.unconfirmed) d.data_status = 'unconfirmed';
    else if (d.hensachi.source_url) d.data_status = 'verified';
  }
  return diffs;
}

function writeReport(research, diffs, uniName) {
  fs.mkdirSync(VERIF_DIR, { recursive: true });
  // 機械可読ログ（追記）
  const logPath = path.join(VERIF_DIR, 'diff_log.jsonl');
  const lines = diffs.map(x => JSON.stringify({ ...x, uni_id: research.uni_id, date: research.researched_date }));
  fs.appendFileSync(logPath, lines.join('\n') + (lines.length ? '\n' : ''), 'utf8');
  // 人間可読レポート（上書き）
  const md = [
    `# ${uniName}（${research.uni_id}）照合レポート`,
    ``,
    `調査日: ${research.researched_date} / 変更点: ${diffs.length}件`,
    ``,
    `## 出典`,
    ...(research.sources || []).map(s => `- ${s}`),
    ``,
    `## 変更差分`,
    diffs.length ? '| 学部 | 項目 | 旧 | 新 |' : '（差分なし＝現行値が正確だった）',
    ...(diffs.length ? ['|---|---|---|---|'] : []),
    ...diffs.map(x => `| ${x.dept_id} | ${x.field} | ${JSON.stringify(x.old)} | ${JSON.stringify(x.new)} |`),
    ``,
    ...(research.notes ? [`## 特記事項`, research.notes] : []),
  ].join('\n');
  fs.writeFileSync(path.join(VERIF_DIR, `${research.uni_id}.md`), md, 'utf8');
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('使い方: node merge_research.js research/<uni_id>.json ...'); process.exit(1); }
  const dataPath = path.join(WORK, 'data_v2.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const reports = [];
  for (const f of files) {
    try {
      const research = JSON.parse(fs.readFileSync(path.resolve(WORK, f), 'utf8'));
      const uni = data.universities.find(u => u.id === research.uni_id);
      if (!uni) throw new Error(`不明な uni_id: ${research.uni_id}`);
      const diffs = mergeUni(data, research);
      reports.push({ research, diffs, uniName: uni.name });
    } catch (e) {
      console.error(`失敗: ${f} — ${e.message}`);
      console.error('何も保存していない。修正して全ファイルを再実行せよ。');
      process.exit(1);
    }
  }
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 1), 'utf8');
  for (const rep of reports) {
    writeReport(rep.research, rep.diffs, rep.uniName);
    console.log(`${rep.research.uni_id}: ${rep.diffs.length}件の差分を反映`);
  }
  console.log('data_v2.json 更新完了');
}

module.exports = { mergeUni };
if (require.main === module) main();
