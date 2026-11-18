<!-- pk-source: 02. VHT gửi/Thầu 161126/MS18,19 - Lập KHLCNT và Tổ chức LCNT.docx -->
<!-- pk-sha256: fbc89c6dd5e29714edbee7b17f1999c13f30dcb5f9d6f667aa8423f3b348aad3 -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# THAU-TT-1311 — bản đọc máy sinh

> Nguồn: `project-knowledge/02. VHT gửi/Thầu 161126/MS18,19 - Lập KHLCNT và Tổ chức LCNT.docx`. Trích dẫn thì ghi mã **THAU-TT-1311** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**DIỄN GIẢI LUỒNG NGHIỆP VỤ THẦU TO-BE**

**Trọng tâm: Trạng thái theo dõi tiến độ Lập KHLCNT và Tổ chức LCNT**

Mục tiêu tài liệu: giúp các phòng/ban ngoài Trung tâm Mua sắm nhìn vào hệ thống và biết hồ sơ hoặc gói thầu đang ở giai đoạn nào, đang chờ ai xử lý, bước tiếp theo là gì và có vướng mắc hay không.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>Nguyên tắc thiết kế trọng tâm</strong></p>
<p>Người dùng không tự chọn trạng thái gói như hệ thống cũ. Trạng thái được hệ thống cập nhật từ task/gateway Camunda và kết quả tích hợp. Trên giao diện theo dõi nên hiển thị đồng thời: Giai đoạn lớn + Bước hiện tại + Đơn vị/người xử lý + Ngày bắt đầu + Hạn xử lý + Vướng mắc (nếu có).</p></td>
</tr>
</tbody>
</table>

Phiên bản: 13/11/2026

# **1. Phạm vi và cách đọc trạng thái**

Phần Thầu được chia thành hai chặng nghiệp vụ lớn. Chặng 1 là Lập và phê duyệt Kế hoạch lựa chọn nhà thầu (KHLCNT). Chặng 2 là Tổ chức lựa chọn nhà thầu (LCNT) cho từng gói đã được phê duyệt. Một KHLCNT có thể gom nhiều hồ sơ nguồn đã được phê duyệt; sau khi KHLCNT được duyệt, từng gói có thể chạy tiến độ LCNT độc lập.

## **1.1. Mô hình trạng thái hai lớp**

| **Lớp trạng thái** | **Mục đích** | **Ví dụ hiển thị** |
|----|----|----|
| Giai đoạn lớn | Để các phòng/ban khác nhìn nhanh và hiểu tiến độ tổng thể. | Đang lập KHLCNT; Đang kiểm tra/thẩm định; Đang trình phê duyệt; Đang tổ chức LCNT; Đang trình KQLCNT; Đang chuyển ký hợp đồng. |
| Bước hiện tại | Để biết hồ sơ/gói đang chờ chính xác việc gì và ai xử lý. | Lập Tờ trình BM01; Chờ thành viên Tổ thẩm định cam kết; Đánh giá kỹ thuật; Thương thảo; Chờ ký BM03; Chờ đăng tải KQLCNT. |

## **1.2. Thông tin tiến độ nên hiển thị cho các phòng/ban**

| **Thông tin** | **Ý nghĩa** |
|----|----|
| Giai đoạn | Giai đoạn lớn của KHLCNT hoặc gói thầu. |
| Bước hiện tại | Task nghiệp vụ đang chạy trên Camunda. |
| Đơn vị/người xử lý | Ai đang chịu trách nhiệm xử lý bước hiện tại. |
| Bắt đầu từ | Thời điểm task hiện tại được tạo. |
| Hạn xử lý | SLA hoặc hạn hoàn thành nếu có. |
| Thời gian tại bước | Số ngày/giờ hồ sơ đã nằm ở bước hiện tại. |
| Vướng mắc | Lý do chờ, yêu cầu chỉnh sửa, lỗi tích hợp hoặc sự kiện bất thường. |
| Bước tiếp theo dự kiến | Bước tiếp theo theo luồng nếu task hiện tại hoàn tất. |
| Cập nhật gần nhất | Thời điểm có thao tác/trạng thái mới nhất. |

