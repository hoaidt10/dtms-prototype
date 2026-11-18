<!-- pk-source: 03. Thiết kế (Tài liệu BA)/IA/[KDT] Information Architecture.xlsx -->
<!-- pk-sha256: 589cb1ba4aae554a00ee5e12938574be755baf0400d8d6fe3221d9960898b4d2 -->
<!-- pk-generated: 2026-11-05 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# IA-DXMS — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/IA/[KDT] Information Architecture.xlsx`. Trích dẫn thì ghi mã **IA-DXMS** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.


## Sheet: UI Component 0.2

|  | STT | Màn hình | Thành phần | Hiện trạng | Mong muốn |
|---|---|---|---|---|---|
|  | 1.0 | Đề tài dự án | Xem danh sách | Chưa có prototype | - Danh sách dạng bảng<br>+ STT<br>+ Hành động<br>+ Loại dự án/đề tài<br>+ Mã dự án/đề tài<br>+ Tên dự án/đề tài<br>+ Đơn vị lập<br>+ Chủ nhiệm<br>+ Nguồn vốn<br>+ Tổng dự toán<br>+ TG bắt đầu<br>+ TG kết thúc<br>+ Số ngày còn thực hiện<br>+ Trạng thái<br>- Xuất Excel<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 2.0 | Đề tài dự án | Tìm kiếm (phần 1) | Chưa có prototype | - Bên duyệt: chọn một<br>- Ngày QĐ đầu tư... đến: chọn ngày<br>- Nguồn vốn: chọn nhiều, cho thêm/xóa lựa chọn<br>+ Đầu tư phát triển<br>+ Chi phí sản xuất kinh doanh<br>+ Quỹ phát triển KHCN<br>+ Vốn góp của chủ sở hữu<br>- Trạng thái<br>+ Đang thực hiện<br>+ Hoàn thành<br>+ Dừng thực hiện<br>- Loại dự án (đề tài): chọn nhiều, cho thêm/xóa lựa chọn<br>+ SXKD<br>+ Dự án đầu tư<br>+ KHCN<br>+ Hoạt động TX<br>+ Dự án đầu tư khác<br>+ Dự án kinh doanh khác<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 3.0 | Đề tài dự án | Tìm kiếm (phần 2) | Chưa có prototype | - Loại dự án (chi tiết): text box, hiển thị theo loại dự án (đề tài) đã chọn<br>+ Thường xuyên<br>+ Chương trình KHCN<br>+ Đề án khoa học<br>+ Dự án KHCN<br>+ Đề tài KHCN<br>+ Dự án SX thử nghiệm<br>+ Nghiên cứu thăm dò<br>+ Hình thức nghiên cứu KHCN khác<br>+ Dự án Kinh doanh<br>+ Dự án sản xuất<br>+ Chương trình nội bộ<br>+ Dự án đầu tư mua sắm tài sản<br>+ Dự án đầu tư xây dựng Kinh doanh thử nghiệm<br>+ Hỗ trợ KHCN<br>- Tìm kiếm<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 4.0 | Đề tài dự án | Thông tin chi tiết (gói thầu và hợp đồng) | Chưa có prototype | - Danh sách các gói thầu<br>- Danh sách các hợp đồng |
|  | 5.0 | Đề tài dự án | Thông tin chi tiết (các trường thông tin) (phần 1) | Chưa có prototype | - Lập theo kế hoạch năm: Có/Không<br>- Loại dự án (đề tài): dropdown<br>+ SXKD<br>+ Dự án đầu tư<br>+ KHCN<br>+ Hoạt động TX<br>+ Dự án đầu tư khác<br>+ Dự án kinh doanh khác<br>- Cấp phê duyệt: chọn một<br>+ Tổng công ty<br>+ Tập đoàn<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 6.0 | Đề tài dự án | Thông tin chi tiết (các trường thông tin) (phần 2) | Chưa có prototype | - Loại dự án (chi tiết): dropdown, hiển thị theo loại dự án (đề tài) đã chọn<br>+ Thường xuyên<br>+ Chương trình KHCN<br>+ Đề án khoa học<br>+ Dự án KHCN<br>+ Đề tài KHCN<br>+ Dự án SX thử nghiệm<br>+ Nghiên cứu thăm dò<br>+ Hình thức nghiên cứu KHCN khác<br>+ Dự án Kinh doanh<br>+ Dự án sản xuất<br>+ Chương trình nội bộ<br>+ Dự án đầu tư mua sắm tài sản<br>+ Dự án đầu tư xây dựng Kinh doanh thử nghiệm<br>+ Hỗ trợ KHCN<br>- Tên dự án: text box<br>- Mã dự án: text box<br>- Nhóm dự án: dropdown<br>- Loại sản phẩm: dropdown<br>- Mã dự án theo KHĐT năm: text box<br>- Mã dự án SAP: text box<br>- ID Dự án trên cổng Đấu thầu QG<br>- Mật/ ko mật: chọn một<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 7.0 | Đề tài dự án | Thông tin chi tiết (các trường thông tin) (phần 3) | Chưa có prototype | - Nguồn vốn: dropdown<br>+ Đầu tư phát triển<br>+ Chi phí sản xuất kinh doanh<br>+ Quỹ phát triển KHCN<br>+ Vốn góp của chủ sở hữu<br>- Số/ ngày TTr chủ trương: chọn ngày<br>- Số/ ngày QĐ phê duyệt dự án: chọn ngày<br>- Số/ ngày QĐ phê duyệt dự toán: chọn ngày<br>- Nội dung, quy mô dự án ( thông tin sản phẩm): text box<br>- Thời gian bắt đầu: chọn ngày<br>- Tổng dự toán DA (VND): ô nhập số<br>- Người phụ trách báo cáo: dropdown<br>- Đơn vị lập dự án: dropdown<br>- Chủ nhiệm dự án: dropdown<br>- Người phê duyệt chủ trương: text box, mặc định Tổng giám đốc<br>- Người phê duyệt dự án: text box, mặc định Tổng giám đốc<br>- Người phê duyệt dự toán: text box<br>- Địa điểm đầu tư: text box<br>- Thời gian kết thúc: chọn ngày<br>- Tổng giá trị ĐTMS (Có VAT): ô nhập số<br>- Người phê duyệt quyết toán: text box<br>- Tình trạng dự án: dropdown<br>- Ngày nghiệm thu: text box<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 8.0 | Đề tài dự án | Chi phí theo dự án | Chưa có prototype | - Danh sách các loại chi phí<br>- Xuất Excel |
|  | 9.0 | Đề tài dự án | Văn bản pháp lí | Chưa có prototype | - Danh sách số văn bản |
|  | 10.0 | Soạn thảo TTr | Tìm kiếm (phần 1) | Chưa có prototype | - Khối đơn vị: chọn nhiều, cho thêm/xóa lựa chọn<br>- Đơn vị đề xuất: chọn nhiều, cho thêm/xóa lựa chọn, tự điền<br>- Người tạo<br>- Ngày tạo<br>- Dự án/ đề tài<br>- Loại biểu mẫu TTr<br>- Nhóm trạng thái TTr<br>+ Các TTr đang trong quá trình thực hiện<br>+ Các TTr không trong quá trình thực hiện<br>+ Tất cả TTr<br>- Trạng thái TTr<br>+ Đang soạn thảo<br>+ Đang thẩm định<br>+ Hoàn thành thẩm định, chờ trình ký<br>+ Hoàn thành thẩm định, chờ sửa<br>+ Đang trình ký<br>+ Từ chối ký duyệt, chờ sửa<br>+ Tiếp tục soạn thảo<br>+ Điều chỉnh TTr<br>+ Đang sửa<br>+ Đã ký duyệt<br>+ Đã hủy<br>+ Tạm dừng thực hiện<br>- Người thẩm định<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 11.0 | Soạn thảo TTr | Tìm kiếm (phần 2) | Chưa có prototype | - Trạng thái với người thẩm định<br>+ Chưa xem<br>+ Đã đồng ý nội dung<br>+ Đã từ chối, yêu cầu sửa lại<br>+ Đang xem<br>- Ngày TTr<br>- Ngày thẩm định<br>- Chi phí năm<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 12.0 | Soạn thảo TTr | Xem danh sách | Chưa có prototype | - Danh sách dạng bảng<br>+ Hành động<br>+ ID<br>+ Tên TTr KP<br>+ Số TTr KP<br>+ Ngày TTr KP<br>+ Kinh phí đề xuất<br>+ Đơn vị đề xuất<br>+ Dự án/Đề tài<br>+ Trạng thái TTr<br>+ Ngày đề xuất thẩm định<br>+ Người tạo<br>+ Ngày tạo<br>+ Ngày kết thúc soạn thảo<br>- Xuất Excel<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 13.0 | Soạn thảo TTr | Thông tin chung tờ trình | Chưa có prototype | - Loại chi phí<br>+ PL1 - Chi phí xây dựng<br>+ PL2 - Chi phí vật tư thiết bị<br>+ PL3 - Chi phí quản lý dự án<br>+ PL4 - Chi phí tư vấn Đầu tư xây dựng<br>+ PL5 - Chi phí khác<br>+ PL6 - Chi phí dự phòng<br>- Khoản mục chi phí<br>- Loại biểu mẫu TTr<br>- Mật/không: chọn một<br>- V/v đề xuất mua sắm: text box<br>- Hình thức trình kí: chọn một<br>+ Voffice<br>+ Bản cứng<br>- Người soạn thảo<br>- Đơn vị đề xuất mua sắm<br>- Danh sách đơn vị duyệt<br>- Cấp phê duyệt: chọn một<br>+ Tổng công ty<br>+ Tập đoàn<br>- Căn cứ pháp lí: text box<br>- Mục tiêu đề xuất mua sắm<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 14.0 | Soạn thảo TTr | Lí do cần thiết phải mua sắm | Chưa có prototype | - Hiện trạng<br>- Nhu cầu<br>- Đánh giá hiện trạng tồn kho hàng hóa<br>- Giải trình, đánh giá sự cần thiết phải mua sắm |
|  | 15.0 | Soạn thảo TTr | Quan điểm thực hiện | Chưa có prototype | - Quan điểm chung<br>- Phương án kĩ thuật - công nghệ, giải pháp triển khai |
|  | 16.0 | Soạn thảo TTr | Nội dung đề xuất mua sắm | Chưa có prototype | - Hạng mục và kinh phí đề xuất<br>- Nguồn vốn thực hiện<br>- Hiệu quả hoặc lợi ích, giá trị mang lại của đề xuất mua sắm |
|  | 17.0 | Soạn thảo TTr | Biện pháp và kế hoạch tổ chức thực hiện | Chưa có prototype | - Kế hoạch triển khai<br>- Thời gian thực hiện dự kiến<br>- Tổ chức thực hiện |
|  | 18.0 | Soạn thảo TTr | Hồ sơ kèm theo và phụ lục | Chưa có prototype | - Danh mục hồ sơ kèm theo<br>- PL DANH MỤC MUA SẮM CHI TIẾT: Có/Không<br>- PL DANH MỤC MUA SẮM CHI TIẾT (VLTK): Có/Không<br>- CHI TIÊU KĨ THUẬT: Có/Không<br>- CẤU TRÚC SẢN PHẨM: Có/Không<br>- DANH MỤC BẢN VẼ: Có/Không<br>- TRÍCH LỤC NGUỒN: Có/Không |
|  | 19.0 | Thẩm định TTr | Tìm kiếm (phần 1) | Chưa có prototype | - Khối đơn vị: chọn nhiều, cho thêm/xóa lựa chọn<br>- Đơn vị đề xuất: chọn nhiều, cho thêm/xóa lựa chọn, tự điền<br>- Người tạo<br>- Ngày tạo<br>- Dự án/ đề tài<br>- Loại biểu mẫu TTr<br>- Nhóm trạng thái TTr<br>+ Các TTr đang trong quá trình thực hiện<br>+ Các TTr không trong quá trình thực hiện<br>+ Tất cả TTr<br>- Trạng thái TTr<br>+ Đang soạn thảo<br>+ Đang thẩm định<br>+ Hoàn thành thẩm định, chờ trình ký<br>+ Hoàn thành thẩm định, chờ sửa<br>+ Đang trình ký<br>+ Từ chối ký duyệt, chờ sửa<br>+ Tiếp tục soạn thảo<br>+ Điều chỉnh TTr<br>+ Đang sửa<br>+ Đã ký duyệt<br>+ Đã hủy<br>+ Tạm dừng thực hiện<br>- Người thẩm định<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 20.0 | Thẩm định TTr | Tìm kiếm (phần 2) | Chưa có prototype | - Trạng thái với người thẩm định<br>+ Chưa xem<br>+ Đã đồng ý nội dung<br>+ Đã từ chối, yêu cầu sửa lại<br>+ Đang xem<br>- Ngày TTr<br>- Ngày thẩm định<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 21.0 | Thẩm định TTr | Xem danh sách | Chưa có prototype | - Xuất Excel<br>- Danh sách các TTr cần hành động<br>+ Hành động<br>+ ID<br>+ Tên TTr KP<br>+ Số TTr KP<br>+ Ngày TTr KP<br>+ Kinh phí đề xuất<br>+ Đơn vị đề xuất<br>+ Dự án/Đề tài<br>+ Trạng thái TTr<br>+ Ngày đề xuất thẩm định<br>+ Người tạo<br>+ Ngày tạo<br>+ Ngày kết thúc soạn thảo<br>(Giá trị chọn và cột bảng lấy từ mẫu ĐXMS, cần xác nhận.) |
|  | 22.0 | Thẩm định TTr | Hành động | Chưa có prototype | - Cập nhật và giải trình<br>- Xem nội dung soạn thảo<br>- Lưu TTr đã kí duyệt<br>- Tạm dừng thực hiện<br>- Hủy TTr<br>- Cập nhật người xem<br>- Xóa TTr |
|  | 23.0 | Việc của tôi | Chưa có nội dung trong file nguồn | Đã có prototype |  |


