# Nhật ký — Quản lý sản xuất (`sx`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-27 · Đề xuất mua sắm: Lưu gọi API tạo ĐXMS trên ĐTMS (một mã, một tên); tách Trạng thái gửi ĐTMS / Trạng thái phê duyệt
- **Bỏ bước duyệt nội bộ Sản xuất** (luồng SX-MS không còn được khởi tạo) và mã ĐXSX riêng: màn **Lập đề xuất mua sắm** (`js/sx-mua-sam.js`) theo khuôn màn Lập ĐXMS của ĐTMS (Mã ĐXMS hệ thống tự sinh, Tên đề xuất mua sắm, Đơn vị đề xuất, Mức ưu tiên, Đợt, Thời gian thực hiện, Giá trị dự kiến, Người tạo) + Dự án sản xuất và bảng vật tư; nút **Lưu** = gọi API-01 tạo ĐXMS trên ĐTMS (GIẢ LẬP `Flow.createDxms`), phê duyệt theo quy trình ĐTMS.
- Danh sách và tab Mua sắm & hợp đồng của dự án: một mã (mã ĐXMS) dưới tên; hai cột **Trạng thái gửi ĐTMS** (Đã gửi / Gửi lỗi + nút **Gửi lại**) và **Trạng thái phê duyệt** (trạng thái ĐXMS trên ĐTMS: Chưa khởi tạo, Đang phê duyệt, Đã phê duyệt…); lọc theo cả hai. **Sửa / Xoá** theo quy tắc ĐTMS: gửi lỗi hoặc ĐXMS còn Chưa khởi tạo — Sửa gọi API cập nhật ĐXMS, Xoá xoá mềm ĐXMS (mã không dùng lại).
- Dữ liệu (`js/sx-data.js`): 2 đề xuất chuyển đổi mang mã ĐXMS-2026-0058 / 0066; thêm 1 đề xuất mẫu gửi lỗi (chưa có mã ĐXMS) để minh hoạ Gửi lại. Khoá lưu đổi `sx-proto-ms` → `sx-proto-ms2`. Nhu cầu vật tư (`js/sx-nhu-cau.js`) hiện mã ĐXMS.
- **File phân hệ khác** `js/luong.js` (luong-dxms) — sửa 1 dòng: Chi tiết ĐXMS nguồn Sản xuất bỏ "· đề xuất <mã ĐXSX>" (không còn mã riêng; yêu cầu một mã một tên).
- Test: t71-sx-s4 (3 ca), t71-sx-s10 ca Lập đề xuất từ nhu cầu và Gói thầu viết lại theo luồng mới. So với trước khi sửa (t71-*, t74-*, sx-*, ui-rules, luong*): không ca đỏ thêm, 53 → 49 ca đỏ cũ.

## 2026-11-27 · Thêm mới / Sửa / Xoá đồng bộ; Tiến độ và chất lượng 2 bảng; Hồ sơ dự án điều hướng tab Tài liệu
- **Điều kiện sản xuất** (`js/sx-chuyen-giao.js`): nút **Thêm mới** (thay "Thêm điều kiện"), có ở mọi giai đoạn trước khi dự án hoàn thành; dòng thêm có Sửa / Xoá.
- **Tiến độ và chất lượng** (`js/sx-btp.js`, tên tab bỏ "(Từ VMMS)"): bỏ Thêm kết quả IPQC; tách **bảng Tiến độ** và **bảng Chất lượng** (số đạt, số lỗi, tỷ lệ đạt, IPQC — bấm xem chi tiết).
- **Đề xuất mua sắm** (`js/sx-mua-sam.js`): menu hiện danh sách đề xuất của Sản xuất (thay danh sách ĐXMS chỉ xem T73) — **Thêm mới** (cùng màn Lập đề xuất của tab dự án), cột Thao tác **Sửa / Xoá** (đề xuất chưa gửi), cột ĐXMS mở ĐXMS đồng bộ; chi tiết có Chỉnh sửa.
- **Hồ sơ dự án** (`js/sx-ho-so.js`): danh sách dự án (số tài liệu, chưa có tệp, cập nhật gần nhất) — bấm mở **tab Tài liệu** của dự án; bỏ Tải file lên / Chọn mẫu ở màn này.
- Rà soát "có Thêm thì có Sửa, Xoá": **Phương án SXKD** thêm Xoá phương án (Đang chuẩn bị, chưa lập dự án) và Xoá dòng đầu vào / cấu hình / hạng mục / chi phí (`js/sx-pasxkd.js`); **Đề nghị nghiệm thu** Sửa / Xoá khi chưa đánh giá OQC (xoá thì huỷ hồ sơ — `SxFlow.cancelCase`); **OQC** thêm Sửa nội dung (`js/sx-nghiem-thu.js`, `js/sx-flow.js`); **Tài liệu** Sửa / Xoá danh mục riêng (xoá khi trống) và tài liệu người dùng thêm (`js/sx-du-an.js`). Các mục khác đã đủ (nhiệm vụ, công việc con, dự án, kế hoạch, nhân sự, nhu cầu vật tư, bất thường, nghiệm thu nhập tay, bài học).
- Test: t71-sx-s11 "Hồ sơ dự án" viết lại theo thiết kế mới; sx-cong-viec-con thêm 1 ca (12 ca xanh). So với trước khi sửa, toàn bộ t71-* / t74-* không có ca đỏ thêm.

