/* Quản trị quy trình (D-2): Quy trình BPMN, Ma trận hành động, Giám sát tiến trình.
   Tài liệu chuẩn bị docs/dtms/prototype-PH02-quy-trinh-chuan-bi.md. B1 SCR-48; B2 SCR-41, 42; SCR-43…47 ở B3–B4. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, infoBtn, vSelect, pager, norm, badge, toast, vTreeTable, vAccordion } = window.UI;
  const rerender = () => window.App.render();

  /* P-41: vai thấy Giám sát tiến trình (Quản trị hệ thống thấy cả ba mục của menu); Quy trình BPMN chỉ Quản trị hệ thống. */
  const MONITOR_ROLES = ['qt', 'lan'];
  const WORKFLOW_ROLES = ['qt'];
  const noAccess = (title) => `<div class="pg">${title}<div class="vcard pad24"><p class="ov-empty">Bạn chưa được cấp quyền truy cập chức năng này</p></div></div>`;

  /* ---------- Dữ liệu quy trình (§3.1) ----------
     Mỗi quy trình (processDefinitionId) có các phiên bản deploy (processDefinitionKey). page = trang ĐTMS.drawio vẽ sơ đồ.
     P-37: MS01.01/.02/.03 là một định nghĩa DTMS_MS01. */
  const WF_STATUS = { ACTIVE: ['Hoạt động', 'success'], DELETED: ['Dừng hoạt động', 'warning'] }; // WORKFLOW_STATUS_LABEL_MAP / VARIANT_MAP
  const WORKFLOWS = [
    { code: 'MS01', id: 'DTMS_MS01', name: 'Đề xuất mua sắm', versions: [
      { key: '2251799813690112', version: 2, modeler: 'v1.1', deploy: 2, status: 'ACTIVE', page: 'MS01 v1.1', live: 2 },
      { key: '2251799813685377', version: 1, modeler: 'v1.0', deploy: 1, status: 'DELETED', page: 'MS01', live: 1 }],
      history: [
        { version: 'v1.1', at: '2026-06-30T10:15', current: true, desc: 'Gộp MS01.01 và MS01.03 bằng cổng Giá trị; thêm cổng kiểm tra giá trị khớp quy trình đã chọn, bước xử lý không khớp (Sửa lại / Chuyển quy trình). 61 bước.' },
        { version: 'v1.0', at: '2026-03-02T09:40', desc: 'Bản đầu theo quy trình TO-BE MS01.01, 58 bước.' }] },
    { code: 'MS02', id: 'DTMS_MS02', name: 'Điều chỉnh đề xuất mua sắm', versions: [
      { key: '2251799813690540', version: 1, modeler: 'v1.1', deploy: 1, status: 'ACTIVE', page: 'MS02 ver1.1' }],
      history: [{ version: 'v1.1', at: '2026-07-15T14:05', current: true, desc: 'Điều chỉnh ĐXMS theo cùng khung MS01 v1.1.' }] },
    { code: 'MS13', id: 'DTMS_MS13', name: 'Chủ trương khoản đầu tư', versions: [
      { key: '2251799813691208', version: 1, modeler: 'v1.0', deploy: 1, status: 'ACTIVE', page: 'MS13-TO BE' }],
      history: [{ version: 'v1.0', at: '2026-08-04T08:30', current: true, desc: 'Quy trình TO-BE lập, thẩm định, phê duyệt chủ trương khoản đầu tư.' }] },
    { code: 'MS14', id: 'DTMS_MS14', name: 'Dự án đầu tư', versions: [
      { key: '2251799813691536', version: 1, modeler: 'v1.0', deploy: 1, status: 'ACTIVE', page: 'MS14-TO BE' }],
      history: [{ version: 'v1.0', at: '2026-08-04T08:45', current: true, desc: 'Quy trình TO-BE lập, thẩm định, phê duyệt dự án đầu tư.' }] },
  ];
  /* SL hồ sơ đang xử lý: đếm từ Giám sát tiến trình (hồ sơ Đang chạy / Quá hạn theo phiên bản); quy trình chưa dựng = 0. */
  function processingCount(v) {
    if (!v.live) return 0;
    return monitorRows().filter((r) => r.version === v.live && (r.status === 'Đang chạy' || r.status === 'Quá hạn')).length;
  }
  const findVersion = (key) => {
    for (const w of WORKFLOWS) for (const v of w.versions) if (v.key === key) return { w, v };
    return null;
  };

  /* ---------- SCR-41 Danh sách quy trình ---------- */
  const L = { kw: '', st: null, page: 1, size: 10, psOpen: false, open: new Set(), syncing: false };

  function listRows() {
    const kw = norm(L.kw);
    return WORKFLOWS.filter((w) => (!kw || norm(`${w.code} ${w.id} ${w.name}`).includes(kw)) && (!L.st || w.versions.some((v) => v.status === L.st)))
      .map((w) => {
        const vers = w.versions.filter((v) => !L.st || v.status === L.st);
        const latest = w.versions.reduce((a, b) => (b.version > a.version ? b : a));
        return { key: w.id, w, version: latest.version, count: w.versions.reduce((s, v) => s + processingCount(v), 0), hasChildren: vers.length > 0,
          children: vers.map((v) => ({ key: v.key, w, v, isVersion: true, version: v.version, count: processingCount(v) })) };
      });
  }

  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/workflow-management/workflow-management.component.html
    //       + workflow-management.facade.ts, shared/constants/workflow.constants.ts; @khcn-core/ui vht-tree-table
    const info = {
      scr: 'SCR-41', name: 'Danh sách quy trình', uc: 'UC-02-01 · UR-WF-01',
      notes: [
        'Không có Thêm mới: quy trình vào hệ thống qua "Đồng bộ từ Camunda" (deploy từ Web Modeler). Nút đồng bộ chỉ hiện khi có quyền QT03; prototype chỉ báo thành công, không đổi dữ liệu.',
        'Bảng cây như source: dòng cha = quy trình (Mã quy trình "-", không có badge), bấm ▾ mở dòng con = từng phiên bản deploy; Mã quy trình ở dòng con là liên kết mở Chi tiết quy trình. Tìm kiếm / lọc Trạng thái thu gọn lại mọi dòng.',
        'SL hồ sơ đang xử lý của MS01 đếm từ hồ sơ đang chạy (cùng số với Giám sát tiến trình: Đang chạy + Quá hạn); hồ sơ tạo trước 01/07/2026 chạy phiên bản 1 (đã dừng hoạt động nhưng vẫn xử lý nốt). Các quy trình khác chưa có hồ sơ.',
        'Dữ liệu: 4 quy trình theo các trang của ĐTMS.drawio — MS01 v1.1 (phiên bản 2) và MS01 (phiên bản 1), MS02 ver1.1, MS13-TO BE, MS14-TO BE. Mã Camunda = BPMN process id.',
        'Quyền (P-41): chỉ Quản trị hệ thống; vai khác thấy thông báo chưa được cấp quyền.',
      ],
      q: ['P-37'], src: 'workflow-management/workflow-management.component · /workflow-management',
    };
    const title = `<div class="pg-head"><div class="l"><h1 class="pg-title lg">Danh sách quy trình${infoBtn(info)}</h1></div>
      ${WORKFLOW_ROLES.includes(Flow.state.persona) ? `<div class="r"><button type="button" class="vbtn primary" data-wf="sync" ${L.syncing ? 'disabled' : ''}>Đồng bộ từ Camunda</button></div>` : ''}</div>`;
    if (!WORKFLOW_ROLES.includes(Flow.state.persona)) return noAccess(title);
    const rows = listRows();
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const dash = '<span class="dash">-</span>';
    const columns = [
      { h: 'Mã quy trình', w: 220, toggler: true, cell: (r) => (r.isVersion ? `<a class="link" href="#/quy-trinh/${r.v.key}" data-go="quy-trinh/${r.v.key}">${esc(r.w.code)}</a>` : '-') },
      { h: 'Mã Camunda', w: 160, cell: (r) => `<span class="clamp">${esc(r.w.id)}</span>` },
      { h: 'Tên quy trình', min: 200, cell: (r) => `<span class="clamp">${esc(r.w.name)}</span>` },
      { h: 'Trạng thái', w: 180, align: 'c', cell: (r) => (r.isVersion ? badge(...WF_STATUS[r.v.status]) : dash) },
      { h: 'Phiên bản', w: 90, cell: (r) => `<span class="clamp">${r.version || '-'}</span>` },
      { h: 'SL hồ sơ đang xử lý', w: 150, cell: (r) => String(r.count || 0) },
    ];
    return `<div class="pg">
      ${title}
      <div class="vcard pad24">
        <div class="pg-head"><h2 class="blk-t"><span class="bar"></span>Danh sách quy trình</h2><div class="r">
          <div style="width:260px">${vSelect({ id: 'wf-st', value: L.st, clear: true, placeholder: 'Trạng thái',
            options: Object.entries(WF_STATUS).map(([value, [label]]) => ({ value, label })),
            onChange: (v) => { L.st = v; L.page = 1; L.open.clear(); rerender(); } })}</div>
          <label class="vsearch" style="width:264px">${icon('search')}<input id="wf-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên quy trình" value="${esc(L.kw)}"></label></div></div>
        ${vTreeTable({ id: 'wf', columns, rows: rows.slice(from, from + L.size), from, expanded: L.open, click: true, maxH: 'calc(100vh - 380px)',
          onToggle: (k) => { if (L.open.has(k)) L.open.delete(k); else L.open.add(k); rerender(); } })}
        ${pager({ id: 'wf', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  /* ---------- SCR-42 Chi tiết quy trình ---------- */
  const DT = { key: null, sel: null, closed: new Set() };
  const TYPE_GROUPS = (el) => {
    const f = (label, value) => ({ label, value: value || '-' });
    const base = [{ key: 'common', label: 'Chung', fields: [f('Tên', el.name), f('ID', el.id)] },
      { key: 'documentation', label: 'Tài liệu mô tả', fields: [f('Mô tả', el.doc)] }];
    if (el.type === 'serviceTask') return base.concat([{ key: 'integration', label: 'Tích hợp', fields: [f('Job type (Worker xử lý)', el.job)] }]);
    return base.concat([
      { key: 'assignment', label: 'Phân công', fields: [f('Nhóm phụ trách', el.actor), f('Người cụ thể', ''), f('Cần vai trò', '')] },
      { key: 'form', label: 'Biểu mẫu phần tử', fields: [f('Biểu mẫu', el.form)] }]);
  };
  const pad2 = (n) => String(n).padStart(2, '0');
  function elementOf(page, id, code) {
    const n = window.BPMN_DIAGRAMS[page].nodes.find((x) => x.el && x.el.id === id);
    if (!n) return null;
    const el = Object.assign({}, n.el);
    /* Job type mẫu cho Service Task: <mã quy trình>.<id phần tử>. */
    if (el.type === 'serviceTask') el.job = `dtms.${code.toLowerCase()}.${id.replace(/^Activity_/, 'task-')}`;
    return el;
  }

  function detail(key) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/workflow-management/workflow-detail/workflow-detail.component.html
    //       + workflow-detail.facade.ts (elementDetailGroups), components/bpmn-viewer (toolbar, SELECTED_MARKER)
    const info = {
      scr: 'SCR-42', name: 'Chi tiết quy trình', uc: 'UC-02-01 · UR-WF-01, UR-WF-03',
      notes: [
        'Bố cục lấy nguyên từ workflow-detail: trái 5/7 = Thông tin quy trình (3 cột) + Sơ đồ quy trình (500px); phải 2/7 = Lịch sử phiên bản (vht-timeline, chấm đỏ = phiên bản hiện hành). Trạng thái hiện chữ, không badge.',
        'Bấm một phần tử trên sơ đồ (task, cổng, sự kiện) → viền đỏ và panel bên phải sơ đồ: tiêu đề = loại phần tử (userTask, serviceTask, exclusiveGateway…) + tên; các nhóm Chung / Tài liệu mô tả / Phân công / Biểu mẫu phần tử, riêng Service Task thay Phân công + Biểu mẫu bằng Tích hợp. Nút × đóng panel.',
        'Nội dung phần tử lấy từ nhãn task trong ĐTMS.drawio: Tác nhân → Nhóm phụ trách (không có thì lấy tên lane), Thực hiện → Mô tả, Biểu mẫu → Biểu mẫu. ID phần tử (Activity_11…) và Job type là dữ liệu mẫu; bản thật đọc từ XML đã deploy.',
        'Sơ đồ vẽ lại bằng SVG thay bpmn-js: toolbar Phóng to / Thu nhỏ như source (nhân 1,25 mỗi lần thay vì cộng 0,1 vì sơ đồ rộng ~28.000px), bỏ nút Bản đồ thu nhỏ; mở ở chế độ vừa khung (fit-viewport).',
        'Lịch sử phiên bản là các phiên bản Web Modeler (type MODELER) của quy trình, không phải lịch sử deploy.',
      ],
      q: [], src: 'workflow-management/workflow-detail · /workflow-management/:id?processDefinitionId=',
    };
    const head = `<div class="pg-head"><div class="l"><button class="vbtn back" data-go="quy-trinh" aria-label="Quay lại">${icon('back')}</button>
      <h1 class="pg-title lg">Chi tiết quy trình${infoBtn(info)}</h1></div></div>`;
    if (!WORKFLOW_ROLES.includes(Flow.state.persona)) return noAccess(head);
    const found = findVersion(key);
    if (!found) return `<div class="pg">${head}<div class="vcard pad24"><div class="empty-t">Không tìm thấy quy trình.</div></div></div>`;
    const { w, v } = found;
    if (DT.key !== key) { DT.key = key; DT.sel = null; DT.closed = new Set(); }
    const el = DT.sel ? elementOf(v.page, DT.sel, w.code) : null;
    const kv = (k, val) => `<div><div class="k">${k}</div><div class="v clamp">${esc(val == null || val === '' ? '-' : val)}</div></div>`;
    const dt = (s) => { const d = new Date(s); return [`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`, `${pad2(d.getHours())}:${pad2(d.getMinutes())}`]; };
    const panel = el ? `<aside class="wf-el">
        <div class="wf-el-h"><div class="min0"><div class="t clamp">${esc(el.type || '-')}</div><div class="s clamp">${esc(el.name || '-')}</div></div>
          <button type="button" class="wf-el-x" data-wf="close-el" aria-label="Đóng">${icon('x')}</button></div>
        ${vAccordion({ id: 'wf-el', closed: DT.closed, onToggle: (k) => { if (DT.closed.has(k)) DT.closed.delete(k); else DT.closed.add(k); rerender(); },
          items: TYPE_GROUPS(el).map((g) => ({ key: g.key, label: g.label,
            body: g.fields.map((f) => `<div class="wf-f"><div class="k">${esc(f.label)}</div><div class="v clamp">${esc(f.value)}</div></div>`).join('') })) })}
      </aside>` : '';
    return `<div class="pg">
      ${head}
      <div class="tgrid">
        <div class="tmain">
          <section class="vcard pad24 gen"><h3>Thông tin quy trình</h3><div class="ginfo c3">
            ${kv('Mã quy trình', w.code)}${kv('Mã Camunda', w.id)}${kv('Tên quy trình', w.name)}${kv('Phiên bản', v.modeler)}
            ${kv('Phiên bản Deploy', v.deploy)}${kv('Trạng thái', WF_STATUS[v.status][0])}${kv('Số hồ sơ đang xử lý', processingCount(v))}</div></section>
          <div class="wf-dg ${el ? 'sel' : ''}">
            <section class="vcard pad24 gen"><h3>Sơ đồ quy trình</h3>
              ${window.BpmnView.html('wf/' + key, [], 500, { page: v.page, toolbar: true, select: true, selected: DT.sel })}</section>
            ${panel}
          </div>
        </div>
        <section class="vcard pad24 trail gen"><h3>Lịch sử phiên bản</h3>
          ${w.history.length ? `<ul class="vtl wf-vh">${w.history.map((h) => { const [d, t] = dt(h.at); return `<li><span class="mk ${h.current ? 'on' : ''}"></span><div class="wf-vh-c">
            <div class="top"><span class="vn">${esc(h.version)}</span><span class="when">${d}<i></i>${t}</span></div>
            <div class="nm clamp">${esc(w.name)}</div>${h.desc ? `<div class="ds clamp">Mô tả phiên bản: ${esc(h.desc)}</div>` : ''}</div></li>`; }).join('')}</ul>`
            : '<div class="empty-t">Chưa có phiên bản nào.</div>'}</section>
      </div></div>`;
  }

  document.addEventListener('bpmn-element', (e) => {
    if (!String(e.detail.key).startsWith('wf/')) return;
    DT.sel = e.detail.id; rerender();
  });
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-pager="wf"]')) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (L.psOpen && !t.closest('[data-pager]')) { L.psOpen = false; rerender(); }
    const b = t.closest('[data-wf]');
    if (!b) return;
    if (b.dataset.wf === 'close-el') { DT.sel = null; rerender(); return; }
    if (b.dataset.wf === 'sync' && !L.syncing) {
      /* handleSyncFromCamunda: khoá nút khi đang gọi, xong thì toast và tải lại danh sách. */
      L.syncing = true; rerender();
      setTimeout(() => { L.syncing = false; toast('<b>Thành công</b><br>Đã đồng bộ danh sách quy trình từ Camunda.'); rerender(); }, 800);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'wf-kw') return;
    L.kw = e.target.value.trim(); L.page = 1; L.open.clear(); rerender();
    const k = document.getElementById('wf-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-48 Giám sát tiến trình (chỉ xem, D-3) ---------- */
  /* Trạng thái = chuỗi BE trả về, màu theo PROCESS_MONITORING_STATUS_VARIANT_MAP. */
  const STATUS = { 'Đang chạy': 'info', 'Hoàn thành': 'success', 'Quá hạn': 'warning', 'Đã hủy': 'error' };
  /* Ô lọc Trạng thái lấy từ GET /process-instances/statuses — BE bỏ "Đã hủy" khỏi danh sách này. */
  const FILTER_STATUS = ['Đang chạy', 'Hoàn thành', 'Quá hạn'];
  /* P-37: một process definition cho MS01.01/.02/.03. Bản v2 (61 task) deploy 01/07/2026; hồ sơ tạo trước đó chạy v1. */
  const PROC = { name: 'Đề xuất mua sắm', code: 'MS01' };
  const V2_FROM = new Date(2026, 6, 1);
  const parseDate = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d); };
  /* Mã Camunda (process instance key) 16 chữ số, cố định theo mã hồ sơ. */
  const camundaKey = (code) => '2251799813' + String(685000 + Number(code.replace(/\D/g, '').slice(-4)) * 37).padStart(6, '0');

  function monitorRows() {
    const clock = Flow.state.clock;
    return S.allCases().map((c) => {
      let status = { done: 'Hoàn thành', moved: 'Đã hủy', stopped: 'Đã hủy' }[c.st] || 'Đang chạy';
      let step = '';
      if (c.st === 'processing') {
        if (c.live) {
          const names = [...new Set(Flow.state.tokens.map((t) => Flow.taskName(t.task)))];
          step = names.length ? names[0] + (names.length > 1 ? ` (+${names.length - 1})` : '') : '';
          if (Flow.state.tokens.some((t) => S.dueOf(t.task, t.since) < clock)) status = 'Quá hạn';
        } else {
          step = c.step;
          if (c.late) status = 'Quá hạn';
        }
      }
      return { status, key: camundaKey(c.code), code: c.code, href: S.caseHref(c), step,
        version: parseDate(c.created) < V2_FROM ? 1 : 2, created: c.created, updated: c.updated };
    }).sort((a, b) => parseDate(b.created) - parseDate(a.created));
  }

  const emptyFilter = () => ({ key: '', code: '', proc: '', st: null });
  /* kw: ô tìm kiếm nhanh; f: tiêu chí nâng cao đã áp; d: đang nhập. Hai kiểu tìm độc lập, chỉ một hiện (process-monitoring). */
  const G = { kw: '', mode: 'kw', adv: false, f: emptyFilter(), d: emptyFilter(), page: 1, size: 10, psOpen: false };
  const keyInvalid = (v) => !/^\d*$/.test(v);

  function filtered() {
    const f = G.f;
    return monitorRows().filter((r) => (G.mode === 'kw'
      ? !G.kw || norm(r.key + ' ' + r.code).includes(norm(G.kw))
      : (!f.key || r.key.includes(f.key)) && (!f.code || norm(r.code).includes(norm(f.code)))
        && (!f.proc || norm(`${PROC.name} ${PROC.code}`).includes(norm(f.proc))) && (!f.st || r.status === f.st)));
  }

  function advPanel() {
    const d = G.d;
    const bad = keyInvalid(d.key);
    const txt = (k, label, ph, err) => `<div class="vfield ${err ? 'invalid' : ''}" data-gfield="${k}"><div class="lr"><label>${label}</label></div>
      <input class="vctl" data-gf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"><p class="msg" ${err ? '' : 'hidden'}>Chỉ nhập số</p></div>`;
    return `<form class="adv" data-gadv>
      <div class="grid3">
        ${txt('key', 'Mã Camunda', 'Nhập mã Camunda', bad)}${txt('code', 'Mã hồ sơ', 'Nhập mã hồ sơ')}${txt('proc', 'Quy trình', 'Nhập mã quy trình, tên quy trình')}
        <div class="vfield"><div class="lr"><label>Trạng thái</label></div>${vSelect({ id: 'g-st', value: d.st, clear: true, placeholder: 'Tất cả trạng thái',
          options: FILTER_STATUS.map((v) => ({ value: v, label: v })), onChange: (v) => { d.st = v; rerender(); } })}</div>
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-g="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  function monitor() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/process-monitoring/process-monitoring.component.html
    //       + shared/constants/process-monitoring-columns.constants.ts, process-monitoring.constants.ts
    const info = {
      scr: 'SCR-48', name: 'Giám sát tiến trình', uc: 'UC-02-03 · UR-WF-05, UR-WF-12',
      notes: [
        'Màn chỉ xem (D-3): không có nút trên hàng tiêu đề, không có cột Thao tác, bấm dòng không mở gì. Chỉ <b>Mã hồ sơ</b> là liên kết, mở Chi tiết hồ sơ (SCR-20); nút quay lại của Chi tiết hồ sơ về lại đúng trang và bộ lọc đang xem (khác source: profile-detail luôn về Danh sách hồ sơ).',
        'Mỗi dòng là một process instance của một ĐXMS: hồ sơ đang chạy luồng, hồ sơ đã chuyển quy trình và 12 hồ sơ mẫu. Mã Camunda là process instance key (dữ liệu mẫu).',
        'Trạng thái: Đang chạy; Quá hạn khi bước hiện tại quá hạn xử lý; Hoàn thành khi đã phê duyệt; Đã hủy khi hồ sơ kết thúc do Chuyển quy trình (10b) hoặc Dừng xử lý (P-38). Ô lọc Trạng thái không có "Đã hủy" như source (BE loại khỏi danh sách trạng thái lọc).',
        'Quy trình: P-37 tạm coi MS01.01/.02/.03 là một định nghĩa MS01; hồ sơ tạo trước 01/07/2026 chạy v1.0 (58 task), sau đó v2.0 (61 task, trang MS01 v1.1).',
        'Bước hiện tại: nhiều nhánh song song thì hiện bước đầu và (+N).',
        'Chưa có trong source nên không dựng (UR-WF-05): chi tiết instance, danh sách User/Service Task, incident, biến input/output, Retry (P-40).',
        'Quyền xem (P-41): Quản trị hệ thống và Chuyên viên TTMS; vai khác thấy thông báo chưa được cấp quyền. Source ẩn mục menu theo quyền GS00; prototype giữ menu để đổi vai demo.',
      ],
      q: D.screenQ['SCR-48'], src: 'process-monitoring/process-monitoring.component · /process-monitoring',
    };
    const title = `<div class="pg-head"><div class="l"><h1 class="pg-title lg">Giám sát tiến trình${infoBtn(info)}</h1></div></div>`;
    if (!MONITOR_ROLES.includes(Flow.state.persona)) {
      return `<div class="pg">${title}<div class="vcard pad24"><p class="ov-empty">Bạn chưa được cấp quyền truy cập chức năng này</p></div></div>`;
    }
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / G.size));
    if (G.page > pages) G.page = pages;
    const from = (G.page - 1) * G.size;
    const cols = [['Trạng thái', 140, 'c'], ['Mã Camunda', 160], ['Mã hồ sơ', 150], ['Quy trình', 220, '', true], ['Bước hiện tại', 180, '', true],
      ['Ngày tạo', 120], ['Ngày cập nhật', 120]];
    const dash = '<span class="dash">-</span>';
    const body = rows.slice(from, from + G.size).map((r, i) => `<tr data-code="${esc(r.code)}">
        <td class="ord">${from + i + 1}</td><td class="c">${badge(r.status, STATUS[r.status])}</td><td class="num">${esc(r.key)}</td>
        <td><a class="link" href="#/${r.href}" data-go="${r.href}">${esc(r.code)}</a></td>
        <td><div class="proc-cell"><div class="n">${esc(PROC.name)}</div><div class="s">${PROC.code} - v${r.version}.0</div></div></td>
        <td>${r.step ? `<span class="clamp">${esc(r.step)}</span>` : dash}</td><td class="num">${esc(r.created)}</td><td class="num">${esc(r.updated)}</td></tr>`).join('');
    return `<div class="pg">
      ${title}
      <div class="vcard pad24">
        <div class="pg-head"><span></span><div class="r">
          ${G.adv ? '' : `<label class="vsearch" style="width:320px">${icon('search')}<input id="gs-kw" maxlength="255" placeholder="Tìm kiếm theo mã Camunda, mã hồ sơ" value="${esc(G.kw)}"></label>`}
          <button class="vbtn ${G.adv ? 'active' : 'secondary'}" data-g="adv">${G.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${G.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable gs-table"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a, min]) => `<th class="${a || ''}" style="${min ? '' : `width:${w}px;`}min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'gs', total: rows.length, page: G.page, size: G.size, open: G.psOpen })}
      </div></div>`;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-pager="gs"]')) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) G.page = Number(b.dataset.pg);
      else if (s) { G.size = Number(s.dataset.ps); G.page = 1; G.psOpen = false; } else if (t.closest('[data-ps-open]')) G.psOpen = !G.psOpen;
      else return;
      rerender(); return;
    }
    if (G.psOpen) { G.psOpen = false; rerender(); }
    const g = t.closest('[data-g]');
    if (!g) return;
    /* Bật/tắt panel không xoá giá trị đã nhập, không tải lại danh sách (handleAdvancedSearchToggle). */
    if (g.dataset.g === 'adv') G.adv = !G.adv;
    if (g.dataset.g === 'reset') { G.d = emptyFilter(); G.f = emptyFilter(); G.mode = 'adv'; G.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-gadv]')) return;
    e.preventDefault();
    if (keyInvalid(G.d.key)) return;
    G.f = Object.assign({}, G.d); G.mode = 'adv'; G.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest('[data-gf]');
    if (!f) return;
    G.d[f.dataset.gf] = f.value;
    if (f.dataset.gf === 'key') {
      const box = document.querySelector('[data-gfield="key"]');
      const bad = keyInvalid(f.value);
      box.classList.toggle('invalid', bad);
      box.querySelector('.msg').hidden = !bad;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'gs-kw') return;
    G.kw = e.target.value.trim(); G.mode = 'kw'; G.page = 1; rerender();
    const k = document.getElementById('gs-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  window.QuyTrinh = { monitor, monitorRows, list, detail, WORKFLOWS };
})();