# **2. Mapping trạng thái hệ thống cũ sang TO-BE**

Hệ thống cũ cho phép người dùng chọn trạng thái gói trực tiếp. TO-BE chuyển các trạng thái này thành trạng thái sinh tự động từ tiến trình, đồng thời tách nhỏ các giai đoạn cần theo dõi để các phòng/ban biết chính xác gói đang ở đâu.

| **Trạng thái hệ thống cũ** | **Trạng thái TO-BE đề xuất** | **Cách hình thành TO-BE** |
|----|----|----|
| Draft KHLCNT | Nháp KHLCNT | Khi hồ sơ mới được lưu, chưa khởi tạo process. |
| Lập KHLCNT | Đang lập KHLCNT / Đang kiểm tra-thẩm định / Đang trình phê duyệt | Tự động theo task BM01, BM02, BM03 và tuyến VHT/Tập đoàn. |
| Lập HSMT | Đang chuẩn bị hồ sơ LCNT | Bao gồm lập, kiểm tra/thẩm định, phê duyệt HSMT/HSYC/HSMCG. |
| Phát thầu | Đang phát hành / Chờ nhận hồ sơ nhà thầu | Tự động theo kết quả tích hợp cổng đấu thầu hoặc thao tác phát hành. |
| Chấm thầu | Đang đánh giá hồ sơ | Tách thành đánh giá hợp lệ, kỹ thuật, tài chính, làm rõ... tùy hình thức/phương thức. |
| Trình KQ LCNT | Đang trình/thẩm định/phê duyệt KQLCNT | Tự động từ các task trình kết quả, thẩm định, ký và công khai. |
| Chuyển ký HĐ | Đang hoàn thiện/chuyển ký hợp đồng | Khi KQLCNT đã được duyệt và hồ sơ hợp đồng được chuyển xử lý. |
| Hủy thầu | Đã hủy | Trạng thái kết thúc bất thường có lý do và người phê duyệt/hành động. |
| Không thực hiện | Không thực hiện | Kết thúc gói với lý do và căn cứ. |

# **3. Luồng TO-BE - Lập và phê duyệt KHLCNT**

Khi tạo KHLCNT, người dùng chọn Cấp phê duyệt: VHT/Tổng Công ty hoặc Tập đoàn. Sau khi khởi tạo process, cấp phê duyệt bị khóa; nếu cần đổi cấp phải hủy hồ sơ và tạo hồ sơ mới. Cấp phê duyệt quyết định bộ biểu mẫu, actor và tuyến xử lý phía sau.

## **3.1. Các bước chung trước khi tách tuyến phê duyệt**

| **Bước** | **Hành vi người dùng** | **Thông tin/biểu mẫu** | **Trạng thái hiển thị** |
|----|----|----|----|
| 1\. Tạo KHLCNT | Phòng Đầu tư - TTMS tạo hồ sơ, chọn cấp phê duyệt, người phụ trách/người soạn và một hoặc nhiều hồ sơ nguồn đã phê duyệt. | Tên KHLCNT; Quy chế áp dụng; Cấp phê duyệt; Người phụ trách; Người soạn; ĐXMS/KĐT/Dự án nguồn. | Nháp KHLCNT |
| 2\. Khởi tạo process | Người dùng hoàn tất dữ liệu nền và bấm Khởi tạo KHLCNT. | Hệ thống sinh mã KHLCNT, Business Key và khóa Cấp phê duyệt. | Đang lập KHLCNT |
| 3\. Tạo gói thầu | Người dùng chọn các hạng mục từ hồ sơ nguồn, phân bổ số lượng/giá trị vào một hoặc nhiều gói. | Thông tin gói; nguồn vốn; giá; phạm vi; hình thức/phương thức LCNT; loại HĐ; thời gian; chủ thể tham gia. | Đang lập thông tin gói |
| 4\. Hoàn tất thông tin gói | Người dùng kiểm tra dữ liệu, hệ thống kiểm tra tổng phân bổ và các thông tin bắt buộc. | Danh sách gói và tổng giá trị KHLCNT. | Đang lập Tờ trình KHLCNT |

## **3.2. Tuyến KHLCNT cấp VHT/Tổng Công ty**

