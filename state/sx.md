# State — Quản lý sản xuất (`sx`)

> State riêng của phân hệ, BA của phân hệ giữ. Cập nhật **Now** cuối mỗi pha (PLAN → BUILD → VERIFY) để phiên sau tiếp được.
> Hook đầu phiên chèn mục Now khi bạn ở nhánh `sx/<việc>`. Giữ ngắn: việc xong thì gom một dòng vào "Đã xong".

**Chủ phân hệ:** @Akira2201 (mời 2026-11-18)
**Tiền tố số mới:** điểm treo `P-SX-01`…, đề xuất `DX-SX-01`…, quyết định chờ chốt `Q-SX-01`…, màn mới `SCR-SX-01`…

## Now

Chưa có việc.

## Việc đang làm

| Nhánh | Việc | Pha | PR |
|---|---|---|---|

## Quyết định chờ người tích hợp chốt

<!-- Q-SX-01 — câu hỏi; phương án; đề xuất. Người tích hợp duyệt → thành D-xxx trong STATE.md của cds-vht, ghi mã D ở đây. -->

- **Q-SX-01 — BA (hoaidt10) đã trả lời 26/11, chờ người tích hợp ghi mã D:** (a) xong hết công việc con thì **luôn tự hoàn thành** việc cha
  (bước nhiều kết quả: người được giao chọn trước kết quả đồng ý / đạt khi chia việc; trường bắt buộc còn trống điền tổng hợp công việc con / ngày hoàn thành;
  không chia ở bước ký số; bộ chặn nghiệp vụ còn chặn → Chờ hoàn tất); (b) chỉ chia cho **người cùng đơn vị**; (c) người theo dõi = **PM dự án + lãnh đạo cấp cao**
  (Ban Giám đốc Khối, Ban Tổng Giám đốc). Đã dựng theo phương án này. Nội dung câu hỏi ban đầu:
- **Q-SX-01** (26/11, công việc con của việc Camunda) — Khi mọi công việc con xong, việc cha (user task) tự hoàn thành tới mức nào?
  Bước có nhiều kết quả (Phê duyệt / Trả lại…), cần ký số, hoặc eForm còn trường bắt buộc thì hệ thống không tự chọn / tự điền được.
  **Phương án tạm (đang dựng):** tự complete task trên Camunda chỉ khi bước có một kết quả, không ký số, không vướng bộ chặn và đủ trường bắt buộc (dữ liệu hồ sơ / Lưu nháp);
  còn lại việc chuyển *Chờ hoàn tất*, người được giao bổ sung và gửi. Còn công việc con chưa xong thì chặn gửi (trừ trả lại / từ chối → huỷ công việc con).
  Khi làm thật: công việc con lưu ở module Công việc (khoá ngoài processInstanceId + taskId), job worker nghe sự kiện hoàn thành công việc con gọi Camunda complete task.
  Cần chốt: (a) có chấp nhận *Chờ hoàn tất* hay bắt buộc mọi bước chia được phải tự hoàn thành; (b) người được chia việc cho ai (mọi nhân sự / chỉ cùng đơn vị); (c) người quản lý theo dõi = PM dự án + Lãnh đạo Khối hay theo cây tổ chức.

## Đã xong

