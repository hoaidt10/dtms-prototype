# Prototype ĐTMS — MS01.01 Phê duyệt ĐXMS

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

## Mở

Mở `index.html` bằng Chrome hoặc Edge. Không cần mạng, không cần build. Font Roboto và icon đã nằm sẵn trong thư mục.

## Dùng

- **ĐXMS và hồ sơ (T12, D-10…D-12):** ĐXMS là đối tượng cha (như nhiệm vụ KHCN), hồ sơ là đối tượng con. Menu Đề xuất mua sắm có
  **Danh sách ĐXMS** (`#/dxms`, SCR-27 theo `task-management`) và **Hồ sơ ĐXMS** (`#/ho-so-dxms`, SCR-02 theo `profile-list`).
  - Tạo ĐXMS: Danh sách ĐXMS › Thêm mới (SCR-28) → Lưu. Chỉ tạo ĐXMS, **không** khởi tạo quy trình; mã `ĐXMS-2026-0117`.
  - Tạo hồ sơ (SCR-25): Chỉnh sửa ĐXMS › Danh sách hồ sơ › **Tạo hồ sơ** (ô ĐXMS khoá), hoặc Hồ sơ ĐXMS › Thêm mới. Chọn **Loại hồ sơ**
    (Phê duyệt ĐXMS → quy trình MS01; Điều chỉnh ĐXMS → MS02; Quy trình chỉ đọc — T29 B1), bấm Lưu: hồ sơ Phê duyệt sinh mã `HS-2026-0117`,
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
- **Chạy luồng:** mở một việc, bấm nút hành động trên hàng tiêu đề, nhập eForm rồi Xác nhận. Hồ sơ đi theo 61 task BPMN MS01 v1.1, có:
  - task 01 chỉ hiện căn cứ hợp với quy trình đã chọn; task 04 cảnh báo mềm nếu giá trị dự kiến lệch ngưỡng;
  - cổng “Giá trị?” sau task 10 (T29 B1): hệ thống đặt luồng con theo Tổng giá trị — dưới ngưỡng .03 đi task 11, từ ngưỡng .01 / .02 đi task 12;
    task 10 có trường Căn cứ đã được phê duyệt (ĐVĐX sửa khi có báo giá cuối cùng, D-77);
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
  MS01.02/.03 §3.4), nhánh phụ (MS01.01: 6 nhánh — T29 B1 bỏ B-3e; MS01.03: B-3a…d), reset luồng (về trước bước Thêm mới ĐXMS; xoá ĐXMS và hồ sơ
  đã tạo trên prototype), mở danh sách điểm ❓, **Khôi phục dữ liệu mẫu** (DMDC, E-Form, thầu, hợp đồng, thông báo — các dữ liệu "Reset luồng" không xoá; cả quy trình và luật hiển thị), đổi ca **Đồng bộ từ Camunda**.
- **Hồ sơ mẫu chạy được (T58, 12/11/2026):** mọi hồ sơ mẫu đang xử lý của MS01.01 / .02 / .03 và MS13 (28 hồ sơ, `Flow.runSample`) — thanh trạng thái
  ở Chi tiết ĐXMS / Chi tiết hồ sơ KĐT có nút theo Luật hiển thị, Việc của tôi có việc đang chờ của mọi vai (`#/chay-mau/<mã hồ sơ>`). Bấm → hồ sơ được tua
  nhanh tới bước đang chờ (giữ mã, tổng mức vốn), mở màn xử lý việc và thực hiện đúng nút vừa bấm. Prototype chạy một hồ sơ một lúc: hồ sơ đang chạy dở
  bị thay (hỏi trước; KĐT giữ lại ở trạng thái lúc đó). GIẢ LẬP: hạng mục, báo giá, ý kiến lấy theo bộ dữ liệu mẫu dùng chung. MS02, MS14 mẫu vẫn tĩnh.
  Dữ liệu T58: ĐXMS-2026-0128…0142 (thẩm định 19 / 20, giải trình 28, ký song song 38 ‖ 39, phê duyệt 60, MS01.02 bước 48, Mật, quá hạn, sau Tập đoàn 58,
  Kho 7, Thầu 10, dừng xử lý, chuỗi điều chỉnh 0141 → 0142 → 0140 lần 2) và KĐT-2026-0034…0040 (thẩm định chủ trương 29, họp lần 2, ký chủ trương quá hạn,
  gộp BM-00 Mật, chủ trương thẩm quyền Tập đoàn 64, hồ sơ KĐT bước 57, KĐT phức tạp MS15 chưa có hồ sơ).
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
  Bước B5 nối vào luồng MS01: luồng con dự kiến ở Thêm mới luồng / hồ sơ, cảnh báo task 04, cổng "Giá trị?" sau task 10 đọc bảng ngưỡng
  (hồ sơ giữ ngưỡng lúc tạo — P-34); Nguồn vốn ở task 04 chọn từ SCR-32; task 08 chọn nhà cung cấp nhận YCBG từ SCR-31, lọc theo ngành hàng
  của hạng mục; bảng báo giá lấy tên, loại tiền từ danh mục. Dữ liệu danh mục lưu riêng (localStorage `dtms-proto-dmdc`), "Reset luồng" không xoá.
