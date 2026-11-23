# Nhật ký — Quản lý sản xuất (`sx`)

> Mỗi PR một mục, mới nhất trên cùng: `## 2026-11-23 · COP2 B1: Tiếp nhận nhiệm vụ, hoàn thiện đầu vào (B1.1–B1.4)
- Màn mới SX-22 `#/sx/dau-vao` (menu "Tiếp nhận nhiệm vụ, đầu vào"): KPI Đang chuẩn bị / Sẵn sàng chốt / Đã chốt, % đủ căn cứ theo 4 nội dung của từng dự án.
- Chi tiết dự án thêm tab **Đầu vào (B1)** (`js/sx-dau-vao.js`): B1.1 giao đầu vào (người cung cấp, nguồn, hạn, trạng thái, quá hạn); B1.2 tiếp nhận hồ sơ theo cấu hình × lô (chặn "Tiếp nhận đủ" khi thiếu BOM/HSKT/định mức/chỉ tiêu hoặc lệch phiên bản); B1.3 phạm vi VHT/VMC/thuê ngoài, chỉ chốt khi có đầu mối + điều kiện bàn giao; B1.4 chi phí có căn cứ giá, hiệu lực, leadtime dài, chênh lệch so với PAKD.
- Cổng "Chốt đầu vào" chỉ bật khi đủ 4 nội dung; cảnh báo đầu trang dự án đang Lập kế hoạch. Nguồn: CDS-BT-03COP tr. 84–85.
- Q-SX-01: cổng có chặn cứng nút Khởi tạo phê duyệt kế hoạch hay chỉ cảnh báo (prototype: chỉ cảnh báo).

## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-23 · Luồng Nhiệm vụ → Phương án sản xuất kinh doanh → Dự án
- Menu "Tiếp nhận nhiệm vụ, đầu vào" đổi thành **Phương án sản xuất kinh doanh** (`js/sx-pasxkd.js`, thay `sx-dau-vao.js`): danh sách (KPI theo trạng thái), chi tiết (Thông tin chung · Hoàn thiện đầu vào B1.1–B1.4 · Lịch sử), lập từ nhiệm vụ đơn vị, Trình (chỉ khi đủ 4 nội dung), Ban Giám đốc Khối Phê duyệt / Trả lại (lý do), nút Lập dự án sản xuất.
- Bỏ tab Đầu vào (B1) và cảnh báo ở Chi tiết dự án — giữ nguyên các tab cũ.
- Thêm mới dự án: căn cứ cố định PASXKD, chỉ chọn PASXKD **Đã phê duyệt** chưa lập dự án; điền sẵn mô hình tổ chức, giám đốc dự án, ngày bắt đầu; lưu xong gắn dự án vào nhiệm vụ. Văn bản căn cứ ở Chi tiết dự án mở PASXKD.
- Nhiệm vụ đơn vị: không bắt buộc Dự án (nhiệm vụ giao trước khi có dự án); chi tiết có nút Lập phương án SXKD và liên kết PASXKD; thêm 4 nhiệm vụ mẫu NV-SX-2026-005…008.

## 2026-11-19 · Đề xuất mua sắm: cột Dự án
- Danh sách Đề xuất mua sắm (phân hệ Sản xuất): cột Đề tài / dự án đổi thành Dự án, hiện mã — tên dự án sản xuất; bộ lọc nâng cao theo Dự án (`js/luong.js`, chỉ ở chế độ Sản xuất).

## 2026-11-19 · Thay đổi kỹ thuật: bỏ Thêm mới (đồng bộ từ KHCN); bất thường: khoảng cách khối
- Thay đổi kỹ thuật (`js/sx-thay-doi.js`): bỏ Thêm mới ở danh sách, bỏ Thêm mới ECR ở tab dự án và nút Mở yêu cầu thay đổi kỹ thuật ở phiếu bất thường Loại 2; dữ liệu đồng bộ từ phân hệ KHCN.
- Bất thường › Phân tích và xử lý: các khối cách nhau 20px như màn khác.

## 2026-11-19 · Bất thường: phiếu Lưu nháp (Xóa, Sửa), Chỉnh sửa tab Phân tích và xử lý
- Thêm trạng thái Lưu nháp: nút Lưu nháp ở form Thêm mới giờ lưu phiếu nháp; chi tiết phiếu nháp có Xóa, Sửa (Sửa mở lại form, Xác nhận thì gửi phiếu vào luồng). Dữ liệu mẫu BT-2026-005.
- Tab Phân tích và xử lý: nút Chỉnh sửa chỉ hiện khi phiếu Đang xử lý (không hiện khi Đã đóng hoặc trạng thái khác); 4 khối thẻ như các màn khác, bỏ chữ Khối 1–4.

