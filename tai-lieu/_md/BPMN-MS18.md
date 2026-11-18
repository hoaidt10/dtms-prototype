<!-- pk-source: 03. Thiết kế (Tài liệu BA)/BPMN/Draft/MS18-2409.drawio -->
<!-- pk-sha256: c3c54900369ca6dbbf6974086f3666890f536827127f3dd728a6288f3afa6efc -->
<!-- pk-generated: 2026-09-29 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# BPMN-MS18 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/Draft/MS18-2409.drawio`. Trích dẫn thì ghi mã **BPMN-MS18** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.


## Trang: MS18 - Luồng tổng hợp

24 nhãn (theo thứ tự trong tệp, không phải thứ tự luồng):

- MS18 - NGHIỆP VỤ LẬP KẾ HOẠCH LỰA CHỌN NHÀ THẦU (TO-BE)
- Căn cứ QĐ 12869 - Điều 22, Điều 23, Điều 26, Phụ lục 1 | Luồng tổng hợp gồm 4 subprocess. Hệ thống ĐTMS/AI/Tích hợp được tách thành lane riêng.
- LUỒNG TỔNG HỢP MS18
- MS18 - Luồng tổng hợp
- Đơn vị lập/trình KHLCNT
- Đơn vị kiểm tra KHLCNT
- Người có thẩm quyền
- Hệ thống ĐTMS/Tích hợp/AI
- Bắt đầu
- 1. Khởi tạo lập KHLCNT Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Chọn hồ sơ căn cứ và khởi tạo nghiệp vụ lập KHLCNT trên ĐTMS. Biểu mẫu/Hồ sơ: Dự án/khoản đầu tư/ĐXMS đã phê duyệt hoặc Tờ trình chủ trương đấu thầu trước đã phê duyệt
- 2. Kiểm tra căn cứ lập KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Tự động kiểm tra sự tồn tại và trạng thái phê duyệt của hồ sơ căn cứ trước khi cho phép lập KHLCNT. Biểu mẫu/Hồ sơ: Hồ sơ căn cứ đã phê duyệt
- ×
- Đủ căn cứ lập KHLCNT?
- Chờ bổ sung căn cứ
- 3. MS18.1 - Lập thông tin gói thầu Hình thành và xác nhận thông tin gói thầu; hệ thống/AI hỗ trợ sinh dữ liệu, kiểm tra và gợi ý hình thức/phương thức LCNT. Chi tiết: xem tab tương ứng
- Có
- 4. MS18.2 - Lập Tờ trình KHLCNT Sinh dự thảo Tờ trình → người dùng kiểm tra → hệ thống kiểm tra nội dung → trình ký qua tích hợp VOffice. Chi tiết: xem tab tương ứng
- 5. MS18.3 - Lập Báo cáo kiểm tra KHLCNT [Q02] Đơn vị kiểm tra KHLCNT thực hiện kiểm tra; hệ thống/AI hỗ trợ tổng hợp NOK và sinh dự thảo Báo cáo kiểm tra. Chi tiết: xem tab tương ứng
- 6. MS18.4 - Lập Quyết định phê duyệt & đăng tải Lập dự thảo Quyết định → kiểm tra → phê duyệt → nhận kết quả ký → chuẩn bị và thực hiện đăng tải KHLCNT. Chi tiết: xem tab tương ứng
- Hoàn tất MS18
- Không
- N01 · LANE HỆ THỐNG / QUY ƯỚC TO-BE Hệ thống ĐTMS/Tích hợp/AI là một lane riêng trong cùng pool MS18. Mọi Service Task tự động như lấy dữ liệu, sinh dự thảo, kiểm tra nội dung, tổng hợp NOK, gửi/nhận trạng thái VOffice và chuẩn bị dữ liệu đăng tải phải nằm tại lane Hệ thống; User Task phải nằm tại lane của người/đơn vị thực hiện.
- Q02 · CẦN XÁC NHẬN — BÁO CÁO KIỂM TRA KHLCNT Liên quan MS18.3. Tạm dùng lane “Đơn vị kiểm tra KHLCNT”. Cần xác nhận: tên/biểu mẫu chính thức của Báo cáo kiểm tra KHLCNT, nội dung bắt buộc, người ký/xác nhận và việc có bắt buộc trình ký qua VOffice hay chỉ xác nhận trên ĐTMS. Các task liên quan được gắn [Q02].
- N02 · ĐĂNG TẢI KHLCNT Sau khi KHLCNT được phê duyệt, Chủ đầu tư thực hiện đăng tải trên Cổng đấu thầu Viettel hoặc Hệ thống mạng đấu thầu quốc gia theo trường hợp áp dụng. Theo Điều 26, KHLCNT phải được đăng tải trong vòng 05 ngày làm việc kể từ ngày được phê duyệt; trước khi công bố phải loại trừ thông tin không được phép công khai.


## Trang: MS18 - Chi tiết tổng hợp

114 nhãn (theo thứ tự trong tệp, không phải thứ tự luồng):

