<!-- pk-source: ../docs/SRS/02-srs/SRS Quản lý mẫu thông báo.docx -->
<!-- pk-sha256: 1667ad54a68c2ba0401da9dc8a8321a1685746ce3f015bae95af4a736c45e9ca -->
<!-- pk-generated: 2026-11-02 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SRS-TB — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/02-srs/SRS Quản lý mẫu thông báo.docx`. Trích dẫn thì ghi mã **SRS-TB** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

<img src="media/image30.png" style="width:0.75in;height:0.75in" /><img src="media/image30.png" style="width:0.75in;height:0.75in" /><img src="media/image30.png" style="width:0.75in;height:0.75in" /><img src="media/image30.png" style="width:0.75in;height:0.75in" /><img src="media/image30.png" style="width:0.75in;height:0.75in" />

<img src="media/image4.png" style="width:2.75833in;height:0.58611in" alt="D:\Picture\Logo\Viettel_logo_2021.svg.png" />

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI VIETTEL**

**\<ĐƠN VỊ\>**

**BIỂU MẪU**

**TÀI LIỆU THIẾT KẾ CHI TIẾT**

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

[**<span class="smallcaps">1. GIỚI THIỆU 6</span>**](#giới-thiệu)

> [1.1. Mục đích 7](#mục-đích)
>
> [1.2. Phạm vi 7](#phạm-vi)
>
> [1.3. Khái niệm, thuật ngữ 7](#khái-niệm-thuật-ngữ)

[**<span class="smallcaps">2. TỔNG QUAN GIẢI PHÁP 7</span>**](#tổng-quan-giải-pháp)

> [2.1. Tổng quan chức năng 7](#tổng-quan-chức-năng)
>
> [2.2. Mô hình giao tiếp với hệ thống/Module chức năng khác 8](#mô-hình-giao-tiếp-với-hệ-thốngmodule-chức-năng-khác)
>
> [**2.3. Các quy định chung 8**](#_heading=)

[**<span class="smallcaps">3. THIẾT KẾ CHI TIẾT 9</span>**](#thiết-kế-chi-tiết)

> [3.1. THIẾT KẾ CHI TIẾT KIẾN TRÚC 9](#thiết-kế-chi-tiết-kiến-trúc)
>
> [**3.1.1. Kiến trúc component A 9**](#_heading=)
>
> [**3.1.2. Kiến trúc component B 11**](#_heading=)
>
> [**3.2. THIẾT KẾ CHI TIẾT NGHIỆP VỤ 11**](#_heading=)
>
> [3.2.1. Quản lý mẫu thông báo 11](#quản-lý-mẫu-thông-báo)
>
> [3.2.2. Xem chi tiết mẫu thông báo 21](#xem-chi-tiết-mẫu-thông-báo)
>
> [**6.1.2. Thêm mới mẫu thông báo 28**](#_heading=)
>
> [**6.1.3. Chỉnh sửa mẫu thông báo 39**](#_heading=)
>
> [**6.1.4. Xóa mẫu thông báo 51**](#_heading=)
>
> [6.1.5. Kênh thông báo 57](#kênh-thông-báo)
>
> [6.1.6. THIẾT KẾ CHI TIẾT JOB TỰ ĐỘNG QUÉT VÀ GỬI THÔNG BÁO (JOB_NOTI_DISPATCHER) 62](#thiết-kế-chi-tiết-job-tự-động-quét-và-gửi-thông-báo-job_noti_dispatcher)
>
> [**6.1.7. THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG 74**](#_heading=)
>
> [6.2. Thiết kế dùng chung 74](#thiết-kế-dùng-chung)
>
> [6.3. Thông báo/cảnh báo 78](#thông-báocảnh-báo)
>
> [6.3.1. Thông tin chung chức năng 78](#thông-tin-chung-chức-năng-6)
>
> [6.3.2. Màn hình 79](#màn-hình-6)
>
> [6.3.3. Mô tả chi tiết các thành phần 81](#mô-tả-chi-tiết-các-thành-phần-6)
>
> [6.4. Luồng nghiệp vụ 87](#luồng-nghiệp-vụ-6)
>
> [6.5. Mô tả luồng xử lý 87](#mô-tả-luồng-xử-lý)
>
> [6.6. Kịch bản phân trang & Load more 88](#kịch-bản-phân-trang-load-more)
>
> [6.6.1. Phân trang 88](#phân-trang)
>
> [**6.6.2. Load more 93**](#_heading=)
>
> [**6.7. Menu chức năng dùng chung 96**](#_heading=)
>
> [**6.7.1. Thông tin chức năng 96**](#_heading=)
>
> [**6.7.2. Mô tả chi tiết các thành phần 96**](#_heading=)
>
> [**6.7.3. Quy tắc xử lý 98**](#_heading=)
>
> [**6.7.4. Quy tắc hiển thị 98**](#_heading=)
>
> [**6.8. Breadcrumb dùng chung 98**](#_heading=)
>
> [**6.8.1. Thông tin chung chức năng 98**](#_heading=)
>
> [**6.8.2. Mô tả chi tiết các thành phần 99**](#_heading=)
>
> [**6.8.3. Quy tắc xử lý 99**](#_heading=)
>
> [**6.8.4. Quy tắc hiển thị 100**](#_heading=)
>
> [**6.9. Tìm kiếm dùng chung 100**](#_heading=)
>
> [**6.9.1. Thông tin chung chức năng 100**](#_heading=)
>
> [**6.9.2. Mô tả chi tiết các thành phần 101**](#_heading=)
>
> [**6.9.3. Quy tắc xử lý 101**](#_heading=)
>
> [**6.9.4. Quy tắc hiển thị 101**](#_heading=)

[**7. THIẾT KẾ CƠ SỞ DỮ LIỆU 102**](#_heading=)

> [**7.1. Mô hình dữ liệu 102**](#_heading=)
>
> [**7.2. Chi tiết các bảng CSDL 103**](#_heading=)
>
> [**7.3. Constraint 103**](#_heading=)
>
> [**7.4. Index 103**](#_heading=)
>
> [**7.5. Trigger 104**](#_heading=)
>
> [**7.6. Store Produre/Function 104**](#_heading=)

[**8. THIẾT KẾ ĐẢM BẢO TUÂN THỦ TIÊU CHUẨN QUẢN TRỊ DỮ LIỆU 104**](#_heading=)

> [8.1. Quản trị dữ liệu 104](#quản-trị-dữ-liệu)
>
> [8.2. Bảo mật dữ liệu 105](#bảo-mật-dữ-liệu)
>
> [8.3. Chất lượng dữ liệu 105](#chất-lượng-dữ-liệu)
>
> [8.4. Quản lý siêu dữ liệu 106](#quản-lý-siêu-dữ-liệu)
>
> [8.4.1. Thông tin đối tượng dữ liệu 106](#thông-tin-đối-tượng-dữ-liệu)
>
> [8.4.2. Thông tin hệ thống 107](#thông-tin-hệ-thống)
>
> [8.4.3. Thông tin luồng dữ liệu 107](#thông-tin-luồng-dữ-liệu)
>
> [8.4.4. Thông tin thuật ngữ nghiệp vụ 108](#thông-tin-thuật-ngữ-nghiệp-vụ)
>
> [8.5. Lưu trữ và vận hành 109](#lưu-trữ-và-vận-hành)

[**<span class="smallcaps">9. PHỤ LỤC 109</span>**](#phụ-lục)

# GIỚI THIỆU

Tài liệu mô tả chi tiết các quy trình nghiệp vụ và đặc tả chức năng yêu cầu của Hệ thống Trung tâm Chỉ huy - Hệ thống quản lý, giám sát và chỉ huy trường bắn.

## Mục đích

Tài liệu này cung cấp một bức tranh toàn cảnh về hệ thống thông qua một số mô hình kiến trúc khác nhau nhằm miêu tả hệ thống dưới nhiều góc nhìn khác nhau. Tài liệu này được mong chờ sẽ ghi nhận và truyền đạt lại những quyết định quan trọng về kiến trúc của hệ thống.

## Phạm vi

Tài liệu này phục vụ cho các đối tượng sau:

- Nhân viên thiết kế hệ thống: Là người sẽ thiết kế hệ thống source code, thực hiện coding để xây dựng nên hệ thống.

- Nhân viên kiểm thử: là người sẽ thực hiện các công việc kiểm thử hệ thống

- Đơn vị vận hành, khai thác hệ thống: Là người sử dụng, quản trị hệ thống (Admin).

## Khái niệm, thuật ngữ

|  |  |  |
|:--:|:--:|:--:|
| STT | Thuật ngữ | Khái niệm |
| 1 | API | Application Programming Interface |
| 2 | CSDL | Cơ sở dữ liệu |
| 3 | SysRD | System Requirements Document – tài liệu mô tả yêu cầu hệ thống |
| 4 | HTQLTB | Hệ thống quản lý, giám sát, chỉ huy trường bắn |
| 5 | SCH | Sở chỉ huy |
| 6 | FTS | Fight termination system |
| 7 | COP | Bức tranh toàn cảnh (Common Operational Picture) |

# TỔNG QUAN GIẢI PHÁP

## Tổng quan chức năng

\[Sơ đồ phân rã chức năng\]

Ví dụ:

## Mô hình giao tiếp với hệ thống/Module chức năng khác

\[Sơ đồ quan hệ chức năng\]

Ví dụ:

## Các quy định chung

# THIẾT KẾ CHI TIẾT

## THIẾT KẾ CHI TIẾT KIẾN TRÚC

###  Kiến trúc component A

*Component là một tập các service/container được deploy cùng nhau để thực hiện nhiệm vụ chung - tương đương với pod/job trong k8s/nomad. Các component có thể start/stop/deploy độc lập nhau.*

*Mỗi thiết kế kiến trúc cho một component cần một hình vẽ ở mức C3 trong C4 model và kèm mô tả các thành phần trong biểu đồ.*

*VD:*

<img src="media/image10.png" style="width:9.00139in;height:5.48819in" />

### Kiến trúc component B

## THIẾT KẾ CHI TIẾT NGHIỆP VỤ

### Quản lý mẫu thông báo

#### Thông tin chung chức năng

- Mã chức năng: <span class="mark"></span>UC-NOTI-01

- Mục đích: <span class="mark"></span>Cho phép người dùng có quyền xem, tìm kiếm và lọc danh sách các Mẫu thông báo đang được quản lý trên hệ thống.

- Người dùng mục tiêu: <span class="mark"></span>Quản trị viên/Người dùng được cấp quyền quản lý Mẫu thông báo.

- Đường dẫn truy cập: Người dùng truy cập Quản lý thông báo -\> Mẫu thông báo.

- Tiền điều kiện:

  - Người dùng đã đăng nhập và có quyền truy cập chức năng.

  - Dữ liệu Mẫu thông báo đã được khởi tạo hoặc hệ thống cho phép danh sách rỗng.

- Hậu điều kiện:

  - Danh sách Mẫu thông báo được hiển thị theo điều kiện tìm kiếm/lọc.

  - Người dùng có thể chuyển sang tạo mới, xem chi tiết, chỉnh sửa hoặc xóa theo quyền.

- Requirements Traceability Matrix – RTM:

#### Màn hình

<img src="media/image13.png" style="width:9in;height:5.06944in" />

#### Mô tả chi tiết các thành phần

<table style="width:100%;">
<colgroup>
<col style="width: 6%" />
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">STT</th>
<th>Tên</th>
<th><p>Kiểu dữ liệu</p>
<p>[Độ dài dữ liệu]</p></th>
<th>Input/Output</th>
<th style="text-align: left;">Giá trị khởi tạo</th>
<th><strong>Mô tả</strong> (Mapping với API/CSDL nếu có)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Tiêu đề Mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">“Mẫu thông báo”</td>
<td><ul>
<li><p>Hiển thị tiêu đề khu vực bảng dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Thêm mới</td>
<td>Button</td>
<td>Input</td>
<td style="text-align: left;">Hiển thị nếu có quyền</td>
<td><ul>
<li><p>Chỉ hiển thị/enable khi người dùng có quyên.</p></li>
<li><p>Khi nhấn, hệ thống kiểm tra lại quyền và chuyển hướng người dùng đến màn hình tạo mới mẫu thông báo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Tìm kiếm</td>
<td>NVARCHAR [255]</td>
<td>Input</td>
<td style="text-align: left;">Placeholder “Tìm kiếm theo mã, tên mẫu thông báo”</td>
<td><ul>
<li><p>Hỗ trợ tìm kiếm theo Mã thông báo, tên thông báo.</p></li>
<li><p>Tìm kiếm theo Common Tìm kiếm dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Tìm kiếm nâng cao</td>
<td>Button</td>
<td>Input</td>
<td style="text-align: left;">“Tìm kiếm nâng cao”</td>
<td><ul>
<li><p>Khi người dùng click tìm kiếm nâng cao hệ thống mở bộ tìm kiếm nâng cao và ẩn textbox tìm kiếm.</p></li>
<li><p>Người dùng có thể tìm kiếm nâng cao theo Mã thông báo, Tên thông báo, Kênh thông báo, Trạng thái.</p></li>
</ul>
<p><img src="media/image11.png" style="width:3.91667in;height:0.63889in" /></p>
<ul>
<li><p>Sau khi người dùng nhập thông tin nhấn tìm kiếm để tìm kiếm theo các trường dữ liệu đã nhập.</p></li>
<li><p>Khi thay đổi từ khóa và click tìm kiếm, hệ thống giữ nguyên các bộ lọc khác nhưng đưa trang hiện tại về trang 1.</p></li>
<li><p>Khi đang tải dữ liệu, hiển thị trạng thái loading tại vùng danh sách, bộ tìm kiếm nâng cao vẫn giữ nguyên từ khóa.</p></li>
<li><p>Nếu không có kết quả, hiển thị trạng thái rỗng và thông điệp "Không tìm thấy dữ liệu phù hợp".</p></li>
<li><p>Nếu API lỗi, giữ nguyên từ khóa và hiển thị thông báo lỗi, không xóa dữ liệu người dùng đã nhập.</p></li>
<li><p>Người dùng click <img src="media/image5.png" style="width:0.91667in;height:0.41667in" /> để đặt lại tìm kiếm nâng cao</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>STT</td>
<td>Number</td>
<td>Output</td>
<td style="text-align: left;">Tự động tăng (1, 2, 3...)</td>
<td style="text-align: left;"><p><strong>Hiển thị:</strong></p>
<ul>
<li><p>Giá trị hiển thị dạng số nguyên tăng dần bắt đầu từ 1 theo dữ liệu phân trang hiện tại.</p></li>
<li><p>Căn giữa theo cột danh sách.</p></li>
</ul>
<p><strong>Quy tắc xử lý:</strong></p>
<ul>
<li><p>STT được tính theo dữ liệu hiển thị trên từng page.</p></li>
<li><p>Khi chuyển trang, STT được tính lại tương ứng với page hiện tại.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Thao tác</td>
<td>Thao tác</td>
<td>Input</td>
<td style="text-align: left;">N/a</td>
<td><ul>
<li><p>Hiển thị icon thao tác <img src="media/image14.png" style="width:0.86199in;height:0.59752in" />.</p></li>
<li><p>Khi người dùng click <img src="media/image6.png" style="width:0.41667in;height:0.41667in" /> mở màn hình chỉnh sửa mẫu thông báo.</p></li>
<li><p>Khi người dùng click <img src="media/image17.png" style="width:0.41667in;height:0.41667in" /> mở popup xác nhận xóa mẫu thông báo.</p></li>
<li><p>Chỉ hiển thị thao tác mà người dùng có quyền và phù hợp trạng thái tài khoản.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: left;">Trạng thái</td>
<td style="text-align: left;">Toggle</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">Theo dữ liệu bản ghi</td>
<td><ul>
<li><p>Hiển thị trạng thái hiện tại: <strong>Bật = Đang hoạt động; Tắt = Dừng hoạt động</strong>. Việc thay đổi trạng thái áp dụng theo <strong>Bật/Tắt trạng thái dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td>Mã mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Mã thông báo.</p></li>
<li><p>Hiển thị tối đa 2 dòng dữ liệu.</p></li>
<li><p>Nếu độ dài dữ liệu vượt quá 2 dòng, hiển thị ba chấm […] ở cuối dòng thứ 2 và có tooltip hiển thị toàn bộ nội dung.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
<li><p>Người dùng click mã mẫu thông báo để xem chi tiết mẫu thông báo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td>Tên mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Tên mẫu thông báo.</p></li>
<li><p>Hiển thị tối đa 2 dòng dữ liệu.</p></li>
<li><p>Nếu độ dài dữ liệu vượt quá 2 dòng, hiển thị ba chấm […] ở cuối dòng thứ 2 và có tooltip hiển thị toàn bộ nội dung.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">10</td>
<td>Kênh thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Kênh thông báo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">11</td>
<td>Ngày tạo</td>
<td>DateTime</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị thời điểm tạo Mẫu thông báo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">12</td>
<td>Phân trang</td>
<td>Button</td>
<td>Output</td>
<td style="text-align: left;">N/a</td>
<td><ul>
<li><p>Theo Common <a href="https://docs.google.com/document/d/1q8x14cAM7nw1wnAzYieviRgR0kzABh75/edit#heading=h.oixcmkee4btt"><u>phân trang dùng chung</u></a></p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Luồng nghiệp vụ

<img src="media/image16.png" style="width:5.34896in;height:5.63966in" />

##### Mô tả luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 90%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Bước</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Người dùng truy cập vào hệ thống.</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Người dùng chọn chức phân hệ Khoa học công nghệ -&gt; Quản lý mẫu thông báo.</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;"><ul>
<li><p>Hệ thống gọi API lấy dữ liệu danh sách danh sách mẫu thông báo, nếu:<br />
Trường hợp hệ thống chưa có dữ liệu/Call API lấy dữ liệu có lỗi =&gt; Báo lỗi theo bước 4</p></li>
<li><p>Trường hợp hệ thống có dữ liệu/Call API lấy dữ liệu thành công: Hiển thị danh sách mẫu thông báo thành công =&gt; Thực hiện bước 5 </p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;"><ul>
<li><p>Trường hợp call API lấy dữ liệu có lỗi: Hiển thị toast message (TM)</p>
<ul>
<li><p>Trường hợp lỗi API trả về có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.63tehiyp9mpz"><u>TB010</u></a></p></li>
<li><p>Trường hợp lỗi API trả về không có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.5tq9z3q8dyug"><u>TB011</u></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Hệ thống thực hiện phân trang dữ liệu trả về và danh sách mẫu thông báo.</td>
</tr>
</tbody>
</table>

### \

### Xem chi tiết mẫu thông báo

#### Thông tin chung chức năng

- Mã chức năng: <span class="mark"></span>UC-NOTI-02

- Mục đích: <span class="mark"></span>Hiển thị đầy đủ thông tin cấu hình của một Mẫu thông báo.

- Người dùng mục tiêu: <span class="mark"></span>Người dùng có quyền xem Mẫu thông báo.

- Đường dẫn truy cập: Nhấn Mã mẫu thông báo tại danh sách hoặc mở bản ghi theo điều hướng hệ thống.

- Tiền điều kiện:

  - Bản ghi Mẫu thông báo tồn tại.

  - Người dùng có quyền xem.

- Hậu điều kiện:

  - Thông tin Mẫu thông báo được hiển thị ở chế độ chỉ đọc.

  - Người dùng có thể đóng panel chi tiết để quay lại danh sách.

- Requirements Traceability Matrix – RTM:

#### Màn hình

<img src="media/image27.png" style="width:9in;height:5.06944in" />

#### Mô tả chi tiết các thành phần

<table style="width:100%;">
<colgroup>
<col style="width: 6%" />
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">STT</th>
<th>Tên</th>
<th><p>Kiểu dữ liệu</p>
<p>[Độ dài dữ liệu]</p></th>
<th>Input/Output</th>
<th>Giá trị khởi tạo</th>
<th><strong>Mô tả</strong> (Mapping với API/CSDL nếu có)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Quay lại</td>
<td>Icon button</td>
<td>Input</td>
<td>N/a</td>
<td><ul>
<li><p>Khi chọn, điều hướng về màn hình Danh sách mẫu thông báo và giữ lại điều kiện lọc, từ khóa, trang hiện tại nếu còn trong cùng phiên điều hướng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Tiêu đề Xem chi tiết mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">“Chi tiết mẫu thông báo”</td>
<td><ul>
<li><p>Hiển thị tiêu đề khu vực bảng dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td><mark>Chỉnh sửa</mark></td>
<td>Button</td>
<td>Input</td>
<td style="text-align: left;">Hiển thị nếu có quyền</td>
<td><ul>
<li><p>Chỉ hiển thị/enable khi người dùng có quyên.</p></li>
<li><p>Điều hướng người dùng đến màn hình Chỉnh sửa mẫu thông báo</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Mã mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Mã thông báo.</p></li>
<li><p>Hiển thị tối đa 2 dòng dữ liệu.</p></li>
<li><p>Nếu độ dài dữ liệu vượt quá 2 dòng, hiển thị ba chấm […] ở cuối dòng thứ 2 và có tooltip hiển thị toàn bộ nội dung.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Tên mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Tên mẫu thông báo.</p></li>
<li><p>Hiển thị tối đa 2 dòng dữ liệu.</p></li>
<li><p>Nếu độ dài dữ liệu vượt quá 2 dòng, hiển thị ba chấm […] ở cuối dòng thứ 2 và có tooltip hiển thị toàn bộ nội dung.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Kênh thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Kênh thông báo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td>Trạng thái</td>
<td>Toggle</td>
<td>Input/Output</td>
<td style="text-align: left;">Theo dữ liệu bản ghi</td>
<td><ul>
<li><p>Hiển thị trạng thái hiện tại: <strong>Bật = Đang hoạt động; Tắt = Dừng hoạt động</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td>Tiêu đề mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Tiêu đề mẫu thông báo.</p></li>
<li><p>Hiển thị tối đa 2 dòng dữ liệu.</p></li>
<li><p>Nếu độ dài dữ liệu vượt quá 2 dòng, hiển thị ba chấm […] ở cuối dòng thứ 2 và có tooltip hiển thị toàn bộ nội dung.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td>Nội dung mẫu thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ol start="4" type="1">
<li><p>Hiển thị Nội dung mẫu thông báo.</p></li>
<li><p>Khu vực dữ liệu hiển thị tối đa 06 dòng tại một thời điểm. Trường hợp nội dung vượt quá 06 dòng, hệ thống cố định chiều cao vùng hiển thị tương ứng 06 dòng và hiển thị thanh cuộn dọc để người dùng xem toàn bộ nội dung.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
</ol></td>
</tr>
</tbody>
</table>

#### Luồng nghiệp vụ

<img src="media/image15.png" style="width:5.4375in;height:5.64583in" />

##### Mô tả luồng nghiệp vụ

##### 

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 90%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Bước</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Người dùng truy cập vào hệ thống.</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Người dùng chọn chức phân hệ Quản trị khoa học công nghệ -&gt; Quản lý thông báo -&gt; Mẫu thông báo -&gt; Click Mã mẫu thông báo</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;"><ul>
<li><p>Hệ thống gọi API lấy dữ liệu chi tiết Mẫu thông báo, nếu:<br />
Trường hợp hệ thống chưa có dữ liệu/Call API lấy dữ liệu có lỗi =&gt; Báo lỗi theo bước 4</p></li>
<li><p>Trường hợp hệ thống có dữ liệu/Call API lấy dữ liệu thành công: Hiển thị chi tiết Mẫu thông báo thành công =&gt; Thực hiện bước 5 </p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;"><ul>
<li><p>Trường hợp call API lấy dữ liệu có lỗi: Hiển thị toast message (TM)</p>
<ul>
<li><p>Trường hợp lỗi API trả về có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.63tehiyp9mpz"><u>TB010</u></a></p></li>
<li><p>Trường hợp lỗi API trả về không có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.5tq9z3q8dyug"><u>TB011</u></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Hệ thống Hiển thị pannel xem chi tiết</td>
</tr>
</tbody>
</table>

### Thêm mới mẫu thông báo

#### Thông tin chung chức năng

- Mã chức năng: UC-NOTI-03

- Mục đích: Cho phép người dùng tạo mới Mẫu thông báo trên hệ thống.

- Người dùng mục tiêu: Người dùng có quyền tạo Mẫu thông báo.

- Đường dẫn truy cập: Tại danh sách Mẫu thông báo, nhấn “Thêm mới”.

- Tiền điều kiện:

  - Người dùng đã đăng nhập và có quyền tạo mới.

  - Danh mục Kênh thông báo đã được hệ thống khởi tạo và sẵn sàng sử dụng.

- Hậu điều kiện:

  - Nếu lưu thành công, Mẫu thông báo mới được tạo và hiển thị trong danh sách quản lý.

  - Nếu dữ liệu không hợp lệ, hệ thống không tạo bản ghi và hiển thị lỗi.

- Requirements Traceability Matrix – RTM:

#### Màn hình

<img src="media/image20.png" style="width:9in;height:5.06944in" />

#### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">STT</th>
<th>Tên</th>
<th><p>Kiểu dữ liệu</p>
<p>[Độ dài dữ liệu]</p></th>
<th>Input/Output</th>
<th>Giá trị khởi tạo</th>
<th><strong>Mô tả</strong> (Mapping với API/CSDL nếu có)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Quay lại</td>
<td>Icon button</td>
<td>Input</td>
<td>N/a</td>
<td><ul>
<li><p>Khi chọn, điều hướng về màn hình Danh sách mẫu thông báo và giữ lại điều kiện lọc, từ khóa, trang hiện tại nếu còn trong cùng phiên điều hướng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Tiêu đề</td>
<td style="text-align: left;">TextView</td>
<td>Output</td>
<td>Tạo mới mẫu thông báo</td>
<td><ul>
<li><p>Hiển thị tiêu đề “Tạo mới mẫu thông báo”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Nút Hủy</td>
<td style="text-align: left;">Button</td>
<td>Input</td>
<td>Enable</td>
<td><ul>
<li><p>Khi nhấn:</p>
<ul>
<li><p>Nếu chưa thay đổi dữ liệu, quay về danh sách.</p></li>
<li><p>Nếu đã có thay đổi, hiển thị xác nhận bỏ dữ liệu. Không gọi API tạo mới.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Nút Lưu</td>
<td style="text-align: left;">Button</td>
<td>Input</td>
<td>Enable</td>
<td><ul>
<li><p>Khi nhấn: Validate toàn bộ trường, kiểm tra quyền, chống gửi lặp và gọi API tạo mới. Trong thời gian xử lý hiển thị loading và disable nút.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Mã mẫu thông báo *</td>
<td style="text-align: left;"><p>VARCHAR</p>
<p>[50]</p></td>
<td>Input</td>
<td>Placeholder “Nhập mã mẫu thông báo”</td>
<td><ul>
<li><p>Bắt buộc nhập.</p></li>
<li><p>Maxlength 50 ký tự</p></li>
<li><p>Kiểm tra duy nhất.</p></li>
<li><p>Nếu mã mẫu thông báo đã tồn tại hệ thống thông báo “Mã mẫu thông báo đã tồn tại trên hệ thống. Vui lòng nhập mã mẫu thông báo khác”.</p></li>
<li><p>Phải được chuẩn hóa về chữ in hoa. Khi người dùng nhập ký tự chữ thường, hệ thống tự động chuyển đổi thành chữ in hoa.</p></li>
<li><p>Khi rời trường nếu rỗng thì hiển thị thông báo inline Vui lòng nhập Mã mẫu thông báo.</p></li>
<li><p>Chỉ cho phép nhập chữ cái không dấu, chữ số và ký tự "-", "_".</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Không chứa khoảng trắng</p></li>
<li><p>Khi nhập quá 50 ký tự hệ thống chỉ nhận 50 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 50 ký tự hệ thống chỉ nhận 50 ký tự đầu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Tên mẫu thông báo *</td>
<td style="text-align: left;"><p>NVARCHAR</p>
<p>[255]</p></td>
<td>Input</td>
<td>Placeholder “Nhập tên mẫu thông báo”</td>
<td><ul>
<li><p>Bắt buộc nhập.</p></li>
<li><p>Maxlength 255 ký tự.</p></li>
<li><p>Khi rời trường nếu rỗng/toàn khoảng trắng thì hiển thị thông báo inline Vui lòng nhập Tên mẫu thông báo.</p></li>
<li><p>Chỉ cho phép nhập chữ cái, chữ cái có dấu, chữ số, ký tự "-","_" và khoảng trắng.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Khi nhập quá 255 ký tự hệ thống chỉ nhận 255 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 255 ký tự hệ thống chỉ nhận 255 ký tự đầu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td>Kênh thông báo</td>
<td>Dropdown</td>
<td>Input</td>
<td>Placeholder “Chọn kênh thông báo”</td>
<td><ul>
<li><p>Không nhập tự do.</p></li>
<li><p>Không bắt buộc chọn.</p></li>
<li><p>Hiển thị các kênh thông báo có trong hệ thống: Email, In-app, SMS.</p></li>
<li><p>Cho phép thay đổi lựa chọn.</p></li>
<li><p>Chỉ cho phép chọn 1 lựa chọn</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td><mark>Tiêu đề mẫu thông báo</mark></td>
<td>Textbox [255]</td>
<td>Input</td>
<td>Placeholder “Nhập tiêu đề mẫu thông báo”</td>
<td><ul>
<li><p>Maxlength 255 ký tự.</p></li>
<li><p>Cho phép nhập chữ cái, chữ cái có dấu, chữ số, ký tự đặc biệt và khoảng trắng.</p></li>
<li><p>Cho phép nhập tiêu đề và sử dụng biến dạng {{tenBien}}.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Khi nhập quá 500 ký tự hệ thống chỉ nhận 500 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 500 ký tự hệ thống chỉ nhận 500 ký tự đầu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td>Nội dung mẫu thông báo</td>
<td>Textarea [4000]</td>
<td>OutInputput</td>
<td>Placeholder “Nhập nội dung mẫu thông báo”</td>
<td><ul>
<li><p>Maxlength 4000 ký tự.</p></li>
<li><p>Cho phép nhập chữ cái, chữ cái có dấu, chữ số, ký tự đặc biệt và khoảng trắng.</p></li>
<li><p>Cho phép nhập tiêu đề và sử dụng biến dạng {{tenBien}}.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Khi nhập quá 4000 ký tự hệ thống chỉ nhận 4000 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 4000 ký tự hệ thống chỉ nhận 4000 ký tự đầu.</p></li>
<li><p>Khu vực dữ liệu hiển thị tối đa 05 dòng tại một thời điểm. Trường hợp nội dung vượt quá 05 dòng, hệ thống cố định chiều cao vùng hiển thị tương ứng 05 dòng và hiển thị thanh cuộn dọc để người dùng xem toàn bộ nội dung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">10</td>
<td>Biến hỗ trợ</td>
<td><mark>TextView</mark></td>
<td><mark>Output</mark></td>
<td><mark>Danh sách biến cấu hình</mark></td>
<td><ul>
<li><p>Hiển thị danh sách các biến động được hệ thống hỗ trợ để sử dụng trong Tiêu đề mẫu thông báo và Nội dung mẫu thông báo theo cú pháp {{tenBien}}, ví dụ: {{maHoSo}}, {{tenNhiemVu}}, {{tenBuoc}}, {{hanXuLy}}.</p></li>
<li><p>Danh sách chỉ đọc; người dùng không được thêm, sửa hoặc xóa biến tại màn hình này. Danh sách biến do Backend/API cung cấp từ cấu hình hệ thống.</p></li>
<li><p>Khi người dùng nhấn Lưu, hệ thống parse toàn bộ chuỗi có dạng {{...}} trong Tiêu đề/Nội dung và kiểm tra tên biến phải tồn tại trong danh sách Biến hỗ trợ. Nếu có biến không hợp lệ, không lưu Mẫu thông báo và hiển thị lỗi tại trường chứa biến.</p></li>
<li><p>Hệ thống chỉ lưu template có chứa {{tenBien}}; không thay thế biến tại thời điểm tạo/chỉnh sửa Mẫu thông báo.</p></li>
<li><p>Khi phát sinh thông báo, Backend nhận dữ liệu nghiệp vụ dạng key/value từ sự kiện, mapping theo tên biến và thay thế tất cả vị trí {{tenBien}} bằng giá trị thực tế trước khi gửi qua kênh thông báo.</p></li>
<li><p>Nếu template tham chiếu biến nhưng tại thời điểm gửi không có giá trị tương ứng, hệ thống ghi nhận lỗi render/gửi thông báo để phục vụ theo dõi; lỗi gửi thông báo không rollback nghiệp vụ chính đã hoàn thành.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Luồng nghiệp vụ

<img src="media/image18.png" style="width:5.95833in;height:5.39583in" />

##### Mô tả luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 90%" />
</colgroup>
<tbody>
<tr>
<td><strong>Bước</strong></td>
<td><strong>Chi tiết</strong></td>
</tr>
<tr>
<td>1</td>
<td>Người dùng click thao tác Thêm mới mẫu thông báo.</td>
</tr>
<tr>
<td>2</td>
<td>Hệ thống hiển thị màn hình Thêm mới mẫu thông báo</td>
</tr>
<tr>
<td>3</td>
<td>Người dùng sửa thông tin mẫu thông báo và nhấn <strong>Lưu lại</strong></td>
</tr>
<tr>
<td>4</td>
<td><p>Hệ thống kiểm tra dữ liệu, nếu:</p>
<ul>
<li><p>Trường hợp thiếu dữ liệu bắt buộc/Sai định dạng valid/Dữ liệu bị trùng lặp/Call API Thêm mới mẫu thông báo cho hệ thống có lỗi =&gt; Báo lỗi theo bước 5</p></li>
<li><p>Trường hợp đủ dữ liệu bắt buộc/Đúng định dạng valid/Dữ liệu không bị trùng lặp/Call API Thêm mới mẫu thông báo thành công =&gt; Thực hiện tiếp bước 6 &amp; 7</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td><p>Hiển thị thông báo lỗi cho người dùng:</p>
<ul>
<li><p>Trường hợp thiếu trường bắt buộc: Hiển thị inline message (IM) tại trường có lỗi <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.h0ec03rui7nz"><u>VL004</u></a></p></li>
<li><p>Trường hợp Sai định dạng valid: Hiển thị IM tại trường có lỗi <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.bi59v1uau7gj"><u>VL006</u></a></p></li>
<li><p>Trường hợp Dữ liệu bị trùng lặp: Hiển thị IM tại trường có lỗi <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.39505igjb0tt"><u>VL007</u></a></p></li>
<li><p>Trường hợp call API lấy dữ liệu có lỗi: Hiển thị toast message (TM)</p>
<ul>
<li><p>Trường hợp lỗi API trả về có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.63tehiyp9mpz"><u>TB010</u></a></p></li>
<li><p>Trường hợp lỗi API trả về không có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.5tq9z3q8dyug"><u>TB011</u></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Trường hợp sửa người dùng thành công: Hệ thống lưu và cập nhật danh sách mẫu thông báo</td>
</tr>
<tr>
<td>7</td>
<td><p>Hệ thống hiển thị Informing Message (IM) <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.n3t91hso8d2c"><u>TB09</u></a>.</p>
<p>Đóng giao diện Thêm mới mẫu thông báo điều hướng về màn danh sách mẫu thông báo và tự động refresh màn danh sách và hiển thị danh sách mẫu thông báo.</p></td>
</tr>
</tbody>
</table>

### Chỉnh sửa mẫu thông báo

#### Thông tin chung chức năng

- Mã chức năng: UC-NOTI-04

- Mục đích: Cho phép cập nhật thông tin của Mẫu thông báo đã tồn tại.

- Người dùng mục tiêu: Người dùng có quyền chỉnh sửa Mẫu thông báo.

- Trigger: Tại danh sách hoặc màn hình chi tiết, nhấn “Chỉnh sửa”.

- Tiền điều kiện:

  - Bản ghi tồn tại.

  - Người dùng có quyền chỉnh sửa.

- Hậu điều kiện:

  - Thông tin Mẫu thông báo được cập nhật nếu dữ liệu hợp lệ.

  - Nếu lỗi, dữ liệu cũ không bị thay đổi.

- Requirements Traceability Matrix – RTM: N/a

#### Màn hình

> <img src="media/image19.png" style="width:9in;height:5.06944in" />

#### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 43%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">STT</th>
<th>Tên</th>
<th><p>Kiểu dữ liệu</p>
<p>[Độ dài dữ liệu]</p></th>
<th>Input/Output</th>
<th>Giá trị khởi tạo</th>
<th><strong>Mô tả</strong> (Mapping với API/CSDL nếu có)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Quay lại</td>
<td>Icon button</td>
<td>Input</td>
<td>N/a</td>
<td><ul>
<li><p>Khi chọn, điều hướng về màn hình Danh sách mẫu thông báo và giữ lại điều kiện lọc, từ khóa, trang hiện tại nếu còn trong cùng phiên điều hướng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Tiêu đề</td>
<td style="text-align: left;">TextView</td>
<td>Output</td>
<td>Tạo mới mẫu thông báo</td>
<td><ul>
<li><p>Hiển thị tiêu đề “Tạo mới mẫu thông báo”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Nút Hủy</td>
<td style="text-align: left;">Button</td>
<td>Input</td>
<td>Enable</td>
<td><ul>
<li><p>Khi nhấn:</p>
<ul>
<li><p>Nếu chưa thay đổi dữ liệu, quay về danh sách.</p></li>
<li><p>Nếu đã có thay đổi, hiển thị xác nhận bỏ dữ liệu. Không gọi API tạo mới.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Nút Lưu</td>
<td style="text-align: left;">Button</td>
<td>Input</td>
<td>Enable</td>
<td><ul>
<li><p>Khi nhấn: Validate toàn bộ trường, kiểm tra quyền, chống gửi lặp và gọi API chỉnh sửa. Trong thời gian xử lý hiển thị loading và disable nút.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Mã mẫu thông báo *</td>
<td style="text-align: left;"><p>VARCHAR</p>
<p>[50]</p></td>
<td>Input</td>
<td>Placeholder “Nhập mã mẫu thông báo”</td>
<td><ul>
<li><p>Hiển thị Mã mẫu thông báo</p></li>
<li><p>Bắt buộc nhập.</p></li>
<li><p>Maxlength 50 ký tự</p></li>
<li><p>Kiểm tra duy nhất.</p></li>
<li><p>Nếu mã vai đã tồn tại hệ thống thông báo “Mã mẫu thông báo đã tồn tại trên hệ thống. Vui lòng nhập mã mẫu thông báo khác”.</p></li>
<li><p>Phải được chuẩn hóa về chữ in hoa. Khi người dùng nhập ký tự chữ thường, hệ thống tự động chuyển đổi thành chữ in hoa.</p></li>
<li><p>Khi rời trường nếu rỗng thì hiển thị thông báo inline Vui lòng nhập Mã mẫu thông báo.</p></li>
<li><p>Chỉ cho phép nhập chữ cái không dấu, chữ số và ký tự "-", "_".</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Không chứa khoảng trắng</p></li>
<li><p>Khi nhập quá 50 ký tự hệ thống chỉ nhận 50 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 50 ký tự hệ thống chỉ nhận 50 ký tự đầu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Tên mẫu thông báo *</td>
<td style="text-align: left;"><p>NVARCHAR</p>
<p>[255]</p></td>
<td>Input</td>
<td>Placeholder “Nhập tên mẫu thông báo”</td>
<td><ul>
<li><p>Hiển thị Tên mẫu thông báo</p></li>
<li><p>Bắt buộc nhập.</p></li>
<li><p>Maxlength 255 ký tự.</p></li>
<li><p>Khi rời trường nếu rỗng/toàn khoảng trắng thì hiển thị thông báo inline Vui lòng nhập Tên mẫu thông báo.</p></li>
<li><p>Chỉ cho phép nhập chữ cái, chữ cái có dấu, chữ số, ký tự "-","_" và khoảng trắng.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Khi nhập quá 255 ký tự hệ thống chỉ nhận 255 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 255 ký tự hệ thống chỉ nhận 255 ký tự đầu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td>Kênh thông báo</td>
<td>Dropdown</td>
<td>Input</td>
<td>Placeholder “Chọn kênh thông báo”</td>
<td><ul>
<li><p>Hiển thị kênh thông báo</p></li>
<li><p>Không nhập tự do.</p></li>
<li><p>Không bắt buộc chọn.</p></li>
<li><p>Hiển thị các kênh thông báo có trong hệ thống: Email, In-app.</p></li>
<li><p>Cho phép thay đổi lựa chọn.</p></li>
<li><p>Chỉ cho phép chọn 1 lựa chọn</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td><mark>Tiêu đề mẫu thông báo</mark></td>
<td>Textbox [255]</td>
<td>Input</td>
<td>Placeholder “Nhập tiêu đề mẫu thông báo”</td>
<td><ul>
<li><p>Hiển thị Tiêu đề mẫu thông báo</p></li>
<li><p>Maxlength 255 ký tự.</p></li>
<li><p>Cho phép nhập chữ cái, chữ cái có dấu, chữ số, ký tự đặc biệt và khoảng trắng.</p></li>
<li><p>Cho phép nhập tiêu đề và sử dụng biến dạng {{tenBien}}.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Khi nhập quá 500 ký tự hệ thống chỉ nhận 500 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 500 ký tự hệ thống chỉ nhận 500 ký tự đầu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td>Nội dung mẫu thông báo</td>
<td>Textarea [4000]</td>
<td>OutInputput</td>
<td>Placeholder “Nhập nội dung mẫu thông báo”</td>
<td><ul>
<li><p>Hiển thị Nội dung mẫu thông báo</p></li>
<li><p>Maxlength 4000 ký tự.</p></li>
<li><p>Cho phép nhập chữ cái, chữ cái có dấu, chữ số, ký tự đặc biệt và khoảng trắng.</p></li>
<li><p>Cho phép nhập tiêu đề và sử dụng biến dạng {{tenBien}}.</p></li>
<li><p>Không cho phép nhập hoặc thực thi nội dung Script.</p></li>
<li><p>Khi nhập quá 4000 ký tự hệ thống chỉ nhận 4000 ký tự đầu và không cho người dùng nhập thêm.</p></li>
<li><p>Paste 1 đoạn dài hơn 4000 ký tự hệ thống chỉ nhận 4000 ký tự đầu.</p></li>
<li><p>Khu vực dữ liệu hiển thị tối đa 05 dòng tại một thời điểm. Trường hợp nội dung vượt quá 05 dòng, hệ thống cố định chiều cao vùng hiển thị tương ứng 05 dòng và hiển thị thanh cuộn dọc để người dùng xem toàn bộ nội dung.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">10</td>
<td>Biến hỗ trợ</td>
<td><mark>TextView</mark></td>
<td><mark>Output</mark></td>
<td><mark>Danh sách biến cấu hình</mark></td>
<td><ul>
<li><p>Hiển thị danh sách các biến động được hệ thống hỗ trợ để sử dụng trong Tiêu đề mẫu thông báo và Nội dung mẫu thông báo theo cú pháp {{tenBien}}, ví dụ: {{maHoSo}}, {{tenNhiemVu}}, {{tenBuoc}}, {{hanXuLy}}.</p></li>
<li><p>Danh sách chỉ đọc; người dùng không được thêm, sửa hoặc xóa biến tại màn hình này. Danh sách biến do Backend/API cung cấp từ cấu hình hệ thống.</p></li>
<li><p>Khi người dùng nhấn Lưu, hệ thống parse toàn bộ chuỗi có dạng {{...}} trong Tiêu đề/Nội dung và kiểm tra tên biến phải tồn tại trong danh sách Biến hỗ trợ. Nếu có biến không hợp lệ, không lưu Mẫu thông báo và hiển thị lỗi tại trường chứa biến.</p></li>
<li><p>Hệ thống chỉ lưu template có chứa {{tenBien}}; không thay thế biến tại thời điểm tạo/chỉnh sửa Mẫu thông báo.</p></li>
<li><p>Khi phát sinh thông báo, Backend nhận dữ liệu nghiệp vụ dạng key/value từ sự kiện, mapping theo tên biến và thay thế tất cả vị trí {{tenBien}} bằng giá trị thực tế trước khi gửi qua kênh thông báo.</p></li>
<li><p>Nếu template tham chiếu biến nhưng tại thời điểm gửi không có giá trị tương ứng, hệ thống ghi nhận lỗi render/gửi thông báo để phục vụ theo dõi; lỗi gửi th</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Luồng nghiệp vụ

<img src="media/image26.png" style="width:4.21497in;height:5.50729in" />

##### Mô tả luồng nghiệp vụ

<table style="width:100%;">
<colgroup>
<col style="width: 7%" />
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><strong>Bước</strong></td>
<td><strong>Chi tiết</strong></td>
</tr>
<tr>
<td>1</td>
<td>Người dùng click thao tác Sửa mẫu thông báo tại màn hình Danh sách mẫu thông báo.</td>
</tr>
<tr>
<td>2</td>
<td><p>Hệ thống hiển thị màn hình Sửa mẫu thông báo.</p>
<p>Cho phép Người dùng Chỉnh sửa thông tin mẫu thông báo </p></td>
</tr>
<tr>
<td>3</td>
<td>Người dùng sửa thông tin mẫu thông báo và nhấn <strong>Lưu lại</strong></td>
</tr>
<tr>
<td>4</td>
<td><p>Hệ thống kiểm tra dữ liệu, nếu:</p>
<ul>
<li><p>Trường hợp thiếu dữ liệu bắt buộc/Sai định dạng valid/Dữ liệu bị trùng lặp/Call API Sửa mẫu thông báo cho hệ thống có lỗi =&gt; Báo lỗi theo bước 5</p></li>
<li><p>Trường hợp đủ dữ liệu bắt buộc/Đúng định dạng valid/Dữ liệu không bị trùng lặp/Call API Sửa mẫu thông báo thành công: Sửa mẫu thông báo thành công =&gt; Thực hiện tiếp bước 6 &amp; 7</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td><p>Hiển thị thông báo lỗi cho người dùng:</p>
<ul>
<li><p>Trường hợp thiếu trường bắt buộc: Hiển thị inline message (IM) tại trường có lỗi <a href="https://docs.google.com/document/d/1Oanmc5FRe3ywz1IWJdtlzgrX-SYR04GV/edit#bookmark=id.sufzmvru8740"><u>VL004</u></a></p></li>
<li><p>Trường hợp Sai định dạng valid: Hiển thị IM tại trường có lỗi <a href="https://docs.google.com/document/d/1Oanmc5FRe3ywz1IWJdtlzgrX-SYR04GV/edit#bookmark=id.2gn8pr9zatwx"><u>VL006</u></a></p></li>
<li><p>Trường hợp Dữ liệu bị trùng lặp: Hiển thị IM tại trường có lỗi <a href="https://docs.google.com/document/d/1Oanmc5FRe3ywz1IWJdtlzgrX-SYR04GV/edit#bookmark=id.uwl72n1nks67"><u>VL007</u></a></p></li>
<li><p>Trường hợp call API lấy dữ liệu có lỗi: Hiển thị toast message (TM)</p>
<ul>
<li><p>Trường hợp lỗi API trả về có message: Hiện <a href="https://docs.google.com/document/d/1Oanmc5FRe3ywz1IWJdtlzgrX-SYR04GV/edit#bookmark=id.778qgthbiiml"><u>TB010</u></a></p></li>
</ul>
<ul>
<li><p>Trường hợp lỗi API trả về không có message: Hiện <a href="https://docs.google.com/document/d/1Oanmc5FRe3ywz1IWJdtlzgrX-SYR04GV/edit#bookmark=id.ni5ftz23zvo6"><u>TB011</u></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Trường hợp Sửa mẫu thông báo thành công: Hệ thống lưu và cập nhật danh sách người dùng</td>
</tr>
<tr>
<td>7</td>
<td><p>Hệ thống hiển thị Informing Message (IM) <a href="https://docs.google.com/document/d/1Oanmc5FRe3ywz1IWJdtlzgrX-SYR04GV/edit#bookmark=id.hgsxw2wk8yfh"><u>TB09</u></a>.</p>
<p>Đóng giao diện Sửa mẫu thông báo điều hướng về màn danh sách người dùng và tự động refresh màn danh sách và hiển thị danh sách mẫu thông báo.</p></td>
</tr>
</tbody>
</table>

### Xóa mẫu thông báo

#### Thông tin chung chức năng

- Mã chức năng: UC-NOTI-05

- Mục đích: Cho phép người dùng xóa Mẫu thông báo theo quyền và xác nhận trước khi thực hiện.

- Người dùng mục tiêu: Người dùng có quyền xóa Mẫu thông báo.

- Đường dẫn truy cập: Tại danh sách Mẫu thông báo, nhấn biểu tượng Xóa.

- Tiền điều kiện:

  - Bản ghi Mẫu thông báo tồn tại.

  - Người dùng có quyền xóa.

- Hậu điều kiện:

  - Nếu xóa thành công, bản ghi không còn trong danh sách quản lý.

  - Nếu Backend từ chối xóa, dữ liệu được giữ nguyên và hiển thị nội dung lỗi trả về.

- Requirements Traceability Matrix – RTM:

#### Màn hình

<img src="media/image24.png" style="width:4.20833in;height:2.70833in" />

#### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 8%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 25%" />
<col style="width: 37%" />
</colgroup>
<thead>
<tr>
<th>STT</th>
<th>Tên</th>
<th><p>Kiểu dữ liệu </p>
<p>[Độ dài dữ liệu]</p></th>
<th>Input/Output</th>
<th>Giá trị khởi tạo</th>
<th><strong>Mô tả</strong> (Mapping với API/CSDL nếu có)</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Biểu tượng xóa</td>
<td>Icon</td>
<td>Output</td>
<td>Hiển thị Icon</td>
<td><ul>
<li><p>Biểu tượng minh họa thao tác xóa.</p></li>
</ul></td>
</tr>
<tr>
<td>2</td>
<td>Tiêu đề popup</td>
<td>TextView</td>
<td>Output</td>
<td>“Bạn có chắc chắn muốn xóa không?”</td>
<td><ul>
<li><p>Hiển thị tiêu đề “Bạn có chắc chắn muốn xóa không?”.</p></li>
</ul></td>
</tr>
<tr>
<td>3</td>
<td>Nội dung cảnh báo</td>
<td>TextView</td>
<td>Output</td>
<td>“Bạn có chắc chắn muốn xóa mẫu thông báo: [Tên mẫu thông báo] - [Mã mẫu thông báo] không?”</td>
<td><ul>
<li><p>Hiển thị theo mẫu: “Bạn có chắc chắn muốn xóa mẫu thông báo: [Tên mẫu thông báo] - [Mã mẫu thông báo] không?”</p></li>
</ul></td>
</tr>
<tr>
<td>4</td>
<td>Hủy bỏ</td>
<td>Button</td>
<td>Input</td>
<td>Enable</td>
<td><ul>
<li><p>Đóng popup, hủy toàn bộ dữ liệu vừa nhập, không gọi API và không xóa người dùng.</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td>Xóa</td>
<td>Button</td>
<td>Input</td>
<td>Enable</td>
<td><ul>
<li><p>Khi click: kiểm tra lại quyền, disable nút để chống double-click, gọi API xóa. </p></li>
<li><p>Khi thành công đóng popup, thông báo thành công và tải lại danh sách. </p></li>
<li><p>Khi lỗi giữ popup và hiển thị thông báo phù hợp.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Luồng nghiệp vụ

<img src="media/image21.png" style="width:4.12384in;height:5.39271in" />

##### Mô tả luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 7%" />
<col style="width: 92%" />
</colgroup>
<tbody>
<tr>
<td><strong>Bước</strong></td>
<td><strong>Chi tiết</strong></td>
</tr>
<tr>
<td>1</td>
<td>Người dùng click button xóa mẫu thông báo tại màn hình danh sách mẫu thông báo.</td>
</tr>
<tr>
<td>2</td>
<td>Hệ thống hiển thị popup xóa mẫu thông báo</td>
</tr>
<tr>
<td>3</td>
<td>Người dùng Xác nhận xóa mẫu thông báo</td>
</tr>
<tr>
<td>4</td>
<td><p>Hệ thống kiểm tra dữ liệu, nếu:</p>
<ul>
<li><p>Người dùng đã có hoạt động liên kết/Call API lấy dữ liệu bị lỗi =&gt; Báo lỗi theo bước 5</p></li>
<li><p>Người dùng không có hoạt động liên kết/Call API lấy dữ liệu thành công: xóa mẫu thông báo thành công =&gt; Thực hiện tiếp bước 6 &amp; 7</p></li>
</ul></td>
</tr>
<tr>
<td>5</td>
<td><p>Hiển thị thông báo lỗi cho người dùng:</p>
<ul>
<li><p>Trường hợp call API lấy dữ liệu có lỗi: Hiển thị toast message (TM)</p>
<ul>
<li><p>Trường hợp lỗi API trả về có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.63tehiyp9mpz"><u>TB010</u></a></p></li>
</ul>
<ul>
<li><p>Trường hợp lỗi API trả về không có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.5tq9z3q8dyug"><u>TB011</u></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td>6</td>
<td>Trường hợp xóa mẫu thông báo thành công: Hệ thống xóa mẫu thông báo và cập nhật danh sách mẫu thông báo</td>
</tr>
<tr>
<td>7</td>
<td><p>Hệ thống hiển thị Informing Message (IM) <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.n3t91hso8d2c"><u>TB009</u></a>.</p>
<p>Đóng giao diện xóa người dùng, điều hướng về màn danh sách mẫu thông báo tự động refresh màn danh sách mẫu thông báo và hiển thị danh sách mẫu thông báo mới nhất</p></td>
</tr>
</tbody>
</table>

### Kênh thông báo

#### Thông tin chung chức năng

- Mã chức năng: <span class="mark"></span>UC-NOTI-06

- Mục đích: <span class="mark"></span>Cho phép quản trị viên xem thông tin cấu hình và bật/tắt các kênh Email và App được hiển thị trên màn hình Kênh thông báo.

- Người dùng mục tiêu: <span class="mark"></span>Quản trị viên được cấp quyền cấu hình Kênh thông báo.

- Đường dẫn truy cập: Người dùng truy cập Quản lý thông báo -\> Kênh.

- Tiền điều kiện:

  - Người dùng đã đăng nhập và có quyền.

  - Hệ thống đã có cấu hình kênh Email và App.

- Hậu điều kiện:

  - Trạng thái kênh được cập nhật khi thao tác thành công.

  - Thông tin cấu hình kỹ thuật nhạy cảm không được hiển thị công khai trên giao diện.

- Requirements Traceability Matrix – RTM:

#### Màn hình

<img src="media/image25.png" style="width:9in;height:5.06944in" />

#### Mô tả chi tiết các thành phần

<table style="width:100%;">
<colgroup>
<col style="width: 6%" />
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">STT</th>
<th>Tên</th>
<th><p>Kiểu dữ liệu</p>
<p>[Độ dài dữ liệu]</p></th>
<th>Input/Output</th>
<th style="text-align: left;">Giá trị khởi tạo</th>
<th><strong>Mô tả</strong> (Mapping với API/CSDL nếu có)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Tiêu đề Kênh thông báo</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">“Kênh thông báo”</td>
<td><ul>
<li><p>Hiển thị tiêu đề khu vực bảng dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Tên kênh thông báo + trạng thái</td>
<td>TextView</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị Tên kênh thông báo + Trạng thái.</p></li>
<li><p>Nếu trường không có dữ liệu hiển thị “-”</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Trạng thái</td>
<td>Toggle</td>
<td>Input/Output</td>
<td style="text-align: left;">Theo dữ liệu bản ghi</td>
<td><ul>
<li><p>Hiển thị trạng thái hiện tại: <strong>Bật = Đang hoạt động; Tắt = Dừng hoạt động</strong>. Việc thay đổi trạng thái áp dụng theo <strong>Bật/Tắt trạng thái dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Thông tin</td>
<td>Label</td>
<td>Output</td>
<td style="text-align: left;">Theo dữ liệu trả về từ API</td>
<td><ul>
<li><p>Hiển thị thông tị cấu hình của kênh thông báo</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Luồng nghiệp vụ

<img src="media/image23.png" style="width:5.02582in;height:5.29896in" />

##### Mô tả luồng nghiệp vụ

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 90%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Bước</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Người dùng truy cập vào hệ thống.</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Người dùng chọn chức phân hệ Khoa học công nghệ -&gt; Quản lý thông báo -&gt; Kênh.</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;"><ul>
<li><p>Hệ thống gọi API lấy dữ liệu danh sách danh sách kênh thông báo, nếu:<br />
Trường hợp hệ thống chưa có dữ liệu/Call API lấy dữ liệu có lỗi =&gt; Báo lỗi theo bước 4</p></li>
<li><p>Trường hợp hệ thống có dữ liệu/Call API lấy dữ liệu thành công: Hiển thị danh sách kênh thông báo thành công =&gt; Thực hiện bước 5 </p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;"><ul>
<li><p>Trường hợp call API lấy dữ liệu có lỗi: Hiển thị toast message (TM)</p>
<ul>
<li><p>Trường hợp lỗi API trả về có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.63tehiyp9mpz"><u>TB010</u></a></p></li>
<li><p>Trường hợp lỗi API trả về không có message: Hiện <a href="https://docs.google.com/document/d/12NYXZ7-4WAvmnk_XtqIfl60CKCvYgkm2c8Hxyy54exc/edit?tab=t.0#bookmark=kix.5tq9z3q8dyug"><u>TB011</u></a></p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Hệ thống trả về và danh sách kênh thông báo.</td>
</tr>
</tbody>
</table>

### THIẾT KẾ CHI TIẾT JOB TỰ ĐỘNG QUÉT VÀ GỬI THÔNG BÁO (JOB_NOTI_DISPATCHER) 

#### TỔNG QUAN TÍNH NĂNG & DỊCH VỤ THÔNG BÁO 

1.  Mục đích và Ý nghĩa Nghiệp vụ:

Hệ thống Quản trị KHCN triển khai Dịch vụ xử lý thông báo tự động (Notification Dispatcher Job) nhằm thông báo và nhắc nhở công việc đến hạn cho người dùng.

2.  Kênh phát thông báo hỗ trợ:

Mỗi thông báo nghiệp vụ được gửi đồng thời qua các kênh đang bật:\
• **Email (SMTP):** Gửi thông báo đến hòm thư cá nhân.\
• **In-app (Web Portal):** Hiển thị thông báo, số tin chưa đọc và liên kết điều hướng.

3.  Phân loại 02 Khung giờ & Cơ chế gửi thông báo:

| Phân loại cơ chế | Thời điểm / Giờ gửi | Bản chất nghiệp vụ & Ví dụ ứng dụng |
|:--:|:--:|----|
| Gửi tức thì (Realtime Dispatcher) | Ngay lập tức khi phát sinh sự kiện | Kích hoạt tức thời khi có hành động trên hệ thống. Ví dụ: Vừa giao việc mới, vừa nhận kết quả VOffice, hoặc vừa có quyết định Dừng nhiệm vụ. |
| Quét định kỳ (Nightly Job 00:00 AM) | Chạy ẩn lúc 00:00 sáng hàng ngày | Chạy tự động mỗi sáng để rà soát danh sách công việc sắp đến hạn, công việc đã quá hạn hoặc các nhiệm vụ đến thời gian mở lại sau tạm dừng. |

4.  BẢNG TỔNG HỢP & ĐẶC TẢ CHI TIẾT 6 TRƯỜNG HỢP THÔNG BÁO

    1.  Bảng tổng hợp chi tiết 6 trường hợp thông báo

Bảng dưới đây tổng hợp chi tiết 6 trường hợp thông báo hệ thống được thiết kế theo góc nhìn nghiệp vụ người dùng, giúp BA, Tester và Đội ngũ Phát triển dễ dàng đối soát từng thông số gửi:

<table style="width:100%;">
<colgroup>
<col style="width: 7%" />
<col style="width: 23%" />
<col style="width: 16%" />
<col style="width: 14%" />
<col style="width: 16%" />
<col style="width: 21%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">STT</th>
<th style="text-align: center;">Loại &amp; Sự kiện thông báo</th>
<th style="text-align: center;">Đối tượng nhận</th>
<th style="text-align: center;">Thời điểm / Giờ gửi</th>
<th style="text-align: center;">Tiêu đề &amp; Nội dung mẫu (Nghiệp vụ)</th>
<th style="text-align: center;">Kết quả &amp; Hành động (Button CTA)</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Giao việc mới<br />
(TASK_CREATED)</td>
<td>Người/Nhóm xử lý User Task</td>
<td style="text-align: center;">Gửi ngay khi phát sinh công việc (Realtime)</td>
<td>Tiêu đề: Bạn có công việc mới cần xử lý<br />
Nội dung: Hồ sơ [Mã hồ sơ] - [Tên nhiệm vụ] đang chờ bạn thực hiện bước [Tên bước]. Hạn xử lý: [Hạn xử lý].</td>
<td>Nút: Xử lý ngay<br />
Đường dẫn: /my-tasks/[taskId]</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Nhắc việc sắp đến hạn<br />
(TASK_DUE_SOON)</td>
<td>Người đang chịu trách nhiệm task</td>
<td style="text-align: center;">Gửi lúc 00:00 sáng trước 01 ngày đến hạn</td>
<td>Tiêu đề: Công việc sắp đến hạn<br />
Nội dung: Công việc [Tên bước] của hồ sơ [Mã hồ sơ] sẽ đến hạn vào [Hạn xử lý].</td>
<td>Nút: Xử lý ngay<br />
Đường dẫn: /my-tasks/[taskId]</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Cảnh báo quá hạn<br />
(TASK_OVERDUE)</td>
<td>Người xử lý &amp; Cấp quản lý (nếu có)</td>
<td style="text-align: center;">Gửi lúc 00:00 sáng ngày sau; lặp lại 00:00 sáng Thứ 2 hàng tuần</td>
<td>Tiêu đề: Công việc đã quá hạn<br />
Nội dung: Công việc [Tên bước] của hồ sơ [Mã hồ sơ] đã quá hạn [Số thời gian].</td>
<td>Nút: Xử lý ngay<br />
Đường dẫn: /my-tasks/[taskId]</td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Trạng thái VOffice<br />
(VO_STATUS_UPDATED)</td>
<td>Người trình ký &amp; Người liên quan</td>
<td style="text-align: center;">Ký thành công (Hoàn thành)</td>
<td>Tiêu đề: Văn bản trình ký VOffice đã hoàn thành ký duyệt<br />
Nội dung: Văn bản [Tên văn bản] của hồ sơ [Mã hồ sơ] đã được ký duyệt thành công trên VOffice</td>
<td>Nút: Xem văn bản<br />
Đường dẫn: /dossiers/[dossierId]</td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Đến hạn mở lại Nhiệm vụ<br />
(MISSION_RESUME_DUE)</td>
<td>PM, Chuyên quản KCL, TCKT, NS, MS</td>
<td style="text-align: center;">Gửi lúc 00:00 sáng ngày đến hạn mở lại (chỉ gửi 1 lần)</td>
<td>Tiêu đề: Nhiệm vụ đã đến thời gian mở lại<br />
Nội dung: Nhiệm vụ [Tên nhiệm vụ] đã đến thời gian mở lại theo thời gian tạm dừng được phê duyệt: [Thời gian mở lại]. Vui lòng kiểm tra...</td>
<td>Nút: Xem nhiệm vụ<br />
Đường dẫn: /missions/[missionId]</td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Nhiệm vụ đã dừng<br />
(MISSION_STOPPED)</td>
<td>PM &amp; Các bên liên quan</td>
<td style="text-align: center;">Gửi ngay khi Hồ sơ dừng nhiệm vụ hoàn thành (Realtime)</td>
<td>Tiêu đề: Nhiệm vụ đã dừng thực hiện<br />
Nội dung: Nhiệm vụ [Tên nhiệm vụ] đã được phê duyệt dừng thực hiện.</td>
<td>Nút: Xem nhiệm vụ<br />
Đường dẫn: /missions/[missionId]</td>
</tr>
</tbody>
</table>

2.  Mô tả chi tiết từng Trường hợp Thông báo

<img src="media/image22.png" style="width:4.35417in;height:5.23897in" />

Màn hình thông báo chuông In-app

<img src="media/image7.png" style="width:9in;height:2.83333in" />

Màn hình thông báo Email

1.  Trường hợp 1: Thông báo Công việc mới (TASK_CREATED)

Mục đích: Thông báo cho cán bộ ngay khi quy trình trên Camunda tiến đến task mới được phân công và hiển thị trong danh sách Việc của tôi trên hệ thống.\
Thời điểm bắn: Tức thì (Realtime) khi bước User Task khởi tạo thành công.\
Đối tượng nhận: Cán bộ được gán đích danh (Assignee) hoặc nhóm cán bộ thụ lý (Candidate Group).\
Giao diện hiển thị:\
• Tiêu đề Mail & In-app: Bạn có công việc mới cần xử lý\
• Nội dung: Hồ sơ HS-2026-KHCN-001 - Nghiên cứu công nghệ 5G/6G đang chờ bạn thực hiện bước Thẩm định TCKT. Hạn xử lý: 25/10/2026 17:00.\
• Nút bấm (CTA): Bấm nút 'Xử lý ngay' hệ thống chuyển sang trang làm việc /my-tasks/\[taskId\].

2.  Trường hợp 2: Thông báo Nhắc việc sắp đến hạn (TASK_DUE_SOON)

Mục đích: Đôn đốc cán bộ hoàn thành công việc đúng tiến độ, tránh phát sinh quá hạn.\
Thời điểm bắn: Quét định kỳ chạy vào 00:00 sáng trước ngày đến hạn 01 ngày.

Dữ liệu hạn hoàn thành (Due Date) được lấy trực tiếp từ cấu hình thời hạn của từng bước công việc (User Task) trên quy trình Camunda.

<img src="media/image3.png" style="width:2.31771in;height:4.70981in" />

Cấu hình Due Date trên Camunda 8.9 (ISO 8601 / Biểu thức FEEL):\
• 1 ngày: = now() + duration("P1D")\
• 3 ngày: = now() + duration("P3D")\
• 12 giờ: = now() + duration("PT12H")\
• 2 tuần: = now() + duration("P2W")\
• Kết hợp ngày và giờ (1 ngày 2 giờ): = now() + duration("P1DT2H")\
Đối tượng nhận: Cán bộ đang chịu trách nhiệm xử lý công việc.\
Giao diện hiển thị:\
• Tiêu đề Mail & In-app: Công việc sắp đến hạn\
• Nội dung: Công việc Thẩm định TCKT của hồ sơ HS-2026-KHCN-001 sẽ đến hạn vào 25/10/2026 17:00.\
• Nút bấm (CTA): Bấm nút 'Xử lý ngay' điều hướng tới /my-tasks/\[taskId\].

3.  Trường hợp 3: Cảnh báo Công việc đã quá hạn (TASK_OVERDUE)

Mục đích: Cảnh báo các công việc chậm trễ tiến độ để cán bộ gỡ vướng và quản lý giám sát.\
Thời điểm bắn: Quét 00:00 sáng ngày hôm sau khi quá hạn. Tiếp tục lặp lại 00:00 sáng Thứ 2 hàng tuần cho đến khi task hoàn thành.\
Đối tượng nhận: Cán bộ xử lý task và Cấp quản lý trực tiếp (nếu có cấu hình).\
Giao diện hiển thị:\
• Tiêu đề Mail & In-app: Công việc đã quá hạn\
• Nội dung: Công việc Thẩm định TCKT của hồ sơ HS-2026-KHCN-001 đã quá hạn 03 ngày 05 giờ.\
• Nút bấm (CTA): Bấm 'Xử lý ngay' điều hướng tới /my-tasks/\[taskId\].\
Ràng buộc đặc biệt: Nếu tài khoản người nhận ở trạng thái nghỉ việc/khóa tài khoản, hệ thống tự động ngừng gửi thông báo.

4.  Trường hợp 4: Thông báo Trạng thái VOffice (VO_STATUS_UPDATED)

Mục đích: Phản hồi kết quả trình ký văn bản từ hệ thống VOffice Tập đoàn.\
Thời điểm bắn: Tức thì (Realtime) khi nhận callback cập nhật trạng thái từ VOffice.\
Đối tượng nhận: Người trình ký văn bản và các nhân sự liên quan trong hồ sơ.\
Giao diện hiển thị:\
• Tiêu đề Mail & In-app: Trạng thái trình ký VOffice\
• Nội dung: Tờ trình phê duyệt chủ trương của hồ sơ HS-2026-KHCN-001 đã cập nhật trạng thái trên VOffice: Đã ký duyệt ban hành.\
• Nút bấm (CTA): Bấm 'Xem văn bản' điều hướng tới trang hồ sơ /dossiers/\[dossierId\].

5.  Trường hợp 5: Nhắc đến thời gian mở lại Nhiệm vụ (MISSION_RESUME_DUE)

Mục đích: Nhắc nhở ban quản lý và chuyên quản về thời hạn khôi phục nhiệm vụ sau thời gian tạm dừng được phê duyệt (RD04).\
Thời điểm bắn: Quét 00:00 sáng đúng ngày đến hạn mở lại. Chỉ gửi 01 lần duy nhất.\
Đối tượng nhận: PM (Chủ nhiệm đề tài), Chuyên quản CL_KHCN, TCKT, NS, MS.\
Giao diện hiển thị:\
• Tiêu đề Mail & In-app: Nhiệm vụ đã đến thời gian mở lại\
• Nội dung: Nhiệm vụ Nghiên cứu công nghệ 5G/6G đã đến thời gian mở lại theo thời gian tạm dừng được phê duyệt: 01/11/2026. Vui lòng kiểm tra và thực hiện các công việc tiếp theo.\
• Nút bấm (CTA): Bấm 'Xem nhiệm vụ' điều hướng tới /missions/\[missionId\].\
Ràng buộc nghiệp vụ: Đến thời gian mở lại chỉ gửi thông báo nhắc nhở, KHÔNG tự động chuyển trạng thái nhiệm vụ nếu quy trình chưa định nghĩa tự động mở lại.

6.  Trường hợp 6: Thông báo Nhiệm vụ đã dừng thực hiện (MISSION_STOPPED)

Mục đích: Thông báo dừng nhiệm vụ KHCN Hồ sơ dừng nhiệm vụ hoàn thành .\
Thời điểm bắn: Tức thì (Realtime) khi hồ sơ dừng nhiệm vụ hoàn thành.\
Đối tượng nhận: PM và các bên liên quan đến nhiệm vụ.\
Giao diện hiển thị:\
• Tiêu đề Mail & In-app: Nhiệm vụ đã dừng thực hiện\
• Nội dung: Nhiệm vụ Nghiên cứu công nghệ 5G/6G đã được phê duyệt dừng thực hiện.\
• Nút bấm (CTA): Bấm 'Xem nhiệm vụ' điều hướng tới /missions/\[missionId\].

### THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG

## Thiết kế dùng chung

<table style="width:100%;">
<colgroup>
<col style="width: 4%" />
<col style="width: 95%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><blockquote>
<p><strong>STT</strong></p>
</blockquote></th>
<th style="text-align: center;"><blockquote>
<p><strong>Yêu cầu</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" style="text-align: center;"><blockquote>
<p><strong>Quy tắc chung về giao diện người dùng</strong></p>
</blockquote></td>
</tr>
<tr>
<td style="text-align: center;"><ol type="1">
<li></li>
</ol></td>
<td style="text-align: center;"><p><strong>Tab Navigator:</strong></p>
<p><strong>….</strong></p>
<p>Cung cấp cách thức điều hướng giữa các mục (tab) trong cùng một cấp độ.</p>
<ul>
<li><p><strong>Thanh tab:</strong> Khi nhấn vào một tab, nội dung tương ứng được hiển thị</p></li>
<li><p><strong>Chỉ báo tab hiện tại:</strong> Hiển thị tab được chọn với đường gạch chân, màu xanh highlight.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><ol start="2" type="1">
<li></li>
</ol></td>
<td style="text-align: center;"><p><strong>Toast message (Thông báo):</strong> Hiển thị thông báo ngắn gọn về trạng thái của hành động hoặc sự kiện</p>
<ul>
<li><p>Vị trí: Hiển thị ở góc dưới bên phải của màn hình hệ thống</p></li>
<li><p>Thời gian hiển thị: Tự động biến mất sau 3 giây</p></li>
<li><p>Kiểu dáng:</p>
<ul>
<li><p>Thông báo thành công: Biểu tượng checkmark màu xanh lá</p></li>
<li><p>Thông báo lỗi: Biểu tượng alert màu đỏ</p></li>
<li><p>Thông báo cảnh báo: Biểu tượng info màu xanh dương</p></li>
</ul></li>
<li><p>Nội dung: Phụ thuộc vào hành động, sự kiện dẫn tới thông báo</p></li>
</ul></td>
</tr>
<tr>
<td colspan="2" style="text-align: center;"><blockquote>
<p><strong>Quy tắc chung về nhập liệu và hiển thị dữ liệu</strong></p>
</blockquote></td>
</tr>
<tr>
<td style="text-align: center;"><ol start="3" type="1">
<li></li>
</ol></td>
<td style="text-align: center;"><p><strong>Lưu trữ dữ liệu trên form nhập liệu:</strong></p>
<ul>
<li><p>Khi reload:</p>
<ul>
<li><p>Nếu bản ghi chưa được lưu - hiển thị popup cảnh báo huỷ dữ liệu đã nhập, xóa toàn bộ thông tin đã nhập trên form.</p></li>
<li><p>Nếu bản ghi đã được lưu, giữ nguyên thông tin hiện tại trên màn hình.</p></li>
<li><p>Ghi nhớ vị trí đang xem trên màn hình</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><ol start="4" type="1">
<li></li>
</ol></td>
<td style="text-align: center;"><p><strong>Nút (Buttons):</strong> Kích hoạt hành động cụ thể khi người dùng nhấp vào.</p>
<ul>
<li><p>Kiểu dáng:</p>
<ul>
<li><p>Nút chính: màu xanh dương, dùng cho hành động chính</p></li>
<li><p>Nút phụ: màu trắng, dùng cho hành động phụ (ví dụ: Huỷ, Đóng…)</p></li>
<li><p>Các nút có thể tuỳ vào thiết kế của từng chức năng theo mẫu</p></li>
</ul></li>
<li><p>Trạng thái:</p>
<ul>
<li><p>Bình thường: Hiển thị rõ ràng, có thể nhấp được</p></li>
<li><p>Hover: Khi di chuột qua, thay đổi sang màu “...”</p></li>
<li><p>Vô hiệu hóa: Bị mờ và không thể nhấp được</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><ol start="5" type="1">
<li></li>
</ol></td>
<td style="text-align: center;"><p><strong>Trường thông tin nhập cơ bản:</strong></p>
<ul>
<li><p><strong>Khi hiển thị:</strong></p>
<ul>
<li><p>Nếu số lượng ký tự ngắn hơn độ dài ô, hiển thị toàn bộ giá trị.</p></li>
<li><p>Nếu số lượng ký tự vượt quá độ dài ô, hiển thị một phần giá trị + "...". Khi di chuột qua trường, hiển thị toàn bộ giá trị trong tooltip.</p></li>
</ul></li>
<li><p><strong>Khi nhập dữ liệu</strong></p>
<ul>
<li><p>Khi focus vào textbox, placeholder ẩn đi</p></li>
<li><p>Khi nhập dữ liệu, nội dung sẽ hiển thị trong textbox</p></li>
<li><p>Nếu không nhập dữ liệu và chuyển sang trường khác:</p>
<ul>
<li><p>Trường không bắt buộc -&gt; placeholder hiển thị lại.</p></li>
<li><p>Trường bắt buộc, hiển thị cảnh báo đỏ: “This field is required!”.</p></li>
</ul></li>
</ul></li>
<li><p><strong>Kiểm tra dữ liệu</strong></p>
<ul>
<li><p><strong>Yêu cầu kiểm tra trường bắt buộc:</strong></p>
<ul>
<li><p>Trường dữ liệu bắt buộc nhập được đánh dấu (*) cạnh tên trường.</p></li>
<li><p>Nếu các trường dữ liệu bắt buộc còn trống, highlight các trường thông tin đó và hiển thị: “This field is required!”.</p></li>
</ul></li>
<li><p><strong>Yêu cầu kiểm tra độ dài tối đa:</strong></p>
<ul>
<li><p>Không hiển thị thêm bất kỳ ký tự nào khi dữ liệu đạt đến độ dài tối đa.</p></li>
<li><p>Hiển thị cảnh báo đỏ: “Character limit X reached!”.</p></li>
</ul></li>
<li><p><strong>Yêu cầu kiểm tra định dạng dữ liệu:</strong> Không hiển thị bất kỳ ký tự nào không hợp lệ đối với kiểu dữ liệu.</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><ol start="6" type="1">
<li></li>
</ol></td>
<td style="text-align: center;"><p><strong>Danh sách lựa chọn (Dropdownlist):</strong> Cung cấp danh sách lựa chọn có sẵn để lựa chọn 1 hoặc nhiều giá trị.</p>
<ul>
<li><p><strong>Hiển thị:</strong></p>
<ul>
<li><p>Mặc định: Hiển thị giá trị được chọn hiện tại hoặc placeholder</p></li>
<li><p>Khi kích hoạt: Hiển thị danh sách các lựa chọn có thể chọn được</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Lựa chọn:</strong></p>
<ul>
<li><p>Đơn lựa chọn: Chỉ chọn 1 giá trị</p></li>
<li><p>Đa lựa chọn: Có thể chọn nhiều giá trị</p></li>
</ul></li>
<li><p><strong>Dữ liệu</strong>: sắp xếp theo thứ tự từ alphabet đến thứ tự số.</p></li>
<li><p><strong>Trạng thái:</strong></p>
<ul>
<li><p>Bình thường: hiển thị bình thường, người dùng có thể tương tác.</p></li>
<li><p>Vô hiệu hóa: bị mờ đi và không thể tương tác.</p></li>
</ul></li>
<li><p><strong>Lưu ý: Nếu là dữ liệu danh mục, chỉ hiển thị những giá trị còn hiệu lực</strong></p></li>
</ul></td>
</tr>
</tbody>
</table>

## Thông báo/cảnh báo

### Thông tin chung chức năng

- Mã chức năng: N/a

- Mục đích: Cảnh báo/thông báo khi người dùng thực hiện hành động trên hệ thống.

- Người dùng mục tiêu: Người dùng trong hệ thống

- Trigger: Người dùng truy cập vào hệ thống =\> Thực hiện các hành động trên hệ thống

- Tiền điều kiện:

  - Người dùng đã đăng nhập vào hệ thống.

  - Người dùng thực hiện các hành động kích hoạt thông báo/cảnh báo

- Hậu điều kiện:

  - Hiển thị các thông báo/cảnh báo tương ứng

- Requirements Traceability Matrix – RTM: N/a

### Màn hình

<img src="media/image12.png" style="width:8.40625in;height:2.25259in" />

<img src="media/image1.png" style="width:4.92708in;height:2.54375in" />

<img src="media/image2.png" style="width:5.76042in;height:1.39047in" />

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 4%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 10%" />
<col style="width: 69%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Mã cảnh báo/thông báo</strong></th>
<th style="text-align: center;"><strong>Loại</strong></th>
<th style="text-align: center;"><strong>Mapping DB/API</strong></th>
<th style="text-align: center;"><strong>Mô tả nghiệp vụ</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><ol type="1">
<li></li>
</ol></td>
<td>VL</td>
<td>Lỗi tại field (Inline Message)</td>
<td>N/a</td>
<td style="text-align: left;"><p>Lỗi tại field (In-line Error Message)</p>
<p><img src="media/image9.png" style="width:5.22917in;height:1.88889in" /></p>
<ul>
<li><p>Hiển thị chữ đỏ và viền đỏ tại field lỗi (red border).</p></li>
<li><p>Hiển thị ngay dưới field lỗi</p></li>
<li><p>Thông điệp hiển thị khi có lỗi trong xác thực dữ liệu( validation).</p></li>
<li><p>Thông báo biến mất ngay khi người dùng nhập lại đúng.</p></li>
</ul>
<table style="width:81%;">
<colgroup>
<col style="width: 23%" />
<col style="width: 56%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Mã</strong></td>
<td style="text-align: center;"><strong>Nội dung cảnh báo</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL001</strong></td>
<td style="text-align: left;">Mật khẩu cũ chưa đúng, vui lòng nhập lại.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL002</strong></td>
<td style="text-align: left;">Mật khẩu không hợp lệ. Vui lòng kiểm tra lại !</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL003</strong></td>
<td style="text-align: left;">Mật khẩu nhập lại chưa khớp.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL004</strong></td>
<td style="text-align: left;">Trường <strong>&lt;tên trường&gt;</strong> không được để trống.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL005</strong></td>
<td style="text-align: left;">Không được nhập quá <strong>&lt;maxlength&gt;</strong> ký tự.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL006</strong></td>
<td style="text-align: left;"><strong>&lt;Tên trường&gt;</strong> không đúng định dạng</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL007</strong></td>
<td style="text-align: left;"><strong>&lt;Tên trường&gt;</strong> đã tồn tại, vui lòng kiểm tra lại</td>
</tr>
<tr>
<td style="text-align: left;"><strong>VL008</strong></td>
<td style="text-align: left;">Mật khẩu phải có độ dài từ 8 ký tự.</td>
</tr>
</tbody>
</table></td>
</tr>
<tr>
<td><ol start="2" type="1">
<li></li>
</ol></td>
<td style="text-align: left;">CM</td>
<td style="text-align: left;">Thông điệp xác nhận (Confirmation Message)</td>
<td>confirmation_popup</td>
<td style="text-align: left;"><p>Thông điệp xác nhận (Confirmation Message)</p>
<p><img src="media/image1.png" style="width:4.92708in;height:3.14583in" /></p>
<ul>
<li><p>Popup chỉ chứa nội dung và 2 nút “Xác nhận”,”Hủy”</p></li>
<li><p>Click ngoài popup không đóng popup. Popup chỉ đóng khi click vào nút trên popup</p></li>
<li><p>Sau khi đóng popup, thực hiện hành động tương ứng với nút đã chọn</p></li>
<li><p>Thông điệp được hiển thị khi hành động cần xác nhận</p></li>
<li><p>Vị trí: Hiện trung tâm màn hình</p>
<ul>
<li><p>Width: 400px</p></li>
<li><p>Height: 24px</p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td><ol start="3" type="1">
<li></li>
</ol></td>
<td style="text-align: left;">TB</td>
<td style="text-align: left;">Thông điệp thông báo (Informing Message)</td>
<td>info_popup</td>
<td style="text-align: left;"><p>Thông điệp thông báo (Informing Message)</p>
<p><img src="media/image8.png" style="width:5.22917in;height:2.84722in" /></p>
<ul>
<li><p>Popup chỉ chứa nội dung chữ màu xanh/đỏ và biến mất sau 5s</p></li>
<li><p>Thông điệp chỉ xuất hiện sau khi hệ thống thực hiện thành công chính xác/thất bại 1 chức năng/hành động.</p></li>
<li><p>Vị trí cách lề</p>
<ul>
<li><p>Right: 20px</p></li>
<li><p>Bot: 20px</p></li>
</ul></li>
<li><p>Chiều rộng: 400px</p></li>
<li><p>TH nhiều thông báo ⇒ Thông báo mới nhất sẽ hiện lên trên thông báo cũ, cách nhau 20px</p></li>
</ul>
<table style="width:81%;">
<colgroup>
<col style="width: 25%" />
<col style="width: 55%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Mã</strong></td>
<td style="text-align: center;"><strong>Nội dung cảnh báo</strong></td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB001</strong></td>
<td style="text-align: left;">Đăng nhập thành công.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB002</strong></td>
<td style="text-align: left;">Tên đăng nhập hoặc mật khẩu không đúng.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB003</strong></td>
<td style="text-align: left;">Tên đăng nhập không tồn tại.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB004</strong></td>
<td style="text-align: left;">Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB005</strong></td>
<td style="text-align: left;">Đăng xuất thành công.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB006</strong></td>
<td style="text-align: left;">Phiên đăng nhập đã hết hoặc token không hợp lệ.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB007</strong></td>
<td style="text-align: left;">Hệ thống có lỗi, vui lòng thử lại.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB008</strong></td>
<td style="text-align: left;">Mật khẩu không hợp lệ. Bạn vui lòng nhập Mật khẩu có chứa ít nhất 8 ký tự, bao gồm ít nhất 1 chữ số, ít nhất 1 chữ in hoa, ít nhất 1 một chữ thường và ít nhất 1 ký tự đặc biệt.</td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB009</strong></td>
<td style="text-align: left;"><p>&lt;Thao tác&gt; &lt;Đối tượng&gt; thành công</p>
<p>Bạn đã &lt;Thao tác&gt; thành công &lt;Đối tượng&gt; <strong>&lt;value&gt;</strong></p></td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB010</strong></td>
<td style="text-align: left;"><p>&lt;Thao tác&gt; &lt;Đối tượng&gt; không thành công</p>
<p>&lt;Nội dung lỗi theo message API trả về&gt;</p></td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB011</strong></td>
<td style="text-align: left;"><p>&lt;Thao tác&gt; &lt;Đối tượng&gt; không thành công</p>
<p>Có lỗi trong quá trình xử lý dữ liệu, vui lòng thử lại sau!</p></td>
</tr>
<tr>
<td style="text-align: left;"><strong>TB012</strong></td>
<td style="text-align: left;"><p>&lt;Thao tác&gt; &lt;Đối tượng&gt; không thành công</p>
<p>&lt;Đối tượng&gt; [mã+tên] đã có lịch sử cập nhật dữ liệu trên hệ thống. Bạn không thể &lt;Thao tác&gt; &lt;Đối tượng&gt; này.</p></td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

## Luồng nghiệp vụ

N/a

## Mô tả luồng xử lý

N/a

## Kịch bản phân trang & Load more

### Phân trang

#### Thông tin chung

|  |  |
|:---|:---|
| **Nội dung** | **Mô tả** |
| **Mục đích** | Chia tập dữ liệu thành các trang nhỏ nhằm giới hạn số lượng bản ghi hiển thị tại một thời điểm, hỗ trợ người dùng điều hướng nhanh trên danh sách có số lượng dữ liệu lớn. |
| **Phạm vi áp dụng** | Các màn hình danh sách có sử dụng Paging Component. |
| **Trang khởi tạo** | Trang 1. |
| **Số bản ghi/trang mặc định** | 10 bản ghi/trang. |
| **Số bản ghi/trang cho phép lựa chọn** | 10, 20, 50. |
| **Số lượng số trang hiển thị tối đa** | 5 số trang tại một thời điểm. |
| **Điều kiện dữ liệu** | Phân trang được tính trên tập dữ liệu sau khi áp dụng các điều kiện tìm kiếm/lọc hiện tại. |
| **Nguyên tắc chuyển trang** | Khi người dùng chuyển trang, hệ thống giữ nguyên từ khóa tìm kiếm và các điều kiện lọc đang áp dụng. |

#### Mô tả chi tiết các thành phần

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
<th style="text-align: center;"><strong>Kiểu dữ liệu</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Tổng số bản ghi</td>
<td style="text-align: left;">Label</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả truy vấn</td>
<td><ul>
<li><p>Hiển thị tổng số bản ghi của tập dữ liệu hiện tại theo dạng <strong>“Tất cả danh sách: {TotalRecord}”</strong>. Giá trị được cập nhật sau mỗi lần tải lại danh sách, tìm kiếm, lọc hoặc thao tác làm thay đổi số lượng bản ghi.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Số bản ghi/trang</td>
<td style="text-align: left;">Dropdown</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">10</td>
<td><ul>
<li><p>Cho phép lựa chọn <strong>10, 20, 50</strong> bản ghi/trang. Khi thay đổi giá trị, hệ thống tải lại dữ liệu và chuyển về <strong>trang 1</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Trang hiện tại</td>
<td style="text-align: left;">Paging Number</td>
<td style="text-align: left;">Input/Output</td>
<td style="text-align: left;">1</td>
<td><ul>
<li><p>Hiển thị số trang hiện tại. Trang hiện tại phải có trạng thái hiển thị khác các trang còn lại. Chọn lại đúng trang hiện tại không phát sinh yêu cầu tải dữ liệu mới.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Trang đầu</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang 1</td>
<td><ul>
<li><p>Chuyển trực tiếp đến trang đầu tiên. Không cho phép thao tác khi đang ở trang 1 hoặc khi không có dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Trang trước</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang 1</td>
<td><ul>
<li><p>Chuyển đến trang liền trước trang hiện tại. Mỗi lần thao tác giảm CurrentPage 1 đơn vị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td style="text-align: left;">Danh sách số trang</td>
<td style="text-align: left;">Paging Number</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo tổng số trang</td>
<td><ul>
<li><p>Hiển thị các số trang cho phép người dùng chuyển trực tiếp đến trang mong muốn. Hiển thị tối đa <strong>5 số trang</strong> tại một thời điểm.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: left;">Trang sau</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang cuối</td>
<td><ul>
<li><p>Chuyển đến trang liền sau trang hiện tại. Mỗi lần thao tác tăng CurrentPage 1 đơn vị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td style="text-align: left;">Trang cuối</td>
<td style="text-align: left;">Icon Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Disable tại trang cuối</td>
<td><ul>
<li><p>Chuyển trực tiếp đến trang cuối cùng. Không cho phép thao tác khi đang ở trang cuối hoặc khi không có dữ liệu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### Công thức tính

|  |  |
|----|----|
| **Nội dung** | **Công thức / Quy tắc** |
| Tổng số trang | TotalPage = CEILING(TotalRecord / PageSize) |
| Số thứ tự bản ghi | STT = (CurrentPage - 1) × PageSize + Position |
| Bản ghi đầu tiên của trang | StartRecord = (CurrentPage - 1) × PageSize + 1 |
| Bản ghi cuối của trang | EndRecord = MIN(CurrentPage × PageSize, TotalRecord) |

Trong đó:

|             |                                                        |
|-------------|--------------------------------------------------------|
| **Tham số** | **Ý nghĩa**                                            |
| TotalRecord | Tổng số bản ghi đáp ứng điều kiện hiện tại.            |
| PageSize    | Số bản ghi tối đa được hiển thị trên một trang.        |
| CurrentPage | Trang hiện tại, bắt đầu từ 1.                          |
| Position    | Vị trí của bản ghi trong trang hiện tại, bắt đầu từ 1. |
| TotalPage   | Tổng số trang được tính từ TotalRecord và PageSize.    |

#### Quy tắc hiển thị

|  |  |
|----|----|
| **Trường hợp** | **Quy tắc hiển thị** |
| TotalPage = 0 | Không hiển thị số trang có thể lựa chọn; các nút điều hướng ở trạng thái Disable. |
| TotalPage = 1 | Vẫn hiển thị trang **1**; các nút Trang đầu, Trang trước, Trang sau, Trang cuối đều Disable. |
| TotalPage ≤ 5 | Hiển thị toàn bộ các số trang từ 1 đến TotalPage. |
| TotalPage \> 5 | Hiển thị tối đa 5 số trang tại một thời điểm; ưu tiên trang hiện tại và các trang lân cận. |
| Có khoảng trang bị ẩn | Sử dụng ... để biểu thị khoảng trang không hiển thị trực tiếp. |
| Trang hiện tại | Được làm nổi bật để phân biệt với các trang còn lại. |
| Chọn một số trang khác | Hệ thống tải dữ liệu của trang được chọn và cập nhật trạng thái trang hiện tại. |
| Chọn lại trang hiện tại | Không tải lại dữ liệu. |

#### Trạng thái các nút điều hướng

|                   |               |                 |               |                |
|-------------------|---------------|-----------------|---------------|----------------|
| **Trạng thái**    | **Trang đầu** | **Trang trước** | **Trang sau** | **Trang cuối** |
| Không có dữ liệu  | Disable       | Disable         | Disable       | Disable        |
| Chỉ có 1 trang    | Disable       | Disable         | Disable       | Disable        |
| Đang ở trang đầu  | Disable       | Disable         | Enable        | Enable         |
| Đang ở trang giữa | Enable        | Enable          | Enable        | Enable         |
| Đang ở trang cuối | Enable        | Enable          | Disable       | Disable        |

#### Kịch bản xử lý phân trang

|  |  |  |
|----|----|----|
| **STT** | **Trường hợp** | **Xử lý** |
| 1 | Truy cập danh sách lần đầu | Hệ thống tải dữ liệu với CurrentPage = 1, PageSize = 10. |
| 2 | Chọn một số trang | Hệ thống giữ nguyên điều kiện tìm kiếm/lọc, tải dữ liệu của trang được chọn và cập nhật CurrentPage. |
| 3 | Chọn Trang trước | Nếu CurrentPage \> 1, hệ thống tải dữ liệu của CurrentPage - 1. |
| 4 | Chọn Trang sau | Nếu CurrentPage \< TotalPage, hệ thống tải dữ liệu của CurrentPage + 1. |
| 5 | Chọn Trang đầu | Hệ thống chuyển trực tiếp về trang 1. |
| 6 | Chọn Trang cuối | Hệ thống chuyển trực tiếp đến TotalPage. |
| 7 | Thay đổi PageSize | Hệ thống cập nhật PageSize, tính lại TotalPage, đưa CurrentPage = 1 và tải lại danh sách. |
| 8 | Thực hiện tìm kiếm/lọc mới | Hệ thống áp dụng điều kiện mới, cập nhật TotalRecord, tính lại phân trang và đưa danh sách về trang 1. |
| 9 | Chuyển trang | Giữ nguyên từ khóa tìm kiếm, điều kiện lọc và PageSize hiện tại. |
| 10 | Không có bản ghi | Hiển thị trạng thái không có dữ liệu; không hiển thị số trang có thể lựa chọn và Disable toàn bộ điều hướng. |
| 11 | Tổng số bản ghi thay đổi | Hệ thống tính lại TotalPage. Nếu CurrentPage \> TotalPage, chuyển đến trang hợp lệ gần nhất; nếu còn dữ liệu thì tối đa là trang cuối. |
| 12 | Xóa bản ghi cuối cùng của một trang | Sau khi tải lại danh sách, nếu trang hiện tại không còn bản ghi và tồn tại trang trước đó, hệ thống chuyển về trang liền trước hợp lệ. |

### Load more

#### Thông tin chung

|  |  |
|:---|:---|
| **Nội dung** | **Mô tả** |
| **Mục đích** | Cho phép tải từng phần dữ liệu thay vì tải toàn bộ tập dữ liệu trong một lần. Khi người dùng cần xem thêm, hệ thống tải bổ sung các bản ghi tiếp theo và giữ nguyên các bản ghi đã hiển thị trước đó. |
| **Phạm vi áp dụng** | Các danh sách được thiết kế theo cơ chế **Xem thêm/Load more** thay vì Paging Component. |
| **Nguyên tắc áp dụng** | Một danh sách tại cùng một thời điểm chỉ sử dụng cơ chế phân trang hoặc Load more, trừ khi chức năng có thiết kế riêng. |
| **Số bản ghi tải mỗi lần** | Do chức năng sử dụng quy định. File mẫu sử dụng biến X, ví dụ 50 bản ghi/lần; không cố định 50 cho toàn hệ thống. |
| **Dữ liệu khởi tạo** | Tải tối đa LoadSize bản ghi đầu tiên. |

#### Mô tả chi tiết các thành phần

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
<th style="text-align: center;"><strong>Kiểu dữ liệu</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th style="text-align: left;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Danh sách dữ liệu</td>
<td style="text-align: left;">List/Table</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">LoadSize bản ghi đầu tiên</td>
<td><ul>
<li><p>Hiển thị các bản ghi đã được tải. Các lần Load more tiếp theo bổ sung dữ liệu vào cuối danh sách, không thay thế các bản ghi đã hiển thị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Xem thêm</td>
<td style="text-align: left;">Button</td>
<td style="text-align: left;">Input</td>
<td style="text-align: left;">Theo số lượng dữ liệu còn lại</td>
<td><ul>
<li><p>Hiển thị khi số bản ghi đã tải nhỏ hơn tổng số bản ghi. Khi người dùng chọn, hệ thống tải tiếp tối đa LoadSize bản ghi tiếp theo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Số bản ghi đã hiển thị</td>
<td style="text-align: left;">Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo dữ liệu đã tải</td>
<td><ul>
<li><p>Là tổng số bản ghi đang được hiển thị sau các lần Load more.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Tổng số bản ghi</td>
<td style="text-align: left;">Integer</td>
<td style="text-align: left;">Output</td>
<td style="text-align: left;">Theo kết quả truy vấn</td>
<td><ul>
<li><p>Sử dụng để xác định còn dữ liệu cần tải thêm hay không.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 

#### Công thức và điều kiện

|  |  |
|----|----|
| **Nội dung** | **Công thức / Điều kiện** |
| Số bản ghi tải ban đầu | DisplayedRecord = MIN(LoadSize, TotalRecord) |
| Vị trí bắt đầu lần tải tiếp theo | Offset = DisplayedRecord |
| Số lượng tải lần tiếp theo | NextLoad = MIN(LoadSize, TotalRecord - DisplayedRecord) |
| Còn dữ liệu để tải | DisplayedRecord \< TotalRecord |
| Đã tải hết dữ liệu | DisplayedRecord \>= TotalRecord |

#### Kịch bản xử lý Load more

|  |  |  |
|:--:|----|----|
| **STT** | **Trường hợp** | **Xử lý** |
| 1 | Tải danh sách lần đầu | Hệ thống tải tối đa LoadSize bản ghi đầu tiên. |
| 2 | Số bản ghi đã hiển thị nhỏ hơn tổng số bản ghi | Hiển thị nút **Xem thêm**. |
| 3 | Người dùng chọn Xem thêm | Hệ thống tải tiếp tối đa LoadSize bản ghi kể từ bản ghi cuối cùng đang hiển thị. |
| 4 | Tải thêm thành công | Bổ sung các bản ghi mới vào cuối danh sách; giữ nguyên các bản ghi đã hiển thị trước đó. |
| 5 | Đã hiển thị toàn bộ dữ liệu | Không hiển thị nút **Xem thêm**. |
| 6 | Không có dữ liệu | Hiển thị trạng thái không có dữ liệu; không hiển thị nút Xem thêm. |
| 7 | Làm mới trang | Tải lại danh sách từ đầu với dữ liệu mới nhất và khởi tạo lại số bản ghi đã hiển thị. |
| 8 | Thực hiện tìm kiếm/lọc mới | Xóa tập dữ liệu hiển thị cũ, áp dụng điều kiện mới và tải lại LoadSize bản ghi đầu tiên của tập kết quả mới. |
| 9 | Đang tải thêm | Disable nút **Xem thêm** hoặc hiển thị trạng thái Processing để tránh phát sinh nhiều yêu cầu đồng thời. |
| 10 | Tải thêm thất bại | Giữ nguyên toàn bộ dữ liệu đã hiển thị trước đó; cho phép người dùng thực hiện lại thao tác Xem thêm. |

#### Quy tắc hiển thị Load more

|  |  |
|----|----|
| **Trường hợp** | **Nút Xem thêm** |
| TotalRecord = 0 | Không hiển thị |
| DisplayedRecord = 0 và đang tải dữ liệu | Không cho phép thao tác |
| DisplayedRecord \< TotalRecord | Hiển thị |
| DisplayedRecord \>= TotalRecord | Không hiển thị |
| Đang xử lý yêu cầu Load more | Disable/Processing |
| Yêu cầu Load more thất bại | Enable lại để người dùng có thể thử lại |

## 

## Menu chức năng dùng chung

### Thông tin chức năng

- Mã chức năng: COM-UI-01

- Mục đích: Cung cấp khu vực điều hướng thống nhất, giúp người dùng truy cập nhanh các nhóm chức năng và chức năng được cấp quyền trong phân hệ.

- Phạm vi áp dụng: Các màn hình nghiệp vụ có sử dụng thanh menu chức năng bên trái hoặc menu điều hướng tương đương.

- Tiền điều kiện:

  - Người dùng đã đăng nhập hợp lệ.

  - Hệ thống đã tải danh sách quyền và cấu hình menu theo tài khoản.

- Hậu điều kiện:

  - Chức năng được chọn được điều hướng và hiển thị.

  - Mục menu hiện tại được đánh dấu trạng thái đang chọn, nhóm menu cha được mở nếu có.

### Mô tả chi tiết các thành phần

<table style="width:100%;">
<colgroup>
<col style="width: 13%" />
<col style="width: 13%" />
<col style="width: 13%" />
<col style="width: 8%" />
<col style="width: 11%" />
<col style="width: 39%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu<br />
[Độ dài]</strong></th>
<th style="text-align: center;"><strong>Input/<br />
Output</strong></th>
<th style="text-align: center;"><strong>Giá trị<br />
khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Biểu tượng/Tên phân hệ</td>
<td style="text-align: center;">Icon + String [100]</td>
<td style="text-align: center;">Output</td>
<td style="text-align: center;">Theo cấu hình</td>
<td style="text-align: left;">● Hiển thị biểu tượng và tên phân hệ hiện tại.</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Nhóm menu</td>
<td style="text-align: center;">Accordion [100]</td>
<td style="text-align: center;">Input/Output</td>
<td style="text-align: center;">Đóng</td>
<td style="text-align: left;">● Nhóm các chức năng cùng nghiệp vụ.<br />
● Nhấn vào tiêu đề nhóm để mở/đóng danh sách menu con.<br />
● Nếu có menu con đang active, nhóm tự động mở.</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Menu cấp 1</td>
<td style="text-align: center;">Navigation item [100]</td>
<td style="text-align: center;">Input</td>
<td style="text-align: center;">Không chọn</td>
<td style="text-align: left;">● Cho phép điều hướng trực tiếp đến chức năng.</td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Menu cấp 2</td>
<td style="text-align: center;">Navigation item [100]</td>
<td style="text-align: center;">Input</td>
<td style="text-align: center;">Không chọn</td>
<td style="text-align: left;">● Hiển thị thụt vào so với menu cấp 1.<br />
● Chỉ hiển thị khi nhóm/menu cha đang mở và người dùng có quyền.</td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Icon menu</td>
<td style="text-align: center;">Icon</td>
<td style="text-align: center;">Output</td>
<td style="text-align: center;">Theo cấu hình</td>
<td style="text-align: left;">● Icon phải thống nhất với chức năng và có nhãn truy cập hỗ trợ accessibility.</td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td style="text-align: left;">Trạng thái đang chọn</td>
<td style="text-align: center;">Boolean</td>
<td style="text-align: center;">Input/Output</td>
<td style="text-align: center;">False</td>
<td style="text-align: left;">● True khi URL hiện tại thuộc menu tương ứng.<br />
● Menu active được làm nổi bật bằng màu nền/màu chữ theo bộ nhận diện.</td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: left;">Trạng thái mở rộng</td>
<td style="text-align: center;">Boolean</td>
<td style="text-align: center;">Input/Output</td>
<td style="text-align: center;">False</td>
<td style="text-align: left;">● Lưu trạng thái mở/đóng trong phiên làm việc.<br />
● Khi chuyển màn hình không làm mất trạng thái, trừ khi tải lại cấu hình menu.</td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td style="text-align: left;">Thanh cuộn menu</td>
<td style="text-align: center;">Scrollbar</td>
<td style="text-align: center;">Input/Output</td>
<td style="text-align: center;">Ẩn</td>
<td style="text-align: left;">● Hiển thị khi tổng chiều cao menu vượt quá chiều cao vùng hiển thị.<br />
● Không che khuất mục menu cuối cùng.</td>
</tr>
</tbody>
</table>

### Quy tắc xử lý

- Hệ thống lấy danh sách menu từ cấu hình và lọc theo quyền của người dùng trước khi hiển thị.

- Khi người dùng chọn menu, hệ thống kiểm tra lại quyền ở Backend, không chỉ dựa trên việc ẩn/hiện ở giao diện.

- Nếu chức năng không còn tồn tại hoặc quyền vừa bị thu hồi, hiển thị thông báo không có quyền truy cập và không mở màn hình.

- Tên menu được chuẩn hóa bằng cách loại bỏ khoảng trắng thừa ở đầu/cuối, không cho phép tên rỗng trong cấu hình.

### Quy tắc hiển thị

- Chỉ hiển thị nhóm menu có ít nhất một chức năng con mà người dùng được phép truy cập.

- Tên menu dài quá vùng hiển thị được cắt bằng dấu ba chấm và hiển thị đầy đủ khi rê chuột.

- Chiều rộng menu đề xuất: 240 px khi mở rộng, 64-72 px khi thu gọn.

- Tại một thời điểm chỉ có một menu chức năng được đánh dấu active theo URL hiện tại.

- Menu phải hỗ trợ điều hướng bằng bàn phím: Tab để di chuyển, Enter/Space để chọn hoặc mở/đóng nhóm.

## Breadcrumb dùng chung

### Thông tin chung chức năng

- **Mã chức năng:** COM-UI-02

- **Mục đích:** Hiển thị vị trí hiện tại của người dùng trong cấu trúc phân hệ và hỗ trợ quay lại các cấp màn hình trước.

- **Phạm vi áp dụng:** Các màn hình có cấu trúc điều hướng từ hai cấp trở lên.

- Tiền điều kiện:

  - Màn hình đã xác định được đường dẫn điều hướng và tên hiển thị của từng cấp.

- Hậu điều kiện:

  - Khi chọn một cấp trước, hệ thống điều hướng đến đúng màn hình tương ứng.

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 28%" />
<col style="width: 14%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 28%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu<br />
[Độ dài]</strong></th>
<th style="text-align: center;"><strong>Input/<br />
Output</strong></th>
<th style="text-align: center;"><strong>Giá trị<br />
khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Vùng Breadcrumb</td>
<td style="text-align: center;">Container</td>
<td style="text-align: center;">Output</td>
<td style="text-align: center;">Theo màn hình</td>
<td style="text-align: left;">● Hiển thị phía trên vùng nội dung chính.</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Cấp điều hướng</td>
<td style="text-align: center;">Link - String [100]</td>
<td style="text-align: center;">Input/Output</td>
<td style="text-align: center;">Theo route</td>
<td style="text-align: left;">● Hiển thị tên của từng cấp trước màn hình hiện tại.<br />
● Cho phép nhấn để quay về cấp tương ứng.</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: left;">Dấu phân cách</td>
<td style="text-align: center;">Icon/String [1]</td>
<td style="text-align: center;">Output</td>
<td style="text-align: center;">/</td>
<td style="text-align: left;">● Sử dụng dấu / hoặc icon chevron.<br />
● Không cho phép tương tác.</td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td style="text-align: left;">Màn hình hiện tại</td>
<td style="text-align: center;">String [150]</td>
<td style="text-align: center;">Output</td>
<td style="text-align: center;">Theo route</td>
<td style="text-align: left;">● Hiển thị ở vị trí cuối cùng.<br />
● Không gắn liên kết và được làm nổi bật hơn các cấp trước.</td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td style="text-align: left;">Breadcrumb rút gọn</td>
<td style="text-align: center;">Dropdown/Ellipsis</td>
<td style="text-align: center;">Input/Output</td>
<td style="text-align: center;">Ẩn</td>
<td style="text-align: left;">● Dùng khi số cấp hoặc tổng chiều dài vượt quá vùng hiển thị.<br />
● Nhấn để xem các cấp đang bị ẩn.</td>
</tr>
</tbody>
</table>

### Quy tắc xử lý

- Breadcrumb được sinh từ cấu hình route/màn hình, không cho phép người dùng nhập trực tiếp.

- Khi chọn một cấp trước, hệ thống giữ lại các tham số cần thiết nếu route đích hỗ trợ, các tham số không còn phù hợp bị loại bỏ.

- Tổng chiều dài chuỗi hiển thị của một cấp tối đa 100 ký tự, màn hình hiện tại tối đa 150 ký tự.

- Nếu cấp điều hướng không còn quyền truy cập, hiển thị dạng văn bản không có liên kết hoặc ẩn theo cấu hình bảo mật.

### Quy tắc hiển thị

- Hiển thị tối đa 5 cấp tại cùng một thời điểm.

- Nếu số cấp lớn hơn 5, giữ cấp đầu, hai cấp gần nhất và màn hình hiện tại, các cấp ở giữa được gom vào dấu ba chấm.

- Tên cấp dài quá 100 ký tự được cắt bằng dấu ba chấm và có tooltip hiển thị đầy đủ.

- Breadcrumb không xuống quá 2 dòng, trên màn hình nhỏ ưu tiên rút gọn thay vì xuống dòng.

## Tìm kiếm dùng chung

### Thông tin chung chức năng

- **Mã chức năng:** COM-UI-03

- **Mục đích:** Cho phép người dùng nhập từ khóa để thu hẹp danh sách theo các trường được cấu hình cho từng màn hình.

- **Phạm vi áp dụng:** Các màn hình danh sách có chức năng tìm kiếm nhanh.

- Tiền điều kiện:

  - Danh sách và tập trường tìm kiếm đã được cấu hình.

- Hậu điều kiện:

  - Danh sách hiển thị dữ liệu phù hợp với từ khóa và quay về trang 1.

### Mô tả chi tiết các thành phần

<table>
<colgroup>
<col style="width: 4%" />
<col style="width: 13%" />
<col style="width: 14%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 47%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>STT</strong></th>
<th style="text-align: center;"><strong>Tên</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu<br />
[Độ dài]</strong></th>
<th style="text-align: center;"><strong>Input/<br />
Output</strong></th>
<th style="text-align: center;"><strong>Giá trị<br />
khởi tạo</strong></th>
<th style="text-align: center;"><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td style="text-align: left;">Ô tìm kiếm</td>
<td style="text-align: center;">Textbox - String [255]</td>
<td style="text-align: center;">Input</td>
<td style="text-align: center;">Rỗng</td>
<td style="text-align: left;"><p>● Cho phép nhập chữ, số, khoảng trắng, ký tự đặc biệt và ký tự tiếng Việt.<br />
● Tự động loại bỏ khoảng trắng đầu/cuối khi thực hiện tìm kiếm.</p>
<p>● Người dùng nhấn Enter để tìm kiếm</p></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: left;">Placeholder</td>
<td style="text-align: center;">TextView</td>
<td style="text-align: center;">Output</td>
<td style="text-align: center;">Tìm kiếm...</td>
<td style="text-align: left;">● Mô tả ngắn các trường được tìm kiếm, ví dụ: "Tìm theo mã, họ tên, email".</td>
</tr>
</tbody>
</table>

### Quy tắc xử lý

- Cho phép thực hiện tìm kiếm bằng phím Enter, nhấn icon tìm kiếm hoặc tự động sau 300 ms kể từ lần nhập cuối nếu màn hình bật chế độ tìm kiếm tức thời.

- Từ khóa tối đa 255 ký tự, khi đạt giới hạn không cho nhập thêm và không tự động cắt dữ liệu đã nhập.

- Paste 1 đoạn dài hơn 50 ký tự hệ thống chỉ nhận 50 ký tự đầu

- Tìm kiếm không phân biệt chữ hoa/chữ thường. Việc không phân biệt dấu tiếng Việt được cấu hình theo từng trường dữ liệu và khả năng của CSDL.

- Khi thay đổi từ khóa, hệ thống giữ nguyên các bộ lọc khác nhưng đưa trang hiện tại về trang 1.

- Backend phải sử dụng truy vấn tham số hóa, không ghép trực tiếp từ khóa vào câu lệnh truy vấn.

### Quy tắc hiển thị

- Khi đang tải dữ liệu, hiển thị trạng thái loading tại vùng danh sách, ô tìm kiếm vẫn giữ nguyên từ khóa.

- Nếu không có kết quả, hiển thị trạng thái rỗng và thông điệp "Không tìm thấy dữ liệu phù hợp".

- Nếu API lỗi, giữ nguyên từ khóa và hiển thị thông báo lỗi, không xóa dữ liệu người dùng đã nhập.

- Nút xóa từ khóa chỉ xuất hiện khi giá trị sau khi nhập không rỗng.

# THIẾT KẾ CƠ SỞ DỮ LIỆU

## Mô hình dữ liệu

Hệ thống sử dụng các cơ sở dữ liệu gì, để làm gì. Ví dụ: Hệ thống sử dụng ElasticSearch để lưu trữ event log, PostgreSql để lưu trữ cấu hình hệ thống, cảnh báo, thông tin người dùng, …

Các mô hình thực thể liên kết của hệ thống như sau (có thể gồm nhiều mô hình thực thể liên kết nếu hệ thống chia thành nhiều phân hệ dữ liệu độc lập nhau):

Các bảng/collection dữ liệu như sau:

|  |  |  |  |
|----|----|----|----|
| **STT** | **Table/Collection** | **Loại** | **Mô tả** |
| 1 | soc_asset_computing_device | Elasticsearch | Lưu trữ thông tin chi tiết các đối tượng computing device |
| 2 | Asset_setting | MongoDB | Lưu trữ cấu hình các loại Asset |
|  |  |  |  |

## Chi tiết các bảng CSDL

Mô tả chi tiết về các bảng cơ sở dữ liệu.

|  |  |  |  |  |  |  |  |
|----|----|----|----|----|----|----|----|
| **STT** | **Tên trường** | **Kiểu dữ liệu và độ dài** | **Nullable** | **Unikey** | **P/F Key** | **Mặc định** | **Mô tả** |
|  | xxxCode | Int (4) |  | x |  |  | Code của xxx, Auto number |
|  | xxxxCode | Varch (100) | x |  |  |  | Code of yyy. |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

## Constraint

\< Mô tả về khóa chính, khóa phụ và các ràng buộc dữ liệu vào mục này nếu có\>

## Index

\< Mô tả về tên index, tên bảng và tên cột tương ứng với index nếu có\>.

## Trigger

\< Mô tả về trigger, tên bảng, sự kiện và ý nghĩa các trigger tương ứng vào đây nếu có.\>.

## Store Produre/Function

\< Mô tả về tên thủ tục ở mức hệ thống và mức ứng dụng, đầu vào và đầu ra của thủ tục vào đây nếu có\>.

# THIẾT KẾ ĐẢM BẢO TUÂN THỦ TIÊU CHUẨN QUẢN TRỊ DỮ LIỆU

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
|----|----|----|----|----|:---|
|  |  |  |  |  |  |

## Quản lý siêu dữ liệu

### Thông tin đối tượng dữ liệu

| STT | Tên đối tượng | Mô tả | Loại đối tượng | Thông tin liên quan | Kiểu dữ liệu | Thời gian tạo | Thời gian chỉnh sửa lần cuối | Cấp độ bảo mật | Dữ liệu trọng yếu | Đơn vị chủ dữ liệu | Đầu mối quản lý dữ liệu | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 01 | *Tên đối tượng* | *Mô tả* | *Loại đối tượng* | *Thông tin liên quan* | *Kiểu dữ liệu* | *Ngày tạo* | *Ngày chỉnh sửa gần nhất* | *Cấp độ bảo mật* | *Phân loại cấp độ trọng yếu* | *Đơn vị/Cơ quan chủ quản* | *Đơn vị/Cơ quan quản lý dữ liệu* | *Đơn vị/Cơ quan sở hữu hệ thống* | *Thông tin đầu mối quản trị kỹ thuật* |

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

# PHỤ LỤC
