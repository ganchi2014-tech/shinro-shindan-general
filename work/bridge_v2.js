// v1 state.diag → engine_v2 userProfile 変換（純モジュール、依存なし）
// spec: docs/superpowers/plans/2026-07-15-v1UI-engineV2-port.md Task1

// 興味: v1 id（長音符付き）→ v2 tag id
const INTEREST_MAP = {
  bungaku: 'bungaku', gaikokugo: 'gaikokugo', 'hōkei': 'hokei', keizai: 'keizai',
  shakai: 'shakai', 'kyōiku': 'kyoiku', 'rikō': 'riko', 'jōhō': 'joho',
  kenchiku: 'kenchiku', 'nōgaku': 'nogaku', 'iryō': 'iryo', 'eiyō': 'eiyo',
  'supōtsu': 'sports', geijutsu: 'geijutsu',
};

// 職業37 → v2 employment tag（複数可）。曖昧なものは近い系統に寄せる
const CAREER_MAP = {
  // 教育・保育
  kyoin: ['kyoiku'], 'shogakkō': ['kyoiku'], hoiku: ['kyoiku'], 'yōgo': ['kyoiku', 'iryo_fukushi'],
  // 公務員・公安
  keisatsu: ['koumuin'], 'shōbō': ['koumuin'], jieikan: ['koumuin'],
  'kōmuin_ippan': ['koumuin'], 'kokka_kōmuin': ['koumuin'],
  // 医療・福祉
  ishi: ['iryo_fukushi'], shika_ishi: ['iryo_fukushi'], 'jūi': ['iryo_fukushi'],
  kango: ['iryo_fukushi'], hokenshi: ['iryo_fukushi'], pt_ot: ['iryo_fukushi'],
  gishi: ['iryo_fukushi'], 'jūdōseifuku': ['iryo_fukushi'], 'eiyō': ['iryo_fukushi', 'shokuhin'],
  yakuzai: ['iryo_fukushi'], shafuku: ['iryo_fukushi'],
  // スポーツ
  AT: ['sports_kenko'], coach: ['sports_kenko', 'kyoiku'], 'kigyō_supotsu': ['sports_kenko'],
  // 技術・建築・IT
  kenchiku: ['kensetsu'], doboku: ['kensetsu'], kikai_denki: ['maker'],
  IT: ['it'], design: ['media'], 'nōshoku': ['shokuhin', 'maker'],
  // ビジネス・士業
  'kigyō_ippan': ['maker', 'ryutsu'], 'kinyū': ['kinyu'], masucomi: ['media'],
  kaikei: ['kinyu'], 'hōsō': ['koumuin'], kokusai: ['service'],
  'kankō': ['service'], shinri: ['iryo_fukushi'],
};

// エリア: v1 workArea → v2 region id 配列（空配列=フィルタなし）
const REGION_MAP = {
  shiga: ['shiga'],
  kansai: ['shiga', 'kyoto', 'osaka', 'hyogo', 'nara-wakayama'],
  any: [],
  unknown: [],
};

// 入試方式: v1 method → v2 examMethod（any/nullは除外）
const METHOD_MAP = { sogo: 'sogo', koubo: 'koubo', ippan: 'ippan', kokkoritsu: 'kyotsu' };

function mapSet(srcSet, map) {
  const out = new Set();
  for (const id of srcSet) {
    const v = map[id];
    if (!v) continue;
    (Array.isArray(v) ? v : [v]).forEach((x) => out.add(x));
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
  const methodSet = new Set([...diag.methods].filter((m) => m !== 'any'));
  const examMethods = mapSet(methodSet, METHOD_MAP);
  return {
    regions, commuteOnly, hensachi,
    examSource: diag.examSource || 'unknown',
    riasecAnswers: riasecAnswers || [],
    interests, careers, examMethods,
    budgetMax: null, // 費用優先は結果側で注記（現状スコア非影響）
  };
}

module.exports = { INTEREST_MAP, CAREER_MAP, REGION_MAP, METHOD_MAP, mapSet, toUserProfile };
