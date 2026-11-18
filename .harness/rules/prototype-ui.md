> **Bản chép từ workspace người tích hợp (`cds-vht/.harness/rules/prototype-ui.md`) — không sửa ở đây.** Với BA không có mã FE (`fe/repo-khcn-*`):
> dùng bảng màn tương đương B2 + `tai-lieu/_md/CR-FE-UI.md` (danh mục component); không tìm được màn tương đương → hỏi người tích hợp trong PR.
> Đề xuất đổi quy trình (DX) ghi trong PR (mục "Đề xuất"), người tích hợp chép vào sổ DX.

# Rule: Prototype UI (ĐTMS) — code như app thật, layout theo source VHT

> Người dùng duyệt 2026-09-28 (Locked decision trong `STATE.md`). Áp dụng cho mọi màn trong `prototype/`
> (hiện là `prototype/dtms/`), kể cả màn đã dựng — màn cũ phải sửa lại cho khớp.

## Nhóm A — Prototype là một app dùng thật

- **A1. Không có chữ dành cho BA trên bề mặt màn hình.** Cấm hiển thị trực tiếp: mã SCR, mã UC/UR, số task BPMN kiểu
  "task 01", "ngoài BPMN", "Prototype…", "minh hoạ", "giả lập", "chỉ hồ sơ X chạy luồng", giải thích quyết định thiết kế,
  tooltip `title` chứa ghi chú BA. Mọi dòng như vậy chuyển vào **nút (i) cạnh tiêu đề màn** (A2).
- **A2. Nút (i) cạnh tiêu đề màn** là nơi duy nhất chứa ghi chú BA của màn. Bấm mở popover gồm: mã màn (SCR-xx) + tên;
  UC/UR liên quan; task BPMN + actor; ghi chú hành vi (vd "Lưu = khởi tạo quy trình, không đổi được quy trình sau khi lưu");
  điểm ❓ P-xx của màn kèm ô ghi ý kiến; màn tương đương trong source VHT (B2).
- **A3. Điểm ❓ P-xx chỉ nằm trong (i)**, không gắn chip ở cạnh trường/giữa form. Mỗi điểm ghi rõ trường/khu vực liên quan.
  Trang tổng hợp `#/cho-chot` giữ nguyên (công cụ review, không phải màn nghiệp vụ).
- **A4. Văn bản hiển thị theo giọng app thật:** nhãn, placeholder, toast, lỗi, empty state viết như sản phẩm, ưu tiên đúng
  câu chữ của source (`public/translate/vi.json` hoặc chuỗi cứng trong template tương đương) — vd "Thêm mới thành công",
  "Không có dữ liệu", "Chưa có lịch sử xử lý.". Không toast/khối note giải thích cơ chế prototype.
- **A5. Dữ liệu mẫu trông như dữ liệu thật:** mọi hồ sơ trong danh sách mở được. Hồ sơ không chạy luồng thì mở chi tiết
  read-only ở trạng thái của nó; không có bản ghi bấm vào báo "minh hoạ".
- **A6. Công cụ demo tách khỏi giao diện app:** đổi vai nằm trong menu avatar (thay SSO, như đổi tài khoản).
  Nhảy cảnh / nhánh phụ / reset / mở `#/cho-chot` nằm trong **một nút nổi nhỏ** góc dưới phải. **Bỏ nhãn
  "PROTOTYPE · dữ liệu hư cấu" và nút "Công cụ demo" khỏi topbar.** Chế độ `?capture=1` (dùng cho `capture.mjs` → Figma)
  ẩn nút (i) và nút nổi demo.
- **A7. Không có nút chết mang lý do BA** (vd "Điều chỉnh — MS02 ngoài phạm vi"). Ngoài phạm vi: bỏ nút, hoặc nút mở màn
  "Đang phát triển" như `features/coming-soon` của source.
- **A8. Khác biệt nghiệp vụ so với source được giữ, nhưng thể hiện bằng UI app:** vd mã hồ sơ ĐXMS do hệ thống **tự sinh**
  (source KHCN cho nhập tay) → ô "Mã hồ sơ" read-only, placeholder "Hệ thống tự sinh"; lý do ghi trong (i).

