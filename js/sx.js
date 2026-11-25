/* Phân hệ Quản lý sản xuất — router #/sx/… (T71, D-121). Dữ liệu ở sx-data.js.
   S0: mọi mục menu chưa dựng mở trang Đang phát triển (khuôn features/coming-soon, rule A7); (i) ghi lát sẽ dựng. */
(function () {
  const D = window.D;

  /* Tìm mục menu SX theo path (mục con trước). */
  function find(path) {
    for (const g of D.sxMenu) {
      if (g.path === path) return { item: g, group: null };
      for (const k of g.children || []) if (k.path === path) return { item: k, group: g };
    }
    return null;
  }

  /* Mục đang chọn trên sidebar: route con (vd sx/du-an/<mã>) sáng mục cha gần nhất có trong menu. */
  function activePath(r) {
    /* Màn xử lý việc (#/sx/viec/…) thuộc mục Việc của tôi. */
    if (r.startsWith('sx/viec/')) return 'sx/viec-cua-toi';
    /* T71 S9: chi tiết / thêm mới công việc sáng mục Việc cá nhân hoặc Nhiệm vụ đơn vị theo loại. */
    if (r.startsWith('sx/cong-viec/') && window.SxCv) { const a = window.SxCv.activePath(r); if (a) return a; }
    const parts = r.split('/');
    for (let n = parts.length; n >= 2; n -= 1) {
      const p = parts.slice(0, n).join('/');
      if (find(p)) return p;
    }
    return r;
  }

  function route(parts) {
    /* T71 S13: Tổng quan SX-01, Báo cáo SX-14 (sx-bao-cao.js). */
    if (parts[0] === 'tong-quan') return window.SxBc.overview();
    if (parts[0] === 'bao-cao') return window.SxBc.report(parts[1]);
    /* T71 S1: Dự án sản xuất (sx-du-an.js). */
    if (parts[0] === 'du-an') return window.SxDuAn.route(parts.slice(1));
    /* COP2 B1: Phương án sản xuất kinh doanh (sx-pasxkd.js). */
    if (parts[0] === 'pasxkd') return window.SxPa.route(parts.slice(1));
    /* T71 S2: Việc của tôi, xử lý việc (sx-flow.js). */
    if (parts[0] === 'viec-cua-toi' || parts[0] === 'viec') return window.SxFlow.route(parts);
    /* T71 S3: Hồ sơ chuyển giao, Sản phẩm sẵn sàng sản xuất (sx-chuyen-giao.js). */
    if (parts[0] === 'chuyen-giao' || parts[0] === 'san-pham') return window.SxCg.route(parts);
    /* T71 S4: Đề xuất mua sắm từ sản xuất (sx-mua-sam.js). */
    if (parts[0] === 'mua-sam' || parts[0] === 'goi-thau-hd') return window.SxMs.route(parts);
    /* T71 S10: Nhu cầu vật tư (sx-nhu-cau.js). */
    if (parts[0] === 'nhu-cau') return window.SxNc.route(parts.slice(1));
    /* T71 S11: Hồ sơ dự án, Biểu mẫu tài liệu, Bài học kinh nghiệm (sx-ho-so.js). */
    if (parts[0] === 'ho-so' || parts[0] === 'bieu-mau' || parts[0] === 'bai-hoc') return window.SxHs.route(parts);
    /* T71 S6: Bất thường sản xuất (sx-bat-thuong.js). */
    if (parts[0] === 'bat-thuong') return window.SxBt.route(parts);
    /* T71 S7: Thay đổi kỹ thuật (sx-thay-doi.js). */
    if (parts[0] === 'thay-doi') return window.SxTd.route(parts);
    /* T71 S8: Chất lượng & nghiệm thu (sx-nghiem-thu.js). */
    if (parts[0] === 'nghiem-thu') return window.SxNt.route(parts);
    /* T71 S9: Công việc — việc cá nhân, nhiệm vụ đơn vị (sx-cong-viec.js). */
    if (parts[0] === 'cong-viec') return window.SxCv.route(parts.slice(1));
    /* T71 S12: Mẫu thông báo của phân hệ — dùng chung màn notification-template (thong-bao.js), lọc mẫu SX. */
    if (parts[0] === 'mau-thong-bao') return window.ThongBao.route(parts);
    /* 25/11: Quản lý quy trình — nguyên màn của ĐTMS (quy-trinh.js, ma-tran.js). */
    if (parts[0] === 'quy-trinh') return parts[1] ? window.QuyTrinh.detail(parts[1]) : window.QuyTrinh.list();
    if (parts[0] === 'giam-sat-tien-trinh') return window.QuyTrinh.monitor();
    if (parts[0] === 'ma-tran') return window.MaTran.route(parts[1] ? parts.slice(1) : ['display-rule']);
    const path = 'sx/' + parts.join('/');
    const m = find(activePath(path)) || { item: { label: 'Quản lý sản xuất', notes: ['Đường dẫn chưa có trong phân hệ.'] }, group: null };
    const item = Object.assign({}, m.item, { product: D.sxProduct, ph: 'Quản lý sản xuất', notes: (m.item.notes || []).concat(['Phân hệ Quản lý sản xuất — plan T71, D-121; điểm chung P-237, P-243.']) });
    return window.Screens.phanHe(item, null);
  }

  /* Gọi khi đổi route (app.js render): chuẩn bị form của màn sắp mở. */
  function enter(parts) { if (parts[0] === 'sx') { window.SxDuAn.enter(parts.slice(1)); window.SxFlow.enter(parts.slice(1)); if (window.SxCg) window.SxCg.enter(parts.slice(1)); if (window.SxMs) window.SxMs.enter(parts.slice(1)); if (window.SxBt) window.SxBt.enter(parts.slice(1)); if (window.SxTd) window.SxTd.enter(parts.slice(1)); if (window.SxNt) window.SxNt.enter(parts.slice(1)); if (window.SxCv) window.SxCv.enter(parts.slice(1)); if (parts[1] === 'mau-thong-bao') window.ThongBao.enter(parts.slice(1)); } }

  window.Sx = { route, activePath, find, enter };
})();