## 2026-11-27 · Sửa lỗi dòng công việc con mở nhầm việc khác (trùng mã dữ liệu cũ)
- Nguyên nhân: dữ liệu mẫu đổi ngày 26/11 (việc theo bước kế hoạch thành CV-SX-2026-006…009); việc con người dùng tạo trước đó trong trình duyệt được cấp CV-SX-2026-006 → trùng mã việc mẫu "Bảo đảm máy móc…" (3 công việc con), bấm dòng 2.1 mở nhầm việc mẫu.
- Kho công việc có phiên bản dữ liệu (`VER = 3`, `js/sx-cong-viec.js`): dữ liệu cũ khác phiên bản được làm mới một lần; bản ghi người dùng trùng mã dữ liệu mẫu bị bỏ qua; mã mới cấp tiếp sau mã lớn nhất (CV-SX-2026-010…). e2e thêm ca trùng mã (11 ca xanh).

## 2026-11-27 · Việc của tôi: Hạng mục kế hoạch đầy đủ; công việc con 1 cấp cả với dữ liệu cũ
- Cột Hạng mục kế hoạch: công việc con kế thừa dự án / hạng mục của việc cha (form Thêm công việc con khoá sẵn); việc quy trình theo luồng / bước (Phê duyệt kế hoạch → bước 1–3, mua sắm → Đề xuất mua sắm, chuyển giao → bước 5, bất thường / thay đổi kỹ thuật → bước 9, nghiệm thu → bước 12–14); tên hạng mục tra trên toàn bộ cây kế hoạch; dữ liệu mẫu CV-SX-2026-004 / 005 / 008 / 009 gắn hạng mục (`js/sx-cong-viec.js`, `js/sx-flow.js`, `js/sx-data.js`).
- Dữ liệu cũ nhiều cấp (công việc con có việc con, tạo trước quy tắc 1 cấp) gom về việc gốc — hiện ở dòng n.j dưới việc gốc, không bị ẩn; chi tiết công việc con không có tab Công việc con.
- Dòng công việc con: cột Công việc cha là chữ thường (việc cha ở ngay dòng trên) — tránh bấm nhầm sang việc cha. e2e thêm 1 ca (10 ca xanh).

## 2026-11-27 · Việc của tôi: quyền sửa / xoá, công việc con 1 cấp, STT n.j, Ngày hoàn thành; Nhiệm vụ đơn vị bỏ Giai đoạn
- Việc của tôi (`js/sx-cong-viec.js`): không sửa / xoá công việc được giao; chỉ **Sửa / Xoá công việc con do mình chia, chưa cập nhật tiến độ** (màn sửa báo lý do nếu không được sửa). Nhiệm vụ đơn vị giữ quy tắc cũ.
- **Công việc con chỉ 1 cấp**: công việc con không có Thêm công việc con, chi tiết không có tab Công việc con.
- Danh sách: công việc con nằm ngay dưới việc cha, **STT 2.1, 2.2…** (lọc / tìm kiếm giữ việc cha khi việc cha hoặc công việc con khớp; phân trang theo việc cha; Xuất Excel kèm công việc con, STT n.j); thêm cột **Ngày hoàn thành**.
- Nhiệm vụ đơn vị: bỏ cột Giai đoạn; cột Thao tác thêm icon **Cập nhật tiến độ** (nhiệm vụ chưa gắn dự án, chưa xong). e2e thêm 1 ca (9 ca xanh).

## 2026-11-27 · Nhiệm vụ đơn vị: bỏ Công việc cha ở Xem chi tiết
- Chi tiết nhiệm vụ đơn vị không còn trường Công việc cha (công việc từ kế hoạch vẫn có, tên kèm mã) (`js/sx-cong-viec.js`).
- Rà soát Cập nhật tiến độ của nhiệm vụ đơn vị: chỉ có ở nhiệm vụ **chưa gắn dự án, chưa hoàn thành** (NV-SX-2026-005, 006), cho người đầu mối / người giao / quản trị; nhiệm vụ đã gắn dự án lấy % theo tiến độ dự án nên không có nút. Thêm ca e2e.

## 2026-11-26 · Mục 5, 6, 1: Thêm mới trong / ngoài dự án; tooltip điều hướng
- Mục 5–6 (BA chốt 26/11): Hồ sơ chuyển giao **bỏ Thêm mới** (`js/sx-chuyen-giao.js`); form Thêm mới / Sửa **nhiệm vụ đơn vị bỏ Công việc cha** (công việc con vẫn khoá việc cha khi mở từ Thêm công việc con) (`js/sx-cong-viec.js`); menu **Nghiệm thu sản phẩm** có **Đề nghị nghiệm thu** — chọn dự án rồi mở cùng hộp thoại với tab Nghiệm thu sản phẩm của dự án (`js/sx-nghiem-thu.js`). Đề xuất mua sắm ngoài menu vẫn lập từ Nhu cầu vật tư (cùng màn với tab dự án); Quản lý quy trình để như hiện tại.
- Mục 1: tooltip ở mọi chỗ điều hướng (`js/sx-chung.js` `tipOf`): link / nút icon có `data-go` chưa có title được gắn tooltip theo màn đích (Xem chi tiết dự án, nhiệm vụ, công việc, phiếu bất thường, yêu cầu thay đổi, đề nghị nghiệm thu, đề xuất mua sắm, Mở màn hình xử lý…); ô tên kèm mã dùng cùng bộ tooltip. Kiểm tra mọi màn / tab: không còn link điều hướng thiếu tooltip.
- `e2e/sx-cong-viec-con.spec.mjs`: thêm ca mục 5–6 và 1 (7 ca xanh).

