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
- **Màn xử lý task (B0.4, D-24):** khung chung `my-task-detail` (Thông tin chung · Quy trình · Danh sách tài liệu · Văn bản đầu ra ·
  Lịch sử hồ sơ). Nội dung riêng của bước nằm trong **eForm** (schema Camunda Form) mở bằng dialog khi bấm nút hành động — Hủy / Lưu nháp /
  Xác nhận, như `my-task-eform-dialog`. Nút từ chối / không đồng ý mở dialog nhận xét. Văn bản (tờ trình, BM-03/05/06/08, BM-00/01/03/14/18)
  xem trước ở Văn bản đầu ra; tài liệu bắt buộc tải lên ở Danh sách tài liệu. Nút (i) có **Xem schema** (JSON chép sang Camunda Modeler được).
- **Chạy luồng:** mở một việc, bấm nút hành động trên hàng tiêu đề, nhập eForm rồi Xác nhận. Hồ sơ đi theo 61 task BPMN MS01 v1.1 (+ 10a, 10b), có:
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
- **Tài khoản toàn quyền** (vai `admin`, chọn ở avatar hoặc Chọn vai): thấy mọi việc đang chờ và đã xử lý của mọi vai, mở việc của vai khác vẫn có nút
  hành động (lịch sử ghi theo vai được giao), vào mọi màn quản trị (Quản lý quy trình, Ma trận hành động, Giám sát tiến trình, E-Form, mọi danh mục DMDC).
  Chỉ để demo, không phải vai nghiệp vụ; chốt quyền dùng `D.allAccess(pid)`.
- **Công cụ demo** (nút nổi góc dưới phải): **Hồ sơ demo** (0117 · MS01.01 / 0124 · MS01.02 / 0098 · MS01.03 — đổi bộ thì luồng đặt lại, ý kiến ❓ giữ nguyên;
  bộ 0124/0098 mở Thêm mới hồ sơ khoá ĐXMS đó), nhảy tới cảnh của bộ đang chọn (MS01.01: 1–9 theo §2.4; MS01.02: 2-1…2-4; MS01.03: 3-1…3-7 theo plan
  MS01.02/.03 §3.4), nhánh phụ (MS01.01: 6 nhánh, đầu tiên là B-3e; MS01.03: B-3a…d), reset luồng (về trước bước Thêm mới ĐXMS; xoá ĐXMS và hồ sơ
  đã tạo trên prototype), mở danh sách điểm ❓, **Khôi phục dữ liệu mẫu** (DMDC, E-Form, thầu, hợp đồng, thông báo — các dữ liệu "Reset luồng" không xoá).
  Bộ KĐT-2026-0032 · MS13 xem mục Khoản đầu tư. Thầu, Hợp đồng, Thông báo, Tổng quan, Báo cáo là màn tĩnh (D-17, D-22) nên không có bộ demo.
- **Điểm ❓:** bấm nhãn tím `❓ P-xx` trên màn để ghi ý kiến. Trang `#/cho-chot` tổng hợp mọi điểm (P-01…P-16, P-22, P-26, P-27…P-36 của DMDC, P-37…P-41 của Quản trị quy trình, P-43…P-49 của E-Form, P-50…P-62 của Khoản đầu tư, …) và xuất ra Markdown/CSV.
- **Danh mục dùng chung** (T8, D-14): menu cấp cha; mục con Tổng quan (`#/dmdc`, SCR-30) và từng danh mục (`#/dmdc/<danh-mục>`),
  vào được cả qua ô trên Tổng quan. Menu con và ô lọc theo vai (❓ P-36): vai **Quản trị hệ thống** (Đặng Thu Trang) thấy cả 10 danh mục, Chuyên viên TTMS thấy 2, vai khác không thấy.
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
- **Quản lý quy trình** (T9; tên theo Backlog, D-15): gồm Quản lý quy trình (`#/quy-trinh`), Ma trận hành động (`#/ma-tran`),
  Giám sát tiến trình (`#/giam-sat-tien-trinh`); route cũ `#/ph/quy-trinh`, `#/ph/ma-tran` tự chuyển sang. Bước B1 dựng Giám sát tiến trình (SCR-48)
  theo `process-monitoring`: chỉ xem, liên kết duy nhất ở cột Mã hồ sơ (mở Chi tiết hồ sơ, quay lại đúng trang). Vai xem được (❓ P-41): Quản trị hệ thống,
  Chuyên viên TTMS. Quy trình BPMN và Ma trận hành động còn mở màn Đang phát triển (B2–B4).
