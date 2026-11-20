// 大学公式サイトから「入試情報・入試日程・募集要項・オープンキャンパス」のリンクと、日程表の行を集める小さな巡回スクリプト。
// ブラウザのページ上で動かす（window.name にコードと状態を持ち、ページを移っても続きから動く）。
// 使い方: このファイルを開いたページで  window.name = document.body.innerText + String.fromCharCode(1) + JSON.stringify({res:{}})
//         以後、各ページで  eval(name.split(String.fromCharCode(1))[0]); await T('<大学id>', 1か2)  を1校ずつ実行する。
(function () {
  const SEP = String.fromCharCode(1);
  const st = () => JSON.parse(window.name.split(SEP)[1]);
  const save = (s) => { window.name = window.name.split(SEP)[0] + SEP + JSON.stringify(s); };
  const txt = (a) => ((a.textContent || '') + ' ' + [...a.querySelectorAll('img')].map((i) => i.alt || '').join(' ') + ' ' + (a.title || '')).replace(/\s+/g, '');
  const pick = (doc, base, res, nre) => {
    const as = [...doc.querySelectorAll('a[href]')].filter((a) => !/^(javascript:|mailto:|tel:|#)/.test(a.getAttribute('href')));
    for (const r of res) {
      const a = as.find((a) => r.test(txt(a)) && !(nre && nre.test(txt(a))));
      if (a) { try { return new URL(a.getAttribute('href'), base).href; } catch (e) {} }
    }
    return null;
  };
  const DATE = /\d{1,2}\s?[月\/]\s?\d{1,2}/g;
  const rows = (d) => {
    const out = [], seen = new Set();
    d.querySelectorAll('tr, li, dl, p').forEach((el) => {
      if (el.querySelector('tr, li, dl, p, table')) return;                    // 入れ子の外側は飛ばす
      const s = (el.tagName === 'TR' ? [...el.children].map((c) => c.textContent.replace(/\s+/g, ' ').trim()).join('｜') : el.textContent.replace(/\s+/g, ' ').trim());
      if ((s.match(DATE) || []).length >= 2 && s.length < 300 && !seen.has(s)) { seen.add(s); out.push(s); }
    });
    return out.join('\n');
  };
  const getDoc = async (u) => new DOMParser().parseFromString(await (await fetch(u)).text(), 'text/html');
  const sameOrigin = (u) => { try { return new URL(u).origin === location.origin && !/\.(pdf|xlsx?|docx?)(\?|$)/i.test(u); } catch (e) { return false; } };
  const pickAll = (doc, base, re, nre, n) => {
    const out = [];
    [...doc.querySelectorAll('a[href]')].forEach((a) => {
      const h = a.getAttribute('href');
      if (/^(javascript:|mailto:|tel:|#)/.test(h) || !re.test(txt(a)) || (nre && nre.test(txt(a)))) return;
      try { const u = new URL(h, base).href.split('#')[0]; if (!out.includes(u) && sameOrigin(u)) out.push(u); } catch (e) {}
    });
    return out.slice(0, n);
  };
  const ADM = [/受験生サイト|受験生の方|受験生応援|入試サイト|入試情報サイト|受験生向け/, /入試情報|入試・入学|入学案内|入試案内|学部入試|入学試験|受験生|ADMISSION/i, /入試/];
  const SCH = [/入試日程|入試スケジュール|試験日程|入試カレンダー|日程一覧/, /日程/];
  const YK = [/入学試験要項|入試要項|募集要項|学生募集要項|選抜要項/, /入試ガイド|入試概要/];
  const NOT = /オープンキャンパス|イベント|相談会|大学院|編入|留学生|過去/;
  // 1校ぶんの処理。ページの移動はしない（移動は外から行う）。step 1 = 大学トップから入試ページを探す / 2 = 入試ページそのもの
  window.T = async function (id, step) {
    const s = st();
    const r = (s.res[id] = {});
    const here = location.href;
    if (/404|not found|見つかりません|お探しのページ|存在しません/i.test(document.title + ' ' + ((document.querySelector('h1') || {}).textContent || ''))) {
      r.err = 'gone'; r.top = new URL(here).origin + '/'; save(s); return 'GONE ' + id;
    }
    let doc = document, base = here;
    if (step === 1) {
      const adm = pick(document, here, ADM, /大学院|在学生|保護者|卒業生/);
      if (adm && adm.split('#')[0].replace(/\/$/, '') !== here.replace(/\/$/, '')) {
        if (sameOrigin(adm)) { try { doc = await getDoc(adm); base = adm; } catch (e) {} }
        else { r.x = adm; save(s); return 'X ' + id; }                  // 入試サイトが別ドメイン → 次の回にそのURLを直接開く
      }
    }
    r.n = base;
    r.sch = pick(doc, base, SCH, NOT);
    r.yk = pick(doc, base, YK, /大学院|編入|留学生/);
    r.oc = pick(doc, base, [/オープンキャンパス/]) || pick(document, here, [/オープンキャンパス/]);
    try {
      if (!r.sch || !r.yk) {
        for (const u of pickAll(doc, base, /入試情報|入試制度|入試概要|入試種別|選抜方式|入試・入学|学部入試|一般選抜/, NOT, 4)) {
          if (r.sch && r.yk) break;
          try { const d2 = await getDoc(u); if (!r.sch) r.sch = pick(d2, u, SCH, NOT); if (!r.yk) r.yk = pick(d2, u, YK, /大学院|編入|留学生/); } catch (e) {}
        }
      }
      let t = '', sd = null;
      if (r.sch && sameOrigin(r.sch)) { sd = await getDoc(r.sch); t = rows(sd); if (!r.yk) r.yk = pick(sd, r.sch, YK, /大学院|編入|留学生/); }
      if (!t) t = rows(doc);
      if (t.length < 80) {
        for (const [lab, re] of [['総合型', /総合型選抜|AO入試/], ['推薦', /学校推薦型|公募/], ['一般', /一般選抜|一般入試/]]) {
          const u = (sd && pickAll(sd, r.sch, re, NOT, 1)[0]) || pickAll(doc, base, re, NOT, 1)[0];
          if (u) { try { const x = rows(await getDoc(u)); if (x) t += '\n[' + lab + '] ' + x.slice(0, 600); } catch (e) {} }
        }
      }
      r.t = t.slice(0, 1800);
    } catch (e) { r.t = r.t || ''; }
    save(s);
    return 'ok ' + id + ' ' + (r.sch ? 'S' : '-') + (r.yk ? 'Y' : '-') + (r.oc ? 'O' : '-') + ' ' + (r.t || '').length;
  };
  // 結果の読み出し: R('links') = 全校のリンクを1行ずつ / R('t',[id,…]) = 日程表の行
  window.R = function (kind, ids) {
    const s = st();
    if (kind === 'links') return Object.entries(s.res).map(([id, r]) => [id, r.err || (r.x ? 'X ' + r.x : ''), r.n || r.top || '', r.sch || '', r.yk || '', r.oc || '', (r.t || '').length].join('\t')).join('\n');
    return (ids || []).map((id) => '## ' + id + ' ' + ((s.res[id] || {}).sch || '') + '\n' + ((s.res[id] || {}).t || '')).join('\n');
  };
})();