| **STT** | **Bước hiện tại** | **Hành vi người dùng / hệ thống** | **Biểu mẫu** | **Trạng thái cho phòng/ban** |
|----|----|----|----|----|
| 1 | Lập Tờ trình KHLCNT | Người soạn mở My Task, rà soát dữ liệu hệ thống tự điền và bổ sung phần giải trình. | BM01 VHT | Đang lập KHLCNT |
| 2 | Chọn Tổ thẩm định | Người lập chọn thành viên, vai trò và phân công. Camunda tạo task cam kết cho từng thành viên. | Danh sách Tổ thẩm định | Chờ Tổ thẩm định xác nhận |
| 3 | Cam kết Tổ thẩm định | Mỗi thành viên vào My Task, kiểm tra thông tin cá nhân và xác nhận cam kết. | Bản cam kết Tổ thẩm định | Chờ cam kết Tổ thẩm định |
| 4 | Kiểm tra KHLCNT | TTMS thực hiện checklist Đáp ứng/Không đáp ứng; nhập nhận xét theo từng tiêu chí. | BM02 - Báo cáo kiểm tra | Đang kiểm tra KHLCNT |
| 5 | Yêu cầu chỉnh sửa (nếu có) | Người kiểm tra trả hồ sơ về đúng người lập; người lập sửa và gửi lại. | BM01 / dữ liệu gói | Yêu cầu chỉnh sửa KHLCNT |
| 6 | Lập Quyết định | Hệ thống sinh dự thảo quyết định; người dùng rà soát. | BM03 VHT | Đang lập Quyết định KHLCNT |
| 7 | Trình ký | Chọn Trình ký qua VOffice hoặc Trình ký cứng và upload bằng chứng. | BM03 VHT | Đang trình phê duyệt KHLCNT |
| 8 | Nhận kết quả phê duyệt | VOffice callback hoặc người dùng xác nhận bằng chứng ký cứng. | BM03 đã ký | KHLCNT đã phê duyệt |
| 9 | Công khai KHLCNT | Người dùng kiểm tra dữ liệu và bấm đăng tải; hệ thống tích hợp cổng đấu thầu. | Thông tin đăng tải | Đang công khai KHLCNT |
| 10 | Hoàn thành KHLCNT | Hệ thống ghi nhận đăng tải thành công và mở các gói để tổ chức LCNT. | \- | Hoàn thành KHLCNT |

## **3.3. Tuyến KHLCNT cấp Tập đoàn**

| **STT** | **Bước hiện tại** | **Hành vi người dùng / hệ thống** | **Biểu mẫu** | **Trạng thái cho phòng/ban** |
|----|----|----|----|----|
| 1 | Lập Tờ trình KHLCNT | Người soạn rà soát dữ liệu tự điền và bổ sung giải trình. | BM01 Tập đoàn | Đang lập KHLCNT |
| 2 | Chọn/Cam kết Tổ thẩm định | Chọn thành viên; mỗi thành viên tự vào My Task xác nhận cam kết. | Bản cam kết | Chờ Tổ thẩm định xác nhận |
| 3 | Thẩm định KHLCNT | Tổ thẩm định đánh giá căn cứ, chia gói, nội dung từng gói và nhập nhận xét. | BM02 - Báo cáo thẩm định | Đang thẩm định KHLCNT |
| 4 | Nhận ý kiến Ban ĐTXD | Hệ thống/đầu mối gửi hồ sơ và nhận Phiếu nhận xét; lưu số/ngày/file và từng ý kiến. | Phiếu nhận xét Ban ĐTXD | Chờ ý kiến Ban ĐTXD |
| 5 | VHT giải trình | Người được giao trả lời từng ý kiến Ban ĐTXD. | Phần giải trình VHT | Đang giải trình |
| 6 | Lập Phiếu trình GQCV | Hệ thống sinh Phiếu trình từ KHLCNT + ý kiến + giải trình. | Phiếu trình GQCV | Đang hoàn thiện hồ sơ trình |
| 7 | Lập Quyết định | Hệ thống sinh BM03 Tập đoàn; người dùng rà soát. | BM03 Tập đoàn | Đang lập Quyết định KHLCNT |
| 8 | Trình ký | Trình VOffice hoặc Trình ký cứng. | BM03 Tập đoàn | Đang trình phê duyệt KHLCNT |
| 9 | Nhận kết quả phê duyệt | Nhận callback hoặc xác nhận file bằng chứng ký. | BM03 đã ký | KHLCNT đã phê duyệt |
| 10 | Công khai | Đăng tải qua tích hợp và nhận kết quả. | Thông tin đăng tải | Đang công khai KHLCNT |
| 11 | Hoàn thành KHLCNT | Mở từng gói để chạy LCNT. | \- | Hoàn thành KHLCNT |

