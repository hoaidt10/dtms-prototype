# Prototype ĐTMS — MS01.01 Phê duyệt ĐXMS

Prototype HTML bấm được, dùng để **review nội bộ** trước khi xuất sang Figma. Bản demo cho khách là Figma.
Nguồn: [`docs/dtms/prototype-MS01-chuan-bi.md`](../../docs/dtms/prototype-MS01-chuan-bi.md) (persona, hồ sơ mẫu, 9 cảnh, màn, điểm ❓)
và BPMN chuẩn `project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio`, trang **MS01 v1.1** (61 task; từ 2026-09-28, thay bản 58 task `MS01_01_TO_BE_VHT`).

## Mở

Mở `index.html` bằng Chrome hoặc Edge. Không cần mạng, không cần build. Font Roboto và icon đã nằm sẵn trong thư mục.

## Dùng

- **ĐXMS và hồ sơ (T12, D-10…D-12):** ĐXMS là đối tượng cha (như nhiệm vụ KHCN), hồ sơ là đối tượng con. Menu Đề xuất mua sắm có
  **Danh sách ĐXMS** (`#/dxms`, SCR-27 theo `task-management`) và **Hồ sơ ĐXMS** (`#/ho-so-dxms`, SCR-02 theo `profile-list`).
  - Tạo ĐXMS: Danh sách ĐXMS › Thêm mới (SCR-28) → Lưu. Chỉ tạo ĐXMS, **không** khởi tạo quy trình; mã `ĐXMS-2026-0117`.
  - Tạo hồ sơ (SCR-25): Chỉnh sửa ĐXMS › Danh sách hồ sơ › **Tạo hồ sơ** (ô ĐXMS khoá), hoặc Hồ sơ ĐXMS › Thêm mới. Chọn **Loại hồ sơ**
    (Phê duyệt ĐXMS → MS01.01 / .02 / .03; Điều chỉnh ĐXMS → MS02) và **Quy trình**, bấm Lưu: hồ sơ Phê duyệt sinh mã `HS-2026-0117`,
    khởi tạo quy trình ngay và mở task 01 (❓ P-26). Hồ sơ Điều chỉnh được ghi nhận và mở ở chế độ xem (luồng MS02 chưa dựng).
  - **Ba hồ sơ chạy luồng (T6):** dữ liệu mẫu (danh mục, báo giá, BM-04, Tờ trình…) theo ĐXMS của hồ sơ (`D.demoCases`, `D.useCase`):
    ĐXMS-2026-0117 · MS01.01 (182,90 tỷ), **ĐXMS-2026-0124 · MS01.02** (176,40 tỷ, căn cứ PAKD 1876/QĐ-TĐ đã được TGĐ Tập đoàn duyệt — task 48 khoá
    “Có báo cáo”, bỏ 49–56), **ĐXMS-2026-0098 · MS01.03** (45,20 tỷ, Kế hoạch SXKD 2026 — BM-09 + Checklist 02, Ban Tài chính bắt buộc,
    TTMS ‖ Phó TGĐ ký trên BM-09 ở SCR-23, Thủ trưởng phê duyệt trên BM-09 ở SCR-24, KPI 10 NLV). ĐXMS khác tạo trên prototype dùng dữ liệu của 0117.
  - Luật: một ĐXMS chỉ có một hồ sơ đang xử lý; Phê duyệt khi ĐXMS chưa được phê duyệt; Điều chỉnh khi đã phê duyệt. Trạng thái và giá trị hiệu lực của ĐXMS suy từ hồ sơ.
