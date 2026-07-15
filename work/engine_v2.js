// 進路診断v2 診断エンジン（純粋モジュール、依存なし）
// spec: docs/superpowers/specs/2026-07-15-診断エンジンv2-design.md

const RIASEC_TYPES = ['R', 'I', 'A', 'S', 'E', 'C'];
// riasec_def.json の items 正準順に対応（R,R,I,I,A,A,S,S,E,E,C,C）
const RIASEC_ORDER = ['R', 'R', 'I', 'I', 'A', 'A', 'S', 'S', 'E', 'E', 'C', 'C'];

// 模試種別→河合換算オフセット（v1 EXAM_SOURCE_OFFSET準拠。Task3で突き合わせ）
const EXAM_SOURCE_OFFSET = { kawai: 0, zento: 0, shinken: -7, sundai: 5, toshin: -3, unknown: 0 };

// ゾーン閾値（gap = 学部偏差値mid − 換算偏差値）
const ZONE = { CHALLENGE_MAX: 10, CHALLENGE_MIN: 2.5, MATCH_MIN: -2.5, SAFE_MIN: -10 };
const DEFAULT_TOP_N = 12;

const round1 = (x) => Math.round(x * 10) / 10;
const round2 = (x) => Math.round(x * 100) / 100;

// answers: 12要素(0-3)、正準順。空/undefinedなら未回答
function computeRiasecProfile(answers) {
  const profile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  if (!answers || answers.length === 0) return { profile, hollandCode: '', answered: false };
  const sums = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  RIASEC_ORDER.forEach((t, i) => { sums[t] += Number(answers[i]) || 0; });
  for (const t of RIASEC_TYPES) profile[t] = sums[t] / 6; // 2問×最大3=6
  const hollandCode = [...RIASEC_TYPES].sort((a, b) => profile[b] - profile[a]).slice(0, 3).join('');
  return { profile, hollandCode, answered: true };
}

function adjustedHensachi(hensachi, examSource) {
  if (hensachi == null) return null;
  const off = EXAM_SOURCE_OFFSET[examSource];
  return hensachi + (off == null ? 0 : off);
}

// mid: 学部偏差値の中央値, adjHen: 換算偏差値(null可)
function classifyZone(mid, adjHen) {
  if (adjHen == null || mid == null) return adjHen == null ? 'ungrouped' : 'out';
  const gap = mid - adjHen;
  if (gap > ZONE.CHALLENGE_MAX || gap < ZONE.SAFE_MIN) return 'out';
  if (gap >= ZONE.CHALLENGE_MIN) return 'challenge';
  if (gap >= ZONE.MATCH_MIN) return 'match';
  return 'safe';
}

function hardFilter(departments, universities, userProfile) {
  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
  const regions = new Set(userProfile.regions || []);
  const excluded = { byRegion: 0, unconfirmed: 0 };
  const passed = [];
  for (const d of departments) {
    const uni = uniById[d.uni_id];
    if (!uni) continue;
    if (d.data_status === 'unconfirmed') { excluded.unconfirmed++; continue; }
    if (regions.size && !regions.has(uni.region)) { excluded.byRegion++; continue; }
    if (userProfile.commuteOnly && uni.commute_possible !== true) { excluded.byRegion++; continue; }
    passed.push({ dept: d, uni });
  }
  return { passed, excluded };
}

function deptRiasecVector(dept, riasecMap) {
  const tags = (dept.interest_tags && dept.interest_tags.length) ? dept.interest_tags : ['unclassified'];
  const acc = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  let n = 0;
  for (const tag of tags) {
    const w = riasecMap[tag];
    if (!w) continue;
    for (const t of RIASEC_TYPES) acc[t] += (w[t] || 0);
    n++;
  }
  if (n > 0) for (const t of RIASEC_TYPES) acc[t] /= n;
  return acc;
}

// uv: ユーザー6次元(0-1), dv: 学部6次元 → 学部側重み和で正規化した加重内積(0-1)
function riasecFitScore(uv, dv) {
  const sumDv = RIASEC_TYPES.reduce((s, t) => s + dv[t], 0);
  if (sumDv === 0) return 0;
  const dot = RIASEC_TYPES.reduce((s, t) => s + uv[t] * dv[t], 0);
  return dot / sumDv;
}

