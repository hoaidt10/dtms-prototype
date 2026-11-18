<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_03 (1).docx -->
<!-- pk-sha256: 8b3c62fd76519875c5f4964cf0ebb985586efd338e9bbbeefaeb98c2661c580d -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS23.03 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_03 (1).docx`. Trích dẫn thì ghi mã **DG-MS23.03** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS23.03 - NGHIỆM THU HÀNG HÓA DỊCH VỤ**

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
| 07/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS23.03. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

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
> [3. Vai trò tham gia 7](#_heading=)
>
> [4. Danh mục biểu mẫu/hồ sơ 7](#_heading=)
>
> [5. Nguyên tắc xử lý chung 8](#_heading=)

[**C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ 8**](#_heading=)

> [1. Ký và gửi báo cáo KCS tài sản (Bước 1) 8](#_heading=)
>
> [2. Ký và gửi báo cáo KCS dịch vụ (Bước 2) 9](#_heading=)
>
> [3. Tiếp nhận báo cáo và xác định hồ sơ nghiệm thu (Bước 3) 9](#_heading=)
>
> [4. Ghi nhận khắc phục và kiểm tra lại (Bước 4) 9](#_heading=)
>
> [5. AI hỗ trợ soạn biên bản theo template (Bước 5) 10](#_heading=)
>
> [6. Soạn thảo và hoàn thiện biên bản nghiệm thu — G1 (Bước 6) 10](#_heading=)
>
> [7. Tập hợp bộ hồ sơ nghiệm thu và thanh lý — G2 (Bước 7) 10](#_heading=)
>
> [8. AI kiểm tra hồ sơ sau hoàn thiện (Bước 8) 11](#_heading=)
>
> [9. Ký duyệt biên bản nghiệm thu (Bước 9) 11](#_heading=)
>
> [10. Ký biên bản nghiệm thu (Bước 10) 11](#_heading=)
>
> [11. Kiểm tra hồ sơ trình ký (Bước 11) 12](#_heading=)
>
> [12. Ký biên bản nghiệm thu (Bước 12) 12](#_heading=)
>
> [13. Cập nhật biên bản đã ký đầy đủ — G3 (Bước 13) 12](#_heading=)
>
> [14. AI cập nhật ngày nghiệm thu thực tế (Bước 14) 13](#_heading=)
>
> [15. Liên kết MS23.03 và MS23.04 13](#_heading=)
>
> [16. Kết thúc luồng MS23.03 14](#_heading=)

[**D. PHỤ LỤC - TÓM TẮT 14 BƯỚC MS23.03 14**](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải MS23.03 – Nghiệm thu hàng hóa/dịch vụ, làm rõ nguồn báo cáo KCS, kiểm tra căn cứ, soạn biên bản, tuyến ký và cập nhật ngày nghiệm thu thực tế. Tài liệu mô tả cả ký riêng nghiệm thu và ký chung hồ sơ nghiệm thu, thanh lý theo hợp đồng.

## 2. Phạm vi áp dụng

Bắt đầu khi có kết quả KCS/căn cứ để xác nhận nghiệm thu. KCS tài sản do Phòng Đảm bảo hàng hóa/Trung tâm Mua sắm ký và gửi; KCS dịch vụ do Đơn vị sử dụng ký và gửi. Luồng gồm 14 bước, kết thúc khi biên bản nghiệm thu được ký đầy đủ và ngày nghiệm thu thực tế được cập nhật. Các loại hồ sơ PAC/TAM, FAC/TAC hoặc nghiệm thu dịch vụ được xác định theo hợp đồng và dùng chung tuyến ký.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | QT.CNVTQĐ.ĐTXD.10.2.5 – Quy trình quản lý đơn hàng và thực hiện hợp đồng 2026 | Tài liệu nguồn về thực hiện hợp đồng, bàn giao và nghiệm thu; làm căn cứ tham chiếu hồ sơ thực hiện. |
| 2 | QT.CNVTQĐ.ĐTXD.10.2.4 – Quy trình quản lý hợp đồng 2026 | Tài liệu nguồn về quản lý hợp đồng, làm căn cứ tham chiếu hồ sơ và xử lý theo điều khoản hợp đồng. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | TTMS / ĐVSD | Trung tâm Mua sắm / Đơn vị sử dụng |
| 3 | KCS | Báo cáo/kết quả kiểm tra chất lượng dùng làm căn cứ nghiệm thu. |
| 4 | AI | Trí tuệ nhân tạo hỗ trợ soạn, kiểm tra hồ sơ sau hoàn thiện và cập nhật ngày thực tế. |
| 5 | PAC/TAM; FAC/TAC | Các ký hiệu loại hồ sơ nghiệm thu được lựa chọn theo hợp đồng. |
| 6 | G1 | Điểm chuyển thông tin biên bản nghiệm thu đã hoàn thiện nội dung, chưa ký sang MS23.04. |
| 7 | G2 | Điểm nhận biên bản thanh lý đã hoàn thiện từ MS23.04 để tập hợp ký chung. |
| 8 | G3 | Điểm chuyển kết quả thanh lý đã ký khi ký chung về MS23.04; ký riêng tiếp tục trình ký thanh lý sau khi MS23.03 hoàn tất. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Tập hợp báo cáo KCS đã ký từ đúng đơn vị chủ quản, hoàn thiện biên bản nghiệm thu và trình đúng tuyến ký. Nếu hợp đồng yêu cầu thanh lý và đủ điều kiện ký chung, tập hợp hai biên bản vào một bộ hồ sơ và dùng một tuyến ký tại MS23.03. Ngày nghiệm thu thực tế được ghi nhận từ biên bản đã ký đầy đủ.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Loại KCS/đối tượng nghiệm thu | Tài sản → bước 1; dịch vụ → bước 2. Hai nhánh cùng về bước 3. |
| Hồ sơ/KCS đủ điều kiện | Đủ hồ sơ, KCS đạt → bước 5. Thiếu chứng từ → bổ sung và kiểm tra lại bước 3. KCS chưa đạt → bước 4. |
| Hợp đồng yêu cầu thanh lý và đủ điều kiện ký chung | Ký chung → bước 7 chờ G2, tập hợp hai biên bản; ký riêng hoặc không yêu cầu thanh lý → bước 8. |
| AI kiểm tra sau hoàn thiện | OK → bước 9; không OK → bước 6 để chỉnh sửa. |
| Tuyến ký | Trưởng phòng Hợp đồng bước 9 → Giám đốc bước 10 → Văn thư kiểm tra bước 11 → Tổng Giám đốc bước 12. |
| Không đồng ý ký/kiểm tra không đạt | Trả Phòng Hợp đồng sửa soạn thảo hoặc hoàn thiện hồ sơ; thực hiện lại kiểm tra và trình ký. |
| Biên bản ký đầy đủ | Bước 13 cập nhật đủ chữ ký theo hợp đồng, gồm chữ ký nhà thầu/nhà cung cấp khi áp dụng; chuyển bước 14. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Phòng Đảm bảo hàng hóa / Trung tâm Mua sắm | Ký và gửi báo cáo KCS tài sản cho Chuyên quản hợp đồng. |
| 2 | Đơn vị sử dụng | Ký, gửi báo cáo KCS dịch vụ; phối hợp nhà thầu/nhà cung cấp khắc phục và ghi nhận kiểm tra lại cho tài sản/dịch vụ. |
| 3 | Phòng Hợp đồng / Chuyên quản hợp đồng | Tiếp nhận căn cứ, xác định hồ sơ, hoàn thiện biên bản, tập hợp hồ sơ ký chung, theo dõi và cập nhật bản ký đầy đủ. |
| 4 | Hệ thống ĐTMS / AI | Soạn dự thảo theo mẫu, kiểm tra hồ sơ sau hoàn thiện, cập nhật ngày nghiệm thu thực tế. |
| 5 | Trưởng phòng Hợp đồng | Ký duyệt biên bản hoặc trả sửa. |
| 6 | Giám đốc | Ký sau Trưởng phòng Hợp đồng hoặc trả sửa. |
| 7 | Văn thư | Kiểm tra hồ sơ sau hai cấp ký trước khi chuyển Tổng Giám đốc; không đạt thì trả hoàn thiện. |
| 8 | Tổng Giám đốc | Ký sau khi hồ sơ qua Văn thư; không đồng ý thì trả sửa. |
| 9 | Nhà thầu / Nhà cung cấp | Phối hợp khắc phục, cung cấp kết quả thực hiện và chữ ký bắt buộc theo hợp đồng. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Báo cáo KCS tài sản/dịch vụ đã ký | Căn cứ tiếp nhận và ký nghiệm thu. |
| 2 | Hợp đồng; tài liệu thực hiện/lắp đặt/đo kiểm | Xác định loại hồ sơ, điều kiện nghiệm thu và ký chung. |
| 3 | Danh sách vấn đề; kết quả khắc phục và kiểm tra lại | Xử lý căn cứ chưa đạt tại bước 4. |
| 4 | Template/dự thảo biên bản nghiệm thu | AI hỗ trợ soạn, Phòng Hợp đồng rà soát và hoàn thiện. |
| 5 | Biên bản nghiệm thu hoàn thiện, chưa ký | Đầu ra G1; sử dụng chuẩn bị thanh lý và trình ký. |
| 6 | Biên bản thanh lý hoàn thiện từ MS23.04 | Đầu vào G2 để tập hợp hồ sơ ký chung. |
| 7 | Bộ hồ sơ trình ký; kết quả kiểm tra AI | Căn cứ kiểm tra và xử lý tuyến ký. |
| 8 | Biên bản nghiệm thu ký đầy đủ; biên bản thanh lý ký khi ký chung | Cập nhật kết quả ký và thông tin thực tế, trả kết quả G3. |

## 5. Nguyên tắc xử lý chung

Báo cáo KCS phải được đơn vị chủ quản ký và gửi Chuyên quản hợp đồng; căn cứ đủ và đạt mới chuyển soạn biên bản.

Bước 6 hoàn thiện nội dung biên bản, chưa phải biên bản đã ký hoặc nghiệm thu hoàn thành.

Ký chung chỉ chuyển kiểm tra/trình ký khi cả biên bản nghiệm thu và biên bản thanh lý đã hoàn thiện. Chỉ dùng tuyến ký tại MS23.03, không chạy thêm tuyến thanh lý song song.

Ký riêng đi hết MS23.03 trước khi trình ký thanh lý tại MS23.04.

Nếu hồ sơ bị trả lại, sửa đúng biên bản có vấn đề, tập hợp lại bộ hồ sơ và trình lại theo luồng.

Các loại nghiệm thu dùng chung tuyến Trưởng phòng Hợp đồng → Giám đốc → Văn thư → Tổng Giám đốc.

Bước 13 theo dõi đủ chữ ký theo hợp đồng. Kết quả ký nghiệm thu và thanh lý được cập nhật riêng khi ký chung.

AI cập nhật ngày thực tế có trong biên bản đã ký; chức năng dùng chung với MS23 Tổng quan thực hiện một lần.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Giữ nguyên 14 bước và các điểm giao G1, G2, G3. Hai nhánh KCS tài sản và dịch vụ hợp nhất trước khi soạn biên bản; các hồ sơ ký chung hoặc ký riêng cùng sử dụng tuyến ký trong luồng này.

## 1. Ký và gửi báo cáo KCS tài sản (Bước 1)

Tác nhân: Phòng Đảm bảo hàng hóa / Trung tâm Mua sắm.

Ký báo cáo KCS tài sản; gửi báo cáo cho Chuyên quản hợp đồng thuộc Phòng Hợp đồng để làm căn cứ soạn thảo và trình Trưởng phòng Hợp đồng ký nghiệm thu.

Hồ sơ/biểu mẫu: Báo cáo KCS tài sản đã ký; căn cứ/kết quả kiểm tra.

Kết quả: Chuyên quản nhận báo cáo; Trưởng phòng Hợp đồng sử dụng báo cáo làm căn cứ ký nghiệm thu.

Chuyển báo cáo KCS tài sản đã ký đến bước 3.

## 2. Ký và gửi báo cáo KCS dịch vụ (Bước 2)

Tác nhân: Đơn vị Sử dụng.

Ký và gửi báo cáo KCS dịch vụ cho Chuyên quản hợp đồng thuộc Phòng Hợp đồng để làm căn cứ soạn thảo và trình Trưởng phòng Hợp đồng ký nghiệm thu.

Hồ sơ/biểu mẫu: Báo cáo KCS dịch vụ đã ký; kết quả/khối lượng dịch vụ.

Kết quả: Có báo cáo đã ký từ ĐVSD làm căn cứ nghiệm thu dịch vụ.

Chuyển báo cáo KCS dịch vụ đã ký đến bước 3.

## 3. Tiếp nhận báo cáo và xác định hồ sơ nghiệm thu (Bước 3)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Chuyên quản hợp đồng tập hợp báo cáo đã ký từ đơn vị chủ quản; ghi nhận loại hồ sơ và kết quả nghiệm thu theo Hợp đồng. Kiểm tra căn cứ trước khi chuyển soạn biên bản.

Hồ sơ/biểu mẫu: Báo cáo KCS đã ký; tài liệu thực hiện/lắp đặt/đo kiểm; Hợp đồng.

Kết quả: Đủ hồ sơ, KCS đạt: chuyển AI hỗ trợ soạn biên bản. Thiếu chứng từ: yêu cầu đơn vị chủ quản bổ sung. KCS chưa đạt: chuyển ĐVSD phối hợp khắc phục.

Gateway “Hồ sơ/KCS đủ điều kiện?”: Có → bước 5. Thiếu chứng từ → yêu cầu đơn vị chủ quản bổ sung, tập hợp và kiểm tra lại tại bước 3. KCS chưa đạt → bước 4.

## 4. Ghi nhận khắc phục và kiểm tra lại (Bước 4)

Tác nhân: Đơn vị Sử dụng.

Phối hợp Nhà thầu/Nhà cung cấp khắc phục nội dung chưa đạt cho cả tài sản và dịch vụ; ghi nhận kết quả kiểm tra lại. Chuyển lại đơn vị chủ quản để ký/cập nhật báo cáo KCS tương ứng.

Hồ sơ/biểu mẫu: Danh sách vấn đề; kết quả khắc phục và kiểm tra lại.

Kết quả: Quay lại nguồn KCS tài sản/dịch vụ; chỉ tiếp tục nghiệm thu khi có căn cứ phù hợp.

Sau khắc phục và kiểm tra lại, quay về phân loại tài sản/dịch vụ để ký hoặc cập nhật báo cáo KCS tại bước 1/2, rồi chuyển lại bước 3.

## 5. AI hỗ trợ soạn biên bản theo template (Bước 5)

Tác nhân: Hệ thống ĐTMS / AI.

Hỗ trợ soạn dự thảo biên bản nghiệm thu theo template phù hợp loại hồ sơ đã xác định, sử dụng báo cáo KCS và căn cứ đã kiểm tra.

Hồ sơ/biểu mẫu: Template biên bản nghiệm thu; báo cáo KCS và căn cứ liên quan.

Kết quả: Có dự thảo để Phòng Hợp đồng soạn thảo/hoàn thiện.

Chuyển dự thảo để Phòng Hợp đồng/Chuyên quản hợp đồng soạn thảo và hoàn thiện tại bước 6.

## 6. Soạn thảo và hoàn thiện biên bản nghiệm thu — G1 (Bước 6)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Hoàn thiện biên bản theo mẫu, rà soát dự thảo AI và đính kèm báo cáo KCS. Tại đây biên bản mới hoàn thiện nội dung, CHƯA KÝ. Xác định hợp đồng có yêu cầu thanh lý và có đủ điều kiện ký chung hay không.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu hoàn thiện; KCS đã ký; hợp đồng và thông tin điều kiện ký chung.

Kết quả: G1: MS23.04 sử dụng thông tin tại bước này. Ký chung: chờ G2 để tập hợp hai biên bản. Ký riêng / không yêu cầu thanh lý: tiếp tục kiểm tra và ký nghiệm thu.

G1 chuyển thông tin nghiệm thu đã hoàn thiện nội dung, chưa ký sang MS23.04 để kiểm tra điều kiện/chuẩn bị thanh lý. Nếu ký chung → bước 7; nếu ký riêng hoặc không yêu cầu thanh lý → bước 8.

## 7. Tập hợp bộ hồ sơ nghiệm thu và thanh lý — G2 (Bước 7)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Chờ MS23.04 hoàn thiện biên bản thanh lý tại G2. Tập hợp biên bản nghiệm thu và biên bản thanh lý vào cùng bộ hồ sơ. Chỉ chuyển kiểm tra / trình ký khi cả hai biên bản đã hoàn thiện; thực hiện một tuyến ký tại MS23.03.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu chưa ký; biên bản thanh lý đã hoàn thiện từ MS23.04.

Kết quả: Tiếp tục AI kiểm tra và tuyến ký chung. Không chạy thêm tuyến ký thanh lý song song tại MS23.04.

Nhận G2 từ MS23.04. Chỉ khi cả hai biên bản đã hoàn thiện mới chuyển bước 8; không chạy hai tuyến ký trùng nhau.

## 8. AI kiểm tra hồ sơ sau hoàn thiện (Bước 8)

Tác nhân: Hệ thống ĐTMS / AI.

Kiểm tra phiên bản biên bản và căn cứ sau khi Phòng Hợp đồng hoàn thiện, trước khi chuyển Trưởng phòng Hợp đồng ký duyệt. Ký chung: xử lý cả biên bản nghiệm thu và biên bản thanh lý trong cùng hồ sơ; ký riêng: chỉ xử lý biên bản nghiệm thu.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu; báo cáo KCS; chứng từ/căn cứ.

Kết quả: OK: chuyển ký duyệt. Không OK: trả bước soạn thảo/hoàn thiện.

Gateway “AI kiểm tra OK?”: OK → bước 9; Không OK → bước 6. Với ký chung, chỉnh sửa đúng biên bản có vấn đề và tập hợp lại bộ hồ sơ trước kiểm tra/trình lại.

## 9. Ký duyệt biên bản nghiệm thu (Bước 9)

Tác nhân: Trưởng phòng Hợp đồng.

Xem biên bản nghiệm thu và báo cáo KCS làm căn cứ; ghi nhận đồng ý ký hoặc ý kiến không đồng ý theo tuyến ký đã chốt. Ký chung: xử lý cả biên bản nghiệm thu và biên bản thanh lý trong cùng hồ sơ; ký riêng: chỉ xử lý biên bản nghiệm thu.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu; báo cáo KCS đã ký; bộ hồ sơ trình ký.

Kết quả: Đồng ý: chuyển cấp tiếp theo. Không đồng ý: trả Phòng Hợp đồng sửa soạn thảo.

Đồng ý ký → bước 10. Không đồng ý → bước 6 để Phòng Hợp đồng sửa soạn thảo, kiểm tra và trình lại.

## 10. Ký biên bản nghiệm thu (Bước 10)

Tác nhân: Giám đốc.

Xem biên bản nghiệm thu và báo cáo KCS làm căn cứ; ghi nhận đồng ý ký hoặc ý kiến không đồng ý theo tuyến ký đã chốt. Ký chung: xử lý cả biên bản nghiệm thu và biên bản thanh lý trong cùng hồ sơ; ký riêng: chỉ xử lý biên bản nghiệm thu.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu; báo cáo KCS đã ký; bộ hồ sơ trình ký.

Kết quả: Đồng ý: chuyển cấp tiếp theo. Không đồng ý: trả Phòng Hợp đồng sửa soạn thảo.

Đồng ý ký → bước 11. Không đồng ý → bước 6 để sửa soạn thảo.

## 11. Kiểm tra hồ sơ trình ký (Bước 11)

Tác nhân: Văn thư.

Kiểm tra hồ sơ đã được Trưởng phòng Hợp đồng và Giám đốc ký trước khi chuyển Tổng Giám đốc. Ký chung: kiểm tra cả hai biên bản; ký riêng: kiểm tra hồ sơ nghiệm thu.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu; báo cáo KCS và hồ sơ trình ký kèm theo.

Kết quả: Đạt: chuyển Tổng Giám đốc ký. Không đạt: trả Phòng Hợp đồng chỉnh sửa, hoàn thiện lại hồ sơ.

Hồ sơ đạt yêu cầu → bước 12. Không đạt → trả Phòng Hợp đồng chỉnh sửa, hoàn thiện hồ sơ, rồi thực hiện lại kiểm tra và trình ký.

## 12. Ký biên bản nghiệm thu (Bước 12)

Tác nhân: Tổng Giám đốc.

Xem biên bản nghiệm thu và báo cáo KCS làm căn cứ; ghi nhận đồng ý ký hoặc ý kiến không đồng ý theo tuyến ký đã chốt. Ký chung: xử lý cả biên bản nghiệm thu và biên bản thanh lý trong cùng hồ sơ; ký riêng: chỉ xử lý biên bản nghiệm thu.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu; báo cáo KCS đã ký; bộ hồ sơ trình ký.

Kết quả: Đồng ý: chuyển theo dõi và cập nhật biên bản ký đầy đủ tại bước 13. Không đồng ý: trả Phòng Hợp đồng sửa soạn thảo.

Đồng ý ký → bước 13. Không đồng ý → bước 6. Khi Tổng Giám đốc đồng ý, tiếp tục theo dõi đủ chữ ký theo hợp đồng tại bước 13.

## 13. Cập nhật biên bản đã ký đầy đủ — G3 (Bước 13)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Theo dõi tuyến ký và cập nhật đầy đủ chữ ký theo hợp đồng. Ký chung: cập nhật riêng kết quả ký biên bản nghiệm thu và biên bản thanh lý; gửi kết quả thanh lý về MS23.04 tại G3. Ký riêng: cập nhật biên bản nghiệm thu, hoàn tất MS23.03 rồi mới trình ký thanh lý tại MS23.04.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu đã ký; biên bản thanh lý đã ký nếu ký chung; hồ sơ ký liên quan.

Kết quả: MS23.03 tiếp tục cập nhật nghiệm thu. G3: MS23.04 nhận bản thanh lý đã ký khi ký chung; ký riêng chỉ bắt đầu trình ký sau khi MS23.03 hoàn tất.

Nhận chữ ký bắt buộc từ nhà thầu/nhà cung cấp sau Tổng Giám đốc ký theo hợp đồng. Ký chung: gửi kết quả thanh lý đã ký về MS23.04 tại G3, đồng thời chuyển bước 14 để cập nhật nghiệm thu. Ký riêng: tiếp tục hoàn tất bước 14 trước khi trình ký thanh lý tại MS23.04.

## 14. AI cập nhật ngày nghiệm thu thực tế (Bước 14)

Tác nhân: Hệ thống ĐTMS / AI.

Đọc biên bản đã ký để cập nhật ngày nghiệm thu thực tế có trong văn bản, phục vụ theo dõi và căn cứ thanh toán theo Hợp đồng. Chức năng dùng chung với MS23 tổng quan chỉ thực hiện một lần.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu đã ký đầy đủ.

Kết quả: Ghi nhận ngày nghiệm thu thực tế; hoàn tất một hồ sơ nghiệm thu. Nếu ký riêng thanh lý: chỉ sau khi bước này hoàn tất mới tiếp tục trình ký MS23.04.

Sau ghi nhận ngày nghiệm thu thực tế, hoàn tất một hồ sơ nghiệm thu với biên bản đã ký đầy đủ/được phê duyệt. Ký riêng thanh lý chỉ tiếp tục trình ký MS23.04 sau khi bước này hoàn tất.

## 15. Liên kết MS23.03 và MS23.04

| **Điểm giao/Nhánh** | **Nội dung theo BPMN** |
|:--:|:--:|
| G1 – Bước 6 | MS23.04 nhận thông tin biên bản nghiệm thu hoàn thiện nội dung, chưa ký để kiểm tra điều kiện và chuẩn bị thanh lý. |
| G2 – Bước 7 | MS23.03 nhận biên bản thanh lý đã hoàn thiện; tập hợp cùng biên bản nghiệm thu và trình ký chung. |
| G3 – Bước 13 khi ký chung | MS23.03 gửi kết quả biên bản thanh lý đã ký về MS23.04; cập nhật kết quả nghiệm thu riêng trong MS23.03. |
| Ký riêng | Hoàn tất MS23.03 tại bước 14 rồi mới tiếp tục trình ký thanh lý tại MS23.04. |
| Trả hồ sơ ký chung | Sửa đúng biên bản có vấn đề, tập hợp lại bộ hồ sơ, kiểm tra và trình lại; không tạo thêm tuyến ký thanh lý song song. |

## 16. Kết thúc luồng MS23.03

Luồng hoàn tất khi biên bản nghiệm thu đã có đầy đủ chữ ký theo hợp đồng và ngày nghiệm thu thực tế đã được cập nhật tại bước 14. Hoàn thiện nội dung ở bước 6 chỉ là giai đoạn chuẩn bị hồ sơ. Kết quả nghiệm thu phục vụ theo dõi và căn cứ thanh toán theo hợp đồng; nếu ký riêng thanh lý, MS23.04 tiếp tục trình ký sau khi nghiệm thu hoàn tất.

# D. PHỤ LỤC - TÓM TẮT 14 BƯỚC MS23.03

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | Ký và gửi báo cáo KCS tài sản | Phòng Đảm bảo hàng hóa / Trung tâm Mua sắm | Báo cáo KCS tài sản đã ký; căn cứ/kết quả kiểm tra. |
| 2 | Ký và gửi báo cáo KCS dịch vụ | Đơn vị Sử dụng | Báo cáo KCS dịch vụ đã ký; kết quả/khối lượng dịch vụ. |
| 3 | Tiếp nhận báo cáo và xác định hồ sơ nghiệm thu | Phòng Hợp đồng / Chuyên quản hợp đồng | Báo cáo KCS đã ký; tài liệu thực hiện/lắp đặt/đo kiểm; Hợp đồng. |
| 4 | Ghi nhận khắc phục và kiểm tra lại | Đơn vị Sử dụng | Danh sách vấn đề; kết quả khắc phục và kiểm tra lại. |
| 5 | AI hỗ trợ soạn biên bản theo template | Hệ thống ĐTMS / AI | Template biên bản nghiệm thu; báo cáo KCS và căn cứ liên quan. |
| 6 | Soạn thảo và hoàn thiện biên bản nghiệm thu — G1 | Phòng Hợp đồng / Chuyên quản hợp đồng | Biên bản nghiệm thu hoàn thiện; KCS đã ký; hợp đồng và thông tin điều kiện ký chung. |
| 7 | Tập hợp bộ hồ sơ nghiệm thu và thanh lý — G2 | Phòng Hợp đồng / Chuyên quản hợp đồng | Biên bản nghiệm thu chưa ký; biên bản thanh lý đã hoàn thiện từ MS23.04. |
| 8 | AI kiểm tra hồ sơ sau hoàn thiện | Hệ thống ĐTMS / AI | Biên bản nghiệm thu; báo cáo KCS; chứng từ/căn cứ. |
| 9 | Ký duyệt biên bản nghiệm thu | Trưởng phòng Hợp đồng | Biên bản nghiệm thu; báo cáo KCS đã ký; bộ hồ sơ trình ký. |
| 10 | Ký biên bản nghiệm thu | Giám đốc | Biên bản nghiệm thu; báo cáo KCS đã ký; bộ hồ sơ trình ký. |
| 11 | Kiểm tra hồ sơ trình ký | Văn thư | Biên bản nghiệm thu; báo cáo KCS và hồ sơ trình ký kèm theo. |
| 12 | Ký biên bản nghiệm thu | Tổng Giám đốc | Biên bản nghiệm thu; báo cáo KCS đã ký; bộ hồ sơ trình ký. |
| 13 | Cập nhật biên bản đã ký đầy đủ — G3 | Phòng Hợp đồng / Chuyên quản hợp đồng | Biên bản nghiệm thu đã ký; biên bản thanh lý đã ký nếu ký chung; hồ sơ ký liên quan. |
| 14 | AI cập nhật ngày nghiệm thu thực tế | Hệ thống ĐTMS / AI | Biên bản nghiệm thu đã ký đầy đủ. |
