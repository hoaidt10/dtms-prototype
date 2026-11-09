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
  /* T39 B1 (D-99): bộ trạng thái theo TaskStateFilter của be/workflow (UserTaskRepository: Lưu trữ → Hoàn thành → Đã hủy → Quá hạn → Chưa xử lý).
     Tab theo my-tasks (MY_TASK_TAB_FILTER_STATES): Chưa xử lý = CHUA_XU_LY + QUA_HAN + LUU_TRU; Đã hoàn thành = HOAN_THANH; Đã hủy không thuộc tab nào. */
  const TASK_STATUS = { CHUA_XU_LY: ['Chưa xử lý', 'info'], HOAN_THANH: ['Hoàn thành', 'success'], QUA_HAN: ['Quá hạn', 'error'], LUU_TRU: ['Lưu trữ', 'default'], DA_HUY: ['Đã hủy', 'default'] };
  const TASK_TABS = [['pending', 'Chưa xử lý', ['CHUA_XU_LY', 'QUA_HAN', 'LUU_TRU']], ['done', 'Đã hoàn thành', ['HOAN_THANH']]];
  const TASK_SORTS = [['NEWEST', 'Mới nhất'], ['OLDEST', 'Cũ nhất'], ['DUE_SOONEST', 'Hạn xử lý gần nhất']];
  const dnum = (s) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s || ''); return m ? Number(m[3] + m[2] + m[1]) : null; };
  const CASE_TYPES = Object.values(D.kinds).map((k) => k.label).concat(['Phê duyệt KĐT'], Object.values(D.hdProcesses).map((p) => p.type));
  /* T34 v0.2 (D-92): việc đã xử lý của ĐXMS mở Chi tiết đề xuất mua sắm chế độ Xem (thanh "Bạn đã xử lý xong"), như my-task-detail mode VIEW. */
  const viewHref = (dxms, task) => `luong/${encodeURIComponent(dxms)}/viec/${encodeURIComponent(task)}`;
  const dueOf = (task, since) => since + Math.max(1, Math.ceil(((Flow.def()[task] || {}).nlv || 0.5) * 2));

  /* Việc của người đang đăng nhập: việc đang chờ trên hồ sơ chạy luồng, việc đã xử lý, việc trên hồ sơ mẫu. */
  function myTasks() {
    const pid = Flow.state.persona, ci = Flow.ci(), clock = Flow.state.clock, all = D.allAccess(pid);
    /* Hồ sơ KĐT: cột Mã ĐXMS hiện mã KĐT (đối tượng cha), Quy trình = nhóm KĐT (chưa xác định trước cổng phân luồng). */
    const base = { code: ci.code, dxms: ci.dxms, title: ci.name, flow: ci.flow, flowLabel: ci.flowLabel, priority: ci.isKdt ? '' : ci.priority, type: ci.isKdt ? 'Phê duyệt KĐT' : kindLabel(ci.kind) };
    const todo = Flow.tokensFor(pid).slice().sort((x, y) => y.since - x.since).map((t) => Object.assign({}, base, {
      name: window.Luong && window.Luong.isLap(t) ? window.Luong.LAP_NAME : Flow.taskName(t.task), st: dueOf(t.task, t.since) < clock ? 'QUA_HAN' : 'CHUA_XU_LY',
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
      name: Flow.taskName(h.task), st: 'HOAN_THANH', created: Flow.dateOf(h.since != null ? h.since : h.t), doneAt: Flow.dateOf(h.t),
      due: Flow.dateOf(dueOf(h.task, h.since != null ? h.since : h.t)), go: ci.isKdt ? kdtCaseHref(ci.code) : viewHref(ci.dxms, h.task),
    }));
    const cases = allCases();
    const sample = D.sampleTasks.filter((s) => all || s.who === pid).map((s) => {
      const c = cases.find((x) => x.code === s.code);
      return { code: c.code, dxms: c.dxms, title: c.title, flow: c.flow, priority: c.priority, type: kindLabel(c.kind), name: (c.flow === 'MS02' ? window.BPMN_FLOWS.MS02.tasks : T)[s.task].name,
        st: 'HOAN_THANH', created: s.created, due: s.due, go: viewHref(c.dxms, s.task) };
    });
    /* Việc trên hồ sơ KĐT mẫu: mã KĐT ở cột mã đối tượng cha, Quy trình = nhóm KĐT (mã). */
    const kc = Flow.kdtCases(), T13 = window.BPMN_FLOWS.MS13.tasks;
    const kdtSample = D.sampleKdtTasks.filter((s) => all || s.who === pid).map((s) => {
      const c = kc.find((x) => x.code === s.code), x = Flow.findKdt(c.kdt) || {};
      return { code: c.code, dxms: c.kdt, title: c.title || x.title, flow: c.flow || 'Chưa xác định nhóm', priority: '', type: 'Phê duyệt KĐT', name: T13[s.task].name,
        st: 'HOAN_THANH', created: s.created, due: s.due, go: kdtCaseHref(c.code) };
    });
    /* T29 B3a: việc Rà soát tồn kho của Kho (ngoài sơ đồ) khi hồ sơ ở bước 7. */
    const kho = !ci.isKdt && window.RaSoatKho ? window.RaSoatKho.taskRows(pid, base) : [];
    return hdTasks(pid, all).concat(kho, todo, done, sample, kdtSample);
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
        return Object.assign({}, base, { name: Tk[x.task].name, st: 'HOAN_THANH', created: Flow.dateOf(s), doneAt: Flow.dateOf(x.t), due: Flow.dateOf(due(x.task, s)), go: 'ho-so-hd/' + c.code }); });
      return todo.concat(done);
    });
  }

  const emptyTaskFilter = () => ({ code: '', dxms: '', name: '', type: [], priority: null, flow: [] });
  /* T39 B1: tab trạng thái + Sắp xếp như my-tasks; từ khóa và Tìm kiếm nâng cao áp ĐỒNG THỜI (DT-GOI 0109 BR-02, UserTaskRepository lọc cùng lúc). */
  const M = { kw: '', adv: false, tab: 'pending', sort: 'NEWEST', f: emptyTaskFilter(), d: emptyTaskFilter(), page: 1, size: 10, psOpen: false };

  /* Lọc theo từ khóa + nâng cao (chưa theo tab) — dùng cho số trên tab và danh sách. */
  function searchedTasks() {
    const n = window.UI.norm, f = M.f, adv = M.adv;
    return myTasks().filter((r) => (!M.kw || n(r.name + ' ' + r.code + ' ' + r.dxms + ' ' + (r.title || '')).includes(n(M.kw)))
      && (!adv || ((!f.code || n(r.code).includes(n(f.code))) && (!f.dxms || n(r.dxms).includes(n(f.dxms)))
        && (!f.name || n(r.name).includes(n(f.name))) && (!f.type.length || f.type.includes(r.type))
        && (!f.priority || r.priority === f.priority) && (!f.flow.length || f.flow.includes(r.flow)))));
  }
  function filteredTasks() {
    const states = TASK_TABS.find((x) => x[0] === M.tab)[2];
    const rows = searchedTasks().filter((r) => states.includes(r.st)).map((r, i) => ({ r, i, c: dnum(r.created), d: dnum(r.due) }));
    /* MyTaskSort: Mới nhất (mặc định) = ngày tạo giảm dần; Cũ nhất; Hạn gần nhất — không có hạn xếp cuối. Cùng ngày giữ thứ tự gốc. */
    const cmp = { NEWEST: (a, b) => (b.c || 0) - (a.c || 0), OLDEST: (a, b) => (a.c || 0) - (b.c || 0),
      DUE_SOONEST: (a, b) => (a.d == null) - (b.d == null) || (a.d || 0) - (b.d || 0) }[M.sort];
    return rows.sort((a, b) => cmp(a, b) || a.i - b.i).map((x) => x.r);
  }

  function taskAdvPanel() {
    const d = M.d;
    const set = (k) => (v) => { d[k] = v; rerender(); };
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-mf="${k}" maxlength="255" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'm-' + k, value: d[k], clear: true, onChange: set(k) }, o))}</div>`;
    return `<form class="adv" data-madv>
      <div class="grid3">
        ${txt('dxms', 'Mã ĐXMS / KĐT')}${txt('name', 'Tên công việc')}
        ${sel('type', 'Loại', { multi: true, searchable: true, options: CASE_TYPES.map((v) => ({ value: v, label: v })) })}
        ${sel('priority', 'Mức ưu tiên', { options: PRIORITIES.map((v) => ({ value: v, label: v })) })}
        ${sel('flow', 'Quy trình', { multi: true, searchable: true, options: PROC_CODES.concat(Object.keys(D.kdtGroups), Object.keys(D.hdProcesses)).map((k) => ({ value: k, label: k })) })}
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-m="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  function viecCuaToi() {
    // Theo: fe/repo-khcn-dtms-fe/src/app/features/my-tasks/my-tasks.component.html (develop c290304, 06/11 — màn /my-tasks trên vht-dtms-dev)
    //       + shared/utils/my-task-columns.utils.ts (thứ tự cột theo tab), shared/constants/my-task.constants.ts
    const p = persona(Flow.state.persona);
    if (M.who !== p.id) { M.who = p.id; M.page = 1; } // đổi tài khoản → về trang 1
    const rows = filteredTasks();
    const pages = Math.max(1, Math.ceil(rows.length / M.size));
    if (M.page > pages) M.page = pages;
    const from = (M.page - 1) * M.size;
    /* my-task-columns.utils (dtms-fe): STT · Trạng thái · Mã hồ sơ · Mã nhiệm vụ · Tên nhiệm vụ · Cấp · Quy trình · Bước cần xử lý · Hạn xử lý
       (tab Đã hoàn thành: Bước bạn đã xử lý · Ngày xử lý). ĐTMS: Mã / Tên nhiệm vụ → Mã / Tên ĐXMS / KĐT, Cấp → Mức ưu tiên; không có cột Mã hồ sơ (D-92). */
    const done = M.tab === 'done';
    const cols = [['Trạng thái', 140, 'c'], ['Mã ĐXMS / KĐT', 150], ['Tên ĐXMS / KĐT', 240], ['Mức ưu tiên', 110], ['Quy trình', 130],
      [done ? 'Bước bạn đã xử lý' : 'Bước cần xử lý', 220], [done ? 'Ngày xử lý' : 'Hạn xử lý', done ? 150 : 120]];
    const found = searchedTasks(), cnt = (k) => found.filter((r) => TASK_TABS.find((x) => x[0] === k)[2].includes(r.st)).length;
    const tgt = (r) => (r.openNew ? 'data-open-new="1"' : `data-go="${r.go}"`);
    const body = rows.slice(from, from + M.size).map((r, i) => `<tr class="click" ${tgt(r)} data-code="${esc(r.code)}">
        <td class="ord">${from + i + 1}</td><td class="c">${badge(TASK_STATUS[r.st][0], TASK_STATUS[r.st][1])}</td>
        <td><a class="link" ${tgt(r)}>${esc(r.dxms)}</a></td><td>${r.title ? clamp(r.title) : dash}</td><td>${r.priority ? esc(r.priority) : dash}</td>
        <td>${esc(r.flowLabel || r.flow)}</td><td>${clamp(r.name)}</td>
        <td class="num${!done && r.st === 'QUA_HAN' ? ' due-over' : ''}">${esc(done ? (r.doneAt || r.due || r.created) : r.due) || dash}</td></tr>`).join('');
    const info = {
      scr: 'SCR-01', name: 'Việc của tôi', uc: 'UC-03-01',
      notes: [
        `Đang đăng nhập: ${esc(p.name)} — ${esc(p.role)}, ${esc(p.unit)}. Đổi vai ở menu avatar (Chuyển tài khoản).`,
        '<b>T39 B1 (D-99, theo code KHCN):</b> hai tab như my-tasks — <b>Chưa xử lý</b> (trạng thái Chưa xử lý, Quá hạn, Lưu trữ) và <b>Đã hoàn thành</b> (Hoàn thành); việc <b>Đã hủy</b> (hồ sơ / quy trình bị hủy) không thuộc tab nào, như MY_TASK_TAB_FILTER_STATES. Trạng thái tính theo thứ tự của UserTaskRepository: hồ sơ lưu trữ → Lưu trữ; việc xong → Hoàn thành; việc / quy trình hủy → Đã hủy; quá Hạn xử lý → Quá hạn; còn lại Chưa xử lý (Quá hạn và Chưa xử lý không trùng nhau). Dữ liệu mẫu chưa có việc Lưu trữ / Đã hủy (GIẢ LẬP: chưa dựng hồ sơ lưu trữ).',
        '<b>Số trên tab Chưa xử lý và trên menu Việc của tôi</b> = số việc thuộc tab Chưa xử lý (Chưa xử lý + Quá hạn + Lưu trữ) của người dùng, như getPendingCount của my-tasks. Số trên tab đổi theo từ khóa / tìm kiếm nâng cao; số trên menu không theo từ khóa.',
        '<b>Sắp xếp</b> theo MyTaskSort: Mới nhất (mặc định, ngày tạo giảm dần), Cũ nhất, Hạn xử lý gần nhất (việc không có hạn xếp cuối).',
        '<b>Từ khóa và Tìm kiếm nâng cao áp cùng lúc</b> (DT-GOI 0109 BR-02; UserTaskRepository lọc từ khóa và các trường nâng cao trong một truy vấn); Làm mới xóa cả từ khóa. Không có trường Trạng thái trong tìm kiếm nâng cao — tab thay cho trường này.',
        'Bố cục theo màn /my-tasks của ĐTMS (repo-khcn-dtms-fe): tiêu đề trang <b>Việc của tôi</b>; trong khung trắng tiêu đề khối <b>Danh sách việc của tôi</b> (vạch đỏ) bên trái, ô tìm kiếm 320px bên phải; hàng tab + Sắp xếp; bảng.',
        'Thứ tự cột theo my-task-columns.utils: STT, Trạng thái, Mã, Tên, Cấp, Quy trình, Bước, Hạn xử lý (tab Đã hoàn thành: Bước bạn đã xử lý, Ngày xử lý). <b>Mã / Tên nhiệm vụ</b> (KHCN) thay bằng <b>Mã / Tên ĐXMS / KĐT</b> — đối tượng cha của hồ sơ; <b>Cấp</b> thay bằng <b>Mức ưu tiên</b> (KĐT không có → "-"). Không có cột <b>Mã hồ sơ</b> vì giao diện ĐXMS không hiện hồ sơ (D-92). Hạn xử lý quá hạn tô đỏ. Không có cột Thao tác: bấm dòng hoặc mã để mở màn xử lý việc.',
        'Nút <b>Tìm kiếm nâng cao</b> giữ theo DT-GOI DTMS_CN_0109 dù màn /my-tasks trên dev chưa có (người dùng chốt giữ 09/11). Ngày xử lý của việc trên hồ sơ mẫu lấy theo Hạn xử lý (GIẢ LẬP: dữ liệu mẫu chưa có ngày hoàn thành).',
        'Việc của hồ sơ KĐT: Quy trình = mã nhóm KĐT (MS13 / MS14), "Chưa xác định nhóm" trước khi TTMS xác nhận 04 yếu tố (D-7); việc đã xử lý mở Chi tiết hồ sơ KĐT.',
        'Việc Chưa xử lý / Quá hạn chỉ có trên hồ sơ đang chạy luồng; hồ sơ mẫu chỉ có việc Hoàn thành, mở ra chi tiết hồ sơ ở chế độ xem.',
        'Hạn xử lý tính theo định mức ngày làm việc của từng bước; quá hạn khi hạn trước ngày hiện tại của luồng.',
        'Không có nút Thêm mới (my-tasks không có): tạo ĐXMS ở Danh sách ĐXMS, tạo hồ sơ ở Chỉnh sửa ĐXMS hoặc Hồ sơ ĐXMS.',
      ],
      q: D.screenQ['SCR-01'], src: 'my-tasks/my-tasks.component · /my-tasks',
    };
    return `<div class="pg">
      ${head({ title: 'Việc của tôi', lg: true, info })}
      <div class="vcard pad24">
        <div class="pg-head"><h2 class="blk-t sm">Danh sách việc của tôi</h2><div class="r">
          <label class="vsearch" style="width:320px">${icon('search')}<input id="my-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên ĐXMS / KĐT..." value="${esc(M.kw)}"></label>
          <button class="vbtn ${M.adv ? 'active' : 'secondary'}" data-m="adv">${M.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${M.adv ? taskAdvPanel() : ''}
        <div class="my-tabbar" style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px">
          <nav class="tabs dx-tabs" role="tablist" style="margin-bottom:0;border-bottom:0">${TASK_TABS.map(([k, l]) => `<button type="button" class="tab ${M.tab === k ? 'on' : ''}" role="tab" aria-selected="${M.tab === k}" data-my-tab="${k}">${l}${k === 'pending' && cnt(k) ? ` <span class="tag red" data-my-count>${cnt(k)}</span>` : ''}</button>`).join('')}</nav>
          <div style="display:flex;align-items:center;gap:8px;padding-bottom:8px"><span class="faint">Sắp xếp:</span><div style="width:200px">${vSelect({ id: 'my-sort', value: M.sort, options: TASK_SORTS.map(([v, label]) => ({ value: v, label })), onChange: (v) => { M.sort = v || 'NEWEST'; M.page = 1; rerender(); } })}</div></div>
        </div>
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${M.tab === 'pending' && !M.kw && !M.adv ? 'Bạn không có công việc nào cần xử lý.' : 'Không có dữ liệu.'}</td></tr>`}</tbody></table></div>
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
    if (m.dataset.m === 'reset') { M.d = emptyTaskFilter(); M.f = emptyTaskFilter(); M.kw = ''; M.page = 1; }
    rerender();
  });
  /* Tab Chưa xử lý / Đã hoàn thành (my-tasks.facade.handleTabChange: đổi tab về trang 1, xóa từ khóa, giữ Sắp xếp). */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-my-tab]');
    if (!b) return;
    M.tab = b.dataset.myTab; M.kw = ''; M.page = 1; rerender();
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
  /* T34 v0.2 (D-92): hồ sơ của ĐXMS không còn màn riêng — mở Chi tiết đề xuất mua sắm (SCR-97), tab Tiến trình. */
  const caseHref = (c) => (c.dxms ? `luong/${encodeURIComponent(c.dxms)}/tien-trinh` : c.live ? 'ho-so' : 'ho-so-dxms/' + encodeURIComponent(c.code));
  const UNITS = [...new Set([D.caseInfo.unit].concat(D.dxmsList.map((c) => c.unit)))];
  const PRIORITIES = ['Thường', 'Khẩn', 'Thượng khẩn'];
  const PROC_CODES = Object.keys(D.processes).concat(Object.keys(D.adjProcesses));
  /* T29 B1 (D-54): hồ sơ Phê duyệt chạy một quy trình MS01, luồng con .01 / .02 / .03 (label = nhãn dự kiến của hồ sơ đang chạy, D.flowLabel). */
  const procLabel = (flow, label) => (/^MS01\.0[1-3]$/.test(flow || '') ? `${D.mainProc.code} — ${D.mainProc.name}${(label || flow) !== D.mainProc.code ? ` · luồng ${label || flow}` : ''}` : `${flow} — ${D.procName(flow)}`);
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
      code: ci.code, dxms: ci.dxms, kind: ci.kind, title: ci.name, total: ci.total, flow: ci.flow, flowLabel: ci.flowLabel, creator, live: true, reason: ci.reason || undefined,
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
  /* T34 (D-85): SUP = Đã được điều chỉnh — ĐXMS điều chỉnh của nó đã được duyệt, hết hiệu lực. */
  const DXMS_STATUS = { NEW: ['Chưa khởi tạo', 'default'], PD: ['Đang phê duyệt', 'info'], OK: ['Đã phê duyệt', 'success'], DC: ['Đang điều chỉnh', 'warning'], SUP: ['Đã được điều chỉnh', 'default'], STOP: ['Dừng xử lý', 'default'] };
  const toTime = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d).getTime(); };
  /* T34 (D-85…D-88): một ĐXMS một hồ sơ (own). Trạng thái theo hồ sơ của nó và ĐXMS điều chỉnh con (adjFrom = mã này):
     hồ sơ Đang xử lý → Đang phê duyệt; Hoàn thành → Đã phê duyệt, có con đang chạy → Đang điều chỉnh, có con đã duyệt → Đã được điều chỉnh;
     Dừng / Hủy → Dừng xử lý. Giá trị hiệu lực = giá trị hồ sơ Hoàn thành, chưa có thì giá trị dự kiến. */
  function dxmsMeta(x, cases) {
    const hs = cases.filter((c) => c.dxms === x.code);
    const own = hs.find((c) => c.live) || hs.find((c) => c.proto) || hs[0] || null;
    const kids = Flow.dxmsAdjOf(x.code).map((k) => ({ k, c: cases.find((c) => c.dxms === k.code) }));
    const kidDone = kids.find((o) => o.c && o.c.st === 'done'), kidRun = kids.find((o) => o.c && o.c.st === 'processing');
    const st = own ? own.st : null;
    const state = !own ? 'NEW' : st === 'processing' ? 'PD' : st === 'done' ? (kidDone ? 'SUP' : kidRun ? 'DC' : 'OK') : 'STOP';
    const by = kidDone || kidRun;
    return { hs, own, state, value: st === 'done' ? own.total : x.est, approved: st === 'done', adjN: x.adjN || 0, adjBy: by ? by.k.code : null };
  }
  const dxmsBadge = (s, n) => badge(DXMS_STATUS[s][0] + (s === 'OK' && n ? ` (điều chỉnh lần ${n})` : ''), DXMS_STATUS[s][1]);
  /* Lý do không tạo được hồ sơ loại `kind` cho ĐXMS, hoặc null. */
  /* T34 (D-85): Phê duyệt chỉ cho ĐXMS chưa có hồ sơ; Điều chỉnh chỉ cho ĐXMS Đã phê duyệt (bản còn hiệu lực của chuỗi) — Lưu tạo ĐXMS mới. */
  function kindBlock(code, kind) {
    const x = Flow.findDxms(code);
    if (!x) return null;
    const m = dxmsMeta(x, allCases());
    if (m.state === 'PD') return 'ĐXMS đang có hồ sơ đang xử lý.';
    if (m.state === 'DC') return `ĐXMS đang được điều chỉnh (${m.adjBy}).`;
    if (m.state === 'SUP') return `ĐXMS đã được điều chỉnh bởi ${m.adjBy}. Chọn ĐXMS mới nhất của chuỗi để điều chỉnh.`;
    if (m.state === 'STOP') return 'ĐXMS đã dừng xử lý. Dùng Sao chép thành ĐXMS mới để làm lại.';
    if (kind === 'PD' && m.approved) return 'ĐXMS đã được phê duyệt. Chọn loại hồ sơ Điều chỉnh ĐXMS.';
    if (kind === 'DC' && !m.approved) return 'ĐXMS chưa được phê duyệt nên chưa tạo được hồ sơ điều chỉnh.';
    return null;
  }

  /* ---------- T29 S5 — trường theo HT-DXMS-NOTE ("TTr" = ĐXMS; plan T29 §3.9, D-59) ---------- */
  /* F6 Đợt: ĐXMS lưu `dot`; ĐXMS mẫu chưa có thì là số thứ tự theo ngày tạo trong cùng nhiệm vụ / đề tài, dự án (GIẢ LẬP P-192). */
  /* T34: ĐXMS điều chỉnh cùng đợt với ĐXMS gốc của chuỗi; chỉ ĐXMS gốc được đếm là một đợt. */
  function dotOf(x) {
    if (x.adjFrom) { const r = Flow.dxmsChain(x.code)[0]; return r && r.code !== x.code ? dotOf(r) : null; }
    if (x.dot != null && x.dot !== '') return Number(x.dot);
    if (!x.nv) return null;
    const same = Flow.dxmsAll().filter((o) => o.nv === x.nv && !o.adjFrom).sort((a, b) => toTime(a.created) - toTime(b.created) || a.code.localeCompare(b.code));
    return same.findIndex((o) => o.code === x.code) + 1 || null;
  }
  /* Đợt gợi ý khi tạo ĐXMS mới: số ĐXMS hiện có của nhiệm vụ / đề tài, dự án + 1. */
  const nvText = (code) => (D.nvOf(code) ? `${code} — ${D.nvOf(code).name}` : code || '');
  const nextDot = (nv) => (nv ? String(Flow.dxmsAll().filter((o) => o.nv === nv && !o.adjFrom).length + 1) : '');
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
  /* T34: Sao chép ĐXMS Dừng xử lý thành ĐXMS mới → mở Chỉnh sửa ĐXMS mới để rà lại rồi Tạo hồ sơ. */
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-copy-dxms]');
    if (!b) return;
    const nc = Flow.copyDxms(b.dataset.copyDxms);
    if (!nc) return;
    UI.toast(`<b>Thành công</b><br>Đã sao chép thành ${esc(nc)}.`);
    location.hash = '#/' + dxmsHref(nc);
  });
  /* F10: tải văn bản đầu ra dạng PDF bên cạnh tệp Word. */
  const dlPdf = (name) => iconBtn('file', 'Tải xuống PDF', `data-dl="${esc(String(name).replace(/\.(docx?|xlsx?|pdf)$/i, ''))}.pdf"`);

  /* T34 (người dùng 09/11, D-90): BỎ PHƯƠNG ÁN TÁCH — SCR-02, SCR-25, SCR-27, SCR-28, SCR-29 comment lại (giữ để tham khảo). Route cũ
     chuyển sang Luồng mua sắm (app.js). Còn dùng: dxmsMeta, kindBlock, secCheckCard, chainCard, s5, Chi tiết hồ sơ (SCR-20). */
