<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_02.docx -->
<!-- pk-sha256: 815436b206e5f08e40f6bce62fd642cc9d125c98232596b4a46f1379e0630e15 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS23.02 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_02.docx`. Trích dẫn thì ghi mã **DG-MS23.02** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS23.02 - BÀN GIAO HÀNG HÓA DỊCH VỤ**

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
| 07/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS23.02. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

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

> [1. Nhận thông báo bàn giao (Bước 1) 8](#_heading=)
>
> [2. Lập và gửi thông báo giao hàng (Bước 2) 9](#_heading=)
>
> [3. Ghi nhận giao nhận hàng và hồ sơ kho (Bước 3) 9](#_heading=)
>
> [4. Ghi nhận xác nhận dịch vụ (Bước 4) 9](#_heading=)
>
> [5. Lập yêu cầu kiểm tra chất lượng (Bước 5) 10](#_heading=)
>
> [6. Ghi nhận kết quả kiểm tra chất lượng (Bước 6) 10](#_heading=)
>
> [7. Lập biên bản không đạt và ghi nhận hướng xử lý (Bước 7) 10](#_heading=)
>
> [8. Theo dõi bổ sung / thay thế trong 7 ngày (Bước 8) 11](#_heading=)
>
> [9. Ghi nhận quyền từ chối và chuyển xử lý theo HĐ (Bước 9) 11](#_heading=)
>
> [10. Trả hàng / ghi nhận vướng mắc xử lý (Bước 10) 11](#_heading=)
>
> [11. Xử lý vi phạm qua MS23.01 (Bước 11) 11](#_heading=)
>
> [12. Thực hiện thủ tục hủy HĐ / Đơn hàng (Bước 12) 12](#_heading=)
>
> [13. Lập Tờ trình xin ý kiến Người có thẩm quyền (Bước 13) 12](#_heading=)
>
> [14. Tập hợp và xác nhận đủ hồ sơ bàn giao (Bước 14) 12](#_heading=)
>
> [15. Bổ sung hàng / chứng từ / căn cứ (Bước 15) 13](#_heading=)
>
> [16. AI kiểm tra chứng từ / căn cứ (Bước 16) 13](#_heading=)
>
> [17. AI hỗ trợ soạn HOC (Bước 17) 13](#_heading=)
>
> [18. Hoàn thiện hồ sơ và HOC (Bước 18) 13](#_heading=)
>
> [19. AI kiểm tra HOC trước duyệt (Bước 19) 14](#_heading=)
>
> [20. Phê duyệt hồ sơ bàn giao để trình ký (Bước 20) 14](#_heading=)
>
> [21. Trình ký và cập nhật HOC đã ký (Bước 21) 14](#_heading=)
>
> [22. AI cập nhật ngày bàn giao thực tế (Bước 22) 15](#_heading=)
>
> [23. Trao đổi, trình ký và liên kết luồng khác 15](#_heading=)
>
> [24. Kết thúc và các nhánh chờ xử lý 15](#_heading=)

[**D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 15**](#_heading=)

[**E. PHỤ LỤC - TÓM TẮT 22 BƯỚC MS23.02** **17**](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải MS23.02 – Bàn giao hàng hóa/dịch vụ, làm rõ nhánh hàng hóa và dịch vụ, kiểm tra chất lượng, bổ sung/thay thế hàng không đạt, xử lý theo hợp đồng và lập, ký, cập nhật hồ sơ HOC.

## 2. Phạm vi áp dụng

Bắt đầu khi nhà thầu/nhà cung cấp thông báo bàn giao. Nhánh dịch vụ ghi nhận xác nhận thực hiện dịch vụ và chuyển MS23.03 để Đơn vị sử dụng tiếp tục chủ trì nghiệm thu. Nhánh hàng hóa tiếp nhận, kiểm tra chất lượng, xử lý hàng không đạt khi phát sinh và hoàn thiện hồ sơ HOC khi đủ điều kiện. Giữ nguyên 22 bước trên BPMN; các bước thuộc nhánh thay thế không phải chuỗi bắt buộc cho mọi hồ sơ.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | QT.CNVTQĐ.ĐTXD.10.2.5 – Quy trình quản lý đơn hàng và thực hiện hợp đồng 2026 | Tài liệu nguồn về giao nhận, kiểm tra và xử lý trong quá trình thực hiện hợp đồng; BPMN dẫn chiếu bước 3a, 4a–9c và mục 6.6. |
| 2 | QT.CNVTQĐ.ĐTXD.10.2.4 – Quy trình quản lý hợp đồng 2026 | Tài liệu nguồn về quản lý hợp đồng, làm căn cứ tham chiếu hồ sơ và xử lý theo hợp đồng. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | ĐVMS / ĐVSD | Đơn vị mua sắm / Đơn vị sử dụng |
| 3 | HĐ / PO | Hợp đồng / Đơn hàng |
| 4 | AI | Trí tuệ nhân tạo hỗ trợ kiểm tra, soạn HOC và cập nhật ngày thực tế. |
| 5 | KCS | Thông tin/kết quả kiểm tra chất lượng được sơ đồ sử dụng; mẫu, tiêu chí và phân công cần làm rõ. |
| 6 | HOC | Hồ sơ/văn bản bàn giao được lập và ký theo phạm vi hợp đồng; cần cung cấp mẫu và tên gọi chính thức. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Ghi nhận kết quả giao nhận đúng đối tượng hàng hóa hoặc dịch vụ. Với hàng hóa, chỉ tiếp tục lập HOC khi đủ hàng, chứng từ và căn cứ chất lượng đạt; hàng không đạt được xử lý theo nhánh tương ứng. HOC đã ký đầy đủ là căn cứ cập nhật ngày bàn giao thực tế.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Đối tượng bàn giao | Hàng hóa → bước 2, 3, 5, 6. Dịch vụ → bước 4 và chuyển hồ sơ cho MS23.03; không qua Phòng Quản lý tài sản/nhập kho/KCS kho. |
| Kết quả chất lượng | Đạt → bước 14. Không đạt → xác định đã bổ sung/thay thế hay chưa. |
| Không đạt lần đầu | Bước 7 lập biên bản; lựa chọn từ chối ngay → bước 9 hoặc cho bổ sung/thay thế → bước 8. |
| Bổ sung/thay thế trong 7 ngày | Có hàng trong hạn → bước 3 để làm lại giao nhận và kiểm tra. Không khắc phục trong hạn → bước 9. |
| Sau bổ sung/thay thế vẫn không đạt | Chuyển bước 9; không mặc định tiếp tục bàn giao hoặc mở thêm vòng thay thế. |
| Hướng xử lý theo HĐ/PO | Phạt/hồ sơ xử lý → bước 11; không hoàn thành mục tiêu mua sắm → bước 12; vướng mắc đặc thù/ngoại lệ → bước 13. Không phải ba mức bắt buộc tuần tự. |
| Đủ hồ sơ bàn giao | Đủ → bước 16. Chưa đủ → bước 15, tập hợp và xác nhận lại bước 14. |
| AI kiểm tra bước 16 | OK → bước 17. Không OK → bước 14 để bổ sung/chỉnh sửa hồ sơ. |
| AI kiểm tra bước 19 | OK → bước 20. Không OK → bước 18. |
| Trưởng phòng Hợp đồng duyệt | Có → bước 21. Không → bước 14 theo mũi tên sơ đồ. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Phòng Hợp đồng / ĐVMS | Tiếp nhận/lập thông báo; xử lý theo hợp đồng; tập hợp, bổ sung, hoàn thiện hồ sơ; trình ký và cập nhật HOC ký đầy đủ. |
| 2 | Phòng Quản lý tài sản | Tiếp nhận hàng hóa, hồ sơ kho; lập yêu cầu kiểm tra; xử lý kết quả không đạt lần đầu; theo dõi thay thế và ghi nhận quyền từ chối. |
| 3 | Đơn vị sử dụng | Xác nhận kết quả/khối lượng dịch vụ; ghi nhận kết quả kiểm tra chất lượng hàng hóa; phối hợp trả hàng và xử lý vi phạm. |
| 4 | Hệ thống ĐTMS / AI | Kiểm tra căn cứ, hỗ trợ soạn HOC, kiểm tra trước duyệt và cập nhật ngày bàn giao thực tế từ HOC ký. |
| 5 | Trưởng phòng Hợp đồng | Phê duyệt hồ sơ bàn giao để trình ký hoặc yêu cầu hoàn thiện lại. |
| 6 | Nhà thầu / Nhà cung cấp | Thông báo bàn giao, cung cấp hàng/dịch vụ, bổ sung/thay thế khi áp dụng và gửi bản HOC ký đủ. |
| 7 | Người có thẩm quyền | Được xin ý kiến ở nhánh ngoại lệ bước 13; tuyến ký HOC và tuyến duyệt hủy chưa chốt. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Thông báo giao hàng; Hợp đồng/Đơn hàng | Tiếp nhận, phân loại và gửi thông báo cho nhánh hàng hóa. |
| 2 | Hồ sơ giao nhận, hồ sơ kho; yêu cầu kiểm tra chất lượng | Ghi nhận hàng đã tiếp nhận và yêu cầu kiểm tra. |
| 3 | Kết quả KCS; biên bản không đạt | Đánh giá chất lượng và ghi nhận căn cứ xử lý. |
| 4 | Thông tin bổ sung/thay thế; biên bản trả hàng | Theo dõi trong hạn 7 ngày và xử lý hàng không đạt. |
| 5 | Biên bản vi phạm; hồ sơ phạt/hủy; tờ trình xin ý kiến | Hồ sơ nhánh xử lý theo HĐ/PO hoặc ngoại lệ. |
| 6 | Biên bản xác nhận thực hiện dịch vụ (bước 3a) | Hồ sơ dịch vụ để tiếp tục MS23.03 (bước 3b). |
| 7 | Hồ sơ bàn giao; chứng từ/căn cứ; kết quả AI | Đầu vào kiểm tra và soạn HOC. |
| 8 | Mẫu/dự thảo HOC; bộ hồ sơ trình ký | Hoàn thiện, duyệt và trình ký; mẫu và tuyến ký cần xác nhận. |
| 9 | HOC đã ký đầy đủ | Căn cứ cập nhật ngày bàn giao thực tế tại bước 22. |

## 5. Nguyên tắc xử lý chung

Giữ nguyên 22 số bước; tách đúng nhánh dịch vụ và hàng hóa. Dịch vụ không qua kho hoặc KCS kho.

Chất lượng đạt mới chuyển tập hợp hồ sơ bàn giao. Hàng bổ sung/thay thế phải quay bước 3 để làm lại giao nhận, nhập kho và kiểm tra.

Hạn bổ sung/thay thế là 7 ngày kể từ ngày lập biên bản không đạt; cách tính ngày cụ thể cần xác nhận.

Sau bổ sung/thay thế vẫn không đạt hoặc không khắc phục trong hạn, chuyển ghi nhận quyền từ chối và xử lý theo hợp đồng.

Phạt, hủy và xin ý kiến là các hướng xử lý theo căn cứ thực tế, không phải ba bước bắt buộc tuần tự.

HOC có thể theo từng đợt hoặc toàn bộ tùy hợp đồng. Chỉ dùng HOC có đủ chữ ký để cập nhật ngày thực tế.

AI chỉ cập nhật ngày có trong văn bản, không tự suy ra ngày còn thiếu. Chức năng cập nhật dùng chung với MS23 Tổng quan thực hiện một lần.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Các bước giữ nguyên số trên BPMN. Diễn giải kết quả và nơi chuyển tiếp theo từng nhánh, không bổ sung tuyến ký hoặc luồng tiếp sau chỉ đạo khi chưa được chốt.

## 1. Nhận thông báo bàn giao (Bước 1)

Tác nhân: Phòng Hợp đồng.

Nhận thông báo bàn giao từ Nhà thầu/Nhà cung cấp; ghi nhận thông tin gắn với Hợp đồng/Đơn hàng để kiểm tra đối tượng bàn giao là hàng hóa hay dịch vụ.

Hồ sơ/biểu mẫu: Thông báo giao hàng; Hợp đồng/Đơn hàng liên quan.

Kết quả: Có thông tin để phân loại hàng hóa/dịch vụ; chỉ hàng hóa mới chuyển thông báo cho Phòng Quản lý tài sản.

Gateway “Đối tượng bàn giao?”: hàng hóa → bước 2; dịch vụ → bước 4.

## 2. Lập và gửi thông báo giao hàng (Bước 2)

Tác nhân: Phòng Hợp đồng.

Lập thông báo giao hàng từ thông tin đã nhận; gửi Phòng Quản lý tài sản để chuẩn bị tiếp nhận.

Hồ sơ/biểu mẫu: Thông báo giao hàng; thông tin hàng hóa và hồ sơ liên quan.

Kết quả: Phòng Quản lý tài sản nhận thông báo giao hàng.

Phòng Quản lý tài sản nhận thông báo để thực hiện giao nhận hàng và hồ sơ kho tại bước 3.

## 3. Ghi nhận giao nhận hàng và hồ sơ kho (Bước 3)

Tác nhân: Phòng Quản lý tài sản.

Tiếp nhận hàng hóa; ghi nhận giao hàng và hồ sơ kho. Hàng bổ sung/thay thế quay lại bước này để làm lại thủ tục giao nhận, nhập kho và kiểm tra chất lượng.

Hồ sơ/biểu mẫu: Hồ sơ giao nhận, hồ sơ kho; hàng hóa được giao. \[?\] Mẫu và thao tác ĐTMS/SAP.

Kết quả: Có thông tin giao hàng và hồ sơ kho để lập yêu cầu kiểm tra chất lượng.

Chuyển bước 5 để lập yêu cầu kiểm tra chất lượng. Hàng bổ sung/thay thế trong hạn cũng quay về bước này.

## 4. Ghi nhận xác nhận dịch vụ (Bước 4)

Tác nhân: Đơn vị Sử dụng.

Trực tiếp theo dõi Nhà thầu thực hiện dịch vụ và xác nhận kết quả/khối lượng theo Hợp đồng. Việc giao nhận dịch vụ không qua Phòng Quản lý tài sản, nhập kho hay KCS kho.

Hồ sơ/biểu mẫu: Biên bản xác nhận thực hiện dịch vụ (bước 3a); thông tin kết quả/khối lượng dịch vụ.

Kết quả: Có hồ sơ để ĐVSD tiếp tục chủ trì nghiệm thu dịch vụ tại MS23.03 (bước 3b). Hai bên xử lý/khắc phục nội dung chưa đạt trước khi ký nghiệm thu hoàn thành.

Chuyển hồ sơ dịch vụ sang MS23.03 để ĐVSD tiếp tục chủ trì nghiệm thu. Nhánh kết thúc tại “Có hồ sơ dịch vụ cho MS23.03”, chưa đồng nghĩa nghiệm thu hoàn thành.

## 5. Lập yêu cầu kiểm tra chất lượng (Bước 5)

Tác nhân: Phòng Quản lý tài sản.

Lập yêu cầu kiểm tra chất lượng đối với hàng hóa đã tiếp nhận. \[?\] Chi tiết quy trình sẽ làm rõ thêm với Phòng Quản lý tài sản.

Hồ sơ/biểu mẫu: Yêu cầu kiểm tra chất lượng; hồ sơ giao hàng/kho. \[?\] Mẫu và tiêu chí kiểm tra.

Kết quả: Có yêu cầu để thực hiện và ghi nhận kết quả kiểm tra.

Chuyển bước 6 để ghi nhận kết quả kiểm tra chất lượng.

## 6. Ghi nhận kết quả kiểm tra chất lượng (Bước 6)

Tác nhân: Đơn vị Sử dụng.

Ghi nhận kết quả kiểm tra chất lượng hàng hóa và căn cứ đánh giá; phân biệt kết quả lần đầu với kết quả sau bổ sung/thay thế. \[?\] Làm rõ phân công kiểm tra với Phòng Quản lý tài sản.

Hồ sơ/biểu mẫu: Kết quả KCS; hồ sơ giao hàng và yêu cầu kiểm tra chất lượng.

Kết quả: Đạt: đi tiếp luồng bàn giao hiện tại. Không đạt: chuyển xử lý theo nhánh tương ứng.

Đạt → bước 14. Không đạt → gateway “Đã bổ sung/thay thế?”: chưa → bước 7; đã bổ sung/thay thế mà vẫn không đạt → bước 9.

## 7. Lập biên bản không đạt và ghi nhận hướng xử lý (Bước 7)

Tác nhân: Phòng Quản lý tài sản.

Lập biên bản hàng hóa không đạt. Quyết định từ chối ngay hoặc đồng ý cho bổ sung/thay thế hàng hóa phù hợp trong 7 ngày kể từ ngày lập biên bản.

Hồ sơ/biểu mẫu: Biên bản không đạt; kết quả KCS; Hợp đồng/Đơn hàng.

Kết quả: Ghi nhận hướng xử lý và ngày bắt đầu hạn 7 ngày; không dùng nhánh sửa đổi HĐ cũ.

Gateway “Hướng xử lý lần đầu?”: cho bổ sung/thay thế → bước 8; từ chối ngay → bước 9.

## 8. Theo dõi bổ sung / thay thế trong 7 ngày (Bước 8)

Tác nhân: Phòng Quản lý tài sản.

Theo dõi Nhà thầu/Nhà cung cấp bổ sung/thay thế hàng hóa trong 7 ngày từ ngày lập biên bản; ghi nhận việc khắc phục và hàng giao bổ sung/thay thế.

Hồ sơ/biểu mẫu: Biên bản không đạt; thông tin hàng hóa bổ sung/thay thế.

Kết quả: Có hàng trong hạn: quay lại bước 3 để tiếp nhận và kiểm tra lại. Không khắc phục trong hạn: chuyển xử lý.

Gateway “Có hàng bổ sung/thay thế trong hạn 7 ngày?”: Có → bước 3 để tiếp nhận và kiểm tra lại; Không khắc phục trong hạn → bước 9.

## 9. Ghi nhận quyền từ chối và chuyển xử lý theo HĐ (Bước 9)

Tác nhân: Phòng Quản lý tài sản.

Ghi nhận quyết định từ chối ngay hoặc quyền từ chối khi hàng sau bổ sung/thay thế vẫn không đáp ứng quy định; chuyển trường hợp không khắc phục được sang xử lý theo Hợp đồng/Đơn hàng.

Hồ sơ/biểu mẫu: Biên bản không đạt; kết quả kiểm tra lại hoặc tình trạng quá hạn.

Kết quả: Có căn cứ chuyển trả hàng/xử lý vi phạm; không mặc định tiếp tục bàn giao hàng không đạt.

Chuyển bước 10 để ĐVSD phối hợp ĐVMS trả hàng/ghi nhận vướng mắc và xử lý theo HĐ/PO.

## 10. Trả hàng / ghi nhận vướng mắc xử lý (Bước 10)

Tác nhân: Đơn vị Sử dụng; phối hợp ĐVMS.

Trả hàng cho Nhà thầu/Nhà cung cấp theo hướng xử lý. Nếu có vướng mắc đặc thù, ghi nhận để xin ý kiến. ĐVMS phối hợp ĐVSD xử lý theo Hợp đồng/Đơn hàng.

Hồ sơ/biểu mẫu: Biên bản trả hàng; hồ sơ không đạt; Hợp đồng/Đơn hàng.

Kết quả: Chuyển hướng phạt vi phạm, hủy hoặc trình xin ý kiến theo căn cứ thực tế.

Gateway “Hướng xử lý theo HĐ/PO?” lựa chọn bước 11, 12 hoặc 13 theo căn cứ thực tế.

## 11. Xử lý vi phạm qua MS23.01 (Bước 11)

Tác nhân: Phòng Hợp đồng / ĐVMS; phối hợp ĐVSD.

Căn cứ chế tài Hợp đồng/Đơn hàng để xử lý vi phạm chậm tiến độ hoặc chất lượng không đạt; lập biên bản phạt/hồ sơ xử lý qua MS23.01.

Hồ sơ/biểu mẫu: Hợp đồng/Đơn hàng; biên bản vi phạm; căn cứ xử lý.

Kết quả: Chuyển MS23.01 và chờ kết quả; đây không phải mức bắt buộc trước mọi trường hợp hủy.

Chuyển MS23.01 và chờ kết quả xử lý. Sơ đồ chưa quy định bước quay lại sau khi có kết quả; không tự nối về luồng bàn giao.

## 12. Thực hiện thủ tục hủy HĐ / Đơn hàng (Bước 12)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Khi không thể hoàn thành mục tiêu mua sắm do không khắc phục/thay thế được hàng hóa, thực hiện thủ tục hủy phần hàng hóa lỗi hoặc toàn bộ Hợp đồng/Đơn hàng.

Hồ sơ/biểu mẫu: Hồ sơ xử lý hàng lỗi; căn cứ Hợp đồng/Đơn hàng.

Kết quả: Kết thúc/Hủy theo phạm vi xử lý. \[?\] Chi tiết thủ tục và tuyến duyệt hủy.

Kết thúc/hủy theo phạm vi đã xử lý: phần hàng lỗi hoặc toàn bộ HĐ/Đơn hàng. Thủ tục và tuyến duyệt hủy chưa được chốt.

## 13. Lập Tờ trình xin ý kiến Người có thẩm quyền (Bước 13)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Lập Tờ trình xin ý kiến Người có thẩm quyền khi không thể thực hiện theo quy trình hoặc có vướng mắc đặc thù; áp dụng mục 6.6 QT 10.2.5.

Hồ sơ/biểu mẫu: Tờ trình; hồ sơ vướng mắc và phương án đề xuất.

Kết quả: Chờ ý kiến chỉ đạo. \[?\] Chưa chốt luồng tiếp theo sau khi có ý kiến.

Chờ ý kiến chỉ đạo của Người có thẩm quyền. Nhánh tiếp theo sau chỉ đạo chưa chốt trên sơ đồ.

## 14. Tập hợp và xác nhận đủ hồ sơ bàn giao (Bước 14)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Tập hợp hồ sơ bàn giao; kiểm tra đủ hàng hóa, chứng từ và căn cứ chất lượng trước khi chuyển lập HOC. HOC có thể theo từng đợt hoặc toàn bộ tùy Hợp đồng.

Hồ sơ/biểu mẫu: Hồ sơ giao nhận; chứng từ liên quan; kết quả KCS đạt.

Kết quả: Đủ: chuyển AI kiểm tra/soạn HOC. Chưa đủ: yêu cầu bổ sung và kiểm tra lại.

Gateway “Đủ hàng, chứng từ và căn cứ chất lượng?”: Đủ → bước 16; Chưa đủ → bước 15.

## 15. Bổ sung hàng / chứng từ / căn cứ (Bước 15)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Bổ sung hàng hóa, chứng từ hoặc căn cứ còn thiếu theo nội dung kiểm tra; tập hợp lại hồ sơ để xác nhận đủ điều kiện bàn giao.

Hồ sơ/biểu mẫu: Danh sách nội dung còn thiếu; tài liệu/hàng hóa bổ sung.

Kết quả: Quay lại bước tập hợp và xác nhận đủ hồ sơ bàn giao.

Sau bổ sung, tập hợp và xác nhận lại hồ sơ tại bước 14 theo nội dung nhiệm vụ và nhãn “Xác nhận lại”.

## 16. AI kiểm tra chứng từ / căn cứ (Bước 16)

Tác nhân: Hệ thống ĐTMS / AI.

Kiểm tra chứng từ, căn cứ và hồ sơ bàn giao trước khi soạn HOC; phát hiện nội dung chưa đủ/chưa phù hợp. \[?\] Bộ tiêu chí kiểm tra cần làm rõ.

Hồ sơ/biểu mẫu: Hồ sơ bàn giao; kết quả KCS đạt; chứng từ/căn cứ liên quan.

Kết quả: OK: chuyển AI soạn HOC. Không OK: trả Phòng Hợp đồng bổ sung/chỉnh sửa hồ sơ và kiểm tra lại.

Gateway “AI kiểm tra OK?”: OK → bước 17; Không OK → bước 14 để bổ sung/chỉnh sửa hồ sơ và kiểm tra lại.

## 17. AI hỗ trợ soạn HOC (Bước 17)

Tác nhân: Hệ thống ĐTMS / AI.

Hỗ trợ lập dự thảo HOC từ hồ sơ/căn cứ đã kiểm tra OK; dùng mẫu áp dụng cho đợt hoặc phạm vi bàn giao theo Hợp đồng.

Hồ sơ/biểu mẫu: Hồ sơ đã kiểm tra; mẫu HOC

Kết quả: Có dự thảo HOC để Phòng Hợp đồng rà soát và hoàn thiện.

Chuyển dự thảo HOC cho Phòng Hợp đồng/ĐVMS hoàn thiện tại bước 18.

## 18. Hoàn thiện hồ sơ và HOC (Bước 18)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Rà soát dự thảo AI, bổ sung/chỉnh sửa nội dung và hồ sơ liên quan; khi AI kiểm tra trước duyệt không OK, sửa theo nội dung được chỉ ra.

Hồ sơ/biểu mẫu: HOC dự thảo; hồ sơ/căn cứ bàn giao; kết quả kiểm tra AI.

Kết quả: Có hồ sơ và HOC hoàn thiện để AI kiểm tra trước khi chuyển duyệt.

Chuyển bước 19 để AI kiểm tra trước duyệt; đây cũng là nơi quay lại khi AI kiểm tra HOC không OK.

## 19. AI kiểm tra HOC trước duyệt (Bước 19)

Tác nhân: Hệ thống ĐTMS / AI.

Kiểm tra nội dung HOC và các chứng từ/căn cứ sau khi Phòng Hợp đồng hoàn thiện. \[?\] Checklist cần làm rõ.

Hồ sơ/biểu mẫu: HOC hoàn thiện; hồ sơ/căn cứ bàn giao.

Kết quả: OK: chuyển Trưởng phòng Hợp đồng duyệt. Không OK: trả bước hoàn thiện hồ sơ và HOC.

Gateway “AI kiểm tra OK?”: OK → bước 20; Không OK → bước 18.

## 20. Phê duyệt hồ sơ bàn giao để trình ký (Bước 20)

Tác nhân: Trưởng phòng Hợp đồng.

Xem hồ sơ bàn giao và HOC; ghi nhận quyết định duyệt để trình ký hoặc ý kiến yêu cầu hoàn thiện lại.

Hồ sơ/biểu mẫu: HOC dự thảo; hồ sơ bàn giao; kết quả kiểm tra AI.

Kết quả: Được duyệt: trình ký. Không duyệt: quay lại tập hợp/hoàn thiện hồ sơ theo luồng hiện tại.

Gateway “Được duyệt?”: Có → bước 21; Không \[? Q2\] → bước 14 theo mũi tên sơ đồ, rồi thực hiện lại kiểm tra và hoàn thiện hồ sơ.

## 21. Trình ký và cập nhật HOC đã ký (Bước 21)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Chọn hình thức trình ký được áp dụng; theo dõi và cập nhật HOC có đầy đủ chữ ký. \[?\] Tuyến ký và phạm vi tích hợp ký cần làm rõ.

Hồ sơ/biểu mẫu: HOC và hồ sơ trình ký; HOC đã ký đầy đủ.

Kết quả: Có HOC đã ký làm căn cứ cập nhật ngày bàn giao thực tế.

Theo dõi và cập nhật HOC có đầy đủ chữ ký; nhận bản HOC ký đủ từ bên ngoài, email nếu được chọn. Chuyển HOC đã ký đầy đủ đến bước 22.

## 22. AI cập nhật ngày bàn giao thực tế (Bước 22)

Tác nhân: Hệ thống ĐTMS / AI.

Đọc HOC đã ký để cập nhật ngày bàn giao thực tế có trong văn bản. Không tự suy ra ngày chưa có; chức năng dùng chung với MS23 tổng quan chỉ thực hiện một lần.

Hồ sơ/biểu mẫu: HOC đã ký đầy đủ. \[?\] Các thông tin khác được cập nhật.

Kết quả: Ghi nhận ngày bàn giao thực tế và hoàn tất hồ sơ bàn giao.

Cập nhật ngày bàn giao thực tế có trong HOC, sau đó kết thúc “Hoàn tất hồ sơ bàn giao”. Chỉ thực hiện chức năng cập nhật chung một lần, không chạy lại ở MS23 Tổng quan.

## 23. Trao đổi, trình ký và liên kết luồng khác

| **Nội dung** | **Xử lý theo BPMN** |
|:--:|:--:|
| Thông báo bàn giao | Nhà thầu/nhà cung cấp gửi thông báo giao hàng qua email; Phòng Hợp đồng tiếp nhận tại bước 1. |
| Dịch vụ | Hồ sơ xác nhận thực hiện dịch vụ chuyển MS23.03; ĐVSD tiếp tục chủ trì nghiệm thu. |
| Xử lý vi phạm | Bước 11 chuyển MS23.01 và chờ kết quả, không tự xác định nơi quay lại. |
| HOC ký đủ | Bước 21 chọn hình thức trình ký áp dụng; tuyến ký và phạm vi tích hợp cần làm rõ. Email dùng khi được chọn để nhận bản ký. |
| MS23 Tổng quan | Chức năng cập nhật từ HOC ký tại bước 22 được tham chiếu ở tổng quan; thực hiện một lần. |

## 24. Kết thúc và các nhánh chờ xử lý

Nhánh hàng hóa hợp lệ kết thúc khi HOC có đầy đủ chữ ký và ngày bàn giao thực tế được cập nhật. Nhánh dịch vụ chuyển hồ sơ sang MS23.03. Nhánh xử lý vi phạm chờ kết quả MS23.01; nhánh xin ý kiến chờ chỉ đạo; nhánh hủy kết thúc theo phạm vi hủy. Không gộp các kết quả này thành một trạng thái đã bàn giao thành công cho mọi hồ sơ.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

| **STT** | **Nội dung** | **Điểm cần xác nhận/đặc tả** |
|:--:|:--:|:--:|
| 1 | Phân công kiểm tra chất lượng | Xác nhận trách nhiệm Phòng Quản lý tài sản và ĐVSD, người kiểm tra, người ghi nhận/duyệt kết quả KCS. |
| 2 | Biểu mẫu và thao tác kho | Cung cấp mẫu giao nhận, hồ sơ kho, yêu cầu kiểm tra, biên bản không đạt và thao tác trên ĐTMS/SAP. |
| 3 | Tiêu chí KCS | Tiêu chí đạt/không đạt, cách ghi nhận kết quả lần đầu và sau thay thế, hồ sơ minh chứng. |
| 4 | Hạn 7 ngày | Cách tính ngày làm việc/ngày lịch, thời điểm bắt đầu/kết thúc; căn cứ xác nhận có hàng trong hạn. |
| 5 | Quyền từ chối hàng | Ai quyết định từ chối ngay hoặc cho thay thế; cách ghi nhận khi quá hạn hoặc kiểm tra lại vẫn không đạt. |
| 6 | Hướng xử lý theo HĐ/PO | Tiêu chí chọn phạt, hủy hoặc xin ý kiến; thẩm quyền quyết định và cách quản lý phạm vi hàng lỗi. |
| 7 | Kết quả MS23.01 | Sau khi xử lý vi phạm có kết quả, hồ sơ quay lại bước nào hay kết thúc theo chỉ đạo? |
| 8 | Thủ tục hủy | Tuyến duyệt và hồ sơ hủy phần hàng lỗi/toàn bộ hợp đồng hoặc đơn hàng chưa được mô tả. |
| 9 | Sau ý kiến chỉ đạo | Nhánh tiếp theo của bước 13 chưa chốt; cần xác nhận cách ghi nhận và thực hiện chỉ đạo. |
| 10 | Hồ sơ dịch vụ | Mẫu xác nhận thực hiện dịch vụ, kết quả/khối lượng và cách chuyển hồ sơ sang MS23.03. |
| 11 | Mẫu và phạm vi HOC | Tên gọi/mẫu chính thức; điều kiện lập theo từng đợt hoặc toàn bộ, hồ sơ bắt buộc. |
| 12 | Checklist AI | Tiêu chí kiểm tra bước 16 và 19, xử lý cảnh báo, ai xác nhận kết quả. |
| 13 | Trả hồ sơ của Trưởng phòng | Mũi tên không duyệt quay bước 14. Xác nhận trường hợp cần tập hợp lại toàn bộ hay chỉ hoàn thiện HOC. |
| 14 | Tuyến ký và tích hợp | Các bên ký, thứ tự ký, hình thức trình ký, cách ghi nhận đủ chữ ký; không tự bổ sung cấp duyệt. |
| 15 | Cập nhật từ HOC ký | Ngoài ngày bàn giao thực tế còn cập nhật thông tin nào; xử lý thiếu ngày và cơ chế tránh cập nhật hai lần. |
| 16 | Các mũi tên chưa gắn rõ đầu/cuối | Một số mũi tên giao nhận, trả hàng và xác nhận lại chưa gắn trực tiếp vào ô công việc. Cần xác nhận điểm nối khi hoàn thiện sơ đồ; diễn giải hiện bám nội dung nhiệm vụ và nhãn chuyển tiếp. |

# E. PHỤ LỤC - TÓM TẮT 22 BƯỚC MS23.02

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | Nhận thông báo bàn giao | Phòng Hợp đồng | Thông báo giao hàng; Hợp đồng/Đơn hàng liên quan. |
| 2 | Lập và gửi thông báo giao hàng | Phòng Hợp đồng | Thông báo giao hàng; thông tin hàng hóa và hồ sơ liên quan. |
| 3 | Ghi nhận giao nhận hàng và hồ sơ kho | Phòng Quản lý tài sản | Hồ sơ giao nhận, hồ sơ kho; hàng hóa được giao. Mẫu và thao tác ĐTMS/SAP. |
| 4 | Ghi nhận xác nhận dịch vụ | Đơn vị Sử dụng | Biên bản xác nhận thực hiện dịch vụ (bước 3a); thông tin kết quả/khối lượng dịch vụ. |
| 5 | Lập yêu cầu kiểm tra chất lượng | Phòng Quản lý tài sản | Yêu cầu kiểm tra chất lượng; hồ sơ giao hàng/kho. \[?\] Mẫu và tiêu chí kiểm tra. |
| 6 | Ghi nhận kết quả kiểm tra chất lượng | Đơn vị Sử dụng | Kết quả KCS; hồ sơ giao hàng và yêu cầu kiểm tra chất lượng. |
| 7 | Lập biên bản không đạt và ghi nhận hướng xử lý | Phòng Quản lý tài sản | Biên bản không đạt; kết quả KCS; Hợp đồng/Đơn hàng. |
| 8 | Theo dõi bổ sung / thay thế trong 7 ngày | Phòng Quản lý tài sản | Biên bản không đạt; thông tin hàng hóa bổ sung/thay thế. |
| 9 | Ghi nhận quyền từ chối và chuyển xử lý theo HĐ | Phòng Quản lý tài sản | Biên bản không đạt; kết quả kiểm tra lại hoặc tình trạng quá hạn. |
| 10 | Trả hàng / ghi nhận vướng mắc xử lý | Đơn vị Sử dụng; phối hợp ĐVMS | Biên bản trả hàng; hồ sơ không đạt; Hợp đồng/Đơn hàng. |
| 11 | Xử lý vi phạm qua MS23.01 | Phòng Hợp đồng / ĐVMS; phối hợp ĐVSD | Hợp đồng/Đơn hàng; biên bản vi phạm; căn cứ xử lý. |
| 12 | Thực hiện thủ tục hủy HĐ / Đơn hàng | Phòng Hợp đồng / ĐVMS | Hồ sơ xử lý hàng lỗi; căn cứ Hợp đồng/Đơn hàng. |
| 13 | Lập Tờ trình xin ý kiến Người có thẩm quyền | Phòng Hợp đồng / ĐVMS | Tờ trình; hồ sơ vướng mắc và phương án đề xuất. |
| 14 | Tập hợp và xác nhận đủ hồ sơ bàn giao | Phòng Hợp đồng / ĐVMS | Hồ sơ giao nhận; chứng từ liên quan; kết quả KCS đạt. |
| 15 | Bổ sung hàng / chứng từ / căn cứ | Phòng Hợp đồng / ĐVMS | Danh sách nội dung còn thiếu; tài liệu/hàng hóa bổ sung. |
| 16 | AI kiểm tra chứng từ / căn cứ | Hệ thống ĐTMS / AI | Hồ sơ bàn giao; kết quả KCS đạt; chứng từ/căn cứ liên quan. |
| 17 | AI hỗ trợ soạn HOC | Hệ thống ĐTMS / AI | Hồ sơ đã kiểm tra; mẫu HOC |
| 18 | Hoàn thiện hồ sơ và HOC | Phòng Hợp đồng / ĐVMS | HOC dự thảo; hồ sơ/căn cứ bàn giao; kết quả kiểm tra AI. |
| 19 | AI kiểm tra HOC trước duyệt | Hệ thống ĐTMS / AI | HOC hoàn thiện; hồ sơ/căn cứ bàn giao. |
| 20 | Phê duyệt hồ sơ bàn giao để trình ký | Trưởng phòng Hợp đồng | HOC dự thảo; hồ sơ bàn giao; kết quả kiểm tra AI. |
| 21 | Trình ký và cập nhật HOC đã ký | Phòng Hợp đồng / ĐVMS | HOC và hồ sơ trình ký; HOC đã ký đầy đủ. |
| 22 | AI cập nhật ngày bàn giao thực tế | Hệ thống ĐTMS / AI | HOC đã ký đầy đủ. Các thông tin khác được cập nhật. |
