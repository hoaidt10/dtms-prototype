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
    khởi tạo quy trình ngay và mở task 01 (❓ P-26). Hồ sơ Điều chỉnh khởi tạo luồng **MS02** (T21): 61 bước trang MS02 ver1.1, dùng lại bộ máy MS01, rẽ MS02.01 / .02 / .03 theo giá trị sau điều chỉnh và căn cứ của ĐXMS cũ.
    Bước 1 xem ĐXMS cũ (văn bản phê duyệt, KHLCNT / gói thầu / hợp đồng), bước 4 nhập lý do, phạm vi, bảng trước – sau và giá trị sau điều chỉnh;
    bước 7 / 10 có kết quả cũ chỉ xem; văn bản đầu ra là bản điều chỉnh. Phê duyệt xong: ĐXMS "Đã phê duyệt (điều chỉnh lần n)", giá trị hiệu lực = giá trị sau điều chỉnh.
    **Công cụ demo** bộ "ĐXMS-2026-0103 · Điều chỉnh MS02" (T21 B3): cảnh A1–A6 luồng MS02.02 (tạo hồ sơ, bước 4, kết quả cũ, 48 chọn sẵn Không báo cáo, BM-08, tổng kết ĐXMS
    điều chỉnh lần 1), A7–A8 chuyển ngưỡng xuống 150 tỷ → MS02.03 (BM-09, ký 38 ‖ 39), A9–A10 ĐXMS-2026-0072 (MS01.03, 152 tỷ) tăng 172 tỷ → MS02.01 (BM-01, báo cáo Tập đoàn);
    giá trị sau điều chỉnh của cảnh đặt sẵn như đã xác nhận ở bước 4 (`pre.adj`). 7 nhánh phụ: Chỉ huy ĐVĐX không đồng ý (13 → 14 → 12), TTMS không đồng ý DS CQCM (17 → 16),
    giải trình vòng 3/2 → họp (28 → 29–34), Phó TGĐ không đồng ý BM-05 (47 → 25 → 26), TTMS đổi lựa chọn 48 sang Có báo cáo, Thủ trưởng yêu cầu hoàn chỉnh (60 → 25 → 26),
    ĐXMS-2026-0089 (< 160 tỷ) Phó TGĐ không đồng ý BM-09 (39 → 25). Việc của tôi có 8 việc đã xử lý trên hai hồ sơ Điều chỉnh mẫu HS-2026-0126 / 0112.
    `tools/capture.mjs` trang "Điều chỉnh ĐXMS · MS02" 19 màn; chụp riêng: `node tools/capture.mjs <thư-mục> "Điều chỉnh ĐXMS · MS02"`.
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
  đã tạo trên prototype), mở danh sách điểm ❓, **Khôi phục dữ liệu mẫu** (DMDC, E-Form, thầu, hợp đồng, thông báo — các dữ liệu "Reset luồng" không xoá; cả quy trình và luật hiển thị), đổi ca **Đồng bộ từ Camunda**.
  Bộ KĐT-2026-0032 · MS13 xem mục Khoản đầu tư. Thầu, Thông báo, Tổng quan, Báo cáo là màn tĩnh (D-17) nên không có bộ demo. Hợp đồng: HĐ-2026-0052 có 7 bộ demo (mục Hợp đồng chạy luồng), hợp đồng mẫu khác xem tĩnh (D-48).
- **Điểm ❓:** bấm nhãn tím `❓ P-xx` trên màn để ghi ý kiến. Trang `#/cho-chot` tổng hợp mọi điểm (P-01…P-16, P-22, P-26, P-27…P-36 của DMDC, P-37…P-41 của Quản trị quy trình, P-43…P-49 của E-Form, P-50…P-62 và P-90…P-95 của Khoản đầu tư, …) và xuất ra Markdown/CSV.
- **Hợp đồng chạy luồng** (T25, `docs/dtms/prototype-T25-hop-dong-chuan-bi.md`): HĐ-2026-0052, mỗi quy trình là hồ sơ con (`flow.js` kho hồ sơ, D-47). MS22 Tạo hồ sơ ở tab Thương thảo & ký kết → ký xong tự có hồ sơ theo dõi MS23 → nhà thầu thông báo (công cụ demo) → ghi nhận ở Việc của tôi → tự sinh MS23.02 của đợt; MS23.01 Tạo hồ sơ ở tab Văn bản phát sinh; MS23.03 từ dòng Luồng con cần khởi tạo, sinh MS23.04; MS24 Tạo hồ sơ thanh toán khi mốc điều kiện có ngày thực tế. Bảng ánh xạ bước ↔ màn ↔ Backlog ở plan §10.
- **Danh sách Phân hệ** (T24 D-42, SCR-101 `#/phan-he`): logo topbar về màn này; thẻ / bảng, nhớ lựa chọn. Danh mục dùng chung mở sidebar riêng (`D.dmdcMenu`), Đầu tư mua sắm mở Việc của tôi, phân hệ khác mở Đang phát triển.
- **Danh mục dùng chung** (T8; T24 D-42 rời menu ĐTMS sang phân hệ riêng, route cũ giữ): mục con Tổng quan (`#/dmdc`, SCR-30) và từng danh mục (`#/dmdc/<danh-mục>`),
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
  Chuyên viên TTMS.