// [T34 bỏ Tách]   /* ---------- SCR-02 Danh sách hồ sơ ĐXMS ---------- */
// [T34 bỏ Tách]   const emptyFilter = () => ({ code: '', dxms: '', title: '', kind: [], block: null, unit: null, creator: null, secret: null, flow: [], st: [], priority: null,
// [T34 bỏ Tách]     cqcm: [], rvSt: [], rvFrom: '', rvTo: '', ttFrom: '', ttTo: '' });
// [T34 bỏ Tách]   /* kw: ô tìm kiếm; f: bộ lọc nâng cao đã áp; d: bộ lọc đang nhập. Hai kiểu tìm độc lập như profile-list. */
// [T34 bỏ Tách]   const L = { kw: '', adv: false, f: emptyFilter(), d: emptyFilter(), page: 1, size: 10, psOpen: false };

// [T34 bỏ Tách]   function filtered() {
// [T34 bỏ Tách]     const n = window.UI.norm, f = L.f;
// [T34 bỏ Tách]     return allCases().filter((c) => (!L.adv
// [T34 bỏ Tách]       ? !L.kw || n(c.code + ' ' + c.dxms + ' ' + c.title).includes(n(L.kw))
// [T34 bỏ Tách]       : (!f.code || n(c.code).includes(n(f.code))) && (!f.dxms || n(c.dxms).includes(n(f.dxms))) && (!f.title || n(c.title).includes(n(f.title)))
// [T34 bỏ Tách]         && (!f.kind.length || f.kind.includes(c.kind)) && (!f.unit || c.unit === f.unit) && (!f.flow.length || f.flow.includes(c.flow))
// [T34 bỏ Tách]         && (!f.st.length || f.st.includes(c.st)) && (!f.priority || c.priority === f.priority)
// [T34 bỏ Tách]         && (!f.block || D.blockOf(c.unit) === f.block) && (!f.creator || c.creator === f.creator) && (!f.secret || (f.secret === 'Có') === !!c.secret)
// [T34 bỏ Tách]         && advReview(c, f)));
// [T34 bỏ Tách]   }
// [T34 bỏ Tách]   /* F3, F5: lọc theo CQCM thẩm định, tình trạng, ngày thẩm định (cùng một CQCM thoả mọi điều kiện đã nhập), ngày Tờ trình. */
// [T34 bỏ Tách]   function advReview(c, f) {
// [T34 bỏ Tách]     if (f.cqcm.length || f.rvSt.length || f.rvFrom || f.rvTo) {
// [T34 bỏ Tách]       const ok = reviewOf(c).some((r) => (!f.cqcm.length || f.cqcm.includes(r.id)) && (!f.rvSt.length || f.rvSt.includes(r.st))
// [T34 bỏ Tách]         && (!f.rvFrom || (r.at && dk(r.at) >= dk(f.rvFrom))) && (!f.rvTo || (r.at && dk(r.at) <= dk(f.rvTo))));
// [T34 bỏ Tách]       if (!ok) return false;
// [T34 bỏ Tách]     }
// [T34 bỏ Tách]     if (f.ttFrom || f.ttTo) {
// [T34 bỏ Tách]       const t = ttOf(c);
// [T34 bỏ Tách]       if (!t || (f.ttFrom && dk(t.at) < dk(f.ttFrom)) || (f.ttTo && dk(t.at) > dk(f.ttTo))) return false;
// [T34 bỏ Tách]     }
// [T34 bỏ Tách]     return true;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   function advPanel() {
// [T34 bỏ Tách]     const d = L.d;
// [T34 bỏ Tách]     const set = (k) => (v) => { d[k] = v; rerender(); };
// [T34 bỏ Tách]     const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-lf="${k}" maxlength="255" value="${esc(d[k])}"></div>`;
// [T34 bỏ Tách]     const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'f-' + k, value: d[k], clear: true, searchable: true, onChange: set(k) }, o))}</div>`;
// [T34 bỏ Tách]     const date = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-lf="${k}" maxlength="10" placeholder="DD/MM/YYYY" value="${esc(d[k])}"></div>`;
// [T34 bỏ Tách]     return `<form class="adv" data-adv>
// [T34 bỏ Tách]       <div class="grid3">
// [T34 bỏ Tách]         ${txt('code', 'Mã hồ sơ')}${txt('dxms', 'Mã ĐXMS')}${txt('title', 'Tên hồ sơ')}
// [T34 bỏ Tách]         ${sel('kind', 'Loại hồ sơ', { multi: true, searchable: false, options: Object.entries(D.kinds).map(([k, v]) => ({ value: k, label: v.label })) })}
// [T34 bỏ Tách]         ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
// [T34 bỏ Tách]     onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
// [T34 bỏ Tách]         ${sel('unit', 'Đơn vị đề xuất', { options: unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
// [T34 bỏ Tách]         ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: creators().map((u) => ({ value: u, label: u })) })}
// [T34 bỏ Tách]         ${sel('flow', 'Quy trình', { multi: true, options: PROC_CODES.map((k) => ({ value: k, label: k })) })}
// [T34 bỏ Tách]         ${sel('st', 'Trạng thái', { multi: true, options: Object.entries(CASE_STATUS).map(([k, v]) => ({ value: k, label: v[0] })) })}
// [T34 bỏ Tách]         ${sel('priority', 'Mức ưu tiên', { searchable: false, options: PRIORITIES.map((p) => ({ value: p, label: p })) })}
// [T34 bỏ Tách]         ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
// [T34 bỏ Tách]         ${sel('cqcm', 'Người thẩm định (CQCM)', { multi: true, placeholder: 'Chọn CQCM', options: D.cqcm.map((c) => ({ value: c.id, label: `${c.unit} — ${persona(c.doer).name}` })) })}
// [T34 bỏ Tách]         ${sel('rvSt', 'Trạng thái với người thẩm định', { multi: true, searchable: false, placeholder: 'Tất cả', options: RV_ST.map((v) => ({ value: v, label: v })) })}
// [T34 bỏ Tách]         ${date('rvFrom', 'Ngày thẩm định từ')}${date('rvTo', 'Ngày thẩm định đến')}
// [T34 bỏ Tách]         ${date('ttFrom', 'Ngày Tờ trình từ')}${date('ttTo', 'Ngày Tờ trình đến')}
// [T34 bỏ Tách]       </div>
// [T34 bỏ Tách]       <div class="acts"><button type="button" class="vbtn secondary" data-l="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   function profileList() {
// [T34 bỏ Tách]     // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
// [T34 bỏ Tách]     //       + utils/profile-columns.utils.ts (bỏ Thao tác theo D-43 → Trạng thái → Mã hồ sơ → Mã nhiệm vụ → Tên hồ sơ → Loại hồ sơ → Cấp → Quy trình → Bước hiện tại → Ngày cập nhật)
// [T34 bỏ Tách]     const rows = filtered();
// [T34 bỏ Tách]     const pages = Math.max(1, Math.ceil(rows.length / L.size));
// [T34 bỏ Tách]     if (L.page > pages) L.page = pages;
// [T34 bỏ Tách]     const from = (L.page - 1) * L.size;
// [T34 bỏ Tách]     const cols = [['Trạng thái', 169, 'c'], ['Mã hồ sơ', 150], ['Mã ĐXMS', 160], ['Tên hồ sơ', 320], ['Loại hồ sơ', 150],
// [T34 bỏ Tách]       ['Đơn vị đề xuất', 185], ['Tổng giá trị (tỷ đồng)', 169, 'r'], ['Mức ưu tiên', 130], ['Quy trình', 120], ['Bước hiện tại', 185],
// [T34 bỏ Tách]       ['Số Tờ trình', 150], ['Ngày Tờ trình', 130], ['Ngày gửi thẩm định', 160], ['Người tạo', 170], ['Ngày cập nhật', 150]];
// [T34 bỏ Tách]     const body = rows.slice(from, from + L.size).map((c, i) => {
// [T34 bỏ Tách]       const tt = ttOf(c);
// [T34 bỏ Tách]       return `<tr class="click" data-go="${caseHref(c)}" data-code="${esc(c.code)}">
// [T34 bỏ Tách]         <td class="ord">${from + i + 1}</td><td class="c">${stBadge(c.st)}</td>
// [T34 bỏ Tách]         <td><a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a></td><td>${esc(c.dxms)}</td><td>${clamp(c.title)}</td><td>${esc(kindLabel(c.kind))}</td>
// [T34 bỏ Tách]         <td>${clamp(c.unit)}</td><td class="r num">${ty(c.total)}</td><td>${esc(c.priority)}</td><td>${esc(c.flowLabel || c.flow)}</td><td>${clamp(c.step)}</td>
// [T34 bỏ Tách]         <td>${tt ? esc(tt.no) : dash}</td><td class="num">${tt ? esc(tt.at) : dash}</td><td class="num">${tt ? esc(tt.at) : dash}</td><td>${clamp(c.creator)}</td><td class="num">${esc(c.updated)}</td></tr>`;
// [T34 bỏ Tách]     }).join('');
// [T34 bỏ Tách]     const info = {
// [T34 bỏ Tách]       scr: 'SCR-02', name: 'Danh sách hồ sơ ĐXMS', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20, UR-COM-01',
// [T34 bỏ Tách]       notes: [
// [T34 bỏ Tách]         'Hồ sơ là đối tượng con của ĐXMS (D-10, như hồ sơ KHCN thuộc một nhiệm vụ): cột <b>Mã nhiệm vụ</b> của source thay bằng <b>Mã ĐXMS</b>, <b>Cấp nhiệm vụ</b> thay bằng <b>Mức ưu tiên</b>; thêm Đơn vị đề xuất, Tổng giá trị (lấy từ ĐXMS / hồ sơ).',
// [T34 bỏ Tách]         'Loại hồ sơ: <b>Phê duyệt ĐXMS</b> (MS01) hoặc <b>Điều chỉnh ĐXMS</b> (MS02). T34 (D-85): mỗi ĐXMS một hồ sơ — hồ sơ Điều chỉnh thuộc ĐXMS điều chỉnh (ĐXMS mới), không thuộc ĐXMS cũ.',
// [T34 bỏ Tách]         'Hồ sơ tạo bằng <b>Thêm mới</b> chạy luồng — Phê duyệt (MS01.0x) và Điều chỉnh (MS02, T21); các hồ sơ khác là dữ liệu mẫu, mở ra ở chế độ xem.',
// [T34 bỏ Tách]         'Không có cột Thao tác (D-43, team BA 30/10/2026: danh sách chưa có thao tác trên dòng). Xử lý việc mở từ Việc của tôi; không có Xoá vì hồ sơ không có trạng thái Dự thảo (Lưu là khởi tạo).',
// [T34 bỏ Tách]         'Trạng thái theo từ vựng source (Đang xử lý / Hoàn thành) + trạng thái riêng ĐTMS: Đã chuyển quy trình, Dừng xử lý.',
// [T34 bỏ Tách]         '<b>T29 — trường theo màn Soạn thảo TTr / Thẩm định TTr của hệ thống cũ</b> (HT-DXMS-NOTE màn 6, 7, 9; "TTr" = ĐXMS): Tìm kiếm nâng cao thêm Khối đơn vị (Đơn vị đề xuất hiện theo khối), Người tạo, Mật, Người thẩm định (CQCM), Trạng thái với người thẩm định, Ngày thẩm định, Ngày Tờ trình; bảng thêm Số / Ngày Tờ trình, Ngày gửi thẩm định, Người tạo. SRS-DXMS chưa có các trường này (D-59: bổ sung SRS sau).',
// [T34 bỏ Tách]         'Ánh xạ hệ thống cũ: Loại biểu mẫu TTr → Quy trình; 12 Trạng thái TTr → Trạng thái + Bước hiện tại; Kinh phí đề xuất → Tổng giá trị. Thật: BE thêm tham số lọc cho API danh sách hồ sơ; tình trạng CQCM suy từ việc Camunda của bước 18–20 (GIẢ LẬP P-191); Số, Ngày Tờ trình theo P-192; Khối theo P-190.',
// [T34 bỏ Tách]       ],
// [T34 bỏ Tách]       q: ['P-190', 'P-191', 'P-192'], src: 'profile-management/profile-list · /khcn-profile-management',
// [T34 bỏ Tách]     };
// [T34 bỏ Tách]     return `<div class="pg">
// [T34 bỏ Tách]       ${head({ title: 'Danh sách hồ sơ ĐXMS', info, right: createBtn('hs') })}
// [T34 bỏ Tách]       <div class="vcard">
// [T34 bỏ Tách]         <div class="pg-head"><span></span><div class="r">
// [T34 bỏ Tách]           ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="hs-kw" maxlength="255" placeholder="Tìm kiếm theo mã hồ sơ, mã ĐXMS, tên hồ sơ" value="${esc(L.kw)}"></label>`}
// [T34 bỏ Tách]           <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-l="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
// [T34 bỏ Tách]         ${L.adv ? advPanel() : ''}
// [T34 bỏ Tách]         <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
// [T34 bỏ Tách]           <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
// [T34 bỏ Tách]         ${pager({ id: 'hs', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
// [T34 bỏ Tách]       </div></div>`;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   document.addEventListener('click', (e) => {
// [T34 bỏ Tách]     const t = e.target;
// [T34 bỏ Tách]     const pg = t.closest('[data-pager="hs"]');
// [T34 bỏ Tách]     if (pg) {
// [T34 bỏ Tách]       const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
// [T34 bỏ Tách]       if (b) L.page = Number(b.dataset.pg);
// [T34 bỏ Tách]       else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
// [T34 bỏ Tách]       else return;
// [T34 bỏ Tách]       rerender(); return;
// [T34 bỏ Tách]     }
// [T34 bỏ Tách]     if (L.psOpen) { L.psOpen = false; rerender(); }
// [T34 bỏ Tách]     const l = t.closest('[data-l]');
// [T34 bỏ Tách]     if (!l) return;
// [T34 bỏ Tách]     if (l.dataset.l === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
// [T34 bỏ Tách]     if (l.dataset.l === 'reset') { L.d = emptyFilter(); L.f = emptyFilter(); L.page = 1; }
// [T34 bỏ Tách]     rerender();
// [T34 bỏ Tách]   });
// [T34 bỏ Tách]   document.addEventListener('submit', (e) => {
// [T34 bỏ Tách]     if (!e.target.matches('[data-adv]')) return;
// [T34 bỏ Tách]     e.preventDefault();
// [T34 bỏ Tách]     L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
// [T34 bỏ Tách]   });
// [T34 bỏ Tách]   document.addEventListener('input', (e) => {
// [T34 bỏ Tách]     const f = e.target.closest('[data-lf]');
// [T34 bỏ Tách]     if (f) L.d[f.dataset.lf] = f.value;
// [T34 bỏ Tách]     if (e.target.id === 'c-name') { C.name = e.target.value; C.touched = true; }
// [T34 bỏ Tách]     const x = e.target.closest('[data-xf]');
// [T34 bỏ Tách]     if (x) XF.v[x.dataset.xf] = x.value;
// [T34 bỏ Tách]   });
// [T34 bỏ Tách]   /* Comment #12: đổi Tên / Mục đích của ĐXMS Mật → đánh giá lại khối AI kiểm tra quy tắc bảo mật. */
// [T34 bỏ Tách]   document.addEventListener('change', (e) => {
// [T34 bỏ Tách]     const card = e.target.closest('[data-xf]') && document.querySelector('[data-sec-check]');
// [T34 bỏ Tách]     if (card) card.outerHTML = secCheckCard(XF.v);
// [T34 bỏ Tách]   });
// [T34 bỏ Tách]   document.addEventListener('keydown', (e) => {
// [T34 bỏ Tách]     if (e.key !== 'Enter' || !['hs-kw', 'dxms-kw'].includes(e.target.id)) return;
// [T34 bỏ Tách]     const id = e.target.id;
// [T34 bỏ Tách]     if (id === 'hs-kw') { L.kw = e.target.value.trim(); L.page = 1; } else { X.kw = e.target.value.trim(); X.page = 1; }
// [T34 bỏ Tách]     rerender();
// [T34 bỏ Tách]     const k = document.getElementById(id);
// [T34 bỏ Tách]     if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
// [T34 bỏ Tách]   });

