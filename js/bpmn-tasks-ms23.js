/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio, trang "MS23 - Tổng quan".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})["MS23"] = {
 "page": "MS23 - Tổng quan",
 "count": 5,
 "tasks": {
  "1": {
   "name": "AI đọc hợp đồng, trích xuất mốc theo dõi",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Đọc hợp đồng đã ký được tải lên hệ thống; trích xuất thông tin và các mốc dự kiến để theo dõi; lưu vào hồ sơ theo dõi hợp đồng. Trường dữ liệu và việc kiểm tra kết quả AI còn cần xác nhận [? Q2].",
   "lane": ""
  },
  "2": {
   "name": "Tự động đôn đốc giao hàng",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Dựa trên mốc giao hàng trong hợp đồng, tự động gửi nhắc/đôn đốc giao hàng khi đến mốc theo dõi. Thời điểm, tần suất, người nhận và kênh gửi chưa chốt [? Q2].",
   "lane": ""
  },
  "3": {
   "name": "Ghi nhận thông báo giao hàng",
   "actor": "Phòng Hợp đồng / ĐVMS",
   "type": "user",
   "form": "Không có",
   "note": "Tiếp nhận thông báo giao hàng từ đối tác và ghi nhận trên ĐTMS để chuyển thông tin cho các bộ phận liên quan. Kênh tiếp nhận/tích hợp còn cần xác nhận [? Q3].",
   "lane": ""
  },
  "4": {
   "name": "Thông báo các bộ phận liên quan",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Từ thông báo giao hàng đã ghi nhận, gửi thông tin đến các bộ phận liên quan và chuyển hồ sơ giao hàng sang MS23.02 – Bàn giao hàng hóa / dịch vụ. Danh sách bộ phận và kênh thông báo chưa chốt [? Q3].",
   "lane": ""
  },
  "5": {
   "name": "AI đọc biên bản, cập nhật ngày thực tế",
   "actor": "Hệ thống ĐTMS / AI",
   "type": "service",
   "form": "Không có",
   "note": "Khi luồng con có biên bản đã ký đầy đủ, đọc thông tin và cập nhật ngày thực tế tương ứng có trong biên bản; trả trạng thái/ngày thực tế về hồ sơ theo dõi hợp đồng. Thông tin trả về và cơ chế kiểm tra AI chưa chốt [? Q5].",
   "lane": ""
  }
 },
 "gateways": {},
 "events": {
  "S": {
   "kind": "start",
   "name": "Hợp đồng đã ký được tải lên hệ thống"
  },
  "S2": {
   "kind": "start",
   "name": "◷"
  },
  "E1": {
   "kind": "end",
   "name": "Đã gửi nhắc"
  },
  "S3": {
   "kind": "start",
   "name": "✉"
  },
  "S4": {
   "kind": "start",
   "name": "◷"
  },
  "S5": {
   "kind": "start",
   "name": "✉"
  },
  "E2": {
   "kind": "end",
   "name": "Đã cập nhật trạng thái / ngày thực tế"
  }
 },
 "edges": [
  [
   "2",
   "E1",
   ""
  ],
  [
   "3",
   "4",
   ""
  ],
  [
   "5",
   "E2",
   ""
  ],
  [
   "S",
   "1",
   ""
  ],
  [
   "S2",
   "2",
   ""
  ],
  [
   "S3",
   "3",
   ""
  ],
  [
   "S5",
   "5",
   ""
  ]
 ]
};