## 2026-11-26 · Mục 4: Chi tiết dự án — mỗi tab một bảng, không rối mắt
- **Tiến độ và chất lượng (Từ VMMS)** (đổi tên Bán thành phẩm & tiến độ, `js/sx-btp.js`): một bảng theo hạng mục — tiến độ + Số lỗi, Tỷ lệ đạt (trạm đo VMMS / nhật ký), IPQC (bấm xem chi tiết; QA Thêm kết quả IPQC). Bỏ Nhật ký sản lượng, Trạm đo, Định mức vật tư; bỏ nút Cập nhật (số liệu đồng bộ — mục 5).
- **Bất thường & thay đổi**: bỏ Nhật ký quản lý dự án (`js/sx-thay-doi.js`).
- **Nghiệm thu sản phẩm** (đổi tên Chất lượng & nghiệm thu, `js/sx-nghiem-thu.js`): một bảng gồm Thử nghiệm thực tế, OQC (xem / thêm nội dung / xác nhận trong hộp thoại, thao tác ở dòng), từng đề nghị nghiệm thu theo lô (biên bản, chứng chỉ, phiếu nhập kho), nội dung nghiệm thu nhập tay. IPQC chuyển sang Tiến độ và chất lượng, IQC sang Dữ liệu VMMS.
- **Dữ liệu VMMS** (`js/sx-vmms.js`): thêm Định mức vật tư, Đơn vị sản xuất, Trạm đo, IQC.
- **Tài liệu** (`js/sx-du-an.js`): bỏ Chọn mẫu tài liệu và nút Tải file lên chung; thêm **Thêm danh mục tài liệu** (danh mục riêng của dự án); một bảng theo danh mục — dòng danh mục có **(+)** thêm tên tài liệu, mỗi dòng tài liệu có **Tải file lên** (gắn tệp / lên phiên bản). Sửa test t74 #97 theo bố cục mới.

## 2026-11-26 · Mục 3: không hiện cột mã riêng — mã kèm tên, rà soát mọi màn của phân hệ
- Hàm dùng chung `SxChung.nameCode` / `projCell` (`js/sx-chung.js`): ô tên (link có tooltip "Xem chi tiết …" nếu mở được) + mã dòng nhỏ bên dưới; cột Dự án hiện tên dự án kèm mã.
- Bỏ cột Mã riêng, gộp vào tên ở mọi bảng: Việc của tôi, Nhiệm vụ đơn vị, công việc con, Dự án, Phương án SXKD, Hồ sơ chuyển giao / sản phẩm / danh mục hồ sơ, Nhu cầu vật tư, Đề xuất mua sắm, hợp đồng, phiếu nhập kho, Bất thường, Thay đổi kỹ thuật, Nghiệm thu (đề nghị, IPQC, đánh giá, nghiệm thu thủ công), Bán thành phẩm (trạm đo, định mức), Dữ liệu VMMS (thiết bị, lệnh sản xuất), Bài học, Báo cáo / Tổng quan (popup dự án, vật tư leadtime, sự kiện).
- Cột tham chiếu sang đối tượng khác bỏ chữ "Mã" (ĐXMS, ECO, ECN, Thay đổi kỹ thuật liên kết…). Chi tiết dự án: Mã / Tên nhiệm vụ → Nhiệm vụ đơn vị (tên kèm mã). Danh mục dùng chung (Danh mục) là màn chung của người tích hợp — chưa đổi.
- Kiểm tra: mở mọi màn / tab của phân hệ không lỗi, không còn tiêu đề cột "Mã …"; thêm ca e2e mục 3.

