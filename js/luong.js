/* T17 — Phương án Gộp menu "Luồng mua sắm" (ĐXMS + Hồ sơ), plan docs/dtms/prototype-T17-luong-mua-sam-chuan-bi.md v0.2.
   T34 (D-90): chỉ còn phương án Gộp (công tắc Tách / Gộp D-25 đã bỏ). Gộp thay hai mục Đề xuất mua sắm / Hồ sơ đề xuất mua sắm bằng một mục Luồng mua sắm; dữ liệu vẫn
   là ĐXMS cha + hồ sơ con (Locked decision D-10…D-12). SCR-95 Danh sách luồng #/luong, SCR-96 Tạo luồng #/luong/create: Lưu = tạo ĐXMS + hồ sơ
   Phê duyệt + start (D-26); căn cứ đầu vào = tệp đính kèm có Loại tài liệu căn cứ (D-30); nhân sự chỉ định theo bước của quy trình (D-27).
   Layout theo task-management (danh sách) và task-create (Thông tin chung, Nhân sự khởi tạo / thẩm định, Tài liệu đính kèm). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, ty, vSelect, badge, pager, norm, toast } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => window.Screens.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" ${attrs}>${icon(ic)}</button>`;
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const table = (cols, rows, cell, empty) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r, i)}</tr>`).join('') : `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${empty || 'Chưa có dữ liệu'}</td></tr>`}</tbody></table></div>`;

  /* ---------- Công tắc phương án (D-25) — lưu theo trình duyệt, không thuộc trạng thái luồng ---------- */
  /* T34 (người dùng 09/11, D-90): BỎ PHƯƠNG ÁN TÁCH — luôn Gộp; công tắc Tách / Gộp (D-25) và menu theo phương án comment lại. */
  function isGop() { return true; }
  function setMode() { /* T34: không còn phương án Tách */ }
  function menu() { return D.menu; }
  // [T34 bỏ Tách]   const MODE_KEY = 'dtms-proto-menu';
  // [T34 bỏ Tách]   let mode = 'tach';
  // [T34 bỏ Tách]   /* Đọc lại mỗi lần: storage có thể đổi mà trang không tải lại (chỉ đổi hash). */
  // [T34 bỏ Tách]   /* T33: bản gửi khách chèn <meta name="proto-menu" content="gop"> (khách đã chọn phương án Gộp) — mặc định khi người xem chưa tự chọn. */
  // [T34 bỏ Tách]   const DEF_MODE = ((document.querySelector('meta[name="proto-menu"]') || {}).content === 'gop') ? 'gop' : 'tach';
  // [T34 bỏ Tách]   function isGop() {
  // [T34 bỏ Tách]     try { const v = localStorage.getItem(MODE_KEY); mode = v === 'gop' || v === 'tach' ? v : DEF_MODE; } catch (e) { mode = DEF_MODE; }
  // [T34 bỏ Tách]     return mode === 'gop';
  // [T34 bỏ Tách]   }
  // [T34 bỏ Tách]   function setMode(m) {
  // [T34 bỏ Tách]     mode = m === 'gop' ? 'gop' : 'tach';
  // [T34 bỏ Tách]     try { localStorage.setItem(MODE_KEY, mode); } catch (e) { /* bỏ qua */ }
  // [T34 bỏ Tách]   }
  // [T34 bỏ Tách]   /* Menu theo phương án: Gộp thay hai mục ĐXMS / Hồ sơ của nhóm Quản lý đề xuất mua sắm bằng Luồng mua sắm; route cũ vẫn mở được. */
  // [T34 bỏ Tách]   function menu() {
  // [T34 bỏ Tách]     if (!isGop()) return D.menu;
  // [T34 bỏ Tách]     return D.menu.map((g) => ((g.children || []).some((k) => k.path === 'dxms')
  // [T34 bỏ Tách]       ? Object.assign({}, g, { children: g.children.filter((k) => k.path === 'de-tai').concat([{ label: 'Luồng mua sắm', path: 'luong', scr: 'SCR-95' }],
  // [T34 bỏ Tách]         g.children.filter((k) => k.path === 'dieu-chinh-dxms'), g.children.filter((k) => k.path === 'quan-ly-ho-so'),
  // [T34 bỏ Tách]         g.children.filter((k) => !['de-tai', 'dxms', 'dieu-chinh-dxms', 'ho-so-dxms', 'quan-ly-ho-so'].includes(k.path))) })
  // [T34 bỏ Tách]       : g));
  // [T34 bỏ Tách]   }

  /* ---------- Các bước người dùng của quy trình (D-27): mỗi bước thuộc một vai trò theo quy trình, bỏ bước không áp dụng ----------
     CQCM chọn ở task 16 theo quy trình, Tập đoàn giả lập → không chỉ định ở đây. Thật: đọc User Task (elementId, name, candidateUsers = roleCode)
     của BPMN đã deploy. */
  const SKIP = ['R-CQCM', 'R-CQCM-CH'];
  const num = (k) => parseFloat(String(k));
  const stepNo = (k) => (/^\d+$/.test(k) ? k.padStart(2, '0') : k);
  function tasksOf(process) {
    if (!process) return [];
    const fam = D.familyOf(process), F = D.flows[fam], T = fam === 'MS01' ? window.BPMN_TASKS : window.BPMN_FLOWS[fam].tasks;
    const na = (D.notApplicable[process] || []).map(String), out = new Map();
    const push = (task, who) => {
      const k = String(task);
      if (!who || who.startsWith('cqcm:') || na.includes(k) || out.has(k) || !T[task] || T[task].type === 'service') return;
      const p = persona(who);
      if (!p || p.all || p.simulated || SKIP.includes(p.urd)) return;
      out.set(k, { key: k, name: T[task].name, role: p.urd, roleName: p.role, def: who });
    };
    Object.entries(F).forEach(([k, f]) => {
      if (f.who) push(k, f.who);
      (f.forkTo || []).concat(f.also || []).forEach((b) => push(b.task, b.who));
    });
    return [...out.values()].sort((a, b) => num(a.key) - num(b.key) || a.key.localeCompare(b.key));
  }
  /* Vai trò có bước trong quy trình (theo thứ tự bước đầu tiên). */
  function rolesOf(process) {
    const out = new Map();
    tasksOf(process).forEach((t) => {
      if (!out.has(t.role)) out.set(t.role, { code: t.role, name: t.roleName, def: t.def, tasks: [] });
      out.get(t.role).tasks.push(t.key);
    });
    return [...out.values()];
  }

  /* ---------- Loại tài liệu căn cứ (DMDC SCR-99, D-30) ---------- */
  const TARGET = { DXMS: 'ĐXMS', PD: 'Hồ sơ Phê duyệt' };
  const basisTypes = () => window.Catalog.rows('loai-tai-lieu-can-cu').filter((r) => r.active && (r.scope || []).some((s) => TARGET[s]));
  const typeOf = (code) => window.Catalog.rows('loai-tai-lieu-can-cu').find((r) => r.code === code) || null;
  const targetsOf = (code) => ((typeOf(code) || {}).scope || []).filter((s) => TARGET[s]);

  /* ---------- SCR-95 Danh sách luồng ---------- */
  /* Tìm kiếm nâng cao (SRS DTMS_CN_0135 #3–#9 + T29 F1, F2 theo HT-DXMS-NOTE màn 6): f = đã áp, d = đang nhập; hai kiểu tìm độc lập như profile-list. */
  const emptyF = () => ({ code: '', title: '', nv: null, block: null, unit: null, creator: null, st: [], priority: null, secret: null, created: '', kind: null });
  /* [T37 RV-PROTO-0911 #1] Loại ĐXMS: Điều chỉnh = có adjFrom (D-85); còn lại (gồm Sao chép, P-226) = Tạo mới. */
  const KINDS = ['Tạo mới', 'Điều chỉnh'];
  const kindOf = (x) => (x.adjFrom ? 'Điều chỉnh' : 'Tạo mới');
  const L = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false };
  const href = (code) => 'luong/' + encodeURIComponent(code);
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m.padStart(2, '0')}${d.padStart(2, '0')}` : ''; };
  /* T29 B12 (RV-PROTO-0511 #2): Ngày tạo một trường "từ – đến"; một ngày thì lọc từ ngày đó. */
  const rangeOf = (s) => { const m = String(s || '').match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || []; return [m[0] || '', m[1] || '']; };
  const S5 = () => window.Screens.s5;
  function rows() {
    const cases = window.Screens.allCases(), f = L.f;
    return Flow.dxmsAll().map((x) => {
      const m = window.Screens.dxmsMeta(x, cases);
      const run = m.hs.find((c) => c.st === 'processing') || m.hs[0] || null;
      const live = run && run.live && Flow.state.status === 'running';
      const who = live ? [...new Set(Flow.state.tokens.flatMap((t) => t.cands || [t.who]))].map((id) => persona(id).name).join(', ') : '';
      /* T45 V0.4 SRS 12 3.1.3: ed = Sửa / Xóa được (người thực hiện việc Lập), ret = bị Chỉ huy ĐVĐX trả lại ở 5.1. */
      const ls = lapState(x.code);
      return Object.assign({}, x, { state: m.state, run, who, ed: editOf(x, m.state), ret: !!(ls && ls.returned) });
    }).filter((x) => (!L.adv ? !L.kw || norm(`${x.code} ${x.title}`).includes(norm(L.kw))
      : ((fr, to) => (!fr || dk(x.created) >= dk(fr)) && (!to || dk(x.created) <= dk(to)))(...rangeOf(f.created))
        && (!f.code || norm(x.code).includes(norm(f.code))) && (!f.kind || kindOf(x) === f.kind) && (!f.title || norm(x.title).includes(norm(f.title))) && (!f.nv || x.nv === f.nv)
        && (!f.block || D.blockOf(x.unit) === f.block) && (!f.unit || x.unit === f.unit) && (!f.creator || x.creator === f.creator)
        && (!f.st.length || f.st.includes(x.state)) && (!f.priority || x.priority === f.priority) && (!f.secret || (f.secret === 'Có') === !!x.secret)));
  }
  function advPanel() {
    const d = L.d, S = window.Screens.DXMS_STATUS;
    const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-lgf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'lgf-' + k, value: d[k], clear: true, searchable: true, onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
    return `<form class="adv" data-lgadv><div class="grid3">
        ${txt('code', 'Mã ĐXMS', 'Nhập mã ĐXMS')}${txt('title', 'Tên đề xuất mua sắm', 'Nhập tên đề xuất mua sắm')}
        ${sel('kind', 'Loại ĐXMS', { searchable: false, placeholder: 'Tất cả', options: KINDS.map((k) => ({ value: k, label: k })) })}
        ${sel('nv', 'Đề tài / dự án', { placeholder: 'Chọn đề tài / dự án', options: D.nhiemVu.map((v) => ({ value: v.code, label: `${v.code} — ${v.name}` })) })}
        ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
    onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị đề xuất', { placeholder: 'Chọn đơn vị đề xuất', options: S5().unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
        ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: S5().creators().map((u) => ({ value: u, label: u })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, placeholder: 'Tất cả trạng thái', options: Object.entries(S).map(([value, [label]]) => ({ value, label })) })}
        ${sel('priority', 'Mức ưu tiên', { searchable: false, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })) })}
        ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
        ${txt('created', 'Ngày tạo', 'DD/MM/YYYY – DD/MM/YYYY')}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-lg="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html
    const all = rows(), pages = Math.max(1, Math.ceil(all.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const S = window.Screens.DXMS_STATUS;
    const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 250, 'c'], ['Mã ĐXMS', 170], ['Loại ĐXMS', 120], ['Tên đề xuất mua sắm', 280], ['Đề tài / dự án', 260], ['Đợt', 70, 'c'],
      ['Quy trình', 100], ['Bước hiện tại', 220], ['Người đang xử lý', 180], ['Đơn vị đề xuất', 180], ['Người tạo', 170], ['Ngày cập nhật', 140]];
    const body = all.slice(from, from + L.size).map((x, i) => `<tr class="click" data-go="${href(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${x.ed ? `${iconBtn('edit', 'Sửa', `data-go="${x.ed.go}" data-lg-edit="${esc(x.code)}"`)}<span class="sep"></span>${iconBtn('del', 'Xóa', `data-lg-del="${esc(x.code)}"`)}` : ''}</div></td>
        <td class="c"><div class="lg-st">${badge(S[x.state][0], S[x.state][1])}${x.ret ? `<span data-lg-ret>${badge('Bị trả lại', 'warning')}</span>` : ''}</div></td><td><a class="link" data-go="${href(x.code)}">${esc(x.code)}</a></td><td data-kind>${kindOf(x)}</td><td>${clamp(x.title)}</td>
        <td>${clamp(S5().nvText(x.nv))}</td><td class="c">${S5().dotOf(x) || dash}</td>
        <td>${clamp(x.run && (x.run.flowLabel || x.run.flow))}</td>
        <td>${clamp(x.run && x.run.step)}</td><td>${clamp(x.who)}</td><td>${clamp(x.unit)}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-95', name: 'Danh sách đề xuất mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20',
      notes: [
        '<b>T45 — SRS 12 V0.4 mục 3.1.3 (DTMS_CN_0138):</b> icon <b>Sửa</b>, <b>Xóa</b> chỉ hiện với ĐXMS Tạo mới đang ở việc Lập đề xuất mua sắm — chưa gửi (Chưa khởi tạo) hoặc bị Chỉ huy ĐVĐX <b>Trả lại</b> ở bước 5.1 — và người xem là người thực hiện việc đó (ĐXMS mẫu chưa có hồ sơ: người tạo). Sửa mở lại màn Lập; Xóa = xóa mềm, hủy quy trình và việc đang mở, trả phần dự toán. ĐXMS bị trả lại giữ Đang phê duyệt, thêm tag <b>Bị trả lại</b> (câu hỏi DTMS_Q_0548, 0549). Trước T45 icon Sửa hiện ở mọi dòng và mở Chi tiết.',
        '<b>T37 (RV-PROTO-0911 #1):</b> thêm <b>Loại ĐXMS</b> (Tạo mới / Điều chỉnh) ở Tìm kiếm nâng cao và cột sau Mã ĐXMS. Điều chỉnh = ĐXMS tạo từ Điều chỉnh ĐXMS (có Điều chỉnh từ); ĐXMS Sao chép (P-226) là Tạo mới.',
        '<b>Phương án Gộp (T17 D-25)</b>: một mục <b>Luồng mua sắm</b> thay hai mục Đề xuất mua sắm và Hồ sơ đề xuất mua sắm. <b>T34 (D-90):</b> bỏ phương án Tách — chỉ còn Gộp. <b>Mỗi ĐXMS một hồ sơ</b> (D-85); điều chỉnh là ĐXMS mới, ở menu Điều chỉnh đề xuất mua sắm (SCR-108).',
        'Mỗi dòng là một ĐXMS, kèm quy trình, bước hiện tại và người đang xử lý. <b>T34 v0.2 (D-92):</b> bỏ cột Hồ sơ đang xử lý — hồ sơ không hiện trên giao diện. Trạng thái suy từ hồ sơ như SCR-27 (R5).',
        '<b>Thêm mới</b> mở Tạo luồng (SCR-96): một lần Lưu tạo ĐXMS + hồ sơ Phê duyệt và khởi tạo quy trình (D-26).',
        'Bấm dòng mở Chi tiết đề xuất mua sắm (SCR-97, 7 tab — D-93); Cập nhật nhân sự (SCR-98) ở tab Nhân sự thực hiện.', '<b>Người dùng 09/11 (T34 v0.2):</b> menu đổi tên <b>Đề xuất mua sắm</b> (trước: Luồng mua sắm); nút <b>Điều chỉnh ĐXMS</b> mở Thêm mới điều chỉnh ĐXMS (chọn ĐXMS Đã phê duyệt cần điều chỉnh — D-91); menu Điều chỉnh đề xuất mua sắm (SCR-108) tạm ẩn.',
        'Khuôn: task-management (danh sách nhiệm vụ). Cột Quy trình / Bước hiện tại / Người đang xử lý lấy từ wf_profile + Camunda user task (candidateUsers) của hồ sơ đang chạy.',
        '<b>Tìm kiếm nâng cao</b> theo SRS DTMS_CN_0135 (Mã, Tên luồng, Đề tài / dự án, Đơn vị đề xuất, Trạng thái, Mức ưu tiên, Ngày tạo) và <b>T29</b> theo màn Soạn thảo TTr của hệ thống cũ (HT-DXMS-NOTE màn 6, 7; "TTr" = ĐXMS): Khối đơn vị (Đơn vị đề xuất hiện theo khối — GIẢ LẬP P-190), Người tạo, Mật; bảng thêm Đề tài / dự án, Đợt (P-192), Người tạo. Các trường T29 SRS-DXMS chưa có (D-59).',
      ],
      q: ['P-190', 'P-192'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách đề xuất mua sắm', info, right: `<button class="vbtn secondary" data-go="dieu-chinh-dxms/create" data-adj-dxms>${icon('edit')} Điều chỉnh ĐXMS</button><button class="vbtn primary" data-go="luong/create">${icon('add')} Thêm mới</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="luong-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên đề xuất" value="${esc(L.kw)}"></label>`}
          <button type="button" class="vbtn ${L.adv ? 'active' : 'secondary'}" data-lg="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'lg', total: all.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  /* ---------- SCR-96 Tạo luồng ---------- */
  const PRIORITIES = ['Thường', 'Khẩn', 'Thượng khẩn'];
  const UNITS = [...new Set([D.caseInfo.unit].concat(D.dxmsList.map((c) => c.unit)))];
  const LF = { v: {}, err: {}, files: [], rows: [], seq: 0, rseq: 0 };
  function resetForm() {
    const u = persona(Flow.state.persona).unit;
    Object.assign(LF, { err: {}, files: [], rows: [], seq: 0, rseq: 0, dotTouched: false, cost: [], pick: { type: null, line: null }, pl: {}, plFiles: {}, ai: null, aiBoc: null, boc: {}, add: [], aseq: 0, addPick: { line: null }, edit: null, base: null });
    /* T29 B17 (A3): căn cứ pháp lý điền sẵn như hệ thống cũ (GIẢ LẬP P-211). */
    LF.v = { title: '', nv: null, unit: UNITS.includes(u) ? u : null, priority: 'Thường', priReason: '', est: '', period: '', secret: 'Không', sign: 'VOffice', basisTD: 'Chưa phê duyệt', dot: '', legal: D.legalDefault.join('\n') };
  }
  /* ---------- T29 cách 1 — trường của màn Thêm mới TTr cũ (HT-DXMS-NOTE màn 8; "TTr" = ĐXMS) ----------
     Không trái Locked decisions: Loại biểu mẫu, Cấp phê duyệt, Hình thức trình ký chỉ đọc, hệ thống suy (luồng con vẫn xác định ở cổng
     sau bước 10 và bước 48; ký theo Mật); bảng bóc tách chi phí chỉ để tham khảo, căn cứ vẫn là tệp đính kèm (D-30); người thẩm định
     dự kiến điền sẵn bước 16 (DX-08). */
  const TH = () => D.dxmsRules()[0].to;
  const estNum = (s) => (String(s || '').trim() === '' ? null : Number(String(s).trim().replace(/\./g, '').replace(',', '.')));
  /* T29 B1 (D-54, D-77): không chọn Quy trình — một quy trình MS01; luồng con dự kiến theo Giá trị dự kiến và "Căn cứ đã được phê duyệt",
     hệ thống đặt lại ở cổng sau bước 10 theo Tổng giá trị, bước 48 chốt .01 / .02. */
  /* T29 B12 (RV-PROTO-0511 #8): số tiền trên màn này nhập số thường (đồng), không quy ra tỷ. Dữ liệu prototype vẫn lưu tỷ đồng như các màn khác
     (đổi khi nhập / hiện); đổi đơn vị ở các màn khác chờ BA xác nhận (P-208). */
  const dongIn = (s) => { const n = estNum(s); return n == null || Number.isNaN(n) ? n : n / 1e9; };
  const dong = (t) => (t == null ? '' : Math.round(t * 1e9).toLocaleString('vi-VN'));
  const curProc = (v) => D.subFlow(dongIn((v || LF.v).est), (v || LF.v).basisTD === 'Đã phê duyệt', D.dxmsRules());
  /* T29 B12 (RV-PROTO-0511 #6): Loại biểu mẫu, Cấp phê duyệt chưa có thì để trống; có Giá trị dự kiến thì điền đúng nhãn của hệ thống cũ
     (HT-DXMS-NOTE màn 8). Hệ thống đặt lại theo Tổng giá trị báo giá ở cổng sau bước 10; Cấp phê duyệt nhóm B trở lên TTMS chốt ở bước 48. */
  function derived(v) {
    const e = dongIn(v.est), known = e != null && !Number.isNaN(e), big = known && e >= TH(), ok = v.basisTD === 'Đã phê duyệt';
    return { form: !known ? '' : big ? 'ĐXMS có giá trị nhóm B trở lên' : 'ĐXMS có giá trị dưới nhóm B', level: !known ? '' : big && !ok ? 'Tập đoàn' : 'Tổng công ty' };
  }
  /* D-74 (RV-PROTO-0511 #5): Hình thức trình ký chọn được; mặc định Bản cứng khi Mật — lệch BR-DXMS-C-25. */
  const defSign = (secret) => (secret === 'Có' ? 'Bản cứng' : 'VOffice');
  const SIGNS = ['VOffice', 'Bản cứng'];
  /* Hình thành gói thầu (RV-PROTO-0511 #14): dropdown — GIẢ LẬP P-206. */
  const PKGS = ['Hình thành gói thầu', 'Không hình thành gói thầu'];
  const costLine = (id) => (LF.v.nv ? D.duToanOf(LF.v.nv) : []).find((l) => l.id === id) || null;
  const typeName = (t) => (D.costTypes.find(([k]) => k === t) || [t, t])[1];
  /* T29 S8 (B9): phần còn lại khả dụng của dòng dự toán = dự toán − ĐXMS đã phê duyệt − ĐXMS đang giữ (cùng hàm với SCR-104, D.duToanStats). */
  /* T37 (RV-PROTO-0911 #2): Điều chỉnh — phần ĐXMS cần điều chỉnh đang giữ được tính lại vào còn khả dụng (bản điều chỉnh thay bản cũ). */
  /* T45 — SRS 12 V0.4 BR-LDX-03-03, AC-0138-08: mở lại ĐXMS đã có (Lưu nháp / bị trả lại / ĐXMS mẫu chưa có hồ sơ) thì Còn lại khả dụng không trừ phần của chính ĐXMS này. */
  const ownCode = () => (isAdj() ? null : LF.edit ? LF.edit.code : LF.base && LF.base.mode === 'own' ? LF.base.code : null);
  const availOf = (l) => {
    const skip = [isAdj() ? LF.base.from : null, ownCode()].filter(Boolean);
    const s = D.duToanStats(l, ((window.DeTai.usesOf(l.code)[l.id]) || []).filter((u) => !skip.includes(u.x.code)));
    return { value: s.remain, qty: l.qty == null ? null : l.qty - s.qty };
  };
  /* T45 — SRS 12 BR-LDX-C-03, BR-LDX-02-04 (V0.3, review khách 10/11): vượt Còn lại khả dụng thì báo tại dòng và CHẶN Lưu nháp, Gửi
     (thay "cảnh báo, không chặn" của BR-DXMS-02-04 / T29 S8). */
  function costOver(r) {
    const l = costLine(r.line) || {}, a = availOf(l), q = estNum(r.qty), n = dongIn(r.value);
    return { qty: q != null && !Number.isNaN(q) && a.qty != null && q > a.qty ? `Vượt khối lượng còn lại (${a.qty}${l.uom ? ' ' + l.uom : ''}).` : '',
      val: n != null && !Number.isNaN(n) && n > a.value && n <= l.value ? `Vượt giá trị còn lại khả dụng (${dong(a.value)} đồng).` : '' };
  }
  function costWarn(r) { const o = costOver(r); return [o.qty, o.val].filter(Boolean).join(' '); }
  function costCard() {
    const nv = LF.v.nv, all = nv ? D.duToanOf(nv) : [], p = LF.pick, err = LF.err.cost || {}, ent = D.nvOf(nv) || {};
    /* T29 B12 (RV-PROTO-0511 #11, Huylx4 #2, #10): Đề tài / dự án là trường đầu tiên của màn, khối bóc tách chi phí ngay sau, trước Thông tin chung. */
    const nvSel = `<div class="grid3">${field('Đề tài / dự án', vSelect({ id: 'lf-nv', value: nv, searchable: true, placeholder: 'Chọn đề tài / dự án', invalid: !!LF.err.nv, disabled: isAdj(),
      options: D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name} (${n.kind})` })),
      onChange: upd((x) => { LF.v.nv = x; delete LF.err.nv; nvDefaults(x); if (!LF.dotTouched) LF.v.dot = S5().nextDot(x); LF.cost = []; LF.pick = { type: null, line: null }; delete LF.err.cost; LF.add = []; LF.addPick = { line: null }; }) }),
    { req: true, err: LF.err.nv, cls: 'span3' })}</div>`;
    /* [T37 RV-PROTO-0911 #4] bỏ khối Văn bản căn cứ và giá trị còn khả dụng — trước: ${LF.edit && Flow.token(LF.edit.tok) ? window.Screens.basisAvail(Flow.token(LF.edit.tok)) : ''} sau grid Đề tài / dự án. */
    const head = `<div class="vcard-h"><h3>${stepTag(1)}Căn cứ và nội dung mua sắm — Thông tin dự án / đề tài</h3><div class="row">${nv && ent.loai !== 'KHCN' ? `<span class="cap">Dự toán tham khảo — căn cứ của loại ${esc(ent.loai)} là tài liệu căn cứ đính kèm</span>` : ''}${nv ? aiBtn('boc', !!LF.aiBoc) : ''}</div></div>${nvSel}`;
    if (!nv) return `<section class="vcard" data-lf-cost>${head}<div class="lf-empty">Chọn Đề tài / dự án để bóc tách chi phí từ dự toán.</div></section>`;
    /* YC-DXMS-PROTO §3.1: chỉ khoản mục TTMS đã tích Chi mua sắm và còn khả dụng. */
    /* Góp ý 05/11: khoản mục TTMS đặt Hoàn thành không bóc tách thêm (GIẢ LẬP P-203). */
    const lines = all.filter((l) => l.buy && l.status !== 'Hoàn thành' && availOf(l).value > 0);
    const types = [...new Set(lines.map((l) => l.type))];
    const avTxt = (l) => { const a = availOf(l); return `${a.qty == null ? '' : `${a.qty} ${l.uom || ''} · `}${dong(a.value)} đồng`; };
    return `<section class="vcard" data-lf-cost>${head}
      <div class="grid3">
        ${field('Loại chi phí', vSelect({ id: 'lf-ctype', value: p.type, placeholder: 'Chọn loại chi phí', options: types.map((t) => ({ value: t, label: typeName(t) })),
    onChange: upd((x) => { p.type = x; p.line = null; }) }))}
        ${field('Khoản mục chi phí', vSelect({ id: 'lf-cline', value: p.line, searchable: true, disabled: !p.type, placeholder: p.type ? 'Chọn khoản mục chi phí' : 'Chọn loại chi phí trước',
    options: lines.filter((l) => l.type === p.type).map((l) => ({ value: l.id, label: `${l.item} — còn ${avTxt(l)}` })), onChange: upd((x) => { p.line = x; }) }))}
        <div class="vfield"><div class="lr"><label>&nbsp;</label></div><div class="row"><button type="button" class="vbtn secondary" data-lf-cadd ${p.line ? '' : 'disabled'}>${icon('add')} Thêm vào ĐXMS</button></div></div>
      </div>
      ${table([['Thao tác', 80, 'c'], ['Nguồn vốn', 170], ['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80], ['Còn lại khả dụng', 180, 'r'],
    ['Số lượng đề xuất', 140], ['Giá trị dự tính (đồng)', 190], ['Hình thành gói thầu', 220]], LF.cost, (r) => {
    const l = costLine(r.line) || {}, e = err[r.id] || {}, warn = costWarn(r);
    const inp = (k, ph, max) => `<div class="vfield ${e[k] ? 'invalid' : ''}"><input class="vctl" data-lf-c${k}="${r.id}" maxlength="${max}" placeholder="${ph}" value="${esc(k === 'val' ? r.value : r[k])}" ${e[k] ? 'aria-invalid="true"' : ''}>${e[k] ? `<p class="msg" role="alert">${esc(e[k])}</p>` : ''}</div>`;
    return `<td class="c">${iconBtn('del', 'Xóa dòng', `data-lf-cdel="${r.id}"`)}</td><td>${clamp(l.fund)}</td>
        <td>${clamp(typeName(l.type))}</td><td data-lf-citem="${r.id}">${clamp(l.item)}${warn ? `<div class="t-err" data-lf-cwarn>${esc(warn)}</div>` : ''}</td><td>${esc(l.uom || '')}</td><td class="r num">${avTxt(l)}</td>
        <td>${inp('qty', 'Nhập số lượng', 10)}</td><td>${inp('val', 'Nhập giá trị (đồng)', 20)}</td>
        <td>${vSelect({ id: 'lf-cpkg-' + r.id, value: r.pkg || null, clear: true, placeholder: 'Chọn hình thành gói thầu', options: PKGS.map((p) => ({ value: p, label: p })), onChange: upd((x) => { r.pkg = x || ''; }) })}</td>`;
  }, 'Chưa bóc tách chi phí — chọn Loại chi phí, Khoản mục chi phí rồi Thêm vào ĐXMS')}${bocCard()}</section>`;
  }
  /* D-75 (RV-PROTO-0511 #14, câu hỏi 4; Huylx4 #3): bỏ Danh sách người thẩm định — CQCM chọn ở bước 16, DX-08 rút. */
  function readCost() {
    LF.cost.forEach((r) => {
      const a = document.querySelector(`[data-lf-cval="${r.id}"]`), c = document.querySelector(`[data-lf-cqty="${r.id}"]`);
      if (a) r.value = a.value;
      if (c) r.qty = c.value;
    });
  }
  function readInputs() {
    ['title', 'est', 'period', 'priReason', 'dot', 'legal'].forEach((k) => { const el = document.getElementById('lf-' + k); if (el) LF.v[k] = el.value; });
    const ar = document.getElementById('lf-adjReason');
    if (ar && LF.base) LF.base.reason = ar.value;
    readCost();
    /* T29 B19: nội dung sửa gợi ý AI (bước 4), SL đề xuất bóc tách (bước 5). */
    document.querySelectorAll('[data-lf-ai-txt]').forEach((el) => { const r = LF.ai && LF.ai.rows.find((x) => x.key === el.dataset.lfAiTxt); if (r) r.noiDungSua = el.value; });
    document.querySelectorAll('[data-lf-bq]').forEach((el) => { const n = Number(el.dataset.lfBq); if (LF.boc[n]) LF.boc[n].prop = el.value; });
    document.querySelectorAll('[data-lf-aq]').forEach((el) => { const r = (LF.add || []).find((x) => x.id === el.dataset.lfAq); if (r) r.sl = el.value; });
  }
  const upd = (fn) => (val) => { readInputs(); fn(val); rerender(); };

  function basisCard() {
    const types = basisTypes(), err = LF.err;
    /* T29 B12 (Huylx4 #11): "Căn cứ đầu vào" → "Căn cứ pháp lý" như hệ thống cũ (HT-DXMS-NOTE màn 8: đính file + nhập text). */
    return `<section class="vcard ${err.basis ? 'invalid' : ''}" data-lf-basis><div class="vcard-h"><h3>Căn cứ pháp lý</h3>
        <div class="row">${LF.v.nv ? aiBtn('legal') : ''}<button type="button" class="vbtn red" data-lf-up>${icon('upload')} Tải file lên</button><input type="file" id="lf-file" multiple hidden></div></div>
      ${err.basis ? `<p class="msg lf-err" role="alert">${esc(err.basis)}</p>` : ''}
      ${table([['Thao tác', 80, 'c'], ['Tên tài liệu', 240], ['Loại tài liệu căn cứ', 320], ['Gắn vào', 180], ['Ngày tạo', 120]], LF.files, (f) => {
    const tg = f.type ? targetsOf(f.type) : [];
    return `<td class="c">${iconBtn('del', 'Xóa tài liệu', `data-lf-del="${f.id}"`)}</td><td><span class="clamp">${esc(f.name)}</span></td>
        <td>${vSelect({ id: 'lf-type-' + f.id, value: f.type, searchable: true, placeholder: 'Chọn loại tài liệu căn cứ', invalid: !!(err.types && !f.type),
          options: types.map((t) => ({ value: t.code, label: t.req === 'CO' ? `${t.name} (bắt buộc)` : t.name })),
          onChange: upd((v) => { f.type = v; f.target = targetsOf(v)[0]; delete LF.err.basis; }) })}</td>
        <td>${vSelect({ id: 'lf-tg-' + f.id, value: f.target || null, placeholder: 'Theo loại tài liệu', disabled: tg.length < 2,
          options: tg.map((s) => ({ value: s, label: TARGET[s] })), onChange: upd((v) => { f.target = v; }) })}</td><td class="num">${esc(f.at)}</td>`;
  }, 'Chưa có tài liệu căn cứ')}
      <div class="lf-legal">${field('Nội dung căn cứ pháp lý', `<textarea class="vctl ta" id="lf-legal" maxlength="4000" placeholder="Nhập căn cứ pháp lý (số, ngày, trích yếu văn bản)">${esc(LF.v.legal)}</textarea>`)}</div></section>`;
  }

  /* T29 B17 — Phụ lục kèm theo Tờ trình (HT-DXMS-IMG Soạn thảo TTr: 6 cờ Có / Không, mặc định Không; HT-DXMS-NOTE màn 8 "đính file";
     IA-DXMS dòng 18, 95–100). Có → tải tệp được ngay (không bắt buộc khi tạo); bước lập dự thảo sửa được lựa chọn, phụ lục Có
     bắt buộc có tệp mới gửi được. Tờ trình in danh sách ở mục Danh mục hồ sơ kèm theo (GIẢ LẬP P-212). */
  function phuLucCard() {
    const radio = window.UI.vRadio;
    return `<section class="vcard" data-lf-plcard><div class="vcard-h"><h3>Phụ lục kèm theo Tờ trình</h3><span class="cap">Chọn Có thì tải tệp phụ lục; tệp bắt buộc khi gửi dự thảo Tờ trình</span></div>
      ${table([['Phụ lục', 360], ['Có / Không', 200], ['Tệp phụ lục', 360]], D.phuLuc.map(([key, name]) => ({ key, name })), (r) => {
    const on = LF.pl[r.key] === 'Có', f = LF.plFiles[r.key];
    return `<td>${esc(r.name)}</td><td><div class="vradio h">${radio('Có', on, `data-lf-pl="${r.key}|Có"`)}${radio('Không', !on, `data-lf-pl="${r.key}|Không"`)}</div></td>
        <td data-lf-plf="${r.key}">${!on ? '<span class="cap">Không áp dụng</span>' : f ? `<div class="row"><span class="clamp">${esc(f)}</span>${iconBtn('del', 'Xóa tệp', `data-lf-pldel="${r.key}"`)}</div>`
      : `<button type="button" class="vbtn secondary" data-lf-plup="${r.key}">${icon('upload')} Tải tệp</button>`}</td>`;
  })}<input type="file" id="lf-plfile" hidden></section>`;
  }

  /* Nhân sự thực hiện — D-75 (RV-PROTO-0511 #14; Huylx4 #12–14, người dùng bổ sung 05/11): mỗi dòng một Vai trò thực hiện + một Người thực hiện.
     Vai trò = mọi vai trò có bước người dùng trong các luồng (MS01 .01 / .02 / .03, MS02); thật: danh mục Vai trò thực hiện (execution_role) ĐTMS
     quản lý, đồng bộ từ Candidate Users của BPMN đã deploy trên Camunda. Người được chọn nhận mọi task của vai trò trong luồng ĐXMS
     (BE đổi roleCode → username như TaskService.syncCreatedProcessCandidateUsers). Vai trò không có dòng: giao theo vai trò như quy trình. */
  const ROLE_PROCS = ['MS01.01', 'MS01.02', 'MS01.03', 'MS02'];
  function allRoles() {
    const out = new Map();
    ROLE_PROCS.forEach((p) => rolesOf(p).forEach((r) => { if (!out.has(r.code)) out.set(r.code, { code: r.code, name: r.name }); }));
    return [...out.values()];
  }
  /* Bước MS01 (mọi luồng con — luồng con chốt sau bước 10 / 48) của vai trò → nhân sự chỉ định theo bước của Flow (S.members). */
  function membersByRole(rows) {
    const out = {};
    ['MS01.01', 'MS01.02', 'MS01.03'].forEach((p) => tasksOf(p).forEach((t) => {
      const r = rows.find((x) => x.role === t.role);
      if (r && r.person) out[t.key] = [r.person];
    }));
    return out;
  }
  function membersCard() {
    const roles = allRoles(), err = LF.err.rows || {};
    const add = `<button type="button" class="vbtn secondary" data-lf-add>${icon('add')} Thêm dòng</button>`;
    return `<section class="vcard" data-lf-members><div class="vcard-h"><h3>Nhân sự thực hiện</h3><div class="row">${add}</div></div>
      ${table([['Thao tác', 80, 'c'], ['Vai trò thực hiện', 340], ['Người thực hiện', 380]], LF.rows, (r) => {
    const e = err[r.id] || {}, used = LF.rows.filter((x) => x !== r && x.role).map((x) => x.role);
    return `<td class="c">${iconBtn('del', 'Xóa dòng', `data-lf-rdel="${r.id}"`)}</td>
        <td><div class="vfield ${e.role ? 'invalid' : ''}" data-row-role="${r.id}">${vSelect({ id: 'lf-role-' + r.id, value: r.role, searchable: true, placeholder: 'Chọn vai trò thực hiện', invalid: !!e.role,
          options: roles.filter((x) => !used.includes(x.code)).map((x) => ({ value: x.code, label: x.name })),
          onChange: upd((k) => { if (r.role !== k) r.person = null; r.role = k; if (err[r.id]) delete err[r.id].role; }) })}
          ${e.role ? `<p class="msg" role="alert">${esc(e.role)}</p>` : ''}</div></td>
        <td><div class="vfield ${e.person ? 'invalid' : ''}" data-row-people="${r.id}">${vSelect({ id: 'lf-m-' + r.id, value: r.person, searchable: true, disabled: !r.role, invalid: !!e.person,
          placeholder: r.role ? 'Chọn người thực hiện' : 'Chọn vai trò trước',
          options: r.role ? D.usersOfRole(r.role).map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` })) : [],
          onChange: upd((v) => { r.person = v; if (err[r.id]) delete err[r.id].person; }) })}
          ${e.person ? `<p class="msg" role="alert">${esc(e.person)}</p>` : ''}</div></td>`;
  }, 'Chưa chỉ định — task của mọi vai trò giao theo vai trò như quy trình')}</section>`;
  }

  /* ---------- T29 B19 (plan T29 §3.12, DX-11): màn Lập ĐXMS = bước 1–5 của BPMN MS01 v1.1 trên một màn ----------
     Người làm bước 1 (căn cứ: Thông tin dự án / đề tài + Căn cứ pháp lý), 4 (Thông tin cơ bản), 5 (Bóc tách); AI làm bước 2 (lấy dữ liệu căn cứ),
     3 (gợi ý thông tin cơ bản), 6 (đối chiếu dự toán / eBOM / mBOM / tồn kho) ngay trên màn — người dùng Chấp nhận / Sửa / Bỏ gợi ý.
     Gửi = hoàn thành 1 → 2 → 3 → 4 → 5 một lượt (6 chạy sau 5.1 theo DX-10, kết quả 6 đã hiện trên màn) (lịch sử ghi đủ từng bước, biến ghi như form bước 4, 5 cũ).
     GIẢ LẬP: kết quả AI là dữ liệu mẫu của hồ sơ demo (D.aiBasic, D.itemsBase) — P-216…P-218. */
  const AI_DEC = ['Chấp nhận', 'Sửa', 'Bỏ'];
  const PURPOSES = [['DT', 'Duy trì hoạt động thường xuyên'], ['SX', 'Bảo đảm tính liên tục của hoạt động SXKD'], ['KHCN', 'Triển khai các hoạt động KHCN'], ['QP', 'Nhiệm vụ QP-AN, chính trị, nhiệm vụ đặc thù']];
  const LAP_TASKS = ['1', '4', '5'];
  // T45 V0.4 SRS 12 3.1.3: ĐXMS (luồng chính MS01) đang ở việc Lập ĐXMS — chưa gửi, hoặc bị Chỉ huy ĐVĐX Trả lại ở 5.1 (về bước 5).
  // Trả { tok, sent, returned: { who, at, reason } | null } hoặc null khi không có việc Lập đang mở.
  function lapState(code) {
    const s = Flow.state, v = s.vars || {};
    if (!code || s.dxms !== code || s.status !== 'running' || s.kdt || s.parent || v.adj || !/^MS01/.test(String(v.process || ''))) return null;
    const tok = s.tokens.find((t) => LAP_TASKS.includes(String(t.task)));
    if (!tok) return null;
    const sent = s.history.some((h) => String(h.task) === '5' && h.who && h.action !== 'Thiếu thông tin căn cứ');
    const last = s.history.filter((h) => String(h.task) === '5.1' && h.who).pop();
    const returned = sent && last && last.action === 'Trả lại'
      ? { who: (persona(last.who) || {}).name || last.who, at: window.Screens.dateTimeOf(last.t), reason: last.reason || '' } : null;
    return { tok, sent, returned };
  }
  // T45 V0.4 SRS 12 3.1.3 (BR-LDX-03-01): Sửa, Xóa cho người thực hiện việc Lập đang mở; ĐXMS mẫu chưa có hồ sơ (Chưa khởi tạo) — người tạo.
  // ĐXMS điều chỉnh không áp dụng (theo tài liệu Điều chỉnh). Trả { go } (route mở màn Lập) hoặc null.
  function editOf(x, state) {
    if (!x || x.adjFrom) return null;
    const pid = Flow.state.persona, ls = lapState(x.code);
    if (ls) return ls.tok.who === pid || (ls.tok.cands || []).includes(pid) ? { go: 'task/' + ls.tok.id, live: true } : null;
    if (state === 'NEW' && x.code !== Flow.state.dxms && x.creator === (persona(pid) || {}).name) return { go: 'luong/create/' + encodeURIComponent(x.code), live: false };
    return null;
  }
  // T45 V0.4 SRS 12 3.1.3 (BR-LDX-03-04): hộp thoại Xóa đề xuất mua sắm; xóa thành công thì về Danh sách.
  async function askDelete(code) {
    const x = Flow.findDxms(code);
    if (!x) { toast('Không tìm thấy đề xuất mua sắm.', 'warn'); location.hash = '#/luong'; return; }
    if (!editOf(x, window.Screens.dxmsMeta(x, window.Screens.allCases()).state)) { toast('Đề xuất mua sắm đã được gửi, không sửa, xóa được.', 'warn'); rerender(); return; }
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa đề xuất mua sắm',
      desc: `Bạn có chắc chắn muốn xóa đề xuất mua sắm ${x.title} - ${x.code} không? Đề xuất sẽ không còn trên danh sách và thao tác này không thể hoàn tác.`,
      hl: x.title, cancel: 'Hủy', ok: 'Xóa' });
    if (!yes) return;
    LF.edit = null;
    Flow.deleteLuong(code);
    toast('<b>Thành công</b><br>Xóa đề xuất mua sắm thành công.');
    if (location.hash !== '#/luong') location.hash = '#/luong'; else rerender();
  }
  const fundOpts = () => window.Catalog.rows('nguon-von').filter((r) => r.active || r.code === LF.v.fund).map((r) => ({ value: r.code, label: r.name }));
  /* Bước 2 — AI / tích hợp lấy dữ liệu căn cứ của đề tài / dự án. */
  function aiFetch(nv) {
    const ent = D.nvOf(nv) || {}, lines = D.duToanOf(nv) || [], items = D.itemsBase();
    return { at: Flow.dateOf(Flow.state.clock), nv, parts: [`Dự toán ${ent.code}: ${lines.length} dòng (${lines.filter((l) => l.buy).length} dòng Chi mua sắm)`,
      `eBOM / mBOM: ${items.filter((i) => i.bom != null).length} hạng mục`, `Tồn kho sổ sách: ${items.filter((i) => i.book != null || i.stock).length} hạng mục có tồn`] };
  }
  /* Bước 3 — AI gợi ý thông tin cơ bản theo các mục 1–6 của Tờ trình BM-01 / BM-09 (như bảng gợi ý của form bước 4 cũ). */
  function aiSuggest(nv) {
    const ent = D.nvOf(nv) || {}, src = `${ent.code || 'căn cứ'} — ${ent.name || ''}`;
    return D.aiBasic.map((a) => ({ key: a.key, muc: a.label, goiY: a.value, nguon: a.from }))
      .concat([{ key: 'bienPhap', muc: 'Biện pháp thực hiện', goiY: 'Lựa chọn nhà thầu theo Quy chế lựa chọn nhà thầu của Tập đoàn; hình thành gói thầu theo dòng dự toán đã bóc tách.', nguon: 'BM-01 mục 6; dòng dự toán đã chọn' },
        { key: 'keHoach', muc: 'Kế hoạch tổ chức thực hiện', goiY: 'Lấy báo giá, lập Tờ trình: tháng 1; thẩm định, phê duyệt: tháng 2–3; lựa chọn nhà thầu, ký hợp đồng: tháng 4–5.', nguon: 'Tiến độ đề tài / dự án' }])
      .map((r) => Object.assign(r, { nguon: `${r.nguon} · ${src}`, quyetDinh: null, noiDungSua: '' }));
  }
  /* Bấm Gợi ý từ AI / Gợi ý lại → AI bước 2, 3, 6 chạy (P-216: theo nút, người dùng chốt 06/11 — không tự chạy khi chọn đề tài). P-217: dòng người dùng đã Sửa giữ nội dung, gắn nhãn xem lại. */
  function runAi(nv) {
    const old = LF.ai ? LF.ai.rows : [];
    if (!nv) { LF.ai = null; return; }
    const rows = aiSuggest(nv).map((r) => {
      const o = old.find((x) => x.key === r.key);
      return o && o.quyetDinh === 'Sửa' ? Object.assign(r, { quyetDinh: 'Sửa', noiDungSua: o.noiDungSua, stale: LF.ai.nv !== nv }) : r;
    });
    LF.ai = { nv, fetch: aiFetch(nv), rows };
    const ent = D.nvOf(nv) || {};
    if (!LF.v.purposeTouched) LF.v.purposeCode = ent.loai === 'KHCN' ? 'KHCN' : 'SX';
    if (!LF.v.fundTouched) LF.v.fund = ent.fund || (D.aiBasic.find((a) => a.key === 'fund') || {}).code || null;
    delete LF.err.ai; delete LF.err.aiRow;
  }
  /* Góp ý 06/11: mỗi khối có nút ✦ Gợi ý từ AI riêng → popup chỉ trả thông tin của khối đó; người dùng bỏ chọn / sửa từng mục rồi
     Áp dụng → điền vào khối. Hủy: màn giữ nguyên. Sau khi áp dụng vẫn sửa được ngay trên màn.
     - Căn cứ và nội dung mua sắm: Bóc tách và đối chiếu (AI bước 2 lấy dữ liệu + bước 6 đối chiếu).
     - Thông tin cơ bản: Nhóm mục đích, Nguồn vốn, 7 mục Tờ trình (AI bước 3) — mục bỏ chọn = Bỏ, sửa nội dung = Sửa, còn lại = Chấp nhận.
     - Thông tin chung: Tên luồng, Giá trị dự kiến, Thời gian thực hiện.  - Căn cứ pháp lý: loại tài liệu của tệp đã tải, nội dung căn cứ pháp lý.
     GIẢ LẬP: kết quả AI là dữ liệu mẫu (P-216…P-218). */
  const aiBtn = (sec, again) => `<button type="button" class="vbtn secondary lf-ai-btn" data-lf-ai-sec="${sec}">✦ ${again ? 'Gợi ý lại' : 'Gợi ý từ AI'}</button>`;
  const aiBocOld = () => !!(LF.aiBoc && LF.aiBoc.nv !== LF.v.nv);
  const fetchStrip = (f, ent) => `<div class="lf-ai2" data-lf-ai2><b>✦ Bước 2 · AI đã lấy dữ liệu căn cứ</b> <span class="cap">${ent ? `${esc(ent.code)} — ${esc(ent.name || '')} · ` : ''}lúc ${esc(f.at)}</span><div>${f.parts.map(esc).join(' · ')}</div></div>`;
  const popTbl = (head, body) => `<div class="vtable-vp"><table class="vtable"><thead><tr>${head.map(([t, w, c]) => `<th style="width:${w}px" class="${c || ''}">${t}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  const popCb = (attr, on) => `<input type="checkbox" ${attr} ${on ? 'checked' : ''} aria-label="Áp dụng">`;
  function aiModal(title, body, apply) {
    const m = window.UI.vModal({ title: `✦ Gợi ý từ AI — ${title}`, size: 'xl',
      body: `<div data-lf-ai-pop>${body}<p class="cap">Bỏ chọn mục không dùng, sửa nội dung nếu cần, rồi bấm Áp dụng để điền vào màn.</p></div>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-lf-ai-apply>Áp dụng vào màn</button>' });
    m.el.querySelector('[data-lf-ai-apply]').addEventListener('click', () => {
      readInputs();
      const msg = apply((sel) => m.el.querySelector(sel));
      if (msg === false) return;
      m.close();
      toast(`${msg} — vẫn sửa được trên màn.`, 'success');
      rerender();
    });
  }
  /* Khối Căn cứ và nội dung mua sắm → Bóc tách và đối chiếu. */
  /* Góp ý 06/11: kết quả bóc tách AI điền luôn vào bảng Loại chi phí / Khoản mục chi phí của khối Căn cứ. AI ghép từng hàng hoá vào khoản mục dự toán
     Chi mua sắm còn khả dụng (dịch vụ đào tạo / chuyển giao → khoản mục Đào tạo; còn lại → khoản mục Thiết bị), giá trị dự tính = Σ SL đề xuất × đơn giá,
     không vượt phần còn lại khả dụng của khoản mục (vượt thì AI giới hạn và ghi chú); số lượng = khối lượng còn lại của khoản mục.
     GIẢ LẬP: quy tắc ghép hàng hoá → khoản mục dự toán chưa có trong nguồn, chờ BA chốt (thật: AI / eBOM mang mã khoản mục dự toán). */
  const costLinesOf = (nv) => D.duToanOf(nv).filter((l) => l.buy && l.status !== 'Hoàn thành' && availOf(l).value > 0);
  const lineFor = (i, lines) => {
    const svc = /đào tạo|chuyển giao/i.test(i.name);
    return lines.find((l) => (svc ? /đào tạo/i : /thiết bị/i).test(l.item)) || lines.find((l) => l.type === 'PL2') || lines[0] || null;
  };
  function costGroups(nv, pickQ) {
    const lines = costLinesOf(nv), g = [];
    D.itemsBase().forEach((i) => {
      const q = pickQ(i);
      if (q == null || Number.isNaN(q) || q <= 0) return;
      const l = lineFor(i, lines);
      if (!l) return;
      let x = g.find((y) => y.l.id === l.id);
      if (!x) g.push(x = { l, sum: 0, names: [] });
      x.sum += q * (i.price || 0); x.names.push(i.name);
    });
    return g.map((x) => {
      const a = availOf(x.l), v = Math.min(x.sum, a.value);
      return Object.assign(x, { value: v, cut: x.sum > a.value, qty: a.qty == null ? (x.l.qty == null ? 1 : x.l.qty) : a.qty });
    });
  }
  function popBoc() {
    const nv = LF.v.nv, same = !!(LF.aiBoc && LF.aiBoc.nv === nv), ent = D.nvOf(nv) || {}, items = D.itemsBase(), fetch = aiFetch(nv);
    const remain = (i) => (i.bom == null ? '-' : i.bom - (i.used || 0)), lines = costLinesOf(nv);
    const rows = items.map((i) => {
      const ln = lineFor(i, lines);
      const b = same ? LF.boc[i.n] : null, q = b ? b.prop : String(i.prop), bk = i.book != null ? i.book : i.stock != null ? i.stock : null;
      const note = i.warn ? `<span class="t-warn">${esc(i.warn)}</span>` : bk ? `Có tồn kho sổ sách ${bk} — Kho rà soát thực tế ở bước 7` : '<span class="faint">Khớp dự toán / eBOM</span>';
      return `<tr data-lf-pop-item="${i.n}"><td class="c">${popCb(`data-lf-pop-ion="${i.n}"`, !(b && b.bo))}</td><td><span class="clamp">${esc(i.name)}</span></td><td>${esc(i.uom || '')}</td>
        <td class="r num">${i.bom == null ? '-' : i.bom}</td><td class="r num">${i.used || 0}${D.usedIn[i.n] ? `<div class="cap">${esc(D.usedIn[i.n])}</div>` : ''}</td><td>${i.held ? `${i.held} (${esc(i.heldFor)})` : '0'}</td>
        <td class="r num">${bk == null ? '-' : bk}</td><td class="r num">${remain(i)}</td>
        <td><div class="vfield"><input class="vctl" data-lf-pop-q="${i.n}" maxlength="10" value="${esc(q)}"><p class="msg" data-lf-pop-err="${i.n}" role="alert" hidden></p></div></td><td data-lf-pop-line="${i.n}">${ln ? `${esc(typeName(ln.type))} · ${esc(ln.item)}` : '<span class="faint">Không có khoản mục khả dụng</span>'}</td><td>${note}</td></tr>`;
    }).join('') || '<tr><td colspan="11" class="faint">Căn cứ không có danh mục hàng hoá</td></tr>';
    const gs = costGroups(nv, (i) => { const b = same ? LF.boc[i.n] : null; return b && b.bo ? null : estNum(b ? b.prop : String(i.prop)); });
    const prev = gs.map((x) => `<tr data-lf-pop-cost="${esc(x.l.id)}"><td>${esc(typeName(x.l.type))}</td><td>${esc(x.l.item)}<div class="cap">${x.names.map(esc).join('; ')}</div></td><td>${esc(x.l.uom || '')}</td>
        <td class="r num">${x.qty}</td><td class="r num">${dong(x.value)}${x.cut ? `<div class="t-warn">AI giới hạn theo phần còn lại khả dụng (cần ${dong(x.sum)})</div>` : ''}</td></tr>`).join('')
      || '<tr><td colspan="5" class="faint">Không có hạng mục ghép được vào khoản mục dự toán</td></tr>';
    /* Review nhi 06/11 #18 (GIẢ LẬP P-223): D.bocHide tạm ẩn bảng AI bước 6 — dữ liệu ô SL vẫn giữ để Áp dụng theo số đề xuất của căn cứ. */
    aiModal('Bóc tách và đối chiếu', `${fetchStrip(fetch, ent)}<div ${D.bocHide ? 'hidden data-lf-boc-hidden' : ''}><h4 class="lf-pop-h">Bước 6 · Bóc tách và đối chiếu dự toán, eBOM / mBOM, tồn kho</h4></div><p class="msg lf-err" data-lf-pop-msg role="alert" hidden></p>
      <div ${D.bocHide ? 'hidden' : ''}>${popTbl([['Áp dụng', 70, 'c'], ['Hàng hoá / dịch vụ', 240], ['ĐVT', 70], ['SL gốc', 80, 'r'], ['Đã dùng ở ĐXMS khác', 130, 'r'], ['Đang giữ', 130], ['Tồn kho sổ sách', 110, 'r'], ['Còn được dùng', 110, 'r'], ['SL đề xuất', 110], ['✦ Khoản mục dự toán', 220], ['✦ Đối chiếu', 240]], rows)}</div>
      <h4 class="lf-pop-h">Điền vào bảng Loại chi phí / Khoản mục chi phí</h4>
      ${popTbl([['Loại chi phí', 200], ['Khoản mục chi phí', 320], ['ĐVT', 70], ['Số lượng đề xuất', 120, 'r'], ['Giá trị dự tính (đồng)', 220, 'r']], prev)}
      <p class="cap">Giá trị dự tính = Σ SL đề xuất × đơn giá của hàng hoá ghép vào khoản mục — tính lại theo SL và hạng mục bạn chọn khi Áp dụng.</p>`, (q) => {
      /* Kiểm ngay trong popup: SL đúng định dạng, không vượt số còn được dùng; giữ ít nhất một hạng mục. Lỗi thì không áp dụng. */
      let bad = 0;
      items.forEach((i) => {
        const on = q(`[data-lf-pop-ion="${i.n}"]`).checked, v = estNum(q(`[data-lf-pop-q="${i.n}"]`).value), r = remainOf(i), el = q(`[data-lf-pop-err="${i.n}"]`);
        const e = !on ? '' : v == null || Number.isNaN(v) || v <= 0 ? 'SL đề xuất không đúng định dạng.' : r != null && v > r ? `Vượt số còn được dùng (${r}).` : '';
        el.textContent = e; el.hidden = !e; el.parentElement.classList.toggle('invalid', !!e); if (e) bad += 1;
      });
      const pe = q('[data-lf-pop-msg]');
      const none = !items.some((i) => q(`[data-lf-pop-ion="${i.n}"]`).checked) && !LF.cost.some((r) => r.man && !r.ai);
      pe.textContent = bad ? `Còn ${bad} hạng mục chưa hợp lệ — sửa SL đề xuất rồi Áp dụng.` : none ? 'Bạn cần giữ ít nhất một hạng mục.' : ''; pe.hidden = !bad && !none;
      if (bad || none) return false;
      items.forEach((i) => { LF.boc[i.n] = { prop: q(`[data-lf-pop-q="${i.n}"]`).value, bo: !q(`[data-lf-pop-ion="${i.n}"]`).checked }; });
      const g = costGroups(nv, (i) => (LF.boc[i.n].bo ? null : estNum(LF.boc[i.n].prop)));
      LF.cost = LF.cost.filter((r) => !r.ai || g.some((x) => x.l.id === r.line));
      g.forEach((x) => {
        let r = LF.cost.find((y) => y.line === x.l.id);
        if (!r) { LF.rseq += 1; r = { id: 'c' + LF.rseq, line: x.l.id, pkg: '' }; LF.cost.push(r); }
        Object.assign(r, { qty: String(x.qty), value: dong(x.value), ai: true, man: false });
      });
      delete LF.err.cost;
      LF.aiBoc = { nv, fetch };
      delete LF.err.boc;
      return `Đã áp dụng gợi ý AI vào Bóc tách và đối chiếu: ${items.filter((i) => !LF.boc[i.n].bo).length} / ${items.length} hạng mục, ${g.length} khoản mục vào bảng Loại chi phí`;
    });
  }
  /* Khối Thông tin cơ bản → Nhóm mục đích, Nguồn vốn, 7 mục Tờ trình BM-01 / BM-09. */
  function popBasic() {
    const nv = LF.v.nv, old = LF.ai, same = !!(old && old.nv === nv), ent = D.nvOf(nv) || {}, fetch = aiFetch(nv);
    const rows = aiSuggest(nv).map((r) => {
      const o = old && old.rows.find((x) => x.key === r.key), keep = !!(o && o.quyetDinh === 'Sửa');
      return Object.assign(r, { draft: keep ? o.noiDungSua : r.goiY, on: !(o && o.quyetDinh === 'Bỏ' && same), stale: keep && !same });
    });
    const pName = (c) => (PURPOSES.find((x) => x[0] === c) || [])[1] || c;
    const fName = (c) => ((window.Catalog.rows('nguon-von').find((x) => x.code === c) || {}).name || c || '-');
    const purpose = ent.loai === 'KHCN' ? 'KHCN' : 'SX', fund = ent.fund || (D.aiBasic.find((a) => a.key === 'fund') || {}).code || null;
    const body = `<tr data-lf-pop-row="purposeCode"><td class="c">${popCb('data-lf-pop-sel="purposeCode"', true)}</td><td><b>Nhóm mục đích mua sắm</b></td><td>${esc(pName(purpose))}<div class="cap">Nguồn: loại ${esc(ent.loai || '-')} của ${esc(ent.code)}</div></td></tr>
       <tr data-lf-pop-row="fundCode"><td class="c">${popCb('data-lf-pop-sel="fund"', !!fund)}</td><td><b>Nguồn vốn</b></td><td>${esc(fName(fund))}<div class="cap">Nguồn: ${esc(ent.code)}</div></td></tr>` +
      rows.map((r) => `<tr data-lf-pop-row="${esc(r.key)}"><td class="c">${popCb(`data-lf-pop-on="${esc(r.key)}"`, r.on)}</td><td><b>${esc(r.muc)}</b>${r.stale ? '<div class="t-warn">Bạn đã sửa — căn cứ đổi, xem lại</div>' : ''}</td>
        <td><textarea class="vctl ta" rows="2" maxlength="2000" data-lf-pop-txt="${esc(r.key)}">${esc(r.draft)}</textarea><div class="cap">Nguồn: ${esc(r.nguon)}</div></td></tr>`).join('');
    aiModal('Thông tin cơ bản', `${fetchStrip(fetch, ent)}<h4 class="lf-pop-h">Bước 3 · Gợi ý thông tin cơ bản</h4>
      ${popTbl([['Áp dụng', 70, 'c'], ['Mục', 190], ['Nội dung gợi ý (sửa được)', 560]], body)}`, (q) => {
      const out = rows.map((r) => {
        const on = q(`[data-lf-pop-on="${r.key}"]`).checked, txt = q(`[data-lf-pop-txt="${r.key}"]`).value.trim();
        const d = !on ? 'Bỏ' : txt !== r.goiY ? 'Sửa' : 'Chấp nhận';
        return { key: r.key, muc: r.muc, goiY: r.goiY, nguon: r.nguon, quyetDinh: d, noiDungSua: d === 'Sửa' ? txt : '', stale: d === 'Sửa' && r.stale };
      });
      LF.ai = { nv, fetch, rows: out };
      if (q('[data-lf-pop-sel="purposeCode"]').checked) { LF.v.purposeCode = purpose; LF.v.purposeTouched = true; delete LF.err.purposeCode; }
      if (q('[data-lf-pop-sel="fund"]').checked && fund) { LF.v.fund = fund; LF.v.fundTouched = true; delete LF.err.fund; }
      delete LF.err.ai; delete LF.err.aiRow;
      return `Đã áp dụng gợi ý AI vào Thông tin cơ bản: ${out.filter((r) => r.quyetDinh !== 'Bỏ').length} / ${out.length} mục`;
    });
  }
  /* Khối Thông tin chung → Tên luồng, Giá trị dự kiến (phần còn lại khả dụng của dòng Chi mua sắm), Thời gian thực hiện. */
  function popChung() {
    const nv = LF.v.nv, ent = D.nvOf(nv) || {}, lines = D.duToanOf(nv).filter((l) => l.buy && l.status !== 'Hoàn thành');
    const est = lines.reduce((a, l) => a + Math.max(0, availOf(l).value), 0), per = D.aiBasic.find((a) => a.key === 'period') || {};
    const sug = [['title', 'Tên đề xuất mua sắm', `Đề xuất mua sắm cho ${ent.name}`, `Tên đề tài / dự án ${ent.code}`, 500],
      ['est', 'Giá trị dự kiến (đồng)', est ? dong(est) : '', `Dự toán ${ent.code}: phần còn lại khả dụng của ${lines.length} dòng Chi mua sắm`, 20],
      ['period', 'Thời gian thực hiện', per.value || '', per.from || 'Tiến độ đề tài / dự án', 100]];
    /* Review nhi 06/11 #1: Nhóm mục đích, Nguồn vốn chuyển từ khối Thông tin cơ bản (đã bỏ) vào Thông tin chung — AI bước 3 gợi ý theo loại và nguồn vốn của đề tài / dự án. */
    const pName = (c) => (PURPOSES.find((x) => x[0] === c) || [])[1] || c || '';
    const fName = (c) => ((window.Catalog.rows('nguon-von').find((x) => x.code === c) || {}).name || c || '');
    const purpose = ent.loai === 'KHCN' ? 'KHCN' : 'SX', fund = ent.fund || (D.aiBasic.find((a) => a.key === 'fund') || {}).code || null;
    const picks = [['purposeCode', 'Nhóm mục đích mua sắm', purpose, pName, `loại ${ent.loai || '-'} của ${ent.code}`], ['fund', 'Nguồn vốn', fund, fName, `${ent.code}`]];
    const body = sug.map(([k, label, val, src, max]) => `<tr data-lf-pop-row="${k}"><td class="c">${popCb(`data-lf-pop-on="${k}"`, !!val)}</td><td><b>${label}</b></td>
      <td>${LF.v[k] ? esc(LF.v[k]) : '<span class="faint">Chưa nhập</span>'}</td><td><input class="vctl" data-lf-pop-txt="${k}" maxlength="${max}" value="${esc(val)}"><div class="cap">Nguồn: ${esc(src)}</div></td></tr>`).join('')
      + picks.map(([k, label, val, nm, src]) => `<tr data-lf-pop-row="${k}"><td class="c">${popCb(`data-lf-pop-on="${k}"`, !!val)}</td><td><b>${label}</b></td>
      <td>${LF.v[k] ? esc(nm(LF.v[k])) : '<span class="faint">Chưa chọn</span>'}</td><td>${esc(nm(val))}<div class="cap">Nguồn: ${esc(src)}</div></td></tr>`).join('');
    aiModal('Thông tin chung', popTbl([['Áp dụng', 70, 'c'], ['Trường', 190], ['Hiện tại', 240], ['Gợi ý (sửa được)', 420]], body), (q) => {
      let n = 0;
      sug.forEach(([k]) => { if (q(`[data-lf-pop-on="${k}"]`).checked) { LF.v[k] = q(`[data-lf-pop-txt="${k}"]`).value.trim(); delete LF.err[k]; n += 1; } });
      picks.forEach(([k, , val]) => { if (val && q(`[data-lf-pop-on="${k}"]`).checked) { LF.v[k] = val; LF.v[k === 'fund' ? 'fundTouched' : 'purposeTouched'] = true; delete LF.err[k]; n += 1; } });
      return `Đã áp dụng gợi ý AI vào Thông tin chung: ${n} / ${sug.length + picks.length} trường`;
    });
  }
  /* Khối Căn cứ pháp lý → loại tài liệu căn cứ của từng tệp đã tải (theo tên tệp), nội dung căn cứ pháp lý (văn bản phê duyệt của đề tài / dự án). */
  const TYPE_HINT = [[/q[dđ]|quyet.?dinh/i, 'QD_NV'], [/k[eế]?.?ho[aạ]ch|^kh[-_ ]/i, 'KH_NAM'], [/bao.?gia|^bg[-_ ]/i, 'BAO_GIA'], [/bien.?ban|^bb[-_ ]/i, 'BIEN_BAN'],
    [/chi.?dao/i, 'CHI_DAO'], [/chu.?truong/i, 'CHU_TRUONG']];
  function popLegal() {
    const nv = LF.v.nv, ent = D.nvOf(nv) || {}, types = basisTypes(), doc = D.basisDocs.find((d) => d.id === ent.basis);
    const guess = (name) => { const h = TYPE_HINT.find(([re, c]) => re.test(name) && types.some((t) => t.code === c)); return h ? h[1] : (types.some((t) => t.code === 'KHAC') ? 'KHAC' : null); };
    const tName = (c) => ((types.find((t) => t.code === c) || {}).name || '-');
    const line = doc ? `- Quyết định số ${doc.no} ngày ${doc.date} — ${doc.title}.` : '';
    const legal = line && !String(LF.v.legal || '').includes(doc.no) ? `${LF.v.legal ? `${LF.v.legal}\n` : ''}${line}` : LF.v.legal;
    const files = LF.files.map((f) => ({ f, c: guess(f.name) }));
    const body = (files.map(({ f, c }) => `<tr data-lf-pop-row="file-${f.id}"><td class="c">${popCb(`data-lf-pop-fon="${f.id}"`, !!c && c !== f.type)}</td><td><span class="clamp">${esc(f.name)}</span></td>
      <td>${f.type ? esc(tName(f.type)) : '<span class="faint">Chưa chọn</span>'}</td><td>${esc(tName(c))}<div class="cap">Nguồn: tên tệp</div></td></tr>`).join('')
      || '<tr><td colspan="4" class="faint">Chưa có tài liệu — tải file lên để AI gợi ý loại tài liệu căn cứ</td></tr>') +
      `<tr data-lf-pop-row="legal"><td class="c">${popCb('data-lf-pop-on="legal"', legal !== LF.v.legal)}</td><td><b>Nội dung căn cứ pháp lý</b></td>
      <td colspan="2"><textarea class="vctl ta" rows="4" maxlength="4000" data-lf-pop-txt="legal">${esc(legal)}</textarea><div class="cap">Nguồn: ${doc ? `văn bản phê duyệt ${esc(doc.no)} của ${esc(ent.code)}` : 'căn cứ pháp lý mặc định'}</div></td></tr>`;
    aiModal('Căn cứ pháp lý', popTbl([['Áp dụng', 70, 'c'], ['Tên tài liệu', 260], ['Loại hiện tại', 260], ['Gợi ý loại tài liệu căn cứ', 300]], body), (q) => {
      let n = 0;
      files.forEach(({ f, c }) => { if (c && q(`[data-lf-pop-fon="${f.id}"]`).checked) { f.type = c; f.target = targetsOf(c)[0]; n += 1; } });
      if (q('[data-lf-pop-on="legal"]').checked) LF.v.legal = q('[data-lf-pop-txt="legal"]').value;
      delete LF.err.basis; delete LF.err.types;
      return `Đã áp dụng gợi ý AI vào Căn cứ pháp lý: ${n} tài liệu${q('[data-lf-pop-on="legal"]').checked ? ', nội dung căn cứ pháp lý' : ''}`;
    });
  }
  const aiTag = '<span class="lf-ai-tag" title="AI gợi ý — người dùng xác nhận">✦ AI</span>';
  /* Người dùng 09/11 (T34 v0.2): bỏ nhãn "Bước n" và dòng giải thích BPMN trên màn — giữ trong (i). */
  const stepTag = () => '';
  const aiOld = () => !!(LF.ai && LF.ai.nv !== LF.v.nv);
  /* Review nhi 06/11 #1: bỏ khối Thông tin cơ bản — Nhóm mục đích, Nguồn vốn là thông tin chung của luồng, nằm ở khối Thông tin chung
     (AI gợi ý ở popup ✦ Gợi ý từ AI của khối). Các mục nội dung Tờ trình (mục đích, phạm vi…) không nhập ở đây: AI gợi ý và người dùng
     xác nhận ở bước lập dự thảo Tờ trình (11 / 12), đúng mục của mẫu BM-01 / BM-09. basicCard giữ lại để bật lại nếu BA đổi ý. */
  /* Review nhi 06/11 #1: chọn Đề tài / dự án → điền sẵn Nhóm mục đích (theo Loại của đề tài) và Nguồn vốn (của đề tài) nếu người dùng chưa chọn tay. */
  function nvDefaults(nv, onlyEmpty) {
    const ent = D.nvOf(nv) || {};
    if (!nv) return;
    if (!LF.v.purposeTouched && !(onlyEmpty && LF.v.purposeCode)) LF.v.purposeCode = ent.loai === 'KHCN' ? 'KHCN' : 'SX';
    if (!LF.v.fundTouched && !(onlyEmpty && LF.v.fund)) LF.v.fund = ent.fund || (D.aiBasic.find((a) => a.key === 'fund') || {}).code || null;
    delete LF.err.purposeCode; delete LF.err.fund;
  }
  function purposeFields() {
    const v = LF.v, err = LF.err;
    return `${field(`Nhóm mục đích mua sắm${v.nv ? ' ' + aiTag : ''}`, vSelect({ id: 'lf-purpose', value: v.purposeCode, placeholder: 'Chọn nhóm mục đích', invalid: !!err.purposeCode,
    options: PURPOSES.map(([value, label]) => ({ value, label })), onChange: upd((x) => { v.purposeCode = x; v.purposeTouched = true; delete err.purposeCode; }) }), { req: true, err: err.purposeCode })}
        ${field(`Nguồn vốn${v.nv ? ' ' + aiTag : ''}`, vSelect({ id: 'lf-fund', value: v.fund, searchable: true, placeholder: 'Chọn nguồn vốn', invalid: !!err.fund,
    options: fundOpts(), onChange: upd((x) => { v.fund = x; v.fundTouched = true; delete err.fund; }) }), { req: true, err: err.fund })}`;
  }
  function basicCard() {
    const v = LF.v, err = LF.err, ai = LF.ai, re = err.aiRow || {};
    const right = v.nv ? `<div class="row">${aiBtn('basic', !!ai)}</div>` : '';
    const h = `<div class="vcard-h"><h3>${stepTag(4)}Thông tin cơ bản <span class="cap">· bấm ✦ Gợi ý từ AI, chọn mục rồi Áp dụng</span></h3>${right}</div>`;
    if (!v.nv) return `<section class="vcard" data-lf-basic>${h}<div class="lf-empty">Chọn Đề tài / dự án, rồi bấm ✦ Gợi ý từ AI ở khối này — AI gợi ý thông tin cơ bản từ căn cứ.</div></section>`;
    const left = ai ? ai.rows.filter((r) => !r.quyetDinh).length : 0;
    const decBtns = (r) => `<div class="lf-dec">${AI_DEC.map((d) => `<button type="button" class="vbtn sm ${r.quyetDinh === d ? 'primary' : 'secondary'}" data-lf-dec="${esc(r.key)}|${d}" aria-pressed="${r.quyetDinh === d}">${d}</button>`).join('')}</div>`;
    const use = (r) => {
      if (r.quyetDinh === 'Sửa') return `<div class="vfield ${re[r.key] ? 'invalid' : ''}"><textarea class="vctl ta" rows="2" maxlength="2000" data-lf-ai-txt="${esc(r.key)}" ${re[r.key] ? 'aria-invalid="true"' : ''}>${esc(r.noiDungSua)}</textarea>${re[r.key] ? `<p class="msg" role="alert">${esc(re[r.key])}</p>` : ''}</div>`;
      if (r.quyetDinh === 'Chấp nhận') return `<span class="clamp">${esc(r.goiY)}</span>`;
      if (r.quyetDinh === 'Bỏ') return '<span class="faint">Không dùng</span>';
      return `<span class="${err.ai ? 't-err' : 'faint'}">Chưa xử lý</span>`;
    };
    return `<section class="vcard ${err.ai ? 'invalid' : ''}" data-lf-basic>${h}
      <div class="grid3">
        ${field(`Nhóm mục đích mua sắm ${aiTag}`, vSelect({ id: 'lf-purpose', value: v.purposeCode, placeholder: 'Chọn nhóm mục đích', invalid: !!err.purposeCode,
    options: PURPOSES.map(([value, label]) => ({ value, label })), onChange: upd((x) => { v.purposeCode = x; v.purposeTouched = true; delete err.purposeCode; }) }), { req: true, err: err.purposeCode })}
        ${field(`Nguồn vốn ${aiTag}`, vSelect({ id: 'lf-fund', value: v.fund, searchable: true, placeholder: 'Chọn nguồn vốn', invalid: !!err.fund,
    options: fundOpts(), onChange: upd((x) => { v.fund = x; v.fundTouched = true; delete err.fund; }) }), { req: true, err: err.fund })}
      </div>
      ${!ai ? `${err.ai ? `<p class="msg lf-err" role="alert">${esc(err.ai)}</p>` : ''}<div class="lf-empty">Bấm ✦ Gợi ý từ AI ở khối này — AI gợi ý thông tin cơ bản từ căn cứ, bạn chọn mục dùng trong popup rồi Áp dụng vào màn.</div></section>` : `
      <p class="cap" data-lf-ai-left>${left ? `Còn ${left} / ${ai.rows.length} gợi ý chưa xử lý` : `Đã xử lý ${ai.rows.length} / ${ai.rows.length} gợi ý`} — giá trị dùng là đầu vào Tờ trình BM-01 / BM-09 (bước 11 / 12).</p>
      ${aiOld() ? `<p class="t-warn" data-lf-ai-old>Đề tài / dự án đã đổi — gợi ý hiện tại theo ${esc(ai.nv)}. Bấm ✦ Gợi ý lại; mục bạn đã sửa được giữ lại để xem lại.</p>` : ''}
      ${err.ai ? `<p class="msg lf-err" role="alert">${esc(err.ai)}</p>` : ''}
      ${table([['Mục', 170], ['✦ Gợi ý AI (bước 3)', 360], ['Quyết định', 230], ['Nội dung dùng', 360]], ai.rows, (r) => `<td data-lf-ai-row="${esc(r.key)}"><b>${esc(r.muc)}</b>${r.stale ? '<div class="t-warn">Căn cứ đã đổi — xem lại</div>' : ''}</td>
        <td><div class="lf-ai-sug">${esc(r.goiY)}</div><div class="cap">Nguồn: ${esc(r.nguon)}</div></td><td>${decBtns(r)}</td><td>${use(r)}</td>`)}</section>`}`;
  }
  /* Bước 5 + AI bước 6: danh mục hàng hoá bóc tách từ căn cứ (eBOM / mBOM), đối chiếu số còn được dùng, đang giữ, tồn kho sổ sách. */
  const remainOf = (i) => (i.bom == null ? null : i.bom - (i.used || 0));
  const bocRow = (i) => LF.boc[i.n] || (LF.boc[i.n] = { prop: String(i.prop), bo: false });
  function bocIssue(i) {
    const b = bocRow(i), q = estNum(b.prop), r = remainOf(i);
    if (b.bo) return '';
    if (q == null || Number.isNaN(q) || q < 0) return 'SL đề xuất không đúng định dạng.';
    if (r != null && q > r) return `Vượt số còn được dùng (${r}).`;
    return '';
  }
  function bocCard() {
    const err = LF.err;
    /* Góp ý 06/11: bóc tách và đối chiếu nằm ngay trong khối Căn cứ (bước 1), không tách khối riêng phía dưới. */
    const h = `<div class="lf-sub-h"><h4>${stepTag(5)}${D.bocHide ? 'Bóc tách' : 'Bóc tách và đối chiếu <span class="cap">· AI đối chiếu dự toán, eBOM / mBOM, tồn kho</span>'}</h4></div>`;
    if (!LF.v.nv) return '';
    const em = err.boc ? `<p class="msg lf-err" role="alert">${esc(err.boc)}</p>` : '';
    if (!LF.aiBoc || aiBocOld()) return `<div class="lf-sub ${err.boc ? 'invalid' : ''}" data-lf-boc>${h}${em}<div class="lf-empty">${LF.aiBoc ? `<span class="t-warn">Đề tài / dự án đã đổi</span> — bóc tách hiện tại theo ${esc(LF.aiBoc.nv)}. Bấm ✦ Gợi ý lại ở khối này để AI bóc tách và đối chiếu theo căn cứ mới.` : 'Bấm ✦ Gợi ý từ AI ở khối này — AI lấy dữ liệu căn cứ, bóc tách danh mục hàng hoá và đối chiếu; bạn chọn hạng mục, chỉnh SL đề xuất rồi Áp dụng.'}</div></div>`;
    const book = (i) => (i.book != null ? i.book : i.stock != null ? i.stock : null);
    /* Góp ý 06/11: kết quả bóc tách đã điền vào bảng Loại chi phí ở trên → màn chỉ còn dòng tóm tắt; xem / sửa danh mục bóc tách trong popup (✦ Gợi ý lại). */
    const its = D.itemsBase(), kept = its.filter((i) => !bocRow(i).bo), stock = kept.filter((i) => book(i)), warn = kept.filter((i) => i.warn), bad = its.filter((i) => bocIssue(i));
    return `<div class="lf-sub ${err.boc ? 'invalid' : ''}" data-lf-boc>${h}${fetchStrip(LF.aiBoc.fetch)}
      ${em}
      <p data-lf-boc-sum>Đã áp dụng <b>${kept.length} / ${its.length}</b> hạng mục hàng hoá vào bảng Loại chi phí ở trên${stock.length ? ` · ${stock.length} hạng mục có tồn kho sổ sách — Kho rà soát thực tế ở bước 7` : ''}${warn.length ? ` · <span class="t-warn">${warn.length} hạng mục không có trong dự toán / eBOM</span>` : ''}${bad.length ? ` · <span class="t-err">${bad.length} hạng mục chưa hợp lệ</span>` : ''}.
        ${D.bocHide ? '' : '<span class="cap">Bấm ✦ Gợi ý lại để xem / sửa danh mục bóc tách.</span>'}</p></div>`;
  }
  /* Huylx4 #20: thêm hạng mục từ dự toán = khoản mục người dùng tự thêm vào bảng Loại chi phí (bocOut → hangMucThem); không còn ô thêm riêng. */
  /* Bản lưu của màn (Lưu nháp / mở lại) — Flow.ui.lapDxms của hồ sơ. */
  const snap = () => JSON.parse(JSON.stringify({ v: LF.v, ai: LF.ai, aiBoc: LF.aiBoc, boc: LF.boc, add: LF.add, aseq: LF.aseq, cost: LF.cost, files: LF.files, pl: LF.pl, plFiles: LF.plFiles, rows: LF.rows, seq: LF.seq, rseq: LF.rseq }));
  /* T34: điền màn từ một ĐXMS có sẵn — ĐXMS chưa có hồ sơ (mode 'own') hoặc ĐXMS cần điều chỉnh (mode 'adj', D-89: chép cả căn cứ, chi phí, nhân sự). */
  function prefillFrom(x) {
    Object.assign(LF.v, { title: x.title || '', nv: x.nv || null, unit: x.unit || LF.v.unit, priority: x.priority || 'Thường', priReason: x.priReason || '',
      est: x.est != null ? dong(x.est) : '', period: x.period || '', secret: x.secret ? 'Có' : 'Không', sign: x.sign || defSign(x.secret ? 'Có' : 'Không'),
      basisTD: x.basisTD ? 'Đã phê duyệt' : 'Chưa phê duyệt', dot: x.dot != null ? String(x.dot) : '', legal: x.legal || LF.v.legal });
    if (x.fund) LF.v.fund = x.fund;
    if (x.purposeCode) LF.v.purposeCode = x.purposeCode;
    LF.cost = window.DeTai.costOf(x).map((r, i) => ({ id: 'c' + (i + 1), line: r.line, qty: r.qty == null ? '' : String(r.qty), value: dong(r.value), pkg: r.pkg || '' }));
    LF.rseq = LF.cost.length;
    LF.files = (x.basis || []).map((f, i) => ({ id: i + 1, name: f.name, type: f.type, target: 'DXMS', at: f.at }));
    LF.seq = LF.files.length;
    LF.rows = (x.roleMembers || []).map((r, i) => ({ id: 'm' + i, role: r.role, person: r.person }));
    if (LF.v.nv) nvDefaults(LF.v.nv, true);
  }
  const isAdj = () => !!(LF.base && LF.base.mode === 'adj');
  /* Giá trị hiệu lực (tỷ đồng) của ĐXMS cần điều chỉnh. */
  const adjBefore = () => { const o = LF.base && LF.base.from && Flow.findDxms(LF.base.from); return o ? window.Screens.dxmsMeta(o, window.Screens.allCases()).value : null; };
  /* T34 (người dùng 09/11): khối Điều chỉnh đầu màn Thêm mới điều chỉnh ĐXMS — chọn ĐXMS Đã phê duyệt, lần, giá trị trước, lý do. */
  function adjCard() {
    const b = LF.base, err = LF.err, o = b.from && Flow.findDxms(b.from), bf = adjBefore();
    const ok = Flow.dxmsAll().filter((x) => window.Screens.dxmsMeta(x, window.Screens.allCases()).state === 'OK');
    return `<section class="vcard" data-lf-adj><h3>Điều chỉnh</h3><div class="grid3">
      ${field('ĐXMS cần điều chỉnh', vSelect({ id: 'lf-adj-from', value: b.from, searchable: true, placeholder: 'Chọn ĐXMS đã phê duyệt', invalid: !!err.adjFrom, disabled: b.lock,
    options: ok.map((x) => ({ value: x.code, label: `${x.code} - ${x.title}` })),
    onChange: (val) => { const keep = b.reason; resetForm(); LF.base = { mode: 'adj', from: val, lock: false, reason: keep }; prefillFrom(Flow.findDxms(val)); rerender(); } }), { req: true, err: err.adjFrom, cls: 'span2' })}
      ${field('Lần điều chỉnh', `<input class="vctl" id="lf-adj-n" value="${o ? (o.adjN || 0) + 1 : ''}" placeholder="Theo ĐXMS đã chọn" disabled>`)}
      ${field('Giá trị trước điều chỉnh (đồng)', `<input class="vctl" id="lf-adj-before" value="${bf != null ? dong(bf) : ''}" placeholder="Giá trị hiệu lực của ĐXMS đã chọn" disabled>`)}
      ${field('Giá trị sau điều chỉnh (đồng)', `<input class="vctl" value="${esc(LF.v.est || '')}" placeholder="Theo Giá trị dự kiến ở Thông tin chung" disabled>`)}
      ${field('Mã ĐXMS mới', '<input class="vctl" placeholder="Hệ thống tự sinh khi Lưu" disabled>')}
      ${field('Lý do điều chỉnh', `<textarea class="vctl ta" id="lf-adjReason" rows="2" maxlength="2000" placeholder="Nhập lý do điều chỉnh" ${err.adjReason ? 'aria-invalid="true"' : ''}>${esc(b.reason || '')}</textarea>`, { req: true, err: err.adjReason, cls: 'span3' })}
    </div></section>`;
  }
  /* Việc bước 1 / 4 / 5 của hồ sơ MS01 (luồng chính, không Điều chỉnh / KĐT / hợp đồng) mở màn Lập ĐXMS thay cho popup eForm. */
  function isLap(tok) {
    const s = Flow.state;
    return !!(tok && LAP_TASKS.includes(String(tok.task)) && !s.kdt && !s.parent && !(s.vars || {}).adj && /^MS01/.test(String((s.vars || {}).process || ''))
      && Flow.tokensFor(s.persona).some((t) => t.id === tok.id));
  }
  function loadEdit(tok) {
    resetForm();
    const x = Flow.findDxms(Flow.state.dxms) || {}, sv = (Flow.ui || {}).lapDxms;
    if (sv) { Object.assign(LF, JSON.parse(JSON.stringify(sv))); if (!LF.aiBoc && LF.ai) LF.aiBoc = { nv: LF.ai.nv, fetch: LF.ai.fetch }; }
    else {
      Object.assign(LF.v, { title: x.title || Flow.state.name || '', nv: x.nv || null, unit: x.unit || LF.v.unit, priority: x.priority || 'Thường', priReason: x.priReason || '',
        est: x.est != null ? dong(x.est) : '', period: x.period || '', secret: x.secret ? 'Có' : 'Không', sign: x.sign || defSign(x.secret ? 'Có' : 'Không'),
        basisTD: x.basisTD ? 'Đã phê duyệt' : 'Chưa phê duyệt', dot: x.dot != null ? String(x.dot) : '', legal: x.legal || LF.v.legal });
      LF.cost = (x.cost || []).map((r, i) => ({ id: 'c' + (i + 1), line: r.line, qty: r.qty == null ? '' : String(r.qty), value: dong(r.value), pkg: r.pkg || '' }));
      LF.rseq = LF.cost.length;
      LF.files = (x.basis || []).map((f, i) => ({ id: i + 1, name: f.name, type: f.type, target: 'DXMS', at: f.at }));
      LF.seq = LF.files.length;
      /* Review nhi 06/11 #19: Nhân sự thực hiện đã chỉ định của luồng hiện lại ở màn. */
      LF.rows = (x.roleMembers || []).map((r, i) => ({ id: 'm' + i, role: r.role, person: r.person }));
      /* Hồ sơ đã có kết quả gợi ý (bước 4, 5 làm trước đó / demo) → hiện lại; chưa có thì chờ người dùng bấm Gợi ý từ AI. */
      const u0 = Flow.ui || {};
      if (u0.aiGoiY || u0.bocTach) { runAi(LF.v.nv); LF.aiBoc = LF.v.nv ? { nv: LF.v.nv, fetch: aiFetch(LF.v.nv) } : null; }
      /* Giá trị đã ghi trên hồ sơ (bước 4, 5 đã làm trước đó, hoặc dữ liệu demo) → điền lại màn. */
      const u = Flow.ui || {};
      if (u.fund != null) LF.v.fund = u.fund;
      if (u.purposeCode) LF.v.purposeCode = u.purposeCode;
      if (LF.v.nv) nvDefaults(LF.v.nv, true);
      if (LF.ai && u.aiGoiY) LF.ai.rows.forEach((r) => { const s = u.aiGoiY.find((x) => x.key === r.key); if (s) Object.assign(r, { quyetDinh: s.quyetDinh || null, noiDungSua: s.noiDungSua || '' }); });
      (u.bocTach || []).forEach((b) => { LF.boc[b.n] = { prop: String(b.prop), bo: !!b.bo }; });
    }
    LF.err = {};
    LF.edit = { tok: tok.id, code: Flow.state.dxms };
  }
  /* Gửi: hoàn thành các bước người dùng còn mở trong 1 / 4 / 5 theo thứ tự; service task 2, 3, 6 máy luồng tự chạy. */
  function basicOut() {
    const v = LF.v;
    return { aiGoiY: (LF.ai ? LF.ai.rows : []).filter((r) => r.quyetDinh).map((r) => ({ key: r.key, muc: r.muc, goiY: r.goiY, nguon: r.nguon, quyetDinh: r.quyetDinh, noiDungSua: r.noiDungSua })),
      tenDeXuat: v.title.trim(), purposeCode: v.purposeCode, fund: v.fund, secret: v.secret === 'Có' };
  }
  function bocOut() {
    const rows = D.itemsBase().map((i) => ({ n: i.n, prop: bocRow(i).bo ? 0 : Number(estNum(bocRow(i).prop)), bo: !!bocRow(i).bo }));
    const e5 = window.EForms.MS01({ task: 5 }, window.EVars.h);
    return e5.write({ bocTach: rows, hangMucThem: LF.add.map((r) => ({ line: r.line, sl: Number(estNum(r.sl)) }))
      /* Góp ý 06/11: khoản mục người dùng tự thêm vào bảng Loại chi phí (không do AI điền) = hạng mục thêm từ dự toán (Huylx4 #20). */
      .concat(LF.cost.filter((r) => r.man && !r.ai && r.line).map((r) => ({ line: r.line, sl: Number(estNum(r.qty)) || 1 }))) });
  }
  function submitSteps() {
    const done = [];
    for (let g = 0; g < 6; g++) {
      const t = Flow.state.tokens.find((x) => LAP_TASKS.includes(String(x.task)));
      if (!t) break;
      const k = String(t.task);
      if (k === '4') Flow.setUiMany(basicOut());
      if (k === '5') Flow.setUiMany(bocOut());
      Flow.complete(t.id, k === '5' ? Flow.mainChoice(5) : null);
      done.push(k);
    }
    return done;
  }

  function form() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create)
    const v = LF.v, err = LF.err;
    const txt = (k, ph, max) => `<input class="vctl" id="lf-${k}" maxlength="${max || 255}" placeholder="${ph}" value="${esc(v[k])}" ${err[k] ? 'aria-invalid="true"' : ''}>`;
    const info = {
      scr: 'SCR-96', name: 'Lập đề xuất mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-01, 02, UR-DX-20', bpmn: 'MS01 v1.1 task 01–06 (DX-11)',
      notes: [
        '<b>Review nhi 06/11 #1:</b> bỏ khối <b>Thông tin cơ bản</b> (bước 4). Nhóm mục đích mua sắm, Nguồn vốn chuyển vào khối Thông tin chung (AI bước 3 gợi ý ở popup ✦ Gợi ý từ AI của khối). Các mục nội dung Tờ trình (mục đích, phạm vi, biện pháp, kế hoạch…) không nhập ở màn này — AI gợi ý sẵn, người dùng nhập / sửa ở bước lập dự thảo Tờ trình (11 / 12) theo đúng mục của mẫu BM-01 / BM-09. Bước 4 BPMN vẫn hoàn thành khi Gửi.',
        '<b>Người dùng 09/11 (T34 v0.2):</b> bỏ nhãn "Bước n" ở các khối và dòng giải thích BPMN đầu màn (bước 1–5 / AI bước 2, 3, 6 / Gửi = hoàn thành 1–5, chuyển 5.1) — nội dung còn ở ghi chú này.',
        '<b>T29 B19 — màn Lập ĐXMS gộp bước 1–5 của BPMN MS01 v1.1</b> (người dùng 06/11, plan T29 §3.12): người làm bước <b>1</b> (Thông tin dự án / đề tài, Căn cứ pháp lý), <b>4</b> (Thông tin cơ bản), <b>5</b> (Bóc tách); AI làm bước <b>2</b> (lấy dữ liệu căn cứ khi chọn đề tài — dải ✦ Bước 2), <b>3</b> (gợi ý từng mục thông tin cơ bản kèm nguồn, người dùng Chấp nhận / Sửa / Bỏ; Nhóm mục đích, Nguồn vốn điền sẵn ✦ AI), <b>6</b> (đối chiếu SL gốc dự toán / eBOM, đã dùng, đang giữ, tồn kho sổ sách, còn được dùng trên từng dòng bóc tách) ngay trên màn.',
        '<b>Lưu nháp</b> = tạo ĐXMS + hồ sơ + khởi tạo quy trình; hồ sơ dừng ở việc <b>Lập đề xuất mua sắm (bước 01–05)</b> của người tạo — mở từ Việc của tôi vào lại màn này (không mở popup). <b>Gửi</b> = kiểm tra cả ba phần (mọi gợi ý AI đã xử lý, bóc tách không vượt số còn được dùng) rồi hoàn thành bước 1 → 5 một lượt (2, 3 máy luồng tự chạy) → bước 5.1 Chỉ huy ĐVĐX xác nhận (bỏ qua khi người tạo là Chỉ huy). Service task 6 của sơ đồ chạy sau 5.1 (thứ tự DX-10); kết quả đối chiếu của bước 6 người dùng đã thấy trên màn khi bóc tách. Chỉ huy Trả lại ở 5.1 → việc bước 05 mở lại màn này.',
        'Bóc tách: SL đề xuất vượt số còn được dùng (SL gốc − đã dùng ở ĐXMS khác) chặn Gửi — BE chặn theo BR-DXMS-04-11; hạng mục không có trong dự toán / eBOM chỉ cảnh báo (BBLV 09/09). Thêm hạng mục từ dự toán đề tài / dự án như form bước 5 cũ (Huylx4 #20).',
        '<b>DX-11 (đề xuất BA)</b>: bản thật gộp user task 01, 04, 05 thành một user task "Lập ĐXMS"; 02, 03, 06 là dịch vụ AI / tích hợp gọi theo yêu cầu từ màn (API đồng bộ, lưu kết quả kèm nguồn), không phải service task nối tiếp sau user task. Prototype giữ sơ đồ, lịch sử ghi đủ từng bước. <b>GIẢ LẬP</b>: kết quả AI là dữ liệu mẫu — P-216 (AI tự chạy khi chọn căn cứ, có Gợi ý lại), P-217 (đổi căn cứ: dòng đã Sửa giữ nội dung, gắn "Căn cứ đã đổi — xem lại"), P-218 (nguồn tồn kho sổ sách).',
        '<b>Một lần Lưu = tạo ĐXMS + hồ sơ Phê duyệt + khởi tạo quy trình</b> (T17 D-26). Thật: BE gọi lần lượt API tạo ĐXMS (wf_tasks) và tạo hồ sơ (profile-form, Lưu = start). Tên hồ sơ = tên luồng. Hồ sơ Điều chỉnh (MS02) tạo sau trong luồng.',
        '<b>Căn cứ pháp lý = tệp đính kèm</b> (D-30; T29 B12 đổi nhãn "Căn cứ đầu vào" theo Huylx4 #11): mỗi tệp chọn Loại tài liệu căn cứ (Danh mục dùng chung › Loại tài liệu căn cứ, SCR-99). Loại có Áp dụng cho ĐXMS và hồ sơ thì chọn Gắn vào; tệp gắn ĐXMS nằm ở Tài liệu đính kèm của luồng, tệp gắn hồ sơ nằm ở Danh sách tài liệu của hồ sơ. Thiếu tệp của loại <b>Bắt buộc</b> thì không Lưu được.',
        '<b>Nhân sự thực hiện</b> (<b>D-75</b>, RV-PROTO-0511 #14, Huylx4 #12–14 — thay "mỗi dòng một bước" của D-27): bảng chỉ có <b>Vai trò thực hiện</b> + <b>Người thực hiện</b>. Vai trò = mọi vai trò có bước người dùng trong các luồng (MS01 .01 / .02 / .03, MS02); ĐTMS quản lý danh mục Vai trò thực hiện, <b>đồng bộ từ quy trình Camunda</b> (roleCode ở Candidate Users của User Task). Chọn vai trò rồi chọn <b>một</b> người: người đó nhận mọi task của vai trò trong luồng ĐXMS. Mỗi vai trò một dòng; vai trò không có dòng giao theo vai trò như quy trình. Tab Nhân sự thực hiện của Chi tiết luồng (SCR-97) vẫn hiện theo bước để Cập nhật nhân sự từng bước (D-28).',
        'Cơ chế như nhiệm vụ KHCN: task-create có hai bảng Nhân sự khởi tạo / thẩm định theo Vai trò thực hiện (category execution-roles); BE TaskService.syncCreatedProcessCandidateUsers đổi roleCode → username khi task được tạo.',
        'CQCM không nằm trong bảng: đơn vị CQCM chọn ở task 16 theo quy trình. Ban ĐTXD / TGĐ Tập đoàn là bên ngoài (giả lập), không gán.',
        'Trường Thông tin chung như Thêm mới ĐXMS (SCR-28). Mã ĐXMS và mã hồ sơ do hệ thống sinh.',
        '<b>T29 B1 (D-54, RV-PROTO-0511 mục 4):</b> không có trường Quy trình — hồ sơ chạy một quy trình <b>MS01 Phê duyệt đề xuất mua sắm</b>. Luồng con MS01.01 / .02 / .03 là biến của hồ sơ: dự kiến theo Giá trị dự kiến và Căn cứ đã được phê duyệt, hệ thống đặt lại ở cổng sau bước 10 theo Tổng giá trị báo giá và ngưỡng hồ sơ giữ (P-34); bước 48 TTMS chọn có / không báo cáo TGĐ Tập đoàn → .01 / .02. Cột Quy trình hiện "MS01" trước cổng, ".0x (dự kiến)" tới bước 48.',
        '<b>Căn cứ đã được phê duyệt</b> (D-77, RV-PROTO-0511 mục 18): căn cứ đã được CT/TGĐ Tập đoàn phê duyệt hay chưa; ĐVĐX sửa được tới bước 10 khi có báo giá cuối cùng; là lựa chọn mặc định của bước 48 (Đã phê duyệt → Không báo cáo Tập đoàn), TTMS vẫn xác nhận.',
        '<b>T29 — Đợt mua sắm</b> (HT-DXMS-NOTE màn 8 "V/v đề xuất mua sắm; Đợt số"; "TTr" = ĐXMS): gợi ý số ĐXMS đã có của nhiệm vụ / đề tài, dự án + 1, đơn vị sửa được (GIẢ LẬP P-192). SRS-DXMS chưa có (D-59). Các trường khác của màn Thêm mới TTr cũ đã có cách làm khác: Loại biểu mẫu → Quy trình; Cấp phê duyệt → bước 48; đơn vị phê duyệt, chân ký → quy tắc ký; Hình thức trình ký → theo Mật; Căn cứ pháp lý → Căn cứ đầu vào; người thẩm định → chọn CQCM ở bước 16.',
        '<b>T29 cách 1 (người dùng chọn 04/11)</b> — đưa các trường của màn Thêm mới TTr cũ lên màn này: <b>Loại biểu mẫu, Cấp phê duyệt chỉ đọc</b>, hệ thống suy — <b>T29 B12 (RV-PROTO-0511 #6)</b>: chưa có Giá trị dự kiến thì để trống, có thì điền đúng nhãn hệ thống cũ (ĐXMS có giá trị dưới nhóm B / nhóm B trở lên; Tổng công ty / Tập đoàn); hệ thống đặt lại theo Tổng giá trị báo giá ở cổng sau bước 10, Cấp phê duyệt nhóm B trở lên TTMS chốt ở bước 48. <b>AI kiểm tra quy tắc bảo mật</b> khi Mật = Có (như Thêm mới ĐXMS, BR-DXMS-01-07). <b>Nội dung căn cứ pháp lý</b> nhập text kèm tệp căn cứ.',
        '<b>T29 B12 (RV-PROTO-0511 bản 2)</b>: <b>Hình thức trình ký</b> chọn VOffice / Bản cứng, mặc định Bản cứng khi Mật = Có (<b>D-74</b> — lệch BR-DXMS-C-25 "hồ sơ Mật ký bản giấy", đã ghi câu hỏi cho BA). <b>Mức ưu tiên Khẩn / Thượng khẩn</b> bắt buộc nhập <b>Lý do ưu tiên</b> (#1 — review ghi ở dòng "Tìm kiếm", prototype đặt ở Thêm mới vì tìm kiếm không nhập lý do; GIẢ LẬP P-207). <b>Bỏ Mục đích</b> (#7) — Mục đích của tờ trình soạn ở bước dự thảo BM-01 / BM-09. <b>Giá trị dự kiến, Giá trị dự tính nhập số thường (đồng)</b> (#8; màn khác vẫn hiện tỷ đồng — P-208). <b>Hình thành gói thầu</b> là dropdown (#14; GIẢ LẬP P-206). <b>Đề tài / dự án</b> lên đầu, khối bóc tách chi phí ngay sau, trước Mã ĐXMS / Tên luồng (#11, Huylx4 #2, #10).',
        '<b>Thông tin dự án / đề tài</b> (T29 S8, YC-DXMS-PROTO §4.1): chọn Loại chi phí → Khoản mục chi phí (2 dropdown liên hoàn) → <b>+ Thêm vào ĐXMS</b>, nhập Số lượng đề xuất và Giá trị dự tính. Danh sách lấy từ <b>bảng dự toán của đề tài / dự án</b> (SCR-104, D-65), chỉ khoản mục TTMS đã tích <b>Chi mua sắm</b> và còn khả dụng (dự toán − ĐXMS đã phê duyệt − ĐXMS đang giữ, cùng hàm với SCR-104). Chọn nhiều lần, nhiều loại chi phí (BG-0411). Vượt khối lượng / giá trị còn lại: cảnh báo đỏ, không chặn (BR-DXMS-02-04); chặn ở bước 10 (P1, BR-DXMS-04-11 — B4). Vượt giá trị dự toán của dòng: chặn Lưu.',
        '<b>D-60</b>: đề tài / dự án Loại KHCN — dòng thêm vào là hạng mục căn cứ của ĐXMS, BE ghi bảng giữ chỗ dòng dự toán ↔ ĐXMS khi Lưu và biến <code>duToanChon</code> cho bước 01, 05 (bảng chỉ xem). Loại khác — dự toán tham khảo, căn cứ là tài liệu đính kèm (D-30). Danh mục hàng hoá để rà soát tồn kho, báo giá (bocTach) chưa nối với dòng dự toán — làm ở B3 (S4). <b>Cần dev riêng</b>: bảng giữ chỗ, dropdown phụ thuộc trong eForm. Dữ liệu dự toán GIẢ LẬP P-193 (= DTMS_Q_0070).',
        '<b>T29 B17 — Căn cứ pháp lý điền sẵn</b> hai căn cứ như màn Soạn thảo TTr và mẫu tờ trình cũ (HT-DXMS-IMG, HT-DXMS-TT): QĐ 12868/QĐ-CNVTQĐ và QT.CNVTQĐ.ĐTXD.8.6.3.23; người tạo sửa được. Thật: tham số hệ thống TTMS cập nhật (GIẢ LẬP P-211 — QT 8.6.3.23 chưa có trong bộ chuẩn).',
        '<b>Review nhi 06/11 #18, #19, #20:</b> tạm ẩn bảng AI bước 6 trong popup Bóc tách (GIẢ LẬP P-223, cờ <code>D.bocHide</code>); popup còn dữ liệu căn cứ và bảng điền Loại chi phí. Nhân sự thực hiện hiện cả khi mở lại ở Việc của tôi. Bỏ khối Phụ lục kèm theo Tờ trình khỏi màn này — chưa có giá trị báo giá thì chưa biết biểu mẫu; phụ lục chọn ở Checklist bước Soạn thảo tờ trình (thay P-212; hàm <code>phuLucCard</code> giữ trong code, không dùng).',
        '<b>T29 B17 — Phụ lục kèm theo Tờ trình</b> (hiện không dùng ở màn này, xem trên; HT-DXMS-IMG: 6 cờ Có / Không, mặc định Không; HT-DXMS-NOTE màn 8 "đính file"): chọn <b>Có</b> thì tải tệp được ngay, không bắt buộc khi tạo. Ở bước lập dự thảo Tờ trình sửa được lựa chọn; phụ lục Có bắt buộc có tệp mới gửi được; Checklist ghi Bắt buộc / Không áp dụng; Tờ trình in mục Danh mục hồ sơ kèm theo (GIẢ LẬP P-212). Danh sách 6 loại là danh mục Loại tài liệu (cấu hình).',
        '<b>Bỏ Danh sách người thẩm định</b> (D-75, RV-PROTO-0511 #14 và câu hỏi 4, Huylx4 #3): trùng Nhân sự thực hiện; CQCM thẩm định chọn ở bước 16 (D-27 giữ phần này), DX-08 / D-62 rút.',
      ],
      q: ['P-84', 'P-34', 'P-192', 'P-193', 'P-206', 'P-207', 'P-208', 'P-211', 'P-212', 'P-216', 'P-217', 'P-218'], src: 'task-management/components/task-create (mode create) + profile-management/profile-form · /task-management/create',
    };
    const dv = derived(v), urgent = v.priority && v.priority !== 'Thường';
    const ro = (id, val, ph) => `<input class="vctl" id="${id}" value="${esc(val)}" placeholder="${ph}" disabled>`;
    /* T45 V0.4 SRS 12 3.1.3: ĐXMS đã có (đã Lưu nháp / bị trả lại / ĐXMS mẫu chưa có hồ sơ) → nút Xóa; bị trả lại → khối Lý do trả lại đầu màn. */
    const cur = isAdj() ? null : LF.edit ? LF.edit.code : LF.base && LF.base.mode === 'own' ? LF.base.code : null;
    const curX = cur && Flow.findDxms(cur), ret = cur ? (lapState(cur) || {}).returned : null;
    const canDel = !!(curX && editOf(curX, window.Screens.dxmsMeta(curX, window.Screens.allCases()).state));
    if (cur) info.notes = ['<b>T45 — SRS 12 V0.4 mục 3.1.3:</b> mở ĐXMS đã có (chưa gửi hoặc bị Chỉ huy ĐVĐX Trả lại ở 5.1) thì có nút <b>Xóa</b> (hộp thoại xác nhận, xóa mềm, về Danh sách) và, khi bị trả lại, khối <b>Lý do trả lại</b> đọc lịch sử xử lý bước 5.1 lần gần nhất. Gửi lại thì quy trình sang lại 5.1, tag và khối mất.'].concat(info.notes);
    return `<form class="pg" data-luong-form>
      ${isAdj() ? head({ title: 'Thêm mới điều chỉnh ĐXMS', back: 'luong', lg: true, info: adjInfo(), right: '<button type="button" class="vbtn secondary grey" data-go="luong">Huỷ</button><button type="submit" class="vbtn primary" id="lf-save">Lưu</button>' })
    : head({ title: 'Lập đề xuất mua sắm', back: LF.edit ? 'viec-cua-toi' : 'luong', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="${LF.edit ? 'viec-cua-toi' : 'luong'}">Huỷ</button>${canDel ? `<button type="button" class="vbtn red" id="lf-del" data-lf-delx="${esc(cur)}">Xóa</button>` : ''}<button type="button" class="vbtn secondary" id="lf-draft">Lưu nháp</button><button type="submit" class="vbtn primary" id="lf-save">Gửi</button>` })}
      ${ret ? `<div class="lf-ret" data-lf-ret role="note"><b>Chỉ huy đơn vị đề xuất đã trả lại lúc ${esc(ret.at)} — ${esc(ret.who)}:</b> ${esc(ret.reason) || '<span class="faint">Không có lý do</span>'}</div>` : ''}
      ${isAdj() ? adjCard() : ''}
      ${costCard()}
      <section class="vcard" data-lf-chung><div class="vcard-h"><h3>Thông tin chung</h3>${v.nv ? `<div class="row">${aiBtn('chung')}</div>` : ''}</div>
        <div class="grid3">
          ${field('Mã ĐXMS', `<input class="vctl" placeholder="Hệ thống tự sinh" value="${esc(LF.edit ? LF.edit.code : LF.base && LF.base.mode === 'own' ? LF.base.code : '')}" disabled>`)}
          ${field('Tên đề xuất mua sắm', txt('title', 'Ví dụ: Đề xuất mua sắm cho dự án A', 500), { req: true, err: err.title, cls: 'span2' })}
          ${purposeFields()}
          ${field('Đơn vị đề xuất', vSelect({ id: 'lf-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit, disabled: isAdj(),
    options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd((x) => { v.unit = x; delete err.unit; }) }), { req: true, err: err.unit })}
          ${field('Căn cứ đã được phê duyệt', vSelect({ id: 'lf-basis-td', value: v.basisTD, options: ['Chưa phê duyệt', 'Đã phê duyệt'].map((p) => ({ value: p, label: p })),
    onChange: upd((x) => { v.basisTD = x; }) }), { req: true })}
          ${field('Giá trị dự kiến (đồng)', txt('est', 'Nhập giá trị dự kiến', 20), { err: err.est })}
          ${field('Mức ưu tiên', vSelect({ id: 'lf-pri', value: v.priority, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })),
    onChange: upd((x) => { v.priority = x; if (x === 'Thường') delete err.priReason; }) }), { req: true })}
          ${urgent ? field('Lý do ưu tiên', `<textarea class="vctl ta" id="lf-priReason" rows="1" maxlength="1000" placeholder="Nhập lý do chọn mức ${esc(v.priority)}" ${err.priReason ? 'aria-invalid="true"' : ''}>${esc(v.priReason)}</textarea>`, { req: true, err: err.priReason, cls: 'span2' }) : ''}
          ${field('Mật', vSelect({ id: 'lf-sec', value: v.secret, disabled: isAdj(), options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd((x) => { v.secret = x; v.sign = defSign(x); }) }))}
          ${field('Hình thức trình ký', vSelect({ id: 'lf-sign', value: v.sign, searchable: false, options: SIGNS.map((p) => ({ value: p, label: p })), onChange: upd((x) => { v.sign = x; }) }), { req: true })}
          ${field('Đợt mua sắm', txt('dot', 'Nhập số đợt', 3), { err: err.dot })}
          ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 09/2027'))}
          ${field('Loại biểu mẫu', ro('lf-d-form', dv.form, 'Xác định theo giá trị báo giá (bước 10)'))}
          ${field('Cấp phê duyệt', ro('lf-d-level', dv.level, 'Xác định theo giá trị báo giá (bước 10)'))}
          ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section>
      ${v.secret === 'Có' ? S5().secCheckCard({ title: v.title, unit: v.unit }, 'lf', { skip: ['purpose'] }) : ''}
      ${basisCard()}${membersCard()}</form>`;
  }

  /* T29 B19: mode 'draft' = Lưu nháp (kiểm tra như Lưu cũ), 'send' = Gửi (thêm bước 4, 5: mọi gợi ý AI đã xử lý, Nhóm mục đích, Nguồn vốn, bóc tách không vượt). */
  function save(mode) {
    readInputs();
    if (isAdj()) { saveAdj(); return; }
    const send = mode !== 'draft';
    const v = LF.v, err = LF.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên đề xuất mua sắm.';
    if (!v.nv) err.nv = 'Bạn cần chọn Đề tài / dự án.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
    const est = dongIn(v.est);
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Giá trị dự kiến không đúng định dạng.';
    /* Hồ sơ mở lại không tạo từ màn này (ĐXMS mẫu / SCR-28): Lý do ưu tiên, tệp căn cứ loại bắt buộc đã có trên hồ sơ — không bắt nhập lại (GIẢ LẬP). */
    /* T34: ĐXMS mẫu / sao chép lập hồ sơ trên chính nó (lapOwn) — dữ liệu có trước màn này, xử lý như hồ sơ cũ (GIẢ LẬP). */
    const xo = Flow.findDxms(LF.edit ? LF.edit.code : LF.base && LF.base.mode === 'own' ? LF.base.code : '') || {};
    const legacy = (!!LF.edit || (!!LF.base && LF.base.mode === 'own')) && (!xo.luong || !!xo.lapOwn);
    if (v.priority !== 'Thường' && !v.priReason.trim() && !legacy) err.priReason = 'Bạn cần nhập Lý do ưu tiên.';
    if (v.dot.trim() !== '' && !/^[1-9]\d{0,2}$/.test(v.dot.trim())) err.dot = 'Đợt mua sắm là số nguyên dương.';
    const ce = {};
    LF.cost.forEach((r) => {
      const n = dongIn(r.value), q = estNum(r.qty), l = costLine(r.line), e = {};
      if (q == null) e.qty = 'Bạn cần nhập Số lượng đề xuất.';
      else if (Number.isNaN(q) || q <= 0) e.qty = 'Số lượng đề xuất không đúng định dạng.';
      if (n == null) e.val = 'Bạn cần nhập Giá trị dự tính.';
      else if (Number.isNaN(n) || n <= 0) e.val = 'Giá trị dự tính không đúng định dạng.';
      else if (l && n > l.value) e.val = `Vượt giá trị dự toán (${dong(l.value)} đồng).`;
      if (Object.keys(e).length) ce[r.id] = e;
      else if (costWarn(r)) ce[r.id] = { over: costWarn(r) }; // T45: vượt Còn lại khả dụng chặn Lưu nháp, Gửi (BR-LDX-02-04)
    });
    if (Object.keys(ce).length) err.cost = ce;
    if (LF.files.some((f) => !f.type)) { err.types = true; err.basis = 'Bạn cần chọn Loại tài liệu căn cứ cho mọi tài liệu.'; }
    const miss = !legacy ? basisTypes().filter((t) => t.req === 'CO' && !LF.files.some((f) => f.type === t.code)) : [];
    if (!err.basis && miss.length) err.basis = `Thiếu tài liệu căn cứ bắt buộc: ${miss.map((t) => t.name).join('; ')}.`;
    const re = {};
    LF.rows.forEach((r) => {
      const e = {};
      if (!r.role) e.role = 'Bạn cần chọn Vai trò thực hiện.';
      else if (!r.person) e.person = 'Bạn cần chọn Người thực hiện.';
      if (Object.keys(e).length) re[r.id] = e;
    });
    if (Object.keys(re).length) err.rows = re;
    if (send && v.nv && !LF.aiBoc) err.boc = 'Bạn cần bấm Gợi ý từ AI ở khối Căn cứ và nội dung mua sắm, xem lại bóc tách rồi Áp dụng trước khi gửi.';
    else if (send && aiBocOld()) err.boc = 'Đề tài / dự án đã đổi — bấm Gợi ý lại ở khối Căn cứ và nội dung mua sắm rồi Áp dụng trước khi gửi.';
    /* Review nhi 06/11 #1: Nhóm mục đích, Nguồn vốn ở Thông tin chung — bắt buộc khi Gửi (không còn bảng 7 mục phải xử lý ở màn này). */
    if (send) {
      if (!v.purposeCode) err.purposeCode = 'Bạn cần chọn Nhóm mục đích mua sắm.';
      if (!v.fund) err.fund = 'Bạn cần chọn Nguồn vốn.';
    }
    if (send && LF.aiBoc && !err.boc) {
      const items = D.itemsBase(), bad = items.filter((i) => bocIssue(i));
      if (bad.length) err.boc = `Bóc tách chưa hợp lệ: ${bad.map((i) => `${i.name} — ${bocIssue(i)}`).join(' ')}`;
      else if (!items.some((i) => !bocRow(i).bo) && !LF.add.length && !LF.cost.some((r) => r.man && !r.ai)) err.boc = 'Bạn cần giữ ít nhất một hạng mục trong ĐXMS.';
      const ae = {};
      LF.add.forEach((r) => { const q = estNum(r.sl); if (q == null || Number.isNaN(q) || q <= 0 || !Number.isInteger(q)) ae[r.id] = 'SL đề xuất là số nguyên dương.'; });
      if (Object.keys(ae).length) err.add = ae;
    }
    /* Lỗi có thể nằm ngoài màn hình (vd card Căn cứ ở cuối) → cuộn tới lỗi đầu tiên + toast, tránh cảm giác bấm Lưu không có tác dụng. */
    if (Object.keys(err).length) {
      rerender();
      const first = document.querySelector('[data-luong-form] .vfield.invalid, [data-luong-form] [aria-invalid="true"], [data-luong-form] .msg, [data-luong-form] .lf-err, [data-luong-form] [data-lf-cwarn]');
      if (first) first.scrollIntoView({ block: 'center' });
      toast(send ? 'Chưa gửi được. Kiểm tra các trường báo lỗi.' : 'Chưa lưu được. Kiểm tra các trường báo lỗi.', 'warn');
      return;
    }
    const now = Flow.dateOf(Flow.state.clock);
    const basis = LF.files.filter((f) => f.target === 'DXMS').map((f) => ({ name: f.name, type: f.type, at: f.at || now }));
    const caseFiles = LF.files.filter((f) => f.target === 'PD').map((f) => ({ name: f.name, type: f.type }));
    const rec = { title: v.title.trim(), nv: v.nv, unit: v.unit, priority: v.priority, priReason: v.priority !== 'Thường' ? v.priReason.trim() : '', est, period: v.period.trim(),
      secret: v.secret === 'Có', sign: v.sign, basisTD: v.basisTD === 'Đã phê duyệt', basis, dot: v.dot.trim() ? Number(v.dot.trim()) : null, legal: v.legal.trim(),
      cost: LF.cost.map((r) => Object.assign({}, costLine(r.line), { line: r.line, qty: estNum(r.qty), value: dongIn(r.value), budget: costLine(r.line).value, pkg: r.pkg || '' })) };
    const phuLuc = D.phuLuc.reduce((o, [k]) => Object.assign(o, { [k]: LF.pl[k] === 'Có' ? 'Có' : 'Không' }), {});
    let code;
    if (LF.edit) {
      /* Mở lại từ Việc của tôi: cập nhật ĐXMS của luồng, biến hồ sơ. Review nhi 06/11 #19: Nhân sự thực hiện sửa được ngay ở việc Lập ĐXMS
         (Thay theo vai trò cho các bước chưa xong — cùng cơ chế SCR-98, có lịch sử; các bước của màn này giữ người đang làm). */
      code = LF.edit.code;
      const own = Flow.state.dxmsUser.find((x) => x.code === code);
      if (own) Object.assign(own, rec, { updated: now });
      const proc0 = Flow.state.vars.process, before = (own && own.roleMembers) || [];
      LF.rows.filter((r) => r.role && r.person && !before.some((b) => b.role === r.role && b.person === r.person)).forEach((r) => {
        const ro = rolesOf(proc0).find((x) => x.code === r.role);
        const tasks = ro ? ro.tasks.filter((k) => !LAP_TASKS.includes(String(k)) && Flow.taskStatus(k) !== 'done') : [];
        if (tasks.length) Flow.updateRole({ role: r.role, roleName: ro.name, tasks, mode: 'replace', add: [r.person], drop: [...new Set(tasks.flatMap((k) => Flow.membersOf(k).list))] });
      });
      Flow.state.name = rec.title;
      Object.assign(Flow.state.vars, { basisTD: rec.basisTD, phuLuc });
    } else {
      const members = membersByRole(LF.rows), roleMembers = LF.rows.map((r) => ({ role: r.role, person: r.person }));
      /* T34 mode 'own': ĐXMS đã có (chưa có hồ sơ) → cập nhật ĐXMS đó rồi tạo hồ sơ, không sinh mã mới. */
      code = Flow.createLuong(Object.assign(rec, { members, roleMembers }),
      /* DX-10 (b): người tạo là Chỉ huy ĐVĐX → bỏ qua bước 5.1 Chỉ huy ĐVĐX xác nhận khởi tạo. */
        { process: curProc(), name: v.title.trim(), caseFiles, dxms: LF.base && LF.base.mode === 'own' ? LF.base.code : null, vars: { basisTD: rec.basisTD, creatorCh: (persona(Flow.state.persona) || {}).urd === 'R-DVDX-CH', phuLuc } });
    }
    /* Tệp phụ lục tải khi tạo → Danh sách tài liệu của hồ sơ (cùng khoá với bước lập dự thảo). */
    D.phuLuc.forEach(([k]) => { if (LF.pl[k] === 'Có' && LF.plFiles[k]) Flow.setUi(k, LF.plFiles[k]); });
    LF.wasEdit = !!LF.edit;
    LF.edit = null;
    Flow.setUiMany({ lapDxms: snap() });
    const caseCode = Flow.state.code;
    if (!send) {
      const tok = Flow.tokensFor(Flow.state.persona).find((t) => LAP_TASKS.includes(String(t.task)));
      toast(`<b>Thành công</b><br>${LF.wasEdit ? `Đã lưu nháp ${esc(code)}` : `Đã tạo ${esc(code)} và khởi tạo quy trình — Đã lưu nháp`}; tiếp tục ở việc Lập đề xuất mua sắm.`);
      location.hash = tok ? `#/task/${tok.id}` : '#/luong';
      if (tok) { loadEdit(tok); rerender(); }
      return;
    }
    submitSteps();
    const next = Flow.state.tokens.map((t) => `${stepNo(String(t.task))} · ${Flow.taskName(t.task)}`).join('; ');
    toast(`<b>Thành công</b><br>Đã gửi ${esc(code)}: xong bước 01–05${next ? `, chuyển ${esc(next)}` : ''}.`);
    location.hash = '#/viec-cua-toi';
  }

  /* ---------- T34 Thêm mới điều chỉnh ĐXMS (khuôn SCR-96, người dùng 09/11) ----------
     Lưu = tạo ĐXMS mới (dữ liệu trên màn, adjFrom = ĐXMS đã chọn) + hồ sơ Điều chỉnh, khởi tạo MS02, mở bước 1. */
  function adjInfo() {
    return { scr: 'SCR-108', name: 'Thêm mới điều chỉnh ĐXMS', uc: 'UC-07-12 · UR-DX-20', bpmn: 'Trước task 01 của MS02',
      notes: [
        '<b>T34 (người dùng 09/11, D-91):</b> màn theo khuôn <b>Lập đề xuất mua sắm</b> (SCR-96) vì điều chỉnh tạo một <b>ĐXMS mới</b> (D-85). Khối <b>Điều chỉnh</b> đầu màn: chọn ĐXMS cần điều chỉnh (chỉ ĐXMS Đã phê duyệt — bản còn hiệu lực của chuỗi), lần điều chỉnh, giá trị trước, <b>Lý do điều chỉnh</b> bắt buộc.',
        'Chọn ĐXMS thì mọi khối điền sẵn từ ĐXMS cũ (căn cứ, bảng Loại chi phí, thông tin chung, nhân sự — D-89) và <b>sửa được ngay trên màn</b>. Đề tài / dự án, Đơn vị đề xuất, Mật khoá theo ĐXMS cũ. Giá trị sau điều chỉnh = Giá trị dự kiến.',
        '<b>Người dùng 09/11 (T34 v0.2):</b> bỏ dòng giải thích Lưu dưới khối Điều chỉnh và nhãn "Bước n" trên màn — nội dung ở ghi chú dưới.',
        '<b>Lưu</b> = tạo ĐXMS mới (mã hệ thống sinh, Điều chỉnh từ ĐXMS cũ, lần n) + hồ sơ Điều chỉnh, khởi tạo MS02, mở bước 1; bước 4 của MS02 vẫn rà lại nội dung điều chỉnh. ĐXMS cũ sang Đang điều chỉnh; duyệt xong sang Đã được điều chỉnh.',
      ],
      q: ['P-102', 'P-226'], src: 'task-management/components/task-create (mode create) + profile-management/profile-form' };
  }
  function saveAdj() {
    const v = LF.v, b = LF.base, err = LF.err = {};
    if (!b.from) err.adjFrom = 'Bạn cần chọn ĐXMS cần điều chỉnh.';
    else if (window.Screens.kindBlock(b.from, 'DC')) err.adjFrom = window.Screens.kindBlock(b.from, 'DC');
    if (!(b.reason || '').trim()) err.adjReason = 'Bạn cần nhập Lý do điều chỉnh.';
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên đề xuất mua sắm.';
    const est = dongIn(v.est);
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Giá trị dự kiến không đúng định dạng.';
    if (LF.files.some((f) => !f.type)) { err.types = true; err.basis = 'Bạn cần chọn Loại tài liệu căn cứ cho mọi tài liệu.'; }
    if (Object.keys(err).length) {
      rerender();
      const first = document.querySelector('[data-luong-form] .vfield.invalid, [data-luong-form] [aria-invalid="true"]');
      if (first) first.scrollIntoView({ block: 'center' });
      toast('Chưa lưu được. Kiểm tra các trường báo lỗi.', 'warn');
      return;
    }
    const now = Flow.dateOf(Flow.state.clock);
    const basis = LF.files.filter((f) => f.target === 'DXMS').map((f) => ({ name: f.name, type: f.type, at: f.at || now }));
    const caseFiles = LF.files.filter((f) => f.target === 'PD').map((f) => ({ name: f.name, type: f.type }));
    const data = { title: v.title.trim(), priority: v.priority, priReason: v.priority !== 'Thường' ? v.priReason.trim() : '', period: v.period.trim(), sign: v.sign,
      basisTD: v.basisTD === 'Đã phê duyệt', basis, legal: v.legal.trim(), fund: v.fund || null, purposeCode: v.purposeCode || null,
      cost: LF.cost.map((r) => Object.assign({}, costLine(r.line), { line: r.line, qty: estNum(r.qty), value: dongIn(r.value), budget: (costLine(r.line) || {}).value, pkg: r.pkg || '' })),
      members: membersByRole(LF.rows), roleMembers: LF.rows.map((r) => ({ role: r.role, person: r.person })) };
    const before = adjBefore(), name = `Điều chỉnh lần ${((Flow.findDxms(b.from) || {}).adjN || 0) + 1} — ${v.title.trim()}`;
    const caseCode = Flow.createAdj({ dxms: b.from, name, before, total: est != null ? est : before, reason: b.reason.trim(), data, caseFiles });
    const tok = Flow.state.tokens.find((t) => String(t.task) === '1');
    toast(`<b>Thành công</b><br>Đã tạo ${esc(Flow.state.dxms)} điều chỉnh ${esc(b.from)} và khởi tạo quy trình MS02.`);
    LF.base = null;
    location.hash = tok ? `#/task/${tok.id}` : '#/luong';
  }

  /* ---------- SCR-97 Chi tiết luồng ----------
     Luồng đang chạy = ĐXMS của hồ sơ prototype đang chạy (một hồ sơ tại một thời điểm); luồng khác chỉ xem nhân sự đã chỉ định lúc tạo. */
  const pname = (id) => (persona(id) || { name: id }).name;
  const names = (ids) => ids.map(pname).join(', ');
  const isLive = (code) => Flow.state.dxms === code && !Flow.state.kdt && Flow.state.status !== 'new';
  const isRunning = (code) => isLive(code) && Flow.state.status === 'running';
  const CASE_ST = { processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'], moved: ['Đã chuyển quy trình', 'warning'], stopped: ['Dừng xử lý', 'default'] };
  /* D-28: bước đã xong thì khoá (P-89); bước đang mở / chưa tới cập nhật được. */
  const STEP_ST = { active: ['Đang xử lý', 'info'], todo: ['Chưa tới', 'default'], cond: ['Theo điều kiện', 'default'], done: ['Đã xong — khoá', 'success'] };
  function stepState(code, k) {
    if (!isLive(code)) return null;
    const s = Flow.taskStatus(k);
    return s === 'active' || s === 'done' || s === 'cond' ? s : 'todo';
  }
  function procOf(x) {
    if (isLive(x.code)) return Flow.state.vars.process;
    const hs = window.Screens.allCases().filter((c) => c.dxms === x.code);
    return hs.length ? hs[0].flow : null;
  }
  /* Nhân sự của bước: luồng đang chạy đọc Flow (đã gồm thay đổi), luồng khác đọc bảng chỉ định lúc tạo. */
  function membersOf(x, t) {
    if (isLive(x.code)) return Flow.membersOf(t.key);
    const list = x.members && x.members[t.key];
    return list && list.length ? { list, set: true } : { list: [t.def], set: false };
  }
  const memberCell = (m) => (m.list.length ? `<span class="clamp">${esc(names(m.list))}${m.set ? '' : ' <span class="faint">(theo vai trò)</span>'}</span>` : dash);

  /* Văn bản ký duyệt của hồ sơ đang chạy: lượt ký đã xong (Đã ký) + bước ký đang mở (Đang trình ký). Đã thu hồi: B3 (DX-04). */
  function signDocs() {
    const F = Flow.def(), signOf = (k, label) => (F[k] && F[k].choices ? Flow.choices(k).find((c) => c.sign && (label == null || c.label === label)) : null);
    const out = [];
    Flow.state.history.forEach((h) => {
      /* Văn bản do service task trình ký (bước 18 BM-03, P-225). */
      if (h.signDoc) { out.push({ doc: h.signDoc, task: h.task, who: [h.signer], st: 'SIGNED', at: Flow.dateOf(h.t) }); return; }
      const c = h.who && signOf(h.task, h.action);
      if (c) out.push({ doc: c.sign, task: h.task, who: [h.who], st: 'SIGNED', at: Flow.dateOf(h.t) });
    });
    Flow.state.tokens.forEach((t) => {
      const c = signOf(t.task);
      if (c) out.push({ doc: c.sign, task: t.task, who: t.cands || [t.who], st: 'PENDING', at: Flow.dateOf(t.since) });
    });
    return out;
  }
  const DOC_ST = { SIGNED: ['Đã ký', 'success'], PENDING: ['Đang trình ký', 'warning'], RECALLED: ['Đã thu hồi', 'default'] };
  const stepLabel = (k) => `${stepNo(String(k))} · ${Flow.taskName(k)}`;

  /* T34 v0.2 (D-93): 11 tab → 7. Căn cứ + Căn cứ & hạng mục gộp; Văn bản & ký duyệt, Kết quả, Lịch sử phiên bản (dự thảo Tờ trình) cùng Danh sách tài liệu,
     Văn bản đầu ra của SCR-20 vào "Tài liệu & văn bản"; Lịch sử thay đổi nhân sự dưới Nhân sự thực hiện; Tiến trình = Quy trình + Lịch sử xử lý của SCR-20. */
  const DT = { key: null, code: null, tab: 'info' };
  const TABS = [['info', 'Thông tin chung'], ['tien-trinh', 'Tiến trình'], ['can-cu', 'Căn cứ & hạng mục'], ['ton-kho', 'Rà soát tồn kho'], ['ycbg', 'Yêu cầu báo giá'],
    ['tai-lieu', 'Tài liệu & văn bản'], ['nhan-su', 'Nhân sự thực hiện']];
  const TAB_KEYS = TABS.map(([k]) => k);
  /* Tab theo route: đổi route (ĐXMS, việc, tab trên URL) thì đặt lại tab; bấm tab chỉ đổi DT.tab, giữ route. */
  function useTab(key, tab) { if (DT.key !== key) { DT.key = key; DT.tab = TAB_KEYS.includes(tab) ? tab : 'info'; } }
  const card = (title, body, right) => `<section class="vcard"><div class="vcard-h"><h3>${title}</h3>${right ? `<div class="row">${right}</div>` : ''}</div>${body}</section>`;
  const noLive = (what) => `<div class="lf-empty">${what} có trên đề xuất mua sắm đang chạy quy trình. Đề xuất này không chạy quy trình trên prototype.</div>`;

  /* T34: Điều chỉnh từ / Được điều chỉnh bởi / Sao chép từ (D-85, P-226). */
  const adjKv = (x, m, kv) => (x.adjFrom ? kv('Điều chỉnh từ', `<a class="link" data-go="luong/${encodeURIComponent(x.adjFrom)}">${esc(x.adjFrom)}</a>`) + kv('Lần điều chỉnh', String(x.adjN || 1)) + kv('Lý do điều chỉnh', esc(x.reason)) : '')
    + (m.adjBy ? kv(m.state === 'SUP' ? 'Được điều chỉnh bởi' : 'Đang điều chỉnh bởi', `<a class="link" data-go="luong/${encodeURIComponent(m.adjBy)}">${esc(m.adjBy)}</a>`, 'span3') : '')
    + (x.copyFrom ? kv('Sao chép từ', `<a class="link" data-go="luong/${encodeURIComponent(x.copyFrom)}">${esc(x.copyFrom)}</a>`, 'span3') : '');
  /* T34 (người dùng 09/11): Nguồn vốn (của ĐXMS, mặc định theo Đề tài / dự án) + Số / ngày TTr chủ trương, QĐ phê duyệt dự án, QĐ phê duyệt dự toán
     của Đề tài / dự án (SCR-104 card Phê duyệt) — chỉ xem, đổi theo Đề tài / dự án. */
  function dtKv(x, kv) {
    const r = window.DeTai.info(x.nv), P = window.DeTai.pair;
    const fund = x.fund ? ((window.Catalog.rows('nguon-von').find((c) => c.code === x.fund) || {}).name || D.fundNames[x.fund] || x.fund) : r && r.fund;
    return kv('Nguồn vốn', esc(fund || '')) + kv('Số / ngày TTr chủ trương', r ? P(r.x.ttrCt) : null)
      + kv('Số / ngày QĐ phê duyệt dự án', r ? P([r.qdNo, r.qdDate]) : null) + kv('Số / ngày QĐ phê duyệt dự toán', r ? P(r.x.qdDt) : null);
  }
  /* [T37 RV-PROTO-0911 #3] Thông tin chung không hiện Người được xem (chức năng cập nhật Người được xem giữ nguyên).
     Trước: ${kv('Người được xem', esc(S5().viewersText(x)))} sau Mức ưu tiên. */
  function tabInfo0(x, m) {
    const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    return `<section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo c3">
      ${kv('Mã ĐXMS', esc(x.code))}${kv('Tên đề xuất mua sắm', esc(x.title), 'span2')}
      ${kv('Đề tài / dự án', D.nvOf(x.nv) ? `<a class="link" data-go="${window.DeTai.href(x.nv)}">${esc(`${x.nv} — ${D.nvOf(x.nv).name}`)}</a>` : null, 'span2')}${kv('Quy trình', esc(procOf(x) || ''))}
      ${dtKv(x, kv)}
      ${kv('Đợt mua sắm', S5().dotOf(x) ? String(S5().dotOf(x)) : null)}${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Khối đơn vị', esc(D.blockOf(x.unit) || ''))}
      ${kv('Người tạo', esc(x.creator))}${kv('Mức ưu tiên', esc(x.priority))}
      ${x.priReason ? kv('Lý do ưu tiên', esc(x.priReason), 'span3') : ''}
      ${kv('Giá trị hiệu lực (gồm VAT)', m.value != null ? ty(m.value) + ' tỷ đồng' : null)}${kv('Giá trị dự kiến', x.est != null ? (x.luong ? dong(x.est) + ' đồng' : ty(x.est) + ' tỷ đồng') : null)}${kv('Thời gian thực hiện', esc(x.period))}
      ${kv('Trạng thái', badge(window.Screens.DXMS_STATUS[m.state][0] + (m.state === 'OK' && m.adjN ? ` (điều chỉnh lần ${m.adjN})` : ''), window.Screens.DXMS_STATUS[m.state][1]))}${kv('Mật', x.secret ? 'Có' : 'Không')}${kv('Hình thức trình ký', esc(x.sign || (x.secret ? 'Bản cứng' : 'VOffice')))}
      ${kv('Ngày cập nhật', esc(x.updated))}${adjKv(x, m, kv)}</div></section>`;
  }
  /* T37 (RV-PROTO-0911 #2): ĐXMS mẫu chưa lưu bảng bóc tách thì lấy dòng mẫu (DeTai.costOf) ghép thông tin dòng dự toán. */
  function costRows(x) {
    if (x.cost && x.cost.length) return x.cost;
    const lines = x.nv ? D.duToanOf(x.nv) : [];
    return window.DeTai.costOf(x).map((r) => { const l = lines.find((y) => y.id === r.line) || {}; return Object.assign({}, l, r, { budget: l.value }); });
  }
  function tabBasis(x) {
    const rows = (x.basis || []).map((f) => ({ name: f.name, type: f.type, to: 'ĐXMS', at: f.at }))
      .concat(isLive(x.code) ? (Flow.ui.uploads || []).filter((f) => f.type).map((f) => ({ name: f.name, type: f.type, to: `Hồ sơ ${Flow.state.code}`, at: f.at })) : []);
    return card('Căn cứ pháp lý', table([['Thao tác', 80, 'c'], ['Tên tài liệu', 280], ['Loại tài liệu căn cứ', 300], ['Gắn vào', 200], ['Ngày tạo', 120]], rows, (r) =>
      `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td><td><span class="clamp">${esc(r.name)}</span></td>
        <td>${clamp((typeOf(r.type) || {}).name)}</td><td>${esc(r.to)}</td><td class="num">${esc(r.at)}</td>`, 'Chưa có tài liệu căn cứ')
      + (x.legal ? `<div class="lf-legal"><div class="k">Nội dung căn cứ pháp lý</div><div class="v">${esc(x.legal)}</div></div>` : ''))
      + card('Thông tin dự án / đề tài', table([['Mã dự án / đề tài', 150], ['Tên dự án / đề tài', 220], ['Nguồn vốn', 170], ['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80],
        ['Số lượng đề xuất', 130, 'r'], ['Giá trị dự toán (đồng)', 170, 'r'], ['Giá trị dự tính (đồng)', 170, 'r'], ['Hình thành gói thầu', 200]], costRows(x), (r) =>
        `<td><a class="link" data-go="${window.DeTai.href(r.code)}">${esc(r.code)}</a></td><td>${clamp(r.name)}</td><td>${clamp(r.fund)}</td><td>${clamp(typeName(r.type))}</td><td>${clamp(r.item)}</td>
        <td>${esc(r.uom || '')}</td><td class="r num">${r.qty == null ? '-' : esc(String(r.qty))}</td><td class="r num">${dong(r.budget)}</td><td class="r num">${dong(r.value)}</td><td>${clamp(r.pkg)}</td>`, 'Chưa bóc tách chi phí từ dự toán'));
  }
  function tabMembers(x) {
    const proc = procOf(x), run = isRunning(x.code);
    if (!proc) return card('Nhân sự thực hiện', '<div class="lf-empty">Đề xuất mua sắm chưa bắt đầu quy trình nên chưa có bước để chỉ định nhân sự.</div>');
    const btn = run ? `<button type="button" class="vbtn red" data-um-open="">${icon('edit')} Cập nhật nhân sự</button>` : '';
    return card('Nhân sự thực hiện', table([['Thao tác', 80, 'c'], ['Bước', 70], ['Tên công việc', 280], ['Vai trò thực hiện', 170], ['Nhân sự thực hiện', 260], ['Trạng thái', 150, 'c']], tasksOf(proc), (t) => {
      const st = stepState(x.code, t.key), lock = st === 'done';
      return `<td class="c">${run ? `<button type="button" class="vbtn icon ghost" aria-label="Cập nhật nhân sự" data-um-open="${esc(t.key)}" ${lock ? 'disabled title="Bước đã xong — khoá (D-28)"' : ''}>${icon('edit')}</button>` : dash}</td>
        <td>${esc(stepNo(t.key))}</td><td><span class="clamp">${esc(t.name)}</span></td><td>${esc(t.roleName)}</td><td data-um-who="${esc(t.key)}">${memberCell(membersOf(x, t))}</td>
        <td class="c">${st ? badge(STEP_ST[st][0], STEP_ST[st][1]) : dash}</td>`;
    }), btn);
  }
  /* D-95 (người dùng 09/11): "Văn bản đầu ra" gộp Văn bản đầu ra + Văn bản & ký duyệt + Lịch sử phiên bản + Kết quả & văn bản phê duyệt — mỗi văn bản một dòng.
     Trạng thái gộp: Đang làm / AI đã gợi ý → Hoàn thành → Đang trình ký → Đã ký (n/n khi nhiều người ký) → Đang hiệu lực / Đã thay thế (văn bản phê duyệt).
     Phiên bản Tờ trình (BM-01 / BM-09) bấm mở hộp thoại Lịch sử phiên bản + So sánh. outs: văn bản của hồ sơ (task: lastOuts — xem trước theo chỉ số; xem: theo tên). */
  const OUT_TONE = { 'AI đã gợi ý': 'info', 'Đang làm': 'warning', 'Hoàn thành': 'success' };
  const dlPdf = (name) => iconBtn('file', 'Tải xuống PDF', `data-dl="${esc(String(name).replace(/\.(docx?|xlsx?|pdf)$/i, ''))}.pdf"`);
  function docRows(x, outs) {
    const rows = outs.map((d, i) => ({ code: d.code, name: d.name, at: d.at, by: d.by, st: d.st || 'Hoàn thành', i, signs: [] }));
    const find = (code) => rows.find((r) => r.code === code);
    if (isLive(x.code)) signDocs().forEach((sg) => {
      let r = find(sg.doc) || find(sg.doc.split(' ')[0]); // "BM-04 + Checklist 01" (ký lại bước 36) → dòng BM-04
      if (!r) { r = { code: sg.doc, name: sg.doc, at: sg.at, by: sg.task, st: '', signs: [] }; rows.push(r); }
      /* Ký lại ở vòng sau (phiên bản mới): mỗi người ký giữ lượt mới nhất. */
      r.signs = r.signs.filter((o) => names(o.who) !== names(sg.who)).concat([sg]);
    });
    const vs = window.Ycbg.versions(x.code), tt = rows.find((r) => r.code === 'BM-01' || r.code === 'BM-09');
    if (vs.length && tt) tt.ver = (vs.find((v) => v.cur) || vs[vs.length - 1]).v;
    window.Ycbg.results(x.code).forEach((k) => {
      let r = find(k.code);
      if (!r) { r = { code: k.code, name: k.doc[0], at: k.c.updated, st: 'Hoàn thành', signs: [] }; rows.push(r); }
      r.res = k;
    });
    const rank = (r) => (r.res && r.res.cur ? 0 : 1);
    return rows.map((r, n) => Object.assign(r, { n })).sort((a, b) => rank(a) - rank(b) || a.n - b.n);
  }
  function docState(r) {
    if (r.res) return r.res.cur ? badge('Đang hiệu lực', 'success') : badge('Đã thay thế', 'default');
    if (r.signs.some((sg) => sg.st === 'PENDING')) return badge('Đang trình ký', 'warning');
    if (r.signs.length) { const n = r.signs.length; return badge(n > 1 ? `Đã ký ${n}/${n}` : 'Đã ký', 'success'); }
    return badge(r.st, OUT_TONE[r.st] || 'default');
  }
  function docSign(r) {
    const who = r.signs.map((sg) => `${names(sg.who)}${sg.st === 'PENDING' ? ' (đang chờ)' : ''}`);
    const txt = (r.res ? [`Số ${r.res.no}`] : []).concat(who).join('; ');
    return txt ? `<span class="clamp" title="${esc(txt)}">${esc(txt)}</span>` : dash;
  }
  /* [T37 RV-PROTO-0911 #3] không theo dõi / so sánh phiên bản: bỏ cột Phiên bản (trước: ['Phiên bản', 90, 'c'] sau Bước,
     ô <button data-dx-ver> mở versionDialog — Lịch sử phiên bản + So sánh). versionDialog giữ trong file, không còn nơi gọi. */
  function tabDocs(x, outs, caseCode) {
    const rows = docRows(x, outs || []);
    const last = (r) => (r.signs.length ? r.signs[r.signs.length - 1].at : r.res ? r.res.c.updated : r.at);
    const nameCell = (r) => (r.i == null ? clamp(r.name)
      : caseCode ? `<button type="button" class="link-btn" data-preview-doc="${esc(r.name)}|${esc(r.at)}|${esc(caseCode)}">${esc(r.name)}</button>`
        : `<button type="button" class="link-btn" data-preview="${r.i}">${esc(r.name)}</button>`);
    return `<section class="vcard pad24" data-dx-docs><h3>Văn bản đầu ra</h3>
      ${table([['Thao tác', 100, 'c'], ['Văn bản', 250], ['Bước', 180], ['Trạng thái', 130, 'c'], ['Ký duyệt', 170], ['Ngày', 100]], rows, (r) =>
        `<td class="c"><div class="acts">${iconBtn('download', 'Tải văn bản', `data-dl="${esc(r.res ? r.res.no.replace(/\//g, '-') + '.pdf' : r.name)}"`)}<span class="sep"></span>${dlPdf(r.name)}</div></td>
        <td>${nameCell(r)}</td><td>${r.by != null && Flow.isTask(r.by) ? clamp(stepLabel(r.by)) : dash}</td>
        <td class="c">${docState(r)}</td><td>${docSign(r)}</td><td class="num">${esc(last(r) || '')}</td>`,
      'Chưa có văn bản đầu ra')}</section>`;
  }
  function versionDialog(code) {
    window.UI.vModal({ title: 'Lịch sử phiên bản Tờ trình', size: 'xl', body: window.Ycbg.tabBody(code, 'phien-ban'), actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
  }
  function tabLog(x) {
    if (!isLive(x.code)) return card('Lịch sử thay đổi nhân sự', noLive('Lịch sử thay đổi nhân sự'));
    const log = (Flow.state.memberLog || []).slice().reverse();
    return card('Lịch sử thay đổi nhân sự', table([['Thời điểm', 100], ['Người thực hiện', 150], ['Hình thức', 120, 'c'], ['Vai trò / bước', 220], ['Nhân sự trước → sau', 240], ['Văn bản căn cứ', 150], ['Lý do', 150], ['Task đã chuyển', 130]], log, (r) =>
      `<td class="num">${esc(r.at)}</td><td>${esc(pname(r.by))}</td><td class="c">${r.mode === 'replace' ? badge('Thay người', 'warning') : badge('Bổ sung', 'info')}</td>
        <td><span class="clamp">${esc(r.role ? `${r.roleName} (bước ${r.tasks.map((k) => stepNo(k)).join(', ')})` : stepLabel(r.task))}</span></td><td>${clamp(`${names(r.old)} → ${names(r.now)}`)}</td><td>${clamp(r.doc)}</td><td>${clamp(r.reason)}</td>
        <td>${r.moved.length ? `${r.moved.length} task đang mở` : 'Chưa tới bước'}</td>`, 'Chưa có thay đổi nhân sự'));
  }

  /* Thân màn chi tiết ĐXMS (7 tab) — dùng cho SCR-97, màn xử lý việc ĐXMS (o.task: các phần riêng của việc) và chế độ Xem từ Việc của tôi. */
  function body(code, o) {
    o = o || {};
    const x = Flow.findDxms(code), m = window.Screens.dxmsMeta(x, window.Screens.allCases()), p = window.Screens.dxmsParts(code), t = o.task;
    DT.code = code; // Cập nhật nhân sự (data-um-open) lấy ĐXMS đang xem
    const none = (what) => card(what, '<div class="lf-empty">Đề xuất mua sắm chưa bắt đầu quy trình (chưa Lập hồ sơ).</div>');
    const Y = (k) => window.Ycbg.tabBody(code, k);
    const tabs = {
      /* [T37 RV-PROTO-0911 #3] bỏ So sánh trước – sau điều chỉnh: trước + (p ? p.compare : ''). Bỏ Căn cứ mua sắm / Hạng mục mua sắm: trước 'can-cu' + Y('can-cu'). */
      info: () => (t ? t.info : tabInfo0(x, m)) + window.Screens.chainCard(code),
      'tien-trinh': () => { const st = t ? t.steps : p && p.steps, h = t ? t.history : p && p.history;
        return st ? `<div class="dgrid"><div class="dmain">${st}</div>${h}</div>` : none('Quy trình'); },
      'can-cu': () => tabBasis(x),
      'ton-kho': () => Y('ton-kho'),
      ycbg: () => Y('ycbg'),
      /* D-95: 2 khối — màn xử lý việc: Danh sách tài liệu (tải lên) trước; chế độ xem: Văn bản đầu ra trước. */
      'tai-lieu': () => (t ? t.files + tabDocs(x, t.outList) : p ? tabDocs(x, p.outList, p.vm.code) + p.files : none('Văn bản đầu ra')),
      'nhan-su': () => tabMembers(x) + tabLog(x),
    };
    return `<nav class="tabs dx-tabs" role="tablist">${TABS.map(([k, l]) => `<button type="button" class="tab ${DT.tab === k ? 'on' : ''}" role="tab" aria-selected="${DT.tab === k}" data-ltab="${k}">${l}</button>`).join('')}</nav>
      <div class="dx-body" data-dx-tab="${DT.tab}">${tabs[DT.tab]()}</div>`;
  }

  /* view: bước đã xử lý (mở từ Việc của tôi) → chế độ Xem của my-task-detail: tiêu đề "Xem chi tiết đề xuất mua sắm", thanh "Bạn đã xử lý xong". */
  function detail(code, view) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode detail) + @khcn-core/ui app-tabs
    //       chế độ Xem: my-tasks/my-task-detail (mode VIEW) + my-task-status-bar
    const x = Flow.findDxms(code);
    if (!x) return `<div class="pg">${head({ title: 'Chi tiết đề xuất mua sắm', back: 'luong', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy đề xuất mua sắm.</div></section></div>`;
    const m = window.Screens.dxmsMeta(x, window.Screens.allCases()), p = window.Screens.dxmsParts(code);
    const bpmn = p ? `<button type="button" class="vbtn secondary" data-go="luong/${encodeURIComponent(code)}/bpmn">Xem BPMN</button>` : '';
    const info = {
      scr: 'SCR-97', name: view ? 'Xem chi tiết đề xuất mua sắm' : 'Chi tiết đề xuất mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-20',
      notes: [
        '<b>T37 (review RV-PROTO-0911 #3):</b> Thông tin chung bỏ Người được xem; ĐXMS điều chỉnh bỏ So sánh trước – sau (vẫn có Điều chỉnh từ, Lần, Lý do điều chỉnh); tab Căn cứ & hạng mục bỏ Căn cứ mua sắm, Hạng mục mua sắm (còn Căn cứ pháp lý + Thông tin dự án / đề tài); tab Yêu cầu báo giá bỏ So sánh báo giá và cơ sở giá, Lịch sử cơ sở giá, thêm cột Tổng giá trị theo cơ sở giá; tab Tài liệu & văn bản không theo dõi / so sánh phiên bản (bỏ cột Phiên bản).',
        '<b>T34 v0.2 (D-92, D-93, người dùng 09/11): một màn chi tiết cho ĐXMS.</b> Hồ sơ không còn là đối tượng trên giao diện (bản ghi kỹ thuật 1 – 1 wf_profile, không hiện mã HS); Chi tiết hồ sơ (SCR-20) gộp vào đây. 7 tab: <b>Thông tin chung</b> (+ So sánh trước – sau, Lịch sử điều chỉnh) · <b>Tiến trình</b> (Quy trình + Lịch sử xử lý của SCR-20; nút Xem BPMN trên hàng tiêu đề) · <b>Căn cứ & hạng mục</b> (gộp Căn cứ cũ) · <b>Rà soát tồn kho</b> · <b>Yêu cầu báo giá</b> · <b>Tài liệu & văn bản</b> (D-95: hai khối — <b>Văn bản đầu ra</b> gộp Văn bản & ký duyệt, Lịch sử phiên bản, Kết quả & văn bản phê duyệt, mỗi văn bản một dòng: Bước, Phiên bản (Tờ trình bấm mở Lịch sử phiên bản + So sánh), Trạng thái Hoàn thành → Đang trình ký → Đã ký n/n → Đang hiệu lực / Đã thay thế, Ký duyệt (số văn bản, người ký — ký lại giữ lượt mới nhất), văn bản phê duyệt đang hiệu lực đứng đầu; <b>Danh sách tài liệu</b> cột Loại tài liệu, Bước thay Gắn với Hồ sơ) · <b>Nhân sự thực hiện</b> (+ Lịch sử thay đổi nhân sự).',
        'Cùng thân màn này dùng cho màn xử lý việc ĐXMS (#/task/…) và việc đã xử lý mở từ Việc của tôi (#/luong/<mã>/viec/<bước>) — khuôn my-task-detail: tiêu đề Xử lý / Xem chi tiết, thanh trạng thái Đang chờ bạn xử lý / Bạn đã xử lý xong (my-task-status-bar), thân = màn chi tiết của đối tượng.',
        'Route: #/luong/<mã>[/<tab>]; #/luong/<mã>/bpmn = Chi tiết BPMN. Route cũ #/ho-so, #/ho-so-dxms/<mã hồ sơ> của ĐXMS chuyển về đây (tab Tiến trình).',
        '<b>Phương án Gộp (T17)</b>: một màn cho cả ĐXMS và các hồ sơ của nó. Khuôn task-create (mode detail) + app-tabs như Chi tiết ĐXMS (SCR-29).',
        '<b>Nhân sự thực hiện</b>: mọi bước người dùng của quy trình, nhân sự chỉ định hoặc "theo vai trò" như quy trình, trạng thái bước. <b>Bước đã xong thì khoá</b> (D-28, P-89); bấm Cập nhật nhân sự (SCR-98): chọn <b>Vai trò thực hiện</b> (D-75), Thay / Bổ sung áp cho mọi bước chưa xong của vai trò; nút ở dòng bước mở sẵn vai trò của bước đó.',
        '<b>Văn bản & ký duyệt</b>: văn bản đã ký (giữ nguyên khi thay người — D-29 (3)) và văn bản đang trình ký. Thật: gom văn bản đầu ra của các hồ sơ + trạng thái VOffice — cần dev (tab ở đối tượng cha, S3). Thu hồi / trình ký lại: bước B3 (DX-04).',
        '<b>Lịch sử thay đổi nhân sự</b>: mỗi lần Bổ sung / Thay người một dòng — thời điểm, người thực hiện, bước, nhân sự trước / sau, văn bản căn cứ, lý do, task đã chuyển (plan §4).',
        'Prototype chạy một hồ sơ tại một thời điểm: Văn bản, Lịch sử và nút Cập nhật nhân sự chỉ có ở luồng đang chạy hồ sơ.',
        '<b>T29</b> (HT-DXMS-NOTE màn 7, 8; "TTr" = ĐXMS): Thông tin chung thêm Đợt mua sắm (P-192), Khối đơn vị (P-190), Người được xem; nút <b>Cập nhật người xem</b> như hành động cùng tên của hệ thống cũ — GIẢ LẬP P-189. SRS-DXMS chưa có (D-59).',
      ].concat(window.Ycbg.TAB_INFO),
      q: ['P-86', 'P-88', 'P-89', 'P-189', 'P-190', 'P-192'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs · my-tasks/my-task-detail (mode VIEW)',
    };
    if (view) {
      const d = window.Screens.doneStep(code, view);
      return `<div class="pg" data-luong-detail="${esc(code)}" data-luong-view="${esc(view)}">
      ${head({ title: 'Xem chi tiết đề xuất mua sắm', back: true, lg: true, info, right: bpmn })}
      ${window.Screens.statusBar({ mode: 'view', step: d.step, date: d.date })}
      ${body(code)}</div>`;
    }
    return `<div class="pg" data-luong-detail="${esc(code)}">
      ${head({ title: 'Chi tiết đề xuất mua sắm', back: 'luong', lg: true, info, right: `${m.state === 'NEW' ? `<button type="button" class="vbtn red" data-go="${/* T45 V0.4: ĐXMS nháp đã có hồ sơ → mở việc Lập, không tạo hồ sơ mới */ lapState(x.code) ? 'task/' + lapState(x.code).tok.id : 'luong/create/' + encodeURIComponent(x.code)}" data-lap-dxms>Lập đề xuất mua sắm</button>` : ''}${m.state === 'OK' ? `<button type="button" class="vbtn red" data-go="dieu-chinh-dxms/create/${encodeURIComponent(x.code)}" data-adj-dxms>Điều chỉnh ĐXMS</button>` : ''}${m.state === 'STOP' ? `<button type="button" class="vbtn red" data-copy-dxms="${esc(x.code)}">Sao chép thành ĐXMS mới</button>` : ''}<button type="button" class="vbtn red" data-viewers="${esc(x.code)}">Cập nhật người xem</button>${/* [T34 bỏ Tách] nút Chỉnh sửa mở SCR-28: <button type="button" class="vbtn primary" data-go="dxms/<mã>/edit">Chỉnh sửa</button> */ ''}${bpmn}` })}
      ${body(code)}</div>`;
  }


  /* ---------- SCR-98 Hộp thoại Cập nhật nhân sự (D-28, D-29) ----------
     Mở từ tab Nhân sự thực hiện (SCR-97) và nút Cập nhật nhân sự trên màn xử lý task (hành động loại Khác UPDATE_MEMBERS — không đóng task). */
  /* D-75 (bổ sung 05/11): nhân sự theo Vai trò thực hiện — chọn vai trò, không chọn bước. Thay / Bổ sung áp cho mọi bước chưa xong của vai trò
     (bước đã xong khoá — D-28); `preset` là mã vai trò hoặc mã bước (nút ở dòng bước của tab Nhân sự thực hiện → vai trò của bước đó). */
  function membersDialog(code, preset) {
    const x = Flow.findDxms(code), proc = Flow.state.vars.process;
    const roles = rolesOf(proc).map((r) => Object.assign({}, r, { open: r.tasks.filter((k) => stepState(code, k) !== 'done') })).filter((r) => r.open.length);
    const pre = roles.find((r) => r.code === preset) || roles.find((r) => preset != null && r.open.includes(String(preset)));
    const U = { role: pre ? pre.code : null, mode: 'replace', drop: [], add: [], doc: null, reason: '', err: {} };
    const radio = window.UI.vRadio;
    const f = (label, ctl, o) => field(label, ctl, o);
    const curOf = (r) => {
      const ms = r.open.map((k) => Flow.membersOf(k));
      return { list: [...new Set(ms.flatMap((m) => m.list))], set: ms.some((m) => m.set) };
    };
    const stepsTxt = (ks) => ks.map((k) => stepNo(k)).join(', ');
    function impact(r, cur) {
      const toks = Flow.state.tokens.filter((k) => r.open.includes(String(k.task)));
      const rest = cur.list.filter((p) => !(U.mode === 'replace' && U.drop.includes(p)));
      const next = rest.concat(U.add.filter((p) => !rest.includes(p)));
      const signed = signDocs().filter((d) => d.st === 'SIGNED' && U.mode === 'replace' && d.who.some((w) => U.drop.includes(w)));
      const doneKs = r.tasks.filter((k) => !r.open.includes(k));
      const li = (k, v) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`;
      return `<div class="um-impact" data-um-impact><div class="um-impact-h">Ảnh hưởng của thay đổi</div><ul>
        ${li('Bước áp dụng', `Bước ${esc(stepsTxt(r.open))} (chưa xong)${doneKs.length ? ` · bước ${esc(stepsTxt(doneKs))} đã xong giữ nguyên` : ''}`)}
        ${li('Task đang mở của vai trò', toks.length ? toks.map((k) => `${esc(stepLabel(k.task))}: ${esc(names(k.cands || [k.who]))} → <b>${esc(names(next) || '-')}</b>`).join('<br>') : 'Không có — luồng chưa tới bước của vai trò này')}
        ${li('Lần tới bước của vai trò giao cho', next.length ? `<b>${esc(names(next))}</b>` : '-')}
        ${li('Văn bản đã ký', U.mode === 'replace' ? (signed.length ? signed.map((d) => `${esc(d.doc)} (${esc(names(d.who))}, ${esc(d.at)})`).join('; ') + ' — giữ nguyên' : 'Không có văn bản người bị thay đã ký') : 'Không ảnh hưởng (Bổ sung)')}
      </ul></div>`;
    }
    function body() {
      const r = U.role && roles.find((o) => o.code === U.role), cur = r ? curOf(r) : { list: [], set: false }, e = U.err;
      const users = r ? D.usersOfRole(r.code) : [];
      const pick = (id, label, val, opts, err, ph) => f(label, vSelect({ id, multi: true, value: val, disabled: !r, invalid: !!err, placeholder: r ? ph : 'Chọn vai trò trước',
        options: opts.map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` })), onChange: (v) => { U[id === 'um-drop' ? 'drop' : 'add'] = v; delete U.err[id === 'um-drop' ? 'drop' : 'add']; draw(); } }), { req: true, err });
      const others = users.filter((p) => !cur.list.includes(p.id));
      return `<div class="stack" data-um>
        <div class="grid2">${f('Vai trò thực hiện', vSelect({ id: 'um-role', value: U.role, searchable: true, placeholder: 'Chọn vai trò thực hiện', invalid: !!e.role,
          options: roles.map((o) => ({ value: o.code, label: o.name })),
          onChange: (v) => { Object.assign(U, { role: v, drop: [], add: [] }); delete U.err.role; draw(); } }), { req: true, err: e.role })}
          ${f('Nhân sự hiện tại', `<input class="vctl" id="um-cur" value="${esc(r ? names(cur.list) + (cur.set ? '' : ' (theo vai trò)') : '')}" disabled>`)}</div>
        <div class="vfield"><div class="lr"><label>Hình thức</label></div><div class="vradio h">${radio('Thay người', U.mode === 'replace', 'data-um-mode="replace"')}${radio('Bổ sung người', U.mode === 'add', 'data-um-mode="add"')}</div></div>
        ${U.mode === 'replace' ? `<div class="grid2">${pick('um-drop', 'Người bị thay', U.drop, users.filter((p) => cur.list.includes(p.id)), e.drop, 'Chọn người bị thay')}
          ${pick('um-add', 'Người thay thế', U.add, others, e.add, 'Chọn người thay thế')}</div>` : pick('um-add', 'Người bổ sung', U.add, others, e.add, 'Chọn người bổ sung')}
        <div class="vfield"><div class="lr"><label>Văn bản căn cứ</label><span class="faint">&nbsp;(không bắt buộc)</span></div>
          <div class="row">${U.doc ? `<span class="um-file">${icon('file')} ${esc(U.doc)}</span>${iconBtn('del', 'Xóa tệp', 'data-um-undoc')}` : `<button type="button" class="vbtn sm red" data-um-up>${icon('upload')} Tải file lên</button>`}<input type="file" id="um-file" hidden></div></div>
        ${f('Lý do', `<textarea class="vctl ta" id="um-reason" rows="2" maxlength="1000" placeholder="Nhập lý do (không bắt buộc)">${esc(U.reason)}</textarea>`)}
        ${r ? impact(r, cur) : ''}</div>`;
    }
    const m = window.UI.vModal({ title: 'Cập nhật nhân sự', size: 'w780', body: `<div data-um-wrap>${body()}</div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="um-ok">Lưu</button>' });
    function draw() { const r = m.el.querySelector('#um-reason'); if (r) U.reason = r.value; m.el.querySelector('[data-um-wrap]').innerHTML = body(); }
    m.el.addEventListener('click', (ev) => {
      const md = ev.target.closest('[data-um-mode]');
      if (md) { ev.preventDefault(); U.mode = md.dataset.umMode; U.drop = []; U.add = []; U.err = {}; draw(); return; }
      if (ev.target.closest('[data-um-up]')) { m.el.querySelector('#um-file').click(); return; }
      if (ev.target.closest('[data-um-undoc]')) { U.doc = null; draw(); }
    });
    m.el.addEventListener('change', (ev) => { if (ev.target.id === 'um-file' && ev.target.files.length) { U.doc = ev.target.files[0].name; draw(); } });
    m.el.querySelector('#um-ok').onclick = () => {
      const rv = m.el.querySelector('#um-reason'); if (rv) U.reason = rv.value;
      const e = U.err = {};
      if (!U.role) e.role = 'Bạn cần chọn Vai trò thực hiện.';
      else {
        if (U.mode === 'replace' && !U.drop.length) e.drop = 'Bạn cần chọn người bị thay.';
        if (!U.add.length) e.add = U.mode === 'replace' ? 'Bạn cần chọn người thay thế.' : 'Bạn cần chọn người bổ sung.';
      }
      if (Object.keys(e).length) { draw(); return; }
      const r = roles.find((o) => o.code === U.role);
      const rec = Flow.updateRole({ role: r.code, roleName: r.name, tasks: r.open, mode: U.mode, drop: U.drop, add: U.add, doc: U.doc, reason: U.reason.trim() });
      m.close();
      toast(`<b>Thành công</b><br>Đã ${U.mode === 'replace' ? 'thay người' : 'bổ sung người'} cho vai trò ${esc(r.name)} (bước ${esc(stepsTxt(r.open))}): ${esc(names(rec.now))}.${rec.moved.length ? ` Chuyển ${rec.moved.length} task đang mở.` : ''}`);
      rerender();
    };
    return x;
  }
  /* Nút trên màn xử lý task (screens.js taskScreen): luồng đang chạy, người đang xem có việc này — ai thấy nút do phân quyền quyết định (Q3). */
  function taskBtn(tok, mine) {
    const x = Flow.findDxms(Flow.state.dxms);
    return x && x.luong && mine && isRunning(x.code) ? `<button type="button" class="vbtn secondary" data-um-open="" data-um-code="${esc(x.code)}">Cập nhật nhân sự</button>` : '';
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-luong-form]')) { e.preventDefault(); save('send'); } });
  /* T29 B19: bóc tách — đổi SL đề xuất / Bỏ hạng mục → cập nhật đối chiếu (AI bước 6). */
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (!t.matches || !t.matches('[data-lf-bq], [data-lf-bbo]')) return;
    readInputs();
    if (t.dataset.lfBbo) { const n = Number(t.dataset.lfBbo); if (LF.boc[n]) LF.boc[n].bo = t.checked; }
    delete LF.err.boc;
    rerender();
  });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-lgadv]')) { e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); } });
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-lgf]');
    if (f) L.d[f.dataset.lgf] = f.value;
    if (e.target.id === 'lf-dot') LF.dotTouched = true;
  });
  /* Giá trị dự kiến, Tên, Mục đích đổi → cập nhật Loại biểu mẫu / Cấp phê duyệt dự kiến và khối AI kiểm tra bảo mật. */
  /* Cập nhật tại chỗ, không vẽ lại cả màn (giữ ô đang nhập). */
  /* Rời ô Số lượng / Giá trị dự tính → cập nhật cảnh báo vượt phần còn lại tại chỗ (không vẽ lại cả màn, giữ ô đang nhập). */
  document.addEventListener('change', (e) => {
    const id = e.target.matches && (e.target.dataset.lfCqty || e.target.dataset.lfCval);
    const r = id && LF.cost.find((x) => x.id === id), cell = r && document.querySelector(`[data-lf-citem="${id}"]`);
    if (!cell) return;
    readInputs();
    const w = costWarn(r), old = cell.querySelector('[data-lf-cwarn]');
    if (old) old.remove();
    if (w) cell.insertAdjacentHTML('beforeend', `<div class="t-err" data-lf-cwarn>${esc(w)}</div>`);
  });
  document.addEventListener('change', (e) => {
    if (!['lf-est', 'lf-title'].includes(e.target.id) || !document.querySelector('[data-luong-form]')) return;
    readInputs();
    const dv = derived(LF.v), set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('lf-d-form', dv.form); set('lf-d-level', dv.level);
    const sc = document.querySelector('[data-sec-check]');
    if (sc) sc.outerHTML = S5().secCheckCard({ title: LF.v.title, unit: LF.v.unit }, 'lf', { skip: ['purpose'] });
  });
  document.addEventListener('input', (e) => { if (e.target.id === 'luong-kw') { L.kw = e.target.value; L.page = 1; rerender(); const el = document.getElementById('luong-kw'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } } });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'lf-plfile' && e.target.files.length && LF.plUp) { readInputs(); LF.plFiles[LF.plUp] = e.target.files[0].name; e.target.value = ''; rerender(); return; }
    if (e.target.id !== 'lf-file') return;
    readInputs();
    const now = Flow.dateOf(Flow.state.clock);
    [...e.target.files].forEach((f) => { LF.seq += 1; LF.files.push({ id: LF.seq, name: f.name, type: null, target: null, at: now }); });
    delete LF.err.basis;
    rerender();
  });
  // T45 V0.4 SRS 12 3.1.3: Xóa ở dòng danh sách / trên màn Lập — bắt ở pha capture để dòng (data-go) không mở Chi tiết.
  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-lg-del], [data-lf-delx]');
    if (!d) return;
    e.preventDefault(); e.stopPropagation();
    askDelete(d.dataset.lgDel || d.dataset.lfDelx);
  }, true);
  document.addEventListener('click', (e) => {
    const t = e.target;
    const lt = t.closest('[data-ltab]');
    if (lt) { DT.tab = lt.dataset.ltab; rerender(); return; }
    if (t.closest('[data-dx-ver]')) { versionDialog(DT.code); return; }
    const lg = t.closest('[data-lg]');
    if (lg) {
      if (lg.dataset.lg === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
      if (lg.dataset.lg === 'reset') { L.d = emptyF(); L.f = emptyF(); L.page = 1; }
      rerender(); return;
    }
    const uo = t.closest('[data-um-open]');
    if (uo && !uo.disabled) { membersDialog(uo.dataset.umCode || DT.code, uo.dataset.umOpen || null); return; }
    if (t.closest('#lf-draft')) { save('draft'); return; }
    const dec = t.closest('[data-lf-dec]');
    if (dec && LF.ai) {
      readInputs();
      const [k, d] = dec.dataset.lfDec.split('|'), r = LF.ai.rows.find((x) => x.key === k);
      if (r) { r.quyetDinh = d; if (d === 'Sửa' && !r.noiDungSua) r.noiDungSua = r.goiY; r.stale = false; }
      if (LF.err.aiRow) delete LF.err.aiRow[k];
      if (!LF.ai.rows.some((x) => !x.quyetDinh)) delete LF.err.ai;
      rerender(); return;
    }
    if (t.closest('[data-lf-aadd]') && LF.addPick.line) { readInputs(); LF.aseq += 1; LF.add.push({ id: 'a' + LF.aseq, line: LF.addPick.line, sl: '1' }); LF.addPick.line = null; rerender(); return; }
    const adel = t.closest('[data-lf-adel]');
    if (adel) { readInputs(); LF.add = LF.add.filter((r) => r.id !== adel.dataset.lfAdel); if (LF.err.add) delete LF.err.add[adel.dataset.lfAdel]; rerender(); return; }
    const aiSec = t.closest('[data-lf-ai-sec]');
    if (aiSec && LF.v.nv) { readInputs(); ({ boc: popBoc, basic: popBasic, chung: popChung, legal: popLegal })[aiSec.dataset.lfAiSec](); return; }
    if (t.closest('[data-lf-up]')) { document.getElementById('lf-file').click(); return; }
    const plr = t.closest('[data-lf-pl]');
    if (plr) { readInputs(); const [k, val] = plr.dataset.lfPl.split('|'); LF.pl[k] = val; if (val === 'Không') delete LF.plFiles[k]; rerender(); return; }
    const plu = t.closest('[data-lf-plup]');
    if (plu) { LF.plUp = plu.dataset.lfPlup; document.getElementById('lf-plfile').click(); return; }
    const pld = t.closest('[data-lf-pldel]');
    if (pld) { readInputs(); delete LF.plFiles[pld.dataset.lfPldel]; rerender(); return; }
    if (t.closest('[data-lf-cadd]') && LF.pick.line) {
      readInputs(); LF.rseq += 1; LF.cost.push({ id: 'c' + LF.rseq, line: LF.pick.line, qty: '', value: '', pkg: '', man: true }); LF.pick.line = null; rerender(); return;
    }
    const cdel = t.closest('[data-lf-cdel]');
    if (cdel) { readInputs(); LF.cost = LF.cost.filter((r) => r.id !== cdel.dataset.lfCdel); if (LF.err.cost) delete LF.err.cost[cdel.dataset.lfCdel]; rerender(); return; }
    if (t.closest('[data-lf-add]')) { readInputs(); LF.rseq += 1; LF.rows.push({ id: LF.rseq, role: null, person: null }); rerender(); return; }
    const rdel = t.closest('[data-lf-rdel]');
    if (rdel) { readInputs(); LF.rows = LF.rows.filter((r) => String(r.id) !== rdel.dataset.lfRdel); if (LF.err.rows) delete LF.err.rows[rdel.dataset.lfRdel]; rerender(); return; }
    const del = t.closest('[data-lf-del]');
    if (del) { readInputs(); LF.files = LF.files.filter((f) => String(f.id) !== del.dataset.lfDel); rerender(); return; }
    const pg = t.closest('[data-pager="lg"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender();
    }
  });

  /* Route #/luong[/create|/<mã ĐXMS>]. */
  /* #/luong/<mã>[/<tab>] · #/luong/<mã>/bpmn · #/luong/<mã>/viec/<bước> (T34 v0.2). */
  function route(parts) {
    if (parts[1] === 'create') return form();
    if (!parts[1]) return list();
    const code = decodeURIComponent(parts[1]);
    if (parts[2] === 'bpmn') return window.Screens.dxmsBpmn(code);
    if (parts[2] === 'viec' && parts[3]) { useTab(parts.join('/'), 'tien-trinh'); return detail(code, decodeURIComponent(parts[3])); }
    useTab(parts.join('/'), parts[2]);
    return detail(code);
  }
  function enter(parts) {
    if (parts[0] === 'luong' && parts[1] === 'create') {
      resetForm();
      /* T34: luong/create/<mã> — ĐXMS chưa có hồ sơ (dữ liệu mẫu / Sao chép) lập hồ sơ trên chính ĐXMS đó. */
      const x = parts[2] && Flow.findDxms(decodeURIComponent(parts[2]));
      if (x) { LF.base = { mode: 'own', code: x.code }; prefillFrom(x); }
    }
    /* T34: dieu-chinh-dxms/create[/<mã>] — Thêm mới điều chỉnh ĐXMS (khuôn SCR-96). */
    if (parts[0] === 'dieu-chinh-dxms' && parts[1] === 'create') {
      resetForm();
      const from = parts[2] ? decodeURIComponent(parts[2]) : null;
      LF.base = { mode: 'adj', from, lock: !!from, reason: '' };
      if (from && Flow.findDxms(from)) prefillFrom(Flow.findDxms(from));
    }
    /* T29 B19: việc bước 1 / 4 / 5 của hồ sơ MS01 → màn Lập ĐXMS (nạp bản Lưu nháp hoặc dữ liệu ĐXMS). */
    if (parts[0] === 'task' && !parts[2]) { const tok = Flow.token(parts[1]); if (isLap(tok)) loadEdit(tok); }
  }
  /* #/task/<id> của việc Lập ĐXMS: nạp lại nếu chưa nạp đúng việc (vd. vào thẳng route, đổi tài khoản). */
  function lapScreen(tok) {
    if (!LF.edit || LF.edit.tok !== tok.id) loadEdit(tok);
    return form();
  }
  const LAP_NAME = 'Lập đề xuất mua sắm (bước 01–05)';

  /* SRS 29 (D-105): docRows dùng chung cho màn Quản lý tài liệu ĐXMS (SCR-107) — trạng thái văn bản đồng nhất với tab Tài liệu & văn bản. */
  window.Luong = { isGop, setMode, menu, tasksOf, rolesOf, route, enter, taskBtn, membersDialog, isLap, lapScreen, LAP_NAME, body, useTab, lapState, docRows };
})();
