> **Bản chép từ workspace người tích hợp (`cds-vht/.harness/rules/prototype-solution.md`) — không sửa ở đây.** Với BA không có mã FE (`fe/repo-khcn-*`):
> dùng bảng màn tương đương B2 + `tai-lieu/_md/CR-FE-UI.md` (danh mục component); không tìm được màn tương đương → hỏi người tích hợp trong PR.
> Đề xuất đổi quy trình (DX) ghi trong PR (mục "Đề xuất"), người tích hợp chép vào sổ DX.

# Rule: Prototype tĩnh nhưng giải pháp phải làm được khi phát triển thật

> Người dùng yêu cầu 2026-10-07 (T16, Locked decision trong `STATE.md`). Áp dụng cho mọi màn trong `prototype/`, kể cả màn đã
> dựng, và cho mọi yêu cầu sửa từ comment khách. Bổ sung cho [`prototype-ui.md`](prototype-ui.md): rule đó nói màn **trông** như app
> thật; rule này nói màn phải **làm được** trên nền tảng thật (FE `fe/repo-khcn-*`, `@khcn-core/ui`, BE `be/*`, Camunda 8).

## Nhóm S — Mỗi thứ vẽ ra phải có đường hiện thực

- **S1. Có khuôn để code.** Mỗi màn, khối, tương tác chỉ ra được nó được làm bằng gì: màn tương đương trong FE (B1/B2 của
  `prototype-ui.md`), component `@khcn-core/ui` (gồm `vht-e-form`), API/service BE tương ứng. "Prototype chỉ là tĩnh" không phải
  lý do để vẽ thứ không code được.
- **S2. Cấu hình thay cho code riêng.** Khác biệt giữa các bước, loại hồ sơ, quy trình phải đến từ **cấu hình**: BPMN, eForm
  (Camunda Form schema), Ma trận hành động / luật hiển thị, danh mục dùng chung, mẫu tài liệu. Không dựng một màn code riêng cho
  từng bước. Màn xử lý task = **khung chung `my-task-detail`; eForm của bước mở bằng dialog khi bấm nút hành động**, đúng source
  (`handleActionButton` → `loadEform` → `my-task-eform-dialog` / `vht-e-form`) (D-24).
- **S3. Phân loại nội dung riêng của bước** — mỗi khối phải thuộc một loại:
  1. trường eForm (textfield, textarea, number, datetime, select, checkbox, radio, checklist, taglist, expression);
  2. bảng lặp eForm (`dynamiclist`);
  3. khối chỉ xem trong eForm (`table`, `text`/`html`) đọc **biến quy trình** do task/service task ghi (kết quả AI, đối soát…);
  4. tài liệu → card `Danh sách tài liệu` chung (tải lên, chọn mẫu), không đặt nút tải riêng trong nội dung bước.

  Không thuộc loại nào → đánh dấu **"cần dev riêng"**, ưu tiên đặt thành tab ở Chi tiết hồ sơ / đối tượng cha, ghi lý do trong (i)
  và trong bảng truy vết của task. Danh sách loại trường lấy theo `vht-e-form` (`fe/repo-khcn-core-fe/projects/ui/src/custom/vht-e-form`);
  source thêm loại mới thì cập nhật rule.
- **S4. Dữ liệu có nguồn.** Mỗi giá trị hiển thị nói được nó đến từ đâu: trường của hồ sơ / đối tượng cha, biến quy trình (task nào
  ghi), danh mục, hoặc tích hợp (SAP, VOffice/Vops, VContract, MBOM…). Không hiển thị số liệu, cảnh báo, KPI không có nguồn khả thi.
- **S5. AI và tích hợp = service task + kết quả chỉ xem.** AI/tích hợp chạy ở service task, ghi kết quả vào biến quy trình; màn chỉ
  hiển thị kết quả (loại 3) và để người dùng xác nhận/quyết định. Thể hiện cả trạng thái lỗi / chưa có kết quả. Không vẽ AI làm việc
  mà đầu vào chưa có trong hệ thống.
- **S6. Logic nằm ở engine hoặc ở cấu hình, không chỉ ở UI.** Nhánh, quay lại, vòng lặp, điều kiện chặn (vd "chỉ duyệt tổng thể
  khi mọi phần Đạt") phải biểu diễn được bằng BPMN Camunda 8 (gateway, timer, message, call activity, multi-instance), validate /
  expression của eForm, hoặc luật hiển thị hành động. Không có logic chỉ tồn tại trên giao diện.
- **S7. Phân quyền qua cơ chế có thật.** "Ai thấy gì" (vd hai cơ quan không thấy ý kiến của nhau) phải chỉ ra cơ chế: quyền theo
  vai/đơn vị, biến riêng theo task, quyền tài liệu… Chưa có cơ chế → "cần dev riêng" (S3).

## Nhóm P — Khi giải pháp hợp lý đòi đổi quy trình

- **P1. Được đề xuất, không được tự sửa.** Nếu muốn khả thi phải thêm/bớt task, gateway, tách luồng con, thêm trường danh mục, đổi
  tác nhân… thì nêu **đề xuất** mã `DX-xx` trong sổ riêng [`docs/dtms/de-xuat-thay-doi-quy-trinh.md`](../../docs/dtms/de-xuat-thay-doi-quy-trinh.md)
  (người dùng yêu cầu 2026-10-07): hiện trạng → đề xuất → lý do (S nào) → ảnh hưởng (BPMN, màn, dữ liệu) → việc của BA; tài liệu
  chuẩn bị của task chỉ ghi mã + link. Chờ người dùng / BA duyệt. Không sửa tệp khách trong `project-knowledge/`.
- **P2. Đề xuất đã duyệt** ghi vào Locked decisions (`STATE.md`) và nút (i) của màn liên quan; cần BA cập nhật BPMN thì ghi ❓ để hỏi.
- **P3. Yêu cầu của khách (comment Figma, BBLV) cũng qua bộ lọc này.** Hiện thực theo giải pháp khả thi; yêu cầu không khả thi trên
  nền tảng → đề xuất phương án thay thế (P1), không vẽ nguyên văn.

## Nhóm K — Kiểm trước khi dựng / sửa màn

- **K1.** Trong plan của bước, mỗi màn mới / khối sửa trả lời 5 câu: khuôn FE nào? cấu hình nào (BPMN / eForm / luật / danh mục)?
  dữ liệu lấy từ đâu? BPMN biểu diễn được chưa? phần nào "cần dev riêng"?
- **K2.** Review cuối bước: rà lại các khối "cần dev riêng" — nếu tìm được cách cấu hình thì chuyển về loại 1–4.