## 2026-11-26 · Việc của tôi = giao diện Việc cá nhân cũ; việc giao theo kế hoạch là công việc (không phải nhiệm vụ đơn vị); nhiệm vụ đơn vị theo tiến độ dự án
- **Việc của tôi** (`#/sx/viec-cua-toi`, `js/sx-cong-viec.js` list('CN')): giao diện danh sách Việc cá nhân cũ (ô chỉ số, tìm kiếm nâng cao, phân trang, Xuất Excel), tiêu đề Việc của tôi; tổng hợp **công việc từ kế hoạch** (tôi thực hiện / tôi giao) và **công việc từ quy trình** (user task — `SxFlow.flowItems`) — cột + lọc nâng cao **Phân loại**. Việc quy trình: không Thêm công việc con / Cập nhật tiến độ, mở màn Xử lý (menu sáng mục nghiệp vụ), dòng phụ link tới phiếu / yêu cầu / lô; dự án không còn là link.
- **Việc giao theo bước kế hoạch** (kick-off `fromPlan`, Giao việc theo hạng mục) tạo **công việc** (CN, nguồn Từ kế hoạch) ở Việc của tôi của người được giao, không tạo nhiệm vụ đơn vị. Dữ liệu mẫu: các việc theo bước 6, 7 và việc lẻ chuyển thành CV-SX-2026-006…009 (CV-SX-2026-006 có 3 công việc con) (`js/sx-data.js`).
- **Nhiệm vụ đơn vị** = nhiệm vụ sản xuất của đơn vị, theo dõi tiến độ dự án thuộc nhiệm vụ: % / Hoàn thành lấy theo tiến độ kế hoạch dự án ("Theo tiến độ dự án"), không cập nhật tay, không có công việc con (chi tiết 2 tab). Mẫu NV-SX-2026-001…003 cho DA-SX-2026-002 / 001 / 003.
- Công việc con chỉ ở công việc từ kế hoạch (chi tiết 3 tab, người cùng đơn vị, % việc cha tự tính). Đệm cây công việc trong một lượt render (Tổng quan ~25 s → 0,25 s). `e2e/sx-cong-viec-con.spec.mjs` 4 ca xanh.

## 2026-11-26 · Việc của tôi: về giao diện cũ, tổng hợp 2 nguồn (Kế hoạch / Quy trình); công việc con chỉ ở việc từ Kế hoạch
- Khôi phục nghiệp vụ, giao diện Việc của tôi trước 26/11 (`js/sx-flow.js`, `js/sx-cong-viec.js`, dữ liệu mẫu `js/sx-data.js` — NV-SX-2026-001 có lại 3 công việc con); bỏ các thay đổi thử nghiệm bên dưới (chia việc con từ việc Camunda, tự hoàn thành user task, khối việc quy trình ở Việc cá nhân, danh sách n.1 / n.2, ô chỉ số, lọc Loại / Phạm vi).
- Việc của tôi tổng hợp **công việc từ Kế hoạch** (nhiệm vụ đơn vị, việc cá nhân, công việc con giao cho tôi — có Thêm công việc con, Cập nhật tiến độ; bấm mở chi tiết 3 tab Thông tin chung · Công việc con · Lịch sử cập nhật) và **việc được giao từ quy trình** (không có 2 nút trên; mở màn Xử lý; tên công việc link tới màn nghiệp vụ, vd phiếu bất thường). Cột + lọc **Phân loại**; bỏ link dự án. Menu chỉ còn Việc của tôi (Việc cá nhân gộp vào).
- Màn Xử lý việc quy trình: menu bên trái sáng mục nghiệp vụ tương ứng (Bất thường sản xuất, Thay đổi kỹ thuật, Nghiệm thu…) (`js/sx.js`).
- Công việc con: người thực hiện cùng đơn vị với người thực hiện việc cha; PM dự án, lãnh đạo cấp cao xem được. Giữ bỏ nhãn trạng thái ở cây Kế hoạch. `e2e/sx-cong-viec-con.spec.mjs` viết lại (3 ca xanh).

## 2026-11-26 · Việc của tôi: không phân loại, công việc con là dòng n.1 / n.2, ô chỉ số, tìm kiếm nâng cao, phân trang
- Mọi việc được giao cho tôi (việc quy trình, việc giao trực tiếp) về một danh sách, **bỏ cột / lọc Loại và Phạm vi** (`js/sx-flow.js`).
- **Công việc con** hiện ngay dưới đầu việc được chia: việc cha STT 2 → **2.1, 2.2…** (người thực hiện, tiến độ, hạn); không lặp lại ở cấp việc cha. Lịch sử xử lý ghi mã việc (`tok`) để việc đã xử lý vẫn kèm công việc con.
- Dùng khuôn danh sách chung: **ô chỉ số** (Tổng số, Chưa xử lý, Đã xử lý, Quá hạn, Sắp đến hạn — bấm lọc nhanh), **tìm kiếm nâng cao** (tên / nội dung, dự án, trạng thái, giai đoạn, hạn xử lý từ – đến, chu kỳ), **phân trang** theo việc cha, Xuất Excel (STT n / n.j).
- PM dự án, lãnh đạo cấp cao theo dõi công việc con ở tiến trình hồ sơ và chi tiết công việc con. `e2e/sx-cong-viec-con.spec.mjs` cập nhật (5 ca xanh).

