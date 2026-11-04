/* Các màn hình. Mỗi hàm trả về HTML; gắn sự kiện qua data-* trong app.js hoặc hàm bind đi kèm. */
(function () {
  const D = window.D, T = window.BPMN_TASKS, Flow = window.Flow;
  /* Task BPMN của quy trình hồ sơ đang chạy (MS01 v1.1 hoặc MS13); T giữ cho hồ sơ mẫu MS01. */
  const TT = () => Flow.tasks();
  const { esc, icon, persona, avatar, ty, pad2, cqcmUnit, qChip, infoBtn, vSelect, badge, pager } = window.UI;
  const rerender = () => window.App.render();

  const tno = (k) => (Flow.isTask(k) ? pad2(k) : '');
  /* data-create: 'hs' = Thêm mới hồ sơ (SCR-25), 'dxms' = Thêm mới ĐXMS (SCR-28). */
  const createBtn = (what) => `<button class="vbtn primary" data-create="${what}">${icon('add')} Thêm mới</button>`;
  const kindLabel = (k) => (D.kinds[k] || D.kinds.PD).label;
  const dxmsLink = (code) => (code && code !== '—' ? `<a class="link" data-go="dxms/${encodeURIComponent(code)}">${esc(code)}</a>` : dash);
  /* Hàng tiêu đề trang (B4): [nút quay lại] tiêu đề (i) … nút bên phải. */
  const head = (o) => `<div class="pg-head"><div class="l">${o.back ? `<button class="vbtn back" ${o.back === true ? 'data-back' : `data-go="${o.back}"`} aria-label="Quay lại">${icon('back')}</button>` : ''}
    <h1 class="pg-title ${o.lg ? 'lg' : ''}">${esc(o.title)}${o.info ? infoBtn(o.info) : ''}</h1></div>${o.right ? `<div class="r">${o.right}</div>` : ''}</div>`;
  const dash = '<span class="dash">-</span>';
  /* Điểm ❓ gắn lên màn của hồ sơ theo quy trình `flow`: điểm có `flows` chỉ hiện với quy trình đó (P-17…P-25), bỏ trùng. */
  const qFor = (flow, ids) => (ids || []).filter((id, i, a) => a.indexOf(id) === i && (!(D.openPoints[id] || {}).flows || D.openPoints[id].flows.includes(flow)));
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);


  /* ---------- SCR-00 Chọn vai ---------- */
  function chonVai() {
    const cur = Flow.state.persona;
    return `<div class="page">
      <div class="page-head"><div><h1>Chọn vai demo ${infoBtn({ scr: 'SCR-00', name: 'Chọn vai demo', notes: ['Màn chỉ có ở prototype, thay cho đăng nhập SSO; mở từ nút công cụ demo. Đổi vai nhanh ở menu avatar.', 'Số bên phải là việc đang chờ vai đó xử lý.'] })}</h1></div></div>
      <div class="personas">
        ${D.personas.map((p) => {
          const n = Flow.tokensFor(p.id).length;
          return `<button class="persona ${p.id === cur ? 'on' : ''}" data-persona="${p.id}">
            ${avatar(p.id, 'lg')}<div><div class="n">${esc(p.name)}</div><div class="r">${esc(p.role)}</div><div class="r faint">${esc(p.unit)}</div></div>
            <span class="cnt">${n ? `<span class="tag red">${n} việc</span>` : '<span class="tag">0</span>'}</span></button>`;
        }).join('')}
      </div></div>`;
  }

  /* ---------- SCR-01 Việc của tôi ---------- */
  /* Trạng thái việc theo my-task.constants.ts (MY_TASK_LIST_STATUS_*). */
  const TASK_STATUS = { CHUA_XU_LY: ['Chưa xử lý', 'info'], HOAN_THANH: ['Hoàn thành', 'success'], QUA_HAN: ['Quá hạn', 'error'] };
  const CASE_TYPES = Object.values(D.kinds).map((k) => k.label).concat(['Phê duyệt KĐT'], Object.values(D.hdProcesses).map((p) => p.type));
  const dueOf = (task, since) => since + Math.max(1, Math.ceil(((Flow.def()[task] || {}).nlv || 0.5) * 2));

  /* Việc của người đang đăng nhập: việc đang chờ trên hồ sơ chạy luồng, việc đã xử lý, việc trên hồ sơ mẫu. */
  function myTasks() {
    const pid = Flow.state.persona, ci = Flow.ci(), clock = Flow.state.clock, all = D.allAccess(pid);
    /* Hồ sơ KĐT: cột Mã ĐXMS hiện mã KĐT (đối tượng cha), Quy trình = nhóm KĐT (chưa xác định trước cổng phân luồng). */
    const base = { code: ci.code, dxms: ci.dxms, title: ci.name, flow: ci.flow, priority: ci.isKdt ? '' : ci.priority, type: ci.isKdt ? 'Phê duyệt KĐT' : kindLabel(ci.kind) };
    const todo = Flow.tokensFor(pid).slice().sort((x, y) => y.since - x.since).map((t) => Object.assign({}, base, {
      name: Flow.taskName(t.task), st: dueOf(t.task, t.since) < clock ? 'QUA_HAN' : 'CHUA_XU_LY',
      created: Flow.dateOf(t.since), due: Flow.dateOf(dueOf(t.task, t.since)), go: 'task/' + t.id,
    }));
    /* Sau 10b: ĐXMS thay thế đã được tạo, bước đầu tiên giao người tạo (mở bằng Flow.openReplacement). */
    if (Flow.state.status === 'moved' && (pid === 'minh' || all) && ci.isKdt) {
      /* Hồ sơ KĐT chuyển luồng: hồ sơ mới theo MS14 (luồng chưa dựng) — mở Thông báo chuyển luồng (SCR-66). */
      const mv = Flow.state.movedTo, g = (window.BPMN_DIAGRAMS || {})['MS14'];
      const n = g && g.nodes.find((x) => x.k === 'task' && String(x.t) === '1');
      todo.unshift(Object.assign({}, base, { code: mv.code, flow: mv.process, name: n ? n.name : '', st: 'CHUA_XU_LY',
        created: Flow.dateOf(clock), due: Flow.dateOf(clock + 2), go: `kdt/${encodeURIComponent(ci.kdt)}/chuyen-luong` }));
    } else if (Flow.state.status === 'moved' && (pid === 'minh' || all)) {
      const mv = Flow.state.movedTo;
      todo.unshift(Object.assign({}, base, { code: mv.code, flow: mv.process, name: Flow.taskName(1), st: 'CHUA_XU_LY',
        created: Flow.dateOf(clock), due: Flow.dateOf(dueOf(1, clock)), openNew: true }));
    }
    const done = Flow.state.history.filter((h) => all || h.who === pid).slice().reverse().map((h) => Object.assign({}, base, {
      name: Flow.taskName(h.task), st: 'HOAN_THANH', created: Flow.dateOf(h.since != null ? h.since : h.t),
      due: Flow.dateOf(dueOf(h.task, h.since != null ? h.since : h.t)), go: ci.isKdt ? kdtCaseHref(ci.code) : 'ho-so',
    }));
    const cases = allCases();
    const sample = D.sampleTasks.filter((s) => all || s.who === pid).map((s) => {
      const c = cases.find((x) => x.code === s.code);
      return { code: c.code, dxms: c.dxms, title: c.title, flow: c.flow, priority: c.priority, type: kindLabel(c.kind), name: (c.flow === 'MS02' ? window.BPMN_FLOWS.MS02.tasks : T)[s.task].name,
        st: 'HOAN_THANH', created: s.created, due: s.due, go: caseHref(c) };
    });
    /* Việc trên hồ sơ KĐT mẫu: mã KĐT ở cột mã đối tượng cha, Quy trình = nhóm KĐT (mã). */
    const kc = Flow.kdtCases(), T13 = window.BPMN_FLOWS.MS13.tasks;
    const kdtSample = D.sampleKdtTasks.filter((s) => all || s.who === pid).map((s) => {
      const c = kc.find((x) => x.code === s.code), x = Flow.findKdt(c.kdt) || {};
      return { code: c.code, dxms: c.kdt, title: c.title || x.title, flow: c.flow || 'Chưa xác định nhóm', priority: '', type: 'Phê duyệt KĐT', name: T13[s.task].name,
        st: 'HOAN_THANH', created: s.created, due: s.due, go: kdtCaseHref(c.code) };
    });
    return hdTasks(pid, all).concat(todo, done, sample, kdtSample);
  }
  /* Việc trên hồ sơ con của hợp đồng (D-47): mỗi hồ sơ một S, đọc từ kho, mã việc đã kèm mã hồ sơ. Cột mã đối tượng cha hiện mã hợp đồng. */
  function hdTasks(pid, all) {
    return Flow.cases().flatMap((c) => {
      const flow = c.vars.process, p = D.hdProcesses[flow], F = D.flows[flow], Tk = window.BPMN_FLOWS[flow].tasks, h = window.HopDong.find(c.parent) || {};
      const due = (k, s) => s + Math.max(1, Math.ceil(((F[k] || {}).nlv || 0.5) * 2));
      const base = { code: c.code, dxms: c.parent, title: c.name || h.title, flow, priority: '', type: p.type };
      const todo = c.tokens.filter((t) => all || t.who === pid).slice().sort((x, y) => y.since - x.since).map((t) => Object.assign({}, base, { name: Tk[t.task].name,
        st: due(t.task, t.since) < c.clock ? 'QUA_HAN' : 'CHUA_XU_LY', created: Flow.dateOf(t.since), due: Flow.dateOf(due(t.task, t.since)), go: 'task/' + t.id }));
      const done = c.history.filter((x) => x.who && (all || x.who === pid)).slice().reverse().map((x) => { const s = x.since != null ? x.since : x.t;
        return Object.assign({}, base, { name: Tk[x.task].name, st: 'HOAN_THANH', created: Flow.dateOf(s), due: Flow.dateOf(due(x.task, s)), go: 'ho-so-hd/' + c.code }); });
      return todo.concat(done);
    });
  }

  const emptyTaskFilter = () => ({ code: '', dxms: '', name: '', type: [], priority: null, flow: [], st: null });
  /* Như SCR-02: ô tìm kiếm và panel nâng cao là hai kiểu tìm độc lập (my-tasks.facade). */
  const M = { kw: '', adv: false, f: emptyTaskFilter(), d: emptyTaskFilter(), page: 1, size: 10, psOpen: false };

  function filteredTasks() {
    const n = window.UI.norm, f = M.f;
    return myTasks().filter((r) => (!M.adv
      ? !M.kw || n(r.name + ' ' + r.code + ' ' + r.dxms).includes(n(M.kw))
      : (!f.code || n(r.code).includes(n(f.code))) && (!f.dxms || n(r.dxms).includes(n(f.dxms)))
        && (!f.name || n(r.name).includes(n(f.name))) && (!f.type.length || f.type.includes(r.type))
        && (!f.priority || r.priority === f.priority) && (!f.flow.length || f.flow.includes(r.flow)) && (!f.st || r.st === f.st)));
  }

  function taskAdvPanel() {
    const d = M.d;
    const set = (k) => (v) => { d[k] = v; rerender(); };
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-mf="${k}" maxlength="255" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'm-' + k, value: d[k], clear: true, onChange: set(k) }, o))}</div>`;
    return `<form class="adv" data-madv>
      <div class="grid3">
        ${txt('code', 'Mã hồ sơ')}${txt('dxms', 'Mã ĐXMS / KĐT')}${txt('name', 'Tên công việc')}
        ${sel('type', 'Loại hồ sơ', { multi: true, searchable: true, options: CASE_TYPES.map((v) => ({ value: v, label: v })) })}
        ${sel('priority', 'Mức ưu tiên', { options: PRIORITIES.map((v) => ({ value: v, label: v })) })}
        ${sel('flow', 'Quy trình', { multi: true, searchable: true, options: PROC_CODES.concat(Object.keys(D.kdtGroups), Object.keys(D.hdProcesses)).map((k) => ({ value: k, label: k })) })}
        ${sel('st', 'Trạng thái', { placeholder: 'Tất cả công việc', options: Object.entries(TASK_STATUS).map(([k, v]) => ({ value: k, label: v[0] })) })}
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-m="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  function viecCuaToi() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/my-tasks/my-tasks.component.html
    //       + shared/constants/my-task-columns.constants.ts, my-task.constants.ts (trạng thái, bộ lọc)
    const p = persona(Flow.state.persona);
    if (M.who !== p.id) { M.who = p.id; M.page = 1; } // đổi tài khoản → về trang 1
    const rows = filteredTasks();
    const pages = Math.max(1, Math.ceil(rows.length / M.size));
    if (M.page > pages) M.page = pages;
    const from = (M.page - 1) * M.size;
    const cols = [['Trạng thái', 140, 'c'], ['Mã hồ sơ', 150], ['Mã ĐXMS / KĐT', 160], ['Hành động', 260], ['Ngày tạo', 120],
      ['Hạn xử lý', 120], ['Loại hồ sơ', 150], ['Mức ưu tiên', 120], ['Quy trình', 150]];
    const tgt = (r) => (r.openNew ? 'data-open-new="1"' : `data-go="${r.go}"`);
    const body = rows.slice(from, from + M.size).map((r, i) => `<tr class="click" ${tgt(r)} data-code="${esc(r.code)}">
        <td class="ord">${from + i + 1}</td><td class="c">${badge(TASK_STATUS[r.st][0], TASK_STATUS[r.st][1])}</td>
        <td><a class="link" ${tgt(r)}>${esc(r.code)}</a></td><td>${esc(r.dxms)}</td><td>${clamp(r.name)}</td>
        <td class="num">${esc(r.created)}</td><td class="num">${esc(r.due)}</td><td>${clamp(r.type)}</td><td>${r.priority ? esc(r.priority) : dash}</td><td>${esc(r.flow)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-01', name: 'Việc của tôi', uc: 'UC-03-01',
      notes: [
        `Đang đăng nhập: ${esc(p.name)} — ${esc(p.role)}, ${esc(p.unit)}. Đổi vai ở menu avatar (Chuyển tài khoản).`,
        'Không có tab Cần xử lý / Đã xử lý như bản cũ: lọc bằng trường <b>Trạng thái</b> trong Tìm kiếm nâng cao (Chưa xử lý / Hoàn thành / Quá hạn), như my-tasks.',
        'Cột theo my-task-columns: <b>Mã nhiệm vụ</b> (nhiệm vụ KHCN) thay bằng <b>Mã ĐXMS / KĐT</b> — mã đối tượng cha của hồ sơ (ĐXMS — D-10, hoặc Khoản đầu tư — D-12), như nhiệm vụ KHCN; <b>Cấp</b> thay bằng <b>Mức ưu tiên</b> (KĐT không có trường này → "-"). Loại hồ sơ: Phê duyệt ĐXMS / Điều chỉnh ĐXMS / Phê duyệt KĐT. Không có cột Thao tác: bấm dòng hoặc mã hồ sơ để mở màn xử lý việc.',
        'Việc của hồ sơ KĐT: Quy trình = mã nhóm KĐT (MS13 / MS14), "Chưa xác định nhóm" trước khi TTMS xác nhận 04 yếu tố (D-7); việc đã xử lý mở Chi tiết hồ sơ KĐT.',
        'Việc Chưa xử lý / Quá hạn chỉ có trên hồ sơ đang chạy luồng; hồ sơ mẫu chỉ có việc Hoàn thành, mở ra chi tiết hồ sơ ở chế độ xem.',
        'Hạn xử lý tính theo định mức ngày làm việc của từng bước; quá hạn khi hạn trước ngày hiện tại của luồng.',
        'Không có nút Thêm mới (my-tasks không có): tạo ĐXMS ở Danh sách ĐXMS, tạo hồ sơ ở Chỉnh sửa ĐXMS hoặc Hồ sơ ĐXMS.',
      ],
      q: D.screenQ['SCR-01'], src: 'my-tasks/my-tasks.component · /my-tasks',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách việc của tôi', lg: true, info })}
      <div class="vcard pad24">
        <div class="pg-head"><span></span><div class="r">
          ${M.adv ? '' : `<label class="vsearch" style="width:320px">${icon('search')}<input id="my-kw" maxlength="255" placeholder="Tìm kiếm theo tên công việc, mã hồ sơ, mã ĐXMS / KĐT" value="${esc(M.kw)}"></label>`}
          <button class="vbtn ${M.adv ? 'active' : 'secondary'}" data-m="adv">${M.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${M.adv ? taskAdvPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'my', total: rows.length, page: M.page, size: M.size, open: M.psOpen })}
      </div></div>`;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    const pg = t.closest('[data-pager="my"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) M.page = Number(b.dataset.pg);
      else if (s) { M.size = Number(s.dataset.ps); M.page = 1; M.psOpen = false; } else if (t.closest('[data-ps-open]')) M.psOpen = !M.psOpen;
      else return;
      rerender(); return;
    }
    if (M.psOpen) { M.psOpen = false; rerender(); }
    const m = t.closest('[data-m]');
    if (!m) return;
    if (m.dataset.m === 'adv') { M.adv = !M.adv; M.d = JSON.parse(JSON.stringify(M.f)); M.page = 1; }
    if (m.dataset.m === 'reset') { M.d = emptyTaskFilter(); M.f = emptyTaskFilter(); M.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-madv]')) return;
    e.preventDefault();
    M.f = JSON.parse(JSON.stringify(M.d)); M.page = 1; rerender();
  });
  document.addEventListener('input', (e) => { const f = e.target.closest('[data-mf]'); if (f) M.d[f.dataset.mf] = f.value; });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'my-kw') return;
    M.kw = e.target.value.trim(); M.page = 1; rerender();
    const k = document.getElementById('my-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- Hồ sơ: trạng thái theo từ vựng source (B8) ---------- */
  const CASE_STATUS = {
    processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'],
    moved: ['Đã chuyển quy trình', 'warning'], stopped: ['Dừng xử lý', 'default'],
  };
  const stBadge = (st) => badge(CASE_STATUS[st][0], CASE_STATUS[st][1]);
  const caseHref = (c) => (c.live ? 'ho-so' : 'ho-so-dxms/' + encodeURIComponent(c.code));
  const UNITS = [...new Set([D.caseInfo.unit].concat(D.dxmsList.map((c) => c.unit)))];
  const PRIORITIES = ['Thường', 'Khẩn', 'Thượng khẩn'];
  const PROC_CODES = Object.keys(D.processes).concat(Object.keys(D.adjProcesses));
  const procLabel = (flow) => `${flow} — ${D.procName(flow)}`;
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" ${attrs}>${icon(ic)}</button>`;
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;

  /* Bước người dùng của quy trình MS02 (trang MS02 ver1.1) theo số task — hồ sơ Điều chỉnh hiện Quy trình / Lịch sử từ đây. */
  /* Bước người dùng theo số task của một trang sơ đồ (MS02 ver1.1, MS14) — dùng cho hồ sơ có quy trình chưa chạy luồng. */
  const diagTasks = {};
  function diagramTasks(page) {
    if (diagTasks[page]) return diagTasks[page];
    const g = (window.BPMN_DIAGRAMS || {})[page];
    const seen = new Set();
    return (diagTasks[page] = (g ? g.nodes : []).filter((n) => n.k === 'task' && n.el && n.el.type === 'userTask' && /^\d+$/.test(String(n.t)))
      .map((n) => ({ n: Number(n.t), name: n.el.name, actor: n.el.actor }))
      .sort((a, b) => a.n - b.n).filter((x) => !seen.has(x.n) && seen.add(x.n)));
  }
  const ms02Tasks = () => diagramTasks(D.adjProcesses.MS02.page);

  /* Hồ sơ + thông tin ĐXMS cha (đơn vị, mức ưu tiên, mật) — các trường này thuộc ĐXMS (D-10). */
  function withDxms(c) {
    const x = Flow.findDxms(c.dxms) || {};
    let step = c.step || '';
    if (!step && c.st === 'processing' && c.kind === 'DC') { const t = ms02Tasks().find((k) => k.n >= (c.task || 1)); step = t ? t.name : ''; }
    return Object.assign({}, c, { unit: x.unit || '', priority: x.priority || '', secret: !!x.secret, dxmsTitle: x.title || '', step });
  }

  /* Hồ sơ đang chạy luồng + hồ sơ đã chuyển quy trình + hồ sơ Điều chỉnh tạo trên prototype + dữ liệu mẫu. */
  function allCases() {
    const ci = Flow.ci(), st = Flow.state.status, creator = persona('minh').name;
    /* Hồ sơ KĐT đang chạy thuộc danh sách hồ sơ của KĐT (kdt.js), không thuộc Hồ sơ ĐXMS. */
    const live = st === 'new' || Flow.state.kdt ? [] : [{
      code: ci.code, dxms: ci.dxms, kind: ci.kind, title: ci.name, total: ci.total, flow: ci.flow, creator, live: true, reason: ci.reason || undefined,
      from: ci.from || undefined, before: ci.before != null ? ci.before : undefined,
      st: { running: 'processing', approved: 'done', moved: 'moved', stopped: 'stopped' }[st],
      step: st === 'running' ? [...new Set(Flow.state.tokens.map((t) => Flow.taskName(t.task)))].join(', ') : '',
      created: Flow.dateOf(0), updated: Flow.dateOf(Flow.state.clock), replaces: Flow.state.replaces,
      replacedBy: Flow.state.movedTo ? Flow.state.movedTo.code : null,
    }];
    const archived = (Flow.state.archived || []).map((c) => Object.assign({}, c, { creator, st: 'moved', step: '', created: Flow.dateOf(0) }));
    return live.concat(archived, (Flow.state.adj || []).map((c) => Object.assign({ proto: true }, c)), D.otherCases).map(withDxms);
  }

  /* ---------- ĐXMS: trạng thái (R5), giá trị hiệu lực (R4), loại hồ sơ tạo được (R1–R3) ---------- */
  const DXMS_STATUS = { NEW: ['Chưa có hồ sơ', 'default'], PD: ['Đang phê duyệt', 'info'], OK: ['Đã phê duyệt', 'success'], DC: ['Đang điều chỉnh', 'warning'], STOP: ['Dừng xử lý', 'default'] };
  const toTime = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d).getTime(); };
  function dxmsMeta(x, cases) {
    const hs = cases.filter((c) => c.dxms === x.code);
    /* Sau 10b hồ sơ thay thế đã được tạo (việc đầu tiên nằm ở Việc của tôi) dù chưa mở — ĐXMS vẫn đang phê duyệt. */
    const pending = hs.some((c) => c.st === 'moved' && c.replacedBy && !hs.some((o) => o.code === c.replacedBy));
    const run = hs.find((c) => c.st === 'processing') || (pending ? { kind: 'PD' } : null);
    /* Hồ sơ tạo trên prototype (đang chạy, giữ lại — mới nhất trước) mới hơn hồ sơ mẫu; hồ sơ mẫu theo ngày cập nhật. */
    const done = hs.filter((c) => c.st === 'done' && (c.live || c.proto)).concat(hs.filter((c) => c.st === 'done' && !c.live && !c.proto).sort((a, b) => toTime(b.updated) - toTime(a.updated)));
    const state = run ? (run.kind === 'DC' ? 'DC' : 'PD') : done.length ? 'OK' : hs.some((c) => c.st === 'stopped') ? 'STOP' : 'NEW';
    /* D-40 (P-102): giá trị hiệu lực = giá trị hồ sơ Hoàn thành gần nhất (sau điều chỉnh); số lần điều chỉnh = hồ sơ Điều chỉnh đã hoàn thành. */
    return { hs, state, value: done.length ? done[0].total : x.est, approved: done.some((c) => c.kind === 'PD'), adjN: done.filter((c) => c.kind === 'DC').length };
  }
  const dxmsBadge = (s, n) => badge(DXMS_STATUS[s][0] + (s === 'OK' && n ? ` (điều chỉnh lần ${n})` : ''), DXMS_STATUS[s][1]);
  /* Lý do không tạo được hồ sơ loại `kind` cho ĐXMS, hoặc null. */
  function kindBlock(code, kind) {
    const x = Flow.findDxms(code);
    if (!x) return null;
    const m = dxmsMeta(x, allCases());
    if (m.state === 'PD' || m.state === 'DC') return 'ĐXMS đang có hồ sơ đang xử lý.';
    if (kind === 'PD' && m.approved) return 'ĐXMS đã được phê duyệt. Chọn loại hồ sơ Điều chỉnh ĐXMS.';
    if (kind === 'DC' && !m.approved) return 'ĐXMS chưa được phê duyệt nên chưa tạo được hồ sơ điều chỉnh.';
    return null;
  }

  /* ---------- T29 S5 — trường theo HT-DXMS-NOTE ("TTr" = ĐXMS; plan T29 §3.9, D-59) ---------- */
  /* F6 Đợt: ĐXMS lưu `dot`; ĐXMS mẫu chưa có thì là số thứ tự theo ngày tạo trong cùng nhiệm vụ / đề tài, dự án (GIẢ LẬP P-192). */
  function dotOf(x) {
    if (x.dot != null && x.dot !== '') return Number(x.dot);
    if (!x.nv) return null;
    const same = Flow.dxmsAll().filter((o) => o.nv === x.nv).sort((a, b) => toTime(a.created) - toTime(b.created) || a.code.localeCompare(b.code));
    return same.findIndex((o) => o.code === x.code) + 1 || null;
  }
  /* Đợt gợi ý khi tạo ĐXMS mới: số ĐXMS hiện có của nhiệm vụ / đề tài, dự án + 1. */
  const nvText = (code) => (D.nvOf(code) ? `${code} — ${D.nvOf(code).name}` : code || '');
  const nextDot = (nv) => (nv ? String(Flow.dxmsAll().filter((o) => o.nv === nv).length + 1) : '');
  const creators = () => [...new Set(Flow.dxmsAll().map((x) => x.creator).concat(D.otherCases.map((c) => c.creator)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
  /* F1: Đơn vị đề xuất hiển thị theo Khối đã chọn (GIẢ LẬP P-190). */
  const unitsOf = (block) => UNITS.filter((u) => !block || D.blockOf(u) === block);
  const RV_TONE = { 'Chưa xem': 'default', 'Đang xem': 'info', 'Đã đồng ý': 'success', 'Yêu cầu sửa': 'warning' };
  const RV_ST = Object.keys(RV_TONE);
  /* Số ngày làm việc (T2–T6) từ a tới b (dd/MM/yyyy). */
  function workDays(a, b) {
    let n = 0;
    for (let d = new Date(toTime(a)); d.getTime() < toTime(b); d.setDate(d.getDate() + 1)) if (d.getDay() % 6) n += 1;
    return n;
  }
  const addDays = (s, k) => { const d = new Date(toTime(s)); d.setDate(d.getDate() + k); return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  /* F8: tình trạng thẩm định của từng CQCM (GIẢ LẬP P-191). Hồ sơ đang chạy: EVars theo việc 18–20; hồ sơ mẫu Phê duyệt đã qua bước 19:
     hai CQCM mặc định, ngày lấy theo ngày tạo / ngày cập nhật. */
  function reviewOf(c) {
    if (!c || c.kind === 'DC') return [];
    if (c.live) return window.EVars.h.reviewRows();
    if (!(c.st === 'done' || (c.st === 'processing' && (c.task || 0) >= 19))) return [];
    const span = Math.max(4, workDays(c.created, c.updated)), sent = addDays(c.created, Math.round(span * 0.6));
    const open = c.st === 'processing' && c.task < 26;
    return ['PC', 'TC'].map((id, i) => {
      const q = D.cqcm.find((x) => x.id === id), at = open && i ? null : addDays(sent, 3 + i * 2);
      const st = open && i ? 'Đang xem' : (Number(c.code.slice(-1)) + i) % 3 === 0 ? 'Yêu cầu sửa' : 'Đã đồng ý';
      return { id, unit: q.unit, who: persona(q.doer).name, st, sent, at, days: String(workDays(sent, at || c.updated)) };
    });
  }
  /* F5: Số, Ngày Tờ trình — cấp khi gửi yêu cầu thẩm định (GIẢ LẬP P-192). Ký hiệu đơn vị = chữ đầu các từ. */
  const unitSign = (u) => (u || '').split(/\s+/).map((w) => w[0]).join('').toUpperCase();
  function ttOf(c) {
    const rv = reviewOf(c);
    return rv.length ? { no: `${c.code.slice(-3)}/TTr-${unitSign(c.unit)}`, at: rv[0].sent } : null;
  }
  /* Tóm tắt ở Thông tin chung, bấm mở hộp thoại Tình trạng thẩm định (profile-detail giữ 4 card như source). */
  const reviewSum = (c) => { const r = reviewOf(c), ok = r.filter((x) => x.st === 'Đã đồng ý' || x.st === 'Yêu cầu sửa').length; return `${ok}/${r.length} CQCM đã có ý kiến`; };
  function reviewDialog(code) {
    const c = allCases().find((x) => x.code === code), rows = reviewOf(c);
    UI.vModal({ title: 'Tình trạng thẩm định', size: 'w780', body: `<div data-review-dlg>${docTable([['CQCM', 170], ['Người thẩm định', 160], ['Tình trạng', 130, 'c'], ['Ngày gửi', 110], ['Ngày thẩm định', 120], ['Số ngày xử lý', 110, 'r']], rows, (r) =>
      `<td>${esc(r.unit)}</td><td>${esc(r.who)}</td><td class="c">${badge(r.st, RV_TONE[r.st])}</td><td class="num">${esc(r.sent)}</td><td class="num">${r.at ? esc(r.at) : dash}</td><td class="r num">${esc(r.days)}</td>`)}</div>`,
    actions: '<button class="vbtn secondary" data-close>Đóng</button>' });
  }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-review]'); if (b) reviewDialog(b.dataset.review); });
  /* F9 Cập nhật người xem (HT-DXMS-NOTE màn 7; GIẢ LẬP P-189): người tạo thêm người dùng được xem ĐXMS và các hồ sơ của nó, chỉ xem.
     Thật: bảng quyền xem theo ĐXMS, BE cộng vào phạm vi xem BR-DXMS-01-09. */
  const viewerPool = () => D.personas.filter((p) => !p.all && !p.simulated);
  const viewersText = (x) => (x.viewers || []).map((id) => (D.personas.find((p) => p.id === id) || { name: id }).name).join(', ');
  function viewersDialog(code) {
    const x = Flow.findDxms(code);
    if (!x) return;
    let sel = (x.viewers || []).slice();
    const body = () => `<div class="stack" data-vw>
      <div class="vfield"><div class="lr"><label>Người được xem</label></div>${vSelect({ id: 'vw-users', multi: true, searchable: true, value: sel, placeholder: 'Chọn người dùng',
    options: viewerPool().map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` })), onChange: (v) => { sel = v; draw(); } })}</div>
      <p class="faint">Người được xem thấy ĐXMS, các hồ sơ và tài liệu của ĐXMS; không xử lý được công việc.</p></div>`;
    const m = UI.vModal({ title: 'Cập nhật người xem', size: 'w560', body: `<div data-vw-wrap>${body()}</div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="vw-ok">Lưu</button>' });
    function draw() { m.el.querySelector('[data-vw-wrap]').innerHTML = body(); }
    m.el.querySelector('#vw-ok').onclick = () => {
      Flow.updateDxms(code, { viewers: sel.slice() });
      m.close();
      UI.toast('<b>Thành công</b><br>Cập nhật người xem thành công!');
    };
  }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-viewers]'); if (b) viewersDialog(b.dataset.viewers); });
  /* F10: tải văn bản đầu ra dạng PDF bên cạnh tệp Word. */
  const dlPdf = (name) => iconBtn('file', 'Tải xuống PDF', `data-dl="${esc(String(name).replace(/\.(docx?|xlsx?|pdf)$/i, ''))}.pdf"`);

  /* ---------- SCR-02 Danh sách hồ sơ ĐXMS ---------- */
  const emptyFilter = () => ({ code: '', dxms: '', title: '', kind: [], block: null, unit: null, creator: null, secret: null, flow: [], st: [], priority: null,
    cqcm: [], rvSt: [], rvFrom: '', rvTo: '', ttFrom: '', ttTo: '' });
  /* kw: ô tìm kiếm; f: bộ lọc nâng cao đã áp; d: bộ lọc đang nhập. Hai kiểu tìm độc lập như profile-list. */
  const L = { kw: '', adv: false, f: emptyFilter(), d: emptyFilter(), page: 1, size: 10, psOpen: false };

  function filtered() {
    const n = window.UI.norm, f = L.f;
    return allCases().filter((c) => (!L.adv
      ? !L.kw || n(c.code + ' ' + c.dxms + ' ' + c.title).includes(n(L.kw))
      : (!f.code || n(c.code).includes(n(f.code))) && (!f.dxms || n(c.dxms).includes(n(f.dxms))) && (!f.title || n(c.title).includes(n(f.title)))
        && (!f.kind.length || f.kind.includes(c.kind)) && (!f.unit || c.unit === f.unit) && (!f.flow.length || f.flow.includes(c.flow))
        && (!f.st.length || f.st.includes(c.st)) && (!f.priority || c.priority === f.priority)
        && (!f.block || D.blockOf(c.unit) === f.block) && (!f.creator || c.creator === f.creator) && (!f.secret || (f.secret === 'Có') === !!c.secret)
        && advReview(c, f)));
  }
  /* F3, F5: lọc theo CQCM thẩm định, tình trạng, ngày thẩm định (cùng một CQCM thoả mọi điều kiện đã nhập), ngày Tờ trình. */
  function advReview(c, f) {
    if (f.cqcm.length || f.rvSt.length || f.rvFrom || f.rvTo) {
      const ok = reviewOf(c).some((r) => (!f.cqcm.length || f.cqcm.includes(r.id)) && (!f.rvSt.length || f.rvSt.includes(r.st))
        && (!f.rvFrom || (r.at && dk(r.at) >= dk(f.rvFrom))) && (!f.rvTo || (r.at && dk(r.at) <= dk(f.rvTo))));
      if (!ok) return false;
    }
    if (f.ttFrom || f.ttTo) {
      const t = ttOf(c);
      if (!t || (f.ttFrom && dk(t.at) < dk(f.ttFrom)) || (f.ttTo && dk(t.at) > dk(f.ttTo))) return false;
    }
    return true;
  }

  function advPanel() {
    const d = L.d;
    const set = (k) => (v) => { d[k] = v; rerender(); };
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-lf="${k}" maxlength="255" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'f-' + k, value: d[k], clear: true, searchable: true, onChange: set(k) }, o))}</div>`;
    const date = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-lf="${k}" maxlength="10" placeholder="DD/MM/YYYY" value="${esc(d[k])}"></div>`;
    return `<form class="adv" data-adv>
      <div class="grid3">
        ${txt('code', 'Mã hồ sơ')}${txt('dxms', 'Mã ĐXMS')}${txt('title', 'Tên hồ sơ')}
        ${sel('kind', 'Loại hồ sơ', { multi: true, searchable: false, options: Object.entries(D.kinds).map(([k, v]) => ({ value: k, label: v.label })) })}
        ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
    onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị đề xuất', { options: unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
        ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: creators().map((u) => ({ value: u, label: u })) })}
        ${sel('flow', 'Quy trình', { multi: true, options: PROC_CODES.map((k) => ({ value: k, label: k })) })}
        ${sel('st', 'Trạng thái', { multi: true, options: Object.entries(CASE_STATUS).map(([k, v]) => ({ value: k, label: v[0] })) })}
        ${sel('priority', 'Mức ưu tiên', { searchable: false, options: PRIORITIES.map((p) => ({ value: p, label: p })) })}
        ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
        ${sel('cqcm', 'Người thẩm định (CQCM)', { multi: true, placeholder: 'Chọn CQCM', options: D.cqcm.map((c) => ({ value: c.id, label: `${c.unit} — ${persona(c.doer).name}` })) })}
        ${sel('rvSt', 'Trạng thái với người thẩm định', { multi: true, searchable: false, placeholder: 'Tất cả', options: RV_ST.map((v) => ({ value: v, label: v })) })}
        ${date('rvFrom', 'Ngày thẩm định từ')}${date('rvTo', 'Ngày thẩm định đến')}
        ${date('ttFrom', 'Ngày Tờ trình từ')}${date('ttTo', 'Ngày Tờ trình đến')}
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-l="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  function profileList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
    //       + utils/profile-columns.utils.ts (bỏ Thao tác theo D-43 → Trạng thái → Mã hồ sơ → Mã nhiệm vụ → Tên hồ sơ → Loại hồ sơ → Cấp → Quy trình → Bước hiện tại → Ngày cập nhật)
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Trạng thái', 169, 'c'], ['Mã hồ sơ', 150], ['Mã ĐXMS', 160], ['Tên hồ sơ', 320], ['Loại hồ sơ', 150],
      ['Đơn vị đề xuất', 185], ['Tổng giá trị (tỷ đồng)', 169, 'r'], ['Mức ưu tiên', 130], ['Quy trình', 120], ['Bước hiện tại', 185],
      ['Số Tờ trình', 150], ['Ngày Tờ trình', 130], ['Ngày gửi thẩm định', 160], ['Người tạo', 170], ['Ngày cập nhật', 150]];
    const body = rows.slice(from, from + L.size).map((c, i) => {
      const tt = ttOf(c);
      return `<tr class="click" data-go="${caseHref(c)}" data-code="${esc(c.code)}">
        <td class="ord">${from + i + 1}</td><td class="c">${stBadge(c.st)}</td>
        <td><a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a></td><td>${esc(c.dxms)}</td><td>${clamp(c.title)}</td><td>${esc(kindLabel(c.kind))}</td>
        <td>${clamp(c.unit)}</td><td class="r num">${ty(c.total)}</td><td>${esc(c.priority)}</td><td>${esc(c.flow)}</td><td>${clamp(c.step)}</td>
        <td>${tt ? esc(tt.no) : dash}</td><td class="num">${tt ? esc(tt.at) : dash}</td><td class="num">${tt ? esc(tt.at) : dash}</td><td>${clamp(c.creator)}</td><td class="num">${esc(c.updated)}</td></tr>`;
    }).join('');
    const info = {
      scr: 'SCR-02', name: 'Danh sách hồ sơ ĐXMS', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20, UR-COM-01',
      notes: [
        'Hồ sơ là đối tượng con của ĐXMS (D-10, như hồ sơ KHCN thuộc một nhiệm vụ): cột <b>Mã nhiệm vụ</b> của source thay bằng <b>Mã ĐXMS</b>, <b>Cấp nhiệm vụ</b> thay bằng <b>Mức ưu tiên</b>; thêm Đơn vị đề xuất, Tổng giá trị (lấy từ ĐXMS / hồ sơ).',
        'Loại hồ sơ: <b>Phê duyệt ĐXMS</b> (MS01.01 / .02 / .03) hoặc <b>Điều chỉnh ĐXMS</b> (MS02). Thêm mới mở form tạo hồ sơ: chọn ĐXMS, Loại hồ sơ, Quy trình.',
        'Hồ sơ tạo bằng <b>Thêm mới</b> chạy luồng — Phê duyệt (MS01.0x) và Điều chỉnh (MS02, T21); các hồ sơ khác là dữ liệu mẫu, mở ra ở chế độ xem.',
        'Không có cột Thao tác (D-43, team BA 30/10/2026: danh sách chưa có thao tác trên dòng). Xử lý việc mở từ Việc của tôi; không có Xoá vì hồ sơ không có trạng thái Dự thảo (Lưu là khởi tạo).',
        'Trạng thái theo từ vựng source (Đang xử lý / Hoàn thành) + trạng thái riêng ĐTMS: Đã chuyển quy trình, Dừng xử lý.',
        '<b>T29 — trường theo màn Soạn thảo TTr / Thẩm định TTr của hệ thống cũ</b> (HT-DXMS-NOTE màn 6, 7, 9; "TTr" = ĐXMS): Tìm kiếm nâng cao thêm Khối đơn vị (Đơn vị đề xuất hiện theo khối), Người tạo, Mật, Người thẩm định (CQCM), Trạng thái với người thẩm định, Ngày thẩm định, Ngày Tờ trình; bảng thêm Số / Ngày Tờ trình, Ngày gửi thẩm định, Người tạo. SRS-DXMS chưa có các trường này (D-59: bổ sung SRS sau).',
        'Ánh xạ hệ thống cũ: Loại biểu mẫu TTr → Quy trình; 12 Trạng thái TTr → Trạng thái + Bước hiện tại; Kinh phí đề xuất → Tổng giá trị. Thật: BE thêm tham số lọc cho API danh sách hồ sơ; tình trạng CQCM suy từ việc Camunda của bước 18–20 (GIẢ LẬP P-191); Số, Ngày Tờ trình theo P-192; Khối theo P-190.',
      ],
      q: ['P-190', 'P-191', 'P-192'], src: 'profile-management/profile-list · /khcn-profile-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách hồ sơ ĐXMS', info, right: createBtn('hs') })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="hs-kw" maxlength="255" placeholder="Tìm kiếm theo mã hồ sơ, mã ĐXMS, tên hồ sơ" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-l="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'hs', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    const pg = t.closest('[data-pager="hs"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (L.psOpen) { L.psOpen = false; rerender(); }
    const l = t.closest('[data-l]');
    if (!l) return;
    if (l.dataset.l === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
    if (l.dataset.l === 'reset') { L.d = emptyFilter(); L.f = emptyFilter(); L.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-adv]')) return;
    e.preventDefault();
    L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest('[data-lf]');
    if (f) L.d[f.dataset.lf] = f.value;
    if (e.target.id === 'c-name') { C.name = e.target.value; C.touched = true; }
    const x = e.target.closest('[data-xf]');
    if (x) XF.v[x.dataset.xf] = x.value;
  });
  /* Comment #12: đổi Tên / Mục đích của ĐXMS Mật → đánh giá lại khối AI kiểm tra quy tắc bảo mật. */
  document.addEventListener('change', (e) => {
    const card = e.target.closest('[data-xf]') && document.querySelector('[data-sec-check]');
    if (card) card.outerHTML = secCheckCard(XF.v);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !['hs-kw', 'dxms-kw'].includes(e.target.id)) return;
    const id = e.target.id;
    if (id === 'hs-kw') { L.kw = e.target.value.trim(); L.page = 1; } else { X.kw = e.target.value.trim(); X.page = 1; }
    rerender();
    const k = document.getElementById(id);
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-25 Thêm mới hồ sơ — trang #/ho-so-dxms/create[/<mã ĐXMS>] ---------- */
  /* lock: mở từ ĐXMS (nút Tạo hồ sơ) → ô ĐXMS khoá như route create/:taskId của source. touched: người dùng đã sửa Tên hồ sơ. */
  const C = { dxms: null, lock: false, kind: null, proc: null, name: '', touched: false, err: {} };
  function resetCreate(dxms) {
    Object.assign(C, { dxms: dxms || null, lock: !!dxms, kind: null, proc: null, name: '', touched: false, err: {} });
    autoKind(); autoName();
  }
  /* Chỉ một loại hồ sơ tạo được → chọn sẵn; loại chỉ có một quy trình → chọn sẵn quy trình. */
  function pickKind(k) { C.kind = k; const ps = k ? D.kinds[k].procs : []; C.proc = ps.length === 1 ? ps[0] : null; }
  function autoKind() {
    if (!C.dxms || C.kind) return;
    const ok = Object.keys(D.kinds).filter((k) => !kindBlock(C.dxms, k));
    if (ok.length === 1) pickKind(ok[0]);
  }
  function autoName() {
    if (C.touched) return;
    const x = C.dxms && Flow.findDxms(C.dxms);
    if (!x) { C.name = ''; return; }
    const n = allCases().filter((c) => c.dxms === x.code && c.kind === 'DC').length + 1;
    C.name = C.kind === 'DC' ? `Điều chỉnh lần ${n} — ${x.title}` : x.title;
  }

  function profileCreate() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-form/profile-form.component.html (mode create; route create/:taskId khoá ô Nhiệm vụ)
    const back = C.lock ? `dxms/${encodeURIComponent(C.dxms)}/edit` : 'ho-so-dxms';
    const upd = (fn) => (v) => { fn(v); rerender(); };
    const procOpts = C.kind ? D.kinds[C.kind].procs.map((k) => ({ value: k, disabled: !!(D.processes[k] || {}).pending,
      label: C.kind === 'PD' ? `${k} · ${D.procCond(k, D.dxmsRules())}` : `${k} · ${D.procName(k)}` })) : [];
    const info = {
      scr: 'SCR-25', name: 'Thêm mới hồ sơ', uc: 'UC-07-01, UC-07-12 · UR-DX-01, 02, UR-DX-20', bpmn: 'Ngoài BPMN — trước task 01',
      notes: [
        'Theo profile-form của KHCN: hồ sơ thuộc một <b>ĐXMS</b> (thay trường Nhiệm vụ), có <b>Loại hồ sơ</b> và <b>Quy trình</b> (D-10). Mở từ nút Tạo hồ sơ của ĐXMS thì ô ĐXMS khoá.',
        'Loại <b>Phê duyệt ĐXMS</b> → MS01.01 / .02 / .03; loại <b>Điều chỉnh ĐXMS</b> → MS02. Chỉ một loại tạo được thì chọn sẵn; loại chỉ có một quy trình thì chọn sẵn quy trình.',
        'Luật: một ĐXMS chỉ có một hồ sơ đang xử lý (R1); Phê duyệt khi ĐXMS chưa được phê duyệt (R2); Điều chỉnh khi ĐXMS đã được phê duyệt (R3). Không thoả thì báo dưới ô Loại hồ sơ.',
        '<b>Lưu = khởi tạo quy trình ngay</b>: hệ thống sinh mã hồ sơ, bước đầu tiên giao cho người tạo. Không có bản nháp. Sau khi lưu không đổi được quy trình; hồ sơ không khớp quy trình được phát hiện ở task 01 và sau báo giá (task 10 → nhánh 10a/10b).',
        'Mã hồ sơ do hệ thống tự sinh (source KHCN cho nhập tay) nên ô chỉ đọc. Tên hồ sơ gợi ý theo ĐXMS và loại hồ sơ, sửa được.',
        'Khoảng giá trị trong nhãn của từng quy trình lấy từ Ngưỡng phân luồng (Danh mục dùng chung), các ngưỡng đang hoạt động và đã có hiệu lực. Hồ sơ giữ ngưỡng tại lúc Lưu (P-34).',
        'Hồ sơ mẫu chạy luồng: ĐXMS-2026-0117 (MS01.01), ĐXMS-2026-0124 (MS01.02, căn cứ PAKD đã được TGĐ Tập đoàn duyệt), ĐXMS-2026-0098 (MS01.03, 45,20 tỷ). Hồ sơ Điều chỉnh (MS02, D-36): Lưu khởi tạo luồng MS02, bước 1 giao người tạo; giá trị trước điều chỉnh = giá trị hiệu lực của ĐXMS, luồng con MS02.01 / .02 / .03 theo giá trị sau điều chỉnh và căn cứ của ĐXMS cũ (D-39).',
        'Prototype chạy luồng cho một hồ sơ: Lưu khi đang có hồ sơ chạy luồng sẽ thay hồ sơ đó (hồ sơ Điều chỉnh, và hồ sơ đã hoàn thành khi tạo Điều chỉnh, được giữ ở danh sách, mở chế độ xem); ý kiến ❓ được giữ.',
      ],
      q: ['P-26', 'P-34', 'P-63', 'P-64', 'P-100', 'P-106'], src: 'profile-management/profile-form (mode create) · /khcn-profile-management/create/:taskId',
    };
    return `<form class="pg" data-create-form>
      ${head({ title: 'Thêm mới hồ sơ', back, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="c-save">Lưu</button>` })}
      <section class="vcard"><h2>Thông tin chung</h2>
        <div class="grid3">
          ${field('Mã hồ sơ', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên hồ sơ', `<input class="vctl" id="c-name" maxlength="500" placeholder="Nhập tên hồ sơ" value="${esc(C.name)}" ${C.err.name ? 'aria-invalid="true"' : ''}>`, { req: true, err: C.err.name, cls: 'span2' })}
          ${field('Loại hồ sơ', vSelect({ id: 'c-kind', value: C.kind, placeholder: 'Chọn loại hồ sơ', invalid: !!C.err.kind,
    options: Object.entries(D.kinds).map(([k, v]) => ({ value: k, label: v.label })),
    onChange: upd((v) => { pickKind(v); delete C.err.kind; delete C.err.proc; autoName(); }) }), { req: true, err: C.err.kind })}
          ${field('Quy trình', vSelect({ id: 'c-proc', value: C.proc, searchable: true, placeholder: 'Chọn quy trình', invalid: !!C.err.proc, disabled: !C.kind, options: procOpts,
    onChange: upd((v) => { C.proc = v; delete C.err.proc; }) }), { req: true, err: C.err.proc })}
          ${field('ĐXMS', vSelect({ id: 'c-dxms', value: C.dxms, searchable: true, placeholder: 'Chọn ĐXMS', invalid: !!C.err.dxms, disabled: C.lock,
    options: Flow.dxmsAll().map((x) => ({ value: x.code, label: `${x.code} - ${x.title}` })),
    onChange: upd((v) => { C.dxms = v; C.kind = null; C.proc = null; delete C.err.dxms; delete C.err.kind; autoKind(); autoName(); }) }), { req: true, err: C.err.dxms })}
          ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section></form>`;
  }

  function saveCreate() {
    const t = document.getElementById('c-name');
    if (t) C.name = t.value;
    C.err = {};
    if (!C.name.trim()) C.err.name = 'Bạn cần nhập Tên hồ sơ.';
    if (!C.dxms) C.err.dxms = 'Bạn cần chọn ĐXMS.';
    if (!C.kind) C.err.kind = 'Bạn cần chọn Loại hồ sơ.';
    else if (C.dxms && kindBlock(C.dxms, C.kind)) C.err.kind = kindBlock(C.dxms, C.kind);
    if (!C.proc) C.err.proc = 'Bạn cần chọn Quy trình.';
    if (Object.keys(C.err).length) { rerender(); return; }
    /* Hồ sơ Điều chỉnh (T21 D-36): start MS02, giá trị trước điều chỉnh = giá trị hiệu lực của ĐXMS (R4). */
    if (C.kind === 'DC') Flow.createAdj({ dxms: C.dxms, name: C.name.trim(), before: dxmsMeta(Flow.findDxms(C.dxms), allCases()).value });
    else Flow.create(C.proc, { dxms: C.dxms, name: C.name.trim() });
    const tok = Flow.state.tokens.find((k) => k.task === 1);
    window.UI.toast('Thêm mới thành công');
    location.hash = `#/task/${tok.id}`;
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-create-form]')) { e.preventDefault(); saveCreate(); } });

  /* ---------- SCR-27 Danh sách ĐXMS ---------- */
  /* Tìm kiếm nâng cao (Backlog ĐXMS › Tìm kiếm nâng cao, T16 B1): f = đã áp, d = đang nhập; hai kiểu tìm độc lập như profile-list. */
  const emptyDx = () => ({ code: '', title: '', nv: null, block: null, unit: null, creator: null, secret: null, st: [], priority: null, from: '', to: '' });
  const X = { kw: '', adv: false, f: emptyDx(), d: emptyDx(), page: 1, size: 10, psOpen: false };
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  function dxmsRows() {
    const cases = allCases(), n = window.UI.norm, f = X.f;
    return Flow.dxmsAll().map((x) => Object.assign({}, x, dxmsMeta(x, cases)))
      .filter((x) => (!X.adv ? !X.kw || n(x.code + ' ' + x.title).includes(n(X.kw))
        : (!f.code || n(x.code).includes(n(f.code))) && (!f.title || n(x.title).includes(n(f.title))) && (!f.nv || x.nv === f.nv) && (!f.unit || x.unit === f.unit)
          && (!f.st.length || f.st.includes(x.state)) && (!f.priority || x.priority === f.priority)
          && (!f.from || dk(x.created) >= dk(f.from)) && (!f.to || dk(x.created) <= dk(f.to))
          && (!f.block || D.blockOf(x.unit) === f.block) && (!f.creator || x.creator === f.creator) && (!f.secret || (f.secret === 'Có') === !!x.secret)));
  }
  function dxmsAdv() {
    const d = X.d;
    const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-xlf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'xf-' + k, value: d[k], clear: true, searchable: true, onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
    return `<form class="adv" data-xadv><div class="grid3">
        ${txt('code', 'Mã ĐXMS', 'Nhập mã ĐXMS')}${txt('title', 'Tên ĐXMS', 'Nhập tên ĐXMS')}
        ${sel('nv', 'Đề tài / dự án', { placeholder: 'Chọn đề tài / dự án', options: D.nhiemVu.map((v) => ({ value: v.code, label: `${v.code} — ${v.name}` })) })}
        ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
    onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị đề xuất', { placeholder: 'Chọn đơn vị đề xuất', options: unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
        ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: creators().map((u) => ({ value: u, label: u })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, placeholder: 'Tất cả trạng thái', options: Object.entries(DXMS_STATUS).map(([value, [label]]) => ({ value, label })) })}
        ${sel('priority', 'Mức ưu tiên', { searchable: false, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })) })}
        ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
        ${txt('from', 'Ngày tạo từ', 'DD/MM/YYYY')}${txt('to', 'Ngày tạo đến', 'DD/MM/YYYY')}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-xl="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  const dxmsHref = (code) => 'dxms/' + encodeURIComponent(code);

  function dxmsList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html
    //       + utils/task-management-columns.utils.ts (Thao tác 100 → Mã → Tên → Cấp → Ngày cập nhật)
    const rows = dxmsRows();
    const pages = Math.max(1, Math.ceil(rows.length / X.size));
    if (X.page > pages) X.page = pages;
    const from = (X.page - 1) * X.size;
    const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Mã ĐXMS', 170], ['Tên ĐXMS', 340], ['Đề tài / dự án', 260], ['Đợt', 70, 'c'], ['Đơn vị đề xuất', 200],
      ['Giá trị hiệu lực (tỷ đồng)', 180, 'r'], ['Mức ưu tiên', 130], ['Người tạo', 170], ['Ngày cập nhật', 140]];
    const body = rows.slice(from, from + X.size).map((x, i) => `<tr class="click" data-go="${dxmsHref(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-go="${dxmsHref(x.code)}/edit"`)}${x.state === 'NEW' ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-del-dxms="${esc(x.code)}"`)}` : ''}</div></td>
        <td class="c">${dxmsBadge(x.state, x.adjN)}</td><td><a class="link" data-go="${dxmsHref(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
        <td>${clamp(nvText(x.nv))}</td><td class="c">${dotOf(x) || dash}</td><td>${clamp(x.unit)}</td>
        <td class="r num">${x.value != null ? ty(x.value) : dash}</td><td>${esc(x.priority)}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-27', name: 'Danh sách ĐXMS', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20',
      notes: [
        '<b>ĐXMS là đối tượng cha</b> (D-10), tương đương nhiệm vụ KHCN; mỗi ĐXMS có nhiều hồ sơ: một hồ sơ Phê duyệt (MS01) và các hồ sơ Điều chỉnh (MS02). Bố cục theo task-management, Thêm mới trên hàng tiêu đề.',
        'Tìm kiếm nâng cao (Backlog W1_T10, T16 B1 — task-management chưa có, dựng theo panel của profile-list): Mã, Tên, Nhiệm vụ / Đề tài, Đơn vị đề xuất, Trạng thái, Mức ưu tiên, Ngày tạo từ / đến. Mở panel thì ẩn ô tìm kiếm (B5). BE thêm tham số lọc cho API danh sách ĐXMS.',
        'Thêm mới chỉ tạo ĐXMS, <b>không khởi tạo quy trình</b> (D-11). Hồ sơ tạo ở Chỉnh sửa ĐXMS › Danh sách hồ sơ › Tạo hồ sơ (như source), hoặc ở Hồ sơ ĐXMS › Thêm mới.',
        'Trạng thái ĐXMS suy từ hồ sơ (R5): Chưa có hồ sơ → Đang phê duyệt → Đã phê duyệt → Đang điều chỉnh. Giá trị hiệu lực = giá trị hồ sơ Hoàn thành gần nhất, chưa có thì là giá trị dự kiến (R4, P-66).',
        'Cột Thao tác: Sửa mở Chỉnh sửa ĐXMS; <b>Xoá</b> chỉ hiện khi ĐXMS chưa có hồ sơ (R6). Source có thêm cột Cấp nhiệm vụ → thay bằng Mức ưu tiên; thêm Trạng thái, Đơn vị đề xuất, Giá trị hiệu lực.',
        '<b>T29 — trường theo màn Soạn thảo TTr của hệ thống cũ</b> (HT-DXMS-NOTE màn 6, 7; "TTr" = ĐXMS): Tìm kiếm nâng cao thêm Khối đơn vị (Đơn vị đề xuất hiện theo khối — GIẢ LẬP P-190), Người tạo, Mật; bảng thêm Đề tài / dự án, Đợt (P-192), Người tạo. SRS-DXMS chưa có (D-59).',
      ],
      q: ['P-65', 'P-66', 'P-190', 'P-192'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách ĐXMS', info, right: createBtn('dxms') })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${X.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="dxms-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên ĐXMS" value="${esc(X.kw)}"></label>`}
          <button class="vbtn ${X.adv ? 'active' : 'secondary'}" data-xl="adv">${X.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${X.adv ? dxmsAdv() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'dx', total: rows.length, page: X.page, size: X.size, open: X.psOpen })}
      </div></div>`;
  }

  document.addEventListener('click', async (e) => {
    const t = e.target;
    const pg = t.closest('[data-pager="dx"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) X.page = Number(b.dataset.pg);
      else if (s) { X.size = Number(s.dataset.ps); X.page = 1; X.psOpen = false; } else if (t.closest('[data-ps-open]')) X.psOpen = !X.psOpen;
      else return;
      rerender(); return;
    }
    if (X.psOpen) { X.psOpen = false; rerender(); }
    const xl = t.closest('[data-xl]');
    if (xl) {
      if (xl.dataset.xl === 'adv') { X.adv = !X.adv; X.d = JSON.parse(JSON.stringify(X.f)); X.page = 1; }
      if (xl.dataset.xl === 'reset') { X.d = emptyDx(); X.f = emptyDx(); X.page = 1; }
      rerender(); return;
    }
    const del = t.closest('[data-del-dxms]');
    if (!del) return;
    /* Nút nằm trong dòng có data-go: chặn listener mở chi tiết của app.js (đăng ký sau). */
    e.stopImmediatePropagation();
    const x = Flow.findDxms(del.dataset.delDxms);
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa ĐXMS', desc: `Bạn có chắc chắn muốn xóa ĐXMS ${x.title} - ${x.code} không? Thao tác này không thể hoàn tác.`,
      hl: x.title, cancel: 'Hủy', ok: 'Xóa' });
    if (!yes) return;
    Flow.deleteDxms(x.code);
    window.UI.toast('<b>Thành công</b><br>Xóa ĐXMS thành công');
  });

  /* ---------- SCR-28 Thêm mới / Chỉnh sửa ĐXMS ---------- */
  const XF = { mode: 'create', code: null, v: {}, err: {} };
  const tyIn = (n) => (n == null || n === '' ? '' : String(n).replace('.', ','));
  function resetDxmsForm(mode, code) {
    const x = code && Flow.findDxms(code);
    const u = persona(Flow.state.persona).unit;
    Object.assign(XF, { mode, code: code || null, err: {} });
    XF.v = x ? { title: x.title, nv: x.nv || null, unit: x.unit, priority: x.priority, est: tyIn(x.est), period: x.period || '', secret: x.secret ? 'Có' : 'Không', purpose: x.purpose || '', dot: String(dotOf(x) || '') }
      : { title: '', nv: null, unit: UNITS.includes(u) ? u : null, priority: 'Thường', est: '', period: '', secret: 'Không', purpose: '', dot: '' };
    XF.dotTouched = !!x;
  }

  function dxmsForm() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create / edit)
    const edit = XF.mode === 'edit', x = edit && Flow.findDxms(XF.code);
    if (edit && !x) return notFound('Chỉnh sửa ĐXMS');
    const v = XF.v, err = XF.err, back = edit ? dxmsHref(XF.code) : 'dxms';
    const upd = (k) => (val) => { v[k] = val; delete err[k]; rerender(); };
    const txt = (k, ph, o) => `<input class="vctl" data-xf="${k}" id="x-${k}" maxlength="${(o && o.max) || 255}" placeholder="${ph}" value="${esc(v[k])}" ${err[k] ? 'aria-invalid="true"' : ''}>`;
    const info = {
      scr: 'SCR-28', name: edit ? 'Chỉnh sửa ĐXMS' : 'Thêm mới ĐXMS', uc: 'UC-07-01 · UR-DX-01, UR-COM-05, 06',
      notes: [
        'Theo task-create (mode create / edit) của Quản lý nhiệm vụ KHCN: card "Thông tin chung nhiệm vụ" → <b>Thông tin chung ĐXMS</b>. Bỏ card Chủ nhiệm đề tài và hai bảng nhân sự của KHCN — người xử lý ĐTMS được chọn trong từng hồ sơ (CQCM ở task 16, người ký theo ma trận).',
        'Lưu chỉ tạo/cập nhật ĐXMS, <b>không khởi tạo quy trình</b> (D-11); về Danh sách ĐXMS như source. Mã ĐXMS tự sinh.',
        'Giá trị dự kiến là giá trị ban đầu; giá trị hiệu lực lấy từ hồ sơ Hoàn thành gần nhất và không sửa tay (R4).',
        'Comment Figma #1: ĐXMS bắt buộc chọn từ một <b>nhiệm vụ / đề tài, dự án</b> đã phê duyệt (nhiệm vụ KHCN, dự án SXKD hoặc kế hoạch mua sắm thường xuyên năm). BE nạp danh sách; loại của mục chọn quyết định nguồn đối soát ở task 08 (MBOM + dự toán hoặc KHN). Cần thêm trường vào ĐXMS (FE + BE).',
        'Comment Figma #12 (Gợi ý AI, D-20): Mật = Có → khối "AI kiểm tra quy tắc bảo mật". Service AI chạy khi Lưu với Tên, Mục đích, Đơn vị; kết quả chỉ xem, không chặn Lưu (S5). Prototype đánh giá ngay khi nhập, theo 4 quy tắc mẫu.',
        '<b>T29 — Đợt mua sắm</b> (HT-DXMS-NOTE màn 8 "V/v đề xuất mua sắm; Đợt số"; "TTr" = ĐXMS): cùng một nhiệm vụ / đề tài, dự án mua nhiều đợt. Hệ thống gợi ý số ĐXMS đã có của nhiệm vụ + 1, đơn vị sửa được (GIẢ LẬP P-192). SRS-DXMS chưa có trường này (D-59).',
        'Các trường khác của màn Thêm mới TTr cũ đã có cách làm khác trong SRS: Loại biểu mẫu → Quy trình theo ngưỡng; Cấp phê duyệt → bước 48; Danh sách đơn vị phê duyệt, Chân ký → theo quy tắc ký; Hình thức trình ký → theo Mật; Căn cứ pháp lý → văn bản căn cứ; Danh sách người thẩm định → chọn CQCM ở bước 16; Kiểm tra Mật → AI kiểm tra quy tắc bảo mật.',
      ].concat(edit ? ['Chế độ Chỉnh sửa có card <b>Danh sách hồ sơ</b> với nút <b>Tạo hồ sơ</b> và card Tài liệu đính kèm — đúng như source (nút Tạo hồ sơ chỉ có ở mode edit). Tạo hồ sơ mở form Thêm mới hồ sơ với ô ĐXMS đã khoá.'] : []),
      q: ['P-65', 'P-69', 'P-70', 'P-192'], src: 'task-management/components/task-create · /task-management/' + (edit ? 'edit/:id' : 'create'),
    };
    return `<form class="pg" data-dxms-form>
      ${head({ title: edit ? 'Chỉnh sửa ĐXMS' : 'Thêm mới ĐXMS', back, lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="x-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung ĐXMS</h3>
        <div class="grid3">
          ${field('Mã ĐXMS', `<input class="vctl" placeholder="Hệ thống tự sinh" value="${esc(XF.code || '')}" disabled>`)}
          ${field('Tên ĐXMS', txt('title', 'Nhập tên ĐXMS', { max: 500 }), { req: true, err: err.title, cls: 'span2' })}
          ${field('Đề tài / dự án', vSelect({ id: 'x-nv', value: v.nv, searchable: true, placeholder: 'Chọn đề tài / dự án', invalid: !!err.nv,
            options: D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name} (${n.kind})` })),
            onChange: (val) => { readXf(); v.nv = val; delete err.nv; if (!XF.dotTouched) v.dot = nextDot(val); rerender(); } }), { req: true, err: err.nv, cls: 'span2' })}
          ${field('Loại', `<input class="vctl" value="${esc((D.nvOf(v.nv) || {}).kind || '')}" placeholder="Theo đề tài / dự án đã chọn" disabled>`)}
          ${field('Đợt mua sắm', txt('dot', 'Nhập số đợt', { max: 3 }), { err: err.dot })}
          ${field('Đơn vị đề xuất', vSelect({ id: 'x-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit, options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd('unit') }), { req: true, err: err.unit })}
          ${field('Mức ưu tiên', vSelect({ id: 'x-pri', value: v.priority, placeholder: 'Chọn mức ưu tiên', invalid: !!err.priority, options: PRIORITIES.map((p) => ({ value: p, label: p })), onChange: upd('priority') }), { req: true, err: err.priority })}
          ${field('Mật', vSelect({ id: 'x-sec', value: v.secret, options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd('secret') }))}
          ${field('Giá trị dự kiến (tỷ đồng)', txt('est', 'Nhập giá trị dự kiến'), { err: err.est })}
          ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 09/2027'))}
          ${field('Người tạo', `<input class="vctl" value="${esc(edit ? x.creator || '' : persona(Flow.state.persona).name)}" disabled>`)}
          ${field('Mục đích', `<textarea class="vctl ta" data-xf="purpose" id="x-purpose" maxlength="2000" placeholder="Nhập mục đích">${esc(v.purpose)}</textarea>`, { cls: 'span3' })}
        </div></section>
      ${v.secret === 'Có' ? secCheckCard(v) : ''}
      ${edit ? profilesCard(XF.code, true) + attachmentsCard(XF.code) : ''}</form>`;
  }

  /* Comment #12 — kết quả AI kiểm tra quy tắc bảo mật (mẫu). Trên hệ thống thật: service AI chạy khi Lưu, trả kết quả theo từng quy tắc. */
  const SEC_WORDS = /(^|[\s,.;:()])(mật|tối mật|tuyệt mật|băng ka|5g sa|quốc phòng)(?=$|[\s,.;:()])|\d+(\.\d+)?\s?(ghz|mhz|dbm)|tọa độ|toạ độ|địa điểm/i;
  /* pre: tiền tố id ô Tên / Mục đích của form (x = Thêm mới ĐXMS, lf = Thêm mới luồng mua sắm). */
  function secCheckCard(v, pre) {
    const ttl = document.getElementById((pre || 'x') + '-title'), pur = document.getElementById((pre || 'x') + '-purpose');
    const title = ttl ? ttl.value : v.title, purpose = pur ? pur.value : v.purpose;
    const OK_UNITS = ['Trung tâm Vô tuyến', 'Phòng Chất lượng', 'Trung tâm Mạng lõi'];
    const res = {
      title: SEC_WORDS.test(title || '') ? ['Không đạt', 'Tên có từ khoá nhạy cảm — đề nghị dùng tên chung (vd. "Mua sắm thiết bị đo kiểm").'] : ['Đạt', ''],
      purpose: SEC_WORDS.test(purpose || '') ? ['Không đạt', 'Mục đích nêu thông số / địa điểm cụ thể — chuyển sang tài liệu Mật đính kèm.'] : ['Đạt', ''],
      unit: !v.unit ? ['Chưa có kết quả', 'Chưa chọn đơn vị.'] : OK_UNITS.includes(v.unit) ? ['Đạt', ''] : ['Không đạt', 'Đơn vị chưa có trong danh sách được xử lý hồ sơ Mật.'],
      sign: ['Lưu ý', 'Các bước trình ký mặc định Ký cứng; YCBG gửi NCC theo kênh được duyệt.'],
    };
    const tone = { 'Đạt': 'success', 'Không đạt': 'error', 'Lưu ý': 'warning', 'Chưa có kết quả': 'default' };
    return `<section class="vcard ai-box" data-sec-check><div class="vcard-h"><h3>AI kiểm tra quy tắc bảo mật</h3><span class="cap">Kết quả mẫu · chạy lại khi Lưu · không chặn Lưu</span></div>
      ${docTable([['Quy tắc', 420], ['Kết quả', 140, 'c'], ['Gợi ý', 420]], D.secRules, (r) => `<td>${esc(r.name)}</td><td class="c">${badge(res[r.id][0], tone[res[r.id][0]])}</td><td>${esc(res[r.id][1] || '-')}</td>`)}</section>`;
  }

  function readXf() { ['title', 'est', 'period', 'purpose', 'dot'].forEach((k) => { const el = document.getElementById('x-' + k); if (el) XF.v[k] = el.value; }); }
  function saveDxms() {
    readXf();
    const v = XF.v, err = XF.err = {};
    if (v.dot.trim() !== '' && !/^[1-9]\d{0,2}$/.test(v.dot.trim())) err.dot = 'Đợt mua sắm là số nguyên dương.';
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên ĐXMS.';
    if (!v.nv) err.nv = 'Bạn cần chọn Đề tài / dự án.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
    if (!v.priority) err.priority = 'Bạn cần chọn Mức ưu tiên.';
    const est = v.est.trim() === '' ? null : Number(v.est.trim().replace(/\./g, '').replace(',', '.'));
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Giá trị dự kiến không đúng định dạng.';
    if (Object.keys(err).length) { rerender(); return; }
    const data = { title: v.title.trim(), nv: v.nv, unit: v.unit, priority: v.priority, est, period: v.period.trim(), secret: v.secret === 'Có', purpose: v.purpose.trim(), dot: v.dot.trim() ? Number(v.dot.trim()) : null };
    if (XF.mode === 'edit') { Flow.updateDxms(XF.code, data); window.UI.toast('<b>Thành công</b><br>Cập nhật ĐXMS thành công!'); } else { Flow.createDxms(data); window.UI.toast('<b>Thành công</b><br>Thêm mới ĐXMS thành công!'); }
    location.hash = '#/dxms';
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-dxms-form]')) { e.preventDefault(); saveDxms(); } });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-xadv]')) { e.preventDefault(); X.f = JSON.parse(JSON.stringify(X.d)); X.page = 1; rerender(); } });
  document.addEventListener('input', (e) => { const f = e.target.closest && e.target.closest('[data-xlf]'); if (f) X.d[f.dataset.xlf] = f.value; if (e.target.id === 'x-dot') XF.dotTouched = true; });

  /* Danh sách hồ sơ của ĐXMS (TASK_PROFILE_COLUMNS: Mã Camunda, Mã hồ sơ, Quy trình, Bước hiện tại, Ngày tạo, Trạng thái; thêm Loại hồ sơ). */
  function profilesCard(code, edit) {
    const hs = allCases().filter((c) => c.dxms === code);
    const cols = [['Mã Camunda', 160], ['Mã hồ sơ', 150], ['Loại hồ sơ', 150], ['Căn cứ điều chỉnh', 150], ['Quy trình', 280], ['Bước hiện tại', 240], ['Ngày tạo', 130], ['Trạng thái', 169, 'c']];
    const from = (c) => (c.from ? `<a class="link" data-go="${caseHref(hs.find((o) => o.code === c.from) || { code: c.from })}">${esc(c.from)}</a>` : dash);
    return `<section class="vcard" data-dxms-profiles><div class="vcard-h"><h3>Danh sách hồ sơ</h3>${edit ? `<button type="button" class="vbtn red" data-go="ho-so-dxms/create/${encodeURIComponent(code)}">Tạo hồ sơ</button>` : ''}</div>
      ${docTable(cols, hs, (c) => `<td class="num">${esc(window.QuyTrinh.camundaKey(c.code))}</td><td><a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a></td><td>${esc(kindLabel(c.kind))}</td><td>${from(c)}</td>
        <td>${clamp(procLabel(c.flow))}</td><td>${clamp(c.step || (c.st === 'processing' ? '' : END_STEP[c.st]))}</td><td class="num">${esc(c.created)}</td><td class="c">${stBadge(c.st)}</td>`)}</section>`;
  }
  /* Tài liệu đính kèm của ĐXMS = tài liệu và văn bản đầu ra của các hồ sơ (TASK_ATTACHMENT_COLUMNS). */
  function attachmentsCard(code) {
    const rows = [];
    allCases().filter((c) => c.dxms === code).forEach((c) => {
      const vm = c.live ? { files: caseFiles(), outs: outputDocs() } : sampleVm(c);
      vm.files.concat(vm.outs).forEach((f) => rows.push({ name: f.name, at: f.at, c }));
    });
    return `<section class="vcard"><h3>Tài liệu đính kèm</h3>
      ${docTable([['Thao tác', 80, 'c'], ['Tên tài liệu', 320], ['Mã hồ sơ', 160], ['Ngày tạo', 150], ['Ngày cập nhật', 150]], rows, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
        <td><span class="clamp">${esc(r.name)}</span></td><td><a class="link" data-go="${caseHref(r.c)}">${esc(r.c.code)}</a></td><td class="num">${esc(r.at)}</td><td class="num">${esc(r.at)}</td>`)}</section>`;
  }

  /* ---------- SCR-29 Chi tiết ĐXMS ---------- */
  const notFound = (title) => `<div class="pg">${head({ title, back: 'dxms', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy ĐXMS.</div></section></div>`;
  function dxmsDetail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode detail)
    const x = Flow.findDxms(code);
    if (!x) return notFound('Xem chi tiết ĐXMS');
    const m = dxmsMeta(x, allCases());
    const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    const info = {
      scr: 'SCR-29', name: 'Chi tiết ĐXMS', uc: 'UC-07-01, UC-07-12 · UR-DX-20',
      notes: [
        'Theo task-create (mode detail): nút <b>Chỉnh sửa</b> trên hàng tiêu đề; cards Thông tin chung ĐXMS · <b>Danh sách hồ sơ</b> · Tài liệu đính kèm. Nút Tạo hồ sơ chỉ có ở Chỉnh sửa (như source).',
        'Danh sách hồ sơ theo TASK_PROFILE_COLUMNS (Mã Camunda, Mã hồ sơ, Quy trình, Bước hiện tại, Ngày tạo, Trạng thái) + Loại hồ sơ. Hồ sơ Phê duyệt và các hồ sơ Điều chỉnh của cùng ĐXMS nằm chung, truy vết được bản cũ → bản điều chỉnh (UR-DX-20).',
        'Giá trị hiệu lực = giá trị hồ sơ Hoàn thành gần nhất (R4). Trạng thái suy từ hồ sơ (R5).',
        'Hồ sơ Điều chỉnh hoàn thành (T21 D-40, GIẢ LẬP P-102): ĐXMS giữ một mã, giá trị hiệu lực = giá trị sau điều chỉnh, trạng thái "Đã phê duyệt (điều chỉnh lần n)"; cột Căn cứ điều chỉnh của Danh sách hồ sơ nối chuỗi Phê duyệt → Điều chỉnh lần 1 → …',
        '<b>T29</b> (HT-DXMS-NOTE màn 7, 8; "TTr" = ĐXMS): thêm Đợt mua sắm (P-192), Khối đơn vị (P-190), Người được xem; nút <b>Cập nhật người xem</b> như hành động cùng tên của hệ thống cũ — GIẢ LẬP P-189: người được xem thấy ĐXMS, hồ sơ, tài liệu, không xử lý việc. SRS-DXMS chưa có (D-59).',
      ].concat(window.Ycbg.TAB_INFO),
      q: ['P-66', 'P-73', 'P-74', 'P-102', 'P-189', 'P-190', 'P-192'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs',
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết ĐXMS', back: 'dxms', lg: true, info, right: `<button type="button" class="vbtn red" data-viewers="${esc(x.code)}">Cập nhật người xem</button><button type="button" class="vbtn primary" data-go="${dxmsHref(x.code)}/edit">Chỉnh sửa</button>` })}
      ${window.Ycbg.tabs(x.code, `<section class="vcard pad24 gen"><h3>Thông tin chung ĐXMS</h3><div class="ginfo c3">
        ${kv('Mã ĐXMS', esc(x.code))}${kv('Tên ĐXMS', esc(x.title), 'span2')}
        ${kv('Đề tài / dự án', D.nvOf(x.nv) ? `<a class="link" data-go="${window.DeTai.href(x.nv)}">${esc(`${x.nv} — ${D.nvOf(x.nv).name}`)}</a>` : null, 'span2')}${kv('Loại', esc((D.nvOf(x.nv) || {}).kind || ''))}
        ${kv('Đợt mua sắm', dotOf(x) ? String(dotOf(x)) : null)}${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Khối đơn vị', esc(D.blockOf(x.unit) || ''))}
        ${kv('Người tạo', esc(x.creator))}${kv('Mức ưu tiên', esc(x.priority))}${kv('Người được xem', esc(viewersText(x)))}
        ${kv('Giá trị hiệu lực (gồm VAT)', m.value != null ? ty(m.value) + ' tỷ đồng' : null)}${kv('Giá trị dự kiến', x.est != null ? ty(x.est) + ' tỷ đồng' : null)}${kv('Thời gian thực hiện', esc(x.period))}
        ${kv('Trạng thái', dxmsBadge(m.state, m.adjN))}${kv('Mật', x.secret ? 'Có' : 'Không')}${kv('Ngày cập nhật', esc(x.updated))}
        ${kv('Mục đích', esc(x.purpose), 'span3')}</div></section>
      ${profilesCard(x.code, false)}${attachmentsCard(x.code)}`)}</div>`;
  }

  /* Vào route mới: form mở trống / nạp dữ liệu của bản ghi (thay cho ngOnInit). */
  function enter(r) {
    const [a, b, c, d] = r.split('/');
    if (a === 'ho-so-dxms' && b === 'create') resetCreate(c ? decodeURIComponent(c) : null);
    if (a === 'dxms' && b === 'create') resetDxmsForm('create');
    if (a === 'dxms' && b && b !== 'create' && c === 'edit') resetDxmsForm('edit', decodeURIComponent(b));
    return d;
  }

  /* ---------- SCR-20 Chi tiết hồ sơ + Xem BPMN ---------- */
  /* Văn bản hệ thống sinh theo bước (by = task); hồ sơ < 160 tỷ dùng BM-09 + Checklist 02 (task 11), không có BM-05…08. */
  const DOCS = [
    { code: 'BM-01', name: 'Tờ trình đề xuất mua sắm', by: 12 }, { code: 'BM-09', name: 'Tờ trình đề xuất mua sắm (thẩm định, phê duyệt trực tiếp)', by: 11 },
    { code: 'BM-02', name: 'Thuyết minh / phụ lục giải trình', by: 12 }, { code: 'BM-02', name: 'Thuyết minh / phụ lục giải trình', by: 11 },
    { code: 'CL01', name: 'Checklist 01 — danh mục hồ sơ', by: 12 }, { code: 'CL02', name: 'Checklist 02 — danh mục hồ sơ', by: 11 }, { code: 'BM-03', name: 'Phiếu yêu cầu thẩm định', by: 15 },
    { code: 'BM-04', name: 'Phiếu nhận xét (mỗi CQCM một phiếu)', by: 22 }, { code: 'BM-05', name: 'Báo cáo kết quả thẩm định', by: 41 },
    { code: 'BM-06', name: 'Công văn báo cáo TGĐ Tập đoàn', by: 49 }, { code: 'BM-07', name: 'Báo cáo của Ban ĐTXD Tập đoàn', by: 53 },
    { code: 'BM-08', name: 'Quyết định phê duyệt ĐXMS', by: 57 },
  ];
  const SCR20_INFO = { scr: 'SCR-20', name: 'Chi tiết hồ sơ', uc: 'UC-03-02, UC-12-04 · UR-WF-12, UR-KPI-01/02/04', src: 'profile-management/profile-detail · /khcn-profile-management/:id/view' };
  const END_STEP = { done: 'Kết thúc — đã phê duyệt', moved: 'Kết thúc — đã chuyển quy trình', stopped: 'Kết thúc theo chỉ đạo khác' };
  const USER_KEYS = () => { const k = []; for (let n = 1; n <= 61; n++) { k.push(n); if (n === 10) k.push('10a'); } return k.filter((x) => T[x].type !== 'service'); };

  /* Hồ sơ đang chạy luồng → dữ liệu cho khuôn profile-detail. */
  function liveVm() {
    const ci = Flow.ci(), st = { running: 'processing', approved: 'done', moved: 'moved', stopped: 'stopped' }[Flow.state.status];
    const active = [...new Set(Flow.state.tokens.map((t) => String(t.task)))];
    const kpi = Flow.kpiUsed(), mv = Flow.state.movedTo;
    return {
      key: 'ho-so', code: ci.code, dxms: ci.dxms, kind: ci.kind, title: ci.name, flow: ci.flow, st, unit: ci.unit, lead: persona('minh').name, total: ci.total,
      reason: ci.reason, page: ci.kind === 'DC' ? D.adjProcesses.MS02.page : undefined, from: ci.from, before: ci.before,
      compare: ci.kind === 'DC' ? window.EVars.h.adjRows() : undefined,
      fund: ci.fund, period: ci.period, priority: ci.priority, secret: ci.secret, round: Flow.state.vars.round,
      kpi: kpi === null ? null : `${ty(kpi, 1)} / ${D.kpiLimit[ci.flow] || 20} ngày làm việc`, active,
      step: active.length ? [...new Set(Flow.state.tokens.map((t) => Flow.taskName(t.task)))].join(', ') : END_STEP[st],
      replaces: Flow.state.replaces ? `<a class="link-red" href="#/${caseHref(allCases().find((x) => x.code === Flow.state.replaces) || { code: Flow.state.replaces })}">${esc(Flow.state.replaces)}</a>` : null,
      replacedBy: mv ? `<a class="link-red" href="#" data-open-new="1">${esc(mv.code)}</a>` : null,
      steps: processSteps(), history: caseHistory(), files: caseFiles(), outs: outputDocs(), caseRef: allCases().find((x) => x.live) || null,
    };
  }

  /* Hồ sơ mẫu (không chạy luồng): suy ra tiến độ từ task đang chờ của bản ghi, ngày rải đều từ ngày tạo tới ngày cập nhật. */
  const parseDate = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d); };
  const fmtDate = (d) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  /* Người xử lý suy theo actor của bước (hồ sơ mẫu có quy trình chưa chạy luồng: MS02, MS14). */
  const whoByActor = (a, creator) => (/Đơn vị đề xuất/.test(a || '') ? creator : /CQCM|chuyên môn/.test(a || '') ? persona('hoa').name
    : /Tài chính/.test(a || '') ? persona('thu').name : /Thủ trưởng/.test(a || '') ? persona('tgd').name : persona('lan').name);
  /* Ngày của bước thứ i trong `span` bước đã xong, rải đều từ ngày tạo tới ngày cập nhật (dd/MM/yyyy HH:mm). */
  const spreadAt = (c, span) => { const d0 = parseDate(c.created), d1 = parseDate(c.updated);
    return (i) => { const d = new Date(d0.getTime() + ((d1 - d0) * (i + 1)) / (Math.max(1, span) + 1)); return `${fmtDate(d)} ${pad2(8 + (i * 3) % 9)}:${pad2((i * 17) % 60)}`; }; };
  function sampleVm(c) {
    /* Hồ sơ Điều chỉnh: bước người dùng của MS02 (trang MS02 ver1.1); người xử lý suy theo actor của bước. */
    const adj = c.kind === 'DC';
    const na = adj ? [] : D.notApplicable[c.flow] || [];
    const keys = adj ? ms02Tasks().map((t) => t.n) : USER_KEYS().filter((k) => k !== '10a' && !na.includes(k));
    const tk = (k) => (adj ? ms02Tasks().find((t) => t.n === k) : T[k]);
    let cur = -1;
    if (c.st === 'processing') cur = Math.max(0, keys.findIndex((k) => parseInt(k, 10) >= (c.task || 1)));
    const doneN = c.st === 'processing' ? cur : c.st === 'done' ? keys.length : c.st === 'moved' ? keys.findIndex((k) => k > 10) : keys.length - 1;
    const steps = keys.map((k, i) => ({ title: tk(k).name, sub: tk(k).actor, state: i < doneN ? 'completed' : i === cur ? 'active' : 'upcoming' }));
    const d0 = parseDate(c.created), d1 = parseDate(c.updated), span = Math.max(1, doneN);
    const whoAdj = (k) => whoByActor(tk(k).actor, c.creator);
    const who = (k) => { if (adj) return whoAdj(k); const w = (D.flow[k] || {}).who || ''; return w === 'minh' ? c.creator : w.startsWith('cqcm') ? persona('hoa').name : persona(w || 'lan').name; };
    const at = (i) => { const d = new Date(d0.getTime() + ((d1 - d0) * (i + 1)) / (span + 1)); return `${fmtDate(d)} ${pad2(8 + (i * 3) % 9)}:${pad2((i * 17) % 60)}`; };
    const history = keys.slice(0, doneN).map((k, i) => ({ title: tk(k).name, st: 'COMPLETED', name: who(k), when: at(i), note: '' }))
      .concat(cur >= 0 ? [{ title: tk(keys[cur]).name, st: 'CREATED' }] : []);
    const doneAt = (by) => { const i = keys.findIndex((k) => parseInt(k, 10) >= by); return i >= 0 && i < doneN ? at(i).slice(0, 10) : null; };
    const outs = DOCS.filter((d) => doneAt(d.by) && !(na.includes(d.by))).map((d) => ({ name: `${d.code} ${d.name}`, at: doneAt(d.by) }));
    const files = [['QD-can-cu-' + c.code.slice(-4) + '.pdf', 1], ['eBOM-' + c.code.slice(-4) + '.xlsx', 5], ['RSTK-' + c.code.slice(-4) + '.xlsx', 7], ['Bao-gia-tong-hop.pdf', 10]]
      .filter(([, by]) => doneAt(by)).map(([name, by]) => ({ name, at: doneAt(by) }));
    const rel = (k) => (k ? `<a class="link-red" href="#/${caseHref(allCases().find((x) => x.code === k) || { code: k })}">${esc(k)}</a>` : null);
    const x = Flow.findDxms(c.dxms) || {};
    return {
      key: 'ho-so-dxms/' + c.code, code: c.code, dxms: c.dxms, kind: c.kind, title: c.title, flow: c.flow, st: c.st, unit: c.unit, lead: c.creator, total: c.total,
      fund: c.fund || 'Vốn đầu tư phát triển, năm 2027', period: x.period || '01/2027 – 12/2027', priority: c.priority, secret: !!c.secret, round: 0,
      kpi: null, active: cur >= 0 ? [String(keys[cur])] : [], step: c.st === 'processing' ? c.step : END_STEP[c.st], reason: c.reason,
      page: adj ? D.adjProcesses[c.flow].page : undefined, from: c.from, before: c.before,
      replaces: rel(c.replaces), replacedBy: rel(c.replacedBy), steps, history, files, outs, sample: true, caseRef: c,
    };
  }

  /* ---------- Hồ sơ KĐT (hồ sơ Phê duyệt KĐT, D-12) cho khuôn profile-detail ----------
     Quy trình: bước người dùng của MS13 (bỏ nhánh không đi qua — D.kdtNa) hoặc MS14 (hồ sơ sau chuyển luồng, luồng chưa dựng). */
  const KDT_END = { done: 'Kết thúc — đã phê duyệt', moved: 'Kết thúc — đã chuyển luồng', stopped: 'Kết thúc theo chỉ đạo' };
  const KDT_TD = { GOP: 'Hồ sơ gộp', CT: 'Chủ trương', KDT: 'Hồ sơ KĐT' };
  const kdtCaseHref = (code) => 'ho-so-kdt/' + encodeURIComponent(code);
  const kdtCaseRef = (code) => (code ? `<a class="link-red" href="#/${kdtCaseHref(code)}">${esc(code)}</a>` : null);
  /* Task 4 của MS13 ghi actor "Đơn vị đề xuất mua sắm" (chép từ MS01, plan KĐT §1.4) → hiện ĐVĐX KĐT như lane. */
  const kdtActor = (a) => (a || '').replace('Đơn vị đề xuất mua sắm', 'Đơn vị đề xuất KĐT');
  const kdtProcText = (flow) => (flow === 'MS14' ? D.kdtGroups.MS14 : D.kdtGroups.MS13);
  function kdtUserTasks(c) {
    if (c.flow === 'MS14') return diagramTasks('MS14').map((t) => ({ k: t.n, name: t.name, actor: t.actor }));
    /* Hồ sơ mẫu: Mật theo KĐT — Mật bỏ 75 (bắt buộc bản cứng), không Mật bỏ 77–78 (chỉ khi chọn bản cứng). */
    const mat = !!(Flow.findKdt(c.kdt) || {}).secret;
    const T13 = window.BPMN_FLOWS.MS13.tasks, na = D.kdtNa({ branch: c.branch }, mat).concat(mat ? [] : [77, 78]);
    return Object.keys(T13).map(Number).sort((a, b) => a - b).filter((k) => T13[k].type !== 'service' && !na.includes(k))
      .map((k) => ({ k, name: T13[k].name, actor: kdtActor(T13[k].actor) }));
  }
  const kdtOuts = (docs) => (docs || []).map(([code, at]) => ({ name: `${code} ${KDOC_NAME[code]}`, at }));

  /* Hồ sơ KĐT đang chạy luồng: như liveVm, thêm nhóm / nhánh, bộ đếm vòng check / lần họp theo giai đoạn (P-54). */
  function kdtLiveVm() {
    const ci = Flow.ci(), S0 = Flow.state, st = { running: 'processing', approved: 'done', moved: 'moved', stopped: 'stopped' }[S0.status];
    const rec = Flow.kdtCases().find((c) => c.code === ci.code) || {};
    const T13 = TT(), name = (t) => T13[t.task].name;
    /* Bản 12/10 không còn quy trình con (D-32): tô đúng bước đang chạy, kể cả bước của khối chung 25–38. */
    const active = [...new Set(S0.tokens.map((t) => String(t.task)))];
    const focus = active;
    const chk = S0.vars.chk || {}, meet = S0.vars.meet || {};
    const counts = Object.keys(KDT_TD).filter((k) => chk[k] != null || meet[k] != null || S0.vars.td === k)
      .map((k) => `${KDT_TD[k]}: vòng check ${chk[k] || 0}/2, họp ${meet[k] || 0}/2`).join(' · ');
    const priced = S0.history.some((h) => String(h.task) === '10' && h.who);
    return {
      key: kdtCaseHref(ci.code), isKdt: true, code: ci.code, kdt: ci.kdt, title: ci.name, flow: S0.status === 'moved' ? 'MS13' : ci.group, branch: ci.branch, st, unit: ci.unit, lead: persona('minh').name,
      total: priced ? ci.total : null, est: ci.est, fund: ci.fund, period: ci.period, secret: ci.secret, counts,
      active, focus: focus.length ? focus : undefined, page: 'MS13', proc: kdtProcText('MS13'),
      step: S0.tokens.length ? [...new Set(S0.tokens.map(name))].join(', ') : KDT_END[st],
      replacedBy: S0.movedTo ? kdtCaseRef(S0.movedTo.code) : null, replaces: rec.replaces ? kdtCaseRef(rec.replaces) : null,
      steps: processSteps(), history: caseHistory(), files: caseFiles(), outs: outputDocs(),
    };
  }

  /* Hồ sơ KĐT mẫu (không chạy luồng): tiến độ suy từ bước đang chờ của bản ghi như sampleVm. */
  function kdtSampleVm(c) {
    const x = Flow.findKdt(c.kdt) || {}, keys = kdtUserTasks(c), ms14 = c.flow === 'MS14';
    let cur = -1;
    if (c.st === 'processing') cur = Math.max(0, keys.findIndex((t) => t.k >= (c.task || 1)));
    /* Chuyển luồng sau cổng phân luồng (bước 12); dừng theo chỉ đạo khi TGĐ VHT không ký chủ trương (bước 48). */
    const cut = (n) => { const i = keys.findIndex((t) => t.k > n); return i < 0 ? keys.length : i; };
    const doneN = c.st === 'processing' ? cur : c.st === 'done' ? keys.length : c.st === 'moved' ? cut(12) : cut(48);
    const steps = keys.map((t, i) => ({ title: t.name, sub: t.actor, state: i < doneN ? 'completed' : i === cur ? 'active' : 'upcoming' }));
    const at = spreadAt(c, doneN);
    const who = (t) => {
      if (ms14) return whoByActor(t.actor, c.creator);
      const w = (D.flows.MS13[t.k] || {}).who || 'lan';
      return w === 'minh' ? c.creator : w.startsWith('cqcm') ? persona('hoa').name : (D.personas.find((p) => p.id === w) || persona('lan')).name;
    };
    const history = keys.slice(0, doneN).map((t, i) => ({ title: t.name, st: 'COMPLETED', name: who(t), when: at(i), note: '' }))
      .concat(cur >= 0 ? [{ title: keys[cur].name, st: 'CREATED' }] : []);
    const doneAt = (by) => { const i = keys.findIndex((t) => t.k >= by); return i >= 0 && i < doneN ? at(i).slice(0, 10) : null; };
    const n4 = c.code.slice(-4);
    const files = ms14 ? [] : [[`Can-cu-KDT-${n4}.pdf`, 1], [`Danh-muc-dau-tu-${n4}.xlsx`, 5], [`RSTK-${n4}.xlsx`, 7], ['Bao-gia-tong-hop.pdf', 10]]
      .filter(([, by]) => doneAt(by)).map(([name, by]) => ({ name, at: doneAt(by) }));
    return {
      key: kdtCaseHref(c.code), isKdt: true, code: c.code, kdt: c.kdt, title: c.title || x.title, flow: c.flow, branch: c.branch, st: c.st, unit: x.unit, lead: c.creator,
      total: c.total, est: x.est, fund: x.type === 'KHCN' ? 'Vốn KHCN' : 'Vốn đầu tư phát triển', period: x.period, secret: !!x.secret, counts: '',
      active: cur >= 0 ? [String(keys[cur].k)] : [], page: ms14 ? 'MS14' : 'MS13', proc: kdtProcText(c.flow),
      step: c.st === 'processing' ? keys[cur].name : KDT_END[c.st],
      replaces: kdtCaseRef(c.replaces), replacedBy: kdtCaseRef(c.replacedBy), steps, history, files, outs: kdtOuts(c.docs), sample: true,
    };
  }

  /* Thông tin chung của hồ sơ KĐT: Mã KĐT thay Mã ĐXMS; Quy trình = nhóm KĐT; Nhánh hồ sơ; Tổng mức vốn thực tế (sau bước 10) hoặc dự kiến. */
  function kdtGeneralInfo(vm, cols) {
    const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    const CS = { processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'], moved: ['Đã chuyển luồng', 'warning'], stopped: ['Dừng theo chỉ đạo', 'default'] };
    return `<section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo ${cols === 3 ? 'c3' : ''}">
      ${kv('Mã hồ sơ', esc(vm.code))}${kv('Tên hồ sơ', esc(vm.title))}${kv('Mã KĐT', kdtRef(vm.kdt))}${kv('Loại hồ sơ', 'Phê duyệt KĐT')}
      ${kv('Quy trình', esc(vm.flow ? D.kdtGroups[vm.flow] : 'Chưa xác định nhóm (MS13 · MS14 · MS15)'))}${kv('Nhánh hồ sơ', vm.branch ? esc(D.kdtBranches[vm.branch]) : null)}
      ${kv('Trạng thái', badge(CS[vm.st][0], CS[vm.st][1]))}${kv('Bước hiện tại', esc(vm.step))}${kv('Đơn vị đề xuất', esc(vm.unit))}${kv('Người phụ trách', esc(vm.lead))}
      ${vm.total != null ? kv('Tổng mức vốn thực tế (gồm VAT)', ty(vm.total) + ' tỷ đồng') : kv('Tổng mức vốn dự kiến', vm.est != null ? ty(vm.est) + ' tỷ đồng' : null)}
      ${kv('Thời gian thực hiện', esc(vm.period))}${kv('Nguồn vốn', esc(vm.fund))}${kv('Mật', vm.secret ? 'Có' : 'Không')}
      ${vm.counts ? kv('Thẩm định', esc(vm.counts)) : ''}${vm.replaces ? kv('Thay thế cho', vm.replaces) : ''}${vm.replacedBy ? kv('Được thay bởi', vm.replacedBy) : ''}
    </div></section>`;
  }

  /* Thông tin chung (profile-general-info): lưới 2 cột ở Chi tiết hồ sơ, 3 cột ở Chi tiết BPMN; mỗi giá trị cắt 2 dòng. */
  const dxmsRef = (code) => (code && code !== '—' ? `<a class="link-red" href="#/${dxmsHref(code)}">${esc(code)}</a>` : null);
  function generalInfo(vm, cols) {
    if (vm.isKdt) return kdtGeneralInfo(vm, cols);
    if (vm.isHd) {
      const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
      return `<section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo ${cols === 3 ? 'c3' : ''}">
        ${kv('Mã hồ sơ', esc(vm.code))}${kv('Tên hồ sơ', esc(vm.title))}${kv('Mã hợp đồng', hdRef(vm.hd))}${kv('Loại hồ sơ', esc(D.hdProcesses[vm.flow].type))}${kv('Quy trình', esc(vm.proc))}
        ${kv('Trạng thái', stBadge(vm.st))}${kv('Bước hiện tại', esc(vm.step))}${kv('Đơn vị quản lý', esc(vm.unit))}${kv('Đầu mối theo dõi', esc(vm.lead))}${kv('Nhà thầu', esc(hdNccName(vm.ncc)))}${kv('Giá trị hợp đồng (gồm thuế GTGT)', ty(vm.total) + ' tỷ đồng')}
      </div></section>`;
    }
    const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    const adj = vm.kind === 'DC';
    return `<section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo ${cols === 3 ? 'c3' : ''}">
      ${kv('Mã hồ sơ', esc(vm.code))}${kv('Tên hồ sơ', esc(vm.title))}${kv('Mã ĐXMS', dxmsRef(vm.dxms))}${kv('Loại hồ sơ', esc(kindLabel(vm.kind)))}${kv('Quy trình', esc(procLabel(vm.flow)))}
      ${kv('Trạng thái', stBadge(vm.st))}${kv('Bước hiện tại', esc(vm.step))}${kv('Mức ưu tiên', esc(vm.priority))}${kv('Đơn vị đề xuất', esc(vm.unit))}
      ${kv('Người phụ trách', esc(vm.lead))}${kv(adj ? 'Giá trị sau điều chỉnh (gồm VAT)' : 'Tổng giá trị (gồm VAT)', ty(vm.total) + ' tỷ đồng')}${kv('Thời gian thực hiện', esc(vm.period))}${kv('Nguồn vốn', esc(vm.fund))}
      ${kv('Mật', vm.secret ? 'Có' : 'Không')}${adj ? kv('Lý do điều chỉnh', esc(vm.reason)) : kv('KPI thẩm định', vm.kpi ? esc(vm.kpi) : null)}
      ${!adj && vm.caseRef && ttOf(vm.caseRef) ? kv('Số, ngày Tờ trình', esc(`${ttOf(vm.caseRef).no} ngày ${ttOf(vm.caseRef).at}`))
    + kv('Thẩm định', `<button type="button" class="link-btn" data-review="${esc(vm.code)}">${esc(reviewSum(vm.caseRef))}</button>`) : ''}
      ${vm.round ? kv('Vòng giải trình', `${vm.round}/2`) : ''}${vm.replaces ? kv('Thay thế cho', vm.replaces) : ''}${vm.replacedBy ? kv('Được thay bởi', vm.replacedBy) : ''}
    </div></section>`;
  }

  /* Hồ sơ Điều chỉnh: So sánh trước – sau (bảng bước 4; hồ sơ mẫu chỉ có dòng giá trị). Căn cứ = hồ sơ Hoàn thành trước đó (D-40, UR-DX-20). */
  function compareCard(vm) {
    if (vm.kind !== 'DC' || vm.isKdt) return '';
    const rows = vm.compare || (vm.before != null ? [{ noiDung: 'Tổng giá trị (gồm VAT)', truoc: ty(vm.before) + ' tỷ đồng', sau: ty(vm.total) + ' tỷ đồng' }] : []);
    const from = vm.from ? `<a class="link-red" href="#/${caseHref(allCases().find((x) => x.code === vm.from) || { code: vm.from })}">${esc(vm.from)}</a>` : '-';
    return `<section class="vcard" data-adj-compare><div class="vcard-h"><h3>So sánh trước – sau điều chỉnh</h3><span class="faint">Căn cứ: hồ sơ ${from}</span></div>
      ${docTable([['Nội dung', 220], ['Đã phê duyệt', 220], ['Sau điều chỉnh', 220]], rows, (r) => `<td>${esc(r.noiDung)}</td><td>${esc(r.truoc)}</td><td>${esc(r.sau)}</td>`)}</section>`;
  }

  function detailPage(vm) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-detail/profile-detail.component.html
    //       + sections/profile-general-info, profile-documents (readOnly), profile-output-documents
    const info = vm.isHd ? Object.assign({}, SCR20_INFO, { name: 'Chi tiết hồ sơ (hợp đồng)', uc: 'BPMN-DTMS trang ' + vm.page, notes: HD_NOTES() }) : vm.isKdt ? Object.assign({}, SCR20_INFO, { name: 'Chi tiết hồ sơ (khoản đầu tư)', uc: 'UC-05-01 · WBS PH09 #180, 181; PH03 #50–53 · UR-WF-12', q: ['P-54', 'P-56'], notes: KDT_DETAIL_NOTES(vm) }) : Object.assign({}, SCR20_INFO, {
      q: qFor(vm.flow, D.screenQ['SCR-20']),
      notes: ['Bố cục lấy nguyên từ profile-detail: "Xem BPMN" là nút duy nhất trên hàng tiêu đề; cột trái Thông tin chung · Quy trình · Danh sách tài liệu · Văn bản đầu ra, cột phải Lịch sử hồ sơ (tỉ lệ 801 : 333).',
        'Các tab cũ (Danh mục hàng hoá, Tài liệu & phiên bản, Timeline, KPI, Nhật ký AI, Hồ sơ liên quan) bỏ vì source không có. KPI thẩm định, Vòng giải trình, Thay thế cho / Được thay bởi chuyển vào Thông tin chung; danh mục hàng hoá xem ở màn xử lý task; timeline xem ở Lịch sử hồ sơ và Xem BPMN.',
        'Mã ĐXMS (đối tượng cha, D-10) thay Mã nhiệm vụ, bấm mở Chi tiết ĐXMS. Loại hồ sơ: Phê duyệt ĐXMS / Điều chỉnh ĐXMS; hồ sơ Điều chỉnh hiện Giá trị sau điều chỉnh và Lý do điều chỉnh, Quy trình và Lịch sử theo các bước MS02; thêm card So sánh trước – sau điều chỉnh (bảng của bước 4, căn cứ = hồ sơ Hoàn thành trước đó — T21 D-40). Văn bản đầu ra của hồ sơ Điều chỉnh là bản điều chỉnh (BM-01 / BM-09 / BM-08 có mục Nội dung điều chỉnh).',
        'Thông tin chung đổi theo nghiệp vụ ĐTMS như màn xử lý task: Tên nhiệm vụ → Trạng thái, Bước hiện tại; Cấp nhiệm vụ → Mức ưu tiên; Đơn vị chủ trì → Đơn vị đề xuất; Chủ nhiệm đề tài → Người phụ trách; Tổng dự toán → Tổng giá trị; Lĩnh vực → Nguồn vốn; thêm Mật, KPI thẩm định (UR-KPI-04: từ task 18 tới task 60, ngưỡng 20 NLV; MS01.03 10 NLV — P-21).',
        'Quy trình chỉ gồm bước người dùng của quy trình hồ sơ đi qua: MS01.02 không có task 49–56 (báo cáo Tập đoàn), MS01.03 không có task 12, 41–59 (BM-01, BM-05…BM-08).',
        'Danh sách tài liệu ở chế độ xem (readOnly): chỉ Tải xuống; "Chọn mẫu tài liệu" vẫn ở hàng tiêu đề như source.',
        '<b>T29</b> (HT-DXMS-NOTE màn 7, 8, 10; "TTr" = ĐXMS): Văn bản đầu ra tải được Word và PDF; Thông tin chung thêm Số, ngày Tờ trình (GIẢ LẬP P-192); mục <b>Thẩm định</b> mở hộp thoại Tình trạng thẩm định — từng CQCM: Chưa xem / Đang xem / Đã đồng ý / Yêu cầu sửa, Ngày gửi, Ngày thẩm định, Số ngày xử lý (GIẢ LẬP P-191). SRS-DXMS đặt nội dung này ở màn Thẩm định và ý kiến (DTMS_CN_0157), source profile-detail không có khối tương đương → cần dev riêng (S3); để giữ 4 card như source, prototype mở bằng hộp thoại.']
        .concat(vm.sample ? ['Hồ sơ mẫu không chạy luồng: tiến độ, lịch sử, tài liệu suy ra từ task đang chờ của bản ghi; ngày rải đều từ ngày tạo tới ngày cập nhật.'] : []),
    });
    return `<div class="pg">
      ${head({ title: 'Chi tiết hồ sơ', back: vm.isHd ? 'hop-dong/' + encodeURIComponent(vm.hd) : vm.isKdt ? kdtBackOf(window.App.detailFrom(), vm.kdt) : vm.sample ? backOf(window.App.detailFrom()) : true, lg: true, info, right: `<button type="button" class="vbtn primary" data-go="${esc(vm.key)}/bpmn">Xem BPMN</button>` })}
      <div class="dgrid"><div class="dmain">
        ${generalInfo(vm, 2)}${compareCard(vm)}
        <section class="vcard"><h3>Quy trình</h3>${UI.vSteps({ id: vm.code, steps: vm.steps })}</section>
        <section class="vcard"><div class="vcard-h"><h3>Danh sách tài liệu</h3><button type="button" class="vbtn secondary sm" data-tpl>${icon('file')} Chọn mẫu tài liệu</button></div>
          ${docTable([['Thao tác', 112, 'c'], ['Tên tài liệu', 260], ['Ngày tạo', 130]], vm.files, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
            <td><span class="clamp">${esc(r.name)}</span></td><td>${esc(r.at)}</td>`)}</section>
        <section class="vcard"><h3>Văn bản đầu ra</h3>
          ${docTable([['Thao tác', 112, 'c'], ['Tên tài liệu', 260], ['Ngày tạo', 170]], vm.outs, (r) => `<td class="c"><div class="acts">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}<span class="sep"></span>${dlPdf(r.name)}</div></td>
            <td><button type="button" class="link-btn" data-preview-doc="${esc(r.name)}|${esc(r.at)}|${esc(vm.code)}">${esc(r.name)}</button></td><td>${esc(r.at)}</td>`)}</section>
      </div>${historyCard(vm.history, 'drail')}</div></div>`;
  }

  /* Chi tiết BPMN (profile-bpmn): Thông tin chung 3 cột + card "Bước hiện tại" với sơ đồ 520px; "Xem quy trình" quay về chi tiết. */
  function bpmnPage(vm) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-bpmn/profile-bpmn.component.html
    const info = { scr: 'SCR-20', name: 'Chi tiết BPMN của hồ sơ', uc: SCR20_INFO.uc, src: 'profile-management/profile-bpmn · /khcn-profile-management/:id/bpmn',
      notes: vm.isHd ? hdBpmnNotes(vm.page) : vm.isKdt ? kdtBpmnNotes(vm.page) : bpmnNotes() };
    return `<div class="pg">
      ${head({ title: 'Chi tiết BPMN', back: vm.key, info, right: `<button type="button" class="vbtn primary" data-go="${esc(vm.key)}">Xem quy trình</button>` })}
      ${generalInfo(vm, 3)}
      <section class="vcard"><div class="bp-h"><h2>Bước hiện tại: ${esc(vm.step)}</h2><p>${esc(vm.proc || procLabel(vm.flow))}</p></div>
        ${BpmnView.html(vm.key, vm.active, 520, vm.page ? { page: vm.page, focus: vm.focus } : undefined)}</section></div>`;
  }
  /* Chi tiết hồ sơ mẫu: quay lại màn đã mở nó (Giám sát tiến trình, Chi tiết / Chỉnh sửa ĐXMS), còn lại về Danh sách hồ sơ. */
  const backOf = (from) => (from && (from === 'giam-sat-tien-trinh' || /^dxms\/[^/]+(\/edit)?$/.test(from) || from === 'viec-cua-toi') ? from : 'ho-so-dxms');
  const bpmnNotes = () => [`Sơ đồ vẽ lại từ BPMN chuẩn ${esc(window.BPMN_SOURCE.file)} · trang "${esc(window.BPMN_DIAGRAM.page)}" (61 task + 10a, 10b; sinh bằng tools/bpmn-diagram-extract.mjs). Bản thật dùng app-bpmn-viewer (bpmn-js) đọc XML của quy trình đã deploy.`,
    'Bước đang xử lý tô theo ACTIVE_STEP_PAINT của source (nền #e9fbf0, viền #5fe495 3px); nhiều việc song song thì tô cả. Không có thanh công cụ (showToolbar=false); kéo để di chuyển, cuộn chuột để phóng to/thu nhỏ.',
    'Khác source: source mở ở chế độ vừa khung (fit-viewport); sơ đồ ĐTMS rộng 28.000px nên prototype mở canh giữa bước hiện tại để đọc được chữ. Hồ sơ đã kết thúc thì mở vừa khung.'];
  const kdtBpmnNotes = (page) => [`Sơ đồ vẽ lại từ BPMN chuẩn ${esc(window.BPMN_SOURCE.file)} · trang "${esc(page)}" (D-6; sinh bằng tools/bpmn-diagram-extract.mjs). Bản thật dùng app-bpmn-viewer (bpmn-js) đọc XML của quy trình đã deploy.`,
    'Bước đang xử lý tô theo ACTIVE_STEP_PAINT của source. Bản 12/10 (D-32) không còn quy trình con: khối kiểm tra – thẩm định – giải trình – họp 25–38 dùng chung cho ba vòng (BM-00 / BM-01 / BM-03), tô đúng bước đang chạy; vòng hiện tại ghi ở tiêu đề.',
    page === 'MS14' ? 'Hồ sơ sau chuyển luồng theo MS14: luồng MS14 chưa dựng (đợt 2), bước hiện tại lấy theo dữ liệu hồ sơ mẫu.' : 'Tuyến Tập đoàn 63–74 (T18 B4): cổng cấp duyệt ra Tập đoàn → công văn trình (63–66), các Ban Tập đoàn nhận xét, VHT tiếp thu và ký trình lại (67–69), Ban ĐTXD kiểm tra, TGĐ Tập đoàn ký (70–73), lưu kết quả (74). Khối ký chung 75–78 (D-34): bước ký đi qua khối thì tô bước 75–78 đang chạy, tiêu đề ghi văn bản và bước ký.'];
  /* Ghi chú (i) của Chi tiết hồ sơ KĐT. */
  const KDT_DETAIL_NOTES = (vm) => ['Dùng lại khuôn Chi tiết hồ sơ (profile-detail) cho hồ sơ <b>Phê duyệt KĐT</b> (D-12: KĐT là đối tượng cha): nút Xem BPMN trên hàng tiêu đề; Thông tin chung · Quy trình · Danh sách tài liệu · Văn bản đầu ra; Lịch sử hồ sơ bên phải.',
    'Thông tin chung: <b>Mã KĐT</b> thay Mã nhiệm vụ (bấm mở Chi tiết KĐT); <b>Quy trình</b> = nhóm KĐT do hệ thống xác định sau bước 12 (D-7), trước đó "Chưa xác định nhóm"; <b>Nhánh hồ sơ</b> gộp BM-00 / hai giai đoạn; <b>Thẩm quyền</b> = kết quả bước 13 (cấp duyệt chủ trương / KĐT, D-33); Tổng mức vốn thực tế sau khi chốt ở bước 10 (trước đó là dự kiến của KĐT); <b>Thẩm định</b> = bộ đếm vòng check / lần họp theo từng vòng (P-54, đếm riêng mỗi vòng). Không có Mức ưu tiên (KĐT không có trường này), không có KPI thẩm định (MS13 chưa có mốc tính — UR-KPI-04 ≤ 10 NLV, P-95).',
    'Quy trình: bước người dùng của MS13 (BPMN 12/10, 78 bước) mà hồ sơ đi qua — bỏ tuyến Tập đoàn 63–74 khi hồ sơ không rẽ Tập đoàn (đã rẽ thì bỏ bước ký VHT được thay thế và 71 / 72 không thuộc loại hồ sơ đã trình), ký bản cứng 77–78 khi hồ sơ không Mật và chưa chọn bản cứng (hồ sơ Mật bỏ 75 — D-34) và nhánh còn lại sau cổng gộp (hai giai đoạn không có 18–24, 61–62; gộp BM-00 không có 39–60). Khối chung 25–38 hiện một lần.',
    'Văn bản đầu ra: BM-01 (TGĐ VHT ký duyệt chủ trương, bước 48), BM-14 (TTMS ký báo cáo thẩm định, bước 57 / 61), BM-18 (TGĐ VHT ký Quyết định, bước 60) hoặc BM-00 + BM-18 (ký hồ sơ gộp, bước 62). Tuyến Tập đoàn: Công văn trình (65), BM-06 giải trình (69), văn bản TGĐ Tập đoàn ký nhận ở bước 74 (chủ trương BM-01; KĐT / gộp BM-14 + BM-18).',
    'Nút quay lại về màn đã mở (Chi tiết / Chỉnh sửa KĐT, Giám sát tiến trình, Việc của tôi, Thông báo chuyển luồng); mở trực tiếp thì về Chi tiết KĐT.']
    .concat(vm.sample ? ['Hồ sơ mẫu không chạy luồng: tiến độ, lịch sử, tài liệu suy ra từ bước đang chờ của bản ghi; ngày rải đều từ ngày tạo tới ngày cập nhật.'] : [])
    .concat(vm.page === 'MS14' ? ['Hồ sơ theo MS14 (tạo khi hồ sơ MS13 chuyển luồng, P-53): luồng MS14 chưa dựng — Quy trình theo các bước người dùng của sơ đồ MS14.'] : []);
  /* Chi tiết hồ sơ KĐT: quay lại màn đã mở nó (KĐT, Giám sát tiến trình, Việc của tôi), còn lại về Chi tiết KĐT. */
  const kdtBackOf = (from, kdt) => (from && (from === 'giam-sat-tien-trinh' || from === 'viec-cua-toi' || from === 'ho-so-kdt' || /^(ycbg-kdt|khlcnt)(\/[^/]+)?$/.test(from) || /^kdt\/[^/]+(\/(edit|chuyen-luong))?$/.test(from)) ? from : 'kdt/' + encodeURIComponent(kdt));

  function caseDetail(sub) {
    if (Flow.state.status === 'new') {
      return `<div class="pg">${head({ title: 'Chi tiết hồ sơ', back: 'ho-so-dxms', lg: true, info: SCR20_INFO })}
        <section class="vcard pad24"><div class="empty-t">Không tìm thấy hồ sơ.</div></section></div>`;
    }
    const vm = Flow.state.kdt ? kdtLiveVm() : liveVm();
    return sub === 'bpmn' ? bpmnPage(vm) : detailPage(vm);
  }

  /* Chi tiết hồ sơ KĐT #/ho-so-kdt/<mã>[/bpmn]: hồ sơ đang chạy luồng hoặc hồ sơ mẫu / hồ sơ đã dừng giữ trong danh sách hồ sơ của KĐT. */
  function kdtCaseDetail(code, sub) {
    const c = Flow.kdtCases().find((x) => x.code === code);
    if (!c) return `<div class="pg">${head({ title: 'Chi tiết hồ sơ', back: 'kdt', lg: true, info: SCR20_INFO })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy hồ sơ.</div></section></div>`;
    /* Hồ sơ MS14 tạo khi chuyển luồng (luồng chưa dựng) mở như hồ sơ mẫu. */
    const vm = c.live && Flow.state.kdt && code === Flow.state.code ? kdtLiveVm() : kdtSampleVm(Object.assign({}, c, { title: c.title || (Flow.findKdt(c.kdt) || {}).title }));
    return sub === 'bpmn' ? bpmnPage(vm) : detailPage(vm);
  }

  /* Chi tiết hồ sơ con của hợp đồng #/ho-so-hd/<mã>[/bpmn] (khuôn profile-detail): route đã nạp hồ sơ (Flow.focus). */
  function hdCaseDetail(code, sub) {
    if (!Flow.state.parent || Flow.state.code !== code) return `<div class="pg">${head({ title: 'Chi tiết hồ sơ', back: 'hop-dong', lg: true, info: SCR20_INFO })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy hồ sơ.</div></section></div>`;
    const vm = hdVm();
    return sub === 'bpmn' ? bpmnPage(vm) : detailPage(vm);
  }
  function hdVm() {
    const ci = Flow.ci(), S0 = Flow.state, p = D.hdProcesses[ci.flow], active = [...new Set(S0.tokens.map((t) => String(t.task)))];
    return { key: 'ho-so-hd/' + ci.code, isHd: true, code: ci.code, hd: ci.hd, title: ci.name, flow: ci.flow, st: { running: 'processing', approved: 'done' }[S0.status], unit: ci.unit, lead: ci.owner, total: ci.total, ncc: ci.ncc,
      active, focus: active.length ? active : undefined, page: p.page, proc: `${ci.flow} — ${p.name}`, step: active.length ? [...new Set(S0.tokens.map((t) => TT()[t.task].name))].join(', ') : S0.vars.hold || S0.vars.endText || p.end,
      steps: processSteps(), history: caseHistory(), files: caseFiles(), outs: outputDocs() };
  }
  const hdRef = (code) => `<a class="link-red" href="#/hop-dong/${encodeURIComponent(code)}">${esc(code)}</a>`;
  const hdNccName = (code) => window.Thau.kit.nccName(code);
  const HD_NOTES = () => ['Hồ sơ con của hợp đồng (D-47): hợp đồng là đối tượng cha, mỗi luồng MS22, MS23.x, MS24 là một hồ sơ, một process instance. Mã hợp đồng thay Mã nhiệm vụ, bấm mở Chi tiết hợp đồng.',
    'Chỉ HĐ-2026-0052 có hồ sơ chạy luồng (D-48); hợp đồng mẫu khác xem tĩnh.'];
  const hdBpmnNotes = (page) => [`Sơ đồ vẽ lại từ BPMN chuẩn ĐTMS-121026.drawio · trang "${esc(page)}" (sinh bằng tools/bpmn-diagram-extract.mjs). Bản thật dùng app-bpmn-viewer (bpmn-js) đọc XML của quy trình đã deploy.`,
    'Bước đang xử lý tô theo ACTIVE_STEP_PAINT của source; nhiều việc song song thì tô cả.'];

  function sampleDetail(code, sub) {
    const c = allCases().find((x) => x.code === code);
    if (!c) return `<div class="pg">${head({ title: 'Chi tiết hồ sơ', back: 'ho-so-dxms', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy hồ sơ.</div></section></div>`;
    if (c.live) return caseDetail(sub);
    const vm = sampleVm(c);
    return sub === 'bpmn' ? bpmnPage(vm) : detailPage(vm);
  }

  /* Xem BPMN từ màn xử lý task (my-task-bpmn-detail): "Chi tiết hồ sơ" 22px, Thông tin chung 3 cột, sơ đồ 500px. */
  function taskBpmn(tokenId) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/my-tasks/my-task-bpmn-detail/my-task-bpmn-detail.component.html
    const tok = Flow.token(tokenId);
    const info = { scr: 'SCR-20', name: 'Xem BPMN từ màn xử lý task', src: 'my-tasks/my-task-bpmn-detail · /my-tasks/:id/bpmn', notes: Flow.state.parent ? hdBpmnNotes(Flow.state.vars.process) : Flow.state.kdt ? kdtBpmnNotes('MS13') : bpmnNotes() };
    if (!tok) {
      return `<div class="pg tight">${head({ title: 'Chi tiết hồ sơ', back: true, lg: true, info })}
        <section class="vcard pad24"><div class="empty-t">Không tìm thấy nhiệm vụ.</div></section></div>`;
    }
    const ci = Flow.ci(), t = TT()[tok.task], f = Flow.def()[tok.task];
    const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    return `<div class="pg tight">
      ${head({ title: 'Chi tiết hồ sơ', back: 'task/' + tok.id, lg: true, info })}
      <section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo c3">
        ${kv('Mã hồ sơ', esc(ci.code))}${kv('Tên hồ sơ', esc(ci.name))}${ci.isHd ? kv('Mã hợp đồng', hdRef(ci.hd)) : ci.isKdt ? kv('Mã KĐT', kdtRef(ci.kdt)) : kv('Mã ĐXMS', dxmsRef(ci.dxms))}
        ${kv('Công việc', esc(t.name + (tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : '')))}${kv('Người xử lý', esc(persona(tok.who).name))}${kv('Hạn xử lý', Flow.dateOf(tok.since + Math.max(1, Math.ceil((f.nlv || 0.5) * 2))))}
        ${kv(ci.isHd ? 'Đơn vị quản lý' : 'Đơn vị đề xuất', esc(ci.unit))}${kv(ci.isKdt ? 'Tổng mức vốn (gồm VAT)' : ci.isHd ? 'Giá trị hợp đồng (gồm thuế GTGT)' : 'Tổng giá trị (gồm VAT)', ty(ci.total) + ' tỷ đồng')}${ci.isHd ? kv('Nhà thầu', esc(hdNccName(ci.ncc))) : ci.isKdt ? kv('Nhóm KĐT', esc(kdtGroupText(ci))) : kv('Mức ưu tiên', esc(ci.priority))}</div></section>
      <section class="vcard pad24"><div class="bp-h"><h2>Bước hiện tại: ${esc(t.name + (ci.isKdt && kdtRoundOf(tok.task) ? ` (${kdtRoundOf(tok.task)})` : ''))}</h2><p>${esc(ci.isHd ? `${ci.flow} — ${D.hdProcesses[ci.flow].name}` : ci.isKdt ? kdtProcText('MS13') : procLabel(ci.flow))}</p></div>
        ${BpmnView.html('task/' + tok.id, [String(tok.task)], 500, ci.isHd ? { page: D.hdProcesses[ci.flow].page, focus: [String(tok.task)] } : ci.isKdt ? { page: 'MS13', focus: [String(tok.task)] } : undefined)}</section></div>`;
  }

  /* ---------- Màn xử lý task ---------- */
  /* Giờ trong ngày của mốc NLV: 08:00 + phần lẻ × 8 giờ làm việc (dd/MM/yyyy HH:mm như Lịch sử hồ sơ của source). */
  const dateTimeOf = (n) => { const m = Math.round((n % 1) * 480); return `${Flow.dateOf(n)} ${pad2(8 + Math.floor(m / 60))}:${pad2(m % 60)}`; };
  const sinceOf = (h) => (h.since != null ? h.since : Math.max(0, h.t - ((Flow.def()[h.task] || {}).nlv || 0.5)));
  const isUserTask = (k) => Flow.isTask(k) && TT()[k].type !== 'service';
  /* Hồ sơ KĐT: mã KĐT mở Chi tiết KĐT; nhóm KĐT do hệ thống xác định ở cổng phân luồng (D-7). */
  const kdtRef = (code) => `<a class="link-red" href="#/kdt/${encodeURIComponent(code)}">${esc(code)}</a>`;
  const kdtGroupText = (ci) => (ci.group ? D.kdtGroups[ci.group] : 'Chưa xác định nhóm');
  /* Vòng thẩm định của việc trong khối chung 25–38 (D-32) — ghi kèm tên bước. */
  const KDT_ROUND = { GOP: 'Thẩm định hồ sơ gộp BM-00', CT: 'Thẩm định chủ trương BM-01', KDT: 'Thẩm định KĐT BM-03' };
  /* Khối chung 25–38: vòng thẩm định; khối ký chung 76–78: văn bản và bước ký đã gọi khối (vars.ky). */
  const kdtRoundOf = (task) => {
    const n = Number(task), ky = Flow.state.vars.ky;
    if (n >= 75 && ky) return `ký ${ky.doc} — bước ${ky.task}`;
    return n >= 25 && n <= 38 ? KDT_ROUND[Flow.state.vars.td || 'GOP'] : '';
  };
  /* 3 trong 04 yếu tố phân luồng, lấy từ khoản đầu tư (khoá) — Thông tin chung của màn task KĐT (B0.4: loại K, không lặp trong eForm). */
  const kdtFactors = (ci) => {
    const k = Flow.findKdt(ci.kdt) || {}, cat = (key, code) => ((window.Catalog ? window.Catalog.rows(key) : []).find((r) => r.code === code) || {}).name || code || '-';
    const kv = (a, b) => `<div><div class="k">${a}</div><div class="v clamp">${esc(b)}</div></div>`;
    return kv('Lĩnh vực', cat('linh-vuc', k.field)) + kv('Loại KĐT', cat('loai-kdt', k.type)) + kv('Tính chất tài sản', cat('tinh-chat-tai-san', k.nature));
  };

  /* Bước của vht-steps: task người dùng của quy trình đã chọn theo thứ tự BPMN; 10a chỉ hiện khi hồ sơ đã đi qua. */
  function processSteps() {
    const keys = [], last = Flow.state.parent ? Object.keys(TT()).length : Flow.state.kdt ? 78 : 61;
    for (let n = 1; n <= last; n++) { keys.push(n); if (n === 10 && TT()['10a']) keys.push('10a'); }
    return keys.filter((k) => isUserTask(k) && !['na', 'cond'].includes(Flow.taskStatus(k)))
      .map((k) => {
        const st = Flow.taskStatus(k);
        return { title: TT()[k].name, sub: Flow.state.kdt ? kdtActor(TT()[k].actor) : TT()[k].actor.replace(/\s*\[[^\]]*\]/g, ''), state: st === 'active' ? 'active' : st === 'done' ? 'completed' : 'upcoming' };
      });
  }

  /* Lịch sử hồ sơ: mỗi lượt task người dùng (Hoàn thành) và việc đang chờ (Chưa xử lý), cũ → mới. */
  function caseHistory() {
    const done = Flow.state.history.filter((h) => h.who && isUserTask(h.task))
      .map((h) => ({ title: TT()[h.task].name, st: 'COMPLETED', who: h.who, at: sinceOf(h), note: h.reason || '' }));
    const open = Flow.state.tokens.filter((t) => isUserTask(t.task)).map((t) => ({ title: TT()[t.task].name, st: 'CREATED', who: t.who, at: t.since, note: '' }));
    return done.concat(open).sort((a, b) => a.at - b.at);
  }
  let histNotes = [];
  /* items: { title, st: COMPLETED | CREATED, who|name, at|when, note }; cls: trail (màn task) | drail (chi tiết hồ sơ). */
  function historyCard(items, cls) {
    items = items || caseHistory();
    histNotes = items.map((x) => x.note);
    const HS = { COMPLETED: ['Hoàn thành', 'success', '#5fe495'], CREATED: ['Chưa xử lý', 'info', '#ee0033'] };
    return `<section class="vcard pad24 ${cls || 'trail'}"><h3>Lịch sử hồ sơ</h3>${items.length ? `<ul class="vtl">${items.map((x, i) => `<li><span class="mk" style="border-color:${HS[x.st][2]}"></span><div>
        <div class="top"><span class="ti">${esc(x.title)}</span>${badge(HS[x.st][0], HS[x.st][1])}</div>
        ${x.st === 'COMPLETED' ? `<div class="cap">${esc(x.name || persona(x.who).name)} - ${x.when || dateTimeOf(x.at)}</div>` : ''}
        ${x.note ? `<div class="mt8"><button class="vbtn sm red" data-note="${i}">Xem nhận xét</button></div>` : ''}</div></li>`).join('')}</ul>`
      : '<div class="empty-t">Chưa có lịch sử xử lý.</div>'}</section>`;
  }

  /* Danh sách tài liệu: tệp đưa lên hồ sơ (căn cứ, báo giá, kết quả tồn kho, tệp ký nháy, tệp người dùng tải lên). */
  function caseFiles() {
    if (Flow.state.parent) return window.EForms.hd.files();
    const u = Flow.ui, at = (k) => { const h = Flow.lastOf(k); return h ? Flow.dateOf(h.t) : null; };
    const code = Flow.ci().code.replace('Đ', 'D');
    const docs = D.basisDocsFor(Flow.state.vars.process);
    const basis = docs.find((d) => d.id === (u.basisDoc || D.caseRef.basisDoc)) || docs[0];
    const rows = [];
    if (at(1)) rows.push({ name: basis.no.replace(/\//g, '-') + '.pdf', at: at(1) });
    if (at(5)) rows.push({ name: D.caseRef.ebom, at: at(5) });
    if (at(7)) rows.push({ name: D.caseRef.rstk + '.xlsx', at: at(7) });
    const qName = (c) => `Bao-gia-${(D.nccOf(c).short || c).replace(/^NCC /, '')}.pdf`;
    if (Flow.state.kdt) {
      if (Flow.lastOf(10) && Flow.state.history.some((h) => h.task === 10 && (h.action === 'Báo giá đạt' || h.action.startsWith('Chốt tổng mức vốn')))) D.quotes.forEach((q) => rows.push({ name: qName(q.ncc), at: at(10) }));
    } else D.quotes.forEach((q) => { if (u['quote_' + q.ncc]) rows.push({ name: qName(q.ncc), at: at(10) || Flow.dateOf(Flow.state.clock) }); });
    const clock = Flow.dateOf(Flow.state.clock);
    if (u.bm03File) rows.push({ name: `BM-03_${code}_ky-nhay.pdf`, at: at(16) || clock });
    if (u.kMinutes) rows.push({ name: `Bien-ban-hop-${code}.pdf`, at: at(32) || clock });
    if (u.minutesFile) rows.push({ name: `Bien-ban-hop-${code}.pdf`, at: at(32) || clock });
    if (u.bm06File) rows.push({ name: 'BM-06_ky-nhay.pdf', at: at(51) || clock });
    if (u.tdReviewFile) rows.push({ name: `Phieu-nhan-xet-Tap-doan_${code}.pdf`, at: clock });
    /* T29 F7: phụ lục của Tờ trình đã tải lên ở bước lập dự thảo. */
    if (!Flow.state.kdt) D.phuLuc.forEach(([key, name]) => { if (u[key]) rows.push({ name: `${name}_${code}.pdf`, at: at(window.EVars.h.draftTask()) || clock }); });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  }
  /* Văn bản đầu ra: biểu mẫu hệ thống sinh ở các bước đã xong. */
  /* KĐT: văn bản đầu ra theo Flow.kdtDocs() — BM-01 (TGĐ VHT ký duyệt chủ trương, bước 48), BM-14 (TTMS ký báo cáo thẩm định, 57 / 61),
     BM-18 (TGĐ VHT ký Quyết định, 60), BM-00 + BM-18 (TGĐ VHT ký hồ sơ gộp, 62). */
  const KDOC_NAME = { 'BM-01': 'Tờ trình chủ trương KĐT (đã phê duyệt)', 'BM-14': 'Báo cáo kết quả thẩm định KĐT', 'BM-18': 'Quyết định phê duyệt KĐT',
    'BM-00': 'Hồ sơ chủ trương và KĐT (văn bản gộp, đã phê duyệt)', 'CV-TD': 'Công văn trình Tập đoàn (đã ký)', 'BM-06': 'Báo cáo giải trình, tiếp thu ý kiến Tập đoàn' };
  const outputDocs = () => (Flow.state.parent ? window.EForms.hd.outs() : Flow.state.kdt ? Flow.kdtDocs().map((d) => ({ code: d.code, name: `${d.code} ${KDOC_NAME[d.code]}${d.td ? ' — cấp Tập đoàn' : ''}`, at: d.at }))
    : DOCS.filter((d) => Flow.taskStatus(d.by) === 'done').map((d) => ({ code: d.code, name: `${d.code} ${Flow.state.vars.adj ? adjDocName(d) : d.name}`, at: Flow.dateOf((Flow.lastOf(d.by) || {}).t || 0) })));
  /* MS02: Tờ trình và Quyết định là bản điều chỉnh (BM-01 / BM-09 / BM-08 có mục Nội dung điều chỉnh). */
  const adjDocName = (d) => ({ 'BM-01': 'Tờ trình điều chỉnh ĐXMS', 'BM-09': 'Tờ trình điều chỉnh ĐXMS (thẩm định, phê duyệt trực tiếp)', 'BM-08': 'Quyết định phê duyệt điều chỉnh ĐXMS' }[d.code] || d.name);
  let lastOuts = [];
  const OUT_TONE = { 'AI đã gợi ý': 'info', 'Đang làm': 'warning', 'Hoàn thành': 'success' };

  const docTable = (cols, rows, cell) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r, i)}</tr>`).join('') || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>`;

  let moreOpen = false;
  window.addEventListener('hashchange', () => { moreOpen = false; });

  function taskScreen(tokenId) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/my-tasks/my-task-detail/my-task-detail.component.html
    //       + shared/constants/my-task-document-columns.constants.ts, my-task-output-document-columns.constants.ts, my-task.constants.ts
    const tok = Flow.token(tokenId);
    if (!tok) {
      return `<div class="pg">${head({ title: 'Xem chi tiết hồ sơ', back: true, lg: true })}
        <section class="vcard pad24"><div class="empty-t">Không tìm thấy nhiệm vụ.</div></section></div>`;
    }
    const t = TT()[tok.task], f = Flow.def()[tok.task], scrId = Flow.scrOf(tok.task), scr = D.screens[scrId] || { name: t.name };
    const ci = Flow.ci(), owner = persona(tok.who), mine = tok.who === Flow.state.persona || D.allAccess(Flow.state.persona);
    /* Nội dung riêng của bước nằm trong eForm (dialog khi bấm nút) — task-forms.js; (i) mang ghi chú của form. */
    const ba = window.TaskForms ? window.TaskForms.info(tok) : { notes: [], q: [] };
    const choices = f.choices ? Flow.choices(tok.task) : [{ label: f.actionLabel || 'Hoàn thành', main: true, next: true }];
    const qs = qFor(ci.flow, (D.screenQ[scrId] || []).concat(f.q || [], ba.q, choices.some((c) => c.sign) ? ['P-16'] : []));

    /* Nút theo my-task-detail: chính primary, phụ viền đỏ, Xem BPMN viền đỏ, còn lại vào Thao tác khác.
       lockWhen: nút vẫn hiện nhưng không bấm được (vd. "Có báo cáo TGĐ Tập đoàn" với hồ sơ MS01.02). */
    const mc = Flow.mainChoice(tok.task);
    /* T24 Q1: chỉ nút có luật đang Kích hoạt (available-actions), nhãn theo Tên hiển thị của luật. */
    const list = choices.map((c, i) => {
      const a = window.MaTran.allowed(ci.flow, tok.task, c.label, Flow.state.persona);
      return { c: a.label === c.label ? c : Object.assign({}, c, { label: a.label }), idx: c.next ? -1 : i, main: !!c.next || (mc && mc.label === c.label), show: a.show };
    }).filter((x) => x.show);
    const main = list.filter((x) => x.main), rest = list.filter((x) => !x.main);
    const side = rest.slice(0, 1), other = rest.slice(1);
    const actBtn = (x, cls) => `<button type="button" class="vbtn ${cls}" data-act="${tok.id}" data-choice="${x.idx}" ${x.c.lockWhen && x.c.lockWhen(Flow.state.vars) ? 'disabled' : ''}>${esc(x.c.label)}</button>`;
    /* f.wip: màn của task chưa dựng (KĐT B3/B4) — chưa có nút hành động. */
    const acts = `${window.ThamDinh.ghiLaiBtn(tok, mine && !f.wip)}${mine && !f.wip ? main.map((x) => actBtn(x, 'primary')).join('') + side.map((x) => actBtn(x, 'red')).join('') : ''}
      ${ci.isKdt || ci.isHd ? '' : window.Luong.taskBtn(tok, mine)}<button type="button" class="vbtn red" data-go="task/${tok.id}/bpmn">Xem BPMN</button>
      ${mine && !f.wip && other.length ? `<div class="more"><button type="button" class="vbtn secondary" data-more>Thao tác khác ${icon('chev')}</button>
        ${moreOpen ? `<div class="more-pop">${other.map((x) => actBtn(x, 'ghost')).join('')}</div>` : ''}</div>` : ''}`;

    const due = Flow.dateOf(tok.since + Math.max(1, Math.ceil((f.nlv || 0.5) * 2)));
    const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    const round = Flow.state.vars.round;
    /* Hồ sơ KĐT: Mã KĐT thay Mã ĐXMS; Quy trình = Nhóm KĐT (chưa xác định trước cổng phân luồng), Nhánh hồ sơ; tổng mức vốn thực tế có sau khi chốt ở bước 10. */
    const priced = ci.isKdt && Flow.state.history.some((h) => String(h.task) === '10' && h.who);
    const info = ci.isHd ? `${kv('Mã hồ sơ', esc(ci.code))}${kv('Tên hồ sơ', esc(ci.name))}${kv('Mã hợp đồng', hdRef(ci.hd))}${kv('Loại hồ sơ', esc(D.hdProcesses[ci.flow].type))}
      ${kv('Quy trình', `${esc(ci.flow)} — ${esc(D.hdProcesses[ci.flow].name)}`)}${kv('Công việc', esc(t.name))}${kv('Hạn xử lý', due)}${kv('Đơn vị quản lý', esc(ci.unit))}
      ${kv('Đầu mối theo dõi', esc(ci.owner))}${kv('Nhà thầu', esc(hdNccName(ci.ncc)))}${kv('Giá trị hợp đồng (gồm thuế GTGT)', ty(ci.total) + ' tỷ đồng')}`
      : ci.isKdt ? `${kv('Mã hồ sơ', esc(ci.code))}${kv('Tên hồ sơ', esc(ci.name))}${kv('Mã KĐT', kdtRef(ci.kdt))}${kv('Loại hồ sơ', 'Phê duyệt KĐT')}
      ${kv('Quy trình', esc(ci.group ? D.kdtGroups[ci.group] : 'Chưa xác định nhóm (MS13 · MS14 · MS15)'))}${kv('Công việc', esc(t.name + (tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : '') + (ci.isKdt && kdtRoundOf(tok.task) ? ` · ${kdtRoundOf(tok.task)}` : '')))}
      ${kv('Hạn xử lý', due)}${kv('Đơn vị đề xuất', esc(ci.unit))}${kv('Người phụ trách', esc(persona('minh').name))}
      ${kdtFactors(ci)}
      ${priced ? kv('Tổng mức vốn thực tế (gồm VAT)', ty(ci.total) + ' tỷ đồng') : kv('Tổng mức vốn dự kiến', ci.est != null ? ty(ci.est) + ' tỷ đồng' : null)}${kv('Nguồn vốn', esc(ci.fund))}${kv('Thời gian thực hiện', esc(ci.period))}
      ${kv('Nhánh hồ sơ', ci.branch ? esc(D.kdtBranches[ci.branch]) : null)}${kv('Mật', ci.secret ? 'Có' : 'Không')}`
      : `${kv('Mã hồ sơ', esc(ci.code))}${kv('Tên hồ sơ', esc(ci.name))}${kv('Mã ĐXMS', dxmsRef(ci.dxms))}${kv('Loại hồ sơ', esc(kindLabel('PD')))}
      ${kv('Quy trình', `${esc(ci.flow)} — ${esc((D.processes[ci.flow] || {}).name || '')}`)}${kv('Công việc', esc(t.name + (tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : '')))}
      ${kv('Hạn xử lý', due)}${kv('Đơn vị đề xuất', esc(ci.unit))}${kv('Người phụ trách', esc(persona('minh').name))}
      ${kv('Tổng giá trị (gồm VAT)', ty(ci.total) + ' tỷ đồng')}${kv('Nguồn vốn', esc(ci.fund))}${kv('Thời gian thực hiện', esc(ci.period))}${kv('Mức ưu tiên', esc(ci.priority))}
      ${kv('Mật', ci.secret ? 'Có' : 'Không')}${round ? kv('Vòng giải trình', `${round}/2`) : ''}
      ${Flow.state.replaces ? kv('Thay thế cho', esc(Flow.state.replaces)) : ''}`;

    /* E3: tài liệu bắt buộc của hành động chưa có → dòng "chưa tải lên" kèm nút tải lên; Văn bản đầu ra = dự thảo của bước + văn bản đã sinh. */
    const need = mine ? window.EVars.reqDocs(tok).filter((x) => !x.have).map((x) => ({ name: x.name, at: '-', req: x.key, opt: x.opt, only: x.only })) : [];
    const files = need.concat(caseFiles());
    const done = outputDocs();
    const st0 = window.TaskForms ? window.TaskForms.draftState(tok) : 'Đang làm';
    const outs = (window.TaskForms ? window.TaskForms.outputs(tok).filter((d) => !done.some((x) => x.code === d.code)).map((d) => Object.assign({ at: Flow.dateOf(Flow.state.clock), st: st0 }, d)) : [])
      .concat(done.map((d) => Object.assign({ st: 'Hoàn thành' }, d)));
    lastOuts = outs;
    const infoSpec = {
      scr: scrId, name: scr.name, bpmn: `Task ${tno(tok.task)} · ${t.name} · Actor: ${t.actor} · Biểu mẫu: ${t.form}`, q: qs,
      notes: (mine ? (tok.who !== Flow.state.persona ? [`Việc này giao cho <b>${esc(owner.name)}</b> (${esc(owner.role)}); tài khoản toàn quyền xử lý thay.`] : []) : [`Việc này giao cho <b>${esc(owner.name)}</b> (${esc(owner.role)}); đang xem với tài khoản ${esc(persona(Flow.state.persona).name)} nên không có nút hành động. <button class="vbtn sm red" data-persona="${owner.id}" data-stay="1">Chuyển tài khoản</button>`])
        .concat(['Tiêu đề "Xem chi tiết hồ sơ" và bố cục lấy nguyên từ my-task-detail: nút hành động trên hàng tiêu đề, lưới 5 + 2 cột, Lịch sử hồ sơ bên phải.',
          'Quy trình: các bước người dùng của quy trình đã chọn (không gồm bước hệ thống, bước của quy trình khác); vht-steps tự gộp bước thành +N.',
          '"Xem BPMN" mở màn Chi tiết hồ sơ + sơ đồ BPMN, tô bước của việc này (my-task-bpmn-detail).'], ba.notes, window.ThamDinh.applies(tok) ? window.ThamDinh.notes() : [],
        ci.isHd ? HD_NOTES().concat([esc(t.note), `Trang ${esc(ci.flow)}.`]) : ci.isKdt ? [esc(t.note), `Trang MS13, lane: ${esc(t.lane || '')}.`].concat(f.wip ? ['Nội dung xử lý của bước này dựng ở bước sau của plan KĐT — chưa có nút hành động.'] : [])
          : [esc(t.note), t.old ? `Số task ở bản 58 task cũ: ${esc(t.old)}` : /[ab]$/.test(String(tok.task)) ? 'Task mới — nhánh không khớp quy trình (N08, chốt 2026-09-28).' : 'Task mới ở v1.1.']),
      src: 'my-tasks/my-task-detail · /my-tasks/:taskId?profileId=',
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết hồ sơ', back: true, lg: true, info: infoSpec, right: `<div class="task-acts">${acts}</div>` })}
      <div class="tgrid"><div class="tmain">
        <section class="vcard pad24"><h3>Thông tin chung</h3><div class="ginfo">${info}</div></section>
        ${window.ThamDinh.card(tok)}
        <section class="vcard pad24"><h3>Quy trình</h3>${UI.vSteps({ id: ci.code, steps: processSteps() })}</section>
        <section class="vcard pad24"><div class="vcard-h"><h3>Danh sách tài liệu</h3>${mine ? `<div class="row">
            <button type="button" class="vbtn secondary" data-tpl="${esc(tok.id)}">${icon('file')} Chọn mẫu tài liệu</button>
            <button type="button" class="vbtn red" data-upload>${icon('upload')} Tải file lên</button><input type="file" id="up-file" hidden></div>` : ''}</div>
          ${docTable([['Thao tác', 100, 'c'], ['Tên tài liệu', 260], ['Ngày tạo', 130]], files, (r) => (r.req
    ? `<td class="c"><div class="acts">${iconBtn('upload', 'Tải lên', `data-req-up="${esc(r.req)}"`)}</div></td><td><span class="clamp doc-req ${r.opt ? 'opt' : ''}">${esc(r.name)} — ${r.opt ? 'nếu có, chưa tải lên' : 'bắt buộc, chưa tải lên'}</span></td><td>-</td>`
    : `<td class="c"><div class="acts">${iconBtn('download', 'Tải tài liệu', `data-dl="${esc(r.name)}"`)}${mine && r.up != null ? `<span class="sep"></span>${iconBtn('del', 'Xóa tài liệu', `data-del-up="${r.up}"`)}` : ''}</div></td>
            <td><span class="clamp">${esc(r.name)}</span></td><td>${esc(r.at)}</td>`))}</section>
        <section class="vcard pad24"><h3>Văn bản đầu ra</h3>
          ${docTable([['Thao tác', 112, 'c'], ['Tên tài liệu', 260], ['Trạng thái', 130, 'c'], ['Ngày tạo', 130]], outs, (r, i) => `<td class="c"><div class="acts">${iconBtn('download', 'Tải văn bản đầu ra', `data-dl="${esc(r.name)}"`)}<span class="sep"></span>${dlPdf(r.name)}</div></td>
            <td><button type="button" class="link-btn" data-preview="${i}">${esc(r.name)}</button></td><td class="c">${badge(r.st, OUT_TONE[r.st])}</td><td>${esc(r.at)}</td>`)}</section>
      </div>${historyCard()}</div></div>`;
  }

  /* Sự kiện của màn xử lý task. */
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-more]')) { moreOpen = !moreOpen; rerender(); return; }
    if (moreOpen && !t.closest('.more-pop')) { moreOpen = false; rerender(); }
    const n = t.closest('[data-note]');
    if (n) {
      UI.vModal({ title: 'Xem chi tiết nhận xét', body: `<div class="note-view"><span class="k">Nội dung nhận xét</span><span class="v">${esc(histNotes[Number(n.dataset.note)])}</span></div>`,
        actions: '<button class="vbtn secondary" data-close>Đóng</button>' });
      return;
    }
    const dl = t.closest('[data-dl]');
    if (dl) { UI.toast(`<b>Thành công</b><br>Đã tải xuống ${esc(dl.dataset.dl)}.`); return; }
    const pd = t.closest('[data-preview-doc]');
    if (pd) {
      const [name, at, code] = pd.dataset.previewDoc.split('|');
      const c = allCases().find((x) => x.code === code) || { title: Flow.state.parent ? Flow.ci().name : '' };
      /* Hồ sơ đang chạy luồng: xem trước văn bản (mẫu Word + dữ liệu eForm) như ở màn xử lý task. */
      const doc = (c.live && !Flow.state.kdt) || Flow.state.parent ? window.EVars.doc(name.split(' ')[0]) : null;
      UI.vModal({ title: name, size: doc ? 'lg' : 'md', body: `<div class="ginfo"><div><div class="k">Mã hồ sơ</div><div class="v">${esc(code)}</div></div>
          <div><div class="k">Ngày tạo</div><div class="v">${esc(at)}</div></div><div class="full"><div class="k">Tên hồ sơ</div><div class="v">${esc(c.title)}</div></div></div>
          ${doc ? `<div class="pdf-view">${doc.html}</div>` : ''}`,
        actions: `<button class="vbtn secondary" data-close>Đóng</button><button class="vbtn primary" data-close data-dl="${esc(name)}">${icon('download')} Tải xuống</button>` });
      return;
    }
    const pv = t.closest('[data-preview]');
    if (pv) {
      /* Xem trước PDF: mẫu Word của biểu mẫu + dữ liệu eForm (ProfileTaskFormService — preview / download). */
      const d = lastOuts[Number(pv.dataset.preview)], doc = d && d.code ? window.EVars.doc(d.code) : null;
      UI.vModal({ title: d.name, size: doc ? 'lg' : 'md', body: `<div class="ginfo"><div><div class="k">Mã hồ sơ</div><div class="v">${esc(Flow.ci().code)}</div></div>
          <div><div class="k">Ngày tạo</div><div class="v">${esc(d.at)}</div></div><div class="full"><div class="k">Tên hồ sơ</div><div class="v">${esc(Flow.ci().name)}</div></div></div>
          ${doc ? `<div class="pdf-view">${doc.html}</div>` : ''}`,
        actions: `<button class="vbtn secondary" data-close>Đóng</button><button class="vbtn primary" data-close data-dl="${esc(d.name)}">${icon('download')} Tải xuống</button>` });
      return;
    }
    const ru = t.closest('[data-req-up]');
    if (ru) { Flow.setUi(ru.dataset.reqUp, true); UI.toast('<b>Thành công</b><br>Đã tải tài liệu lên hồ sơ.'); return; }
    if (t.closest('[data-upload]')) { document.getElementById('up-file').click(); return; }
    const del = t.closest('[data-del-up]');
    if (del) {
      const m = UI.vModal({ title: 'Xóa tài liệu', body: '<div>Bạn có chắc chắn muốn xóa tài liệu này khỏi hồ sơ?</div>',
        actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="del-ok">Xóa</button>' });
      m.el.querySelector('#del-ok').onclick = () => {
        m.close();
        const ups = (Flow.ui.uploads || []).slice(); ups.splice(Number(del.dataset.delUp), 1);
        Flow.setUi('uploads', ups); UI.toast('<b>Thành công</b><br>Đã xóa tài liệu khỏi hồ sơ.');
      };
      return;
    }
    if (t.closest('[data-tpl]')) templateDialog(t.closest('[data-tpl]').dataset.tpl);
  });
  document.addEventListener('change', (e) => {
    if (e.target.id !== 'up-file' || !e.target.files.length) return;
    const f = e.target.files[0];
    Flow.setUi('uploads', (Flow.ui.uploads || []).concat([{ name: f.name, at: Flow.dateOf(Flow.state.clock) }]));
    UI.toast('<b>Thành công</b><br>Đã tải tài liệu lên hồ sơ.');
  });

  /* Danh sách tài liệu mẫu (my-task-template-dialog): đếm tệp, tìm kiếm 260px, bảng có ô chọn, Đóng / Tải xuống (n). */
  /* Comment #24: chỉ mẫu thuộc quy trình đang chạy (MS01.03 dùng BM-09 + Checklist 02, không có BM-01/05…08); mặc định lọc mẫu của bước này.
     Nguồn: Ma trận hành động "Biểu mẫu sử dụng" theo task + quy trình (SCR-44). */
  const SMALL_ONLY = ['BM-09', 'CL02'], BIG_ONLY = ['BM-01', 'CL01', 'BM-05', 'BM-06', 'BM-07', 'BM-08'];
  function templateDialog(tokId) {
    const tok = tokId && Flow.token(tokId), small = Flow.isSmall();
    const mineCodes = tok && window.TaskForms ? window.TaskForms.outputs(tok).map((d) => d.code) : [];
    const seen = new Set();
    const TPL = (Flow.state.parent ? window.EForms.hd.docs : DOCS).filter((d) => !(small ? BIG_ONLY : SMALL_ONLY).includes(d.code) && !seen.has(d.code) && seen.add(d.code)).map((d) => ({
      file: `${d.code}_${d.name}.docx`, step: (TT()[d.by] || {}).name || '', here: (tok && d.by === tok.task) || mineCodes.includes(d.code) }));
    let onlyHere = TPL.some((x) => x.here);
    const sel = new Set();
    const m = UI.vModal({ title: 'Danh sách tài liệu mẫu', size: 'lg', body: `<div class="vcard-h"><span class="cnt"></span>
        <div class="row"><label class="check"><input type="checkbox" id="tpl-here" ${onlyHere ? 'checked' : ''}> Chỉ mẫu của bước này</label>
        <label class="vsearch" style="width:260px">${icon('search')}<input id="tpl-q" placeholder="Tìm kiếm tệp"></label></div></div>
        <div class="tpl-sub cap">Quy trình ${esc(Flow.ci().flow || '')}${tok ? ` · bước hiện tại: ${esc((TT()[tok.task] || {}).name || '')}` : ''}</div>
        <div class="vtable-vp" style="height:320px"><table class="vtable"><thead><tr><th class="ord"><input type="checkbox" id="tpl-all"></th><th>Tên tài liệu</th><th style="width:260px">Bước sử dụng</th><th class="c" style="width:80px">Thao tác</th></tr></thead><tbody></tbody></table></div>`,
      actions: '<button class="vbtn secondary" data-close>Đóng</button><button class="vbtn primary" id="tpl-dl" disabled>Tải xuống</button>' });
    const fill = () => {
      const q = UI.norm(m.el.querySelector('#tpl-q').value);
      const rows = TPL.filter((x) => (!onlyHere || x.here) && UI.norm(x.file).includes(q));
      m.el.querySelector('.cnt').textContent = `${rows.length} tệp`;
      m.el.querySelector('tbody').innerHTML = rows.map((r) => { const x = r.file; return `<tr><td class="ord"><input type="checkbox" data-tpl-row="${esc(x)}" ${sel.has(x) ? 'checked' : ''}></td>
        <td><span class="row">${icon('file')}<span class="clamp">${esc(x)}</span></span></td><td><span class="clamp">${esc(r.step)}</span>${r.here ? ' ' + badge('Bước này', 'info') : ''}</td><td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(x)}"`)}</td></tr>`; }).join('')
        || `<tr><td class="vtable-empty" colspan="4">Bước này không dùng biểu mẫu — bỏ chọn "Chỉ mẫu của bước này" để xem mẫu của cả quy trình</td></tr>`;
      const b = m.el.querySelector('#tpl-dl');
      b.disabled = !sel.size; b.textContent = sel.size ? `Tải xuống (${sel.size})` : 'Tải xuống';
    };
    m.el.querySelector('#tpl-q').oninput = fill;
    m.el.addEventListener('change', (e) => {
      if (e.target.id === 'tpl-here') onlyHere = e.target.checked;
      if (e.target.id === 'tpl-all') TPL.filter((x) => !onlyHere || x.here).forEach((x) => (e.target.checked ? sel.add(x.file) : sel.delete(x.file)));
      const r = e.target.dataset.tplRow;
      if (r) { if (e.target.checked) sel.add(r); else sel.delete(r); }
      fill();
    });
    m.el.querySelector('#tpl-dl').onclick = () => { m.close(); UI.toast(`<b>Thành công</b><br>Đã tải xuống ${sel.size} tệp.`); };
    fill();
  }

  /* ---------- Phân hệ chưa dựng → màn "Đang phát triển" (A7) ---------- */
  function phanHe(item, group) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/coming-soon
    /* Mục menu theo Backlog (D-15): ghi module Backlog và bước plan T16 sẽ dựng; mục cũ (D.oldMenu) ghi UC của use-case. */
    const bl = (group && group.bl) || item.bl;
    const due = (group && group.due) || item.due;
    const notes = item.notes ? item.notes : bl ? [`Backlog (BA-TD): ${esc(bl)}${item.bl ? '' : ' › ' + esc(item.label)}. Dựng ở bước ${esc(due)} của plan T16 (D-17: màn tĩnh, không chạy luồng).`]
      : group ? ['Ngoài phạm vi prototype đợt này.'] : ['Mục cũ theo use-case, không có trong Backlog nên đã bỏ khỏi menu (D-15); route giữ để không gãy liên kết.'];
    const info = { scr: bl ? 'Module ' + bl : 'Phân hệ ' + ((group && group.ph) || item.ph || '—'), name: item.label,
      notes: notes.concat((item.uc || []).map((u) => `${u} — ${esc(D.ucNames[u] || '')}`)), src: 'features/coming-soon' };
    return `<div class="soon"><section>
      <div class="ill"><span><span>${icon('rocket')}</span></span></div>
      <div class="txt"><h1>Tính năng đang được phát triển${infoBtn(info)}</h1>
        <p>Phân hệ này hiện đang trong quá trình thiết kế và triển khai để đem lại trải nghiệm tốt nhất. Vui lòng quay lại sau.</p></div>
      <button class="vbtn sm primary" data-back>Quay lại danh sách</button></section>
      <p class="foot">© 2026 Phát triển bởi VTIT • ${esc(D.product.name)}</p></div>`;
  }

  function tongQuan() {
    const counts = D.personas.filter((p) => !p.all).map((p) => [p, Flow.tokensFor(p.id).length]).filter((x) => x[1]);
    return `<div class="page">
      <div class="page-head"><div><h1>Tổng quan ${infoBtn({ scr: 'Tổng quan', uc: 'UC-13-01', notes: ['Dashboard đầy đủ ngoài phạm vi đợt này; bốn ô số liệu là dữ liệu mẫu.'] })}</h1></div></div>
      <div class="personas" style="margin-bottom:16px">
        ${[['ĐXMS đang xử lý', 3], ['ĐXMS đã phê duyệt năm 2026', 2], ['Tổng giá trị đang thẩm định', ty(D.caseInfo.total + 45.2 + 12.4) + ' tỷ'], ['Hồ sơ sắp quá hạn KPI', 1]]
          .map(([k, v]) => `<div class="card card-pad"><div class="muted" style="font-size:13px">${k}</div><div style="font-size:26px;font-weight:600;margin-top:4px" class="num">${v}</div></div>`).join('')}
      </div>
      <div class="card"><div class="card-h"><h3>Việc đang chờ theo người (${esc(Flow.ci().code)})</h3></div>
        <div class="card-pad">${counts.length ? counts.map(([p, n]) => `<div class="row" style="margin-bottom:8px">${avatar(p.id, 'sm')}<span>${esc(p.name)} — ${esc(p.role)}</span><span class="tag red">${n}</span></div>`).join('') : '<span class="muted">Không có việc đang chờ.</span>'}</div></div></div>`;
  }

  /* ---------- Tổng hợp điểm ❓ ---------- */
  function choChot() {
    const notes = Flow.state.qNotes;
    const n = Object.keys(notes).length;
    return `<div class="page">
      <div class="page-head"><div><h1>Điểm chưa chốt (❓)</h1><div class="sub">${Object.keys(D.openPoints).length} điểm theo §6 tài liệu chuẩn bị · đã ghi ý kiến ${n}/${Object.keys(D.openPoints).length}. Bấm vào mã để ghi ý kiến.</div></div>
        <div class="row"><button class="btn secondary" data-export="md">Xuất Markdown</button><button class="btn secondary" data-export="csv">Xuất CSV</button></div></div>
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mã</th><th>Điểm chưa chốt</th><th>Mặc định trên prototype</th><th>Màn</th><th>Ý kiến đã ghi</th></tr></thead><tbody>
      ${Object.entries(D.openPoints).map(([id, p]) => `<tr><td>${qChip(id)}</td><td>${esc(p.q)}<div class="title">${esc(p.src)}</div></td><td>${esc(p.def)}</td><td class="nowrap">${p.scr}</td><td>${notes[id] ? esc(notes[id]) : '<span class="faint">—</span>'}</td></tr>`).join('')}
      </tbody></table></div></div></div>`;
  }

  window.Screens = { chonVai, viecCuaToi, dxmsList, dxmsForm, dxmsDetail, profileList, profileCreate, resetCreate, enter, sampleDetail, caseDetail, kdtCaseDetail, hdCaseDetail, taskScreen, taskBpmn,
    phanHe, tongQuan, choChot, allCases, caseHref, dueOf, head, dxmsMeta, DXMS_STATUS, processSteps,
    s5: { dotOf, nextDot, creators, unitsOf, nvText, viewersText, viewersDialog, secCheckCard } };
})();
