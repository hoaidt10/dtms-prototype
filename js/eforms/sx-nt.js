/*
 * eForm của luồng SX-NT Nghiệm thu sản phẩm — T71 S8 (D-121). Khoá form ở cấu hình bước D.sxFlows['SX-NT'].
 * dn — đề nghị nghiệm thu lô (dùng khi Thêm mới; số lượng không vượt số đã sản xuất chưa nghiệm thu), oqc, bb (biên bản), yk, nk (đề nghị nhập kho).
 */
(function () {
  const { txt, tf, ta, dt, num, sel, file, req, opts, chk } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{lo.code}}** — {{lo.itemText}}, {{lo.qtyText}}\nDự án {{lo.project}} · sê-ri {{lo.serials}}');
  const F = {
    dn: { id: 'sx-nt-t01-de-nghi', write: ['ntItem', 'ntQty', 'ntGhiChu'],
      schema: (ctx) => ({ components: [txt(`Dự án **${ctx.projectText || ''}**`),
        sel('ntItem', 'Hạng mục / lô', req(Object.assign(L(16), { values: opts(ctx.items || []) }))),
        num('ntQty', 'Số lượng đề nghị nghiệm thu', req(Object.assign(L(8), { validate: { required: true, min: 1 } }))),
        txt('Số sê-ri cấp liên tiếp theo tiền tố của dự án.'), ta('ntGhiChu', 'Ghi chú')] }) },
    oqc: { id: 'sx-nt-t02-oqc', write: ['oqcMau', 'oqcKetQua'], note: (v) => v.oqcKetQua || '',
      schema: (ctx, ch) => ({ components: [head(), tf('oqcMau', 'Cỡ mẫu / tiêu chuẩn lấy mẫu', req(L(10))),
        ta('oqcKetQua', ch && ch[2] === 'no' ? 'Lỗi phát hiện (ghi vào phiếu bất thường)' : 'Kết quả đánh giá', req({ rows: 3 }))] }) },
    /* (b) Q11: đầu ra QT bước 13 — BBBG hàng hóa (HOC), CO, CQ và tài liệu kèm theo. */
    bb: { id: 'sx-nt-t03-bien-ban', write: ['bbSo', 'bbNgay', 'bbKetLuan', 'bbFile', 'bbHoc', 'bbCoCq'], note: (v) => `Biên bản số ${v.bbSo || ''}`,
      schema: () => ({ components: [head(), txt('OQC: {{oqcKetQua}}'), tf('bbSo', 'Số biên bản', req(L(8))), dt('bbNgay', 'Ngày lập', req(L(8))),
        ta('bbKetLuan', 'Kết luận nghiệm thu', req({ rows: 2 })), file('bbFile', 'Biên bản nghiệm thu đã ký', req(L(8))),
        file('bbHoc', 'Biên bản bàn giao hàng hóa (HOC)', req(L(8))), file('bbCoCq', 'CO, CQ và tài liệu kèm theo (hướng dẫn sử dụng, lắp đặt…)', L(8))] }) },
    yk: { id: 'sx-nt-t04-phe-duyet', write: ['ykNoiDung'], note: (v) => v.ykNoiDung || '',
      schema: (ctx, ch) => ({ components: [head(), txt('Biên bản **{{bbSo}}**: {{bbKetLuan}}'),
        ta('ykNoiDung', ch && ch[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
    /* (b) Q11: QT bước 14 — bao gói, nghiệm thu sau bao gói và trước nhập kho. */
    nk: { id: 'sx-nt-t05-nhap-kho', write: ['nkBaoGoi', 'nkBbBaoGoi', 'nkKho', 'nkGhiChu'], note: (v) => v.nkKho || '',
      schema: () => ({ components: [head(), txt('Biên bản **{{bbSo}}** · chứng chỉ chất lượng **{{lo.cert}}**'),
        chk('nkBaoGoi', '', req({ text: 'Sản phẩm đã bao gói, niêm cất; đã nghiệm thu sau bao gói, trước nhập kho' })),
        file('nkBbBaoGoi', 'Biên bản nghiệm thu sau bao gói', req(L(8))),
        tf('nkKho', 'Kho nhập', req(L(8))), ta('nkGhiChu', 'Ghi chú (bảo quản theo quy định quản lý tài sản hiện hành)')] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-NT': F });
})();
