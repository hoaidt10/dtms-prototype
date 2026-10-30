/* SCR-101 Danh sách Phân hệ (#/phan-he) — D-42 (team BA 30/10/2026): Danh mục dùng chung là phân hệ của toàn hệ thống, không nằm trong menu ĐTMS.
   Khuôn fe/repo-khcn-core-fe/src/app/features/subsystem-list. Brand trên topbar là đường về màn này, như vht-topbar. */
(function () {
  const { esc, icon, infoBtn } = window.UI;
  const KEY = 'vht-subsystem-view-mode';
  let view = 'GRID';
  try { view = localStorage.getItem(KEY) === 'TABLE' ? 'TABLE' : 'GRID'; } catch (e) { /* bỏ qua */ }

  /* Theo SUBSYSTEMS (subsystem.constants.ts). Phân hệ ngoài ĐTMS / DMDC mở trang Đang phát triển; COMING_SOON khoá nút. */
  const SUBSYSTEMS = [
    { key: 'iam', name: 'Người dùng tập trung', description: 'Quản lý người dùng, đơn vị, vai trò và phân quyền truy cập', path: 'ph/he-iam', icon: 'phan_he_iam', color: '#6847BF', bg: '#EDE9FE' },
    { key: 'common-catalog', name: 'Danh mục dùng chung', description: 'Quản lý và chuẩn hoá các danh mục dùng chung trên toàn hệ thống', path: 'dmdc', icon: 'danh_muc_dung_chung', color: '#008E50', bg: '#D1FAE5' },
    { key: 'process-management', name: 'Quản trị khoa học công nghệ', description: 'Quản lý toàn trình nhiệm vụ KHCN từ chủ trương đến nghiệm thu, quyết toán', path: 'ph/he-khcn', icon: 'phan_he_quy_trinh', color: '#EE0033', bg: '#FCE7F3' },
    { key: 'labour-cost', name: 'Quản lý nhân công', description: 'Quản lý nhân sự, chấm công, phân bổ nguồn lực và bảng lương', path: 'ph/he-nhan-cong', icon: 'vai_tro_thuc_hien', color: '#DBA000', bg: '#FFEDD5' },
    { key: 'procurement', name: 'Đầu tư mua sắm', description: 'Quản lý toàn trình đề xuất, thẩm định, phê duyệt và thực hiện đầu tư mua sắm', path: 'viec-cua-toi', icon: 'phan_he_mua_sam', color: '#6F8DE3', bg: '#E0E7FF' },
    { key: 'project-goods', name: 'Quản lý hàng hóa đề tài dự án', description: 'Kiểm kê, xuất nhập kho và quản lý thiết bị phục vụ nghiên cứu.', icon: 'view_flow', color: '#0F766E', bg: '#CCFBF1' },
  ];
  const ARROW = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const GRID_IC = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>';
  const LIST_IC = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  const enterBtn = (s) => (s.path
    ? `<button type="button" class="ss-enter" data-go="${s.path}" data-ss="${s.key}">Truy cập ${ARROW}</button>`
    : `<button type="button" class="ss-enter off" data-ss="${s.key}" disabled>Truy cập</button>`);
  const tile = (s, cls) => `<span class="${cls}" style="background:${s.bg};color:${s.color}">${icon(s.icon)}</span>`;

  function page() {
    // Theo: fe/repo-khcn-core-fe/src/app/features/subsystem-list/subsystem-list.component.html
    const info = {
      scr: 'SCR-101', name: 'Danh sách Phân hệ', uc: 'Yêu cầu team BA 30/10/2026 (D-42)',
      notes: [
        'Khuôn subsystem-list của core-fe: thẻ / bảng (nhớ lựa chọn trong trình duyệt), tiêu đề và nhãn theo source. Thật: danh sách lọc theo module người dùng được cấp (<code>/users/me/modules</code>); prototype hiện đủ 6 phân hệ.',
        '<b>Danh mục dùng chung</b> là phân hệ của toàn hệ thống (app ecat, host riêng), không nằm trong menu Đầu tư mua sắm. Từ phân hệ khác về màn này bằng logo trên topbar, như vht-topbar.',
        'Phân hệ ngoài phạm vi prototype mở trang Đang phát triển; "Quản lý hàng hóa đề tài dự án" là COMING_SOON nên khoá nút như source.',
      ],
      q: ['P-112'], src: 'core-fe features/subsystem-list · /subsystem-list',
    };
    return `<div class="ss-page">
      <div class="ss-head"><div><h1>Danh sách Phân hệ${infoBtn(info)}</h1><p>Chọn phân hệ để truy cập vào các module nghiệp vụ của bạn</p></div>
        <div class="ss-view">
          <button type="button" class="${view === 'GRID' ? 'on' : ''}" data-ss-view="GRID" aria-label="Xem dạng thẻ">${GRID_IC}</button>
          <button type="button" class="${view === 'TABLE' ? 'on' : ''}" data-ss-view="TABLE" aria-label="Xem dạng bảng">${LIST_IC}</button></div></div>
      ${view === 'GRID'
    ? `<div class="ss-grid">${SUBSYSTEMS.map((s) => `<article class="ss-card"><div class="up">${tile(s, 'ss-ic')}<h2>${esc(s.name)}</h2><p>${esc(s.description)}</p></div>
          <div class="low"><div class="rule"></div><div class="act">${enterBtn(s)}</div></div></article>`).join('')}</div>`
    : `<div class="ss-tw"><table class="ss-table"><thead><tr><th style="width:464px">Phân hệ</th><th style="width:539px">Mô tả</th><th style="width:184px">Hành động</th></tr></thead>
          <tbody>${SUBSYSTEMS.map((s) => `<tr><td><span class="nm">${tile(s, 'ss-ic sm')}<span>${esc(s.name)}</span></span></td><td>${esc(s.description)}</td><td>${enterBtn(s)}</td></tr>`).join('')}</tbody></table></div>`}
    </div>`;
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ss-view]');
    if (!b) return;
    view = b.dataset.ssView;
    try { localStorage.setItem(KEY, view); } catch (err) { /* bỏ qua */ }
    window.App.render();
  });

  window.PhanHe = { page };
})();
