/* Phân hệ Quản lý sản xuất — Nhu cầu vật tư (T71 S10, D-124; SX-ULNL "Bước 4: Cung ứng vật tư › Nhu cầu vật tư", "Tích hợp với module Kho"). SX-17:
   mỗi dòng = một vật tư của một dự án: nhu cầu = định mức MBOM (VMMS) × số lượng dự án, tồn khả dụng ERP Kho TCT, còn thiếu, ngày cần, hạn đặt hàng = ngày cần − leadtime.
   Thêm mới / Sửa / Xem (hộp thoại eForm như catalog-form-dialog), Xoá (dòng chưa đề xuất), Tạo từ MBOM (thêm dòng còn thiếu của một dự án), Tra cứu tồn kho,
   chọn dòng cùng dự án → Lập đề xuất mua sắm (SX-10 chọn sẵn vật tư, số lượng = còn thiếu). Ngày cần mặc định = ngày bắt đầu giai đoạn Tổ chức sản xuất (GIẢ LẬP P-260).
   Route: #/sx/nhu-cau. Lưu localStorage sx-proto-nc. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;
  const B = () => window.EForms.b;
  const DAY = 86400000;
  const ms = (s) => Date.parse(String(s).slice(0, 10) + 'T00:00:00');
  const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';

  /* ---------- Dữ liệu ---------- */
  const KEY = 'sx-proto-nc';
  const blank = () => ({ rows: null, stockAt: null, sup: {} });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const mbomOf = (p) => (p && D.sxMbom[p.product]) || [];
  const needDateOf = (p) => iso(P().planOf(p)[2].s);
  const codeFor = (project, list) => { const pre = `NCVT-${project.slice(-3)}-`, n = Math.max(0, ...list.filter((r) => r.code.startsWith(pre)).map((r) => Number(r.code.slice(-2)))) + 1; return pre + String(n).padStart(2, '0'); };
  /* Dữ liệu mẫu: dự án đã chốt kế hoạch có MBOM — toàn bộ dòng MBOM. */
  function seed() {
    const out = [];
    D.sxProjects.filter((p) => p.baseline && D.sxMbom[p.product]).forEach((p0) => {
      const p = P().byCode(p0.code), need = needDateOf(p);
      /* T73: Danh mục = tổng số lượng; Nhu cầu = số lượng cần có trước từng ngày. Vật tư từ 10 đơn vị: tách 2 đợt (60% trước ngày cần, 40% trước ngày cần + 30 ngày). */
      mbomOf(p).forEach((m) => {
        const total = m.per * p.qty, q1 = total >= 10 ? Math.ceil(total * 0.6) : total, base = { project: p.code, mat: m.code, src: 'MBOM', creator: p.pm, created: p.baseline };
        out.push(Object.assign({ code: codeFor(p.code, out), qty: q1, need, note: q1 < total ? 'Đợt 1' : '' }, base));
        if (q1 < total) out.push(Object.assign({ code: codeFor(p.code, out), qty: total - q1, need: iso(ms(need) + 30 * DAY), note: 'Đợt 2' }, base));
      });
    });
    return out;
  }
  const rows = () => U.rows || seed();
  const save = (list) => { U.rows = list; persist(); };
  const matOf = (r) => { const p = P().byCode(r.project); return mbomOf(p).find((m) => m.code === r.mat) || { code: r.mat, name: r.mat, unit: '', lt: 0, price: 0 }; };
  const stockOf = (code) => D.sxStock[code] || 0;
  /* Đề xuất mua sắm của cùng dự án có vật tư này (mới nhất). */
  const propOf = (r) => window.SxMs.all().filter((x) => x.project === r.project && x.lines.some((l) => l[0] === r.mat)).sort((a, b) => (a.code < b.code ? 1 : -1))[0] || null;
  /* (b) Q7 — Bên mua sắm (QT-TTSX-4A11 §5.4 bước 4, ghi chú): VHT ký hợp đồng trực tiếp với nhà cung cấp → đề xuất mua sắm sang ĐTMS;
     mua qua đối tác trung gian (tổng thầu, gia công) → đối tác ký hợp đồng với nhà cung cấp, QLSX chỉ theo dõi tập kết. Mặc định theo mô hình tổ chức:
     VHT tự sản xuất → VHT mua; VMC tổng thầu / thuê gia công → đối tác mua, trừ vật tư leadtime dài (≥ 20 tuần) hoặc cần Export License → VHT mua trước. Sửa được ở Chỉnh sửa. */
  const BUYER = { VHT: 'VHT mua trực tiếp', DT: 'Đối tác mua' };
  const buyerOf = (r) => { if (r.buyer) return r.buyer; const p = P().byCode(r.project), m = matOf(r); return !p || p.model === 'VHT_TU_SX' || m.lt >= 20 || m.el ? 'VHT' : 'DT'; };
  /* Tập kết vật tư (QT bước 4 đầu ra: báo cáo tiến độ tập kết NVL, biên bản bàn giao / trả hàng với nhà cung cấp). VHT mua: thật đọc phiếu nhập kho (API-04); đối tác mua: PM / nhà máy cập nhật. GIẢ LẬP — nhập tay cả hai. */
  const supOf = (r) => U.sup[r.code] || { qty: 0, date: null, note: '', file: '', ret: 0 };
  function decorate(r, avail) {
    const m = matOf(r), short = Math.max(0, r.qty - avail), order = iso(ms(r.need) - (m.lt || 0) * 7 * DAY), prop = propOf(r), buyer = buyerOf(r);
    let st;
    if (prop) st = prop.sent ? ['Đã đề xuất', 'success'] : ['Đang đề xuất', 'info'];
    else if (buyer === 'DT') st = ['Đối tác mua', 'default'];
    else if (!short) st = ['Đủ tồn kho', 'default'];
    else if (order < D.sxToday) st = ['Trễ hạn đặt hàng', 'error'];
    else st = ['Chưa đề xuất', 'warning'];
    return Object.assign({}, r, { m, avail, short, order, prop, st, buyer, sup: supOf(r), free: !prop && short > 0 && buyer === 'VHT' });
  }
  const visibleProjects = () => P().visible();
  const all = () => { const ids = new Set(visibleProjects().map((p) => p.code)); const left = {};
    /* Tồn kho khả dụng trừ dần theo thứ tự ngày cần của cùng vật tư trong dự án. */
    return rows().filter((r) => ids.has(r.project)).sort((a, b) => (a.need < b.need ? -1 : a.need > b.need ? 1 : 0)).map((r) => { const k = `${r.project}|${r.mat}`; if (!(k in left)) left[k] = stockOf(r.mat); const a = left[k]; left[k] = Math.max(0, a - r.qty); return decorate(r, a); }); };
  const canManage = (project) => { const p = P().byCode(project); return !!p && p.status !== 'DONE' && (isAdmin() || p.pm === pid() || (p.khoi === 'K1' && D.roleOf(pid()) === 'R-SX-SUBPM')); };
  const canCreate = () => isAdmin() || ['R-SX-PM', 'R-SX-SUBPM'].includes(D.roleOf(pid()));
  const projOpts = () => visibleProjects().filter((p) => D.sxMbom[p.product] && canManage(p.code));

  /* ---------- SX-17 Danh sách ---------- */
  const SEL = new Set();
  function list() {
    // Theo: task-management (danh sách; cột chọn như bảng Rà soát tồn kho của ĐXMS); hộp thoại theo ecat catalog-form-dialog (ngoại lệ B6)
    const k = K();
    [...SEL].forEach((c) => { const r = all().find((x) => x.code === c); if (!r || !r.free) SEL.delete(c); });
    const info = {
      scr: 'SX-17', name: 'Danh sách nhu cầu vật tư', uc: 'SX-ULNL Bước 4 Cung ứng vật tư (Nhu cầu vật tư: Xem danh sách, Tìm kiếm, Thêm mới, Chỉnh sửa, Xem chi tiết, Xóa, Tích hợp với module Kho); SX-KS-K2 §2.1; SX-KS-K1 §3.1 bước 4',
      notes: [
        'Mỗi dòng = một vật tư của một dự án. <b>Nhu cầu</b> = định mức MBOM (đồng bộ VMMS) × số lượng dự án; <b>Tồn kho TCT</b> = tồn khả dụng ERP Kho Tổng công ty (Tra cứu tồn kho gọi API Kho — GIẢ LẬP); <b>Còn thiếu</b> = nhu cầu − tồn.',
        '<b>Ngày cần</b> mặc định = ngày bắt đầu giai đoạn Tổ chức sản xuất của kế hoạch (sửa được); <b>Hạn đặt hàng</b> = ngày cần − leadtime. Trạng thái: Đã / Đang đề xuất (có trong đề xuất mua sắm của dự án), Đủ tồn kho, Trễ hạn đặt hàng (chưa đề xuất, đã qua hạn đặt hàng), Chưa đề xuất (GIẢ LẬP P-260).',
        '<b>Tạo từ MBOM</b>: thêm các vật tư MBOM chưa có dòng của một dự án. Chọn dòng còn thiếu (cùng dự án) → <b>Lập đề xuất mua sắm</b>: mở màn lập đề xuất chọn sẵn các vật tư đó, số lượng = còn thiếu.',
        '<b>Nhập Excel</b> (T71 S12): file mẫu (Dự án, Mã vật tư, Số lượng, Ngày cần), kiểm lỗi từng dòng — vật tư phải thuộc MBOM của dự án, chưa có dòng nhu cầu, người nhập quản lý dự án; chỉ ghi khi Xác nhận nhập. <b>Xuất Excel</b> đúng các cột đang hiện, mọi dòng thỏa bộ lọc.',
        'Thêm mới / Sửa / Xem bằng hộp thoại (như danh mục). Xoá chỉ dòng chưa đưa vào đề xuất. Người quản lý: PM của dự án, Sub PM (Khối 1).',
        '<b>Bên mua sắm</b> (QT-TTSX-4A11 bước 4): VHT mua trực tiếp → lập đề xuất sang ĐTMS; Đối tác mua (tổng thầu, gia công ký hợp đồng với nhà cung cấp) → không lập đề xuất, theo dõi tập kết ở tab Mua sắm & hợp đồng của dự án. Mặc định theo mô hình tổ chức; vật tư leadtime dài / Export License mặc định VHT mua trước.',
      ],
      q: ['P-260', 'P-248', 'P-262'], src: 'task-management/task-management.component · /task-management; ecat catalog-form-dialog',
    };
    const ST = ['Chưa đề xuất', 'Trễ hạn đặt hàng', 'Đang đề xuất', 'Đã đề xuất', 'Đủ tồn kho'];
    const right = `<button type="button" class="vbtn secondary" data-sxnc-stock>Tra cứu tồn kho</button>`
      + (canCreate() ? `<button type="button" class="vbtn secondary" data-sxnc-import>${icon('upload')} Nhập Excel</button><button type="button" class="vbtn secondary" data-sxnc-mbom>Tạo từ MBOM</button><button type="button" class="vbtn secondary" data-sxnc-prop ${SEL.size ? '' : 'disabled'}>Lập đề xuất mua sắm${SEL.size ? ` (${SEL.size})` : ''}</button><button class="vbtn primary" data-sxnc-add>${icon('add')} Thêm mới</button>` : '');
    const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" ${attrs}>${icon(ic)}</button>`;
    /* Khối 1 — Danh mục vật tư: tổng số lượng theo MBOM dự toán (VMMS, chỉ xem) × số lượng dự án. Khối 2 — Nhu cầu vật tư: số lượng cần có trước ngày cần (bảng bên dưới). */
    const catRows = visibleProjects().filter((p) => D.sxMbom[p.product]).flatMap((p0) => { const p = P().byCode(p0.code); return mbomOf(p).map((m) => Object.assign({ project: p.code, total: m.per * p.qty }, m)); });
    const catalog = `<section class="vcard pad24" data-sxnc-cat><div class="vcard-h"><h3>Danh mục vật tư</h3><span class="cap">Tổng số lượng theo MBOM dự toán (VMMS, chỉ xem) × số lượng dự án</span></div>
      ${k.table([['Dự án', 140], ['Mã vật tư', 150], ['Tên vật tư', 260], ['ĐVT', 70], ['Định mức / bộ', 110, 'r'], ['Tổng số lượng', 120, 'r'], ['Tồn kho TCT', 120, 'r'], ['Đơn giá dự toán (đồng)', 160, 'r'], ['Leadtime (tuần)', 120, 'r'], ['Export License', 120, 'c']], catRows,
      (m) => `<td>${esc(m.project)}</td><td>${esc(m.code)}</td><td>${k.clamp(m.name)}</td><td>${esc(m.unit)}</td><td class="r num">${num(m.per)}</td><td class="r num">${num(m.total)}</td><td class="r num">${num(stockOf(m.code))}</td><td class="r num">${num(m.price)}</td><td class="r num">${m.lt}</td><td class="c">${m.el ? 'Có' : 'Không'}</td>`)}</section>`;
    return k.listPage({
      id: 'sxnc', exp: 'Danh sach nhu cau vat tu', title: 'Nhu cầu vật tư', ph: 'Tìm kiếm theo mã đề xuất, vật tư, dự án', info, right,
      top: (U.stockAt ? `<p class="cap" data-sxnc-at style="margin:-8px 0 12px">Tồn kho TCT cập nhật lúc ${esc(U.stockAt)}</p>` : '') + catalog + '<h3 style="margin:20px 0 8px">Nhu cầu vật tư <span class="cap">— số lượng cần có trước ngày cần để đảm bảo sản xuất</span></h3>',
      rows: () => all().sort((a, b) => (a.project === b.project ? (a.order < b.order ? -1 : 1) : a.project < b.project ? -1 : 1)),
      kwText: (r) => `${r.code} ${r.prop ? r.prop.code : ''} ${r.mat} ${r.m.name} ${r.project}`,
      empty: () => ({ project: null, mat: '', st: [], lt: null }),
      match: (r, f) => (!f.project || r.project === f.project) && (k.has(f.mat, r.mat) || k.has(f.mat, r.m.name)) && k.inSet(f.st, r.st[0]) && (!f.lt || (f.lt === 'DAI') === (r.m.lt >= 16)),
      adv: (txt, sel) => `${sel('project', 'Dự án', { options: visibleProjects().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}${txt('mat', 'Vật tư')}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ST.map((x) => ({ value: x, label: x })) })}
        ${sel('lt', 'Leadtime', { searchable: false, options: [{ value: 'DAI', label: 'Dài (từ 16 tuần)' }, { value: 'NGAN', label: 'Dưới 16 tuần' }] })}`,
      cols: [['', 48, 'c'], ['Thao tác', 100, 'c'], ['Trạng thái', 170, 'c'], ['Mã đề xuất', 140], ['Dự án', 140], ['Mã vật tư', 150], ['Tên vật tư', 260], ['Bên mua sắm', 150], ['ĐVT', 70], ['Số lượng cần', 110, 'r'],
        ['Tồn kho TCT', 120, 'r'], ['Còn thiếu', 110, 'r'], ['Cần trước ngày', 130], ['Leadtime (tuần)', 120, 'r'], ['Hạn đặt hàng', 130]],
      href: () => 'sx/nhu-cau',
      cell: (r) => `<td class="c">${r.free && canManage(r.project) ? `<input type="checkbox" data-sxnc-sel="${esc(r.code)}" ${SEL.has(r.code) ? 'checked' : ''} aria-label="Chọn ${esc(r.code)}">` : ''}</td>
        <td class="c"><div class="acts">${canManage(r.project) ? iconBtn('edit', 'Sửa', `data-sxnc-edit="${esc(r.code)}"`) : ''}${canManage(r.project) && !r.prop ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-sxnc-del="${esc(r.code)}"`)}` : ''}</div></td>
        <td class="c">${badge(...r.st)}</td><td>${r.prop ? `<a class="link" data-go="sx/mua-sam/${encodeURIComponent(r.prop.code)}">${esc(r.prop.code)}</a>` : k.dash}</td><td>${esc(r.project)}</td><td><a class="link" data-sxnc-view="${esc(r.code)}">${esc(r.mat)}</a></td><td>${k.clamp(r.m.name)}</td><td>${esc(BUYER[r.buyer])}</td><td>${esc(r.m.unit)}</td>
        <td class="r num">${num(r.qty)}</td><td class="r num">${num(r.avail)}</td><td class="r num">${r.short ? num(r.short) : k.dash}</td><td class="num">${esc(dmy(r.need))}</td>
        <td class="r num">${r.m.lt}</td><td class="num${r.st[0] === 'Trễ hạn đặt hàng' ? ' due-over' : ''}">${esc(dmy(r.order))}</td>`,
    });
  }

  /* ---------- Hộp thoại (eForm) ---------- */
  async function view(code) {
    const r = all().find((x) => x.code === code);
    if (!r) return;
    const { txt } = B();
    await window.EFormRun.open({ title: 'Xem chi tiết nhu cầu vật tư', readOnly: true, schema: { id: 'sx-nc-view', components: [
      txt(`**${r.code}** — ${r.m.name} (${r.mat})\nDự án ${r.project} · ${r.st[0]}`),
      txt(`Nhu cầu **${num(r.qty)} ${r.m.unit}** · Tồn kho TCT ${num(stockOf(r.mat))} · Còn thiếu ${num(r.short)}\nNgày cần ${dmy(r.need)} · Leadtime ${r.m.lt} tuần · Hạn đặt hàng ${dmy(r.order)}`),
      txt(`Đề xuất mua sắm: ${r.prop ? r.prop.code : '-'} · Nguồn: ${r.src === 'MBOM' ? 'Tạo từ MBOM' : 'Nhập tay'}${r.note ? `\nGhi chú: ${r.note}` : ''}`)] }, values: {} });
  }
  async function edit(code) {
    const list = rows(), r = list.find((x) => x.code === code);
    if (!r) return;
    const m = matOf(r), { txt, num: n, dt, ta, req, sel, opts } = B(), L = (k) => ({ layout: { columns: k } });
    const locked = !!propOf(r);
    const res = await window.EFormRun.open({ title: 'Chỉnh sửa nhu cầu vật tư', schema: { id: 'sx-nc-edit', components: [
      txt(`**${r.code}** — ${m.name} (${r.mat}) · Dự án ${r.project}`),
      n('ncQty', `Số lượng nhu cầu (${m.unit})`, req(Object.assign(L(8), { validate: { required: true, min: 1 } }))), dt('ncNeed', 'Ngày cần', req(L(8))),
      locked ? txt(`Bên mua sắm: **${BUYER[buyerOf(r)]}** (đã đưa vào đề xuất mua sắm)`) : sel('ncBuyer', 'Bên mua sắm', req(Object.assign(L(8), { values: opts(Object.entries(BUYER)) }))),
      ta('ncNote', 'Ghi chú', { rows: 2 })] },
    values: { ncQty: r.qty, ncNeed: dmy(r.need), ncNote: r.note || '', ncBuyer: buyerOf(r) },
    check: (v) => (!fromDmy(v.ncNeed) ? 'Ngày cần phải đúng định dạng DD/MM/YYYY.' : null) });
    if (!res || !res.submit) return;
    Object.assign(r, { qty: Number(res.values.ncQty), need: fromDmy(res.values.ncNeed), note: (res.values.ncNote || '').trim() }, locked ? {} : { buyer: res.values.ncBuyer });
    save(list);
    toast('<b>Thành công</b><br>Cập nhật thành công!');
    rerender();
  }
  async function add() {
    const list = rows();
    const opts = projOpts().flatMap((p) => mbomOf(p).map((m) => [`${p.code}|${m.code}`, `${p.code} · ${m.code} — ${m.name}`]));
    if (!opts.length) { toast('Mọi vật tư trong MBOM của các dự án bạn quản lý đã có dòng nhu cầu.', 'warn'); return; }
    const { sel, num: n, dt, ta, req, opts: o } = B(), L = (k) => ({ layout: { columns: k } });
    const res = await window.EFormRun.open({ title: 'Thêm mới nhu cầu vật tư', schema: { id: 'sx-nc-add', components: [
      sel('ncMat', 'Dự án · vật tư (theo MBOM dự toán)', req({ searchable: true, values: o(opts) })),
      n('ncQty', 'Số lượng nhu cầu', req(Object.assign(L(8), { validate: { required: true, min: 1 } }))), dt('ncNeed', 'Ngày cần', req(L(8))), ta('ncNote', 'Ghi chú', { rows: 2 })] },
    values: { ncMat: null, ncQty: null, ncNeed: '', ncNote: '' },
    check: (v) => (!fromDmy(v.ncNeed) ? 'Ngày cần phải đúng định dạng DD/MM/YYYY.' : null) });
    if (!res || !res.submit) return;
    const [project, mat] = res.values.ncMat.split('|');
    const code = codeFor(project, list);
    list.push({ code, project, mat, qty: Number(res.values.ncQty), need: fromDmy(res.values.ncNeed), note: (res.values.ncNote || '').trim(), src: 'TAY', creator: pid(), created: D.sxToday });
    save(list);
    P().log(project, 'Thêm nhu cầu vật tư', `${code}: ${mat}`);
    toast('<b>Thành công</b><br>Thêm mới thành công!');
    rerender();
  }
  async function fromMbom() {
    const ps = projOpts();
    if (!ps.length) { toast('Bạn chưa quản lý dự án nào có MBOM dự toán.', 'warn'); return; }
    const { sel, txt, req, opts: o } = B();
    const res = await window.EFormRun.open({ title: 'Tạo nhu cầu từ MBOM', schema: { id: 'sx-nc-mbom', components: [
      txt('Thêm các vật tư trong MBOM dự toán (đồng bộ VMMS) chưa có dòng nhu cầu của dự án: số lượng = định mức × số lượng dự án, ngày cần = ngày bắt đầu giai đoạn Tổ chức sản xuất.'),
      sel('ncProject', 'Dự án sản xuất', req({ searchable: true, values: o(ps.map((p) => [p.code, `${p.code} — ${p.name}`])) }))] }, values: { ncProject: null } });
    if (!res || !res.submit) return;
    const list = rows(), p = P().byCode(res.values.ncProject), need = needDateOf(p);
    let n = 0;
    mbomOf(p).forEach((m) => { if (!list.some((r) => r.project === p.code && r.mat === m.code)) { list.push({ code: codeFor(p.code, list), project: p.code, mat: m.code, qty: m.per * p.qty, need, note: '', src: 'MBOM', creator: pid(), created: D.sxToday }); n += 1; } });
    if (!n) { toast(`Dự án ${p.code} đã có đủ dòng nhu cầu theo MBOM.`, 'warn'); return; }
    save(list);
    P().log(p.code, 'Tạo nhu cầu vật tư từ MBOM', `${n} vật tư`);
    toast(`<b>Thành công</b><br>Đã tạo ${n} dòng nhu cầu từ MBOM.`);
    rerender();
  }
  function toProposal() {
    const l = all().filter((r) => SEL.has(r.code));
    if (!l.length) return;
    const ps = [...new Set(l.map((r) => r.project))];
    if (ps.length > 1) { toast('Chọn vật tư của cùng một dự án để lập một đề xuất mua sắm.', 'warn'); return; }
    window.SxMs.preset(ps[0], Object.fromEntries(l.map((r) => [r.mat, r.short])), `Lập từ nhu cầu vật tư: ${l.map((r) => r.code).join(', ')}.`);
    SEL.clear();
    location.hash = '#/sx/mua-sam/create/' + encodeURIComponent(ps[0]);
  }

  /* ---------- Sự kiện (pha capture: nút trong dòng có data-go) ---------- */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-sxnc-sel],[data-sxnc-edit],[data-sxnc-del],[data-sxnc-view]');
    if (!t) return;
    e.stopPropagation();
    if (t.dataset.sxncSel) { if (t.checked) SEL.add(t.dataset.sxncSel); else SEL.delete(t.dataset.sxncSel); rerender(); return; }
    e.preventDefault();
    if (t.dataset.sxncEdit) { edit(t.dataset.sxncEdit); return; }
    if (t.dataset.sxncView) { view(t.dataset.sxncView); return; }
    const r = all().find((x) => x.code === t.dataset.sxncDel);
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa nhu cầu vật tư: ${r.code} — ${r.m.name} không?`, hl: `${r.code} — ${r.m.name}`, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    save(rows().filter((x) => x.code !== r.code));
    toast('<b>Thành công</b><br>Xoá nhu cầu vật tư thành công');
    rerender();
  }, true);
  /* Bấm vào dòng (ngoài nút / liên kết): xem chi tiết. */
  document.addEventListener('click', (e) => {
    const tr = e.target.closest && e.target.closest('tr.click[data-go="sx/nhu-cau"]');
    if (!tr || e.target.closest('a,button,input')) return;
    e.stopPropagation(); e.preventDefault();
    const c = tr.querySelector('[data-sxnc-view]');
    if (c) view(c.dataset.sxncView);
  }, true);
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sxnc-add],[data-sxnc-mbom],[data-sxnc-prop],[data-sxnc-stock]');
    if (!t) return;
    if (t.dataset.sxncAdd !== undefined) add();
    else if (t.dataset.sxncMbom !== undefined) fromMbom();
    else if (t.dataset.sxncProp !== undefined) toProposal();
    else { U.stockAt = `${dmy(D.sxToday)} ${new Date().toTimeString().slice(0, 5)}`; persist(); toast('Đã cập nhật tồn kho khả dụng từ ERP Kho TCT.', 'success'); rerender(); }
  });

  /* ---------- T71 S12: Nhập Excel ----------
     File giả lập 5 dòng: dòng 3 vật tư không thuộc MBOM của dự án, dòng 4 vật tư đã có dòng nhu cầu, dòng 5 dự án không tồn tại. */
  const IMP = [['DA-SX-2026-004', 'FPGA-ZU47DR', 6000, '2027-01-11'], ['DA-SX-2026-004', 'PA-GAN-80W', 12000, '2027-01-11'], ['DA-SX-2026-004', 'FPGA-XC7K325', 10, '2027-01-11'],
    ['DA-SX-2026-003', 'SOC-MT7981', 120000, '2026-06-01'], ['DA-SX-2026-009', 'SOC-ONT-X2', 5000, '2027-02-01']];
  function importDlg() {
    window.SxChung.importDlg({ entity: 'nhu cầu vật tư', tpl: 'mau-nhap-nhu-cau-vat-tu.xlsx', file: 'nhu-cau-vat-tu.xlsx', unit: 'dòng nhu cầu',
      cols: [['Dự án', 140], ['Mã vật tư', 150], ['Tên vật tư', 240], ['Số lượng', 110], ['Ngày cần', 120]],
      rows: () => IMP.map(([project, mat, qty, need]) => {
        const errs = [], p = P().byCode(project), m = p ? mbomOf(p).find((x) => x.code === mat) : null;
        if (!p) errs.push(`Dự án ${project} không tồn tại.`);
        else if (!canManage(project)) errs.push(`Bạn không quản lý dự án ${project}.`);
        else if (!m) errs.push(`Vật tư ${mat} không thuộc MBOM của sản phẩm ${p.product}.`);
        return { errs, data: { project, mat, qty, need }, cells: [project, mat, m ? m.name : '', num(qty), dmy(need)] };
      }),
      commit: (ok) => {
        const list = rows().slice();
        ok.forEach((r) => list.push(Object.assign({ code: codeFor(r.data.project, list), note: '', src: 'XLS', creator: pid(), created: D.sxToday }, r.data)));
        save(list);
        return ok.length;
      } });
  }
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('[data-sxnc-import]')) importDlg(); });

  function route() { return list(); }
  function reset() { U = blank(); persist(); SEL.clear(); }
  /* ---------- Tab Mua sắm & hợp đồng của dự án: tiến độ tập kết vật tư (QT bước 4 đầu ra) ---------- */
  function supplyCard(p) {
    const k = K(), l = all().filter((r) => r.project === p.code), can = canManage(p.code);
    const stS = (r) => { const q = r.sup.qty - r.sup.ret; return q >= r.qty ? ['Đã tập kết đủ', 'success'] : q > 0 ? ['Đang tập kết', 'info'] : r.need < D.sxToday ? ['Chậm tập kết', 'error'] : ['Chưa về', 'default']; };
    const done = l.filter((r) => r.sup.qty - r.sup.ret >= r.qty).length;
    return `<section class="vcard pad24" data-sxnc-sup><div class="vcard-h"><h3>Tiến độ tập kết vật tư</h3><span class="cap">${done} / ${l.length} vật tư đã tập kết đủ</span></div>
      ${k.table([['Mã vật tư', 150], ['Tên vật tư', 260], ['Bên mua sắm', 150], ['Nhu cầu', 110, 'r'], ['Đã về', 110, 'r'], ['Trả hàng', 100, 'r'], ['Ngày cần', 120], ['Ngày về gần nhất', 140], ['Biên bản bàn giao / trả hàng', 240], ['Trạng thái', 150, 'c']].concat(can ? [['', 110, 'c']] : []), l,
    (r) => `<td>${esc(r.mat)}</td><td>${k.clamp(r.m.name)}</td><td>${esc(BUYER[r.buyer])}</td><td class="r num">${num(r.qty)}</td><td class="r num">${num(r.sup.qty)}</td><td class="r num">${r.sup.ret ? num(r.sup.ret) : k.dash}</td>
      <td class="num">${esc(dmy(r.need))}</td><td class="num">${r.sup.date ? esc(dmy(r.sup.date)) : k.dash}</td><td>${r.sup.file ? k.clamp(r.sup.file) : k.dash}</td><td class="c">${badge(...stS(r))}</td>
      ${can ? `<td class="c"><button type="button" class="vbtn sm secondary" data-sxnc-sup-up="${esc(r.code)}">Cập nhật</button></td>` : ''}`)}</section>`;
  }
  async function supDlg(code) {
    const r = all().find((x) => x.code === code);
    if (!r) return;
    const { txt, num: n, dt, ta, file, req } = B(), L = (k) => ({ layout: { columns: k } }), s = r.sup;
    const res = await window.EFormRun.open({ title: 'Cập nhật tập kết vật tư', schema: { id: 'sx-nc-sup', components: [
      txt(`**${r.mat}** — ${r.m.name} · Dự án ${r.project} · ${BUYER[r.buyer]}\nNhu cầu ${num(r.qty)} ${r.m.unit}`),
      n('supQty', `Số lượng đã về (${r.m.unit})`, req(Object.assign(L(8), { validate: { required: true, min: 0 } }))), n('supRet', 'Số lượng trả hàng (không đạt IQC)', L(8)),
      dt('supDate', 'Ngày về', req(L(8))), file('supFile', 'Biên bản bàn giao hàng hóa với nhà cung cấp / biên bản trả hàng', L(16)),
      ta('supNote', 'Ghi chú; không phù hợp thì ghi nguyên nhân, biện pháp khắc phục', { rows: 2 })] },
    values: { supQty: s.qty, supRet: s.ret || 0, supDate: s.date ? dmy(s.date) : dmy(D.sxToday), supFile: s.file || '', supNote: s.note || '' },
    check: (v) => (!fromDmy(v.supDate) ? 'Ngày về phải đúng định dạng DD/MM/YYYY.' : null) });
    if (!res || !res.submit) return;
    const v = res.values;
    U.sup[code] = { qty: Number(v.supQty || 0), ret: Number(v.supRet || 0), date: fromDmy(v.supDate), file: v.supFile || '', note: (v.supNote || '').trim() };
    persist();
    if (v.supFile && v.supFile !== s.file) P().addDoc(r.project, [v.supFile, 'NCC', 'v1.0', pid(), D.sxToday]);
    P().log(r.project, 'Cập nhật tập kết vật tư', `${r.mat}: đã về ${num(v.supQty)}${Number(v.supRet) ? `, trả ${num(v.supRet)}` : ''} / ${num(r.qty)}`);
    toast('<b>Thành công</b><br>Cập nhật thành công!'); rerender();
  }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-sxnc-sup-up]'); if (b) supDlg(b.dataset.sxncSupUp); });
  window.SxNc = { route, reset, all, supplyCard, buyerOf };
})();
