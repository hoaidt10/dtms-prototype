/* Phân hệ Quản lý sản xuất — Đề xuất mua sắm từ sản xuất (T71 S4, D-121 Q6). SX-10: danh sách, lập / chỉnh sửa, chi tiết; tab Mua sắm & hợp đồng của dự án.
   Lập đề xuất: MBOM dự toán (VMMS, chỉ xem) × số lượng dự án, tồn kho khả dụng ERP Kho TCT tra cứu tức thì, đề xuất mua = nhu cầu − tồn (sửa được), chia đợt.
   Gửi sang ĐTMS (API-01) = tạo ĐXMS thật trên ĐTMS (Flow.createDxms), nguồn "Phân hệ Sản xuất". Trạng thái đọc ngược từ ĐTMS (API-02 ĐXMS / KHLCNT / gói thầu,
   API-03 hợp đồng); nhập kho (API-04) GIẢ LẬP. Không sửa SRS ĐTMS (C18). Route: #/sx/mua-sam, …/create[/<mã dự án>], …/<mã>, …/<mã>/edit. Lưu localStorage sx-proto-ms. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vSelect, vModal } = window.UI;
  const K = () => window.Thau.kit;
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
  const blank = () => ({ props: [], edit: {}, stockAt: null });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const all = () => U.props.concat(D.sxProposals).map((x) => Object.assign({}, x, U.edit[x.code] || {}));
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const visible = () => { const ids = new Set(P().visible().map((p) => p.code)); return all().filter((x) => ids.has(x.project)); };

  /* ---------- Vật tư ---------- */
  const mbomOf = (p) => D.sxMbom[p.product] || [];
  const stockOf = (code) => D.sxStock[code] || 0;
  /* Dòng đề xuất: lines [mã vật tư, số lượng đề xuất mua]. */
  const linesOf = (x) => { const p = P().byCode(x.project); const m = mbomOf(p); return x.lines.map(([c, q]) => Object.assign({}, m.find((r) => r.code === c) || { code: c, name: c, unit: '', per: 0, price: 0, lt: 0 }, { qty: q })); };
  const totalOf = (x) => linesOf(x).reduce((a, r) => a + r.qty * r.price, 0);
  const canCreate = () => isAdmin() || D.roleOf(pid()) === 'R-SX-PM';
  const sentSt = (x) => (x.sent ? ['Đã gửi ĐTMS', 'success'] : ['Nháp', 'default']);

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
    return k.table([['Đối tượng trên ĐTMS', 200], ['Mã', 170], ['Nội dung', 380], ['Trạng thái', 190, 'c'], ['Ngày cập nhật', 130], ['Luồng tích hợp', 120, 'c']], rows,
      (r) => `<td>${esc(r[0])}</td><td>${r[6] ? `<a class="link" data-go="${r[6]}">${esc(r[1])}</a>` : esc(r[1])}</td><td>${r[2] ? k.clamp(r[2]) : k.dash}</td><td class="c">${badge(r[3][0], r[3][1])}</td>
        <td class="num">${r[4] ? esc(r[4]) : k.dash}</td><td class="c">${esc(r[5])}</td>`)
      + (c.live && !c.pkgs.length ? '<p class="cap">Kế hoạch lựa chọn nhà thầu, gói thầu, hợp đồng và nhập kho hiện ở đây khi ĐTMS xử lý xong các bước tương ứng.</p>' : '');
  }

  /* ---------- SX-10 Danh sách ---------- */
  const href = (x) => 'sx/mua-sam/' + encodeURIComponent(x.code);
  const INFO_Q = ['P-248', 'P-249', 'P-243'];
  function list() {
    // Theo: task-management (danh sách đối tượng) — đề xuất mua sắm của sản xuất là bản ghi phía Sản xuất, ĐXMS thật nằm ở ĐTMS
    const k = K();
    const info = {
      scr: 'SX-10', name: 'Danh sách đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.3, §6 (API-01…04); SX-KS-K1 §2.3, §2.5; CDS-BT-03COP COP2 công đoạn 3',
      notes: [
        'Phân hệ Sản xuất không dựng màn xử lý mua sắm: đề xuất lập ở đây, <b>Gửi sang ĐTMS</b> tạo ĐXMS trên ĐTMS (API-01) — thẩm định, lựa chọn nhà thầu, hợp đồng chạy trên ĐTMS. Không sửa SRS ĐTMS tới khi chốt phạm vi (C18).',
        'Trạng thái ĐTMS đọc ngược: ĐXMS, KHLCNT, gói thầu (API-02), hợp đồng (API-03), phiếu nhập kho TCT (API-04 — GIẢ LẬP, chưa có ERP Kho trên prototype). Hai đề xuất mẫu là dữ liệu chuyển đổi: trạng thái ĐTMS là ảnh đồng bộ (GIẢ LẬP P-249).',
      ],
      q: INFO_Q, src: 'task-management/task-management.component · /task-management',
    };
    return k.listPage({
      id: 'sxms', title: 'Danh sách đề xuất mua sắm từ sản xuất', ph: 'Tìm kiếm theo mã, tên đề xuất, dự án', info,
      right: canCreate() ? `<button class="vbtn primary" data-go="sx/mua-sam/create">${icon('add')} Thêm mới</button>` : '',
      rows: () => visible().map((x) => Object.assign({}, x, { st: sentSt(x), ds: dxmsSt(x), total: totalOf(x), dx: (chain(x) || { dxms: [''] }).dxms[0] })),
      kwText: (x) => `${x.code} ${x.title} ${x.project}`,
      empty: () => ({ code: '', title: '', project: null, dot: null }),
      match: (x, f) => k.has(f.code, x.code) && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.dot || String(x.dot) === String(f.dot)),
      adv: (txt, sel) => `${txt('code', 'Mã đề xuất')}${txt('title', 'Tên đề xuất')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('dot', 'Đợt', { searchable: false, options: [{ value: '1', label: 'Đợt 1' }, { value: '2', label: 'Đợt 2' }] })}`,
      cols: [['Trạng thái', 140, 'c'], ['Mã đề xuất', 140], ['Tên đề xuất', 300], ['Dự án', 150], ['Đợt', 70, 'c'], ['Giá trị dự toán (đồng)', 180, 'r'], ['Mã ĐXMS', 150], ['Trạng thái trên ĐTMS', 170, 'c'], ['Ngày gửi', 120]],
      href,
      cell: (x) => `<td class="c">${badge(...x.st)}</td><td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${k.clamp(x.title)}</td><td>${esc(x.project)}</td><td class="c">${x.dot}</td>
        <td class="r num">${num(x.total)}</td><td>${x.dx ? esc(x.dx) : k.dash}</td><td class="c">${x.ds ? badge(...x.ds) : k.dash}</td><td class="num">${x.sent ? esc(dmy(x.sent)) : k.dash}</td>`,
    });
  }

  /* ---------- SX-10 Lập / Chỉnh sửa ---------- */
  const F = { code: null, v: {}, err: {} };
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
  }
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
    if (x && x.sent) return `<div class="pg">${head({ title: 'Chỉnh sửa đề xuất mua sắm', back, lg: true })}${k.emptyCard('Thông tin chung', 'Đề xuất đã gửi sang ĐTMS, không chỉnh sửa được. Điều chỉnh thực hiện trên ĐTMS.')}</div>`;
    const p = v.project ? P().byCode(v.project) : null, cg = window.SxCg, rel = p && cg.relOf(p.product);
    const info = {
      scr: 'SX-10', name: x ? 'Chỉnh sửa đề xuất mua sắm từ sản xuất' : 'Lập đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.1 (Tờ trình mua sắm, tồn kho real-time), §2.3 API-01; SX-KS-K1 §2.3, §2.5',
      notes: [
        'Khuôn task-create. Nguồn kinh phí trích từ căn cứ hình thành của dự án (PAKD / nhiệm vụ / hợp đồng); chỉ tiêu kỹ thuật đính kèm từ Kho sản phẩm sẵn sàng sản xuất — sản phẩm chưa qua cổng chuyển giao thì chưa lập được (công đoạn trước xong mới kích hoạt công đoạn sau, SX-KS-K2 §4.1).',
        '<b>Danh mục vật tư</b>: MBOM dự toán đồng bộ từ VMMS (chỉ xem) × số lượng dự án = nhu cầu; <b>Tra cứu tồn kho</b> đọc tồn khả dụng ERP Kho TCT tức thì (thay 3–5 ngày xin xác nhận giấy); đề xuất mua = nhu cầu − tồn, sửa được. Đợt 1 gợi ý vật tư leadtime từ 16 tuần, đợt 2 phần còn lại (GIẢ LẬP P-248).',
        '<b>Gửi sang ĐTMS</b> tạo ĐXMS trên ĐTMS ở trạng thái Chưa khởi tạo, Đơn vị đề xuất = Trung tâm Sản xuất, ghi nguồn Phân hệ Sản xuất; Trung tâm Mua sắm xử lý tiếp trên ĐTMS (GIẢ LẬP P-249). Sau khi gửi không sửa ở đây.',
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
    const tbl = p ? k.table([['', 50, 'c'], ['Mã vật tư', 140], ['Tên vật tư', 260], ['ĐVT', 70], ['Định mức / bộ', 110, 'r'], ['Nhu cầu', 110, 'r'], ['Tồn kho TCT', 120, 'r'], ['Đề xuất mua', 130, 'r'],
      ['Đơn giá dự toán (đồng)', 170, 'r'], ['Thành tiền (đồng)', 170, 'r'], ['Leadtime (tuần)', 120, 'r'], ['Export License', 120, 'c']], rows,
    (r) => `<td class="c"><input type="checkbox" data-sxm-on="${esc(r.code)}" ${r.on ? 'checked' : ''} aria-label="Chọn ${esc(r.code)}"></td><td>${esc(r.code)}</td><td>${k.clamp(r.name)}</td><td>${esc(r.unit)}</td>
      <td class="r num">${num(r.per)}</td><td class="r num">${num(r.per * p.qty)}</td><td class="r num">${num(stockOf(r.code))}</td>
      <td class="r"><input class="vctl num r" style="width:100px" inputmode="numeric" data-sxm-qty="${esc(r.code)}" value="${r.qty}" ${r.on ? '' : 'disabled'}></td>
      <td class="r num">${num(r.price)}</td><td class="r num">${r.on ? num(r.qty * r.price) : k.dash}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? 'Có' : 'Không'}</td>`) : '<p class="faint">Chọn dự án để lấy danh mục vật tư theo MBOM dự toán.</p>';
    return `<form class="pg" data-sxm-form="${x ? esc(x.code) : ''}">
      ${head({ title: x ? 'Chỉnh sửa đề xuất mua sắm' : 'Lập đề xuất mua sắm', back, lg: true, info,
    right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="button" class="vbtn secondary" data-sxm-save>Lưu nháp</button><button type="submit" class="vbtn primary">Gửi sang ĐTMS</button>` })}
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
      <section class="vcard pad24" data-sxm-lines><div class="vcard-h"><h3>Danh mục vật tư (MBOM dự toán)</h3><div class="row">
        ${U.stockAt ? `<span class="cap">Tồn kho cập nhật ${esc(U.stockAt)}</span>` : ''}${p ? '<button type="button" class="vbtn secondary" data-sxm-stock>Tra cứu tồn kho</button>' : ''}</div></div>
        ${err.lines ? `<div class="msg err-line">${esc(err.lines)}</div>` : ''}${tbl}
        ${p ? `<div class="sum-row"><b>Tổng giá trị dự toán: <span data-sxm-total>${num(total)}</span> đồng</b></div>` : ''}</section></form>`;
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
  /* Gửi sang ĐTMS (API-01): tạo ĐXMS thật trên ĐTMS rồi khoá đề xuất. */
  function send() {
    if (!validate(true)) { rerender(); return; }
    const code = store(), x = byCode(code), p = P().byCode(x.project), total = totalOf(x);
    const m = vModal({ title: 'Gửi đề xuất sang ĐTMS', size: 'sm', body: `<p>Gửi đề xuất <b>${esc(x.title)}</b> (dự toán ${num(total)} đồng) sang phần mềm ĐTMS để Trung tâm Mua sắm thẩm định, tổ chức lựa chọn nhà thầu?</p><p class="cap">Sau khi gửi, đề xuất không chỉnh sửa được ở phân hệ Sản xuất.</p>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-sxm-send-ok>Gửi</button>' });
    m.el.querySelector('[data-sxm-send-ok]').onclick = () => {
      const dx = Flow.createDxms({ title: x.title, nv: null, unit: 'Trung tâm Sản xuất', priority: 'Thường', est: Math.round(total / 1e6) / 1e3,
        period: `${dmy(p.start).slice(3)} – ${dmy(p.end).slice(3)}`, src: 'SX', sxProject: p.code, sxProposal: code });
      const own = U.props.find((y) => y.code === code);
      if (own) Object.assign(own, { sent: D.sxToday, dxms: dx }); else U.edit[code] = Object.assign(U.edit[code] || {}, { sent: D.sxToday, dxms: dx });
      persist();
      P().log(p.code, 'Gửi đề xuất mua sắm sang ĐTMS', `${code} → ${dx}`);
      m.close(); toast(`<b>Thành công</b><br>Đã gửi sang ĐTMS: ${esc(dx)}`);
      location.hash = '#/' + href({ code });
    };
  }

  /* ---------- SX-10 Chi tiết ---------- */
  function detail(code) {
    const k = K(), x = byCode(code);
    if (!x || !visible().some((y) => y.code === code)) return `<div class="pg">${head({ title: 'Xem chi tiết đề xuất mua sắm', back: 'sx/mua-sam', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy đề xuất mua sắm hoặc bạn không có quyền xem.')}</div>`;
    const p = P().byCode(x.project), lines = linesOf(x), c = chain(x);
    const info = {
      scr: 'SX-10', name: 'Chi tiết đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.3, §6',
      notes: ['Card <b>Tiến trình trên ĐTMS</b> đọc ngược từ ĐTMS: ĐXMS, KHLCNT, gói thầu (API-02), hợp đồng (API-03), phiếu nhập kho TCT (API-04, GIẢ LẬP). Mã ĐXMS mở thẳng màn ĐTMS (thật: liên kết sang phân hệ ĐTMS theo quyền người dùng).'],
      q: INFO_Q, src: 'task-create (mode detail)',
    };
    const right = !x.sent && (isAdmin() || x.creator === pid() || (p && p.pm === pid())) ? `<button type="button" class="vbtn primary" data-go="${href(x)}/edit">${icon('edit')} Chỉnh sửa</button>` : '';
    return `<div class="pg" data-sxm-detail="${esc(x.code)}">
      ${head({ title: 'Xem chi tiết đề xuất mua sắm', back: 'sx/mua-sam', lg: true, info, right })}
      ${k.card('Thông tin chung', `<div class="ginfo c3">${k.kv('Mã đề xuất', esc(x.code))}${k.kv('Tên đề xuất', esc(x.title), 'span2')}
        ${k.kv('Trạng thái', badge(...sentSt(x)))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}${k.kv('Đợt mua sắm', String(x.dot))}
        ${k.kv('Nguồn kinh phí', p ? esc(`${D.sxBasis[(p.basis || [])[0]] || ''} — ${(p.basis || [])[1] || ''}`) : null, 'span2')}${k.kv('Giá trị dự toán', `${num(totalOf(x))} đồng`)}
        ${k.kv('Người lập', esc(pName(x.creator)))}${k.kv('Ngày lập', esc(dmy(x.created)))}${k.kv('Ngày gửi ĐTMS', x.sent ? esc(dmy(x.sent)) : null)}
        ${k.kv('Ghi chú', x.note ? esc(x.note) : null, 'span3')}</div>`)}
      ${k.card('Danh mục vật tư', k.table([['Mã vật tư', 140], ['Tên vật tư', 300], ['ĐVT', 70], ['Đề xuất mua', 120, 'r'], ['Đơn giá dự toán (đồng)', 170, 'r'], ['Thành tiền (đồng)', 170, 'r'], ['Leadtime (tuần)', 120, 'r'], ['Export License', 120, 'c']], lines,
        (r) => `<td>${esc(r.code)}</td><td>${k.clamp(r.name)}</td><td>${esc(r.unit)}</td><td class="r num">${num(r.qty)}</td><td class="r num">${num(r.price)}</td><td class="r num">${num(r.qty * r.price)}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? 'Có' : 'Không'}</td>`))}
      <section class="vcard pad24" data-sxm-chain><div class="vcard-h"><h3>Tiến trình trên ĐTMS</h3>${c && !c.live ? '<span class="cap">Dữ liệu đồng bộ từ ĐTMS</span>' : ''}</div>${chainTable(x)}</section></div>`;
  }

  /* ---------- Tab Mua sắm & hợp đồng của dự án ---------- */
  function projectTab(p) {
    const k = K(), l = all().filter((x) => x.project === p.code);
    const can = p.status !== 'DONE' && (isAdmin() || p.pm === pid());
    const hd = l.flatMap((x) => { const c = chain(x); return c ? c.hd.map((h) => [x, h]) : []; });
    const kho = l.flatMap((x) => { const c = chain(x); return c ? c.kho.map((n) => [x, n]) : []; });
    return `<div data-sx-ms>
      <section class="vcard pad24"><div class="vcard-h"><h3>Đề xuất mua sắm</h3>${can ? `<button type="button" class="vbtn secondary" data-go="sx/mua-sam/create/${encodeURIComponent(p.code)}">${icon('add')} Lập đề xuất mua sắm</button>` : ''}</div>
        ${k.table([['Mã đề xuất', 140], ['Tên đề xuất', 320], ['Đợt', 70, 'c'], ['Giá trị dự toán (đồng)', 180, 'r'], ['Trạng thái', 140, 'c'], ['Mã ĐXMS', 150], ['Trạng thái trên ĐTMS', 170, 'c']], l,
    (x) => { const ds = dxmsSt(x), c = chain(x); return `<td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${k.clamp(x.title)}</td><td class="c">${x.dot}</td><td class="r num">${num(totalOf(x))}</td>
      <td class="c">${badge(...sentSt(x))}</td><td>${c ? esc(c.dxms[0]) : k.dash}</td><td class="c">${ds ? badge(...ds) : k.dash}</td>`; })}</section>
      ${k.card('Hợp đồng', k.table([['Mã hợp đồng', 150], ['Tên hợp đồng', 340], ['Nhà thầu', 260], ['Giá trị (đồng)', 170, 'r'], ['Trạng thái', 150, 'c']], hd,
    ([, h]) => `<td>${esc(h[0])}</td><td>${k.clamp(h[1])}</td><td>${h[4] ? k.clamp(h[4]) : k.dash}</td><td class="r num">${h[5] ? num(h[5]) : k.dash}</td><td class="c">${badge(h[2], h[3])}</td>`))}
      ${k.card('Nhập kho Tổng công ty', k.table([['Số phiếu', 150], ['Nội dung', 380], ['Ngày nhập', 130], ['Trạng thái', 150, 'c']], kho,
    ([, n]) => `<td>${esc(n[0])}</td><td>${k.clamp(n[1])}</td><td class="num">${esc(dmy(n[2]))}</td><td class="c">${badge(n[3], 'success')}</td>`))}</div>`;
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('submit', (e) => { if (e.target.closest && e.target.closest('[data-sxm-form]')) { e.preventDefault(); send(); } });
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    if (t.closest('[data-sxm-save]')) { saveDraft(); return; }
    if (t.closest('[data-sxm-stock]')) { keep(); U.stockAt = `${dmy(D.sxToday)} ${new Date().toTimeString().slice(0, 5)}`; persist(); toast('Đã cập nhật tồn kho khả dụng từ ERP Kho TCT.', 'success'); rerender(); }
  });
  document.addEventListener('change', (e) => {
    const on = e.target.closest && e.target.closest('[data-sxm-on]');
    if (on) { keep(); const r = F.v.rows.find((x) => x.code === on.dataset.sxmOn); if (r) r.on = on.checked; delete F.err.lines; rerender(); return; }
    const q = e.target.closest && e.target.closest('[data-sxm-qty]');
    if (q) { keep(); rerender(); }
  });

  function route(parts) {
    const [, a, b] = parts;
    if (a === 'create') return form(null);
    if (a && b === 'edit') return form(decodeURIComponent(a));
    if (a) return detail(decodeURIComponent(a));
    return list();
  }
  function enter(parts) {
    if (parts[0] !== 'mua-sam') return;
    if (parts[1] === 'create') resetForm(null, parts[2] ? decodeURIComponent(parts[2]) : null);
    else if (parts[2] === 'edit') resetForm(decodeURIComponent(parts[1]));
  }
  function reset() { U = blank(); persist(); }

  window.SxMs = { route, enter, reset, all, byCode, chain, projectTab, totalOf };
})();
