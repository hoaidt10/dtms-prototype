<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Khảo sát/Khối 1/Báo cáo khảo sát quản lý sản xuất Khối 1.docx -->
<!-- pk-sha256: dfb8027ed775ddd1ce1e0b9d5de16d3db3ec0ad88c80b3aefcccb42619b38e37 -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SX-KS-K1 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Khảo sát/Khối 1/Báo cáo khảo sát quản lý sản xuất Khối 1.docx`. Trích dẫn thì ghi mã **SX-KS-K1** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**BÁO CÁO KHẢO SÁT NGHIỆP VỤ**

**Phân hệ Quản lý Sản xuất – Khối 1**

------------------------------------------------------------------------

# Thông tin tài liệu

**Bảng 1: Thông tin quản trị tài liệu**

| **Thuộc tính** | **Nội dung chi tiết** |
|----|----|
| **Tên tài liệu** | Báo cáo khảo sát nghiệp vụ, yêu cầu người dùng và thiết kế quy trình Phân hệ Quản lý Sản xuất Khối 1 |
| **Phiên bản** | 1.0 |
| **Đơn vị áp dụng** | Khối 1 |
| **Phạm vi** | Tổng hợp nhu cầu của 6 nhóm vai trò; chuẩn hóa 3 quy trình sản xuất cốt lõi; đối chiếu với 6 công đoạn COP2; Khảo sát thực trạng VMMS |
| **Căn cứ** | 94 file tài liệu + 3 quy trình cốt lõi |

# Thuật ngữ và chữ viết tắt

**Bảng 2: Danh mục thuật ngữ và từ viết tắt**

| **Thuật ngữ** | **Diễn giải chi tiết** |
|----|----|
| **VHT / TCT** | Tổng công ty Công nghiệp Công nghệ cao Viettel |
| **Khối 1** | Khối nghiên cứu, chế thử và sản xuất tổ hợp trang thiết bị công nghệ cao quân sự |
| **TTSX / ĐV QLSX** | Trung tâm Sản xuất / Đơn vị Quản lý Sản xuất |
| **ĐV NCPT / R&D** | Đơn vị Nghiên cứu Phát triển sản phẩm |
| **ĐV ĐBCL / QA / QC** | Đơn vị Đảm bảo và Kiểm soát Chất lượng |
| **TTMS / ĐTMS** | Trung tâm Mua sắm / Phần mềm chuyên ngành Đầu tư Mua sắm |
| **VMC** | Công ty Mua sắm Sản xuất Viettel |
| **VMIC** | Công ty Cơ khí Viettel |
| **VMMS** | Viettel Manufacturing Management System – Hệ thống quản lý, điều hành dữ liệu sản xuất |
| **PM / Sub PM** | Giám đốc dự án sản xuất / Cán bộ phụ trách bán thành phẩm |
| **COP1 / COP2 / COP3** | Nghiên cứu làm chủ công nghệ / Quản lý tổ chức sản xuất / Kinh doanh và thực hiện cam kết khách hàng |
| **BOM / eBOM / mBOM** | Định mức vật tư / BOM thiết kế / BOM sản xuất |
| **IQC / IPQC / OQC** | Kiểm tra chất lượng đầu vào / Kiểm soát chất lượng công đoạn / Đánh giá chất lượng xuất xưởng |
| **ECR / ECO / ECN** | Yêu cầu thay đổi kỹ thuật / Lệnh thay đổi kỹ thuật / Thông báo thay đổi kỹ thuật |
| **Log QLDA** | Nhật ký quản lý dự án, ghi nhận cấu hình, thay đổi kỹ thuật và quyết định dự án |
| **4M** | Man – Nhân lực; Machine – Máy móc, thiết bị; Material – Vật tư, kinh phí; Method – Tài liệu và phương pháp công nghệ |
| **CCDC / TTB / PTĐ** | Công cụ dụng cụ / Trang thiết bị / Phương tiện đo lường, thử nghiệm |
| **CTKT / QTCN** | Chỉ tiêu kỹ thuật / Quy trình công nghệ |
| **PAKD / PASXKD** | Phương án kinh doanh / Phương án sản xuất kinh doanh |
| **Leadtime / Export License / EOL** | Thời gian cung ứng / Giấy phép xuất khẩu / Linh kiện ngừng sản xuất |

# 1. Tổng quan và bối cảnh nghiệp vụ

## 1.1. Đặc thù hoạt động sản xuất Khối 1

Khối 1 đảm nhiệm nghiên cứu, chế thử và sản xuất các tổ hợp công nghệ cao quân sự như ra-đa, tác chiến điện tử, thông tin quân sự, quang điện tử và điều khiển vũ khí. Hoạt động sản xuất có một số đặc thù chính:

- **Cấu trúc sản phẩm phức tạp:** Một tổ hợp điển hình có khoảng 2.000–3.000 mã linh kiện, cấu thành từ nhiều phân hệ.

- **Chuỗi cung ứng dài và nhạy cảm:** Nhiều linh kiện công nghệ cao có leadtime từ 6–12 tháng, phụ thuộc nhà cung cấp, giấy phép xuất khẩu (Export License) và nguy cơ EOL.

- **Hai mô hình tổ chức sản xuất:** Áp dụng linh hoạt theo từng dự án:

  - **Mô hình 1:** Tổ chức mua sắm vật tư, sau đó VMC thực hiện vai trò tổng thầu chế tạo, tích hợp và đo kiểm.

  - **Mô hình 2:** TTSX trực tiếp mua linh kiện, thuê đơn vị gia công bên ngoài và tổ chức tích hợp, đo kiểm.

- **Kiểm thử nhiều cấp:** Ngoài OQC tại nhà máy, sản phẩm có thể phải tích hợp tại trận địa và thử nghiệm thực tế với đơn vị sử dụng theo chỉ tiêu được phê duyệt.

- **Yêu cầu dữ liệu kịp thời:** Thông tin tồn kho, tiến độ và tình trạng vật tư cần được cập nhật đồng bộ để PM đánh giá chính xác khả năng đáp ứng kế hoạch.

## 1.2. Thực trạng hệ thống

**Bảng 3: Đánh giá phạm vi và hạn chế của các hệ thống hiện tại**

| **Hệ thống / Hạ tầng** | **Phạm vi và hạn chế được ghi nhận** |
|----|----|
| **VMMS** | Đã hỗ trợ một số nghiệp vụ tại nhà máy, nổi bật là kết nối trạm đo và thu thập dữ liệu đo kiểm; tuy nhiên, chuỗi nghiệp vụ chưa được chuẩn hóa xuyên suốt từ R&D đến hoàn thành sản xuất. |
| **Hạ tầng truy cập** | Các hệ thống bị giới hạn trong mạng LAN nội bộ. Cán bộ làm việc tại nhà máy đối tác hoặc trận địa khó cập nhật trực tiếp, dẫn đến phụ thuộc báo cáo thủ công và nhập liệu hộ. |

## 1.3. Khó khăn và rủi ro chính

**Bảng 4: Ma trận khó khăn nghiệp vụ và ảnh hưởng thực tế**

| **Nhóm nghiệp vụ** | **Hiện trạng** | **Ảnh hưởng** |
|----|----|----|
| **Bàn giao R&D – Sản xuất** | Danh mục hồ sơ kỹ thuật được bàn giao chưa đồng bộ; một số tài liệu còn ở dạng dự thảo. | Thiếu căn cứ kỹ thuật để triển khai chế tạo; khó xác định trách nhiệm khi sản phẩm không đạt yêu cầu. |
| **Kế hoạch vật tư** | Chưa lập đầy đủ kế hoạch ngược theo ngày cần vật tư, leadtime, thời gian mua sắm và Export License; tra cứu tồn kho còn chậm. | Thiếu linh kiện đồng bộ, vật tư về không đúng thời điểm, ảnh hưởng tiến độ và hiệu quả sử dụng vốn. |
| **Giám sát sản xuất** | Chưa quản lý toàn trình Quy trình hoạt động sản xuất | Không truy xuất được đầy đủ thông tin của dự án từ bước Lập kế hoạch, Trước sản xuất, Trong sản xuất, Sau sản xuất |
| **Xử lý bất thường** | Chưa có công cụ quản lý tập trung, theo dõi SLA và cảnh báo quá hạn. | Kéo dài thời gian dừng dây chuyền, tăng nguy cơ phế phẩm và lặp lại lỗi. |
| **Thay đổi kỹ thuật** | ECR/ECO/ECN và Log QLDA còn xử lý thủ công; việc cập nhật tài liệu xuống nhà máy có thể chậm. | Nguy cơ sử dụng nhầm phiên bản bản vẽ, firmware hoặc BOM. |
| **Dữ liệu kho** | Chưa có cơ chế đồng bộ tự động với ERP Kho TCT theo mô tả khảo sát; việc xác minh tồn kho khả dụng còn thủ công, làm chậm quá trình lập kế hoạch và mua sắm. | Khó đánh giá thực trạng tồn kho để lập kế hoạch đầu tư mua sắm. |

## 1.4. Mục tiêu cải tiến

- **Kiểm soát chuyển giao R&D:** Số hóa và kiểm tra đủ danh mục hồ sơ kỹ thuật trước khi cho phép khởi động sản xuất.

- **Tăng cường điều hành tập trung:** Kết nối quản lý dự án, kế hoạch, sản lượng và dữ liệu hiện trường trên một hệ thống; Kết hợp với dashboard thống kê số liệu trực quan; hỗ trợ cập nhật an toàn qua Web/Mobile.

- **Điều hành sản xuất:** Cho phép quản lý tiến độ, vật tư và đo kiểm theo từng bán thành phẩm; tổ chức tích hợp song song khi đáp ứng điều kiện kỹ thuật.

- **Số hóa bất thường và thay đổi kỹ thuật:** Quản lý phân loại, SLA, phê duyệt và liên thông ECR–ECO–ECN với Log QLDA.

- **Tích hợp chuỗi cung ứng:** Kết nối ĐTMS và ERP Kho TCT để đồng bộ trạng thái mua sắm, hợp đồng, giao nhận và tồn kho.

## 1.5. Tổng quan bài toán đặt ra

Theo tài liệu CDS_BT_03COP_Ban_bien_tap_BA.pdf, quy trình Quản lý Sản xuất COP2 gồm 6 nhu cầu quản lý:

**1. Tiếp nhận nhiệm vụ, hoàn thiện đầu vào và lập PASXKD.**

**2. Thẩm định, phê duyệt PASXKD.**

**3. Chuẩn bị mua sắm, lựa chọn nhà thầu, ký hợp đồng.**

**4. Theo dõi cung ứng, tổ chức chế tạo và tích hợp.**

**5. Thử nghiệm, kiểm tra xuất xưởng và nghiệm thu.**

**6. Thanh quyết toán hợp đồng và hoàn tất sản xuất**

# 2. Yêu cầu người dùng theo nhóm vai trò

## 2.1. Lãnh đạo và cơ quan giám sát

- **Phê duyệt điện tử:** Phê duyệt điện tử kế hoạch sản xuất, phương án xử lý bất thường, ECO và ECN theo thẩm quyền.

- **Dashboard điều hành:** Theo dõi Dashboard về tiến độ, giải ngân, vật tư leadtime dài và bất thường gần/quá hạn SLA.

- **Chỉ đạo & Đôn đốc:** Gửi chỉ đạo, đôn đốc tới cá nhân/đơn vị liên quan qua thông báo hệ thống.

## 2.2. Nghiên cứu và Phát triển (R&D)

- **Hồ sơ kỹ thuật:** Đăng tải, quản lý và bàn giao danh mục hồ sơ kỹ thuật cho QLSX.

- **Xử lý sự cố Loại 2:** Tiếp nhận, phân tích và xử lý bất thường Loại 2 trong thời hạn SLA.

- **Thay đổi kỹ thuật:** Tiếp nhận ECR; đánh giá ảnh hưởng đến cấu hình, BOM, tiến độ và chi phí; lập ECO, triển khai thay đổi và phát hành ECN.

- **Cập nhật Log QLDA:** Tự động ghi nhận mã ECO, ECN và phiên bản tài liệu có hiệu lực vào Log QLDA.

- **Thử nghiệm hiện trường:** Chủ trì xây dựng kịch bản và phối hợp thử nghiệm thực tế tại trận địa.

## 2.3. Đơn vị Quản lý Sản xuất (TTSX)

- **Lập kế hoạch:** Khởi tạo dự án, lập phương án và kế hoạch sản xuất; thiết lập Milestone, WBS và kế hoạch sản lượng.

- **Theo dõi cung ứng:** Theo dõi leadtime, Export License, nhu cầu mua sắm và khả năng đáp ứng vật tư.

- **Điều kiện 4M:** Kiểm tra điều kiện 4M theo BM.QLHDSX.02.

- **Kiểm tra tồn kho và lập tờ trình mua sắm.**

- **Phối hợp nhà máy:** Thống nhất phương án tổ chức sản xuất, đầu mối và thẩm quyền với nhà máy theo BM.QLHDSX.04.

- **Phân rã bán thành phẩm:** Phân rã kế hoạch theo Sub PM và phiên bản thử nghiệm; theo dõi tiến độ, vật tư và sản lượng.

- **Chủ trì xử lý bất thường:** Khởi tạo, phân loại và chủ trì xử lý bất thường thuộc thẩm quyền; chuyển R&D xử lý khi phát sinh lỗi thiết kế.

- **Cập nhật hiện trường:** Cập nhật sản lượng, hình ảnh, sự cố và biên bản nghiệm thu tại hiện trường qua Web/Mobile.

## 2.4. Đảm bảo Chất lượng (ĐBCL)

- **Kiểm tra IQC:** Kiểm tra IQC, đối chiếu CO, CQ, CoC và Test Report; xác nhận kết quả trước khi cấp phát vật tư.

- **Giám sát IPQC:** Giám sát IPQC theo lưu trình đo kiểm; lập báo cáo bất thường khi phát hiện sai lệch.

- **Thẩm định & OQC:** Thẩm định kết quả thay đổi kỹ thuật ECN và tổ chức OQC đối với sản phẩm hoàn thiện.

- **Nghiệm thu:** Hoàn thiện hồ sơ nghiệm thu cấp TCT, biên bản HOC và chứng chỉ chất lượng.

## 2.5. Trung tâm Mua sắm (TTMS)

- **Tiếp nhận đề xuất:** Tiếp nhận đề xuất mua sắm, mBOM dự toán và yêu cầu kỹ thuật từ phân hệ sản xuất qua API.

- **Đồng bộ gói thầu:** Đồng bộ trạng thái lựa chọn nhà thầu và xử lý gói thầu từ ĐTMS về hệ thống sản xuất.

- **Đồng bộ hợp đồng:** Đồng bộ thông tin hợp đồng, nhà thầu, giá trị, phụ lục hàng hóa, lịch giao hàng và trạng thái nhập kho.

- **Tra cứu tồn kho:** Cung cấp API tra cứu tồn kho khả dụng từ ERP Kho TCT theo mã linh kiện.

## 2.6. Đơn vị sản xuất trực tiếp (VMC/đối tác ngoài)

- **Tiếp nhận tài liệu:** Truy cập Partner Web Portal để nhận tài liệu kỹ thuật, QTCN và bản vẽ theo phân quyền.

- **Cập nhật sản lượng:** Cập nhật sản lượng, nhật ký đo kiểm; tiếp nhận dữ liệu tự động từ trạm đo nếu có tích hợp.

- **Triển khai khắc phục:** Tiếp nhận và triển khai phương án xử lý bất thường, ECO/ECN; phối hợp ĐBCL xác nhận kết quả.

# 3. Các quy trình nghiệp vụ cốt lõi

## 3.1. Quản lý hoạt động sản xuất toàn trình (QT.VHT.TTSX.4A.1.1)

Mã quy trình: QT.VHT.TTSX.4A.1.1. Quy trình gồm 15 bước, chia thành 4 giai đoạn:

**Bảng 5: Quy trình 15 bước Quản lý hoạt động sản xuất (QT.4A.1.1)**

| **Giai đoạn** | **Bước** | **Nội dung chính** |
|----|:--:|----|
| **1. Lập kế hoạch** | 1 | Lập báo cáo phương án sản xuất trên cơ sở kế hoạch SXKD, phương án kinh doanh và danh mục linh kiện leadtime dài. |
|  | 2 | Lập kế hoạch sản xuất dự án theo BM.QLHDSX.01, kèm 6 phụ lục: cấu hình sản phẩm, lưu trình đo kiểm, danh mục gói thầu, linh kiện leadtime dài/Export License, phân rã phạm vi và tiến độ WBS. |
|  | 3 | Kick-off, giao nhiệm vụ PM/nhóm dự án và xác lập Baseline Milestones. |
| **2. Chuẩn bị sản xuất – 4M** | 4 | Bảo đảm vật tư và kinh phí; kết nối ĐTMS, ERP Kho TCT; thực hiện IQC trước khi cấp phát. |
|  | 5 | Kiểm soát danh mục hồ sơ chuyển giao R&D theo BM.QLHDSX.03 và chuẩn bị QTCN. |
|  | 6 | Bảo đảm nhân lực, năng lực và đào tạo chuyển giao công nghệ theo BM.QLHDSX.02. |
|  | 7 | Bảo đảm máy móc, CCDC, TTB, PTĐ và điều kiện môi trường sản xuất theo BM.QLHDSX.02. |
| **3. Tổ chức sản xuất và giao hàng** | 8 | Thống nhất phương án tổ chức sản xuất với nhà máy theo BM.QLHDSX.04. |
|  | 9 | Theo dõi, cập nhật sản lượng hằng ngày và so sánh tiến độ thực tế với kế hoạch. |
|  | 10 | Kiểm soát IPQC; phát hiện sai lỗi thì kích hoạt QT.4A.1.2. |
|  | 11 | Thử nghiệm thực tế tại trận địa nếu có yêu cầu. |
|  | 12 | Đánh giá OQC đối với sản phẩm hoàn thiện. |
|  | 13 | Nghiệm thu cấp TCT, lập HOC và phát hành chứng chỉ chất lượng. |
|  | 14 | Bao gói, nhập kho, bảo quản và đối chiếu số lượng/mã sê-ri. |
| **4. Lưu trữ và truy xuất** | 15 | Lưu hồ sơ sản xuất theo từng số máy/số sê-ri để phục vụ tra cứu và truy xuất nguồn gốc. |

## 3.2. Quản lý bất thường trong sản xuất (QT.VHT.TTSX.4A.1.2)

Mã quy trình: QT.VHT.TTSX.4A.1.2. Quy trình gồm 6 bước:

**Bước 1. Báo cáo:** ĐBCL lập phiếu BM.QLBT.01 khi phát hiện bất thường, ghi nhận hiện tượng và nguyên nhân sơ bộ.

**Bước 2. Tiếp nhận, phân tích:** QLSX tiếp nhận trong 24 giờ làm việc và chủ trì phân tích nguyên nhân gốc rễ.

**Bước 3. Đề xuất phương án:** QLSX lập BM.QLBT.02 và trình cấp có thẩm quyền phê duyệt.

**Bước 4. Triển khai:** QLSX xử lý Loại 1; R&D xử lý Loại 2; nhà máy xử lý Loại 3.

**Bước 5. Kiểm tra kết quả:** ĐBCL xác nhận. Nếu đạt (OK), chuyển kết thúc; nếu không đạt (NOK), quay lại bước đề xuất phương án.

**Bước 6. Lưu hồ sơ:** Lưu toàn bộ hồ sơ và bài học kinh nghiệm theo dự án.

### 3.2.1. Phân loại bất thường

**Bảng 6: Phân loại bất thường trong sản xuất**

| **Loại** | **Đơn vị xử lý** | **Ví dụ theo tài liệu** |
|:--:|----|----|
| **Loại 1** | **QLSX** | Sai lệch cài đặt máy đo, cấu hình phần mềm công cụ hoặc điều chuyển linh kiện tương đương đã được phê duyệt. |
| **Loại 2** | **R&D** | Lỗi thiết kế, sai QTCN, dung sai cơ khí không phù hợp hoặc linh kiện EOL cần thay đổi thiết kế. Trường hợp này liên thông QT.4A.1.3. |
| **Loại 3** | **Nhà máy** | Lỗi thao tác, máy móc gia công, quá trình hàn dán SMT hoặc phương tiện đo tại nhà máy. |

### 3.2.2. SLA xử lý bất thường (ngày làm việc)

**Bảng 7: Khung thời hạn cam kết SLA xử lý bất thường**

| **Phân loại** | **Rất nghiêm trọng** | **Nghiêm trọng** | **Trung bình** | **Ít nghiêm trọng** |
|----|:--:|:--:|:--:|:--:|
| **Loại 1 – QLSX** | 17 ngày | 14 ngày | 12 ngày | 10 ngày |
| **Loại 2 – R&D** | 20 ngày | 17 ngày | 15 ngày | 13 ngày |
| **Loại 3 – Nhà máy** | Theo quy trình nhà máy | Theo quy trình nhà máy | Theo quy trình nhà máy | Theo quy trình nhà máy |

## 3.3. Quản lý thay đổi kỹ thuật trong sản xuất (QT.VHT.TTSX.4A.1.3)

Mã quy trình: QT.VHT.TTSX.4A.1.3. Quy trình gồm 7 bước:

**Bước 1. Lập ECR:** QLSX lập yêu cầu thay đổi theo BM.VHT.TTSX.01-SXL.07 khi phát sinh bất thường Loại 2, nhu cầu cải tiến hoặc linh kiện EOL.

**Bước 2. Phân tích:** R&D đánh giá tính khả thi và ảnh hưởng đến cấu hình, eBOM, tiến độ, chi phí.

**Bước 3. Lập ECO:** R&D xây dựng giải pháp, lập BM.VHT.TTSX.01-SXL.08 và trình phê duyệt.

**Bước 4. Cập nhật Log QLDA:** Ghi nhận mã ECO sau khi được duyệt theo BM.VHT.TTSX.01-SXL.10.

**Bước 5. Thực hiện và thẩm định ECN:** R&D cập nhật bản vẽ, firmware, eBOM và lập ECN theo BM.VHT.TTSX.01-SXL.09; ĐBCL đo kiểm mẫu và thẩm định.

**Bước 6. Cập nhật Log QLDA:** Ghi nhận mã ECN, ngày ban hành và phiên bản tài liệu mới.

**Bước 7. Bàn giao:** QLSX tiếp nhận hồ sơ ECO/ECN, chuyển cho nhà máy áp dụng và thu hồi hoặc vô hiệu hóa tài liệu cũ.

### 3.3.1. Phân cấp phê duyệt

**Bảng 8: Ma trận phân cấp phê duyệt thay đổi kỹ thuật**

| **Cấp phê duyệt** | **Phạm vi thay đổi** |
|----|----|
| **PM Đề tài** | Tài liệu mô tả, hướng dẫn sử dụng; không ảnh hưởng cấu hình phần cứng. |
| **Giám đốc Trung tâm R&D** | Chi tiết mạch nội bộ bo mạch; không ảnh hưởng giao tiếp khối. |
| **Ban Giám đốc Khối 1** | Thay đổi thiết kế hệ thống, CTKT, BOM hoặc QTCN. |
| **Ban Tổng Giám đốc TCT** | Thay đổi vượt tổng mức đầu tư hoặc thay đổi chỉ tiêu chiến – kỹ thuật đã được cấp có thẩm quyền phê duyệt. |

## 3.4. Quan hệ giữa ba quy trình cốt lõi

- **Quy trình hoạt động sản xuất:** Điều hành xuyên suốt từ lập kế hoạch đến bàn giao sản phẩm.

- **Kích hoạt Quy trình quản lý bất thường khi có lỗi:** Khi IQC/IPQC phát hiện sai lệch, hệ thống kích hoạt Quy trình quản lý bất thường để ghi nhận, cách ly và xử lý bất thường.

- **Liên thông sang Quy trình quản lý thay đổi:** Nếu bất thường thuộc Loại 2, luồng xử lý liên thông Quy trình quản lý thay đổi để thực hiện đánh giá và xử lý bất thường.

  **Cập nhật & Bàn giao:** Sau khi ECN được phê duyệt, Log QLDA và tài liệu kỹ thuật được cập nhật; QLSX bàn giao phiên bản mới cho nhà máy để tiếp tục sản xuất.

## 3.5. Các quy trình R&D và quy trình bổ trợ liên quan

Phân hệ Quản lý Sản xuất tiếp nhận đầu ra từ các quy trình R&D (COP1) và phối hợp với các quy trình bổ trợ sau:

**Bảng 9: Danh mục quy trình R&D và quy trình bổ trợ liên quan**

| **Mã / Tài liệu** | **Nội dung** |
|----|----|
| **QT.VHT.CLKHCN.2.2.1** | Quy trình tổng thể nghiên cứu phát triển sản phẩm |
| **QT.VHT.CLKHCN.2.2.2** | Quy trình thiết kế và chế tạo mẫu phần cứng |
| **QT.VHT.CLKHCN.2.2.3** | Quy trình thiết kế, chế tạo mẫu cơ khí – kiểu dáng |
| **QT.VHT.CLKHCN.2.2.4** | Quy trình phát triển module phần mềm |
| **QT.VHT.CLKHCN.2.3.1** | Quy trình nghiên cứu phát triển sản phẩm phần mềm (Agile/Scrum) |
| **QT.VHT.CLKHCN.2.2.1_CLTTQT; báo cáo cải tiến QT.38** | Chiến lược thực hiện và cải tiến quy trình nghiên cứu phát triển sản phẩm |
| **QT.VHT.CLKHCN.2.3.1_CLTTQTPM** | Chiến lược thực thi và tài liệu kiểm thử quy trình phát triển phần mềm |
| **Quy định chuyên ngành** | Thử nghiệm sản phẩm thực tế ngoài hiện trường; quản lý và phân bổ chi phí nhân công theo đề tài/dự án |

# 4. Cổng chuyển giao R&D sang Sản xuất

Cổng chuyển giao là điểm kiểm soát đầu vào giữa COP1 và COP2, nhằm bảo đảm hồ sơ kỹ thuật sẵn sàng trước khi triển khai sản xuất. Danh mục hồ sơ được chia thành 4 nhóm:

**Bảng 10: Danh mục hồ sơ Cổng chuyển giao R&D sang Sản xuất**

| **Nhóm** | **Số lượng** | **Thành phần chính** |
|----|:--:|----|
| **I. Hồ sơ pháp lý** | 1 | Tờ trình và PASXKD đã được cấp có thẩm quyền phê duyệt. |
| **II. Sản phẩm và tài liệu kỹ thuật ngoại** | 11 | Sản phẩm mẫu/phụ kiện; cấu hình sản phẩm; eBOM và vòng đời; linh kiện leadtime dài/Export License; vật tư bảo hành; chỉ tiêu ngoại; bài đo, phương pháp đo và kết quả đo; kết quả thử nghiệm thực tế; hướng dẫn sử dụng; hướng dẫn sửa chữa, bảo dưỡng. |
| **III. Hồ sơ nghiên cứu, thiết kế** | 8 | Thuyết minh kỹ thuật; chỉ tiêu nội bộ; chỉ tiêu và phương pháp đo module; bài đo và bảng đánh giá chỉ tiêu nội; hồ sơ SXTN; lưu trình đo kiểm module/Sub PM; hồ sơ thiết kế gồm bản vẽ hệ thống, sơ đồ, nguyên lý, Gerber, bản vẽ cơ khí và thiết kế tem nhãn/bao bì. |
| **IV. Hồ sơ công nghệ và điều kiện sản xuất** | 7 | QTCN; firmware và hướng dẫn nạp; phần mềm và hướng dẫn cài đặt; hồ sơ kiểm soát chất lượng; danh mục Jig/Stencil và hướng dẫn; danh mục CCDC; biên bản thống nhất thành phần đủ điều kiện sản xuất giữa QLSX và R&D. |
| **Tổng cộng** | **27** | **Được số hóa và quản lý tập trung trên hệ thống.** |

# 5. Hiện trạng hệ thống VMMS

## 5.1. Tổng quan

VMMS là phần mềm quản lý, điều hành sản xuất do đội ngũ kỹ sư nội bộ VHT phát triển, phục vụ hoạt động tại phân xưởng và nhà máy gia công bao hàm các bước tổ chức và quản lý tiến độ sản xuất

- **Môi trường vận hành:** Tách biệt môi trường mạng ngoài phục vụ phát triển, kiểm thử bằng dữ liệu mẫu và môi trường mạng trong phục vụ dữ liệu sản xuất thực tế.

- **Điểm mạnh:** Kết nối trực tiếp trạm đo/máy đo kiểm tự động tại nhà máy; thu thập dữ liệu sản lượng và trạng thái kiểm tra của bo mạch/sản phẩm theo thời gian thực; hỗ trợ tính toán tiến độ, phát hiện chậm trễ và gửi báo cáo định kỳ.

## 5.2. Chức năng hiện có được ghi nhận

- **Quản lý đơn vị sản xuất và trạm đo:** Khai báo nhà máy/đối tác, trạm đo, dây chuyền/công đoạn và mã sê-ri sản phẩm.

- **Quản lý sản phẩm, Loại sản phẩm**

- **Danh mục dự án liên quan:** cùng phát triển 1 sản phẩm

- **Quản lý dự án sản xuất:** Quản lý thông tin, phân tách dữ liệu theo dự án và theo dõi nhiều đợt sản xuất của cùng dòng sản phẩm.

- **Theo dõi tiến độ, báo cáo:** Thu thập sản lượng từ trạm đo, cảnh báo tiến độ và gửi email báo cáo định kỳ.

- **Quản lý danh mục vật tư:** Quản lý kho linh kiện, vật tư và phân loại mức độ thông dụng.

- **Quản lý eBOM/mBOM:** Quản lý cấu trúc cây sản phẩm, danh sách BOM, lịch sử thay đổi và định mức gắn với lưu trình công nghệ.

- **Quản lý IQC:** Theo dõi kết quả kiểm tra chất lượng đầu vào của linh kiện/module gắn với hợp đồng đối tác.

- **Quản lý tài liệu.**

# 6. Kết luận 

## 6.1. Kết luận khảo sát

Qua khảo sát, có thể nhận thấy hệ thống VMMS hiện tại đã đáp ứng tương đối tốt vai trò quản lý tổ chức thực hiện và theo dõi tiến độ sản xuất. Hệ thống hỗ trợ công tác điều hành, quản lý kế hoạch và giám sát tình hình triển khai các hoạt động sản xuất tại nhà máy.

Tuy nhiên, hệ thống chưa bao quát đầy đủ các hoạt động trước và sau sản xuất. Hiện tại việc kiểm soát điều kiện đầu vào, tiếp nhận và xác nhận hồ sơ chuyển giao từ R&D, Lập đề suất mua sắm, quản lý các vấn đề phát sinh trong quá trình sản xuất, cũng như kiểm soát kết quả và đầu ra sản xuất đang thực hiện thủ công.

Do đó, cần xây dựng hệ thống Quản lý Sản xuất theo định hướng quản lý xuyên suốt toàn bộ vòng đời hoạt động sản xuất, bao quát đầy đủ **04 giai đoạn trong quy trình quản lý hoạt động sản xuất**. Hệ thống cần hình thành một luồng nghiệp vụ thống nhất, bảo đảm thông tin được kế thừa và liên thông giữa các giai đoạn; đồng thời tăng cường khả năng kiểm soát điều kiện thực hiện, tiến độ, chất lượng, vật tư và kết quả sản xuất. Qua đó, hỗ trợ công tác điều hành tập trung, nâng cao tính minh bạch và khả năng truy xuất thông tin trong toàn bộ quá trình sản xuất.

## 6.2 Định hướng của hệ thống QL sản xuất

Hệ thống Quản lý Sản xuất được định hướng phát triển thành nền tảng quản lý tập trung, liên thông từ khâu chuẩn bị sản xuất, tổ chức thực hiện đến kiểm soát và đánh giá kết quả đầu ra. Các định hướng trọng tâm bao gồm:

- **Kiểm soát chuyển giao từ R&D:** Số hóa quy trình tiếp nhận, kiểm tra và xác nhận hồ sơ kỹ thuật chuyển giao từ R&D sang sản xuất. Hệ thống cần hỗ trợ quản lý đầy đủ **danh mục hồ sơ kỹ thuật**, cho phép theo dõi tình trạng tiếp nhận, mức độ đầy đủ, tính hợp lệ và kết quả xác nhận của từng hồ sơ trước khi chuyển sang các bước tiếp theo.

- **Quản lý điều kiện đầu vào sản xuất:** Thiết lập cơ chế quản lý và kiểm soát các điều kiện cần thiết trước khi triển khai sản xuất, bao gồm các thông tin, nguồn lực và điều kiện liên quan theo yêu cầu nghiệp vụ. Qua đó, giúp xác định mức độ sẵn sàng sản xuất, kịp thời phát hiện các điều kiện chưa đáp ứng và hạn chế việc triển khai khi chưa đủ cơ sở thực hiện.

- **Tích hợp chuỗi cung ứng:** Tăng cường kết nối và trao đổi dữ liệu với các hệ thống liên quan như ĐTMS, ERP Kho TCT và hệ thống của các nhà máy. Việc tích hợp hướng tới đồng bộ thông tin phục vụ quản lý vật tư, cung ứng và hoạt động sản xuất, hạn chế nhập liệu thủ công, giảm sai lệch dữ liệu và nâng cao hiệu quả phối hợp giữa các đơn vị.

- **Tích hợp và kế thừa hệ thống VMMS:** Tận dụng các chức năng điều hành, quản lý tiến độ hiện có của VMMS; đồng thời mở rộng khả năng quản lý chi tiết theo từng bán thành phẩm. Hệ thống cần hỗ trợ theo dõi tiến độ thực hiện và tình hình vật tư tương ứng với từng bán thành phẩm, bảo đảm dữ liệu được kế thừa, đồng bộ và hạn chế trùng lặp trong quá trình quản lý.

- **Số hóa quản lý bất thường và thay đổi kỹ thuật:** Xây dựng quy trình ghi nhận, theo dõi và xử lý các vấn đề bất thường phát sinh trong quá trình sản xuất; đồng thời quản lý các yêu cầu thay đổi kỹ thuật. Từng bước tự động hóa việc theo dõi thời hạn xử lý, cảnh báo SLA và liên thông các quy trình ECR – ECO – ECN với Log QLDA, bảo đảm các yêu cầu thay đổi, quyết định xử lý và lịch sử thực hiện được ghi nhận xuyên suốt, có khả năng truy xuất.

- **Xây dựng hệ thống báo cáo và Dashboard:** Cung cấp hệ thống báo cáo, bảng điều khiển tổng hợp phục vụ công tác theo dõi và điều hành sản xuất. Thông tin cần được trình bày trực quan theo các chiều quản lý phù hợp, hỗ trợ lãnh đạo và cán bộ nghiệp vụ nắm bắt tình hình thực hiện kế hoạch, tiến độ sản xuất, tình trạng vật tư, các vấn đề bất thường và kết quả xử lý. Qua đó, hỗ trợ phát hiện sớm các điểm nghẽn và đưa ra quyết định điều hành kịp thời.

## 6.3. Nội dung cần xác nhận trước khi chốt yêu cầu

- **Phạm vi tích hợp VECO/VMMS/PMS/Kho và các hệ thống liên quan:** Cần xác định cụ thể vai trò của từng hệ thống trong kiến trúc tổng thể; hệ thống nào là hệ thống nguồn, hệ thống đích và hệ thống kế thừa dữ liệu. Đồng thời, cần làm rõ phạm vi chức năng tiếp tục sử dụng, chức năng cần mở rộng, thay thế hoặc chuyển đổi sang hệ thống Quản lý Sản xuất mới. Đối với từng phương án tích hợp, cần xác định dữ liệu trao đổi, chiều đồng bộ, tần suất đồng bộ và trách nhiệm quản lý dữ liệu giữa các hệ thống.

- **Phương án kết nối và truy cập ngoài mạng LAN:** Cần xác nhận nhu cầu truy cập hệ thống từ bên ngoài mạng LAN nội bộ, đặc biệt đối với cán bộ và đối tác cần cập nhật, tra cứu thông tin tại nhà máy hoặc trận địa. Trên cơ sở đó, cần thống nhất mô hình truy cập, phương án phân vùng mạng, cơ chế xác thực và phân quyền người dùng, cũng như các yêu cầu về bảo mật, kiểm soát truy cập và bảo vệ dữ liệu. Phương án triển khai cần bảo đảm vừa đáp ứng yêu cầu khai thác nghiệp vụ, vừa tuân thủ các quy định an toàn thông tin của đơn vị.
