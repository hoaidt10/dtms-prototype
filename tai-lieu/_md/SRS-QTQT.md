<!-- pk-source: ../docs/SRS/02-srs/SRS Quản lý quy trình V1.0.docx -->
<!-- pk-sha256: 5972c22dbaba5fc6fc83960e1e92dfcef57a3129bc313782a69705d388dd9789 -->
<!-- pk-generated: 2026-11-02 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SRS-QTQT — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/02-srs/SRS Quản lý quy trình V1.0.docx`. Trích dẫn thì ghi mã **SRS-QTQT** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

<img src="media/image32.png" style="width:2.75833in;height:0.58611in" alt="D:\Picture\Logo\Viettel_logo_2021.svg.png" />

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI VIETTEL**

**\<ĐƠN VỊ\>**

**TÀI LIỆU THIẾT KẾ CHI TIẾT**

**QUẢN TRỊ QUY TRÌNH**

Mã hiệu dự án:

Mã hiệu tài liệu:

\<Địa điểm, Thời gian\>

**<span class="smallcaps">BẢNG GHI NHẬN THAY ĐỔI TÀI LIỆU</span>**

\*A – Tạo mới, M – Sửa đổi, D – Xóa bỏ

<table style="width:97%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 7%" />
<col style="width: 15%" />
<col style="width: 9%" />
<col style="width: 29%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr>
<td><p>Ngày</p>
<p>thay đổi</p></td>
<td><p>Vị trí</p>
<p>thay đổi</p></td>
<td><p>A*</p>
<p>M, D</p></td>
<td>Nguồn gốc</td>
<td><p>Phiên</p>
<p>bản cũ</p></td>
<td>Mô tả thay đổi</td>
<td><p>Phiên</p>
<p>bản mới</p></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

**<span class="smallcaps">Trang ký</span>**

Người lập: \<Ngày\>

\<Chức danh\>

Người xem xét: \<Ngày\>

\<Chức danh\>

Người xem xét: \<Ngày\>

\<Chức danh\>

Người phê duyệt: \<Ngày\>

\<Chức danh\>

**<span class="smallcaps">MỤC LỤC</span>**

[**<span class="smallcaps">1. GIỚI THIỆU 7</span>**](#_heading=h.q0krl1bhxt0u)

> [1.1 Mục đích 7](#mục-đích)
>
> [1.2 Phạm vi 7](#phạm-vi)
>
> [1.3 Khái niệm, thuật ngữ 8](#khái-niệm-thuật-ngữ)
>
> [1.4 Tài liệu tham khảo 8](#tài-liệu-tham-khảo)
>
> [1.5 Mô tả tài liệu 8](#mô-tả-tài-liệu)

[**<span class="smallcaps">2. TỔNG QUAN GIẢI PHÁP 8</span>**](#_heading=h.uljeknsjml6b)

> [2.1 Tổng quan chức năng 8](#tổng-quan-chức-năng)
>
> [2.2 Mô hình giao tiếp với hệ thống/Module chức năng khác 8](#mô-hình-giao-tiếp-với-hệ-thốngmodule-chức-năng-khác)
>
> [2.3 Các quy định chung 8](#các-quy-định-chung)

[**<span class="smallcaps">3. THIẾT KẾ CHI TIẾT 9</span>**](#_heading=h.sds40m25nk62)

> [3.1 THIẾT KẾ CHI TIẾT NGHIỆP VỤ 9](#thiết-kế-chi-tiết-nghiệp-vụ)
>
> [*3.1.1 Quản lý quy trình 9*](#_heading=)
>
> [*3.1.2. Quản lý Ma trận hành động 66*](#quản-lý-ma-trận-hành-động)

[**<span class="smallcaps">4. THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG 1</span>**](#_heading=h.spxnfilbge9)

> [4.1 Trường điều khiển dùng chung 1](#trường-điều-khiển-dùng-chung)
>
> [4.2 Bảng danh sách dùng chung 1](#bảng-danh-sách-dùng-chung)
>
> [*4.2.1 Thông tin chung chức năng 1*](#thông-tin-chung-chức-năng-10)
>
> [*4.2.2 Mô tả chi tiết các thành phần 1*](#mô-tả-chi-tiết-các-thành-phần-10)
>
> [*4.2.3 Quy tắc hiển thị bảng 1*](#quy-tắc-hiển-thị-bảng)
>
> [4.3 Kịch bản tìm kiếm và lọc dùng chung 1](#kịch-bản-tìm-kiếm-và-lọc-dùng-chung)
>
> [*4.3.1 Thông tin chung chức năng 1*](#thông-tin-chung-chức-năng-11)
>
> [*4.3.2 Mô tả chi tiết các thành phần 1*](#mô-tả-chi-tiết-các-thành-phần-11)
>
> [*4.3.3 Quy tắc tìm kiếm và lọc 1*](#quy-tắc-tìm-kiếm-và-lọc)
>
> [4.4 Phân trang dùng chung 1](#phân-trang-dùng-chung)
>
> [*4.4.1 Thông tin chung chức năng 1*](#thông-tin-chung-chức-năng-12)
>
> [*4.4.2 Mô tả chi tiết các thành phần 1*](#mô-tả-chi-tiết-các-thành-phần-12)
>
> [*4.4.3 Công thức tính 1*](#công-thức-tính)
>
> [*4.4.4 Quy tắc hiển thị 1*](#quy-tắc-hiển-thị)
>
> [4.5 Kiểm tra dữ liệu và thông báo lỗi dùng chung 1](#kiểm-tra-dữ-liệu-và-thông-báo-lỗi-dùng-chung)
>
> [*4.5.1 Thông tin chung 1*](#thông-tin-chung)
>
> [*4.5.2 Nguyên tắc kiểm tra dữ liệu 1*](#nguyên-tắc-kiểm-tra-dữ-liệu)
>
> [*4.5.3 Quy tắc hiển thị lỗi tại trường 1*](#quy-tắc-hiển-thị-lỗi-tại-trường)
>
> [*4.5.4 Các trường hợp kiểm tra dùng chung 1*](#các-trường-hợp-kiểm-tra-dùng-chung)
>
> [*4.5.5 Thông báo sai định dạng 1*](#thông-báo-sai-định-dạng)
>
> [*4.5.6 Kiểm tra tính duy nhất 1*](#kiểm-tra-tính-duy-nhất)
>
> [*4.5.7 Xử lý lỗi trả về từ phía xử lý 1*](#xử-lý-lỗi-trả-về-từ-phía-xử-lý)
>
> [4.6 Thông báo chung và trạng thái xử lý 1](#thông-báo-chung-và-trạng-thái-xử-lý)
>
> [*4.6.1 Thông tin chung 1*](#thông-tin-chung-1)
>
> [*4.6.2 Các hình thức thông báo 1*](#các-hình-thức-thông-báo)
>
> [*4.6.3 Quy tắc nội dung thông báo 1*](#quy-tắc-nội-dung-thông-báo)
>
> [*4.6.4 Trạng thái xử lý dùng chung 1*](#trạng-thái-xử-lý-dùng-chung)
>
> [*4.6.5 Quy tắc Loading 1*](#quy-tắc-loading)
>
> [*4.6.6 Quy tắc chống thao tác lặp 1*](#quy-tắc-chống-thao-tác-lặp)
>
> [*4.6.7 Xử lý kết quả thao tác thay đổi dữ liệu 1*](#xử-lý-kết-quả-thao-tác-thay-đổi-dữ-liệu)
>
> [4.7 Xóa bản ghi dùng chung 1](#xóa-bản-ghi-dùng-chung)
>
> [*4.7.1 Thông tin chung chức năng 1*](#thông-tin-chung-chức-năng-13)
>
> [*4.7.2 Mô tả chi tiết các thành phần 1*](#mô-tả-chi-tiết-các-thành-phần-13)
>
> [*4.7.3 Quy tắc xác định bản ghi xóa 1*](#quy-tắc-xác-định-bản-ghi-xóa)
>
> [*4.7.4 Quy tắc kiểm tra trước khi xóa 1*](#quy-tắc-kiểm-tra-trước-khi-xóa)
>
> [*4.7.5 Quy tắc xử lý sau khi xóa 1*](#quy-tắc-xử-lý-sau-khi-xóa)
>
> [*4.7.6 Các trường hợp xử lý 1*](#các-trường-hợp-xử-lý)
>
> [4.8 Bật/Tắt trạng thái dùng chung 1](#bậttắt-trạng-thái-dùng-chung)
>
> [*4.8.1 Thông tin chung chức năng 1*](#thông-tin-chung-chức-năng-14)
>
> [*4.8.2 Mô tả chi tiết các thành phần 1*](#mô-tả-chi-tiết-các-thành-phần-14)
>
> [*4.8.3 Quy tắc xác định trạng thái 1*](#quy-tắc-xác-định-trạng-thái)
>
> [*4.8.4 Quy tắc nội dung xác nhận 1*](#quy-tắc-nội-dung-xác-nhận)
>
> [*4.8.5 Kiểm tra trước khi cập nhật trạng thái 1*](#kiểm-tra-trước-khi-cập-nhật-trạng-thái)
>
> [*4.8.6 Quy tắc xử lý Toggle 1*](#quy-tắc-xử-lý-toggle)
>
> [*4.8.7 Quy tắc xử lý kết quả 1*](#quy-tắc-xử-lý-kết-quả)

[**<span class="smallcaps">5. THIẾT KẾ CƠ SỞ DỮ LIỆU 1</span>**](#_heading=h.rnbn4xtytk9h)

[**<span class="smallcaps">6. THIẾT KẾ ĐẢM BẢO TUÂN THỦ TIÊU CHUẨN QUẢN TRỊ DỮ LIỆU 1</span>**](#_heading=h.pgb18e7h8cq)

> [6.1 Quản trị dữ liệu 1](#quản-trị-dữ-liệu)
>
> [6.2 Bảo mật dữ liệu 1](#bảo-mật-dữ-liệu)
>
> [6.3 Chất lượng dữ liệu 1](#chất-lượng-dữ-liệu)
>
> [6.4 Quản lý siêu dữ liệu 1](#quản-lý-siêu-dữ-liệu)
>
> [*6.4.1 Thông tin đối tượng dữ liệu 1*](#thông-tin-đối-tượng-dữ-liệu)
>
> [*6.4.2 Thông tin hệ thống 1*](#thông-tin-hệ-thống)
>
> [*6.4.3 Thông tin luồng dữ liệu 1*](#thông-tin-luồng-dữ-liệu)
>
> [*6.4.4 Thông tin thuật ngữ nghiệp vụ 1*](#thông-tin-thuật-ngữ-nghiệp-vụ)
>
> [6.5 Lưu trữ và vận hành 1](#lưu-trữ-và-vận-hành)

[**<span class="smallcaps">7. PHỤ LỤC 1</span>**](#_heading=h.70i998r8n7zl)

1.  GIỚI THIỆU

\[Phần giới thiệu của tài liệu kiến trúc hệ thống cần cung cấp một cách tổng quan về tài liệu này bao gồm mục đích của tài liệu, các khái niệm, thuật ngữ và các tài liệu tham khảo liên quan.\]

**Mẫu bullet:**

- A

  - B

    - C

      - D

        - E

## Mục đích

\[Tài liệu này cung cấp một bức tranh toàn cảnh về hệ thống thông qua một số mô hình kiến trúc khác nhau nhằm miêu tả hệ thống dưới nhiều góc nhìn khác nhau. Tài liệu này được mong chờ sẽ ghi nhận và truyền đạt lại những quyết định quan trọng về kiến trúc của hệ thống.

\[Phần này định nghĩa vai trò hoặc mục đích của tài liệu kiến trúc hệ thống và giới thiệu một cách tóm tắt bố cục của tài liệu. Cần phải chỉ rõ ai sẽ đọc tài liệu này và sẽ sử dụng tài liệu này như thế nào.\]

## Phạm vi

\[Mô tả tóm tắt tài liệu Kiến trúc hệ thống phục vụ cho việc gì? Những tác động hoặc ảnh hưởng của tài liệu này là gì?\]

## Khái niệm, thuật ngữ

\[Phần này sẽ cung cấp các định nghĩa của tất cả các khái niệm, thuật ngữ… được sử dụng trong tài liệu Kiến trúc hệ thống.\]

## Tài liệu tham khảo

\[Phần liệt kê danh sách đầy đủ tất cả các tài liệu tham khảo bên ngoài. Mỗi tài liệu được xác định bằng tên tài liệu, tác giả và ngày phát hành đồng thời cũng phải chỉ rõ là tài liệu này có thể dùng được hay chỉ mang tính chất tham khảo. Nếu thích hợp cần chỉ rõ số hiệu báo cáo, tên tạp chí và tổ chức phát hành ra tài liệu.\]

## Mô tả tài liệu

\[Phần này sẽ giới thiệu nốt những gì còn lại, mà không thuộc 04 mục trên, của tài liệu Kiến trúc hệ thống đồng thời cũng giới thiệu bố cục của tài liệu Kiến trúc hệ thống.\]

2.  TỔNG QUAN GIẢI PHÁP

## Tổng quan chức năng

\[Sơ đồ phân rã chức năng\]

Ví dụ:

## Mô hình giao tiếp với hệ thống/Module chức năng khác

\[Sơ đồ quan hệ chức năng\]

Ví dụ:

## Các quy định chung

3.  THIẾT KẾ CHI TIẾT

## THIẾT KẾ CHI TIẾT NGHIỆP VỤ

### Quản lý quy trình

#### Xem danh sách Quy trình 

##### Thông tin chung chức năng

- Mã chức năng:

- Mục đích: Cho phép người dùng quản trị quy trình tra cứu danh sách các quy trình và các phiên bản tương ứng đã được ghi nhận trên hệ thống; hỗ trợ tìm kiếm, mở rộng/thu gọn phiên bản, phân trang và truy cập chi tiết từng phiên bản để nắm được tình trạng vận hành của quy trình.

- Người dùng mục tiêu: Quản trị hệ thống và Người dùng quản lý quy trình được cấp quyền chức năng Quản lý quy trình.

- Đường dẫn truy cập: Quản lý quy trình → Quản lý quy trình.

- Tiền điều kiện:

  - Người dùng đã đăng nhập

  - Phiên đăng nhập còn hiệu lực

  - Tài khoản đang hoạt động

  - Người dùng có quyền truy cập chức năng Quản lý quy trình.

- Hậu điều kiện:

  - Danh sách quy trình được hiển thị theo phạm vi quyền, từ khóa tìm kiếm và tham số phân trang hiện tại.

  - Các thao tác xem, tìm kiếm, mở rộng/thu gọn và phân trang không làm thay đổi dữ liệu quy trình.

- Requirements Traceability Matrix – RTM:

##### Màn hình

<img src="media/image6.png" style="width:8.8189in;height:6.95833in" />

##### Mô tả chi tiết các thành phần

**Quy tắc chung để lấy dữ liệu quy trình:**

- Quy trình lấy **loại nội dung BPMN diagram** trong **Tenant Đầu tư mua sắm.** Hệ thống thực hiện đồng bộ danh mục các quy trình BPMN đã được deploy trên Camunda thuộc phạm vi Đầu tư mua sắm theo cấu hình tenant hoặc cấu hình ánh xạ nghiệp vụ của hệ thống nội bộ. Nguồn dữ liệu chuẩn dùng để đồng bộ là process definition runtime trên Camunda.

- **Lấy cây dữ liệu như sau:**

  - Cấp 1: **Cấp 1** là quy trình cha, được nhóm theo **bpmnProcessId**, đại diện cho một quy trình nghiệp vụ logic, thuộc **Tenant = Đầu tư mua sắm** trên Camunda.

  - Cấp 2: **Quy trình** lấy theo **bpmnProcessId** trên Camunda. Camunda cho phép nhiều version của cùng process definition chạy song song khi cùng key/process ID được deploy lại. Lấy dữ liệu version của quy trình, mỗi bản ghi là một version deployed của quy trình; running instances vẫn gắn với version mà chúng được khởi tạo, còn instance mới sẽ chạy theo version mới nhất mặc định.

- Các thông tin dữ liệu lấy:

<img src="media/image34.png" style="width:7in;height:1.61111in" />

- Mã quy trình: Lấy mã tách ra từ Processname trước dấu -, , đã loại bỏ khoảng trắng đầu/cuối. Ví dụ: Processname = “RD02.01 - Quy trình ĐXMS” → Mã quy trình = RD02.01.

- Tên quy trình: Lấy tên tách ra từ Processname sau dấu - , đã loại bỏ khoảng trắng đầu/cuối. Ví dụ: Processname = “RD02.01 - Quy trình ĐXMS”→ Tên quy trình = Quy trình ĐXMS. Nếu Processname không có dấu gạch ngang thì Mã quy trình hiển thị “-” và Tên quy trình lấy toàn bộ Processname

- Phiên bản: Lấy Version của process definition đã deploy trên Camunda; mỗi version là một dòng con. . <img src="media/image33.png" style="width:3.39583in;height:0.96875in" />

- Mã Camunda: Lấy ProcessId (Mã độc nhất của quy trình trên Camunda)

<!-- -->

- Quy trình có nhiều phiên bản được hiển thị dưới dạng dòng cha và các dòng phiên bản con.

- Dòng cha có thể mở rộng/thu gọn để xem các phiên bản con tương ứng.

- Tổng số lượng hồ sơ đang chạy: Lấy tổng số hồ sơ có trạng thái Đang chạy theo quy trình để tính. Nếu không có hồ sơ nào thì hiển thị 0.

- Trạng thái của quy trình: 02 trạng thái Hoạt động/Dừng hoạt động:

  - *+ Hoạt động: phiên bản quy trình còn tồn tại trên Camunda (runtime) tại lần đồng bộ gần nhất .*

  - *+ Dừng hoạt động: phiên bản quy trình không còn tồn tại trên Camunda (đã bị xóa, chỉnh sửa) tại lần đồng bộ gần nhất; bản ghi vẫn được giữ lại, không xóa..*

**Đánh số thứ tự quy trình và phiên bản**

- Các **quy trình** được đánh số thứ tự ở **cấp 1** theo thứ tự tạo: **1, 2, 3, 4,...**

- Các **version** thuộc một quy trình được đánh số ở **cấp 2**, theo cấu trúc **STT quy trình.STT version**.

  - Ví dụ: Quy trình **2** có các version lần lượt là **2.1, 2.2, 2.3**.

- STT version được đánh số **độc lập trong từng quy trình**.

  - Ví dụ:

    - Quy trình **1** → **1.1, 1.2**

    - Quy trình **2** → **2.1, 2.2, 2.3**

- Khi tạo version mới, hệ thống lấy **STT version lớn nhất hiện có của quy trình đó và cộng 1**.

  - Ví dụ: Quy trình **2** đang có **2.1, 2.2** → version mới được đánh số **2.3**.

- Khi tạo quy trình mới, hệ thống lấy **STT quy trình lớn nhất hiện có và cộng 1**.

  - Ví dụ: đang có quy trình **1, 2** → quy trình mới được đánh số **3**.

- Biểu tượng **“+”** dùng để mở rộng danh sách version của quy trình; khi mở rộng, biểu tượng chuyển thành **“−”** để thu gọn. Thao tác mở rộng/thu gọn **không làm thay đổi STT**.

- STT được xác định theo **thứ tự tạo**; quy trình/version được tạo trước có STT nhỏ hơn quy trình/version được tạo sau.

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 14%" />
<col style="width: 12%" />
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Danh sách quy trình</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Danh sách quy trình</td>
<td><ul>
<li><p>Hiển thị “Danh sách quy trình”</p></li>
<li><p>Nội dung cố định, không cho phép chỉnh sửa.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Đồng bộ từ Camunda</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">-</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Khi nhấn, hệ thống thực hiện chức năng <strong>Đồng bộ danh sách quy trình từ Camunda</strong> theo cơ chế thủ công (triggerSource = MANUAL), mô tả tại mục 3.1.1.3.</p></li>
<li><p>Chỉ hiển thị/cho phép thao tác theo quyền của người dùng. Người dùng không có quyền Đồng bộ thì ẩn nút .</p></li>
<li><p>Quy tắc Button áp dụng theo <strong>mục 4.1 – Trường điều khiển dùng chung</strong>.</p></li>
<li><p>Trong thời gian đồng bộ hiển thị Loading và không cho gửi lặp yêu cầu; nếu đã có một phiên đồng bộ đang chạy, hiển thị thông báo “Đang có phiên đồng bộ đang chạy, vui lòng thử lại sau.” và không tạo phiên mới.</p></li>
<li><p>Luồng xử lý đồng bộ được mô tả tại chức năng riêng, không mô tả tại chức năng Xem danh sách.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Lọc</td>
<td style="text-align: left;">Dropdown</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Tất cả</td>
<td><ul>
<li><p>Cho phép lọc danh sách theo <strong>Trạng thái</strong> của phiên bản quy trình: Tất cả (mặc định), Hoạt động, Dừng hoạt động.</p></li>
<li><p>Dòng cha được hiển thị khi có ít nhất một phiên bản con thỏa điều kiện lọc.</p></li>
<li><p>Khi chọn “Tất cả” hệ thống không áp dụng điều kiện lọc. Bộ lọc áp dụng theo mục 4.3 – Kịch bản tìm kiếm và lọc dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Tìm kiếm</td>
<td style="text-align: left;">Search box [tối đa 255 ký tự]</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Rỗng. Placeholder: Tìm kiếm theo mã, tên quy trình</td>
<td><ul>
<li><p>Cho phép tìm kiếm theo <strong>Mã quy trình</strong> hoặc <strong>Tên quy trình</strong>.</p></li>
<li><p>Quy tắc nhập Search box áp dụng theo <strong>mục 4.1</strong>; xử lý từ khóa, cập nhật tập kết quả và phân trang áp dụng theo <strong>mục 4.3 – Kịch bản tìm kiếm và lọc dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">STT</td>
<td style="text-align: left;">String [tối đa 20 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo vị trí bản ghi</td>
<td><ul>
<li><p>Dòng quy trình cha hiển thị STT của quy trình trong tập kết quả.</p></li>
<li><p>Dòng phiên bản con hiển thị theo cấu trúc <strong>{STT quy trình}.{STT phiên bản}</strong>, ví dụ 2.1, 2.2, để thể hiện quan hệ phân cấp.</p></li>
<li><p>Quy tắc căn chỉnh áp dụng theo <strong>mục 4.2 – Bảng danh sách dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td style="text-align: left;">Mã quy trình</td>
<td style="text-align: left;">String [tối đa 50 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Hiển thị mã quy trình theo quy ước đặt tên của đơn vị, ví dụ RD02.02.</p></li>
<li><p>Trường <strong>Mã quy trình</strong> được tách từ tiêu đề quy trình, lấy phần ký tự đứng trước dấu - theo quy ước đặt tên của đơn vị.</p></li>
<li><p>Quy tắc hiển thị dữ liệu trong bảng áp dụng theo <strong>mục 4.2</strong>.</p></li>
<li><p><strong>Mapping:</strong> lấy từ processName trên Camunda. Nếu processName <strong>không chứa dấu -</strong>, hệ thống hiển thị:</p>
<ul>
<li><p><strong>Mã quy trình:</strong> -</p></li>
<li><p><strong>Tên quy trình:</strong> toàn bộ giá trị processName.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: left;">Mã Camunda</td>
<td style="text-align: left;">String [tối đa 100 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Hiển thị Mã Camunda của quy trình – mã định danh duy nhất, ổn định của quy trình trên Camunda; dùng làm khóa để nhóm các phiên bản vào cùng một quy trình cha</p></li>
<li><p>Chỉ đọc.</p></li>
<li><p>Quy tắc hiển thị nội dung áp dụng theo <strong>mục 4.2</strong>.</p></li>
<li><p><strong>Mapping:</strong> ProcessId của process definition trên Camunda</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td style="text-align: left;">Tên quy trình</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Hiển thị tên quy trình</p></li>
<li><p>Trường <strong>Tên quy trình</strong> được tách từ tiêu đề quy trình, lấy phần ký tự đứng sau dấu - theo quy ước đặt tên của đơn vị.</p></li>
<li><p>Quy tắc hiển thị nội dung dài, giá trị rỗng và tooltip áp dụng theo <strong>mục 4.2</strong>.</p></li>
<li><p><strong>Mapping:</strong> lấy từ processName trên Camunda. Nếu processName <strong>không chứa dấu -</strong>, hệ thống hiển thị:</p>
<ul>
<li><p><strong>Mã quy trình:</strong> -</p></li>
<li><p><strong>Tên quy trình:</strong> toàn bộ giá trị processName.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td style="text-align: left;">Trạng thái</td>
<td style="text-align: left;">Badge – Enum</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Hiển thị trạng thái <strong>phiên bản</strong> của <strong>quy trình</strong>.</p></li>
<li><p>Theo giao diện hiện tại gồm tối thiểu: <strong>Hoạt động, Dừng hoạt động.</strong></p></li>
</ul>
<ul>
<li><p><em>Hoạt động: phiên bản quy trình còn tồn tại trên Camunda (runtime) tại lần đồng bộ gần nhất.</em></p></li>
<li><p><em>Dừng hoạt động: phiên bản quy trình không còn tồn tại trên Camunda (đã bị xóa, chỉnh sửa) tại lần đồng bộ gần nhất; bản ghi vẫn được giữ lại.</em></p></li>
</ul>
<ul>
<li><p>Dòng cha không hiển thị trạng thái, chỉ dòng con con hiển thị Trạng thái.</p></li>
<li><p>Quy tắc căn chỉnh và giá trị không có dữ liệu áp dụng theo <strong>mục 4.2</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">10</td>
<td style="text-align: left;">Phiên bản</td>
<td style="text-align: left;">String [tối đa 20 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Dòng con hiển thị số phiên bản của quy trình, ví dụ 2.0, 1.0.</p></li>
<li><p>Lấy phiên bản Version. <img src="media/image33.png" style="width:1.90104in;height:0.54232in" /></p></li>
<li><p>Dòng quy trình cha không đại diện cho một phiên bản cụ thể nên hiển thị -.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">11</td>
<td style="text-align: left;">SL hồ sơ đang xử lý</td>
<td style="text-align: left;">Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu hệ thống</td>
<td><ul>
<li><p>Hiển thị số lượng hồ sơ đang xử lý tương ứng với dòng quy trình/phiên bản.</p></li>
<li><p><strong>Dòng con (phiên bản):</strong> số hồ sơ (process instance) đang ở trạng thái Đang chạy của đúng phiên bản đó.</p></li>
<li><p><strong>Dòng cha:</strong> tổng số hồ sơ Đang chạy của tất cả phiên bản thuộc cùng quy trình. Nếu không có hồ sơ nào thì hiển thị 0.</p></li>
<li><p>Không cho phép chỉnh sửa.</p></li>
<li><p>Hệ thống tự ghi nhận trạng thái của các hồ sơ sau mỗi lần đồng bộ (đồng bộ realtime hoặc thủ công).</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">12</td>
<td style="text-align: left;">Mở rộng/Thu gọn</td>
<td style="text-align: left;">Icon button</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Thu gọn</td>
<td><ul>
<li><p>Hiển thị tại dòng cha (quy trình)</p></li>
<li><p>Khi mở rộng, hiển thị các phiên bản thuộc quy trình ngay dưới dòng cha; khi thu gọn, ẩn các phiên bản con.</p></li>
<li><p>Thao tác chỉ thay đổi trạng thái hiển thị, không thay đổi dữ liệu quy trình.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">13</td>
<td style="text-align: left;">Xem chi tiết (liên kết Mã quy trình)</td>
<td style="text-align: left;">Link</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Mã quy trình ở dòng con (phiên bản) hiển thị dạng liên kết.</p></li>
<li><p>Khi click, hệ thống mở màn hình Xem chi tiết quy trình của đúng phiên bản được chọn (mục 3.1.1.2).</p></li>
<li><p>Dòng cha không có liên kết.</p></li>
<li><p>Chỉ người dùng có quyền truy cập chức năng Quản lý quy trình mới xem được.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">14</td>
<td style="text-align: left;">Phân trang</td>
<td style="text-align: left;">Paging</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Trang 1; 10 bản ghi/trang</td>
<td><ul>
<li><p>Thực hiện phân trang danh sách quy trình.</p></li>
<li><p>Phân trang theo mục 4.4 – Phân trang dùng chung (giá trị mặc định cố định, không có cấu hình riêng).</p></li>
<li><p><strong>Đơn vị phân trang là dòng cha (quy trình):</strong> tổng số bản ghi = số quy trình thỏa điều kiện tìm kiếm/lọc; số bản ghi/trang tính theo số dòng cha. Các dòng con (phiên bản) hiển thị ngay dưới dòng cha trong cùng trang khi mở rộng và không tính vào tổng số bản ghi.</p></li>
<li><p>Khi chuyển trang giữ nguyên từ khóa, bộ lọc và số bản ghi/trang.</p></li>
</ul></td>
</tr>
</tbody>
</table>

##### Luồng nghiệp vụ

<img src="media/image35.png" style="width:3.96236in;height:5.44534in" />

<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 91%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Bước</strong></td>
<td style="text-align: center;"><strong>Mô tả</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: center;"><ul>
<li><p>Người dùng truy cập <strong>Quản lý quy trình → Quản lý quy trình</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống truy vấn danh sách quy trình theo điều kiện mặc định và phạm vi dữ liệu người dùng được phép xem.</p></li>
<li><p>Trong thời gian lấy dữ liệu, bảng hiển thị trạng thái xử lý theo <strong>mục 4.2 – Bảng danh sách dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống xử lý kết quả truy vấn:</p>
<ul>
<li><p><strong>Nếu có dữ liệu:</strong> Hiển thị danh sách quy trình với các thông tin Mã quy trình, Mã Camunda, Tên quy trình, Phiên bản, Số lượng hồ sơ đang xử lý, Trạng thái. Quy trình có các phiên bản được hiển thị theo cấu trúc cha – con; người dùng có thể mở rộng dòng quy trình để xem các phiên bản tương ứng.</p></li>
<li><p><strong>Nếu không có dữ liệu:</strong> Hiển thị trạng thái <strong>“Chưa có dữ liệu”</strong> theo quy tắc Bảng danh sách dùng chung.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống hiển thị tổng số bản ghi và thông tin phân trang tương ứng với tập dữ liệu trả về.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: center;"><ul>
<li><p>Luồng xử lý kết thúc.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Xem chi tiết Quy trình

##### Thông tin chung chức năng

- Mã chức năng:

- Mục đích: Cho phép người dùng xem thông tin chi tiết một phiên bản của quy trình gồm: thông tin quy trình, sơ đồ BPMN, thuộc tính các phần tử trên sơ đồ và lịch sử các phiên bản của quy trình.

- Người dùng mục tiêu: Quản trị hệ thống và Người dùng được cấp quyền xem chức năng Quản lý quy trình..

- Đường dẫn truy cập: Quản lý quy trình → Quản lý quy trình → Mở rộng quy trình muốn xem → Click mã quy trình tại phiên bản cần xem.

- Tiền điều kiện:

  - Người dùng đã truy cập chức năng Quản lý quy trình

  - Có quyền xem

  - Quy trình và phiên bản được lựa chọn còn tồn tại trên hệ thống.

- Hậu điều kiện:

  - Thông tin chi tiết của phiên bản quy trình được hiển thị.

  - Chức năng chỉ phục vụ tra cứu, không làm thay đổi cấu hình BPMN hoặc dữ liệu quy trình*.*

- Requirements Traceability Matrix – RTM:

##### Màn hình

<img src="media/image7.png" style="width:8.8189in;height:5.5in" />

<img src="media/image11.png" style="width:8.37619in;height:7.18948in" />

<img src="media/image17.png" style="width:8.8189in;height:5.88889in" />

##### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 16%" />
<col style="width: 16%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 38%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: left;">Thoát</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Cho phép người dùng đóng màn hình Chi tiết quy trình và quay về màn hình <strong>Danh sách quy trình</strong>.</p></li>
<li><p>Quy tắc Button áp dụng theo mục 4.1.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: left;">Chi tiết quy trình</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Chi tiết quy trình</td>
<td><ul>
<li><p>Hiển thị tên chức năng tại đầu màn hình.</p></li>
<li><p>Quy tắc Label áp dụng theo <strong>mục 4.1 – Trường điều khiển dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td colspan="6" style="text-align: center;"><ol type="I">
<li><p><strong>Thông tin quy trình</strong></p></li>
</ol></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: left;">Mã quy trình</td>
<td style="text-align: left;">String [tối đa 50 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị mã quy trình của phiên bản đang xem, ví dụ RD02.02.</p></li>
<li><p>Dữ liệu chỉ đọc.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: left;">Mã Camunda</td>
<td style="text-align: left;">String [tối đa 100 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị Mã Camunda của quy trình, là định danh duy nhất của quy trình trên Camunda;</p></li>
<li><p>Các phiên bản của cùng quy trình có cùng Mã Camunda.</p></li>
<li><p>Dữ liệu chỉ đọc.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: left;">Tên quy trình</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị tên của quy trình, ví dụ “Xét duyệt ĐXMS”.</p></li>
<li><p>Xử lý nội dung dài áp dụng quy tắc Label/Tooltip dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: left;">Phiên bản</td>
<td style="text-align: left;">String [tối đa 20 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo phiên bản được chọn</td>
<td><ul>
<li><p>Hiển thị đúng phiên bản quy trình mà người dùng lựa chọn từ màn Danh sách quy trình, ví dụ 2.0.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: left;">Phiên bản deploy</td>
<td style="text-align: left;">String [tối đa 20 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị số Version của process definition do Camunda tự gán khi deploy (số nguyên tăng dần theo mỗi lần deploy).</p></li>
<li><p>Dữ liệu chỉ đọc.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: left;">Trạng thái</td>
<td style="text-align: left;">String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị trạng thái của phiên bản quy trình tại thời điểm xem, ví dụ Kích hoạt.</p></li>
<li><p>Không cho phép thay đổi trạng thái tại màn hình này.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>9</strong></td>
<td style="text-align: left;">Số hồ sơ đang xử lý</td>
<td style="text-align: left;">Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị số lượng hồ sơ đang xử lý tương ứng với dòng quy trình/phiên bản.</p></li>
<li><p><strong>Dòng con (phiên bản):</strong> số hồ sơ (process instance) đang ở trạng thái Đang chạy của đúng phiên bản đó.</p></li>
<li><p><strong>Dòng cha:</strong> tổng số hồ sơ Đang chạy của tất cả phiên bản con thuộc cùng Mã Camunda. Nếu không có hồ sơ nào thì hiển thị 0.</p></li>
<li><p>Không cho phép chỉnh sửa.</p></li>
<li><p>Số liệu được cập nhật sau mỗi lần đồng bộ (đồng bộ realtime hoặc thủ công).</p></li>
</ul></td>
</tr>
<tr>
<td colspan="6" style="text-align: center;"><ol start="2" type="I">
<li><p><strong>Lịch sử phiên bản</strong></p></li>
</ol></td>
</tr>
<tr>
<td style="text-align: center;"><strong>10</strong></td>
<td style="text-align: left;">Phiên bản</td>
<td style="text-align: left;">String [tối đa 20 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;"></td>
<td><ul>
<li><p>Hiển thị mã phiên bản tương ứng của phiên bản lịch sử được ghi nhận của cùng quy trình.</p></li>
<li><p>Các phiên bản được hiển thị theo thứ tự mới nhất trước, phiên bản cũ hơn sau</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>11</strong></td>
<td style="text-align: left;">Thời điểm cập nhật</td>
<td style="text-align: left;">DateTime</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;"></td>
<td><ul>
<li><p>Hiển thị thời điểm cập nhật của phiên bản tương ứng theo định dạng ngày giờ thống nhất của hệ thống.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>12</strong></td>
<td style="text-align: left;">Tên phiên bản</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;"></td>
<td><ul>
<li><p>Hiển thị tên của phiên bản tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>13</strong></td>
<td style="text-align: left;">Mô tả phiên bản</td>
<td style="text-align: left;">String [tối đa 1000 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;"></td>
<td><ul>
<li><p>Hiển thị mô tả của phiên bản tương ứng</p></li>
</ul></td>
</tr>
<tr>
<td colspan="6" style="text-align: center;"><ol start="3" type="I">
<li><p><strong>Sơ đồ quy trình</strong></p></li>
</ol></td>
</tr>
<tr>
<td style="text-align: center;"><strong>14</strong></td>
<td style="text-align: left;">Phóng to</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Tăng tỷ lệ hiển thị của sơ đồ BPMN để người dùng quan sát chi tiết.</p></li>
<li><p>Chỉ tác động đến vùng hiển thị.</p></li>
<li><p>Quy tắc Icon Button/Tooltip áp dụng theo mục 4.1.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>15</strong></td>
<td style="text-align: left;">Thu nhỏ</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Giảm tỷ lệ hiển thị của sơ đồ BPMN để mở rộng phạm vi quan sát.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>16</strong></td>
<td style="text-align: left;">Mở/đóng Minimap</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Bật hoặc tắt <strong>Minimap</strong> của BPMN.</p></li>
<li><p>Minimap hỗ trợ người dùng xác định vị trí vùng đang quan sát trên toàn bộ sơ đồ và điều hướng đối với quy trình có kích thước lớn.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>17</strong></td>
<td style="text-align: left;">Sơ đồ BPMN</td>
<td style="text-align: left;">BPMN Viewer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo phiên bản được chọn</td>
<td><ul>
<li><p>Hiển thị sơ đồ BPMN tương ứng với phiên bản đang xem.</p></li>
<li><p>Sơ đồ ở chế độ chỉ đọc; người dùng có thể quan sát, di chuyển vùng nhìn và chọn phần tử nhưng không được sửa cấu trúc BPMN.</p></li>
<li><p><strong>Nguồn dữ liệu:</strong> BPMN XML của process definition (Mã Camunda + Phiên bản deploy). BPMN XML được hệ thống lấy từ Camunda qua API trong quá trình đồng bộ (với phiên bản mới hoặc chưa có XML) và lưu lại; khi xem chi tiết, hệ thống đọc bản đã lưu và hiển thị bằng BPMN Viewer.</p></li>
<li><p>Nếu chưa có bản lưu, hệ thống gọi Camunda API lấy bổ sung; nếu không lấy được thì hiển thị thông báo lỗi theo mục 4.6.</p></li>
<li><p>Khi chọn phần tử trong sơ đồ, khu vực thuộc tính phần tử sẽ hiển thị dưới dạng Information Panel.</p></li>
</ul></td>
</tr>
<tr>
<td colspan="6" style="text-align: left;"><p><strong>III.1.</strong> <strong>Thuộc tính phần tử User Task</strong></p>
<ul>
<li><p><strong>Tất cả các dữ liệu thuộc tính của phần tử đều lấy từ các trường tương ứng trên Camunda.</strong></p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>18</strong></td>
<td style="text-align: left;">Tên hiển thị User Task</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị tên User Task tại phần đầu panel, ví dụ 7.</p></li>
<li><p>Hoàn chỉnh HS chủ trương.</p></li>
<li><p>Lấy từ khung <strong>General/Name</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>19</strong></td>
<td style="text-align: left;">Đóng</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Đóng panel Thuộc tính phần tử.</p></li>
<li><p>Việc đóng panel không làm thay đổi dữ liệu hoặc phần tử BPMN.</p></li>
<li><p>Quy tắc Icon Button/Tooltip áp dụng theo mục 4.1.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>20</strong></td>
<td style="text-align: left;">Chung</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Mở</td>
<td><ul>
<li><p>Nhóm thông tin nhận diện cơ bản của User Task gồm Tên và ID.</p></li>
<li><p>Người dùng mở/thu gọn để xem</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>21</strong></td>
<td style="text-align: left;">Tên</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị tên của User Task, ví dụ 8. Ký duyệt HS.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>General/Name</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>22</strong></td>
<td style="text-align: left;">ID</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị định danh User Task trong BPMN, ví dụ Task_7.</p></li>
<li><p>ID là thông tin nhận diện bước quy trình và phục vụ liên kết với các cấu hình nghiệp vụ liên quan.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>General</strong>/<strong>ID</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>23</strong></td>
<td style="text-align: left;">Tài liệu mô tả</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Thu gọn theo thiết kế</td>
<td><ul>
<li><p>Nhóm thông tin mô tả của User Task.</p></li>
<li><p>Người dùng có thể mở/thu gọn để xem nội dung nếu có.</p></li>
<li><p>Lấy từ khung <strong>Documentation/Element documentation</strong> của Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>24</strong></td>
<td style="text-align: left;">Mô tả</td>
<td style="text-align: left;">String/Textarea [tối đa 2000 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị nội dung mô tả của phần tử nếu được cấu hình.</p></li>
<li><p>Tại màn Xem chi tiết, trường chỉ đọc dù hình thức UI tương tự Textarea.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>Documentation/Element documentation</strong> của Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>25</strong></td>
<td style="text-align: left;">Phân công</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Mở</td>
<td><ul>
<li><p>Nhóm các thuộc tính xác định đối tượng có thể nhận hoặc thực hiện User Task.</p></li>
<li><p>Người dùng có thể mở/thu gọn để xem nội dung nếu có.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>26</strong></td>
<td style="text-align: left;">Nhóm phụ trách (CandidateUsers)</td>
<td style="text-align: left;">String/List [tối đa 1000 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị nhóm được cấu hình có khả năng nhận/xử lý User Task, ví dụ Chủ nhiệm đề tài (PM) · PM.</p></li>
<li><p>Nếu có nhiều nhóm, hiển thị theo tập giá trị đã cấu hình.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>Assignment/CandidateUsers</strong> của Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>27</strong></td>
<td style="text-align: left;">Người cụ thể (assignee)</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị tài khoản người dùng được gán trực tiếp xử lý User Task nếu có.</p></li>
<li><p>Trường hợp chưa gán người cụ thể, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>Assignment/Assignee</strong> của Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>28</strong></td>
<td style="text-align: left;">Cần vai trò (need role)</td>
<td style="text-align: left;">String/List [tối đa 1000 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị vai trò nghiệp vụ yêu cầu đối với người thực hiện User Task, ví dụ Thẩm định hồ sơ (Cơ quan nghiệp vụ).</p></li>
<li><p>Lấy từ khung <strong>Assignment/Candidate users</strong> của Camunda.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>29</strong></td>
<td style="text-align: left;">Biểu mẫu phần tử</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Mở</td>
<td><ul>
<li><p>Nhóm thông tin biểu mẫu được liên kết với User Task.</p></li>
<li><p>Người dùng có thể mở/thu gọn để xem nội dung nếu có.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>30</strong></td>
<td style="text-align: left;">Biểu mẫu (formKey)</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị formKey gắn với User Task.</p></li>
<li><p>Nếu chưa gán biểu mẫu, hiển thị -.</p></li>
<li><p>Hiển thị mã Biểu mẫu (formKey) của eform được gắn với bước xử lý (nếu có).</p></li>
</ul></td>
</tr>
<tr>
<td colspan="6" style="text-align: center;"><ul>
<li><p>Phân công: Bao gồm:</p>
<ul>
<li><p>Người được gán: Assignee.</p></li>
<li><p>Nhóm ứng viên (vai trò): CandidateUsers.</p></li>
<li><p>Hạn xử lý: dueDate.</p></li>
<li><p>Ngày nhắc việc: followUpDate.</p></li>
</ul></li>
</ul>
<p><img src="media/image19.png" style="width:2.75in;height:2.66667in" /><img src="media/image20.png" style="width:3.29167in;height:1.20833in" /></p>
<ul>
<li><p>Biểu mẫu:</p>
<ul>
<li><p>Loại biểu mẫu: Type.</p></li>
<li><p>Form key: Giống kết quả trả ra từ Camunda.</p></li>
</ul></li>
</ul>
<p><img src="media/image22.png" style="width:2.82292in;height:1.32292in" /><img src="media/image23.png" style="width:3.29167in;height:0.91667in" /><img src="media/image9.png" style="width:3.29167in;height:0.88889in" /></p>
<ul>
<li><p>Input mapping:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Local variable name và Variable assignment value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Local variable name. Nội dung bao gồm: Local variable name và Variable assignment value.</p></li>
</ul></li>
</ul>
<p><img src="media/image13.png" style="width:2.63542in;height:2.67708in" /><img src="media/image5.png" style="width:3.29167in;height:1.36111in" /></p>
<ul>
<li><p>Output mapping:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Local variable name và Variable assignment value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Local variable name. Nội dung bao gồm: Local variable name và Variable. assignment value.</p></li>
</ul></li>
</ul>
<p><img src="media/image25.png" style="width:2.83333in;height:1.57292in" /><img src="media/image21.png" style="width:3.29167in;height:0.80556in" /></p>
<ul>
<li><p>Hearders:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Key và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Key. Nội dung bao gồm: Key và Value.</p></li>
</ul></li>
</ul>
<p><img src="media/image29.png" style="width:2.95833in;height:1.58333in" /><img src="media/image8.png" style="width:3.29167in;height:0.86111in" /></p>
<ul>
<li><p>Execution listeners:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Event Type, Listener Type, Retries, Headers.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Event Type. Nội dung bao gồm: Event Type, Listener Type, Retries, Headers.</p></li>
</ul></li>
</ul>
<p><img src="media/image10.png" style="width:2.80208in;height:3.57292in" /><img src="media/image16.png" style="width:3.29167in;height:2.09722in" /></p>
<ul>
<li><p>Hearders:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Key và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Key. Nội dung bao gồm: Key và Value.</p></li>
</ul></li>
<li><p>Extension properties:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Name và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Name. Nội dung bao gồm: Name và Value.</p></li>
</ul></li>
</ul>
<p><img src="media/image1.png" style="width:2.83333in;height:1.78125in" /><img src="media/image12.png" style="width:3.29167in;height:1.05556in" /></p></td>
</tr>
<tr>
<td colspan="6" style="text-align: left;"><p><strong>Đối với loại Exclusive Gateway:</strong> <img src="media/image26.png" style="width:0.71875in;height:0.69792in" /></p>
<p>Các thuộc tính bao gồm:</p>
<p><img src="media/image15.png" style="width:3.05208in;height:2.11458in" /></p>
<ul>
<li><p>Chung: General từ Camunda.</p></li>
<li><p>Tài liệu mô tả: Documentation từ Camunda.</p></li>
<li><p>Execution listeners:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Event Type, Listener Type, Retries, Headers.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Event Type. Nội dung bao gồm: Event Type, Listener Type, Retries, Headers.</p></li>
</ul></li>
</ul>
<p><img src="media/image10.png" style="width:2.80208in;height:3.57292in" /><img src="media/image16.png" style="width:5.55559in;height:3.52877in" /></p>
<ul>
<li><p>Hearders:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Key và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Key. Nội dung bao gồm: Key và Value.</p></li>
</ul></li>
<li><p>Extension properties:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Name và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Name. Nội dung bao gồm: Name và Value.</p></li>
</ul></li>
</ul>
<p><img src="media/image1.png" style="width:2.83333in;height:1.78125in" /><img src="media/image12.png" style="width:3.44792in;height:1.10168in" /></p></td>
</tr>
<tr>
<td colspan="6" style="text-align: left;"><p><strong>Đối với loại nội dung Sequence Flow:</strong></p>
<p>Các thuộc tính bao gồm:</p>
<p><img src="media/image24.png" style="width:2.98958in;height:5.05208in" /></p>
<ul>
<li><p>Chung: General từ Camunda.</p></li>
<li><p>Tài liệu mô tả: Documentation từ Camunda.</p></li>
<li><p>Điều kiện: Khớp với điều kiện nghiệp vụ:</p>
<ul>
<li><p>Check Đặt làm nhánh mặc định: Mặc định OFF Check.</p></li>
<li><p>Nội dung điều kiện nghiệp vụ: Mặc định: Không đặt điều kiện.</p></li>
</ul></li>
</ul>
<ul>
<li><p>Không đặt điều kiện</p></li>
<li><p>Cấp nhiệm vụ</p>
<ul>
<li><p>Cơ sở</p></li>
<li><p>Tập đoàn</p></li>
<li><p>Không đạt điều kiện</p></li>
</ul></li>
<li><p>Kết quả thẩm định</p>
<ul>
<li><p>Đạt</p></li>
<li><p>Đồng ý</p></li>
<li><p>Yêu cầu bổ sung</p></li>
<li><p>Yêu cầu hiệu chỉnh</p></li>
<li><p>Không đồng ý</p></li>
</ul></li>
<li><p>Kết quả ký duyệt</p>
<ul>
<li><p>Đồng ý</p></li>
<li><p>Yêu cầu hiệu chỉnh</p></li>
<li><p>Từ chối</p></li>
</ul></li>
<li><p>Kết quả phê duyệt (TGĐ)</p>
<ul>
<li><p>Đồng ý</p></li>
<li><p>Yêu cầu hiệu chỉnh</p></li>
<li><p>Không phê duyệt</p></li>
</ul></li>
<li><p>Đủ điều kiện mặc định</p>
<ul>
<li><p>Có</p></li>
<li><p>Không</p></li>
</ul></li>
</ul>
<ul>
<li><p>Điều kiện: Lấy từ Condition trên Camunda.</p>
<ul>
<li><p>Hiển thị trường Biểu thức điều kiện = Condition Expression.</p></li>
</ul></li>
<li><p>Extension properties:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Name và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Name. Nội dung bao gồm: Name và Value.</p></li>
</ul></li>
</ul>
<p><img src="media/image1.png" style="width:2.83333in;height:1.78125in" /><img src="media/image12.png" style="width:3.44792in;height:1.10168in" /></p></td>
</tr>
<tr>
<td colspan="6" style="text-align: left;"><p><strong>III. 2. Thuộc tính phần tử Service Task (System Task)</strong></p>
<ul>
<li><p><strong>Tất cả các dữ liệu thuộc tính của phần tử đều lấy từ các trường tương ứng trên Camunda.</strong></p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>31</strong></td>
<td style="text-align: left;">Tên hiển thị Service Task</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị tên Service Task tại phần đầu panel, ví dụ Hệ thống — Check điều kiện mặc định.</p></li>
<li><p>Lấy từ khung <strong>General/Name</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>32</strong></td>
<td style="text-align: left;">Đóng</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Đóng panel Thuộc tính phần tử.</p></li>
<li><p>Việc đóng panel không làm thay đổi dữ liệu hoặc phần tử BPMN.</p></li>
<li><p>Quy tắc Icon Button/Tooltip áp dụng theo mục 4.1.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>33</strong></td>
<td style="text-align: left;">Chung</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Mở</td>
<td><ul>
<li><p>Nhóm các thông tin nhận diện cơ bản của Service Task.</p></li>
<li><p>Cho phép mở/thu gọn nội dung; không thay đổi dữ liệu.</p></li>
<li><p>Lấy từ khung <strong>General</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>34</strong></td>
<td style="text-align: left;">Tên</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị tên được cấu hình cho Service Task, ví dụ 3. Hệ thống - Check điều kiện mặc định.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>General</strong>/<strong>Name</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>35</strong></td>
<td style="text-align: left;">ID</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị định danh của phần tử trong BPMN, ví dụ Gateway_SystemCheck.</p></li>
<li><p>ID dùng để nhận diện chính xác Service Task trong định nghĩa quy trình.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>General</strong>/<strong>ID</strong> trên Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>36</strong></td>
<td style="text-align: left;">Tài liệu mô tả</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Nhóm thông tin mô tả của Service Task.</p></li>
<li><p>Cho phép mở/thu gọn để xem nội dung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>37</strong></td>
<td style="text-align: left;">Mô tả phần tử</td>
<td style="text-align: left;">String/Textarea [tối đa 2000 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị nội dung mô tả của Service Task nếu được cấu hình.</p></li>
<li><p>Tại màn Xem chi tiết, trường chỉ đọc dù hình thức UI tương tự Textarea.</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>Lấy từ khung <strong>Documentation/Element documentation</strong> của Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>38</strong></td>
<td style="text-align: left;">Tích hợp</td>
<td style="text-align: left;">Accordion/Section</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Mở</td>
<td><ul>
<li><p>Nhóm thuộc tính tích hợp của Service Task.</p></li>
<li><p>Lấy từ khung <strong>Implementation/Type Jobworker</strong> của Camunda và map với tác vụ của quy trình.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>39</strong></td>
<td style="text-align: left;">Job Type (Worker xử lý)</td>
<td style="text-align: left;">String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo BPMN</td>
<td><ul>
<li><p>Hiển thị Job Type của Service Task, dùng để xác định loại job mà worker backend tiếp nhận và xử lý, ví dụ Kiểm tra điều kiện mặc định (RD01.01).</p></li>
<li><p>Nếu không có dữ liệu, hiển thị -.</p></li>
<li><p>List danh sách Job type (worker xử lý):</p>
<ul>
<li><p>Đồng bộ QLNS (nhân sự) · khcn.sync.qlns</p></li>
<li><p>Đồng bộ Mua sắm (MS) · khcn.sync.ms</p></li>
<li><p>Đồng bộ SAP (kinh phí) · khcn.sync.sap</p></li>
<li><p>Đồng bộ QLTS (tài sản) · khcn.sync.qlts</p></li>
<li><p>Đồng bộ PLM (tiến độ) · khcn.sync.plm</p></li>
</ul></li>
</ul>
<p><strong>Worker nội bộ</strong></p>
<ul>
<li><p>Kiểm tra điều kiện mặc định RD01.01.</p></li>
<li><p>Kiểm tra điều kiện mặc định RD01.02.</p></li>
<li><p>Kiểm tra điều kiện mặc định RD02.01.</p></li>
<li><p>Kiểm tra điều kiện mặc định RD02.02.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>29</strong></td>
<td style="text-align: left;">Mô tả Job Type</td>
<td style="text-align: left;">Label – String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo thiết kế</td>
<td><ul>
<li><p>Hiển thị thông tin giải thích ý nghĩa của Job Type, ví dụ worker backend nhận job theo type tương ứng.</p></li>
<li><p>Nội dung: Worker backend nhận job theo type này — chọn từ danh mục để tránh gõ sai.</p></li>
<li><p>Nội dung chỉ mang tính hướng dẫn, không cho phép chỉnh sửa.</p></li>
</ul></td>
</tr>
<tr>
<td colspan="6" style="text-align: center;"><ul>
<li><p>Task definition: Định nghĩa Job Worker.</p>
<ul>
<li><p>JobType: Loại job. Gán từ giá trị chọn ở trường tích hợp theo trường Job Type.</p></li>
<li><p>Retries: Số lần thử lại.</p></li>
</ul></li>
</ul>
<p><img src="media/image36.png" style="width:2.9375in;height:1.45833in" /> <img src="media/image39.png" style="width:5.12602in;height:0.94543in" /></p>
<ul>
<li><p>Job Priority:Độ ưu tiên. (nếu có).</p></li>
</ul>
<p><img src="media/image38.png" style="width:2.63542in;height:0.78125in" /></p>
<ul>
<li><p>Input mapping:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Local variable name và Variable assignment value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Local variable name. Nội dung bao gồm: Local variable name và Variable assignment value.</p></li>
</ul></li>
</ul>
<p><img src="media/image13.png" style="width:2.63542in;height:2.67708in" /><img src="media/image5.png" style="width:5.39063in;height:2.23092in" /></p>
<ul>
<li><p>Output mapping:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Local variable name và Variable assignment value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Local variable name. Nội dung bao gồm: Local variable name và Variable. assignment value.</p></li>
</ul></li>
</ul>
<p><img src="media/image25.png" style="width:2.83333in;height:1.57292in" /><img src="media/image21.png" style="width:5.21957in;height:1.28565in" /></p>
<ul>
<li><p>Hearders:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Key và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Key. Nội dung bao gồm: Key và Value.</p></li>
</ul></li>
</ul>
<p><img src="media/image29.png" style="width:2.95833in;height:1.58333in" /><img src="media/image8.png" style="width:4.53895in;height:1.19598in" /></p>
<ul>
<li><p>Execution listeners:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Event Type, Listener Type, Retries, Headers.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Event Type. Nội dung bao gồm: Event Type, Listener Type, Retries, Headers.</p></li>
</ul></li>
</ul>
<p><img src="media/image10.png" style="width:2.80208in;height:3.57292in" /><img src="media/image16.png" style="width:5.55559in;height:3.52877in" /></p>
<ul>
<li><p>Hearders:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Key và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Key. Nội dung bao gồm: Key và Value.</p></li>
</ul></li>
<li><p>Extension properties:</p>
<ul>
<li><p>Mỗi giá trị bao gồm Name và Value.</p></li>
<li><p>Hiển thị dạng Tiêu đề: Name. Nội dung bao gồm: Name và Value.</p></li>
</ul></li>
</ul>
<p><img src="media/image1.png" style="width:2.83333in;height:1.78125in" /><img src="media/image12.png" style="width:3.44792in;height:1.10168in" /></p></td>
</tr>
</tbody>
</table>

##### Luồng nghiệp vụ

<img src="media/image2.png" style="width:4.48538in;height:6.26491in" />

<table style="width:100%;">
<colgroup>
<col style="width: 7%" />
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Bước</strong></td>
<td style="text-align: center;"><strong>Mô tả</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: center;"><ul>
<li><p>Tại màn hình <strong>Danh sách quy trình</strong>, người dùng mở rộng quy trình và chọn mã quy trình tại phiên bản cần xem chi tiết.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống xác định quy trình và phiên bản được chọn, sau đó truy vấn <strong>thông tin quy trình</strong>, dữ liệu <strong>BPMN</strong> của phiên bản và <strong>lịch sử phiên bản</strong> tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống xử lý kết quả truy vấn:</p>
<ul>
<li><p><strong>Nếu thành công:</strong> chuyển đến bước 4.</p></li>
<li><p><strong>Nếu không thành công:</strong> hiển thị thông báo lỗi theo cơ chế thông báo dùng chung và kết thúc luồng.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống hiển thị màn hình <strong>Chi tiết quy trình</strong>, gồm: Mã quy trình, Mã Camunda, Tên quy trình, Phiên bản, Phiên bản Deploy, Trạng thái, Số hồ sơ đang xử lý, sơ đồ BPMN và khu vực Lịch sử phiên bản.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống hiển thị BPMN ở chế độ chỉ xem. Người dùng có thể <strong>Phóng to</strong>, <strong>Thu nhỏ</strong> hoặc <strong>Mở/đóng Minimap</strong> để quan sát và điều hướng trên sơ đồ.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: center;"><ul>
<li><p>Khi chưa chọn phần tử trên BPMN, khu vực <strong>Thuộc tính phần tử</strong> bị ẩn.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: center;"><ul>
<li><p>Người dùng chọn một phần tử trên sơ đồ BPMN.</p></li>
<li><p>Hệ thống xác định phần tử được chọn và loại phần tử tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: center;"><ul>
<li><p>Nếu phần tử được chọn là <strong>Service Task</strong>, hệ thống hiển thị panel <strong>Thuộc tính phần tử</strong> với các thông tin: Loại phần tử SERVICE TASK, Tên hiển thị phần tử, nhóm <strong>Chung</strong> gồm Tên và ID, nhóm <strong>Tài liệu mô tả</strong> gồm Mô tả phần tử, nhóm <strong>Tích hợp</strong> gồm Job Type (Worker xử lý).</p></li>
<li><p>Nếu phần tử được chọn là <strong>User Task</strong>, hệ thống hiển thị panel <strong>Thuộc tính phần tử</strong> với các thông tin: Loại phần tử USER TASK, Tên hiển thị phần tử, nhóm <strong>Chung</strong> gồm Tên và ID, nhóm <strong>Tài liệu mô tả</strong>, nhóm <strong>Phân công</strong> gồm CandidateUsers, assignee, need role, và nhóm <strong>Biểu mẫu phần tử</strong> gồm formKey.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>9</strong></td>
<td style="text-align: center;"><ul>
<li><p>Người dùng xem thông tin thuộc tính của phần tử. Các nhóm thông tin có thể được mở hoặc thu gọn để thuận tiện theo dõi. Toàn bộ dữ liệu trên panel ở chế độ chỉ đọc.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>10</strong></td>
<td style="text-align: center;"><ul>
<li><p>Người dùng hoàn tất việc xem thông tin quy trình, BPMN, thuộc tính phần tử và lịch sử phiên bản. Luồng xử lý kết thúc.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 3.1.1.5. Chức năng Đồng bộ danh sách quy trình từ Camunda

##### 3.1.1.5.1. Thông tin chung chức năng

- Mã chức năng:

- Mục đích: Cho phép người dùng quản lý quy trình cập nhật danh sách quy trình và các phiên bản quy trình từ nguồn Camunda về hệ thống Đầu tư Mua sắm, bảo đảm dữ liệu quản trị phản ánh dữ liệu quy trình hiện có trên Camunda.

- Người dùng mục tiêu: Quản trị hệ thống và Người dùng quản trị quy trình được cấp quyền thực hiện chức năng Đồng bộ từ Camunda (đồng bộ thủ công); Hệ thống (đồng bộ tự động khi có thay đổi trên Camunda).

- Đường dẫn truy cập: Quản lý quy trình → Quản lý quy trình → chọn **Đồng bộ từ Camunda**.

> ● Cơ chế khởi tạo: Chức năng được thực hiện theo hai cách:
>
> ○ **(1) Tự động theo thời gian thực (realtime):** khi quy trình trên Camunda được thêm mới, cập nhật phiên bản hoặc bị xóa, hệ thống tự động đồng bộ, không cần người dùng thao tác.
>
> ○ **(2) Thủ công:** người dùng có quyền bấm nút **Đồng bộ từ Camunda** trên màn hình Danh sách quy trình.

- Tiền điều kiện:

  - Người dùng đã truy cập màn hình Danh sách quy trình và có quyền thực hiện đồng bộ

  - Dữ liệu và dịch vụ liên quan đến Camunda sẵn sàng để xử lý yêu cầu đồng bộ.

- Hậu điều kiện:

  - Danh sách quy trình/phiên bản được cập nhật theo dữ liệu hợp lệ từ Camunda và hiển thị lại trên màn hình Danh sách quy trình.

##### 3.1.1.5.2. Màn hình

Người dùng thực hiện thao tác thông qua nút **Đồng bộ từ Camunda** trên màn hình **Danh sách quy trình**.

<img src="media/image37.png" style="width:8.8189in;height:3.73611in" />

##### 3.1.1.5.3. Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 12%" />
<col style="width: 17%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 41%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: left;">Đồng bộ từ Camunda</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Cho phép người dùng có quyền khởi tạo việc đồng bộ danh sách và phiên bản quy trình từ Camunda.</p></li>
<li><p>Quy tắc Button áp dụng theo <strong>mục 4.1 – Trường điều khiển dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: left;">Trạng thái đồng bộ</td>
<td style="text-align: left;">Processing/Loading</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">-</td>
<td><ul>
<li><p>Hiển thị trạng thái đang xử lý sau khi yêu cầu đồng bộ được khởi tạo.</p></li>
<li><p>Trong thời gian này không cho phép gửi lặp yêu cầu đồng bộ.</p></li>
<li><p>Quy tắc Loading và chống thao tác lặp áp dụng theo <strong>mục 4.6 – Thông báo chung và trạng thái xử lý</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: left;">Dữ liệu quy trình từ Camunda</td>
<td style="text-align: left;">Dataset</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo dữ liệu Camunda</td>
<td><ul>
<li><p>Dữ liệu nguồn dùng để cập nhật danh sách quy trình và phiên bản trên hệ thống.</p></li>
<li><p>Mỗi phiên bản phải được nhận diện theo thông tin định danh tương ứng và ánh xạ về đúng quy trình cha.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: left;">Quy trình</td>
<td style="text-align: left;">Data object</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả đồng bộ</td>
<td><ul>
<li><p>Bản ghi quy trình được tạo mới hoặc cập nhật theo dữ liệu hợp lệ nhận từ Camunda.</p></li>
<li><p>Không tạo thêm bản ghi trùng cho cùng đối tượng quy trình đã được hệ thống nhận diện.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: left;">Phiên bản quy trình</td>
<td style="text-align: left;">Data object</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả đồng bộ</td>
<td><ul>
<li><p>Hiển thị/cập nhật các phiên bản thuộc quy trình tương ứng.</p></li>
<li><p>Một phiên bản phải được gắn đúng với quy trình cha; không tạo trùng khi cùng <strong>khóa Camunda và phiên bản</strong> đã tồn tại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: left;">Trạng thái phiên bản</td>
<td style="text-align: left;">Enum</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu nguồn</td>
<td><ul>
<li><p>Cập nhật trạng thái của phiên bản theo dữ liệu hợp lệ nhận được từ nguồn và hiển thị lại tại Danh sách quy trình.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: left;">SL hồ sơ đang xử lý</td>
<td style="text-align: left;">Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả đồng bộ</td>
<td><ul>
<li><p>Cập nhật số lượng hồ sơ đang xử lý tương ứng với dữ liệu quy trình/phiên bản trả về sau đồng bộ.</p></li>
<li><p>SL hồ sơ đang xử lý: số lượng instance trên camunda đang chạy với quy trình đó.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: left;">Kết quả đồng bộ</td>
<td style="text-align: left;">Notification</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Thông báo kết quả xử lý cho người dùng. Nội dung, hình thức và thời gian hiển thị áp dụng theo <strong>mục 4.6 – Thông báo chung và trạng thái xử lý</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>9</strong></td>
<td style="text-align: left;">Danh sách quy trình</td>
<td style="text-align: left;">Data Grid</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Dữ liệu hiện tại</td>
<td><ul>
<li><p>Sau khi đồng bộ thành công, hệ thống tải lại danh sách để phản ánh dữ liệu quy trình, phiên bản, trạng thái và số hồ sơ đang xử lý mới nhất.</p></li>
<li><p>Quy tắc hiển thị bảng áp dụng theo <strong>mục 4.2 – Bảng danh sách dùng chung</strong>.</p></li>
</ul></td>
</tr>
</tbody>
</table>

##### 3.1.1.5.4. Quy tắc đồng bộ quy trình từ Camunda

Chức năng đồng bộ **danh mục quy trình BPMN đã deploy** và **luật hiển thị hành động** từ Camunda về hệ thống, phục vụ tra cứu, quản trị phiên bản và theo dõi số hồ sơ đang xử lý.

1.  Mục tiêu và phạm vi

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Nội dung</strong></td>
<td style="text-align: center;"><strong>Quy tắc</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Nguồn dữ liệu chuẩn</strong></td>
<td style="text-align: left;">Process definition trong <strong>runtime Camunda</strong>; không lấy theo version snapshot của file trong Modeler.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Loại tài nguyên</strong></td>
<td style="text-align: left;">BPMN process definition</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Phạm vi</strong></td>
<td style="text-align: left;">Quy trình thuộc <strong>Tenant DTMS</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Dữ liệu đồng bộ</strong></td>
<td style="text-align: left;">Mã Camunda (ProcessId); Mã và Tên quy trình; Phiên bản và mô tả; Số hồ sơ đang xử lý; Trạng thái; Luật hiển thị hành động sinh từ BPMN của quy trình/phiên bản mới hoặc có thay đổi.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Cấu trúc hiển thị</strong></td>
<td style="text-align: left;"><p><strong>Cấp 1 – Quy trình cha:</strong> nhóm theo ProcessId, đại diện một quy trình nghiệp vụ logic.</p>
<p><strong>Cấp 2 – Phiên bản con:</strong> mỗi bản ghi là một process definition version đã deploy của cùng ProcessId.</p></td>
</tr>
</tbody>
</table>

2.  Quy tắc kích hoạt đồng bộ

|  |  |  |  |
|:--:|:--:|:--:|:--:|
| **Nguồn kích hoạt** | **triggerSource** | **Thời điểm chạy** | **Ghi chú** |
| **Realtime** | REALTIME | Camunda deploy quy trình mới, deploy phiên bản mới của quy trình đã có, hoặc xóa quy trình/phiên bản thuộc tenant DTMS | Hệ thống nhận sự kiện thay đổi và tự đồng bộ ngay quy trình đó, không cần người dùng thao tác. |
| **Thủ công** | MANUAL | Người dùng có quyền bấm **Đồng bộ từ Camunda**. | Dùng để kiểm tra lại hoặc bù dữ liệu (ví dụ khi đồng bộ realtime bị lỗi). |

> ● Hai cơ chế dùng **cùng một logic** (đồng bộ quy trình và đồng bộ luật hiển thị hành động), chỉ khác triggerSource.
>
> ● Tại một thời điểm chỉ có **một phiên đồng bộ** đang chạy cho cùng một quy trình để tránh ghi đè dữ liệu: yêu cầu realtime chuyển sang trạng thái chờ; yêu cầu thủ công bị từ chối và thông báo cho người dùng.
>
> ● Mỗi lần chạy ghi log: thời gian bắt đầu/kết thúc, nguồn kích hoạt, người kích hoạt (nếu thủ công), số bản ghi thêm mới, cập nhật, đánh dấu dừng hoạt động, số luật sinh mới, số lỗi.

3.  Quy tắc ánh xạ

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 25%" />
<col style="width: 55%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Trường hệ thống</strong></td>
<td style="text-align: center;"><strong>Nguồn Camunda</strong></td>
<td style="text-align: center;"><strong>Quy tắc</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Mã Camunda</strong></td>
<td style="text-align: left;">ProcessId</td>
<td style="text-align: left;">Mã duy nhất của quy trình trên Camunda; là khóa nhóm quy trình cha.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Mã quy trình</strong></td>
<td style="text-align: left;">ProcessName</td>
<td style="text-align: left;">Phần đứng <strong>trước</strong> dấu gạch ngang “-”. Ví dụ: RD02.01.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Tên quy trình</strong></td>
<td style="text-align: left;">ProcessName</td>
<td style="text-align: left;">Phần đứng <strong>sau</strong> dấu gạch ngang “-”. Ví dụ: Quy trình Xét duyệt nhiệm vụ cấp Cơ sở.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Phiên bản</strong></td>
<td style="text-align: left;">version</td>
<td style="text-align: left;">Mỗi version đã deploy là một dòng con. Cột Phiên bản hiển thị phiên bản được đồng bộ về gần nhất.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>Mô tả phiên bản</strong></td>
<td style="text-align: left;">Mô tả của version</td>
<td style="text-align: left;"></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Số hồ sơ đang xử lý</strong></td>
<td style="text-align: left;">Tổng số process instance còn ở trạng thái đang chạy của từng version</td>
<td style="text-align: left;"></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Trạng thái</strong></td>
<td style="text-align: left;">Sự tồn tại của version trong runtime</td>
<td style="text-align: left;"><p>Hoạt động: Version còn tồn tại trong Camunda runtime.</p>
<p>Dừng hoạt động: Version không còn trong nguồn Camunda tại thời điểm đồng bộ, hoặc đã bị xóa khỏi runtime.</p></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Version</strong></td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>- Deploy lại process definition cùng process ID mà nội dung thay đổi thì Camunda đăng ký <strong>version mới</strong>; các version có thể chạy song song.</p>
<p>- Các Instance đang chạy giữ version đã khởi tạo; instance mới dùng latest version.</p></td>
</tr>
</tbody>
</table>

##### 3.1.1.5.5. Luồng nghiệp vụ

<img src="media/image3.png" style="width:3.75277in;height:6.38953in" />

<table style="width:100%;">
<colgroup>
<col style="width: 7%" />
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Bước</strong></td>
<td style="text-align: center;"><strong>Mô tả</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: center;"><ul>
<li><p>Tại màn hình <strong>Danh sách quy trình</strong>, người dùng chọn nút <strong>Đồng bộ từ Camunda</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống kiểm tra quyền thực hiện chức năng Đồng bộ.</p>
<ul>
<li><p>Nếu hợp lệ, hệ thống khởi tạo quá trình đồng bộ và chuyển nút sang trạng thái đang xử lý; trong thời gian xử lý không cho phép người dùng gửi lặp yêu cầu.</p></li>
<li><p>Nếu không hợp lệ thì thông báo lỗi theo <a href="#xử-lý-lỗi-trả-về-từ-phía-xử-lý"><em><u>Xử lý lỗi trả về từ phía xử lý</u></em></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống thực hiện lấy danh sách quy trình và các phiên bản quy trình từ Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống kiểm tra dữ liệu nhận được từ Camunda.</p>
<ul>
<li><p><strong>Nếu dữ liệu hợp lệ:</strong> chuyển sang bước 5.</p></li>
<li><p><strong>Nếu mất kết nối, Camunda trả lỗi hoặc dữ liệu không hợp lệ:</strong> chuyển sang bước 9.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống đối chiếu dữ liệu nhận được với danh sách quy trình và phiên bản đang có trên hệ thống theo thông tin định danh tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống xử lý từng quy trình/phiên bản:</p>
<ul>
<li><p><strong>Nếu chưa tồn tại:</strong> ghi nhận quy trình/phiên bản mới và ánh xạ phiên bản vào đúng quy trình cha.</p></li>
<li><p><strong>Nếu đã tồn tại:</strong> cập nhật các thông tin được đồng bộ theo dữ liệu hợp lệ nhận từ Camunda. Hệ thống không tạo trùng cùng khóa Camunda và phiên bản.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống cập nhật kết quả đồng bộ gồm danh sách quy trình/phiên bản, trạng thái và số hồ sơ đang xử lý theo dữ liệu hợp lệ nhận được.</p></li>
<li><p>Việc xử lý phải bảo đảm không phát sinh bản ghi trùng hoặc quan hệ sai giữa quy trình cha và phiên bản con.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: center;"><ul>
<li><p>Sau khi toàn bộ quá trình đồng bộ hoàn tất thành công, hệ thống tải lại màn hình <strong>Danh sách quy trình</strong> và hiển thị dữ liệu đã được cập nhật; đồng thời hiển thị thông báo đồng bộ thành công theo quy tắc thông báo dùng chung. Luồng xử lý kết thúc.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>9</strong></td>
<td style="text-align: center;"><ul>
<li><p>Nếu quá trình đồng bộ không thành công, hệ thống không ghi nhận dữ liệu một phần, giữ nguyên dữ liệu hợp lệ hiện có và hiển thị thông báo đồng bộ không thành công. Luồng xử lý kết thúc.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 3.1.1.6. Chức năng Engine App nghiệp vụ đánh dấu quy trình đã bị xóa từ Camunda

##### 3.1.1.6.1. Thông tin chung chức năng

- Mã chức năng:

- Mục đích: Cho phép Engine App đối chiếu dữ liệu quy trình đang được quản lý trên hệ thống với dữ liệu hiện có tại Camunda, xác định các quy trình đã bị xóa khỏi Camunda và cập nhật trạng thái tương ứng trên hệ thống thành **Đã dừng**.

- Cơ chế khởi tạo: trong quá trình thực hiện chức năng **Đồng bộ danh sách quy trình từ Camunda**

- Tiền điều kiện:

  - Hệ thống đã có dữ liệu quy trình được đồng bộ từ Camunda

  - Engine App lấy được dữ liệu quy trình hiện có tại Camunda để thực hiện đối chiếu.

- Hậu điều kiện:

  - Quy trình được xác định không còn tồn tại tại Camunda được cập nhật trạng thái **Dừng hoạt động** trên hệ thống.

  - Kết quả trạng thái được hiển thị tại màn hình **Danh sách quy trình***.*

##### 3.1.1.6.2. Màn hình

- Chức năng **không có màn hình thao tác riêng**.

- Kết quả xử lý được phản ánh tại màn hình **Danh sách quy trình**, cột **Trạng thái**.

- Khi Engine App xác định một quy trình đã bị xóa khỏi Camunda, phiên bản tương ứng được cập nhật và hiển thị trạng thái: ***DỪNG HOẠT ĐỘNG.***

- Việc cập nhật trạng thái do hệ thống tự động thực hiện; người dùng không thực hiện thay đổi trạng thái trực tiếp tại màn hình Danh sách quy trình.

##### 3.1.1.6.3. Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 14%" />
<col style="width: 12%" />
<col style="width: 13%" />
<col style="width: 10%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: left;">Nguồn kích hoạt</td>
<td style="text-align: left;">Enum</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo luồng thực hiện</td>
<td><ul>
<li><p>Trong quá trình thực hiện chức năng <strong>Đồng bộ danh sách quy trình từ Camunda</strong></p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: left;">Danh sách quy trình trên hệ thống</td>
<td style="text-align: left;">Dataset</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo dữ liệu hiện có</td>
<td><ul>
<li><p>Tập các quy trình và phiên bản đã được đồng bộ từ Camunda và đang được hệ thống Quản trị KHCN quản lý.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: left;">Danh sách quy trình tại Camunda</td>
<td style="text-align: left;">Dataset</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo dữ liệu Camunda</td>
<td><ul>
<li><p>Tập các quy trình và phiên bản còn tồn tại tại Camunda tại thời điểm thực hiện đối chiếu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: left;">Mã Camunda</td>
<td style="text-align: left;">String [tối đa 100 ký tự]</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo dữ liệu quy trình</td>
<td><ul>
<li><p>Thông tin định danh quy trình/phiên bản đã được đồng bộ từ Camunda, sử dụng để xác định bản ghi tương ứng khi đối chiếu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: left;">Phiên bản</td>
<td style="text-align: left;">String [tối đa 20 ký tự]</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo dữ liệu quy trình</td>
<td><ul>
<li><p>Xác định phiên bản của quy trình đang được đối chiếu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: left;">Kết quả đối chiếu</td>
<td style="text-align: left;">Enum</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Xác định quy trình/phiên bản <strong>còn tồn tại</strong> hoặc <strong>không còn tồn tại</strong> tại Camunda tại thời điểm đối chiếu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: left;">Trạng thái</td>
<td style="text-align: left;">Enum</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Nếu quy trình/phiên bản không còn tồn tại tại Camunda, hệ thống cập nhật trạng thái thành <strong>Đã dừng</strong>.</p></li>
<li><p>Trường hợp vẫn tồn tại tại Camunda, chức năng không thay đổi trạng thái hiện tại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: left;">Chu kỳ kiểm tra tự động</td>
<td style="text-align: left;">Configuration</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo cấu hình hệ thống</td>
<td><ul>
<li><p>Xác định khoảng thời gian để Engine App tự động thực hiện đối chiếu dữ liệu quy trình với Camunda.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>9</strong></td>
<td style="text-align: left;">Kết quả xử lý</td>
<td style="text-align: left;">Log/Audit</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Ghi nhận kết quả thực hiện đối chiếu và các bản ghi được cập nhật trạng thái theo cơ chế logging/audit của hệ thống.</p></li>
</ul></td>
</tr>
</tbody>
</table>

##### 3.1.1.6.4. Luồng nghiệp vụ

<img src="media/image4.png" style="width:2.36042in;height:5.88104in" />

<table style="width:100%;">
<colgroup>
<col style="width: 7%" />
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Bước</strong></td>
<td style="text-align: center;"><strong>Mô tả</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: center;"><ul>
<li><p>Chức năng được khởi tạo theo chức năng: <strong>Đồng bộ quy trình từ Camunda</strong></p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: center;"><ul>
<li><p>Engine App lấy danh sách quy trình và phiên bản hiện có tại Camunda để phục vụ đối chiếu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống kiểm tra kết quả lấy dữ liệu:</p>
<ul>
<li><p><strong>Nếu lấy dữ liệu thành công</strong>, chuyển sang bước 4.</p></li>
<li><p><strong>Nếu lấy dữ liệu không thành công</strong>, hệ thống ghi nhận lỗi, không thực hiện cập nhật trạng thái quy trình và kết thúc luồng.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: center;"><ul>
<li><p>Engine App lấy danh sách các quy trình và phiên bản đã được đồng bộ từ Camunda và đang được quản lý trên hệ thống.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống đối chiếu từng quy trình/phiên bản trên hệ thống với tập dữ liệu hiện có tại Camunda theo <strong>Mã Camunda</strong> và <strong>Phiên bản</strong> tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: center;"><ul>
<li><p>Với quy trình/phiên bản <strong>vẫn còn tồn tại tại Camunda</strong>, hệ thống giữ nguyên trạng thái hiện tại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: center;"><ul>
<li><p>Với quy trình/phiên bản <strong>không còn tồn tại tại Camunda</strong>, hệ thống xác định quy trình đã bị xóa tại nguồn và cập nhật <strong>Trạng thái</strong> thành <strong>Đã dừng</strong> trên hệ thống.</p></li>
<li><p>Bản ghi quy trình và thông tin phiên bản vẫn được giữ lại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hệ thống ghi nhận kết quả xử lý và các thay đổi trạng thái theo cơ chế logging/audit của hệ thống.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>9</strong></td>
<td style="text-align: center;"><ul>
<li><p>Trạng thái sau khi xử lý được phản ánh tại màn hình <strong>Danh sách quy trình</strong>.</p></li>
<li><p>Các phiên bản thuộc quy trình được xác định đã bị xóa tại Camunda hiển thị trạng thái <strong>Đã dừng</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>10</strong></td>
<td style="text-align: center;"><ul>
<li><p>Luồng xử lý kết thúc.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### 3.1.2. Quản lý Ma trận hành động

#### 3.1.2.1. Xem danh sách Luật hiển thị hành động

##### 3.1.2.1.1 Thông tin chung chức năng

> ● Mã chức năng:
>
> ● Mục đích: Cho phép người dùng quản trị quy trình tra cứu danh sách các luật hiển thị hành động đã được cấu hình trên hệ thống, phục vụ việc kiểm soát điều kiện hiển thị của từng hành động (nút thao tác) trên các màn hình nghiệp vụ theo quy trình, bước và vai trò thực hiện.
>
> ● Người dùng mục tiêu: Quản trị hệ thống và Người dùng quản trị quy trình được cấp quyền chức năng Ma trận hành động.
>
> ● Đường dẫn truy cập: Quản trị quy trình → Ma trận hành động → Luật hiển thị hành động.
>
> ● Tiền điều kiện:
>
> ○ Người dùng đã đăng nhập
>
> ○ Phiên đăng nhập còn hiệu lực
>
> ○ Tài khoản đang hoạt động
>
> ○ Người dùng có quyền truy cập chức năng Ma trận hành động.
>
> ● Hậu điều kiện:
>
> ○ Danh sách luật hiển thị hành động được hiển thị theo phạm vi quyền, từ khóa tìm kiếm và tham số phân trang hiện tại.
>
> ○ Các thao tác xem và tìm kiếm không làm thay đổi dữ liệu luật hiển thị hành động.

##### 3.1.2.1.2 Màn hình

<img src="media/image28.png" style="width:8.8189in;height:4.06944in" />

##### 3.1.2.1.3 Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 4%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 7%" />
<col style="width: 11%" />
<col style="width: 54%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/ Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Danh sách luật hiển thị hành động</td>
<td>Label</td>
<td>Output</td>
<td>Danh sách luật hiển thị hành động</td>
<td><ul>
<li><p>Hiển thị tên chức năng tại đầu vùng nội dung.</p></li>
<li><p>Nội dung cố định, không cho phép chỉnh sửa.</p></li>
</ul></td>
</tr>
<tr>
<td>2</td>
<td>Tìm kiếm</td>
<td>Search box [tối đa 255 ký tự]</td>
<td>Input</td>
<td>Rỗng. Placeholder: Tìm kiếm theo mã luật, tên hành động</td>
<td><ul>
<li><p>Cho phép tìm kiếm theo Mã luật hành động hoặc Tên hành động.</p></li>
<li><p>Quy tắc nhập Search box áp dụng theo mục 4.1 – Trường điều khiển dùng chung; xử lý từ khóa, cập nhật tập kết quả và phân trang áp dụng theo mục 4.3 – Kịch bản tìm kiếm và lọc dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td>3</td>
<td>Thêm mới</td>
<td>Button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Cho phép người dùng có quyền mở màn hình Thêm mới luật hiển thị hành động.</p></li>
<li><p>Chỉ hiển thị/cho phép thao tác theo quyền của người dùng.</p></li>
<li><p>Quy tắc Button áp dụng theo mục 4.1 – Trường điều khiển dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td>4</td>
<td>STT</td>
<td>String [tối đa 20 ký tự]</td>
<td>Output</td>
<td>Theo vị trí bản ghi</td>
<td><ul>
<li><p>Hiển thị số thứ tự của bản ghi trong tập kết quả.</p></li>
<li><p>Quy tắc căn chỉnh áp dụng theo mục 4.2 – Bảng danh sách dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td>Mã luật hành động</td>
<td>String [tối đa 50 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị mã định danh duy nhất của luật hiển thị hành động, ví dụ LHD-2026-01.</p></li>
<li><p>Mã được hệ thống sinh tự động khi tạo mới, không cho phép chỉnh sửa tại màn hình danh sách.</p></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Mã hành động</td>
<td>String [tối đa 100 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị mã của hành động mà luật áp dụng, ví dụ APPROVE_STEP.</p></li>
<li><p>Quy tắc hiển thị nội dung trong bảng áp dụng theo mục 4.2.</p></li>
</ul></td>
</tr>
<tr>
<td>7</td>
<td>Tên hành động</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị tên diễn giải của hành động tương ứng với Mã hành động, ví dụ Đồng ý duyệt.</p></li>
</ul></td>
</tr>
<tr>
<td>8</td>
<td>Mã quy trình</td>
<td>String/Label [tối đa 255 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị mã quy trình mà luật được áp dụng, kèm theo tên quy trình hiển thị bên dưới dưới dạng chữ mô tả, ví dụ RD02.02 – Quy trình xét duyệt NVKHCN cấp Tập đoàn.</p></li>
<li><p>Quy tắc hiển thị nội dung dài áp dụng theo mục 4.2.</p></li>
</ul></td>
</tr>
<tr>
<td>9</td>
<td>Ngày tạo</td>
<td>Date [hh:mm:ss dd/mm/yyyy]</td>
<td>Output</td>
<td>Theo dữ liệu hệ thống</td>
<td><ul>
<li><p>Hiển thị ngày tạo bản ghi luật hiển thị hành động.</p></li>
</ul></td>
</tr>
<tr>
<td>10</td>
<td>Ngày cập nhật</td>
<td>Date [hh:mm:ss dd/mm/yyyy]</td>
<td>Output</td>
<td>Theo dữ liệu hệ thống</td>
<td><ul>
<li><p>Hiển thị ngày cập nhật gần nhất của bản ghi luật hiển thị hành động.</p></li>
</ul></td>
</tr>
<tr>
<td>11</td>
<td>Trạng thái</td>
<td>Badge – Enum</td>
<td>Output</td>
<td>Theo trạng thái hiện tại</td>
<td><ul>
<li><p><mark>Hiển thị trạng thái của luật hiển thị hành động gồm:</mark></p></li>
</ul>
<ul>
<li><p><mark>Trạng thái Đang hoạt động: Luật đang hoạt động</mark></p></li>
<li><p><mark>Trạng thái Dừng hoạt động: Luật không còn được áp dụng</mark></p></li>
</ul></td>
</tr>
<tr>
<td>12</td>
<td>Xem chi tiết</td>
<td>Icon button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Khi chọn, mở màn hình Xem chi tiết Luật hiển thị hành động (chỉ đọc) với đúng bản ghi được chọn.</p></li>
</ul></td>
</tr>
<tr>
<td>13</td>
<td>Chỉnh sửa</td>
<td>Icon button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Khi chọn, mở màn hình Chỉnh sửa Luật hiển thị hành động với đúng bản ghi được chọn.</p></li>
<li><p>Chỉ hiển thị theo quyền chỉnh sửa của người dùng.</p></li>
</ul></td>
</tr>
<tr>
<td>14</td>
<td>Xóa</td>
<td>Icon button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Cho phép xóa luật hiển thị hành động sau khi người dùng xác nhận theo cơ chế xác nhận dùng chung.</p></li>
<li><p><mark>Không được xóa khi Luật hành động đang được gán với ít nhất 1 hồ sơ Đang chạy hoặc Quá hạn</mark></p></li>
<li><p>Chỉ hiển thị theo quyền xóa của người dùng.</p></li>
</ul></td>
</tr>
<tr>
<td>15</td>
<td>Phân trang</td>
<td>Paging</td>
<td>Input/Output</td>
<td>Theo cấu hình phân trang dùng chung</td>
<td><ul>
<li><p>Thực hiện phân trang danh sách luật hiển thị hành động.</p></li>
<li><p>Tổng số bản ghi, số bản ghi/trang, điều hướng trang và việc giữ điều kiện tìm kiếm áp dụng theo mục 4.4 – Phân trang dùng chung.</p></li>
</ul></td>
</tr>
</tbody>
</table>

##### 3.1.2.1.4 Luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 94%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Bước</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>● Người dùng truy cập Ma trận hành động → Luật hiển thị hành động.</td>
</tr>
<tr>
<td>2</td>
<td><p>● Hệ thống truy vấn danh sách luật hiển thị hành động theo điều kiện mặc định và phạm vi dữ liệu người dùng được phép xem.</p>
<p>● Trong thời gian lấy dữ liệu, bảng hiển thị trạng thái xử lý theo mục 4.2 – Bảng danh sách dùng chung.</p></td>
</tr>
<tr>
<td>3</td>
<td><p>● Hệ thống xử lý kết quả truy vấn:</p>
<p>● Nếu có dữ liệu: hiển thị danh sách luật với các thông tin Mã luật hành động, Mã hành động, Tên hành động, Mã quy trình, Ngày tạo, Ngày cập nhật, Trạng thái và Thao tác.</p>
<p>● Nếu không có dữ liệu: hiển thị trạng thái “Chưa có dữ liệu” theo quy tắc Bảng danh sách dùng chung.</p></td>
</tr>
<tr>
<td>4</td>
<td>● Hệ thống hiển thị tổng số bản ghi và thông tin phân trang tương ứng với tập dữ liệu trả về.</td>
</tr>
<tr>
<td>5</td>
<td>● Luồng xử lý kết thúc.</td>
</tr>
</tbody>
</table>

#### 3.1.2.2. Thêm mới Luật hiển thị hành động

##### 3.1.2.2.1 Thông tin chung chức năng

> ● Mã chức năng:
>
> ● Mục đích: Cho phép người dùng quản trị quy trình cấu hình một luật hiển thị hành động mới, xác định điều kiện (hành động, màn hình, quy trình áp dụng, bước, biểu mẫu, vai trò thực hiện) để hệ thống quyết định hiển thị đúng hành động (nút thao tác) cho đúng người dùng tại đúng bước nghiệp vụ.
>
> ● Người dùng mục tiêu: Quản trị hệ thống và Người dùng quản trị quy trình được cấp quyền tạo mới trong chức năng Ma trận hành động.
>
> ● Đường dẫn truy cập: Quản trị quy trình → Ma trận hành động → Luật hiển thị hành động → Thêm mới.
>
> ● Tiền điều kiện:
>
> ○ Người dùng đã truy cập màn hình Danh sách luật hiển thị hành động
>
> ○ Có quyền tạo mới luật hiển thị hành động
>
> ○ Danh mục hành động, danh mục quy trình, danh mục màn hình, danh mục biểu mẫu và danh mục vai trò đã được cấu hình sẵn trên hệ thống.
>
> ● Hậu điều kiện:
>
> ○ Luật hiển thị hành động mới được ghi nhận trên hệ thống và hiển thị tại màn hình Danh sách luật hiển thị hành động.
>
> ○ Nếu người dùng chọn Hủy, không có dữ liệu nào được ghi nhận.

##### 3.1.2.2.2 Màn hình

<img src="media/image30.png" style="width:8.50119in;height:3.76381in" />

##### 3.1.2.2.3 Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 4%" />
<col style="width: 10%" />
<col style="width: 13%" />
<col style="width: 6%" />
<col style="width: 11%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/ Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Thêm mới luật hiển thị hành động</td>
<td>Label</td>
<td>Output</td>
<td>Thêm mới luật hiển thị hành động</td>
<td><ul>
<li><p>Hiển thị tên chức năng tại đầu màn hình.</p></li>
</ul></td>
</tr>
<tr>
<td>2</td>
<td>Hủy</td>
<td>Button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Đóng màn hình Tạo mới và quay về màn hình Danh sách luật hiển thị hành động.</p></li>
<li><p>Dữ liệu đã nhập chưa lưu sẽ không được ghi nhận; áp dụng cảnh báo xác nhận nếu người dùng đã nhập liệu, theo mục 4.1 – Trường điều khiển dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td>3</td>
<td>Lưu</td>
<td>Button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Thực hiện kiểm tra hợp lệ toàn bộ dữ liệu trên form và ghi nhận luật hiển thị hành động mới nếu dữ liệu hợp lệ.</p></li>
<li><p>Quy tắc Button và thông báo lỗi áp dụng theo mục 4.1 và mục 4.6 – Thông báo chung và trạng thái xử lý.</p></li>
</ul></td>
</tr>
<tr>
<td>4</td>
<td>Thông tin chung</td>
<td>Label</td>
<td>Output</td>
<td>Thông tin chung</td>
<td><ul>
<li><p>Tiêu đề khu vực nhập thông tin cấu hình của luật hiển thị hành động.</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td>Hành động *</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Rỗng. Placeholder: Chọn hành động</td>
<td><ul>
<li><p>Bắt buộc chọn. Danh sách lấy từ <strong>Danh mục hành động.</strong></p></li>
<li><p>Xác định hành động (nút thao tác) mà luật này quy định điều kiện hiển thị, ví dụ Đồng ý duyệt (APPROVE_STEP).</p></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Tên hiển thị *</td>
<td>String [tối đa 50 ký tự]</td>
<td>Input</td>
<td>Rỗng. Placeholder: Nhập tên hiển thị</td>
<td><ul>
<li><p>Bắt buộc nhập.</p></li>
<li><p>Tên của nút/hành động sẽ hiển thị trên giao diện nghiệp vụ cho người dùng cuối, ví dụ Trình duyệt.</p></li>
<li><p>Khi người dùng chọn Hành động, tên hiển thị hành động mặc định tự động fill theo trường Component 5, dữ liệu tương ứng lấy từ Tên hành động theo Mã hành động. Người dùng có thể chỉnh sửa tên hành động.</p></li>
<li><p>Cho phép nhập ký tự và số, ký tự đặc biệt.</p></li>
<li><p>Tối đa 50 ký tự bao gồm cả khoảng trắng, nếu vượt quá số ký tự hoặc để trống có thông báo lỗi tương ứng. Thông báo lỗi tham chiếu thông tin ở <strong>mục 4.1 – Trường điều khiển dùng chung.</strong></p></li>
</ul></td>
</tr>
<tr>
<td>7</td>
<td>Loại *</td>
<td>Dropdown – Enum</td>
<td>Input</td>
<td>Rỗng. Placeholder: Hành động chính</td>
<td><ul>
<li><p>Hiển thị theo Loại hành động của hành động tại Danh mục hành động</p></li>
<li><p><strong>Danh sách loại hành động:</strong></p>
<ul>
<li><p>Hành động chính</p></li>
<li><p>Hành động chi tiết.</p></li>
<li><p>Hành động khác.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td>8</td>
<td>Mã luật hiển thị *</td>
<td>String [tối đa 50 ký tự]</td>
<td>Input</td>
<td>Rỗng. Placeholder: Nhập mã luật hiển thị</td>
<td><ul>
<li><p>Bắt buộc nhập tại màn hình Tạo mới. Mã định danh duy nhất của luật, ví dụ LHD-2026-06.</p></li>
<li><p>Mã luật hành động tuân thủ thông tin mã ở <strong>mục 4.1 – Trường điều khiển dùng chung.</strong></p></li>
<li><p>Hệ thống kiểm tra trùng mã trong phạm vi toàn hệ thống; hiển thị lỗi nếu mã đã tồn tại. Thông báo <strong>VL009.</strong></p></li>
</ul></td>
</tr>
<tr>
<td>9</td>
<td>Màn hình hiển thị *</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Rỗng. Placeholder: Chọn màn hình</td>
<td><ul>
<li><p>Bắt buộc chọn. Xác định màn hình nghiệp vụ mà hành động sẽ được hiển thị, ví dụ Chi tiết hồ sơ.</p></li>
<li><p>Danh sách hiển thị dạng combobox mở rộng gồm các mã hành động tương ứng.</p></li>
<li><p>Danh sách màn hình hiển thị bao gồm:</p>
<ul>
<li><p>Việc của tôi</p></li>
<li><p>Chi tiết Hồ sơ</p></li>
<li><p>Chi tiết Hội đồng.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td>10</td>
<td>Quy trình áp dụng *</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Rỗng. Placeholder: Chọn quy trình áp dụng</td>
<td><ul>
<li><p>Bắt buộc chọn.</p></li>
<li><p>Cho phép chọn 1 quy trình.</p></li>
<li><p>Danh sách lấy từ chức năng Quản lý quy trình , xác định quy trình mà luật được áp dụng. Lấy giá trị bao gồm mã quy trình - tên quy trình theo thời gian tạo từ mới -&gt; cũ.</p></li>
</ul></td>
</tr>
<tr>
<td>11</td>
<td>Bước trong điều kiện</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Rỗng. Placeholder: Chọn bước</td>
<td><ul>
<li><p>Xác định bước cụ thể trong quy trình áp dụng mà luật có hiệu lực; danh sách các user task được lấy theo sơ đồ BPMN của quy trình đã chọn. Các bước được quy định theo sơ đồ BPMN, <strong>mỗi bước là 1 nhánh User Task trong quy trình BPMN trên Camunda. Dữ liệu đổ về và đánh dấu theo trường Name/General của quy trình tương ứng đã chọn trên Camunda. Mỗi Name là 1 bước.</strong></p></li>
</ul>
<p><img src="media/image14.png" style="width:4.00521in;height:0.73056in" /></p>
<ul>
<li><p>Trường chỉ có dữ liệu để chọn sau khi đã chọn Quy trình áp dụng.</p></li>
<li><p>Bắt buộc chọn.</p></li>
</ul></td>
</tr>
<tr>
<td>12</td>
<td>Biểu mẫu sử dụng</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Rỗng. Placeholder: Chọn biểu mẫu sử dụng</td>
<td><ul>
<li><p>Xác định biểu mẫu (BM.02.0x.DKI.NV_2024...) mà hành động thao tác trên đó, phục vụ liên kết dữ liệu hành động với biểu mẫu nghiệp vụ.</p></li>
<li><p>Danh sách biểu mẫu: Lấy từ danh sách <strong>Danh mục dùng chung/Eform.</strong></p></li>
<li><p><strong>Chỉ cho phép chọn 1 biểu mẫu.</strong></p></li>
<li><p><strong>Hiển thị giá trị mã Eform - tên Eform. Giá trị nào không có thì không hiển thị và bỏ dấu “-”.</strong></p></li>
</ul></td>
</tr>
<tr>
<td>13</td>
<td>Vai trò thực thi</td>
<td>Dropdown/Combobox – multi-select</td>
<td>Input</td>
<td>Rỗng. Placeholder: Chọn vai trò thực thi</td>
<td><ul>
<li><p>Xác định (các) vai trò được phép thực hiện hành động này, danh sách lấy từ <strong>Danh mục dùng chung/Vai trò thực hiện.</strong></p></li>
<li><p>Cho phép chọn nhiều vai trò cùng lúc.</p></li>
<li><p>Danh sách vai trò hiển thị theo thứ tự hiển thị ở màn hình danh sách vai trò thực hiện.</p></li>
</ul></td>
</tr>
<tr>
<td>14</td>
<td style="text-align: left;">Hủy</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Hủy hành động, không tạo Luật hiển thị hành động.</p></li>
</ul></td>
</tr>
<tr>
<td>15</td>
<td style="text-align: left;">Lưu</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Xác nhận Lưu Luật hiển thị hành động. Hệ thống tạo ra 1 Luật hiển thị hành động với đầy đủ các thông tin người dùng đã điền và chọn.</p></li>
<li><p>Sau khi Lưu luật hiển thị hành động, hệ thống tự động chuyển trạng thái Luật sang Kích hoạt.</p></li>
</ul>
<blockquote>
<p><strong>Quy tắc xử lý</strong></p>
</blockquote>
<ul>
<li><p>Khi người dùng bấm <strong>Lưu</strong>, hệ thống kiểm tra tính hợp lệ của các thông tin bắt buộc.</p></li>
<li><p>Nếu dữ liệu hợp lệ, hệ thống tạo mới 01 luật hiển thị hành động trong DB.</p></li>
<li><p>Bản ghi được lưu phải bao gồm tối thiểu: mã luật, tên luật, quy trình áp dụng, bước áp dụng, vai trò áp dụng, hành động hiển thị, điều kiện áp dụng, trạng thái hiệu lực, người tạo, thời gian tạo.</p></li>
<li><p>Sau khi lưu thành công, luật này được dùng để xác định danh sách hành động hiển thị trên màn hình xử lý hồ sơ tại mục <strong>Việc của tôi</strong>, tương ứng với bước hiện tại của hồ sơ và vai trò của người đang đăng nhập.</p></li>
</ul>
<p><strong>Điều kiện áp dụng</strong></p>
<p>Hành động chỉ được hiển thị khi đồng thời thỏa các điều kiện sau:</p>
<ul>
<li><p>Hồ sơ đang ở đúng <strong>bước quy trình</strong> được cấu hình trong luật.</p></li>
<li><p>Người dùng đang đăng nhập thuộc đúng <strong>vai trò thực hiện</strong> được cấu hình trong luật.</p></li>
<li><p>Hồ sơ thuộc đúng <strong>quy trình áp dụng</strong> của luật.</p></li>
<li><p>Luật đang ở trạng thái <strong>Kích hoạt.</strong></p></li>
</ul></td>
</tr>
</tbody>
</table>

##### 3.1.2.2.4 Luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 94%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Bước</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>● Tại màn hình Danh sách luật hiển thị hành động, người dùng chọn nút Tạo mới.</td>
</tr>
<tr>
<td>2</td>
<td>● Hệ thống hiển thị màn hình Tạo mới luật hiển thị hành động với các trường dữ liệu ở trạng thái rỗng.</td>
</tr>
<tr>
<td>3</td>
<td>● Người dùng nhập/chọn thông tin: Hành động, Tên hiển thị, Loại, Mã luật hiển thị, Màn hình hiển thị, Quy trình áp dụng, Bước trong điều kiện, Biểu mẫu sử dụng, Vai trò thực thi.</td>
</tr>
<tr>
<td>4</td>
<td>● Người dùng chọn Lưu.</td>
</tr>
<tr>
<td>5</td>
<td><p>● Hệ thống kiểm tra tính hợp lệ của dữ liệu, bao gồm các trường bắt buộc và tính duy nhất của Mã luật hiển thị:</p>
<p>● Nếu dữ liệu không hợp lệ: hiển thị thông báo lỗi tương ứng theo mục 4.6, người dùng quay lại bước 3.</p>
<p>● Nếu dữ liệu hợp lệ: chuyển sang bước 6.</p></td>
</tr>
<tr>
<td>6</td>
<td>● Hệ thống ghi nhận luật hiển thị hành động mới, gán trạng thái mặc định và hiển thị thông báo tạo mới thành công.</td>
</tr>
<tr>
<td>7</td>
<td>● Hệ thống đóng màn hình Tạo mới và quay về màn hình Danh sách luật hiển thị hành động với dữ liệu được cập nhật. Luồng xử lý kết thúc.</td>
</tr>
</tbody>
</table>

#### 3.1.2.3. Xem chi tiết Luật hiển thị hành động

##### 3.1.2.3.1 Thông tin chung chức năng

> ● Mã chức năng:
>
> ● Mục đích: Cho phép người dùng tra cứu toàn bộ thông tin cấu hình của một luật hiển thị hành động ở chế độ chỉ đọc, kèm khu vực xem trước cách hành động được hiển thị trên giao diện nghiệp vụ.
>
> ● Người dùng mục tiêu: Quản trị hệ thống và Người dùng được cấp quyền xem chức năng Ma trận hành động.
>
> ● Đường dẫn truy cập: Quản trị quy trình → Ma trận hành động → Luật hiển thị hành động → Chọn biểu tượng Xem chi tiết tại bản ghi cần xem.
>
> ● Tiền điều kiện:
>
> ○ Người dùng đã truy cập màn hình Danh sách luật hiển thị hành động
>
> ○ Có quyền xem
>
> ○ Luật hiển thị hành động được lựa chọn còn tồn tại trên hệ thống.
>
> ● Hậu điều kiện:
>
> ○ Thông tin chi tiết của luật hiển thị hành động được hiển thị.
>
> ○ Chức năng chỉ phục vụ tra cứu, không làm thay đổi dữ liệu cấu hình.

##### 3.1.2.3.2 Màn hình

<img src="media/image31.png" style="width:8.49077in;height:3.81934in" />

##### 3.1.2.3.3 Mô tả chi tiết các thành phần

<table style="width:100%;">
<colgroup>
<col style="width: 6%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 6%" />
<col style="width: 10%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/ Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Xem chi tiết luật hiển thị nút</td>
<td>Label</td>
<td>Output</td>
<td>Xem chi tiết luật hiển thị nút</td>
<td><ul>
<li><p>Hiển thị tên chức năng tại đầu màn hình.</p></li>
</ul></td>
</tr>
<tr>
<td>2</td>
<td>Thông tin chung</td>
<td>Label</td>
<td>Output</td>
<td>Thông tin chung</td>
<td><ul>
<li><p>Tiêu đề khu vực hiển thị thông tin cấu hình của luật.</p></li>
</ul></td>
</tr>
<tr>
<td>3</td>
<td>Hành động</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị hành động mà luật áp dụng, ví dụ Gửi duyệt (SUBMIT).</p></li>
<li><p>Toàn bộ trường dữ liệu tại màn hình này ở chế độ chỉ đọc (disabled).</p></li>
</ul></td>
</tr>
<tr>
<td>4</td>
<td>Tên hiển thị</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị tên hành động sẽ xuất hiện trên giao diện nghiệp vụ, ví dụ Trình duyệt.</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td>Loại</td>
<td>String – Enum</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị phân loại hành động, ví dụ Hành động chính.</p></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Màn hình hiển thị</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị màn hình nghiệp vụ mà hành động xuất hiện, ví dụ Chi tiết Hồ sơ.</p></li>
</ul></td>
</tr>
<tr>
<td>7</td>
<td>Quy trình áp dụng</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị mã và tên quy trình mà luật áp dụng, ví dụ RD02.02 – Quy trình xét duyệt NVKHCN cấp tập đoàn.</p></li>
</ul></td>
</tr>
<tr>
<td>8</td>
<td>Bước trong điều kiện</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị bước cụ thể trong quy trình mà luật có hiệu lực, ví dụ 1-Khởi tạo.</p></li>
</ul></td>
</tr>
<tr>
<td>9</td>
<td>Biểu mẫu sử dụng</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị biểu mẫu liên quan, ví dụ BM02 – Tạo hồ sơ.</p></li>
</ul></td>
</tr>
<tr>
<td>10</td>
<td>Vai trò thực hiện</td>
<td>String/List [tối đa 1000 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị (các) vai trò được phép thực hiện hành động, ví dụ PM – Chủ nhiệm NV KHCN.</p></li>
</ul></td>
</tr>
<tr>
<td>11</td>
<td>Trạng thái</td>
<td>Toggle Switch</td>
<td>Output</td>
<td>Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Hiển thị trạng thái Kích hoạt/Vô hiệu hóa của luật dưới dạng công tắc; tại màn hình xem chi tiết, công tắc ở chế độ chỉ đọc, không cho phép thay đổi.</p></li>
</ul></td>
</tr>
<tr>
<td>12</td>
<td>Xem trước hiển thị hành động</td>
<td>Label</td>
<td>Output</td>
<td>Xem trước hiển thị hành động</td>
<td><ul>
<li><p>Tiêu đề khu vực mô phỏng cách hành động hiển thị trên giao diện thực tế.</p></li>
</ul></td>
</tr>
<tr>
<td>13</td>
<td>Hình ảnh xem trước</td>
<td>Button (preview – disabled)</td>
<td>Output</td>
<td>Theo Tên hiển thị</td>
<td><ul>
<li><p>Hiển thị mẫu nút hành động đúng như tên hiển thị và kiểu dáng sẽ xuất hiện trên màn hình nghiệp vụ, ví dụ nút Gửi duyệt.</p></li>
<li><p>Chỉ mang tính chất minh họa, không thể thao tác (không kích hoạt hành động thật).</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 3.1.2.4. Chỉnh sửa Luật hiển thị hành động

##### 3.1.2.4.1 Thông tin chung chức năng

> ● Mã chức năng:
>
> ● Mục đích: Cho phép người dùng quản trị quy trình cập nhật thông tin cấu hình và trạng thái Kích hoạt/Vô hiệu hóa của một luật hiển thị hành động đã tồn tại trên hệ thống.
>
> ● Người dùng mục tiêu: Quản trị hệ thống và Người dùng quản trị quy trình được cấp quyền chỉnh sửa trong chức năng Ma trận hành động.
>
> ● Đường dẫn truy cập: Quản trị quy trình → Ma trận hành động → Luật hiển thị hành động → Chọn biểu tượng Chỉnh sửa tại bản ghi cần sửa.
>
> ● Tiền điều kiện:
>
> ○ Người dùng đã truy cập màn hình Danh sách luật hiển thị hành động
>
> ○ Có quyền chỉnh sửa
>
> ○ Luật hiển thị hành động được lựa chọn còn tồn tại trên hệ thống.
>
> ● Hậu điều kiện:
>
> ○ Thông tin luật hiển thị hành động được cập nhật theo dữ liệu hợp lệ và phản ánh lại tại màn hình Danh sách luật hiển thị hành động.
>
> ○ Nếu người dùng chọn Hủy, dữ liệu giữ nguyên như trước khi chỉnh sửa.

##### 3.1.2.4.2 Màn hình

<img src="media/image27.png" style="width:7.99077in;height:3.6133in" />

##### 3.1.2.4.3 Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 13%" />
<col style="width: 13%" />
<col style="width: 7%" />
<col style="width: 10%" />
<col style="width: 47%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/ Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Chỉnh sửa luật hiển thị hành động</td>
<td>Label</td>
<td>Output</td>
<td>Chỉnh sửa luật hiển thị hành động</td>
<td><ul>
<li><p>Hiển thị tên chức năng tại đầu màn hình.</p></li>
</ul></td>
</tr>
<tr>
<td>2</td>
<td>Hủy</td>
<td>Button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Đóng màn hình Chỉnh sửa mà không lưu thay đổi, quay về màn hình Danh sách luật hiển thị hành động.</p></li>
</ul></td>
</tr>
<tr>
<td>3</td>
<td>Lưu</td>
<td>Button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Kiểm tra hợp lệ và ghi nhận các thay đổi trên luật hiển thị hành động nếu dữ liệu hợp lệ.</p></li>
</ul></td>
</tr>
<tr>
<td>4</td>
<td>Hành động *</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép thay đổi hành động mà luật áp dụng; giá trị mặc định hiển thị theo dữ liệu đã lưu, ví dụ Đã duyệt (SUBMIT).</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td>Tên hiển thị *</td>
<td>String [tối đa 255 ký tự]</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép chỉnh sửa tên hiển thị của hành động, ví dụ Trình duyệt.</p></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Loại *</td>
<td>Dropdown – Enum</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép thay đổi phân loại hành động, ví dụ Hành động chính.</p></li>
</ul></td>
</tr>
<tr>
<td>7</td>
<td>Mã luật hành động</td>
<td>String [tối đa 50 ký tự]</td>
<td>Output</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Hiển thị mã luật hiện tại, ví dụ LHD-2026-01.</p></li>
<li><p>Không cho phép chỉnh sửa</p></li>
</ul></td>
</tr>
<tr>
<td>8</td>
<td>Màn hình hiển thị *</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép thay đổi màn hình nghiệp vụ áp dụng</p></li>
</ul></td>
</tr>
<tr>
<td>9</td>
<td>Quy trình áp dụng</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép thay đổi quy trình áp dụng.</p></li>
</ul></td>
</tr>
<tr>
<td>10</td>
<td>Bước trong điều kiện</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép thay đổi bước áp dụng.</p></li>
</ul></td>
</tr>
<tr>
<td>11</td>
<td>Biểu mẫu sử dụng</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Theo dữ liệu hiện tại</td>
<td><ul>
<li><p>Cho phép thay đổi biểu mẫu liên quan.</p></li>
</ul></td>
</tr>
<tr>
<td>12</td>
<td>Vai trò thực hiện</td>
<td>Dropdown/Combobox – multi-select</td>
<td>Input</td>
<td>Rỗng/Theo dữ liệu hiện tại. Placeholder: Chọn vai trò thực hiện</td>
<td><ul>
<li><p>Cho phép thay đổi (các) vai trò được phép thực hiện hành động.</p></li>
</ul></td>
</tr>
<tr>
<td>13</td>
<td>Trạng thái</td>
<td>Toggle Switch</td>
<td>Input/Output</td>
<td>Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Cho phép Dừng hoạt động/Hoạt động luật hiển thị hành động.</p></li>
<li><p>Khi vô hiệu hóa, hành động tương ứng sẽ không được hệ thống áp dụng để hiển thị trên các màn hình Việc của tôi.</p></li>
<li><p><strong>Quy tắc Bật/Tắt trạng thá</strong>i áp dụng theo mục 4.8 – Bật/Tắt trạng thái dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td>14</td>
<td>Xem trước hiển thị hành động</td>
<td>Label</td>
<td>Output</td>
<td>Xem trước hiển thị hành động</td>
<td><ul>
<li><p>Tiêu đề khu vực mô phỏng cách hành động hiển thị theo cấu hình đang chỉnh sửa; cập nhật theo Tên hiển thị vừa nhập.</p></li>
</ul></td>
</tr>
<tr>
<td>15</td>
<td>Nút xem trước</td>
<td>Button (preview – disabled)</td>
<td>Output</td>
<td>Theo Tên hiển thị</td>
<td><ul>
<li><p>Hiển thị mẫu nút hành động theo Tên hiển thị hiện tại trên form, giúp người dùng hình dung kết quả trước khi lưu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 3.1.2.5. Xóa luật hiển thị hành động

##### 3.1.2.5.1 Thông tin chung chức năng

- Mã chức năng:

- Mục đích: Cho phép người dùng xóa Luật hiển thị hành động được tạo nhầm hoặc không còn nhu cầu sử dụng khi Luật hiển thị hành động đáp ứng điều kiện cho phép xóa, đồng thời bảo đảm không làm ảnh hưởng đến Hồ sơ, tiến trình và lịch sử nghiệp vụ đã phát sinh.

- Người dùng mục tiêu: Quản trị hệ thống và Người dùng được cấp quyền Xóa Luật hiển thị hành động.

- Đường dẫn truy cập: Quản trị quy trình → Ma trận hành động → Luật hiển thị hành động → Chọn biểu tượng **Xóa** tại Luật hiển thị hành động cần xóa.

- Tiền điều kiện:

  - Người dùng đã đăng nhập và phiên đăng nhập còn hiệu lực.

  - Người dùng có quyền Xóa Luật hiển thị hành động.

  - Nhiệm vụ được chọn còn tồn tại.

- Hậu điều kiện:

  - Nếu Luật hiển thị hành động đủ điều kiện xóa và thao tác thành công, Luật hiển thị hành động không còn hiển thị trong Danh sách Luật hiển thị hành động.

  - Nếu Luật hiển thị hành động không đáp ứng điều kiện xóa hoặc quá trình xử lý thất bại, dữ liệu Luật hiển thị hành động và các dữ liệu liên quan được giữ nguyên*.*

- Requirements Traceability Matrix – RTM:

##### 3.1.2.5.2. Màn hình

##### 3.1.2.5.3. Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 14%" />
<col style="width: 12%" />
<col style="width: 13%" />
<col style="width: 10%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: left;">Xóa Luật hiển thị hành động</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Biểu tượng thùng rác</td>
<td><ul>
<li><p>Hiển thị tại cột <strong>Thao tác</strong> của Luật hiển thị hành động trên màn hình Danh sách Luật hiển thị hành động. Cho phép khởi tạo thao tác xóa đối với <strong>đúng</strong> Luật hiển thị hành động <strong>tại dòng được chọn</strong>. Chỉ hiển thị/cho phép thao tác khi người dùng có quyền Xóa. Quy tắc Icon Button và cột thao tác áp dụng theo <strong>mục 4.1 – Trường điều khiển dùng chung</strong> và <strong>4.2 – Bảng danh sách dùng chung</strong>; quy tắc xử lý xóa áp dụng theo <strong>mục 4.7</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: left;">Biểu tượng xóa</td>
<td style="text-align: left;">Icon</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Biểu tượng thùng rác</td>
<td><ul>
<li><p>Hiển thị trên popup để người dùng nhận biết đây là thao tác xóa dữ liệu. Quy tắc chung áp dụng theo <strong>mục 4.7 – Xóa bản ghi dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>3</strong></td>
<td style="text-align: left;">Bạn chắc chắn muốn xóa không?</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Cố định</td>
<td><ul>
<li><p>Hiển thị tiêu đề xác nhận trước khi thực hiện xóa Nhiệm vụ. Quy tắc Label áp dụng theo <strong>mục 4.1</strong>; cấu trúc popup xác nhận áp dụng theo <strong>mục 4.7</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>4</strong></td>
<td style="text-align: left;">Nội dung xác nhận</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo Nhiệm vụ được chọn</td>
<td><ul>
<li><p>Hiển thị thông tin nhận diện để người dùng đối chiếu đúng Nhiệm vụ trước khi xác nhận, theo dạng <strong>“Bạn có chắc chắn muốn xóa</strong> L<strong>uật hiển thị hành động: {Mã Luật hiển thị hành động} - {Tên Luật hiển thị hành động} không?”</strong>. Popup phải giữ nguyên định danh của Luật hiển thị hành động đã chọn ban đầu trong suốt phiên xác nhận. Quy tắc xác định đúng bản ghi áp dụng theo <strong>mục 4.7</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>5</strong></td>
<td style="text-align: left;">Hủy bỏ</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Đóng popup xác nhận, không thực hiện xóa và không thay đổi dữ liệu Luật hiển thị hành động. Danh sách giữ nguyên trạng thái trước khi mở popup. Quy tắc Button áp dụng theo <strong>mục 4.1</strong>; xử lý Hủy áp dụng theo <strong>mục 4.7</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>6</strong></td>
<td style="text-align: left;">Xóa</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Xác nhận yêu cầu xóa Luật hiển thị hành động. Trước khi thực hiện, hệ thống kiểm tra lại <strong>quyền người dùng, sự tồn tại của Luật hiển thị hành động và các ràng buộc nghiệp vụ</strong>. Trong thời gian xử lý không cho phép gửi lặp yêu cầu. Quy tắc kiểm tra, Processing và xử lý kết quả áp dụng theo <strong>mục 4.7</strong> và <strong>4.6 – Thông báo chung và trạng thái xử lý</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>7</strong></td>
<td style="text-align: left;">Điều kiện xóa Luật hiển thị hành động</td>
<td style="text-align: left;">Business Validation</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo dữ liệu hiện tại</td>
<td><ul>
<li><p><mark>Không được xóa khi Luật hành động đang được gán với ít nhất 1 hồ sơ Đang chạy hoặc Quá hạn</mark></p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>8</strong></td>
<td style="text-align: left;">Thông báo kết quả</td>
<td style="text-align: left;">Toast / Message</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả xử lý</td>
<td><ul>
<li><p>Nếu xóa thành công, hiển thị thông báo <strong>“Xóa Luật hiển thị hành động thành công”</strong> và cập nhật lại Danh sách Luật hiển thị hành động. Nếu không đáp ứng điều kiện xóa hoặc xử lý thất bại, không thay đổi dữ liệu và hiển thị thông báo phù hợp. Cơ chế thông báo và trạng thái xử lý áp dụng theo <strong>mục 4.6</strong>; xử lý danh sách sau xóa áp dụng theo <strong>mục 4.7</strong>.</p></li>
</ul></td>
</tr>
</tbody>
</table>

##### 3.1.2.5.4. Luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 7%" />
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Bước</strong></td>
<td style="text-align: center;"><strong>Mô tả</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>1</strong></td>
<td style="text-align: center;"><ul>
<li><p>Tại màn hình <strong>Danh sách</strong> Luật hiển thị hành động, người dùng chọn biểu tượng <strong>Xóa</strong> tại Nhiệm vụ cần xóa. Hệ thống xác định đúng Nhiệm vụ theo dòng được chọn và hiển thị popup xác nhận có <strong>Mã Luật hiển thị hành động, Tên Luật hiển thị hành động</strong> để người dùng đối chiếu trước khi thực hiện.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>2</strong></td>
<td style="text-align: center;"><ul>
<li><p>Người dùng lựa chọn thao tác trên popup. Nếu chọn <strong>Hủy bỏ</strong>, hệ thống đóng popup, giữ nguyên Nhiệm vụ và danh sách hiện tại. Nếu chọn <strong>Xóa</strong>, hệ thống tiếp nhận yêu cầu và kiểm tra lại quyền người dùng, sự tồn tại của hồ sơ và các điều kiện cho phép xóa theo <strong>mục 4.7 – Xóa bản ghi dùng chung</strong>.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 3.1.2.6. Đối soát luật hành động với BPMN

##### 3.1.2.5.1 Thông tin chung chức năng

> ● Mã chức năng:
>
> ● Mục đích: Cho phép người dùng quản trị quy trình đối chiếu các nhánh kết quả (kỳ vọng) trên sơ đồ BPMN của một quy trình với các luật hiển thị hành động đã cấu hình, nhằm phát hiện các bước/nhánh chưa có luật tương ứng (thiếu luật) để bổ sung cấu hình kịp thời.
>
> ● Người dùng mục tiêu: Quản trị hệ thống và Người dùng quản trị quy trình được cấp quyền chức năng Ma trận hành động.
>
> ● Đường dẫn truy cập: Quản trị quy trình → Ma trận hành động → Đối soát BPMN.
>
> ● Tiền điều kiện:
>
> ○ Người dùng đã truy cập chức năng Ma trận hành động
>
> ○ Có quyền thực hiện đối soát
>
> ○ Quy trình được chọn đã có dữ liệu BPMN hợp lệ trên hệ thống.
>
> ● Hậu điều kiện:
>
> ○ Kết quả đối soát giữa các bước/nhánh BPMN và luật hiển thị hành động đã cấu hình được hiển thị.
>
> ○ Chức năng đối soát mặc định phục vụ tra cứu; việc đồng bộ/đối soát lại từ BPMN cập nhật kết quả hiển thị và tự tạo mới luật hiển thị hành động.
>
> ● Requirements Traceability Matrix – RTM:

##### 3.1.2.5.2 Màn hình

<img src="media/image18.png" style="width:7.59494in;height:3.48811in" />

##### 3.1.2.5.3 Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 4%" />
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 7%" />
<col style="width: 10%" />
<col style="width: 48%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/ Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Đối soát luật hành động với BPMN</td>
<td>Label</td>
<td>Output</td>
<td>Đối soát luật hành động với BPMN</td>
<td><ul>
<li><p>Hiển thị tên chức năng tại đầu vùng nội dung.</p></li>
</ul></td>
</tr>
<tr>
<td>2</td>
<td>Chọn quy trình</td>
<td>Dropdown/Combobox</td>
<td>Input</td>
<td>Theo quy trình gần nhất được chọn. Ví dụ: RD02.02</td>
<td><ul>
<li><p>Cho phép chọn quy trình cần đối soát; danh sách lấy từ chức năng Quản lý quy trình (mục 1.1.1.1). Lấy giá trị bao gồm mã quy trình - tên quy trình theo thời gian tạo từ cũ -&gt; mới.</p></li>
<li><p>Mặc định: Giá trị quy trình đứng đầu danh sách quy trình.</p></li>
<li><p>Khi thay đổi lựa chọn, danh sách kết quả đối soát được tải lại theo quy trình mới chọn.</p></li>
</ul></td>
</tr>
<tr>
<td>3</td>
<td>Tìm kiếm</td>
<td>Search box [tối đa 255 ký tự]</td>
<td>Input</td>
<td>Rỗng. Placeholder: Tìm kiếm theo mã luật hành động...</td>
<td><ul>
<li><p>Cho phép lọc kết quả đối soát theo mã luật hành động. Quy tắc áp dụng theo mục 4.1 và mục 4.3.</p></li>
</ul></td>
</tr>
<tr>
<td>4</td>
<td>Đồng bộ/Đối soát luật từ BPMN</td>
<td>Button</td>
<td>Input</td>
<td>–</td>
<td><ul>
<li><p>Đây là button cho phép người dùng có quyền khởi tạo các luạt hiển thị hành động tương quan giữa sơ đồ BPMN mới nhất của quy trình đã chọn với danh mục luật hiển thị hành động hiện có.</p></li>
<li><p>Tham khảo thêm mô tả phần <strong>Quy tắc Đồng bộ/Đối soát luật từ BPMN.</strong></p></li>
<li><p>Luồng xử lý đồng bộ/đối soát được mô tả tại mục Luồng nghiệp vụ bên dưới.</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td>STT</td>
<td>String [tối đa 20 ký tự]</td>
<td>Output</td>
<td>Theo vị trí bản ghi</td>
<td><ul>
<li><p>Hiển thị số thứ tự của dòng kết quả đối soát.</p></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Bước BPMN</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị tên bước (task/gateway) trên sơ đồ BPMN của quy trình, ví dụ Thẩm định chuyên môn và hoàn chỉnh HSXD dự thảo 2.</p></li>
</ul></td>
</tr>
<tr>
<td>7</td>
<td>Nhánh kết quả</td>
<td>String [tối đa 100 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị Element document của User Task hoặc Sequence Flow của Camunda phải khớp với phần Outcome BPMN và khớp về cả quy trình, step của quy trình.</p></li>
</ul></td>
</tr>
<tr>
<td>8</td>
<td>Hành động kỳ vọng</td>
<td>String [tối đa 255 ký tự]</td>
<td>Output</td>
<td>–</td>
<td><ul>
<li><p>Hiển thị tên diễn giải của hành động kỳ vọng tương ứng với nhánh kết quả</p></li>
<li><p>Lấy từ Tên hành động tương ứng trong Danh mục hành động</p></li>
</ul></td>
</tr>
<tr>
<td>9</td>
<td>Luật khớp</td>
<td>String [tối đa 50 ký tự]</td>
<td>Output</td>
<td>-</td>
<td><ul>
<li><p>Hiển thị Mã luật hành động đã cấu hình khớp với bước BPMN và hành động kỳ vọng tương ứng, ví dụ LHD2026-01.</p></li>
<li><p>Hiển thị “-” khi chưa có luật nào khớp với bước/nhánh tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td>10</td>
<td>Trạng thái</td>
<td>Badge – Enum</td>
<td>Output</td>
<td>Theo kết quả đối soát</td>
<td><ul>
<li><p>Hiển thị kết quả đối soát của từng dòng, theo giao diện hiện tại gồm: Đã khớp (có luật hiển thị hành động tương ứng), Thiếu luật (chưa có luật hiển thị hành động tương ứng).</p></li>
<li><p>[Cần xác nhận với stakeholder]: có phát sinh thêm trạng thái khác (ví dụ Thừa luật – luật tồn tại nhưng không còn khớp với BPMN hiện tại) hay không.</p></li>
</ul></td>
</tr>
<tr>
<td>11</td>
<td>Phân trang</td>
<td>Paging</td>
<td>Input/Output</td>
<td>Theo cấu hình phân trang dùng chung</td>
<td><ul>
<li><p>Thực hiện phân trang kết quả đối soát theo mục 4.4 – Phân trang dùng chung.</p></li>
</ul></td>
</tr>
</tbody>
</table>

##### 3.1.2.5.3 Quy tắc Đồng bộ luật hành động với BPMN

4.  THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG

## Trường điều khiển dùng chung

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;"><strong>Loại trường</strong></td>
<td style="text-align: left;"><strong>Đặc điểm</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Free text / Textbox – một dòng</strong></td>
<td style="text-align: left;"><ul>
<li><p>Cho phép nhập nội dung trên một dòng, không cho phép xuống dòng.</p></li>
<li><p>Độ dài tối đa thực hiện theo mô tả của trường tại chức năng sử dụng; trường hợp không có quy định riêng, áp dụng tối đa <strong>255 ký tự</strong>.</p></li>
<li><p>Khi đạt giới hạn ký tự, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Trường bắt buộc phải được đánh dấu *; nếu không nhập giá trị hợp lệ, hệ thống hiển thị lỗi tại trường tương ứng.</p></li>
<li><p>Nội dung chỉ gồm khoảng trắng được xem là không có dữ liệu.</p></li>
<li><p>Mặc định là trường không bắt buộc nếu chức năng không quy định khác.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Textbox – Read-only/Disabled</strong></td>
<td style="text-align: left;"><ul>
<li><p>Dùng để hiển thị giá trị không cho phép người dùng chỉnh sửa.</p></li>
<li><p>Không cho phép nhập mới, xóa, dán hoặc thay đổi giá trị trực tiếp.</p></li>
<li><p>Phải có trạng thái hiển thị khác với trường có thể nhập để người dùng nhận biết.</p></li>
<li><p>Giá trị không bị thay đổi khi người dùng thực hiện lưu dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Textarea – nhiều dòng</strong></td>
<td style="text-align: left;"><ul>
<li><p>Cho phép nhập nội dung trên nhiều dòng.</p></li>
<li><p>Độ dài tối đa thực hiện theo mô tả của trường tại chức năng sử dụng.</p></li>
<li><p>Khi đạt giới hạn ký tự, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Trường hợp bắt buộc, áp dụng quy tắc kiểm tra dữ liệu tương tự Textbox.</p></li>
<li><p>Mặc định là trường không bắt buộc nếu chức năng không quy định khác.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Search box</strong></td>
<td style="text-align: left;"><ul>
<li><p>Cho phép nhập từ khóa tìm kiếm trên một dòng.</p></li>
<li><p>Không cho phép xuống dòng.</p></li>
<li><p>Độ dài tối đa mặc định <strong>255 ký tự</strong>, trừ khi chức năng có quy định khác.</p></li>
<li><p>Giá trị được chuẩn hóa trước khi tìm kiếm theo quy tắc của kịch bản tìm kiếm dùng chung.</p></li>
<li><p>Khi giá trị rỗng, không áp dụng điều kiện tìm kiếm theo từ khóa.</p></li>
<li><p>Logic truy vấn và xử lý kết quả thực hiện theo mục <strong>Kịch bản tìm kiếm và lọc dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Dropdown / Single Select</strong></td>
<td style="text-align: left;"><ul>
<li><p>Cho phép lựa chọn duy nhất một giá trị trong danh sách.</p></li>
<li><p>Khi chưa chọn, hiển thị placeholder hoặc giá trị khởi tạo theo chức năng sử dụng.</p></li>
<li><p>Giá trị đã chọn được hiển thị trên trường sau khi danh sách đóng.</p></li>
<li><p>Không cho phép nhập giá trị ngoài danh sách, trừ trường hợp có thiết kế cho phép nhập tự do.</p></li>
<li><p>Nếu là trường bắt buộc, hệ thống không cho phép xác nhận form khi chưa có giá trị hợp lệ.</p></li>
<li><p>Danh sách dữ liệu, thứ tự hiển thị và giá trị mặc định được quy định tại chức năng sử dụng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Toggle Switch / Toggle Button</strong></td>
<td style="text-align: left;"><ul>
<li><p>Thể hiện một thuộc tính có hai trạng thái đối lập, ví dụ Bật/Tắt, Có/Không hoặc Đang hoạt động/Ngừng hoạt động.</p></li>
<li><p>Giá trị hiển thị ban đầu lấy theo trạng thái hiện tại của dữ liệu.</p></li>
<li><p>Khi người dùng thao tác, hệ thống xử lý theo kịch bản nghiệp vụ tương ứng; trường hợp yêu cầu xác nhận thì chưa cập nhật dữ liệu trước khi người dùng xác nhận.</p></li>
<li><p>Trường hợp cập nhật thất bại, hệ thống khôi phục trạng thái trước khi thao tác.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Button – hành động chính</strong></td>
<td style="text-align: left;"><ul>
<li><p>Dùng cho hành động chính như Lưu lại, Thêm mới, Xác nhận, Xóa hoặc Tra cứu.</p></li>
<li><p>Khi nhấn, hệ thống thực hiện hành động được mô tả tại chức năng hoặc kịch bản dùng chung tương ứng.</p></li>
<li><p>Trong thời gian yêu cầu đang được xử lý, không cho phép gửi lặp cùng một thao tác.</p></li>
<li><p>Trường hợp hành động phụ thuộc dữ liệu đầu vào, hệ thống phải thực hiện kiểm tra dữ liệu trước khi xử lý.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Button – hành động phụ</strong></td>
<td style="text-align: left;"><ul>
<li><p>Dùng cho các thao tác như Hủy bỏ, Không, Đặt lại hoặc Đóng.</p></li>
<li><p>Không làm thay đổi dữ liệu nghiệp vụ nếu người dùng chưa xác nhận thao tác thay đổi dữ liệu.</p></li>
<li><p>Hành vi cụ thể như đóng popup, đặt lại form hoặc quay lại màn hình trước được mô tả tại chức năng sử dụng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Icon Button</strong></td>
<td style="text-align: left;"><ul>
<li><p>Dùng cho các thao tác được biểu diễn bằng biểu tượng, ví dụ Chỉnh sửa, Xóa, Xem chi tiết, Lịch sử.</p></li>
<li><p>Mỗi icon đại diện cho một thao tác xác định.</p></li>
<li><p>Khi di chuột vào icon, hiển thị tooltip tên thao tác.</p></li>
<li><p>Thao tác phải được thực hiện trên đúng đối tượng/bản ghi mà người dùng lựa chọn.</p></li>
<li><p>Khả năng hiển thị hoặc thao tác phụ thuộc phân quyền và điều kiện nghiệp vụ tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Label</strong></td>
<td style="text-align: left;"><ul>
<li><p>Dùng để hiển thị tiêu đề, tên trường hoặc dữ liệu chỉ đọc.</p></li>
<li><p>Không cho phép người dùng chỉnh sửa trực tiếp.</p></li>
<li><p>Nội dung cố định hiển thị theo thiết kế; nội dung động hiển thị theo dữ liệu được cung cấp.</p></li>
<li><p>Quy tắc xử lý nội dung dài áp dụng theo thiết kế hiển thị dùng chung hoặc quy định riêng của thành phần.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Tooltip</strong></td>
<td style="text-align: left;"><ul>
<li><p>Dùng để bổ sung thông tin cho control, icon hoặc nội dung bị rút gọn.</p></li>
<li><p>Hiển thị khi người dùng di chuột vào thành phần được hỗ trợ.</p></li>
<li><p>Với nội dung bị cắt, tooltip hiển thị đầy đủ giá trị gốc.</p></li>
<li><p>Tooltip được ẩn khi người dùng rời khỏi vùng kích hoạt.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Trường bắt buộc</strong></td>
<td style="text-align: left;"><ul>
<li><p>Được nhận biết bằng dấu * cạnh tên trường.</p></li>
<li><p>Không chấp nhận Null, rỗng hoặc nội dung chỉ gồm khoảng trắng.</p></li>
<li><p>Khi dữ liệu không hợp lệ, hệ thống hiển thị lỗi tại trường và không thực hiện hành động xác nhận/lưu dữ liệu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

## Bảng danh sách dùng chung

### Thông tin chung chức năng

- **Tên chức năng:** Bảng danh sách dùng chung.

- **Mục đích:** Quy định thống nhất cách tổ chức, hiển thị và xử lý dữ liệu dạng bảng trên các màn hình danh sách.

- **Phạm vi áp dụng:** Các chức năng sử dụng bảng để hiển thị tập bản ghi.

- **Tiền điều kiện:**

  - Người dùng đã truy cập thành công chức năng có sử dụng bảng danh sách.

  - Người dùng có quyền xem dữ liệu tương ứng.

- **Hậu điều kiện:**

  - Bảng hiển thị dữ liệu theo kết quả truy vấn và điều kiện hiện tại.

  - Các trạng thái có dữ liệu, không có dữ liệu, đang tải hoặc lỗi được hiển thị tương ứng.

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 13%" />
<col style="width: 18%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 40%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Bảng danh sách</td>
<td style="text-align: left;">Data Grid</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Không có dữ liệu</td>
<td><ul>
<li><p>Hiển thị tập bản ghi của chức năng dưới dạng bảng.</p></li>
<li><p>Mỗi bản ghi tương ứng một dòng.</p></li>
<li><p>Tên, số lượng, thứ tự và dữ liệu của các cột được quy định tại chức năng sử dụng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Tiêu đề cột</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo cấu hình chức năng</td>
<td><ul>
<li><p>Hiển thị tên trường hoặc nội dung đại diện cho dữ liệu của cột.</p></li>
<li><p>Tiêu đề hiển thị tối đa 2 dòng; nếu vượt quá vùng hiển thị thì cắt bằng ... và hiển thị đầy đủ bằng tooltip.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Dòng dữ liệu</td>
<td style="text-align: left;">Table Row</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả truy vấn</td>
<td><ul>
<li><p>Mỗi dòng chỉ thể hiện một bản ghi.</p></li>
<li><p>Dữ liệu của các cột trên cùng một dòng phải thuộc cùng bản ghi.</p></li>
<li><p>Chiều cao dòng được giữ thống nhất theo số dòng nội dung được phép hiển thị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">STT</td>
<td style="text-align: left;">Number – Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo vị trí bản ghi</td>
<td><ul>
<li><p>Hiển thị số thứ tự của bản ghi trong toàn bộ kết quả.</p></li>
<li><p>Trường hợp có phân trang, cách tính STT áp dụng theo <strong>mục 4.4 – Phân trang dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Nội dung dạng mã/giá trị ngắn</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Mặc định hiển thị tối đa 1 dòng.</p></li>
<li><p>Nếu vượt quá chiều rộng cột, hệ thống cắt bằng ... và hiển thị đầy đủ nội dung bằng tooltip.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td style="text-align: left;">Nội dung dạng văn bản</td>
<td style="text-align: left;">Label – Unicode String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Mặc định hiển thị tối đa 2 dòng.</p></li>
<li><p>Nếu nội dung vượt quá 2 dòng, hệ thống cắt nội dung tại dòng thứ hai bằng ...; khi di chuột hiển thị đầy đủ bằng tooltip.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: left;">Giá trị rỗng</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">-</td>
<td><ul>
<li><p>Khi dữ liệu của trường là null, rỗng hoặc không có giá trị để hiển thị, hệ thống hiển thị dấu -, trừ trường hợp chức năng có quy định khác.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td style="text-align: left;">Trạng thái</td>
<td style="text-align: left;">Badge/Toggle/Label</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo dữ liệu</td>
<td><ul>
<li><p>Hiển thị trạng thái của bản ghi theo thiết kế chức năng.</p></li>
<li><p>Nếu trạng thái có thể thay đổi trực tiếp bằng Toggle, việc xử lý áp dụng theo <strong>mục Bật/Tắt trạng thái dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td style="text-align: left;">Cột thao tác</td>
<td style="text-align: left;">Icon Group</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo quyền và chức năng</td>
<td><ul>
<li><p>Chứa các thao tác được phép thực hiện trên từng bản ghi như Xem, Chỉnh sửa, Xóa hoặc các thao tác khác.</p></li>
<li><p>Các icon áp dụng quy tắc tại <strong>mục 4.1 – Trường điều khiển dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">10</td>
<td style="text-align: left;">Trạng thái đang tải</td>
<td style="text-align: left;">Loading</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Ẩn</td>
<td><ul>
<li><p>Hiển thị trong vùng danh sách khi hệ thống đang truy vấn hoặc tải lại dữ liệu.</p></li>
<li><p>Trong thời gian tải, không cho phép thao tác trên dữ liệu chưa hoàn tất cập nhật.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">11</td>
<td style="text-align: left;">Chưa có dữ liệu</td>
<td style="text-align: left;">Empty State</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Ẩn</td>
<td><ul>
<li><p>Hiển thị nội dung <strong>“Chưa có dữ liệu”</strong> khi tập dữ liệu của chức năng chưa có bản ghi để hiển thị. Phần tiêu đề bảng vẫn được giữ lại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">12</td>
<td style="text-align: left;">Không có kết quả phù hợp</td>
<td style="text-align: left;">Empty State</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Ẩn</td>
<td><ul>
<li><p>Hiển thị khi hệ thống có dữ liệu nhưng không có bản ghi đáp ứng điều kiện tìm kiếm/lọc hiện tại.</p></li>
<li><p>Nội dung thông báo áp dụng theo quy định chung của hệ thống.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">13</td>
<td style="text-align: left;">Lỗi tải dữ liệu</td>
<td style="text-align: left;">Error State</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Ẩn</td>
<td><ul>
<li><p>Hiển thị thông báo lỗi khi hệ thống không thể truy xuất dữ liệu.</p></li>
<li><p>Giữ nguyên điều kiện tìm kiếm, lọc và phân trang hiện tại để người dùng có thể thực hiện lại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">14</td>
<td style="text-align: left;">Thanh cuộn</td>
<td style="text-align: left;">Scrollbar</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Ẩn</td>
<td><ul>
<li><p>Hiển thị khi nội dung bảng vượt quá vùng hiển thị.</p></li>
<li><p>Thanh cuộn ngang được sử dụng khi tổng chiều rộng các cột vượt vùng chứa; không tự co các cột đến mức làm mất khả năng đọc dữ liệu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### Quy tắc hiển thị bảng

#### Quy tắc hiển thị dữ liệu

- Mỗi bản ghi được hiển thị trên một dòng.

- Thứ tự các cột thực hiện theo thiết kế của từng chức năng.

- Nội dung dạng mã hoặc giá trị ngắn mặc định hiển thị tối đa **01 dòng**.

- Nội dung văn bản thông thường mặc định hiển thị tối đa **02 dòng**.

- Nếu nội dung vượt quá số dòng hoặc vùng hiển thị:

  - Cắt phần vượt quá bằng ...;

  - Khi di chuột vào nội dung, hiển thị đầy đủ giá trị bằng tooltip.

- Không tự động tăng chiều cao dòng vượt quá giới hạn hiển thị đã quy định.

- Nếu một trường cần số dòng khác quy tắc chung, chức năng sử dụng phải mô tả riêng.

- Dữ liệu rỗng hoặc null hiển thị -, trừ khi có quy định nghiệp vụ khác.

#### Quy tắc căn chỉnh

|                  |                        |
|------------------|------------------------|
| **Loại dữ liệu** | **Căn chỉnh mặc định** |
| STT              | Căn giữa               |
| Văn bản, mã, tên | Căn trái               |
| Số               | Căn phải               |
| Trạng thái       | Căn giữa               |
| Cột thao tác     | Căn giữa               |

#### Quy tắc cột thao tác

- Các thao tác phải áp dụng đúng trên bản ghi của dòng được chọn.

- Chỉ hiển thị hoặc cho phép thao tác theo quyền của người dùng.

- Các icon trong cùng một cột phải được sắp xếp theo thứ tự thống nhất.

- Hover vào icon phải hiển thị tên thao tác bằng tooltip.

- Trong thời gian một thao tác đang được xử lý, không cho phép gửi lặp lại cùng thao tác trên bản ghi.

- Luồng xử lý nghiệp vụ của từng thao tác không mô tả tại bảng danh sách mà tham chiếu đến chức năng hoặc kịch bản dùng chung tương ứng.

#### Quy tắc trạng thái dữ liệu

|  |  |
|----|----|
| **Trường hợp** | **Cách xử lý** |
| Đang truy vấn dữ liệu | Hiển thị Loading tại vùng danh sách. |
| Có dữ liệu | Hiển thị các bản ghi theo cấu trúc bảng. |
| Không có bản ghi | Hiển thị **“Chưa có dữ liệu”**. |
| Không có kết quả sau tìm kiếm/lọc | Hiển thị trạng thái không có kết quả phù hợp. |
| Một trường không có giá trị | Hiển thị -. |
| Không truy xuất được dữ liệu | Hiển thị thông báo lỗi tương ứng. |

## Kịch bản tìm kiếm và lọc dùng chung

### Thông tin chung chức năng

- **Tên chức năng:** Kịch bản tìm kiếm và lọc dùng chung.

- **Mục đích:** Cho phép người dùng thu hẹp phạm vi dữ liệu hiển thị dựa trên từ khóa tìm kiếm và một hoặc nhiều điều kiện lọc.

- **Phạm vi áp dụng:** Các màn hình danh sách, popup hoặc vùng dữ liệu có chức năng tìm kiếm/lọc.

- **Tiền điều kiện:**

  - Người dùng đã truy cập thành công chức năng có dữ liệu cần tra cứu.

  - Người dùng có quyền xem dữ liệu tương ứng.

- **Hậu điều kiện:**

  - Dữ liệu được hiển thị theo các điều kiện tìm kiếm/lọc đã áp dụng.

  - Thông tin phân trang được cập nhật theo tập kết quả mới nếu danh sách có sử dụng phân trang.

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 13%" />
<col style="width: 18%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 40%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Từ khóa tìm kiếm</td>
<td style="text-align: left;">Search box – Unicode String [tối đa 255 ký tự]</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Rỗng</td>
<td><ul>
<li><p>Cho phép nhập từ khóa để tìm kiếm trên các trường được quy định tại chức năng sử dụng.</p></li>
<li><p>Áp dụng quy tắc Search box tại <strong>mục 4.1 – Trường điều khiển dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Bộ lọc</td>
<td style="text-align: left;">Dropdown/Control tương ứng</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo chức năng</td>
<td><ul>
<li><p>Cho phép thu hẹp dữ liệu theo một hoặc nhiều tiêu chí như trạng thái, loại, nhóm hoặc các thuộc tính nghiệp vụ khác.</p></li>
<li><p>Tập giá trị và cách đối sánh được quy định tại từng chức năng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Đặt lại</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Nếu màn hình có sử dụng, cho phép đưa toàn bộ điều kiện tìm kiếm/lọc về giá trị khởi tạo và tải lại danh sách theo điều kiện mặc định.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Tra cứu</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Nếu màn hình có sử dụng, cho phép thực hiện tìm kiếm/lọc theo các giá trị hiện tại.</p></li>
<li><p>Người dùng cũng có thể kích hoạt tìm kiếm bằng phím <strong>Enter</strong> tại trường tìm kiếm nếu chức năng hỗ trợ.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### Quy tắc tìm kiếm và lọc

#### Quy tắc từ khóa tìm kiếm

- Từ khóa mặc định để trống khi khởi tạo màn hình.

- Cho phép nhập tối đa **255 ký tự**, trừ khi chức năng có quy định khác.

- Hệ thống loại bỏ khoảng trắng ở đầu và cuối trước khi thực hiện tìm kiếm.

- Tìm kiếm theo phương thức **tương đối** trên các trường được quy định tại chức năng sử dụng.

- Việc tìm kiếm có phân biệt chữ hoa/chữ thường, dấu tiếng Việt hoặc các quy tắc chuẩn hóa khác thực hiện theo đặc tả nghiệp vụ của hệ thống/chức năng; không tự suy rộng nếu chưa có yêu cầu cụ thể.

- Nếu từ khóa rỗng sau khi chuẩn hóa, hệ thống không áp dụng điều kiện tìm kiếm theo từ khóa.

- Trường hợp từ khóa được áp dụng trên nhiều trường, bản ghi được xác định phù hợp khi thỏa mãn ít nhất một trường tìm kiếm, trừ khi chức năng có quy định khác.

- Không sử dụng từ khóa để tìm kiếm trên các trường không được mô tả tại chức năng sử dụng.

#### Quy tắc lọc

- Mỗi bộ lọc chỉ áp dụng trên thuộc tính nghiệp vụ được xác định tại chức năng sử dụng.

- Giá trị khởi tạo của bộ lọc được quy định tại từng chức năng.

- Dropdown một lựa chọn chỉ cho phép chọn một giá trị tại một thời điểm.

- Trường hợp có giá trị **Tất cả**, khi lựa chọn giá trị này hệ thống không áp dụng điều kiện lọc tương ứng.

- Nếu có nhiều bộ lọc, các điều kiện lọc được kết hợp đồng thời để thu hẹp tập kết quả.

- Từ khóa tìm kiếm và bộ lọc được áp dụng đồng thời trên cùng một lần truy vấn.

- Khi thay đổi điều kiện tìm kiếm/lọc và thực hiện tra cứu, danh sách được đưa về **trang đầu tiên**; số bản ghi/trang được giữ nguyên nếu không có quy định khác.

#### Kích hoạt tìm kiếm

Việc kích hoạt tìm kiếm có thể thực hiện theo thiết kế của màn hình:

- Nhấn nút **Tra cứu**;

- Nhấn phím **Enter** tại vùng tìm kiếm;

- Hoặc cơ chế kích hoạt khác được mô tả cụ thể tại chức năng sử dụng.

Sau khi kích hoạt, hệ thống sử dụng toàn bộ giá trị tìm kiếm/lọc tại thời điểm đó để tải lại dữ liệu.

#### Đặt lại điều kiện

Khi người dùng thực hiện **Đặt lại**:

1.  Xóa từ khóa tìm kiếm.

2.  Đưa các bộ lọc về giá trị khởi tạo.

3.  Đưa danh sách về trang đầu tiên.

4.  Tải lại dữ liệu theo điều kiện mặc định.

Nếu màn hình không có nút Đặt lại, việc xóa từng điều kiện được xử lý theo control tương ứng.

#### Quy tắc hiển thị kết quả

|  |  |
|----|----|
| **Trường hợp** | **Xử lý** |
| Có bản ghi phù hợp | Hiển thị các bản ghi đáp ứng đồng thời điều kiện tìm kiếm và lọc. |
| Không nhập từ khóa và không áp dụng bộ lọc | Hiển thị toàn bộ dữ liệu người dùng được phép xem theo điều kiện mặc định của chức năng. |
| Không có bản ghi phù hợp | Hiển thị trạng thái không có dữ liệu/kết quả theo quy tắc **Bảng danh sách dùng chung**. |
| Đang truy vấn | Hiển thị Loading theo **mục 4.2 – Bảng danh sách dùng chung**. |
| Truy vấn thất bại | Hiển thị thông báo lỗi và giữ nguyên các điều kiện tìm kiếm/lọc đã nhập. |
| Có phân trang | Tính lại tổng số bản ghi, tổng số trang và hiển thị trang đầu tiên của kết quả mới. |

## Phân trang dùng chung

### Thông tin chung chức năng

- **Tên chức năng:** Phân trang dùng chung.

- **Mục đích:** Cho phép chia tập dữ liệu thành nhiều trang, hỗ trợ người dùng lựa chọn số lượng bản ghi hiển thị và điều hướng giữa các trang.

- **Phạm vi áp dụng:** Các bảng/danh sách có sử dụng phân trang.

- **Giá trị khởi tạo mặc định:**

  - Trang hiện tại: **1**.

  - Số bản ghi/trang: **10**.

- **Hậu điều kiện:** Danh sách hiển thị đúng dữ liệu của trang được lựa chọn và các thông tin phân trang được cập nhật tương ứng.

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 13%" />
<col style="width: 18%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 40%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Tổng số bản ghi</td>
<td style="text-align: left;">Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">0</td>
<td><ul>
<li><p>Hiển thị tổng số bản ghi đáp ứng điều kiện truy vấn hiện tại.</p></li>
<li><p>Giá trị được cập nhật sau mỗi lần tải lại danh sách, tìm kiếm hoặc lọc dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Số bản ghi/trang</td>
<td style="text-align: left;">Dropdown – Integer</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">10</td>
<td><ul>
<li><p>Cho phép lựa chọn số lượng bản ghi hiển thị trên một trang gồm: <strong>5, 10, 20, 50, 100</strong>.</p></li>
<li><p>Khi thay đổi giá trị, hệ thống tải lại dữ liệu và đưa danh sách về trang 1.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Trang hiện tại</td>
<td style="text-align: left;">Paging Number</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">1</td>
<td><ul>
<li><p>Thể hiện trang đang được hiển thị.</p></li>
<li><p>Trang hiện tại phải có trạng thái hiển thị khác các trang còn lại để người dùng nhận biết.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Trang đầu</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang đầu</td>
<td><ul>
<li><p>Chuyển trực tiếp đến trang đầu tiên.</p></li>
<li><p>Không cho phép thao tác khi đang ở trang 1.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Trang trước</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang đầu</td>
<td><ul>
<li><p>Chuyển đến trang liền trước trang hiện tại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td style="text-align: left;">Danh sách số trang</td>
<td style="text-align: left;">Paging Number</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo kết quả truy vấn</td>
<td><ul>
<li><p>Hiển thị các số trang để người dùng chuyển trực tiếp đến trang mong muốn.</p></li>
<li><p>Hiển thị tối đa <strong>5 số trang</strong> tại một thời điểm.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: left;">Trang sau</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang cuối</td>
<td><ul>
<li><p>Chuyển đến trang liền sau trang hiện tại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td style="text-align: left;">Trang cuối</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang cuối</td>
<td><ul>
<li><p>Chuyển trực tiếp đến trang cuối cùng.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### Công thức tính

Quy ước:

- TotalRecord: Tổng số bản ghi.

- PageSize: Số bản ghi trên một trang.

- CurrentPage: Trang hiện tại.

- Position: Vị trí bản ghi trong trang, bắt đầu từ 1.

**Tổng số trang**

TotalPage = CEILING(TotalRecord / PageSize)

**Số thứ tự bản ghi**

STT = (CurrentPage - 1) × PageSize + Position

**Bản ghi bắt đầu**

StartRecord = (CurrentPage - 1) × PageSize + 1

**Bản ghi kết thúc**

EndRecord = MIN(CurrentPage × PageSize, TotalRecord)

Trường hợp TotalRecord = 0:

- Không có bản ghi để hiển thị.

- Trang hiện tại được xác định là trang 1.

- Không hiển thị các số trang có thể lựa chọn.

- Các nút điều hướng ở trạng thái không cho phép thao tác.

### Quy tắc hiển thị

#### Hiển thị số trang

- Hiển thị tối đa **5 số trang** tại một thời điểm.

- Nếu tổng số trang ≤ 5, hiển thị toàn bộ số trang.

- Nếu tổng số trang \> 5:

  - Hiển thị trang hiện tại và các trang lân cận phù hợp.

  - Sử dụng ... để thể hiện khoảng trang bị ẩn khi cần.

  - Luôn đảm bảo người dùng có thể truy cập trang đầu, trang cuối thông qua các nút điều hướng.

- Trang hiện tại được làm nổi bật và không thực hiện tải lại dữ liệu nếu người dùng chọn lại chính trang đó.

#### Trạng thái nút điều hướng

|  |  |  |  |  |
|----|----|----|----|----|
| **Trạng thái** | **Trang đầu** | **Trang trước** | **Trang sau** | **Trang cuối** |
| Không có dữ liệu | Disable | Disable | Disable | Disable |
| Trang đầu tiên | Disable | Disable | Enable nếu có nhiều hơn 1 trang | Enable nếu có nhiều hơn 1 trang |
| Trang giữa | Enable | Enable | Enable | Enable |
| Trang cuối cùng | Enable nếu có nhiều hơn 1 trang | Enable nếu có nhiều hơn 1 trang | Disable | Disable |

#### Giữ điều kiện hiện tại

Khi người dùng chuyển trang:

- Giữ nguyên từ khóa tìm kiếm.

- Giữ nguyên các điều kiện lọc.

- Giữ nguyên số bản ghi/trang.

- Chỉ thay đổi trang cần truy vấn.

## Kiểm tra dữ liệu và thông báo lỗi dùng chung

### Thông tin chung

- **Tên chức năng:** Kiểm tra dữ liệu và thông báo lỗi dùng chung.

- **Mục đích:** Đảm bảo dữ liệu đầu vào đáp ứng các ràng buộc trước khi hệ thống thực hiện thao tác lưu hoặc xử lý nghiệp vụ.

- **Phạm vi áp dụng:** Các trường nhập liệu, form Thêm mới/Chỉnh sửa và các chức năng có yêu cầu kiểm tra dữ liệu đầu vào.

- **Nguyên tắc:**

  - Kiểm tra dữ liệu trước khi thực hiện xử lý nghiệp vụ.

  - Lỗi phải chỉ rõ trường và nguyên nhân để người dùng có thể điều chỉnh.

  - Không xóa dữ liệu người dùng đã nhập khi validation không đạt.

  - Không thực hiện lưu nếu còn lỗi validation.

### Nguyên tắc kiểm tra dữ liệu

- Hệ thống kiểm tra các ràng buộc có thể xác định tại phía giao diện trước khi gửi yêu cầu xử lý, ví dụ:

  - Trường bắt buộc;

  - Độ dài;

  - Định dạng;

  - Miền giá trị của trường.

- Khi dữ liệu phía giao diện hợp lệ, hệ thống gửi dữ liệu để tiếp tục kiểm tra các điều kiện cần xác nhận tại phía xử lý, ví dụ:

  - Tính duy nhất;

  - Sự tồn tại của dữ liệu liên quan;

  - Trạng thái bản ghi;

  - Các quy tắc nghiệp vụ khác.

- Nếu một form có nhiều trường không hợp lệ:

  - Hệ thống hiển thị lỗi tại tất cả các trường xác định được lỗi;

  - Không yêu cầu người dùng sửa từng lỗi và gửi lại nhiều lần mới biết lỗi tiếp theo.

- Quy chuẩn chung cũng xác định trường hợp phía xử lý trả về nhiều lỗi thì giao diện phải hiển thị các Inline Message tương ứng tại từng control.

- Nếu dữ liệu không hợp lệ:

  - Không thực hiện lưu;

  - Giữ nguyên form;

  - Giữ nguyên dữ liệu người dùng đã nhập;

  - Hiển thị lỗi tại trường tương ứng.

- Sau khi người dùng chỉnh sửa và giá trị của trường đã hợp lệ, thông báo lỗi của trường đó được loại bỏ. Đây cũng là hành vi được quy định trong phần **Thông báo chung** của tài liệu mẫu.

- Việc kiểm tra phải được thực hiện lại tại thời điểm người dùng xác nhận lưu, kể cả khi trường đã từng được kiểm tra trước đó.

### Quy tắc hiển thị lỗi tại trường

|  |  |
|----|----|
| **Nội dung** | **Quy tắc** |
| Vị trí | Hiển thị ngay dưới trường phát sinh lỗi. |
| Hình thức | Hiển thị Inline Message; nội dung lỗi có màu cảnh báo/lỗi theo thiết kế giao diện. |
| Trường lỗi | Có trạng thái hiển thị khác với trường hợp hợp lệ để người dùng nhận biết. |
| Thời điểm hiển thị | Khi hệ thống xác định dữ liệu của trường không hợp lệ. |
| Thời điểm ẩn | Khi giá trị được điều chỉnh và đáp ứng điều kiện hợp lệ. |
| Nhiều lỗi trên form | Hiển thị đồng thời lỗi tại các trường tương ứng. |
| Dữ liệu đã nhập | Không bị xóa khi lỗi được hiển thị. |

### Các trường hợp kiểm tra dùng chung

|  |  |  |  |
|----|----|----|----|
| **STT** | **Trường hợp** | **Điều kiện** | **Nội dung thông báo dùng chung** |
| 1 | Chưa nhập trường bắt buộc | Giá trị null, rỗng hoặc chỉ gồm khoảng trắng | **“Vui lòng nhập {Tên trường}.”** |
| 2 | Chưa chọn trường bắt buộc | Trường lựa chọn chưa có giá trị hợp lệ | **“Vui lòng chọn {Tên trường}.”** |
| 3 | Vượt quá độ dài tối đa | Số ký tự vượt giới hạn của trường | **“{Tên trường} không được vượt quá {N} ký tự.”** |
| 4 | Sai định dạng | Giá trị không đáp ứng định dạng được quy định | **“{Tên trường} không hợp lệ.”** hoặc thông báo định dạng cụ thể tại chức năng sử dụng. |
| 5 | Trùng dữ liệu | Giá trị thuộc trường yêu cầu duy nhất đã tồn tại | **“{Tên trường} đã tồn tại.”** |
| 6 | Giá trị không còn hợp lệ | Giá trị tham chiếu đã bị xóa, ngừng sử dụng hoặc không còn đáp ứng điều kiện lựa chọn | Hiển thị thông báo cụ thể theo đối tượng và không thực hiện lưu. |

### Thông báo sai định dạng

Đối với trường có yêu cầu định dạng cụ thể, ưu tiên sử dụng thông báo mô tả rõ điều kiện hợp lệ thay vì chỉ sử dụng câu chung “không hợp lệ”.

Ví dụ:

- Mã vai trò thực hiện chỉ được chứa chữ cái không dấu và chữ số.

- Số điện thoại chỉ được chứa chữ số và có độ dài theo quy định.

Nội dung cụ thể phải được xác định tại trường nghiệp vụ tương ứng. Phần dùng chung chỉ quy định cách kiểm tra và cách hiển thị lỗi, không tự quy định cùng một định dạng cho tất cả trường.

### Kiểm tra tính duy nhất

Áp dụng đối với các trường được quy định không được phép trùng, ví dụ Mã của một đối tượng.

**Thêm mới:**

- Hệ thống kiểm tra giá trị đã tồn tại hay chưa.

- Nếu đã tồn tại, không lưu dữ liệu và hiển thị lỗi tại trường tương ứng.

**Chỉnh sửa:**

- Nếu trường duy nhất được phép thay đổi, hệ thống kiểm tra với các bản ghi khác và loại trừ chính bản ghi đang chỉnh sửa.

- Nếu giá trị trùng với bản ghi khác, không thực hiện cập nhật.

Thông báo theo mẫu:

**“{Tên trường} đã tồn tại.”**

Việc trường nào yêu cầu duy nhất phải được mô tả tại chức năng sử dụng; không mặc định tất cả trường đều phải unique.

### Xử lý lỗi trả về từ phía xử lý

|  |  |
|----|----|
| **Trường hợp** | **Cách xử lý** |
| Lỗi gắn với một trường cụ thể | Hiển thị Inline Message tại trường tương ứng. |
| Nhiều trường cùng lỗi | Hiển thị đồng thời các lỗi tại các trường tương ứng. |
| Lỗi nghiệp vụ không gắn với một trường cụ thể | Hiển thị thông báo chung theo kịch bản thông báo của hệ thống. |
| Bản ghi không còn tồn tại | Không tiếp tục lưu/cập nhật; thông báo cho người dùng và cập nhật lại dữ liệu khi cần. |
| Không còn quyền thực hiện | Không xử lý thay đổi dữ liệu; áp dụng kịch bản phân quyền dùng chung. |
| Lỗi hệ thống, mất kết nối hoặc timeout | Không coi thao tác là thành công; giữ nguyên dữ liệu trên form nếu có thể xác định yêu cầu chưa hoàn tất và hiển thị thông báo lỗi tương ứng. |

## Thông báo chung và trạng thái xử lý

### Thông tin chung

**Tên chức năng:** Thông báo chung và trạng thái xử lý.

**Mục đích:** Chuẩn hóa cách hệ thống phản hồi cho người dùng về kết quả và trạng thái của một thao tác.

**Phạm vi áp dụng:** Các chức năng có thao tác tải dữ liệu, gửi yêu cầu xử lý hoặc cần phản hồi kết quả cho người dùng.

**Nguyên tắc:**

- Thông báo phải phản ánh đúng kết quả thực tế của thao tác.

- Không hiển thị thông báo thành công khi hệ thống chưa xác nhận xử lý thành công.

- Thông báo lỗi phải đủ rõ để người dùng biết thao tác chưa hoàn tất và có thể thực hiện hành động tiếp theo.

- Lỗi tại trường nhập liệu áp dụng theo **mục 4.5 – Kiểm tra dữ liệu và thông báo lỗi dùng chung**; không sử dụng Toast thay thế cho lỗi có thể xác định tại một trường cụ thể.

### Các hình thức thông báo

|  |  |  |  |
|----|----|----|----|
| **STT** | **Loại** | **Phạm vi sử dụng** | **Quy tắc** |
| 1 | Toast thành công | Thông báo kết quả của thao tác đã hoàn tất thành công | Hiển thị sau khi hệ thống xác nhận thao tác thành công. Nội dung ngắn gọn, nêu rõ hành động hoặc đối tượng đã được xử lý. |
| 2 | Toast lỗi | Lỗi xử lý không gắn trực tiếp với một trường dữ liệu | Hiển thị khi thao tác không thành công do lỗi hệ thống, quyền truy cập, trạng thái dữ liệu hoặc lỗi nghiệp vụ chung. |
| 3 | Toast cảnh báo/thông tin | Trường hợp cần thông báo nhưng không phải lỗi làm thất bại thao tác | Nội dung phải nêu rõ trạng thái hoặc lưu ý cần thiết cho người dùng. |
| 4 | Inline Message | Lỗi tại một trường nhập liệu cụ thể | Áp dụng theo **mục 4.5 – Kiểm tra dữ liệu và thông báo lỗi dùng chung**. |
| 5 | Empty State | Không có dữ liệu để hiển thị | Hiển thị trong vùng dữ liệu tương ứng; không sử dụng Toast cho trạng thái dữ liệu rỗng thông thường. |
| 6 | Error State | Không thể tải hoặc khởi tạo một vùng chức năng | Hiển thị ngay tại vùng bị lỗi; có thể cung cấp thao tác **Thử lại** nếu nghiệp vụ cho phép. |

### Quy tắc nội dung thông báo

Thông báo nên được xây dựng theo cấu trúc thống nhất:

**{Kết quả/Hành động} + {Đối tượng} + {thông tin bổ sung nếu cần}**

**Ví dụ:**

|  |  |
|:---|:---|
| **Trường hợp** | **Mẫu nội dung** |
| Thêm mới thành công | Thêm mới {Đối tượng} thành công. |
| Cập nhật thành công | Cập nhật {Đối tượng} thành công. |
| Xóa thành công | Xóa {Đối tượng} thành công. |
| Cập nhật trạng thái thành công | Cập nhật trạng thái {Đối tượng} thành công. |
| Không có quyền | Bạn không có quyền thực hiện chức năng này. |
| Không tải được dữ liệu | Không thể tải dữ liệu. Vui lòng thử lại. |
| Không xử lý được yêu cầu | Không thể thực hiện yêu cầu. Vui lòng thử lại. |
| Bản ghi không còn tồn tại | {Đối tượng} không còn tồn tại. |
| Mất kết nối | Thông báo người dùng về trạng thái mất kết nối và cho phép thực hiện lại khi kết nối được phục hồi. |
| Timeout | Thông báo yêu cầu xử lý quá thời gian và thao tác chưa được xác nhận thành công. |

### Trạng thái xử lý dùng chung

|  |  |
|----|----|
| **Trạng thái** | **Cách hiển thị/xử lý** |
| **Chưa xử lý** | Hiển thị dữ liệu và các control ở trạng thái bình thường; cho phép người dùng thực hiện thao tác nếu đủ điều kiện. |
| **Đang tải dữ liệu** | Hiển thị Loading/Skeleton tại vùng dữ liệu đang được tải. Không hiển thị dữ liệu giả hoặc giá trị mặc định có thể khiến người dùng hiểu nhầm là dữ liệu thật. |
| **Đang xử lý thao tác** | Khóa hoặc disable control phát sinh request và các thao tác có thể tạo request trùng. Giữ nguyên dữ liệu cần thiết trên giao diện trong thời gian chờ kết quả. |
| **Xử lý thành công** | Cập nhật dữ liệu theo kết quả mới, đóng popup/form nếu nghiệp vụ yêu cầu và hiển thị thông báo thành công. |
| **Xử lý thất bại** | Không coi thao tác là thành công; hiển thị thông báo lỗi. Dữ liệu người dùng đã nhập được giữ lại nếu vẫn có thể tiếp tục thao tác. |
| **Không có dữ liệu** | Hiển thị Empty State tại vùng dữ liệu thay vì Loading hoặc lỗi. |
| **Lỗi tải dữ liệu** | Hiển thị Error State tại phạm vi bị lỗi. Nếu có thể thực hiện lại, cung cấp chức năng Thử lại. |
| **Lỗi một phần** | Chỉ đánh dấu vùng hoặc thành phần bị lỗi; các vùng dữ liệu độc lập còn lại tiếp tục hoạt động nếu không bị ảnh hưởng. |
| **Mất kết nối** | Không xác nhận thao tác thành công; thông báo mất kết nối. Cho phép người dùng thực hiện lại khi kết nối được phục hồi nếu trạng thái xử lý cho phép. |
| **Timeout** | Dừng trạng thái chờ; thông báo timeout. Không tự coi request đã thành công khi chưa có kết quả xác nhận. |
| **Không có quyền** | Không tiếp tục thao tác. Hiển thị thông báo không có quyền và giữ nguyên hoặc điều hướng màn hình theo kịch bản phân quyền tương ứng. |

### Quy tắc Loading

Loading phải được hiển thị ngay sau khi hệ thống bắt đầu thao tác có thời gian chờ đáng kể.

Phạm vi Loading tương ứng với phạm vi dữ liệu đang xử lý:

- Tải toàn bộ nội dung chính → Loading tại vùng nội dung;

- Tải bảng → Loading tại vùng bảng;

- Tải một thành phần độc lập → Loading tại thành phần đó.

Ưu tiên loading theo vùng thay vì khóa toàn màn hình nếu các vùng còn lại vẫn có thể sử dụng độc lập.

Khi Loading, các thao tác có thể tạo request trùng phải bị khóa.

Loading kết thúc khi hệ thống nhận được:

- Kết quả thành công;

- Kết quả lỗi;

- Timeout;

- Hoặc trạng thái kết thúc khác theo nghiệp vụ.

Không để Loading tồn tại vô thời hạn khi request đã thất bại hoặc timeout.

### Quy tắc chống thao tác lặp

Khi một thao tác tạo ra yêu cầu thay đổi dữ liệu đang được xử lý:

- Không cho phép nhấn lại nút xác nhận;

- Không gửi nhiều request giống nhau từ cùng một thao tác;

- Không cho phép thao tác khác gây xung đột trên cùng đối tượng nếu chưa có kết quả;

- Sau khi xử lý thành công hoặc thất bại, control được đưa về trạng thái phù hợp với dữ liệu hiện tại.

Quy tắc này áp dụng cho các thao tác như **Lưu lại, Xóa, Bật/Tắt trạng thái, Thử lại**. Các chức năng hiện tại cũng khóa nút trong thời gian xử lý để tránh gửi yêu cầu nhiều lần.

### Xử lý kết quả thao tác thay đổi dữ liệu

|  |  |
|----|----|
| **Kết quả** | **Cách xử lý** |
| Thành công | Hiển thị Toast thành công; cập nhật dữ liệu liên quan; đóng popup/form nếu luồng nghiệp vụ yêu cầu. |
| Validation không hợp lệ | Không gửi hoặc không tiếp tục thao tác; hiển thị Inline Message theo mục 4.6. |
| Lỗi nghiệp vụ | Không cập nhật dữ liệu; hiển thị nội dung lỗi tương ứng. |
| Không có quyền | Không thực hiện thay đổi; hiển thị thông báo không có quyền. |
| Bản ghi đã bị thay đổi/xóa hoặc không còn tồn tại | Không tiếp tục cập nhật trên dữ liệu cũ; thông báo cho người dùng và tải lại dữ liệu khi cần. |
| Lỗi xử lý hệ thống | Không xác nhận thành công; hiển thị Toast lỗi. |
| Timeout/mất kết nối | Không xác nhận thao tác thành công; giữ form/popup nếu phù hợp để người dùng có thể kiểm tra hoặc thực hiện lại. |

## Xóa bản ghi dùng chung

### Thông tin chung chức năng

- **Tên chức năng:** Xóa bản ghi dùng chung.

- **Mục đích:** Cho phép người dùng loại bỏ một bản ghi không còn nhu cầu sử dụng khỏi danh sách sau khi thực hiện xác nhận.

- **Phạm vi áp dụng:** Các chức năng có thao tác Xóa trên một bản ghi.

- **Người dùng mục tiêu:** Người dùng có quyền Xóa đối với đối tượng tương ứng.

- **Tiền điều kiện:**

  - Người dùng đang truy cập chức năng có bản ghi cần xóa.

  - Bản ghi được chọn còn tồn tại.

  - Người dùng có quyền thực hiện thao tác Xóa.

  - Bản ghi đáp ứng các điều kiện cho phép xóa theo nghiệp vụ của chức năng, nếu có.

- **Hậu điều kiện thành công:**

  - Bản ghi không còn hiển thị trong danh sách đang sử dụng.

  - Danh sách và thông tin phân trang được cập nhật.

- **Hậu điều kiện không thành công:**

  - Không thay đổi dữ liệu của bản ghi.

  - Hệ thống thông báo nguyên nhân tương ứng.

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 13%" />
<col style="width: 18%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 40%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Biểu tượng Xóa/Cảnh báo</td>
<td style="text-align: left;">Icon</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo thiết kế</td>
<td><ul>
<li><p>Hiển thị tại popup để người dùng nhận biết đây là thao tác có thể loại bỏ dữ liệu.</p></li>
<li><p>Không cho phép chỉnh sửa.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Tiêu đề xác nhận</td>
<td style="text-align: left;">Label – String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Cố định/theo chức năng</td>
<td><ul>
<li><p>Hiển thị tiêu đề xác nhận thao tác xóa, ví dụ <strong>“Bạn chắc chắn muốn xoá không?”</strong>.</p></li>
<li><p>Nội dung có thể được điều chỉnh theo đối tượng nhưng phải thể hiện rõ đây là thao tác xóa.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Nội dung xác nhận</td>
<td style="text-align: left;">Label – Unicode String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo bản ghi được chọn</td>
<td><ul>
<li><p>Hiển thị thông tin để người dùng nhận biết chính xác bản ghi sắp bị xóa. Mẫu chung: <strong>“Bạn có chắc chắn muốn xoá {Loại đối tượng}: {Tên đối tượng} không?”</strong>.</p></li>
<li><p>Tên hoặc thông tin nhận diện chính của đối tượng được nhấn mạnh.</p></li>
<li><p>Trường hợp cần thiết có thể hiển thị thêm Mã đối tượng để tránh nhầm lẫn.</p></li>
<li><p>Nội dung dài áp dụng quy tắc hiển thị dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Hủy bỏ</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Đóng popup, không thực hiện xóa và không thay đổi dữ liệu.</p></li>
<li><p>Danh sách giữ nguyên trạng thái trước khi mở popup.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Xóa/Xác nhận</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Xác nhận thực hiện thao tác xóa đối với đúng bản ghi đã chọn.</p></li>
<li><p>Trước khi xử lý, hệ thống kiểm tra lại quyền, sự tồn tại và các điều kiện cho phép xóa.</p></li>
<li><p>Trong thời gian xử lý, không cho phép gửi lặp yêu cầu.</p></li>
<li><p>Kết quả xử lý áp dụng theo <strong>mục 4.6 – Thông báo chung và trạng thái xử lý</strong>.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### Quy tắc xác định bản ghi xóa

|  |  |
|----|----|
| **Quy tắc** | **Mô tả** |
| Đúng bản ghi | Thao tác Xóa phải gắn với đúng định danh của bản ghi tại dòng được chọn. |
| Hiển thị đối chiếu | Popup phải hiển thị Tên và/hoặc Mã của bản ghi để người dùng kiểm tra trước khi xác nhận. |
| Không đổi đối tượng | Sau khi popup được mở, thao tác xác nhận phải áp dụng đúng bản ghi đã được chọn ban đầu. |
| Bản ghi không còn tồn tại | Không thực hiện xóa; thông báo cho người dùng và cập nhật lại danh sách khi cần. |
| Dữ liệu đã thay đổi | Hệ thống sử dụng dữ liệu hiện tại tại thời điểm xác nhận để kiểm tra khả năng xóa. |

### Quy tắc kiểm tra trước khi xóa

|  |  |
|----|----|
| **Nhóm kiểm tra** | **Xử lý** |
| Quyền thực hiện | Nếu người dùng không còn quyền Xóa, không thực hiện thao tác và hiển thị thông báo không có quyền. |
| Sự tồn tại của bản ghi | Nếu bản ghi không còn tồn tại hoặc đã được xóa trước đó, không thực hiện lại thao tác và cập nhật danh sách khi cần. |
| Ràng buộc nghiệp vụ | Nếu bản ghi đang được sử dụng hoặc không đáp ứng điều kiện được phép xóa, không thực hiện xóa và hiển thị nguyên nhân phù hợp. |
| Dữ liệu bổ sung | Nếu chức năng yêu cầu nhập thêm thông tin trước khi xóa, hệ thống kiểm tra theo **mục 4.6 – Kiểm tra dữ liệu và thông báo lỗi dùng chung**. |
| Yêu cầu hợp lệ | Chỉ khi tất cả điều kiện hợp lệ, hệ thống mới thực hiện xóa. |

### Quy tắc xử lý sau khi xóa

**Trường hợp thành công:**

- Hệ thống kết thúc trạng thái xử lý.

- Đóng popup xác nhận.

- Hiển thị thông báo theo mẫu: **“Xóa {Đối tượng} thành công.”**

- Tải lại danh sách theo từ khóa, bộ lọc và số bản ghi/trang hiện tại.

- Cập nhật tổng số bản ghi và thông tin phân trang.

**Trường hợp không thành công:**

- Không thay đổi dữ liệu.

- Kết thúc trạng thái xử lý.

- Hiển thị thông báo lỗi tương ứng.

- Giữ nguyên điều kiện tìm kiếm/lọc.

- Cho phép thực hiện lại nếu nguyên nhân lỗi cho phép.

### Các trường hợp xử lý

|  |  |
|----|----|
| **Trường hợp** | **Cách xử lý** |
| Người dùng chọn Hủy bỏ | Đóng popup; không thay đổi dữ liệu. |
| Xóa thành công | Đóng popup; hiển thị thông báo thành công; tải lại danh sách. |
| Không còn quyền Xóa | Không xóa; hiển thị thông báo không có quyền. |
| Bản ghi không còn tồn tại | Không xóa lại; thông báo và tải lại danh sách khi cần. |
| Bản ghi không được phép xóa do ràng buộc nghiệp vụ | Không xóa; hiển thị lý do để người dùng biết điều kiện chưa đáp ứng. |
| Lỗi hệ thống | Không xác nhận thành công; hiển thị thông báo lỗi. |
| Mất kết nối/Timeout | Không tự coi thao tác là thành công khi chưa nhận được kết quả xác nhận; xử lý theo mục 4.7. |
| Đang xử lý | Khóa nút xác nhận để tránh gửi yêu cầu xóa nhiều lần. |

## Bật/Tắt trạng thái dùng chung

### Thông tin chung chức năng

- **Tên chức năng:** Bật/Tắt trạng thái dùng chung.

- **Mục đích:** Cho phép người dùng thay đổi trạng thái hoạt động của một bản ghi mà không thực hiện xóa dữ liệu.

- **Phạm vi áp dụng:** Các chức năng có thuộc tính trạng thái cho phép thay đổi trực tiếp thông qua Toggle.

- **Loại thao tác:** Cập nhật trạng thái.

- **Người dùng mục tiêu:** Người dùng có quyền cập nhật trạng thái của đối tượng tương ứng.

- **Tiền điều kiện:**

  - Người dùng đang truy cập màn hình có chức năng Bật/Tắt trạng thái.

  - Bản ghi được chọn còn tồn tại.

  - Người dùng có quyền cập nhật trạng thái.

  - Bản ghi đáp ứng các điều kiện cho phép thay đổi trạng thái theo nghiệp vụ, nếu có.

- **Hậu điều kiện:**

  - Trạng thái mới được lưu.

  - Toggle hiển thị đúng trạng thái mới.

  - Dữ liệu danh sách được cập nhật tương ứng.

### Mô tả chi tiết các thành phần 

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 13%" />
<col style="width: 18%" />
<col style="width: 13%" />
<col style="width: 9%" />
<col style="width: 40%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Trạng thái</td>
<td style="text-align: left;">Toggle Switch – Boolean</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Hiển thị trạng thái hiện tại của bản ghi.</p></li>
<li><p>Trạng thái Bật tương ứng <strong>Đang hoạt động</strong>, trạng thái Tắt tương ứng <strong>Ngừng hoạt động</strong>.</p></li>
<li><p>Khi người dùng thay đổi Toggle, hệ thống chưa cập nhật dữ liệu ngay mà thực hiện kiểm tra điều kiện và hiển thị popup xác nhận.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Tiêu đề trạng thái</td>
<td style="text-align: left;">Label – String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo trạng thái cần chuyển</td>
<td><ul>
<li><p>Nếu bản ghi đang <strong>Đang hoạt động</strong>, hiển thị <strong>“Ngừng hoạt động”</strong>.</p></li>
<li><p>Nếu bản ghi đang <strong>Ngừng hoạt động</strong>, hiển thị <strong>“Kích hoạt”</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Nội dung xác nhận</td>
<td style="text-align: left;">Label – Unicode String</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo bản ghi được chọn</td>
<td><ul>
<li><p>Hiển thị nội dung xác nhận theo đối tượng và trạng thái cần chuyển.</p></li>
<li><p>Tên hoặc thông tin nhận diện chính của bản ghi được nhấn mạnh để người dùng đối chiếu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Không/Hủy bỏ</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Đóng popup, không cập nhật dữ liệu và đưa Toggle về trạng thái trước khi người dùng thao tác.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Có/Xác nhận</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">–</td>
<td><ul>
<li><p>Xác nhận thay đổi trạng thái.</p></li>
<li><p>Hệ thống kiểm tra lại quyền, sự tồn tại của bản ghi và các điều kiện nghiệp vụ trước khi cập nhật.</p></li>
<li><p>Trong thời gian xử lý, không cho phép gửi lặp cùng yêu cầu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### Quy tắc xác định trạng thái

|                         |              |                    |                   |
|-------------------------|--------------|--------------------|-------------------|
| **Trạng thái hiện tại** | **Thao tác** | **Trạng thái mới** | **Tiêu đề popup** |
| Đang hoạt động          | Tắt Toggle   | Ngừng hoạt động    | Ngừng hoạt động   |
| Ngừng hoạt động         | Bật Toggle   | Đang hoạt động     | Kích hoạt         |

### Quy tắc nội dung xác nhận

Nội dung chung:

**Khi chuyển sang Ngừng hoạt động:**

Bạn có chắc chắn muốn ngừng hoạt động {Đối tượng}: {Tên đối tượng} không?

**Khi chuyển sang Đang hoạt động:**

Bạn có chắc chắn muốn kích hoạt {Đối tượng}: {Tên đối tượng} không?

Trong đó:

- {Đối tượng}: tên loại dữ liệu đang thao tác.

- {Tên đối tượng}: thông tin nhận diện của bản ghi được chọn.

- Tên đối tượng được nhấn mạnh để người dùng dễ đối chiếu.

- Có thể bổ sung Mã đối tượng nếu tên không đủ để nhận diện duy nhất.

### Kiểm tra trước khi cập nhật trạng thái

|  |  |
|----|----|
| **Nhóm kiểm tra** | **Cách xử lý** |
| Quyền cập nhật | Nếu người dùng không còn quyền, không thực hiện cập nhật và hiển thị thông báo không có quyền. |
| Sự tồn tại của bản ghi | Nếu bản ghi không còn tồn tại, không cập nhật; thông báo cho người dùng và tải lại dữ liệu khi cần. |
| Trạng thái hiện tại | Kiểm tra trạng thái thực tế của bản ghi tại thời điểm xác nhận để tránh cập nhật dựa trên dữ liệu cũ. |
| Ràng buộc nghiệp vụ | Nếu trạng thái không được phép thay đổi do điều kiện nghiệp vụ, không cập nhật và hiển thị thông báo phù hợp. |
| Điều kiện hợp lệ | Chỉ thực hiện cập nhật khi toàn bộ điều kiện đều đáp ứng. |

### Quy tắc xử lý Toggle

**Trước khi xác nhận:**

- Khi người dùng thao tác Toggle, hệ thống hiển thị popup xác nhận.

- Trạng thái mới chưa được xem là đã cập nhật.

- Không phát sinh thay đổi dữ liệu nghiệp vụ trước khi người dùng xác nhận.

**Nếu người dùng chọn Không/Hủy bỏ:**

- Đóng popup.

- Không cập nhật dữ liệu.

- Toggle trở về trạng thái ban đầu.

**Nếu người dùng chọn Có/Xác nhận:**

- Hệ thống thực hiện kiểm tra điều kiện.

- Nếu hợp lệ, gửi yêu cầu cập nhật.

- Trong thời gian xử lý, khóa thao tác xác nhận để tránh double-submit.

### Quy tắc xử lý kết quả

|  |  |
|----|----|
| **Kết quả** | **Cách xử lý** |
| Cập nhật thành công | Lưu trạng thái mới; đóng popup; Toggle hiển thị trạng thái mới; hiển thị thông báo thành công và cập nhật lại dữ liệu liên quan. |
| Người dùng chọn Không/Hủy | Không cập nhật; đóng popup; khôi phục trạng thái Toggle ban đầu. |
| Không có quyền | Không cập nhật; khôi phục Toggle; hiển thị thông báo không có quyền. |
| Bản ghi không còn tồn tại | Không cập nhật; khôi phục trạng thái hiển thị và tải lại danh sách khi cần. |
| Không đáp ứng ràng buộc nghiệp vụ | Không cập nhật; khôi phục Toggle; hiển thị nguyên nhân tương ứng. |
| Lỗi hệ thống | Không xác nhận trạng thái mới; khôi phục Toggle và hiển thị thông báo lỗi. |
| Mất kết nối/Timeout | Không tự coi cập nhật thành công khi chưa nhận được kết quả xác nhận; xử lý theo **mục 4.7 – Thông báo chung và trạng thái xử lý**. |
| Đang xử lý | Không cho phép gửi thêm yêu cầu cập nhật trạng thái của cùng bản ghi. |

5.  THIẾT KẾ CƠ SỞ DỮ LIỆU

5.1.1. Mô hình dữ liệu

Hệ thống sử dụng các cơ sở dữ liệu gì, để làm gì. Ví dụ: Hệ thống sử dụng ElasticSearch để lưu trữ event log, PostgreSql để lưu trữ cấu hình hệ thống, cảnh báo, thông tin người dùng, …

Các mô hình thực thể liên kết của hệ thống như sau (có thể gồm nhiều mô hình thực thể liên kết nếu hệ thống chia thành nhiều phân hệ dữ liệu độc lập nhau):

Các bảng/collection dữ liệu như sau:

|  |  |  |  |
|----|----|----|----|
| **STT** | **Table/Collection** | **Loại** | **Mô tả** |
| 1 | soc_asset_computing_device | Elasticsearch | Lưu trữ thông tin chi tiết các đối tượng computing device |
| 2 | Asset_setting | MongoDB | Lưu trữ cấu hình các loại Asset |
|  |  |  |  |

5.1.2 Chi tiết các bảng CSDL

Mô tả chi tiết về các bảng cơ sở dữ liệu.

|  |  |  |  |  |  |  |  |
|----|----|----|----|----|----|----|----|
| **STT** | **Tên trường** | **Kiểu dữ liệu và độ dài** | **Nullable** | **Unikey** | **P/F Key** | **Mặc định** | **Mô tả** |
|  | xxxCode | Int (4) |  | x |  |  | Code của xxx, Auto number |
|  | xxxxCode | Varch (100) | x |  |  |  | Code of yyy. |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

5.1.3. Constraint

\< Mô tả về khóa chính, khóa phụ và các ràng buộc dữ liệu vào mục này nếu có\>

5.1.4. Index

\< Mô tả về tên index, tên bảng và tên cột tương ứng với index nếu có\>.

5.1.5. Trigger

\< Mô tả về trigger, tên bảng, sự kiện và ý nghĩa các trigger tương ứng vào đây nếu có.\>.

5.1.6. Store Produre/Function

\< Mô tả về tên thủ tục ở mức hệ thống và mức ứng dụng, đầu vào và đầu ra của thủ tục vào đây nếu có\>.

6.  THIẾT KẾ ĐẢM BẢO TUÂN THỦ TIÊU CHUẨN QUẢN TRỊ DỮ LIỆU

\[Liệt kê các thiết kế/tính năng/giải pháp đáp ứng tuân thủ tiêu chuẩn Quản trị dữ liệu đã nêu trong CTKT và PTYC\]

\[Ví dụ:

## Quản trị dữ liệu

- Bảng danh mục dữ liệu CDE

| STT | Tên trường dữ liệu | Mô tả | Bảng dữ liệu | Trường dữ liệu | Loại dữ liệu | Chủ sở hữu dữ liệu |
|----|----|----|----|----|----|----|
| Ví dụ 1 | *Tên trường dữ liệu* | *Mô tả tên trường dữ liệu* | *Bảng dữ liệu* | *Trường dữ liệu* | *Tên loại dữ liệu* | *Tên cơ quan, đơn vị chủ sở hữu dữ liệu* |
| Ví dụ 2 |  |  |  |  |  |  |

## Bảo mật dữ liệu

- Xác định danh sách các dữ liệu cần tuân thủ tiêu chuẩn bảo mật.

|  |  |  |  |  |  |  |
|----|----|----|----|----|----|----|
| ***STT*** | ***Tên trường dữ liệu*** | ***Hệ thống/Phân hệ*** | ***Phân cấp bảo mật*** | ***Phân loại bảo mật*** | ***Định nghĩa các vai trò (role) và phân quyền dữ liệu tương ứng*** | ***Làm mờ - marking dữ liệu.*** |
|  | *Tên trường dữ liệu* | *Tên phân hệ* | *Cấp độ bảo mật* | *Phân loại bảo mật* |  | *Dữ liệu phải thực hiện mã hóa.* |
|  |  |  |  |  |  |  |

- *Trình bày giải pháp đảm bảo (chỉ ra các tính năng/giải pháp giúp đảm bảo tuân thủ).*

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 27%" />
<col style="width: 27%" />
<col style="width: 29%" />
</colgroup>
<thead>
<tr>
<th rowspan="2">DB</th>
<th colspan="3"></th>
</tr>
<tr>
<th>App</th>
<th>BI</th>
<th>SOC</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>Tên bảng dữ liệu</em></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

## Chất lượng dữ liệu

- Xác định danh sách dữ liệu cần tuân thủ tiêu chuẩn Chất lượng dữ liệu dựa trên bộ rule chuẩn.

| STT | Luật check | Đối tượng check | Loại tiêu chuẩn đánh giá | Mô tả chi tiết luật đánh giá | Đầu vào cần cung cấp |
|----|----|----|----|----|----|
|  |  |  |  |  |  |

## Quản lý siêu dữ liệu

### Thông tin đối tượng dữ liệu

| STT | Tên đối tượng | Mô tả | Loại đối tượng | Thông tin liên quan | Kiểu dữ liệu | Thời gian tạo | Thời gian chỉnh sửa lần cuối | Cấp độ bảo mật | Dữ liệu trọng yếu | Đơn vị chủ dữ liệu | Đầu mối quản lý dữ liệu | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 01 | Tên đối tượng | Mô tả | Loại đối tượng | Thông tin liên quan | Kiểu dữ liệu | Ngày tạo | Ngày chỉnh sửa gần nhất | Cấp độ bảo mật | Phân loại cấp độ trọng yếu | Đơn vị/Cơ quan chủ quản | Đơn vị/Cơ quan quản lý dữ liệu | Đơn vị/Cơ quan sở hữu hệ thống | Thông tin đầu mối quản trị kỹ thuật |

### Thông tin hệ thống

| STT | Tên ứng dụng | Mô tả | Phiên bản | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|
| 01 | *Tên ứng dụng* | *Mô tả ứng dụng* | *Số phiên bản* | *Đơn vị/ Cơ quan chủ quản* | *Thông tin đầu mối quản trị kỹ thuật* |

### Thông tin luồng dữ liệu

| STT | Tên luồng dữ liệu | Mô tả | Lệnh tổng hợp | Đầu mối quản lý | Hệ thống/nghiệp vụ sử dụng luồng |
|----|----|----|----|----|----|
| 01 | *Tên luồng dữ liệu* | *Mô tả luồng dữ liệu* | *Mô tả câu lệnh* | *Đơn vị/ Cơ quan đầu mối quản lý* | *Tên nghiệp vụ/phân hệ/module sử dụng luồng* |

### Thông tin thuật ngữ nghiệp vụ

| STT | Tên thuật ngữ | Tên viết tắt / tên gợi nhớ | Định nghĩa | Quy tắc nghiệp vụ/công thức tính | Đơn vị định nghĩa thuật ngữ | Các thuật ngữ liên quan | Trường dữ liệu liên kết | Thời điểm tạo | Lịch sử chỉnh sửa |
|----|----|----|----|----|----|----|----|----|----|
| 01 | Tên thuật ngữ | Tến viết tắt thuật ngữ | Định nghĩa thuật ngữ | *Quy tắc nghiệp vụ (nếu có)* | Đơn vị/Cơ quan định nghĩa thuật ngữ | *Tên các thuật ngữ liên quan* | *Tên trường dữ liệu liên kết* | *Ngày tạo* | *Lịch sử chỉnh sửa* |

## Lưu trữ và vận hành

<table>
<colgroup>
<col style="width: 5%" />
<col style="width: 12%" />
<col style="width: 17%" />
<col style="width: 8%" />
<col style="width: 12%" />
<col style="width: 14%" />
<col style="width: 16%" />
<col style="width: 10%" />
</colgroup>
<thead>
<tr>
<th>STT</th>
<th>Dữ liệu</th>
<th>Mô tả</th>
<th>Đối tượng dữ liệu</th>
<th>Thời gian lưu trữ trên hạ tầng tốc độ cao</th>
<th>Thời gian lưu trữ trên hạ tầng tốc độ trung bình</th>
<th>Thời gian lưu trữ trên hậ tầng tốc độ thấp (backup offline)</th>
<th>Tần suất backup</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="8">Dữ liệu khách hàng</td>
</tr>
<tr>
<td>01</td>
<td>Tên tường dữ liệu</td>
<td>Mô tả trường dữ liệu</td>
<td>Phân loại đối tượng dữ liệu</td>
<td>Thời gian lưu trữ (năm/tháng/tuần)</td>
<td>Thời gian lưu trữ (năm/tháng/tuần)</td>
<td>Thời gian lưu trữ (lâu dài/ngắn hạn/vĩnh viễn)</td>
<td>Thời gian lưu trữ (năm/tháng/tuần)</td>
</tr>
<tr>
<td>02</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td colspan="8">Dữ liệu sản phẩm</td>
</tr>
<tr>
<td>03</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

7.  PHỤ LỤC
