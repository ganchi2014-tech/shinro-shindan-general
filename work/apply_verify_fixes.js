// 検証結果(docs/superpowers/_verify_result.json fixList 54件)を data_v2.json に適用する
// 実行: node work/apply_verify_fixes.js
// 安全設計: dept名マッチが 0件 or 想定外の複数件 なら例外で停止（誤爆防止）
const fs = require('fs');
const path = require('path');
const P = path.join(__dirname, 'data_v2.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));

const log = [];
const uniById = (id) => d.universities.find((u) => u.id === id);
const deptsOf = (uid) => d.departments.filter((x) => x.uni_id === uid);

function findDept(uid, re) {
  const hits = deptsOf(uid).filter((x) => re.test(x.name) || re.test(x.dept_id));
  if (hits.length !== 1) throw new Error(`findDept ${uid} ${re} → ${hits.length}件: ${hits.map((h) => h.dept_id).join(',')}`);
  return hits[0];
}

function setHensachi(uid, re, min, max, note) {
  const x = findDept(uid, re);
  const old = `${x.hensachi.min}-${x.hensachi.max}`;
  x.hensachi.min = min; x.hensachi.max = max;
  log.push(`hensachi ${x.dept_id}: ${old} → ${min}-${max}${note ? ' (' + note + ')' : ''}`);
}

function renameDept(uid, re, newName, min, max) {
  const x = findDept(uid, re);
  log.push(`rename ${x.dept_id}: 「${x.name}」→「${newName}」${min != null ? ` 偏差${x.hensachi.min}-${x.hensachi.max}→${min}-${max}` : ''}`);
  x.name = newName;
  if (min != null) { x.hensachi.min = min; x.hensachi.max = max; }
}

function deleteDept(uid, re, reason) {
  const x = findDept(uid, re);
  d.departments = d.departments.filter((y) => y.dept_id !== x.dept_id);
  log.push(`delete ${x.dept_id} (${reason})`);
}

function cloneDept(uid, srcRe, newId, newName, min, max, interestTags, empFields) {
  const src = findDept(uid, srcRe);
  if (d.departments.some((x) => x.dept_id === newId)) throw new Error('id衝突: ' + newId);
  const c = JSON.parse(JSON.stringify(src));
  c.dept_id = newId; c.name = newName;
  c.hensachi.min = min; c.hensachi.max = max;
  if (interestTags) c.interest_tags = interestTags;
  if (empFields) c.employment_fields = empFields;
  c.data_status = 'estimated';
  d.departments.push(c);
  log.push(`add ${newId} 「${newName}」 ${min}-${max} (clone of ${src.dept_id})`);
}

function setBasis(uid, re, basis) {
  const x = findDept(uid, re);
  x.hensachi.basis = basis;
  log.push(`basis ${x.dept_id}: → ${basis}`);
}

function setCampus(uid, re, campus) {
  const x = findDept(uid, re);
  log.push(`campus ${x.dept_id}: 「${x.campus}」→「${campus}」`);
  x.campus = campus;
}

function setTuition(uid, yen, note) {
  const u = uniById(uid); if (!u) throw new Error('uni無し: ' + uid);
  if (yen != null) { log.push(`tuition ${uid}: ${u.tuition_yen_per_year} → ${yen}`); u.tuition_yen_per_year = yen; }
  if (note) {
    u.tuition_note = u.tuition_note ? (u.tuition_note.includes(note) ? u.tuition_note : u.tuition_note + ' / ' + note) : note;
    log.push(`tuition_note ${uid}: +「${note.slice(0, 40)}…」`);
  }
}

// ============ 1. 改組・募集停止（MAJOR: 出願不可能な学部の是正） ============
// 神戸芸術工科大: 2024年改組。6学科→4学科
renameDept('kobe-geijutsu-koka', /環境デザイン/, '芸術工学部 建築・環境デザイン学科', 42.5, 42.5);
renameDept('kobe-geijutsu-koka', /プロダクト/, '芸術工学部 生産・工芸デザイン学科', 40, 40);
setHensachi('kobe-geijutsu-koka', /ビジュアルデザイン/, 42.5, 42.5, '実勢へ');
renameDept('kobe-geijutsu-koka', /まんが表現/, '芸術工学部 メディア芸術学科', 45, 45);
deleteDept('kobe-geijutsu-koka', /映像表現/, '2024年改組でメディア芸術学科に統合');
deleteDept('kobe-geijutsu-koka', /アート・クラフト/, '2024年改組で募集停止');

// 甲南女子大: 人間科学部→心理学部+教育学部+社会学部（2025-2026改組）
renameDept('konan-joshi', /人間科学部/, '心理学部 心理学科', 42.5, 42.5);
cloneDept('konan-joshi', /心理学部/, 'konan-joshi-kyoikugakubu', '教育学部（2026年開設）', 42.5, 42.5, ['kyoiku'], ['kyoiku']);
cloneDept('konan-joshi', /心理学部/, 'konan-joshi-shakaigakubu', '社会学部（2026年開設）', 40, 42.5, ['shakai'], ['service', 'ryutsu']);

// 名古屋市立大: 看護学部→医学部 保健医療学科（2025改組）
renameDept('nagoya-shiritsu', /看護学部/, '医学部 保健医療学科 看護学専攻', 47.5, 50);

// 姫路獨協大: 薬学部 2025年度から募集停止（全国初）
deleteDept('himeji-dokkyo', /薬学部/, '2025年度から募集停止');

// 園田学園: 2025改組・改称
renameDept('sonoda-gakuen', /児童教育学科/, 'こども学部 こども学科', 35, 35);
renameDept('sonoda-gakuen', /食物栄養学科/, '人間健康学部 食マネジメント学科', 35, 35);

// 神戸松蔭: 教育学部 2027年度から募集停止 = 現高3出願不可
deleteDept('kobe-shoin', /教育学部/, '2027年度から募集停止（現高3出願不可）');

// 京都精華大: 国際文化学部→人文学部（2026改組）
renameDept('kyoto-seika', /国際文化学部/, '人文学部（2026年開設）', 35, 37.5);

// 京都光華女子大→京都光華大学（2026共学化・学部再編）
{
  const u = uniById('kyoto-koka');
  log.push(`uni名 kyoto-koka: 「${u.name}」→「京都光華大学」`);
  u.name = '京都光華大学'; u.name_short = '京都光華';
  renameDept('kyoto-koka', /看護学科/, '看護福祉リハビリテーション学部 看護学科', null, null);
  renameDept('kyoto-koka', /医療福祉学科/, '看護福祉リハビリテーション学部 福祉リハビリテーション学科', null, null);
  renameDept('kyoto-koka', /キャリア形成/, '社会学部 社会共創学科（2026年開設）', null, null);
}

// 大阪樟蔭: 国際英語学科改称＋偏差値
renameDept('osaka-shoin', /国際英語学科/, '学芸学部 言語文化コミュニケーション学科', 35, 35);
setHensachi('osaka-shoin', /化粧ファッション/, 35, 35);
setHensachi('osaka-shoin', /健康栄養学部/, 35, 35);

// 姫路獨協: 医療保健学部の学科表記＋看護偏差値
renameDept('himeji-dokkyo', /医療保健学部/, '医療保健学部（理学療法・作業療法・言語聴覚療法・臨床工学）', null, null);
setHensachi('himeji-dokkyo', /看護学部/, 35, 35, '河合BF〜35');

// 大阪教育大: 2025改組の専攻名（データ内の名称文字列を置換）
deptsOf('osaka-kyoiku').forEach((x) => {
  const before = x.name;
  x.name = x.name
    .replace('教育心理科学', '心理科学').replace('健康安全科学', '環境安全科学')
    .replace('理数情報', '数理・知能情報').replace('芸術表現', '芸術表現')  // 芸術表現は現名称のまま
    .replace('スポーツ科学', 'スポーツ健康');
  if (x.name !== before) log.push(`rename ${x.dept_id}: 「${before}」→「${x.name}」`);
});

// ============ 2. 偏差値の実勢合わせ ============
// 兵庫医科大
setHensachi('hyogo-ika', /薬/, 37.5, 40);
{ const x = findDept('hyogo-ika', /リハビリ/); if (x.hensachi.min < 40) { setHensachi('hyogo-ika', /リハビリ/, 40, x.hensachi.max); } else { log.push('hyogo-ika-riha: min>=40 済み'); } }
setTuition('hyogo-ika', null, '※医学部は年間授業料約650万円（6年総額約3,760万円）。表示額は薬・看護系の目安');

// 帝京大
setHensachi('teikyo', /薬学部/, 35, 37.5);
setHensachi('teikyo', /法学部/, 37.5, 42.5);
setHensachi('teikyo', /外国語/, 37.5, 42.5);
setHensachi('teikyo', /教育学部/, 37.5, 45);
setHensachi('teikyo', /経済学部/, 37.5, 42.5);
try { setHensachi('teikyo', /^(?!.*福岡).*医療技術/, 35, 47.5); } catch (e) { log.push('skip 帝京医療技術: ' + e.message); }
try { setHensachi('teikyo', /理工/, 35, 40); } catch (e) { log.push('skip 帝京理工: ' + e.message); }
try { setHensachi('teikyo', /福岡医療技術/, 35, 40); } catch (e) { log.push('skip 帝京福岡: ' + e.message); }
try { setHensachi('teikyo', /文学部/, 42.5, 50); } catch (e) { log.push('skip 帝京文: ' + e.message); }

// 津田塾大
setHensachi('tsuda-juku', /英文|英語/, 45, 47.5);
setHensachi('tsuda-juku', /国際関係/, 45, 45);
setHensachi('tsuda-juku', /多文化/, 47.5, 47.5);
setHensachi('tsuda-juku', /数学/, 40, 40);
setHensachi('tsuda-juku', /情報科学/, 45, 45);
try { setHensachi('tsuda-juku', /総合政策/, 52.5, 52.5); } catch (e) { log.push('skip 津田塾総合政策: ' + e.message); }

// 京都精華大
setHensachi('kyoto-seika', /マンガ/, 45, 50);
setHensachi('kyoto-seika', /デザイン/, 42.5, 45);
setHensachi('kyoto-seika', /芸術学部/, 42.5, 45);

// 京都芸術大
setHensachi('kyoto-geijutsu', /環境デザイン/, 45, 47.5);
setHensachi('kyoto-geijutsu', /空間演出/, 45, 50);
setHensachi('kyoto-geijutsu', /プロダクト/, 45, 47.5);
setHensachi('kyoto-geijutsu', /情報デザイン/, 45, 50);
setHensachi('kyoto-geijutsu', /こども芸術/, 40, 42.5);

// 大阪芸術大（学内序列の逆転を是正）
setHensachi('osaka-geidai', /放送/, 35, 37.5);
setHensachi('osaka-geidai', /芸術計画/, 40, 42.5);
try { setHensachi('osaka-geidai', /映像/, 37.5, 40); } catch (e) { log.push('skip 大阪芸大映像: ' + e.message); }
try { setHensachi('osaka-geidai', /写真/, 37.5, 40); } catch (e) { log.push('skip 大阪芸大写真: ' + e.message); }
try { setHensachi('osaka-geidai', /アートサイエンス/, 37.5, 40); } catch (e) { log.push('skip アートサイエンス: ' + e.message); }
try { setHensachi('osaka-geidai', /演奏/, 40, 40); } catch (e) { log.push('skip 演奏: ' + e.message); }

// 神奈川大
setHensachi('kanagawa-univ', /^(?!.*情報).*工学部/, 37.5, 42.5);
setHensachi('kanagawa-univ', /情報学部/, 42.5, 45);
{ const x = findDept('kanagawa-univ', /経済/); setHensachi('kanagawa-univ', /経済/, 40, x.hensachi.max); }
setHensachi('kanagawa-univ', /化学生命/, 45, 47.5);
try { setHensachi('kanagawa-univ', /経営/, 45, 47.5); } catch (e) { log.push('skip 神奈川経営: ' + e.message); }

// 畿央大
setHensachi('kio', /理学療法|健康科学.*理学/, 40, 42.5);
setHensachi('kio', /現代教育|教育学部/, 42.5, 45);
setHensachi('kio', /栄養/, 42.5, 45);

// 四天王寺大
setHensachi('shitennoji', /経営/, 40, 42.5);
setHensachi('shitennoji', /教育/, 45, 45);
try { setHensachi('shitennoji', /看護/, 45, 45); } catch (e) { log.push('skip 四天王寺看護: ' + e.message); }

// 東海大（追加分）
setHensachi('tokai-univ', /児童教育/, 42.5, 45);
setHensachi('tokai-univ', /海洋/, 35, 50);
setHensachi('tokai-univ', /国際学部|国際学科/, 37.5, 42.5);
setHensachi('tokai-univ', /文化社会/, 42.5, 50);

// 福知山公立大
setHensachi('fukuchiyama-koritsu', /情報/, 40, 42.5);

// 京都外大
setHensachi('kyoto-gaidai', /外国語/, 35, 47.5);
try { setHensachi('kyoto-gaidai', /国際貢献/, 42.5, 47.5); } catch (e) { log.push('skip 京都外大国際貢献: ' + e.message); }
setTuition('kyoto-gaidai', 1260000, null);

// 名古屋市立大（難化反映）
setHensachi('nagoya-shiritsu', /経済/, 57.5, 60);
setHensachi('nagoya-shiritsu', /人文社会/, 55, 57.5);
setHensachi('nagoya-shiritsu', /総合生命理学/, 55, 57.5);
setHensachi('nagoya-shiritsu', /薬学部/, 60, 62.5);

// 奈良教育大
setHensachi('nara-kyoiku', /伝統文化/, 45, 52.5);

// 奈良大
setHensachi('nara-univ', /文学部/, 35, 40);
setHensachi('nara-univ', /社会学部/, 35, 37.5);

// 大阪大谷大
setHensachi('osaka-otani', /教育/, 35, 40);

// 筑波大（追加分）
setHensachi('tsukuba', /看護/, 55, 57.5);
setHensachi('tsukuba', /障害科学/, 60, 62.5);
setHensachi('tsukuba', /情報(学群|科学|メディア)|^筑波.*情報/, 57.5, 60);
try { setHensachi('tsukuba', /芸術/, 55, 60); } catch (e) { log.push('skip 筑波芸術: ' + e.message); }

// 園田学園 看護
setHensachi('sonoda-gakuen', /人間看護/, 42.5, 45);

// 文教大
setHensachi('bunkyo-univ', /情報/, 37.5, 45);
setHensachi('bunkyo-univ', /健康栄養/, 37.5, 42.5);
setHensachi('bunkyo-univ', /経営/, 47.5, 50);
{ const x = findDept('bunkyo-univ', /文学部/); setHensachi('bunkyo-univ', /文学部/, 40, x.hensachi.max); }

// 名工大
setHensachi('nagoya-kogyo', /物理/, 57.5, 60);
setHensachi('nagoya-kogyo', /生命/, 55, 60);
setHensachi('nagoya-kogyo', /社会/, 55, 60);

// 九州大
setHensachi('kyushu-univ', /理学部/, 57.5, 57.5);
setHensachi('kyushu-univ', /農学部/, 55, 57.5);

// 岡山大
setHensachi('okayama-univ', /農学部/, 50, 52.5);
setHensachi('okayama-univ', /文学部/, 55, 57.5);

// 北里大
setHensachi('kitasato', /(?<!獣)医学部/, 62.5, 65);
setHensachi('kitasato', /獣医/, 37.5, 60);

// 森ノ宮医療大
setHensachi('morinomiya-iryo', /看護/, 47.5, 50);
setHensachi('morinomiya-iryo', /作業療法/, 45, 47.5);
setHensachi('morinomiya-iryo', /言語聴覚/, 42.5, 45);

// 神戸市外大 ロシア
try { setHensachi('kobe-gaidai', /ロシア/, 55, 57.5); } catch (e) { log.push('skip 神戸外大ロシア: ' + e.message); }

// 兵庫県立大 理
setHensachi('hyogo-kenritsu', /理学部/, 52.5, 52.5);

// 千葉大 国際教養
setHensachi('chiba-univ', /国際教養/, 57.5, 60);

// 成蹊大 経営
setHensachi('seikei', /経営/, 55, 57.5);

// 東京科学大 口腔保健
try { setHensachi('tokyo-kagaku', /口腔保健/, 50, 52.5); } catch (e) { log.push('skip 口腔保健: ' + e.message); }
setTuition('tokyo-kagaku', null, '※医歯学系は642,960円/年');

// 中央大 経済 / 青学 / 早稲田商
setHensachi('chuo', /経済/, 57.5, 60);
setHensachi('aoyama-gakuin', /社会情報/, 57.5, 60);
setHensachi('aoyama-gakuin', /地球社会共生/, 57.5, 57.5);
setHensachi('waseda', /商学部/, 67.5, 70);

// 花園大 文（河合BF〜35）
setHensachi('hanazono', /文学部/, 35, 35, 'BF〜35');

// 奈良県立大 地域創造（換算相場へ）
try { setHensachi('nara-kenritsu', /地域創造/, 50, 52.5); } catch (e) { log.push('skip 奈良県立地域創造: ' + e.message); }

// ============ 3. basis（河合非公表学部は「推定」表記へ） ============
[['fukuchiyama-koritsu', /地域経営/], ['nara-kenritsu', /地域創造/], ['wakayama-idai', /保健看護/], ['hyogo-kenritsu', /看護/], ['nara-idai', /看護/]].forEach(([uid, re]) => {
  try { setBasis(uid, re, '推定'); } catch (e) { log.push(`skip basis ${uid}: ${e.message}`); }
});

// ============ 4. 学費 ============
setTuition('nara-idai', 642960, '令和8年度以降入学者は642,960円/年に改定');
['teikyo', 'baika', 'shitennoji', 'sonoda-gakuen', 'konan-joshi', 'osaka-otani', 'kitasato', 'kyoto-koka', 'tsuda-juku', 'seikei'].forEach((uid) => {
  setTuition(uid, null, '※医・薬・看護など医療系学部は表示額より大幅に高い（公式で要確認）');
});

// ============ 5. キャンパス表記 ============
try { setCampus('tokyo-toritsu', /システムデザイン/, '日野キャンパス（※1・2年次は南大沢）'); } catch (e) { log.push('skip 都立大campus: ' + e.message); }
try { setCampus('nara-gakuen', /リハビリ/, '登美ヶ丘キャンパス（奈良市中登美ヶ丘）'); } catch (e) { log.push('skip 奈良学園campus: ' + e.message); }

// ============ 保存 ============
fs.writeFileSync(P, JSON.stringify(d));
console.log('適用ログ (' + log.length + '件):');
log.forEach((l) => console.log('  ' + l));
console.log('\n大学:', d.universities.length, '学部:', d.departments.length);
