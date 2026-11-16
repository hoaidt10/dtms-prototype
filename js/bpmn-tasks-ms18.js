/* SINH TỰ ĐỘNG từ project-knowledge/02. VHT gửi/Thầu 161126/ĐTMS.drawio, trang "MS18".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS18"] = {
 "page": "MS18",
 "count": 23,
 "tasks": {
  "1": {
   "name": "Tạo hồ sơ KHLCNT",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Tên KHLCNT, quy chế, cấp phê duyệt, người phụ trách/người soạn",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "2": {
   "name": "Chọn hồ sơ nguồn",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Có thể gom nhiều ĐXMS/KĐT/Dự án đã phê duyệt",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "3": {
   "name": "Tạo gói & phân bổ hạng mục",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Chọn hạng mục nguồn; kiểm soát số lượng/giá trị phân bổ",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "4": {
   "name": "Hoàn thiện thông tin gói",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Giá, nguồn vốn, hình thức/phương thức, loại HĐ, thời gian...",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "5": {
   "name": "Lập Tờ trình KHLCNT",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "BM01 theo cấp phê duyệt; hệ thống tự điền số liệu, người dùng bổ sung giải trình",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "6": {
   "name": "Chọn Tổ thẩm định",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Thành viên, vai trò, phân công công việc",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "7": {
   "name": "Tạo My Task cam kết",
   "actor": "Hệ thống ĐTMS / Camunda",
   "type": "service",
   "form": "Không có",
   "note": "Tạo nhiệm vụ cho từng thành viên",
   "lane": "Hệ thống ĐTMS / Camunda"
  },
  "8": {
   "name": "Xác nhận cam kết",
   "actor": "Thành viên Tổ thẩm định",
   "type": "user",
   "form": "Không có",
   "note": "Từng thành viên tự xác nhận trên My Task",
   "lane": "Thành viên Tổ thẩm định"
  },
  "9": {
   "name": "Chỉnh sửa KHLCNT/Tờ trình",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Sửa đúng nội dung được yêu cầu và gửi lại",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "10": {
   "name": "Kiểm tra KHLCNT",
   "actor": "TTMS / Tổ thẩm định",
   "type": "user",
   "form": "Không có",
   "note": "BM02 VHT - checklist Đáp ứng/Không đáp ứng + nhận xét",
   "lane": "TTMS / Tổ thẩm định"
  },
  "11": {
   "name": "Hoàn thiện dự thảo Quyết định",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "BM03 VHT",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "12": {
   "name": "Thẩm định KHLCNT",
   "actor": "TTMS / Tổ thẩm định",
   "type": "user",
   "form": "Không có",
   "note": "BM02 Tập đoàn - thẩm định nội dung KHLCNT",
   "lane": "TTMS / Tổ thẩm định"
  },
  "13": {
   "name": "Ghi nhận ý kiến Ban ĐTXD",
   "actor": "Ban ĐTXD Tập đoàn",
   "type": "user",
   "form": "Không có",
   "note": "Phiếu nhận xét/ý kiến cần VHT xử lý",
   "lane": "Ban ĐTXD Tập đoàn"
  },
  "14": {
   "name": "Giải trình & lập Phiếu trình GQCV",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Phản hồi từng ý kiến; sinh Phiếu trình nhiều/01 gói",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "15": {
   "name": "Hoàn thiện dự thảo Quyết định",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "BM03 Tập đoàn",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "16": {
   "name": "Trình ký VOffice",
   "actor": "VOffice / Cổng đấu thầu",
   "type": "service",
   "form": "Không có",
   "note": "Gửi hồ sơ sang VOffice",
   "lane": "VOffice / Cổng đấu thầu"
  },
  "17": {
   "name": "Nhận kết quả ký",
   "actor": "Hệ thống ĐTMS / Camunda",
   "type": "service",
   "form": "Không có",
   "note": "Nhận callback trạng thái ký",
   "lane": "Hệ thống ĐTMS / Camunda"
  },
  "18": {
   "name": "Retry trình ký",
   "actor": "VOffice / Cổng đấu thầu",
   "type": "service",
   "form": "Không có",
   "note": "Lỗi kỹ thuật - giữ nguyên bước nghiệp vụ",
   "lane": "VOffice / Cổng đấu thầu"
  },
  "19": {
   "name": "Chỉnh sửa theo ý kiến từ chối",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Trả đúng người xử lý để sửa hồ sơ",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "20": {
   "name": "Upload bằng chứng ký cứng",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Upload file đã ký và xác nhận kết quả",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "21": {
   "name": "Xác nhận công khai KHLCNT",
   "actor": "Phòng Đầu tư - TTMS",
   "type": "user",
   "form": "Không có",
   "note": "Kiểm tra dữ liệu trước khi đăng tải",
   "lane": "Phòng Đầu tư - TTMS"
  },
  "22": {
   "name": "Đăng tải KHLCNT",
   "actor": "VOffice / Cổng đấu thầu",
   "type": "service",
   "form": "Không có",
   "note": "Tích hợp Cổng đấu thầu; lỗi kỹ thuật cho phép retry",
   "lane": "VOffice / Cổng đấu thầu"
  },
  "23": {
   "name": "Mở gói cho tổ chức LCNT",
   "actor": "Hệ thống ĐTMS / Camunda",
   "type": "service",
   "form": "Không có",
   "note": "Cập nhật trạng thái KHLCNT hoàn thành, kích hoạt từng gói",
   "lane": "Hệ thống ĐTMS / Camunda"
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Cấp phê duyệt?"
  },
  "G2": {
   "kind": "xor",
   "name": "Đáp ứng?"
  },
  "G3": {
   "kind": "xor",
   "name": "Đạt thẩm định?"
  },
  "G4": {
   "kind": "xor",
   "name": "Phương thức ký?"
  },
  "G5": {
   "kind": "xor",
   "name": "Kết quả ký?"
  },
  "G6": {
   "kind": "xor",
   "name": "Có kết quả ký hợp lệ?"
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "Bắt đầu"
  },
  "E1": {
   "kind": "end",
   "name": "Hoàn thành KHLCNT"
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
   "G1",
   ""
  ],
  [
   "9",
   "5",
   "Gửi lại"
  ],
  [
   "10",
   "G2",
   ""
  ],
  [
   "11",
   "G4",
   ""
  ],
  [
   "12",
   "G3",
   ""
  ],
  [
   "13",
   "14",
   ""
  ],
  [
   "14",
   "15",
   ""
  ],
  [
   "15",
   "G4",
   ""
  ],
  [
   "16",
   "17",
   ""
  ],
  [
   "17",
   "G5",
   ""
  ],
  [
   "18",
   "16",
   "Retry"
  ],
  [
   "19",
   "9",
   "Trả sửa"
  ],
  [
   "20",
   "G6",
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
   "E1",
   ""
  ],
  [
   "G1",
   "10",
   "VHT"
  ],
  [
   "G1",
   "12",
   "Tập đoàn"
  ],
  [
   "G2",
   "11",
   "Đạt"
  ],
  [
   "G2",
   "9",
   "Không đạt"
  ],
  [
   "G3",
   "13",
   "Đạt"
  ],
  [
   "G3",
   "9",
   "Không đạt"
  ],
  [
   "G4",
   "16",
   "VOffice"
  ],
  [
   "G4",
   "20",
   "Ký cứng"
  ],
  [
   "G5",
   "G6",
   "Thành công"
  ],
  [
   "G5",
   "18",
   "Lỗi kỹ thuật"
  ],
  [
   "G5",
   "19",
   "Từ chối"
  ],
  [
   "G6",
   "21",
   "Có"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