- **Quản lý quy trình** (T9; tên theo Backlog, D-15): gồm Quản lý quy trình (`#/quy-trinh`), Ma trận hành động (`#/ma-tran`),
  Giám sát tiến trình (`#/giam-sat-tien-trinh`); route cũ `#/ph/quy-trinh`, `#/ph/ma-tran` tự chuyển sang. Bước B1 dựng Giám sát tiến trình (SCR-48)
  theo `process-monitoring`: chỉ xem, liên kết duy nhất ở cột Mã hồ sơ (mở Chi tiết hồ sơ, quay lại đúng trang). Vai xem được (❓ P-41): Quản trị hệ thống,
  Chuyên viên TTMS.
- **Quản lý quy trình** (T24 D-46, spec `e2e/quy-trinh-t24.spec.mjs`):
  - **Luật quyết định nút:** nút màn xử lý việc lấy theo luật đang Kích hoạt (quy trình + bước, màn Xử lý công việc, vai), Tên hiển thị là nhãn nút. MS02, MS13, MS14 chưa có luật mẫu nên giữ nguyên nút. Chi tiết hồ sơ không có nút.
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
    *(từ T45: 48 kết thúc hồ sơ chủ trương; 49 trở đi chạy trong hồ sơ phê duyệt KĐT riêng — xem mục T45 dưới)*
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
    KĐT / gộp: Ban ĐTXD lập BM-14 + dự thảo BM-18 (72) → TGĐ Tập đoàn ký (73; không đồng ý → 68) → lưu kết quả (74) → chủ trương về lập hồ sơ KĐT (49) *(đã thay ở T45: chủ trương kết thúc hồ sơ chủ trương)*, KĐT / gộp kết thúc.
    Người Tập đoàn = tài khoản giả lập "Ban ĐTXD Tập đoàn" (P-96). KĐT "Đang trình Tập đoàn" / "Tập đoàn thẩm định, phê duyệt"; văn bản đầu ra thêm Công văn trình, BM-06 và
    văn bản cấp Tập đoàn. ❓ P-96…P-99.
  - **Công cụ demo** bộ "KĐT-2026-0032 · MS13": cảnh K1–K10 (K9 = nhánh gộp KĐT-2026-0031, K10 = tổng kết mở Chi tiết KĐT đã phê duyệt) và 16 nhánh phụ:
    chuyển MS14, 04 yếu tố Không OK, không đồng ý DS CQCM, họp 02 lần chưa thống nhất, TGĐ không đồng ý chủ trương, BM-14 không thông qua, TGĐ không đồng ý hồ sơ gộp,
    HT/AI kiểm tra Không đạt, chưa đủ điều kiện thẩm định, chủ trương thuộc Tập đoàn, **hồ sơ Mật ký bản cứng (47 → 77 → 78 → 48)**, **gửi VOffice lỗi → Gửi lại**;
    tuyến Tập đoàn (chủ trương KHCN thuộc Tập đoàn — bản chụp danh mục): **các Ban nhận xét → tiếp thu, ký trình lại (67–69)**, **Ban ĐTXD chưa đạt → bổ sung (70 → 68)**,
    **TGĐ Tập đoàn ký chủ trương → kết thúc hồ sơ chủ trương (73 → 74 → kết thúc; trước T45: → 49)**, **hồ sơ gộp KĐT-2026-0031 thuộc Tập đoàn (72 → 73 → kết thúc)**.
  - Việc của tôi: cột "Mã ĐXMS / KĐT", 13 việc đã xử lý trên hồ sơ KĐT mẫu; Giám sát tiến trình: 13 hồ sơ KĐT (MS13 / MS14) *(T45: 17 — thêm 4 hồ sơ phê duyệt KĐT)*. KĐT và hồ sơ KĐT tạo trên prototype nằm trong
    trạng thái luồng (Reset luồng xoá như ĐXMS). Điểm ❓ của KĐT: P-50…P-62 (T11, đã rà theo bản 12/10), P-90…P-99 (T18).
  - **Theo IA-DXMS** (T31, plan `docs/dtms/prototype-T31-kdt-ia-chuan-bi.md`; INDEX IA-DXMS, D-67…D-71): IA-DXMS là danh sách thành phần màn cho KĐT, nội dung tờ trình theo BM-8.6.5.
    **K1, K2** — SCR-54 lọc thêm Khối → Đơn vị, Người tạo, Nhóm trạng thái, Mật, Ngày tạo; cột Ngày gửi thẩm định, Người tạo, Ngày tạo; SCR-75 lọc thêm CQCM, trạng thái với người
    thẩm định, ngày thẩm định, ngày tờ trình; cả hai có Xuất Excel. **K3** (D-69) — nhãn "Đề tài / dự án" + link Chi tiết đề tài / dự án (SCR-104) ở SCR-54, 55, 56, 75; SCR-104
    thêm KĐT liên quan, tab Gói thầu / Hợp đồng, trường IA dòng 5–7. **K4** (D-68) — SCR-55 card Thông tin đề tài / dự án bóc tách dòng dự toán (khả dụng tính chung ĐXMS + KĐT),
    trường chỉ đọc Loại biểu mẫu / Cấp phê duyệt dự kiến / Hình thức trình ký, Nội dung căn cứ pháp lý. **K4b** — eForm bước 50 thêm mục BM-03 / Phụ lục thuyết minh, bước 39 thêm
    Đánh giá hiệu quả. **K5** — thẻ **Thẩm định của cơ quan chuyên môn** bốn khu ở bước 27, 29, 46, 55 (`js/tham-dinh.js`): hồ sơ của vòng xem trực tuyến, lịch sử theo vòng ×
    lượt (CQCM phối hợp không thấy kết luận, nội dung cơ quan khác — BR-KDT-08-06), Đạt / Không đạt từng nội dung + kết luận hệ thống tính (27), phiếu BM-09 / BM-10 (29),
    tổng hợp vòng (46 / 55), nút **Ghi lại** = Lưu nháp. Không dựng: Hủy thẩm định (DX-09), người thẩm định dự kiến (D-71), Cập nhật người xem (P-189), Chi phí năm (P-202).
    ❓ P-201, P-202. MS14 chưa áp (chưa chạy luồng).
  - **T45 — hai hồ sơ cho một KĐT, nhiều đề tài / dự án** (D-103, D-104; plan `docs/dtms/prototype-T45-kdt-2-ho-so.md`). *Thay mô tả "một hồ sơ chạy 1 → 60" ở các
    mục trên.* Hồ sơ **Phê duyệt chủ trương KĐT** (`kind 'CT'`, mã `HS-2026-<4 số>`) chạy bước 1–48 (hai giai đoạn, BM-01) hoặc 1–38 + 61–62 (gộp BM-00, Phạm vi
    "Chủ trương và KĐT"); TGĐ VHT ký ở 48 hoặc tuyến Tập đoàn của chủ trương → kết thúc hồ sơ, KĐT **Đã phê duyệt chủ trương**; gộp duyệt → KĐT **Đã phê duyệt**, không có hồ sơ KĐT.
    Hồ sơ **Phê duyệt KĐT** (`kind 'KDT'`, mã `HS-2026-<4 số>-2`) do ĐVĐX tạo ở `#/kdt/<mã>/tao-ho-so`: Loại hồ sơ Phê duyệt KĐT, chọn đúng 1 **Hồ sơ chủ trương** đã duyệt (phạm vi
    Chủ trương, chưa hồ sơ KĐT nào dùng), nhập **Tổng mức vốn KĐT** → **Luồng** chỉ đọc tính lại (cùng ngưỡng phân luồng). Lệch luồng chủ trương → thanh vàng trên form, hộp
    "Xác nhận luồng KĐT khác luồng chủ trương" lúc Lưu (Giải trình bắt buộc khi MS13 → MS14), tag **Luồng khác chủ trương** ở Chi tiết hồ sơ và màn xử lý; ra MS15 → chặn Lưu.
    MS13 chạy từ bước 49 (kế thừa biến / văn bản của hồ sơ chủ trương, caption "Bước 1–48 · Kế thừa từ hồ sơ chủ trương …"); MS14 = hồ sơ tĩnh "Đang xử lý" bước 46 (GIẢ LẬP).
    Menu **Hồ sơ khoản đầu tư** tách hai mục: **Hồ sơ chủ trương KĐT** `#/ho-so-ct-kdt` (cột Phạm vi) và **Hồ sơ phê duyệt KĐT** `#/ho-so-pd-kdt` (cột Hồ sơ chủ trương,
    Luồng khác chủ trương); `#/ho-so-kdt` chuyển sang `#/ho-so-ct-kdt`; Chi tiết hồ sơ giữ `#/ho-so-kdt/<mã>`. SCR-56 card Danh sách hồ sơ có Loại hồ sơ / Hồ sơ chủ trương; tab
    Kết quả tách "Kết quả phê duyệt chủ trương" / "Kết quả phê duyệt KĐT". KĐT chọn **nhiều đề tài / dự án** (`nvs`, SCR-55 chọn nhiều; bảng bóc tách có cột Mã đề tài / dự án;
    SCR-54 lọc "có chứa"; SCR-104 liệt kê mọi KĐT có đề tài). Mẫu: cặp CT + KĐT 0028 / 0028-2, 0027 / 0027-2 (quá hạn), 0026 / 0026-2 (MS14, lệch luồng), 0012 / 0012-2
    (đã duyệt); KĐT-2026-0030, 0032 có 2 đề tài. **Cảnh demo** K7, K8, K10 tua hồ sơ chủ trương 0032 tới kết thúc, tạo `HS-2026-0032-2` rồi chạy tiếp 50 / 56 / kết thúc.
    Test: `e2e/t45-kdt-2-ho-so.spec.mjs`.
  - `tools/capture.mjs` trang "Khoản đầu tư" 78 màn (số bước 12/10, 5 màn khối ký chung, 14 màn tuyến Tập đoàn; `SCR-61-27-l2` thẩm định lượt 02 có lịch sử — T31 B4); chụp riêng trang: `node tools/capture.mjs <thư-mục> "Khoản đầu tư"`.
