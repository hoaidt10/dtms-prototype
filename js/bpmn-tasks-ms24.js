/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS24".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS24"] = {
 "page": "MS24",
 "count": 20,
 "tasks": {
  "1": {
   "name": "Tập hợp và gửi hồ sơ thanh toán",
   "actor": "Chuyên quản / Đơn vị mua sắm (ĐVMS) [Q1]",
   "type": "user",
   "form": "Không có",
   "note": "Tập hợp hồ sơ thanh toán theo điều khoản hợp đồng và gửi nhân sự chuyên thanh toán thuộc Phòng hợp đồng. Nguồn giao việc lập YCCT cho ĐVMS; chưa nêu chuyên quản thuộc Trung tâm mua sắm.",
   "lane": ""
  },
  "2": {
   "name": "Tiếp nhận và tổng hợp hồ sơ thanh toán",
   "actor": "Phòng hợp đồng – Nhân sự chuyên thanh toán",
   "type": "user",
   "form": "Không có",
   "note": "Nhân sự chuyên thanh toán tiếp nhận, tổng hợp hồ sơ do chuyên quản gửi và kiểm tra hồ sơ đã đủ căn cứ thanh toán theo hợp đồng hay chưa.",
   "lane": ""
  },
  "3": {
   "name": "Bổ sung hồ sơ thanh toán",
   "actor": "Chuyên quản / Đơn vị mua sắm (ĐVMS) [Q1]",
   "type": "user",
   "form": "Không có",
   "note": "Khi hồ sơ chưa đủ căn cứ, chuyên quản/ĐVMS bổ sung thông tin, tài liệu theo yêu cầu và gửi lại nhân sự chuyên thanh toán để tiếp nhận, tổng hợp, kiểm tra lại.",
   "lane": ""
  },
  "4": {
   "name": "Xuất đề nghị chuyển tiền theo template",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Hệ thống sinh đề nghị chuyển tiền từ hồ sơ đã tổng hợp theo template. Khi trình lại, sử dụng thông tin đã chỉnh sửa. Bước này không dùng AI gợi ý.",
   "lane": ""
  },
  "5": {
   "name": "Cung cấp hóa đơn thanh toán",
   "actor": "Phòng hợp đồng – Nhân sự chuyên thanh toán",
   "type": "user",
   "form": "Không có",
   "note": "Phòng hợp đồng cung cấp thông tin/hóa đơn liên quan đến đợt để AI lập bảng tổng hợp thanh toán.",
   "lane": ""
  },
  "6": {
   "name": "AI lập bảng tổng hợp thanh toán",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "AI lập bảng tổng hợp từ hóa đơn và dữ liệu thanh toán. Chuyển Phòng tài chính kiểm tra và ký.",
   "lane": ""
  },
  "7": {
   "name": "Kiểm tra và ký bảng tổng hợp",
   "actor": "Phòng tài chính [Q3: người ký chưa rõ]",
   "type": "user",
   "form": "Không có",
   "note": "Phòng tài chính kiểm tra và ký. Chức danh ký chưa chốt; có thể là Trưởng phòng tài chính.",
   "lane": ""
  },
  "8": {
   "name": "Kiểm tra và ký bảng tổng hợp",
   "actor": "Thủ trưởng VHT",
   "type": "user",
   "form": "Không có",
   "note": "Thủ trưởng VHT kiểm tra, ký bảng tổng hợp sau Phòng tài chính.",
   "lane": ""
  },
  "9": {
   "name": "Kiểm tra và ký xác nhận bảng tổng hợp",
   "actor": "Văn thư",
   "type": "user",
   "form": "Không có",
   "note": "Văn thư kiểm tra font chữ, biểu mẫu, loại văn bản, định dạng và văn phong; ký xác nhận.",
   "lane": ""
  },
  "10": {
   "name": "Kiểm tra và ký bảng tổng hợp",
   "actor": "Tổng giám đốc Tập đoàn",
   "type": "user",
   "form": "Không có",
   "note": "Tổng giám đốc Tập đoàn kiểm tra và ký sau Văn thư.",
   "lane": ""
  },
  "11": {
   "name": "Chỉnh sửa bảng tổng hợp thanh toán",
   "actor": "Phòng hợp đồng – Nhân sự chuyên thanh toán",
   "type": "user",
   "form": "Không có",
   "note": "Nếu một cấp không đồng ý ở giai đoạn bảng tổng hợp: sửa bảng và dữ liệu liên quan theo ý kiến; trình lại từ Phòng tài chính. Không chuyển sang vòng sửa đề nghị chuyển tiền.",
   "lane": ""
  },
  "12": {
   "name": "Hoàn thiện hồ sơ đề nghị chuyển tiền",
   "actor": "Phòng hợp đồng – Nhân sự chuyên thanh toán",
   "type": "user",
   "form": "Không có",
   "note": "Hoàn thiện đề nghị theo template và bộ hồ sơ. Nếu cần bảng tổng hợp, kèm bảng đã ký đủ. Chọn ký tích hợp VOffice/VContract hoặc hình thức khác được phép.",
   "lane": ""
  },
  "13": {
   "name": "Kiểm tra và ký duyệt đề nghị chuyển tiền",
   "actor": "Phòng tài chính [Q3: người ký chưa rõ]",
   "type": "user",
   "form": "Không có",
   "note": "Phòng tài chính kiểm tra và ký duyệt đề nghị trước Thủ trưởng VHT. Không đồng ý: trả về chỉnh sửa đề nghị rồi trình lại từ Phòng tài chính. Chức danh ký chưa chốt.",
   "lane": ""
  },
  "14": {
   "name": "Kiểm tra và ký đề nghị chuyển tiền",
   "actor": "Thủ trưởng VHT",
   "type": "user",
   "form": "Không có",
   "note": "Thủ trưởng VHT kiểm tra và ký sau Phòng tài chính. Không đồng ý: trả về sửa đề nghị, trình lại từ Phòng tài chính trong tuyến đề nghị chuyển tiền.",
   "lane": ""
  },
  "15": {
   "name": "Kiểm tra và ký xác nhận đề nghị chuyển tiền",
   "actor": "Văn thư",
   "type": "user",
   "form": "Không có",
   "note": "Văn thư kiểm tra font chữ, biểu mẫu, loại văn bản, định dạng và văn phong; ký xác nhận. Không đồng ý: trả về sửa đề nghị, trình lại từ Phòng tài chính.",
   "lane": ""
  },
  "16": {
   "name": "Kiểm tra và ký đề nghị chuyển tiền",
   "actor": "Tổng giám đốc Tập đoàn",
   "type": "user",
   "form": "Không có",
   "note": "Tổng giám đốc Tập đoàn kiểm tra và ký sau Văn thư. Không đồng ý: trả về sửa đề nghị rồi trình lại từ Phòng tài chính trong tuyến đề nghị chuyển tiền.",
   "lane": ""
  },
  "17": {
   "name": "Chỉnh sửa đề nghị chuyển tiền",
   "actor": "Phòng hợp đồng – Nhân sự chuyên thanh toán",
   "type": "user",
   "form": "Không có",
   "note": "Một cấp không đồng ý trong tuyến đề nghị: chỉnh sửa đề nghị và hồ sơ theo ý kiến, hoàn thiện và trình lại từ Phòng tài chính. Không quay về vòng sửa/ký bảng tổng hợp.",
   "lane": ""
  },
  "18": {
   "name": "Thanh toán tiền",
   "actor": "Phòng Tài chính kế toán",
   "type": "user",
   "form": "Không có",
   "note": "Sau khi đề nghị chuyển tiền được duyệt đủ, Phòng Tài chính kế toán thực hiện thanh toán tiền cho nhà thầu/nhà cung cấp theo hợp đồng. Bao gồm chuyển tiền hoặc thủ tục tiền mặt theo phương thức đã thỏa thuận.",
   "lane": ""
  },
  "19": {
   "name": "Cập nhật trạng thái và tải minh chứng",
   "actor": "Phòng Tài chính kế toán",
   "type": "user",
   "form": "Không có",
   "note": "Sau khi chuyển tiền/chi tiền mặt, Phòng Tài chính kế toán cập nhật trạng thái và tải thông tin/minh chứng thanh toán lên ĐTMS. Tên trạng thái chưa chốt.",
   "lane": ""
  },
  "20": {
   "name": "AI ghi nhận và đồng bộ trạng thái thanh toán lên SAP",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "AI ghi nhận trạng thái thanh toán và thông tin liên quan từ dữ liệu Phòng Tài chính kế toán đã cập nhật; đồng bộ các thông tin này lên SAP.",
   "lane": ""
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Hồ sơ đủ căn cứ?"
  },
  "G2": {
   "kind": "xor",
   "name": "Hợp đồng yêu cầu bảng tổng hợp? [Q2]"
  },
  "G3": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G4": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G5": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G6": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G7": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G8": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G9": {
   "kind": "xor",
   "name": "Đồng ý?"
  },
  "G10": {
   "kind": "xor",
   "name": "Đồng ý?"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Phát sinh đợt thanh toán theo hợp đồng"
  },
  "E1": {
   "kind": "end",
   "name": "Hoàn tất lần thanh toán theo hợp đồng Đã ghi nhận trạng thái và đồng bộ thông tin thanh toán lên SAP"
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
   "G1",
   ""
  ],
  [
   "3",
   "2",
   "Gửi lại kiểm tra"
  ],
  [
   "4",
   "G2",
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
   "G3",
   ""
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
   "7",
   "Trình ký lại từ Phòng tài chính"
  ],
  [
   "12",
   "13",
   ""
  ],
  [
   "13",
   "G7",
   ""
  ],
  [
   "14",
   "G8",
   ""
  ],
  [
   "15",
   "G9",
   ""
  ],
  [
   "16",
   "G10",
   ""
  ],
  [
   "17",
   "12",
   "Hoàn thiện lại đề nghị"
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
   "E1",
   ""
  ],
  [
   "G1",
   "4",
   "Có"
  ],
  [
   "G1",
   "3",
   "Không – bổ sung hồ sơ"
  ],
  [
   "G2",
   "5",
   "Có"
  ],
  [
   "G2",
   "12",
   "Không"
  ],
  [
   "G3",
   "8",
   "Đồng ý"
  ],
  [
   "G3",
   "11",
   "Không đồng ý – sửa bảng tổng hợp"
  ],
  [
   "G4",
   "9",
   "Đồng ý"
  ],
  [
   "G4",
   "11",
   "Không đồng ý – sửa bảng tổng hợp"
  ],
  [
   "G5",
   "10",
   "Đồng ý"
  ],
  [
   "G5",
   "11",
   "Không đồng ý – sửa bảng tổng hợp"
  ],
  [
   "G6",
   "12",
   "Đồng ý"
  ],
  [
   "G6",
   "11",
   "Không đồng ý – sửa bảng tổng hợp"
  ],
  [
   "G7",
   "14",
   "Đồng ý"
  ],
  [
   "G7",
   "17",
   "Không đồng ý – sửa đề nghị"
  ],
  [
   "G8",
   "15",
   "Đồng ý"
  ],
  [
   "G8",
   "17",
   "Không đồng ý – sửa đề nghị"
  ],
  [
   "G9",
   "16",
   "Đồng ý"
  ],
  [
   "G9",
   "17",
   "Không đồng ý – sửa đề nghị"
  ],
  [
   "G10",
   "18",
   "Đồng ý"
  ],
  [
   "G10",
   "17",
   "Không đồng ý – sửa đề nghị"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
