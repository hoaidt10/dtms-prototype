# Nhật ký — Quản lý sản xuất (`sx`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-18 · Bỏ menu Việc của tôi, thêm biểu đồ Dashboard
- Bỏ mục menu "Việc của tôi" khỏi nhóm Quản lý nhiệm vụ (`js/sx-data.js`); route `#/sx/viec-cua-toi` và màn xử lý việc giữ nguyên, vẫn mở được từ Gợi ý cho bạn.
- Dashboard (`js/sx-bao-cao.js`): thêm khối Biểu đồ — tiến độ dự án (thực hiện so với kế hoạch), dự án theo trạng thái, phiếu bất thường theo trạng thái, thay đổi kỹ thuật theo trạng thái, KPI quy trình so với mục tiêu.
- Dashboard: khối Số dự án đổi thành 2 biểu đồ tròn (dự án theo trạng thái, dự án đang thực hiện theo tiến độ); bỏ khối Gợi ý cho bạn và biểu đồ cột trùng trạng thái.
- Việc cá nhân (`js/sx-cong-viec.js`): bỏ nút Nhập Excel và Thêm mới, giữ Xuất Excel; Nhiệm vụ đơn vị giữ nguyên.
- Danh sách dự án (`js/sx-du-an.js`): thêm hàng ô tổng hợp số lượng theo trạng thái và có mốc chậm, bấm để lọc nhanh như Nhiệm vụ đơn vị.

## 2026-11-18 · Quản lý bất thường, Dashboard lọc theo năm
- Dashboard: thêm bộ lọc Năm (dự án có thời gian thực hiện giao với năm chọn), áp cho mọi chỉ số, biểu đồ và Báo cáo dùng chung bộ lọc.
- Danh sách bất thường (`js/sx-bat-thuong.js`): thêm cột Ngày xử lý, Mã SP, Serial, Nhóm nguyên nhân, Mã TĐKT liên kết; tìm kiếm nâng cao thêm Mã SP, Serial, Nhóm nguyên nhân, Mã TĐKT liên kết.
- Thêm mới bất thường (`js/eforms/sx-bt.js`, form lap): bổ sung thông tin sản phẩm (tên, mã, khách hàng, đơn vị sản xuất, serial, cỡ mẫu → tự tính % lỗi), Thời gian xảy ra lỗi dạng Ngày + Giờ, Nơi phát hiện / Công đoạn / Ca sản xuất / Đơn vị tính từ danh mục, Số hiệu thao tác, Yêu cầu kỹ thuật vi phạm, Loại và Mức độ (Rất nghiêm trọng, Nghiêm trọng, Trung bình, Thấp), bảng Đối sách tức thời (thêm, xoá dòng; người thực hiện dạng dropdown tìm kiếm), Phân tích sơ bộ và xác nhận hiện trường (7 nhóm nguyên nhân, nhân sự kiểm tra, nhân sự tham gia), tài liệu tách Ảnh / video lỗi và Tài liệu liên quan.
- Danh mục mới (`js/sx-data.js`): Nơi phát hiện, Đơn vị tính số lượng, Công đoạn sản xuất, Ca sản xuất, Nhóm nguyên nhân bất thường; mức độ 4 đổi tên Thấp.
- File dùng chung: `js/eform-run.js` thêm `properties.rowNo` cho bảng lặp (hiện TT 1, 2, 3 trên mỗi dòng).
