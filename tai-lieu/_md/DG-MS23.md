<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23.docx -->
<!-- pk-sha256: 1239af1a8a25ebae8893dbe677a6b8321b578183cfaf570cb419a237a9fb7cae -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS23 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23.docx`. Trích dẫn thì ghi mã **DG-MS23** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS23 - THEO DÕI THỰC HIỆN HỢP ĐỒNG TỔNG QUAN**

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
| 07/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS23. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

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

> [1. AI đọc hợp đồng, trích xuất mốc theo dõi (Bước 1) 8](#_heading=)
>
> [2. Tự động đôn đốc giao hàng (Bước 2) 8](#_heading=)
>
> [3. Ghi nhận thông báo giao hàng (Bước 3) 8](#_heading=)
>
> [4. Thông báo các bộ phận liên quan (Bước 4) 9](#_heading=)
>
> [5. AI đọc biên bản, cập nhật ngày thực tế (Bước 5) 9](#_heading=)
>
> [6. Nhánh đến hạn hoặc phát sinh chứng từ 9](#_heading=)
>
> [7. Liên kết giữa tổng quan và các luồng liên quan 10](#_heading=)
>
> [8. Kết quả của các nhánh theo dõi 10](#_heading=)

[**D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 10**](#_heading=)

[**E. PHỤ LỤC - TÓM TẮT 5 BƯỚC MS23 TỔNG QUAN 11**](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải MS23 Tổng quan nhằm làm rõ cách theo dõi cùng một hợp đồng qua các sự kiện: đọc hợp đồng đã ký, nhắc mốc giao hàng, tiếp nhận thông báo giao hàng, kích hoạt luồng nghiệp vụ phù hợp và cập nhật kết quả về hồ sơ theo dõi hợp đồng.

## 2. Phạm vi áp dụng

Áp dụng cho trang tổng quan MS23, gồm 5 bước được đánh số trên BPMN và các sự kiện liên kết MS23.01–MS23.04. Đây là các nhánh sự kiện độc lập cùng tham chiếu một hợp đồng, không phải chuỗi bắt buộc từ bước 1 đến bước 5. Chi tiết xử lý, ký và phê duyệt thuộc từng luồng con; thanh toán theo đợt thuộc MS24.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | ĐTMS-MS23 - Tổng quan.drawio.svg | Nguồn diễn giải chính: các bước, sự kiện, liên kết dữ liệu và ghi chú. |
| 2 | MS14.docx | Mẫu bố cục, font chữ, cỡ chữ và định dạng bảng. |
| 3 | QT.CNVTQĐ.ĐTXD.10.2.5 | Được ghi chú trên BPMN: HOC và triển khai/nghiệm thu có thể song song; chi tiết xử lý thuộc luồng con. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | ĐVMS | Đơn vị mua sắm |
| 3 | AI | Trí tuệ nhân tạo hỗ trợ đọc hợp đồng, biên bản và cập nhật thông tin. |
| 4 | HĐ | Hợp đồng |
| 5 | User Task | Công việc do người dùng thao tác trên giao diện; bước 3 thuộc loại này. |
| 6 | Service Task | Công việc hệ thống tự động thực hiện; bước 1, 2, 4, 5 thuộc loại này. |
| 7 | HOC / KCS | Ký hiệu trên BPMN; hồ sơ bàn giao, kiểm tra và xử lý chi tiết thuộc MS23.02. Tên đầy đủ và phạm vi áp dụng cần được xác nhận theo tài liệu của luồng con. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Theo dõi các mốc dự kiến và thông tin thực tế của hợp đồng đã ký trên một hồ sơ chung. Khi đến hạn hoặc có phát sinh, hệ thống và người phụ trách thực hiện nhánh phù hợp; kết quả đã ký từ các luồng con được đưa về hồ sơ để cập nhật trạng thái và ngày thực tế.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Hợp đồng đã ký được tải lên | Kích hoạt bước 1 để AI trích xuất thông tin, mốc dự kiến và lưu hồ sơ theo dõi. |
| Đến mốc giao hàng trong hợp đồng | Kích hoạt bước 2 để tự động nhắc/đôn đốc giao hàng. |
| Nhà thầu/nhà cung cấp thông báo giao hàng | Phòng Hợp đồng/ĐVMS ghi nhận tại bước 3; hệ thống thông báo và chuyển hồ sơ sang MS23.02 tại bước 4. |
| Đến hạn hoặc phát sinh chứng từ | Kích hoạt luồng phù hợp MS23.01, MS23.03 hoặc MS23.04. Sơ đồ chưa chốt điều kiện chi tiết. |
| Luồng con có biên bản đã ký đầy đủ | Kích hoạt bước 5 để đọc biên bản và cập nhật thông tin thực tế về hồ sơ theo dõi. |
| Tính độc lập của sự kiện | Các nhánh không tạo thành chuỗi tuần tự bắt buộc; cùng tham chiếu một hồ sơ hợp đồng. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Phòng Hợp đồng / ĐVMS | Tiếp nhận và ghi nhận thông báo giao hàng trên ĐTMS tại bước 3. |
| 2 | Hệ thống ĐTMS / AI | Trích xuất mốc, nhắc giao hàng, gửi thông báo, chuyển hồ sơ và cập nhật trạng thái/ngày thực tế. |
| 3 | Nhà thầu / Nhà cung cấp | Bên ngoài phạm vi điều phối nội bộ; cung cấp thông báo giao hàng và phản hồi bản ký khi áp dụng. |
| 4 | Các bộ phận liên quan | Nhận thông tin giao hàng; danh sách cụ thể còn cần xác nhận \[? Q3\]. |
| 5 | Các bên thực hiện MS23.01–MS23.04 | Thực hiện nghiệp vụ và ký theo từng luồng con; trả kết quả về hồ sơ theo dõi hợp đồng. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Hợp đồng đã ký | Đầu vào AI đọc và trích xuất mốc tại bước 1. |
| 2 | Hồ sơ theo dõi hợp đồng | Lưu mã hợp đồng, mốc dự kiến và trạng thái; nhận trạng thái/ngày thực tế từ bước 5. |
| 3 | Mốc giao hàng; nội dung thông báo nhắc | Căn cứ và nội dung đôn đốc tại bước 2. |
| 4 | Thông báo giao hàng | Phòng Hợp đồng/ĐVMS ghi nhận tại bước 3 và hệ thống thông báo tại bước 4. |
| 5 | Hồ sơ giao hàng chuyển MS23.02 | Đầu vào luồng bàn giao hàng hóa/dịch vụ. |
| 6 | Biên bản đã ký từ MS23.01–MS23.04; HOC đã ký khi áp dụng | Đầu vào cập nhật ngày thực tế và trạng thái tại bước 5. |

## 5. Nguyên tắc xử lý chung

Giữ nguyên 5 bước trên sơ đồ, nhưng đọc theo nhánh sự kiện thay vì hiểu là bước 1 → 2 → 3 → 4 → 5 cho mọi hợp đồng.

Các luồng con MS23.01–MS23.04 được kích hoạt riêng theo phát sinh; không phải chuỗi bắt buộc văn bản phát sinh → bàn giao → nghiệm thu → thanh lý.

Thông tin trích xuất và kết quả thực tế cùng được lưu về hồ sơ theo dõi của hợp đồng liên quan.

Bước 5 sử dụng biên bản đã ký đầy đủ; không dùng bản dự thảo để diễn giải là đã hoàn tất nghiệp vụ.

HOC, KCS, xử lý hàng không đạt và chi tiết ký bàn giao thuộc MS23.02; phê duyệt văn bản thuộc MS23.01/MS23.03/MS23.04.

Ghi chú BPMN cho phép HOC và triển khai/nghiệm thu có thể song song theo quy trình được dẫn chiếu. Thanh toán theo đợt vẫn thuộc MS24.

Tên người nhận, kênh gửi, tần suất nhắc, tiêu chí kích hoạt và cách kiểm tra kết quả AI còn cần xác nhận theo các nhãn.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Các bước được diễn giải theo đúng tác nhân, hồ sơ và liên kết trên sơ đồ tổng quan. Những sự kiện không có số bước được trình bày riêng để không tự thêm số hoặc thay đổi chuỗi xử lý.

## 1. AI đọc hợp đồng, trích xuất mốc theo dõi (Bước 1)

Tác nhân: Hệ thống ĐTMS / AI.

Đọc hợp đồng đã ký được tải lên hệ thống; trích xuất thông tin và các mốc dự kiến để theo dõi; lưu vào hồ sơ theo dõi hợp đồng. Trường dữ liệu và việc kiểm tra kết quả AI còn cần xác nhận.

Hồ sơ/biểu mẫu: Hợp đồng đã ký; hồ sơ theo dõi hợp đồng. Chưa chỉ định mẫu riêng.

Sự kiện bắt đầu: hợp đồng đã ký được tải lên hệ thống. Sau trích xuất, lưu thông tin vào hồ sơ theo dõi hợp đồng. Hồ sơ cung cấp mốc giao hàng để kích hoạt nhánh nhắc khi đến hạn; không chuyển trực tiếp sang ghi nhận thông báo giao hàng.

## 2. Tự động đôn đốc giao hàng (Bước 2)

Tác nhân: Hệ thống ĐTMS / AI.

Dựa trên mốc giao hàng trong hợp đồng, tự động gửi nhắc/đôn đốc giao hàng khi đến mốc theo dõi. Thời điểm, tần suất, người nhận và kênh gửi chưa chốt.

Hồ sơ/biểu mẫu: Mốc giao hàng trong hợp đồng; nội dung thông báo nhắc. Chưa chỉ định mẫu riêng.

Sự kiện kích hoạt: đến mốc giao hàng trong hợp đồng. Mốc lấy từ hồ sơ theo dõi; nhánh kết thúc tại “Đã gửi nhắc”. Người nhận chưa chốt nên chưa kết luận hệ thống nhắc nhà thầu/nhà cung cấp hay nhắc người phụ trách nội bộ.

## 3. Ghi nhận thông báo giao hàng (Bước 3)

Tác nhân: Phòng Hợp đồng / ĐVMS.

Tiếp nhận thông báo giao hàng từ nhà thầu/nhà cung cấp và ghi nhận trên ĐTMS để chuyển thông tin cho các bộ phận liên quan. Kênh tiếp nhận/tích hợp còn cần xác nhận.

Hồ sơ/biểu mẫu: Thông báo giao hàng của nhà thầu/nhà cung cấp; hợp đồng liên quan. Chưa chỉ định mẫu riêng.

Sự kiện kích hoạt: nhà thầu/nhà cung cấp thông báo giao hàng. Phòng Hợp đồng/ĐVMS ghi nhận rồi chuyển bước 4. Kênh tiếp nhận và mức độ tích hợp còn cần xác nhận.

## 4. Thông báo các bộ phận liên quan (Bước 4)

Tác nhân: Hệ thống ĐTMS / AI.

Từ thông báo giao hàng đã ghi nhận, gửi thông tin đến các bộ phận liên quan và chuyển hồ sơ giao hàng sang MS23.02 – Bàn giao hàng hóa / dịch vụ. Danh sách bộ phận và kênh thông báo chưa chốt \[? Q3\].

Hồ sơ/biểu mẫu: Thông báo giao hàng đã ghi nhận; hồ sơ giao hàng chuyển MS23.02. Chưa chỉ định mẫu riêng.

Nhận thông báo đã ghi nhận từ bước 3; gửi thông tin cho các bộ phận liên quan và chuyển hồ sơ giao hàng sang MS23.02. Kết quả bàn giao/HOC đã ký khi áp dụng được trả về nhánh đọc biên bản tại bước 5.

## 5. AI đọc biên bản, cập nhật ngày thực tế (Bước 5)

Tác nhân: Hệ thống ĐTMS / AI.

Khi luồng con có biên bản đã ký đầy đủ, đọc thông tin và cập nhật ngày thực tế tương ứng có trong biên bản; trả trạng thái/ngày thực tế về hồ sơ theo dõi hợp đồng. Thông tin trả về và cơ chế kiểm tra AI chưa chốt .

Hồ sơ/biểu mẫu: Biên bản đã ký từ MS23.01–.04; HOC đã ký khi áp dụng; hồ sơ theo dõi hợp đồng.

Sự kiện kích hoạt: luồng con có biên bản đã ký đầy đủ. Sau đọc, nhánh ghi nhận “Đã cập nhật trạng thái/ngày thực tế” và đưa dữ liệu về hồ sơ theo dõi hợp đồng. Sơ đồ chưa chốt cách kiểm tra kết quả AI hoặc xử lý dữ liệu không đọc được.

## 6. Nhánh đến hạn hoặc phát sinh chứng từ

Khi đến hạn hoặc phát sinh chứng từ, kích hoạt luồng phù hợp MS23.01 – Văn bản phát sinh, MS23.03 – Nghiệm thu hoặc MS23.04 – Thanh lý theo nghiệp vụ. Mũi tên ghi “Theo mốc hoặc phát sinh đã chốt”, nhưng tiêu chí cụ thể vẫn mang nhãn. Nhánh này không phải đầu ra bắt buộc của bước 2 hoặc bước 4.

Khi luồng phù hợp trả kết quả biên bản đã ký, kết quả được đưa về sự kiện “Luồng con có biên bản đã ký đầy đủ” để xử lý tại bước 5.

## 7. Liên kết giữa tổng quan và các luồng liên quan

| **Luồng** | **Liên kết theo BPMN** |
|:--:|:--:|
| MS23.01 – Văn bản phát sinh | Kích hoạt theo mốc/phát sinh phù hợp; trả kết quả biên bản ký về bước 5. |
| MS23.02 – Bàn giao hàng hóa/dịch vụ | Nhận hồ sơ giao hàng từ bước 4; trả kết quả bàn giao/HOC ký về bước 5 khi áp dụng. |
| MS23.03 – Nghiệm thu | Kích hoạt theo mốc/phát sinh phù hợp; trả kết quả biên bản ký về bước 5. |
| MS23.04 – Thanh lý | Kích hoạt theo mốc/phát sinh phù hợp; trả kết quả biên bản ký về bước 5. |
| MS24 – Thanh toán theo đợt | Nằm ngoài phạm vi trang tổng quan; sơ đồ không thể hiện một mũi tên bắt buộc từ tổng quan sang thanh toán. |

## 8. Kết quả của các nhánh theo dõi

Nhánh nhắc giao hàng kết thúc khi đã gửi nhắc. Nhánh thông báo giao hàng chuyển hồ sơ sang luồng bàn giao. Nhánh đọc biên bản kết thúc bằng việc cập nhật trạng thái/ngày thực tế về hồ sơ hợp đồng. Các điểm này hoàn tất xử lý một sự kiện; sơ đồ không đặt một sự kiện kết thúc chung để khẳng định toàn bộ hợp đồng đã hoàn thành.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

Các nội dung dưới đây xuất phát từ ghi chú \[?\] và liên kết chưa có quy tắc chi tiết trên sơ đồ. Không tự xác định người nhận hoặc điều kiện kích hoạt khi chưa được chốt.

| **STT** | **Nội dung** | **Điểm cần xác nhận/đặc tả** |
|:--:|:--:|:--:|
| 1 | Dữ liệu hợp đồng AI đọc | AI trích xuất những thông tin/mốc nào? Ai kiểm tra và xác nhận trước khi dùng để theo dõi? |
| 2 | Đôn đốc giao hàng | Nhắc ai, vào thời điểm nào trước/đúng/sau hạn, tần suất và kênh gửi? Khi nào dừng nhắc hoặc nhắc lại? |
| 3 | Tiếp nhận thông báo | Phòng Hợp đồng hay ĐVMS chịu trách nhiệm ghi nhận? Nhận từ kênh nào, nhập thủ công hay tích hợp? |
| 4 | Thông báo bộ phận liên quan | Những bộ phận nào nhận, nhận theo điều kiện gì, kênh gửi và thông tin nào đi kèm? |
| 5 | Kích hoạt luồng con | Định nghĩa mốc/phát sinh nào kích hoạt MS23.01, MS23.03, MS23.04; ai khởi tạo và có tự động hay không? |
| 6 | Kết quả đã ký đầy đủ | Cách xác định bản đã ký đầy đủ từ mỗi luồng con; hồ sơ/HOC nào được trả về và lúc nào kích hoạt bước 5? |
| 7 | Ngày thực tế và trạng thái | Mỗi loại biên bản cập nhật ngày/trạng thái nào; cập nhật thông tin tương ứng ra sao và ai xác nhận kết quả AI? |
| 8 | Liên kết hồ sơ cùng hợp đồng | Cách nhận diện mã hợp đồng, trường hợp nhiều lần giao hàng hoặc nhiều biên bản; tránh cập nhật nhầm và xử lý phiên bản sửa đổi. |
| 9 | HOC/KCS và phạm vi luồng con | Xác nhận tên đầy đủ, phạm vi áp dụng và quan hệ với nghiệm thu ở tài liệu MS23.02; giữ khả năng song song như ghi chú tổng quan. |
| 10 | Xử lý sự kiện và dữ liệu bất thường | Cần quy tắc khi thiếu mốc, thiếu thông báo, AI không đọc được, nhận trùng biên bản hoặc gửi thông báo thất bại. |

# E. PHỤ LỤC - TÓM TẮT 5 BƯỚC MS23 TỔNG QUAN

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | AI đọc hợp đồng, trích xuất mốc theo dõi | Hệ thống ĐTMS / AI | Hợp đồng đã ký; hồ sơ theo dõi hợp đồng. Chưa chỉ định mẫu riêng. |
| 2 | Tự động đôn đốc giao hàng | Hệ thống ĐTMS / AI | Mốc giao hàng trong hợp đồng; nội dung thông báo nhắc. Chưa chỉ định mẫu riêng. |
| 3 | Ghi nhận thông báo giao hàng | Phòng Hợp đồng / ĐVMS | Thông báo giao hàng của nhà thầu/nhà cung cấp; hợp đồng liên quan. Chưa chỉ định mẫu riêng. |
| 4 | Thông báo các bộ phận liên quan | Hệ thống ĐTMS / AI | Thông báo giao hàng đã ghi nhận; hồ sơ giao hàng chuyển MS23.02. Chưa chỉ định mẫu riêng. |
| 5 | AI đọc biên bản, cập nhật ngày thực tế | Hệ thống ĐTMS / AI | Biên bản đã ký từ MS23.01–.04; HOC đã ký khi áp dụng; hồ sơ theo dõi hợp đồng. |