## Sheet: Luồng thao tác

|  | STT | Bước | Tác nhân | Mô tả |
|---|---|---|---|---|
|  | 1.0 | Tạo Đề tài/Dự án KHCN | Khối KHCN | - Tại màn hình Đề tài/Dự án => Thêm mới. Khởi tạo Nhiệm vụ/Đề tài/Dự án cùng Thuyết minh và Dự toán chi phí chi tiết (danh mục chi phí, vật tư, thiết bị, tổng ngân sách từng loại chi phí).<br>+Tài liệu đầu vào làm căn cứ mua sắm là Thuyết minh/Dự toán nhiệm vụ KHCN (COP1), PASXKD (COP2) hoặc Hợp đồng/Cam kết với khách hàng (COP3), đã được cấp có thẩm quyền phê duyệt.<br>+ Ở hệ thống cũ, dữ liệu dự toán chưa liên thông tự động sang ĐTMS; đơn vị phải chọn đề tài/dự án làm căn cứ rồi tự bóc tách. |
|  | 2.0 | Rà soát tồn kho | Đơn vị đề xuất + Quản lý tài sản/kho | 1. Đơn vị đề xuất bóc tách danh mục vật tư/thiết bị/dịch vụ từ dự toán theo từng đợt mua sắm.<br>2. Đơn vị tạo Phiếu phối hợp công việc gửi Quản lý tài sản/Kho, đính kèm Phụ lục danh mục hàng hóa đề nghị rà soát kho.<br>3. Thủ kho/cán bộ rà soát kiểm tra số lượng sổ sách trên WMS và kiểm đếm thực tế (số lượng, chất lượng). Chỉ hàng còn trong kho, đạt chất lượng, chưa bị hold cho tờ trình/nhiệm vụ khác mới tính là “có thể xuất kho”.<br>4. Kho trả Biên bản kết quả rà soát tồn kho (Số lượng đề xuất / tồn sổ sách / có thể xuất kho / cần mua), ký bởi 4 chân: Người lập, Thủ kho, Trưởng phòng QLTS/Chỉ huy kho, Giám đốc Trung tâm Mua sắm (qua VOffice hoặc ký cứng + upload scan với hồ sơ Mật/khẩn).<br>Số lượng cần mua = max(0, Đề xuất − Tồn khả xuất). Chỉ hạng mục có số lượng cần mua > 0 mới được đưa vào bước tiếp theo.<br>*Biên bản rà soát tồn kho hiện tại: https://docs.google.com/spreadsheets/d/1o0JSd6xkD7ZimbQ3LBpb-GCyOj05Oe06/edit?usp=sharing&ouid=107765373570869767542&rtpof=true&sd=true |
|  | 3.0 | Yêu cầu và tổng hợp báo giá | Đơn vị đề xuất | 1. Từ phần hàng hóa còn thiếu sau RSTK, đơn vị lập yêu cầu báo giá gửi nhà cung cấp.<br>2. Nhận và tổng hợp báo giá từ các nhà cung cấp.<br>3. Tổng giá trị ĐXMS thực tế được xác định từ báo giá. Đây là căn cứ phân luồng: ≥ 160 tỷ (BM-01 + Checklist 01, đi nhánh BM-05/06/07/08) hoặc < 160 tỷ (BM-09 + Checklist 02, ký duyệt trực tiếp). |
|  | 4.0 | Soạn thảo Tờ trình | Đơn vị đề xuất | Tại màn hình Soạn thảo TTr → Tạo tờ trình:<br>1. Nhập thông tin chung của Tờ trình (đề tài/dự án, tên, mục đích, nội dung...).<br>Bóc tách chi phí: chọn loại chi phí từ dự toán và nhập số tiền đề xuất.<br>[Bổ sung – hạn chế AS-IS] Mỗi loại chi phí chỉ chọn được một lần trong cùng đề tài, dù ngân sách còn dư (ví dụ tổng 10 tỷ, đợt 1 dùng 2 tỷ, đợt 2 không chọn lại được).<br>[Bổ sung – hạn chế AS-IS] Hệ thống không cảnh báo hay chặn khi số tiền đề xuất vượt ngân sách (ví dụ ngân sách 100 triệu, nhập 150 triệu vẫn lưu được); cũng không kiểm soát số lượng/đơn giá theo định mức.<br>2. Chọn đơn vị phê duyệt.<br>3. Chọn người thẩm định (các CQCM tham gia).<br>4. Lưu/Gửi tờ trình sang các CQCM thẩm định (trạng thái hiển thị Chưa xem/Đang xem ở phía CQCM). |
|  | 5.0 | Thẩm định Tờ trình | CQCM | 1. CQCM vào danh sách Tờ trình (màn hình Thẩm định TTr) ở trạng thái Chưa xem/Đang xem, chọn button Thẩm định.<br>2. Màn hình thẩm định gồm:<br>-Phản hồi ý kiến thẩm định: danh sách lịch sử các phản hồi.<br>-Thông tin Tờ trình.<br>-Box Góp ý đề xuất sửa đổi: textbox comment + radio button OK / Not OK.<br>-Các button thao tác:<br>+Ghi lại: lưu tạm ý kiến, chưa gửi kết quả.<br>+Đồng ý: xác nhận thẩm định đạt.<br>+Yêu cầu sửa: gửi ý kiến Not OK để đơn vị chỉnh sửa.<br>+Hủy thẩm định: trả hồ sơ về để đơn vị sửa.<br>[Bổ sung – hạn chế AS-IS] Cán bộ thẩm định phải tải file Word đính kèm về đọc và đối chiếu, comment trong file hoặc gán link |
|  | 6.0 | Xử lý ý kiến và phê duyệt | Đơn vị đề xuất | 1. Tại màn hình Soạn thảo TTr => Cập nhật và giải trình, đơn vị xem phản hồi trong lịch sử, chỉnh sửa Tờ trình rồi gửi lại thẩm định.<br>2. Khi các CQCM đã Đồng ý, hồ sơ chuyển lên cấp phê duyệt đã chọn ở bước soạn thảo. |