## 2026-11-26 · Gộp Việc cá nhân vào Việc của tôi (một màn, một danh sách)
- Menu Quản lý nhiệm vụ: **Việc của tôi** (số = việc quy trình chờ xử lý + việc cá nhân chưa xong của tôi) thay cho Việc cá nhân; `#/sx/cong-viec/ca-nhan` chuyển về `#/sx/viec-cua-toi` (`js/sx-data.js`, `js/sx.js`, `js/sx-cong-viec.js`).
- Màn Việc của tôi (`js/sx-flow.js`): một danh sách gồm việc theo quy trình (Camunda), công việc con, việc cá nhân — cột **Loại**; lọc **Phạm vi** (Việc của tôi / Việc tôi giao / Việc tôi theo dõi — PM dự án, lãnh đạo cấp cao theo dõi công việc con), **Loại**, Chu kỳ, từ khoá; **Xuất Excel**. Cột Thao tác đầu bảng: mở Xử lý / Xem, + Chia công việc con, Cập nhật tiến độ, Sửa, Xoá.
- Bỏ khối "Việc theo quy trình chờ xử lý" vừa thêm ở Việc cá nhân; màn Xử lý, chi tiết công việc quay về Việc của tôi.
- `e2e/sx-cong-viec-con.spec.mjs` cập nhật (5 ca xanh).

## 2026-11-26 · Việc cá nhân: khối Việc theo quy trình chờ xử lý (nơi chia công việc con)
- Menu không còn Việc của tôi (bỏ 18/11) → màn **Việc cá nhân** có khối *Việc theo quy trình chờ xử lý* ở đầu: việc Camunda của người dùng, cột Thao tác đầu bảng (mở màn Xử lý, **+** Chia công việc con), tiến độ công việc con dưới trạng thái (`js/sx-flow.js` flowCard, `js/sx-cong-viec.js`).
- Màn Xử lý: nút quay lại và xử lý xong về Việc cá nhân; sidebar sáng Việc cá nhân khi ở màn Xử lý / Việc của tôi (mở từ chuông) (`js/sx.js`).
- `e2e/sx-cong-viec-con.spec.mjs` thêm ca Việc cá nhân (5 ca xanh).

## 2026-11-26 · Công việc con: chốt Q-SX-01 — luôn tự hoàn thành việc cha, chia cho người cùng đơn vị, PM + lãnh đạo cấp cao theo dõi
- Công việc con cuối xong → hệ thống **luôn tự hoàn thành** việc cha và chuyển bước (`js/sx-flow.js`): bước nhiều kết quả áp kết quả người được giao chọn khi chia việc (ô *Kết quả khi hoàn thành hết công việc con*, chỉ nút đồng ý / đạt); trường bắt buộc còn trống điền tổng hợp công việc con (chữ) / ngày hoàn thành (ngày). Không chia việc ở bước ký số; ngoại lệ còn lại: bộ chặn nghiệp vụ của bước → Chờ hoàn tất.
- Hộp thoại Chia công việc con, form sửa công việc con: người thực hiện chỉ trong **đơn vị của người được giao việc** (`js/sx-cong-viec.js`). Thêm 2 kỹ sư Trung tâm Nghiên cứu thiết kế — Khối 1 (Ngô Đức Anh, Trịnh Thu Trang) làm người thực hiện mẫu (`js/sx-data.js`).
- Người theo dõi công việc con: người giao, PM dự án, **lãnh đạo cấp cao** (Ban Giám đốc Khối, Ban Tổng Giám đốc).
- `e2e/sx-cong-viec-con.spec.mjs` cập nhật (4 ca xanh).

## 2026-11-26 · Công việc con chia từ Việc của tôi; bỏ công việc con của nhiệm vụ đơn vị; bỏ nhãn trạng thái ở cây Kế hoạch
- Chi tiết dự án › tab Kế hoạch (`js/sx-du-an.js`): bỏ nhãn trạng thái cạnh tên từng bước (Chờ duyệt điều chỉnh); cột Trạng thái giữ nguyên.
- Nhiệm vụ đơn vị (`js/sx-cong-viec.js`): bỏ nút Thêm công việc con, tab Công việc con, trường Công việc cha, % tính từ việc con — % do người đầu mối cập nhật; dữ liệu mẫu bỏ liên kết cha–con của NV-SX-2026-001 (`js/sx-data.js`).
- **Chia công việc con** (`js/sx-flow.js`, `js/sx-cong-viec.js`): việc ở Việc của tôi (user task Camunda) có icon / nút Chia công việc con → nhiều việc cá nhân giao cho mình hoặc người khác, hạn ≤ hạn xử lý. % việc cha = trung bình công việc con, hiện ở Việc của tôi, thẻ Công việc con của màn Xử lý, bảng tiến trình hồ sơ; PM dự án, Lãnh đạo Khối xem được công việc con ở Việc cá nhân.
- Còn công việc con chưa xong thì không gửi được việc (trả lại / từ chối thì công việc con chưa xong chuyển Đã huỷ, có xác nhận). Công việc con cuối xong → tự hoàn thành việc cha khi bước không chọn kết quả, không ký số, đủ trường bắt buộc; còn lại chuyển **Chờ hoàn tất**. Mẫu: 3 công việc con của bước 5 phiếu BT-2026-002. Câu hỏi chờ chốt **Q-SX-01**.
- Test mới `e2e/sx-cong-viec-con.spec.mjs` (4 ca xanh). Các spec cũ t71-sx-s2 / s6 / s9, t74-comment-qlsx đã đỏ 14 ca trước thay đổi này (lệch giao diện nhánh hoaidt10) — chưa sửa.

