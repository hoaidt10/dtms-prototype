/*
 * eForm (Camunda Form schema) của luồng SX-KH Phê duyệt kế hoạch sản xuất — T71 S2 (D-121). Khoá form ở cấu hình bước D.sxFlows['SX-KH'] (thuộc tính form).
 * Mỗi form: { id (formKey), schema(ctx, choice) → { components }, write — biến ghi vào hồ sơ, note — biến làm Nội dung ở Lịch sử xử lý }.
 * Kế hoạch theo BM-QLHDSX-01: phần chính nhập trên form, 6 phụ lục tải file (GIẢ LẬP P-245). Ý kiến khi từ chối bắt buộc (G6).
 */
(function () {
  const { txt, tf, ta, dt, sel, file, req, grp, dlAdd, opts } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{duAn.code}}** — {{duAn.name}}\nSản phẩm {{duAn.product}} · {{duAn.version}} · {{duAn.qtyText}} · {{duAn.modelText}}');
  const PL = [['khPl1', 'Phụ lục I — Cấu hình sản phẩm, chỉ tiêu, tính năng chiến-kỹ thuật', true], ['khPl2', 'Phụ lục II — Lưu trình tích hợp, đo kiểm'],
    ['khPl3', 'Phụ lục III — Danh sách gói mua sắm (dự kiến)'], ['khPl4', 'Phụ lục IV — Danh sách vật tư leadtime dài, Export License'],
    ['khPl5', 'Phụ lục V — Phạm vi công việc của các đơn vị'], ['khPl6', 'Phụ lục VI — Kế hoạch thực hiện chi tiết', true]];

  const F = {
    pa: { id: 'sx-kh-t01-phuong-an', write: ['paTomTat', 'paFile'],
      schema: () => ({ components: [head(), ta('paTomTat', 'Tóm tắt phương án sản xuất', req({ rows: 4 })), file('paFile', 'Báo cáo phương án sản xuất', req())] }) },
    kh: { id: 'sx-kh-t02-ke-hoach', write: ['khSo', 'khMucTieu', 'khKr1', 'khKr2', 'khKr3', 'khYeuCau', 'khPhuongAn', 'khToChuc', 'khNhanSu', 'khMoc', 'khRuiRo'].concat(PL.map((x) => x[0])),
      note: (v) => `Kế hoạch số ${v.khSo || ''}`,
      schema: () => ({ components: [head(),
        tf('khSo', 'Số kế hoạch', req(L(8))),
        grp('1. Mục tiêu và các kết quả then chốt (OKRs)', [ta('khMucTieu', 'Mục tiêu', req()), tf('khKr1', 'Kết quả then chốt 1', req()), tf('khKr2', 'Kết quả then chốt 2'), tf('khKr3', 'Kết quả then chốt 3')]),
        grp('2. Yêu cầu', [ta('khYeuCau', 'Yêu cầu', req())]),
        grp('3. Phương án tổ chức', [ta('khPhuongAn', 'Phương án tổ chức thực hiện', req()), ta('khToChuc', 'Tổ chức thực hiện của các đơn vị'),
          dlAdd('khNhanSu', 'Nhân sự chính thực hiện', [tf('hoTen', 'Họ và tên', req(L(5))), tf('donVi', 'Đơn vị', L(6)), tf('vaiTro', 'Vai trò', L(5))])]),
        grp('4. Các mốc chính của dự án', [dlAdd('khMoc', 'Mốc chính', [tf('ten', 'Mốc chính', req(L(10))), dt('han', 'Thời gian hoàn thành', req(L(6)))])]),
        grp('5. Rủi ro, đề xuất', [ta('khRuiRo', 'Rủi ro, đề xuất')]),
        grp('Phụ lục', PL.map(([k, l, r]) => file(k, l, r ? req() : {})))] }) },
    yk: { id: 'sx-kh-yk', write: ['ykNoiDung'], note: (v) => v.ykNoiDung || '',
      schema: (ctx, choice) => ({ components: [head(),
        txt('Kế hoạch số **{{khSo}}** · Mục tiêu: {{khMucTieu}}'),
        ta('ykNoiDung', choice && choice[2] === 'no' ? 'Nội dung cần chỉnh sửa' : 'Ý kiến', choice && choice[2] === 'no' ? req({ rows: 4 }) : { rows: 3 })] }) },
    ko: { id: 'sx-kh-t05-kick-off', write: ['koNgay', 'koSubPm', 'koGhiChu'], note: (v) => `Kick-off ngày ${v.koNgay || ''}`,
      schema: (ctx) => ({ components: [head(),
        txt('Chốt kế hoạch gốc: các mốc của tab **Kế hoạch & mốc** được khoá làm mốc so sánh; thay đổi sau này ghi chênh lệch so với kế hoạch gốc.'),
        dt('koNgay', 'Ngày kick-off', req(L(6))),
        sel('koSubPm', 'Cán bộ phụ trách bán thành phẩm (Sub PM)', Object.assign(L(10), { values: opts(ctx.subPms || []) })),
        ta('koGhiChu', 'Giao nhiệm vụ, ghi chú')] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-KH': F });
})();
