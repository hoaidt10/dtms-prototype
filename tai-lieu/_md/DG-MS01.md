<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS01.docx -->
<!-- pk-sha256: 22ca4238de62afaf70c3255310c438498e782a4918dab55b1ff914aa41d6e793 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# DG-MS01 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Diễn giải luồng BPMN/MS01.docx`. Trích dẫn thì ghi mã **DG-MS01** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI**

**VIETTEL HIGH TECH**

**TÀI LIỆU**

**DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ**

**MS01 - PHÊ DUYỆT ĐỀ XUẤT MUA SẮM**

**Phiên bản tài liệu: 1.2**

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
| 24/09/2026 | 1.0 | Khởi tạo tài liệu diễn giải quy trình nghiệp vụ MS01 từ BPMN đã chuẩn hóa. |  |
| 25/09/2026 | 1.1 | Bổ sung thứ tự trình ký BM-05: TTMS ký trước, sau đó giao việc ký cho các thành phần còn lại. |  |
| 27/09/2026 | 1.2 | Viết lại phần diễn giải theo 03 luồng con; bổ sung mô tả nghiệp vụ chi tiết và các nội dung cần đặc tả thêm ngoài BPMN. |  |

**MỤC LỤC**

[A. GIỚI THIỆU 5](#_heading=)

> [1. Mục đích tài liệu 5](#_heading=)
>
> [2. Phạm vi áp dụng 5](#_heading=)
>
> [3. Tài liệu liên quan 5](#_heading=)
>
> [4. Thuật ngữ và các từ viết tắt 5](#_heading=)

[B. TỔNG QUAN NGHIỆP VỤ 6](#_heading=)

> [1. Mục tiêu 6](#_heading=)
>
> [2. Các luồng nghiệp vụ thuộc MS01 7](#_heading=)
>
> [3. Vai trò tham gia 7](#_heading=)
>
> [4. Danh mục biểu mẫu/hồ sơ 8](#_heading=)
>
> [5. Nguyên tắc xử lý chung 8](#_heading=)

[C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ 9](#_heading=)

> [1. MS01.01 - ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào chưa được Chủ tịch/TGĐ Tập đoàn phê duyệt 9](#_heading=)
>
> [1.1. Chuẩn bị căn cứ và hình thành dự thảo ĐXMS 9](#_heading=)
>
> [1.2. Kiểm duyệt cấp đơn vị và lựa chọn CQCM 10](#_heading=)
>
> [1.3. Thẩm định CQCM bằng BM-04 và xử lý ý kiến 10](#_heading=)
>
> [1.4. Kiểm tra lại hồ sơ sau chỉnh sửa và tái ký phiên bản hiện tại 11](#_heading=)
>
> [1.5. Lập và ký BM-05 - TTMS ký trước các thành phần còn lại 11](#_heading=)
>
> [1.6. Báo cáo Tập đoàn và phê duyệt BM-08 11](#_heading=)
>
> [2. MS01.02 - ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt 12](#_heading=)
>
> [2.1. Chuẩn bị và thẩm định hồ sơ 12](#_heading=)
>
> [2.2. Lập, kiểm soát và ký BM-05 12](#_heading=)
>
> [2.3. Bỏ qua khối báo cáo Tập đoàn và chuyển trực tiếp sang BM-08 13](#_heading=)
>
> [3. MS01.03 - ĐXMS dưới 160 tỷ đồng 13](#_heading=)
>
> [3.1. Chuẩn bị hồ sơ BM-09 và sử dụng chung vòng CQCM 13](#_heading=)
>
> [3.2. Hoàn chỉnh và ký lại hồ sơ theo phiên bản hiện tại 14](#_heading=)
>
> [3.3. Ký thẩm định trực tiếp BM-09 14](#_heading=)

[D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN 14](#_heading=)

> [1. Nội dung đã chốt cần thể hiện rõ trong SRS 14](#_heading=)
>
> [2. Nội dung cần tiếp tục làm rõ 16](#_heading=)

[E. PHỤ LỤC - BẢNG SO SÁNH NHANH 03 LUỒNG CON 16](#_heading=)

# A. GIỚI THIỆU

## 1. Mục đích tài liệu

Tài liệu này diễn giải quy trình MS01 - Phê duyệt Đề xuất mua sắm theo cách dễ đọc, dễ tra cứu và có thể sử dụng làm tài liệu nghiệp vụ lưu trữ. Nội dung không chỉ mô tả trình tự xử lý trên BPMN mà còn làm rõ bối cảnh nghiệp vụ, đầu vào/đầu ra, trách nhiệm của từng bên, điều kiện chuyển bước, cách xử lý hồ sơ bị trả lại, nguyên tắc sử dụng biểu mẫu và các điểm cần được đặc tả thêm trong SRS/thiết kế hệ thống.

Tài liệu là căn cứ tham chiếu cho BA, đơn vị nghiệp vụ, đội phát triển và kiểm thử khi trao đổi hoặc kiểm tra cách hệ thống ĐTMS hỗ trợ quy trình phê duyệt ĐXMS.

## 2. Phạm vi áp dụng

Áp dụng cho quy trình MS01 trong phạm vi dự án ĐTMS tại VHT, gồm ba luồng con: (i) ĐXMS từ 160 tỷ đồng trở lên với cơ sở đầu vào chưa được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt; (ii) ĐXMS từ 160 tỷ đồng trở lên với cơ sở đầu vào đã được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt; và (iii) ĐXMS dưới 160 tỷ đồng.

## 3. Tài liệu liên quan

| **STT** | **Tên tài liệu** | **Nguồn/Ghi chú** |
|:--:|----|----|
| 1 | MS01_update_bo_sung_trinh_ky_BM05.drawio | BPMN MS01 bản cập nhật gần nhất. |
| 2 | QT.CNVTQĐ.ĐTXD.10.2.1 - 2026_Quy trình ĐXMS (ban hành lần 3) | Baseline quy trình xây dựng và phê duyệt ĐXMS. |
| 3 | VHT_Quyết định ban hành KPI đánh giá hoạt động ĐTMS 2026 | Làm rõ cách thực hiện và biểu mẫu tại VHT. |
| 4 | Các Biên bản làm việc/Q&A MS01 của dự án ĐTMS | Nguồn làm rõ các điểm TO-BE đã thống nhất. |

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
| 8 | RSTK | Rà soát tồn kho. |
| 9 | TGĐ | Tổng Giám đốc. |
| 10 | TTMS | Đầu mối/cơ quan chủ trì đầu tư mua sắm; trong MS01 thực hiện vai trò CQCM chủ trì về ĐTXD. |
| 11 | VHT | Viettel High Tech. |
| 12 | VOffice | Hệ thống phục vụ trình ký/phát hành, được tích hợp với ĐTMS. |
| 13 | eBOM | Engineering Bill of Materials. |
| 14 | mBOM | Manufacturing Bill of Materials. |

# B. TỔNG QUAN NGHIỆP VỤ

## 1. Mục tiêu

MS01 kiểm soát toàn bộ quá trình từ khi đơn vị phát sinh nhu cầu mua sắm đến khi ĐXMS được phê duyệt. Hệ thống ĐTMS hỗ trợ tập trung dữ liệu đầu vào, kiểm tra tồn kho và báo giá, phối hợp thẩm định của nhiều CQCM, quản lý vòng chỉnh sửa/giải trình, tích hợp VOffice để ký văn bản và phân luồng phê duyệt theo giá trị ĐXMS cũng như trạng thái phê duyệt của tài liệu đầu vào.

## 2. Các luồng nghiệp vụ thuộc MS01

| **Mã luồng** | **Điều kiện áp dụng** | **Kết quả phê duyệt chính** |
|:--:|----|----|
| MS01.01 | ĐXMS \>=160 tỷ; cơ sở tài liệu đầu vào chưa được Chủ tịch/TGĐ Tập đoàn phê duyệt. | Thẩm định BM-05, thực hiện nhánh báo cáo Tập đoàn, sau đó phê duyệt bằng BM-08. |
| MS01.02 | ĐXMS \>=160 tỷ; cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt. | Thẩm định BM-05, bỏ qua khối BM-06/BM-07, phê duyệt bằng BM-08. |
| MS01.03 | ĐXMS \<160 tỷ. | Vẫn thẩm định CQCM bằng BM-04; TTMS và cấp chuyên trách ký thẩm định trực tiếp BM-09; phê duyệt trực tiếp trên BM-09. |

## 3. Vai trò tham gia

| **STT** | **Vai trò** | **Trách nhiệm chính** |
|:--:|----|----|
| 1 | Đơn vị đề xuất mua sắm | Khởi tạo nhu cầu, lựa chọn căn cứ, rà soát dữ liệu, lập dự thảo, lựa chọn CQCM, tiếp nhận ý kiến và hoàn chỉnh hồ sơ. |
| 2 | TTMS | Kiểm tra danh sách CQCM, chủ trì xử lý các nội dung chưa thống nhất, kiểm soát hồ sơ thẩm định; đối với BM-05, TTMS rà soát/cập nhật và là người ký đầu tiên với tư cách CQCM về ĐTXD. |
| 3 | CQCM phối hợp | Thẩm định theo chức năng nhiệm vụ; lập/ký BM-04, kiểm tra lại hồ sơ sau chỉnh sửa và tham gia ký BM-05 khi thuộc thành phần. |
| 4 | Phó TGĐ/Phó GĐ chuyên trách | Tham gia ký thẩm định BM-05 hoặc BM-09 theo nhánh áp dụng. |
| 5 | Thủ trưởng đơn vị VHT | Kết luận nội dung chưa thống nhất; xem xét/trình ký BM-06; phê duyệt ĐXMS theo thẩm quyền. |
| 6 | Ban ĐTXD Tập đoàn | Tiếp nhận hồ sơ/BM-06, xem xét và lập BM-07 khi hồ sơ đủ điều kiện. |
| 7 | Tổng GĐ Tập đoàn | Tiếp nhận, xem xét/cho ý kiến đối với BM-07 theo phương án TO-BE hiện tại. |
| 8 | Hệ thống ĐTMS/Tích hợp/AI | Tự động lấy/tổng hợp dữ liệu, sinh dự thảo, kiểm tra điều kiện, theo dõi đủ hồ sơ/kết quả ký, gửi thông báo, tích hợp VOffice và hỗ trợ AI. |

## 4. Danh mục biểu mẫu/hồ sơ

| **STT** | **Biểu mẫu/Hồ sơ** | **Mục đích sử dụng** |
|:--:|----|----|
| 1 | Checklist 01 | Checklist hồ sơ áp dụng cho nhánh ĐXMS từ 160 tỷ đồng trở lên. |
| 2 | Checklist 02 | Checklist hồ sơ áp dụng cho nhánh ĐXMS dưới 160 tỷ đồng. |
| 3 | BM-01 | Tờ trình/hồ sơ ĐXMS đối với nhánh từ 160 tỷ đồng trở lên. |
| 4 | BM-02 | Phiếu trình giải quyết công việc/giải trình. |
| 5 | BM-03 | Yêu cầu/Công văn đề nghị góp ý, thẩm định. |
| 6 | BM-04 | Văn bản thẩm định dự thảo ĐXMS của CQCM. |
| 7 | BM-05 | Báo cáo kết quả thẩm định ĐXMS. |
| 8 | BM-06 | Công văn báo cáo TGĐ Tập đoàn về nội dung ĐXMS trước khi phê duyệt. |
| 9 | BM-07 | Báo cáo gửi TGĐ Tập đoàn về nội dung ĐXMS. |
| 10 | BM-08 | Quyết định phê duyệt ĐXMS. |
| 11 | BM-09 | Tờ trình ĐXMS ký trực tiếp đối với nhánh dưới 160 tỷ. |

## 5. Nguyên tắc xử lý chung

- Người dùng phải rà soát và xác nhận nội dung do AI sinh/gợi ý trước khi hệ thống sử dụng cho bước tiếp theo; AI không thay thế quyết định nghiệp vụ của người dùng.

- Hồ sơ sau khi đã bị chỉnh sửa phải được các CQCM kiểm tra lại và ký/xác nhận lại trên đúng phiên bản hiện tại. Kết quả ký của phiên bản cũ không được coi là kết quả hợp lệ cho phiên bản mới.

- ĐTMS chỉ chuyển bước sau khi nhận được kết quả ký hợp lệ qua tích hợp VOffice đối với các văn bản yêu cầu ký.

- Luồng \<160 tỷ vẫn đi qua vòng CQCM/BM-04 và chỉ tách khỏi luồng \>=160 tỷ ngay trước khi bắt đầu khối BM-05.

- Đối với BM-05, TTMS phải ký trước. Sau khi hệ thống nhận kết quả TTMS ký thành công mới được giao việc ký cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách.

# C. DIỄN GIẢI QUY TRÌNH NGHIỆP VỤ

Phần này diễn giải theo ba luồng con để người đọc không cần theo dõi từng số thứ tự trên BPMN vẫn có thể hiểu logic xử lý, vai trò của từng bên, bộ hồ sơ sử dụng, điều kiện quay lại và điểm kết thúc của mỗi luồng.

## 1. MS01.01 - ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào chưa được Chủ tịch/TGĐ Tập đoàn phê duyệt

|  |  |
|:---|----|
| **Mô tả** | Luồng đầy đủ nhất của MS01. Hồ sơ được chuẩn bị, thẩm định bởi các CQCM, lập BM-05, sau đó thực hiện nhánh báo cáo Tập đoàn trước khi lập và phê duyệt BM-08. |
| **Điều kiện áp dụng** | Giá trị ĐXMS từ 160 tỷ đồng trở lên và cơ sở tài liệu đầu vào chưa được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt. |
| **Đầu vào chính** | Tài liệu đầu vào đã được phê duyệt ở cấp áp dụng; thông tin kế hoạch/eBOM/mBOM; dữ liệu tồn kho; báo giá; dữ liệu ĐXMS. |
| **Đầu ra chính** | BM-08 được phê duyệt/phát hành hoặc hồ sơ kết thúc theo chỉ đạo khác của Người có thẩm quyền. |
| **Vai trò tham gia** | Đơn vị đề xuất; TTMS; CQCM phối hợp; Phó TGĐ/Phó GĐ chuyên trách; Thủ trưởng đơn vị VHT; Ban ĐTXD Tập đoàn; TGĐ Tập đoàn; Hệ thống ĐTMS/Tích hợp/AI. |
| **Biểu mẫu/Hồ sơ** | BM-01, BM-02, BM-03, BM-04, BM-05, BM-06, BM-07, BM-08, Checklist 01; kết quả RSTK và báo giá. |

### 1.1. Chuẩn bị căn cứ và hình thành dự thảo ĐXMS

Đơn vị đề xuất bắt đầu bằng việc lựa chọn đúng tài liệu đầu vào dùng làm căn cứ mua sắm và xác định phạm vi nội dung dự kiến đưa vào ĐXMS. Sau khi người dùng chọn căn cứ, ĐTMS lấy các dữ liệu có sẵn từ kế hoạch, eBOM/mBOM và các nguồn liên quan, sau đó AI có thể tổng hợp và gợi ý bộ thông tin cơ bản của ĐXMS. Các gợi ý này không được coi là dữ liệu chốt; người dùng phải rà soát lại mục đích mua sắm, phạm vi/quy mô, giá trị, nguồn vốn, thời gian, biện pháp/kế hoạch thực hiện và độ Mật trước khi tiếp tục.

Tiếp theo, đơn vị đề xuất bóc tách căn cứ đến từng dòng/hạng mục để xác định nhu cầu thực tế. Hệ thống kiểm tra dữ liệu Dự toán, eBOM, mBOM và thông tin tồn kho; phần căn cứ đã được sử dụng hoặc đang được giữ cho luồng khác không được tính lại vào phần còn có thể sử dụng. Nếu thông tin căn cứ chưa đầy đủ, hồ sơ quay lại khâu rà soát thông tin cơ bản thay vì tiếp tục sang lập nhu cầu.

Khi dữ liệu căn cứ đầy đủ, đơn vị đề xuất nhận kết quả rà soát tồn kho theo sổ sách và kết quả kiểm tra thực tế, phối hợp đánh giá số lượng/chất lượng có thể sử dụng. Phần thiếu sau rà soát tồn kho trở thành cơ sở lập yêu cầu báo giá. Theo TO-BE đã chốt, ĐTMS gửi yêu cầu báo giá trực tiếp tới nhà cung cấp/đầu mối theo thông tin người dùng đã lập. Nếu báo giá chưa đạt yêu cầu, luồng quay lại việc gửi/lấy báo giá; chỉ khi báo giá đạt mới tiếp tục lập dự thảo BM-01 và Checklist 01.

### 1.2. Kiểm duyệt cấp đơn vị và lựa chọn CQCM

Dự thảo BM-01 phải được Chỉ huy đơn vị đề xuất kiểm duyệt trước khi gửi ra ngoài đơn vị. Nếu chưa đạt, AI hỗ trợ chỉ ra phần cần chỉnh sửa nhưng người dùng vẫn là bên quyết định nội dung cập nhật. Khi hồ sơ đạt cấp đơn vị, hệ thống sinh dự thảo BM-03 để đơn vị đề xuất kiểm tra và lựa chọn các CQCM tham gia thẩm định.

Danh sách CQCM do đơn vị đề xuất lựa chọn chưa được gửi ngay. TTMS phải kiểm tra danh sách này có đúng chức năng, đúng phạm vi và đủ các CQCM cần tham gia hay không. Nếu chưa đúng/đủ, hồ sơ được trả lại để lựa chọn lại. Chỉ sau khi TTMS xác nhận danh sách hợp lệ, hệ thống mới gửi yêu cầu thẩm định/trình ký/thông báo tới các CQCM.

### 1.3. Thẩm định CQCM bằng BM-04 và xử lý ý kiến

Mỗi CQCM nghiên cứu hồ sơ và phản hồi bằng BM-04, trong đó phải thể hiện rõ phần đồng ý, phần chưa đạt và yêu cầu chỉnh sửa nếu có. Chỉ huy CQCM xác nhận nội dung trên ĐTMS trước khi hệ thống tạo/gửi trình ký BM-04 qua VOffice. Nếu nội dung BM-04 chưa được đồng ý trình ký, AI tóm tắt phần cần sửa để CQCM hoàn thiện lại. Hệ thống theo dõi kết quả ký và không cho chuyển sang xử lý tổng hợp cho đến khi đủ BM-04 hợp lệ của toàn bộ CQCM theo danh sách đã được TTMS xác nhận.

Sau khi đủ BM-04, AI hỗ trợ phát hiện các nhận xét có khả năng mâu thuẫn giữa các CQCM và tóm tắt toàn bộ nội dung NOK/ý kiến cần xử lý cho đơn vị đề xuất. Đơn vị đề xuất xem xét từng ý kiến, lựa chọn tiếp thu hoặc lập giải trình/bảo lưu. Nếu tiếp thu, BM-01 được cập nhật; nếu không đồng ý, đơn vị lập BM-02 và nội dung giải trình, nêu rõ lý do bảo lưu.

Nếu hồ sơ phải xử lý lại nhiều lần, ĐTMS ghi nhận số vòng. Khi số vòng vượt 02 vòng, hệ thống cảnh báo và yêu cầu tổ chức họp. TTMS chủ trì cuộc họp giữa các bên để thống nhất nội dung còn vướng. Nếu sau họp vẫn chưa thống nhất, TTMS trình lên Thủ trưởng đơn vị VHT để kết luận; tùy kết luận, hồ sơ được hoàn chỉnh theo phương án thống nhất hoặc quay lại khâu lập/chỉnh sửa dự thảo.

### 1.4. Kiểm tra lại hồ sơ sau chỉnh sửa và tái ký phiên bản hiện tại

Khi đơn vị đề xuất hoàn chỉnh hồ sơ, CQCM phải kiểm tra lại việc xử lý các yêu cầu trước đó. BM-04 và Checklist 01 phải được xác nhận/ký lại trên phiên bản hồ sơ hiện tại. Hệ thống gửi trình ký và tổng hợp kết quả của phiên bản mới; nếu còn thiếu kết quả ký thì hồ sơ ở trạng thái chờ, không được chuyển sang BM-05. Quy tắc này nhằm tránh sử dụng lại chữ ký của phiên bản cũ sau khi nội dung hồ sơ đã thay đổi.

### 1.5. Lập và ký BM-05 - TTMS ký trước các thành phần còn lại

Sau khi đủ kết quả ký của phiên bản hồ sơ hiện tại, AI sinh dự thảo BM-05 từ hồ sơ đã hoàn chỉnh và các ý kiến thẩm định. TTMS, với vai trò CQCM chủ trì về ĐTXD, rà soát và cập nhật BM-05 để bảo đảm nội dung phản ánh đúng hồ sơ và kết quả thẩm định. Ở giai đoạn này TTMS chưa ký; đây chỉ là bước kiểm soát nội dung.

Khi BM-05 đã được rà soát, cập nhật đầy đủ, TTMS xác nhận hồ sơ đủ điều kiện trình ký. ĐTMS sau đó tạo yêu cầu trình ký BM-05 qua VOffice riêng cho TTMS. TTMS thực hiện ký BM-05 với tư cách CQCM về ĐTXD. Đây là điểm kiểm soát tuần tự bắt buộc: hệ thống phải nhận được kết quả TTMS ký thành công trước khi được phép giao việc ký cho các thành phần còn lại.

Sau khi nhận kết quả TTMS ký thành công, ĐTMS mới thông báo/giao việc ký BM-05 cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách theo phân công. Hai nhóm ký tiếp tục xem xét nội dung thuộc phạm vi trách nhiệm của mình. Khi một hoặc nhiều bên không đồng ý, luồng quay lại khối tổng hợp NOK để đơn vị đề xuất xử lý và hồ sơ phải đi lại vòng hoàn chỉnh, kiểm tra và ký trên phiên bản mới.

### 1.6. Báo cáo Tập đoàn và phê duyệt BM-08

Với MS01.01, sau khi BM-05 hoàn tất, hồ sơ đi theo nhánh cần báo cáo TGĐ Tập đoàn. AI hỗ trợ soạn BM-06, TTMS rà soát và Thủ trưởng đơn vị VHT xác nhận trình ký. Hệ thống chuyển BM-06 qua VOffice để ký/phát hành rồi chuyển Ban ĐTXD Tập đoàn. Ban ĐTXD xem xét hồ sơ; nếu chưa chấp nhận, hồ sơ được trả lại để xử lý NOK. Nếu chấp nhận, Ban ĐTXD lập/gửi BM-07 đến TGĐ Tập đoàn, đồng thời gửi thông tin cho TTMS và đầu mối đơn vị đề xuất.

Theo phương án TO-BE hiện tại, TGĐ Tập đoàn xem xét/cho ý kiến đối với BM-07. Nếu ý kiến yêu cầu trả lại, hồ sơ quay lại vòng xử lý NOK; nếu đồng ý, luồng hợp nhất sang giai đoạn phê duyệt. Hệ thống sinh dự thảo BM-08, TTMS rà soát BM-08 và Checklist 01 rồi trình Người có thẩm quyền. Người có thẩm quyền có thể yêu cầu hoàn chỉnh, đưa ra chỉ đạo khác hoặc đồng ý phê duyệt. Khi đồng ý, ĐTMS tạo/gửi ký duyệt BM-08 qua VOffice và cập nhật kết quả phát hành.

## 2. MS01.02 - ĐXMS từ 160 tỷ đồng trở lên, cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt

|  |  |
|:---|----|
| **Mô tả** | Luồng sử dụng cùng cơ chế chuẩn bị và thẩm định như MS01.01 nhưng không đi qua khối BM-06/BM-07; sau khi BM-05 hoàn tất, hồ sơ chuyển trực tiếp sang lập và phê duyệt BM-08. |
| **Điều kiện áp dụng** | Giá trị ĐXMS từ 160 tỷ đồng trở lên và cơ sở tài liệu đầu vào đã được Chủ tịch/Tổng Giám đốc Tập đoàn phê duyệt. |
| **Đầu vào chính** | Tài liệu đầu vào đã được phê duyệt; dữ liệu kế hoạch/eBOM/mBOM; dữ liệu tồn kho; báo giá; hồ sơ ĐXMS. |
| **Đầu ra chính** | BM-08 được phê duyệt/phát hành hoặc hồ sơ kết thúc theo chỉ đạo khác của Người có thẩm quyền. |
| **Vai trò tham gia** | Đơn vị đề xuất; TTMS; CQCM phối hợp; Phó TGĐ/Phó GĐ chuyên trách; Thủ trưởng đơn vị VHT; Hệ thống ĐTMS/Tích hợp/AI. |
| **Biểu mẫu/Hồ sơ** | BM-01, BM-02, BM-03, BM-04, BM-05, BM-08, Checklist 01; kết quả RSTK và báo giá. |

### 2.1. Chuẩn bị và thẩm định hồ sơ

Từ lúc khởi tạo nhu cầu đến khi hoàn tất vòng CQCM, MS01.02 được xử lý giống MS01.01: lựa chọn căn cứ; lấy dữ liệu kế hoạch/eBOM/mBOM; rà soát thông tin cơ bản; kiểm tra tồn kho; lập và kiểm tra báo giá; hoàn thiện BM-01 + Checklist 01; kiểm duyệt cấp đơn vị; lập BM-03; TTMS xác nhận danh sách CQCM; các CQCM lập/ký BM-04; hệ thống chỉ tiếp tục khi đủ BM-04 hợp lệ.

Khi có ý kiến NOK, đơn vị đề xuất phải cập nhật BM-01 hoặc lập BM-02 để giải trình/bảo lưu. Quy tắc theo dõi số vòng xử lý, yêu cầu họp khi vượt 02 vòng, trình cấp cao hơn nếu chưa thống nhất và việc ký lại BM-04/Checklist 01 trên phiên bản hiện tại cũng áp dụng đầy đủ như MS01.01.

### 2.2. Lập, kiểm soát và ký BM-05

Sau khi hồ sơ đã hoàn chỉnh và đủ kết quả ký lại của phiên bản hiện tại, AI sinh dự thảo BM-05. TTMS rà soát/cập nhật nội dung, sau đó xác nhận hồ sơ đủ điều kiện trình ký. Hệ thống tạo yêu cầu trình ký BM-05 qua VOffice cho TTMS trước. TTMS ký với tư cách CQCM về ĐTXD; chỉ khi ĐTMS nhận kết quả ký thành công mới thông báo/giao việc ký cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách. Cách xử lý này giúp thể hiện rõ TTMS là thành phần ký đầu tiên của BM-05, không phải ký đồng thời với các bên còn lại.

### 2.3. Bỏ qua khối báo cáo Tập đoàn và chuyển trực tiếp sang BM-08

Điểm khác biệt cốt lõi của MS01.02 nằm sau BM-05. Do cơ sở tài liệu đầu vào đã được Chủ tịch/TGĐ Tập đoàn phê duyệt, hồ sơ không đi qua khối soạn/trình BM-06, Ban ĐTXD lập BM-07 và TGĐ Tập đoàn xem xét BM-07. Luồng được hợp nhất trực tiếp sang giai đoạn sinh dự thảo BM-08.

ĐTMS sinh dự thảo Quyết định phê duyệt, TTMS rà soát BM-08 và Checklist 01 rồi trình Người có thẩm quyền. Nếu Người có thẩm quyền yêu cầu hoàn chỉnh, hồ sơ quay lại khối xử lý NOK để cập nhật và đi lại các bước kiểm soát cần thiết. Nếu đồng ý, hệ thống chuyển BM-08 sang VOffice để ký duyệt/phát hành và ghi nhận kết quả trên ĐTMS.

## 3. MS01.03 - ĐXMS dưới 160 tỷ đồng

|  |  |
|:---|----|
| **Mô tả** | Luồng dưới 160 tỷ vẫn tái sử dụng đầy đủ cơ chế CQCM/BM-04 và xử lý NOK của hai luồng lớn hơn, nhưng dùng BM-09 + Checklist 02 và không thực hiện BM-05/BM-06/BM-07/BM-08. |
| **Điều kiện áp dụng** | Giá trị ĐXMS dưới 160 tỷ đồng. |
| **Đầu vào chính** | Tài liệu đầu vào; dữ liệu kế hoạch/eBOM/mBOM; tồn kho; báo giá; thông tin ĐXMS. |
| **Đầu ra chính** | BM-09 được Người có thẩm quyền ký duyệt trực tiếp hoặc hồ sơ được trả lại để hoàn chỉnh. |
| **Vai trò tham gia** | Đơn vị đề xuất; TTMS; CQCM phối hợp; Phó TGĐ/Phó GĐ chuyên trách; Thủ trưởng đơn vị VHT; Hệ thống ĐTMS/Tích hợp/AI. |
| **Biểu mẫu/Hồ sơ** | BM-02, BM-03, BM-04, BM-09, Checklist 02; kết quả RSTK và báo giá. |

### 3.1. Chuẩn bị hồ sơ BM-09 và sử dụng chung vòng CQCM

Các hoạt động chuẩn bị đầu vào của MS01.03 vẫn giống hai luồng còn lại: đơn vị đề xuất chọn căn cứ, hệ thống lấy dữ liệu, AI gợi ý thông tin cơ bản, người dùng rà soát, bóc tách căn cứ, kiểm tra dữ liệu Dự toán/eBOM/mBOM/tồn kho, nhận kết quả RSTK, lập yêu cầu báo giá và kiểm tra báo giá. Điểm khác biệt xuất hiện khi xác định giá trị ĐXMS dưới 160 tỷ: đơn vị đề xuất lập BM-09 kèm Checklist 02 thay cho BM-01 + Checklist 01.

BM-09 vẫn phải được kiểm duyệt cấp đơn vị trước khi gửi CQCM. Sau đó hệ thống sinh BM-03, đơn vị đề xuất chọn CQCM và TTMS kiểm tra danh sách CQCM đã đúng/đủ. Các CQCM vẫn lập, xác nhận và ký BM-04; hệ thống vẫn theo dõi đủ BM-04 hợp lệ; AI vẫn tổng hợp NOK/xung đột; đơn vị đề xuất vẫn phải xử lý, giải trình bằng BM-02 và có thể đi qua cơ chế họp/kết luận nếu số vòng xử lý vượt ngưỡng.

### 3.2. Hoàn chỉnh và ký lại hồ sơ theo phiên bản hiện tại

Sau khi tiếp thu hoặc giải trình ý kiến CQCM, hồ sơ của nhánh dưới 160 tỷ được hoàn chỉnh theo bộ BM-09 + BM-02 + BM-04 + Checklist 02. CQCM kiểm tra lại nội dung đã được sửa và ký/xác nhận lại BM-04 cùng Checklist 02 trên phiên bản hiện tại. Hệ thống không cho phép nhánh này chuyển sang giai đoạn ký thẩm định trực tiếp nếu chưa đủ kết quả ký hợp lệ của phiên bản mới.

### 3.3. Ký thẩm định trực tiếp BM-09

Sau điểm tách luồng, MS01.03 không sinh BM-05. TTMS, với vai trò CQCM chủ trì về ĐTXD, xem xét và ký thẩm định trực tiếp trên BM-09. Phó TGĐ/Phó GĐ chuyên trách tiếp tục xem xét và ký thẩm định theo thành phần áp dụng. Hệ thống tạo/gửi trình ký BM-09 qua VOffice và tổng hợp kết quả ký. Nếu kết quả ký thẩm định không đạt, hồ sơ quay lại khối tổng hợp NOK để đơn vị đề xuất xử lý lại.

Khi đủ kết quả ký thẩm định hợp lệ, hồ sơ được chuyển đến Người có thẩm quyền. Người có thẩm quyền xem xét và ký duyệt trực tiếp BM-09. Như vậy, BM-09 vừa là tài liệu được thẩm định trực tiếp bởi các thành phần ký, vừa là tài liệu được Người có thẩm quyền ký duyệt cuối cùng của luồng dưới 160 tỷ.

# D. NỘI DUNG CẦN ĐẶC TẢ/GHI NHẬN THÊM NGOÀI BPMN

BPMN thể hiện tốt thứ tự và điểm quyết định nhưng chưa thể hiện hết yêu cầu dữ liệu, trạng thái, quyền, lỗi tích hợp và nguyên tắc kiểm soát phiên bản. Các nội dung dưới đây cần được ghi rõ trong SRS/thiết kế chi tiết để đội phát triển và kiểm thử có thể triển khai thống nhất.

## 1. Nội dung đã chốt cần thể hiện rõ trong SRS

| **STT** | **Nội dung cần đặc tả** | **Yêu cầu mô tả chi tiết** |
|:--:|----|----|
| 1 | Quản lý phiên bản hồ sơ | Mỗi lần hồ sơ được chỉnh sửa sau ý kiến CQCM cần xác định rõ phiên bản hiện tại. BM-04/Checklist của phiên bản cũ không được dùng để thỏa điều kiện “đủ kết quả ký phiên bản hiện tại”. Cần hiển thị lịch sử phiên bản và thời điểm thay đổi. |
| 2 | Kiểm soát danh sách CQCM | Sau khi Đơn vị ĐXMS chọn CQCM, TTMS phải có thao tác xác nhận danh sách đúng và đủ. Hệ thống chỉ cho gửi yêu cầu thẩm định khi trạng thái xác nhận của TTMS là đồng ý. Khi TTMS không đồng ý, phải lưu lý do/trạng thái trả lại và đưa hồ sơ về bước lựa chọn CQCM. |
| 3 | Điều kiện “đủ BM-04 hợp lệ” | Cần định nghĩa rõ một BM-04 được coi là hợp lệ khi nào: đúng CQCM trong danh sách đã xác nhận, đúng phiên bản hồ sơ, đã có kết quả ký qua VOffice và không ở trạng thái bị thu hồi/hủy/trả lại. |
| 4 | Đếm số vòng xử lý lại | Hệ thống đang sử dụng ngưỡng \>02 vòng để cảnh báo/yêu cầu họp. SRS cần ghi rõ thời điểm tăng bộ đếm, trường hợp nào không tính là một vòng mới và bộ đếm có được đặt lại sau khi họp/kết luận hay không. |
| 5 | Trình tự ký BM-05 | BM-05 không giao ký đồng thời ngay từ đầu. Trình tự bắt buộc là: TTMS rà soát/cập nhật -\> TTMS xác nhận đủ điều kiện -\> Hệ thống trình ký BM-05 cho TTMS qua VOffice -\> nhận kết quả TTMS ký thành công -\> Hệ thống mới giao việc ký cho CQCM Tài chính/CQCM liên quan và Phó TGĐ/Phó GĐ chuyên trách. |
| 6 | Theo dõi trạng thái VOffice | Với mỗi lần trình ký, ĐTMS cần lưu mã giao dịch/yêu cầu, người ký, thời điểm gửi, trạng thái chờ/ký thành công/từ chối/hủy/lỗi và thời điểm nhận kết quả để phục vụ theo dõi và audit. |
| 7 | Xử lý AI | Mọi nội dung AI sinh hoặc tóm tắt cần thể hiện là gợi ý; người dùng phải có khả năng xem nguồn dữ liệu đầu vào, chỉnh sửa nội dung trước khi xác nhận và hệ thống cần lưu dấu nội dung do AI sinh so với nội dung cuối cùng người dùng chốt. |
| 8 | Thông báo/giao việc | Mỗi thông báo cần xác định người nhận, sự kiện kích hoạt, hồ sơ/biểu mẫu liên quan và trạng thái sau khi người nhận xử lý. Đặc biệt với BM-05, thông báo cho các bên còn lại chỉ phát sinh sau khi TTMS ký thành công. |
| 9 | Quyền truy cập và độ Mật | Cần kiểm soát quyền xem/sửa/ký theo vai trò, đơn vị và độ Mật của hồ sơ; người không thuộc danh sách xử lý không được xem hoặc thay đổi các nội dung hạn chế. |
| 10 | Nhật ký xử lý | Cần lưu người thực hiện, thời điểm, hành động, phiên bản hồ sơ, lý do trả lại/từ chối, thay đổi danh sách CQCM, kết quả ký và các lần gửi lại để phục vụ truy vết. |

## 2. Nội dung cần tiếp tục làm rõ

| **STT** | **Nội dung** | **Điểm cần xác nhận** |
|:--:|----|----|
| 1 | Cơ chế trả hồ sơ khi ký BM-05 | Khi CQCM phối hợp và Phó TGĐ/Phó GĐ chuyên trách đang ký theo hai nhánh song song, nếu một bên từ chối trong khi bên còn lại chưa hoàn tất thì chưa chốt rõ hệ thống trả hồ sơ ngay hay chờ đủ hai kết quả. BPMN hiện tại giữ cơ chế đang có; cần xác nhận trước khi đặc tả trạng thái chi tiết. |
| 2 | Danh sách CQCM bắt buộc theo từng loại nội dung | BPMN đã có bước TTMS kiểm tra “đúng và đủ”, nhưng chưa có ma trận chính thức xác định CQCM nào bắt buộc theo lĩnh vực/loại hàng hóa/nguồn vốn. Cần tài liệu cấu hình hoặc quy tắc nghiệp vụ để hệ thống có thể hỗ trợ kiểm tra tự động. |
| 3 | Biểu mẫu/kết quả cuộc họp | Ba tài liệu hiện dùng chưa quy định một biểu mẫu chuẩn riêng cho kết quả cuộc họp khi xử lý quá 02 vòng. Cần xác định dữ liệu tối thiểu phải ghi nhận và có cần đính kèm biên bản hay không. |
| 4 | Điều kiện chi tiết của nhánh báo cáo TGĐ | BPMN giao TTMS xác định Có/Không cần báo cáo TGĐ Tập đoàn. SRS cần dẫn chiếu đúng quy định/ủy quyền làm căn cứ cho quyết định này, không tự suy diễn chỉ từ giá trị. |
| 5 | Trạng thái lỗi/tạm dừng khi tích hợp VOffice | Cần chốt cách xử lý khi VOffice không phản hồi, trả lỗi kỹ thuật, người ký hủy yêu cầu hoặc thay đổi người ký; bao gồm cơ chế gửi lại và tránh tạo yêu cầu ký trùng. |

# E. PHỤ LỤC - BẢNG SO SÁNH NHANH 03 LUỒNG CON

| **Tiêu chí** | **MS01.01** | **MS01.02** | **MS01.03** |
|:--:|----|----|----|
| Điều kiện giá trị | \>=160 tỷ | \>=160 tỷ | \<160 tỷ |
| Tài liệu đầu vào đã được Chủ tịch/TGĐ TĐ phê duyệt | Chưa | Đã | Không phải tiêu chí phân nhánh chính |
| Dự thảo chính | BM-01 + Checklist 01 | BM-01 + Checklist 01 | BM-09 + Checklist 02 |
| CQCM thẩm định bằng BM-04 | Có | Có | Có |
| BM-02 giải trình | Có | Có | Có |
| BM-05 | Có | Có | Không |
| TTMS ký BM-05 trước các bên khác | Có | Có | Không áp dụng |
| BM-06/BM-07 | Có, theo nhánh báo cáo | Không | Không |
| Tài liệu phê duyệt cuối | BM-08 | BM-08 | BM-09 |
| Tích hợp VOffice | Có | Có | Có |
