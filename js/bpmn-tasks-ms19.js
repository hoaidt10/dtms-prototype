/* SINH TỰ ĐỘNG từ project-knowledge/02. VHT gửi/Thầu 161126/ĐTMS.drawio, trang "MS19".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS19"] = {
 "page": "MS19",
 "count": 24,
 "tasks": {
  "1": {
   "name": "Khởi tạo tổ chức LCNT",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Mỗi gói được tạo một tiến trình theo dõi riêng",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "2": {
   "name": "Xác định hình thức/phương thức",
   "actor": "Hệ thống ĐTMS / Camunda",
   "type": "service",
   "form": "Không có",
   "note": "Đọc cấu hình đã được duyệt trong KHLCNT",
   "lane": "Hệ thống ĐTMS / Camunda"
  },
  "3": {
   "name": "Đấu thầu rộng rãi - 1 giai đoạn 1 túi",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập/thẩm định/phê duyệt HSMT • Phát hành HSMT; nhận & mở HSDT • Đánh giá HSDT; làm rõ khi cần • Thương thảo hợp đồng • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "4": {
   "name": "Đấu thầu rộng rãi - 1 giai đoạn 2 túi",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập/thẩm định/phê duyệt HSMT • Phát hành; nhận HSDT • Mở & đánh giá HSĐXKT • Phê duyệt DS đạt kỹ thuật • Mở & đánh giá HSĐXTC; thương thảo • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "5": {
   "name": "Đấu thầu hạn chế",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập/phê duyệt & công khai danh sách ngắn • Lập/thẩm định/phê duyệt HSMT • Phát hành cho danh sách ngắn • Nhận/mở/đánh giá HSDT • Thương thảo; chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "6": {
   "name": "Chào giá trực tuyến",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập/thẩm định/phê duyệt HSMCG • Đăng chào giá trên Cổng đấu thầu • Theo dõi nhà thầu chào giá • Nhận/xác nhận kết quả chào giá • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "7": {
   "name": "Chỉ định thầu",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập/phê duyệt HSYC • Gửi HSYC cho nhà thầu dự kiến • Nhận & đánh giá HSĐX • Thương thảo/hoàn thiện hợp đồng • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "8": {
   "name": "Đàm phán trực tiếp",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập & phê duyệt phương án đàm phán • Gửi thư mời hãng/nhà thầu • Tổ chức các phiên đàm phán • Lập Báo cáo kết quả đàm phán • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "9": {
   "name": "Đặt hàng",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập/thẩm định/phê duyệt HSYC • Gửi HSYC; nhận HSĐX • Mở & đánh giá HSĐX • Thương thảo/hoàn thiện hợp đồng • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "10": {
   "name": "Giao nhiệm vụ",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Áp dụng logic tương tự Đặt hàng • Giao đơn vị thành viên thực hiện • Nhận/đánh giá hồ sơ theo yêu cầu • Hoàn thiện điều kiện thực hiện • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "11": {
   "name": "Tự thực hiện",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Lập phương án tự thực hiện • Lập dự thảo thỏa thuận giao việc • Hoàn thiện phương án với đơn vị thực hiện • Chuyển hồ sơ KQLCNT / thỏa thuận ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "12": {
   "name": "Trường hợp đặc biệt",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "sub",
   "form": "Không có",
   "note": "Subprocess theo hình thức LCNT • Thực hiện đúng cách thức/trình tự đã duyệt trong KHLCNT • Không hard-code một luồng chung • Theo dõi milestone theo cấu hình được duyệt • Chuyển hồ sơ KQLCNT ＋",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "13": {
   "name": "Hoàn thiện hồ sơ KQLCNT",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Tổng hợp kết quả từ subprocess của hình thức LCNT",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "14": {
   "name": "Thẩm định KQLCNT",
   "actor": "Tổ thẩm định",
   "type": "user",
   "form": "Không có",
   "note": "Kiểm tra căn cứ, kết quả đánh giá/thương thảo và hồ sơ trình",
   "lane": "Tổ thẩm định"
  },
  "15": {
   "name": "Chỉnh sửa hồ sơ KQLCNT",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Sửa theo yêu cầu và trình lại",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "16": {
   "name": "Hoàn thiện văn bản phê duyệt KQLCNT",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Chuẩn bị hồ sơ trình người có thẩm quyền",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "17": {
   "name": "Trình ký VOffice",
   "actor": "Cổng đấu thầu / VOffice",
   "type": "service",
   "form": "Không có",
   "note": "Gửi hồ sơ sang VOffice",
   "lane": "Cổng đấu thầu / VOffice"
  },
  "18": {
   "name": "Upload bằng chứng ký cứng",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Upload file đã ký; xác nhận phương thức ký",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "19": {
   "name": "Nhận kết quả ký",
   "actor": "Hệ thống ĐTMS / Camunda",
   "type": "service",
   "form": "Không có",
   "note": "Nhận callback / xác nhận bằng chứng ký",
   "lane": "Hệ thống ĐTMS / Camunda"
  },
  "20": {
   "name": "Retry trình ký",
   "actor": "Cổng đấu thầu / VOffice",
   "type": "service",
   "form": "Không có",
   "note": "Chỉ áp dụng lỗi kỹ thuật",
   "lane": "Cổng đấu thầu / VOffice"
  },
  "21": {
   "name": "Chỉnh sửa theo ý kiến từ chối",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Trả người xử lý chỉnh sửa nội dung",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "22": {
   "name": "Xác nhận công khai KQLCNT",
   "actor": "TTMS / Tổ chuyên gia",
   "type": "user",
   "form": "Không có",
   "note": "Kiểm tra dữ liệu công khai",
   "lane": "TTMS / Tổ chuyên gia"
  },
  "23": {
   "name": "Đăng tải KQLCNT",
   "actor": "Cổng đấu thầu / VOffice",
   "type": "service",
   "form": "Không có",
   "note": "Tích hợp Cổng đấu thầu",
   "lane": "Cổng đấu thầu / VOffice"
  },
  "24": {
   "name": "Chuyển sang hoàn thiện/ký hợp đồng",
   "actor": "Hệ thống ĐTMS / Camunda",
   "type": "service",
   "form": "Không có",
   "note": "Đóng quy trình tổ chức LCNT; mở nghiệp vụ Hợp đồng",
   "lane": "Hệ thống ĐTMS / Camunda"
  }
 },
 "gateways": {
  "G1": {
   "kind": "xor",
   "name": "Hình thức LCNT?"
  },
  "G2": {
   "kind": "xor",
   "name": "Tiếp tục KQLCNT"
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
  }
 },
 "events": {
  "S": {
   "kind": "start",
   "name": "KHLCNT đã duyệt"
  },
  "E1": {
   "kind": "end",
   "name": "Hoàn tất LCNT"
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
   "G2",
   ""
  ],
  [
   "4",
   "G2",
   ""
  ],
  [
   "5",
   "G2",
   ""
  ],
  [
   "6",
   "G2",
   ""
  ],
  [
   "7",
   "G2",
   ""
  ],
  [
   "8",
   "G2",
   ""
  ],
  [
   "9",
   "G2",
   ""
  ],
  [
   "10",
   "G2",
   ""
  ],
  [
   "11",
   "G2",
   ""
  ],
  [
   "12",
   "G2",
   ""
  ],
  [
   "13",
   "14",
   ""
  ],
  [
   "14",
   "G3",
   ""
  ],
  [
   "15",
   "13",
   "Trình lại"
  ],
  [
   "16",
   "G4",
   ""
  ],
  [
   "17",
   "19",
   ""
  ],
  [
   "18",
   "19",
   ""
  ],
  [
   "19",
   "G5",
   ""
  ],
  [
   "20",
   "17",
   "Retry"
  ],
  [
   "21",
   "16",
   "Sửa lại"
  ],
  [
   "22",
   "23",
   ""
  ],
  [
   "23",
   "24",
   ""
  ],
  [
   "24",
   "E1",
   ""
  ],
  [
   "G1",
   "3",
   "Đấu thầu rộng rãi"
  ],
  [
   "G1",
   "4",
   "Đấu thầu rộng rãi"
  ],
  [
   "G1",
   "5",
   "Đấu thầu hạn chế"
  ],
  [
   "G1",
   "6",
   "Chào giá trực tuyến"
  ],
  [
   "G1",
   "7",
   "Chỉ định thầu"
  ],
  [
   "G1",
   "8",
   "Đàm phán trực tiếp"
  ],
  [
   "G1",
   "9",
   "Đặt hàng"
  ],
  [
   "G1",
   "10",
   "Giao nhiệm vụ"
  ],
  [
   "G1",
   "11",
   "Tự thực hiện"
  ],
  [
   "G1",
   "12",
   "Trường hợp đặc biệt"
  ],
  [
   "G2",
   "13",
   ""
  ],
  [
   "G3",
   "16",
   "Đạt"
  ],
  [
   "G3",
   "15",
   "Không đạt"
  ],
  [
   "G4",
   "17",
   "VOffice"
  ],
  [
   "G4",
   "18",
   "Ký cứng"
  ],
  [
   "G5",
   "22",
   "Thành công"
  ],
  [
   "G5",
   "20",
   "Lỗi kỹ thuật"
  ],
  [
   "G5",
   "21",
   "Từ chối"
  ],
  [
   "S",
   "1",
   ""
  ]
 ]
};