## **3.4. Trạng thái tổng hợp của chặng KHLCNT**

| **Mã** | **Trạng thái hiển thị** | **Ý nghĩa cho người theo dõi** | **Điều kiện kết thúc trạng thái** |
|:--:|----|----|----|
| KHL-01 | Nháp KHLCNT | Hồ sơ đang chuẩn bị, chưa chạy quy trình. | Bấm Khởi tạo KHLCNT. |
| KHL-02 | Đang lập KHLCNT | Đang lập gói/Tờ trình hoặc hoàn thiện hồ sơ. | Chuyển sang kiểm tra/thẩm định. |
| KHL-03 | Chờ Tổ thẩm định xác nhận | Đang chờ thành viên cam kết/tham gia. | Đủ thành viên bắt buộc xác nhận. |
| KHL-04 | Đang kiểm tra/thẩm định KHLCNT | Đơn vị kiểm tra/thẩm định đang xem xét hồ sơ. | Kết quả đạt hoặc yêu cầu sửa. |
| KHL-05 | Yêu cầu chỉnh sửa KHLCNT | Hồ sơ được trả về để sửa. | Người lập gửi lại. |
| KHL-06 | Chờ ý kiến/giải trình | Chỉ áp dụng tuyến Tập đoàn khi cần Ban ĐTXD và VHT giải trình. | Hoàn tất ý kiến + giải trình. |
| KHL-07 | Đang trình phê duyệt KHLCNT | BM03 đang chờ ký qua VOffice hoặc ký cứng. | Có kết quả ký hợp lệ. |
| KHL-08 | KHLCNT đã phê duyệt | Quyết định đã có hiệu lực, chưa hoàn tất công khai. | Đăng tải thành công. |
| KHL-09 | Đang công khai KHLCNT | Đang đồng bộ/đăng tải lên hệ thống đấu thầu. | Nhận kết quả đăng tải thành công. |
| KHL-10 | Hoàn thành KHLCNT | Đã phê duyệt và công khai; gói được phép tổ chức LCNT. | Trạng thái kết thúc chặng KHLCNT. |
| KHL-X | Đã hủy | Hồ sơ bị hủy; nếu cần đổi cấp phê duyệt phải tạo hồ sơ mới. | Kết thúc. |

# **4. Luồng TO-BE - Tổ chức lựa chọn nhà thầu**

Sau khi KHLCNT hoàn thành, mỗi gói chạy một tiến trình LCNT riêng. Hình thức và phương thức đã được duyệt trong KHLCNT quyết định subprocess tương ứng. Các phòng/ban khác không cần thấy toàn bộ chi tiết nghiệp vụ; giao diện theo dõi cần thể hiện giai đoạn lớn và bước hiện tại của từng gói.

## **4.1. Backbone trạng thái chung của một gói thầu**