- **Quản lý E-Form** (T10): Danh mục dùng chung › Quản lý E-form (D-16; `#/eform`, route cũ `#/ph/eform` tự chuyển), theo ecat
  `common-catalog/catalogs/e-form`. Bước B1: Danh sách biểu mẫu e-form (SCR-49 — lọc Trạng thái, tìm khi gõ, công tắc, Xoá chặn biểu mẫu đang gắn
  bước quy trình ❓ P-47, Xuất excel ra CSV) và Lịch sử cập nhật (SCR-53). Chỉ vai Quản trị hệ thống (❓ P-48). 12 biểu mẫu mẫu của luồng MS01
  lưu ở localStorage `dtms-proto-eform`; "Reset luồng" không xoá, khôi phục bằng nút "Khôi phục dữ liệu mẫu" trong công cụ demo.
  Bước B2: hộp thoại Thêm mới / Chỉnh sửa (SCR-50 — Loại biểu mẫu, Loại hồ sơ, Mã viết hoa khoá khi sửa, trùng mã theo cặp Loại hồ sơ ❓ P-44,
  File mẫu kéo-thả hoặc chọn tệp .xlsx .xls .doc .docx ≤ 5MB, đóng khi đã nhập thì hỏi xác nhận). `Tạo & thiết kế` mở `#/eform/<id>/thiet-ke`.
  Bước B3: Thiết kế biểu mẫu (SCR-51 — kéo-thả thành phần, dock thuộc tính, Hoàn tác/Làm lại, Lưu thiết kế tăng phiên bản + lịch sử) và Xem trước (SCR-52).
  Bước B4: panel "Biểu mẫu phần tử" của Chi tiết quy trình (SCR-42, MS01.01/.02/.03) — mã BM-xx / Checklist xx là link mở Thiết kế, quay lại về
  Chi tiết quy trình; biểu mẫu Dừng hoạt động mở ở chế độ chỉ xem. Ô "Biểu mẫu sử dụng" của luật hiển thị (SCR-44) lấy biểu mẫu Hoạt động (Mã - Tên).
  `tools/capture.mjs` có 10 màn trang "Quản lý E-Form".
