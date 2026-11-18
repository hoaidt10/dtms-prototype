# Lịch sử chung prototype ĐTMS (đến T77, 2026-11-18)

> Chuyển nguyên văn từ đầu README.md và mục "Tiến độ" khi tách repo nguồn (T77 S3, D-129). Nhật ký mới ghi ở `changelog/<phân-hệ>.md`.

Prototype HTML bấm được, dùng để **review nội bộ** trước khi xuất sang Figma. Bản demo cho khách là Figma.
Nguồn: [`docs/dtms/prototype-MS01-chuan-bi.md`](../../docs/dtms/prototype-MS01-chuan-bi.md) (persona, hồ sơ mẫu, 9 cảnh, màn, điểm ❓)
và BPMN chuẩn `project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS-121026.drawio`, trang **MS01 v1.1** (61 task; từ 2026-09-28, thay bản 58 task `MS01_01_TO_BE_VHT`;
từ 2026-11-05 đọc bản chuẩn 12/10 — T29 B1).

> **T54 đợt 2:** khối **Trình ký** (lần trình mới nhất của từng văn bản, thao tác theo trạng thái) ở tab Tài liệu & văn bản ĐXMS, màn việc KĐT, Chi tiết KĐT;
> "Bản cứng" đổi thành **Ký ngoài hệ thống** (ĐXMS, KĐT 75–78, báo cáo; tên bước 77 / 78 theo BPMN chưa đổi).
>
> **T54 (2026-11-11) — Trình ký VOffice theo SRS 32** (`docs/SRS/32-srs-trinh-ky-voffice`, plan `docs/dtms/prototype-T54-trinh-ky-voffice.md`): `js/trinh-ky.js` thay hộp thoại ký cũ
> bằng **Trình ký VOffice** (Hình thức trình VOffice / Ký ngoài hệ thống + Cách ký, Lý do; Kết nối VOffice — mật khẩu GIẢ LẬP, gõ `sai` để thấy lỗi; Thông tin văn bản theo VOffice;
> Tệp chính + kèm theo; bảng người ký theo nhóm có dòng khóa, gợi ý theo cấu hình phụ lục A). Mỗi lần gửi là một **lần trình** (localStorage `dtms-proto-trinh-ky`, mã giao dịch);
> VOffice GIẢ LẬP trả Đã ký ngay, Bản ký Chưa lấy. Menu **Trình ký** (`#/trinh-ky`, SCR-113): tab Tôi trình / Tôi ký / Tất cả, Thu hồi, Lấy bản đã ký, Cập nhật trạng thái, Nhập kết quả ký,
> Gửi lại, Chi tiết lần trình. **BM-03 trình ở bước 16.1** (bước 18 không tự trình). Spec `e2e/t54-trinh-ky.spec.mjs`; helper e2e điền mật khẩu VOffice.