| **Mã** | **Giai đoạn lớn** | **Bước hiện tại có thể gặp** | **Trạng thái hiển thị** |
|----|----|----|----|
| LC-01 | Chuẩn bị hồ sơ LCNT | Lập HSMT/HSYC/HSMCG/phương án đàm phán/phương án tự thực hiện. | Đang chuẩn bị hồ sơ LCNT |
| LC-02 | Thẩm định/phê duyệt hồ sơ | Thẩm định và trình ký HSMT/HSYC/HSMCG. | Đang thẩm định hồ sơ LCNT |
| LC-03 | Phát hành/gửi mời | Đăng tải HSMT/HSMCG, gửi HSYC, gửi thư mời. | Đang phát hành hồ sơ LCNT |
| LC-04 | Chờ hồ sơ nhà thầu | Chờ HSDT/HSĐX/HSCG hoặc chờ phiên chào giá. | Chờ nhà thầu phản hồi/nộp hồ sơ |
| LC-05 | Mở/tiếp nhận hồ sơ | Mở thầu, tiếp nhận kết quả hệ thống ngoài. | Đang mở/tiếp nhận hồ sơ |
| LC-06 | Đánh giá | Đánh giá hợp lệ, kỹ thuật, tài chính, làm rõ. | Đang đánh giá hồ sơ |
| LC-07 | Thương thảo/đàm phán | Thương thảo hợp đồng hoặc tổ chức phiên đàm phán. | Đang thương thảo/đàm phán |
| LC-08 | Trình KQLCNT | Lập báo cáo, thẩm định, trình ký KQLCNT. | Đang trình KQLCNT |
| LC-09 | Công khai KQLCNT | Đăng tải kết quả và nhận phản hồi tích hợp. | Đang công khai KQLCNT |
| LC-10 | Chuyển ký hợp đồng | Hoàn thiện hồ sơ và chuyển bước hợp đồng. | Đang chuyển ký hợp đồng |
| LC-11 | Hoàn thành LCNT | KQLCNT đã công khai và hồ sơ đã chuyển sang quản lý hợp đồng. | Hoàn thành lựa chọn nhà thầu |
| LC-X | Hủy/Không thực hiện | Hủy thầu hoặc dừng gói theo căn cứ. | Đã hủy / Không thực hiện |

## **4.2. Đấu thầu rộng rãi - 1 giai đoạn 1 túi hồ sơ**

1.  Tổ chuyên gia lập HSMT từ dữ liệu gói/KHLCNT; người dùng hoàn thiện yêu cầu kỹ thuật, tiêu chuẩn đánh giá, phạm vi cung cấp và điều khoản hợp đồng. Trạng thái: Đang chuẩn bị hồ sơ LCNT.

2.  HSMT được thẩm định/phê duyệt. Nếu bị yêu cầu sửa, task quay về Tổ chuyên gia. Trạng thái: Đang thẩm định hồ sơ LCNT / Yêu cầu chỉnh sửa.

3.  Người có quyền phát hành HSMT; hệ thống tích hợp Cổng đấu thầu và lưu mã/trạng thái phát hành. Trạng thái: Đang phát hành hồ sơ LCNT.

4.  Hệ thống theo dõi thời gian đóng thầu và nhận danh sách HSDT. Trạng thái: Chờ nhà thầu nộp hồ sơ.

5.  Tổ chức mở thầu. Trạng thái: Đang mở/tiếp nhận hồ sơ.

6.  Tổ chuyên gia đánh giá HSDT, ghi nhận làm rõ nếu có. Trạng thái: Đang đánh giá hồ sơ.

7.  Tổ chức thương thảo với nhà thầu được lựa chọn để thương thảo. Trạng thái: Đang thương thảo.

8.  Lập, thẩm định và trình phê duyệt KQLCNT. Trạng thái: Đang trình KQLCNT.

9.  Sau phê duyệt, công khai KQLCNT và chuyển hồ sơ sang hợp đồng. Trạng thái: Đang công khai KQLCNT → Đang chuyển ký hợp đồng → Hoàn thành LCNT.

## **4.3. Đấu thầu rộng rãi - 1 giai đoạn 2 túi hồ sơ**

Luồng giống 1 túi ở các bước lập/thẩm định/phát hành HSMT, nhưng giai đoạn đánh giá phải tách kỹ thuật và tài chính. Không được mở hồ sơ tài chính trước khi kết thúc việc đánh giá và phê duyệt danh sách nhà thầu đáp ứng kỹ thuật.

