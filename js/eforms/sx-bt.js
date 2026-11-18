/*
 * eForm của luồng SX-BT Xử lý bất thường trong sản xuất — T71 S6 (D-121). Khoá form ở cấu hình bước D.sxFlows['SX-BT'].
 * Phiếu báo cáo theo BM.QLBT.01 (lap — dùng khi Thêm mới phiếu), phương án theo BM.QLBT.02 (pa). Ý kiến khi từ chối / Không đạt bắt buộc (G6).
 */
(function () {
  const { txt, tf, ta, dt, num, sel, file, chk, req, opts } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{phieu.code}}** — {{phieu.title}}\nDự án {{phieu.project}} · {{phieu.typeText}} · {{phieu.sevText}}');
  const F = {
    /* T74 #100: thêm Phân loại bất thường, Mức độ nghiêm trọng (bắt buộc), Dự đoán sơ bộ nguyên nhân; đính kèm chia theo mục của BM.QLBT.01 — chỉ phiếu BM.QLBT.01 bắt buộc (Q9).
       Dùng cả khi Thêm mới và khi người lập sửa phiếu bị trả lại (bước 1 mở lại). */
    lap: { id: 'sx-bt-t01-phieu-bao-cao', write: ['btProject', 'btTitle', 'btLoai', 'btMucDo', 'btDesc', 'btFound', 'btPlace', 'btQty', 'btGuess',
      'btFileBm', 'btFileIqc', 'btFileQc', 'btFileKd', 'btFile'],
      note: (v) => (window.SxBt && v.btLoai ? window.SxBt.classText(v.btLoai, v.btMucDo) : ''),
      schema: (ctx) => ({ components: [
        sel('btProject', 'Dự án sản xuất', req(Object.assign(L(16), { searchable: true, values: opts(ctx.projects || []) }))),
        tf('btTitle', 'Tiêu đề bất thường', req({ validate: { required: true, maxLength: 500 } })),
        sel('btLoai', 'Phân loại bất thường', req(Object.assign(L(8), { values: opts(ctx.types || []), description: 'Loại quyết định đơn vị xử lý (Loại 1 QLSX, Loại 2 R&D, Loại 3 Nhà máy)' }))),
        sel('btMucDo', 'Mức độ nghiêm trọng', req(Object.assign(L(8), { values: opts(ctx.sevs || []), description: 'Mức độ quyết định thời hạn xử lý (SLA)' }))),
        ta('btDesc', 'Mô tả hiện tượng', req({ rows: 3 })),
        dt('btFound', 'Ngày phát hiện', req(L(6))), tf('btPlace', 'Nơi phát hiện (công đoạn, trạm, nhà máy)', req(L(10))),
        num('btQty', 'Số lượng ảnh hưởng', Object.assign({ validate: { min: 0 } }, L(6))),
        ta('btGuess', 'Dự đoán sơ bộ nguyên nhân', { rows: 2 }),
        txt('**Hồ sơ đính kèm theo BM.QLBT.01** — thông tin cần thiết để phân tích nguyên nhân'),
        file('btFileBm', 'Phiếu báo cáo bất thường (BM.QLBT.01)', req(Object.assign(L(8), { description: 'Mẫu ở Hồ sơ, tài liệu › Biểu mẫu tài liệu' }))),
        file('btFileIqc', 'Hồ sơ IQC vật tư, linh kiện, bán thành phẩm (CO, CQ, CoC, kết quả thử nghiệm bên thứ 3 nếu có)', L(8)),
        file('btFileQc', 'Hồ sơ kiểm soát chất lượng trong quá trình sản xuất', L(8)),
        file('btFileKd', 'Hồ sơ kiểm định / hiệu chuẩn phương tiện đo', L(8)),
        file('btFile', 'Ảnh, tài liệu khác', L(8))] }) },
    /* T74 #101: bỏ Loại / Mức độ (đã chọn ở bước 1), thêm đính kèm; Trả lại người lập cần lý do. Phiếu hệ thống tự lập (OQC không đạt) chưa có loại → hiện lại 2 ô chọn. */
    pl: { id: 'sx-bt-t02-tiep-nhan', write: ['blLoai', 'blMucDo', 'blNguyenNhan', 'blFile', 'blLyDoTra'],
      note: (v) => v.blNguyenNhan || v.blLyDoTra || '',
      schema: (ctx, ch) => ({ components: ch && ch[2] === 'no'
        ? [head(), ta('blLyDoTra', 'Lý do trả lại (phân loại, mức độ hoặc thông tin phiếu cần sửa)', req({ rows: 3 }))]
        : [head()].concat(ctx.phieu.type ? [] : [
          sel('blLoai', 'Loại bất thường', req(Object.assign(L(8), { values: opts(ctx.types || []) }))),
          sel('blMucDo', 'Mức độ nghiêm trọng', req(Object.assign(L(8), { values: opts(ctx.sevs || []) })))], [
          txt('Thời hạn xử lý theo danh mục Loại bất thường và SLA, tính từ ngày tiếp nhận theo ngày làm việc. Phân loại hoặc mức độ chưa đúng thì chọn **Trả lại người lập**.'),
          ta('blNguyenNhan', 'Phân tích nguyên nhân', req({ rows: 3 })),
          file('blFile', 'Tài liệu đính kèm')]) }) },
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