- **Quản lý quy trình** (T24 D-46, spec `e2e/quy-trinh-t24.spec.mjs`):
  - **Luật quyết định nút:** nút màn xử lý việc lấy theo luật đang Kích hoạt (quy trình + bước, màn Xử lý công việc, vai), Tên hiển thị là nhãn nút. MS02, MS13, MS14 chưa có luật mẫu nên giữ nguyên nút; bước 10a chưa có luật cũng giữ nút. Chi tiết hồ sơ không có nút.
  - **Đồng bộ từ Camunda:** lần đầu MS13, MS14, MS01.03 có phiên bản mới, MS14 phiên bản 1 Dừng hoạt động, sinh 2 luật còn thiếu của MS01.03; lần sau không đổi. Nút demo nổi › Đồng bộ từ Camunda chọn ca Đang có phiên, Lỗi Camunda. Reset luồng đưa quy trình và luật về mẫu.
  - **Quyền:** `D.perms` / `D.can` theo mã của FE (QT, HTN, DMHS / DMHD, DTO, GS). Thử bằng tài khoản **Cao Thị Hạnh** (Người dùng quản trị quy trình): không đồng bộ, không lịch sử phiên bản, Ma trận chỉ xem.
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
- **Khoản đầu tư** (T11 plan `docs/dtms/prototype-KDT-chuan-bi.md`; luồng theo **BPMN 12/10, 78 bước** — T18 plan `docs/dtms/prototype-T18-ms13-bpmn-1210-chuan-bi.md`,
  nguồn `ĐTMS-121026.drawio` trang **MS13**, diễn giải DG-MS13): Khoản đầu tư & Dự án › Khoản đầu tư (`#/kdt`, route cũ `#/ph/kdt` tự chuyển).
  KĐT là đối tượng cha (D-12) như ĐXMS. Bảng bước BPMN ↔ màn ↔ WBS: plan KĐT §10.
  - **Màn KĐT:** Danh sách KĐT (SCR-54 — 13 KĐT mẫu, trạng thái suy từ hồ sơ, Nhóm KĐT "Chưa xác định" tới khi xác nhận xong, tìm kiếm + tìm kiếm nâng cao),
    Thêm mới / Chỉnh sửa (SCR-55 — không có trường Quy trình, Lưu không khởi tạo quy trình; Lĩnh vực / Loại KĐT / Tính chất tài sản lấy từ DMDC, khoá khi đã có hồ sơ),
    Chi tiết (SCR-56, các tab T16 B2), Tạo hồ sơ KĐT (khuôn SCR-25 `#/kdt/<mã>/tao-ho-so`, Quy trình khoá "MS13 · MS14 · MS15 — hệ thống xác định"),
    Thông báo chuyển luồng (SCR-66), Chi tiết hồ sơ KĐT `#/ho-so-kdt/<mã>` (khuôn SCR-20) và Chi tiết BPMN trang MS13 / MS14 bản 12/10 tô đúng bước đang xử lý.
    Mã đầu tiên KĐT-2026-0032.
  - **Lập hồ sơ (1–17):** Lưu hồ sơ KĐT start `D.flows.MS13` ở bước 01; bước 1–10 dùng lại form MS01 với nhãn KĐT; bước 10 chốt tổng mức vốn → Ban Tài chính (Thu, SCR-57
    xác nhận TSCĐ, 11) ‖ TTMS (Lan, SCR-58 xác nhận 04 yếu tố, 12) → **13 xác định thẩm quyền** (service, đọc danh mục **SCR-100 Phân cấp thẩm quyền KĐT** — D-33, giả lập
    P-90 theo UQ-GUQ §1.2) → cổng "thuộc MS13?" (ngưỡng KĐT của SCR-40; không thuộc → hồ sơ "Đã chuyển luồng" + hồ sơ MS14 mới của cùng KĐT) → dự thảo 15–17 →
    cổng gộp BM-00 (Trang bị nội bộ + Nguyên chiếc + mức vốn MS13).
  - **Hai giai đoạn (KĐT-2026-0032):** BM-01 + Checklist 01 (39–40), chọn CQCM (41), CQCM chủ trì xác nhận danh sách (42), trình (43), HT/AI kiểm tra (44, Không đạt → 39),
    mở vòng BM-01 (45) → **khối chung 25–38** → TTMS thẩm định và hoàn chỉnh chủ trương (46) → cổng cấp duyệt (tính lại thẩm quyền) → ký thẩm định (47) → TGĐ VHT ký (48) →
    BM-03 + Phụ lục + Checklist 02 (49–51), chọn CQCM (52), xác nhận DS (53), mở vòng BM-03 (54) → khối chung → thẩm định và hoàn chỉnh KĐT (55) → Chỉ huy ký tờ trình BM-03 (56)
    → TTMS ký BM-14 + dự thảo BM-18 (57; không thông qua → 58 → 59 → 50) → TGĐ VHT ký Quyết định BM-18 (60) → KĐT "Đã phê duyệt", nút "Tạo gói thầu" ở Chi tiết KĐT.
  - **Gộp BM-00 (KĐT-2026-0031, chạy lại hồ sơ mẫu HS-2026-0031):** AI dự thảo (18), lập BM-00 (19), xin ý kiến Chỉ huy (20–21), chọn CQCM (22), xác nhận DS (23),
    Chỉ huy ký phiếu yêu cầu thẩm định (24) → khối chung (vòng BM-00) → cổng cấp duyệt → TTMS ký BM-14 + dự thảo BM-18 (61) → TGĐ VHT ký BM-00 + BM-18 (62); không đồng ý → 19.
  - **Khối chung 25–38** (D-32, không còn quy trình con): một khối cho ba vòng BM-00 / BM-01 / BM-03 (`vars.td`); cổng "đủ điều kiện thẩm định?" (chưa → 25 AI → 26 ĐVĐX sửa →
    chọn lại CQCM đúng vòng), TTMS thẩm định (27) ‖ CQCM phối hợp (28–29), bổ sung / giải trình (31), họp tối đa 02 lần (32–33), xác nhận Chuyên quản → Chỉ huy, cập nhật (34–36),
    báo cáo, Thủ trưởng kết luận (37–38). Bộ đếm vòng check / lần họp riêng mỗi vòng, giữ khi trình lại (`vars.chk`, `vars.meet`).
  - **Khối ký chung 75–78** (D-34; Camunda: call activity `DTMS_KY_CHUNG`): nút ký của các bước ký 24, 47, 48, 56, 57, 60, 61, 62 (P-91) mở hộp thoại Trình ký = bước 75
    "Chọn hình thức ký" (điểm tự quyết B3-1). Hồ sơ **Mật** (bước 4, mặc định theo KĐT) khoá VOffice → 77 người ký ký bản cứng → 78 người phụ trách hồ sơ cập nhật kết quả +
    bản scan (tài liệu bắt buộc) → về bước ký, đi tiếp nhánh Đồng ý. Không Mật chọn VOffice (76: gửi, nhận callback, tự đi tiếp) hoặc Bản cứng (77 → 78).
    Gửi VOffice lỗi (giả lập P-94) → việc "Gửi lại VOffice" ở 76 cho người trình. Văn bản đầu ra (BM-01, BM-14, BM-18, BM-00) chỉ có khi khối ký xong.
  - **Tuyến Tập đoàn 63–74** (T18 B4, người dùng mở D-8 12/10): cổng cấp duyệt (G23 chủ trương / G27 KĐT / G30 gộp) ra Tập đoàn ghi loại hồ sơ trình (`vars.tdKind`)
    → AI dự thảo công văn (63) → ĐVĐX hoàn thiện (64) → TGĐ VHT ký công văn (65, qua khối ký; không đồng ý → 64) → chuyển hồ sơ (66) → các Ban Tập đoàn gửi phiếu nhận xét
    BM-09 / BM-10 (67) → ĐVĐX tiếp thu, lập BM-06 (68) → TGĐ VHT ký trình lại (69, qua khối ký) → Ban ĐTXD kiểm tra (70; chưa đạt → 68) → chủ trương: các Ban ký BM-01 (71) |
    KĐT / gộp: Ban ĐTXD lập BM-14 + dự thảo BM-18 (72) → TGĐ Tập đoàn ký (73; không đồng ý → 68) → lưu kết quả (74) → chủ trương về lập hồ sơ KĐT (49), KĐT / gộp kết thúc.
    Người Tập đoàn = tài khoản giả lập "Ban ĐTXD Tập đoàn" (P-96). KĐT "Đang trình Tập đoàn" / "Tập đoàn thẩm định, phê duyệt"; văn bản đầu ra thêm Công văn trình, BM-06 và
    văn bản cấp Tập đoàn. ❓ P-96…P-99.
  - **Công cụ demo** bộ "KĐT-2026-0032 · MS13": cảnh K1–K10 (K9 = nhánh gộp KĐT-2026-0031, K10 = tổng kết mở Chi tiết KĐT đã phê duyệt) và 16 nhánh phụ:
    chuyển MS14, 04 yếu tố Không OK, không đồng ý DS CQCM, họp 02 lần chưa thống nhất, TGĐ không đồng ý chủ trương, BM-14 không thông qua, TGĐ không đồng ý hồ sơ gộp,
    HT/AI kiểm tra Không đạt, chưa đủ điều kiện thẩm định, chủ trương thuộc Tập đoàn, **hồ sơ Mật ký bản cứng (47 → 77 → 78 → 48)**, **gửi VOffice lỗi → Gửi lại**;
    tuyến Tập đoàn (chủ trương KHCN thuộc Tập đoàn — bản chụp danh mục): **các Ban nhận xét → tiếp thu, ký trình lại (67–69)**, **Ban ĐTXD chưa đạt → bổ sung (70 → 68)**,
    **TGĐ Tập đoàn ký chủ trương → lập hồ sơ KĐT (73 → 74 → 49)**, **hồ sơ gộp KĐT-2026-0031 thuộc Tập đoàn (72 → 73 → kết thúc)**.
  - Việc của tôi: cột "Mã ĐXMS / KĐT", 13 việc đã xử lý trên hồ sơ KĐT mẫu; Giám sát tiến trình: 13 hồ sơ KĐT (MS13 / MS14). KĐT và hồ sơ KĐT tạo trên prototype nằm trong
    trạng thái luồng (Reset luồng xoá như ĐXMS). Điểm ❓ của KĐT: P-50…P-62 (T11, đã rà theo bản 12/10), P-90…P-99 (T18).
  - `tools/capture.mjs` trang "Khoản đầu tư" 72 màn (số bước 12/10, 5 màn khối ký chung, 14 màn tuyến Tập đoàn); chụp riêng trang: `node tools/capture.mjs <thư-mục> "Khoản đầu tư"`.
