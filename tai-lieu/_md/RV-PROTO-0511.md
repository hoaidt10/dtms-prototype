<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Review/Review prototype.docx -->
<!-- pk-sha256: fef27449943f3462055b61c5c8273f0f021829dc5fc4a766540ca0012e913d69 -->
<!-- pk-generated: 2026-11-05 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# RV-PROTO-0511 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Review/Review prototype.docx`. Trích dẫn thì ghi mã **RV-PROTO-0511** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

## Comment

<table style="width:97%;">
<colgroup>
<col style="width: 7%" />
<col style="width: 32%" />
<col style="width: 19%" />
<col style="width: 36%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;"><strong>STT</strong></td>
<td style="text-align: left;"><strong>Màn hình/Thành phần</strong></td>
<td style="text-align: left;"><strong>Hiện trạng</strong></td>
<td style="text-align: left;"><strong>Mong muốn</strong></td>
</tr>
<tr>
<td style="text-align: left;">1</td>
<td style="text-align: left;">Luồng mua sắm/Tìm kiếm</td>
<td style="text-align: left;">Mức ưu tiên</td>
<td style="text-align: left;">Khi chọn mức Khẩn/Thượng Khẩn cần điền lý do</td>
</tr>
<tr>
<td style="text-align: left;">2</td>
<td style="text-align: left;">Luồng mua sắm/Tìm kiếm</td>
<td style="text-align: left;">Ngày tạo từ-Ngày tạo đến</td>
<td style="text-align: left;">Gộp vào 1 trường</td>
</tr>
<tr>
<td style="text-align: left;">3</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Chưa có luồng chỉnh sửa ĐXMS</td>
<td style="text-align: left;"><p>- Bổ sung luồng chỉnh sửa ĐXMS, khi chọn chỉnh sửa thì cần gán với 1 ĐXMS đã có.</p>
<p>- Tại màn Thêm mới Luồng mua sắm bổ sung option Thêm mới/Chỉnh sửa, màn hình Chỉnh sửa:</p>
<ul>
<li><p>Bổ sung thêm trường Luồng mua sắm gốc</p></li>
<li><p>Sau khi chọn luồng gốc =&gt; các trường thông tin còn lại sẽ tự fill theo thông tin của luồng gốc và cho phép chỉnh sửa</p></li>
</ul>
<p>=&gt; Tại màn Danh sách luồng mua sắm và filter tìm kiếm, bổ sung trường Loại: Thêm mới/Điều chỉnh</p></td>
</tr>
<tr>
<td style="text-align: left;">4</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Quy trình</td>
<td style="text-align: left;">Bỏ trường Quy trình, tự định nghĩa sau khi có báo giá</td>
</tr>
<tr>
<td style="text-align: left;">5</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Mật: Khi chọn mật thì đang fix cứng hình thức trình ký là bản cứng</td>
<td style="text-align: left;">Cho tự lựa chọn hình thức</td>
</tr>
<tr>
<td style="text-align: left;">6</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Loại biểu mẫu, Cấp phê duyệt</td>
<td style="text-align: left;">Loại biểu mẫu, Cấp phê duyệt =&gt; Chưa có thì để trống, khi đã có thì cần điền đúng</td>
</tr>
<tr>
<td style="text-align: left;">7</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Mục đích</td>
<td style="text-align: left;">Bỏ</td>
</tr>
<tr>
<td style="text-align: left;">8</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Giá trị dự tính</td>
<td style="text-align: left;">Nhập số thường, không quy ra tỷ đồng</td>
</tr>
<tr>
<td style="text-align: left;">9</td>
<td style="text-align: left;">Yêu cầu báo giá/Tìm kiếm</td>
<td style="text-align: left;">Chưa có</td>
<td style="text-align: left;">- Bổ sung tìm theo dự án/đề tài</td>
</tr>
<tr>
<td style="text-align: left;">10</td>
<td style="text-align: left;">Yêu cầu báo giá/Thêm mới &amp; Cập nhật</td>
<td style="text-align: left;">Chưa có</td>
<td style="text-align: left;">Bổ sung theo ảnh màn hình đã cung cấp</td>
</tr>
<tr>
<td style="text-align: left;">11</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;">Trường Đề tài/dự án đang ở sau trường mã ĐXMS và Tên luồng ĐXMS</td>
<td style="text-align: left;"><p>Chuyển trường Đề tài/dự án lên đầu tiên</p>
<p>Chuyển Thông tin dự án/đề tài (bóc tách chi phí từ dự toán) lên trước trường Mã ĐXMS, Tên luồng mua sắm</p></td>
</tr>
<tr>
<td style="text-align: left;">12</td>
<td style="text-align: left;">Đề tài/dự án =&gt; Tab Dự toán chi phí</td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>- Chỉ xem không thêm mới</p>
<p>- Ghim cột Loại CP/Khoản mục chi phí</p>
<p>- Cho phép TTĐXMS tích chọn Chi mua sắm và chọn Trạng thái: Đang thực hiện/Hoàn thành (chỉ hiển thị khi tích chọn Chi mua sắm)</p></td>
</tr>
<tr>
<td style="text-align: left;">13</td>
<td style="text-align: left;">Đề tài/dự án =&gt; Tab Văn bản pháp lý</td>
<td style="text-align: left;"></td>
<td style="text-align: left;">Bổ sung cột tải file</td>
</tr>
<tr>
<td style="text-align: left;">14</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>- Hình thành gói thầu: dạng dropdown</p>
<p>- Nhân sự thực hiện: sửa trường Bước thành Vai trò. Trường vai trò hiển thị hết các vai trò trong tất cả các luồng. Người dùng chọn Vai trò, sau đó click chọn Nhân sự thực hiện (single choice) tương ứng với vai trò.</p>
<p>- Bỏ phần Danh sách người thẩm định</p></td>
</tr>
<tr>
<td style="text-align: left;">15</td>
<td style="text-align: left;">Việc của tôi</td>
<td style="text-align: left;"></td>
<td style="text-align: left;"><p>Bổ sung thêm các màn hình:</p>
<ul>
<li><p>Soạn thảo với eform</p></li>
<li><p>Giải trình và cập nhật biểu mẫu (sau khi nhận kết quả thẩm định)</p></li>
<li><p>Trình ký</p></li>
<li><p>Thẩm định biểu mẫu (dành cho CQCM)</p></li>
</ul>
<p>*Cần có ở các màn hình các thông tin sau:</p>
<ul>
<li><p>Lịch sử thẩm định ở các màn này</p></li>
<li><p>Button AI gợi ý</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: left;">16</td>
<td style="text-align: left;">Sidebar</td>
<td style="text-align: left;"></td>
<td style="text-align: left;">Đổi menu Đề tài/dự án lên trước menu Luồng mua sắm</td>
</tr>
<tr>
<td style="text-align: left;">17</td>
<td style="text-align: left;">Quản lý thầu/hợp đồng</td>
<td style="text-align: left;"></td>
<td style="text-align: left;">Ẩn menu này</td>
</tr>
<tr>
<td style="text-align: left;">18</td>
<td style="text-align: left;">Luồng mua sắm/Thêm mới</td>
<td style="text-align: left;"></td>
<td style="text-align: left;">Bổ sung thêm trường cho phép chọn Căn cứ đã được phê duyệt chưa: Đã phê duyệt/Chưa phê duyệt. Cho ĐVĐX chỉnh sửa trường này sau khi đã có thông tin báo giá cuối cùng</td>
</tr>
<tr>
<td style="text-align: left;">19</td>
<td style="text-align: left;">Quản lý hồ sơ</td>
<td style="text-align: left;">Chưa có</td>
<td style="text-align: left;"><p>Bổ sung menu Quản lý hồ sơ bên dưới menu Luồng mua sắm:</p>
<p>- Mục đích: hiển thị tất cả hồ sơ (hay được hiểu là các biểu mẫu) đã/đang chạy của các luồng mua sắm.</p>
<p>- Cho phép tìm kiếm, xem danh sách, tải về</p></td>
</tr>
</tbody>
</table>

