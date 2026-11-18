<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Khảo sát/Khối 1/VMMS/khao-sat-he-thong-vmms-11-11-2026.md -->
<!-- pk-sha256: d675eff1632c72da67a13a1e761cdf4eb47351e03c7826b2c3b247cb6c0f6a3a -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SX-VMMS-1111 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Khảo sát/Khối 1/VMMS/khao-sat-he-thong-vmms-11-11-2026.md`. Trích dẫn thì ghi mã **SX-VMMS-1111** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

# Báo Cáo Khảo Sát Nghiệp Vụ & Ghi Chú Hệ Thống Quản Lý Sản Xuất VMMS

Tài liệu được tổng hợp từ nội dung cuộc làm việc và khảo sát chi tiết hệ thống VMMS diễn ra ngày 11/11/2026 giữa đại diện chuyên viên phân tích giải pháp nghiệp vụ và kỹ sư phát triển hệ thống. Báo cáo này trình bày toàn bộ kiến trúc hạ tầng, phân quyền, quy trình quản lý vật tư, kế hoạch tiến độ, kiểm soát chất lượng và phương án tích hợp API giữa VMMS với các hệ thống quản trị tổng thể.

---

## 1. Cơ Chế Phân Quyền Quản Lý Đa Dự Án & Định Hướng Phân Tách Ngữ Cảnh

Theo thông tin trao đổi trong buổi khảo sát, hệ thống VMMS được thiết kế theo nguyên tắc quản lý độc lập theo từng dự án nhằm đảm bảo dữ liệu không bị chồng chéo và tối ưu hóa việc phân quyền người dùng.

### Nguyên Tắc Phân Quyền & Truy Cập
* **Phân quyền chi tiết theo User và Dự án**: Mỗi tài khoản người dùng (User) khi đăng nhập chỉ được thấy và truy cập vào các dự án mà họ được phân công quyền hạn cụ thể. Các dự án khác ngoài danh sách được phân quyền sẽ hoàn toàn bị ẩn.
* **Lọc dữ liệu theo ngữ cảnh dự án (Project Scope Filtering)**: Để tránh tình trạng trộn lẫn khối lượng thông tin rất lớn từ nhiều dự án khác nhau vào cùng một danh mục, hệ thống bắt buộc người dùng chọn một dự án làm ngữ cảnh làm việc ngay từ thanh tác vụ chính trên cùng. 
* **Chuyển đổi linh hoạt**: Khi một nhân sự tham gia nhiều dự án (ví dụ một kỹ sư tháng trước làm dự án A, tháng sau sang dự án B nhưng vẫn cần xem lại dữ liệu cũ), họ chỉ cần thao tác chọn lại dự án tại bộ lọc trung tâm mà không cần thoát khỏi hệ thống.

### Quy Trình Tạo Mới & Quản Lý Dự Án
Hệ thống áp dụng mô hình quản lý mối quan hệ một-một giữa Dự án và Sản phẩm (Một dự án tương ứng với một sản phẩm chính hoặc một lô sản xuất sản phẩm cụ thể):

1. **Khởi tạo dự án từ Danh mục Sản phẩm**: Để thêm một dự án mới, quản trị viên (Admin) sẽ vào màn hình Quản lý Sản phẩm, chọn sản phẩm tương ứng và thực hiện thao tác thêm mới dự án. Dự án mới tạo sẽ ở trạng thái trắng (chưa có tiến độ hay phân công nhiệm vụ).
2. **Phân quyền và thiết lập tiến độ**: Sau khi tạo dự án trống, Admin tiến hành phân quyền nhân sự vào dự án. Từ đó, nhân sự được giao nhiệm vụ mới bắt đầu cập nhật kế hoạch, công việc và định mức.
3. **Phân định quyền chỉnh sửa của Admin**: Quyền thêm mới hoặc sửa đổi các thông tin nền tảng của dự án chỉ dành riêng cho tài khoản Admin nhằm đảm bảo tính toàn vẹn dữ liệu, tránh việc các user thông thường can thiệp làm lệch số liệu giữa các dự án.

---

## 2. Kiến Trúc Hạ Tầng Mạng & Chiến Lược Phân Tách Môi Trường Dev/Production

Hệ thống VMMS áp dụng mô hình hạ tầng mạng phân tách nghiêm ngặt để cân bằng giữa tốc độ phát triển tính năng mới và yêu cầu bảo mật thông tin sản xuất quân sự/công nghiệp.

| Tiêu chí | Môi trường Phát triển & Kiểm thử (Dev/Test Environment) | Môi trường Vận hành Thực tế (Production Environment) |
| :--- | :--- | :--- |
| **Hạ tầng mạng** | Mạng ngoài (Internet / Wifi dân sự) | Mạng nội bộ nhà máy (Internal Isolated Network) |
| **Dữ liệu lưu trữ** | Dữ liệu mẫu (Data test / Mockup format) | Dữ liệu sản xuất thực tế (Real-time Factory Data) |
| **Bảo mật** | Cách ly hoàn toàn với dữ liệu gốc của nhà máy | Đảm bảo an toàn thông tin tối đa, không có kết nối ra ngoài |
| **Đối tượng sử dụng** | Đội ngũ phát triển (Dev, Tester, Frontend, Outsource) | Ban Giám đốc, Quản đốc, Công nhân xí nghiệp |
| **Mục đích chính** | Phát triển tính năng mới, nhận phản hồi bóp lỗi video | Chạy quy trình sản xuất thực tế, kết nối máy móc |

### Chiến Lược Đóng Góp Ý Kiến & Phát Triển Tính Năng Mới
* **Kênh phản hồi người dùng (User Feedback System)**: Cho phép công nhân và nhân sự xí nghiệp gửi báo cáo góp ý, trong đó có thể đính kèm video quay trực tiếp các thao tác dài hoặc lỗi phát sinh trong quá trình sản xuất. Đội ngũ phát triển sẽ tiếp nhận, sửa chữa và tối ưu hóa tính năng trên môi trường mạng ngoài trước.
* **Tích hợp mô-đun AI cảnh báo chất lượng**: Theo chỉ đạo trực tiếp từ Giám đốc, hệ thống đang được phát triển thêm tính năng AI nhằm kiểm soát chất lượng sản phẩm và tự động phát ra các cảnh báo dựa trên tài liệu tài liệu sản xuất.
* **Quy trình đồng bộ (Migration Flow)**: Khi tính năng mới và các bản sửa lỗi đã đạt trạng thái ổn định trên môi trường Dev/Test ngoài mạng, toàn bộ mã nguồn kiểm thử chuẩn mới được đóng gói và cập nhật (move) vào môi trường Production trong mạng nội bộ.
* **Quy trình phối hợp tài liệu & hình ảnh**: Chuyên viên khảo sát chủ động lưu lại các hình ảnh màn hình cần thiết. Việc gửi các tài liệu chính thức giữa các bên sẽ được thực hiện qua đường email thông qua các đầu mối quản lý như anh Cường, anh Dũng và anh Hải.

---

## 3. Quản Lý Tiến Độ Sản Xuất & Tự Động Hóa Thu Thập Dữ Liệu Trạm Đo

Quản lý tiến độ trong VMMS được xây dựng trên sự kết hợp giữa kế hoạch mục tiêu từ đầu dự án và dữ liệu thực tế thu thập thời gian thực từ nhà máy.

### Lập Kế Hoạch & Quản Lý Theo Mốc Tiến Độ (Milestone & Task)
> Kế hoạch sản xuất được thiết lập ngay từ khi bắt đầu dự án. Ví dụ, một dự án quy định sản xuất 100 chip/bo mạch trong 1 tháng sẽ bao gồm danh sách các sản phẩm con (Sản phẩm A, Sản phẩm B), định mức nhân sự (5 người), cùng hệ thống máy móc và thiết bị tương ứng.

* **Quản lý dạng Milestone**: Công việc được chia thành các mốc tiến độ cụ thể theo mốc thời gian (các tháng 10, 11, 12...). Mỗi đầu việc đều được gắn với nhân sự chịu trách nhiệm.
* **Cập nhật và điều chỉnh kế hoạch**: Khi có sự thay đổi về thời gian hoặc tiến độ thực tế bị chậm, kế hoạch sẽ được cập nhật điều chỉnh trực tiếp trên biểu đồ/báo cáo của hệ thống.

### Cơ Chế Thu Thập Dữ Liệu Tự Động Từ Trạm Đo
Các trạm đo (bản chất là các chuyền sản xuất hoặc máy đo kiểm tự động tại nhà máy) đóng vai trò là điểm ghi nhận dữ liệu gốc:

1. **Đo kiểm tự động (Auto Testing)**: Máy tính tại trạm đo đóng vai trò là thiết bị điều khiển. Khi cắm thiết bị/bo mạch vào jack giao diện, trạm đo tự động điều khiển đồng hồ đo, thực hiện dãy đo kiểm và trả về kết quả.
2. **Định danh bằng Serial & Code**: Mỗi đơn vị sản xuất (như Bệnh Nhật, Siêu Việt, VMC...) sẽ quản lý các mã định danh (Serial) riêng cho từng bo mạch (ví dụ bo mạch quản lý nguồn PMU). Một đơn vị sản xuất/đối tác có thể quản lý nhiều trạm đo (ví dụ VMC quản lý 10 trạm đo).
3. **Cập nhật tiến độ tự động**: Kết quả đo từ các trạm đo được đẩy trực tiếp lên hệ thống VMMS để tính toán phần trăm hoàn thành công việc. Con người hoàn toàn không can thiệp thủ công vào các con số báo cáo này.
4. **Báo cáo & Cảnh báo tự động**: Hệ thống tổng hợp biểu đồ báo cáo và cung cấp tính năng gửi email báo cáo tiến độ tự động theo ngày/tuần đến Ban Giám đốc.

---

## 4. Quản Trị Danh Mục Vật Tư & Quy Trình Chuyển Đổi BOM (E-BOM sang M-BOM)

Quản lý Bill of Materials (BOM) là mô-đun nòng cốt của hệ thống VMMS, kết nối từ giai đoạn nghiên cứu thiết kế đến công đoạn sản xuất thực tế.

### Phân Định Giữa E-BOM và M-BOM
* **E-BOM (Engineering BOM - BOM Nghiên cứu)**: Xuất phát từ khối Nghiên cứu & Phát triển (R&D / Khoa học công nghệ). E-BOM định nghĩa cấu trúc cây sản phẩm (Module cha -> Linh kiện con như bo mạch, tụ điện, con ốc, dây cáp) và bộ khung vật tư ban đầu mà chưa gắn với số lượng sản xuất thương mại.
* **M-BOM (Manufacturing BOM - BOM Sản Xuất)**: Được sinh ra từ E-BOM kết hợp với yêu cầu kinh doanh. Khi có đơn hàng chính thức (ví dụ sản xuất 100 bộ), M-BOM sẽ tự động nhân theo số lượng tương ứng, bổ sung các thông tin sản xuất thực tế như độ trễ cung ứng, tỷ lệ hao hụt vật tư và định mức chi tiết.
* **Cơ chế Trigger liên thông**: Hai dạng BOM này có sự kết nối dữ liệu tự động. Khi khối Nghiên cứu cập nhật thay đổi trên E-BOM (ví dụ thêm một con tụ hoặc mạch con), hệ thống sẽ phát tín hiệu (trigger) xuống M-BOM để yêu cầu xem xét và cập nhật tương ứng.

### Quy Trình Phê Duyệt & Thay Đổi Cấu Trúc BOM
Việc tạo mới hoặc chỉnh sửa cấu trúc BOM phải tuân thủ bộ quy trình kiểm soát nghiêm ngặt qua các bước:

1. **Khởi tạo yêu cầu**: Tạo phiếu đề nghị thay đổi cấu trúc vật tư/module.
2. **Thiết lập cấu trúc cây**: Nhập thông tin phân cấp cha - con cho các module và vật tư trong phiếu.
3. **Đánh giá chất lượng (QA Review)**: Bộ phận Quản lý chất lượng kiểm tra các tiêu chí về hình thức, hồ sơ sở cứ phê duyệt và tính hợp lý kỹ thuật.
4. **Phê duyệt & Lưu lịch sử**: Khi được phê duyệt, cấu trúc mới sẽ được chính thức ghi nhận vào danh sách BOM. Hệ thống cho phép truy vết đường dẫn phiếu đề nghị để xác định rõ nguyên nhân và thời điểm thay đổi.

### Output Định Mức Kinh Tế Kỹ Thuật
Dữ liệu cuối cùng của mô-đun định mức vật tư kết hợp với lưu trình sản xuất (các công đoạn phân công cho nhân sự) sẽ quy ra **chi phí tiền tệ**. Đây là cơ sở quan trọng để hạch toán giá thành sản phẩm, lập tổng mức đầu tư dự án và phục vụ Ban Giám đốc bảo vệ phương án trước tập đoàn.

---

## 5. Quản Lý Chất Lượng (IQC), Đối Tác Gia Công & Lô Thử Nghiệm

Hệ thống VMMS tích hợp chặt chẽ việc quản lý chất lượng từ khâu linh kiện đầu vào cho đến khi hoàn thành sản phẩm nguyên chiếc.

### Kiểm Soát Chất Lượng Đầu Vào (IQC - Incoming Quality Control)
* **Quản lý Đối tác & Hợp đồng**: Quản lý danh sách các doanh nghiệp gia công/đối tác bên ngoài (ví dụ VMC, VCM...), cùng chi tiết hợp đồng cung cấp linh kiện và thời hạn bàn giao.
* **Kiểm tra chỉ tiêu đạt chuẩn**: Khi vật tư/module từ đối tác giao đến, chúng phải trải qua khâu đo kiểm IQC. Nếu đạt các chỉ tiêu kỹ thuật theo quy định, vật tư mới được chấp nhận nhập kho và đưa vào chuyền sản xuất.
* **Đánh giá & Cảnh báo Blacklist**: Hệ thống theo dõi tiến độ giao hàng và tỷ lệ lỗi linh kiện của từng đối tác. Những nhà cung cấp thường xuyên giao hàng trễ hoặc vi phạm chỉ tiêu chất lượng sẽ bị hệ thống cảnh báo và đưa vào danh sách hạn chế (Blacklist).

### Quy Trình Sản Xuất Thử Nghiệm & Tích Hợp Xuất Xưởng
* **Sản xuất Lô thử nghiệm (Lô mẫu)**: Trước khi sản xuất hàng loạt (ví dụ 100 bộ), xí nghiệp sẽ tiến hành sản xuất thử nghiệm một lô mẫu gồm 5 đến 10 bộ. Lô thử nghiệm này được đánh giá toàn diện về cả tiến độ lẫn chất lượng để rút kinh nghiệm trước khi tràn chuyền.
* **Tích hợp khối & Hoàn thiện sản phẩm**:
  * Các mạch con sau khi đo kiểm đạt chuẩn sẽ được tích hợp dần thành các khối module lớn hơn.
  * Khi tất cả các thành phần con hoàn tất (Status = Done), sản phẩm nguyên chiếc (ví dụ: Xe tăng hoặc Thiết bị viễn thông) sẽ được xác nhận hoàn thành trên hệ thống.
  * Hệ thống VMMS dừng lại ở khâu báo cáo hoàn thành tích hợp sản phẩm cho các cấp quản lý; các thủ tục nhập kho và xuất xưởng thực tế sau đó sẽ được thực hiện ngoài phần mềm.

---

## 6. Đội Ngũ Vận Hành & Phương Án Tích Hợp API Hệ Thống

### Đặc Điểm Đội Ngũ Phát Triển (Team Size & Work Mode)
* **Quy mô nhân sự**: Đội ngũ phát triển nội bộ (In-house Team) gồm khoảng 4 đến 5 nhân sự (bao gồm Developer, Tester, BA).
* **Phương thức làm việc**: Đội ngũ chủ động khảo sát thực tế xí nghiệp để xây dựng bài toán nghiệp vụ, hoặc tiếp nhận các yêu cầu phát triển mốc đột xuất từ Tổng giám đốc (tiêu biểu như dự án triển khai tại Sơn Tây hoàn thành gấp trong 1 tháng: 2 tuần làm tài liệu/code và 2 tuần triển khai trực tiếp tại hiện trường).

### Phương Án Tích Hợp API Nối Mạng
Hệ thống VMMS sẵn sàng cho việc kết nối và tích hợp dữ liệu với các hệ thống quản trị tổng thể ở giai đoạn trước (như quản lý phương án kinh doanh, phương án sản xuất toàn đợt):

1. **Khả năng cung cấp API**: Đội ngũ kỹ thuật VMMS sẵn sàng xây dựng và mở các cổng API (Endpoints) theo tài liệu yêu cầu tích hợp từ phía đối tác/hệ thống quản trị lớp trên.
2. **Hướng dữ liệu chia sẻ**: VMMS sẽ đóng vai trò là nhà cung cấp dữ liệu (Data Provider) về tiến độ sản xuất, kết quả đo kiểm chất lượng và trạng thái hoàn thành sản phẩm real-time để phục vụ hiển thị trên Dashboard tổng hợp của Ban Giám đốc.
