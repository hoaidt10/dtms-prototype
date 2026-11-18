<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_04.docx -->
<!-- pk-sha256: 2932d5ed46d0ae832311e2c6e447438f88d279d9ab3619f7264240986a76aea6 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS23.04 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS23_04.docx`. Trích dẫn thì ghi mã **DG-MS23.04** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS23.04 - THANH LÝ HỢP ĐỒNG**

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
| 07/10/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS23.04. | Bám sát nghiệp vụ và trình tự xử lý được thể hiện trên BPMN. |

**MỤC LỤC**

[**A. GIỚI THIỆU**](#_heading=) **5**

> [1. Mục đích tài liệu](#_heading=) 5
>
> [2. Phạm vi áp dụng](#_heading=) 5
>
> [3. Tài liệu liên quan](#_heading=) 5
>
> [4. Thuật ngữ và các từ viết tắt](#_heading=) 5

[**B. TỔNG QUAN NGHIỆP VỤ**](#_heading=) **6**

> [1. Mục tiêu](#_heading=) 6
>
> [2. Điều kiện/tiêu chí phân luồng](#_heading=) 6
>
> [3. Vai trò tham gia](#_heading=) 7
>
> [4. Danh mục biểu mẫu/hồ sơ](#_heading=) 7
>
> [5. Nguyên tắc xử lý chung](#_heading=) 8

[**C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**](#_heading=) **8**

> [1. Kiểm tra yêu cầu và điều kiện ký chung — G1 (Bước 1)](#_heading=) 8
>
> [2. Chuẩn bị biên bản thanh lý để ký chung (Bước 2)](#_heading=) 9
>
> [3. Chờ MS23.03 hoàn tất và bổ sung hồ sơ (Bước 3)](#_heading=) 9
>
> [4. Chuẩn bị hồ sơ thanh lý để ký riêng (Bước 4)](#_heading=) 9
>
> [5. Quyết toán giá trị — nhánh ký riêng (Bước 5)](#_heading=) 10
>
> [6. AI hỗ trợ soạn biên bản thanh lý theo mẫu (Bước 6)](#_heading=) 10
>
> [7. Soạn thảo và hoàn thiện biên bản thanh lý (Bước 7)](#_heading=) 10
>
> [8. AI kiểm tra hồ sơ sau hoàn thiện (Bước 8)](#_heading=) 10
>
> [9. Ký duyệt biên bản thanh lý (Bước 9)](#_heading=) 11
>
> [10. Ký biên bản thanh lý (Bước 10)](#_heading=) 11
>
> [11. Kiểm tra hồ sơ trình ký (Bước 11)](#_heading=) 12
>
> [12. Ký biên bản thanh lý (Bước 12)](#_heading=) 12
>
> [13. Cập nhật biên bản thanh lý đã ký đầy đủ — G3 (Bước 13)](#_heading=) 12
>
> [14. AI cập nhật thông tin từ biên bản đã ký (Bước 14)](#_heading=) 13
>
> [15. Liên kết với MS23.03](#_heading=) 13
>
> [16. Trao đổi và gửi văn bản](#_heading=) 13
>
> [17. Kết thúc luồng MS23.04](#_heading=) 13

[**D. PHỤ LỤC - TÓM TẮT 14 BƯỚC MS23.04**](#_heading=) **14**

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Diễn giải MS23.04 – Thanh lý hợp đồng, làm rõ yêu cầu thanh lý, điều kiện ký chung với nghiệm thu hoặc ký riêng, chuẩn bị hồ sơ, quyết toán ở nhánh ký riêng, soạn biên bản, trình ký và cập nhật kết quả thanh lý.

## 2. Phạm vi áp dụng

Tiếp nhận thông tin hồ sơ nghiệm thu để kiểm tra hợp đồng có yêu cầu biên bản thanh lý hay không. Nếu có, lựa chọn ký chung hoặc ký riêng theo điều kiện hợp đồng và bảo lãnh. Luồng gồm 14 bước; tuyến ký tại MS23.04 chỉ áp dụng ký riêng. Ký chung chuyển biên bản hoàn thiện về MS23.03 và nhận kết quả đã ký để cập nhật thanh lý.

## 3. Tài liệu liên quan

| **STT** | **Tài liệu/Nguồn** | **Mục đích/Ghi chú** |
|:--:|:--:|:--:|
| 1 | 2909.txt – Ghi chú trao đổi 29/09/2026 | Phần MS23 nêu hỗ trợ soạn các biên bản, kiểm tra trước duyệt, trình ký và cập nhật thông tin thực tế từ biên bản đã ký. |
| 2 | QT.CNVTQĐ.ĐTXD.10.2.5 – Quy trình quản lý đơn hàng và thực hiện hợp đồng 2026 | Tài liệu nguồn về thực hiện hợp đồng và hồ sơ liên quan đến nghiệm thu, xử lý và hoàn tất nghĩa vụ hợp đồng. |
| 3 | QT.CNVTQĐ.ĐTXD.10.2.4 – Quy trình quản lý hợp đồng 2026 | Tài liệu nguồn về quản lý hợp đồng, làm căn cứ tham chiếu hồ sơ và yêu cầu thanh lý theo hợp đồng. |

## 4. Thuật ngữ và các từ viết tắt

| **STT** | **Thuật ngữ/Viết tắt** | **Ý nghĩa** |
|:--:|:--:|:--:|
| 1 | ĐTMS | Đầu tư mua sắm |
| 2 | AI | Trí tuệ nhân tạo hỗ trợ soạn, kiểm tra và cập nhật thông tin thanh lý. |
| 3 | VHT | Viettel High Tech |
| 4 | G1 | Thông tin nghiệm thu hoàn thiện nội dung, chưa ký tại MS23.03 bước 6. |
| 5 | G2 | Biên bản thanh lý đã hoàn thiện chuyển về MS23.03 bước 7 để tập hợp/trình ký chung. |
| 6 | G3 | Kết quả ký chung từ MS23.03 bước 13 gửi đến MS23.04 bước 13. |
| 7 | Ký chung / Ký riêng | Ký chung dùng một tuyến tại MS23.03; ký riêng hoàn tất MS23.03 rồi thực hiện tuyến thanh lý tại MS23.04. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

Chuẩn bị và hoàn tất biên bản thanh lý theo yêu cầu hợp đồng. Ký chung sử dụng thông tin nghiệm thu đã hoàn thiện, chưa ký để chuẩn bị thanh lý và trình hai biên bản qua một tuyến tại MS23.03. Ký riêng chờ nghiệm thu hoàn tất, đủ bảo lãnh, thực hiện quyết toán giá trị rồi soạn và trình ký thanh lý.

## 2. Điều kiện/tiêu chí phân luồng

| **Tiêu chí** | **Nội dung theo BPMN** |
|:--:|:--:|
| Hợp đồng yêu cầu biên bản thanh lý? | Có → bước 1. Không → không thực hiện thanh lý, chỉ nghiệm thu theo MS23.03. |
| Đủ điều kiện ký chung và đủ bảo lãnh? | Đủ → bước 2. Chưa đủ → bước 3 để theo nhánh ký riêng. |
| Nghiệm thu đã ký xong hẳn và đầy đủ bảo lãnh? | Có → bước 4, 5. Chưa → tiếp tục bước 3 để chờ/bổ sung. |
| AI kiểm tra hồ sơ | OK → rẽ theo phương án ký. Not OK → bước 7 để sửa và kiểm tra lại. |
| Phương án ký đã chọn | Ký chung → G2 về MS23.03; ký riêng → bước 9 tại MS23.04. |
| Kết quả tuyến ký riêng | Đồng ý/đạt → chuyển cấp tiếp theo. Bất kỳ cấp nào không đồng ý/không đạt → bước 7, sửa và trình lại từ Trưởng phòng Hợp đồng. |
| Biên bản thanh lý ký đầy đủ | Bước 13 nhận kết quả ký chung G3 hoặc kết quả ký riêng, cập nhật đủ chữ ký và gửi nhà thầu/nhà cung cấp; sau đó bước 14. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm thể hiện trên BPMN** |
|:--:|:--:|:--:|
| 1 | Phòng Hợp đồng / Chuyên quản hợp đồng | Kiểm tra điều kiện, chuẩn bị hồ sơ hai phương án; thực hiện quyết toán nhánh ký riêng; hoàn thiện, theo dõi ký và cập nhật biên bản. |
| 2 | Hệ thống ĐTMS / AI | Hỗ trợ soạn, kiểm tra sau hoàn thiện và cập nhật thông tin từ biên bản ký đầy đủ. |
| 3 | Trưởng phòng Hợp đồng | Ký duyệt biên bản thanh lý nhánh ký riêng hoặc trả sửa. |
| 4 | Giám đốc VHT | Ký sau Trưởng phòng Hợp đồng hoặc trả sửa. |
| 5 | Văn thư | Kiểm tra hồ sơ trước chuyển Tổng Giám đốc; hồ sơ không đạt trả hoàn thiện. |
| 6 | Tổng Giám đốc | Ký sau kiểm tra hoặc yêu cầu chỉnh sửa. |
| 7 | Nhà thầu / Nhà cung cấp | Trao đổi nội dung qua email khi cần, gửi lại biên bản có chữ ký và nhận bản thanh lý ký đầy đủ. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng theo BPMN** |
|:--:|:--:|:--:|
| 1 | Hợp đồng; căn cứ bàn giao; bảo lãnh | Kiểm tra yêu cầu và điều kiện thanh lý. |
| 2 | Biên bản nghiệm thu hoàn thiện, chưa ký | Đầu vào G1 để chuẩn bị biên bản thanh lý ký chung. |
| 3 | Biên bản nghiệm thu đã ký đầy đủ; kết quả MS23.03 hoàn tất | Đầu vào ký riêng; căn cứ quyết toán giá trị. |
| 4 | Hồ sơ/kết quả quyết toán | Hoàn thiện ở nhánh ký riêng trước tiếp tục soạn và trình ký thanh lý. |
| 5 | Mẫu/dự thảo biên bản thanh lý; hồ sơ kèm; ý kiến trả lại | Soạn, hoàn thiện và kiểm tra hồ sơ. |
| 6 | Biên bản thanh lý hoàn thiện; bộ hồ sơ trình ký | Đầu ra G2 khi ký chung hoặc hồ sơ trình ký riêng. |
| 7 | Biên bản thanh lý ký đầy đủ; kết quả ký chung/ký riêng | Cập nhật kết quả và thông tin thanh lý vào hồ sơ hợp đồng. |

## 5. Nguyên tắc xử lý chung

Không phải mọi hợp đồng đều yêu cầu biên bản thanh lý; nếu không yêu cầu, chỉ thực hiện nghiệm thu theo MS23.03.

G1 là biên bản nghiệm thu hoàn thiện nội dung, chưa ký. Nhánh ký chung không lấy nghiệm thu đã ký xong làm điều kiện chuẩn bị thanh lý.

Ký riêng chờ MS23.03 đi hết tuyến ký và cập nhật nghiệm thu, đủ điều kiện bảo lãnh rồi mới tiếp tục hồ sơ và quyết toán.

Bước 5 thực hiện quyết toán giá trị ở nhánh ký riêng, trước khi soạn và trình ký biên bản thanh lý.

Ký chung chỉ thực hiện tuyến ký tại MS23.03; MS23.04 soạn, hoàn thiện, kiểm tra, trả biên bản tại G2 và nhận bản ký tại G3.

Các cấp trong tuyến ký riêng là Trưởng phòng Hợp đồng → Giám đốc VHT → Văn thư → Tổng Giám đốc.

AI hoặc bất kỳ cấp ký/kiểm tra nào trả lại thì sửa tại bước 7, kiểm tra lại và trình lại từ Trưởng phòng Hợp đồng đối với ký riêng.

Chỉ cập nhật và kết thúc biên bản thanh lý khi có đủ chữ ký theo hợp đồng. AI cập nhật dùng chung với MS23 Tổng quan thực hiện một lần.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Các bước giữ nguyên số trên sơ đồ. Phân biệt nhánh chuẩn bị ký chung, nhánh chờ nghiệm thu/quyết toán để ký riêng và phần cập nhật kết quả sau ký.

## 1. Kiểm tra yêu cầu và điều kiện ký chung — G1 (Bước 1)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Nhận thông tin từ G1: biên bản nghiệm thu tại MS23.03 đã hoàn thiện nội dung nhưng chưa ký. Kiểm tra yêu cầu thanh lý, điều kiện ký chung và bảo lãnh theo từng hợp đồng. Không lấy nghiệm thu đã ký xong làm điều kiện của nhánh ký chung.

Hồ sơ/biểu mẫu: Hợp đồng; biên bản nghiệm thu đã hoàn thiện chưa ký; căn cứ bàn giao; bảo lãnh.

Kết quả: Đủ điều kiện ký chung: bước 2. Chưa đủ: bước 3 để đi theo nhánh ký riêng, chờ MS23.03 hoàn tất.

Trước bước này, gateway “Hợp đồng yêu cầu biên bản thanh lý?”: Có → bước 1; Không → chỉ nghiệm thu theo MS23.03. Sau kiểm tra, đủ điều kiện ký chung và bảo lãnh → bước 2; chưa đủ → bước 3.

## 2. Chuẩn bị biên bản thanh lý để ký chung (Bước 2)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Chuẩn bị biên bản thanh lý dựa trên hồ sơ hợp đồng và thông tin nghiệm thu đã hoàn thiện nhưng chưa ký. Sau khi hoàn thiện và kiểm tra, trả biên bản về G2 tại MS23.03 để tập hợp hai biên bản và đi chung tuyến ký.

Hồ sơ/biểu mẫu: Hợp đồng; biên bản nghiệm thu chưa ký; căn cứ bàn giao; bảo lãnh.

Kết quả: Tiếp tục soạn thảo / kiểm tra thanh lý; không chờ nghiệm thu ký xong và không chạy tuyến ký riêng.

Chuyển vào nhánh soạn dự thảo tại bước 6, rồi bước 7 và 8. Khi kiểm tra đạt, chuyển biên bản hoàn thiện về G2 tại MS23.03 để ký chung; không thực hiện bước 9–12 tại MS23.04.

## 3. Chờ MS23.03 hoàn tất và bổ sung hồ sơ (Bước 3)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Nếu ký riêng, MS23.03 tiếp tục toàn bộ tuyến ký và cập nhật nghiệm thu. Chờ nghiệm thu đã ký đầy đủ, đi hết MS23.03; bổ sung bảo lãnh theo hợp đồng. Chưa hoàn tất nghiệm thu thì chưa trình ký thanh lý.

Hồ sơ/biểu mẫu: Kết quả nghiệm thu hoàn tất từ MS23.03; biên bản đã ký; bảo lãnh.

Kết quả: Chỉ chuyển bước 4 khi MS23.03 hoàn tất và đầy đủ điều kiện thanh lý.

Gateway “Nghiệm thu đã ký xong hẳn và đầy đủ bảo lãnh?”: Có → bước 4; Chưa → tiếp tục chờ và bổ sung tại bước 3.

## 4. Chuẩn bị hồ sơ thanh lý để ký riêng (Bước 4)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Nhận kết quả nghiệm thu hoàn tất từ MS23.03; tập hợp biên bản đã ký, bảo lãnh và căn cứ thanh lý. Thực hiện quyết toán giá trị trước khi tiếp tục trình ký thanh lý riêng.

Hồ sơ/biểu mẫu: Biên bản nghiệm thu ký đầy đủ; hợp đồng; bảo lãnh; hồ sơ quyết toán.

Kết quả: Chuyển bước 5 quyết toán, rồi soạn thảo và trình ký thanh lý riêng.

Chuyển bước 5 để thực hiện và ghi nhận kết quả quyết toán giá trị của nhánh ký riêng.

## 5. Quyết toán giá trị — nhánh ký riêng (Bước 5)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Sau khi MS23.03 hoàn tất nghiệm thu, thực hiện quyết toán giá trị theo hợp đồng và hồ sơ đã ký. Ghi nhận kết quả trước khi trình ký thanh lý riêng.

Hồ sơ/biểu mẫu: Hợp đồng; biên bản nghiệm thu hoàn tất; hồ sơ / kết quả quyết toán.

Kết quả: Có kết quả quyết toán để tiếp tục soạn thảo và trình ký thanh lý riêng.

Sau có kết quả quyết toán, hợp nhất với nhánh chuẩn bị để chuyển AI soạn biên bản tại bước 6. Bước này thuộc nhánh ký riêng.

## 6. AI hỗ trợ soạn biên bản thanh lý theo mẫu (Bước 6)

Tác nhân: Hệ thống ĐTMS / AI.

Sử dụng mẫu biên bản thanh lý và hồ sơ đã tập hợp để hỗ trợ tạo dự thảo. Nội dung dự thảo bám hợp đồng và căn cứ bàn giao / nghiệm thu, bảo lãnh được cung cấp; chuyển Phòng Hợp đồng kiểm tra và hoàn thiện.

Hồ sơ/biểu mẫu: Mẫu biên bản thanh lý; hợp đồng; hồ sơ bàn giao / nghiệm thu; bảo lãnh.

Kết quả: Có dự thảo biên bản thanh lý để Phòng Hợp đồng soạn thảo / hoàn thiện.

Chuyển dự thảo đến Phòng Hợp đồng/Chuyên quản hợp đồng để hoàn thiện tại bước 7.

## 7. Soạn thảo và hoàn thiện biên bản thanh lý (Bước 7)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Kiểm tra dự thảo AI, hoàn thiện biên bản theo mẫu và đính kèm căn cứ. Khi AI hoặc bất kỳ cấp ký nào trả lại, sửa nội dung theo ý kiến và trình lại từ Trưởng phòng Hợp đồng. Nếu cần thống nhất nội dung, trao đổi Nhà thầu / Nhà cung cấp qua email.

Hồ sơ/biểu mẫu: Mẫu biên bản; dự thảo; hồ sơ kèm theo; ý kiến trả lại.

Kết quả: Có biên bản và hồ sơ hoàn thiện để AI kiểm tra trước khi chuyển ký duyệt.

Sau hoàn thiện, chuyển AI kiểm tra tại bước 8. Đây là nơi quay lại khi AI hoặc cấp trong tuyến ký riêng trả hồ sơ. Nếu cần, trao đổi với nhà thầu/nhà cung cấp qua email.

## 8. AI kiểm tra hồ sơ sau hoàn thiện (Bước 8)

Tác nhân: Hệ thống ĐTMS / AI.

Kiểm tra chứng từ, căn cứ và phiên bản biên bản thanh lý sau khi Phòng Hợp đồng hoàn thiện, trước khi chuyển Trưởng phòng Hợp đồng ký duyệt. Khi chưa đạt, nêu nội dung cần sửa / bổ sung để người soạn thảo xử lý.

Hồ sơ/biểu mẫu: Biên bản thanh lý dự thảo; hợp đồng; căn cứ bàn giao / nghiệm thu và bảo lãnh.

Kết quả: OK: rẽ theo phương án ký; ký chung trả G2 về MS23.03, ký riêng chuyển bước 9. Not OK: trả bước 7 để sửa và kiểm tra lại.

AI kiểm tra OK → gateway “Phương án ký đã chọn?”: ký chung → G2 về MS23.03 bước 7; ký riêng → bước 9. Not OK → bước 7 để sửa và kiểm tra lại.

## 9. Ký duyệt biên bản thanh lý (Bước 9)

Tác nhân: Trưởng phòng Hợp đồng.

Xem biên bản thanh lý và các hồ sơ làm căn cứ, chỉ áp dụng nhánh ký riêng. Ghi nhận đồng ý ký duyệt hoặc ý kiến không đồng ý để Phòng Hợp đồng sửa soạn thảo. Tuyến này chỉ dùng khi ký riêng; ký chung thực hiện tại MS23.03.

Hồ sơ/biểu mẫu: Biên bản thanh lý; bộ hồ sơ trình ký và căn cứ kèm theo.

Kết quả: Đồng ý: ký duyệt, chuyển Giám đốc VHT. Không đồng ý: trả Phòng Hợp đồng sửa tại bước 7.

Chỉ áp dụng ký riêng. Đồng ý → bước 10; không đồng ý → bước 7, kiểm tra lại và trình lại từ Trưởng phòng Hợp đồng.

## 10. Ký biên bản thanh lý (Bước 10)

Tác nhân: Giám đốc VHT.

Giám đốc VHT xem biên bản thanh lý và bộ hồ sơ đã được Trưởng phòng Hợp đồng ký duyệt; ghi nhận đồng ý ký hoặc nêu ý kiến yêu cầu chỉnh sửa. Tuyến này chỉ dùng khi ký riêng; ký chung thực hiện tại MS23.03.

Hồ sơ/biểu mẫu: Biên bản thanh lý; bộ hồ sơ trình ký đã được Trưởng phòng Hợp đồng duyệt.

Kết quả: Đồng ý: ký và chuyển Văn thư kiểm tra. Không đồng ý: trả Phòng Hợp đồng sửa tại bước 7.

Đồng ý → bước 11; không đồng ý → bước 7, sửa và trình lại từ Trưởng phòng Hợp đồng.

## 11. Kiểm tra hồ sơ trình ký (Bước 11)

Tác nhân: Văn thư.

Văn thư tiếp nhận biên bản và hồ sơ đã qua Giám đốc VHT; kiểm tra hồ sơ trước khi chuyển Tổng Giám đốc. Nếu hồ sơ chưa đạt, ghi nhận ý kiến và trả Phòng Hợp đồng hoàn thiện. Tuyến này chỉ dùng khi ký riêng; ký chung thực hiện tại MS23.03.

Hồ sơ/biểu mẫu: Biên bản thanh lý; bộ hồ sơ trình ký và thông tin ký liên quan.

Kết quả: OK: chuyển Tổng Giám đốc ký. Not OK: trả bước 7; sửa và trình lại từ Trưởng phòng Hợp đồng.

OK → bước 12; Not OK → bước 7, sửa và trình lại từ Trưởng phòng Hợp đồng.

## 12. Ký biên bản thanh lý (Bước 12)

Tác nhân: Tổng Giám đốc.

Tổng Giám đốc xem biên bản thanh lý cùng hồ sơ trình ký đã được kiểm tra; quyết định đồng ý ký hoặc yêu cầu chỉnh sửa. Tuyến này chỉ dùng khi ký riêng; ký chung thực hiện tại MS23.03.

Hồ sơ/biểu mẫu: Biên bản thanh lý; hồ sơ đã qua Trưởng phòng Hợp đồng, Giám đốc VHT và Văn thư.

Kết quả: Đồng ý: ký, chuyển cập nhật biên bản đã ký. Không đồng ý: trả bước 7 để sửa và trình lại.

Đồng ý → bước 13 để cập nhật đủ chữ ký; không đồng ý → bước 7, kiểm tra và trình lại.

## 13. Cập nhật biên bản thanh lý đã ký đầy đủ — G3 (Bước 13)

Tác nhân: Phòng Hợp đồng / Chuyên quản hợp đồng.

Ký chung: nhận biên bản thanh lý và kết quả ký từ G3 của MS23.03, không chạy lại tuyến ký MS23.04. Ký riêng: cập nhật bản thanh lý sau khi hoàn tất tuyến ký tại MS23.04. Ghi nhận đủ chữ ký theo hợp đồng; gửi bản ký cho Nhà thầu / Nhà cung cấp.

Hồ sơ/biểu mẫu: Biên bản thanh lý đã ký; kết quả ký chung từ MS23.03 hoặc ký riêng tại MS23.04.

Kết quả: Có bản thanh lý ký đầy đủ để AI cập nhật; vẫn đảm bảo thứ tự nghiệm thu hoàn thành → quyết toán giá trị → thanh lý chấm dứt hợp đồng.

Ký chung nhận G3 từ MS23.03; ký riêng nhận kết quả sau tuyến ký MS23.04. Nhận bản có chữ ký nhà thầu/nhà cung cấp, cập nhật đủ chữ ký và gửi lại bản ký đầy đủ. Chuyển bước 14.

## 14. AI cập nhật thông tin từ biên bản đã ký (Bước 14)

Tác nhân: Hệ thống ĐTMS / AI.

Đọc biên bản thanh lý đã được cập nhật đầy đủ chữ ký; ghi nhận thông tin và kết quả thanh lý vào hồ sơ hợp đồng. Chức năng dùng chung với MS23 tổng quan chỉ thực hiện một lần.

Hồ sơ/biểu mẫu: Biên bản thanh lý đã ký đầy đủ; hồ sơ hợp đồng liên quan.

Kết quả: Ghi nhận kết quả và hoàn tất biên bản thanh lý hợp đồng.

Sau ghi nhận thông tin và kết quả thanh lý vào hồ sơ hợp đồng, kết thúc tại “Hoàn tất biên bản thanh lý”. Chức năng cập nhật dùng chung chỉ thực hiện một lần.

## 15. Liên kết với MS23.03

| **Điểm giao/Phương án** | **Nội dung theo BPMN** |
|:--:|:--:|
| G1 – MS23.03 bước 6 | Nhận thông tin nghiệm thu đã hoàn thiện nội dung, chưa ký để kiểm tra yêu cầu và chuẩn bị thanh lý. |
| G2 – Sau MS23.04 bước 8 kiểm tra OK | Ký chung: trả biên bản thanh lý hoàn thiện về MS23.03 bước 7 để tập hợp hai biên bản và trình qua một tuyến. |
| G3 – MS23.03 bước 13 → MS23.04 bước 13 | Nhận biên bản thanh lý và kết quả đã ký để cập nhật, không chạy lại tuyến MS23.04. |
| Ký riêng | Đi hết MS23.03 trước; chờ đủ bảo lãnh, chuẩn bị hồ sơ và quyết toán, sau đó thực hiện tuyến ký tại MS23.04. |
| Trả hồ sơ ký chung | Sửa biên bản có vấn đề ở luồng tương ứng, tập hợp lại bộ hồ sơ và trình lại từ Trưởng phòng Hợp đồng. |

## 16. Trao đổi và gửi văn bản

Khi cần thống nhất nội dung tại bước 7, Phòng Hợp đồng/Chuyên quản hợp đồng trao đổi với nhà thầu/nhà cung cấp qua email. Bước 13 nhận lại biên bản có chữ ký nhà thầu/nhà cung cấp và gửi bản thanh lý đã ký đầy đủ cho bên nhận theo liên kết trao đổi trên sơ đồ.

## 17. Kết thúc luồng MS23.04

Luồng hoàn tất sau khi biên bản thanh lý có đầy đủ chữ ký được cập nhật tại bước 13 và AI ghi nhận thông tin, kết quả thanh lý vào hồ sơ hợp đồng tại bước 14. Ký chung nhận kết quả từ MS23.03; ký riêng nhận kết quả từ tuyến ký MS23.04. Nếu hợp đồng không yêu cầu biên bản thanh lý, nhánh kết thúc với việc chỉ thực hiện nghiệm thu theo MS23.03.

# D. PHỤ LỤC - TÓM TẮT 14 BƯỚC MS23.04

| **Bước** | **Nội dung** | **Tác nhân** | **Hồ sơ/biểu mẫu chính** |
|:--:|:--:|:--:|:--:|
| 1 | Kiểm tra yêu cầu và điều kiện ký chung — G1 | Phòng Hợp đồng / Chuyên quản hợp đồng | Hợp đồng; biên bản nghiệm thu đã hoàn thiện chưa ký; căn cứ bàn giao; bảo lãnh. |
| 2 | Chuẩn bị biên bản thanh lý để ký chung | Phòng Hợp đồng / Chuyên quản hợp đồng | Hợp đồng; biên bản nghiệm thu chưa ký; căn cứ bàn giao; bảo lãnh. |
| 3 | Chờ MS23.03 hoàn tất và bổ sung hồ sơ | Phòng Hợp đồng / Chuyên quản hợp đồng | Kết quả nghiệm thu hoàn tất từ MS23.03; biên bản đã ký; bảo lãnh. |
| 4 | Chuẩn bị hồ sơ thanh lý để ký riêng | Phòng Hợp đồng / Chuyên quản hợp đồng | Biên bản nghiệm thu ký đầy đủ; hợp đồng; bảo lãnh; hồ sơ quyết toán. |
| 5 | Quyết toán giá trị — nhánh ký riêng | Phòng Hợp đồng / Chuyên quản hợp đồng | Hợp đồng; biên bản nghiệm thu hoàn tất; hồ sơ / kết quả quyết toán. |
| 6 | AI hỗ trợ soạn biên bản thanh lý theo mẫu | Hệ thống ĐTMS / AI | Mẫu biên bản thanh lý; hợp đồng; hồ sơ bàn giao / nghiệm thu; bảo lãnh. |
| 7 | Soạn thảo và hoàn thiện biên bản thanh lý | Phòng Hợp đồng / Chuyên quản hợp đồng | Mẫu biên bản; dự thảo; hồ sơ kèm theo; ý kiến trả lại. |
| 8 | AI kiểm tra hồ sơ sau hoàn thiện | Hệ thống ĐTMS / AI | Biên bản thanh lý dự thảo; hợp đồng; căn cứ bàn giao / nghiệm thu và bảo lãnh. |
| 9 | Ký duyệt biên bản thanh lý | Trưởng phòng Hợp đồng | Biên bản thanh lý; bộ hồ sơ trình ký và căn cứ kèm theo. |
| 10 | Ký biên bản thanh lý | Giám đốc VHT | Biên bản thanh lý; bộ hồ sơ trình ký đã được Trưởng phòng Hợp đồng duyệt. |
| 11 | Kiểm tra hồ sơ trình ký | Văn thư | Biên bản thanh lý; bộ hồ sơ trình ký và thông tin ký liên quan. |
| 12 | Ký biên bản thanh lý | Tổng Giám đốc | Biên bản thanh lý; hồ sơ đã qua Trưởng phòng Hợp đồng, Giám đốc VHT và Văn thư. |
| 13 | Cập nhật biên bản thanh lý đã ký đầy đủ — G3 | Phòng Hợp đồng / Chuyên quản hợp đồng | Biên bản thanh lý đã ký; kết quả ký chung từ MS23.03 hoặc ký riêng tại MS23.04. |
| 14 | AI cập nhật thông tin từ biên bản đã ký | Hệ thống ĐTMS / AI | Biên bản thanh lý đã ký đầy đủ; hồ sơ hợp đồng liên quan. |