- **Khoản đầu tư** (T11, plan `docs/dtms/prototype-KDT-chuan-bi.md` v0.3): Khoản đầu tư & Dự án › Khoản đầu tư (`#/kdt`, route cũ `#/ph/kdt` tự chuyển).
  KĐT là đối tượng cha (D-12) như ĐXMS. Bước B1: Danh sách KĐT (SCR-54 — 13 KĐT mẫu, trạng thái suy từ hồ sơ, Nhóm KĐT "Chưa xác định" tới bước 12,
  tìm kiếm + tìm kiếm nâng cao), Thêm mới / Chỉnh sửa (SCR-55 — không có trường Quy trình, Lưu không khởi tạo quy trình; Lĩnh vực / Loại KĐT /
  Tính chất tài sản lấy từ DMDC, khoá khi đã có hồ sơ), Chi tiết (SCR-56), Tạo hồ sơ KĐT (khuôn SCR-25 `#/kdt/<mã>/tao-ho-so`, Quy trình khoá
  "MS13 · MS14 · MS15 — hệ thống xác định sau bước 12"). Mã đầu tiên KĐT-2026-0032.
  Bước B2: Lưu hồ sơ KĐT start luồng MS13-TO BE (`D.flows.MS13`) và mở bước 01; task 1–10 dùng lại màn MS01 với nhãn KĐT; bước 10 chốt tổng mức vốn →
  Ban Tài chính (Thu, SCR-57 xác nhận TSCĐ) ‖ TTMS (Lan, SCR-58 xác nhận 04 yếu tố + kết quả phân luồng); đủ hai OK → cổng "thuộc MS13?"
  (ngưỡng KĐT của SCR-40), cổng báo giá, cổng gộp BM-00. Không thuộc MS13 → hồ sơ "Đã chuyển luồng", hồ sơ mới MS14 của cùng KĐT, màn Thông báo
  chuyển luồng `#/kdt/<mã>/chuyen-luong` (SCR-66).
  Bước B3: dự thảo 14–16 và tờ trình chủ trương BM-01 + Checklist 01 theo mẫu KĐT (SCR-59, 36–37), chọn CQCM + đơn vị chủ trì và trình (SCR-60, 38–39;
  kiểm tra trước khi gửi Không đạt thì trả lại ngay tại bước 39); quy trình con 41 chạy khối thẩm định 22–35 (token mang `sub: 41`, timeline tính là bước 41):
  TTMS thẩm định + rà soát danh sách CQCM (SCR-61, 24) ‖ CQCM gửi phiếu nhận xét BM-09 (26), bổ sung / giải trình (28), họp tối đa 02 lần, xác nhận
  Chuyên quản → Chỉ huy, cập nhật, báo cáo, kết luận (SCR-62, 29–35); bộ đếm vòng check / lần họp theo giai đoạn (`vars.chk`, `vars.meet`); ký thẩm định (42)
  và Thủ trưởng ký duyệt chủ trương (44) qua hộp thoại trình ký.
  Bước B4: hồ sơ KĐT — AI gợi ý từ chủ trương đã duyệt (45), Tờ trình BM-03 + Phụ lục thuyết minh + Checklist 02 (SCR-64, 46–47), chọn CQCM và trình (SCR-60, 48),
  quy trình con 49 chạy lại khối thẩm định (phiếu CQCM là BM-10, bộ đếm riêng giai đoạn KĐT), Báo cáo kết quả thẩm định BM-14 + dự thảo Quyết định BM-18 (SCR-65, 51 —
  thông qua / chưa thông qua → 52 → 53 → 46), Thủ trưởng ký BM-18 (54) → KĐT "Đã phê duyệt", nút "Tạo gói thầu" mờ ở Chi tiết KĐT. Nhánh gộp trên KĐT-2026-0031
  (chạy lại hồ sơ mẫu HS-2026-0031): AI lập dự thảo, BM-00 (SCR-59, 17–18), xin ý kiến Chỉ huy (19–20), chọn CQCM (SCR-60, 21), khối thẩm định trực tiếp (giai đoạn GOP),
  ĐVĐX trình ký (55), Thủ trưởng ký BM-00 (56). Không ký BM-18 / BM-00 → về cổng gộp (theo BPMN). Văn bản đầu ra: BM-01, BM-14, BM-18 / BM-00.
  Bước B5: Chi tiết hồ sơ KĐT `#/ho-so-kdt/<mã>` (khuôn SCR-20: Thông tin chung có Mã KĐT, nhóm, nhánh, bộ đếm thẩm định theo giai đoạn; Quy trình MS13 theo nhánh;
  văn bản đầu ra; Lịch sử) và Chi tiết BPMN trang MS13-TO BE / MS14-TO BE tô bước hiện tại (việc trong quy trình con 41 / 49 tô cả bước quy trình con và bước
  của khối thẩm định). Mã hồ sơ ở Danh sách hồ sơ của KĐT, Thông báo chuyển luồng, Giám sát tiến trình, Việc của tôi mở màn này. Việc của tôi: cột "Mã ĐXMS / KĐT",
  13 việc đã xử lý trên hồ sơ KĐT mẫu. Giám sát tiến trình: 13 hồ sơ KĐT (MS13 / MS14). `tools/capture.mjs` có trang "Khoản đầu tư" 46 màn (tổng 143).
  Công cụ demo có bộ "KĐT-2026-0032 · MS13" (cảnh K1–K10, 7 nhánh phụ; K10 = tổng kết, mở Chi tiết KĐT đã phê duyệt).
  KĐT và hồ sơ KĐT tạo trên prototype nằm trong trạng thái luồng (Reset luồng xoá như ĐXMS).
- Trạng thái lưu trong localStorage của trình duyệt. Dùng "Reset luồng" để chạy lại từ đầu.

## Cấu trúc

