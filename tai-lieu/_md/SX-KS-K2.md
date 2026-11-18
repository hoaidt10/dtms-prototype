<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Tài liệu VHT gửi/Khối 2/Báo cáo khảo sát_Phân hệ Quản lý Sản xuất_Khối 2 VHT.docx -->
<!-- pk-sha256: d1a531c68d0d49127f0266661ddc8aad8c23d7277d3126804d97fbc170133529 -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SX-KS-K2 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Tài liệu VHT gửi/Khối 2/Báo cáo khảo sát_Phân hệ Quản lý Sản xuất_Khối 2 VHT.docx`. Trích dẫn thì ghi mã **SX-KS-K2** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

# Báo cáo Khảo sát nghiệp vụ Phân hệ Sản xuất – Khối 2

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr>
<td><strong>Tên tài liệu</strong></td>
<td>Báo cáo Khảo sát nghiệp vụ Phân hệ Sản xuất – Khối 2</td>
</tr>
<tr>
<td><strong>Thành phần tham gia</strong></td>
<td><p>Đơn vị được khảo sát: Khối 2 – Viettel High Tech</p>
<ul>
<li><p>Anh Lương Văn Toản</p></li>
<li><p>Chị Vũ Thị Ngọc Lanh</p></li>
</ul>
<p>Đơn vị thực hiện khảo sát: Trung tâm phần mềm Công nghệ mới – VTIT</p>
<ul>
<li><p>Bùi Thị Thảo</p></li>
<li><p>Nguyễn Thị Nga</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Phạm vi</strong></td>
<td>Bối cảnh, hạn chế hiện tại và mong muốn của người dùng; Yêu cầu người dùng theo vai trò; Ma trận phân quyền RBAC; Quy trình nghiệp vụ; Yêu cầu phi chức năng; Ánh xạ dữ liệu API giữa Phân hệ Sản xuất (PMS) và phần mềm ĐTMS</td>
</tr>
<tr>
<td><strong>Giai đoạn đề án</strong></td>
<td>Chuyển đổi số VHT 2026 – 2027</td>
</tr>
<tr>
<td><strong>Phiên bản / Ngày</strong></td>
<td>1.0 – 06/11/2026 (cập nhật theo kết quả khảo sát nghiệp vụ)</td>
</tr>
</tbody>
</table>

### Bảng thuật ngữ viết tắt

|  |  |
|----|----|
| **VHT** | Tổng Công ty Công nghiệp Công nghệ cao Viettel - Viettel High Tech |
| **TCT / TGĐ / BGĐ** | Tổng công ty / Tổng giám đốc / Ban Giám đốc |
| **PMS** | Phân hệ Quản lý Sản xuất (Production Management System) |
| **ĐTMS** | Phần mềm chuyên ngành Đầu tư Mua sắm của Trung tâm Mua sắm |
| **QLSX** | Phòng Quản lý Sản xuất Khối 2 |
| **PAKD** | Phương án Kinh doanh |
| **R&D (VTBR / VTBG)** | Nghiên cứu & Thiết kế (Trung tâm Vô tuyến Băng rộng / Trung tâm Truyền dẫn) |
| **QA / QC** | Đảm bảo chất lượng / Kiểm soát chất lượng |
| **VMC** | Viettel Manufacturing Corporation |
| **RBAC** | Phân quyền dựa trên vai trò (Role-Based Access Control) |
| **KPI / SLA** | Chỉ số hiệu suất / Cam kết thời gian xử lý |
| **ERP Kho TCT** | Hệ thống quản lý kho của Tổng công ty |
| **MES** | Hệ thống điều hành sản xuất tại nhà máy (Manufacturing Execution System) |
| **HSMT** | Hồ sơ mời thầu |

## 1. TỔNG QUAN DỰ ÁN & BỐI CẢNH NGHIỆP VỤ KHỐI 2

### 1.1. Bối cảnh Chuyển đổi số VHT & Mô hình Tổ chức Khối 2

Đề án Chuyển đổi số toàn diện tại Viettel High Tech (VHT) giai đoạn 2026 – 2027 đặt mục tiêu số hóa và chuẩn hóa toàn bộ các phân hệ nghiệp vụ cốt lõi, bao gồm Đầu tư mua sắm, Khoa học công nghệ, Chi phí kinh doanh và Quản lý sản xuất toàn trình. Trong cơ cấu tổ chức của VHT, Khối 2 vận hành theo mô hình Đơn vị Sản xuất Kinh doanh độc lập (Product Unit - PU), chuyên trách nghiên cứu thiết kế, sản xuất và kinh doanh các dòng sản phẩm thuộc lĩnh vực Viễn thông và Tài khoản phổ thông (như trạm phát sóng 5G Macro, thiết bị truyền dẫn, Wifi Mesh, router).

Theo ghi nhận từ thực tế khảo sát nghiệp vụ, đặc thù vận hành của Khối 2 có sự khác biệt rõ rệt so với các khối khác trong Tổng công ty. Số lượng dự án sản xuất hàng năm của Khối 2 tương đối tập trung (khoảng 3 đến 5 dòng sản phẩm/dự án chính mỗi năm), tuy nhiên quy mô sản lượng trên mỗi dự án lại cực kỳ lớn, đạt hàng trăm nghìn đến hàng triệu thiết bị. Về cơ cấu nhân sự, Khối 2 sở hữu lực lượng Nghiên cứu & Thiết kế (R&D) rất mạnh với hai trung tâm nghiên cứu phần cứng (Trung tâm Vô tuyến Băng rộng - VTBR, Trung tâm Truyền dẫn - VTBG) và 5 đến 6 trung tâm phần mềm với tổng quân số hàng trăm chuyên gia. Trái lại, Phòng Quản lý Sản xuất trực thuộc Khối 2 có quy mô nhân sự rất tinh gọn (khoảng 10 nhân sự).

Mô hình hoạt động sản xuất của Khối 2 không sở hữu nhà máy hay lực lượng lao động gia công trực tiếp mà vận hành theo phương thức Quản lý dự án sản xuất (Production Project Management). Sau khi tiếp nhận yêu cầu và kế hoạch sản xuất, Phòng Quản lý Sản xuất Khối 2 sẽ lập đề xuất mua sắm, phối hợp với Trung tâm Mua sắm thông qua phần mềm chuyên ngành Đầu tư Mua sắm (ĐTMS) để tổ chức lựa chọn nhà thầu và ký hợp đồng thuê các đơn vị gia công. Đối tác sản xuất bao gồm đơn vị nội bộ Tập đoàn (Công ty Mua sắm Sản xuất Viettel - VMC) và các nhà máy gia công linh kiện/thiết bị điện tử chuyên nghiệp bên ngoài.

### 1.2. Mục tiêu Chuyển đổi số Phân hệ Sản xuất

Hiện trạng vận hành tại Khối 2 cho thấy mặc dù quy trình khung đã được Ban Tổng giám đốc phê duyệt từ năm 2022, việc thực thi thực tế vẫn chưa được tuân thủ triệt để. Do áp lực tiến độ sản xuất và nghiệm thu hàng năm, các đơn vị thường xuyên trao đổi thông tin, hồ sơ thiết kế và tiến độ thông qua email, văn bản giấy hoặc file Excel theo dạng kế hoạch cuộn (rolling plan). Dữ liệu sản xuất bị phân tán, thiếu tính đồng bộ real-time và phụ thuộc nhiều vào thao tác thủ công.

Mục tiêu cốt lõi của Phân hệ Quản lý Sản xuất Toàn trình trên hệ thống mới bao gồm:

- **Số hóa 100% tài liệu và quy trình bàn giao R&D:** Xây dựng Kho CSDL Sản phẩm Sẵn sàng Sản xuất (Release Repository) tập trung, kiểm soát chặt chẽ danh mục 20 đầu hồ sơ kỹ thuật bắt buộc trước khi kích hoạt sản xuất hàng loạt.

- **Chuẩn hóa và siết chặt quy trình nối tiếp:** Đảm bảo nguyên tắc công đoạn trước hoàn thành chuẩn chỉnh và được phê duyệt trên hệ thống thì công đoạn sau mới được kích hoạt.

- **Tích hợp dữ liệu tự động với phần mềm ĐTMS:** Thiết lập luồng trao đổi dữ liệu 2 chiều qua API với phần mềm chuyên ngành Đầu tư Mua sắm (ĐTMS) của Trung tâm Mua sắm, tự động chuyển đổi thông tin từ Đề xuất mua sắm sang Yêu cầu thầu và nhận phản hồi tiến độ, hợp đồng real-time.

- **Tích hợp dữ liệu kho real-time:** Trích xuất tự động thông tin từ Phương án Kinh doanh (PAKD) đã duyệt, liên kết dữ liệu tồn kho real-time từ hệ thống Kho Tổng công ty để giảm thời gian chờ duyệt thủ công từ 3 - 5 ngày xuống tức thì.

- **Giám sát tiến độ đa nền tảng:** Cung cấp cổng API nhận dữ liệu đo kiểm tự động từ nhà máy, kết hợp giao diện Web và Mobile App cho phép cán bộ quản lý cập nhật tiến độ, báo cáo sự cố và đôn đốc công việc ngay khi công tác tại nhà máy đối tác ngoài mạng nội bộ.

- **Cảnh báo KPI/SLA và chế tài:** Tự động phát hiện các điểm nghẽn, gửi cảnh báo đôn đốc xử lý khi quá hạn KPI (như thủ tục lệnh nhập/xuất kho), hỗ trợ Lãnh đạo điều hành sản xuất real-time.

### 1.3. Phân tích Hạn chế, Khó khăn Hiện tại & Mong muốn Cốt lõi của Người dùng (Pain Points & User Expectations)

#### A. Phân tích Các Hạn chế & Khó khăn Trong Quy trình Thực hiện Công việc Hiện tại

- **Bất cập trong Quy trình Bàn giao R&D sang Sản xuất (R&D Handover Bottleneck):**

  - *Chưa tuân thủ quy trình khung:* Quy trình bàn giao sản phẩm R&D sang sản xuất loạt đã được Tổng công ty phê duyệt từ năm 2022 nhưng chưa được áp dụng triệt để. Do áp lực tiến độ sản xuất và kế hoạch doanh thu năm quá gấp (thời gian sản xuất thực tế chỉ 3 - 5 tháng), việc bàn giao bị phá vỡ quy trình chuẩn.

  - *Làm việc rải rác, chắp vá:* Việc truyền nhận tài liệu R&D thực hiện hoàn toàn thủ công qua Email, văn bản giấy hoặc file Excel theo dạng *rolling plan* (sẵn sàng hạng mục nào giao trước hạng mục đó).

  - *Tình trạng "đi đòi hồ sơ":* Cán bộ QLSX rơi vào thế bị động đi đòi hồ sơ thiết kế; R&D hiếm khi chủ động đề nghị thẩm định hoặc gửi tài liệu phê duyệt đúng hạn. Đến sát ngày bấm nút sản xuất loạt, R&D mới cung cấp bản thảo (draft) hoặc thiếu hụt nhiều tài liệu kỹ thuật quan trọng.

- **Thiếu Kho CSDL Release Sản phẩm Tập trung & Thiếu Thông tin Bán hàng:**

  - *Thông tin mơ hồ, không quản lý được phiên bản (Version):* R&D thông báo miệng hoặc email chung chung rằng có "sản phẩm 5G", nhưng thực tế không rõ sản phẩm đạt đến Version nào (v1.0, v2.0, v3.0), mức độ sẵn sàng sản xuất ra sao. Trong danh mục 20 đầu hồ sơ chuẩn, R&D chỉ bàn giao được 5 - 7 file sơ khai.

  - *Bắt chẽm thông tin với Trung tâm Kinh doanh:* Đơn vị Kinh doanh khi làm việc với Khách hàng không truy xuất được sản phẩm nào thực sự sẵn sàng kinh doanh/xuất bán. Khi khách hàng xin chỉ tiêu kỹ thuật hoặc tài liệu hướng dẫn, Kinh doanh lại phải phát email sang R&D và chờ 3 - 5 ngày mới nhận được phản hồi thủ công.

- **Tra cứu Tồn kho TCT và Làm thủ tục Mua sắm Thủ công, Kéo dài:**

  - *Thời gian chờ xác nhận tồn kho mất 3 - 5 ngày:* Để có số liệu tồn kho vật tư TCT đưa vào Tờ trình mua sắm, cán bộ QLSX phải lập văn bản/phiếu yêu cầu xin xác nhận trình Giám đốc Trung tâm Mua sắm ký. Sau đó, cán bộ quản lý kho tra cứu thủ công trên phần mềm tài sản và lập phiếu trả lời trình Giám đốc ký ngược lại, tiêu tốn từ 3 đến 5 ngày (thậm chí cả tuần) chỉ để lấy một con số tồn kho.

  - *Quy trình mua sắm phụ thuộc cảm tính cá nhân:* Việc soạn thảo Tờ trình mua sắm và Hồ sơ mời thầu thực hiện trên file Word/Excel rải rác. Câu chữ Tờ trình bị phụ thuộc nặng nề vào quan điểm cá nhân của từng chuyên quản thu mua ("ông chuyên quản này bắt sửa câu này, bà chuyên quản khác bắt sửa câu khác"), gây trôi tiến độ mua sắm.

- **Hạn chế Kỹ thuật trong Giám sát Tiến độ tại Hiện trường:**

  - *Cán bộ di chuyển công tác liên tục:* Đặc thù Khối 2 quản lý các dự án sản xuất quy mô lớn tại các nhà máy đối tác (VMC, nhà máy Hải Phòng, Vĩnh Phúc...). Cán bộ QLSX thường xuyên có mặt tại hiện trường dây chuyền gia công.

  - *Gói gọn trong mạng nội bộ (Internal LAN/VPN):* Các ứng dụng quản lý hiện tại của TCT bắt buộc truy cập trong mạng nội bộ. Khi đi công tác, máy tính không truy cập được mạng LAN khiến cán bộ không thể cập nhật tiến độ hay phê duyệt hồ sơ, dẫn đến việc phải có người ở văn phòng thao tác hộ.

- **Tình trạng Trôi KPI/SLA và Thiếu Chế tài Xử lý Tắc nghẽn:**

  - *Ngâm hồ sơ nhập/xuất kho:* Mặc dù quy trình xuất/nhập kho TCT có quy định KPI xử lý rõ ràng (lệnh nhập kho 1 ngày, phiếu xuất kho 2 ngày), thực tế hồ sơ thường bị "ngâm" 3 - 5 ngày tại khâu ký duyệt của chuyên quản hoặc Lãnh đạo do bận việc khác.

  - *KPI thiếu chế tài ràng buộc:* KPI đưa ra mang tính hình thức, không có cơ chế tự động báo cáo vượt cấp hay khóa luồng xử lý khi trôi hạn. Cán bộ QLSX phải liên tục gọi điện, nhắn tin nhờ cậy thủ công để đôn đốc việc ký duyệt.

#### B. Các Mong muốn & Kỳ vọng Cốt lõi của Người dùng (User Expectations & Desires)

- **Siết chặt & Cứng hóa Quy trình Thẩm định Bàn giao R&D (Hard Enforcement Gateways):**

  - Người dùng đòi hỏi hệ thống phải đóng vai trò "người gác cổng" nghiêm ngặt: Bắt buộc R&D tải lên đủ 100% danh mục 20 đầu hồ sơ kỹ thuật chuẩn mới mở nút Yêu cầu Thẩm định.

  - Chỉ khi Phòng QLSX và QA bấm Phê duyệt đạt yêu cầu, sản phẩm mới chính thức được ghi nhận vào **Kho CSDL Release Tập trung** và kích hoạt các công đoạn lập PAKD, mua sắm và sản xuất tiếp theo (tuân thủ nguyên tắc công đoạn trước hoàn thành 100% mới kích hoạt công đoạn sau).

- **Kho CSDL Release Tập trung - Minh bạch Thông tin Kinh doanh & Sản xuất:**

  - Xây dựng Kho Release lưu trữ đầy đủ tài liệu thiết kế, sơ đồ nguyên lý, Gerber file, BOM vật tư, Firmware và hướng dẫn lắp ráp theo từng Version cụ thể.

  - Trung tâm Kinh doanh và Ban Lãnh đạo chỉ cần truy cập Kho Release là tra cứu được ngay danh mục các sản phẩm đã sẵn sàng bán hàng, tự động tải bộ tài liệu/chỉ tiêu kỹ thuật chuẩn để gửi cho Khách hàng mà không cần email xin R&D.

- **Tích hợp Dữ liệu Tồn kho Real-time & Tự động hóa Mua sắm (Instant Inventory Lookup & Auto-Doc):**

  - Cho phép QLSX nhập mã linh kiện/vật tư để hệ thống tự động query live-data từ ERP Kho TCT, hiển thị tức thì số lượng tồn thực tế trên màn hình Tờ trình mua sắm, cắt giảm 100% thời gian 3 - 5 ngày xin xác nhận giấy.

  - Hệ thống tự động sinh Tờ trình mua sắm theo biểu mẫu chuẩn, tự động trích lục nguồn kinh phí PAKD và Chỉ tiêu kỹ thuật từ Kho Release R&D, loại bỏ việc soạn thảo câu chữ thủ công trên Word.

- **Đồng bộ Tích hợp 2 Chiều qua API với Phần mềm ĐTMS:**

  - Tự động đẩy Yêu cầu mua sắm sang phần mềm ĐTMS của Trung tâm Mua sắm qua API.

  - Đồng bộ real-time trạng thái thẩm định thầu, kết quả trúng thầu hợp đồng gia công (VMC/đối tác ngoài) và trạng thái nhập kho về Phân hệ Sản xuất để QLSX theo dõi tập trung tại một màn hình duy nhất.

- **Truy cập Đa nền tảng Di động (Mobile App & Cloud Web Portal):**

  - Cung cấp Mobile App và Web Client chạy trên phân vùng mạng ngoài an toàn (kết nối mã hóa/VPN), cho phép cán bộ QLSX khi công tác tại các nhà máy gia công dễ dàng phê duyệt, cập nhật tiến độ sản xuất theo ngày và chụp ảnh báo cáo sự cố (Incident Report) trực tiếp tại dây chuyền.

- **Cảnh báo KPI/SLA Đa kênh & Chế tài Ràng buộc Trách nhiệm (Automated SLA Alerts & Hard Penalties):**

  - Hệ thống tự động gửi tin nhắn SMS, Email, Push Notification đôn đốc khi hồ sơ xử lý (như lệnh nhập kho) sắp quá hạn KPI.

  - Trang bị tính năng Đôn đốc Khẩn cho Lãnh đạo và cơ chế tự động báo cáo vi phạm trôi KPI lên Dashboard Ban Tổng giám đốc nếu ngâm hồ sơ quá hạn quy định.

- **Cổng Portal Giao tiếp Đối tác Gia công Ngoài (External Partner Portal):**

  - Thiết lập phân vùng an toàn cho phép các nhà máy gia công ngoài Tập đoàn truy cập tải tài liệu kỹ thuật được phân quyền và cập nhật dữ liệu tiến độ/đo kiểm sản xuất trực tiếp lên hệ thống.

## 2. YÊU CẦU NGƯỜI DÙNG CHI TIẾT THEO NHÓM NGƯỜI DÙNG (USER REQUIREMENTS BY ROLE)

### 2.1. Nhóm Nghiên cứu & Thiết kế (R&D Centers - VTBR / VTBG)

Nhóm người dùng R&D đại diện cho cán bộ, chuyên gia thuộc Trung tâm Vô tuyến Băng rộng (VTBR), Trung tâm Truyền dẫn (VTBG) và các Trung tâm Phần mềm trực thuộc Khối 2. Đây là đơn vị khởi tạo gốc của mọi sản phẩm phần cứng và phần mềm trước khi đưa vào sản xuất hàng loạt.

- **Yêu cầu Giải quyết Hạn chế Hiện tại:** Chấm dứt tình trạng bàn giao rải rác qua email, gửi file draft thiếu hồ sơ hoặc chậm trễ cung cấp tài liệu kỹ thuật cho sản xuất và kinh doanh.

- **Yêu cầu Khởi tạo Yêu cầu Bàn giao (Release Request):**

  - Hệ thống phải cung cấp giao diện cho phép cán bộ R&D tạo phiếu yêu cầu bàn giao sản phẩm đóng gói cho sản xuất loạt.

  - Yêu cầu bắt buộc nhập đầy đủ thông tin định danh: Tên sản phẩm, Mã sản phẩm, Mã phiên bản (Release Version/Firmware Version, ví dụ: v3.0.1_HW_Rev2), Đơn vị chủ trì.

- **Yêu cầu Quản lý Danh mục Hồ sơ Bàn giao:**

  - Hệ thống phải bắt buộc người dùng R&D đính kèm đầy đủ danh mục hồ sơ kỹ thuật chuẩn theo quy định (gồm 20 danh mục như: Bản vẽ thiết kế phần cứng, Sơ đồ nguyên lý, Gerber file, BOM vật tư, Firmware/Software đính kèm, Tài liệu hướng dẫn lắp ráp, Quy trình đo kiểm, Hộp/Sân test mô phỏng).

  - Nút Gửi Yêu cầu Thẩm định chỉ được kích hoạt khi tất cả các danh mục tài liệu bắt buộc đã được tải lên hoàn tất (đáp ứng kỳ vọng kiểm soát cứng của người dùng).

- **Yêu cầu Quản lý Phiên bản & Lịch sử Điều chỉnh:**

  - Hệ thống phải lưu vết toàn bộ lịch sử các phiên bản release (Version 1.0, 2.0, 3.0...).

  - Trường hợp bộ hồ sơ bị từ chối thẩm định, hệ thống cho phép R&D nhận thông báo phản hồi, chỉnh sửa/bổ sung tài liệu và trình thẩm định lại.

### 2.2. Nhóm Phòng Quản lý Sản xuất (Khối 2)

Phòng Quản lý Sản xuất (QLSX) Khối 2 đóng vai trò trung tâm điều phối toàn bộ vòng đời dự án sản xuất, từ khâu thẩm định R&D, lập dự toán PAKD, tạo đề xuất mua sắm, theo dõi tiến độ nhà máy đến làm thủ tục nhập kho TCT.

- **Yêu cầu Giải quyết Hạn chế Hiện tại:** Xóa bỏ tình trạng đi đòi hồ sơ R&D, cắt giảm thời gian 3-5 ngày chờ xác nhận tồn kho giấy, chấm dứt việc nhập tiến độ hộ cho cán bộ đi hiện trường và đôn đốc thủ công các khâu duyệt ngâm hồ sơ.

- **Yêu cầu Thẩm định Bàn giao R&D:**

  - Hệ thống cung cấp màn hình thẩm định hồ sơ release từ R&D. Cho phép chuyên viên QLSX duyệt hoặc yêu cầu bổ sung từng danh mục tài liệu trực tiếp trên viewer tích hợp mà không cần tải file về máy.

  - Khi phê duyệt thành công, hệ thống tự động đẩy sản phẩm vào Kho CSDL Sản phẩm Sẵn sàng Sản xuất.

- **Yêu cầu Phối hợp Lập Phương án Kinh doanh (PAKD):**

  - Hệ thống cung cấp công cụ hỗ trợ QLSX nhập và tính toán dự toán chi phí sản xuất, định mức vật tư, chi phí nhân công/gia công và phương án chia gói thầu nằm trong PAKD do Trung tâm Kinh doanh chủ trì.

- **Yêu cầu Lập Đề xuất Mua sắm & Tích hợp API sang Phần mềm ĐTMS:**

  - Cho phép QLSX tạo Tờ trình mua sắm, tích hợp trích lục tự động nguồn kinh phí từ PAKD đã duyệt và Chỉ tiêu kỹ thuật từ Kho Release R&D.

  - Cho phép bấm nút Đẩy Yêu cầu sang ĐTMS, hệ thống đóng gói dữ liệu và tự động truyền qua API sang phần mềm ĐTMS của Trung tâm Mua sắm.

  - Cho phép nhập mã linh kiện/vật tư để truy vấn trực tiếp dữ liệu tồn kho real-time từ ERP Kho TCT, hiển thị chính xác số lượng tồn thực tế để cắt giảm thủ tục xin xác nhận bằng văn bản.

- **Yêu cầu Quản lý Dự án & Tiến độ Sản xuất Đa nền tảng:**

  - Cho phép khởi tạo dự án sản xuất riêng biệt cho từng đơn hàng/thị trường (ví dụ: Dự án VTN Lào, Dự án Viettel Cambodia, Dự án Binh chủng).

  - Hỗ trợ thiết lập các mốc tiến độ (Milestones) và kế hoạch sản lượng theo ngày/tuần/tháng.

  - Cung cấp ứng dụng Mobile App và Web ngoài mạng an toàn cho phép cán bộ công tác tại nhà máy gia công cập nhật sản lượng, theo dõi tiến độ real-time.

  - Hỗ trợ tạo báo cáo sự cố/bất thường (Incident Report) tại dây chuyền nhà máy, chụp ảnh đính kèm và phát thông báo khẩn cấp cho R&D và QA.

### 2.3. Nhóm Trung tâm Mua sắm (Cơ quan TCT) & Tích hợp Phần mềm ĐTMS

Trung tâm Mua sắm là cơ quan tham mưu chuyên trách của Tổng công ty. Về mặt hiện trạng, Trung tâm Mua sắm đã vận hành phần mềm chuyên ngành **"Đầu tư Mua sắm" (ĐTMS)** bao quát toàn bộ quy trình nghiệp vụ mua sắm, thẩm định thầu, lựa chọn nhà thầu và quản lý hợp đồng.

Do đó, Phân hệ Quản lý Sản xuất Toàn trình không xây dựng các màn hình xử lý mua sắm độc lập cho Trung tâm Mua sắm mà **tích hợp hai chiều (2-way Integration) qua API với phần mềm ĐTMS** theo các yêu cầu chi tiết sau:

- **Đẩy dữ liệu đầu vào tạo Yêu cầu Mua sắm (Input Data Push - API-01):**

  - Cho phép Phòng QLSX Khối 2 khởi tạo và hoàn thiện Tờ trình mua sắm, trích lục kinh phí từ PAKD đã duyệt, đính kèm Chỉ tiêu kỹ thuật từ Kho Release R&D và Danh mục dự toán vật tư trên Phân hệ Sản xuất.

  - Hệ thống tự động đẩy (push) toàn bộ dữ liệu cấu trúc này qua cổng API sang phần mềm ĐTMS để sinh phiếu Yêu cầu mua sắm và khởi động luồng thẩm định/đấu thầu chuyên ngành.

- **Theo dõi Quá trình Thẩm định & Phê duyệt Real-time (Tracking Status - API-02):**

  - Phân hệ Sản xuất tự động đồng bộ và hiển thị trạng thái xử lý thực tế từ phần mềm ĐTMS (Trạng thái: *Đang thẩm định hồ sơ / Yêu cầu làm rõ / Đang tổ chức thầu / Đã phê duyệt kết quả thầu*).

  - Cho phép Cán bộ QLSX và Lãnh đạo Khối 2 trực tiếp theo dõi tiến độ xử lý và tiến trình ký duyệt trên ĐTMS ngay trên màn hình Quản lý Dự án Sản xuất mà không cần đăng nhập riêng vào ĐTMS.

- **Nhận Kết quả & Trạng thái Đầu ra (Output Data Sync - API-03 & API-04):**

  - Khi phần mềm ĐTMS hoàn tất ký kết hợp đồng hoặc ban hành kết quả lựa chọn nhà thầu (VMC hoặc đối tác ngoài), ĐTMS tự động trả dữ liệu kết quả về Phân hệ Sản xuất.

  - Dữ liệu đồng bộ đầu ra bao gồm: Thông tin nhà thầu trúng thầu, Giá trị hợp đồng, Danh mục mặt hàng/lô hàng, Khối lượng cam kết, Mốc tiến độ giao hàng và Trạng thái phiếu nhập kho TCT để Phân hệ Sản xuất kích hoạt Dự án Sản xuất và theo dõi tiến độ gia công.

### 2.4. Nhóm Đảm bảo Chất lượng - QA (Trung tâm Kỹ thuật Công nghệ)

Phòng Đảm bảo Chất lượng (QA) trực thuộc Trung tâm Kỹ thuật Công nghệ là đơn vị độc lập kiểm soát tuân thủ quy trình và nghiệm thu chất lượng sản phẩm.

- **Yêu cầu Thẩm định Chất lượng Bàn giao R&D:**

  - Phối hợp với Phòng QLSX thẩm định các tài liệu liên quan đến quy trình đo kiểm, tiêu chuẩn chất lượng và kết quả test thử nghiệm của R&D trước khi đưa sản phẩm vào Kho Release.

- **Yêu cầu Kiểm định & Nghiệm thu Sản phẩm theo Lô:**

  - Hệ thống cung cấp chức năng ghi nhận kế hoạch kiểm định và biên bản nghiệm thu chất lượng theo từng lô sản xuất (ví dụ: lô 10.000 thiết bị, lô 20.000 thiết bị) tại nhà máy gia công.

  - Chỉ các lô sản phẩm có Biên bản nghiệm thu QA/QC đạt tiêu chuẩn trên hệ thống mới đủ điều kiện làm thủ tục nhập kho TCT và xuất bán cho khách hàng.

### 2.5. Nhóm Lãnh đạo & Cơ quan Tham mưu (Ban TGĐ, BGĐ Khối 2, Phòng Tổng hợp, Văn phòng)

Nhóm Lãnh đạo bao gồm Ban Tổng giám đốc TCT, Ban Giám đốc Khối 2, cùng các cơ quan giám sát kế hoạch như Phòng Tổng hợp Khối và Văn phòng TCT.

- **Yêu cầu Phê duyệt Luồng Nghiệp vụ (Approval Workflows):**

  - Hệ thống cung cấp giao diện phê duyệt điện tử tích hợp chữ ký số cho Ban TGĐ và BGĐ Khối 2 đối với PAKD, Tờ trình mua sắm, Phê duyệt dự án sản xuất và Kế hoạch giao hàng.

- **Yêu cầu Giám sát Dashboard Điều hành Real-time:**

  - Cung cấp màn hình Dashboard hiển thị trực quan các chỉ số KPI sản xuất: Số lượng sản phẩm R&D đã release, Tổng sản lượng đang gia công, Tiến độ kế hoạch vs. Thực tế theo từng dự án/thị trường, Tỷ lệ lô hàng đạt chất lượng QA.

- **Yêu cầu Cảnh báo KPI/SLA & Đôn đốc Tiến độ:**

  - Hệ thống tự động phát thông báo cảnh báo (SMS, Email, Push Notification) khi các bước trong quy trình (như thẩm định hồ sơ, ký phiếu nhập kho) bị trôi KPI quá thời gian quy định.

  - Cung cấp chức năng Đôn đốc Khẩn cho phép Lãnh đạo phát lệnh nhắc nhở trực tiếp tới cá nhân/đơn vị đang gây tắc nghẽn luồng xử lý.

## 3. MA TRẬN PHÂN QUYỀN SỬ DỤNG (RBAC MATRIX)

### 3.1. Định nghĩa Vai trò & Cấp độ Phân quyền

Hệ thống áp dụng cơ chế Phân quyền dựa trên Vai trò (Role-Based Access Control - RBAC) kết hợp với Phân vùng Dữ liệu (Data Domain Scope) theo từng Khối và Dự án.

Ký hiệu quyền hạn chuẩn:

- **C (Create):** Quyền Khởi tạo / Tạo mới dữ liệu, bản ghi, hồ sơ.

- **R (Read):** Quyền Xem / Tra cứu / Trích xuất thông tin, báo cáo.

- **U (Update):** Quyền Cập nhật / Chỉnh sửa thông tin (trong trạng thái cho phép).

- **D (Delete):** Quyền Xóa / Hủy bản ghi (chỉ áp dụng ở trạng thái Nháp hoặc dành cho Quản trị viên).

- **A (Approve/Review):** Quyền Thẩm định / Phê duyệt / Nghiệm thu / Trình duyệt.

### 3.2. Ma trận RBAC Chi tiết theo Module Chức năng

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 27%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
</colgroup>
<thead>
<tr>
<th><strong>Mã Module</strong></th>
<th><strong>Nhóm Chức năng / Module</strong></th>
<th style="text-align: center;"><strong>R&amp;D (VTBR/VTBG)</strong></th>
<th style="text-align: center;"><strong>QLSX Khối 2</strong></th>
<th style="text-align: center;"><strong>TT Mua sắm</strong></th>
<th style="text-align: center;"><strong>Phòng QA</strong></th>
<th style="text-align: center;"><strong>Lãnh đạo (TGĐ/BGĐ)</strong></th>
<th style="text-align: center;"><strong>Cơ quan Tham mưu</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>MOD-01</strong></td>
<td colspan="7"><strong>Quản lý Kho Release R&amp;D</strong></td>
</tr>
<tr>
<td>F1.1</td>
<td>Khởi tạo Yêu cầu Release &amp; Up Hồ sơ</td>
<td style="text-align: center;">C / R / U / D</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F1.2</td>
<td>Thẩm định &amp; Phê duyệt Release</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>A</strong></td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>A</strong></td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F1.3</td>
<td>Tra cứu Kho CSDL Release</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td><strong>MOD-02</strong></td>
<td colspan="7"><strong>Quản lý Nhu cầu &amp; PAKD</strong></td>
</tr>
<tr>
<td>F2.1</td>
<td>Ghi nhận Nhu cầu &amp; Tạo PAKD</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F2.2</td>
<td>Phối hợp Dự toán Chi phí Sản xuất</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F2.3</td>
<td>Phê duyệt Phương án Kinh doanh</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>A</strong></td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td><strong>MOD-03</strong></td>
<td colspan="7"><strong>Tích hợp Phần mềm ĐTMS &amp; Tồn kho</strong></td>
</tr>
<tr>
<td>F3.1</td>
<td>Tạo &amp; Đẩy Yêu cầu Mua sắm sang ĐTMS</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;"><strong>A (via ĐTMS)</strong></td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>A</strong></td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F3.2</td>
<td>Theo dõi Tiến độ Thẩm định &amp; Tồn kho</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R (via ĐTMS)</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F3.3</td>
<td>Đồng bộ Kết quả Hợp đồng &amp; Nhập kho từ ĐTMS</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>C / U / A (via ĐTMS)</strong></td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td><strong>MOD-04</strong></td>
<td colspan="7"><strong>Quản lý Tiến độ Dự án &amp; API</strong></td>
</tr>
<tr>
<td>F4.1</td>
<td>Khởi tạo Dự án &amp; Lập Milestones</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U / D</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F4.2</td>
<td>Cập nhật Tiến độ (API / Mobile / Nhập tay)</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F4.3</td>
<td>Báo cáo Bất thường / Incident Report</td>
<td style="text-align: center;">C / R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td><strong>MOD-05</strong></td>
<td colspan="7"><strong>Quản lý QA/QC &amp; Nhập Xuất kho</strong></td>
</tr>
<tr>
<td>F5.1</td>
<td>Lập Biên bản Nghiệm thu Lô QA</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>C / R / U / A</strong></td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F5.2</td>
<td>Thủ tục Lệnh &amp; Phiếu Nhập/Xuất kho</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>A</strong></td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td><strong>MOD-06</strong></td>
<td colspan="7"><strong>Quản lý Hồ sơ &amp; Cổng Portal</strong></td>
</tr>
<tr>
<td>F6.1</td>
<td>Lưu trữ &amp; Bảo mật Hồ sơ Dự án</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F6.2</td>
<td>Cổng Portal Chia sẻ Đối tác Gia công</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F6.3</td>
<td>Truy cập Đa nền tảng (Mobile App / Cloud)</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">C / R / U</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>R / A</strong></td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td><strong>MOD-07</strong></td>
<td colspan="7"><strong>Cảnh báo KPI &amp; Dashboard</strong></td>
</tr>
<tr>
<td>F7.1</td>
<td>Nhận Cảnh báo KPI &amp; Đôn đốc</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R / U</td>
<td style="text-align: center;">R / U</td>
<td style="text-align: center;">R / U</td>
<td style="text-align: center;"><strong>R / A</strong></td>
<td style="text-align: center;">R</td>
</tr>
<tr>
<td>F7.2</td>
<td>Dashboard Điều hành Real-time</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;">R</td>
<td style="text-align: center;"><strong>R / A</strong></td>
<td style="text-align: center;">R</td>
</tr>
</tbody>
</table>

## 4. QUY TRÌNH NGHIỆP VỤ & LUỒNG TƯƠNG TÁC LIÊN PHÒNG BAN

### 4.1. Luồng Bàn giao R&D sang Sản xuất (Release Management Flow)

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr>
<th><strong>Bước</strong></th>
<th><strong>Nội dung thực hiện</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p><strong>Bước 1</strong></p>
<p><strong>Khởi tạo Yêu cầu</strong></p></td>
<td>Trung tâm R&amp;D (VTBR/VTBG) đóng gói sản phẩm phần cứng/phần mềm, truy cập hệ thống tạo Yêu cầu Release, nhập mã Version và tải lên đủ 100% danh mục 20 đầu hồ sơ kỹ thuật theo tiêu chuẩn quy định.</td>
</tr>
<tr>
<td><p><strong>Bước 2</strong></p>
<p><strong>Kiểm tra &amp; Thông báo</strong></p></td>
<td>Hệ thống tự động kiểm tra tính đầy đủ của tệp đính kèm. Nếu thiếu bất kỳ file nào trong danh mục bắt buộc, hệ thống khóa không cho bấm nút Gửi. Khi đủ điều kiện, hệ thống tự động phát thông báo thẩm định đến Trưởng phòng QLSX Khối 2 và Trưởng phòng QA.</td>
</tr>
<tr>
<td><p><strong>Bước 3</strong></p>
<p><strong>Thẩm định Chuyên môn</strong></p></td>
<td>Chuyên viên QLSX và QA xem trực tiếp hồ sơ trên viewer hệ thống, đánh giá chi tiết từng mục. Trường hợp thiếu sót hoặc không đạt tiêu chuẩn kỹ thuật, phát phản hồi yêu cầu R&amp;D chỉnh sửa và nộp lại.</td>
</tr>
<tr>
<td><p><strong>Bước 4</strong></p>
<p><strong>Phê duyệt &amp; Đưa vào Kho Release</strong></p></td>
<td>QLSX và QA bấm Phê duyệt. Sản phẩm chính thức được đưa vào <strong>Kho CSDL Sản phẩm Sẵn sàng Sản xuất</strong>, cấp mã quản lý phiên bản phục vụ cho các bước lập PAKD và mua sắm sau này.</td>
</tr>
</tbody>
</table>

### 4.2. Luồng Lập PAKD & Tích hợp Đầu tư Mua sắm qua ĐTMS

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr>
<th><strong>Bước</strong></th>
<th><strong>Nội dung thực hiện</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p><strong>Bước 1</strong></p>
<p><strong>Nhu cầu Sản xuất</strong></p></td>
<td>Nhu cầu xuất phát từ Đơn hàng Khách hàng, Kế hoạch năm hoặc chỉ đạo trực tiếp từ Ban TGĐ. Trung tâm Kinh doanh khởi tạo luồng lập Phương án Kinh doanh (PAKD).</td>
</tr>
<tr>
<td><p><strong>Bước 2</strong></p>
<p><strong>Phối hợp Dự toán Chi phí</strong></p></td>
<td>Phòng QLSX Khối 2 truy cập hệ thống, chọn mã sản phẩm đã release từ Kho CSDL, nhập thông số dự toán chi phí sản xuất, định mức vật tư và đề xuất phân chia các gói thầu gia công.</td>
</tr>
<tr>
<td><p><strong>Bước 3</strong></p>
<p><strong>Ban TGĐ Phê duyệt PAKD</strong></p></td>
<td>Ban TGĐ phê duyệt PAKD trên hệ thống. Trạng thái dự án chính thức chuyển sang giai đoạn Mua sắm &amp; Sản xuất hàng loạt.</td>
</tr>
<tr>
<td><p><strong>Bước 4</strong></p>
<p><strong>Đề xuất Mua sắm &amp; Tra cứu Tồn kho Real-time</strong></p></td>
<td>Phòng QLSX lập Tờ trình Mua sắm. Nhập mã vật tư để hệ thống query live-data số lượng tồn kho thực tế từ ERP Kho TCT. Hệ thống tự động sinh Tờ trình đính kèm Chỉ tiêu kỹ thuật đã duyệt và gửi dữ liệu qua API sang phần mềm ĐTMS.</td>
</tr>
<tr>
<td><p><strong>Bước 5</strong></p>
<p><strong>Thẩm định Thầu &amp; Hợp đồng Gia công qua ĐTMS</strong></p></td>
<td>Trung tâm Mua sắm tiếp nhận phiếu trên phần mềm ĐTMS, tổ chức lựa chọn nhà thầu và ký hợp đồng gia công (với VMC hoặc đối tác ngoài). ĐTMS tự động trả dữ liệu hợp đồng về Phân hệ Sản xuất.</td>
</tr>
</tbody>
</table>

### 4.3. Luồng Triển khai Sản xuất, Cập nhật Tiến độ & Nhập kho

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr>
<th><strong>Bước</strong></th>
<th><strong>Nội dung thực hiện</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p><strong>Bước 1</strong></p>
<p><strong>Khởi tạo Dự án Sản xuất</strong></p></td>
<td>Phòng QLSX khởi tạo Dự án Sản xuất tương ứng với hợp đồng gia công nhận từ ĐTMS, thiết lập các mốc tiến độ (Milestones) và kế hoạch sản lượng.</td>
</tr>
<tr>
<td><p><strong>Bước 2</strong></p>
<p><strong>Gia công &amp; Cập nhật Tiến độ Multi-channel</strong></p></td>
<td>Nhà máy triển khai sản xuất. Tiến độ được đẩy tự động từ Server đo kiểm nhà máy về hệ thống qua cổng API Gateway. Đối với nhà máy không có API, cán bộ QLSX công tác tại hiện trường sử dụng Mobile App ngoài mạng để nhập số lượng sản xuất hàng ngày.</td>
</tr>
<tr>
<td><p><strong>Bước 3</strong></p>
<p><strong>Báo cáo Bất thường - Incident Report</strong></p></td>
<td>Nếu phát hiện lỗi linh kiện hoặc sự cố dây chuyền, cán bộ QLSX chụp ảnh trực tiếp trên Mobile App, tạo Báo cáo Bất thường gửi khẩn cho R&amp;D và QA xử lý.</td>
</tr>
<tr>
<td><p><strong>Bước 4</strong></p>
<p><strong>Kiểm định QA/QC theo Lô</strong></p></td>
<td>Phòng QA thực hiện kiểm định chất lượng tại nhà máy, lập Biên bản Nghiệm thu QA/QC theo từng lô hoàn thành (10.000 / 20.000 sản phẩm).</td>
</tr>
<tr>
<td><p><strong>Bước 5</strong></p>
<p><strong>Nhập Kho TCT &amp; Xuất giao Khách hàng</strong></p></td>
<td>Khi lô hàng đạt QA, Trung tâm Mua sắm và QLSX phối hợp làm thủ tục tạo Lệnh và Phiếu nhập kho TCT trên hệ thống. Hàng hóa sau khi nhập kho sẽ được chuyển giao cho Trung tâm Dịch vụ Sau bán hàng để xuất giao cho khách hàng.</td>
</tr>
</tbody>
</table>

## 5. YÊU CẦU PHI CHỨC NĂNG & HẠ TẦNG KỸ THUẬT (NON-FUNCTIONAL REQUIREMENTS)

### 5.1. Bảo mật & Phân vùng Dữ liệu Truy cập Di động (Mobile/Web Cloud Access)

- **Cơ chế Phân vùng Dữ liệu (Public vs Private Scope):** Hệ thống phân loại dữ liệu ngay từ khâu khởi tạo. Dữ liệu mật/quân sự (chủ yếu thuộc Khối 1) được lưu trữ trong phân vùng nội bộ thắt chặt. Dữ liệu sản xuất dân sự/viễn thông của Khối 2 được phân vùng linh hoạt để hỗ trợ truy cập ngoài mạng.

- **Truy cập Đa nền tảng (Web Client & Mobile App):** Cung cấp ứng dụng di động (Mobile App) và Web portal chạy trên nền tảng mạng ngoài an toàn (kết nối qua kênh truyền mã hóa/VPN), giải quyết dứt điểm khó khăn của cán bộ QLSX khi đi công tác tại các nhà máy đối tác (VMC, Hải Phòng, Vĩnh Phúc...). Cán bộ có thể phê duyệt, cập nhật tiến độ và báo cáo sự cố ngay tại hiện trường mà không cần có người ở văn phòng thao tác hộ.

- **Cổng Portal Đối tác Gia công (External Partner Portal):** Xây dựng Cổng Portal riêng biệt dành cho các nhà máy gia công bên ngoài Tập đoàn, phân quyền bảo mật chặt chẽ để đối tác cập nhật báo cáo tiến độ và tải tài liệu kỹ thuật được phép.

### 5.2. Khả năng Tích hợp Hệ thống (API Gateway & ERP Kho TCT)

- **Cổng Tích hợp API Gateway:** Hệ thống phải hỗ trợ các chuẩn kết nối API RESTful / gRPC mở để nhận dữ liệu thời gian thực từ các hệ thống Quản lý Sản xuất (MES), Server đo kiểm tự động tại nhà máy gia công.

- **Liên kết Hệ thống Kho & Mua sắm TCT:** Tích hợp trực tiếp với cơ sở dữ liệu Kho TCT để truy xuất tức thì số lượng tồn kho vật tư real-time. Tích hợp luồng trao đổi API 2 chiều với phần mềm ĐTMS và kết nối luồng ký duyệt văn bản với VOffice TCT.

### 5.3. Hiệu năng, Cảnh báo KPI & Chế tài Ràng buộc

- **Hiệu năng Tra cứu:** Thời gian phản hồi cho các thao tác tra cứu Kho CSDL Release và Tồn kho real-time phải đạt dưới 2 giây.

- **Cơ chế Cảnh báo KPI/SLA Tự động:** Hệ thống tự động gửi tin nhắn SMS, Email và thông báo Push đến cấp quản lý trực tiếp khi các bước xử lý (nhập kho, ký duyệt) sắp hoặc đã quá hạn KPI.

- **Chế tài Ràng buộc Luồng & Báo cáo Vượt cấp:** Khi bước xử lý bị trôi KPI quá thời gian cho phép mà không có lý do được phê duyệt, hệ thống tự động khóa luồng xử lý tương ứng và phát cảnh báo vi phạm KPI lên Dashboard của Ban Tổng giám đốc để xử lý trách nhiệm.

## 6. MA TRẬN ÁNH XẠ DỮ LIỆU API (DATA MAPPING MATRIX) GIỮA PHÂN HỆ SẢN XUẤT & PHẦN MỀM ĐTMS

Tổng hợp 4 luồng tích hợp giữa Phân hệ Sản xuất (PMS) và phần mềm ĐTMS:

|  |  |  |  |
|----|----|----|----|
| **Mã luồng** | **Chiều dữ liệu** | **Nội dung** | **Thời điểm kích hoạt** |
| **API-01** | **PMS → ĐTMS** | Đẩy Yêu cầu mua sắm đã duyệt để khởi động thẩm định và tổ chức thầu | Tự động khi Phòng QLSX Khối 2 hoàn tất lập Đề xuất mua sắm |
| **API-02** | **ĐTMS → PMS** | Đồng bộ trạng thái thẩm định và tiến độ thầu | Webhook real-time khi ĐTMS phát sự kiện |
| **API-03** | **ĐTMS → PMS** | Đồng bộ hợp đồng gia công đã ký, tự động kích hoạt Dự án Sản xuất | Khi Hợp đồng được phê duyệt / ký số trên ĐTMS |
| **API-04** | **ĐTMS/ERP → PMS** | Đồng bộ Lệnh và Phiếu nhập kho TCT của các lô thành phẩm | Webhook khi Phiếu nhập kho được ký duyệt thành công |
