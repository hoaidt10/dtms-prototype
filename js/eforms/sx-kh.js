/*
 * eForm (Camunda Form schema) của luồng SX-KH Phê duyệt kế hoạch sản xuất — T71 S2 (D-121), chỉnh theo QT-TTSX-4A11 §5.4 bước 1–3 (plan T71 §10 Q1, Q5, Q6).
 * Khoá form ở cấu hình bước D.sxFlows['SX-KH'] (thuộc tính form). Mỗi form: { id (formKey), schema(ctx, choice) → { components }, write — biến ghi vào hồ sơ,
 * note — biến làm Nội dung ở Lịch sử xử lý }. Form bước 1 đổi theo lựa chọn (Trình Ban Giám đốc Khối / Không lập báo cáo) — một form, ẩn hiện theo nút (S2).
 * Kế hoạch theo BM-QLHDSX-01: phần chính nhập trên form, 6 phụ lục tải file (GIẢ LẬP P-245). Ý kiến khi từ chối bắt buộc (G6).
 */
(function () {
  const { txt, tf, ta, dt, sel, file, req, grp, dlAdd, opts, tbl, chkl } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{duAn.code}}** — {{duAn.name}}\nSản phẩm {{duAn.product}} · {{duAn.version}} · {{duAn.qtyText}} · {{duAn.modelText}}');
  const PL = [['khPl1', 'Phụ lục I — Cấu hình sản phẩm, chỉ tiêu, tính năng chiến-kỹ thuật', true], ['khPl2', 'Phụ lục II — Lưu trình tích hợp, đo kiểm'],
    ['khPl3', 'Phụ lục III — Danh sách gói mua sắm (dự kiến)'], ['khPl4', 'Phụ lục IV — Danh sách vật tư leadtime dài, Export License'],
    ['khPl5', 'Phụ lục V — Phạm vi công việc của các đơn vị'], ['khPl6', 'Phụ lục VI — Kế hoạch thực hiện chi tiết', true]];
  /* Đơn vị phối hợp bước 1 (QT §5.4: TT MS, ĐV NCPT; §5.5 ĐBCL S). GIẢ LẬP P-266: chỉ ghi nhận, không mở việc góp ý. */
  const PH = [['TTMS', 'Trung tâm Mua sắm'], ['NCPT', 'Đơn vị Nghiên cứu phát triển'], ['DBCL', 'Đơn vị Đảm bảo chất lượng']];
  const skip = (ch) => !!ch && ch[1] === 3;

  const F = {
    /* Bước 1: báo cáo các điều kiện ràng buộc xin ý kiến chỉ đạo của Ban Giám đốc Khối (QT bước 1, cột e). Bảng vật tư leadtime dài = khối chỉ xem đọc MBOM (VMMS) theo sản phẩm. */
    pa: { id: 'sx-kh-t01-phuong-an', write: ['paTomTat', 'paRangBuoc', 'paGoiMs', 'paPhoiHop', 'paFile', 'paQtcn', 'paLyDo'],
      note: (v) => (v.paLyDo ? `Không lập báo cáo phương án: ${v.paLyDo}` : `${(v.paRangBuoc || []).length} ràng buộc cần xin ý kiến`),
      schema: (ctx, ch) => (skip(ch) ? { components: [head(),
        txt('Báo cáo phương án sản xuất không bắt buộc. Đơn vị Quản lý sản xuất tự đánh giá tính cần thiết trước khi lập kế hoạch.'),
        ta('paLyDo', 'Lý do không lập báo cáo phương án', req({ rows: 3 }))] } : { components: [head(),
        txt('Báo cáo các điều kiện ràng buộc cần xin ý kiến chỉ đạo của Ban Giám đốc Khối về phương án triển khai sản xuất, bảo đảm mốc kế hoạch được giao.'),
        ta('paTomTat', 'Tóm tắt phương án sản xuất', req({ rows: 3 })),
        dlAdd('paRangBuoc', 'Điều kiện ràng buộc cần xin ý kiến', [ta('noiDung', 'Nội dung ràng buộc', req(L(6))), ta('anhHuong', 'Ảnh hưởng tới mốc kế hoạch', L(5)), ta('deXuat', 'Đề xuất xin ý kiến', req(L(5)))]),
        tbl('Vật tư leadtime dài, Export License (MBOM đồng bộ từ VMMS)', 'paVtLt', [['ma', 'Mã vật tư'], ['ten', 'Tên vật tư'], ['lt', 'Leadtime (tuần)'], ['el', 'Export License']]),
        ta('paGoiMs', 'Danh sách gói mua sắm dự kiến', { rows: 2 }),
        chkl('paPhoiHop', 'Đơn vị đã phối hợp', { values: opts(PH) }),
        file('paFile', 'Báo cáo phương án sản xuất', req(L(8))), file('paQtcn', 'Hồ sơ quy trình công nghệ sản xuất, đo kiểm', L(8))] }) },
    /* Bước 2: ý kiến chỉ đạo của Ban Giám đốc Khối — làm căn cứ lập kế hoạch ở bước 3. */
    cd: { id: 'sx-kh-t02-chi-dao', write: ['cdNoiDung'], note: (v) => v.cdNoiDung || '',
      schema: (ctx, ch) => ({ components: [head(),
        txt('Tóm tắt phương án: {{paTomTat}}'),
        tbl('Điều kiện ràng buộc', 'paRangBuoc', [['noiDung', 'Nội dung ràng buộc'], ['anhHuong', 'Ảnh hưởng tới mốc'], ['deXuat', 'Đề xuất xin ý kiến']]),
        ta('cdNoiDung', ch && ch[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến chỉ đạo', req({ rows: 4 }))] }) },
    kh: { id: 'sx-kh-t03-ke-hoach', write: ['khSo', 'khMucTieu', 'khKr1', 'khKr2', 'khKr3', 'khYeuCau', 'khPhuongAn', 'khToChuc', 'khNhanSu', 'khMoc', 'khRuiRo'].concat(PL.map((x) => x[0])),
      note: (v) => `Kế hoạch số ${v.khSo || ''}`,
      schema: (ctx) => ({ components: [head(),
        txt(ctx.cdNoiDung ? 'Ý kiến chỉ đạo của Ban Giám đốc Khối: {{cdNoiDung}}' : 'Không lập báo cáo phương án sản xuất.'),
        tf('khSo', 'Số kế hoạch', req(L(8))),
        grp('1. Mục tiêu và các kết quả then chốt (OKRs)', [ta('khMucTieu', 'Mục tiêu', req()), tf('khKr1', 'Kết quả then chốt 1', req()), tf('khKr2', 'Kết quả then chốt 2'), tf('khKr3', 'Kết quả then chốt 3')]),
        grp('2. Yêu cầu', [ta('khYeuCau', 'Yêu cầu', req())]),
        grp('3. Phương án tổ chức', [ta('khPhuongAn', 'Phương án tổ chức thực hiện', req()), ta('khToChuc', 'Tổ chức thực hiện của các đơn vị'),
          dlAdd('khNhanSu', 'Nhân sự chính thực hiện', [tf('hoTen', 'Họ và tên', req(L(5))), tf('donVi', 'Đơn vị', L(6)), tf('vaiTro', 'Vai trò', L(5))])]),
        grp('4. Các mốc chính của dự án', [dlAdd('khMoc', 'Mốc chính', [tf('ten', 'Mốc chính', req(L(10))), dt('han', 'Thời gian hoàn thành', req(L(6)))])]),
        grp('5. Rủi ro, đề xuất', [ta('khRuiRo', 'Rủi ro, đề xuất')]),
        grp('Phụ lục', PL.map(([k, l, r]) => file(k, l, r ? req() : {})))] }) },
    yk: { id: 'sx-kh-t04-phe-duyet', write: ['ykNoiDung'], note: (v) => v.ykNoiDung || '',
      schema: (ctx, choice) => ({ components: [head(),
        txt('Kế hoạch số **{{khSo}}** · Mục tiêu: {{khMucTieu}}'),
        ta('ykNoiDung', choice && choice[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến', choice && choice[2] === 'no' ? req({ rows: 4 }) : { rows: 3 })] }) },
    /* Bước 5 (QT bước 3): kick-off do Ban Giám đốc Khối chủ trì; đầu vào quyết định giao nhiệm vụ PM và nhóm dự án, đầu ra biên bản kick-off. */
    ko: { id: 'sx-kh-t05-kick-off', write: ['koNgay', 'koChuTri', 'koSubPm', 'koQuyetDinh', 'koBienBan', 'koGhiChu'], note: (v) => `Kick-off ngày ${v.koNgay || ''}`,
      schema: (ctx) => ({ components: [head(),
        txt('Chốt kế hoạch gốc: các mốc của tab **Kế hoạch & mốc** được khoá làm mốc so sánh; thay đổi sau này ghi chênh lệch so với kế hoạch gốc.'),
        dt('koNgay', 'Ngày kick-off', req(L(6))),
        sel('koChuTri', 'Chủ trì cuộc họp (Ban Giám đốc Khối)', req(Object.assign(L(10), { values: opts(ctx.leaders || []) }))),
        sel('koSubPm', 'Cán bộ phụ trách bán thành phẩm (Sub PM)', Object.assign(L(10), { values: opts(ctx.subPms || []) })),
        file('koQuyetDinh', 'Quyết định giao nhiệm vụ cho PM và nhóm dự án', req(L(8))),
        file('koBienBan', 'Biên bản kick-off', req(L(8))),
        ta('koGhiChu', 'Truyền thông mục tiêu, giao nhiệm vụ, ghi chú')] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-KH': F });
})();