> **T29 B1 (2026-11-05, D-54 thay P-37; nguồn RV-PROTO-0511 #4, #18):** MS01 **Phê duyệt đề xuất mua sắm là một quy trình**. MS01.01 / .02 / .03 là
> **luồng con** — biến của hồ sơ: dự kiến theo Giá trị dự kiến và trường **Căn cứ đã được phê duyệt** (D-77) khi tạo luồng / hồ sơ; cổng "Giá trị?" sau
> task 10 đặt lại theo Tổng giá trị báo giá và ngưỡng hồ sơ giữ (dưới ngưỡng → .03, task 11; từ ngưỡng → .01 / .02 dự kiến, task 12); task 48 TTMS chọn có / không
> báo cáo TGĐ Tập đoàn → chốt .01 / .02 (chọn sẵn theo Căn cứ đã được phê duyệt). Không còn ô chọn Quy trình, task 10a / 10b, trạng thái "Đã chuyển quy trình".
> Cột Quy trình hiện "MS01" trước cổng, ".0x (dự kiến)" tới task 48. Danh sách quy trình, Ma trận hành động, Đối soát BPMN, Giám sát tiến trình theo một MS01.
> Một số đoạn bên dưới còn mô tả cách cũ (chọn quy trình, 10a / 10b) — đọc theo khung này.

> **T29 B17 (2026-11-05) — đối chiếu màn Soạn thảo TTr kinh phí cũ** (HT-DXMS-IMG "Tạo mới" 1, 2; mẫu tờ trình cũ HT-DXMS-TT): Thêm mới luồng (SCR-96) điền sẵn
> **Căn cứ pháp lý** (QĐ 12868, QT 8.6.3.23 — P-211) và có card **Phụ lục kèm theo Tờ trình** (6 phụ lục Có / Không, mặc định Không; Có thì tải tệp được ngay);
> bước lập dự thảo 11/12 sửa được lựa chọn, phụ lục Có bắt buộc có tệp mới gửi được, Checklist ghi Bắt buộc / Không áp dụng, Tờ trình in "Danh mục hồ sơ kèm theo" (P-212);
> hộp xem trước Tờ trình BM-01 / BM-09 có nút **Xuất file Word** (tải `.doc` theo bố cục mẫu cũ). Spec `e2e/t29-b17.spec.mjs`.
> **T29 B16 (2026-11-05) — DX-10 (D-83):** MS01 thêm bốn bước chỉ huy duyệt trên ĐTMS (5.1 Chỉ huy ĐVĐX xác nhận khởi tạo — bỏ qua khi người tạo là chỉ huy;
> 7.1 Chỉ huy Kho; 10.1 Chỉ huy Thầu TTMS; 16.1 Chỉ huy ĐVĐX duyệt BM-03 + CQCM). Bước 7 là việc của Kho trên sơ đồ, 8 / 10 của Thầu TTMS (persona Ninh Thị Hồng),
> 10 Không đạt → tạo YCBG mới. Lớp chồng lên BPMN v1.1 ở `js/data.js` (`D.dx10`) tới khi BA vẽ lại; MS02 giữ thứ tự cũ.

> **T29 B3 (2026-11-05):** (a) **Rà soát tồn kho do Phòng QLTS / Thủ kho** (persona Hà Văn Tiến): hồ sơ tới bước 7 → Việc của tôi của Kho có việc
> "Rà soát tồn kho" (ngoài sơ đồ, `#/ra-soat-kho`, SCR-105) — **T29 B5 (D-82): nhập một lần theo cột biên bản BM-RSTK** (Mã hàng, Nhà sản xuất, SL tồn kho, SL xuất kho ≤ tồn khả dụng, SL điều chuyển,
> SL cần mua, hợp đồng đầu vào, vị trí), Tệp kết quả, sinh Biên bản rà soát (…/BBRS-MS) và Phiếu yêu cầu rà soát; bước 7 của ĐVĐX chỉ xác nhận được khi Kho đã nhập. Công cụ demo › cảnh **1b**. (b) **Bước 10 có card Đánh giá báo giá và cơ sở giá**:
> từng NCC Không phản hồi / Ngày / Hiệu lực / Loại tiền / Tỷ giá, đơn giá theo hạng mục, cơ sở giá theo hạng mục (mặc định thấp nhất còn hiệu lực, chọn khác cần lý do),
> Tổng theo cơ sở giá là giá trị hồ sơ. (c) **Yêu cầu báo giá ĐXMS**: Thêm mới / Cập nhật YCBG trực tiếp (`#/ycbg/create`, SCR-106, GIẢ LẬP P-205), cột và bộ lọc
> Dự án / Đề tài, từ khoá + bộ lọc đồng thời. (d) **Bước 1** chọn thêm văn bản căn cứ bổ sung.

## Tiến độ (T5)

| Bước | Nội dung | Trạng thái |
|---|---|---|
| 1 | Khung + menu toàn hệ; SCR-00/01/02/20/21; mẫu "Màn xử lý task"; luồng 58 task chạy được | Xong, chờ review |
| 2 | Nội dung chi tiết SCR-03…10 (cảnh 1–3) | — |
| 3 | SCR-11…17 (cảnh 4–6) | — |
| 4 | SCR-18/19, hoàn thiện SCR-20, nhánh phụ (cảnh 7–9) | — |
| 5 | Chạy thử nội bộ, xuất Figma (45 màn, prototype link, flow “Demo MS01.01”, Cover) | Xong (theo bản 58 task) |
| 6 (T7) | Cập nhật theo BPMN chuẩn MS01 v1.1 (61 task); xuất lại Figma 48 màn (`gen.mjs reset` → `setup`/`sections` → `batch` → `links`) | Code + test xong; Figma xuất lại ở bước 9 |
| 7 (T7) | Chọn quy trình khi tạo ĐXMS (2026-09-28): SCR-25, lọc căn cứ ở task 01, cổng kiểm tra khớp, 10a/10b (SCR-26), End “Đã chuyển quy trình”, nhánh B-3e, P-26; `capture.mjs` 53 màn | Code + test xong (unit 20, e2e 19); Figma ở bước 9 |
| 8 (T6) | MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098) theo `docs/dtms/prototype-MS01-02-03-chuan-bi.md`: dữ liệu theo hồ sơ, biến thể SCR-03/07/08/10/12/15/16/19/20, màn mới SCR-23, SCR-24, bộ demo + nhánh B-3a…d, ❓ P-17…P-25 lọc theo quy trình | Code + test (xem plan §10); Figma ở bước 9 |
| 9 | Xuất lại Figma `FBFwYisdvDOjvJyRWIQbT3` (2026-09-30): **165 màn**, 8 page (01 Demo MS01.01, 02 Khung, 03 Nhánh phụ, 04 Quản trị quy trình, 05 DMDC, 06 E-Form, 07 Khoản đầu tư, 08 MS01.02 & MS01.03 — 22 màn: SCR-25/03/07/16/19/20 của 0124; SCR-25/03/06/08/10/11/15/23/24/20 + B-3a/B-3b của 0098), 23 component Sidebar theo menu đang mở, 120 prototype link, 9 flow, Cover cập nhật. Cách làm: xem "Xuất Figma" dưới | Xong |