## 2026-11-19 · Bất thường: form Thêm mới; Dự án: Kế hoạch 11–15, OQC, Nghiệm thu
- Thêm mới phiếu bất thường: bỏ bắt buộc BM.QLBT.01; Các tài liệu liên quan = tải nhiều tệp, có nút xoá tệp chọn nhầm (eform-run: filepicker `accumulate`); Thời gian xảy ra lỗi = một ô ngày giờ (datetime `withTime`).
- Dự án › Kế hoạch: nút Xem chi tiết thêm mục 11–13 → tab Chất lượng & nghiệm thu, 14 → Nghiệm thu sản phẩm, 15 → tab Tài liệu; route `#/sx/du-an/<mã>/<tab>`.
- Tab Chất lượng & nghiệm thu: thêm khối Đánh giá chất lượng xuất xưởng (OQC) — tự thêm nội dung đánh giá, đạt đủ thì xác nhận hoàn thành, có nội dung không đạt thì liên kết Tạo phiếu bất thường, bảng lưu dữ liệu OQC; đổi Nghiệm thu theo lô thành Nghiệm thu, thêm bảng Thông tin nghiệm thu nhập tay (thêm / sửa / xoá).

## 2026-11-19 · Bất thường: chi tiết phiếu theo BM.QLBT.02
- Tab Thông tin phiếu: thêm khối Thông tin xác nhận của hai bên tại hiện trường (đã có ảnh / video lỗi, hồ sơ đính kèm, đối sách tức thời).
- Tab Phân tích và xử lý: 4 khối — Xác minh & phân tích nguyên nhân (6M+1), Phương án xử lý (số PAXL, cấp duyệt, 2 bảng khắc phục / ngăn ngừa, lịch sử NOK), Triển khai & bàn giao tiền xử lý, Lịch sử nghiệm thu & bài học kinh nghiệm (tag).
- Tab Tiến trình: tách Hạn xử lý (SLA) / Hoàn thành thực tế (`js/sx-flow.js`), chọn phiên bản hồ sơ HSBT-…-01/-02; route `#/sx/bat-thuong/<mã>/<info|xl|tt>`. Dữ liệu mẫu BT-2026-001 có 2 vòng (vòng 1 NOK).

## 2026-11-19 · Dự án sản xuất: Thông tin chung theo BM.QLHDSX.01, tab Kế hoạch
- Tab Kế hoạch & mốc đổi tên Kế hoạch; cột Công việc thay bằng cột Thao tác với nút Xem chi tiết: mục 4 → Đề xuất mua sắm, mục 5 → Hồ sơ chuyển giao, mục 6, 7 → tab Điều kiện sản xuất, mục 9 → tab Bán thành phẩm & tiến độ, mục 10 → tab Chất lượng & nghiệm thu (`js/sx-du-an.js`).
- Thông tin chung thêm theo BM.QLHDSX.01: Số kế hoạch, Ngày phê duyệt, Cấp phê duyệt, Đơn vị lập, Đơn vị phối hợp, Mục tiêu (Objective), OKRs, Yêu cầu, Rủi ro đề xuất (GIẢ LẬP dữ liệu mẫu).

## 2026-11-19 · Nhu cầu vật tư có Danh mục; Đề xuất mua sắm đồng bộ ĐXMS
- Nhu cầu vật tư (`js/sx-nhu-cau.js`): 2 khối — Danh mục vật tư (tổng số theo MBOM × số lượng dự án) và Nhu cầu vật tư (số lượng cần trước ngày cần); cột Mã nhu cầu → Mã đề xuất, bỏ cột Đề xuất mua sắm; dữ liệu mẫu tách 2 đợt, tồn kho trừ dần theo ngày cần.
- Nhu cầu vật tư: Danh mục vật tư chuyển xuống dưới bảng Nhu cầu, phân trang 10 dòng; bảng Nhu cầu xếp Chưa đề xuất / Trễ hạn lên trước.
- Bỏ menu "Gói thầu, hợp đồng" (`js/sx-data.js`); route `#/sx/goi-thau-hd` giữ nguyên.
- Đề xuất mua sắm (`js/sx-mua-sam.js`, `js/luong.js`): danh sách và chi tiết dùng lại nguyên giao diện ĐXMS (7 tab, chỉ ĐXMS nguồn Sản xuất), bỏ Thêm, Sửa, Xóa, Xuất Excel, Điều chỉnh; thêm ĐXMS-2026-0058 / 0066 vào `js/data.js`.

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