- MS18 - CHI TIẾT TỔNG HỢP 4 LUỒNG (TO-BE)
- Một BPMN xuyên suốt 4 subprocess. User Task: xanh nước biển; Service Task: xanh lá; task đặt đúng lane tác nhân. Q&A/Notes đặt bên dưới BPMN.
- MS18.1 · LẬP THÔNG TIN GÓI THẦU
- MS18.2 · LẬP TỜ TRÌNH KHLCNT
- MS18.3 · LẬP BÁO CÁO KIỂM TRA KHLCNT
- MS18.4 · QUYẾT ĐỊNH PHÊ DUYỆT & ĐĂNG TẢI
- MS18
- Đơn vị lập/trình KHLCNT
- Chủ đầu tư
- Đơn vị kiểm tra KHLCNT
- Người ký / Người có thẩm quyền
- Hệ thống ĐTMS/Tích hợp/AI
- Cổng đấu thầu Viettel / Hệ thống mạng ĐTQG
- Bắt đầu SP1
- 1. Tải căn cứ đã được phê duyệt Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Dữ liệu: Dự án/Khoản đầu tư/ĐXMS; hoặc Tờ trình chủ trương đấu thầu trước Biểu mẫu/Hồ sơ: QĐ phê duyệt Dự án/Khoản đầu tư/ĐXMS hoặc Tờ trình chủ trương đấu thầu trước đã được phê duyệt
- ×
- Đủ căn cứ?
- Chờ bổ sung căn cứ
- Mua sắm thường xuyên?
- 2. Kiểm tra nhu cầu 06–12 tháng và nguy cơ chia nhỏ Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule Điều 22: nhu cầu tổng thể 06–12 tháng; không chia nhỏ để chỉ định thầu Biểu mẫu/Hồ sơ: Nhu cầu mua sắm thường xuyên 06–12 tháng; dữ liệu phạm vi mua sắm
- Đạt nguyên tắc?
- 3. Hoàn thiện phạm vi/nhu cầu mua sắm Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Dữ liệu: phạm vi nhu cầu mua sắm thường xuyên Biểu mẫu/Hồ sơ: Hồ sơ/dữ liệu phạm vi, nhu cầu mua sắm thường xuyên
- Áp dụng Luật Đấu thầu cho gói cụ thể?
- 4. Xác lập KHLCNT riêng và phạm vi điều khoản Luật áp dụng Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản/dữ liệu: KHLCNT riêng + danh sách điều/khoản/điểm Luật áp dụng Biểu mẫu/Hồ sơ: KHLCNT riêng + danh sách điều/khoản/điểm của Luật Đấu thầu được lựa chọn áp dụng
- 5. Sinh dự thảo thông tin gói thầu Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: Dự thảo thông tin gói thầu/KHLCNT
- 6. Kiểm tra, cập nhật thông tin gói thầu Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Dữ liệu: Thông tin gói thầu Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT
- 7. Kiểm tra tính đầy đủ/hợp lệ Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: Điều 22 + Phụ lục 1 Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT; căn cứ Điều 22 và Phụ lục 1
- Thông tin hợp lệ?
- 8. Tóm tắt lỗi và gợi ý nội dung cần sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: danh sách NOK + gợi ý chỉnh sửa Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 9. Gợi ý hình thức/phương thức LCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: Thông tin gói thầu + kết quả gợi ý hình thức/phương thức LCNT của AI
- 10. Xác nhận hình thức/phương thức LCNT Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Dữ liệu: phương án LCNT do người dùng chịu trách nhiệm xác nhận Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT
- 11. Kiểm tra phương án theo Quy chế Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: điều kiện áp dụng của từng hình thức/phương thức Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT; quy tắc Điều 11–21
- Phương án phù hợp?
- 12. Tóm tắt điểm không phù hợp và gợi ý điều chỉnh Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: lỗi điều kiện + phương án gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- Hình thức “trường hợp đặc biệt”?
- KHLCNT thuộc thẩm quyền phê duyệt của TGĐ Tập đoàn?
- 13. Lập đề nghị xin chấp thuận chủ trương áp dụng trường hợp đặc biệt Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Đề nghị/chủ trương áp dụng trường hợp đặc biệt Biểu mẫu/Hồ sơ: Văn bản đề nghị/chấp thuận chủ trương áp dụng trường hợp đặc biệt; tên/mẫu chính thức: CẦN HỎI VHT
- 14. Kiểm tra nội dung trước khi trình Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: đủ lý do áp dụng + cách thức + trình tự tổ chức LCNT Biểu mẫu/Hồ sơ: Văn bản đề nghị áp dụng trường hợp đặc biệt + thông tin gói thầu/KHLCNT
- Nội dung đạt?
- 15. Tóm tắt lỗi và gợi ý chỉnh sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: NOK + gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 16. Xác nhận trình ký/chấp thuận Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Đề nghị xin chấp thuận chủ trương Biểu mẫu/Hồ sơ: Văn bản đề nghị xin chấp thuận chủ trương áp dụng trường hợp đặc biệt
- 17. Tạo hồ sơ và luân chuyển trình ký Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm văn bản đề nghị xin chấp thuận chủ trương
- 18. Xem xét/chấp thuận chủ trương trên VOffice Tác nhân: Tổng Giám đốc Tập đoàn (khi áp dụng trường hợp đặc biệt theo Điều 21) Thực hiện: Người ký: TGĐ Tập đoàn theo trường hợp Điều 21 Biểu mẫu/Hồ sơ: Văn bản đề nghị/chấp thuận chủ trương áp dụng trường hợp đặc biệt
- Chấp thuận?
- 19. Tóm tắt ý kiến không đồng ý và gợi ý nội dung sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý thay đổi Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + gợi ý chỉnh sửa của AI
- 20. Nhận kết quả ký/chấp thuận từ VOffice Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận trạng thái/kết quả ký hoặc chấp thuận từ VOffice; chỉ khi hoàn tất mới chuyển bước tiếp theo. Biểu mẫu/Hồ sơ: Văn bản/kết quả chấp thuận chủ trương đã ký trên VOffice
- Tiếp tục lập KHLCNT
- 21. Tổng hợp dữ liệu KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Nguồn: thông tin các gói thầu đã được người dùng xác nhận Biểu mẫu/Hồ sơ: Thông tin các gói thầu đã xác nhận + căn cứ phê duyệt
- 22. Sinh dự thảo Tờ trình KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Văn bản: Tờ trình xin phê duyệt KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Tờ trình xin phê duyệt KHLCNT
- 23. Kiểm tra, cập nhật Tờ trình Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Tờ trình KHLCNT Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT + KHLCNT
- 24. Kiểm tra nội dung trước khi chuyển Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: đủ nội dung Điều 23 + khớp tổng giá trị/căn cứ Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT + KHLCNT + căn cứ liên quan
- Tờ trình đạt kiểm tra?
- 25. Tóm tắt lỗi và gợi ý nội dung cần sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: danh sách NOK + gợi ý chỉnh sửa Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 26. Xác nhận trình ký Tờ trình Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: User xác nhận trên ĐTMS trước khi chuyển VOffice Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT
- 27. Tạo hồ sơ và luân chuyển trình ký Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm Tờ trình xin phê duyệt KHLCNT
- 28. Xem xét/ký Tờ trình trên VOffice Tác nhân: Người ký Tờ trình KHLCNT theo phân công Thực hiện: Người ký: theo phân công/thẩm quyền - CẦN HỎI VHT Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT
- Tờ trình được ký?
- 29. Tóm tắt ý kiến không đồng ý và gợi ý thay đổi Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý sửa Tờ trình Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + Tờ trình KHLCNT + gợi ý AI
- 30. Nhận kết quả ký từ VOffice Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận trạng thái/kết quả ký từ VOffice; chỉ khi ký hoàn tất mới chuyển bước tiếp theo. Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT đã ký
- 31. Sinh dữ liệu kiểm tra KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Nguồn: Tờ trình đã ký + thông tin gói thầu + căn cứ phê duyệt Biểu mẫu/Hồ sơ: Tờ trình KHLCNT đã ký + thông tin gói thầu/KHLCNT + căn cứ phê duyệt
- 32. Kiểm tra hồ sơ KHLCNT Tác nhân: Đơn vị kiểm tra KHLCNT Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: Hồ sơ KHLCNT: thông tin gói thầu/KHLCNT + Tờ trình đã ký + căn cứ phê duyệt
- 33. Kiểm tra tự động theo Quy chế Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: điều kiện hình thức/phương thức, giá, nguồn vốn, thời gian, loại HĐ, tổng giá trị... Biểu mẫu/Hồ sơ: Hồ sơ KHLCNT + quy tắc kiểm tra theo QĐ 12869
- KHLCNT đạt yêu cầu?
- 34. Tóm tắt nội dung NOK và gợi ý thay đổi Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: lỗi + gợi ý + vị trí cần sửa Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh; chỉ rõ vị trí cần sửa
- Nội dung cần sửa thuộc đâu?
- 35. Sinh dự thảo Báo cáo kiểm tra KHLCNT [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Văn bản TO-BE: Báo cáo kiểm tra KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Báo cáo kiểm tra KHLCNT (TO-BE; tên/mẫu chính thức: CẦN HỎI VHT)
- 36. Kiểm tra, cập nhật Báo cáo kiểm tra [Q02] Tác nhân: Đơn vị kiểm tra KHLCNT Thực hiện: Văn bản: Báo cáo kiểm tra KHLCNT Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT (TO-BE; tên/mẫu chính thức: CẦN HỎI VHT)
- 37. Kiểm tra nội dung trước khi trình ký [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: không chuyển sang bên khác khi còn lỗi Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT + hồ sơ KHLCNT liên quan
- Báo cáo đạt?
- 38. Tóm tắt lỗi và gợi ý chỉnh sửa [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: NOK + gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 39. Xác nhận trình ký Báo cáo kiểm tra [Q02] Tác nhân: Đơn vị kiểm tra KHLCNT Thực hiện: User xác nhận trên ĐTMS Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT (TO-BE; tên/mẫu chính thức: CẦN HỎI VHT)
- 40. Tạo hồ sơ và luân chuyển trình ký [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm Báo cáo kiểm tra KHLCNT
- 41. Xem xét/ký Báo cáo kiểm tra trên VOffice [Q02] Tác nhân: Người ký Báo cáo kiểm tra KHLCNT Thực hiện: Người ký: CẦN HỎI VHT Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT (TO-BE; người ký/mẫu chính thức: CẦN HỎI VHT)
- Báo cáo được ký?
- 42. Tóm tắt ý kiến không đồng ý và gợi ý thay đổi [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý sửa Tờ trình Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + Báo cáo kiểm tra + gợi ý AI
- 43. Nhận kết quả ký từ VOffice [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận trạng thái/kết quả ký từ VOffice; chỉ khi ký hoàn tất mới chuyển bước tiếp theo. Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT đã ký
- 44. Tổng hợp hồ sơ đủ điều kiện phê duyệt Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Nguồn: thông tin gói thầu + Tờ trình + Báo cáo kiểm tra đã hoàn tất Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT + Tờ trình đã ký + Báo cáo kiểm tra đã hoàn tất
- 45. Sinh dự thảo Quyết định phê duyệt KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Văn bản: Dự thảo Quyết định phê duyệt KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT
- 46. Kiểm tra, cập nhật dự thảo Quyết định Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Quyết định phê duyệt KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT + hồ sơ KHLCNT
- 47. Kiểm tra nội dung trước khi trình người có thẩm quyền Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: không chuyển khi còn lỗi/không khớp hồ sơ Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT + hồ sơ KHLCNT
- Quyết định đạt kiểm tra?
- 48. Tóm tắt lỗi và gợi ý chỉnh sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: NOK + gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 49. Xác nhận trình ký Quyết định Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: User xác nhận trên ĐTMS Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT
- 50. Tạo hồ sơ và luân chuyển trình ký Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm Quyết định phê duyệt KHLCNT
- 51. Xem xét/phê duyệt KHLCNT trên VOffice Tác nhân: Người có thẩm quyền phê duyệt KHLCNT Thực hiện: Người ký: Người có thẩm quyền Biểu mẫu/Hồ sơ: Quyết định phê duyệt KHLCNT
- Phê duyệt?
- 52. Tóm tắt ý kiến không đồng ý và gợi ý thay đổi Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý sửa Tờ trình Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + dự thảo Quyết định + gợi ý AI
- 53. Nhận Quyết định đã ký từ VOffice Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận Quyết định đã ký từ VOffice và cập nhật trạng thái KHLCNT đã được phê duyệt. Biểu mẫu/Hồ sơ: Quyết định phê duyệt KHLCNT đã ký
- 54. Sinh dữ liệu đăng tải KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt; Quyết định phê duyệt KHLCNT là căn cứ đăng tải
- 55. Kiểm tra thông tin trước khi đăng tải Tác nhân: Chủ đầu tư Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt + Quyết định phê duyệt KHLCNT
- Có thông tin không được công bố?
- 56. Rà soát phạm vi công bố và loại trừ dữ liệu hạn chế Tác nhân: Chủ đầu tư Thực hiện: Ngoại lệ: tài liệu mật, bí mật Tập đoàn, thông tin QPAN không được công bố Biểu mẫu/Hồ sơ: KHLCNT/QĐ phê duyệt + danh mục dữ liệu mật, bí mật Tập đoàn, thông tin QPAN không được công bố
- 57. Xác nhận đăng tải KHLCNT Tác nhân: Chủ đầu tư Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt (nội dung cuối cùng để đăng tải)
- 58. Đăng tải KHLCNT lên hệ thống phù hợp Tác nhân: Cổng đấu thầu Viettel / Hệ thống mạng ĐTQG Thực hiện: Cổng đấu thầu Viettel hoặc Hệ thống mạng đấu thầu quốc gia Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt
- Đăng tải thành công?
- 60. Ghi nhận lỗi và cho phép gửi lại Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thông tin: nguyên nhân lỗi, trạng thái chờ gửi lại Biểu mẫu/Hồ sơ: Thông tin lỗi đăng tải + trạng thái chờ gửi lại
- 59. Ghi nhận thời điểm và trạng thái đăng tải Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Lưu vết phục vụ theo dõi mốc 05 ngày làm việc Biểu mẫu/Hồ sơ: Nhật ký/trạng thái đăng tải KHLCNT trên ĐTMS
- Hoàn tất MS18
- Không
- Có
- Sau khi cập nhật
- Sửa lại
- Điều chỉnh
- Sửa đề nghị
- Sửa Tờ trình
- Thông tin gói thầu
- Tờ trình
- Sửa Báo cáo
- Báo cáo kiểm tra
- Chỉ Quyết định
- Gửi lại
- N01 · TO-BE / BIÊN TÍCH HỢP VOFFICE Các bước tạo/gửi trình ký là Service Task của Hệ thống ĐTMS/Tích hợp/AI. Người dùng xác nhận trên ĐTMS trước; hệ thống gửi qua VOffice; không mô hình hóa xử lý nội bộ VOffice. Chỉ sau khi ĐTMS nhận kết quả ký hoàn tất thì luồng mới chuyển bước tiếp theo.
- Q02 · CẦN XÁC NHẬN — BÁO CÁO KIỂM TRA KHLCNT Liên quan task 35–43 (đặc biệt 35, 36, 39, 41, 43). Tạm dùng lane “Đơn vị kiểm tra KHLCNT”. Cần xác nhận: (1) tên/biểu mẫu chính thức; (2) nội dung bắt buộc; (3) người ký/xác nhận; (4) có bắt buộc trình ký qua VOffice hay chỉ xác nhận trên ĐTMS. Task được gắn [Q02] nhưng vẫn giữ đúng màu User Task/Service Task.
- N02 · ĐĂNG TẢI SAU PHÊ DUYỆT Chủ đầu tư rà soát nội dung công bố, loại trừ dữ liệu mật/bí mật Tập đoàn/QPAN nếu có, sau đó xác nhận đăng tải. KHLCNT phải được đăng tải trên hệ thống phù hợp trong vòng 05 ngày làm việc kể từ ngày được phê duyệt.


## Trang: MS18.1 - Lập thông tin gói thầu

49 nhãn (theo thứ tự trong tệp, không phải thứ tự luồng):

- MS18.1 - LẬP THÔNG TIN GÓI THẦU
- Căn cứ: Điều 11–22 và Phụ lục 1 QĐ 12869.
- MS18.1 · LẬP THÔNG TIN GÓI THẦU
- MS18.1
- Đơn vị lập/trình KHLCNT
- 3. Hoàn thiện phạm vi/nhu cầu mua sắm Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Dữ liệu: phạm vi nhu cầu mua sắm thường xuyên Biểu mẫu/Hồ sơ: Hồ sơ/dữ liệu phạm vi, nhu cầu mua sắm thường xuyên
- ×
- Áp dụng Luật Đấu thầu cho gói cụ thể?
- 4. Xác lập KHLCNT riêng và phạm vi điều khoản Luật áp dụng Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản/dữ liệu: KHLCNT riêng + danh sách điều/khoản/điểm Luật áp dụng Biểu mẫu/Hồ sơ: KHLCNT riêng + danh sách điều/khoản/điểm của Luật Đấu thầu được lựa chọn áp dụng
- 6. Kiểm tra, cập nhật thông tin gói thầu Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Dữ liệu: Thông tin gói thầu Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT
- 10. Xác nhận hình thức/phương thức LCNT Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Dữ liệu: phương án LCNT do người dùng chịu trách nhiệm xác nhận Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT
- KHLCNT thuộc thẩm quyền phê duyệt của TGĐ Tập đoàn?
- 13. Lập đề nghị xin chấp thuận chủ trương áp dụng trường hợp đặc biệt Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Đề nghị/chủ trương áp dụng trường hợp đặc biệt Biểu mẫu/Hồ sơ: Văn bản đề nghị/chấp thuận chủ trương áp dụng trường hợp đặc biệt; tên/mẫu chính thức: CẦN HỎI VHT
- 16. Xác nhận trình ký/chấp thuận Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Đề nghị xin chấp thuận chủ trương Biểu mẫu/Hồ sơ: Văn bản đề nghị xin chấp thuận chủ trương áp dụng trường hợp đặc biệt
- Người ký / Người có thẩm quyền / TGĐ Tập đoàn
- 18. Xem xét/chấp thuận chủ trương trên VOffice Tác nhân: Tổng Giám đốc Tập đoàn (khi áp dụng trường hợp đặc biệt theo Điều 21) Thực hiện: Người ký: TGĐ Tập đoàn theo trường hợp Điều 21 Biểu mẫu/Hồ sơ: Văn bản đề nghị/chấp thuận chủ trương áp dụng trường hợp đặc biệt
- Chấp thuận?
- 19. Tóm tắt ý kiến không đồng ý và gợi ý nội dung sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý thay đổi Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + gợi ý chỉnh sửa của AI
- Không
- Hệ thống ĐTMS/Tích hợp/AI
- Bắt đầu SP1
- 1. Tải căn cứ đã được phê duyệt Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Dữ liệu: Dự án/Khoản đầu tư/ĐXMS; hoặc Tờ trình chủ trương đấu thầu trước Biểu mẫu/Hồ sơ: QĐ phê duyệt Dự án/Khoản đầu tư/ĐXMS hoặc Tờ trình chủ trương đấu thầu trước đã được phê duyệt
- Đủ căn cứ?
- Chờ bổ sung căn cứ
- Mua sắm thường xuyên?
- 2. Kiểm tra nhu cầu 06–12 tháng và nguy cơ chia nhỏ Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule Điều 22: nhu cầu tổng thể 06–12 tháng; không chia nhỏ để chỉ định thầu Biểu mẫu/Hồ sơ: Nhu cầu mua sắm thường xuyên 06–12 tháng; dữ liệu phạm vi mua sắm
- Đạt nguyên tắc?
- 5. Sinh dự thảo thông tin gói thầu Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: Dự thảo thông tin gói thầu/KHLCNT
- 7. Kiểm tra tính đầy đủ/hợp lệ Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: Điều 22 + Phụ lục 1 Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT; căn cứ Điều 22 và Phụ lục 1
- Thông tin hợp lệ?
- 9. Gợi ý hình thức/phương thức LCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: Thông tin gói thầu + kết quả gợi ý hình thức/phương thức LCNT của AI
- 11. Kiểm tra phương án theo Quy chế Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: điều kiện áp dụng của từng hình thức/phương thức Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT; quy tắc Điều 11–21
- Phương án phù hợp?
- Hình thức “trường hợp đặc biệt”?
- 14. Kiểm tra nội dung trước khi trình Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: đủ lý do áp dụng + cách thức + trình tự tổ chức LCNT Biểu mẫu/Hồ sơ: Văn bản đề nghị áp dụng trường hợp đặc biệt + thông tin gói thầu/KHLCNT
- Nội dung đạt?
- 17. Tạo hồ sơ và luân chuyển trình ký Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm văn bản đề nghị xin chấp thuận chủ trương
- Hoàn thành SP1
- 8. Tóm tắt lỗi và gợi ý nội dung cần sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: danh sách NOK + gợi ý chỉnh sửa Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 12. Tóm tắt điểm không phù hợp và gợi ý điều chỉnh Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: lỗi điều kiện + phương án gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 15. Tóm tắt lỗi và gợi ý chỉnh sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: NOK + gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 20. Nhận kết quả ký/chấp thuận từ VOffice Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận trạng thái/kết quả ký hoặc chấp thuận từ VOffice; chỉ khi hoàn tất mới chuyển bước tiếp theo. Biểu mẫu/Hồ sơ: Văn bản/kết quả chấp thuận chủ trương đã ký trên VOffice
- Có
- Sau khi cập nhật
- Sửa lại
- Điều chỉnh
- Sửa đề nghị
- N01 · AI CHỈ HỖ TRỢ / NGƯỜI DÙNG XÁC NHẬN AI có thể sinh dữ liệu, gợi ý hình thức/phương thức LCNT và cảnh báo nội dung không phù hợp; kết quả AI chỉ hỗ trợ. Người dùng phải kiểm tra và xác nhận trước khi chuyển bước.
- N02 · TRƯỜNG HỢP ĐẶC BIỆT Nếu áp dụng hình thức lựa chọn nhà thầu trong trường hợp đặc biệt mà KHLCNT không thuộc thẩm quyền phê duyệt của Tổng Giám đốc Tập đoàn, quy trình tạm thể hiện bước xin chấp thuận chủ trương trước khi tiếp tục.


## Trang: MS18.2 - Lập Tờ trình KHLCNT

27 nhãn (theo thứ tự trong tệp, không phải thứ tự luồng):

- MS18.2 - LẬP TỜ TRÌNH KHLCNT
- Căn cứ: Điều 23 QĐ 12869; áp dụng nguyên tắc TO-BE sinh dự thảo → user kiểm tra → kiểm tra trước chuyển → ký qua VOffice.
- MS18.2 · LẬP TỜ TRÌNH KHLCNT
- MS18.2
- Đơn vị lập/trình KHLCNT
- 3. Kiểm tra, cập nhật Tờ trình Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Tờ trình KHLCNT Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT + KHLCNT
- 6. Xác nhận trình ký Tờ trình Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: User xác nhận trên ĐTMS trước khi chuyển VOffice Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT
- Người ký / Người có thẩm quyền
- 8. Xem xét/ký Tờ trình trên VOffice Tác nhân: Người ký Tờ trình KHLCNT theo phân công Thực hiện: Người ký: theo phân công/thẩm quyền - CẦN HỎI VHT Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT
- ×
- Tờ trình được ký?
- Hệ thống ĐTMS/Tích hợp/AI
- Bắt đầu SP2
- 1. Tổng hợp dữ liệu KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Nguồn: thông tin các gói thầu đã được người dùng xác nhận Biểu mẫu/Hồ sơ: Thông tin các gói thầu đã xác nhận + căn cứ phê duyệt
- 2. Sinh dự thảo Tờ trình KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Văn bản: Tờ trình xin phê duyệt KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Tờ trình xin phê duyệt KHLCNT
- 4. Kiểm tra nội dung trước khi chuyển Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: đủ nội dung Điều 23 + khớp tổng giá trị/căn cứ Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT + KHLCNT + căn cứ liên quan
- Tờ trình đạt kiểm tra?
- 7. Tạo hồ sơ và luân chuyển trình ký Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm Tờ trình xin phê duyệt KHLCNT
- 9. Tóm tắt ý kiến không đồng ý và gợi ý thay đổi Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý sửa Tờ trình Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + Tờ trình KHLCNT + gợi ý AI
- 10. Nhận kết quả ký từ VOffice Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận trạng thái/kết quả ký từ VOffice; chỉ khi ký hoàn tất mới chuyển bước tiếp theo. Biểu mẫu/Hồ sơ: Tờ trình xin phê duyệt KHLCNT đã ký
- Hoàn thành SP2
- 5. Tóm tắt lỗi và gợi ý nội dung cần sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: danh sách NOK + gợi ý chỉnh sửa Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- Không
- Sửa lại
- Có
- Sửa Tờ trình
- N01 · TRÌNH KÝ TỜ TRÌNH Hệ thống chỉ tạo/gửi hồ sơ sang VOffice sau khi người dùng xác nhận trên ĐTMS. Nếu người ký không đồng ý, AI tóm tắt phản hồi và gợi ý thay đổi, sau đó trả về task kiểm tra/cập nhật Tờ trình.


## Trang: MS18.3 - Lập Báo cáo kiểm tra KHLCNT

38 nhãn (theo thứ tự trong tệp, không phải thứ tự luồng):

- MS18.3 - LẬP BÁO CÁO KIỂM TRA KHLCNT
- TO-BE: tạm sử dụng lane “Đơn vị kiểm tra KHLCNT”; các nội dung gắn [Q02] cần xác nhận với VHT.
- MS18.3 · LẬP BÁO CÁO KIỂM TRA KHLCNT
- MS18.3
- Đơn vị kiểm tra KHLCNT
- 2. Kiểm tra hồ sơ KHLCNT Tác nhân: Đơn vị kiểm tra KHLCNT Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: Hồ sơ KHLCNT: thông tin gói thầu/KHLCNT + Tờ trình đã ký + căn cứ phê duyệt
- Quay lại SP1 - Thông tin gói thầu
- Quay lại SP2 - Tờ trình
- 6. Kiểm tra, cập nhật Báo cáo kiểm tra [Q02] Tác nhân: Đơn vị kiểm tra KHLCNT Thực hiện: Văn bản: Báo cáo kiểm tra KHLCNT Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT (TO-BE; tên/mẫu chính thức: CẦN HỎI VHT)
- 9. Xác nhận trình ký Báo cáo kiểm tra [Q02] Tác nhân: Đơn vị kiểm tra KHLCNT Thực hiện: User xác nhận trên ĐTMS Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT (TO-BE; tên/mẫu chính thức: CẦN HỎI VHT)
- ×
- Gateway
- Người ký / Người có thẩm quyền
- 11. Xem xét/ký Báo cáo kiểm tra trên VOffice [Q02] Tác nhân: Người ký Báo cáo kiểm tra KHLCNT Thực hiện: Người ký: CẦN HỎI VHT Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT (TO-BE; người ký/mẫu chính thức: CẦN HỎI VHT)
- Báo cáo được ký?
- Hệ thống ĐTMS/Tích hợp/AI
- Bắt đầu SP3
- 1. Sinh dữ liệu kiểm tra KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Nguồn: Tờ trình đã ký + thông tin gói thầu + căn cứ phê duyệt Biểu mẫu/Hồ sơ: Tờ trình KHLCNT đã ký + thông tin gói thầu/KHLCNT + căn cứ phê duyệt
- 3. Kiểm tra tự động theo Quy chế Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: điều kiện hình thức/phương thức, giá, nguồn vốn, thời gian, loại HĐ, tổng giá trị... Biểu mẫu/Hồ sơ: Hồ sơ KHLCNT + quy tắc kiểm tra theo QĐ 12869
- KHLCNT đạt yêu cầu?
- Nội dung cần sửa thuộc đâu?
- 5. Sinh dự thảo Báo cáo kiểm tra KHLCNT [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Văn bản TO-BE: Báo cáo kiểm tra KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Báo cáo kiểm tra KHLCNT (TO-BE; tên/mẫu chính thức: CẦN HỎI VHT)
- 7. Kiểm tra nội dung trước khi trình ký [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: không chuyển sang bên khác khi còn lỗi Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT + hồ sơ KHLCNT liên quan
- Báo cáo đạt?
- 8. Tóm tắt lỗi và gợi ý chỉnh sửa [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: NOK + gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- 10. Tạo hồ sơ và luân chuyển trình ký [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm Báo cáo kiểm tra KHLCNT
- 12. Tóm tắt ý kiến không đồng ý và gợi ý thay đổi [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý sửa Tờ trình Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + Báo cáo kiểm tra + gợi ý AI
- Hoàn thành SP3
- 4. Tóm tắt nội dung NOK và gợi ý thay đổi Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: lỗi + gợi ý + vị trí cần sửa Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh; chỉ rõ vị trí cần sửa
- Không
- 13. Nhận kết quả ký từ VOffice [Q02] Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận trạng thái/kết quả ký từ VOffice; chỉ khi ký hoàn tất mới chuyển bước tiếp theo. Biểu mẫu/Hồ sơ: Báo cáo kiểm tra KHLCNT đã ký
- Thông tin gói
- Tờ trình
- Có
- Sửa lại
- Sửa Báo cáo
- Q02 · CẦN XÁC NHẬN — BÁO CÁO KIỂM TRA KHLCNT Liên quan task 5–13 của luồng con này. Tạm sử dụng lane “Đơn vị kiểm tra KHLCNT”. Cần xác nhận tên/biểu mẫu chính thức của Báo cáo kiểm tra KHLCNT, nội dung bắt buộc, người ký/xác nhận và cơ chế ký qua VOffice. Quy chế hiện chỉ xác định yêu cầu kiểm soát trước khi phê duyệt, chưa làm rõ các nội dung trên.
- N01 · NGUYÊN TẮC TRẢ LẠI Nếu kiểm tra không đạt, AI tóm tắt nội dung NOK và xác định vị trí cần sửa. Nếu lỗi thuộc thông tin gói thầu thì quay MS18.1; nếu thuộc Tờ trình thì quay MS18.2. Không yêu cầu chạy lại toàn bộ quy trình nếu chỉ sai tại một lớp hồ sơ.


## Trang: MS18.4 - Quyết định phê duyệt & đăng tải KHLCNT

47 nhãn (theo thứ tự trong tệp, không phải thứ tự luồng):

- MS18.4 - LẬP QUYẾT ĐỊNH PHÊ DUYỆT & ĐĂNG TẢI KHLCNT
- Căn cứ: Điều 23, Điều 26 QĐ 12869. Đăng tải trong vòng 05 ngày làm việc kể từ ngày được phê duyệt.
- MS18.4 · QUYẾT ĐỊNH PHÊ DUYỆT & ĐĂNG TẢI
- MS18.4
- Đơn vị lập/trình KHLCNT
- 3. Kiểm tra, cập nhật dự thảo Quyết định Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: Văn bản: Quyết định phê duyệt KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT + hồ sơ KHLCNT
- 6. Xác nhận trình ký Quyết định Tác nhân: Đơn vị lập/trình KHLCNT Thực hiện: User xác nhận trên ĐTMS Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT
- Quay lại SP1
- Quay lại SP2
- Quay lại SP3
- Chủ đầu tư
- 12. Kiểm tra thông tin trước khi đăng tải Tác nhân: Chủ đầu tư Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt + Quyết định phê duyệt KHLCNT
- ×
- Có thông tin không được công bố?
- 13. Rà soát phạm vi công bố và loại trừ dữ liệu hạn chế Tác nhân: Chủ đầu tư Thực hiện: Ngoại lệ: tài liệu mật, bí mật Tập đoàn, thông tin QPAN không được công bố Biểu mẫu/Hồ sơ: KHLCNT/QĐ phê duyệt + danh mục dữ liệu mật, bí mật Tập đoàn, thông tin QPAN không được công bố
- 14. Xác nhận đăng tải KHLCNT Tác nhân: Chủ đầu tư Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt (nội dung cuối cùng để đăng tải)
- Người ký / Người có thẩm quyền
- Phê duyệt?
- Nội dung cần sửa thuộc đâu?
- Hệ thống ĐTMS/Tích hợp/AI
- Bắt đầu SP4
- 1. Tổng hợp hồ sơ đủ điều kiện phê duyệt Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Nguồn: thông tin gói thầu + Tờ trình + Báo cáo kiểm tra đã hoàn tất Biểu mẫu/Hồ sơ: Thông tin gói thầu/KHLCNT + Tờ trình đã ký + Báo cáo kiểm tra đã hoàn tất
- 2. Sinh dự thảo Quyết định phê duyệt KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Văn bản: Dự thảo Quyết định phê duyệt KHLCNT Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT
- 4. Kiểm tra nội dung trước khi trình người có thẩm quyền Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Rule: không chuyển khi còn lỗi/không khớp hồ sơ Biểu mẫu/Hồ sơ: Dự thảo Quyết định phê duyệt KHLCNT + hồ sơ KHLCNT
- Quyết định đạt kiểm tra?
- 9. Tóm tắt ý kiến không đồng ý và gợi ý thay đổi Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: phản hồi + gợi ý sửa Tờ trình Biểu mẫu/Hồ sơ: Ý kiến không đồng ý/phản hồi trên VOffice + dự thảo Quyết định + gợi ý AI
- 11. Sinh dữ liệu đăng tải KHLCNT Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thực hiện theo nội dung của bước và quy tắc nghiệp vụ tương ứng. Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt; Quyết định phê duyệt KHLCNT là căn cứ đăng tải
- 16. Ghi nhận thời điểm và trạng thái đăng tải Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Lưu vết phục vụ theo dõi mốc 05 ngày làm việc Biểu mẫu/Hồ sơ: Nhật ký/trạng thái đăng tải KHLCNT trên ĐTMS
- 17. Ghi nhận lỗi và cho phép gửi lại Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Thông tin: nguyên nhân lỗi, trạng thái chờ gửi lại Biểu mẫu/Hồ sơ: Thông tin lỗi đăng tải + trạng thái chờ gửi lại
- Hoàn tất MS18
- 5. Tóm tắt lỗi và gợi ý chỉnh sửa Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Đầu ra AI: NOK + gợi ý Biểu mẫu/Hồ sơ: Kết quả kiểm tra/NOK và gợi ý do AI sinh (không phải biểu mẫu quy định)
- Không
- 8. Xem xét/phê duyệt KHLCNT trên VOffice Tác nhân: Người có thẩm quyền phê duyệt KHLCNT Thực hiện: Người ký: Người có thẩm quyền Biểu mẫu/Hồ sơ: Quyết định phê duyệt KHLCNT
- 7. Tạo hồ sơ và luân chuyển trình ký Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: Sau khi người dùng xác nhận trên ĐTMS, hệ thống tạo hồ sơ và gửi qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice. Biểu mẫu/Hồ sơ: Hồ sơ VOffice kèm Quyết định phê duyệt KHLCNT
- 10. Nhận Quyết định đã ký từ VOffice Tác nhân: Hệ thống ĐTMS/Tích hợp/AI Thực hiện: ĐTMS nhận Quyết định đã ký từ VOffice và cập nhật trạng thái KHLCNT đã được phê duyệt. Biểu mẫu/Hồ sơ: Quyết định phê duyệt KHLCNT đã ký
- Cổng đấu thầu Viettel/ Hệ thống mạng ĐTQG
- 15. Đăng tải KHLCNT lên hệ thống phù hợp Tác nhân: Cổng đấu thầu Viettel / Hệ thống mạng ĐTQG Thực hiện: Cổng đấu thầu Viettel hoặc Hệ thống mạng đấu thầu quốc gia Biểu mẫu/Hồ sơ: KHLCNT đã được phê duyệt
- Đăng tải thành công?
- Sửa lại
- Có
- Thông tin gói
- Tờ trình
- Báo cáo kiểm tra
- Quyết định
- Gửi lại
- N01 · ĐĂNG TẢI KHLCNT Sau khi Quyết định phê duyệt KHLCNT được ký, Chủ đầu tư kiểm tra nội dung trước công bố và xác nhận đăng tải. KHLCNT phải được đăng tải trong vòng 05 ngày làm việc kể từ ngày được phê duyệt.
- N02 · DỮ LIỆU KHÔNG ĐƯỢC CÔNG BỐ Trước khi đăng tải, cần rà soát và loại trừ tài liệu mật, bí mật Tập đoàn và thông tin liên quan an ninh - quốc phòng không được công bố. Nếu đăng tải lỗi, hệ thống ghi nhận nguyên nhân và cho phép gửi lại.
