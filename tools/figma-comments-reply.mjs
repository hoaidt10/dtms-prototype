// Trả lời từng luồng comment Figma bằng nội dung đã xử lý (T16 B0.5 / B3 / B4).
// REST API Figma không có lệnh resolve (resolved_at chỉ đọc), nên sau khi trả lời phải bấm Resolve trên Figma.
// Cần personal access token có scope `file_comments:read` + `file_comments:write`, đặt ở biến môi trường FIGMA_TOKEN
// (không ghi token vào file/repo).
//   FIGMA_TOKEN=... node tools/figma-comments-reply.mjs          → in thử (không gửi)
//   FIGMA_TOKEN=... node tools/figma-comments-reply.mjs --send   → gửi trả lời
// Bỏ qua luồng đã resolve hoặc đã có trả lời bắt đầu bằng TAG.
const KEY = 'FBFwYisdvDOjvJyRWIQbT3';
const TAG = '[Prototype 09/10]';
const SEND = process.argv.includes('--send');
const TOKEN = process.env.FIGMA_TOKEN;

// #order_id → trả lời. Màn tham chiếu là tên frame trong bản xuất 09/10/2026.
const REPLIES = {
  1: 'Đã sửa: Thêm mới ĐXMS có trường bắt buộc "Nhiệm vụ / Đề tài, dự án", hiện cả ở Chi tiết ĐXMS. Xem SCR-28 (page 01). Nguồn danh sách nhiệm vụ còn chờ xác nhận (P-69).',
  2: 'Chưa sửa: chưa rõ "Ký tồn kho VO" là ký phiếu nào, ai ký, ở bước nào. Nhờ anh giải thích thêm (P-71).',
  3: 'Đã sửa: Tạo YCBG có bảng "Nhà cung cấp mới (chưa có trong danh mục)" — Tên, MST, Email, Ngành hàng; khi Xác nhận, NCC được thêm vào danh mục rồi nhận YCBG. Xem SCR-07-a. Còn chờ: NCC mới có cần Quản trị duyệt không (P-72).',
  4: 'Đã sửa: Tạo YCBG có bảng Đối soát ĐXMS với MBOM + dự toán (nhiệm vụ / dự án) hoặc KHN (mua sắm thường xuyên), kết quả Khớp / Lệch theo hạng mục. Xem SCR-07-a. Còn chờ: hệ thống / API nguồn MBOM, dự toán, KHN (P-73).',
  5: 'Đã sửa: danh sách tài liệu có dòng "Báo giá — <tên NCC>" kèm nút Tải lên cho từng NCC; bắt buộc khi chọn "Báo giá đạt". Xem SCR-07-b / SCR-07-c.',
  6: 'Đã sửa: Chỉ huy duyệt dự thảo theo từng phần (Đạt / Không đạt). Xem SCR-09.',
  7: 'Đã sửa: mỗi phần Không đạt bắt buộc nhập "Lý do và chỉ đạo"; lý do trả lại gom từ các phần này. Xem SCR-09.',
  8: 'Đã sửa: chỉ bấm Đồng ý được khi mọi phần Đạt (hệ thống kiểm khi gửi). Xem SCR-09.',
  9: 'Đã sửa: bảng "Lịch sử chỉnh sửa theo phần" (phiên bản, phần, người sửa, thời điểm, nội dung) + dòng tóm tắt của AI. Xem SCR-09; so sánh đầy đủ trước/sau ở tab Lịch sử phiên bản.',
  10: 'Đã sửa: khi hồ sơ bị trả lại, người soạn phản hồi từng chỉ đạo (Đã sửa / Không sửa); chọn Không sửa thì Giải trình bắt buộc, chỉ huy thấy cột Giải trình ở lần duyệt sau. Xem SCR-08-a / SCR-08-b.',
  11: 'Đã sửa: ký cứng bắt buộc lý do; hình thức ký và lý do lưu vào Lịch sử hồ sơ, thống kê số lần ký cứng ở Báo cáo tiến độ. Xem SCR-21 (page 01) và SCR-93 (page 11).',
  12: 'Đã sửa: khi Mật = Có, hiện khối "AI kiểm tra quy tắc bảo mật" (chỉ cảnh báo, không chặn Lưu). Xem SCR-28-mat. Bộ quy tắc bảo mật còn chờ VHT cung cấp (P-70).',
  13: 'Đã sửa: khối AI đồng bộ ý kiến 2 CQCM + hướng dẫn sửa đặt ở bước Tổng hợp ý kiến (T26) của ĐVĐX, không đặt ở T20 vì 2 CQCM không được thấy ý kiến của nhau (#14). Xem SCR-12-a / SCR-12-b.',
  14: 'Đã sửa: mỗi CQCM chỉ thấy phiếu BM-04 của cơ quan mình (form ghi rõ); chỉ ĐVĐX thấy cả hai ở T26. Xem SCR-11-a.',
  15: 'Đã sửa cùng #13: AI đưa giải pháp đồng bộ ý kiến 2 cơ quan và hướng dẫn sửa ở T26. Xem SCR-12-a / SCR-12-b.',
  16: 'Đã sửa: Báo cáo tiến độ & tồn đọng có KPI theo từng bước (thời gian, số vòng, số ý kiến) và đánh giá của AI. Xem SCR-93 (page 11) và tab KPI ở Tổng quan SCR-92.',
  17: 'Đã sửa: khối "AI kiểm tra đủ hồ sơ" theo Checklist. Xem SCR-15-b.',
  18: 'Đã sửa: bảng người ký BM-05 thêm cột "Ký lúc". Xem SCR-17-a.',
  19: 'Đã sửa: thêm cột "Trình ký lúc". Xem SCR-17-a.',
  20: 'Đã sửa: cột "Thời gian xử lý / KPI ký" (ngày làm việc) + nhận xét của AI; tổng hợp KPI ở Báo cáo SCR-93. Xem SCR-17-a.',
  21: 'Đã sửa: cột "Lý do từ chối (VOffice)". Xem SCR-17-a.',
  22: 'Đã sửa: danh sách tài liệu có dòng tuỳ chọn "Phiếu nhận xét của Tập đoàn" kèm nút Tải lên. Xem SCR-19-b.',
  23: 'Đã sửa: khối AI đọc nhận xét Tập đoàn → hướng dẫn hoàn thiện. Xem SCR-19-b.',
  24: 'Đã sửa: hộp thoại Chọn mẫu tài liệu chỉ hiện mẫu của quy trình đang chạy, mặc định lọc theo bước (có cột Bước); Văn bản đầu ra có cột Trạng thái: AI đã gợi ý / Đang làm / Hoàn thành. Xem SCR-03.',
};

