/* Ma trận hành động (Quản trị quy trình, D-2) — khung tab + Luật hiển thị hành động.
   Tài liệu chuẩn bị docs/dtms/prototype-PH02-quy-trinh-chuan-bi.md. B3: khung, SCR-43, SCR-44; B4: SCR-45 Đối soát BPMN, SCR-46/47 Danh mục hành động. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, infoBtn, vSelect, pager, norm, toast, badge } = window.UI;
  const rerender = () => window.App.render();

  /* T24 Q3: mỗi tab là một module quyền riêng như action-matrix-permissions (HTN, DMHS / DMHD, DTO); D.perms thay cho danh sách vai (P-41, P-118). */
  const can = (code) => D.can(Flow.state.persona, code);
  const TODAY = '28/09/2026';
  const BASE = 'ma-tran';

  /* ---------- Danh mục dùng trong luật (§3.2) ---------- */
  /* Loại — DISPLAY_RULE_TYPE_OPTIONS. */
  const TYPES = [{ value: 'MAIN', label: 'Hành động chính' }, { value: 'DETAIL', label: 'Hành động chi tiết' }, { value: 'OTHER', label: 'Hành động khác' }];
  /* Danh mục hành động (~10 mục). Loại đi theo hành động; outcome = giá trị biến của nhánh BPMN (dùng ở Danh mục hành động, B4). */
  const ACTIONS = [
    { code: 'GUI_DUYET', name: 'Gửi duyệt', type: 'MAIN', outcome: 'action=SUBMIT' },
    { code: 'PHE_DUYET', name: 'Phê duyệt', type: 'MAIN', outcome: 'approved=true' },
    { code: 'XAC_NHAN', name: 'Xác nhận', type: 'MAIN', outcome: 'confirmed=true' },
    { code: 'TRINH_KY', name: 'Trình ký', type: 'MAIN', outcome: 'signRequested=true' },
    { code: 'HOAN_THANH', name: 'Hoàn thành', type: 'MAIN', outcome: 'completed=true' },
    { code: 'TRA_LAI', name: 'Trả lại', type: 'DETAIL', outcome: 'approved=false' },
    { code: 'TU_CHOI', name: 'Từ chối', type: 'DETAIL', outcome: 'agreed=false' },
    { code: 'SUA_LAI', name: 'Sửa lại', type: 'DETAIL', outcome: 'mismatchAction=EDIT' },
    { code: 'CHUYEN_QUY_TRINH', name: 'Chuyển quy trình', type: 'OTHER', outcome: 'mismatchAction=MOVE' },
    { code: 'LUU', name: 'Lưu', type: 'OTHER', outcome: '' },
    /* T17 SCR-98: hành động hỗ trợ, không đóng task (như Lưu) — mở hộp thoại Cập nhật nhân sự của luồng (BE replaceCandidateUsers). */
    { code: 'UPDATE_MEMBERS', name: 'Cập nhật nhân sự', type: 'OTHER', outcome: '' },
  ];
  const actionBy = (code) => ACTIONS.find((a) => a.code === code);
  const SCREENS = [{ value: 'TASK', label: 'Xử lý công việc' }, { value: 'DETAIL', label: 'Chi tiết hồ sơ' }, { value: 'CREATE', label: 'Thêm mới hồ sơ' }];
  /* Biểu mẫu sử dụng (T10 B4): biểu mẫu đang hoạt động của Quản lý E-Form, giá trị = mã biểu mẫu. */
  const formOptions = (cur) => window.EForm.activeOptions(cur);
  /* Vai trò thực hiện — mã vai trò URD + tên, như DISPLAY_RULE_ROLE_OPTIONS ("PM - Chủ nhiệm NV KHCN"). */
  const ROLES = [['R-DVDX-CQ', 'Chuyên quản ĐVĐX'], ['R-DVDX-CH', 'Chỉ huy ĐVĐX'], ['R-TTMS', 'Chuyên viên TTMS'], ['R-CQCM', 'Chuyên viên CQCM'],
    ['R-CQCM-CH', 'Trưởng ban CQCM'], ['R-TC', 'Chuyên viên Tài chính'], ['R-PTGD', 'Phó Tổng Giám đốc'], ['R-TGD-VHT', 'Tổng Giám đốc VHT'],
    ['R-BAN-DTXD', 'Ban ĐTXD Tập đoàn'], ['R-QTHT', 'Quản trị hệ thống']].map(([value, name]) => ({ value, label: `${value} - ${name}` }));
  const WHO_ROLES = { minh: ['R-DVDX-CQ'], hai: ['R-DVDX-CH'], lan: ['R-TTMS'], 'cqcm:doer': ['R-CQCM', 'R-TC'], 'cqcm:signer': ['R-CQCM-CH'],
    binh: ['R-PTGD'], tgd: ['R-TGD-VHT'], td: ['R-BAN-DTXD'] };
  const labelOf = (opts, v) => (opts.find((o) => o.value === v) || {}).label || '';
  /* Cần vai trò của bước (T24 Q4) = mã + tên vai theo who của bước; who là tài khoản thì lấy vai của tài khoản. */
  const roleLabels = (who) => (WHO_ROLES[who] || [D.roleOf(who)]).filter(Boolean).map((r) => labelOf(ROLES, r) || r);

  /* Quy trình áp dụng — danh sách quy trình của SCR-41; bước = User Task trên sơ đồ phiên bản đang hoạt động.
     MS01.01 / .02 / .03 là ba quy trình riêng (P-37) dùng chung trang MS01 v1.1: bỏ các bước không áp dụng cho quy trình (D.notApplicable). */
  const workflows = () => window.QuyTrinh.WORKFLOWS;
  const MS01 = ['MS01.01', 'MS01.02', 'MS01.03'];
  const applies = (proc, task) => !(D.notApplicable[proc] || []).includes(Number(task));
  const processOptions = () => workflows().map((w) => ({ value: w.code, label: `${w.code} - ${w.name}` }));
  function stepOptions(code) {
    const w = workflows().find((x) => x.code === code);
    if (!w) return [];
    const v = w.versions.find((x) => x.status === 'ACTIVE') || w.versions[0];
    const seen = new Set();
    return window.BPMN_DIAGRAMS[v.page].nodes.filter((n) => n.el && n.el.type === 'userTask' && applies(code, n.el.id.replace(/^Activity_/, ''))
      && !seen.has(n.el.id) && seen.add(n.el.id))
      .map((n) => ({ value: n.el.id, label: n.el.name }));
  }

  /* ---------- Luật mẫu: sinh từ D.flow (§3.2) ----------
     Mỗi nút hành động của mỗi User Task áp dụng cho MS01.01 / .02 / .03 = một luật của quy trình đó. Bỏ 2 nút của task 10a (Sửa lại / Chuyển quy trình): để "Thiếu luật" cho Đối soát BPMN (B4). */
  function actionOf(label, c) {
    const l = label.toLowerCase();
    if (/chuyển quy trình/.test(l)) return 'CHUYEN_QUY_TRINH';
    if (/^sửa lại/.test(l)) return 'SUA_LAI';
    /* "Phê duyệt" (task 60) mở hộp thoại ký BM-08 nhưng là hành động phê duyệt, xét trước cờ ký. */
    if (/^phê duyệt/.test(l)) return 'PHE_DUYET';
    if (c && c.sign) return 'TRINH_KY';
    if (/^không đồng ý/.test(l)) return 'TU_CHOI';
    if (/trả lại|chưa|không đạt|yêu cầu|kết thúc|thiếu/.test(l)) return 'TRA_LAI';
    if (/^(gửi|trình)/.test(l)) return 'GUI_DUYET';
    if (/đồng ý|xác nhận|đạt|thống nhất|chấp nhận|báo cáo|hoàn tất/.test(l)) return 'XAC_NHAN';
    return 'HOAN_THANH';
  }
  const formOf = (task, c) => {
    const src = (c && c.sign) || (window.BPMN_TASKS[task] || {}).form || '';
    const m = /BM-(0\d)|Checklist (0\d)/.exec(src);
    return m ? (m[1] ? 'BM-' + m[1] : 'CL-' + m[2]) : null;
  };
  /* Nhánh kết quả (outgoing branch key, vd "Gui_duyet"): nhãn nút bỏ dấu, phần trước " — ". */
  const branchKey = (label) => {
    const s = label.split(' — ')[0].normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  /* Thứ tự bước như trên BPMN: 10a nằm sau 10 (Object.entries đưa khoá số lên trước khoá chữ). */
  const taskOrder = (t) => parseInt(t, 10) + (/[a-z]$/.test(t) ? 0.5 : 0);
  /* Mọi nhánh ra của các User Task của một quy trình MS01.0x = mỗi nút hành động của mỗi bước người dùng trong D.flow (trừ bước không áp dụng).
     Dùng chung cho luật mẫu và Đối soát BPMN. Quy trình khác chưa có mô tả nhánh. */
  function branches(proc) {
    const out = [];
    if (!MS01.includes(proc)) return out;
    Object.keys(D.flow).filter((t) => D.flow[t].who && applies(proc, t)).sort((a, b) => taskOrder(a) - taskOrder(b)).forEach((task) => {
      const f = D.flow[task];
      (f.choices || [{ label: f.actionLabel || 'Hoàn thành' }]).forEach((c) => {
        out.push({ proc, task, step: 'Activity_' + task, stepName: (window.BPMN_TASKS[task] || {}).name || task, branch: branchKey(c.label),
          label: c.label, act: actionOf(c.label, c), form: formOf(task, c), roles: WHO_ROLES[f.who] || [] });
      });
    });
    return out;
  }
  function ruleCode(b, taken) {
    const t = /^\d+$/.test(b.task) ? String(b.task).padStart(2, '0') : b.task.toUpperCase();
    const pre = `${b.proc.replace('.', '_')}_T${t}_${b.act}`;
    let code = pre, n = 2;
    while (taken.has(code)) code = `${pre}_${n++}`;
    taken.add(code);
    return code;
  }
  const ruleOf = (b, id, code, created, updated) => ({ id, code, action: b.act, name: b.label.slice(0, 50), screen: 'TASK', proc: b.proc, step: b.step,
    form: b.form, roles: b.roles.slice(), active: true, created, updated });
  /* Ngày cập nhật mẫu: vài luật đã được chỉnh sau khi deploy v1.1. */
  const EDITED = { 17: '12/08/2026', 26: '03/09/2026', 60: '21/09/2026' };
  /* Bỏ 2 nút của 10a: để "Thiếu luật" cho Đối soát BPMN. */
  function seed() {
    const taken = new Set();
    return MS01.flatMap((p) => branches(p)).filter((b) => b.task !== '10a')
      .map((b, i) => ruleOf(b, i + 1, ruleCode(b, taken), '30/06/2026', EDITED[b.task] || '30/06/2026'));
  }
  let RULES = seed();
  /* Nút demo "Reset luồng" đưa dữ liệu luật về mẫu ban đầu. */
  document.addEventListener('click', (e) => { if (e.target.closest('#rs')) { RULES = seed(); } }, true);

  const procLabel = (code) => labelOf(processOptions(), code) || code;
  const byId = (id) => RULES.find((r) => String(r.id) === String(id));

  /* ---------- Khung Ma trận hành động (action-matrix.component) ---------- */
  const TABS = [{ path: 'display-rule', label: 'Luật hiển thị hành động', perm: 'HTN00' }, { path: 'bpmn-reconcile', label: 'Đối soát BPMN', perm: 'DTO00' }, { path: 'action-catalog', label: 'Danh mục hành động', perm: 'DMHS00' }];
  const noAccess = (title) => `<div class="pg">${title}<div class="vcard pad24"><p class="ov-empty">Bạn chưa được cấp quyền truy cập chức năng này</p></div></div>`;

  function shell(tab, info, action, body) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/action-matrix/action-matrix.component.html (tiêu đề 20, tab pill, nút của tab bên phải)
    return `<div class="pg">
      <h1 class="pg-title">Ma trận hành động${infoBtn(info)}</h1>
      <div class="pg-head"><nav class="mt-tabs" aria-label="Ma trận hành động">${TABS.filter((t) => can(t.perm)).map((t) => `<a class="mt-tab ${t.path === tab ? 'on' : ''}" href="#/${BASE}/${t.path}" data-go="${BASE}/${t.path}" ${t.path === tab ? 'aria-current="page"' : ''}>${t.label}</a>`).join('')}</nav>
        ${action ? `<div class="r">${action}</div>` : ''}</div>
      ${body}</div>`;
  }

  const emptyRow = (n) => `<tr><td class="vtable-empty" colspan="${n}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`;
  /* Trang hiện tại vượt số trang sau khi lọc / đồng bộ → về trang cuối. */
  const slice = (S, rows) => {
    const pages = Math.max(1, Math.ceil(rows.length / S.size));
    if (S.page > pages) S.page = pages;
    const from = (S.page - 1) * S.size;
    return { from, rows: rows.slice(from, from + S.size) };
  };
  function pagerClick(S, t) {
    const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
    if (b) S.page = Number(b.dataset.pg);
    else if (s) { S.size = Number(s.dataset.ps); S.page = 1; S.psOpen = false; } else if (t.closest('[data-ps-open]')) S.psOpen = !S.psOpen;
    else return false;
    return true;
  }

  /* ---------- SCR-45 Đối soát BPMN (bpmn-reconcile) ---------- */
  /* wf: quy trình đang đối soát (luôn có giá trị, mở ở quy trình đầu tiên); kw: tìm theo mã luật / bước. */
  const R = { wf: null, kw: '', page: 1, size: 10, psOpen: false };

  /* Mỗi nhánh ghép với một luật chưa dùng cùng bước + cùng hành động (hai nhánh cùng hành động ở một bước → hai luật). */
  function reconRows(proc) {
    const used = new Set();
    return branches(proc).map((b) => {
      const fit = (x) => !used.has(x) && x.proc === proc && x.step === b.step && x.action === b.act;
      const r = RULES.find((x) => fit(x) && x.name === b.label.slice(0, 50)) || RULES.find(fit);
      if (r) used.add(r);
      return Object.assign({}, b, { rule: r || null, actName: (actionBy(b.act) || {}).name || b.act });
    });
  }

  const reconInfo = () => ({
    scr: 'SCR-45', name: 'Đối soát BPMN', uc: 'UC-02-02 · UR-WF-02, UR-WF-03',
    notes: [
      'Mỗi dòng là một nhánh ra của một User Task (một nút hành động của bước) trên BPMN phiên bản đang hoạt động, đặt cạnh luật hiển thị hành động phủ nhánh đó. Không có thao tác trên dòng — việc duy nhất màn này ghi dữ liệu là nút "Đồng bộ/Đối soát luật từ BPMN" trên hàng tab.',
      'Đã khớp = đã có luật cùng Quy trình áp dụng, cùng Bước trong điều kiện và cùng Hành động; Thiếu luật = chưa có. Xoá một luật ở tab Luật hiển thị hành động thì nhánh của nó trở lại Thiếu luật.',
      'Dữ liệu mẫu: ở mỗi quy trình MS01.01 / .02 / .03, 2 nhánh của bước "Xử lý ĐXMS không khớp quy trình" (Chuyển quy trình / Sửa lại — thêm theo quyết định chọn quy trình khi tạo ĐXMS) cố ý chưa có luật. Đồng bộ → hỏi xác nhận → tạo 2 luật cho quy trình đang chọn (vd MS01_01_T10A_…), 2 dòng thành Đã khớp; luật mới hiện ở đầu tab Luật hiển thị hành động.',
      'Ô Quy trình áp dụng là một phần của truy vấn, không bỏ chọn được; mở ở quy trình đầu tiên (MS01.01). Ba quy trình MS01 dùng chung sơ đồ MS01 v1.1 nhưng chỉ đối soát các bước áp dụng cho quy trình (MS01.03 không có bước 12, 41–58; MS01.01 / .02 không có bước 11, 38–40). MS02 / MS13 / MS14 chưa có mô tả nhánh: "Chưa có dữ liệu", đồng bộ tạo 0 luật.',
      'Tìm theo mã luật khớp hoặc tên bước (Enter). Phân trang tại chỗ 10/20/50 như source (API trả cả danh sách một lần).',
      'Quyền (T24 Q3, P-118): DTO00 vào tab; DTO02 mới có nút Đồng bộ/Đối soát luật từ BPMN.',
    ],
    q: ['P-39', 'P-118'], src: 'action-matrix/catalogs/bpmn-reconcile · /action-matrix/bpmn-reconcile',
  });

  function reconcile() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/action-matrix/catalogs/bpmn-reconcile/bpmn-reconcile.component.html
    //       + bpmn-reconcile.facade.ts, constants/bpmn-reconcile-columns.constants.ts
    const info = reconInfo();
    if (!can('DTO00')) return noAccess(`<h1 class="pg-title">Ma trận hành động${infoBtn(info)}</h1>`);
    if (!R.wf) R.wf = processOptions()[0].value;
    const rows = reconRows(R.wf).filter((x) => !R.kw || norm(x.rule ? x.rule.code : '').includes(norm(R.kw)) || norm(x.stepName).includes(norm(R.kw)));
    const { from, rows: pg } = slice(R, rows);
    const cols = [['Trạng thái', 140], ['Bước BPMN', 320], ['Nhánh kết quả', 180], ['Hành động kỳ vọng', 180], ['Luật khớp', 160]];
    const body = pg.map((x, i) => `<tr data-task="${esc(x.task)}">
        <td class="ord">${from + i + 1}</td>
        <td>${x.rule ? badge('Đã khớp', 'success') : badge('Thiếu luật', 'brand')}</td>
        <td><span class="clamp" title="${esc(x.stepName)}">${esc(x.stepName)}</span></td>
        <td><span class="clamp" title="${esc(x.branch)}">${esc(x.branch)}</span></td>
        <td><span class="clamp" title="${esc(x.actName)}">${esc(x.actName)}</span></td>
        <td>${x.rule ? `<span class="clamp">${esc(x.rule.code)}</span>` : '<span class="muted">-</span>'}</td></tr>`).join('');
    const card = `<div class="vcard">
      <div class="pg-head"><h2 class="mt-card-t">Đối soát luật hành động với BPMN</h2><div class="r">
        <div style="width:260px">${vSelect({ id: 'mt-rwf', value: R.wf, searchable: true, options: processOptions(),
          onChange: (v) => { if (v) { R.wf = v; R.page = 1; } rerender(); } })}</div>
        <label class="vsearch" style="width:264px">${icon('search')}<input id="mt-rkw" maxlength="255" placeholder="Tìm kiếm theo mã luật hành động, bước" value="${esc(R.kw)}"></label></div></div>
      <div class="vtable-vp" style="max-height:calc(100vh - 360px)"><table class="vtable mt-table mt-fixed"><colgroup><col style="width:60px">${cols.map(([, w]) => `<col style="width:${w}px">`).join('')}</colgroup>
        <thead><tr><th class="ord">STT</th>${cols.map(([h]) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${body || emptyRow(cols.length + 1)}</tbody></table></div>
      ${pager({ id: 'mtr', total: rows.length, page: R.page, size: R.size, open: R.psOpen })}</div>`;
    return shell('bpmn-reconcile', info, can('DTO02') ? `<button type="button" class="vbtn primary" data-mt="sync">${icon('reload')} Đồng bộ/Đối soát luật từ BPMN</button>` : '', card);
  }

  /* Đồng bộ luật từ BPMN: tạo luật cho mọi nhánh Thiếu luật của quy trình đang chọn (hỏi trước, nêu tên quy trình). */
  async function sync() {
    const proc = procLabel(R.wf);
    const yes = await window.Catalog.confirm({ sev: 'info', title: 'Đồng bộ luật từ BPMN',
      desc: `Hệ thống sẽ tạo luật hiển thị hành động cho các nhánh còn thiếu của ${proc}. Bạn có chắc chắn muốn đồng bộ không?`, hl: proc, cancel: 'Không', ok: 'Có' });
    if (!yes) return;
    ok(`Đã tạo ${fillMissing(R.wf)} luật hiển thị hành động từ BPMN`);
    rerender();
  }
  /* Sinh luật cho mọi nhánh Thiếu luật của quy trình; dùng chung với Đồng bộ từ Camunda (T24 Q2). */
  function fillMissing(proc) {
    const missing = reconRows(proc).filter((x) => !x.rule);
    const taken = new Set(RULES.map((r) => r.code));
    let id = Math.max(0, ...RULES.map((r) => r.id));
    RULES.unshift(...missing.map((b) => ruleOf(b, ++id, ruleCode(b, taken), TODAY, TODAY)));
    return missing.length;
  }

  /* T24 Q1: nút trên màn xử lý việc theo luật (GET available-actions: luật ACTIVE của quy trình + bước + màn, vai của người dùng cộng vai của task).
     Không có luật khớp → không có nút, như BE. Ngoại lệ dữ liệu mẫu: quy trình chưa có mô tả nhánh (MS02, MS13, MS14) và bước 10a chưa có luật nào thì giữ nguyên nút,
     để 10a còn chạy được khi chưa đối soát. Tên hiển thị của luật là nhãn nút (rule.displayName). */
  function allowed(proc, task, label, pid) {
    if (!MS01.includes(proc)) return { show: true, label };
    const rows = reconRows(proc).filter((x) => x.task === String(task));
    const row = rows.find((x) => x.label === label);
    if (!row || (String(task) === '10a' && !rows.some((x) => x.rule))) return { show: true, label };
    const r = row.rule;
    if (!r || !r.active || r.screen !== 'TASK') return { show: false, label };
    const mine = row.roles.concat(D.roleOf(pid) || []);
    if (!D.allAccess(pid) && r.roles.length && !r.roles.some((x) => mine.includes(x))) return { show: false, label };
    return { show: true, label: r.name !== label.slice(0, 50) ? r.name : label };
  }

  /* ---------- SCR-46 Danh mục hành động (action-catalog-list) ---------- */
  const emptyCat = () => ({ act: '', name: '', rule: '' });
  const C = { kw: '', mode: 'kw', adv: false, f: emptyCat(), d: emptyCat(), page: 1, size: 10, psOpen: false };
  /* Mã luật áp dụng = các luật đang trỏ tới hành động (đọc trực tiếp từ tab Luật hiển thị hành động). */
  const rulesOf = (code) => RULES.filter((r) => r.action === code).map((r) => r.code);
  const catRows = () => ACTIONS.map((a) => Object.assign({}, a, { rules: rulesOf(a.code) })).filter((a) => {
    const has = (v, q) => !q || norm(v).includes(norm(q));
    if (C.mode === 'kw') return !C.kw || has(a.code, C.kw) || has(a.name, C.kw);
    return has(a.code, C.f.act) && has(a.name, C.f.name) && (!C.f.rule || a.rules.some((r) => has(r, C.f.rule)));
  });
  /* vht-tag-list: tối đa 3 chip, còn lại gom vào "+N", rê chuột mở danh sách. */
  function tagList(codes, all) {
    if (!codes.length) return '<span>-</span>';
    const chip = (c) => `<span class="mt-chip">${esc(c)}</span>`;
    if (all || codes.length <= 3) return `<div class="mt-tags">${codes.map(chip).join('')}</div>`;
    const rest = codes.slice(3);
    return `<div class="mt-tags">${codes.slice(0, 3).map(chip).join('')}<span class="mt-more" tabindex="0" title="${esc(rest.join(', '))}">+${rest.length}<span class="pop">${rest.map(chip).join('')}</span></span></div>`;
  }

  const catInfo = () => ({
    scr: 'SCR-46', name: 'Danh mục hành động', uc: 'UC-02-02 · UR-WF-02',
    notes: [
      'Danh mục chỉ xem: không có nút trên hàng tab, không có cột Thao tác. Chỉ Mã hành động là liên kết mở Xem chi tiết hành động; bấm dòng không mở gì.',
      'Mã luật áp dụng = các luật hiển thị đang trỏ tới hành động (tính trực tiếp từ tab Luật hiển thị hành động, nên thêm / xoá / đồng bộ luật thì cột này đổi theo). Hiện tối đa 3 mã, còn lại gom vào "+N" — rê chuột để xem.',
      'Outcome BPMN = giá trị biến mà nhánh BPMN ghi khi bấm hành động (vd approved=true); chỉ xem, không sửa trên UI (UR-WF-02 "outcome/biến nghiệp vụ" — source cũng chỉ xem).',
      'Danh mục mẫu 10 hành động suy từ nhãn nút của luồng MS01 v1.1; "Lưu" chưa có luật nào nên cột Mã luật áp dụng là "-".',
      'Tìm nhanh theo mã hoặc tên hành động (Enter); Tìm kiếm nâng cao 3 trường như source; hai kiểu tìm độc lập. Quay lại từ màn chi tiết về đúng trang / bộ lọc.',
      'Quyền (T24 Q3, P-118): DMHS00 vào tab; DMHD02 mới có liên kết Mã hành động và màn Xem chi tiết hành động.',
    ],
    q: ['P-118'], src: 'action-matrix/catalogs/action-catalog/action-catalog-list · /action-matrix/action-catalog',
  });

  function catalog() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/action-matrix/catalogs/action-catalog/action-catalog-list.component.html
    //       + action-catalog.facade.ts, constants/action-catalog-columns.constants.ts, action-catalog.constants.ts
    const info = catInfo();
    if (!can('DMHS00')) return noAccess(`<h1 class="pg-title">Ma trận hành động${infoBtn(info)}</h1>`);
    const rows = catRows();
    const { from, rows: pg } = slice(C, rows);
    const cols = [['Mã hành động', 200], ['Tên hành động', 220], ['Mã luật áp dụng', 420], ['Outcome BPMN', 180]];
    const body = pg.map((a, i) => `<tr data-code="${a.code}">
        <td class="ord">${from + i + 1}</td>
        <td>${can('DMHD02') ? `<a class="link" href="#/${BASE}/action-catalog/${a.code}" data-go="${BASE}/action-catalog/${a.code}">${esc(a.code)}</a>` : esc(a.code)}</td>
        <td>${esc(a.name)}</td><td>${tagList(a.rules)}</td><td>${esc(a.outcome || '-')}</td></tr>`).join('');
    const d = C.d;
    const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-mcf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"></div>`;
    const adv = `<form class="adv" data-mcadv><div class="grid3">${txt('act', 'Mã hành động', 'Nhập mã hành động')}${txt('name', 'Tên hành động', 'Nhập tên hành động')}${txt('rule', 'Mã luật áp dụng', 'Nhập mã luật áp dụng')}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-mt="creset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
    const card = `<div class="vcard">
      <div class="pg-head"><h2 class="mt-card-t">Danh mục hành động</h2><div class="r">
        ${C.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="mt-ckw" maxlength="255" placeholder="Tìm kiếm theo mã hành động, tên hành động" value="${esc(C.kw)}"></label>`}
        <button type="button" class="vbtn ${C.adv ? 'active' : 'secondary'}" data-mt="cadv">${C.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
      ${C.adv ? adv : ''}
      <div class="vtable-vp" style="max-height:calc(100vh - 360px)"><table class="vtable mt-table"><thead><tr><th class="ord">STT</th>${cols.map(([h, w]) => `<th style="min-width:${w}px">${h}</th>`).join('')}</tr></thead>
        <tbody>${body || emptyRow(cols.length + 1)}</tbody></table></div>
      ${pager({ id: 'mtc', total: rows.length, page: C.page, size: C.size, open: C.psOpen })}</div>`;
    return shell('action-catalog', info, '', card);
  }

  /* ---------- SCR-47 Xem chi tiết hành động (action-catalog-detail) ---------- */
  function catalogDetail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/action-matrix/catalogs/action-catalog/action-catalog-detail.component.html
    //       + action-catalog-detail.facade.ts (Mã quy trình → Chi tiết quy trình)
    const info = {
      scr: 'SCR-47', name: 'Xem chi tiết hành động', uc: 'UC-02-02 · UR-WF-02',
      notes: [
        'Trang riêng (không phải hộp thoại), không có hàng tab; mọi trường là chữ chỉ xem. Nút quay lại về màn trước đó (Danh mục hành động hoặc Luật hiển thị hành động).',
        'Outcome BPMN thay cho Mô tả ngắn (như source sau review 27/08/2026). Mã luật áp dụng hiện đủ mọi mã (không gom "+N"), khung tự cuộn khi dài.',
        'Danh sách quy trình áp dụng = các quy trình có luật dùng hành động này; Mã quy trình là liên kết sang Chi tiết quy trình (phiên bản đang hoạt động).',
      ],
      src: 'action-matrix/catalogs/action-catalog/action-catalog-detail · /action-matrix/action-catalog/:id',
    };
    const head = `<div class="pg-head"><div class="l"><button type="button" class="vbtn back" data-mt-back aria-label="Quay lại">${icon('back')}</button><h1 class="pg-title">Xem chi tiết hành động${infoBtn(info)}</h1></div></div>`;
    if (!can('DMHD02')) return noAccess(head);
    const a = actionBy(code);
    if (!a) return `<div class="pg">${head}<div class="vcard pad24"><div class="empty-t">Không tìm thấy dữ liệu.</div></div></div>`;
    const procs = [...new Set(RULES.filter((r) => r.action === code).map((r) => r.proc))].map((p) => workflows().find((w) => w.code === p)).filter(Boolean);
    const kv = (k, v) => `<div class="mt-ro"><div class="mt-dk">${k}</div><div class="mt-dv">${v}</div></div>`;
    const keyOf = (w) => (w.versions.find((v) => v.status === 'ACTIVE') || w.versions[0]).key;
    const prow = procs.map((w, i) => `<tr><td class="ord">${i + 1}</td><td><a class="link" href="#/quy-trinh/${keyOf(w)}" data-go="quy-trinh/${keyOf(w)}">${esc(w.code)}</a></td><td>${esc(w.name)}</td></tr>`).join('');
    const rules = rulesOf(code);
    return `<div class="pg">${head}
      <section class="vcard">
        <div class="grid3">${kv('Tên hành động', esc(a.name))}${kv('Mã hành động', esc(a.code))}${kv('Loại hành động', esc(labelOf(TYPES, a.type)))}</div>
        ${kv('Outcome BPMN', esc(a.outcome || '-'))}
        <div class="mt-ro"><div class="mt-dk">Mã luật áp dụng</div>${rules.length ? `<div class="mt-rules">${tagList(rules, true)}</div>` : '<div class="mt-dv">-</div>'}</div>
        <h2 class="mt-card-t">Danh sách quy trình áp dụng</h2>
        <div class="vtable-vp"><table class="vtable mt-table"><thead><tr><th class="ord">STT</th><th style="width:180px;min-width:180px">Mã quy trình</th><th style="min-width:420px">Tên quy trình</th></tr></thead>
          <tbody>${prow || emptyRow(3)}</tbody></table></div>
      </section></div>`;
  }

  /* ---------- SCR-43 Danh sách luật hiển thị hành động ---------- */
  const emptyAdv = () => ({ rule: '', act: '', name: '', wf: '', wfName: '', st: null });
  /* kw: ô tìm nhanh; f: tiêu chí nâng cao đã áp; d: đang nhập. Hai kiểu tìm độc lập (DisplayRuleFacade.criteria). */
  const L = { kw: '', mode: 'kw', adv: false, f: emptyAdv(), d: emptyAdv(), page: 1, size: 10, psOpen: false };
  const STATUS_OPTS = [{ value: 'ACTIVE', label: 'Kích hoạt' }, { value: 'INACTIVE', label: 'Vô hiệu hóa' }];

  function filtered() {
    const has = (v, q) => !q || norm(v).includes(norm(q));
    return RULES.filter((r) => {
      const a = actionBy(r.action) || {};
      const w = workflows().find((x) => x.code === r.proc) || {};
      if (L.mode === 'kw') return !L.kw || has(r.code, L.kw) || has(a.name, L.kw);
      const f = L.f;
      return has(r.code, f.rule) && has(r.action, f.act) && has(a.name, f.name) && has(r.proc, f.wf) && has(w.name, f.wfName)
        && (!f.st || (f.st === 'ACTIVE') === r.active);
    });
  }

  function advPanel() {
    const d = L.d;
    const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-mtf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"></div>`;
    return `<form class="adv" data-mtadv>
      <div class="grid3">
        ${txt('rule', 'Mã luật', 'Nhập mã luật')}${txt('act', 'Mã hành động', 'Nhập mã hành động')}${txt('name', 'Tên hành động', 'Nhập tên hành động')}
        ${txt('wf', 'Quy trình áp dụng', 'Nhập mã quy trình áp dụng')}${txt('wfName', 'Tên quy trình', 'Nhập tên quy trình')}
        <div class="vfield"><div class="lr"><label>Trạng thái</label></div>${vSelect({ id: 'mt-st', value: d.st, clear: true, placeholder: 'Tất cả', options: STATUS_OPTS, onChange: (v) => { d.st = v; rerender(); } })}</div>
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-mt="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  const listInfo = () => ({
    scr: 'SCR-43', name: 'Luật hiển thị hành động', uc: 'UC-02-02 · UR-WF-02, UR-WF-03',
    notes: [
      'Khung Ma trận hành động theo action-matrix: tiêu đề 20px, hàng tab dạng pill (tab đang mở nền đỏ), nút của tab đang mở nằm bên phải hàng tab (tab này: Thêm mới). Thêm mới / Chỉnh sửa / Xem chi tiết là trang riêng, không có hàng tab.',
      'Cột Thao tác chỉ có Sửa và Xoá như source (không có icon xem); xem chi tiết bằng cách bấm Mã luật hành động. Trạng thái là công tắc: bấm thì đổi ngay rồi hỏi xác nhận, chọn Không thì trả lại như cũ.',
      'Mã hành động là liên kết sang Xem chi tiết hành động. Tên hành động là tên trong Danh mục hành động, không phải Tên hiển thị của nút.',
      'Tìm kiếm nhanh theo mã luật hoặc tên hành động (Enter); Tìm kiếm nâng cao có 6 trường (5 ô chữ + Trạng thái) như source. Hai kiểu tìm độc lập, chỉ một kiểu có hiệu lực.',
      'Dữ liệu mẫu sinh từ luồng MS01 v1.1 cho từng quy trình MS01.01 / .02 / .03 (ba quy trình riêng — P-37 đã chốt): mỗi nút hành động của mỗi bước người dùng áp dụng cho quy trình là một luật (mã MS01_01_T&lt;bước&gt;_&lt;hành động&gt;). Ở mỗi quy trình, hai nút của bước "Xử lý ĐXMS không khớp quy trình" (Sửa lại / Chuyển quy trình) cố ý chưa có luật để demo Đối soát BPMN.',
      'Thêm / sửa / xoá / kích hoạt chạy thật trong phiên; tải lại trang hoặc "Reset luồng" ở nút demo thì về dữ liệu mẫu. ',
      'Áp dụng luật (T24 Q1, P-39): nút trên màn xử lý việc lấy theo luật đang Kích hoạt của quy trình + bước, màn Xử lý công việc, đúng vai; Tên hiển thị là nhãn nút. Tắt / xoá luật hoặc đổi sang màn khác thì nút ẩn. Chi tiết hồ sơ không có nút (source không gọi available-actions ở màn này). Chỉ các nhánh sẵn có của bước mới thành nút; luật thêm cho hành động ngoài BPMN không sinh nút vì không có nhánh để chạy.',
      'Ngoại lệ dữ liệu mẫu: MS02, MS13, MS14 chưa có luật nên giữ nguyên nút; bước 10a chưa có luật nào thì giữ nút để luồng còn chạy (thật: không có nút cho tới khi đối soát).',
      'Quyền (T24 Q3, P-118): HTN00 vào tab; HTN02 Thêm mới; HTN03 Sửa + công tắc Trạng thái; HTN05 Xoá; HTN04 liên kết Mã luật; DMHD02 liên kết Mã hành động. Không có quyền thì ẩn, công tắc khoá.',
    ],
    q: ['P-39', 'P-118'], src: 'action-matrix/catalogs/display-rule/display-rule-list · /action-matrix/display-rule',
  });

  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/action-matrix/catalogs/display-rule/display-rule-list.component.html
    //       + display-rule.facade.ts, constants/display-rule-columns.constants.ts, action-matrix.constants.ts (10/20/50)
    const info = listInfo();
    if (!can('HTN00')) return noAccess(`<h1 class="pg-title">Ma trận hành động${infoBtn(info)}</h1>`);
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 104, 'c', 'fix'], ['Trạng thái', 116, 'c'], ['Mã luật hành động', 160, '', 'fix'], ['Mã hành động', 255, '', 'fix'],
      ['Tên hành động', 160], ['Quy trình áp dụng', 260], ['Ngày tạo', 140], ['Ngày cập nhật', 160]];
    const body = rows.slice(from, from + L.size).map((r, i) => {
      const a = actionBy(r.action) || {};
      return `<tr data-id="${r.id}">
        <td class="ord">${from + i + 1}</td>
        <td class="c"><div class="acts">${can('HTN03') ? `<button type="button" class="cat-ic" data-mt-edit="${r.id}" title="Sửa" aria-label="Sửa">${icon('edit')}</button>` : ''}${can('HTN03') && can('HTN05') ? '<span class="sep"></span>' : ''}
          ${can('HTN05') ? `<button type="button" class="cat-ic del" data-mt-del="${r.id}" title="Xoá" aria-label="Xoá">${icon('del')}</button>` : ''}</div></td>
        <td class="c"><button type="button" class="vswitch ${r.active ? 'on' : ''} ${can('HTN03') ? '' : 'ro'}" role="switch" aria-checked="${r.active}" ${can('HTN03') ? `data-mt-tg="${r.id}"` : 'disabled'}
          aria-label="${r.active ? 'Ngừng kích hoạt' : 'Kích hoạt'}"><span></span></button></td>
        <td>${can('HTN04') ? `<a class="link clamp" href="#/${BASE}/display-rule/${r.id}/view" data-go="${BASE}/display-rule/${r.id}/view">${esc(r.code)}</a>` : `<span class="clamp">${esc(r.code)}</span>`}</td>
        <td>${can('DMHD02') ? `<a class="link clamp" href="#/${BASE}/action-catalog/${r.action}" data-go="${BASE}/action-catalog/${r.action}">${esc(r.action)}</a>` : `<span class="clamp">${esc(r.action)}</span>`}</td>
        <td><span class="clamp">${esc(a.name || '')}</span></td><td><span class="clamp">${esc(procLabel(r.proc))}</span></td>
        <td class="num">${esc(r.created)}</td><td class="num">${esc(r.updated)}</td></tr>`;
    }).join('');
    const card = `<div class="vcard">
      <div class="pg-head"><h2 class="mt-card-t">Danh sách luật hiển thị hành động</h2><div class="r">
        ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="mt-kw" maxlength="255" placeholder="Tìm kiếm theo mã luật, tên hành động" value="${esc(L.kw)}"></label>`}
        <button type="button" class="vbtn ${L.adv ? 'active' : 'secondary'}" data-mt="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
      ${L.adv ? advPanel() : ''}
      <div class="vtable-vp" style="max-height:calc(100vh - 360px)"><table class="vtable mt-table"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a, fix]) => `<th class="${a || ''}" style="${fix ? `width:${w}px;max-width:${w}px;` : ''}min-width:${w}px">${h}</th>`).join('')}</tr></thead>
        <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
      ${pager({ id: 'mt', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}</div>`;
    return shell('display-rule', info, can('HTN02') ? `<button type="button" class="vbtn primary" data-go="${BASE}/display-rule/create">${icon('add')} Thêm mới</button>` : '', card);
  }

  /* ---------- vht-confirm-dialog (dùng chung với Danh mục dùng chung) ---------- */
  const ENTITY = 'luật hiển thị hành động';
  const ok = (m) => toast(`<b>Thông báo</b><br>${m}`);
  async function del(r, after) {
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa ${ENTITY}: ${r.code} không?`, hl: r.code, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    RULES.splice(RULES.indexOf(r), 1);
    ok('Xóa thành công');
    if (after) after(); else rerender();
  }
  /* Công tắc đổi ngay khi bấm (như eCAT); Không → trả lại (DisplayRuleFacade.handleToggleStatus). */
  async function toggle(r) {
    const next = !r.active;
    r.active = next; rerender();
    const yes = await window.Catalog.confirm(next
      ? { sev: 'info', title: 'Kích hoạt', desc: `Bạn có chắc chắn muốn kích hoạt ${ENTITY}: ${r.code} không?`, hl: r.code, cancel: 'Không', ok: 'Có' }
      : { sev: 'warning', title: 'Dừng hoạt động', desc: `Bạn có chắc chắn muốn dừng hoạt động ${ENTITY}: ${r.code} không?`, hl: r.code, cancel: 'Không', ok: 'Có' });
    if (!yes) { r.active = !next; rerender(); return; }
    r.updated = TODAY;
    ok('Cập nhật trạng thái thành công');
    rerender();
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-pager="mt"]')) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (t.closest('[data-pager="mtr"]')) { if (pagerClick(R, t)) rerender(); return; }
    if (t.closest('[data-pager="mtc"]')) { if (pagerClick(C, t)) rerender(); return; }
    if ((L.psOpen || R.psOpen || C.psOpen) && !t.closest('[data-pager]')) { L.psOpen = R.psOpen = C.psOpen = false; rerender(); }
    if (t.closest('[data-mt-back]')) { if (history.length > 1) history.back(); else location.hash = `#/${BASE}/action-catalog`; return; }
    const ed = t.closest('[data-mt-edit]');
    if (ed) { location.hash = `#/${BASE}/display-rule/${ed.dataset.mtEdit}/edit`; return; }
    const dl = t.closest('[data-mt-del]');
    if (dl) { del(byId(dl.dataset.mtDel)); return; }
    const tg = t.closest('[data-mt-tg]');
    if (tg) { toggle(byId(tg.dataset.mtTg)); return; }
    const g = t.closest('[data-mt]');
    if (!g) return;
    /* Bật/tắt panel không xoá giá trị đã nhập, không tải lại danh sách (toggleAdvancedFilter). */
    if (g.dataset.mt === 'sync') { sync(); return; }
    if (g.dataset.mt === 'cadv') C.adv = !C.adv;
    if (g.dataset.mt === 'creset') { C.d = emptyCat(); C.f = emptyCat(); C.mode = 'adv'; C.page = 1; }
    if (g.dataset.mt === 'adv') L.adv = !L.adv;
    if (g.dataset.mt === 'reset') { L.d = emptyAdv(); L.f = emptyAdv(); L.mode = 'adv'; L.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => {
    if (e.target.matches('[data-mcadv]')) { e.preventDefault(); C.f = Object.assign({}, C.d); C.mode = 'adv'; C.page = 1; rerender(); return; }
    if (!e.target.matches('[data-mtadv]')) return;
    e.preventDefault();
    L.f = Object.assign({}, L.d); L.mode = 'adv'; L.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest('[data-mtf]');
    if (f) L.d[f.dataset.mtf] = f.value;
    const cf = e.target.closest('[data-mcf]');
    if (cf) C.d[cf.dataset.mcf] = cf.value;
  });
  document.addEventListener('keydown', (e) => {
    const id = e.target.id;
    if (e.key !== 'Enter' || !['mt-kw', 'mt-rkw', 'mt-ckw'].includes(id)) return;
    const v = e.target.value.trim();
    if (id === 'mt-kw') { L.kw = v; L.mode = 'kw'; L.page = 1; }
    if (id === 'mt-rkw') { R.kw = v; R.page = 1; }
    if (id === 'mt-ckw') { C.kw = v; C.mode = 'kw'; C.page = 1; }
    rerender();
    const k = document.getElementById(id);
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-44 Thêm mới / Chỉnh sửa / Xem chi tiết luật (display-rule-form) ---------- */
  const CODE_RE = /^[A-Z0-9_-]+$/;
  const LABELS = { action: 'Hành động', name: 'Tên hiển thị', type: 'Loại', code: 'Mã luật hành động', screen: 'Màn hình hiển thị', proc: 'Quy trình áp dụng',
    step: 'Bước trong điều kiện', form: 'Biểu mẫu sử dụng', roles: 'Vai trò thực hiện' };
  const REQUIRED = ['action', 'name', 'type', 'code', 'screen', 'proc', 'step'];
  const SELECTS = new Set(['action', 'type', 'screen', 'proc', 'step', 'form', 'roles']);
  /* F: một lượt vào màn (route); v: giá trị form; touched: trường đã rời khỏi (errorOf chỉ báo lỗi khi touched). */
  const F = { route: null, v: null, touched: new Set(), dirty: false };
  const blank = () => ({ action: null, name: '', code: '', screen: null, proc: null, step: null, form: null, roles: [], active: true });
  const typeOf = (action) => (actionBy(action) || {}).type || null;

  function errorOf(k) {
    if (!F.touched.has(k)) return '';
    const v = k === 'type' ? typeOf(F.v.action) : F.v[k];
    const empty = Array.isArray(v) ? !v.length : !String(v == null ? '' : v).trim();
    if (REQUIRED.includes(k) && empty) return `Bạn cần ${SELECTS.has(k) ? 'chọn' : 'nhập'} ${LABELS[k]}.`;
    if (k === 'code' && !empty && !CODE_RE.test(v)) return `${LABELS.code} không đúng định dạng.`;
    return '';
  }

  function form(mode, id) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/action-matrix/catalogs/display-rule/display-rule-form.component.html
    //       + display-rule-form.facade.ts, constants/display-rule-form.constants.ts, display-rule-options.constants.ts
    const title = { create: 'Thêm mới luật hiển thị hành động', edit: 'Chỉnh sửa luật hiển thị hành động', view: 'Xem chi tiết luật hiển thị nút' }[mode];
    const info = {
      scr: 'SCR-44', name: title, uc: 'UC-02-02 · UR-WF-02, UR-WF-03',
      notes: [
        'Trang riêng, không có hàng tab (như source). Thêm mới: chỉ card Thông tin chung. Chỉnh sửa / Xem: thêm Trạng thái (công tắc) và card Xem trước hiển thị hành động.',
        'Loại không chọn tay: tự điền theo Hành động đã chọn và luôn khoá. Bước trong điều kiện lọc theo Quy trình áp dụng (User Task trên sơ đồ phiên bản đang hoạt động); đổi quy trình thì xoá bước đã chọn.',
        'Mã luật hành động: tự viết hoa, chỉ chữ không dấu, số, "-", "_", tối đa 50 ký tự; không sửa được khi Chỉnh sửa; trùng mã → báo lỗi, giữ nguyên form. Tên hiển thị tối đa 50 ký tự.',
        'Huỷ / quay lại khi đã nhập → hỏi "Bạn có chắc muốn hủy?". Màn Xem có nút Chỉnh sửa; tiêu đề "Xem chi tiết luật hiển thị nút" lấy nguyên chuỗi source.',
        'Xem trước = nút như sẽ hiện trên màn Xử lý công việc + các vai trò thấy nút; luật đang Kích hoạt quyết định nút thật trên màn đó (T24 Q1, P-39).',
        'Quy trình áp dụng: 6 quy trình của Danh sách quy trình (MS01.01 / .02 / .03 là ba quy trình riêng — P-37 đã chốt); Bước trong điều kiện chỉ gồm bước áp dụng cho quy trình. Biểu mẫu sử dụng: biểu mẫu đang hoạt động ở Quản lý E-Form (Mã - Tên; Checklist 01/02 = CL-01/02); luật đang gắn biểu mẫu đã dừng hoạt động vẫn hiện biểu mẫu đó kèm "(Dừng hoạt động)". Vai trò thực hiện: vai trò theo URD.',
      ],
      q: ['P-39'], src: 'action-matrix/catalogs/display-rule/display-rule-form · /action-matrix/display-rule/create | :id/edit | :id/view',
    };
    const headL = `<div class="l"><button type="button" class="vbtn back" data-mt-cancel aria-label="Quay lại">${icon('back')}</button><h1 class="pg-title">${esc(title)}${infoBtn(info)}</h1></div>`;
    if (!can({ create: 'HTN02', edit: 'HTN03', view: 'HTN04' }[mode])) return noAccess(`<div class="pg-head">${headL}</div>`);
    const rule = id != null ? byId(id) : null;
    if (id != null && !rule) return `<div class="pg"><div class="pg-head">${headL}</div><div class="vcard pad24"><div class="empty-t">Không tìm thấy dữ liệu.</div></div></div>`;
    const route = `${mode}/${id || ''}`;
    if (F.route !== route) {
      F.route = route; F.touched = new Set(); F.dirty = false;
      F.v = rule ? { action: rule.action, name: rule.name, code: rule.code, screen: rule.screen, proc: rule.proc, step: rule.step, form: rule.form, roles: rule.roles.slice(), active: rule.active } : blank();
    }
    const v = F.v, view = mode === 'view';
    const right = view
      ? (can('HTN03') ? `<button type="button" class="vbtn primary" data-go="${BASE}/display-rule/${id}/edit">Chỉnh sửa</button>` : '')
      : '<button type="button" class="vbtn secondary grey" data-mt-cancel>Huỷ</button><button type="button" class="vbtn primary" data-mt-save>Lưu</button>';
    const actionOpts = ACTIONS.map((a) => ({ value: a.code, label: `${a.code} - ${a.name}` }));
    const rolesLabels = v.roles.map((r) => labelOf(ROLES, r)).filter(Boolean);
    const chips = (ls) => (ls.length ? `<div class="mt-chips">${ls.map((l) => `<span class="mt-chip">${esc(l)}</span>`).join('')}</div>` : '<span class="mt-v">-</span>');
    const change = (k, extra) => (val) => { v[k] = val; F.dirty = true; F.touched.add(k); if (extra) extra(val); rerender(); };
    const field = (k, ctl, cls) => {
      const err = errorOf(k);
      return `<div class="vfield ${err ? 'invalid' : ''} ${cls || ''}" data-mt-field="${k}"><div class="lr"><label>${LABELS[k]}</label>${REQUIRED.includes(k) ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>
        ${ctl(!!err)}<p class="msg" ${err ? 'role="alert"' : 'hidden'}>${esc(err)}</p></div>`;
    };
    const sel = (k, opts, ph, o) => field(k, (inv) => vSelect(Object.assign({ id: 'mtf-' + k, options: opts, value: k === 'type' ? typeOf(v.action) : v[k], placeholder: ph, invalid: inv, clear: true,
      onChange: change(k, o && o.after) }, o || {})));
    let general;
    if (view) {
      const ro = (k, val) => `<div class="mt-ro"><div class="k">${LABELS[k]}</div>${k === 'roles' ? chips(rolesLabels) : `<div class="mt-v clamp">${esc(val || '-')}</div>`}</div>`;
      general = `<div class="grid3">${ro('action', labelOf(actionOpts, v.action))}${ro('name', v.name)}${ro('type', labelOf(TYPES, typeOf(v.action)))}${ro('code', v.code)}
        ${ro('screen', labelOf(SCREENS, v.screen))}${ro('proc', procLabel(v.proc))}${ro('step', labelOf(stepOptions(v.proc), v.step))}${ro('form', labelOf(formOptions(v.form), v.form))}${ro('roles')}</div>`;
    } else {
      general = `<div class="grid3 mt-form">
        ${sel('action', actionOpts, 'Chọn hành động', { searchable: true })}
        ${field('name', (inv) => `<input class="vctl" data-mt-in="name" maxlength="50" placeholder="Nhập nhãn hiển thị" value="${esc(v.name)}" ${inv ? 'aria-invalid="true"' : ''}>`)}
        ${sel('type', TYPES, 'Chọn loại', { disabled: true, clear: false })}
        ${field('code', (inv) => `<input class="vctl mt-upper" data-mt-in="code" maxlength="50" placeholder="Nhập mã luật hành động" value="${esc(v.code)}" ${mode === 'edit' ? 'disabled' : ''} ${inv ? 'aria-invalid="true"' : ''}>`)}
        ${sel('screen', SCREENS, 'Chọn màn hình')}
        ${sel('proc', processOptions(), 'Chọn quy trình áp dụng', { searchable: true, after: () => { v.step = null; } })}
        ${sel('step', stepOptions(v.proc), 'Chọn bước', { searchable: true })}
        ${sel('form', formOptions(v.form), 'Chọn biểu mẫu sử dụng', { searchable: true })}
        ${sel('roles', ROLES, 'Chọn vai trò thực hiện', { multi: true, searchable: true })}</div>`;
    }
    const status = mode === 'create' ? '' : `<div class="mt-ro"><div class="k">Trạng thái</div>
      <button type="button" class="vswitch ${v.active ? 'on' : ''} ${view ? 'ro' : ''}" role="switch" aria-checked="${v.active}" aria-label="Trạng thái" ${view ? 'disabled' : 'data-mt-status'}><span></span></button></div>`;
    const preview = mode === 'create' ? '' : `<section class="vcard"><h2 class="mt-card-t">Xem trước hiển thị hành động</h2>
      <span class="mt-preview" aria-hidden="true" data-mt-preview>${esc(v.name)}</span>
      <div class="mt-ro"><div class="k">Vai trò thực hiện</div>${chips(rolesLabels)}</div></section>`;
    return `<div class="pg">
      <div class="pg-head">${headL}<div class="r">${right}</div></div>
      <section class="vcard"><h2 class="mt-card-t">Thông tin chung</h2>${general}${status}</section>
      ${preview}</div>`;
  }

  const toList = () => { location.hash = `#/${BASE}/display-rule`; };
  function showErr(k) {
    const box = document.querySelector(`[data-mt-field="${k}"]`);
    if (!box) return;
    const err = errorOf(k);
    box.classList.toggle('invalid', !!err);
    const msg = box.querySelector('.msg');
    msg.hidden = !err; msg.textContent = err;
    const inp = box.querySelector('input');
    if (inp) inp.setAttribute('aria-invalid', err ? 'true' : 'false');
  }
  async function cancel() {
    if (!F.dirty || F.route.startsWith('view')) { toList(); return; }
    const yes = await window.Catalog.confirm({ sev: 'warning', title: 'Bạn có chắc muốn hủy?', desc: 'Thông tin đã nhập sẽ không được lưu lại.', hl: '', cancel: 'Không', ok: 'Có' });
    if (yes) { F.dirty = false; toList(); }
  }
  function save() {
    const v = F.v;
    Object.keys(LABELS).forEach((k) => F.touched.add(k));
    if (Object.keys(LABELS).some((k) => errorOf(k))) { rerender(); return; }
    const [mode, id] = F.route.split('/');
    const data = { action: v.action, name: v.name.trim(), screen: v.screen, proc: v.proc, step: v.step, form: v.form, roles: v.roles.slice() };
    if (mode === 'create') {
      if (RULES.some((r) => r.code === v.code)) { toast(`<b>Lỗi</b><br>Mã luật hành động ${esc(v.code)} đã tồn tại.`, 'warn'); return; }
      RULES.unshift(Object.assign({ id: Math.max(0, ...RULES.map((r) => r.id)) + 1, code: v.code, active: true, created: TODAY, updated: TODAY }, data));
      ok('Thêm mới thành công');
    } else {
      Object.assign(byId(id), data, { active: v.active, updated: TODAY });
      ok('Cập nhật thành công');
    }
    F.dirty = false; F.route = null; L.page = 1;
    toList();
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-mt-cancel]')) { e.preventDefault(); cancel(); return; }
    if (t.closest('[data-mt-save]')) { save(); return; }
    if (t.closest('[data-mt-status]')) { F.v.active = !F.v.active; F.dirty = true; rerender(); }
  });
  /* Lưu không làm ô đang nhập mất focus trước khi click (blur đổi chiều cao form, nút dịch khỏi con trỏ). */
  document.addEventListener('mousedown', (e) => { if (e.target.closest('[data-mt-save]')) e.preventDefault(); });
  document.addEventListener('input', (e) => {
    const inp = e.target.closest('[data-mt-in]');
    if (!inp) return;
    const k = inp.dataset.mtIn;
    if (k === 'code') {
      /* autoUppercase + noSpecialLetter allowedChars="-_": bỏ dấu, chỉ giữ chữ, số, "-", "_". */
      const p = inp.selectionStart, before = inp.value.length;
      inp.value = inp.value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
      const at = Math.max(0, p - (before - inp.value.length)); inp.setSelectionRange(at, at);
    }
    F.v[k] = inp.value; F.dirty = true;
    if (F.touched.has(k)) showErr(k);
    const pv = k === 'name' && document.querySelector('[data-mt-preview]');
    if (pv) pv.textContent = inp.value;
  });
  document.addEventListener('focusout', (e) => {
    const inp = e.target.closest && e.target.closest('[data-mt-in]');
    if (!inp || !F.v) return;
    F.touched.add(inp.dataset.mtIn); showErr(inp.dataset.mtIn);
  });

  /* ---------- Router con của #/ma-tran/… ---------- */
  function route(parts) {
    const [tab, a, b] = parts;
    if (tab === 'display-rule' && a === 'create') return form('create');
    if (tab === 'display-rule' && a && (b === 'edit' || b === 'view')) return form(b, a);
    if (tab === 'bpmn-reconcile') return reconcile();
    if (tab === 'action-catalog') return a ? catalogDetail(a) : catalog();
    return list();
  }

  window.MaTran = { route, list, form, reconcile, catalog, catalogDetail, rules: () => RULES, reconRows, fillMissing, allowed, roleLabels, ACTIONS, TYPES, reset: () => { RULES = seed(); } };
})();