- Trạng thái lưu trong localStorage của trình duyệt. Dùng "Reset luồng" để chạy lại từ đầu.

## Comment review (T30)

Công cụ góp ý kiểu Figma, `js/review.js` (không thuộc giao diện app; ẩn khi `?capture=1`). Plan: [`docs/dtms/prototype-T30-review-comment.md`](../../docs/dtms/prototype-T30-review-comment.md).

- **Người review:** nút tím góc dưới phải (cạnh Công cụ demo) hoặc phím `C` → bấm vào chỗ cần góp ý → nhập nội dung, chọn loại → Lưu.
  Bấm ghim để trả lời / Đã xử lý / Mở đúng ngữ cảnh. Xong thì menu nút tím › **Xuất JSON gửi nhóm dự án** (`review-<tên>-<ngày>.json`).
  Comment lưu trong trình duyệt (`dtms-review-v1`), Reset luồng / Khôi phục dữ liệu mẫu không xoá. Nhập JSON của người khác để xem và trả lời tiếp.
- **Nhóm dự án gộp:** `node tools/review-merge.mjs <thư-mục-ra> <tệp1.json> [tệp2.json …] --shots`
  → `review-merged.json`, `review.md` (theo màn: vị trí, vai, hồ sơ, bước BPMN, phần tử, chữ xung quanh, trả lời), `shots/Rnn.png` (khoanh phần tử).