// ctx: { riasecProfile, hollandCode, interests:Set, careers:Set, examMethods:Set, budgetMax, riasecMap }
function computeFit(dept, uni, ctx) {
  const reasons = [];
  // ① 適性（最大55）
  const dv = deptRiasecVector(dept, ctx.riasecMap);
  const rf = riasecFitScore(ctx.riasecProfile, dv);
  const apptRiasec = 40 * rf;
  const tags = dept.interest_tags || [];
  const overlap = ctx.interests.size ? tags.filter((t) => ctx.interests.has(t)).length : 0;
  const interestRatio = ctx.interests.size ? Math.min(1, overlap / ctx.interests.size) : 0;
  const apptInterest = 15 * interestRatio;
  const appt = apptRiasec + apptInterest;
  // ② 就職（最大25）
  const empOverlap = (dept.employment_fields || []).filter((f) => ctx.careers.has(f)).length;
  const emp = Math.min(25, empOverlap * 8);
  // ③ ソフト（最大20・減点あり）
  let soft = 0;
  const availTypes = (dept.entry_methods || []).filter((m) => m.available === true).map((m) => m.type);
  const usable = availTypes.some((t) => ctx.examMethods.has(t));
  if (ctx.examMethods.size) {
    if (usable) soft += 6;
    else if (availTypes.length) soft -= 10;
  }
  if (ctx.budgetMax != null && uni.tuition_yen_per_year != null && uni.tuition_yen_per_year > ctx.budgetMax) soft -= 8;
  if ((dept.zemi || []).length > 0) soft += 4;
  const pref = uni.prefecture || '';
  if (pref.includes('滋賀')) soft += 8;
  else if (uni.commute_possible === true) soft += 5;
  // reasons
  if (apptRiasec >= 20) reasons.push(`🧭 適性◎ ${ctx.hollandCode || ''} と好相性`);
  else if (apptRiasec >= 10) reasons.push('🧭 適性○');
  if (apptInterest > 0) reasons.push('📚 興味分野に一致');
  if (emp > 0) reasons.push('💼 希望の就職系統に強い');
  if ((dept.zemi || []).length > 0) reasons.push('🎓 看板ゼミあり');
  if (pref.includes('滋賀')) reasons.push('🏞️ 滋賀県内・地元');
  else if (uni.commute_possible === true) reasons.push('🚃 通学圏');
  if (ctx.examMethods.size && !usable && availTypes.length) reasons.push('⚠️ 使える入試方式と噛み合わない');
  const fitScore = Math.max(0, Math.min(100, appt + emp + soft));
  return { fitScore: round1(fitScore), reasons: reasons.slice(0, 5), breakdown: { appt: round1(appt), emp, soft, riasecFit: round2(rf) } };
}

// diagnose(userProfile, dataV2, tagsDef, riasecMap, opts?)
// tagsDef は将来の検証用に受けるが現状未使用（インターフェース安定のため引数に残す）
function diagnose(userProfile, dataV2, tagsDef, riasecMap, opts = {}) {
  const topN = opts.topN || DEFAULT_TOP_N;
  const { profile, hollandCode, answered } = computeRiasecProfile(userProfile.riasecAnswers);
  const interests = new Set(userProfile.interests || []);
  const careers = new Set(userProfile.careers || []);
  const examMethods = new Set(userProfile.examMethods || []);
  const lowSignal = !answered && interests.size === 0;
  const adjHen = adjustedHensachi(userProfile.hensachi, userProfile.examSource);

  const { passed, excluded } = hardFilter(dataV2.departments, dataV2.universities, userProfile);
  excluded.outOfRange = 0;

  const ctx = { riasecProfile: profile, hollandCode, interests, careers, examMethods, budgetMax: userProfile.budgetMax ?? null, riasecMap };
  const zones = { challenge: [], match: [], safe: [] };
  const ungrouped = [];

  for (const { dept, uni } of passed) {
    const min = dept.hensachi ? dept.hensachi.min : null;
    const max = dept.hensachi ? dept.hensachi.max : null;
    const mid = (min != null && max != null) ? (min + max) / 2 : (min != null ? min : (max != null ? max : null));
    const zone = classifyZone(mid, adjHen);
    if (zone === 'out') { excluded.outOfRange++; continue; }
    const fit = computeFit(dept, uni, ctx);
    const item = {
      dept_id: dept.dept_id, uni_id: uni.id, uni_name: uni.name, dept_name: dept.name,
      campus: dept.campus, hensachi: { min, max, mid },
      bairitsu: dept.bairitsu, zone: zone === 'ungrouped' ? null : zone,
      fitScore: fit.fitScore, reasons: fit.reasons, breakdown: fit.breakdown,
    };
    if (zone === 'ungrouped') ungrouped.push(item);
    else zones[zone].push(item);
  }

  const byFit = (a, b) => (b.fitScore - a.fitScore) || ((b.hensachi.mid || 0) - (a.hensachi.mid || 0));
  for (const k of ['challenge', 'match', 'safe']) zones[k].sort(byFit);
  ungrouped.sort(byFit);

  return {
    zones: { challenge: zones.challenge.slice(0, topN), match: zones.match.slice(0, topN), safe: zones.safe.slice(0, topN) },
    ungrouped: ungrouped.slice(0, topN * 3),
    excluded,
    meta: { adjustedHensachi: adjHen, riasecProfile: profile, hollandCode, lowSignal },
  };
}

module.exports = {
  RIASEC_TYPES, RIASEC_ORDER, EXAM_SOURCE_OFFSET, ZONE, DEFAULT_TOP_N,
  computeRiasecProfile, adjustedHensachi, classifyZone, hardFilter,
  deptRiasecVector, riasecFitScore, computeFit, diagnose,
};
