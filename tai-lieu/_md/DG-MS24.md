<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS24_301026.docx -->
<!-- pk-sha256: e4db9f79c6c2690ce64e57b49fb4b8570d2244396cc0736e4ecdfef95bfd3afd -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS24 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS24_301026.docx`. Trích dẫn thì ghi mã **DG-MS24** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS24 - THANH TOÁN HỢP ĐỒNG THEO TỪNG ĐỢT**

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
| 06/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS24. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

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
> [5. Nguyên tắc xử lý chung 8](#_heading=)

[**C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ 8**](#_heading=)

> [1. Tập hợp và gửi hồ sơ thanh toán (Bước 1) 8](#_heading=)
>
> [2. Tiếp nhận và tổng hợp hồ sơ thanh toán (Bước 2) 9](#_heading=)
>
> [3. Bổ sung hồ sơ thanh toán (Bước 3) 9](#_heading=)
>
> [4. Xuất đề nghị chuyển tiền theo template (Bước 4) 9](#_heading=)
>
> [5. Cung cấp hóa đơn thanh toán (Bước 5) 9](#_heading=)
>
> [6. AI lập bảng tổng hợp thanh toán (Bước 6) 10](#_heading=)
>
> [7. Kiểm tra và ký bảng tổng hợp (Bước 7) 10](#_heading=)
>
> [8. Kiểm tra và ký bảng tổng hợp (Bước 8) 10](#_heading=)
>
> [9. Kiểm tra và ký xác nhận bảng tổng hợp (Bước 9) 10](#_heading=)
>
> [10. Kiểm tra và ký bảng tổng hợp (Bước 10) 10](#_heading=)
>
> [11. Chỉnh sửa bảng tổng hợp thanh toán (Bước 11) 11](#_heading=)
>
> [12. Hoàn thiện hồ sơ đề nghị chuyển tiền (Bước 12) 11](#_heading=)
>
> [13. Kiểm tra và ký duyệt đề nghị chuyển tiền (Bước 13) 11](#_heading=)
>
> [14. Kiểm tra và ký đề nghị chuyển tiền (Bước 14) 11](#_heading=)
>
> [15. Kiểm tra và ký xác nhận đề nghị chuyển tiền (Bước 15) 12](#_heading=)
>
> [16. Kiểm tra và ký đề nghị chuyển tiền (Bước 16) 12](#_heading=)
>
> [17. Chỉnh sửa đề nghị chuyển tiền (Bước 17) 12](#_heading=)
>
> [18. Thanh toán tiền (Bước 18) 12](#_heading=)
>
> [19. Cập nhật trạng thái và tải minh chứng (Bước 19) 13](#_heading=)
>
> [20. AI ghi nhận và đồng bộ trạng thái thanh toán lên SAP (Bước 20) 13](#_heading=)
>
> [21. Hình thức trình ký 13](#_heading=)
>
> [22. Kết thúc luồng MS24 13](#_heading=)

[**D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 13**](#_heading=)

[**E. PHỤ LỤC - TÓM TẮT 20 BƯỚC MS24 15**](#_heading=)

**A. GIỚI THIỆU**

## 1. Mục đích tài liệu

Diễn giải quy trình MS24 – Thanh toán hợp đồng theo từng đợt, làm rõ tác nhân, hồ sơ, nội dung xử lý và nhánh trả sửa theo BPMN. Tài liệu kế thừa bố cục mẫu MS14; số bước giữ nguyên theo sơ đồ MS24 mới được cung cấp.

## 2. Phạm vi áp dụng

Bắt đầu khi phát sinh đợt thanh toán theo hợp đồng; kết thúc khi lần thanh toán đã được thực hiện, ghi nhận trạng thái và đồng bộ thông tin lên SAP. Phạm vi gồm 20 bước trên sơ đồ. Phòng Tài chính kế toán thực hiện thanh toán và cập nhật trạng thái, tải minh chứng tại bước 18–19. Các nội dung có nhãn \[Q\] và tên trạng thái chưa chốt được ghi nhận tại phần cần xác nhận. Hoàn tất một lần thanh toán không đồng nghĩa thanh toán xong toàn bộ hợp đồng.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | ĐTMS-MS24.drawio.svg | Nguồn nghiệp vụ chính; tiêu đề sơ đồ ghi cập nhật theo MoM review và xác nhận bổ sung ngày 04/10/2026. |
| 2 | MS14.docx | Mẫu cấu trúc diễn giải và định dạng tài liệu; không chuyển nghiệp vụ MS14 sang MS24. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | ĐVMS | Đơn vị mua sắm; phạm vi vai trò chuyên quản còn cần xác nhận theo \[Q1\]. |
| 3 | VHT | Viettel High Tech |
| 4 | AI | Trí tuệ nhân tạo hỗ trợ lập bảng tổng hợp, ghi nhận và đồng bộ thông tin. |
| 5 | Template | Mẫu tài liệu dùng để sinh đề nghị chuyển tiền. |
| 6 | VOffice/VContract | Các hình thức ký tích hợp được sơ đồ cho phép lựa chọn. |
| 7 | SAP | Hệ thống nhận thông tin thanh toán từ ĐTMS tại bước 20. |
| 8 | \[Q\] | Nhãn chỉ nội dung cần xác nhận hoặc chưa chốt trên BPMN. |
| 9 | YCCT | Ký hiệu trong nội dung bước 1; sơ đồ chưa giải thích đầy đủ tên gọi, cần xác nhận. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Tiếp nhận và kiểm tra căn cứ thanh toán theo hợp đồng, xuất đề nghị chuyển tiền theo mẫu, lập và trình ký bảng tổng hợp khi hợp đồng yêu cầu, trình ký đề nghị chuyển tiền và thực hiện thanh toán. Sau thanh toán, thông tin được cập nhật trên ĐTMS và đồng bộ lên SAP theo luồng thể hiện trên sơ đồ.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Hồ sơ đủ căn cứ? | Có → bước 4. Không → bước 3, rồi gửi lại bước 2 để kiểm tra. |
| Hợp đồng yêu cầu bảng tổng hợp? | Có → bước 5–10, xử lý bước 11 khi bị trả sửa, sau đó đến bước 12. Không → trực tiếp bước 12. |
| Tuyến ký bảng tổng hợp | Bước 7 Phòng tài chính → bước 8 Thủ trưởng VHT → bước 9 Văn thư → bước 10 Tổng giám đốc Tập đoàn. Bất kỳ cấp nào không đồng ý → bước 11 → trình lại từ bước 7. |
| Tuyến ký đề nghị chuyển tiền | Bước 13 Phòng tài chính → bước 14 Thủ trưởng VHT → bước 15 Văn thư → bước 16 Tổng giám đốc Tập đoàn. Bất kỳ cấp nào không đồng ý → bước 17 → bước 12 → trình lại từ bước 13. |
| Điều kiện thanh toán | Đề nghị chuyển tiền được đồng ý tại đầy đủ các cấp của tuyến ký trước bước 18. |
| Kết thúc | Sau bước 20: đã ghi nhận trạng thái và đồng bộ thông tin thanh toán lên SAP. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Chuyên quản / Đơn vị mua sắm | Tập hợp, gửi và bổ sung hồ sơ thanh toán; chưa xác định chắc chuyên quản thuộc Trung tâm mua sắm. |
| 2 | Phòng hợp đồng – Nhân sự chuyên thanh toán | Tiếp nhận, tổng hợp hồ sơ; cung cấp hóa đơn; sửa bảng tổng hợp; hoàn thiện, sửa đề nghị chuyển tiền và trình lại. |
| 3 | Hệ thống ĐTMS / AI | Sinh đề nghị chuyển tiền theo mẫu; AI lập bảng tổng hợp, ghi nhận và đồng bộ thông tin thanh toán lên SAP. |
| 4 | Phòng Tài chính kế toán | Kiểm tra và ký trong hai tuyến; thực hiện thanh toán, cập nhật trạng thái và tải minh chứng sau thanh toán. Chức danh người ký chưa chốt. |
| 5 | Thủ trưởng VHT | Kiểm tra và ký sau Phòng tài chính trong cả hai tuyến. |
| 6 | Văn thư | Kiểm tra font chữ, biểu mẫu, loại văn bản, định dạng, văn phong và ký xác nhận. |
| 7 | Tổng giám đốc Tập đoàn | Kiểm tra và ký sau Văn thư trong cả hai tuyến. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Hợp đồng; hồ sơ tạm ứng/bảo lãnh hoặc thanh toán theo giai đoạn | Căn cứ tập hợp và kiểm tra hồ sơ ở bước 1–3. |
| 2 | Thông tin số tiền, người nhận; kết quả kiểm tra căn cứ | Dữ liệu tổng hợp tại bước 2 và đầu vào đề nghị chuyển tiền. |
| 3 | Template đề nghị chuyển tiền | Mẫu sinh đề nghị tại bước 4; mẫu thực tế chưa cung cấp. |
| 4 | Hóa đơn và dữ liệu thanh toán của đợt | Đầu vào lập bảng tổng hợp ở bước 5–6. |
| 5 | Bảng tổng hợp thanh toán | Trình ký bước 7–10, chỉnh sửa tại bước 11; mẫu chưa cung cấp. |
| 6 | Đề nghị chuyển tiền và hồ sơ kèm | Hoàn thiện bước 12, trình ký bước 13–16, sửa tại bước 17. |
| 7 | Ý kiến, kết quả ký của từng cấp | Căn cứ tiếp tục hoặc trả sửa riêng từng tuyến. |
| 8 | Chứng từ/minh chứng thanh toán | Kết quả thực hiện thanh toán ở bước 18; Phòng Tài chính kế toán tải thông tin/minh chứng lên ĐTMS ở bước 19. |
| 9 | Trạng thái và dữ liệu đồng bộ SAP | Đầu vào và thông tin xử lý tại bước 20. |

## 5. Nguyên tắc xử lý chung

Bước 4 sinh đề nghị chuyển tiền theo template, không dùng AI gợi ý. AI lập bảng tổng hợp tại bước 6 khi hợp đồng yêu cầu.

Hai tuyến trình ký độc lập về nhánh sửa: trả bảng tổng hợp → bước 11; trả đề nghị chuyển tiền → bước 17. Không chuyển nhầm sang tuyến còn lại.

Khi bảng tổng hợp bị trả sửa, nhân sự chuyên thanh toán chỉnh sửa và trình lại từ Phòng tài chính tại bước 7.

Khi đề nghị chuyển tiền bị trả sửa, nhân sự chuyên thanh toán chỉnh sửa tại bước 17, hoàn thiện lại tại bước 12 và trình từ Phòng tài chính tại bước 13.

Phòng tài chính thực hiện một bước thanh toán bao gồm chuyển tiền hoặc thủ tục tiền mặt theo hợp đồng; sơ đồ không tách gateway phương thức thanh toán.

Vai trò Thủ trưởng VHT và Tổng giám đốc Tập đoàn là hai cấp ký riêng theo sơ đồ MS24.

Phòng Tài chính kế toán thực hiện cả thanh toán tại bước 18 và cập nhật trạng thái, tải minh chứng tại bước 19; sơ đồ không còn vai trò riêng “Người có trách nhiệm”. Tên trạng thái thanh toán vẫn chưa chốt.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Giữ nguyên 20 bước theo BPMN, bao gồm các bước bổ sung/chỉnh sửa chỉ thực hiện khi có nhánh trả lại. Các tuyến trình ký được diễn giải riêng để tránh nhầm nơi quay lại.

## 1. Tập hợp và gửi hồ sơ thanh toán (Bước 1)

Tác nhân: Chuyên quản / Đơn vị mua sắm (ĐVMS)

Tập hợp hồ sơ thanh toán theo điều khoản hợp đồng và gửi nhân sự chuyên thanh toán thuộc Phòng hợp đồng. Nguồn giao việc lập YCCT cho ĐVMS; chưa nêu chuyên quản thuộc Trung tâm mua sắm.

Hồ sơ/biểu mẫu: Hợp đồng; hồ sơ tạm ứng/bảo lãnh hoặc hồ sơ thanh toán theo giai đoạn.

Chuyển bộ hồ sơ tới nhân sự chuyên thanh toán thuộc Phòng hợp đồng tại bước 2.

## 2. Tiếp nhận và tổng hợp hồ sơ thanh toán (Bước 2)

Tác nhân: Phòng hợp đồng – Nhân sự chuyên thanh toán.

Nhân sự chuyên thanh toán tiếp nhận, tổng hợp hồ sơ do chuyên quản gửi và kiểm tra hồ sơ đã đủ căn cứ thanh toán theo hợp đồng hay chưa.

Hồ sơ/biểu mẫu: Bộ hồ sơ thanh toán; hợp đồng; thông tin số tiền và người nhận; kết quả kiểm tra căn cứ.

Gateway “Hồ sơ đủ căn cứ?”: Có → bước 4; Không → bước 3.

## 3. Bổ sung hồ sơ thanh toán (Bước 3)

Tác nhân: Chuyên quản / Đơn vị mua sắm (ĐVMS)

Khi hồ sơ chưa đủ căn cứ, chuyên quản/ĐVMS bổ sung thông tin, tài liệu theo yêu cầu và gửi lại nhân sự chuyên thanh toán để tiếp nhận, tổng hợp, kiểm tra lại.

Hồ sơ/biểu mẫu: Yêu cầu bổ sung; thông tin/tài liệu còn thiếu; bộ hồ sơ đã bổ sung.

Sau bổ sung, gửi lại bước 2 để tiếp nhận, tổng hợp và kiểm tra. Chỉ chuyển bước 4 khi đủ căn cứ.

## 4. Xuất đề nghị chuyển tiền theo template (Bước 4)

Tác nhân: Hệ thống ĐTMS / AI.

Hệ thống sinh đề nghị chuyển tiền từ hồ sơ đã tổng hợp theo template. Khi trình lại, sử dụng thông tin đã chỉnh sửa. Bước này không dùng AI gợi ý.

Hồ sơ/biểu mẫu: Template đề nghị chuyển tiền; thông tin thanh toán đã tổng hợp/cập nhật. Mẫu thực tế chưa cung cấp.

Sau xuất đề nghị, gateway “Hợp đồng yêu cầu bảng tổng hợp? \[Q2\]”: Có → bước 5; Không → bước 12. Tiêu chí áp dụng bảng tổng hợp chưa chốt.

## 5. Cung cấp hóa đơn thanh toán (Bước 5)

Tác nhân: Phòng hợp đồng – Nhân sự chuyên thanh toán.

Phòng hợp đồng cung cấp thông tin/hóa đơn liên quan đến đợt để AI lập bảng tổng hợp thanh toán.

Hồ sơ/biểu mẫu: Hóa đơn và thông tin thanh toán của đợt.

Chuyển hóa đơn và thông tin thanh toán của đợt đến bước 6.

## 6. AI lập bảng tổng hợp thanh toán (Bước 6)

Tác nhân: Hệ thống ĐTMS / AI.

AI lập bảng tổng hợp từ hóa đơn và dữ liệu thanh toán. Chuyển Phòng tài chính kiểm tra và ký.

Hồ sơ/biểu mẫu: Hóa đơn; dữ liệu thanh toán; mẫu bảng tổng hợp chưa được cung cấp.

Chuyển bảng tổng hợp để Phòng tài chính kiểm tra và ký tại bước 7.

## 7. Kiểm tra và ký bảng tổng hợp (Bước 7)

Tác nhân: Phòng tài chính \[Q3: người ký chưa rõ\].

Phòng tài chính kiểm tra và ký. Chức danh ký chưa chốt; có thể là Trưởng phòng tài chính.

Hồ sơ/biểu mẫu: Bảng tổng hợp thanh toán; hồ sơ/hóa đơn; ý kiến và kết quả ký.

Đồng ý → bước 8. Không đồng ý → bước 11, sửa bảng tổng hợp và trình lại từ bước 7.

## 8. Kiểm tra và ký bảng tổng hợp (Bước 8)

Tác nhân: Thủ trưởng VHT.

Thủ trưởng VHT kiểm tra, ký bảng tổng hợp sau Phòng tài chính.

Hồ sơ/biểu mẫu: Bảng tổng hợp; hồ sơ liên quan; ý kiến và kết quả ký.

Đồng ý → bước 9. Không đồng ý → bước 11, trình lại từ bước 7.

## 9. Kiểm tra và ký xác nhận bảng tổng hợp (Bước 9)

Tác nhân: Văn thư.

Văn thư kiểm tra font chữ, biểu mẫu, loại văn bản, định dạng và văn phong; ký xác nhận.

Hồ sơ/biểu mẫu: Bảng tổng hợp và tài liệu trình; ý kiến/kết quả ký xác nhận.

Đồng ý → bước 10. Không đồng ý → bước 11, trình lại từ bước 7.

## 10. Kiểm tra và ký bảng tổng hợp (Bước 10)

Tác nhân: Tổng giám đốc Tập đoàn.

Tổng giám đốc Tập đoàn kiểm tra và ký sau Văn thư.

Hồ sơ/biểu mẫu: Bảng tổng hợp; hồ sơ trình ký; ý kiến và kết quả ký.

Đồng ý → bước 12, sử dụng bảng tổng hợp đã ký đủ. Không đồng ý → bước 11, trình lại từ bước 7.

## 11. Chỉnh sửa bảng tổng hợp thanh toán (Bước 11)

Tác nhân: Phòng hợp đồng – Nhân sự chuyên thanh toán.

Nếu một cấp không đồng ý ở giai đoạn bảng tổng hợp: sửa bảng và dữ liệu liên quan theo ý kiến; trình lại từ Phòng tài chính. Không chuyển sang vòng sửa đề nghị chuyển tiền.

Hồ sơ/biểu mẫu: Bảng tổng hợp đã chỉnh sửa; ý kiến trả lại; hóa đơn/thông tin liên quan.

Sau chỉnh sửa, mũi tên quay trực tiếp về bước 7. Sơ đồ không đưa nhánh này về bước 6 để AI lập lại và không chuyển sang bước 17.

## 12. Hoàn thiện hồ sơ đề nghị chuyển tiền (Bước 12)

Tác nhân: Phòng hợp đồng – Nhân sự chuyên thanh toán.

Hoàn thiện đề nghị theo template và bộ hồ sơ. Nếu cần bảng tổng hợp, kèm bảng đã ký đủ. Chọn ký tích hợp VOffice/VContract hoặc hình thức khác được phép.

Hồ sơ/biểu mẫu: Đề nghị chuyển tiền; căn cứ thanh toán; bảng tổng hợp đã ký nếu cần; phương thức trình ký.

Nếu hợp đồng không yêu cầu bảng tổng hợp, nhận luồng trực tiếp sau bước 4. Nếu có yêu cầu, nhận luồng sau bước 10 đã được đồng ý. Sau hoàn thiện, chuyển bước 13.

## 13. Kiểm tra và ký duyệt đề nghị chuyển tiền (Bước 13)

Tác nhân: Phòng tài chính \[Q3: người ký chưa rõ\].

Phòng tài chính kiểm tra và ký duyệt đề nghị trước Thủ trưởng VHT. Không đồng ý: trả về chỉnh sửa đề nghị rồi trình lại từ Phòng tài chính. Chức danh ký chưa chốt.

Hồ sơ/biểu mẫu: Đề nghị chuyển tiền và hồ sơ kèm; ý kiến/kết quả ký duyệt.

Đồng ý → bước 14. Không đồng ý → bước 17, rồi bước 12 và trình lại từ bước 13.

## 14. Kiểm tra và ký đề nghị chuyển tiền (Bước 14)

Tác nhân: Thủ trưởng VHT.

Thủ trưởng VHT kiểm tra và ký sau Phòng tài chính. Không đồng ý: trả về sửa đề nghị, trình lại từ Phòng tài chính trong tuyến đề nghị chuyển tiền.

Hồ sơ/biểu mẫu: Đề nghị chuyển tiền; hồ sơ kèm; ý kiến/kết quả ký.

Đồng ý → bước 15. Không đồng ý → bước 17 → bước 12 → bước 13 trong tuyến đề nghị chuyển tiền.

## 15. Kiểm tra và ký xác nhận đề nghị chuyển tiền (Bước 15)

Tác nhân: Văn thư.

Văn thư kiểm tra font chữ, biểu mẫu, loại văn bản, định dạng và văn phong; ký xác nhận. Không đồng ý: trả về sửa đề nghị, trình lại từ Phòng tài chính.

Hồ sơ/biểu mẫu: Đề nghị chuyển tiền; ý kiến/kết quả ký xác nhận.

Đồng ý → bước 16. Không đồng ý → bước 17 → bước 12 → bước 13.

## 16. Kiểm tra và ký đề nghị chuyển tiền (Bước 16)

Tác nhân: Tổng giám đốc Tập đoàn.

Tổng giám đốc Tập đoàn kiểm tra và ký sau Văn thư. Không đồng ý: trả về sửa đề nghị rồi trình lại từ Phòng tài chính trong tuyến đề nghị chuyển tiền.

Hồ sơ/biểu mẫu: Đề nghị chuyển tiền; hồ sơ kèm; ý kiến/kết quả ký.

Đồng ý → bước 18 để thực hiện thanh toán. Không đồng ý → bước 17 → bước 12 → bước 13.

## 17. Chỉnh sửa đề nghị chuyển tiền (Bước 17)

Tác nhân: Phòng hợp đồng – Nhân sự chuyên thanh toán.

Một cấp không đồng ý trong tuyến đề nghị: chỉnh sửa đề nghị và hồ sơ theo ý kiến, hoàn thiện và trình lại từ Phòng tài chính. Không quay về vòng sửa/ký bảng tổng hợp.

Hồ sơ/biểu mẫu: Đề nghị chuyển tiền đã chỉnh sửa; ý kiến trả lại; hồ sơ kèm.

Sau chỉnh sửa, quay bước 12 để hoàn thiện lại, rồi bước 13 để trình ký lại. Sơ đồ không quay về vòng sửa/ký bảng tổng hợp.

## 18. Thanh toán tiền (Bước 18)

Tác nhân: Phòng Tài chính kế toán.

Sau khi đề nghị chuyển tiền được duyệt đủ, Phòng Tài chính kế toán thực hiện thanh toán tiền cho nhà thầu/nhà cung cấp theo hợp đồng. Bao gồm chuyển tiền hoặc thủ tục tiền mặt theo phương thức đã thỏa thuận.

Hồ sơ/biểu mẫu: Đề nghị đã ký duyệt; hợp đồng; thông tin nhận tiền; chứng từ/minh chứng thanh toán.

Sau thực hiện chuyển tiền hoặc thủ tục tiền mặt, chuyển bước 19 theo luồng trên sơ đồ.

## 19. Cập nhật trạng thái và tải minh chứng (Bước 19)

Tác nhân: Phòng Tài chính kế toán.

Sau khi chuyển tiền/chi tiền mặt, Phòng Tài chính kế toán cập nhật trạng thái và tải thông tin/minh chứng thanh toán lên ĐTMS. Tên trạng thái chưa chốt.

Hồ sơ/biểu mẫu: Thông tin thực hiện thanh toán; chứng từ/minh chứng theo phương thức; trạng thái cập nhật.

Phòng Tài chính kế toán thực hiện cập nhật trạng thái và tải minh chứng sau khi thanh toán. Tên trạng thái chưa chốt. Sau cập nhật, chuyển dữ liệu tới bước 20.

## 20. AI ghi nhận và đồng bộ trạng thái thanh toán lên SAP (Bước 20)

Tác nhân: Hệ thống ĐTMS / AI.

AI ghi nhận trạng thái thanh toán và thông tin liên quan từ dữ liệu Phòng Tài chính kế toán đã cập nhật; đồng bộ các thông tin này lên SAP.

Hồ sơ/biểu mẫu: Trạng thái thanh toán; thông tin thực hiện thanh toán; chứng từ/minh chứng; dữ liệu đồng bộ SAP.

Sau ghi nhận và đồng bộ thông tin lên SAP, chuyển sự kiện kết thúc “Hoàn tất lần thanh toán theo hợp đồng”. Sơ đồ chưa thể hiện nhánh đồng bộ lỗi hoặc chưa thành công.

## 21. Hình thức trình ký

Tại bước 12, nhân sự chuyên thanh toán chọn ký tích hợp VOffice/VContract hoặc hình thức khác được phép. Sơ đồ chưa chỉ rõ danh mục hình thức khác, tiêu chí lựa chọn hoặc cách ghi nhận kết quả từng hình thức. Không áp dụng thêm quy tắc hồ sơ Mật của MS14 khi MS24 chưa thể hiện.

## 22. Kết thúc luồng MS24

Luồng kết thúc sau khi Phòng Tài chính kế toán thực hiện thanh toán, cập nhật trạng thái và tải minh chứng, sau đó AI ghi nhận và đồng bộ thông tin thanh toán lên SAP tại bước 20. Điểm kết thúc chỉ áp dụng cho lần thanh toán đang xử lý theo hợp đồng; sơ đồ không thể hiện quyết định thanh toán xong toàn bộ hợp đồng hoặc đóng hợp đồng.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

Các điểm dưới đây được ghi nhận từ nhãn \[Q\] và khoảng trống trên sơ đồ; cần xác nhận trước khi đặc tả chi tiết hệ thống.

| **STT** | **Nội dung** | **Điểm cần xác nhận/đặc tả** |
|:--:|:--:|:--:|
| 1 | Chuyên quản / ĐVMS | Xác nhận đơn vị và người tập hợp/bổ sung hồ sơ; tên đầy đủ YCCT và nguồn giao việc. Không mặc định chuyên quản thuộc Trung tâm mua sắm. |
| 2 | Điều kiện yêu cầu bảng tổng hợp | Xác nhận loại hợp đồng, điều khoản hoặc điều kiện nào bắt buộc bảng tổng hợp; người xác định lựa chọn Có/Không. |
| 3 | Người ký Phòng tài chính | Xác nhận chức danh và thẩm quyền ký trong hai tuyến. “Có thể là Trưởng phòng tài chính” chưa phải kết luận. |
| 4 | Trạng thái và minh chứng tại bước 19 | Phòng Tài chính kế toán đã được xác định là đơn vị thực hiện. Cần xác nhận tên trạng thái, thông tin và minh chứng bắt buộc theo phương thức thanh toán. |
| 5 | Điều kiện hồ sơ đủ căn cứ | Cần checklist theo từng loại tạm ứng, bảo lãnh, giai đoạn thanh toán; ai chốt đủ căn cứ tại bước 2. |
| 6 | Template và mẫu bảng tổng hợp | Cần mẫu thực tế, thông tin bắt buộc và nguồn dữ liệu điền mẫu; không tự đặt mã biểu mẫu. |
| 7 | AI lập bảng tổng hợp | Xác nhận cách đọc hóa đơn, thông tin cần tổng hợp, xử lý thiếu/sai dữ liệu và người rà soát kết quả trước trình ký. |
| 8 | Ký lại sau trả sửa | Sơ đồ quy định trình lại từ Phòng tài chính; cần làm rõ cách quản lý phiên bản, chữ ký và ý kiến của bản trước. |
| 9 | Sửa đề nghị ảnh hưởng bảng tổng hợp | BPMN không quay về tuyến bảng tổng hợp khi sửa đề nghị; xác nhận cách xử lý nếu việc sửa làm thay đổi số tiền/hóa đơn của bảng đã ký. |
| 10 | Hình thức trình ký | Xác nhận các hình thức ngoài VOffice/VContract được phép, phạm vi tích hợp và cách ghi nhận đã ký hoặc từ chối. |
| 11 | Thực hiện thanh toán | Xác nhận căn cứ xác định thanh toán đã thực hiện, xử lý chuyển tiền lỗi/chưa thành công và minh chứng cho thủ tục tiền mặt. |
| 12 | Đồng bộ SAP | Xác nhận dữ liệu cần đồng bộ, thời điểm, trạng thái thành công/thất bại, xử lý gửi lại và tiêu chí được kết thúc lần thanh toán. |

# E. PHỤ LỤC - TÓM TẮT 20 BƯỚC MS24

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | Tập hợp và gửi hồ sơ thanh toán | Chuyên quản / Đơn vị mua sắm (ĐVMS) \[Q1\] | Hợp đồng; hồ sơ tạm ứng/bảo lãnh hoặc hồ sơ thanh toán theo giai đoạn. |
| 2 | Tiếp nhận và tổng hợp hồ sơ thanh toán | Phòng hợp đồng – Nhân sự chuyên thanh toán | Bộ hồ sơ thanh toán; hợp đồng; thông tin số tiền và người nhận; kết quả kiểm tra căn cứ. |
| 3 | Bổ sung hồ sơ thanh toán | Chuyên quản / Đơn vị mua sắm (ĐVMS) \[Q1\] | Yêu cầu bổ sung; thông tin/tài liệu còn thiếu; bộ hồ sơ đã bổ sung. |
| 4 | Xuất đề nghị chuyển tiền theo template | Hệ thống ĐTMS / AI | Template đề nghị chuyển tiền; thông tin thanh toán đã tổng hợp/cập nhật. Mẫu thực tế chưa cung cấp. |
| 5 | Cung cấp hóa đơn thanh toán | Phòng hợp đồng – Nhân sự chuyên thanh toán | Hóa đơn và thông tin thanh toán của đợt. |
| 6 | AI lập bảng tổng hợp thanh toán | Hệ thống ĐTMS / AI | Hóa đơn; dữ liệu thanh toán; mẫu bảng tổng hợp chưa được cung cấp. |
| 7 | Kiểm tra và ký bảng tổng hợp | Phòng tài chính \[Q3: người ký chưa rõ\] | Bảng tổng hợp thanh toán; hồ sơ/hóa đơn; ý kiến và kết quả ký. |
| 8 | Kiểm tra và ký bảng tổng hợp | Thủ trưởng VHT | Bảng tổng hợp; hồ sơ liên quan; ý kiến và kết quả ký. |
| 9 | Kiểm tra và ký xác nhận bảng tổng hợp | Văn thư | Bảng tổng hợp và tài liệu trình; ý kiến/kết quả ký xác nhận. |
| 10 | Kiểm tra và ký bảng tổng hợp | Tổng giám đốc Tập đoàn | Bảng tổng hợp; hồ sơ trình ký; ý kiến và kết quả ký. |
| 11 | Chỉnh sửa bảng tổng hợp thanh toán | Phòng hợp đồng – Nhân sự chuyên thanh toán | Bảng tổng hợp đã chỉnh sửa; ý kiến trả lại; hóa đơn/thông tin liên quan. |
| 12 | Hoàn thiện hồ sơ đề nghị chuyển tiền | Phòng hợp đồng – Nhân sự chuyên thanh toán | Đề nghị chuyển tiền; căn cứ thanh toán; bảng tổng hợp đã ký nếu cần; phương thức trình ký. |
| 13 | Kiểm tra và ký duyệt đề nghị chuyển tiền | Phòng tài chính \[Q3: người ký chưa rõ\] | Đề nghị chuyển tiền và hồ sơ kèm; ý kiến/kết quả ký duyệt. |
| 14 | Kiểm tra và ký đề nghị chuyển tiền | Thủ trưởng VHT | Đề nghị chuyển tiền; hồ sơ kèm; ý kiến/kết quả ký. |
| 15 | Kiểm tra và ký xác nhận đề nghị chuyển tiền | Văn thư | Đề nghị chuyển tiền; ý kiến/kết quả ký xác nhận. |
| 16 | Kiểm tra và ký đề nghị chuyển tiền | Tổng giám đốc Tập đoàn | Đề nghị chuyển tiền; hồ sơ kèm; ý kiến/kết quả ký. |
| 17 | Chỉnh sửa đề nghị chuyển tiền | Phòng hợp đồng – Nhân sự chuyên thanh toán | Đề nghị chuyển tiền đã chỉnh sửa; ý kiến trả lại; hồ sơ kèm. |
| 18 | Thanh toán tiền | Phòng Tài chính kế toán | Đề nghị đã ký duyệt; hợp đồng; thông tin nhận tiền; chứng từ/minh chứng thanh toán. |
| 19 | Cập nhật trạng thái và tải minh chứng | Phòng Tài chính kế toán | Thông tin thực hiện thanh toán; chứng từ/minh chứng theo phương thức; trạng thái cập nhật. |
| 20 | AI ghi nhận và đồng bộ trạng thái thanh toán lên SAP | Hệ thống ĐTMS / AI | Trạng thái thanh toán; thông tin thực hiện thanh toán; chứng từ/minh chứng; dữ liệu đồng bộ SAP. |
