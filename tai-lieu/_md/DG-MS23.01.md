<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_01.docx -->
<!-- pk-sha256: fc18fbddae0d2789eeceb2436568c38e34ba7cd88ea2f5aa47f2b8b27aaedc60 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS23.01 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_01.docx`. Trích dẫn thì ghi mã **DG-MS23.01** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS23.01 - VĂN BẢN PHÁT SINH KHI THỰC HIỆN HỢP ĐỒNG**

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
| 07/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS23.01. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

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

> [1. Lập thông tin văn bản phát sinh (Bước 1) 8](#_heading=)
>
> [2. Lập và trình đề xuất sửa đổi (Bước 2) 8](#_heading=)
>
> [3. Ghi nhận duyệt đề xuất sửa đổi (Bước 3) 9](#_heading=)
>
> [4. AI kiểm tra chứng từ / căn cứ và các văn bản (Bước 4) 9](#_heading=)
>
> [5. AI hỗ trợ soạn văn bản (Bước 5) 9](#_heading=)
>
> [6. Hoàn thiện văn bản và kết quả thống nhất (Bước 6) 9](#_heading=)
>
> [7. AI kiểm tra văn bản trước duyệt (Bước 7) 10](#_heading=)
>
> [8. Phê duyệt văn bản để trình ký \[? Q2\] (Bước 8) 10](#_heading=)
>
> [9. Chọn hình thức và trình ký văn bản (Bước 9) 10](#_heading=)
>
> [10. Ghi nhận kết quả ký văn bản (Bước 10) 10](#_heading=)
>
> [11. Cập nhật văn bản đã ký đầy đủ và gửi lại (Bước 11) 11](#_heading=)
>
> [12. AI cập nhật thông tin từ văn bản đã ký (Bước 12) 11](#_heading=)
>
> [13. Hình thức ký và trao đổi với nhà thầu/nhà cung cấp 11](#_heading=)
>
> [14. Kết thúc luồng MS23.01 11](#_heading=)

[**D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 12**](#_heading=)

[**E. PHỤ LỤC - TÓM TẮT 12 BƯỚC MS23.01 13**](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải luồng MS23.01 – Văn bản phát sinh khi thực hiện hợp đồng, làm rõ việc lập thông tin, xét duyệt đề xuất sửa đổi khi áp dụng, kiểm tra bằng AI, hoàn thiện, trình ký và cập nhật kết quả văn bản đã ký đầy đủ.

## 2. Phạm vi áp dụng

Luồng bắt đầu khi phát sinh nhu cầu lập văn bản trong quá trình thực hiện hợp đồng và kết thúc khi hoàn tất một văn bản phát sinh. Giữ nguyên 12 bước và các nhánh trên BPMN. Nếu là sửa đổi hợp đồng, thực hiện thêm bước 2–3 trước khi kiểm tra căn cứ và soạn văn bản. Nội dung vẫn cần xác nhận, không coi là quy tắc đã chốt.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | QT.CNVTQĐ.ĐTXD.10.2.4 – Quy trình quản lý hợp đồng 2026 | Tài liệu quy trình nguồn về quản lý hợp đồng, làm căn cứ tham chiếu nghiệp vụ liên quan đến hợp đồng và văn bản sửa đổi. |
| 2 | QT.CNVTQĐ.ĐTXD.10.2.5 – Quy trình quản lý đơn hàng và thực hiện hợp đồng 2026 | Tài liệu quy trình nguồn về quản lý đơn hàng và thực hiện hợp đồng, làm căn cứ tham chiếu xử lý phát sinh trong quá trình thực hiện. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | ĐVMS | Đơn vị mua sắm |
| 3 | ĐVSD | Đơn vị sử dụng |
| 4 | AI | Trí tuệ nhân tạo hỗ trợ kiểm tra, soạn văn bản và cập nhật thông tin. |
| 5 | VContract | Hình thức ký được sơ đồ cho phép lựa chọn tại bước 9. |
| 6 | \[? Q2\] | Nội dung chưa chốt liên quan phê duyệt trước trình ký và nhánh trả hồ sơ. |
| 7 | Văn bản đã ký đầy đủ | Văn bản có đủ chữ ký theo loại văn bản, gồm chữ ký nhà thầu/nhà cung cấp khi áp dụng. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Xử lý một văn bản phát sinh gắn với hợp đồng, bảo đảm nội dung sửa đổi được duyệt trước khi dùng để soạn phụ lục khi áp dụng. Sau kiểm tra và phê duyệt, văn bản được ký theo hình thức lựa chọn, cập nhật đầy đủ chữ ký, gửi lại nhà thầu/nhà cung cấp và cập nhật thông tin có hiệu lực về hồ sơ hợp đồng.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Là sửa đổi hợp đồng? | Có → bước 2, 3. Không → hợp nhất nhánh để đến bước 4. |
| Đề xuất được duyệt? | Có → bước 4. Không → bước 2 để hoàn thiện tờ trình và trình lại. |
| AI kiểm tra OK? sau bước 4 | OK → bước 5. Không OK → bước 1 để Phòng Hợp đồng sửa thông tin/tài liệu và thực hiện lại luồng kiểm tra. |
| Được duyệt để trình ký? sau bước 8 | Có → bước 9. Không \[? Q2\] → bước 6 để hoàn thiện lại. |
| Được ký duyệt? sau bước 10 | Có → bước 11. Không \[? Q2\] → bước 9 để xử lý hồ sơ trình ký lại. |
| Văn bản ký đầy đủ | Bước 11 cập nhật bản đủ chữ ký theo loại văn bản và gửi lại; sau đó chuyển bước 12. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Phòng Hợp đồng / ĐVMS | Lập thông tin; lập/trình đề xuất sửa đổi; hoàn thiện văn bản; chọn hình thức trình ký; cập nhật và gửi lại bản ký đầy đủ. |
| 2 | Hệ thống ĐTMS / AI | Kiểm tra chứng từ/căn cứ, hỗ trợ soạn, kiểm tra trước duyệt và cập nhật thông tin từ văn bản ký. |
| 3 | Trưởng phòng Hợp đồng | Phê duyệt văn bản để trình ký tại bước 8; chi tiết còn mang nhãn \[? Q2\]. |
| 4 | Người có thẩm quyền | Ghi nhận duyệt đề xuất sửa đổi tại bước 3 và kết quả ký văn bản tại bước 10; sơ đồ chưa nêu chức danh cụ thể. |
| 5 | Đơn vị sử dụng | Thống nhất nội dung sửa đổi khi áp dụng; bước 2 dùng nội dung đã thống nhất. |
| 6 | Nhà thầu / Nhà cung cấp | Trao đổi ý kiến thống nhất khi áp dụng; cung cấp bản ký và nhận văn bản đã ký đầy đủ gửi lại. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Thông tin sự việc, hồ sơ và căn cứ liên quan | Đầu vào lập thông tin văn bản phát sinh tại bước 1. |
| 2 | Tờ trình đề xuất sửa đổi; nội dung thống nhất với ĐVSD | Dùng ở bước 2–3 khi là sửa đổi hợp đồng. |
| 3 | Quyết định/ý kiến duyệt đề xuất; ý kiến chuyên môn khi được yêu cầu | Căn cứ soạn phụ lục sửa đổi sau phê duyệt. |
| 4 | Chứng từ; căn cứ; văn bản kèm theo; kết quả kiểm tra AI | Đầu vào và kết quả bước 4. |
| 5 | Dự thảo đúng loại văn bản; nội dung thống nhất khi áp dụng | AI hỗ trợ soạn tại bước 5, người phụ trách hoàn thiện tại bước 6. |
| 6 | Văn bản và hồ sơ trình duyệt/trình ký | Phục vụ bước 7–10; chọn hình thức ký tại bước 9. |
| 7 | Văn bản ký đầy đủ; thông tin bên nhận; hình thức gửi | Cập nhật và gửi lại tại bước 11. |
| 8 | Thông tin phát sinh, ngày thực tế, nội dung và hiệu lực phụ lục | Cập nhật từ văn bản ký tại bước 12; dùng tiến độ có hiệu lực cho mốc nhắc. |

## 5. Nguyên tắc xử lý chung

Giữ nguyên số bước 1–12. Bước 2–3 chỉ thuộc nhánh sửa đổi hợp đồng; không áp dụng bắt buộc cho mọi loại văn bản.

Bước 4 kiểm tra chứng từ, căn cứ và các văn bản trước khi AI hỗ trợ soạn tại bước 5. Kết quả không đạt quay lại bước 1.

Bước 7 kiểm tra văn bản đã hoàn thiện trước duyệt; khác với kiểm tra căn cứ đầu vào tại bước 4.

Trả hồ sơ sau bước 8 quay về bước 6; trả hồ sơ sau bước 10 quay về bước 9 theo mũi tên sơ đồ. Các nhánh này mang nhãn.

Chọn hình thức ký ở bước 9 và hình thức gửi lại ở bước 11 là hai nội dung riêng. Không mặc định mọi hình thức gửi đều là email.

Bước 11 theo dõi và cập nhật văn bản có đầy đủ chữ ký theo loại văn bản, gồm chữ ký nhà thầu/nhà cung cấp khi áp dụng; không mặc định bước 10 đã hoàn tất toàn bộ chữ ký.

Bước 12 là chức năng cập nhật chung với MS23 Tổng quan; chỉ thực hiện một lần cho mỗi hồ sơ ký. Mốc nhắc phải dựa trên tiến độ có hiệu lực.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Diễn giải theo đúng số bước và nhánh của BPMN. Những chi tiết chưa có tiêu chí, ma trận thẩm quyền hoặc danh mục biểu mẫu được ghi nhận tại phần D.

## 1. Lập thông tin văn bản phát sinh (Bước 1)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Chọn loại văn bản, nêu nội dung/sự việc và đính kèm căn cứ. Nếu sửa đổi hợp đồng, xác định nội dung được phép sửa đổi và lấy ý kiến ĐVSD khi cần.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Sau lập thông tin, gateway “Là sửa đổi hợp đồng?”: Có → bước 2; Không → hợp nhất nhánh để đến bước 4.

## 2. Lập và trình đề xuất sửa đổi (Bước 2)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Tổng hợp nội dung sửa đổi đã thống nhất với đơn vị sử dụng, lập tờ trình đề xuất sửa đổi.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Chuyển tờ trình đề xuất sửa đổi đến bước 3. Nếu đề xuất chưa được duyệt, hồ sơ quay lại bước này để hoàn thiện và trình lại.

## 3. Ghi nhận duyệt đề xuất sửa đổi (Bước 3)

Tác nhân: Người có thẩm quyền.

Ghi nhận quyết định của người có thẩm quyền, ý kiến chuyên môn nếu được yêu cầu; chưa duyệt thì hoàn thiện tờ trình và trình lại.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Gateway “Đề xuất được duyệt?”: Có → hợp nhất nhánh để đến bước 4; Không → bước 2. Với phụ lục sửa đổi, bước 5 dùng nội dung đề xuất đã được duyệt.

## 4. AI kiểm tra chứng từ / căn cứ và các văn bản (Bước 4)

Tác nhân: Hệ thống ĐTMS / AI.

AI kiểm tra chứng từ, căn cứ và các văn bản trong hồ sơ. Nếu không đạt, trả kết quả để Phòng Hợp đồng sửa lại thông tin và tài liệu tại bước 1, sau đó thực hiện lại luồng kiểm tra. Nếu đạt, tiếp tục bước 5.

Hồ sơ/biểu mẫu: Chứng từ; căn cứ; các văn bản kèm theo; kết quả kiểm tra AI.

Gateway “AI kiểm tra OK?”: OK → bước 5. Không OK → bước 1 để Phòng Hợp đồng sửa lại thông tin/tài liệu, sau đó thực hiện lại nhánh tương ứng và kiểm tra.

## 5. AI hỗ trợ soạn văn bản (Bước 5)

Tác nhân: Hệ thống ĐTMS / AI.

Sinh dự thảo đúng loại văn bản từ căn cứ đã có. Với phụ lục sửa đổi, dùng nội dung đề xuất đã được duyệt.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Sau sinh dự thảo theo loại văn bản, chuyển bước 6 để người phụ trách rà soát và hoàn thiện.

## 6. Hoàn thiện văn bản và kết quả thống nhất (Bước 6)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Rà soát dự thảo, ghi nhận nội dung thống nhất với nhà thầu/nhà cung cấp khi áp dụng; hoàn thiện hồ sơ trình duyệt.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Ghi nhận ý kiến thống nhất từ nhà thầu/nhà cung cấp khi áp dụng theo liên kết trao đổi trên sơ đồ. Sau hoàn thiện, chuyển bước 7; đây cũng là nơi quay lại nếu không được duyệt để trình ký tại bước 8.

## 7. AI kiểm tra văn bản trước duyệt (Bước 7)

Tác nhân: Hệ thống ĐTMS / AI.

Kiểm tra nội dung và căn cứ trong hồ sơ trước khi chuyển duyệt.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Sau kiểm tra, sơ đồ chuyển trực tiếp sang bước 8. BPMN chưa thể hiện gateway kết quả kiểm tra hoặc nhánh không đạt riêng tại bước 7; không tự bổ sung nơi quay lại.

## 8. Phê duyệt văn bản để trình ký (Bước 8)

Tác nhân: Trưởng phòng Hợp đồng.

Ghi nhận ý kiến Trưởng phòng HĐ theo note.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Gateway “Được duyệt để trình ký?”: Có → bước 9; Không \[? Q2\] → bước 6, rồi qua bước 7 trước khi duyệt lại. Chi tiết quyết định của Trưởng phòng Hợp đồng cần xác nhận.

## 9. Chọn hình thức và trình ký văn bản (Bước 9)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Chọn VContract/ký cứng/hình thức được chấp nhận và lập bộ hồ sơ trình ký.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Sau chọn hình thức và lập bộ hồ sơ, chuyển bước 10. Nếu không được ký duyệt sau bước 10, mũi tên quay về bước 9 theo nhãn.

## 10. Ghi nhận kết quả ký văn bản (Bước 10)

Tác nhân: Người có thẩm quyền.

Ghi nhận phê duyệt/ký của cấp có thẩm quyền. Với phụ lục sửa đổi, không duyệt thì quay lại hồ sơ trình ký.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Gateway “Được ký duyệt?”: Có → bước 11; Không → bước 9. Nội dung ô nêu rõ trường hợp phụ lục sửa đổi không duyệt quay lại hồ sơ trình ký; phạm vi áp dụng cho loại văn bản khác cần xác nhận.

## 11. Cập nhật văn bản đã ký đầy đủ và gửi lại (Bước 11)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Theo dõi, tải lên và cập nhật văn bản có đầy đủ chữ ký theo loại văn bản, gồm chữ ký nhà thầu/nhà cung cấp khi áp dụng. Chọn hình thức gửi và gửi lại văn bản đã ký đầy đủ cho nhà thầu/nhà cung cấp.

Hồ sơ/biểu mẫu: Văn bản đã ký đầy đủ; thông tin bên nhận; hình thức gửi được chọn.

Tiếp nhận văn bản đã ký từ nhà thầu/nhà cung cấp khi áp dụng, cập nhật bản ký đầy đủ và gửi lại theo hình thức được chọn. Mũi tên nét đứt kèm phong bì thể hiện trao đổi/gửi với bên ngoài. Sau cập nhật và gửi, chuyển bước 12.

## 12. AI cập nhật thông tin từ văn bản đã ký (Bước 12)

Tác nhân: Hệ thống ĐTMS / AI.

Đọc văn bản đã ký để cập nhật thông tin phát sinh và ngày thực tế có trong văn bản. Chốt nội dung phụ lục được cập nhật và hiệu lực áp dụng; mốc nhắc phải dùng tiến độ có hiệu lực. Đây là chức năng cập nhật chung được tham chiếu tại MS23 Tổng quan, chỉ thực hiện một lần cho mỗi hồ sơ ký.

Hồ sơ/biểu mẫu: Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này.

Đọc văn bản đã ký và cập nhật thông tin có trong văn bản, chốt nội dung phụ lục cùng hiệu lực áp dụng. Đây là chức năng dùng chung tham chiếu ở MS23 Tổng quan, chỉ chạy một lần cho mỗi hồ sơ ký. Sau cập nhật, kết thúc tại “Hoàn tất một văn bản phát sinh”.

## 13. Hình thức ký và trao đổi với nhà thầu/nhà cung cấp

| **Nội dung** | **Hình thức theo BPMN** |
|:--:|:--:|
| Thống nhất nội dung tại bước 6 | Ý kiến từ nhà thầu/nhà cung cấp khi áp dụng; kênh/hình thức cụ thể chưa được quy định riêng trong ô. |
| Chọn hình thức ký tại bước 9 | VContract, ký cứng hoặc hình thức được chấp nhận. |
| Tiếp nhận và gửi lại tại bước 11 | Cập nhật bản đủ chữ ký; chọn hình thức gửi và gửi lại cho nhà thầu/nhà cung cấp. Nét đứt kèm phong bì biểu thị trao đổi/thông báo bên ngoài theo hình thức được chọn. |

## 14. Kết thúc luồng MS23.01

Luồng kết thúc khi văn bản phát sinh đã được ký đầy đủ, cập nhật và gửi lại theo bước 11, sau đó thông tin từ văn bản được cập nhật tại bước 12. Kết quả là hoàn tất một văn bản phát sinh; không đồng nghĩa đã kết thúc hợp đồng hoặc đã hoàn tất toàn bộ MS23.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

Các nội dung dưới đây cần xác nhận để đặc tả hệ thống; giữ nguyên các nhánh đã vẽ và không suy diễn thành yêu cầu đã chốt.

| **STT** | **Nội dung** | **Điểm cần xác nhận/đặc tả** |
|:--:|:--:|:--:|
| 1 | Danh mục loại văn bản | Xác nhận loại văn bản được chọn tại bước 1, mẫu tương ứng và điều kiện được xem là sửa đổi hợp đồng. |
| 2 | Nội dung được phép sửa đổi | Xác nhận phạm vi sửa đổi, điều kiện xin ý kiến ĐVSD, cách ghi nhận đã thống nhất và hồ sơ kèm. |
| 3 | Thẩm quyền duyệt và ký | Ai duyệt đề xuất sửa đổi ở bước 3, ai ký từng loại văn bản ở bước 10; khi nào yêu cầu ý kiến chuyên môn? |
| 4 | \[? Q2\] Phê duyệt trước trình ký | Bước 8 chỉ ghi nhận ý kiến theo note; cần chốt tiêu chí, nội dung phê duyệt và phạm vi áp dụng theo loại văn bản. |
| 5 | \[? Q2\] Không được ký duyệt | Mũi tên quay bước 9; nội dung ô nhấn mạnh phụ lục sửa đổi. Xác nhận loại văn bản khác xử lý tương tự hay không và khi nào cần hoàn thiện lại nội dung. |
| 6 | Tiêu chí AI kiểm tra đầu vào | Bước 4 cần checklist chứng từ/căn cứ, kết quả OK/không OK và cách ghi nhận yêu cầu sửa ở bước 1. |
| 7 | Kết quả AI kiểm tra trước duyệt | Bước 7 chưa có nhánh không đạt. Xác nhận người xử lý cảnh báo và có yêu cầu chặn chuyển bước 8 hay không. |
| 8 | Biểu mẫu/hồ sơ chi tiết | Nhiều ô chỉ nêu hồ sơ/căn cứ/văn bản liên quan; cần danh mục và mẫu thực tế, không tự đặt mã biểu mẫu. |
| 9 | Ký đầy đủ và hình thức gửi | Xác nhận chữ ký bắt buộc cho từng loại văn bản, cách theo dõi nhà thầu/nhà cung cấp ký, danh mục hình thức gửi và bằng chứng gửi. |
| 10 | Cập nhật chung với MS23 Tổng quan | Cách nhận diện mỗi hồ sơ ký để cập nhật một lần, xác định ngày thực tế, nội dung phụ lục và hiệu lực, tránh cập nhật trùng. |
| 11 | Tiến độ có hiệu lực | Khi phụ lục sửa tiến độ, xác định thời điểm dùng mốc mới để nhắc và cách xử lý mốc cũ. |
| 12 | Xử lý lỗi hoặc thiếu kết quả | Cần làm rõ trường hợp thiếu bản ký, AI không đọc được, ký bị từ chối hoặc gửi lại không thành công. |

# E. PHỤ LỤC - TÓM TẮT 12 BƯỚC MS23.01

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | Lập thông tin văn bản phát sinh | Phòng Hợp đồng / ĐVMS | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 2 | Lập và trình đề xuất sửa đổi | Phòng Hợp đồng / ĐVMS | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 3 | Ghi nhận duyệt đề xuất sửa đổi | Người có thẩm quyền | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 4 | AI kiểm tra chứng từ / căn cứ và các văn bản | Hệ thống ĐTMS / AI | Chứng từ; căn cứ; các văn bản kèm theo; kết quả kiểm tra AI. |
| 5 | AI hỗ trợ soạn văn bản | Hệ thống ĐTMS / AI | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 6 | Hoàn thiện văn bản và kết quả thống nhất | Phòng Hợp đồng / ĐVMS | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 7 | AI kiểm tra văn bản trước duyệt | Hệ thống ĐTMS / AI | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 8 | Phê duyệt văn bản để trình ký \[? Q2\] | Trưởng phòng Hợp đồng | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 9 | Chọn hình thức và trình ký văn bản | Phòng Hợp đồng / ĐVMS | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 10 | Ghi nhận kết quả ký văn bản | Người có thẩm quyền | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
| 11 | Cập nhật văn bản đã ký đầy đủ và gửi lại | Phòng Hợp đồng / ĐVMS | Văn bản đã ký đầy đủ; thông tin bên nhận; hình thức gửi được chọn. |
| 12 | AI cập nhật thông tin từ văn bản đã ký | Hệ thống ĐTMS / AI | Hồ sơ, căn cứ và văn bản liên quan theo nội dung bước này. |