- **Đổi vai:** bấm avatar góc phải topbar, hoặc vào màn SCR-00 (`#/chon-vai`). Việc được giao cho vai nào thì hiện ở "Việc của tôi" của vai đó.
- **Chạy luồng:** mở một việc, bấm nút trên thanh hành động ở cuối màn. Hồ sơ đi theo 61 task BPMN MS01 v1.1 (+ 10a, 10b), có:
  - task 01 chỉ hiện căn cứ hợp với quy trình đã chọn; task 04 cảnh báo mềm nếu giá trị dự kiến lệch ngưỡng;
  - cổng “Giá trị khớp quy trình đã chọn?” sau task 10: khớp thì .01 đi task 12, .03 đi task 11; không khớp thì task 10a (SCR-26):
    *Sửa lại* về task 10, hoặc *Chuyển quy trình* → 10b tạo hồ sơ `HS-2026-0125` **của cùng ĐXMS** theo quy trình đúng, hồ sơ cũ kết thúc “Đã chuyển quy trình”;
    nút “Mở hồ sơ mới” chạy lại từ task 01 với dữ liệu đã sao chép (mặc định P-26);
  - TTMS xác nhận danh sách CQCM (task 17, N07) — màn SCR-22;
  - 3 CQCM làm song song, mỗi CQCM một phiếu BM-04; AI kiểm tra xung đột (task 24);
  - giải trình: ≤ 2 vòng quay về chỉ huy ĐVĐX rồi gửi CQCM lập lại BM-04; > 2 vòng thì phải họp;
  - BM-05: TTMS ký trước, sau đó CQCM ‖ Phó TGĐ (Q01);
  - TTMS chọn có/không báo cáo Tập đoàn (task 48);
  - nhánh < 160 tỷ (task 11, 38–40 → 60) chạy với hồ sơ MS01.03 (ĐXMS-2026-0098); bị trả lại ở 38/39/60 thì về task 25 → 26 (P-18);
  - hộp thoại trình ký SCR-21.
- **Công cụ demo** (nút nổi góc dưới phải): **Hồ sơ demo** (0117 · MS01.01 / 0124 · MS01.02 / 0098 · MS01.03 — đổi bộ thì luồng đặt lại, ý kiến ❓ giữ nguyên;
  bộ 0124/0098 mở Thêm mới hồ sơ khoá ĐXMS đó), nhảy tới cảnh của bộ đang chọn (MS01.01: 1–9 theo §2.4; MS01.02: 2-1…2-4; MS01.03: 3-1…3-7 theo plan
  MS01.02/.03 §3.4), nhánh phụ (MS01.01: 6 nhánh, đầu tiên là B-3e; MS01.03: B-3a…d), reset luồng (về trước bước Thêm mới ĐXMS; xoá ĐXMS và hồ sơ
  đã tạo trên prototype), mở danh sách điểm ❓.
- **Điểm ❓:** bấm nhãn tím `❓ P-xx` trên màn để ghi ý kiến. Trang `#/cho-chot` tổng hợp mọi điểm (P-01…P-16, P-22, P-26, P-27…P-36 của DMDC, P-37…P-41 của Quản trị quy trình, P-43…P-49 của E-Form, …) và xuất ra Markdown/CSV.
- **Danh mục dùng chung** (T8): Quản trị hệ thống › Danh mục dùng chung (`#/dmdc`) mở trang Tổng quan (SCR-30), vào từng danh mục qua ô
  (`#/dmdc/<danh-mục>`). Ô lọc theo vai (❓ P-36): vai **Quản trị hệ thống** (Đặng Thu Trang) thấy cả 10 danh mục, Chuyên viên TTMS thấy 2, vai khác không thấy.
  Bước B1 dựng khuôn chung theo ecat `common-catalog` và danh mục Nguồn vốn (SCR-32): lọc Trạng thái, tìm kiếm, Thêm mới/Chỉnh sửa trong hộp thoại,
  Dừng hoạt động/Kích hoạt, Xoá (bản ghi đang dùng bị chặn — P-33). Bước B2 thêm 7 danh mục SCR-33…39 cùng khuôn (Lĩnh vực đầu tư, Loại khoản đầu tư
  có Cấp xử lý, Tính chất tài sản, Loại hàng hoá/dịch vụ có Nhóm, Hình thức LCNT có Tên viết tắt, Phương thức LCNT, Loại hợp đồng).
  Bước B3 dựng Nhà cung cấp / Nhà thầu (SCR-31): mã tự sinh NCC-000123, hộp thoại lg 2 cột với quy tắc Trong nước / Nước ngoài
  (mã số thuế, quốc gia), ngành hàng chọn nhiều từ SCR-36, tìm kiếm nâng cao như màn Đối tác của ecat, cột Tình trạng (cấm / hạn chế),
  Nhập từ Excel (chọn file → kết quả từng dòng → Xác nhận nhập; file giả lập 20 dòng, 2 dòng lỗi).
  Bước B4 dựng Ngưỡng phân luồng (SCR-40): bảng quy tắc (nhóm, lĩnh vực, tính chất tài sản, khoảng giá trị) → quy trình, chặn chồng khoảng, hiệu lực từ ngày.
  Bước B5 nối vào luồng MS01: nhãn điều kiện ở Thêm mới hồ sơ, cảnh báo task 04, cổng kiểm tra khớp sau task 10 và gợi ý ở 10a đọc bảng ngưỡng
  (hồ sơ giữ ngưỡng lúc tạo — P-34); Nguồn vốn ở task 04 chọn từ SCR-32; task 08 chọn nhà cung cấp nhận YCBG từ SCR-31, lọc theo ngành hàng
  của hạng mục; bảng báo giá lấy tên, loại tiền từ danh mục. Dữ liệu danh mục lưu riêng (localStorage `dtms-proto-dmdc`), "Reset luồng" không xoá.