| **Trình tự** | **Bước hiện tại** | **Trạng thái hiển thị** |
|----|----|----|
| 1 | Mở và đánh giá HSĐX kỹ thuật | Đang đánh giá kỹ thuật |
| 2 | Trình/phê duyệt danh sách nhà thầu đáp ứng kỹ thuật | Đang phê duyệt kết quả kỹ thuật |
| 3 | Mở HSĐX tài chính của nhà thầu đạt kỹ thuật | Đang mở hồ sơ tài chính |
| 4 | Đánh giá tài chính/xếp hạng | Đang đánh giá tài chính |
| 5 | Thương thảo | Đang thương thảo |
| 6 | Trình KQLCNT → công khai → hợp đồng | Đang trình KQLCNT → Đang công khai → Đang chuyển ký hợp đồng |

## **4.4. Đấu thầu hạn chế**

Khác đấu thầu rộng rãi ở bước đầu: phải hình thành, phê duyệt và công khai danh sách ngắn trước khi phát hành HSMT. Sau đó tiếp tục theo phương thức 1 túi hoặc 2 túi đã được duyệt.

- Lập danh sách ngắn → Trạng thái: Đang lập danh sách ngắn.

- Phê duyệt/công khai danh sách ngắn → Trạng thái: Đang phê duyệt danh sách ngắn / Đã công khai danh sách ngắn.

- Phát hành HSMT cho các nhà thầu trong danh sách ngắn.

- Tiếp tục đánh giá, thương thảo và KQLCNT theo phương thức tương ứng.

## **4.5. Chào giá trực tuyến**

- Lập và phê duyệt HSMCG → Đang chuẩn bị/Đang thẩm định hồ sơ LCNT.

- Đăng HSMCG và mở phiên chào giá qua Cổng đấu thầu Viettel → Đang phát hành/Đang chào giá trực tuyến.

- Nhận kết quả phiên chào giá và kiểm tra/xác nhận kết quả → Đang đánh giá kết quả chào giá.

- Lập, phê duyệt và công khai KQLCNT → Đang trình KQLCNT / Đang công khai KQLCNT.

- Chuyển sang hợp đồng → Đang chuyển ký hợp đồng.

## **4.6. Chỉ định thầu**

- Chọn nhà thầu dự kiến chỉ định và lập HSYC/dự thảo yêu cầu → Đang chuẩn bị hồ sơ LCNT.

- Phê duyệt HSYC nếu áp dụng → Đang thẩm định hồ sơ LCNT.

- Gửi HSYC và nhận HSĐX → Chờ nhà thầu phản hồi.

- Đánh giá HSĐX → Đang đánh giá hồ sơ.

- Thương thảo, hoàn thiện hợp đồng → Đang thương thảo.

- Phê duyệt/công khai KQLCNT → Đang trình KQLCNT / Đang công khai KQLCNT.

- Chuyển ký hợp đồng → Đang chuyển ký hợp đồng.

## **4.7. Đàm phán trực tiếp**

- Lập và phê duyệt phương án đàm phán → Đang chuẩn bị phương án đàm phán.

- Gửi thư mời nhà thầu/hãng sản xuất → Đang mời đàm phán.

- Tổ chức từng phiên đàm phán, ghi nhận điểm thống nhất/chưa thống nhất → Đang đàm phán.

- Lập Báo cáo kết quả đàm phán và đề xuất nhà thầu → Đang tổng hợp kết quả đàm phán.

- Phê duyệt/công khai KQLCNT → Đang trình KQLCNT / Đang công khai KQLCNT.

- Chuyển hợp đồng → Đang chuyển ký hợp đồng.

## **4.8. Đặt hàng và Giao nhiệm vụ**

Hai hình thức có thể tái sử dụng nhiều thành phần UI/workflow. Điểm khác chính là quan hệ giữa đơn vị giao/đặt và đơn vị thành viên được thực hiện.

| **Bước** | **Đặt hàng/Giao nhiệm vụ** | **Trạng thái hiển thị** |
|:--:|----|----|
| 1 | Lập, thẩm định, phê duyệt HSYC. | Đang chuẩn bị/Đang thẩm định hồ sơ LCNT |
| 2 | Gửi HSYC và nhận HSĐX. | Chờ đơn vị/nhà thầu phản hồi |
| 3 | Mở/đánh giá HSĐX. | Đang đánh giá hồ sơ |
| 4 | Thương thảo, hoàn thiện nội dung. | Đang thương thảo |
| 5 | Trình/phê duyệt/công khai KQLCNT. | Đang trình KQLCNT / Đang công khai KQLCNT |
| 6 | Ký hợp đồng/giao nhiệm vụ theo kết quả. | Đang chuyển ký hợp đồng / Hoàn thành LCNT |