## 2026-11-25 · Phiếu bất thường: trường Quy trình
- Form Thêm mới / Sửa phiếu bất thường (`js/eforms/sx-bt.js`, BM.QLBT.01): thêm trường **Quy trình** (bắt buộc, có tìm kiếm) đầu nhóm Thông tin bất thường.
- Danh sách lấy từ menu **Quản lý quy trình** (`QuyTrinh.WORKFLOWS`, quy trình có phiên bản đang hoạt động); lưu vào phiếu (`proc`), hiện ở Thông tin phiếu của màn chi tiết (`js/sx-bat-thuong.js`).
- Lưu ý: danh sách Quản lý quy trình hiện chỉ có quy trình ĐTMS (MS01…MS19); phiếu mẫu cũ chưa có quy trình, sửa lại phiếu thì phải chọn.

## 2026-11-25 · Menu Quản lý quy trình
- Thêm nhóm menu **Quản lý quy trình** (Quản lý quy trình, Ma trận hành động, Giám sát tiến trình) dùng nguyên màn của ĐTMS, route `#/sx/quy-trinh`, `#/sx/ma-tran/…`, `#/sx/giam-sat-tien-trinh` (giữ sidebar Sản xuất; link trong màn tự thêm tiền tố `sx/` — `js/app.js`, `js/ma-tran.js`).
- Đổi tài khoản trong phân hệ Sản xuất có thêm Người dùng quản trị quy trình (Cao Thị Hạnh).

## 2026-11-25 · Việc của tôi: một danh sách, trạng thái chi tiết, kết quả xử lý
- Việc của tôi (`js/sx-flow.js`): gộp 2 tab thành 1 danh sách, việc chưa xử lý lên trước; bỏ Mã dự án (hiện tên dự án, link + tooltip "Xem chi tiết dự án"), bỏ Ngày nhận việc, bỏ đếm bước n/N; cột Nội dung cần thực hiện (bấm mở màn Xử lý) + cột Thao tác (icon mở); Ngày xử lý kèm giờ.
- Thêm cột Kết quả xử lý (Đồng ý / Bị từ chối), bộ lọc Chu kỳ (hôm nay, tuần, tháng, quý, năm); trạng thái chi tiết theo việc của bước (Đang soạn hồ sơ, Chờ phê duyệt, Chờ tiếp nhận…).
- Màn Xử lý công việc của dự án: Thông tin chung rút gọn còn thông tin chính. Danh sách dự án sản xuất: link mã dự án có tooltip "Xem chi tiết dự án".

## 2026-11-25 · Dashboard: góp ý lần 2
- Số liệu tổng hợp lên đầu trang; bỏ bảng Dự án trọng yếu, quan trọng — gộp vào **Danh sách dự án trọng yếu, bị chậm** (thêm cột Giai đoạn hiện tại, Tiến độ; Mức độ chỉ gắn thẻ Trọng yếu).
- Cảnh báo 5 nhóm: Chuyển giao từ nghiên cứu, Cung ứng vật tư, Bất thường sản xuất, Thay đổi kỹ thuật, Nghiệm thu — quá hạn hoặc sắp đến hạn (ghi chú: sắp đến hạn = trong 1 tuần tới).
- Nhấn ô cảnh báo / biểu đồ: điều hướng sang màn danh sách tương ứng, lọc sẵn đúng bản ghi (dải Đang lọc từ Dashboard + Bỏ lọc, `js/thau.js` listPage dùng chung) thay cho ngăn chi tiết.
- Link dự án có tooltip "Xem chi tiết dự án".

## 2026-11-25 · Dashboard theo nhóm vai
- Dashboard (SX-01, `js/sx-bao-cao.js`) chia 4 nhóm vai: Tổng Giám đốc (toàn VHT; thêm vai mẫu `sxceo`), Phó TGĐ / Ban Giám đốc Khối / Giám đốc Trung tâm (đơn vị mình), PM (dự án mình), Chuyên viên quản lý tiến độ (cảnh báo lên đầu).
- Thêm khối **Việc chờ quyết định** dạng Step (kiểu Trello): Tổng Giám đốc → Phó TGĐ → Ban Giám đốc Khối → Ban Giám đốc Trung tâm; thẻ gồm tên dự án, việc, hạn xử lý. Việc mẫu GIẢ LẬP + hồ sơ luồng đang chờ thật.
- Thêm **Danh sách dự án bị chậm**: chậm ở đơn vị nào, bao lâu, tiến độ thực tế so với kế hoạch.
- Ô cảnh báo hiện nội dung chữ và tên dự án (không hiện mã); bảng dự án chỉ lấy dự án Trọng yếu, Quan trọng (thuộc tính `tier` của dự án). Số liệu tổng hợp đẩy xuống dưới, giữ nguyên bộ lọc.

