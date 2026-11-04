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
  /* Tìm kiếm nâng cao (SRS DTMS_CN_0135 #3–#9 + T29 F1, F2 theo HT-DXMS-NOTE màn 6): f = đã áp, d = đang nhập; hai kiểu tìm độc lập như profile-list. */
  const emptyF = () => ({ code: '', title: '', nv: null, block: null, unit: null, creator: null, st: [], priority: null, secret: null, from: '', to: '' });
  const L = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false };
  const href = (code) => 'luong/' + encodeURIComponent(code);
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const S5 = () => window.Screens.s5;
  function rows() {
    const cases = window.Screens.allCases(), f = L.f;
    return Flow.dxmsAll().map((x) => {
      const m = window.Screens.dxmsMeta(x, cases);
      const run = m.hs.find((c) => c.st === 'processing') || m.hs[0] || null;
      const live = run && run.live && Flow.state.status === 'running';
      const who = live ? [...new Set(Flow.state.tokens.flatMap((t) => t.cands || [t.who]))].map((id) => persona(id).name).join(', ') : '';
      return Object.assign({}, x, { state: m.state, run, who });
    }).filter((x) => (!L.adv ? !L.kw || norm(`${x.code} ${x.title}`).includes(norm(L.kw))
      : (!f.code || norm(x.code).includes(norm(f.code))) && (!f.title || norm(x.title).includes(norm(f.title))) && (!f.nv || x.nv === f.nv)
        && (!f.block || D.blockOf(x.unit) === f.block) && (!f.unit || x.unit === f.unit) && (!f.creator || x.creator === f.creator)
        && (!f.st.length || f.st.includes(x.state)) && (!f.priority || x.priority === f.priority) && (!f.secret || (f.secret === 'Có') === !!x.secret)
        && (!f.from || dk(x.created) >= dk(f.from)) && (!f.to || dk(x.created) <= dk(f.to))));
  }
  function advPanel() {
    const d = L.d, S = window.Screens.DXMS_STATUS;
    const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-lgf="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'lgf-' + k, value: d[k], clear: true, searchable: true, onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
    return `<form class="adv" data-lgadv><div class="grid3">
        ${txt('code', 'Mã ĐXMS', 'Nhập mã ĐXMS')}${txt('title', 'Tên luồng mua sắm', 'Nhập tên luồng mua sắm')}
        ${sel('nv', 'Đề tài / dự án', { placeholder: 'Chọn đề tài / dự án', options: D.nhiemVu.map((v) => ({ value: v.code, label: `${v.code} — ${v.name}` })) })}
        ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
    onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị đề xuất', { placeholder: 'Chọn đơn vị đề xuất', options: S5().unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
        ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: S5().creators().map((u) => ({ value: u, label: u })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, placeholder: 'Tất cả trạng thái', options: Object.entries(S).map(([value, [label]]) => ({ value, label })) })}
        ${sel('priority', 'Mức ưu tiên', { searchable: false, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })) })}
        ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
        ${txt('from', 'Ngày tạo từ', 'DD/MM/YYYY')}${txt('to', 'Ngày tạo đến', 'DD/MM/YYYY')}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-lg="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html
    const all = rows(), pages = Math.max(1, Math.ceil(all.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const S = window.Screens.DXMS_STATUS;
    const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Mã ĐXMS', 170], ['Tên luồng mua sắm', 280], ['Đề tài / dự án', 260], ['Đợt', 70, 'c'],
      ['Hồ sơ đang xử lý', 150], ['Quy trình', 100], ['Bước hiện tại', 220], ['Người đang xử lý', 180], ['Đơn vị đề xuất', 180], ['Người tạo', 170], ['Ngày cập nhật', 140]];
    const body = all.slice(from, from + L.size).map((x, i) => `<tr class="click" data-go="${href(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-go="dxms/${encodeURIComponent(x.code)}/edit"`)}</div></td>
        <td class="c">${badge(S[x.state][0], S[x.state][1])}</td><td><a class="link" data-go="${href(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
        <td>${clamp(S5().nvText(x.nv))}</td><td class="c">${S5().dotOf(x) || dash}</td>
        <td>${x.run ? `<a class="link" data-go="${window.Screens.caseHref(x.run)}">${esc(x.run.code)}</a>` : dash}</td><td>${clamp(x.run && x.run.flow)}</td>
        <td>${clamp(x.run && x.run.step)}</td><td>${clamp(x.who)}</td><td>${clamp(x.unit)}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-95', name: 'Danh sách luồng mua sắm', uc: 'UC-07-01, UC-07-12 · UR-DX-01, UR-DX-20',
      notes: [
        '<b>Phương án Gộp (T17 D-25)</b>: một mục <b>Luồng mua sắm</b> thay hai mục Đề xuất mua sắm và Hồ sơ đề xuất mua sắm. Đổi phương án ở Công cụ demo › Phương án menu ĐXMS. Dữ liệu không đổi: luồng = ĐXMS (cha), hồ sơ Phê duyệt / Điều chỉnh là con (D-10…D-12).',
        'Mỗi dòng là một luồng, kèm <b>hồ sơ đang xử lý</b>, quy trình, bước hiện tại và người đang xử lý — người dùng không phải mở danh sách hồ sơ riêng. Trạng thái suy từ hồ sơ như SCR-27 (R5).',
        '<b>Thêm mới</b> mở Tạo luồng (SCR-96): một lần Lưu tạo ĐXMS + hồ sơ Phê duyệt và khởi tạo quy trình (D-26).',
        'Bấm dòng mở Chi tiết luồng (SCR-97): Thông tin chung, Tiến trình, Căn cứ, Nhân sự thực hiện (Cập nhật nhân sự — SCR-98), Văn bản & ký duyệt, Lịch sử thay đổi nhân sự.',
        'Khuôn: task-management (danh sách nhiệm vụ). Cột Hồ sơ đang xử lý / Bước hiện tại / Người đang xử lý lấy từ wf_profile + Camunda user task (candidateUsers) của hồ sơ đang chạy.',
        '<b>Tìm kiếm nâng cao</b> theo SRS DTMS_CN_0135 (Mã, Tên luồng, Đề tài / dự án, Đơn vị đề xuất, Trạng thái, Mức ưu tiên, Ngày tạo) và <b>T29</b> theo màn Soạn thảo TTr của hệ thống cũ (HT-DXMS-NOTE màn 6, 7; "TTr" = ĐXMS): Khối đơn vị (Đơn vị đề xuất hiện theo khối — GIẢ LẬP P-190), Người tạo, Mật; bảng thêm Đề tài / dự án, Đợt (P-192), Người tạo. Các trường T29 SRS-DXMS chưa có (D-59).',
      ],
      q: ['P-190', 'P-192'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách luồng mua sắm', info, right: `<button class="vbtn primary" data-go="luong/create">${icon('add')} Thêm mới</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="luong-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên luồng" value="${esc(L.kw)}"></label>`}
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
    Object.assign(LF, { err: {}, files: [], rows: [], seq: 0, rseq: 0, dotTouched: false, cost: [], pick: { type: null, line: null }, reviewers: [], revMode: {}, revPick: null });
    LF.v = { title: '', nv: null, unit: UNITS.includes(u) ? u : null, priority: 'Thường', est: '', period: '', secret: 'Không', purpose: '', proc: null, dot: '', legal: '' };
  }
  /* ---------- T29 cách 1 — trường của màn Thêm mới TTr cũ (HT-DXMS-NOTE màn 8; "TTr" = ĐXMS) ----------
     Không trái Locked decisions: Loại biểu mẫu, Cấp phê duyệt, Hình thức trình ký chỉ đọc, hệ thống suy (luồng con vẫn xác định ở cổng
     sau bước 10 và bước 48; ký theo Mật); bảng bóc tách chi phí chỉ để tham khảo, căn cứ vẫn là tệp đính kèm (D-30); người thẩm định
     dự kiến điền sẵn bước 16 (DX-08). */
  const TH = () => D.dxmsRules()[0].to;
  const estNum = (s) => (String(s || '').trim() === '' ? null : Number(String(s).trim().replace(/\./g, '').replace(',', '.')));
  function derived(v) {
    /* Đã chọn quy trình (prototype còn ba quy trình MS01.0x tới khi làm S1) thì theo quy trình; chưa chọn thì theo Giá trị dự kiến. */
    if (v.proc) {
      const small = v.proc === 'MS01.03';
      return { form: small ? `ĐXMS có giá trị dưới nhóm B (dưới ${TH()} tỷ đồng)` : `ĐXMS có giá trị nhóm B trở lên (từ ${TH()} tỷ đồng)`,
        level: v.proc === 'MS01.01' ? 'Tập đoàn' : 'Tổng công ty', sign: v.secret === 'Có' ? 'Bản cứng (hồ sơ Mật)' : 'VOffice — đổi được khi trình ký' };
    }
    const e = estNum(v.est), big = e != null && !Number.isNaN(e) && e >= TH();
    return {
      form: e == null || Number.isNaN(e) ? 'Theo giá trị báo giá (bước 10)' : big ? `ĐXMS có giá trị nhóm B trở lên (từ ${TH()} tỷ đồng) — dự kiến` : `ĐXMS có giá trị dưới nhóm B (dưới ${TH()} tỷ đồng) — dự kiến`,
      level: e == null || Number.isNaN(e) ? 'Theo giá trị báo giá (bước 10)' : big ? 'Tổng công ty hoặc Tập đoàn — chọn ở bước 48' : 'Tổng công ty — dự kiến',
      sign: v.secret === 'Có' ? 'Bản cứng (hồ sơ Mật)' : 'VOffice — đổi được khi trình ký',
    };
  }
  const costLine = (id) => (LF.v.nv ? D.duToanOf(LF.v.nv) : []).find((l) => l.id === id) || null;
  const typeName = (t) => (D.costTypes.find(([k]) => k === t) || [t, t])[1];
  /* T29 S8 (B9): phần còn lại khả dụng của dòng dự toán = dự toán − ĐXMS đã phê duyệt − ĐXMS đang giữ (cùng hàm với SCR-104, D.duToanStats). */
  const availOf = (l) => {
    const s = D.duToanStats(l, (window.DeTai.usesOf(l.code)[l.id]) || []);
    return { value: s.remain, qty: l.qty == null ? null : l.qty - s.qty };
  };
  function costCard() {
    const nv = LF.v.nv, all = nv ? D.duToanOf(nv) : [], p = LF.pick, err = LF.err.cost || {}, ent = D.nvOf(nv) || {};
    const head = `<div class="vcard-h"><h3>Thông tin dự án / đề tài</h3>${nv && ent.loai !== 'KHCN' ? `<span class="cap">Dự toán tham khảo — căn cứ của loại ${esc(ent.loai)} là tài liệu căn cứ đính kèm</span>` : ''}</div>`;
    if (!nv) return `<section class="vcard" data-lf-cost>${head}<div class="lf-empty">Chọn Đề tài / dự án để bóc tách chi phí từ dự toán.</div></section>`;
    /* YC-DXMS-PROTO §3.1: chỉ khoản mục TTMS đã tích Chi mua sắm và còn khả dụng. */
    const lines = all.filter((l) => l.buy && availOf(l).value > 0);
    const types = [...new Set(lines.map((l) => l.type))];
    const avTxt = (l) => { const a = availOf(l); return `${a.qty == null ? '' : `${a.qty} ${l.uom || ''} · `}${ty(a.value)} tỷ đồng`; };
    return `<section class="vcard" data-lf-cost>${head}
      <div class="grid3">
        ${field('Loại chi phí', vSelect({ id: 'lf-ctype', value: p.type, placeholder: 'Chọn loại chi phí', options: types.map((t) => ({ value: t, label: typeName(t) })),
    onChange: upd((x) => { p.type = x; p.line = null; }) }))}
        ${field('Khoản mục chi phí', vSelect({ id: 'lf-cline', value: p.line, searchable: true, disabled: !p.type, placeholder: p.type ? 'Chọn khoản mục chi phí' : 'Chọn loại chi phí trước',
    options: lines.filter((l) => l.type === p.type).map((l) => ({ value: l.id, label: `${l.item} — còn ${avTxt(l)}` })), onChange: upd((x) => { p.line = x; }) }))}
        <div class="vfield"><div class="lr"><label>&nbsp;</label></div><div class="row"><button type="button" class="vbtn secondary" data-lf-cadd ${p.line ? '' : 'disabled'}>${icon('add')} Thêm vào ĐXMS</button></div></div>
      </div>
      ${table([['Thao tác', 80, 'c'], ['Nguồn vốn', 170], ['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80], ['Còn lại khả dụng', 180, 'r'],
    ['Số lượng đề xuất', 140], ['Giá trị dự tính (tỷ đồng)', 170], ['Hình thành gói thầu', 220]], LF.cost, (r) => {
    const l = costLine(r.line) || {}, e = err[r.id] || {}, a = availOf(l), q = estNum(r.qty), n = estNum(r.value);
    /* Vượt phần còn lại: cảnh báo, không chặn khi tạo (BR-DXMS-02-04); chặn ở bước 10 (P1, BR-DXMS-04-11). */
    const warn = [q != null && !Number.isNaN(q) && a.qty != null && q > a.qty ? `Vượt khối lượng còn lại (${a.qty}).` : '',
      n != null && !Number.isNaN(n) && n > a.value && n <= l.value ? `Vượt giá trị còn lại khả dụng (${ty(a.value)} tỷ đồng).` : ''].filter(Boolean).join(' ');
    const inp = (k, ph, max) => `<div class="vfield ${e[k] ? 'invalid' : ''}"><input class="vctl" data-lf-c${k}="${r.id}" maxlength="${max}" placeholder="${ph}" value="${esc(k === 'val' ? r.value : r[k])}" ${e[k] ? 'aria-invalid="true"' : ''}>${e[k] ? `<p class="msg" role="alert">${esc(e[k])}</p>` : ''}</div>`;
    return `<td class="c">${iconBtn('del', 'Xóa dòng', `data-lf-cdel="${r.id}"`)}</td><td>${clamp(l.fund)}</td>
        <td>${clamp(typeName(l.type))}</td><td>${clamp(l.item)}${warn ? `<div class="t-err" data-lf-cwarn>${esc(warn)}</div>` : ''}</td><td>${esc(l.uom || '')}</td><td class="r num">${avTxt(l)}</td>
        <td>${inp('qty', 'Nhập số lượng', 10)}</td><td>${inp('val', 'Nhập giá trị', 15)}</td>
        <td><input class="vctl" data-lf-cpkg="${r.id}" maxlength="500" placeholder="Nhập tên gói thầu dự kiến" value="${esc(r.pkg)}"></td>`;
  }, 'Chưa bóc tách chi phí — chọn Loại chi phí, Khoản mục chi phí rồi Thêm vào ĐXMS')}</section>`;
  }
  /* Danh sách người thẩm định (dự kiến) — điền sẵn bước 16 (DX-08, GIẢ LẬP P-194). */
  function reviewersCard() {
    const opts = D.cqcm.filter((c) => !LF.reviewers.includes(c.id));
    return `<section class="vcard" data-lf-rev><div class="vcard-h"><h3>Danh sách người thẩm định</h3>
        <div class="row"><div style="width:320px">${vSelect({ id: 'lf-rev', value: LF.revPick, searchable: true, placeholder: 'Chọn người thẩm định',
    options: opts.map((c) => ({ value: c.id, label: `${persona(c.doer).name} — ${c.unit}` })), onChange: upd((x) => { LF.revPick = x; }) })}</div>
        <button type="button" class="vbtn secondary" data-lf-radd ${LF.revPick ? '' : 'disabled'}>${icon('add')} Thêm mới</button></div></div>
      ${table([['Thao tác', 80, 'c'], ['Cách chọn', 180], ['Họ và tên / Vai trò', 280], ['Đơn vị', 260]], LF.reviewers.map((id) => D.cqcm.find((c) => c.id === id)), (c) => {
    /* D-62 (YC-DXMS-PROTO §4.2): chọn đích danh hoặc theo vai trò của phòng ban — Vai trò thì bước 19 giao cho nhóm vai trò của đơn vị (candidateGroups). */
    const m = LF.revMode[c.id] || 'nguoi';
    return `<td class="c">${iconBtn('del', 'Xóa', `data-lf-rvdel="${c.id}"`)}</td>
      <td>${vSelect({ id: 'lf-rvm-' + c.id, value: m, options: [{ value: 'nguoi', label: 'Đích danh' }, { value: 'vaitro', label: 'Theo vai trò' }], onChange: upd((x) => { LF.revMode[c.id] = x; }) })}</td>
      <td>${esc(m === 'vaitro' ? `${persona(c.doer).role} (mọi người của vai trò)` : persona(c.doer).name)}</td><td>${esc(c.unit)}</td>`;
  }, 'Chưa chọn người thẩm định — chọn ở bước lập phiếu yêu cầu thẩm định')}</section>`;
  }
  function readCost() {
    LF.cost.forEach((r) => {
      const a = document.querySelector(`[data-lf-cval="${r.id}"]`), b = document.querySelector(`[data-lf-cpkg="${r.id}"]`), c = document.querySelector(`[data-lf-cqty="${r.id}"]`);
      if (a) r.value = a.value;
      if (c) r.qty = c.value;
      if (b) r.pkg = b.value;
    });
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
    ['title', 'est', 'period', 'purpose', 'dot', 'legal'].forEach((k) => { const el = document.getElementById('lf-' + k); if (el) LF.v[k] = el.value; });
    readCost();
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
  }, 'Chưa có tài liệu căn cứ')}
      <div class="lf-legal">${field('Nội dung căn cứ pháp lý', `<textarea class="vctl ta" id="lf-legal" maxlength="4000" placeholder="Nhập căn cứ pháp lý (số, ngày, trích yếu văn bản)">${esc(LF.v.legal)}</textarea>`)}</div></section>`;
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
        '<b>T29 — Đợt mua sắm</b> (HT-DXMS-NOTE màn 8 "V/v đề xuất mua sắm; Đợt số"; "TTr" = ĐXMS): gợi ý số ĐXMS đã có của nhiệm vụ / đề tài, dự án + 1, đơn vị sửa được (GIẢ LẬP P-192). SRS-DXMS chưa có (D-59). Các trường khác của màn Thêm mới TTr cũ đã có cách làm khác: Loại biểu mẫu → Quy trình; Cấp phê duyệt → bước 48; đơn vị phê duyệt, chân ký → quy tắc ký; Hình thức trình ký → theo Mật; Căn cứ pháp lý → Căn cứ đầu vào; người thẩm định → chọn CQCM ở bước 16.',
        '<b>T29 cách 1 (người dùng chọn 04/11)</b> — đưa các trường của màn Thêm mới TTr cũ lên màn này mà không trái Locked decisions: <b>Loại biểu mẫu, Cấp phê duyệt, Hình thức trình ký chỉ đọc</b>, hệ thống suy từ Quy trình (hoặc Giá trị dự kiến khi chưa chọn) và Mật — luồng con vẫn xác định ở cổng sau bước 10 / bước 48, hình thức ký chọn khi trình ký. <b>AI kiểm tra quy tắc bảo mật</b> khi Mật = Có (như Thêm mới ĐXMS, BR-DXMS-01-07). <b>Nội dung căn cứ pháp lý</b> nhập text kèm tệp căn cứ.',
        '<b>Thông tin dự án / đề tài</b> (T29 S8, YC-DXMS-PROTO §4.1): chọn Loại chi phí → Khoản mục chi phí (2 dropdown liên hoàn) → <b>+ Thêm vào ĐXMS</b>, nhập Số lượng đề xuất và Giá trị dự tính. Danh sách lấy từ <b>bảng dự toán của đề tài / dự án</b> (SCR-104, D-65), chỉ khoản mục TTMS đã tích <b>Chi mua sắm</b> và còn khả dụng (dự toán − ĐXMS đã phê duyệt − ĐXMS đang giữ, cùng hàm với SCR-104). Chọn nhiều lần, nhiều loại chi phí (BG-0411). Vượt khối lượng / giá trị còn lại: cảnh báo đỏ, không chặn (BR-DXMS-02-04); chặn ở bước 10 (P1, BR-DXMS-04-11 — B4). Vượt giá trị dự toán của dòng: chặn Lưu.',
        '<b>D-60</b>: đề tài / dự án Loại KHCN — dòng thêm vào là hạng mục căn cứ của ĐXMS, BE ghi bảng giữ chỗ dòng dự toán ↔ ĐXMS khi Lưu và biến <code>duToanChon</code> cho bước 01, 05 (bảng chỉ xem). Loại khác — dự toán tham khảo, căn cứ là tài liệu đính kèm (D-30). Danh mục hàng hoá để rà soát tồn kho, báo giá (bocTach) chưa nối với dòng dự toán — làm ở B3 (S4). <b>Cần dev riêng</b>: bảng giữ chỗ, dropdown phụ thuộc trong eForm. Dữ liệu dự toán GIẢ LẬP P-193 (= DTMS_Q_0070).',
        '<b>Danh sách người thẩm định</b> (dự kiến): chọn + Thêm mới; Cách chọn <b>Đích danh</b> hoặc <b>Theo vai trò</b> của phòng ban (D-62, YC-DXMS-PROTO §4.2 — vai trò thì bước 19 giao cho nhóm vai trò của đơn vị, candidateGroups); danh sách điền sẵn vào bước 16 (chọn CQCM), vẫn sửa được ở bước 16, 17 — <b>DX-08</b> chờ BA duyệt, GIẢ LẬP P-194.',
      ],
      q: ['P-84', 'P-26', 'P-34', 'P-192', 'P-193', 'P-194'], src: 'task-management/components/task-create (mode create) + profile-management/profile-form · /task-management/create',
    };
    const dv = derived(v);
    return `<form class="pg" data-luong-form>
      ${head({ title: 'Thêm mới luồng mua sắm', back: 'luong', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="luong">Huỷ</button><button type="submit" class="vbtn primary" id="lf-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung</h3>
        <div class="grid3">
          ${field('Mã ĐXMS', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên luồng mua sắm', txt('title', 'Ví dụ: Luồng mua sắm cho dự án A', 500), { req: true, err: err.title, cls: 'span2' })}
          ${field('Đề tài / dự án', vSelect({ id: 'lf-nv', value: v.nv, searchable: true, placeholder: 'Chọn đề tài / dự án', invalid: !!err.nv,
    options: D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name} (${n.kind})` })), onChange: upd((x) => { v.nv = x; delete err.nv; if (!LF.dotTouched) v.dot = S5().nextDot(x); LF.cost = []; LF.pick = { type: null, line: null }; delete err.cost; }) }), { req: true, err: err.nv, cls: 'span2' })}
          ${field('Quy trình', vSelect({ id: 'lf-proc', value: v.proc, searchable: true, placeholder: 'Chọn quy trình', invalid: !!err.proc, options: procOpts,
    onChange: upd((x) => { v.proc = x; delete err.proc; syncRows(x); }) }), { req: true, err: err.proc })}
          ${field('Đơn vị đề xuất', vSelect({ id: 'lf-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit,
    options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd((x) => { v.unit = x; delete err.unit; }) }), { req: true, err: err.unit })}
          ${field('Mức ưu tiên', vSelect({ id: 'lf-pri', value: v.priority, placeholder: 'Chọn mức ưu tiên', options: PRIORITIES.map((p) => ({ value: p, label: p })),
    onChange: upd((x) => { v.priority = x; }) }), { req: true })}
          ${field('Mật', vSelect({ id: 'lf-sec', value: v.secret, options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd((x) => { v.secret = x; }) }))}
          ${field('Hình thức trình ký', `<input class="vctl" id="lf-d-sign" value="${esc(dv.sign)}" disabled>`)}
          ${field('Giá trị dự kiến (tỷ đồng)', txt('est', 'Nhập giá trị dự kiến'), { err: err.est })}
          ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 09/2027'))}
          ${field('Đợt mua sắm', txt('dot', 'Nhập số đợt', 3), { err: err.dot })}
          ${field('Loại biểu mẫu', `<input class="vctl" id="lf-d-form" value="${esc(dv.form)}" disabled>`)}
          ${field('Cấp phê duyệt', `<input class="vctl" id="lf-d-level" value="${esc(dv.level)}" disabled>`)}
          ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
          ${field('Mục đích', `<textarea class="vctl ta" id="lf-purpose" maxlength="2000" placeholder="Nhập mục đích">${esc(v.purpose)}</textarea>`, { cls: 'span3' })}
        </div></section>
      ${v.secret === 'Có' ? S5().secCheckCard({ title: v.title, purpose: v.purpose, unit: v.unit }, 'lf') : ''}
      ${costCard()}${basisCard()}${membersCard()}${reviewersCard()}</form>`;
  }

  function save() {
    readInputs();
    const v = LF.v, err = LF.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên luồng mua sắm.';
    if (!v.nv) err.nv = 'Bạn cần chọn Đề tài / dự án.';
    if (!v.proc) err.proc = 'Bạn cần chọn Quy trình.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
    const est = v.est.trim() === '' ? null : Number(v.est.trim().replace(/\./g, '').replace(',', '.'));
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Giá trị dự kiến không đúng định dạng.';
    if (v.dot.trim() !== '' && !/^[1-9]\d{0,2}$/.test(v.dot.trim())) err.dot = 'Đợt mua sắm là số nguyên dương.';
    const ce = {};
    LF.cost.forEach((r) => {
      const n = estNum(r.value), q = estNum(r.qty), l = costLine(r.line), e = {};
      if (q == null) e.qty = 'Bạn cần nhập Số lượng đề xuất.';
      else if (Number.isNaN(q) || q <= 0) e.qty = 'Số lượng đề xuất không đúng định dạng.';
      if (n == null) e.val = 'Bạn cần nhập Giá trị dự tính.';
      else if (Number.isNaN(n) || n <= 0) e.val = 'Giá trị dự tính không đúng định dạng.';
      else if (l && n > l.value) e.val = `Vượt giá trị dự toán (${ty(l.value)} tỷ đồng).`;
      if (Object.keys(e).length) ce[r.id] = e;
    });
    if (Object.keys(ce).length) err.cost = ce;
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
      purpose: v.purpose.trim(), members, basis, dot: v.dot.trim() ? Number(v.dot.trim()) : null, legal: v.legal.trim(),
      cost: LF.cost.map((r) => Object.assign({}, costLine(r.line), { line: r.line, qty: estNum(r.qty), value: estNum(r.value), budget: costLine(r.line).value, pkg: r.pkg.trim() })), reviewers: LF.reviewers.slice(), reviewerMode: Object.assign({}, LF.revMode) },
    { process: v.proc, name: v.title.trim(), caseFiles });
    /* DX-08: người thẩm định dự kiến điền sẵn danh sách CQCM của bước 16. */
    if (LF.reviewers.length) Flow.setUi('cqcmSel', LF.reviewers.slice());
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
      ${kv('Đề tài / dự án', D.nvOf(x.nv) ? `<a class="link" data-go="${window.DeTai.href(x.nv)}">${esc(`${x.nv} — ${D.nvOf(x.nv).name}`)}</a>` : null, 'span2')}${kv('Quy trình', esc(procOf(x) || ''))}
      ${kv('Đợt mua sắm', S5().dotOf(x) ? String(S5().dotOf(x)) : null)}${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Khối đơn vị', esc(D.blockOf(x.unit) || ''))}
      ${kv('Người tạo', esc(x.creator))}${kv('Mức ưu tiên', esc(x.priority))}${kv('Người được xem', esc(S5().viewersText(x)))}
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
        <td>${clamp((typeOf(r.type) || {}).name)}</td><td>${esc(r.to)}</td><td class="num">${esc(r.at)}</td>`, 'Chưa có tài liệu căn cứ')
      + (x.legal ? `<div class="lf-legal"><div class="k">Nội dung căn cứ pháp lý</div><div class="v">${esc(x.legal)}</div></div>` : ''))
      + card('Thông tin dự án / đề tài', table([['Mã dự án / đề tài', 150], ['Tên dự án / đề tài', 220], ['Nguồn vốn', 170], ['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80],
        ['Số lượng đề xuất', 130, 'r'], ['Giá trị dự toán (tỷ đồng)', 150, 'r'], ['Giá trị dự tính (tỷ đồng)', 150, 'r'], ['Hình thành gói thầu', 200]], x.cost || [], (r) =>
        `<td><a class="link" data-go="${window.DeTai.href(r.code)}">${esc(r.code)}</a></td><td>${clamp(r.name)}</td><td>${clamp(r.fund)}</td><td>${clamp(typeName(r.type))}</td><td>${clamp(r.item)}</td>
        <td>${esc(r.uom || '')}</td><td class="r num">${r.qty == null ? '-' : esc(String(r.qty))}</td><td class="r num">${ty(r.budget)}</td><td class="r num">${ty(r.value)}</td><td>${clamp(r.pkg)}</td>`, 'Chưa bóc tách chi phí từ dự toán'));
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
        '<b>T29</b> (HT-DXMS-NOTE màn 7, 8; "TTr" = ĐXMS): Thông tin chung thêm Đợt mua sắm (P-192), Khối đơn vị (P-190), Người được xem; nút <b>Cập nhật người xem</b> như hành động cùng tên của hệ thống cũ — GIẢ LẬP P-189. SRS-DXMS chưa có (D-59).',
      ],
      q: ['P-86', 'P-88', 'P-89', 'P-189', 'P-190', 'P-192'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs',
    };
    return `<div class="pg" data-luong-detail="${esc(code)}">
      ${head({ title: 'Xem chi tiết luồng mua sắm', back: 'luong', lg: true, info, right: `<button type="button" class="vbtn red" data-viewers="${esc(x.code)}">Cập nhật người xem</button><button type="button" class="vbtn primary" data-go="dxms/${encodeURIComponent(x.code)}/edit">Chỉnh sửa</button>` })}
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
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-lgadv]')) { e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); } });
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-lgf]');
    if (f) L.d[f.dataset.lgf] = f.value;
    if (e.target.id === 'lf-dot') LF.dotTouched = true;
  });
  /* Giá trị dự kiến, Tên, Mục đích đổi → cập nhật Loại biểu mẫu / Cấp phê duyệt dự kiến và khối AI kiểm tra bảo mật. */
  /* Cập nhật tại chỗ, không vẽ lại cả màn (giữ ô đang nhập). */
  document.addEventListener('change', (e) => {
    if (!['lf-est', 'lf-title', 'lf-purpose'].includes(e.target.id) || !document.querySelector('[data-luong-form]')) return;
    readInputs();
    const dv = derived(LF.v), set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('lf-d-form', dv.form); set('lf-d-level', dv.level); set('lf-d-sign', dv.sign);
    const sc = document.querySelector('[data-sec-check]');
    if (sc) sc.outerHTML = S5().secCheckCard({ title: LF.v.title, purpose: LF.v.purpose, unit: LF.v.unit }, 'lf');
  });
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
    const lg = t.closest('[data-lg]');
    if (lg) {
      if (lg.dataset.lg === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
      if (lg.dataset.lg === 'reset') { L.d = emptyF(); L.f = emptyF(); L.page = 1; }
      rerender(); return;
    }
    const uo = t.closest('[data-um-open]');
    if (uo && !uo.disabled) { membersDialog(uo.dataset.umCode || DT.code, uo.dataset.umOpen || null); return; }
    if (t.closest('[data-lf-up]')) { document.getElementById('lf-file').click(); return; }
    if (t.closest('[data-lf-cadd]') && LF.pick.line) {
      readInputs(); LF.rseq += 1; LF.cost.push({ id: 'c' + LF.rseq, line: LF.pick.line, qty: '', value: '', pkg: '' }); LF.pick.line = null; rerender(); return;
    }
    const cdel = t.closest('[data-lf-cdel]');
    if (cdel) { readInputs(); LF.cost = LF.cost.filter((r) => r.id !== cdel.dataset.lfCdel); if (LF.err.cost) delete LF.err.cost[cdel.dataset.lfCdel]; rerender(); return; }
    if (t.closest('[data-lf-radd]') && LF.revPick) { readInputs(); LF.reviewers.push(LF.revPick); LF.revPick = null; rerender(); return; }
    const rvdel = t.closest('[data-lf-rvdel]');
    if (rvdel) { readInputs(); LF.reviewers = LF.reviewers.filter((id) => id !== rvdel.dataset.lfRvdel); rerender(); return; }
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
