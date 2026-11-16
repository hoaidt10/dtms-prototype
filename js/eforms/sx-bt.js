/*
 * eForm của luồng SX-BT Xử lý bất thường trong sản xuất — T71 S6 (D-121). Khoá form ở cấu hình bước D.sxFlows['SX-BT'].
 * Phiếu báo cáo theo BM.QLBT.01 (lap — dùng khi Thêm mới phiếu), phương án theo BM.QLBT.02 (pa). Ý kiến khi từ chối / Không đạt bắt buộc (G6).
 */
(function () {
  const { txt, tf, ta, dt, num, sel, file, chk, req, opts } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{phieu.code}}** — {{phieu.title}}\nDự án {{phieu.project}} · {{phieu.typeText}} · {{phieu.sevText}}');
  const F = {
    lap: { id: 'sx-bt-t01-phieu-bao-cao', write: ['btProject', 'btTitle', 'btDesc', 'btFound', 'btPlace', 'btQty', 'btFile'],
      schema: (ctx) => ({ components: [
        sel('btProject', 'Dự án sản xuất', req(Object.assign(L(16), { searchable: true, values: opts(ctx.projects || []) }))),
        tf('btTitle', 'Tiêu đề bất thường', req({ validate: { required: true, maxLength: 500 } })),
        ta('btDesc', 'Mô tả hiện tượng', req({ rows: 3 })),
        dt('btFound', 'Ngày phát hiện', req(L(6))), tf('btPlace', 'Nơi phát hiện (công đoạn, trạm, nhà máy)', req(L(10))),
        num('btQty', 'Số lượng ảnh hưởng', Object.assign({ validate: { min: 0 } }, L(6))), file('btFile', 'Ảnh, tệp đính kèm', L(10))] }) },
    pl: { id: 'sx-bt-t02-tiep-nhan', write: ['blLoai', 'blMucDo', 'blNguyenNhan'], note: (v) => (window.SxBt ? window.SxBt.classText(v.blLoai, v.blMucDo) : ''),
      schema: (ctx) => ({ components: [head(),
        sel('blLoai', 'Loại bất thường', req(Object.assign(L(8), { values: opts(ctx.types || []) }))),
        sel('blMucDo', 'Mức độ nghiêm trọng', req(Object.assign(L(8), { values: opts(ctx.sevs || []) }))),
        txt('Thời hạn xử lý theo danh mục Loại bất thường và SLA, tính từ ngày tiếp nhận theo ngày làm việc.'),
        ta('blNguyenNhan', 'Phân tích nguyên nhân', req({ rows: 3 }))] }) },
    pa: { id: 'sx-bt-t03-phuong-an', write: ['paBienPhap', 'paHan'], note: (v) => v.paBienPhap || '',
      schema: () => ({ components: [head(), txt('Nguyên nhân: {{blNguyenNhan}}\nĐơn vị triển khai theo loại: **{{phieu.handlerText}}**'),
        ta('paBienPhap', 'Biện pháp xử lý', req({ rows: 4 })), dt('paHan', 'Hạn hoàn thành dự kiến', req(L(6)))] }) },
    yk: { id: 'sx-bt-t04-phe-duyet', write: ['ykNoiDung'], note: (v) => v.ykNoiDung || '',
      schema: (ctx, ch) => ({ components: [head(), txt('Biện pháp: {{paBienPhap}}'),
        ta('ykNoiDung', ch && ch[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
    tk: { id: 'sx-bt-t05-trien-khai', write: ['tkKetQua', 'tkFile', 'tkEcr'], note: (v) => v.tkKetQua || '',
      schema: (ctx) => ({ components: [head(), txt('Biện pháp đã duyệt: {{paBienPhap}}'), ta('tkKetQua', 'Kết quả triển khai', req({ rows: 3 })), file('tkFile', 'Minh chứng')]
        .concat(ctx.phieu.type === 'L2' ? [chk('tkEcr', 'Đề nghị mở yêu cầu thay đổi kỹ thuật (ECR)')] : []) }) },
    kt: { id: 'sx-bt-t06-kiem-tra', write: ['ktKetQua'], note: (v) => v.ktKetQua || '',
      schema: (ctx, ch) => ({ components: [head(), txt('Kết quả triển khai: {{tkKetQua}}'),
        ta('ktKetQua', ch && ch[2] === 'no' ? 'Lý do không đạt' : 'Nhận xét kiểm tra', ch && ch[2] === 'no' ? req({ rows: 3 }) : { rows: 2 })] }) },
    bh: { id: 'sx-bt-t07-luu-ho-so', write: ['bhBaiHoc'], note: (v) => v.bhBaiHoc || '',
      schema: () => ({ components: [head(), ta('bhBaiHoc', 'Bài học kinh nghiệm', req({ rows: 3 }))] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-BT': F });
})();
