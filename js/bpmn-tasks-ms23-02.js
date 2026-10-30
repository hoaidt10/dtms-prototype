/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS23.02".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS23.02"] = {
 "page": "MS23.02",
 "count": 22,
 "tasks": {
  "1": {
   "name": "Nhận thông báo bàn giao",
   "actor": "Phòng Hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Nhận thông báo bàn giao từ Nhà thầu/Nhà cung cấp; ghi nhận thông tin gắn với Hợp đồng/Đơn hàng để kiểm tra đối tượng bàn giao là hàng hóa hay dịch vụ.",
   "lane": ""
  },
  "2": {
   "name": "Lập và gửi thông báo giao hàng",
   "actor": "Phòng Hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Lập thông báo giao hàng từ thông tin đã nhận; gửi Phòng Quản lý tài sản để chuẩn bị tiếp nhận.",
   "lane": ""
  },
  "3": {
   "name": "Ghi nhận giao nhận hàng và hồ sơ kho",
   "actor": "Phòng Quản lý tài sản",
   "type": "user",
   "form": "Không có",
   "note": "Tiếp nhận hàng hóa; ghi nhận giao hàng và hồ sơ kho. Hàng bổ sung/thay thế quay lại bước này để làm lại thủ tục giao nhận, nhập kho và kiểm tra chất lượng.",
   "lane": ""
  },
  "4": {
   "name": "Ghi nhận xác nhận dịch vụ",
   "actor": "Đơn vị Sử dụng",
   "type": "user",
   "form": "Không có",
   "note": "Trực tiếp theo dõi Nhà thầu thực hiện dịch vụ và xác nhận kết quả/khối lượng theo Hợp đồng. Việc giao nhận dịch vụ không qua Phòng Quản lý tài sản, nhập kho hay KCS kho.",
   "lane": ""
  },
  "5": {
   "name": "Lập yêu cầu kiểm tra chất lượng",
   "actor": "Phòng Quản lý tài sản",
   "type": "user",
   "form": "Không có",
   "note": "Lập yêu cầu kiểm tra chất lượng đối với hàng hóa đã tiếp nhận. [?] Chi tiết quy trình sẽ làm rõ thêm với Phòng Quản lý tài sản.",
   "lane": ""
  },
  "6": {
   "name": "Ghi nhận kết quả kiểm tra chất lượng",
   "actor": "Đơn vị Sử dụng",
   "type": "user",
   "form": "Không có",
   "note": "Ghi nhận kết quả kiểm tra chất lượng hàng hóa và căn cứ đánh giá; phân biệt kết quả lần đầu với kết quả sau bổ sung/thay thế. [?] Làm rõ phân công kiểm tra với Phòng Quản lý tài sản.",
   "lane": ""
  },
  "7": {
   "name": "Lập biên bản không đạt và ghi nhận hướng xử lý",
   "actor": "Phòng Quản lý tài sản",
   "type": "user",
   "form": "Không có",
   "note": "Lập biên bản hàng hóa không đạt. Quyết định từ chối ngay hoặc đồng ý cho bổ sung/thay thế hàng hóa phù hợp trong 7 ngày kể từ ngày lập biên bản.",
   "lane": ""
  },
  "8": {
   "name": "Theo dõi bổ sung / thay thế trong 7 ngày",
   "actor": "Phòng Quản lý tài sản",
   "type": "user",
   "form": "Không có",
   "note": "Theo dõi Nhà thầu/Nhà cung cấp bổ sung/thay thế hàng hóa trong 7 ngày từ ngày lập biên bản; ghi nhận việc khắc phục và hàng giao bổ sung/thay thế.",
   "lane": ""
  },
  "9": {
   "name": "Ghi nhận quyền từ chối và chuyển xử lý theo HĐ",
   "actor": "Phòng Quản lý tài sản",
   "type": "user",
   "form": "Không có",
   "note": "Ghi nhận quyết định từ chối ngay hoặc quyền từ chối khi hàng sau bổ sung/thay thế vẫn không đáp ứng quy định; chuyển trường hợp không khắc phục được sang xử lý theo Hợp đồng/Đơn hàng.",
   "lane": ""
  },
  "10": {
   "name": "Trả hàng / ghi nhận vướng mắc xử lý",
   "actor": "Đơn vị Sử dụng; phối hợp ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Trả hàng cho Nhà thầu/Nhà cung cấp theo hướng xử lý. Nếu có vướng mắc đặc thù, ghi nhận để xin ý kiến. ĐVMS phối hợp ĐVSD xử lý theo Hợp đồng/Đơn hàng.",
   "lane": ""
  },
  "11": {
   "name": "Xử lý vi phạm qua MS23.01",
   "actor": "Phòng Hợp đồng / ĐVMS; phối hợp ĐVSD",
   "type": "user",
   "form": "Không có",
   "note": "Căn cứ chế tài Hợp đồng/Đơn hàng để xử lý vi phạm chậm tiến độ hoặc chất lượng không đạt; lập biên bản phạt/hồ sơ xử lý qua MS23.01.",
   "lane": ""
  },
  "12": {
   "name": "Thực hiện thủ tục hủy HĐ / Đơn hàng",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Khi không thể hoàn thành mục tiêu mua sắm do không khắc phục/thay thế được hàng hóa, thực hiện thủ tục hủy phần hàng hóa lỗi hoặc toàn bộ Hợp đồng/Đơn hàng.",
   "lane": ""
  },
  "13": {
   "name": "Lập Tờ trình xin ý kiến Người có thẩm quyền",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Lập Tờ trình xin ý kiến Người có thẩm quyền khi không thể thực hiện theo quy trình hoặc có vướng mắc đặc thù; áp dụng mục 6.6 QT 10.2.5.",
   "lane": ""
  },
  "14": {
   "name": "Tập hợp và xác nhận đủ hồ sơ bàn giao",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Tập hợp hồ sơ bàn giao; kiểm tra đủ hàng hóa, chứng từ và căn cứ chất lượng trước khi chuyển lập HOC. HOC có thể theo từng đợt hoặc toàn bộ tùy Hợp đồng.",
   "lane": ""
  },
  "15": {
   "name": "Bổ sung hàng / chứng từ / căn cứ",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Bổ sung hàng hóa, chứng từ hoặc căn cứ còn thiếu theo nội dung kiểm tra; tập hợp lại hồ sơ để xác nhận đủ điều kiện bàn giao.",
   "lane": ""
  },
  "16": {
   "name": "AI kiểm tra chứng từ / căn cứ",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Kiểm tra chứng từ, căn cứ và hồ sơ bàn giao trước khi soạn HOC; phát hiện nội dung chưa đủ/chưa phù hợp. [?] Bộ tiêu chí kiểm tra cần làm rõ.",
   "lane": ""
  },
  "17": {
   "name": "AI hỗ trợ soạn HOC",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Hỗ trợ lập dự thảo HOC từ hồ sơ/căn cứ đã kiểm tra OK; dùng mẫu áp dụng cho đợt hoặc phạm vi bàn giao theo Hợp đồng.",
   "lane": ""
  },
  "18": {
   "name": "Hoàn thiện hồ sơ và HOC",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Rà soát dự thảo AI, bổ sung/chỉnh sửa nội dung và hồ sơ liên quan; khi AI kiểm tra trước duyệt không OK, sửa theo nội dung được chỉ ra.",
   "lane": ""
  },
  "19": {
   "name": "AI kiểm tra HOC trước duyệt",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Kiểm tra nội dung HOC và các chứng từ/căn cứ sau khi Phòng Hợp đồng hoàn thiện. [?] Checklist cần làm rõ.",
   "lane": ""
  },
  "20": {
   "name": "Phê duyệt hồ sơ bàn giao để trình ký",
   "actor": "Trưởng phòng Hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Xem hồ sơ bàn giao và HOC; ghi nhận quyết định duyệt để trình ký hoặc ý kiến yêu cầu hoàn thiện lại.",
   "lane": ""
  },
  "21": {
   "name": "Trình ký và cập nhật HOC đã ký",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Chọn hình thức trình ký được áp dụng; theo dõi và cập nhật HOC có đầy đủ chữ ký. [?] Tuyến ký và phạm vi tích hợp ký cần làm rõ.",
   "lane": ""
  },
  "22": {
   "name": "AI cập nhật ngày bàn giao thực tế",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Đọc HOC đã ký để cập nhật ngày bàn giao thực tế có trong văn bản. Không tự suy ra ngày chưa có; chức năng dùng chung với MS23 tổng quan chỉ thực hiện một lần.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Đối tượng bàn giao?"
  },
  "G2": {
   "kind": "xor",
   "name": "Kết quả kiểm tra chất lượng?"
  },
  "G3": {
   "kind": "xor",
   "name": "Đã bổ sung / thay thế?"
  },
  "G4": {
   "kind": "xor",
   "name": "Hướng xử lý lần đầu?"
  },
  "G5": {
   "kind": "xor",
   "name": "Có hàng bổ sung / thay thế trong hạn 7 ngày?"
  },
  "G6": {
   "kind": "xor",
   "name": "Hướng xử lý theo HĐ / PO?"
  },
  "G7": {
   "kind": "xor",
   "name": "Đủ hàng, chứng từ và căn cứ chất lượng?"
  },
  "G8": {
   "kind": "xor",
   "name": "AI kiểm tra OK?"
  },
  "G9": {
   "kind": "xor",
   "name": "AI kiểm tra OK?"
  },
  "G10": {
   "kind": "xor",
   "name": "Được duyệt?"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Nhà thầu / Nhà cung cấp thông báo bàn giao"
  },
  "E1": {
   "kind": "end",
   "name": "Có hồ sơ dịch vụ cho MS23.03 ĐVSD tiếp tục chủ trì nghiệm thu"
  },
  "E2": {
   "kind": "end",
   "name": "Kết thúc / Hủy HĐ hoặc phần hàng lỗi"
  },
  "E3": {
   "kind": "end",
   "name": "Chuyển MS23.01; chờ kết quả xử lý"
  },
  "E4": {
   "kind": "end",
   "name": "Chờ ý kiến chỉ đạo [?] Luồng xử lý tiếp"
  },
  "E5": {
   "kind": "end",
   "name": "Hoàn tất hồ sơ bàn giao"
  }
 },
 "edges": [
  [
   "1",
   "G1",
   ""
  ],
  [
   "3",
   "5",
   ""
  ],
  [
   "4",
   "E1",
   ""
  ],
  [
   "5",
   "6",
   ""
  ],
  [
   "6",
   "G2",
   ""
  ],
  [
   "7",
   "G4",
   ""
  ],
  [
   "8",
   "G5",
   ""
  ],
  [
   "11",
   "E3",
   ""
  ],
  [
   "12",
   "E2",
   ""
  ],
  [
   "13",
   "E4",
   ""
  ],
  [
   "14",
   "G7",
   ""
  ],
  [
   "16",
   "G8",
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
   "G9",
   ""
  ],
  [
   "20",
   "G10",
   ""
  ],
  [
   "21",
   "22",
   ""
  ],
  [
   "22",
   "E5",
   ""
  ],
  [
   "G1",
   "2",
   "Hàng hóa"
  ],
  [
   "G1",
   "4",
   "Dịch vụ"
  ],
  [
   "G2",
   "14",
   "Đạt"
  ],
  [
   "G2",
   "G3",
   "Không đạt"
  ],
  [
   "G3",
   "9",
   "Đã bổ sung / thay thế: vẫn không đạt"
  ],
  [
   "G4",
   "8",
   "Cho bổ sung / thay thế"
  ],
  [
   "G4",
   "9",
   "Từ chối ngay"
  ],
  [
   "G5",
   "3",
   "Có → tiếp nhận, kiểm tra lại"
  ],
  [
   "G5",
   "9",
   "Không khắc phục trong hạn"
  ],
  [
   "G6",
   "12",
   "Không hoàn thành mục tiêu mua sắm"
  ],
  [
   "G6",
   "11",
   "Phạt / hồ sơ xử lý"
  ],
  [
   "G6",
   "13",
   "Vướng mắc đặc thù / ngoại lệ"
  ],
  [
   "G7",
   "16",
   "Đủ"
  ],
  [
   "G7",
   "15",
   "Chưa đủ"
  ],
  [
   "G8",
   "17",
   "OK"
  ],
  [
   "G8",
   "14",
   "Không OK → bổ sung / chỉnh sửa"
  ],
  [
   "G9",
   "20",
   "OK"
  ],
  [
   "G9",
   "18",
   "Không OK → hoàn thiện lại"
  ],
  [
   "G10",
   "21",
   "Có"
  ],
  [
   "G10",
   "14",
   "Không [? Q2]"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