## Sheet: Data Collection

_(trống)_


## Sheet: draft 0.1

|  | no | Module | Sub-Tab | data component | sub-function | UI Component |
|---|---|---|---|---|---|---|
|  | 1.0 | Kế hoạch năm | Đề tài dự án theo KH (All) |  |  |  |
|  | 2.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | khối đơn vị |  | Multiple Select, Create, Delete |
|  | 3.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | đơn vị |  | Multiple Select, Create, Delete, auto-fiil |
|  | 4.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | nhóm mục đích |  | Multiple Select, Create, Delete |
|  | 5.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | lĩnh vực |  | Multiple Select, dropdown, auto-fiil, Create, Delete |
|  | 6.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | chi phí năm |  | calendar |
|  | 7.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | master list |  | data grid |
|  | 8.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | export Excel |  | export |
|  | 9.0 | Kế hoạch năm | Đề tài dự án theo KH (By this year) | loại chi phí |  | single select |
|  | 10.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | master list |  | data grid |
|  | 11.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | export Excel |  | export |
|  | 12.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | bên duyệt |  | single select |
|  | 13.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | ngày QĐ đầu tư... đến |  | calendar |
|  | 14.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | nguồn vốn |  | Multiple Select, Create, Delete |
|  | 15.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | trạng thái |  |  |
|  | 16.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | loại dự án (đề tài) |  | Multiple Select, Create, Delete |
|  | 17.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | loại dự án (chi tiết) |  | text box |
|  | 18.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | tìm kiếm |  | search bar |
|  | 19.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | Master List - Các gói thầu | data grid |
|  | 20.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | Master list- các hợp đồng | data grid |
|  | 21.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | lập theo kế hoạch năm | single select, yes/ no |
|  | 22.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | loại dự án (đề tài) | dropdown |
|  | 23.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | cấp phê duyệt | single select |
|  | 24.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | loại dự án (chi tiết) | dropdown |
|  | 25.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | tên dự án | text box |
|  | 26.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | mã dự án | text box |
|  | 27.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | nhóm dự án | dropdown |
|  | 28.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | loại sản phẩm | dropdown |
|  | 29.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | mã dự án theo KHĐT năm | text box |
|  | 30.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | mã dự án SAP | text box |
|  | 31.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | ID Dự án trên cổng Đấu thầu QG |  |
|  | 32.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | mật/ ko mật | single select |
|  | 33.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | nguồn vốn | dropdown |
|  | 34.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | số/ ngày TTr chủ trương | calendar |
|  | 35.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | số/ ngày QĐ phê duyệt dự án | calendar |
|  | 36.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | số/ ngày QĐ phê duyệt dự toán | calendar |
|  | 37.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | nội dung, quy mô dự án ( thông tin sản phẩm) | text box |
|  | 38.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | thời gian bắt đầu | calendar |
|  | 39.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | tổng dự toán DA (VND) | number box |
|  | 40.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | người phụ trách báo cáo | dropdown |
|  | 41.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | đơn vị lập dự án | dropdown |
|  | 42.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | chủ nhiệm dự án | dropdown |
|  | 43.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | người phê duyệt chủ trương | text box |
|  | 44.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | người phê duyệt dự án | text box |
|  | 45.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | người phê duyệt dự toán | text box |
|  | 46.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | địa điểm đầu tư | text box |
|  | 47.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | thời gian kết thúc | calendar |
|  | 48.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | tổng giá trị ĐTMS (Có VAT) | number box |
|  | 49.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | Người phê duyệt quyết toán | text box |
|  | 50.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | tình trạng dự án | dropdown |
|  | 51.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | thông tin chi tiết dự án | ngày nghiệm thu | text box |
|  | 52.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | chi phí theo dự án | Master List - các loại chi phí | data grid |
|  | 53.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | chi phí theo dự án | export Excel | export |
|  | 54.0 | đề tài dự án | Đề tài dự án theo KH (By this year) | văn bản pháp lí | Master List - số văn bản | data grid |
|  | 55.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | khối đơn vị |  | Multiple Select, Create, Delete |
|  | 56.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | đơn vị đề xuất |  | Multiple Select, Create, Delete, auto-fiil |
|  | 57.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | người tạo |  |  |
|  | 58.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | ngày tạo |  |  |
|  | 59.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | dự án/ đề tài |  |  |
|  | 60.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | loại biểu mẫu TTr |  |  |
|  | 61.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | Nhóm trạng thái TTr |  |  |
|  | 62.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | Trạng thái TTr |  |  |
|  | 63.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | người thẩm định |  |  |
|  | 64.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | trạng thái với người thẩm định |  |  |
|  | 65.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | ngày TTr |  |  |
|  | 66.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | Ngày thẩm định |  |  |
|  | 67.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | Chi phí năm |  |  |
|  | 68.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | master list |  | data grid |
|  | 69.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | export Excel |  | export |
|  | 70.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | loại chi phí |  |  |
|  | 71.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | khoản mục chi phí |  |  |
|  | 72.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | loại biểu mẫu TTr |  |  |
|  | 73.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | mật/không |  | single select |
|  | 74.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | v/v đề xuất mua sắm |  | text box |
|  | 75.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | hình thức trình kí |  | single select |
|  | 76.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | người soạn thảo |  |  |
|  | 77.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | đơn vị đề xuất mua sắm |  |  |
|  | 78.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | danh sách đơn vị duyệt |  |  |
|  | 79.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | cấp phê duyệt |  | single select |
|  | 80.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | căn cứ pháp lí |  | text box |
|  | 81.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | mục  tiêu đề xuất mua sắm |  |  |
|  | 82.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | lí do cần thiết phải mua sắm | hiện trạng |  |
|  | 83.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | nhu cầu |  |
|  | 84.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | đánh giá hiện trjang tồn kho hàng hóa |  |
|  | 85.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | giải trình, đánh giá sự cần thiết phải mua sắm |  |
|  | 86.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | quan điểm thực hiện | quan điểm chung |  |
|  | 87.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | phương án kĩ thuật - công nghệ, giải pháp triển khai |  |
|  | 88.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | nội dung đề xuất mua sắm | hạng mục và kinh phí đề xuất |  |
|  | 89.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | nguồn vốn thực hiện |  |
|  | 90.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | hiệu quả hoặc lợi ích, giá trị mang lại của đề xuất mua sắm |  |
|  | 91.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | biện pháp và kế hoạch tổ chức thực hiện | kế hoạch triển khai |  |
|  | 92.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | thời gian thực hiện dự kiến |  |
|  | 93.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) |  | tổ chức thực hiện |  |
|  | 94.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | danh mục hồ sơ kèm theo |  |  |
|  | 95.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | PL DANH MỤC MUA SẮM CHI TIẾT |  | yes/ no, single select |
|  | 96.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | PL DANH MỤC MUA SẮM CHI TIẾT (VLTK) |  | yes/ no, single select |
|  | 97.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | CHI TIÊU KĨ THUẬT |  | yes/ no, single select |
|  | 98.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | CẤU TRÚC SẢN PHẨM |  | yes/ no, single select |
|  | 99.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | DANH MỤC BẢN VẼ |  | yes/ no, single select |
|  | 100.0 | T/Trinh kinh phí | Soạn thảo T/trình (CRUD) | TRÍCH LỤC NGUỒN |  | yes/ no, single select |
|  | 101.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | khối đơn vị |  | Multiple Select, Create, Delete |
|  | 102.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | đơn vị đề xuất |  | Multiple Select, Create, Delete, auto-fiil |
|  | 103.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | người tạo |  |  |
|  | 104.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | ngày tạo |  |  |
|  | 105.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | dự án/ đề tài |  |  |
|  | 106.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | loại biểu mẫu TTr |  |  |
|  | 107.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Nhóm trạng thái TTr |  |  |
|  | 108.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Trạng thái TTr |  |  |
|  | 109.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | người thẩm định |  |  |
|  | 110.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | trạng thái với người thẩm định |  |  |
|  | 111.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | ngày TTr |  |  |
|  | 112.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Ngày thẩm định |  |  |
|  | 113.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | export Excel |  | export |
|  | 114.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | master list | List các TTrinh cần hành động | data grid |
|  | 115.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | Cập nhật và giải trình | Update |
|  | 116.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | xem nội dung soạn thảo | view |
|  | 117.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | lưu TTr đã kí duyệt | save |
|  | 118.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | tạm dùng thực hiện | tạm dừng |
|  | 119.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | Hủy TTrinh | cancel |
|  | 120.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | Cập nhập người xem | Update |
|  | 121.0 | T/Trinh kinh phí | THẨM ĐỊNH TTRINH (CRUD) | Hành động | Xóa TTrinh | Delete |
|  |  |  | Việc của tôi |  |  |  |
