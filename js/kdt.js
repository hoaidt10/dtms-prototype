/* PH09 Khoản đầu tư (plan docs/dtms/prototype-KDT-chuan-bi.md v0.3, B1–B2).
   KĐT là đối tượng cha (D-12, như ĐXMS ↔ Hồ sơ và Nhiệm vụ ↔ Hồ sơ của KHCN): SCR-54 danh sách #/kdt, SCR-55 thêm mới / chỉnh sửa
   #/kdt/create, #/kdt/<mã>/edit (không start quy trình), SCR-56 chi tiết #/kdt/<mã>. Hồ sơ Phê duyệt KĐT tạo ở Chỉnh sửa › Tạo hồ sơ
   (#/kdt/<mã>/tao-ho-so — khuôn SCR-25), Lưu = start instance MS13-TO BE; nhóm MS13 / MS14 / MS15 do hệ thống xác định sau bước 11 ‖ 12 (D-7).
   SCR-66 #/kdt/<mã>/chuyen-luong: thông báo hồ sơ chuyển luồng MS14 (P-53). Layout theo task-management. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, ty, vSelect, badge, pager, norm, toast } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => window.Screens.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" ${attrs}>${icon(ic)}</button>`;
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
  const table = (cols, rows, cell, empty) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r)}</tr>`).join('') : `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${empty || 'Chưa có dữ liệu'}</td></tr>`}</tbody></table></div>`;
  const href = (code) => 'kdt/' + encodeURIComponent(code);

  /* Nhãn danh mục (DMDC SCR-33/34/35); ô chọn chỉ có bản ghi đang hoạt động, trừ giá trị KĐT đang giữ. */
  const CAT = { field: 'linh-vuc', type: 'loai-kdt', nature: 'tinh-chat-tai-san' };
  const catLabel = (k, code) => { const r = window.Catalog.rows(CAT[k]).find((x) => x.code === code); return r ? r.name : code || ''; };
  const catOptions = (k, cur) => window.Catalog.rows(CAT[k]).filter((r) => r.active || r.code === cur).map((r) => ({ value: r.code, label: r.name }));
  const UNITS = [...new Set(D.personas.slice(0, 1).map((p) => p.unit).concat(D.kdtList.map((x) => x.unit), D.dxmsList.map((x) => x.unit)))];

  /* ---------- Trạng thái KĐT suy từ hồ sơ (§4.1). Bước → trạng thái theo cụm của BPMN MS13-TO BE (§1.2). ---------- */
  const KDT_STAGE = {
    NEW: ['Chưa có hồ sơ', 'default'], LAP: ['Đang lập', 'info'], PL: ['Chờ xác nhận phân loại', 'info'],
    GOP: ['Đang lập hồ sơ gộp', 'info'], TDGOP: ['Đang thẩm định hồ sơ gộp', 'info'],
    CT: ['Đang lập chủ trương', 'info'], TDCT: ['Đang thẩm định chủ trương', 'info'], KYCT: ['Chờ ký chủ trương', 'warning'],
    HS: ['Đang lập hồ sơ KĐT', 'info'], TDKDT: ['Đang thẩm định KĐT', 'info'], KYQD: ['Chờ ký quyết định', 'warning'], KYGOP: ['Chờ ký hồ sơ gộp', 'warning'],
    OK: ['Đã phê duyệt', 'success'], MS14: ['Chuyển MS14', 'warning'], STOP: ['Dừng theo chỉ đạo', 'default'],
  };
  const stageBadge = (s) => badge(KDT_STAGE[s][0], KDT_STAGE[s][1]);
  const CASE_ST = { processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'], moved: ['Đã chuyển luồng', 'warning'], stopped: ['Dừng theo chỉ đạo', 'default'] };
  const GROUP = D.kdtGroups;
  const BRANCH = D.kdtBranches;

  /* Tên bước: MS13 từ BPMN_FLOWS (trang MS13-TO BE); MS14 từ sơ đồ trang MS14-TO BE. Hồ sơ chưa xác định nhóm đi phần đầu MS13 (bước 1–12). */
  function stepName(c) {
    if (c.st !== 'processing') return '';
    const ks = c.tasks || [c.task];
    if (c.flow === 'MS14') {
      const g = (window.BPMN_DIAGRAMS || {})['MS14-TO BE'];
      const n = g && g.nodes.find((x) => x.k === 'task' && String(x.t) === String(c.task));
      return n ? n.name : '';
    }
    const T = window.BPMN_FLOWS.MS13.tasks;
    return ks.map((k) => (T[k] || {}).name).filter(Boolean).join(', ');
  }
  const flowLabel = (c) => (c.flow ? GROUP[c.flow] : 'Chưa xác định nhóm');

  function meta(x) {
    const hs = Flow.kdtCases().filter((c) => c.kdt === x.code).map((c) => Object.assign({ title: x.title }, c));
    const run = hs.find((c) => c.st === 'processing');
    const done = hs.find((c) => c.st === 'done');
    const last = run || done || hs[0];
    const stage = last ? last.stage : 'NEW';
    return { hs, stage, group: last ? last.flow : null, branch: last ? last.branch : null, value: done ? done.total : x.est, approved: !!done };
  }
  const rowsAll = () => Flow.kdtAll().map((x) => Object.assign({}, x, meta(x)));

  /* ---------- SCR-54 Danh sách KĐT ---------- */
  const emptyFilter = () => ({ code: '', title: '', unit: null, field: null, type: null, group: [], stage: [] });
  const L = { kw: '', adv: false, f: emptyFilter(), d: emptyFilter(), page: 1, size: 10, psOpen: false };
  function filtered() {
    const f = L.f;
    return rowsAll().filter((x) => (!L.adv
      ? !L.kw || norm(x.code + ' ' + x.title).includes(norm(L.kw))
      : (!f.code || norm(x.code).includes(norm(f.code))) && (!f.title || norm(x.title).includes(norm(f.title))) && (!f.unit || x.unit === f.unit)
        && (!f.field || x.field === f.field) && (!f.type || x.type === f.type) && (!f.group.length || f.group.includes(x.group || 'NONE'))
        && (!f.stage.length || f.stage.includes(x.stage))));
  }
  function advPanel() {
    const d = L.d;
    const set = (k) => (v) => { d[k] = v; rerender(); };
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-kf="${k}" maxlength="255" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'kf-' + k, value: d[k], clear: true, searchable: true, onChange: set(k) }, o))}</div>`;
    return `<form class="adv" data-kdt-adv>
      <div class="grid3">
        ${txt('code', 'Mã KĐT')}${txt('title', 'Tên KĐT')}
        ${sel('unit', 'Đơn vị đề xuất', { options: UNITS.map((u) => ({ value: u, label: u })) })}
        ${sel('field', 'Lĩnh vực', { searchable: false, options: catOptions('field') })}
        ${sel('type', 'Loại KĐT', { options: catOptions('type') })}
        ${sel('group', 'Nhóm KĐT', { multi: true, searchable: false, options: [{ value: 'NONE', label: 'Chưa xác định' }].concat(Object.entries(GROUP).map(([v, label]) => ({ value: v, label }))) })}
        ${sel('stage', 'Trạng thái', { multi: true, options: Object.entries(KDT_STAGE).map(([v, s]) => ({ value: v, label: s[0] })) })}
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-kl="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (như SCR-27 Danh sách ĐXMS)
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 200, 'c'], ['Mã KĐT', 150], ['Tên KĐT', 320], ['Đơn vị đề xuất', 200], ['Loại KĐT', 170],
      ['Nhóm KĐT', 170], ['Tổng mức vốn (tỷ đồng)', 170, 'r'], ['Ngày cập nhật', 140]];
    const body = rows.slice(from, from + L.size).map((x, i) => `<tr class="click" data-go="${href(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-go="${href(x.code)}/edit"`)}${x.stage === 'NEW' ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-del-kdt="${esc(x.code)}"`)}` : ''}</div></td>
        <td class="c">${stageBadge(x.stage)}</td><td><a class="link" data-go="${href(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td><td>${clamp(x.unit)}</td>
        <td>${clamp(catLabel('type', x.type))}</td><td>${x.group ? esc(x.group) : '<span class="faint">Chưa xác định</span>'}</td>
        <td class="r num">${x.value != null ? ty(x.value) : dash}</td><td class="num">${esc(x.updated)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-54', name: 'Danh sách khoản đầu tư', uc: 'UC-05-01 · WBS PH09 #172, 173 · UR-COM-01, UR-COM-09',
      notes: [
        '<b>KĐT là đối tượng cha</b> (D-12), như ĐXMS: mỗi KĐT có các hồ sơ — hồ sơ <b>Phê duyệt KĐT</b> (MS13 / MS14 / MS15) và sau này hồ sơ Điều chỉnh KĐT. Bố cục theo task-management (như Danh sách ĐXMS).',
        'Thêm mới chỉ tạo KĐT, <b>không khởi tạo quy trình</b>; không chọn quy trình (D-7). Hồ sơ tạo ở Chỉnh sửa KĐT › Danh sách hồ sơ › Tạo hồ sơ.',
        'Trạng thái KĐT suy từ hồ sơ đang xử lý (hoặc hồ sơ Hoàn thành gần nhất): Đang lập → Chờ xác nhận phân loại → nhánh gộp (Đang lập / thẩm định hồ sơ gộp) hoặc hai giai đoạn (chủ trương → hồ sơ KĐT) → Chờ ký quyết định → Đã phê duyệt; Chuyển MS14; Dừng theo chỉ đạo.',
        '<b>Nhóm KĐT</b> (MS13 / MS14 / MS15) do hệ thống xác định sau khi TTMS xác nhận 04 yếu tố (bước 12) — trước đó hiện "Chưa xác định". Tổng mức vốn = của hồ sơ Hoàn thành gần nhất, chưa có thì là tổng mức vốn dự kiến.',
        'Khác source: thêm <b>Tìm kiếm nâng cao</b> (WBS PH09 #173 "Tìm kiếm và bộ lọc nâng cao"; task-management chỉ có ô tìm kiếm). Cột Thao tác: Sửa; Xoá chỉ khi KĐT chưa có hồ sơ.',
      ],
      q: ['P-59'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách khoản đầu tư', info, right: `<button class="vbtn primary" data-go="kdt/create">${icon('add')} Thêm mới</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="kdt-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên KĐT" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-kl="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'kdt', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  document.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-pager="kdt"]')) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (L.psOpen) { L.psOpen = false; rerender(); }
    const l = t.closest('[data-kl]');
    if (l) {
      if (l.dataset.kl === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
      if (l.dataset.kl === 'reset') { L.d = emptyFilter(); L.f = emptyFilter(); L.page = 1; }
      rerender(); return;
    }
    const del = t.closest('[data-del-kdt]');
    if (!del) return;
    /* Nút nằm trong dòng có data-go: chặn listener mở chi tiết của app.js. */
    e.stopImmediatePropagation();
    const x = Flow.findKdt(del.dataset.delKdt);
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa khoản đầu tư', desc: `Bạn có chắc chắn muốn xóa khoản đầu tư ${x.title} - ${x.code} không? Thao tác này không thể hoàn tác.`,
      hl: x.title, cancel: 'Hủy', ok: 'Xóa' });
    if (!yes) return;
    Flow.deleteKdt(x.code);
    toast('<b>Thành công</b><br>Xóa khoản đầu tư thành công');
  });
  document.addEventListener('submit', (e) => {
    if (e.target.matches('[data-kdt-adv]')) { e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); }
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest('[data-kf]');
    if (f) L.d[f.dataset.kf] = f.value;
    const x = e.target.closest('[data-kx]');
    if (x) XF.v[x.dataset.kx] = x.value;
    if (e.target.id === 'kc-name') { C.name = e.target.value; }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'kdt-kw') return;
    L.kw = e.target.value.trim(); L.page = 1; rerender();
    const k = document.getElementById('kdt-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-55 Thêm mới / Chỉnh sửa KĐT ---------- */
  const XF = { mode: 'create', code: null, v: {}, err: {} };
  const tyIn = (n) => (n == null || n === '' ? '' : String(n).replace('.', ','));
  function resetForm(mode, code) {
    const x = code && Flow.findKdt(code);
    const u = persona(Flow.state.persona).unit;
    Object.assign(XF, { mode, code: code || null, err: {} });
    XF.v = x ? { title: x.title, unit: x.unit, field: x.field, type: x.type, nature: x.nature, est: tyIn(x.est), period: x.period || '', secret: x.secret ? 'Có' : 'Không', purpose: x.purpose || '' }
      : { title: '', unit: UNITS.includes(u) ? u : null, field: null, type: null, nature: null, est: '', period: '', secret: 'Không', purpose: '' };
  }
  const notFound = (title) => `<div class="pg">${head({ title, back: 'kdt', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy khoản đầu tư.</div></section></div>`;

  function form() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create / edit), như SCR-28
    const edit = XF.mode === 'edit', x = edit && Flow.findKdt(XF.code);
    if (edit && !x) return notFound('Chỉnh sửa khoản đầu tư');
    const v = XF.v, err = XF.err, back = edit ? href(XF.code) : 'kdt';
    const m = edit ? meta(x) : null;
    const lock = edit && m.stage !== 'NEW';
    const upd = (k) => (val) => { v[k] = val; delete err[k]; rerender(); };
    const txt = (k, ph, o) => `<input class="vctl" data-kx="${k}" id="k-${k}" maxlength="${(o && o.max) || 255}" placeholder="${ph}" value="${esc(v[k])}" ${err[k] ? 'aria-invalid="true"' : ''}>`;
    const cat = (k, label) => field(label, vSelect({ id: 'k-' + k, value: v[k], placeholder: 'Chọn ' + label.toLowerCase(), invalid: !!err[k], disabled: lock, options: catOptions(k, v[k]), onChange: upd(k) }), { req: true, err: err[k] });
    const info = {
      scr: 'SCR-55', name: edit ? 'Chỉnh sửa khoản đầu tư' : 'Thêm mới khoản đầu tư', uc: 'UC-05-01 · WBS PH09 #175 · UR-KDT-01, UR-KDT-02, UR-KDT-11',
      notes: [
        'Theo task-create (mode create / edit), như Thêm mới ĐXMS: card <b>Thông tin chung KĐT</b>. Lưu chỉ tạo / cập nhật KĐT, <b>không khởi tạo quy trình</b> (D-12); về Danh sách KĐT. Mã KĐT tự sinh.',
        '<b>Không có trường Quy trình</b> (D-7): Lĩnh vực, Loại KĐT, Tính chất tài sản là 3 trong 04 yếu tố phân luồng (lấy từ Danh mục dùng chung); yếu tố thứ tư là tổng mức vốn thực tế sau báo giá. Hệ thống xác định nhóm MS13 / MS14 / MS15 và nhánh gộp BM-00 sau khi TTMS xác nhận ở bước 12.',
        'Tổng mức vốn dự kiến là giá trị ban đầu; tổng mức vốn hiệu lực lấy từ hồ sơ Hoàn thành gần nhất.',
      ].concat(edit ? ['Khi KĐT đã có hồ sơ, 3 yếu tố phân luồng bị khoá (hồ sơ giữ giá trị lúc TTMS xác nhận). Card <b>Danh sách hồ sơ</b> có nút <b>Tạo hồ sơ</b> như source (chỉ ở mode edit).'] : []),
      q: ['P-51', 'P-59'], src: 'task-management/components/task-create · /task-management/' + (edit ? 'edit/:id' : 'create'),
    };
    return `<form class="pg" data-kdt-form>
      ${head({ title: edit ? 'Chỉnh sửa khoản đầu tư' : 'Thêm mới khoản đầu tư', back, lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="k-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung KĐT</h3>
        <div class="grid3">
          ${field('Mã KĐT', `<input class="vctl" placeholder="Hệ thống tự sinh" value="${esc(XF.code || '')}" disabled>`)}
          ${field('Tên KĐT', txt('title', 'Nhập tên khoản đầu tư', { max: 500 }), { req: true, err: err.title, cls: 'span2' })}
          ${field('Đơn vị đề xuất', vSelect({ id: 'k-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit, options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd('unit') }), { req: true, err: err.unit })}
          ${cat('field', 'Lĩnh vực')}${cat('type', 'Loại KĐT')}${cat('nature', 'Tính chất tài sản')}
          ${field('Tổng mức vốn dự kiến (tỷ đồng)', txt('est', 'Nhập tổng mức vốn dự kiến'), { err: err.est })}
          ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 12/2027'))}
          ${field('Mật', vSelect({ id: 'k-sec', value: v.secret, options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd('secret') }))}
          ${field('Người tạo', `<input class="vctl" value="${esc(edit ? x.creator || '' : persona(Flow.state.persona).name)}" disabled>`)}
          ${field('Mục tiêu', `<textarea class="vctl ta" data-kx="purpose" id="k-purpose" maxlength="2000" placeholder="Nhập mục tiêu đầu tư">${esc(v.purpose)}</textarea>`, { cls: 'span3' })}
        </div></section>
      ${edit ? casesCard(x, true) + docsCard(x) : ''}</form>`;
  }

  function save() {
    ['title', 'est', 'period', 'purpose'].forEach((k) => { const el = document.getElementById('k-' + k); if (el) XF.v[k] = el.value; });
    const v = XF.v, err = XF.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên KĐT.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
    if (!v.field) err.field = 'Bạn cần chọn Lĩnh vực.';
    if (!v.type) err.type = 'Bạn cần chọn Loại KĐT.';
    if (!v.nature) err.nature = 'Bạn cần chọn Tính chất tài sản.';
    const est = v.est.trim() === '' ? null : Number(v.est.trim().replace(/\./g, '').replace(',', '.'));
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Tổng mức vốn dự kiến không đúng định dạng.';
    if (Object.keys(err).length) { rerender(); return; }
    const data = { title: v.title.trim(), unit: v.unit, field: v.field, type: v.type, nature: v.nature, est, period: v.period.trim(), secret: v.secret === 'Có', purpose: v.purpose.trim() };
    if (XF.mode === 'edit') { Flow.updateKdt(XF.code, data); toast('<b>Thành công</b><br>Cập nhật khoản đầu tư thành công!'); } else { Flow.createKdt(data); toast('<b>Thành công</b><br>Thêm mới khoản đầu tư thành công!'); }
    location.hash = '#/kdt';
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-kdt-form]')) { e.preventDefault(); save(); } });

  /* Danh sách hồ sơ của KĐT (TASK_PROFILE_COLUMNS + Loại hồ sơ, Nhóm KĐT). Mã hồ sơ mở Chi tiết hồ sơ KĐT (SCR-20, #/ho-so-kdt/<mã>);
     hồ sơ đã chuyển luồng có liên kết "Kết thúc — đã chuyển luồng" mở Thông báo chuyển luồng (SCR-66). */
  const caseLink = (code) => `<a class="link" data-go="ho-so-kdt/${encodeURIComponent(code)}">${esc(code)}</a>`;
  function casesCard(x, edit) {
    const hs = meta(x).hs;
    const cols = [['Mã Camunda', 160], ['Mã hồ sơ', 150], ['Loại hồ sơ', 150], ['Nhóm KĐT', 200], ['Nhánh hồ sơ', 220], ['Bước hiện tại', 260], ['Ngày tạo', 130], ['Trạng thái', 169, 'c']];
    return `<section class="vcard" data-kdt-profiles><div class="vcard-h"><h3>Danh sách hồ sơ</h3>${edit ? `<button type="button" class="vbtn red" data-go="${href(x.code)}/tao-ho-so">Tạo hồ sơ</button>` : ''}</div>
      ${table(cols, hs, (c) => `<td class="num">${esc(window.QuyTrinh.camundaKey(c.code))}</td><td>${caseLink(c.code)}</td><td>${c.kind === 'PD' ? 'Phê duyệt KĐT' : 'Điều chỉnh KĐT'}</td>
        <td>${esc(flowLabel(c))}</td><td>${c.branch ? esc(BRANCH[c.branch]) : dash}</td><td>${c.st === 'moved' ? `<a class="link" data-go="${href(x.code)}/chuyen-luong">${esc('Kết thúc — đã chuyển luồng' + (c.replacedBy ? ' (' + c.replacedBy + ')' : ''))}</a>`
          : clamp(stepName(c) || (c.st === 'done' ? 'Kết thúc — đã phê duyệt' : c.st === 'stopped' ? 'Kết thúc theo chỉ đạo' : ''))}</td>
        <td class="num">${esc(c.created)}</td><td class="c">${badge(CASE_ST[c.st][0], CASE_ST[c.st][1])}</td>`)}</section>`;
  }
  const DOC_NAME = { 'BM-00': 'Hồ sơ chủ trương và KĐT (văn bản gộp)', 'BM-01': 'Tờ trình phê duyệt chủ trương KĐT', 'BM-14': 'Báo cáo kết quả thẩm định KĐT', 'BM-18': 'Quyết định phê duyệt KĐT' };
  function docsCard(x) {
    const rows = [];
    meta(x).hs.forEach((c) => (c.docs || []).forEach(([code, at]) => rows.push({ name: `${code} ${DOC_NAME[code] || ''}`.trim(), at, c })));
    return `<section class="vcard"><h3>Tài liệu đính kèm</h3>
      ${table([['Thao tác', 80, 'c'], ['Tên tài liệu', 340], ['Mã hồ sơ', 160], ['Ngày tạo', 150], ['Ngày cập nhật', 150]], rows, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
        <td><span class="clamp">${esc(r.name)}</span></td><td>${esc(r.c.code)}</td><td class="num">${esc(r.at)}</td><td class="num">${esc(r.at)}</td>`)}</section>`;
  }

  /* ---------- SCR-56 Chi tiết KĐT ---------- */
  function detail(code) {
    // Theo: task-create (mode detail), như SCR-29 Chi tiết ĐXMS
    const x = Flow.findKdt(code);
    if (!x) return notFound('Xem chi tiết khoản đầu tư');
    const m = meta(x);
    const info = {
      scr: 'SCR-56', name: 'Chi tiết khoản đầu tư', uc: 'UC-05-01 · WBS PH09 #174, 180',
      notes: [
        'Theo task-create (mode detail): nút <b>Chỉnh sửa</b> trên hàng tiêu đề; cards Thông tin chung KĐT · <b>Danh sách hồ sơ</b> · Tài liệu đính kèm. Nút Tạo hồ sơ chỉ có ở Chỉnh sửa (như source).',
        'Nhóm KĐT và Nhánh hồ sơ lấy từ hồ sơ gần nhất — hệ thống xác định sau bước 12 (D-7). Trạng thái suy từ hồ sơ. Tổng mức vốn hiệu lực = của hồ sơ Hoàn thành gần nhất.',
        'Mã hồ sơ trong Danh sách hồ sơ mở <b>Chi tiết hồ sơ</b> (khuôn profile-detail: Quy trình MS13, Lịch sử, văn bản đầu ra, Xem BPMN MS13-TO BE tô bước hiện tại); quay lại về màn này. Hồ sơ đã chuyển luồng: bấm "Kết thúc — đã chuyển luồng" mở Thông báo chuyển luồng.',
        'KĐT đã phê duyệt (BM-18 hoặc BM-00 đã ký): nút <b>Lập KHLCNT</b> mở Thêm mới KHLCNT chọn sẵn KĐT (T16 B2; thay nút Tạo gói thầu mờ — gói thầu là dòng của KHLCNT). Tài liệu đính kèm gồm văn bản đầu ra của hồ sơ (BM-01, BM-14, BM-18 / BM-00).',
      ].concat(window.KdtB2.TAB_INFO),
      q: ['P-59'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id',
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết khoản đầu tư', back: 'kdt', lg: true, info, right: `<div class="row">${m.approved && !window.Thau.khBy('KDT', x.code).length ? `<button type="button" class="vbtn secondary" data-go="khlcnt/create/KDT/${encodeURIComponent(x.code)}">Lập KHLCNT</button>` : ''}<button type="button" class="vbtn primary" data-go="${href(x.code)}/edit">Chỉnh sửa</button></div>` })}
      ${window.Ycbg.tabs(x.code, `<section class="vcard pad24 gen"><h3>Thông tin chung KĐT</h3><div class="ginfo c3">
        ${kv('Mã KĐT', esc(x.code))}${kv('Tên KĐT', esc(x.title), 'span2')}
        ${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Người tạo', esc(x.creator))}${kv('Trạng thái', stageBadge(m.stage))}
        ${kv('Lĩnh vực', esc(catLabel('field', x.field)))}${kv('Loại KĐT', esc(catLabel('type', x.type)))}${kv('Tính chất tài sản', esc(catLabel('nature', x.nature)))}
        ${kv('Nhóm KĐT', m.group ? esc(GROUP[m.group]) : 'Chưa xác định')}${kv('Nhánh hồ sơ', m.branch ? esc(BRANCH[m.branch]) : null)}${kv('Tổng mức vốn hiệu lực', m.value != null ? ty(m.value) + ' tỷ đồng' : null)}
        ${kv('Tổng mức vốn dự kiến', x.est != null ? ty(x.est) + ' tỷ đồng' : null)}${kv('Thời gian thực hiện', esc(x.period))}${kv('Mật', x.secret ? 'Có' : 'Không')}
        ${kv('Ngày cập nhật', esc(x.updated))}
        ${kv('Mục tiêu', esc(x.purpose), 'span3')}</div></section>
      ${casesCard(x, false)}${docsCard(x)}`, window.KdtB2.tabOpt)}</div>`;
  }

  /* ---------- Thêm mới hồ sơ KĐT (khuôn SCR-25 / profile-form, ô KĐT khoá như route create/:taskId) ---------- */
  const C = { kdt: null, kind: 'PD', name: '', err: {} };
  function resetCase(code) { const x = Flow.findKdt(code); Object.assign(C, { kdt: code, kind: 'PD', name: x ? x.title : '', err: {} }); }
  /* Lý do không tạo được hồ sơ Phê duyệt cho KĐT, hoặc null (như R1, R2 của ĐXMS). */
  function block(x) {
    const m = meta(x);
    if (m.hs.some((c) => c.st === 'processing')) return 'Khoản đầu tư đang có hồ sơ đang xử lý.';
    if (m.approved) return 'Khoản đầu tư đã được phê duyệt. Hồ sơ Điều chỉnh KĐT làm ở đợt sau.';
    return null;
  }
  function caseCreate(code) {
    const x = Flow.findKdt(code);
    if (!x) return notFound('Thêm mới hồ sơ');
    const back = href(code) + '/edit';
    const info = {
      scr: 'SCR-25', name: 'Thêm mới hồ sơ (khoản đầu tư)', uc: 'UC-05-01 · WBS PH09 #175, 176; PH02 #29, 30 · UR-KDT-11', bpmn: 'Ngoài BPMN — trước bước 01 (MS13-TO BE)',
      notes: [
        'Dùng lại khuôn Thêm mới hồ sơ (profile-form): ô <b>Khoản đầu tư</b> khoá vì mở từ nút Tạo hồ sơ của KĐT.',
        'Loại hồ sơ <b>Phê duyệt KĐT</b>; Điều chỉnh KĐT (MS13.02/.04, MS14.02/.04) chưa có BPMN TO-BE nên chưa chọn được.',
        '<b>Quy trình không chọn tay</b> (D-7): Lưu = khởi tạo quy trình MS13-TO BE, mở ngay bước 01 (giao người tạo); hệ thống xác định nhóm MS13 / MS14 / MS15 và nhánh gộp BM-00 / hai giai đoạn sau khi chốt tổng mức vốn (bước 10), Ban Tài chính xác nhận TSCĐ (bước 11) và TTMS xác nhận 04 yếu tố (bước 12). Khác cách tạo hồ sơ ĐXMS (chọn MS01.01/.02/.03 lúc tạo).',
        'Prototype chạy một hồ sơ tại một thời điểm: hồ sơ đang chạy trước đó (ĐXMS hoặc KĐT) được thay; hồ sơ KĐT cũ giữ lại ở bước đang chờ trong danh sách hồ sơ của KĐT đó.',
        'Luật: một KĐT chỉ có một hồ sơ đang xử lý; hồ sơ Phê duyệt chỉ khi KĐT chưa được phê duyệt. Không thoả thì báo dưới ô Loại hồ sơ.',
      ],
      q: ['P-59', 'P-53'], src: 'profile-management/profile-form (mode create) · /khcn-profile-management/create/:taskId',
    };
    return `<form class="pg" data-kdt-case-form>
      ${head({ title: 'Thêm mới hồ sơ', back, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="kc-save">Lưu</button>` })}
      <section class="vcard"><h2>Thông tin chung</h2>
        <div class="grid3">
          ${field('Mã hồ sơ', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên hồ sơ', `<input class="vctl" id="kc-name" maxlength="500" placeholder="Nhập tên hồ sơ" value="${esc(C.name)}" ${C.err.name ? 'aria-invalid="true"' : ''}>`, { req: true, err: C.err.name, cls: 'span2' })}
          ${field('Loại hồ sơ', vSelect({ id: 'kc-kind', value: C.kind, invalid: !!C.err.kind, options: [{ value: 'PD', label: 'Phê duyệt KĐT' }, { value: 'DC', label: 'Điều chỉnh KĐT', disabled: true }],
    onChange: (val) => { C.kind = val; delete C.err.kind; rerender(); } }), { req: true, err: C.err.kind })}
          ${field('Quy trình', '<input class="vctl" id="kc-proc" value="MS13 · MS14 · MS15 — hệ thống xác định sau bước 12" disabled>')}
          ${field('Khoản đầu tư', vSelect({ id: 'kc-kdt', value: code, disabled: true, options: [{ value: code, label: `${x.code} - ${x.title}` }] }), { req: true })}
          ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section></form>`;
  }
  function saveCase() {
    const t = document.getElementById('kc-name');
    if (t) C.name = t.value;
    C.err = {};
    const x = Flow.findKdt(C.kdt);
    if (!C.name.trim()) C.err.name = 'Bạn cần nhập Tên hồ sơ.';
    if (block(x)) C.err.kind = block(x);
    if (Object.keys(C.err).length) { rerender(); return; }
    Flow.createKdtCase({ kdt: C.kdt, name: C.name.trim() });
    toast('Thêm mới thành công');
    /* Như Thêm mới hồ sơ ĐXMS (SCR-25): Lưu = start quy trình, mở ngay việc đầu tiên của người tạo. */
    const tok = Flow.state.tokens.find((t) => t.who === Flow.state.persona) || Flow.state.tokens[0];
    location.hash = tok ? '#/task/' + tok.id : '#/' + href(C.kdt) + '/edit';
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-kdt-case-form]')) { e.preventDefault(); saveCase(); } });

  /* ---------- SCR-66 Thông báo chuyển luồng (cổng "Tổng mức vốn thực tế thuộc MS13?" = Không, P-53) ----------
     Hồ sơ MS13 kết thúc "Đã chuyển luồng", hồ sơ mới của cùng KĐT theo MS14 (luồng MS14 chưa dựng — bước hiện tại lấy từ sơ đồ MS14-TO BE). */
  function moved(code) {
    // Theo: profile-management/profile-detail (card Thông tin chung + bảng) — source không có màn tương đương riêng
    const x = Flow.findKdt(code);
    if (!x) return notFound('Thông báo chuyển luồng');
    const hs = meta(x).hs, old = hs.find((c) => c.st === 'moved');
    const info = {
      scr: 'SCR-66', name: 'Thông báo chuyển luồng MS14 / MS15', uc: 'UC-05-01 · WBS PH09 #176; PH02 #30 · UR-KDT-06', bpmn: 'Cổng "Tổng mức vốn thực tế thuộc MS13?" = Không → ô "MS14,15 – Chuyển xử lý" (MS13-TO BE)',
      notes: [
        'Tổng mức vốn thực tế sau báo giá không thuộc ngưỡng MS13 của lĩnh vực: hồ sơ MS13 kết thúc ở trạng thái <b>Đã chuyển luồng</b>, hệ thống tạo <b>hồ sơ mới của cùng KĐT</b> theo nhóm đúng và liên kết hai hồ sơ (mặc định P-53, như 10b của ĐXMS).',
        'Đích của nhánh trong BPMN là ô chữ "MS14,15 – Chuyển xử lý", không phải sự kiện kết thúc (plan KĐT §1.2a mục 7). Dữ liệu căn cứ, danh mục, báo giá, kết quả xác nhận được sao chép sang hồ sơ mới.',
        'Luồng MS14 chưa dựng trên prototype (đợt 2): hồ sơ mới hiện bước đầu tiên theo sơ đồ MS14-TO BE. Source không có màn tương đương — bố cục theo profile-detail (card Thông tin chung + bảng).',
      ],
      q: ['P-53'], src: 'profile-management/profile-detail (bố cục) · —',
    };
    const kvs = (k, v, cls) => kv(k, v, cls);
    if (!old) {
      return `<div class="pg">${head({ title: 'Thông báo chuyển luồng', back: href(code), lg: true, info })}
        <section class="vcard pad24"><div class="empty-t">Khoản đầu tư chưa có hồ sơ chuyển luồng.</div></section></div>`;
    }
    const nw = hs.find((c) => c.replaces === old.code) || hs.find((c) => c.code === old.replacedBy) || null;
    const live = old.live && Flow.state.kdt === code;
    const r = live ? Flow.kdtCheck() : null;
    const by = (n) => { const h = live && Flow.lastOf(n); return h ? `OK — ${esc(persona(h.who).name)}, ${Flow.dateOf(h.t)}` : null; };
    const th = r && r.ms13 ? `${catLabel('field', r.ms13.field)}: dưới ${ty(r.ms13.to, 0)} tỷ đồng` : null;
    const to = nw ? nw.flow : 'MS14';
    return `<div class="pg">
      ${head({ title: 'Thông báo chuyển luồng', back: href(code), lg: true, info })}
      <section class="vcard pad24 gen"><h3>Hồ sơ đã chuyển luồng</h3>
        <div class="banner-bad">Tổng mức vốn thực tế ${old.total != null ? ty(old.total) + ' tỷ đồng ' : ''}không thuộc ngưỡng khoản đầu tư đơn giản (MS13). Hồ sơ ${esc(old.code)} đã kết thúc và chuyển xử lý theo ${esc(GROUP[to] || to)}.</div>
        <div class="ginfo c3">
        ${kvs('Mã hồ sơ', esc(old.code))}${kvs('Tên hồ sơ', esc(old.title || x.title), 'span2')}
        ${kvs('Mã KĐT', `<a class="link-red" href="#/${href(code)}">${esc(code)}</a>`)}${kvs('Lĩnh vực', esc(catLabel('field', x.field)))}${kvs('Trạng thái', badge(CASE_ST.moved[0], CASE_ST.moved[1]))}
        ${kvs('Tổng mức vốn thực tế (gồm VAT)', old.total != null ? ty(old.total) + ' tỷ đồng' : null)}${kvs('Ngưỡng MS13 áp dụng', th ? esc(th) : null)}${kvs('Nhóm khoản đầu tư', esc(GROUP[to] || to))}
        ${kvs('Xác nhận hình thành TSCĐ', by(11))}${kvs('Xác nhận 04 yếu tố', by(12))}${kvs('Ngày chuyển luồng', esc(old.updated))}</div></section>
      <section class="vcard"><h3>Hồ sơ mới</h3>
        ${table([['Mã hồ sơ', 150], ['Loại hồ sơ', 150], ['Nhóm KĐT', 220], ['Bước hiện tại', 300], ['Ngày tạo', 130], ['Trạng thái', 150, 'c']], nw ? [nw] : [], (c) => `<td>${caseLink(c.code)}</td><td>Phê duyệt KĐT</td>
          <td>${esc(flowLabel(c))}</td><td>${clamp(stepName(c))}</td><td class="num">${esc(c.created)}</td><td class="c">${badge(CASE_ST[c.st][0], CASE_ST[c.st][1])}</td>`)}</section></div>`;
  }

  /* Router: #/kdt, #/kdt/create, #/kdt/<mã>, #/kdt/<mã>/edit, #/kdt/<mã>/tao-ho-so, #/kdt/<mã>/chuyen-luong. enter() khi đổi route (form mở trống / nạp bản ghi). */
  function route(parts) {
    const [b, c] = parts;
    if (!b) return list();
    if (b === 'create') return form();
    const code = decodeURIComponent(b);
    if (c === 'edit') return form();
    if (c === 'tao-ho-so') return caseCreate(code);
    if (c === 'chuyen-luong') return moved(code);
    return detail(code);
  }
  function enter(parts) {
    const [b, c] = parts;
    if (b === 'create') resetForm('create');
    else if (b && c === 'edit') resetForm('edit', decodeURIComponent(b));
    else if (b && c === 'tao-ho-so') resetCase(decodeURIComponent(b));
  }

  window.Kdt = { route, enter, meta, stepName, KDT_STAGE };
})();