## Open question

<table style="width:96%;">
<colgroup>
<col style="width: 8%" />
<col style="width: 37%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: left;">STT</td>
<td style="text-align: left;">Câu hỏi</td>
<td style="text-align: left;">Trả lời</td>
</tr>
<tr>
<td style="text-align: left;">1</td>
<td style="text-align: left;">Làm rõ các trạng thái Hồ sơ: Chưa có hồ sơ, Đang phê duyệt, Đã phê duyệt, Đang điều chỉnh, Dừng xử lý. Mỗi trạng thái tương ứng với bước nào của luồng ?</td>
<td style="text-align: left;"><p><mark>Trạng thái hồ sơ:<br />
- Chưa có hồ sơ</mark></p>
<p><mark>- Đang soạn thảo</mark></p>
<p><mark>- Chờ thẩm định</mark></p>
<p><mark>- Đang thẩm định</mark></p>
<p><mark>- Chờ chỉnh sửa/giải trình</mark></p>
<p><mark>- Chờ xác nhận (CQCM kiểm tra cập nhật ĐXMS)</mark></p>
<p><mark>- Chờ ký duyệt</mark></p>
<p><mark>- Đã hoàn thành (tương đương với Đã ký duyệt thành công)</mark></p></td>
</tr>
<tr>
<td style="text-align: left;">1</td>
<td style="text-align: left;">Trạng thái ĐXMS</td>
<td style="text-align: left;"><p><mark>Trạng thái đề xuất mua sắm:</mark></p>
<p><mark>- Nháp</mark></p>
<p><mark>- Đang soạn thảo</mark></p>
<p><mark>- Đang thẩm định</mark></p>
<p><mark>- Đang trình ký</mark></p>
<p><mark>- Hoàn thành</mark></p></td>
</tr>
<tr>
<td style="text-align: left;">2</td>
<td style="text-align: left;">Mức ưu tiên: Hệ thống cũ đang không có, nếu có thì phải bổ sung thêm trường Lý do khi chọn Mức Khẩn/Thượng khẩn</td>
<td style="text-align: left;">Với mỗi bước khi khởi tạo ĐXMS + hoàn thiện Công việc của tôi, cần lựa chọn Mức ưu tiên Khẩn/Thượng khẩn để tính SLA cho task sau.</td>
</tr>
<tr>
<td style="text-align: left;">3</td>
<td style="text-align: left;">Phân biệt MS01.01 và MS01.02 trên hệ thống như nào ? Người dùng tự chọn</td>
<td style="text-align: left;">Người dùng tự chọn luồng có báo cáo lên <mark>Tập đoàn hay không.</mark></td>
</tr>
<tr>
<td style="text-align: left;">4</td>
<td style="text-align: left;">Danh sách người thẩm định cần gán Họ và tên =&gt; Vai trò ?</td>
<td style="text-align: left;">Bỏ đi vì bị lặp Nhân sự thực hiện</td>
</tr>
<tr>
<td style="text-align: left;">5</td>
<td style="text-align: left;">Lịch sử thay đổi nhân sự ?</td>
<td style="text-align: left;"></td>
</tr>
<tr>
<td style="text-align: left;">6</td>
<td style="text-align: left;">Mỗi ĐXMS tương ứng với 1 hồ sơ thì có cần đối tượng “Hồ sơ” nữa không?</td>
<td style="text-align: left;">Giữ, hồ sơ sẽ hiển thị danh sách tất cả các hồ sơ của luồng mua sắm</td>
</tr>
<tr>
<td style="text-align: left;">7</td>
<td style="text-align: left;">Có cần tạo/cập nhật yêu cầu báo giá không ?</td>
<td style="text-align: left;">Có, bổ sung</td>
</tr>
</tbody>
</table>