## **4.9. Tự thực hiện**

- Chọn đơn vị phụ thuộc được giao thực hiện → Đang chuẩn bị phương án tự thực hiện.

- Lập phương án tự thực hiện và dự thảo thỏa thuận giao việc → Đang lập phương án.

- Chủ đầu tư và đơn vị được giao hoàn thiện phương án → Đang hoàn thiện phương án.

- Phê duyệt/công khai KQLCNT → Đang trình KQLCNT / Đang công khai KQLCNT.

- Ký thỏa thuận giao việc → Đang ký thỏa thuận.

- Hoàn tất và chuyển sang quản lý thực hiện → Hoàn thành LCNT.

## **4.10. Trường hợp đặc biệt**

KHLCNT phải ghi rõ lý do áp dụng, cách thức và trình tự tổ chức LCNT. Vì vậy hệ thống không nên ép mọi gói đặc biệt vào một chuỗi trạng thái cố định. Khi KHLCNT được phê duyệt, Camunda khởi tạo workflow theo trình tự đã được phê duyệt; giao diện theo dõi vẫn quy đổi các task cụ thể về các nhóm trạng thái chung như Chuẩn bị hồ sơ, Mời/tiếp nhận, Đánh giá/đàm phán, Trình KQLCNT, Công khai và Hợp đồng.

# **5. Trình ký và tích hợp - quy tắc trạng thái**

| **Tình huống** | **Hành vi người dùng** | **Trạng thái** |
|:--:|:---|:---|
| Trình ký điện tử | Bấm Trình ký → popup → gửi VOffice → chờ callback. | Đang trình ký / Đã ký / Bị từ chối / Lỗi trình ký |
| Trình ký cứng | Bấm Trình ký cứng → upload file/bằng chứng ký → xác nhận. | Đang cập nhật bằng chứng ký / Đã ký |
| Lỗi kỹ thuật tích hợp | Không làm thay đổi quyết định nghiệp vụ; cho Retry. | Lỗi tích hợp - Chờ xử lý |
| Người ký từ chối | Quay về đúng bước cần chỉnh sửa theo flow. | Yêu cầu chỉnh sửa / Bị từ chối |
| Đăng tải lỗi | Retry bước đăng tải; không quay lại phê duyệt. | Lỗi công khai - Chờ xử lý |

# **6. So sánh sự khác biệt giữa các luồng**

| **Luồng** | **Điểm khác biệt chính** | **Trạng thái đặc thù cần hiển thị** |
|----|----|----|
| KHLCNT VHT | BM01 VHT → Cam kết TTD → BM02 Báo cáo kiểm tra → BM03 VHT → công khai. | Đang kiểm tra KHLCNT |
| KHLCNT Tập đoàn | BM01 TĐ → Cam kết TTD → BM02 Báo cáo thẩm định → Ý kiến Ban ĐTXD → VHT giải trình/Phiếu GQCV → BM03 TĐ. | Chờ ý kiến Ban ĐTXD; Đang giải trình |
| Rộng rãi 1 túi | Mở và đánh giá toàn bộ HSDT một lần. | Đang đánh giá hồ sơ |
| Rộng rãi 2 túi | Đánh giá kỹ thuật trước, chỉ nhà thầu đạt mới được mở tài chính. | Đang đánh giá kỹ thuật; Đang mở/đánh giá tài chính |
| Hạn chế | Phải có danh sách ngắn trước HSMT. | Đang lập/phê duyệt/công khai danh sách ngắn |
| Chào giá trực tuyến | Cạnh tranh giá trên Cổng đấu thầu. | Đang chào giá trực tuyến |
| Chỉ định thầu | Tập trung một nhà thầu dự kiến; đánh giá + thương thảo trực tiếp. | Chờ HSĐX; Đang thương thảo |
| Đàm phán trực tiếp | Có phương án và các phiên đàm phán với một/một số hãng/nhà thầu. | Đang đàm phán; Đang tổng hợp kết quả đàm phán |
| Đặt hàng/Giao nhiệm vụ | HSYC → HSĐX → đánh giá → thương thảo; khác về chủ thể giao/đặt. | Chờ đơn vị/nhà thầu phản hồi |
| Tự thực hiện | Không có cạnh tranh HSDT; dùng phương án tự thực hiện và thỏa thuận giao việc. | Đang hoàn thiện phương án tự thực hiện |
| Trường hợp đặc biệt | Trình tự riêng theo KHLCNT được phê duyệt. | Hiển thị theo task thực tế nhưng quy đổi về nhóm trạng thái chung |

