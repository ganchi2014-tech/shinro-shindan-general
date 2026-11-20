// 大学公式サイトから「入試情報・入試日程・募集要項・オープンキャンパス」のリンクと、日程表の行を集める小さな巡回スクリプト。
// ブラウザのページ上で動かす（window.name にコードと状態を持ち、ページを移っても続きから動く）。
// 使い方: このファイルを開いたページで  window.name = document.body.innerText + String.fromCharCode(1) + JSON.stringify({q:<queue>,i:0,res:{}})
//         以後、各ページで  eval(name.split(String.fromCharCode(1))[0]); await T()  を繰り返す。
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
  const rows = (d) => {
    const out = [];
    d.querySelectorAll('tr').forEach((tr) => {
      const s = [...tr.children].map((c) => c.textContent.replace(/\s+/g, ' ').trim()).join('｜');
      if ((s.match(/\d{1,2}\s?[月\/]\s?\d{1,2}/g) || []).length >= 2 && s.length < 300) out.push(s);
    });
    return out.join('\n').slice(0, 1600);
  };
  const ADM = [/受験生サイト|受験生の方|受験生応援|入試サイト|入試情報サイト|受験生向け/, /入試情報|入試・入学|入学案内|入試案内|学部入試|入学試験|受験生|ADMISSION/i, /入試/];
  const SCH = [/入試日程|入試スケジュール|試験日程|入試カレンダー|日程一覧/, /日程/];
  const YK = [/入学試験要項|入試要項|募集要項|学生募集要項|選抜要項/, /入試ガイド|入試概要/];
  const NOT = /オープンキャンパス|イベント|相談会|大学院|編入|留学生|過去/;
  window.T = async function () {
    const s = st();
    if (s.i >= s.q.length) return 'DONE';
    const [id, url, step] = s.q[s.i];
    const r = (s.res[id] = s.res[id] || {});
    const next = () => { s.i++; s.w = 0; s.sub = 0; save(s); if (s.i < s.q.length) location.href = s.q[s.i][1]; return s.i + ' ' + id; };
    const here = location.href;
    // まだ目的のページに来ていない（読み込み中・失敗）
    if (!s.sub && here.replace(/\/$/, '') !== url.replace(/\/$/, '') && new URL(here).hostname.split('.').slice(-3).join('.') !== new URL(url).hostname.split('.').slice(-3).join('.')) {
      s.w = (s.w || 0) + 1;
      if (s.w >= 3) { r.err = 'load'; return next(); }
      save(s); if (s.w === 1) location.href = url; return 'wait ' + id;
    }
    if (step === 1 && !s.sub) {
      const adm = pick(document, here, ADM, /大学院|在学生|保護者|卒業生/);
      r.adm = adm;
      if (adm && adm.replace(/\/$/, '') !== here.replace(/\/$/, '')) { s.sub = 1; s.w = 0; save(s); location.href = adm; return 'adm ' + id; }
    }
    r.n = step === 1 && !r.adm ? null : here;
    r.sch = pick(document, here, SCH, NOT);
    r.yk = pick(document, here, YK, /大学院|編入|留学生/);
    r.oc = pick(document, here, [/オープンキャンパス/]);
    try {
      let d = document;
      if (r.sch && new URL(r.sch).origin === location.origin && !/\.pdf/i.test(r.sch)) {
        d = new DOMParser().parseFromString(await (await fetch(r.sch)).text(), 'text/html');
        if (!r.yk) r.yk = pick(d, r.sch, YK, /大学院|編入|留学生/);
      }
      r.t = rows(d);
    } catch (e) { r.t = ''; }
    return next();
  };
  // 結果の読み出し: R('links') = 全校のリンクを1行ずつ / R('t',[id,…]) = 日程表の行
  window.R = function (kind, ids) {
    const s = st();
    if (kind === 'links') return Object.entries(s.res).map(([id, r]) => [id, r.err || '', r.n || '', r.sch || '', r.yk || '', r.oc || '', (r.t || '').length].join('\t')).join('\n');
    return (ids || []).map((id) => '## ' + id + ' ' + ((s.res[id] || {}).sch || '') + '\n' + ((s.res[id] || {}).t || '')).join('\n');
  };
})();
