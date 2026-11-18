<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS14-121026.docx -->
<!-- pk-sha256: 9e7529ee049231a22d79dbd618eaaad22cc99d17520cce06d0424e50ebcf5e58 -->
<!-- pk-generated: 2026-10-12 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS14 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS14-121026.docx`. Trích dẫn thì ghi mã **DG-MS14** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS14 - KHOẢN ĐẦU TƯ THÔNG THƯỜNG**

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
| 12/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS14. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

**MỤC LỤC**

[**A. GIỚI THIỆU**](#_heading=) **7**

> [1. Mục đích tài liệu](#_heading=) 7
>
> [2. Phạm vi áp dụng](#_heading=) 7
>
> [3. Tài liệu liên quan](#_heading=) 7
>
> [4. Thuật ngữ và các từ viết tắt](#_heading=) 8

[**B. TỔNG QUAN NGHIỆP VỤ**](#_heading=) **8**

> [1. Mục tiêu](#_heading=) 8
>
> [2. Điều kiện và các nhánh xử lý](#_heading=) 9
>
> [3. Vai trò tham gia](#_heading=) 9
>
> [4. Danh mục biểu mẫu và hồ sơ](#_heading=) 10
>
> [5. Nguyên tắc xử lý chung](#_heading=) 11

[**C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**](#_heading=) **11**

[**Tiếp nhận căn cứ và hoàn thiện đề xuất**](#_heading=) **12**

> [1. Chọn căn cứ và nội dung KĐT](#_heading=) 12
>
> [2. Lấy dữ liệu căn cứ đã phê duyệt](#_heading=) 12
>
> [3. AI gợi ý thông tin cơ bản KĐT](#_heading=) 12
>
> [4. Rà soát và xác nhận thông tin cơ bản](#_heading=) 12
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
> [12. Xác nhận 04 yếu tố định danh](#_heading=) 14
>
> [13. Phân loại và xác định cấp phê duyệt](#_heading=) 15
>
> [14. AI gợi ý thông tin cần chỉnh sửa](#_heading=) 15
>
> [15. Hoàn thiện dự thảo KĐT](#_heading=) 15
>
> [16. AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT](#_heading=) 15
>
> [17. Rà soát, bổ sung và hoàn thiện đề xuất](#_heading=) 16

[**Kiểm tra thẩm định giải trình và họp theo giai đoạn**](#_heading=) **16**

> [18. AI gợi ý thông tin cần chỉnh sửa](#_heading=) 16
>
> [19. Bổ sung và hoàn chỉnh hồ sơ](#_heading=) 16
>
> [20. Thẩm định nội dung hồ sơ](#_heading=) 16
>
> [21. Ký và gửi công văn phối hợp thẩm định](#_heading=) 17
>
> [22. AI gợi ý phản hồi](#_heading=) 17
>
> [23. Thẩm định và gửi ý kiến chuyên môn](#_heading=) 17
>
> [24. AI gợi ý nội dung cần chỉnh sửa](#_heading=) 18
>
> [25. Bổ sung hồ sơ hoặc giải trình](#_heading=) 18
>
> [26. Họp thống nhất giải trình ĐVĐX – CQCM](#_heading=) 18
>
> [27. Ghi nhận lần họp và kết quả](#_heading=) 18
>
> [28. Chuyên quản xác nhận sau họp](#_heading=) 19
>
> [29. Chỉ huy đơn vị xác nhận sau họp](#_heading=) 19
>
> [30. Cập nhật hồ sơ theo nội dung đã xác nhận](#_heading=) 19
>
> [31. Báo cáo nội dung chưa thống nhất](#_heading=) 19
>
> [32. Xem xét, kết luận nội dung chưa thống nhất](#_heading=) 20

[**Lập và phê duyệt chủ trương BM-02**](#_heading=) **20**

> [33. Lập và hoàn thiện tờ trình chủ trương](#_heading=) 20
>
> [34. Kiểm tra hồ sơ trước trình](#_heading=) 20
>
> [35. Chọn CQCM thẩm định chủ trương](#_heading=) 20
>
> [36. Xác nhận danh sách CQCM BM-02](#_heading=) 21
>
> [37. Ký và trình hồ sơ chủ trương](#_heading=) 21
>
> [38. HT/AI kiểm tra trước khi gửi](#_heading=) 21
>
> [39. Mở vòng thẩm định chủ trương BM-02](#_heading=) 21
>
> [40. Thẩm định và hoàn chỉnh hồ sơ chủ trương](#_heading=) 22
>
> [41. Chuẩn bị hồ sơ tham mưu HĐĐT VHT](#_heading=) 22
>
> [42. Xem xét độc lập và ký ý kiến HĐĐT](#_heading=) 22
>
> [43. Ký báo cáo thẩm định chủ trương; dự thảo quyết định](#_heading=) 22
>
> [44. Ký ban hành quyết định chủ trương cấp VHT](#_heading=) 23

[**Lập và phê duyệt khoản đầu tư BM-04**](#_heading=) **23**

> [45. AI gợi ý thông tin lập hồ sơ phê duyệt KĐT](#_heading=) 23
>
> [46. Lập hồ sơ phê duyệt KĐT](#_heading=) 23
>
> [47. Kiểm tra hồ sơ KĐT trước trình](#_heading=) 24
>
> [48. Lựa chọn CQCM thẩm định KĐT](#_heading=) 24
>
> [49. Xác nhận danh sách CQCM BM-04](#_heading=) 24
>
> [50. Ký và trình hồ sơ phê duyệt KĐT](#_heading=) 24
>
> [51. Mở vòng thẩm định KĐT BM-04](#_heading=) 25
>
> [52. Thẩm định hồ sơ KĐT tại VHT](#_heading=) 25
>
> [53. Ký báo cáo thẩm định và soạn dự thảo quyết định](#_heading=) 25
>
> [54. AI tóm tắt phản hồi và gợi ý điều chỉnh](#_heading=) 25
>
> [55. Hoàn chỉnh hồ sơ theo hướng dẫn](#_heading=) 26
>
> [56. Ký ban hành quyết định phê duyệt KĐT cấp VHT](#_heading=) 26

[**Trình thẩm định và phê duyệt cấp Tập đoàn**](#_heading=) **26**

> [57. AI hỗ trợ dự thảo công văn trình Tập đoàn](#_heading=) 26
>
> [58. Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn](#_heading=) 26
>
> [59. Ký công văn trình hồ sơ lên Tập đoàn](#_heading=) 27
>
> [60. Chuyển hồ sơ đã ký lên Tập đoàn](#_heading=) 27
>
> [61. Ký và gửi công văn phối hợp thẩm định](#_heading=) 27
>
> [62. Thẩm định và gửi phiếu nhận xét về VHT](#_heading=) 27
>
> [63. Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại](#_heading=) 28
>
> [64. Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn](#_heading=) 28
>
> [65. Tiếp nhận và kiểm tra hồ sơ hoàn thiện](#_heading=) 28
>
> [66. Chuẩn bị hồ sơ tham mưu HĐĐT Tập đoàn](#_heading=) 28
>
> [67. Xem xét độc lập và ký ý kiến HĐĐT](#_heading=) 29
>
> [68. Ký báo cáo thẩm định chủ trương; dự thảo quyết định](#_heading=) 29
>
> [69. Ký báo cáo thẩm định KĐT; dự thảo quyết định](#_heading=) 29
>
> [70. Ký phê duyệt hồ sơ cấp Tập đoàn](#_heading=) 29
>
> [71. Nhận kết quả phê duyệt và lưu hồ sơ](#_heading=) 30

[**Xử lý hình thức ký dùng chung**](#_heading=) **31**

> [72. Chọn hình thức ký](#_heading=) 31
>
> [73. Trình và nhận kết quả ký VOffice](#_heading=) 31
>
> [74. Thực hiện ký bản cứng](#_heading=) 31
>
> [75. Cập nhật kết quả ký bản cứng](#_heading=) 31

[**D. NỘI DUNG CẦN ĐẶC TẢ THÊM NGOÀI BPMN**](#_heading=) **32**

> [1. Thông tin hồ sơ và kiểm tra checklist](#_heading=) 32
>
> [2. Phân loại và xác định thẩm quyền](#_heading=) 32
>
> [3. Vai trò quyền thao tác và danh sách CQCM](#_heading=) 32
>
> [4. Họp giải trình và quản lý hồ sơ trả sửa](#_heading=) 32
>
> [5. AI và dữ liệu tích hợp đầu vào](#_heading=) 32
>
> [6. Trình ký VOffice và ký bản cứng](#_heading=) 33
>
> [7. Tuyến xử lý Tập đoàn và kết quả phê duyệt](#_heading=) 33
>
> [8. Trạng thái phiên bản và lịch sử hồ sơ](#_heading=) 33
>
> [9. Hai giai đoạn chủ trương và KĐT](#_heading=) 33
>
> [10. Ý kiến tham mưu Hội đồng đầu tư](#_heading=) 33

[**E. PHỤ LỤC TÓM TẮT CÁC BƯỚC**](#_heading=) **34**

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải luồng MS14 – Khoản đầu tư thông thường, từ lựa chọn căn cứ, rà soát tồn kho và báo giá đến lập, thẩm định và phê duyệt chủ trương, sau đó lập, thẩm định và phê duyệt khoản đầu tư. Tài liệu làm rõ trách nhiệm các bên, biểu mẫu, điều kiện chuyển giai đoạn và các tuyến xử lý thuộc cấp VHT hoặc Tập đoàn.

## 2. Phạm vi áp dụng

Áp dụng khoản đầu tư lĩnh vực Viễn thông – Công nghệ thông tin có tổng mức vốn từ 160 tỷ đến dưới 1.000 tỷ đồng; lĩnh vực khác từ 90 tỷ đến dưới 500 tỷ đồng, trừ bất động sản. Ngưỡng này dùng phân loại MS14; cấp duyệt chủ trương và KĐT được xác định riêng theo phân cấp/ủy quyền. Luồng gồm 71 bước chính và 4 bước hình thức ký dùng chung, giữ nguyên số thứ tự trên sơ đồ.

MS14 thực hiện hai giai đoạn riêng: chủ trương được phê duyệt bằng BM-17 trước, sau đó lập hồ sơ KĐT BM-04/BM-05 và phê duyệt bằng BM-18. Hồ sơ và số lần họp được quản lý riêng cho từng giai đoạn.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:---|:---|
| 1 | CNM.VHT.DTMS_Plan_20260904.xlsx | Kế hoạch ĐTMS và nội dung quy trình làm căn cứ mô tả chức năng, phân loại luồng và tổ chức xử lý. |
| 2 | 2026 Quy trình thẩm định phê duyệt KĐT (ban hành lần 1) | Nguồn về lập, thẩm định, tham mưu Hội đồng đầu tư và phê duyệt khoản đầu tư thông thường. |
| 3 | 2026 Biểu mẫu KĐT | Nguồn về biểu mẫu, checklist, báo cáo thẩm định và quyết định của từng giai đoạn. |
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
| 9 | HĐĐT | Hội đồng đầu tư |
| 10 | AI | Trí tuệ nhân tạo hỗ trợ đọc, soạn, gợi ý và kiểm tra nội dung. |
| 11 | BM-02 / BM-04 / BM-05 | Tờ trình chủ trương / Tờ trình phê duyệt KĐT / Báo cáo đề xuất đầu tư. |
| 12 | VOffice | Hệ thống trình ký tích hợp với ĐTMS. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Hoàn thiện hồ sơ và thực hiện đúng trình tự chủ trương trước, khoản đầu tư sau. Thẩm định và phê duyệt dựa trên loại hồ sơ, thông tin định danh và cấp có thẩm quyền. HĐĐT tham mưu chủ trương; cơ quan chủ trì ký báo cáo thẩm định và soạn dự thảo quyết định; TGĐ có thẩm quyền ký quyết định.

## 2. Điều kiện và các nhánh xử lý

| **Tiêu chí** | **Nội dung xử lý** |
|:--:|:---|
| Phân loại MS14 | Viễn thông – CNTT: 160 ≤ tổng mức vốn \< 1.000 tỷ đồng. Lĩnh vực khác, trừ bất động sản: 90 ≤ tổng mức vốn \< 500 tỷ đồng. Không thuộc MS14 → chuyển MS13/MS15 phù hợp. |
| Thông tin căn cứ | Chưa đủ → bước 4 rà soát, xác nhận. Đủ → nhận thông tin tồn kho, lập và gửi yêu cầu báo giá. |
| Báo giá | Không đạt → bước 8 sửa yêu cầu báo giá. Đạt → xác nhận TSCĐ và 4 yếu tố định danh theo hai nhánh song song. |
| Hai xác nhận | Chờ đủ hai kết quả. Cả hai OK → bước 13 phân loại, xác định cấp duyệt. NOT OK → bước 14 gợi ý chỉnh sửa. |
| Chuyển giai đoạn | BM-17 đã được phê duyệt → lập KĐT BM-04/BM-05 tại bước 45–46. BM-18 đã được phê duyệt → hoàn tất KĐT. |
| Cấp phê duyệt | Lưu riêng cấp duyệt chủ trương và KĐT. Các nhánh VHT/Tập đoàn sử dụng kết quả xác định tại bước 13. |
| Danh sách CQCM | ĐVĐX lựa chọn; CQCM chủ trì xác nhận. Không đồng ý → chọn lại đúng danh sách của giai đoạn hiện tại. |
| Họp phối hợp | Trong phạm vi sơ đồ này: mỗi giai đoạn tối đa 2 lần, bộ đếm độc lập và không đặt lại khi sửa/trình lại. Họp HĐĐT không tính vào giới hạn này. |
| Hình thức ký | Hồ sơ Mật ký bản cứng. Không Mật: chọn VOffice hoặc bản cứng. Ghi nhận đủ trạng thái/tài liệu trước tiếp tục bước chính. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm** |
|:--:|:---|:---|
| 1 | Đơn vị đề xuất / Chuyên quản | Chọn căn cứ, rà soát thông tin, lập hồ sơ, giải trình và tiếp thu nhận xét. |
| 2 | Đầu mối kiểm tra độc lập ĐVĐX | Kiểm tra tính đầy đủ, hợp lệ theo checklist trước trình. |
| 3 | Chỉ huy ĐVĐX | Ký trình hồ sơ chủ trương và KĐT; xác nhận nội dung sau họp. |
| 4 | Hệ thống ĐTMS / AI | Lấy dữ liệu, hỗ trợ soạn/kiểm tra, xác định cấp duyệt, quản lý số lần họp và kết quả ký. |
| 5 | Ban Tài chính | Xác nhận hình thành TSCĐ. |
| 6 | TTMS / CQCM chủ trì | Xác nhận định danh/danh sách CQCM, tổ chức thẩm định, họp và chuẩn bị hồ sơ tham mưu; ký báo cáo theo thẩm quyền. |
| 7 | CQCM phối hợp | Thẩm định theo chức năng, gửi ý kiến và tham gia báo cáo theo thành phần áp dụng. |
| 8 | Phó TGĐ / Phó GĐ phụ trách | Tham gia ký báo cáo thẩm định theo thành phần áp dụng. |
| 9 | HĐĐT VHT / Tập đoàn | Xem xét độc lập, ký ý kiến về chủ trương và ghi ý kiến bảo lưu. |
| 10 | TGĐ VHT / Người có thẩm quyền xử lý tại VHT | Phê duyệt thuộc thẩm quyền; ký công văn trình Tập đoàn; kết luận nội dung chưa thống nhất tại VHT. |
| 11 | Các Ban chuyên môn / Ban ĐTXD Tập đoàn | Thẩm định, gửi nhận xét, kiểm tra hồ sơ trình lại; chuẩn bị hồ sơ HĐĐT và báo cáo/dự thảo quyết định. |
| 12 | TGĐ Tập đoàn | Ký quyết định chủ trương hoặc KĐT thuộc thẩm quyền Tập đoàn. |
| 13 | Người trình / Người phụ trách hồ sơ | Chọn hình thức ký khi được phép; trình bản cứng, cập nhật trạng thái, scan và ý kiến xử lý. |

## 4. Danh mục biểu mẫu và hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Vai trò trong luồng** |
|:--:|:---|:---|
| 1 | Căn cứ; kết quả tồn kho; báo giá; xác nhận định danh | Đầu vào lập nhu cầu, tổng mức vốn và phân loại/thẩm quyền. |
| 2 | BM-02; Checklist 03 | Lập và kiểm tra hồ sơ chủ trương MS14. |
| 3 | BM-04; BM-05; Checklist 04 | Lập và kiểm tra hồ sơ phê duyệt KĐT sau khi có BM-17. |
| 4 | BM-07 / BM-08 | Công văn phối hợp thẩm định chủ trương/KĐT theo lựa chọn. |
| 5 | BM-09 / BM-10 | Ý kiến/phiếu nhận xét chuyên môn chủ trương/KĐT. |
| 6 | BM-11 | Ý kiến tham mưu HĐĐT về chủ trương. |
| 7 | BM-13; BM-17 | Báo cáo thẩm định chủ trương; quyết định phê duyệt chủ trương. |
| 8 | BM-15; BM-18 | Báo cáo thẩm định KĐT; quyết định phê duyệt KĐT. |
| 9 | BM-06; công văn; văn bản giải trình | Phiếu trình giải quyết công việc và bộ hồ sơ trình/trình lại Tập đoàn. |
| 10 | Biên bản họp; xác nhận; bộ đếm từng giai đoạn | Theo dõi nội dung thống nhất, xác nhận sửa và số lần họp phối hợp. |
| 11 | Trạng thái; PDF đã ký; scan văn bản | Ghi nhận kết quả ký qua VOffice hoặc bản cứng. |

## 5. Nguyên tắc xử lý chung

MS14 có hai giai đoạn riêng: chủ trương BM-02 và KĐT BM-04/BM-05. Chỉ lập hồ sơ KĐT sau khi chủ trương được phê duyệt bằng BM-17.

Chủ trương sử dụng báo cáo thẩm định BM-13 và quyết định BM-17. KĐT sử dụng báo cáo thẩm định BM-15 và quyết định BM-18. Cơ quan chủ trì ký báo cáo, TGĐ có thẩm quyền ký quyết định.

HĐĐT xem xét độc lập hồ sơ chủ trương, ký ý kiến BM-11 và ghi ý kiến bảo lưu. Hoạt động HĐĐT không tính vào số lần họp phối hợp ĐVĐX–CQCM.

Bước 13 xác định riêng cấp duyệt chủ trương và KĐT; tính lại khi dữ liệu hoặc quy tắc áp dụng thay đổi. Ngưỡng phân loại MS14 không mặc nhiên là thẩm quyền VHT.

Danh sách CQCM do ĐVĐX lựa chọn và CQCM chủ trì xác nhận. Chưa đồng ý hoặc hồ sơ cần sửa thì quay về đúng giai đoạn.

Trong phạm vi sơ đồ này, họp phối hợp mỗi giai đoạn tối đa 2 lần. Bộ đếm chủ trương và KĐT độc lập; sửa/trình lại không đặt lại số lần đã họp.

Sau họp, Chuyên quản và Chỉ huy đơn vị xác nhận trước khi ĐVĐX sửa hồ sơ. Khi sửa KĐT, giữ BM-17 đã duyệt và số lần họp của giai đoạn KĐT.

Tuyến Tập đoàn: VHT rà soát nội bộ và ký trình; Tập đoàn thực hiện thẩm định/phê duyệt. Hồ sơ bị trả tại Tập đoàn quay về ĐVĐX tại bước 63 để hoàn thiện và ký trình lại.

Hồ sơ Mật bắt buộc ký bản cứng. Hồ sơ không Mật được chọn VOffice hoặc bản cứng. Các bước 72–75 áp dụng tại mỗi bước ký, giữ đúng người ký và thứ tự trong luồng chính.

VOffice trả trạng thái/PDF tự động; người phụ trách cập nhật trạng thái/scan/ý kiến đối với bản cứng. Đủ kết quả mới tiếp tục xử lý Đồng ý/Không đồng ý tại bước chính.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Các bước giữ nguyên số trên sơ đồ. Điều kiện và giai đoạn hiện tại quyết định bước tiếp theo; mỗi hồ sơ đi theo nhánh xử lý tương ứng. Bước 72–75 là hình thức ký dùng chung tại các bước trình ký trong luồng chính.

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

Hồ sơ/biểu mẫu: Thông tin đầu vào BM-02; mức độ Mật.

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

## 13. Phân loại và xác định cấp phê duyệt

Tác nhân: Hệ thống ĐTMS.

Thực hiện: Theo loại tài sản, loại KĐT, lĩnh vực, mục đích và tổng vốn, áp dụng GUQ 1419, QT 8.6.5, HD 1971. Lưu riêng cấp duyệt chủ trương và KĐT; tính lại khi dữ liệu/quy tắc thay đổi.

Hồ sơ/biểu mẫu: Kết quả MS14; 02 cấp duyệt; căn cứ hiệu lực.

Luồng tiếp theo: Khoản đầu tư thuộc MS14 → Không thuộc MS14 → Chuyển quy trình MS13 / MS15 phù hợp.

Khoản đầu tư thuộc MS14 → Thuộc MS14 → bước 15.

## 14. AI gợi ý thông tin cần chỉnh sửa

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐXMS kiểm tra và chỉnh sửa lại.

Hồ sơ/biểu mẫu: Kết quả kiểm tra định danh; nội dung cần chỉnh sửa.

Luồng tiếp theo: bước 10.

## 15. Hoàn thiện dự thảo KĐT

Tác nhân: Đơn vị đề xuất KĐT.

Thực hiện: Hoàn thiện dự thảo KĐT trên cơ sở tồn kho, báo giá và căn cứ liên quan. MS14 thực hiện chủ trương trước, phê duyệt KĐT sau.

Hồ sơ/biểu mẫu: BM-02; sau chủ trương: BM-04 và BM-05; checklist tương ứng.

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

Luồng tiếp theo: bước 33.

# Kiểm tra thẩm định giải trình và họp theo giai đoạn

## 18. AI gợi ý thông tin cần chỉnh sửa

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý thông tin NOT OK để Đơn vị ĐX KĐT kiểm tra và chỉnh sửa lại.

Hồ sơ/biểu mẫu: Kết quả kiểm tra hồ sơ; nội dung cần chỉnh sửa.

Luồng tiếp theo: bước 19.

## 19. Bổ sung và hoàn chỉnh hồ sơ

Tác nhân: Đơn vị đề xuất.

Thực hiện: Bổ sung hồ sơ theo yêu cầu; giữ giai đoạn và số lần họp. Chuyển đúng bước chọn lại CQCM chủ trương BM-02 hoặc KĐT BM-04.

Hồ sơ/biểu mẫu: BM-02 hoặc BM-04/BM-05 đã sửa; checklist; tài liệu.

Luồng tiếp theo: Đã sửa hồ sơ → Hồ sơ cần sửa thuộc giai đoạn nào → BM-02: chọn lại CQCM chủ trương → bước 35.

Đã sửa hồ sơ → Hồ sơ cần sửa thuộc giai đoạn nào → BM-04: chọn lại CQCM KĐT → bước 48.

## 20. Thẩm định nội dung hồ sơ

Tác nhân: CQCM chủ trì / phối hợp.

Thực hiện: Rà soát pháp lý, nhu cầu, quy mô, vốn và nội dung của giai đoạn hiện tại; KĐT kiểm tra chủ trương BM-17. Cấp Tập đoàn: rà soát nội bộ VHT, không ký thẩm định.

Hồ sơ/biểu mẫu: BM-02 hoặc BM-04/BM-05; checklist; căn cứ.

Luồng tiếp theo: Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc giai đoạn nào → BM-02: chủ trương → bước 40.

Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc giai đoạn nào → BM-04: KĐT → bước 52.

Cần ý kiến CQCM liên quan → Không → Cần sửa đổi hoặc giải trình → Có → bước 24.

Cần ý kiến CQCM liên quan → Cần lấy ý kiến CQCM → Cấp VHT, phát hành công văn → bước 21.

Cần ý kiến CQCM liên quan → Cần lấy ý kiến CQCM → Cấp Tập đoàn, lấy ý kiến→ bước 22.

## 21. Ký và gửi công văn phối hợp thẩm định

Tác nhân: TTMS / người có thẩm quyền ký công văn.

Thực hiện: Chỉ cấp VHT: tùy chọn công văn phân công CQCM, nội dung thẩm định; ký và gửi. Không phát hành vẫn lấy ý kiến CQCM.

Hồ sơ/biểu mẫu: BM-07 (chủ trương) / BM-08 (KĐT); hồ sơ.

Luồng tiếp theo: Công văn đã ký → bước 22.

## 22. AI gợi ý phản hồi

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý đưa ý kiến.

Hồ sơ/biểu mẫu: Ý kiến thẩm định dự thảo.

Luồng tiếp theo: bước 23.

## 23. Thẩm định và gửi ý kiến chuyên môn

Tác nhân: CQCM phối hợp.

Thực hiện: Thẩm định theo chức năng. Cấp VHT: ký ý kiến theo thành phần áp dụng. Cấp Tập đoàn: VHT rà soát nội bộ, không ký thẩm định.

Hồ sơ/biểu mẫu: BM-09 (chủ trương) / BM-10 (KĐT); ý kiến nội bộ.

Luồng tiếp theo: Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc giai đoạn nào → BM-02: chủ trương → bước 40.

Cần sửa đổi hoặc giải trình → Không cần sửa / đã thống nhất → Hồ sơ đã thống nhất thuộc giai đoạn nào → BM-04: KĐT → bước 52.

Cần sửa đổi hoặc giải trình → Có → bước 24.

## 24. AI gợi ý nội dung cần chỉnh sửa

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tổng hợp/gợi ý cần sửa đổi giải trình.

Hồ sơ/biểu mẫu: Ý kiến CQCM; nội dung cần sửa / giải trình.

Luồng tiếp theo: Rà soát và xử lý → bước 25.

## 25. Bổ sung hồ sơ hoặc giải trình

Tác nhân: Đơn vị đề xuất.

Thực hiện: Làm rõ nội dung CQCM yêu cầu.

Hồ sơ/biểu mẫu: Văn bản giải trình.

Luồng tiếp theo: Đã thống nhất nội dung → Đã thống nhất → bước 20.

Đã thống nhất nội dung → Chưa thống nhất → Đã họp \< 02 lần → Có: lần 1 hoặc lần 2 → bước 26.

Đã thống nhất nội dung → Chưa thống nhất → Đã họp \< 02 lần → Không: đã đủ 02 lần → bước 31.

## 26. Họp thống nhất giải trình ĐVĐX – CQCM

Tác nhân: CQCM chủ trì.

Thực hiện: Họp ĐVĐX và CQCM xử lý nội dung chưa thống nhất. Trong phạm vi sơ đồ này, mỗi giai đoạn áp dụng tối đa 02 lần; thống nhất sớm thì tiếp tục. Không tính họp HĐĐT vào giới hạn này.

Hồ sơ/biểu mẫu: Biên bản họp; kết luận; ý kiến bảo lưu.

Luồng tiếp theo: bước 27.

## 27. Ghi nhận lần họp và kết quả

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Sau cuộc họp hoàn tất, tăng bộ đếm giai đoạn hiện tại thêm 1, lưu biên bản. Đếm riêng BM-02 và BM-04; không đặt lại khi sửa, không cho họp lần thứ 3.

Hồ sơ/biểu mẫu: Biên bản; bộ đếm họp chủ trương / bộ đếm họp KĐT.

Luồng tiếp theo: Sau họp đã thống nhất → Chưa thống nhất → Đã họp \< 02 lần → Có: lần 1 hoặc lần 2 → bước 26.

Sau họp đã thống nhất → Chưa thống nhất → Đã họp \< 02 lần → Không: đã đủ 02 lần → bước 31.

Sau họp đã thống nhất → Đã thống nhất → bước 28.

## 28. Chuyên quản xác nhận sau họp

Tác nhân: Chuyên quản ĐVĐX.

Thực hiện: Rà soát và xác nhận nội dung điều chỉnh đã thống nhất sau họp, trước khi cho phép sửa thông tin hồ sơ.

Hồ sơ/biểu mẫu: Biên bản họp; nội dung điều chỉnh; xác nhận chuyên quản.

Luồng tiếp theo: bước 29.

## 29. Chỉ huy đơn vị xác nhận sau họp

Tác nhân: Chỉ huy ĐVĐX.

Thực hiện: Duyệt lại nội dung điều chỉnh sau họp. Chỉ cho phép ĐVĐX cập nhật và trình ký khi đã có đủ xác nhận.

Hồ sơ/biểu mẫu: Biên bản họp; nội dung điều chỉnh; xác nhận Chỉ huy.

Luồng tiếp theo: bước 30.

## 30. Cập nhật hồ sơ theo nội dung đã xác nhận

Tác nhân: Đơn vị đề xuất.

Thực hiện: Sửa thông tin theo nội dung Chuyên quản và Chỉ huy đơn vị đã xác nhận; chuyển rà soát lại để trình ký.

Hồ sơ/biểu mẫu: Hồ sơ đã cập nhật; nội dung đã được xác nhận.

Luồng tiếp theo: bước 20.

## 31. Báo cáo nội dung chưa thống nhất

Tác nhân: CQCM chủ trì / phối hợp.

Thực hiện: CQCM chủ trì báo cáo người có thẩm quyền.

Hồ sơ/biểu mẫu: Báo cáo nội dung chưa thống nhất; hồ sơ liên quan.

Luồng tiếp theo: bước 32.

## 32. Xem xét, kết luận nội dung chưa thống nhất

Tác nhân: Người có thẩm quyền xử lý tại VHT.

Thực hiện: Kết luận xử lý nội dung còn vướng của giai đoạn rà soát VHT: tiếp tục bổ sung, giải trình hoặc dừng. Đây không phải phê duyệt thay Tập đoàn.

Hồ sơ/biểu mẫu: Báo cáo nội dung chưa thống nhất; hồ sơ liên quan.

Luồng tiếp theo: Kết luận xử lý nội dung chưa thống nhất → Chỉ đạo dừng → Kết luận để xử lý tiếp.

Kết luận xử lý nội dung chưa thống nhất → Bổ sung / giải trình → bước 25.

# Lập và phê duyệt chủ trương BM-02

## 33. Lập và hoàn thiện tờ trình chủ trương

Tác nhân: Đơn vị đề xuất.

Thực hiện: Mục tiêu, sự cần thiết, tổng vốn dự kiến, nguồn vốn, thời gian; trao đổi CQCM trước trình.

Hồ sơ/biểu mẫu: BM-02; Checklist 03; tài liệu chủ trương.

Luồng tiếp theo: bước 34.

## 34. Kiểm tra hồ sơ trước trình

Tác nhân: Đơn vị đề xuất.

Thực hiện: Đầu mối kiểm tra độc lập của đơn vị; không xóa dòng checklist khi thiếu tài liệu.

Hồ sơ/biểu mẫu: Checklist 03.

Luồng tiếp theo: bước 35.

## 35. Chọn CQCM thẩm định chủ trương

Tác nhân: Đơn vị đề xuất.

Thực hiện: Chọn danh sách CQCM tại khâu kiểm tra hồ sơ trước khi trình; hệ thống không tự cố định danh sách. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.

Hồ sơ/biểu mẫu: BM-02; Checklist 03.

Luồng tiếp theo: bước 36.

## 36. Xác nhận danh sách CQCM BM-02

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.

Hồ sơ/biểu mẫu: Danh sách CQCM BM-02; kết quả xác nhận.

Luồng tiếp theo: Đã xác nhận → DS CQCM BM-02 được duyệt → Đồng ý → bước 37.

Đã xác nhận → DS CQCM BM-02 được duyệt → Không đồng ý: chọn lại → bước 35.

## 37. Ký và trình hồ sơ chủ trương

Tác nhân: Chỉ huy ĐVĐX.

Thực hiện: Ký hồ sơ đại diện ĐVĐX; gửi CQCM chủ trì, cấp phó phụ trách nếu có. Nếu không đồng ý ký, trả ĐVĐX hoàn thiện.

Hồ sơ/biểu mẫu: BM-02; Checklist 03; văn bản giải trình.

Luồng tiếp theo:

Kết quả ký → Chỉ huy đồng ý ký → bước 38.

Kết quả ký → Chỉ huy không đồng ý ký, quay lại sửa đổi → bước 33.

## 38. HT/AI kiểm tra trước khi gửi

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Kiểm tra đầy đủ, hợp lệ trước khi gửi. Đạt: mở vòng BM-02. Không đạt: trả ĐVĐX hoàn thiện và kiểm tra lại.

Hồ sơ/biểu mẫu: BM-02; Checklist 03; kết quả AI.

Luồng tiếp theo: AI kiểm tra đạt → Đạt → bước 39.

AI kiểm tra đạt → Không đạt: sửa hồ sơ → bước 33.

## 39. Mở vòng thẩm định chủ trương BM-02

Tác nhân: Hệ thống ĐTMS.

Thực hiện: Gắn giai đoạn chủ trương; tạo bộ đếm họp chủ trương = 0 lần đầu. Giữ số lần đã họp khi sửa/trình lại; dùng khối kiểm tra, giải trình, họp chung.

Hồ sơ/biểu mẫu: BM-02; Checklist 03; bộ đếm họp chủ trương.

Luồng tiếp theo: Vòng BM-02 → Hồ sơ đủ điều kiện thẩm định → Đủ điều kiện → bước 20.

Vòng BM-02 → Hồ sơ đủ điều kiện thẩm định → Chưa đủ điều kiện → bước 18.

## 40. Thẩm định và hoàn chỉnh hồ sơ chủ trương

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra căn cứ, mục tiêu, sự cần thiết, vốn dự kiến, nguồn vốn và thời gian; phối hợp ĐVĐX giải trình, hoàn thiện hồ sơ. Cấp Tập đoàn: chỉ thẩm định nội bộ, không ký thẩm định tại VHT.

Hồ sơ/biểu mẫu: BM-02; Checklist 03; BM-09 / ý kiến nội bộ.

Luồng tiếp theo: Chủ trương thuộc cấp duyệt nào đã xác định → Cấp VHT → bước 41.

Chủ trương thuộc cấp duyệt nào đã xác định → Cấp Tập đoàn – chủ trương → bước 57.

## 41. Chuẩn bị hồ sơ tham mưu HĐĐT VHT

Tác nhân: TTMS.

Thực hiện: Gửi hồ sơ đã thẩm định đến thành viên HĐĐT; soạn phiếu trình ý kiến Hội đồng, ghi đủ ý kiến bảo lưu.

Hồ sơ/biểu mẫu: BM-02; BM-09; dự thảo BM-11.

Luồng tiếp theo: bước 42.

## 42. Xem xét độc lập và ký ý kiến HĐĐT

Tác nhân: HĐĐT VHT.

Thực hiện: Xem xét hồ sơ chủ trương; ký ý kiến đủ/chưa đủ điều kiện, ghi ý kiến bảo lưu. Không tính vào 02 lần họp phối hợp.

Hồ sơ/biểu mẫu: BM-11; BM-02; ý kiến CQCM.

Luồng tiếp theo:

HĐĐT: đủ điều kiện → bước 43.

HĐĐT: không đủ điều kiện → bước 33.

## 43. Ký báo cáo thẩm định chủ trương; dự thảo quyết định

Tác nhân: TTMS; Phó TGĐ/Phó GĐ phụ trách (nếu có).

Thực hiện: Sau HĐĐT đủ điều kiện, lập và ký BM-13 đúng thành phần; soạn dự thảo BM-17 trình TGĐ VHT. Cơ quan chủ trì không ký quyết định.

Hồ sơ/biểu mẫu: BM-13; dự thảo BM-17; BM-11; BM-02.

Luồng tiếp theo:

BM-13 được thông qua → bước 44.

BM-13 không được thông qua → bước 33.

## 44. Ký ban hành quyết định chủ trương cấp VHT

Tác nhân: TGĐ VHT.

Thực hiện: Xem BM-13 đã ký, ý kiến HĐĐT và hồ sơ; ký ban hành BM-17 theo thẩm quyền VHT.

Hồ sơ/biểu mẫu: BM-02; BM-11; BM-13; BM-17.

Luồng tiếp theo: Đồng ý phê duyệt chủ trương → Không đồng ý → Ý kiến chỉ đạo xử lý → Chỉ đạo dừng → Kết luận để xử lý tiếp.

Đồng ý phê duyệt chủ trương → Không đồng ý → Ý kiến chỉ đạo xử lý → bước 33.

Đồng ý phê duyệt chủ trương → Đồng ý → bước 45.

# Lập và phê duyệt khoản đầu tư BM-04

## 45. AI gợi ý thông tin lập hồ sơ phê duyệt KĐT

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: Từ BM-17 đã duyệt và căn cứ liên quan, AI hỗ trợ dự thảo tờ trình BM-04 và báo cáo đề xuất đầu tư BM-05 để ĐVĐX rà soát.

Hồ sơ/biểu mẫu: BM-04; BM-05; Checklist 04; BM-17.

Luồng tiếp theo: bước 46.

## 46. Lập hồ sơ phê duyệt KĐT

Tác nhân: Đơn vị đề xuất.

Thực hiện: Rà soát AI, trao đổi CQCM, hoàn thiện tờ trình và báo cáo đề xuất đầu tư. Khi sửa KĐT, giữ BM-17 và số lần họp BM-04.

Hồ sơ/biểu mẫu: BM-04; BM-05; Checklist 04; BM-17.

Luồng tiếp theo: bước 47.

## 47. Kiểm tra hồ sơ KĐT trước trình

Tác nhân: Đầu mối kiểm tra độc lập ĐVĐX.

Thực hiện: Kiểm tra đầy đủ, hợp lệ theo Checklist 04; hoàn thiện hồ sơ trước khi chọn CQCM và Chỉ huy ĐVĐX ký trình.

Hồ sơ/biểu mẫu: BM-04; BM-05; Checklist 04; BM-17.

Luồng tiếp theo: bước 48.

## 48. Lựa chọn CQCM thẩm định KĐT

Tác nhân: Đơn vị đề xuất.

Thực hiện: Sau khi kiểm tra hồ sơ, chủ động chọn danh sách CQCM thẩm định. Luồng xử lý tiếp theo áp dụng tương tự khâu dự thảo. KHCN / Quốc phòng: ĐVĐX chủ động chỉ định CQCM và đơn vị chủ trì theo tính chất KĐT.

Hồ sơ/biểu mẫu: BM-04; Checklist 04.

Luồng tiếp theo: bước 49.

## 49. Xác nhận danh sách CQCM BM-04

Tác nhân: CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra danh sách do ĐVĐX chọn theo chức năng và nội dung hồ sơ; xác nhận Đồng ý hoặc Không đồng ý, ghi lý do để ĐVĐX chọn lại.

Hồ sơ/biểu mẫu: Danh sách CQCM BM-04; kết quả xác nhận.

Luồng tiếp theo: Đã xác nhận → DS CQCM BM-04 được duyệt → Không đồng ý: chọn lại → bước 48.

Đã xác nhận → DS CQCM BM-04 được duyệt → Đồng ý → bước 50.

## 50. Ký và trình hồ sơ phê duyệt KĐT

Tác nhân: Chỉ huy ĐVĐX.

Thực hiện: Ký BM-04 kèm BM-05 và Checklist 04 trước thẩm định, áp dụng cả cấp VHT và Tập đoàn. Không đồng ý: trả ĐVĐX sửa hồ sơ.

Hồ sơ/biểu mẫu: BM-04; BM-05; Checklist 04; giải trình nếu có.

Luồng tiếp theo: Kết quả ký → Chỉ huy đồng ý ký hồ sơ KĐT → Đồng ý / đã ký → bước 51.

Kết quả ký → Chỉ huy đồng ý ký hồ sơ KĐT → Không đồng ý: sửa KĐT → bước 46.

## 51. Mở vòng thẩm định KĐT BM-04

Tác nhân: Hệ thống ĐTMS.

Thực hiện: Sau BM-17 đã duyệt, gắn giai đoạn KĐT; tạo bộ đếm họp KĐT = 0 lần đầu. Độc lập với BM-02; giữ số lần khi sửa/trình lại.

Hồ sơ/biểu mẫu: BM-04; BM-05; Checklist 04; BM-17; bộ đếm.

Luồng tiếp theo: Vòng BM-04 → Hồ sơ đủ điều kiện thẩm định → Đủ điều kiện → bước 20.

Vòng BM-04 → Hồ sơ đủ điều kiện thẩm định → Chưa đủ điều kiện → bước 18.

## 52. Thẩm định hồ sơ KĐT tại VHT

Tác nhân: TTMS / CQCM chủ trì thẩm định tại VHT.

Thực hiện: Kiểm tra căn cứ, mục tiêu, nhu cầu, phạm vi, tổng vốn, nguồn vốn và nội dung hồ sơ; phối hợp ĐVĐX giải trình, hoàn thiện. Nhánh Tập đoàn không ký thẩm định tại VHT.

Hồ sơ/biểu mẫu: BM-04; BM-05; Checklist 04; BM-17; BM-10 / ý kiến nội bộ.

Luồng tiếp theo: KĐT thuộc cấp duyệt nào đã xác định → Cấp VHT → bước 53.

KĐT thuộc cấp duyệt nào đã xác định → Cấp Tập đoàn – KĐT → bước 57.

## 53. Ký báo cáo thẩm định và soạn dự thảo quyết định

Tác nhân: TTMS; CQCM tham gia; Phó TGĐ/Phó GĐ phụ trách (nếu có).

Thực hiện: Tổng hợp, lập và ký BM-15 theo đủ thành phần; soạn dự thảo BM-18 trình TGĐ VHT. TTMS không ký quyết định.

Hồ sơ/biểu mẫu: BM-15; dự thảo BM-18; BM-04/BM-05.

Luồng tiếp theo: Báo cáo thẩm định được thông qua → Thông qua → bước 56.

Báo cáo thẩm định được thông qua → Không thông qua → bước 54.

## 54. AI tóm tắt phản hồi và gợi ý điều chỉnh

Tác nhân: Hệ thống ĐTMS/Tích hợp/ AI.

Thực hiện: AI tóm tắt phản hồi và gợi ý điều chỉnh cho ĐVĐX.

Hồ sơ/biểu mẫu: Không có mẫu riêng; hồ sơ / kết quả tại bước này.

Luồng tiếp theo: bước 55.

## 55. Hoàn chỉnh hồ sơ theo hướng dẫn

Tác nhân: Đơn vị đề xuất.

Thực hiện: Tiếp tục hoàn chỉnh hoặc thực hiện hướng dẫn của CQCM chủ trì.

Hồ sơ/biểu mẫu: Hồ sơ; giải trình.

Luồng tiếp theo: Hoàn chỉnh → bước 46.

## 56. Ký ban hành quyết định phê duyệt KĐT cấp VHT

Tác nhân: TGĐ VHT.

Thực hiện: Xem hồ sơ và BM-15 đã được ký đúng thành phần; ký ban hành BM-18 thuộc thẩm quyền VHT.

Hồ sơ/biểu mẫu: BM-04; BM-05; BM-15; BM-18.

Luồng tiếp theo: Đồng ý phê duyệt KĐT → Đồng ý → Quyết định phê duyệt KĐT.

Đồng ý phê duyệt KĐT → Không đồng ý → Chỉ đạo sau từ chối → bước 46.

Đồng ý phê duyệt KĐT → Không đồng ý → Chỉ đạo sau từ chối → Dừng KĐT theo chỉ đạo; giữ chủ trương đã duyệt.

# Trình thẩm định và phê duyệt cấp Tập đoàn

## 57. AI hỗ trợ dự thảo công văn trình Tập đoàn

Tác nhân: Hệ thống ĐTMS / AI.

Thực hiện: Từ hồ sơ thuộc thẩm quyền Tập đoàn, AI hỗ trợ soạn công văn và tập hợp dự thảo; ĐVĐX rà soát trước trình.

Hồ sơ/biểu mẫu: Công văn; BM-02 hoặc BM-04/BM-05; tài liệu.

Luồng tiếp theo: bước 58.

## 58. Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn

Tác nhân: Đơn vị đề xuất VHT.

Thực hiện: Rà soát dự thảo công văn, căn cứ và hồ sơ đã thẩm định nội bộ; hoàn thiện bộ tài liệu để TGĐ VHT ký công văn trình lần đầu. Giai đoạn thẩm định tại VHT không ký.

Hồ sơ/biểu mẫu: Công văn; BM-02 hoặc BM-04/BM-05; checklist; căn cứ.

Luồng tiếp theo: bước 59.

## 59. Ký công văn trình hồ sơ lên Tập đoàn

Tác nhân: TGĐ VHT.

Thực hiện: Xem xét và ký công văn kèm dự thảo hồ sơ đề nghị Tập đoàn xử lý theo thẩm quyền. Đây là ký trình hồ sơ, không phải VHT phê duyệt thay Tập đoàn.

Hồ sơ/biểu mẫu: Công văn đã ký; BM-02 hoặc BM-04/BM-05.

Luồng tiếp theo: Đồng ý ký công văn trình → Đồng ý → bước 60.

Đồng ý ký công văn trình → Không đồng ý – hoàn thiện công văn → bước 58.

## 60. Chuyển hồ sơ đã ký lên Tập đoàn

Tác nhân: Hệ thống ĐTMS / Tích hợp VOffice.

Thực hiện: Chuyển hồ sơ đã ký tới Tập đoàn qua tích hợp. Bản cứng: ghi nhận chuyển hồ sơ giấy, dùng trạng thái/scan đã cập nhật trong khối KÝ CHUNG.

Hồ sơ/biểu mẫu: Công văn đã ký; hồ sơ gửi; trạng thái/PDF hoặc scan.

Luồng tiếp theo: Phát hành công văn phối hợp → bước 61.

Phát hành công văn phối hợp → bước 62.

## 61. Ký và gửi công văn phối hợp thẩm định

Tác nhân: Ban ĐTXD / người có thẩm quyền ký công văn.

Thực hiện: Theo lựa chọn, phân công CQCM và nội dung thẩm định; ký và gửi công văn. Không phát hành công văn vẫn lấy ý kiến các Ban.

Hồ sơ/biểu mẫu: BM-07 (chủ trương) / BM-08 (KĐT); hồ sơ.

Luồng tiếp theo: Công văn đã ký → bước 62.

## 62. Thẩm định và gửi phiếu nhận xét về VHT

Tác nhân: Các Ban chuyên môn Tập đoàn.

Thực hiện: Xem xét hồ sơ theo chức năng, lập và gửi phiếu/văn bản nhận xét để ĐVĐX thuộc VHT tiếp thu, bổ sung, giải trình. Chủ trương dùng BM-09; KĐT dùng BM-10.

Hồ sơ/biểu mẫu: BM-09 / BM-10; hồ sơ trình Tập đoàn.

Luồng tiếp theo: bước 63.

## 63. Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại

Tác nhân: Đơn vị đề xuất VHT.

Thực hiện: Trực tiếp tiếp thu ý kiến Tập đoàn, sửa hồ sơ, lập văn bản giải trình và phiếu trình. Hồ sơ bị trả ở bước sau cũng về đây; giữ giai đoạn, BM-17 đã duyệt nếu là KĐT.

Hồ sơ/biểu mẫu: Văn bản giải trình; BM-06 (Phiếu trình giải quyết công việc); hồ sơ.

Luồng tiếp theo: bước 64.

## 64. Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn

Tác nhân: TGĐ VHT / lãnh đạo được ủy quyền.

Thực hiện: Ký trình lại văn bản giải trình, BM-06 và bộ hồ sơ đã hoàn thiện; gửi trực tiếp Tập đoàn. Chủ trương do TGĐ VHT ký; KĐT có thể do lãnh đạo được ủy quyền ký.

Hồ sơ/biểu mẫu: BM-06; văn bản giải trình; BM-02 hoặc BM-04/BM-05.

Luồng tiếp theo: bước 65.

## 65. Tiếp nhận và kiểm tra hồ sơ hoàn thiện

Tác nhân: Ban Đầu tư – Xây dựng Tập đoàn.

Thực hiện: Kiểm tra hồ sơ đã được VHT ký trình lại, việc tiếp thu và giải trình các ý kiến. Nếu chưa đủ điều kiện, trả trực tiếp ĐVĐX bổ sung và VHT ký trình lại.

Hồ sơ/biểu mẫu: BM-02 hoặc BM-04/BM-05; BM-06; giải trình; BM-09/BM-10.

Luồng tiếp theo: Hồ sơ hoàn thiện đạt yêu cầu → Chưa đạt / cần bổ sung → bước 63.

Hồ sơ hoàn thiện đạt yêu cầu → Đạt → Hồ sơ thuộc giai đoạn nào → Chủ trương – BM-02 → bước 66.

Hồ sơ hoàn thiện đạt yêu cầu → Đạt → Hồ sơ thuộc giai đoạn nào → KĐT – BM-04/BM-05 → bước 69.

## 66. Chuẩn bị hồ sơ tham mưu HĐĐT Tập đoàn

Tác nhân: Ban ĐTXD Tập đoàn.

Thực hiện: Gửi hồ sơ đã được CQCM thẩm định đến thành viên HĐĐT; soạn phiếu ý kiến, ghi đầy đủ ý kiến bảo lưu.

Hồ sơ/biểu mẫu: BM-02; BM-09; dự thảo BM-11.

Luồng tiếp theo: bước 67.

## 67. Xem xét độc lập và ký ý kiến HĐĐT

Tác nhân: HĐĐT Tập đoàn.

Thực hiện: Xem xét hồ sơ chủ trương; ký ý kiến đủ/chưa đủ điều kiện, ghi ý kiến bảo lưu. Không tính vào giới hạn họp phối hợp.

Hồ sơ/biểu mẫu: BM-11; BM-02; ý kiến CQCM.

Luồng tiếp theo:

HĐĐT: đủ điều kiện → bước 68.

HĐĐT: không đủ điều kiện → bước 63.

## 68. Ký báo cáo thẩm định chủ trương; dự thảo quyết định

Tác nhân: Ban ĐTXD; Phó TGĐ phụ trách (nếu có).

Thực hiện: Sau ý kiến HĐĐT đủ điều kiện, lập và ký BM-13 đúng thành phần; soạn dự thảo BM-17 trình TGĐ Tập đoàn.

Hồ sơ/biểu mẫu: BM-02; BM-11; BM-13; dự thảo BM-17.

Luồng tiếp theo:

Báo cáo được thông qua → bước 70.

Báo cáo không được thông qua → bước 63.

## 69. Ký báo cáo thẩm định KĐT; dự thảo quyết định

Tác nhân: Ban ĐTXD; CQCM tham gia; Phó TGĐ phụ trách (nếu có).

Thực hiện: Tổng hợp ý kiến, lập và ký BM-15 đúng thành phần; soạn dự thảo BM-18 trình TGĐ Tập đoàn. Cơ quan chủ trì không ký quyết định.

Hồ sơ/biểu mẫu: BM-04; BM-05; BM-15; dự thảo BM-18.

Luồng tiếp theo:

Báo cáo được thông qua → bước 70.

Báo cáo không được thông qua, sửa và trình ký lại → bước 63.

## 70. Ký phê duyệt hồ sơ cấp Tập đoàn

Tác nhân: TGĐ Tập đoàn.

Thực hiện: Chủ trương: xem BM-13 và ký BM-17. KĐT: xem BM-15 và ký BM-18. Thẩm quyền thuộc Tập đoàn; VHT chỉ ký trình.

Hồ sơ/biểu mẫu: BM-13 và BM-17 / BM-15 và BM-18.

Luồng tiếp theo:

Đồng ý phê duyệt hồ sơ → Không đồng ý / yêu cầu sửa → Chỉ đạo sau từ chối → bước 63.

Đồng ý phê duyệt hồ sơ → Không đồng ý / yêu cầu sửa → Chỉ đạo sau từ chối → Dừng giai đoạn hiện tại theo chỉ đạo Tập đoàn.

Đồng ý phê duyệt hồ sơ → Đồng ý / đã ký → bước 71.

## 71. Nhận kết quả phê duyệt và lưu hồ sơ

Tác nhân: Hệ thống ĐTMS / Tích hợp VOffice.

Thực hiện: Nhận trạng thái/PDF VOffice tự động; bản cứng dùng kết quả khối KÝ CHUNG. Lưu BM-17 để lập KĐT, hoặc BM-18 để kết thúc.

Hồ sơ/biểu mẫu: BM-17 / BM-18 đã ký; trạng thái; PDF/scan.

Luồng tiếp theo: Kết quả phê duyệt thuộc giai đoạn nào → Chủ trương đã duyệt → lập KĐT → bước 45.

Kết quả phê duyệt thuộc giai đoạn nào → KĐT đã duyệt → kết thúc → Hoàn tất phê duyệt cấp Tập đoàn.

# Xử lý hình thức ký dùng chung

## 72. Chọn hình thức ký

Tác nhân: Người trình hồ sơ.

Thực hiện: Chọn VOffice hoặc bản cứng cho hồ sơ không Mật. Hệ thống lưu hình thức ký của lần trình hiện tại.

Hồ sơ/biểu mẫu: Hồ sơ không Mật; hình thức ký.

Luồng tiếp theo: Chọn ký VOffice → Bản cứng → bước 74.

Chọn ký VOffice → VOffice → bước 73.

## 73. Trình và nhận kết quả ký VOffice

Tác nhân: Hệ thống ĐTMS / VOffice.

Thực hiện: API gửi hồ sơ và luồng tới VOffice. Người có thẩm quyền ký/duyệt. Webhook trả trạng thái và PDF đã ký; ĐTMS lưu kết quả tự động, không xác nhận thủ công.

Hồ sơ/biểu mẫu: Hồ sơ trình ký; trạng thái; PDF đã ký.

Luồng tiếp theo: Đã nhận callback → Đã ghi nhận kết quả ký → Đủ trạng thái / tài liệu theo kết quả → Trở về bước hiện tại: xử lý Đồng ý / Không đồng ý theo luồng chính.

## 74. Thực hiện ký bản cứng

Tác nhân: Người trình; người có thẩm quyền ký.

Thực hiện: In và trình bản cứng theo đúng người ký, thứ tự ký tại bước hiện tại. Hồ sơ Mật bắt buộc theo nhánh này; không gửi hồ sơ Mật qua VOffice.

Hồ sơ/biểu mẫu: Bộ hồ sơ bản cứng; văn bản ký / ý kiến xử lý.

Luồng tiếp theo: Đã xử lý ký → bước 75.

## 75. Cập nhật kết quả ký bản cứng

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

## 9. Hai giai đoạn chủ trương và KĐT

Đặc tả điều kiện mở hồ sơ BM-04/BM-05 chỉ sau khi có BM-17 đã phê duyệt. Mô tả liên kết BM-02, BM-13, BM-17 với BM-04/BM-05, BM-15, BM-18; thông tin kế thừa và tài liệu giữ nguyên khi KĐT bị trả sửa. Quản lý riêng danh sách CQCM, hồ sơ và bộ đếm hai giai đoạn; BM-18 đã phê duyệt là kết quả hoàn tất KĐT.

## 10. Ý kiến tham mưu Hội đồng đầu tư

Đặc tả thành phần nhận hồ sơ chủ trương, cách ghi nhận/ký BM-11, ý kiến bảo lưu và kết quả đủ/chưa đủ điều kiện tại cấp VHT hoặc Tập đoàn. Mô tả điều kiện chuyển sang báo cáo thẩm định BM-13 hoặc quay lại bổ sung theo sơ đồ. Hoạt động HĐĐT được ghi nhận riêng, không cộng vào giới hạn họp phối hợp ĐVĐX–CQCM.

# E. PHỤ LỤC TÓM TẮT CÁC BƯỚC

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu** |
|:--:|:---|:---|:---|
| 1 | Chọn căn cứ và nội dung KĐT | Đơn vị đề xuất KĐT | Không có mẫu riêng; Tài liệu đầu vào |
| 2 | Lấy dữ liệu căn cứ đã phê duyệt | Hệ thống ĐTMS/Tích hợp/ AI | Không có |
| 3 | AI gợi ý thông tin cơ bản KĐT | Hệ thống ĐTMS/Tích hợp/ AI | Không có |
| 4 | Rà soát và xác nhận thông tin cơ bản | Đơn vị đề xuất mua sắm | Thông tin đầu vào BM-02; mức độ Mật |
| 5 | Chọn/bóc tách căn cứ KĐT | Đơn vị đề xuất KĐT | Không có |
| 6 | Kiểm tra tồn kho | Hệ thống ĐTMS / AI | Không có; dữ liệu Dự toán/eBOM/mBOM/Quản lý kho |
| 7 | Nhận thông tin rà soát tồn kho khả dụng | Đơn vị đề xuất KĐT | Kết quả rà soát tồn kho theo Quy định QLTS |
| 8 | Khởi tạo / chỉnh sửa yêu cầu báo giá | Đơn vị đề xuất KĐT | Yêu cầu báo giá theo Quy định TTMS |
| 9 | Gửi yêu cầu báo giá | Hệ thống ĐTMS/Tích hợp/ AI | Yêu cầu báo giá theo Quy định |
| 10 | Tổng hợp và kiểm tra báo giá | Đơn vị đề xuất KĐT | Báo giá/Kết quả lấy báo giá |
| 11 | Xác nhận hình thành TSCĐ | Ban Tài chính | Kết quả xác nhận TSCĐ; hồ sơ KĐT |
| 12 | Xác nhận 04 yếu tố định danh | TTMS | Thông tin định danh KĐT |
| 13 | Phân loại và xác định cấp phê duyệt | Hệ thống ĐTMS | Kết quả MS14; 02 cấp duyệt; căn cứ hiệu lực |
| 14 | AI gợi ý thông tin cần chỉnh sửa | Hệ thống ĐTMS/Tích hợp/ AI | Kết quả kiểm tra định danh; nội dung cần chỉnh sửa |
| 15 | Hoàn thiện dự thảo KĐT | Đơn vị đề xuất KĐT | BM-02; sau chủ trương: BM-04 và BM-05; checklist tương ứng |
| 16 | AI hỗ trợ soạn nội dung, thông tin trong đề xuất KĐT | Hệ thống ĐTMS / AI | Đề xuất KĐT; dữ liệu căn cứ |
| 17 | Rà soát, bổ sung và hoàn thiện đề xuất | Đơn vị đề xuất | Đề xuất KĐT đã rà soát |
| 18 | AI gợi ý thông tin cần chỉnh sửa | Hệ thống ĐTMS/Tích hợp/ AI | Kết quả kiểm tra hồ sơ; nội dung cần chỉnh sửa |
| 19 | Bổ sung và hoàn chỉnh hồ sơ | Đơn vị đề xuất | BM-02 hoặc BM-04/BM-05 đã sửa; checklist; tài liệu |
| 20 | Thẩm định nội dung hồ sơ | CQCM chủ trì / phối hợp | BM-02 hoặc BM-04/BM-05; checklist; căn cứ |
| 21 | Ký và gửi công văn phối hợp thẩm định | TTMS / người có thẩm quyền ký công văn | BM-07 (chủ trương) / BM-08 (KĐT); hồ sơ |
| 22 | AI gợi ý phản hồi | Hệ thống ĐTMS/Tích hợp/ AI | Ý kiến thẩm định dự thảo |
| 23 | Thẩm định và gửi ý kiến chuyên môn | CQCM phối hợp | BM-09 (chủ trương) / BM-10 (KĐT); ý kiến nội bộ |
| 24 | AI gợi ý nội dung cần chỉnh sửa | Hệ thống ĐTMS/Tích hợp/ AI | Ý kiến CQCM; nội dung cần sửa / giải trình |
| 25 | Bổ sung hồ sơ hoặc giải trình | Đơn vị đề xuất | Văn bản giải trình |
| 26 | Họp thống nhất giải trình ĐVĐX – CQCM | CQCM chủ trì | Biên bản họp; kết luận; ý kiến bảo lưu |
| 27 | Ghi nhận lần họp và kết quả | Hệ thống ĐTMS / AI | Biên bản; bộ đếm họp chủ trương / bộ đếm họp KĐT |
| 28 | Chuyên quản xác nhận sau họp | Chuyên quản ĐVĐX | Biên bản họp; nội dung điều chỉnh; xác nhận chuyên quản |
| 29 | Chỉ huy đơn vị xác nhận sau họp | Chỉ huy ĐVĐX | Biên bản họp; nội dung điều chỉnh; xác nhận Chỉ huy |
| 30 | Cập nhật hồ sơ theo nội dung đã xác nhận | Đơn vị đề xuất | Hồ sơ đã cập nhật; nội dung đã được xác nhận |
| 31 | Báo cáo nội dung chưa thống nhất | CQCM chủ trì / phối hợp | Báo cáo nội dung chưa thống nhất; hồ sơ liên quan |
| 32 | Xem xét, kết luận nội dung chưa thống nhất | Người có thẩm quyền xử lý tại VHT | Báo cáo nội dung chưa thống nhất; hồ sơ liên quan |
| 33 | Lập và hoàn thiện tờ trình chủ trương | Đơn vị đề xuất | BM-02; Checklist 03; tài liệu chủ trương |
| 34 | Kiểm tra hồ sơ trước trình | Đơn vị đề xuất | Checklist 03 |
| 35 | Chọn CQCM thẩm định chủ trương | Đơn vị đề xuất | BM-02; Checklist 03 |
| 36 | Xác nhận danh sách CQCM BM-02 | CQCM chủ trì thẩm định tại VHT | Danh sách CQCM BM-02; kết quả xác nhận |
| 37 | Ký và trình hồ sơ chủ trương | Chỉ huy ĐVĐX | BM-02; Checklist 03; văn bản giải trình |
| 38 | HT/AI kiểm tra trước khi gửi | Hệ thống ĐTMS / AI | BM-02; Checklist 03; kết quả AI |
| 39 | Mở vòng thẩm định chủ trương BM-02 | Hệ thống ĐTMS | BM-02; Checklist 03; bộ đếm họp chủ trương |
| 40 | Thẩm định và hoàn chỉnh hồ sơ chủ trương | CQCM chủ trì thẩm định tại VHT | BM-02; Checklist 03; BM-09 / ý kiến nội bộ |
| 41 | Chuẩn bị hồ sơ tham mưu HĐĐT VHT | TTMS | BM-02; BM-09; dự thảo BM-11 |
| 42 | Xem xét độc lập và ký ý kiến HĐĐT | HĐĐT VHT | BM-11; BM-02; ý kiến CQCM |
| 43 | Ký báo cáo thẩm định chủ trương; dự thảo quyết định | TTMS; Phó TGĐ/Phó GĐ phụ trách (nếu có) | BM-13; dự thảo BM-17; BM-11; BM-02 |
| 44 | Ký ban hành quyết định chủ trương cấp VHT | TGĐ VHT | BM-02; BM-11; BM-13; BM-17 |
| 45 | AI gợi ý thông tin lập hồ sơ phê duyệt KĐT | Hệ thống ĐTMS/Tích hợp/ AI | BM-04; BM-05; Checklist 04; BM-17 |
| 46 | Lập hồ sơ phê duyệt KĐT | Đơn vị đề xuất | BM-04; BM-05; Checklist 04; BM-17 |
| 47 | Kiểm tra hồ sơ KĐT trước trình | Đầu mối kiểm tra độc lập ĐVĐX | BM-04; BM-05; Checklist 04; BM-17 |
| 48 | Lựa chọn CQCM thẩm định KĐT | Đơn vị đề xuất | BM-04; Checklist 04 |
| 49 | Xác nhận danh sách CQCM BM-04 | CQCM chủ trì thẩm định tại VHT | Danh sách CQCM BM-04; kết quả xác nhận |
| 50 | Ký và trình hồ sơ phê duyệt KĐT | Chỉ huy ĐVĐX | BM-04; BM-05; Checklist 04; giải trình nếu có |
| 51 | Mở vòng thẩm định KĐT BM-04 | Hệ thống ĐTMS | BM-04; BM-05; Checklist 04; BM-17; bộ đếm |
| 52 | Thẩm định hồ sơ KĐT tại VHT | TTMS / CQCM chủ trì thẩm định tại VHT | BM-04; BM-05; Checklist 04; BM-17; BM-10 / ý kiến nội bộ |
| 53 | Ký báo cáo thẩm định và soạn dự thảo quyết định | TTMS; CQCM tham gia; Phó TGĐ/Phó GĐ phụ trách (nếu có) | BM-15; dự thảo BM-18; BM-04/BM-05 |
| 54 | AI tóm tắt phản hồi và gợi ý điều chỉnh | Hệ thống ĐTMS/Tích hợp/ AI | Không có mẫu riêng; hồ sơ / kết quả tại bước này. |
| 55 | Hoàn chỉnh hồ sơ theo hướng dẫn | Đơn vị đề xuất | Hồ sơ; giải trình |
| 56 | Ký ban hành quyết định phê duyệt KĐT cấp VHT | TGĐ VHT | BM-04; BM-05; BM-15; BM-18 |
| 57 | AI hỗ trợ dự thảo công văn trình Tập đoàn | Hệ thống ĐTMS / AI | Công văn; BM-02 hoặc BM-04/BM-05; tài liệu |
| 58 | Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn | Đơn vị đề xuất VHT | Công văn; BM-02 hoặc BM-04/BM-05; checklist; căn cứ |
| 59 | Ký công văn trình hồ sơ lên Tập đoàn | TGĐ VHT | Công văn đã ký; BM-02 hoặc BM-04/BM-05 |
| 60 | Chuyển hồ sơ đã ký lên Tập đoàn | Hệ thống ĐTMS / Tích hợp VOffice | Công văn đã ký; hồ sơ gửi; trạng thái/PDF hoặc scan |
| 61 | Ký và gửi công văn phối hợp thẩm định | Ban ĐTXD / người có thẩm quyền ký công văn | BM-07 (chủ trương) / BM-08 (KĐT); hồ sơ |
| 62 | Thẩm định và gửi phiếu nhận xét về VHT | Các Ban chuyên môn Tập đoàn | BM-09 / BM-10; hồ sơ trình Tập đoàn |
| 63 | Tiếp thu nhận xét và hoàn thiện hồ sơ trình lại | Đơn vị đề xuất VHT | Văn bản giải trình; BM-06 (Phiếu trình giải quyết công việc); hồ sơ |
| 64 | Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn | TGĐ VHT / lãnh đạo được ủy quyền | BM-06; văn bản giải trình; BM-02 hoặc BM-04/BM-05 |
| 65 | Tiếp nhận và kiểm tra hồ sơ hoàn thiện | Ban Đầu tư – Xây dựng Tập đoàn | BM-02 hoặc BM-04/BM-05; BM-06; giải trình; BM-09/BM-10 |
| 66 | Chuẩn bị hồ sơ tham mưu HĐĐT Tập đoàn | Ban ĐTXD Tập đoàn | BM-02; BM-09; dự thảo BM-11 |
| 67 | Xem xét độc lập và ký ý kiến HĐĐT | HĐĐT Tập đoàn | BM-11; BM-02; ý kiến CQCM |
| 68 | Ký báo cáo thẩm định chủ trương; dự thảo quyết định | Ban ĐTXD; Phó TGĐ phụ trách (nếu có) | BM-02; BM-11; BM-13; dự thảo BM-17 |
| 69 | Ký báo cáo thẩm định KĐT; dự thảo quyết định | Ban ĐTXD; CQCM tham gia; Phó TGĐ phụ trách (nếu có) | BM-04; BM-05; BM-15; dự thảo BM-18 |
| 70 | Ký phê duyệt hồ sơ cấp Tập đoàn | TGĐ Tập đoàn | BM-13 và BM-17 / BM-15 và BM-18 |
| 71 | Nhận kết quả phê duyệt và lưu hồ sơ | Hệ thống ĐTMS / Tích hợp VOffice | BM-17 / BM-18 đã ký; trạng thái; PDF/scan |
| 72 | Chọn hình thức ký | Người trình hồ sơ | Hồ sơ không Mật; hình thức ký |
| 73 | Trình và nhận kết quả ký VOffice | Hệ thống ĐTMS / VOffice | Hồ sơ trình ký; trạng thái; PDF đã ký |
| 74 | Thực hiện ký bản cứng | Người trình; người có thẩm quyền ký | Bộ hồ sơ bản cứng; văn bản ký / ý kiến xử lý |
| 75 | Cập nhật kết quả ký bản cứng | Người phụ trách hồ sơ | Trạng thái; scan văn bản; ý kiến xử lý |