// [T34 bỏ Tách]   /* ---------- SCR-25 Thêm mới hồ sơ — trang #/ho-so-dxms/create[/<mã ĐXMS>] ---------- */
// [T34 bỏ Tách]   /* lock: mở từ ĐXMS (nút Tạo hồ sơ) → ô ĐXMS khoá như route create/:taskId của source. touched: người dùng đã sửa Tên hồ sơ. */
// [T34 bỏ Tách]   /* adjOnly (T34, SCR-108 › Thêm mới): chỉ tạo Điều chỉnh — Loại khoá Điều chỉnh ĐXMS, ô ĐXMS chỉ liệt kê ĐXMS Đã phê duyệt. */
// [T34 bỏ Tách]   const C = { dxms: null, lock: false, kind: null, proc: null, name: '', touched: false, err: {}, adjOnly: false };
// [T34 bỏ Tách]   function resetCreate(dxms, adjOnly) {
// [T34 bỏ Tách]     Object.assign(C, { dxms: dxms || null, lock: !!dxms, kind: null, proc: null, name: '', touched: false, err: {}, adjOnly: !!adjOnly });
// [T34 bỏ Tách]     if (adjOnly) pickKind('DC');
// [T34 bỏ Tách]     autoKind(); autoName();
// [T34 bỏ Tách]   }
// [T34 bỏ Tách]   /* Chỉ một loại hồ sơ tạo được → chọn sẵn; loại chỉ có một quy trình → chọn sẵn quy trình. */
// [T34 bỏ Tách]   function pickKind(k) { C.kind = k; const ps = k ? D.kinds[k].procs : []; C.proc = ps.length === 1 ? ps[0] : null; }
// [T34 bỏ Tách]   function autoKind() {
// [T34 bỏ Tách]     if (!C.dxms || C.kind) return;
// [T34 bỏ Tách]     const ok = Object.keys(D.kinds).filter((k) => !kindBlock(C.dxms, k));
// [T34 bỏ Tách]     if (ok.length === 1) pickKind(ok[0]);
// [T34 bỏ Tách]     /* T34: không loại nào tạo được (đang xử lý / đang điều chỉnh / đã được điều chỉnh / dừng) → chọn loại theo ĐXMS để Lưu báo đúng lý do chặn. */
// [T34 bỏ Tách]     else if (!ok.length) { const x = Flow.findDxms(C.dxms); pickKind(x && dxmsMeta(x, allCases()).own ? 'DC' : 'PD'); }
// [T34 bỏ Tách]   }
// [T34 bỏ Tách]   function autoName() {
// [T34 bỏ Tách]     if (C.touched) return;
// [T34 bỏ Tách]     const x = C.dxms && Flow.findDxms(C.dxms);
// [T34 bỏ Tách]     if (!x) { C.name = ''; return; }
// [T34 bỏ Tách]     C.name = C.kind === 'DC' ? `Điều chỉnh lần ${(x.adjN || 0) + 1} — ${x.title}` : x.title;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   function profileCreate() {
// [T34 bỏ Tách]     // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-form/profile-form.component.html (mode create; route create/:taskId khoá ô Nhiệm vụ)
// [T34 bỏ Tách]     const back = C.adjOnly ? 'dieu-chinh-dxms' : C.lock ? `dxms/${encodeURIComponent(C.dxms)}/edit` : 'ho-so-dxms';
// [T34 bỏ Tách]     const upd = (fn) => (v) => { fn(v); rerender(); };
// [T34 bỏ Tách]     /* T29 B1 (D-54): không chọn quy trình — Phê duyệt chạy MS01 (luồng con hệ thống đặt sau báo giá), Điều chỉnh chạy MS02. */
// [T34 bỏ Tách]     const procTxt = C.kind === 'PD' ? `${D.mainProc.code} — ${D.mainProc.name}` : C.kind === 'DC' ? `MS02 — ${D.procName('MS02')}` : '';
// [T34 bỏ Tách]     const info = {
// [T34 bỏ Tách]       scr: 'SCR-25', name: 'Thêm mới hồ sơ', uc: 'UC-07-01, UC-07-12 · UR-DX-01, 02, UR-DX-20', bpmn: 'Ngoài BPMN — trước task 01',
// [T34 bỏ Tách]       notes: [
// [T34 bỏ Tách]         'Theo profile-form của KHCN: hồ sơ thuộc một <b>ĐXMS</b> (thay trường Nhiệm vụ), có <b>Loại hồ sơ</b> (D-10). Mở từ nút Tạo hồ sơ của ĐXMS thì ô ĐXMS khoá.',
// [T34 bỏ Tách]         '<b>T29 B1 (D-54, RV-PROTO-0511 mục 4):</b> Quy trình chỉ đọc, theo Loại hồ sơ — <b>Phê duyệt ĐXMS</b> → MS01 Phê duyệt đề xuất mua sắm (luồng con .01 / .02 / .03 hệ thống đặt ở cổng sau bước 10 và bước 48); <b>Điều chỉnh ĐXMS</b> → MS02. Chỉ một loại tạo được thì chọn sẵn.',
// [T34 bỏ Tách]         '<b>T34 (D-85): mỗi ĐXMS một hồ sơ.</b> Phê duyệt ĐXMS: chỉ chọn được ĐXMS chưa có hồ sơ. <b>Điều chỉnh ĐXMS</b>: chọn ĐXMS cần điều chỉnh (Đã phê duyệt — bản còn hiệu lực của chuỗi); Lưu <b>tạo ĐXMS mới</b> (mã mới, Điều chỉnh từ = ĐXMS cũ, lần n, dữ liệu và căn cứ đang giữ chép từ ĐXMS cũ — D-89) cùng hồ sơ Điều chỉnh của nó. ĐXMS cũ sang Đang điều chỉnh, khi ĐXMS mới được duyệt thì sang Đã được điều chỉnh. Không thoả thì báo dưới ô Loại hồ sơ.',
// [T34 bỏ Tách]         '<b>Lưu = khởi tạo quy trình ngay</b>: hệ thống sinh mã hồ sơ, bước đầu tiên giao cho người tạo. Không có bản nháp. Luồng con không do người dùng chọn: dự kiến theo giá trị dự kiến và Căn cứ đã được phê duyệt của ĐXMS, hệ thống đặt lại ở cổng sau báo giá (task 10), TTMS chốt .01 / .02 ở task 48.',
// [T34 bỏ Tách]         'Mã hồ sơ do hệ thống tự sinh (source KHCN cho nhập tay) nên ô chỉ đọc. Tên hồ sơ gợi ý theo ĐXMS và loại hồ sơ, sửa được.',
// [T34 bỏ Tách]         'Khoảng giá trị trong nhãn của từng quy trình lấy từ Ngưỡng phân luồng (Danh mục dùng chung), các ngưỡng đang hoạt động và đã có hiệu lực. Hồ sơ giữ ngưỡng tại lúc Lưu (P-34).',
// [T34 bỏ Tách]         'Hồ sơ mẫu chạy luồng: ĐXMS-2026-0117 (MS01.01), ĐXMS-2026-0124 (MS01.02, căn cứ PAKD đã được TGĐ Tập đoàn duyệt), ĐXMS-2026-0098 (MS01.03, 45,20 tỷ). Hồ sơ Điều chỉnh (MS02, D-36): Lưu khởi tạo luồng MS02, bước 1 giao người tạo; giá trị trước điều chỉnh = giá trị hiệu lực của ĐXMS, luồng con MS02.01 / .02 / .03 theo giá trị sau điều chỉnh và căn cứ của ĐXMS cũ (D-39).',
// [T34 bỏ Tách]         'Prototype chạy luồng cho một hồ sơ: Lưu khi đang có hồ sơ chạy luồng sẽ thay hồ sơ đó (hồ sơ Điều chỉnh, và hồ sơ đã hoàn thành khi tạo Điều chỉnh, được giữ ở danh sách, mở chế độ xem); ý kiến ❓ được giữ.',
// [T34 bỏ Tách]       ],
// [T34 bỏ Tách]       q: ['P-34', 'P-63', 'P-64', 'P-100', 'P-106'], src: 'profile-management/profile-form (mode create) · /khcn-profile-management/create/:taskId',
// [T34 bỏ Tách]     };
// [T34 bỏ Tách]     return `<form class="pg" data-create-form>
// [T34 bỏ Tách]       ${head({ title: C.adjOnly ? 'Thêm mới điều chỉnh ĐXMS' : 'Thêm mới hồ sơ', back, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="c-save">Lưu</button>` })}
// [T34 bỏ Tách]       <section class="vcard"><h2>Thông tin chung</h2>
// [T34 bỏ Tách]         <div class="grid3">
// [T34 bỏ Tách]           ${field('Mã hồ sơ', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
// [T34 bỏ Tách]           ${field('Tên hồ sơ', `<input class="vctl" id="c-name" maxlength="500" placeholder="Nhập tên hồ sơ" value="${esc(C.name)}" ${C.err.name ? 'aria-invalid="true"' : ''}>`, { req: true, err: C.err.name, cls: 'span2' })}
// [T34 bỏ Tách]           ${field('Loại hồ sơ', vSelect({ id: 'c-kind', value: C.kind, placeholder: 'Chọn loại hồ sơ', invalid: !!C.err.kind, disabled: C.adjOnly,
// [T34 bỏ Tách]     options: Object.entries(D.kinds).map(([k, v]) => ({ value: k, label: v.label })),
// [T34 bỏ Tách]     onChange: upd((v) => { pickKind(v); delete C.err.kind; delete C.err.proc; autoName(); }) }), { req: true, err: C.err.kind })}
// [T34 bỏ Tách]           ${field('Quy trình', `<input class="vctl" id="c-proc" value="${esc(procTxt)}" placeholder="Theo loại hồ sơ" disabled>`)}
// [T34 bỏ Tách]           ${field(C.kind === 'DC' ? 'ĐXMS cần điều chỉnh' : 'ĐXMS', vSelect({ id: 'c-dxms', value: C.dxms, searchable: true, placeholder: 'Chọn ĐXMS', invalid: !!C.err.dxms, disabled: C.lock,
// [T34 bỏ Tách]     options: Flow.dxmsAll().filter((x) => !C.adjOnly || dxmsMeta(x, allCases()).state === 'OK').map((x) => ({ value: x.code, label: `${x.code} - ${x.title}` })),
// [T34 bỏ Tách]     onChange: upd((v) => { C.dxms = v; if (C.adjOnly) pickKind('DC'); else { C.kind = null; C.proc = null; } delete C.err.dxms; delete C.err.kind; autoKind(); autoName(); }) }), { req: true, err: C.err.dxms })}
// [T34 bỏ Tách]           ${C.kind === 'DC' ? `<p class="faint span3" data-adj-note>Lưu sẽ tạo <b>ĐXMS mới</b> (mã hệ thống tự sinh, Điều chỉnh từ ${esc(C.dxms || 'ĐXMS đã chọn')}) và hồ sơ Điều chỉnh của ĐXMS đó.</p>` : ''}
// [T34 bỏ Tách]           ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
// [T34 bỏ Tách]         </div></section></form>`;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   function saveCreate() {
// [T34 bỏ Tách]     const t = document.getElementById('c-name');
// [T34 bỏ Tách]     if (t) C.name = t.value;
// [T34 bỏ Tách]     C.err = {};
// [T34 bỏ Tách]     if (!C.name.trim()) C.err.name = 'Bạn cần nhập Tên hồ sơ.';
// [T34 bỏ Tách]     if (!C.dxms) C.err.dxms = 'Bạn cần chọn ĐXMS.';
// [T34 bỏ Tách]     if (!C.kind) C.err.kind = 'Bạn cần chọn Loại hồ sơ.';
// [T34 bỏ Tách]     else if (C.dxms && kindBlock(C.dxms, C.kind)) C.err.kind = kindBlock(C.dxms, C.kind);
// [T34 bỏ Tách]     if (Object.keys(C.err).length) { rerender(); return; }
// [T34 bỏ Tách]     /* Hồ sơ Điều chỉnh (T21 D-36): start MS02, giá trị trước điều chỉnh = giá trị hiệu lực của ĐXMS (R4). */
// [T34 bỏ Tách]     if (C.kind === 'DC') Flow.createAdj({ dxms: C.dxms, name: C.name.trim(), before: dxmsMeta(Flow.findDxms(C.dxms), allCases()).value });
// [T34 bỏ Tách]     else { const x = Flow.findDxms(C.dxms) || {}; Flow.create(D.subFlow(x.est, !!x.basisTD, D.dxmsRules()), { dxms: C.dxms, name: C.name.trim() }); }
// [T34 bỏ Tách]     const tok = Flow.state.tokens.find((k) => k.task === 1);
// [T34 bỏ Tách]     window.UI.toast('Thêm mới thành công');
// [T34 bỏ Tách]     location.hash = `#/task/${tok.id}`;
// [T34 bỏ Tách]   }
// [T34 bỏ Tách]   document.addEventListener('submit', (e) => { if (e.target.matches('[data-create-form]')) { e.preventDefault(); saveCreate(); } });

// [T34 bỏ Tách]   /* ---------- SCR-27 Danh sách ĐXMS ---------- */
// [T34 bỏ Tách]   /* Tìm kiếm nâng cao (Backlog ĐXMS › Tìm kiếm nâng cao, T16 B1): f = đã áp, d = đang nhập; hai kiểu tìm độc lập như profile-list. */
// [T34 bỏ Tách]   const emptyDx = () => ({ code: '', title: '', nv: null, block: null, unit: null, creator: null, secret: null, st: [], priority: null, from: '', to: '' });
// [T34 bỏ Tách]   const X = { kw: '', adv: false, f: emptyDx(), d: emptyDx(), page: 1, size: 10, psOpen: false };
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
// [T34 bỏ Tách]   function dxmsRows() {
// [T34 bỏ Tách]     const cases = allCases(), n = window.UI.norm, f = X.f;
// [T34 bỏ Tách]     return Flow.dxmsAll().map((x) => Object.assign({}, x, dxmsMeta(x, cases)))
// [T34 bỏ Tách]       .filter((x) => (!X.adv ? !X.kw || n(x.code + ' ' + x.title).includes(n(X.kw))
// [T34 bỏ Tách]         : (!f.code || n(x.code).includes(n(f.code))) && (!f.title || n(x.title).includes(n(f.title))) && (!f.nv || x.nv === f.nv) && (!f.unit || x.unit === f.unit)
// [T34 bỏ Tách]           && (!f.st.length || f.st.includes(x.state)) && (!f.priority || x.priority === f.priority)
// [T34 bỏ Tách]           && (!f.from || dk(x.created) >= dk(f.from)) && (!f.to || dk(x.created) <= dk(f.to))
// [T34 bỏ Tách]           && (!f.block || D.blockOf(x.unit) === f.block) && (!f.creator || x.creator === f.creator) && (!f.secret || (f.secret === 'Có') === !!x.secret)));
// [T34 bỏ Tách]   }
// [T34 bỏ Tách]   function dxmsAdv() {
// [T34 bỏ Tách]     const d = X.d;
// [T34 bỏ Tách]     const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-xlf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"></div>`;
// [T34 bỏ Tách]     const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'xf-' + k, value: d[k], clear: true, searchable: true, onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
// [T34 bỏ Tách]     return `<form class="adv" data-xadv><div class="grid3">
// [T34 bỏ Tách]         ${txt('code', 'Mã ĐXMS', 'Nhập mã ĐXMS')}${txt('title', 'Tên ĐXMS', 'Nhập tên ĐXMS')}
// [T34 bỏ Tách]         ${sel('nv', 'Đề tài / dự án', { placeholder: 'Chọn đề tài / dự án', options: D.nhiemVu.map((v) => ({ value: v.code, label: `${v.code} — ${v.name}` })) })}
// [T34 bỏ Tách]         ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
// [T34 bỏ Tách]     onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
// [T34 bỏ Tách]         ${sel('unit', 'Đơn vị đề xuất', { placeholder: 'Chọn đơn vị đề xuất', options: unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
// [T34 bỏ Tách]         ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: creators().map((u) => ({ value: u, label: u })) })}
// [T34 bỏ Tách]         ${sel('st', 'Trạng thái', { multi: true, searchable: false, placeholder: 'Tất cả trạng thái', options: Object.entries(DXMS_STATUS).map(([value, [label]]) => ({ value, label })) })}
// [T34 bỏ Tách]         ${sel('priority', 'Mức ưu tiên', { searchable: false, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })) })}
// [T34 bỏ Tách]         ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
// [T34 bỏ Tách]         ${txt('from', 'Ngày tạo từ', 'DD/MM/YYYY')}${txt('to', 'Ngày tạo đến', 'DD/MM/YYYY')}</div>
// [T34 bỏ Tách]       <div class="acts"><button type="button" class="vbtn secondary" data-xl="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
// [T34 bỏ Tách]   }
  /* T34 (D-90): Chi tiết ĐXMS (SCR-29) bỏ cùng phương án Tách — liên kết ĐXMS mở Chi tiết luồng mua sắm (SCR-97). */
  const dxmsHref = (code) => 'luong/' + encodeURIComponent(code);

