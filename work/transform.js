// ハンドボーラー進路診断 → 一般生徒版 データ変換
// 入力: work/data_original.json → 出力: work/data_general.json
const fs = require('fs');
const path = require('path');
const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'data_original.json'), 'utf8'));

// ---------- 1. 削除する大学（ハンドボール推薦専用の遠隔校） ----------
const REMOVE_NAMES = [
  '名桜大学', '札幌国際大学', '北海道教育大学岩見沢校', '仙台大学',
  '環太平洋大学', '高松大学', '松山大学', '広島経済大学',
];
const removeIds = new Set(
  j.base.universities.filter(u => REMOVE_NAMES.includes(u.name)).map(u => u.id)
);
console.log('削除:', [...removeIds].join(', '));

// ---------- 2. 地域をリーグ→地理ベースに再編 ----------
const NEW_REGIONS = {
  shiga:    { label: '滋賀',        color: '#16a085' },
  kyoto:    { label: '京都',        color: '#8e44ad' },
  osaka:    { label: '大阪',        color: '#e74c3c' },
  hyogo:    { label: '兵庫',        color: '#2980b9' },
  'nara-wakayama': { label: '奈良・和歌山', color: '#27ae60' },
  tokai:    { label: '東海',        color: '#f39c12' },
  kanto:    { label: '関東',        color: '#3498db' },
  other:    { label: 'その他',      color: '#7f8c8d' },
};
function regionOf(pref) {
  if (!pref) return 'other';
  if (/東京|神奈川|千葉|埼玉|茨城/.test(pref)) return 'kanto'; // 「東京都」が「京都」に誤マッチしないよう先に判定
  if (pref.includes('滋賀')) return 'shiga';
  if (pref.includes('京都')) return 'kyoto';
  if (pref.includes('大阪')) return 'osaka';
  if (pref.includes('兵庫')) return 'hyogo';
  if (pref.includes('奈良') || pref.includes('和歌山')) return 'nara-wakayama';
  if (/愛知|岐阜|三重|静岡/.test(pref)) return 'tokai';
  if (/東京|神奈川|千葉|埼玉|茨城/.test(pref)) return 'kanto';
  return 'other';
}

// ---------- 3. ハンドボール文言のスクラブ ----------
const HB_RX = /ハンドボール|ハンド部|JHL|日本リーグ|[1１2２]部リーグ|リーグ[戦昇残]|インカレ|強化(指定)?クラブ|スポーツ推薦|競技実績|部員|体育会|アスリート/;
function scrubSentences(text) {
  if (!text) return text;
  const parts = text.split('。').filter(s => s.trim() && !HB_RX.test(s));
  return parts.length ? parts.join('。') + '。' : null;
}
const SPORTS_METHOD_RX = /スポーツ|競技|アスリート|強化|トップ|特別活動/;

// ---------- 変換本体 ----------
const prefById = {};
for (const u of j.base.universities) prefById[u.id] = u.prefecture;

// base
j.base.universities = j.base.universities.filter(u => !removeIds.has(u.id));
for (const u of j.base.universities) {
  delete u.shitei_school_default;
  u.region = regionOf(u.prefecture);
  const f = scrubSentences(u.feature);
  const ccf = Array.isArray(u.career_center?.features) ? u.career_center.features
    : (typeof u.career_center?.features === 'string' ? [u.career_center.features] : []);
  u.feature = f || (ccf.length
    ? `進路支援: ${ccf.slice(0, 2).join('、')}。詳細は公式サイトで確認してください。`
    : '特色・最新情報は公式サイトで確認してください。');
  if (u.shingaku_jisseki?.top_employers) {
    u.shingaku_jisseki.top_employers = u.shingaku_jisseki.top_employers.filter(e => !/JHL|ハンドボール/.test(e));
  }
}
j.base.regions = NEW_REGIONS;
j.base.notes = '一般生徒版の大学基本情報。IDの正典リスト。';

// sogo / koubo
for (const cat of ['sogo', 'koubo']) {
  j[cat].universities = j[cat].universities.filter(u => !removeIds.has(u.id));
  for (const u of j[cat].universities) {
    u.region = regionOf(prefById[u.id]);
    delete u.shitei_recommendation;
    u.entry_methods = (u.entry_methods || [])
      .filter(m => !SPORTS_METHOD_RX.test(m.method_name || ''))
      .map(m => ({ ...m, notes: scrubSentences(m.notes), required_achievement: null }));
  }
}

// ippan
j.ippan.universities = j.ippan.universities.filter(u => !removeIds.has(u.id));
for (const u of j.ippan.universities) {
  u.region = regionOf(prefById[u.id]);
  for (const d of (u.departments || [])) delete d.handball_relation;
  u.entry_methods = (u.entry_methods || []).map(m => ({ ...m, notes: scrubSentences(m.notes) }));
}

// employment
j.employment.universities = j.employment.universities.filter(u => !removeIds.has(u.id));
for (const u of j.employment.universities) {
  u.region = regionOf(prefById[u.id]);
  if (u.ratings) delete u.ratings.JHL;
  if (u.strengths) u.strengths = u.strengths.filter(s => !HB_RX.test(s));
  if (u.representative_employers) u.representative_employers = u.representative_employers.filter(e => !/JHL|ハンドボール/.test(e));
  if (u.summary) u.summary = scrubSentences(u.summary);
  if (u.notes) u.notes = scrubSentences(u.notes);
}

// handball カテゴリ削除
delete j.handball;

// ---------- 深部スクラブ: 全文字列からハンドボール文を除去 ----------
const SKIP_KEYS = new Set(['id', 'name', 'name_short', 'region', 'official_url', 'nyushi_url',
  'shingaku_url', 'youkou_url', 'shogakukin_official_url', 'method_name', 'campus', 'campus_main']);
function deepScrub(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string' && HB_RX.test(obj[i])) {
        obj[i] = scrubSentences(obj[i]);
      } else deepScrub(obj[i]);
    }
    // 配列から null になった要素を除去
    for (let i = obj.length - 1; i >= 0; i--) if (obj[i] === null) obj.splice(i, 1);
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === 'string' && !SKIP_KEYS.has(k) && HB_RX.test(v)) {
        obj[k] = scrubSentences(v);
      } else deepScrub(v);
    }
  }
}
deepScrub(j);

// 検証
const rx2 = /ハンドボール|JHL|ハンド部/;
const leaks = [];
(function scan(o, p) {
  if (typeof o === 'string') { if (rx2.test(o)) leaks.push(p + ': ' + o.slice(0, 60)); return; }
  if (o && typeof o === 'object') for (const k of Object.keys(o)) scan(o[k], p + '.' + k);
})(j, '');
console.log('残存ハンドボール文言:', leaks.length);
leaks.slice(0, 10).forEach(l => console.log('  ', l));

fs.writeFileSync(path.join(__dirname, 'data_general.json'), JSON.stringify(j, null, 1));
console.log('大学数:', j.base.universities.length, '/ カテゴリ:', Object.keys(j).join(','));
