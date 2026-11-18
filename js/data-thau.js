/* Dữ liệu MỚI của phân hệ Thầu (MS18, MS19) (`thau`) — T77 S3 (D-129). BA của phân hệ sửa tệp này, không thêm vào js/data.js.
   Nạp ngay sau data.js / sx-data.js (index.html), trước flow.js và các màn: đọc / bổ sung window.D được.
   Mẫu:
     D.menu.find((g) => g.label === "<nhóm menu>").children.push({ label: "<mục mới>", path: "<route>" });
     D.openPoints["P-THAU-01"] = { scr: "SCR-…", q: "<câu hỏi>", def: "GIẢ LẬP …" };
   Màn mới đăng ký route ở tệp màn của phân hệ: (window.AppRoutes = window.AppRoutes || []).push({ match, active, render }) — xem js/app.js. */
(function () {
  const D = window.D; // eslint-disable-line no-unused-vars
})();