- **Quản trị quy trình** (T9): menu cha mới trên Quản trị hệ thống gồm Quy trình BPMN (`#/quy-trinh`), Ma trận hành động (`#/ma-tran`),
  Giám sát tiến trình (`#/giam-sat-tien-trinh`); route cũ `#/ph/quy-trinh`, `#/ph/ma-tran` tự chuyển sang. Bước B1 dựng Giám sát tiến trình (SCR-48)
  theo `process-monitoring`: chỉ xem, liên kết duy nhất ở cột Mã hồ sơ (mở Chi tiết hồ sơ, quay lại đúng trang). Vai xem được (❓ P-41): Quản trị hệ thống,
  Chuyên viên TTMS. Quy trình BPMN và Ma trận hành động còn mở màn Đang phát triển (B2–B4).
- **Quản lý E-Form** (T10): Hồ sơ & biểu mẫu › E-Form & mẫu Word (`#/eform`, route cũ `#/ph/eform` tự chuyển), theo ecat
  `common-catalog/catalogs/e-form`. Bước B1: Danh sách biểu mẫu e-form (SCR-49 — lọc Trạng thái, tìm khi gõ, công tắc, Xoá chặn biểu mẫu đang gắn
  bước quy trình ❓ P-47, Xuất excel ra CSV) và Lịch sử cập nhật (SCR-53). Chỉ vai Quản trị hệ thống (❓ P-48). 12 biểu mẫu mẫu của luồng MS01
  lưu ở localStorage `dtms-proto-eform`; "Reset luồng" không xoá, khôi phục bằng nút "Khôi phục dữ liệu E-Form" trong công cụ demo.
  Bước B2: hộp thoại Thêm mới / Chỉnh sửa (SCR-50 — Loại biểu mẫu, Loại hồ sơ, Mã viết hoa khoá khi sửa, trùng mã theo cặp Loại hồ sơ ❓ P-44,
  File mẫu kéo-thả hoặc chọn tệp .xlsx .xls .doc .docx ≤ 5MB, đóng khi đã nhập thì hỏi xác nhận). `Tạo & thiết kế` mở `#/eform/<id>/thiet-ke`.
  Bước B3: Thiết kế biểu mẫu (SCR-51 — kéo-thả thành phần, dock thuộc tính, Hoàn tác/Làm lại, Lưu thiết kế tăng phiên bản + lịch sử) và Xem trước (SCR-52).
  Bước B4: panel "Biểu mẫu phần tử" của Chi tiết quy trình (SCR-42, MS01.01/.02/.03) — mã BM-xx / Checklist xx là link mở Thiết kế, quay lại về
  Chi tiết quy trình; biểu mẫu Dừng hoạt động mở ở chế độ chỉ xem. Ô "Biểu mẫu sử dụng" của luật hiển thị (SCR-44) lấy biểu mẫu Hoạt động (Mã - Tên).
  `tools/capture.mjs` có 10 màn trang "Quản lý E-Form".
- Trạng thái lưu trong localStorage của trình duyệt. Dùng "Reset luồng" để chạy lại từ đầu.

