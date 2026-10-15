/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS02 ver1.1".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS02"] = {
 "page": "MS02 ver1.1",
 "count": 61,
 "tasks": {
  "1": {
   "name": "Chọn ĐXMS đã được phê duyệt cần điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "ĐXMS đã được phê duyệt; BM-08 hoặc BM-09 tương ứng; hồ sơ ĐXMS cũ",
   "note": "Đơn vị đề xuất lựa chọn ĐXMS đã được phê duyệt cần điều chỉnh. Hệ thống sử dụng hồ sơ đã phê duyệt làm căn cứ khởi tạo hồ sơ điều chỉnh và truy vết phiên bản trước điều chỉnh.",
   "lane": ""
  },
  "2": {
   "name": "Lấy dữ liệu ĐXMS cũ và kết quả đã thực hiện",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Hồ sơ ĐXMS cũ; kết quả đã thực hiện; căn cứ liên quan",
   "note": "Hệ thống lấy dữ liệu của ĐXMS đã phê duyệt, các căn cứ liên quan và thông tin/kết quả đã thực hiện của ĐXMS cũ để làm cơ sở xác định phần cần điều chỉnh.",
   "lane": ""
  },
  "3": {
   "name": "AI gợi ý thông tin điều chỉnh ĐXMS",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Hồ sơ ĐXMS cũ; dữ liệu liên quan",
   "note": "AI tổng hợp dữ liệu ĐXMS cũ và thông tin hiện có để gợi ý các nội dung có thể cần cập nhật; người dùng phải rà soát, xác nhận trước khi ghi nhận vào hồ sơ điều chỉnh.",
   "lane": ""
  },
  "4": {
   "name": "Xác định lý do, phạm vi và xác nhận nội dung điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "Hồ sơ ĐXMS cũ; nội dung đề nghị điều chỉnh",
   "note": "Đơn vị đề xuất xác định lý do, phạm vi và nội dung cần điều chỉnh trên cơ sở ĐXMS cũ và tình hình hiện tại. Nội dung có thể bao gồm nhu cầu, chủng loại/số lượng, chỉ tiêu kỹ thuật/phương án công nghệ, giá trị, tiến độ hoặc nội dung khác của ĐXMS; người dùng xác nhận trước khi tiếp tục.",
   "lane": ""
  },
  "5": {
   "name": "Chọn/bóc tách căn cứ và nội dung cần điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "Căn cứ mua sắm; hồ sơ ĐXMS cũ; nội dung điều chỉnh",
   "note": "Đơn vị đề xuất chọn, bóc tách các căn cứ/hạng mục bị ảnh hưởng bởi điều chỉnh để xác định phạm vi dữ liệu cần tính toán lại và chuẩn bị hồ sơ điều chỉnh.",
   "lane": ""
  },
  "6": {
   "name": "Đối chiếu Dự toán + eBOM + mBOM và thông tin tồn kho tại thời điểm điều chỉnh",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Dự toán; eBOM; mBOM; dữ liệu tồn kho hiện tại",
   "note": "Hệ thống thực hiện lại việc kiểm tra Dự toán, eBOM, mBOM và thông tin tồn kho theo dữ liệu hiện tại nhằm phản ánh thay đổi về số lượng tồn kho, nhu cầu và các dữ liệu liên quan tại thời điểm điều chỉnh.",
   "lane": ""
  },
  "7": {
   "name": "Nhận thông tin rà soát tồn kho cập nhật",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "Kết quả RSTK tại thời điểm điều chỉnh",
   "note": "Đơn vị đề xuất nhận và rà soát kết quả tồn kho cập nhật tại thời điểm điều chỉnh, làm cơ sở xác định phần nhu cầu còn phải mua sau điều chỉnh.",
   "lane": ""
  },
  "8": {
   "name": "Khởi tạo yêu cầu báo giá điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "Yêu cầu báo giá; kết quả RSTK cập nhật",
   "note": "Đơn vị đề xuất xác định danh mục/số lượng còn cần mua sau khi rà soát tồn kho và khởi tạo yêu cầu báo giá phục vụ hồ sơ điều chỉnh.",
   "lane": ""
  },
  "9": {
   "name": "Gửi yêu cầu báo giá điều chỉnh",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Yêu cầu báo giá",
   "note": "Theo thiết kế TO-BE kế thừa MS01, Hệ thống ĐTMS gửi trực tiếp yêu cầu báo giá tới nhà cung cấp/đầu mối nhận báo giá để cập nhật cơ sở giá tại thời điểm điều chỉnh.",
   "lane": ""
  },
  "10": {
   "name": "Tổng hợp và kiểm tra báo giá tại thời điểm điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "Báo giá cập nhật; kết quả RSTK",
   "note": "Đơn vị đề xuất tổng hợp các báo giá nhận được, kiểm tra mức độ đáp ứng và sử dụng kết quả hiện hành để xác định giá trị ĐXMS sau điều chỉnh.",
   "lane": ""
  },
  "11": {
   "name": "Hoàn thiện dự thảo điều chỉnh ĐXMS (<160 tỷ)",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "BM-09; Checklist 02; Kết quả RSTK; Báo giá; hồ sơ ĐXMS cũ",
   "note": "Hoàn thiện dự thảo hồ sơ điều chỉnh ĐXMS khi giá trị sau điều chỉnh dưới 160 tỷ đồng, trên cơ sở kết quả RSTK, báo giá cập nhật, ĐXMS cũ và nội dung phát sinh dẫn tới điều chỉnh.",
   "lane": ""
  },
  "12": {
   "name": "Hoàn thiện dự thảo điều chỉnh ĐXMS (≥160 tỷ)",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "BM-01; Checklist 01; Kết quả RSTK; Báo giá; hồ sơ ĐXMS cũ",
   "note": "Hoàn thiện dự thảo hồ sơ điều chỉnh ĐXMS khi giá trị sau điều chỉnh từ 160 tỷ đồng trở lên, trên cơ sở kết quả RSTK, báo giá cập nhật, ĐXMS cũ và nội dung phát sinh dẫn tới điều chỉnh.",
   "lane": ""
  },
  "13": {
   "name": "Thẩm định cấp đơn vị đối với hồ sơ điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "≥160 tỷ: BM-01 + Checklist 01; <160 tỷ: BM-09 + Checklist 02",
   "note": "Chỉ huy đơn vị đề xuất xem xét hồ sơ điều chỉnh trước khi gửi CQCM thẩm định; kiểm tra nội dung điều chỉnh, căn cứ, giá trị sau điều chỉnh và bộ biểu mẫu tương ứng.",
   "lane": ""
  },
  "14": {
   "name": "AI lọc nội dung chưa đạt và hướng dẫn sửa dự thảo điều chỉnh",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-01 + Checklist 01 (≥160 tỷ); BM-09 + Checklist 02 (<160 tỷ); phụ lục (nếu có)",
   "note": "AI xác định các nội dung chưa đạt trên dự thảo điều chỉnh và gợi ý nội dung cần cập nhật; người dùng rà soát trước khi sửa hồ sơ.",
   "lane": ""
  },
  "15": {
   "name": "Tạo dự thảo yêu cầu thẩm định điều chỉnh, trình ký và thông báo",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-03; hồ sơ điều chỉnh ĐXMS",
   "note": "Hệ thống tạo dự thảo BM-03 phục vụ việc gửi CQCM thẩm định hồ sơ điều chỉnh ĐXMS.",
   "lane": ""
  },
  "16": {
   "name": "Lập phiếu yêu cầu thẩm định điều chỉnh và chọn CQCM",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "BM-03; hồ sơ điều chỉnh ĐXMS",
   "note": "Đơn vị đề xuất rà soát/cập nhật BM-03 và lựa chọn danh sách CQCM cần tham gia thẩm định hồ sơ điều chỉnh.",
   "lane": ""
  },
  "17": {
   "name": "Xác nhận danh sách CQCM thẩm định điều chỉnh",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-03; danh sách CQCM",
   "note": "TTMS kiểm tra danh sách CQCM do Đơn vị đề xuất lựa chọn đã đúng chức năng, đúng phạm vi và đầy đủ đối với nội dung điều chỉnh hay chưa. Chỉ khi đúng/đủ mới chuyển bước.",
   "lane": ""
  },
  "18": {
   "name": "Gửi yêu cầu thẩm định điều chỉnh, trình ký và thông báo",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-03; hồ sơ điều chỉnh ĐXMS",
   "note": "Hệ thống gửi yêu cầu thẩm định hồ sơ điều chỉnh tới các CQCM đã được TTMS xác nhận.",
   "lane": ""
  },
  "19": {
   "name": "Rà soát, hoàn thiện BM-04 cho hồ sơ điều chỉnh",
   "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
   "type": "user",
   "form": "BM-04; hồ sơ điều chỉnh ĐXMS",
   "note": "CQCM nghiên cứu hồ sơ điều chỉnh và lập BM-04, nêu rõ nội dung đạt/chưa đạt, ý kiến chuyên môn và yêu cầu sửa đổi/bổ sung nếu có.",
   "lane": ""
  },
  "20": {
   "name": "Xác nhận trình ký BM-04",
   "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
   "type": "user",
   "form": "BM-04",
   "note": "Chỉ huy CQCM xác nhận nội dung BM-04 đối với hồ sơ điều chỉnh trên ĐTMS trước khi chuyển trình ký.",
   "lane": ""
  },
  "21": {
   "name": "AI lọc nội dung cần sửa trên BM-04",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-04; phụ lục (nếu có)",
   "note": "Nếu BM-04 đối với hồ sơ điều chỉnh chưa đạt, AI tóm tắt nội dung cần sửa để CQCM hoàn thiện lại.",
   "lane": ""
  },
  "22": {
   "name": "Tạo/gửi trình ký BM-04 và thông báo qua VOffice",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-04",
   "note": "Hệ thống tạo/gửi trình ký BM-04 của hồ sơ điều chỉnh qua VOffice và thông báo theo luồng.",
   "lane": ""
  },
  "23": {
   "name": "Tổng hợp BM-04 đã ký của các CQCM",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-04",
   "note": "Hệ thống tổng hợp các BM-04 đã ký hợp lệ của các CQCM đối với hồ sơ điều chỉnh; thiếu kết quả thì tiếp tục chờ.",
   "lane": ""
  },
  "24": {
   "name": "AI kiểm tra xung đột BM-04 giữa các CQCM",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-04",
   "note": "AI kiểm tra khả năng xung đột/mâu thuẫn giữa các ý kiến BM-04 đối với hồ sơ điều chỉnh.",
   "lane": ""
  },
  "25": {
   "name": "AI tóm tắt nội dung NOK và gửi đơn vị đề xuất",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-04",
   "note": "AI tổng hợp các nội dung NOK/ý kiến cần xử lý từ BM-04 và gửi Đơn vị đề xuất để hoàn thiện hồ sơ điều chỉnh.",
   "lane": ""
  },
  "26": {
   "name": "Rà soát BM-04 và xác định nội dung cần cập nhật hồ sơ điều chỉnh",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "BM-04; BM-01 hoặc BM-09 theo giá trị sau điều chỉnh",
   "note": "Đơn vị đề xuất rà soát các BM-04, xác định nội dung cần cập nhật trên hồ sơ điều chỉnh và lựa chọn tiếp thu hoặc giải trình/bảo lưu theo luồng.",
   "lane": ""
  },
  "27": {
   "name": "Hoàn chỉnh hồ sơ trình điều chỉnh ĐXMS",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "≥160 tỷ: BM-01, BM-02, BM-04, Checklist 01; <160 tỷ: BM-09, BM-02, BM-04, Checklist 02; hồ sơ ĐXMS cũ",
   "note": "Hoàn chỉnh hồ sơ điều chỉnh theo ý kiến CQCM và nội dung giải trình/bảo lưu, sử dụng bộ biểu mẫu tương ứng với giá trị sau điều chỉnh.",
   "lane": ""
  },
  "28": {
   "name": "Lập nội dung giải trình",
   "actor": "Đơn vị đề xuất mua sắm",
   "type": "user",
   "form": "BM-02; Phụ lục 1 giải trình ý kiến CQCM",
   "note": "Đơn vị đề xuất lập BM-02/nội dung giải trình đối với các ý kiến thẩm định chưa thể tiếp thu ngay, nêu rõ nội dung tiếp thu, bảo lưu và lý do.",
   "lane": ""
  },
  "29": {
   "name": "Tăng số vòng xử lý lại",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "Hệ thống tăng số vòng xử lý lại của hồ sơ điều chỉnh để phục vụ kiểm soát vòng trao đổi/thẩm định.",
   "lane": ""
  },
  "30": {
   "name": "Gửi cảnh báo và yêu cầu họp",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "Không có",
   "note": "Khi số vòng xử lý vượt ngưỡng theo thiết kế TO-BE, hệ thống gửi cảnh báo và yêu cầu tổ chức họp để xử lý các nội dung chưa thống nhất.",
   "lane": ""
  },
  "31": {
   "name": "Tổ chức họp thống nhất các bên",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "Không quy định mẫu riêng trong 3 tài liệu",
   "note": "TTMS tổ chức họp giữa Đơn vị đề xuất, CQCM và các bên liên quan để thống nhất các nội dung còn vướng mắc của hồ sơ điều chỉnh.",
   "lane": ""
  },
  "32": {
   "name": "Cập nhật kết quả cuộc họp",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "Kết quả cuộc họp; không có BM chuẩn trong 3 tài liệu",
   "note": "TTMS cập nhật kết luận cuộc họp và các nội dung đã/chưa thống nhất vào hồ sơ điều chỉnh.",
   "lane": ""
  },
  "33": {
   "name": "Trình cấp cao hơn kết luận",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "Hồ sơ ĐXMS; BM-02; kết quả họp (nếu có)",
   "note": "TTMS trình nội dung điều chỉnh chưa thống nhất cùng hồ sơ/kết quả họp lên cấp cao hơn để xin kết luận.",
   "lane": ""
  },
  "34": {
   "name": "Xem xét, kết luận nội dung chưa thống nhất",
   "actor": "Thủ trưởng đơn vị VHT",
   "type": "user",
   "form": "Không quy định mẫu riêng trong 3 tài liệu",
   "note": "Thủ trưởng đơn vị VHT xem xét và kết luận phương án xử lý đối với nội dung điều chỉnh chưa thống nhất.",
   "lane": ""
  },
  "35": {
   "name": "Kiểm tra lại nội dung hồ sơ điều chỉnh đã hoàn chỉnh",
   "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
   "type": "user",
   "form": "Hồ sơ điều chỉnh; BM-04; Checklist tương ứng",
   "note": "CQCM kiểm tra lại phiên bản hồ sơ điều chỉnh sau khi Đơn vị đề xuất đã cập nhật theo ý kiến thẩm định/giải trình.",
   "lane": ""
  },
  "36": {
   "name": "Xác nhận ký BM-04 và Checklist theo luồng",
   "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
   "type": "user",
   "form": "BM-04; Checklist 01 (≥160 tỷ) / Checklist 02 (<160 tỷ)",
   "note": "CQCM xác nhận/ký BM-04 và Checklist tương ứng trên phiên bản hồ sơ điều chỉnh hiện tại; không tái sử dụng kết quả ký của phiên bản cũ.",
   "lane": ""
  },
  "37": {
   "name": "Gửi trình ký và tổng hợp BM-04/Checklist theo luồng",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-04; Checklist 01 (≥160 tỷ) / Checklist 02 (<160 tỷ)",
   "note": "Hệ thống tạo/gửi trình ký và tổng hợp kết quả ký BM-04 cùng Checklist tương ứng của hồ sơ điều chỉnh trên VOffice; chỉ chuyển tiếp khi đủ kết quả hợp lệ.",
   "lane": ""
  },
  "38": {
   "name": "Ký thẩm định trực tiếp BM-09",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-09; Checklist 02",
   "note": "TTMS với vai trò CQCM chủ trì về ĐTXD xem xét và ký thẩm định trực tiếp trên BM-09 đối với hồ sơ điều chỉnh có giá trị dưới 160 tỷ đồng.",
   "lane": ""
  },
  "39": {
   "name": "Ký thẩm định trực tiếp BM-09",
   "actor": "Phó TGĐ/Phó GĐ chuyên trách",
   "type": "user",
   "form": "BM-09; Checklist 02",
   "note": "Phó TGĐ/Phó GĐ chuyên trách xem xét và ký thẩm định trực tiếp trên BM-09 của hồ sơ điều chỉnh theo thành phần áp dụng.",
   "lane": ""
  },
  "40": {
   "name": "Gửi trình ký và tổng hợp BM-09",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-09; Checklist 02",
   "note": "Hệ thống chuyển BM-09 của hồ sơ điều chỉnh sang VOffice và tổng hợp kết quả ký thẩm định; chỉ chuyển tiếp khi đủ kết quả hợp lệ.",
   "lane": ""
  },
  "41": {
   "name": "AI soạn thảo Báo cáo kết quả thẩm định điều chỉnh ĐXMS",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-05; hồ sơ điều chỉnh ĐXMS",
   "note": "AI tạo dự thảo BM-05 trên cơ sở hồ sơ điều chỉnh đã hoàn chỉnh và các ý kiến thẩm định; người dùng tiếp tục rà soát theo luồng.",
   "lane": ""
  },
  "42": {
   "name": "Rà soát, cập nhật BM-05",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-05; hồ sơ điều chỉnh ĐXMS; Checklist 01",
   "note": "TTMS với vai trò CQCM chủ trì về ĐTXD rà soát, cập nhật dự thảo BM-05 cho hồ sơ điều chỉnh, bảo đảm nội dung phản ánh đúng phần thay đổi và kết quả thẩm định trước khi xác nhận đủ điều kiện trình ký.",
   "lane": ""
  },
  "43": {
   "name": "Xác nhận hồ sơ điều chỉnh đủ điều kiện giao ký BM-05",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-05; Checklist 01; hồ sơ điều chỉnh",
   "note": "Sau khi BM-05 đã được rà soát, cập nhật đầy đủ, TTMS xác nhận hồ sơ điều chỉnh đủ điều kiện để Hệ thống ĐTMS thực hiện trình ký BM-05 cho TTMS qua VOffice.",
   "lane": ""
  },
  "44": {
   "name": "Trình ký BM-05 của TTMS",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-05",
   "note": "Hệ thống ĐTMS tạo/gửi yêu cầu trình ký BM-05 qua VOffice để TTMS ký BM-05 với tư cách CQCM về ĐTXD. Chỉ sau khi nhận kết quả TTMS ký thành công, hệ thống mới chuyển sang thông báo/giao việc ký cho các thành phần còn lại.",
   "lane": ""
  },
  "45": {
   "name": "Thông báo/giao việc ký BM-05 theo phân công",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-05",
   "note": "Sau khi TTMS đã ký BM-05 thành công, Hệ thống ĐTMS thông báo/giao việc ký BM-05 cho CQCM Tài chính, CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách theo phân công.",
   "lane": ""
  },
  "46": {
   "name": "Xem xét, ký BM-05",
   "actor": "Cơ quan chuyên môn phối hợp (Tài chính/CQCM khác)",
   "type": "user",
   "form": "BM-05",
   "note": "CQCM Tài chính kế toán và các CQCM liên quan xem xét, xác nhận và ký BM-05 đối với hồ sơ điều chỉnh theo chức năng, nhiệm vụ.",
   "lane": ""
  },
  "47": {
   "name": "Xem xét, ký BM-05",
   "actor": "Phó TGĐ/Phó GĐ chuyên trách",
   "type": "user",
   "form": "BM-05",
   "note": "Phó TGĐ/Phó GĐ chuyên trách xem xét và ký BM-05 đối với hồ sơ điều chỉnh theo thành phần áp dụng.",
   "lane": ""
  },
  "48": {
   "name": "Xác định có cần báo cáo TGĐ Tập đoàn",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "Không có mẫu riêng; căn cứ hồ sơ điều chỉnh/BM-05",
   "note": "TTMS xác định hồ sơ điều chỉnh có thuộc nhánh cần báo cáo TGĐ Tập đoàn trước khi phê duyệt hay không, căn cứ trạng thái tài liệu đầu vào áp dụng cho hồ sơ điều chỉnh và thẩm quyền sau điều chỉnh.",
   "lane": ""
  },
  "49": {
   "name": "AI soạn Công văn báo cáo TGĐ Tập đoàn",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-06",
   "note": "AI tạo dự thảo BM-06 cho hồ sơ điều chỉnh thuộc nhánh phải báo cáo TGĐ Tập đoàn.",
   "lane": ""
  },
  "50": {
   "name": "Rà soát, cập nhật Công văn báo cáo TGĐ",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-06",
   "note": "TTMS rà soát, cập nhật BM-06 của hồ sơ điều chỉnh trước khi trình Thủ trưởng đơn vị ký.",
   "lane": ""
  },
  "51": {
   "name": "Xem xét, xác nhận trình ký Công văn báo cáo TGĐ",
   "actor": "Thủ trưởng đơn vị VHT",
   "type": "user",
   "form": "BM-06",
   "note": "Thủ trưởng đơn vị VHT xem xét, xác nhận trình ký BM-06 của hồ sơ điều chỉnh.",
   "lane": ""
  },
  "52": {
   "name": "Trình ký BM-06 qua VOffice và chuyển Ban ĐTXD",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-06",
   "note": "Hệ thống chuyển BM-06 của hồ sơ điều chỉnh sang VOffice để ký/phát hành và chuyển Ban ĐTXD Tập đoàn.",
   "lane": ""
  },
  "53": {
   "name": "Xem xét hồ sơ điều chỉnh, lập Báo cáo gửi TGĐ Tập đoàn",
   "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
   "type": "user",
   "form": "BM-06; BM-07; hồ sơ điều chỉnh ĐXMS",
   "note": "Ban ĐTXD Tập đoàn xem xét hồ sơ điều chỉnh và lập BM-07 theo nhánh phải báo cáo TGĐ Tập đoàn.",
   "lane": ""
  },
  "54": {
   "name": "Gửi BM-07 đến TGĐ Tập đoàn",
   "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
   "type": "user",
   "form": "BM-07",
   "note": "Ban ĐTXD Tập đoàn gửi BM-07 của hồ sơ điều chỉnh đến TGĐ Tập đoàn theo luồng.",
   "lane": ""
  },
  "55": {
   "name": "Thông báo đồng thời cho hai đầu mối",
   "actor": "Ban Đầu tư - Xây dựng Tập đoàn",
   "type": "user",
   "form": "BM-07; không có mẫu thông báo riêng",
   "note": "Ban ĐTXD Tập đoàn thông báo/gửi thông tin BM-07 của hồ sơ điều chỉnh đồng thời cho TTMS và đầu mối Đơn vị đề xuất theo TO-BE đã chốt.",
   "lane": ""
  },
  "56": {
   "name": "Xem xét và cho ý kiến về nội dung điều chỉnh ĐXMS",
   "actor": "Tổng GĐ Tập đoàn",
   "type": "user",
   "form": "BM-07; hồ sơ điều chỉnh ĐXMS",
   "note": "Theo phương án TO-BE kế thừa MS01, TGĐ Tập đoàn xem xét/cho ý kiến về nội dung điều chỉnh ĐXMS trước khi tiếp tục luồng phê duyệt.",
   "lane": ""
  },
  "57": {
   "name": "Tự động sinh dự thảo Quyết định phê duyệt điều chỉnh ĐXMS",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "BM-08; hồ sơ điều chỉnh ĐXMS",
   "note": "Hệ thống sinh dự thảo BM-08 cho hồ sơ điều chỉnh trên cơ sở kết quả thẩm định và điều kiện phê duyệt của nhánh ≥160 tỷ.",
   "lane": ""
  },
  "58": {
   "name": "Rà soát, xác nhận dự thảo Quyết định phê duyệt điều chỉnh",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-08; Checklist 01",
   "note": "TTMS rà soát dự thảo BM-08 và Checklist 01 trước khi trình Người có thẩm quyền sau điều chỉnh.",
   "lane": ""
  },
  "59": {
   "name": "Trình Quyết định phê duyệt điều chỉnh ĐXMS",
   "actor": "Cơ quan chủ trì đầu tư mua sắm (TTMS)",
   "type": "user",
   "form": "BM-08; Checklist 01; BM-04; BM-02; hồ sơ điều chỉnh",
   "note": "TTMS trình hồ sơ điều chỉnh và dự thảo BM-08 tới Người có thẩm quyền theo thẩm quyền sau điều chỉnh.",
   "lane": ""
  },
  "60": {
   "name": "Xem xét, phê duyệt điều chỉnh ĐXMS",
   "actor": "Thủ trưởng đơn vị VHT",
   "type": "user",
   "form": "≥160 tỷ: BM-08, Checklist 01, BM-04, BM-02; <160 tỷ: BM-09, Checklist 02, BM-04, BM-02",
   "note": "Người có thẩm quyền sau điều chỉnh xem xét hồ sơ: ký BM-08 đối với nhánh ≥160 tỷ hoặc ký duyệt trực tiếp BM-09 đối với nhánh <160 tỷ.",
   "lane": ""
  },
  "61": {
   "name": "Tạo/gửi ký duyệt hồ sơ điều chỉnh trên VOffice",
   "actor": "Hệ thống ĐTMS/Tích hợp/ AI",
   "type": "service",
   "form": "≥160 tỷ: BM-08; <160 tỷ: BM-09",
   "note": "Hệ thống chuyển văn bản phê duyệt điều chỉnh sang VOffice theo luồng áp dụng và cập nhật kết quả ký/phát hành về ĐTMS.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "X"
  },
  "G2": {
   "kind": "xor",
   "name": "X"
  },
  "G3": {
   "kind": "xor",
   "name": "X"
  },
  "G4": {
   "kind": "xor",
   "name": "X"
  },
  "G5": {
   "kind": "xor",
   "name": "X"
  },
  "G6": {
   "kind": "xor",
   "name": "X"
  },
  "G7": {
   "kind": "xor",
   "name": "X"
  },
  "G8": {
   "kind": "xor",
   "name": "X"
  },
  "G9": {
   "kind": "xor",
   "name": "X"
  },
  "G10": {
   "kind": "xor",
   "name": "X"
  },
  "G11": {
   "kind": "xor",
   "name": "X"
  },
  "G12": {
   "kind": "xor",
   "name": "X"
  },
  "G13": {
   "kind": "xor",
   "name": "X"
  },
  "G14": {
   "kind": "xor",
   "name": "X"
  },
  "G15": {
   "kind": "xor",
   "name": "X"
  },
  "G16": {
   "kind": "xor",
   "name": "X"
  },
  "G17": {
   "kind": "and",
   "name": "Cả hai bên đồng ý?"
  },
  "G18": {
   "kind": "and",
   "name": "Cả hai bên đồng ý?"
  },
  "G19": {
   "kind": "xor",
   "name": "X"
  },
  "G20": {
   "kind": "xor",
   "name": "X"
  },
  "G21": {
   "kind": "and",
   "name": "Cả hai bên đồng ý?"
  },
  "G22": {
   "kind": "and",
   "name": "Cả hai bên đồng ý?"
  },
  "G23": {
   "kind": "xor",
   "name": "X"
  },
  "G24": {
   "kind": "xor",
   "name": "X"
  },
  "G25": {
   "kind": "xor",
   "name": "X"
  },
  "G26": {
   "kind": "xor",
   "name": "X"
  },
  "G27": {
   "kind": "xor",
   "name": "X"
  },
  "G28": {
   "kind": "xor",
   "name": "X"
  },
  "G29": {
   "kind": "xor",
   "name": "X"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Phát sinh nhu cầu lập ĐXMS"
  },
  "I1": {
   "kind": "mid",
   "name": "✉"
  },
  "I2": {
   "kind": "mid",
   "name": "✉"
  },
  "E3": {
   "kind": "end",
   "name": "Kết thúc theo chỉ đạo khác"
  },
  "E4": {
   "kind": "end",
   "name": "Đã xác nhận phê duyệt và chuyển VO"
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
   "13",
   ""
  ],
  [
   "12",
   "13",
   ""
  ],
  [
   "13",
   "G4",
   ""
  ],
  [
   "14",
   "12",
   "Sửa dự thảo (≥160 tỷ)"
  ],
  [
   "14",
   "11",
   "Sửa dự thảo (<160 tỷ)"
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
   "G6",
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
   "G7",
   ""
  ],
  [
   "21",
   "19",
   "Sửa BM-04"
  ],
  [
   "22",
   "23",
   ""
  ],
  [
   "23",
   "G8",
   ""
  ],
  [
   "24",
   "G9",
   ""
  ],
  [
   "25",
   "26",
   ""
  ],
  [
   "26",
   "G10",
   ""
  ],
  [
   "27",
   "35",
   ""
  ],
  [
   "28",
   "29",
   ""
  ],
  [
   "29",
   "G11",
   ""
  ],
  [
   "30",
   "31",
   ""
  ],
  [
   "31",
   "32",
   ""
  ],
  [
   "32",
   "G12",
   ""
  ],
  [
   "33",
   "34",
   ""
  ],
  [
   "34",
   "G13",
   ""
  ],
  [
   "35",
   "G14",
   ""
  ],
  [
   "36",
   "37",
   ""
  ],
  [
   "37",
   "G15",
   ""
  ],
  [
   "38",
   "G18",
   ""
  ],
  [
   "39",
   "G18",
   ""
  ],
  [
   "40",
   "60",
   ""
  ],
  [
   "41",
   "42",
   ""
  ],
  [
   "42",
   "G20",
   ""
  ],
  [
   "43",
   "44",
   ""
  ],
  [
   "44",
   "45",
   ""
  ],
  [
   "45",
   "G21",
   ""
  ],
  [
   "46",
   "G22",
   ""
  ],
  [
   "47",
   "G22",
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
   "G25",
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
   ""
  ],
  [
   "54",
   "55",
   ""
  ],
  [
   "55",
   "56",
   ""
  ],
  [
   "56",
   "G27",
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
   "60",
   ""
  ],
  [
   "60",
   "G29",
   ""
  ],
  [
   "61",
   "E4",
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
   "G3",
   "Đạt"
  ],
  [
   "G2",
   "9",
   "Không đạt"
  ],
  [
   "G3",
   "12",
   "≥160 tỷ"
  ],
  [
   "G3",
   "11",
   "<160 tỷ"
  ],
  [
   "G4",
   "14",
   "Không đạt"
  ],
  [
   "G4",
   "15",
   "Đồng ý"
  ],
  [
   "G6",
   "18",
   "Đồng ý"
  ],
  [
   "G6",
   "16",
   "Không đồng ý"
  ],
  [
   "G7",
   "21",
   "Không đồng ý"
  ],
  [
   "G7",
   "22",
   "Đồng ý"
  ],
  [
   "G8",
   "24",
   "Đủ"
  ],
  [
   "G8",
   "I1",
   "Chưa đủ"
  ],
  [
   "G9",
   "25",
   "Không"
  ],
  [
   "G9",
   "19",
   "Có"
  ],
  [
   "G10",
   "27",
   "Đồng ý sửa"
  ],
  [
   "G10",
   "28",
   "Không đồng ý"
  ],
  [
   "G11",
   "30",
   "> 2 vòng"
  ],
  [
   "G11",
   "13",
   "<= 2 vòng"
  ],
  [
   "G12",
   "33",
   "Chưa thống nhất"
  ],
  [
   "G12",
   "27",
   "Đã thống nhất"
  ],
  [
   "G13",
   "27",
   "Thống nhất phương án"
  ],
  [
   "G13",
   "12",
   "Yêu cầu xử lý lại"
  ],
  [
   "G14",
   "36",
   "Đạt"
  ],
  [
   "G14",
   "27",
   "Chưa đạt"
  ],
  [
   "G15",
   "G16",
   "Đủ"
  ],
  [
   "G15",
   "I2",
   "Chưa đủ"
  ],
  [
   "G16",
   "41",
   "≥160 tỷ"
  ],
  [
   "G16",
   "G17",
   "<160 tỷ"
  ],
  [
   "G17",
   "38",
   ""
  ],
  [
   "G17",
   "39",
   ""
  ],
  [
   "G18",
   "G19",
   ""
  ],
  [
   "G19",
   "40",
   "Đồng ý"
  ],
  [
   "G19",
   "25",
   "Không đồng ý"
  ],
  [
   "G20",
   "43",
   "Đồng ý"
  ],
  [
   "G20",
   "25",
   "Không đồng ý"
  ],
  [
   "G21",
   "46",
   ""
  ],
  [
   "G21",
   "47",
   ""
  ],
  [
   "G22",
   "G23",
   ""
  ],
  [
   "G23",
   "25",
   "Không đồng ý"
  ],
  [
   "G23",
   "48",
   "Đồng ý"
  ],
  [
   "G24",
   "G28",
   "Không"
  ],
  [
   "G24",
   "49",
   "Có"
  ],
  [
   "G25",
   "52",
   "Đồng ý"
  ],
  [
   "G25",
   "25",
   "Không đồng ý"
  ],
  [
   "G26",
   "54",
   "Chấp nhận"
  ],
  [
   "G26",
   "25",
   "Trả lại"
  ],
  [
   "G27",
   "G28",
   "Đồng ý"
  ],
  [
   "G27",
   "25",
   "Trả lại"
  ],
  [
   "G28",
   "57",
   ""
  ],
  [
   "G29",
   "E3",
   "Chỉ đạo khác"
  ],
  [
   "G29",
   "25",
   "Yêu cầu hoàn chỉnh"
  ],
  [
   "G29",
   "61",
   "Đồng ý"
  ],
  [
   "I1",
   "23",
   "Có kết quả mới"
  ],
  [
   "I2",
   "37",
   "Có kết quả mới"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