- Tệp JSON có trường `readme` giải thích từng trường; mỗi comment mang ngữ cảnh (route, SCR, vai, hồ sơ, bước, phần tử) và ảnh chụp dữ liệu
  prototype lúc ghim (`snapshots`) để mở lại đúng màn.
- **Bản web (GitHub Pages):** `node tools/publish-pages.mjs` — đóng gói bản mới từ code hiện tại (như release, không zip, ra thư mục tạm), **khoá bằng mã truy cập** (`tools/page-lock.mjs`: index + js + HUONG-DAN + tệp mẫu gộp, nén, mã hoá AES-GCM/PBKDF2 → `x/*.bin`, màn nhập mã giải mã trong trình duyệt, "Ghi nhớ trên máy này"), thay toàn bộ nội dung repo public `thaiphuc22/dtms-prototype-v2` rồi push → **<https://thaiphuc22.github.io/dtms-prototype-v2/>** (cập nhật sau ~1 phút). Mã + salt ở `.env.pages` (không commit; đổi `DTMS_PAGES_CODE` rồi đăng lại = đổi mã, salt tự sinh lại; giữ mã thì người xem không phải nhập lại sau mỗi lần đăng). `--no-lock` đăng bản rõ. Link cũ `dtms-prototype` đã gỡ (repo private) 2026-11-11. Comment review không bị ảnh hưởng: cùng origin `thaiphuc22.github.io` nên comment / dữ liệu demo cũ vẫn còn; ảnh chụp chỉ lấy khoá `dtms-proto-*`, không lấy khoá giải mã `dtms-gate-*`. `--from <thư mục release>` đăng một bản đã đóng, `--no-push` chỉ commit. Repo đó chỉ chứa bản đóng gói, không chứa gì của `cds-vht`. Dữ liệu demo vẫn nằm trong `localStorage` của từng người xem; comment lưu chung khi có kho chung (dưới).
- **Kho comment chung (T52):** `<meta name="review-api">` trong `index.html` = URL Web app Apps Script ([`tools/review-sheet/`](tools/review-sheet/README.md), Google Sheet). Có URL thì mọi người xem / trả lời chung, tự tải lại 30 giây, hàng đợi khi mất mạng, số ghim do kho cấp, link `?rv=<id>` mở đúng comment, `review-merge.mjs` nhận URL thay tệp. Để trống = như T30 (chỉ lưu trên máy). Thử: `index.html?review-api=<URL>` (`off` để tắt). Test `e2e/t52-review-shared.spec.mjs`.
- **Bản release (T33):** `npm run release -- --date YYYY-MM-DD` (= `node tools/release.mjs --check`) → `prototype/_release/DTMS-Prototype-<ngày>/` + `.zip`. Chỉ lấy `index.html`, `assets/`, `js/`, `HUONG-DAN.html` (+ `huong-dan/`); báo lỗi khi tham chiếu thiếu, tệp JS không được `index.html` nạp, `.env` / khoá / localhost; tự chèn `proto-build`; `HUONG-DAN-MO.txt` sinh từ `tools/release/HUONG-DAN-MO.txt` (sửa nội dung hướng dẫn ở đó). `--suffix NN` cho bản thứ hai trở đi trong cùng ngày (`DTMS-Prototype-2026-11-05-02`), `--out <thư mục>` đóng bản nháp ra ngoài `_release`, `--force` ghi đè bản cùng tên (không dùng cho bản đã gửi khách). `tools/release-check.mjs <zip>` giải nén và mở `file://` như người nhận (0 lỗi console, tua tới bước 1). `--menu gop` (mặc định) chèn `<meta name="proto-menu" content="gop">` — bản gửi mở sẵn phương án Gộp (khách chọn); bản dev vẫn Tách. Tài liệu `HUONG-DAN.html` (7 tác vụ) đi kèm gói; ảnh `huong-dan/*.jpg` chụp lại bằng `node tools/guide-shots.mjs` mỗi khi giao diện đổi (ghi `tools/release/guide-shots.json`: vai, nút thật từng màn). **Tour hướng dẫn** (`js/tour.js`, T33 B2): 7 tour theo 7 tác vụ — mảng `TOURS`, mỗi bước `enter` (dựng màn), `sel` (CSS hoặc [CSS, chữ]), `title`, `text`, `wait` + `do` (Làm hộ). Đổi giao diện làm mất phần tử thì `e2e/t33-tour.spec.mjs` báo (popover hiện "màn này có thể đã thay đổi"). Ẩn ở `?capture=1`, chế độ comment; `index.html?tour=n` mở thẳng; nút Hướng dẫn luôn hiện; bản gửi (proto-build khác `dev`) tự hiện danh sách tour mỗi lần mở, trừ khi người xem bỏ chọn "Tự hiện" (`dtms-tour.on`). Trước T33 đóng gói tay: proto-build và đoạn comment trong HUONG-DAN-MO.txt như sau:

  ```text
  GÓP Ý TRỰC TIẾP TRÊN MÀN (COMMENT)
  - Bấm nút tròn màu tím ở góc dưới bên phải (hoặc phím C), rồi bấm vào chỗ cần góp ý trên màn,
    nhập nội dung và bấm Lưu. Lần đầu nhập tên của anh/chị.
  - Bấm vào ghim số để xem, trả lời hoặc đánh dấu Đã xử lý. Phím Esc để thoát chế độ comment.
  - Xong: nút tím > "Xuất JSON gửi nhóm dự án", gửi tệp .json vừa tải về cho nhóm dự án.
    Góp ý chỉ lưu trên máy này cho tới khi xuất tệp.
  ```

