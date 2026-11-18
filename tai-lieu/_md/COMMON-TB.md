<!-- pk-source: ../docs/SRS/02-srs/Common thông báo.docx -->
<!-- pk-sha256: a2b41c095a67750c8bdc4c65e6a84a1293d4b02cdcc8798b2c289e787472bbd8 -->
<!-- pk-generated: 2026-11-02 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# COMMON-TB — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/02-srs/Common thông báo.docx`. Trích dẫn thì ghi mã **COMMON-TB** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

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

- Mỗi dòng thông báo gồm Tiêu đề thông báo và Nội dung thông báo.

Popover được đóng khi người dùng thực hiện một trong các thao tác:

- Click lại vào biểu tượng quả chuông.

- Click ra ngoài khu vực Popover.

- Nhấn phím ESC.

Khi mở Popover, hệ thống hiển thị trực tiếp danh sách tất cả thông báo.

<img src="media/image1.png" style="width:6.16417in;height:7.15417in" />

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
