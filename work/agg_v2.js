// engine_v2 の学部診断結果を「大学単位」に集約する純モジュール（依存なし）
// spec: docs/superpowers/specs/2026-07-16-学部大学デュアル診断-design.md

// zone内の学部項目配列 → uni_idごとに代表学部(最大fitScore)で集約
function aggregateZone(items) {
  const byUni = new Map();
  for (const it of items || []) {
    const cur = byUni.get(it.uni_id);
    if (!cur) {
      byUni.set(it.uni_id, { rep: it, count: 1 });
    } else {
      cur.count += 1;
      if ((it.fitScore || 0) > (cur.rep.fitScore || 0)) cur.rep = it;
    }
  }
  const out = [];
  for (const { rep, count } of byUni.values()) {
    out.push({
      uni_id: rep.uni_id,
      uni_name: rep.uni_name,
      repDept: { dept_id: rep.dept_id, dept_name: rep.dept_name },
      hensachi: rep.hensachi,
      fitScore: rep.fitScore,
      reasons: rep.reasons,
      zone: rep.zone,
      deptCount: count,
    });
  }
  // 代表fit降順 → 偏差値mid降順
  out.sort((a, b) => (b.fitScore - a.fitScore) ||
    ((b.hensachi && b.hensachi.mid || 0) - (a.hensachi && a.hensachi.mid || 0)));
  return out;
}

// result: engine_v2.diagnose の戻り値 { zones:{challenge,match,safe}, ungrouped, ... }
// 戻り値: { challenge:[uniItem], match:[uniItem], safe:[uniItem], ungrouped:[uniItem] }
// 各大学は全ゾーン横断で一意化し、ゾーン優先度 match(実力相応) > challenge > safe で1ゾーンにのみ配置する。
// deptCount は配置ゾーン内の該当学部数。代表学部は配置ゾーン内の最大fit。
const ZONE_PRIORITY = ['match', 'challenge', 'safe'];

function aggregateByUni(result) {
  const z = (result && result.zones) || { challenge: [], match: [], safe: [] };
  // uni_id → { challenge:[], match:[], safe:[] }
  const byUni = new Map();
  for (const zn of ['challenge', 'match', 'safe']) {
    for (const it of (z[zn] || [])) {
      if (!byUni.has(it.uni_id)) byUni.set(it.uni_id, { challenge: [], match: [], safe: [] });
      byUni.get(it.uni_id)[zn].push(it);
    }
  }
  const buckets = { challenge: [], match: [], safe: [] };
  for (const zg of byUni.values()) {
    const zone = ZONE_PRIORITY.find((zn) => zg[zn].length);
    if (!zone) continue;
    const depts = zg[zone];
    const rep = depts.reduce((best, it) => ((it.fitScore || 0) > (best.fitScore || 0) ? it : best), depts[0]);
    buckets[zone].push({
      uni_id: rep.uni_id,
      uni_name: rep.uni_name,
      repDept: { dept_id: rep.dept_id, dept_name: rep.dept_name },
      hensachi: rep.hensachi,
      fitScore: rep.fitScore,
      reasons: rep.reasons,
      zone,
      deptCount: depts.length,
    });
  }
  const byFit = (a, b) => (b.fitScore - a.fitScore) ||
    ((b.hensachi && b.hensachi.mid || 0) - (a.hensachi && a.hensachi.mid || 0));
  buckets.challenge.sort(byFit); buckets.match.sort(byFit); buckets.safe.sort(byFit);
  return {
    challenge: buckets.challenge,
    match: buckets.match,
    safe: buckets.safe,
    ungrouped: aggregateZone((result && result.ungrouped) || []),
  };
}

module.exports = { aggregateZone, aggregateByUni };
