/* Phân hệ Quản lý sản xuất — Hồ sơ dự án, Biểu mẫu tài liệu, Bài học kinh nghiệm (T71 S11, D-124; SX-ULNL "Bước 15: Hồ sơ dự án"). GIẢ LẬP P-261.
   SX-18 Hồ sơ dự án: tài liệu của mọi dự án trong phạm vi xem theo nhóm hồ sơ (cùng nguồn với tab Tài liệu của dự án); Chọn mẫu tài liệu, Tải file lên, Sửa / Xoá tài liệu người dùng thêm.
   SX-19 Biểu mẫu tài liệu: danh mục sx-bieu-mau của Danh mục dùng chung (Catalog.list) mở trong phân hệ; nguồn của nút Chọn mẫu tài liệu.
   SX-20 Bài học kinh nghiệm: danh sách, Thêm mới / Chỉnh sửa (hộp thoại eForm), Chi tiết, Ban hành, Xoá nháp; đóng phiếu bất thường (bt.close) tự tạo bài học nháp.
   Route: #/sx/ho-so, #/sx/bieu-mau, #/sx/bai-hoc[/<mã>]. Lưu localStorage sx-proto-bh. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;
  const B = () => window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" ${attrs}>${icon(ic)}</button>`;
  const projOpts = (l) => l.map((p) => [p.code, `${p.code} — ${p.name}`]);
  const canManage = (code) => { const p = P().byCode(code); return !!p && (isAdmin() || p.pm === pid()); };

  /* ================= SX-18 Hồ sơ dự án ================= */
  const docRows = () => { const ids = new Set(P().visible().map((p) => p.code)); return P().docsAll().filter((x) => ids.has(x.project)).map((x) => Object.assign({}, x, { code: x.id })); };
  const SRC = { TPL: 'Từ biểu mẫu', UP: 'Tải lên' };
  function docList() {
    /* Góp ý 27/11: Hồ sơ dự án = điều hướng tới tab Tài liệu của từng dự án (thêm / sửa / xoá tài liệu làm ở tab Tài liệu) — danh sách dự án kèm số tài liệu theo danh mục. */
    const k = K();
    const info = {
      scr: 'SX-18', name: 'Hồ sơ dự án', uc: 'SX-ULNL Bước 15 Hồ sơ dự án; SX-KS-K1 §3.1 bước 15 (lưu hồ sơ sản xuất)',
      notes: [
        '<b>Góp ý 27/11:</b> Hồ sơ dự án chuyển thành điều hướng — mỗi dòng là một dự án, bấm để mở <b>tab Tài liệu</b> của dự án (Thêm danh mục tài liệu, (+) thêm tài liệu, Tải file lên, Sửa / Xoá ở đó). Không còn Thêm mới / Chọn mẫu / Tải file lên ở màn này để tài liệu chỉ quản lý một chỗ.',
        'Số tài liệu = mọi tài liệu của dự án (sinh từ quy trình, tải lên); "Chưa có tệp" = tài liệu mới chỉ có tên. Thật: kho tài liệu dùng chung (MinIO) gắn theo dự án, phân quyền theo dự án (GIẢ LẬP P-261).',
      ],
      q: ['P-261'], src: 'task-management/task-management.component',
    };
    const go = (p) => `sx/du-an/${encodeURIComponent(p.code)}/docs`;
    const rowOf = (p) => {
      const docs = p.docs || [], files = docs.filter((d) => d[6] || d[3]), last = docs.map((d) => d[4]).filter(Boolean).sort().pop();
      return Object.assign({}, p, { nDocs: docs.length, nNoFile: docs.length - files.length, last, kinds: new Set(docs.map((d) => d[1])).size });
    };
    return k.listPage({
      id: 'sxhs', title: 'Hồ sơ dự án', ph: 'Tìm kiếm theo tên, mã dự án', info, right: '',
      rows: () => P().visible().map(rowOf).sort((a, b) => (String(a.last || '') < String(b.last || '') ? 1 : -1)),
      kwText: (x) => `${x.code} ${x.name}`,
      empty: () => ({ project: null, status: null }),
      match: (x, f) => (!f.project || x.code === f.project) && (!f.status || x.status === f.status),
      adv: (txt, sel) => `${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('status', 'Trạng thái dự án', { searchable: false, options: Object.entries(D.sxStatus).map(([value, label]) => ({ value, label })) })}`,
      cols: [['Thao tác', 90, 'c'], ['Dự án', 420], ['Trạng thái dự án', 170, 'c'], ['Số tài liệu', 120, 'r'], ['Chưa có tệp', 120, 'r'], ['Số danh mục có tài liệu', 170, 'r'], ['Cập nhật gần nhất', 150], ['Giám đốc dự án', 200]],
      href: go,
      cell: (x) => `<td class="c"><div class="acts">${iconBtn('file', 'Xem tài liệu của dự án', `data-go="${go(x)}"`)}</div></td>
        <td>${NC(x.name, x.code, { go: go(x), tip: 'Xem tài liệu của dự án' })}</td><td class="c">${badge(D.sxStatus[x.status], D.sxStatusV[x.status])}</td>
        <td class="r num">${x.nDocs}</td><td class="r num${x.nNoFile ? ' t-err' : ''}">${x.nNoFile || k.dash}</td><td class="r num">${x.kinds}</td>
        <td class="num">${x.last ? esc(dmy(x.last)) : k.dash}</td><td>${k.clamp(pName(x.pm))}</td>`,
    });
  }
  const kinds = () => Object.entries(D.sxDocKind);
  async function docView(id) {
    const x = docRows().find((y) => y.id === id);
    if (!x) return;
    const { txt } = B();
    await window.EFormRun.open({ title: 'Xem chi tiết tài liệu', readOnly: true, values: {}, schema: { id: 'sx-hs-view', components: [
      txt(`**${x.d[0]}**`), txt(`Dự án ${x.project} · ${D.sxDocGroup[x.d[1]] || 'Khác'} · ${D.sxDocKind[x.d[1]] || x.d[1]}`),
      txt(`Phiên bản ${x.d[2]} · Người tải lên ${pName(x.d[3])} · Ngày ${dmy(x.d[4])}${SRC[x.d[5]] ? ` · ${SRC[x.d[5]]}` : ''}`)] } });
  }
  async function docForm(id) {
    const x = id ? docRows().find((y) => y.id === id) : null;
    const { sel, tf, file, req, opts } = B();
    const ps = P().visible().filter((p) => canManage(p.code));
    const comps = (x ? [] : [sel('hsProject', 'Dự án sản xuất', req(Object.assign(L(16), { searchable: true, values: opts(projOpts(ps)) })))])
      .concat([sel('hsKind', 'Loại tài liệu', req(Object.assign(L(10), { searchable: true, values: opts(kinds()) }))), tf('hsVer', 'Phiên bản', req(L(6))),
        x ? tf('hsName', 'Tên tài liệu', req({ validate: { required: true, maxLength: 500 } })) : file('hsFile', 'Tệp tài liệu', req())]);
    const r = await window.EFormRun.open({ title: x ? 'Chỉnh sửa tài liệu' : 'Tải file lên', schema: { id: x ? 'sx-hs-edit' : 'sx-hs-add', components: comps },
      values: x ? { hsKind: x.d[1], hsVer: x.d[2], hsName: x.d[0] } : { hsProject: null, hsKind: 'KHAC', hsVer: 'v1.0', hsFile: '' } });
    if (!r || !r.submit) return;
    const v = r.values;
    if (x) { P().docUpdate(x.id, [v.hsName.trim(), v.hsKind, v.hsVer.trim(), x.d[3], x.d[4], x.d[5]]); toast('<b>Thành công</b><br>Cập nhật thành công!'); }
    else { P().docAdd(v.hsProject, [String(v.hsFile).split(/[\\/]/).pop() || 'Tài liệu', v.hsKind, v.hsVer.trim(), pid(), D.sxToday, 'UP']); toast('<b>Thành công</b><br>Tải lên thành công!'); }
    rerender();
  }
  async function docTpl() {
    const ps = P().visible().filter((p) => canManage(p.code)), tpl = P().TPL();
    const { sel, req, opts } = B();
    const r = await window.EFormRun.open({ title: 'Chọn mẫu tài liệu', values: { hsProject: null, hsTpl: null }, schema: { id: 'sx-hs-tpl', components: [
      sel('hsProject', 'Dự án sản xuất', req({ searchable: true, values: opts(projOpts(ps)) })),
      sel('hsTpl', 'Biểu mẫu', req({ searchable: true, values: opts(tpl.map((t) => [t[0], `${t[0]} — ${t[2]}`])) }))] } });
    if (!r || !r.submit) return;
    P().useTpl(r.values.hsProject, tpl.find((t) => t[0] === r.values.hsTpl));
    toast('<b>Thành công</b><br>Thêm tài liệu thành công!');
    rerender();
  }

  /* ================= SX-20 Bài học kinh nghiệm ================= */
  const KEY = 'sx-proto-bh';
  const blank = () => ({ created: [], edit: {}, del: [] });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const lAll = () => U.created.concat(D.sxLessons).filter((x) => !U.del.includes(x.code)).map((x) => Object.assign({}, x, U.edit[x.code] || {}));
  const lBy = (code) => lAll().find((x) => x.code === code) || null;
  const patchL = (code, data) => { const own = U.created.find((x) => x.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign({}, U.edit[code], data); persist(); };
  const canPub = () => isAdmin() || ['R-SX-PM', 'R-SX-QA', 'R-SX-LD'].includes(D.roleOf(pid()));
  /* Đã ban hành: mọi người trong phân hệ; nháp: người lập, PM dự án, QA / Lãnh đạo, quản trị. */
  const lSee = (x) => x.status === 'PUB' || isAdmin() || x.author === pid() || canPub() && (!x.project || P().visible().some((p) => p.code === x.project));
  const lCanEdit = (x) => x.status === 'DRAFT' && (isAdmin() || x.author === pid());
  const lSt = (x) => (x.status === 'PUB' ? ['Đã ban hành', 'success'] : ['Nháp', 'default']);
  const lHref = (x) => 'sx/bai-hoc/' + encodeURIComponent(x.code);
  function nextCode() { const n = Math.max(0, ...lAll().map((x) => Number(x.code.slice(-3)))) + 1; return 'BHKN-2026-' + String(n).padStart(3, '0'); }
  function lList() {
    // Theo: task-management (danh sách); Thêm mới / Chỉnh sửa hộp thoại như ecat catalog-form-dialog (ngoại lệ B6)
    const k = K();
    const info = {
      scr: 'SX-20', name: 'Danh sách bài học kinh nghiệm', uc: 'SX-ULNL Bước 15 Bài học kinh nghiệm (Xem danh sách, Tìm kiếm, Thêm mới, Chỉnh sửa, Xem chi tiết, Xóa); SX-KS-K1 §3.2 bước 7 (lưu hồ sơ và bài học kinh nghiệm)',
      notes: [
        'Bài học lưu <b>Nháp</b> → PM / QA / Lãnh đạo <b>Ban hành</b>; đã ban hành thì mọi người trong phân hệ tra cứu được, nháp chỉ người lập và người quản lý thấy (GIẢ LẬP P-261).',
        'Đóng phiếu bất thường (bước 7 luồng xử lý bất thường) tự tạo bài học nháp từ nội dung Bài học kinh nghiệm của phiếu, ghi Nguồn = mã phiếu.',
        'Thêm mới / Chỉnh sửa bằng hộp thoại (như danh mục); Xoá chỉ bài học nháp, bởi người lập.',
      ],
      q: ['P-261'], src: 'task-management/task-management.component · /task-management',
    };
    return k.listPage({
      id: 'sxbh', exp: 'Danh sach bai hoc kinh nghiem', title: 'Danh sách bài học kinh nghiệm', ph: 'Tìm kiếm theo mã, tiêu đề, nội dung', info,
      right: D.roleOf(pid()) || isAdmin() ? `<button class="vbtn primary" data-sxbh-add>${icon('add')} Thêm mới</button>` : '',
      rows: () => lAll().filter(lSee).map((x) => Object.assign(x, { st: lSt(x) })).sort((a, b) => (a.code < b.code ? 1 : -1)),
      kwText: (x) => `${x.code} ${x.title} ${x.lesson} ${x.context}`,
      empty: () => ({ kind: null, project: null, st: [] }),
      match: (x, f) => (!f.kind || x.kind === f.kind) && (!f.project || x.project === f.project) && k.inSet(f.st, x.st[0]),
      adv: (txt, sel) => `${sel('kind', 'Lĩnh vực', { searchable: false, options: Object.entries(D.sxLessonKind).map(([value, label]) => ({ value, label })) })}
        ${sel('project', 'Dự án', { options: P().all().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ['Nháp', 'Đã ban hành'].map((x) => ({ value: x, label: x })) })}`,
      cols: [['Thao tác', 100, 'c'], ['Trạng thái', 140, 'c'], ['Bài học', 380], ['Lĩnh vực', 170], ['Dự án', 240], ['Nguồn', 150], ['Người lập', 180], ['Ngày ban hành', 130]],
      href: lHref,
      cell: (x) => `<td class="c"><div class="acts">${lCanEdit(x) ? `${iconBtn('edit', 'Sửa', `data-sxbh-edit="${esc(x.code)}"`)}<span class="sep"></span>${iconBtn('del', 'Xoá', `data-sxbh-del="${esc(x.code)}"`)}` : ''}</div></td>
        <td class="c">${badge(...x.st)}</td><td>${NC(x.title, x.code, { go: lHref(x), tip: 'Xem chi tiết bài học' })}</td><td>${esc(D.sxLessonKind[x.kind] || '')}</td>
        <td>${PJ(x.project)}</td><td>${x.src ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.src)}" title="Xem chi tiết phiếu bất thường">${esc(x.src)}</a>` : 'Nhập tay'}</td>
        <td>${k.clamp(pName(x.author))}</td><td class="num">${x.pub ? esc(dmy(x.pub)) : k.dash}</td>`,
    });
  }
  function lDetail(code) {
    const k = K(), x = lBy(code);
    if (!x || !lSee(x)) return `<div class="pg">${head({ title: 'Xem chi tiết bài học kinh nghiệm', back: 'sx/bai-hoc', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy bài học kinh nghiệm hoặc bạn không có quyền xem.')}</div>`;
    const info = { scr: 'SX-20', name: 'Chi tiết bài học kinh nghiệm', uc: 'SX-ULNL Bài học kinh nghiệm (Xem chi tiết)', notes: ['Khuôn task-create (mode detail). Ban hành: PM / QA / Lãnh đạo, bài học nháp.'], q: ['P-261'], src: 'task-management/components/task-create (mode detail)' };
    const right = (lCanEdit(x) ? `<button type="button" class="vbtn secondary" data-sxbh-edit="${esc(x.code)}">${icon('edit')} Chỉnh sửa</button>` : '')
      + (x.status === 'DRAFT' && canPub() ? `<button type="button" class="vbtn primary" data-sxbh-pub="${esc(x.code)}">Ban hành</button>` : '');
    return `<div class="pg" data-sxbh-detail="${esc(x.code)}">${head({ title: 'Xem chi tiết bài học kinh nghiệm', back: 'sx/bai-hoc', lg: true, info, right })}
      ${k.card('Thông tin chung', `<div class="ginfo c3">${k.kv('Mã bài học', esc(x.code))}${k.kv('Tiêu đề', esc(x.title), 'span2')}
        ${k.kv('Trạng thái', badge(...lSt(x)))}${k.kv('Lĩnh vực', esc(D.sxLessonKind[x.kind] || ''))}${k.kv('Dự án sản xuất', x.project ? `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>` : null)}
        ${k.kv('Nguồn', x.src ? `Phiếu bất thường <a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.src)}">${esc(x.src)}</a>` : 'Nhập tay')}${k.kv('Người lập', esc(pName(x.author)))}${k.kv('Ngày lập', esc(dmy(x.created)))}
        ${k.kv('Người ban hành', x.publisher ? esc(pName(x.publisher)) : null)}${k.kv('Ngày ban hành', x.pub ? esc(dmy(x.pub)) : null)}</div>`)}
      ${k.card('Nội dung bài học', `<div class="ginfo c3">${k.kv('Bối cảnh, sự việc', esc(x.context || ''), 'span3')}${k.kv('Nguyên nhân', esc(x.cause || ''), 'span3')}
        ${k.kv('Bài học', esc(x.lesson || ''), 'span3')}${k.kv('Khuyến nghị áp dụng', x.apply ? esc(x.apply) : null, 'span3')}</div>`)}</div>`;
  }
  async function lForm(code) {
    const x = code ? lBy(code) : null;
    const { tf, ta, sel, req, opts } = B();
    const r = await window.EFormRun.open({ title: x ? 'Chỉnh sửa bài học kinh nghiệm' : 'Thêm mới bài học kinh nghiệm', schema: { id: 'sx-bh-form', components: [
      tf('bhTitle', 'Tiêu đề', req({ validate: { required: true, maxLength: 500 } })),
      sel('bhKind', 'Lĩnh vực', req(Object.assign(L(8), { values: opts(Object.entries(D.sxLessonKind)) }))),
      sel('bhProject', 'Dự án sản xuất', Object.assign(L(8), { searchable: true, values: opts(projOpts(P().visible())) })),
      ta('bhContext', 'Bối cảnh, sự việc', req({ rows: 3 })), ta('bhCause', 'Nguyên nhân', req({ rows: 2 })), ta('bhLesson', 'Bài học', req({ rows: 3 })), ta('bhApply', 'Khuyến nghị áp dụng', { rows: 2 })] },
    values: x ? { bhTitle: x.title, bhKind: x.kind, bhProject: x.project, bhContext: x.context, bhCause: x.cause, bhLesson: x.lesson, bhApply: x.apply || '' }
      : { bhTitle: '', bhKind: null, bhProject: null, bhContext: '', bhCause: '', bhLesson: '', bhApply: '' } });
    if (!r || !r.submit) return;
    const v = r.values, data = { title: v.bhTitle.trim(), kind: v.bhKind, project: v.bhProject || null, context: v.bhContext.trim(), cause: v.bhCause.trim(), lesson: v.bhLesson.trim(), apply: (v.bhApply || '').trim() };
    if (x) { patchL(x.code, data); toast('<b>Thành công</b><br>Cập nhật thành công!'); rerender(); return; }
    const c = nextCode();
    U.created.unshift(Object.assign({ code: c, status: 'DRAFT', src: null, author: pid(), created: D.sxToday }, data));
    persist();
    toast('<b>Thành công</b><br>Thêm mới thành công!');
    location.hash = '#/' + lHref({ code: c });
  }
  /* Đóng phiếu bất thường → bài học nháp (giữ bộ xử lý cũ của sx-bat-thuong.js). */
  if (window.SxFlow) {
    const prev = window.SxFlow.ACT['bt.close'];
    const KIND = { L1: 'CL', L2: 'TK', L3: 'CN' };
    window.SxFlow.ACT['bt.close'] = (c, ch, xx) => {
      if (prev) prev(c, ch, xx);
      const it = window.SxBt && window.SxBt.byCode(c.obj), v = c.vars || {};
      if (!it || !v.bhBaiHoc || lAll().some((y) => y.src === it.code)) return;
      const code = nextCode();
      U.created.unshift({ code, title: `Bài học từ phiếu ${it.code}: ${it.title}`, project: it.project, kind: KIND[it.type] || 'QL', status: 'DRAFT', src: it.code, author: pid(), created: D.sxToday,
        context: it.desc || it.title, cause: v.blNguyenNhan || '', lesson: v.bhBaiHoc, apply: '' });
      persist();
      P().log(it.project, 'Tạo bài học kinh nghiệm', `${code} từ ${it.code}`);
    };
  }

  /* ================= Sự kiện ================= */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-sxhs-edit],[data-sxhs-del],[data-sxhs-view],[data-sxbh-del]');
    const tr = !t && e.target.closest && e.target.closest('tr.click[data-go="sx/ho-so"]');
    if (!t && !tr) return;
    if (tr && e.target.closest('a,button,input')) return;
    e.stopPropagation(); e.preventDefault();
    if (tr) { const a = tr.querySelector('[data-sxhs-view]'); if (a) docView(a.dataset.sxhsView); return; }
    if (t.dataset.sxhsView) { docView(t.dataset.sxhsView); return; }
    if (t.dataset.sxhsEdit) { docForm(t.dataset.sxhsEdit); return; }
    if (t.dataset.sxhsDel) {
      const x = docRows().find((y) => y.id === t.dataset.sxhsDel);
      if (!(await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa tài liệu: ${x.d[0]} không?`, hl: x.d[0], cancel: 'Hủy', ok: 'Xoá' }))) return;
      P().docRemove(x.id); toast('<b>Thành công</b><br>Xoá tài liệu thành công'); rerender(); return;
    }
    const x = lBy(t.dataset.sxbhDel);
    if (!(await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa bài học kinh nghiệm: ${x.title} không?`, hl: x.title, cancel: 'Hủy', ok: 'Xoá' }))) return;
    U.del.push(x.code); U.created = U.created.filter((y) => y.code !== x.code); persist();
    toast('<b>Thành công</b><br>Xoá bài học kinh nghiệm thành công'); rerender();
  }, true);
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-sxhs-add],[data-sxhs-tpl],[data-sxbh-add],[data-sxbh-edit],[data-sxbh-pub]');
    if (!t) return;
    if (t.dataset.sxhsAdd !== undefined) { docForm(null); return; }
    if (t.dataset.sxhsTpl !== undefined) { docTpl(); return; }
    if (t.dataset.sxbhAdd !== undefined) { lForm(null); return; }
    if (t.dataset.sxbhEdit) { e.stopPropagation(); lForm(t.dataset.sxbhEdit); return; }
    const x = lBy(t.dataset.sxbhPub);
    if (!(await window.Catalog.confirm({ sev: 'info', title: 'Ban hành bài học kinh nghiệm', desc: `Ban hành bài học ${x.title}? Sau khi ban hành mọi người trong phân hệ tra cứu được và không chỉnh sửa được.`, hl: x.title, cancel: 'Hủy', ok: 'Ban hành' }))) return;
    patchL(x.code, { status: 'PUB', pub: D.sxToday, publisher: pid() });
    if (x.project) P().log(x.project, 'Ban hành bài học kinh nghiệm', x.code);
    toast('<b>Thành công</b><br>Ban hành thành công!'); rerender();
  });

  function route(parts) {
    if (parts[0] === 'ho-so') return docList();
    if (parts[0] === 'bieu-mau') return window.Catalog.list('sx-bieu-mau');
    return parts[1] ? lDetail(decodeURIComponent(parts[1])) : lList();
  }
  function reset() { U = blank(); persist(); }
  window.SxHs = { route, reset, lessons: lAll, docRows };
})();
