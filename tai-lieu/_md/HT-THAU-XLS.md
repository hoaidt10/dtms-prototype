<!-- pk-source: 02. VHT gửi/Thầu 161126/[HT cũ] Thầu.xlsx -->
<!-- pk-sha256: e8e94471122c4ce47070d6b4d4fa30fe8302588ace8adf64a88a6920a0ef6831 -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# HT-THAU-XLS — bản đọc máy sinh

> Nguồn: `project-knowledge/02. VHT gửi/Thầu 161126/[HT cũ] Thầu.xlsx`. Trích dẫn thì ghi mã **HT-THAU-XLS** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.


## Sheet: 01_Cấu trúc màn hình

| Mã mục | Cấp | Loại đầu mục | Tên đầu mục | Màn hình | Chức năng | Nhóm chức năng | Tab/Mục |
|---|---|---|---|---|---|---|---|
| 1 | 1.0 | Màn hình | Màn hình danh sách | Màn hình danh sách |  |  |  |
| 1.1 | 2.0 | Chức năng | Tìm kiếm | Màn hình danh sách | Tìm kiếm |  |  |
| 1.2 | 2.0 | Chức năng | Thêm | Màn hình danh sách | Thêm |  |  |
| 1.3 | 2.0 | Chức năng | Sửa | Màn hình danh sách | Sửa |  |  |
| 1.3.1 | 3.0 | Nhóm chức năng | Sửa tổng quan | Màn hình danh sách | Sửa | Sửa tổng quan |  |
| 1.3.2 | 3.0 | Nhóm chức năng | Sửa chi tiết | Màn hình danh sách | Sửa | Sửa chi tiết |  |
| 1.3.2.1 | 4.0 | Tab/Mục | Tab thông tin chung | Màn hình danh sách | Sửa | Sửa chi tiết | Tab thông tin chung |
| 1.3.2.2 | 4.0 | Tab/Mục | Tab thông tin checklist | Màn hình danh sách | Sửa | Sửa chi tiết | Tab thông tin checklist |
| 1.3.2.3 | 4.0 | Tab/Mục | Tab gói thầu | Màn hình danh sách | Sửa | Sửa chi tiết | Tab gói thầu |
| 1.3.2.4 | 4.0 | Tab/Mục | Thêm/sửa gói thầu | Màn hình danh sách | Sửa | Sửa chi tiết | Thêm/sửa gói thầu |
| 1.3.2.5 | 4.0 | Tab/Mục | Tab Tờ trình kế hoạch lựa chọn nhà thầu | Màn hình danh sách | Sửa | Sửa chi tiết | Tab Tờ trình kế hoạch lựa chọn nhà thầu |
| 1.3.2.6 | 4.0 | Tab/Mục | Tab Thẩm định kế hoạch lựa chọn nhà thầu | Màn hình danh sách | Sửa | Sửa chi tiết | Tab Thẩm định kế hoạch lựa chọn nhà thầu |
| 1.3.2.7 | 4.0 | Tab/Mục | Tab Cam kết tổ thẩm định | Màn hình danh sách | Sửa | Sửa chi tiết | Tab Cam kết tổ thẩm định |
| 1.3.2.8 | 4.0 | Tab/Mục | Tab Quyết định KHLCNT | Màn hình danh sách | Sửa | Sửa chi tiết | Tab Quyết định KHLCNT |
| 1.3.2.9 | 4.0 | Tab/Mục | Tab Phiếu trình GQCV | Màn hình danh sách | Sửa | Sửa chi tiết | Tab Phiếu trình GQCV |


## Sheet: 02_Chi tiết trường dữ liệu

