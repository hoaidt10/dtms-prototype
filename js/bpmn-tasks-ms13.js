/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio, trang "MS13-TO BE".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS13"] = {
 "page": "MS13-TO BE",
 "count": 64,
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
   "form": "Không có",
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
   "note": "Căn cứ kết quả tồn kho, xác định danh mục/số lượng cần mua và lập yêu cầu báo giá.",
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
   "form": "Không có",
   "note": "Xác nhận Có / Không hình thành tài sản cố định và kết quả OK / NOT OK .",
   "lane": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)"
  },
  "12": {
   "name": "Xác nhận 04 yếu tố định danh",
   "actor": "TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Xác nhận Lĩnh vực; Loại KĐT; Giá tiền sơ bộ; Tính chất tài sản (Nguyên chiếc / Cần tích hợp). Trả kết quả OK / NOT OK.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "13": {
   "name": "AI gợi ý thông tin cần chỉnh sửa",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐXMS đối chiếu và chỉnh sửa lại.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "14": {
   "name": "Hoàn thiện dự thảo KĐT",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM-00 hoặc BM-01/BM-03 theo nhánh đã xác định; Checklist tương ứng",
   "note": "Hoàn thiện dự thảo hồ sơ KĐT trên cơ sở kết quả tồn kho, báo giá và các căn cứ liên quan.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "15": {
   "name": "AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT",
   "actor": "Hệ thống ĐTMS/Tích hợp AI",
   "type": "service",
   "form": "Không có",
   "note": "Đọc căn cứ, dựng nháp và phân tích; không thay người phê duyệt.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "16": {
   "name": "Rà soát, bổ sung và hoàn thiện đề xuất",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Không có",
   "note": "PA/PM rà soát nội dung AI, chuẩn bị trình thẩm định.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "17": {
   "name": "AI hỗ trợ lập dự thảo",
   "actor": "Hệ thống ĐTMS/Tích hợp AI",
   "type": "service",
   "form": "BM00",
   "note": "Đọc căn cứ, dựng nháp .",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "18": {
   "name": "Lập dự thảo văn bản gộp BM00",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM00",
   "note": "ĐVĐX rà soát nội dung AI gợi ý dự thảo. Chủ trương và KĐT chung một văn bản.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "19": {
   "name": "Xin ý kiến Chỉ huy ĐVĐX",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-00",
   "note": "Gửi dự thảo văn bản gộp để xin ý kiến Chỉ huy ĐVĐX trước khi chuyển thẩm định.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "20": {
   "name": "Cho ý kiến dự thảo văn bản gộp",
   "actor": "Chỉ huy ĐVĐX",
   "type": "user",
   "form": "BM-00",
   "note": "Xem xét dự thảo BM-00. ĐVĐX tiếp thu, hoàn thiện theo ý kiến trước khi chuyển hồ sơ.",
   "lane": ""
  },
  "21": {
   "name": "Lựa chọn CQCM thẩm định dự thảo",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Hồ sơ BM-00",
   "note": "Chủ động chọn danh sách CQCM thẩm định/phối hợp cho hồ sơ dự thảo. Hệ thống chuyển theo danh sách đã chọn.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "22": {
   "name": "AI gợi ý thông tin cần chỉnh sửa",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐX KĐT đối chiếu và chỉnh sửa lại.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "23": {
   "name": "Bổ sung và hoàn chỉnh hồ sơ",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Không có",
   "note": "Đơn vị kiểm tra lại trước khi gửi lại CQCM chủ trì.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "24": {
   "name": "Thẩm định nội dung hồ sơ",
   "actor": "Cơ quan chủ trì (TTMS)",
   "type": "user",
   "form": "Không có",
   "note": "Pháp lý, mục tiêu, nhu cầu, phạm vi, quy mô, tổng vốn và nội dung phù hợp giai đoạn.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "25": {
   "name": "AI gợi ý phản hồi",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tổng hợp/gợi ý đưa ý kiến.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "26": {
   "name": "Thẩm định và gửi ý kiến chuyên môn",
   "actor": "CQCM phối hợp",
   "type": "user",
   "form": "Ý kiến thẩm định; BM-09/BM-10 khi áp dụng",
   "note": "Các CQCM do ĐVĐX lựa chọn thẩm định theo chức năng và gửi ý kiến trực tiếp cho ĐVĐX, CQCM chủ trì. Không phát hành công văn đề nghị phối hợp thẩm định riêng.",
   "lane": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)"
  },
  "27": {
   "name": "AI gợi ý nội dung cần chỉnh sửa",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tổng hợp/gợi ý cần sửa đổi giải trình.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "28": {
   "name": "Bổ sung hồ sơ hoặc giải trình",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Không có",
   "note": "Làm rõ nội dung CQCM yêu cầu.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "29": {
   "name": "Họp thống nhất giải trình ĐVĐX – CQCM",
   "actor": "CQCM chủ trì",
   "type": "user",
   "form": "Biên bản/kết quả họp",
   "note": "Tổ chức họp giữa ĐVĐX và các CQCM để thống nhất nội dung giải trình. Tối đa 02 lần tổ chức họp cho hồ sơ.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "30": {
   "name": "Ghi nhận lần họp và kết quả",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Tăng số_lần_họp thêm 1 sau mỗi lần họp; lưu kết quả và chặn tổ chức lần thứ 3.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "31": {
   "name": "Chuyên quản xác nhận sau họp",
   "actor": "Chuyên quản ĐVĐX",
   "type": "user",
   "form": "Không có",
   "note": "Rà soát và xác nhận nội dung điều chỉnh đã thống nhất sau họp, trước khi cho phép sửa thông tin hồ sơ.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "32": {
   "name": "Chỉ huy đơn vị xác nhận sau họp",
   "actor": "Chỉ huy ĐVĐX",
   "type": "user",
   "form": "Không có",
   "note": "Duyệt lại nội dung điều chỉnh sau họp. Chỉ cho phép ĐVĐX cập nhật và trình ký khi đã có đủ xác nhận.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "33": {
   "name": "Cập nhật hồ sơ theo nội dung đã xác nhận",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "Không có",
   "note": "Sửa thông tin theo nội dung Chuyên quản và Chỉ huy đơn vị đã xác nhận; chuyển rà soát lại để trình ký.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "34": {
   "name": "Báo cáo nội dung chưa thống nhất",
   "actor": "Cơ quan chủ trì (TTMS)",
   "type": "user",
   "form": "Không có",
   "note": "CQCM chủ trì báo cáo người có thẩm quyền.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "35": {
   "name": "Xem xét, kết luận nội dung chưa thống nhất",
   "actor": "Thủ trưởng đơn vị VHT",
   "type": "user",
   "form": "Không có",
   "note": "Tái sử dụng task mốc MS0101_T32; không tự gán chức danh cụ thể hoặc nhánh chỉ đạo.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "36": {
   "name": "Lập và hoàn thiện tờ trình chủ trương",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM-01; Checklist 01",
   "note": "Mục tiêu, sự cần thiết, tổng vốn dự kiến, nguồn vốn, thời gian; trao đổi CQCM trước trình.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "37": {
   "name": "Kiểm tra hồ sơ trước trình",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Checklist 01",
   "note": "Đầu mối kiểm tra độc lập của đơn vị; không xóa dòng checklist khi thiếu tài liệu.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "38": {
   "name": "Chọn CQCM thẩm định chủ trương",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-01; Checklist 01",
   "note": "Chọn danh sách CQCM tại khâu kiểm tra hồ sơ trước khi trình; hệ thống không tự cố định danh sách. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "39": {
   "name": "Trình hồ sơ tới các đầu mối",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM-01; Checklist 01",
   "note": "CQCM chủ trì; cấp phó phụ trách nếu có; người có thẩm quyền theo nguồn.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "40": {
   "name": "HT/AI kiểm tra trước khi gửi",
   "actor": "Hệ thống ĐTMS/Tích hợp AI",
   "type": "service",
   "form": "Không có",
   "note": "Đạt: chuyển đúng đầu mối. Fail: trả lại người gửi sửa ngay tại bước hiện tại.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "41": {
   "name": "Thẩm định và hoàn chỉnh hồ sơ",
   "actor": "CQCM chủ trì",
   "type": "sub",
   "form": "BM-01; ý kiến CQCM",
   "note": "Theo danh sách CQCM do ĐVĐX chọn. Áp dụng cùng cơ chế thẩm định/giải trình như khâu dự thảo: tối đa 02 lần họp; đủ xác nhận của Chuyên quản và Chỉ huy ĐVĐX sau họp mới được cập nhật hồ sơ.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "42": {
   "name": "Ký thẩm định trực tiếp trên tờ trình trên Voffice",
   "actor": "Cơ quan chủ trì (TTMS)",
   "type": "user",
   "form": "BM-01",
   "note": "CQCM chủ trì và cấp phó phụ trách nếu có, theo quy trình.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "43": {
   "name": "Cho ý kiến nhận xét chủ trương",
   "actor": "Tổng GĐ Tập đoàn",
   "type": "user",
   "form": "Hồ sơ BM-01",
   "note": "Cho ý kiến nhận xét đối với nhánh thuộc cấp Tập đoàn; hồ sơ sau xử lý ý kiến được chuyển Thủ trưởng VHT ký chính thức.",
   "lane": "Tổng GĐ Tập đoàn"
  },
  "44": {
   "name": "Thủ trưởng VHT ký duyệt chủ trương qua Voffice",
   "actor": "Thủ trưởng VHT",
   "type": "user",
   "form": "BM-01",
   "note": "Ký chính thức tờ trình chủ trương sau thẩm định; tiếp thu ý kiến Tập đoàn đối với trường hợp thuộc nhánh phải xin ý kiến.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "45": {
   "name": "AI gợi ý thông tin lập hồ sơ phê duyệt KĐT",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tổng hợp/gợi ý từ các thông tin đã có để lập hồ sơ phê duyệt.",
   "lane": ""
  },
  "46": {
   "name": "Lập hồ sơ phê duyệt KĐT",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM-03; Checklist 02",
   "note": "Rà soát thông tin AI gợi ý; Trao đổi CQCM, bổ sung hồ sơ và giải trình các ý kiến đã có.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "47": {
   "name": "Kiểm tra và trình hồ sơ",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Checklist 02; hồ sơ KĐT",
   "note": "Kiểm tra độc lập đầy đủ, hợp lệ; gửi CQCM chủ trì.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "48": {
   "name": "Lựa chọn CQCM thẩm định tại Bước 47",
   "actor": "Đơn vị đề xuất",
   "type": "user",
   "form": "BM-03; Checklist 02",
   "note": "Sau khi kiểm tra hồ sơ, chủ động chọn danh sách CQCM thẩm định. Luồng xử lý tiếp theo áp dụng tương tự khâu dự thảo. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "49": {
   "name": "Tổ chức thẩm định KĐT",
   "actor": "CQCM chủ trì",
   "type": "sub",
   "form": "Hồ sơ BM-03; ý kiến CQCM",
   "note": "Theo danh sách CQCM do ĐVĐX chọn. Áp dụng cùng cơ chế thẩm định/giải trình như khâu dự thảo: tối đa 02 lần họp; đủ xác nhận của Chuyên quản và Chỉ huy ĐVĐX sau họp mới được cập nhật hồ sơ.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "50": {
   "name": "Cho ý kiến nhận xét KĐT",
   "actor": "Tổng GĐ Tập đoàn",
   "type": "user",
   "form": "Hồ sơ BM-03",
   "note": "Cho ý kiến nhận xét theo phân cấp; CQCM chủ trì tổng hợp, hoàn chỉnh BM-14 trước khi Thủ trưởng VHT ký BM-18.",
   "lane": ""
  },
  "51": {
   "name": "Lập, trình Báo cáo kết quả thẩm định",
   "actor": "CQCM chủ trì",
   "type": "user",
   "form": "BM-14",
   "note": "Tổng hợp kết quả thẩm định và các ý kiến đã được xử lý. Khi thông qua, chuyển trực tiếp sang Quyết định phê duyệt KĐT; không phát hành công văn thẩm định riêng.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "52": {
   "name": "AI tóm tắt phản hồi và gợi ý điều chỉnh",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "AI tóm tắt phản hồi và gợi ý điều chỉnh cho ĐVĐX",
   "lane": ""
  },
  "53": {
   "name": "Hoàn chỉnh hồ sơ theo hướng dẫn",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "Không có",
   "note": "Tiếp tục hoàn chỉnh hoặc thực hiện hướng dẫn của CQCM chủ trì.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "54": {
   "name": "[Voffice] Thủ trưởng VHT ký Quyết định phê duyệt KĐT",
   "actor": "Thủ trưởng VHT",
   "type": "user",
   "form": "BM-18; BM-14",
   "note": "Xem xét Báo cáo kết quả thẩm định và ký chính thức Quyết định phê duyệt KĐT. Không chèn bước phát hành công văn đề nghị thẩm định giữa BM-14 và BM-18.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "55": {
   "name": "Đơn vị đề xuất trình ký",
   "actor": "Đơn vị đề xuất KĐT",
   "type": "user",
   "form": "BM00",
   "note": "Sau khi CQCM thống nhất. Áp dụng nhánh cấp VHT.",
   "lane": "Đơn vị đề xuất KĐT"
  },
  "56": {
   "name": "[Voffice] Thủ trưởng VHT ký duyệt hồ sơ gộp",
   "actor": "Thủ trưởng VHT",
   "type": "user",
   "form": "BM-00",
   "note": "Ký chính thức hồ sơ gộp thuộc nhánh cấp VHT sau khi hoàn tất thẩm định.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "57": {
   "name": "AI soạn Công văn báo cáo TGĐ Tập đoàn",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-06",
   "note": "AI tạo dự thảo Công văn báo cáo TGĐ Tập đoàn về nội dung KĐT cho nhánh cần báo cáo.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "58": {
   "name": "Rà soát, cập nhật Công văn báo cáo TGĐ",
   "actor": "Cơ quan chủ trì KĐT (TTMS)",
   "type": "user",
   "form": "BM-06",
   "note": "TTMS rà soát, cập nhật dự thảo BM-06 trước khi trình Thủ trưởng đơn vị ký.",
   "lane": "Cơ quan chủ trì (TTMS)"
  },
  "59": {
   "name": "Xem xét, xác nhận trình ký Công văn báo cáo TGĐ",
   "actor": "Thủ trưởng đơn vị VHT",
   "type": "user",
   "form": "BM-06",
   "note": "Thủ trưởng đơn vị VHT xem xét và xác nhận BM-06 để chuyển ký/phát hành; văn bản do người đứng đầu đơn vị ký.",
   "lane": "Thủ trưởng đơn vị VHT"
  },
  "60": {
   "name": "Trình ký BM-06 qua VOffice và chuyển Ban ĐTXD",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-06",
   "note": "Tự động chuyển BM-06 sang VOffice để ký/phát hành và gửi Ban ĐTXD Tập đoàn.",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  },
  "61": {
   "name": "Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn",
   "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
   "type": "user",
   "form": "BM-06; BM-07",
   "note": "Ban ĐTXD xem xét hồ sơ/BM-06; nếu đủ điều kiện thì lập báo cáo gửi TGĐ Tập đoàn.",
   "lane": "Ban Đầu tư - Xây dựng Tập đoàn"
  },
  "62": {
   "name": "Gửi BM-07 đến TGĐ Tập đoàn",
   "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
   "type": "user",
   "form": "BM-07",
   "note": "Gửi BM-07 đến Tổng GĐ Tập đoàn để theo dõi, quản lý theo quy trình.",
   "lane": "Ban Đầu tư - Xây dựng Tập đoàn"
  },
  "63": {
   "name": "Xem xét và cho ý kiến về nội dung KĐT",
   "actor": "Tổng GĐ Tập đoàn",
   "type": "user",
   "form": "BM-07; tham chiếu hồ sơ/BM-06",
   "note": "Tiếp nhận, xem xét nội dung BM-07 theo thiết kế TO-BE; tài liệu quy trình xác định BM-07 được gửi TGĐ để theo dõi, quản lý.",
   "lane": "Tổng GĐ Tập đoàn"
  },
  "64": {
   "name": "Trình ký Voffice để Thủ trưởng VHT ký sau ý kiến Tập đoàn",
   "actor": "Hệ thống ĐTMS/Tích hợp AI",
   "type": "service",
   "form": "BM-00",
   "note": "Hệ thống ĐTMS/Tích hợp AI Tiếp nhận ý kiến nhận xét Tập đoàn,Tự động chuyển sang Voffice để Thủ trưởng VHT ký duyệt .",
   "lane": "Hệ thống ĐTMS/Tích hợp AI"
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Đủ thông tin căn cứ?"
  },
  "G2": {
   "kind": "and",
   "name": "AND: Gửi đồng thời 02 yêu cầu xác nhận"
  },
  "G3": {
   "kind": "and",
   "name": "AND: Đã nhận đủ 02 kết quả"
  },
  "G4": {
   "kind": "xor",
   "name": "Cả 02 xác nhận đều OK?"
  },
  "G5": {
   "kind": "xor",
   "name": "Báo giá đạt yêu cầu?"
  },
  "G6": {
   "kind": "xor",
   "name": "Tổng mức vốn thực tế thuộc MS13?"
  },
  "G7": {
   "kind": "xor",
   "name": "Mức vốn MS13 AND Nguyên chiếc AND Trang bị nội bộ?"
  },
  "G8": {
   "kind": "xor",
   "name": "TTMS Rà soát tính hợp lệ hồ sơ & Phê duyệt danh sách CQCM?"
  },
  "G9": {
   "kind": "xor",
   "name": "Hồ sơ đủ điều kiện thẩm định?"
  },
  "G10": {
   "kind": "xor",
   "name": "ĐVĐX Cần ý kiến CQCM liên quan?"
  },
  "G11": {
   "kind": "xor",
   "name": "Cần sửa đổi hoặc giải trình?"
  },
  "G12": {
   "kind": "xor",
   "name": "Đã thống nhất nội dung?"
  },
  "G13": {
   "kind": "xor",
   "name": "Số lần check thẩm định gián tiếp <= 02?"
  },
  "G14": {
   "kind": "xor",
   "name": "Sau họp đã thống nhất?"
  },
  "G15": {
   "kind": "xor",
   "name": "Kết luận để xử lý tiếp?"
  },
  "G16": {
   "kind": "xor",
   "name": "Cần ý kiến Tập đoàn về chủ trương?"
  },
  "G17": {
   "kind": "xor",
   "name": "Đồng ý ký duyệt chủ trương?"
  },
  "G18": {
   "kind": "xor",
   "name": "Ý kiến chỉ đạo?"
  },
  "G19": {
   "kind": "xor",
   "name": "Cần ý kiến Tập đoàn về KĐT?"
  },
  "G20": {
   "kind": "xor",
   "name": "Báo cáo được thông qua?"
  },
  "G21": {
   "kind": "xor",
   "name": "Đồng ý ký duyệt KĐT?"
  },
  "G22": {
   "kind": "xor",
   "name": "Phân cấp: VHT hay xin ý kiến Tập đoàn?"
  },
  "G23": {
   "kind": "xor",
   "name": "Kết quả phê duyệt / chỉ đạo?"
  },
  "G24": {
   "kind": "xor",
   "name": "Đồng ý trình ký BM-06?"
  },
  "G25": {
   "kind": "xor",
   "name": "Ban ĐTXD chấp nhận hồ sơ?"
  },
  "G26": {
   "kind": "xor",
   "name": "Ý kiến TGĐ Tập đoàn? [Q02]"
  },
  "G27": {
   "kind": "xor",
   "name": "Thủ trưởng VHT đồng ý ký duyệt?"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Phát sinh nhu cầu lập KĐT"
  },
  "E1": {
   "kind": "end",
   "name": ""
  },
  "E2": {
   "kind": "end",
   "name": ""
  },
  "E3": {
   "kind": "end",
   "name": "Quyết định phê duyệt KĐT"
  },
  "E4": {
   "kind": "end",
   "name": ""
  },
  "E5": {
   "kind": "end",
   "name": ""
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
   "G1",
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
   "G2",
   ""
  ],
  [
   "11",
   "G3",
   ""
  ],
  [
   "12",
   "G3",
   ""
  ],
  [
   "13",
   "10",
   ""
  ],
  [
   "14",
   "15",
   ""
  ],
  [
   "15",
   "16",
   ""
  ],
  [
   "16",
   "G7",
   ""
  ],
  [
   "17",
   "18",
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
   "G8",
   ""
  ],
  [
   "22",
   "23",
   "Không"
  ],
  [
   "23",
   "G8",
   "Gửi lại"
  ],
  [
   "24",
   "G10",
   ""
  ],
  [
   "25",
   "26",
   ""
  ],
  [
   "26",
   "G11",
   ""
  ],
  [
   "27",
   "28",
   "Rà soát và xử lý"
  ],
  [
   "28",
   "G12",
   ""
  ],
  [
   "29",
   "30",
   ""
  ],
  [
   "30",
   "G14",
   ""
  ],
  [
   "31",
   "32",
   ""
  ],
  [
   "32",
   "33",
   ""
  ],
  [
   "33",
   "24",
   ""
  ],
  [
   "34",
   "35",
   ""
  ],
  [
   "35",
   "G15",
   ""
  ],
  [
   "36",
   "37",
   ""
  ],
  [
   "37",
   "38",
   ""
  ],
  [
   "38",
   "39",
   ""
  ],
  [
   "39",
   "40",
   "Yêu cầu gửi"
  ],
  [
   "40",
   "41",
   "Đạt • chuyển hồ sơ"
  ],
  [
   "41",
   "42",
   ""
  ],
  [
   "42",
   "G16",
   ""
  ],
  [
   "43",
   "44",
   "Sau khi xử lý ý kiến"
  ],
  [
   "44",
   "G17",
   ""
  ],
  [
   "45",
   "46",
   ""
  ],
  [
   "46",
   "47",
   ""
  ],
  [
   "47",
   "48",
   ""
  ],
  [
   "48",
   "49",
   ""
  ],
  [
   "49",
   "G19",
   ""
  ],
  [
   "50",
   "51",
   "Sau khi xử lý ý kiến"
  ],
  [
   "51",
   "G20",
   ""
  ],
  [
   "52",
   "53",
   ""
  ],
  [
   "53",
   "46",
   "Hoàn chỉnh"
  ],
  [
   "54",
   "G21",
   ""
  ],
  [
   "55",
   "56",
   ""
  ],
  [
   "56",
   "G23",
   ""
  ],
  [
   "57",
   "58",
   ""
  ],
  [
   "58",
   "59",
   ""
  ],
  [
   "59",
   "G24",
   ""
  ],
  [
   "60",
   "61",
   ""
  ],
  [
   "61",
   "G25",
   ""
  ],
  [
   "62",
   "63",
   ""
  ],
  [
   "63",
   "G26",
   ""
  ],
  [
   "64",
   "G27",
   ""
  ],
  [
   "G1",
   "7",
   "Đủ"
  ],
  [
   "G1",
   "4",
   "Không đủ"
  ],
  [
   "G2",
   "11",
   ""
  ],
  [
   "G2",
   "12",
   ""
  ],
  [
   "G3",
   "G4",
   ""
  ],
  [
   "G4",
   "G6",
   "OK"
  ],
  [
   "G4",
   "13",
   "NOT OK: sửa lại"
  ],
  [
   "G5",
   "14",
   "Đạt"
  ],
  [
   "G5",
   "8",
   "Không đạt. chỉnh sửa lại"
  ],
  [
   "G6",
   "G5",
   "Có"
  ],
  [
   "G6",
   "X_MS14",
   "Không"
  ],
  [
   "G7",
   "36",
   "Không đủ (tức thuộc các trường hợp còn lại) → BM-01 và BM-03"
  ],
  [
   "G7",
   "17",
   "Đủ cả 03 điều kiện → BM-00"
  ],
  [
   "G8",
   "G9",
   "Đạt"
  ],
  [
   "G8",
   "21",
   "Không đạt, chỉnh sửa lại"
  ],
  [
   "G9",
   "24",
   "Có"
  ],
  [
   "G9",
   "22",
   ""
  ],
  [
   "G10",
   "G11",
   "Không"
  ],
  [
   "G10",
   "25",
   "Có"
  ],
  [
   "G11",
   "27",
   "Có"
  ],
  [
   "G11",
   "G22",
   "Không"
  ],
  [
   "G12",
   "24",
   "Có → rà soát lại"
  ],
  [
   "G12",
   "G13",
   "Chưa"
  ],
  [
   "G13",
   "29",
   "Có: lần 1 hoặc lần 2"
  ],
  [
   "G13",
   "34",
   "Không: đã đủ 02 lần"
  ],
  [
   "G14",
   "G13",
   "Chưa"
  ],
  [
   "G14",
   "31",
   "Đã thống nhất"
  ],
  [
   "G15",
   "E1",
   "Chỉ đạo dừng"
  ],
  [
   "G15",
   "28",
   "Có ý kiến chỉ đạo"
  ],
  [
   "G16",
   "44",
   "Cấp VHT"
  ],
  [
   "G16",
   "43",
   "Cấp Tập đoàn"
  ],
  [
   "G17",
   "G18",
   "Không"
  ],
  [
   "G17",
   "45",
   "Có"
  ],
  [
   "G18",
   "E2",
   "Chỉ đạo dừng"
  ],
  [
   "G18",
   "G7",
   "Chỉ đạo xử lý"
  ],
  [
   "G19",
   "51",
   "Cấp VHT"
  ],
  [
   "G19",
   "50",
   "Cấp Tập đoàn"
  ],
  [
   "G20",
   "54",
   "Có"
  ],
  [
   "G20",
   "52",
   "Không"
  ],
  [
   "G21",
   "E3",
   "Có"
  ],
  [
   "G21",
   "G7",
   "Không"
  ],
  [
   "G22",
   "55",
   "VHT"
  ],
  [
   "G22",
   "57",
   "Tập đoàn"
  ],
  [
   "G23",
   "E4",
   "Có"
  ],
  [
   "G23",
   "G7",
   "Không"
  ],
  [
   "G24",
   "60",
   "Đồng ý"
  ],
  [
   "G24",
   "27",
   "Không đồng ý"
  ],
  [
   "G25",
   "62",
   "Chấp nhận"
  ],
  [
   "G25",
   "27",
   "Trả lại"
  ],
  [
   "G26",
   "64",
   "Đã có ý kiến → VHT ký chính"
  ],
  [
   "G26",
   "27",
   "Trả lại"
  ],
  [
   "G27",
   "E5",
   "Có"
  ],
  [
   "G27",
   "16",
   "Không / Không"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
