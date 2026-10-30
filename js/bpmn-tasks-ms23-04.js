/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS23.04".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS23.04"] = {
 "page": "MS23.04",
 "count": 14,
 "tasks": {
  "1": {
   "name": "Kiểm tra yêu cầu và điều kiện ký chung — G1",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Nhận thông tin từ G1: biên bản nghiệm thu tại MS23.03 đã hoàn thiện nội dung nhưng chưa ký. Kiểm tra yêu cầu thanh lý, điều kiện ký chung và bảo lãnh theo từng hợp đồng. Không lấy nghiệm thu đã ký xong làm điều kiện của nhánh ký chung.",
   "lane": ""
  },
  "2": {
   "name": "Chuẩn bị biên bản thanh lý để ký chung",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Chuẩn bị biên bản thanh lý dựa trên hồ sơ hợp đồng và thông tin nghiệm thu đã hoàn thiện nhưng chưa ký. Sau khi hoàn thiện và kiểm tra, trả biên bản về G2 tại MS23.03 để tập hợp hai biên bản và đi chung tuyến ký.",
   "lane": ""
  },
  "3": {
   "name": "Chờ MS23.03 hoàn tất và bổ sung hồ sơ",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Nếu ký riêng, MS23.03 tiếp tục toàn bộ tuyến ký và cập nhật nghiệm thu. Chờ nghiệm thu đã ký đầy đủ, đi hết MS23.03; bổ sung bảo lãnh theo hợp đồng. Chưa hoàn tất nghiệm thu thì chưa trình ký thanh lý.",
   "lane": ""
  },
  "4": {
   "name": "Chuẩn bị hồ sơ thanh lý để ký riêng",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Nhận kết quả nghiệm thu hoàn tất từ MS23.03; tập hợp biên bản đã ký, bảo lãnh và căn cứ thanh lý. Thực hiện quyết toán giá trị trước khi tiếp tục trình ký thanh lý riêng.",
   "lane": ""
  },
  "5": {
   "name": "Quyết toán giá trị — nhánh ký riêng",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Sau khi MS23.03 hoàn tất nghiệm thu, thực hiện quyết toán giá trị theo hợp đồng và hồ sơ đã ký. Ghi nhận kết quả trước khi trình ký thanh lý riêng. Nhánh ký chung không được mặc định dùng thời điểm này; cần xác nhận Q1.",
   "lane": ""
  },
  "6": {
   "name": "AI hỗ trợ soạn biên bản thanh lý theo mẫu",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Sử dụng mẫu biên bản thanh lý và hồ sơ đã tập hợp để hỗ trợ tạo dự thảo. Nội dung dự thảo bám hợp đồng và căn cứ bàn giao / nghiệm thu, bảo lãnh được cung cấp; chuyển Phòng Hợp đồng kiểm tra và hoàn thiện.",
   "lane": ""
  },
  "7": {
   "name": "Soạn thảo và hoàn thiện biên bản thanh lý",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Kiểm tra dự thảo AI, hoàn thiện biên bản theo mẫu và đính kèm căn cứ. Khi AI hoặc bất kỳ cấp ký nào trả lại, sửa nội dung theo ý kiến và trình lại từ Trưởng phòng Hợp đồng. Nếu cần thống nhất nội dung, trao đổi Nhà thầu / Nhà cung cấp qua email.",
   "lane": ""
  },
  "8": {
   "name": "AI kiểm tra hồ sơ sau hoàn thiện",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Kiểm tra chứng từ, căn cứ và phiên bản biên bản thanh lý sau khi Phòng Hợp đồng hoàn thiện, trước khi chuyển Trưởng phòng Hợp đồng ký duyệt. Khi chưa đạt, nêu nội dung cần sửa / bổ sung để người soạn thảo xử lý.",
   "lane": ""
  },
  "9": {
   "name": "Ký duyệt biên bản thanh lý",
   "actor": "Trưởng phòng Hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Xem biên bản thanh lý và các hồ sơ làm căn cứ, chỉ áp dụng nhánh ký riêng. Ghi nhận đồng ý ký duyệt hoặc ý kiến không đồng ý để Phòng Hợp đồng sửa soạn thảo.",
   "lane": ""
  },
  "10": {
   "name": "Ký biên bản thanh lý",
   "actor": "Giám đốc VHT",
   "type": "user",
   "form": "Không có",
   "note": "Giám đốc VHT xem biên bản thanh lý và bộ hồ sơ đã được Trưởng phòng Hợp đồng ký duyệt; ghi nhận đồng ý ký hoặc nêu ý kiến yêu cầu chỉnh sửa.",
   "lane": ""
  },
  "11": {
   "name": "Kiểm tra hồ sơ trình ký",
   "actor": "Văn thư",
   "type": "user",
   "form": "Không có",
   "note": "Văn thư tiếp nhận biên bản và hồ sơ đã qua Giám đốc VHT; kiểm tra hồ sơ trước khi chuyển Tổng Giám đốc. Nếu hồ sơ chưa đạt, ghi nhận ý kiến và trả Phòng Hợp đồng hoàn thiện.",
   "lane": ""
  },
  "12": {
   "name": "Ký biên bản thanh lý",
   "actor": "Tổng Giám đốc",
   "type": "user",
   "form": "Không có",
   "note": "Tổng Giám đốc xem biên bản thanh lý cùng hồ sơ trình ký đã được kiểm tra; quyết định đồng ý ký hoặc yêu cầu chỉnh sửa.",
   "lane": ""
  },
  "13": {
   "name": "Cập nhật biên bản thanh lý đã ký đầy đủ — G3",
   "actor": "Phòng Hợp đồng / Chuyên quản hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Ký chung: nhận biên bản thanh lý và kết quả ký từ G3 của MS23.03, không chạy lại tuyến ký MS23.04. Ký riêng: cập nhật bản thanh lý sau khi hoàn tất tuyến ký tại MS23.04. Ghi nhận đủ chữ ký theo hợp đồng; gửi bản ký cho Nhà thầu / Nhà cung cấp.",
   "lane": ""
  },
  "14": {
   "name": "AI cập nhật thông tin từ biên bản đã ký",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Đọc biên bản thanh lý đã được cập nhật đầy đủ chữ ký; ghi nhận thông tin và kết quả thanh lý vào hồ sơ hợp đồng. Chức năng dùng chung với MS23 tổng quan chỉ thực hiện một lần.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Hợp đồng yêu cầu biên bản thanh lý?"
  },
  "G2": {
   "kind": "xor",
   "name": "Đủ điều kiện ký chung theo hợp đồng và đủ bảo lãnh?"
  },
  "G3": {
   "kind": "xor",
   "name": "Nghiệm thu đã ký xong hẳn và đầy đủ bảo lãnh?"
  },
  "G4": {
   "kind": "xor",
   "name": "Hồ sơ thanh lý để trình ký"
  },
  "G5": {
   "kind": "xor",
   "name": "AI kiểm tra OK?"
  },
  "G6": {
   "kind": "xor",
   "name": "Phương án ký đã chọn?"
  },
  "G7": {
   "kind": "xor",
   "name": "Đồng ý ký duyệt?"
  },
  "G8": {
   "kind": "xor",
   "name": "Đồng ý ký?"
  },
  "G9": {
   "kind": "xor",
   "name": "Hồ sơ kiểm tra OK?"
  },
  "G10": {
   "kind": "xor",
   "name": "Đồng ý ký?"
  }
 },
 "events": {
  "S2": {
   "kind": "start",
   "name": "G1 — Nghiệm thu đã hoàn thiện CHƯA KÝ tại MS23.03 bước 6"
  },
  "E1": {
   "kind": "end",
   "name": "Không thực hiện thanh lý Chỉ nghiệm thu theo MS23.03"
  },
  "E2": {
   "kind": "end",
   "name": "Hoàn tất biên bản thanh lý"
  }
 },
 "edges": [
  [
   "1",
   "G2",
   ""
  ],
  [
   "2",
   "G4",
   ""
  ],
  [
   "3",
   "G3",
   ""
  ],
  [
   "4",
   "5",
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
   "G7",
   ""
  ],
  [
   "10",
   "G8",
   ""
  ],
  [
   "11",
   "G9",
   ""
  ],
  [
   "12",
   "G10",
   ""
  ],
  [
   "14",
   "E2",
   ""
  ],
  [
   "G1",
   "1",
   "Có"
  ],
  [
   "G1",
   "E1",
   "Không — chỉ nghiệm thu"
  ],
  [
   "G2",
   "2",
   "OK — đủ điều kiện, ký chung"
  ],
  [
   "G2",
   "3",
   "Not OK — chưa đủ điều kiện, ký riêng"
  ],
  [
   "G3",
   "3",
   "Not OK — tiếp tục chờ / bổ sung"
  ],
  [
   "G3",
   "4",
   "OK — nghiệm thu đã ký xong hẳn, đủ bảo lãnh"
  ],
  [
   "G4",
   "6",
   ""
  ],
  [
   "G5",
   "G6",
   "OK"
  ],
  [
   "G5",
   "7",
   "Not OK — ✉ trả lỗi để sửa"
  ],
  [
   "G6",
   "9",
   "Ký riêng"
  ],
  [
   "G7",
   "10",
   "OK"
  ],
  [
   "G7",
   "7",
   "Not OK — ✉ trả ý kiến; sửa và trình lại từ Trưởng phòng HĐ"
  ],
  [
   "G8",
   "11",
   "OK"
  ],
  [
   "G8",
   "7",
   "Not OK — ✉ trả ý kiến; sửa và trình lại từ Trưởng phòng HĐ"
  ],
  [
   "G9",
   "12",
   "OK"
  ],
  [
   "G9",
   "7",
   "Not OK — ✉ trả ý kiến; sửa và trình lại từ Trưởng phòng HĐ"
  ],
  [
   "G10",
   "13",
   "OK"
  ],
  [
   "G10",
   "7",
   "Not OK — ✉ trả ý kiến; sửa và trình lại từ Trưởng phòng HĐ"
  ],
  [
   "S2",
   "G1",
   ""
  ]
 ]
};
