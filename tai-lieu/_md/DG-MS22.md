<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS22.docx -->
<!-- pk-sha256: 861f57f75442b13209e8b4884b2aadddab683feedbfc8e40be6e74f8de913fc4 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS22 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS22.docx`. Trích dẫn thì ghi mã **DG-MS22** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS22 - THƯƠNG THẢO VÀ KÝ HỢP ĐỒNG**

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
| 06/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS22. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

**MỤC LỤC**

[**A. GIỚI THIỆU 5**](#_heading=)

> [1. Mục đích tài liệu 5](#_heading=)
>
> [2. Phạm vi áp dụng 5](#_heading=)
>
> [3. Tài liệu liên quan 5](#_heading=)
>
> [4. Thuật ngữ và các từ viết tắt 5](#_heading=)

[**B. TỔNG QUAN NGHIỆP VỤ 6**](#_heading=)

> [1. Mục tiêu 6](#_heading=)
>
> [2. Điều kiện/tiêu chí phân luồng 6](#_heading=)
>
> [3. Vai trò tham gia 6](#_heading=)
>
> [4. Danh mục biểu mẫu/hồ sơ 7](#_heading=)
>
> [5. Nguyên tắc xử lý chung 7](#_heading=)

[**C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ 8**](#_heading=)

> [1. Tiếp nhận thông tin và hồ sơ hợp đồng (Bước 1) 8](#_heading=)
>
> [2. Hoàn thiện phụ lục kỹ thuật và cập nhật mã hàng (Bước 2) 8](#_heading=)
>
> [3. Hoàn thiện body và phụ lục giá (Bước 3) 8](#_heading=)
>
> [4. Gửi dự thảo cùng phụ lục cho nhà thầu/nhà cung cấp để thương thảo (Bước 4) 9](#_heading=)
>
> [5. Kiểm tra thông tin trước phê duyệt (Bước 5) 9](#_heading=)
>
> [6. Làm việc lại với nhà thầu/nhà cung cấp (Bước 6) 9](#_heading=)
>
> [7. Kiểm tra và chỉnh sửa hồ sơ (Bước 7) 9](#_heading=)
>
> [8. Phê duyệt và ký soạn thảo hợp đồng (Bước 8) 10](#_heading=)
>
> [9. Tập hợp hồ sơ, chữ ký nháy và trình ký (Bước 9) 10](#_heading=)
>
> [10. Xem xét, phê duyệt và ký hợp đồng (Bước 10) 10](#_heading=)
>
> [11. Nhận hợp đồng đã được ký (Bước 11) 11](#_heading=)
>
> [12. Gửi hợp đồng đã được ký cho nhà thầu/nhà cung cấp ký (Bước 12) 11](#_heading=)
>
> [13. Ký và gửi lại hợp đồng (Bước 13) 11](#_heading=)
>
> [14. Hình thức trao đổi và ký hợp đồng 11](#_heading=)
>
> [15. Kết thúc luồng MS22 12](#_heading=)

[**D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 12**](#_heading=)

[**E. PHỤ LỤC - TÓM TẮT 13 BƯỚC MS22 13**](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải quy trình MS22 – Thương thảo và ký hợp đồng bằng ngôn ngữ nghiệp vụ, làm rõ tác nhân, nội dung thực hiện, hồ sơ sử dụng và các nhánh xử lý trên BPMN. Tài liệu kế thừa cấu trúc và cách trình bày của mẫu MS14.

## 2. Phạm vi áp dụng

Áp dụng từ khi Phòng hợp đồng tiếp nhận thông tin căn cứ đề xuất mua sắm và hồ sơ thầu đến khi nhà thầu/nhà cung cấp ký, gửi lại hợp đồng và chuyển sang MS23. Giữ nguyên 13 bước và trình tự trên sơ đồ MS22-0110; chưa xác lập ngưỡng giá trị, thời hạn xử lý hoặc mã biểu mẫu khi sơ đồ chưa quy định.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | Biểu đồ luồng ĐTMS-MS22-0110.drawio.svg | Nguồn nghiệp vụ chính: các bước, tác nhân, mũi tên, điều kiện và ghi chú trên sơ đồ. |
| 2 | MS14.docx | Mẫu cấu trúc và trình bày; không sử dụng nghiệp vụ MS14 để bổ sung vào MS22. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | VHT | Viettel High Tech |
| 3 | AI | Trí tuệ nhân tạo hỗ trợ kiểm tra hồ sơ trước phê duyệt |
| 4 | Body hợp đồng | Phần nội dung chính của hợp đồng |
| 5 | SLA | Cam kết mức dịch vụ, được nêu trong phụ lục kỹ thuật |
| 6 | VContract | Hình thức ký hợp đồng điện tử được sơ đồ cho phép lựa chọn |
| 7 | Ký soạn thảo/Ký nháy | Các bước xác nhận hồ sơ trước khi trình người có thẩm quyền ký hợp đồng |
| 8 | Thủ trưởng VHT | Tổng giám đốc VHT – người xem xét, phê duyệt và ký hợp đồng trong luồng này |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Hoàn thiện bộ hợp đồng và phụ lục từ căn cứ mua sắm, thương thảo với nhà thầu/nhà cung cấp, kiểm tra thông tin bằng AI và trình phê duyệt. Kết quả cuối luồng là hợp đồng có đủ chữ ký hai bên để chuyển sang theo dõi thực hiện hợp đồng tại MS23.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Lập hồ sơ song song | Sau bước 1, bước 2 và bước 3 cùng được thực hiện; hoàn thành cả hai trước bước 4. |
| Kết quả AI | OK → bước 8. Not OK → xác định có cần thống nhất lại với nhà thầu/nhà cung cấp để thực hiện bước 6 hoặc 7. |
| Cần thống nhất lại | Có → bước 6; Không → bước 7. Cả hai đều quay lại bước 5. |
| Trưởng phòng hợp đồng phê duyệt | Có → bước 9; Không → nhánh xác định cần thống nhất lại để chỉnh sửa và kiểm tra AI lại. |
| Thủ trưởng VHT phê duyệt | Có → bước 11; Không → mũi tên quay về bước 9, ghi “sửa và trình lại / theo chỉ đạo”. |
| Hình thức ký của nhà thầu/nhà cung cấp | VContract hoặc ký, đóng dấu và gửi lại bản giấy. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Phòng hợp đồng | Tiếp nhận hồ sơ; hoàn thiện body/phụ lục giá; thương thảo, chỉnh sửa; tập hợp ký nháy, trình ký; nhận và gửi hợp đồng cho nhà thầu/nhà cung cấp. |
| 2 | Đơn vị sử dụng | Hoàn thiện phụ lục kỹ thuật và cập nhật mã hàng; ký nháy bộ hợp đồng theo bước 9. |
| 3 | Trung tâm mua sắm | Ký nháy cùng Đơn vị sử dụng theo ghi chú và nội dung bước 9; sơ đồ không có lane riêng. |
| 4 | Hệ thống ĐTMS / Tích hợp AI | Kiểm tra thông tin trước phê duyệt và cung cấp kết quả, cảnh báo để xử lý. |
| 5 | Trưởng phòng hợp đồng | Xem xét hồ sơ và kết quả AI; phê duyệt và ký soạn thảo hoặc trả chỉnh sửa. |
| 6 | Tổng giám đốc VHT (Thủ trưởng VHT) | Xem xét, phê duyệt và ký hợp đồng; khi cần yêu cầu pháp chế, tài chính, đầu tư thẩm định. |
| 7 | Nhà thầu / Nhà cung cấp | Thương thảo qua email; ký hợp đồng theo hình thức đã chọn và gửi lại. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Đề xuất mua sắm; kết quả thầu; hồ sơ thầu | Căn cứ tiếp nhận thông tin hợp đồng tại bước 1. |
| 2 | Phụ lục kỹ thuật; danh mục đã cấp mã | Đầu ra bước 2: yêu cầu kỹ thuật, thông số, tiêu chuẩn nghiệm thu, SLA, tiến độ bàn giao. |
| 3 | Body; phụ lục 1 về giá/danh mục hàng hóa | Đầu ra bước 3 và thành phần dự thảo thương thảo. |
| 4 | Dự thảo và phụ lục; biên bản thương thảo ký, đóng dấu | Hồ sơ bước 4 và căn cứ hoàn thiện trước kiểm tra AI. |
| 5 | Kết quả/cảnh báo AI; ý kiến trả sửa | Căn cứ xử lý bước 6, 7 và xem xét bước 8. |
| 6 | Bộ hợp đồng/phụ lục ký nháy; hồ sơ trình ký | Trình Thủ trưởng VHT tại bước 9–10. |
| 7 | Ý kiến thẩm định nếu có | Phục vụ bước 10 khi người ký yêu cầu thẩm định. |
| 8 | Hợp đồng đã được Thủ trưởng VHT ký | Nhận tại bước 11, gửi nhà thầu/nhà cung cấp tại bước 12. |
| 9 | Hợp đồng ký đầy đủ trên VContract hoặc bản giấy | Kết quả bước 13 và căn cứ chuyển MS23. |

## 5. Nguyên tắc xử lý chung

Giữ nguyên số bước 1–13 trên BPMN; bước 6 và 7 là các nhánh xử lý phát sinh khi hồ sơ cần sửa, không phải hai bước luôn thực hiện liên tiếp.

Đơn vị sử dụng lập phụ lục kỹ thuật song song với Phòng hợp đồng hoàn thiện body và phụ lục giá.

Trao đổi, thương thảo với nhà thầu/nhà cung cấp thực hiện qua email. Hình thức gửi thông tin và hình thức ký hợp đồng được diễn giải riêng.

Sau chỉnh sửa tại bước 6 hoặc 7, hồ sơ phải qua AI kiểm tra lại tại bước 5 trước khi trình Trưởng phòng hợp đồng.

Chỉ Trung tâm mua sắm và Đơn vị sử dụng ký nháy, sau khi Trưởng phòng hợp đồng ký soạn thảo và trước khi Thủ trưởng VHT ký hợp đồng.

Hợp đồng được Thủ trưởng VHT ký chưa phải điểm kết thúc MS22: tiếp tục gửi nhà thầu/nhà cung cấp ký và gửi lại tại bước 12–13.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Các mục dưới đây giữ nguyên tên và số bước của BPMN. Các nhánh được diễn giải theo đầu và cuối mũi tên; những điểm chưa thống nhất giữa nội dung ô và mũi tên được ghi nhận tại phần D.

## 1. Tiếp nhận thông tin và hồ sơ hợp đồng (Bước 1)

Tác nhân: Phòng hợp đồng.

Căn cứ vào đề xuất mua sắm và hồ sơ thầu mà phòng thầu bàn giao: tiếp nhận thông tin cơ bản của hợp đồng.

Hồ sơ/biểu mẫu: Kết quả thầu / đề xuất mua sắm; hồ sơ thầu; thông tin hợp đồng.

Sau tiếp nhận, luồng tách song song để thực hiện bước 2 và bước 3.

## 2. Hoàn thiện phụ lục kỹ thuật và cập nhật mã hàng (Bước 2)

Tác nhân: Đơn vị sử dụng.

Đơn vị kỹ thuật hoàn thiện phụ lục kỹ thuật(yêu cầu kỹ thuật, thông số sản phẩm, tiêu chuẩn nghiệm thu, SLA và tiến độ bàn giao). Lập song song với body/phụ lục giá.

Hồ sơ/biểu mẫu: Phụ lục kỹ thuật; danh mục đã cấp mã theo QT.

Bước này thực hiện song song với bước 3. Hai nhánh hợp nhất khi phụ lục kỹ thuật, body và phụ lục giá đã hoàn thiện để chuyển bước 4.

## 3. Hoàn thiện body và phụ lục giá (Bước 3)

Tác nhân: Phòng hợp đồng.

Hoàn thiện body và phụ lục 1 về giá/danh mục hàng hóa. Thực hiện song song với Đơn vị sử dụng lập phụ lục kỹ thuật.

Hồ sơ/biểu mẫu: Body hợp đồng; phụ lục 1 về giá/danh mục hàng hóa.

Bước này thực hiện song song với bước 2. Sau khi hai nhánh hoàn tất, Phòng hợp đồng gửi bộ dự thảo tại bước 4.

## 4. Gửi dự thảo cùng phụ lục cho nhà thầu/nhà cung cấp để thương thảo (Bước 4)

Tác nhân: Phòng hợp đồng và nhà thầu/nhà cung cấp.

Gửi dự thảo cùng phụ lục cho nhà thầu/nhà cung cấp để thương thảo qua email.

Hồ sơ/biểu mẫu: Dự thảo và phụ lục; biên bản thương thảo ký, đóng dấu.

Sau thương thảo và hoàn thiện dự thảo cùng phụ lục, hồ sơ chuyển bước 5 để AI kiểm tra trước phê duyệt.

## 5. Kiểm tra thông tin trước phê duyệt (Bước 5)

Tác nhân: Hệ thống ĐTMS / Tích hợp AI.

Kiểm tra hồ sơ sau thương thảo/hoàn thiện hoặc sau chỉnh sửa. OK: chuyển Trưởng phòng hợp đồng duyệt. Not OK: trả người soạn thảo xử lý, sửa hồ sơ; xác định có cần trao đổi lại với nhà thầu/nhà cung cấp.

Hồ sơ/biểu mẫu: Bộ hợp đồng/phụ lục; kết quả và cảnh báo AI. Tiêu chí/checklist AI chi tiết còn cần xác nhận.

Gateway “kết quả kiểm tra AI?”: OK → bước 8. Not OK → gateway “Có cần thống nhất lại với nhà thầu/nhà cung cấp?”; Có → bước 6, Không → bước 7.

## 6. Làm việc lại với nhà thầu/nhà cung cấp (Bước 6)

Tác nhân: Phòng hợp đồng và nhà thầu/nhà cung cấp.

Trao đổi lại qua email để thống nhất các nội dung cần thay đổi sau khi Phòng hợp đồng xem xét cảnh báo AI; cập nhật dự thảo, phụ lục và biên bản liên quan, rồi chuyển AI kiểm tra lại.

Hồ sơ/biểu mẫu: Bộ hợp đồng/phụ lục cập nhật; biên bản thương thảo hoặc hoàn thiện liên quan.

Sau cập nhật nội dung đã trao đổi qua email, hồ sơ quay lại bước 5. Đây cũng là nhánh có thể phát sinh khi Trưởng phòng hợp đồng không phê duyệt và nội dung cần thống nhất lại với nhà thầu/nhà cung cấp.

## 7. Kiểm tra và chỉnh sửa hồ sơ (Bước 7)

Tác nhân: Phòng hợp đồng (người soạn thảo).

Chỉnh sửa nội bộ theo cảnh báo AI đã được kiểm tra hoặc theo ý kiến trả hồ sơ của Trưởng phòng hợp đồng; cập nhật hồ sơ và chuyển AI kiểm tra lại trước khi trình duyệt.

Hồ sơ/biểu mẫu: Bộ hợp đồng/phụ lục đã sửa; cảnh báo AI hoặc ý kiến Trưởng phòng hợp đồng.

Sau sửa nội bộ, hồ sơ quay lại bước 5. Nhánh này áp dụng khi không cần thống nhất lại với nhà thầu/nhà cung cấp.

## 8. Phê duyệt và ký soạn thảo hợp đồng (Bước 8)

Tác nhân: Trưởng phòng hợp đồng.

Xem xét hồ sơ và kết quả AI. Đồng ý: ký soạn thảo rồi chuyển lấy chữ ký nháy, tập hợp hồ sơ trình ký. Không đồng ý: trả nhân viên Phòng hợp đồng chỉnh sửa theo ý kiến; AI kiểm tra lại trước khi trình duyệt lại.

Hồ sơ/biểu mẫu: Bộ hợp đồng/phụ lục; kết quả AI; ý kiến phê duyệt hoặc yêu cầu chỉnh sửa.

Gateway “Trưởng phòng HĐ phê duyệt?”: Có → bước 9. Không → gateway xác định có cần thống nhất lại với nhà thầu/nhà cung cấp, sau đó thực hiện bước 6 hoặc 7 và kiểm tra AI lại tại bước 5.

## 9. Tập hợp hồ sơ, chữ ký nháy và trình ký (Bước 9)

Tác nhân: Phòng hợp đồng.

Sau khi Trưởng phòng hợp đồng ký soạn thảo, lấy chữ ký nháy của Trung tâm mua sắm và Đơn vị sử dụng; tập hợp hồ sơ, trình Tổng giám đốc VHT (Thủ trưởng VHT) ký hợp đồng.

Hồ sơ/biểu mẫu: Bộ hợp đồng/phụ lục ký nháy và hồ sơ trình ký.

Sau khi tập hợp bộ hồ sơ có ký nháy của Trung tâm mua sắm và Đơn vị sử dụng, Phòng hợp đồng trình Thủ trưởng VHT tại bước 10. Sơ đồ cũng đưa nhánh không được Thủ trưởng VHT phê duyệt về bước này.

## 10. Xem xét, phê duyệt và ký hợp đồng (Bước 10)

Tác nhân: Tổng giám đốc VHT (Thủ trưởng VHT).

Xem xét, phê duyệt và ký khi đồng ý; khi cần yêu cầu pháp chế, tài chính, đầu tư thẩm định. Không đồng ý: trả Phòng hợp đồng sửa và trình lại theo QT.

Hồ sơ/biểu mẫu: Bộ hợp đồng trình ký; ý kiến thẩm định nếu có; hợp đồng đã được Thủ trưởng VHT ký khi đồng ý.

Gateway “Thủ trưởng VHT phê duyệt?”: Có → bước 11. Không → bước 9 theo mũi tên “Không: sửa và trình lại / theo chỉ đạo”. BPMN chưa thể hiện riêng chuỗi chỉnh sửa, kiểm tra AI và ký soạn thảo lại của nhánh này; cần xác nhận tại phần D.

## 11. Nhận hợp đồng đã được ký (Bước 11)

Tác nhân: Phòng hợp đồng.

Hợp đồng sau khi được ký duyệt sẽ chuyển về cho Phòng hợp đồng.

Hồ sơ/biểu mẫu: Hợp đồng đã được Thủ trưởng VHT ký;.

Phòng hợp đồng tiếp nhận hợp đồng đã được Thủ trưởng VHT ký và chuyển bước 12. Tại đây nhà thầu/nhà cung cấp chưa hoàn tất bước ký theo trình tự sơ đồ.

## 12. Gửi hợp đồng đã được ký cho nhà thầu/nhà cung cấp ký (Bước 12)

Tác nhân: Phòng hợp đồng.

Gửi hợp đồng đã được Thủ trưởng VHT ký: chọn ký qua VContract hoặc gửi bản giấy để ký cứng; theo dõi nhà thầu/nhà cung cấp hoàn tất ký.

Hồ sơ/biểu mẫu: Hợp đồng đã được Thủ trưởng VHT ký; bộ hợp đồng gửi nhà thầu/nhà cung cấp.

Theo dõi nhà thầu/nhà cung cấp ký tại bước 13. Mũi tên nét đứt có biểu tượng email thể hiện việc gửi hồ sơ; nhà thầu/nhà cung cấp ký bằng VContract hoặc bản giấy theo hình thức đã chọn.

## 13. Ký và gửi lại hợp đồng (Bước 13)

Tác nhân: Nhà thầu / Nhà cung cấp.

Theo hình thức đã chọn: ký trên VContract hoặc ký, đóng dấu và gửi lại bản giấy; hai bên có hợp đồng ký đầy đủ.

Hồ sơ/biểu mẫu: Hợp đồng đã ký trên VContract hoặc bản giấy đã ký, đóng dấu.

Khi nhà thầu/nhà cung cấp ký và gửi lại, hai bên có hợp đồng ký đầy đủ. Luồng kết thúc tại “Hợp đồng đã ký → MS23”. Sơ đồ chưa thể hiện nhánh nhà thầu/nhà cung cấp không ký hoặc yêu cầu sửa ở bước này.

## 14. Hình thức trao đổi và ký hợp đồng

| **Nội dung** | **Hình thức theo BPMN** |
|:--:|:--:|
| Thương thảo/trao đổi lại tại bước 4, 6 | Email với nhà thầu/nhà cung cấp. |
| Trình Thủ trưởng VHT tại bước 9–10 | BPMN nêu hồ sơ trình ký; chưa quy định rõ kênh trình ký. |
| Gửi hồ sơ tại bước 12 | Sơ đồ có mũi tên email nét đứt tới nhà thầu/nhà cung cấp; nội dung ô cho phép chọn VContract hoặc gửi bản giấy để ký cứng. |
| Nhà thầu/nhà cung cấp ký tại bước 13 | Ký trên VContract hoặc ký, đóng dấu và gửi lại bản giấy. |

## 15. Kết thúc luồng MS22

MS22 kết thúc sau bước 13, khi nhà thầu/nhà cung cấp đã ký và gửi lại hợp đồng, hai bên có hợp đồng ký đầy đủ. Sự kiện cuối sơ đồ chuyển sang MS23 để theo dõi thực hiện hợp đồng. Cách đánh dấu đã ký trên hệ thống vẫn là nội dung cần làm rõ theo ghi chú của BPMN.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

Các nội dung dưới đây xuất phát từ ghi chú hoặc khoảng trống trên sơ đồ MS22; chưa được coi là quy tắc nghiệp vụ đã xác nhận.

| **STT** | **Nội dung** | **Điểm cần xác nhận/đặc tả** |
|:--:|:--:|:--:|
| 1 | Điều kiện chọn mẫu dự thảo | Cần xác nhận tiêu chí theo loại hàng hóa, một/nhiều lô, loại hợp đồng, tình trạng giao hàng và thanh toán; cung cấp các mẫu tương ứng. |
| 2 | Mẫu theo giá trị hợp đồng | Ghi chú nêu ví dụ trên/dưới 45 tỷ đồng. Cần xác nhận có phân mẫu theo giá trị hay không và ngưỡng thực tế; chưa dùng 45 tỷ làm điều kiện. |
| 3 | Biểu mẫu và checklist | Cần cung cấp mã, tên, mẫu hợp đồng, phụ lục, biên bản thương thảo và checklist áp dụng; BPMN chưa có danh mục cụ thể. |
| 4 | Tiêu chí kiểm tra AI | Xác nhận thông tin AI kiểm tra, tiêu chí OK/Not OK, mức cảnh báo và cách người soạn thảo xác nhận/xử lý kết quả. |
| 5 | Phân nhánh sửa hồ sơ | Ai quyết định có cần thống nhất lại với nhà thầu/nhà cung cấp và tiêu chí phân nhánh bước 6/7? |
| 6 | Nhánh Thủ trưởng VHT không phê duyệt | Mũi tên từ gateway sau bước 10 quay về bước 9 nhưng ghi “sửa và trình lại / theo chỉ đạo”. Xác nhận sửa tại bước nào; có phải quay bước 5, 8 và lấy lại ký nháy khi nội dung thay đổi không? |
| 7 | Thẩm định tại bước 10 | Khi nào yêu cầu pháp chế, tài chính, đầu tư thẩm định; cách lấy ý kiến và xử lý ý kiến chưa được tách thành các bước trên sơ đồ. |
| 8 | Kênh trình ký và ghi nhận kết quả | Xác nhận cách trình Thủ trưởng VHT, cách ghi nhận ký trên VContract hoặc ký giấy, người cập nhật và bằng chứng ký đầy đủ để chuyển MS23. |
| 9 | Nhà thầu/nhà cung cấp không ký | Sơ đồ chưa có nhánh từ chối, yêu cầu sửa hoặc chậm gửi lại sau bước 12. Xác nhận nơi quay lại và người theo dõi. |
| 10 | Mã hàng tại bước 2 | Tên bước có cập nhật mã hàng, hồ sơ nêu danh mục đã cấp mã theo quy trình; cần xác nhận nguồn mã và cách thực hiện cập nhật. |
| 11 | Kênh gửi và hình thức ký | Làm rõ email ở bước 12 gửi thông báo/liên kết VContract hay bản hợp đồng; bản giấy được gửi và tiếp nhận như thế nào? |

# E. PHỤ LỤC - TÓM TẮT 13 BƯỚC MS22

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | Tiếp nhận thông tin và hồ sơ hợp đồng | Phòng hợp đồng | Kết quả thầu / đề xuất mua sắm; hồ sơ thầu; thông tin hợp đồng. |
| 2 | Hoàn thiện phụ lục kỹ thuật và cập nhật mã hàng | Đơn vị sử dụng | Phụ lục kỹ thuật; danh mục đã cấp mã theo QT. |
| 3 | Hoàn thiện body và phụ lục giá | Phòng hợp đồng | Body hợp đồng; phụ lục 1 về giá/danh mục hàng hóa. |
| 4 | Gửi dự thảo cùng phụ lục cho nhà thầu/nhà cung cấp để thương thảo | Phòng hợp đồng và nhà thầu/nhà cung cấp | Dự thảo và phụ lục; biên bản thương thảo ký, đóng dấu. |
| 5 | Kiểm tra thông tin trước phê duyệt | Hệ thống ĐTMS / Tích hợp AI | Bộ hợp đồng/phụ lục; kết quả và cảnh báo AI. Tiêu chí/checklist AI chi tiết còn cần xác nhận. |
| 6 | Làm việc lại với nhà thầu/nhà cung cấp | Phòng hợp đồng và nhà thầu/nhà cung cấp | Bộ hợp đồng/phụ lục cập nhật; biên bản thương thảo hoặc hoàn thiện liên quan. |
| 7 | Kiểm tra và chỉnh sửa hồ sơ | Phòng hợp đồng (người soạn thảo) | Bộ hợp đồng/phụ lục đã sửa; cảnh báo AI hoặc ý kiến Trưởng phòng hợp đồng. |
| 8 | Phê duyệt và ký soạn thảo hợp đồng | Trưởng phòng hợp đồng | Bộ hợp đồng/phụ lục; kết quả AI; ý kiến phê duyệt hoặc yêu cầu chỉnh sửa. |
| 9 | Tập hợp hồ sơ, chữ ký nháy và trình ký | Phòng hợp đồng | Bộ hợp đồng/phụ lục ký nháy và hồ sơ trình ký. |
| 10 | Xem xét, phê duyệt và ký hợp đồng | Tổng giám đốc VHT (Thủ trưởng VHT) | Bộ hợp đồng trình ký; ý kiến thẩm định nếu có; hợp đồng đã được Thủ trưởng VHT ký khi đồng ý. |
| 11 | Nhận hợp đồng đã được ký | Phòng hợp đồng | Hợp đồng đã được Thủ trưởng VHT ký; |
| 12 | Gửi hợp đồng đã được ký cho nhà thầu/nhà cung cấp ký | Phòng hợp đồng | Hợp đồng đã được Thủ trưởng VHT ký; bộ hợp đồng gửi nhà thầu/nhà cung cấp. |
| 13 | Ký và gửi lại hợp đồng | Nhà thầu / Nhà cung cấp | Hợp đồng đã ký trên VContract hoặc bản giấy đã ký, đóng dấu. |
