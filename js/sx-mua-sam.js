/* Phân hệ Quản lý sản xuất — Đề xuất mua sắm từ sản xuất (T71 S4, D-121 Q6). SX-10: danh sách, lập / chỉnh sửa, chi tiết; tab Mua sắm & hợp đồng của dự án.
   Lập đề xuất: MBOM dự toán (VMMS, chỉ xem) × số lượng dự án, tồn kho khả dụng ERP Kho TCT tra cứu tức thì, đề xuất mua = nhu cầu − tồn (sửa được), chia đợt.
   T71 S10 (D-124): Gửi phê duyệt → luồng SX-MS (Lãnh đạo Khối Duyệt / Từ chối, P-255); Duyệt → service task gửi sang ĐTMS (API-01) = tạo ĐXMS thật (Flow.createDxms), nguồn "Phân hệ Sản xuất".
   Lập từ Nhu cầu vật tư (sx-nhu-cau.js) chọn sẵn dòng (preset). Danh sách Gói thầu, hợp đồng (#/sx/goi-thau-hd) đọc ngược từ ĐTMS. Trạng thái đọc ngược từ ĐTMS (API-02 ĐXMS / KHLCNT / gói thầu,
   API-03 hợp đồng); nhập kho (API-04) GIẢ LẬP. Không sửa SRS ĐTMS (C18). Route: #/sx/mua-sam, …/create[/<mã dự án>], …/<mã>, …/<mã>/edit. Lưu localStorage sx-proto-ms. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vSelect, vModal } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };

  /* ---------- Lưu ---------- */
  const KEY = 'sx-proto-ms';
  const blank = () => ({ props: [], edit: {}, stockAt: null, del: [] });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const all = () => U.props.concat(D.sxProposals).filter((x) => !(U.del || []).includes(x.code)).map((x) => Object.assign({}, x, U.edit[x.code] || {}));
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const visible = () => { const ids = new Set(P().visible().map((p) => p.code)); return all().filter((x) => ids.has(x.project)); };

  /* ---------- Vật tư ---------- */
  const mbomOf = (p) => D.sxMbom[p.product] || [];
  const stockOf = (code) => D.sxStock[code] || 0;
  /* Dòng đề xuất: lines [mã vật tư, số lượng đề xuất mua]. */
  const linesOf = (x) => { const p = P().byCode(x.project); const m = mbomOf(p); return x.lines.map(([c, q]) => Object.assign({}, m.find((r) => r.code === c) || { code: c, name: c, unit: '', per: 0, price: 0, lt: 0 }, { qty: q })); };
  const totalOf = (x) => linesOf(x).reduce((a, r) => a + r.qty * r.price, 0);
  const canCreate = () => isAdmin() || D.roleOf(pid()) === 'R-SX-PM';
  const FL = () => window.SxFlow;
  const caseOf = (x) => { const l = FL().cases(x.code, 'SX-MS'); return l[l.length - 1] || null; };
  const pending = (x) => { const c = caseOf(x); return !!c && c.status === 'running'; };
  const sentSt = (x) => (x.sent ? ['Đã gửi ĐTMS', 'success'] : pending(x) ? ['Chờ phê duyệt', 'warning'] : x.rejected ? ['Bị từ chối', 'error'] : ['Nháp', 'default']);
  const canEditP = (x) => !x.sent && !pending(x) && (isAdmin() || x.creator === pid() || (P().byCode(x.project) || {}).pm === pid());
  const canDelP = (x) => !x.sent && !FL().cases(x.code, 'SX-MS').length && (isAdmin() || x.creator === pid() || (P().byCode(x.project) || {}).pm === pid());
  const patchP = (code, data) => { const own = U.props.find((y) => y.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign(U.edit[code] || {}, data); persist(); };

  /* ---------- Tiến trình bên ĐTMS (đọc ngược) ---------- */
  function chain(x) {
    if (x.sync) return Object.assign({ live: false }, x.sync);
    if (!x.dxms) return null;
    const d = Flow.findDxms(x.dxms);
    if (!d) return { live: true, dxms: [x.dxms, 'Không tìm thấy trên ĐTMS', 'error', ''], pkgs: [], hd: [], kho: [] };
    const m = window.Screens.dxmsMeta(d, window.Screens.allCases()), st = window.Screens.DXMS_STATUS[m.state];
    const T = window.Thau, H = window.HopDong;
    const khs = T ? T.khAll().filter((k) => k.src && k.src[1] === d.code) : [];
    const pkgs = khs.flatMap((k) => T.pkgsOf(k)).map((g) => [g.code, g.name].concat(T.pkStLabel(g)));
    const hd = H ? pkgs.map((g) => H.byPkg(g[0])).filter(Boolean).map((h) => [h.code, h.title].concat(H.HD_ST[h.st] || ['Đang xử lý', 'info'], [h.nccN || '', null, ''])) : [];
    return { live: true, dxms: [d.code, st[0], st[1], d.updated || ''], kh: khs[0] ? [khs[0].code].concat(T.khStLabel(khs[0]), ['']) : null, pkgs, hd, kho: [] };
  }
  const dxmsSt = (x) => { const c = chain(x); return c ? [c.dxms[1], c.dxms[2]] : null; };
  function chainTable(x) {
    const k = K(), c = chain(x);
    if (!c) return '<p class="faint">Đề xuất chưa gửi sang ĐTMS.</p>';
    const d = (s) => (s && /^\d{4}-/.test(s) ? dmy(s) : s || '');
    const rows = [['Đề xuất mua sắm (ĐXMS)', c.dxms[0], '', [c.dxms[1], c.dxms[2]], d(c.dxms[3]), 'API-02', c.live ? `luong/${encodeURIComponent(c.dxms[0])}` : null]]
      .concat(c.kh ? [['Kế hoạch lựa chọn nhà thầu', c.kh[0], '', [c.kh[1], c.kh[2]], d(c.kh[3]), 'API-02', c.live ? `khlcnt/${encodeURIComponent(c.kh[0])}` : null]] : [])
      .concat(c.pkgs.map((g) => ['Gói thầu', g[0], g[1], [g[2], g[3]], '', 'API-02', c.live ? `goi-thau/${encodeURIComponent(g[0])}` : null]))
      .concat(c.hd.map((h) => ['Hợp đồng', h[0], `${h[1]}${h[4] ? ` · ${h[4]}` : ''}${h[5] ? ` · ${num(h[5])} đồng` : ''}`, [h[2], h[3]], d(h[6]), 'API-03', null]))
      .concat(c.kho.map((n) => ['Phiếu nhập kho TCT', n[0], n[1], [n[3], 'success'], d(n[2]), 'API-04', null]));
    return k.table([['Đối tượng trên ĐTMS', 180], ['Nội dung', 420], ['Trạng thái', 180, 'c'], ['Ngày cập nhật', 120], ['Luồng tích hợp', 110, 'c']], rows,
      (r) => `<td>${esc(r[0])}</td><td>${NC(r[2], r[1], r[6] ? { go: r[6], tip: 'Xem chi tiết' } : {})}</td><td class="c">${badge(r[3][0], r[3][1])}</td>
        <td class="num">${r[4] ? esc(r[4]) : k.dash}</td><td class="c">${esc(r[5])}</td>`)
      + (c.live && !c.pkgs.length ? '<p class="cap">Kế hoạch lựa chọn nhà thầu, gói thầu, hợp đồng và nhập kho hiện ở đây khi ĐTMS xử lý xong các bước tương ứng.</p>' : '');
  }

  /* ---------- SX-10 Danh sách ---------- */
  const href = (x) => 'sx/mua-sam/' + encodeURIComponent(x.code);
  const INFO_Q = ['P-255', 'P-248', 'P-249', 'P-243', 'P-262'];
  function list() {
    // Theo: task-management (danh sách đối tượng) — đề xuất mua sắm của sản xuất là bản ghi phía Sản xuất, ĐXMS thật nằm ở ĐTMS
    const k = K();
    const info = {
      scr: 'SX-10', name: 'Danh sách đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.3, §6 (API-01…04); SX-KS-K1 §2.3, §2.5; CDS-BT-03COP COP2 công đoạn 3',
      notes: [
        'Phân hệ Sản xuất không dựng màn xử lý mua sắm: đề xuất lập ở đây (hoặc từ <b>Nhu cầu vật tư</b>), <b>Gửi phê duyệt</b> → Lãnh đạo Khối Duyệt / Từ chối (luồng phê duyệt đề xuất mua sắm, GIẢ LẬP P-255); Duyệt thì hệ thống gửi sang ĐTMS tạo ĐXMS (API-01) — thẩm định, lựa chọn nhà thầu, hợp đồng chạy trên ĐTMS. Không sửa SRS ĐTMS tới khi chốt phạm vi (C18).',
        'Trạng thái: Nháp → Chờ phê duyệt → Đã gửi ĐTMS; bị từ chối thì về Bị từ chối, người lập sửa rồi gửi lại (hồ sơ phê duyệt mới).',
        'Trạng thái ĐTMS đọc ngược: ĐXMS, KHLCNT, gói thầu (API-02), hợp đồng (API-03), phiếu nhập kho TCT (API-04 — GIẢ LẬP, chưa có ERP Kho trên prototype). Hai đề xuất mẫu là dữ liệu chuyển đổi: trạng thái ĐTMS là ảnh đồng bộ (GIẢ LẬP P-249).',
      ],
      q: INFO_Q, src: 'task-management/task-management.component · /task-management',
    };
    return k.listPage({
      id: 'sxms', title: 'Danh sách đề xuất mua sắm từ sản xuất', ph: 'Tìm kiếm theo mã, tên đề xuất, dự án', info,
      right: projOpts().length ? `<button type="button" class="vbtn primary" data-go="sx/mua-sam/create" title="Lập đề xuất mua sắm (cùng màn với tab Mua sắm & hợp đồng của dự án)">${icon('add')} Thêm mới</button>` : '', /* góp ý 27/11 */
      rows: () => visible().map((x) => Object.assign({}, x, { st: sentSt(x), ds: dxmsSt(x), total: totalOf(x), dx: (chain(x) || { dxms: [''] }).dxms[0] })),
      kwText: (x) => `${x.code} ${x.title} ${x.project}`,
      empty: () => ({ code: '', title: '', project: null, dot: null, st: [] }),
      match: (x, f) => k.has(f.code, x.code) && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.dot || String(x.dot) === String(f.dot)) && k.inSet(f.st, x.st[0]),
      adv: (txt, sel) => `${txt('code', 'Mã đề xuất')}${txt('title', 'Tên đề xuất')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('dot', 'Đợt', { searchable: false, options: [{ value: '1', label: 'Đợt 1' }, { value: '2', label: 'Đợt 2' }] })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ['Nháp', 'Chờ phê duyệt', 'Bị từ chối', 'Đã gửi ĐTMS'].map((x) => ({ value: x, label: x })) })}`,
      cols: [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Đề xuất mua sắm', 440], ['Dự án', 240], ['Đợt', 70, 'c'], ['Giá trị dự toán (đồng)', 180, 'r'], ['Ngày gửi', 120]],
      href,
      cell: (x) => `<td class="c"><div class="acts">${canEditP(x) ? ib2('edit', 'Sửa', `data-go="${href(x)}/edit"`) : ''}${canDelP(x) ? ib2('del', 'Xoá', `data-sxm-del="${esc(x.code)}"`) : ''}</div></td><td class="c">${badge(...x.st)}</td><td>${NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết đề xuất mua sắm' })}${dxLine(x.dx, x.ds)}</td><td>${PJ(x.project)}</td><td class="c">${x.dot}</td>
        <td class="r num">${num(x.total)}</td><td class="num">${x.sent ? esc(dmy(x.sent)) : k.dash}</td>`,
    });
  }

  /* ---------- SX-10 Lập / Chỉnh sửa ---------- */
  const F = { code: null, v: {}, err: {} };
  const ib2 = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" ${attrs}>${icon(ic)}</button>`;
  /* Góp ý 27/11: ĐXMS (tạo trên ĐTMS sau khi gửi) và trạng thái trên ĐTMS là dòng phụ dưới tên đề xuất — thay 2 cột riêng. */
  const dxLine = (dx, ds) => (dx ? `<div class="faint" style="margin-top:6px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;white-space:nowrap"><span>ĐXMS</span><a class="link" data-go="sx/mua-sam/${encodeURIComponent(dx)}" title="Xem chi tiết ĐXMS đồng bộ từ ĐTMS">${esc(dx)}</a>${ds ? badge(...ds) : ''}</div>` : '');
  const projOpts = () => P().visible().filter((p) => p.status !== 'DONE' && (isAdmin() || p.pm === pid()));
  function pick(project, dot) {
    const p = P().byCode(project);
    if (!p) return [];
    return mbomOf(p).map((r) => { const need = r.per * p.qty, buy = Math.max(0, need - stockOf(r.code)); return { code: r.code, on: dot === 2 ? r.lt < 16 : r.lt >= 16, qty: buy }; });
  }
  function resetForm(code, project) {
    F.code = code || null; F.err = {};
    const x = code && byCode(code);
    if (x) { const m = pick(x.project, x.dot); F.v = { project: x.project, title: x.title, dot: x.dot, note: x.note || '', rows: m.map((r) => { const l = x.lines.find((y) => y[0] === r.code); return { code: r.code, on: !!l, qty: l ? l[1] : r.qty }; }) }; return; }
    const p = project && P().byCode(project);
    F.v = { project: p ? p.code : null, title: p ? `Mua sắm vật tư sản xuất ${p.product} — đợt 1` : '', dot: 1, note: '', rows: p ? pick(p.code, 1) : [] };
    /* Lập từ Nhu cầu vật tư: chỉ chọn các dòng đã chọn ở đó, số lượng = phần còn thiếu. */
    if (p && PRESET && PRESET.project === p.code) {
      const map = PRESET.map;
      F.v.rows = F.v.rows.map((r) => ({ code: r.code, on: map[r.code] != null, qty: map[r.code] != null ? map[r.code] : r.qty }));
      F.v.title = `Mua sắm vật tư sản xuất ${p.product} theo nhu cầu vật tư`;
      F.v.note = PRESET.note || '';
    }
    PRESET = null;
  }
  let PRESET = null;
  const preset = (project, map, note) => { PRESET = { project, map, note }; };
  function keep() {
    const g = (id) => document.getElementById(id);
    if (g('sxm-title')) F.v.title = g('sxm-title').value;
    if (g('sxm-note')) F.v.note = g('sxm-note').value;
    document.querySelectorAll('[data-sxm-qty]').forEach((i) => { const r = F.v.rows.find((x) => x.code === i.dataset.sxmQty); if (r) r.qty = Math.max(0, Math.floor(Number(i.value) || 0)); });
  }
  function form(code) {
    // Theo: task-create (create / edit) + bảng nhập dòng (vht-table có ô nhập, như hạng mục Lập ĐXMS)
    const k = K(), v = F.v, err = F.err, x = code ? byCode(code) : null;
    const back = x ? href(x) : 'sx/mua-sam';
    if (x && !canEditP(x)) return `<div class="pg">${head({ title: 'Chỉnh sửa đề xuất mua sắm', back, lg: true })}${k.emptyCard('Thông tin chung', x.sent ? 'Đề xuất đã gửi sang ĐTMS, không chỉnh sửa được. Điều chỉnh thực hiện trên ĐTMS.' : 'Đề xuất đang chờ phê duyệt, không chỉnh sửa được.')}</div>`;
    const p = v.project ? P().byCode(v.project) : null, cg = window.SxCg, rel = p && cg.relOf(p.product);
    const info = {
      scr: 'SX-10', name: x ? 'Chỉnh sửa đề xuất mua sắm từ sản xuất' : 'Lập đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.1 (Tờ trình mua sắm, tồn kho real-time), §2.3 API-01; SX-KS-K1 §2.3, §2.5',
      notes: [
        'Khuôn task-create. Nguồn kinh phí trích từ căn cứ hình thành của dự án (PAKD / nhiệm vụ / hợp đồng); chỉ tiêu kỹ thuật đính kèm từ Kho sản phẩm sẵn sàng sản xuất — sản phẩm chưa qua cổng chuyển giao thì chưa lập được (công đoạn trước xong mới kích hoạt công đoạn sau, SX-KS-K2 §4.1).',
        '<b>Nhu cầu vật tư</b>: <b>Danh mục vật tư</b> (MBOM dự toán đồng bộ VMMS × số lượng dự án) nay nằm ở màn Nhu cầu vật tư; ở đây chỉ chọn các vật tư cần mua; <b>Tra cứu tồn kho</b> đọc tồn khả dụng ERP Kho TCT tức thì (thay 3–5 ngày xin xác nhận giấy); đề xuất mua = nhu cầu − tồn, sửa được. Đợt 1 gợi ý vật tư leadtime từ 16 tuần, đợt 2 phần còn lại (GIẢ LẬP P-248).',
        '<b>Gửi phê duyệt</b> khởi tạo hồ sơ phê duyệt đề xuất (Lãnh đạo Khối Duyệt / Từ chối — GIẢ LẬP P-255). Duyệt thì hệ thống gửi sang ĐTMS: tạo ĐXMS ở trạng thái Chưa khởi tạo, Đơn vị đề xuất = Trung tâm Sản xuất, ghi nguồn Phân hệ Sản xuất; Trung tâm Mua sắm xử lý tiếp trên ĐTMS (P-249). Chờ phê duyệt và sau khi gửi không sửa ở đây.',
        'Mở từ <b>Nhu cầu vật tư</b>: chỉ chọn sẵn các vật tư đã chọn ở đó, số lượng đề xuất = phần còn thiếu so với tồn kho.',
      ],
      q: INFO_Q, src: 'task-management/components/task-create · /task-management/create',
    };
    const sel = (id, key, opts, o) => vSelect(Object.assign({ id, value: v[key], placeholder: 'Chọn ' + ((o && o.ph) || ''), invalid: !!err[key], options: opts,
      onChange: (val) => { keep(); v[key] = key === 'dot' ? Number(val) : val; delete err[key];
        if (key === 'project') { const pp = P().byCode(val); v.title = pp ? `Mua sắm vật tư sản xuất ${pp.product} — đợt ${v.dot}` : ''; v.rows = pick(val, v.dot); }
        if (key === 'dot') { v.rows = pick(v.project, v.dot); if (v.project) v.title = v.title.replace(/đợt \d$/, 'đợt ' + v.dot); }
        rerender(); } }, o || {}));
    const m = p ? mbomOf(p) : [];
    const rows = v.rows.map((r) => Object.assign({}, m.find((y) => y.code === r.code), r));
    const total = rows.filter((r) => r.on).reduce((a, r) => a + r.qty * r.price, 0);
    const tbl = p ? k.table([['', 50, 'c'], ['Vật tư', 340], ['ĐVT', 70], ['Định mức / bộ', 110, 'r'], ['Nhu cầu', 110, 'r'], ['Tồn kho TCT', 120, 'r'], ['Đề xuất mua', 130, 'r'],
      ['Đơn giá dự toán (đồng)', 170, 'r'], ['Thành tiền (đồng)', 170, 'r'], ['Leadtime (tuần)', 120, 'r'], ['Export License', 120, 'c']], rows,
    (r) => `<td class="c"><input type="checkbox" data-sxm-on="${esc(r.code)}" ${r.on ? 'checked' : ''} aria-label="Chọn ${esc(r.code)}"></td><td>${NC(r.name, r.code)}</td><td>${esc(r.unit)}</td>
      <td class="r num">${num(r.per)}</td><td class="r num">${num(r.per * p.qty)}</td><td class="r num">${num(stockOf(r.code))}</td>
      <td class="r"><input class="vctl num r" style="width:100px" inputmode="numeric" data-sxm-qty="${esc(r.code)}" value="${r.qty}" ${r.on ? '' : 'disabled'}></td>
      <td class="r num">${num(r.price)}</td><td class="r num">${r.on ? num(r.qty * r.price) : k.dash}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? 'Có' : 'Không'}</td>`) : '<p class="faint">Chọn dự án để lấy nhu cầu vật tư theo MBOM dự toán (xem Danh mục vật tư ở màn Nhu cầu vật tư).</p>';
    return `<form class="pg" data-sxm-form="${x ? esc(x.code) : ''}">
      ${head({ title: x ? 'Chỉnh sửa đề xuất mua sắm' : 'Lập đề xuất mua sắm', back, lg: true, info,
    right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="button" class="vbtn secondary" data-sxm-save>Lưu nháp</button><button type="submit" class="vbtn primary">Gửi phê duyệt</button>` })}
      ${err.gate ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>${esc(err.gate)}</span></div></div>` : ''}
      <section class="vcard"><h3>Thông tin chung</h3><div class="grid3">
        ${k.field('Mã đề xuất', `<input class="vctl" value="${x ? esc(x.code) : ''}" placeholder="Hệ thống tự sinh" disabled>`)}
        ${k.field('Tên đề xuất', `<input class="vctl" id="sxm-title" maxlength="500" placeholder="Nhập tên đề xuất" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span2' })}
        ${k.field('Dự án sản xuất', sel('sxm-project', 'project', projOpts().map((pp) => ({ value: pp.code, label: `${pp.code} — ${pp.name}` })), { searchable: true, ph: 'dự án', disabled: !!x }), { req: true, err: err.project, cls: 'span2' })}
        ${k.field('Đợt mua sắm', sel('sxm-dot', 'dot', [{ value: 1, label: 'Đợt 1' }, { value: 2, label: 'Đợt 2' }], { ph: 'đợt' }), { req: true })}
        ${k.field('Nguồn kinh phí', `<input class="vctl" value="${p ? esc(`${D.sxBasis[(p.basis || [])[0]] || ''} — ${(p.basis || [])[1] || ''}`) : ''}" placeholder="Theo căn cứ hình thành của dự án" disabled>`, { cls: 'span2' })}
        ${k.field('Chỉ tiêu kỹ thuật', `<input class="vctl" value="${p ? esc(rel ? `${p.product} ${rel.ver || p.version} — Kho sản phẩm sẵn sàng sản xuất${rel.pkg ? ` (gói ${rel.pkg})` : ''}` : 'Sản phẩm chưa có trong Kho sản phẩm sẵn sàng sản xuất') : ''}" placeholder="Theo Kho sản phẩm sẵn sàng sản xuất" disabled>`)}
        ${k.field('Ghi chú', `<textarea class="vctl" id="sxm-note" rows="2" maxlength="2000" placeholder="Nhập ghi chú">${esc(v.note)}</textarea>`, { cls: 'span3' })}
      </div></section>
      <section class="vcard pad24" data-sxm-lines><div class="vcard-h"><h3>Nhu cầu vật tư đề xuất mua</h3><div class="row">
        ${U.stockAt ? `<span class="cap">Tồn kho cập nhật ${esc(U.stockAt)}</span>` : ''}${p ? '<button type="button" class="vbtn secondary" data-sxm-stock>Tra cứu tồn kho</button>' : ''}</div></div>
        ${err.lines ? `<div class="t-err" style="margin:0 0 8px">${esc(err.lines)}</div>` : ''}${tbl}
        ${p ? `<div style="display:flex;justify-content:flex-end;padding-top:12px"><b>Tổng giá trị dự toán: <span data-sxm-total>${num(total)}</span> đồng</b></div>` : ''}</section></form>`;
  }
  function validate(send) {
    keep();
    const v = F.v, err = F.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên đề xuất.';
    if (!v.project) err.project = 'Bạn cần chọn Dự án sản xuất.';
    const p = v.project && P().byCode(v.project);
    if (p && !window.SxCg.ready(p.product)) err.gate = `Sản phẩm ${p.product} ${p.version} chưa có trong Kho sản phẩm sẵn sàng sản xuất (gói chuyển giao chưa được duyệt), chưa lập được đề xuất mua sắm.`;
    if (send && p && !v.rows.some((r) => r.on && r.qty > 0)) err.lines = 'Bạn cần chọn ít nhất một vật tư có số lượng đề xuất mua lớn hơn 0.';
    return !Object.keys(err).length;
  }
  function store() {
    const v = F.v, lines = v.rows.filter((r) => r.on).map((r) => [r.code, r.qty]);
    const data = { project: v.project, title: v.title.trim(), dot: v.dot, note: v.note.trim(), lines };
    let code = F.code;
    if (code) { if (U.props.some((x) => x.code === code)) Object.assign(U.props.find((x) => x.code === code), data); else U.edit[code] = Object.assign(U.edit[code] || {}, data); }
    else {
      const n = Math.max(0, ...all().map((x) => Number(x.code.slice(-3)))) + 1;
      code = 'ĐXSX-2026-' + String(n).padStart(3, '0');
      U.props.unshift(Object.assign({ code, creator: pid(), created: D.sxToday }, data));
      P().log(v.project, 'Lập đề xuất mua sắm', code);
    }
    F.code = code;
    persist();
    return code;
  }
  function saveDraft() {
    if (!validate(false)) { rerender(); return; }
    const code = store();
    toast('<b>Thành công</b><br>Lưu nháp thành công!');
    location.hash = '#/' + href({ code });
  }
  /* Gửi phê duyệt: khởi tạo hồ sơ SX-MS (bước 1 Lãnh đạo Khối). Dùng từ form (sau khi lưu) và từ Chi tiết. */
  function submitDlg(code) {
    const x = byCode(code), total = totalOf(x);
    if (!x.lines.some((l) => l[1] > 0)) { toast('Bạn cần chọn ít nhất một vật tư có số lượng đề xuất mua lớn hơn 0.', 'warn'); return; }
    const m = vModal({ title: 'Gửi phê duyệt đề xuất', size: 'sm', body: `<p>Gửi đề xuất <b>${esc(x.title)}</b> (dự toán ${num(total)} đồng) để Lãnh đạo Khối phê duyệt?</p><p class="cap">Đề xuất được duyệt sẽ tự động gửi sang phần mềm ĐTMS. Trong thời gian chờ phê duyệt, đề xuất không chỉnh sửa được.</p>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-sxm-send-ok>Gửi</button>' });
    m.el.querySelector('[data-sxm-send-ok]').onclick = () => {
      patchP(code, { rejected: null });
      FL().start('SX-MS', code);
      m.close(); toast('<b>Thành công</b><br>Gửi phê duyệt thành công!');
      location.hash = '#/' + href({ code });
      rerender();
    };
  }
  function send() {
    if (!validate(true)) { rerender(); return; }
    submitDlg(store());
  }
  /* Service task bước 2 của SX-MS (API-01): tạo ĐXMS thật trên ĐTMS rồi khoá đề xuất. */
  function toDtms(code) {
    const x = byCode(code), p = P().byCode(x.project), total = totalOf(x);
    const dx = Flow.createDxms({ title: x.title, nv: null, unit: 'Trung tâm Sản xuất', priority: 'Thường', est: Math.round(total / 1e6) / 1e3,
      period: `${dmy(p.start).slice(3)} – ${dmy(p.end).slice(3)}`, src: 'SX', sxProject: p.code, sxProposal: code });
    patchP(code, { sent: D.sxToday, dxms: dx });
    P().log(p.code, 'Gửi đề xuất mua sắm sang ĐTMS', `${code} → ${dx}`);
    return dx;
  }
  Object.assign(FL().ACT, {
    'ms.start': (c) => { const x = byCode(c.obj); P().log(x.project, 'Gửi phê duyệt đề xuất mua sắm', x.code); },
    'ms.review': (c, ch) => {
      const x = byCode(c.obj);
      if (ch && ch[2] === 'no') { c.vars.msRejected = true; patchP(x.code, { rejected: c.vars.ykNoiDung || 'Từ chối' }); P().log(x.project, 'Từ chối đề xuất mua sắm', `${x.code}: ${c.vars.ykNoiDung || ''}`); return; }
      patchP(x.code, { rejected: null, approved: D.sxToday, approver: pid() });
      P().log(x.project, 'Duyệt đề xuất mua sắm', x.code);
    },
    'ms.send': (c) => { toDtms(c.obj); },
  });

  /* ---------- SX-10 Chi tiết ---------- */
  function detail(code, opt) {
    const o = opt || {}, k = K(), x = byCode(code);
    const involved = x && FL().cases(x.code, 'SX-MS').some((cc) => cc.tokens.some((t) => t.who === pid()) || cc.hist.some((h) => h.who === pid()));
    if (!x || (!visible().some((y) => y.code === code) && !involved && !isAdmin())) return `<div class="pg">${head({ title: o.title || 'Xem chi tiết đề xuất mua sắm', back: o.back || 'sx/mua-sam', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy đề xuất mua sắm hoặc bạn không có quyền xem.')}</div>`;
    const p = P().byCode(x.project), lines = linesOf(x), c = chain(x), hs = caseOf(x);
    const info = {
      scr: 'SX-10', name: 'Chi tiết đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.3, §6',
      notes: ['Card <b>Tiến trình trên ĐTMS</b> đọc ngược từ ĐTMS: ĐXMS, KHLCNT, gói thầu (API-02), hợp đồng (API-03), phiếu nhập kho TCT (API-04, GIẢ LẬP). Mã ĐXMS mở thẳng màn ĐTMS (thật: liên kết sang phân hệ ĐTMS theo quyền người dùng).',
        '<b>Xoá</b> (T71 S12): chỉ đề xuất Nháp chưa gửi phê duyệt lần nào — đã khởi tạo hồ sơ phê duyệt (kể cả Bị từ chối) thì không xoá được.', 'Card <b>Hồ sơ phê duyệt đề xuất</b>: hồ sơ mới nhất của luồng phê duyệt (P-255). Màn xử lý việc của Lãnh đạo Khối dùng chính thân màn này + thanh trạng thái (my-task-detail).'],
      q: INFO_Q, src: 'task-create (mode detail)',
    };
    /* T71 S12: Xoá chỉ đề xuất Nháp chưa từng gửi phê duyệt (chưa khởi tạo hồ sơ SX-MS); đã có hồ sơ (kể cả Bị từ chối) thì giữ để tra vết. */
    const right = o.task || !canEditP(x) ? '' : (canDelP(x) ? `<button type="button" class="vbtn secondary" data-sxm-del="${esc(x.code)}">${icon('del')} Xoá</button>` : '') + `<button type="button" class="vbtn secondary" data-go="${href(x)}/edit">${icon('edit')} Chỉnh sửa</button>`
      + `<button type="button" class="vbtn primary" data-sxm-submit="${esc(x.code)}">Gửi phê duyệt</button>`;
    const alert = x.rejected && !x.sent && !pending(x) ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Đề xuất bị từ chối: ${esc(x.rejected)}</span></div></div>` : '';
    const pr = hs ? FL().progress(hs) : null;
    /* T73: đề xuất đã sang ĐTMS → đồng bộ nguyên 7 tab của Chi tiết ĐXMS (luong.js body), chỉ xem. */
    const dxc = x.dxms || (x.sync && x.sync.dxms[0]);
    if (dxc && window.Luong && Flow.findDxms(dxc) && !o.task && !o.bar) {
      return window.Luong.detailSx(dxc);
    }
    if (false) {
      window.Luong.useTab('ms:' + x.code, 'info');
      info.notes.unshift('<b>T73:</b> đề xuất đã gửi sang ĐTMS hiện nguyên các tab của Chi tiết đề xuất mua sắm trên ĐTMS (đồng bộ, chỉ xem); không có Thêm, Chỉnh sửa, Xuất Excel. <b>Danh mục vật tư</b> xem ở màn Nhu cầu vật tư.');
      return `<div class="pg" data-sxm-detail="${esc(x.code)}">${head({ title: o.title || 'Xem chi tiết đề xuất mua sắm', back: o.back || 'sx/mua-sam', lg: true, info, right: '' })}${o.bar || ''}
        <p class="cap" style="margin:0 0 8px">Đề xuất từ sản xuất <b>${esc(x.code)}</b> · ĐXMS <a class="link" data-go="luong/${encodeURIComponent(dxc)}">${esc(dxc)}</a> · ${badge(...sentSt(x))}</p>${window.Luong.body(dxc)}</div>`;
    }
    return `<div class="pg" data-sxm-detail="${esc(x.code)}">
      ${head({ title: o.title || 'Xem chi tiết đề xuất mua sắm', back: o.back || 'sx/mua-sam', lg: true, info, right })}${o.bar || ''}${alert}
      ${k.card('Thông tin chung', `<div class="ginfo c3">${k.kv('Mã đề xuất', esc(x.code))}${k.kv('Tên đề xuất', esc(x.title), 'span2')}
        ${k.kv('Trạng thái', badge(...sentSt(x)))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}${k.kv('Đợt mua sắm', String(x.dot))}
        ${k.kv('Nguồn kinh phí', p ? esc(`${D.sxBasis[(p.basis || [])[0]] || ''} — ${(p.basis || [])[1] || ''}`) : null, 'span2')}${k.kv('Giá trị dự toán', `${num(totalOf(x))} đồng`)}
        ${k.kv('Người lập', esc(pName(x.creator)))}${k.kv('Ngày lập', esc(dmy(x.created)))}${k.kv('Ngày gửi ĐTMS', x.sent ? esc(dmy(x.sent)) : null)}
        ${k.kv('Người duyệt', x.approver ? esc(pName(x.approver)) : null)}${k.kv('Ngày duyệt', x.approved ? esc(dmy(x.approved)) : null)}
        ${k.kv('Ghi chú', x.note ? esc(x.note) : null, 'span3')}</div>`)}
      ${k.card('Nhu cầu vật tư đề xuất mua', k.table([['Vật tư', 330], ['ĐVT', 60], ['Đề xuất mua', 110, 'r'], ['Đơn giá dự toán (đồng)', 150, 'r'], ['Thành tiền (đồng)', 150, 'r'], ['Leadtime (tuần)', 100, 'r'], ['Export License', 100, 'c']], lines,
        (r) => `<td>${NC(r.name, r.code)}</td><td>${esc(r.unit)}</td><td class="r num">${num(r.qty)}</td><td class="r num">${num(r.price)}</td><td class="r num">${num(r.qty * r.price)}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? 'Có' : 'Không'}</td>`))}
      ${pr ? `<div data-sxm-hs>${k.card('Hồ sơ phê duyệt đề xuất', pr.top + pr.steps)}${k.card('Lịch sử xử lý', pr.hist)}</div>` : ''}
      <section class="vcard pad24" data-sxm-chain><div class="vcard-h"><h3>Tiến trình trên ĐTMS</h3>${c && !c.live ? '<span class="cap">Dữ liệu đồng bộ từ ĐTMS</span>' : ''}</div>${chainTable(x)}</section></div>`;
  }
  /* Ngữ cảnh eForm của luồng SX-MS. */
  function ctx(code) {
    const x = byCode(code);
    return { de: { code: x.code, title: x.title, project: x.project, dot: x.dot, lines: x.lines.length, totalText: num(totalOf(x)) } };
  }

  /* ---------- Gói thầu, hợp đồng (đọc ngược ĐTMS — API-02, API-03; chỉ xem) ---------- */
  function pkgRows() {
    return visible().flatMap((x) => {
      const c = chain(x);
      if (!c) return [];
      const go = (kind, code) => (c.live ? `${kind === 'GT' ? 'goi-thau' : 'hop-dong'}/${encodeURIComponent(code)}` : href(x));
      return c.pkgs.map((g) => ({ kind: 'GT', code: g[0], name: g[1], st: [g[2], g[3]], ncc: '', value: null, at: '', x, go: go('GT', g[0]) }))
        .concat(c.hd.map((h) => ({ kind: 'HD', code: h[0], name: h[1], st: [h[2], h[3]], ncc: h[4] || '', value: h[5], at: h[6] || '', x, go: go('HD', h[0]) })));
    });
  }
  function pkgList() {
    // Theo: task-management (danh sách chỉ xem, như SCR-103 Danh sách đề tài / dự án) — dữ liệu đọc ngược ĐTMS
    const k = K(), KIND = { GT: 'Gói thầu', HD: 'Hợp đồng' };
    const info = {
      scr: 'SX-10', name: 'Danh sách gói thầu, hợp đồng của dự án sản xuất', uc: 'SX-ULNL (Thông tin gói thầu, hợp đồng: Danh sách, Tìm kiếm, Xem chi tiết); SX-KS-K2 §6 API-02, API-03',
      notes: ['Chỉ xem: gói thầu và hợp đồng sinh từ các đề xuất mua sắm của dự án sau khi ĐTMS xử lý (API-02 gói thầu, API-03 hợp đồng). Mã mở thẳng màn ĐTMS khi dữ liệu là liên kết trực tiếp; dữ liệu đồng bộ (đề xuất chuyển đổi) mở đề xuất nguồn.',
        'Thật: BE phân hệ Sản xuất gọi API ĐTMS theo mã ĐXMS đã lưu; không lưu bản sao gói thầu / hợp đồng.'],
      q: ['P-249'], src: 'task-management/task-management.component · /task-management (chỉ xem)',
    };
    return k.listPage({
      id: 'sxgt', exp: 'Danh sach goi thau hop dong', title: 'Danh sách gói thầu, hợp đồng', ph: 'Tìm kiếm theo mã, tên, dự án', info,
      rows: () => pkgRows(), kwText: (r) => `${r.code} ${r.name} ${r.x.project} ${r.ncc}`,
      empty: () => ({ kind: null, project: null, code: '' }),
      match: (r, f) => (!f.kind || r.kind === f.kind) && (!f.project || r.x.project === f.project) && k.has(f.code, r.code),
      adv: (txt, sel) => `${sel('kind', 'Loại', { searchable: false, options: Object.entries(KIND).map(([value, label]) => ({ value, label })) })}
        ${sel('project', 'Dự án', { options: P().visible().map((pp) => ({ value: pp.code, label: `${pp.code} — ${pp.name}` })) })}${txt('code', 'Mã gói thầu / hợp đồng')}`,
      cols: [['Trạng thái', 170, 'c'], ['Loại', 100], ['Tên', 400], ['Dự án', 240], ['Đề xuất mua sắm', 150], ['Nhà thầu', 240], ['Giá trị (đồng)', 170, 'r'], ['Ngày ký', 120]],
      href: (r) => r.go,
      cell: (r) => `<td class="c">${badge(...r.st)}</td><td>${KIND[r.kind]}</td><td>${NC(r.name, r.code, { go: r.go, tip: 'Xem chi tiết' })}</td><td>${PJ(r.x.project)}</td>
        <td><a class="link" data-go="${href(r.x)}">${esc(r.x.code)}</a></td><td>${r.ncc ? k.clamp(r.ncc) : k.dash}</td><td class="r num">${r.value ? num(r.value) : k.dash}</td><td class="num">${r.at ? esc(dmy(r.at)) : k.dash}</td>`,
    });
  }

  /* ---------- Tab Mua sắm & hợp đồng của dự án ---------- */
  function projectTab(p) {
    const k = K(), l = all().filter((x) => x.project === p.code);
    const can = p.status !== 'DONE' && (isAdmin() || p.pm === pid());
    const hd = l.flatMap((x) => { const c = chain(x); return c ? c.hd.map((h) => [x, h]) : []; });
    const kho = l.flatMap((x) => { const c = chain(x); return c ? c.kho.map((n) => [x, n]) : []; });
    return `<div data-sx-ms>
      <section class="vcard pad24"><div class="vcard-h"><h3>Đề xuất mua sắm</h3>${can ? `<button type="button" class="vbtn secondary" data-go="sx/mua-sam/create/${encodeURIComponent(p.code)}">${icon('add')} Lập đề xuất mua sắm</button>` : ''}</div>
        ${k.table([['Đề xuất mua sắm', 400], ['Đợt', 70, 'c'], ['Giá trị dự toán (đồng)', 180, 'r'], ['Trạng thái', 140, 'c']], l,
    (x) => { const ds = dxmsSt(x), c = chain(x); return `<td>${NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết đề xuất mua sắm' })}${dxLine(c ? c.dxms[0] : '', ds)}</td><td class="c">${x.dot}</td><td class="r num">${num(totalOf(x))}</td>
      <td class="c">${badge(...sentSt(x))}</td>`; })}</section>
      ${k.card('Hợp đồng', k.table([['Hợp đồng', 420], ['Nhà thầu', 260], ['Giá trị (đồng)', 170, 'r'], ['Trạng thái', 150, 'c']], hd,
    ([, h]) => `<td>${NC(h[1], h[0])}</td><td>${h[4] ? k.clamp(h[4]) : k.dash}</td><td class="r num">${h[5] ? num(h[5]) : k.dash}</td><td class="c">${badge(h[2], h[3])}</td>`))}
      ${k.card('Nhập kho Tổng công ty', k.table([['Phiếu nhập kho', 460], ['Ngày nhập', 130], ['Trạng thái', 150, 'c']], kho,
    ([, n]) => `<td>${NC(n[1], n[0])}</td><td class="num">${esc(dmy(n[2]))}</td><td class="c">${badge(n[3], 'success')}</td>`))}
      ${window.SxNc ? window.SxNc.supplyCard(p) : ''}</div>`;
  }

  async function delP(code) {
    const x = byCode(code);
    if (!x || !canDelP(x)) return;
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa đề xuất mua sắm: ${x.code} — ${x.title} không?`, hl: `${x.code} — ${x.title}`, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    U.props = U.props.filter((y) => y.code !== code);
    if (D.sxProposals.some((y) => y.code === code)) U.del = (U.del || []).concat(code);
    persist();
    P().log(x.project, 'Xoá đề xuất mua sắm', code);
    toast('<b>Thành công</b><br>Xoá đề xuất mua sắm thành công');
    location.hash = '#/sx/mua-sam';
  }
  /* ---------- Sự kiện ---------- */
  document.addEventListener('submit', (e) => { if (e.target.closest && e.target.closest('[data-sxm-form]')) { e.preventDefault(); send(); } });
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    if (t.closest('[data-sxm-save]')) { saveDraft(); return; }
    const dl = t.closest('[data-sxm-del]');
    if (dl) { delP(dl.dataset.sxmDel); return; }
    const sb = t.closest('[data-sxm-submit]');
    if (sb) { submitDlg(sb.dataset.sxmSubmit); return; }
    if (t.closest('[data-sxm-stock]')) { keep(); U.stockAt = `${dmy(D.sxToday)} ${new Date().toTimeString().slice(0, 5)}`; persist(); toast('Đã cập nhật tồn kho khả dụng từ ERP Kho TCT.', 'success'); rerender(); }
  });
  document.addEventListener('change', (e) => {
    const on = e.target.closest && e.target.closest('[data-sxm-on]');
    if (on) { keep(); const r = F.v.rows.find((x) => x.code === on.dataset.sxmOn); if (r) r.on = on.checked; delete F.err.lines; rerender(); return; }
    const q = e.target.closest && e.target.closest('[data-sxm-qty]');
    if (q) { keep(); rerender(); }
  });

  function route(parts) {
    if (parts[0] === 'goi-thau-hd') return pkgList();
    const [, a, b] = parts;
    if (a === 'create') return form(null);
    if (a && b === 'edit') return form(decodeURIComponent(a));
    if (a) { const c = decodeURIComponent(a); return /^ĐXMS/.test(c) && window.Luong ? window.Luong.detailSx(c) : detail(c); }
    /* Góp ý 27/11: menu Đề xuất mua sắm = danh sách đề xuất của Sản xuất (Nháp, Chờ phê duyệt, Bị từ chối, Đã gửi ĐTMS — cột ĐXMS mở ĐXMS đồng bộ) có Thêm mới / Sửa / Xoá; thay danh sách ĐXMS chỉ xem (T73). */
    return list();
  }
  function enter(parts) {
    if (parts[0] !== 'mua-sam') return;
    if (parts[1] === 'create') resetForm(null, parts[2] ? decodeURIComponent(parts[2]) : null);
    else if (parts[2] === 'edit') resetForm(decodeURIComponent(parts[1]));
  }
  function reset() { U = blank(); persist(); }

  window.SxMs = { route, enter, reset, all, byCode, chain, projectTab, totalOf, detail, ctx, preset, stOf: sentSt, viewTitle: 'Xem chi tiết đề xuất mua sắm', tabKey: (code) => 'ms:' + code };
})();
