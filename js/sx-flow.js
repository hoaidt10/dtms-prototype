/* Phân hệ Quản lý sản xuất — bộ chạy luồng và Việc của tôi (T71 S2, D-121).
   Một bộ chạy cho mọi luồng nháp D.sxFlows (SX-KH ở S2; SX-BG, SX-BT, SX-TD, SX-NT ở S3, S6–S8): bước, người xử lý, nút, eForm đều đọc từ cấu hình;
   điều kiện / tác động lên dự án nằm ở bộ xử lý hành động ACT (thật: job worker / action handler của engine, không code riêng từng màn).
   Hồ sơ lưu localStorage (sx-proto-flow); hồ sơ mẫu ở D.sxCases. Route: #/sx/viec-cua-toi (SX-15), #/sx/viec/<mã hồ sơ>/<mã việc> (SX-05 — xử lý việc),
   #/sx/viec/<mã hồ sơ>/xem/<chỉ số lịch sử> (việc đã xử lý, chế độ Xem). Màn xử lý việc = Chi tiết dự án + thanh trạng thái (khuôn my-task-detail, như D-92 ĐXMS). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;

  /* ---------- Ngày ---------- */
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const addDays = (s, n) => { const x = new Date(Date.parse(String(s).slice(0, 10) + 'T00:00:00') + n * 86400000); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
  const isoOf = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;

  /* ---------- Kho hồ sơ ---------- */
  const KEY = 'sx-proto-flow';
  const seed = () => ({ cases: JSON.parse(JSON.stringify(D.sxCases || [])), seq: 0 });
  let S = seed();
  try { const x = JSON.parse(localStorage.getItem(KEY) || 'null'); if (x && Array.isArray(x.cases)) S = x; } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } };
  const FL = (k) => D.sxFlows[k];
  const stepOf = (flow, id) => FL(flow).steps.find((s) => String(s[0]) === String(id));
  const cases = (obj, flow) => S.cases.filter((c) => (!obj || c.obj === obj) && (!flow || c.flow === flow));
  const caseOf = (code) => S.cases.find((c) => c.code === code) || null;
  const running = (obj, flow) => cases(obj, flow).find((c) => c.status === 'running') || null;
  const pid = () => Flow.state.persona;
  const isAdmin = (id) => D.allAccess(id) || id === 'qt';
  const mine = (t, id) => t.who === id || isAdmin(id);
  const dueOf = (c, t) => addDays(t.since, (stepOf(c.flow, t.step)[3] || {}).nlv || 2);
  const late = (c, t) => dueOf(c, t) < D.sxToday;
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  /* Đối tượng cha của luồng (D.sxFlows[*].obj): dự án sản xuất (sx-du-an.js) hoặc gói chuyển giao (sx-chuyen-giao.js). Mỗi loại: byCode, detail(code, opt). */
  const OBJ = { project: () => window.SxDuAn, package: () => window.SxCg };
  const objOf = (c) => OBJ[FL(c.flow).obj || 'project']();
  const objRec = (c) => objOf(c).byCode(c.obj);

  /* ---------- Bộ xử lý hành động (cấu hình bước gọi theo tên) ---------- */
  const ACT = {
    'kh.start': (c) => P().log(c.obj, 'Khởi tạo hồ sơ phê duyệt kế hoạch', c.code),
    'kh.submit': (c) => P().log(c.obj, 'Trình kế hoạch sản xuất', `Kế hoạch số ${c.vars.khSo || ''}`),
    'kh.review': (c, ch) => { if (ch && ch[2] === 'no') P().log(c.obj, 'Yêu cầu chỉnh sửa kế hoạch', c.vars.ykNoiDung || ''); },
    'kh.approve': (c, ch) => P().log(c.obj, ch && ch[2] === 'no' ? 'Trả lại kế hoạch sản xuất' : 'Phê duyệt kế hoạch sản xuất', ch && ch[2] === 'no' ? c.vars.ykNoiDung || '' : `Kế hoạch số ${c.vars.khSo || ''}`),
    /* Bước 5 xong: chốt kế hoạch gốc (khung 15 bước theo ngày dự án + các mốc chính của kế hoạch), dự án sang Chuẩn bị sản xuất, ghi tài liệu kế hoạch đã phê duyệt. */
    'kh.baseline': (c) => {
      const v = c.vars;
      P().patch(c.obj, { baseline: D.sxToday, status: 'PREPARING', keyMs: v.khMoc || [], subPm: v.koSubPm || null, planNo: v.khSo || '' }, 'Chốt kế hoạch gốc', `Kick-off ngày ${v.koNgay || ''}`);
      P().addDoc(c.obj, [`Kế hoạch sản xuất ${v.khSo || ''} (đã phê duyệt).pdf`, 'KH', 'v1.0', pid(), D.sxToday]);
    },
  };
  const run = (name, c, ch, x) => { if (name && ACT[name]) ACT[name](c, ch, x || {}); };
  /* Điều kiện chặn hành động (luật hiển thị nút / kiểm tra trước khi gửi): trả về câu báo lỗi hoặc null. Bộ chặn đăng ký thêm ở module nghiệp vụ. */
  const GUARD = {};
  const guardMsg = (c, t) => { const g = (stepOf(c.flow, t.step)[3] || {}).guard; return g && GUARD[g] ? GUARD[g](c, t) : null; };

  function enter(c, to) {
    if (to === 'end') {
      c.status = 'done'; c.tokens = []; c.ended = nowStamp();
      run(FL(c.flow).onEnd, c);
      c.hist.push({ step: null, who: null, act: FL(c.flow).endText || 'Kết thúc', at: nowStamp() });
      return;
    }
    /* Nhánh song song: next là mảng → mở mọi nhánh cùng lúc (parallel gateway). */
    if (Array.isArray(to)) { c.tokens = []; to.forEach((x) => open(c, x)); return; }
    c.tokens = [];
    open(c, to);
  }
  function open(c, to) {
    const st = stepOf(c.flow, to), o = st[3] || {};
    if (st[2] === 'svc') { run(o.action, c, null, { step: st[0] }); c.hist.push({ step: st[0], who: null, act: o.label || 'Hệ thống xử lý', at: nowStamp() }); enter(c, o.next); return; }
    S.seq += 1;
    c.tokens.push({ id: 't' + S.seq, step: st[0], who: D.sxAssign(st[2], objRec(c)), since: nowStamp() });
  }
  /* Khởi tạo hồ sơ của đối tượng: mã <short>-<mã đối tượng>-<lần>, mở bước 1. Trả về hồ sơ. */
  function start(flow, obj) {
    const n = cases(obj, flow).length + 1, c = { code: `${FL(flow).short}-${obj}-${String(n).padStart(2, '0')}`, flow, obj, status: 'running', started: nowStamp(), tokens: [], vars: {}, hist: [] };
    S.cases.push(c);
    c.hist.push({ step: null, who: pid(), act: 'Khởi tạo hồ sơ', at: nowStamp() });
    run(FL(flow).onStart, c);
    enter(c, FL(flow).steps[0][0]);
    persist();
    return c;
  }
  /* Hoàn thành việc: ghi biến của form (output mapping), ghi lịch sử, chạy bộ xử lý của bước, sang bước theo nút. */
  function complete(code, tokId, ci, values) {
    const c = caseOf(code), t = c && c.tokens.find((x) => x.id === tokId);
    if (!t) return null;
    const st = stepOf(c.flow, t.step), o = st[3] || {}, ch = o.choices ? o.choices[ci] : null, f = formOf(c.flow, o.form);
    const v = {};
    (f ? f.write : []).forEach((k) => { if (values && values[k] !== undefined) v[k] = values[k]; });
    Object.assign(c.vars, v);
    if (c.drafts) delete c.drafts[tokId];
    c.hist.push({ step: st[0], who: pid(), act: ch ? ch[0] : o.label || 'Hoàn thành', note: f && f.note ? f.note(c.vars) : '', since: t.since, at: nowStamp(), values: v });
    run(o.action, c, ch, { step: st[0], values: v });
    const to = ch ? ch[1] : o.next, rest = c.tokens.filter((x) => x.id !== tokId);
    const join = to !== 'end' && !Array.isArray(to) && (stepOf(c.flow, to)[3] || {}).join;
    /* Hợp nhánh: sang bước join khi mọi nhánh song song đã xong; nhánh khác còn chờ thì chỉ đóng việc này. Đi hướng khác (trả lại) thì huỷ các nhánh còn lại. */
    if (join && rest.length) c.tokens = rest;
    else {
      rest.forEach((x) => c.hist.push({ step: x.step, who: null, act: 'Huỷ do nhánh song song trả lại', since: x.since, at: nowStamp(), sys: true }));
      enter(c, to);
    }
    persist();
    return c;
  }
  const formOf = (flow, key) => (key && window.EForms.sx[flow] ? window.EForms.sx[flow][key] : null);
  const tokensFor = (id) => S.cases.flatMap((c) => c.tokens.filter((t) => mine(t, id)).map((t) => ({ c, t })));
  const pending = (id) => tokensFor(id).length;

  /* ---------- SX-15 Việc của tôi ---------- */
  const M = { tab: 'pending', kw: '' };
  function rows(id) {
    const n = window.UI.norm;
    const todo = tokensFor(id).map(({ c, t }) => ({ c, st: late(c, t) ? ['Quá hạn', 'error'] : ['Chưa xử lý', 'info'], step: stepOf(c.flow, t.step)[1], date: dmy(dueOf(c, t)), sort: t.since,
      go: `sx/viec/${encodeURIComponent(c.code)}/${t.id}`, over: late(c, t) }));
    const done = S.cases.flatMap((c) => c.hist.map((h, i) => ({ h, i })).filter(({ h }) => h.step != null && h.who && !h.sys && (h.who === id || isAdmin(id)))
      .map(({ h, i }) => ({ c, st: ['Hoàn thành', 'success'], step: stepOf(c.flow, h.step)[1], date: dmy(h.at), sort: h.at, go: `sx/viec/${encodeURIComponent(c.code)}/xem/${i}` })));
    return (M.tab === 'pending' ? todo : done).filter((r) => {
      const p = objRec(r.c) || {};
      return !M.kw || n(`${p.code} ${p.name} ${r.step}`).includes(n(M.kw));
    }).sort((a, b) => (a.sort < b.sort ? 1 : -1));
  }
  function tasks() {
    // Theo: fe/repo-khcn-dtms-fe/src/app/features/my-tasks/my-tasks.component.html (như SCR-01 Việc của tôi của ĐTMS; đối tượng cha = dự án sản xuất)
    const k = K(), id = pid(), list = rows(id), done = M.tab === 'done', cnt = pending(id);
    const info = {
      scr: 'SX-15', name: 'Việc của tôi (Quản lý sản xuất)', uc: 'CDS-BT-03COP COP2; SX-KS-K1 §3.1–3.3',
      notes: [
        'Cùng khuôn my-tasks với Việc của tôi của ĐTMS (SCR-01): tab Chưa xử lý / Đã hoàn thành, cột Mã / Tên đối tượng cha = dự án sản xuất. Việc của phân hệ Sản xuất chỉ hiện trong phân hệ này (danh sách việc lọc theo phân hệ).',
        'Việc sinh từ luồng nháp D.sxFlows (GIẢ LẬP P-238) chạy trên một bộ chạy chung: có luồng Phê duyệt kế hoạch sản xuất (S2) và Chuyển giao từ nghiên cứu sang sản xuất (S3, thẩm định song song); bất thường, thay đổi kỹ thuật, nghiệm thu thêm ở S6–S8.',
        'Người xử lý theo vai của bước (GIẢ LẬP P-244). Hạn xử lý = ngày nhận việc + định mức ngày của bước (ngày lịch, GIẢ LẬP); quá hạn tô đỏ.',
      ],
      q: ['P-238', 'P-244'], src: 'my-tasks/my-tasks.component · /my-tasks',
    };
    const cols = [['Trạng thái', 140, 'c'], ['Mã dự án / gói chuyển giao', 190], ['Tên dự án / gói chuyển giao', 300], ['Quy trình', 220], [done ? 'Bước bạn đã xử lý' : 'Bước cần xử lý', 280], [done ? 'Ngày xử lý' : 'Hạn xử lý', 140]];
    const body = list.map((r, i) => {
      const p = objRec(r.c) || {};
      return `<tr class="click" data-go="${r.go}"><td class="ord">${i + 1}</td><td class="c">${badge(...r.st)}</td><td><a class="link" data-go="${r.go}">${esc(p.code || r.c.obj)}</a></td>
        <td>${k.clamp(p.name || '')}</td><td>${k.clamp(FL(r.c.flow).name)}</td><td>${k.clamp(r.step)}</td><td class="num${r.over ? ' due-over' : ''}">${esc(r.date)}</td></tr>`;
    }).join('');
    return `<div class="pg" data-sx-tasks>
      ${head({ title: 'Việc của tôi', lg: true, info })}
      <div class="vcard pad24">
        <div class="pg-head"><h2 class="blk-t sm">Danh sách việc của tôi</h2><div class="r">
          <label class="vsearch" style="width:320px">${window.UI.icon('search')}<input id="sxv-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên dự án, gói chuyển giao..." value="${esc(M.kw)}"></label></div></div>
        <nav class="tabs dx-tabs vct-tabs" role="tablist" style="margin-bottom:0;border-bottom:0">${[['pending', 'Chưa xử lý'], ['done', 'Đã hoàn thành']].map(([t, l]) => `<button type="button" class="tab ${M.tab === t ? 'on' : ''}" role="tab" aria-selected="${M.tab === t}" data-sxv-tab="${t}">${l}${t === 'pending' && cnt ? ` <span class="tag red">${cnt}</span>` : ''}</button>`).join('')}</nav>
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${M.tab === 'pending' && !M.kw ? 'Bạn không có công việc nào cần xử lý.' : 'Không có dữ liệu.'}</td></tr>`}</tbody></table></div>
      </div></div>`;
  }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-sxv-tab]'); if (b) { M.tab = b.dataset.sxvTab; M.kw = ''; rerender(); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'sxv-kw') { M.kw = e.target.value.trim(); rerender(); } });

  /* ---------- SX-05 Xử lý việc: Chi tiết dự án + thanh trạng thái, nút theo cấu hình bước ---------- */
  function task(code, tokId, viewIdx) {
    const c = caseOf(code);
    const p = c && objRec(c), O = c && objOf(c);
    const none = (msg) => `<div class="pg">${head({ title: 'Xử lý công việc', back: 'sx/viec-cua-toi', lg: true })}${K().emptyCard('Thông tin chung', msg)}</div>`;
    if (!c || !p) return none('Không tìm thấy công việc.');
    if (viewIdx != null) {
      const h = c.hist[Number(viewIdx)];
      if (!h || h.step == null) return none('Không tìm thấy công việc.');
      const bar = window.Screens.statusBar({ mode: 'view', step: `Bước ${h.step} · ${stepOf(c.flow, h.step)[1]}`, date: dmy(h.at) });
      return O.detail(p.code, { title: O.viewTitle, back: 'sx/viec-cua-toi', bar, task: true });
    }
    const t = c.tokens.find((x) => x.id === tokId);
    if (!t) return none('Công việc đã được xử lý hoặc không còn tồn tại.');
    if (!mine(t, pid())) return none('Bạn không có quyền xử lý công việc này.');
    const st = stepOf(c.flow, t.step), o = st[3] || {};
    const acts = o.choices ? o.choices.map((ch, i) => `<button type="button" class="vbtn ${ch[2] === 'no' ? 'secondary' : 'primary'}" data-sx-do="${i}">${esc(ch[0])}</button>`).join('')
      : `<button type="button" class="vbtn primary" data-sx-do="-1">${esc(o.label || 'Hoàn thành')}</button>`;
    const bar = window.Screens.statusBar({ mode: 'process', step: `Bước ${st[0]} · ${st[1]}`, date: dmy(dueOf(c, t)), overdue: late(c, t), acts, who: t.who !== pid() ? pName(t.who) : '' });
    return `<div data-sx-task="${esc(c.code)}" data-sx-tok="${esc(t.id)}">${O.detail(p.code, { title: 'Xử lý công việc', back: 'sx/viec-cua-toi', bar, task: true, tok: t })}</div>`;
  }
  /* Biến ngữ cảnh của eForm: dự án (đối tượng cha) + biến hồ sơ; mốc chính gợi ý theo khung kế hoạch khi chưa nhập. */
  function ctxOf(c) {
    if (FL(c.flow).obj === 'package') return Object.assign(window.SxCg.ctx(c.obj), c.vars);
    const p = P().byCode(c.obj), cat = (key, v) => { const r = window.Catalog.rows(key).find((x) => x.code === v); return r ? r.name : v; };
    const plan = P().planOf(p);
    const ms = plan.map((g) => ({ ten: `Hoàn thành giai đoạn ${g.name.toLowerCase()}`, han: dmy(isoOf(g.e)) }));
    return Object.assign({ duAn: { code: p.code, name: p.name, product: p.product, version: p.version, qtyText: `${Number(p.qty).toLocaleString('vi-VN')} ${p.unitName}`, modelText: cat('sx-mo-hinh', p.model) },
      subPms: p.khoi === 'K1' ? [['sxsub', pName('sxsub')]] : [[p.pm, pName(p.pm)]], khMoc: ms, khNhanSu: [{ hoTen: pName(p.pm), donVi: (D.personas.find((x) => x.id === p.pm) || {}).unit || '', vaiTro: 'Giám đốc dự án' }] }, c.vars);
  }
  async function act(code, tokId, ci) {
    const c = caseOf(code), t = c.tokens.find((x) => x.id === tokId), st = stepOf(c.flow, t.step), o = st[3] || {}, ch = o.choices ? o.choices[ci] : null, f = formOf(c.flow, o.form);
    let values = {};
    /* Bộ chặn của bước (vd thiếu hồ sơ bắt buộc thì không gửi được) — không áp với nút từ chối. */
    const g = !(ch && ch[2] === 'no') && guardMsg(c, t);
    if (g) { toast(esc(g), 'warn'); return; }
    if (f) {
      const ctx = ctxOf(c);
      const pre = {};
      f.write.forEach((k) => { if (ctx[k] !== undefined) pre[k] = JSON.parse(JSON.stringify(ctx[k])); });
      /* Bản nháp của việc (Lưu nháp) mở lại đúng nội dung đã nhập. */
      Object.assign(pre, (c.drafts || {})[t.id] || {});
      const r = await window.EFormRun.open({ title: ch ? ch[0] : o.label || 'Hoàn thành', schema: Object.assign({ id: f.id }, f.schema(ctx, ch)), vars: ctx, values: pre });
      if (r && r.draft) { c.drafts = Object.assign({}, c.drafts, { [t.id]: r.values }); persist(); toast('<b>Thành công</b><br>Lưu nháp thành công!'); return; }
      if (!r || !r.submit) return;
      values = r.values;
    }
    complete(code, tokId, ch ? ci : -1, values);
    toast('<b>Thành công</b><br>Xử lý công việc thành công!');
    location.hash = '#/sx/viec-cua-toi';
    rerender();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sx-do]');
    if (!b) return;
    const w = b.closest('[data-sx-task]');
    if (w) act(w.dataset.sxTask, w.dataset.sxTok, Number(b.dataset.sxDo));
  });

  /* Tiến trình hồ sơ dùng chung mọi luồng: thông tin hồ sơ (top), bảng bước (steps), lịch sử xử lý (hist). more = ô thêm ở thông tin hồ sơ. */
  function progress(c, more) {
    const k = K(), F = FL(c.flow), o = objRec(c);
    const stRow = (s) => {
      const tok = c.tokens.find((t) => String(t.step) === String(s[0])), h = c.hist.slice().reverse().find((x) => String(x.step) === String(s[0]) && !x.sys);
      const state = tok ? (late(c, tok) ? ['Quá hạn', 'error'] : ['Đang xử lý', 'info']) : h ? ['Đã xử lý', 'success'] : ['Chưa tới', 'default'];
      const who = s[2] === 'svc' ? null : tok ? tok.who : h ? h.who : D.sxAssign(s[2], o);
      return `<td>${k.clamp(`${s[0]}. ${s[1]}`)}</td><td>${s[2] === 'svc' ? 'Hệ thống' : k.clamp(pName(who))}</td><td class="c">${badge(...state)}</td>
        <td class="num">${tok ? esc(dmy(dueOf(c, tok))) : h ? esc(dmy(h.at)) : k.dash}</td><td>${h && !tok ? k.clamp(h.act) : k.dash}</td>`;
    };
    const top = `<div class="ginfo c3">${k.kv('Mã hồ sơ', esc(c.code))}${k.kv('Quy trình', esc(F.name))}${k.kv('Trạng thái', c.status === 'done' ? badge('Hoàn thành', 'success') : badge('Đang xử lý', 'info'))}
      ${k.kv('Ngày khởi tạo', esc(dmy(c.started)))}${k.kv('Ngày kết thúc', c.ended ? esc(dmy(c.ended)) : null)}${more || ''}</div>`;
    const steps = k.table([['Tên bước', 400], ['Người xử lý', 200], ['Trạng thái', 130, 'c'], ['Hạn / ngày xử lý', 150], ['Kết quả', 180]], F.steps, stRow);
    const hist = k.table([['Thời gian', 160], ['Người thực hiện', 200], ['Bước', 300], ['Hành động', 200], ['Nội dung', 360]], c.hist.slice().reverse(),
      (h) => `<td class="num">${esc(dmy(h.at))}</td><td>${h.who ? k.clamp(pName(h.who)) : 'Hệ thống'}</td><td>${h.step != null ? k.clamp(`${h.step}. ${stepOf(c.flow, h.step)[1]}`) : k.dash}</td>
        <td>${k.clamp(h.act)}</td><td>${h.note ? k.clamp(h.note) : k.dash}</td>`);
    return { top, steps, hist };
  }
  /* ---------- Tab Phê duyệt kế hoạch của Chi tiết dự án (hồ sơ SX-KH: tiến trình, nội dung kế hoạch, lịch sử xử lý) ---------- */
  function planTab(p) {
    const k = K(), list = cases(p.code, 'SX-KH'), c = list[list.length - 1];
    if (!c) {
      return k.card('Hồ sơ phê duyệt kế hoạch', p.baseline ? '<p class="faint">Kế hoạch được phê duyệt trước khi đưa vào hệ thống — xem tab Lịch sử và Tài liệu.</p>'
        : '<p class="faint">Chưa khởi tạo hồ sơ phê duyệt kế hoạch.</p>');
    }
    const v = c.vars, pr = progress(c, k.kv('Kế hoạch số', v.khSo ? esc(v.khSo) : null)), top = pr.top, steps = pr.steps;
    const files = (keys) => keys.filter((x) => v[x]).map((x) => esc(v[x])).join('; ');
    const content = v.khMucTieu ? `<div class="ginfo c3">
        ${k.kv('Mục tiêu', esc(v.khMucTieu), 'span3')}${k.kv('Kết quả then chốt', [v.khKr1, v.khKr2, v.khKr3].filter(Boolean).map(esc).join('<br>'), 'span3')}
        ${k.kv('Yêu cầu', esc(v.khYeuCau || ''), 'span3')}${k.kv('Phương án tổ chức thực hiện', esc(v.khPhuongAn || ''), 'span3')}
        ${k.kv('Tổ chức thực hiện của các đơn vị', v.khToChuc ? esc(v.khToChuc) : null, 'span3')}${k.kv('Rủi ro, đề xuất', v.khRuiRo ? esc(v.khRuiRo) : null, 'span3')}
        ${k.kv('Báo cáo phương án sản xuất', v.paFile ? esc(v.paFile) : null, 'span3')}${k.kv('Phụ lục', files(['khPl1', 'khPl2', 'khPl3', 'khPl4', 'khPl5', 'khPl6']) || null, 'span3')}</div>
      <h4 class="ginfo-sub">Các mốc chính</h4>${k.table([['Mốc chính', 420], ['Thời gian hoàn thành', 180]], v.khMoc || [],
        (m) => `<td>${k.clamp(m.ten || '')}</td><td class="num">${esc(m.han || '')}</td>`)}
      <h4 class="ginfo-sub">Nhân sự chính thực hiện</h4>${k.table([['Họ và tên', 240], ['Đơn vị', 300], ['Vai trò', 200]], v.khNhanSu || [],
        (m) => `<td>${k.clamp(m.hoTen || '')}</td><td>${k.clamp(m.donVi || '')}</td><td>${k.clamp(m.vaiTro || '')}</td>`)}`
      : '<p class="faint">Kế hoạch sản xuất chưa được lập.</p>';
    const hist = pr.hist;
    return `<div data-sx-kh="${esc(c.code)}">${k.card('Hồ sơ phê duyệt kế hoạch', top + steps)}${k.card('Kế hoạch sản xuất (BM.QLHDSX.01)', content)}${k.card('Lịch sử xử lý', hist)}</div>`;
  }
  /* Nút Khởi tạo phê duyệt kế hoạch ở Chi tiết dự án: PM của dự án, dự án Lập kế hoạch, chưa có hồ sơ đang chạy. */
  const canStartKh = (p) => p.status === 'PLANNING' && !p.baseline && !running(p.code, 'SX-KH') && (p.pm === pid() || isAdmin(pid()));
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sx-kh-start]');
    if (!b) return;
    const c = start('SX-KH', b.dataset.sxKhStart);
    toast('<b>Thành công</b><br>Khởi tạo hồ sơ phê duyệt kế hoạch thành công!');
    location.hash = `#/sx/viec/${encodeURIComponent(c.code)}/${c.tokens[0].id}`;
  });

  /* Mở việc từ Việc của tôi: chọn sẵn tab của luồng ở màn chi tiết đối tượng (FL.tab), sau đó người dùng đổi tab tự do. */
  function enterRoute(parts) {
    if (parts[0] !== 'viec') return;
    const c = caseOf(decodeURIComponent(parts[1] || ''));
    if (c && FL(c.flow).tab) K().setTab(objOf(c).tabKey(c.obj), FL(c.flow).tab);
  }
  function route(parts) {
    if (parts[0] === 'viec-cua-toi') return tasks();
    const code = decodeURIComponent(parts[1] || '');
    return parts[2] === 'xem' ? task(code, null, parts[3]) : task(code, parts[2]);
  }
  function reset() { S = seed(); persist(); }

  window.SxFlow = { route, enter: enterRoute, GUARD, progress, start, complete, cases, caseOf, running, pending, tokensFor, planTab, canStartKh, reset, ACT };
})();
