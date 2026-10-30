/*
 * eForm của các user task MS22 Thương thảo và ký hợp đồng (T25 B1, plan §5 K1). Theo DG-MS22 §C, §E. Hồ sơ con của hợp đồng (D-47): dữ liệu đọc từ hợp đồng cha
 * (hop-dong.js), kết quả AI bước 5 đọc từ biến quy trình (S5). Tài liệu nằm ở Danh sách tài liệu (loại 4), không đặt trong form.
 * Ngoài eForm: EForms.hd = biến, kiểm tra, văn bản đầu ra, tài liệu của hồ sơ con — vars.js và screens.js gọi khi Flow.state.parent có giá trị.
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, ta, tf, num, sel, chk, req, dl, opts, aiBox, dt } = B;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const hd = () => window.HopDong.find(Flow.state.parent) || {};
  const warranty = () => { const u = Flow.ui, v = Flow.state.vars; return u.hdWarranty != null ? u.hdWarranty : v.hdFixed ? D.hdWarrantyMin : 18; };
  const version = () => 1 + Flow.doneCount(6) + Flow.doneCount(7);
  /* Giả lập P-119: danh sách mẫu tự đặt. */
  const MAU = opts(['Mẫu hợp đồng mua sắm thiết bị — một lô', 'Mẫu hợp đồng mua sắm thiết bị — nhiều lô', 'Mẫu hợp đồng dịch vụ']);

  const head = () => txt('**{{hd.code}}** — {{hd.ten}} · nhà thầu {{hd.ncc}} · giá trị **{{hd.gia}} tỷ đồng** (gồm thuế GTGT)');
  const aiResult = () => aiBox('kết quả kiểm tra trước phê duyệt', '{{ai.tomTat}}');
  const issues = () => tbl('Cảnh báo cần xử lý', 'ai.issues', [['noiDung', 'Nội dung']], '=count(ai.issues) = 0');

  const F = {
    1: { id: 'dtms-ms22-t01-tiep-nhan',
      schema: () => ({ components: [head(),
        txt('Gói thầu **{{hd.goi}}** · Quyết định phê duyệt KQLCNT **{{hd.kq}}** · loại hợp đồng {{hd.loai}} · thời gian thực hiện {{hd.thoiGian}}'),
        tbl('Hạng mục theo kết quả thầu', 'items', [['ten', 'Hàng hoá / dịch vụ'], ['dvt', 'Đơn vị tính'], ['sl', 'Số lượng'], ['gia', 'Đơn giá (tỷ đồng)']]),
        chk('hdDuHoSo', 'Xác nhận', req({ text: 'Đã nhận đủ đề xuất mua sắm, kết quả thầu và hồ sơ thầu do phòng thầu bàn giao' }))] }),
      notes: () => ['Thông tin lấy từ KQLCNT của gói thầu, chỉ xem (Backlog 426). Hoàn thành → cổng song song: bước 2 giao Đơn vị sử dụng, bước 3 giao Phòng Hợp đồng.'],
      write: (v) => pick(v, ['hdDuHoSo']) },
    2: { id: 'dtms-ms22-t02-phu-luc-ky-thuat', q: ['P-133'], outputs: () => ['HD-PLKT'],
      schema: () => ({ components: [head(),
        dl('hdRows', 'Danh mục hàng hoá', [txt('**{{this.ten}}**\n{{this.sl}} {{this.dvt}}', 8), tf('maHang', 'Mã hàng', { layout: { columns: 8 } })]),
        ta('hdYeuCau', 'Yêu cầu kỹ thuật, thông số sản phẩm', req()),
        ta('hdNghiemThu', 'Tiêu chuẩn nghiệm thu', req()),
        ta('hdSla', 'SLA'),
        tf('hdTienDo', 'Tiến độ bàn giao', req())] }),
      notes: () => ['<b>Giả lập P-133</b>: Đơn vị sử dụng nhập mã hàng theo từng hạng mục; nguồn mã chưa chốt. Hạng mục để trống mã hàng thì AI bước 5 cảnh báo, hồ sơ về bước 7.'],
      write: (v) => Object.assign(pick(v, ['hdRows', 'hdYeuCau', 'hdNghiemThu', 'hdSla', 'hdTienDo']), { hdMissingCode: (v.hdRows || []).some((r) => !r.maHang) }) },
    3: { id: 'dtms-ms22-t03-body-phu-luc-gia', q: ['P-119', 'P-126'], outputs: () => ['HD-BODY', 'HD-PL1'],
      schema: () => ({ components: [head(),
        sel('hdMau', 'Mẫu dự thảo hợp đồng', req({ values: MAU })),
        tbl('Phụ lục 1 — Giá, danh mục hàng hoá', 'items', [['ten', 'Hàng hoá / dịch vụ'], ['dvt', 'Đơn vị tính'], ['sl', 'Số lượng'], ['gia', 'Đơn giá (tỷ đồng)'], ['tien', 'Thành tiền (tỷ đồng)']]),
        ta('hdGhiChuBody', 'Ghi chú body hợp đồng')] }),
      notes: () => ['<b>Giả lập P-119</b>: chọn mẫu tay từ danh sách, không dùng ngưỡng giá trị (DG-MS22 §D 2: 45 tỷ chỉ là ví dụ). <b>Giả lập P-126</b>: mã văn bản tạm.'],
      write: (v) => pick(v, ['hdMau', 'hdGhiChuBody']) },
    4: { id: 'dtms-ms22-t04-thuong-thao', outputs: () => ['HD-DT'],
      schema: () => ({ components: [head(),
        txt('Gửi dự thảo và phụ lục cho nhà thầu qua email, thương thảo rồi ghi lại kết quả.'),
        ta('hdThongNhat', 'Nội dung đã thống nhất', req()),
        num('hdBaoHanh', 'Bảo hành lò hàn đối lưu theo kết quả thương thảo (tháng)', req({ validate: { required: true, min: 1, max: 120 } })),
        txt('HSMT yêu cầu tối thiểu **{{baoHanhMin}} tháng**.')] }),
      notes: () => ['Biên bản thương thảo ký, đóng dấu tải lên ở Danh sách tài liệu (bắt buộc). Hoàn thành → service task 5: AI đối chiếu dự thảo với HSMT.'],
      write: (v) => Object.assign(pick(v, ['hdThongNhat']), { hdWarranty: Number(v.hdBaoHanh) }) },
    6: { id: 'dtms-ms22-t06-lam-viec-lai', q: ['P-127', 'P-128'], outputs: () => ['HD-DT'],
      schema: () => ({ components: [head(), aiResult(), issues(),
        ta('hdThongNhatLai', 'Nội dung đã thống nhất lại qua email', req()),
        num('hdBaoHanh', 'Bảo hành lò hàn đối lưu sau khi thống nhất lại (tháng)', req({ validate: { required: true, min: 1, max: 120 } }))] }),
      notes: () => ['Vào bước này khi AI cảnh báo về điều khoản đã thương thảo, hoặc Trưởng phòng trả về và cần thống nhất lại với nhà thầu. Hoàn thành → AI kiểm tra lại (bước 5).'],
      write: (v) => Object.assign(pick(v, ['hdThongNhatLai']), { hdWarranty: Number(v.hdBaoHanh) }) },
    7: { id: 'dtms-ms22-t07-chinh-sua', q: ['P-127', 'P-128'], outputs: () => ['HD-DT'],
      schema: () => ({ components: [head(), aiResult(), issues(),
        dl('hdRows', 'Danh mục hàng hoá', [txt('**{{this.ten}}**\n{{this.sl}} {{this.dvt}}', 8), tf('maHang', 'Mã hàng', { layout: { columns: 8 } })]),
        ta('hdNoiDungSua', 'Nội dung đã chỉnh sửa', req())] }),
      notes: () => ['Sửa nội bộ, không cần thống nhất lại với nhà thầu. Hoàn thành → AI kiểm tra lại (bước 5).'],
      write: (v) => Object.assign(pick(v, ['hdRows', 'hdNoiDungSua']), { hdMissingCode: (v.hdRows || []).some((r) => !r.maHang) }) },
    8: { id: 'dtms-ms22-t08-phe-duyet', q: ['P-127'],
      schema: () => ({ components: [head(), aiResult(),
        tbl('Đối chiếu dự thảo hợp đồng', 'doiChieu', [['canCu', 'Căn cứ'], ['noiDung', 'Nội dung đối chiếu'], ['ketQua', 'Kết quả']]),
        ta('hdYKienTp', 'Ý kiến của Trưởng phòng')] }),
      notes: () => ['Nút Trả chỉnh sửa mở dialog nhận xét. BPMN: Không phê duyệt → cổng "Có cần thống nhất lại với nhà thầu?" → bước 6 hoặc 7; prototype để Trưởng phòng chọn bằng nút (GIẢ LẬP P-128).'],
      write: (v) => pick(v, ['hdYKienTp']) },
    9: { id: 'dtms-ms22-t09-trinh-ky', q: ['P-134'],
      schema: () => ({ components: [head(),
        banner('{{hd.tamDung}}', '=not(hd.dangTamDung)'),
        tf('hdVanBanKienNghi', 'Số văn bản giải quyết kiến nghị', req({ conditional: { hide: '=not(hd.dangTamDung)' } })),
        chk('hdNhayTtms', 'Chữ ký nháy', req({ text: 'Trung tâm Mua sắm đã ký nháy' })),
        chk('hdNhayDvsd', 'Chữ ký nháy', req({ text: 'Đơn vị sử dụng đã ký nháy' }))] }),
      notes: () => ['Theo DG-MS22 bước 9: chỉ Trung tâm Mua sắm và Đơn vị sử dụng ký nháy; BPMN không có lane riêng nên Phòng Hợp đồng ghi nhận. Bộ hợp đồng có ký nháy tải lên ở Danh sách tài liệu (bắt buộc).',
        '<b>Giả lập P-134</b>: HĐ-2026-0052 đang tạm dừng ký do kiến nghị KQLCNT (Điều 38). BPMN không thể hiện; prototype bắt buộc nhập số văn bản giải quyết kiến nghị trước khi trình ký, xong bước này cảnh báo trên Chi tiết hợp đồng tắt.'],
      write: (v) => pick(v, ['hdVanBanKienNghi', 'hdNhayTtms', 'hdNhayDvsd']) },
    10: { id: 'dtms-ms22-t10-ky-hop-dong', q: ['P-130', 'P-131'],
      schema: () => ({ components: [head(), aiResult(), ta('hdYKienThamDinh', 'Ý kiến thẩm định (pháp chế, tài chính, đầu tư — nếu có)')] }),
      notes: () => ['<b>Giả lập P-130</b>: chưa tách bước lấy ý kiến thẩm định. <b>Giả lập P-131</b>: kênh trình ký dùng hộp thoại Trình ký chung. <b>Giả lập P-129</b>: Không đồng ý về bước 9 theo mũi tên BPMN.'],
      write: (v) => pick(v, ['hdYKienThamDinh']) },
    11: { id: 'dtms-ms22-t11-nhan-hop-dong',
      schema: () => ({ components: [head(), chk('hdDaNhan', 'Xác nhận', req({ text: 'Đã nhận hợp đồng do Thủ trưởng VHT ký' }))] }),
      notes: () => ['Nhà thầu chưa ký ở bước này; chuyển bước 12.'], write: (v) => pick(v, ['hdDaNhan']) },
    12: { id: 'dtms-ms22-t12-gui-nha-thau', q: ['P-132'],
      schema: () => ({ components: [head(), ta('hdGhiChuGui', 'Ghi chú gửi nhà thầu')] }),
      notes: () => ['Chọn hình thức bằng nút: VContract hoặc bản giấy. <b>Giả lập P-132</b>: nội dung email và cách chuyển bản giấy chưa chốt.'], write: (v) => pick(v, ['hdGhiChuGui']) },
    13: { id: 'dtms-ms22-t13-ghi-nhan-ky', q: ['P-121', 'P-131'], outputs: () => ['HD-KY'],
      schema: () => ({ components: [head(),
        txt('Hình thức ký: **{{hd.hinhThuc}}**. Nhà thầu không có tài khoản trên hệ thống, Phòng Hợp đồng ghi nhận kết quả.'),
        tf('hdSo', 'Số hợp đồng', req({ layout: { columns: 8 } })),
        dt('hdNgayKy', 'Ngày ký', req({ layout: { columns: 8 } }))] }),
      notes: () => ['Bước của nhà thầu ngoài hệ thống (D-50). Bản đã ký tải lên ở Danh sách tài liệu.', '<b>Giả lập P-121</b>: Ghi nhận chưa ký giữ hồ sơ ở bước 13; BPMN chưa có nhánh này — đề xuất DX-06.',
        'Hoàn thành → hợp đồng chuyển Đang thực hiện, sang MS23.'],
      write: (v) => pick(v, ['hdSo', 'hdNgayKy']) },
  };
  window.EForms.MS22 = (tok) => F[tok.task] || null;

  /* Văn bản đầu ra của MS22 (mã tạm, GIẢ LẬP P-126): by = bước sinh văn bản. */
  const DOCS = [{ code: 'HD-PLKT', name: 'Phụ lục kỹ thuật', by: 2 }, { code: 'HD-BODY', name: 'Body hợp đồng', by: 3 }, { code: 'HD-PL1', name: 'Phụ lục 1 — Giá, danh mục hàng hoá', by: 3 },
    { code: 'HD-DT', name: 'Dự thảo hợp đồng và phụ lục', by: 4 }, { code: 'HD-KY', name: 'Hợp đồng đã ký đầy đủ', by: 13 }];
  const REQ = { 4: [['hdBb1', 'Biên bản thương thảo đã ký, đóng dấu']], 9: [['hdKyNhay', 'Bộ hợp đồng có ký nháy']], 13: [['hdBanKy', 'Hợp đồng đã ký đầy đủ', /^Ghi nhận đã ký/]] };
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };

  function vars(tok) {
    const h = hd(), u = Flow.ui, k = window.HopDong.kit(), g = window.HopDong.pkgOf(h), ai = Flow.state.vars.aiHd;
    const rows = u.hdRows || (h.items || []).map((r, i) => ({ ten: r[0], dvt: r[1], sl: r[2], maHang: 'VT-' + String(10201 + i) }));
    const w = warranty();
    return Object.assign({}, u, { hdRows: rows, baoHanhMin: D.hdWarrantyMin, hdBaoHanh: w,
      hdSo: u.hdSo || `${h.code.slice(-3)}/2026/HĐMB-VHT`, hdNgayKy: u.hdNgayKy || Flow.dateOf(Flow.state.clock),
      hd: { code: h.code, ten: h.title, ncc: k.nccName(h.ncc), gia: h.value, goi: h.pkg, kq: g && g.kq ? `${g.kq[0]} ngày ${g.kq[1]}` : '', loai: k.cat('loai-hop-dong', h.type), thoiGian: h.exec,
        tamDung: h.held || '', dangTamDung: !!h.held, hinhThuc: Flow.state.vars.hdSign === 'GIAY' ? 'Ký cứng, gửi lại bản giấy đã đóng dấu' : 'VContract' },
      items: (h.items || []).map((r) => ({ ten: r[0], dvt: r[1], sl: r[2], gia: r[3], tien: Math.round(r[2] * r[3] * 1000) / 1000 })),
      ai: ai ? { ketQua: ai.ok ? 'Đạt' : 'Chưa đạt', issues: ai.issues, tomTat: ai.ok ? `Kết quả lần ${ai.lan}: **Đạt** — dự thảo khớp KQLCNT, HSMT và HSDT trúng thầu.` : `Kết quả lần ${ai.lan}: **Chưa đạt** — ${ai.issues.length} cảnh báo cần xử lý.` } : { issues: [], tomTat: 'Chưa có kết quả kiểm tra.' },
      doiChieu: window.HopDong.checkRows(w) });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name, only]) => ({ key, name, only, have: !!Flow.ui[key] })); }
  const files = () => {
    const u = Flow.ui, h = hd(), no = h.code.replace('Đ', 'D'), g = window.HopDong.pkgOf(h), rows = [];
    if (at(1)) { rows.push({ name: `KQLCNT-${(g && g.kq ? g.kq[0] : '').replace(/\//g, '-')}.pdf`, at: at(1) }); rows.push({ name: `Ho-so-thau-${h.pkg}.pdf`, at: at(1) }); }
    if (u.hdBb1) rows.push({ name: `Bien-ban-thuong-thao-${no}.pdf`, at: at(4) || Flow.dateOf(Flow.state.clock) });
    if (u.hdKyNhay) rows.push({ name: `Bo-hop-dong-ky-nhay-${no}.pdf`, at: at(9) || Flow.dateOf(Flow.state.clock) });
    if (u.hdBanKy) rows.push({ name: `Hop-dong-da-ky-${no}.pdf`, at: at(13) || Flow.dateOf(Flow.state.clock) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => at(d.by) && (d.by !== 13 || Flow.state.status === 'approved')).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: at(d.by) }));
  /* Xem trước: mẫu Word + dữ liệu eForm. */
  function doc(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const h = hd(), u = Flow.ui, esc = window.UI.esc, k = window.HopDong.kit();
    const body = { 'HD-PLKT': `<p>Yêu cầu kỹ thuật: ${esc(u.hdYeuCau || '')}</p><p>Tiêu chuẩn nghiệm thu: ${esc(u.hdNghiemThu || '')}</p><p>SLA: ${esc(u.hdSla || '-')}</p><p>Tiến độ bàn giao: ${esc(u.hdTienDo || '')}</p>`,
      'HD-BODY': `<p>Mẫu: ${esc(u.hdMau || '')}</p><p>Bên mua: Tổng công ty Công nghiệp Công nghệ cao Viettel. Bên bán: ${esc(k.nccName(h.ncc))}.</p>`,
      'HD-PL1': `<p>Giá trị hợp đồng ${window.UI.ty(h.value, 2)} tỷ đồng, gồm thuế GTGT ${h.vat}%.</p>`,
      'HD-DT': `<p>Phiên bản v${version()}. Bảo hành lò hàn đối lưu ${warranty()} tháng kể từ ngày nghiệm thu.</p><p>Thời gian thực hiện: ${esc(h.exec || '')}.</p>`,
      'HD-KY': `<p>Số hợp đồng: ${esc(u.hdSo || '')}. Ngày ký: ${esc(u.hdNgayKy || '')}.</p>` }[code];
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(h.title)}</p>${body}</div>` };
  }
  /* Mỗi quy trình của hợp đồng đăng ký một bộ ở EForms.hdBy; EForms.hd chọn theo quy trình của hồ sơ đang nạp. */
  window.EForms.hdBy = { MS22: { vars, reqDocs, files, outs, doc, version, docs: DOCS, check: () => null } };
  const by = () => window.EForms.hdBy[D.familyOf(Flow.state.vars.process)];
  window.EForms.hd = { vars: (t) => by().vars(t), reqDocs: (t) => by().reqDocs(t), files: () => by().files(), outs: () => by().outs(), doc: (c) => by().doc(c), version: () => by().version(), get docs() { return by().docs; }, check: () => null };
})();