## Cấu trúc

| File | Nội dung |
|---|---|
| `js/bpmn-tasks.js` | 61 task sinh tự động từ trang MS01 v1.1 (ĐTMS-121026.drawio, T29 B1) bằng `node tools/bpmn-extract.mjs` (tên, actor, biểu mẫu, việc thực hiện, số task cũ). Không sửa tay |
| `js/bpmn-tasks-ms13.js` | Luồng trang **MS13 bản 12/10** (`ĐTMS-121026.drawio`, T18 D-31): 78 bước, 36 cổng (câu hỏi = nhãn hình thoi; dấu "+" đè lên hình thoi = cổng song song), 9 sự kiện (S = bắt đầu luồng chính, S2 = "Đến bước trình ký" của khối ký chung 75–78), 152 mũi tên nguồn → đích + nhãn; sinh bằng `node tools/bpmn-flow-extract.mjs`. Không sửa tay |
| `js/bpmn-tasks-ms02.js` | Luồng trang **MS02 ver1.1** bản 12/10 (T21 D-38): 61 bước, 29 cổng, 119 mũi tên — trùng topo MS01 v1.1, không 10a / 10b; trang còn bản MS01 cũ nằm dưới nên tool lấy hình vẽ sau. Sinh bằng `node tools/bpmn-flow-extract.mjs`. Không sửa tay |
| `js/kdt.js` | Khoản đầu tư: SCR-54/55/56 + Tạo hồ sơ KĐT (khuôn SCR-25), SCR-66. Chi tiết hồ sơ KĐT (SCR-20) nằm trong `screens.js` (`kdtCaseDetail`) |
| `js/ycbg.js` | Yêu cầu báo giá ĐXMS SCR-73/74 (`#/ycbg`) và 5 tab của SCR-29 Chi tiết ĐXMS (T16 B1); dữ liệu suy từ bước của hồ sơ. T16 B2: dùng chung cho KĐT — YCBG KĐT SCR-76/77 (`#/ycbg-kdt`). 12/11: gộp thành một menu cấp 1 **Yêu cầu báo giá** (`#/ycbg`, cột / lọc Loại đối tượng; `#/ycbg-kdt` chuyển hướng), tab Căn cứ / Tồn kho / YCBG của SCR-56 |
| `js/kdt-b2.js` | T16 B2: Danh sách hồ sơ KĐT SCR-75 (T45: `#/ho-so-ct-kdt` chủ trương, `#/ho-so-pd-kdt` phê duyệt KĐT; `#/ho-so-kdt` chuyển hướng), tab Phân loại & định danh, Thành phần tham gia, Kết quả & triển khai của SCR-56 Chi tiết KĐT |
| `js/thau.js` | T16 B2 Quản lý thầu (màn tĩnh, D-17): KHLCNT SCR-78…80 (`#/khlcnt`), gói thầu SCR-81/82 (`#/goi-thau`), nhà thầu & rủi ro SCR-83 (`#/nha-thau`); KHLCNT tạo / điều chỉnh lưu ở localStorage `dtms-proto-thau`; `Thau.kit` = khuôn danh sách / bảng / card / tab dùng chung cho B3 |
| `js/eforms/ms22.js`, `ms23.js`, `ms23-01.js`, `ms23-02.js`, `ms23-nt-tl.js`, `ms24.js` | T25: eForm + biến, tài liệu, văn bản đầu ra của từng quy trình Hợp đồng (`EForms.hdBy`) |
| `js/hop-dong.js` | T16 B3 Quản lý hợp đồng (T25: HĐ-2026-0052 đọc từ hồ sơ con, hợp đồng mẫu khác tĩnh — D-48): SCR-84 danh sách + Nhập hợp đồng (`#/hop-dong`), SCR-85 thêm mới từ KQLCNT (`#/hop-dong/create[/<gói>]`), SCR-86 chi tiết 10 tab theo MS22 / MS23 / MS24 (Thêm phụ lục, Tạo hồ sơ thanh toán), SCR-87 thỏa thuận khung (`#/thoa-thuan-khung`); localStorage `dtms-proto-hop-dong` |
| `js/thong-bao.js` | T16 B3 Thông báo theo source `notification-template` / `notification-channel`: SCR-88/89 mẫu thông báo (`#/mau-thong-bao`), SCR-90 kênh (`#/kenh-thong-bao`), SCR-91 trigger = bảng BE `notification_event_config` (`#/trigger-thong-bao`); localStorage `dtms-proto-thong-bao` |
| `js/bao-cao.js` | T16 B3 Tổng quan SCR-92 (`#/tong-quan`, lọc + 7 tab, WBS-0211 STT 1–45) và Báo cáo SCR-93 (`#/bao-cao/<nhóm>`, khuôn chung + 14 báo cáo WBS-0211 STT 500–616 + KPI theo bước ngoài WBS) theo hr-tools `report-dashboard`; số liệu hợp nhất từ ĐXMS / KĐT / KHLCNT / gói / HĐ. **T48 + T49**: ĐXMS theo T34 (Đã phê duyệt gồm DC / SUP, giá trị chỉ bản hiệu lực của chuỗi điều chỉnh, Chưa khởi tạo chỉ hiện khi lọc trạng thái, Phát sinh điều chỉnh theo ĐXMS gốc); KĐT D-103 / D-104 (loại hồ sơ đang chạy, phễu 10 bậc, nguồn theo đề tài, chia theo dòng bóc tách); SLA quá hạn theo quy trình hồ sơ, quá hạn gồm HĐ chậm mốc; Xuất báo cáo theo bộ lọc + Xuất dữ liệu chi tiết; KPI LCNT đến ký HĐ + đối tượng cấu thành; hộp thoại nhà thầu; thanh toán theo đợt; kiến nghị theo thời gian xử lý. Spec `e2e/t49-bao-cao.spec.mjs` |
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
