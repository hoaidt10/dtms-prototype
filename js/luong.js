/* T17 — Phương án Gộp menu "Luồng mua sắm" (ĐXMS + Hồ sơ), plan docs/dtms/prototype-T17-luong-mua-sam-chuan-bi.md v0.2.
   Công tắc Tách / Gộp ở Công cụ demo (D-25): Gộp thay hai mục Đề xuất mua sắm / Hồ sơ đề xuất mua sắm bằng một mục Luồng mua sắm; dữ liệu vẫn
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
  const MODE_KEY = 'dtms-proto-menu';
  let mode = 'tach';
  /* Đọc lại mỗi lần: storage có thể đổi mà trang không tải lại (chỉ đổi hash). */
  function isGop() {
    try { mode = localStorage.getItem(MODE_KEY) === 'gop' ? 'gop' : 'tach'; } catch (e) { /* bỏ qua */ }
    return mode === 'gop';
  }
  function setMode(m) {
    mode = m === 'gop' ? 'gop' : 'tach';
    try { localStorage.setItem(MODE_KEY, mode); } catch (e) { /* bỏ qua */ }
  }
  /* Menu theo phương án: Gộp thay hai mục ĐXMS / Hồ sơ của nhóm Quản lý đề xuất mua sắm bằng Luồng mua sắm; route cũ vẫn mở được. */
  function menu() {
    if (!isGop()) return D.menu;
    return D.menu.map((g) => ((g.children || []).some((k) => k.path === 'dxms')
      ? Object.assign({}, g, { children: [{ label: 'Luồng mua sắm', path: 'luong', scr: 'SCR-95' }].concat(g.children.filter((k) => k.path !== 'dxms' && k.path !== 'ho-so-dxms')) })
      : g));
  }

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
  const L = { kw: '', page: 1, size: 10, psOpen: false };
  const href = (code) => 'luong/' + encodeURIComponent(code);
  function rows() {
    const cases = window.Screens.allCases();
    return Flow.dxmsAll().map((x) => {
      const m = window.Screens.dxmsMeta(x, cases);
      const run = m.hs.find((c) => c.st === 'processing') || m.hs[0] || null;
      const live = run && run.live && Flow.state.status === 'running';
      const who = live ? [...new Set(Flow.state.tokens.flatMap((t) => t.cands || [t.who]))].map((id) => persona(id).name).join(', ') : '';
      return Object.assign({}, x, { state: m.state, run, who });
    }).filter((x) => !L.kw || norm(`${x.code} ${x.title}`).includes(norm(L.kw)));
  }
  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html
    const all = rows(), pages = Math.max(1, Math.ceil(all.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const S = window.Screens.DXMS_STATUS;
    const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Mã ĐXMS', 170], ['Tên luồng mua sắm', 280], ['Hồ sơ đang xử lý', 150], ['Quy trình', 100],
      ['Bước hiện tại', 220], ['Người đang xử lý', 180], ['Đơn vị đề xuất', 180], ['Ngày cập nhật', 140]];
    const body = all.slice(from, from + L.size).map((x, i) => `<tr class="click" data-go="${href(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-go="dxms/${encodeURIComponent(x.code)}/edit"`)}</div></td>
        <td class="c">${badge(S[x.state][0], S[x.state][1])}</td><td><a class="link" data-go="${href(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
        <td>${x.run ? `<a class="link" data-go="${window.Screens.caseHref(x.run)}">${esc(x.run.code)}</a>` : dash}</td><td>${clamp(x.run && x.run.flow)}</td>
        <td>${clamp(x.run && x.run.step)}</td><td>${clamp(x.who)}</td><td>${clamp(x.unit)}</td><td class="num">${esc(x.updated)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-95', name: 'Danh sách luồng mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20',
      notes: [
        '<b>Phương án Gộp (T17 D-25)</b>: một mục <b>Luồng mua sắm</b> thay hai mục Đề xuất mua sắm và Hồ sơ đề xuất mua sắm. Đổi phương án ở Công cụ demo › Phương án menu ĐXMS. Dữ liệu không đổi: luồng = ĐXMS (cha), hồ sơ Phê duyệt / Điều chỉnh là con (D-10…D-12).',
        'Mỗi dòng là một luồng, kèm <b>hồ sơ đang xử lý</b>, quy trình, bước hiện tại và người đang xử lý — người dùng không phải mở danh sách hồ sơ riêng. Trạng thái suy từ hồ sơ như SCR-27 (R5).',
        '<b>Thêm mới</b> mở Tạo luồng (SCR-96): một lần Lưu tạo ĐXMS + hồ sơ Phê duyệt và khởi tạo quy trình (D-26).',
        'Bấm dòng mở Chi tiết luồng (SCR-97): Thông tin chung, Tiến trình, Căn cứ, Nhân sự thực hiện (Cập nhật nhân sự — SCR-98), Văn bản & ký duyệt, Lịch sử thay đổi nhân sự.',
        'Khuôn: task-management (danh sách nhiệm vụ). Cột Hồ sơ đang xử lý / Bước hiện tại / Người đang xử lý lấy từ wf_profile + Camunda user task (candidateUsers) của hồ sơ đang chạy.',
      ],
      q: [], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách luồng mua sắm', info, right: `<button class="vbtn primary" data-go="luong/create">${icon('add')} Thêm mới</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          <label class="vsearch" style="width:264px">${icon('search')}<input id="luong-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên luồng" value="${esc(L.kw)}"></label></div></div>
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
    Object.assign(LF, { err: {}, files: [], rows: [], seq: 0, rseq: 0 });
    LF.v = { title: '', nv: null, unit: UNITS.includes(u) ? u : null, priority: 'Thường', est: '', period: '', secret: 'Không', purpose: '', proc: null };
  }
  /* Đổi quy trình: bỏ dòng chỉ định của bước không còn trong quy trình mới; bước còn mà đổi vai trò thì bỏ người đã chọn. */
  function syncRows(process) {
    const ts = tasksOf(process);
    LF.rows = LF.rows.filter((r) => !r.task || ts.some((t) => t.key === r.task)).map((r) => {
      const t = r.task && ts.find((x) => x.key === r.task);
      return t && r.role !== t.role ? Object.assign(r, { role: t.role, people: [] }) : r;
    });
  }
  function readInputs() {
    ['title', 'est', 'period', 'purpose'].forEach((k) => { const el = document.getElementById('lf-' + k); if (el) LF.v[k] = el.value; });
  }
  const upd = (fn) => (val) => { readInputs(); fn(val); rerender(); };

  function basisCard() {
    const types = basisTypes(), err = LF.err;
    return `<section class="vcard" data-lf-basis><div class="vcard-h"><h3>Căn cứ đầu vào</h3>
        <div class="row"><button type="button" class="vbtn red" data-lf-up>${icon('upload')} Tải file lên</button><input type="file" id="lf-file" multiple hidden></div></div>
      ${err.basis ? `<p class="msg lf-err" role="alert">${esc(err.basis)}</p>` : ''}
      ${table([['Thao tác', 80, 'c'], ['Tên tài liệu', 240], ['Loại tài liệu căn cứ', 320], ['Gắn vào', 180], ['Ngày tạo', 120]], LF.files, (f) => {
    const tg = f.type ? targetsOf(f.type) : [];
    return `<td class="c">${iconBtn('del', 'Xóa tài liệu', `data-lf-del="${f.id}"`)}</td><td><span class="clamp">${esc(f.name)}</span></td>
        <td>${vSelect({ id: 'lf-type-' + f.id, value: f.type, searchable: true, placeholder: 'Chọn loại tài liệu căn cứ', invalid: !!(err.types && !f.type),
          options: types.map((t) => ({ value: t.code, label: t.req === 'CO' ? `${t.name} (bắt buộc)` : t.name })),
          onChange: upd((v) => { f.type = v; f.target = targetsOf(v)[0]; delete LF.err.basis; }) })}</td>
        <td>${vSelect({ id: 'lf-tg-' + f.id, value: f.target || null, placeholder: 'Theo loại tài liệu', disabled: tg.length < 2,
          options: tg.map((s) => ({ value: s, label: TARGET[s] })), onChange: upd((v) => { f.target = v; }) })}</td><td class="num">${esc(f.at)}</td>`;
  }, 'Chưa có tài liệu căn cứ')}</section>`;
  }

  /* Nhân sự thực hiện: mỗi dòng một bước của quy trình; chỉ thêm dòng cho bước cần chỉ định đích danh (D-27).
     Theo: task-create "Nhân sự khởi tạo / thẩm định" (bảng có Thêm / Xóa dòng). */
  function membersCard() {
    const proc = LF.v.proc, ts = tasksOf(proc), err = LF.err.rows || {};
    const add = `<button type="button" class="vbtn secondary" data-lf-add ${proc ? '' : 'disabled'}>${icon('add')} Thêm dòng</button>`;
    const headH = `<div class="vcard-h"><h3>Nhân sự thực hiện</h3><div class="row">${add}</div></div>`;
    if (!proc) return `<section class="vcard" data-lf-members>${headH}<div class="lf-empty">Chọn Quy trình để chỉ định nhân sự cho các bước của quy trình.</div></section>`;
    return `<section class="vcard" data-lf-members>${headH}
      ${table([['Thao tác', 80, 'c'], ['Bước', 140], ['Tên công việc', 280], ['Vai trò thực hiện', 170], ['Nhân sự thực hiện', 320]], LF.rows, (r) => {
    const t = r.task && ts.find((x) => x.key === r.task), e = err[r.id] || {};
    const used = LF.rows.filter((x) => x !== r && x.task).map((x) => x.task);
    return `<td class="c">${iconBtn('del', 'Xóa dòng', `data-lf-rdel="${r.id}"`)}</td>
        <td><div class="vfield ${e.task ? 'invalid' : ''}" data-row-step="${r.id}">${vSelect({ id: 'lf-step-' + r.id, value: r.task, searchable: true, placeholder: 'Chọn bước', invalid: !!e.task, panelWidth: 460,
          options: ts.filter((x) => !used.includes(x.key)).map((x) => ({ value: x.key, short: stepNo(x.key), label: `${stepNo(x.key)} · ${x.name}` })),
          onChange: upd((k) => { const n = ts.find((x) => x.key === k); if (r.role !== n.role) r.people = []; Object.assign(r, { task: k, role: n.role }); if (err[r.id]) delete err[r.id].task; }) })}
          ${e.task ? `<p class="msg" role="alert">${esc(e.task)}</p>` : ''}</div></td>
        <td>${t ? `<span class="clamp">${esc(t.name)}</span>` : dash}</td><td>${t ? esc(t.roleName) : dash}</td>
        <td><div class="vfield ${e.people ? 'invalid' : ''}" data-row-people="${r.id}">${vSelect({ id: 'lf-m-' + r.id, multi: true, value: r.people, disabled: !t, invalid: !!e.people,
          placeholder: t ? 'Chọn nhân sự' : 'Chọn bước trước',
          options: t ? D.usersOfRole(t.role).map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` })) : [],
          onChange: upd((v) => { r.people = v; if (err[r.id]) delete err[r.id].people; }) })}
          ${e.people ? `<p class="msg" role="alert">${esc(e.people)}</p>` : ''}</div></td>`;
  }, 'Chưa chỉ định nhân sự cho bước nào — các bước giao theo vai trò như quy trình')}</section>`;
  }

  function form() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create)
    const v = LF.v, err = LF.err;
    const txt = (k, ph, max) => `<input class="vctl" id="lf-${k}" maxlength="${max || 255}" placeholder="${ph}" value="${esc(v[k])}" ${err[k] ? 'aria-invalid="true"' : ''}>`;
    const procOpts = D.kinds.PD.procs.map((k) => ({ value: k, disabled: !!(D.processes[k] || {}).pending, label: `${k} · ${D.procCond(k, D.dxmsRules())}` }));
    const info = {
      scr: 'SCR-96', name: 'Thêm mới luồng mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-01, 02, UR-DX-20', bpmn: 'Ngoài BPMN — trước task 01',
      notes: [
        '<b>Một lần Lưu = tạo ĐXMS + hồ sơ Phê duyệt + khởi tạo quy trình</b> (T17 D-26). Thật: BE gọi lần lượt API tạo ĐXMS (wf_tasks) và tạo hồ sơ (profile-form, Lưu = start). Tên hồ sơ = tên luồng. Hồ sơ Điều chỉnh (MS02) tạo sau trong luồng.',
        '<b>Căn cứ đầu vào = tệp đính kèm</b> (D-30): mỗi tệp chọn Loại tài liệu căn cứ (Danh mục dùng chung › Loại tài liệu căn cứ, SCR-99). Loại có Áp dụng cho ĐXMS và hồ sơ thì chọn Gắn vào; tệp gắn ĐXMS nằm ở Tài liệu đính kèm của luồng, tệp gắn hồ sơ nằm ở Danh sách tài liệu của hồ sơ. Thiếu tệp của loại <b>Bắt buộc</b> thì không Lưu được.',
        '<b>Nhân sự thực hiện</b> (D-27): mỗi dòng một bước của quy trình đã chọn — Bước, Tên công việc (User Task: elementId, name), Vai trò thực hiện do BPMN quy định (roleCode ở Candidate Users). Nhân sự lấy theo vai trò của bước (IAM), chọn 1 hoặc nhiều người — nhiều người thì task giao cho tất cả, một người nhận xử lý. <b>Thêm dòng / Xóa dòng</b>: chỉ thêm cho bước cần chỉ định đích danh; bước không có dòng giao theo vai trò như quy trình. Mỗi bước chỉ một dòng; đổi quy trình thì bỏ dòng của bước không còn áp dụng.',
        'Cơ chế như nhiệm vụ KHCN: task-create có hai bảng Nhân sự khởi tạo / thẩm định theo Vai trò thực hiện (category execution-roles); BE TaskService.syncCreatedProcessCandidateUsers đổi roleCode → username khi task được tạo.',
        'CQCM không nằm trong bảng: đơn vị CQCM chọn ở task 16 theo quy trình. Ban ĐTXD / TGĐ Tập đoàn là bên ngoài (giả lập), không gán.',
        'Trường Thông tin chung như Thêm mới ĐXMS (SCR-28), thêm <b>Quy trình</b> như Thêm mới hồ sơ (SCR-25). Mã ĐXMS và mã hồ sơ do hệ thống sinh.',
      ],
      q: ['P-84', 'P-26', 'P-34'], src: 'task-management/components/task-create (mode create) + profile-management/profile-form · /task-management/create',
    };
    return `<form class="pg" data-luong-form>
      ${head({ title: 'Thêm mới luồng mua sắm', back: 'luong', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="luong">Huỷ</button><button type="submit" class="vbtn primary" id="lf-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung</h3>
        <div class="grid3">
          ${field('Mã ĐXMS', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên luồng mua sắm', txt('title', 'Ví dụ: Luồng mua sắm cho dự án A', 500), { req: true, err: err.title, cls: 'span2' })}
          ${field('Nhiệm vụ / Đề tài, dự án', vSelect({ id: 'lf-nv', value: v.nv, searchable: true, placeholder: 'Chọn nhiệm vụ / đề tài, dự án', invalid: !!err.nv,
    options: D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name} (${n.kind})` })), onChange: upd((x) => { v.nv = x; delete err.nv; }) }), { req: true, err: err.nv, cls: 'span2' })}
          ${field('Quy trình', vSelect({ id: 'lf-proc', value: v.proc, searchable: true, placeholder: 'Chọn quy trình', invalid: !!err.proc, options: procOpts,
    onChange: upd((x) => { v.proc = x; delete err.proc; syncRows(x); }) }), { req: true, err: err.proc })}
          ${field('Đơn vị đề xuất', vSelect({ id: 'lf-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit,
    options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd((x) => { v.unit = x; delete err.unit; }) }), { req: true, err: err.unit })}
          ${field('Mức ưu tiên', vSelect({ id: 'lf-pri', value: v.priority, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })),
    onChange: upd((x) => { v.priority = x; }) }), { req: true })}
          ${field('Mật', vSelect({ id: 'lf-sec', value: v.secret, options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd((x) => { v.secret = x; }) }))}
          ${field('Giá trị dự kiến (tỷ đồng)', txt('est', 'Nhập giá trị dự kiến'), { err: err.est })}
          ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 09/2027'))}
          ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
          ${field('Mục đích', `<textarea class="vctl ta" id="lf-purpose" maxlength="2000" placeholder="Nhập mục đích">${esc(v.purpose)}</textarea>`, { cls: 'span3' })}
        </div></section>
      ${basisCard()}${membersCard()}</form>`;
  }

  function save() {
    readInputs();
    const v = LF.v, err = LF.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên luồng mua sắm.';
    if (!v.nv) err.nv = 'Bạn cần chọn Nhiệm vụ / Đề tài, dự án.';
    if (!v.proc) err.proc = 'Bạn cần chọn Quy trình.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
    const est = v.est.trim() === '' ? null : Number(v.est.trim().replace(/\./g, '').replace(',', '.'));
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Giá trị dự kiến không đúng định dạng.';
    if (LF.files.some((f) => !f.type)) { err.types = true; err.basis = 'Bạn cần chọn Loại tài liệu căn cứ cho mọi tài liệu.'; }
    const miss = basisTypes().filter((t) => t.req === 'CO' && !LF.files.some((f) => f.type === t.code));
    if (!err.basis && miss.length) err.basis = `Thiếu tài liệu căn cứ bắt buộc: ${miss.map((t) => t.name).join('; ')}.`;
    const re = {};
    LF.rows.forEach((r) => {
      const e = {};
      if (!r.task) e.task = 'Bạn cần chọn Bước.';
      else if (!r.people.length) e.people = 'Bạn cần chọn ít nhất một người.';
      if (Object.keys(e).length) re[r.id] = e;
    });
    if (Object.keys(re).length) err.rows = re;
    if (Object.keys(err).length) { rerender(); return; }
    const members = {};
    LF.rows.forEach((r) => { members[r.task] = r.people.slice(); });
    const now = Flow.dateOf(Flow.state.clock);
    const basis = LF.files.filter((f) => f.target === 'DXMS').map((f) => ({ name: f.name, type: f.type, at: now }));
    const caseFiles = LF.files.filter((f) => f.target === 'PD').map((f) => ({ name: f.name, type: f.type }));
    const code = Flow.createLuong({ title: v.title.trim(), nv: v.nv, unit: v.unit, priority: v.priority, est, period: v.period.trim(), secret: v.secret === 'Có',
      purpose: v.purpose.trim(), members, basis }, { process: v.proc, name: v.title.trim(), caseFiles });
    const tok = Flow.tokensFor(Flow.state.persona).find((t) => String(t.task) === '1');
    toast(`<b>Thành công</b><br>Đã tạo luồng ${esc(code)} và khởi tạo hồ sơ ${esc(Flow.state.code)}.`);
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
    /* cond: 10a chỉ chạy khi giá trị không khớp quy trình. */
    return s === 'active' || s === 'done' || s === 'cond' ? s : 'todo';
  }
  function procOf(x) {
    if (isLive(x.code)) return Flow.state.vars.process;
    const hs = window.Screens.allCases().filter((c) => c.dxms === x.code && c.kind === 'PD');
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

  const DT = { code: null, tab: 'info' };
  const TABS = [['info', 'Thông tin chung'], ['tien-trinh', 'Tiến trình'], ['can-cu', 'Căn cứ'], ['nhan-su', 'Nhân sự thực hiện'], ['van-ban', 'Văn bản & ký duyệt'], ['lich-su', 'Lịch sử thay đổi nhân sự']];
  const card = (title, body, right) => `<section class="vcard"><div class="vcard-h"><h3>${title}</h3>${right ? `<div class="row">${right}</div>` : ''}</div>${body}</section>`;
  const noLive = (what) => `<div class="lf-empty">${what} có trên luồng đang chạy hồ sơ. Luồng này không có hồ sơ đang chạy trên prototype.</div>`;

  function tabInfo(x, m) {
    const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
    return `<section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo c3">
      ${kv('Mã ĐXMS', esc(x.code))}${kv('Tên luồng mua sắm', esc(x.title), 'span2')}
      ${kv('Nhiệm vụ / Đề tài, dự án', D.nvOf(x.nv) ? esc(`${x.nv} — ${D.nvOf(x.nv).name}`) : null, 'span2')}${kv('Quy trình', esc(procOf(x) || ''))}
      ${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Người tạo', esc(x.creator))}${kv('Mức ưu tiên', esc(x.priority))}
      ${kv('Giá trị hiệu lực (gồm VAT)', m.value != null ? ty(m.value) + ' tỷ đồng' : null)}${kv('Giá trị dự kiến', x.est != null ? ty(x.est) + ' tỷ đồng' : null)}${kv('Thời gian thực hiện', esc(x.period))}
      ${kv('Trạng thái', badge(window.Screens.DXMS_STATUS[m.state][0], window.Screens.DXMS_STATUS[m.state][1]))}${kv('Mật', x.secret ? 'Có' : 'Không')}${kv('Ngày cập nhật', esc(x.updated))}
      ${kv('Mục đích', esc(x.purpose), 'span3')}</div></section>`;
  }
  function tabProgress(x, m) {
    const who = (c) => (c.live && Flow.state.status === 'running' ? names([...new Set(Flow.state.tokens.flatMap((t) => t.cands || [t.who]))]) : '');
    const t = table([['Mã hồ sơ', 130], ['Loại hồ sơ', 130], ['Quy trình', 90], ['Bước hiện tại', 220], ['Người đang xử lý', 200], ['Ngày tạo', 110], ['Trạng thái', 150, 'c']], m.hs, (c) =>
      `<td><a class="link" data-go="${window.Screens.caseHref(c)}">${esc(c.code)}</a></td><td>${esc((D.kinds[c.kind] || D.kinds.PD).label)}</td><td>${esc(c.flow)}</td>
        <td>${clamp(c.step)}</td><td>${clamp(who(c))}</td><td class="num">${esc(c.created)}</td><td class="c">${badge(CASE_ST[c.st][0], CASE_ST[c.st][1])}</td>`, 'Luồng chưa có hồ sơ');
    const steps = isLive(x.code) ? `<section class="vcard pad24"><h3>Quy trình hồ sơ ${esc(Flow.state.code)}</h3>${window.UI.vSteps({ id: 'lg-' + Flow.state.code, steps: window.Screens.processSteps() })}</section>` : '';
    return card('Hồ sơ của luồng', t) + steps;
  }
  function tabBasis(x) {
    const rows = (x.basis || []).map((f) => ({ name: f.name, type: f.type, to: 'ĐXMS', at: f.at }))
      .concat(isLive(x.code) ? (Flow.ui.uploads || []).filter((f) => f.type).map((f) => ({ name: f.name, type: f.type, to: `Hồ sơ ${Flow.state.code}`, at: f.at })) : []);
    return card('Căn cứ đầu vào', table([['Thao tác', 80, 'c'], ['Tên tài liệu', 280], ['Loại tài liệu căn cứ', 300], ['Gắn vào', 200], ['Ngày tạo', 120]], rows, (r) =>
      `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td><td><span class="clamp">${esc(r.name)}</span></td>
        <td>${clamp((typeOf(r.type) || {}).name)}</td><td>${esc(r.to)}</td><td class="num">${esc(r.at)}</td>`, 'Chưa có tài liệu căn cứ'));
  }
  function tabMembers(x) {
    const proc = procOf(x), run = isRunning(x.code);
    if (!proc) return card('Nhân sự thực hiện', '<div class="lf-empty">Luồng chưa có hồ sơ nên chưa có bước để chỉ định nhân sự.</div>');
    const btn = run ? `<button type="button" class="vbtn red" data-um-open="">${icon('edit')} Cập nhật nhân sự</button>` : '';
    return card('Nhân sự thực hiện', table([['Thao tác', 80, 'c'], ['Bước', 70], ['Tên công việc', 280], ['Vai trò thực hiện', 170], ['Nhân sự thực hiện', 260], ['Trạng thái', 150, 'c']], tasksOf(proc), (t) => {
      const st = stepState(x.code, t.key), lock = st === 'done';
      return `<td class="c">${run ? `<button type="button" class="vbtn icon ghost" aria-label="Cập nhật nhân sự" data-um-open="${esc(t.key)}" ${lock ? 'disabled title="Bước đã xong — khoá (D-28)"' : ''}>${icon('edit')}</button>` : dash}</td>
        <td>${esc(stepNo(t.key))}</td><td><span class="clamp">${esc(t.name)}</span></td><td>${esc(t.roleName)}</td><td data-um-who="${esc(t.key)}">${memberCell(membersOf(x, t))}</td>
        <td class="c">${st ? badge(STEP_ST[st][0], STEP_ST[st][1]) : dash}</td>`;
    }), btn);
  }
  function tabDocs(x) {
    if (!isLive(x.code)) return card('Văn bản & ký duyệt', noLive('Văn bản & ký duyệt'));
    return card('Văn bản & ký duyệt', table([['Văn bản', 200], ['Bước ký', 320], ['Người ký', 240], ['Ngày', 120], ['Trạng thái', 150, 'c']], signDocs(), (d) =>
      `<td>${esc(d.doc)}</td><td><span class="clamp">${esc(stepLabel(d.task))}</span></td><td>${clamp(names(d.who))}</td><td class="num">${esc(d.at)}</td><td class="c">${badge(DOC_ST[d.st][0], DOC_ST[d.st][1])}</td>`,
    'Chưa có văn bản trình ký'));
  }
  function tabLog(x) {
    if (!isLive(x.code)) return card('Lịch sử thay đổi nhân sự', noLive('Lịch sử thay đổi nhân sự'));
    const log = (Flow.state.memberLog || []).slice().reverse();
    return card('Lịch sử thay đổi nhân sự', table([['Thời điểm', 100], ['Người thực hiện', 150], ['Hình thức', 120, 'c'], ['Bước', 200], ['Nhân sự trước → sau', 240], ['Văn bản căn cứ', 150], ['Lý do', 150], ['Task đã chuyển', 130]], log, (r) =>
      `<td class="num">${esc(r.at)}</td><td>${esc(pname(r.by))}</td><td class="c">${r.mode === 'replace' ? badge('Thay người', 'warning') : badge('Bổ sung', 'info')}</td>
        <td><span class="clamp">${esc(stepLabel(r.task))}</span></td><td>${clamp(`${names(r.old)} → ${names(r.now)}`)}</td><td>${clamp(r.doc)}</td><td>${clamp(r.reason)}</td>
        <td>${r.moved.length ? `${r.moved.length} task đang mở` : 'Chưa tới bước'}</td>`, 'Chưa có thay đổi nhân sự'));
  }

  function detail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode detail) + @khcn-core/ui app-tabs
    const x = Flow.findDxms(code);
    if (!x) return `<div class="pg">${head({ title: 'Xem chi tiết luồng mua sắm', back: 'luong', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy luồng mua sắm.</div></section></div>`;
    if (DT.code !== code) { DT.code = code; DT.tab = 'info'; }
    const m = window.Screens.dxmsMeta(x, window.Screens.allCases());
    const body = { info: tabInfo, 'tien-trinh': tabProgress, 'can-cu': tabBasis, 'nhan-su': tabMembers, 'van-ban': tabDocs, 'lich-su': tabLog }[DT.tab](x, m);
    const info = {
      scr: 'SCR-97', name: 'Chi tiết luồng mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-20',
      notes: [
        '<b>Phương án Gộp (T17)</b>: một màn cho cả ĐXMS và các hồ sơ của nó. Khuôn task-create (mode detail) + app-tabs như Chi tiết ĐXMS (SCR-29).',
        '<b>Tiến trình</b>: các hồ sơ của luồng (Phê duyệt, Điều chỉnh) với bước hiện tại và người đang xử lý; mã hồ sơ mở Chi tiết hồ sơ (SCR-20). <b>Căn cứ</b>: tệp căn cứ gắn ĐXMS và gắn hồ sơ (D-30).',
        '<b>Nhân sự thực hiện</b>: mọi bước người dùng của quy trình, nhân sự chỉ định hoặc "theo vai trò" như quy trình, trạng thái bước. <b>Bước đã xong thì khoá</b> (D-28, P-89); bước đang xử lý / chưa tới bấm Cập nhật nhân sự (SCR-98).',
        '<b>Văn bản & ký duyệt</b>: văn bản đã ký (giữ nguyên khi thay người — D-29 (3)) và văn bản đang trình ký. Thật: gom văn bản đầu ra của các hồ sơ + trạng thái VOffice — cần dev (tab ở đối tượng cha, S3). Thu hồi / trình ký lại: bước B3 (DX-04).',
        '<b>Lịch sử thay đổi nhân sự</b>: mỗi lần Bổ sung / Thay người một dòng — thời điểm, người thực hiện, bước, nhân sự trước / sau, văn bản căn cứ, lý do, task đã chuyển (plan §4).',
        'Prototype chạy một hồ sơ tại một thời điểm: Văn bản, Lịch sử và nút Cập nhật nhân sự chỉ có ở luồng đang chạy hồ sơ.',
      ],
      q: ['P-86', 'P-88', 'P-89'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs',
    };
    return `<div class="pg" data-luong-detail="${esc(code)}">
      ${head({ title: 'Xem chi tiết luồng mua sắm', back: 'luong', lg: true, info, right: `<button type="button" class="vbtn primary" data-go="dxms/${encodeURIComponent(x.code)}/edit">Chỉnh sửa</button>` })}
      <nav class="tabs dx-tabs" role="tablist">${TABS.map(([k, l]) => `<button type="button" class="tab ${DT.tab === k ? 'on' : ''}" role="tab" aria-selected="${DT.tab === k}" data-ltab="${k}">${l}</button>`).join('')}</nav>
      ${body}</div>`;
  }

  /* ---------- SCR-98 Hộp thoại Cập nhật nhân sự (D-28, D-29) ----------
     Mở từ tab Nhân sự thực hiện (SCR-97) và nút Cập nhật nhân sự trên màn xử lý task (hành động loại Khác UPDATE_MEMBERS — không đóng task). */
  function membersDialog(code, task) {
    const x = Flow.findDxms(code), proc = Flow.state.vars.process;
    const open = tasksOf(proc).filter((t) => stepState(code, t.key) !== 'done');
    const U = { task: open.some((t) => t.key === task) ? task : null, mode: 'replace', drop: [], add: [], doc: null, reason: '', err: {} };
    const radio = window.UI.vRadio;
    const f = (label, ctl, o) => field(label, ctl, o);
    function impact(t, cur) {
      const toks = Flow.state.tokens.filter((k) => String(k.task) === t.key);
      const rest = cur.list.filter((p) => !(U.mode === 'replace' && U.drop.includes(p)));
      const next = rest.concat(U.add.filter((p) => !rest.includes(p)));
      const signed = signDocs().filter((d) => d.st === 'SIGNED' && U.mode === 'replace' && d.who.some((w) => U.drop.includes(w)));
      const li = (k, v) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`;
      return `<div class="um-impact" data-um-impact><div class="um-impact-h">Ảnh hưởng của thay đổi</div><ul>
        ${li('Task đang mở của bước', toks.length ? toks.map((k) => `${esc(stepLabel(k.task))}: ${esc(names(k.cands || [k.who]))} → <b>${esc(names(next) || '-')}</b>`).join('<br>') : 'Không có — luồng chưa tới bước này')}
        ${li('Lần tới bước giao cho', next.length ? `<b>${esc(names(next))}</b>` : '-')}
        ${li('Văn bản đã ký', U.mode === 'replace' ? (signed.length ? signed.map((d) => `${esc(d.doc)} (${esc(names(d.who))}, ${esc(d.at)})`).join('; ') + ' — giữ nguyên' : 'Không có văn bản người bị thay đã ký') : 'Không ảnh hưởng (Bổ sung)')}
      </ul></div>`;
    }
    function body() {
      const t = U.task && open.find((o) => o.key === U.task), cur = t ? Flow.membersOf(t.key) : { list: [], set: false }, e = U.err;
      const users = t ? D.usersOfRole(t.role) : [];
      const pick = (id, label, val, opts, err, ph) => f(label, vSelect({ id, multi: true, value: val, disabled: !t, invalid: !!err, placeholder: t ? ph : 'Chọn bước trước',
        options: opts.map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` })), onChange: (v) => { U[id === 'um-drop' ? 'drop' : 'add'] = v; delete U.err[id === 'um-drop' ? 'drop' : 'add']; draw(); } }), { req: true, err });
      const others = users.filter((p) => !cur.list.includes(p.id));
      return `<div class="stack" data-um>
        ${f('Bước', vSelect({ id: 'um-step', value: U.task, searchable: true, placeholder: 'Chọn bước chưa xong', invalid: !!e.task, panelWidth: 520,
          options: open.map((o) => ({ value: o.key, short: `${stepNo(o.key)} · ${o.name}`, label: `${stepNo(o.key)} · ${o.name} — ${STEP_ST[stepState(code, o.key)][0]}` })),
          onChange: (v) => { Object.assign(U, { task: v, drop: [], add: [] }); delete U.err.task; draw(); } }), { req: true, err: e.task })}
        <div class="grid2">${f('Vai trò thực hiện', `<input class="vctl" value="${esc(t ? t.roleName : '')}" disabled>`)}
          ${f('Nhân sự hiện tại', `<input class="vctl" value="${esc(t ? names(cur.list) + (cur.set ? '' : ' (theo vai trò)') : '')}" disabled>`)}</div>
        <div class="vfield"><div class="lr"><label>Hình thức</label></div><div class="vradio h">${radio('Thay người', U.mode === 'replace', 'data-um-mode="replace"')}${radio('Bổ sung người', U.mode === 'add', 'data-um-mode="add"')}</div></div>
        ${U.mode === 'replace' ? `<div class="grid2">${pick('um-drop', 'Người bị thay', U.drop, users.filter((p) => cur.list.includes(p.id)), e.drop, 'Chọn người bị thay')}
          ${pick('um-add', 'Người thay thế', U.add, others, e.add, 'Chọn người thay thế')}</div>` : pick('um-add', 'Người bổ sung', U.add, others, e.add, 'Chọn người bổ sung')}
        <div class="vfield"><div class="lr"><label>Văn bản căn cứ</label><span class="faint">&nbsp;(không bắt buộc)</span></div>
          <div class="row">${U.doc ? `<span class="um-file">${icon('file')} ${esc(U.doc)}</span>${iconBtn('del', 'Xóa tệp', 'data-um-undoc')}` : `<button type="button" class="vbtn sm red" data-um-up>${icon('upload')} Tải file lên</button>`}<input type="file" id="um-file" hidden></div></div>
        ${f('Lý do', `<textarea class="vctl ta" id="um-reason" rows="2" maxlength="1000" placeholder="Nhập lý do (không bắt buộc)">${esc(U.reason)}</textarea>`)}
        ${t ? impact(t, cur) : ''}</div>`;
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
      const r = m.el.querySelector('#um-reason'); if (r) U.reason = r.value;
      const e = U.err = {};
      if (!U.task) e.task = 'Bạn cần chọn Bước.';
      else {
        if (U.mode === 'replace' && !U.drop.length) e.drop = 'Bạn cần chọn người bị thay.';
        if (!U.add.length) e.add = U.mode === 'replace' ? 'Bạn cần chọn người thay thế.' : 'Bạn cần chọn người bổ sung.';
      }
      if (Object.keys(e).length) { draw(); return; }
      const rec = Flow.updateMembers({ task: U.task, mode: U.mode, drop: U.drop, add: U.add, doc: U.doc, reason: U.reason.trim() });
      m.close();
      toast(`<b>Thành công</b><br>Đã ${U.mode === 'replace' ? 'thay người' : 'bổ sung người'} ở bước ${esc(stepLabel(U.task))}: ${esc(names(rec.now))}.${rec.moved.length ? ` Chuyển ${rec.moved.length} task đang mở.` : ''}`);
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
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-luong-form]')) { e.preventDefault(); save(); } });
  document.addEventListener('input', (e) => { if (e.target.id === 'luong-kw') { L.kw = e.target.value; L.page = 1; rerender(); const el = document.getElementById('luong-kw'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } } });
  document.addEventListener('change', (e) => {
    if (e.target.id !== 'lf-file') return;
    readInputs();
    const now = Flow.dateOf(Flow.state.clock);
    [...e.target.files].forEach((f) => { LF.seq += 1; LF.files.push({ id: LF.seq, name: f.name, type: null, target: null, at: now }); });
    delete LF.err.basis;
    rerender();
  });
  document.addEventListener('click', (e) => {
    const t = e.target;
    const lt = t.closest('[data-ltab]');
    if (lt) { DT.tab = lt.dataset.ltab; rerender(); return; }
    const uo = t.closest('[data-um-open]');
    if (uo && !uo.disabled) { membersDialog(uo.dataset.umCode || DT.code, uo.dataset.umOpen || null); return; }
    if (t.closest('[data-lf-up]')) { document.getElementById('lf-file').click(); return; }
    if (t.closest('[data-lf-add]')) { readInputs(); LF.rseq += 1; LF.rows.push({ id: LF.rseq, task: null, role: null, people: [] }); rerender(); return; }
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
  function route(parts) {
    if (parts[1] === 'create') return form();
    if (parts[1]) return detail(decodeURIComponent(parts[1]));
    return list();
  }
  function enter(parts) { if (parts[0] === 'luong' && parts[1] === 'create') resetForm(); }

  window.Luong = { isGop, setMode, menu, tasksOf, rolesOf, route, enter, taskBtn, membersDialog };
})();