## Nhóm B — Layout bám source code VHT

- **B1. Source là chuẩn, không tự sáng tác layout.** Mỗi màn prototype có một **màn tương đương** trong source
  (`fe/repo-khcn-*-fe`); dựng đúng cấu trúc, thứ tự khối, component, nhãn, kích thước. Chỉ khác nội dung nghiệp vụ ĐTMS
  (tên trường, cột, dữ liệu). Không tìm được màn tương đương → hỏi người dùng trước, không tự chế.
- **B2. Bảng ánh xạ màn** (ghi vào đầu hàm render bằng comment `// Theo: <đường dẫn source>`; thêm dòng khi có màn mới).
  Gốc đường dẫn: `fe/repo-khcn-bpmn-fe/src/app/features/`.

  | Prototype | Màn tương đương (source) | URL dev |
  | --- | --- | --- |
  | SCR-01 Việc của tôi | `my-tasks/my-tasks.component` | `/my-tasks` |
  | SCR-27 Danh sách ĐXMS (ĐXMS = đối tượng cha, D-10) | `task-management/task-management.component` | `/task-management` |
  | SCR-28 Thêm mới / Chỉnh sửa ĐXMS (edit có card Danh sách hồ sơ + Tạo hồ sơ) | `task-management/components/task-create` (mode `create` / `edit`) | `/task-management/create`, `/edit/:id` |
  | SCR-29 Chi tiết ĐXMS | `task-management/components/task-create` (mode `detail`) | `/task-management/detail/:id` |
  | SCR-02 Danh sách hồ sơ ĐXMS | `profile-management/profile-list` | `/khcn-profile-management` |
  | SCR-25 Thêm mới hồ sơ (ĐXMS + Loại hồ sơ + Quy trình) | `profile-management/profile-form` (mode `create`, `create/:taskId` khoá ô Nhiệm vụ) | `/khcn-profile-management/create[/:taskId]` |
  | SCR-20 Chi tiết hồ sơ | `profile-management/profile-detail` | `/khcn-profile-management/:id/view` |
  | Màn xử lý task (SCR-03…19, 22, 26) | `my-tasks/my-task-detail` | `/my-tasks/:taskId?profileId=` |
  | Xem BPMN của hồ sơ/task | `my-tasks/my-task-bpmn-detail`, `profile-management/profile-bpmn` | `/my-tasks/:id/bpmn` |
  | SCR-21 Trình ký, hộp thoại khác | `vht-modal` / `vht-confirm-dialog` (`@khcn-core/ui`), các `*-dialog` trong `my-task-detail/` | — |
  | SCR-41 Danh sách quy trình | `workflow-management/workflow-management.component` (`vht-tree-table`) | `/workflow-management` |
  | SCR-42 Chi tiết quy trình | `workflow-management/workflow-detail` | `/workflow-management/:id?processDefinitionId=` |
  | Khung Ma trận hành động (tab pill) | `action-matrix/action-matrix.component` | `/action-matrix` |
  | SCR-43 Luật hiển thị hành động | `action-matrix/catalogs/display-rule/display-rule-list` | `/action-matrix/display-rule` |
  | SCR-44 Thêm mới / Chỉnh sửa / Xem luật | `action-matrix/catalogs/display-rule/display-rule-form` (mode `create` / `edit` / `view`) | `/action-matrix/display-rule/create`, `/:id/edit`, `/:id/view` |
  | SCR-45 Đối soát BPMN | `action-matrix/catalogs/bpmn-reconcile` | `/action-matrix/bpmn-reconcile` |
  | SCR-46 Danh mục hành động | `action-matrix/catalogs/action-catalog/action-catalog-list` | `/action-matrix/action-catalog` |
  | SCR-47 Xem chi tiết hành động | `action-matrix/catalogs/action-catalog/action-catalog-detail` | `/action-matrix/action-catalog/:id` |
  | SCR-48 Giám sát tiến trình (chỉ xem) | `process-monitoring/process-monitoring.component` | `/process-monitoring` |
  | SCR-30 Tổng quan Danh mục dùng chung | ecat `common-catalog/overview/common-catalog-overview.component` | ecat `/common-catalog` |
  | SCR-31…39 Danh sách danh mục | ecat `common-catalog/base/catalog-list.component` | ecat `/common-catalog/funding-source` |
  | Hộp thoại Thêm mới/Chỉnh sửa danh mục | ecat `common-catalog/base/components/catalog-form-dialog` (**ngoại lệ B6**: hộp thoại `vht-modal` 520px, không phải trang riêng — theo B1 vì ecat dùng hộp thoại) | — |
  | SCR-49 Danh sách biểu mẫu e-form (menu Hồ sơ & biểu mẫu, D-4) | ecat `common-catalog/catalogs/e-form/e-form-list.component` (+ `e-form.facade`) | ecat `/common-catalog/e-form` |
  | SCR-50 Thêm mới / Chỉnh sửa biểu mẫu | ecat `common-catalog/catalogs/e-form/components/e-form-dialog` (**ngoại lệ B6**: hộp thoại `vht-modal` 560px, như ecat) | — |
  | SCR-51 Thiết kế biểu mẫu (mở từ danh sách hoặc panel Biểu mẫu phần tử của SCR-42; chỉ xem khi Dừng hoạt động và mở từ SCR-42) | ecat `common-catalog/catalogs/e-form/components/e-form-designer` | ecat `/common-catalog/e-form/design` |
  | SCR-52 Xem trước biểu mẫu | khối "Preview Modal" (`vht-modal`) trong `e-form-designer.component.html` | — |
  | SCR-53 Lịch sử cập nhật biểu mẫu | ecat `common-catalog/catalogs/e-form/components/e-form-history-dialog` (`vht-modal` 580px) | — |
  | SCR-54 Danh sách khoản đầu tư (KĐT = đối tượng cha, D-12) | `task-management/task-management.component` (như SCR-27; thêm Tìm kiếm nâng cao theo WBS PH09 #173) | `/task-management` |
  | SCR-55 Thêm mới / Chỉnh sửa KĐT (edit có card Danh sách hồ sơ + Tạo hồ sơ) | `task-management/components/task-create` (mode `create` / `edit`) | `/task-management/create`, `/edit/:id` |
  | SCR-56 Chi tiết KĐT | `task-management/components/task-create` (mode `detail`) | `/task-management/detail/:id` |
  | Thêm mới hồ sơ KĐT (`#/kdt/<mã>/tao-ho-so`, khuôn SCR-25, ô KĐT khoá, Quy trình khoá — D-7) | `profile-management/profile-form` (mode `create/:taskId`) | `/khcn-profile-management/create/:taskId` |
  | SCR-20 Chi tiết hồ sơ KĐT (`#/ho-so-kdt/<mã>`, `/bpmn`) | `profile-management/profile-detail`, `profile-management/profile-bpmn` | `/khcn-profile-management/:id/view`, `/:id/bpmn` |
  | Màn xử lý task KĐT (card nội dung SCR-57…62, 64, 65; ký SCR-21) | `my-tasks/my-task-detail` (+ `my-task-bpmn-detail` cho Xem BPMN) | `/my-tasks/:taskId?profileId=` |
  | SCR-66 Thông báo chuyển luồng MS14 / MS15 | Source không có màn tương đương — bố cục `profile-detail` (card Thông tin chung + bảng), người dùng duyệt ở T11 B2 | — |
  | SCR-67…72 Danh sách danh mục thêm ở T16 B1 (Loại đối tác, Đơn vị tính, Tiền tệ, Loại gói thầu, Phương pháp đánh giá, Hình thức bảo đảm) | ecat `common-catalog/base/catalog-list.component` (như SCR-31…39) | ecat `/common-catalog/<key>` |
  | Hộp thoại Xem chi tiết danh mục (bấm Mã) | ecat `catalog-form-dialog` ở chế độ chỉ xem — ecat chưa có, theo mode `view` của `display-rule-form` (nút Đóng / Chỉnh sửa) | — |
  | Nhập biểu mẫu e-form (SCR-49) | `vht-import-dialog` (`@khcn-core/ui`) + bảng Kết quả nhập dữ liệu như Nhập nhà cung cấp | — |
  | SCR-29 Chi tiết ĐXMS — các tab Căn cứ & hạng mục, Rà soát tồn kho, Yêu cầu báo giá, Lịch sử phiên bản, Kết quả & văn bản phê duyệt | `task-create` (mode `detail`) + `app-tabs` (`@khcn-core/ui/custom/tab`, p-tabs) | `/task-management/detail/:id` |
  | SCR-73 Danh sách yêu cầu báo giá ĐXMS | `profile-management/profile-list` | `/khcn-profile-management` |
  | SCR-74 Chi tiết yêu cầu báo giá | `profile-management/profile-detail` (card Thông tin chung + bảng) | `/khcn-profile-management/:id/view` |
  | SCR-75 Danh sách hồ sơ KĐT (T16 B2) | `profile-management/profile-list` (như SCR-02; cột Mã KĐT, Nhóm KĐT, Nhánh hồ sơ) | `/khcn-profile-management` |
  | SCR-76 / SCR-77 Danh sách / Chi tiết yêu cầu báo giá KĐT | `profile-management/profile-list` / `profile-detail` (như SCR-73/74) | `/khcn-profile-management`, `/:id/view` |
  | SCR-56 Chi tiết KĐT — tab Căn cứ & hạng mục, Rà soát tồn kho, Yêu cầu báo giá, Phân loại & định danh, Thành phần tham gia, Kết quả & triển khai | `task-create` (mode `detail`) + `app-tabs` (như SCR-29) | `/task-management/detail/:id` |
  | SCR-78 Danh sách KHLCNT (KHLCNT = đối tượng cha, như ĐXMS / KĐT) | `task-management/task-management.component` | `/task-management` |
  | SCR-79 Thêm mới KHLCNT (chọn đối tượng nguồn đã phê duyệt; `#/khlcnt/create/<loại>/<mã>` chọn sẵn) | `task-management/components/task-create` (mode `create`) | `/task-management/create` |
  | SCR-80 Chi tiết KHLCNT (tab Thông tin chung, Phân bổ công việc, Gói thầu, Tờ trình KHLCNT, Phiên bản & điều chỉnh, Kết quả KHLCNT; hộp thoại Điều chỉnh) | `task-create` (mode `detail`) + `app-tabs`; hộp thoại `vht-modal` | `/task-management/detail/:id` |
  | SCR-81 Danh sách gói thầu | `profile-management/profile-list` | `/khcn-profile-management` |
  | SCR-82 Chi tiết gói thầu (tab Thông tin chung, Phương án LCNT, Thành phần tham gia, Hồ sơ mời thầu, Đánh giá & KQLCNT, Tình huống & kiến nghị) | `profile-management/profile-detail` + `app-tabs` | `/khcn-profile-management/:id/view` |
  | SCR-83 Nhà thầu & kiểm soát rủi ro (tab Nhà thầu chiến lược, Hãng sản xuất chiến lược, Nhà thầu bị cấm) | ecat `common-catalog/base/catalog-list.component` (chỉ xem) + `app-tabs` | ecat `/common-catalog` |
  | SCR-84 Danh sách hợp đồng (+ Nhập hợp đồng `vht-import-dialog`; T16 B3) | `task-management/task-management.component` (hợp đồng = đối tượng cha) | `/task-management` |
  | SCR-85 Thêm mới hợp đồng từ KQLCNT (`#/hop-dong/create[/<gói>]`) | `task-management/components/task-create` (mode `create`) | `/task-management/create` |
  | SCR-86 Chi tiết hợp đồng (10 tab theo MS22 / MS23 / MS24; hộp thoại Thêm phụ lục, Tạo hồ sơ thanh toán) | `task-create` (mode `detail`) + `app-tabs`; hộp thoại `vht-modal` | `/task-management/detail/:id` |
  | SCR-87 Thỏa thuận khung & đơn hàng (đơn hàng xem bằng `vht-modal`) | `task-management` / `task-create` (mode `detail`) | `/task-management` |
  | SCR-88 Mẫu thông báo | `notification-template/notification-template.component` | `/notification-template` |
  | SCR-89 Thêm mới / Chỉnh sửa / Xem chi tiết mẫu thông báo | `notification-template/components/notification-template-form` (mode `CREATE` / `EDIT` / `DETAIL`) | `/notification-template/create`, `/edit/:id`, `/detail/:id` |
  | SCR-90 Kênh thông báo (+ hộp thoại Cấu hình theo khoá i18n `NOTIFICATION_CHANNEL.CONFIG.*`) | `notification-channel/notification-channel.component` (+ `notification-channel-card`) | `/notification-channel` |
  | SCR-92 Tổng quan (khối lọc + 7 tab) | repo-khcn-hr-tools-fe `reporting/report-dashboard` + `app-tabs`; ô chỉ số theo ecat `common-catalog/overview` | hr-tools `/reporting` |
  | SCR-93 Báo cáo `#/bao-cao/<nhóm>` (khuôn chung: lọc, chỉ tiêu, biểu đồ, bảng chi tiết sắp xếp / phân trang / Xuất báo cáo; tab theo báo cáo) | repo-khcn-hr-tools-fe `reporting/report-dashboard` (+ `low-fund-table`, `monthly-allocation-chart`, `cpnc-usage-chart`) | hr-tools `/reporting` |
  | SCR-101 Danh sách Phân hệ (`#/phan-he`, thẻ / bảng; logo topbar về màn này) | core-fe `subsystem-list/subsystem-list.component` | `/subsystem-list` |
  | SCR-103 Danh sách đề tài / dự án (`#/de-tai`; chỉ xem, Xuất Excel; T29 D-63; nút Đồng bộ đề tài / dự án ▾ T36 D-96) | `task-management/task-management.component` (+ panel nâng cao như SCR-27); nút menu xổ theo `Thao tác khác` của `my-tasks/my-task-detail` | `/task-management` |
  | SCR-109 Lịch sử đồng bộ đề tài / dự án (`#/de-tai/dong-bo`, không có mục menu; khối Trạng thái đồng bộ, tab Lần đồng bộ / Lần nhập, hộp thoại Chi tiết lần, Bỏ qua lỗi; T36 D-96) | `task-management/task-management.component` + `app-tabs`; hộp thoại `vht-modal` | `/task-management` |
  | SCR-113 Trình ký (`#/trinh-ky`, menu cấp 1; tab Tôi trình / Tôi ký / Tất cả, thao tác theo trạng thái, hộp thoại Chi tiết lần trình; T54, SRS 32 DTMS_CN_0273, 0274) | `profile-management/profile-list` (khuôn danh sách) + repo-khcn-hr-tools-fe `features/signing` (cột, thao tác theo trạng thái) | `/khcn-profile-management` |
  | SCR-21 Hộp thoại Trình ký VOffice (T54, SRS 32 DTMS_CN_0271: Hình thức trình, Kết nối VOffice, Thông tin văn bản, Tệp, bảng người ký theo nhóm) | repo-khcn-hr-tools-fe `timesheet/timesheet-board/components/timesheet-sign-dialog` (`vht-modal`) | — |
  | SCR-104 Chi tiết đề tài / dự án (tab Thông tin chung, Dự toán chi phí, ĐXMS liên quan, Văn bản pháp lý; hộp thoại dòng dự toán `vht-modal`) | `task-create` (mode `detail`) + `app-tabs`; bảng dự toán `vht-tree-table` (`@khcn-core/ui`); hộp thoại theo ecat `catalog-form-dialog` | `/task-management/detail/:id` |
  | SCR-102 Màn xử lý việc hợp đồng (MS22…; T25) | `my-tasks/my-task-detail` (+ `my-task-bpmn-detail` cho Xem BPMN) | `/my-tasks/:taskId?profileId=` |
  | SCR-20 Chi tiết hồ sơ con của hợp đồng (`#/ho-so-hd/<mã>`, `/bpmn`; T25) | `profile-management/profile-detail`, `profile-management/profile-bpmn` | `/khcn-profile-management/:id/view`, `/:id/bpmn` |
  | SCR-86 card Danh sách hồ sơ + Tạo hồ sơ (T25) | `task-create` (mode `edit`, card Danh sách hồ sơ như SCR-28 / SCR-55) | `/task-management/edit/:id` |
  | SCR-86 tab Tiến độ thực hiện đọc hồ sơ theo dõi MS23 (T25 B2, D-49) | `task-create` (mode detail) + `app-tabs` | `/task-management/detail/:id` |
  | SCR-86 tab Văn bản phát sinh: card Danh sách hồ sơ MS23.01 + bảng bản đã ký (T25 B5) | `task-create` (mode detail) + `app-tabs`; card như SCR-28 / SCR-55 | `/task-management/detail/:id` |
  | SCR-86 tab Bàn giao & nghiệm thu: card Hồ sơ bàn giao MS23.02, Hồ sơ nghiệm thu MS23.03 (T25 B6) | `task-create` (mode detail) + `app-tabs`; card như SCR-28 / SCR-55 | `/task-management/detail/:id` |

  Gốc đường dẫn ecat: `fe/repo-khcn-ecat-fe/src/app/features/`.
  `fe/repo-khcn-dtms-fe` (FE thật của ĐTMS, về 2026-10-30) hiện có `my-tasks`, `workflow-management`, cùng cấu trúc với `repo-khcn-bpmn-fe`; khi màn có ở cả hai thì đối chiếu thêm repo này.

- **B3. Chỉ dùng component có trong `@khcn-core/ui`** (`fe/repo-khcn-core-fe/projects/ui/src/custom`): `vht-button`,
  `vht-search-input`, `vht-form-field`, `vht-text-input`, `vht-select`, `vht-multi-select`, `vht-table`, `vht-paginator`,
  `vht-steps`, `vht-timeline`, `vht-modal`, `vht-confirm-dialog`, `vht-radio`, `vht-checkbox`, `vht-calendar`, `upload`,
  `tab`, `toast`, `badge`… Mỗi component có một class CSS tương ứng trong `app.css`, số đo lấy từ `.scss` của nó.
  Không dùng widget tự chế (radio-card, stat-card, dải "giai đoạn") khi source không có.
- **B4. Khung trang chung:** không breadcrumb; nội dung trang padding 20px, khoảng cách khối 20px; card trắng bo 12–16px.
  Tiêu đề trang `#2D3036` 600 — cỡ theo đúng màn tương đương (profile-*: 20px; my-tasks, my-task-detail: 22px).
  Tiêu đề khối trong card 16–18px/600 `#0F1110` theo màn tương đương.
- **B5. Mẫu màn Danh sách** (`profile-list`, `my-tasks`):
  - Hàng tiêu đề: "Danh sách …" + (nếu có quyền tạo) nút primary `Thêm mới` icon `add` bên phải.
  - Card: hàng trên chỉ có ô tìm kiếm (profile 264px / my-tasks 320px, bo 12px, placeholder "Tìm kiếm theo …") + nút
    `Tìm kiếm nâng cao` (bật → `Ẩn tìm kiếm nâng cao`, ẩn ô tìm kiếm), căn phải.
  - Panel nâng cao: viền `#DCDEE0` bo 12px, padding 20/35, lưới 3 cột `vht-form-field`; cuối panel `Làm mới` + `Tìm kiếm`.
  - `vht-table`: STT → `Thao tác` (icon sửa/xoá; xoá chỉ ở trạng thái nháp) → `Trạng thái` (badge 27px, căn giữa)
    Cột `Thao tác` chỉ có khi màn có thao tác trên dòng — Danh sách hồ sơ ĐXMS, hồ sơ KĐT, KHLCNT, Hợp đồng **không có** (D-43, team BA 30/10/2026); mở chi tiết bằng link mã.
    → mã (link đỏ `#EE0033` gạch chân, bấm mở chi tiết) → các cột khác, **mỗi thông tin một cột**; header 40px nền
    `#F0F1F2`, dòng 56px; text dài cắt 2 dòng + tooltip khi bị cắt; ô trống `-`.
  - Phân trang dưới bảng: "Hiển thị bản ghi/trang:" 10/20/50, mặc định 10.
  - Việc của tôi: **không có tab** Cần xử lý/Đã xử lý — lọc bằng trường `Trạng thái` (Chưa xử lý / Hoàn thành / Quá hạn)
    trong panel nâng cao; cột theo `my-task-columns.constants.ts` (Trạng thái, Mã hồ sơ, Mã nhiệm vụ, Hành động, Ngày tạo,
    Hạn xử lý, Loại hồ sơ, Cấp, Quy trình — đổi nhãn theo nghiệp vụ ĐTMS).
- **B6. Mẫu màn Thêm mới / Chỉnh sửa** (`profile-form`):
  - **Trang riêng có route** (vd `#/dxms/create`), không modal.
  - Hàng tiêu đề: nút quay lại 32px viền `#909094` + "Thêm mới …"; bên phải `Huỷ` (secondary viền xám) và `Lưu` (primary).
  - Card "Thông tin chung": lưới 3 cột, trường dài chiếm 2 cột; lựa chọn dùng `vht-select` có tìm kiếm, **không
    radio-card**; thông tin phụ của lựa chọn (vd điều kiện áp dụng quy trình) đặt trong nhãn option.
  - Card "Danh sách tài liệu" nếu có đính kèm: `Chọn mẫu tài liệu` + `Tải file lên` bên phải tiêu đề.
  - Lỗi hiện dưới trường (`vht-form-field [error]`), trường bắt buộc có `*`.
- **B7. Mẫu màn xử lý task** (`my-task-detail`):
  - Hàng tiêu đề: nút quay lại + tiêu đề; **nút hành động ở bên phải hàng tiêu đề** (không có thanh hành động dưới đáy):
    hành động chính `primary`, hành động phụ viền đỏ, `Xem BPMN` viền đỏ, hành động còn lại gom vào `Thao tác khác ▾`.
  - Thân: lưới 7 cột — trái 5 cột gồm các card `Thông tin chung` (lưới 2 cột nhãn 13px `#76777A` / giá trị 14px),
    `Quy trình` (`vht-steps`), `Danh sách tài liệu`,
    `Văn bản đầu ra`; phải 2 cột là card `Lịch sử hồ sơ` (`vht-timeline`, badge kết quả, nút `Xem nhận xét`).
  - Không dùng header hồ sơ tự chế (stat-row, dải giai đoạn); giai đoạn/KPI thể hiện qua `Quy trình` và `Thông tin chung`.
  - **Không có card nội dung riêng theo task giữa khung** (D-24, 2026-10-07). Nhập liệu của bước = **eForm mở bằng dialog khi bấm
    nút hành động** (`my-task-eform-dialog`, `vht-modal` + `vht-e-form`; nút `Lưu nháp` / `Xác nhận`; đã nộp → chỉ xem, nút `Đóng`).
    Nội dung eForm chỉ gồm loại 1–3 của [`prototype-solution.md`](prototype-solution.md) S3; tài liệu (loại 4) ở `Danh sách tài liệu`.
- **B8. Nhãn nút/trạng thái theo từ vựng source**: `Thêm mới`, `Huỷ`, `Lưu`, `Tìm kiếm`, `Làm mới`, `Sửa`, `Xoá`,
  `Xem BPMN`, `Thao tác khác`; trạng thái hồ sơ `Dự thảo` / `Đang xử lý` / `Hoàn thành`, trạng thái việc `Chưa xử lý` /
  `Hoàn thành` / `Quá hạn`. Trạng thái riêng ĐTMS (vd "Đã chuyển quy trình") thêm vào cùng bộ variant của `badge`.

## Nhóm C — Cách làm & kiểm tra

- **C1. Trước khi dựng/sửa một màn:** đọc `.component.html`, `constants/*columns*`, `*form*.constants`, chuỗi i18n
  của màn tương đương; ghi đường dẫn source vào comment đầu hàm render.
- **C2. Đối chiếu trực quan:** có ảnh màn dev (người dùng cung cấp) hoặc Figma "VHT UI DESIGN" thì đặt cạnh ảnh chụp
  prototype để so; lệch layout là lỗi, không để sau.
- **C3. Test e2e:** không có chuỗi `SCR-`, `UC-`, `task 0`, `Prototype`, `minh hoạ` trong vùng nội dung màn (ngoài popover
  (i), `#/cho-chot`, nút nổi demo); mọi hàng trong danh sách mở được.
- **C4. Figma:** `capture.mjs` chụp ở `?capture=1` để Figma cho khách sạch như app thật.