// [T34 bỏ Tách]   function dxmsList() {
// [T34 bỏ Tách]     // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html
// [T34 bỏ Tách]     //       + utils/task-management-columns.utils.ts (Thao tác 100 → Mã → Tên → Cấp → Ngày cập nhật)
// [T34 bỏ Tách]     const rows = dxmsRows();
// [T34 bỏ Tách]     const pages = Math.max(1, Math.ceil(rows.length / X.size));
// [T34 bỏ Tách]     if (X.page > pages) X.page = pages;
// [T34 bỏ Tách]     const from = (X.page - 1) * X.size;
// [T34 bỏ Tách]     const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Mã ĐXMS', 170], ['Tên ĐXMS', 340], ['Đề tài / dự án', 260], ['Đợt', 70, 'c'], ['Đơn vị đề xuất', 200],
// [T34 bỏ Tách]       ['Giá trị hiệu lực (tỷ đồng)', 180, 'r'], ['Mức ưu tiên', 130], ['Người tạo', 170], ['Ngày cập nhật', 140]];
// [T34 bỏ Tách]     const body = rows.slice(from, from + X.size).map((x, i) => `<tr class="click" data-go="${dxmsHref(x.code)}" data-code="${esc(x.code)}">
// [T34 bỏ Tách]         <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-go="${dxmsHref(x.code)}/edit"`)}${x.state === 'NEW' ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-del-dxms="${esc(x.code)}"`)}` : ''}</div></td>
// [T34 bỏ Tách]         <td class="c">${dxmsBadge(x.state, x.adjN)}</td><td><a class="link" data-go="${dxmsHref(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
// [T34 bỏ Tách]         <td>${clamp(nvText(x.nv))}</td><td class="c">${dotOf(x) || dash}</td><td>${clamp(x.unit)}</td>
// [T34 bỏ Tách]         <td class="r num">${x.value != null ? ty(x.value) : dash}</td><td>${esc(x.priority)}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td></tr>`).join('');
// [T34 bỏ Tách]     const info = {
// [T34 bỏ Tách]       scr: 'SCR-27', name: 'Danh sách ĐXMS', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20',
// [T34 bỏ Tách]       notes: [
// [T34 bỏ Tách]         '<b>ĐXMS là đối tượng cha</b> (D-10), tương đương nhiệm vụ KHCN; <b>T34 (D-85): mỗi ĐXMS đúng một hồ sơ</b> — ĐXMS gốc có hồ sơ Phê duyệt (MS01), mỗi lần điều chỉnh là một <b>ĐXMS mới</b> (Điều chỉnh từ ĐXMS cũ) có hồ sơ Điều chỉnh (MS02). Bố cục theo task-management, Thêm mới trên hàng tiêu đề.',
// [T34 bỏ Tách]         'Tìm kiếm nâng cao (Backlog W1_T10, T16 B1 — task-management chưa có, dựng theo panel của profile-list): Mã, Tên, Nhiệm vụ / Đề tài, Đơn vị đề xuất, Trạng thái, Mức ưu tiên, Ngày tạo từ / đến. Mở panel thì ẩn ô tìm kiếm (B5). BE thêm tham số lọc cho API danh sách ĐXMS.',
// [T34 bỏ Tách]         'Thêm mới chỉ tạo ĐXMS, <b>không khởi tạo quy trình</b> (D-11). Hồ sơ tạo ở Chỉnh sửa ĐXMS › Danh sách hồ sơ › Tạo hồ sơ (như source), hoặc ở Hồ sơ ĐXMS › Thêm mới.',
// [T34 bỏ Tách]         'Trạng thái ĐXMS suy từ hồ sơ của nó và ĐXMS điều chỉnh của nó (R5, T34): Chưa có hồ sơ → Đang phê duyệt → Đã phê duyệt → Đang điều chỉnh (bản điều chỉnh đang chạy) → Đã được điều chỉnh (bản điều chỉnh đã duyệt, hết hiệu lực); Dừng xử lý. Giá trị hiệu lực = giá trị hồ sơ Hoàn thành của ĐXMS, chưa có thì là giá trị dự kiến (R4, P-66).',
// [T34 bỏ Tách]         'Cột Thao tác: Sửa mở Chỉnh sửa ĐXMS; <b>Xoá</b> chỉ hiện khi ĐXMS chưa có hồ sơ (R6). Source có thêm cột Cấp nhiệm vụ → thay bằng Mức ưu tiên; thêm Trạng thái, Đơn vị đề xuất, Giá trị hiệu lực.',
// [T34 bỏ Tách]         '<b>T29 — trường theo màn Soạn thảo TTr của hệ thống cũ</b> (HT-DXMS-NOTE màn 6, 7; "TTr" = ĐXMS): Tìm kiếm nâng cao thêm Khối đơn vị (Đơn vị đề xuất hiện theo khối — GIẢ LẬP P-190), Người tạo, Mật; bảng thêm Đề tài / dự án, Đợt (P-192), Người tạo. SRS-DXMS chưa có (D-59).',
// [T34 bỏ Tách]       ],
// [T34 bỏ Tách]       q: ['P-65', 'P-66', 'P-190', 'P-192'], src: 'task-management/task-management.component · /task-management',
// [T34 bỏ Tách]     };
// [T34 bỏ Tách]     return `<div class="pg">
// [T34 bỏ Tách]       ${head({ title: 'Danh sách ĐXMS', info, right: createBtn('dxms') })}
// [T34 bỏ Tách]       <div class="vcard">
// [T34 bỏ Tách]         <div class="pg-head"><span></span><div class="r">
// [T34 bỏ Tách]           ${X.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="dxms-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên ĐXMS" value="${esc(X.kw)}"></label>`}
// [T34 bỏ Tách]           <button class="vbtn ${X.adv ? 'active' : 'secondary'}" data-xl="adv">${X.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
// [T34 bỏ Tách]         ${X.adv ? dxmsAdv() : ''}
// [T34 bỏ Tách]         <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
// [T34 bỏ Tách]           <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
// [T34 bỏ Tách]         ${pager({ id: 'dx', total: rows.length, page: X.page, size: X.size, open: X.psOpen })}
// [T34 bỏ Tách]       </div></div>`;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   document.addEventListener('click', async (e) => {
// [T34 bỏ Tách]     const t = e.target;
// [T34 bỏ Tách]     const pg = t.closest('[data-pager="dx"]');
// [T34 bỏ Tách]     if (pg) {
// [T34 bỏ Tách]       const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
// [T34 bỏ Tách]       if (b) X.page = Number(b.dataset.pg);
// [T34 bỏ Tách]       else if (s) { X.size = Number(s.dataset.ps); X.page = 1; X.psOpen = false; } else if (t.closest('[data-ps-open]')) X.psOpen = !X.psOpen;
// [T34 bỏ Tách]       else return;
// [T34 bỏ Tách]       rerender(); return;
// [T34 bỏ Tách]     }
// [T34 bỏ Tách]     if (X.psOpen) { X.psOpen = false; rerender(); }
// [T34 bỏ Tách]     const xl = t.closest('[data-xl]');
// [T34 bỏ Tách]     if (xl) {
// [T34 bỏ Tách]       if (xl.dataset.xl === 'adv') { X.adv = !X.adv; X.d = JSON.parse(JSON.stringify(X.f)); X.page = 1; }
// [T34 bỏ Tách]       if (xl.dataset.xl === 'reset') { X.d = emptyDx(); X.f = emptyDx(); X.page = 1; }
// [T34 bỏ Tách]       rerender(); return;
// [T34 bỏ Tách]     }
// [T34 bỏ Tách]     const del = t.closest('[data-del-dxms]');
// [T34 bỏ Tách]     if (!del) return;
// [T34 bỏ Tách]     /* Nút nằm trong dòng có data-go: chặn listener mở chi tiết của app.js (đăng ký sau). */
// [T34 bỏ Tách]     e.stopImmediatePropagation();
// [T34 bỏ Tách]     const x = Flow.findDxms(del.dataset.delDxms);
// [T34 bỏ Tách]     const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa ĐXMS', desc: `Bạn có chắc chắn muốn xóa ĐXMS ${x.title} - ${x.code} không? Thao tác này không thể hoàn tác.`,
// [T34 bỏ Tách]       hl: x.title, cancel: 'Hủy', ok: 'Xóa' });
// [T34 bỏ Tách]     if (!yes) return;
// [T34 bỏ Tách]     Flow.deleteDxms(x.code);
// [T34 bỏ Tách]     window.UI.toast('<b>Thành công</b><br>Xóa ĐXMS thành công');
// [T34 bỏ Tách]   });

// [T34 bỏ Tách]   /* ---------- SCR-28 Thêm mới / Chỉnh sửa ĐXMS ---------- */
// [T34 bỏ Tách]   const XF = { mode: 'create', code: null, v: {}, err: {} };
// [T34 bỏ Tách]   const tyIn = (n) => (n == null || n === '' ? '' : String(n).replace('.', ','));
// [T34 bỏ Tách]   function resetDxmsForm(mode, code) {
// [T34 bỏ Tách]     const x = code && Flow.findDxms(code);
// [T34 bỏ Tách]     const u = persona(Flow.state.persona).unit;
// [T34 bỏ Tách]     Object.assign(XF, { mode, code: code || null, err: {} });
// [T34 bỏ Tách]     XF.v = x ? { title: x.title, nv: x.nv || null, unit: x.unit, priority: x.priority, est: tyIn(x.est), period: x.period || '', secret: x.secret ? 'Có' : 'Không', purpose: x.purpose || '', dot: String(dotOf(x) || '') }
// [T34 bỏ Tách]       : { title: '', nv: null, unit: UNITS.includes(u) ? u : null, priority: 'Thường', est: '', period: '', secret: 'Không', purpose: '', dot: '' };
// [T34 bỏ Tách]     XF.dotTouched = !!x;
// [T34 bỏ Tách]   }

