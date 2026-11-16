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
    const parts = r.split('/');
    for (let n = parts.length; n >= 2; n -= 1) {
      const p = parts.slice(0, n).join('/');
      if (find(p)) return p;
    }
    return r;
  }

  function route(parts) {
    /* T71 S1: Dự án sản xuất (sx-du-an.js). */
    if (parts[0] === 'du-an') return window.SxDuAn.route(parts.slice(1));
    /* T71 S2: Việc của tôi, xử lý việc (sx-flow.js). */
    if (parts[0] === 'viec-cua-toi' || parts[0] === 'viec') return window.SxFlow.route(parts);
    /* T71 S3: Hồ sơ chuyển giao, Sản phẩm sẵn sàng sản xuất (sx-chuyen-giao.js). */
    if (parts[0] === 'chuyen-giao' || parts[0] === 'san-pham') return window.SxCg.route(parts);
    const path = 'sx/' + parts.join('/');
    const m = find(activePath(path)) || { item: { label: 'Quản lý sản xuất', notes: ['Đường dẫn chưa có trong phân hệ.'] }, group: null };
    const item = Object.assign({}, m.item, { product: D.sxProduct, ph: 'Quản lý sản xuất', notes: (m.item.notes || []).concat(['Phân hệ Quản lý sản xuất — plan T71, D-121; điểm chung P-237, P-243.']) });
    return window.Screens.phanHe(item, null);
  }

  /* Gọi khi đổi route (app.js render): chuẩn bị form của màn sắp mở. */
  function enter(parts) { if (parts[0] === 'sx') { window.SxDuAn.enter(parts.slice(1)); window.SxFlow.enter(parts.slice(1)); if (window.SxCg) window.SxCg.enter(parts.slice(1)); } }

  window.Sx = { route, activePath, find, enter };
})();
