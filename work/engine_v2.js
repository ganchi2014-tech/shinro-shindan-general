#!/usr/bin/env node
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

module.exports = {
  RIASEC_TYPES, RIASEC_ORDER, EXAM_SOURCE_OFFSET, ZONE, DEFAULT_TOP_N,
  computeRiasecProfile, adjustedHensachi, classifyZone,
};
