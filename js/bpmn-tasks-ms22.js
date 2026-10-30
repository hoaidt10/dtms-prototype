/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS22".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS22"] = {
 "page": "MS22",
 "count": 13,
 "tasks": {
  "1": {
   "name": "Tiếp nhận thông tin và hồ sơ hợp đồng",
   "actor": "Phòng hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Căn cứ vào đề xuất mua sắm và hồ sơ thầu mà phòng thầu bàn giao: tiếp nhận thông tin cơ bản của hợp đồng.",
   "lane": ""
  },
  "2": {
   "name": "Hoàn thiện phụ lục kỹ thuật và cập nhật mã hàng",
   "actor": "Đơn vị sử dụng",
   "type": "user",
   "form": "Không có",
   "note": "Đơn vị kỹ thuật hoàn thiện phụ lục kỹ thuật(yêu cầu kỹ thuật, thông số sản phẩm, tiêu chuẩn nghiệm thu, SLA và tiến độ bàn giao). Lập song song với body/phụ lục giá.",
   "lane": ""
  },
  "3": {
   "name": "Hoàn thiện body và phụ lục giá",
   "actor": "Phòng hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Hoàn thiện body và phụ lục 1 về giá/danh mục hàng hóa. Thực hiện song song với Đơn vị sử dụng lập phụ lục kỹ thuật.",
   "lane": ""
  },
  "4": {
   "name": "Gửi dự thảo cùng phụ lục cho nhà thầu/nhà cung cấp để thương thảo",
   "actor": "Phòng hợp đồng và nhà thầu/nhà cung cấp",
   "type": "user",
   "form": "Không có",
   "note": "Gửi dự thảo cùng phụ lục cho nhà thầu/nhà cung cấp để thương thảo qua email.",
   "lane": ""
  },
  "5": {
   "name": "Kiểm tra thông tin trước phê duyệt",
   "actor": "Hệ thống ĐTMS / Tích hợp AI",
   "type": "service",
   "form": "Không có",
   "note": "Kiểm tra hồ sơ sau thương thảo/hoàn thiện hoặc sau chỉnh sửa. OK: chuyển Trưởng phòng hợp đồng duyệt. Not OK: trả người soạn thảo xử lý, sửa hồ sơ; xác định có cần trao đổi lại với nhà thầu/nhà cung cấp.",
   "lane": ""
  },
  "6": {
   "name": "Làm việc lại với nhà thầu/nhà cung cấp",
   "actor": "Phòng hợp đồng và nhà thầu/nhà cung cấp",
   "type": "user",
   "form": "Không có",
   "note": "Trao đổi lại qua email để thống nhất các nội dung cần thay đổi sau khi Phòng hợp đồng xem xét cảnh báo AI; cập nhật dự thảo, phụ lục và biên bản liên quan, rồi chuyển AI kiểm tra lại.",
   "lane": "Phòng hợp đồng"
  },
  "7": {
   "name": "Kiểm tra và chỉnh sửa hồ sơ",
   "actor": "Phòng hợp đồng (người soạn thảo)",
   "type": "user",
   "form": "Không có",
   "note": "Chỉnh sửa nội bộ theo cảnh báo AI đã được kiểm tra hoặc theo ý kiến trả hồ sơ của Trưởng phòng hợp đồng; cập nhật hồ sơ và chuyển AI kiểm tra lại trước khi trình duyệt.",
   "lane": "Phòng hợp đồng"
  },
  "8": {
   "name": "Phê duyệt và ký soạn thảo hợp đồng",
   "actor": "Trưởng phòng hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Xem xét hồ sơ và kết quả AI. Đồng ý: ký soạn thảo rồi chuyển lấy chữ ký nháy, tập hợp hồ sơ trình ký. Không đồng ý: trả nhân viên Phòng hợp đồng chỉnh sửa theo ý kiến; AI kiểm tra lại trước khi trình duyệt lại.",
   "lane": ""
  },
  "9": {
   "name": "Tập hợp hồ sơ, chữ ký nháy và trình ký",
   "actor": "Phòng hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Sau khi Trưởng phòng hợp đồng ký soạn thảo, lấy chữ ký nháy của Trung tâm mua sắm và Đơn vị sử dụng; tập hợp hồ sơ, trình Tổng giám đốc VHT (Thủ trưởng VHT) ký hợp đồng.",
   "lane": "Phòng hợp đồng"
  },
  "10": {
   "name": "Xem xét, phê duyệt và ký hợp đồng",
   "actor": "Tổng giám đốc VHT (Thủ trưởng VHT)",
   "type": "user",
   "form": "Không có",
   "note": "Xem xét, phê duyệt và ký khi đồng ý; khi cần yêu cầu pháp chế, tài chính, đầu tư thẩm định. Không đồng ý: trả Phòng hợp đồng sửa và trình lại theo QT.",
   "lane": "Thủ trưởng VHT"
  },
  "11": {
   "name": "Nhận hợp đồng đã được ký",
   "actor": "Phòng hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Hợp đồng sau khi được ký duyệt sẽ chuyển về cho Phòng hợp đồng.",
   "lane": "Phòng hợp đồng"
  },
  "12": {
   "name": "Gửi hợp đồng đã được ký cho nhà thầu/nhà cung cấp ký",
   "actor": "Phòng hợp đồng",
   "type": "user",
   "form": "Không có",
   "note": "Gửi hợp đồng đã được Thủ trưởng VHT ký: chọn ký qua VContract hoặc gửi bản giấy để ký cứng; theo dõi nhà thầu/nhà cung cấp hoàn tất ký.",
   "lane": "Phòng hợp đồng"
  },
  "13": {
   "name": "Ký và gửi lại hợp đồng",
   "actor": "Nhà thầu / Nhà cung cấp",
   "type": "user",
   "form": "Không có",
   "note": "Theo hình thức đã chọn: ký trên VContract hoặc ký, đóng dấu và gửi lại bản giấy; hai bên có hợp đồng ký đầy đủ.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "and",
   "name": ""
  },
  "G2": {
   "kind": "and",
   "name": ""
  },
  "G3": {
   "kind": "xor",
   "name": "kết quả kiểm tra AI?"
  },
  "G4": {
   "kind": "xor",
   "name": "Có cần thống nhất lại với nhà thầu/nhà cung cấp?"
  },
  "G5": {
   "kind": "xor",
   "name": "Trưởng phòng HĐ phê duyệt?"
  },
  "G6": {
   "kind": "xor",
   "name": "Thủ trưởng VHT phê duyệt?"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Bắt đầu"
  },
  "E1": {
   "kind": "end",
   "name": "Hợp đồng đã ký → MS23"
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
   "G2",
   ""
  ],
  [
   "3",
   "G2",
   ""
  ],
  [
   "4",
   "5",
   ""
  ],
  [
   "5",
   "G3",
   ""
  ],
  [
   "6",
   "5",
   ""
  ],
  [
   "7",
   "5",
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
   "13",
   ""
  ],
  [
   "13",
   "E1",
   ""
  ],
  [
   "G1",
   "2",
   ""
  ],
  [
   "G1",
   "3",
   ""
  ],
  [
   "G2",
   "4",
   ""
  ],
  [
   "G3",
   "G4",
   "Not OK"
  ],
  [
   "G3",
   "8",
   "OK"
  ],
  [
   "G4",
   "6",
   "Có"
  ],
  [
   "G4",
   "7",
   "Không"
  ],
  [
   "G5",
   "9",
   "Có"
  ],
  [
   "G5",
   "G4",
   "Không: trả chỉnh sửa theo ý kiến"
  ],
  [
   "G6",
   "9",
   "Không: sửa và trình lại / theo chỉ đạo"
  ],
  [
   "G6",
   "11",
   "Có"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
