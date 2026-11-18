<!-- pk-source: 02. VHT gửi/Hệ thống Thầu cũ-20261030T064941Z-1-001/Hệ thống Thầu cũ/[HT cũ] Diễn giải.docx -->
<!-- pk-sha256: a060b7b0b385e165c73bf074c096e009eaad0887e3951ed3f5adedc3df1260e1 -->
<!-- pk-generated: 2026-10-30 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# HT-THAU-DG — bản đọc máy sinh

> Nguồn: `project-knowledge/02. VHT gửi/Hệ thống Thầu cũ-20261030T064941Z-1-001/Hệ thống Thầu cũ/[HT cũ] Diễn giải.docx`. Trích dẫn thì ghi mã **HT-THAU-DG** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

## 1. Màn hình danh sách

### 1.1. Tìm kiếm

Quy chế áp dụng - Single dropdown - Tất cả, Theo luật, Mua sắm thường xuyên

Cấp phê duyệt - Single dropdown - Tất cả, Tổng Công ty, Tập đoàn

Dự án/Đề tài - Single dropdown

Nguồn vốn - Sing dropdown - Đầu tư phát triển, Chi phí Sản xuất kinh doanh, Quỹ phát triển khoa học công nghệ, Vốn góp của chủ sở hữu

Người phụ trách - Multiple dropdown

Ngày QĐ KHLCNT - Date range picker

Tìm kiếm nhanh - Text input - Tìm theo mã hoặc tên KHLCNT

### 1.2. Thêm

Tên KHLCNT - Text input

Quy chế áp dụng - Single dropdown - Mua sắm thường xuyên, Theo luật

Cấp phê duyệt KHLCNT - Single dropdown - Tổng công ty, Tập đoàn

Người phụ trách - Multiple dropdown

Người soạn thảo - Multiple dropdown

### 1.3. Sửa

#### 1.3.1. Sửa tổng quan

Tên KHLCNT - Text input

Quy chế áp dụng - Single dropdown - Mua sắm thường xuyên, Theo luật - Không cho sửa

Cấp phê duyệt KHLCNT - Single dropdown - Tổng công ty, Tập đoàn

Người phụ trách - Multiple dropdown

Người soạn thảo - Multiple dropdown

#### 1.3.2. Sửa chi tiết

##### 1.3.2.1. Tab thông tin chung

Tên KHLCNT - Text input

Quy chế áp dụng - Single dropdown - Mua sắm thường xuyên, Theo luật - Không cho sửa

Cấp phê duyệt KHLCNT - Single dropdown - Tổng công ty, Tập đoàn

Người phụ trách - Multiple dropdown

Người soạn thảo - Multiple dropdown

##### 1.3.2.2. Tab thông tin checklist

Bảng gồm cột: STT, Nội dung, Ngày văn bản, Số văn bản, Ngày soạn thảo, Upload, File

Nội dung: TTr KHLCNT, BC thẩm định KHLCNT, QĐ phê duyệt KHLCNT, Đăng tải KHLCNT, Nhận xét của Ban Đầu tư XD, Phiếu trình GQCV, Mã KHLCNT trên SAP

Ngày văn bản - Date picker

Số văn bản - Text input

Ngày soạn thảo - dd/mm/yyyy hh:mm:ss - Không chỉnh sửa

Upload - Chọn file upload

File - Hiển thị file đã upload

Footer: Tổng - Tổng số tiền các gói thầu về mặt số và mặt chữ

##### 1.3.2.3. Tab gói thầu

Bảng: STT, Số gói thầu, Tên gói thầu, Giá gói thầu (VNĐ), Phương thức lựa LCNT, Hình thức LCNT, Thời gian thực hiện HĐ, Trạng thái

##### 1.3.2.4. Thêm/sửa gói thầu

Tên gói thầu - Text input

Số gói thầu - Text input

Trạng thái - Single dropdown -

Tóm tắt CV chính của gói thầu - Text area

Ký hợp đồng - Single dropdown - Có, không

Mật/không mật - Single dropdown - Mật, không mật

Người phụ trách - Multi dropdown

Giá gói thầu (sau thuế) - Number input

Đơn vị tiền tệ - Single dropdown

Tỷ giá - Number input

Dự toán gói thầu - Number input

Đơn vị tiền tệ - Single dropdown

Tỷ giá dự doán - Number input

TTr kinh phí: Single dropdown

**Khoản mục chi phí: ----------**

**Bảng thông tin TTr kinh phí: STT, Hành động, Số TTr, Tên TTr, Tên dự án/đề tài, Loại chi phí, Khoản mục chi phí**

**Bảng thông tin dự án/đề tài: STT, Hành động, Mã dự án/đề tài, Tên dự án/đề tài, Nguồn vốn, Giá trị phân bổ, footer tổng.**

Phạm vi cung cấp gói thầu - Single dropdown - Có chia phần, Không chia phần

Đơn vị sử dụng - Single dropdown

**Đơn vị giám sát**

Hình thức LCNT - Single dropdown

Phương thức LCNT - Single dropdown

LCNT trong nước/quốc tế - Single dropdown - Trong nước, quốc tế

Sơ tuyển/không sơ tuyển - Single dropdown - Sơ tuyển, không sơ tuyển

LCNT qua mạng/không qua mạng - Single dropdown - Qua mạng, không qua mạng

Áp dụng danh sách ngắn - Single dropdown - Có, không

Lĩnh vực - Single dropdown

Loại hợp đồng - Single dropdown

Thời gian bắt đầu LCNT - Single dropdown - Tháng, quý - Nếu chọn tháng, cho phép nhập số 1 → 12, nếu chọn quý cho phép chọn single dropdown từ I → IV; cả 2 cho phép chọn năm.

Thời gian thực hiện HĐ theo KHLCNT - Number input + single dropdown: Ngày, tuần, tháng, quý, năm.

Thời gian thực hiện gói thầu - Number input + single dropdown: Ngày, tuần, tháng, quý, năm.

### 1.4. Xóa

### 1.5. Xem chi tiết

### 1.6. Xuất báo cáo

## 2. Màn hình thêm

## 3. Màn hình Sửa

### 3.1. Màn hình sửa tổng quan

### 3.2. Màn hình Sửa chi tiết

#### 3.2.1. Mua sắm thường xuyên - Tổng công ty

#### 3.2.2. Mua sắm thường xuyên - Tập đoàn

#### 3.2.3. Theo luật - Tổng công ty

#### 3.2.4. Theo luật - Tập đoàn

## 4. Xóa

## 5. Xem chi tiết

## 6. Export file pdf
