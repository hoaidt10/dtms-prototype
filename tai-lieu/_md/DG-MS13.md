<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS13-121026.docx -->
<!-- pk-sha256: 79feebf6e488c0360e1e948d796697c8608e12353c79bc6f4a9020a34b31ef50 -->
<!-- pk-generated: 2026-10-12 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS13 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS13-121026.docx`. Trích dẫn thì ghi mã **DG-MS13** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS13 - KHOẢN ĐẦU TƯ ĐƠN GIẢN**

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
|----|----|----|----|
| 12/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS13. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

**MỤC LỤC**

[**A. GIỚI THIỆU**](#_heading=) **8**

> [1. Mục đích tài liệu](#_heading=) 8
>
> [2. Phạm vi áp dụng](#_heading=) 8
>
> [3. Tài liệu liên quan](#_heading=) 8
>
> [4. Thuật ngữ và các từ viết tắt](#_heading=) 9

[**B. TỔNG QUAN NGHIỆP VỤ**](#_heading=) **9**

> [1. Mục tiêu](#_heading=) 9
>
> [2. Điều kiện và các nhánh xử lý](#_heading=) 9
>
> [3. Vai trò tham gia](#_heading=) 10
>
> [4. Danh mục biểu mẫu và hồ sơ](#_heading=) 11
>
> [5. Nguyên tắc xử lý chung](#_heading=) 11

[**C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**](#_heading=) **12**

[**Tiếp nhận căn cứ và hoàn thiện đề xuất**](#_heading=) **12**

> [1. Chọn căn cứ và nội dung KĐT](#_heading=) 12
>
> [2. Lấy dữ liệu căn cứ đã phê duyệt](#_heading=) 12
>
> [3. AI gợi ý thông tin cơ bản KĐT](#_heading=) 12
>
> [4. Rà soát và xác nhận thông tin cơ bản](#_heading=) 13
>
> [5. Chọn/bóc tách căn cứ KĐT](#_heading=) 13
>
> [6. Kiểm tra tồn kho](#_heading=) 13
>
> [7. Nhận thông tin rà soát tồn kho khả dụng](#_heading=) 13
>
> [8. Khởi tạo / chỉnh sửa yêu cầu báo giá](#_heading=) 13
>
> [9. Gửi yêu cầu báo giá](#_heading=) 14
>
> [10. Tổng hợp và kiểm tra báo giá](#_heading=) 14
>
> [11. Xác nhận hình thành TSCĐ](#_heading=) 14
>
> [12. Xác nhận 04 yếu tố định danh](#_heading=) 15
>
> [13. Xác định thẩm quyền phê duyệt](#_heading=) 15
>
> [14. AI gợi ý thông tin cần chỉnh sửa](#_heading=) 15
>
> [15. Hoàn thiện dự thảo KĐT](#_heading=) 15
>
> [16. AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT](#_heading=) 16
>
> [17. Rà soát, bổ sung và hoàn thiện đề xuất](#_heading=) 16

[**Lập hồ sơ gộp BM-00**](#_heading=) **16**

> [18. AI hỗ trợ lập dự thảo](#_heading=) 16
>
> [19. Lập dự thảo văn bản gộp BM-00](#_heading=) 16
>
> [20. Xin ý kiến Chỉ huy ĐVĐX](#_heading=) 17
>
> [21. Cho ý kiến dự thảo văn bản gộp](#_heading=) 17
>
> [22. Lựa chọn CQCM thẩm định dự thảo](#_heading=) 17
>
> [23. Xác nhận danh sách CQCM BM-00](#_heading=) 17
>
> [24. Ký phiếu yêu cầu thẩm định](#_heading=) 17

[**Thẩm định giải trình và họp theo từng vòng**](#_heading=) **18**

> [25. AI gợi ý thông tin cần chỉnh sửa](#_heading=) 18
>
> [26. Bổ sung và hoàn chỉnh hồ sơ](#_heading=) 18
>
> [27. Thẩm định nội dung hồ sơ](#_heading=) 18
>
> [28. AI gợi ý phản hồi](#_heading=) 19
>
> [29. Thẩm định và gửi ý kiến chuyên môn](#_heading=) 19
>
> [30. AI gợi ý nội dung cần chỉnh sửa](#_heading=) 20
>
> [31. Bổ sung hồ sơ hoặc giải trình](#_heading=) 20
>
> [32. Họp thống nhất giải trình ĐVĐX – CQCM](#_heading=) 20
>
> [33. Ghi nhận lần họp và kết quả](#_heading=) 21
>
> [34. Chuyên quản xác nhận sau họp](#_heading=) 21
>
> [35. Chỉ huy đơn vị xác nhận sau họp](#_heading=) 21
>
> [36. Cập nhật hồ sơ theo nội dung đã xác nhận](#_heading=) 21
>
> [37. Báo cáo nội dung chưa thống nhất](#_heading=) 22
>
> [38. Xem xét, kết luận nội dung chưa thống nhất](#_heading=) 22

[**Lập và phê duyệt chủ trương BM-01**](#_heading=) **22**

> [39. Lập và hoàn thiện tờ trình chủ trương](#_heading=) 22
>
> [40. Kiểm tra hồ sơ trước trình](#_heading=) 22
>
> [41. Chọn CQCM thẩm định chủ trương](#_heading=) 23
>
> [42. Xác nhận danh sách CQCM BM-01](#_heading=) 23
>
> [43. Trình hồ sơ tới các đầu mối](#_heading=) 23
>
> [44. HT/AI kiểm tra trước khi gửi](#_heading=) 23
>
> [45. Mở vòng thẩm định chủ trương BM-01](#_heading=) 23
>
> [46. Thẩm định và hoàn chỉnh hồ sơ chủ trương](#_heading=) 24
>
> [47. Ký thẩm định trực tiếp trên tờ trình chủ trương](#_heading=) 24
>
> [48. Ký phê duyệt chủ trương cấp VHT](#_heading=) 24

[**Lập và phê duyệt khoản đầu tư BM-03**](#_heading=) **25**

> [49. AI gợi ý thông tin lập hồ sơ phê duyệt KĐT](#_heading=) 25
>
> [50. Lập hồ sơ phê duyệt KĐT](#_heading=) 25
>
> [51. Kiểm tra và trình hồ sơ](#_heading=) 25
>
> [52. Lựa chọn CQCM thẩm định KĐT](#_heading=) 25
>
> [53. Xác nhận danh sách CQCM BM-03](#_heading=) 26
>
> [54. Mở vòng thẩm định KĐT BM-03](#_heading=) 26
>
> [55. Thẩm định hồ sơ KĐT tại VHT](#_heading=) 26
>
> [56. Ký tờ trình phê duyệt KĐT](#_heading=) 27
>
> [57. Ký báo cáo thẩm định và soạn dự thảo quyết định](#_heading=) 27
>
> [58. AI tóm tắt phản hồi và gợi ý điều chỉnh](#_heading=) 27
>
> [59. Hoàn chỉnh hồ sơ theo hướng dẫn](#_heading=) 27
>
> [60. Ký ban hành quyết định phê duyệt KĐT cấp VHT](#_heading=) 27

[**Phê duyệt hồ sơ gộp tại VHT**](#_heading=) **28**

> [61. Hoàn thiện và trình ký hồ sơ gộp cấp VHT](#_heading=) 28
>
> [62. Ký phê duyệt hồ sơ gộp cấp VHT](#_heading=) 28

[**Trình thẩm định và phê duyệt cấp Tập đoàn**](#_heading=) **28**

> [63. AI hỗ trợ dự thảo công văn trình Tập đoàn](#_heading=) 28
>
> [64. Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn](#_heading=) 28
>
> [65. Ký công văn trình hồ sơ lên Tập đoàn](#_heading=) 29
>
> [66. Chuyển hồ sơ đã ký lên Tập đoàn](#_heading=) 29
>
> [67. Thẩm định và gửi phiếu nhận xét về VHT](#_heading=) 29
>
> [68. Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại](#_heading=) 29
>
> [69. Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn](#_heading=) 30
>
> [70. Tiếp nhận và kiểm tra hồ sơ hoàn thiện](#_heading=) 30
>
> [71. Hoàn thiện hồ sơ chủ trương và ký các Ban](#_heading=) 30
>
> [72. Lập báo cáo thẩm định và dự thảo quyết định](#_heading=) 31
>
> [73. Ký phê duyệt hồ sơ cấp Tập đoàn](#_heading=) 31
>
> [74. Nhận kết quả phê duyệt và lưu hồ sơ](#_heading=) 31

[**Xử lý hình thức ký dùng chung**](#_heading=) **31**

> [75. Chọn hình thức ký](#_heading=) 31
>
> [76. Trình và nhận kết quả ký VOffice](#_heading=) 32
>
> [77. Thực hiện ký bản cứng](#_heading=) 32
>
> [78. Cập nhật kết quả ký bản cứng](#_heading=) 32

[**D. NỘI DUNG CẦN ĐẶC TẢ THÊM NGOÀI BPMN**](#_heading=) **33**

> [1. Thông tin hồ sơ và kiểm tra checklist](#_heading=) 33
>
> [2. Phân loại và xác định thẩm quyền](#_heading=) 33
>
> [3. Vai trò quyền thao tác và danh sách CQCM](#_heading=) 33
>
> [4. Họp giải trình và quản lý hồ sơ trả sửa](#_heading=) 33
>
> [5. AI và dữ liệu tích hợp đầu vào](#_heading=) 33
>
> [6. Trình ký VOffice và ký bản cứng](#_heading=) 34
>
> [7. Tuyến xử lý Tập đoàn và kết quả phê duyệt](#_heading=) 34
>
> [8. Trạng thái phiên bản và lịch sử hồ sơ](#_heading=) 34
>
> [9. Điều kiện gộp BM-00 và chuyển sang BM-01 BM-03](#_heading=) 34
>
> [10. Kết quả chủ trương và phê duyệt KĐT](#_heading=) 34

[**E. PHỤ LỤC TÓM TẮT CÁC BƯỚC**](#_heading=) **35**

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải luồng MS13 – Khoản đầu tư đơn giản, từ lựa chọn căn cứ, rà soát tồn kho và báo giá đến lập hồ sơ, thẩm định, giải trình và phê duyệt. Tài liệu làm rõ phương án gộp hoặc tách hồ sơ, thẩm quyền cấp VHT/Tập đoàn và cách ghi nhận kết quả ký.

## 2. Phạm vi áp dụng

Áp dụng khoản đầu tư lĩnh vực Viễn thông – Công nghệ thông tin có tổng mức vốn dưới 160 tỷ đồng; lĩnh vực khác dưới 90 tỷ đồng, trừ bất động sản. Ngưỡng này dùng phân loại luồng MS13; cấp phê duyệt được xác định riêng theo phân cấp và ủy quyền. Luồng gồm 74 bước chính và 4 bước xử lý hình thức ký dùng chung, giữ nguyên số thứ tự trên sơ đồ.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:---|:---|
| 1 | CNM.VHT.DTMS_Plan_20260904.xlsx | Kế hoạch ĐTMS; sheet Quy trình, ô C86 mô tả luồng MS13 và điều kiện gộp/tách hồ sơ. |
| 2 | 2026 Quy trình thẩm định phê duyệt KĐT (ban hành lần 1) | Nguồn về trình tự lập, thẩm định và phê duyệt khoản đầu tư đơn giản. |
| 3 | 2026 Biểu mẫu KĐT | Nguồn về biểu mẫu, checklist và yêu cầu kiểm tra tính đầy đủ, hợp lệ của hồ sơ. |
| 4 | GUQ TGĐ Tập đoàn cho TGĐ VHT thực hiện công tác đầu tư mua sắm | Tài liệu nguồn phục vụ xác định phạm vi thẩm quyền và ủy quyền áp dụng. |
| 5 | Phiếu trình UQ TGĐ VHT thực hiện công tác đầu tư mua sắm | Tài liệu nguồn liên quan đến đề xuất ủy quyền cho TGĐ VHT. |
| 6 | VHT Công văn xin ý kiến thẩm pháp lý đối với đề xuất sửa đổi ủy quyền cho TGĐ VHT | Tài liệu nguồn về đề xuất sửa đổi ủy quyền; tham chiếu cùng văn bản ủy quyền áp dụng. |
| 7 | 1971-HD-ĐTXD-ĐT ngày 12/11/2025 | Hướng dẫn phân loại dự án đầu tư, khoản đầu tư và đề xuất mua sắm. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:---|:---|
| 1 | KĐT | Khoản đầu tư |
| 2 | ĐTMS | Đầu tư mua sắm |
| 3 | ĐVĐX | Đơn vị đề xuất |
| 4 | CQCM | Cơ quan chuyên môn |
| 5 | TTMS | Trung tâm mua sắm |
| 6 | VHT | Viettel High Tech |
| 7 | TGĐ | Tổng Giám đốc |
| 8 | TSCĐ | Tài sản cố định |
| 9 | AI | Trí tuệ nhân tạo hỗ trợ đọc, gợi ý, soạn và kiểm tra thông tin. |
| 10 | BM-00 / BM-01 / BM-03 | Hồ sơ gộp / hồ sơ chủ trương / hồ sơ phê duyệt KĐT. |
| 11 | VOffice | Hệ thống trình ký tích hợp với ĐTMS. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Hoàn thiện và phê duyệt hồ sơ khoản đầu tư theo đúng loại hồ sơ và cấp có thẩm quyền. Dữ liệu tồn kho, báo giá và xác nhận định danh làm căn cứ phân luồng; AI hỗ trợ lập và kiểm tra nội dung, người phụ trách rà soát và người có thẩm quyền quyết định.

## 2. Điều kiện và các nhánh xử lý

| **Tiêu chí** | **Nội dung xử lý** |
|:--:|:---|
| Phân loại MS13 | Viễn thông – CNTT dưới 160 tỷ đồng; lĩnh vực khác dưới 90 tỷ đồng, trừ bất động sản. Không thuộc MS13 thì chuyển MS14/MS15. |
| Thông tin căn cứ | Chưa đủ → rà soát, xác nhận tại bước 4. Đủ → tiếp tục nhận kết quả tồn kho và lập yêu cầu báo giá. |
| Báo giá | Không đạt → sửa yêu cầu tại bước 8. Đạt → xác nhận TSCĐ và 4 yếu tố định danh theo hai nhánh song song. |
| Hai xác nhận | Chờ đủ hai kết quả. Cả hai OK → bước 13 xác định thẩm quyền. NOT OK → bước 14 gợi ý chỉnh sửa. |
| Gộp BM-00 | Đủ cả 3 điều kiện: thuộc MS13; trang bị nội bộ; tài sản nguyên chiếc, không cần tích hợp trước sử dụng. Thực hiện một giai đoạn gộp. |
| Tách BM-01 và BM-03 | Không đủ điều kiện gộp: lập và phê duyệt chủ trương BM-01 trước, sau đó lập hồ sơ KĐT BM-03. |
| Cấp duyệt | Bước 13 lưu riêng cấp duyệt chủ trương và KĐT theo phân cấp/ủy quyền. VHT và Tập đoàn có các tuyến ký tương ứng. |
| Họp giải trình | Mỗi vòng BM-00, BM-01, BM-03 có bộ đếm riêng, tối đa 2 lần. Không đặt lại số lần khi sửa hoặc trình lại. |
| Hình thức ký | Hồ sơ Mật ký bản cứng. Không Mật: người trình chọn VOffice hoặc bản cứng; ghi nhận đủ kết quả trước tiếp tục luồng chính. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm** |
|:--:|:---|:---|
| 1 | Đơn vị đề xuất / Chuyên quản | Lựa chọn căn cứ; rà soát thông tin; lập, bổ sung và trình hồ sơ; tiếp thu ý kiến. |
| 2 | Chỉ huy Đơn vị đề xuất | Cho ý kiến, ký phiếu/tờ trình và xác nhận nội dung sau họp. |
| 3 | Hệ thống ĐTMS / AI | Lấy dữ liệu, hỗ trợ soạn và kiểm tra, xác định cấp duyệt, lưu bộ đếm họp và kết quả ký. |
| 4 | Ban Tài chính | Xác nhận hình thành tài sản cố định. |
| 5 | TTMS / CQCM chủ trì | Xác nhận định danh, kiểm tra danh sách CQCM, chủ trì thẩm định, tổ chức họp và hoàn thiện hồ sơ theo cấp duyệt. |
| 6 | CQCM phối hợp | Thẩm định theo chức năng, gửi ý kiến và phối hợp giải trình. |
| 7 | Phó TGĐ / Phó GĐ chuyên trách | Tham gia ký thẩm định theo thành phần áp dụng tại bước tương ứng. |
| 8 | TGĐ VHT / Người có thẩm quyền tại VHT | Phê duyệt thuộc thẩm quyền; kết luận nội dung chưa thống nhất; ký trình hồ sơ lên Tập đoàn. |
| 9 | Các Ban chuyên môn / Ban ĐTXD Tập đoàn | Thẩm định, gửi nhận xét; kiểm tra hồ sơ trình lại; hoàn thiện hồ sơ và báo cáo thẩm định theo loại hồ sơ. |
| 10 | TGĐ Tập đoàn | Phê duyệt chủ trương, KĐT hoặc hồ sơ gộp thuộc thẩm quyền Tập đoàn. |
| 11 | Người trình / Người phụ trách hồ sơ | Chọn hình thức ký khi được phép; trình bản cứng và cập nhật trạng thái, bản scan, ý kiến xử lý. |

## 4. Danh mục biểu mẫu và hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Vai trò trong luồng** |
|:--:|:---|:---|
| 1 | Căn cứ đã phê duyệt; kết quả tồn kho; báo giá | Đầu vào lập nhu cầu, xác định danh mục và tổng mức vốn. |
| 2 | BM-00 | Văn bản gộp chủ trương và KĐT khi đủ điều kiện. |
| 3 | BM-01; Checklist 01 | Tờ trình và kiểm tra hồ sơ chủ trương. |
| 4 | BM-03; Checklist 02 | Hồ sơ phê duyệt KĐT sau chủ trương được duyệt. |
| 5 | BM-09 / BM-10 | Ý kiến chuyên môn khi áp dụng; phiếu nhận xét Tập đoàn đối với chủ trương/KĐT. |
| 6 | BM-14 | Báo cáo kết quả thẩm định KĐT hoặc hồ sơ gộp. |
| 7 | BM-18 | Quyết định phê duyệt KĐT. |
| 8 | BM-06; báo cáo giải trình; công văn | Hồ sơ gửi và trình lại Tập đoàn. |
| 9 | Biên bản họp; xác nhận sau họp; bộ đếm | Lưu nội dung thống nhất và số lần họp theo từng vòng. |
| 10 | Trạng thái; PDF đã ký; scan văn bản | Ghi nhận kết quả ký VOffice hoặc bản cứng. |

## 5. Nguyên tắc xử lý chung

Bước 13 xác định thẩm quyền riêng cho chủ trương và KĐT; hệ thống tính lại trước trình ký khi dữ liệu phân loại thay đổi.

BM-00 là một giai đoạn gộp. BM-01 và BM-03 là hai vòng độc lập; chủ trương đã duyệt là đầu vào lập KĐT.

Chủ trương MS13 ký trực tiếp trên BM-01; không lập báo cáo thẩm định chủ trương và quyết định chủ trương riêng. KĐT/hồ sơ gộp sử dụng BM-14 và BM-18.

Danh sách CQCM do ĐVĐX chọn và CQCM chủ trì xác nhận. Không đồng ý thì quay lại bước chọn danh sách của đúng vòng.

Hồ sơ chưa đủ điều kiện được bổ sung và chuyển lại đúng vòng. Mỗi vòng họp tối đa 2 lần; thống nhất sớm thì tiếp tục, không phải họp đủ 2 lần.

Sau họp, Chuyên quản và Chỉ huy đơn vị xác nhận nội dung trước khi ĐVĐX sửa hồ sơ. Sửa hoặc trình lại giữ loại hồ sơ, chủ trương đã duyệt và số lần họp.

Tuyến Tập đoàn giữ loại hồ sơ BM-01/BM-03/BM-00 từ nhánh vào. VHT rà soát nội bộ và ký trình; Tập đoàn thực hiện thẩm định/phê duyệt theo thẩm quyền.

Hồ sơ Mật bắt buộc ký bản cứng. Không Mật cho chọn VOffice hoặc bản cứng. Giữ nguyên người ký, thứ tự và hướng xử lý kết quả tại bước chính.

VOffice trả trạng thái và PDF tự động; bản cứng được người phụ trách cập nhật trạng thái, bản scan và ý kiến xử lý. Chỉ tiếp tục khi kết quả đã được ghi nhận.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Các bước dưới đây giữ nguyên số trên sơ đồ. Các nhánh điều kiện xác định bước tiếp theo; số thứ tự không có nghĩa mọi hồ sơ đều phải đi qua toàn bộ 78 bước. Bước 75–78 là phần hình thức ký dùng chung tại các bước trình ký trong luồng chính.

# Tiếp nhận căn cứ và hoàn thiện đề xuất

## 1. Chọn căn cứ và nội dung KĐT

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Chọn tài liệu đầu vào/căn cứ lập KĐT đã được phê duyệt ở cấp áp dụng và xác định phạm vi nội dung KĐT.

Hồ sơ/biểu mẫu: Không có mẫu riêng; Tài liệu đầu vào.

Luồng tiếp theo: bước 2.

## 2. Lấy dữ liệu căn cứ đã phê duyệt

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: Lấy thông tin từ các nguồn căn cứ đã chọn (kế hoạch, eBOM/mBOM và dữ liệu liên quan) để hỗ trợ lập KĐT.

Hồ sơ/biểu mẫu: Không có.

Luồng tiếp theo: bước 3.

## 3. AI gợi ý thông tin cơ bản KĐT

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý thông tin cơ bản của KĐT từ tài liệu đầu vào; kết quả để người dùng rà soát, xác nhận.

Hồ sơ/biểu mẫu: Không có.

Luồng tiếp theo: bước 4.

## 4. Rà soát và xác nhận thông tin cơ bản

Tác nhân: Đơn vị đề xuất mua sắm.

Thực hiện: Rà soát, xác nhận mục đích, phạm vi/quy mô, giá trị, nguồn vốn, thời gian, biện pháp/kế hoạch thực hiện và độ Mật của ĐXMS.

Hồ sơ/biểu mẫu: Không có mẫu riêng; thông tin là đầu vào BM-01.

Luồng tiếp theo: bước 5.

## 5. Chọn/bóc tách căn cứ KĐT

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Bóc tách căn cứ theo dữ liệu có sẵn đến dòng/hạng mục dùng để lập nhu cầu KĐT.

Hồ sơ/biểu mẫu: Không có.

Luồng tiếp theo: bước 6.

## 6. Kiểm tra tồn kho

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Kiểm tra Dự toán, eBOM/mBOM và tồn kho; tính phần căn cứ còn dùng, loại phần đã dùng/đang hold.

Hồ sơ/biểu mẫu: Không có; dữ liệu Dự toán/eBOM/mBOM/Quản lý kho.

Luồng tiếp theo: Đủ thông tin căn cứ → Đủ → bước 7.

Đủ thông tin căn cứ → Chưa đủ → bước 4.

## 7. Nhận thông tin rà soát tồn kho khả dụng

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Nhận kết quả rà soát tồn kho khả dụng để đánh giá phần hàng tồn có thể sử dụng cho nhu cầu KĐT.

Hồ sơ/biểu mẫu: Kết quả rà soát tồn kho theo Quy định QLTS.

Luồng tiếp theo: bước 8.

## 8. Khởi tạo / chỉnh sửa yêu cầu báo giá

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Căn cứ kết quả tồn kho, xác định danh mục/số lượng cần mua và lập yêu cầu báo giá. Trường hợp báo giá không đạt yêu cầu thì chỉnh sửa lại yêu cầu báo giá.

Hồ sơ/biểu mẫu: Yêu cầu báo giá theo Quy định TTMS.

Luồng tiếp theo: bước 9.

## 9. Gửi yêu cầu báo giá

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: Tự động gửi yêu cầu báo giá theo thông tin người dùng đã lập tới nhà cung cấp/đầu mối theo tích hợp.

Hồ sơ/biểu mẫu: Yêu cầu báo giá theo Quy định.

Luồng tiếp theo: bước 10.

## 10. Tổng hợp và kiểm tra báo giá

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Tổng hợp báo giá, kiểm tra mức độ đáp ứng; chốt tổng mức vốn thực tế để hệ thống phân luồng MS13 / MS14 / MS15.

Hồ sơ/biểu mẫu: Báo giá/Kết quả lấy báo giá.

Luồng tiếp theo: Báo giá đạt yêu cầu → Đạt → Gửi đồng thời 02 yêu cầu xác nhận → Xác nhận TSCĐ → bước 11.

Báo giá đạt yêu cầu → Đạt → Gửi đồng thời 02 yêu cầu xác nhận → Xác nhận 04 yếu tố → bước 12.

Báo giá đạt yêu cầu → Không đạt: sửa yêu cầu báo giá → bước 8.

## 11. Xác nhận hình thành TSCĐ

Tác nhân: Ban Tài chính.

Thực hiện: Xác nhận Có / Không hình thành tài sản cố định và kết quả OK / NOT OK .

Hồ sơ/biểu mẫu: Kết quả xác nhận TSCĐ; hồ sơ KĐT.

Luồng tiếp theo: Đã nhận đủ 02 kết quả xác nhận → Cả 02 xác nhận đều OK → OK → bước 13.

Đã nhận đủ 02 kết quả xác nhận → Cả 02 xác nhận đều OK → NOT OK → bước 14.

## 12. Xác nhận 04 yếu tố định danh

Tác nhân: TTMS.

Thực hiện: Xác nhận Lĩnh vực; Loại KĐT; Giá tiền sơ bộ; Tính chất tài sản (Nguyên chiếc / Cần tích hợp). Trả kết quả OK / NOT OK.

Hồ sơ/biểu mẫu: Thông tin định danh KĐT.

Luồng tiếp theo: Đã nhận đủ 02 kết quả xác nhận → Cả 02 xác nhận đều OK → OK → bước 13.

Đã nhận đủ 02 kết quả xác nhận → Cả 02 xác nhận đều OK → NOT OK → bước 14.

## 13. Xác định thẩm quyền phê duyệt

Tác nhân: Hệ thống ĐTMS.

Thực hiện: Kiểm tra loại tài sản, loại/mục đích KĐT, tổng mức vốn và quy định ủy quyền áp dụng. Lưu riêng cấp duyệt chủ trương và cấp duyệt KĐT (VHT / Tập đoàn), căn cứ áp dụng. Tự tính lại trước trình ký nếu dữ liệu này thay đổi.

Hồ sơ/biểu mẫu: Kết quả xác nhận tài sản, định danh KĐT; tổng mức vốn; quy định phân cấp / ủy quyền.

Luồng tiếp theo: Tổng mức vốn thực tế thuộc MS13 → Không thuộc MS13 → Chuyển xử lý theo MS14 / MS15.

Tổng mức vốn thực tế thuộc MS13 → Thuộc MS13 → bước 15.

## 14. AI gợi ý thông tin cần chỉnh sửa

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐXMS kiểm tra và chỉnh sửa lại.

Hồ sơ/biểu mẫu: Kết quả kiểm tra định danh; nội dung cần chỉnh sửa.

Luồng tiếp theo: bước 10.

## 15. Hoàn thiện dự thảo KĐT

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Hoàn thiện dự thảo hồ sơ KĐT trên cơ sở kết quả tồn kho, báo giá và các căn cứ liên quan.

Hồ sơ/biểu mẫu: BM-00 hoặc BM-01/BM-03 theo nhánh đã xác định; Checklist tương ứng.

Luồng tiếp theo: bước 16.

## 16. AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Đọc căn cứ, dựng nháp và phân tích; không thay người phê duyệt.

Hồ sơ/biểu mẫu: Đề xuất KĐT; dữ liệu căn cứ.

Luồng tiếp theo: bước 17.

## 17. Rà soát, bổ sung và hoàn thiện đề xuất

Tác nhân: Đơn vị đề xuất.

Thực hiện: PA/PM rà soát nội dung AI, chuẩn bị trình thẩm định.

Hồ sơ/biểu mẫu: Đề xuất KĐT đã rà soát.

Luồng tiếp theo: Đủ 03 điều kiện lập hồ sơ gộp BM-00 → Không đủ (tức thuộc các trường hợp còn lại) → BM-01 và BM-03 → bước 39.

Đủ 03 điều kiện lập hồ sơ gộp BM-00 → Đủ cả 03 điều kiện → BM-00 → bước 18.

# Lập hồ sơ gộp BM-00

## 18. AI hỗ trợ lập dự thảo

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: BM-00 Đọc căn cứ, dựng nháp .

Hồ sơ/biểu mẫu: Dự thảo BM-00; tài liệu căn cứ.

Luồng tiếp theo: bước 19.

## 19. Lập dự thảo văn bản gộp BM-00

Tác nhân: Đơn vị đề xuất.

Thực hiện: Rà soát nội dung AI, hoàn thiện BM-00. Chủ trương và KĐT chung một văn bản. Khi sửa sau từ chối phê duyệt, giữ vòng BM-00 và số lần họp.

Hồ sơ/biểu mẫu: BM-00; hồ sơ và tài liệu kèm theo.

Luồng tiếp theo: bước 20.

## 20. Xin ý kiến Chỉ huy ĐVĐX

Tác nhân: Đơn vị đề xuất.

Thực hiện: Gửi dự thảo văn bản gộp để xin ý kiến Chỉ huy ĐVĐX trước khi chuyển thẩm định.

Hồ sơ/biểu mẫu: BM-00.

Luồng tiếp theo: bước 21.

## 21. Cho ý kiến dự thảo văn bản gộp

Tác nhân: Chỉ huy ĐVĐX.

Thực hiện: Xem xét dự thảo BM-00. ĐVĐX tiếp thu, hoàn thiện theo ý kiến trước khi chuyển hồ sơ.

Hồ sơ/biểu mẫu: BM-00.

Luồng tiếp theo: bước 22.

## 22. Lựa chọn CQCM thẩm định dự thảo

Tác nhân: Đơn vị đề xuất.

Thực hiện: Chủ động chọn danh sách CQCM thẩm định/phối hợp cho hồ sơ dự thảo. Hệ thống chuyển theo danh sách đã chọn.

Hồ sơ/biểu mẫu: Hồ sơ BM-00.

Luồng tiếp theo: bước 23.

## 23. Xác nhận danh sách CQCM BM-00

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.

Hồ sơ/biểu mẫu: Danh sách CQCM BM-00; kết quả xác nhận.

Luồng tiếp theo: Đã xác nhận → Danh sách CQCM được phê duyệt → Không đồng ý → bước 22.

Đã xác nhận → Danh sách CQCM được phê duyệt → Đồng ý → bước 24.

## 24. Ký phiếu yêu cầu thẩm định

Tác nhân: Chỉ huy Đơn vị đề xuất.

Thực hiện: Ký phiếu yêu cầu thẩm định hồ sơ gộp; hệ thống mở vòng BM-00 và khởi tạo bộ đếm họp = 0 lần đầu. Giữ số lần đã họp khi bổ sung hoặc trình lại.

Hồ sơ/biểu mẫu: Phiếu yêu cầu thẩm định; BM-00; bộ đếm BM-00.

Luồng tiếp theo: Hồ sơ đủ điều kiện thẩm định → Đủ điều kiện → bước 27.

Hồ sơ đủ điều kiện thẩm định → Chưa đủ điều kiện → bước 25.

# Thẩm định giải trình và họp theo từng vòng

## 25. AI gợi ý thông tin cần chỉnh sửa

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐX KĐT kiểm tra và chỉnh sửa lại.

Hồ sơ/biểu mẫu: Kết quả kiểm tra hồ sơ; nội dung cần chỉnh sửa.

Luồng tiếp theo: bước 26.

## 26. Bổ sung và hoàn chỉnh hồ sơ

Tác nhân: Đơn vị đề xuất.

Thực hiện: Bổ sung hồ sơ theo yêu cầu; giữ loại hồ sơ và số lần họp của vòng hiện tại. Chuyển đúng bước chọn lại CQCM của BM-00, BM-01 hoặc BM-03.

Hồ sơ/biểu mẫu: Hồ sơ dự thảo đã bổ sung; tài liệu kèm theo.

Luồng tiếp theo: Đã sửa hồ sơ → Hồ sơ cần sửa thuộc vòng nào → BM-00: chọn lại CQCM dự thảo → bước 22.

Đã sửa hồ sơ → Hồ sơ cần sửa thuộc vòng nào → BM-01: chọn lại CQCM chủ trương → bước 41.

Đã sửa hồ sơ → Hồ sơ cần sửa thuộc vòng nào → BM-03: chọn lại CQCM KĐT → bước 52.

## 27. Thẩm định nội dung hồ sơ

Tác nhân: CQCM chủ trì / phối hợp.

Thực hiện: Pháp lý, mục tiêu, nhu cầu, phạm vi, quy mô, tổng vốn và nội dung phù hợp giai đoạn.

Hồ sơ/biểu mẫu: BM-00 / BM-01 / BM-03 theo giai đoạn; tài liệu căn cứ.

Luồng tiếp theo: Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-01: chủ trương → bước 46.

Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-00: gộp → Hồ sơ gộp thuộc cấp duyệt nào đã xác định → VHT → bước 61.

Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-00: gộp → Hồ sơ gộp thuộc cấp duyệt nào đã xác định → Tập đoàn → bước 63.

Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-03: KĐT → bước 55.

Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Có → bước 30.

Cần ý kiến CQCM liên quan → Có → bước 28.

## 28. AI gợi ý phản hồi

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý đưa ý kiến.

Hồ sơ/biểu mẫu: Ý kiến thẩm định dự thảo.

Luồng tiếp theo: bước 29.

## 29. Thẩm định và gửi ý kiến chuyên môn

Tác nhân: CQCM phối hợp.

Thực hiện: CQCM thẩm định theo chức năng. Cấp VHT: ký ý kiến theo thành phần áp dụng. Cấp Tập đoàn: VHT rà soát nội bộ, không ký thẩm định. Không phát hành công văn phối hợp riêng.

Hồ sơ/biểu mẫu: Ý kiến thẩm định; BM-09/BM-10 khi áp dụng.

Luồng tiếp theo: Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-01: chủ trương → bước 46.

Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-00: gộp → Hồ sơ gộp thuộc cấp duyệt nào đã xác định → VHT → bước 61.

Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-00: gộp → Hồ sơ gộp thuộc cấp duyệt nào đã xác định → Tập đoàn → bước 63.

Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc vòng nào → BM-03: KĐT → bước 55.

Cần sửa đổi hoặc giải trình → Có → bước 30.

## 30. AI gợi ý nội dung cần chỉnh sửa

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý cần sửa đổi giải trình.

Hồ sơ/biểu mẫu: Ý kiến CQCM; nội dung cần sửa / giải trình.

Luồng tiếp theo: Rà soát và xử lý → bước 31.

## 31. Bổ sung hồ sơ hoặc giải trình

Tác nhân: Đơn vị đề xuất.

Thực hiện: Làm rõ nội dung CQCM yêu cầu.

Hồ sơ/biểu mẫu: Văn bản giải trình.

Luồng tiếp theo: Đã thống nhất nội dung → Đã thống nhất → bước 27.

Đã thống nhất nội dung → Chưa thống nhất → Số lần họp còn dưới 02 → Có: lần 1 hoặc lần 2 → bước 32.

Đã thống nhất nội dung → Chưa thống nhất → Số lần họp còn dưới 02 → Không: đã đủ 02 lần → bước 37.

## 32. Họp thống nhất giải trình ĐVĐX – CQCM

Tác nhân: CQCM chủ trì.

Thực hiện: Tổ chức họp ĐVĐX với CQCM khi chưa thống nhất nội dung. Mỗi vòng BM-00, BM-01 hoặc BM-03 được họp tối đa 02 lần; thống nhất sớm thì tiếp tục, không phải họp đủ 02 lần.

Hồ sơ/biểu mẫu: Biên bản/kết quả họp.

Luồng tiếp theo: bước 33.

## 33. Ghi nhận lần họp và kết quả

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Tăng số lần họp của hồ sơ đang xử lý thêm 1; lưu biên bản và kết quả. Đếm riêng BM-00, BM-01 và BM-03; không cộng dồn giữa các vòng, không cho tổ chức lần thứ 3.

Hồ sơ/biểu mẫu: Biên bản họp; kết quả; bộ đếm riêng BM-00 / BM-01 / BM-03.

Luồng tiếp theo: Sau họp đã thống nhất → Chưa thống nhất → Số lần họp còn dưới 02 → Có: lần 1 hoặc lần 2 → bước 32.

Sau họp đã thống nhất → Chưa thống nhất → Số lần họp còn dưới 02 → Không: đã đủ 02 lần → bước 37.

Sau họp đã thống nhất → Đã thống nhất → bước 34.

## 34. Chuyên quản xác nhận sau họp

Tác nhân: Chuyên quản ĐVĐX.

Thực hiện: Rà soát và xác nhận nội dung điều chỉnh đã thống nhất sau họp, trước khi cho phép sửa thông tin hồ sơ.

Hồ sơ/biểu mẫu: Biên bản họp; nội dung điều chỉnh; xác nhận chuyên quản.

Luồng tiếp theo: bước 35.

## 35. Chỉ huy đơn vị xác nhận sau họp

Tác nhân: Chỉ huy ĐVĐX.

Thực hiện: Duyệt lại nội dung điều chỉnh sau họp. Chỉ cho phép ĐVĐX cập nhật và trình ký khi đã có đủ xác nhận.

Hồ sơ/biểu mẫu: Biên bản họp; nội dung điều chỉnh; xác nhận Chỉ huy.

Luồng tiếp theo: bước 36.

## 36. Cập nhật hồ sơ theo nội dung đã xác nhận

Tác nhân: Đơn vị đề xuất.

Thực hiện: Sửa thông tin theo nội dung Chuyên quản và Chỉ huy đơn vị đã xác nhận; chuyển rà soát lại để trình ký.

Hồ sơ/biểu mẫu: Hồ sơ đã cập nhật; nội dung đã được xác nhận.

Luồng tiếp theo: bước 27.

## 37. Báo cáo nội dung chưa thống nhất

Tác nhân: CQCM chủ trì / phối hợp.

Thực hiện: CQCM chủ trì báo cáo người có thẩm quyền.

Hồ sơ/biểu mẫu: Báo cáo nội dung chưa thống nhất; hồ sơ liên quan.

Luồng tiếp theo: bước 38.

## 38. Xem xét, kết luận nội dung chưa thống nhất

Tác nhân: Người có thẩm quyền tại VHT.

Thực hiện: Xem xét báo cáo và nội dung còn vướng mắc; kết luận để ĐVĐX tiếp tục bổ sung, giải trình hoặc dừng theo chỉ đạo.

Hồ sơ/biểu mẫu: Báo cáo nội dung chưa thống nhất; hồ sơ liên quan.

Luồng tiếp theo: Kết luận xử lý nội dung chưa thống nhất → Chỉ đạo dừng → Kết luận để xử lý tiếp.

Kết luận xử lý nội dung chưa thống nhất → Bổ sung / giải trình → bước 31.

# Lập và phê duyệt chủ trương BM-01

## 39. Lập và hoàn thiện tờ trình chủ trương

Tác nhân: Đơn vị đề xuất.

Thực hiện: Mục tiêu, sự cần thiết, tổng vốn dự kiến, nguồn vốn, thời gian; trao đổi CQCM trước trình.

Hồ sơ/biểu mẫu: BM-01; Checklist 01.

Luồng tiếp theo: bước 40.

## 40. Kiểm tra hồ sơ trước trình

Tác nhân: Đơn vị đề xuất.

Thực hiện: Đầu mối kiểm tra độc lập của đơn vị; không xóa dòng checklist khi thiếu tài liệu.

Hồ sơ/biểu mẫu: Checklist 01.

Luồng tiếp theo: bước 41.

## 41. Chọn CQCM thẩm định chủ trương

Tác nhân: Đơn vị đề xuất.

Thực hiện: Chọn danh sách CQCM tại khâu kiểm tra hồ sơ trước khi trình; hệ thống không tự cố định danh sách. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.

Hồ sơ/biểu mẫu: BM-01; Checklist 01.

Luồng tiếp theo: bước 42.

## 42. Xác nhận danh sách CQCM BM-01

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.

Hồ sơ/biểu mẫu: Danh sách CQCM BM-01; kết quả xác nhận.

Luồng tiếp theo: Đã xác nhận → DS CQCM BM-01 được duyệt → Đồng ý → bước 43.

Đã xác nhận → DS CQCM BM-01 được duyệt → Không đồng ý: chọn lại → bước 41.

## 43. Trình hồ sơ tới các đầu mối

Tác nhân: Đơn vị đề xuất.

Thực hiện: CQCM chủ trì; cấp phó phụ trách nếu có; người có thẩm quyền theo nguồn.

Hồ sơ/biểu mẫu: BM-01; Checklist 01.

Luồng tiếp theo: Yêu cầu gửi → bước 44.

## 44. HT/AI kiểm tra trước khi gửi

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Kiểm tra tính đầy đủ, hợp lệ trước khi gửi. Đạt: mở vòng thẩm định BM-01. Không đạt: trả ĐVĐX hoàn chỉnh hồ sơ rồi gửi lại để kiểm tra.

Hồ sơ/biểu mẫu: BM-01; Checklist 01; kết quả kiểm tra.

Luồng tiếp theo: AI kiểm tra đạt → Đạt → bước 45.

AI kiểm tra đạt → Không đạt: sửa hồ sơ → bước 39.

## 45. Mở vòng thẩm định chủ trương BM-01

Tác nhân: Hệ thống ĐTMS.

Thực hiện: Gắn hồ sơ đang xử lý là BM-01. Khởi tạo bộ đếm họp BM-01 = 0 khi mở vòng lần đầu; giữ số lần đã họp khi bổ sung hoặc trình lại. Chuyển khối kiểm tra, giải trình, họp dùng chung.

Hồ sơ/biểu mẫu: BM-01; Checklist 01; bộ đếm BM-01.

Luồng tiếp theo: Vòng BM-01 → Hồ sơ đủ điều kiện thẩm định → Đủ điều kiện → bước 27.

Vòng BM-01 → Hồ sơ đủ điều kiện thẩm định → Chưa đủ điều kiện → bước 25.

## 46. Thẩm định và hoàn chỉnh hồ sơ chủ trương

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra căn cứ, mục tiêu, sự cần thiết, vốn dự kiến, nguồn vốn và thời gian; phối hợp ĐVĐX giải trình, hoàn thiện hồ sơ. Cấp Tập đoàn: chỉ thẩm định nội bộ, không ký thẩm định tại VHT.

Hồ sơ/biểu mẫu: BM-01; Checklist 01; ý kiến CQCM.

Luồng tiếp theo: Chủ trương thuộc cấp duyệt nào đã xác định → Cấp VHT → bước 47.

Chủ trương thuộc cấp duyệt nào đã xác định → Cấp Tập đoàn – chủ trương → bước 63.

## 47. Ký thẩm định trực tiếp trên tờ trình chủ trương

Tác nhân: CQCM chủ trì; cấp phó phụ trách nếu có.

Thực hiện: Chỉ áp dụng cấp VHT: ký thẩm định trên BM-01 đã đủ điều kiện. Không lập báo cáo kết quả thẩm định chủ trương hoặc quyết định chủ trương riêng.

Hồ sơ/biểu mẫu: BM-01.

Luồng tiếp theo: bước 48.

## 48. Ký phê duyệt chủ trương cấp VHT

Tác nhân: TGĐ VHT.

Thực hiện: Xem xét hồ sơ đã thẩm định và ký phê duyệt trực tiếp trên BM-01. Không áp dụng cho chủ trương thuộc thẩm quyền Tập đoàn.

Hồ sơ/biểu mẫu: BM-01.

Luồng tiếp theo: Đồng ý phê duyệt chủ trương → Không đồng ý → Ý kiến chỉ đạo xử lý → Chỉ đạo dừng → Kết luận để xử lý tiếp.

Đồng ý phê duyệt chủ trương → Không đồng ý → Ý kiến chỉ đạo xử lý → Tiếp tục xử lý → Đủ 03 điều kiện lập hồ sơ gộp BM-00 → Không đủ (tức thuộc các trường hợp còn lại) → BM-01 và BM-03 → bước 39.

Đồng ý phê duyệt chủ trương → Không đồng ý → Ý kiến chỉ đạo xử lý → Tiếp tục xử lý → Đủ 03 điều kiện lập hồ sơ gộp BM-00 → Đủ cả 03 điều kiện → BM-00 → bước 18.

Đồng ý phê duyệt chủ trương → Đồng ý → bước 49.

# Lập và phê duyệt khoản đầu tư BM-03

## 49. AI gợi ý thông tin lập hồ sơ phê duyệt KĐT

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý từ các thông tin đã có để lập hồ sơ phê duyệt.

Hồ sơ/biểu mẫu: BM-03; Checklist 02.

Luồng tiếp theo: bước 50.

## 50. Lập hồ sơ phê duyệt KĐT

Tác nhân: Đơn vị đề xuất.

Thực hiện: Rà soát nội dung AI, trao đổi CQCM và hoàn thiện BM-03. Khi sửa sau từ chối phê duyệt KĐT, giữ chủ trương đã duyệt và số lần họp BM-03.

Hồ sơ/biểu mẫu: BM-03; Checklist 02; chủ trương đã duyệt.

Luồng tiếp theo: bước 51.

## 51. Kiểm tra và trình hồ sơ

Tác nhân: Đơn vị đề xuất.

Thực hiện: Kiểm tra độc lập đầy đủ, hợp lệ; gửi CQCM chủ trì.

Hồ sơ/biểu mẫu: Checklist 02; hồ sơ KĐT.

Luồng tiếp theo: bước 52.

## 52. Lựa chọn CQCM thẩm định KĐT

Tác nhân: Đơn vị đề xuất.

Thực hiện: Sau khi kiểm tra hồ sơ, chủ động chọn danh sách CQCM thẩm định. Luồng xử lý tiếp theo áp dụng tương tự khâu dự thảo. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.

Hồ sơ/biểu mẫu: BM-03; Checklist 02.

Luồng tiếp theo: bước 53.

## 53. Xác nhận danh sách CQCM BM-03

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.

Hồ sơ/biểu mẫu: Danh sách CQCM BM-03; kết quả xác nhận.

Luồng tiếp theo: Đã xác nhận → DS CQCM BM-03 được duyệt → Không đồng ý: chọn lại → bước 52.

Đã xác nhận → DS CQCM BM-03 được duyệt → Đồng ý → bước 54.

## 54. Mở vòng thẩm định KĐT BM-03

Tác nhân: Hệ thống ĐTMS.

Thực hiện: Sau khi chủ trương được duyệt, mở vòng BM-03. Khởi tạo bộ đếm BM-03 = 0 lần đầu; độc lập với BM-01 và giữ số lần khi sửa/trình lại. Chuyển khối kiểm tra, giải trình, họp dùng chung.

Hồ sơ/biểu mẫu: BM-03; Checklist 02; chủ trương đã duyệt; bộ đếm BM-03.

Luồng tiếp theo: Vòng BM-03 → Hồ sơ đủ điều kiện thẩm định → Đủ điều kiện → bước 27.

Vòng BM-03 → Hồ sơ đủ điều kiện thẩm định → Chưa đủ điều kiện → bước 25.

## 55. Thẩm định hồ sơ KĐT tại VHT

Tác nhân: TTMS / CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra căn cứ, mục tiêu, nhu cầu, phạm vi, tổng vốn, nguồn vốn và nội dung hồ sơ; phối hợp ĐVĐX giải trình, hoàn thiện. Nhánh Tập đoàn không ký thẩm định tại VHT.

Hồ sơ/biểu mẫu: BM-03; Checklist 02; ý kiến CQCM.

Luồng tiếp theo: KĐT thuộc cấp duyệt nào đã xác định → Cấp VHT → bước 56.

KĐT thuộc cấp duyệt nào đã xác định → Cấp Tập đoàn – KĐT → bước 63.

## 56. Ký tờ trình phê duyệt KĐT

Tác nhân: Chỉ huy Đơn vị đề xuất.

Thực hiện: Ký tờ trình BM-03 đại diện ĐVĐX trước khi TTMS ký báo cáo thẩm định và trình quyết định phê duyệt cấp VHT.

Hồ sơ/biểu mẫu: BM-03; Checklist 02.

Luồng tiếp theo: bước 57.

## 57. Ký báo cáo thẩm định và soạn dự thảo quyết định

Tác nhân: TTMS / CQCM chủ trì thẩm định cấp VHT.

Thực hiện: Tổng hợp kết quả và ký Báo cáo thẩm định KĐT BM-14; soạn dự thảo Quyết định BM-18, trình TGĐ VHT ký ban hành. TTMS không ký quyết định.

Hồ sơ/biểu mẫu: BM-14; dự thảo BM-18.

Luồng tiếp theo: Báo cáo thẩm định được thông qua → Thông qua → bước 60.

Báo cáo thẩm định được thông qua → Không thông qua → bước 58.

## 58. AI tóm tắt phản hồi và gợi ý điều chỉnh

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tóm tắt phản hồi và gợi ý điều chỉnh cho ĐVĐX.

Hồ sơ/biểu mẫu: Không có mẫu riêng; hồ sơ / kết quả tại bước này.

Luồng tiếp theo: bước 59.

## 59. Hoàn chỉnh hồ sơ theo hướng dẫn

Tác nhân: Đơn vị đề xuất.

Thực hiện: Tiếp tục hoàn chỉnh hoặc thực hiện hướng dẫn của CQCM chủ trì.

Hồ sơ/biểu mẫu: Hồ sơ; giải trình.

Luồng tiếp theo: Hoàn chỉnh → bước 50.

## 60. Ký ban hành quyết định phê duyệt KĐT cấp VHT

Tác nhân: TGĐ VHT.

Thực hiện: Xem xét hồ sơ và BM-14 đã được cơ quan chủ trì ký; ký ban hành Quyết định BM-18 thuộc thẩm quyền VHT.

Hồ sơ/biểu mẫu: BM-03; BM-14; BM-18.

Luồng tiếp theo: Đồng ý phê duyệt KĐT → Đồng ý → Quyết định phê duyệt KĐT.

Đồng ý phê duyệt KĐT → Không đồng ý: sửa BM-03 → bước 50.

# Phê duyệt hồ sơ gộp tại VHT

## 61. Hoàn thiện và trình ký hồ sơ gộp cấp VHT

Tác nhân: Đơn vị đề xuất; TTMS / CQCM chủ trì.

Thực hiện: ĐVĐX hoàn thiện BM-00. TTMS tổng hợp, ký báo cáo thẩm định BM-14 và soạn dự thảo BM-18; trình TGĐ VHT phê duyệt trong một giai đoạn gộp, không tách BM-01 / BM-03.

Hồ sơ/biểu mẫu: BM-00; BM-14; dự thảo BM-18.

Luồng tiếp theo: bước 62.

## 62. Ký phê duyệt hồ sơ gộp cấp VHT

Tác nhân: TGĐ VHT.

Thực hiện: Xem xét BM-00 và báo cáo thẩm định BM-14; ký hồ sơ gộp và ban hành BM-18 trong một giai đoạn. TTMS không ký quyết định.

Hồ sơ/biểu mẫu: BM-00; BM-14; BM-18.

Luồng tiếp theo: Đồng ý phê duyệt hồ sơ gộp → Đồng ý → Kết quả phê duyệt / chỉ đạo.

Đồng ý phê duyệt hồ sơ gộp → Không đồng ý: sửa BM-00 → bước 19.

# Trình thẩm định và phê duyệt cấp Tập đoàn

## 63. AI hỗ trợ dự thảo công văn trình Tập đoàn

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Dựa trên hồ sơ chủ trương, KĐT hoặc hồ sơ gộp đã được phân cấp Tập đoàn, hỗ trợ soạn công văn gửi Tập đoàn và tập hợp dự thảo hồ sơ; ĐVĐX rà soát trước trình.

Hồ sơ/biểu mẫu: Công văn trình Tập đoàn; dự thảo BM-01 / BM-03 / BM-00.

Luồng tiếp theo: bước 64.

## 64. Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn

Tác nhân: Đơn vị đề xuất VHT.

Thực hiện: Rà soát dự thảo công văn, căn cứ và hồ sơ đã thẩm định nội bộ; hoàn thiện bộ tài liệu để TGĐ VHT ký công văn trình lần đầu. Giai đoạn thẩm định tại VHT không ký.

Hồ sơ/biểu mẫu: Công văn; BM-01 / BM-03 / BM-00; căn cứ kèm theo.

Luồng tiếp theo: bước 65.

## 65. Ký công văn trình hồ sơ lên Tập đoàn

Tác nhân: TGĐ VHT.

Thực hiện: Xem xét và ký công văn kèm dự thảo hồ sơ đề nghị Tập đoàn xử lý theo thẩm quyền. Đây là ký trình hồ sơ, không phải VHT phê duyệt thay Tập đoàn.

Hồ sơ/biểu mẫu: Công văn đã ký; dự thảo BM-01 / BM-03 / BM-00.

Luồng tiếp theo: Đồng ý ký công văn trình → Đồng ý → bước 66.

Đồng ý ký công văn trình → Không đồng ý – hoàn thiện công văn → bước 64.

## 66. Chuyển hồ sơ đã ký lên Tập đoàn

Tác nhân: Hệ thống ĐTMS / Tích hợp VOffice.

Thực hiện: Chuyển hồ sơ đã ký tới Tập đoàn. VOffice: gửi qua tích hợp, nhận trạng thái/PDF tự động. Bản cứng: ghi nhận chuyển bộ hồ sơ giấy và tài liệu đã cập nhật tại bước 78 (khối KÝ CHUNG).

Hồ sơ/biểu mẫu: Công văn đã ký; hồ sơ gửi; trạng thái/PDF hoặc scan.

Luồng tiếp theo: bước 67.

## 67. Thẩm định và gửi phiếu nhận xét về VHT

Tác nhân: Các Ban chuyên môn Tập đoàn.

Thực hiện: Xem xét hồ sơ theo chức năng, lập và gửi phiếu/văn bản nhận xét để ĐVĐX thuộc VHT tiếp thu, bổ sung, giải trình. Chủ trương dùng BM-09; KĐT dùng BM-10.

Hồ sơ/biểu mẫu: BM-09 / BM-10; hồ sơ trình Tập đoàn.

Luồng tiếp theo: bước 68.

## 68. Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại

Tác nhân: Đơn vị đề xuất VHT.

Thực hiện: Trực tiếp tiếp thu ý kiến Tập đoàn, sửa hồ sơ và lập báo cáo giải trình; hoàn thiện bộ hồ sơ để TGĐ VHT ký trình lại. Hồ sơ bị trả về ở khâu sau cũng quay lại bước này, không qua đầu mối trung gian.

Hồ sơ/biểu mẫu: Báo cáo giải trình; BM-06; BM-01 / BM-03 / BM-00.

Luồng tiếp theo: bước 69.

## 69. Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn

Tác nhân: TGĐ VHT / lãnh đạo được ủy quyền.

Thực hiện: Ký trình lại báo cáo giải trình và bộ hồ sơ đã hoàn thiện sau nhận xét. Đối với hồ sơ chủ trương, TGĐ VHT ký trình chính thức; KĐT có thể do lãnh đạo được ủy quyền ký.

Hồ sơ/biểu mẫu: Báo cáo giải trình; BM-06; bộ hồ sơ hoàn thiện.

Luồng tiếp theo: bước 70.

## 70. Tiếp nhận và kiểm tra hồ sơ hoàn thiện

Tác nhân: Ban Đầu tư – Xây dựng Tập đoàn.

Thực hiện: Kiểm tra hồ sơ đã được VHT ký trình lại, việc tiếp thu và giải trình các ý kiến. Nếu chưa đủ điều kiện, trả trực tiếp ĐVĐX bổ sung và VHT ký trình lại.

Hồ sơ/biểu mẫu: Bộ hồ sơ hoàn thiện; báo cáo giải trình; ý kiến CQCM.

Luồng tiếp theo: Hồ sơ hoàn thiện đạt yêu cầu → Chưa đạt / cần bổ sung → bước 68.

Hồ sơ hoàn thiện đạt yêu cầu → Đạt → Hồ sơ chủ trương riêng → Có – chủ trương → bước 71.

Hồ sơ hoàn thiện đạt yêu cầu → Đạt → Hồ sơ chủ trương riêng → Không – KĐT / BM-00 → bước 72.

## 71. Hoàn thiện hồ sơ chủ trương và ký các Ban

Tác nhân: Các Ban chuyên môn / Ban ĐTXD Tập đoàn.

Thực hiện: Hoàn thiện hồ sơ chủ trương MS13 và thực hiện các chân ký của phòng ban Tập đoàn trên BM-01 trước khi TGĐ Tập đoàn ký trực tiếp. Không lập báo cáo thẩm định chủ trương hoặc quyết định riêng.

Hồ sơ/biểu mẫu: BM-01 có chân ký các Ban; hồ sơ chủ trương.

Luồng tiếp theo: bước 73.

## 72. Lập báo cáo thẩm định và dự thảo quyết định

Tác nhân: Ban Đầu tư – Xây dựng Tập đoàn.

Thực hiện: Áp dụng hồ sơ KĐT hoặc BM-00 gộp: tổng hợp ý kiến, lập và ký Báo cáo kết quả thẩm định BM-14; soạn dự thảo Quyết định BM-18 để TGĐ Tập đoàn phê duyệt. BM-00 vẫn là một giai đoạn gộp.

Hồ sơ/biểu mẫu: BM-14; dự thảo BM-18; BM-03 / BM-00.

Luồng tiếp theo: bước 73.

## 73. Ký phê duyệt hồ sơ cấp Tập đoàn

Tác nhân: TGĐ Tập đoàn.

Thực hiện: Chủ trương MS13: ký trực tiếp BM-01 đã có chân ký các Ban. KĐT hoặc hồ sơ gộp BM-00: xem xét BM-14 và ký ban hành BM-18. Không quay về TGĐ VHT phê duyệt thay Tập đoàn.

Hồ sơ/biểu mẫu: BM-01 hoặc BM-14 và BM-18.

Luồng tiếp theo: Đồng ý phê duyệt hồ sơ → Không đồng ý / yêu cầu sửa → bước 68.

Đồng ý phê duyệt hồ sơ → Đồng ý / đã ký → bước 74.

## 74. Nhận kết quả phê duyệt và lưu hồ sơ

Tác nhân: Hệ thống ĐTMS / Tích hợp VOffice.

Thực hiện: VOffice: nhận trạng thái/PDF tự động. Bản cứng: dùng trạng thái/scan đã cập nhật tại bước 78 (khối KÝ CHUNG). Lưu kết quả; chủ trương riêng được duyệt thì lập KĐT; KĐT/BM-00 được duyệt thì kết thúc.

Hồ sơ/biểu mẫu: BM-01 hoặc BM-18 đã ký; PDF/scan; trạng thái.

Luồng tiếp theo: Chủ trương riêng đã được duyệt → Có – lập hồ sơ KĐT → bước 49.

Chủ trương riêng đã được duyệt → Hồ sơ gộp– hoàn tất KĐT / hồ sơ gộp → Hoàn tất phê duyệt cấp Tập đoàn.

# Xử lý hình thức ký dùng chung

## 75. Chọn hình thức ký

Tác nhân: Người trình hồ sơ.

Thực hiện: Chọn VOffice hoặc bản cứng cho hồ sơ không Mật. Hệ thống lưu hình thức ký của lần trình hiện tại.

Hồ sơ/biểu mẫu: Hồ sơ không Mật; hình thức ký.

Luồng tiếp theo: Chọn ký VOffice → Bản cứng → bước 77.

Chọn ký VOffice → VOffice → bước 76.

## 76. Trình và nhận kết quả ký VOffice

Tác nhân: Hệ thống ĐTMS / VOffice.

Thực hiện: API gửi hồ sơ và luồng tới VOffice. Người có thẩm quyền ký/duyệt. Webhook trả trạng thái và PDF đã ký; ĐTMS lưu kết quả tự động, không xác nhận thủ công.

Hồ sơ/biểu mẫu: Hồ sơ trình ký; trạng thái; PDF đã ký.

Luồng tiếp theo: Đã nhận callback → Đã ghi nhận kết quả ký → Đủ trạng thái / tài liệu theo kết quả → Trở về bước hiện tại: xử lý Đồng ý / Không đồng ý theo luồng chính.

## 77. Thực hiện ký bản cứng

Tác nhân: Người trình; người có thẩm quyền ký.

Thực hiện: In và trình bản cứng theo đúng người ký, thứ tự ký tại bước hiện tại. Hồ sơ Mật bắt buộc theo nhánh này; không gửi hồ sơ Mật qua VOffice.

Hồ sơ/biểu mẫu: Bộ hồ sơ bản cứng; văn bản ký / ý kiến xử lý.

Luồng tiếp theo: Đã xử lý ký → bước 78.

## 78. Cập nhật kết quả ký bản cứng

Tác nhân: Người phụ trách hồ sơ.

Thực hiện: Cập nhật trạng thái, đính kèm bản scan và ý kiến xử lý. Với hồ sơ Mật, cập nhật và lưu tài liệu trong phạm vi được phép theo quy định bảo mật.

Hồ sơ/biểu mẫu: Trạng thái; scan văn bản; ý kiến xử lý.

Luồng tiếp theo: Đã lưu → Đã ghi nhận kết quả ký → Đủ trạng thái / tài liệu theo kết quả → Trở về bước hiện tại: xử lý Đồng ý / Không đồng ý theo luồng chính.

# D. NỘI DUNG CẦN ĐẶC TẢ THÊM NGOÀI BPMN

Các nội dung dưới đây cần được mô tả chi tiết trong SRS để triển khai các bước đã có trên BPMN. Đây là phạm vi đặc tả thông tin, quyền thao tác, điều kiện xử lý và tích hợp; các quy tắc nghiệp vụ tiếp tục bám sơ đồ và tài liệu nguồn.

## 1. Thông tin hồ sơ và kiểm tra checklist

Đặc tả từng thông tin nhập trên biểu mẫu: ý nghĩa, nguồn dữ liệu, bắt buộc, định dạng và điều kiện kiểm tra hợp lệ. Mô tả danh mục tài liệu đính kèm, cách tham chiếu căn cứ, thông tin ghi chú khi thiếu hoặc không áp dụng tài liệu; giữ đầy đủ danh mục checklist. Xác định thông tin được kế thừa giữa các giai đoạn và nội dung người phụ trách được chỉnh sửa.

## 2. Phân loại và xác định thẩm quyền

Đặc tả dữ liệu đầu vào và bảng quy tắc xác định luồng, cấp duyệt chủ trương và cấp duyệt KĐT: loại tài sản, loại/mục đích KĐT, lĩnh vực, tổng mức vốn và căn cứ phân cấp/ủy quyền có hiệu lực. Mô tả việc lưu căn cứ đã áp dụng, thời điểm tính lại khi dữ liệu thay đổi và cách hiển thị kết quả trước trình ký. Ngưỡng phân loại luồng và thẩm quyền phê duyệt phải được quản lý riêng.

## 3. Vai trò quyền thao tác và danh sách CQCM

Đặc tả quyền xem, lập, sửa, bổ sung, trình, xác nhận và ký theo vai trò, đơn vị và giai đoạn. Mô tả cách ĐVĐX lựa chọn CQCM/chủ trì, CQCM chủ trì xác nhận danh sách, lưu lý do không đồng ý và chọn lại đúng giai đoạn. Nêu rõ người được giao xử lý tại từng bước và cách hiển thị hồ sơ chờ xử lý.

## 4. Họp giải trình và quản lý hồ sơ trả sửa

Đặc tả cách mở bộ đếm riêng cho từng vòng/giai đoạn, tăng số lần sau họp hoàn tất, lưu biên bản và kết quả. Mô tả việc giữ bộ đếm khi sửa/trình lại, kiểm tra giới hạn 2 lần theo sơ đồ, ghi nhận xác nhận của Chuyên quản và Chỉ huy trước cập nhật hồ sơ. Khi trả sửa, lưu người trả, lý do, giai đoạn, phiên bản tài liệu và bước cần thực hiện lại theo nhánh BPMN.

## 5. AI và dữ liệu tích hợp đầu vào

Đặc tả nguồn căn cứ, dữ liệu tồn kho/báo giá, thông tin đầu vào và đầu ra của từng thao tác AI. Mô tả người rà soát/xác nhận kết quả, nội dung gợi ý được chấp nhận hoặc chỉnh sửa và cách lưu kết quả kiểm tra. Với thao tác lấy dữ liệu, gửi yêu cầu hoặc nhận kết quả, mô tả thông tin trao đổi, trạng thái xử lý và cách xử lý khi dữ liệu chưa có hoặc tích hợp chưa hoàn tất.

## 6. Trình ký VOffice và ký bản cứng

Đặc tả lựa chọn hình thức ký theo độ Mật, thành phần hồ sơ, người ký và thứ tự ký của bước hiện tại. Với VOffice, mô tả dữ liệu gửi, nhận trạng thái/PDF, liên kết kết quả với lần trình và xử lý khi chưa nhận kết quả. Với bản cứng, mô tả quyền cập nhật trạng thái, đính kèm scan và ý kiến xử lý theo phạm vi được phép. Nêu điều kiện đủ kết quả để tiếp tục nhánh Đồng ý/Không đồng ý của luồng chính.

## 7. Tuyến xử lý Tập đoàn và kết quả phê duyệt

Đặc tả bộ hồ sơ gửi lần đầu, nhận ý kiến chuyên môn, văn bản giải trình và bộ hồ sơ trình lại. Mô tả việc giữ đúng loại hồ sơ/giai đoạn khi chuyển VHT–Tập đoàn, lưu các tài liệu đã ký và sử dụng kết quả phê duyệt chủ trương làm đầu vào KĐT. Hồ sơ bị trả phải gắn với bước bổ sung và ký trình lại tương ứng trên sơ đồ.

## 8. Trạng thái phiên bản và lịch sử hồ sơ

Đặc tả tên và điều kiện chuyển trạng thái theo các bước, người thực hiện, thời điểm, kết quả và tài liệu kèm theo. Mô tả phiên bản trước/sau chỉnh sửa, lịch sử trình ký và quyết định đã phê duyệt để người phụ trách tra cứu tiến trình, lý do trả sửa và hồ sơ hiện hành.

## 9. Điều kiện gộp BM-00 và chuyển sang BM-01 BM-03

Đặc tả việc kiểm tra đồng thời 3 điều kiện gộp: thuộc MS13, trang bị nội bộ và tài sản nguyên chiếc không cần tích hợp trước sử dụng. Mô tả cách chọn bộ biểu mẫu, mở vòng BM-00 hoặc hai vòng BM-01/BM-03, quản lý bộ đếm độc lập và lưu phương án đã chọn. Khi sửa sau từ chối, giữ vòng hiện tại; mô tả việc xét lại gộp/tách khi đầu vào thay đổi làm mất điều kiện gộp theo ghi chú BPMN.

## 10. Kết quả chủ trương và phê duyệt KĐT

Đặc tả cách lưu BM-01 ký trực tiếp làm căn cứ lập BM-03; đối với KĐT/hồ sơ gộp, lưu báo cáo BM-14 và quyết định BM-18. Mô tả liên kết hồ sơ, thông tin kế thừa, điều kiện mở giai đoạn KĐT hoặc kết thúc hồ sơ gộp theo cấp duyệt.

# E. PHỤ LỤC TÓM TẮT CÁC BƯỚC

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu** |
|:--:|:---|:---|:---|
| 1 | Chọn căn cứ và nội dung KĐT | Đơn vị đề xuất KĐT | Không có mẫu riêng; Tài liệu đầu vào |
| 2 | Lấy dữ liệu căn cứ đã phê duyệt | Hệ thống ĐTMS/Tích hợp/ AI | Không có |
| 3 | AI gợi ý thông tin cơ bản KĐT | Hệ thống ĐTMS/Tích hợp/ AI | Không có |
| 4 | Rà soát và xác nhận thông tin cơ bản | Đơn vị đề xuất mua sắm | Không có mẫu riêng; thông tin là đầu vào BM-01 |
| 5 | Chọn/bóc tách căn cứ KĐT | Đơn vị đề xuất KĐT | Không có |
| 6 | Kiểm tra tồn kho | Hệ thống ĐTMS / AI | Không có; dữ liệu Dự toán/eBOM/mBOM/Quản lý kho |
| 7 | Nhận thông tin rà soát tồn kho khả dụng | Đơn vị đề xuất KĐT | Kết quả rà soát tồn kho theo Quy định QLTS |
| 8 | Khởi tạo / chỉnh sửa yêu cầu báo giá | Đơn vị đề xuất KĐT | Yêu cầu báo giá theo Quy định TTMS |
| 9 | Gửi yêu cầu báo giá | Hệ thống ĐTMS/Tích hợp/ AI | Yêu cầu báo giá theo Quy định |
| 10 | Tổng hợp và kiểm tra báo giá | Đơn vị đề xuất KĐT | Báo giá/Kết quả lấy báo giá |
| 11 | Xác nhận hình thành TSCĐ | Ban Tài chính | Kết quả xác nhận TSCĐ; hồ sơ KĐT |
| 12 | Xác nhận 04 yếu tố định danh | TTMS | Thông tin định danh KĐT |
| 13 | Xác định thẩm quyền phê duyệt | Hệ thống ĐTMS | Kết quả xác nhận tài sản, định danh KĐT; tổng mức vốn; quy định phân cấp / ủy quyền |
| 14 | AI gợi ý thông tin cần chỉnh sửa | Hệ thống ĐTMS/Tích hợp/ AI | Kết quả kiểm tra định danh; nội dung cần chỉnh sửa |
| 15 | Hoàn thiện dự thảo KĐT | Đơn vị đề xuất KĐT | BM-00 hoặc BM-01/BM-03 theo nhánh đã xác định; Checklist tương ứng |
| 16 | AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT | Hệ thống ĐTMS / AI | Đề xuất KĐT; dữ liệu căn cứ |
| 17 | Rà soát, bổ sung và hoàn thiện đề xuất | Đơn vị đề xuất | Đề xuất KĐT đã rà soát |
| 18 | AI hỗ trợ lập dự thảo | Hệ thống ĐTMS / AI | Dự thảo BM-00; tài liệu căn cứ |
| 19 | Lập dự thảo văn bản gộp BM-00 | Đơn vị đề xuất | BM-00; hồ sơ và tài liệu kèm theo |
| 20 | Xin ý kiến Chỉ huy ĐVĐX | Đơn vị đề xuất | BM-00 |
| 21 | Cho ý kiến dự thảo văn bản gộp | Chỉ huy ĐVĐX | BM-00 |
| 22 | Lựa chọn CQCM thẩm định dự thảo | Đơn vị đề xuất | Hồ sơ BM-00 |
| 23 | Xác nhận danh sách CQCM BM-00 | CQCM chủ trì thẩm định tại VHT | Danh sách CQCM BM-00; kết quả xác nhận |
| 24 | Ký phiếu yêu cầu thẩm định | Chỉ huy Đơn vị đề xuất | Phiếu yêu cầu thẩm định; BM-00; bộ đếm BM-00 |
| 25 | AI gợi ý thông tin cần chỉnh sửa | Hệ thống ĐTMS/Tích hợp/ AI | Kết quả kiểm tra hồ sơ; nội dung cần chỉnh sửa |
| 26 | Bổ sung và hoàn chỉnh hồ sơ | Đơn vị đề xuất | Hồ sơ dự thảo đã bổ sung; tài liệu kèm theo |
| 27 | Thẩm định nội dung hồ sơ | CQCM chủ trì / phối hợp | BM-00 / BM-01 / BM-03 theo giai đoạn; tài liệu căn cứ |
| 28 | AI gợi ý phản hồi | Hệ thống ĐTMS/Tích hợp/ AI | Ý kiến thẩm định dự thảo |
| 29 | Thẩm định và gửi ý kiến chuyên môn | CQCM phối hợp | Ý kiến thẩm định; BM-09/BM-10 khi áp dụng |
| 30 | AI gợi ý nội dung cần chỉnh sửa | Hệ thống ĐTMS/Tích hợp/ AI | Ý kiến CQCM; nội dung cần sửa / giải trình |
| 31 | Bổ sung hồ sơ hoặc giải trình | Đơn vị đề xuất | Văn bản giải trình |
| 32 | Họp thống nhất giải trình ĐVĐX – CQCM | CQCM chủ trì | Biên bản/kết quả họp |
| 33 | Ghi nhận lần họp và kết quả | Hệ thống ĐTMS / AI | Biên bản họp; kết quả; bộ đếm riêng BM-00 / BM-01 / BM-03 |
| 34 | Chuyên quản xác nhận sau họp | Chuyên quản ĐVĐX | Biên bản họp; nội dung điều chỉnh; xác nhận chuyên quản |
| 35 | Chỉ huy đơn vị xác nhận sau họp | Chỉ huy ĐVĐX | Biên bản họp; nội dung điều chỉnh; xác nhận Chỉ huy |
| 36 | Cập nhật hồ sơ theo nội dung đã xác nhận | Đơn vị đề xuất | Hồ sơ đã cập nhật; nội dung đã được xác nhận |
| 37 | Báo cáo nội dung chưa thống nhất | CQCM chủ trì / phối hợp | Báo cáo nội dung chưa thống nhất; hồ sơ liên quan |
| 38 | Xem xét, kết luận nội dung chưa thống nhất | Người có thẩm quyền tại VHT | Báo cáo nội dung chưa thống nhất; hồ sơ liên quan |
| 39 | Lập và hoàn thiện tờ trình chủ trương | Đơn vị đề xuất | BM-01; Checklist 01 |
| 40 | Kiểm tra hồ sơ trước trình | Đơn vị đề xuất | Checklist 01 |
| 41 | Chọn CQCM thẩm định chủ trương | Đơn vị đề xuất | BM-01; Checklist 01 |
| 42 | Xác nhận danh sách CQCM BM-01 | CQCM chủ trì thẩm định tại VHT | Danh sách CQCM BM-01; kết quả xác nhận |
| 43 | Trình hồ sơ tới các đầu mối | Đơn vị đề xuất | BM-01; Checklist 01 |
| 44 | HT/AI kiểm tra trước khi gửi | Hệ thống ĐTMS / AI | BM-01; Checklist 01; kết quả kiểm tra |
| 45 | Mở vòng thẩm định chủ trương BM-01 | Hệ thống ĐTMS | BM-01; Checklist 01; bộ đếm BM-01 |
| 46 | Thẩm định và hoàn chỉnh hồ sơ chủ trương | CQCM chủ trì thẩm định tại VHT | BM-01; Checklist 01; ý kiến CQCM |
| 47 | Ký thẩm định trực tiếp trên tờ trình chủ trương | CQCM chủ trì; cấp phó phụ trách nếu có | BM-01 |
| 48 | Ký phê duyệt chủ trương cấp VHT | TGĐ VHT | BM-01 |
| 49 | AI gợi ý thông tin lập hồ sơ phê duyệt KĐT | Hệ thống ĐTMS/Tích hợp/ AI | BM-03; Checklist 02 |
| 50 | Lập hồ sơ phê duyệt KĐT | Đơn vị đề xuất | BM-03; Checklist 02; chủ trương đã duyệt |
| 51 | Kiểm tra và trình hồ sơ | Đơn vị đề xuất | Checklist 02; hồ sơ KĐT |
| 52 | Lựa chọn CQCM thẩm định KĐT | Đơn vị đề xuất | BM-03; Checklist 02 |
| 53 | Xác nhận danh sách CQCM BM-03 | CQCM chủ trì thẩm định tại VHT | Danh sách CQCM BM-03; kết quả xác nhận |
| 54 | Mở vòng thẩm định KĐT BM-03 | Hệ thống ĐTMS | BM-03; Checklist 02; chủ trương đã duyệt; bộ đếm BM-03 |
| 55 | Thẩm định hồ sơ KĐT tại VHT | TTMS / CQCM chủ trì thẩm định tại VHT | BM-03; Checklist 02; ý kiến CQCM |
| 56 | Ký tờ trình phê duyệt KĐT | Chỉ huy Đơn vị đề xuất | BM-03; Checklist 02 |
| 57 | Ký báo cáo thẩm định và soạn dự thảo quyết định | TTMS / CQCM chủ trì thẩm định cấp VHT | BM-14; dự thảo BM-18 |
| 58 | AI tóm tắt phản hồi và gợi ý điều chỉnh | Hệ thống ĐTMS/Tích hợp/ AI | Không có mẫu riêng; hồ sơ / kết quả tại bước này. |
| 59 | Hoàn chỉnh hồ sơ theo hướng dẫn | Đơn vị đề xuất | Hồ sơ; giải trình |
| 60 | Ký ban hành quyết định phê duyệt KĐT cấp VHT | TGĐ VHT | BM-03; BM-14; BM-18 |
| 61 | Hoàn thiện và trình ký hồ sơ gộp cấp VHT | Đơn vị đề xuất; TTMS / CQCM chủ trì | BM-00; BM-14; dự thảo BM-18 |
| 62 | Ký phê duyệt hồ sơ gộp cấp VHT | TGĐ VHT | BM-00; BM-14; BM-18 |
| 63 | AI hỗ trợ dự thảo công văn trình Tập đoàn | Hệ thống ĐTMS / AI | Công văn trình Tập đoàn; dự thảo BM-01 / BM-03 / BM-00 |
| 64 | Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn | Đơn vị đề xuất VHT | Công văn; BM-01 / BM-03 / BM-00; căn cứ kèm theo |
| 65 | Ký công văn trình hồ sơ lên Tập đoàn | TGĐ VHT | Công văn đã ký; dự thảo BM-01 / BM-03 / BM-00 |
| 66 | Chuyển hồ sơ đã ký lên Tập đoàn | Hệ thống ĐTMS / Tích hợp VOffice | Công văn đã ký; hồ sơ gửi; trạng thái/PDF hoặc scan |
| 67 | Thẩm định và gửi phiếu nhận xét về VHT | Các Ban chuyên môn Tập đoàn | BM-09 / BM-10; hồ sơ trình Tập đoàn |
| 68 | Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại | Đơn vị đề xuất VHT | Báo cáo giải trình; BM-06; BM-01 / BM-03 / BM-00 |
| 69 | Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn | TGĐ VHT / lãnh đạo được ủy quyền | Báo cáo giải trình; BM-06; bộ hồ sơ hoàn thiện |
| 70 | Tiếp nhận và kiểm tra hồ sơ hoàn thiện | Ban Đầu tư – Xây dựng Tập đoàn | Bộ hồ sơ hoàn thiện; báo cáo giải trình; ý kiến CQCM |
| 71 | Hoàn thiện hồ sơ chủ trương và ký các Ban | Các Ban chuyên môn / Ban ĐTXD Tập đoàn | BM-01 có chân ký các Ban; hồ sơ chủ trương |
| 72 | Lập báo cáo thẩm định và dự thảo quyết định | Ban Đầu tư – Xây dựng Tập đoàn | BM-14; dự thảo BM-18; BM-03 / BM-00 |
| 73 | Ký phê duyệt hồ sơ cấp Tập đoàn | TGĐ Tập đoàn | BM-01 hoặc BM-14 và BM-18 |
| 74 | Nhận kết quả phê duyệt và lưu hồ sơ | Hệ thống ĐTMS / Tích hợp VOffice | BM-01 hoặc BM-18 đã ký; PDF/scan; trạng thái |
| 75 | Chọn hình thức ký | Người trình hồ sơ | Hồ sơ không Mật; hình thức ký |
| 76 | Trình và nhận kết quả ký VOffice | Hệ thống ĐTMS / VOffice | Hồ sơ trình ký; trạng thái; PDF đã ký |
| 77 | Thực hiện ký bản cứng | Người trình; người có thẩm quyền ký | Bộ hồ sơ bản cứng; văn bản ký / ý kiến xử lý |
| 78 | Cập nhật kết quả ký bản cứng | Người phụ trách hồ sơ | Trạng thái; scan văn bản; ý kiến xử lý |