async function api(path, init) {
  const r = await fetch(`https://api.figma.com/v1${path}`, { ...init, headers: { 'X-Figma-Token': TOKEN, 'Content-Type': 'application/json' } });
  if (!r.ok) throw new Error(`${r.status} ${path}: ${await r.text()}`);
  return r.json();
}

{
  if (!TOKEN) { console.error('Thiếu FIGMA_TOKEN'); process.exit(1); }
  const { comments } = await api(`/files/${KEY}/comments`);
  const roots = comments.filter((c) => !c.parent_id);
  let sent = 0, skip = 0;
  for (const c of roots.sort((a, b) => Number(a.order_id) - Number(b.order_id))) {
    const msg = REPLIES[c.order_id];
    const done = c.resolved_at || comments.some((r) => r.parent_id === c.id && r.message.startsWith(TAG));
    if (!msg || done) { skip++; console.log(`#${c.order_id} bỏ qua (${!msg ? 'không có trả lời' : 'đã resolve / đã trả lời'})`); continue; }
    const text = `${TAG} ${msg}`;
    if (SEND) { await api(`/files/${KEY}/comments`, { method: 'POST', body: JSON.stringify({ message: text, comment_id: c.id }) }); sent++; }
    console.log(`#${c.order_id} ${SEND ? 'đã gửi' : 'sẽ gửi'}: ${text}`);
  }
  console.log(`${SEND ? 'Đã gửi' : 'Thử'} ${SEND ? sent : roots.length - skip} trả lời, bỏ qua ${skip}. Resolve trên Figma bằng tay (API không hỗ trợ).`);
}
