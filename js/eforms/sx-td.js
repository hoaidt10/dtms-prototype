/*
 * eForm của luồng SX-TD Thay đổi kỹ thuật ECR → ECO → ECN — T71 S7 (D-121). Khoá form ở cấu hình bước D.sxFlows['SX-TD'].
 * ECR theo BM.VHT.TTSX.01-SXL.07 (ecr — dùng khi Thêm mới), ECO theo SXL.08 (eco — chọn phạm vi thay đổi = cấp phê duyệt), ECN theo SXL.09 (ecn). Biểu mẫu gốc chưa có (C17).
 */
(function () {
  const { txt, tf, ta, dt, num, sel, file, chk, chkl, req, opts } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{ecr.code}}** — {{ecr.title}}\nDự án {{ecr.project}} · sản phẩm {{ecr.product}} {{ecr.version}}{{ecr.issueText}}');
  const F = {
    ecr: { id: 'sx-td-t01-ecr', write: ['tdProject', 'tdIssue', 'tdTitle', 'tdLyDo', 'tdNoiDung'],
      schema: (ctx) => ({ components: [
        sel('tdProject', 'Dự án sản xuất', req(Object.assign(L(16), { searchable: true, values: opts(ctx.projects || []) }))),
        sel('tdIssue', 'Phiếu bất thường liên quan', Object.assign(L(16), { values: opts(ctx.issues || []) })),
        tf('tdTitle', 'Tên yêu cầu thay đổi', req({ validate: { required: true, maxLength: 500 } })),
        ta('tdLyDo', 'Lý do thay đổi', req({ rows: 3 })), ta('tdNoiDung', 'Nội dung đề xuất thay đổi', req({ rows: 3 }))] }) },
    pt: { id: 'sx-td-t02-phan-tich', write: ['ptCauHinh', 'ptEbom', 'ptTienDo', 'ptChiPhi'], note: (v) => `Chậm ${v.ptTienDo || 0} ngày · chi phí ${Number(v.ptChiPhi || 0).toLocaleString('vi-VN')} đồng`,
      schema: () => ({ components: [head(), txt('Lý do: {{tdLyDo}}\nĐề xuất: {{tdNoiDung}}'),
        ta('ptCauHinh', 'Ảnh hưởng tới cấu hình sản phẩm', req()), ta('ptEbom', 'Ảnh hưởng tới eBOM', req()),
        num('ptTienDo', 'Ảnh hưởng tiến độ (ngày)', req(Object.assign(L(8), { validate: { required: true, min: 0 } }))), num('ptChiPhi', 'Chi phí phát sinh (đồng)', req(Object.assign(L(8), { validate: { required: true, min: 0 } })))] }) },
    eco: { id: 'sx-td-t03-eco', write: ['ecoCap', 'ecoNoiDung', 'ecoPhienBan'], note: (v) => `Cấp ${v.ecoCap || ''}`,
      schema: (ctx) => ({ components: [head(), txt('Phân tích: cấu hình — {{ptCauHinh}}; eBOM — {{ptEbom}}; tiến độ {{ptTienDo}} ngày.'),
        sel('ecoCap', 'Phạm vi thay đổi (quyết định cấp phê duyệt)', req(Object.assign(L(16), { values: opts(ctx.levels || []) }))),
        ta('ecoNoiDung', 'Nội dung lệnh thay đổi', req({ rows: 3 })), tf('ecoPhienBan', 'Phiên bản sau thay đổi', req(L(8)))] }) },
    yk: { id: 'sx-td-t04-phe-duyet', write: ['ykNoiDung'], note: (v) => v.ykNoiDung || '',
      schema: (ctx, ch) => ({ components: [head(), txt('Lệnh thay đổi: {{ecoNoiDung}}\nPhiên bản sau thay đổi: **{{ecoPhienBan}}** · chi phí phát sinh {{ptChiPhi}} đồng'),
        ta('ykNoiDung', ch && ch[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
    ecn: { id: 'sx-td-t06-ecn', write: ['ecnTaiLieu', 'ecnNoiDung', 'ecnFile'], note: (v) => (v.ecnTaiLieu || []).join(', '),
      schema: () => ({ components: [head(), txt('Mã ECO: **{{ecr.eco}}** · phiên bản sau thay đổi {{ecoPhienBan}}'),
        chkl('ecnTaiLieu', 'Tài liệu đã cập nhật', req({ values: opts(['Bản vẽ', 'Firmware', 'eBOM', 'Quy trình công nghệ', 'Hướng dẫn sử dụng']) })),
        ta('ecnNoiDung', 'Nội dung thông báo thay đổi', req({ rows: 3 })), file('ecnFile', 'Tài liệu ECN', req())] }) },
    kt: { id: 'sx-td-t07-tham-dinh', write: ['ktKetQua'], note: (v) => v.ktKetQua || '',
      schema: (ctx, ch) => ({ components: [head(), txt('ECN: {{ecnNoiDung}}'),
        ta('ktKetQua', ch && ch[2] === 'no' ? 'Lý do không đạt' : 'Kết quả đo kiểm mẫu', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
    bg: { id: 'sx-td-t09-ban-giao', write: ['bgNgay', 'bgSeri', 'bgThuHoi'], note: (v) => `Áp dụng từ ${v.bgNgay || ''}, sê-ri ${v.bgSeri || ''}`,
      schema: () => ({ components: [head(), txt('Mã ECN: **{{ecr.ecn}}** · phiên bản {{ecoPhienBan}}'),
        dt('bgNgay', 'Ngày nhà máy áp dụng', req(L(8))), tf('bgSeri', 'Áp dụng từ số sê-ri', req(L(8))), chk('bgThuHoi', 'Đã thu hồi tài liệu cũ tại nhà máy', req())] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-TD': F });
})();
