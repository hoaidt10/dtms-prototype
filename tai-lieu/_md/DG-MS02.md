<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS02.docx -->
<!-- pk-sha256: 89dfac161cb88934d3e16639dd3bc181fee03aee2f69429d4abe6fe2c0a16996 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS02 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS02.docx`. Trích dẫn thì ghi mã **DG-MS02** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS02 - PHÊ DUYỆT ĐIỀU CHỈNH ĐỀ XUẤT MUA SẮM**

**Phiên bản tài liệu: 1.0**

|                        |                       |
|------------------------|-----------------------|
| **Đơn vị nghiệp vụ:**  | **Viettel High Tech** |
| **Đơn vị triển khai:** | **Viettel Software**  |

**Hà Nội - 2026**

**TRANG KÝ NHẬN**

*Hà Nội, ngày ..... tháng ..... năm 2026*

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>ĐƠN VỊ TRIỂN KHAI - VIETTEL SOFTWARE</strong></td>
<td style="text-align: center;"><strong>ĐƠN VỊ NGHIỆP VỤ - VIETTEL HIGH TECH</strong></td>
</tr>
<tr>
<td style="text-align: center;">Họ và tên: ..........................................................<br />
Chức vụ: ...............................................................</td>
<td style="text-align: center;">Họ và tên: ..........................................................<br />
Chức vụ: ...............................................................</td>
</tr>
<tr>
<td style="text-align: center;">(Ký, ghi rõ họ tên)</td>
<td style="text-align: center;">(Ký, ghi rõ họ tên)</td>
</tr>
</tbody>
</table>

**THEO DÕI SỬA ĐỔI TÀI LIỆU**

| **Ngày** | **Phiên bản** | **Nội dung sửa đổi** | **Ghi chú** |
|:--:|:--:|----|----|
| 26/09/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS02 từ BPMN MS02; kế thừa cấu trúc tài liệu MS01 và làm rõ các quy tắc riêng của điều chỉnh ĐXMS. |  |

**MỤC LỤC**

[A. GIỚI THIỆU 5](#_heading=)

> [1. Mục đích tài liệu 5](#_heading=)
>
> [2. Phạm vi áp dụng 5](#_heading=)
>
> [3. Tài liệu liên quan 5](#_heading=)
>
> [4. Thuật ngữ và các từ viết tắt 6](#_heading=)

[B. TỔNG QUAN NGHIỆP VỤ 7](#_heading=)

> [1. Mục tiêu 7](#_heading=)
>
> [2. Nguyên tắc của nghiệp vụ điều chỉnh ĐXMS 7](#_heading=)
>
> [3. Các luồng nghiệp vụ thuộc MS02 7](#_heading=)
>
> [4. Vai trò tham gia 8](#_heading=)
>
> [5. Danh mục biểu mẫu/hồ sơ 9](#_heading=)
>
> [6. Nguyên tắc xử lý chung 9](#_heading=)

[C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ 10](#_heading=)

> [1. MS02.01 - Điều chỉnh ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào chưa được Chủ tịch/TGĐ Tập đoàn phê duyệt 10](#_heading=)
>
> [1.1. Khởi tạo hồ sơ điều chỉnh và xác định phần thay đổi 11](#_heading=)
>
> [1.2. Rà soát lại căn cứ, tồn kho và cập nhật cơ sở giá 11](#_heading=)
>
> [1.3. Lập dự thảo điều chỉnh và kiểm duyệt cấp đơn vị 11](#_heading=)
>
> [1.4. Thẩm định CQCM, xử lý NOK và quản lý vòng giải trình 12](#_heading=)
>
> [1.5. Kiểm tra lại phiên bản hồ sơ điều chỉnh và ký lại 12](#_heading=)
>
> [1.6. Lập và ký BM-05 - TTMS ký trước các thành phần còn lại 12](#_heading=)
>
> [1.7. Báo cáo Tập đoàn và phê duyệt điều chỉnh bằng BM-08 12](#_heading=)
>
> [1.8. Lưu ý về ngân sách 13](#_heading=)
>
> [2. MS02.02 - Điều chỉnh ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt 13](#_heading=)
>
> [2.1. Chuẩn bị, tính toán lại và thẩm định hồ sơ điều chỉnh 14](#_heading=)
>
> [2.2. Lập và ký BM-05 theo thứ tự TTMS trước - các thành phần còn lại sau 14](#_heading=)
>
> [2.3. Bỏ qua khối báo cáo Tập đoàn và chuyển trực tiếp sang phê duyệt BM-08 14](#_heading=)
>
> [3. MS02.03 - Điều chỉnh ĐXMS dưới 160 tỷ đồng 14](#_heading=)
>
> [3.1. Chuẩn bị hồ sơ BM-09 và xác định giá trị sau điều chỉnh 15](#_heading=)
>
> [3.2. Thẩm định CQCM và xử lý ý kiến vẫn được tái sử dụng 15](#_heading=)
>
> [3.3. Ký thẩm định trực tiếp BM-09 và phê duyệt theo thẩm quyền sau điều chỉnh 15](#_heading=)

[D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 16](#_heading=)

> [1. Nội dung đã chốt cần thể hiện rõ trong SRS 16](#_heading=)
>
> [2. Nội dung cần tiếp tục làm rõ 18](#_heading=)

[E. PHỤ LỤC - BẢNG SO SÁNH NHANH 03 LUỒNG CON 19](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Tài liệu này diễn giải quy trình MS02 - Phê duyệt điều chỉnh Đề xuất mua sắm theo cách dễ đọc, dễ tra cứu và có thể sử dụng làm tài liệu nghiệp vụ lưu trữ. Nội dung được xây dựng từ BPMN MS02, kế thừa nguyên tắc xử lý của MS01 và làm rõ các điểm riêng của nghiệp vụ điều chỉnh như: lựa chọn ĐXMS cũ, xác định nội dung thay đổi, sử dụng giá trị sau điều chỉnh để phân nhánh, chạy lại rà soát tồn kho và cập nhật báo giá, xác định lại thẩm quyền phê duyệt và quản lý mối quan hệ giữa hồ sơ cũ với hồ sơ điều chỉnh.

Tài liệu là căn cứ tham chiếu cho BA, đơn vị nghiệp vụ, đội phát triển và kiểm thử khi phân tích yêu cầu hoặc kiểm tra cách hệ thống ĐTMS hỗ trợ việc điều chỉnh một ĐXMS đã được phê duyệt.

## 2. Phạm vi áp dụng

Áp dụng cho trường hợp ĐXMS đã được phê duyệt nhưng phát sinh nhu cầu điều chỉnh. MS02 được chia thành ba luồng con theo giá trị ĐXMS sau điều chỉnh và trạng thái phê duyệt của cơ sở tài liệu đầu vào: (i) giá trị sau điều chỉnh từ 160 tỷ đồng trở lên, đầu vào chưa được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt; (ii) giá trị sau điều chỉnh từ 160 tỷ đồng trở lên, đầu vào đã được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt; và (iii) giá trị sau điều chỉnh dưới 160 tỷ đồng.

## 3. Tài liệu liên quan

| **STT** | **Tên tài liệu** | **Nguồn/Ghi chú** |
|:--:|----|----|
| 1 | MS02_Phe_duyet_dieu_chinh_DXMS.drawio | BPMN MS02 bản hiện tại. Dùng làm nguồn trực tiếp cho trình tự TO-BE. |
| 2 | MS01_update_bo_sung_trinh_ky_BM05.drawio | Luồng tham chiếu để tái sử dụng cách thẩm định, ký BM-05, VOffice và các nguyên tắc chung. |
| 3 | QT.CNVTQĐ.ĐTXD.10.2.1 - 2026_Quy trình ĐXMS (ban hành lần 3) | Quy định việc điều chỉnh ĐXMS thực hiện theo thẩm quyền, trình tự thẩm định và phê duyệt tương tự ĐXMS ban đầu; nếu thay đổi thẩm quyền thì áp dụng thẩm quyền sau điều chỉnh. |
| 4 | VHT_Quyết định ban hành KPI đánh giá hoạt động ĐTMS 2026 | Tham chiếu biểu mẫu và cách thực hiện tại VHT. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|----|----|
| 1 | AI | Trí tuệ nhân tạo, hỗ trợ tổng hợp, kiểm tra, gợi ý hoặc sinh dự thảo; người dùng phải rà soát trước khi sử dụng. |
| 2 | BM | Biểu mẫu. |
| 3 | BPMN | Business Process Model and Notation - ký pháp mô hình hóa quy trình nghiệp vụ. |
| 4 | CQCM | Cơ quan chuyên môn. |
| 5 | ĐTMS | Đầu tư mua sắm. |
| 6 | ĐTXD | Đầu tư - Xây dựng. |
| 7 | ĐXMS | Đề xuất mua sắm. |
| 8 | ĐXMS cũ | ĐXMS đã được phê duyệt trước khi phát sinh nhu cầu điều chỉnh. |
| 9 | Giá trị sau điều chỉnh | Giá trị của ĐXMS sau khi áp dụng các nội dung điều chỉnh; là giá trị dùng để phân nhánh quy trình và xác định lại thẩm quyền. |
| 10 | RSTK | Rà soát tồn kho. |
| 11 | TGĐ | Tổng Giám đốc. |
| 12 | TTMS | Đầu mối/cơ quan chủ trì đầu tư mua sắm; trong MS02 thực hiện vai trò CQCM chủ trì về ĐTXD. |
| 13 | VHT | Viettel High Tech. |
| 14 | VOffice | Hệ thống phục vụ trình ký/phát hành, được tích hợp với ĐTMS. |
| 15 | eBOM | Engineering Bill of Materials. |
| 16 | mBOM | Manufacturing Bill of Materials. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

MS02 kiểm soát quá trình điều chỉnh một ĐXMS đã được phê duyệt, bảo đảm hồ sơ điều chỉnh có căn cứ rõ ràng, phản ánh đúng tình trạng thực tế tại thời điểm điều chỉnh và được thẩm định/phê duyệt theo đúng thẩm quyền sau điều chỉnh. Hệ thống ĐTMS hỗ trợ truy xuất hồ sơ cũ, ghi nhận phần thay đổi, cập nhật dữ liệu tồn kho và báo giá, phối hợp thẩm định của các CQCM, quản lý vòng giải trình và trình ký/phê duyệt qua VOffice.

## 2. Nguyên tắc của nghiệp vụ điều chỉnh ĐXMS

- MS02 chỉ khởi tạo từ một ĐXMS đã được phê duyệt. Hồ sơ cũ phải được lưu làm căn cứ và phải truy vết được mối quan hệ giữa phiên bản đã phê duyệt với hồ sơ điều chỉnh.

- Thẩm quyền, trình tự thẩm định và phê duyệt điều chỉnh được thực hiện tương tự việc lập/thẩm định/phê duyệt ĐXMS ban đầu. Nếu điều chỉnh làm thay đổi thẩm quyền phê duyệt thì áp dụng thẩm quyền sau điều chỉnh.

- Giá trị dùng để phân nhánh 160 tỷ là giá trị ĐXMS sau điều chỉnh, không phải giá trị của ĐXMS cũ.

- MS02 luôn thực hiện lại RSTK và cập nhật báo giá/cơ sở giá tại thời điểm điều chỉnh vì tồn kho, giá cả và nhu cầu có thể đã thay đổi so với thời điểm phê duyệt ĐXMS cũ.

- Danh mục biểu mẫu vận dụng lại bộ BM-01 đến BM-09 và Checklist 01/02 của quy trình ĐXMS, lựa chọn theo nhánh sau điều chỉnh.

- Việc điều chỉnh/bổ sung ngân sách được thực hiện đồng thời theo quy trình ngân sách liên quan; BPMN MS02 không mô hình hóa quy trình ngân sách riêng mà chỉ ghi chú để kiểm soát khi triển khai.

## 3. Các luồng nghiệp vụ thuộc MS02

| **Mã luồng** | **Điều kiện áp dụng** | **Kết quả phê duyệt chính** |
|----|----|----|
| MS02.01 | Giá trị ĐXMS sau điều chỉnh \>=160 tỷ; cơ sở tài liệu đầu vào chưa được Chủ tịch/TGĐ Tập đoàn phê duyệt. | Thẩm định BM-05, thực hiện nhánh báo cáo Tập đoàn, sau đó phê duyệt điều chỉnh bằng BM-08. |
| MS02.02 | Giá trị ĐXMS sau điều chỉnh \>=160 tỷ; cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt. | Thẩm định BM-05, bỏ qua khối BM-06/BM-07, phê duyệt điều chỉnh bằng BM-08. |
| MS02.03 | Giá trị ĐXMS sau điều chỉnh \<160 tỷ. | Vẫn thẩm định CQCM bằng BM-04; TTMS và cấp chuyên trách ký thẩm định trực tiếp BM-09; Người có thẩm quyền sau điều chỉnh phê duyệt trực tiếp trên BM-09. |

## 4. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm chính** |
|:--:|----|----|
| 1 | Đơn vị đề xuất mua sắm | Chọn ĐXMS cũ cần điều chỉnh; xác định lý do/phạm vi/nội dung điều chỉnh; rà soát RSTK và báo giá cập nhật; lập dự thảo; lựa chọn CQCM; tiếp nhận ý kiến và hoàn chỉnh hồ sơ điều chỉnh. |
| 2 | TTMS | Kiểm tra danh sách CQCM; chủ trì xử lý nội dung chưa thống nhất; kiểm soát hồ sơ thẩm định; rà soát BM-05 và xác nhận đủ điều kiện trình ký; ký BM-05 trước các thành phần còn lại; xác định nhánh báo cáo TGĐ và trình phê duyệt theo thẩm quyền sau điều chỉnh. |
| 3 | CQCM phối hợp | Thẩm định phần nội dung điều chỉnh theo chức năng nhiệm vụ; lập/ký BM-04, kiểm tra lại hồ sơ sau chỉnh sửa và tham gia ký BM-05 khi thuộc thành phần áp dụng. |
| 4 | Phó TGĐ/Phó GĐ chuyên trách | Tham gia ký thẩm định BM-05 hoặc BM-09 theo nhánh áp dụng. |
| 5 | Thủ trưởng đơn vị VHT/Người có thẩm quyền | Kết luận nội dung chưa thống nhất; xác nhận trình ký BM-06 khi cần báo cáo Tập đoàn; phê duyệt hồ sơ điều chỉnh theo thẩm quyền sau điều chỉnh. |
| 6 | Ban ĐTXD Tập đoàn | Tiếp nhận BM-06/hồ sơ điều chỉnh, xem xét và lập BM-07 khi thuộc nhánh phải báo cáo TGĐ Tập đoàn. |
| 7 | Tổng GĐ Tập đoàn | Tiếp nhận, xem xét/cho ý kiến đối với BM-07 theo phương án TO-BE hiện tại. |
| 8 | Hệ thống ĐTMS/Tích hợp/AI | Lấy dữ liệu ĐXMS cũ và kết quả đã thực hiện; hỗ trợ gợi ý nội dung điều chỉnh; cập nhật dữ liệu tồn kho/báo giá; tổng hợp BM-04; sinh dự thảo; trình ký qua VOffice; theo dõi trạng thái và kết quả ký. |

## 5. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng** |
|:--:|----|----|
| 1 | Checklist 01 | Checklist hồ sơ điều chỉnh áp dụng khi giá trị sau điều chỉnh từ 160 tỷ đồng trở lên. |
| 2 | Checklist 02 | Checklist hồ sơ điều chỉnh áp dụng khi giá trị sau điều chỉnh dưới 160 tỷ đồng. |
| 3 | BM-01 | Tờ trình/hồ sơ điều chỉnh ĐXMS đối với nhánh từ 160 tỷ đồng trở lên. |
| 4 | BM-02 | Phiếu trình giải quyết công việc/giải trình đối với ý kiến thẩm định. |
| 5 | BM-03 | Yêu cầu/Công văn đề nghị góp ý, thẩm định hồ sơ điều chỉnh. |
| 6 | BM-04 | Văn bản thẩm định dự thảo điều chỉnh ĐXMS của CQCM. |
| 7 | BM-05 | Báo cáo kết quả thẩm định điều chỉnh ĐXMS. |
| 8 | BM-06 | Công văn báo cáo TGĐ Tập đoàn về nội dung điều chỉnh trước khi phê duyệt. |
| 9 | BM-07 | Báo cáo gửi TGĐ Tập đoàn về nội dung điều chỉnh ĐXMS. |
| 10 | BM-08 | Quyết định phê duyệt điều chỉnh ĐXMS đối với nhánh \>=160 tỷ. |
| 11 | BM-09 | Tờ trình điều chỉnh ĐXMS ký trực tiếp đối với nhánh \<160 tỷ. |
| 12 | Hồ sơ ĐXMS cũ | ĐXMS đã được phê duyệt và các kết quả đã thực hiện, được dùng làm căn cứ xác định nội dung điều chỉnh. |

## 6. Nguyên tắc xử lý chung

- Người dùng phải rà soát và xác nhận nội dung do AI sinh/gợi ý trước khi hệ thống sử dụng cho bước tiếp theo; AI không thay thế quyết định nghiệp vụ của người dùng.

- Hồ sơ điều chỉnh phải lưu được dữ liệu ĐXMS cũ, lý do/phạm vi/nội dung điều chỉnh và phiên bản hiện tại để phục vụ truy vết.

- RSTK và báo giá phải được thực hiện/cập nhật lại tại thời điểm điều chỉnh; không mặc định tái sử dụng kết quả cũ để vượt bước.

- Giá trị và Người có thẩm quyền được xác định lại sau điều chỉnh. Hồ sơ có thể chuyển từ nhánh \<160 tỷ sang \>=160 tỷ hoặc ngược lại nếu giá trị sau điều chỉnh thay đổi.

- Hồ sơ sau khi đã bị chỉnh sửa theo ý kiến CQCM phải được CQCM kiểm tra lại và ký/xác nhận lại trên đúng phiên bản hiện tại. Kết quả ký của phiên bản cũ không được coi là kết quả hợp lệ cho phiên bản mới.

- ĐTMS chỉ chuyển bước sau khi nhận được kết quả ký hợp lệ qua tích hợp VOffice đối với các văn bản yêu cầu ký.

- Luồng \<160 tỷ vẫn đi qua vòng CQCM/BM-04 và chỉ tách khỏi luồng \>=160 tỷ ngay trước khối BM-05.

- Đối với BM-05, TTMS phải ký trước. Sau khi hệ thống nhận kết quả TTMS ký thành công mới được giao việc ký cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Phần này diễn giải theo ba luồng con để người đọc không cần theo dõi từng số thứ tự trên BPMN vẫn có thể hiểu toàn bộ logic nghiệp vụ: hồ sơ điều chỉnh bắt đầu từ đâu, thông tin nào phải được tính lại, CQCM tham gia như thế nào, bộ biểu mẫu thay đổi theo giá trị sau điều chỉnh ra sao, khi nào phải báo cáo Tập đoàn và kết thúc ở văn bản nào.

## 1. MS02.01 - Điều chỉnh ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào chưa được Chủ tịch/TGĐ Tập đoàn phê duyệt

|  |  |
|----|----|
| **Mô tả** | Luồng điều chỉnh đầy đủ nhất của MS02. Hồ sơ bắt đầu từ một ĐXMS đã được phê duyệt, được cập nhật lại căn cứ/tồn kho/báo giá, thẩm định CQCM, lập BM-05, sau đó thực hiện nhánh báo cáo Tập đoàn trước khi phê duyệt điều chỉnh bằng BM-08. |
| **Điều kiện áp dụng** | Giá trị ĐXMS sau điều chỉnh từ 160 tỷ đồng trở lên và cơ sở tài liệu đầu vào chưa được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt. |
| **Đầu vào chính** | ĐXMS đã được phê duyệt; BM-08 hoặc BM-09 tương ứng của hồ sơ cũ; các kết quả đã thực hiện; căn cứ liên quan; dữ liệu tồn kho hiện tại; báo giá cập nhật; nội dung phát sinh dẫn tới điều chỉnh. |
| **Đầu ra chính** | BM-08 phê duyệt điều chỉnh ĐXMS hoặc hồ sơ được trả lại để tiếp tục hoàn chỉnh/xử lý theo chỉ đạo. |
| **Vai trò tham gia** | Đơn vị đề xuất; TTMS; CQCM phối hợp; Phó TGĐ/Phó GĐ chuyên trách; Thủ trưởng đơn vị VHT; Ban ĐTXD Tập đoàn; TGĐ Tập đoàn; Hệ thống ĐTMS/Tích hợp/AI. |
| **Biểu mẫu/Hồ sơ** | BM-01, BM-02, BM-03, BM-04, BM-05, BM-06, BM-07, BM-08, Checklist 01; hồ sơ ĐXMS cũ; kết quả RSTK và báo giá cập nhật. |

### 1.1. Khởi tạo hồ sơ điều chỉnh và xác định phần thay đổi

Đơn vị đề xuất không tạo một ĐXMS mới hoàn toàn độc lập mà bắt đầu bằng việc lựa chọn ĐXMS đã được phê duyệt cần điều chỉnh. ĐTMS lấy lại hồ sơ cũ, các căn cứ liên quan và thông tin/kết quả đã thực hiện để tạo bối cảnh cho hồ sơ điều chỉnh. Mục tiêu của bước này là giúp người dùng nhìn được trạng thái trước điều chỉnh và xác định chính xác phần nào đang cần thay đổi, đồng thời duy trì khả năng truy vết giữa hồ sơ cũ và hồ sơ mới.

AI có thể tổng hợp dữ liệu cũ và gợi ý các nội dung có khả năng cần cập nhật, nhưng đơn vị đề xuất phải tự xác định và xác nhận lý do, phạm vi và nội dung điều chỉnh. Nội dung điều chỉnh có thể liên quan đến nhu cầu, chủng loại/số lượng hàng hóa, chỉ tiêu kỹ thuật, phương án công nghệ, giá trị, tiến độ hoặc nội dung khác của ĐXMS. Hệ thống cần cho phép người dùng mô tả rõ nội dung trước điều chỉnh, nội dung đề nghị điều chỉnh và căn cứ/lý do phát sinh để người thẩm định sau này hiểu được bản chất thay đổi.

### 1.2. Rà soát lại căn cứ, tồn kho và cập nhật cơ sở giá

Sau khi xác định nội dung điều chỉnh, đơn vị đề xuất bóc tách lại các căn cứ/hạng mục bị ảnh hưởng. ĐTMS kiểm tra lại Dự toán, eBOM, mBOM và dữ liệu tồn kho theo tình trạng hiện tại. Đây là yêu cầu bắt buộc của MS02, kể cả khi ĐXMS cũ trước đây đã từng được rà soát tồn kho, vì số lượng tồn kho, nhu cầu sử dụng và dữ liệu sản xuất có thể đã thay đổi trong khoảng thời gian từ lúc phê duyệt đến lúc điều chỉnh.

Đơn vị đề xuất tiếp nhận kết quả RSTK cập nhật để xác định chính xác phần nhu cầu còn phải mua. Trên cơ sở đó, người dùng khởi tạo yêu cầu báo giá điều chỉnh; theo TO-BE kế thừa MS01, hệ thống gửi yêu cầu báo giá trực tiếp tới nhà cung cấp/đầu mối nhận báo giá. Báo giá được tổng hợp và kiểm tra lại để hình thành cơ sở giá tại thời điểm điều chỉnh. Giá trị sau điều chỉnh được xác định từ hồ sơ hiện tại và là giá trị chính thức dùng để lựa chọn nhánh quy trình, Checklist và thẩm quyền phê duyệt.

### 1.3. Lập dự thảo điều chỉnh và kiểm duyệt cấp đơn vị

Vì giá trị sau điều chỉnh từ 160 tỷ đồng trở lên, hồ sơ sử dụng BM-01 và Checklist 01. Dự thảo phải phản ánh đầy đủ phần kế thừa từ ĐXMS cũ, phần thay đổi, căn cứ dẫn tới điều chỉnh, kết quả RSTK và báo giá cập nhật. Chỉ huy đơn vị đề xuất kiểm duyệt hồ sơ trước khi chuyển ra ngoài đơn vị. Nếu hồ sơ chưa đạt, AI có thể hỗ trợ chỉ ra phần thiếu/chưa nhất quán nhưng quyết định chỉnh sửa vẫn thuộc về người dùng.

Sau khi đạt cấp đơn vị, hệ thống sinh BM-03 và đơn vị đề xuất lựa chọn CQCM cần tham gia thẩm định. Danh sách CQCM chưa được gửi ngay: TTMS phải xác nhận danh sách đã đúng chức năng, đúng phạm vi và đầy đủ đối với phần nội dung điều chỉnh. Nếu chưa đúng/đủ, hồ sơ quay lại để điều chỉnh danh sách; chỉ khi TTMS đồng ý hệ thống mới gửi yêu cầu thẩm định.

### 1.4. Thẩm định CQCM, xử lý NOK và quản lý vòng giải trình

Mỗi CQCM thẩm định hồ sơ điều chỉnh theo chức năng nhiệm vụ và lập BM-04 riêng. Phiếu BM-04 phải làm rõ phần đồng ý, phần chưa đạt và yêu cầu sửa đổi/bổ sung nếu có. Chỉ huy CQCM xác nhận nội dung trước khi hệ thống trình ký BM-04 qua VOffice. Hệ thống chỉ chuyển sang tổng hợp khi đã đủ BM-04 ký hợp lệ của các CQCM trong danh sách; việc có đủ phiếu không đồng nghĩa hồ sơ không còn ý kiến NOK.

Sau khi đủ BM-04, AI hỗ trợ phát hiện ý kiến mâu thuẫn/xung đột và tóm tắt các nội dung NOK cho đơn vị đề xuất. Đơn vị đề xuất lựa chọn tiếp thu hoặc giải trình/bảo lưu. Nếu tiếp thu, hồ sơ được cập nhật theo ý kiến CQCM; nếu bảo lưu, BM-02 và nội dung giải trình được lập để nêu rõ lý do. Hệ thống ghi nhận số vòng xử lý. Khi vượt 02 vòng theo thiết kế TO-BE, hệ thống cảnh báo/yêu cầu họp; TTMS chủ trì họp giữa các bên và cập nhật kết quả. Nếu sau họp vẫn chưa thống nhất, TTMS trình Thủ trưởng đơn vị VHT xem xét, kết luận.

### 1.5. Kiểm tra lại phiên bản hồ sơ điều chỉnh và ký lại

Sau khi đơn vị đề xuất hoàn chỉnh hồ sơ, CQCM phải kiểm tra lại đúng phiên bản hiện tại của hồ sơ điều chỉnh. BM-04 và Checklist 01 phải được xác nhận/ký lại trên phiên bản đang trình; kết quả ký của ĐXMS cũ hoặc phiên bản trước đó không được sử dụng để vượt bước. ĐTMS tạo/gửi trình ký qua VOffice và chỉ chuyển tiếp khi đủ kết quả hợp lệ của phiên bản hiện tại.

### 1.6. Lập và ký BM-05 - TTMS ký trước các thành phần còn lại

Sau khi hồ sơ điều chỉnh đã hoàn chỉnh và đủ kết quả ký lại, AI sinh dự thảo BM-05 từ hồ sơ điều chỉnh và các ý kiến thẩm định. TTMS rà soát/cập nhật BM-05 để bảo đảm Báo cáo kết quả thẩm định phản ánh đúng phần thay đổi, căn cứ điều chỉnh và kết quả xử lý ý kiến CQCM. Task này chỉ là rà soát/cập nhật, chưa phải hành động ký.

Khi BM-05 đã đầy đủ, TTMS xác nhận hồ sơ đủ điều kiện trình ký. Hệ thống sau đó tạo/gửi yêu cầu trình ký BM-05 qua VOffice riêng cho TTMS. TTMS ký BM-05 với tư cách CQCM chủ trì về ĐTXD. Chỉ sau khi ĐTMS nhận được kết quả TTMS ký thành công, hệ thống mới thông báo/giao việc ký BM-05 cho CQCM Tài chính, CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách. Đây là điểm kiểm soát tuần tự quan trọng để thể hiện rõ TTMS ký trước, các thành phần còn lại ký sau trên cùng phiên bản BM-05.

### 1.7. Báo cáo Tập đoàn và phê duyệt điều chỉnh bằng BM-08

Sau khi đủ kết quả ký BM-05, TTMS xác định hồ sơ điều chỉnh có thuộc trường hợp cần báo cáo TGĐ Tập đoàn trước khi phê duyệt hay không. Với MS02.01, nhánh báo cáo được thực hiện: AI sinh dự thảo BM-06; TTMS rà soát; Thủ trưởng đơn vị VHT xác nhận trình ký; hệ thống chuyển BM-06 qua VOffice và Ban ĐTXD Tập đoàn. Ban ĐTXD xem xét hồ sơ điều chỉnh và lập BM-07; thông tin BM-07 được gửi tới TGĐ Tập đoàn đồng thời thông báo cho TTMS và đầu mối đơn vị đề xuất theo TO-BE đã chốt.

Theo BPMN hiện tại, TGĐ Tập đoàn tiếp tục xem xét/cho ý kiến đối với nội dung điều chỉnh trước khi luồng chuyển sang phê duyệt. Khi điều kiện phê duyệt được đáp ứng, hệ thống sinh dự thảo BM-08. TTMS rà soát BM-08 và Checklist 01 rồi trình Người có thẩm quyền theo thẩm quyền sau điều chỉnh. Nếu điều chỉnh làm thay đổi cấp có thẩm quyền so với ĐXMS cũ, hồ sơ phải được trình đúng cấp mới; việc đã được phê duyệt trước đây ở cấp khác không làm thay đổi quy tắc này. Khi được phê duyệt, hệ thống chuyển BM-08 sang VOffice để ký/phát hành và cập nhật kết quả về ĐTMS.

### 1.8. Lưu ý về ngân sách

Quy trình nguồn quy định việc điều chỉnh ĐXMS được thực hiện đồng thời với việc điều chỉnh/bổ sung ngân sách để triển khai thủ tục mua sắm. BPMN MS02 không vẽ một subprocess ngân sách riêng; vì vậy SRS và tài liệu tích hợp cần ghi rõ đây là nội dung cần được kiểm soát song song, tránh hiểu rằng phê duyệt điều chỉnh ĐXMS tự động đồng nghĩa ngân sách đã được điều chỉnh.

## 2. MS02.02 - Điều chỉnh ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt

|  |  |
|----|----|
| **Mô tả** | Luồng điều chỉnh sử dụng cùng cơ chế chuẩn bị, RSTK/báo giá và thẩm định như MS02.01 nhưng không đi qua khối BM-06/BM-07; sau khi BM-05 hoàn tất, hồ sơ chuyển trực tiếp sang giai đoạn phê duyệt BM-08. |
| **Điều kiện áp dụng** | Giá trị ĐXMS sau điều chỉnh từ 160 tỷ đồng trở lên và cơ sở tài liệu đầu vào đã được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt. |
| **Đầu vào chính** | ĐXMS đã được phê duyệt; kết quả đã thực hiện; tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt; dữ liệu tồn kho hiện tại; báo giá cập nhật; nội dung phát sinh dẫn tới điều chỉnh. |
| **Đầu ra chính** | BM-08 phê duyệt điều chỉnh ĐXMS hoặc hồ sơ được trả lại để hoàn chỉnh. |
| **Vai trò tham gia** | Đơn vị đề xuất; TTMS; CQCM phối hợp; Phó TGĐ/Phó GĐ chuyên trách; Người có thẩm quyền sau điều chỉnh; Hệ thống ĐTMS/Tích hợp/AI. |
| **Biểu mẫu/Hồ sơ** | BM-01, BM-02, BM-03, BM-04, BM-05, BM-08, Checklist 01; hồ sơ ĐXMS cũ; kết quả RSTK và báo giá cập nhật. |

### 2.1. Chuẩn bị, tính toán lại và thẩm định hồ sơ điều chỉnh

Phần đầu của MS02.02 được xử lý giống MS02.01. Đơn vị đề xuất chọn ĐXMS đã phê duyệt cần điều chỉnh, hệ thống lấy dữ liệu cũ và kết quả đã thực hiện, AI gợi ý nội dung có thể cần cập nhật, sau đó người dùng xác nhận lý do, phạm vi và nội dung điều chỉnh. Tiếp theo, hệ thống chạy lại kiểm tra Dự toán/eBOM/mBOM/tồn kho, đơn vị đề xuất nhận RSTK cập nhật, lập yêu cầu báo giá và cập nhật cơ sở giá tại thời điểm điều chỉnh. Giá trị sau điều chỉnh được dùng để xác định rằng hồ sơ vẫn thuộc nhánh \>=160 tỷ và để xác định lại thẩm quyền.

Hồ sơ được lập theo BM-01 + Checklist 01, kiểm duyệt cấp đơn vị, sinh BM-03 và lựa chọn CQCM. TTMS xác nhận danh sách CQCM đúng/đủ trước khi hệ thống gửi thẩm định. Các CQCM lập/ký BM-04, hệ thống tổng hợp đủ phiếu hợp lệ, AI tóm tắt nội dung NOK, đơn vị đề xuất tiếp thu hoặc giải trình bằng BM-02. Nếu hồ sơ xử lý nhiều vòng, cơ chế cảnh báo, họp và trình cấp cao hơn được áp dụng giống MS02.01. Khi hoàn chỉnh, CQCM phải kiểm tra/ký lại BM-04 và Checklist 01 trên đúng phiên bản hiện tại.

### 2.2. Lập và ký BM-05 theo thứ tự TTMS trước - các thành phần còn lại sau

AI sinh dự thảo BM-05; TTMS rà soát/cập nhật nội dung và xác nhận hồ sơ đủ điều kiện. Hệ thống trình ký BM-05 cho TTMS qua VOffice. Chỉ sau khi nhận kết quả TTMS ký thành công, hệ thống mới giao việc ký cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách. Tất cả kết quả ký phải thuộc cùng một phiên bản hồ sơ điều chỉnh.

### 2.3. Bỏ qua khối báo cáo Tập đoàn và chuyển trực tiếp sang phê duyệt BM-08

Điểm khác biệt cốt lõi của MS02.02 so với MS02.01 nằm sau BM-05. Do cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt, hồ sơ không đi qua khối BM-06/BM-07 trong phương án hiện tại. Hệ thống chuyển trực tiếp sang sinh dự thảo BM-08; TTMS rà soát BM-08 và Checklist 01 rồi trình Người có thẩm quyền sau điều chỉnh.

Nếu giá trị hoặc nội dung điều chỉnh làm thay đổi thẩm quyền so với hồ sơ cũ, cấp phê duyệt được xác định theo trạng thái sau điều chỉnh. Khi Người có thẩm quyền đồng ý, hệ thống chuyển BM-08 sang VOffice để ký/phát hành và cập nhật trạng thái phê duyệt điều chỉnh về ĐTMS. Hồ sơ cũ vẫn cần được lưu để truy vết lịch sử và so sánh phần thay đổi.

## 3. MS02.03 - Điều chỉnh ĐXMS dưới 160 tỷ đồng

|  |  |
|----|----|
| **Mô tả** | Luồng điều chỉnh có giá trị sau điều chỉnh dưới 160 tỷ. Vẫn thực hiện đầy đủ việc RSTK/báo giá lại và vòng CQCM/BM-04, nhưng dùng BM-09 + Checklist 02 và không đi qua BM-05/BM-06/BM-07/BM-08. |
| **Điều kiện áp dụng** | Giá trị ĐXMS sau điều chỉnh dưới 160 tỷ đồng. |
| **Đầu vào chính** | ĐXMS đã được phê duyệt; kết quả đã thực hiện; căn cứ liên quan; dữ liệu tồn kho hiện tại; báo giá cập nhật; nội dung phát sinh dẫn tới điều chỉnh. |
| **Đầu ra chính** | BM-09 điều chỉnh ĐXMS được Người có thẩm quyền sau điều chỉnh ký duyệt trực tiếp hoặc hồ sơ được trả lại để hoàn chỉnh. |
| **Vai trò tham gia** | Đơn vị đề xuất; TTMS; CQCM phối hợp; Phó TGĐ/Phó GĐ chuyên trách; Người có thẩm quyền sau điều chỉnh; Hệ thống ĐTMS/Tích hợp/AI. |
| **Biểu mẫu/Hồ sơ** | BM-02, BM-03, BM-04, BM-09, Checklist 02; hồ sơ ĐXMS cũ; kết quả RSTK và báo giá cập nhật. |

### 3.1. Chuẩn bị hồ sơ BM-09 và xác định giá trị sau điều chỉnh

MS02.03 vẫn bắt đầu từ một ĐXMS đã được phê duyệt. Đơn vị đề xuất xác định rõ lý do và nội dung điều chỉnh, hệ thống lấy dữ liệu cũ và kết quả đã thực hiện làm căn cứ. Sau đó, giống hai luồng còn lại, MS02.03 bắt buộc rà soát lại tồn kho và cập nhật báo giá/cơ sở giá. Giá trị sau điều chỉnh mới là căn cứ quyết định hồ sơ thuộc nhánh dưới 160 tỷ; vì vậy ngay cả khi ĐXMS cũ trước đây thuộc nhánh \>=160 tỷ, nếu giá trị sau điều chỉnh thuộc dưới 160 tỷ thì bộ biểu mẫu và thẩm quyền phải được xác định lại theo trạng thái mới.

Với nhánh này, dự thảo chính là BM-09 + Checklist 02. Hồ sơ phải thể hiện được nội dung cũ, nội dung thay đổi, căn cứ/lý do điều chỉnh, kết quả RSTK và báo giá cập nhật. Chỉ huy đơn vị đề xuất kiểm duyệt hồ sơ trước khi gửi CQCM. Sau đó hệ thống sinh BM-03, đơn vị đề xuất chọn CQCM và TTMS xác nhận danh sách đúng/đủ.

### 3.2. Thẩm định CQCM và xử lý ý kiến vẫn được tái sử dụng

MS02.03 không bỏ qua vòng CQCM. Các CQCM vẫn lập và ký BM-04, hệ thống vẫn kiểm soát đủ BM-04 hợp lệ và AI vẫn tổng hợp nội dung NOK. Đơn vị đề xuất tiếp thu hoặc giải trình bằng BM-02; cơ chế đếm vòng, cảnh báo họp, TTMS chủ trì xử lý và trình Thủ trưởng đơn vị kết luận khi chưa thống nhất vẫn được áp dụng. Sau khi hồ sơ được chỉnh sửa, CQCM phải kiểm tra lại và ký/xác nhận BM-04 cùng Checklist 02 trên phiên bản hồ sơ điều chỉnh hiện tại.

### 3.3. Ký thẩm định trực tiếp BM-09 và phê duyệt theo thẩm quyền sau điều chỉnh

Sau điểm tách luồng, MS02.03 không sinh BM-05. TTMS, với vai trò CQCM chủ trì về ĐTXD, xem xét và ký thẩm định trực tiếp trên BM-09. Phó TGĐ/Phó GĐ chuyên trách tiếp tục xem xét và ký thẩm định theo thành phần áp dụng. Hệ thống gửi trình ký BM-09 qua VOffice và chỉ chuyển tiếp khi đủ kết quả ký thẩm định hợp lệ.

Người có thẩm quyền sau điều chỉnh xem xét và ký duyệt trực tiếp BM-09. Nếu việc điều chỉnh làm thay đổi cấp có thẩm quyền so với ĐXMS cũ thì hệ thống phải trình đúng cấp mới. Sau khi ký/phát hành, ĐTMS cập nhật trạng thái hồ sơ điều chỉnh, đồng thời vẫn bảo toàn hồ sơ cũ để phục vụ lịch sử và truy vết.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

BPMN thể hiện thứ tự và các điểm quyết định chính nhưng không thể hiện hết yêu cầu dữ liệu, quyền, phiên bản, trạng thái và quy tắc truy vết đặc thù của nghiệp vụ điều chỉnh. Các nội dung dưới đây cần được ghi rõ trong SRS/thiết kế chi tiết để đội phát triển và kiểm thử hiểu thống nhất.

## 1. Nội dung đã chốt cần thể hiện rõ trong SRS

| **STT** | **Nội dung cần đặc tả** | **Yêu cầu mô tả chi tiết** |
|:--:|----|----|
| 1 | Quan hệ giữa ĐXMS cũ và hồ sơ điều chỉnh | Mỗi hồ sơ MS02 phải tham chiếu duy nhất tới ĐXMS đã được phê duyệt cần điều chỉnh. Hệ thống cần lưu mã hồ sơ cũ, phiên bản/quyết định phê duyệt cũ và liên kết ngược để người dùng xem lịch sử. |
| 2 | Phạm vi dữ liệu kế thừa từ ĐXMS cũ | Hệ thống được phép lấy lại dữ liệu/căn cứ/kết quả đã thực hiện để hỗ trợ người dùng, nhưng phải phân biệt dữ liệu kế thừa với dữ liệu được cập nhật tại thời điểm điều chỉnh. Không được làm mất dấu thông tin của hồ sơ đã phê duyệt. |
| 3 | Lý do, phạm vi và nội dung điều chỉnh | Cần có cấu trúc dữ liệu cho lý do điều chỉnh, nội dung trước điều chỉnh, nội dung sau điều chỉnh và căn cứ chứng minh. Người dùng phải xác nhận nội dung trước khi tiếp tục. |
| 4 | Giá trị sau điều chỉnh và xác định lại thẩm quyền | Giá trị sau điều chỉnh là giá trị dùng để phân nhánh \<160/≥160 tỷ và xác định Người có thẩm quyền. Hệ thống cần cảnh báo/ghi nhận khi hồ sơ chuyển ngưỡng hoặc thay đổi cấp phê duyệt so với ĐXMS cũ. |
| 5 | Bắt buộc chạy lại RSTK | MS02 không dùng kết quả tồn kho cũ để bỏ qua bước. Hệ thống phải thực hiện/nhận lại dữ liệu tồn kho tại thời điểm điều chỉnh và lưu thời điểm/snapshot dùng để lập hồ sơ. |
| 6 | Bắt buộc cập nhật báo giá/cơ sở giá | Báo giá/cơ sở giá phải được cập nhật lại tại thời điểm điều chỉnh. Cần lưu nhà cung cấp, thời điểm nhận, phạm vi hàng hóa/dịch vụ và mối liên hệ với giá trị sau điều chỉnh. |
| 7 | Kiểm soát danh sách CQCM | Sau khi Đơn vị ĐXMS chọn CQCM, TTMS phải xác nhận danh sách đúng chức năng/phạm vi và đủ thành phần đối với nội dung điều chỉnh trước khi hệ thống gửi yêu cầu thẩm định. |
| 8 | Quản lý phiên bản hồ sơ điều chỉnh | Mỗi lần hồ sơ được chỉnh sửa sau ý kiến CQCM cần xác định rõ phiên bản hiện tại. BM-04/Checklist của phiên bản cũ không được sử dụng làm kết quả hợp lệ cho phiên bản mới. |
| 9 | Điều kiện “đủ BM-04 hợp lệ” | SRS cần định nghĩa rõ một BM-04 hợp lệ: đúng CQCM trong danh sách đã xác nhận, đúng phiên bản hồ sơ, đã ký hợp lệ và được ĐTMS nhận kết quả thành công qua tích hợp. |
| 10 | Đếm số vòng xử lý lại | Giữ ngưỡng \>02 vòng theo BPMN. SRS cần ghi rõ thời điểm tăng bộ đếm, vòng nào được tính, khi nào reset và cách hiển thị lịch sử. |
| 11 | Trình tự ký BM-05 | TTMS rà soát/cập nhật BM-05 -\> TTMS xác nhận đủ điều kiện -\> Hệ thống trình ký BM-05 cho TTMS -\> nhận kết quả TTMS ký thành công -\> mới thông báo/giao việc ký cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách. |
| 12 | Theo dõi trạng thái VOffice | Với mỗi lần trình ký, ĐTMS cần lưu mã giao dịch/yêu cầu, người ký, thời điểm gửi, trạng thái chờ/ký thành công/từ chối/hủy/lỗi và phiên bản hồ sơ tương ứng. |
| 13 | Xử lý AI | Mọi nội dung AI sinh hoặc tóm tắt là gợi ý. Người dùng cần xem được dữ liệu đầu vào, chỉnh sửa nội dung AI và xác nhận trước khi lưu/chuyển bước. |
| 14 | Điều chỉnh/bổ sung ngân sách | Cần ghi chú trong hồ sơ rằng nghiệp vụ ngân sách được thực hiện đồng thời theo quy trình liên quan. MS02 không tự sinh hay mô hình hóa các bước ngân sách trong BPMN. |
| 15 | Audit log | Cần lưu người thực hiện, thời điểm, hành động, nội dung thay đổi, phiên bản trước/sau, lý do trả lại và kết quả tích hợp để phục vụ truy vết điều chỉnh. |

## 2. Nội dung cần tiếp tục làm rõ

| **STT** | **Nội dung** | **Điểm cần xác nhận** |
|:--:|----|----|
| 1 | Phạm vi “kết quả đã thực hiện” của ĐXMS cũ | Quy trình yêu cầu điều chỉnh dựa trên kết quả đã thực hiện của ĐXMS cũ nhưng chưa quy định chi tiết dữ liệu nào được coi là kết quả đã thực hiện và dữ liệu nào chỉ dùng tham khảo. Cần chốt để tránh điều chỉnh trùng phần đã hoàn thành/đã cam kết. |
| 2 | Xử lý hạng mục đã phát sinh đơn hàng/hợp đồng hoặc đã hoàn thành | Cần xác định quy tắc khóa/cho phép điều chỉnh đối với phần đã triển khai; BPMN hiện chưa mô tả các trạng thái này. |
| 3 | Trạng thái của ĐXMS cũ sau khi điều chỉnh được phê duyệt | Cần xác định ĐXMS cũ hiển thị trạng thái nào (ví dụ còn hiệu lực một phần, bị thay thế bởi phiên bản điều chỉnh, hoặc trạng thái khác) và cách người dùng phân biệt phiên bản đang có hiệu lực. |
| 4 | Điều kiện ngân sách có phải là điều kiện chặn phê duyệt hay chỉ xử lý song song | Nguồn quy định thực hiện đồng thời nhưng BPMN không thể hiện gateway/chốt điều kiện. Cần nghiệp vụ xác nhận nếu hệ thống phải ngăn phê duyệt khi ngân sách chưa hoàn tất. |
| 5 | Cơ chế trả hồ sơ khi ký BM-05 | Khi CQCM phối hợp và Phó TGĐ/Phó GĐ đang xử lý song song, nếu một bên từ chối trong khi bên còn lại chưa phản hồi thì cần chốt trả ngay hay chờ đủ hai kết quả. BPMN hiện tạm dùng chờ đủ hai kết quả rồi kiểm tra. |
| 6 | Ma trận CQCM bắt buộc theo loại nội dung điều chỉnh | BPMN có bước TTMS xác nhận “đúng và đủ” nhưng chưa có ma trận chính thức xác định CQCM bắt buộc cho từng loại nội dung thay đổi. |
| 7 | Điều kiện chi tiết của nhánh báo cáo TGĐ | SRS cần dẫn chiếu đúng quy định/ủy quyền để TTMS xác định Có/Không cần báo cáo TGĐ Tập đoàn đối với hồ sơ điều chỉnh. |
| 8 | Trạng thái lỗi/tạm dừng khi tích hợp VOffice | Cần chốt xử lý khi VOffice không phản hồi, lỗi kỹ thuật, người ký hủy/từ chối hoặc có thay đổi người ký; bao gồm quyền gửi lại và kiểm soát trùng yêu cầu. |
| 9 | Hiệu lực/độ mới của báo giá điều chỉnh | BPMN yêu cầu cập nhật báo giá nhưng chưa quy định số lượng báo giá tối thiểu, thời hạn hiệu lực hoặc tiêu chí chọn báo giá/cơ sở giá cho từng nhóm hàng hóa/dịch vụ. |

# E. PHỤ LỤC - BẢNG SO SÁNH NHANH 03 LUỒNG CON

| **Tiêu chí** | **MS02.01** | **MS02.02** | **MS02.03** |
|----|----|----|----|
| Điều kiện giá trị sau điều chỉnh | \>=160 tỷ | \>=160 tỷ | \<160 tỷ |
| Tài liệu đầu vào đã được Chủ tịch/TGĐ TĐ phê duyệt | Chưa | Đã | Không phải tiêu chí phân nhánh chính |
| Bắt đầu từ ĐXMS đã được phê duyệt | Có | Có | Có |
| Chạy lại RSTK tại thời điểm điều chỉnh | Có | Có | Có |
| Cập nhật báo giá/cơ sở giá | Có | Có | Có |
| Dự thảo chính | BM-01 + Checklist 01 | BM-01 + Checklist 01 | BM-09 + Checklist 02 |
| CQCM thẩm định bằng BM-04 | Có | Có | Có |
| BM-02 giải trình | Có | Có | Có |
| BM-05 | Có | Có | Không |
| TTMS ký BM-05 trước các bên khác | Có | Có | Không áp dụng |
| BM-06/BM-07 | Có theo nhánh báo cáo | Không | Không |
| Văn bản phê duyệt điều chỉnh | BM-08 | BM-08 | BM-09 |
| Thẩm quyền | Theo thẩm quyền sau điều chỉnh | Theo thẩm quyền sau điều chỉnh | Theo thẩm quyền sau điều chỉnh |
| Điều chỉnh/bổ sung ngân sách | Thực hiện đồng thời, chỉ ghi chú trong MS02 | Thực hiện đồng thời, chỉ ghi chú trong MS02 | Thực hiện đồng thời, chỉ ghi chú trong MS02 |