| STT | Mã mục nguồn | Màn hình | Chức năng | Nhóm chức năng | Tab/Mục | Tên trường | Loại dữ liệu | Giá trị lựa chọn / Nội dung | Ràng buộc / Trạng thái |
|---|---|---|---|---|---|---|---|---|---|
| 1.0 | 1.1 | Màn hình danh sách | Tìm kiếm |  |  | Quy chế áp dụng | Single dropdown | Tất cả, Theo luật, Mua sắm thường xuyên |  |
| 2.0 | 1.1 |  |  |  |  | Cấp phê duyệt | Single dropdown | Tất cả, Tổng Công ty, Tập đoàn |  |
| 3.0 | 1.1 |  |  |  |  | Dự án/Đề tài | Single dropdown |  |  |
| 4.0 | 1.1 |  |  |  |  | Nguồn vốn | Single dropdown | Đầu tư phát triển, Chi phí Sản xuất kinh doanh, Quỹ phát triển khoa học công nghệ, Vốn góp của chủ sở hữu |  |
| 5.0 | 1.1 |  |  |  |  | Người phụ trách | Multiple dropdown |  |  |
| 6.0 | 1.1 |  |  |  |  | Ngày QĐ KHLCNT | Date range picker |  |  |
| 7.0 | 1.1 |  |  |  |  | Tìm kiếm nhanh | Text input | Tìm theo mã hoặc tên KHLCNT |  |
| 8.0 | 1.2 |  | Thêm |  |  | Tên KHLCNT | Text input |  |  |
| 9.0 | 1.2 |  |  |  |  | Quy chế áp dụng | Single dropdown | Mua sắm thường xuyên, Theo luật |  |
| 10.0 | 1.2 |  |  |  |  | Cấp phê duyệt KHLCNT | Single dropdown | Tổng công ty, Tập đoàn |  |
| 11.0 | 1.2 |  |  |  |  | Người phụ trách | Multiple dropdown |  |  |
| 12.0 | 1.2 |  |  |  |  | Người soạn thảo | Multiple dropdown |  |  |
| 13.0 | 1.3.1 |  | Sửa | Sửa tổng quan |  | Tên KHLCNT | Text input |  |  |
| 14.0 | 1.3.1.1 |  |  |  |  | Quy chế áp dụng | Single dropdown | Mua sắm thường xuyên, Theo luật | Không cho sửa |
| 15.0 | 1.3.1.2 |  |  |  |  | Cấp phê duyệt KHLCNT | Single dropdown | Tổng công ty, Tập đoàn |  |
| 16.0 | 1.3.1.3 |  |  |  |  | Người phụ trách | Multiple dropdown |  |  |
| 17.0 | 1.3.1.4 |  |  |  |  | Người soạn thảo | Multiple dropdown |  |  |
| 18.0 | 1.3.2.1 |  |  | Sửa chi tiết | Tab thông tin chung | Tên KHLCNT | Text input |  |  |
| 19.0 | 1.3.2.1 |  |  |  |  | Quy chế áp dụng | Single dropdown | Mua sắm thường xuyên, Theo luật | Không cho sửa |
| 20.0 | 1.3.2.1 |  |  |  |  | Cấp phê duyệt KHLCNT | Single dropdown | Tổng công ty, Tập đoàn |  |
| 21.0 | 1.3.2.1 |  |  |  |  | Người phụ trách | Multiple dropdown |  |  |
| 22.0 | 1.3.2.1 |  |  |  |  | Người soạn thảo | Multiple dropdown |  |  |
| 23.0 | 1.3.2.2 |  |  |  | Tab thông tin checklist | Bảng checklist | Table | STT, Nội dung, Ngày văn bản, Số văn bản, Ngày soạn thảo, Upload, File |  |
| 24.0 | 1.3.2.2 |  |  |  |  | Nội dung checklist | Danh mục cố định | TTr KHLCNT, BC thẩm định KHLCNT, QĐ phê duyệt KHLCNT, Đăng tải KHLCNT, Nhận xét của Ban Đầu tư XD, Phiếu trình GQCV, Mã KHLCNT trên SAP |  |
| 25.0 | 1.3.2.2 |  |  |  |  | Ngày văn bản | Date picker |  |  |
| 26.0 | 1.3.2.2 |  |  |  |  | Số văn bản | Text input |  |  |
| 27.0 | 1.3.2.2 |  |  |  |  | Ngày soạn thảo | Datetime display | dd/mm/yyyy hh:mm:ss | Không chỉnh sửa |
| 28.0 | 1.3.2.2 |  |  |  |  | Upload | File upload |  |  |
| 29.0 | 1.3.2.2 |  |  |  |  | File | File display | Hiển thị file đã upload |  |
| 30.0 | 1.3.2.3 |  |  |  | Tab gói thầu | Bảng danh sách gói thầu | Table | STT, Số gói thầu, Tên gói thầu, Giá gói thầu (VNĐ), Phương thức lựa LCNT, Hình thức LCNT, Thời gian thực hiện HĐ, Trạng thái |  |
| 31.0 | 1.3.2.3 |  |  |  |  | Footer tổng giá trị gói thầu | Footer / Tổng hợp | Tổng - Tổng số tiền các gói thầu về mặt số và mặt chữ |  |
| 32.0 | 1.3.2.4 |  |  |  | Thêm/sửa gói thầu | Nút đặt lại | Button |  |  |
| 33.0 | 1.3.2.4 |  |  |  |  | Tên gói thầu | Text input |  |  |
| 34.0 | 1.3.2.4 |  |  |  |  | Số gói thầu | Text input |  |  |
| 35.0 | 1.3.2.4 |  |  |  |  | Trạng thái | Single dropdown | Chuyển ký HĐ, Chấm thầu, Draft KHLCNT, Hủy thầu, Không thực hiện, Lập HSMT, Lập KHLCNT, Phát thầu, Trình KQ LCNT. |  |
| 36.0 | 1.3.2.4 |  |  |  |  | Tóm tắt CV chính của gói thầu | Text area |  |  |
| 37.0 | 1.3.2.4 |  |  |  |  | Ký hợp đồng | Single dropdown | Có, không |  |
| 38.0 | 1.3.2.4 |  |  |  |  | Mật/không mật | Single dropdown | Mật, không mật |  |
| 39.0 | 1.3.2.4 |  |  |  |  | Người phụ trách | Multiple dropdown |  |  |
| 40.0 | 1.3.2.4 |  |  |  |  | Giá gói thầu (sau thuế) | Number input |  |  |
| 41.0 | 1.3.2.4 |  |  |  |  | Đơn vị tiền tệ | Single dropdown | VND, USD, EUR |  |
| 42.0 | 1.3.2.4 |  |  |  |  | Tỷ giá | Number input |  |  |
| 43.0 | 1.3.2.4 |  |  |  |  | Dự toán gói thầu | Number input |  |  |
| 44.0 | 1.3.2.4 |  |  |  |  | Đơn vị tiền tệ | Single dropdown | VND, USD, EUR |  |
| 45.0 | 1.3.2.4 |  |  |  |  | Tỷ giá dự doán | Number input |  |  |
| 46.0 | 1.3.2.4 |  |  |  |  | TTr kinh phí | Single dropdown | Danh sách tờ trình ĐXMS, KĐT, DADT |  |
| 47.0 | 1.3.2.4 |  |  |  |  | Khoản mục chi phí | Section / Label |  |  |
| 48.0 | 1.3.2.4 |  |  |  |  | Bảng thông tin TTr kinh phí | Table | STT, Hành động, Số TTr, Tên TTr, Tên dự án/đề tài, Loại chi phí, Khoản mục chi phí |  |
| 49.0 | 1.3.2.4 |  |  |  |  | Dự án/Đề tài | Single dropdown + Button | Danh sách dự án/đề tài |  |
| 50.0 | 1.3.2.4 |  |  |  |  | Bảng thông tin dự án/đề tài | Table | STT, Hành động, Mã dự án/đề tài, Tên dự án/đề tài, Nguồn vốn, Giá trị phân bổ, footer tổng. |  |
| 51.0 | 1.3.2.4 |  |  |  |  | Phạm vi cung cấp gói thầu | Single dropdown | Có chia phần, Không chia phần |  |
| 52.0 | 1.3.2.4 |  |  |  |  | Đơn vị sử dụng | Single dropdown |  |  |
| 53.0 | 1.3.2.4 |  |  |  |  | Đơn vị giám sát | Thông tin/Label |  |  |
| 54.0 | 1.3.2.4 |  |  |  |  | Hình thức LCNT | Single dropdown | Danh sách hình thức LCNT |  |
| 55.0 | 1.3.2.4 |  |  |  |  | Phương thức LCNT | Single dropdown | Danh sách phương thức LCNT |  |
| 56.0 | 1.3.2.4 |  |  |  |  | LCNT trong nước/quốc tế | Single dropdown | Trong nước, quốc tế |  |
| 57.0 | 1.3.2.4 |  |  |  |  | Sơ tuyển/không sơ tuyển | Single dropdown | Sơ tuyển, không sơ tuyển |  |
| 58.0 | 1.3.2.4 |  |  |  |  | LCNT qua mạng/không qua mạng | Single dropdown | Qua mạng, không qua mạng |  |
| 59.0 | 1.3.2.4 |  |  |  |  | Áp dụng danh sách ngắn | Single dropdown | Có, không |  |
| 60.0 | 1.3.2.4 |  |  |  |  | Lĩnh vực | Single dropdown |  |  |
| 61.0 | 1.3.2.4 |  |  |  |  | Loại hợp đồng | Single dropdown | Trọn gói, Theo đơn giá cố định, Theo đơn giá điều chỉnh, Theo thời gian, Trọn gói và Theo đơn giá cố định, Trọn gói và theo đơn giá điều chỉnh, Theo đơn giá cố định và Theo đơn giá điều chỉnh, Theo chi phí cộng phí, Thỏa thuận khung, Theo kết quả đầu ra, Theo tỉ lệ phần trăm, Hỗn hợp. |  |
| 62.0 | 1.3.2.4 |  |  |  |  | Thời gian bắt đầu LCNT | Single dropdown + Year input | Tháng, quý | Nếu chọn tháng, cho phép nhập số 1 → 12, nếu chọn quý cho phép chọn single dropdown từ I → IV; cả 2 cho phép chọn năm. |
| 63.0 | 1.3.2.4 |  |  |  |  | Thời gian thực hiện HĐ theo KHLCNT | Number input + Single dropdown | Ngày, tuần, tháng, quý, năm |  |
| 64.0 | 1.3.2.4 |  |  |  |  | Thời gian thực hiện gói thầu | Number input + Single dropdown | Ngày, tuần, tháng, quý, năm |  |
| 65.0 | 1.3.2.4 |  |  |  |  | Thời gian tổ chức LCNT | Text area |  |  |
| 66.0 | 1.3.2.4 |  |  |  |  | Chủ đầu tư | Text input |  |  |
| 67.0 | 1.3.2.4 |  |  |  |  | Bên mời thầu | Text input |  |  |
| 68.0 | 1.3.2.4 |  |  |  |  | Chủ tịch hội đồng đầu tư | Single dropdown |  |  |
| 69.0 | 1.3.2.4 |  |  |  |  | Người có thẩm quyền | Single dropdown |  |  |
| 70.0 | 1.3.2.4 |  |  |  |  | Tên hội đồng đầu tư | Single dropdown |  |  |
| 71.0 | 1.3.2.5 |  |  |  | Tab Tờ trình kế hoạch lựa chọn nhà thầu | Danh sách thành viên tổ thẩm định | Multiple dropdown |  |  |
| 72.0 | 1.3.2.5 |  |  |  |  | Bảng danh sách thành viên tổ thẩm định | Table | Họ và tên, Vai trò trong TTĐ, Phân công công việc. |  |
| 73.0 | 1.3.2.5 |  |  |  |  | Vai trò trong TTĐ | Single dropdown |  |  |
| 74.0 | 1.3.2.5 |  |  |  |  | Phân công công việc | Text input |  |  |
| 75.0 | 1.3.2.5 |  |  |  |  | Tên hội đồng đầu tư | Single dropdown |  |  |
| 76.0 | 1.3.2.5 |  |  |  |  | Thành viên, chức vụ tổ thẩm định | Text area |  |  |
| 77.0 | 1.3.2.5 |  |  |  |  | Căn cứ TTr KHLCNT | Text area |  |  |
| 78.0 | 1.3.2.5 |  |  |  |  | Mô tả đề tài/dự án | Text area |  |  |
| 79.0 | 1.3.2.5 |  |  |  |  | Công việc đã thực hiện SXKD | Text area |  |  |
| 80.0 | 1.3.2.5 |  |  |  |  | Tổng giá trị công việc đã thực hiện SXKD | Number input |  |  |
| 81.0 | 1.3.2.5 |  |  |  |  | Cơ sở phân chia các gói thầu | Text area |  |  |
| 82.0 | 1.3.2.5 |  |  |  |  | Giải trình giá gói thầu | Text area |  |  |
| 83.0 | 1.3.2.5 |  |  |  |  | Giải trình nguồn vốn | Text area |  |  |
| 84.0 | 1.3.2.5 |  |  |  |  | Giải trình hình thức LCNT | Text area |  |  |
| 85.0 | 1.3.2.5 |  |  |  |  | Giải trình phương thức LCNT | Text area |  |  |
| 86.0 | 1.3.2.5 |  |  |  |  | Giải trình thời gian bắt đầu tổ chức LCNT | Text area |  |  |
| 87.0 | 1.3.2.5 |  |  |  |  | Giải thình thời gian LCNT | Text area |  |  |
| 88.0 | 1.3.2.5 |  |  |  |  | Giải trình thời gian thực hiện gói thầu | Text area |  |  |
| 89.0 | 1.3.2.5 |  |  |  |  | Giải trình loại hợp đồng | Text area |  |  |
| 90.0 | 1.3.2.5 |  |  |  |  | Công việc không áp dụng KHLCNT SXKD | Text area |  |  |
| 91.0 | 1.3.2.5 |  |  |  |  | Tổng công việc không áp dụng KHLCNT SXKD | Text area |  |  |
| 92.0 | 1.3.2.5 |  |  |  |  | Tổng giá trị công việc không áp dụng KHLCNT SXKD | Number input |  |  |
| 93.0 | 1.3.2.5 |  |  |  |  | Công việc chưa đủ điều kiện lập KHCLNT SXKD | Text area |  |  |
| 94.0 | 1.3.2.5 |  |  |  |  | Tổng giá trị công việc chưa đủ điều kiện lập KHCLNT SXKD | Text area |  |  |
| 95.0 | 1.3.2.5 |  |  |  |  | Văn bản kèm theo | Text area |  |  |
| 96.0 | 1.3.2.5 |  |  |  |  | Chi tiết danh mục mua sắp thuộc gói thầu | Text area |  |  |
| 97.0 | 1.3.2.5 |  |  |  |  | Hành động | Radio button | Ghi lại/Xuất file Word/Xuất file PDF |  |
| 98.0 | 1.3.2.5 |  |  |  |  | Export | Button |  |  |
| 99.0 | 1.3.2.5 |  |  |  |  | Hủy | Button |  |  |
| 100.0 | 1.3.2.6 |  |  |  | Tab Thẩm định kế hoạch lựa chọn nhà thầu | Hành động | Radio button | Xuất file Word/Xuất file PDF |  |
| 101.0 | 1.3.2.6 |  |  |  |  | Export | Button |  |  |
| 102.0 | 1.3.2.6 |  |  |  |  | Hủy | Button |  |  |
| 103.0 | 1.3.2.7 |  |  |  | Tab Cam kết tổ thẩm định | Họ và tên | Text input |  |  |
| 104.0 | 1.3.2.7 |  |  |  |  | Địa chỉ | Text input |  |  |
| 105.0 | 1.3.2.7 |  |  |  |  | Số CMND/CCCD | Number input |  |  |
| 106.0 | 1.3.2.7 |  |  |  |  | Ngày cấp | Date picker |  |  |
| 107.0 | 1.3.2.7 |  |  |  |  | Nơi cấp | Text input |  |  |
| 108.0 | 1.3.2.7 |  |  |  |  | Hành động | Radio button | Xuất file Word/Xuất file PDF |  |
| 109.0 | 1.3.2.7 |  |  |  |  | Submit | Button |  |  |
| 110.0 | 1.3.2.8 |  |  |  | Tab Quyết định KHLCNT | Hành động | Radio button | Xuất file Word/Xuất file PDF |  |
| 111.0 | 1.3.2.8 |  |  |  |  | Export | Button |  |  |
| 112.0 | 1.3.2.8 |  |  |  |  | Hủy | Button |  |  |
| 113.0 | 1.3.2.9 |  |  |  | Tab Phiếu trình GQCV | Mục đích | Text area |  |  |
| 114.0 | 1.3.2.9 |  |  |  |  | Lý do lựa chọn hình thức đấu thầu | Text area |  |  |
| 115.0 | 1.3.2.9 |  |  |  |  | Ý kiến giải trình | Text area |  |  |
| 116.0 | 1.3.2.9 |  |  |  |  | Hành động | Radio button | Xuất file Word/Xuất file PDF |  |
