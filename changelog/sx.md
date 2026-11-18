# Nhật ký — Quản lý sản xuất (`sx`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-18 · Bỏ menu Việc của tôi, thêm biểu đồ Dashboard
- Bỏ mục menu "Việc của tôi" khỏi nhóm Quản lý nhiệm vụ (`js/sx-data.js`); route `#/sx/viec-cua-toi` và màn xử lý việc giữ nguyên, vẫn mở được từ Gợi ý cho bạn.
- Dashboard (`js/sx-bao-cao.js`): thêm khối Biểu đồ — tiến độ dự án (thực hiện so với kế hoạch), dự án theo trạng thái, phiếu bất thường theo trạng thái, thay đổi kỹ thuật theo trạng thái, KPI quy trình so với mục tiêu.
- Dashboard: khối Số dự án đổi thành 2 biểu đồ tròn (dự án theo trạng thái, dự án đang thực hiện theo tiến độ); bỏ khối Gợi ý cho bạn và biểu đồ cột trùng trạng thái.
- Việc cá nhân (`js/sx-cong-viec.js`): bỏ nút Nhập Excel và Thêm mới, giữ Xuất Excel; Nhiệm vụ đơn vị giữ nguyên.
- Danh sách dự án (`js/sx-du-an.js`): thêm hàng ô tổng hợp số lượng theo trạng thái và có mốc chậm, bấm để lọc nhanh như Nhiệm vụ đơn vị.
