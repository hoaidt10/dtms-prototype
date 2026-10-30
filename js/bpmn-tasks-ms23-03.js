/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS23.03".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS23.03"] = {
 "page": "MS23.03",
 "count": 14,
 "tasks": {
  "1": {
   "name": "Ký và gửi báo cáo KCS tài sản",
   "actor": "Phòng Đảm bảo hàng hóa / Trung tâm Mua sắm",
   "type": "user",
   "form": "Không có",
   "note": "Ký báo cáo KCS tài sản; gửi báo cáo cho Chuyên quản hợp đồng thuộc Phòng Hợp đồng để làm căn cứ soạn thảo và trình Trưởng phòng Hợp đồng ký nghiệm thu.",
   "lane": ""
  },
  "2": {
   "name": "Ký và gửi báo cáo KCS dịch vụ",
   "actor": "Đơn vị Sử dụng",
   "type": "user",
   "form": "Không có",
   "note": "Ký và gửi báo cáo KCS dịch vụ cho Chuyên quản hợp đồng thuộc Phòng Hợp đồng để làm căn cứ soạn thảo và trình Trưởng phòng Hợp đồng ký nghiệm thu.",
   "lane": ""
  },
  "3": {
   "name": "Tiếp nhận báo cáo và xác định hồ sơ nghiệm thu",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Chuyên quản hợp đồng tập hợp báo cáo đã ký từ đơn vị chủ quản; ghi nhận loại hồ sơ và kết quả nghiệm thu theo Hợp đồng. Kiểm tra căn cứ trước khi chuyển soạn biên bản.",
   "lane": ""
  },
  "4": {
   "name": "Ghi nhận khắc phục và kiểm tra lại",
   "actor": "Đơn vị Sử dụng",
   "type": "user",
   "form": "Không có",
   "note": "Phối hợp Nhà thầu/Nhà cung cấp khắc phục nội dung chưa đạt cho cả tài sản và dịch vụ; ghi nhận kết quả kiểm tra lại. Chuyển lại đơn vị chủ quản để ký/cập nhật báo cáo KCS tương ứng.",
   "lane": ""
  },
  "5": {
   "name": "AI hỗ trợ soạn biên bản theo template",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Hỗ trợ soạn dự thảo biên bản nghiệm thu theo template phù hợp loại hồ sơ đã xác định, sử dụng báo cáo KCS và căn cứ đã kiểm tra.",
   "lane": ""
  },
  "6": {
   "name": "Soạn thảo và hoàn thiện biên bản nghiệm thu — G1",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Hoàn thiện biên bản theo mẫu, rà soát dự thảo AI và đính kèm báo cáo KCS. Tại đây biên bản mới hoàn thiện nội dung, CHƯA KÝ. Xác định hợp đồng có yêu cầu thanh lý và có đủ điều kiện ký chung hay không.",
   "lane": ""
  },
  "7": {
   "name": "Tập hợp bộ hồ sơ nghiệm thu và thanh lý — G2",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Chờ MS23.04 hoàn thiện biên bản thanh lý tại G2. Tập hợp biên bản nghiệm thu và biên bản thanh lý vào cùng bộ hồ sơ. Chỉ chuyển kiểm tra / trình ký khi cả hai biên bản đã hoàn thiện; thực hiện một tuyến ký tại MS23.03.",
   "lane": ""
  },
  "8": {
   "name": "AI kiểm tra hồ sơ sau hoàn thiện",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Kiểm tra phiên bản biên bản và căn cứ sau khi Phòng Hợp đồng hoàn thiện, trước khi chuyển Trưởng phòng Hợp đồng ký duyệt.",
   "lane": ""
  },
  "9": {
   "name": "Ký duyệt biên bản nghiệm thu",
   "actor": "Trưởng phòng Hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Xem biên bản nghiệm thu và báo cáo KCS làm căn cứ; ghi nhận đồng ý ký hoặc ý kiến không đồng ý theo tuyến ký đã chốt.",
   "lane": ""
  },
  "10": {
   "name": "Ký biên bản nghiệm thu",
   "actor": "Giám đốc",
   "type": "user",
   "form": "Không có",
   "note": "Xem biên bản nghiệm thu và báo cáo KCS làm căn cứ; ghi nhận đồng ý ký hoặc ý kiến không đồng ý theo tuyến ký đã chốt.",
   "lane": ""
  },
  "11": {
   "name": "Kiểm tra hồ sơ trình ký",
   "actor": "Văn thư",
   "type": "user",
   "form": "Không có",
   "note": "Kiểm tra hồ sơ đã được Trưởng phòng Hợp đồng và Giám đốc ký trước khi chuyển Tổng Giám đốc.",
   "lane": ""
  },
  "12": {
   "name": "Ký biên bản nghiệm thu",
   "actor": "Tổng Giám đốc",
   "type": "user",
   "form": "Không có",
   "note": "Xem biên bản nghiệm thu và báo cáo KCS làm căn cứ; ghi nhận đồng ý ký hoặc ý kiến không đồng ý theo tuyến ký đã chốt.",
   "lane": ""
  },
  "13": {
   "name": "Cập nhật biên bản đã ký đầy đủ — G3",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Theo dõi tuyến ký và cập nhật đầy đủ chữ ký theo hợp đồng. Ký chung: cập nhật riêng kết quả ký biên bản nghiệm thu và biên bản thanh lý; gửi kết quả thanh lý về MS23.04 tại G3. Ký riêng: cập nhật biên bản nghiệm thu, hoàn tất MS23.03 rồi mới trình ký thanh lý tại MS23.04.",
   "lane": ""
  },
  "14": {
   "name": "AI cập nhật ngày nghiệm thu thực tế",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Đọc biên bản đã ký để cập nhật ngày nghiệm thu thực tế có trong văn bản, phục vụ theo dõi và căn cứ thanh toán theo Hợp đồng. Chức năng dùng chung với MS23 tổng quan chỉ thực hiện một lần.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Loại KCS / đối tượng nghiệm thu?"
  },
  "G2": {
   "kind": "xor",
   "name": "Hồ sơ / KCS đủ điều kiện?"
  },
  "G3": {
   "kind": "xor",
   "name": "HĐ yêu cầu thanh lý và đủ điều kiện ký chung?"
  },
  "G4": {
   "kind": "xor",
   "name": "AI kiểm tra OK?"
  },
  "G5": {
   "kind": "xor",
   "name": "Đồng ý ký?"
  },
  "G6": {
   "kind": "xor",
   "name": "Đồng ý ký?"
  },
  "G7": {
   "kind": "xor",
   "name": "Hồ sơ đạt yêu cầu?"
  },
  "G8": {
   "kind": "xor",
   "name": "Đồng ý ký?"
  }
 },
 "events": {
  "S2": {
   "kind": "start",
   "name": "Có kết quả KCS / căn cứ để xác nhận nghiệm thu"
  },
  "E1": {
   "kind": "end",
   "name": "Có nghiệm thu đã ký đầy đủ / được phê duyệt"
  }
 },
 "edges": [
  [
   "1",
   "3",
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
   "G1",
   "Khắc phục → cập nhật / ký lại KCS"
  ],
  [
   "5",
   "6",
   ""
  ],
  [
   "6",
   "G3",
   ""
  ],
  [
   "7",
   "8",
   "Hai biên bản hoàn thiện"
  ],
  [
   "8",
   "G4",
   ""
  ],
  [
   "9",
   "G5",
   ""
  ],
  [
   "10",
   "G6",
   ""
  ],
  [
   "11",
   "G7",
   ""
  ],
  [
   "12",
   "G8",
   ""
  ],
  [
   "13",
   "14",
   ""
  ],
  [
   "14",
   "E1",
   ""
  ],
  [
   "G1",
   "1",
   "Tài sản"
  ],
  [
   "G1",
   "2",
   "Dịch vụ"
  ],
  [
   "G2",
   "5",
   "Có"
  ],
  [
   "G2",
   "4",
   "✉ KCS chưa đạt"
  ],
  [
   "G2",
   "3",
   "✉ Thiếu chứng từ → PHĐ yêu cầu bổ sung"
  ],
  [
   "G3",
   "8",
   "Ký riêng / không yêu cầu thanh lý"
  ],
  [
   "G3",
   "7",
   "Ký chung"
  ],
  [
   "G4",
   "9",
   "OK"
  ],
  [
   "G4",
   "6",
   "✉ Không OK → chỉnh sửa"
  ],
  [
   "G5",
   "10",
   "Đồng ý"
  ],
  [
   "G5",
   "6",
   "✉ Không đồng ý → sửa soạn thảo"
  ],
  [
   "G6",
   "11",
   "Đồng ý"
  ],
  [
   "G6",
   "6",
   "✉ Không đồng ý → sửa soạn thảo"
  ],
  [
   "G7",
   "12",
   "Đạt"
  ],
  [
   "G8",
   "13",
   "Đồng ý"
  ],
  [
   "G8",
   "6",
   "✉ Không đồng ý → sửa soạn thảo"
  ],
  [
   "S2",
   "G1",
   ""
  ]
 ]
};