// [T34 bỏ Tách]   function dxmsForm() {
// [T34 bỏ Tách]     // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create / edit)
// [T34 bỏ Tách]     const edit = XF.mode === 'edit', x = edit && Flow.findDxms(XF.code);
// [T34 bỏ Tách]     if (edit && !x) return notFound('Chỉnh sửa ĐXMS');
// [T34 bỏ Tách]     const v = XF.v, err = XF.err, back = edit ? dxmsHref(XF.code) : 'dxms';
// [T34 bỏ Tách]     const upd = (k) => (val) => { v[k] = val; delete err[k]; rerender(); };
// [T34 bỏ Tách]     const txt = (k, ph, o) => `<input class="vctl" data-xf="${k}" id="x-${k}" maxlength="${(o && o.max) || 255}" placeholder="${ph}" value="${esc(v[k])}" ${err[k] ? 'aria-invalid="true"' : ''}>`;
// [T34 bỏ Tách]     const info = {
// [T34 bỏ Tách]       scr: 'SCR-28', name: edit ? 'Chỉnh sửa ĐXMS' : 'Thêm mới ĐXMS', uc: 'UC-07-01 · UR-DX-01, UR-COM-05, 06',
// [T34 bỏ Tách]       notes: [
// [T34 bỏ Tách]         'Theo task-create (mode create / edit) của Quản lý nhiệm vụ KHCN: card "Thông tin chung nhiệm vụ" → <b>Thông tin chung ĐXMS</b>. Bỏ card Chủ nhiệm đề tài và hai bảng nhân sự của KHCN — người xử lý ĐTMS được chọn trong từng hồ sơ (CQCM ở task 16, người ký theo ma trận).',
// [T34 bỏ Tách]         'Lưu chỉ tạo/cập nhật ĐXMS, <b>không khởi tạo quy trình</b> (D-11); về Danh sách ĐXMS như source. Mã ĐXMS tự sinh.',
// [T34 bỏ Tách]         'Giá trị dự kiến là giá trị ban đầu; giá trị hiệu lực lấy từ hồ sơ Hoàn thành gần nhất và không sửa tay (R4).',
// [T34 bỏ Tách]         'Comment Figma #1: ĐXMS bắt buộc chọn từ một <b>nhiệm vụ / đề tài, dự án</b> đã phê duyệt (nhiệm vụ KHCN, dự án SXKD hoặc kế hoạch mua sắm thường xuyên năm). BE nạp danh sách; loại của mục chọn quyết định nguồn đối soát ở task 08 (MBOM + dự toán hoặc KHN). Cần thêm trường vào ĐXMS (FE + BE).',
// [T34 bỏ Tách]         'Comment Figma #12 (Gợi ý AI, D-20): Mật = Có → khối "AI kiểm tra quy tắc bảo mật". Service AI chạy khi Lưu với Tên, Mục đích, Đơn vị; kết quả chỉ xem, không chặn Lưu (S5). Prototype đánh giá ngay khi nhập, theo 4 quy tắc mẫu.',
// [T34 bỏ Tách]         '<b>T29 — Đợt mua sắm</b> (HT-DXMS-NOTE màn 8 "V/v đề xuất mua sắm; Đợt số"; "TTr" = ĐXMS): cùng một nhiệm vụ / đề tài, dự án mua nhiều đợt. Hệ thống gợi ý số ĐXMS đã có của nhiệm vụ + 1, đơn vị sửa được (GIẢ LẬP P-192). SRS-DXMS chưa có trường này (D-59).',
// [T34 bỏ Tách]         'Các trường khác của màn Thêm mới TTr cũ đã có cách làm khác trong SRS: Loại biểu mẫu → Quy trình theo ngưỡng; Cấp phê duyệt → bước 48; Danh sách đơn vị phê duyệt, Chân ký → theo quy tắc ký; Hình thức trình ký → theo Mật; Căn cứ pháp lý → văn bản căn cứ; Danh sách người thẩm định → chọn CQCM ở bước 16; Kiểm tra Mật → AI kiểm tra quy tắc bảo mật.',
// [T34 bỏ Tách]       ].concat(edit ? ['Chế độ Chỉnh sửa có card <b>Hồ sơ</b> (T34: một hồ sơ) với nút <b>Tạo hồ sơ</b> khi ĐXMS chưa có hồ sơ và card Tài liệu đính kèm — đúng như source (nút Tạo hồ sơ chỉ có ở mode edit). Tạo hồ sơ mở form Thêm mới hồ sơ với ô ĐXMS đã khoá.'] : []),
// [T34 bỏ Tách]       q: ['P-65', 'P-69', 'P-70', 'P-192'], src: 'task-management/components/task-create · /task-management/' + (edit ? 'edit/:id' : 'create'),
// [T34 bỏ Tách]     };
// [T34 bỏ Tách]     return `<form class="pg" data-dxms-form>
// [T34 bỏ Tách]       ${head({ title: edit ? 'Chỉnh sửa ĐXMS' : 'Thêm mới ĐXMS', back, lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="x-save">Lưu</button>` })}
// [T34 bỏ Tách]       <section class="vcard"><h3>Thông tin chung ĐXMS</h3>
// [T34 bỏ Tách]         <div class="grid3">
// [T34 bỏ Tách]           ${field('Mã ĐXMS', `<input class="vctl" placeholder="Hệ thống tự sinh" value="${esc(XF.code || '')}" disabled>`)}
// [T34 bỏ Tách]           ${field('Tên ĐXMS', txt('title', 'Nhập tên ĐXMS', { max: 500 }), { req: true, err: err.title, cls: 'span2' })}
// [T34 bỏ Tách]           ${field('Đề tài / dự án', vSelect({ id: 'x-nv', value: v.nv, searchable: true, placeholder: 'Chọn đề tài / dự án', invalid: !!err.nv,
// [T34 bỏ Tách]             options: D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name} (${n.kind})` })),
// [T34 bỏ Tách]             onChange: (val) => { readXf(); v.nv = val; delete err.nv; if (!XF.dotTouched) v.dot = nextDot(val); rerender(); } }), { req: true, err: err.nv, cls: 'span2' })}
// [T34 bỏ Tách]           ${field('Loại', `<input class="vctl" value="${esc((D.nvOf(v.nv) || {}).kind || '')}" placeholder="Theo đề tài / dự án đã chọn" disabled>`)}
// [T34 bỏ Tách]           ${field('Đợt mua sắm', txt('dot', 'Nhập số đợt', { max: 3 }), { err: err.dot })}
// [T34 bỏ Tách]           ${field('Đơn vị đề xuất', vSelect({ id: 'x-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit, options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd('unit') }), { req: true, err: err.unit })}
// [T34 bỏ Tách]           ${field('Mức ưu tiên', vSelect({ id: 'x-pri', value: v.priority, placeholder: 'Chọn mức ưu tiên', invalid: !!err.priority, options: PRIORITIES.map((p) => ({ value: p, label: p })), onChange: upd('priority') }), { req: true, err: err.priority })}
// [T34 bỏ Tách]           ${field('Mật', vSelect({ id: 'x-sec', value: v.secret, options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd('secret') }))}
// [T34 bỏ Tách]           ${field('Giá trị dự kiến (tỷ đồng)', txt('est', 'Nhập giá trị dự kiến'), { err: err.est })}
// [T34 bỏ Tách]           ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 09/2027'))}
// [T34 bỏ Tách]           ${field('Người tạo', `<input class="vctl" value="${esc(edit ? x.creator || '' : persona(Flow.state.persona).name)}" disabled>`)}
// [T34 bỏ Tách]           ${field('Mục đích', `<textarea class="vctl ta" data-xf="purpose" id="x-purpose" maxlength="2000" placeholder="Nhập mục đích">${esc(v.purpose)}</textarea>`, { cls: 'span3' })}
// [T34 bỏ Tách]         </div></section>
// [T34 bỏ Tách]       ${v.secret === 'Có' ? secCheckCard(v) : ''}
// [T34 bỏ Tách]       ${edit ? profilesCard(XF.code, true) + attachmentsCard(XF.code) : ''}</form>`;
// [T34 bỏ Tách]   }

  /* Comment #12 — kết quả AI kiểm tra quy tắc bảo mật (mẫu). Trên hệ thống thật: service AI chạy khi Lưu, trả kết quả theo từng quy tắc. */
  const SEC_WORDS = /(^|[\s,.;:()])(mật|tối mật|tuyệt mật|băng ka|5g sa|quốc phòng)(?=$|[\s,.;:()])|\d+(\.\d+)?\s?(ghz|mhz|dbm)|tọa độ|toạ độ|địa điểm/i;
  /* pre: tiền tố id ô Tên / Mục đích của form (x = Thêm mới ĐXMS, lf = Thêm mới luồng mua sắm). */
  /* o.skip: quy tắc không áp dụng cho màn gọi (vd SCR-96 không còn Mục đích — T29 B12, RV-PROTO-0511 #7). */
  function secCheckCard(v, pre, o) {
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
      ${docTable([['Quy tắc', 420], ['Kết quả', 140, 'c'], ['Gợi ý', 420]], D.secRules.filter((r) => !((o && o.skip) || []).includes(r.id)), (r) => `<td>${esc(r.name)}</td><td class="c">${badge(res[r.id][0], tone[res[r.id][0]])}</td><td>${esc(res[r.id][1] || '-')}</td>`)}</section>`;
  }

// [T34 bỏ Tách]   function readXf() { ['title', 'est', 'period', 'purpose', 'dot'].forEach((k) => { const el = document.getElementById('x-' + k); if (el) XF.v[k] = el.value; }); }
// [T34 bỏ Tách]   function saveDxms() {
// [T34 bỏ Tách]     readXf();
// [T34 bỏ Tách]     const v = XF.v, err = XF.err = {};
// [T34 bỏ Tách]     if (v.dot.trim() !== '' && !/^[1-9]\d{0,2}$/.test(v.dot.trim())) err.dot = 'Đợt mua sắm là số nguyên dương.';
// [T34 bỏ Tách]     if (!v.title.trim()) err.title = 'Bạn cần nhập Tên ĐXMS.';
// [T34 bỏ Tách]     if (!v.nv) err.nv = 'Bạn cần chọn Đề tài / dự án.';
// [T34 bỏ Tách]     if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
// [T34 bỏ Tách]     if (!v.priority) err.priority = 'Bạn cần chọn Mức ưu tiên.';
// [T34 bỏ Tách]     const est = v.est.trim() === '' ? null : Number(v.est.trim().replace(/\./g, '').replace(',', '.'));
// [T34 bỏ Tách]     if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Giá trị dự kiến không đúng định dạng.';
// [T34 bỏ Tách]     if (Object.keys(err).length) { rerender(); return; }
// [T34 bỏ Tách]     const data = { title: v.title.trim(), nv: v.nv, unit: v.unit, priority: v.priority, est, period: v.period.trim(), secret: v.secret === 'Có', purpose: v.purpose.trim(), dot: v.dot.trim() ? Number(v.dot.trim()) : null };
// [T34 bỏ Tách]     if (XF.mode === 'edit') { Flow.updateDxms(XF.code, data); window.UI.toast('<b>Thành công</b><br>Cập nhật ĐXMS thành công!'); } else { Flow.createDxms(data); window.UI.toast('<b>Thành công</b><br>Thêm mới ĐXMS thành công!'); }
// [T34 bỏ Tách]     location.hash = '#/dxms';
// [T34 bỏ Tách]   }
// [T34 bỏ Tách]   document.addEventListener('submit', (e) => { if (e.target.matches('[data-dxms-form]')) { e.preventDefault(); saveDxms(); } });
// [T34 bỏ Tách]   document.addEventListener('submit', (e) => { if (e.target.matches('[data-xadv]')) { e.preventDefault(); X.f = JSON.parse(JSON.stringify(X.d)); X.page = 1; rerender(); } });
// [T34 bỏ Tách]   document.addEventListener('input', (e) => { const f = e.target.closest && e.target.closest('[data-xlf]'); if (f) X.d[f.dataset.xlf] = f.value; if (e.target.id === 'x-dot') XF.dotTouched = true; });

// [T34 bỏ Tách]   /* T34 (D-85): hồ sơ của ĐXMS — đúng một dòng (TASK_PROFILE_COLUMNS + Loại hồ sơ). Nút Tạo hồ sơ chỉ khi ĐXMS chưa có hồ sơ (Chỉnh sửa, như source). */
// [T34 bỏ Tách]   function profilesCard(code, edit) {
// [T34 bỏ Tách]     const hs = allCases().filter((c) => c.dxms === code).slice(0, 1);
// [T34 bỏ Tách]     const cols = [['Mã Camunda', 160], ['Mã hồ sơ', 150], ['Loại hồ sơ', 150], ['Căn cứ điều chỉnh', 150], ['Quy trình', 280], ['Bước hiện tại', 240], ['Ngày tạo', 130], ['Trạng thái', 169, 'c']];
// [T34 bỏ Tách]     const from = (c) => (c.from ? `<a class="link" data-go="${caseHref(allCases().find((o) => o.code === c.from) || { code: c.from })}">${esc(c.from)}</a>` : dash);
// [T34 bỏ Tách]     return `<section class="vcard" data-dxms-profiles><div class="vcard-h"><h3>Hồ sơ</h3>${edit && !hs.length ? `<button type="button" class="vbtn red" data-go="ho-so-dxms/create/${encodeURIComponent(code)}">Tạo hồ sơ</button>` : ''}</div>
// [T34 bỏ Tách]       ${docTable(cols, hs, (c) => `<td class="num">${esc(window.QuyTrinh.camundaKey(c.code))}</td><td><a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a></td><td>${esc(kindLabel(c.kind))}</td><td>${from(c)}</td>
// [T34 bỏ Tách]         <td>${clamp(procLabel(c.flow, c.flowLabel))}</td><td>${clamp(c.step || (c.st === 'processing' ? '' : END_STEP[c.st]))}</td><td class="num">${esc(c.created)}</td><td class="c">${stBadge(c.st)}</td>`)}</section>`;
// [T34 bỏ Tách]   }
  /* T34: Lịch sử điều chỉnh — chuỗi ĐXMS gốc → các ĐXMS điều chỉnh (adjFrom); dòng của ĐXMS đang xem in đậm. Chỉ hiện khi chuỗi có từ hai ĐXMS. */
  function chainCard(code) {
    const chain = Flow.dxmsChain(code), cases = allCases();
    if (chain.length < 2) return '';
    const cols = [['Lần', 70, 'c'], ['Mã ĐXMS', 170], ['Giá trị (tỷ đồng)', 150, 'r'], ['Lý do điều chỉnh', 360], ['Ngày tạo', 130], ['Trạng thái', 190, 'c']];
    return `<section class="vcard" data-dxms-chain><h3>Lịch sử điều chỉnh</h3>
      ${docTable(cols, chain, (x) => { const m = dxmsMeta(x, cases), c = m.own, cur = x.code === code;
    return `<td class="c">${x.adjN ? x.adjN : 'Gốc'}</td><td>${cur ? `<b>${esc(x.code)}</b>` : `<a class="link" data-go="${dxmsHref(x.code)}">${esc(x.code)}</a>`}</td>
        <td class="r num">${c && c.total != null ? ty(c.total) : x.est != null ? ty(x.est) : dash}</td>
        <td>${clamp(x.reason)}</td><td class="num">${esc(x.created)}</td><td class="c">${dxmsBadge(m.state, m.adjN)}</td>`; })}</section>`;
  }
// [T34 bỏ Tách]   /* Tài liệu đính kèm của ĐXMS = tài liệu và văn bản đầu ra của các hồ sơ (TASK_ATTACHMENT_COLUMNS). */
// [T34 bỏ Tách]   function attachmentsCard(code) {
// [T34 bỏ Tách]     const rows = [];
// [T34 bỏ Tách]     allCases().filter((c) => c.dxms === code).forEach((c) => {
// [T34 bỏ Tách]       const vm = c.live ? { files: caseFiles(), outs: outputDocs() } : sampleVm(c);
// [T34 bỏ Tách]       vm.files.concat(vm.outs).forEach((f) => rows.push({ name: f.name, at: f.at, c }));
// [T34 bỏ Tách]     });
// [T34 bỏ Tách]     return `<section class="vcard"><h3>Tài liệu đính kèm</h3>
// [T34 bỏ Tách]       ${docTable([['Thao tác', 80, 'c'], ['Tên tài liệu', 320], ['Mã hồ sơ', 160], ['Ngày tạo', 150], ['Ngày cập nhật', 150]], rows, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
// [T34 bỏ Tách]         <td><span class="clamp">${esc(r.name)}</span></td><td><a class="link" data-go="${caseHref(r.c)}">${esc(r.c.code)}</a></td><td class="num">${esc(r.at)}</td><td class="num">${esc(r.at)}</td>`)}</section>`;
// [T34 bỏ Tách]   }

  /* ---------- SCR-108 Điều chỉnh đề xuất mua sắm (T34, người dùng 09/11) ----------
     Danh sách ĐXMS điều chỉnh (adjFrom có giá trị): mỗi dòng một lần điều chỉnh = một ĐXMS mới + hồ sơ MS02. Thêm mới mở SCR-25 loại Điều chỉnh. */
  const A = { kw: '' };
  function adjList() {
    // Theo: task-management (danh sách đối tượng cha) — cột của ĐXMS + cột riêng của lần điều chỉnh.
    const cases = allCases(), n = window.UI.norm;
    const rows = Flow.dxmsAll().filter((x) => x.adjFrom).map((x) => Object.assign({}, x, dxmsMeta(x, cases)))
      .filter((x) => !A.kw || n(x.code + ' ' + x.adjFrom + ' ' + x.title).includes(n(A.kw)));
    const before = (x) => { const o = Flow.findDxms(x.adjFrom); return o ? dxmsMeta(o, cases).value : null; };
    const cols = [['Trạng thái', 190, 'c'], ['Mã ĐXMS điều chỉnh', 170], ['ĐXMS được điều chỉnh', 170], ['Lần', 60, 'c'], ['Tên ĐXMS', 320], ['Đơn vị đề xuất', 200],
      ['Giá trị trước (tỷ đồng)', 160, 'r'], ['Giá trị sau (tỷ đồng)', 160, 'r'], ['Lý do điều chỉnh', 300], ['Người tạo', 170], ['Ngày tạo', 120]];
    const body = rows.map((x, i) => `<tr class="click" data-go="${dxmsHref(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${i + 1}</td><td class="c">${dxmsBadge(x.state, x.adjN)}</td><td><a class="link" data-go="${dxmsHref(x.code)}">${esc(x.code)}</a></td>
        <td><a class="link" data-go="${dxmsHref(x.adjFrom)}">${esc(x.adjFrom)}</a></td><td class="c">${x.adjN || 1}</td><td>${clamp(x.title)}</td><td>${clamp(x.unit)}</td>
        <td class="r num">${before(x) != null ? ty(before(x)) : dash}</td><td class="r num">${x.own && x.own.total != null ? ty(x.own.total) : x.est != null ? ty(x.est) : dash}</td>
        <td>${clamp(x.reason)}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.created)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-108', name: 'Điều chỉnh đề xuất mua sắm', uc: 'UC-07-12 · UR-DX-20',
      notes: [
        'Menu mới theo yêu cầu người dùng 09/11, ngay dưới Đề xuất mua sắm (phương án Gộp: dưới Luồng mua sắm).',
        '<b>T34 (D-85): mỗi lần điều chỉnh là một ĐXMS mới</b> (mã mới, Điều chỉnh từ ĐXMS cũ, lần n) có đúng một hồ sơ Điều chỉnh (MS02). Danh sách này chỉ gồm các ĐXMS điều chỉnh; ĐXMS gốc ở Đề xuất mua sắm.',
        'Giá trị trước = giá trị hiệu lực của ĐXMS được điều chỉnh; Giá trị sau = giá trị của hồ sơ Điều chỉnh (sửa ở bước 4).',
        '<b>Thêm mới</b>: chọn ĐXMS cần điều chỉnh (chỉ ĐXMS Đã phê duyệt — bản còn hiệu lực của chuỗi); Lưu tạo ĐXMS mới + hồ sơ Điều chỉnh, khởi tạo MS02, mở bước 1. Cũng tạo được từ nút Điều chỉnh ĐXMS ở Chi tiết ĐXMS.',
      ],
      q: ['P-102', 'P-226'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Điều chỉnh đề xuất mua sắm', info, right: `<button class="vbtn primary" data-go="dieu-chinh-dxms/create">${icon('add')} Thêm mới</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r"><label class="vsearch" style="width:320px">${icon('search')}<input id="dc-kw" maxlength="255" placeholder="Tìm kiếm theo mã ĐXMS, ĐXMS được điều chỉnh, tên" value="${esc(A.kw)}"></label></div></div>
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
      </div></div>`;
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'dc-kw') return;
    A.kw = e.target.value.trim(); rerender();
    const k = document.getElementById('dc-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

// [T34 bỏ Tách]   /* ---------- SCR-29 Chi tiết ĐXMS ---------- */
// [T34 bỏ Tách]   const notFound = (title) => `<div class="pg">${head({ title, back: 'dxms', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy ĐXMS.</div></section></div>`;
// [T34 bỏ Tách]   function dxmsDetail(code) {
// [T34 bỏ Tách]     // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode detail)
// [T34 bỏ Tách]     const x = Flow.findDxms(code);
// [T34 bỏ Tách]     if (!x) return notFound('Xem chi tiết ĐXMS');
// [T34 bỏ Tách]     const m = dxmsMeta(x, allCases());
// [T34 bỏ Tách]     const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
// [T34 bỏ Tách]     const info = {
// [T34 bỏ Tách]       scr: 'SCR-29', name: 'Chi tiết ĐXMS', uc: 'UC-07-01, UC-07-12 · UR-DX-20',
// [T34 bỏ Tách]       notes: [
// [T34 bỏ Tách]         'Theo task-create (mode detail): nút <b>Chỉnh sửa</b> trên hàng tiêu đề; cards Thông tin chung ĐXMS · <b>Danh sách hồ sơ</b> · Tài liệu đính kèm. Nút Tạo hồ sơ chỉ có ở Chỉnh sửa (như source).',
// [T34 bỏ Tách]         'Danh sách hồ sơ theo TASK_PROFILE_COLUMNS (Mã Camunda, Mã hồ sơ, Quy trình, Bước hiện tại, Ngày tạo, Trạng thái) + Loại hồ sơ. Hồ sơ Phê duyệt và các hồ sơ Điều chỉnh của cùng ĐXMS nằm chung, truy vết được bản cũ → bản điều chỉnh (UR-DX-20).',
// [T34 bỏ Tách]         '<b>T34 (D-85…D-89): mỗi ĐXMS một hồ sơ.</b> Card <b>Hồ sơ</b> một dòng (thay Danh sách hồ sơ). Điều chỉnh tạo <b>ĐXMS mới</b>: nút <b>Điều chỉnh ĐXMS</b> (chỉ khi Đã phê duyệt) mở Thêm mới hồ sơ loại Điều chỉnh với ô ĐXMS khoá. ĐXMS cũ: Đang điều chỉnh khi bản điều chỉnh đang chạy (còn hiệu lực), <b>Đã được điều chỉnh</b> khi bản điều chỉnh được duyệt (hết hiệu lực), về Đã phê duyệt nếu bản điều chỉnh dừng. Card <b>Lịch sử điều chỉnh</b> liệt kê chuỗi. ĐXMS Dừng xử lý không tạo lại hồ sơ: nút <b>Sao chép thành ĐXMS mới</b> (GIẢ LẬP P-226).',
// [T34 bỏ Tách]         'Giá trị hiệu lực = giá trị hồ sơ Hoàn thành của ĐXMS, chưa có thì giá trị dự kiến (R4). Trạng thái suy từ hồ sơ (R5).',
// [T34 bỏ Tách]         'Hồ sơ Điều chỉnh hoàn thành (T21 D-40, GIẢ LẬP P-102): ĐXMS giữ một mã, giá trị hiệu lực = giá trị sau điều chỉnh, trạng thái "Đã phê duyệt (điều chỉnh lần n)"; cột Căn cứ điều chỉnh của Danh sách hồ sơ nối chuỗi Phê duyệt → Điều chỉnh lần 1 → …',
// [T34 bỏ Tách]         '<b>T29</b> (HT-DXMS-NOTE màn 7, 8; "TTr" = ĐXMS): thêm Đợt mua sắm (P-192), Khối đơn vị (P-190), Người được xem; nút <b>Cập nhật người xem</b> như hành động cùng tên của hệ thống cũ — GIẢ LẬP P-189: người được xem thấy ĐXMS, hồ sơ, tài liệu, không xử lý việc. SRS-DXMS chưa có (D-59).',
// [T34 bỏ Tách]       ].concat(window.Ycbg.TAB_INFO),
// [T34 bỏ Tách]       q: ['P-66', 'P-73', 'P-74', 'P-102', 'P-189', 'P-190', 'P-192', 'P-226'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs',
// [T34 bỏ Tách]     };
// [T34 bỏ Tách]     return `<div class="pg">
// [T34 bỏ Tách]       ${head({ title: 'Xem chi tiết ĐXMS', back: 'dxms', lg: true, info, right: `${m.state === 'OK' ? `<button type="button" class="vbtn red" data-go="ho-so-dxms/create/${encodeURIComponent(x.code)}" data-adj-dxms>Điều chỉnh ĐXMS</button>` : ''}${m.state === 'STOP' ? `<button type="button" class="vbtn red" data-copy-dxms="${esc(x.code)}">Sao chép thành ĐXMS mới</button>` : ''}<button type="button" class="vbtn red" data-viewers="${esc(x.code)}">Cập nhật người xem</button><button type="button" class="vbtn primary" data-go="${dxmsHref(x.code)}/edit">Chỉnh sửa</button>` })}
// [T34 bỏ Tách]       ${window.Ycbg.tabs(x.code, `<section class="vcard pad24 gen"><h3>Thông tin chung ĐXMS</h3><div class="ginfo c3">
// [T34 bỏ Tách]         ${kv('Mã ĐXMS', esc(x.code))}${kv('Tên ĐXMS', esc(x.title), 'span2')}
// [T34 bỏ Tách]         ${kv('Đề tài / dự án', D.nvOf(x.nv) ? `<a class="link" data-go="${window.DeTai.href(x.nv)}">${esc(`${x.nv} — ${D.nvOf(x.nv).name}`)}</a>` : null, 'span2')}${kv('Loại', esc((D.nvOf(x.nv) || {}).kind || ''))}
// [T34 bỏ Tách]         ${kv('Đợt mua sắm', dotOf(x) ? String(dotOf(x)) : null)}${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Khối đơn vị', esc(D.blockOf(x.unit) || ''))}
// [T34 bỏ Tách]         ${kv('Người tạo', esc(x.creator))}${kv('Mức ưu tiên', esc(x.priority))}${kv('Người được xem', esc(viewersText(x)))}
// [T34 bỏ Tách]         ${kv('Giá trị hiệu lực (gồm VAT)', m.value != null ? ty(m.value) + ' tỷ đồng' : null)}${kv('Giá trị dự kiến', x.est != null ? ty(x.est) + ' tỷ đồng' : null)}${kv('Thời gian thực hiện', esc(x.period))}
// [T34 bỏ Tách]         ${kv('Trạng thái', dxmsBadge(m.state, m.adjN))}${kv('Mật', x.secret ? 'Có' : 'Không')}${kv('Ngày cập nhật', esc(x.updated))}
// [T34 bỏ Tách]         ${x.adjFrom ? kv('Điều chỉnh từ', `<a class="link" data-go="${dxmsHref(x.adjFrom)}">${esc(x.adjFrom)}</a>`) + kv('Lần điều chỉnh', String(x.adjN || 1)) + kv('Lý do điều chỉnh', esc(x.reason)) : ''}
// [T34 bỏ Tách]         ${m.adjBy ? kv(m.state === 'SUP' ? 'Được điều chỉnh bởi' : 'Đang điều chỉnh bởi', `<a class="link" data-go="${dxmsHref(m.adjBy)}">${esc(m.adjBy)}</a>`, 'span3') : ''}
// [T34 bỏ Tách]         ${x.copyFrom ? kv('Sao chép từ', `<a class="link" data-go="${dxmsHref(x.copyFrom)}">${esc(x.copyFrom)}</a>`, 'span3') : ''}
// [T34 bỏ Tách]         ${kv('Mục đích', esc(x.purpose), 'span3')}</div></section>
// [T34 bỏ Tách]       ${profilesCard(x.code, false)}${chainCard(x.code)}${attachmentsCard(x.code)}`)}</div>`;
// [T34 bỏ Tách]   }

  /* Vào route mới: form mở trống / nạp dữ liệu của bản ghi (thay cho ngOnInit). */
  function enter(r) {
    const [a, b, c, d] = r.split('/');
    // [T34 bỏ Tách] if (a === 'ho-so-dxms' && b === 'create') resetCreate(c ? decodeURIComponent(c) : null);
    // [T34 bỏ Tách] if (a === 'dxms' && b === 'create') resetDxmsForm('create');
    // [T34 bỏ Tách] if (a === 'dxms' && b && b !== 'create' && c === 'edit') resetDxmsForm('edit', decodeURIComponent(b));
    void a; void b; void c;
    return d;
  }

  /* ---------- SCR-20 Chi tiết hồ sơ + Xem BPMN ---------- */
  /* Văn bản hệ thống sinh theo bước (by = task); hồ sơ < 160 tỷ dùng BM-09 + Checklist 02 (task 11), không có BM-05…08. */
  /* D-95: Danh sách tài liệu của ĐXMS — cột Loại tài liệu (loại căn cứ, hoặc loại theo bước sinh ra tệp) và Bước (bước tải lên / sinh tệp) thay "Gắn với Hồ sơ" (D-92). */
  const SAMPLE_KIND = { 1: 'Văn bản căn cứ', 5: 'eBOM / dự toán bóc tách', 7: 'Kết quả rà soát tồn kho', 10: 'Báo giá nhà cung cấp' };
  const fileKind = (r) => (r.type ? docTypeName(r.type) : r.kind || '-');
  const fileStep = (r) => (r.by != null && Flow.isTask(r.by) ? `${tno(r.by)} · ${Flow.taskName(r.by)}` : r.to === 'ĐXMS' ? 'Lập đề xuất mua sắm' : '-');
  const DX_FILE_COLS = [['Loại tài liệu', 220], ['Bước', 260]];
  const dxFileCells = (r) => `<td><span class="clamp">${esc(fileKind(r))}</span></td><td><span class="clamp">${esc(fileStep(r))}</span></td>`;
  const DOCS = [
    { code: 'BM-01', name: 'Tờ trình đề xuất mua sắm', by: 12 }, { code: 'BM-09', name: 'Tờ trình đề xuất mua sắm (thẩm định, phê duyệt trực tiếp)', by: 11 },
    { code: 'BM-02', name: 'Thuyết minh / phụ lục giải trình', by: 12 }, { code: 'BM-02', name: 'Thuyết minh / phụ lục giải trình', by: 11 },
    { code: 'CL01', name: 'Checklist 01 — danh mục hồ sơ', by: 12 }, { code: 'CL02', name: 'Checklist 02 — danh mục hồ sơ', by: 11 }, { code: 'BM-03', name: 'Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS', by: 15 },
    { code: 'BM-04', name: 'Phiếu nhận xét (mỗi CQCM một phiếu)', by: 22 }, { code: 'BM-05', name: 'Báo cáo kết quả thẩm định', by: 41 },
    { code: 'BM-06', name: 'Công văn báo cáo TGĐ Tập đoàn', by: 49 }, { code: 'BM-07', name: 'Báo cáo của Ban ĐTXD Tập đoàn', by: 53 },
    { code: 'BM-08', name: 'Quyết định phê duyệt ĐXMS', by: 57 },
  ];
  const SCR20_INFO = { scr: 'SCR-20', name: 'Chi tiết hồ sơ', uc: 'UC-03-02, UC-12-04 · UR-WF-12, UR-KPI-01/02/04', src: 'profile-management/profile-detail · /khcn-profile-management/:id/view' };
  const END_STEP = { done: 'Kết thúc — đã phê duyệt', moved: 'Kết thúc — đã chuyển quy trình', stopped: 'Kết thúc theo chỉ đạo khác' };
  const USER_KEYS = () => { const k = []; for (let n = 1; n <= 61; n++) k.push(n); return k.filter((x) => T[x].type !== 'service'); };

  /* Hồ sơ đang chạy luồng → dữ liệu cho khuôn profile-detail. */
  function liveVm() {
    const ci = Flow.ci(), st = { running: 'processing', approved: 'done', moved: 'moved', stopped: 'stopped' }[Flow.state.status];
    const active = [...new Set(Flow.state.tokens.map((t) => String(t.task)))];
    const kpi = Flow.kpiUsed(), mv = Flow.state.movedTo;
    return {
      key: 'ho-so', code: ci.code, dxms: ci.dxms, kind: ci.kind, title: ci.name, flow: ci.flow, flowLabel: ci.flowLabel, st, unit: ci.unit, lead: persona('minh').name, total: ci.total,
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
    const keys = adj ? ms02Tasks().map((t) => t.n) : USER_KEYS().filter((k) => !na.includes(k));
    const tk = (k) => (adj ? ms02Tasks().find((t) => t.n === k) : T[k]);
    let cur = -1;
    if (c.st === 'processing') cur = Math.max(0, keys.findIndex((k) => parseInt(k, 10) >= (c.task || 1)));
    const doneN = c.st === 'processing' ? cur : c.st === 'done' ? keys.length : c.st === 'moved' ? keys.findIndex((k) => k > 10) : keys.length - 1;
    const steps = keys.map((k, i) => ({ no: k, title: tk(k).name, sub: tk(k).actor, state: i < doneN ? 'completed' : i === cur ? 'active' : 'upcoming' }));
    const d0 = parseDate(c.created), d1 = parseDate(c.updated), span = Math.max(1, doneN);
    const whoAdj = (k) => whoByActor(tk(k).actor, c.creator);
    const who = (k) => { if (adj) return whoAdj(k); const w = (D.flow[k] || {}).who || ''; return w === 'minh' ? c.creator : w.startsWith('cqcm') ? persona('hoa').name : persona(w || 'lan').name; };
    const at = (i) => { const d = new Date(d0.getTime() + ((d1 - d0) * (i + 1)) / (span + 1)); return `${fmtDate(d)} ${pad2(8 + (i * 3) % 9)}:${pad2((i * 17) % 60)}`; };
    const history = keys.slice(0, doneN).map((k, i) => ({ title: tk(k).name, st: 'COMPLETED', name: who(k), when: at(i), note: '' }))
      .concat(cur >= 0 ? [{ title: tk(keys[cur]).name, st: 'CREATED' }] : []);
    const doneAt = (by) => { const i = keys.findIndex((k) => parseInt(k, 10) >= by); return i >= 0 && i < doneN ? at(i).slice(0, 10) : null; };
    const outs = DOCS.filter((d) => doneAt(d.by) && !(na.includes(d.by))).map((d) => ({ code: d.code, by: d.by, name: `${d.code} ${d.name}`, at: doneAt(d.by) }));
    const files = [['QD-can-cu-' + c.code.slice(-4) + '.pdf', 1], ['eBOM-' + c.code.slice(-4) + '.xlsx', 5], ['RSTK-' + c.code.slice(-4) + '.xlsx', 7], ['Bao-gia-tong-hop.pdf', 10]]
      .filter(([, by]) => doneAt(by)).map(([name, by]) => ({ name, at: doneAt(by), by, kind: SAMPLE_KIND[by] }));
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
    const steps = keys.map((t, i) => ({ no: t.k, title: t.name, sub: t.actor, state: i < doneN ? 'completed' : i === cur ? 'active' : 'upcoming' }));
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
      ${kv('Mã ĐXMS', dxmsRef(vm.dxms))}${kv('Tên đề xuất mua sắm', esc(vm.title))}${kv('Loại', esc(kindLabel(vm.kind)))}${kv('Quy trình', esc(procLabel(vm.flow, vm.flowLabel)))}
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

  /* Danh sách tài liệu / Văn bản đầu ra của hồ sơ (profile-documents readOnly, profile-output-documents) — SCR-20 và tab Tài liệu & văn bản của SCR-97. */
  const filesCard = (vm) => `<section class="vcard"><div class="vcard-h"><h3>Danh sách tài liệu</h3><button type="button" class="vbtn secondary sm" data-tpl>${icon('file')} Chọn mẫu tài liệu</button></div>
          ${docTable([['Thao tác', 112, 'c'], ['Tên tài liệu', 260], ['Ngày tạo', 130]], vm.files, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
            <td><span class="clamp">${esc(r.name)}</span></td><td>${esc(r.at)}</td>`)}</section>`;
  const outsCard = (vm) => `<section class="vcard"><h3>Văn bản đầu ra</h3>
          ${docTable([['Thao tác', 112, 'c'], ['Tên tài liệu', 260], ['Ngày tạo', 170]], vm.outs, (r) => `<td class="c"><div class="acts">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}<span class="sep"></span>${dlPdf(r.name)}</div></td>
            <td><button type="button" class="link-btn" data-preview-doc="${esc(r.name)}|${esc(r.at)}|${esc(vm.code)}">${esc(r.name)}</button></td><td>${esc(r.at)}</td>`)}</section>`;

  /* SCR-97 chế độ xem (D-95): Danh sách tài liệu chỉ xem, cột Loại tài liệu / Bước như màn xử lý việc. */
  const dxFilesCard = (vm) => `<section class="vcard"><h3>Danh sách tài liệu</h3>
          ${docTable([['Thao tác', 100, 'c'], ['Tên tài liệu', 260]].concat(DX_FILE_COLS, [['Ngày tạo', 130]]), vm.files, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
            <td><span class="clamp">${esc(r.name)}</span></td>${dxFileCells(r)}<td>${esc(r.at)}</td>`)}</section>`;

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
        ${filesCard(vm)}${outsCard(vm)}
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
      <section class="vcard"><div class="bp-h"><h2>Bước hiện tại: ${esc(vm.step)}</h2><p>${esc(vm.proc || procLabel(vm.flow, vm.flowLabel))}</p></div>
        ${BpmnView.html(vm.key, vm.active, 520, vm.page ? { page: vm.page, focus: vm.focus } : undefined)}</section></div>`;
  }
  /* Chi tiết hồ sơ mẫu: quay lại màn đã mở nó (Giám sát tiến trình, Chi tiết / Chỉnh sửa ĐXMS), còn lại về Danh sách hồ sơ. */
  const backOf = (from) => (from && (from === 'giam-sat-tien-trinh' || /^dxms\/[^/]+(\/edit)?$/.test(from) || from === 'viec-cua-toi') ? from : 'ho-so-dxms');
  const bpmnNotes = () => [`Sơ đồ vẽ lại từ BPMN chuẩn ${esc(window.BPMN_SOURCE.file)} · trang "${esc(window.BPMN_DIAGRAM.page)}" (61 task; sinh bằng tools/bpmn-diagram-extract.mjs). Bản thật dùng app-bpmn-viewer (bpmn-js) đọc XML của quy trình đã deploy.`,
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

  /* ---------- T34 v0.2 (D-92, D-93): ĐXMS không còn màn Chi tiết hồ sơ riêng ----------
     Hồ sơ là bản ghi kỹ thuật của ĐXMS (1 – 1 wf_profile). Phần của SCR-20 (Quy trình, Lịch sử xử lý, Danh sách tài liệu, Văn bản đầu ra,
     So sánh trước – sau) vẽ trong các tab của Chi tiết đề xuất mua sắm (SCR-97, luong.js). Hồ sơ đang chạy luồng đọc Flow.state, hồ sơ mẫu suy như sampleVm. */
  const dxmsCaseOf = (code) => allCases().find((c) => c.dxms === code) || null;
  function dxmsParts(code) {
    const c = dxmsCaseOf(code);
    if (!c || (c.live && (Flow.state.kdt || Flow.state.parent || Flow.state.status === 'new'))) return null;
    const vm = c.live ? liveVm() : sampleVm(c);
    return {
      vm, steps: `<section class="vcard pad24"><h3>Quy trình</h3>${UI.vSteps({ id: 'q-' + vm.code, steps: vm.steps })}</section>`,
      history: historyCard(vm.history, 'drail', 'Lịch sử xử lý'), files: dxFilesCard(vm), outList: vm.outs, compare: compareCard(vm),
    };
  }
  /* Xem BPMN của ĐXMS (#/luong/<mã>/bpmn): khuôn profile-bpmn, "Xem quy trình" về tab Tiến trình. */
  function dxmsBpmn(code) {
    const p = dxmsParts(code), back = `luong/${encodeURIComponent(code)}/tien-trinh`;
    if (!p) return `<div class="pg">${head({ title: 'Chi tiết BPMN', back, lg: true })}<section class="vcard pad24"><div class="empty-t">Đề xuất mua sắm chưa bắt đầu quy trình.</div></section></div>`;
    return bpmnPage(Object.assign({}, p.vm, { key: back }));
  }
  /* Việc đã xử lý của ĐXMS (chế độ Xem): "Bước <số task BPMN> · Tên bước", thời điểm hoàn thành (hồ sơ mẫu: hạn của việc mẫu). */
  function doneStep(code, k) {
    const c = dxmsCaseOf(code);
    if (!c) return { step: '', date: '' };
    const name = c.live ? Flow.taskName(k) : (((c.flow === 'MS02' ? window.BPMN_FLOWS.MS02.tasks : T)[k]) || {}).name || '';
    let date = '';
    if (c.live) { const h = Flow.state.history.slice().reverse().find((x) => String(x.task) === String(k) && x.who); date = h ? dateTimeOf(h.t) : ''; }
    else { const s0 = D.sampleTasks.find((x) => x.code === c.code && String(x.task) === String(k)); date = s0 ? s0.due : ''; }
    return { step: `Bước ${k} · ${name}`, date };
  }
  /* Thanh trạng thái dưới tiêu đề (my-task-status-bar, QĐ05): mode 'process' — nền đỏ nhạt, vạch đỏ, sticky, "Đang chờ bạn xử lý" · bước · hạn
     (đỏ khi quá hạn), các nút hành động bên phải; mode 'view' — nền xanh nhạt, "Bạn đã xử lý xong" · bước · thời điểm hoàn thành, không nút.
     Prototype thêm: việc giao người khác (đang xem, không xử lý được) → "Đang chờ <tên> xử lý". */
  function statusBar(o) {
    if (o.mode === 'view') {
      return `<div class="sbar view" data-sbar="view"><span class="sbar-ic">${icon('check')}</span><div class="sbar-t"><div class="sbar-h">Bạn đã xử lý xong</div>
        <div class="sbar-s">${o.step ? esc(o.step) + ' · ' : ''}Hoàn thành ${esc(o.date || '-')}</div></div></div>`;
    }
    return `<div class="sbar" data-sbar="process"><div class="sbar-l"><span class="sbar-ic">${icon('clock')}</span><div class="sbar-t"><div class="sbar-h">${o.who ? `Đang chờ ${esc(o.who)} xử lý` : 'Đang chờ bạn xử lý'}</div>
        <div class="sbar-s">${o.step ? esc(o.step) + ' · ' : ''}Hạn xử lý <span class="${o.overdue ? 'sbar-late' : ''}">${esc(o.date || '-')}</span></div></div></div>
      ${o.acts ? `<div class="sbar-acts task-acts">${o.acts}</div>` : ''}</div>`;
  }

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
      ${head({ title: ci.isHd || ci.isKdt ? 'Chi tiết hồ sơ' : 'Chi tiết đề xuất mua sắm', back: 'task/' + tok.id, lg: true, info })}
      <section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo c3">
        ${ci.isHd || ci.isKdt ? kv('Mã hồ sơ', esc(ci.code)) + kv('Tên hồ sơ', esc(ci.name)) : ''}${ci.isHd ? kv('Mã hợp đồng', hdRef(ci.hd)) : ci.isKdt ? kv('Mã KĐT', kdtRef(ci.kdt)) : kv('Mã ĐXMS', dxmsRef(ci.dxms)) + kv('Tên đề xuất mua sắm', esc(ci.name))}
        ${kv('Công việc', esc(t.name + (tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : '')))}${kv('Người xử lý', esc(persona(tok.who).name))}${kv('Hạn xử lý', Flow.dateOf(tok.since + Math.max(1, Math.ceil((f.nlv || 0.5) * 2))))}
        ${kv(ci.isHd ? 'Đơn vị quản lý' : 'Đơn vị đề xuất', esc(ci.unit))}${kv(ci.isKdt ? 'Tổng mức vốn (gồm VAT)' : ci.isHd ? 'Giá trị hợp đồng (gồm thuế GTGT)' : 'Tổng giá trị (gồm VAT)', ty(ci.total) + ' tỷ đồng')}${ci.isHd ? kv('Nhà thầu', esc(hdNccName(ci.ncc))) : ci.isKdt ? kv('Nhóm KĐT', esc(kdtGroupText(ci))) : kv('Mức ưu tiên', esc(ci.priority))}</div></section>
      <section class="vcard pad24"><div class="bp-h"><h2>Bước hiện tại: ${esc(t.name + (ci.isKdt && kdtRoundOf(tok.task) ? ` (${kdtRoundOf(tok.task)})` : ''))}</h2><p>${esc(ci.isHd ? `${ci.flow} — ${D.hdProcesses[ci.flow].name}` : ci.isKdt ? kdtProcText('MS13') : procLabel(ci.flow, ci.flowLabel))}</p></div>
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

  /* Bước của vht-steps: task người dùng của quy trình theo thứ tự BPMN. */
  function processSteps() {
    const keys = [], last = Flow.state.parent ? Object.keys(TT()).length : Flow.state.kdt ? 78 : 61;
    /* MS01: chèn bước DX-10 (5.1, 7.1, 10.1, 16.1) sau bước gốc; MS02 / KĐT / hợp đồng giữ dãy số. */
    if (!Flow.state.parent && !Flow.state.kdt && D.familyOf(Flow.state.vars.process) === 'MS01') keys.push(...D.stepKeys(last));
    else for (let n = 1; n <= last; n++) keys.push(n);
    return keys.filter((k) => isUserTask(k) && !['na', 'cond'].includes(Flow.taskStatus(k)))
      .map((k) => {
        const st = Flow.taskStatus(k);
        return { no: k, title: TT()[k].name, sub: Flow.state.kdt ? kdtActor(TT()[k].actor) : TT()[k].actor.replace(/\s*\[[^\]]*\]/g, ''), state: st === 'active' ? 'active' : st === 'done' ? 'completed' : 'upcoming' };
      });
  }

  /* Lịch sử hồ sơ: mỗi lượt task người dùng (Hoàn thành) và việc đang chờ (Chưa xử lý), cũ → mới. */
  function caseHistory() {
    const done = Flow.state.history.filter((h) => h.who && isUserTask(h.task))
      .map((h) => ({ title: TT()[h.task].name, st: 'COMPLETED', who: h.who, at: sinceOf(h), note: h.reason || '' }));
    const open = Flow.state.tokens.filter((t) => isUserTask(t.task)).map((t) => ({ title: TT()[t.task].name, st: 'CREATED', who: t.who, at: t.since, note: '' }));
    /* T39 B1: Bổ sung ý kiến, Yêu cầu thay người xử lý (vct.js) hiện ở Lịch sử xử lý. */
    const vct = window.Vct ? window.Vct.historyItems((k) => (TT()[k] || {}).name || '') : [];
    return done.concat(vct, open).sort((a, b) => a.at - b.at);
  }
  let histNotes = [];
  /* items: { title, st: COMPLETED | CREATED, who|name, at|when, note }; cls: trail (màn task) | drail (chi tiết hồ sơ). */
  function historyCard(items, cls, title) {
    items = items || caseHistory();
    histNotes = items.map((x) => x.note);
    const HS = { COMPLETED: ['Hoàn thành', 'success', '#5fe495'], CREATED: ['Chưa xử lý', 'info', '#ee0033'] };
    return `<section class="vcard pad24 ${cls || 'trail'}"><h3>${title || 'Lịch sử hồ sơ'}</h3>${items.length ? `<ul class="vtl">${items.map((x, i) => `<li><span class="mk" style="border-color:${HS[x.st][2]}"></span><div>
        <div class="top"><span class="ti">${esc(x.title)}</span>${badge(HS[x.st][0], HS[x.st][1])}</div>
        ${x.st === 'COMPLETED' ? `<div class="cap">${esc(x.name || persona(x.who).name)} - ${x.when || dateTimeOf(x.at)}</div>` : ''}
        ${x.note ? `<div class="mt8"><button class="vbtn sm red" data-note="${i}">Xem nhận xét</button></div>` : ''}</div></li>`).join('')}</ul>`
      : '<div class="empty-t">Chưa có lịch sử xử lý.</div>'}</section>`;
  }

  /* T29 B12 (D-81, review Huylx4 #15–19): bước 01 không chọn lại căn cứ — căn cứ và phần còn khả dụng là khối chỉ xem ở Thông tin chung
     (thay bảng trong hộp thoại Hoàn thành), kèm dòng dự toán đã bóc tách khi tạo luồng. Số liệu: biến basisAll / duToanChon của eForm (EVars). */
  /* [T37 RV-PROTO-0911 #4] khối này không còn hiện (form Lập, Thông tin chung màn việc, Xem chi tiết hồ sơ) — giữ hàm, không còn nơi gọi.
     Kiểm vượt căn cứ ở bước 10 (bao-gia.js, P1) không đổi. */
  function basisAvail(tok) {
    /* T29 B19: bước 1–5 là màn Lập ĐXMS (DX-11) — khối hiện trong màn đó và ở bước 5.1 Chỉ huy ĐVĐX xác nhận khởi tạo. */
    if (!['1', '4', '5', '5.1'].includes(String(tok.task)) || Flow.state.kdt || Flow.state.parent || !window.EVars) return '';
    const v = window.EVars.of(tok), more = v.basisMore || [];
    const docs = (v.basisAll || []).filter((d) => d.id === v.basisDoc || more.includes(d.id)), dt = v.duToanChon || [];
    const sub = (t) => `<h4 class="ginfo-sub">${t}</h4>`;
    return `<div data-basis-avail>${sub('Văn bản căn cứ và giá trị còn khả dụng')}${docTable([['Số văn bản', 160], ['Loại căn cứ', 200], ['Vai trò', 90], ['Giá trị (tỷ đồng)', 130, 'r'], ['Đã dùng ở ĐXMS khác', 160, 'r'],
      ['ĐXMS này đang giữ', 150, 'r'], ['Còn có thể sử dụng', 150, 'r']], docs, (d) => `<td>${esc(d.so)}</td><td>${esc(d.loai)}</td><td>${esc(d.vaiTro)}</td><td class="r num">${esc(d.giaTri)}</td>
        <td class="r num">${esc(d.daDung)}</td><td class="r num">${esc(d.dangGiu)}</td><td class="r num">${esc(d.conLai)}</td>`)}
      ${dt.length ? sub('Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng') + docTable([['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80], ['Số lượng đề xuất', 130, 'r'],
        ['Giá trị dự tính (tỷ đồng)', 160, 'r'], ['Giá trị dự toán (tỷ đồng)', 160, 'r'], ['Hình thành gói thầu', 200]], dt, (r) => `<td>${esc(r.loai)}</td><td>${esc(r.khoanMuc)}</td><td>${esc(r.dvt)}</td>
        <td class="r num">${esc(String(r.sl))}</td><td class="r num">${esc(r.giaTri)}</td><td class="r num">${esc(r.duToan)}</td><td>${esc(r.goiThau)}</td>`) : ''}</div>`;
  }

  /* Phụ lục kèm theo Tờ trình (T29 B17, P-212): lựa chọn Có / Không lúc tạo luồng (vars.phuLuc), bước lập dự thảo sửa được (pl_<khoá>);
     tệp tải khi tạo hoặc ở bước dự thảo (ui[<khoá>]). Phụ lục Có chưa có tệp: bắt buộc tải ở bước lập dự thảo Tờ trình. */
  function phuLucInfo(ci) {
    if (ci.isKdt || ci.isHd || Flow.state.vars.adj) return '';
    /* Review nhi 06/11 #20: chưa tới bước lập dự thảo thì chưa xác định biểu mẫu, chưa có danh sách phụ lục. */
    if (Flow.taskStatus(window.EVars.h.draftTask()) === 'todo') return '';
    const u = Flow.ui, pv = Flow.state.vars.phuLuc || {}, done = Flow.taskStatus(window.EVars.h.draftTask()) === 'done';
    const rows = D.phuLuc.map(([key, name]) => ({ key, name, on: (u['pl_' + key] || pv[key] || 'Không') === 'Có', file: u[key] }));
    return `<div data-phu-luc><h4 class="ginfo-sub">Phụ lục kèm theo Tờ trình</h4>${docTable([['Phụ lục', 300], ['Có / Không', 110, 'c'], ['Tệp phụ lục', 300]], rows, (r) =>
      `<td>${esc(r.name)}</td><td class="c">${r.on ? 'Có' : 'Không'}</td><td>${r.file ? `<button type="button" class="link-btn" data-dl="${esc(typeof r.file === 'string' ? r.file : r.name + '.pdf')}">${esc(typeof r.file === 'string' ? r.file : r.name + '.pdf')}</button>`
        : r.on ? `<span class="doc-req">${done ? 'Chưa có tệp' : 'Chưa có tệp — tải ở bước lập dự thảo Tờ trình'}</span>` : '-'}</td>`)}</div>`;
  }

  /* Nhân sự thực hiện (D-75, chỉ xem — như card cùng tên ở Thêm mới luồng mua sắm): mỗi Vai trò thực hiện của quy trình → người được chỉ định
     (bước chưa xong; hết bước thì người của các bước đã làm), chưa chỉ định thì "theo vai trò" như quy trình. Sửa bằng nút Cập nhật nhân sự. */
  function membersInfo(ci) {
    const x = Flow.findDxms(ci.dxms);
    if (ci.isKdt || ci.isHd || !x || !x.luong || !window.Luong) return '';
    const done = (k) => Flow.taskStatus(k) === 'done';
    const rows = window.Luong.rolesOf(Flow.state.vars.process).map((r) => {
      const ks = r.tasks.filter((k) => !done(k)), ms = (ks.length ? ks : r.tasks).map((k) => Flow.membersOf(k));
      const ids = [...new Set(ms.flatMap((m) => m.list))];
      return { role: r.name, who: ids.map((id) => persona(id).name).join(', '), set: ms.some((m) => m.set) };
    });
    return `<div data-members-info><h4 class="ginfo-sub">Nhân sự thực hiện</h4>${docTable([['Vai trò thực hiện', 300], ['Người thực hiện', 400]], rows, (r) =>
      `<td>${esc(r.role)}</td><td>${esc(r.who || '-')}${r.set ? '' : ' <span class="faint">(theo vai trò)</span>'}</td>`)}</div>`;
  }

  /* Danh sách tài liệu: tệp đưa lên hồ sơ (căn cứ, báo giá, kết quả tồn kho, tệp ký nháy, tệp người dùng tải lên). */
  function caseFiles() {
    if (Flow.state.parent) return window.EForms.hd.files();
    const u = Flow.ui, at = (k) => { const h = Flow.lastOf(k); return h ? Flow.dateOf(h.t) : null; };
    const code = Flow.ci().code.replace('Đ', 'D');
    const docs = D.basisDocsFor(Flow.state.vars.process);
    const basis = (!Flow.state.kdt && window.EVars && window.EVars.h.basisSel().doc) || docs.find((d) => d.id === (u.basisDoc || D.caseRef.basisDoc)) || docs[0];
    const rows = [];
    if (at(1)) rows.push({ name: basis.no.replace(/\//g, '-') + '.pdf', at: at(1), by: 1, kind: 'Văn bản căn cứ' });
    if (at(5)) rows.push({ name: D.caseRef.ebom, at: at(5), by: 5, kind: 'eBOM / dự toán bóc tách' });
    if (at(7)) rows.push({ name: D.caseRef.rstk + '.xlsx', at: at(7), by: 7, kind: 'Kết quả rà soát tồn kho' });
    /* T29 B5 (C1, C2 — P-186, P-187): phiếu yêu cầu rà soát (gửi ở bước 6) và biên bản rà soát theo BM-RSTK (sinh khi Kho lưu kết quả). */
    if (!Flow.state.kdt && window.RaSoatKho) {
      if (at(5)) rows.push({ name: `Phieu-yeu-cau-ra-soat_${window.RaSoatKho.pycNo().replace('/', '-')}.pdf`, at: at(5), by: 6, kind: 'Phiếu yêu cầu rà soát' });
      if (window.RaSoatKho.done()) rows.push({ name: window.RaSoatKho.bbFile(), at: Flow.dateOf(window.RaSoatKho.data().kq.t), by: 7, kind: 'Biên bản rà soát (BM-RSTK)' });
    }
    const qName = (c) => `Bao-gia-${(D.nccOf(c).short || c).replace(/^NCC /, '')}.pdf`;
    if (Flow.state.kdt) {
      if (Flow.lastOf(10) && Flow.state.history.some((h) => h.task === 10 && (h.action === 'Báo giá đạt' || h.action.startsWith('Chốt tổng mức vốn')))) D.quotes.forEach((q) => rows.push({ name: qName(q.ncc), at: at(10) }));
    } else D.quotes.forEach((q) => { if (u['quote_' + q.ncc]) rows.push({ name: qName(q.ncc), at: at(10) || Flow.dateOf(Flow.state.clock), by: 10, kind: 'Báo giá nhà cung cấp' }); });
    const clock = Flow.dateOf(Flow.state.clock);
    if (u.bm03File) rows.push({ name: `BM-03_${code}_ky-nhay.pdf`, at: at(16) || clock, by: 16, kind: 'Phiếu yêu cầu thẩm định (ký nháy)' });
    if (u.kMinutes) rows.push({ name: `Bien-ban-hop-${code}.pdf`, at: at(32) || clock, by: 32, kind: 'Biên bản họp' });
    if (u.minutesFile) rows.push({ name: `Bien-ban-hop-${code}.pdf`, at: at(32) || clock, by: 32, kind: 'Biên bản họp' });
    if (u.bm06File) rows.push({ name: 'BM-06_ky-nhay.pdf', at: at(51) || clock, by: 51, kind: 'Báo cáo giải trình (ký nháy)' });
    if (u.tdReviewFile) rows.push({ name: `Phieu-nhan-xet-Tap-doan_${code}.pdf`, at: clock, kind: 'Phiếu nhận xét Tập đoàn' });
    /* T29 F7: phụ lục của Tờ trình đã tải lên ở bước lập dự thảo. */
    if (!Flow.state.kdt) D.phuLuc.forEach(([key, name]) => { if (u[key]) rows.push({ name: typeof u[key] === 'string' ? u[key] : `${name}_${code}.pdf`, at: at(window.EVars.h.draftTask()) || clock, by: window.EVars.h.draftTask(), kind: 'Phụ lục Tờ trình' }); });
    /* Tệp căn cứ gắn ĐXMS (Thêm mới luồng mua sắm, card Căn cứ pháp lý) — như tab Căn cứ của Chi tiết luồng; tệp gắn Hồ sơ nằm trong uploads. */
    if (!Flow.state.kdt) ((Flow.findDxms(Flow.state.dxms) || {}).basis || []).forEach((f) => rows.push({ name: f.name, at: f.at, type: f.type, to: 'ĐXMS', kind: 'Căn cứ pháp lý' }));
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i, type: f.type, by: f.by, kind: 'Tài liệu tải lên', to: Flow.state.kdt ? null : 'Hồ sơ' }));
    return rows;
  }
  const docTypeName = (code) => (code ? ((window.Catalog.rows('loai-tai-lieu-can-cu').find((r) => r.code === code) || {}).name || code) : '-');
  /* Văn bản đầu ra: biểu mẫu hệ thống sinh ở các bước đã xong. */
  /* KĐT: văn bản đầu ra theo Flow.kdtDocs() — BM-01 (TGĐ VHT ký duyệt chủ trương, bước 48), BM-14 (TTMS ký báo cáo thẩm định, 57 / 61),
     BM-18 (TGĐ VHT ký Quyết định, 60), BM-00 + BM-18 (TGĐ VHT ký hồ sơ gộp, 62). */
  const KDOC_NAME = { 'BM-01': 'Tờ trình chủ trương KĐT (đã phê duyệt)', 'BM-14': 'Báo cáo kết quả thẩm định KĐT', 'BM-18': 'Quyết định phê duyệt KĐT',
    'BM-00': 'Hồ sơ chủ trương và KĐT (văn bản gộp, đã phê duyệt)', 'CV-TD': 'Công văn trình Tập đoàn (đã ký)', 'BM-06': 'Báo cáo giải trình, tiếp thu ý kiến Tập đoàn' };
  const outputDocs = () => (Flow.state.parent ? window.EForms.hd.outs() : Flow.state.kdt ? Flow.kdtDocs().map((d) => ({ code: d.code, name: `${d.code} ${KDOC_NAME[d.code]}${d.td ? ' — cấp Tập đoàn' : ''}`, at: d.at }))
    : DOCS.filter((d) => Flow.taskStatus(d.by) === 'done').map((d) => ({ code: d.code, by: d.by, name: `${d.code} ${Flow.state.vars.adj ? adjDocName(d) : d.name}`, at: Flow.dateOf((Flow.lastOf(d.by) || {}).t || 0) })));
  /* MS02: Tờ trình và Quyết định là bản điều chỉnh (BM-01 / BM-09 / BM-08 có mục Nội dung điều chỉnh). */
  const adjDocName = (d) => ({ 'BM-01': 'Tờ trình điều chỉnh ĐXMS', 'BM-09': 'Tờ trình điều chỉnh ĐXMS (thẩm định, phê duyệt trực tiếp)', 'BM-08': 'Quyết định phê duyệt điều chỉnh ĐXMS' }[d.code] || d.name);
  let lastOuts = [];
  /* T29 B17 (A6): nút Xuất file Word cho Tờ trình ĐXMS (BM-01 / BM-09) ở hộp xem trước văn bản, như nút cùng tên của màn Soạn thảo TTr cũ. */
  const wordBtn = (code) => (window.EVars && window.EVars.word(code) ? `<button class="vbtn primary" data-word="${esc(code)}">${icon('download')} Xuất file Word</button>` : '');
  const OUT_TONE = { 'AI đã gợi ý': 'info', 'Đang làm': 'warning', 'Hoàn thành': 'success' };

  /* Hộp thoại xem trước văn bản đầu ra (Văn bản đầu ra của SCR-20 và của màn xử lý task dùng chung).
     Thanh thông tin gọn một dòng (mã, tên hồ sơ, ngày tạo) thay lưới 3 ô; trang văn bản khổ A4 trên nền xám như trình xem PDF;
     nút Toàn màn hình (nhớ lựa chọn); văn bản chưa có mẫu xem trước thì báo rõ thay vì hộp thoại trống. */
  function docPreview(o) {
    const doc = o.doc;
    const meta = `<div class="dp-meta"><span class="dp-k">Mã hồ sơ</span><b>${esc(o.code || '')}</b><span class="dp-sep"></span>
      <span class="dp-k">Ngày tạo</span><b>${esc(o.at || '')}</b><span class="dp-sep"></span><span class="dp-k">Hồ sơ</span><span class="dp-name" title="${esc(o.caseTitle || '')}">${esc(o.caseTitle || '')}</span></div>`;
    const body = doc ? `<div class="pdf-view dp-view">${doc.html}</div>`
      : `<div class="dp-empty">${icon('file')}<div><b>Chưa có bản xem trước cho văn bản này.</b><div class="cap">Tải xuống để xem tệp gốc.</div></div></div>`;
    const m = UI.vModal({ title: o.title, size: doc ? (doc.html.includes('a4 land') ? 'docv wide' : 'docv') : 'md', body: `<div class="dp">${meta}${body}</div>`,
      /* Review nhi 06/11 #37: Tờ trình chỉ có Xuất file Word (đúng văn bản đang xem); văn bản khác giữ Tải xuống. */
      actions: `<button class="vbtn secondary" data-close>Đóng</button>${(o.docCode && wordBtn(o.docCode)) || `<button class="vbtn primary" data-close data-dl="${esc(o.dl)}">${icon('download')} Tải xuống</button>`}` });
    if (doc) UI.vMaximize(m, 'dtms.docPreviewMax', 'data-doc-max');
    return m;
  }
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
       T39 B1 (rule A4, D1): không còn nút khóa theo dữ liệu — lockWhen chỉ kiểm tra khi bấm (app.js act), chặn kèm thông báo. */
    const mc = Flow.mainChoice(tok.task);
    /* T24 Q1: chỉ nút có luật đang Kích hoạt (available-actions), nhãn theo Tên hiển thị của luật. */
    const list = choices.map((c, i) => {
      const a = window.MaTran.allowed(ci.flow, tok.task, c.label, Flow.state.persona);
      return { c: a.label === c.label ? c : Object.assign({}, c, { label: a.label }), idx: c.next ? -1 : i, main: !!c.next || (mc && mc.label === c.label), show: a.show };
    }).filter((x) => x.show);
    /* Review nhi 06/11 #38, #39: màn phê duyệt — một nút mở form, Đồng ý / Từ chối nằm trong form. */
    const dec = window.TaskForms.decideOf(tok);
    const main0 = list.filter((x) => x.main), main = dec ? main0.map((x) => Object.assign({}, x, { c: Object.assign({}, x.c, { label: dec.btn }) })) : main0, rest = dec ? [] : list.filter((x) => !x.main);
    const side = rest.slice(0, 1), other = rest.slice(1);
    const actBtn = (x, cls) => `<button type="button" class="vbtn ${cls}" data-act="${tok.id}" data-choice="${x.idx}">${esc(x.c.label)}</button>`;
    /* T39 B1 (D-99): hành động chung của my-task-detail (Thao tác khác) — Yêu cầu thay người xử lý (REQUEST_REPLACE_APPROVER), Bổ sung ý kiến (ADD_COMMENT). */
    const common = mine && !f.wip ? window.Vct.actions(tok) : [];
    /* f.wip: màn của task chưa dựng (KĐT B3/B4) — chưa có nút hành động. */
    const acts = `${window.ThamDinh.ghiLaiBtn(tok, mine && !f.wip)}${mine && !f.wip ? main.map((x) => actBtn(x, 'primary')).join('') + side.map((x) => actBtn(x, 'red')).join('') : ''}
      ${ci.isKdt || ci.isHd ? '' : window.Luong.taskBtn(tok, mine)}<button type="button" class="vbtn red" data-go="task/${tok.id}/bpmn">Xem BPMN</button>
      ${mine && !f.wip && (other.length || common.length) ? `<div class="more"><button type="button" class="vbtn secondary" data-more>Thao tác khác ${icon('chev')}</button>
        ${moreOpen ? `<div class="more-pop">${other.map((x) => actBtn(x, 'ghost')).join('')}${common.join('')}</div>` : ''}</div>` : ''}`;

    const due = Flow.dateOf(tok.since + Math.max(1, Math.ceil((f.nlv || 0.5) * 2)));
    const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    const round = Flow.state.vars.round;
    /* Hồ sơ KĐT: Mã KĐT thay Mã ĐXMS; Quy trình = Nhóm KĐT (chưa xác định trước cổng phân luồng), Nhánh hồ sơ; tổng mức vốn thực tế có sau khi chốt ở bước 10. */
    const priced = ci.isKdt && Flow.state.history.some((h) => String(h.task) === '10' && h.who);
    /* T29 B12 (review Huylx4 #4, RV-PROTO-0511 #6): ĐXMS chưa chốt báo giá (bước 10) thì chưa có Tổng giá trị — để trống, hiện Giá trị dự kiến của luồng. */
    const quotedD = !ci.isKdt && !ci.isHd && Flow.state.history.some((h) => String(h.task) === '10' && h.who);
    const xD = Flow.findDxms(ci.dxms) || {}, estD = xD.est, nvD = D.nvOf(xD.nv);
    /* Trường nhập ở Thêm mới luồng mua sắm (SCR-96) hiện lại ở đây: Đề tài / dự án, Đợt, Người tạo, Căn cứ đã được phê duyệt, Lý do ưu tiên,
       Hình thức trình ký, Nội dung căn cứ pháp lý. Nguồn vốn theo đề tài / dự án (khi có), không lấy dữ liệu mẫu. Loại biểu mẫu, Cấp phê duyệt
       theo luồng con hiện tại (dự kiến lúc tạo, hệ thống đặt lại sau bước 10 / 48); chưa có giá trị thì để trống như SCR-96. */
    const kitD = window.Thau && window.Thau.kit;
    const fundD = nvD && nvD.fund ? (kitD ? kitD.cat('nguon-von', nvD.fund) : nvD.fund) : ci.fund;
    const lvD = (!quotedD && estD == null) || !/^MS01\.0/.test(ci.flow || '') ? { form: null, level: null }
      : /^MS01\.03/.test(ci.flow || '') ? { form: 'ĐXMS có giá trị dưới nhóm B', level: 'Tổng công ty' }
        : { form: 'ĐXMS có giá trị nhóm B trở lên', level: /^MS01\.01/.test(ci.flow || '') ? 'Tập đoàn' : 'Tổng công ty' };
    const info = ci.isHd ? `${kv('Mã hồ sơ', esc(ci.code))}${kv('Tên hồ sơ', esc(ci.name))}${kv('Mã hợp đồng', hdRef(ci.hd))}${kv('Loại hồ sơ', esc(D.hdProcesses[ci.flow].type))}
      ${kv('Quy trình', `${esc(ci.flow)} — ${esc(D.hdProcesses[ci.flow].name)}`)}${kv('Công việc', esc(t.name))}${kv('Hạn xử lý', due)}${kv('Đơn vị quản lý', esc(ci.unit))}
      ${kv('Đầu mối theo dõi', esc(ci.owner))}${kv('Nhà thầu', esc(hdNccName(ci.ncc)))}${kv('Giá trị hợp đồng (gồm thuế GTGT)', ty(ci.total) + ' tỷ đồng')}`
      : ci.isKdt ? `${kv('Mã hồ sơ', esc(ci.code))}${kv('Tên hồ sơ', esc(ci.name))}${kv('Mã KĐT', kdtRef(ci.kdt))}${kv('Loại hồ sơ', 'Phê duyệt KĐT')}
      ${kv('Quy trình', esc(ci.group ? D.kdtGroups[ci.group] : 'Chưa xác định nhóm (MS13 · MS14 · MS15)'))}${kv('Công việc', esc(t.name + (tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : '') + (ci.isKdt && kdtRoundOf(tok.task) ? ` · ${kdtRoundOf(tok.task)}` : '')))}
      ${kv('Hạn xử lý', due)}${kv('Đơn vị đề xuất', esc(ci.unit))}${kv('Người phụ trách', esc(persona('minh').name))}
      ${kdtFactors(ci)}
      ${priced ? kv('Tổng mức vốn thực tế (gồm VAT)', ty(ci.total) + ' tỷ đồng') : kv('Tổng mức vốn dự kiến', ci.est != null ? ty(ci.est) + ' tỷ đồng' : null)}${kv('Nguồn vốn', esc(ci.fund))}${kv('Thời gian thực hiện', esc(ci.period))}
      ${kv('Nhánh hồ sơ', ci.branch ? esc(D.kdtBranches[ci.branch]) : null)}${kv('Mật', ci.secret ? 'Có' : 'Không')}`
      : `${kv('Mã ĐXMS', dxmsRef(ci.dxms))}${kv('Tên đề xuất mua sắm', esc(ci.name))}${kv('Loại', esc(kindLabel(ci.kind || 'PD')))}
      ${kv('Đề tài / dự án', nvD ? `<a class="link" data-go="${window.DeTai.href(xD.nv)}">${esc(`${xD.nv} — ${nvD.name}`)}</a>` : null)}${kv('Đợt mua sắm', dotOf(xD) ? String(dotOf(xD)) : null)}
      ${kv('Quy trình', esc(procLabel(ci.flow, ci.flowLabel)))}${kv('Công việc', esc(t.name + (tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : '')))}
      ${kv('Hạn xử lý', due)}${kv('Đơn vị đề xuất', esc(ci.unit))}${kv('Người phụ trách', esc(persona('minh').name))}${kv('Người tạo', esc(xD.creator))}
      ${quotedD ? kv('Tổng giá trị (gồm VAT)', ty(ci.total) + ' tỷ đồng') : `${kv('Tổng giá trị (gồm VAT)', null)}${kv('Giá trị dự kiến', estD != null ? (xD.luong ? Math.round(estD * 1e9).toLocaleString('vi-VN') + ' đồng' : ty(estD) + ' tỷ đồng') : null)}`}${kv('Nguồn vốn', esc(fundD))}${kv('Thời gian thực hiện', esc(ci.period))}
      ${kv('Căn cứ đã được phê duyệt', xD.basisTD == null ? null : xD.basisTD ? 'Đã phê duyệt' : 'Chưa phê duyệt')}${kv('Loại biểu mẫu', lvD.form)}${kv('Cấp phê duyệt', lvD.level)}
      ${kv('Mức ưu tiên', esc(ci.priority))}${xD.priReason ? kv('Lý do ưu tiên', esc(xD.priReason)) : ''}
      ${kv('Mật', ci.secret ? 'Có' : 'Không')}${kv('Hình thức trình ký', esc(xD.sign || (ci.secret ? 'Bản cứng' : 'VOffice')))}${round ? kv('Vòng giải trình', `${round}/2`) : ''}
      ${Flow.state.replaces ? kv('Thay thế cho', esc(Flow.state.replaces)) : ''}
      ${xD.legal ? `<div class="full"><div class="k">Nội dung căn cứ pháp lý</div><div class="v" style="white-space:pre-line">${esc(xD.legal)}</div></div>` : ''}`;

    /* E3: tài liệu bắt buộc của hành động chưa có → dòng "chưa tải lên" kèm nút tải lên; Văn bản đầu ra = dự thảo của bước + văn bản đã sinh. */
    const need = mine ? window.EVars.reqDocs(tok).filter((x) => !x.have).map((x) => ({ name: x.name, at: '-', req: x.key, opt: x.opt, only: x.only })) : [];
    const files = need.concat(caseFiles()), dxDocs = !ci.isKdt && !ci.isHd;
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
          '"Xem BPMN" mở màn Chi tiết hồ sơ + sơ đồ BPMN, tô bước của việc này (my-task-bpmn-detail).',
          '<b>T39 B1 (D-99) — nút theo luật, fail-closed:</b> chỉ nút có luật đang Kích hoạt khớp bước + nhánh mới hiện; bước đã có nhánh đối soát mà nút không khớp luật nào thì không hiện. GIẢ LẬP: bước chưa có nhánh đối soát và quy trình ngoài MS01 vẫn giữ nút (dữ liệu mẫu chưa seed luật). Luật không gán vai trò thì mọi người nhận việc thấy nút, như code KHCN (isActionAllowed).',
          '<b>Không có nút khóa theo dữ liệu</b> (rule A4, D1): nút luôn hiện, điều kiện dữ liệu kiểm tra khi bấm — chưa đủ thì báo và giữ nguyên việc.',
          '<b>Thao tác khác</b> có hai hành động chung (code KHCN): <b>Yêu cầu thay người xử lý</b> (REQUEST_REPLACE_APPROVER — chọn người mới, lý do bắt buộc, việc chuyển cho người mới) và <b>Bổ sung ý kiến</b> (ADD_COMMENT — không đóng việc, hiện ở Lịch sử xử lý). GIẢ LẬP: coi là luật chung cho mọi bước; giao lại chính việc đang mở thay cho việc BPMN tạo việc mới. Không có Nhận việc (code KHCN không có claim).',
          '<b>Việc giao nhiều người:</b> ai bấm hành động trước thì việc hoàn thành; người bấm sau nhận thông báo "Công việc này đã được hoàn thành hoặc chuyển bước. Vui lòng tải lại trang." (409 của MyTaskService).'],
        ci.isKdt || ci.isHd ? [] : ['<b>Thông tin chung</b> mang các trường nhập ở Thêm mới luồng mua sắm (SCR-96): Đề tài / dự án, Đợt, Người tạo, Căn cứ đã được phê duyệt, Lý do ưu tiên, Hình thức trình ký, Nội dung căn cứ pháp lý; Nguồn vốn theo đề tài / dự án.',
          '<b>T37 (RV-PROTO-0911 #4): bỏ khối Văn bản căn cứ và giá trị còn khả dụng</b> khỏi màn — ghi chú dưới là thiết kế cũ. ' + '<b>Văn bản căn cứ và giá trị còn khả dụng</b> (chỉ bước 1): văn bản căn cứ chính mặc định theo Đề tài / dự án chọn khi tạo luồng (+ văn bản bổ sung) — Giá trị, Đã dùng ở ĐXMS khác, ĐXMS này đang giữ, Còn có thể sử dụng (BR-DXMS-02-04); bên dưới là dòng dự toán đã bóc tách khi tạo luồng. Số liệu văn bản GIẢ LẬP P-193.',
          '<b>Phụ lục kèm theo Tờ trình</b>: lựa chọn Có / Không và tệp khi tạo luồng; sửa ở bước lập dự thảo Tờ trình, phụ lục Có bắt buộc có tệp mới gửi được (P-212).',
          '<b>Nhân sự thực hiện</b> (chỉ xem): Vai trò thực hiện → người được chỉ định khi tạo luồng hoặc sau Cập nhật nhân sự; chưa chỉ định thì giao theo vai trò như quy trình (D-75).',
          '<b>Danh sách tài liệu</b> gồm tệp căn cứ gắn ĐXMS, tệp các bước, tệp tải lên — cột <b>Loại tài liệu</b> (loại căn cứ, hoặc loại theo bước sinh tệp) và <b>Bước</b> (bước tải lên / sinh tệp; tệp căn cứ = Lập đề xuất mua sắm), thay cột Gắn với Hồ sơ (D-92, D-95). <b>Văn bản đầu ra</b> gộp văn bản của bước, trạng thái ký và văn bản phê duyệt (D-95).'], ba.notes, window.ThamDinh.applies(tok) ? window.ThamDinh.notes(tok) : [], window.BaoGia && window.BaoGia.applies(tok) ? window.BaoGia.notes() : [],
        ci.isHd ? HD_NOTES().concat([esc(t.note), `Trang ${esc(ci.flow)}.`]) : ci.isKdt ? [esc(t.note), `Trang MS13, lane: ${esc(t.lane || '')}.`].concat(f.wip ? ['Nội dung xử lý của bước này dựng ở bước sau của plan KĐT — chưa có nút hành động.'] : [])
          : [esc(t.note), t.old ? `Số task ở bản 58 task cũ: ${esc(t.old)}` : /[ab]$/.test(String(tok.task)) ? 'Task mới — nhánh không khớp quy trình (N08, chốt 2026-09-28).' : 'Task mới ở v1.1.']),
      src: 'my-tasks/my-task-detail · /my-tasks/:taskId?profileId=',
    };
    /* Danh sách tài liệu (tải lên theo hành động) và Văn bản đầu ra của việc — dùng ở cả hai bố cục. */
    const filesSec = `<section class="vcard pad24"><div class="vcard-h"><h3>Danh sách tài liệu</h3>${mine ? `<div class="row">
            ${hasTpl(tok) ? `<button type="button" class="vbtn secondary" data-tpl="${esc(tok.id)}" title="Tải mẫu biểu mẫu (.docx) dùng ở bước này để soạn rồi tải lên — mẫu cấu hình ở Ma trận hành động › Biểu mẫu sử dụng">${icon('file')} Chọn mẫu tài liệu</button>` : ''}
            <button type="button" class="vbtn red" data-upload>${icon('upload')} Tải file lên</button><input type="file" id="up-file" hidden></div>` : ''}</div>
          ${docTable([['Thao tác', 100, 'c'], ['Tên tài liệu', 260]].concat(dxDocs ? DX_FILE_COLS : [], [['Ngày tạo', 130]]), files, (r) => (r.req
    ? `<td class="c"><div class="acts">${iconBtn('upload', 'Tải lên', `data-req-up="${esc(r.req)}"`)}</div></td><td><span class="clamp doc-req ${r.opt ? 'opt' : ''}">${esc(r.name)} — ${r.opt ? 'nếu có, chưa tải lên' : 'bắt buộc, chưa tải lên'}</span></td>${dxDocs ? `<td>-</td><td><span class="clamp">${esc(fileStep({ by: tok.task }))}</span></td>` : ''}<td>-</td>`
    : `<td class="c"><div class="acts">${iconBtn('download', 'Tải tài liệu', `data-dl="${esc(r.name)}"`)}${mine && r.up != null ? `<span class="sep"></span>${iconBtn('del', 'Xóa tài liệu', `data-del-up="${r.up}"`)}` : ''}</div></td>
            <td><span class="clamp">${esc(r.name)}</span></td>${dxDocs ? dxFileCells(r) : ''}<td>${esc(r.at)}</td>`))}</section>`;
    const outsSec = `<section class="vcard pad24"><h3>Văn bản đầu ra</h3>
          ${docTable([['Thao tác', 112, 'c'], ['Tên tài liệu', 260], ['Trạng thái', 130, 'c'], ['Ngày tạo', 130]], outs, (r, i) => `<td class="c"><div class="acts">${iconBtn('download', 'Tải văn bản đầu ra', `data-dl="${esc(r.name)}"`)}<span class="sep"></span>${dlPdf(r.name)}</div></td>
            <td><button type="button" class="link-btn" data-preview="${i}">${esc(r.name)}</button></td><td class="c">${badge(r.st, OUT_TONE[r.st])}</td><td>${esc(r.at)}</td>`)}</section>`;
    /* T34 v0.2 (D-92, D-94): việc ĐXMS theo my-task-detail mới — tiêu đề Xử lý / Xem chi tiết + Xem BPMN; thanh trạng thái "Đang chờ bạn xử lý"
       mang các nút hành động (my-task-status-bar); thân = Chi tiết đề xuất mua sắm (7 tab), phần riêng của việc nằm trong tab Thông tin chung / Tiến trình / Tài liệu & văn bản. */
    if (!ci.isKdt && !ci.isHd) {
      const all = processSteps();
      const step = `Bước ${tok.task} · ${t.name}${tok.cqcm ? ' — ' + cqcmUnit(tok.cqcm) : ''}`;
      const late = tok.since + Math.max(1, Math.ceil((f.nlv || 0.5) * 2)) < Flow.state.clock;
      const barActs = acts.replace(`<button type="button" class="vbtn red" data-go="task/${tok.id}/bpmn">Xem BPMN</button>`, '');
      window.Luong.useTab('task/' + tok.id, 'info');
      infoSpec.notes = ['<b>T34 v0.2 (D-92, D-94) — khuôn my-task-detail (QĐ05):</b> tiêu đề <b>Xử lý đề xuất mua sắm</b> (việc của bạn) / <b>Xem chi tiết đề xuất mua sắm</b>, nút Xem BPMN trên hàng tiêu đề; <b>thanh trạng thái</b> "Đang chờ bạn xử lý · Bước <số task BPMN> · Tên bước · Hạn xử lý" (số bước trùng số task BPMN, dãy Quy trình cũng đánh số theo BPMN) (đỏ khi quá hạn) chứa các nút hành động và Thao tác khác (my-task-status-bar). Thân màn = Chi tiết đề xuất mua sắm (SCR-97): tab Thông tin chung có Thông tin chung của việc và khối của bước (thẩm định, báo giá, rà soát kho); Tiến trình có Quy trình + Lịch sử xử lý; Tài liệu & văn bản có Danh sách tài liệu (tải lên) và Văn bản đầu ra của việc.'].concat(infoSpec.notes);
      return `<div class="pg" data-task-dxms="${esc(tok.id)}">
      ${head({ title: mine ? 'Xử lý đề xuất mua sắm' : 'Xem chi tiết đề xuất mua sắm', back: true, lg: true, info: infoSpec, right: `<button type="button" class="vbtn secondary" data-go="task/${tok.id}/bpmn">Xem BPMN</button>` })}
      ${statusBar({ mode: 'process', who: mine ? '' : owner.name, step, date: due, overdue: late, acts: barActs })}
      ${window.Luong.body(ci.dxms, { task: {
        info: `<section class="vcard pad24"><h3>Thông tin chung</h3><div class="ginfo">${info}</div>${phuLucInfo(ci)}${membersInfo(ci)}</section>
          ${window.ThamDinh.card(tok)}${window.BaoGia ? window.BaoGia.card(tok) : ''}${window.RaSoatKho ? window.RaSoatKho.taskCard(tok) : ''}`,
        steps: `<section class="vcard pad24"><h3>Quy trình</h3>${UI.vSteps({ id: ci.code, steps: all })}</section>`,
        history: historyCard(undefined, 'drail', 'Lịch sử xử lý'), files: filesSec, outList: outs,
      } })}</div>`;
    }
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết hồ sơ', back: true, lg: true, info: infoSpec, right: `<div class="task-acts">${acts}</div>` })}
      <div class="tgrid"><div class="tmain">
        <section class="vcard pad24"><h3>Thông tin chung</h3><div class="ginfo">${info}</div>${phuLucInfo(ci)}${membersInfo(ci)}</section>
        ${window.ThamDinh.card(tok)}
        ${window.BaoGia ? window.BaoGia.card(tok) : ''}
        ${window.RaSoatKho ? window.RaSoatKho.taskCard(tok) : ''}
        <section class="vcard pad24"><h3>Quy trình</h3>${UI.vSteps({ id: ci.code, steps: processSteps() })}</section>
        ${filesSec}${outsSec}
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
    /* Review nhi 06/11 #37: Xuất file Word đúng văn bản đang xem trước (BM-10.2.1) — tải tệp .doc thật. */
    const wb = t.closest('[data-word]');
    if (wb) {
      const shown = wb.closest('.vmodal') && wb.closest('.vmodal').querySelector('.dp-view');
      const w = window.EVars.word(wb.dataset.word, shown ? shown.innerHTML : '');
      if (!w) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + w.html], { type: 'application/msword' }));
      a.download = w.name; document.body.appendChild(a); a.click(); a.remove();
      UI.toast(`<b>Thành công</b><br>Đã xuất file Word ${esc(w.name)}.`);
      return;
    }
    const dl = t.closest('[data-dl]');
    if (dl) { e.preventDefault(); UI.toast(`<b>Thành công</b><br>Đã tải xuống ${esc(dl.dataset.dl)}.`); return; }
    const pd = t.closest('[data-preview-doc]');
    if (pd) {
      const [name, at, code] = pd.dataset.previewDoc.split('|');
      const c = allCases().find((x) => x.code === code) || { title: Flow.state.parent ? Flow.ci().name : '' };
      /* Hồ sơ đang chạy luồng: xem trước văn bản (mẫu Word + dữ liệu eForm) như ở màn xử lý task. */
      const doc = (c.live && !Flow.state.kdt) || Flow.state.parent ? window.EVars.doc(name.split(' ')[0]) : null;
      docPreview({ title: name, code, at, caseTitle: c.title, doc, docCode: name.split(' ')[0], dl: name });
      return;
    }
    const pv = t.closest('[data-preview]');
    if (pv) {
      /* Xem trước PDF: mẫu Word của biểu mẫu + dữ liệu eForm (ProfileTaskFormService — preview / download). */
      const d = lastOuts[Number(pv.dataset.preview)], doc = d && d.code ? window.EVars.doc(d.code) : null;
      docPreview({ title: d.name, code: Flow.ci().code, at: d.at, caseTitle: Flow.ci().name, doc, docCode: d && d.code, dl: d.name });
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
    const tid = (location.hash.match(/^#\/task\/([^/]+)/) || [])[1], tk = tid && Flow.state.tokens.find((x) => x.id === tid);
    Flow.setUi('uploads', (Flow.ui.uploads || []).concat([{ name: f.name, at: Flow.dateOf(Flow.state.clock), by: tk ? tk.task : undefined }]));
    UI.toast('<b>Thành công</b><br>Đã tải tài liệu lên hồ sơ.');
  });

  /* Danh sách tài liệu mẫu (my-task-template-dialog): đếm tệp, tìm kiếm 260px, bảng có ô chọn, Đóng / Tải xuống (n). */
  /* Comment #24: chỉ mẫu thuộc quy trình đang chạy (MS01.03 dùng BM-09 + Checklist 02, không có BM-01/05…08); mặc định lọc mẫu của bước này.
     Nguồn: Ma trận hành động "Biểu mẫu sử dụng" theo task + quy trình (SCR-44). */
  /* T29 B18: mẫu đầu vào của bước 8 (không phải văn bản đầu ra) — BM-YCKT (link "download template" màn YCBG cũ), BM-YCBG công văn + Mẫu báo giá. */
  const TPL_IN = [{ code: 'BM-YCKT', name: 'Mẫu yêu cầu kỹ thuật để báo giá', by: 8 }, { code: 'BM-YCBG', name: 'Công văn yêu cầu báo giá và Mẫu báo giá', by: 8 }];
  const SMALL_ONLY = ['BM-09', 'CL02'], BIG_ONLY = ['BM-01', 'CL01', 'BM-05', 'BM-06', 'BM-07', 'BM-08'];
  function tplRows(tok) {
    const small = Flow.isSmall(), mineCodes = tok && window.TaskForms ? window.TaskForms.outputs(tok).map((d) => d.code) : [];
    const seen = new Set();
    return (Flow.state.parent ? window.EForms.hd.docs : DOCS.concat(TPL_IN)).filter((d) => !(small ? BIG_ONLY : SMALL_ONLY).includes(d.code) && !seen.has(d.code) && seen.add(d.code)).map((d) => ({
      file: `${d.code}_${d.name}.docx`, step: (TT()[d.by] || {}).name || '', here: (tok && d.by === tok.task) || mineCodes.includes(d.code) }));
  }
  /* T29 B15 (review Huylx4 #5): nút chỉ hiện ở bước có biểu mẫu của bước (Ma trận hành động › Biểu mẫu sử dụng, S2). */
  const hasTpl = (tok) => tplRows(tok).some((x) => x.here);
  function templateDialog(tokId) {
    const tok = tokId && Flow.token(tokId);
    const TPL = tplRows(tok);
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

  /* T34 (D-90): bỏ dxmsList, dxmsForm, dxmsDetail, profileList, profileCreate, resetCreate (phương án Tách). */
  window.Screens = { dxmsParts, dxmsBpmn, doneStep, statusBar, docPreview, basisAvail, chonVai, viecCuaToi, adjList, chainCard, kindBlock, enter, sampleDetail, caseDetail, kdtCaseDetail, hdCaseDetail, taskScreen, taskBpmn,
    phanHe, tongQuan, choChot, allCases, caseHref, dueOf, head, dxmsMeta, DXMS_STATUS, processSteps,
    /* T29 B12 (D-78, SCR-107): văn bản đầu ra của một hồ sơ ĐXMS (đang chạy hoặc mẫu). */
    caseDocs: (c) => (c.live ? outputDocs() : sampleVm(c).outs),
    s5: { dotOf, nextDot, creators, unitsOf, nvText, viewersText, viewersDialog, secCheckCard } };
})();
