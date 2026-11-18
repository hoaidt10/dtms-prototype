<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Khảo sát/Khối 2_Thảo/Bao_cao_ket_qua_khao_sat_VHT_3_ngay.docx -->
<!-- pk-sha256: 22f6f490ad89c8f33b4f702bb0940ab4825c279e018a45fa59646d0b4bc76d16 -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SX-KS-3NGAY — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Khảo sát/Khối 2_Thảo/Bao_cao_ket_qua_khao_sat_VHT_3_ngay.docx`. Trích dẫn thì ghi mã **SX-KS-3NGAY** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

Phạm vi báo cáo: Kết quả 03 ngày làm việc trực tiếp tại VHT\
Ngày tổng hợp: 29/10/2026

# I Đánh giá chung và nội dung cần chỉ đạo

Sau 03 ngày khảo sát, nhóm BA đã làm rõ thêm nghiệp vụ Đầu tư mua sắm (ĐTMS), Khoa học công nghệ (KHCN) và bước đầu tiếp nhận tài liệu liên quan đến Sản xuất. Kết quả giữa các phân hệ chưa đồng đều: ĐTMS đã xác nhận được định hướng prototype và danh sách chức năng trọng tâm; KHCN đã làm rõ thêm hồ sơ, tiêu chí xử lý; Sản xuất chưa đủ dữ liệu thực tế để xây dựng bức tranh hiện trạng (As-is).

| **Phân hệ** | **Kết quả chính** | **Vấn đề cần ưu tiên** |
|----|----|----|
| ĐTMS | Xác nhận định hướng prototype; xác nhận Function List ĐXMS, KĐT và báo cáo. | Chốt lịch UAT và điều kiện đối chiếu phần mềm cũ. |
| Sản xuất | Rà soát sơ bộ 02 thư mục, 94 tệp; chuẩn bị nội dung làm việc với 03 khối. | Thống nhất phạm vi, tài liệu chính thức và lịch khảo sát thực tế. |
| KHCN | Làm rõ hồ sơ đầu vào, đầu ra và quan hệ tổng quan với Kế hoạch năm. | Bổ sung hồ sơ còn thiếu; bố trí đầu mối review và làm rõ liên phân hệ. |

Vấn đề ảnh hưởng lớn nhất đến khả năng hoàn thành mục tiêu năm 2026 là việc chưa thống nhất hướng triển khai giữa Sản xuất toàn trình và Phương án kinh doanh. Cùng với đó, thiếu lịch làm việc, tài liệu, quyền truy cập và không gian phối hợp đang làm giảm hiệu quả khảo sát. Nhóm BA kính đề nghị lãnh đạo hai bên ưu tiên thống nhất phạm vi khả thi, giao đầu mối chịu trách nhiệm và tháo gỡ các điều kiện tiếp cận nghiệp vụ.

Các mốc UAT nêu trong báo cáo là yêu cầu được đầu mối TTMS trao đổi tại khảo sát, chưa phải lịch bàn giao đã được hai bên phê duyệt. Các kiến nghị về phân kỳ và phân công dưới đây là đề xuất để lãnh đạo xem xét, chưa thay thế phạm vi dự án đã được phê duyệt.

# II Kết quả khảo sát phân hệ Đầu tư mua sắm

**BA phụ trách:** Phong. Đơn vị làm việc: Trung tâm Mua sắm (TTMS).

## 1 Kết quả đã thực hiện

- Đã trình bày chi tiết prototype; đầu mối nghiệp vụ xác nhận hướng xây dựng phù hợp và cung cấp thêm các thông tin cần bổ sung.

- Đã cập nhật Function List theo cách phân chia phân hệ mới, đồng bộ danh sách chức năng với giao diện prototype; xác nhận được phần Đề xuất mua sắm (ĐXMS), Khoản đầu tư (KĐT) và báo cáo qua trao đổi khảo sát.

- Đã cài đặt prototype trên máy của chị Thảo, tạo điều kiện để đầu mối tiếp tục trải nghiệm, rà soát và phản hồi.

## 2 Yêu cầu về mốc UAT

| **Mốc được yêu cầu** | **Phạm vi hoàn tất UAT** | **Tình trạng** |
|----|----|----|
| Cuối tháng 11/2026 | ĐXMS và KĐT, bao gồm báo cáo tương ứng. | Chị Thảo yêu cầu bắt buộc; chưa chốt ngày cụ thể. |
| Cuối tháng 12/2026 | Thầu và Hợp đồng, bao gồm báo cáo tương ứng. | Chị Thảo yêu cầu bắt buộc; chưa chốt ngày cụ thể. |

Cần đối chiếu các yêu cầu trên với tiến độ phát triển, kiểm thử, chuẩn bị dữ liệu và năng lực tiếp nhận UAT của khách hàng để thống nhất lịch chi tiết. Việc xác nhận Function List tại khảo sát chưa đồng nghĩa toàn bộ nội dung Thầu và Hợp đồng đã được chốt.

## 3 Vướng mắc và đầu mối phối hợp

Nhóm BA chưa tiếp cận được phần mềm cũ để đối chiếu các trường dữ liệu đang vận hành. TTMS hiện chưa bố trí được thiết bị và tài khoản phục vụ việc này. Nếu chưa đối chiếu, vẫn tồn tại rủi ro bỏ sót thông tin, trường dữ liệu hoặc tình huống nghiệp vụ cần kế thừa.

| **Nội dung phối hợp**                           | **Đầu mối được ghi nhận** |
|-------------------------------------------------|---------------------------|
| Trình bày giải pháp và xác nhận nghiệp vụ chính | Chị Thảo; chị Trà hỗ trợ. |
| Điều phối, phân bổ hỗ trợ trong TTMS            | Chị Trà.                  |
| Nghiệp vụ chi tiết ĐXMS và KĐT                  | Chị Thúy, chị Dung.       |
| Nghiệp vụ chi tiết Thầu                         | Anh Duy, anh Thức.        |
| Nghiệp vụ chi tiết Hợp đồng                     | Chị Liên.                 |

# III Kết quả khảo sát Sản xuất và Khoa học công nghệ

## 1 Phân hệ Sản xuất do Huy phụ trách

Đã tiếp nhận 02 thư mục gồm 94 tệp từ BA phụ trách KHCN; thực hiện thống kê, phân loại và rà soát sơ bộ, xác định nhóm tài liệu có liên quan đến sản xuất và thông tin cần bổ sung. Nhóm BA đã chuẩn bị nội dung khảo sát và dự thảo email đề nghị 03 khối cung cấp tài liệu.

Tài liệu hiện có chủ yếu liên quan đến nghiên cứu, thiết kế và chế tạo mẫu; chưa có bộ tài liệu chính thức, đầy đủ mô tả hoạt động sản xuất tại 03 khối. Vì vậy, chưa đủ căn cứ để xác định phạm vi, quy trình thực tế, phần mềm đang sử dụng và xây dựng As-is cho từng khối.

- Khối 1: kênh phối hợp, tiếp nhận tài liệu qua anh Hải chưa thông suốt; cần xác nhận lại đầu mối và phương án bàn giao tài liệu.

- Khối 2 và Khối 3: BA mới tiếp nhận đầu mối trong đợt khảo sát; đang chuẩn bị thư đề nghị cung cấp tài liệu, chưa có tài liệu chính thức để phân tích.

Kiến nghị lãnh đạo VHT hỗ trợ xác nhận phạm vi, giao đầu mối tại từng khối và thống nhất lịch cung cấp tài liệu, lịch làm việc trực tiếp. Việc khảo sát cần đi theo các tình huống sản xuất thực tế, có hồ sơ minh họa và thông tin hệ thống hiện hữu; tài liệu quy định chung chỉ là căn cứ tham chiếu.

## 2 Phân hệ KHCN do Trang phụ trách

Đã làm rõ các thành phần của bộ hồ sơ đầu vào xét duyệt, bộ hồ sơ đầu ra; nắm định dạng tệp kết quả, nội dung, điều kiện đánh giá và nhận xét. Đã nhận diện mối quan hệ tổng quan giữa KHCN với Kế hoạch năm (KHN); các nội dung chi tiết thuộc KHN vẫn cần trao đổi với đầu mối phụ trách trực tiếp.

- Trong 04 hồ sơ thực tế đã đề nghị, mới tiếp nhận 03 hồ sơ; còn thiếu 01 hồ sơ phục vụ đối chiếu đầy đủ các tình huống.

- Đầu mối nghiệp vụ bận công việc, chưa bố trí đủ thời gian trao đổi trực tiếp. Giao diện Figma đã gửi và đề nghị review nhưng chưa nhận được phản hồi.

- Đầu mối KHCN chưa nắm các nội dung cần làm rõ về KHN và đề nghị nhóm BA làm việc với đầu mối KHN. Email đề nghị khảo sát phần Quyết toán chưa được phản hồi.

- Chính sách an toàn thông tin của hệ thống nội bộ đang hạn chế việc tiếp cận VOffice, VOps, AI và các công cụ liên quan, ảnh hưởng đến khả năng tra cứu, kiểm tra và phối hợp.

Kiến nghị bố trí phiên làm việc tập trung để review giao diện và hồ sơ; bổ sung hồ sơ còn thiếu; chỉ định đầu mối KHN, Quyết toán cùng tham gia làm rõ các điểm giao giữa phân hệ. Các nhu cầu truy cập cần được rà soát và cấp theo quy trình an toàn thông tin của VHT.

# IV Vướng mắc chung và định hướng phạm vi cần thống nhất

## 1 Điều kiện làm việc và phối hợp

VHT đã hỗ trợ bố trí chỗ ngồi, tuy nhiên không gian hiện tại chưa phù hợp với đặc thù công việc BA. Nhóm cần thường xuyên trao đổi nghiệp vụ và trao đổi điện thoại với đội phát triển tại công ty, trong khi các ban nghiệp vụ làm việc trong môi trường yên tĩnh. Việc trao đổi tại chỗ ảnh hưởng đến công việc của đơn vị; chuyển ra sảnh cũng không đáp ứng được nhu cầu do không được sử dụng trong thời gian dài.

## 2 Khác biệt về định hướng Sản xuất và Phương án kinh doanh

Qua trao đổi với các đầu mối Ban Chuyển đổi số VHT, hiện chưa thống nhất mức độ bao phủ và thứ tự ưu tiên triển khai. Anh Sơn định hướng xây dựng nghiệp vụ Sản xuất toàn trình cho 03 khối; một số đầu mối khác đề xuất ưu tiên Phương án kinh doanh. Chị Thảo thuộc Ban Chuyển đổi số đề nghị làm phần khả thi trước để hướng tới mục tiêu hoàn thành 03 phân hệ trong năm 2026.

| **Tiêu chí** | **Sản xuất toàn trình cho 03 khối** | **Ưu tiên Phương án kinh doanh** |
|----|----|----|
| Phạm vi định hướng | Bao quát quy trình sản xuất từ đầu đến cuối tại Khối 1, 2, 3. | Giai đoạn 1: khai báo, trình ký, xử lý phương án; giai đoạn 2: mở rộng nghiệp vụ nâng cao, đặc thù. |
| Điều kiện hiện tại | Các khối vận hành độc lập; quy trình thực tế chưa chuẩn hóa, tài liệu và lịch khảo sát còn thiếu. | Phạm vi bước đầu tập trung hơn; vẫn cần xác nhận quy trình, đầu mối và danh sách chức năng. |
| Đánh giá của nhóm BA | Rủi ro cao nếu cam kết triển khai toàn trình ngay khi chưa làm rõ hiện trạng và khác biệt giữa các khối. | Có cơ sở để xem xét ưu tiên triển khai trước; chưa phải phương án đã được phê duyệt. |

Theo phản ánh của các đầu mối, nghiệp vụ sản xuất còn phân tán tại từng cá nhân; tài liệu được cung cấp chủ yếu là quy định chung của Tập đoàn, chưa phản ánh đầy đủ cách làm, vướng mắc và đặc thù của VHT. Nhóm BA đánh giá chưa đủ cơ sở để cam kết thiết kế toàn trình cho cả 03 khối và bảo đảm kết quả trong thời gian còn lại của năm 2026.

Đề xuất ưu tiên làm rõ và triển khai Phương án kinh doanh trong năm 2026 nếu được lãnh đạo hai bên thống nhất; song song tiếp tục khảo sát, chuẩn hóa hiện trạng Sản xuất làm cơ sở cho giai đoạn sau. Nếu lựa chọn này làm thay đổi phạm vi đã phê duyệt, cần cập nhật và phê duyệt lại phạm vi, tiến độ, nguồn lực theo cơ chế quản lý thay đổi của dự án.

# V Kiến nghị chỉ đạo và kế hoạch phối hợp tiếp theo

Nhóm BA kính đề nghị lãnh đạo Công ty và lãnh đạo VHT thống nhất các nội dung dưới đây. Đầu mối trong bảng là đề xuất phân công; lịch hoàn thành cụ thể cần được xác nhận trong phiên điều phối gần nhất.

| **Nội dung cần thống nhất** | **Đầu mối đề nghị chủ trì** | **Kết quả cần có** |
|----|----|----|
| 1\. Chốt phạm vi và thứ tự ưu tiên Sản xuất hoặc Phương án kinh doanh. | Lãnh đạo dự án hai bên; Ban CĐS VHT. | Kết luận thống nhất phạm vi 2026, phần chuyển giai đoạn sau và danh mục 03 phân hệ ưu tiên; xử lý thay đổi phạm vi nếu có. |
| 2\. Bảo đảm điều kiện khảo sát tại 03 khối sản xuất. | Ban CĐS VHT phối hợp lãnh đạo Khối 1, 2, 3. | Đầu mối chính/dự phòng; danh mục tài liệu; thời điểm cung cấp; lịch khảo sát theo tình huống thực tế và hệ thống đang vận hành. |
| 3\. Thống nhất kế hoạch UAT ĐTMS. | Quản lý dự án Công ty; TTMS; BA và đội phát triển. | Ngày UAT cụ thể cho hai mốc cuối tháng 11 và 12/2026; phạm vi, phiên bản, dữ liệu, người tham gia và tiêu chí hoàn tất UAT. |
| 4\. Hỗ trợ đối chiếu phần mềm ĐTMS cũ. | TTMS; đầu mối điều phối chị Trà. | Thiết bị/tài khoản theo quyền được cấp hoặc phiên trình diễn có người nghiệp vụ; biên bản đối chiếu các trường dữ liệu và tình huống cần kế thừa. |
| 5\. Hoàn thiện xác nhận nghiệp vụ KHCN và liên phân hệ. | Đầu mối KHCN, KHN, Quyết toán; BA phụ trách. | Bổ sung 01 hồ sơ còn thiếu; lịch review Figma; phản hồi nội dung Quyết toán; thống nhất dữ liệu và trách nhiệm tại điểm giao KHN và KHCN. |
| 6\. Tháo gỡ điều kiện truy cập hệ thống nội bộ. | Ban CĐS VHT và đơn vị CNTT/ATTT có thẩm quyền. | Danh sách tài khoản, công cụ, hệ thống được phép truy cập; kênh trao đổi tài liệu và phương án làm việc được phê duyệt. |