| 10 (T16 B4) | Xuất lại Figma (2026-10-09): **267 màn**, 11 page (thêm 09 Quản lý ĐXMS, 10 KĐT & Thầu, 11 Hợp đồng · Thông báo · Báo cáo — Backlog W1_T10), Topbar + 47 Sidebar component, 158 link (0 lỗi), 12 flow, Cover v0.3. Section cũ được dọn frame trước khi dựng lại. Comment Figma chưa resolve (MCP không có API comment; cần FIGMA_TOKEN) | Xong, chờ review |
| 11 | Xuất lại Figma (2026-10-12): **326 màn**, 13 page (thêm 12 Điều chỉnh ĐXMS · MS02 — 19 màn T21; 13 Luồng mua sắm (T17 · phương án Gộp) — 12 màn SCR-95…98; SCR-99 vào page 05; page 07 Khoản đầu tư 72 màn theo BPMN 12/10 của T18, kèm SCR-100), Topbar + 50 Sidebar component, 196 link, 13 flow, Cover v0.4. Frame cũ dọn hết trước khi dựng | Xong, chờ review |
| 12 (T24, 2026-10-30) | Yêu cầu team BA 30/10: bỏ cột Thao tác 4 danh sách, bỏ Trigger, KĐT ↔ Nhiệm vụ / Đề tài, Danh sách Phân hệ + DMDC riêng, Thầu theo hệ thống cũ (T1–T8), Quản lý quy trình Q1–Q5. Figma chưa xuất lại. Hợp đồng chạy luồng: T25 |
| 13 (T25, 2026-11-02) | Hợp đồng chạy luồng: MS22, MS23, MS23.01…04, MS24 trên HĐ-2026-0052; trang capture "Hợp đồng chạy luồng · T25", page Figma 14 đã khai báo ở `gen.mjs`, chưa xuất Figma. |

**Xuất Figma** (dữ liệu ~2,3 MB vượt 50 KB/lần gọi `use_figma`, nên đi qua ảnh dữ liệu):
1. `node tools/capture.mjs <cap>` (thêm `"<trang>"` để chụp riêng một trang) → `node tools/compact.mjs <cap>` → `node tools/gen.mjs <cap> bundle > bundle.json` → `node tools/figma-pack.mjs bundle.json data.png` (PNG xám không nén, có kiểm khứ hồi).
2. `gen.mjs <cap> pinit` → tạo page + hình `__data` (page 99) → MCP `upload_assets` với `nodeIds=[<id __data>]`, POST `data.png`.
3. `gen.mjs <cap> pcomp <id __data>` → Topbar + Sidebar theo từng skey + runtime `__runtime2`; ghi id vào `ids.json` (`data`, `top`, `sides`, `runtime`).
4. `gen.mjs <cap> sections "<page>"` cho từng page (section dài xuống hàng sau 12 màn) → `gen.mjs <cap> plan 15` chia lô → `gen.mjs <cap> pscreens ids.json <i,j,…>` mỗi lô (mã ~600 byte, đọc dữ liệu từ ảnh).
5. Nối link theo tên `link→<id>` trong từng page + đặt flow (xem `links()` trong `gen.mjs`).