| File | Nội dung |
|---|---|
| `js/bpmn-tasks.js` | 61 task + 10a, 10b sinh tự động từ trang MS01 v1.1 bằng `node tools/bpmn-extract.mjs` (tên, actor, biểu mẫu, việc thực hiện, số task cũ). Không sửa tay |
| `js/bpmn-tasks-ms13.js` | Luồng trang MS13-TO BE: 64 task, 27 cổng (câu hỏi = ô chữ cạnh hình thoi), 6 sự kiện, 118 mũi tên nguồn → đích + nhãn; sinh bằng `node tools/bpmn-flow-extract.mjs`. Không sửa tay |
| `js/kdt.js` | Khoản đầu tư: SCR-54/55/56 + Tạo hồ sơ KĐT (khuôn SCR-25), SCR-66. Chi tiết hồ sơ KĐT (SCR-20) nằm trong `screens.js` (`kdtCaseDetail`) |
| `js/ycbg.js` | Yêu cầu báo giá ĐXMS SCR-73/74 (`#/ycbg`) và 5 tab của SCR-29 Chi tiết ĐXMS (T16 B1); dữ liệu suy từ bước của hồ sơ. T16 B2: dùng chung cho KĐT — YCBG KĐT SCR-76/77 (`#/ycbg-kdt`), tab Căn cứ / Tồn kho / YCBG của SCR-56 |
| `js/kdt-b2.js` | T16 B2: Danh sách hồ sơ KĐT SCR-75 (`#/ho-so-kdt`), tab Phân loại & định danh, Thành phần tham gia, Kết quả & triển khai của SCR-56 Chi tiết KĐT |
| `js/thau.js` | T16 B2 Quản lý thầu (màn tĩnh, D-17): KHLCNT SCR-78…80 (`#/khlcnt`), gói thầu SCR-81/82 (`#/goi-thau`), nhà thầu & rủi ro SCR-83 (`#/nha-thau`); KHLCNT tạo / điều chỉnh lưu ở localStorage `dtms-proto-thau`; `Thau.kit` = khuôn danh sách / bảng / card / tab dùng chung cho B3 |
| `js/hop-dong.js` | T16 B3 Quản lý hợp đồng (tĩnh, D-22): SCR-84 danh sách + Nhập hợp đồng (`#/hop-dong`), SCR-85 thêm mới từ KQLCNT (`#/hop-dong/create[/<gói>]`), SCR-86 chi tiết 10 tab theo MS22 / MS23 / MS24 (Thêm phụ lục, Tạo hồ sơ thanh toán), SCR-87 thỏa thuận khung (`#/thoa-thuan-khung`); localStorage `dtms-proto-hop-dong` |
| `js/thong-bao.js` | T16 B3 Thông báo theo source `notification-template` / `notification-channel`: SCR-88/89 mẫu thông báo (`#/mau-thong-bao`), SCR-90 kênh (`#/kenh-thong-bao`), SCR-91 trigger = bảng BE `notification_event_config` (`#/trigger-thong-bao`); localStorage `dtms-proto-thong-bao` |
| `js/bao-cao.js` | T16 B3 Tổng quan SCR-92 (`#/tong-quan`, lọc + 7 tab) và Báo cáo SCR-93 (`#/bao-cao/<nhóm>`, khuôn chung + 14 báo cáo + KPI theo bước) theo hr-tools `report-dashboard`; số liệu hợp nhất từ ĐXMS / KĐT / KHLCNT / gói / HĐ |
| `js/bpmn-diagram.js` | Hình vẽ trang MS01 v1.1 (toạ độ, màu, tên task; đã bỏ ghi chú N0x/Q0x) sinh bằng `node tools/bpmn-diagram-extract.mjs`. Không sửa tay |
| `js/bpmn-view.js` | Vẽ BPMN bằng SVG cho màn Xem BPMN (kéo/cuộn để di chuyển, phóng to; tô bước đang xử lý); `?capture=1` vẽ bản gọn cho Figma |
| `js/data.js` | Persona, menu 12 module Backlog (D-15; mục cũ ở `D.oldMenu`), điều hướng luồng, hồ sơ mẫu, điểm ❓ |
| `js/flow.js` | Bộ máy luồng: token song song, join, cổng, bộ đếm vòng, đồng hồ NLV cho KPI. Định nghĩa luồng theo quy trình của hồ sơ (`D.flows[D.familyOf(process)]`, `Flow.def()` / `Flow.tasks()`): MS01.0x dùng `D.flow`, MS13 dùng `D.flows.MS13`; quy trình con (`sub`), bộ đếm theo giai đoạn (`bump`), cổng đọc lựa chọn trên màn (`when(vars, ui)`) |
| `js/ui.js`, `js/screens.js`, `js/app.js` | Helper giao diện, các màn hình, khung và router |
| `js/eform-run.js` | Bộ chạy eForm (bản rút gọn của `vht-e-form`): đọc schema Camunda Form, FEEL rút gọn, dialog 85vw Hủy / Lưu nháp / Xác nhận |
| `js/eforms/ms01.js`, `js/eforms/ms13.js` | eForm của từng user task MS01.0x / MS13 (B0.4 (2)): schema, ghi chú (i), Văn bản đầu ra, output mapping (`write`), DX-01 (`gate`); B0.5 sửa theo comment Figma (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2d–2e), test `e2e/b05-comment.spec.mjs` |
| `js/eforms/vars.js` | Biến quy trình cho eForm (giả lập task / service task / BE ghi), mẫu Văn bản đầu ra, kiểm tra phía BE khi submit (G3, E3) |
| `js/task-forms.js` | Nối nút hành động → eForm hoặc dialog nhận xét → trình ký → hoàn thành (thay `bodies.js` cũ) |
| `js/catalog.js` | Danh mục dùng chung: cấu hình từng danh mục (như `CatalogConfig` của ecat), trang Tổng quan, khuôn danh sách + hộp thoại + xác nhận |
| `assets/app.css` | Giao diện theo layout VHT của `fe/repo-khcn-core-fe` (topbar, sidebar, preset `#EE0033`) |
| `test/flow.test.mjs` | Test bộ máy luồng (node:test): `npm run test:unit` |
| `e2e/*.spec.mjs`, `playwright.config.mjs` | Test Playwright bấm thật trên Chromium: mở từng màn, chạy luồng chính tới phê duyệt, nhánh phụ; `ms01-02-03.spec.mjs` chạy hồ sơ MS01.02 / MS01.03; `task-eform.spec.mjs` mở eForm của mọi task. `npm run test:e2e` |
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
| 6 (T7) | Cập nhật theo BPMN chuẩn MS01 v1.1 (61 task); xuất lại Figma 48 màn (`gen.mjs reset` → `setup`/`sections` → `batch` → `links`) | Code + test xong; Figma xuất lại ở bước 9 |
| 7 (T7) | Chọn quy trình khi tạo ĐXMS (2026-09-28): SCR-25, lọc căn cứ ở task 01, cổng kiểm tra khớp, 10a/10b (SCR-26), End “Đã chuyển quy trình”, nhánh B-3e, P-26; `capture.mjs` 53 màn | Code + test xong (unit 20, e2e 19); Figma ở bước 9 |
| 8 (T6) | MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098) theo `docs/dtms/prototype-MS01-02-03-chuan-bi.md`: dữ liệu theo hồ sơ, biến thể SCR-03/07/08/10/12/15/16/19/20, màn mới SCR-23, SCR-24, bộ demo + nhánh B-3a…d, ❓ P-17…P-25 lọc theo quy trình | Code + test (xem plan §10); Figma ở bước 9 |
| 9 | Xuất lại Figma `FBFwYisdvDOjvJyRWIQbT3` (2026-09-30): **165 màn**, 8 page (01 Demo MS01.01, 02 Khung, 03 Nhánh phụ, 04 Quản trị quy trình, 05 DMDC, 06 E-Form, 07 Khoản đầu tư, 08 MS01.02 & MS01.03 — 22 màn: SCR-25/03/07/16/19/20 của 0124; SCR-25/03/06/08/10/11/15/23/24/20 + B-3a/B-3b của 0098), 23 component Sidebar theo menu đang mở, 120 prototype link, 9 flow, Cover cập nhật. Cách làm: xem "Xuất Figma" dưới | Xong |
| 10 (T16 B4) | Xuất lại Figma (2026-10-09): **267 màn**, 11 page (thêm 09 Quản lý ĐXMS, 10 KĐT & Thầu, 11 Hợp đồng · Thông báo · Báo cáo — Backlog W1_T10), Topbar + 47 Sidebar component, 158 link (0 lỗi), 12 flow, Cover v0.3. Section cũ được dọn frame trước khi dựng lại. Comment Figma chưa resolve (MCP không có API comment; cần FIGMA_TOKEN) | Xong, chờ review |

**Xuất Figma** (dữ liệu ~2,3 MB vượt 50 KB/lần gọi `use_figma`, nên đi qua ảnh dữ liệu):
1. `node tools/capture.mjs <cap>` → `node tools/compact.mjs <cap>` → `node tools/gen.mjs <cap> bundle > bundle.json` → `node tools/figma-pack.mjs bundle.json data.png` (PNG xám không nén, có kiểm khứ hồi).
2. `gen.mjs <cap> pinit` → tạo page + hình `__data` (page 99) → MCP `upload_assets` với `nodeIds=[<id __data>]`, POST `data.png`.
3. `gen.mjs <cap> pcomp <id __data>` → Topbar + Sidebar theo từng skey + runtime `__runtime2`; ghi id vào `ids.json` (`data`, `top`, `sides`, `runtime`).
4. `gen.mjs <cap> sections "<page>"` cho từng page (section dài xuống hàng sau 12 màn) → `gen.mjs <cap> plan 15` chia lô → `gen.mjs <cap> pscreens ids.json <i,j,…>` mỗi lô (mã ~600 byte, đọc dữ liệu từ ảnh).
5. Nối link theo tên `link→<id>` trong từng page + đặt flow (xem `links()` trong `gen.mjs`).
