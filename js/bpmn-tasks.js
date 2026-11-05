/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS01 v1.1" (61 task).
   Không sửa tay — chạy lại: node tools/bpmn-extract.mjs. `old` = số task ở bản 58 task cũ (MS01_01_TO_BE_VHT), trống = task mới. */
window.BPMN_SOURCE = {"file":"ĐTMS-121026.drawio","page":"MS01 v1.1","count":61};
window.BPMN_TASKS = {
 "1": {
  "name": "Chọn căn cứ và nội dung mua sắm",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "Không có mẫu riêng; Tài liệu đầu vào",
  "old": "1",
  "note": "Chọn tài liệu đầu vào/căn cứ lập ĐXMS đã được phê duyệt ở cấp áp dụng và xác định phạm vi nội dung mua sắm."
 },
 "2": {
  "name": "Lấy dữ liệu căn cứ đã phê duyệt",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "Không có",
  "old": "2",
  "note": "Lấy thông tin từ các nguồn căn cứ đã chọn (kế hoạch, eBOM/mBOM và dữ liệu liên quan) để hỗ trợ lập ĐXMS."
 },
 "3": {
  "name": "AI gợi ý thông tin cơ bản ĐXMS",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "Không có",
  "old": "3",
  "note": "AI tổng hợp/gợi ý thông tin cơ bản của ĐXMS từ tài liệu đầu vào; kết quả để người dùng rà soát, xác nhận."
 },
 "4": {
  "name": "Rà soát và xác nhận thông tin cơ bản",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "Thông tin cơ bản; đầu vào BM-01 (≥160 tỷ) / BM-09 (<160 tỷ)",
  "old": "4",
  "note": "Rà soát, xác nhận mục đích; phạm vi/quy mô; giá trị, nguồn vốn, thời gian; biện pháp/kế hoạch thực hiện và độ Mật của ĐXMS trước khi lập dự thảo hồ sơ."
 },
 "5": {
  "name": "Chọn/bóc tách căn cứ mua sắm",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "Không có",
  "old": "5",
  "note": "Bóc tách căn cứ theo dữ liệu có sẵn đến dòng/hạng mục dùng để lập nhu cầu mua sắm."
 },
 "6": {
  "name": "Đối chiếu Dự toán + eBOM + mBOM và thông tin tồn kho từ module Quản lý kho",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "Không có; dữ liệu Dự toán/eBOM/mBOM/Quản lý kho",
  "old": "6",
  "note": "Tổng hợp/kiểm tra Dự toán, eBOM, mBOM và tồn kho; tính phần căn cứ còn được phép sử dụng, loại phần đã dùng hoặc đang hold."
 },
 "7": {
  "name": "Nhận thông tin rà soát tồn kho khả dụng",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "Kết quả rà soát tồn kho theo Quy định QLTS",
  "old": "7",
  "note": "Nhận kết quả RSTK theo số liệu sổ sách và kết quả RSTK thực tế đủ điều kiện xuất kho; phối hợp kiểm đếm/đánh giá chất lượng thực tế trước khi chốt phần hàng có thể sử dụng."
 },
 "8": {
  "name": "Khởi tạo yêu cầu báo giá",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "Yêu cầu báo giá theo Quy định TTMS",
  "old": "8",
  "note": "Căn cứ kết quả tồn kho, xác định danh mục/số lượng cần mua và lập yêu cầu báo giá."
 },
 "9": {
  "name": "Gửi yêu cầu báo giá thay TTMS",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "Yêu cầu báo giá theo Quy định TTMS",
  "old": "9",
  "note": "Tự động gửi yêu cầu báo giá theo thông tin người dùng đã lập tới nhà cung cấp/đầu mối theo tích hợp."
 },
 "10": {
  "name": "Tổng hợp và kiểm tra báo giá",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "Báo giá/Kết quả lấy báo giá",
  "old": "10",
  "note": "Tổng hợp các báo giá nhận được và kiểm tra/đánh giá mức độ đáp ứng của báo giá."
 },
 "11": {
  "name": "Hoàn thiện dự thảo ĐXMS (<160 tỷ)",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "BM-09; Checklist 02; Kết quả RSTK; Báo giá",
  "old": "",
  "note": "Hoàn thiện dự thảo Tờ trình ĐXMS ký trực tiếp trên cơ sở kết quả RSTK, báo giá và các căn cứ liên quan; chuẩn bị hồ sơ để kiểm duyệt trước khi gửi CQCM."
 },
 "12": {
  "name": "Hoàn thiện dự thảo ĐXMS (≥160 tỷ)",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "BM-01; Checklist 01; Kết quả RSTK; Báo giá",
  "old": "11",
  "note": "Hoàn thiện dự thảo hồ sơ ĐXMS trên cơ sở kết quả RSTK, báo giá và các căn cứ liên quan; chuẩn bị hồ sơ để kiểm duyệt trước khi gửi CQCM."
 },
 "13": {
  "name": "Thẩm định cấp đơn vị",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "BM-01; Checklist 01 (đối với luồng >160 tỷ) - BM-09; Checklist 02 (đối với luồng",
  "old": "12",
  "note": "Chỉ huy đơn vị đề xuất kiểm duyệt/xác nhận dự thảo hồ sơ trước khi gửi các CQCM thẩm định."
 },
 "14": {
  "name": "AI lọc nội dung chưa đạt và hướng dẫn sửa dự thảo",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-01 + Checklist 01 (≥160 tỷ); BM-09 + Checklist 02 (<160 tỷ); phụ lục (nếu có)",
  "old": "13",
  "note": "AI xác định nội dung chưa đạt và gợi ý nội dung cần chỉnh sửa trên dự thảo tương ứng với từng luồng; người dùng rà soát trước khi cập nhật lại hồ sơ."
 },
 "15": {
  "name": "Tạo dự thảo yêu cầu thẩm định, trình ký và thông báo",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-03",
  "old": "15",
  "note": "Tự động tạo dự thảo yêu cầu thẩm định/trình ký và thông báo để người dùng kiểm tra, cập nhật."
 },
 "16": {
  "name": "Lập phiếu yêu cầu thẩm định và chọn CQCM",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "BM-03; Danh sách CQCM được chọn",
  "old": "14",
  "note": "Kiểm tra/cập nhật nội dung yêu cầu thẩm định và lựa chọn các CQCM cần tham gia theo chức năng, nhiệm vụ; danh sách lựa chọn được chuyển TTMS xác nhận trước khi hệ thống gửi yêu cầu."
 },
 "17": {
  "name": "Xác nhận danh sách CQCM thẩm định",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-03; Danh sách CQCM được chọn",
  "old": "",
  "note": "Kiểm tra danh sách CQCM do Đơn vị ĐXMS lựa chọn đã đúng chức năng, đúng phạm vi và đầy đủ các CQCM cần tham gia thẩm định hay chưa. Nếu chưa đúng/đủ, trả lại Đơn vị ĐXMS cập nhật danh sách."
 },
 "18": {
  "name": "Gửi yêu cầu thẩm định, trình ký và thông báo",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-03; Danh sách CQCM đã được TTMS xác nhận",
  "old": "15",
  "note": "Sau khi TTMS xác nhận danh sách CQCM đúng và đủ, hệ thống gửi yêu cầu góp ý/thẩm định, trình ký và thông báo tới các CQCM đã được xác nhận."
 },
 "19": {
  "name": "Rà soát, hoàn thiện BM-04",
  "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
  "type": "user",
  "form": "BM-04; hồ sơ ĐXMS theo luồng tương ứng",
  "old": "16",
  "note": "CQCM nghiên cứu hồ sơ, lập ý kiến thẩm định bằng BM-04, nêu rõ nội dung đạt/chưa đạt và yêu cầu chỉnh sửa; Chuyên quản ký nháy/ký trình, Chỉ huy CQCM ký duyệt trước khi phản hồi."
 },
 "20": {
  "name": "Xác nhận trình ký BM-04",
  "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
  "type": "user",
  "form": "BM-04",
  "old": "17",
  "note": "Chỉ huy CQCM xác nhận nội dung BM-04 trên ĐTMS trước khi chuyển ký qua VOffice."
 },
 "21": {
  "name": "AI lọc nội dung cần sửa trên BM-04",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-04; phụ lục (nếu có)",
  "old": "18",
  "note": "AI tóm tắt các nội dung cần sửa trên BM-04 khi kết quả xác nhận không đạt để CQCM hoàn thiện lại."
 },
 "22": {
  "name": "Tạo/gửi trình ký BM-04 và thông báo qua VOffice",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-04",
  "old": "19",
  "note": "Tạo/gửi yêu cầu trình ký BM-04 và thông báo qua tích hợp VOffice; không mô hình hóa xử lý nội bộ VOffice."
 },
 "23": {
  "name": "Tổng hợp BM-04 đã ký của các CQCM",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-04",
  "old": "20",
  "note": "Theo dõi và tổng hợp BM-04 đã ký; chỉ chuyển tiếp khi đủ ý kiến hợp lệ của toàn bộ CQCM theo danh sách."
 },
 "24": {
  "name": "AI kiểm tra xung đột BM-04 giữa các CQCM",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-04",
  "old": "",
  "note": "AI kiểm tra các BM-04 để phát hiện nội dung nhận xét mâu thuẫn/xung đột giữa các CQCM phối hợp."
 },
 "25": {
  "name": "AI tóm tắt nội dung NOK và gửi đơn vị đề xuất",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-04",
  "old": "21",
  "note": "AI tóm tắt nội dung NOK/ý kiến cần xử lý từ các BM-04 và gửi đơn vị đề xuất mua sắm."
 },
 "26": {
  "name": "Rà soát BM-04 và xác định nội dung cần cập nhật ĐXMS",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "BM-04; BM-01 (≥160 tỷ) / BM-09 (<160 tỷ)",
  "old": "22",
  "note": "Rà soát toàn bộ ý kiến BM-04, xác định nội dung cần cập nhật trên BM-01 đối với luồng ≥160 tỷ hoặc BM-09 đối với luồng <160 tỷ; lựa chọn tiếp thu hoặc lập giải trình/bảo lưu."
 },
 "27": {
  "name": "Hoàn chỉnh hồ sơ trình ĐXMS",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "≥160 tỷ: BM-01, BM-02, BM-04, Checklist 01; <160 tỷ: BM-09, BM-02, BM-04, Checklist 02",
  "old": "23",
  "note": "Hoàn chỉnh hồ sơ theo ý kiến CQCM và nội dung giải trình/bảo lưu: cập nhật BM-01 đối với luồng ≥160 tỷ hoặc BM-09 đối với luồng <160 tỷ; chuẩn bị BM-02, BM-04 và Checklist tương ứng."
 },
 "28": {
  "name": "Lập nội dung giải trình",
  "actor": "Đơn vị đề xuất mua sắm",
  "type": "user",
  "form": "BM-02; Phụ lục 1 giải trình ý kiến CQCM",
  "old": "24",
  "note": "Lập Phiếu trình giải quyết công việc và phụ lục giải trình, nêu rõ ý kiến tiếp thu/bảo lưu và lý do."
 },
 "29": {
  "name": "Tăng số vòng xử lý lại",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "Không có",
  "old": "27",
  "note": "Ghi tăng số vòng xử lý lại của hồ sơ để theo dõi số lần chỉnh sửa/giải trình theo quy tắc của luồng."
 },
 "30": {
  "name": "Gửi cảnh báo và yêu cầu họp",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "Không có",
  "old": "28",
  "note": "Gửi cảnh báo và yêu cầu tổ chức họp khi số vòng xử lý vượt ngưỡng của luồng."
 },
 "31": {
  "name": "Tổ chức họp thống nhất các bên",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "Không quy định mẫu riêng trong 3 tài liệu",
  "old": "29",
  "note": "Tổ chức họp giữa đơn vị đề xuất, CQCM/TTMS và các bên liên quan để thống nhất nội dung còn vướng mắc."
 },
 "32": {
  "name": "Cập nhật kết quả cuộc họp",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "Kết quả cuộc họp; không có BM chuẩn trong 3 tài liệu",
  "old": "30",
  "note": "Cập nhật kết luận cuộc họp và các nội dung đã/chưa thống nhất vào hồ sơ xử lý."
 },
 "33": {
  "name": "Trình cấp cao hơn kết luận",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "Hồ sơ ĐXMS; BM-02; kết quả họp (nếu có)",
  "old": "31",
  "note": "Trình nội dung chưa thống nhất cùng hồ sơ/kết quả họp lên cấp cao hơn để xin kết luận."
 },
 "34": {
  "name": "Xem xét, kết luận nội dung chưa thống nhất",
  "actor": "Thủ trưởng đơn vị VHT",
  "type": "user",
  "form": "Không quy định mẫu riêng trong 3 tài liệu",
  "old": "32",
  "note": "Xem xét và kết luận phương án xử lý đối với nội dung các bên chưa thống nhất."
 },
 "35": {
  "name": "Kiểm tra lại nội dung hồ sơ đã hoàn chỉnh",
  "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
  "type": "user",
  "form": "BM-01 (>160 tỷ); BM-09 ( 160 tỷ); Checklist 02 (",
  "old": "33",
  "note": "CQCM kiểm tra lại hồ sơ đã hoàn chỉnh, xác nhận các yêu cầu thẩm định trước đó đã được xử lý."
 },
 "36": {
  "name": "Xác nhận ký BM-04 và Checklist theo luồng",
  "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
  "type": "user",
  "form": "BM-04; Checklist 01 (≥160 tỷ) / Checklist 02 (<160 tỷ)",
  "old": "34",
  "note": "CQCM phối hợp xác nhận/ký lại BM-04 và Checklist theo phiên bản hồ sơ hiện tại trước khi chuyển bước tiếp theo; không sử dụng lại kết quả ký của phiên bản cũ."
 },
 "37": {
  "name": "Gửi trình ký và tổng hợp BM-04/Checklist theo luồng",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-04; Checklist 01 (≥160 tỷ) / Checklist 02 (<160 tỷ)",
  "old": "35",
  "note": "Tạo/gửi trình ký và tổng hợp kết quả ký BM-04 cùng Checklist tương ứng trên VOffice; chỉ chuyển tiếp khi đủ kết quả hợp lệ của phiên bản hồ sơ hiện tại."
 },
 "38": {
  "name": "Ký thẩm định trực tiếp BM-09",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-09; Checklist 02",
  "old": "",
  "note": "TTMS với vai trò CQCM chủ trì về ĐTXD xem xét và ký thẩm định trực tiếp trên Tờ trình ĐXMS BM-09 trước khi chuyển bước phê duyệt."
 },
 "39": {
  "name": "Ký thẩm định trực tiếp BM-09",
  "actor": "Phó TGĐ/Phó GĐ chuyên trách",
  "type": "user",
  "form": "BM-09; Checklist 02",
  "old": "",
  "note": "Phó TGĐ/Phó GĐ chuyên trách xem xét và ký thẩm định trực tiếp trên Tờ trình ĐXMS BM-09 theo thành phần ký áp dụng."
 },
 "40": {
  "name": "Gửi trình ký và tổng hợp BM-09",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-09; Checklist 02",
  "old": "",
  "note": "Tạo/gửi trình ký BM-09 trên VOffice và tổng hợp kết quả ký thẩm định của luồng <160 tỷ; chỉ chuyển tiếp khi đủ kết quả hợp lệ."
 },
 "41": {
  "name": "AI soạn thảo Báo cáo kết quả thẩm định",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-05",
  "old": "36",
  "note": "AI tạo dự thảo Báo cáo kết quả thẩm định từ hồ sơ hoàn chỉnh và các ý kiến thẩm định."
 },
 "42": {
  "name": "Rà soát, cập nhật BM-05",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-05; hồ sơ ĐXMS; Checklist 01",
  "old": "37",
  "note": "TTMS với vai trò CQCM chủ trì về ĐTXD rà soát, cập nhật dự thảo Báo cáo kết quả thẩm định BM-05, bảo đảm nội dung đầy đủ và phù hợp với hồ sơ thẩm định trước khi xác nhận đủ điều kiện trình ký."
 },
 "43": {
  "name": "Xác nhận hồ sơ đủ điều kiện giao ký BM-05",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-05; Checklist 01; hồ sơ thẩm định",
  "old": "40",
  "note": "Sau khi BM-05 đã được rà soát, cập nhật đầy đủ, TTMS xác nhận hồ sơ đủ điều kiện để Hệ thống ĐTMS thực hiện trình ký BM-05 cho TTMS qua VOffice."
 },
 "44": {
  "name": "Trình ký BM-05 của TTMS",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-05",
  "old": "42",
  "note": "Hệ thống ĐTMS tạo/gửi yêu cầu trình ký BM-05 qua VOffice để TTMS thực hiện ký BM-05 với tư cách CQCM về ĐTXD. Chỉ sau khi nhận kết quả TTMS ký thành công, hệ thống mới chuyển sang thông báo/giao việc ký BM-05 cho các thành phần còn lại theo phân công."
 },
 "45": {
  "name": "Thông báo/giao việc ký BM-05 theo phân công",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-05",
  "old": "41",
  "note": "Sau khi Hệ thống ĐTMS nhận kết quả TTMS ký BM-05 thành công qua VOffice, tự động thông báo/giao việc ký BM-05 tới các thành phần ký còn lại theo phân công."
 },
 "46": {
  "name": "Xem xét, ký BM-05",
  "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
  "type": "user",
  "form": "BM-05",
  "old": "",
  "note": "CQCM Tài chính kế toán và các CQCM liên quan xem xét, xác nhận và ký BM-05 theo chức năng, nhiệm vụ được giao."
 },
 "47": {
  "name": "Xem xét, ký BM-05",
  "actor": "Phó TGĐ/Phó GĐ chuyên trách",
  "type": "user",
  "form": "BM-05",
  "old": "44",
  "note": "Phó TGĐ/Phó GĐ chuyên trách xem xét và ký BM-05 theo thành phần ký thẩm định áp dụng."
 },
 "48": {
  "name": "Xác định có cần báo cáo TGĐ Tập đoàn",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "Không có mẫu riêng; căn cứ hồ sơ/BM-05",
  "old": "39",
  "note": "TTMS xác định hồ sơ có thuộc nhánh cần báo cáo TGĐ Tập đoàn trước khi phê duyệt hay không theo thiết kế TO-BE."
 },
 "49": {
  "name": "AI soạn Công văn báo cáo TGĐ Tập đoàn",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-06",
  "old": "46",
  "note": "AI tạo dự thảo Công văn báo cáo TGĐ Tập đoàn về nội dung ĐXMS cho nhánh cần báo cáo."
 },
 "50": {
  "name": "Rà soát, cập nhật Công văn báo cáo TGĐ",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-06",
  "old": "47",
  "note": "TTMS rà soát, cập nhật dự thảo BM-06 trước khi trình Thủ trưởng đơn vị ký."
 },
 "51": {
  "name": "Xem xét, xác nhận trình ký Công văn báo cáo TGĐ",
  "actor": "Thủ trưởng đơn vị VHT",
  "type": "user",
  "form": "BM-06",
  "old": "48",
  "note": "Thủ trưởng đơn vị VHT xem xét và xác nhận BM-06 để chuyển ký/phát hành; văn bản do người đứng đầu đơn vị ký."
 },
 "52": {
  "name": "Trình ký BM-06 qua VOffice và chuyển Ban ĐTXD",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-06",
  "old": "49",
  "note": "Tự động chuyển BM-06 sang VOffice để ký/phát hành và gửi Ban ĐTXD Tập đoàn."
 },
 "53": {
  "name": "Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn",
  "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
  "type": "user",
  "form": "BM-06; BM-07",
  "old": "50",
  "note": "Ban ĐTXD xem xét hồ sơ/BM-06; nếu đủ điều kiện thì lập báo cáo gửi TGĐ Tập đoàn."
 },
 "54": {
  "name": "Gửi BM-07 đến TGĐ Tập đoàn",
  "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
  "type": "user",
  "form": "BM-07",
  "old": "51",
  "note": "Gửi BM-07 đến Tổng GĐ Tập đoàn để theo dõi, quản lý theo quy trình."
 },
 "55": {
  "name": "Thông báo đồng thời cho hai đầu mối",
  "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
  "type": "user",
  "form": "BM-07; không có mẫu thông báo riêng",
  "old": "52",
  "note": "Gửi thông tin/BM-07 đồng thời cho TTMS và đầu mối đơn vị đề xuất để thực hiện các thủ tục tiếp theo."
 },
 "56": {
  "name": "Xem xét và cho ý kiến về nội dung ĐXMS",
  "actor": "Tổng GĐ Tập đoàn",
  "type": "user",
  "form": "BM-07; tham chiếu hồ sơ/BM-06",
  "old": "53",
  "note": "Tiếp nhận, xem xét nội dung BM-07 theo thiết kế TO-BE; tài liệu quy trình xác định BM-07 được gửi TGĐ để theo dõi, quản lý."
 },
 "57": {
  "name": "Tự động sinh dự thảo Quyết định phê duyệt ĐXMS",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-08",
  "old": "54",
  "note": "Tự động sinh dự thảo Quyết định phê duyệt ĐXMS từ hồ sơ và kết quả thẩm định đã hoàn tất."
 },
 "58": {
  "name": "Rà soát, xác nhận dự thảo Quyết định phê duyệt",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-08; Checklist 01",
  "old": "55",
  "note": "TTMS rà soát, cập nhật dự thảo BM-08 và Checklist 01 trước khi trình phê duyệt."
 },
 "59": {
  "name": "Trình Quyết định phê duyệt ĐXMS",
  "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
  "type": "user",
  "form": "BM-08; Checklist 01; hồ sơ thẩm định",
  "old": "56",
  "note": "TTMS trình BM-08 kèm Checklist 01 và hồ sơ thẩm định tới Người có thẩm quyền phê duyệt."
 },
 "60": {
  "name": "Xem xét, phê duyệt ĐXMS",
  "actor": "Thủ trưởng đơn vị VHT",
  "type": "user",
  "form": "≥160 tỷ: BM-08, Checklist 01, BM-04, BM-02; <160 tỷ: BM-09, Checklist 02, BM-04, BM-02",
  "old": "57",
  "note": "Xem xét hồ sơ theo thẩm quyền: ký Quyết định phê duyệt BM-08 đối với luồng ≥160 tỷ; hoặc ký duyệt trực tiếp Tờ trình BM-09 đối với luồng <160 tỷ."
 },
 "61": {
  "name": "Tạo/gửi ký duyệt trên VOffice",
  "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
  "type": "service",
  "form": "BM-08 (>160 tỷ); BM-09 (",
  "old": "58",
  "note": "Tự động chuyển BM-08 đã được xác nhận sang VOffice để ký duyệt/phát hành và cập nhật kết quả."
 }
};
