# Rule: Làm prototype ĐTMS cùng nhiều BA

> T77 (D-129, 2026-11-18). Rule gốc của repo nguồn `thaiphuc22/dtms-prototype` — người tích hợp giữ, BA không sửa.
> Đi cùng [`prototype-ui.md`](prototype-ui.md) (màn **trông** như app thật) và [`prototype-solution.md`](prototype-solution.md)
> (giải pháp **làm được** khi phát triển thật). Hai rule đó là bản chép, không sửa ở đây.

## G — Git và phân hệ

- **G1. Một việc một nhánh** `<phân-hệ>/<việc>` (vd `kdt/sua-buoc-12`), tách từ `main` mới nhất (`git pull --rebase` trước).
  Phân hệ và file của nó: [`modules.json`](../../modules.json). Không commit thẳng `main`.
- **G2. Chỉ sửa file của phân hệ mình.** File dùng chung (`js/app.js`, `screens.js`, `flow.js`, `ui.js`, `data.js`, `index.html`, css,
  `tools/`, `e2e/helpers.mjs`…) do người tích hợp giữ: cần sửa thì sửa ít nhất và ghi lý do ở mục "File dùng chung" của PR.
  Cần đổi ở phân hệ khác → ghi vào PR, không tự sửa. Hook `guard` cảnh báo khi bạn sửa ngoài phân hệ.
- **G3. PR vào `main`**, điền đủ mẫu PR. CI (`npm test`) phải xanh. Người tích hợp review, merge, **deploy** — BA không deploy,
  không đụng `.env.pages`, không push `main`.
- **G4. Trước khi xin review:** `npm test` xanh trên máy; bấm thử màn đã sửa; chụp ảnh trước / sau.
- **G5. PR nhỏ.** Một màn / một nhóm comment một PR. PR sửa file dùng chung tách riêng khỏi PR nghiệp vụ nếu được.

## N — Đánh số (không trùng giữa các BA)

- **N1.** Số cũ giữ nguyên. Số **mới** mang tiền tố phân hệ (`prefix` trong `modules.json`):
  điểm treo `P-<PH>-01` (khoá trong `D.openPoints` / dữ liệu của phân hệ), đề xuất đổi quy trình `DX-<PH>-01`, màn mới `SCR-<PH>-01`,
  quyết định chờ chốt `Q-<PH>-01`. Số tăng trong phân hệ, ghi ở `state/<phân-hệ>.md`.
- **N2.** Quyết định đã chốt (`D-xxx`) và số task (`Txx`) chỉ người tích hợp cấp (sổ ở workspace cds-vht). BA ghi `Q-<PH>-xx`,
  người tích hợp duyệt thì ghi mã `D-xxx` tương ứng vào state của phân hệ.

## T — Tài liệu nghiệp vụ

- **T1.** Căn cứ duy nhất là [`tai-lieu/INDEX.md`](../../tai-lieu/INDEX.md) và bản đọc `tai-lieu/_md/<mã>.md` (bản chép của tài liệu chuẩn).
  Không lấy căn cứ từ tệp khác tìm được trên mạng / máy. Trích dẫn bằng **mã tài liệu** (`QT-10.2.1 §5`, `DG-MS13` bước 12).
- **T2.** Thiếu tài liệu, hoặc cần đối chiếu số liệu / hình với tệp gốc → hỏi người tích hợp (ghi trong PR). Không tự đoán.
- **T3.** Nguồn không có thông tin (quyền, phạm vi dữ liệu, hành vi) → ghi thành **câu hỏi kèm phương án tạm** (`Q-<PH>-xx`),
  không viết như quy tắc đã chốt. Báo riêng các đề xuất tự thêm kèm lý do.
- **T4.** Nhiệm vụ KHCN là Đề tài / Dự án có Loại = KHCN (không phải đối tượng riêng); "TTr" trong ghi chú khách = ĐXMS.

## P — Điểm treo và giả lập

- **P1.** Điểm còn treo (❓ `P-…`) không để màn trống: **giả lập** một phương án hợp lý cho màn chạy được, ghi `GIẢ LẬP` đầu `def`
  của điểm treo và ghi chú trong nút (i). Giả lập phải khả thi khi làm thật (cấu hình thay vì viết cứng — `prototype-solution` S2).
- **P2.** Chữ "giả lập", mã `SCR-` / `UC-` / `P-` chỉ nằm trong nút (i) — test C3 (`e2e/ui-rules.spec.mjs`) bắt nếu lộ ra màn.

## E — Sửa file an toàn

- **E1.** Ưu tiên công cụ Edit của Claude Code. Sửa bằng script thì đọc / ghi **nhị phân** (`'rb'` / `'wb'`), thay bằng
  `s.replace(a, b, 1)` có `assert s.count(a) == 1`, không cắt chuỗi theo chỉ số. Không dùng `sed -i` (đổi đuôi dòng cả tệp).
- **E2.** Ngay sau khi ghi: so số dòng trước / sau, xem `tail` tệp, `node --check` tệp JS, `git diff --stat` (diff cả nghìn dòng = hỏng đuôi dòng).
- **E3.** Xoá một `test(...)` thì cắt đúng khối của nó — không cuốn theo `const` khai báo nằm giữa hai test.

## Q — Test

- **Q1.** Sửa màn thì sửa / thêm e2e của màn trong file spec của phân hệ. Test cũ đỏ vì màn đổi **có chủ ý** → sửa test, ghi lý do
  (mã quyết định) trong comment; đỏ vì lỗi thật → sửa màn.
- **Q2.** Ca cách ly (`e2e/quarantine.json`, `area` = phân hệ): sửa dần, ca nào xanh (`npm run test:quarantine -- -g "<tên>"`) thì xoá dòng.
  Không thêm ca vào danh sách cách ly để PR xanh — báo người tích hợp.
