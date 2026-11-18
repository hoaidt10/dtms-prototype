<!-- pk-source: ../docs/SRS/02-srs/SRS Thiết kế dùng chung (Common).docx -->
<!-- pk-sha256: 672208bd7aacca4d441d6804fbea5569bbae525c7459bebddf20718568ca3aed -->
<!-- pk-generated: 2026-11-02 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SRS-COMMON — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/02-srs/SRS Thiết kế dùng chung (Common).docx`. Trích dẫn thì ghi mã **SRS-COMMON** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

## *Trường điều khiển dùng chung*

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<tbody>
<tr>
<td><strong>Loại trường</strong></td>
<td><strong>Đặc điểm</strong></td>
</tr>
<tr>
<td><strong>Free Text / Textbox - một dòng</strong></td>
<td><ul>
<li><p>Cho phép nhập nội dung trên <strong>01 dòng</strong>, không cho phép xuống dòng.</p></li>
<li><p>Max length mặc định: <strong>255 ký tự</strong>, trừ trường hợp chức năng quy định giới hạn khác.</p></li>
<li><p>Chỉ cho phép chữ cái, chữ cái có dấu, chữ số 0-9, ký tự đặc biệt “-”, “_”.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Khi dán nội dung vượt Max length, chỉ ghi nhận dữ liệu trong giới hạn cho phép.</p></li>
<li><p>Trường bắt buộc được đánh dấu *. Nếu không có giá trị hợp lệ, hiển thị lỗi theo quy định thông báo validation dùng chung; trường hợp không nhập áp dụng <strong>VL004</strong>.</p></li>
<li><p>Giá trị null, rỗng hoặc chỉ gồm khoảng trắng được xác định là chưa nhập dữ liệu.</p></li>
<li><p>Loại bỏ khoảng trắng thừa ở đầu và cuối trước khi kiểm tra/lưu dữ liệu, trừ trường hợp nghiệp vụ yêu cầu giữ nguyên.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p><strong>Chế độ xem:</strong> hiển thị trên một dòng. Trường hợp vùng hiển thị có giới hạn và nội dung bị rút gọn thì hiển thị ... và tooltip toàn bộ nội dung.</p></li>
<li><p><strong>Read-only:</strong> hiển thị giá trị hiện tại nhưng không cho phép sửa, xóa hoặc nhập lại.</p></li>
<li><p><strong>Disabled:</strong> hiển thị trạng thái không cho phép tương tác và phải có cách thể hiện khác với trường đang cho phép nhập.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Alphanumeric Code</strong></td>
<td><ul>
<li><p>Sử dụng cho các trường mã định danh của đối tượng nghiệp vụ.</p></li>
<li><p>Max length: 50 ký tự</p></li>
<li><p>Phải được chuẩn hóa về chữ in hoa. Khi người dùng nhập ký tự chữ thường, hệ thống tự động chuyển đổi thành chữ in hoa.</p></li>
<li><p>Chỉ cho phép chữ cái không dấu a-z, A-Z, chữ số 0-9, ký tự đặc biệt “_” “-”.</p></li>
<li><p>Không cho phép khoảng trắng hoặc ký tự đặc biệt.</p></li>
<li><p>Không cho phép xuống dòng.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự.</p></li>
<li><p>Khi dán nội dung vượt Max length, chỉ ghi nhận dữ liệu trong giới hạn cho phép.</p></li>
<li><p>Khi dán nội dung hệ thống tự động loại bỏ khoảng trắng, các ký tự đặc biệt không được phép.</p></li>
<li><p>Nếu trường yêu cầu duy nhất, hệ thống phải kiểm tra trùng trước khi ghi nhận dữ liệu; khi Chỉnh sửa phải loại trừ chính bản ghi đang được chỉnh sửa.</p></li>
<li><p><strong>Chế độ xem:</strong> hiển thị nguyên giá trị mã, không tự thay đổi định dạng dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Textarea - nhiều dòng</strong></td>
<td><ul>
<li><p>Cho phép nhập và hiển thị nội dung trên nhiều dòng.</p></li>
<li><p>Max length: 500 ký tự</p></li>
<li><p>Max length thực hiện theo mô tả của trường tại chức năng sử dụng.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Khi dán nội dung vượt Max length, chỉ ghi nhận dữ liệu trong giới hạn cho phép.</p></li>
<li><p>Giá trị chỉ gồm khoảng trắng được xác định là chưa nhập dữ liệu.</p></li>
<li><p>Loại bỏ khoảng trắng thừa ở đầu/cuối toàn bộ nội dung trước khi kiểm tra/lưu.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Trường hợp bắt buộc áp dụng quy tắc kiểm tra tương tự Textbox.</p></li>
<li><p>Khi nội dung vượt quá chiều cao vùng nhập, hiển thị thanh cuộn dọc.</p></li>
<li><p>Tối đa 10 dòng, nếu hơn 10 dòng thì sẽ xuất hiện thanh cuộn dọc.</p></li>
<li><p>Chế độ xem: giữ cấu trúc xuống dòng của nội dung trong phạm vi vùng hiển thị.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Password Textbox</strong></td>
<td><ul>
<li><p>Dùng cho các trường mật khẩu/mã bí mật yêu cầu che nội dung.</p></li>
<li><p>Độ dài tối đa: 25 ký tự.</p></li>
<li><p>Độ dài tối thiểu: 8 ký tự.</p></li>
<li><p>Chỉ cho phép nhập chữ cái không dấu, số, khoảng trắng và ký tự đặc biệt.</p></li>
<li><p>Yêu cầu mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt.</p></li>
<li><p>Mặc định ẩn ký tự khi người dùng nhập.</p></li>
<li><p>Nếu có biểu tượng mắt, cho phép chuyển đổi Ẩn/Hiện tạm thời; thao tác này không làm thay đổi giá trị đã nhập..</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Khi dán nội dung hệ thống tự động loại bỏ các ký tự không được phép nhập.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự.</p></li>
<li><p>Trường Xác nhận mật khẩu phải được kiểm tra khớp với mật khẩu tương ứng trước khi thực hiện thao tác xác nhận.</p></li>
<li><p>Không hiển thị lại mật khẩu hiện tại dưới dạng rõ khi tải hoặc mở lại màn hình.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Search Box</strong></td>
<td><ul>
<li><p>Cho phép nhập từ khóa tìm kiếm trên <strong>01 dòng</strong>.</p></li>
<li><p>Không cho phép xuống dòng.</p></li>
<li><p>Cho phép nhập chữ cái và chữ cái có dấu, chữ số, ký tự đặc biệt, khoảng trắng.</p></li>
<li><p>Max length mặc định: <strong>255 ký tự</strong>, trừ trường hợp chức năng quy định khác.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Loại bỏ khoảng trắng đầu/cuối trước khi thực hiện tìm kiếm.</p></li>
<li><p>Nếu giá trị sau khi chuẩn hóa là rỗng thì không áp dụng điều kiện từ khóa.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Các trường dữ liệu được tìm kiếm, cách kết hợp điều kiện, thời điểm kích hoạt tìm kiếm và xử lý tập kết quả thực hiện theo kịch bản tìm kiếm dùng chung.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Label / TextView</strong></td>
<td><ul>
<li><p>Dùng để hiển thị tiêu đề, nhãn hoặc giá trị <strong>chỉ đọc</strong>.</p></li>
<li><p>Không cho phép người dùng chỉnh sửa trực tiếp.</p></li>
<li><p>Nội dung có thể là giá trị cố định hoặc dữ liệu được cung cấp theo chức năng.</p></li>
<li><p>Đối với vùng chỉ cho phép một dòng, nội dung vượt quá vùng hiển thị được cắt bằng ... và hiển thị đầy đủ bằng tooltip.</p></li>
<li><p>Đối với vùng cho phép nhiều dòng, nội dung được xuống dòng theo vùng hiển thị; nếu chức năng giới hạn số dòng thì cắt tại dòng cuối và hiển thị ...và hiển thị đầy đủ bằng tooltip.</p></li>
<li><p>Không làm thay đổi giá trị dữ liệu gốc chỉ để phục vụ hiển thị.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Number / Numeric Input</strong></td>
<td><ul>
<li><p>Chỉ cho phép nhập ký tự số 0-9, trừ trường hợp nghiệp vụ quy định rõ kiểu số khác.</p></li>
<li><p>Min value, Max value, Min length và Max length thực hiện theo từng trường nghiệp vụ.</p></li>
<li><p>Không cho phép xuống dòng.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Khi dán nội dung hệ thống tự động loại bỏ các ký tự không cho phép nhập.</p></li>
<li><p>Đối với dữ liệu định danh/liên hệ như số điện thoại, Max Length 10 ký tự dữ liệu được xử lý dạng chuỗi số để <strong>giữ nguyên số 0 ở đầu, phải bắt đầu bằng 03x, 05x, 07x, 08x, 09x</strong>, không tự áp dụng định dạng số phục vụ tính toán.</p></li>
<li><p>Quy tắc về độ dài, đầu số, miền giá trị hoặc tính duy nhất được đặc tả tại trường nghiệp vụ tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Số điện thoại</strong></td>
<td><ul>
<li><p>Chỉ cho phép nhập ký tự số 0-9.</p></li>
<li><p>Không cho phép xuống dòng.</p></li>
<li><p>Khi đạt Max length, hệ thống không ghi nhận thêm ký tự mới.</p></li>
<li><p>Không cho phép nhập hoặc thực thi Script.</p></li>
<li><p>Khi dán nội dung hệ thống tự động loại bỏ các ký tự không cho phép nhập.</p></li>
<li><p>Max Length 10 ký tự dữ liệu được xử lý dạng chuỗi số để <strong>giữ nguyên số 0 ở đầu, phải bắt đầu bằng 03x, 05x, 07x, 08x, 09x</strong>.</p></li>
<li><p>Kiểm tra duy nhất</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Dropdown / Single Select</strong></td>
<td><ul>
<li><p>Cho phép lựa chọn <strong>duy nhất 01 giá trị</strong> tại một thời điểm.</p></li>
<li><p>Khi chưa lựa chọn, hiển thị placeholder hoặc giá trị khởi tạo theo chức năng sử dụng.</p></li>
<li><p>Khi mở control, hiển thị danh sách các giá trị được phép lựa chọn.</p></li>
<li><p>Không cho phép nhập giá trị ngoài danh sách, trừ trường hợp chức năng quy định khác.</p></li>
<li><p>Nếu nguồn dữ liệu là danh mục nghiệp vụ, mặc định chỉ cung cấp các giá trị <strong>còn hiệu lực/đang hoạt động</strong>, trừ màn hình quản trị có quy định riêng.</p></li>
<li><p>Có thể hỗ trợ nhập từ khóa để lọc nhanh danh sách nếu được thiết kế tại chức năng.</p></li>
<li><p>Nội dung một giá trị vượt vùng hiển thị được cắt bằng ... và hiển thị đầy đủ bằng tooltip.</p></li>
<li><p>Khi danh sách vượt chiều cao vùng hiển thị, hiển thị thanh cuộn dọc.</p></li>
<li><p>Trường bắt buộc chưa có lựa chọn hợp lệ thì không cho phép xác nhận form và hiển thị lỗi tại trường.</p></li>
<li><p><strong>Disabled:</strong> hiển thị giá trị hiện tại nhưng không cho phép mở hoặc thay đổi lựa chọn.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Multiple Choice dropdownlistlist</strong></td>
<td><ul>
<li><p>Danh sách giá trị được xác định cho từng trường hợp.</p></li>
<li><p>Có thể chọn được nhiều giá trị, các giá trị được chọn sẽ dạng chip. Hiển thị tối đa 5 chip, nhiều hơn 5 chip thì hiển thị: +[số chip không được hiển thị]. Hiển thị tooltip đầy đủ các chip khi di chuyển chuột tới +[số chip không được hiển thị].</p></li>
<li><p>Có thể nhấn x để bỏ chọn một giá trị.</p></li>
</ul>
<ul>
<li><p>Tự động làm nổi bật và hiển thị các giá trị đã chọn khi được click để hiển thị danh sách giá trị.</p></li>
<li><p>Hiển thị 5 bản ghi, nếu nhiều hơn 5 thì hiện thị thanh cuộn dọc.</p></li>
<li><p>Các phương án lựa chọn được sắp xếp theo thời gian cập nhật gần nhất.</p></li>
<li><p>Khi độ dài của các phương án lựa chọn lớn hơn chiều dài của ô định dạng thì chỉ hiện thị trên một 1 dòng và thay các từ còn thiếu bằng “…”. Hiển thị tooltip đầy đủ text khi di chuyển chuột tới các phương án lựa chọn.</p></li>
<li><p>Người dùng có thể nhập một số kí tự tiền tố để lọc ra các phương án lựa chọn tương ứng với tiền tố.</p></li>
<li><p><strong>Chế độ xem</strong>: Chỉ hiển thị các giá trị đã chọn cách nhau bởi dấu ngắt dòng. (Thông thường trường này được sử dụng cho bộ lọc trong chế độ xem danh sách).</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Single/Multiple choice Single choice dropdownlist with Fill In</strong></td>
<td><ul>
<li><p>Danh sách giá trị được xác định cho từng trường hợp.</p></li>
</ul>
<ul>
<li><p>Tương tự như Single/Multiple choice Single choice dropdownlist list, nhưng mục cuối cùng là trường nhập để người dùng có thể điền giá trị mới.</p></li>
<li><p>Giá trị mới này không được thêm vào danh sách giá trị và chỉ được sử dụng cho bản ghi hiện tại.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Checkbox</strong></td>
<td><ul>
<li><p>Có hai trạng thái cơ bản: <strong>Được chọn</strong> và <strong>Không được chọn</strong>.</p></li>
<li><p>Cho phép người dùng chọn/bỏ chọn khi control ở trạng thái cho phép thao tác.</p></li>
<li><p>Có thể sử dụng trạng thái <strong>Indeterminate</strong> khi Checkbox đại diện cho một nhóm và chỉ một phần các phần tử con đang được chọn.</p></li>
<li><p>Trường hợp sử dụng trong cấu trúc cha-con, quy tắc chọn/bỏ chọn node cha và node con được quy định tại chức năng sử dụng.</p></li>
<li><p><strong>Disabled:</strong> hiển thị trạng thái hiện tại nhưng không cho phép thay đổi.</p></li>
<li><p>Trạng thái được chọn phải được thể hiện rõ ràng, không chỉ phụ thuộc vào màu sắc.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Toggle Switch / Toggle Button</strong></td>
<td><ul>
<li><p>Dùng cho thuộc tính có <strong>hai trạng thái đối lập</strong>, ví dụ: Bật/Tắt, Có/Không, Đang hoạt động/Dừng hoạt động.</p></li>
<li><p>Giá trị ban đầu phải phản ánh đúng trạng thái hiện tại của dữ liệu.</p></li>
<li><p>Chỉ cho phép thay đổi khi người dùng có quyền thực hiện thao tác tương ứng.</p></li>
<li><p>Khi thao tác yêu cầu xác nhận, trạng thái dữ liệu chưa được ghi nhận chính thức trước khi người dùng xác nhận.</p></li>
<li><p>Trong thời gian hệ thống đang xử lý yêu cầu, không cho phép gửi lặp thao tác thay đổi trạng thái.</p></li>
<li><p>Nếu người dùng hủy hoặc việc cập nhật thất bại, Toggle phải trở về trạng thái trước thao tác.</p></li>
<li><p><strong>Disabled:</strong> hiển thị trạng thái hiện tại nhưng không cho phép thay đổi.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Single choice Radio Buttons</strong></td>
<td><ul>
<li><p>Danh sách giá trị được xác định cho từng trường hợp.</p></li>
<li><p>Cho phép người dùng chọn một item từ danh sách item.</p></li>
<li><p><strong>Chế độ xem</strong>: Chỉ hiển thị item đã chọn bằng một dòng text đơn.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Date Picker</strong></td>
<td><ul>
<li><p>Định dạng hiển thị mặc định: <strong>DD/MM/YYYY</strong> hh:mm:ss, trừ trường hợp chức năng quy định khác.</p></li>
<li><p>Cho phép lựa chọn ngày thông qua Date Picker.</p></li>
<li><p>Nếu chức năng cho phép nhập trực tiếp, hệ thống phải kiểm tra giá trị ngày tồn tại hợp lệ theo lịch.</p></li>
<li><p>Giá trị mặc định, ngày nhỏ nhất và ngày lớn nhất thực hiện theo nghiệp vụ của trường.</p></li>
<li><p>Không chấp nhận ngày không tồn tại hoặc sai định dạng.</p></li>
<li><p>Các ràng buộc nghiệp vụ như “không lớn hơn ngày hiện tại”, “Từ ngày ≤ Đến ngày” phải được quy định tại trường/chức năng sử dụng.</p></li>
<li><p><strong>Chế độ xem:</strong> hiển thị ngày trên một dòng theo định dạng quy định.</p></li>
<li><p><strong>Read-only/Disabled:</strong> không cho phép thay đổi giá trị.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Date Only</strong></td>
<td><ul>
<li><p>Định dạng hiển thị mặc định: <strong>DD/MM/YYYY</strong>, trừ trường hợp chức năng quy định khác.</p></li>
<li><p>Cho phép lựa chọn ngày thông qua Date Picker.</p></li>
<li><p>Nếu chức năng cho phép nhập trực tiếp, hệ thống phải kiểm tra giá trị ngày tồn tại hợp lệ theo lịch.</p></li>
<li><p>Giá trị mặc định, ngày nhỏ nhất và ngày lớn nhất thực hiện theo nghiệp vụ của trường.</p></li>
<li><p>Không chấp nhận ngày không tồn tại hoặc sai định dạng.</p></li>
<li><p>Các ràng buộc nghiệp vụ như “không lớn hơn ngày hiện tại”, “Từ ngày ≤ Đến ngày” phải được quy định tại trường/chức năng sử dụng.</p></li>
<li><p><strong>Chế độ xem:</strong> hiển thị ngày trên một dòng theo định dạng quy định.</p></li>
<li><p><strong>Read-only/Disabled:</strong> không cho phép thay đổi giá trị.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Button</strong></td>
<td><ul>
<li><p>Dùng để kích hoạt một hành động xác định của chức năng.</p></li>
<li><p>Nội dung trên nút phải thể hiện rõ hành động, ví dụ: <strong>Thêm mới, Lưu lại, Xóa, Hủy bỏ, Đóng, Xác nhận</strong>.</p></li>
<li><p>Có các trạng thái tối thiểu: Bình thường, Hover/Focus, Disabled và Processing/Loading khi đang xử lý.</p></li>
<li><p>Nếu thao tác phụ thuộc dữ liệu nhập, hệ thống thực hiện kiểm tra dữ liệu trước khi xử lý hành động.</p></li>
<li><p>Trong thời gian đang thực hiện yêu cầu, không cho phép người dùng gửi lặp cùng một thao tác.</p></li>
<li><p>Khi xử lý thất bại và người dùng được phép thao tác lại, nút phải trở về trạng thái cho phép sử dụng.</p></li>
<li><p>Nút Disabled không thực hiện hành động khi được chọn.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Icon Button</strong></td>
<td><ul>
<li><p>Dùng cho các hành động biểu diễn bằng biểu tượng như Xem chi tiết, Chỉnh sửa, Xóa, Quay lại, Mở/Đóng.</p></li>
<li><p>Mỗi icon chỉ đại diện cho <strong>01 hành động xác định</strong>.</p></li>
<li><p>Khi icon không có nhãn chữ đi kèm, hiển thị tooltip mô tả tên thao tác khi người dùng di chuột vào.</p></li>
<li><p>Có trạng thái Hover/Focus để thể hiện khả năng tương tác.</p></li>
<li><p>Thao tác phải tác động đúng đối tượng/bản ghi mà icon thuộc về.</p></li>
<li><p>Chỉ hiển thị hoặc cho phép thao tác khi người dùng đáp ứng điều kiện quyền của chức năng.</p></li>
<li><p>Nếu hành động phát sinh yêu cầu xử lý, áp dụng cơ chế chống thao tác lặp tương tự Button.</p></li>
<li><p>Disabled không thực hiện hành động.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Link / Text Link</strong></td>
<td><ul>
<li><p>Dùng cho hành động điều hướng hoặc hành động thứ cấp như Quên mật khẩu, Gửi lại mã, chuyển phương thức xử lý.</p></li>
<li><p>Nội dung Link phải mô tả rõ đích đến hoặc hành động thực hiện.</p></li>
<li><p>Có các trạng thái Normal, Hover, Focus và Disabled khi cần.</p></li>
<li><p>Nếu Link kích hoạt yêu cầu xử lý, không cho phép gửi lặp trong thời gian yêu cầu đang thực hiện.</p></li>
<li><p>Disable Link không thực hiện hành động khi người dùng chọn.</p></li>
<li><p>Điều kiện hiển thị, thời gian chờ hoặc giới hạn tần suất của Link được quy định tại chức năng sử dụng.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Table Column</strong></td>
<td><ul>
<li><p>Dùng để hiển thị một thuộc tính của bản ghi trong bảng danh sách.</p></li>
<li><p>Nội dung text mặc định hiển thị tối đa <strong>02 dòng</strong>, trừ trường hợp chức năng quy định khác.</p></li>
<li><p>Nội dung vượt vùng hiển thị được cắt bằng ....</p></li>
<li><p>Khi di chuột vào nội dung đã bị cắt, hiển thị tooltip với toàn bộ giá trị.</p></li>
<li><p>Giá trị null hoặc không có dữ liệu hiển thị -, trừ trường hợp nghiệp vụ có quy định khác.</p></li>
<li><p>Các giá trị ngắn như STT, Mã, trạng thái có thể hiển thị trên <strong>01 dòng</strong>.</p></li>
<li><p>Không tự thay đổi hoặc rút gọn dữ liệu gốc chỉ để phục vụ hiển thị.</p></li>
<li><p>Cột thao tác sử dụng Button/Icon Button theo quy tắc tương ứng; chỉ hiển thị thao tác mà người dùng được phép thực hiện.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Date range picker</strong></td>
<td><ul>
<li><p><strong>Tên trường:</strong> Khoảng thời gian tìm kiếm</p></li>
<li><p><strong>Loại điều khiển:</strong> Pop-up Calendar.</p></li>
<li><p><strong>Định dạng hiển thị:</strong> DD/MM/YYYY - DD/MM/YYYY (Ví dụ: 01/01/2026 - 02/03/2026).</p></li>
<li><p><strong>Mục đích:</strong> Cho phép người dùng chọn một khoảng thời gian (Từ ngày - Đến ngày) để lọc dữ liệu tìm kiếm.</p></li>
<li><p>Người dùng không được phép nhập liệu trực tiếp từ bàn phím. Mọi tương tác phải thông qua bảng lịch (Pop-up).</p></li>
<li><p><strong>Default:</strong> hiển thị khoảng thời gian ([Ngày đầu tiên của năm hiện tại] - Ngày hiện tại). Ví dụ: 01/01/2026 - 02/03/2026</p></li>
<li><p>Logic chọn ngày</p></li>
</ul>
<blockquote>
<p>- <strong>Lần click 1:</strong> Chọn ngày bắt đầu (Start Date).</p>
<p>- <strong>Lần click 2:</strong> Chọn ngày kết thúc (người dùng đặt).</p>
</blockquote>
<ul>
<li><p><strong>Ràng buộc thời gian:</strong> Ngày kết thúc phải &gt;= Ngày bắt đầu. Hệ thống tự động hoán đổi hoặc thông báo nếu người dùng chọn sai thứ tự.</p></li>
<li><p><strong>Trạng thái Active:</strong> Khi người dùng click vào Trường này, bảng lịch (Pop-up) sẽ hiển thị ngay bên dưới.</p></li>
<li><p><strong>Thành phần trên Pop-up:</strong></p></li>
</ul>
<ul>
<li><p>Điều hướng: Mũi tên &lt; và &gt; để chuyển đổi giữa các tháng/năm.</p></li>
<li><p><strong>Hiển thị:</strong> Tên tháng và năm hiện tại (Ví dụ: Tháng Ba 2026).</p></li>
<li><p><strong>Highlight:</strong> * Ngày đang chọn: Hiển thị vòng tròn màu xanh đậm.</p></li>
</ul>
<ul>
<li><p><strong>Các nút chức năng:</strong></p></li>
</ul>
<ul>
<li><p><strong>Hôm nay (Today):</strong> Tự động chọn ngày hiện tại cho cả điểm đầu và điểm cuối.</p></li>
<li><p><strong>Xóa (Clear):</strong> Xóa toàn bộ giá trị đã chọn trong ô và đóng/reset bảng lịch.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Textbox tìm kiếm trong Dropdown</strong></td>
<td><ul>
<li><p>Hiển thị trong Dropdown, phía trên danh sách giá trị lựa chọn.</p></li>
<li><p>Cho phép người dùng nhập từ khóa để tìm kiếm nhanh giá trị trong danh sách.</p></li>
<li><p>Tìm kiếm theo một phần nội dung, không yêu cầu nhập chính xác toàn bộ giá trị.</p></li>
<li><p>Tìm kiếm không phân biệt chữ hoa/chữ thường.</p></li>
<li><p>Hệ thống tự động loại bỏ khoảng trắng thừa ở đầu và cuối từ khóa khi tìm kiếm.</p></li>
<li><p>Khi người dùng nhập từ khóa, hệ thống lọc và hiển thị các giá trị phù hợp.</p></li>
<li><p>Khi xóa toàn bộ từ khóa, hệ thống hiển thị lại danh sách ban đầu.</p></li>
<li><p>Trường hợp không có dữ liệu phù hợp, hiển thị <strong>“Không tìm thấy kết quả phù hợp.”</strong></p></li>
<li><p>Từ khóa tìm kiếm không được ghi nhận là giá trị của Dropdown; giá trị chỉ được ghi nhận khi người dùng chọn một bản ghi hợp lệ.</p></li>
<li><p>Khi đóng và mở lại Dropdown, Textbox tìm kiếm được khởi tạo về rỗng; giá trị đã chọn của Dropdown vẫn được giữ nguyên.</p></li>
<li><p>Với Dropdown dạng cây, khi tìm kiếm hệ thống hiển thị kết quả cùng các node cha cần thiết để thể hiện đúng cấu trúc cây; các quy tắc cho phép/không cho phép chọn node vẫn được giữ nguyên.</p></li>
</ul></td>
</tr>
</tbody>
</table>

## ***Thông báo chung***

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 85%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Loại thông báo</strong></td>
<td style="text-align: center;"><strong>Mô tả</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>Thông báo lỗi ngay dưới trường lỗi</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hiển thị nội dung thông báo dưới dạng text màu đỏ ngay bên dưới trường phát sinh lỗi.</p></li>
<li><p>Trường phát sinh lỗi được hiển thị viền đỏ để người dùng nhận biết vị trí cần xử lý.</p></li>
<li><p>Sử dụng cho các lỗi có thể xác định trực tiếp tại trường, bao gồm: chưa nhập trường bắt buộc, sai định dạng, không đáp ứng độ dài, giá trị không hợp lệ, dữ liệu trùng hoặc các validation khác của trường.</p></li>
<li><p>Khi một form có nhiều trường không hợp lệ, hệ thống hiển thị đồng thời thông báo tại tất cả các trường xác định được lỗi.</p></li>
<li><p>Không xóa hoặc thay đổi dữ liệu người dùng đã nhập tại các trường khác khi phát sinh validation lỗi.</p></li>
<li><p>Khi người dùng chỉnh sửa giá trị và trường đáp ứng điều kiện hợp lệ, hệ thống bỏ trạng thái viền đỏ và ẩn thông báo lỗi tương ứng.</p></li>
<li><p>Nếu người dùng tiếp tục thực hiện Lưu/Xác nhận khi còn trường không hợp lệ, hệ thống không thực hiện thao tác ghi nhận dữ liệu.</p></li>
<li><p>Không sử dụng Toast thay thế cho lỗi có thể xác định chính xác tại một trường dữ liệu.</p></li>
</ul>
<table>
<tbody>
<tr>
<td style="text-align: center;"><strong>Mã</strong></td>
<td style="text-align: center;"><strong>Nội dung cảnh báo</strong></td>
<td style="text-align: center;"><strong>Trường hợp áp dụng</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL001</strong></td>
<td style="text-align: center;">Mật khẩu nhập lại chưa trùng khớp</td>
<td style="text-align: center;">Giá trị tại trường nhập lại mật khẩu không trùng với mật khẩu cần đối chiếu.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL002</strong></td>
<td style="text-align: center;">Mật khẩu nhập lại chưa trùng khớp</td>
<td style="text-align: center;">Giữ theo bộ mã thông báo đã có trong thiết kế mẫu khi chức năng đang tham chiếu mã này.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL003</strong></td>
<td style="text-align: center;">&lt;Tên trường&gt; không hợp lệ</td>
<td style="text-align: center;">Giá trị không đáp ứng điều kiện hợp lệ của trường và không có thông báo định dạng cụ thể hơn.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL004</strong></td>
<td style="text-align: center;">Bạn cần nhập &lt;Tên trường&gt;.</td>
<td style="text-align: center;">Trường nhập liệu bắt buộc chưa có giá trị hoặc giá trị sau khi chuẩn hóa là rỗng.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL005</strong></td>
<td style="text-align: center;">Không được nhập quá &lt;maxlength&gt; ký tự.</td>
<td style="text-align: center;">Giá trị vượt quá số ký tự tối đa được quy định.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL006</strong></td>
<td style="text-align: center;">&lt;Tên trường&gt; không đúng định dạng</td>
<td style="text-align: center;">Giá trị không đáp ứng định dạng của trường.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL007</strong></td>
<td style="text-align: center;">Mật khẩu không được chứa khoảng trắng</td>
<td style="text-align: center;">Giá trị mật khẩu chứa khoảng trắng trong trường hợp chính sách mật khẩu không cho phép.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL008</strong></td>
<td style="text-align: center;">Mật khẩu không được chứa ký tự tiếng Việt có dấu</td>
<td style="text-align: center;">Giá trị mật khẩu chứa ký tự tiếng Việt có dấu trong trường hợp chính sách mật khẩu không cho phép.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL009</strong></td>
<td style="text-align: center;">&lt;Tên trường&gt; đã tồn tại. Vui lòng kiểm tra lại.</td>
<td style="text-align: center;">Trường yêu cầu tính duy nhất có giá trị đã tồn tại. Khi Chỉnh sửa, việc kiểm tra trùng phải loại trừ chính bản ghi đang chỉnh sửa.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL010</strong></td>
<td style="text-align: center;">Bạn cần chọn &lt;Tên trường&gt;.</td>
<td style="text-align: center;">Trường dạng lựa chọn bắt buộc chưa có giá trị được chọn.</td>
</tr>
<tr>
<td style="text-align: center;"><strong>VL011</strong></td>
<td style="text-align: center;">&lt;Tên trường&gt; phải có độ dài từ &lt;minlength&gt; đến &lt;maxlength&gt; ký tự.</td>
<td style="text-align: center;">Giá trị không đáp ứng khoảng độ dài tối thiểu/tối đa được quy định cho trường.</td>
</tr>
</tbody>
</table></td>
</tr>
<tr>
<td style="text-align: center;"><strong>Thông báo trong trường lỗi</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hiển thị text lỗi màu đỏ bên trong trường và che nội dung hiển thị của trường trong trạng thái lỗi.</p></li>
<li><p>Dữ liệu người dùng đã nhập vẫn được giữ lại, không bị xóa.</p></li>
<li><p>Khi người dùng focus/chọn lại trường, thông báo lỗi được ẩn và giá trị đã nhập được hiển thị lại để chỉnh sửa.</p></li>
<li><p>Khi người dùng rời trường hoặc thực hiện kiểm tra lại, nếu dữ liệu vẫn không hợp lệ thì hệ thống tiếp tục hiển thị trạng thái lỗi.</p></li>
<li><p>Trên cùng một trường tại cùng một thời điểm chỉ sử dụng một hình thức hiển thị lỗi: <strong>lỗi dưới trường</strong> hoặc <strong>lỗi trong trường</strong> theo thiết kế của màn hình.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>Thông báo thông tin</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hiển thị dưới dạng popup khi cần cung cấp một thông tin mà người dùng cần ghi nhận trước khi tiếp tục thao tác.</p></li>
<li><p>Popup hiển thị tại trung tâm màn hình.</p></li>
<li><p>Nội dung phải mô tả rõ trạng thái, sự kiện hoặc nguyên nhân cần thông báo; không hiển thị thông tin kỹ thuật nội bộ không cần thiết cho người dùng.</p></li>
<li><p>Popup có nút <strong>Đóng</strong> hoặc hành động đóng tương đương.</p></li>
<li><p>Nhấn bên ngoài popup không làm đóng popup.</p></li>
<li><p>Sau khi người dùng đóng popup, hệ thống quay lại màn hình/trạng thái trước khi hiển thị thông báo, trừ khi chức năng có quy định điều hướng khác.</p></li>
<li><p>Việc hiển thị thông báo thông tin không tự làm thay đổi dữ liệu nghiệp vụ.</p></li>
</ul>
<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center;"><strong>Mã</strong></td>
<td style="text-align: center;"><strong>Nội dung thông tin</strong></td>
</tr>
<tr>
<td style="text-align: center;"><strong>WN001</strong></td>
<td style="text-align: center;">“Bạn chưa có quyền truy cập chức năng này.”</td>
</tr>
</tbody>
</table></td>
</tr>
<tr>
<td style="text-align: center;"><strong>Thông báo xác nhận</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hiển thị dưới dạng popup khi một thao tác yêu cầu người dùng xác nhận trước khi hệ thống thực hiện.</p></li>
<li><p>Popup hiển thị tại trung tâm màn hình.</p></li>
<li><p>Nội dung xác nhận phải thể hiện rõ <strong>hành động</strong> và <strong>đối tượng bị tác động</strong>; trường hợp cần thiết hiển thị tên/mã đối tượng để người dùng đối chiếu.</p></li>
<li><p>Popup cung cấp 02 hành động: một hành động xác nhận và một hành động hủy/không xác nhận. Tên nút được đặt theo ngữ cảnh, ví dụ: <strong>Xóa/Hủy bỏ</strong>, <strong>Có/Không</strong>, <strong>Xác nhận/Hủy</strong>.</p></li>
<li><p>Nhấn bên ngoài popup không làm đóng popup.</p></li>
<li><p>Khi người dùng chọn hành động hủy/không xác nhận, hệ thống đóng popup và không thực hiện thao tác cần xác nhận.</p></li>
<li><p>Khi người dùng xác nhận, hệ thống thực hiện hành động tương ứng theo luồng của chức năng.</p></li>
<li><p>Trong thời gian xử lý sau khi xác nhận, không cho phép gửi lặp cùng một thao tác.</p></li>
<li><p>Đối với form Thêm mới/Chỉnh sửa, nút <strong>Hủy bỏ</strong> đóng popup/form ngay và không yêu cầu hiển thị popup xác nhận hủy, trừ trường hợp chức năng có quy định riêng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>Thông báo dạng Toast</strong></td>
<td style="text-align: center;"><ul>
<li><p>Hiển thị thông báo ngắn về kết quả hoặc trạng thái xử lý của một hành động.</p></li>
<li><p>Hiển thị tại góc dưới bên phải màn hình.</p></li>
<li><p>Thời gian hiển thị mặc định: <strong>10 giây</strong>, sau đó tự động biến mất.</p></li>
<li><p>Thông báo thành công sử dụng biểu tượng <strong>checkmark</strong>.</p></li>
<li><p>Thông báo lỗi sử dụng biểu tượng <strong>alert</strong>.</p></li>
<li><p>Thông báo cảnh báo sử dụng biểu tượng <strong>info</strong>.</p></li>
<li><p>Khoảng cách tới cạnh phải màn hình: <strong>20px</strong>.</p></li>
<li><p>Khoảng cách tới cạnh dưới màn hình: <strong>20px</strong>.</p></li>
<li><p>Chiều rộng mặc định: <strong>400px</strong>.</p></li>
<li><p>Khi có nhiều Toast cùng hiển thị, Toast mới nhất nằm phía trên Toast trước đó; khoảng cách giữa hai Toast là <strong>20px</strong>.</p></li>
<li><p>Chỉ hiển thị Toast thành công sau khi hệ thống xác định thao tác đã hoàn tất thành công.</p></li>
<li><p>Nội dung và mã Toast áp dụng theo <strong>mục 4.3 - Danh sách thông báo dạng Toast</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;"><strong>Thông báo dạng Long Toast</strong></td>
<td style="text-align: center;"><ul>
<li><p>Sử dụng cho thông tin quan trọng cần duy trì trên màn hình để người dùng chủ động đọc và đóng.</p></li>
<li><p>Hiển thị tại góc dưới bên phải màn hình.</p></li>
<li><p>Không tự động biến mất; người dùng nhấn biểu tượng <strong>X</strong> để đóng thông báo.</p></li>
<li><p>Kiểu biểu tượng áp dụng theo trạng thái Thành công/Lỗi/Cảnh báo tương tự Toast thông thường.</p></li>
<li><p>Khoảng cách tới cạnh phải màn hình: <strong>20px</strong>.</p></li>
<li><p>Khoảng cách tới cạnh dưới màn hình: <strong>20px</strong>.</p></li>
<li><p>Chiều rộng mặc định: <strong>400px</strong>.</p></li>
<li><p>Khi có nhiều thông báo, thông báo mới nhất nằm phía trên thông báo trước đó; khoảng cách giữa các thông báo là <strong>20px</strong>.</p></li>
</ul></td>
</tr>
</tbody>
</table>

## 

## ***SDanh sách thông báo dạng Toast***

### ***Danh sách thông báo***

|  |  |  |  |
|:--:|:--:|:--:|:--:|
| **Mã** | **Loại** | **Nội dung thông báo** | **Phạm vi áp dụng** |
| **TB001** | Thành công | Thêm mới {Đối tượng} thành công. | Sử dụng khi tạo mới một bản ghi thành công. |
| **TB002** | Thành công | Cập nhật {Đối tượng} thành công. | Sử dụng khi cập nhật thông tin của bản ghi thành công. |
| **TB003** | Thành công | Xóa {Đối tượng} thành công. | Sử dụng khi xóa bản ghi thành công. |
| **TB004** | Thành công | Cập nhật trạng thái {Đối tượng} thành công. | Sử dụng khi Bật/Tắt hoặc thay đổi trạng thái bản ghi thành công. |
| **TB005** | Thành công | {Thao tác} thành công. | Sử dụng cho thao tác thành công không thuộc bốn trường hợp chuẩn phía trên, ví dụ Đổi mật khẩu, Phân quyền hoặc cấu hình. |
| **TB006** | Lỗi | {Thao tác} không thành công. Vui lòng thử lại. | Sử dụng khi thao tác thất bại nhưng không có nguyên nhân nghiệp vụ cụ thể để thông báo. |
| **TB007** | Lỗi | {Thao tác} không thành công. {Nội dung lỗi} | Sử dụng khi thao tác thất bại và có nguyên nhân nghiệp vụ cần thông báo cho người dùng. |
| **TB008** | Lỗi | Không thể tải dữ liệu. Vui lòng thử lại. | Sử dụng khi không tải được dữ liệu cần thiết của chức năng và lỗi không được hiển thị trực tiếp tại vùng dữ liệu. |
| **TB009** | Lỗi | Máy chủ phản hồi chậm. Vui lòng thử lại. | Sử dụng khi yêu cầu vượt quá thời gian xử lý cho phép/timeout. |
| **TB010** | Lỗi | Lỗi hệ thống. Vui lòng thử lại sau. | Sử dụng khi xảy ra lỗi hệ thống và không có thông báo nghiệp vụ cụ thể hơn. |
| **TB011** | Lỗi | Mất kết nối mạng. Vui lòng kiểm tra kết nối và thử lại. | Sử dụng khi không thể tiếp tục thao tác do mất kết nối mạng. |
| **TB012** | Lỗi | Bạn không có quyền thực hiện chức năng này. | Sử dụng khi người dùng không có hoặc không còn quyền thực hiện thao tác. |
| **TB013** | Lỗi | {Đối tượng} không tồn tại hoặc đã bị xóa. | Sử dụng khi bản ghi người dùng đang thao tác không còn tồn tại tại thời điểm xử lý. |
| **TB014** | Cảnh báo | Dữ liệu đã có sự thay đổi trên hệ thống. Vui lòng làm mới dữ liệu và thử lại. | Sử dụng khi dữ liệu hiện tại đã thay đổi so với dữ liệu người dùng đang xem/chỉnh sửa. |
| **TB015** | Lỗi | Không thể xóa {Đối tượng} do dữ liệu đang được sử dụng hoặc có ràng buộc trên hệ thống. | Sử dụng khi bản ghi không đáp ứng điều kiện cho phép xóa. |
| **TB016** | Lỗi | Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại. | Sử dụng khi phiên làm việc không còn hiệu lực và người dùng cần xác thực lại. |
| **TB017** | Lỗi | Tên đăng nhập hoặc mật khẩu không chính xác. | Sử dụng khi xác thực bằng tài khoản/mật khẩu không thành công. |
| **TB018** | Lỗi | Tài khoản đang bị khóa. Vui lòng liên hệ quản trị hệ thống để được hỗ trợ. | Sử dụng khi tài khoản tồn tại nhưng không được phép đăng nhập do đang bị khóa/dừng hoạt động. |
| **TB019** | Lỗi | Không tìm thấy tài khoản với thông tin đã cung cấp. | Sử dụng khi chức năng tra cứu/xác thực không xác định được tài khoản tương ứng. |
| **TB020** | Lỗi | Mã xác thực không chính xác. Vui lòng kiểm tra lại. | Sử dụng khi OTP/mã xác thực không khớp với challenge hiện tại. |
| **TB021** | Lỗi | Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới. | Sử dụng khi OTP/mã xác thực đã hết thời gian hiệu lực. |
| **TB022** | Lỗi | Bạn đã vượt quá số lần nhập mã xác thực cho phép. Vui lòng yêu cầu mã mới. | Sử dụng khi số lần xác thực sai vượt giới hạn được cấu hình. |
| **TB023** | Cảnh báo | Bạn đã gửi yêu cầu mã xác thực quá số lần cho phép. Vui lòng thử lại sau. | Sử dụng khi người dùng gửi lại OTP/mã xác thực vượt giới hạn tần suất. |
| **TB024** | Thành công | Mã xác thực đã được gửi đến {Kênh nhận}. | Sử dụng sau khi hệ thống gửi OTP/mã xác thực thành công qua kênh tương ứng. |
| **TB025** | Lỗi | Không thể xóa tài khoản của chính bạn. | Sử dụng khi người quản trị cố gắng xóa chính tài khoản đang đăng nhập. |
| **TB026** | Lỗi | Chức năng chưa sẵn sàng. Vui lòng liên hệ quản trị hệ thống. | Sử dụng khi cấu hình điều hướng/chức năng không tồn tại hoặc chưa sẵn sàng để sử dụng. |
| **TB027** | Lỗi | Không thể thực hiện thao tác này khi hồ sơ ở trạng thái Hoàn thành. | Sử dụng khi người dùng cố gắng thực hiện các thao tác không được phép (tải tệp lên, xóa, sửa) trên hồ sơ đang ở trạng thái Hoàn thành. |
| **TB028** | Lỗi | Vui lòng bổ sung thành viên cho các vai trò bắt buộc còn thiếu: {Danh sách vai trò}. | Sử dụng khi người dùng lưu thông tin hội đồng |
| **TB029** | Lỗi | {Thao tác} không thành công. Chưa đáp ứng các điều kiện: {Danh sách điều kiện chưa đạt}. | Sử dụng khi hệ thống thực hiện kiểm tra nhiều điều kiện nghiệp vụ bắt buộc trước một thao tác và phát hiện có ít nhất một điều kiện không đạt. Hệ thống tổng hợp toàn bộ các điều kiện không đạt để hiển thị cho người dùng. |
| **TB030** | Lỗi | Dung lượng file không được vượt quá ({Dung lượng tối đa}). Vui lòng kiểm tra lại. | Sử dụng khi tệp tải lên vượt quá kích thước tối đa cho phép của hệ thống. |
| **TB031** | Lỗi | Định dạng file không hợp lệ. Vui lòng sử dụng định dạng {Định dạng hỗ trợ}. | Sử dụng khi tệp tải lên không đúng định dạng hoặc phần mở rộng cho phép của hệ thống. |
| **TB032** | Cảnh báo | Cần ít nhất 1 hồ sơ {Loại hồ sơ}, 1 hồ sơ {Loại hồ sơ} để tạo hồ sơ {Loại hồ sơ}. Vui lòng kiểm tra lại. | Sử dụng khi kiểm tra điều kiện tạo mới hồ sơ. |

### ***Tham số dùng trong thông báo***

|  |  |  |
|:--:|:--:|:--:|
| **Tham số** | **Nội dung** | **Ví dụ** |
| **{Đối tượng}** | Tên đối tượng nghiệp vụ đang được thao tác. | Vai trò thực hiện, Nguồn kinh phí, Lĩnh vực, Đối tác, Chức danh khoa học, Người dùng, Vai trò. |
| **{Thao tác}** | Tên hành động vừa được thực hiện. | Đổi mật khẩu, Phân quyền người dùng, Cập nhật quyền. |
| **{Nội dung lỗi}** | Nguyên nhân nghiệp vụ cụ thể của thao tác thất bại. | Dữ liệu không còn hợp lệ; trạng thái bản ghi không cho phép thực hiện. |
| **{Kênh nhận}** | Kênh mà hệ thống sử dụng để gửi mã xác thực. | Email, số điện thoại hoặc kênh được cấu hình tại chức năng. |
| **{Dung lượng tối đa}** | Kích thước tệp tối đa được phép tải lên hệ thống. | 10MB, 50MB. |
| **{Định dạng hỗ trợ}** | Danh sách các định dạng tệp hoặc phần mở rộng được phép tải lên hệ thống. | .pdf, .docx, .xlsx, .png, .jpg. |

### ***Quy tắc sử dụng***

|  |  |  |
|:--:|:--:|:--:|
| **STT** | **Quy tắc** | **Mô tả** |
| 1 | Ưu tiên mã cụ thể | Khi có mã thông báo mô tả đúng tình huống, sử dụng mã cụ thể thay vì TB006/TB007. |
| 2 | Thông báo thành công | Chỉ hiển thị TB001-TB005 sau khi hệ thống xác nhận thao tác đã xử lý thành công. |
| 3 | Lỗi tại trường nhập liệu | Các lỗi bắt buộc, sai định dạng, maxlength, minlength, dữ liệu trùng hoặc so khớp giữa các trường áp dụng **mục 4.2 - Thông báo chung**, không sử dụng Toast thay thế. |
| 4 | Lỗi có nguyên nhân nghiệp vụ | Nếu lỗi không gắn trực tiếp với một trường và có nội dung nghiệp vụ cụ thể, sử dụng TB007 hoặc mã lỗi chuyên biệt tương ứng. |
| 5 | Lỗi hệ thống | Sử dụng TB010 khi không xác định được nguyên nhân nghiệp vụ phù hợp để hiển thị cho người dùng. |
| 6 | Timeout | Khi hiển thị TB009, hệ thống không được tự coi thao tác là thành công nếu chưa nhận được kết quả xác nhận. |
| 7 | Bản ghi không tồn tại | Khi sử dụng TB013, hệ thống không tiếp tục xử lý trên dữ liệu cũ; cập nhật lại dữ liệu giao diện nếu chức năng yêu cầu. |
| 8 | Dữ liệu thay đổi đồng thời | TB014 được sử dụng khi bản ghi vẫn tồn tại nhưng dữ liệu đã thay đổi và trạng thái người dùng đang thao tác không còn đồng bộ. |
| 9 | Xóa có ràng buộc | TB015 được sử dụng khi hệ thống xác định bản ghi tồn tại nhưng không được phép xóa do đang được sử dụng hoặc có ràng buộc nghiệp vụ. |
| 10 | OTP/mã xác thực | TB020-TB024 chỉ áp dụng cho luồng có sử dụng OTP/mã xác thực; thời hạn, số lần thử và giới hạn gửi lại lấy theo cấu hình/chính sách của chức năng, không cố định tại nội dung common. |
| 11 | Nội dung tham số | Trước khi hiển thị Toast, các tham số phải được thay thế bằng giá trị thực tế. Không hiển thị {Đối tượng}, {Thao tác} hoặc {Kênh nhận} trực tiếp cho người dùng. |
| 12 | Nội dung lỗi kỹ thuật | Không hiển thị stack trace, exception, endpoint, câu lệnh kỹ thuật hoặc thông tin nội bộ của hệ thống trong {Nội dung lỗi}. |
| 13 | Empty State | Trường hợp danh sách không có dữ liệu hoặc không có kết quả tìm kiếm không sử dụng Toast; hiển thị trạng thái trực tiếp tại vùng dữ liệu. |
| 14 | Lỗi tải cục bộ | Nếu lỗi chỉ ảnh hưởng một vùng/thành phần và giao diện đã có Error State tại chính vùng đó, ưu tiên hiển thị Error State và thao tác **Thử lại**, không hiển thị thêm Toast trùng nội dung. |

## ***Kịch bản phân trang & Load more***

### ***Phân trang***

#### ***Thông tin chung***

|  |  |
|----|----|
| **Nội dung** | **Mô tả** |
| **Mục đích** | Chia tập dữ liệu thành các trang nhỏ nhằm giới hạn số lượng bản ghi hiển thị tại một thời điểm, hỗ trợ người dùng điều hướng nhanh trên danh sách có số lượng dữ liệu lớn. |
| **Phạm vi áp dụng** | Các màn hình danh sách có sử dụng Paging Component. |
| **Trang khởi tạo** | Trang 1. |
| **Số bản ghi/trang mặc định** | 10 bản ghi/trang. |
| **Số bản ghi/trang cho phép lựa chọn** | 10, 20, 50. |
| **Số lượng số trang hiển thị tối đa** | 4 trang kể từ trang hiện tại … trang cuối cùng |
| **Điều kiện dữ liệu** | Phân trang được tính trên tập dữ liệu sau khi áp dụng các điều kiện tìm kiếm/lọc hiện tại. |
| **Nguyên tắc chuyển trang** | Khi người dùng chuyển trang, hệ thống giữ nguyên từ khóa tìm kiếm và các điều kiện lọc đang áp dụng. |

#### ***Mô tả chi tiết các thành phần***

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
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Tổng số bản ghi</td>
<td>Label</td>
<td>Output</td>
<td>Theo kết quả truy vấn</td>
<td><ul>
<li><p>Hiển thị tổng số bản ghi của tập dữ liệu hiện tại theo dạng <strong>“Tất cả danh sách: {TotalRecord}”</strong>. Giá trị được cập nhật sau mỗi lần tải lại danh sách, tìm kiếm, lọc hoặc thao tác làm thay đổi số lượng bản ghi.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Số bản ghi/trang</td>
<td>Dropdown</td>
<td>Input</td>
<td>10</td>
<td><ul>
<li><p>Cho phép lựa chọn <strong>10, 20, 50</strong> bản ghi/trang. Khi thay đổi giá trị, hệ thống tải lại dữ liệu và chuyển về <strong>trang 1</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Trang hiện tại</td>
<td>Paging Number</td>
<td>Input/Output</td>
<td>1</td>
<td><ul>
<li><p>Hiển thị số trang hiện tại. Trang hiện tại phải có trạng thái hiển thị khác các trang còn lại. Chọn lại đúng trang hiện tại không phát sinh yêu cầu tải dữ liệu mới.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Trang đầu</td>
<td>Icon Button</td>
<td>Input</td>
<td>Disable tại trang 1</td>
<td><ul>
<li><p>Chuyển trực tiếp đến trang đầu tiên. Không cho phép thao tác khi đang ở trang 1 hoặc khi không có dữ liệu.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Trang trước</td>
<td>Icon Button</td>
<td>Input</td>
<td>Disable tại trang 1</td>
<td><ul>
<li><p>Chuyển đến trang liền trước trang hiện tại. Mỗi lần thao tác giảm CurrentPage 1 đơn vị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Danh sách số trang</td>
<td>Paging Number</td>
<td>Input</td>
<td>Theo tổng số trang</td>
<td><ul>
<li><p>4 trang kể từ trang hiện tại … trang cuối cùng</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td>Trang sau</td>
<td>Icon Button</td>
<td>Input</td>
<td>Disable tại trang cuối</td>
<td><ul>
<li><p>Chuyển đến trang liền sau trang hiện tại. Mỗi lần thao tác tăng CurrentPage 1 đơn vị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td>Trang cuối</td>
<td>Icon Button</td>
<td>Input</td>
<td>Disable tại trang cuối</td>
<td><ul>
<li><p>Chuyển trực tiếp đến trang cuối cùng. Không cho phép thao tác khi đang ở trang cuối hoặc khi không có dữ liệu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### ***Công thức tính***

|  |  |
|:---|:---|
| **Nội dung** | **Công thức / Quy tắc** |
| Tổng số trang | TotalPage = CEILING(TotalRecord / PageSize) |
| Số thứ tự bản ghi | STT = (CurrentPage - 1) × PageSize + Position |
| Bản ghi đầu tiên của trang | StartRecord = (CurrentPage - 1) × PageSize + 1 |
| Bản ghi cuối của trang | EndRecord = MIN(CurrentPage × PageSize, TotalRecord) |

Trong đó:

|             |                                                        |
|:------------|:-------------------------------------------------------|
| **Tham số** | **Ý nghĩa**                                            |
| TotalRecord | Tổng số bản ghi đáp ứng điều kiện hiện tại.            |
| PageSize    | Số bản ghi tối đa được hiển thị trên một trang.        |
| CurrentPage | Trang hiện tại, bắt đầu từ 1.                          |
| Position    | Vị trí của bản ghi trong trang hiện tại, bắt đầu từ 1. |
| TotalPage   | Tổng số trang được tính từ TotalRecord và PageSize.    |

#### ***Quy tắc hiển thị***

|  |  |
|:---|:---|
| **Trường hợp** | **Quy tắc hiển thị** |
| TotalPage = 0 | Không hiển thị số trang có thể lựa chọn; các nút điều hướng ở trạng thái Disable. |
| TotalPage = 1 | Vẫn hiển thị trang **1**; các nút Trang đầu, Trang trước, Trang sau, Trang cuối đều Disable. |
| TotalPage ≤ 4 | Hiển thị toàn bộ các số trang từ 1 đến TotalPage. |
| TotalPage \> 4 | 4 trang kể từ trang hiện tại … trang cuối cùng |
| Có khoảng trang bị ẩn | Sử dụng ... để biểu thị khoảng trang không hiển thị trực tiếp. |
| Trang hiện tại | Được làm nổi bật để phân biệt với các trang còn lại. |
| Chọn một số trang khác | Hệ thống tải dữ liệu của trang được chọn và cập nhật trạng thái trang hiện tại. |
| Chọn lại trang hiện tại | Không tải lại dữ liệu. |

#### ***Trạng thái các nút điều hướng***

|                   |               |                 |               |                |
|:------------------|:--------------|:----------------|:--------------|:---------------|
| **Trạng thái**    | **Trang đầu** | **Trang trước** | **Trang sau** | **Trang cuối** |
| Không có dữ liệu  | Disable       | Disable         | Disable       | Disable        |
| Chỉ có 1 trang    | Disable       | Disable         | Disable       | Disable        |
| Đang ở trang đầu  | Disable       | Disable         | Enable        | Enable         |
| Đang ở trang giữa | Enable        | Enable          | Enable        | Enable         |
| Đang ở trang cuối | Enable        | Enable          | Disable       | Disable        |

#### ***Kịch bản xử lý phân trang***

|  |  |  |
|:---|:---|:---|
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

### ***Load more***

#### ***Thông tin chung***

|  |  |
|----|----|
| **Nội dung** | **Mô tả** |
| **Mục đích** | Cho phép tải từng phần dữ liệu thay vì tải toàn bộ tập dữ liệu trong một lần. Khi người dùng cần xem thêm, hệ thống tải bổ sung các bản ghi tiếp theo và giữ nguyên các bản ghi đã hiển thị trước đó. |
| **Phạm vi áp dụng** | Các danh sách được thiết kế theo cơ chế **Xem thêm/Load more** thay vì Paging Component. |
| **Nguyên tắc áp dụng** | Một danh sách tại cùng một thời điểm chỉ sử dụng cơ chế phân trang hoặc Load more, trừ khi chức năng có thiết kế riêng. |
| **Số bản ghi tải mỗi lần** | Do chức năng sử dụng quy định. File mẫu sử dụng biến X, ví dụ 50 bản ghi/lần; không cố định 50 cho toàn hệ thống. |
| **Dữ liệu khởi tạo** | Tải tối đa LoadSize bản ghi đầu tiên. |

#### ***Mô tả chi tiết các thành phần***

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
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Danh sách dữ liệu</td>
<td>List/Table</td>
<td>Output</td>
<td>LoadSize bản ghi đầu tiên</td>
<td><ul>
<li><p>Hiển thị các bản ghi đã được tải. Các lần Load more tiếp theo bổ sung dữ liệu vào cuối danh sách, không thay thế các bản ghi đã hiển thị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Xem thêm</td>
<td>Button</td>
<td>Input</td>
<td>Theo số lượng dữ liệu còn lại</td>
<td><ul>
<li><p>Hiển thị khi số bản ghi đã tải nhỏ hơn tổng số bản ghi. Khi người dùng chọn, hệ thống tải tiếp tối đa LoadSize bản ghi tiếp theo.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Số bản ghi đã hiển thị</td>
<td>Integer</td>
<td>Output</td>
<td>Theo dữ liệu đã tải</td>
<td><ul>
<li><p>Là tổng số bản ghi đang được hiển thị sau các lần Load more.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Tổng số bản ghi</td>
<td>Integer</td>
<td>Output</td>
<td>Theo kết quả truy vấn</td>
<td><ul>
<li><p>Sử dụng để xác định còn dữ liệu cần tải thêm hay không.</p></li>
</ul></td>
</tr>
</tbody>
</table>

#### 

#### ***Công thức và điều kiện***

|  |  |
|:---|:---|
| **Nội dung** | **Công thức / Điều kiện** |
| Số bản ghi tải ban đầu | DisplayedRecord = MIN(LoadSize, TotalRecord) |
| Vị trí bắt đầu lần tải tiếp theo | Offset = DisplayedRecord |
| Số lượng tải lần tiếp theo | NextLoad = MIN(LoadSize, TotalRecord - DisplayedRecord) |
| Còn dữ liệu để tải | DisplayedRecord \< TotalRecord |
| Đã tải hết dữ liệu | DisplayedRecord \>= TotalRecord |

#### ***Kịch bản xử lý Load more***

|  |  |  |
|:--:|:---|:---|
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

#### ***Quy tắc hiển thị Load more***

|  |  |
|:---|:---|
| **Trường hợp** | **Nút Xem thêm** |
| TotalRecord = 0 | Không hiển thị |
| DisplayedRecord = 0 và đang tải dữ liệu | Không cho phép thao tác |
| DisplayedRecord \< TotalRecord | Hiển thị |
| DisplayedRecord \>= TotalRecord | Không hiển thị |
| Đang xử lý yêu cầu Load more | Disable/Processing |
| Yêu cầu Load more thất bại | Enable lại để người dùng có thể thử lại |

## ***Kịch bản tìm kiếm và lọc***

### ***Thông tin chung***

- **Tên chức năng:** Kịch bản tìm kiếm và lọc dùng chung.

- **Mục đích:** Cho phép người dùng tra cứu và thu hẹp tập dữ liệu dựa trên từ khóa và các tiêu chí lọc được cung cấp tại từng chức năng.

- **Phạm vi áp dụng:** Các màn hình danh sách, popup hoặc vùng dữ liệu có chức năng tìm kiếm và/hoặc lọc.

- **Tiền điều kiện:** Người dùng đã truy cập được chức năng có dữ liệu cần tra cứu; dữ liệu hoặc nguồn điều kiện lọc đã được khởi tạo theo chức năng sử dụng.

- **Hậu điều kiện:** Hệ thống hiển thị tập dữ liệu thỏa mãn điều kiện tìm kiếm/lọc; thông tin phân trang hoặc Load more được khởi tạo lại theo tập kết quả mới.

### ***Mô tả chi tiết các thành phần***

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
<th style="text-align: center;"><strong>Tên thành phần</strong></th>
<th style="text-align: center;"><strong>Kiểu dữ liệu [Độ dài dữ liệu]</strong></th>
<th style="text-align: center;"><strong>Input/Output</strong></th>
<th style="text-align: center;"><strong>Giá trị khởi tạo</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Từ khóa tìm kiếm</td>
<td>Search Box - Unicode String [tối đa 255 ký tự]</td>
<td>Input</td>
<td>Rỗng</td>
<td><ul>
<li><p>Cho phép nhập từ khóa để tìm kiếm trên một hoặc nhiều trường được xác định tại chức năng sử dụng.</p></li>
<li><p>Quy tắc nhập liệu áp dụng theo <strong>mục 4.1 - Trường điều khiển dùng chung</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Bộ lọc</td>
<td>Dropdown/Control tương ứng</td>
<td>Input</td>
<td>Theo chức năng</td>
<td><ul>
<li><p>Cho phép thu hẹp dữ liệu theo một hoặc nhiều thuộc tính nghiệp vụ như Trạng thái, Loại, Nhóm, Đơn vị, khoảng thời gian hoặc các tiêu chí khác.</p></li>
<li><p>Tập giá trị và cách đối sánh được xác định tại từng chức năng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Làm mới</td>
<td>Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Nếu màn hình có sử dụng, cho phép đưa toàn bộ điều kiện tìm kiếm/lọc về giá trị khởi tạo và tải lại dữ liệu theo điều kiện mặc định.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Đặt lại</td>
<td>Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Nếu màn hình có sử dụng, thực hiện tìm kiếm/lọc theo các giá trị hiện tại.</p></li>
<li><p>Chức năng cũng có thể cho phép thực hiện tìm kiếm bằng phím <strong>Enter</strong> tại vùng tìm kiếm.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### ***Quy tắc từ khóa tìm kiếm***

|  |  |  |
|:---|:---|:---|
| **STT** | **Quy tắc** | **Mô tả** |
| 1 | Giá trị khởi tạo | Từ khóa tìm kiếm mặc định để rỗng khi truy cập mới màn hình, trừ khi chức năng có quy định lưu lại điều kiện trước đó. |
| 2 | Độ dài | Cho phép nhập tối đa **255 ký tự**. |
| 3 | Paste dữ liệu | Nếu nội dung dán có độ dài lớn hơn 255 ký tự, chỉ ghi nhận **255 ký tự đầu tiên**. |
| 4 | Khoảng trắng | Hệ thống tự động loại bỏ khoảng trắng ở đầu và cuối trước khi thực hiện tìm kiếm. |
| 5 | Phương thức tìm kiếm | Thực hiện **tìm kiếm tương đối**, từ khóa có thể khớp với một phần giá trị của trường được tìm kiếm. |
| 6 | Chữ hoa/chữ thường | Không phân biệt chữ hoa và chữ thường khi đối sánh từ khóa. |
| 7 | Tiếng Việt | Phân biệt giá trị tiếng Việt **có dấu** và **không dấu** theo quy tắc của file mẫu. |
| 8 | Nhiều trường tìm kiếm | Nếu một từ khóa được tìm trên nhiều trường, bản ghi được xác định phù hợp khi từ khóa khớp với **ít nhất một** trong các trường tìm kiếm, trừ khi chức năng có quy định khác. |
| 9 | Không nhập từ khóa | Nếu từ khóa rỗng sau khi chuẩn hóa, hệ thống không áp dụng điều kiện tìm kiếm theo từ khóa; dữ liệu được xác định theo các điều kiện lọc còn lại hoặc hiển thị toàn bộ nếu không có bộ lọc. |
| 10 | Phạm vi tìm kiếm | Chỉ thực hiện tìm kiếm trên các trường được mô tả tại chức năng sử dụng. |
| 11 | Không thay đổi dữ liệu | Tìm kiếm chỉ làm thay đổi tập dữ liệu hiển thị, không làm thay đổi dữ liệu nghiệp vụ. |

### ***Quy tắc lọc*** 

|  |  |  |
|:---|:---|:---|
| **STT** | **Quy tắc** | **Mô tả** |
| 1 | Phạm vi bộ lọc | Mỗi bộ lọc chỉ áp dụng trên thuộc tính nghiệp vụ được xác định tại chức năng sử dụng. |
| 2 | Giá trị mặc định | Giá trị khởi tạo của từng bộ lọc được quy định tại chức năng sử dụng. |
| 3 | Single Select | Bộ lọc dạng Single Select chỉ cho phép chọn một giá trị tại một thời điểm. |
| 4 | Multi Select | Nếu sử dụng Multi Select, các giá trị được chọn cùng thuộc một tiêu chí được xử lý theo quy tắc nghiệp vụ của bộ lọc đó. |
| 5 | Giá trị “Tất cả” | Nếu bộ lọc có lựa chọn **Tất cả**, khi chọn giá trị này hệ thống không áp dụng điều kiện lọc tương ứng. |
| 6 | Đối sánh | Bộ lọc theo mã/trạng thái/loại hoặc giá trị danh mục thực hiện đối sánh theo đúng giá trị được lựa chọn, trừ khi chức năng quy định khác. |
| 7 | Nhiều bộ lọc | Các bộ lọc khác nhau được áp dụng **đồng thời** để thu hẹp tập kết quả. |
| 8 | Từ khóa + bộ lọc | Từ khóa tìm kiếm và các bộ lọc được áp dụng đồng thời trong cùng một lần tra cứu. |
| 9 | Xóa một điều kiện lọc | Khi một bộ lọc được đưa về trạng thái không chọn/Tất cả, điều kiện tương ứng được loại khỏi lần truy vấn tiếp theo. |
| 10 | Làm mới | Khi chọn Đặt lại, toàn bộ từ khóa và bộ lọc được đưa về giá trị khởi tạo; danh sách được tải lại theo điều kiện mặc định. |

### ***Kích hoạt tìm kiếm và lọc***

|  |  |
|:---|:---|
| **Trường hợp** | **Xử lý** |
| Người dùng nhấn **Enter** tại Search Box | Hệ thống thực hiện tìm kiếm/lọc theo toàn bộ điều kiện hiện tại nếu chức năng hỗ trợ Enter. |
| Người dùng chọn **Tìm kiếm** | Hệ thống thực hiện tìm kiếm/lọc theo toàn bộ điều kiện hiện tại. |
| Người dùng chọn **Làm mới** | Reset điều kiện về mặc định và tải lại dữ liệu. |
| Người dùng nhấn Enter khi từ khóa rỗng | Thực hiện truy vấn theo các bộ lọc hiện tại; nếu không có bộ lọc thì hiển thị toàn bộ dữ liệu trong phạm vi chức năng. |
| Người dùng kích hoạt nhiều lần khi đang xử lý | Không phát sinh nhiều yêu cầu trùng lặp đồng thời; áp dụng trạng thái Processing theo quy tắc dùng chung. |

### ***Quy tắc kết hợp điều kiện***

|  |  |
|:---|:---|
| **Điều kiện** | **Cách xác định kết quả** |
| Chỉ có từ khóa | Lấy các bản ghi thỏa mãn từ khóa trên ít nhất một trường tìm kiếm được cấu hình. |
| Chỉ có một bộ lọc | Lấy các bản ghi thỏa mãn giá trị của bộ lọc đó. |
| Có nhiều bộ lọc | Bản ghi phải thỏa mãn đồng thời các bộ lọc đang được áp dụng. |
| Có từ khóa và bộ lọc | Bản ghi phải thỏa mãn điều kiện từ khóa **và** đồng thời thỏa mãn các bộ lọc đang áp dụng. |
| Không có từ khóa và không có bộ lọc | Hiển thị toàn bộ dữ liệu thuộc phạm vi chức năng. |

### ***Quy tắc với phân trang và Load more***

|  |  |
|:---|:---|
| **Trường hợp** | **Xử lý** |
| Thực hiện tìm kiếm/lọc mới với danh sách sử dụng phân trang | Đưa CurrentPage về **1**, giữ nguyên PageSize hiện tại và tính lại TotalRecord, TotalPage. |
| Chuyển trang sau khi tìm kiếm/lọc | Giữ nguyên toàn bộ điều kiện tìm kiếm/lọc đang áp dụng. |
| Thay đổi PageSize | Giữ nguyên điều kiện tìm kiếm/lọc, đưa về trang 1 và tải lại dữ liệu. |
| Tìm kiếm/lọc với danh sách Load more | Xóa tập dữ liệu hiển thị của điều kiện cũ và tải lại nhóm bản ghi đầu tiên của tập kết quả mới. |
| Load more sau khi tìm kiếm/lọc | Giữ nguyên điều kiện tìm kiếm/lọc và tải tiếp dữ liệu của chính tập kết quả đó. |
| Đặt lại điều kiện | Khởi tạo lại phân trang/Load more theo trạng thái mặc định. |

### ***Quy tắc hiển thị kết quả***

|  |  |
|:---|:---|
| **Trường hợp** | **Cách xử lý** |
| Đang truy vấn | Hiển thị trạng thái Loading tại vùng danh sách; giữ nguyên các điều kiện tìm kiếm/lọc đang hiển thị. |
| Có kết quả | Hiển thị các bản ghi thỏa mãn điều kiện tìm kiếm/lọc. |
| Không có kết quả | Hiển thị **“Chưa có dữ liệu”** tại vùng danh sách. |
| Từ khóa/bộ lọc thay đổi | Chỉ cập nhật dữ liệu sau khi cơ chế kích hoạt tìm kiếm của màn hình được thực hiện. |
| Không truy xuất được dữ liệu | Không hiển thị dữ liệu cũ như kết quả mới; xử lý theo thông báo lỗi dùng chung. |
| Timeout | Kết thúc trạng thái Loading và hiển thị thông báo timeout theo **mục 4.3 - Danh sách thông báo dạng Toast**. |
| Giá trị trường của một bản ghi rỗng | Hiển thị theo quy tắc Table Column tại mục 4.1. |

### ***Luồng nghiệp vụ***

|  |  |
|:---|:---|
| **Bước** | **Mô tả** |
| 1 | Người dùng truy cập chức năng có hỗ trợ tìm kiếm/lọc. Hệ thống hiển thị dữ liệu và khởi tạo các trường tìm kiếm/lọc theo giá trị mặc định. |
| 2 | Người dùng nhập từ khóa và/hoặc lựa chọn một hoặc nhiều điều kiện lọc. |
| 3 | Người dùng kích hoạt tìm kiếm bằng **Enter**, **Tìm kiếm** hoặc cơ chế được quy định tại màn hình. Hệ thống chuẩn hóa dữ liệu đầu vào, kết hợp các điều kiện tìm kiếm/lọc và khởi tạo lại phân trang/Load more. |
| 4 | Hệ thống truy vấn tập dữ liệu phù hợp. Nếu có dữ liệu, hiển thị danh sách kết quả; nếu không có dữ liệu, hiển thị **“Chưa có dữ liệu”**; nếu truy vấn thất bại, hiển thị trạng thái lỗi tương ứng. |
| 5 | Người dùng có thể thay đổi điều kiện, thực hiện tìm kiếm lại, chuyển trang hoặc Load more trên tập kết quả hiện tại. Luồng xử lý kết thúc khi người dùng rời chức năng hoặc thực hiện nghiệp vụ khác. |

## ***Xóa bản ghi***

### ***Thông tin chung***

- **Tên chức năng:** Xóa bản ghi.

- **Mục đích:** Cho phép người dùng xóa một bản ghi không còn nhu cầu sử dụng khỏi danh sách nghiệp vụ.

- **Người dùng:** Người dùng có quyền **Xóa** đối với chức năng/đối tượng tương ứng.

- **Đường dẫn truy cập:** Tại màn hình danh sách → chọn biểu tượng/nút **Xóa** của bản ghi cần xóa.

- **Tiền điều kiện:**

  - Bản ghi còn tồn tại

  - **N**gười dùng có quyền Xóa

  - Bản ghi đáp ứng điều kiện cho phép xóa theo nghiệp vụ.

- **Hậu điều kiện:**

  - Bản ghi không còn hiển thị trong danh sách nghiệp vụ

  - Danh sách và thông tin phân trang được cập nhật lại.

### ***Mô tả chi tiết các thành phần***

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
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Xóa</td>
<td>Icon Button/Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Cho phép khởi tạo thao tác xóa đối với bản ghi được chọn.</p></li>
<li><p>Chỉ hiển thị/cho phép thao tác khi người dùng có quyền Xóa.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Tiêu đề xác nhận</td>
<td>Label</td>
<td>Output</td>
<td>Theo thiết kế</td>
<td><ul>
<li><p>Hiển thị tiêu đề cảnh báo/xác nhận thao tác xóa.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Nội dung xác nhận</td>
<td>Label - Unicode String</td>
<td>Output</td>
<td>Theo bản ghi được chọn</td>
<td><ul>
<li><p>Hiển thị thông tin để người dùng xác nhận đúng bản ghi cần xóa. Mẫu: <strong>“Bạn có chắc chắn muốn xoá {Đối tượng}: {Tên đối tượng} - {Mã đối tượng} không?”</strong>.</p></li>
<li><p>Có thể bổ sung Mã đối tượng nếu cần phân biệt bản ghi.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Hủy</td>
<td>Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Đóng popup và không thực hiện xóa.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Xóa</td>
<td>Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Xác nhận xóa bản ghi.</p></li>
<li><p>Hệ thống kiểm tra lại quyền, sự tồn tại của bản ghi và các điều kiện cho phép xóa trước khi xử lý.</p></li>
<li><p>Trong thời gian xử lý không cho phép gửi lặp yêu cầu.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### ***Điều kiện kiểm tra trước khi xóa***

|  |  |  |
|:--:|:--:|:--:|
| **STT** | **Điều kiện** | **Xử lý** |
| 1 | Người dùng không có quyền Xóa | Không thực hiện xóa; hiển thị **TB012**. |
| 2 | Bản ghi không còn tồn tại/đã bị xóa | Không thực hiện xóa; hiển thị **TB013** và cập nhật lại danh sách. |
| 3 | Bản ghi đang được sử dụng hoặc có ràng buộc không cho phép xóa | Không thực hiện xóa; hiển thị **TB015**. |
| 4 | Các điều kiện đều hợp lệ | Thực hiện xóa bản ghi. |

### ***Luồng nghiệp vụ*** 

3.  

|  |  |
|:--:|----|
| **Bước** | **Mô tả** |
| 1 | Người dùng chọn **Xóa** tại bản ghi cần xóa. Hệ thống hiển thị popup xác nhận với thông tin của bản ghi được chọn. |
| 2 | Người dùng lựa chọn: **Hủy**→ hệ thống đóng popup, không thay đổi dữ liệu; **Xóa** → hệ thống kiểm tra quyền, sự tồn tại và các điều kiện cho phép xóa. |
| 3 | Nếu không đáp ứng điều kiện, hệ thống không xóa và hiển thị thông báo tương ứng. Nếu hợp lệ, hệ thống thực hiện xóa bản ghi. |
| 4 | Nếu xóa thành công, hệ thống đóng popup, hiển thị **TB003 - “Xóa {Đối tượng} thành công.”** và tải lại danh sách. Nếu xử lý thất bại, dữ liệu giữ nguyên và hiển thị thông báo lỗi tương ứng. |
| 5 | Hệ thống cập nhật tổng số bản ghi và phân trang/Load more theo tập dữ liệu mới. Luồng xử lý kết thúc. |

### ***Xử lý sau khi xóa***

|  |  |
|----|----|
| **Trường hợp** | **Xử lý** |
| Xóa thành công | Giữ nguyên từ khóa tìm kiếm, bộ lọc và PageSize hiện tại; tải lại danh sách và cập nhật tổng số bản ghi. |
| Trang hiện tại vẫn còn dữ liệu | Giữ nguyên trang hiện tại. |
| Xóa bản ghi cuối cùng của trang | Nếu còn trang trước, chuyển về trang hợp lệ liền trước. |
| Không còn bản ghi | Hiển thị trạng thái **“Chưa có dữ liệu”**. |
| Sử dụng Load more | Cập nhật lại tập dữ liệu đang hiển thị và không hiển thị bản ghi đã xóa. |
| Xóa thất bại | Không thay đổi dữ liệu hiện tại; hiển thị thông báo theo mục **4.3 - Danh sách thông báo dạng Toast**. |

## ***Bật/Tắt hoạt động***

### ***Thông tin chung chức năng***

- **Tên chức năng:** Bật/Tắt hoạt động.

- **Mục đích:** Cho phép người dùng thay đổi trạng thái hoạt động của bản ghi mà không xóa bản ghi khỏi hệ thống.

- **Người dùng:** Người dùng có quyền cập nhật trạng thái của đối tượng tương ứng.

- **Đường dẫn truy cập:** Màn hình danh sách → chọn Toggle trạng thái tại bản ghi cần thay đổi.

- **Tiền điều kiện:**

  - Bản ghi còn tồn tại

  - Người dùng có quyền cập nhật

  - Bản ghi đáp ứng điều kiện cho phép thay đổi trạng thái theo nghiệp vụ..

- **Hậu điều kiện thành công:**

  - Trạng thái mới được ghi nhận và hiển thị đúng trên danh sách.

### ***Mô tả chi tiết các thành phần***

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
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Trạng thái</td>
<td>Toggle Switch - Boolean</td>
<td>Input/Output</td>
<td>Theo trạng thái hiện tại</td>
<td><ul>
<li><p>Hiển thị trạng thái hiện tại của bản ghi. Với các danh mục dùng chung: <strong>Bật = Đang hoạt động</strong>, <strong>Tắt = Dừng hoạt động</strong>.</p></li>
<li><p>Khi người dùng thay đổi Toggle, hệ thống chưa cập nhật dữ liệu ngay mà hiển thị popup xác nhận.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Tiêu đề xác nhận</td>
<td>Label - String</td>
<td>Output</td>
<td>Theo trạng thái cần chuyển</td>
<td><ul>
<li><p>Khi chuyển từ Đang hoạt động sang Dừng hoạt động, hiển thị <strong>“Dừng hoạt động”</strong>.</p></li>
<li><p>Khi chuyển từ Dừng hoạt động sang Đang hoạt động, hiển thị <strong>“Kích hoạt”</strong>.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Nội dung xác nhận</td>
<td>Label - Unicode String</td>
<td>Output</td>
<td>Theo bản ghi được chọn</td>
<td><ul>
<li><p>Hiển thị hành động và thông tin nhận diện bản ghi.</p></li>
<li><p>Tên đối tượng được nhấn mạnh để người dùng đối chiếu; có thể bổ sung Mã đối tượng khi cần phân biệt.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Không</td>
<td>Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Đóng popup, không cập nhật dữ liệu và đưa Toggle về trạng thái trước thao tác.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Có</td>
<td>Button</td>
<td>Input</td>
<td>-</td>
<td><ul>
<li><p>Xác nhận thay đổi trạng thái.</p></li>
<li><p>Hệ thống kiểm tra lại quyền, sự tồn tại, trạng thái hiện tại và các điều kiện nghiệp vụ trước khi cập nhật.</p></li>
<li><p>Không cho phép gửi lặp yêu cầu trong thời gian xử lý.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### \

### ***Quy tắc xác định trạng thái***

|                         |              |                    |                   |
|:------------------------|:-------------|:-------------------|:------------------|
| **Trạng thái hiện tại** | **Thao tác** | **Trạng thái mới** | **Tiêu đề popup** |
| Đang hoạt động          | Tắt Toggle   | Dừng hoạt động     | Dừng hoạt động    |
| Dừng hoạt động          | Bật Toggle   | Đang hoạt động     | Kích hoạt         |

*Nội dung xác nhận dùng chung:*

|  |  |
|:---|:---|
| **Trạng thái cần chuyển** | **Nội dung** |
| Dừng hoạt động | Bạn có chắc chắn muốn dừng hoạt động {Đối tượng}: {Tên đối tượng} không? |
| Đang hoạt động | Bạn có chắc chắn muốn kích hoạt {Đối tượng}: {Tên đối tượng} không? |

### ***Điều kiện kiểm tra trước khi cập nhật***

|  |  |  |
|:--:|:---|:---|
| **STT** | **Điều kiện** | **Xử lý** |
| 1 | Người dùng không có quyền cập nhật trạng thái | Không cập nhật; khôi phục Toggle và hiển thị **TB012**. |
| 2 | Bản ghi không còn tồn tại/đã bị xóa | Không cập nhật; khôi phục Toggle, hiển thị **TB013** và cập nhật lại danh sách khi cần. |
| 3 | Trạng thái thực tế đã thay đổi | Không cập nhật theo trạng thái cũ; hiển thị **TB014** và yêu cầu cập nhật lại dữ liệu. |
| 4 | Không đáp ứng điều kiện nghiệp vụ cho phép thay đổi trạng thái | Không cập nhật; khôi phục Toggle và hiển thị thông báo nguyên nhân tương ứng. |
| 5 | Lý do không hợp lệ, nếu chức năng có sử dụng | Không cập nhật; hiển thị lỗi tại trường theo mục 4.2. |
| 6 | Các điều kiện hợp lệ | Thực hiện cập nhật trạng thái mới. |

### ***Luồng nghiệp vụ***

|  |  |
|:--:|:---|
| **Bước** | **Mô tả** |
| 1 | Người dùng thay đổi **Toggle trạng thái** tại bản ghi. Hệ thống xác định trạng thái cần chuyển và hiển thị popup xác nhận tương ứng. |
| 2 | Người dùng lựa chọn: **Không/Hủy bỏ** → hệ thống đóng popup, không cập nhật và khôi phục Toggle; **Có/Xác nhận** → hệ thống kiểm tra các điều kiện cho phép cập nhật trạng thái. |
| 3 | Nếu không đáp ứng điều kiện, hệ thống không cập nhật và hiển thị thông báo tương ứng. Nếu hợp lệ, hệ thống thực hiện cập nhật trạng thái. |
| 4 | Nếu cập nhật thành công, hệ thống đóng popup, giữ Toggle ở trạng thái mới, hiển thị **TB004 - “Cập nhật trạng thái {Đối tượng} thành công.”** và cập nhật lại dữ liệu liên quan. Nếu thất bại, giữ trạng thái cũ, khôi phục Toggle và hiển thị thông báo lỗi. |
| 5 | Luồng xử lý kết thúc. |

### ***Xử lý sau khi cập nhật trạng thái***

|  |  |
|:---|:---|
| **Trường hợp** | **Xử lý** |
| Cập nhật thành công | Hiển thị trạng thái mới trên Toggle; cập nhật dữ liệu của bản ghi và hiển thị TB004. |
| Người dùng Hủy bỏ | Đóng popup; khôi phục Toggle; không thay đổi dữ liệu. |
| Cập nhật thất bại | Giữ trạng thái dữ liệu trước thao tác; khôi phục Toggle và hiển thị thông báo tương ứng tại mục 4.3. |
| Bản ghi không còn thỏa mãn điều kiện tìm kiếm/lọc sau khi đổi trạng thái | Tải lại danh sách theo điều kiện tìm kiếm/lọc hiện tại; bản ghi không còn phù hợp sẽ không tiếp tục hiển thị. |
| Danh sách có phân trang | Giữ nguyên từ khóa, bộ lọc và PageSize; cập nhật lại tập dữ liệu của trang hiện tại. |
| Danh sách sử dụng Load more | Cập nhật lại bản ghi/tập dữ liệu theo điều kiện hiện tại, không làm mất các dữ liệu đã tải không bị ảnh hưởng. |

## 

## ***Menu chức năng dùng chung***

### ***Thông tin chung chức năng***

- **Tên chức năng:** Menu chức năng dùng chung

- **Mục đích:** Cung cấp khu vực điều hướng thống nhất để người dùng truy cập các chức năng trong phân hệ.

- **Phạm vi áp dụng:** Các màn hình có Sidebar/Menu chức năng hoặc menu điều hướng tương đương.

- **Người dùng mục tiêu:** Người dùng được phép truy cập phân hệ và các chức năng tương ứng.

- **Tiền điều kiện:**

  - Hệ thống đã xác định cấu hình menu và danh sách chức năng được phép hiển thị cho người dùng.

- **Hậu điều kiện:**

  - Khi người dùng chọn một menu hợp lệ, hệ thống điều hướng đến chức năng tương ứng; menu của màn hình hiện tại được hiển thị ở trạng thái **Active**.

### ***Mô tả chi tiết các thành phần*** 

<table>
<colgroup>
<col style="width: 7%" />
<col style="width: 10%" />
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
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">1</td>
<td>Biểu tượng/Tên phân hệ</td>
<td>Icon + String [tối đa 100 ký tự]</td>
<td>Output</td>
<td>Theo cấu hình</td>
<td><ul>
<li><p>Hiển thị biểu tượng và tên của phân hệ hiện tại.</p></li>
<li><p>Có thể hiển thị thêm mô tả ngắn của phân hệ nếu thiết kế màn hình có sử dụng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td>Nhóm menu</td>
<td>Accordion / Menu group [tối đa 100 ký tự]</td>
<td>Input/Output</td>
<td>Đóng</td>
<td><ul>
<li><p>Nhóm các chức năng có cùng phạm vi nghiệp vụ.</p></li>
<li><p>Cho phép mở/đóng danh sách menu con. Nếu bên trong nhóm có menu đang Active thì nhóm được tự động mở.</p></li>
<li><p>Không hiển thị thành phần này đối với menu không có cấu trúc nhóm.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td>Menu cấp 1</td>
<td>Navigation Item [tối đa 100 ký tự]</td>
<td>Input/Output</td>
<td>Không chọn</td>
<td><ul>
<li><p>Hiển thị chức năng điều hướng cấp 1.</p></li>
<li><p>Nếu menu có đường dẫn trực tiếp, người dùng chọn để mở chức năng tương ứng; nếu menu đóng vai trò menu cha thì dùng để mở/đóng các menu con theo thiết kế.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">4</td>
<td>Menu cấp 2</td>
<td>Navigation Item [tối đa 100 ký tự]</td>
<td>Input/Output</td>
<td>Không chọn</td>
<td><ul>
<li><p>Hiển thị menu con thuộc menu/nhóm cấp trên và được thụt vào để thể hiện quan hệ phân cấp.</p></li>
<li><p>Chỉ hiển thị khi menu cha/nhóm đang mở và chức năng thuộc danh sách được phép hiển thị.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">5</td>
<td>Icon menu</td>
<td>Icon</td>
<td>Output</td>
<td>Theo cấu hình</td>
<td><ul>
<li><p>Hiển thị biểu tượng nhận diện của chức năng nếu menu có cấu hình icon.</p></li>
<li><p>Icon phải thống nhất với chức năng tương ứng.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">6</td>
<td>Tên menu</td>
<td>String [tối đa 100 ký tự]</td>
<td>Output</td>
<td>Theo cấu hình</td>
<td><ul>
<li><p>Hiển thị tên chức năng.</p></li>
<li><p>Nội dung hiển thị tối đa <strong>01 dòng</strong>; nếu vượt vùng hiển thị thì cắt bằng ... và hiển thị đầy đủ bằng tooltip.</p></li>
</ul></td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td>Trạng thái menu</td>
<td>Enum</td>
<td>Output</td>
<td>Theo màn hình hiện tại</td>
<td><ul>
<li><p>Thể hiện trạng thái của menu gồm <strong>Normal, Hover/Focus, Active, Disabled</strong> khi áp dụng.</p></li>
<li><p>Tại một thời điểm, menu tương ứng với màn hình hiện tại được hiển thị trạng thái Active.</p></li>
</ul></td>
</tr>
</tbody>
</table>

### ***Quy tắc xử lý***

|  |  |  |
|:--:|----|----|
| **STT** | **Trường hợp** | **Xử lý** |
| 1 | Khởi tạo menu | Hệ thống lấy cấu hình menu của phân hệ và xác định các mục được phép hiển thị cho người dùng. |
| 2 | Menu không thuộc phạm vi được phép truy cập | Không hiển thị menu tương ứng. |
| 3 | Chọn Nhóm menu/Menu cha | Thực hiện mở/đóng danh sách menu con; không điều hướng nếu thành phần chỉ có chức năng nhóm. |
| 4 | Chọn menu có chức năng | Hệ thống xác định chức năng và đường dẫn tương ứng, sau đó thực hiện điều hướng đến màn hình đích. |
| 5 | Menu con đang Active | Menu cha/nhóm chứa menu đó được tự động mở. |
| 6 | Chọn menu đang Active | Giữ nguyên màn hình hiện tại, không tạo lịch sử điều hướng trùng. Việc tải lại dữ liệu thực hiện theo quy định của màn hình đang sử dụng. |
| 7 | Quyền truy cập thay đổi trong thời gian sử dụng | Nếu người dùng thao tác trên menu không còn được phép truy cập, hệ thống không điều hướng và hiển thị thông báo **TB012 - Bạn không có quyền thực hiện chức năng này.** |
| 8 | Đường dẫn chức năng không hợp lệ/không tồn tại | Không thực hiện điều hướng; giữ nguyên màn hình và hiển thị thông báo chức năng chưa sẵn sàng theo mã thông báo được cấu hình. |
| 9 | Điều hướng thành công | Cập nhật trạng thái Active của menu theo màn hình đích và đồng bộ Breadcrumb tương ứng. |

### ***Quy tắc hiển thị***

|  |  |  |
|:--:|----|----|
| **STT** | **Quy tắc** | **Mô tả** |
| 1 | Thứ tự menu | Hiển thị theo thứ tự cấu hình của phân hệ. |
| 2 | Menu Active | Chức năng tương ứng với màn hình hiện tại được hiển thị nổi bật theo thiết kế giao diện. |
| 3 | Nhóm có menu Active | Nhóm/menu cha phải ở trạng thái mở để menu Active luôn được nhìn thấy. |
| 4 | Hover/Focus | Phải có cách hiển thị khác với Normal và Active để người dùng nhận biết thành phần có thể thao tác. |
| 5 | Nội dung dài | Tên menu hiển thị tối đa **01 dòng**; nếu vượt vùng hiển thị thì cắt bằng ... và hiển thị đầy đủ bằng tooltip. |
| 6 | Menu cấp con | Hiển thị thụt vào so với menu cha để thể hiện cấu trúc phân cấp. |
| 7 | Không có quyền | Không hiển thị menu của chức năng mà người dùng không được phép truy cập. |
| 8 | Icon | Nếu chức năng có cấu hình icon thì hiển thị nhất quán cùng tên menu; không sử dụng các icon khác nhau cho cùng một chức năng giữa các màn hình. |
| 9 | Đồng bộ menu | Tên, icon, thứ tự và đường dẫn của cùng một chức năng phải nhất quán giữa các màn hình sử dụng Menu common. |

## 

## ***Trạng thái hiển thị và xử lý dùng chung***

### ***Loading***

|  |  |
|----|----|
| **Trường hợp** | **Quy tắc** |
| **Loading toàn vùng nội dung** | Sử dụng khi dữ liệu chính của màn hình chưa được tải và chưa đủ thông tin để hiển thị nội dung. Giữ nguyên các thành phần layout đã xác định như Header, Menu, Breadcrumb nếu các thành phần này không phụ thuộc dữ liệu đang tải. |
| **Loading bảng danh sách** | Hiển thị trạng thái Loading tại vùng bảng khi đang tải hoặc tải lại danh sách. Không làm trắng toàn bộ màn hình nếu các vùng khác vẫn sử dụng được. |
| **Loading thành phần độc lập** | Nếu chỉ một Card, Dropdown, số lượng hoặc thành phần độc lập đang tải, chỉ hiển thị Loading tại thành phần đó. Các thành phần còn lại tiếp tục hoạt động bình thường nếu không phụ thuộc dữ liệu đang tải. |
| **Skeleton** | Có thể sử dụng Skeleton tại vùng có cấu trúc hiển thị xác định trước. Skeleton phải có kích thước gần tương ứng với nội dung thực tế để hạn chế thay đổi bố cục khi dữ liệu được tải xong. |
| **Giá trị trong khi Loading** | Không hiển thị giá trị mặc định có thể khiến người dùng hiểu nhầm là dữ liệu thực. Ví dụ trường số lượng không hiển thị 0 trong thời gian chưa có kết quả; màn Tổng quan hiện sử dụng Skeleton/Loading trước khi nhận số lượng thực tế. |
| **Bắt đầu Loading** | Hiển thị ngay khi bắt đầu thao tác có thời gian chờ và chưa có kết quả để hiển thị. |
| **Kết thúc Loading** | Kết thúc khi nhận được kết quả thành công, lỗi, timeout hoặc trạng thái kết thúc khác của nghiệp vụ. Không để Loading tiếp tục tồn tại sau khi request đã kết thúc. |
| **Tương tác khi Loading** | Chỉ khóa các thao tác có khả năng tạo request trùng hoặc gây xung đột với dữ liệu đang xử lý; không mặc định khóa toàn màn hình. |

### ***Empty State***

|  |  |
|----|----|
| **Trường hợp** | **Quy tắc** |
| **Danh sách không có dữ liệu** | Hiển thị trạng thái **“Chưa có dữ liệu”** tại vùng danh sách. Không hiển thị các dòng rỗng để thay thế dữ liệu. |
| **Không có kết quả tìm kiếm/lọc** | Hiển thị **“Chưa có dữ liệu”** hoặc nội dung tương đương tại vùng kết quả; giữ nguyên từ khóa và bộ lọc để người dùng có thể điều chỉnh điều kiện. |
| **Không có dữ liệu do điều kiện nghiệp vụ** | Có thể hiển thị nội dung riêng mô tả nguyên nhân nếu chức năng xác định được, thay vì sử dụng thông báo chung không rõ nguyên nhân. |
| **Không có dữ liệu do quyền** | Nếu sau khi áp dụng phạm vi quyền không có dữ liệu/thành phần nào được phép hiển thị, Empty State phải phản ánh đúng nguyên nhân. Ví dụ màn Tổng quan sử dụng nội dung **“Bạn chưa được cấp quyền truy cập module nào trong phân hệ này”** khi không còn module sau phân quyền. |
| **Phân trang** | Khi TotalRecord = 0, hiển thị Empty State và áp dụng trạng thái phân trang theo mục **4.4 - Kịch bản phân trang & Load more**. |
| **Thao tác trên Empty State** | Chỉ hiển thị hành động như **Thêm mới**, **Thử lại** hoặc thao tác khác nếu người dùng có quyền và hành động đó phù hợp với nguyên nhân Empty State. |
| **Empty State và lỗi** | Không sử dụng Empty State để thay thế cho trạng thái lỗi tải dữ liệu. Nếu chưa xác định được dữ liệu có rỗng hay không do request thất bại thì phải hiển thị Error State. |

### ***Trạng thái Processing/Disabled***

|  |  |
|:---|:---|
| **Trạng thái** | **Quy tắc** |
| **Processing** | Áp dụng khi một thao tác do người dùng kích hoạt đang được hệ thống xử lý, ví dụ Lưu lại, Xóa, cập nhật trạng thái hoặc Thử lại. |
| **Button Processing** | Nút vừa kích hoạt thao tác được chuyển sang trạng thái không cho phép gửi lại yêu cầu cho đến khi xử lý kết thúc. Có thể hiển thị Spinner/Loading trên nút theo thiết kế. |
| **Disabled do điều kiện nghiệp vụ** | Control ở trạng thái Disabled khi người dùng chưa đáp ứng điều kiện cho phép thao tác hoặc dữ liệu không cho phép thực hiện hành động. |
| **Disabled do đang xử lý** | Chỉ Disable các control có thể làm phát sinh request trùng hoặc thay đổi dữ liệu liên quan đến thao tác đang Processing. |
| **Giữ dữ liệu form** | Khi đang xử lý Lưu/Cập nhật, giữ nguyên dữ liệu trên form cho đến khi có kết quả. Không tự xóa hoặc reset dữ liệu trước khi hệ thống xác nhận thành công. |
| **Xử lý thành công** | Kết thúc Processing và cập nhật control/giao diện theo dữ liệu sau xử lý. |
| **Xử lý thất bại** | Kết thúc Processing; đưa control về trạng thái cho phép thao tác lại nếu điều kiện vẫn hợp lệ và giữ dữ liệu người dùng đã nhập. |
| **Timeout/mất kết nối** | Kết thúc Processing; không tự coi thao tác là thành công khi chưa nhận được kết quả xác nhận. Thông báo áp dụng theo mục **4.3 - Danh sách thông báo dạng Toast**. |

### ***Chống thao tác lặp***

|  |  |  |
|----|----|----|
| **STT** | **Quy tắc** | **Mô tả** |
| 1 | Một thao tác - một request | Trong thời gian một yêu cầu đang xử lý, không gửi thêm request giống nhau từ cùng thao tác. |
| 2 | Khóa nút xác nhận | Sau khi người dùng chọn Lưu/Xóa/Xác nhận/Có hoặc thao tác thay đổi dữ liệu tương đương, control được khóa cho đến khi nhận kết quả. |
| 3 | Không xử lý double-click | Nhấn nhanh hoặc nhấn nhiều lần liên tiếp không được tạo nhiều lần thay đổi dữ liệu. |
| 4 | Ngăn thao tác xung đột | Không cho phép thực hiện thao tác khác trên cùng đối tượng nếu thao tác đó có thể làm thay đổi hoặc xung đột với dữ liệu đang xử lý. |
| 5 | Không khóa thao tác độc lập | Các thành phần không liên quan vẫn được phép sử dụng nếu không ảnh hưởng tới request đang xử lý. |
| 6 | Kết thúc xử lý | Khi request thành công hoặc thất bại, control được cập nhật lại theo trạng thái dữ liệu hiện tại. |
| 7 | Thử lại | Một lần chọn **Thử lại** chỉ tạo một request. Trong thời gian đang thử lại, nút Thử lại không cho phép kích hoạt tiếp. |

### ***Lỗi tải dữ liệu và Thử lại***

|  |  |
|----|----|
| **Trường hợp** | **Xử lý** |
| **Lỗi toàn bộ vùng dữ liệu chính** | Kết thúc Loading và hiển thị Error State tại vùng nội dung bị lỗi. Không hiển thị Empty State vì hệ thống chưa xác định được dữ liệu thực tế có rỗng hay không. |
| **Lỗi một thành phần độc lập** | Chỉ hiển thị lỗi tại thành phần bị ảnh hưởng; không làm gián đoạn các vùng khác nếu chúng đã tải thành công và không phụ thuộc thành phần lỗi. |
| **Có dữ liệu cũ nhưng tải mới thất bại** | Không hiển thị dữ liệu cũ như thể đó là kết quả của lần tải mới nếu có nguy cơ gây hiểu nhầm. Việc giữ dữ liệu cũ trên màn hình phải thể hiện được trạng thái tải mới thất bại. |
| **Lỗi có thể thử lại** | Hiển thị hành động **Thử lại** tại vùng lỗi hoặc thành phần tương ứng. |
| **Phạm vi Thử lại** | Chỉ tải lại request/dữ liệu đã lỗi; không tải lại toàn bộ màn hình nếu lỗi chỉ xảy ra ở một thành phần độc lập. |
| **Đang Thử lại** | Hiển thị Loading tại đúng vùng cần tải lại và không cho phép kích hoạt Thử lại liên tiếp. |
| **Thử lại thành công** | Ẩn Error State, hiển thị dữ liệu mới và đưa thành phần về trạng thái hoạt động bình thường. |
| **Thử lại thất bại** | Kết thúc Loading, tiếp tục hiển thị Error State và cho phép thử lại khi phù hợp. |
| **Timeout** | Kết thúc Loading/Processing, hiển thị thông báo timeout theo mục 4.3 và cho phép Thử lại nếu nghiệp vụ cho phép. |
| **Lỗi một phần** | Không chặn toàn màn hình. Ví dụ tại màn Tổng quan, nếu một module không tải được số lượng thì module đó hiển thị - và thông tin lỗi, trong khi các module khác vẫn hiển thị và cho phép điều hướng. |

# **Hủy thêm mới/chỉnh sửa**

## **1. Thông tin chung**

- **Tên chức năng:** Hủy chỉnh sửa.

- **Mục đích:** Cho phép người dùng hủy các thay đổi đang thực hiện trên màn hình/popup chỉnh sửa và tránh mất dữ liệu ngoài ý muốn khi có thông tin chưa được lưu.

- **Người dùng:** Người dùng đang thực hiện thao tác chỉnh sửa dữ liệu.

- **Đường dẫn truy cập:** Tại màn hình/popup chỉnh sửa → chọn **Hủy/Đóng**, biểu tượng **X**, quay lại hoặc thao tác rời khỏi màn hình chỉnh sửa.

- **Tiền điều kiện:**

  - Người dùng đang ở trạng thái chỉnh sửa.

  - Dữ liệu chỉnh sửa chưa được lưu.

- **Hậu điều kiện:**

  - Trường hợp người dùng xác nhận hủy: Các thay đổi chưa lưu bị loại bỏ và dữ liệu đã lưu trước đó không thay đổi.

  - Trường hợp người dùng tiếp tục chỉnh sửa: Giữ nguyên toàn bộ dữ liệu người dùng đang nhập/chỉnh sửa.

## **2. Mô tả chi tiết các thành phần**

|  |  |  |  |  |  |
|:--:|:--:|:--:|:--:|:--:|:--:|
| **STT** | **Tên** | **Kiểu dữ liệu \[Độ dài dữ liệu\]** | **Input/Output** | **Giá trị khởi tạo** | **Mô tả** |
| 1 | Hủy/Đóng | Button/Icon Button | Input | \- | Cho phép người dùng khởi tạo thao tác thoát khỏi chế độ chỉnh sửa. |
| 2 | Tiêu đề xác nhận | Label | Output | Theo ngữ cảnh | Hiển thị nội dung xác nhận việc hủy chỉnh sửa. |
| 3 | Nội dung cảnh báo | Label - Unicode String | Output | Theo thiết kế | Thông báo cho người dùng biết các thay đổi chưa lưu sẽ bị mất. |
| 4 | Tiếp tục chỉnh sửa | Button | Input | \- | Đóng popup xác nhận và quay lại trạng thái chỉnh sửa hiện tại. |
| 5 | Đóng/Rời khỏi | Button | Input | \- | Xác nhận hủy các thay đổi chưa lưu và thoát khỏi trạng thái chỉnh sửa. |

### **Chi tiết**

**1. Hủy/Đóng**

- Cho phép người dùng dừng thao tác chỉnh sửa.

- Áp dụng tương tự đối với các thao tác có khả năng làm người dùng rời khỏi nội dung đang chỉnh sửa như:

  - Nút **Hủy/Đóng**.

  - Icon **X**.

  - Quay lại màn hình trước.

  - Điều hướng sang màn hình khác nếu có áp dụng kiểm soát dữ liệu chưa lưu.

- Nếu **không có thay đổi dữ liệu**, hệ thống thực hiện đóng/rời khỏi ngay, không hiển thị popup xác nhận.

- Nếu **có thay đổi chưa lưu**, hệ thống hiển thị popup xác nhận hủy chỉnh sửa.

**2. Tiêu đề xác nhận**

- Trường hợp đóng popup:

> **Bạn có chắc muốn đóng popup này?**

- Trường hợp rời khỏi màn hình:

> **Bạn có chắc muốn rời khỏi màn hình này?**

**3. Nội dung cảnh báo**

> **Các thay đổi bạn vừa thực hiện sẽ không được lưu lại.**

**4. Tiếp tục chỉnh sửa**

- Đóng popup xác nhận.

- Giữ nguyên màn hình/popup chỉnh sửa.

- Giữ nguyên toàn bộ dữ liệu người dùng đã nhập hoặc thay đổi.

- Không cập nhật dữ liệu vào CSDL.

**5. Đóng/Rời khỏi**

- Xác nhận bỏ toàn bộ thay đổi chưa được lưu.

- Trường hợp chỉnh sửa trên popup: đóng popup và quay lại màn hình phía sau.

- Trường hợp chỉnh sửa trên màn hình: rời khỏi màn hình chỉnh sửa và quay về màn hình trước/màn hình danh sách tương ứng.

- Không cập nhật các thay đổi vừa thực hiện vào CSDL.

## **3. Điều kiện kiểm tra trước khi hủy chỉnh sửa**

|  |  |  |
|:--:|:--:|:--:|
| **STT** | **Điều kiện** | **Xử lý** |
| 1 | Người dùng chưa thay đổi dữ liệu so với dữ liệu ban đầu | Đóng/rời khỏi màn hình chỉnh sửa ngay, không hiển thị popup xác nhận. |
| 2 | Người dùng đã thay đổi dữ liệu nhưng chưa lưu | Hiển thị popup xác nhận hủy chỉnh sửa. |
| 3 | Người dùng chọn **Tiếp tục chỉnh sửa** | Đóng popup xác nhận; giữ nguyên dữ liệu đang chỉnh sửa. |
| 4 | Người dùng chọn **Đóng/Rời khỏi** | Bỏ các thay đổi chưa lưu và thoát khỏi trạng thái chỉnh sửa. |

**Quy tắc xác định có thay đổi:**

- Hệ thống xác định có thay đổi khi ít nhất một giá trị trên form khác với dữ liệu tại thời điểm bắt đầu chỉnh sửa.

- Bao gồm thay đổi giá trị nhập, lựa chọn, trạng thái hoặc dữ liệu đính kèm nếu chức năng có hỗ trợ.

- Trường hợp người dùng thay đổi một giá trị sau đó đưa về đúng giá trị ban đầu thì không được tính là còn thay đổi chưa lưu.

## **4. Luồng nghiệp vụ**

|  |  |
|:--:|:--:|
| **Bước** | **Mô tả** |
| 1 | Người dùng đang thực hiện chỉnh sửa và chọn **Hủy/Đóng**, icon **X** hoặc thao tác rời khỏi màn hình. |
| 2 | Hệ thống kiểm tra dữ liệu hiện tại với dữ liệu tại thời điểm bắt đầu chỉnh sửa. |
| 3 | Nếu không có thay đổi, hệ thống đóng popup/rời khỏi màn hình chỉnh sửa ngay và không hiển thị xác nhận. |
| 4 | Nếu có thay đổi chưa lưu, hệ thống hiển thị popup xác nhận với tiêu đề tương ứng và nội dung **“Các thay đổi bạn vừa thực hiện sẽ không được lưu lại.”** |
| 5 | Người dùng chọn **Tiếp tục chỉnh sửa** → hệ thống đóng popup xác nhận, giữ nguyên dữ liệu và cho phép người dùng tiếp tục thao tác. |
| 6 | Người dùng chọn **Đóng/Rời khỏi** → hệ thống loại bỏ các thay đổi chưa lưu và đóng popup/rời khỏi màn hình chỉnh sửa. |
| 7 | Hệ thống hiển thị lại dữ liệu đã được lưu trước thời điểm chỉnh sửa. Luồng xử lý kết thúc. |

## **5. Xử lý sau khi hủy chỉnh sửa**

|  |  |
|:--:|:--:|
| **Trường hợp** | **Xử lý** |
| Chưa có thay đổi | Đóng/rời khỏi ngay, không hiển thị popup xác nhận. |
| Có thay đổi chưa lưu | Hiển thị popup xác nhận hủy chỉnh sửa. |
| Chọn **Tiếp tục chỉnh sửa** | Giữ nguyên form, vị trí màn hình và toàn bộ dữ liệu người dùng đang chỉnh sửa. |
| Chọn **Đóng** tại popup chỉnh sửa | Bỏ thay đổi chưa lưu, đóng popup và hiển thị lại màn hình phía sau. |
| Chọn **Rời khỏi** tại màn hình chỉnh sửa | Bỏ thay đổi chưa lưu và điều hướng về màn hình trước/màn hình danh sách tương ứng. |
| Dữ liệu đã được lưu trước đó | Không bị thay đổi bởi thao tác hủy chỉnh sửa. |

Tên chức năng: Chuông thông báo (Notification Bell)

## Mục đích

Tính năng Chuông thông báo cho phép người dùng theo dõi các thông báo liên quan đến công việc được hệ thống phát sinh trong quá trình sử dụng. Người dùng có thể xem nhanh danh sách thông báo, phân biệt thông báo đã đọc/chưa đọc, đánh dấu thông báo đã đọc và truy cập trực tiếp đến đối tượng công việc liên quan từ thông báo.

## Phạm vi chức năng

Tính năng được hiển thị tại khu vực Header của hệ thống, dưới dạng Popover được mở khi người dùng click vào biểu tượng quả chuông.

Tính năng bao gồm các chức năng chính:

- Hiển thị số lượng thông báo chưa đọc trên biểu tượng quả chuông.

- Hiển thị danh sách thông báo khi người dùng mở Popover.

- Hiển thị danh sách thông báo chung.

- Đánh dấu một thông báo là đã đọc khi người dùng truy cập thông báo.

- Cho phép người dùng đánh dấu toàn bộ thông báo là đã đọc.

- Cho phép người dùng click vào thông báo để truy cập trực tiếp đến màn hình nghiệp vụ liên quan.

- Đồng bộ trạng thái thông báo giữa các tab trình duyệt.

- Hỗ trợ tải thêm thông báo khi người dùng cuộn đến cuối danh sách.

- Xử lý các trường hợp không có thông báo, thông báo không còn hiệu lực hoặc người dùng không còn quyền truy cập đối tượng liên quan.

## Đối tượng sử dụng

Toàn bộ người dùng đã đăng nhập và có quyền sử dụng hệ thống.

## Mô tả giao diện và hành vi

### 4.1. Biểu tượng thông báo

Biểu tượng quả chuông được hiển thị tại khu vực Header, cạnh khu vực thông tin tài khoản/Avatar.

Hệ thống hiển thị Badge trên biểu tượng quả chuông để thể hiện số lượng thông báo chưa đọc:

- Nếu không có thông báo chưa đọc: Không hiển thị Badge.

- Nếu có từ 1 đến 99 thông báo chưa đọc: Hiển thị số lượng tương ứng.

- Nếu có trên 99 thông báo chưa đọc: Hiển thị “99+”.

Số lượng thông báo chưa đọc được cập nhật theo dữ liệu thực tế của người dùng và có thể được cập nhật tự động khi phát sinh thông báo mới.

### 4.2. Mở và đóng danh sách thông báo

Khi người dùng click vào biểu tượng quả chuông, hệ thống mở Popover hiển thị danh sách thông báo.

Popover bao gồm:

- Khu vực tiêu đề “Thông báo”.

- Chức năng “Đánh dấu tất cả là đã đọc”.

- Danh sách thông báo chung.

Popover được đóng khi người dùng thực hiện một trong các thao tác:

- Click lại vào biểu tượng quả chuông.

- Click ra ngoài khu vực Popover.

- Nhấn phím ESC.

Khi mở Popover, hệ thống hiển thị trực tiếp danh sách tất cả thông báo.

<img src="media/image1.png" style="width:9.15104in;height:6.83134in" />

## Hiển thị danh sách thông báo

### 5.1. Danh sách thông báo chung

Danh sách thông báo hiển thị toàn bộ các thông báo của người dùng (bao gồm đã đọc và chưa đọc) trong cùng một danh sách duy nhất.

Danh sách được sắp xếp theo thời gian phát sinh, thông báo mới nhất được ưu tiên hiển thị trước.

### 5.2. Phân biệt trạng thái thông báo

Thông báo chưa đọc phải được phân biệt trực quan với thông báo đã đọc.

Thông báo chưa đọc có thể được thể hiện bằng các yếu tố như:

- Màu nền nổi bật.

- Chữ đậm.

- Chấm chỉ thị trạng thái chưa đọc.

Thông báo đã đọc hiển thị ở trạng thái bình thường và không còn chấm chỉ thị chưa đọc.

## Đánh dấu thông báo đã đọc

### 6.1. Đánh dấu một thông báo

Khi người dùng click vào một thông báo đang ở trạng thái chưa đọc, hệ thống cập nhật thông báo đó sang trạng thái đã đọc.

Sau khi cập nhật thành công:

- Số lượng Badge trên biểu tượng quả chuông giảm tương ứng.

- Thông báo được chuyển sang trạng thái đã đọc.

- Giao diện của thông báo trong danh sách cập nhật ngay sang trạng thái đã đọc.

- Hệ thống thực hiện điều hướng đến đối tượng nghiệp vụ liên quan nếu đối tượng vẫn tồn tại và người dùng có quyền truy cập.

### 6.2. Đánh dấu tất cả thông báo đã đọc

Hệ thống cung cấp chức năng “Đánh dấu tất cả là đã đọc”.

Khi người dùng thực hiện chức năng này:

- Toàn bộ thông báo chưa đọc của người dùng được chuyển sang trạng thái đã đọc.

- Badge trên biểu tượng quả chuông được cập nhật về 0 và không còn hiển thị.

- Toàn bộ thông báo trong danh sách hiển thị cập nhật sang trạng thái đã đọc.

Nếu không có thông báo chưa đọc, chức năng “Đánh dấu tất cả là đã đọc” không khả dụng hoặc được ẩn theo thiết kế giao diện.

## Điều hướng từ thông báo

Thông báo có thể chứa thông tin tham chiếu đến đối tượng nghiệp vụ liên quan, ví dụ nhiệm vụ trong phân hệ “Việc của tôi”.

Khi người dùng click vào thông báo:

- Hệ thống xác định đối tượng nghiệp vụ tương ứng.

- Cập nhật trạng thái thông báo thành đã đọc nếu thông báo chưa đọc.

- Đóng Popover thông báo.

- Điều hướng người dùng đến màn hình chi tiết của đối tượng nghiệp vụ tương ứng.

Đối với thông báo liên quan đến nhiệm vụ, hệ thống điều hướng đến màn hình Chi tiết việc của tôi cho nhiệm vụ tương ứng.

## Xử lý trường hợp đối tượng không tồn tại hoặc không có quyền truy cập

Nếu đối tượng nghiệp vụ được tham chiếu trong thông báo đã bị xóa, hủy, thu hồi hoặc người dùng không còn quyền truy cập:

- Thông báo vẫn được cập nhật sang trạng thái đã đọc.

- Hệ thống không điều hướng đến màn hình lỗi 404/500.

- Hệ thống hiển thị thông báo phù hợp cho người dùng, ví dụ:

“Nhiệm vụ không tồn tại hoặc bạn không có quyền truy cập.”

## Trạng thái không có dữ liệu

Khi người dùng không có thông báo:

- Khi người dùng chưa có thông báo nào, Popover hiển thị màn hình trạng thái trống (Empty State).

- Nội dung hiển thị: “Không có thông báo nào”.

Hệ thống không hiển thị danh sách rỗng hoặc khu vực dữ liệu không có nội dung mà không có thông báo trạng thái cho người dùng.

## Tải và hiển thị danh sách thông báo

Để đảm bảo hiệu năng, hệ thống không tải toàn bộ lịch sử thông báo ngay khi người dùng mở Popover.

Mặc định hệ thống tải 20 thông báo gần nhất.

Khi người dùng cuộn đến cuối danh sách, hệ thống tự động tải thêm các thông báo tiếp theo.

Các thông báo được tải thêm phải:

- Được nối tiếp vào danh sách hiện tại.

- Đảm bảo đúng thứ tự thời gian.

- Không bị trùng lặp.

- Không bị mất dữ liệu.

Khi đã tải hết dữ liệu, hệ thống không tiếp tục gọi API tải thêm dữ liệu không cần thiết.

## Đồng bộ trạng thái giữa nhiều tab

Trong trường hợp người dùng mở hệ thống trên nhiều tab trình duyệt, trạng thái thông báo phải được đồng bộ giữa các tab.

Khi người dùng thực hiện các thao tác như:

- Đọc một thông báo.

- Đánh dấu tất cả thông báo đã đọc.

- Nhận thông báo mới.

Hệ thống phải cập nhật trạng thái và số lượng Badge trên các tab liên quan theo trạng thái dữ liệu thực tế, hạn chế yêu cầu người dùng phải reload trang thủ công.

## Cập nhật thông báo mới

Khi có thông báo mới phát sinh cho người dùng, hệ thống cập nhật số lượng thông báo chưa đọc trên biểu tượng quả chuông.

Việc cập nhật được thực hiện tự động theo cơ chế Real-time được hệ thống triển khai.

Không yêu cầu người dùng phải reload trang để nhận biết có thông báo mới.

## Nguyên tắc xử lý lỗi

Trong trường hợp API lấy danh sách thông báo, cập nhật trạng thái thông báo hoặc đánh dấu tất cả đã đọc xảy ra lỗi:

- Hệ thống phải thông báo cho người dùng về trạng thái xử lý.

- Không được cập nhật giao diện thành trạng thái thành công khi dữ liệu phía hệ thống chưa được cập nhật thành công.

- Không làm mất các thông báo đã được tải trước đó.

- Cho phép người dùng thực hiện lại thao tác nếu phù hợp.

## Nguyên tắc dữ liệu và phân quyền

Người dùng chỉ được phép xem các thông báo thuộc tài khoản của mình.

Thông tin tham chiếu trong thông báo phải được kiểm tra quyền truy cập trước khi điều hướng người dùng đến đối tượng nghiệp vụ.

Hệ thống không được để người dùng truy cập hoặc xem dữ liệu của đối tượng mà người dùng không có quyền truy cập thông qua đường dẫn được cung cấp từ thông báo.

## Quy tắc chung

- Thông báo mới nhất được ưu tiên hiển thị trước.

- Trạng thái Đã đọc/Chưa đọc phải được đồng bộ chính xác giữa Badge trên biểu tượng quả chuông và danh sách thông báo.

- Khi người dùng click vào thông báo, trạng thái đọc phải được cập nhật theo quy định trước khi hoặc đồng thời với quá trình điều hướng.

- Không điều hướng người dùng đến màn hình lỗi khi đối tượng nghiệp vụ không còn tồn tại hoặc người dùng không có quyền truy cập.

- Danh sách thông báo phải hỗ trợ tải thêm khi có số lượng dữ liệu lớn.

- Trạng thái thông báo phải được đồng bộ khi người dùng thao tác trên nhiều tab.

- Dữ liệu thông báo phải tuân thủ quyền truy cập của người dùng.