## 2026-11-23 · Luồng Nhiệm vụ → Phương án sản xuất kinh doanh → Dự án
- Menu "Tiếp nhận nhiệm vụ, đầu vào" đổi thành **Phương án sản xuất kinh doanh** (`js/sx-pasxkd.js`, thay `sx-dau-vao.js`): danh sách (KPI theo trạng thái), chi tiết (Thông tin chung · Hoàn thiện đầu vào B1.1–B1.4 · Lịch sử), lập từ nhiệm vụ đơn vị, Trình (chỉ khi đủ 4 nội dung), Ban Giám đốc Khối Phê duyệt / Trả lại (lý do), nút Lập dự án sản xuất.
- Bỏ tab Đầu vào (B1) và cảnh báo ở Chi tiết dự án — giữ nguyên các tab cũ.
- Thêm mới dự án: căn cứ cố định PASXKD, chỉ chọn PASXKD **Đã phê duyệt** chưa lập dự án; điền sẵn mô hình tổ chức, giám đốc dự án, ngày bắt đầu; lưu xong gắn dự án vào nhiệm vụ. Văn bản căn cứ ở Chi tiết dự án mở PASXKD.
- Nhiệm vụ đơn vị: không bắt buộc Dự án (nhiệm vụ giao trước khi có dự án); chi tiết có nút Lập phương án SXKD và liên kết PASXKD; thêm 4 nhiệm vụ mẫu NV-SX-2026-005…008.

## 2026-11-19 · Đề xuất mua sắm: cột Dự án
- Danh sách Đề xuất mua sắm (phân hệ Sản xuất): cột Đề tài / dự án đổi thành Dự án, hiện mã — tên dự án sản xuất; bộ lọc nâng cao theo Dự án (`js/luong.js`, chỉ ở chế độ Sản xuất).

## 2026-11-19 · Thay đổi kỹ thuật: bỏ Thêm mới (đồng bộ từ KHCN); bất thường: khoảng cách khối
- Thay đổi kỹ thuật (`js/sx-thay-doi.js`): bỏ Thêm mới ở danh sách, bỏ Thêm mới ECR ở tab dự án và nút Mở yêu cầu thay đổi kỹ thuật ở phiếu bất thường Loại 2; dữ liệu đồng bộ từ phân hệ KHCN.
- Bất thường › Phân tích và xử lý: các khối cách nhau 20px như màn khác.

## 2026-11-19 · Bất thường: phiếu Lưu nháp (Xóa, Sửa), Chỉnh sửa tab Phân tích và xử lý
- Thêm trạng thái Lưu nháp: nút Lưu nháp ở form Thêm mới giờ lưu phiếu nháp; chi tiết phiếu nháp có Xóa, Sửa (Sửa mở lại form, Xác nhận thì gửi phiếu vào luồng). Dữ liệu mẫu BT-2026-005.
- Tab Phân tích và xử lý: nút Chỉnh sửa chỉ hiện khi phiếu Đang xử lý (không hiện khi Đã đóng hoặc trạng thái khác); 4 khối thẻ như các màn khác, bỏ chữ Khối 1–4.

## 2026-11-19 · Bất thường: form Thêm mới; Dự án: Kế hoạch 11–15, OQC, Nghiệm thu
- Thêm mới phiếu bất thường: bỏ bắt buộc BM.QLBT.01; Các tài liệu liên quan = tải nhiều tệp, có nút xoá tệp chọn nhầm (eform-run: filepicker `accumulate`); Thời gian xảy ra lỗi = một ô ngày giờ (datetime `withTime`).
- Dự án › Kế hoạch: nút Xem chi tiết thêm mục 11–13 → tab Chất lượng & nghiệm thu, 14 → Nghiệm thu sản phẩm, 15 → tab Tài liệu; route `#/sx/du-an/<mã>/<tab>`.
- Tab Chất lượng & nghiệm thu: thêm khối Đánh giá chất lượng xuất xưởng (OQC) — tự thêm nội dung đánh giá, đạt đủ thì xác nhận hoàn thành, có nội dung không đạt thì liên kết Tạo phiếu bất thường, bảng lưu dữ liệu OQC; đổi Nghiệm thu theo lô thành Nghiệm thu, thêm bảng Thông tin nghiệm thu nhập tay (thêm / sửa / xoá).

## 2026-11-19 · Bất thường: chi tiết phiếu theo BM.QLBT.02
- Tab Thông tin phiếu: thêm khối Thông tin xác nhận của hai bên tại hiện trường (đã có ảnh / video lỗi, hồ sơ đính kèm, đối sách tức thời).
- Tab Phân tích và xử lý: 4 khối — Xác minh & phân tích nguyên nhân (6M+1), Phương án xử lý (số PAXL, cấp duyệt, 2 bảng khắc phục / ngăn ngừa, lịch sử NOK), Triển khai & bàn giao tiền xử lý, Lịch sử nghiệm thu & bài học kinh nghiệm (tag).
- Tab Tiến trình: tách Hạn xử lý (SLA) / Hoàn thành thực tế (`js/sx-flow.js`), chọn phiên bản hồ sơ HSBT-…-01/-02; route `#/sx/bat-thuong/<mã>/<info|xl|tt>`. Dữ liệu mẫu BT-2026-001 có 2 vòng (vòng 1 NOK).