- Trạng thái lưu trong localStorage của trình duyệt. Dùng "Reset luồng" để chạy lại từ đầu.

## Cấu trúc

| File | Nội dung |
|---|---|
| `js/bpmn-tasks.js` | 61 task + 10a, 10b sinh tự động từ trang MS01 v1.1 bằng `node tools/bpmn-extract.mjs` (tên, actor, biểu mẫu, việc thực hiện, số task cũ). Không sửa tay |
| `js/bpmn-tasks-ms13.js` | Luồng trang **MS13 bản 12/10** (`ĐTMS-121026.drawio`, T18 D-31): 78 bước, 36 cổng (câu hỏi = nhãn hình thoi; dấu "+" đè lên hình thoi = cổng song song), 9 sự kiện (S = bắt đầu luồng chính, S2 = "Đến bước trình ký" của khối ký chung 75–78), 152 mũi tên nguồn → đích + nhãn; sinh bằng `node tools/bpmn-flow-extract.mjs`. Không sửa tay |
| `js/bpmn-tasks-ms02.js` | Luồng trang **MS02 ver1.1** bản 12/10 (T21 D-38): 61 bước, 29 cổng, 119 mũi tên — trùng topo MS01 v1.1, không 10a / 10b; trang còn bản MS01 cũ nằm dưới nên tool lấy hình vẽ sau. Sinh bằng `node tools/bpmn-flow-extract.mjs`. Không sửa tay |
| `js/kdt.js` | Khoản đầu tư: SCR-54/55/56 + Tạo hồ sơ KĐT (khuôn SCR-25), SCR-66. Chi tiết hồ sơ KĐT (SCR-20) nằm trong `screens.js` (`kdtCaseDetail`) |
| `js/ycbg.js` | Yêu cầu báo giá ĐXMS SCR-73/74 (`#/ycbg`) và 5 tab của SCR-29 Chi tiết ĐXMS (T16 B1); dữ liệu suy từ bước của hồ sơ. T16 B2: dùng chung cho KĐT — YCBG KĐT SCR-76/77 (`#/ycbg-kdt`), tab Căn cứ / Tồn kho / YCBG của SCR-56 |
| `js/kdt-b2.js` | T16 B2: Danh sách hồ sơ KĐT SCR-75 (`#/ho-so-kdt`), tab Phân loại & định danh, Thành phần tham gia, Kết quả & triển khai của SCR-56 Chi tiết KĐT |
| `js/thau.js` | T16 B2 Quản lý thầu (màn tĩnh, D-17): KHLCNT SCR-78…80 (`#/khlcnt`), gói thầu SCR-81/82 (`#/goi-thau`), nhà thầu & rủi ro SCR-83 (`#/nha-thau`); KHLCNT tạo / điều chỉnh lưu ở localStorage `dtms-proto-thau`; `Thau.kit` = khuôn danh sách / bảng / card / tab dùng chung cho B3 |
| `js/eforms/ms22.js`, `ms23.js`, `ms23-01.js`, `ms23-02.js`, `ms23-nt-tl.js`, `ms24.js` | T25: eForm + biến, tài liệu, văn bản đầu ra của từng quy trình Hợp đồng (`EForms.hdBy`) |
| `js/hop-dong.js` | T16 B3 Quản lý hợp đồng (T25: HĐ-2026-0052 đọc từ hồ sơ con, hợp đồng mẫu khác tĩnh — D-48): SCR-84 danh sách + Nhập hợp đồng (`#/hop-dong`), SCR-85 thêm mới từ KQLCNT (`#/hop-dong/create[/<gói>]`), SCR-86 chi tiết 10 tab theo MS22 / MS23 / MS24 (Thêm phụ lục, Tạo hồ sơ thanh toán), SCR-87 thỏa thuận khung (`#/thoa-thuan-khung`); localStorage `dtms-proto-hop-dong` |
| `js/thong-bao.js` | T16 B3 Thông báo theo source `notification-template` / `notification-channel`: SCR-88/89 mẫu thông báo (`#/mau-thong-bao`), SCR-90 kênh (`#/kenh-thong-bao`), SCR-91 trigger = bảng BE `notification_event_config` (`#/trigger-thong-bao`); localStorage `dtms-proto-thong-bao` |
| `js/bao-cao.js` | T16 B3 Tổng quan SCR-92 (`#/tong-quan`, lọc + 7 tab) và Báo cáo SCR-93 (`#/bao-cao/<nhóm>`, khuôn chung + 14 báo cáo + KPI theo bước) theo hr-tools `report-dashboard`; số liệu hợp nhất từ ĐXMS / KĐT / KHLCNT / gói / HĐ |
| `js/bpmn-diagram.js` | Hình vẽ trang MS01 v1.1 (toạ độ, màu, tên task; đã bỏ ghi chú N0x/Q0x) sinh bằng `node tools/bpmn-diagram-extract.mjs`. Không sửa tay. Nguồn theo trang (D-31): MS01 / MS01 v1.1 đọc `ĐTMS.drawio`; MS02 ver1.1 (`bpmn-diagram-ms02.js`, T21 D-38), MS13 / MS14 (`bpmn-diagram-ms13.js`, `-ms14.js`) đọc `ĐTMS-121026.drawio` |
| `js/bpmn-view.js` | Vẽ BPMN bằng SVG cho màn Xem BPMN (kéo/cuộn để di chuyển, phóng to; tô bước đang xử lý); `?capture=1` vẽ bản gọn cho Figma |
| `js/phan-he.js` | T24 SCR-101 Danh sách Phân hệ (`#/phan-he`), khuôn core-fe `subsystem-list` |
| `js/quy-trinh.js`, `js/ma-tran.js` | Quản lý quy trình SCR-41/42/48 (đồng bộ Camunda T24 Q2) và Ma trận hành động SCR-43…47 (`MaTran.allowed` quyết định nút màn xử lý việc, T24 Q1) |
| `js/data.js` | Persona, mã quyền `D.perms`, menu 12 module Backlog (D-15; mục cũ ở `D.oldMenu`), điều hướng luồng, hồ sơ mẫu, điểm ❓ |
| `js/flow.js` | Bộ máy luồng: token song song, join, cổng, bộ đếm vòng, đồng hồ NLV cho KPI. Định nghĩa luồng theo quy trình của hồ sơ (`D.flows[D.familyOf(process)]`, `Flow.def()` / `Flow.tasks()`): MS01.0x dùng `D.flow`, MS13 dùng `D.flows.MS13` (T18: khối chung theo vòng `td`, bước 13 / cổng cấp duyệt `auth` / `capGate`, tuyến Tập đoàn 63–74 `tdKind` / `tdSend` / `tdResult` (văn bản Tập đoàn ở `vars.tdDocs`), khối ký chung 75–78 `kySign` / `vo` / `kyReturn` — đích của nút ký giữ ở `vars.ky`, lượt đã ký ở `vars.kyLog`); bộ đếm theo vòng (`bump`), cổng đọc lựa chọn trên màn (`when(vars, ui)`, `run`) |
| `js/ui.js`, `js/screens.js`, `js/app.js` | Helper giao diện, các màn hình, khung và router |
| `js/eform-run.js` | Bộ chạy eForm (bản rút gọn của `vht-e-form`): đọc schema Camunda Form, FEEL rút gọn, dialog 85vw Hủy / Lưu nháp / Xác nhận |
| `js/eforms/ms01.js`, `js/eforms/ms13.js`, `js/eforms/ms02.js` | eForm của từng user task MS01.0x / MS13 (B0.4 (2)); MS02 (T21) dùng lại form MS01 cùng số, riêng bước 1 / 4 / 7 / 10: schema, ghi chú (i), Văn bản đầu ra, output mapping (`write`), DX-01 (`gate`); B0.5 sửa theo comment Figma (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2d–2e), test `e2e/b05-comment.spec.mjs` |
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
| 11 | Xuất lại Figma (2026-10-12): **326 màn**, 13 page (thêm 12 Điều chỉnh ĐXMS · MS02 — 19 màn T21; 13 Luồng mua sắm (T17 · phương án Gộp) — 12 màn SCR-95…98; SCR-99 vào page 05; page 07 Khoản đầu tư 72 màn theo BPMN 12/10 của T18, kèm SCR-100), Topbar + 50 Sidebar component, 196 link, 13 flow, Cover v0.4. Frame cũ dọn hết trước khi dựng | Xong, chờ review |
| 12 (T24, 2026-10-30) | Yêu cầu team BA 30/10: bỏ cột Thao tác 4 danh sách, bỏ Trigger, KĐT ↔ Nhiệm vụ / Đề tài, Danh sách Phân hệ + DMDC riêng, Thầu theo hệ thống cũ (T1–T8), Quản lý quy trình Q1–Q5. Figma chưa xuất lại. Hợp đồng chạy luồng: T25 |
| 13 (T25, 2026-11-02) | Hợp đồng chạy luồng: MS22, MS23, MS23.01…04, MS24 trên HĐ-2026-0052; trang capture "Hợp đồng chạy luồng · T25", page Figma 14 đã khai báo ở `gen.mjs`, chưa xuất Figma. |

