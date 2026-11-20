// 大学公式サイトから「入試情報・入試日程・募集要項・オープンキャンパス」のリンクと、日程表の行を集める小さな巡回スクリプト。
// ブラウザのページ上で動かす（window.name にコードと結果を持つので、別の大学のページへ移っても結果が残る）。
// 使い方: このファイルを開いたページで  window.name = document.body.innerText + String.fromCharCode(1) + JSON.stringify({res:{}})
//         各大学のページを開くたびに  eval(name.split(String.fromCharCode(1))[0]); await T('<大学id>', 1か2)
//           1 = 大学トップ（入試ページを探す所から） / 2 = 入試ページそのもの
//         結果の読み出し  R('links', 開始, 終了) / R('t', 開始, 終了)
(function () {
  const SEP = String.fromCharCode(1);
  const st = () => JSON.parse(window.name.split(SEP)[1]);
  const save = (s) => { window.name = window.name.split(SEP)[0] + SEP + JSON.stringify(s); };
  const txt = (a) => ((a.textContent || '') + ' ' + [...a.querySelectorAll('img')].map((i) => i.alt || '').join(' ') + ' ' + (a.title || '')).replace(/\s+/g, '');
  const okHref = (h) => h && !/^(javascript:|mailto:|tel:|#)/.test(h);
  const norm = (u) => (u || '').split('#')[0].replace(/\/(index\.html?)?$/, '');
  const pick = (doc, base, res, nre) => {
    const as = [...doc.querySelectorAll('a[href]')].filter((a) => okHref(a.getAttribute('href')));
    for (const r of res) {
      const a = as.find((a) => r.test(txt(a)) && !(nre && nre.test(txt(a))));
      if (a) { try { return new URL(a.getAttribute('href'), base).href; } catch (e) {} }
    }
    return null;
  };
  const sameOrigin = (u) => { try { return new URL(u).origin === location.origin && !/\.(pdf|xlsx?|docx?|zip)(\?|$)/i.test(u); } catch (e) { return false; } };
  const pickAll = (doc, base, re, nre, n) => {
    const out = [];
    [...doc.querySelectorAll('a[href]')].forEach((a) => {
      const h = a.getAttribute('href');
      if (!okHref(h) || !re.test(txt(a)) || (nre && nre.test(txt(a)))) return;
      try { const u = new URL(h, base).href.split('#')[0]; if (!out.includes(u) && sameOrigin(u)) out.push(u); } catch (e) {}
    });
    return out.slice(0, n);
  };
  // ページの取得: 7秒で打ち切り。Shift_JIS / EUC-JP のサイトも読めるよう文字コードを見て復号する
  const getDoc = async (u) => {
    const c = new AbortController(); const tm = setTimeout(() => c.abort(), 5000);
    try {
      const r = await fetch(u, { signal: c.signal });
      const buf = await r.arrayBuffer();
      let cs = ((r.headers.get('content-type') || '').match(/charset=["']?([\w-]+)/i) || [])[1];
      if (!cs) cs = (new TextDecoder('ascii').decode(buf.slice(0, 3000)).match(/charset=["']?([\w-]+)/i) || [])[1];
      let html; try { html = new TextDecoder(cs || 'utf-8').decode(buf); } catch (e) { html = new TextDecoder('utf-8').decode(buf); }
      return new DOMParser().parseFromString(html, 'text/html');
    } finally { clearTimeout(tm); }
  };
  const DATE = /\d{1,2}\s?[月\/]\s?\d{1,2}/g;
  // 表示用に短くする: 年・曜日・時刻・「消印有効」などを落とし、M月D日 → M/D
  const clean = (s) => s.replace(/\s+/g, ' ')
    .replace(/20\d\d\s*年\s*[（(]\s*令和\s*[\d０-９]+\s*年\s*[）)]/g, '')
    .replace(/令和\s*[\d０-９元]+\s*年度?/g, '').replace(/20\d\d\s*年度?/g, '')
    .replace(/\s*[（(]\s*[月火水木金土日](?:\s*[・･]\s*祝)?\s*[）)]/g, '')
    .replace(/\d{1,2}\s*[：:]\s*\d{2}/g, '')
    .replace(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/g, '$1/$2')
    .replace(/\s*[〜～~]\s*/g, '〜')
    .replace(/[〈<]?\s*(消印有効|必着|締切日当日の消印有効)\s*[〉>]?/g, '')
    .replace(/[（(]\s*[）)]/g, '').replace(/\s{2,}/g, ' ').replace(/\s*｜\s*/g, '｜').trim();
  // 表の見出し行（thがあり日付を含まない最初の行）
  const headerOf = (tr) => {
    const table = tr.closest('table'); if (!table) return null;
    if (table.__h !== undefined) return table.__h;
    const first = [...table.querySelectorAll('tr')].find((r) => r.querySelector('th') && r.children.length >= 3 && !(r.textContent.match(DATE) || []).length);
    table.__h = first ? [...first.children].map((c) => c.textContent.replace(/\s+/g, '').slice(0, 8)) : null;
    return table.__h;
  };
  // 日付が2つ以上ある行を、直前の見出しと列の見出しつきで拾い、総合型(S)/推薦(K)/一般(I)/その他(?)に分けて各4行まで返す
  const rows = (d) => {
    const cat = { S: [], K: [], I: [], '?': [] }, seen = new Set();
    let cur = '';
    d.querySelectorAll('h1, h2, h3, h4, h5, caption, tr, li, dl, p').forEach((el) => {
      if (/^H\d$|CAPTION/.test(el.tagName)) { cur = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 36); return; }
      if (el.querySelector('tr, li, dl, p, table')) return;
      const raw = el.textContent.replace(/\s+/g, ' ').trim();
      if ((raw.match(DATE) || []).length < 2 || raw.length > 260) return;
      let s;
      if (el.tagName === 'TR') {
        const cells = [...el.children].map((c) => c.textContent.replace(/\s+/g, ' ').trim());
        const h = headerOf(el), k = h ? h.length - cells.length : -1;
        s = cells.map((c, i) => (h && k >= 0 && k <= 2 && h[i + k] && /\d/.test(c) && !/\d/.test(h[i + k]) ? h[i + k] + ' ' : '') + c).join('｜');
      } else s = raw;
      s = clean(s);
      if (seen.has(s) || s.length > 200) return;
      seen.add(s);
      const all = cur + ' ' + s;
      if (/大学院|研究科|専攻科|編入|留学生|帰国|社会人|過年度|入試結果|オープンキャンパス|説明会|相談会|科目等履修|研究生/.test(all)) return;
      const key = /総合型|ＡＯ|AO/.test(all) ? 'S' : /推薦|公募/.test(all) ? 'K' : /一般|前期|後期|中期|共通テスト|全学部|個別/.test(all) ? 'I' : '?';
      if (cat[key].length < 4) cat[key].push(key + ':' + (cur ? '[' + clean(cur) + '] ' : '') + s);
    });
    return [...cat.S, ...cat.K, ...cat.I, ...cat['?'].slice(0, 2)].join('\n');
  };
  // ページに一番多く出てくる「○○年度」（令和は西暦に直す）
  const yearOf = (d) => {
    const t = d.body ? d.body.textContent : '', c = {};
    (t.match(/20\d\d(?=\s*年度)/g) || []).forEach((y) => (c[y] = (c[y] || 0) + 1));
    (t.match(/令和\s*([\d０-９]+)\s*年度/g) || []).forEach((m) => { const n = Number(m.replace(/[^\d０-９]/g, '').replace(/[０-９]/g, (x) => '０１２３４５６７８９'.indexOf(x))); if (n) { const y = String(2018 + n); c[y] = (c[y] || 0) + 1; } });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 2).map((x) => x[0]).join('/');
  };
  const ADM = [/受験生サイト|受験生の方|受験生応援|入試サイト|入試情報サイト|受験生向け|受験生のみなさ/, /入試情報|入試・入学|入学案内|入試案内|学部入試|入学試験|受験生|ADMISSION/i, /入試/];
  const SCH = [/入試日程|入試スケジュール|試験日程|日程一覧|入試カレンダー|選抜日程/, /(入試|選抜|試験).*日程|日程.*(入試|選抜|試験)/];
  const YK = [/入学試験要項|入試要項|募集要項|学生募集要項|選抜要項/, /入試ガイド|入試概要/];
  const NOT = /オープンキャンパス|イベント|相談会|大学院|編入|留学生|過去|研究生|科目等履修/;
  const YKNOT = /大学院|編入|留学生|研究生|科目等履修|外国人|請求/;
  const is404 = (d) => /404|not found|見つかりません|お探しのページ|存在しません|エラー/i.test((d.title || '') + ' ' + ((d.querySelector('h1') || {}).textContent || '').slice(0, 40));

  window.T = async function (id, step) {
    const s = st();
    const r = (s.res[id] = {});
    const here = location.href, t0 = Date.now();
    const late = () => Date.now() - t0 > 13000;
    let doc = document, base = here;
    try {
      const nav = (performance.getEntriesByType('navigation')[0] || {}).responseStatus;
      if (is404(document) || nav === 404 || nav === 410) {                       // 登録URLが切れている → 同じサイトのトップから探し直す
        r.gone = 1; const top = new URL(here).origin + '/';
        doc = await getDoc(top); base = top; step = 1;
      }
      if (step === 1) {
        const adm = pick(doc, base, ADM, /大学院|在学生|保護者|卒業生/);
        if (adm && norm(adm) !== norm(base)) {
          if (sameOrigin(adm)) { try { doc = await getDoc(adm); base = adm; } catch (e) {} }
          else { r.x = adm; save(s); return 'X ' + id + ' ' + adm; }   // 入試サイトが別ドメイン → そのURLを直接開いて step 2 でやり直す
        }
      }
      r.n = base;
      r.sch = pick(doc, base, SCH, NOT);
      r.yk = pick(doc, base, YK, YKNOT);
      r.oc = pick(doc, base, [/オープンキャンパス/]) || pick(document, here, [/オープンキャンパス/]);
      if (r.oc && norm(r.oc) === norm(r.n)) r.oc = null;
      if (!r.sch || !r.yk) {                        // 1階層下（入試情報・入試制度など）も見る
        for (const u of pickAll(doc, base, /入試情報|入試制度|入試概要|入試種別|選抜方式|入試・入学|学部入試|一般選抜/, NOT, 4)) {
          if ((r.sch && r.yk) || late()) break;
          try { const d2 = await getDoc(u); if (!r.sch) r.sch = pick(d2, u, SCH, NOT); if (!r.yk) r.yk = pick(d2, u, YK, YKNOT); } catch (e) {}
        }
      }
      let t = '', sd = null;
      if (r.sch && sameOrigin(r.sch) && !late()) { try { sd = await getDoc(r.sch); t = rows(sd); r.y = yearOf(sd); if (!r.yk) r.yk = pick(sd, r.sch, YK, YKNOT); } catch (e) {} }
      if (!t) { t = rows(doc); if (t && !r.y) r.y = yearOf(doc); }
      if (t.length < 80) {                          // 日程表に日付が無ければ、方式ごとのページから拾う
        for (const [lab, re] of [['総合型', /総合型選抜|AO入試/], ['推薦', /学校推薦型|公募/], ['一般', /一般選抜|一般入試/]]) {
          if (late()) break;
          const u = (sd && pickAll(sd, r.sch, re, NOT, 1)[0]) || pickAll(doc, base, re, NOT, 1)[0];
          if (u) { try { const dd = await getDoc(u); const x = rows(dd); if (x) { t += (t ? '\n' : '') + x.split('\n').slice(0, 4).join('\n'); if (!r.y) r.y = yearOf(dd); } } catch (e) {} }
        }
      }
      r.t = t.slice(0, 1300);
    } catch (e) { r.err = String(e).slice(0, 40); }
    save(s);
    return 'ok ' + id + ' ' + (r.gone ? 'G' : '') + (r.sch ? 'S' : '-') + (r.yk ? 'Y' : '-') + (r.oc ? 'O' : '-') + ' ' + (r.t || '').length;
  };
  // 結果の読み出し（a〜b番目）。リンクは入試ページと同じサイトなら「~」に縮める
  window.R = function (kind, a, b) {
    const s = st(); const ent = Object.entries(s.res).slice(a || 0, b || 9999);
    const rel = (u, n) => { if (!u) return ''; try { const o = new URL(n).origin; return u.indexOf(o) === 0 ? '~' + u.slice(o.length) : u; } catch (e) { return u; } };
    if (kind === 'links') return ent.map(([id, r]) => [id, (r.gone ? 'G' : '') + (r.x ? 'X' : '') + (r.err ? 'E' : ''), r.n || r.x || '', rel(r.sch, r.n), rel(r.yk, r.n), rel(r.oc, r.n)].join('\t')).join('\n');
    return ent.filter(([, r]) => r.t).map(([id, r]) => '## ' + id + ' y=' + (r.y || '') + '\n' + r.t).join('\n');
  };
  window.__rows = rows; window.__clean = clean;
})();