## Cấu trúc

| File | Nội dung |
|---|---|
| `js/bpmn-tasks.js` | 61 task + 10a, 10b sinh tự động từ trang MS01 v1.1 bằng `node tools/bpmn-extract.mjs` (tên, actor, biểu mẫu, việc thực hiện, số task cũ). Không sửa tay |
| `js/bpmn-diagram.js` | Hình vẽ trang MS01 v1.1 (toạ độ, màu, tên task; đã bỏ ghi chú N0x/Q0x) sinh bằng `node tools/bpmn-diagram-extract.mjs`. Không sửa tay |
| `js/bpmn-view.js` | Vẽ BPMN bằng SVG cho màn Xem BPMN (kéo/cuộn để di chuyển, phóng to; tô bước đang xử lý); `?capture=1` vẽ bản gọn cho Figma |
| `js/data.js` | Persona, menu 13 phân hệ, điều hướng luồng, hồ sơ mẫu, điểm ❓ |
| `js/flow.js` | Bộ máy luồng: token song song, join, cổng, bộ đếm vòng, đồng hồ NLV cho KPI |
| `js/ui.js`, `js/screens.js`, `js/app.js` | Helper giao diện, các màn hình, khung và router |
| `js/catalog.js` | Danh mục dùng chung: cấu hình từng danh mục (như `CatalogConfig` của ecat), trang Tổng quan, khuôn danh sách + hộp thoại + xác nhận |
| `assets/app.css` | Giao diện theo layout VHT của `fe/repo-khcn-core-fe` (topbar, sidebar, preset `#EE0033`) |
| `test/flow.test.mjs` | Test bộ máy luồng (node:test): `npm run test:unit` |
| `e2e/*.spec.mjs`, `playwright.config.mjs` | Test Playwright bấm thật trên Chromium: mở từng màn, chạy luồng chính tới phê duyệt, nhánh phụ; `ms01-02-03.spec.mjs` chạy hồ sơ MS01.02 / MS01.03. `npm run test:e2e` |
| `tools/e2e.mjs` | Kịch bản CDP cũ, chụp ảnh từng màn: `npm run e2e:shots` |

## Test

Trong `prototype/dtms`: `npm install` rồi `npx playwright install chromium` (lần đầu). `npm test` chạy cả unit và e2e; `npm run test:e2e:ui` mở chế độ UI; `npm run report` xem báo cáo HTML.

## Tiến độ (T5)

| Bước | Nội dung | Trạng thái |
|---|---|---|
| 1 | Khung + menu toàn hệ; SCR-00/01/02/20/21; mẫu "Màn xử lý task"; luồng 58 task chạy được | Xong, chờ review |
| 2 | Nội dung chi tiết SCR-03…10 (cảnh 1–3) | — |
| 3 | SCR-11…17 (cảnh 4–6) | — |
| 4 | SCR-18/19, hoàn thiện SCR-20, nhánh phụ (cảnh 7–9) | — |
| 5 | Chạy thử nội bộ, xuất Figma (45 màn, prototype link, flow “Demo MS01.01”, Cover) | Xong (theo bản 58 task) |
| 6 (T7) | Cập nhật theo BPMN chuẩn MS01 v1.1 (61 task); xuất lại Figma 48 màn (`gen.mjs reset` → `setup`/`sections` → `batch` → `links`) | Code + test xong; Figma chờ kết nối lại |
| 7 (T7) | Chọn quy trình khi tạo ĐXMS (2026-09-28): SCR-25, lọc căn cứ ở task 01, cổng kiểm tra khớp, 10a/10b (SCR-26), End “Đã chuyển quy trình”, nhánh B-3e, P-26; `capture.mjs` 53 màn | Code + test xong (unit 20, e2e 19); chưa xuất Figma |
| 8 (T6) | MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098) theo `docs/dtms/prototype-MS01-02-03-chuan-bi.md`: dữ liệu theo hồ sơ, biến thể SCR-03/07/08/10/12/15/16/19/20, màn mới SCR-23, SCR-24, bộ demo + nhánh B-3a…d, ❓ P-17…P-25 lọc theo quy trình | Code + test (xem plan §10); chưa xuất Figma |
