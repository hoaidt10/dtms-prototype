/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS13".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS13"] = {
 "page": "MS13",
 "count": 78,
 "tasks": {
  "1": {
   "name": "Chọn căn cứ và nội dung KĐT",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Không có mẫu riêng; Tài liệu đầu vào",
   "note": "Chọn tài liệu đầu vào/căn cứ lập KĐT đã được phê duyệt ở cấp áp dụng và xác định phạm vi nội dung KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "2": {
   "name": "Lấy dữ liệu căn cứ đã phê duyệt",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "Lấy thông tin từ các nguồn căn cứ đã chọn (kế hoạch, eBOM/mBOM và dữ liệu liên quan) để hỗ trợ lập KĐT.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "3": {
   "name": "AI gợi ý thông tin cơ bản KĐT",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tổng hợp/gợi ý thông tin cơ bản của KĐT từ tài liệu đầu vào; kết quả để người dùng rà soát, xác nhận.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "4": {
   "name": "Rà soát và xác nhận thông tin cơ bản",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "Không có mẫu riêng; thông tin là đầu vào BM-01",
   "note": "Rà soát, xác nhận mục đích, phạm vi/quy mô, giá trị, nguồn vốn, thời gian, biện pháp/kế hoạch thực hiện và độ Mật của ĐXMS.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "5": {
   "name": "Chọn/bóc tách căn cứ KĐT",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Không có",
   "note": "Bóc tách căn cứ theo dữ liệu có sẵn đến dòng/hạng mục dùng để lập nhu cầu KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "6": {
   "name": "Kiểm tra tồn kho",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có; dữ liệu Dự toán/eBOM/mBOM/Quản lý kho",
   "note": "Đối chiếu Dự toán, eBOM/mBOM và tồn kho; tính phần căn cứ còn dùng, loại phần đã dùng/đang hold.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "7": {
   "name": "Nhận thông tin rà soát tồn kho khả dụng",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Kết quả rà soát tồn kho theo Quy định QLTS",
   "note": "Nhận kết quả rà soát tồn kho khả dụng để đánh giá phần hàng tồn có thể sử dụng cho nhu cầu KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "8": {
   "name": "Khởi tạo / chỉnh sửa yêu cầu báo giá",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Yêu cầu báo giá theo Quy định TTMS",
   "note": "Căn cứ kết quả tồn kho, xác định danh mục/số lượng cần mua và lập yêu cầu báo giá. Trường hợp báo giá ko đạt yêu cầu thì chỉnh sửa lại yêu cầu báo giá.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "9": {
   "name": "Gửi yêu cầu báo giá",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Yêu cầu báo giá theo Quy định",
   "note": "Tự động gửi yêu cầu báo giá theo thông tin người dùng đã lập tới nhà cung cấp/đầu mối theo tích hợp.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "10": {
   "name": "Tổng hợp và kiểm tra báo giá",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Báo giá / Kết quả lấy báo giá",
   "note": "Tổng hợp báo giá, kiểm tra mức độ đáp ứng; chốt tổng mức vốn thực tế để hệ thống phân luồng MS13 / MS14 / MS15.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "11": {
   "name": "Xác nhận hình thành TSCĐ",
   "actor": "Ban Tài chính",
   "type": "user",
   "form": "Kết quả xác nhận TSCĐ; hồ sơ KĐT",
   "note": "Xác nhận Có / Không hình thành tài sản cố định và kết quả OK / NOT OK .",
   "lane": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)"
  },
  "12": {
   "name": "Xác nhận 04 yếu tố định danh",
   "actor": "TTMS",
   "type": "user",
   "form": "Thông tin định danh KĐT",
   "note": "Xác nhận Lĩnh vực; Loại KĐT; Giá tiền sơ bộ; Tính chất tài sản (Nguyên chiếc / Cần tích hợp). Trả kết quả OK / NOT OK.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "13": {
   "name": "Xác định thẩm quyền phê duyệt",
   "actor": "Hệ thống ĐTMS",
   "type": "service",
   "form": "Kết quả xác nhận tài sản, định danh KĐT; tổng mức vốn; quy định phân cấp / ủy quyền",
   "note": "Kiểm tra loại tài sản, loại/mục đích KĐT, tổng mức vốn và quy định ủy quyền áp dụng. Lưu riêng cấp duyệt chủ trương và cấp duyệt KĐT (VHT / Tập đoàn), căn cứ áp dụng. Tự tính lại trước trình ký nếu dữ liệu này thay đổi.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "14": {
   "name": "AI gợi ý thông tin cần chỉnh sửa",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Kết quả kiểm tra định danh; nội dung cần chỉnh sửa",
   "note": "AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐXMS đối chiếu và chỉnh sửa lại.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "15": {
   "name": "Hoàn thiện dự thảo KĐT",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM-00 hoặc BM-01/BM-03 theo nhánh đã xác định; Checklist tương ứng",
   "note": "Hoàn thiện dự thảo hồ sơ KĐT trên cơ sở kết quả tồn kho, báo giá và các căn cứ liên quan.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "16": {
   "name": "AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Đề xuất KĐT; dữ liệu căn cứ",
   "note": "Đọc căn cứ, dựng nháp và phân tích; không thay người phê duyệt.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "17": {
   "name": "Rà soát, bổ sung và hoàn thiện đề xuất",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Đề xuất KĐT đã rà soát",
   "note": "PA/PM rà soát nội dung AI, chuẩn bị trình thẩm định.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "18": {
   "name": "AI hỗ trợ lập dự thảo",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Dự thảo BM-00; tài liệu căn cứ",
   "note": "BM00 Đọc căn cứ, dựng nháp .",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "19": {
   "name": "Lập dự thảo văn bản gộp BM00",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-00; hồ sơ và tài liệu kèm theo",
   "note": "Rà soát nội dung AI, hoàn thiện BM-00. Chủ trương và KĐT chung một văn bản. Khi sửa sau từ chối phê duyệt, giữ vòng BM-00 và số lần họp.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "20": {
   "name": "Xin ý kiến Chỉ huy ĐVĐX",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-00",
   "note": "Gửi dự thảo văn bản gộp để xin ý kiến Chỉ huy ĐVĐX trước khi chuyển thẩm định.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "21": {
   "name": "Cho ý kiến dự thảo văn bản gộp",
   "actor": "Chỉ huy ĐVĐX",
   "type": "user",
   "form": "BM-00",
   "note": "Xem xét dự thảo BM-00. ĐVĐX tiếp thu, hoàn thiện theo ý kiến trước khi chuyển hồ sơ.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "22": {
   "name": "Lựa chọn CQCM thẩm định dự thảo",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Hồ sơ BM-00",
   "note": "Chủ động chọn danh sách CQCM thẩm định/phối hợp cho hồ sơ dự thảo. Hệ thống chuyển theo danh sách đã chọn.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "23": {
   "name": "Xác nhận danh sách CQCM BM-00",
   "actor": "CQCM chủ trì thẩm định tại VHT",
   "type": "user",
   "form": "Danh sách CQCM BM-00; kết quả xác nhận",
   "note": "Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "24": {
   "name": "Ký phiếu yêu cầu thẩm định",
   "actor": "Chỉ huy Đơn vị đề xuất",
   "type": "user",
   "form": "Phiếu yêu cầu thẩm định; BM-00; bộ đếm BM-00",
   "note": "Ký phiếu yêu cầu thẩm định hồ sơ gộp; hệ thống mở vòng BM-00 và khởi tạo bộ đếm họp = 0 lần đầu. Giữ số lần đã họp khi bổ sung hoặc trình lại.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "25": {
   "name": "AI gợi ý thông tin cần chỉnh sửa",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Kết quả kiểm tra hồ sơ; nội dung cần chỉnh sửa",
   "note": "AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐX KĐT đối chiếu và chỉnh sửa lại.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "26": {
   "name": "Bổ sung và hoàn chỉnh hồ sơ",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Hồ sơ dự thảo đã bổ sung; tài liệu kèm theo",
   "note": "Bổ sung hồ sơ theo yêu cầu; giữ loại hồ sơ và số lần họp của vòng hiện tại. Chuyển đúng bước chọn lại CQCM của BM-00, BM-01 hoặc BM-03.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "27": {
   "name": "Thẩm định nội dung hồ sơ",
   "actor": "CQCM chủ trì / phối hợp",
   "type": "user",
   "form": "BM-00 / BM-01 / BM-03 theo giai đoạn; tài liệu căn cứ",
   "note": "Pháp lý, mục tiêu, nhu cầu, phạm vi, quy mô, tổng vốn và nội dung phù hợp giai đoạn.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "28": {
   "name": "AI gợi ý phản hồi",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Ý kiến thẩm định dự thảo",
   "note": "AI tổng hợp/gợi ý đưa ý kiến.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "29": {
   "name": "Thẩm định và gửi ý kiến chuyên môn",
   "actor": "CQCM phối hợp",
   "type": "user",
   "form": "Ý kiến thẩm định; BM-09/BM-10 khi áp dụng",
   "note": "CQCM thẩm định theo chức năng. Cấp VHT: ký ý kiến theo thành phần áp dụng. Cấp Tập đoàn: VHT rà soát nội bộ, không ký thẩm định. Không phát hành công văn phối hợp riêng.",
   "lane": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)"
  },
  "30": {
   "name": "AI gợi ý nội dung cần chỉnh sửa",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Ý kiến CQCM; nội dung cần sửa / giải trình",
   "note": "AI tổng hợp/gợi ý cần sửa đổi giải trình.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "31": {
   "name": "Bổ sung hồ sơ hoặc giải trình",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Văn bản giải trình",
   "note": "Làm rõ nội dung CQCM yêu cầu.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "32": {
   "name": "Họp thống nhất giải trình ĐVĐX – CQCM",
   "actor": "CQCM chủ trì",
   "type": "user",
   "form": "Biên bản/kết quả họp",
   "note": "Tổ chức họp ĐVĐX với CQCM khi chưa thống nhất nội dung. Mỗi vòng BM-00, BM-01 hoặc BM-03 được họp tối đa 02 lần; thống nhất sớm thì tiếp tục, không phải họp đủ 02 lần.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "33": {
   "name": "Ghi nhận lần họp và kết quả",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Biên bản họp; kết quả; bộ đếm riêng BM-00 / BM-01 / BM-03",
   "note": "Tăng số lần họp của hồ sơ đang xử lý thêm 1; lưu biên bản và kết quả. Đếm riêng BM-00, BM-01 và BM-03; không cộng dồn giữa các vòng, không cho tổ chức lần thứ 3.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "34": {
   "name": "Chuyên quản xác nhận sau họp",
   "actor": "Chuyên quản ĐVĐX",
   "type": "user",
   "form": "Biên bản họp; nội dung điều chỉnh; xác nhận chuyên quản",
   "note": "Rà soát và xác nhận nội dung điều chỉnh đã thống nhất sau họp, trước khi cho phép sửa thông tin hồ sơ.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "35": {
   "name": "Chỉ huy đơn vị xác nhận sau họp",
   "actor": "Chỉ huy ĐVĐX",
   "type": "user",
   "form": "Biên bản họp; nội dung điều chỉnh; xác nhận Chỉ huy",
   "note": "Duyệt lại nội dung điều chỉnh sau họp. Chỉ cho phép ĐVĐX cập nhật và trình ký khi đã có đủ xác nhận.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "36": {
   "name": "Cập nhật hồ sơ theo nội dung đã xác nhận",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Hồ sơ đã cập nhật; nội dung đã được xác nhận",
   "note": "Sửa thông tin theo nội dung Chuyên quản và Chỉ huy đơn vị đã xác nhận; chuyển rà soát lại để trình ký.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "37": {
   "name": "Báo cáo nội dung chưa thống nhất",
   "actor": "CQCM chủ trì / phối hợp",
   "type": "user",
   "form": "Báo cáo nội dung chưa thống nhất; hồ sơ liên quan",
   "note": "CQCM chủ trì báo cáo người có thẩm quyền.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "38": {
   "name": "Xem xét, kết luận nội dung chưa thống nhất",
   "actor": "Người có thẩm quyền tại VHT",
   "type": "user",
   "form": "Báo cáo nội dung chưa thống nhất; hồ sơ liên quan",
   "note": "Xem xét báo cáo và nội dung còn vướng mắc; kết luận để ĐVĐX tiếp tục bổ sung, giải trình hoặc dừng theo chỉ đạo.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "39": {
   "name": "Lập và hoàn thiện tờ trình chủ trương",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-01; Checklist 01",
   "note": "Mục tiêu, sự cần thiết, tổng vốn dự kiến, nguồn vốn, thời gian; trao đổi CQCM trước trình.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "40": {
   "name": "Kiểm tra hồ sơ trước trình",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Checklist 01",
   "note": "Đầu mối kiểm tra độc lập của đơn vị; không xóa dòng checklist khi thiếu tài liệu.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "41": {
   "name": "Chọn CQCM thẩm định chủ trương",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-01; Checklist 01",
   "note": "Chọn danh sách CQCM tại khâu kiểm tra hồ sơ trước khi trình; hệ thống không tự cố định danh sách. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "42": {
   "name": "Xác nhận danh sách CQCM BM-01",
   "actor": "CQCM chủ trì thẩm định tại VHT",
   "type": "user",
   "form": "Danh sách CQCM BM-01; kết quả xác nhận",
   "note": "Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "43": {
   "name": "Trình hồ sơ tới các đầu mối",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-01; Checklist 01",
   "note": "CQCM chủ trì; cấp phó phụ trách nếu có; người có thẩm quyền theo nguồn.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "44": {
   "name": "HT/AI kiểm tra trước khi gửi",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "BM-01; Checklist 01; kết quả kiểm tra",
   "note": "Kiểm tra tính đầy đủ, hợp lệ trước khi gửi. Đạt: mở vòng thẩm định BM-01. Không đạt: trả ĐVĐX hoàn chỉnh hồ sơ rồi gửi lại để kiểm tra.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "45": {
   "name": "Mở vòng thẩm định chủ trương BM-01",
   "actor": "Hệ thống ĐTMS",
   "type": "service",
   "form": "BM-01; Checklist 01; bộ đếm BM-01",
   "note": "Gắn hồ sơ đang xử lý là BM-01. Khởi tạo bộ đếm họp BM-01 = 0 khi mở vòng lần đầu; giữ số lần đã họp khi bổ sung hoặc trình lại. Chuyển khối kiểm tra, giải trình, họp dùng chung.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "46": {
   "name": "Thẩm định và hoàn chỉnh hồ sơ chủ trương",
   "actor": "CQCM chủ trì thẩm định tại VHT",
   "type": "user",
   "form": "BM-01; Checklist 01; ý kiến CQCM",
   "note": "Kiểm tra căn cứ, mục tiêu, sự cần thiết, vốn dự kiến, nguồn vốn và thời gian; phối hợp ĐVĐX giải trình, hoàn thiện hồ sơ. Cấp Tập đoàn: chỉ thẩm định nội bộ, không ký thẩm định tại VHT.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "47": {
   "name": "Ký thẩm định trực tiếp trên tờ trình chủ trương",
   "actor": "CQCM chủ trì; cấp phó phụ trách nếu có",
   "type": "user",
   "form": "BM-01",
   "note": "Chỉ áp dụng cấp VHT: ký thẩm định trên BM-01 đã đủ điều kiện. Không lập báo cáo kết quả thẩm định chủ trương hoặc quyết định chủ trương riêng.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "48": {
   "name": "Ký phê duyệt chủ trương cấp VHT",
   "actor": "TGĐ VHT",
   "type": "user",
   "form": "BM-01",
   "note": "Xem xét hồ sơ đã thẩm định và ký phê duyệt trực tiếp trên BM-01. Không áp dụng cho chủ trương thuộc thẩm quyền Tập đoàn.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "49": {
   "name": "AI gợi ý thông tin lập hồ sơ phê duyệt KĐT",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-03; Checklist 02",
   "note": "AI tổng hợp/gợi ý từ các thông tin đã có để lập hồ sơ phê duyệt.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "50": {
   "name": "Lập hồ sơ phê duyệt KĐT",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-03; Checklist 02; chủ trương đã duyệt",
   "note": "Rà soát nội dung AI, trao đổi CQCM và hoàn thiện BM-03. Khi sửa sau từ chối phê duyệt KĐT, giữ chủ trương đã duyệt và số lần họp BM-03.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "51": {
   "name": "Kiểm tra và trình hồ sơ",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Checklist 02; hồ sơ KĐT",
   "note": "Kiểm tra độc lập đầy đủ, hợp lệ; gửi CQCM chủ trì.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "52": {
   "name": "Lựa chọn CQCM thẩm định KĐT",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-03; Checklist 02",
   "note": "Sau khi kiểm tra hồ sơ, chủ động chọn danh sách CQCM thẩm định. Luồng xử lý tiếp theo áp dụng tương tự khâu dự thảo. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "53": {
   "name": "Xác nhận danh sách CQCM BM-03",
   "actor": "CQCM chủ trì thẩm định tại VHT",
   "type": "user",
   "form": "Danh sách CQCM BM-03; kết quả xác nhận",
   "note": "Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "54": {
   "name": "Mở vòng thẩm định KĐT BM-03",
   "actor": "Hệ thống ĐTMS",
   "type": "service",
   "form": "BM-03; Checklist 02; chủ trương đã duyệt; bộ đếm BM-03",
   "note": "Sau khi chủ trương được duyệt, mở vòng BM-03. Khởi tạo bộ đếm BM-03 = 0 lần đầu; độc lập với BM-01 và giữ số lần khi sửa/trình lại. Chuyển khối kiểm tra, giải trình, họp dùng chung.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "55": {
   "name": "Thẩm định hồ sơ KĐT tại VHT",
   "actor": "TTMS / CQCM chủ trì thẩm định tại VHT",
   "type": "user",
   "form": "BM-03; Checklist 02; ý kiến CQCM",
   "note": "Kiểm tra căn cứ, mục tiêu, nhu cầu, phạm vi, tổng vốn, nguồn vốn và nội dung hồ sơ; phối hợp ĐVĐX giải trình, hoàn thiện. Nhánh Tập đoàn không ký thẩm định tại VHT.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "56": {
   "name": "Ký tờ trình phê duyệt KĐT",
   "actor": "Chỉ huy Đơn vị đề xuất",
   "type": "user",
   "form": "BM-03; Checklist 02",
   "note": "Ký tờ trình BM-03 đại diện ĐVĐX trước khi TTMS ký báo cáo thẩm định và trình quyết định phê duyệt cấp VHT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "57": {
   "name": "Ký báo cáo thẩm định và soạn dự thảo quyết định",
   "actor": "TTMS / CQCM chủ trì thẩm định cấp VHT",
   "type": "user",
   "form": "BM-14; dự thảo BM-18",
   "note": "Tổng hợp kết quả và ký Báo cáo thẩm định KĐT BM-14; soạn dự thảo Quyết định BM-18, trình TGĐ VHT ký ban hành. TTMS không ký quyết định.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "58": {
   "name": "AI tóm tắt phản hồi và gợi ý điều chỉnh",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có mẫu riêng; hồ sơ / kết quả tại bước này",
   "note": "AI tóm tắt phản hồi và gợi ý điều chỉnh cho ĐVĐX",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "59": {
   "name": "Hoàn chỉnh hồ sơ theo hướng dẫn",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Hồ sơ; giải trình",
   "note": "Tiếp tục hoàn chỉnh hoặc thực hiện hướng dẫn của CQCM chủ trì.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "60": {
   "name": "Ký ban hành quyết định phê duyệt KĐT cấp VHT",
   "actor": "TGĐ VHT",
   "type": "user",
   "form": "BM-03; BM-14; BM-18",
   "note": "Xem xét hồ sơ và BM-14 đã được cơ quan chủ trì ký; ký ban hành Quyết định BM-18 thuộc thẩm quyền VHT.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "61": {
   "name": "Hoàn thiện và trình ký hồ sơ gộp cấp VHT",
   "actor": "Đơn vị đề xuất; TTMS / CQCM chủ trì",
   "type": "user",
   "form": "BM-00; BM-14; dự thảo BM-18",
   "note": "ĐVĐX hoàn thiện BM-00. TTMS tổng hợp, ký báo cáo thẩm định BM-14 và soạn dự thảo BM-18; trình TGĐ VHT phê duyệt trong một giai đoạn gộp, không tách BM-01 / BM-03.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "62": {
   "name": "Ký phê duyệt hồ sơ gộp cấp VHT",
   "actor": "TGĐ VHT",
   "type": "user",
   "form": "BM-00; BM-14; BM-18",
   "note": "Xem xét BM-00 và báo cáo thẩm định BM-14; ký hồ sơ gộp và ban hành BM-18 trong một giai đoạn. TTMS không ký quyết định.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "63": {
   "name": "AI hỗ trợ dự thảo công văn trình Tập đoàn",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Công văn trình Tập đoàn; dự thảo BM-01 / BM-03 / BM-00",
   "note": "Dựa trên hồ sơ chủ trương, KĐT hoặc hồ sơ gộp đã được phân cấp Tập đoàn, hỗ trợ soạn công văn gửi Tập đoàn và tập hợp dự thảo hồ sơ; ĐVĐX rà soát trước trình.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "64": {
   "name": "Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn",
   "actor": "Đơn vị đề xuất VHT",
   "type": "user",
   "form": "Công văn; BM-01 / BM-03 / BM-00; căn cứ kèm theo",
   "note": "Rà soát dự thảo công văn, căn cứ và hồ sơ đã thẩm định nội bộ; hoàn thiện bộ tài liệu để TGĐ VHT ký công văn trình lần đầu. Giai đoạn thẩm định tại VHT không ký.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "65": {
   "name": "Ký công văn trình hồ sơ lên Tập đoàn",
   "actor": "TGĐ VHT",
   "type": "user",
   "form": "Công văn đã ký; dự thảo BM-01 / BM-03 / BM-00",
   "note": "Xem xét và ký công văn kèm dự thảo hồ sơ đề nghị Tập đoàn xử lý theo thẩm quyền. Đây là ký trình hồ sơ, không phải VHT phê duyệt thay Tập đoàn.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "66": {
   "name": "Chuyển hồ sơ đã ký lên Tập đoàn",
   "actor": "Hệ thống ĐTMS / Tích hợp VOffice",
   "type": "service",
   "form": "Công văn đã ký; hồ sơ gửi; trạng thái/PDF hoặc scan",
   "note": "Chuyển hồ sơ đã ký tới Tập đoàn. VOffice: gửi qua tích hợp, nhận trạng thái/PDF tự động. Bản cứng: ghi nhận chuyển bộ hồ sơ giấy và tài liệu đã cập nhật tại bước 78 (khối KÝ CHUNG).",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "67": {
   "name": "Thẩm định và gửi phiếu nhận xét về VHT",
   "actor": "Các Ban chuyên môn Tập đoàn",
   "type": "user",
   "form": "BM-09 / BM-10; hồ sơ trình Tập đoàn",
   "note": "Xem xét hồ sơ theo chức năng, lập và gửi phiếu/văn bản nhận xét để ĐVĐX thuộc VHT tiếp thu, bổ sung, giải trình. Chủ trương dùng BM-09; KĐT dùng BM-10.",
   "lane": "Các Ban chuyên môn / Ban ĐTXD Tập đoàn"
  },
  "68": {
   "name": "Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại",
   "actor": "Đơn vị đề xuất VHT",
   "type": "user",
   "form": "Báo cáo giải trình; BM-06; BM-01 / BM-03 / BM-00",
   "note": "Trực tiếp tiếp thu ý kiến Tập đoàn, sửa hồ sơ và lập báo cáo giải trình; hoàn thiện bộ hồ sơ để TGĐ VHT ký trình lại. Hồ sơ bị trả về ở khâu sau cũng quay lại bước này, không qua đầu mối trung gian.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "69": {
   "name": "Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn",
   "actor": "TGĐ VHT / lãnh đạo được ủy quyền",
   "type": "user",
   "form": "Báo cáo giải trình; BM-06; bộ hồ sơ hoàn thiện",
   "note": "Ký trình lại báo cáo giải trình và bộ hồ sơ đã hoàn thiện sau nhận xét. Đối với hồ sơ chủ trương, TGĐ VHT ký trình chính thức; KĐT có thể do lãnh đạo được ủy quyền ký.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "70": {
   "name": "Tiếp nhận và kiểm tra hồ sơ hoàn thiện",
   "actor": "Ban Đầu tư – Xây dựng Tập đoàn",
   "type": "user",
   "form": "Bộ hồ sơ hoàn thiện; báo cáo giải trình; ý kiến CQCM",
   "note": "Kiểm tra hồ sơ đã được VHT ký trình lại, việc tiếp thu và giải trình các ý kiến. Nếu chưa đủ điều kiện, trả trực tiếp ĐVĐX bổ sung và VHT ký trình lại.",
   "lane": "Các Ban chuyên môn / Ban ĐTXD Tập đoàn"
  },
  "71": {
   "name": "Hoàn thiện hồ sơ chủ trương và ký các Ban",
   "actor": "Các Ban chuyên môn / Ban ĐTXD Tập đoàn",
   "type": "user",
   "form": "BM-01 có chân ký các Ban; hồ sơ chủ trương",
   "note": "Hoàn thiện hồ sơ chủ trương MS13 và thực hiện các chân ký của phòng ban Tập đoàn trên BM-01 trước khi TGĐ Tập đoàn ký trực tiếp. Không lập báo cáo thẩm định chủ trương hoặc quyết định riêng.",
   "lane": "Các Ban chuyên môn / Ban ĐTXD Tập đoàn"
  },
  "72": {
   "name": "Lập báo cáo thẩm định và dự thảo quyết định",
   "actor": "Ban Đầu tư – Xây dựng Tập đoàn",
   "type": "user",
   "form": "BM-14; dự thảo BM-18; BM-03 / BM-00",
   "note": "Áp dụng hồ sơ KĐT hoặc BM-00 gộp: tổng hợp ý kiến, lập và ký Báo cáo kết quả thẩm định BM-14; soạn dự thảo Quyết định BM-18 để TGĐ Tập đoàn phê duyệt. BM-00 vẫn là một giai đoạn gộp.",
   "lane": "Các Ban chuyên môn / Ban ĐTXD Tập đoàn"
  },
  "73": {
   "name": "Ký phê duyệt hồ sơ cấp Tập đoàn",
   "actor": "TGĐ Tập đoàn",
   "type": "user",
   "form": "BM-01 hoặc BM-14 và BM-18",
   "note": "Chủ trương MS13: ký trực tiếp BM-01 đã có chân ký các Ban. KĐT hoặc hồ sơ gộp BM-00: xem xét BM-14 và ký ban hành BM-18. Không quay về TGĐ VHT phê duyệt thay Tập đoàn.",
   "lane": "Tổng GĐ Tập đoàn"
  },
  "74": {
   "name": "Nhận kết quả phê duyệt và lưu hồ sơ",
   "actor": "Hệ thống ĐTMS / Tích hợp VOffice",
   "type": "service",
   "form": "BM-01 hoặc BM-18 đã ký; PDF/scan; trạng thái",
   "note": "VOffice: nhận trạng thái/PDF tự động. Bản cứng: dùng trạng thái/scan đã cập nhật tại bước 78 (khối KÝ CHUNG). Lưu kết quả; chủ trương riêng được duyệt thì lập KĐT; KĐT/BM-00 được duyệt thì kết thúc.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "75": {
   "name": "Chọn hình thức ký",
   "actor": "Người trình hồ sơ",
   "type": "user",
   "form": "Hồ sơ không Mật; hình thức ký",
   "note": "Chọn VOffice hoặc bản cứng cho hồ sơ không Mật. Hệ thống lưu hình thức ký của lần trình hiện tại.",
   "lane": ""
  },
  "76": {
   "name": "Trình và nhận kết quả ký VOffice",
   "actor": "Hệ thống ĐTMS / VOffice",
   "type": "service",
   "form": "Hồ sơ trình ký; trạng thái; PDF đã ký",
   "note": "API gửi hồ sơ và luồng tới VOffice. Người có thẩm quyền ký/duyệt. Webhook trả trạng thái và PDF đã ký; ĐTMS lưu kết quả tự động, không xác nhận thủ công.",
   "lane": ""
  },
  "77": {
   "name": "Thực hiện ký bản cứng",
   "actor": "Người trình; người có thẩm quyền ký",
   "type": "user",
   "form": "Bộ hồ sơ bản cứng; văn bản ký / ý kiến xử lý",
   "note": "In và trình bản cứng theo đúng người ký, thứ tự ký tại bước hiện tại. Hồ sơ Mật bắt buộc theo nhánh này; không gửi hồ sơ Mật qua VOffice.",
   "lane": ""
  },
  "78": {
   "name": "Cập nhật kết quả ký bản cứng",
   "actor": "Người phụ trách hồ sơ",
   "type": "user",
   "form": "Trạng thái; scan văn bản; ý kiến xử lý",
   "note": "Cập nhật trạng thái, đính kèm bản scan và ý kiến xử lý. Với hồ sơ Mật, cập nhật và lưu tài liệu trong phạm vi được phép theo quy định bảo mật.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Hồ sơ Mật?"
  },
  "G2": {
   "kind": "xor",
   "name": "Chọn ký VOffice?"
  },
  "G3": {
   "kind": "xor",
   "name": "Đã ghi nhận kết quả ký?"
  },
  "G4": {
   "kind": "xor",
   "name": "Đủ thông tin căn cứ?"
  },
  "G5": {
   "kind": "xor",
   "name": "Báo giá đạt yêu cầu?"
  },
  "G6": {
   "kind": "and",
   "name": "Gửi đồng thời 02 yêu cầu xác nhận"
  },
  "G7": {
   "kind": "and",
   "name": "Đã nhận đủ 02 kết quả xác nhận"
  },
  "G8": {
   "kind": "xor",
   "name": "Cả 02 xác nhận đều OK?"
  },
  "G9": {
   "kind": "xor",
   "name": "Tổng mức vốn thực tế thuộc MS13?"
  },
  "G10": {
   "kind": "xor",
   "name": "Đủ 03 điều kiện lập hồ sơ gộp BM-00?"
  },
  "G11": {
   "kind": "xor",
   "name": "Danh sách CQCM được phê duyệt?"
  },
  "G12": {
   "kind": "xor",
   "name": "Hồ sơ cần sửa thuộc vòng nào?"
  },
  "G13": {
   "kind": "xor",
   "name": "Hồ sơ đủ điều kiện thẩm định?"
  },
  "G14": {
   "kind": "xor",
   "name": "Cần ý kiến CQCM liên quan?"
  },
  "G15": {
   "kind": "xor",
   "name": "Cần sửa đổi hoặc giải trình?"
  },
  "G16": {
   "kind": "xor",
   "name": "Hồ sơ đã thống nhất thuộc vòng nào?"
  },
  "G17": {
   "kind": "xor",
   "name": "Đã thống nhất nội dung?"
  },
  "G18": {
   "kind": "xor",
   "name": "Vòng hiện tại đã họp dưới 02 lần?"
  },
  "G19": {
   "kind": "xor",
   "name": "Sau họp đã thống nhất?"
  },
  "G20": {
   "kind": "xor",
   "name": "Kết luận xử lý nội dung chưa thống nhất?"
  },
  "G21": {
   "kind": "xor",
   "name": "DS CQCM BM-01 được duyệt?"
  },
  "G22": {
   "kind": "xor",
   "name": "AI kiểm tra đạt?"
  },
  "G23": {
   "kind": "xor",
   "name": "Chủ trương thuộc cấp duyệt nào đã xác định?"
  },
  "G24": {
   "kind": "xor",
   "name": "Đồng ý phê duyệt chủ trương?"
  },
  "G25": {
   "kind": "xor",
   "name": "Ý kiến chỉ đạo xử lý?"
  },
  "G26": {
   "kind": "xor",
   "name": "DS CQCM BM-03 được duyệt?"
  },
  "G27": {
   "kind": "xor",
   "name": "KĐT thuộc cấp duyệt nào đã xác định?"
  },
  "G28": {
   "kind": "xor",
   "name": "Báo cáo thẩm định được thông qua?"
  },
  "G29": {
   "kind": "xor",
   "name": "Đồng ý phê duyệt KĐT?"
  },
  "G30": {
   "kind": "xor",
   "name": "Hồ sơ gộp thuộc cấp duyệt nào đã xác định?"
  },
  "G31": {
   "kind": "xor",
   "name": "Đồng ý phê duyệt hồ sơ gộp?"
  },
  "G32": {
   "kind": "xor",
   "name": "Đồng ý ký công văn trình?"
  },
  "G33": {
   "kind": "xor",
   "name": "Hồ sơ hoàn thiện đạt yêu cầu?"
  },
  "G34": {
   "kind": "xor",
   "name": "Hồ sơ chủ trương riêng?"
  },
  "G35": {
   "kind": "xor",
   "name": "Đồng ý phê duyệt hồ sơ?"
  },
  "G36": {
   "kind": "xor",
   "name": "Là Chủ trương riêng hay hồ sơ gộp đã được duyệt?"
  }
 },
 "events": {
  "S2": {
   "kind": "start",
   "name": "Đến bước trình ký"
  },
  "S": {
   "kind": "start",
   "name": "Phát sinh nhu cầu lập KĐT"
  },
  "E1": {
   "kind": "end",
   "name": "Trở về bước hiện tại: xử lý Đồng ý / Không đồng ý theo luồng chính"
  },
  "E2": {
   "kind": "end",
   "name": "Chuyển xử lý theo MS14 / MS15"
  },
  "E3": {
   "kind": "end",
   "name": "Dừng quy trình"
  },
  "E4": {
   "kind": "end",
   "name": ""
  },
  "E5": {
   "kind": "end",
   "name": "Quyết định phê duyệt KĐT"
  },
  "E6": {
   "kind": "end",
   "name": "Kết quả phê duyệt / chỉ đạo"
  },
  "E7": {
   "kind": "end",
   "name": "Hoàn tất phê duyệt cấp Tập đoàn"
  }
 },
 "edges": [
  [
   "1",
   "2",
   ""
  ],
  [
   "2",
   "3",
   ""
  ],
  [
   "3",
   "4",
   ""
  ],
  [
   "4",
   "5",
   ""
  ],
  [
   "5",
   "6",
   ""
  ],
  [
   "6",
   "G4",
   ""
  ],
  [
   "7",
   "8",
   ""
  ],
  [
   "8",
   "9",
   ""
  ],
  [
   "9",
   "10",
   ""
  ],
  [
   "10",
   "G5",
   ""
  ],
  [
   "11",
   "G7",
   ""
  ],
  [
   "12",
   "G7",
   ""
  ],
  [
   "13",
   "G9",
   ""
  ],
  [
   "14",
   "10",
   ""
  ],
  [
   "15",
   "16",
   ""
  ],
  [
   "16",
   "17",
   ""
  ],
  [
   "17",
   "G10",
   ""
  ],
  [
   "18",
   "19",
   ""
  ],
  [
   "19",
   "20",
   ""
  ],
  [
   "20",
   "21",
   ""
  ],
  [
   "21",
   "22",
   ""
  ],
  [
   "22",
   "23",
   ""
  ],
  [
   "23",
   "G11",
   "Đã xác nhận"
  ],
  [
   "24",
   "G13",
   ""
  ],
  [
   "25",
   "26",
   ""
  ],
  [
   "26",
   "G12",
   "Đã sửa hồ sơ"
  ],
  [
   "27",
   "G14",
   ""
  ],
  [
   "28",
   "29",
   ""
  ],
  [
   "29",
   "G15",
   ""
  ],
  [
   "30",
   "31",
   "Rà soát và xử lý"
  ],
  [
   "31",
   "G17",
   ""
  ],
  [
   "32",
   "33",
   ""
  ],
  [
   "33",
   "G19",
   ""
  ],
  [
   "34",
   "35",
   ""
  ],
  [
   "35",
   "36",
   ""
  ],
  [
   "36",
   "27",
   ""
  ],
  [
   "37",
   "38",
   ""
  ],
  [
   "38",
   "G20",
   ""
  ],
  [
   "39",
   "40",
   ""
  ],
  [
   "40",
   "41",
   ""
  ],
  [
   "41",
   "42",
   ""
  ],
  [
   "42",
   "G21",
   "Đã xác nhận"
  ],
  [
   "43",
   "44",
   "Yêu cầu gửi"
  ],
  [
   "44",
   "G22",
   ""
  ],
  [
   "45",
   "G13",
   "Vòng BM-01"
  ],
  [
   "46",
   "G23",
   ""
  ],
  [
   "47",
   "48",
   ""
  ],
  [
   "48",
   "G24",
   ""
  ],
  [
   "49",
   "50",
   ""
  ],
  [
   "50",
   "51",
   ""
  ],
  [
   "51",
   "52",
   ""
  ],
  [
   "52",
   "53",
   ""
  ],
  [
   "53",
   "G26",
   "Đã xác nhận"
  ],
  [
   "54",
   "G13",
   "Vòng BM-03"
  ],
  [
   "55",
   "G27",
   ""
  ],
  [
   "56",
   "57",
   ""
  ],
  [
   "57",
   "G28",
   ""
  ],
  [
   "58",
   "59",
   ""
  ],
  [
   "59",
   "50",
   "Hoàn chỉnh"
  ],
  [
   "60",
   "G29",
   ""
  ],
  [
   "61",
   "62",
   ""
  ],
  [
   "62",
   "G31",
   ""
  ],
  [
   "63",
   "64",
   ""
  ],
  [
   "64",
   "65",
   ""
  ],
  [
   "65",
   "G32",
   ""
  ],
  [
   "66",
   "67",
   ""
  ],
  [
   "67",
   "68",
   ""
  ],
  [
   "68",
   "69",
   ""
  ],
  [
   "69",
   "70",
   ""
  ],
  [
   "70",
   "G33",
   ""
  ],
  [
   "71",
   "73",
   ""
  ],
  [
   "72",
   "73",
   ""
  ],
  [
   "73",
   "G35",
   ""
  ],
  [
   "74",
   "G36",
   ""
  ],
  [
   "75",
   "G2",
   ""
  ],
  [
   "76",
   "G3",
   "Đã nhận callback"
  ],
  [
   "77",
   "78",
   "Đã xử lý ký"
  ],
  [
   "78",
   "G3",
   "Đã lưu"
  ],
  [
   "G1",
   "75",
   "Không Mật"
  ],
  [
   "G1",
   "77",
   "Mật: bắt buộc bản cứng"
  ],
  [
   "G2",
   "77",
   "Bản cứng"
  ],
  [
   "G2",
   "76",
   "VOffice"
  ],
  [
   "G3",
   "E1",
   "Đủ trạng thái / tài liệu theo kết quả"
  ],
  [
   "G4",
   "7",
   "Đủ"
  ],
  [
   "G4",
   "4",
   "Chưa đủ"
  ],
  [
   "G5",
   "G6",
   "Đạt"
  ],
  [
   "G5",
   "8",
   "Không đạt: sửa yêu cầu báo giá"
  ],
  [
   "G6",
   "11",
   "Xác nhận TSCĐ"
  ],
  [
   "G6",
   "12",
   "Xác nhận 04 yếu tố"
  ],
  [
   "G7",
   "G8",
   ""
  ],
  [
   "G8",
   "13",
   "OK"
  ],
  [
   "G8",
   "14",
   "NOT OK"
  ],
  [
   "G9",
   "E2",
   "Không thuộc MS13"
  ],
  [
   "G9",
   "15",
   "Thuộc MS13"
  ],
  [
   "G10",
   "39",
   "Không đủ (tức thuộc các trường hợp còn lại) → BM-01 và BM-03"
  ],
  [
   "G10",
   "18",
   "Đủ cả 03 điều kiện → BM-00"
  ],
  [
   "G11",
   "22",
   "Không đồng ý"
  ],
  [
   "G11",
   "24",
   "Đồng ý"
  ],
  [
   "G12",
   "22",
   "BM-00: chọn lại CQCM dự thảo"
  ],
  [
   "G12",
   "41",
   "BM-01: chọn lại CQCM chủ trương"
  ],
  [
   "G12",
   "52",
   "BM-03: chọn lại CQCM KĐT"
  ],
  [
   "G13",
   "27",
   "Đủ điều kiện"
  ],
  [
   "G13",
   "25",
   "Chưa đủ điều kiện"
  ],
  [
   "G14",
   "G15",
   "Không"
  ],
  [
   "G14",
   "28",
   "Có"
  ],
  [
   "G15",
   "G16",
   "Không cần sửa / đã thống nhất"
  ],
  [
   "G15",
   "30",
   "Có"
  ],
  [
   "G16",
   "46",
   "BM-01: chủ trương"
  ],
  [
   "G16",
   "G30",
   "BM-00: gộp"
  ],
  [
   "G16",
   "55",
   "BM-03: KĐT"
  ],
  [
   "G17",
   "27",
   "Đã thống nhất"
  ],
  [
   "G17",
   "G18",
   "Chưa thống nhất"
  ],
  [
   "G18",
   "32",
   "Có: lần 1 hoặc lần 2"
  ],
  [
   "G18",
   "37",
   "Không: đã đủ 02 lần"
  ],
  [
   "G19",
   "G18",
   "Chưa thống nhất"
  ],
  [
   "G19",
   "34",
   "Đã thống nhất"
  ],
  [
   "G20",
   "E3",
   "Chỉ đạo dừng"
  ],
  [
   "G20",
   "31",
   "Bổ sung / giải trình"
  ],
  [
   "G21",
   "43",
   "Đồng ý"
  ],
  [
   "G21",
   "41",
   "Không đồng ý: chọn lại"
  ],
  [
   "G22",
   "45",
   "Đạt"
  ],
  [
   "G22",
   "39",
   "Không đạt: sửa hồ sơ"
  ],
  [
   "G23",
   "47",
   "Cấp VHT"
  ],
  [
   "G23",
   "63",
   "Cấp Tập đoàn – chủ trương"
  ],
  [
   "G24",
   "G25",
   "Không đồng ý"
  ],
  [
   "G24",
   "49",
   "Đồng ý"
  ],
  [
   "G25",
   "E4",
   "Chỉ đạo dừng"
  ],
  [
   "G25",
   "G10",
   "Tiếp tục xử lý"
  ],
  [
   "G26",
   "52",
   "Không đồng ý: chọn lại"
  ],
  [
   "G26",
   "54",
   "Đồng ý"
  ],
  [
   "G27",
   "56",
   "Cấp VHT"
  ],
  [
   "G27",
   "63",
   "Cấp Tập đoàn – KĐT"
  ],
  [
   "G28",
   "60",
   "Thông qua"
  ],
  [
   "G28",
   "58",
   "Không thông qua"
  ],
  [
   "G29",
   "E5",
   "Đồng ý"
  ],
  [
   "G29",
   "50",
   "Không đồng ý: sửa BM-03"
  ],
  [
   "G30",
   "61",
   "VHT"
  ],
  [
   "G30",
   "63",
   "Tập đoàn"
  ],
  [
   "G31",
   "E6",
   "Đồng ý"
  ],
  [
   "G31",
   "19",
   "Không đồng ý: sửa BM-00 / Không đồng ý"
  ],
  [
   "G32",
   "66",
   "Đồng ý"
  ],
  [
   "G32",
   "64",
   "Không đồng ý – hoàn thiện công văn"
  ],
  [
   "G33",
   "68",
   "Chưa đạt / cần bổ sung"
  ],
  [
   "G33",
   "G34",
   "Đạt"
  ],
  [
   "G34",
   "71",
   "Có – chủ trương"
  ],
  [
   "G34",
   "72",
   "Không – KĐT / BM-00"
  ],
  [
   "G35",
   "68",
   "Không đồng ý / yêu cầu sửa"
  ],
  [
   "G35",
   "74",
   "Đồng ý / đã ký"
  ],
  [
   "G36",
   "49",
   "Có – lập hồ sơ KĐT"
  ],
  [
   "G36",
   "E7",
   "Hồ sơ gộp– hoàn tất KĐT / hồ sơ gộp"
  ],
  [
   "S",
   "1",
   ""
  ],
  [
   "S2",
   "G1",
   ""
  ]
 ]
};
