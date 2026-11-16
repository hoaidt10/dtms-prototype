/*
 * eForm của luồng SX-BG Chuyển giao từ nghiên cứu sang sản xuất — T71 S3 (D-121). Khoá form ở cấu hình bước D.sxFlows['SX-BG'].
 * Hồ sơ chuyển giao tải lên ở card Danh sách hồ sơ chuyển giao của gói (như Danh sách tài liệu), không đặt trong form.
 */
(function () {
  const { txt, ta, tf, dt, file, tags, req } = window.EForms.b;
  const L = (n) => ({ layout: { columns: n } });
  const head = () => txt('**{{goi.code}}** — Sản phẩm {{goi.product}} · phiên bản {{goi.version}} · {{goi.khoiText}}');
  const F = {
    gui: { id: 'sx-bg-t01-gui-tham-dinh', write: ['guiGhiChu'], note: (v) => v.guiGhiChu || '',
      schema: () => ({ components: [head(), txt('Đã tải đủ **{{hsDu}} / {{hsTong}}** hồ sơ bắt buộc của {{goi.khoiText}}. Gói được gửi đồng thời cho Quản lý sản xuất và Đảm bảo chất lượng thẩm định.'),
        ta('guiGhiChu', 'Ghi chú gửi thẩm định')] }) },
    td: { id: 'sx-bg-t03-tham-dinh', write: ['tdYk', 'tdBoSung'], note: (v) => v.tdYk || '',
      schema: (ctx, choice) => {
        const no = choice && choice[2] === 'no';
        return { components: [head(), txt('Hồ sơ: **{{hsDu}} / {{hsTong}}** hồ sơ bắt buộc đã tải lên.')].concat(
          no ? [tags('tdBoSung', 'Hồ sơ cần bổ sung, sửa lại', req({ values: (ctx.hsOpts || []).map(([value, label]) => ({ value, label })) }))] : [],
          [ta('tdYk', no ? 'Nội dung cần bổ sung' : 'Ý kiến thẩm định', no ? req({ rows: 4 }) : { rows: 3 })]) };
      } },
    bb: { id: 'sx-bg-t04-bien-ban', write: ['bbSo', 'bbNgay', 'bbThanhPhan', 'bbFile'], note: (v) => `Biên bản số ${v.bbSo || ''}`,
      schema: () => ({ components: [head(), tf('bbSo', 'Số biên bản', req(L(8))), dt('bbNgay', 'Ngày lập', req(L(8))),
        ta('bbThanhPhan', 'Thành phần đủ điều kiện sản xuất', req({ rows: 3 })), file('bbFile', 'Biên bản thống nhất đã ký', req())] }) },
  };
  window.EForms.sx = Object.assign(window.EForms.sx || {}, { 'SX-BG': F });
})();
