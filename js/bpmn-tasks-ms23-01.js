/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS23.01".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS23.01"] = {
 "page": "MS23.01",
 "count": 12,
 "tasks": {
  "1": {
   "name": "Lập thông tin văn bản phát sinh",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Chọn loại văn bản, nêu nội dung/sự việc và đính kèm căn cứ. Nếu sửa đổi hợp đồng, xác định nội dung được phép sửa đổi và lấy ý kiến ĐVSD khi cần.",
   "lane": ""
  },
  "2": {
   "name": "Lập và trình đề xuất sửa đổi",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Tổng hợp nội dung sửa đổi đã thống nhất với đơn vị sử dụng, lập tờ trình đề xuất sửa đổi.",
   "lane": ""
  },
  "3": {
   "name": "Ghi nhận duyệt đề xuất sửa đổi",
   "actor": "Người có thẩm quyền",
   "type": "user",
   "form": "Không có",
   "note": "Ghi nhận quyết định của người có thẩm quyền, ý kiến chuyên môn nếu được yêu cầu; chưa duyệt thì hoàn thiện tờ trình và trình lại.",
   "lane": ""
  },
  "4": {
   "name": "AI kiểm tra chứng từ / căn cứ và các văn bản",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "AI kiểm tra chứng từ, căn cứ và các văn bản trong hồ sơ. Nếu không đạt, trả kết quả để Phòng Hợp đồng sửa lại thông tin và tài liệu tại bước 1, sau đó thực hiện lại luồng kiểm tra. Nếu đạt, tiếp tục bước 5.",
   "lane": ""
  },
  "5": {
   "name": "AI hỗ trợ soạn văn bản",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Sinh dự thảo đúng loại văn bản từ căn cứ đã có. Với phụ lục sửa đổi, dùng nội dung đề xuất đã được duyệt.",
   "lane": ""
  },
  "6": {
   "name": "Hoàn thiện văn bản và kết quả thống nhất",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Rà soát dự thảo, ghi nhận nội dung thống nhất với đối tác khi áp dụng; hoàn thiện hồ sơ trình duyệt.",
   "lane": ""
  },
  "7": {
   "name": "AI kiểm tra văn bản trước duyệt",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Kiểm tra nội dung và căn cứ trong hồ sơ trước khi chuyển duyệt.",
   "lane": ""
  },
  "8": {
   "name": "Phê duyệt văn bản để trình ký [? Q2]",
   "actor": "Trưởng phòng Hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Ghi nhận ý kiến Trưởng phòng HĐ theo note.",
   "lane": ""
  },
  "9": {
   "name": "Chọn hình thức và trình ký văn bản",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Chọn VContract/ký cứng/hình thức được chấp nhận và lập bộ hồ sơ trình ký.",
   "lane": ""
  },
  "10": {
   "name": "Ghi nhận kết quả ký văn bản",
   "actor": "Người có thẩm quyền",
   "type": "user",
   "form": "Không có",
   "note": "Ghi nhận phê duyệt/ký của cấp có thẩm quyền. Với phụ lục sửa đổi, không duyệt thì quay lại hồ sơ trình ký.",
   "lane": ""
  },
  "11": {
   "name": "Cập nhật văn bản đã ký đầy đủ và gửi lại",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Theo dõi, tải lên và cập nhật văn bản có đầy đủ chữ ký theo loại văn bản, gồm chữ ký nhà thầu/nhà cung cấp khi áp dụng. Chọn hình thức gửi và gửi lại văn bản đã ký đầy đủ cho nhà thầu/nhà cung cấp.",
   "lane": ""
  },
  "12": {
   "name": "AI cập nhật thông tin từ văn bản đã ký",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Đọc văn bản đã ký để cập nhật thông tin phát sinh, ngày thực tế có trong văn bản. Chốt nội dung phụ lục được cập nhật và hiệu lực áp dụng; mốc nhắc phải dùng tiến độ có hiệu lực. Đây là chức năng cập nhật chung được tham chiếu tại tổng quan, thực hiện một lần. Chức năng dùng chung được tham chiếu tại MS23 tổng quan; chỉ thực hiện một lần cho mỗi hồ sơ ký.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Là sửa đổi hợp đồng?"
  },
  "G2": {
   "kind": "xor",
   "name": "Đề xuất được duyệt?"
  },
  "G3": {
   "kind": "xor",
   "name": "⚙"
  },
  "G4": {
   "kind": "xor",
   "name": "AI kiểm tra OK?"
  },
  "G5": {
   "kind": "xor",
   "name": "Được duyệt để trình ký?"
  },
  "G6": {
   "kind": "xor",
   "name": "Được ký duyệt?"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Phát sinh nhu cầu lập văn bản"
  },
  "E1": {
   "kind": "end",
   "name": "Hoàn tất một văn bản phát sinh"
  }
 },
 "edges": [
  [
   "1",
   "G1",
   ""
  ],
  [
   "2",
   "3",
   ""
  ],
  [
   "3",
   "G2",
   ""
  ],
  [
   "4",
   "G4",
   ""
  ],
  [
   "5",
   "6",
   ""
  ],
  [
   "6",
   "7",
   ""
  ],
  [
   "7",
   "8",
   ""
  ],
  [
   "8",
   "G5",
   ""
  ],
  [
   "9",
   "10",
   ""
  ],
  [
   "10",
   "G6",
   ""
  ],
  [
   "11",
   "12",
   ""
  ],
  [
   "12",
   "E1",
   ""
  ],
  [
   "G1",
   "2",
   "Có"
  ],
  [
   "G1",
   "G3",
   "Không"
  ],
  [
   "G2",
   "G3",
   "Có"
  ],
  [
   "G2",
   "2",
   "Không"
  ],
  [
   "G3",
   "4",
   ""
  ],
  [
   "G4",
   "5",
   "OK"
  ],
  [
   "G4",
   "1",
   "Không OK — Phòng Hợp đồng sửa lại"
  ],
  [
   "G5",
   "6",
   "Không [? Q2]"
  ],
  [
   "G5",
   "9",
   "Có"
  ],
  [
   "G6",
   "11",
   "Có"
  ],
  [
   "G6",
   "9",
   "Không [? Q2]"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