**Xuất Figma** (dữ liệu ~2,3 MB vượt 50 KB/lần gọi `use_figma`, nên đi qua ảnh dữ liệu):
1. `node tools/capture.mjs <cap>` (thêm `"<trang>"` để chụp riêng một trang) → `node tools/compact.mjs <cap>` → `node tools/gen.mjs <cap> bundle > bundle.json` → `node tools/figma-pack.mjs bundle.json data.png` (PNG xám không nén, có kiểm khứ hồi).
2. `gen.mjs <cap> pinit` → tạo page + hình `__data` (page 99) → MCP `upload_assets` với `nodeIds=[<id __data>]`, POST `data.png`.
3. `gen.mjs <cap> pcomp <id __data>` → Topbar + Sidebar theo từng skey + runtime `__runtime2`; ghi id vào `ids.json` (`data`, `top`, `sides`, `runtime`).
4. `gen.mjs <cap> sections "<page>"` cho từng page (section dài xuống hàng sau 12 màn) → `gen.mjs <cap> plan 15` chia lô → `gen.mjs <cap> pscreens ids.json <i,j,…>` mỗi lô (mã ~600 byte, đọc dữ liệu từ ảnh).
5. Nối link theo tên `link→<id>` trong từng page + đặt flow (xem `links()` trong `gen.mjs`).