# **7. Đề xuất màn hình Theo dõi tiến độ Thầu**

Để đạt mục tiêu các phòng/ban khác nắm được tiến độ, màn danh sách không nên chỉ hiển thị một cột Trạng thái. Nên có tối thiểu các cột sau:

| **Cột**            | **Ví dụ**                              |
|--------------------|----------------------------------------|
| Mã KHLCNT / Mã gói | KHLCNT-2026-015 / GT-03                |
| Tên KHLCNT / Gói   | Mua sắm vật tư phục vụ sản xuất...     |
| Giai đoạn          | Tổ chức LCNT                           |
| Bước hiện tại      | Đang đánh giá kỹ thuật                 |
| Đơn vị/người xử lý | Tổ chuyên gia / Nguyễn Văn A           |
| Bắt đầu bước       | 10/11/2026 09:30                       |
| Hạn xử lý          | 15/11/2026                             |
| Thời gian tại bước | 3 ngày                                 |
| Vướng mắc          | Chờ nhà thầu làm rõ thông số kỹ thuật  |
| Bước tiếp theo     | Trình phê duyệt danh sách đạt kỹ thuật |
| Cập nhật gần nhất  | 13/11/2026 14:20                       |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>Ví dụ cách hiển thị dễ hiểu</strong></p>
<p>Gói GT-03 | Tổ chức LCNT | Đang đánh giá kỹ thuật | Tổ chuyên gia | 3 ngày tại bước | Hạn 15/11/2026 | Vướng: chờ 01 nhà thầu làm rõ. Cách hiển thị này hữu ích hơn một trạng thái chung như “Chấm thầu”.</p></td>
</tr>
</tbody>
</table>

# **8. Danh mục biểu mẫu đã có nguồn và phần chưa có mẫu**

| **Nhóm** | **Biểu mẫu đã có** | **Ghi chú** |
|----|----|----|
| KHLCNT VHT | BM01 Tờ trình KHLCNT VHT; BM02 Báo cáo kiểm tra VHT; BM03 Quyết định VHT; Bản cam kết Tổ thẩm định. | Có thể dùng làm cơ sở sinh form/template TO-BE. |
| KHLCNT Tập đoàn | BM01 Tờ trình Tập đoàn; BM02 Báo cáo thẩm định Tập đoàn; BM03 Quyết định Tập đoàn; Phiếu trình GQCV một gói/nhiều gói; Bản cam kết. | Có thể dùng làm cơ sở sinh form/template TO-BE. |
| Tổ chức LCNT | Chưa có đầy đủ mẫu HSMT/HSYC/HSMCG, Báo cáo đánh giá, Biên bản thương thảo, KQLCNT trong bộ tài liệu đang sử dụng. | Luồng trạng thái được mô tả theo Quy chế và trạng thái hệ thống cũ; tên/template chi tiết cần chốt khi có mẫu khách cung cấp. |

# **9. Nguồn tài liệu sử dụng**

- \[HT cũ\] Diễn giải.docx - cấu trúc màn hình, thông tin gói và trạng thái gói trên hệ thống cũ.

- BM01 Tờ trình KHLCNT VHT/Tập đoàn; BM02 Báo cáo kiểm tra/thẩm định; BM03 Quyết định phê duyệt KHLCNT.

- Bản cam kết Tổ thẩm định; Phiếu trình GQCV một gói/nhiều gói.

- QD 12869 - Quy chế lựa chọn nhà thầu - căn cứ trình tự các hình thức/phương thức LCNT.