## 2026-11-19 · Dự án sản xuất: Thông tin chung theo BM.QLHDSX.01, tab Kế hoạch
- Tab Kế hoạch & mốc đổi tên Kế hoạch; cột Công việc thay bằng cột Thao tác với nút Xem chi tiết: mục 4 → Đề xuất mua sắm, mục 5 → Hồ sơ chuyển giao, mục 6, 7 → tab Điều kiện sản xuất, mục 9 → tab Bán thành phẩm & tiến độ, mục 10 → tab Chất lượng & nghiệm thu (`js/sx-du-an.js`).
- Thông tin chung thêm theo BM.QLHDSX.01: Số kế hoạch, Ngày phê duyệt, Cấp phê duyệt, Đơn vị lập, Đơn vị phối hợp, Mục tiêu (Objective), OKRs, Yêu cầu, Rủi ro đề xuất (GIẢ LẬP dữ liệu mẫu).

## 2026-11-19 · Nhu cầu vật tư có Danh mục; Đề xuất mua sắm đồng bộ ĐXMS
- Nhu cầu vật tư (`js/sx-nhu-cau.js`): 2 khối — Danh mục vật tư (tổng số theo MBOM × số lượng dự án) và Nhu cầu vật tư (số lượng cần trước ngày cần); cột Mã nhu cầu → Mã đề xuất, bỏ cột Đề xuất mua sắm; dữ liệu mẫu tách 2 đợt, tồn kho trừ dần theo ngày cần.
- Nhu cầu vật tư: Danh mục vật tư chuyển xuống dưới bảng Nhu cầu, phân trang 10 dòng; bảng Nhu cầu xếp Chưa đề xuất / Trễ hạn lên trước.
- Bỏ menu "Gói thầu, hợp đồng" (`js/sx-data.js`); route `#/sx/goi-thau-hd` giữ nguyên.
- Đề xuất mua sắm (`js/sx-mua-sam.js`, `js/luong.js`): danh sách và chi tiết dùng lại nguyên giao diện ĐXMS (7 tab, chỉ ĐXMS nguồn Sản xuất), bỏ Thêm, Sửa, Xóa, Xuất Excel, Điều chỉnh; thêm ĐXMS-2026-0058 / 0066 vào `js/data.js`.

## 2026-11-18 · Bỏ menu Việc của tôi, thêm biểu đồ Dashboard
- Bỏ mục menu "Việc của tôi" khỏi nhóm Quản lý nhiệm vụ (`js/sx-data.js`); route `#/sx/viec-cua-toi` và màn xử lý việc giữ nguyên, vẫn mở được từ Gợi ý cho bạn.
- Dashboard (`js/sx-bao-cao.js`): thêm khối Biểu đồ — tiến độ dự án (thực hiện so với kế hoạch), dự án theo trạng thái, phiếu bất thường theo trạng thái, thay đổi kỹ thuật theo trạng thái, KPI quy trình so với mục tiêu.
- Dashboard: khối Số dự án đổi thành 2 biểu đồ tròn (dự án theo trạng thái, dự án đang thực hiện theo tiến độ); bỏ khối Gợi ý cho bạn và biểu đồ cột trùng trạng thái.
- Việc cá nhân (`js/sx-cong-viec.js`): bỏ nút Nhập Excel và Thêm mới, giữ Xuất Excel; Nhiệm vụ đơn vị giữ nguyên.
- Danh sách dự án (`js/sx-du-an.js`): thêm hàng ô tổng hợp số lượng theo trạng thái và có mốc chậm, bấm để lọc nhanh như Nhiệm vụ đơn vị.

## 2026-11-18 · Quản lý bất thường, Dashboard lọc theo năm
- Dashboard: thêm bộ lọc Năm (dự án có thời gian thực hiện giao với năm chọn), áp cho mọi chỉ số, biểu đồ và Báo cáo dùng chung bộ lọc.
- Danh sách bất thường (`js/sx-bat-thuong.js`): thêm cột Ngày xử lý, Mã SP, Serial, Nhóm nguyên nhân, Mã TĐKT liên kết; tìm kiếm nâng cao thêm Mã SP, Serial, Nhóm nguyên nhân, Mã TĐKT liên kết.
- Thêm mới bất thường (`js/eforms/sx-bt.js`, form lap): bổ sung thông tin sản phẩm (tên, mã, khách hàng, đơn vị sản xuất, serial, cỡ mẫu → tự tính % lỗi), Thời gian xảy ra lỗi dạng Ngày + Giờ, Nơi phát hiện / Công đoạn / Ca sản xuất / Đơn vị tính từ danh mục, Số hiệu thao tác, Yêu cầu kỹ thuật vi phạm, Loại và Mức độ (Rất nghiêm trọng, Nghiêm trọng, Trung bình, Thấp), bảng Đối sách tức thời (thêm, xoá dòng; người thực hiện dạng dropdown tìm kiếm), Phân tích sơ bộ và xác nhận hiện trường (7 nhóm nguyên nhân, nhân sự kiểm tra, nhân sự tham gia), tài liệu tách Ảnh / video lỗi và Tài liệu liên quan.
- Danh mục mới (`js/sx-data.js`): Nơi phát hiện, Đơn vị tính số lượng, Công đoạn sản xuất, Ca sản xuất, Nhóm nguyên nhân bất thường; mức độ 4 đổi tên Thấp.
- File dùng chung: `js/eform-run.js` thêm `properties.rowNo` cho bảng lặp (hiện TT 1, 2, 3 trên mỗi dòng).
