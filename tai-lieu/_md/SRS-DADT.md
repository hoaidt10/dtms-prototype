<!-- pk-source: ../docs/SRS/10-srs-dadt/ĐTMS_SRS Quản lý đề tài - dự án - V1.5.docx -->
<!-- pk-sha256: 5dad10e3b75b045c915a79e7578e3c544508d8d9ffe77aa746ca24c264c976ab -->
<!-- pk-generated: 2026-11-12 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SRS-DADT — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/10-srs-dadt/ĐTMS_SRS Quản lý đề tài - dự án - V1.5.docx`. Trích dẫn thì ghi mã **SRS-DADT** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI VIETTEL**

**TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL**

**TÀI LIỆU THIẾT KẾ CHI TIẾT**

**QUẢN LÝ ĐỀ TÀI / DỰ ÁN**

Mã hiệu dự án: CNM.VHT.DTMS

Mã hiệu tài liệu: CNM.VHT.DTMS_SRS_DADT

Phiên bản: 1.5 (dự thảo)

Hà Nội, 12/11/2026

**BẢNG GHI NHẬN THAY ĐỔI TÀI LIỆU**

\*A – Tạo mới, M – Sửa đổi, D – Xóa bỏ

| **Ngày thay đổi** | **Vị trí thay đổi** | **A\*, M, D** | **Nguồn gốc** | **Phiên bản cũ** | **Mô tả thay đổi** | **Phiên bản mới** |
|----|----|----|----|----|----|----|
| 05/11/2026 | Toàn bộ | A | Nội dung chỉnh sửa và bổ sung bản dựng thử ĐXMS, ghi chú và ảnh hệ thống cũ, mẫu xuất / import đề tài dự án, ghi âm làm việc với TTMS 04/11/2026 |  | Tạo mới tài liệu (dự thảo, chưa rà toàn bộ) | 0.9 |
| 05/11/2026 | Toàn bộ | M, A | Rà toàn bộ (T32 B5); người dùng duyệt B0 … B4 | 0.9 | Sửa theo rà lượt cuối: đồng bộ, nhập theo mẫu (mã yêu cầu, đóng lỗi, lần bị gián đoạn, đề tài chuyển từ hệ thống cũ), định nghĩa có dự toán chi tiết, nhật ký, thiết kế CSDL; sắp lại tiêu chí chấp nhận | 1.0 |
| 09/11/2026 | Mục 2.1, 2.3.4, 2.3.5, 2.3.6, 3.1.1 – 3.1.4, 5.1 | M, A | Review SRS Đề tài / dự án 09/11/2026; đối chiếu bản dựng thử 09/11/2026 | 1.0 | Menu Đề tài / dự án lên cấp 1, dùng chung đề xuất mua sắm và khoản đầu tư; lịch rà soát toàn bộ, đánh dấu đề tài Không còn ở nguồn; Mã cũ khi nguồn đổi mã; khoản mục chưa đóng của đề tài đã kết thúc (lọc, nhãn, cảnh báo); cột Quy trình ở bảng ĐXMS liên quan; mẫu nhập thêm cột Mã dự án Mật, Mã cũ; theo bản dựng thử: Trạng thái khoản mục do hệ thống suy (Chưa mua sắm, Đang mua sắm, Đã phê duyệt), TTMS chỉ đánh dấu Hoàn thành; phần giữ trước khi có cơ sở giá theo giá trị ước tính; khoản đầu tư chưa có hồ sơ giữ phần khai báo, khai báo vượt dự toán của khoản mục không lưu được; Tỷ lệ đã đăng ký mua gồm phần đang giữ; câu hỏi DTMS_Q_0433 – 0437 | 1.1 |
| 10/11/2026 | Mục 3.3 (BR-DADT-03-01, 03-02, AC-0247-12) | M | Cập nhật theo bản dựng thử 10/11/2026: khoản đầu tư nhiều đề tài / dự án | 1.1 | Khoản đầu tư liên quan theo các đề tài làm căn cứ (một khoản đầu tư hiện ở mọi đề tài của nó); giá trị phân bổ gói thầu của nguồn khoản đầu tư nhiều đề tài theo hạng mục thuộc đề tài | 1.2 |
| 11/11/2026 | Mục 2.2, 2.3.1.4, 2.3.6, 3.1.1 (BR-DADT-01-05, DTMS_CN_0240), 5.1.2, 6, 3.1.4, 2.1, 2.3 | M, A, D | Rà lại tìm kiếm nâng cao danh sách đề tài / dự án; đối chiếu Danh mục dùng chung bản 10/11/2026; yêu cầu người dùng 11/11/2026 bỏ nhập theo mẫu | 1.2 | Thêm ô lọc Nguồn dữ liệu, Nguồn dữ liệu ba giá trị (Đồng bộ Khoa học công nghệ, Đồng bộ HR Tool, Chuyển từ hệ thống cũ) theo tài liệu Đồng bộ đề tài / dự án; Khối đơn vị là đơn vị cấp Khối trên cây đơn vị (tham số cấp Khối); ô Cấp phê duyệt, Nguồn vốn, Loại, Loại chi tiết lấy từ danh mục kể cả giá trị ngừng sử dụng; Từ khóa tìm cả Mã cũ; tình trạng danh mục dùng chung; bỏ chức năng Nhập đề tài / dự án theo mẫu (DTMS_CN_0251), bảng lần nhập, tham số tệp nhập; Nguồn dữ liệu dẫn chiếu tài liệu Đồng bộ đề tài / dự án; Chi tiết đề tài: tách tab ĐXMS liên quan và tab KĐT liên quan (DTMS_CN_0247) | 1.3 |
| 11/11/2026 | Mục 1.2, 1.3, 2.3.4, 2.3.5, 3.1.2 (BR-DADT-02-01, 02-03, 02-04, 02-05, 02-07, 02-08, 02-10; DTMS_CN_0243 – DTMS_CN_0246), 5.1, 6 | M, A | Đối chiếu bản viết lại "ĐTMS_SRS Quan ly de tai - du an_V3.0" (11/2026), doi-chieu-v3.md | 1.3 | Chi mua sắm, Trạng thái khoản mục đổi trong chế độ chỉnh sửa \[Chỉnh sửa\] / \[Lưu\] / \[Hủy\], lưu một lần (BR-DADT-02-10); Giá trị thực hiện thay bằng ba mốc Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm = giá trị dự toán − giá trị mốc muộn nhất; 10 chỉ số thực hiện; dữ liệu Lựa chọn nhà thầu, Hợp đồng chưa có thì hiện "-"; câu hỏi DTMS_Q_0673 – 0675 | 1.4 |
| 12/11/2026 | Mục 3.1.1 (DTMS_CN_0240 ô 5, 6, AC-0240-07, 28), 3.1.3 (DTMS_CN_0247 thành phần 8, 16, AC-0247-03, 07, 14), 2.3.4 (BR-DADT-C-11) | M, A | Review prototype 12/11 (kho comment) — T56 | 1.4 | Tab ĐXMS liên quan: cột Giá trị hiệu lực (tỷ đồng) đổi tên Giá trị đề xuất (tỷ đồng), giá trị không đổi; tab KĐT liên quan: Nhóm KĐT hiện Đơn giản / Thông thường / Phức tạp, chưa xác định nhóm thì "-"; ô lọc Ngày QĐ đầu tư từ / đến thành một trường khoảng hai ô chọn ngày có biểu tượng lịch, giữa dấu "-", lỗi ngày hiện dưới trường; chụp lại ảnh danh sách, tìm kiếm nâng cao, tab ĐXMS liên quan, tab KĐT liên quan | 1.5 |

**TRANG KÝ**

**Người lập: \<Ngày\>**

\<Chức danh\>

**Người xem xét: \<Ngày\>**

\<Chức danh\>

**Người xem xét: \<Ngày\>**

\<Chức danh\>

**Người phê duyệt: \<Ngày\>**

\<Chức danh\>

MỤC LỤC

# GIỚI THIỆU

## Mục đích

Tài liệu mô tả chi tiết module Quản lý đề tài / dự án của hệ thống ĐTMS: chức năng, màn hình, luồng, trạng thái, phân quyền, quy tắc nghiệp vụ và nguồn dữ liệu. Đề tài / dự án là đầu vào bắt buộc của đề xuất mua sắm và khoản đầu tư; dự toán chi phí của đề tài / dự án là căn cứ để bóc tách nhu cầu mua sắm và theo dõi phần còn được dùng. Người đọc là đội phát triển, đội kiểm thử, BA và đơn vị nghiệp vụ. Đội phát triển và kiểm thử dùng tài liệu này làm căn cứ xây dựng và nghiệm thu.

## Phạm vi

**Trong phạm vi:** tra cứu, xem chi tiết, xuất danh sách đề tài / dự án; xem dự toán chi phí; đánh dấu khoản mục Chi mua sắm, Hoàn thành; theo dõi thực hiện dự toán (các đợt đề xuất mua sắm, khoản đầu tư đã dùng khoản mục, phần đã đăng ký, đang giữ, còn lại khả dụng); xem đề xuất mua sắm, khoản đầu tư, gói thầu, hợp đồng, văn bản pháp lý liên quan; đồng bộ đề tài / dự án Loại Khoa học công nghệ từ phân hệ Quản lý Khoa học công nghệ. Đồng bộ từ HR Tool theo tài liệu thiết kế Đồng bộ đề tài / dự án. ĐTMS không có chức năng nhập đề tài / dự án từ tệp.

**Phụ thuộc Lựa chọn nhà thầu, Hợp đồng:** tab Gói thầu / Hợp đồng (DTMS_CN_0248), ba giá trị Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ và Giá trị tiết kiệm (BR-DADT-02-05), các mẫu xuất có gói thầu, hợp đồng (DTMS_CN_0241) chỉ có số liệu khi hai module đó được triển khai. Trước đó, các ô này hiện "-", bảng của tab hiện thông báo không có dữ liệu; chức năng khác của module dùng được đầy đủ.

**Quy tắc phần khả dụng của dự toán** (mục 2.3.4, BR-DADT-C-06 – BR-DADT-C-09) do tài liệu này quy định và dùng chung cho Quản lý đề xuất mua sắm, Quản lý khoản đầu tư.

**Dùng lại từ tài liệu thiết kế khác, không mô tả lại:** Danh mục dùng chung, Thông báo, người dùng và đơn vị (mục 2.2). Quy tắc giao diện dùng chung ghi ở mục 4.

**Ngoài phạm vi:** tạo, sửa, xóa đề tài / dự án và dòng dự toán trên ĐTMS (đề tài / dự án được khởi tạo, phê duyệt ở hệ thống nguồn); bóc tách khoản mục vào đề xuất mua sắm, khoản đầu tư (thuộc tài liệu thiết kế của hai module đó, mục 3.1.2); quy trình phê duyệt (module không có quy trình, không có mục phụ lục quy trình); giá trị quyết toán của tài chính; đặc tả API phía phân hệ Quản lý Khoa học công nghệ (chỉ ghi điểm giao tiếp, mục 2.2). Thiết kế cơ sở dữ liệu ở mục 5 là đề xuất cho module; thiết kế API để tài liệu riêng.

## Khái niệm, thuật ngữ

| Thuật ngữ | Ý nghĩa |
|----|----|
| Đề tài / dự án | Nhiệm vụ, đề tài, dự án, phương án kinh doanh hoặc kế hoạch đã được cấp có thẩm quyền phê duyệt, là đầu vào của đề xuất mua sắm, khoản đầu tư. Nhiệm vụ Khoa học công nghệ là đề tài / dự án Loại Khoa học công nghệ. Định danh bằng Mã đề tài (BR-DADT-C-02) |
| Loại dự án / đề tài | Phân loại cấp một: Sản xuất kinh doanh (SXKD), Dự án đầu tư, Khoa học công nghệ, Hoạt động thường xuyên, Dự án đầu tư khác, Dự án kinh doanh khác. Mỗi Loại có danh sách Loại dự án (chi tiết) |
| Nguồn dữ liệu | Nơi đề tài / dự án được đưa vào ĐTMS; giá trị theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4: Đồng bộ Khoa học công nghệ, Đồng bộ HR Tool (hai giá trị này gọi chung là Đồng bộ), Chuyển từ hệ thống cũ (một lần khi đưa hệ thống vào sử dụng) (BR-DADT-C-01) |
| Dự toán chi phí | Bảng chi phí đã phê duyệt của đề tài / dự án, gồm các khoản mục xếp theo Loại chi phí |
| Loại chi phí | Nhóm cấp trên của khoản mục, mặc định PL1 Chi phí xây dựng, PL2 Chi phí vật tư thiết bị, PL3 Chi phí quản lý dự án, PL4 Chi phí tư vấn đầu tư xây dựng, PL5 Chi phí khác, PL6 Chi phí dự phòng |
| Khoản mục | Một dòng của dự toán: tên, đơn vị tính, số lượng, đơn giá, giá trị trước thuế, thuế, giá trị sau thuế |
| Chi mua sắm | Cờ của khoản mục do TTMS đánh dấu: khoản mục phải mua qua đầu mối mua sắm, được bóc tách vào đề xuất mua sắm, khoản đầu tư (BR-DADT-C-05) |
| Trạng thái khoản mục | Chưa mua sắm, Đang mua sắm, Đã phê duyệt (hệ thống suy từ đề xuất mua sắm, khoản đầu tư dùng khoản mục) hoặc Hoàn thành (TTMS đánh dấu); chỉ có ở khoản mục Chi mua sắm (mục 2.3.1.2) |
| Hạng mục liên kết | Hạng mục của đề xuất mua sắm hoặc khoản đầu tư được bóc tách từ một khoản mục |
| Đã đăng ký, Đang giữ, Còn lại khả dụng | Phần của khoản mục đã được dùng bởi hồ sơ đã hoàn thành, đang được dùng bởi hồ sơ đang xử lý, và phần còn được dùng (BR-DADT-C-07) |
| Hồ sơ chi phối | Hồ sơ của một đề xuất mua sắm hoặc khoản đầu tư dùng để tính phần đã dùng, theo tài liệu thiết kế của module đó |
| Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ | Ba mốc giá trị của phần khoản mục đã đưa vào gói thầu: giá trúng thầu, giá trị ký hợp đồng, giá trị hợp đồng sau tất toán, phân bổ về khoản mục; lấy từ Lựa chọn nhà thầu, Hợp đồng, không nhập trên ĐTMS (BR-DADT-02-05) |
| Giá trị mới nhất | Giá trị của mốc muộn nhất đã có trong ba mốc trên: sau khi tất toán HĐ, nếu chưa có thì chọn HĐ, nếu chưa có thì chọn thầu (BR-DADT-02-05) |
| Giá trị tiết kiệm | Giá trị dự toán của phần khoản mục đã có mốc trừ Giá trị mới nhất (BR-DADT-02-05) |
| TTMS | Trung tâm Mua sắm, đầu mối đầu tư mua sắm của VHT |
| ĐVĐX | Đơn vị đề xuất mua sắm, đầu tư |
| Mật | Thuộc tính của đề tài / dự án; đề tài Mật chỉ người được phép mới thấy (BR-DADT-C-10) |
| Không còn ở nguồn | Đánh dấu của đề tài Nguồn dữ liệu Đồng bộ Khoa học công nghệ mà lần đồng bộ phạm vi Toàn bộ không còn thấy ở phân hệ Quản lý Khoa học công nghệ (BR-DADT-04-02) |
| Mã cũ | Mã dự án / đề tài trước khi nguồn đổi mã, ghi trên đề tài mới để tra cứu (BR-DADT-C-02) |
| Khoản mục chưa đóng | Khoản mục Chi mua sắm còn hiệu lực, chưa Hoàn thành, của đề tài đã Hoàn thành hoặc Dừng thực hiện (BR-DADT-02-09) |
| SAP | Hệ thống tài chính, kế toán của khách hàng |

## Tài liệu tham khảo

| Tài liệu | Sử dụng |
|----|----|
| Nội dung chỉnh sửa và bổ sung bản dựng thử hệ thống Đề xuất mua sắm (BA tổng hợp) | Module Đề tài / dự án, đồng bộ, cột Chi mua sắm, xổ các đợt, chỉ số thực hiện |
| Ghi chú màn hình hệ thống cũ (Note màn hình HT cũ) và ảnh chụp hệ thống cũ | Trường, tiêu chí tìm kiếm, cột danh sách, cột dự toán |
| Information Architecture màn Đề xuất mua sắm (BA) | Thành phần màn danh sách, chi tiết, gói thầu, hợp đồng, chi phí, văn bản pháp lý |
| Mẫu xuất danh sách dự án đề tài, mẫu import dự án đề tài của hệ thống cũ | Xuất Excel; danh sách giá trị danh mục (Loại, Nguồn vốn, Trạng thái, Cấp phê duyệt) |
| Bản ghi nhận nghiệp vụ và ghi âm làm việc với TTMS ngày 04/11/2026 | Bóc tách nhu cầu từ dự toán, kiểm soát vượt dự toán, giá trị thực hiện |
| Tài liệu thiết kế chi tiết Quản lý đề xuất mua sắm, Quản lý khoản đầu tư | Văn bản căn cứ, dòng căn cứ, hồ sơ chi phối, phạm vi xem |
| Tài liệu thiết kế chi tiết Đồng bộ đề tài / dự án | Giá trị Nguồn dữ liệu, đồng bộ từ phân hệ Quản lý Khoa học công nghệ và HR Tool |
| Gói đặc tả ĐTMS, bản 27/10/2026 | Quy tắc dùng chung ở mục 4 |

## Mô tả tài liệu

Mục 2 mô tả tổng quan giải pháp và các quy định chung của module (trạng thái, phân quyền, quy tắc chung gồm quy tắc phần khả dụng, nhật ký, tham số). Mục 3 thiết kế chi tiết từng nghiệp vụ; mỗi chức năng gồm thông tin chung, màn hình, mô tả chi tiết các thành phần, luồng nghiệp vụ, tiêu chí chấp nhận. Mục 4 là thiết kế dùng chung và tái sử dụng. Mục 5 là thiết kế cơ sở dữ liệu. Mục 6 là thiết kế đảm bảo tuân thủ tiêu chuẩn quản trị dữ liệu.

# TỔNG QUAN GIẢI PHÁP

## Tổng quan chức năng

Module gồm 11 chức năng, chia thành 4 nghiệp vụ. Mã chức năng nối tiếp mã của tài liệu thiết kế Quản lý khoản đầu tư. Menu: Đầu tư mua sắm \> **Đề tài / dự án**, mục cấp 1 ngay trên nhóm Quản lý đề xuất mua sắm, dùng chung cho người làm đề xuất mua sắm và người làm khoản đầu tư.

| Nghiệp vụ | Tên                      | Mã chức năng                | Số chức năng |
|-----------|--------------------------|-----------------------------|--------------|
| 3.1.1     | Thông tin đề tài / dự án | DTMS_CN_0240 – DTMS_CN_0242 | 3            |
| 3.1.2     | Dự toán chi phí          | DTMS_CN_0243 – DTMS_CN_0246 | 4            |
| 3.1.3     | Thông tin liên quan      | DTMS_CN_0247 – DTMS_CN_0249 | 3            |
| 3.1.4     | Nguồn dữ liệu            | DTMS_CN_0250                | 1            |

**Sơ đồ phân rã chức năng:**

<img src="media/rId36.png" style="width:6.25in;height:2.41238in" alt="Sơ đồ phân rã chức năng" />

**Module chỉ đọc thông tin chung.** Thông tin chung và dự toán của đề tài / dự án đến từ hệ thống nguồn và chỉ xem trên ĐTMS. ĐTMS chỉ ghi ba loại dữ liệu của mình: cờ Chi mua sắm và đánh dấu Hoàn thành của khoản mục (TTMS), liên kết hạng mục ↔ khoản mục (do đề xuất mua sắm, khoản đầu tư ghi khi bóc tách), nhật ký đồng bộ. Các chỉ số thực hiện do hệ thống tính, không lưu tay.

| Màn | Nội dung | Chức năng |
|----|----|----|
| Danh sách đề tài / dự án | Tìm kiếm, lưới, Xuất Excel | DTMS_CN_0240, DTMS_CN_0241 |
| Chi tiết đề tài / dự án, tab Thông tin chung | Thông tin chung, Phê duyệt | DTMS_CN_0242 |
| Tab Dự toán chi phí | Chỉ số thực hiện, bảng dự toán dạng cây (Loại chi phí → Khoản mục → các đợt), Chi mua sắm, Trạng thái, Xuất Excel | DTMS_CN_0243 – DTMS_CN_0246 |
| Tab ĐXMS liên quan, tab KĐT liên quan | Mỗi tab một bảng | DTMS_CN_0247 |
| Tab Gói thầu / Hợp đồng | Hai bảng | DTMS_CN_0248 |
| Tab Văn bản pháp lý | Bảng, tải tệp | DTMS_CN_0249 |
| Quản trị \> Đồng bộ đề tài / dự án | Lần đồng bộ, \[Đồng bộ ngay\], nhật ký | DTMS_CN_0250 |

## Mô hình giao tiếp với hệ thống/module chức năng khác

**Sơ đồ quan hệ chức năng:**

<img src="media/rId40.png" style="width:6.25in;height:3.95963in" alt="Sơ đồ quan hệ chức năng" />

Chiều mũi tên là chiều dữ liệu. Chi tiết từng điểm giao tiếp:

| Module | Đề tài / dự án cần | Chiều | Tình trạng thiết kế |
|----|----|----|----|
| Phân hệ Quản lý Khoa học công nghệ | Đề tài / dự án Loại Khoa học công nghệ: thông tin chung, phê duyệt, dự toán chi tiết, văn bản pháp lý và tệp (DTMS_CN_0250) | Nhận | Chưa có đặc tả trường, cơ chế |
| HR Tool | Đề tài / dự án Loại Sản xuất kinh doanh, Dự án đầu tư: thông tin chung (theo tài liệu thiết kế Đồng bộ đề tài / dự án) | Nhận | Tài liệu thiết kế Đồng bộ đề tài / dự án |
| Hệ thống quản lý đầu tư mua sắm cũ | Đề tài / dự án đang thực hiện, dự toán, văn bản pháp lý; chuyển một lần khi đưa hệ thống vào sử dụng | Nhận | Chưa có |
| Quản lý đề xuất mua sắm | Cung cấp đề tài / dự án, khoản mục bóc tách được, phần khả dụng; nhận hạng mục liên kết khoản mục, trạng thái, giá trị | Hai chiều | Tài liệu thiết kế Quản lý đề xuất mua sắm, mục 3.1.2 |
| Quản lý khoản đầu tư | Như Quản lý đề xuất mua sắm | Hai chiều | Tài liệu thiết kế Quản lý khoản đầu tư, mục 3.1.2 |
| Lựa chọn nhà thầu | Gói thầu, kế hoạch lựa chọn nhà thầu lập từ đề xuất mua sắm, khoản đầu tư của đề tài; giá trị phân bổ theo nguồn (DTMS_CN_0248) | Nhận | Chưa có |
| Hợp đồng | Hợp đồng của gói thầu, giá trị ký; hợp đồng gắn trực tiếp đề tài nếu có (DTMS_CN_0245, DTMS_CN_0248) | Nhận | Chưa có |
| Danh mục dùng chung | Loại dự án / đề tài, Loại dự án (chi tiết, có Loại cha), Nguồn vốn, Cấp phê duyệt, Loại chi phí, Nhóm dự án, Loại sản phẩm, Lĩnh vực, Tình trạng pháp lý, Tình trạng mua sắm, đơn vị tính | Dùng lại | Phân hệ Danh mục dùng chung (bản 10/11/2026) có Lĩnh vực, đơn vị tính, Nguồn kinh phí; chưa có Loại dự án / đề tài, Loại dự án (chi tiết), Cấp phê duyệt, Loại chi phí, Nhóm dự án, Loại sản phẩm, Tình trạng pháp lý, Tình trạng mua sắm — cần thêm, kể cả danh mục Nguồn vốn riêng |
| Người dùng, vai trò, đơn vị | Người dùng (Chủ nhiệm, Người phụ trách báo cáo), cây đơn vị (cấp, cấp trên — suy Khối theo BR-DADT-01-05), vai trò TTMS, quản trị, quyền Xem đề tài / dự án Mật | Nhận | Dùng chung của hệ thống |
| Thông báo | Báo quản trị, TTMS khi đồng bộ lỗi; báo TTMS khi khoản mục âm sau đồng bộ (BR-DADT-04-04) | Dùng lại | DTMS_CN_0096 – DTMS_CN_0107 |
| Tài chính (SAP) | Giá trị quyết toán thực tế | Nhận, đợt sau | Ngoài phạm vi đợt này |

## Các quy định chung

Các quy định áp dụng cho toàn module: trạng thái, vai trò và phân quyền, hạn xử lý, quy tắc chung, nhật ký, tham số hệ thống. Chức năng ở mục 3 dẫn chiếu tới các mục này, không nhắc lại.

### Trạng thái

Module có bốn bộ trạng thái. Trạng thái đề tài / dự án lấy theo nguồn, ĐTMS không đổi. Trạng thái khoản mục do hệ thống suy, TTMS chỉ đánh dấu Hoàn thành. Trạng thái lần đồng bộ do hệ thống ghi. Trạng thái của đề xuất mua sắm, khoản đầu tư, gói thầu, hợp đồng hiện ở các tab theo tài liệu thiết kế của module đó, không định nghĩa lại.

#### Trạng thái đề tài / dự án

| Trạng thái | Ý nghĩa | Được chọn làm căn cứ mới (BR-DADT-C-04) |
|----|----|----|
| Đang thực hiện | Đề tài / dự án đang triển khai | Có |
| Hoàn thành | Đã nghiệm thu, kết thúc | Không |
| Dừng thực hiện | Dừng theo quyết định của cấp có thẩm quyền | Không |

Đổi trạng thái ở nguồn không dừng đề xuất mua sắm, khoản đầu tư đang dùng đề tài (BR-DADT-C-09).

#### Trạng thái khoản mục

Chỉ có ở khoản mục Chi mua sắm = Có; khoản mục Chi mua sắm = Không thì ô Trạng thái để trống. Chưa mua sắm, Đang mua sắm, Đã phê duyệt do hệ thống suy khi đọc, từ dòng con của khoản mục (BR-DADT-02-06), không lưu. Hoàn thành do TTMS đánh dấu (BR-DADT-02-04); bỏ đánh dấu thì khoản mục về trạng thái suy.

| Trạng thái | Ý nghĩa | Vào khi | Bóc tách được |
|----|----|----|----|
| (không có) | Chi mua sắm = Không; ô Trạng thái để trống | Mặc định khi đồng bộ; bỏ Chi mua sắm | Không |
| Chưa mua sắm | Chưa có đề xuất mua sắm, khoản đầu tư nào được tính trên khoản mục | Hệ thống suy: không có dòng con tính Đã đăng ký hoặc Đang giữ (có thể có dòng con Không tính, ví dụ Dừng xử lý) | Có, nếu khoản mục còn hiệu lực và đề tài đủ điều kiện (BR-DADT-C-05) |
| Đang mua sắm | Có đề xuất mua sắm, khoản đầu tư đang xử lý giữ khoản mục | Hệ thống suy: có ít nhất một dòng con tính Đang giữ | Có, như trên |
| Đã phê duyệt | Mọi đề xuất mua sắm, khoản đầu tư được tính đã phê duyệt | Hệ thống suy: có dòng con tính Đã đăng ký, không có dòng con tính Đang giữ | Có, như trên |
| Hoàn thành | TTMS xác nhận khoản mục đã mua xong | TTMS đánh dấu | Không. Phần đã đăng ký, đang giữ giữ nguyên |

Khoản mục còn thuộc tính **Hiệu lực**: Còn hiệu lực hoặc Ngừng sử dụng (khoản mục bị bỏ ở nguồn, BR-DADT-C-09). Khoản mục Ngừng sử dụng không bóc tách được, vẫn hiện trên bảng kèm nhãn "Ngừng sử dụng".

#### Trạng thái lần đồng bộ

| Trạng thái | Ý nghĩa |
|----|----|
| Đang chạy | Lần đồng bộ đang xử lý |
| Thành công | Mọi bản ghi xử lý được |
| Có lỗi | Có ít nhất một bản ghi lỗi; bản ghi không lỗi đã ghi, có thể không có bản ghi nào ghi được (BR-DADT-04-03) |
| Thất bại | Không lấy được danh sách từ nguồn, hoặc lần bị gián đoạn (BR-DADT-04-01, BR-DADT-04-03) |

#### Mã trạng thái

Mã dùng tiếng Anh, viết hoa, nối bằng gạch dưới, tối đa 20 ký tự. API và dữ liệu dùng mã; giao diện chỉ hiển thị tên tiếng Việt.

| Lớp | Tên hiển thị | Mã |
|----|----|----|
| Đề tài / dự án | Đang thực hiện / Hoàn thành / Dừng thực hiện | IN_PROGRESS / COMPLETED / STOPPED |
| Khoản mục | Chưa mua sắm / Đang mua sắm / Đã phê duyệt / Hoàn thành | NOT_PURCHASED / PURCHASING / APPROVED (tính, chỉ dùng ở giao diện, API) / DONE (lưu) |
| Hiệu lực khoản mục | Còn hiệu lực / Ngừng sử dụng | ACTIVE / INACTIVE |
| Lần đồng bộ | Đang chạy / Thành công / Có lỗi / Thất bại | RUNNING / SUCCESS / PARTIAL / FAILED |
| Nguồn dữ liệu | Theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4 | Theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4 |

### Vai trò và phân quyền

**Vai trò:**

| Mã | Vai trò | Ghi chú |
|----|----|----|
| ND | Người dùng ĐTMS | Mọi người dùng có tài khoản ĐTMS, gồm đơn vị đề xuất, cơ quan chuyên môn, lãnh đạo |
| TT | TTMS | Chuyên viên, lãnh đạo Trung tâm Mua sắm |
| QT | Quản trị hệ thống |  |
| HT | Hệ thống | Đồng bộ theo lịch, tính chỉ số |

Người có nhiều vai trò được cộng quyền của mọi vai trò. TT, QT cũng là ND.

**Phạm vi dữ liệu (BR-DADT-C-10):** mọi người dùng thấy mọi đề tài / dự án không Mật, mọi Loại. Đề tài / dự án Mật chỉ người dùng được phép thấy. Trong các tab liên quan, mã đề xuất mua sắm, khoản đầu tư, gói thầu, hợp đồng chỉ hiện với người được thấy đối tượng đó theo tài liệu thiết kế của module đó (BR-DADT-C-11).

**Ma trận quyền theo chức năng.** T = thao tác, X = chỉ xem, — = không có quyền.

| STT | Chức năng | Tên | ND | TT | QT | HT |
|----|----|----|----|----|----|----|
| 1 | DTMS_CN_0240 | Xem danh sách đề tài / dự án và tìm kiếm | X | X | X | — |
| 2 | DTMS_CN_0241 | Xuất Excel danh sách đề tài / dự án | T | T | T | — |
| 3 | DTMS_CN_0242 | Xem chi tiết đề tài / dự án: Thông tin chung và Phê duyệt | X | X | X | — |
| 4 | DTMS_CN_0243 | Xem dự toán chi phí | X | X | X | — |
| 5 | DTMS_CN_0244 | Đánh dấu Chi mua sắm và Hoàn thành khoản mục | X | T | X | — |
| 6 | DTMS_CN_0245 | Theo dõi thực hiện dự toán | X | X | X | T |
| 7 | DTMS_CN_0246 | Xuất Excel dự toán chi phí | T | T | T | — |
| 8 | DTMS_CN_0247 | Xem đề xuất mua sắm và khoản đầu tư liên quan | X | X | X | — |
| 9 | DTMS_CN_0248 | Xem gói thầu và hợp đồng liên quan | X | X | X | — |
| 10 | DTMS_CN_0249 | Xem văn bản pháp lý và tải tệp | T | T | T | — |
| 11 | DTMS_CN_0250 | Đồng bộ đề tài / dự án Loại Khoa học công nghệ | — | X | T | T |

Ở dòng 10, T là tải tệp văn bản. Ở dòng 11, X của TT là xem nhật ký đồng bộ; T của QT là \[Đồng bộ ngay\], \[Bỏ qua lỗi\] và xem nhật ký; T của HT là chạy theo lịch.

### Hạn xử lý

Module không có quy trình phê duyệt, không giao việc, không có hạn xử lý. Thời hạn duy nhất là lịch đồng bộ (mục 2.3.6).

### Quy tắc chung

| Mã | Quy tắc |
|----|----|
| BR-DADT-C-01 | **Nguồn dữ liệu.** ĐTMS không tạo, sửa, xóa thông tin chung, phê duyệt, dự toán, văn bản pháp lý của đề tài / dự án; ĐTMS không có chức năng nhập đề tài / dự án từ tệp. Đề tài / dự án vào ĐTMS bằng đồng bộ: Loại Khoa học công nghệ từ phân hệ Quản lý Khoa học công nghệ (DTMS_CN_0250); từ HR Tool theo tài liệu thiết kế Đồng bộ đề tài / dự án. Đề tài / dự án đang thực hiện trên hệ thống cũ chuyển một lần khi đưa hệ thống vào sử dụng. Mỗi đề tài ghi Nguồn dữ liệu và thời điểm ĐTMS ghi đề tài gần nhất từ lần đồng bộ (Cập nhật từ nguồn lúc). Đề tài Loại khác Khoa học công nghệ không sửa được bằng đồng bộ từ phân hệ Quản lý Khoa học công nghệ; đề tài Loại Khoa học công nghệ Chuyển từ hệ thống cũ được đồng bộ tiếp quản (BR-DADT-04-02, BR-DADT-04-06) |
| BR-DADT-C-02 | **Mã đề tài** là khóa định danh, duy nhất trên toàn hệ thống, so khớp không phân biệt hoa thường, bỏ khoảng trắng đầu cuối. Đề xuất mua sắm, khoản đầu tư, gói thầu tham chiếu đề tài bằng Mã. Mã không đổi sau khi vào hệ thống; nguồn đổi mã thì coi là đề tài mới. **Mã cũ:** nguồn đồng bộ gửi kèm mã cũ thì đề tài mới ghi Mã cũ để tra cứu: Chi tiết hiện liên kết hai chiều (BR-DADT-01-08), ô Từ khóa của danh sách tìm cả theo Mã cũ. Đề tài cũ giữ nguyên dữ liệu, phần đã đăng ký, đang giữ và hạng mục đã liên kết; hệ thống không tự chuyển khoản mục, phần đã dùng, liên kết hạng mục sang đề tài mới, đề tài mới tính phần khả dụng từ dự toán của nó. Đề tài cũ không còn ở nguồn thì theo BR-DADT-04-02 |
| BR-DADT-C-03 | **Dữ liệu ĐTMS sở hữu.** Chi mua sắm và đánh dấu Hoàn thành của khoản mục chỉ ghi trên ĐTMS. Đồng bộ lại không ghi đè hai giá trị này. Lần đầu khoản mục vào ĐTMS: nguồn có cờ cần mua sắm thì Chi mua sắm lấy theo nguồn; nguồn không có thì Chi mua sắm = Không |
| BR-DADT-C-04 | **Đề tài được chọn ở đề xuất mua sắm, khoản đầu tư.** Ô Đề tài / dự án của đề xuất mua sắm, khoản đầu tư chọn được đề tài / dự án mọi Loại, Trạng thái Đang thực hiện, không bị đánh dấu Không còn ở nguồn (BR-DADT-04-02), trong phạm vi người dùng được thấy (BR-DADT-C-10). Đề tài đã quá Ngày kết thúc vẫn chọn được, hệ thống hiện cảnh báo "Đề tài / dự án đã quá thời gian kết thúc." Chỉ đề tài Loại Khoa học công nghệ bóc tách khoản mục làm căn cứ; loại khác dùng văn bản căn cứ khai báo kèm tệp theo tài liệu thiết kế của module đó |
| BR-DADT-C-05 | **Khoản mục bóc tách được** khi đủ: đề tài Loại Khoa học công nghệ, Trạng thái Đang thực hiện, không bị đánh dấu Không còn ở nguồn; khoản mục Chi mua sắm = Có, chưa Hoàn thành, Hiệu lực Còn hiệu lực. Danh sách chọn của đề xuất mua sắm, khoản đầu tư chỉ có các khoản mục này, sắp theo Loại chi phí rồi thứ tự trong dự toán. Khoản mục còn lại khả dụng bằng 0 hoặc âm vẫn hiện, kèm Còn lại khả dụng (giá trị) và Khối lượng còn lại (BR-DADT-C-07), để người dùng thấy lý do |
| BR-DADT-C-06 | **Khoản mục là dòng căn cứ.** Khi đề xuất mua sắm, khoản đầu tư dùng đề tài Loại Khoa học công nghệ làm căn cứ, đề tài là một văn bản căn cứ với Giá trị = Tổng giá trị ĐTMS (BR-DADT-01-04); mỗi khoản mục bóc tách được là một dòng căn cứ với SL gốc = Số lượng, giá trị dòng = Giá trị sau thuế. **Dữ liệu dùng chung, không chép:** hạng mục của đề xuất mua sắm và của khoản đầu tư liên kết thẳng tới khoản mục; Giá trị, SL gốc, phần đã dùng luôn đọc từ đề tài và khoản mục hiện hành (đơn vị đồng, BR-DADT-C-12), không theo bản chép văn bản, dòng căn cứ của từng module. Bản chép (nếu module lưu để hiển thị) không dùng để tính và không áp quy tắc giữ SL gốc khi đã dùng; thay đổi ở nguồn theo BR-DADT-C-09. Quy tắc phần căn cứ còn dùng được, phần dòng còn dùng được, giải phóng phần đang dùng của tài liệu thiết kế Quản lý đề xuất mua sắm (BR-DXMS-02-04 – BR-DXMS-02-06) và Quản lý khoản đầu tư (BR-KDT-02-04 – BR-KDT-02-06, BR-KDT-02-10) áp cho văn bản và dòng này, với **phần đã dùng gồm cả đề xuất mua sắm và khoản đầu tư khác** ở cả hai module; bổ sung phần giá trị theo khoản mục ở BR-DADT-C-07, BR-DADT-C-08. Khoản mục thôi bóc tách được (Hoàn thành, bỏ Chi mua sắm, Ngừng sử dụng) vẫn là dòng căn cứ của hạng mục đã liên kết: hạng mục đó vẫn được tính theo BR-DADT-C-07 và vẫn bị kiểm theo BR-DADT-C-08 ở các bước sau |
| BR-DADT-C-07 | **Phần khả dụng của khoản mục,** tính chung cho mọi đề xuất mua sắm và khoản đầu tư dùng khoản mục, không phụ thuộc người xem. Mỗi đề xuất mua sắm, khoản đầu tư tính một lần theo hồ sơ chi phối của nó (BR-DXMS-C-30, BR-KDT-02-10); hồ sơ Điều chỉnh đang xử lý chưa được tính cho tới khi Hoàn thành; khoản đầu tư chưa có hồ sơ giữ phần khoản mục đã khai báo trên khoản đầu tư (Số lượng, Giá trị dự tính) từ lúc lưu khoản đầu tư; khi có hồ sơ chi phối thì tính theo hạng mục của hồ sơ, không cộng thêm phần khai báo; khoản đầu tư kết thúc khi chưa có hồ sơ (theo tài liệu thiết kế Quản lý khoản đầu tư) thì trả lại phần khai báo. Chỉ tính hạng mục đã xác nhận ở bước lập hạng mục; nháp không tính. Giá trị dùng của một hạng mục liên kết: Thành tiền theo cơ sở giá (BR-DXMS-04-10, BR-KDT-04-10); chưa có cơ sở giá thì bằng giá trị ước tính = SL đề xuất × Giá trị sau thuế / Số lượng của khoản mục, làm tròn tới đồng; khoản mục không có Số lượng thì bằng 0 tới khi có cơ sở giá; số lượng dùng là SL đề xuất, như BR-DXMS-02-05, BR-KDT-02-05. **Đã đăng ký** = tổng giá trị dùng, tổng số lượng dùng của hạng mục liên kết trên hồ sơ chi phối Hoàn thành. **Đang giữ** = như trên, trên hồ sơ chi phối Đang xử lý, cộng phần khai báo của khoản đầu tư chưa có hồ sơ. **Còn lại khả dụng** = Giá trị sau thuế − Đã đăng ký − Đang giữ; số lượng tính tương tự từ Số lượng. Khoản mục không có Số lượng thì phần số lượng hiện "-". Thành tiền (tỷ đồng, số đầy đủ) quy về đồng bằng cách nhân 1.000.000.000 rồi làm tròn tới đồng (từ 0,5 làm tròn lên) cho từng hạng mục, rồi mới cộng; mọi phép so ở BR-DADT-C-08 dùng số đồng này; màn hình làm tròn khi hiển thị theo BR-DADT-C-12. Số âm hiện màu đỏ. Hồ sơ Dừng xử lý, Đã hủy không còn tính (BR-DXMS-02-06, BR-KDT-02-06); hồ sơ khoản đầu tư Đã chuyển luồng chuyển phần của mình sang hồ sơ mới, không tính hai lần |
| BR-DADT-C-08 | **Vượt phần khả dụng của khoản mục.** Còn lại khả dụng dùng để so ở đây không tính phần của chính đề xuất mua sắm, khoản đầu tư đang lập (như "Đã dùng ở ĐXMS khác" của BR-DXMS-04-11, "Đã dùng ở KĐT, ĐXMS khác" của BR-KDT-04-11). **Số lượng:** SL đề xuất lớn hơn số lượng còn lại thì không xác nhận được bước lập hạng mục (như BR-DXMS-02-05, BR-KDT-02-05). **Giá trị, khi lập hạng mục:** hạng mục chưa có cơ sở giá nên so giá trị ước tính = SL đề xuất × Giá trị sau thuế / Số lượng của khoản mục; lớn hơn Còn lại khả dụng thì hiện cảnh báo tại dòng "Vượt giá trị còn lại khả dụng ({số} tỷ đồng)", {số} là phần vượt; vẫn xác nhận được; khoản mục không có Số lượng thì không cảnh báo và không kiểm số lượng. Giá trị ước tính tính trước rà soát tồn kho nên có thể lớn hơn Thành tiền sau này (Thành tiền theo Còn phải mua); từ lúc xác nhận bước lập hạng mục tới khi có cơ sở giá, giá trị ước tính là giá trị dùng của hạng mục (BR-DADT-C-07). **Giá trị, khi xác nhận Báo giá đạt** (BR-DXMS-04-11, BR-KDT-04-11): Thành tiền theo cơ sở giá đang chọn của hạng mục liên kết khoản mục lớn hơn Còn lại khả dụng thì không xác nhận được, kể cả khi chọn Vẫn đạt, báo "Khoản mục {Tên khoản mục} vượt giá trị còn lại khả dụng {số} tỷ đồng."; điều kiện này thêm vào điều kiện theo văn bản căn cứ của hai quy tắc đó. **Đồng thời:** điều kiện số lượng, giá trị kiểm lại tại thời điểm xác nhận, trong cùng giao dịch ghi, khóa theo khoản mục; hai hồ sơ cùng xác nhận trên một khoản mục thì hồ sơ sau kiểm trên số đã gồm hồ sơ trước. Khi xác nhận bước lập hạng mục, khoản mục của từng hạng mục được kiểm lại theo BR-DADT-C-05; không còn bóc tách được thì báo "Khoản mục {Tên khoản mục} không còn bóc tách được.", không xác nhận được cho tới khi bỏ khoản mục khỏi hạng mục. Hồ sơ kế thừa không qua bước báo giá (BR-KDT-02-06), hồ sơ Điều chỉnh khi kiểm lại ở bước 58, 60 (BR-DXMS-09-13) chỉ cảnh báo. **Khai báo khoản mục trên khoản đầu tư** (Thêm mới, Sửa khoản đầu tư, trước khi có hồ sơ): Số lượng, Giá trị dự tính khai báo lớn hơn Khối lượng còn lại, Còn lại khả dụng thì cảnh báo tại dòng "Vượt khối lượng còn lại ({số})." hoặc "Vượt giá trị còn lại khả dụng ({số} tỷ đồng).", vẫn lưu được; Giá trị dự tính lớn hơn Giá trị sau thuế của khoản mục thì không lưu được, lỗi tại dòng "Vượt giá trị dự toán ({số} tỷ đồng)."; phần khai báo tính là Đang giữ từ lúc lưu (BR-DADT-C-07) |
| BR-DADT-C-09 | **Thay đổi ở nguồn.** Không xóa cứng đề tài, khoản mục. Khoản mục không còn ở nguồn thì Hiệu lực chuyển Ngừng sử dụng, không bóc tách thêm, giữ phần đã đăng ký, đang giữ. Giá trị, số lượng khoản mục giảm làm Còn lại khả dụng âm thì hiện đỏ, ghi nhật ký đồng bộ. Đề tài đổi sang Hoàn thành, Dừng thực hiện thì không chọn mới được (BR-DADT-C-04). Đề xuất mua sắm, khoản đầu tư đang xử lý không bị dừng, không bị đổi hạng mục; điều kiện ở BR-DADT-C-08 xét theo số liệu tại lúc kiểm tra |
| BR-DADT-C-10 | **Đề tài Mật.** Đề tài / dự án Mật chỉ hiện với: người thuộc Đơn vị lập; Chủ nhiệm; Người phụ trách báo cáo; người được cấp quyền Xem đề tài / dự án Mật; người thuộc danh sách xử lý của một hồ sơ đề xuất mua sắm, khoản đầu tư dùng đề tài đó. Người khác không có dòng trên danh sách, ô chọn; mở bằng đường dẫn thì báo "Bạn không có quyền thực hiện chức năng này." Trường Mã dự án Mật và tiêu chí lọc Mật chỉ hiện với người được cấp quyền Xem đề tài / dự án Mật |
| BR-DADT-C-11 | **Đối tượng liên quan người xem không được thấy.** Ở các tab liên quan, dòng con của dự toán và tệp xuất, đề xuất mua sắm, khoản đầu tư, gói thầu, hợp đồng mà người xem không được thấy (theo tài liệu thiết kế của module đó) vẫn có dòng và được tính vào số liệu; từng ô hiện theo bảng "Hiển thị đối tượng hạn chế xem" dưới đây. Quy tắc không áp cho đề tài / dự án: đề tài không được thấy theo BR-DADT-C-10 |
| BR-DADT-C-12 | **Đơn vị tiền.** Lưu theo đồng, số nguyên. Màn hình hiện tỷ đồng, 2 chữ số thập phân, căn phải, ghi đơn vị ở tiêu đề cột hoặc khối; riêng Đơn giá của khoản mục hiện theo đồng (BR-DADT-02-01). Tệp xuất ghi theo đồng như mẫu |
| BR-DADT-C-13 | **Giá trị danh mục ngừng sử dụng.** Đề tài, khoản mục mang giá trị danh mục (Loại, Nguồn vốn, Loại chi phí…) đã ngừng sử dụng thì vẫn hiện tên đã lưu; bộ lọc có cả giá trị đã ngừng sử dụng |

**Hiển thị đối tượng hạn chế xem (BR-DADT-C-11).** Ô "Hạn chế xem" không có liên kết. Tệp xuất ghi giống màn.

| Đối tượng | Ô hiện "Hạn chế xem" | Ô hiện "-" | Ô hiện bình thường |
|----|----|----|----|
| Đề xuất mua sắm | Mã, Tên | Quy trình, Giá trị đề xuất, Người tạo, Ngày cập nhật | Trạng thái, Đợt, Đơn vị đề xuất |
| Khoản đầu tư | Mã, Tên | Nhóm KĐT, Tổng mức vốn, Người tạo, Ngày cập nhật | Trạng thái, Đơn vị đề xuất |
| Gói thầu | Số gói thầu, Tên gói thầu; ô Gói thầu ở bảng Hợp đồng; KHLCNT | — | Các ô còn lại (Trạng thái, giá, Giá trị phân bổ, Người phụ trách, Số / ngày QĐ KHLCNT) |
| Hợp đồng | Mã hợp đồng, Số hợp đồng, Tên hợp đồng | — | Các ô còn lại (Trạng thái, Ngày ký, Đối tác, Giá trị ký, Loại, Người theo dõi) |
| Dòng con của khoản mục ở tab Dự toán chi phí | Mã | Đã đăng ký, Đang giữ, hai cột khối lượng, Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ | Đợt, Trạng thái, Ghi chú (BR-DADT-02-06) |

### Nhật ký

Nhật ký ghi về dịch vụ nhật ký dùng chung. Mỗi bản ghi gồm: đối tượng (đề tài / dự án, khoản mục, lần đồng bộ), mã đối tượng, hành động, người thực hiện (hoặc Hệ thống), thời điểm, giá trị cũ, giá trị mới, lý do (nếu có). Lần đồng bộ còn có màn xem riêng (DTMS_CN_0250).

| Nhóm hành động | Khi nào ghi |
|----|----|
| Đổi Chi mua sắm, đánh dấu / bỏ Hoàn thành khoản mục: ghi khi \[Lưu\] thành công, mỗi khoản mục đổi một bản ghi; không ghi khi đổi nháp hoặc \[Hủy\] | DTMS_CN_0244 |
| Lần đồng bộ: bắt đầu, kết thúc, số đề tài thêm, cập nhật, khoản mục ngừng sử dụng, lỗi từng bản ghi | DTMS_CN_0250 |
| Khoản mục có Còn lại khả dụng âm sau đồng bộ | BR-DADT-C-09 |
| Xuất tệp danh sách, dự toán: đối tượng Danh sách đề tài / dự án hoặc mã đề tài, hành động Xuất; giá trị mới ghi mẫu, số đề tài, điều kiện lọc | DTMS_CN_0241, DTMS_CN_0246 |
| Đồng bộ tiếp quản đề tài (Nguồn dữ liệu cũ, mới); bỏ qua lượt lịch; lần bị gián đoạn: đối tượng Đề tài / dự án hoặc Lần đồng bộ | BR-DADT-04-01, BR-DADT-04-02 |
| Đánh dấu, bỏ đánh dấu Không còn ở nguồn: đối tượng Đề tài / dự án, mã lần đồng bộ | BR-DADT-04-02 |
| Bỏ qua lỗi đồng bộ: đối tượng Lần đồng bộ, mã đề tài, người, lý do | DTMS_CN_0250 |
| Tải tệp văn bản pháp lý của đề tài Mật, kể cả lần bị từ chối: đối tượng Văn bản pháp lý, mã là Mã đề tài và Số văn bản, hành động Tải tệp hoặc Tải tệp – từ chối | DTMS_CN_0249 |

### Tham số hệ thống

| Tham số | Mặc định | Dùng tại |
|----|----|----|
| Lịch đồng bộ đề tài / dự án Loại Khoa học công nghệ | Hằng ngày lúc 01:00 | DTMS_CN_0250 |
| Lịch rà soát toàn bộ đề tài / dự án Loại Khoa học công nghệ (phạm vi Toàn bộ) | Hằng tuần, Chủ nhật lúc 02:00 | BR-DADT-04-01, BR-DADT-04-02 |
| Số lần thử lại (sau lần gọi đầu) và khoảng cách khi đồng bộ lỗi kết nối | 3 lần, cách nhau 5 phút | DTMS_CN_0250 |
| Thời gian chạy tối đa của một lần đồng bộ | 2 giờ | BR-DADT-04-01 |
| Cấp đơn vị là Khối trên cây đơn vị | Cấp 4 | BR-DADT-01-05, DTMS_CN_0240 |
| Ngưỡng tô màu Số ngày còn thực hiện | Đỏ khi bằng 0; vàng khi không quá 60 ngày | BR-DADT-01-02 |
| Số dòng tối đa của tệp xuất | 10.000 dòng | DTMS_CN_0241, DTMS_CN_0246 |

Tham số áp ngay từ lúc thay đổi. Module không có màn quản trị tham số riêng; tham số quản trị tại cấu hình hệ thống.

# THIẾT KẾ CHI TIẾT

## THIẾT KẾ CHI TIẾT NGHIỆP VỤ

### Thông tin đề tài / dự án

Tra cứu và xem đề tài / dự án đã có trên ĐTMS. Menu Đầu tư mua sắm \> **Đề tài / dự án** (mục cấp 1, dùng chung cho đề xuất mua sắm và khoản đầu tư). Danh sách hiện mọi Loại. Thông tin chỉ xem (BR-DADT-C-01); mở chi tiết bằng Mã đề tài.

Quy tắc của nghiệp vụ 3.1.1:

| Mã | Quy tắc |
|----|----|
| BR-DADT-01-01 | **Sắp xếp mặc định** của danh sách: Ngày bắt đầu giảm dần; cùng ngày thì Mã tăng dần theo thứ tự chữ cái. Đề tài không có Ngày bắt đầu xếp cuối |
| BR-DADT-01-02 | **Số ngày còn thực hiện** = Ngày kết thúc − ngày hiện tại, tính theo ngày lịch, nhỏ nhất là 0. Không có Ngày kết thúc, hoặc đề tài Hoàn thành, Dừng thực hiện thì hiện "-". Với đề tài Đang thực hiện: bằng 0 thì ô nền đỏ; từ 1 tới ngưỡng cảnh báo (mục 2.3.6) thì ô nền vàng |
| BR-DADT-01-03 | **Thời gian bắt đầu, kết thúc** gồm hai phần lấy theo nguồn: nhãn văn bản (ví dụ "Quý II/2024") và ngày. Hiện nhãn nếu có, không thì hiện ngày dạng DD/MM/YYYY. Tìm kiếm, sắp xếp, tính Số ngày còn thực hiện dùng phần ngày; nguồn chỉ có nhãn thì phần ngày rỗng |
| BR-DADT-01-04 | **Tổng dự toán, Tổng giá trị ĐTMS.** Đề tài **có dự toán chi tiết** khi có ít nhất một khoản mục trên ĐTMS, kể cả khoản mục Ngừng sử dụng; mọi khoản mục Ngừng sử dụng thì hai tổng bằng 0. Đề tài có dự toán chi tiết trên ĐTMS: Tổng dự toán = tổng Giá trị sau thuế của mọi khoản mục còn hiệu lực; Tổng giá trị ĐTMS = tổng Giá trị sau thuế của khoản mục Chi mua sắm còn hiệu lực. Đề tài chưa có dự toán chi tiết: hai giá trị lấy theo nguồn; nguồn không có thì "-" |
| BR-DADT-01-05 | **Khối đơn vị** của đề tài là đơn vị cấp Khối (Khối 1, Khối 2, Khối 3, Khối cơ quan) chứa Đơn vị lập trên cây đơn vị của hệ thống người dùng: chính Đơn vị lập nếu nó ở cấp Khối, không thì đơn vị cấp trên gần nhất ở cấp Khối. Cấp Khối là cấp đơn vị theo tham số mục 2.3.6. Xét theo cây tại thời điểm xem. Đơn vị không có cấp trên nào ở cấp Khối thì Khối rỗng |
| BR-DADT-01-06 | **Tệp xuất danh sách.** Tập đề tài xuất là toàn bộ kết quả theo từ khóa, điều kiện đang áp và phạm vi xem (BR-DADT-C-10), không chỉ trang đang xem, theo thứ tự đang hiển thị. Giữ tiêu đề, thứ tự cột của mẫu. **Kiểu ô:** tiền là ô số nguyên theo đồng (BR-DADT-C-12); ngày là ô ngày, định dạng DD/MM/YYYY, trừ cột Bắt đầu, Kết thúc của mẫu Danh sách là ô chữ theo BR-DADT-01-03; tỉ lệ là ô số 2 chữ số thập phân, ghi 36,00 (không phải 0,36); danh mục ghi tên trong danh mục; người ghi họ tên như BR-DADT-01-08; ô không có giá trị để trống. Đề tài người xuất không được thấy (BR-DADT-C-10) không có dòng nào trong mọi mẫu. Đối tượng liên quan người xuất không được thấy ghi như BR-DADT-C-11. Số dòng dữ liệu (không tính dòng tiêu đề) của sheet nhiều dòng nhất vượt số dòng tối đa của tệp xuất (mục 2.3.6) thì không sinh tệp |
| BR-DADT-01-07 | **Tỉ lệ thực hiện của đề tài** (mẫu Tỉ lệ thực hiện). **Gói thầu đã và đang thực hiện:** gói thầu liên quan (BR-DADT-03-02) thuộc kế hoạch lựa chọn nhà thầu đã có QĐ phê duyệt, không ở trạng thái Đã hủy; Số lượng là số gói, Giá trị là tổng Giá trị phân bổ cho đề tài. **Hợp đồng đã và đang thực hiện:** hợp đồng liên quan (BR-DADT-03-03) đã có Ngày ký, không ở trạng thái Đã hủy, kể cả khi gói thầu của nó Đã hủy; Số lượng là số hợp đồng có giá trị tính cho đề tài lớn hơn 0, Giá trị là tổng giá trị tính cho đề tài. **Giá trị hợp đồng tính cho đề tài:** hợp đồng gắn trực tiếp đề tài, hoặc của gói mà mọi nguồn thuộc đề tài này: tính đủ Giá trị ký. Hợp đồng của gói có nguồn thuộc từ hai đề tài trở lên: Giá trị ký × Giá trị phân bổ cho đề tài / tổng Giá trị phân bổ của mọi nguồn của gói; tổng đó bằng 0 thì tính 0. Giá trị của từng hợp đồng làm tròn tới đồng (từ 0,5 làm tròn lên) rồi mới cộng. **Tỉ lệ thực hiện đầu tư mua sắm (%)** = Giá trị hợp đồng / Tổng giá trị ĐTMS × 100. **Tỉ lệ thời gian thực hiện (%)** = (ngày hiện tại − Ngày bắt đầu) / (Ngày kết thúc − Ngày bắt đầu) × 100, nhỏ nhất 0, lớn nhất 100; đề tài Hoàn thành ghi 100, Dừng thực hiện để trống. Hai tỉ lệ tính từ giá trị đã làm tròn, làm tròn 2 chữ số thập phân (từ 0,005 làm tròn lên); mẫu số bằng 0 hoặc thiếu ngày thì để trống |
| BR-DADT-01-08 | **Hiển thị thông tin chi tiết.** Mọi trường chỉ xem, hiện mọi trường với mọi Loại. Trường nguồn không có giá trị hiện "-". Số và ngày văn bản hiện "{số} ngày {DD/MM/YYYY}"; thiếu một phần thì hiện phần có. Chủ nhiệm, Người phụ trách báo cáo hiện họ tên tài khoản, khớp theo tên đăng nhập không phân biệt hoa thường, kể cả tài khoản đã khóa; không khớp tài khoản thì tên theo nguồn. Giá trị danh mục theo BR-DADT-C-13. Mã dự án Mật chỉ có khi đề tài Mật và người xem được cấp quyền Xem đề tài / dự án Mật (BR-DADT-C-10); trường hợp khác không có trường này, kể cả với người có quyền khi đề tài không Mật |

#### DTMS_CN_0240 Xem danh sách đề tài / dự án và tìm kiếm

##### Thông tin chung chức năng

- **Mục đích:** Tra cứu đề tài / dự án; mỗi dòng cho biết loại, đơn vị lập, chủ nhiệm, nguồn vốn, tổng dự toán, thời gian, số ngày còn thực hiện, trạng thái và nguồn dữ liệu.

- **Người dùng mục tiêu:** mọi vai trò, trong phạm vi BR-DADT-C-10.

- **Đường dẫn truy cập:** Đầu tư mua sắm \> Đề tài / dự án.

- **Tiền điều kiện:**

  - Đã đăng nhập, có quyền xem.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### Màn hình

<img src="media/rId57.png" style="width:6.25in;height:3.90625in" alt="Danh sách đề tài / dự án" />

<img src="media/rId60.png" style="width:6.25in;height:3.90625in" alt="Tìm kiếm nâng cao" />

Ảnh minh họa bố cục, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 12/11/2026. Khác ảnh: tên Nguồn dữ liệu theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4. Khi khác nhau, áp dụng mục 3.1.1.1.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tìm kiếm** |  |  |  |  |
| 1 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo mã, tên dự án / đề tài". **Chứa** trên Mã, Mã cũ (BR-DADT-C-02) hoặc Tên. Chuẩn hóa từ khóa, không phân biệt hoa thường và dấu, Enter tương đương \[Tìm kiếm\] theo mục 4.3. Mapping: project.code, project.previous_code, project.name. |
|  | **Tìm kiếm nâng cao** |  |  |  |  |
| 2 | Cấp phê duyệt | Dropdown một lựa chọn | Input | Tất cả | **Bằng**. Giá trị: Tất cả và mọi giá trị của danh mục Cấp phê duyệt (Tổng Công ty, Tập đoàn), kể cả đã ngừng sử dụng (BR-DADT-C-13). Mapping: project.approval_level_code. |
| 3 | Khối đơn vị | Dropdown một lựa chọn | Input | Rỗng | **Bằng** Khối theo BR-DADT-01-05. Giá trị: các đơn vị cấp Khối trên cây đơn vị của hệ thống người dùng (Khối 1, Khối 2, Khối 3, Khối cơ quan), kể cả đơn vị đã ngừng hoạt động mà còn đề tài. Đổi khối thì Đơn vị lập đã chọn không thuộc khối mới bị bỏ chọn. Mapping: Suy từ project.unit_id. |
| 4 | Đơn vị lập ĐT/DA | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**. Giá trị: các đơn vị đang có trên đề tài trong phạm vi được xem, có Khối (BR-DADT-01-05) là khối đã chọn ở ô 3 (chưa chọn khối thì mọi đơn vị), kể cả đơn vị đã ngừng hoạt động. Mapping: project.unit_id. |
| 5 | Ngày QĐ đầu tư từ | Datepicker \[DD/MM/YYYY\] | Input | Rỗng | Ô bên trái của trường khoảng ngày nhãn "Ngày QĐ đầu tư": hai ô chọn ngày trên một hàng, giữa hai ô là dấu "-". Mỗi ô nhập theo DD/MM/YYYY (gõ số thì tự chèn dấu "/"), bên phải ô có biểu tượng lịch; bấm biểu tượng mở lịch chọn ngày, chọn xong điền ngày vào ô. **Từ ngày**, tính cả ngày này, trên Ngày QĐ phê duyệt dự án; chỉ nhập một ô thì chỉ chặn đầu đó. Kiểm tra theo mục 4.5; thông báo lỗi ngày hiện dưới cả trường. Mapping: project.decision_date. |
| 6 | Ngày QĐ đầu tư đến | Datepicker \[DD/MM/YYYY\] | Input | Rỗng | Ô bên phải của trường "Ngày QĐ đầu tư", cách ô 5 bằng dấu "-", cùng cách nhập và biểu tượng lịch như ô 5. **Đến ngày**, tính cả ngày này; không trước ô 5 (Từ ≤ Đến). Nhỏ hơn ô 5 thì lỗi dưới trường "Đến ngày phải lớn hơn hoặc bằng Từ ngày." Mapping: project.decision_date. |
| 7 | Nguồn vốn | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc** danh sách đã chọn. Mọi giá trị của danh mục Nguồn vốn, kể cả đã ngừng sử dụng (BR-DADT-C-13). Mapping: project.fund_code. |
| 8 | Trạng thái | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc** danh sách đã chọn. Giá trị theo mục 2.3.1.1. Mapping: project.status. |
| 9 | Loại dự án / đề tài | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc** danh sách đã chọn. Mọi giá trị của danh mục Loại dự án / đề tài, kể cả đã ngừng sử dụng (BR-DADT-C-13). Đổi Loại thì các giá trị ô 10 không thuộc Loại còn chọn bị bỏ chọn. Mapping: project.type_code. |
| 10 | Loại dự án (chi tiết) | Dropdown nhiều lựa chọn, có tìm kiếm | Input | Rỗng | **Thuộc** danh sách đã chọn. Giá trị: các giá trị của danh mục Loại dự án (chi tiết) có Loại cha thuộc các Loại đã chọn ở ô 9; chưa chọn Loại thì mọi giá trị; kể cả đã ngừng sử dụng (BR-DADT-C-13). Mapping: project.type_detail_code. |
| 11 | DA Mật / Không Mật | Dropdown một lựa chọn | Input | Tất cả | **Bằng**. Giá trị: Tất cả, Mật, Không Mật. Chỉ hiện với người được cấp quyền Xem đề tài / dự án Mật (BR-DADT-C-10); người khác không có ô này. Mapping: project.secret. |
| 12 | Còn khoản mục chưa đóng | Checkbox | Input | Không tích | Tích thì chỉ còn đề tài Hoàn thành, Dừng thực hiện có ít nhất một khoản mục chưa đóng (BR-DADT-02-09), để TTMS rà và đóng khoản mục. Không tích thì không lọc. Mapping: Tính. |
| 13 | Nguồn dữ liệu | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc** danh sách đã chọn. Giá trị theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4. Mapping: project.source. |
|  | **Thao tác** |  |  |  |  |
| 14 | \[Xuất Excel\] | Button | Input | – | Mở DTMS_CN_0241, xuất theo điều kiện đang áp. |
| 15 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\] | Button | Input | – | Mở, đóng khối tìm kiếm nâng cao. Đóng khối vẫn giữ điều kiện đã áp, bỏ giá trị đã nhập mà chưa áp; khi đó nút ghi kèm số điều kiện, ví dụ \[Tìm kiếm nâng cao (2)\]. |
| 16 | \[Tìm kiếm\] | Button | Input | – | Áp đồng thời từ khóa và mọi điều kiện, về trang 1, giữ số bản ghi mỗi trang. |
| 17 | \[Đặt lại\] | Button | Input | – | Xóa từ khóa, đưa điều kiện về giá trị khởi tạo, về trang 1, tải lại. |
|  | **Lưới** |  |  |  |  |
| 18 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong tập kết quả. |
| 19 | Trạng thái | Tag | Output | Theo dữ liệu | Theo mục 2.3.1.1: Đang thực hiện màu xanh dương, Hoàn thành màu xanh lá, Dừng thực hiện màu xám. Mapping: project.status. |
| 20 | Loại dự án / đề tài | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.type_code. |
| 21 | Mã dự án / đề tài | Link | Input | – | Mở DTMS_CN_0242. Mapping: project.code. |
| 22 | Tên dự án / đề tài | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: project.name. |
| 23 | Đơn vị lập | Text | Output | Theo dữ liệu | Tên đơn vị, tối đa 2 dòng. Mapping: project.unit_id. |
| 24 | Chủ nhiệm | Text | Output | Theo dữ liệu | Họ tên người dùng; không khớp tài khoản thì tên theo nguồn. Mapping: project.owner_user_id, project.owner_name. |
| 25 | Nguồn vốn | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.fund_code. |
| 26 | Tổng dự toán (tỷ đồng) | Number | Output | Theo dữ liệu | Theo BR-DADT-01-04, BR-DADT-C-12. Mapping: Tính, project.total_estimate. |
| 27 | TG bắt đầu | Text | Output | Theo dữ liệu | Theo BR-DADT-01-03. Mapping: project.start_label, project.start_date. |
| 28 | TG kết thúc | Text | Output | Theo dữ liệu | Theo BR-DADT-01-03. Mapping: project.end_label, project.end_date. |
| 29 | Số ngày còn thực hiện | Number | Output | Theo dữ liệu | Theo BR-DADT-01-02, căn phải. Mapping: Tính. |
| 30 | Nguồn dữ liệu | Text | Output | Theo dữ liệu | Tên theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4. Đề tài bị đánh dấu Không còn ở nguồn thì thêm nhãn "Không còn ở nguồn" màu cam (BR-DADT-04-02). Mapping: project.source, project.missing_at_source_at. |

Sắp xếp mặc định theo BR-DADT-01-01. Phân trang theo mục 4.4. Bấm vào dòng cũng mở DTMS_CN_0242. Lưới không có cột Thao tác: không có thao tác trên dòng.

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở màn. |
| 2 | Hệ thống tải đề tài / dự án trong phạm vi được xem (BR-DADT-C-10), sắp theo BR-DADT-01-01, trang 1. |
| 3 | Người dùng nhập từ khóa hoặc mở tìm kiếm nâng cao, chọn điều kiện, bấm \[Tìm kiếm\] hoặc Enter ở ô Từ khóa. |
| 4 | Hệ thống kiểm tra ô ngày (mục 4.5), lọc theo đồng thời từ khóa và mọi điều kiện, hiện trang 1. |
| 5 | Người dùng phân trang, mở chi tiết, xuất Excel. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có đề tài / dự án trong phạm vi | Giữ tiêu đề bảng, hiện "Chưa có dữ liệu" (mục 4.2) |
| Có dữ liệu, không khớp điều kiện | Hiện "Không tìm thấy dữ liệu phù hợp" |
| Ngày sai định dạng | Lỗi tại ô theo mục 4.5.5, không tìm |
| Đến ngày nhỏ hơn Từ ngày | Lỗi dưới trường Ngày QĐ đầu tư (ô 5, 6) "Đến ngày phải lớn hơn hoặc bằng Từ ngày.", không tìm |
| Không tải được | Tại vùng lưới: "Không thể tải dữ liệu. Vui lòng thử lại." Giữ điều kiện tìm (mục 4.6.3) |
| Không có quyền vào màn | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** lần đồng bộ chạy trong lúc người dùng đang xem thì số liệu, dòng mới hiện ở lần tải sau; danh sách đang hiện không tự đổi.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0240-01 | Có đề tài Loại Khoa học công nghệ, SXKD, Hoạt động thường xuyên, không Mật | Chuyên viên đơn vị đề xuất mở màn | Thấy đủ ba đề tài, mọi Loại |
| AC-0240-02 | Có đề tài tên "Phát triển trạm gNodeB thế hệ 2" | Nhập "tram gnodeb the he", Enter | Có bản ghi đó trong kết quả, về trang 1 |
| AC-0240-03 | Đã nhập từ khóa "5G", chọn Loại = Khoa học công nghệ | Bấm \[Tìm kiếm\] | Kết quả có "5G" trong mã hoặc tên và Loại Khoa học công nghệ |
| AC-0240-04 | Chọn Loại = Khoa học công nghệ và SXKD | Mở ô Loại dự án (chi tiết) | Chỉ có 7 giá trị của Khoa học công nghệ và các giá trị của SXKD |
| AC-0240-05 | Đã chọn Loại = SXKD, Loại chi tiết = Dự án Kinh doanh | Bỏ SXKD khỏi ô Loại | Dự án Kinh doanh bị bỏ chọn ở ô Loại chi tiết |
| AC-0240-06 | Chọn Khối 2, Đơn vị lập thuộc Khối 2 | Đổi Khối sang Khối 3 | Ô Đơn vị lập về rỗng, danh sách chỉ còn đơn vị thuộc Khối 3 |
| AC-0240-07 | Nhập Ngày QĐ đầu tư từ 01/05/2026, đến 30/04/2026 | Bấm \[Tìm kiếm\] | Lỗi dưới trường Ngày QĐ đầu tư "Đến ngày phải lớn hơn hoặc bằng Từ ngày.", danh sách không đổi |
| AC-0240-08 | Đề tài A Ngày QĐ 07/05/2026, đề tài B 12/08/2026 | Từ 07/05/2026 đến 07/05/2026, \[Tìm kiếm\] | Có A, không có B |
| AC-0240-09 | Hôm nay 04/11/2026; đề tài A Đang thực hiện, Ngày kết thúc 30/09/2026; B Đang thực hiện, kết thúc 31/12/2026; C Hoàn thành, kết thúc 31/12/2027 | Xem dòng | A hiện 0 nền đỏ; B hiện 57 nền vàng; C hiện "-" không tô màu |
| AC-0240-10 | Đề tài có TG kết thúc nhãn "Quý IV/2025", ngày 31/12/2025 | Xem dòng | Cột TG kết thúc hiện "Quý IV/2025" |
| AC-0240-11 | Đề tài có dự toán chi tiết tổng Giá trị sau thuế 43.733.290.931 đồng | Xem dòng | Tổng dự toán (tỷ đồng) hiện 43,73 |
| AC-0240-12 | Đề tài Mật X; người dùng không thuộc Đơn vị lập, không là Chủ nhiệm, Người phụ trách báo cáo, không có quyền Xem đề tài / dự án Mật, không thuộc danh sách xử lý hồ sơ nào dùng X | Mở màn, tìm theo mã X | Không có dòng X; không có ô DA Mật / Không Mật |
| AC-0240-13 | Người dùng có quyền Xem đề tài / dự án Mật | Chọn DA Mật / Không Mật = Mật, \[Tìm kiếm\] | Chỉ có đề tài Mật |
| AC-0240-14 | Đề tài A Ngày bắt đầu 12/08/2026, B 08/05/2026, C không có Ngày bắt đầu | Mở màn | Thứ tự A, B, C |
| AC-0240-15 | Đề tài Loại Khoa học công nghệ vào bằng đồng bộ từ phân hệ Quản lý Khoa học công nghệ; đề tài SXKD vào bằng đồng bộ từ HR Tool; đề tài Hoạt động thường xuyên chuyển từ hệ thống cũ | Xem cột Nguồn dữ liệu | Lần lượt "Đồng bộ Khoa học công nghệ", "Đồng bộ HR Tool", "Chuyển từ hệ thống cũ" |
| AC-0240-16 | Chuyên viên đơn vị đề xuất (không là TT, QT) | Mở màn | Có \[Xuất Excel\]; lưới không có cột Thao tác |
| AC-0240-17 | Đã chọn Trạng thái trong khối nâng cao, chưa bấm \[Tìm kiếm\] | Nhấn Enter ở ô Từ khóa | Áp đồng thời từ khóa và Trạng thái, về trang 1 |
| AC-0240-18 | Đã có điều kiện tìm | Bấm \[Đặt lại\] | Điều kiện về giá trị khởi tạo, danh sách đầy đủ, trang 1 |
| AC-0240-19 | 25 đề tài trong phạm vi | Chọn 20 bản ghi mỗi trang | Trang 1 có 20 dòng, có 2 trang |
| AC-0240-20 | Danh mục Nguồn vốn có giá trị "Vốn vay" đã ngừng sử dụng, còn đề tài mang giá trị này | Mở ô Nguồn vốn, chọn "Vốn vay", \[Tìm kiếm\] | Có giá trị trong ô; kết quả có đề tài đó, cột Nguồn vốn hiện "Vốn vay" |
| AC-0240-21 | Đang xem danh sách; lần đồng bộ vừa thêm đề tài mới | Không thao tác | Danh sách không tự đổi; bấm \[Tìm kiếm\] thì có đề tài mới |
| AC-0240-22 | DA-2026-030 Hoàn thành, có khoản mục Chi mua sắm còn hiệu lực Trạng thái Đang mua sắm; DA-2026-031 Hoàn thành, mọi khoản mục Chi mua sắm đã Hoàn thành; DA-2026-032 Đang thực hiện | Tích Còn khoản mục chưa đóng, \[Tìm kiếm\] | Chỉ có DA-2026-030 |
| AC-0240-23 | DA-2026-040 có Mã cũ DA-2025-012 | Nhập từ khóa "DA-2025-012", \[Tìm kiếm\] | Có dòng DA-2026-040 (và dòng DA-2025-012 nếu đề tài này còn trên ĐTMS) |
| AC-0240-24 | DA-2025-044 bị đánh dấu Không còn ở nguồn | Xem cột Nguồn dữ liệu | "Đồng bộ Khoa học công nghệ" kèm nhãn "Không còn ở nguồn" |
| AC-0240-25 | Đề tài A Nguồn dữ liệu Đồng bộ HR Tool, B Đồng bộ Khoa học công nghệ, C Chuyển từ hệ thống cũ | Chọn Nguồn dữ liệu = Đồng bộ Khoa học công nghệ, Chuyển từ hệ thống cũ, \[Tìm kiếm\] | Có B, C; không có A |
| AC-0240-26 | Đơn vị lập của đề tài A là "Phòng Tổng hợp", đơn vị cấp dưới của "Trung tâm X", "Trung tâm X" thuộc Khối 2 | Chọn Khối đơn vị = Khối 2, \[Tìm kiếm\] | Có A; ô Đơn vị lập có "Phòng Tổng hợp" |
| AC-0240-27 | Quản trị thêm giá trị "Cấp khác" vào danh mục Cấp phê duyệt | Mở ô Cấp phê duyệt | Có Tất cả, Tổng Công ty, Tập đoàn, Cấp khác; không phải sửa chương trình |
| AC-0240-28 | Mở khối tìm kiếm nâng cao | Nhìn trường Ngày QĐ đầu tư; bấm biểu tượng lịch ở ô bên trái, chọn ngày 07/05/2026; gõ "12082026" vào ô bên phải | Một trường nhãn "Ngày QĐ đầu tư" gồm hai ô DD/MM/YYYY, mỗi ô có biểu tượng lịch, giữa là dấu "-"; ô trái hiện "07/05/2026", ô phải hiện "12/08/2026" |

#### DTMS_CN_0241 Xuất Excel danh sách đề tài / dự án

##### Thông tin chung chức năng

- **Mục đích:** Tải danh sách đề tài / dự án đang lọc và các báo cáo kèm theo (gói thầu – hợp đồng, tỉ lệ thực hiện, văn bản pháp lý, gói thầu phân bổ nhiều đề tài) theo mẫu của hệ thống cũ.

- **Người dùng mục tiêu:** mọi vai trò, trong phạm vi BR-DADT-C-10.

- **Đường dẫn truy cập:** Danh sách đề tài / dự án \> \[Xuất Excel\] \> chọn mẫu.

- **Tiền điều kiện:**

  - Đã đăng nhập, có quyền xem danh sách (DTMS_CN_0240).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

  - Tệp được tải về.

  - Ghi nhật ký (mục 2.3.5).

##### Màn hình

Không có màn riêng. Nút \[Xuất Excel\] nằm trên màn tại mục 3.1.1.1.2; bấm nút mở danh sách chọn mẫu ngay dưới nút.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | \[Xuất Excel\] | Button | Input | – | Mở, đóng danh sách chọn mẫu. Bấm ra ngoài hoặc Esc thì đóng, không xuất. |
| 2 | Danh sách đề tài / dự án | Menu item | Input | – | Xuất mẫu 1 ở bảng dưới. |
| 3 | Gói thầu – hợp đồng | Menu item | Input | – | Xuất mẫu 2. |
| 4 | Tỉ lệ thực hiện | Menu item | Input | – | Xuất mẫu 3. |
| 5 | Văn bản pháp lý | Menu item | Input | – | Xuất mẫu 4. |
| 6 | Gói thầu phân bổ nhiều đề tài / dự án | Menu item | Input | – | Xuất mẫu 5. |

Mọi mẫu áp BR-DADT-01-06. Tên tệp thêm thời điểm xuất {YYYYMMDDHHmmss}. Tên sheet ghi ở cột Nội dung. TT, STT đánh liên tục theo dòng dữ liệu, từ 1.

| Mẫu | Tên tệp | Nội dung |
|----|----|----|
| 1\. Danh sách đề tài / dự án | Danh_sach_de_tai_du_an\_{YYYYMMDDHHmmss}.xlsx | Sheet "Danh sách", tiêu đề "DANH SÁCH DỰ ÁN ĐỀ TÀI - TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL". Mỗi đề tài một dòng. 18 cột: STT; Dự án/ Đề tài/ … (Loại dự án / đề tài); Tên dự án/ đề tài; Mã dự án/ đề tài; Mã dự án/ đề tài SAP; Cấp phê duyệt; Nguồn vốn; Nhóm dự án/ đề tài; Số quyết định, Ngày quyết định (QĐ phê duyệt dự án); Tổng dự toán được duyệt (BR-DADT-01-04); Tổng Giá trị đầu tư mua sắm (BR-DADT-01-04); Bắt đầu, Kết thúc (BR-DADT-01-03); Số ngày còn lại (BR-DADT-01-02, không tô màu; "-" thì để trống); Đơn vị lập dự án/ đề tài; Chủ nhiệm dự án/ đề tài; Trạng thái |
| 2\. Gói thầu – hợp đồng | Goi_thau_hop_dong_de_tai_du_an\_{YYYYMMDDHHmmss}.xlsx | Hai sheet, mỗi sheet có tiêu đề "DANH SÁCH DỰ ÁN ĐỀ TÀI - TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL". Sheet "Gói thầu – hợp đồng", dòng phụ đề "Hợp đồng link với gói thầu, và gói thầu link với dự án/ đề tài", hai nhóm cột THÔNG TIN VỀ LỰA CHỌN NHÀ THẦU (LCNT), THÔNG TIN VỀ HỢP ĐỒNG. Cột: TT; Tên đề tài/dự án; Số gói thầu; Tên gói thầu; Lĩnh vực; Hình thức LCNT; Giá gói thầu (VNĐ); Giá trúng thầu (VNĐ); Người phụ trách; Ngày QĐ phê duyệt KHLCNT; Số QĐ phê duyệt KHLCNT; Số hợp đồng; Ngày ký; Đối tác ký HĐ; Giá trị ký HĐ (VNĐ); Loại HĐ; Người theo dõi HĐ. Mỗi cặp gói thầu – hợp đồng một dòng; gói chưa có hợp đồng một dòng, nhóm cột hợp đồng để trống. Gói thầu, hợp đồng theo BR-DADT-03-02, BR-DADT-03-03. Dòng xếp theo thứ tự đề tài trên danh sách, trong đề tài theo BR-DADT-03-02, trong gói theo BR-DADT-03-03. Gói dùng chung cho nhiều đề tài trong tập xuất có dòng ở mỗi đề tài. Giá gói thầu, Giá trị ký HĐ là giá trị của cả gói, cả hợp đồng. Sheet "Hợp đồng không qua gói thầu", phụ đề "Hợp đồng không link với gói thầu, chỉ link với dự án/ đề tài", cột: TT; Tên đề tài/dự án; Số hợp đồng; Ngày ký; Đối tác ký HĐ; Giá trị ký HĐ (VNĐ); Loại HĐ; Người theo dõi HĐ. Không có hợp đồng loại này thì sheet chỉ có tiêu đề |
| 3\. Tỉ lệ thực hiện | Ti_le_thuc_hien_de_tai_du_an\_{YYYYMMDDHHmmss}.xlsx | Sheet "Tỉ lệ thực hiện", mỗi đề tài một dòng. Cột: STT; Trạng thái ĐT/DA; Khối (BR-DADT-01-05); Đơn vị; Nguồn vốn; Tên đề tài/dự án; Ngày bắt đầu ĐT/DA; Ngày kết thúc ĐT/DA (phần ngày theo BR-DADT-01-03); Tổng dự toán được duyệt; Tổng Giá trị đầu tư mua sắm; Gói thầu đã và đang thực hiện (Số lượng, Giá trị); Hợp đồng đã và đang thực hiện (Số lượng, Giá trị); Tỉ lệ thực hiện đầu tư mua sắm (%); Tỉ lệ thời gian thực hiện DT/DA (%); Ghi chú (để trống). Số liệu theo BR-DADT-01-07 |
| 4\. Văn bản pháp lý | Van_ban_phap_ly_de_tai_du_an\_{YYYYMMDDHHmmss}.xlsx | Sheet "Văn bản pháp lý", tiêu đề "DANH SÁCH VĂN BẢN PHÁP LÝ DỰ ÁN ĐỀ TÀI - TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL". Mỗi văn bản một dòng, các văn bản của một đề tài liền nhau, thứ tự theo BR-DADT-03-04. Cột: STT; Tên dự án/ đề tài; Mã dự án/ đề tài; Số văn bản; Ngày văn bản; Người ký; Nội dung; Ghi chú. Đề tài không có văn bản thì không có dòng. Không kèm tệp văn bản |
| 5\. Gói thầu phân bổ nhiều đề tài / dự án | Goi_thau_phan_bo_nhieu_de_tai\_{YYYYMMDDHHmmss}.xlsx | Sheet "Gói thầu phân bổ", tiêu đề "Danh sách gói thầu phân bổ nhiều dự án". Gói thầu có nguồn thuộc từ hai đề tài trở lên, trong đó ít nhất một đề tài thuộc tập xuất. Mỗi cặp gói thầu – đề tài một dòng, kể cả đề tài ngoài tập xuất mà người xuất được thấy; các dòng của một gói liền nhau. Gói xếp theo Số gói thầu tăng dần; trong gói, đề tài xếp theo Giá trị phân bổ giảm dần, cùng giá trị thì Mã đề tài tăng dần. Cột: STT; Số gói thầu; Tên gói thầu; Giá gói thầu (VNĐ); Người phụ trách; Tên dự án/ đề tài; Giá trị phân bổ (VNĐ) theo BR-DADT-03-02. Đề tài người xuất không được thấy (BR-DADT-C-10) không có dòng; các dòng khác của gói vẫn xuất |

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng bấm \[Xuất Excel\], chọn mẫu. |
| 2 | Hệ thống lấy tập đề tài theo điều kiện đang áp (BR-DADT-01-06), kiểm tra số dòng, sinh tệp, ghi nhật ký. Trong lúc sinh tệp, nút \[Xuất Excel\] ở trạng thái đang xử lý, không bấm lại được (mục 4.6.6). |
| 3 | Trình duyệt tải tệp. |
| 4 | Hiện Toast "Xuất file thành công." |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Tập đề tài rỗng | Toast: "Không có dữ liệu để xuất." Không sinh tệp |
| Mẫu 2, 4, 5: có đề tài nhưng không có gói thầu, văn bản | Vẫn sinh tệp, sheet chỉ có tiêu đề |
| Vượt số dòng tối đa | Toast, số có dấu chấm phân cách nghìn: "Số dòng xuất vượt quá giới hạn {số dòng tối đa} dòng. Vui lòng thu hẹp điều kiện tìm kiếm." Không sinh tệp |
| Không có quyền | "Bạn không có quyền thực hiện chức năng này." |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." (mục 4.6.7) |

**Đồng thời:** tệp theo dữ liệu tại thời điểm sinh tệp; lần đồng bộ chạy cùng lúc không làm một đề tài trong tệp có nửa dữ liệu cũ, nửa dữ liệu mới.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0241-01 | Đang lọc Loại = Khoa học công nghệ, ra 25 đề tài, trang 10 dòng | Chọn mẫu Danh sách đề tài / dự án | Tệp có 25 dòng dữ liệu, cùng thứ tự với màn, đủ 18 cột theo mẫu |
| AC-0241-02 | Đề tài 004-26-VHT-RDP-DS Tổng dự toán 147.543.128.721 đồng | Xuất mẫu Danh sách | Ô Tổng dự toán được duyệt là 147543128721, kiểu số |
| AC-0241-03 | Đề tài có TG kết thúc nhãn "Quý IV/2025", ngày 31/12/2025 | Xuất mẫu Danh sách; xuất mẫu Tỉ lệ thực hiện | Mẫu Danh sách cột Kết thúc là "Quý IV/2025"; mẫu Tỉ lệ thực hiện cột Ngày kết thúc là 31/12/2025 |
| AC-0241-04 | Đề tài Hoàn thành (Số ngày còn thực hiện hiện "-") | Xuất mẫu Danh sách | Ô Số ngày còn lại để trống |
| AC-0241-05 | Bộ lọc không có kết quả | Chọn một mẫu bất kỳ | Hiện "Không có dữ liệu để xuất.", không có tệp |
| AC-0241-06 | Có đề tài Mật X; người dùng không được thấy X | Xuất mẫu Danh sách không lọc | Tệp không có X |
| AC-0241-07 | Đề tài A có gói G1 (hai hợp đồng H1, H2) và gói G2 (chưa có hợp đồng) | Xuất mẫu Gói thầu – hợp đồng, lọc theo mã A | Sheet "Gói thầu – hợp đồng" có 3 dòng: G1–H1, G1–H2, G2 với nhóm cột hợp đồng trống |
| AC-0241-08 | Đề tài A Tổng giá trị ĐTMS 10.000.000.000 đồng; gói G1 một nguồn, Giá gói 4.000.000.000 đồng, hợp đồng đã ký 3.600.000.000 đồng; gói G2 Đã hủy | Xuất mẫu Tỉ lệ thực hiện | Gói thầu: Số lượng 1, Giá trị 4000000000; Hợp đồng: Số lượng 1, Giá trị 3600000000; Tỉ lệ thực hiện đầu tư mua sắm 36,00 |
| AC-0241-09 | Gói GT-2026-0040 Giá gói 5.000.000.000 đồng, phân bổ cho đề tài A 2.800.000.000, đề tài B 2.400.000.000 (tổng 5.200.000.000); hợp đồng của gói ký 4.680.000.000 đồng | Xuất mẫu Tỉ lệ thực hiện cho A | Giá trị gói thầu của A 2800000000; Giá trị hợp đồng của A 2520000000 (4.680.000.000 × 2.800.000.000 / 5.200.000.000) |
| AC-0241-10 | Hôm nay 05/11/2026; đề tài Ngày bắt đầu 01/03/2026, Ngày kết thúc 31/12/2026 | Xuất mẫu Tỉ lệ thực hiện | Tỉ lệ thời gian thực hiện 81,64 (249 / 305 ngày) |
| AC-0241-11 | Đề tài chưa có Ngày kết thúc | Xuất mẫu Tỉ lệ thực hiện | Ô Tỉ lệ thời gian thực hiện để trống |
| AC-0241-12 | Đề tài 004-26-VHT-RDP-DS có hai văn bản 8952B/QĐ-VHT, 9050/QĐ-VHT | Xuất mẫu Văn bản pháp lý, lọc theo mã | Hai dòng, cùng Tên và Mã đề tài |
| AC-0241-13 | Gói GT-2026-0041 phân bổ cho ba đề tài A 2,0 tỷ, B 3,0 tỷ, C 1,0 tỷ đồng, chỉ A thuộc tập xuất | Xuất mẫu Gói thầu phân bổ nhiều đề tài / dự án | Có 3 dòng của gói, liền nhau, thứ tự B, A, C, mỗi dòng Giá trị phân bổ của đề tài đó |
| AC-0241-14 | Gói chỉ có nguồn thuộc một đề tài | Xuất mẫu Gói thầu phân bổ nhiều đề tài / dự án | Gói không có trong tệp |
| AC-0241-15 | Số dòng tối đa của tệp xuất 10.000; tập lọc có 10.001 đề tài | Xuất mẫu Danh sách | Hiện "Số dòng xuất vượt quá giới hạn 10.000 dòng. Vui lòng thu hẹp điều kiện tìm kiếm.", không có tệp |
| AC-0241-16 | Xuất thành công | Kiểm tra nhật ký (mục 2.3.5) | Có người xuất, thời điểm, mẫu, số đề tài |
| AC-0241-17 | Đang sinh tệp | Bấm \[Xuất Excel\] lần nữa | Không mở danh sách mẫu, không sinh tệp thứ hai |
| AC-0241-18 | Gói có hai nguồn ĐXMS Đ1 và KĐT K1, cả hai thuộc đề tài A; hợp đồng ký 1.000.000.000 đồng | Xuất mẫu Tỉ lệ thực hiện cho A | Giá trị hợp đồng của A 1000000000 (tính đủ) |
| AC-0241-19 | Gói G2 thuộc kế hoạch chưa có QĐ phê duyệt; hợp đồng H có phần tính cho A bằng 0 | Xuất mẫu Tỉ lệ thực hiện cho A | G2 không được đếm ở Gói thầu; H không được đếm ở Hợp đồng |
| AC-0241-20 | Đề tài Hoàn thành; đề tài Dừng thực hiện | Xuất mẫu Tỉ lệ thực hiện | Tỉ lệ thời gian thực hiện lần lượt 100,00 và để trống |
| AC-0241-21 | Đã xuất mẫu Tỉ lệ thực hiện | Mở tệp, xem ô Ngày bắt đầu ĐT/DA, ô tỉ lệ | Ô ngày là kiểu ngày, hiện DD/MM/YYYY; ô tỉ lệ là số, ví dụ 36,00 |
| AC-0241-22 | Gói GT-2026-0041 phân bổ cho A (người xuất được thấy) và X Mật (người xuất không được thấy) | Xuất mẫu Gói thầu phân bổ nhiều đề tài / dự án, lọc theo A | Có dòng A, không có dòng X, không có chữ "Hạn chế xem" thay cho X |
| AC-0241-23 | Đề tài A và B cùng thuộc tập xuất, dùng chung gói G có hợp đồng H | Xuất mẫu Gói thầu – hợp đồng | Có dòng G–H dưới đề tài A và dòng G–H dưới đề tài B; Giá gói thầu, Giá trị ký HĐ là giá trị cả gói, cả hợp đồng |

#### DTMS_CN_0242 Xem chi tiết đề tài / dự án: Thông tin chung và Phê duyệt

##### Thông tin chung chức năng

- **Mục đích:** Xem toàn bộ thông tin chung và thông tin phê duyệt của một đề tài / dự án; từ màn này chuyển sang các tab dự toán, thông tin liên quan.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài theo BR-DADT-C-10.

- **Đường dẫn truy cập:** Danh sách đề tài / dự án \> Mã đề tài hoặc bấm dòng. Liên kết Đề tài / dự án ở màn của module khác (đề xuất mua sắm, khoản đầu tư) theo tài liệu thiết kế của module đó.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### Màn hình

<img src="media/rId75.png" style="width:6.25in;height:3.90625in" alt="Chi tiết đề tài / dự án, tab Thông tin chung" />

Ảnh minh họa bố cục, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 11/11/2026. Khác ảnh: Thời gian bắt đầu, Thời gian kết thúc là hai ô theo BR-DADT-01-03 (ảnh ghép một ô Thời gian thực hiện); thêm Mã dự án Mật, Giá trị quyết toán, Tình trạng pháp lý, Tình trạng mua sắm, Cập nhật từ nguồn lúc, Số / ngày QĐ phê duyệt quyết toán; Loại hiện tên đầy đủ "Khoa học công nghệ"; tên Nguồn dữ liệu theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4. Khi khác nhau, áp dụng mục 3.1.1.3.3.

##### Mô tả chi tiết các thành phần

Mọi trường ở hai khối Thông tin chung, Phê duyệt chỉ xem, hiển thị theo BR-DADT-01-08.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Thanh tiêu đề** |  |  |  |  |
| 1 | Nút quay lại | Icon | Input | – | Về màn đã mở Chi tiết. Về Danh sách đề tài / dự án thì giữ điều kiện tìm, trang đang xem. |
| 2 | Tiêu đề | Text | Output | "Xem chi tiết đề tài / dự án" | Không có nút thao tác: module chỉ đọc (BR-DADT-C-01). |
|  | **Tab** |  |  |  |  |
| 3 | Thông tin chung, Dự toán chi phí, ĐXMS liên quan, KĐT liên quan, Gói thầu / Hợp đồng, Văn bản pháp lý | Tab | Input | Thông tin chung | Thông tin chung theo chức năng này; Dự toán chi phí theo DTMS_CN_0243 – DTMS_CN_0246; ĐXMS liên quan, KĐT liên quan theo DTMS_CN_0247; Gói thầu / Hợp đồng theo DTMS_CN_0248; Văn bản pháp lý theo DTMS_CN_0249. Tab tải dữ liệu khi mở. Mở Chi tiết luôn vào tab Thông tin chung. |
|  | **Khối Thông tin chung** |  |  |  |  |
| 4 | Mã dự án / đề tài | Text | Output | Theo dữ liệu | Có Mã cũ (BR-DADT-C-02) thì thêm dòng "Mã cũ: {mã}"; đề tài được đề tài khác ghi làm Mã cũ thì thêm dòng "Được thay bởi: {mã}". Mã là liên kết mở Chi tiết đề tài đó khi người xem được thấy (BR-DADT-C-10); không được thấy thì không có dòng. Mapping: project.code, project.previous_code. |
| 5 | Tên dự án / đề tài | Text | Output | Theo dữ liệu | Hiện đủ, xuống dòng khi dài. Mapping: project.name. |
| 6 | Loại dự án / đề tài | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.type_code. |
| 7 | Loại dự án (chi tiết) | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.type_detail_code. |
| 8 | Mã dự án SAP | Text | Output | Theo dữ liệu | Mapping: project.sap_code. |
| 9 | Cấp phê duyệt | Text | Output | Theo dữ liệu | Tổng Công ty, Tập đoàn. Mapping: project.approval_level_code. |
| 10 | Nhóm dự án | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.group_code. |
| 11 | Nguồn vốn | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.fund_code. |
| 12 | Lĩnh vực | Text | Output | Theo dữ liệu | Tên trong danh mục Lĩnh vực. Mapping: project.field_code. |
| 13 | Đơn vị lập (đơn vị chủ trì) | Text | Output | Theo dữ liệu | Cùng trường Đơn vị lập ở danh sách. Mapping: project.unit_id. |
| 14 | Khối đơn vị | Text | Output | Theo dữ liệu | Theo BR-DADT-01-05. Mapping: Suy từ project.unit_id. |
| 15 | Chủ nhiệm | Text | Output | Theo dữ liệu | Mapping: project.owner_user_id, project.owner_name. |
| 16 | Người phụ trách báo cáo | Text | Output | Theo dữ liệu | Mapping: project.reporter_user_id, project.reporter_name. |
| 17 | Lập theo kế hoạch năm | Text | Output | Theo dữ liệu | Có, Không. Mapping: project.annual_plan. |
| 18 | Loại sản phẩm | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.product_type_code. |
| 19 | Mã dự án theo KHĐT năm | Text | Output | Theo dữ liệu | Mapping: project.plan_code. |
| 20 | ID dự án trên cổng Đấu thầu QG | Text | Output | Theo dữ liệu | Mapping: project.portal_id. |
| 21 | Mật | Text | Output | Theo dữ liệu | Có, Không. Mapping: project.secret. |
| 22 | Mã dự án Mật | Text | Output | Theo dữ liệu | Chỉ có khi Mật = Có và người xem có quyền Xem đề tài / dự án Mật (BR-DADT-01-08); đề tài không Mật thì không có ô này, kể cả với người có quyền. Mapping: project.secret_code. |
| 23 | Tổng dự toán (gồm VAT) | Text | Output | Theo dữ liệu | "{giá trị} tỷ đồng" theo BR-DADT-01-04, BR-DADT-C-12. Mapping: Tính, project.total_estimate. |
| 24 | Tổng giá trị đầu tư mua sắm (gồm VAT) | Text | Output | Theo dữ liệu | "{giá trị} tỷ đồng" theo BR-DADT-01-04. Mapping: Tính, project.total_procurement. |
| 25 | Giá trị quyết toán | Text | Output | Theo dữ liệu | "{giá trị} tỷ đồng", theo hệ thống nguồn của đề tài; không lấy từ Tài chính (SAP), mục 2.2. Mapping: project.settlement_value. |
| 26 | Địa điểm đầu tư | Text | Output | Theo dữ liệu | Mapping: project.location. |
| 27 | Thời gian bắt đầu | Text | Output | Theo dữ liệu | Theo BR-DADT-01-03. Mapping: project.start_label, project.start_date. |
| 28 | Thời gian kết thúc | Text | Output | Theo dữ liệu | Theo BR-DADT-01-03. Mapping: project.end_label, project.end_date. |
| 29 | Số ngày còn thực hiện | Number | Output | Theo dữ liệu | Theo BR-DADT-01-02, tô màu như danh sách. Mapping: Tính. |
| 30 | Trạng thái (tình trạng dự án) | Tag | Output | Theo dữ liệu | Theo mục 2.3.1.1, cùng màu như danh sách. Mapping: project.status. |
| 31 | Tình trạng pháp lý | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.legal_status_code. |
| 32 | Tình trạng mua sắm | Text | Output | Theo dữ liệu | Tên trong danh mục. Mapping: project.purchase_status_code. |
| 33 | Ngày nghiệm thu | Text | Output | Theo dữ liệu | Theo nguồn, có thể là văn bản. Mapping: project.accepted_on. |
| 34 | Nguồn dữ liệu | Text | Output | Theo dữ liệu | Tên theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4. Đề tài bị đánh dấu Không còn ở nguồn thì thêm "Không còn ở nguồn từ {DD/MM/YYYY}" (BR-DADT-04-02). Mapping: project.source, project.missing_at_source_at. |
| 35 | Cập nhật từ nguồn lúc | Datetime \[DD/MM/YYYY HH:mm\] | Output | Theo dữ liệu | Thời điểm lần đồng bộ gần nhất ghi đề tài này (BR-DADT-C-01). Mapping: project.synced_at. |
| 36 | Nội dung, quy mô dự án (thông tin sản phẩm) | Text | Output | Theo dữ liệu | Chiếm cả hàng, hiện đủ, giữ xuống dòng. Mapping: project.scope. |
|  | **Khối Phê duyệt** |  |  |  |  |
| 37 | Số / ngày TTr chủ trương | Text | Output | Theo dữ liệu | Mapping: project.policy_no, project.policy_date. |
| 38 | Số / ngày QĐ phê duyệt dự án | Text | Output | Theo dữ liệu | Mapping: project.decision_no, project.decision_date. |
| 39 | Số / ngày QĐ phê duyệt dự toán | Text | Output | Theo dữ liệu | Mapping: project.estimate_decision_no, project.estimate_decision_date. |
| 40 | Số / ngày QĐ phê duyệt quyết toán | Text | Output | Theo dữ liệu | Mapping: project.settlement_decision_no, project.settlement_decision_date. |
| 41 | Người phê duyệt chủ trương | Text | Output | Theo dữ liệu | Văn bản theo nguồn (chức danh hoặc họ tên), không phải tài khoản. Mapping: project.policy_approver. |
| 42 | Người phê duyệt dự án | Text | Output | Theo dữ liệu | Như ô 41. Mapping: project.project_approver. |
| 43 | Người phê duyệt dự toán | Text | Output | Theo dữ liệu | Như ô 41. Mapping: project.estimate_approver. |
| 44 | Người phê duyệt quyết toán | Text | Output | Theo dữ liệu | Như ô 41. Mapping: project.settlement_approver. |

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở Chi tiết đề tài / dự án. |
| 2 | Hệ thống kiểm tra quyền xem (BR-DADT-C-10), tải khối Thông tin chung, khối Phê duyệt. |
| 3 | Người dùng chuyển tab hoặc quay lại. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Mã đề tài không tồn tại | Màn hiện "Không tìm thấy đề tài / dự án.", nút quay lại về Danh sách |
| Không được thấy đề tài (đề tài Mật) | "Bạn không có quyền thực hiện chức năng này." Không hiện dữ liệu |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |

**Đồng thời:** lần đồng bộ cập nhật đề tài trong lúc đang xem thì dữ liệu mới hiện ở lần tải sau. Đề tài vừa đổi sang Mật thì lần tải sau xét lại quyền theo BR-DADT-C-10.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0242-01 | Đề tài 004-26-VHT-RDP-DS Loại Khoa học công nghệ, vào bằng đồng bộ | Bấm Mã ở danh sách | Mở tab Thông tin chung; Loại "Khoa học công nghệ", Nguồn dữ liệu "Đồng bộ Khoa học công nghệ"; không có nút thao tác nào ngoài quay lại |
| AC-0242-02 | Đề tài có TTr chủ trương số 2104/TTr-VHT ngày 20/11/2025 | Xem khối Phê duyệt | Số / ngày TTr chủ trương "2104/TTr-VHT ngày 20/11/2025" |
| AC-0242-03 | Đề tài có số QĐ phê duyệt dự toán 2211/QĐ-TĐ, không có ngày | Xem khối Phê duyệt | Ô hiện "2211/QĐ-TĐ", không có chữ "ngày" |
| AC-0242-04 | Đề tài chưa có Giá trị quyết toán, Ngày nghiệm thu | Xem khối Thông tin chung | Hai ô hiện "-" |
| AC-0242-05 | Đề tài Mật, Mã dự án Mật "M-07"; người xem thuộc Đơn vị lập, không có quyền Xem đề tài / dự án Mật | Mở Chi tiết | Mở được; Mật "Có"; không có ô Mã dự án Mật |
| AC-0242-06 | Như AC-0242-05, người xem có quyền Xem đề tài / dự án Mật | Mở Chi tiết | Có ô Mã dự án Mật "M-07" |
| AC-0242-07 | Đề tài Mật X; người dùng không thuộc nhóm được thấy X (BR-DADT-C-10) | Mở bằng đường dẫn | "Bạn không có quyền thực hiện chức năng này.", không hiện dữ liệu |
| AC-0242-08 | Đường dẫn với mã không tồn tại | Mở | "Không tìm thấy đề tài / dự án.", có nút quay lại về Danh sách |
| AC-0242-09 | Chủ nhiệm theo nguồn "cuongvv9" khớp tài khoản Vũ Văn Cường | Xem Chủ nhiệm | "Vũ Văn Cường" |
| AC-0242-10 | Chủ nhiệm theo nguồn "Đặng Hoài Sơn" không khớp tài khoản | Xem Chủ nhiệm | "Đặng Hoài Sơn" |
| AC-0242-11 | Đề tài có Nguồn vốn "Vốn vay" đã ngừng sử dụng trong danh mục | Xem Nguồn vốn | "Vốn vay" |
| AC-0242-12 | Đề tài có dự toán chi tiết, tổng Giá trị sau thuế 202.318.000.000 đồng | Xem Tổng dự toán (gồm VAT) | "202,32 tỷ đồng" |
| AC-0242-13 | Hôm nay 05/11/2026; đề tài Đang thực hiện, Ngày kết thúc 31/12/2026 | Xem Số ngày còn thực hiện | 56, nền vàng |
| AC-0242-14 | Đã lọc danh sách, đang ở trang 2 | Mở Chi tiết rồi bấm nút quay lại | Về Danh sách, giữ điều kiện tìm và trang 2 |
| AC-0242-15 | Đang xem tab Văn bản pháp lý của đề tài A | Quay lại danh sách, mở đề tài B | Chi tiết B mở ở tab Thông tin chung |
| AC-0242-16 | Lần đồng bộ bắt đầu 01:00 ngày 05/11/2026 ghi đề tài lúc 01:03 | Xem Cập nhật từ nguồn lúc | "05/11/2026 01:03" |
| AC-0242-17 | Đề tài Loại SXKD, nguồn không có Lập theo kế hoạch năm, Loại sản phẩm | Mở Chi tiết | Vẫn có hai ô, hiện "-" |
| AC-0242-18 | DA-2026-040 có Mã cũ DA-2025-012; cả hai có trên ĐTMS, người xem thấy được cả hai | Mở Chi tiết DA-2026-040, rồi Chi tiết DA-2025-012 | DA-2026-040 có dòng "Mã cũ: DA-2025-012" (liên kết); DA-2025-012 có dòng "Được thay bởi: DA-2026-040" (liên kết) |
| AC-0242-19 | DA-2025-044 bị đánh dấu Không còn ở nguồn ngày 15/11/2026 | Mở Chi tiết | Nguồn dữ liệu "Đồng bộ Khoa học công nghệ", kèm "Không còn ở nguồn từ 15/11/2026" |

### Dự toán chi phí

Tab Dự toán chi phí của Chi tiết đề tài / dự án cho biết dự toán đã phê duyệt gồm những khoản mục nào, khoản mục nào phải mua qua đầu mối mua sắm, và mỗi khoản mục đã được đề xuất mua sắm, khoản đầu tư dùng tới đâu. Dự toán chỉ xem (BR-DADT-C-01); trên tab chỉ có hai giá trị ghi được là Chi mua sắm và đánh dấu Hoàn thành của khoản mục, do TTMS ghi (BR-DADT-C-03). Phần khả dụng tính theo BR-DADT-C-07, dùng chung với Quản lý đề xuất mua sắm, Quản lý khoản đầu tư. Đơn vị tiền theo BR-DADT-C-12. Mỗi lần mở tab, xuất tệp, ghi Chi mua sắm hoặc Hoàn thành, hệ thống kiểm tra lại quyền xem đề tài (BR-DADT-C-10).

Quy tắc của nghiệp vụ 3.1.2:

| Mã | Quy tắc |
|----|----|
| BR-DADT-02-01 | **Bảng dự toán dạng cây** ba cấp: Loại chi phí → Khoản mục → dòng con (BR-DADT-02-06). Loại chi phí xếp theo thứ tự trong danh mục Loại chi phí, chỉ hiện Loại có khoản mục; khoản mục xếp theo thứ tự trong dự toán của nguồn. STT đánh theo cấp: Loại chi phí "1", khoản mục "1.1", dòng con "1.1.1". Mở tab thì các Loại chi phí mở, các khoản mục đóng. Hai cột STT, Loại chi phí / Khoản mục chi phí ghim khi cuộn ngang. Dòng Loại chi phí hiện tổng Giá trị trước thuế, Thuế GTGT, Giá trị sau thuế của khoản mục còn hiệu lực thuộc Loại đó. Cuối bảng có dòng **Tổng** của các khoản mục đang hiện theo bộ lọc: Giá trị trước thuế, Thuế GTGT, Giá trị sau thuế cộng khoản mục còn hiệu lực; Đã đăng ký, Đang giữ, Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm cộng mọi khoản mục, kể cả Ngừng sử dụng; Còn lại khả dụng cộng khoản mục Chi mua sắm còn hiệu lực. Khoản mục Ngừng sử dụng (mục 2.3.1.2) vẫn hiện, chữ xám kèm nhãn "Ngừng sử dụng", không cộng vào cột dự toán của dòng Loại chi phí, dòng Tổng, Tổng dự toán. **Đơn giá** hiện theo đồng, dấu chấm phân cách nghìn, không theo tỷ đồng. Số lượng hiện tối đa 3 chữ số thập phân, bỏ số 0 thừa. Khoản mục không có Số lượng thì Đơn giá và mọi cột số lượng hiện "-". Khoản mục không Chi mua sắm hoặc Ngừng sử dụng: Còn lại khả dụng và Khối lượng còn lại hiện "-" (không bóc tách thêm được); Đã đăng ký, Đang giữ hiện số khi có phần đã dùng, không có thì "-"; ba mốc giá trị, Giá trị tiết kiệm theo BR-DADT-02-05 |
| BR-DADT-02-02 | **Lọc trong tab.** Loại chi phí chọn nhiều, Từ khóa tìm trong tên khoản mục (không phân biệt hoa thường, có dấu hay không dấu). Bảng chỉ còn khoản mục khớp mọi điều kiện, kèm Loại chi phí cha và dòng con của chúng; dòng Loại chi phí vẫn hiện tổng của mọi khoản mục còn hiệu lực thuộc Loại. Khối Chỉ số thực hiện không đổi theo bộ lọc. Bộ lọc mất khi rời tab |
| BR-DADT-02-03 | **Đổi Chi mua sắm** (DTMS_CN_0244). Chỉ vai trò TTMS, trong chế độ chỉnh sửa (BR-DADT-02-10); điều kiện dưới đây kiểm tra khi bấm \[Lưu\]. Đánh dấu Chi mua sắm rồi lưu nghĩa là TTMS cho phép mua sắm khoản mục: từ lúc lưu, khoản mục bóc tách được vào đề xuất mua sắm, khoản đầu tư (BR-DADT-C-05). Đánh dấu: khoản mục Còn hiệu lực; Trạng thái khoản mục theo trạng thái suy (mục 2.3.1.2). Bỏ đánh dấu: không được khi khoản mục có dòng con Phần tính Đang giữ (BR-DADT-02-06), kể cả khi giá trị Đang giữ bằng 0 (khoản mục không có Số lượng, hạng mục chưa có cơ sở giá); được khi không có dòng con nào như vậy, sau khi người dùng xác nhận; đánh dấu Hoàn thành (nếu có) bị bỏ, ô Trạng thái để trống; phần Đã đăng ký giữ nguyên. Đổi Chi mua sắm làm đổi Tổng giá trị đầu tư mua sắm của đề tài (BR-DADT-01-04), cũng là Giá trị của đề tài khi làm văn bản căn cứ (BR-DADT-C-06). Được đổi ở đề tài mọi Loại, mọi trạng thái; chỉ đề tài Loại Khoa học công nghệ dùng cờ này để bóc tách (BR-DADT-C-05). Khoản mục Ngừng sử dụng: không đánh dấu mới được; đang đánh dấu thì bỏ được theo điều kiện trên, đánh dấu, bỏ Hoàn thành vẫn được. Khoản mục Ngừng sử dụng xuất hiện lại ở nguồn thì về Còn hiệu lực, giữ Chi mua sắm và đánh dấu Hoàn thành đã có |
| BR-DADT-02-04 | **Đánh dấu Hoàn thành khoản mục** (DTMS_CN_0244). Trạng thái khoản mục do hệ thống suy (mục 2.3.1.2): Chưa mua sắm, Đang mua sắm, Đã phê duyệt; người dùng không chọn ba trạng thái này. Chỉ vai trò TTMS, chỉ ở khoản mục Chi mua sắm, trong chế độ chỉnh sửa (BR-DADT-02-10), đánh dấu hoặc bỏ Hoàn thành: ô Trạng thái của TTMS có hai lựa chọn là trạng thái suy hiện tại và Hoàn thành. Chọn Hoàn thành thì khi \[Lưu\] cần người dùng xác nhận; đang Hoàn thành mà chọn trạng thái suy thì bỏ Hoàn thành, không cần xác nhận. Hoàn thành thì khoản mục không còn trong danh sách bóc tách (BR-DADT-C-05); đề xuất mua sắm, khoản đầu tư đang dùng khoản mục không bị dừng, phần Đã đăng ký, Đang giữ giữ nguyên. Hệ thống không tự đánh dấu Hoàn thành, kể cả khi đã đăng ký đủ |
| BR-DADT-02-05 | **Ba mốc giá trị và Giá trị tiết kiệm** của khoản mục. Lấy từ Lựa chọn nhà thầu, Hợp đồng; không nhập trên ĐTMS. Hạng mục xét là hạng mục liên kết khoản mục trên hồ sơ chi phối Hoàn thành, thuộc một gói thầu. **Tỉ lệ của hạng mục trong gói** = Thành tiền theo cơ sở giá của hạng mục / tổng Thành tiền theo cơ sở giá của mọi hạng mục thuộc gói; tổng đó bằng 0 thì tỉ lệ bằng 0. **Giá trị chọn thầu** = tổng, trên các gói đã có giá trúng thầu, không ở trạng thái Đã hủy, của Giá trúng thầu × tỉ lệ. **Giá trị chọn HĐ** = tổng, trên các hợp đồng đã có Ngày ký, không ở trạng thái Đã hủy, của gói, của Giá trị ký × tỉ lệ. **Giá trị sau khi tất toán HĐ** = như Giá trị chọn HĐ, trên các hợp đồng đã tất toán, với giá trị hợp đồng sau tất toán. Mỗi gói, mỗi hợp đồng làm tròn tới đồng (từ 0,5 làm tròn lên) rồi mới cộng. **Giá trị mới nhất** của một hạng mục: giá trị sau khi tất toán HĐ nếu có; chưa có thì giá trị chọn HĐ; chưa có thì giá trị chọn thầu. Phạt, giảm giá phát sinh sau khi chọn thầu trừ vào giá trị hợp đồng nên Giá trị mới nhất đã phản ánh. **Giá trị tiết kiệm** = tổng, trên các hạng mục đã có ít nhất một mốc, của (giá trị dự toán của hạng mục − Giá trị mới nhất của hạng mục); giá trị dự toán của hạng mục = SL đề xuất × Giá trị sau thuế / Số lượng của khoản mục, làm tròn tới đồng; khoản mục không có Số lượng thì bằng Giá trị sau thuế. Số âm hiện màu đỏ. Chưa có hạng mục nào có mốc thì ba mốc và Giá trị tiết kiệm hiện "-". Giá trị chọn HĐ của khoản mục khác "giá trị hợp đồng tính cho đề tài" ở BR-DADT-01-07: quy tắc đó phân bổ theo nguồn của gói (đề xuất mua sắm, khoản đầu tư), quy tắc này phân bổ tiếp tới hạng mục; tổng Giá trị chọn HĐ của mọi khoản mục có thể nhỏ hơn số của BR-DADT-01-07 khi gói có hạng mục Ngoài căn cứ |
| BR-DADT-02-06 | **Dòng con của khoản mục.** Mỗi đề xuất mua sắm, khoản đầu tư liên quan (BR-DADT-03-01) có hạng mục liên kết khoản mục là một dòng con: theo hồ sơ chi phối; không có hồ sơ chi phối thì theo hồ sơ gần nhất có hạng mục liên kết; khoản đầu tư chưa có hồ sơ thì theo phần khoản mục đã khai báo trên khoản đầu tư. Hồ sơ dùng để lập dòng không có hạng mục liên kết khoản mục (chưa tới bước lập hạng mục, hoặc hạng mục không chọn khoản mục này) thì đối tượng không có dòng con, trừ khoản đầu tư chưa có hồ sơ có khai báo khoản mục. Một hồ sơ có tối đa một hạng mục liên kết một khoản mục, nên mỗi đối tượng một dòng. **Phần tính:** Đã đăng ký nếu hồ sơ chi phối Hoàn thành; Đang giữ nếu hồ sơ chi phối Đang xử lý, và với khoản đầu tư chưa có hồ sơ có khai báo khoản mục (BR-DADT-C-07); Không tính trong mọi trường hợp còn lại (Dừng xử lý, Đã hủy, khoản đầu tư kết thúc khi chưa có hồ sơ, hạng mục chưa xác nhận). Số lượng, giá trị của dòng ghi vào cột Đã đăng ký hoặc Đang giữ theo Phần tính; dòng Không tính hiện "-" ở hai cột đó, Ghi chú "Không tính vào phần khả dụng". Có hồ sơ Điều chỉnh đang xử lý thì dòng vẫn theo hồ sơ chi phối, Ghi chú "Có hồ sơ điều chỉnh đang xử lý". Dòng xếp theo Ngày tạo của đề xuất mua sắm, khoản đầu tư tăng dần, cùng ngày thì Mã tăng dần. Đối tượng người xem không được thấy: Mã "Hạn chế xem", không có liên kết; số lượng, giá trị "-" (tệp xuất ghi "-" như màn); Đợt, Trạng thái hiện bình thường; số liệu của khoản mục vẫn tính đủ (BR-DADT-C-11) |
| BR-DADT-02-07 | **Chỉ số thực hiện của đề tài**, 10 chỉ số: Tổng dự toán, Giá trị chi mua sắm, Đã đăng ký, Đang giữ, Còn lại khả dụng, Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm, Tỷ lệ đã đăng ký mua. Tổng dự toán, Giá trị chi mua sắm theo BR-DADT-01-04 (Giá trị chi mua sắm là Tổng giá trị đầu tư mua sắm). Đã đăng ký, Đang giữ, ba mốc giá trị, Giá trị tiết kiệm: tổng của mọi khoản mục, kể cả khoản mục Ngừng sử dụng hoặc đã bỏ Chi mua sắm còn phần đã dùng; ba mốc, Giá trị tiết kiệm chỉ cộng khoản mục đã có giá trị, không khoản mục nào có thì "-". Còn lại khả dụng = Giá trị chi mua sắm − Đã đăng ký − Đang giữ, cùng số với phần còn dùng được của đề tài khi làm văn bản căn cứ (BR-DADT-C-06); có thể khác tổng cột Còn lại khả dụng của khoản mục khi có phần đã dùng ở khoản mục không còn Chi mua sắm hoặc Ngừng sử dụng. Tỷ lệ đã đăng ký mua (%) = (Đã đăng ký + Đang giữ) / Giá trị chi mua sắm × 100, tính trên số đồng, làm tròn 1 chữ số thập phân (từ 0,05 làm tròn lên); Giá trị chi mua sắm bằng 0 thì "-". Số âm hiện màu đỏ |
| BR-DADT-02-08 | **Tệp xuất dự toán** (DTMS_CN_0246). Một tệp hai sheet. Sheet "Dự toán chi phí": các dòng đang hiện theo bộ lọc của tab (BR-DADT-02-02), gồm dòng Loại chi phí, khoản mục, mọi dòng con (kể cả khoản mục đang đóng trên màn), dòng Tổng; cùng thứ tự, cùng STT, cùng cột với màn trừ cột thao tác; Chi mua sắm ghi "Có" / "Không", Trạng thái ghi tên. Sheet "Chỉ số thực hiện": 10 chỉ số của BR-DADT-02-07, mỗi chỉ số một dòng; chỉ số "-" thì ô để trống. Kiểu ô, đơn vị tiền theo đồng, đối tượng hạn chế xem như BR-DADT-01-06. Số dòng dữ liệu của sheet "Dự toán chi phí" vượt số dòng tối đa của tệp xuất (mục 2.3.6) thì không sinh tệp |
| BR-DADT-02-09 | **Khoản mục chưa đóng của đề tài đã kết thúc.** Khoản mục chưa đóng là khoản mục Chi mua sắm = Có, Hiệu lực Còn hiệu lực, Trạng thái khoản mục khác Hoàn thành, thuộc đề tài Trạng thái Hoàn thành hoặc Dừng thực hiện. Hệ thống không tự đánh dấu Hoàn thành, vì đề xuất mua sắm, khoản đầu tư đang dùng khoản mục vẫn chạy (BR-DADT-C-09); TTMS đóng từng khoản mục theo BR-DADT-02-04. Trên tab Dự toán chi phí, khoản mục chưa đóng có nhãn "Đề tài đã kết thúc"; Danh sách đề tài / dự án lọc được đề tài có khoản mục chưa đóng (DTMS_CN_0240 ô 12). Lần đồng bộ đổi đề tài sang Hoàn thành hoặc Dừng thực hiện mà còn khoản mục chưa đóng: chi tiết lần ghi Cảnh báo "Đề tài / dự án đã kết thúc, còn {n} khoản mục chưa Hoàn thành." |
| BR-DADT-02-10 | **Chế độ chỉnh sửa Chi mua sắm, Trạng thái** (DTMS_CN_0244). Bảng dự toán mặc định chỉ xem, kể cả với TTMS. TTMS bấm \[Chỉnh sửa\] thì vào chế độ chỉnh sửa: hộp Chi mua sắm và ô Trạng thái (BR-DADT-02-04) đổi được, mọi ô khác vẫn khóa; \[Chỉnh sửa\] ẩn, hiện \[Lưu\], \[Hủy\]. Đổi trong chế độ chỉnh sửa chỉ là **nháp trên màn**: chưa ghi vào hệ thống, chưa kiểm tra, khối Chỉ số thực hiện và Tổng giá trị đầu tư mua sắm chưa đổi. Bấm \[Lưu\]: hệ thống kiểm tra mọi khoản mục đã đổi theo BR-DADT-02-03, BR-DADT-02-04 và phiên bản dữ liệu của từng khoản mục; một khoản mục không đạt thì **không ghi khoản mục nào**, báo lỗi, giữ nguyên nháp và chế độ chỉnh sửa; mọi khoản mục đạt thì hiện một hộp xác nhận nếu có khoản mục bỏ Chi mua sắm hoặc chọn Hoàn thành, đồng ý thì ghi mọi thay đổi trong một giao dịch, thoát chế độ chỉnh sửa. Không có thay đổi nào thì \[Lưu\] chỉ thoát chế độ chỉnh sửa. Bấm \[Hủy\]: bỏ mọi nháp, về giá trị đã lưu, thoát chế độ chỉnh sửa. Đang có nháp mà chuyển tab, rời màn hoặc tải lại thì hỏi "Các thay đổi chưa lưu sẽ bị bỏ. Bạn có chắc chắn?"; đồng ý thì bỏ nháp. Bộ lọc của tab (BR-DADT-02-02) dùng được trong chế độ chỉnh sửa, không làm mất nháp của khoản mục đang ẩn. Mở, đóng khoản mục, xuất tệp vẫn dùng được; tệp xuất theo giá trị đã lưu |

#### DTMS_CN_0243 Xem dự toán chi phí

##### Thông tin chung chức năng

- **Mục đích:** Xem dự toán đã phê duyệt của đề tài theo Loại chi phí, khoản mục; biết khoản mục nào là Chi mua sắm, đã đăng ký, đang giữ, còn lại bao nhiêu để lập đề xuất mua sắm, khoản đầu tư tiếp theo.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài (BR-DADT-C-10).

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab Dự toán chi phí.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### Màn hình

<img src="media/rId85.png" style="width:6.25in;height:7.51466in" alt="Tab Dự toán chi phí" />

Ảnh minh họa bố cục, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 12/11/2026, khoản mục 1.1 đang mở hai dòng con, bảng chưa cuộn ngang (các cột Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm, Chi mua sắm, Trạng thái, Ghi chú ở bên phải). Khác ảnh: thêm khối lọc (Loại chi phí, Từ khóa) trên bảng; thêm cột Đơn giá, Đã đăng ký, Đang giữ, Khối lượng đang giữ, Khối lượng còn lại; số lượng, giá trị của dòng con nằm ở cột Đã đăng ký hoặc Đang giữ theo BR-DADT-02-06 (ảnh để ở cột Giá trị sau thuế); thêm dòng Tổng cuối bảng. Khi khác nhau, áp dụng mục 3.1.2.1.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Khối Chỉ số thực hiện** |  |  |  | Theo DTMS_CN_0245. |
|  | **Khối Dự toán chi phí** |  |  |  |  |
| 1 | Đơn vị tiền | Text | Output | "Đơn vị tiền: tỷ đồng" | Góc phải tiêu đề khối. |
| 2 | \[Xuất Excel\] | Button | Input | – | Theo DTMS_CN_0246. |
| 2a | \[Chỉnh sửa\], \[Lưu\], \[Hủy\] | Button | Input | – | Chỉ vai trò TTMS thấy; theo DTMS_CN_0244, BR-DADT-02-10. |
| 3 | Loại chi phí | Multi-select | Input | Trống (tất cả) | Danh mục Loại chi phí, chỉ các Loại có trong dự toán của đề tài. Lọc ngay khi chọn (BR-DADT-02-02). |
| 4 | Từ khóa | Textbox \[200\] | Input | Trống | Placeholder "Tìm theo tên khoản mục". Lọc khi nhấn Enter hoặc bấm biểu tượng tìm; xóa hết thì bỏ điều kiện (BR-DADT-02-02). |
| 5 | STT | Text | Output | Theo dữ liệu | Theo cấp, BR-DADT-02-01. Ghim. |
| 6 | Loại chi phí / Khoản mục chi phí | Text | Output | Theo dữ liệu | Dòng Loại chi phí: "{mã} - {tên}", chữ đậm. Dòng khoản mục: tên, tối đa 2 dòng, quá dài hiện tooltip; Ngừng sử dụng thì thêm nhãn "Ngừng sử dụng"; khoản mục chưa đóng (BR-DADT-02-09) thêm nhãn "Đề tài đã kết thúc". Dòng con: theo DTMS_CN_0245. Dòng có cấp dưới có biểu tượng mở, đóng. Ghim. Mapping: project_cost_item.cost_type_code, project_cost_item.name. |
| 7 | ĐVT | Text | Output | Theo dữ liệu | Tên trong danh mục đơn vị tính. Mapping: project_cost_item.uom. |
| 8 | Khối lượng cần thực hiện | Number | Output | Theo dữ liệu | Số lượng của khoản mục. Mapping: project_cost_item.quantity. |
| 9 | Đơn giá (đồng) | Number | Output | Theo dữ liệu | Theo nguồn; nguồn không có thì Giá trị trước thuế / Số lượng, làm tròn tới đồng. Theo đồng (BR-DADT-02-01). Mapping: project_cost_item.unit_price; nguồn không có thì Tính. |
| 10 | Giá trị trước thuế | Number | Output | Theo dữ liệu | Mapping: project_cost_item.pre_tax. |
| 11 | %VAT | Number | Output | Theo dữ liệu | "{số}%". Mapping: project_cost_item.vat_rate. |
| 12 | Thuế GTGT | Number | Output | Theo dữ liệu | Mapping: project_cost_item.tax. |
| 13 | Giá trị sau thuế | Number | Output | Theo dữ liệu | Mapping: project_cost_item.value. |
| 14 | Đã đăng ký | Number | Output | Theo dữ liệu | Giá trị Đã đăng ký theo BR-DADT-C-07. Mapping: Tính. |
| 15 | Đang giữ | Number | Output | Theo dữ liệu | Giá trị Đang giữ theo BR-DADT-C-07. Mapping: Tính. |
| 16 | Còn lại khả dụng | Number | Output | Theo dữ liệu | Theo BR-DADT-C-07; âm thì màu đỏ. Mapping: Tính. |
| 17 | Khối lượng đã thực hiện | Number | Output | Theo dữ liệu | Số lượng Đã đăng ký theo BR-DADT-C-07. Mapping: Tính. |
| 18 | Khối lượng đang giữ | Number | Output | Theo dữ liệu | Số lượng Đang giữ theo BR-DADT-C-07. Mapping: Tính. |
| 19 | Khối lượng còn lại | Number | Output | Theo dữ liệu | Theo BR-DADT-C-07; âm thì màu đỏ. Mapping: Tính. |
| 20 | Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ | Number (ba cột) | Output | "-" | Ba mốc theo BR-DADT-02-05, lấy từ Lựa chọn nhà thầu, Hợp đồng; chưa có thì "-". Mapping: Tính. |
| 21 | Giá trị tiết kiệm | Number | Output | "-" | Theo BR-DADT-02-05; âm thì màu đỏ; chưa có mốc nào thì "-". Mapping: Tính. |
| 22 | Chi mua sắm | Checkbox | Input | Theo dữ liệu | Theo DTMS_CN_0244. Vai trò khác TTMS: hộp đánh dấu mờ, chỉ xem. Mapping: project_cost_item.procurement, project_cost_item.active (Hiệu lực), project_cost_item.version (khóa lạc quan). |
| 23 | Trạng thái | Dropdown | Input | Theo dữ liệu | Theo mục 2.3.1.2: Chưa mua sắm màu xám, Đang mua sắm màu xanh dương, Đã phê duyệt màu xanh lá, Hoàn thành màu cam. Vai trò TTMS chọn theo DTMS_CN_0244; vai trò khác thấy nhãn. Khoản mục không Chi mua sắm: "-". Mapping: Tính, project_cost_item.item_status. |
| 24 | Ghi chú | Text | Output | Theo dữ liệu | Theo nguồn; tối đa 2 dòng, quá dài hiện tooltip. Dòng con theo BR-DADT-02-06. Mapping: project_cost_item.note. |
| 25 | Dòng Tổng | Row | Output | Theo dữ liệu | Cuối bảng, theo BR-DADT-02-01: cột 10, 12, 13, 14, 15, 16, ba cột của dòng 20, cột 21. |

Cột tiền căn phải, 2 chữ số thập phân, trừ Đơn giá. Ô không có giá trị hiện "-". Không phân trang. Đề tài chưa có dự toán chi tiết: không có khối lọc và bảng, khối hiện "Đề tài / dự án chưa có dự toán chi tiết."; khối Chỉ số thực hiện theo DTMS_CN_0245. Không có thêm, sửa, xóa, sao chép khoản mục (BR-DADT-C-01).

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở tab Dự toán chi phí. |
| 2 | Hệ thống kiểm tra quyền xem đề tài (BR-DADT-C-10), tải dự toán, tính phần khả dụng (BR-DADT-C-07), ba mốc giá trị, Giá trị tiết kiệm (BR-DADT-02-05), chỉ số (BR-DADT-02-07). |
| 3 | Hệ thống hiện khối Chỉ số thực hiện và bảng theo BR-DADT-02-01. |
| 4 | Người dùng lọc, mở, đóng dòng, cuộn ngang. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Đề tài chưa có dự toán chi tiết | Khối Dự toán chi phí hiện "Đề tài / dự án chưa có dự toán chi tiết." |
| Bộ lọc không có khoản mục nào | Bảng hiện "Không có dữ liệu", vẫn có dòng tiêu đề |
| Không tải được dự toán | Tại vùng khối: "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Không tải được dữ liệu của Quản lý đề xuất mua sắm hoặc Quản lý khoản đầu tư | Bảng vẫn hiện các cột dự toán; các cột tính (Đã đăng ký tới Giá trị tiết kiệm) và các chỉ số trừ Tổng dự toán, Giá trị chi mua sắm hiện "-"; không mở được dòng con; dòng thông báo trên bảng "Chưa tính được phần đã dùng. Vui lòng thử lại." |
| Không tải được dữ liệu của Hợp đồng hoặc Lựa chọn nhà thầu, hoặc hai module chưa triển khai | Chỉ ba mốc giá trị, Giá trị tiết kiệm (cột và chỉ số) hiện "-"; số liệu khác vẫn hiện |
| Không còn được thấy đề tài | "Bạn không có quyền thực hiện chức năng này." Không hiện dữ liệu |

**Đồng thời:** lần đồng bộ cập nhật dự toán, đề xuất mua sắm, khoản đầu tư đổi hạng mục hoặc trạng thái trong lúc đang xem thì số liệu mới hiện ở lần mở tab sau. Số liệu tại một lần tải được tính trên cùng một thời điểm dữ liệu.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0243-01 | Đề tài DA-2026-014 có 5 Loại chi phí PL2 – PL6, 10 khoản mục | Mở tab | Bảng có 5 dòng Loại chi phí đang mở theo thứ tự PL2, PL3, PL4, PL5, PL6; khoản mục đóng; STT "1", "1.1"… |
| AC-0243-02 | Như AC-0243-01 | Cuộn ngang bảng | Cột STT, Loại chi phí / Khoản mục chi phí đứng yên |
| AC-0243-03 | PL2 có ba khoản mục Giá trị sau thuế 170,01; 22,40; 0,45 tỷ đồng | Xem dòng PL2 | Giá trị sau thuế 192,86 |
| AC-0243-04 | Khoản mục "Máy tính xách tay cấu hình cao" Giá trị trước thuế 405.000.000 đồng, Số lượng 10, nguồn không có Đơn giá | Xem dòng | Đơn giá 40.500.000 |
| AC-0243-05 | Khoản mục "Chi phí quản lý dự án" không có Số lượng, không Chi mua sắm, chưa được dùng | Xem dòng | Đơn giá, ba cột Khối lượng, Đã đăng ký, Đang giữ, Còn lại khả dụng, ba mốc giá trị, Giá trị tiết kiệm hiện "-"; Trạng thái "-" |
| AC-0243-06 | Khoản mục K Ngừng sử dụng, Giá trị sau thuế 5,00 tỷ đồng, thuộc PL5 | Mở tab | K hiện chữ xám, nhãn "Ngừng sử dụng"; dòng PL5 và dòng Tổng không cộng 5,00 |
| AC-0243-07 | Đang mở tab | Chọn Loại chi phí PL2 | Bảng chỉ còn PL2 và 3 khoản mục; dòng Tổng 192,86; khối Chỉ số thực hiện không đổi |
| AC-0243-08 | Đang mở tab | Nhập Từ khóa "may do", nhấn Enter | Còn khoản mục "Thiết bị, máy đo chuyên dụng" và dòng PL2 |
| AC-0243-09 | Đã lọc PL2 | Chuyển sang tab Thông tin chung rồi về lại | Bộ lọc trống, bảng đủ 5 Loại chi phí |
| AC-0243-10 | Đề tài loại Sản xuất kinh doanh chưa có dự toán chi tiết | Mở tab | "Đề tài / dự án chưa có dự toán chi tiết.", không có bảng |
| AC-0243-11 | Chuyên viên đơn vị đề xuất mở tab | Xem tab | Không có nút thêm, sửa, xóa, sao chép khoản mục; hộp Chi mua sắm mờ; Trạng thái là nhãn |
| AC-0243-12 | Quản lý khoản đầu tư không phản hồi | Mở tab | Các cột dự toán, Tổng dự toán, Giá trị chi mua sắm hiện đủ; cột tính, chỉ số còn lại "-"; thông báo "Chưa tính được phần đã dùng. Vui lòng thử lại." |
| AC-0243-13 | Khoản mục có Còn lại khả dụng −1,20 tỷ đồng | Xem dòng | "-1,20" màu đỏ |
| AC-0243-14 | DA-2026-030 Dừng thực hiện; khoản mục 1.1 Chi mua sắm, còn hiệu lực, Trạng thái Đang mua sắm; khoản mục 1.2 Hoàn thành | Mở tab | 1.1 có nhãn "Đề tài đã kết thúc", Trạng thái vẫn Đang mua sắm; 1.2 không có nhãn |

#### DTMS_CN_0244 Đánh dấu Chi mua sắm và Hoàn thành khoản mục

##### Thông tin chung chức năng

- **Mục đích:** TTMS xác định khoản mục nào của dự toán phải mua qua đầu mối mua sắm (được bóc tách vào đề xuất mua sắm, khoản đầu tư) và đóng khoản mục đã mua xong.

- **Người dùng mục tiêu:** TTMS (mục 2.3.2). Vai trò khác chỉ xem.

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab Dự toán chi phí \> cột Chi mua sắm, Trạng thái.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10), có vai trò TTMS.

  - Đề tài có dự toán chi tiết.

- **Hậu điều kiện:**

  - Chi mua sắm, đánh dấu Hoàn thành được lưu; đồng bộ lại không ghi đè (BR-DADT-C-03).

  - Tổng giá trị đầu tư mua sắm của đề tài, danh sách khoản mục bóc tách được tính lại.

  - Ghi nhật ký (mục 2.3.5).

##### Màn hình

<img src="media/rId94.png" style="width:6.25in;height:3.90625in" alt="Cột Chi mua sắm, Trạng thái với vai trò TTMS" />

Ảnh minh họa, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 12/11/2026, đang ở chế độ chỉnh sửa (BR-DADT-02-10): khoản mục 2.1 vừa đánh dấu Chi mua sắm trong nháp, có dấu "đã sửa", Trạng thái hiện trạng thái suy; bảng cuộn sang phải. Khác ảnh: thêm các cột Đã đăng ký, Đang giữ, Khối lượng đang giữ, Khối lượng còn lại theo DTMS_CN_0243. Khi khác nhau, áp dụng mục 3.1.2.2.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Nút của khối Dự toán chi phí** |  |  |  |  |
| 1 | \[Chỉnh sửa\] | Button | Input | Hiện với TTMS khi bảng ở chế độ xem | Vào chế độ chỉnh sửa (BR-DADT-02-10). Ẩn khi đang chỉnh sửa. Đề tài chưa có dự toán chi tiết thì không có nút. |
| 2 | \[Lưu\] | Button | Input | Ẩn; hiện khi đang chỉnh sửa | Kiểm tra, hỏi xác nhận nếu cần (dòng 6), ghi mọi thay đổi một lần (BR-DADT-02-10). Trong lúc lưu ở trạng thái đang xử lý, không bấm lại được (mục 4.6.6). |
| 3 | \[Hủy\] | Button | Input | Ẩn; hiện khi đang chỉnh sửa | Bỏ mọi nháp, thoát chế độ chỉnh sửa, không hỏi lại. |
|  | **Ô của dòng khoản mục** |  |  |  |  |
| 4 | Chi mua sắm | Checkbox | Input | Theo dữ liệu | Chỉ có ở dòng khoản mục. Mờ khi chưa vào chế độ chỉnh sửa hoặc không phải TTMS. Trong chế độ chỉnh sửa bấm được, trừ khoản mục Ngừng sử dụng chưa đánh dấu (mờ, tooltip "Khoản mục ngừng sử dụng"). Đổi là nháp; ô đã đổi có dấu hiệu "đã sửa" tới khi lưu hoặc hủy. Bỏ đánh dấu thì ô Trạng thái (dòng 5) của nháp để trống. Mapping: project_cost_item.procurement. |
| 5 | Trạng thái | Dropdown | Input | Theo dữ liệu | Chỉ có khi Chi mua sắm (theo nháp) = Có. Ngoài chế độ chỉnh sửa là nhãn. Trong chế độ chỉnh sửa có hai lựa chọn: trạng thái suy hiện tại (Chưa mua sắm, Đang mua sắm hoặc Đã phê duyệt, mục 2.3.1.2) và Hoàn thành (BR-DADT-02-04). Đổi là nháp. Khoản mục vừa đánh dấu Chi mua sắm trong nháp: Trạng thái hiện trạng thái suy, chưa chọn Hoàn thành được tới khi lưu. Mapping: Tính, project_cost_item.item_status. |
|  | **Hộp xác nhận khi lưu** |  |  |  |  |
| 6 | Nội dung, \[Đồng ý\], \[Hủy\] | Dialog | Input | – | Hiện khi bấm \[Lưu\], mọi khoản mục đã đổi đạt điều kiện, và có ít nhất một khoản mục bỏ Chi mua sắm hoặc chọn Hoàn thành. Tiêu đề "Cập nhật khoản mục". Mỗi khoản mục bỏ Chi mua sắm một dòng: "Khoản mục {Tên khoản mục} sẽ không còn bóc tách được vào đề xuất mua sắm, khoản đầu tư và không tính vào Tổng giá trị đầu tư mua sắm."; có Đã đăng ký lớn hơn 0 thì thêm "Khoản mục đã được đăng ký {giá trị} tỷ đồng; phần này giữ nguyên." Mỗi khoản mục chọn Hoàn thành một dòng: "Khoản mục {Tên khoản mục} sẽ không còn bóc tách được vào đề xuất mua sắm, khoản đầu tư." Cuối hộp: "Bạn có chắc chắn?" \[Đồng ý\]: ghi. \[Hủy\] hoặc Esc: đóng hộp, không ghi, giữ nháp và chế độ chỉnh sửa. |
|  | **Hộp xác nhận bỏ nháp** |  |  |  |  |
| 7 | Nội dung, \[Đồng ý\], \[Hủy\] | Dialog | Input | – | Hiện khi đang có nháp mà chuyển tab, rời màn hoặc tải lại. Nội dung "Các thay đổi chưa lưu sẽ bị bỏ. Bạn có chắc chắn?" \[Đồng ý\]: bỏ nháp, đi tiếp. \[Hủy\]: ở lại, giữ nháp. |

Lưu xong, dòng khoản mục, dòng Loại chi phí, dòng Tổng và khối Chỉ số thực hiện tính lại.

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | TTMS bấm \[Chỉnh sửa\]. Hệ thống chuyển bảng sang chế độ chỉnh sửa, hiện \[Lưu\], \[Hủy\]. |
| 2 | TTMS đánh dấu, bỏ Chi mua sắm; đánh dấu, bỏ Hoàn thành ở một hoặc nhiều khoản mục. Hệ thống chỉ ghi nháp trên màn, không kiểm tra. |
| 3 | TTMS bấm \[Lưu\]. Hệ thống kiểm tra quyền, phiên bản dữ liệu và điều kiện của BR-DADT-02-03, BR-DADT-02-04 cho mọi khoản mục đã đổi. Một khoản mục không đạt: báo lỗi, không ghi khoản mục nào, giữ nháp và chế độ chỉnh sửa. |
| 4 | Có khoản mục bỏ Chi mua sắm hoặc chọn Hoàn thành: hệ thống hiện hộp xác nhận (dòng 6); TTMS bấm \[Đồng ý\]. |
| 5 | Hệ thống ghi mọi thay đổi trong một giao dịch, ghi nhật ký giá trị cũ, giá trị mới từng khoản mục, thoát chế độ chỉnh sửa. |
| 6 | Hiện Toast "Cập nhật khoản mục thành công."; tab tính lại số liệu. |
| 7 | TTMS bấm \[Hủy\] ở bước 1 – 3: hệ thống bỏ nháp, thoát chế độ chỉnh sửa. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| \[Lưu\] khi có khoản mục bỏ Chi mua sắm mà khoản mục có dòng con Phần tính Đang giữ | Toast lỗi: "Không thể bỏ Chi mua sắm. Khoản mục đang được giữ bởi {danh sách mã}." Danh sách gồm mã đề xuất mua sắm, khoản đầu tư có dòng con Phần tính Đang giữ, nối bằng dấu phẩy; mã người dùng không được thấy thay bằng "{n} hồ sơ hạn chế xem"; nhiều khoản mục bị chặn thì mỗi khoản mục một dòng, đầu dòng là tên khoản mục. Không ghi khoản mục nào; giữ nháp, giữ chế độ chỉnh sửa |
| Có dòng con mới Phần tính Đang giữ giữa lúc mở hộp xác nhận và lúc lưu | Như dòng trên, không lưu |
| Khoản mục đã được người khác đổi, hoặc đồng bộ đã ghi khoản mục sau lúc vào chế độ chỉnh sửa | "Dữ liệu đã được người khác cập nhật, vui lòng tải lại." Không ghi khoản mục nào; giữ chế độ chỉnh sửa để người dùng ghi lại nháp trước khi tải lại |
| Khoản mục vừa chuyển Ngừng sử dụng, nháp đánh dấu | "Khoản mục đã ngừng sử dụng, không đánh dấu Chi mua sắm được." Không ghi khoản mục nào |
| Không có quyền (không còn vai trò TTMS, không còn được thấy đề tài) | "Bạn không có quyền thực hiện chức năng này." Không lưu |
| Lỗi lưu, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." (mục 4.6.7); không ghi khoản mục nào, giữ nháp và chế độ chỉnh sửa |

**Đồng thời:** hai TTMS đổi cùng một khoản mục thì người lưu sau nhận thông báo dữ liệu đã thay đổi. Chế độ chỉnh sửa không khóa khoản mục với người khác; điều kiện Đang giữ xét tại lúc \[Lưu\]. Đề xuất mua sắm, khoản đầu tư đang bóc tách khoản mục khi TTMS bỏ Chi mua sắm hoặc chọn Hoàn thành: hạng mục đã xác nhận giữ nguyên; lần xác nhận bước lập hạng mục sau đó không chọn được khoản mục này (theo tài liệu thiết kế của module đó, BR-DADT-C-05).

##### Tiêu chí chấp nhận

Thao tác đổi Chi mua sắm, Trạng thái ở các tiêu chí dưới đây làm trong chế độ chỉnh sửa và kết thúc bằng \[Lưu\] (đồng ý ở hộp xác nhận khi có), trừ khi tiêu chí ghi khác.

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0244-01 | Chuyên viên TTMS; khoản mục "Hội thảo, công tác phí" chưa Chi mua sắm, Giá trị sau thuế 1,10 tỷ đồng; Tổng giá trị đầu tư mua sắm 201,91 tỷ đồng | Đánh dấu Chi mua sắm | Toast "Cập nhật khoản mục thành công."; Trạng thái Chưa mua sắm; Giá trị chi mua sắm 203,01 |
| AC-0244-02 | Khoản mục "Thiết bị, máy đo chuyên dụng" có dòng con ĐXMS-2026-0101 Phần tính Đang giữ | Bỏ Chi mua sắm | Toast lỗi "Không thể bỏ Chi mua sắm. Khoản mục đang được giữ bởi ĐXMS-2026-0101."; vẫn đánh dấu |
| AC-0244-03 | Khoản mục Chi mua sắm, không có dòng con Phần tính Đang giữ, Đã đăng ký 0 | Bỏ Chi mua sắm, bấm \[Đồng ý\] | Hết đánh dấu; Trạng thái "-"; nhật ký có người, thời điểm, Có → Không |
| AC-0244-04 | Khoản mục Chi mua sắm, không có dòng con Phần tính Đang giữ, Đã đăng ký 2,50 tỷ đồng | Bỏ Chi mua sắm | Hộp xác nhận có dòng "Khoản mục đã được đăng ký 2,50 tỷ đồng; phần này giữ nguyên." Đồng ý thì cột Đã đăng ký vẫn 2,50 |
| AC-0244-05 | Như AC-0244-03 | Bỏ Chi mua sắm, bấm \[Lưu\], bấm \[Hủy\] ở hộp xác nhận | Hộp đóng; chưa ghi, vẫn ở chế độ chỉnh sửa, nháp vẫn bỏ tích; không ghi nhật ký |
| AC-0244-06 | Khoản mục Chi mua sắm, Trạng thái Đang mua sắm | Chọn Hoàn thành, bấm \[Đồng ý\] | Trạng thái Hoàn thành; khoản mục không còn trong danh sách bóc tách của đề xuất mua sắm, khoản đầu tư mới |
| AC-0244-07 | Khoản mục Hoàn thành, có dòng con tính Đã đăng ký, không có dòng con tính Đang giữ | Chọn "Đã phê duyệt", bấm \[Lưu\] | Lưu, không có hộp xác nhận; Trạng thái Đã phê duyệt; khoản mục bóc tách lại được |
| AC-0244-08 | Khoản mục Hoàn thành có dòng con Phần tính Đang giữ 42,50 tỷ đồng | Xem dòng | Đang giữ 42,50; đề xuất của dòng con vẫn chạy |
| AC-0244-09 | Chuyên viên đơn vị đề xuất | Bấm hộp Chi mua sắm | Không đổi được (hộp mờ); Trạng thái là nhãn |
| AC-0244-10 | Hai Chuyên viên TTMS cùng mở tab; người thứ nhất đã chọn Hoàn thành | Người thứ hai đổi Chi mua sắm của cùng khoản mục | "Dữ liệu đã được người khác cập nhật, vui lòng tải lại."; không lưu |
| AC-0244-11 | Lần đồng bộ sau khi TTMS đã đánh dấu Chi mua sắm; nguồn ghi khoản mục không cần mua sắm | Đồng bộ chạy xong, mở tab | Khoản mục vẫn Chi mua sắm (BR-DADT-C-03) |
| AC-0244-12 | Khoản mục Ngừng sử dụng, chưa Chi mua sắm | Xem dòng | Hộp đánh dấu mờ, tooltip "Khoản mục ngừng sử dụng" |
| AC-0244-13 | Đề tài loại Sản xuất kinh doanh có dự toán chi tiết | Đánh dấu Chi mua sắm một khoản mục | Lưu được; Tổng giá trị đầu tư mua sắm tăng; khoản mục không xuất hiện ở danh sách bóc tách (chỉ Loại Khoa học công nghệ) |
| AC-0244-14 | Khoản mục có dòng con của đề xuất Mật người dùng không được thấy, Phần tính Đang giữ, và ĐXMS-2026-0101 Đang giữ | Bỏ Chi mua sắm | "Không thể bỏ Chi mua sắm. Khoản mục đang được giữ bởi ĐXMS-2026-0101, 1 hồ sơ hạn chế xem." |
| AC-0244-15 | Đề xuất Đ có hồ sơ Đang xử lý, hạng mục liên kết khoản mục đã xác nhận, chưa có cơ sở giá, khoản mục không có Số lượng (Đang giữ 0,00) | Bỏ Chi mua sắm | Toast lỗi "Không thể bỏ Chi mua sắm. Khoản mục đang được giữ bởi {mã Đ}." |
| AC-0244-16 | Khoản mục Chi mua sắm, chưa có dòng con nào được tính | Xem dòng | Trạng thái Chưa mua sắm |
| AC-0244-17 | ĐXMS-2026-0101 có hồ sơ Đang xử lý, hạng mục liên kết khoản mục đã xác nhận | Xem dòng | Trạng thái Đang mua sắm |
| AC-0244-18 | Như AC-0244-17, hồ sơ của ĐXMS-2026-0101 Hoàn thành; không có dòng con khác | Xem dòng | Trạng thái Đã phê duyệt |
| AC-0244-19 | Dòng con duy nhất của khoản mục là đề xuất có hồ sơ Dừng xử lý | Xem dòng | Trạng thái Chưa mua sắm |
| AC-0244-20 | Chuyên viên đơn vị đề xuất; khoản mục Đang mua sắm | Xem cột Trạng thái | Nhãn "Đang mua sắm", không chọn được |
| AC-0244-21 | Chuyên viên TTMS, bảng ở chế độ xem | Xem khối Dự toán chi phí | Có \[Chỉnh sửa\]; hộp Chi mua sắm mờ; Trạng thái là nhãn |
| AC-0244-22 | Như AC-0244-21 | Bấm \[Chỉnh sửa\] | Hộp Chi mua sắm, ô Trạng thái đổi được; ô khác vẫn khóa; hiện \[Lưu\], \[Hủy\], ẩn \[Chỉnh sửa\] |
| AC-0244-23 | Đang chỉnh sửa; "Hội thảo, công tác phí" 1,10 tỷ đồng chưa Chi mua sắm; Giá trị chi mua sắm 201,91 | Đánh dấu, chưa bấm \[Lưu\] | Chỉ đổi trên màn; Giá trị chi mua sắm vẫn 201,91; nhật ký không có bản ghi |
| AC-0244-24 | Đang chỉnh sửa, đã đánh dấu một khoản mục, bỏ đánh dấu một khoản mục khác | Bấm \[Hủy\] | Hai khoản mục về giá trị đã lưu; thoát chế độ chỉnh sửa; không ghi gì |
| AC-0244-25 | Đang chỉnh sửa: đánh dấu "Hội thảo, công tác phí", bỏ đánh dấu "Thiết bị, máy đo chuyên dụng" (có dòng con ĐXMS-2026-0101 Phần tính Đang giữ) | Bấm \[Lưu\] | Toast lỗi có "Thiết bị, máy đo chuyên dụng" và ĐXMS-2026-0101; "Hội thảo, công tác phí" cũng chưa ghi; vẫn ở chế độ chỉnh sửa, giữ nháp |
| AC-0244-26 | Đang chỉnh sửa: bỏ Chi mua sắm khoản mục A (không Đang giữ), chọn Hoàn thành khoản mục B | Bấm \[Lưu\] | Một hộp xác nhận có hai dòng A, B; \[Đồng ý\] thì ghi cả hai, nhật ký hai bản ghi, Toast "Cập nhật khoản mục thành công." |
| AC-0244-27 | Đang chỉnh sửa, có nháp | Chuyển sang tab Thông tin chung | Hỏi "Các thay đổi chưa lưu sẽ bị bỏ. Bạn có chắc chắn?"; \[Hủy\] thì ở lại tab, giữ nháp |
| AC-0244-28 | Đang chỉnh sửa, chưa đổi gì | Bấm \[Lưu\] | Không có hộp xác nhận, không ghi; thoát chế độ chỉnh sửa |

#### DTMS_CN_0245 Theo dõi thực hiện dự toán

##### Thông tin chung chức năng

- **Mục đích:** Biết từng khoản mục đã được những đề xuất mua sắm, khoản đầu tư nào dùng, mỗi đợt bao nhiêu, đang ở trạng thái nào; biết cả đề tài đã đăng ký, đang giữ, còn lại, đã ký hợp đồng bao nhiêu.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài (BR-DADT-C-10). Hệ thống tính số liệu.

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab Dự toán chi phí \> khối Chỉ số thực hiện; biểu tượng mở ở dòng khoản mục.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### Màn hình

Cùng màn với mục 3.1.2.1.2: khối Chỉ số thực hiện ở đầu tab; dòng con dưới khoản mục 1.1 của ảnh. Khác ảnh: số lượng, giá trị của dòng con ở cột Đã đăng ký hoặc Đang giữ; dòng con của khoản đầu tư chưa có hồ sơ là dòng Không tính; chỉ số Tỷ lệ đã đăng ký mua; 10 chỉ số, ba mốc giá trị thay Giá trị thực hiện. Khi khác nhau, áp dụng mục 3.1.2.3.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Khối Chỉ số thực hiện** |  |  |  | Theo BR-DADT-02-07. Đơn vị tỷ đồng, 2 chữ số thập phân. Không đổi theo bộ lọc. Đề tài chưa có dự toán chi tiết: Tổng dự toán, Giá trị chi mua sắm theo BR-DADT-01-04, chỉ số khác "-". |
| 1 | Tổng dự toán (gồm VAT) | Text | Output | Theo dữ liệu | "{giá trị} tỷ đồng". Mapping: Tính, project.total_estimate. |
| 2 | Giá trị chi mua sắm | Text | Output | Theo dữ liệu | Mapping: Tính, project.total_procurement. |
| 3 | Đã đăng ký | Text | Output | Theo dữ liệu | Tooltip "Đề xuất mua sắm, khoản đầu tư đã phê duyệt". Mapping: Tính. |
| 4 | Đang giữ | Text | Output | Theo dữ liệu | Tooltip "Đề xuất mua sắm, khoản đầu tư đang xử lý". Mapping: Tính. |
| 5 | Còn lại khả dụng | Text | Output | Theo dữ liệu | Âm thì màu đỏ. Mapping: Tính. |
| 6 | Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ | Text (ba chỉ số) | Output | "-" | Ba chỉ số theo BR-DADT-02-05, BR-DADT-02-07; chưa có thì "-". Mapping: Tính. |
| 7 | Giá trị tiết kiệm | Text | Output | "-" | Âm thì màu đỏ; chưa có mốc thì "-". Tooltip "Giá trị dự toán − Giá trị mới nhất". Mapping: Tính. |
| 8 | Tỷ lệ đã đăng ký mua | Text | Output | Theo dữ liệu | "{số}%", 1 chữ số thập phân; gồm phần Đang giữ (BR-DADT-02-07). Mapping: Tính. |
|  | **Dòng con của khoản mục** |  |  |  | Theo BR-DADT-02-06. Mở bằng biểu tượng ở dòng khoản mục; khoản mục không có dòng con thì không có biểu tượng. |
| 9 | STT | Text | Output | Theo dữ liệu | "{STT khoản mục}.{n}". |
| 10 | Đối tượng | Link | Input | – | Đề xuất mua sắm: "Đợt {Đợt} — {Mã ĐXMS}", Đợt theo BR-DADT-03-01. Khoản đầu tư: "KĐT — {Mã KĐT}". Mã mở Chi tiết đề xuất mua sắm (DTMS_CN_0137) hoặc Chi tiết khoản đầu tư (DTMS_CN_0181). Mapping: proposal.code, investment.code. |
| 11 | Đã đăng ký, Khối lượng đã thực hiện | Number | Output | Theo dữ liệu | Giá trị, số lượng của đối tượng khi Phần tính Đã đăng ký; khác thì "-". Mapping: Tính. |
| 12 | Đang giữ, Khối lượng đang giữ | Number | Output | Theo dữ liệu | Giá trị, số lượng khi Phần tính Đang giữ; khác thì "-". Mapping: Tính. |
| 13 | Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ | Number (ba cột) | Output | "-" | Phần ba mốc của khoản mục đến từ hạng mục của đối tượng (BR-DADT-02-05); không có thì "-". Mapping: Tính. |
| 14 | Trạng thái | Tag | Output | Theo dữ liệu | Trạng thái đề xuất mua sắm, khoản đầu tư theo tài liệu thiết kế của module đó, mục 2.3.1.1. Mapping: Suy từ hồ sơ của đối tượng. |
| 15 | Ghi chú | Text | Output | Theo dữ liệu | "Không tính vào phần khả dụng" hoặc "Có hồ sơ điều chỉnh đang xử lý" theo BR-DADT-02-06; khác thì trống. Mapping: Tính. |

Các cột khác của dòng con để trống.

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở tab Dự toán chi phí; hệ thống tính và hiện khối Chỉ số thực hiện (BR-DADT-02-07). |
| 2 | Người dùng bấm biểu tượng mở ở một khoản mục. |
| 3 | Hệ thống hiện dòng con theo BR-DADT-02-06, xét phạm vi xem của từng đối tượng theo module đó. |
| 4 | Người dùng bấm mã để mở chi tiết đề xuất mua sắm hoặc khoản đầu tư. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Không tải được dữ liệu của Quản lý đề xuất mua sắm, Quản lý khoản đầu tư | Như DTMS_CN_0243: cột tính, chỉ số "-", không mở được dòng con |
| Không tải được dữ liệu của Hợp đồng, Lựa chọn nhà thầu, hoặc hai module chưa triển khai | Ba mốc giá trị, Giá trị tiết kiệm (cột và chỉ số) hiện "-"; số liệu khác vẫn hiện |
| Mở mã nhưng đối tượng vừa đổi phạm vi xem | Màn chi tiết của module đó báo theo tài liệu thiết kế của module |
| Không còn được thấy đề tài | "Bạn không có quyền thực hiện chức năng này." Không hiện dữ liệu |

**Đồng thời:** như DTMS_CN_0243. Số liệu trên tab có thể khác cột Còn có thể sử dụng ở màn đề xuất mua sắm đang có hồ sơ Điều chỉnh, vì màn đó tính phần của chính đề xuất theo hồ sơ đang hiển thị (BR-DXMS-02-04), còn tab này tính mọi đối tượng theo hồ sơ chi phối (BR-DADT-C-07).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0245-01 | Khoản mục "Thiết bị, máy đo chuyên dụng" Số lượng 4, Giá trị sau thuế 170,01 tỷ đồng; ĐXMS-2026-0101 (Đợt 1) hồ sơ Phê duyệt Đang xử lý, hạng mục liên kết đã xác nhận SL 1, Thành tiền 42,50 tỷ đồng | Mở dòng khoản mục | Dòng con "Đợt 1 — ĐXMS-2026-0101": Đang giữ 42,50, Khối lượng đang giữ 1; khoản mục Đang giữ 42,50, Còn lại khả dụng 127,51, Khối lượng còn lại 3 |
| AC-0245-02 | Như AC-0245-01, thêm KĐT-2026-0030 chưa có hồ sơ, đã khai báo khoản mục SL 1, Giá trị dự tính 42,50 tỷ đồng | Mở dòng khoản mục | Có dòng "KĐT — KĐT-2026-0030", Trạng thái Mới tạo, Đang giữ 42,50, Khối lượng đang giữ 1; khoản mục Đang giữ 85,00, Còn lại khả dụng 85,01, Khối lượng còn lại 2 |
| AC-0245-03 | Hồ sơ của ĐXMS-2026-0101 Hoàn thành | Mở tab | Dòng con ở cột Đã đăng ký 42,50, Khối lượng đã thực hiện 1; Đang giữ "-" |
| AC-0245-04 | Khoản mục Số lượng 4, Giá trị sau thuế 170,01 tỷ đồng; đề xuất Đ có hồ sơ Phê duyệt Đang xử lý, hạng mục đã xác nhận ở bước lập hạng mục với SL đề xuất 2, chưa có cơ sở giá | Mở dòng khoản mục | Dòng con Khối lượng đang giữ 2; Đang giữ 85,01 (giá trị ước tính 85.005.000.000 đồng) |
| AC-0245-05 | Hồ sơ của đề xuất Đ chuyển Dừng xử lý | Mở tab | Dòng con Đ vẫn có, Trạng thái Dừng xử lý, Ghi chú "Không tính vào phần khả dụng"; phần của Đ không còn trong Đang giữ |
| AC-0245-06 | Đề xuất Đ đã Hoàn thành hồ sơ Phê duyệt (42,50 tỷ đồng), đang có hồ sơ Điều chỉnh xử lý với Thành tiền 50,00 tỷ đồng | Mở dòng khoản mục | Dòng con Đ: Đã đăng ký 42,50, Ghi chú "Có hồ sơ điều chỉnh đang xử lý" |
| AC-0245-07 | Khoản đầu tư K có hồ sơ Đã chuyển luồng và hồ sơ mới Đang xử lý | Mở dòng khoản mục | Một dòng K theo hồ sơ mới, Phần tính Đang giữ; không tính hai lần |
| AC-0245-08 | Đề xuất Đ Mật, người xem không được thấy; Đ Đang giữ 10,00 tỷ đồng | Mở dòng khoản mục | Dòng Đ: Mã "Hạn chế xem", không liên kết, giá trị, số lượng "-", Đợt và Trạng thái hiện; khoản mục Đang giữ vẫn gồm 10,00 |
| AC-0245-09 | Gói thầu G gồm hạng mục H1 (liên kết khoản mục A Số lượng 4, Giá trị sau thuế 4,00 tỷ đồng; SL đề xuất 3, Thành tiền 3,00 tỷ đồng) và H2 (khoản mục B Số lượng 1, Giá trị sau thuế 1,00 tỷ đồng; SL 1, Thành tiền 1,00 tỷ đồng); hợp đồng của G đã ký 3.600.000.000 đồng, chưa tất toán | Mở tab | A: Giá trị chọn HĐ 2,70, Giá trị tiết kiệm 0,30 (dự toán của H1 3,00 − 2,70); B: 0,90 và 0,10 |
| AC-0245-10 | Hợp đồng của gói G ở trạng thái Đã hủy, gói có giá trúng thầu 3.800.000.000 đồng | Mở tab | Giá trị chọn HĐ của A "-"; Giá trị chọn thầu 2,85; Giá trị tiết kiệm 0,15 (theo mốc chọn thầu) |
| AC-0245-19 | Khoản mục Giá trị sau thuế 170,01 tỷ đồng, một hạng mục dùng cả khoản mục; chỉ có Giá trị chọn thầu 165,00 | Xem dòng | Giá trị tiết kiệm 5,01 |
| AC-0245-20 | Như AC-0245-19, có đủ chọn thầu 165,00, chọn HĐ 160,00, sau khi tất toán HĐ 158,00 | Xem dòng | Giá trị mới nhất 158,00; Giá trị tiết kiệm 12,01 |
| AC-0245-21 | Khoản mục chưa có hạng mục nào thuộc gói thầu | Xem dòng, khối Chỉ số thực hiện | Ba mốc và Giá trị tiết kiệm "-" |
| AC-0245-22 | Lựa chọn nhà thầu, Hợp đồng chưa triển khai | Mở tab | Khối Chỉ số thực hiện có đủ 10 chỉ số; ba mốc và Giá trị tiết kiệm "-"; số liệu khác hiện đủ |
| AC-0245-11 | Giá trị chi mua sắm 201,91; Đã đăng ký 85,09; Đang giữ 0 | Xem khối Chỉ số thực hiện | Còn lại khả dụng 116,82; Tỷ lệ đã đăng ký mua 42,1% |
| AC-0245-12 | Khoản mục K đã bỏ Chi mua sắm, còn Đã đăng ký 2,50 tỷ đồng | Xem khối Chỉ số thực hiện | Đã đăng ký gồm 2,50; Giá trị chi mua sắm không gồm Giá trị sau thuế của K |
| AC-0245-13 | Lần đồng bộ giảm Số lượng của khoản mục từ 4 xuống 1 trong khi Đang giữ SL 2 | Mở tab | Khối lượng còn lại "-1" màu đỏ; dòng con giữ nguyên |
| AC-0245-14 | Module Hợp đồng không phản hồi | Mở tab | Ba mốc giá trị, Giá trị tiết kiệm "-"; Đã đăng ký, Đang giữ, Còn lại khả dụng vẫn hiện |
| AC-0245-15 | Có dòng con ĐXMS-2026-0101 | Bấm mã | Mở Chi tiết đề xuất mua sắm ĐXMS-2026-0101 |
| AC-0245-16 | KĐT K1 tạo 05/02/2026, ĐXMS Đ1 tạo 10/03/2026, ĐXMS Đ2 tạo 02/09/2026, cùng dùng một khoản mục | Mở dòng khoản mục | Thứ tự dòng con: K1, Đ1 (Đợt 1), Đ2 (Đợt 2) |
| AC-0245-17 | Giá trị chi mua sắm 201,91; Đã đăng ký 85,09; Đang giữ 42,50 | Xem khối Chỉ số thực hiện | Còn lại khả dụng 74,32; Tỷ lệ đã đăng ký mua 63,2% |
| AC-0245-18 | Đề xuất Đ như AC-0245-04 được xác nhận cơ sở giá, Thành tiền 80,00 tỷ đồng | Mở dòng khoản mục | Đang giữ của Đ 80,00 (theo Thành tiền, thay giá trị ước tính) |

#### DTMS_CN_0246 Xuất Excel dự toán chi phí

##### Thông tin chung chức năng

- **Mục đích:** Tải dự toán của đề tài kèm phần đã đăng ký, đang giữ, còn lại, các đợt sử dụng và chỉ số thực hiện để báo cáo, đối chiếu.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài (BR-DADT-C-10).

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab Dự toán chi phí \> \[Xuất Excel\].

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

  - Tệp được tải về.

  - Ghi nhật ký (mục 2.3.5).

##### Màn hình

Không có màn riêng. Nút \[Xuất Excel\] ở góc phải tiêu đề khối Dự toán chi phí (mục 3.1.2.1.2).

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | \[Xuất Excel\] | Button | Input | – | Xuất tệp theo BR-DADT-02-08. Đề tài chưa có dự toán chi tiết thì nút mờ, tooltip "Đề tài / dự án chưa có dự toán chi tiết". |

| Nội dung | Mô tả |
|----|----|
| Tên tệp | Du_toan\_{Mã đề tài}\_{YYYYMMDDHHmmss}.xlsx; ký tự không dùng được trong tên tệp của Mã đổi thành "\_" |
| Sheet "Dự toán chi phí" | Dòng 1 tiêu đề "DỰ TOÁN CHI PHÍ - {Tên đề tài}"; dòng 2 "Mã: {Mã đề tài}. Đơn vị tiền: đồng. Thời điểm xuất: {DD/MM/YYYY HH:mm}"; dòng 3 điều kiện lọc đang áp, không lọc thì "Tất cả khoản mục". Từ dòng 4: tiêu đề cột rồi dữ liệu. Cột: STT; Loại chi phí / Khoản mục chi phí; ĐVT; Khối lượng cần thực hiện; Đơn giá; Giá trị trước thuế; %VAT; Thuế GTGT; Giá trị sau thuế; Đã đăng ký; Đang giữ; Còn lại khả dụng; Khối lượng đã thực hiện; Khối lượng đang giữ; Khối lượng còn lại; Giá trị chọn thầu; Giá trị chọn HĐ; Giá trị sau khi tất toán HĐ; Giá trị tiết kiệm; Chi mua sắm; Trạng thái; Ghi chú. Ô "-" trên màn để trống, trừ dòng con hạn chế xem ghi "-". Khoản mục Ngừng sử dụng ghi thêm "(Ngừng sử dụng)" sau tên. Dòng con ghi cột 2 như màn |
| Sheet "Chỉ số thực hiện" | Hai cột Chỉ số, Giá trị; 10 dòng theo BR-DADT-02-07, chỉ số "-" thì ô trống; tiền theo đồng, tỷ lệ là số 1 chữ số thập phân |

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng bấm \[Xuất Excel\]. |
| 2 | Hệ thống kiểm tra quyền xem đề tài, lấy dữ liệu theo bộ lọc đang áp (BR-DADT-02-08), kiểm tra số dòng, sinh tệp, ghi nhật ký. Trong lúc sinh tệp, nút ở trạng thái đang xử lý, không bấm lại được (mục 4.6.6). |
| 3 | Trình duyệt tải tệp. |
| 4 | Hiện Toast "Xuất file thành công." |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bộ lọc không có khoản mục nào | Toast: "Không có dữ liệu để xuất." Không sinh tệp |
| Vượt số dòng tối đa | Toast: "Số dòng xuất vượt quá giới hạn {số dòng tối đa} dòng. Vui lòng thu hẹp điều kiện tìm kiếm." Không sinh tệp |
| Chưa tính được phần đã dùng (module khác lỗi) | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Không sinh tệp có số liệu thiếu |
| Không có quyền | "Bạn không có quyền thực hiện chức năng này." |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." (mục 4.6.7) |

**Đồng thời:** tệp theo dữ liệu tại thời điểm sinh tệp, có thể khác số trên màn nếu dữ liệu đổi sau lần mở tab; dòng 2 ghi thời điểm xuất.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0246-01 | Đề tài DA-2026-014, không lọc, các khoản mục đang đóng | Bấm \[Xuất Excel\] | Tệp Du_toan_DA-2026-014\_{thời điểm}.xlsx; sheet "Dự toán chi phí" có 5 dòng Loại chi phí, 10 khoản mục, mọi dòng con, dòng Tổng; dòng 3 "Tất cả khoản mục" |
| AC-0246-02 | Khoản mục Giá trị sau thuế 170,01 tỷ đồng (170.010.000.000 đồng) | Xuất | Ô Giá trị sau thuế là số 170010000000 |
| AC-0246-03 | Đang lọc Loại chi phí PL2 | Xuất | Chỉ có PL2, khoản mục và dòng con của PL2; dòng 3 ghi "Loại chi phí: PL2 - Chi phí vật tư thiết bị" |
| AC-0246-04 | Chỉ số Tỷ lệ đã đăng ký mua 42,1% | Xuất, mở sheet "Chỉ số thực hiện" | 10 dòng; ô Tỷ lệ đã đăng ký mua là số 42,1 |
| AC-0246-05 | Dòng con của đề xuất Mật người xuất không được thấy | Xuất | Dòng con có Mã "Hạn chế xem", giá trị, số lượng "-" |
| AC-0246-06 | Đề tài chưa có dự toán chi tiết | Xem nút | \[Xuất Excel\] mờ, tooltip "Đề tài / dự án chưa có dự toán chi tiết" |
| AC-0246-07 | Từ khóa không khớp khoản mục nào | Bấm \[Xuất Excel\] | "Không có dữ liệu để xuất.", không có tệp |
| AC-0246-08 | Xuất thành công | Kiểm tra nhật ký | Có người xuất, thời điểm, mã đề tài, điều kiện lọc |
| AC-0246-09 | Đang sinh tệp | Bấm \[Xuất Excel\] lần nữa | Không sinh tệp thứ hai |
| AC-0246-10 | Chuyên viên đơn vị đề xuất | Xuất | Xuất được, cột Chi mua sắm ghi "Có" / "Không" |
| AC-0246-11 | Số dòng tối đa của tệp xuất 10.000; sheet "Dự toán chi phí" có 10.001 dòng | Bấm \[Xuất Excel\] | "Số dòng xuất vượt quá giới hạn 10.000 dòng. Vui lòng thu hẹp điều kiện tìm kiếm.", không có tệp |

### Thông tin liên quan

Ba tab của Chi tiết đề tài / dự án cho biết đề tài đã được dùng ở đâu: đề xuất mua sắm, khoản đầu tư lấy đề tài làm căn cứ; gói thầu, hợp đồng lập từ các đề xuất, khoản đầu tư đó; văn bản pháp lý của đề tài. Mọi tab chỉ xem, không phân trang, đơn vị tiền theo BR-DADT-C-12. Đối tượng người xem không được thấy hiện theo BR-DADT-C-11 và bảng "Hiển thị đối tượng hạn chế xem" ở mục 2.3.4. Mỗi lần mở tab, tải tệp, hệ thống kiểm tra lại quyền xem đề tài (BR-DADT-C-10).

Quy tắc của nghiệp vụ 3.1.3:

| Mã | Quy tắc |
|----|----|
| BR-DADT-03-01 | **Đề xuất mua sắm, khoản đầu tư liên quan** là mọi đề xuất mua sắm có ô Đề tài / dự án là đề tài này và mọi khoản đầu tư có đề tài này trong các đề tài / dự án làm căn cứ (một khoản đầu tư có thể có nhiều đề tài; hiện ở tab của mỗi đề tài đó), ở mọi trạng thái, kể cả Dừng xử lý và khoản đầu tư Mới tạo. Sắp theo Ngày cập nhật giảm dần, cùng ngày thì Mã giảm dần. **Đợt** của đề xuất mua sắm là thứ tự của nó trong các đề xuất mua sắm của đề tài, xếp theo Ngày tạo tăng dần, cùng ngày thì Mã tăng dần; tính trên mọi đề xuất, kể cả đề xuất người xem không được thấy, nên không đổi theo người xem. Dòng người xem không được thấy hiện theo BR-DADT-C-11 |
| BR-DADT-03-02 | **Gói thầu liên quan** là gói thầu có ít nhất một nguồn là đề xuất mua sắm hoặc khoản đầu tư liên quan (BR-DADT-03-01), ở mọi trạng thái. **Giá trị phân bổ cho đề tài**: gói mà mọi nguồn thuộc đề tài này thì bằng Giá gói thầu; gói có nguồn thuộc từ hai đề tài trở lên thì bằng tổng giá trị phân bổ của các nguồn thuộc đề tài này, theo module Lựa chọn nhà thầu. Nguồn là khoản đầu tư có nhiều đề tài: phần thuộc đề tài này là phần của các hạng mục (dòng bóc tách) thuộc đề tài này. Sắp theo Ngày QĐ phê duyệt KHLCNT giảm dần, chưa có QĐ xếp đầu, cùng ngày thì Số gói thầu tăng dần. Gói người xem không được thấy hiện theo BR-DADT-C-11 |
| BR-DADT-03-03 | **Hợp đồng liên quan** là hợp đồng của gói thầu liên quan (BR-DADT-03-02), cộng hợp đồng gắn trực tiếp với đề tài không qua gói thầu nếu module Hợp đồng có liên kết này; ở mọi trạng thái. Sắp theo Ngày ký giảm dần, chưa ký xếp đầu, cùng ngày thì Mã hợp đồng tăng dần. Hợp đồng người xem không được thấy hiện theo BR-DADT-C-11 |
| BR-DADT-03-04 | **Văn bản pháp lý** lấy theo nguồn của đề tài (BR-DADT-C-01), ĐTMS không thêm, sửa, xóa. Sắp theo Ngày văn bản tăng dần, văn bản không có ngày xếp cuối; cùng ngày thì Số văn bản tăng dần, so theo chữ, không phân biệt hoa thường. Mỗi văn bản có tối đa một tệp. Mọi người được thấy đề tài được tải tệp; mọi lần tải tệp của đề tài Mật, kể cả lần bị từ chối, ghi nhật ký (mục 2.3.5) |

#### DTMS_CN_0247 Xem đề xuất mua sắm và khoản đầu tư liên quan

##### Thông tin chung chức năng

- **Mục đích:** Biết đề tài đã được lấy làm căn cứ ở những đề xuất mua sắm (theo từng đợt), khoản đầu tư nào, đang ở trạng thái nào, giá trị bao nhiêu; mở nhanh đối tượng đó.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài (BR-DADT-C-10).

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab ĐXMS liên quan; tab KĐT liên quan.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### Màn hình

<img src="media/rId116.png" style="width:6.25in;height:3.90625in" alt="Tab ĐXMS liên quan" />

<img src="media/rId119.png" style="width:6.25in;height:3.90625in" alt="Tab KĐT liên quan" />

Ảnh minh họa bố cục, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 12/11/2026. Ảnh bảng ĐXMS cuộn ngang tới cột cuối để thấy cột Giá trị đề xuất. Khác ảnh: bảng ĐXMS có thêm cột Quy trình; Trạng thái đề xuất mua sắm, khoản đầu tư theo bộ trạng thái của module đó. Khi khác nhau, áp dụng mục 3.1.3.1.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tab ĐXMS liên quan** |  |  |  |  |
| 1 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong bảng. |
| 2 | Trạng thái | Tag | Output | Theo dữ liệu | Trạng thái đề xuất mua sắm theo tài liệu thiết kế Quản lý đề xuất mua sắm, mục 2.3.1.1. Mapping: Suy từ hồ sơ của đề xuất. |
| 3 | Mã ĐXMS | Link | Input | – | Mở Chi tiết đề xuất mua sắm (DTMS_CN_0137). Hạn chế xem theo BR-DADT-03-01. Mapping: proposal.code. |
| 4 | Tên ĐXMS | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: proposal.title. |
| 5 | Đợt | Number | Output | Theo dữ liệu | Theo BR-DADT-03-01, căn giữa. Mapping: Tính. |
| 6 | Quy trình | Text | Output | Theo dữ liệu | Như cột Quy trình của Danh sách đề xuất mua sắm (tài liệu thiết kế Quản lý đề xuất mua sắm, BR-DXMS-C-05): luồng con MS01.01, MS01.02, MS01.03 hoặc MS02.01 – MS02.03 với hồ sơ Điều chỉnh; luồng chưa chốt kèm "(dự kiến)"; trước cổng sau bước 10 hiện "MS01" hoặc "MS02". Lấy theo hồ sơ đang xử lý của đề xuất, không có thì hồ sơ chi phối (BR-DXMS-C-30); không có hồ sơ thì "-". Hạn chế xem theo BR-DADT-C-11. Mapping: Suy từ hồ sơ của đề xuất (luồng con theo tài liệu thiết kế Quản lý đề xuất mua sắm). |
| 7 | Đơn vị đề xuất | Text | Output | Theo dữ liệu | Mapping: proposal.unit_id. |
| 8 | Giá trị đề xuất (tỷ đồng) | Number | Output | Theo dữ liệu | Giá trị đang có hiệu lực của đề xuất (hồ sơ đang xử lý chưa hoàn thành không làm đổi), cùng nhãn "Giá trị đề xuất" ở Danh sách và Chi tiết đề xuất mua sắm. Theo BR-DXMS-C-04 và phạm vi xem của đề xuất (BR-DXMS-01-09), căn phải. Không có giá trị thì "-". Mapping: Suy từ hồ sơ của đề xuất. |
| 9 | Người tạo | Text | Output | Theo dữ liệu | Họ tên. Mapping: proposal.created_by. |
| 10 | Ngày cập nhật | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: proposal.updated_at. |
|  | **Tab KĐT liên quan** |  |  |  |  |
| 11 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong bảng. |
| 12 | Trạng thái | Tag | Output | Theo dữ liệu | Trạng thái khoản đầu tư theo tài liệu thiết kế Quản lý khoản đầu tư, mục 2.3.1.1. Mapping: Suy từ hồ sơ của khoản đầu tư. |
| 13 | Mã KĐT | Link | Input | – | Mở Chi tiết khoản đầu tư (DTMS_CN_0181). Hạn chế xem theo BR-DADT-03-01. Mapping: investment.code. |
| 14 | Tên KĐT | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: investment.title. |
| 15 | Đơn vị đề xuất | Text | Output | Theo dữ liệu | Mapping: investment.unit_id. |
| 16 | Nhóm KĐT | Text | Output | Theo dữ liệu | Nhóm theo BR-KDT-01-12, hiện tên nhóm: **Đơn giản**, **Thông thường**, **Phức tạp** (mã nhóm MS13, MS14, MS15 chỉ lưu ở dữ liệu, không hiện). Khoản đầu tư chưa xác định nhóm (chưa có hồ sơ hoặc hồ sơ chưa qua bước phân luồng) thì "-". Mapping: Suy từ hồ sơ của khoản đầu tư (mã nhóm). |
| 17 | Tổng mức vốn (tỷ đồng) | Number | Output | Theo dữ liệu | Như cột Tổng mức vốn của Danh sách khoản đầu tư (BR-KDT-C-28, BR-KDT-01-11), căn phải. Không có thì "-". Mapping: Suy từ hồ sơ của khoản đầu tư. |
| 18 | Người tạo | Text | Output | Theo dữ liệu | Họ tên. Mapping: investment.created_by. |
| 19 | Ngày cập nhật | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: investment.updated_at. |

Hai bảng sắp theo BR-DADT-03-01, không phân trang. Bảng không có dòng hiện "Chưa có ĐXMS", "Chưa có KĐT".

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở tab ĐXMS liên quan hoặc tab KĐT liên quan. |
| 2 | Hệ thống kiểm tra quyền xem đề tài (BR-DADT-C-10), tải đề xuất mua sắm, khoản đầu tư liên quan (BR-DADT-03-01), xét phạm vi xem của từng đối tượng theo module đó. |
| 3 | Người dùng bấm Mã để mở chi tiết đối tượng. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Đề tài chưa được dùng | Hai bảng hiện "Chưa có ĐXMS", "Chưa có KĐT" |
| Không tải được dữ liệu của Quản lý đề xuất mua sắm hoặc Quản lý khoản đầu tư | Tại vùng bảng đó: "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3); bảng còn lại vẫn hiện |
| Không còn được thấy đề tài | "Bạn không có quyền thực hiện chức năng này." Không hiện dữ liệu |
| Mở Mã nhưng đối tượng vừa đổi phạm vi xem | Màn chi tiết của module đó báo theo tài liệu thiết kế của module |

**Đồng thời:** đề xuất mua sắm, khoản đầu tư mới tạo hoặc đổi trạng thái trong lúc đang xem hiện ở lần mở tab sau.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0247-01 | Đề tài DA-2026-002 có đề xuất ĐXMS-2026-0077 (tạo 10/03/2026) và ĐXMS-2026-0124 (tạo 02/09/2026), hai khoản đầu tư KĐT-2026-0018, KĐT-2026-0025 | Mở tab | Bảng ĐXMS có hai dòng, ĐXMS-2026-0077 Đợt 1, ĐXMS-2026-0124 Đợt 2; bảng KĐT có hai dòng |
| AC-0247-02 | Đề tài có ba đề xuất: Đ1 (đợt 1) Dừng xử lý, Đ2 (đợt 2) Đã phê duyệt, Đ3 (đợt 3) Đang phê duyệt | Mở tab | Có cả ba dòng; Đợt lần lượt 1, 2, 3 |
| AC-0247-03 | Đề tài có Đ1 Mật, người xem không được thấy Đ1; Đ2 không Mật | Người xem mở tab | Dòng Đ1: Mã, Tên "Hạn chế xem", không có liên kết, Quy trình và Giá trị đề xuất "-", Đợt 1; dòng Đ2 Đợt 2 |
| AC-0247-04 | Khoản đầu tư K vừa tạo, chưa có hồ sơ, chọn đề tài này | Mở tab | Có dòng K, Trạng thái Mới tạo |
| AC-0247-05 | Đề tài chưa có đề xuất, khoản đầu tư | Mở tab | Hai bảng hiện "Chưa có ĐXMS", "Chưa có KĐT" |
| AC-0247-06 | Có dòng ĐXMS-2026-0124 | Bấm mã | Mở Chi tiết đề xuất mua sắm ĐXMS-2026-0124 |
| AC-0247-07 | Đề xuất Đ có giá trị hiệu lực 12,50 tỷ đồng, đang có hồ sơ Điều chỉnh xử lý với giá trị 15 tỷ đồng | Xem dòng Đ | Cột Giá trị đề xuất (tỷ đồng) hiện 12,50 |
| AC-0247-08 | Khoản đầu tư được duyệt tổng mức vốn 150 tỷ đồng, người xem được thấy hồ sơ | Xem dòng | Tổng mức vốn 150,00 |
| AC-0247-09 | Ba đề xuất cập nhật lần lượt 01/10, 15/10, 03/11/2026 | Mở tab | Thứ tự dòng: 03/11, 15/10, 01/10 |
| AC-0247-10 | Khoản đầu tư K Mật, người xem không được thấy K | Mở tab | Dòng K: Mã, Tên "Hạn chế xem", không có liên kết; Nhóm KĐT, Tổng mức vốn, Người tạo, Ngày cập nhật "-"; Trạng thái, Đơn vị đề xuất hiện bình thường |
| AC-0247-11 | Đề tài vừa đổi sang Mật, người xem không còn được thấy; đang ở Chi tiết | Mở tab ĐXMS liên quan | "Bạn không có quyền thực hiện chức năng này.", không hiện dữ liệu |
| AC-0247-15 | Khoản đầu tư K có hai đề tài A và B | Mở tab KĐT liên quan ở đề tài A; ở đề tài B | K có ở tab KĐT liên quan của cả A và B |
| AC-0247-12 | Đề xuất Đ có hồ sơ Phê duyệt đã qua bước 12, chưa hoàn thành bước 48, luồng dự kiến MS01.02 | Mở tab | Dòng Đ: Quy trình "MS01.02 (dự kiến)" |
| AC-0247-13 | Đề xuất Đ có hồ sơ Phê duyệt Hoàn thành ở MS01.03 và hồ sơ Điều chỉnh đang xử lý, chưa qua cổng sau bước 10 | Mở tab | Dòng Đ: Quy trình "MS02" |
| AC-0247-14 | Khoản đầu tư K1 nhóm mã MS13, K2 nhóm mã MS15, K3 chưa có hồ sơ | Mở tab KĐT liên quan | Nhóm KĐT: K1 "Đơn giản", K2 "Phức tạp", K3 "-"; không dòng nào hiện mã MS13, MS15 hay chữ "Chưa xác định" |

#### DTMS_CN_0248 Xem gói thầu và hợp đồng liên quan

##### Thông tin chung chức năng

- **Mục đích:** Theo dõi các gói thầu, hợp đồng đã lập từ đề xuất mua sắm, khoản đầu tư của đề tài, kèm phần giá trị phân bổ cho đề tài khi gói thầu dùng chung nhiều nguồn.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài (BR-DADT-C-10).

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab Gói thầu / Hợp đồng.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### Màn hình

<img src="media/rId128.png" style="width:6.25in;height:3.90625in" alt="Tab Gói thầu / Hợp đồng" />

Ảnh minh họa bố cục, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 11/11/2026, đề tài DA-2026-002; bảng rộng, cuộn ngang để xem các cột còn lại. Khi khác nhau, áp dụng mục 3.1.3.2.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Khối Gói thầu** |  |  |  |  |
| 1 | Đơn vị tiền | Text | Output | "Đơn vị tiền: tỷ đồng" | Góc phải tiêu đề khối. |
| 2 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong bảng. |
| 3 | Trạng thái | Tag | Output | Theo dữ liệu | Trạng thái gói thầu theo module Lựa chọn nhà thầu. Mapping: module Lựa chọn nhà thầu. |
| 4 | Số gói thầu | Link | Input | – | Mở Chi tiết gói thầu của module Lựa chọn nhà thầu. Hạn chế xem theo BR-DADT-03-02. Mapping: module Lựa chọn nhà thầu. |
| 5 | Tên gói thầu | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: module Lựa chọn nhà thầu. |
| 6 | Nguồn | Link | Input | – | Mã các đề xuất mua sắm, khoản đầu tư liên quan là nguồn của gói, nối bằng dấu phẩy; mỗi mã mở chi tiết đối tượng đó. Mã người xem không được thấy hiện "Hạn chế xem". Mapping: module Lựa chọn nhà thầu (nguồn của gói). |
| 7 | Lĩnh vực | Text | Output | Theo dữ liệu | Tên trong danh mục của module Lựa chọn nhà thầu. Mapping: module Lựa chọn nhà thầu. |
| 8 | Hình thức LCNT | Text | Output | Theo dữ liệu | Mapping: module Lựa chọn nhà thầu. |
| 9 | Giá gói thầu | Number | Output | Theo dữ liệu | Căn phải. Mapping: module Lựa chọn nhà thầu. |
| 10 | Giá trị phân bổ | Number | Output | Theo dữ liệu | Giá trị phân bổ cho đề tài theo BR-DADT-03-02, căn phải. Mapping: Tính. |
| 11 | Giá trúng thầu | Number | Output | Theo dữ liệu | Căn phải; chưa có kết quả lựa chọn nhà thầu thì "-". Mapping: module Lựa chọn nhà thầu. |
| 12 | Người phụ trách | Text | Output | Theo dữ liệu | Họ tên. Mapping: module Lựa chọn nhà thầu. |
| 13 | KHLCNT | Link | Input | – | Mã kế hoạch lựa chọn nhà thầu chứa gói, mở chi tiết kế hoạch. Mapping: module Lựa chọn nhà thầu. |
| 14 | Số / ngày QĐ phê duyệt KHLCNT | Text | Output | Theo dữ liệu | "{số} ngày {DD/MM/YYYY}"; chưa có thì "-". Mapping: module Lựa chọn nhà thầu. |
|  | **Khối Hợp đồng** |  |  |  |  |
| 15 | Đơn vị tiền | Text | Output | "Đơn vị tiền: tỷ đồng" | Góc phải tiêu đề khối. |
| 16 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong bảng. |
| 17 | Trạng thái | Tag | Output | Theo dữ liệu | Trạng thái hợp đồng theo module Hợp đồng. Mapping: module Hợp đồng. |
| 18 | Mã hợp đồng | Link | Input | – | Mở Chi tiết hợp đồng của module Hợp đồng. Hạn chế xem theo BR-DADT-03-03. Mapping: module Hợp đồng. |
| 19 | Số hợp đồng | Text | Output | Theo dữ liệu | Chưa ký thì "-". Mapping: module Hợp đồng. |
| 20 | Tên hợp đồng | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: module Hợp đồng. |
| 21 | Gói thầu | Link | Input | – | Số gói thầu của hợp đồng, mở Chi tiết gói thầu; hợp đồng gắn trực tiếp đề tài thì "-". Mapping: module Hợp đồng. |
| 22 | Ngày ký | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Chưa ký thì "-". Mapping: module Hợp đồng. |
| 23 | Đối tác ký HĐ | Text | Output | Theo dữ liệu | Tên nhà cung cấp. Mapping: module Hợp đồng. |
| 24 | Giá trị ký HĐ | Number | Output | Theo dữ liệu | Giá trị của cả hợp đồng, căn phải. Mapping: module Hợp đồng. |
| 25 | Loại HĐ | Text | Output | Theo dữ liệu | Mapping: module Hợp đồng. |
| 26 | Người theo dõi HĐ | Text | Output | Theo dữ liệu | Họ tên. Mapping: module Hợp đồng. |

Hai bảng sắp theo BR-DADT-03-02, BR-DADT-03-03, không phân trang, cuộn ngang khi rộng hơn màn. Bảng không có dòng hiện "Chưa có gói thầu", "Chưa có hợp đồng".

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở tab Gói thầu / Hợp đồng. |
| 2 | Hệ thống kiểm tra quyền xem đề tài (BR-DADT-C-10), xác định đề xuất mua sắm, khoản đầu tư liên quan (BR-DADT-03-01), lấy gói thầu, hợp đồng liên quan từ module Lựa chọn nhà thầu, Hợp đồng (BR-DADT-03-02, BR-DADT-03-03), tính Giá trị phân bổ. |
| 3 | Người dùng bấm Số gói thầu, Nguồn, KHLCNT, Mã hợp đồng để mở chi tiết. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có gói thầu, hợp đồng | Hai bảng hiện "Chưa có gói thầu", "Chưa có hợp đồng" |
| Không tải được dữ liệu của module Lựa chọn nhà thầu | Cả hai bảng: "Không thể tải dữ liệu. Vui lòng thử lại." (hợp đồng liên quan xác định qua gói thầu) |
| Không tải được dữ liệu của module Hợp đồng | Bảng Hợp đồng: "Không thể tải dữ liệu. Vui lòng thử lại."; bảng Gói thầu vẫn hiện |
| Không còn được thấy đề tài | "Bạn không có quyền thực hiện chức năng này." Không hiện dữ liệu |

**Đồng thời:** gói thầu, hợp đồng mới hoặc đổi trạng thái trong lúc đang xem hiện ở lần mở tab sau.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0248-01 | Đề tài có đề xuất Đ1; kế hoạch lựa chọn nhà thầu lập từ Đ1 có ba gói G1, G2, G3 một nguồn | Mở tab | Bảng Gói thầu có ba dòng, Nguồn của mỗi dòng là mã Đ1, Giá trị phân bổ bằng Giá gói thầu |
| AC-0248-02 | Gói GT-2026-0040 Giá gói 5,00 tỷ đồng: nguồn Đ1 của đề tài A phân bổ 2,80 tỷ đồng, nguồn của đề tài B phân bổ 2,40 tỷ đồng | Mở tab ở đề tài A | Dòng gói: Giá gói thầu 5,00, Giá trị phân bổ 2,80, Nguồn chỉ có mã Đ1 |
| AC-0248-03 | Gói G Giá gói 3,00 tỷ đồng, có hai nguồn Đ1 và KĐT K1, cả hai thuộc đề tài A | Mở tab ở đề tài A | Một dòng G; Nguồn "{mã Đ1}, {mã K1}"; Giá trị phân bổ 3,00 (bằng Giá gói) |
| AC-0248-04 | Gói G1 có hợp đồng H1 đã ký 20/10/2026; gói G2 có hợp đồng H2 chưa ký | Mở tab | Bảng Hợp đồng: H2 trên, H1 dưới; H2 Số hợp đồng, Ngày ký "-" |
| AC-0248-05 | Gói G Đã hủy | Mở tab | Vẫn có dòng G, Trạng thái Đã hủy |
| AC-0248-06 | Gói G người xem không được thấy | Mở tab | Dòng G: Số gói thầu, Tên gói thầu "Hạn chế xem", không có liên kết; Giá gói thầu, Giá trị phân bổ vẫn hiện |
| AC-0248-07 | Đề tài chưa có gói thầu | Mở tab | "Chưa có gói thầu", "Chưa có hợp đồng" |
| AC-0248-08 | Module Hợp đồng không phản hồi | Mở tab | Bảng Gói thầu hiện bình thường; vùng bảng Hợp đồng "Không thể tải dữ liệu. Vui lòng thử lại." |
| AC-0248-09 | Có dòng gói GT-2026-0032 | Bấm Số gói thầu | Mở Chi tiết gói thầu GT-2026-0032 |
| AC-0248-10 | Module Lựa chọn nhà thầu không phản hồi | Mở tab | Cả hai bảng "Không thể tải dữ liệu. Vui lòng thử lại." |
| AC-0248-11 | Hợp đồng H người xem không được thấy, của gói G người xem cũng không được thấy | Mở tab | Dòng H: Mã, Số, Tên hợp đồng và ô Gói thầu "Hạn chế xem", không có liên kết; Đối tác, Giá trị ký hiện bình thường |

#### DTMS_CN_0249 Xem văn bản pháp lý và tải tệp

##### Thông tin chung chức năng

- **Mục đích:** Xem các văn bản pháp lý của đề tài (quyết định giao nhiệm vụ, phê duyệt đề tài, dự toán…) và tải bản ký để làm căn cứ.

- **Người dùng mục tiêu:** mọi vai trò được thấy đề tài (BR-DADT-C-10).

- **Đường dẫn truy cập:** Chi tiết đề tài / dự án \> tab Văn bản pháp lý.

- **Tiền điều kiện:**

  - Được thấy đề tài (BR-DADT-C-10).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

  - Tải tệp của đề tài Mật thì ghi nhật ký (BR-DADT-03-04).

##### Màn hình

<img src="media/rId137.png" style="width:6.25in;height:3.90625in" alt="Tab Văn bản pháp lý" />

Ảnh minh họa bố cục, chụp bằng tài khoản Chuyên viên TTMS của bản dựng thử ngày 11/11/2026. Khác ảnh: thêm cột Ghi chú; văn bản chưa có tệp thì nút tải bị mờ. Khi khác nhau, áp dụng mục 3.1.3.3.3.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong bảng. |
| 2 | Thao tác: \[Tải tệp\] | Icon | Input | – | Tooltip "Tải tệp". Tải tệp của văn bản, giữ tên tệp gốc. Văn bản chưa có tệp: nút mờ, không bấm được, tooltip "Văn bản chưa có tệp". Mapping: project_legal_doc.file_id. |
| 3 | Số văn bản | Text | Output | Theo dữ liệu | Mapping: project_legal_doc.doc_no. |
| 4 | Ngày văn bản | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: project_legal_doc.doc_date. |
| 5 | Người ký | Text | Output | Theo dữ liệu | Chức danh hoặc họ tên theo nguồn. Mapping: project_legal_doc.signer. |
| 6 | Nội dung | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: project_legal_doc.content. |
| 7 | Ghi chú | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: project_legal_doc.note. |

Bảng sắp theo BR-DADT-03-04, không phân trang. Không có văn bản thì hiện "Chưa có dữ liệu". Không có thêm, sửa, xóa văn bản (BR-DADT-C-01).

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở tab Văn bản pháp lý. |
| 2 | Hệ thống kiểm tra quyền xem đề tài (BR-DADT-C-10), tải các văn bản của đề tài (BR-DADT-03-04). |
| 3 | Người dùng bấm \[Tải tệp\] ở một dòng. |
| 4 | Hệ thống kiểm tra lại quyền xem đề tài, trả tệp; đề tài Mật thì ghi nhật ký (mục 2.3.5). Trình duyệt tải tệp. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Đề tài chưa có văn bản | Bảng hiện "Chưa có dữ liệu" |
| Không tải được danh sách | Tại vùng bảng: "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Tải tệp lỗi, tệp không còn trên kho lưu trữ | Toast: "Không thể tải tệp. Vui lòng thử lại." |
| Không còn được thấy đề tài khi mở tab hoặc bấm tải | "Bạn không có quyền thực hiện chức năng này." Không hiện dữ liệu, không trả tệp; đề tài Mật thì ghi nhật ký lần tải bị từ chối |

**Đồng thời:** lần đồng bộ thay tệp của văn bản trong lúc đang xem thì \[Tải tệp\] trả tệp mới nhất tại thời điểm bấm.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0249-01 | Đề tài 004-26-VHT-RDP-DS có văn bản 9050/QĐ-VHT ngày 08/05/2026 và 8952B/QĐ-VHT ngày 07/05/2026 | Mở tab | Hai dòng, 8952B/QĐ-VHT trên, 9050/QĐ-VHT dưới |
| AC-0249-02 | Văn bản 8952B/QĐ-VHT có tệp "8952B-QĐ-VHT.pdf" | Bấm \[Tải tệp\] | Tải về tệp "8952B-QĐ-VHT.pdf" |
| AC-0249-03 | Văn bản chưa có tệp | Xem dòng | Nút tải mờ, tooltip "Văn bản chưa có tệp", bấm không tải |
| AC-0249-04 | Đề tài Mật, người xem được thấy đề tài | Bấm \[Tải tệp\] | Tải được; nhật ký có người, thời điểm, số văn bản |
| AC-0249-05 | Đề tài không Mật | Bấm \[Tải tệp\] | Tải được, không ghi nhật ký tải |
| AC-0249-06 | Tệp đã bị xóa khỏi kho lưu trữ | Bấm \[Tải tệp\] | Toast "Không thể tải tệp. Vui lòng thử lại." |
| AC-0249-07 | Đề tài chưa có văn bản | Mở tab | "Chưa có dữ liệu" |
| AC-0249-08 | Văn bản có Ghi chú dài hơn 2 dòng | Rê chuột vào ô Ghi chú | Hiện tooltip đủ nội dung |
| AC-0249-09 | Chuyên viên đơn vị đề xuất mở tab | Xem tab | Không có nút thêm, sửa, xóa văn bản; có \[Tải tệp\] |
| AC-0249-10 | Đề tài Mật; người xem vừa bị gỡ khỏi nhóm được thấy | Bấm \[Tải tệp\] | "Bạn không có quyền thực hiện chức năng này.", không có tệp; nhật ký có hành động Tải tệp – từ chối |
| AC-0249-11 | Văn bản A ngày 07/05/2026, văn bản B không có ngày | Mở tab | A trên, B dưới |

### Nguồn dữ liệu

Đề tài / dự án vào ĐTMS bằng đồng bộ (BR-DADT-C-01): từ phân hệ Quản lý Khoa học công nghệ (DTMS_CN_0250) và từ HR Tool (theo tài liệu thiết kế Đồng bộ đề tài / dự án). Đề tài / dự án đang thực hiện trên hệ thống cũ chuyển một lần khi đưa hệ thống vào sử dụng. ĐTMS không có chức năng nhập đề tài / dự án từ tệp. Các đường cùng ghi vào một bộ dữ liệu (thông tin chung, phê duyệt, dự toán, văn bản pháp lý) và cùng giữ dữ liệu ĐTMS sở hữu (BR-DADT-C-03). Đề tài, khoản mục không bị xóa cứng (BR-DADT-C-09). Lần đồng bộ có trạng thái theo mục 2.3.1.3 và xem lại được ở màn Quản trị \> Đồng bộ đề tài / dự án.

**Điểm giao tiếp với phân hệ Quản lý Khoa học công nghệ.** Đặc tả giao tiếp phía phân hệ chưa có (mục 2.2). Tài liệu này quy định phía ĐTMS theo phương án tạm: ĐTMS gọi dịch vụ của phân hệ (kéo dữ liệu), xác thực bằng tài khoản dịch vụ cấu hình ở hệ thống. Khi có đặc tả, chỉ thay cách lấy dữ liệu ở bước 2 của DTMS_CN_0250; quy tắc khớp, ghi, lỗi giữ nguyên.

| Mã | Điểm giao tiếp | Vào | Ra |
|----|----|----|----|
| GT-01 | Danh sách đề tài thay đổi | Mốc thời điểm (rỗng là toàn bộ); trang | Mã đề tài, thời điểm cập nhật ở nguồn, của các đề tài Loại Khoa học công nghệ thay đổi từ mốc |
| GT-02 | Chi tiết đề tài | Mã đề tài | Thông tin chung, phê duyệt, dự toán (từng khoản mục kèm mã khoản mục ở nguồn), văn bản pháp lý (kèm mã văn bản, mã tệp ở nguồn) theo bảng trường ở mục 3.1.4.1.3 |
| GT-03 | Tải tệp văn bản | Mã tệp ở nguồn | Nội dung tệp, tên tệp |

Quy tắc của nghiệp vụ 3.1.4:

| Mã | Quy tắc |
|----|----|
| BR-DADT-04-01 | **Cách chạy đồng bộ.** Hệ thống chạy theo lịch (mục 2.3.6); Quản trị chạy thêm bằng \[Đồng bộ ngay\] với một trong ba phạm vi: **Thay đổi từ mốc** (mặc định), **Toàn bộ** (mọi đề tài của nguồn, bỏ mốc), **Một đề tài** (theo Mã đề tài). Hệ thống có hai lịch (mục 2.3.6): lịch đồng bộ dùng phạm vi Thay đổi từ mốc; lịch rà soát toàn bộ dùng phạm vi Toàn bộ, để phát hiện đề tài không còn ở nguồn (BR-DADT-04-02). **Mốc** là thời điểm bắt đầu của lần gần nhất có phạm vi Thay đổi từ mốc hoặc Toàn bộ đã lấy đủ danh sách thay đổi từ nguồn (GT-01) và kết thúc Thành công hoặc Có lỗi; chưa có lần nào như vậy thì lấy toàn bộ. Lần Một đề tài không đổi mốc. Ngoài các đề tài thay đổi, lần Thay đổi từ mốc lấy lại mọi đề tài còn lỗi chưa đóng của các lần trước (BR-DADT-04-03) và tải lại tệp của mọi văn bản pháp lý có mã tệp ở nguồn mà chưa có tệp trên ĐTMS (GT-03). Tại một thời điểm chỉ có một lần đồng bộ chạy: tới lịch mà đang có lần chạy thì bỏ qua lượt lịch đó, ghi nhật ký; Quản trị bấm khi đang có lần chạy thì báo "Đang có lần đồng bộ chạy. Vui lòng chờ lần này kết thúc." **Thử lại:** không lấy được danh sách (GT-01), hoặc chi tiết đề tài ở phạm vi Một đề tài (GT-02), do lỗi kết nối, hết thời gian chờ, lỗi xác thực thì gọi lại theo tham số ở mục 2.3.6 (sau lần gọi đầu, thử lại đủ số lần của tham số); hết lần thử thì lần Thất bại, mốc không đổi. Lỗi khi lấy chi tiết từng đề tài ở phạm vi khác không thử lại trong lần: ghi lỗi đề tài, lấy lại ở lần sau. **Lần bị gián đoạn:** lần Đang chạy quá thời gian chạy tối đa (mục 2.3.6), hoặc lần Đang chạy không còn tiến trình xử lý (dấu hiệu sống quá 10 phút không cập nhật, hoặc khi khởi động lại dịch vụ), thì đặt Thất bại, lỗi chung "Lần đồng bộ bị gián đoạn."; đề tài đã ghi giữ nguyên; lần không dùng làm mốc; thông báo theo BR-DADT-04-04 |
| BR-DADT-04-02 | **Khớp và ghi đề tài khi đồng bộ.** Khớp theo Mã đề tài (BR-DADT-C-02). Chưa có trên ĐTMS: thêm mới, Nguồn dữ liệu Đồng bộ Khoa học công nghệ. Đã có, Nguồn dữ liệu Đồng bộ Khoa học công nghệ: cập nhật. Đã có, Loại Khoa học công nghệ, Nguồn dữ liệu Chuyển từ hệ thống cũ: cập nhật và đổi Nguồn dữ liệu thành Đồng bộ Khoa học công nghệ (**đồng bộ tiếp quản**); khoản mục khớp theo Mã khoản mục (BR-DADT-04-05), nên Chi mua sắm, đánh dấu Hoàn thành, liên kết hạng mục giữ nguyên trên khoản mục khớp được; nhật ký ghi "Đồng bộ tiếp quản". **Không tiếp quản** khi đề tài có khoản mục đã liên kết hạng mục của đề xuất mua sắm, khoản đầu tư mà Mã khoản mục không có trong dự toán nguồn gửi: lỗi bản ghi "Khoản mục đã bóc tách {danh sách mã khoản mục} không có trong dự toán nguồn. Vui lòng đối chiếu Mã khoản mục với phân hệ Quản lý Khoa học công nghệ.", đề tài giữ như trước, Nguồn dữ liệu vẫn Chuyển từ hệ thống cũ; lỗi chưa đóng nên lần đồng bộ sau lấy lại, nguồn gửi đủ Mã khoản mục đã bóc tách thì tiếp quản (BR-DADT-04-03). Nguồn không gửi phần dự toán thì vẫn tiếp quản, dự toán giữ nguyên (BR-DADT-04-05). Đã có với Loại khác: lỗi bản ghi "Mã dự án / đề tài đã có trên ĐTMS với Loại {Loại}.", không ghi. Nguồn trả đề tài không phải Loại Khoa học công nghệ: lỗi bản ghi "Đề tài / dự án không thuộc Loại Khoa học công nghệ.". Trường nhận từ nguồn ghi đúng giá trị nguồn, kể cả khi nguồn để trống; không ghi Chi mua sắm, đánh dấu Hoàn thành (BR-DADT-C-03). Đề tài mà mọi trường nhận về trùng dữ liệu ĐTMS đang có thì không ghi, tính là Không đổi. Đề tài được ghi thì Cập nhật từ nguồn lúc là thời điểm ghi. Đề tài có trên ĐTMS mà lần Toàn bộ không còn thấy ở nguồn: giữ nguyên (BR-DADT-C-09), chi tiết lần ghi Cảnh báo "Không còn ở nguồn."; đề tài Nguồn dữ liệu Đồng bộ Khoa học công nghệ được đánh dấu **Không còn ở nguồn**, ghi thời điểm phát hiện lần đầu (lần Toàn bộ sau vẫn không thấy thì giữ thời điểm cũ): không chọn mới được làm căn cứ, không bóc tách thêm khoản mục (BR-DADT-C-04, BR-DADT-C-05); đề xuất mua sắm, khoản đầu tư đang dùng không bị dừng (BR-DADT-C-09). Chỉ lần Toàn bộ đã lấy đủ danh sách (GT-01) mới đánh dấu; lần Thay đổi từ mốc, Một đề tài, lần Thất bại không đánh dấu. Lần đồng bộ sau (mọi phạm vi) nhận lại đề tài từ nguồn thì bỏ đánh dấu, chi tiết lần ghi Cảnh báo "Đã có lại ở nguồn."; nhật ký ghi cả hai lần đổi (mục 2.3.5) |
| BR-DADT-04-03 | **Đơn vị ghi và lỗi bản ghi.** Mỗi đề tài cùng dự toán và văn bản pháp lý của nó ghi trong một giao dịch: đủ điều kiện thì ghi cả, có một lỗi ở bất kỳ phần nào thì không ghi phần nào, đề tài giữ như trước. Lỗi của một đề tài không dừng lần chạy. Lỗi ghi kèm Mã đề tài, phần lỗi (thông tin chung, khoản mục {mã khoản mục}, văn bản {số văn bản}) và nội dung. **Trạng thái lần:** mọi đề tài ghi được hoặc Không đổi thì Thành công; có đề tài lỗi thì Có lỗi; không lấy được danh sách thay đổi (GT-01) sau mọi lần thử lại, không lấy được chi tiết đề tài ở phạm vi Một đề tài sau mọi lần thử lại, hoặc lần bị gián đoạn (BR-DADT-04-01), thì Thất bại. Có lỗi gồm cả trường hợp không đề tài nào ghi được. Mất kết nối giữa chừng sau khi đã ghi một phần: đề tài đã ghi giữ nguyên; đề tài chưa lấy được ghi lỗi "Không lấy được dữ liệu từ nguồn."; lần là Có lỗi. Lỗi của lần đồng bộ **đóng** khi: đề tài đó được ghi hoặc Không đổi ở một lần đồng bộ sau; lấy lại mà nguồn không còn đề tài (GT-02 không tìm thấy), khi đó chi tiết lần ghi Cảnh báo "Không tìm thấy ở nguồn khi lấy lại."; hoặc Quản trị bấm \[Bỏ qua lỗi\] kèm lý do. Lỗi đã đóng không được lấy lại. Lần phạm vi Một đề tài không tìm thấy mã ở nguồn luôn ghi Lỗi, không đóng lỗi cũ của mã đó. Ô chữ vượt độ dài tối đa của trường là lỗi "{Tên trường} không được vượt quá {n} ký tự.", không cắt bớt (cắt bớt ở mục 4.1, 4.5.4 chỉ áp cho ô nhập trên màn) |
| BR-DADT-04-04 | **Thông báo khi đồng bộ.** Lần đồng bộ kết thúc Thất bại, hoặc Có lỗi mà có ít nhất một đề tài lỗi mới (đề tài không còn lỗi chưa đóng từ lần trước): gửi thông báo trong hệ thống tới mọi người có vai trò Quản trị hệ thống và TTMS; lỗi lặp lại của đề tài đang có lỗi chưa đóng không gửi lại. Tiêu đề "Đồng bộ đề tài / dự án thất bại" hoặc "Đồng bộ đề tài / dự án có lỗi"; nội dung "Lần đồng bộ {Mã lần} bắt đầu lúc {DD/MM/YYYY HH:mm}: {n} đề tài / dự án lỗi."; Thất bại thì nội dung "Lần đồng bộ {Mã lần} bắt đầu lúc {DD/MM/YYYY HH:mm} không lấy được dữ liệu từ phân hệ Quản lý Khoa học công nghệ.", riêng lần bị gián đoạn "Lần đồng bộ {Mã lần} bắt đầu lúc {DD/MM/YYYY HH:mm} bị gián đoạn."; liên kết tới chi tiết lần. Sau một lần đồng bộ, đề tài có khoản mục chuyển sang Còn lại khả dụng âm (giá trị hoặc số lượng, BR-DADT-C-07, BR-DADT-C-09): gửi một thông báo cho mỗi đề tài tới người có vai trò TTMS được thấy đề tài (BR-DADT-C-10), tiêu đề "Khoản mục vượt phần đã dùng", nội dung "Đề tài / dự án {Mã đề tài} có {n} khoản mục Còn lại khả dụng âm sau cập nhật từ nguồn.", liên kết tới tab Dự toán chi phí. Lần Toàn bộ có đề tài mới bị đánh dấu Không còn ở nguồn (BR-DADT-04-02): gửi một thông báo tới mọi người có vai trò Quản trị hệ thống và TTMS, tiêu đề "Đề tài / dự án không còn ở nguồn", nội dung "Lần đồng bộ {Mã lần}: {n} đề tài / dự án không còn ở phân hệ Quản lý Khoa học công nghệ.", liên kết tới chi tiết lần |
| BR-DADT-04-05 | **Dự toán khi đồng bộ.** Khoản mục khớp theo Mã khoản mục của nguồn trong cùng đề tài. Có ở nguồn, chưa có trên ĐTMS: thêm, Chi mua sắm theo BR-DADT-C-03, Hiệu lực Còn hiệu lực. Có ở cả hai: cập nhật Loại chi phí, Tên, ĐVT, Số lượng, Đơn giá, Giá trị trước thuế, %VAT, Thuế GTGT, Giá trị sau thuế, Ghi chú, thứ tự; khoản mục Ngừng sử dụng về Còn hiệu lực (BR-DADT-02-03). Có trên ĐTMS, không còn trong dự toán nguồn gửi: Hiệu lực Ngừng sử dụng (BR-DADT-C-09). Nguồn không gửi phần dự toán của đề tài: dự toán trên ĐTMS giữ nguyên. Nguồn gửi phần dự toán là danh sách rỗng: mọi khoản mục Ngừng sử dụng. Thứ tự khoản mục theo nguồn; nguồn không gửi thì theo thứ tự trong danh sách của GT-02. Thuế GTGT để trống thì tính = Giá trị trước thuế × %VAT / 100, làm tròn tới đồng (từ 0,5 làm tròn lên); %VAT để trống là 0; Giá trị sau thuế để trống thì tính = Giá trị trước thuế + Thuế GTGT. Có đủ ba giá trị mà Giá trị sau thuế lệch Giá trị trước thuế + Thuế GTGT quá 1 đồng thì lỗi khoản mục "Giá trị sau thuế phải bằng Giá trị trước thuế cộng Thuế GTGT.". Giá trị tiền có phần lẻ thì làm tròn tới đồng. Loại chi phí phải có trong danh mục Loại chi phí (theo bảng ánh xạ mã của nguồn); không có thì lỗi khoản mục "Loại chi phí {giá trị} không có trong danh mục." Giá trị, số lượng giảm làm Còn lại khả dụng âm: vẫn ghi, theo BR-DADT-C-09 và BR-DADT-04-04 |
| BR-DADT-04-06 | **Không sửa chéo nguồn.** Đề tài Loại khác Khoa học công nghệ không cập nhật được bằng đồng bộ từ phân hệ Quản lý Khoa học công nghệ (BR-DADT-04-02); đồng bộ từ HR Tool theo tài liệu thiết kế Đồng bộ đề tài / dự án. Đề tài Chuyển từ hệ thống cũ Loại Khoa học công nghệ thì đồng bộ tiếp quản (BR-DADT-04-02). ĐTMS không có cách nào khác để thêm, sửa thông tin chung, dự toán của đề tài (BR-DADT-C-01) |
| BR-DADT-04-10 | **Đề tài Mật trong đồng bộ** (BR-DADT-C-10). Ở chi tiết lần đồng bộ: đề tài Mật mà người xem không được thấy hiện Mã và Tên "Hạn chế xem", nội dung lỗi không nêu giá trị trường. Thông báo lần đồng bộ (BR-DADT-04-04) chỉ nêu số đề tài lỗi, không nêu mã. Đề tài Mật đồng bộ về mà Đơn vị lập không khớp cơ cấu tổ chức thì lỗi bản ghi "Đơn vị lập {giá trị} không có trong cơ cấu tổ chức.", để không mất phạm vi xem theo đơn vị |

#### DTMS_CN_0250 Đồng bộ đề tài / dự án Loại Khoa học công nghệ

##### Thông tin chung chức năng

- **Mục đích:** Đưa đề tài / dự án Loại Khoa học công nghệ cùng dự toán, văn bản pháp lý từ phân hệ Quản lý Khoa học công nghệ vào ĐTMS và giữ cập nhật, để đề xuất mua sắm, khoản đầu tư dùng làm căn cứ; cho Quản trị chạy lại và theo dõi kết quả từng lần.

- **Người dùng mục tiêu:** Hệ thống (chạy theo lịch); Quản trị hệ thống (Đồng bộ ngay, xem); TTMS (xem). Mục 2.3.2.

- **Đường dẫn truy cập:** Quản trị \> Đồng bộ đề tài / dự án, tab Lần đồng bộ.

- **Tiền điều kiện:**

  - Tài khoản dịch vụ, địa chỉ dịch vụ của phân hệ Quản lý Khoa học công nghệ đã cấu hình.

  - Bảng ánh xạ mã danh mục của nguồn (Loại chi phí, Nguồn vốn, Cấp phê duyệt, các danh mục ở bảng trường) đã cấu hình ở Danh mục dùng chung.

- **Hậu điều kiện:**

  - Đề tài thay đổi ở nguồn được thêm, cập nhật trên ĐTMS theo BR-DADT-04-02, BR-DADT-04-05; đề tài lỗi giữ như trước (BR-DADT-04-03).

  - Lần đồng bộ ghi trạng thái, số liệu, chi tiết lỗi; nhật ký theo mục 2.3.5; thông báo theo BR-DADT-04-04.

##### Màn hình

Chưa có màn tương ứng. Bố cục theo khuôn màn danh sách của hệ thống (mục 4.2 – 4.4): khối Trạng thái đồng bộ ở trên, tab Lần đồng bộ gồm khối lọc và bảng; chi tiết lần mở trong hộp thoại.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Khối Trạng thái đồng bộ** |  |  |  |  |
| 1 | Lịch đồng bộ | Text | Output | Theo tham số | "Hằng ngày lúc {HH:mm}" theo mục 2.3.6. |
| 2 | Lần gần nhất | Text | Output | Theo dữ liệu | "{Mã lần} – {DD/MM/YYYY HH:mm} – {Trạng thái}"; trạng thái là Tag theo mục 2.3.1.3. Chưa có lần nào: "-". Mapping: project_sync_run.code, .started_at, .status. |
| 3 | Mốc lấy thay đổi | Datetime \[DD/MM/YYYY HH:mm\] | Output | Theo dữ liệu | Mốc của lần Thay đổi từ mốc tiếp theo (BR-DADT-04-01). Chưa có mốc: "Lần tới lấy toàn bộ". Mapping: Tính từ project_sync_run.started_at, .list_complete, .scope. |
| 4 | Đề tài còn lỗi | Number | Output | Theo dữ liệu | Số Mã đề tài có lỗi đồng bộ chưa đóng (BR-DADT-04-03); bấm vào thì lọc bảng chi tiết các lỗi đó. Mapping: Tính từ project_sync_issue.resolved. |
| 5 | \[Đồng bộ ngay\] | Button | Input | – | Chỉ vai trò Quản trị hệ thống. Mở hộp thoại Đồng bộ ngay. Khóa khi đang có lần đồng bộ chạy, tooltip "Đang có lần đồng bộ chạy". |
|  | **Hộp thoại Đồng bộ ngay** |  |  |  |  |
| 6 | Phạm vi | Radio | Input | Thay đổi từ mốc | Thay đổi từ mốc, Toàn bộ, Một đề tài (BR-DADT-04-01). Mapping: project_sync_run.scope. |
| 7 | Mã dự án / đề tài | Textbox \[50\] | Input | Rỗng | Chỉ hiện và bắt buộc khi Phạm vi là Một đề tài. Rỗng: "Vui lòng nhập Mã dự án / đề tài." Mapping: project_sync_run.scope_code. |
| 8 | \[Đồng bộ\], \[Hủy\] | Button | Input | – | \[Đồng bộ\]: kiểm tra, tạo lần đồng bộ, đóng hộp thoại, bảng có dòng mới trạng thái Đang chạy. \[Hủy\]: đóng, không chạy. |
|  | **Tab Lần đồng bộ – lọc** |  |  |  |  |
| 9 | Bắt đầu từ ngày, đến ngày | Datepicker \[DD/MM/YYYY\] | Input | Rỗng | Khoảng ngày trên thời điểm Bắt đầu, tính cả hai đầu. Đến nhỏ hơn Từ: lỗi tại ô "Đến ngày phải lớn hơn hoặc bằng Từ ngày." Mapping: project_sync_run.started_at. |
| 10 | Trạng thái | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. Giá trị theo mục 2.3.1.3. Mapping: project_sync_run.status. |
| 11 | \[Tìm kiếm\], \[Đặt lại\] | Button | Input | – | Theo mục 4.3. |
|  | **Tab Lần đồng bộ – bảng** |  |  |  |  |
| 12 | STT | Number | Output | Theo dữ liệu | Theo mục 4.4.3. |
| 13 | Mã lần | Link | Input | – | DB-YYYY-NNNNN, hệ thống sinh, không dùng lại. Mở hộp thoại Chi tiết lần đồng bộ. Mapping: project_sync_run.code. |
| 14 | Cách chạy | Text | Output | Theo dữ liệu | Theo lịch, Thủ công. Mapping: project_sync_run.trigger_type. |
| 15 | Phạm vi | Text | Output | Theo dữ liệu | Thay đổi từ mốc, Toàn bộ, "Một đề tài: {Mã}". Mapping: project_sync_run.scope, .scope_code. |
| 16 | Người chạy | Text | Output | Theo dữ liệu | "Hệ thống" hoặc họ tên Quản trị. Mapping: project_sync_run.created_by. |
| 17 | Bắt đầu, Kết thúc | Datetime \[DD/MM/YYYY HH:mm:ss\] | Output | Theo dữ liệu | Đang chạy thì Kết thúc "-". Mapping: project_sync_run.started_at, .ended_at. |
| 18 | Trạng thái | Tag | Output | Theo dữ liệu | Theo mục 2.3.1.3: Đang chạy xanh dương, Thành công xanh lá, Có lỗi vàng, Thất bại đỏ. Mapping: project_sync_run.status. |
| 19 | Lấy về, Thêm mới, Cập nhật, Không đổi, Lỗi | Number | Output | Theo dữ liệu | Số đề tài theo kết quả (BR-DADT-04-02, BR-DADT-04-03). Lấy về gồm đề tài lấy lại; Lấy về = Thêm mới + Cập nhật + Không đổi + Lỗi. Mapping: project_sync_run.fetched_count, .added_count, .updated_count, .unchanged_count, .error_count. |
| 20 | Khoản mục ngừng sử dụng | Number | Output | Theo dữ liệu | Số khoản mục chuyển Ngừng sử dụng ở lần này (BR-DADT-04-05). Mapping: project_sync_run.inactive_item_count. |
|  | **Hộp thoại Chi tiết lần đồng bộ** |  |  |  |  |
| 21 | Thông tin lần | Text | Output | Theo dữ liệu | Các ô 13 – 20, mốc đã dùng, số lần thử lại, lỗi chung của lần (khi Thất bại). Mapping: project_sync_run.since_at, .retry_count, .error_message. |
| 22 | Kết quả | Dropdown nhiều lựa chọn | Input | Lỗi, Cảnh báo | Lọc bảng ô 23: Thêm mới, Cập nhật, Lỗi, Cảnh báo. |
| 23 | Bảng chi tiết | Data Grid | Output | Theo dữ liệu | Cột: Mã dự án / đề tài (link mở DTMS_CN_0242 khi đề tài có trên ĐTMS và người xem được thấy), Tên, Kết quả, Phần (Thông tin chung, Khoản mục {mã}, Văn bản {số}), Nội dung, Đã đóng (Có / Không, chỉ với dòng Lỗi), Thao tác. Sắp theo Kết quả (Lỗi, Cảnh báo, Thêm mới, Cập nhật) rồi Mã. Phân trang theo mục 4.4. Đề tài Mật người xem không được thấy: theo BR-DADT-04-10. Mapping: project_sync_issue.project_code, .project_name, .result, .part, .message, .resolved. |
| 24 | \[Bỏ qua lỗi\] | Icon Button | Input | – | Chỉ Quản trị hệ thống, ở dòng Lỗi chưa đóng. Mở hộp thoại tiêu đề "Bỏ qua lỗi", ô Lý do (Textarea \[500\], bắt buộc: "Vui lòng nhập Lý do."), nút \[Đồng ý\], \[Hủy\]. Đồng ý: lỗi đóng, không lấy lại nữa, ghi người, thời điểm, lý do, nhật ký; Toast "Cập nhật lỗi đồng bộ thành công.". Mapping: project_sync_issue.resolved_by, .resolved_at, .resolve_note. |
| 25 | \[Đóng\] | Button | Input | – | Đóng hộp thoại. |

Bảng lần đồng bộ sắp Bắt đầu giảm dần, phân trang theo mục 4.4. Bảng và khối trạng thái tự tải lại mỗi 30 giây khi có lần Đang chạy.

**Bảng trường nhận từ nguồn.** Cột "Bắt buộc" là bắt buộc phải có giá trị trong dữ liệu nguồn; thiếu thì lỗi bản ghi "Thiếu {Tên trường}." (BR-DADT-04-03).

| STT | Nhóm | Trường | Mapping | Bắt buộc | Xử lý khi nhận |
|----|----|----|----|----|----|
| 1 | Định danh | Mã dự án / đề tài | project.code | Có | Tối đa 50 ký tự. Khớp theo BR-DADT-C-02, BR-DADT-04-02 |
| 2 | Định danh | Loại dự án / đề tài | project.type_code | Có | Phải là Khoa học công nghệ (BR-DADT-04-02) |
| 3 | Định danh | Tên dự án / đề tài | project.name | Có | Tối đa 500 ký tự |
| 4 | Định danh | Trạng thái | project.status | Có | Ánh xạ về một trong ba giá trị ở mục 2.3.1.1; không ánh xạ được: lỗi bản ghi |
| 5 | Định danh | Mật | project.secret | Có | Có / Không. Thiếu thì không ghi, để không đưa đề tài Mật ra mọi người dùng (BR-DADT-C-10) |
| 6 | Đơn vị, người | Đơn vị lập | project.unit_id | Không | Khớp đơn vị trong cơ cấu tổ chức; không khớp: để trống, cảnh báo "Đơn vị lập {giá trị} không có trong cơ cấu tổ chức."; đề tài Mật thì lỗi bản ghi (BR-DADT-04-10) |
| 7 | Đơn vị, người | Chủ nhiệm, Người phụ trách báo cáo | project.owner_user_id, .owner_name, .reporter_user_id, .reporter_name | Không | Tên đăng nhập khớp tài khoản thì ghi tài khoản; luôn ghi họ tên theo nguồn (BR-DADT-01-08) |
| 8 | Danh mục | Loại dự án (chi tiết), Cấp phê duyệt, Nhóm dự án, Loại sản phẩm, Nguồn vốn, Lĩnh vực, Tình trạng pháp lý, Tình trạng mua sắm | project.type_detail_code, .approval_level_code, .group_code, .product_type_code, .fund_code, .field_code, .legal_status_code, .purchase_status_code | Không | Ánh xạ mã nguồn về mã danh mục; không ánh xạ được: để trống, cảnh báo "{Tên trường} {giá trị} không có trong danh mục." |
| 9 | Mã khác | Mã dự án theo KHĐT năm, Mã dự án SAP, ID dự án trên cổng Đấu thầu QG, Mã dự án Mật, Mã dự án / đề tài cũ | project.plan_code, .sap_code, .portal_id, .secret_code, .previous_code | Không | Tối đa 50 ký tự; Mã dự án Mật chỉ ghi khi Mật = Có. Mã cũ theo BR-DADT-C-02: trùng Mã của chính đề tài thì không ghi, cảnh báo "Mã cũ trùng Mã dự án / đề tài."; chưa có trên ĐTMS thì vẫn ghi, cảnh báo "Mã cũ {giá trị} không có trên ĐTMS." |
| 10 | Mô tả | Lập theo kế hoạch năm, Nội dung, quy mô dự án, Địa điểm đầu tư, Ngày nghiệm thu | project.annual_plan, .scope, .location, .accepted_on | Không | Ghi nguyên văn |
| 11 | Thời gian | Thời gian bắt đầu, kết thúc (nhãn, ngày) | project.start_label, .start_date, .end_label, .end_date | Không | Theo BR-DADT-01-03; ngày sai định dạng: lỗi bản ghi; ngày kết thúc nhỏ hơn ngày bắt đầu: cảnh báo "Thời gian kết thúc nhỏ hơn thời gian bắt đầu." |
| 12 | Giá trị | Tổng dự toán, Tổng giá trị đầu tư mua sắm, Giá trị quyết toán | project.total_estimate, .total_procurement, .settlement_value | Không | Đồng, không âm; âm hoặc không phải số: lỗi bản ghi. Dùng khi chưa có dự toán chi tiết (BR-DADT-01-04). Tổng giá trị đầu tư mua sắm lớn hơn Tổng dự toán: cảnh báo "Tổng giá trị đầu tư mua sắm lớn hơn Tổng dự toán." |
| 13 | Phê duyệt | Số, ngày TTr chủ trương, QĐ phê duyệt dự án, dự toán, quyết toán; người phê duyệt | project.policy_no, .policy_date, .decision_no, .decision_date, .estimate_decision_no, .estimate_decision_date, .settlement_decision_no, .settlement_decision_date, .policy_approver, .project_approver, .estimate_approver, .settlement_approver | Không | Ngày sai định dạng: lỗi bản ghi |
| 14 | Dự toán | Mã khoản mục, Loại chi phí, Khoản mục chi phí, Giá trị trước thuế | project_cost_item.source_key, .cost_type_code, .name, .pre_tax | Có, với mỗi khoản mục | Mã khoản mục tối đa 100 ký tự, Tên 500 ký tự. Theo BR-DADT-04-05 |
| 15 | Dự toán | ĐVT, Số lượng, Đơn giá, %VAT, Thuế GTGT, Giá trị sau thuế, Ghi chú, thứ tự, cờ cần mua sắm | project_cost_item.uom, .quantity, .unit_price, .vat_rate, .tax, .value, .note, .sort_no, .source_procurement | Không | Theo BR-DADT-04-05, BR-DADT-C-03. Số âm: lỗi khoản mục. ĐVT không ánh xạ được: để trống, cảnh báo |
| 16 | Văn bản pháp lý | Mã văn bản, Số, Ngày, Người ký, Nội dung, Ghi chú | project_legal_doc.source_key, .doc_no, .doc_date, .signer, .content, .note | Mã văn bản: Có | Mã văn bản tối đa 100 ký tự. Khớp theo Mã văn bản trong đề tài; văn bản không còn ở nguồn thì không hiện ở tab Văn bản pháp lý nữa |
| 17 | Văn bản pháp lý | Tệp | project_legal_doc.file_id, .file_name | Không | ĐTMS tải tệp về kho tệp (GT-03) khi văn bản mới hoặc mã tệp đổi. Tải lỗi: văn bản vẫn ghi, chưa có tệp, cảnh báo "Không tải được tệp của văn bản {Số}."; lần đồng bộ sau tải lại |

Trường ĐTMS tính hoặc sở hữu không nhận từ nguồn: Khối đơn vị, Số ngày còn thực hiện, Chi mua sắm, đánh dấu Hoàn thành, Hiệu lực khoản mục, Nguồn dữ liệu, Cập nhật từ nguồn lúc, Không còn ở nguồn.

##### Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Tới lịch, hoặc Quản trị bấm \[Đồng bộ ngay\], chọn Phạm vi, bấm \[Đồng bộ\]. Hệ thống kiểm tra không có lần đang chạy, tạo lần đồng bộ trạng thái Đang chạy, ghi mốc dùng cho lần này (BR-DADT-04-01). |
| 2 | Hệ thống lấy danh sách đề tài thay đổi từ mốc (GT-01), thêm các đề tài còn lỗi chưa đóng và văn bản chưa có tệp (BR-DADT-04-01); phạm vi Một đề tài thì chỉ lấy mã đó. Lấy đủ danh sách thì đánh dấu lần đã lấy đủ. |
| 3 | Với từng đề tài: lấy chi tiết (GT-02); kiểm tra theo bảng trường nhận từ nguồn, BR-DADT-04-02, BR-DADT-04-05; khớp theo Mã; ghi trong một giao dịch (BR-DADT-04-03); tải tệp văn bản mới (GT-03); ghi kết quả, cảnh báo, lỗi vào chi tiết lần; đóng các lỗi cũ của đề tài theo BR-DADT-04-03 (ghi được, Không đổi, không tìm thấy ở nguồn khi lấy lại). |
| 4 | Hệ thống tính lại phần khả dụng của khoản mục đã đổi (BR-DADT-C-07), ghi nhật ký khoản mục âm (BR-DADT-C-09). |
| 5 | Hệ thống kết thúc lần, đặt trạng thái theo BR-DADT-04-03, ghi số liệu, ghi nhật ký (mục 2.3.5), gửi thông báo theo BR-DADT-04-04. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bấm \[Đồng bộ\] khi đang có lần chạy (người khác vừa chạy) | "Đang có lần đồng bộ chạy. Vui lòng chờ lần này kết thúc." Không tạo lần mới |
| Phạm vi Một đề tài, nguồn không có mã đó | Lần Có lỗi, chi tiết lỗi "Không tìm thấy đề tài / dự án {Mã} ở phân hệ Quản lý Khoa học công nghệ." |
| Không kết nối được, hết thời gian chờ, lỗi xác thực khi lấy danh sách, hoặc khi lấy chi tiết ở phạm vi Một đề tài | Thử lại theo mục 2.3.6; hết lần thử: lần Thất bại, ghi lỗi chung "Không lấy được dữ liệu từ phân hệ Quản lý Khoa học công nghệ: {nguyên nhân}.", mốc không đổi, thông báo theo BR-DADT-04-04 |
| Mất kết nối khi đang lấy chi tiết | Theo BR-DADT-04-03: đề tài đã ghi giữ nguyên, đề tài còn lại lỗi "Không lấy được dữ liệu từ nguồn.", lần Có lỗi |
| Bản ghi thiếu trường bắt buộc, sai định dạng, Loại khác, Mã đã có với Loại khác | Lỗi bản ghi theo bảng trường và BR-DADT-04-02; đề tài không ghi |
| Khoản mục lỗi (số âm, thiếu tên, Loại chi phí không có, sai giá trị sau thuế, trùng mã khoản mục) | Lỗi bản ghi, phần "Khoản mục {mã}"; cả đề tài không ghi (BR-DADT-04-03) |
| Trường danh mục, đơn vị, ĐVT không ánh xạ được; tải tệp văn bản lỗi | Cảnh báo; đề tài vẫn ghi, trường đó để trống |
| Lần Đang chạy quá thời gian chạy tối đa, hoặc dịch vụ khởi động lại giữa lần | Lần Thất bại "Lần đồng bộ bị gián đoạn." (BR-DADT-04-01); \[Đồng bộ ngay\] mở lại |
| Lượt lịch tới khi lần trước chưa kết thúc | Bỏ qua lượt, ghi nhật ký "Bỏ qua lượt đồng bộ theo lịch do lần {Mã lần} đang chạy." |
| Người dùng không còn vai trò Quản trị hệ thống khi bấm \[Đồng bộ\] | "Bạn không có quyền thực hiện chức năng này." Không tạo lần |
| Không tải được bảng | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |

**Đồng thời:** mỗi đề tài ghi trong giao dịch riêng, khóa theo đề tài và theo khoản mục như BR-DADT-C-08. Đồng bộ khóa dòng đề tài và khoản mục trong giao dịch, đọc lại rồi ghi, không lỗi vì phiên bản; mỗi lần ghi khoản mục tăng version, nên TTMS đã mở tab trước lần ghi mà lưu Chi mua sắm, Hoàn thành khoản mục thì nhận "Dữ liệu đã được người khác cập nhật, vui lòng tải lại." (DTMS_CN_0244); đồng bộ không ghi đè hai giá trị này (BR-DADT-C-03). Đề xuất mua sắm, khoản đầu tư xác nhận bước lập hạng mục hoặc Báo giá đạt trong lúc đồng bộ ghi khoản mục: kiểm trên số liệu đã gồm phần ghi trước theo khóa khoản mục (BR-DADT-C-08).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0250-01 | Lịch 01:00; mốc 04/11/2026 01:00; không có đề tài còn lỗi; nguồn có đề tài mới DA-2026-020 và hai đề tài đã có thay đổi | Tới 01:00 ngày 05/11/2026 | Có lần mới mã dạng DB-2026-NNNNN, Theo lịch, Thành công; Lấy về 3, Thêm mới 1, Cập nhật 2; Cập nhật từ nguồn lúc của ba đề tài là thời điểm ghi |
| AC-0250-02 | DA-2026-020 có 12 khoản mục, nguồn đánh dấu cần mua sắm khoản mục "Thiết bị, máy đo chuyên dụng" | Đồng bộ thêm mới đề tài | Nguồn dữ liệu Đồng bộ Khoa học công nghệ; khoản mục đó Chi mua sắm Có, Trạng thái Chưa mua sắm; 11 khoản mục còn lại Chi mua sắm Không |
| AC-0250-03 | TTMS đã bỏ Chi mua sắm khoản mục X; nguồn vẫn đánh dấu cần mua sắm X | Đồng bộ cập nhật đề tài | X vẫn Chi mua sắm Không (BR-DADT-C-03) |
| AC-0250-04 | Khoản mục K có Đã đăng ký 2,00 tỷ đồng; dự toán nguồn gửi không còn K | Đồng bộ | K Ngừng sử dụng, Đã đăng ký vẫn 2,00; K không có ở danh sách bóc tách; Khoản mục ngừng sử dụng của lần là 1 |
| AC-0250-05 | K Ngừng sử dụng, Chi mua sắm Có, Trạng thái Hoàn thành | Nguồn gửi lại K | K Còn hiệu lực, giữ Chi mua sắm Có, Trạng thái Hoàn thành |
| AC-0250-06 | Khoản mục Giá trị sau thuế 10,00 tỷ đồng, Đã đăng ký 7,00, Đang giữ 0 | Nguồn giảm Giá trị sau thuế của khoản mục thuộc DA-2026-014 còn 6,00 | Còn lại khả dụng "-1,00" màu đỏ; nhật ký có dòng khoản mục âm; TTMS được thấy đề tài nhận "Đề tài / dự án DA-2026-014 có 1 khoản mục Còn lại khả dụng âm sau cập nhật từ nguồn." |
| AC-0250-07 | Nguồn gửi đề tài DA-2026-021 không có Mật | Đồng bộ | DA-2026-021 không có trên ĐTMS; chi tiết lần có Lỗi "Thiếu Mật."; lần Có lỗi; Quản trị, TTMS nhận thông báo "Đồng bộ đề tài / dự án có lỗi" |
| AC-0250-08 | Đề tài đã có, Tên "A"; nguồn đổi Tên thành "B" và gửi một khoản mục Giá trị trước thuế −5.000.000 | Đồng bộ | Đề tài vẫn Tên "A", dự toán như trước; Lỗi phần "Khoản mục {mã}" |
| AC-0250-09 | DA-2026-021 lỗi "Thiếu Mật." ở lần trước, chưa đóng; thời điểm cập nhật ở nguồn không đổi (không có trong GT-01) nhưng nguồn nay đã có Mật | Lần Thay đổi từ mốc kế tiếp | DA-2026-021 được lấy lại và thêm mới; lỗi cũ hiện Đã đóng Có; Đề tài còn lỗi giảm 1 |
| AC-0250-10 | Phân hệ không phản hồi; tham số 3 lần, cách 5 phút | Tới lịch | Một lần gọi đầu và 3 lần thử lại cách nhau 5 phút; lần Thất bại, số lần thử lại 3, lỗi chung "Không lấy được dữ liệu từ phân hệ Quản lý Khoa học công nghệ: …"; Mốc lấy thay đổi không đổi; thông báo "Đồng bộ đề tài / dự án thất bại" |
| AC-0250-11 | Quản trị A vừa bấm Đồng bộ, lần đang chạy | Quản trị B bấm \[Đồng bộ\] ở hộp thoại đã mở trước đó | "Đang có lần đồng bộ chạy. Vui lòng chờ lần này kết thúc."; không có lần mới |
| AC-0250-12 | Quản trị chọn Một đề tài, mã DA-2099-001 không có ở nguồn | Bấm \[Đồng bộ\] | Lần Có lỗi; chi tiết "Không tìm thấy đề tài / dự án DA-2099-001 ở phân hệ Quản lý Khoa học công nghệ."; Mốc lấy thay đổi không đổi |
| AC-0250-13 | DA-2026-014 Loại Khoa học công nghệ, Nguồn dữ liệu Chuyển từ hệ thống cũ, khoản mục "KM-01" Chi mua sắm đã bóc tách | Nguồn gửi DA-2026-014 có khoản mục mã "KM-01" | Nguồn dữ liệu Đồng bộ Khoa học công nghệ; "KM-01" giữ Chi mua sắm, Trạng thái, hạng mục liên kết; nhật ký "Đồng bộ tiếp quản" |
| AC-0250-14 | Mã SX-2026-005 có trên ĐTMS, Loại Sản xuất kinh doanh, Nguồn dữ liệu Đồng bộ HR Tool | Nguồn gửi đề tài cùng mã | Không ghi; Lỗi "Mã dự án / đề tài đã có trên ĐTMS với Loại Sản xuất kinh doanh." |
| AC-0250-15 | Nguồn gửi Nguồn vốn mã "DTPT2" chưa có trong bảng ánh xạ | Đồng bộ | Đề tài ghi, Nguồn vốn "-"; chi tiết lần có Cảnh báo "Nguồn vốn DTPT2 không có trong danh mục." |
| AC-0250-16 | Văn bản 9050/QĐ-VHT mới, tải tệp lỗi | Đồng bộ | Văn bản có ở tab Văn bản pháp lý, nút tải mờ; Cảnh báo "Không tải được tệp của văn bản 9050/QĐ-VHT."; lần sau tải được thì nút tải bấm được |
| AC-0250-17 | Chuyên viên TTMS | Mở Quản trị \> Đồng bộ đề tài / dự án | Thấy khối trạng thái, tab Lần đồng bộ; không có \[Đồng bộ ngay\] |
| AC-0250-18 | Đề tài đã có, mọi trường nguồn gửi trùng ĐTMS | Đồng bộ | Không đổi tăng 1; Cập nhật từ nguồn lúc của đề tài không đổi |
| AC-0250-19 | Lịch 01:00; Quản trị chạy Đồng bộ ngay từ 00:55, lần chạy tới 01:20 | Tới 01:00 | Không có lần mới; nhật ký "Bỏ qua lượt đồng bộ theo lịch do lần {Mã lần} đang chạy." |
| AC-0250-20 | Như AC-0250-13 nhưng dự toán nguồn không có mã "KM-01" | Đồng bộ | Không ghi; Lỗi "Khoản mục đã bóc tách KM-01 không có trong dự toán nguồn. Vui lòng đối chiếu Mã khoản mục với phân hệ Quản lý Khoa học công nghệ."; Nguồn dữ liệu vẫn Chuyển từ hệ thống cũ; lần Thay đổi từ mốc sau lấy lại DA-2026-014 |
| AC-0250-21 | Lỗi "Mã dự án / đề tài đã có trên ĐTMS với Loại Sản xuất kinh doanh." chưa đóng; nguồn không thay đổi đề tài này | Quản trị bấm \[Bỏ qua lỗi\], nhập Lý do, Đồng ý | Lỗi Đã đóng Có; lần Thay đổi từ mốc sau không lấy lại mã đó, không gửi thông báo vì lỗi này |
| AC-0250-22 | Lần DB Đang chạy, dịch vụ khởi động lại giữa lần | Dịch vụ chạy lại | Lần đó Thất bại "Lần đồng bộ bị gián đoạn."; Mốc lấy thay đổi không đổi; \[Đồng bộ ngay\] bấm được |
| AC-0250-23 | Đề tài Mật X người xem không được thấy có lỗi ở lần đồng bộ | Chuyên viên TTMS mở Chi tiết lần | Dòng của X hiện Mã, Tên "Hạn chế xem" |
| AC-0250-24 | DA-2025-044 Nguồn dữ liệu Đồng bộ, Đang thực hiện; nguồn đã bỏ đề tài | Lần rà soát toàn bộ theo lịch | Chi tiết lần có Cảnh báo "Không còn ở nguồn." cho DA-2025-044; đề tài bị đánh dấu Không còn ở nguồn; ô Đề tài / dự án của đề xuất mua sắm, khoản đầu tư mới không còn DA-2025-044; Quản trị, TTMS nhận thông báo "Đề tài / dự án không còn ở nguồn" |
| AC-0250-25 | DA-2025-044 bị đánh dấu; đề xuất mua sắm Đ đang xử lý dùng đề tài | Người xử lý xác nhận bước tiếp theo của Đ | Đ đi tiếp, không bị dừng |
| AC-0250-26 | DA-2025-044 bị đánh dấu; nguồn gửi lại đề tài | Lần đồng bộ kế tiếp | Bỏ đánh dấu; chi tiết lần có Cảnh báo "Đã có lại ở nguồn."; đề tài chọn lại được làm căn cứ |
| AC-0250-27 | Nguồn đã bỏ đề tài DA-2025-045 | Lần Thay đổi từ mốc theo lịch hằng ngày | DA-2025-045 không bị đánh dấu |
| AC-0250-28 | Nguồn gửi DA-2026-050 kèm Mã cũ DA-2025-012 (đang có trên ĐTMS, có khoản mục đã đăng ký) | Đồng bộ | DA-2026-050 thêm mới, Mã cũ DA-2025-012; DA-2025-012 giữ nguyên khoản mục và phần đã đăng ký |

# THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG

Chương này quy định các thành phần, kịch bản dùng chung cho mọi chức năng ở mục 3. Chức năng chỉ mô tả phần riêng; phần không mô tả thì áp dụng chương này. Khi chức năng quy định khác, áp dụng quy định của chức năng. Quy tắc nghiệp vụ chung của module ở mục 2.3.4.

## Trường điều khiển dùng chung

| Loại trường | Đặc điểm |
|----|----|
| Free text / Textbox – một dòng | Nhập trên một dòng, không xuống dòng. Độ dài tối đa theo mô tả của trường; không quy định riêng thì tối đa 255 ký tự. Nhập hoặc dán vượt độ dài tối đa: hệ thống chỉ ghi nhận phần trong giới hạn, hiện lỗi tại trường theo mục 4.5. Không cho nhập hoặc thực thi Script. Bỏ khoảng trắng đầu, cuối khi lưu; nội dung chỉ gồm khoảng trắng coi như không có dữ liệu. Mặc định không bắt buộc nếu chức năng không quy định khác. |
| Textbox – Read-only/Disabled (Textbox khóa) | Hiển thị giá trị không cho sửa. Không cho nhập, xóa, dán, thay đổi trực tiếp. Có trạng thái hiển thị khác trường nhập được. Giá trị không đổi khi lưu. |
| Textarea – nhiều dòng | Nhập nhiều dòng. Độ dài tối đa theo mô tả của trường. Vượt độ dài, Script, khoảng trắng, bắt buộc: như Textbox. |
| Ô số (Number, Số thập phân, Số không âm) | Chỉ nhận chữ số và dấu ngăn theo mô tả của trường; không nhận chữ. Dấu phẩy là phần thập phân, dấu chấm là ngăn nghìn. Số chữ số phần nguyên, thập phân, miền giá trị theo mô tả của trường. Hiển thị căn phải. |
| Date / Date picker | Định dạng DD/MM/YYYY; DateTime DD/MM/YYYY HH:mm. Chọn từ lịch hoặc gõ đúng định dạng. Gõ sai định dạng hoặc ngày không tồn tại thì báo lỗi tại trường theo mục 4.5. Cặp Từ – Đến: Từ không được lớn hơn Đến, câu lỗi theo chức năng. |
| Search box | Nhập từ khóa trên một dòng, không xuống dòng. Tối đa 255 ký tự nếu chức năng không quy định khác. Chuẩn hóa và truy vấn theo mục 4.3. Rỗng thì không áp điều kiện từ khóa. |
| Dropdown / Single Select | Chọn duy nhất một giá trị. Chưa chọn thì hiện placeholder hoặc giá trị khởi tạo theo chức năng. Không nhận giá trị ngoài danh sách. Loại có tìm kiếm: lọc danh sách theo ký tự đã gõ, chứa, không phân biệt hoa thường và dấu. Danh sách, thứ tự, mặc định theo chức năng. Ô chọn dữ liệu danh mục chỉ lấy bản ghi Đang sử dụng. |
| Dropdown nhiều lựa chọn / Checkbox nhiều lựa chọn | Chọn một hoặc nhiều giá trị; giá trị đã chọn hiện dạng thẻ, bỏ được từng thẻ. Khi dùng làm điều kiện lọc: bản ghi thỏa khi thuộc một trong các giá trị đã chọn. |
| Radio | Chọn đúng một trong các giá trị liệt kê tại chức năng. Mặc định theo chức năng. |
| Toggle Switch / Toggle Button | Hai trạng thái đối lập. Giá trị ban đầu theo dữ liệu hiện tại. Thao tác cần xác nhận thì chưa cập nhật trước khi xác nhận; cập nhật thất bại thì về trạng thái trước. Kịch bản theo mục 4.8. |
| Button – hành động chính | Lưu, Thêm mới, Xác nhận, Xóa, Tìm kiếm. Kiểm tra dữ liệu trước khi xử lý. Trong thời gian xử lý khóa nút, không gửi lặp (mục 4.6). |
| Button – hành động phụ | Hủy, Không, Đặt lại, Đóng, quay lại. Không đổi dữ liệu nghiệp vụ. \[Hủy\] trên màn Thêm mới, Chỉnh sửa (module không có màn này): chưa nhập gì thì đóng; đã nhập thì hỏi xác nhận bằng hộp thoại Hủy thay đổi. |
| Icon Button | Mỗi icon một thao tác xác định (Xem, Chỉnh sửa, Xóa, Tải xuống…). Di chuột hiện tooltip tên thao tác. Thao tác trên đúng bản ghi được chọn. Hiện hay ẩn theo phân quyền và điều kiện nghiệp vụ; không có thao tác nào thì ô trống. |
| Link | Mở màn chi tiết hoặc tệp của đúng bản ghi. Hiện dạng liên kết. |
| Label, Text | Hiển thị tiêu đề, tên trường, dữ liệu chỉ đọc. Không sửa trực tiếp. Không có giá trị thì hiện "-". Nội dung dài theo mục 4.2. |
| Tag, Badge | Hiển thị trạng thái hoặc phân loại. Màu, nhãn theo bộ trạng thái của mục 2.3.1. |
| Tooltip | Bổ sung thông tin cho control, icon, nội dung bị rút gọn. Nội dung bị cắt thì tooltip hiện đủ giá trị gốc. Ẩn khi rời vùng kích hoạt. |
| Trường bắt buộc | Có dấu \* cạnh tên trường. Không chấp nhận Null, rỗng, chỉ khoảng trắng. Không hợp lệ thì hiện lỗi tại trường, không lưu, không xác nhận. Trường bắt buộc có điều kiện ghi điều kiện tại mô tả trường. |
| File upload | Chọn tệp hoặc kéo thả. Định dạng cho phép: .doc, .docx, .xls, .xlsx, .pdf, trừ khi chức năng quy định khác; tối đa 10 MB mỗi tệp, trừ khi chức năng quy định khác; tên tệp tối đa 255 ký tự. Phía xử lý kiểm tra cả phần mở rộng và kiểu nội dung, từ chối tệp rỗng. Đang tải lên hiện tiến trình, không gửi lặp. Thành công: thực hiện bước tiếp theo của chức năng. Thất bại: hiện lỗi theo mục 4.5, 4.6, giữ nguyên danh sách. |

## Bảng danh sách dùng chung

### Thông tin chung chức năng

- **Mục đích:** Quy định thống nhất cách hiển thị, xử lý dữ liệu dạng bảng trên các màn danh sách, lưới trong màn chi tiết và hộp thoại.

- **Phạm vi áp dụng:** Mọi chức năng dùng bảng để hiển thị tập bản ghi.

- **Tiền điều kiện:**

  - Người dùng đã mở chức năng có bảng.

  - Người dùng có quyền xem dữ liệu tương ứng.

- **Hậu điều kiện:**

  - Bảng hiển thị dữ liệu theo kết quả truy vấn và điều kiện hiện tại.

  - Trạng thái có dữ liệu, không có dữ liệu, đang tải, lỗi được hiển thị tương ứng.

### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Bảng danh sách | Data Grid | Output | Theo kết quả truy vấn | Mỗi bản ghi một dòng. Tên, thứ tự, dữ liệu các cột theo chức năng. |
| 2 | Tiêu đề cột | Label | Output | Theo chức năng | Tối đa 2 dòng; vượt thì cắt bằng "..." và hiện đủ bằng tooltip. Phần tiêu đề luôn hiện, kể cả khi không có dữ liệu. |
| 3 | STT | Number | Output | Theo vị trí bản ghi | Số thứ tự trong toàn bộ kết quả, tính theo mục 4.4.3 khi có phân trang. |
| 4 | Nội dung mã, giá trị ngắn | Label | Output | Theo dữ liệu | Tối đa 1 dòng; vượt chiều rộng cột thì cắt bằng "..." và hiện đủ bằng tooltip. |
| 5 | Nội dung văn bản | Label | Output | Theo dữ liệu | Tối đa 2 dòng; vượt thì cắt tại dòng thứ hai bằng "...", di chuột hiện đủ bằng tooltip. |
| 6 | Giá trị rỗng | Label | Output | \- | Dữ liệu null, rỗng hiện "-", trừ khi chức năng quy định khác. |
| 7 | Trạng thái | Tag / Toggle | Input/Output | Theo dữ liệu | Hiển thị theo thiết kế chức năng. Đổi trực tiếp bằng Toggle thì theo mục 4.8. |
| 8 | Cột thao tác | Icon Button | Input | Theo quyền | Các thao tác trên từng dòng. Quy tắc icon theo mục 4.1. |
| 9 | Đang tải | Loading | Output | Ẩn | Hiện tại vùng bảng khi đang truy vấn hoặc tải lại; trong lúc tải không cho thao tác trên dữ liệu chưa cập nhật xong. |
| 10 | Chưa có dữ liệu | Empty State | Output | Ẩn | Hiện "Chưa có dữ liệu" khi tập dữ liệu chưa có bản ghi. Giữ tiêu đề bảng. |
| 11 | Không có kết quả phù hợp | Empty State | Output | Ẩn | Hiện "Không tìm thấy dữ liệu phù hợp" khi có dữ liệu nhưng không bản ghi nào thỏa điều kiện tìm kiếm, lọc. |
| 12 | Lỗi tải dữ liệu | Error State | Output | Ẩn | Hiện "Không thể tải dữ liệu. Vui lòng thử lại." tại vùng bảng. Giữ điều kiện tìm kiếm, lọc, phân trang. |
| 13 | Thanh cuộn | Scrollbar | Input/Output | Ẩn | Hiện khi bảng vượt vùng hiển thị. Cuộn ngang khi tổng chiều rộng cột vượt vùng chứa; không co cột tới mức không đọc được. |

### Quy tắc hiển thị bảng

**Quy tắc hiển thị dữ liệu:**

- Mỗi bản ghi một dòng; dữ liệu các cột trên một dòng thuộc cùng bản ghi.

- Thứ tự cột theo chức năng.

- Không tự tăng chiều cao dòng quá giới hạn số dòng nêu trên. Trường cần số dòng khác thì chức năng mô tả riêng.

- Sắp xếp mặc định theo chức năng; chức năng không nêu thì Ngày tạo giảm dần.

**Quy tắc căn chỉnh:**

| Loại dữ liệu     | Căn chỉnh mặc định |
|------------------|--------------------|
| STT              | Căn giữa           |
| Văn bản, mã, tên | Căn trái           |
| Số, tiền         | Căn phải           |
| Ngày, trạng thái | Căn giữa           |
| Cột thao tác     | Căn giữa           |

**Quy tắc cột thao tác:**

- Thao tác áp đúng bản ghi của dòng được chọn.

- Chỉ hiện hoặc cho thao tác theo quyền và điều kiện nghiệp vụ.

- Icon trong một cột xếp theo thứ tự thống nhất: Xem, Sửa, Xóa, các thao tác khác.

- Di chuột vào icon hiện tooltip tên thao tác.

- Thao tác đang xử lý thì không gửi lặp trên cùng bản ghi.

- Luồng của từng thao tác mô tả tại chức năng hoặc kịch bản dùng chung tương ứng.

**Quy tắc trạng thái dữ liệu:**

| Trường hợp | Cách xử lý |
|----|----|
| Đang truy vấn | Loading tại vùng bảng |
| Có dữ liệu | Hiển thị các bản ghi |
| Không có bản ghi | "Chưa có dữ liệu" |
| Không có kết quả sau tìm kiếm, lọc | "Không tìm thấy dữ liệu phù hợp" |
| Một trường không có giá trị | "-" |
| Không truy xuất được dữ liệu | "Không thể tải dữ liệu. Vui lòng thử lại." |

## Kịch bản tìm kiếm và lọc dùng chung

### Thông tin chung chức năng

- **Mục đích:** Thu hẹp dữ liệu hiển thị theo từ khóa và một hoặc nhiều điều kiện lọc.

- **Phạm vi áp dụng:** Màn danh sách, hộp thoại, vùng dữ liệu có tìm kiếm, lọc.

- **Tiền điều kiện:**

  - Người dùng đã mở chức năng có dữ liệu cần tra cứu.

  - Người dùng có quyền xem dữ liệu tương ứng.

- **Hậu điều kiện:**

  - Dữ liệu hiển thị theo điều kiện đã áp.

  - Phân trang tính lại theo tập kết quả mới.

### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Từ khóa | Search box \[255\] | Input | Rỗng | Tìm trên các trường chức năng quy định. Luôn hiện, kể cả khi mở khối tìm kiếm nâng cao. |
| 2 | Điều kiện tìm kiếm nâng cao | Control theo chức năng | Input | Theo chức năng | Thu hẹp theo một hoặc nhiều tiêu chí. Cách đối sánh (Chứa, Bằng, Thuộc, khoảng Từ – Đến) ghi tại từng trường của chức năng. |
| 3 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\] | Button | Input | – | Mở, đóng khối điều kiện nâng cao. Đóng khối vẫn giữ điều kiện đã áp, bỏ giá trị đã nhập mà chưa áp; nút ghi kèm số điều kiện đang áp, ví dụ \[Tìm kiếm nâng cao (2)\]. |
| 4 | \[Tìm kiếm\] | Button | Input | – | Áp đồng thời từ khóa và mọi điều kiện đang nhập. Enter tại ô từ khóa tương đương. |
| 5 | \[Đặt lại\] | Button | Input | – | Xóa từ khóa, đưa điều kiện về giá trị khởi tạo, tải lại. |

### Quy tắc tìm kiếm và lọc

**Quy tắc từ khóa:**

- Mặc định trống khi mở màn.

- Bỏ khoảng trắng đầu, cuối trước khi tìm. Rỗng sau chuẩn hóa thì không áp điều kiện từ khóa.

- Tìm **Chứa**, không phân biệt hoa thường và dấu tiếng Việt.

- Áp trên nhiều trường thì bản ghi thỏa khi khớp ít nhất một trường.

- Chỉ tìm trên các trường chức năng quy định.

**Quy tắc lọc:**

- Mỗi điều kiện chỉ áp trên thuộc tính chức năng quy định.

- Ô chữ trong khối nâng cao: **Chứa**, không phân biệt hoa thường và dấu. Dropdown một lựa chọn: **Bằng**. Dropdown nhiều lựa chọn: **Thuộc** danh sách đã chọn. Khoảng ngày: tính cả hai đầu.

- Giá trị Tất cả hoặc để trống: không áp điều kiện đó.

- Nhiều điều kiện kết hợp đồng thời (và).

- Từ khóa và điều kiện nâng cao áp đồng thời trong cùng một lần truy vấn.

**Kích hoạt tìm kiếm:** bấm \[Tìm kiếm\] hoặc Enter tại ô từ khóa. Hệ thống lấy toàn bộ từ khóa và điều kiện tại thời điểm đó, về trang 1, giữ số bản ghi mỗi trang. Đổi điều kiện mà chưa kích hoạt thì danh sách không đổi.

**Đặt lại:** xóa từ khóa; đưa điều kiện về giá trị khởi tạo; về trang 1; tải lại theo điều kiện mặc định.

**Quy tắc hiển thị kết quả:**

| Trường hợp | Xử lý |
|----|----|
| Có bản ghi phù hợp | Hiển thị bản ghi thỏa đồng thời từ khóa và điều kiện |
| Không có từ khóa, không có điều kiện | Hiển thị toàn bộ dữ liệu trong phạm vi được xem |
| Không có bản ghi phù hợp | "Không tìm thấy dữ liệu phù hợp" (mục 4.2) |
| Đang truy vấn | Loading tại vùng bảng |
| Truy vấn thất bại | "Không thể tải dữ liệu. Vui lòng thử lại." Giữ từ khóa, điều kiện đã nhập |
| Có phân trang | Tính lại tổng số bản ghi, tổng số trang, hiển thị trang 1 |

## Phân trang dùng chung

### Thông tin chung chức năng

- **Mục đích:** Chia tập dữ liệu thành trang, cho chọn số bản ghi mỗi trang và chuyển trang.

- **Phạm vi áp dụng:** Bảng, danh sách có phân trang. Chức năng ghi "không phân trang" thì hiển thị toàn bộ.

- **Giá trị khởi tạo:** trang 1; 10 bản ghi mỗi trang.

- **Hậu điều kiện:** Danh sách hiển thị đúng dữ liệu của trang được chọn; thông tin phân trang cập nhật tương ứng.

### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Tổng số bản ghi | Label | Output | Theo kết quả truy vấn | Dạng "Tất cả danh sách: {TotalRecord}". Cập nhật sau mỗi lần tải lại, tìm kiếm, lọc. |
| 2 | Số bản ghi/trang | Dropdown | Input | 10 | Giá trị 10, 20, 50. Đổi giá trị thì tải lại, về trang 1. |
| 3 | Trang hiện tại | Paging Number | Input/Output | 1 | Có trạng thái hiển thị khác các trang khác. Chọn lại đúng trang hiện tại không tải lại dữ liệu. |
| 4 | Trang đầu | Icon Button | Input | Khóa tại trang 1 | Về trang đầu tiên. |
| 5 | Trang trước | Icon Button | Input | Khóa tại trang 1 | Về trang liền trước. |
| 6 | Danh sách số trang | Paging Number | Input | Theo tổng số trang | Tối đa 5 số trang tại một thời điểm. |
| 7 | Trang sau | Icon Button | Input | Khóa tại trang cuối | Sang trang liền sau. |
| 8 | Trang cuối | Icon Button | Input | Khóa tại trang cuối | Sang trang cuối cùng. |

### Công thức tính

Quy ước: TotalRecord là tổng số bản ghi; PageSize là số bản ghi mỗi trang; CurrentPage là trang hiện tại; Position là vị trí bản ghi trong trang, bắt đầu từ 1.

| Nội dung          | Công thức                                            |
|-------------------|------------------------------------------------------|
| Tổng số trang     | TotalPage = CEILING(TotalRecord / PageSize)          |
| Số thứ tự bản ghi | STT = (CurrentPage − 1) × PageSize + Position        |
| Bản ghi bắt đầu   | StartRecord = (CurrentPage − 1) × PageSize + 1       |
| Bản ghi kết thúc  | EndRecord = MIN(CurrentPage × PageSize, TotalRecord) |

TotalRecord = 0: không có bản ghi; trang hiện tại là 1; không hiện số trang chọn được; mọi nút điều hướng khóa. Sau khi xóa bản ghi cuối cùng của trang cuối (module không có thao tác Xóa, giữ để thống nhất), CurrentPage lớn hơn TotalPage thì về trang TotalPage.

### Quy tắc hiển thị

**Hiển thị số trang:** tổng số trang ≤ 5 thì hiện tất cả; lớn hơn 5 thì hiện trang hiện tại và các trang lân cận, dùng "..." cho khoảng bị ẩn; trang đầu, trang cuối luôn tới được bằng nút điều hướng.

**Trạng thái nút điều hướng:**

| Trạng thái | Trang đầu | Trang trước | Trang sau | Trang cuối |
|----|----|----|----|----|
| Không có dữ liệu | Khóa | Khóa | Khóa | Khóa |
| Trang đầu tiên | Khóa | Khóa | Mở nếu có hơn 1 trang | Mở nếu có hơn 1 trang |
| Trang giữa | Mở | Mở | Mở | Mở |
| Trang cuối cùng | Mở nếu có hơn 1 trang | Mở nếu có hơn 1 trang | Khóa | Khóa |

**Giữ điều kiện khi chuyển trang:** giữ từ khóa, điều kiện lọc, số bản ghi mỗi trang, thứ tự sắp xếp; chỉ đổi trang truy vấn.

## Kiểm tra dữ liệu và thông báo lỗi dùng chung

### Thông tin chung

- **Mục đích:** Bảo đảm dữ liệu đầu vào đúng ràng buộc trước khi lưu hoặc xử lý nghiệp vụ.

- **Phạm vi áp dụng:** Trường nhập, hộp thoại Đồng bộ ngay, hộp thoại có nhập liệu.

- **Nguyên tắc:**

  - Kiểm tra trước khi xử lý nghiệp vụ.

  - Lỗi chỉ rõ trường và nguyên nhân.

  - Không xóa dữ liệu người dùng đã nhập khi kiểm tra không đạt.

  - Còn lỗi thì không lưu, không chuyển bước.

### Nguyên tắc kiểm tra dữ liệu

- Phía giao diện kiểm tra trước khi gửi: bắt buộc, độ dài, định dạng, miền giá trị.

- Phía xử lý kiểm tra lại khi nhận yêu cầu: tính duy nhất, sự tồn tại của dữ liệu tham chiếu, trạng thái bản ghi, quyền, quy tắc nghiệp vụ.

- Form có nhiều trường lỗi: hiện lỗi tại mọi trường xác định được, không bắt người dùng sửa từng lỗi rồi gửi lại mới biết lỗi tiếp theo. Phía xử lý trả nhiều lỗi thì hiện lỗi tại từng trường tương ứng.

- Dữ liệu không hợp lệ: không lưu, giữ form, giữ dữ liệu đã nhập, hiện lỗi tại trường.

- Trường đã sửa thành hợp lệ thì ẩn lỗi của trường đó.

- Kiểm tra lại toàn bộ khi người dùng xác nhận lưu, kể cả trường đã kiểm tra trước đó.

### Quy tắc hiển thị lỗi tại trường

| Nội dung        | Quy tắc                                         |
|-----------------|-------------------------------------------------|
| Vị trí          | Ngay dưới trường lỗi                            |
| Hình thức       | Inline Message, màu lỗi theo thiết kế giao diện |
| Trường lỗi      | Có trạng thái hiển thị khác trường hợp lệ       |
| Thời điểm hiện  | Khi xác định trường không hợp lệ                |
| Thời điểm ẩn    | Khi giá trị được sửa và hợp lệ                  |
| Nhiều lỗi       | Hiện đồng thời tại các trường                   |
| Dữ liệu đã nhập | Không bị xóa                                    |

### Các trường hợp kiểm tra dùng chung

| STT | Trường hợp | Điều kiện | Nội dung thông báo |
|----|----|----|----|
| 1 | Chưa nhập trường bắt buộc | Null, rỗng, chỉ khoảng trắng | "Vui lòng nhập {Tên trường}." |
| 2 | Chưa chọn trường bắt buộc | Trường lựa chọn, tải tệp chưa có giá trị hợp lệ | "Vui lòng chọn {Tên trường}." |
| 3 | Vượt độ dài tối đa | Nhập hoặc dán vượt độ dài của trường | Chỉ ghi nhận phần trong giới hạn; "Không được nhập quá {maxlength} ký tự." |
| 4 | Sai định dạng | Không đúng định dạng quy định | Câu cụ thể tại chức năng; không có thì "{Tên trường} không hợp lệ." |
| 5 | Trùng dữ liệu | Trường yêu cầu duy nhất đã tồn tại | "{Tên trường} đã tồn tại." |
| 6 | Giá trị không còn hợp lệ | Giá trị tham chiếu đã xóa, ngừng sử dụng hoặc không còn đáp ứng điều kiện chọn | Câu cụ thể theo đối tượng tại chức năng; không lưu |

### Thông báo sai định dạng

Trường có định dạng cụ thể thì ưu tiên câu nêu rõ điều kiện hợp lệ, ví dụ "Ngày tạo từ không được lớn hơn Ngày tạo đến.". Câu cụ thể ghi tại trường của chức năng. Chương này chỉ quy định cách kiểm tra và cách hiện lỗi, không áp một định dạng chung cho mọi trường.

### Kiểm tra tính duy nhất

Chỉ áp cho trường chức năng quy định là duy nhất; không mặc định mọi trường đều duy nhất.

- **Thêm mới:** kiểm tra giá trị đã tồn tại; đã tồn tại thì không lưu, hiện lỗi tại trường.

- **Chỉnh sửa:** trường duy nhất được phép sửa thì kiểm tra với bản ghi khác, loại trừ chính bản ghi đang sửa; trùng thì không cập nhật.

- Câu thông báo: "{Tên trường} đã tồn tại."

- Mã do hệ thống sinh (mã lần đồng bộ) không qua kiểm tra này; tính duy nhất do cách sinh mã bảo đảm.

- Mã đề tài do nguồn cấp: đồng bộ khớp với đề tài đã có theo BR-DADT-C-02, BR-DADT-04-02; trùng với đề tài đã có là Cập nhật, không báo "đã tồn tại".

### Xử lý lỗi trả về từ phía xử lý

| Trường hợp | Cách xử lý |
|----|----|
| Lỗi gắn một trường | Inline Message tại trường |
| Nhiều trường cùng lỗi | Hiện đồng thời tại các trường |
| Lỗi nghiệp vụ không gắn trường | Thông báo chung theo mục 4.6, câu cụ thể tại chức năng |
| Bản ghi không còn tồn tại | Không lưu; "{Đối tượng} không còn tồn tại."; tải lại dữ liệu khi cần |
| Không còn quyền | Không đổi dữ liệu; "Bạn không có quyền thực hiện chức năng này." |
| Lỗi hệ thống, mất kết nối, timeout | Không coi là thành công; giữ dữ liệu trên form; hiện lỗi theo mục 4.6 |

## Thông báo chung và trạng thái xử lý

### Thông tin chung

- **Mục đích:** Chuẩn hóa cách phản hồi kết quả, trạng thái của thao tác.

- **Phạm vi áp dụng:** Chức năng có tải dữ liệu, gửi yêu cầu xử lý, cần phản hồi kết quả.

- **Nguyên tắc:**

  - Thông báo phản ánh đúng kết quả thực tế.

  - Không báo thành công khi hệ thống chưa xác nhận thành công.

  - Lỗi đủ rõ để người dùng biết thao tác chưa xong và việc cần làm tiếp.

  - Lỗi tại trường theo mục 4.5; không dùng Toast thay cho lỗi xác định được tại một trường.

### Các hình thức thông báo

| STT | Loại | Phạm vi sử dụng | Quy tắc |
|----|----|----|----|
| 1 | Toast thành công | Thao tác đã hoàn tất | Hiện sau khi hệ thống xác nhận thành công; nêu rõ hành động, đối tượng |
| 2 | Toast lỗi | Lỗi không gắn một trường | Lỗi hệ thống, quyền, trạng thái dữ liệu, nghiệp vụ chung |
| 3 | Toast cảnh báo, thông tin | Cần lưu ý nhưng thao tác không thất bại | Nêu rõ trạng thái hoặc lưu ý |
| 4 | Inline Message | Lỗi tại trường | Theo mục 4.5 |
| 5 | Empty State | Không có dữ liệu | Hiện tại vùng dữ liệu, không dùng Toast |
| 6 | Error State | Không tải được một vùng | Hiện tại vùng lỗi, có thao tác thử lại khi nghiệp vụ cho phép |
| 7 | Hộp thoại xác nhận | Thao tác không hoàn tác được hoặc làm mất dữ liệu đang nhập | Tiêu đề, nội dung, hai nút; nội dung cụ thể tại chức năng |

### Quy tắc nội dung thông báo

Cấu trúc: {Kết quả hoặc Hành động} + {Đối tượng} + {thông tin bổ sung nếu cần}. {Đối tượng} là tên đối tượng nghiệp vụ, ví dụ đề tài / dự án, khoản mục.

| Trường hợp | Nội dung |
|----|----|
| Thêm mới thành công | "Thêm mới {Đối tượng} thành công." |
| Cập nhật thành công | "Cập nhật {Đối tượng} thành công." |
| Xóa thành công | "Xóa {Đối tượng} thành công." |
| Cập nhật trạng thái thành công | "Cập nhật trạng thái {Đối tượng} thành công." |
| Không có quyền | "Bạn không có quyền thực hiện chức năng này." |
| Không tải được dữ liệu | "Không thể tải dữ liệu. Vui lòng thử lại." |
| Không xử lý được yêu cầu | "Không thể thực hiện yêu cầu. Vui lòng thử lại." |
| Bản ghi không còn tồn tại | "{Đối tượng} không còn tồn tại." |
| Mất kết nối | "Mất kết nối mạng. Vui lòng kiểm tra kết nối và thử lại." |
| Timeout | "Máy chủ phản hồi chậm. Vui lòng thử lại." |
| Dữ liệu đã bị người khác thay đổi | "Dữ liệu đã được người khác cập nhật, vui lòng tải lại." |
| Hủy khi đã nhập dữ liệu | Hộp thoại tiêu đề "Hủy thay đổi", nội dung "Các thay đổi chưa lưu sẽ bị mất. Bạn có chắc chắn muốn thoát?", nút \[Ở lại\], \[Rời khỏi\] |

### Trạng thái xử lý dùng chung

| Trạng thái | Cách hiển thị, xử lý |
|----|----|
| Chưa xử lý | Dữ liệu, control ở trạng thái bình thường |
| Đang tải dữ liệu | Loading tại vùng đang tải; không hiện dữ liệu giả hoặc giá trị mặc định dễ hiểu nhầm là dữ liệu thật |
| Đang xử lý thao tác | Khóa control gửi yêu cầu và thao tác có thể tạo yêu cầu trùng; giữ dữ liệu trên giao diện |
| Xử lý thành công | Cập nhật dữ liệu mới, đóng form hoặc hộp thoại nếu nghiệp vụ yêu cầu, Toast thành công |
| Xử lý thất bại | Không coi là thành công; hiện lỗi; giữ dữ liệu đã nhập nếu còn thao tác tiếp được |
| Không có dữ liệu | Empty State |
| Lỗi tải dữ liệu | Error State tại vùng lỗi, có thử lại |
| Lỗi một phần | Chỉ đánh dấu vùng lỗi; vùng độc lập khác vẫn hoạt động |
| Mất kết nối, timeout | Dừng chờ; không coi là thành công; cho thực hiện lại khi có kết nối |
| Không có quyền | Dừng thao tác; thông báo không có quyền |

### Quy tắc Loading

- Hiện ngay khi bắt đầu thao tác có thời gian chờ đáng kể.

- Phạm vi Loading theo phạm vi dữ liệu: cả nội dung chính, vùng bảng, hoặc một thành phần. Ưu tiên theo vùng thay vì khóa toàn màn.

- Khi Loading, khóa thao tác có thể tạo yêu cầu trùng.

- Kết thúc khi có kết quả thành công, lỗi, timeout hoặc trạng thái kết thúc khác. Không để Loading tồn tại khi yêu cầu đã thất bại.

### Quy tắc chống thao tác lặp

Khi một thao tác thay đổi dữ liệu đang xử lý:

- Không cho bấm lại nút xác nhận; không gửi nhiều yêu cầu giống nhau từ một thao tác.

- Không cho thao tác khác gây xung đột trên cùng đối tượng khi chưa có kết quả.

- Có kết quả thì đưa control về trạng thái theo dữ liệu hiện tại.

- Hộp thoại Đồng bộ ngay: mỗi lần mở có một mã yêu cầu. Gửi lại cùng mã không tạo lần đồng bộ lần hai. Kết quả của lần gửi lại mô tả tại chức năng.

Áp cho đổi Chi mua sắm, Hoàn thành khoản mục, Xuất Excel, Đồng bộ ngay, Bỏ qua lỗi đồng bộ.

### Xử lý kết quả thao tác thay đổi dữ liệu

| Kết quả | Cách xử lý |
|----|----|
| Thành công | Toast thành công; cập nhật dữ liệu liên quan; đóng form hoặc hộp thoại nếu luồng yêu cầu |
| Kiểm tra dữ liệu không đạt | Không gửi hoặc dừng; Inline Message theo mục 4.5 |
| Lỗi nghiệp vụ | Không cập nhật; câu lỗi cụ thể tại chức năng |
| Không có quyền | Không thay đổi; "Bạn không có quyền thực hiện chức năng này." |
| Bản ghi đã đổi, đã xóa | Không cập nhật trên dữ liệu cũ; thông báo, tải lại dữ liệu |
| Lỗi hệ thống | Không xác nhận thành công; Toast lỗi |
| Timeout, mất kết nối | Không xác nhận thành công; giữ form để kiểm tra hoặc thực hiện lại; tải lại để biết kết quả thật khi cần |

## Xóa bản ghi dùng chung

Module hiện không có thao tác Xóa: đề tài, khoản mục, văn bản pháp lý không xóa trên ĐTMS (BR-DADT-C-01, BR-DADT-C-09). Giữ mục để thống nhất với tài liệu thiết kế dùng chung.

### Thông tin chung chức năng

- **Mục đích:** Loại một bản ghi không còn dùng khỏi danh sách sau khi người dùng xác nhận.

- **Phạm vi áp dụng:** Chức năng có thao tác Xóa một bản ghi. Điều kiện được xóa, người được xóa ghi tại quy tắc của chức năng.

- **Người dùng mục tiêu:** Người có quyền Xóa đối tượng tương ứng.

- **Tiền điều kiện:**

  - Bản ghi được chọn còn tồn tại.

  - Người dùng có quyền Xóa.

  - Bản ghi đáp ứng điều kiện được xóa của chức năng.

- **Hậu điều kiện thành công:**

  - Bản ghi không còn hiện trên danh sách. Xóa là xóa mềm: dữ liệu và mã vẫn giữ, không dùng lại mã.

  - Danh sách, phân trang cập nhật.

  - Nhật ký ghi theo mục 2.3.5.

- **Hậu điều kiện không thành công:**

  - Dữ liệu không đổi.

  - Hệ thống báo nguyên nhân.

### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Biểu tượng cảnh báo | Icon | Output | Theo thiết kế | Cho biết đây là thao tác loại bỏ dữ liệu |
| 2 | Tiêu đề | Label | Output | "Xóa {Đối tượng}" | Thể hiện rõ đây là thao tác xóa |
| 3 | Nội dung xác nhận | Label | Output | Theo bản ghi được chọn | "Bạn có chắc chắn muốn xóa {Đối tượng} {Tên} - {Mã} không? Thao tác này không thể hoàn tác." Tên, Mã được nhấn mạnh. Đối tượng không có Tên thì chỉ ghi Mã. Câu riêng, nếu có, ghi tại chức năng |
| 4 | \[Hủy\] | Button | Input | – | Đóng hộp thoại, không xóa; danh sách giữ nguyên |
| 5 | \[Xóa\] | Button | Input | – | Kiểm tra lại quyền, sự tồn tại, điều kiện được xóa rồi xóa đúng bản ghi đã chọn. Khóa nút trong khi xử lý |

### Quy tắc xác định bản ghi xóa

| Quy tắc | Mô tả |
|----|----|
| Đúng bản ghi | Thao tác Xóa gắn với định danh bản ghi của dòng được chọn |
| Hiện để đối chiếu | Hộp thoại hiện Tên và Mã để người dùng kiểm tra |
| Không đổi đối tượng | Xác nhận áp đúng bản ghi đã chọn khi mở hộp thoại |
| Dữ liệu đã thay đổi | Dùng dữ liệu tại thời điểm xác nhận để xét điều kiện được xóa |

### Quy tắc kiểm tra trước khi xóa

| Nhóm kiểm tra | Xử lý |
|----|----|
| Quyền | Không còn quyền thì không xóa, "Bạn không có quyền thực hiện chức năng này." |
| Sự tồn tại | Bản ghi không còn hoặc đã bị xóa thì không xóa lại, "{Đối tượng} không còn tồn tại.", tải lại danh sách |
| Ràng buộc nghiệp vụ | Bản ghi đang được dùng hoặc không đủ điều kiện thì không xóa, hiện câu nguyên nhân của chức năng |
| Hợp lệ | Chỉ xóa khi mọi điều kiện đạt |

### Quy tắc xử lý sau khi xóa

- **Thành công:** đóng hộp thoại; Toast "Xóa {Đối tượng} thành công."; tải lại danh sách theo từ khóa, điều kiện lọc, số bản ghi mỗi trang hiện tại; cập nhật tổng số bản ghi, phân trang (mục 4.4.3).

- **Không thành công:** dữ liệu không đổi; hiện lỗi; giữ điều kiện tìm kiếm, lọc; cho thực hiện lại nếu nguyên nhân cho phép.

### Các trường hợp xử lý

| Trường hợp | Cách xử lý |
|----|----|
| Bấm \[Hủy\] | Đóng hộp thoại, không đổi dữ liệu |
| Xóa thành công | Đóng hộp thoại, Toast thành công, tải lại danh sách |
| Không còn quyền | Không xóa, thông báo không có quyền |
| Bản ghi không còn | Không xóa lại, thông báo, tải lại danh sách |
| Vi phạm ràng buộc nghiệp vụ | Không xóa, hiện lý do |
| Lỗi hệ thống | Không xác nhận thành công, Toast "Không thể thực hiện yêu cầu. Vui lòng thử lại." |
| Mất kết nối, timeout | Không coi là thành công; tải lại danh sách để biết kết quả thật (mục 4.6) |
| Đang xử lý | Khóa \[Xóa\], không gửi lặp |

## Bật/Tắt trạng thái dùng chung

Module hiện không có chức năng dùng mục này; giữ để thống nhất với tài liệu thiết kế dùng chung. Chi mua sắm là hộp đánh dấu có kịch bản riêng ở DTMS_CN_0244, không theo mục này.

### Thông tin chung chức năng

- **Mục đích:** Đổi trạng thái hoạt động của bản ghi mà không xóa dữ liệu.

- **Phạm vi áp dụng:** Chức năng có Toggle đổi trạng thái trực tiếp. Module hiện không có chức năng dùng Toggle; trạng thái đề tài theo nguồn, trạng thái khoản mục chọn ở DTMS_CN_0244 (mục 2.3.1). Mục này áp khi module sau này có danh mục, cấu hình cần bật tắt.

- **Người dùng mục tiêu:** Người có quyền cập nhật trạng thái đối tượng.

- **Tiền điều kiện:**

  - Bản ghi còn tồn tại.

  - Người dùng có quyền cập nhật trạng thái.

  - Bản ghi đáp ứng điều kiện đổi trạng thái của chức năng.

- **Hậu điều kiện:**

  - Trạng thái mới được lưu, Toggle hiện đúng trạng thái mới.

  - Danh sách cập nhật; nhật ký ghi theo mục 2.3.5.

### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Trạng thái | Toggle Switch | Input/Output | Theo trạng thái hiện tại | Bật là Đang hoạt động, Tắt là Ngừng hoạt động. Đổi Toggle thì chưa cập nhật, hiện hộp thoại xác nhận |
| 2 | Tiêu đề | Label | Output | Theo trạng thái cần chuyển | Đang hoạt động thì "Ngừng hoạt động"; Ngừng hoạt động thì "Kích hoạt" |
| 3 | Nội dung xác nhận | Label | Output | Theo bản ghi được chọn | Theo mục 4.8.4; tên bản ghi được nhấn mạnh |
| 4 | \[Không\] | Button | Input | – | Đóng hộp thoại, không cập nhật, Toggle về trạng thái trước |
| 5 | \[Có\] | Button | Input | – | Kiểm tra lại quyền, sự tồn tại, trạng thái hiện tại, điều kiện nghiệp vụ rồi cập nhật. Khóa nút trong khi xử lý |

### Quy tắc xác định trạng thái

| Trạng thái hiện tại | Thao tác   | Trạng thái mới  | Tiêu đề hộp thoại |
|---------------------|------------|-----------------|-------------------|
| Đang hoạt động      | Tắt Toggle | Ngừng hoạt động | Ngừng hoạt động   |
| Ngừng hoạt động     | Bật Toggle | Đang hoạt động  | Kích hoạt         |

### Quy tắc nội dung xác nhận

- Sang Ngừng hoạt động: "Bạn có chắc chắn muốn ngừng hoạt động {Đối tượng}: {Tên đối tượng} không?"

- Sang Đang hoạt động: "Bạn có chắc chắn muốn kích hoạt {Đối tượng}: {Tên đối tượng} không?"

- Tên không đủ nhận diện duy nhất thì ghi kèm Mã.

### Kiểm tra trước khi cập nhật trạng thái

| Nhóm kiểm tra | Cách xử lý |
|----|----|
| Quyền | Không còn quyền thì không cập nhật, thông báo không có quyền |
| Sự tồn tại | Bản ghi không còn thì không cập nhật, thông báo, tải lại |
| Trạng thái hiện tại | Xét trạng thái thực tế tại thời điểm xác nhận, không theo dữ liệu cũ trên màn |
| Ràng buộc nghiệp vụ | Không được đổi thì không cập nhật, hiện câu nguyên nhân của chức năng |

### Quy tắc xử lý Toggle

- Trước khi xác nhận: hiện hộp thoại; trạng thái mới chưa được coi là đã cập nhật; không phát sinh thay đổi dữ liệu.

- Chọn \[Không\]: đóng hộp thoại, không cập nhật, Toggle về trạng thái ban đầu.

- Chọn \[Có\]: kiểm tra theo mục 4.8.5; hợp lệ thì gửi yêu cầu; khóa nút trong khi xử lý.

### Quy tắc xử lý kết quả

| Kết quả | Cách xử lý |
|----|----|
| Thành công | Lưu trạng thái mới; đóng hộp thoại; Toggle hiện trạng thái mới; "Cập nhật trạng thái {Đối tượng} thành công."; cập nhật dữ liệu liên quan |
| Chọn \[Không\] | Không cập nhật; đóng hộp thoại; Toggle về trạng thái ban đầu |
| Không có quyền | Không cập nhật; Toggle về trạng thái ban đầu; thông báo không có quyền |
| Bản ghi không còn | Không cập nhật; tải lại danh sách |
| Vi phạm ràng buộc nghiệp vụ | Không cập nhật; Toggle về trạng thái ban đầu; hiện nguyên nhân |
| Lỗi hệ thống | Không xác nhận trạng thái mới; Toggle về trạng thái ban đầu; Toast lỗi |
| Mất kết nối, timeout | Không coi là thành công khi chưa có kết quả; xử lý theo mục 4.6 |
| Đang xử lý | Không gửi thêm yêu cầu trên cùng bản ghi |

## Phân hệ dùng lại

Danh mục dùng chung (danh mục và bảng ánh xạ mã của nguồn), Thông báo, người dùng và đơn vị, dịch vụ nhật ký, kho tệp dùng lại thiết kế của các phân hệ tương ứng; danh sách và điểm giao tiếp ở mục 2.2, không mô tả lại tại đây. Quy tắc dùng chung của tài liệu thiết kế Quản lý đề xuất mua sắm, Quản lý khoản đầu tư mà module dẫn chiếu (hồ sơ chi phối, phạm vi xem) ghi mã quy tắc tại chỗ dùng.

# THIẾT KẾ CƠ SỞ DỮ LIỆU

## Cơ sở dữ liệu module Quản lý đề tài / dự án

### Mô hình dữ liệu

Hệ thống sử dụng các thành phần lưu trữ sau:

- **MariaDB:** lưu dữ liệu của module: đề tài / dự án, khoản mục dự toán, văn bản pháp lý, lần đồng bộ và chi tiết của nó. Cấu trúc bảng quản lý bằng Liquibase, cùng cơ chế với các service hiện có.

- **Kho tệp MinIO:** lưu tệp văn bản pháp lý tải về từ nguồn. Bảng chỉ lưu mã tệp file_id.

- **Dịch vụ nhật ký dùng chung:** lưu nhật ký thao tác theo mục 2.3.5, không lưu trong các bảng dưới.

- **Danh mục dùng chung:** Loại dự án / đề tài, Loại dự án (chi tiết), Nguồn vốn, Cấp phê duyệt, Loại chi phí, Nhóm dự án, Loại sản phẩm, Lĩnh vực, Tình trạng pháp lý, Tình trạng mua sắm, đơn vị tính và bảng ánh xạ mã của nguồn do phân hệ Danh mục quản lý; đơn vị, người dùng do hệ thống người dùng quản lý; module chỉ lưu mã tham chiếu.

- **Bảng của Quản lý đề xuất mua sắm, Quản lý khoản đầu tư:** module đọc (không ghi) các cột ở mục 5.1.2, phần Cột của module khác để tính phần khả dụng, dòng con, tab liên quan. Liên kết hạng mục ↔ khoản mục do hai module đó ghi khi bóc tách (BR-DADT-C-06).

Mô hình thực thể liên kết:

<img src="media/rId202.png" style="width:6.25in;height:5.76923in" alt="Mô hình thực thể liên kết: đề tài / dự án, dự toán, nguồn dữ liệu" />

Mũi tên đi từ bảng con tới bảng cha theo khóa ngoại. proposal_item, investment_item là bảng của module khác, vẽ để thấy liên kết tới khoản mục. Hình chỉ ghi các cột chính; đủ cột xem mục 5.1.2.

Các bảng dữ liệu như sau:

| STT | Table | Loại | Mô tả |
|----|----|----|----|
| 1 | project | MariaDB | Đề tài / dự án: thông tin chung, phê duyệt, nguồn dữ liệu |
| 2 | project_cost_item | MariaDB | Khoản mục dự toán của đề tài; gồm cờ Chi mua sắm, đánh dấu Hoàn thành do TTMS ghi |
| 3 | project_legal_doc | MariaDB | Văn bản pháp lý của đề tài |
| 4 | project_sync_run | MariaDB | Một lần đồng bộ (DTMS_CN_0250) |
| 5 | project_sync_issue | MariaDB | Kết quả, cảnh báo, lỗi theo từng đề tài của lần đồng bộ |
| 6 | code_sequence | MariaDB | Bộ đếm sinh mã lần đồng bộ |
| 7 | proposal, proposal_item, investment, investment_item | MariaDB, module khác | Cột module đọc (mục 5.1.2, phần Cột của module khác) |

### Chi tiết các bảng CSDL

Quy ước: Nullable x là được rỗng; Unikey x là duy nhất (kể cả khi kết hợp, ghi rõ ở mục 5.1.3); P/F Key: P khóa chính, F khóa ngoại tới bảng trong module, F\* mã tham chiếu tới danh mục, người dùng, kho tệp hoặc hệ thống khác (không ràng buộc khóa ngoại trong CSDL). Mã trạng thái theo mục 2.3.1.4, kiểu VARCHAR(20). **Giá trị tiền theo đồng, số nguyên** (BR-DADT-C-12), kiểu BIGINT; khác SRS ĐXMS, KĐT lưu tỷ đồng, phép quy đổi theo BR-DADT-C-07.

**Cột chung của mọi bảng**, không nhắc lại trong từng bảng:

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | id | BIGINT |  | x | P | Tự tăng | Khóa chính |
| 2 | created_at | DATETIME |  |  |  | Thời điểm ghi | Thời điểm tạo |
| 3 | created_by | VARCHAR(100) |  |  | F\* | Người dùng hiện tại | Tài khoản người tạo; "system" khi hệ thống ghi (đồng bộ theo lịch) |
| 4 | updated_at | DATETIME | x |  |  |  | Thời điểm cập nhật gần nhất |
| 5 | updated_by | VARCHAR(100) | x |  | F\* |  | Tài khoản người cập nhật gần nhất |

#### project

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(50) |  | x |  | Theo nguồn | Mã dự án / đề tài (BR-DADT-C-02). Lưu sau khi bỏ khoảng trắng đầu cuối; so khớp không phân biệt hoa thường (collation không phân biệt hoa thường). Không sửa |
| 2 | name | VARCHAR(500) |  |  |  |  | Tên dự án / đề tài |
| 3 | type_code | VARCHAR(50) |  |  | F\* |  | Loại dự án / đề tài (danh mục) |
| 4 | type_detail_code | VARCHAR(50) | x |  | F\* |  | Loại dự án (chi tiết) (danh mục, có Loại cha) |
| 5 | annual_plan | TINYINT(1) | x |  |  |  | Lập theo kế hoạch năm: 1 Có, 0 Không |
| 6 | approval_level_code | VARCHAR(50) | x |  | F\* |  | Cấp phê duyệt (danh mục) |
| 7 | group_code | VARCHAR(50) | x |  | F\* |  | Nhóm dự án (danh mục) |
| 8 | product_type_code | VARCHAR(50) | x |  | F\* |  | Loại sản phẩm (danh mục) |
| 9 | plan_code | VARCHAR(50) | x |  |  |  | Mã dự án theo KHĐT năm |
| 10 | sap_code | VARCHAR(50) | x |  |  |  | Mã dự án SAP |
| 11 | portal_id | VARCHAR(50) | x |  |  |  | ID dự án trên cổng Đấu thầu QG |
| 12 | secret | TINYINT(1) |  |  |  | 0 | Mật: 1 Có, 0 Không (BR-DADT-C-10) |
| 13 | secret_code | VARCHAR(50) | x |  |  |  | Mã dự án Mật; chỉ có khi secret = 1 |
| 14 | fund_code | VARCHAR(50) | x |  | F\* |  | Nguồn vốn (danh mục) |
| 15 | field_code | VARCHAR(50) | x |  | F\* |  | Lĩnh vực (danh mục) |
| 16 | unit_id | VARCHAR(50) | x |  | F\* |  | Đơn vị lập; rỗng khi nguồn gửi đơn vị không khớp (DTMS_CN_0250). Khối suy từ đơn vị (BR-DADT-01-05) |
| 17 | owner_user_id | VARCHAR(100) | x |  | F\* |  | Tài khoản Chủ nhiệm, khi khớp (BR-DADT-01-08) |
| 18 | owner_name | VARCHAR(255) | x |  |  |  | Họ tên Chủ nhiệm theo nguồn |
| 19 | reporter_user_id | VARCHAR(100) | x |  | F\* |  | Tài khoản Người phụ trách báo cáo, khi khớp |
| 20 | reporter_name | VARCHAR(255) | x |  |  |  | Họ tên Người phụ trách báo cáo theo nguồn |
| 21 | scope | TEXT | x |  |  |  | Nội dung, quy mô dự án (thông tin sản phẩm) |
| 22 | location | VARCHAR(500) | x |  |  |  | Địa điểm đầu tư |
| 23 | start_label | VARCHAR(50) | x |  |  |  | Nhãn thời gian bắt đầu, ví dụ "Quý II/2024" (BR-DADT-01-03) |
| 24 | start_date | DATE | x |  |  |  | Ngày bắt đầu |
| 25 | end_label | VARCHAR(50) | x |  |  |  | Nhãn thời gian kết thúc |
| 26 | end_date | DATE | x |  |  |  | Ngày kết thúc |
| 27 | total_estimate | BIGINT | x |  |  |  | Tổng dự toán theo nguồn, đồng; chỉ dùng khi chưa có dự toán chi tiết (BR-DADT-01-04) |
| 28 | total_procurement | BIGINT | x |  |  |  | Tổng giá trị đầu tư mua sắm theo nguồn, đồng; như trên |
| 29 | settlement_value | BIGINT | x |  |  |  | Giá trị quyết toán theo nguồn, đồng |
| 30 | status | VARCHAR(20) |  |  |  |  | Trạng thái đề tài (mục 2.3.1.1), theo nguồn |
| 31 | legal_status_code | VARCHAR(50) | x |  | F\* |  | Tình trạng pháp lý (danh mục) |
| 32 | purchase_status_code | VARCHAR(50) | x |  | F\* |  | Tình trạng mua sắm (danh mục) |
| 33 | accepted_on | VARCHAR(50) | x |  |  |  | Ngày nghiệm thu, có thể là văn bản theo nguồn |
| 34 | policy_no | VARCHAR(100) | x |  |  |  | Số TTr chủ trương |
| 35 | policy_date | DATE | x |  |  |  | Ngày TTr chủ trương |
| 36 | decision_no | VARCHAR(100) | x |  |  |  | Số QĐ phê duyệt dự án |
| 37 | decision_date | DATE | x |  |  |  | Ngày QĐ phê duyệt dự án (lọc Ngày QĐ đầu tư, DTMS_CN_0240) |
| 38 | estimate_decision_no | VARCHAR(100) | x |  |  |  | Số QĐ phê duyệt dự toán |
| 39 | estimate_decision_date | DATE | x |  |  |  | Ngày QĐ phê duyệt dự toán |
| 40 | settlement_decision_no | VARCHAR(100) | x |  |  |  | Số QĐ phê duyệt quyết toán |
| 41 | settlement_decision_date | DATE | x |  |  |  | Ngày QĐ phê duyệt quyết toán |
| 42 | policy_approver | VARCHAR(255) | x |  |  |  | Người phê duyệt chủ trương, văn bản theo nguồn |
| 43 | project_approver | VARCHAR(255) | x |  |  |  | Người phê duyệt dự án |
| 44 | estimate_approver | VARCHAR(255) | x |  |  |  | Người phê duyệt dự toán |
| 45 | settlement_approver | VARCHAR(255) | x |  |  |  | Người phê duyệt quyết toán |
| 46 | source | VARCHAR(20) |  |  |  |  | Nguồn dữ liệu: mã theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4; đổi theo BR-DADT-04-02, BR-DADT-04-06 |
| 47 | synced_at | DATETIME | x |  |  |  | Cập nhật từ nguồn lúc: thời điểm lần đồng bộ gần nhất ghi đề tài |
| 48 | source_updated_at | DATETIME | x |  |  |  | Thời điểm cập nhật ở nguồn (GT-01); rỗng với đề tài chuyển từ hệ thống cũ chưa được đồng bộ |
| 49 | previous_code | VARCHAR(50) | x |  |  |  | Mã dự án / đề tài cũ (BR-DADT-C-02); không ràng buộc khóa ngoại vì đề tài cũ có thể không có trên ĐTMS |
| 50 | missing_at_source_at | DATETIME | x |  |  |  | Không còn ở nguồn: thời điểm lần Toàn bộ đầu tiên không còn thấy đề tài ở nguồn; rỗng khi còn ở nguồn (BR-DADT-04-02) |
| 51 | version | INT |  |  |  | 0 | Khóa lạc quan; tăng mỗi lần ghi đề tài |

#### project_cost_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | project_id | BIGINT |  | x | F |  | Đề tài của khoản mục |
| 2 | source_key | VARCHAR(100) |  | x |  |  | Mã khoản mục ở nguồn; duy nhất trong đề tài; dùng khớp khi đồng bộ lại (BR-DADT-04-05) |
| 3 | sort_no | INT |  |  |  |  | Thứ tự trong dự toán của nguồn; nguồn không gửi thì theo thứ tự trong danh sách GT-02 (BR-DADT-02-01, BR-DADT-04-05) |
| 4 | cost_type_code | VARCHAR(50) |  |  | F\* |  | Loại chi phí (danh mục, mặc định PL1 – PL6) |
| 5 | name | VARCHAR(500) |  |  |  |  | Khoản mục chi phí |
| 6 | uom | VARCHAR(50) | x |  | F\* |  | Đơn vị tính (danh mục) |
| 7 | quantity | DECIMAL(18,3) | x |  |  |  | Số lượng (Khối lượng cần thực hiện); rỗng khi khoản mục không có số lượng |
| 8 | unit_price | BIGINT | x |  |  |  | Đơn giá theo nguồn, đồng; rỗng thì tính khi hiển thị (DTMS_CN_0243) |
| 9 | pre_tax | BIGINT |  |  |  |  | Giá trị trước thuế, đồng |
| 10 | vat_rate | DECIMAL(5,2) |  |  |  | 0 | %VAT |
| 11 | tax | BIGINT |  |  |  |  | Thuế GTGT, đồng (BR-DADT-04-05) |
| 12 | value | BIGINT |  |  |  |  | Giá trị sau thuế, đồng; là giá trị dòng căn cứ (BR-DADT-C-06) |
| 13 | note | VARCHAR(1000) | x |  |  |  | Ghi chú theo nguồn |
| 14 | source_procurement | TINYINT(1) | x |  |  |  | Cờ cần mua sắm của nguồn tại lần đầu khoản mục vào ĐTMS; chỉ dùng để đặt giá trị ban đầu (BR-DADT-C-03) |
| 15 | procurement | TINYINT(1) |  |  |  | 0 | Chi mua sắm: 1 Có, 0 Không. Chỉ TTMS ghi (DTMS_CN_0244); đồng bộ không ghi đè |
| 16 | item_status | VARCHAR(20) | x |  |  |  | Đánh dấu Hoàn thành của TTMS: DONE hoặc rỗng (mục 2.3.1.2). Chưa mua sắm, Đang mua sắm, Đã phê duyệt tính khi đọc, không lưu; rỗng khi procurement = 0 |
| 17 | active | VARCHAR(20) |  |  |  | ACTIVE | Hiệu lực: ACTIVE Còn hiệu lực, INACTIVE Ngừng sử dụng (BR-DADT-C-09) |
| 18 | inactive_at | DATETIME | x |  |  |  | Thời điểm chuyển Ngừng sử dụng; rỗng khi Còn hiệu lực |
| 19 | version | INT |  |  |  | 0 | Khóa lạc quan, phát hiện TTMS và đồng bộ cùng ghi (DTMS_CN_0244, DTMS_CN_0250) |

Đã đăng ký, Đang giữ, Còn lại khả dụng, Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm không lưu (giá trúng thầu, giá trị ký, giá trị sau tất toán đọc từ Lựa chọn nhà thầu, Hợp đồng khi hai module triển khai): tính khi đọc theo BR-DADT-C-07, BR-DADT-02-05 từ bảng ở mục 5.1.2, phần Cột của module khác.

#### project_legal_doc

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | project_id | BIGINT |  | x | F |  | Đề tài của văn bản |
| 2 | source_key | VARCHAR(100) | x | x |  |  | Mã văn bản ở nguồn; duy nhất trong đề tài khi khác rỗng; rỗng với văn bản chuyển từ hệ thống cũ không có mã |
| 3 | doc_no | VARCHAR(100) | x |  |  |  | Số văn bản |
| 4 | doc_date | DATE | x |  |  |  | Ngày văn bản |
| 5 | signer | VARCHAR(255) | x |  |  |  | Người ký, văn bản theo nguồn |
| 6 | content | VARCHAR(2000) | x |  |  |  | Nội dung |
| 7 | note | VARCHAR(1000) | x |  |  |  | Ghi chú |
| 8 | file_id | VARCHAR(100) | x |  | F\* |  | Mã tệp trong kho tệp; rỗng khi chưa có tệp hoặc tải tệp lỗi |
| 9 | file_name | VARCHAR(255) | x |  |  |  | Tên tệp gốc, dùng khi tải (DTMS_CN_0249) |
| 10 | source_file_key | VARCHAR(100) | x |  |  |  | Mã tệp ở nguồn (GT-03); đổi thì tải lại tệp |
| 11 | deleted | TINYINT(1) |  |  |  | 0 | 1 khi văn bản không còn ở nguồn: không hiện ở tab Văn bản pháp lý, giữ để tra cứu; văn bản xuất hiện lại thì về 0, cập nhật như văn bản có ở cả hai |

#### project_sync_run

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  | Hệ thống sinh | Mã lần DB-YYYY-NNNNN, cấp qua code_sequence |
| 2 | trigger_type | VARCHAR(20) |  |  |  |  | Cách chạy: SCHEDULE Theo lịch, MANUAL Thủ công |
| 3 | scope | VARCHAR(20) |  |  |  | CHANGED | Phạm vi: CHANGED Thay đổi từ mốc, FULL Toàn bộ, ONE Một đề tài (BR-DADT-04-01) |
| 4 | scope_code | VARCHAR(50) | x |  |  |  | Mã đề tài khi scope = ONE |
| 5 | request_code | VARCHAR(50) | x | x |  |  | Mã yêu cầu của hộp thoại Đồng bộ ngay (mục 4.6.6); rỗng với lần theo lịch |
| 6 | since_at | DATETIME | x |  |  |  | Mốc đã dùng; rỗng khi lấy toàn bộ |
| 7 | started_at | DATETIME |  |  |  | Thời điểm ghi | Bắt đầu |
| 8 | ended_at | DATETIME | x |  |  |  | Kết thúc; rỗng khi đang chạy |
| 9 | status | VARCHAR(20) |  |  |  | RUNNING | RUNNING, SUCCESS, PARTIAL, FAILED (mục 2.3.1.3) |
| 10 | list_complete | TINYINT(1) |  |  |  | 0 | 1 khi đã lấy đủ danh sách thay đổi (GT-01); dùng xác định mốc (BR-DADT-04-01) |
| 11 | fetched_count | INT |  |  |  | 0 | Số đề tài lấy về |
| 12 | added_count | INT |  |  |  | 0 | Số đề tài thêm mới |
| 13 | updated_count | INT |  |  |  | 0 | Số đề tài cập nhật |
| 14 | unchanged_count | INT |  |  |  | 0 | Số đề tài không đổi |
| 15 | error_count | INT |  |  |  | 0 | Số đề tài lỗi |
| 16 | inactive_item_count | INT |  |  |  | 0 | Số khoản mục chuyển Ngừng sử dụng |
| 17 | retry_count | INT |  |  |  | 0 | Số lần thử lại khi không lấy được dữ liệu |
| 18 | error_message | VARCHAR(1000) | x |  |  |  | Lỗi chung của lần khi FAILED |
| 19 | heartbeat_at | DATETIME | x |  |  |  | Dấu hiệu sống: tiến trình cập nhật mỗi phút khi Đang chạy; quá 10 phút không cập nhật là bị gián đoạn (BR-DADT-04-01) |

#### project_sync_issue

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | run_id | BIGINT |  |  | F |  | Lần đồng bộ |
| 2 | project_code | VARCHAR(50) |  |  |  |  | Mã đề tài theo nguồn (có thể chưa có trên ĐTMS) |
| 3 | project_name | VARCHAR(500) | x |  |  |  | Tên đề tài theo nguồn |
| 4 | result | VARCHAR(20) |  |  |  |  | ADDED Thêm mới, UPDATED Cập nhật, WARNING Cảnh báo (gồm "Không còn ở nguồn.", "Không tìm thấy ở nguồn khi lấy lại."), ERROR Lỗi. Đề tài Không đổi không có dòng |
| 5 | part | VARCHAR(255) | x |  |  |  | Phần lỗi, cảnh báo: Thông tin chung, Khoản mục {mã}, Văn bản {số} |
| 6 | message | VARCHAR(2000) | x |  |  |  | Nội dung |
| 7 | resolved | TINYINT(1) |  |  |  | 0 | Với ERROR: 1 khi lỗi đã đóng (BR-DADT-04-03) |
| 8 | resolved_at | DATETIME | x |  |  |  | Thời điểm đóng lỗi |
| 9 | resolved_by | VARCHAR(100) | x |  | F\* |  | Quản trị bỏ qua lỗi; "system" khi đóng tự động |
| 10 | resolve_note | VARCHAR(500) | x |  |  |  | Lý do bỏ qua lỗi, hoặc cách đóng tự động |

#### code_sequence

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | prefix | VARCHAR(10) |  | x |  |  | Tiền tố: DB lần đồng bộ |
| 2 | year | INT |  | x |  |  | Năm |
| 3 | last_no | INT |  |  |  | 0 | Số đã cấp gần nhất; tăng trong cùng giao dịch tạo lần, không dùng lại |

**Dữ liệu chuyển từ hệ thống cũ.**

Không có bảng riêng. Đề tài, dự toán, văn bản pháp lý chuyển một lần ghi vào ba bảng trên với project.source = MIGRATION; khoản mục thiếu mã ở hệ thống cũ được cấp source_key theo thứ tự dòng khi chuyển.

**Cột của module khác module đọc.**

Các bảng sau thuộc tài liệu thiết kế Quản lý đề xuất mua sắm, Quản lý khoản đầu tư; chỉ liệt kê cột module này đọc. Kiểu, ràng buộc theo tài liệu của module đó.

#### proposal

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  |  | Mã đề xuất mua sắm (tab liên quan, dòng con) |
| 2 | title | VARCHAR(500) |  |  |  |  | Tên đề xuất mua sắm |
| 3 | mission_code | VARCHAR(50) |  |  | F\* |  | Mã đề tài; = project.code (BR-DADT-03-01) |
| 4 | unit_id | VARCHAR(50) |  |  | F\* |  | Đơn vị đề xuất |
| 5 | status | VARCHAR(20) |  |  |  |  | Trạng thái đề xuất mua sắm |
| 6 | effective_profile_id | BIGINT | x |  | F |  | Hồ sơ có hiệu lực, dùng xác định hồ sơ chi phối (BR-DXMS-C-30) |

#### proposal_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ của hạng mục |
| 2 | cost_item_id | BIGINT | x |  | F |  | Khoản mục dự toán liên kết (BR-DADT-C-06); rỗng với hạng mục không bóc tách từ đề tài. Thêm theo thay-doi.tsv SRS-DXMS 05/11 |
| 3 | proposed_qty | DECIMAL(18,3) |  |  |  |  | SL đề xuất (BR-DADT-C-07) |
| 4 | confirmed | TINYINT(1) |  |  |  |  | Đã xác nhận ở bước lập hạng mục; nháp không tính (BR-DADT-C-07) |

#### investment

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  |  | Mã khoản đầu tư |
| 2 | title | VARCHAR(500) |  |  |  |  | Tên khoản đầu tư |
| 3 | mission_code | VARCHAR(50) |  |  | F\* |  | Mã đề tài; = project.code (BR-DADT-03-01) |
| 4 | unit_id | VARCHAR(50) |  |  | F\* |  | Đơn vị đề xuất |
| 5 | status | VARCHAR(20) |  |  |  |  | Trạng thái khoản đầu tư |

#### investment_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT | x |  | F |  | Hồ sơ của hạng mục; rỗng với phần khai báo trên khoản đầu tư chưa có hồ sơ |
| 2 | cost_item_id | BIGINT | x |  | F |  | Khoản mục dự toán liên kết (BR-DADT-C-06). Thêm theo thay-doi.tsv SRS-KDT 05/11 |
| 3 | proposed_qty | DECIMAL(18,3) |  |  |  |  | SL đề xuất |
| 4 | confirmed | TINYINT(1) |  |  |  |  | Đã xác nhận ở bước lập hạng mục |
| 5 | investment_id | BIGINT |  |  | F |  | Khoản đầu tư của hạng mục, dùng lập dòng con khi chưa có hồ sơ (BR-DADT-02-06) |

Hồ sơ chi phối của khoản đầu tư xác định theo BR-KDT-02-10 trên bảng profile của module đó. Thành tiền theo cơ sở giá, hồ sơ chi phối, trạng thái hồ sơ đọc theo bảng quotation_item, quote_line, profile của từng module (BR-DXMS-04-10, BR-KDT-04-10, BR-DXMS-C-30, BR-KDT-02-10). Gói thầu, hợp đồng đọc qua giao tiếp của module Lựa chọn nhà thầu, Hợp đồng (mục 2.2), chưa có thiết kế bảng.

### Constraint

| STT | Bảng | Ràng buộc | Nội dung |
|----|----|----|----|
| 1 | Mọi bảng | Khóa chính | id |
| 2 | project | Duy nhất | code, không phân biệt hoa thường (BR-DADT-C-02) |
| 3 | project | Kiểm tra | secret = 0 thì secret_code rỗng; source thuộc các mã Nguồn dữ liệu của tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4; total_estimate, total_procurement, settlement_value ≥ 0 |
| 4 | project_cost_item | Duy nhất | (project_id, source_key) |
| 5 | project_cost_item | Khóa ngoại | project_id → project |
| 6 | project_cost_item | Kiểm tra | quantity, unit_price, pre_tax, tax, value ≥ 0; vat_rate từ 0 tới 100; item_status rỗng hoặc DONE; procurement = 0 thì item_status rỗng |
| 7 | project_legal_doc | Duy nhất | (project_id, source_key) khi source_key khác rỗng |
| 8 | project_legal_doc | Khóa ngoại | project_id → project |
| 9 | project_sync_run | Duy nhất | code; request_code khi khác rỗng |
| 10 | project_sync_issue | Khóa ngoại | run_id → project_sync_run |
| 11 | code_sequence | Duy nhất | (prefix, year) |

Không có xóa theo bảng cha: đề tài, khoản mục không xóa (BR-DADT-C-09). Một lần đồng bộ chạy tại một thời điểm (BR-DADT-04-01) bảo đảm bằng khóa ứng dụng, không bằng ràng buộc bảng.

### Index

| STT | Tên index | Bảng | Cột | Mục đích |
|----|----|----|----|----|
| 1 | idx_project_list | project | start_date, code | Sắp mặc định danh sách (BR-DADT-01-01) |
| 2 | idx_project_filter | project | type_code, status, unit_id | Lọc danh sách; chọn đề tài Đang thực hiện ở module khác (BR-DADT-C-04) |
| 3 | idx_project_decision | project | decision_date | Lọc Ngày QĐ đầu tư |
| 4 | idx_project_secret | project | secret, unit_id | Lọc phạm vi xem đề tài Mật (BR-DADT-C-10) |
| 5 | idx_cost_item_project | project_cost_item | project_id, active, sort_no | Bảng dự toán (BR-DADT-02-01) |
| 6 | idx_cost_item_pick | project_cost_item | project_id, procurement, item_status, active | Danh sách khoản mục bóc tách được (BR-DADT-C-05) |
| 7 | idx_legal_doc_project | project_legal_doc | project_id, deleted, doc_date | Tab Văn bản pháp lý (BR-DADT-03-04) |
| 8 | idx_sync_run_list | project_sync_run | started_at, status | Bảng lần đồng bộ |
| 9 | idx_sync_run_since | project_sync_run | scope, list_complete, started_at | Xác định mốc (BR-DADT-04-01) |
| 10 | idx_sync_issue_open | project_sync_issue | result, resolved, project_code | Đề tài còn lỗi cần lấy lại (BR-DADT-04-03) |
| 11 | idx_proposal_item_cost | proposal_item | cost_item_id | Tính phần khả dụng (BR-DADT-C-07); index đặt ở CSDL của module Quản lý đề xuất mua sắm |
| 12 | idx_investment_item_cost | investment_item | cost_item_id | Như trên, module Quản lý khoản đầu tư |
| 13 | idx_project_owner | project | owner_user_id; reporter_user_id (index riêng) | Phạm vi xem đề tài Mật theo Chủ nhiệm, Người phụ trách báo cáo (BR-DADT-C-10) |
| 14 | idx_project_previous | project | previous_code | Dòng "Được thay bởi" ở Chi tiết, Từ khóa theo Mã cũ (BR-DADT-C-02) |

Mọi cột khóa ngoại có index riêng nếu không là cột đầu của index trên.

### Trigger

Không sử dụng. Đổi Nguồn dữ liệu, Hiệu lực khoản mục, số liệu lần đồng bộ do service thực hiện trong cùng giao dịch với thao tác ghi.

### Store Procedure/Function

Không sử dụng. Logic khớp, kiểm tra, tính phần khả dụng nằm ở service.

# THIẾT KẾ ĐẢM BẢO TUÂN THỦ TIÊU CHUẨN QUẢN TRỊ DỮ LIỆU

Mục này liệt kê dữ liệu của module cần quản trị, bảo mật, kiểm soát chất lượng, quản lý siêu dữ liệu và lưu trữ. Tên bảng, trường theo mục 5.

## Quản trị dữ liệu

Bảng danh mục dữ liệu CDE:

| STT | Tên trường dữ liệu | Mô tả | Bảng dữ liệu | Trường dữ liệu | Loại dữ liệu | Chủ sở hữu dữ liệu |
|----|----|----|----|----|----|----|
| 1 | Mã dự án / đề tài | Mã định danh, duy nhất toàn hệ thống, do hệ thống nguồn cấp (BR-DADT-C-02) | project | code | Dữ liệu chủ | Hệ thống nguồn của đề tài (phân hệ Quản lý Khoa học công nghệ, HR Tool, hoặc hệ thống cũ với đề tài chuyển một lần) |
| 2 | Tên, Loại dự án / đề tài | Tên, phân loại cấp một và chi tiết | project | name, type_code, type_detail_code | Dữ liệu chủ | Như dòng 1 |
| 3 | Đơn vị lập, Chủ nhiệm | Đơn vị chủ trì, người chịu trách nhiệm đề tài; quyết định phạm vi xem đề tài Mật (BR-DADT-C-10) | project | unit_id, owner_user_id, reporter_user_id | Dữ liệu chủ | Như dòng 1 |
| 4 | Mật | Độ mật của đề tài (BR-DADT-C-10) | project | secret, secret_code | Dữ liệu chủ | Như dòng 1 |
| 5 | Trạng thái đề tài | Đang thực hiện, Hoàn thành, Dừng thực hiện; quyết định đề tài được chọn làm căn cứ (BR-DADT-C-04) | project | status | Dữ liệu chủ | Như dòng 1 |
| 6 | Quyết định phê duyệt | Số, ngày TTr chủ trương, QĐ phê duyệt dự án, dự toán, quyết toán | project | policy_no, decision_no, estimate_decision_no, settlement_decision_no và cột ngày tương ứng | Dữ liệu chủ | Như dòng 1 |
| 7 | Khoản mục dự toán | Loại chi phí, tên, số lượng, giá trị trước thuế, thuế, giá trị sau thuế; là dòng căn cứ của đề xuất mua sắm, khoản đầu tư (BR-DADT-C-06) | project_cost_item | cost_type_code, name, quantity, pre_tax, tax, value | Dữ liệu chủ | Như dòng 1 |
| 8 | Chi mua sắm, Hoàn thành khoản mục | Khoản mục phải mua qua đầu mối mua sắm, đã mua xong (BR-DADT-02-03, 02-04) | project_cost_item | procurement, item_status | Dữ liệu giao dịch | TTMS |
| 9 | Hiệu lực khoản mục | Còn hiệu lực, Ngừng sử dụng (BR-DADT-C-09) | project_cost_item | active | Dữ liệu giao dịch | Hệ thống (theo nguồn) |
| 10 | Văn bản pháp lý | Số, ngày, người ký, nội dung, tệp | project_legal_doc | doc_no, doc_date, signer, content, file_id | Dữ liệu tham chiếu | Như dòng 1 |
| 11 | Nguồn dữ liệu | Giá trị theo tài liệu thiết kế Đồng bộ đề tài / dự án, mục 2.3.1.4; thời điểm cập nhật từ nguồn (BR-DADT-C-01) | project | source, synced_at | Dữ liệu giao dịch | Hệ thống |
| 12 | Lần đồng bộ | Trạng thái, số liệu, lỗi từng đề tài | project_sync_run, project_sync_issue | status, result, message | Dữ liệu giao dịch | Quản trị hệ thống |

Đã đăng ký, Đang giữ, Còn lại khả dụng, Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm, chỉ số thực hiện là dữ liệu tính, không lưu (mục 5.1.2), chủ sở hữu là dữ liệu nguồn của Quản lý đề xuất mua sắm, Quản lý khoản đầu tư, Hợp đồng.

## Bảo mật dữ liệu

Danh sách dữ liệu cần tuân thủ tiêu chuẩn bảo mật:

| STT | Tên trường dữ liệu | Hệ thống/Phân hệ | Phân cấp bảo mật | Phân loại bảo mật | Định nghĩa các vai trò và phân quyền dữ liệu tương ứng | Làm mờ - marking dữ liệu |
|----|----|----|----|----|----|----|
| 1 | Toàn bộ dữ liệu đề tài / dự án có Mật = Có, gồm dự toán, văn bản pháp lý, tệp | ĐTMS / Quản lý đề tài / dự án | Mật | Dữ liệu nghiệp vụ mật | Chỉ người theo BR-DADT-C-10 thấy; Mã dự án Mật chỉ người được cấp quyền Xem đề tài / dự án Mật. Người khác không có dòng trên danh sách, ô chọn, tệp xuất; mở bằng đường dẫn thì báo không có quyền | Không làm mờ với người được xem; nhãn Mật ở chi tiết |
| 2 | Dự toán chi phí, giá trị quyết toán, Tổng dự toán | ĐTMS / Quản lý đề tài / dự án | Nội bộ | Dữ liệu tài chính | Mọi người dùng thấy đề tài thì thấy dự toán (mục 2.3.2) | Không làm mờ |
| 3 | Số liệu của đề xuất mua sắm, khoản đầu tư, gói thầu, hợp đồng ở dòng con, tab liên quan | ĐTMS / Quản lý đề tài / dự án | Nội bộ | Dữ liệu tài chính | Mã, giá trị của đối tượng người xem không được thấy hiện theo bảng hạn chế xem (BR-DADT-C-11); số liệu vẫn tính vào tổng | "Hạn chế xem", "-" theo BR-DADT-C-11 |
| 4 | Tài khoản dịch vụ, địa chỉ kết nối phân hệ Quản lý Khoa học công nghệ | ĐTMS / cấu hình hệ thống | Mật | Thông tin xác thực | Chỉ quản trị hạ tầng cấu hình; không hiện trên màn, không ghi vào nhật ký, chi tiết lần đồng bộ | Không hiện |
| 5 | Chi tiết lần đồng bộ (mã, tên đề tài, nội dung lỗi) | ĐTMS / Quản lý đề tài / dự án | Nội bộ | Dữ liệu kiểm soát | TTMS, Quản trị hệ thống (BR-DADT-04-10) | Mã, Tên đề tài Mật hiện "Hạn chế xem" với người không được thấy |
| 6 | Nhật ký thao tác | Dịch vụ nhật ký dùng chung | Nội bộ | Dữ liệu kiểm soát | Chỉ quản trị hệ thống truy vấn dịch vụ nhật ký (mục 2.3.5); TTMS xem lần đồng bộ qua DTMS_CN_0250 | Không làm mờ |

Giải pháp đảm bảo:

| Dữ liệu | DB | App | BI | SOC |
|----|----|----|----|----|
| Đề tài Mật (dòng 1) | Tài khoản ứng dụng riêng cho CSDL module; người dùng không truy cập trực tiếp CSDL | Lọc phạm vi xem ở phía xử lý cho danh sách, chi tiết, ô chọn của module khác, tệp xuất, tải tệp (BR-DADT-C-10), không chỉ ẩn trên giao diện | Không cung cấp cho kho dữ liệu, báo cáo | Ghi nhật ký tải tệp văn bản của đề tài Mật, kể cả lần bị từ chối (BR-DADT-03-04) |
| Dự toán, số liệu liên quan (dòng 2, 3) | Như trên | Bảng hạn chế xem áp ở phía xử lý (BR-DADT-C-11) | Không cung cấp | Ghi nhật ký xuất tệp, đổi Chi mua sắm, Hoàn thành khoản mục |
| Thông tin xác thực (dòng 4) | Không lưu trong bảng nghiệp vụ | Lưu ở kho cấu hình bí mật của hệ thống; truyền qua kết nối mã hóa | Không cung cấp | Ghi nhật ký lỗi xác thực khi đồng bộ |
| Tệp (dòng 1, 5) | Lưu trong kho tệp dùng chung, CSDL chỉ giữ mã tệp | Tải tệp qua phía xử lý, kiểm tra quyền trước khi trả tệp | Không cung cấp | Ghi nhật ký tải tệp |

## Chất lượng dữ liệu

Danh sách dữ liệu cần tuân thủ tiêu chuẩn chất lượng dữ liệu:

| STT | Luật check | Đối tượng check | Loại tiêu chuẩn đánh giá | Mô tả chi tiết luật đánh giá | Đầu vào cần cung cấp |
|----|----|----|----|----|----|
| 1 | Mã duy nhất | project.code, project_sync_run.code | Tính duy nhất | Không có hai đề tài cùng mã, so không phân biệt hoa thường (BR-DADT-C-02); mã lần không dùng lại | Bảng project, project_sync_run |
| 2 | Khoản mục duy nhất trong đề tài | project_cost_item.source_key | Tính duy nhất | Không có hai khoản mục cùng mã nguồn trong một đề tài (BR-DADT-04-05, 04-08) | Bảng project_cost_item |
| 3 | Trường bắt buộc | Đồng bộ: Mã, Tên, Loại, Trạng thái, Mật, Mã văn bản pháp lý; khoản mục: Mã khoản mục, Loại chi phí, Tên, Giá trị trước thuế | Tính đầy đủ | Không rỗng (bảng trường DTMS_CN_0250) | Dữ liệu nguồn |
| 4 | Tham chiếu còn hợp lệ | project.type_code, project.unit_id, project.fund_code, project_cost_item.cost_type_code, project_cost_item.uom | Tính toàn vẹn | Giá trị có trong danh mục, cơ cấu tổ chức tại lúc ghi. Đồng bộ: Loại, Loại chi phí không khớp thì lỗi bản ghi; trường danh mục khác, đơn vị (trừ đề tài Mật) để trống và cảnh báo (DTMS_CN_0250, BR-DADT-04-10) | Danh mục, bảng ánh xạ mã nguồn |
| 5 | Giá trị trong miền | Giá trị tiền, số lượng, %VAT | Tính hợp lệ | Không âm; %VAT từ 0 tới 100 (BR-DADT-04-05) | Bảng project, project_cost_item |
| 6 | Giá trị sau thuế khớp | project_cost_item.value | Tính nhất quán | Bằng Giá trị trước thuế + Thuế GTGT, lệch không quá 1 đồng (BR-DADT-04-05) | Bảng project_cost_item |
| 7 | Tổng giá trị đầu tư mua sắm không vượt Tổng dự toán | project.total_procurement | Tính nhất quán | Khi cả hai có giá trị. Đồng bộ: cảnh báo, vẫn ghi theo nguồn | Bảng project |
| 8 | Khoảng ngày hợp lệ | project.start_date, project.end_date | Tính hợp lệ | Ngày kết thúc không nhỏ hơn ngày bắt đầu. Đồng bộ: cảnh báo | Bảng project |
| 9 | Đánh dấu Hoàn thành nhất quán | project_cost_item.item_status | Tính nhất quán | Chỉ rỗng hoặc DONE; rỗng khi Chi mua sắm = Không (mục 2.3.1.2) | Bảng project_cost_item |
| 10 | Nguồn dữ liệu nhất quán | project.source | Tính nhất quán | Đồng bộ Khoa học công nghệ chỉ với Loại Khoa học công nghệ (BR-DADT-04-02, 04-06); Đồng bộ HR Tool theo tài liệu thiết kế Đồng bộ đề tài / dự án | Bảng project |
| 11 | Phần khả dụng không âm | Còn lại khả dụng của khoản mục | Tính hợp lệ | Âm là dấu hiệu nguồn giảm dự toán sau khi đã dùng; không chặn, báo TTMS (BR-DADT-C-09, 04-04) | Bảng project_cost_item, hạng mục của hai module |

## Quản lý siêu dữ liệu

### Thông tin đối tượng dữ liệu

| STT | Tên đối tượng | Mô tả | Loại đối tượng | Thông tin liên quan | Kiểu dữ liệu | Thời gian tạo | Thời gian chỉnh sửa lần cuối | Cấp độ bảo mật | Dữ liệu trọng yếu | Đơn vị chủ dữ liệu | Đầu mối quản lý dữ liệu | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 01 | project | Đề tài / dự án | Bảng | Mục 3.1.1 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật | Có | Đơn vị lập | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 02 | project_cost_item | Khoản mục dự toán | Bảng | Mục 3.1.2 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật của đề tài | Có | Đơn vị lập; TTMS với Chi mua sắm, Trạng thái | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 03 | project_legal_doc | Văn bản pháp lý | Bảng | Mục 3.1.3 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật của đề tài | Có | Đơn vị lập | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 04 | project_sync_run, project_sync_issue | Lần đồng bộ và chi tiết | Bảng | Mục 3.1.4 | Bảng quan hệ | Theo created_at | Theo updated_at | Nội bộ | Không | Quản trị hệ thống | Quản trị hệ thống | VHT | Đơn vị phát triển ĐTMS |
| 05 | Tệp văn bản pháp lý | Tệp tải về từ nguồn | Tệp | Mục 3.1.3 | Theo nguồn | Thời điểm tải về | Không sửa, chỉ thay khi nguồn đổi tệp | Theo Mật của đề tài | Có | Đơn vị lập | TTMS | VHT | Đơn vị phát triển ĐTMS |

### Thông tin hệ thống

| STT | Tên ứng dụng | Mô tả | Phiên bản | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|
| 01 | ĐTMS – Quản lý đề tài / dự án | Tra cứu đề tài / dự án, dự toán chi phí, phần khả dụng; đồng bộ | 1.0 | VHT | Đơn vị phát triển ĐTMS |

### Thông tin luồng dữ liệu

| STT | Tên luồng dữ liệu | Mô tả | Lệnh tổng hợp | Đầu mối quản lý | Hệ thống/nghiệp vụ sử dụng luồng |
|----|----|----|----|----|----|
| 01 | Đề tài / dự án Loại Khoa học công nghệ | Nhận thông tin chung, phê duyệt, dự toán, văn bản pháp lý, tệp từ phân hệ Quản lý Khoa học công nghệ (GT-01 – GT-03) | Chưa xác định | Khối Khoa học công nghệ | Đồng bộ (DTMS_CN_0250) |
| 02 | Đề tài / dự án từ HR Tool | Nhận thông tin chung đề tài / dự án Loại Sản xuất kinh doanh, Dự án đầu tư từ HR Tool | Theo tài liệu thiết kế Đồng bộ đề tài / dự án | Theo tài liệu thiết kế Đồng bộ đề tài / dự án | Đồng bộ HR Tool (tài liệu thiết kế Đồng bộ đề tài / dự án) |
| 03 | Chuyển từ hệ thống cũ | Đề tài đang thực hiện, dự toán, văn bản pháp lý của hệ thống quản lý đầu tư mua sắm cũ, một lần | Chưa xác định | TTMS | Đưa hệ thống vào sử dụng (BR-DADT-C-01) |
| 04 | Đề tài, khoản mục sang đề xuất mua sắm, khoản đầu tư | Hai module đọc đề tài được chọn, khoản mục bóc tách được, phần khả dụng; ghi liên kết hạng mục ↔ khoản mục (BR-DADT-C-04 – C-08) | Truy vấn trong ĐTMS | TTMS | Quản lý đề xuất mua sắm, Quản lý khoản đầu tư (mục 3.1.2 của hai module) |
| 05 | Hạng mục, gói thầu, hợp đồng về đề tài | Module đọc hạng mục, hồ sơ chi phối, gói thầu, giá trị phân bổ, hợp đồng để tính phần khả dụng, ba mốc giá trị, các tab liên quan | Truy vấn trong ĐTMS; giao tiếp Lựa chọn nhà thầu, Hợp đồng chưa xác định | TTMS | Dự toán chi phí, Thông tin liên quan (mục 3.1.2, 3.1.3) |

### Thông tin thuật ngữ nghiệp vụ

Thuật ngữ nghiệp vụ của module định nghĩa tại mục 1.3. Bảng sau ghi các thuật ngữ có quy tắc tính:

| STT | Tên thuật ngữ | Tên viết tắt / tên gợi nhớ | Định nghĩa | Quy tắc nghiệp vụ/công thức tính | Đơn vị định nghĩa thuật ngữ | Các thuật ngữ liên quan | Trường dữ liệu liên kết | Thời điểm tạo | Lịch sử chỉnh sửa |
|----|----|----|----|----|----|----|----|----|----|
| 01 | Đề tài / dự án | ĐT/DA | Mục 1.3 | BR-DADT-C-01, C-02 | VHT | Nhiệm vụ Khoa học công nghệ | project.code | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 02 | Tổng dự toán, Tổng giá trị đầu tư mua sắm | Tổng giá trị ĐTMS | Mục 1.3 | BR-DADT-01-04 | VHT | Khoản mục, Chi mua sắm | project_cost_item.value, project_cost_item.procurement, project.total_estimate, project.total_procurement | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 03 | Khoản mục bóc tách được | — | Mục 1.3 | BR-DADT-C-05 | VHT | Chi mua sắm, Hoàn thành khoản mục | project_cost_item.procurement, project_cost_item.item_status | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 04 | Đã đăng ký, Đang giữ, Còn lại khả dụng | — | Mục 1.3 | BR-DADT-C-07 | VHT | Hồ sơ chi phối | Tính, không lưu | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 05 | Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ, Giá trị tiết kiệm | — | Mục 1.3 | BR-DADT-02-05 | VHT | Lựa chọn nhà thầu, Hợp đồng, cơ sở giá | Tính, không lưu | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 06 | Tỷ lệ đã đăng ký mua | — | Mục 3.1.2 | BR-DADT-02-07 | VHT | Đã đăng ký, Đang giữ | Tính, không lưu | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 07 | Tỉ lệ thực hiện đầu tư mua sắm, Tỉ lệ thời gian thực hiện | — | Mục 3.1.1 | BR-DADT-01-07 | VHT | Gói thầu, hợp đồng liên quan | Tính, không lưu | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 08 | Số ngày còn thực hiện | — | Mục 3.1.1 | BR-DADT-01-02 | VHT | Thời gian kết thúc | project.end_date | 05/11/2026 | Theo bảng ghi nhận thay đổi |
| 09 | Mốc lấy thay đổi | — | Mục 3.1.4 | BR-DADT-04-01 | VHT | Lần đồng bộ | project_sync_run.started_at, project_sync_run.scope, project_sync_run.list_complete | 05/11/2026 | Theo bảng ghi nhận thay đổi |

## Lưu trữ và vận hành

| STT | Dữ liệu | Mô tả | Đối tượng dữ liệu | Thời gian lưu trữ trên hạ tầng tốc độ cao | Thời gian lưu trữ trên hạ tầng tốc độ trung bình | Thời gian lưu trữ trên hạ tầng tốc độ thấp (backup offline) | Tần suất backup |
|----|----|----|----|----|----|----|----|
|  | **Dữ liệu nghiệp vụ** |  |  |  |  |  |  |
| 01 | Đề tài / dự án, khoản mục, văn bản pháp lý | Bảng project, project_cost_item, project_legal_doc | Dữ liệu chủ | Toàn bộ thời gian vận hành | Không áp dụng | Lâu dài | Hằng ngày |
| 02 | Tệp văn bản pháp lý | Tệp trong kho tệp dùng chung | Tệp | Toàn bộ thời gian vận hành | Không áp dụng | Lâu dài | Hằng ngày |
|  | **Dữ liệu kiểm soát** |  |  |  |  |  |  |
| 03 | Lần đồng bộ | Bảng project_sync_run, project_sync_issue | Dữ liệu giao dịch | 1 năm, tính từ khi lần kết thúc; lần còn lỗi chưa đóng giữ trên hạ tầng tốc độ cao tới khi đóng | 2 năm | Theo dịch vụ sao lưu chung | Hằng ngày |
| 04 | Nhật ký thao tác | Mục 2.3.5 | Nhật ký | Theo dịch vụ nhật ký dùng chung | Theo dịch vụ nhật ký dùng chung | Theo dịch vụ nhật ký dùng chung | Theo dịch vụ nhật ký dùng chung |

Không xóa vật lý đề tài, khoản mục (BR-DADT-C-09). Văn bản pháp lý không còn ở nguồn chỉ đánh dấu, không xóa (mục 5.1.2).
