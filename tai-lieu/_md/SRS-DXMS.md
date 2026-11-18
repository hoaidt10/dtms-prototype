<!-- pk-source: ../docs/SRS/08-srs-dxms/ĐTMS_SRS Quản lý đề xuất mua sắm - V0.9.3.docx -->
<!-- pk-sha256: f1af94553f6f639aac80d62cf56d99b50f9bd4bcad63125a7eedf054424be1cd -->
<!-- pk-generated: 2026-11-10 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SRS-DXMS — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/08-srs-dxms/ĐTMS_SRS Quản lý đề xuất mua sắm - V0.9.3.docx`. Trích dẫn thì ghi mã **SRS-DXMS** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

MỤC LỤC

# TÀI LIỆU THIẾT KẾ CHI TIẾT — QUẢN LÝ ĐỀ XUẤT MUA SẮM

# 1. GIỚI THIỆU

## 1.1 Mục đích

Tài liệu mô tả chi tiết module Quản lý đề xuất mua sắm của hệ thống ĐTMS: chức năng, màn hình, luồng, trạng thái, phân quyền và quy tắc nghiệp vụ. Người đọc là đội phát triển, đội kiểm thử, BA và đơn vị nghiệp vụ. Đội phát triển và kiểm thử dùng tài liệu này làm căn cứ xây dựng và nghiệm thu.

## 1.2 Phạm vi

**Trong phạm vi:** quản lý ĐXMS, căn cứ và hạng mục, rà soát tồn kho, yêu cầu báo giá, hồ sơ trình duyệt, thẩm định và xử lý ý kiến, điều chỉnh ĐXMS; xử lý các bước của quy trình phê duyệt ĐXMS và quy trình điều chỉnh ĐXMS.

**Dùng lại từ tài liệu thiết kế khác, không mô tả lại:** Việc của tôi và xử lý công việc, E-form, Ma trận hành động, Quản lý quy trình, Thông báo, Danh mục dùng chung (mục 2.2). Quy tắc giao diện dùng chung ghi ở mục 4.

**Ngoài phạm vi:** Khoản đầu tư, Lựa chọn nhà thầu, Hợp đồng. Các tích hợp VOffice, SAP, Quản lý tài sản, AI chỉ ghi điểm giao tiếp (mục 2.2). Thiết kế cơ sở dữ liệu ở mục 5 là đề xuất cho module; thiết kế API để tài liệu riêng.

## 1.3 Khái niệm, thuật ngữ

| Thuật ngữ | Ý nghĩa |
|----|----|
| ĐXMS | Đề xuất mua sắm: tập hợp các nhu cầu mua sắm hàng hóa, dịch vụ của một đơn vị. Là đối tượng duy nhất người dùng làm việc: một mã, một trạng thái, một màn chi tiết. Gồm hai loại: Tạo mới và Điều chỉnh (BR-DXMS-C-03) |
| Hồ sơ | Phần xử lý của ĐXMS theo quy trình ở tầng dữ liệu: tiến trình, dữ liệu form của các bước, văn bản trình duyệt (Tờ trình, Checklist, phụ lục), phiên bản, kết quả ký. Mỗi ĐXMS đúng một hồ sơ, tạo cùng khi Lưu ĐXMS (BR-DXMS-C-02). Giao diện không hiển thị mã, danh sách, trạng thái hồ sơ; trong tài liệu, "hồ sơ" chỉ phần đang được trình duyệt của ĐXMS |
| ĐXMS điều chỉnh | ĐXMS tạo ra để điều chỉnh một ĐXMS Đã phê duyệt: mã mới, liên kết Điều chỉnh từ, lần điều chỉnh, chạy quy trình MS02 (BR-DXMS-C-03) |
| Chuỗi điều chỉnh | ĐXMS gốc và các ĐXMS điều chỉnh nối nhau bằng liên kết Điều chỉnh từ (BR-DXMS-C-30) |
| Sao chép | Tạo ĐXMS Tạo mới từ dữ liệu của một ĐXMS Dừng xử lý; chỉ là liên kết tham khảo, không thuộc chuỗi điều chỉnh (BR-DXMS-C-03) |
| Đơn vị đề xuất | Đơn vị có nhu cầu mua sắm, hoặc được giao chủ trì lập ĐXMS |
| TTMS | Đầu mối, cơ quan chủ trì đầu tư mua sắm; là CQCM chủ trì về đầu tư – xây dựng |
| CQCM | Cơ quan chuyên môn tham gia thẩm định |
| Người có thẩm quyền | Người phê duyệt ĐXMS theo phân cấp, ủy quyền |
| Tài liệu đầu vào, căn cứ | Tài liệu làm cơ sở lập ĐXMS: Kế hoạch SXKD hằng năm, Phương án kinh doanh, Quyết định phê duyệt nhiệm vụ khoa học công nghệ, Tờ trình, Kế hoạch, chủ trương đã được phê duyệt, văn bản chỉ đạo khác |
| RSTK | Rà soát tồn kho |
| Phiên bản hồ sơ | Bản nội dung hồ sơ tại một thời điểm, xác định kết quả ký nào còn hợp lệ (BR-DXMS-C-11) |
| Vòng xử lý | Số lần hồ sơ đi qua nhánh giải trình (BR-DXMS-C-15) |
| Lần thẩm định | Số lần hồ sơ được gửi CQCM thẩm định (BR-DXMS-07-01) |
| NLV | Ngày làm việc |
| T0 | Thời điểm hệ thống gửi yêu cầu thẩm định tới CQCM ở bước 18 lần đầu, là mốc tính KPI (mục 2.3.3) |
| Nhóm 1, Nhóm 2 | Nhóm 1: hàng hóa, dịch vụ mua sẵn. Nhóm 2: hàng hóa sản xuất theo yêu cầu, gia công theo thiết kế |
| ĐXMS căn cứ | ĐXMS Đã phê duyệt mà ĐXMS điều chỉnh lấy làm bản trước điều chỉnh (BR-DXMS-09-03) |
| ĐXMS hiệu lực của chuỗi | ĐXMS Đã phê duyệt mới nhất của chuỗi điều chỉnh; quyết định giá trị hiệu lực và phần căn cứ đang giữ (BR-DXMS-C-30) |
| Giá trị hiệu lực | Giá trị đang được phê duyệt của ĐXMS (BR-DXMS-C-04) |
| Phiên bản có hiệu lực | Nội dung của ĐXMS hiệu lực của chuỗi (BR-DXMS-C-04, BR-DXMS-C-30) |
| Cơ sở giá | Đơn giá được chốt cho từng hạng mục sau khi so sánh báo giá (BR-DXMS-04-10) |
| Tồn khả dụng | Số hàng trong kho còn dùng được cho ĐXMS (BR-DXMS-03-02) |
| Người phụ trách hồ sơ | Người tạo ĐXMS, nhận các bước của đơn vị đề xuất (BR-DXMS-08-01) |
| Danh sách xử lý | Những người được giao, đã thao tác hoặc ký trên hồ sơ, dùng để xét quyền xem (BR-DXMS-01-09) |
| Mật | Thuộc tính của ĐXMS, hồ sơ; hồ sơ Mật chỉ người trong danh sách xử lý được xem và ký bản giấy (BR-DXMS-C-25) |
| Luồng con | MS01.01, MS01.02, MS01.03 của quy trình phê duyệt; MS02.01, MS02.02, MS02.03 của quy trình điều chỉnh. Hệ thống xác định khi chạy (BR-DXMS-C-05) |
| Checklist 01, 02 | Danh mục hồ sơ kèm Tờ trình, lập cùng dự thảo ở bước 11, 12 và ký cùng BM-04; 01 cho nhánh từ ngưỡng trở lên, 02 cho nhánh dưới ngưỡng |
| VOffice | Hệ thống trình ký, phát hành văn bản điện tử của khách hàng |
| QLTS | Phân hệ Quản lý tài sản, kho, cung cấp số liệu tồn kho |
| Ban ĐTXD | Ban Đầu tư – Xây dựng Tập đoàn |

## 1.4 Tài liệu tham khảo

| Tài liệu | Sử dụng |
|----|----|
| Quy chế quản lý hoạt động đầu tư, Quyết định 12868/QĐ-CNVTQĐ | Thẩm quyền, ngưỡng, điều kiện báo cáo Tổng Giám đốc Tập đoàn |
| Quy trình xây dựng và phê duyệt ĐXMS QT.CNVTQĐ.ĐTXD.10.2.1, ban hành lần 03 và bộ biểu mẫu | Trình tự, biểu mẫu BM-01 đến BM-09, Checklist 01, 02 |
| Quyết định 16026/QĐ-VHT về KPI đánh giá hoạt động ĐTMS 2026 | Hạn xử lý từng bước, KPI, quy định số lần ý kiến |
| Sơ đồ BPMN quy trình phê duyệt ĐXMS và quy trình điều chỉnh ĐXMS | Trình tự bước, cổng, nhánh |
| Tài liệu diễn giải quy trình phê duyệt, điều chỉnh ĐXMS | Nguyên tắc xử lý, nội dung cần đặc tả thêm |
| Gói đặc tả ĐTMS, bản 27/10/2026 | Quy tắc dùng chung ở mục 4, các phân hệ dùng lại ở mục 2.2 |

## 1.5 Mô tả tài liệu

Mục 2 mô tả tổng quan giải pháp và các quy định chung của module (trạng thái, phân quyền, hạn xử lý, quy tắc chung, nhật ký, tham số). Mục 3 thiết kế chi tiết từng nghiệp vụ; mỗi chức năng gồm thông tin chung, màn hình, mô tả chi tiết các thành phần, luồng nghiệp vụ, tiêu chí chấp nhận. Mục 4 là thiết kế dùng chung và tái sử dụng. Mục 5 là thiết kế cơ sở dữ liệu. Mục 6 là thiết kế đảm bảo tuân thủ tiêu chuẩn quản trị dữ liệu. Mục 7 là phụ lục đối chiếu với sơ đồ quy trình.

# 2. TỔNG QUAN GIẢI PHÁP

## 2.1 Tổng quan chức năng

Module gồm 42 chức năng, chia thành 9 nghiệp vụ. Mã chức năng nối tiếp mã của gói đặc tả.

**Sơ đồ phân rã chức năng:**

<img src="media/rId36.png" style="width:6.25in;height:5.90537in" alt="Sơ đồ phân rã chức năng" />

| Nghiệp vụ | Tên | Mã chức năng | Số chức năng |
|----|----|----|----|
| 3.1.1 | Đề xuất mua sắm | DTMS_CN_0135 – DTMS_CN_0139, DTMS_CN_0176 | 6 |
| 3.1.2 | Căn cứ và hạng mục | DTMS_CN_0140 – DTMS_CN_0141 | 2 |
| 3.1.3 | Rà soát tồn kho | DTMS_CN_0142 – DTMS_CN_0144 | 3 |
| 3.1.4 | Yêu cầu báo giá trong ĐXMS | DTMS_CN_0145 – DTMS_CN_0149 | 5 |
| 3.1.5 | Danh sách yêu cầu báo giá | DTMS_CN_0150 – DTMS_CN_0152 | 3 |
| 3.1.6 | Hồ sơ ĐXMS | DTMS_CN_0153 – DTMS_CN_0156 | 4 |
| 3.1.7 | Thẩm định và xử lý ý kiến | DTMS_CN_0157 – DTMS_CN_0160 | 4 |
| 3.1.8 | Xử lý các bước quy trình phê duyệt | DTMS_CN_0161 – DTMS_CN_0170 | 10 |
| 3.1.9 | Điều chỉnh ĐXMS | DTMS_CN_0171 – DTMS_CN_0175 | 5 |

ĐXMS Tạo mới chạy một quy trình MS01: một định nghĩa quy trình, một phiên bản đang hoạt động, một bộ luật hiển thị. Quy trình có ba luồng con, người dùng không chọn; hệ thống xác định khi chạy, ở cổng sau bước 10 và ở bước 48 (BR-DXMS-C-05):

| Luồng con | Điều kiện | Dự thảo | Thẩm định | Báo cáo Tập đoàn | Văn bản phê duyệt |
|----|----|----|----|----|----|
| MS01.01 | Từ ngưỡng trở lên (mặc định 160 tỷ đồng), bước 48 chọn Có báo cáo Tổng Giám đốc Tập đoàn | BM-01, Checklist 01 | BM-04, BM-05 | BM-06, BM-07 | BM-08 |
| MS01.02 | Từ ngưỡng trở lên, bước 48 chọn Không | BM-01, Checklist 01 | BM-04, BM-05 | Không | BM-08 |
| MS01.03 | Dưới ngưỡng | BM-09, Checklist 02 | BM-04, ký trực tiếp BM-09 | Không | BM-09 |

ĐXMS điều chỉnh chạy một quy trình MS02 cùng cấu trúc. Ba luồng MS02.01, MS02.02, MS02.03 tương ứng ba dòng trên, xác định cùng cách, theo giá trị sau điều chỉnh (BR-DXMS-09-01, BR-DXMS-C-26).

## 2.2 Mô hình giao tiếp với hệ thống/module chức năng khác

**Sơ đồ quan hệ chức năng:**

<img src="media/rId40.png" style="width:6.25in;height:3.22205in" alt="Sơ đồ quan hệ chức năng" />

Chiều mũi tên là chiều dữ liệu. Chi tiết từng điểm giao tiếp:

| Module | ĐXMS cần | Chiều | Tình trạng thiết kế |
|----|----|----|----|
| Việc của tôi, xử lý công việc | Danh sách, chi tiết, nút theo luật hiển thị, nút Cập nhật nhân sự | Dùng lại | DTMS_CN_0108 – DTMS_CN_0112 |
| E-form | Form từng bước, sinh văn bản | Dùng lại | DTMS_CN_0001 – DTMS_CN_0003, DTMS_CN_0088 – DTMS_CN_0095 |
| Quản lý quy trình | Luật hiển thị, SLA từng bước, giám sát tiến trình | Dùng lại | DTMS_CN_0114 – DTMS_CN_0134 |
| Thông báo | Giao việc, cảnh báo | Dùng lại | DTMS_CN_0096 – DTMS_CN_0107 |
| Danh mục dùng chung | Loại hàng hóa, đơn vị tính, tiền tệ, nhà cung cấp, ngưỡng phân luồng, loại tài liệu căn cứ | Dùng lại | Có, trừ Nhà cung cấp, Loại tài liệu căn cứ; Ngưỡng phân luồng cần mở rộng DTMS_MD_0015 cho ĐXMS |
| Người dùng, vai trò | Người dùng đang hoạt động theo vai trò, đơn vị, dùng cho Nhân sự thực hiện | Nhận | Dùng chung của hệ thống |
| Quản lý tài sản, kho | Tồn kho sổ sách, kiểm thực tế, phần đang giữ | Nhận | Chưa có |
| Kế hoạch, dự toán, eBOM, mBOM | Dữ liệu căn cứ | Nhận | Chưa có |
| VOffice | Gửi trình ký, nhận kết quả ký | Hai chiều | Chưa có |
| SAP | Đồng bộ từ tờ trình | Gửi | Chưa có |
| AI | Gợi ý, tóm tắt, kiểm tra | Hai chiều | Chưa có |
| Lựa chọn nhà thầu, Hợp đồng | Kết quả đã thực hiện cho hồ sơ điều chỉnh | Nhận | Chưa có |

## 2.3 Các quy định chung

Các quy định áp dụng cho toàn module: trạng thái, vai trò và phân quyền, hạn xử lý, quy tắc chung, nhật ký, tham số hệ thống. Chức năng ở mục 3 dẫn chiếu tới các mục này, không nhắc lại.

### 2.3.1 Trạng thái

Có ba lớp trạng thái, lớp trên suy từ lớp dưới, không nhập tay: **ĐXMS** suy từ hồ sơ của nó và ĐXMS điều chỉnh của nó; **Hồ sơ** suy từ tiến trình (tầng dữ liệu, không hiển thị); **Giai đoạn** suy từ bước hiện tại. Các bộ trạng thái riêng của một nghiệp vụ định nghĩa tại quy tắc của nghiệp vụ đó: yêu cầu báo giá (BR-DXMS-04-08), phần tồn kho đang giữ (BR-DXMS-03-05), bản rà soát (BR-DXMS-03-07). Cùng một mã ở hai bộ khác nhau, như FAILED, STOPPED, được hiểu theo đối tượng mang mã. Trạng thái công việc trong Việc của tôi và trạng thái tiến trình trong Giám sát tiến trình theo thiết kế của phân hệ tương ứng.

#### 2.3.1.1 Trạng thái ĐXMS

| Trạng thái | Ý nghĩa | Vào khi | Ra khi | Kết thúc? | Được sửa |
|----|----|----|----|----|----|
| Đang phê duyệt | Hồ sơ của ĐXMS đang xử lý; áp cả cho ĐXMS điều chỉnh đang được phê duyệt | Lưu ĐXMS | Hồ sơ tới Hoàn thành, Dừng xử lý, Đã hủy | Không | Trừ Mã, Đơn vị đề xuất, Mật |
| Đã phê duyệt | Có hiệu lực; đầu chuỗi điều chỉnh | Hồ sơ Hoàn thành; ĐXMS điều chỉnh của nó Dừng xử lý | Lưu ĐXMS điều chỉnh của nó | Không | Không |
| Đang điều chỉnh | Có ĐXMS điều chỉnh của nó đang phê duyệt; vẫn còn hiệu lực, không tạo được điều chỉnh khác | Lưu ĐXMS điều chỉnh của nó | ĐXMS điều chỉnh Đã phê duyệt hoặc Dừng xử lý | Không | Không |
| Đã được điều chỉnh | ĐXMS điều chỉnh của nó đã được phê duyệt; hết hiệu lực, chỉ xem, kèm liên kết tới ĐXMS thay thế | ĐXMS điều chỉnh Đã phê duyệt | — | Có | Không |
| Dừng xử lý | Hồ sơ kết thúc mà không được duyệt | Hồ sơ tới Dừng xử lý, Đã hủy | — | Có | Không |

ĐXMS điều chỉnh hiển thị trạng thái kèm lần điều chỉnh, ví dụ: Đã phê duyệt (điều chỉnh lần 2). ĐXMS Dừng xử lý giữ để tra cứu; muốn đề xuất lại thì Sao chép thành ĐXMS mới (BR-DXMS-C-03). Khi ĐXMS điều chỉnh Dừng xử lý, ĐXMS nó điều chỉnh về Đã phê duyệt (BR-DXMS-C-22).

#### 2.3.1.2 Trạng thái hồ sơ

Tầng dữ liệu, không hiển thị; trạng thái ĐXMS suy từ bảng này (mục 2.3.1.1).

| Trạng thái | Ý nghĩa | Vào khi | Ra khi | Kết thúc? | Trạng thái tiến trình tương ứng |
|----|----|----|----|----|----|
| Đang xử lý | Tiến trình đang chạy | Lưu hồ sơ, tiến trình khởi tạo | Tới điểm kết thúc, hoặc bị hủy | Không | Đang chạy, Quá hạn |
| Hoàn thành | Được phê duyệt | Nhận kết quả ký hợp lệ ở bước 61 | — | Có | Hoàn thành |
| Dừng xử lý | Kết thúc theo chỉ đạo khác của Người có thẩm quyền | Bước 60 chọn Chỉ đạo khác | — | Có | Hoàn thành |
| Đã hủy | Bị hủy theo thẩm quyền | Thao tác Hủy ĐXMS | — | Có | Đã hủy |

#### 2.3.1.3 Trạng thái văn bản trình ký

| Trạng thái | Ý nghĩa | Vào khi | Ra khi |
|----|----|----|----|
| Dự thảo | Đang soạn, chưa gửi ký | Hệ thống sinh hoặc người dùng lập | Gửi trình ký |
| Đang trình ký | Đã gửi VOffice, chờ kết quả | Hệ thống tạo yêu cầu trình ký | Có kết quả, hoặc lỗi |
| Đã ký | Ký thành công trên đúng phiên bản hiện tại | VOffice trả kết quả thành công; hồ sơ Mật ký bản giấy thì khi người xử lý xác nhận nhập kết quả (BR-DXMS-C-25) | Phiên bản hồ sơ đổi |
| Từ chối | Người ký không đồng ý | VOffice trả kết quả từ chối | Văn bản lập lại sau khi hồ sơ đi theo nhánh Không đồng ý (BR-DXMS-08-04) |
| Đã hủy | Yêu cầu trình ký bị hủy | VOffice trả kết quả hủy | Gửi lại hoặc Coi như Từ chối tại công việc Xử lý trình ký (BR-DXMS-08-04) |
| Lỗi gửi | Lỗi kỹ thuật, chưa có kết quả | VOffice lỗi, không phản hồi | Gửi lại |
| Không còn hiệu lực | Đã ký trên phiên bản cũ | Phiên bản hồ sơ đổi | — |

#### 2.3.1.4 Giai đoạn xử lý của hồ sơ

Giai đoạn là nhãn hiển thị trên danh sách và Chi tiết đề xuất mua sắm khi ĐXMS Đang phê duyệt. Mỗi bước thuộc đúng một giai đoạn (mục 7.1). Khi nhiều công việc chạy song song, các công việc đó cùng một giai đoạn.

| Mã | Giai đoạn | Bước | Vào từ | Ra tới |
|----|----|----|----|----|
| GĐ-01 | Chuẩn bị căn cứ | 1–6 | Khởi tạo | GĐ-02; lặp về bước 4 khi thiếu dữ liệu |
| GĐ-02 | Rà soát tồn kho | 7 | GĐ-01 | GĐ-03 |
| GĐ-03 | Lấy báo giá | 8–10 | GĐ-02 | GĐ-04; lặp về bước 9 khi không đạt |
| GĐ-04 | Lập dự thảo | 11, 12, 14 | GĐ-03, GĐ-05, GĐ-09 | GĐ-05 |
| GĐ-05 | Kiểm duyệt cấp đơn vị | 13 | GĐ-04, GĐ-08 | GĐ-06; về GĐ-04 |
| GĐ-06 | Chọn CQCM | 15–18 | GĐ-05 | GĐ-07; lặp về bước 16 |
| GĐ-07 | CQCM thẩm định | 19–24 | GĐ-06 | GĐ-08; lặp về bước 19 |
| GĐ-08 | Xử lý ý kiến | 25, 26, 28, 29 | GĐ-07, GĐ-11, GĐ-12, GĐ-13 | GĐ-10, GĐ-05, GĐ-09 |
| GĐ-09 | Họp, kết luận | 30–34 | GĐ-08 | GĐ-10, GĐ-04 |
| GĐ-10 | Hoàn chỉnh, ký lại | 27, 35–37 | GĐ-08, GĐ-09 | GĐ-11 |
| GĐ-11 | Ký thẩm định | 38–40 (BM-09), 41–47 (BM-05) | GĐ-10 | GĐ-12, GĐ-13; về GĐ-08 |
| GĐ-12 | Báo cáo Tập đoàn | 48–56 | GĐ-11 | GĐ-13; về GĐ-08 |
| GĐ-13 | Phê duyệt | 57–60 | GĐ-11, GĐ-12 | GĐ-14, kết thúc; về GĐ-08 |
| GĐ-14 | Ký duyệt, phát hành | 61 | GĐ-13 | Kết thúc |

Mọi cổng, nhánh và trạng thái sau nhánh liệt kê tại mục 7.2.

#### 2.3.1.5 Mã trạng thái

Mã dùng tiếng Anh, viết hoa, nối bằng gạch dưới, tối đa 20 ký tự. API và dữ liệu dùng mã; giao diện chỉ hiển thị tên tiếng Việt. Trạng thái hồ sơ khai báo trong cấu hình hệ thống, loại PROFILE_STATUS.

| Lớp       | Tên hiển thị                | Mã                |
|-----------|-----------------------------|-------------------|
| ĐXMS      | Đang phê duyệt              | APPROVING         |
| ĐXMS      | Đã phê duyệt                | APPROVED          |
| ĐXMS      | Đang điều chỉnh             | ADJUSTING         |
| ĐXMS      | Đã được điều chỉnh          | SUPERSEDED        |
| ĐXMS      | Dừng xử lý                  | STOPPED           |
| Hồ sơ     | Đang xử lý                  | PROCESSING        |
| Hồ sơ     | Hoàn thành                  | COMPLETED         |
| Hồ sơ     | Dừng xử lý                  | STOPPED           |
| Hồ sơ     | Đã hủy                      | CANCELED          |
| Văn bản   | Dự thảo                     | DRAFT             |
| Văn bản   | Đang trình ký               | PENDING_SIGN      |
| Văn bản   | Đã ký                       | SIGNED            |
| Văn bản   | Từ chối                     | REJECTED_SIGN     |
| Văn bản   | Đã hủy                      | CANCELLED_SIGN    |
| Văn bản   | Lỗi gửi                     | FAILED            |
| Văn bản   | Không còn hiệu lực          | OBSOLETE          |
| Giai đoạn | GĐ-01 Chuẩn bị căn cứ       | BASIS_PREPARATION |
| Giai đoạn | GĐ-02 Rà soát tồn kho       | STOCK_REVIEW      |
| Giai đoạn | GĐ-03 Lấy báo giá           | QUOTATION         |
| Giai đoạn | GĐ-04 Lập dự thảo           | DRAFTING          |
| Giai đoạn | GĐ-05 Kiểm duyệt cấp đơn vị | UNIT_REVIEW       |
| Giai đoạn | GĐ-06 Chọn CQCM             | AGENCY_SELECTION  |
| Giai đoạn | GĐ-07 CQCM thẩm định        | AGENCY_APPRAISAL  |
| Giai đoạn | GĐ-08 Xử lý ý kiến          | OPINION_HANDLING  |
| Giai đoạn | GĐ-09 Họp, kết luận         | MEETING           |
| Giai đoạn | GĐ-10 Hoàn chỉnh, ký lại    | FINALIZE_RESIGN   |
| Giai đoạn | GĐ-11 Ký thẩm định          | APPRAISAL_SIGNING |
| Giai đoạn | GĐ-12 Báo cáo Tập đoàn      | GROUP_REPORT      |
| Giai đoạn | GĐ-13 Phê duyệt             | APPROVAL          |
| Giai đoạn | GĐ-14 Ký duyệt, phát hành   | ISSUE_SIGNING     |

### 2.3.2 Vai trò và phân quyền

**Vai trò:**

| Mã | Vai trò | Bước quy trình |
|----|----|----|
| ĐV | Chuyên viên đơn vị đề xuất | 1, 4, 5, 7, 8, 10, 11, 12, 16, 26, 27, 28 |
| CH | Chỉ huy đơn vị đề xuất | 13 |
| TT | TTMS, gồm chuyên viên và lãnh đạo TTMS (bước 38, 43) | 17, 31, 32, 33, 38, 42, 43, 48, 50, 58, 59; ghi nhận thay ở 53–56 (BR-DXMS-08-09) |
| CQ | CQCM trong danh sách thẩm định, gồm chuyên quản và Chỉ huy CQCM. TTMS là CQCM về đầu tư – xây dựng nên người TTMS xử lý các bước này cho phần của TTMS (BR-DXMS-08-01) | 19, 20, 35, 36, 46 |
| PG | Phó TGĐ/Phó GĐ chuyên trách | 39, 47 |
| TV | Thủ trưởng đơn vị VHT. Ở bước 60 là Người có thẩm quyền theo BR-DXMS-C-29, mặc định Thủ trưởng VHT; người được xác định có quyền của cột TV tại bước 60 của hồ sơ đó | 34, 51, 60 |
| TĐ | Ban ĐTXD Tập đoàn, TGĐ Tập đoàn | 53, 54, 55, 56 |

Hệ thống và AI thực hiện 23 bước tự động còn lại. Khi trình ký lỗi hoặc bị hủy, người xử lý bước liền trước nhận công việc Xử lý trình ký (BR-DXMS-08-04).

**Phạm vi dữ liệu (BR-DXMS-C-25):**

| Vai trò | Thấy dữ liệu |
|----|----|
| ĐV, CH | ĐXMS, hồ sơ của đơn vị mình. ĐV thấy thêm ĐXMS do mình tạo cho đơn vị khác (BR-DXMS-01-08). Ở đơn vị khác thì như CQ, PG, TĐ |
| TT, TV | Toàn bộ ĐXMS, hồ sơ, trừ ĐXMS Mật và hồ sơ Mật mà mình không thuộc danh sách xử lý. Chi tiết tại BR-DXMS-01-09 |
| CQ, PG, TĐ | Hồ sơ mình thuộc danh sách xử lý, và ĐXMS của hồ sơ đó. Chi tiết tại BR-DXMS-01-09 |

Người dùng thuộc một đơn vị khi được gán vào đơn vị đó, gồm đơn vị chính và kiêm nhiệm; không tính đơn vị cha, con; xét tại thời điểm thao tác. Người có nhiều vai trò được cộng quyền của mọi vai trò.

**Ma trận quyền theo chức năng.** T = thao tác (thêm, sửa, xóa, xử lý), X = chỉ xem, — = không có quyền. Quyền ở nhóm 3.8 chỉ có hiệu lực tại đúng bước được giao và theo luật hiển thị hành động.

| STT | Chức năng | Tên | ĐV | CH | TT | CQ | PG | TV | TĐ |
|----|----|----|----|----|----|----|----|----|----|
| 1 | DTMS_CN_0135 | Xem danh sách ĐXMS và tìm kiếm | T | X | X | X | X | X | — |
| 2 | DTMS_CN_0136 | Thêm mới ĐXMS | T | — | — | — | — | — | — |
| 3 | DTMS_CN_0137 | Xem chi tiết ĐXMS | X | X | X | X | X | X | X |
| 4 | DTMS_CN_0138 | Sửa ĐXMS | T | — | — | — | — | — | — |
| 5 | DTMS_CN_0139 | Xem kết quả và văn bản phê duyệt | X | X | X | X | X | X | X |
| 6 | DTMS_CN_0140 | Lựa chọn và kiểm tra căn cứ hình thành ĐXMS | T | X | X | X | X | X | X |
| 7 | DTMS_CN_0141 | Quản lý hạng mục ĐXMS và liên kết căn cứ | T | X | X | X | X | X | X |
| 8 | DTMS_CN_0142 | Lấy dữ liệu tồn kho từ phân hệ QLTS | X | X | T | — | — | — | — |
| 9 | DTMS_CN_0143 | Rà soát và chốt nhu cầu mua sau sử dụng tồn kho | T | X | X | — | — | — | — |
| 10 | DTMS_CN_0144 | Xem lịch sử rà soát tồn kho | X | X | X | X | X | X | X |
| 11 | DTMS_CN_0145 | Lập yêu cầu báo giá và chọn nhà cung cấp | T | X | X | — | — | — | — |
| 12 | DTMS_CN_0146 | Nhập yêu cầu báo giá từ tệp | T | — | — | — | — | — | — |
| 13 | DTMS_CN_0147 | Quản lý tài liệu báo giá | T | X | X | X | — | — | — |
| 14 | DTMS_CN_0148 | Đánh giá báo giá và xác lập cơ sở giá | T | X | X | X | — | — | — |
| 15 | DTMS_CN_0149 | Xem lịch sử báo giá, cơ sở giá | X | X | X | X | X | X | X |
| 16 | DTMS_CN_0150 | Xem danh sách yêu cầu báo giá và tìm kiếm | X | X | X | — | — | — | — |
| 17 | DTMS_CN_0151 | Xem chi tiết yêu cầu báo giá | X | X | X | X | X | X | X |
| 18 | DTMS_CN_0152 | Xuất file yêu cầu báo giá | T | X | T | — | — | — | — |
| 19 | DTMS_CN_0153 | Xem danh sách hồ sơ ĐXMS và tìm kiếm | X | X | X | X | X | X | — |
| 20 | DTMS_CN_0154 | Khởi tạo hồ sơ phê duyệt ĐXMS | T | — | — | — | — | — | — |
| 21 | DTMS_CN_0155 | Xem hồ sơ ĐXMS, tài liệu và kết quả phê duyệt | X, Hủy hồ sơ | X | X, Hủy hồ sơ | X | X | X | X |
| 22 | DTMS_CN_0156 | Tra cứu và so sánh phiên bản hồ sơ ĐXMS | X | X | X | X | X | X | X |
| 23 | DTMS_CN_0157 | Theo dõi cơ quan và kết quả thẩm định | X | X | X | X | X | X | — |
| 24 | DTMS_CN_0158 | Cập nhật tiếp thu, giải trình và bảo lưu ý kiến | T | X | X | X | — | X | — |
| 25 | DTMS_CN_0159 | Theo dõi các vòng và lịch sử xử lý ý kiến | X | X | X | X | — | X | — |
| 26 | DTMS_CN_0160 | Ghi nhận kết quả họp, kết luận xử lý | X | X | T | X | — | T | — |
| 27 | DTMS_CN_0161 | Xử lý bước: Xác định thông tin cơ bản, bóc tách căn cứ | T | — | — | — | — | — | — |
| 28 | DTMS_CN_0162 | Xử lý bước: Hoàn thiện dự thảo, thẩm định cấp đơn vị | T | T | — | — | — | — | — |
| 29 | DTMS_CN_0163 | Xử lý bước: Chọn và xác nhận danh sách CQCM | T | — | T | — | — | — | — |
| 30 | DTMS_CN_0164 | Xử lý bước: CQCM thẩm định bằng BM-04 | — | — | T | T | — | — | — |
| 31 | DTMS_CN_0165 | Xử lý bước: Xử lý ý kiến, giải trình, họp, kết luận | T | — | T | — | — | T | — |
| 32 | DTMS_CN_0166 | Xử lý bước: Rà soát lại, ký lại phiên bản hiện tại | — | — | T | T | — | — | — |
| 33 | DTMS_CN_0167 | Xử lý bước: Ký thẩm định trực tiếp BM-09 | — | — | T | — | T | — | — |
| 34 | DTMS_CN_0168 | Xử lý bước: Lập và ký BM-05 | — | — | T | T | T | — | — |
| 35 | DTMS_CN_0169 | Xử lý bước: Báo cáo Tập đoàn BM-06, BM-07 | — | — | T | — | — | T | T |
| 36 | DTMS_CN_0170 | Xử lý bước: Quyết định phê duyệt BM-08, ký duyệt | — | — | T | — | — | T | — |
| 37 | DTMS_CN_0171 | Xem danh sách hồ sơ điều chỉnh | X | X | X | X | X | X | — |
| 38 | DTMS_CN_0172 | Lập hồ sơ điều chỉnh từ phiên bản đã duyệt | T | — | — | — | — | — | — |
| 39 | DTMS_CN_0173 | So sánh và kiểm tra tác động điều chỉnh | T | X | X | X | X | X | X |
| 40 | DTMS_CN_0174 | Theo dõi lịch sử và phiên bản ĐXMS có hiệu lực | X | X | X | X | X | X | X |
| 41 | DTMS_CN_0175 | Xử lý bước: Phần khác biệt của luồng điều chỉnh | T | T | T | T | T | T | T |
| 42 | DTMS_CN_0176 | Cập nhật nhân sự thực hiện | T | X | T | X | X | X | X |

DTMS_CN_0176: T của ĐV chỉ áp dụng cho Người phụ trách hồ sơ (BR-DXMS-01-14).

Quản trị hệ thống không có quyền nghiệp vụ trên ĐXMS, hồ sơ; xem tiến trình qua Giám sát tiến trình.

**Hủy ĐXMS** (BR-DXMS-C-28). Người thực hiện: Người phụ trách hồ sơ hoặc TT. Điều kiện: ĐXMS Đang phê duyệt. Thao tác: nút \[Hủy ĐXMS\] trên Chi tiết đề xuất mua sắm (DTMS_CN_0137) mở hộp thoại "Hủy ĐXMS {Mã ĐXMS}? ĐXMS sẽ kết thúc ở Dừng xử lý và không khôi phục được." có Lý do (Textarea, tối đa 2000, bắt buộc), \[Hủy ĐXMS\], \[Đóng\]. Kết quả: hồ sơ CANCELED, tiến trình dừng, công việc đang mở bị hủy, yêu cầu trình ký đang chờ được hủy trên VOffice, phần tồn kho, phần căn cứ đang giữ được giải phóng (BR-DXMS-03-05, BR-DXMS-C-30), ĐXMS theo mục 2.3.1.1; Toast "Hủy ĐXMS thành công." Thiếu lý do: inline "Vui lòng nhập Lý do." ĐXMS đã kết thúc khi bấm: "ĐXMS đã kết thúc, không hủy được."

### 2.3.3 Hạn xử lý

Hạn xử lý của mỗi bước là SLA cấu hình trên định nghĩa quy trình tại Camunda, không cố định trong mã nguồn. User Task nhận ngày hết hạn (dueDate) theo SLA của bước; Việc của tôi hiển thị và xét Quá hạn theo ngày này (DTMS_CN_0108). Bảng dưới là giá trị mặc định khi cấu hình quy trình. Đổi quy định thì quản trị quy trình sửa SLA và kích hoạt phiên bản quy trình mới; hồ sơ đang chạy giữ SLA của phiên bản đã khởi tạo nó.

| Việc | Bước | Từ ngưỡng trở lên | Dưới ngưỡng | Cấu hình tại |
|----|----|----|----|----|
| Lập yêu cầu RSTK | 6 | Hệ thống gửi ngay khi qua bước 6, không có công việc | Như bên trái | Không cấu hình |
| Trả kết quả RSTK | Công việc Rà soát tồn kho của TT (BR-DXMS-03-01) | Tối đa 7 NLV: sổ sách 3 NLV, thực tế 4 NLV | Như bên trái | Tham số hệ thống (mục 2.3.6) |
| Lập yêu cầu báo giá | 8 | Tối đa 2 NLV | Tối đa 2 NLV | SLA bước |
| Có đủ báo giá | 9–10 | Theo Hạn trả lời của yêu cầu báo giá (BR-DXMS-04-05) | Như bên trái | Hạn trả lời của từng yêu cầu báo giá |
| Hoàn thiện dự thảo | 11, 12 | Tối đa 2 NLV | Tối đa 2 NLV | SLA cụm |
| Gửi CQCM (mốc T0) | 18 | T0 | T0 | Không cấu hình |
| CQCM thẩm định, tất cả các vòng | 19–23 | 8 NLV nếu dưới 1.000 tỷ đồng; 10 NLV nếu từ 1.000 tỷ đồng trở lên | 4–5 NLV | SLA cụm theo giá trị hồ sơ; TTMS sửa được qua Hạn góp ý |
| Hoàn chỉnh, trình | 25–28 | 1–2 NLV | 1–2 NLV | SLA cụm |
| Tiếp nhận, lập và ký BM-05 | 41–47 | 3 NLV | Không áp dụng | SLA cụm |
| Ký thẩm định BM-09 | 38–40 | Không áp dụng | 1–2 NLV | SLA cụm |
| Lập, ký BM-06 | 49–52 | 1–2 NLV | Không áp dụng | SLA cụm |
| Lập BM-07 | 53–55 | 1–2 NLV | Không áp dụng | SLA cụm |
| Lập, ký BM-08 | 57–61 | 1 NLV | Không áp dụng | SLA cụm |
| Ký duyệt BM-09 | 60–61 | Không áp dụng | 1 NLV | SLA cụm |
| **KPI toàn trình**, từ T0 tới ngày phê duyệt | 18 → 60 | ≤ 20 NLV | ≤ 10 NLV | Tham số hệ thống (mục 2.3.6) |

Cách tính được quy định tại BR-DXMS-C-27. TTMS được ấn định thời gian khác khi hồ sơ có yêu cầu đặc thù về tiến độ. Bước không thuộc dòng nào của bảng không có hạn riêng, công việc không có ngày hết hạn. T0 là thời điểm gửi CQCM ở bước 18 lần đầu; KPI toàn trình tính từ T0 lần đầu, không đặt lại. Hạn của cụm 19–23 tính lại từ thời điểm gửi ở mỗi lần thẩm định.

**SLA bước:** SLA gắn trên User Task, tính từ lúc công việc được giao. **SLA cụm:** khi hồ sơ vào bước đầu của cụm, quy trình tính ngày hết hạn của cụm và lưu thành biến của tiến trình; mọi User Task trong cụm lấy dueDate từ biến này. Hạn phụ thuộc giá trị hồ sơ (8 hoặc 10 NLV) viết bằng biểu thức trên giá trị hồ sơ trong cấu hình SLA. Ngày hết hạn tính theo NLV, trừ thứ Bảy, Chủ nhật và lịch nghỉ dùng chung (mục 2.3.6).

### 2.3.4 Quy tắc chung

| Mã | Quy tắc |
|----|----|
| BR-DXMS-C-01 | **Ngưỡng phân luồng.** Giá trị từ ngưỡng trở lên đi nhánh BM-01; dưới ngưỡng đi nhánh BM-09. Ngưỡng cấu hình tại Danh mục dùng chung, mặc định 160 tỷ đồng (mục 2.3.6). Hồ sơ giữ ngưỡng tại lúc Lưu (BR-DXMS-06-05); cổng phân luồng trên quy trình so sánh giá trị hồ sơ với ngưỡng đã giữ, không chứa số cố định |
| BR-DXMS-C-02 | **Một ĐXMS một hồ sơ.** Mỗi ĐXMS có đúng một hồ sơ, một tiến trình, tạo cùng khi Lưu ĐXMS (BR-DXMS-01-11); không tạo hồ sơ thứ hai cho cùng ĐXMS. Mã hồ sơ, trạng thái hồ sơ chỉ ở tầng dữ liệu, giao diện dùng mã và trạng thái ĐXMS |
| BR-DXMS-C-03 | **Loại ĐXMS.** Tạo mới: lập từ đầu hoặc Sao chép từ ĐXMS Dừng xử lý (liên kết Sao chép từ chỉ để tham khảo); hồ sơ loại Phê duyệt, chạy MS01. Điều chỉnh: lập từ một ĐXMS Đã phê duyệt (đầu chuỗi, còn hiệu lực), mã mới, liên kết Điều chỉnh từ, Lần điều chỉnh = lần của ĐXMS căn cứ + 1; hồ sơ loại Điều chỉnh, chạy MS02. Mỗi ĐXMS Đã phê duyệt chỉ có tối đa một ĐXMS điều chỉnh đang phê duyệt; điều chỉnh được nhiều lần nối tiếp. Loại suy từ liên kết Điều chỉnh từ, không nhập tay |
| BR-DXMS-C-04 | **Giá trị hiệu lực.** Của một ĐXMS: giá trị hồ sơ của nó khi Hoàn thành; chưa có thì dùng giá trị dự kiến. Của chuỗi điều chỉnh: giá trị của ĐXMS hiệu lực của chuỗi (BR-DXMS-C-30). ĐXMS điều chỉnh đang phê duyệt không làm đổi giá trị hiệu lực của chuỗi |
| BR-DXMS-C-05 | **Quy trình và luồng con.** Tiến trình thuộc hồ sơ của ĐXMS; Lưu ĐXMS thì tạo hồ sơ và khởi tạo tiến trình (BR-DXMS-01-11). Mỗi loại ĐXMS chạy một quy trình: Tạo mới chạy MS01, Điều chỉnh chạy MS02; tiến trình khởi tạo ngay theo phiên bản đang hoạt động (BR-DXMS-06-05). Người dùng không chọn quy trình, luồng con. Hệ thống xác định luồng con khi chạy: qua cổng sau bước 10, giá trị của hồ sơ (Tổng giá trị; ĐXMS điều chỉnh: Giá trị sau điều chỉnh) dưới ngưỡng là MS01.03 / MS02.03, đi bước 11 (BM-09, Checklist 02); từ ngưỡng trở lên đi bước 12 (BM-01, Checklist 01) và là .01 hoặc .02, chốt ở bước 48: Có báo cáo Tổng Giám đốc Tập đoàn là .01, Không là .02 (BR-DXMS-08-08). Khi đi bước 12, hệ thống lưu luồng dự kiến theo gợi ý BR-DXMS-C-07 trên văn bản căn cứ của hồ sơ; luồng hiện kèm chữ "(dự kiến)" tới khi hoàn thành bước 48, các ô lọc Quy trình khớp theo luồng dự kiến. Trước cổng sau bước 10, Quy trình hiện "MS01" hoặc "MS02". Ngưỡng là ngưỡng hồ sơ giữ khi Lưu (BR-DXMS-C-01) |
| BR-DXMS-C-06 | **Không chuyển quy trình.** Không có bước kiểm tra giá trị khớp quy trình và không có thao tác chuyển quy trình: giá trị sau báo giá thuộc phía nào của ngưỡng thì cổng sau bước 10 rẽ theo phía đó, trong cùng hồ sơ. Giá trị của hồ sơ không đổi sau khi qua cổng (BR-DXMS-06-03); cần đổi quy mô sau đó thì Hủy ĐXMS, Sao chép thành ĐXMS mới (BR-DXMS-C-28) |
| BR-DXMS-C-07 | **Báo cáo Tổng Giám đốc Tập đoàn.** Phải báo cáo khi đồng thời: giá trị từ ngưỡng trở lên (ngưỡng hồ sơ giữ theo BR-DXMS-C-01, mặc định 160 tỷ đồng hoặc hạn mức khác theo hướng dẫn của Ban ĐTXD), và không lập trên tài liệu đầu vào đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt. Kế hoạch SXKD hằng năm không được tính là tài liệu đó. Hệ thống chọn sẵn theo gợi ý trên căn cứ của hồ sơ ở bước 48, TTMS quyết định (BR-DXMS-08-08); hồ sơ Điều chỉnh xét thêm theo BR-DXMS-09-11 |
| BR-DXMS-C-08 | **AI chỉ gợi ý.** Mọi nội dung AI sinh hoặc tóm tắt hiển thị là gợi ý, có nguồn đầu vào, cho sửa trước khi xác nhận. Hệ thống lưu nội dung AI sinh và nội dung người dùng chốt. AI không thay quyết định của người dùng, trừ cổng báo giá theo BR-DXMS-C-10, cổng xung đột theo BR-DXMS-07-10 và lần kiểm tra trước khi gửi sau bước 11, 12 theo BR-DXMS-08-06 |
| BR-DXMS-C-09 | **Căn cứ.** Phần căn cứ đã dùng hoặc đang giữ cho ĐXMS khác không được tính vào phần còn dùng được; trong cùng chuỗi điều chỉnh, ĐXMS điều chỉnh kế thừa phần ĐXMS căn cứ đang giữ, chỉ phần tăng thêm phải kiểm (BR-DXMS-C-30). Dữ liệu căn cứ chưa đủ thì quay lại bước 4. Tồn kho bằng 0 không phải thiếu dữ liệu |
| BR-DXMS-C-10 | **Báo giá.** Không đạt thì quay lại gửi yêu cầu báo giá (bước 9). Cổng đọc kết quả người dùng kiểm tra và kết quả AI kiểm tra báo giá. Không có bước ký báo giá |
| BR-DXMS-C-11 | **Phiên bản hồ sơ.** Phiên bản tăng mỗi khi đơn vị đề xuất hoàn tất bước hoàn chỉnh, giải trình hồ sơ sau ý kiến CQCM. Phiên bản dùng nội bộ để xét văn bản ký nào còn hợp lệ, ghi nhật ký thời điểm thay đổi; giao diện không hiển thị, không so sánh phiên bản, văn bản đầu ra chỉ hiện bản hiện hành. Văn bản đã ký trên phiên bản cũ sang Không còn hiệu lực. Chi tiết tại BR-DXMS-06-07 |
| BR-DXMS-C-12 | **Danh sách CQCM.** Bắt buộc có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán, ở cả hai nhánh giá trị. Đơn vị đề xuất chọn, TTMS xác nhận đúng và đủ. Chỉ gửi yêu cầu thẩm định khi TTMS đồng ý; không đồng ý thì lưu lý do, về bước 16 |
| BR-DXMS-C-13 | **BM-04 hợp lệ.** Một BM-04 hợp lệ khi: đúng CQCM trong danh sách đã xác nhận, đúng phiên bản hồ sơ, có kết quả ký qua VOffice, không ở Từ chối, Đã hủy. Chỉ chuyển bước 24 khi đủ BM-04 hợp lệ của toàn bộ danh sách. Mọi CQCM phản hồi bằng BM-04, kể cả nhánh dưới ngưỡng. Trên cùng một phiên bản, bản ký sau thay bản ký trước (BR-DXMS-07-03) |
| BR-DXMS-C-14 | **Xung đột ý kiến.** AI phát hiện nhận xét mâu thuẫn giữa các CQCM thì hồ sơ về bước 19 cho CQCM rà soát, tối đa một lần trong một lần thẩm định (BR-DXMS-07-10) |
| BR-DXMS-C-15 | **Vòng xử lý.** Vòng chỉ tăng ở bước 29, khi đơn vị đề xuất có nội dung bảo lưu và lập giải trình. Vượt 2 vòng thì hệ thống cảnh báo và yêu cầu họp. Không vượt thì về Chỉ huy đơn vị (bước 13), rồi gửi lại CQCM. Vòng không đặt lại sau họp. Cổng sau bước 26 rẽ theo việc có dòng Bảo lưu |
| BR-DXMS-C-16 | **Họp, kết luận.** TTMS chủ trì họp, cập nhật kết quả. Chưa thống nhất thì trình Thủ trưởng VHT kết luận. Kết luận Yêu cầu xử lý lại: hồ sơ dưới ngưỡng (BR-DXMS-C-01) về bước 11, từ ngưỡng trở lên về bước 12 |
| BR-DXMS-C-17 | **Ký lại.** Sau khi hoàn chỉnh, CQCM kiểm tra lại và ký BM-04, Checklist trên phiên bản hiện tại. Thiếu kết quả ký thì hồ sơ chờ, không chuyển sang bước ký thẩm định |
| BR-DXMS-C-18 | **Thứ tự ký BM-05.** TTMS rà soát, xác nhận đủ điều kiện, ký trước. Chỉ sau khi nhận kết quả TTMS ký thành công, hệ thống mới giao việc ký cho CQCM và Phó TGĐ/Phó GĐ |
| BR-DXMS-C-19 | **Ký song song.** BM-09 (bước 38, 39) và BM-05 (bước 46, 47): hệ thống chờ đủ kết quả của hai nhánh rồi mới xét; có bên không đồng ý thì trả hồ sơ |
| BR-DXMS-C-20 | **Không thông qua.** Từ giai đoạn GĐ-11 trở đi, mọi kết quả không đồng ý, trả lại, yêu cầu hoàn chỉnh đều về bước 25. Hồ sơ đi lại vòng hoàn chỉnh và ký trên phiên bản mới |
| BR-DXMS-C-21 | **Kết quả ký.** Chỉ chuyển bước khi có kết quả ký hợp lệ qua VOffice. Mỗi lần trình ký lưu mã yêu cầu, người ký, thời điểm gửi, trạng thái, thời điểm nhận kết quả. Lỗi kỹ thuật thì giữ nguyên bước, cho Gửi lại, không tạo yêu cầu trùng |
| BR-DXMS-C-22 | **Chỉ đạo khác.** Hồ sơ kết thúc ở Dừng xử lý, ĐXMS sang Dừng xử lý (kết thúc), phần căn cứ, tồn kho đang giữ được giải phóng; đề xuất lại bằng Sao chép (BR-DXMS-C-03). ĐXMS điều chỉnh: ĐXMS nó điều chỉnh về Đã phê duyệt, chuỗi giữ giá trị hiệu lực cũ |
| BR-DXMS-C-23 | **Thông báo.** Mỗi thông báo xác định người nhận, sự kiện kích hoạt, hồ sơ, biểu mẫu liên quan, trạng thái sau khi người nhận xử lý |
| BR-DXMS-C-24 | **Nhật ký.** Lưu người thực hiện, thời điểm, hành động, giá trị cũ và mới khi sửa, phiên bản hồ sơ, lý do trả lại hoặc từ chối, thay đổi danh sách CQCM, kết quả ký, các lần gửi lại. Cách kiểm tra theo mục 6 |
| BR-DXMS-C-25 | **Quyền và độ Mật.** Quyền xem, sửa, ký theo vai trò, đơn vị và độ Mật; phạm vi xem chi tiết tại BR-DXMS-01-09. Hồ sơ Mật ký bản giấy: người xử lý bước ký nhập Số văn bản, Ngày ký, tải bản scan; nội dung này thay cho kết quả VOffice ở mọi quy tắc cần kết quả ký, gồm BR-DXMS-C-13, BR-DXMS-C-17, BR-DXMS-C-18, BR-DXMS-C-19, BR-DXMS-C-21. Bước gửi ký do hệ thống thực hiện thì người xử lý bước liền trước nhập |
| BR-DXMS-C-26 | **Điều chỉnh.** Phân luồng theo giá trị sau điều chỉnh; thẩm quyền theo giá trị sau điều chỉnh; chạy lại rà soát tồn kho và báo giá tại thời điểm điều chỉnh |
| BR-DXMS-C-27 | **Hạn, KPI.** Hạn của công việc là SLA của bước cấu hình trên quy trình, giá trị mặc định theo mục 2.3.3; giới hạn KPI toàn trình là tham số hệ thống. Không cố định số ngày trong mã. Hạn áp cho cả cụm bước; công việc thuộc cụm nhận ngày hết hạn của cụm. Với hạn ghi khoảng, cấu hình mặc định lấy cận trên. Hồ sơ giữ SLA của phiên bản quy trình đã khởi tạo nó. Công việc quá hạn đổi trạng thái theo thiết kế Việc của tôi, không dừng tiến trình |
| BR-DXMS-C-28 | **Thao tác ngoài sơ đồ.** Hủy ĐXMS, Bổ sung người thẩm định, Chuyển người xử lý, Cập nhật nhân sự (DTMS_CN_0176) thực hiện ở tầng thao tác chung, không thêm bước vào quy trình. Hủy ĐXMS theo mục 2.3.2 |
| BR-DXMS-C-29 | **Người có thẩm quyền** ở bước 60 xác định theo giá trị của hồ sơ (Tổng giá trị; ĐXMS điều chỉnh dùng Giá trị sau điều chỉnh) bằng bảng phân cấp thẩm quyền theo khoảng giá trị, là tham số hệ thống. Chưa cấu hình bảng, hoặc không có khoảng chứa giá trị, thì là Thủ trưởng VHT. Áp cho mọi hồ sơ |
| BR-DXMS-C-30 | **Chuỗi điều chỉnh.** ĐXMS gốc và các ĐXMS điều chỉnh nối bằng Điều chỉnh từ. ĐXMS hiệu lực của chuỗi: ĐXMS Đã phê duyệt mới nhất; ĐXMS trước nó sang Đã được điều chỉnh khi nó được duyệt (mục 2.3.1.1). Giá trị hiệu lực, phần căn cứ đã dùng, phần tồn kho đang giữ tính theo ĐXMS hiệu lực của chuỗi; khi có ĐXMS điều chỉnh đang phê duyệt, phần đang giữ là phần lớn hơn của hai ĐXMS. Báo cáo, tổng quan đếm theo chuỗi (ĐXMS gốc), giá trị theo giá trị hiệu lực của chuỗi; ĐXMS Đã được điều chỉnh không đếm riêng. ĐXMS Dừng xử lý giữ phần bằng 0 |

### 2.3.5 Nhật ký

Nhật ký ĐXMS, hồ sơ theo BR-DXMS-C-24 ghi về dịch vụ nhật ký dùng chung. Module không có màn xem nhật ký; kiểm thử bằng truy vấn dữ liệu nhật ký hoặc API của dịch vụ nhật ký. Mỗi bản ghi gồm: đối tượng (ĐXMS, hồ sơ, yêu cầu báo giá), mã đối tượng, hành động, người thực hiện, thời điểm, giá trị cũ, giá trị mới, phiên bản hồ sơ, lý do (nếu có).

| Nhóm hành động | Khi nào ghi |
|----|----|
| Tạo luồng, sửa ĐXMS | DTMS_CN_0136, 0138 |
| Cập nhật nhân sự | DTMS_CN_0176 |
| Tạo ĐXMS (Tạo mới, Điều chỉnh, Sao chép), hủy ĐXMS | DTMS_CN_0136, 0172, BR-DXMS-C-28 |
| Hoàn thành bước, trả lại, không đồng ý | Mọi bước người dùng của mục 7.1 |
| Đổi danh sách CQCM | Bước 16, 17 |
| Trình ký, kết quả ký, gửi lại | BR-DXMS-08-04, BR-DXMS-C-21 |
| Xuất tệp | DTMS_CN_0152 |
| Khai báo, sửa, xóa văn bản căn cứ; thêm nhà cung cấp mới | DTMS_CN_0140, DTMS_CN_0145 |
| Cập nhật kết quả rà soát tồn kho | DTMS_CN_0142 |
| Giá trị AI gợi ý và giá trị người dùng chốt; Vẫn gửi, Vẫn đạt kèm lý do | BR-DXMS-C-08, BR-DXMS-08-06, BR-DXMS-04-12 |
| Chuyển người xử lý, bổ sung người thẩm định | BR-DXMS-C-28 |

### 2.3.6 Tham số hệ thống

| Tham số | Mặc định | Dùng tại |
|----|----|----|
| Ngưỡng phân luồng ĐXMS, quản trị tại Danh mục dùng chung, Ngưỡng phân luồng | 160 tỷ đồng | BR-DXMS-C-01; hồ sơ giữ ngưỡng khi Lưu (BR-DXMS-06-05) |
| Giới hạn KPI toàn trình | 20 NLV từ ngưỡng trở lên; 10 NLV dưới ngưỡng | Mục 2.3.3, BR-DXMS-C-27 |
| Hạn Rà soát tồn kho | 7 NLV; mốc sổ sách 3 NLV | BR-DXMS-03-01, mục 2.3.3 |
| Bảng phân cấp Người có thẩm quyền theo khoảng giá trị | Chưa cấu hình: Thủ trưởng VHT | BR-DXMS-C-29 |
| Thời gian chờ kết quả AI | 5 phút | BR-DXMS-08-06 |
| Lịch nghỉ lễ, Tết | Theo lịch nghỉ dùng chung của hệ thống | BR-DXMS-04-05, mục 2.3.3 |
| Từ khóa nhạy cảm, đơn vị được xử lý hồ sơ Mật | Theo cấu hình kiểm tra bảo mật | BR-DXMS-01-07 |

Ngưỡng phân luồng áp theo giá trị hồ sơ giữ khi Lưu (BR-DXMS-06-05). Bảng phân cấp Người có thẩm quyền đọc tại thời điểm tạo công việc bước 60. Tham số khác áp ngay từ lúc thay đổi. Module không có màn quản trị tham số riêng. Hạn từng bước không phải tham số của module mà là SLA cấu hình trên quy trình (mục 2.3.3).

## 2.4 Mô hình thực thi

Mục này mô tả cách một bước quy trình chạy lúc vận hành. Mọi chức năng xử lý bước ở chương 3 dẫn chiếu mục này, không mô tả lại. Đọc mục này trước khi đọc chương 3.

**Nguyên tắc gốc:** số màn xử lý bằng số bước người dùng trên BPMN; số trường trên màn bằng số trường của eForm gắn với bước; số nút bằng số luật hiển thị hành động của bước. Thêm, bớt, đổi bất kỳ thứ nào trong ba thứ này là việc **cấu hình**, không phải việc lập trình. Không có màn, hộp thoại, đoạn mã nào được viết riêng cho một bước.

### 2.4.1 Ba tầng giải pháp

Mỗi yêu cầu trong tài liệu thuộc đúng một tầng, ghi bằng nhãn ở đầu mục hoặc đầu dòng.

| Tầng | Là gì | Trong tài liệu này | Bàn giao |
|----|----|----|----|
| **\[NỀN TẢNG\]** | Năng lực dùng chung cho mọi quy trình, lập trình một lần: màn xử lý công việc, bộ dựng eForm, bộ tính luật hiển thị nút, bộ xử lý hành động, sinh văn bản, trình ký, nhật ký | Chỉ dẫn chiếu chức năng của phân hệ Quản trị quy trình, Việc của tôi (DTMS_CN_0108–DTMS_CN_0134) và Quản lý E-form (DTMS_CN_0088). Năng lực còn thiếu ghi ở mục 2.4.5 | Đặc tả chức năng, API |
| **\[CẤU HÌNH\]** | Dữ liệu nạp vào nền tảng: BPMN, schema eForm, luật hiển thị nút, danh mục hành động, mẫu văn bản, vai trò, tham số | Bảng cấu hình bước (mục 7.3), phụ lục eForm (mục 7.4), phụ lục luật nút (mục 7.5), danh mục hành động (mục 7.6), mục 2.5 | Tệp cấu hình để nạp (thư mục cau-hinh/) |
| **\[RIÊNG\]** | Nghiệp vụ không cấu hình được: màn danh sách, chi tiết ĐXMS và hồ sơ, bảng hạng mục và liên kết căn cứ, rà soát tồn kho, yêu cầu báo giá, gợi ý AI, tích hợp VOffice | Nghiệp vụ 3.1.1–3.1.6 và phần riêng ghi trong từng chức năng | Đặc tả chức năng; mỗi phần ghi nơi đăng ký vào nền tảng (tab của màn chi tiết, kiểu trường eForm, kiểm tra hoặc hậu xử lý của mục 2.5, tác vụ hệ thống trên BPMN) |

Phần \[RIÊNG\] không được gắn với mã bước. Phần nào cần xuất hiện trong một bước thì đăng ký vào nền tảng dưới một mã, rồi bước dùng mã đó qua cấu hình.

**Kiểu trường eForm tùy biến** \[RIÊNG\], đăng ký vào bộ dựng eForm, dùng ở mọi bước cần:

| Kiểu | Mô tả | Tham số trong eForm |
|----|----|----|
| aisuggest | Bảng gợi ý AI có quyết định. Mỗi dòng: Mục, Gợi ý, Nguồn (chỉ xem), Quyết định Chấp nhận / Sửa / Bỏ, Nội dung sửa (bắt buộc khi Sửa). Chấp nhận thì điền Gợi ý, Sửa thì điền Nội dung sửa vào trường đích của mục; Bỏ thì trường đích giữ giá trị người dùng nhập. Dòng lấy từ biến cùng khóa do tác vụ AI ghi (BR-DXMS-C-08) | Danh sách mục → khóa trường đích (cột Lựa chọn, mục 7.4) |
| cancu | Chọn văn bản căn cứ \[RIÊNG\]: bảng lặp mỗi dòng Loại căn cứ, Văn bản căn cứ; danh sách văn bản lọc theo Loại của dòng và BR-DXMS-02-02, lấy ở máy chủ; \[Thêm căn cứ\], icon Xóa (còn một dòng thì không xóa); \[Khai báo căn cứ\] mở hộp thoại Khai báo căn cứ ghi thẳng danh sách văn bản dùng chung (BR-DXMS-02-03); bảng tham khảo văn bản theo Loại đang chọn với Còn lại (BR-DXMS-02-04), Sửa, Xóa cho người khai báo khi văn bản chưa được dùng; báo inline văn bản chọn hai lần. Dùng ở bước 1, bước 5, màn tạo luồng (DTMS_CN_0140, DTMS_CN_0141, BR-DXMS-01-12) | Cho khai báo mới (có / không); cho bỏ văn bản đã có hạng mục liên kết (có / không); hiện bảng tham khảo (có / không) — cột Lựa chọn, mục 7.4 |
| hangmuc | Bảng hạng mục liên kết căn cứ \[RIÊNG\]: mỗi dòng một hạng mục (Tên, ĐVT, Nhóm, Ngành hàng, Dòng căn cứ, SL đề xuất); Dòng căn cứ chọn từ dòng của các văn bản trong khóa văn bản căn cứ, thêm Ngoài căn cứ, Thêm dòng mới (nhập Văn bản, Tên nhóm, Tên dòng mới, SL gốc); đầu bảng hiện Cấu trúc căn cứ; mỗi dòng hiện SL gốc, Đã dùng, Còn lại tính ở máy chủ theo BR-DXMS-02-05, SL đề xuất mặc định bằng Còn lại, cảnh báo "Vượt số còn lại", Ghi chú Ngoài căn cứ, Đã dùng ở {Mã ĐXMS}; báo inline hai hạng mục cùng dòng; \[Thêm hạng mục\], icon Xóa, ít nhất một dòng. Dùng ở bước 5 (DTMS_CN_0141) | Khóa văn bản căn cứ (vd canCu) — cột Lựa chọn, mục 7.4 |
| tonkho | Bảng chốt dùng từ kho \[RIÊNG\]: khi mở form đọc ở máy chủ bản rà soát mới nhất của hồ sơ; dòng trạng thái kết quả rà soát; mỗi dòng một hạng mục với Tồn sổ sách, Đang giữ cho ĐXMS khác kèm Mã ĐXMS (BR-DXMS-03-05), Số đủ điều kiện xuất kho, Chất lượng, Tồn khả dụng (BR-DXMS-03-02) chỉ xem; ô Dùng từ kho mặc định bằng giới hạn (BR-DXMS-03-03), bằng 0 và chỉ đọc khi Tồn khả dụng bằng 0, không hiện khi hạng mục không quản lý tồn; SL mua tính ngay. Dùng ở bước 7 (DTMS_CN_0143) | — |
| nhacungcap | Chọn nhà cung cấp nhận yêu cầu \[RIÊNG\]: checklist "{Mã} — {Tên}" lấy ở máy chủ từ danh mục Nhà cung cấp đang Hoạt động, có ngành hàng trùng ngành hàng của hạng mục (BR-DXMS-04-03); nhà cung cấp đang bị cấm không có ô chọn, hạn chế chọn được; bảng Tình trạng nhà cung cấp (Mã, Tên, Email nhận YCBG, Ngành hàng, Tình trạng: Bình thường, Cấm đến {ngày}, Hạn chế); tra Mã số thuế của dòng nhà cung cấp mới khi nhập, trùng nhà cung cấp dùng được thì hiện tại dòng "Đã có nhà cung cấp {Mã} — {Tên}, yêu cầu sẽ gửi cho nhà cung cấp này." (BR-DXMS-04-04); nút \[Nhập từ tệp\] mở hộp thoại nhập XLSX, cập nhật lựa chọn và thêm dòng nhà cung cấp mới (DTMS_CN_0146); giá trị khởi tạo bỏ nhà cung cấp không còn hợp lệ. Tên đề xuất nhacungcap. Dùng ở bước 8 và eForm gửi lại của bước 10 (DTMS_CN_0145, DTMS_CN_0148) | Khóa hạng mục (vd ycbgNhom1, ycbgNhom2), khóa bảng nhà cung cấp mới (vd nccMoi), cho nhập từ tệp (có / không) — cột Lựa chọn, mục 7.4 |
| tepbaogia | Tệp báo giá theo nhà cung cấp \[RIÊNG\]: một dòng cho mỗi nhà cung cấp nhận yêu cầu của lần gửi hiện tại, bố cục như khối Danh sách tài liệu (DTMS_CN_0110); dòng chưa có tệp ghi "Báo giá — {Nhà cung cấp} — bắt buộc, chưa tải lên" (Không phản hồi: "chưa tải lên"); Tải lên, Tải xuống, Thay tệp, Xóa chạy ngay ở máy chủ, không chờ Xác nhận eForm: ghi quote.file_id, quote.uploaded_at, chuyển yêu cầu WAITING ↔ RECEIVED (BR-DXMS-04-08), gọi AI đọc tệp và ghi gợi ý vào dòng của nhà cung cấp trong khóa báo giá, quote.ai_suggest (BR-DXMS-04-09); Xóa hỏi xác nhận, xóa giá trị báo giá đã ghi nhận của nhà cung cấp đó. Sau khi công việc hoàn thành chỉ còn Tải xuống; quyền tải theo BR-DXMS-01-09. Tên đề xuất tepbaogia. Dùng ở bước 10 và chỉ xem ở Chi tiết yêu cầu báo giá (DTMS_CN_0147, DTMS_CN_0151) | Khóa báo giá (vd baoGia), chỉ xem (có / không) — cột Lựa chọn, mục 7.4 |
| sosanhbaogia | So sánh báo giá và cơ sở giá \[RIÊNG\]: mỗi hạng mục một dòng với Đơn giá quy đổi (tỷ đồng) của từng nhà cung cấp = Đơn giá báo × Tỷ giá ÷ 1.000.000.000 (BR-DXMS-04-09), đánh dấu Thấp nhất trong các báo giá còn hiệu lực, ghi "(hết hiệu lực)" khi Hiệu lực đến nhỏ hơn ngày hiện tại; Cơ sở giá chọn trong nhà cung cấp còn hiệu lực có giá, mặc định giá thấp nhất, cùng giá thì Ngày báo giá sớm hơn; Lý do bắt buộc khi chọn khác (tối đa 500); Thành tiền = Đơn giá quy đổi × Còn phải mua; dòng Tổng giá trị theo cơ sở giá ghi vào biến tổng; tính ngay khi đổi, lưu số đầy đủ, hiển thị đơn giá 3, Thành tiền và Tổng 2 chữ số thập phân (BR-DXMS-04-10); dưới bảng liệt kê chữ đỏ văn bản căn cứ bị vượt theo phép tính của KT-17, gọi ở máy chủ. Tên đề xuất cosogia. Dùng ở bước 10 (DTMS_CN_0148) | Khóa báo giá (vd baoGia), khóa hạng mục (vd ycbgNhom1, ycbgNhom2), biến tổng (vd tongGiaTriCoSo) — cột Lựa chọn, mục 7.4 |
| adjimpact | Khối điều chỉnh của hồ sơ Điều chỉnh, chỉ xem, không ghi dữ liệu (DTMS_CN_0173). Đọc so sánh, tác động của hồ sơ của công việc từ nguồn tính dùng chung với khối So sánh, Tác động của Chi tiết hồ sơ; hồ sơ không phải loại Điều chỉnh thì không hiện. Phần hiện theo tham số: dòng đầu "Điều chỉnh lần {n} · căn cứ hồ sơ {Mã} · đã phê duyệt {x} tỷ → sau điều chỉnh {y} tỷ ({±z}) · luồng {Mã}" kèm thông báo khi Chuyển ngưỡng; nút \[Xem so sánh trước – sau\] mở hộp thoại chỉ xem có khối So sánh trước – sau và khối Hạng mục bị ảnh hưởng; khối Tác động điều chỉnh (BR-DXMS-09-07) có dòng Thời điểm tính; bảng So với cơ sở giá của hồ sơ căn cứ (Hạng mục, Đơn giá trước, Đơn giá mới, Chênh lệch); dòng Người có thẩm quyền; cảnh báo "Văn bản căn cứ {Số văn bản} đã được dùng vượt {x} tỷ đồng so với giá trị còn lại." (BR-DXMS-09-13), không chặn | hien: một hoặc nhiều trong dongDau, soSanh, tacDong, donGia, nguoiCoThamQuyen, canCu, nối bằng +; coSo (cơ sở tính tác động): chinhThuc (mặc định), coSoGia (cơ sở giá đang chốt trong form của bước), hangMuc (hạng mục trong form của bước), hoặc khóa trường giá trị dự kiến (vd giaTriSauDuKien). Ghi ở cột Lựa chọn, vd hien=dongDau+soSanh; coSo=chinhThuc |
| adjrows | Bảng trước – sau điều chỉnh. Một dòng cho mỗi phạm vi đã chọn ở khóa phạm vi, trừ phạm vi không khai trong tham số; cùng các dòng tự thêm, chỉ đọc, cho mỗi khóa theo dõi có giá trị khác bộ giá trị trước điều chỉnh, và khi đó tự thêm phạm vi Thông tin cơ bản vào khóa phạm vi. Cột: Nội dung; Trước điều chỉnh (chỉ đọc từ bộ giá trị trước khi phạm vi có trường đích; không có trường đích thì ô nhập tối đa 2000, bắt buộc); Sau điều chỉnh (bắt buộc; kiểu theo trường đích: chữ tối đa 255 cho trường chữ ngắn, chọn từ danh mục đang hoạt động cho trường danh mục, còn lại tối đa 2000; phải khác Trước điều chỉnh). Sau điều chỉnh của phạm vi có trường đích được điền vào trường đích trong dữ liệu form. Bỏ một phạm vi đã có dòng thì hỏi "Bỏ phạm vi {Tên} sẽ xóa nội dung đã nhập của phạm vi này. Tiếp tục?" \[Đồng ý\] \[Hủy\]. Kiểm tra trong form: "Nội dung sau điều chỉnh phải khác nội dung trước điều chỉnh.", "Vui lòng nhập Trước điều chỉnh." | phamVi: khóa phạm vi; mỗi mã phạm vi → trường đích (rỗng: không có trường đích); mã phạm vi Thông tin cơ bản → các khóa theo dõi nối bằng +; truoc: biến bộ giá trị trước điều chỉnh. Ghi ở cột Lựa chọn, vd phamVi=phamViDc; THOI_GIAN=period; NGUON_VON=fundId; CHI_TIEU=; KHAC=; THONG_TIN=purchaseType+purpose+scope+secret; truoc=adjTruoc |

### 2.4.2 Một bước quy trình chạy thế nào

| Thứ tự | Ai | Xử lý |
|----|----|----|
| 1 | Người dùng | Mở công việc ở Việc của tôi (DTMS_CN_0108). Nền tảng lấy quy trình, phiên bản quy trình, task key của bước từ công việc |
| 2 | Nền tảng | Tính danh sách nút từ luật hiển thị hành động (DTMS_CN_0131) theo quy trình, phiên bản, bước, màn, biểu mẫu, vai trò của người dùng. Tên, thứ tự, loại nút lấy từ luật. Luật chỉ lọc theo các thuộc tính tĩnh này, không đọc dữ liệu hồ sơ |
| 3 | Người dùng | Bấm nút. Nút có eForm thì nền tảng mở hộp thoại eForm theo schema gắn với bước, giá trị khởi tạo lấy từ biến quy trình và dữ liệu đã lưu nháp. Nút có Lý do bắt buộc thì mở hộp thoại Lý do của nền tảng thay cho eForm |
| 4 | Người dùng | Nhập, rồi Xác nhận. eForm tự kiểm tra trường bắt buộc, độ dài, định dạng, phụ thuộc giữa các trường trong cùng form |
| 5 | Bộ xử lý hành động | Chạy theo mục 2.5: kiểm tra lại quyền và công việc còn hiệu lực; kiểm tra nút có trong luật của bước; kiểm tra lý do, biến bắt buộc; chạy các **kiểm tra trước hành động** gắn với luật; lưu dữ liệu eForm (mục 2.4.3); chạy các **hậu xử lý** gắn với luật (ghi bảng nghiệp vụ, sinh văn bản, gửi trình ký); ghi nhật ký; hoàn thành công việc kèm kết quả (outcome) của mã hành động |
| 6 | Quy trình | Cổng rẽ nhánh trên BPMN đọc outcome và biến quy trình, giao công việc của bước tiếp theo |

Không có thông tin nào về bước nằm trong mã nguồn: bước nào dùng eForm nào, có nút nào, nút làm gì đều tra từ cấu hình ở thứ tự 1–3 và từ mã hành động ở thứ tự 5.

### 2.4.3 Dữ liệu của bước

- **Lưu nguyên dữ liệu form.** Mỗi lần Lưu nháp hoặc Xác nhận, bộ xử lý lưu toàn bộ dữ liệu eForm dạng JSON theo khóa trường, kèm bản chụp schema lúc lưu, trạng thái (Nháp, Đang gửi, Đã gửi, Lỗi), người thực hiện, thời điểm; mỗi lần lưu thêm một dòng lịch sử. Khi Xác nhận, dữ liệu form đồng thời thành biến quy trình để cổng rẽ nhánh và bước sau đọc được. Bảng lưu ở mục 5.1.2.

- **Khóa trường.** Cột Mapping trong chương 3 và cột Khóa ở mục 7.4 ghi khóa eForm. Khóa duy nhất trong cả quy trình, vì mọi biến form gộp vào cùng phạm vi biến quy trình; viết camelCase, không dấu. Mẫu văn bản dùng khóa eForm làm tên trường trộn.

- **Ghi sang bảng nghiệp vụ.** Chỉ dữ liệu phải tìm kiếm, lọc, liệt kê, báo cáo, phân quyền hoặc dùng ở phân hệ khác mới được ghi sang bảng nghiệp vụ, do hậu xử lý HX-01 (mục 2.5.3) thực hiện theo bảng dưới. Trường không có trong bảng chỉ nằm trong JSON của bước.

- **Dữ liệu chỉ xem.** Khối chỉ xem trong eForm (kết quả AI, đối soát, dữ liệu của hồ sơ) đọc biến quy trình do tác vụ hệ thống hoặc bước trước ghi; cột Đọc biến ở mục 7.4 ghi tên biến.

**Bảng ghi dữ liệu nghiệp vụ** \[CẤU HÌNH\]:

| Bước | Khóa eForm | Bảng.cột | Lý do cần cột |
|----|----|----|----|
| 1, 5 | canCu | profile_basis.doc_id | Văn bản căn cứ của hồ sơ hiện ở tab Căn cứ & hạng mục; dùng tính phần căn cứ đã dùng (BR-DXMS-02-04), gợi ý báo cáo Tập đoàn ở bước 48 (BR-DXMS-C-07); bước 5 thêm, bỏ văn bản (BR-DXMS-02-07) |
| 4 | purchaseType | profile.purchase_type | Hiển thị ở Thông tin chung, lọc, báo cáo theo loại mua sắm |
| 4 | purpose | profile.purpose | Hiển thị ở Thông tin chung; trường trộn của mọi văn bản sau bước 4 |
| 4 | scope | profile.scope | Hiển thị ở Thông tin chung |
| 4 | fundId | profile.fund_id | Lọc, báo cáo theo nguồn vốn; dùng ở phân hệ Khoản đầu tư |
| 4 | period | profile.period | Hiển thị ở Thông tin chung |
| 4 | secret | profile.secret | Phân quyền và hình thức ký theo độ Mật (BR-DXMS-C-25) |
| 5 | bocTach | proposal_item.name, proposal_item.uom, proposal_item.group, proposal_item.goods_type, proposal_item.basis_line_id, proposal_item.proposed_qty, proposal_item.confirmed_at; dòng Thêm dòng mới: basis_line.basis_doc_id, basis_line.group_name, basis_line.name, basis_line.quantity | Hạng mục là đầu vào của rà soát tồn kho, yêu cầu báo giá, văn bản; tab Căn cứ & hạng mục; tính phần dòng căn cứ đã dùng của ĐXMS khác (BR-DXMS-02-05); dòng mới dùng lại cho ĐXMS sau |
| 7 | ruaSoatKho | stock_review_line.use_qty | Dùng từ kho tính Còn phải mua, phần tạm giữ trừ vào Tồn khả dụng của ĐXMS khác (BR-DXMS-03-02, BR-DXMS-03-05), tab Rà soát tồn kho; HX-13 ghi thêm stock_review.code, stock_review.confirmed_at, stock_review_line.held_other_qty, stock_review_line.hold_status |
| 8, 10 | nccMoi | vendor.name, vendor.tax_code, vendor.email, vendor.goods_types, vendor.source_profile_code | Nhà cung cấp mới vào danh mục Nhà cung cấp dùng chung (BR-DXMS-04-04); HX-14 ghi, không phải HX-01 |
| 8, 9 | ycbgNhom1, ycbgNhom2 | quotation_item.proposal_item_id, quotation_item.buy_qty | Hạng mục và Còn phải mua tại lúc gửi của từng yêu cầu; bước 10 tính Thành tiền, Chi tiết yêu cầu báo giá liệt kê. Tác vụ bước 9 ghi |
| 8, 9 | nccSel | quotation_vendor.vendor_id, quotation_vendor.send_status, quotation_vendor.send_error | Nhà cung cấp nhận và tình trạng gửi hiện ở bước 10, Danh sách yêu cầu báo giá, Chi tiết yêu cầu báo giá. Tác vụ bước 9 ghi |
| 8, 9 | hanTraLoi | quotation.due_date | Hạn báo giá ở Danh sách yêu cầu báo giá, lọc theo hạn; hạn công việc bước 10. Tác vụ bước 9 ghi |
| 8, 9 | taiLieuKyThuatNhom1, taiLieuKyThuatNhom2 | quotation.tech_file_ids | Tài liệu kỹ thuật theo lần gửi, xem ở Chi tiết yêu cầu báo giá. Tác vụ bước 9 ghi |
| 8, 9 | dkThanhToan, diaDiemGiao, yeuCauKhac, dauMoiBg | quotation.payment_terms, quotation.delivery_place, quotation.other_requirements, quotation.contact_user_id | Điều khoản trên phiếu BM-YCBG theo lần gửi, xem ở Chi tiết yêu cầu báo giá. Tác vụ bước 9 ghi |
| 10 | baoGia | quote.no_response, quote.quote_date, quote.valid_until, quote.currency, quote.exchange_rate, quote.ai_suggest; quote_line.unit_price, quote_line.unit_price_converted, quote_line.ai_suggested | Báo giá theo nhà cung cấp và đơn giá theo hạng mục hiện ở tab Yêu cầu báo giá, Chi tiết yêu cầu báo giá; lưu giá trị AI gợi ý và giá trị chốt (BR-DXMS-04-09, BR-DXMS-C-08) |
| 10 | coSoGia | quotation_item.base_quote_id, quotation_item.base_reason | Cơ sở giá và lý do chọn khác giá thấp nhất theo hạng mục, hiện ở So sánh báo giá và cơ sở giá (BR-DXMS-04-10) |
| 10 | tongGiaTriCoSo | profile.total_value | Giá trị của hồ sơ, chỉ ghi khi yêu cầu PASSED; dùng cho BR-DXMS-C-01, BR-DXMS-C-06, BR-DXMS-02-04, hiển thị, báo cáo |
| 10 | aiKiemTraBaoGia, lyDoVanDat | quotation.ai_check | Kết quả AI kiểm tra báo giá và lý do Vẫn đạt theo lần gửi; Chỉ huy đơn vị xem ở bước 13 (BR-DXMS-04-12) |
| 10 | lyDoKhongDat | quotation.fail_note | Nội dung Không đạt của lần gửi, xem ở Chi tiết yêu cầu báo giá; luật MS01_T10_TRA_LAI |
| 11, 12 | phanHoiChiHuy | draft_review.response, draft_review.response_note | Phản hồi theo từng phần được theo dõi qua các lần duyệt bước 13; Chỉ huy đơn vị xem lại ở bước 13 |
| 13 | duyetPhan | draft_review.part, draft_review.result, draft_review.reason | Kết quả duyệt từng phần theo lần duyệt (review_no): đầu vào của bước 14 và phản hồi ở bước 11, 12 |
| 16, 17 | cqcmList | appraisal_agency.agency_id, appraisal_agency.required, appraisal_agency.function_note | Bước 16 ghi các dòng được chọn hoặc bắt buộc vào lần thẩm định đang lập; bước 17 xác nhận. Danh sách CQCM đã xác nhận quyết định số công việc của bước 19, 35 và BM-04 hợp lệ (BR-DXMS-C-12, BR-DXMS-C-13) |
| 16 | dauMoi | appraisal_round.contact_id | Mỗi lần thẩm định có Đầu mối riêng (BR-DXMS-07-01); bước 18 gửi thông báo cho Đầu mối |
| 16 | bm03KyNhay | appraisal_round.bm03_draft_file_id | Mỗi lần thẩm định có BM-03 riêng (BR-DXMS-07-01) |
| 17 | hanGopY | appraisal_round.due_date | Hạn của công việc bước 19 (BR-DXMS-C-27); mặc định Hạn góp ý của lần sau |
| 19 | bm04Phieu | bm04_item.section, bm04_item.result, bm04_item.comment, bm04_item.guide, bm04_item.ai_suggest, bm04_item.ai_decision; bm04.not_ok_count | Mục Không OK của BM-04 hợp lệ sinh dòng ý kiến ở bước 25 (BR-DXMS-07-05); kết quả dòng xét theo mục qua các lần thẩm định (BR-DXMS-07-08); Số ý kiến Không OK ở tab Thẩm định và ý kiến |
| 19 | dauMoiPhoiHop | bm04.contact_id | Cột bắt buộc của phiếu BM-04 (mục 5.1.2); đầu mối của CQCM để đơn vị đề xuất liên hệ khi xử lý ý kiến |
| 26 | quyetDinhYKien | opinion.decision, opinion.decided_by, opinion.decided_at | Quyết định từng dòng hiện, lọc ở tab Xử lý ý kiến; đầu vào bước 28, Phụ lục 1 BM-02 và Kết quả của dòng (BR-DXMS-07-06, BR-DXMS-07-08). decided_by, decided_at HX-01 lấy từ người thực hiện, thời điểm Xác nhận |
| 28 | giaiTrinh | opinion.explanation, opinion.reference, opinion.note | Giải trình từng dòng hiện ở tab Xử lý ý kiến và eForm bước 31–34; BM-02 và Phụ lục 1 sinh lại ở bước 27 từ các dòng hiện có (BR-DXMS-07-07) |
| 31 | thoiGianHop, diaDiemHop, thanhPhanHop | meeting.held_at, meeting.place, meeting.member_ids | HX-01 tạo bản ghi họp mới (meeting.no tăng dần, meeting.appraisal_round_id là lần mới nhất); tab Họp, kết luận liệt kê các lần họp của hồ sơ (BR-DXMS-07-09) |
| 32 | bienBanHop | meeting.minutes_file_id; profile_file.file_id (category = MINUTES) | Biên bản hiện ở tab Họp, kết luận và Danh sách tài liệu của Chi tiết hồ sơ |
| 32 | ketLuanHop | meeting.conclusion | Tab Họp, kết luận; bước 27 hiện kết luận họp |
| 32 | ketQuaHop (biến đặt của luật MS01_T32_XAC_NHAN / MS01_T32_TRA_LAI) | meeting.result | Tab Họp, kết luận; Lịch sử ở tab Vòng và lịch sử |
| 34 | ketLuan | meeting.leader_conclusion | Tab Họp, kết luận; bước 27 hiện kết luận |
| 34 | luaChonKetLuan (biến đặt của luật MS01_T34_XAC_NHAN / MS01_T34_TRA_LAI) | meeting.leader_result | Tab Họp, kết luận hiện Lựa chọn |
| 35 | kiemTraYKien | opinion_check, opinion | Kết quả kiểm tra từng dòng đổi trạng thái dòng ý kiến (BR-DXMS-07-08) |
| 42 | bm05 | bm05_item | KT-04 kiểm tra BM-05 đã rà soát trên phiên bản hiện tại; nội dung BM-05 theo phiên bản được bước 43 và văn bản BM-05 dùng; lưu gợi ý AI, quyết định, nội dung sửa từng mục (BR-DXMS-C-08) |
| 48 | reportReason | profile.report_reason | Hiển thị, báo cáo lý do chọn khác gợi ý (BR-DXMS-08-08) |
| 48 | reportTD | Biến đặt của luật MS01_T48_XAC_NHAN / \_2 | profile.report_group |
| 48 | reportSuggested | Tác vụ gợi ý báo cáo Tập đoàn trước bước 48 | profile.report_suggested |
| 51 | tepDinhKemBm06 | step_file.file_id | Tệp của bước (kind = ATTACHMENT) hiện ở Danh sách tài liệu của Chi tiết hồ sơ và đi kèm hồ sơ gửi Ban ĐTXD Tập đoàn ở bước 52 |
| 54 | bm07Tep, bm07So, bm07Ngay | group_report.bm07_file_id, group_report.bm07_no, group_report.bm07_signed_date | BM-07 có Số, Ngày ký hiện ở Văn bản của Chi tiết hồ sơ; đi kèm văn bản phê duyệt trình ký ở bước 61 |
| 56 | yKienTdNoiDung, yKienTdTep | group_report.opinion, group_report.opinion_file_id | Ý kiến Tổng Giám đốc Tập đoàn hiện ở bước 60 và Chi tiết hồ sơ sau khi tiến trình kết thúc; HX-01 ghi thêm group_report.opinion_at |

Các chức năng ở chương 3 bổ sung dòng vào bảng này khi bước của chức năng có dữ liệu cần ghi.

### 2.4.4 Nút và hành động

- **Nút chỉ đến từ luật.** Danh sách nút của từng bước là phụ lục mục 7.5. Đổi tên, thêm, bớt, ngừng nút là sửa luật. Chương 3 nhắc nút bằng mã luật, có thể kèm tên hiển thị trong ngoặc để dễ đọc; tên đó không phải hằng số.

- **Nút do luật cho phép thì luôn hiện.** Điều kiện theo dữ liệu hồ sơ (kết quả Đạt / Chưa đạt, đủ chữ ký, đủ tài liệu, lựa chọn khác gợi ý) không ẩn, không khóa nút. Người dùng bấm thì bộ xử lý chạy kiểm tra trước hành động (mục 2.5.2); không đạt thì chặn, hiện thông báo, công việc giữ nguyên.

- **Gợi ý cho người dùng đặt trong eForm.** Gợi ý của hệ thống (vd nên chọn Có báo cáo Tổng Giám đốc Tập đoàn) là khối chỉ xem hoặc thông báo trong eForm; các nút hiển thị như nhau, không đổi nút chính theo dữ liệu.

- **Một luật một tên.** Tên nút không đổi theo luồng con. Phần khác nhau theo luồng con (vd văn bản ký là Checklist 01 hay Checklist 02) là tham số của bước theo luồng con, do bộ xử lý đọc từ cấu hình.

- **Hộp thoại dùng chung** \[NỀN TẢNG\]: hộp thoại eForm có \[Hủy\], \[Lưu nháp\], \[Xác nhận\]; hộp thoại Lý do (bắt buộc, tối đa 2000 ký tự) cho nút có Lý do bắt buộc; hộp thoại Trình ký. Chương 3 không mô tả lại các hộp thoại này.

### 2.4.5 Yêu cầu bổ sung nền tảng

Các năng lực sau cần cho ĐXMS nhưng chưa có trong đặc tả phân hệ Quản trị quy trình, Việc của tôi. Phát triển ở tầng \[NỀN TẢNG\], dùng chung cho các quy trình khác, không phát triển riêng trong module ĐXMS.

| Mã | Năng lực | Mô tả |
|----|----|----|
| YC-NT-01 | Kiểm tra trước hành động gắn theo luật | Mỗi luật hiển thị hành động gắn được danh sách mã kiểm tra (mục 2.5.2). Bộ xử lý chạy các kiểm tra theo thứ tự trước khi thực thi; kiểm tra nhận tham số từ cấu hình, không đọc mã bước, mã biểu mẫu |
| YC-NT-02 | Hậu xử lý gắn theo luật | Mỗi luật gắn được danh sách mã hậu xử lý (mục 2.5.3) chạy sau khi lưu dữ liệu, trước khi hoàn thành công việc; lỗi thì không hoàn thành, giữ dữ liệu đã nhập |
| YC-NT-03 | Trình ký và kết quả ký | Hộp thoại Trình ký chỉ đọc; ký điện tử qua VOffice cho hồ sơ không Mật, ký bản giấy cho hồ sơ Mật; nhận kết quả ký; công việc Xử lý trình ký với \[Gửi lại\], \[Coi như Từ chối\] khi Đã hủy hoặc Lỗi gửi; khóa chống trùng khi gửi lại; ghi kết quả ký (người ký, tư cách, trạng thái, thời điểm trình, thời điểm ký, lý do từ chối) vào biến quy trình để eForm bước sau đọc (vd kyBm09, kyBm05). Quy tắc nghiệp vụ của ĐXMS tại BR-DXMS-08-04, BR-DXMS-08-05, BR-DXMS-C-21, BR-DXMS-C-25 |
| YC-NT-04 | Tham số của bước theo luồng con | Cấu hình của bước khai báo được giá trị theo luồng con (văn bản ký, mẫu văn bản); bộ xử lý chọn giá trị theo biến luồng con của hồ sơ |
| YC-NT-05 | Công việc giao đồng thời nhiều nhóm | Một công việc giao cho nhiều nhóm và người cụ thể, ai xử lý trước thì công việc hoàn thành (BR-DXMS-08-09) |

### 2.4.6 Điều cấm khi phát triển

1.  Không tạo màn, route, hộp thoại, component riêng cho từng bước quy trình.

2.  Không rẽ nhánh theo task key, mã eForm, mã luật, tên nút ở cả giao diện lẫn phía xử lý. Logic khác nhau giữa các bước đi qua mã hành động, mã kiểm tra, mã hậu xử lý và tham số của cấu hình.

3.  Không gõ cứng tên, thứ tự, màu, trạng thái bật / tắt của nút. Nút chỉ đến từ API luật hiển thị.

4.  Không gõ cứng danh sách trường của bước. Trường chỉ đến từ schema eForm.

5.  Không thêm cột bảng cho trường eForm ngoài bảng ghi dữ liệu nghiệp vụ ở mục 2.4.3.

6.  Không kiểm tra điều kiện nghiệp vụ chỉ ở giao diện. Điều kiện chặn nằm ở bộ xử lý phía máy chủ (mục 2.5.2).

7.  Gặp yêu cầu mà cấu hình không đáp ứng được thì dừng và hỏi, không tự viết mã riêng; ghi thành yêu cầu bổ sung nền tảng.

### 2.4.7 Tiêu chí chấp nhận của phần cấu hình

Áp dụng cho mọi quy trình của module, kiểm tra trên ít nhất hai bước khác nhau.

| Mã | Điều kiện | Thao tác | Kết quả mong đợi |
|----|----|----|----|
| AC-CH-01 | Luật của một nút đang kích hoạt | Ngừng kích hoạt luật, mở lại công việc | Nút không còn, không cần triển khai lại phần mềm |
| AC-CH-02 | Một nút đang hiện | Sửa Tên hiển thị của luật | Nhãn nút đổi theo |
| AC-CH-03 | eForm của một bước | Thêm một trường vào schema, nạp lại | Màn có trường mới; giá trị lưu trong JSON của bước; không sửa mã nguồn |
| AC-CH-04 | Một luật có sẵn | Thêm luật cùng mã hành động cho một bước khác | Nút xuất hiện ở bước đó và chạy đúng bộ xử lý |
| AC-CH-05 | Công việc đang mở | Gọi API thực thi với mã hành động không có trong luật của bước | Bị từ chối, công việc giữ nguyên |
| AC-CH-06 | Luật có kiểm tra trước hành động, dữ liệu không đạt | Bấm nút | Nút vẫn hiện; bị chặn với đúng thông báo của mã kiểm tra; công việc giữ nguyên |
| AC-CH-07 | Mã nguồn giao diện và phía xử lý | Tìm task key, mã eForm, mã luật của quy trình trong mã nguồn | Không có kết quả |

## 2.5 Bộ xử lý hành động

\[NỀN TẢNG\] Mỗi mã hành động của danh mục hành động (mục 7.6) gắn một bộ xử lý. Bộ xử lý dùng chung cho mọi bước, mọi quy trình; phần khác nhau giữa các bước đi qua cấu hình của luật: kiểm tra trước hành động, hậu xử lý, tham số (mục 7.5). Bộ xử lý không đọc task key, mã eForm, mã luật để rẽ nhánh.

**Trình tự chung của mọi bộ xử lý** (thứ tự 5 của mục 2.4.2):

| Thứ tự | Xử lý | Không đạt thì |
|----|----|----|
| 1 | Người dùng là người nhận công việc; công việc còn hiệu lực; hồ sơ ở PROCESSING | Theo DTMS_CN_0112 |
| 2 | Mã hành động có trong danh sách nút luật trả về cho bước và người dùng | Từ chối: "Hành động không được phép ở bước hiện tại." |
| 3 | Lý do có khi luật đặt Lý do bắt buộc; biến bắt buộc của luật có giá trị | Inline: "Vui lòng nhập Lý do." |
| 4 | Chạy lần lượt các kiểm tra trước hành động gắn với luật (mục 2.5.2) | Chặn với thông báo của mã kiểm tra; công việc giữ nguyên |
| 5 | Lưu dữ liệu eForm dạng JSON (mục 2.4.3) | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |
| 6 | Chạy hậu xử lý gắn với luật theo đúng thứ tự ghi ở luật (mục 2.5.3); hậu xử lý mặc định của mã hành động (mục 2.5.1) mà luật chưa ghi thì chạy sau cùng | Không hoàn thành công việc, giữ dữ liệu đã nhập, toast như thứ tự 5 |
| 7 | Ghi nhật ký (BR-DXMS-C-24) | — |
| 8 | Hoàn thành công việc, đẩy outcome của mã hành động và biến đặt của luật vào quy trình | Toast như thứ tự 5; dữ liệu ở trạng thái Lỗi, cho Xác nhận lại |

**Chống bấm trùng:** một công việc chỉ có một lần thực thi đang chạy; lần bấm thứ hai trong lúc đó bị bỏ qua. Xác nhận lại sau trạng thái Lỗi không tạo văn bản, yêu cầu trình ký thứ hai (YC-NT-03).

### 2.5.1 Danh mục bộ xử lý

| Mã hành động | Mở | Hoàn thành công việc | Outcome | Hậu xử lý mặc định |
|----|----|----|----|----|
| HOAN_THANH | eForm của bước | Có | completed=true | HX-02 khi bước có mẫu văn bản |
| XAC_NHAN | eForm của bước | Có | confirmed=true | HX-02 khi bước có mẫu văn bản |
| GUI_DUYET | eForm của bước | Có | action=SUBMIT | HX-02 khi bước có mẫu văn bản |
| TRINH_KY | eForm của bước, sau đó hộp thoại Trình ký | Có; hướng đi sau bước chờ kết quả ký | signRequested=true | HX-02, HX-03 |
| PHE_DUYET | eForm của bước, sau đó hộp thoại Trình ký văn bản phê duyệt | Có | approved=true | HX-02, HX-03 |
| TRA_LAI | Hộp thoại Lý do; eForm của bước khi luật không đặt Lý do bắt buộc | Có | approved=false | — |
| TU_CHOI | Hộp thoại Lý do; eForm của bước khi luật không đặt Lý do bắt buộc | Có | agreed=false | — |
| LUU | — | Không; lưu nháp, không kiểm tra | — | — |
| UPDATE_MEMBERS | Hộp thoại Cập nhật nhân sự (DTMS_CN_0176) | Không | — | — |

HX-02 mặc định: bước chỉ ký một văn bản đã sinh ở bước trước (tham số văn bản của bước trỏ văn bản đó, vd BM-05 ở bước 43, 46, 47) thì không sinh bản mới, trình ký đúng bản đã có. TRA_LAI, TU_CHOI mở eForm của bước (luật không đặt Lý do bắt buộc) thì lý do lấy từ biến bắt buộc của luật, vd lyDoTraLai; bước 25 sinh dòng ý kiến từ lý do này như từ hộp thoại Lý do.

SUA_LAI, CHUYEN_QUY_TRINH có trong danh mục dùng chung nhưng không dùng ở MS01, MS02 (BR-DXMS-C-06). Luật nào cần thêm biến cho cổng rẽ nhánh (vd hai nút cùng XAC_NHAN ở bước 48) thì khai ở cột Biến đặt của luật.

### 2.5.2 Kiểm tra trước hành động

\[CẤU HÌNH\] Mỗi kiểm tra là một mã dùng chung, nhận tham số từ luật. Luật gắn kiểm tra ở cột Kiểm tra của mục 7.5, kèm tham số. Năng lực gắn kiểm tra theo luật: YC-NT-01.

| Mã | Kiểm tra | Tham số | Thông báo khi không đạt |
|----|----|----|----|
| KT-01 | Giá trị chọn từ danh mục còn hoạt động tại lúc Xác nhận | Khóa trường, danh mục | Inline tại trường: "{Tên trường} không còn hiệu lực, vui lòng chọn lại." |
| KT-02 | Bảng lặp có ít nhất một dòng mang giá trị không đạt | Khóa bảng lặp, khóa kết quả, giá trị không đạt, thông báo | Theo tham số, vd "Vui lòng chọn ít nhất một phần Không đạt." |
| KT-03 | Mọi dòng của bảng lặp mang giá trị đạt | Khóa bảng lặp, khóa kết quả, giá trị đạt, thông báo | Theo tham số, vd "Còn ý kiến Chưa đạt, không thể chọn Đạt." |
| KT-04 | Hồ sơ đủ điều kiện giao ký BM-05: BM-05 đã được rà soát trên phiên bản hiện tại và Checklist đã được các CQCM ký trên phiên bản hiện tại | — | "Hồ sơ chưa đủ điều kiện giao ký BM-05." |
| KT-05 | Lựa chọn khác gợi ý của hệ thống thì có lý do | Biến gợi ý, giá trị của nút, khóa lý do | Inline: "Vui lòng nhập Lý do." |
| KT-06 | Kiểm tra AI trước khi gửi: gọi dịch vụ AI kiểm tra dữ liệu form và hồ sơ, chờ tối đa thời gian chờ; ghi kết quả, lý do, số lần Không đạt liên tiếp vào biến kết quả. Không đạt thì chặn; AI lỗi hoặc quá thời gian chờ thì đạt; số lần Không đạt liên tiếp từ ngưỡng trở lên và khóa Vẫn gửi đúng, khóa lý do có giá trị thì đạt (BR-DXMS-08-06) | Bộ kiểm tra AI, biến kết quả, thời gian chờ, khóa Vẫn gửi, khóa lý do, ngưỡng số lần Không đạt liên tiếp | Toast và khối trong eForm: "AI kiểm tra hồ sơ: Không đạt — {Lý do}. Hồ sơ chưa được gửi." |
| KT-07 | Bảng lặp chứa đủ các mục bắt buộc của danh mục: mọi mục có cờ bắt buộc trong danh mục (đọc ở máy chủ, không tin cờ gửi từ form) có dòng trong bảng và dòng đó được chọn hoặc mang cờ bắt buộc | Khóa bảng lặp, khóa mã, khóa chọn, danh mục và cờ bắt buộc, thông báo | Theo tham số, vd "Danh sách phải có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán." |
| KT-08 | Trường ngày không nhỏ hơn ngày hiện tại khi điều kiện đúng | Khóa trường, điều kiện áp dụng (biểu thức trên biến quy trình), thông báo | Inline tại trường, theo tham số, vd "Hạn góp ý không được nhỏ hơn ngày hiện tại." |
| KT-09 | Người thực hiện ghi nhận thay thì có văn bản nhận được. Ghi nhận thay: công việc giao đồng thời nhiều nhóm (YC-NT-05) và người thực hiện là người nhận việc được giao đích danh, không thuộc nhóm được giao. Người thuộc nhóm được giao xử lý thì đạt | Khóa tệp, thông báo | Theo tham số, vd inline "Vui lòng tải Văn bản nhận được." |
| KT-10 | Giá trị chọn ở mỗi dòng của bảng lặp có trong nguồn lựa chọn của trường, nguồn tính lại ở máy chủ tại lúc Xác nhận theo giá trị của trường lọc cùng dòng (không tin danh sách gửi từ form); dòng thỏa điều kiện bỏ qua thì không xét | Khóa bảng lặp, khóa chọn, khóa lọc, nguồn lựa chọn, điều kiện bỏ qua dòng, thông báo | Inline tại dòng, theo tham số, vd "Văn bản căn cứ không thuộc loại căn cứ đã chọn." |
| KT-11 | Bảng lặp không có hai dòng cùng giá trị của khóa, trừ các giá trị miễn trừ | Khóa bảng lặp, khóa, giá trị miễn trừ, thông báo | Inline tại dòng sau, theo tham số, vd "Dòng căn cứ đã được dùng cho hạng mục khác." |
| KT-12 | Giá trị số của mỗi dòng bảng lặp không lớn hơn giới hạn tính lại ở máy chủ theo số liệu mới nhất tại lúc Xác nhận. Giới hạn là một phép tính đăng ký ở phần riêng, cũng là phép tính mà kiểu trường tùy biến của bước dùng để hiện; dòng không có giới hạn thì không xét | Khóa bảng lặp, khóa số, phép tính giới hạn, thông báo (có thể chứa {giá trị}) | Inline tại dòng, theo tham số, vd "SL đề xuất vượt số còn lại của dòng căn cứ.", "Dùng từ kho không được lớn hơn {giá trị}." |
| KT-13 | Bản ghi nghiệp vụ của hồ sơ, đọc ở máy chủ tại lúc Xác nhận, có giá trị yêu cầu ở cột trạng thái | Bảng.cột, cách chọn bản ghi (vd bản mới nhất của hồ sơ), giá trị yêu cầu, thông báo | Theo tham số, vd "Chưa có kết quả rà soát thực tế, chưa hoàn thành được." |
| KT-14 | Bảng lặp có ít nhất một dòng thỏa biểu thức; giá trị tham chiếu trong biểu thức (không phải giá trị người dùng nhập) đọc lại ở máy chủ | Khóa bảng lặp, biểu thức trên khóa của dòng và giá trị tham chiếu, thông báo | Theo tham số, vd "Toàn bộ nhu cầu được đáp ứng từ kho. Vui lòng giảm số dùng từ kho hoặc hủy hồ sơ." |
| KT-15 | Giá trị nhập ở mỗi dòng của bảng lặp trùng khóa nhận diện của một bản ghi danh mục (vd Mã số thuế) thì bản ghi đó phải còn dùng được theo điều kiện; không trùng bản ghi nào thì đạt. Danh mục đọc ở máy chủ tại lúc Xác nhận | Khóa bảng lặp, khóa trường so khớp, danh mục và cột so khớp, điều kiện dùng được (vd Hoạt động, không bị Cấm), thông báo | Inline tại dòng, theo tham số, vd "Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại." |
| KT-16 | Yêu cầu báo giá hiện hành đủ báo giá để đạt (BR-DXMS-04-11 điều 1, 2): mỗi nhà cung cấp nhận yêu cầu có tệp báo giá (đọc ở máy chủ) hoặc được đánh dấu Không phản hồi; mỗi hạng mục có ít nhất một báo giá có đơn giá và Hiệu lực đến không nhỏ hơn ngày Xác nhận | Khóa bảng báo giá, khóa Không phản hồi, khóa Hiệu lực đến, khóa đơn giá theo hạng mục, ngày so (ngày Xác nhận), hai thông báo | Inline tại dòng: "Vui lòng tải lên báo giá hoặc đánh dấu Không phản hồi."; "Hạng mục {Tên} chưa có báo giá còn hiệu lực." |
| KT-17 | Không vượt phần căn cứ còn có thể sử dụng: với mỗi văn bản căn cứ có Giá trị và có hạng mục liên kết, Giá trị − Đã dùng ở ĐXMS khác − tổng Thành tiền của các hạng mục liên kết văn bản đó không âm (BR-DXMS-02-04, BR-DXMS-04-11 điều 3). Thành tiền tính lại ở máy chủ từ khóa nguồn, Đã dùng đọc ở máy chủ tại lúc Xác nhận; không bị bỏ qua bởi lựa chọn vượt kết quả AI | Khóa nguồn Thành tiền theo hạng mục (vd coSoGia cùng baoGia), thông báo (có thể chứa {Số văn bản}, {x}, {y}) | Inline đỏ, mỗi văn bản một dòng, theo tham số, vd "Văn bản căn cứ {Số văn bản} còn có thể sử dụng {x} tỷ đồng, hạng mục liên kết có Thành tiền {y} tỷ đồng. Vui lòng chọn lại cơ sở giá hoặc chọn Không đạt — gửi lại YCBG." |
| KT-18 | Dòng của bảng lặp có khóa điều kiện mang giá trị cho trước thì khóa kết quả chỉ nhận các giá trị cho phép. Giá trị của khóa điều kiện đọc lại ở máy chủ từ bản ghi nghiệp vụ của dòng (theo mã dòng), không tin giá trị gửi từ form | Khóa bảng lặp, khóa điều kiện, giá trị điều kiện, khóa kết quả, giá trị cho phép, thông báo | Inline tại dòng, theo tham số, vd "Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới." |
| KT-19 | Đã xem tác động điều chỉnh: tác động của hồ sơ Điều chỉnh, tính theo cơ sở cho trước như khối Tác động điều chỉnh (BR-DXMS-09-07), có một trong các loại phải xem thì ô xác nhận có giá trị. Hồ sơ không phải loại Điều chỉnh thì đạt | Khóa ô xác nhận; loại tác động phải xem (Chuyển ngưỡng, Giảm dưới số đã ký); cơ sở tính (khóa giá trị dự kiến, hạng mục trong form, cơ sở giá đang chốt trong form, chính thức); thông báo | Inline tại ô, theo tham số, vd "Vui lòng xem và chọn Đã xem tác động điều chỉnh." |
| KT-20 | Tổng số dòng của một hoặc nhiều bảng lặp thỏa điều kiện dòng không nhỏ hơn số tối thiểu, khi điều kiện áp dụng đúng | Khóa bảng lặp (một hoặc nhiều); điều kiện dòng; số tối thiểu; điều kiện áp dụng (biểu thức trên biến quy trình, rỗng là luôn áp); thông báo | Inline tại bảng, theo tham số, vd "Hồ sơ điều chỉnh phải còn ít nhất một hạng mục." |
| KT-21 | Mọi báo giá được tính vào cơ sở giá đang chốt của bước có Ngày báo giá không nhỏ hơn ngày mốc | Ngày mốc (biến quy trình, vd hoSo.ngayTao); thông báo | Inline tại dòng báo giá, theo tham số, vd "Báo giá phải có ngày từ {ngày tạo hồ sơ} trở về sau." |

### 2.5.3 Hậu xử lý

\[CẤU HÌNH\] Mỗi hậu xử lý là một mã dùng chung, chạy sau khi lưu dữ liệu, trước khi hoàn thành công việc. Năng lực gắn hậu xử lý theo luật: YC-NT-02.

| Mã | Hậu xử lý | Tham số |
|----|----|----|
| HX-01 | Ghi các khóa eForm của bước sang bảng nghiệp vụ theo bảng ghi dữ liệu nghiệp vụ (mục 2.4.3) | — (đọc bảng theo bước) |
| HX-02 | Sinh văn bản của bước từ mẫu Word và dữ liệu form, gắn phiên bản hiện tại (BR-DXMS-08-03) | Mẫu văn bản theo luồng con (YC-NT-04) |
| HX-03 | Gửi trình ký văn bản của bước theo hình thức ký của hồ sơ (BR-DXMS-08-04, YC-NT-03) | Văn bản, người ký theo luồng con (BR-DXMS-08-05) |
| HX-04 | Lưu giá trị AI gợi ý và giá trị người dùng chốt (BR-DXMS-C-08) | Khóa bảng gợi ý |
| HX-05 | Tăng phiên bản hồ sơ (BR-DXMS-C-11) | — |
| HX-06 | Tính ngày theo ngày làm việc: ghi biến đích bằng ngày gốc cộng số NLV theo lịch ngày làm việc của hệ thống; điều kiện sai thì ghi giá trị thay thế; có khóa giữ thì chỉ tính lại khi giá trị hiện tại bằng giá trị mặc định đã tính (người dùng không sửa tay) | Biến đích, ngày gốc, số NLV (theo SLA mục 2.3.3 của hồ sơ), điều kiện, giá trị thay thế, khóa giữ |
| HX-07 | Ghi trạng thái xác nhận: đặt trạng thái, người, thời điểm, lý do của luật vào bản ghi nghiệp vụ; thêm một dòng lịch sử, không ghi đè; khi có tham số thì ghi lý do vào biến và thêm dòng vào biến lịch sử | Bảng.cột trạng thái, giá trị trạng thái, bảng lịch sử, biến lý do, biến lịch sử |
| HX-08 | Mở lần thẩm định \[RIÊNG\], chạy ở tác vụ hệ thống bước 18 sau khi BM-03 Đã ký: lần đang lập thành lần mới nhất; ghi T0, phiên bản hồ sơ lúc gửi, lần 1 ghi Hạn góp ý lần đầu; tính lại Hạn góp ý theo HX-06; gửi thông báo kèm BM-03, hồ sơ cho Đầu mối và người xử lý của từng CQCM; dòng ý kiến của CQCM không còn trong danh sách thành Không còn áp dụng (BR-DXMS-07-08); xuất danh sách CQCM cho đa thể hiện bước 19; CQCM chưa có người xử lý thì thông báo TTMS | — |
| HX-09 | Đánh giá một mã kiểm tra ở chế độ không chặn và ghi kết quả từng điều kiện của mã đó (Điều kiện, Kết quả Đạt / Chưa đạt) vào biến quy trình, để eForm của bước sau hiện cho người dùng xem. Không thay kiểm tra khi bấm nút: mã kiểm tra vẫn chạy lại ở bước sau | Mã kiểm tra; biến đích |
| HX-10 | Ghi văn bản nhận được của bước vào step_file (kind = RECEIVED_DOC, on_behalf = 1 khi ghi nhận thay theo KT-09); ghi nhận thay thì nhật ký ghi người ghi nhận và bên ra kết quả (BR-DXMS-08-09). Khóa tệp rỗng thì chỉ ghi nhật ký | Khóa tệp, bên ra kết quả |
| HX-11 | Gửi thông báo trong hệ thống kèm văn bản cho người nhận lấy từ biến quy trình | Khóa người nhận (một hoặc nhiều), khóa tệp hoặc văn bản kèm |
| HX-12 | Ghi lý do của hành động (từ hộp thoại Lý do), người thực hiện, thời điểm vào một biến quy trình dạng { lyDo, nguoi, thoiDiem }, ghi đè giá trị trước, để eForm của bước sau hiện | Biến đích |
| HX-13 | Chốt bản rà soát tồn kho \[RIÊNG\], chạy sau HX-01 của luật xác nhận bước 7: sinh mã RSTK-YYYY-NNNN; ghi thời điểm xác nhận, từ đó bản không sửa (BR-DXMS-03-07); ghi Đang giữ cho ĐXMS khác tại lúc xác nhận của từng dòng; dòng có Dùng từ kho lớn hơn 0 chuyển sang Đang tạm giữ (BR-DXMS-03-05); hoàn thành công việc Rà soát tồn kho của nhóm TT nếu còn mở (DTMS_CN_0142). Chạy lại sau trạng thái Lỗi không sinh mã thứ hai | — |
| HX-14 | Thêm bản ghi mới vào danh mục dùng chung từ bảng lặp của form, trong cùng giao dịch với hoàn thành công việc: mỗi dòng có khóa nhận diện chưa có trong danh mục thì thêm bản ghi ở trạng thái Hoạt động, mã do hệ thống sinh, giá trị mặc định theo tham số, ghi nguồn là mã hồ sơ; khóa nhận diện đã có ở bản ghi dùng được thì dùng bản ghi đó, không đổi danh mục. Ghi danh sách mã cuối cùng (giá trị đã chọn cộng bản ghi vừa thêm hoặc dùng lại) vào biến đích. Lỗi thì không thêm bản ghi nào (BR-DXMS-04-04) | Khóa bảng lặp, khóa danh sách đã chọn, danh mục và ánh xạ cột (vd Tên → name, Mã số thuế → tax_code, Email → email, Ngành hàng → goods_types), giá trị mặc định (vd Phân loại Trong nước), cột nguồn, biến đích |
| HX-15 | Tính ngày theo ngày lịch trừ ngày nghỉ lễ, Tết: ghi biến đích bằng ngày gốc cộng số ngày, tính cả thứ Bảy, Chủ nhật, không tính ngày nghỉ lễ, Tết theo lịch nghỉ của hệ thống; số ngày chọn theo điều kiện; có khóa giữ thì chỉ tính lại khi giá trị hiện tại bằng giá trị mặc định đã tính (người dùng không sửa tay). Khác HX-06 ở loại ngày; có thể gộp vào HX-06 bằng tham số loại ngày (ngày làm việc / ngày lịch trừ ngày lễ) | Biến đích, ngày gốc, số ngày theo điều kiện (vd 7 khi có Nhóm 2, 5 khi chỉ Nhóm 1), khóa giữ |
| HX-16 | Nạp bản ghi nghiệp vụ của hồ sơ vào biến quy trình: đọc các dòng của bảng thỏa điều kiện lọc, sắp theo thứ tự, ghi vào biến đích (danh sách, mỗi dòng gồm mã dòng và các cột theo bảng cột → khóa), thay giá trị cũ của biến; không có dòng thì ghi danh sách rỗng. Dùng làm giá trị khởi tạo hoặc khối chỉ xem của eForm bước sau; không ghi bảng nghiệp vụ | Bảng, điều kiện lọc, thứ tự, cột → khóa, biến đích |
| HX-17 | Cập nhật hàng loạt bản ghi nghiệp vụ của hồ sơ: mọi dòng của bảng thỏa điều kiện lọc được đặt cột theo giá trị cho trước; ghi nhật ký số dòng đổi; không có dòng thì không làm gì. Chạy lại trên cùng dữ liệu không đổi thêm gì (lũy đẳng) | Bảng, điều kiện lọc, cột = giá trị |
| HX-18 | Ghi dữ liệu điều chỉnh của hồ sơ vào biến quy trình để mẫu văn bản trộn: Hồ sơ căn cứ, văn bản phê duyệt cũ (Số, Ngày ký), Nhóm lý do, Lý do, bảng trước – sau, hạng mục bị ảnh hưởng, Giá trị trước, sau, chênh lệch, kết quả đã thực hiện, Ghi chú ngân sách; lấy từ nguồn tính so sánh, tác động (DTMS_CN_0173) tại lúc chạy. Hồ sơ không phải loại Điều chỉnh thì không làm gì | Biến đích |

# 3. THIẾT KẾ CHI TIẾT

## 3.1 THIẾT KẾ CHI TIẾT NGHIỆP VỤ

### 3.1.1 Đề xuất mua sắm

Quản lý ĐXMS. Người dùng chỉ làm việc với ĐXMS: một mã, một trạng thái, một màn chi tiết. Mỗi ĐXMS có đúng một hồ sơ ở tầng dữ liệu (BR-DXMS-C-02); giao diện không hiện mã, trạng thái hồ sơ. Menu Đầu tư mua sắm \> Quản lý đề xuất mua sắm có mục **Đề xuất mua sắm**, cùng mục Yêu cầu báo giá ĐXMS. Nghiệp vụ gồm tra cứu, tạo ĐXMS (tạo ĐXMS, hồ sơ và khởi tạo quy trình trong một lần Lưu), Sao chép ĐXMS Dừng xử lý, xem chi tiết, sửa, xem văn bản phê duyệt, cập nhật nhân sự thực hiện. Tạo ĐXMS điều chỉnh theo DTMS_CN_0172.

Quy tắc của nghiệp vụ 3.1.1:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-01-01 | **Mã ĐXMS** do hệ thống sinh khi Lưu, dạng ĐXMS-YYYY-NNNN: YYYY là năm tạo, NNNN là số tăng dần trong năm, bắt đầu từ 0001. Hết 9999 thì NNNN có thêm chữ số. Mã không sửa được, không dùng lại kể cả khi lần lưu bị lỗi. ĐXMS điều chỉnh và ĐXMS sao chép có mã mới theo cùng quy tắc |
| BR-DXMS-01-02 | **Không kiểm trùng Tên ĐXMS,** vì một tài liệu đầu vào được lập thành nhiều ĐXMS khi mua theo nhiều đợt. Mã là khóa duy nhất |
| BR-DXMS-01-03 | **Được sửa theo trạng thái.** APPROVING: sửa được trừ Đơn vị đề xuất, Mật, vì hai trường này quyết định ai thấy ĐXMS; hai trường này chỉ chọn khi tạo ĐXMS. APPROVED, ADJUSTING, SUPERSEDED, STOPPED: mọi trường chỉ đọc. Đổi nội dung ĐXMS Đã phê duyệt thì tạo ĐXMS điều chỉnh (DTMS_CN_0172); làm lại ĐXMS Dừng xử lý thì Sao chép (BR-DXMS-01-15). Mã không bao giờ sửa được |
| BR-DXMS-01-04 | **Sửa ĐXMS không đổi dữ liệu hồ sơ đã sao chép.** Hồ sơ giữ thông tin sao chép khi tạo (BR-DXMS-06-02), kể cả Mật. Cách ký theo Mật trên hồ sơ. Khi xét quyền xem, ĐXMS là Mật nếu Mật trên hồ sơ hoặc trên ĐXMS là Có (BR-DXMS-01-09) |
| BR-DXMS-01-05 | **Xóa ĐXMS chỉ khi chưa gửi hoặc bị trả lại.** Người thực hiện công việc Lập đề xuất mua sắm đang mở xóa được ĐXMS chưa gửi (đã Lưu nháp) hoặc ĐXMS bị Chỉ huy đơn vị đề xuất trả lại ở bước xác nhận khởi tạo, theo tài liệu Lập đề xuất mua sắm: hỏi xác nhận, xóa mềm, hủy quy trình và công việc đang mở của hồ sơ, giải phóng phần dự toán đang dùng, mã không dùng lại, nhật ký giữ. ĐXMS khác không xóa được: dừng ĐXMS đang phê duyệt bằng Hủy ĐXMS (mục 2.3.2); ĐXMS sang Dừng xử lý, vẫn tra cứu được, làm lại bằng Sao chép |
| BR-DXMS-01-06 | **Giá trị dự kiến** là giá trị ban đầu do người dùng nhập, đơn vị tỷ đồng, không dùng để phân luồng. Giá trị hiệu lực theo BR-DXMS-C-04, không sửa tay |
| BR-DXMS-01-07 | **Kiểm tra bảo mật.** Mật = Có thì màn hiện khối AI kiểm tra 4 quy tắc: Tên ĐXMS không chứa số hiệu, tên mã thiết bị, dự án mật; Mục đích không nêu thông số kỹ thuật, địa điểm triển khai cụ thể; Đơn vị đề xuất được phép xử lý hồ sơ Mật; Hồ sơ Mật ký bản giấy, không gửi yêu cầu báo giá qua email hệ thống khi chưa được duyệt. AI chạy khi chọn Mật = Có và khi rời ô Tên, Mục đích, Đơn vị đề xuất. Mỗi quy tắc có Kết quả (Đạt, Không đạt, Lưu ý, Chưa có kết quả) và Gợi ý. Quy tắc 1 đối chiếu danh sách từ khóa nhạy cảm, quy tắc 3 đối chiếu danh sách đơn vị được xử lý hồ sơ Mật, hai danh sách là cấu hình; quy tắc 4 là nhắc nhở cố định, không gọi AI, luôn là Lưu ý, kể cả khi AI lỗi. Khi AI đang chạy, quy tắc 1, 2, 3 hiện Đang kiểm tra. AI lỗi hoặc ô liên quan còn rỗng thì quy tắc đó hiện Chưa có kết quả, không giữ kết quả cũ. Kết quả chỉ để xem, không chặn Lưu, \[Lưu\] không chờ AI. Sau khi Lưu, hệ thống chạy lại AI một lần, không tự chạy lại khi lỗi, lưu kết quả cùng ĐXMS, xem lại tại DTMS_CN_0137, DTMS_CN_0138; việc ghi kết quả này không đổi phiên bản bản ghi, Ngày cập nhật. Đổi Mật từ Có về Không thì ẩn khối; khi Lưu, kết quả bị xóa khỏi ĐXMS, nhật ký vẫn giữ |
| BR-DXMS-01-08 | **Đơn vị đề xuất** chọn được mọi đơn vị trong danh sách, mặc định là đơn vị chính của người dùng; không có đơn vị chính hoặc đơn vị đó không có trong danh sách thì để rỗng. **Người tạo luôn thấy ĐXMS của mình** ở Danh sách, Chi tiết, kể cả khi chọn đơn vị khác hoặc ĐXMS Mật. Người tạo là Người phụ trách hồ sơ của ĐXMS (BR-DXMS-01-11), kể cả khi không thuộc đơn vị đề xuất: xử lý các bước của ĐV trên ĐXMS đó và sửa ĐXMS như ĐV của đơn vị đề xuất. Sao chép, tạo ĐXMS điều chỉnh do ĐV của đơn vị đề xuất thực hiện |
| BR-DXMS-01-09 | **Phạm vi xem theo ĐXMS và độ Mật,** theo bảng dưới. ĐV, CH không thuộc đơn vị đề xuất thì xét như CQ, PG, TĐ. Danh sách xử lý của ĐXMS là danh sách xử lý của hồ sơ của nó: người nhận việc, thành viên nhóm được giao, người ký, người nhận ủy quyền và người đã có thao tác, kể cả sau khi chuyển việc đi. Người không được thấy ĐXMS thì không có dòng trên danh sách, mở bằng đường dẫn thì báo không có quyền. Mỗi ĐXMS trong chuỗi điều chỉnh xét riêng: thấy một ĐXMS không làm thấy ĐXMS khác của chuỗi. Ở card Lịch sử điều chỉnh, dòng của ĐXMS người xem không được thấy chỉ hiện Lần, Trạng thái; Mã không có link, Giá trị, Lý do điều chỉnh hiện "-" |
| BR-DXMS-01-10 | **Giá trị tham chiếu không còn hợp lệ.** Nhiệm vụ / Đề tài, dự án hoặc Đơn vị đề xuất đã chọn mà không còn hợp lệ khi Lưu thì không lưu, hiện lỗi tại ô, người dùng phải chọn lại. Mở màn Chỉnh sửa vẫn hiện giá trị đã lưu. Áp dụng cả khi người dùng không đổi trường đó, kể cả giá trị điền sẵn khi Sao chép. Ô đang chỉ đọc không kiểm tra, giữ giá trị đã lưu |
| BR-DXMS-01-11 | **Tạo ĐXMS.** Lưu thực hiện trọn một lần: sinh Mã ĐXMS; tạo ĐXMS, Loại theo BR-DXMS-C-03; tạo hồ sơ của ĐXMS theo BR-DXMS-06-05, thông tin sao chép theo BR-DXMS-06-02; ghi văn bản căn cứ đầu vào (BR-DXMS-01-12); lưu nhân sự thực hiện (BR-DXMS-01-13); khởi tạo tiến trình MS01 (Tạo mới) hoặc MS02 (Điều chỉnh, DTMS_CN_0172), giao bước 1 cho người tạo; ĐXMS ở APPROVING. Một phần lỗi thì không có gì được tạo |
| BR-DXMS-01-12 | **Căn cứ đầu vào.** Khi tạo ĐXMS, người dùng chọn văn bản căn cứ đã khai báo hoặc khai báo mới như bước 1 (DTMS_CN_0140, BR-DXMS-02-03). Loại căn cứ có cờ Bắt buộc ở danh mục Loại tài liệu căn cứ; thiếu văn bản của loại bắt buộc thì không Lưu được. Văn bản đã chọn thành văn bản căn cứ của hồ sơ, hiện sẵn ở bước 1; tại bước 1 người dùng xác nhận, thêm, bỏ theo BR-DXMS-02-02, BR-DXMS-02-07 |
| BR-DXMS-01-13 | **Nhân sự thực hiện.** Người dùng chỉ định đích danh người làm một bước người dùng của quy trình MS01: bước của ĐV, CH, TT, PG, TV theo BR-DXMS-08-01; không gồm bước 1 (giao người tạo, BR-DXMS-01-11), bước của CQCM (19–23, 35–37, 46) vì CQCM chọn ở bước 16, bước của Tập đoàn (53–56) và bước 60 (BR-DXMS-C-29). Mỗi bước tối đa một dòng, một hoặc nhiều người, mỗi người thuộc vai trò nhận việc của bước. Bước có chỉ định giao cho những người đó, nhiều người thì người nhận việc trước xử lý theo DTMS_CN_0109; bước không có chỉ định giao theo BR-DXMS-08-01. Nhân sự thực hiện thuộc ĐXMS. ĐXMS điều chỉnh lập nhân sự theo DTMS_CN_0172. Phạm vi bước và cách giao khi nhiều người là đề xuất tạm |
| BR-DXMS-01-14 | **Cập nhật nhân sự.** Người phụ trách hồ sơ hoặc TT thay người hoặc bổ sung người cho một bước chưa xong của ĐXMS APPROVING, không cần duyệt. Bước đã xong là bước đã hoàn thành ít nhất một lần và không có công việc đang mở; bước đã xong không cập nhật được, tiến trình quay lại bước đó thì công việc giao theo nhân sự đang lưu. Thay người: người bị thay ra khỏi chỉ định của bước; bước chưa chỉ định thì người thay thế thay toàn bộ người nhận theo vai trò. Bổ sung người: chỉ dùng cho bước đã có chỉ định, thêm người vào chỉ định; bước chưa chỉ định thì dùng Thay người. Công việc đang mở của bước đổi người nhận ngay; công việc người bị thay đã nhận thì bỏ nhận, giữ dữ liệu đang nhập dở. Văn bản đã ký giữ nguyên; văn bản đang trình ký có người bị thay là người ký không tự thu hồi, xử lý tại công việc Xử lý trình ký (BR-DXMS-08-04). Văn bản căn cứ, Lý do không bắt buộc. Mỗi lần lưu ghi một dòng Lịch sử thay đổi nhân sự và nhật ký |
| BR-DXMS-01-15 | **Sao chép.** ĐXMS STOPPED không chạy lại. ĐV của đơn vị đề xuất bấm \[Sao chép thành ĐXMS mới\] ở Chi tiết đề xuất mua sắm, hệ thống mở Thêm mới ĐXMS (DTMS_CN_0136) điền sẵn từ ĐXMS cũ: Tên, Nhiệm vụ / Đề tài, dự án, Đơn vị đề xuất, Mức ưu tiên, Lý do ưu tiên, Mật, Giá trị dự kiến, Thời gian thực hiện, Mục đích, văn bản căn cứ đầu vào, nhân sự thực hiện; người dùng sửa được như khi tạo mới. Chưa Lưu thì chưa tạo gì. Lưu tạo ĐXMS mới theo BR-DXMS-01-11, Loại Tạo mới, liên kết Sao chép từ chỉ để tham khảo, không thuộc chuỗi điều chỉnh (BR-DXMS-C-03). Không chép tiến trình, dữ liệu các bước, văn bản đầu ra, kết quả rà soát, yêu cầu báo giá. ĐXMS cũ giữ Dừng xử lý; một ĐXMS sao chép được nhiều lần |
| BR-DXMS-01-16 | **Lý do ưu tiên.** Mức ưu tiên Khẩn hoặc Thượng khẩn thì Lý do ưu tiên bắt buộc, tối đa 1000 ký tự. Mức Thường thì ẩn ô; khi Lưu, lý do đã nhập bị xóa. Lý do hiện ở Thông tin chung của Chi tiết đề xuất mua sắm |

**Ai thấy ĐXMS (BR-DXMS-01-09):**

| Người xem | ĐXMS không Mật | ĐXMS Mật |
|----|----|----|
| Người tạo; ĐV, CH của đơn vị đề xuất | Thấy | Thấy |
| TT, TV | Thấy | Chỉ khi thuộc danh sách xử lý của ĐXMS |
| CQ, PG, TĐ; ĐV, CH khác đơn vị đề xuất | Chỉ khi thuộc danh sách xử lý của ĐXMS | Chỉ khi thuộc danh sách xử lý của ĐXMS |

Thấy ĐXMS thì thấy mọi dữ liệu của ĐXMS đó ở các tab của Chi tiết đề xuất mua sắm, trừ ý kiến giữa các CQCM (BR-DXMS-07-04).

#### 3.1.1.1 DTMS_CN_0135 Xem danh sách ĐXMS và tìm kiếm

##### 3.1.1.1.1 Thông tin chung chức năng

- **Mục đích:** Tra cứu ĐXMS trong phạm vi được xem; mỗi dòng cho biết loại ĐXMS, luồng con, bước hiện tại và người đang xử lý.

- **Người dùng mục tiêu:** Xem: ĐV, CH, TT, CQ, PG, TV. Thêm mới, Điều chỉnh ĐXMS, Sửa: ĐV (mục 2.3.2).

- **Đường dẫn truy cập:** Đầu tư mua sắm \> Quản lý đề xuất mua sắm \> Đề xuất mua sắm.

- **Tiền điều kiện:**

  - Đã đăng nhập, có quyền xem.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.1.1.2 Màn hình

<img src="media/rId70.png" style="width:6.25in;height:7.07348in" alt="Danh sách đề xuất mua sắm" />

<img src="media/rId73.png" style="width:6.25in;height:7.09459in" alt="Tìm kiếm nâng cao" />

Ảnh minh họa bố cục. Khác ảnh: ô Từ khóa luôn hiện cùng khối tìm kiếm nâng cao; lưới có thêm Giá trị hiệu lực, Mức ưu tiên, Ngày tạo, không có cột Đề tài / dự án, Đợt, Người tạo; khối nâng cao không có Khối đơn vị, Người tạo, Mật; trạng thái Chưa khởi tạo trong ảnh là dữ liệu mẫu, không thuộc mục 2.3.1.1; dòng và icon trong ảnh chưa lọc theo đơn vị, quyền. Khi khác nhau, áp dụng mục 3.1.1.1.3.

##### 3.1.1.1.3 Mô tả chi tiết các thành phần

**Màn riêng** \[RIÊNG\]: màn danh sách của đối tượng ĐXMS, đăng ký là mục menu Đề xuất mua sắm; đọc bảng proposal và tiến trình của hồ sơ, không phải màn của bước quy trình, không có eForm, luật nút.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tìm kiếm** |  |  |  |  |
| 1 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo mã, tên đề xuất". **Chứa** trên Mã ĐXMS hoặc Tên ĐXMS. Chuẩn hóa từ khóa, không phân biệt hoa thường và dấu, Enter tương đương \[Tìm kiếm\] theo mục 4.3. Mapping: proposal.code, proposal.title. |
|  | **Tìm kiếm nâng cao** |  |  |  |  |
| 2 | Mã ĐXMS | Textbox \[255\] | Input | Rỗng | **Chứa**, không phân biệt hoa thường và dấu (mục 4.3). Mapping: proposal.code. |
| 3 | Loại ĐXMS | Dropdown một lựa chọn | Input | Rỗng | **Bằng**. Giá trị: Tạo mới, Điều chỉnh (BR-DXMS-C-03). ĐXMS sao chép là Tạo mới. Rỗng là tất cả. Mapping: Suy từ proposal.adjust_from_id: có giá trị là Điều chỉnh. |
| 4 | Tên ĐXMS | Textbox \[255\] | Input | Rỗng | **Chứa**, không phân biệt hoa thường và dấu (mục 4.3). Mapping: proposal.title. |
| 5 | Nhiệm vụ / Đề tài, dự án | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**. Mapping: proposal.mission_code. |
| 6 | Đơn vị đề xuất | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**. Mapping: proposal.unit_id. |
| 7 | Trạng thái | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc** danh sách đã chọn. Giá trị theo mục 2.3.1.1. Mapping: proposal.status. |
| 8 | Mức ưu tiên | Dropdown một lựa chọn | Input | Rỗng | **Bằng**. Giá trị: Thường, Khẩn, Thượng khẩn. Mapping: proposal.priority. |
| 9 | Ngày tạo từ, Ngày tạo đến | Date picker \[DD/MM/YYYY\] | Input | Rỗng | Từ ≤ Ngày tạo ≤ Đến, tính cả hai đầu. Mapping: proposal.created_at. |
|  | **Thao tác** |  |  |  |  |
| 10 | \[Thêm mới\] | Button | Input | – | Mở DTMS_CN_0136. Hiện với ĐV. |
| 11 | \[Điều chỉnh ĐXMS\] | Button | Input | – | Mở DTMS_CN_0172, ô ĐXMS cần điều chỉnh rỗng. Hiện với ĐV. |
| 12 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\] | Button | Input | – | Mở, đóng khối tìm kiếm nâng cao. Đóng khối vẫn giữ điều kiện đã áp, bỏ giá trị đã nhập mà chưa áp; khi đó nút ghi kèm số điều kiện, ví dụ \[Tìm kiếm nâng cao (2)\]. |
| 13 | \[Tìm kiếm\] | Button | Input | – | Áp đồng thời từ khóa và mọi điều kiện, về trang 1, giữ số bản ghi mỗi trang. |
| 14 | \[Đặt lại\] | Button | Input | – | Xóa từ khóa, đưa điều kiện về rỗng, về trang 1, tải lại. |
|  | **Lưới** |  |  |  |  |
| 15 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong tập kết quả. |
| 16 | Thao tác | Icon | Input | – | Sửa: mở DTMS_CN_0138, hiện khi ĐXMS ở APPROVING với ĐV của đơn vị đề xuất và người tạo (BR-DXMS-01-03, BR-DXMS-01-08). Xóa: hiện khi ĐXMS chưa gửi hoặc bị trả lại và người xem là người thực hiện công việc Lập đề xuất mua sắm đang mở (BR-DXMS-01-05). Trường hợp khác: ô trống. |
| 17 | Trạng thái | Tag | Output | Theo dữ liệu | Theo mục 2.3.1.1; ĐXMS điều chỉnh kèm lần điều chỉnh, ví dụ "Đã phê duyệt (điều chỉnh lần 2)". Mapping: proposal.status, proposal.adjust_no. |
| 18 | Mã ĐXMS | Link | Input | – | Mở DTMS_CN_0137. Mapping: proposal.code. |
| 19 | Loại ĐXMS | Text | Output | Theo dữ liệu | Tạo mới hoặc Điều chỉnh, như thành phần 3. Mapping: Suy từ proposal.adjust_from_id. |
| 20 | Tên ĐXMS | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: proposal.title. |
| 21 | Quy trình | Text | Output | Theo dữ liệu | Luồng con theo BR-DXMS-C-05. Mapping: profile.branch, profile.branch_expected. |
| 22 | Bước hiện tại | Text | Output | Theo dữ liệu | Tên các bước đang có công việc mở, nối bằng dấu phẩy. ĐXMS không còn công việc mở hiện "-". Mapping: Theo tiến trình. |
| 23 | Người đang xử lý | Text | Output | Theo dữ liệu | Họ tên người nhận các công việc đang mở của ĐXMS, nối bằng dấu phẩy, không lặp; công việc giao nhóm chưa có người nhận thì hiện tên nhóm. Không còn công việc mở hiện "-". Tối đa 2 dòng, quá dài hiện tooltip. Mapping: Theo công việc (DTMS_CN_0108). |
| 24 | Đơn vị đề xuất | Text | Output | Theo dữ liệu | Mapping: proposal.unit_id. |
| 25 | Giá trị hiệu lực (tỷ đồng) | Number | Output | Theo dữ liệu | Của ĐXMS theo BR-DXMS-C-04, căn phải. Không có giá trị thì hiện "-". Mapping: profile.total_value khi hồ sơ Hoàn thành, không thì proposal.estimated_value. |
| 26 | Mức ưu tiên | Text | Output | Theo dữ liệu | Mapping: proposal.priority. |
| 27 | Ngày tạo | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: proposal.created_at. |
| 28 | Ngày cập nhật | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: proposal.updated_at. |

Sắp xếp mặc định: Ngày tạo giảm dần, cùng ngày thì Mã giảm dần. Phân trang theo mục 4.4. Bấm vào dòng cũng mở DTMS_CN_0137.

##### 3.1.1.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                              |
|------|--------------------------------------------------------------------|
| 1    | Người dùng mở màn.                                                 |
| 2    | Hệ thống tải ĐXMS trong phạm vi được xem (BR-DXMS-01-09), trang 1. |
| 3    | Người dùng tìm kiếm, phân trang.                                   |
| 4    | Người dùng mở chi tiết, thêm mới, tạo ĐXMS điều chỉnh hoặc sửa.    |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có ĐXMS trong phạm vi | Giữ tiêu đề bảng, hiện "Chưa có dữ liệu" (mục 4.2) |
| Có dữ liệu, không khớp điều kiện | Hiện "Không tìm thấy dữ liệu phù hợp" |
| Ngày tạo từ lớn hơn Ngày tạo đến | Inline: "Ngày tạo từ không được lớn hơn Ngày tạo đến." Không tìm |
| Không tải được | Tại vùng lưới: "Không thể tải dữ liệu. Vui lòng thử lại." Giữ điều kiện tìm (mục 4.6.3) |
| Không có quyền vào màn | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** bước hiện tại, người đang xử lý thay đổi trong lúc xem thì hiện ở lần tải sau.

##### 3.1.1.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0135-01 | Chuyên viên đơn vị A; có ĐXMS của đơn vị A và B, ĐXMS của B không do người này tạo | Mở màn | Chỉ thấy ĐXMS của đơn vị A |
| AC-0135-02 | Có ĐXMS tên "Mua sắm máy chủ" | Nhập "may chu", Enter | Có bản ghi đó trong kết quả, về trang 1 |
| AC-0135-03 | Đã nhập từ khóa, chọn Trạng thái | Bấm \[Tìm kiếm\] | Kết quả thỏa đồng thời cả hai |
| AC-0135-04 | Đã có điều kiện tìm | Bấm \[Đặt lại\] | Điều kiện rỗng, danh sách đầy đủ, trang 1 |
| AC-0135-05 | Ngày tạo từ 10/10/2026, đến 01/10/2026 | Bấm \[Tìm kiếm\] | Hiện thông báo inline, không tìm |
| AC-0135-06 | Có ĐXMS-2026-0010 Tạo mới, ĐXMS-2026-0021 điều chỉnh từ ĐXMS-2026-0010, ĐXMS-2026-0030 sao chép từ một ĐXMS Dừng xử lý | Chọn Loại ĐXMS = Điều chỉnh, \[Tìm kiếm\] | Chỉ có ĐXMS-2026-0021, cột Loại ĐXMS "Điều chỉnh"; chọn Tạo mới thì có ĐXMS-2026-0010 và ĐXMS-2026-0030 |
| AC-0135-07 | ĐXMS đang ở bước 46, 47, Chỉ huy CQCM Nguyễn Văn A đã nhận việc bước 46, bước 47 giao Phó TGĐ Trần Văn B | Xem dòng | Người đang xử lý "Nguyễn Văn A, Trần Văn B" |
| AC-0135-08 | Hơn 10 ĐXMS | Chọn 20 bản ghi mỗi trang | Hiện tối đa 20 dòng, về trang 1 |
| AC-0135-09 | ĐXMS Mật = Có; TT không thuộc danh sách xử lý của ĐXMS | TT mở màn | Không có dòng đó |
| AC-0135-10 | ĐXMS Mật = Có vừa tạo | CH của đơn vị đề xuất, rồi TT không thuộc danh sách xử lý mở màn | CH thấy, TT không thấy |
| AC-0135-11 | Chuyên viên đơn vị A tạo ĐXMS Mật = Có cho đơn vị B | Người tạo mở màn | Thấy dòng đó, có icon Sửa khi ĐXMS Đang phê duyệt |
| AC-0135-12 | ĐXMS Đã phê duyệt, không còn công việc mở | Xem dòng | Bước hiện tại, Người đang xử lý "-", không có icon Sửa |
| AC-0135-13 | Đã chọn Trạng thái trong khối nâng cao, chưa bấm \[Tìm kiếm\] | Nhấn Enter ở ô Từ khóa | Áp đồng thời từ khóa và Trạng thái, về trang 1 |
| AC-0135-14 | Đã chọn Mức ưu tiên, chưa áp | Đóng rồi mở lại khối nâng cao | Mức ưu tiên về giá trị đã áp gần nhất |
| AC-0135-15 | ĐV đang ở danh sách | Bấm \[Điều chỉnh ĐXMS\] | Mở DTMS_CN_0172, ô ĐXMS cần điều chỉnh rỗng |
| AC-0135-16 | ĐXMS điều chỉnh lần 2 đã phê duyệt | Xem dòng | Trạng thái "Đã phê duyệt (điều chỉnh lần 2)", Loại ĐXMS "Điều chỉnh" |

#### 3.1.1.2 DTMS_CN_0136 Thêm mới ĐXMS

##### 3.1.1.2.1 Thông tin chung chức năng

- **Mục đích:** Tạo ĐXMS Loại Tạo mới: tạo ĐXMS, hồ sơ của nó và khởi tạo quy trình MS01 trong một lần Lưu, kèm căn cứ đầu vào và nhân sự thực hiện (BR-DXMS-01-11). Cũng là màn Sao chép ĐXMS Dừng xử lý (BR-DXMS-01-15).

- **Người dùng mục tiêu:** ĐV.

- **Đường dẫn truy cập:** Danh sách ĐXMS \> \[Thêm mới\]; Chi tiết đề xuất mua sắm của ĐXMS STOPPED \> \[Sao chép thành ĐXMS mới\].

- **Tiền điều kiện:**

  - Có quyền thêm.

  - Quy trình MS01 có phiên bản đang hoạt động.

- **Hậu điều kiện:**

  - ĐXMS Loại Tạo mới ở APPROVING, có Mã, tiến trình MS01 đang chạy; công việc bước 1 giao người tạo.

  - Sao chép: ĐXMS mới có liên kết Sao chép từ; ĐXMS cũ không đổi.

##### 3.1.1.2.2 Màn hình

<img src="media/rId82.png" style="width:6.25in;height:3.03711in" alt="Thêm mới ĐXMS" />

<img src="media/rId85.png" style="width:6.25in;height:3.03711in" alt="Lỗi bỏ trống trường bắt buộc" />

Ảnh minh họa bố cục, chụp phần trên của màn; bảng Nhân sự thực hiện nằm dưới khối Căn cứ đầu vào. Khác ảnh: không có ô Quy trình (BR-DXMS-C-05); khối Căn cứ đầu vào là bảng chọn văn bản căn cứ như bước 1, không có cột Gắn vào; bảng Nhân sự thực hiện chọn được mọi bước theo BR-DXMS-01-13; chọn Khẩn, Thượng khẩn thì hiện ô Lý do ưu tiên; câu thông báo theo mục 3.1.1.2.4. Ô Mật bắt buộc nhưng luôn có giá trị nên không cần dấu sao.

##### 3.1.1.2.3 Mô tả chi tiết các thành phần

**Màn riêng** \[RIÊNG\]: màn tạo của đối tượng ĐXMS, mở từ màn danh sách hoặc từ \[Sao chép thành ĐXMS mới\]; Lưu ghi bảng proposal, tạo hồ sơ và khởi tạo tiến trình (BR-DXMS-01-11). Không phải màn của bước quy trình.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Thông tin chung** |  |  |  |  |
| 1 | Mã ĐXMS | Textbox khóa | Output | Placeholder "Hệ thống tự sinh" | BR-DXMS-01-01. Mapping: proposal.code. |
| 2 | Tên ĐXMS \* | Textbox \[500\] | Input | Rỗng | Placeholder "Ví dụ: Đề xuất mua sắm cho dự án A". BR-DXMS-01-02. Mapping: proposal.title. |
| 3 | Nhiệm vụ / Đề tài, dự án \* | Dropdown, có tìm kiếm | Input | Rỗng | Hiện "{mã} — {tên} ({loại})". Chỉ mục đã phê duyệt. Không có mục nào thì danh sách hiện "Chưa có dữ liệu", không lưu được. Mapping: proposal.mission_code. |
| 4 | Loại | Textbox khóa | Output | Rỗng | Tự lấy theo mục đã chọn: Nhiệm vụ khoa học công nghệ, Dự án SXKD, Mua sắm thường xuyên. Mapping: Theo mission_code. |
| 5 | Đơn vị đề xuất \* | Dropdown, có tìm kiếm | Input | Đơn vị chính của người dùng | BR-DXMS-01-08, BR-DXMS-01-10. Mapping: proposal.unit_id. |
| 6 | Mức ưu tiên \* | Dropdown | Input | Thường | Thường, Khẩn, Thượng khẩn. Chỉ để hiển thị, không ảnh hưởng hạn xử lý. Mapping: proposal.priority. |
| 7 | Lý do ưu tiên \* | Textarea \[1000\] | Input | Rỗng | Hiện khi Mức ưu tiên Khẩn, Thượng khẩn; placeholder "Nhập lý do chọn mức {Mức ưu tiên}". BR-DXMS-01-16. Mapping: proposal.priority_reason. |
| 8 | Mật | Dropdown | Input | Không | Không, Có. Chọn Có thì hiện khối AI kiểm tra (BR-DXMS-01-07). Mapping: proposal.secret. |
| 9 | Giá trị dự kiến (tỷ đồng) | Số thập phân | Input | Rỗng | Lớn hơn hoặc bằng 0, tối đa 9 chữ số phần nguyên và 2 chữ số thập phân. Dấu phẩy là thập phân, dấu chấm là ngăn nghìn. BR-DXMS-01-06. Mapping: proposal.estimated_value. |
| 10 | Thời gian thực hiện | Textbox \[255\] | Input | Rỗng | Placeholder "Ví dụ: 01/2027 – 09/2027". Mapping: proposal.period. |
| 11 | Người tạo | Textbox khóa | Output | Người dùng hiện tại | Cũng là Người phụ trách hồ sơ (BR-DXMS-08-01). Mapping: proposal.created_by. |
| 12 | Mục đích | Textarea \[2000\] | Input | Rỗng | Placeholder "Nhập mục đích". Mapping: proposal.purpose. |
| 13 | Khối AI kiểm tra quy tắc bảo mật | Bảng chỉ đọc | Output | Ẩn | Hiện khi Mật = Có. Cột Quy tắc, Kết quả, Gợi ý theo BR-DXMS-01-07. Mapping: Kết quả AI lưu cùng ĐXMS. |
|  | **Căn cứ đầu vào** |  |  |  |  |
| 14 | Văn bản căn cứ, bảng lặp | Bảng lặp | Input | Một dòng rỗng | Mỗi dòng Loại căn cứ, Văn bản căn cứ; \[Thêm căn cứ\], icon Xóa, \[Khai báo căn cứ\], bảng tham khảo như hộp thoại bước 1 (DTMS_CN_0140). Loại bắt buộc ghi kèm "(bắt buộc)". Không chọn văn bản nào thì được, trừ khi có loại bắt buộc. BR-DXMS-01-12. Mapping: profile_basis.doc_id của hồ sơ của ĐXMS. |
|  | **Nhân sự thực hiện** |  |  |  |  |
| 15 | \[Thêm dòng\] | Button | Input | – | Thêm một dòng rỗng. Mặc định bảng không có dòng nào; bước không có dòng giao theo vai trò (BR-DXMS-01-13). |
| 16 | Bước \* | Dropdown, có tìm kiếm | Input | Rỗng | Hiện "{số bước} · {tên bước}". Chỉ các bước theo BR-DXMS-01-13, bỏ bước đã có ở dòng khác. Mapping: proposal_member.step. |
| 17 | Tên công việc, Vai trò thực hiện | Text | Output | Theo bước | Tên bước, vai trò nhận việc của bước theo mục 2.3.2. Chưa chọn Bước hiện "-". Mapping: Theo bước. |
| 18 | Nhân sự thực hiện \* | Dropdown nhiều lựa chọn, có tìm kiếm | Input | Rỗng | Vô hiệu khi chưa chọn Bước. Hiện "{Họ tên} — {Đơn vị}", người đang hoạt động thuộc vai trò của bước. Đổi sang bước có vai trò khác thì xóa người đã chọn. Mapping: proposal_member.user_id. |
| 19 | Icon Xóa dòng | Icon | Input | – | Bỏ dòng, không hỏi xác nhận. |
|  | **Thao tác** |  |  |  |  |
| 20 | \[Lưu\] | Button | Input | – | Kiểm tra, thực hiện BR-DXMS-01-11, mở công việc bước 1. Chống bấm lặp, mã yêu cầu theo mục 4.6.6. Gửi lại cùng mã không tạo bản ghi thứ hai: nội dung như lần trước thì báo thành công; nội dung đã đổi thì hiện câu ở mục 3.1.1.2.4, về Danh sách. |
| 21 | \[Hủy\] | Button | Input | – | Chưa nhập gì thì về Danh sách. Đã nhập thì hỏi xác nhận. |
| 22 | Nút quay lại | Icon | Input | – | Như \[Hủy\]. |

**Hộp thoại Hủy:** theo mục 4.6.3, trường hợp Hủy khi đã nhập dữ liệu.

##### 3.1.1.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Mở màn, trường theo giá trị mặc định. |
| 2 | Người dùng nhập Thông tin chung. |
| 3 | Người dùng chọn hoặc khai báo văn bản căn cứ. Sao chép: rà lại các giá trị điền sẵn. |
| 4 | Nếu cần chỉ định người cho bước nào: \[Thêm dòng\], chọn Bước, Nhân sự thực hiện. |
| 5 | Bấm \[Lưu\]. |
| 6 | Hệ thống kiểm tra, hiện lỗi tại tất cả các trường sai cùng lúc. |
| 7 | Thực hiện BR-DXMS-01-11: sinh Mã ĐXMS, Mã hồ sơ, tạo ĐXMS, hồ sơ, văn bản căn cứ của hồ sơ, nhân sự thực hiện, khởi tạo tiến trình; ghi nhật ký ĐXMS và hồ sơ. |
| 8 | Hiện Toast, mở công việc bước 1. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Nội dung thông báo |
|----|----|
| Bỏ trống Tên ĐXMS | Inline: "Vui lòng nhập Tên ĐXMS." |
| Chưa chọn Nhiệm vụ / Đề tài, dự án | Inline: "Vui lòng chọn Nhiệm vụ / Đề tài, dự án." |
| Chưa chọn Đơn vị đề xuất | Inline: "Vui lòng chọn Đơn vị đề xuất." |
| Chưa chọn Mức ưu tiên | Inline: "Vui lòng chọn Mức ưu tiên." |
| Mức ưu tiên Khẩn, Thượng khẩn, bỏ trống Lý do ưu tiên | Inline: "Vui lòng nhập Lý do ưu tiên." |
| Giá trị dự kiến sai định dạng hoặc âm | Inline: "Giá trị dự kiến không hợp lệ." |
| Vượt độ dài | Không nhận thêm ký tự, inline: "Không được nhập quá {maxlength} ký tự." |
| Dòng căn cứ có Loại mà chưa chọn Văn bản, văn bản sai loại, chọn trùng | Như DTMS_CN_0140 |
| Thiếu văn bản của loại bắt buộc | Inline tại khối Căn cứ đầu vào: "Thiếu văn bản căn cứ bắt buộc: {Tên loại}." Nhiều loại nối bằng dấu chấm phẩy |
| Dòng nhân sự chưa chọn Bước | Inline tại dòng: "Vui lòng chọn Bước." |
| Dòng nhân sự chưa chọn người | Inline tại dòng: "Vui lòng chọn Nhân sự thực hiện." |
| Người đã chọn không còn thuộc vai trò hoặc ngừng hoạt động khi Lưu | Inline tại dòng: "{Họ tên} không còn thuộc vai trò {Vai trò}, vui lòng chọn lại." |
| Nhiệm vụ / Đề tài, dự án không còn hợp lệ khi Lưu | Inline: "Nhiệm vụ / Đề tài, dự án không còn hợp lệ, vui lòng chọn lại." |
| Đơn vị đề xuất không còn hợp lệ khi Lưu | Inline: "Đơn vị đề xuất không còn hợp lệ, vui lòng chọn lại." |
| Quy trình MS01 không có phiên bản đang hoạt động | Toast: "Quy trình phê duyệt ĐXMS chưa có phiên bản đang hoạt động. Vui lòng liên hệ quản trị." Không tạo gì |
| Thành công | Toast: "Thêm mới ĐXMS thành công." |
| Lỗi xử lý, lỗi khởi tạo tiến trình | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Không có ĐXMS, hồ sơ nào được tạo; giữ dữ liệu đã nhập |
| Timeout, mất kết nối | Không báo thành công, giữ form để thực hiện lại. Bấm \[Lưu\] lại không tạo ĐXMS thứ hai (mục 4.6.7) |
| Gửi lại cùng mã yêu cầu, nội dung đã đổi | "Yêu cầu trước đó đã được xử lý, nội dung vừa sửa chưa được lưu. Vui lòng kiểm tra lại." |

**Đồng thời:** hai người cùng lưu thì mỗi người nhận một Mã ĐXMS, Mã hồ sơ khác nhau.

##### 3.1.1.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0136-01 | Đã nhập đủ trường bắt buộc, có văn bản của mọi loại bắt buộc | Bấm \[Lưu\] | Có ĐXMS Loại Tạo mới ở APPROVING, tiến trình MS01 đang chạy; văn bản đã chọn hiện sẵn ở bước 1; hiện Toast, mở công việc bước 1 |
| AC-0136-02 | Bỏ trống Tên và Nhiệm vụ | Bấm \[Lưu\] | Không lưu, hiện đồng thời hai thông báo inline |
| AC-0136-03 | Đã có ĐXMS cùng Tên | Lưu ĐXMS trùng Tên | Lưu được, Mã khác |
| AC-0136-04 | Giá trị dự kiến "-5" | Bấm \[Lưu\] | Không lưu, hiện "Giá trị dự kiến không hợp lệ." |
| AC-0136-05 | Mật = Có; "Dự án X1" có trong danh sách từ khóa nhạy cảm | Nhập Tên chứa "Dự án X1", rời ô | Khối AI hiện Không đạt ở quy tắc Tên; bấm \[Lưu\] vẫn lưu được |
| AC-0136-06 | Đã nhập Tên | Bấm \[Hủy\], chọn \[Rời khỏi\] | Không tạo bản ghi, về Danh sách |
| AC-0136-07 | Chưa nhập gì | Bấm \[Hủy\] | Về Danh sách, không hỏi |
| AC-0136-08 | Mất kết nối sau khi máy chủ đã tạo ĐXMS | Bấm \[Lưu\] lại | Không có ĐXMS, tiến trình thứ hai |
| AC-0136-09 | Mật = Có, dịch vụ AI lỗi | Rời ô Tên | Quy tắc 1, 2, 3 hiện Chưa có kết quả, quy tắc 4 hiện Lưu ý; bấm \[Lưu\] vẫn lưu được |
| AC-0136-10 | Mật = Có, AI đang chạy | Bấm \[Lưu\] | Lưu ngay, không chờ AI; kết quả xem tại Chi tiết |
| AC-0136-11 | Mục Nhiệm vụ vừa bị ngừng sử dụng | Bấm \[Lưu\] | Không lưu, hiện câu chọn lại tại ô |
| AC-0136-12 | Vừa Lưu ĐXMS Mật = Có, AI chưa xong | Mở Chi tiết | Quy tắc 1, 2, 3 hiện Đang kiểm tra |
| AC-0136-13 | Không có nhiệm vụ, đề tài, dự án nào đã phê duyệt | Mở màn, mở ô Nhiệm vụ | Vào được màn, danh sách hiện "Chưa có dữ liệu", bấm \[Lưu\] báo lỗi tại ô |
| AC-0136-14 | Lần Lưu trước đã tạo ĐXMS nhưng mất phản hồi, người dùng đã sửa Tên | Bấm \[Lưu\] lại | Không có ĐXMS thứ hai, Tên mới không được lưu, hiện câu "Yêu cầu trước đó đã được xử lý", về Danh sách |
| AC-0136-15 | Loại "Kế hoạch SXKD năm" bắt buộc, chưa có dòng loại đó | Bấm \[Lưu\] | Không lưu, hiện "Thiếu văn bản căn cứ bắt buộc: Kế hoạch SXKD năm." |
| AC-0136-16 | Dòng nhân sự bước 13, chọn Chỉ huy Nguyễn Văn A | Lưu; ĐXMS tới bước 13 | Công việc bước 13 giao Nguyễn Văn A, không giao cả nhóm Chỉ huy đơn vị đề xuất |
| AC-0136-17 | Không thêm dòng nhân sự nào | Lưu; ĐXMS tới bước 13 | Công việc bước 13 giao nhóm Chỉ huy đơn vị đề xuất theo BR-DXMS-08-01 |
| AC-0136-18 | Dòng nhân sự đã chọn bước 17, chưa chọn người | Bấm \[Lưu\] | Không lưu, inline "Vui lòng chọn Nhân sự thực hiện." tại dòng |
| AC-0136-19 | Tiến trình không khởi tạo được | Bấm \[Lưu\] | Không có ĐXMS; hiện Toast lỗi, giữ dữ liệu |
| AC-0136-20 | Đã có dòng bước 13 | Mở ô Bước ở dòng mới | Không có bước 13 |
| AC-0136-21 | Chọn Mức ưu tiên Thượng khẩn, để trống Lý do ưu tiên | Bấm \[Lưu\] | Không lưu, inline "Vui lòng nhập Lý do ưu tiên." |
| AC-0136-22 | Đã chọn Khẩn, nhập lý do | Đổi về Thường | Ô Lý do ưu tiên ẩn; Lưu xong ĐXMS không có lý do |
| AC-0136-23 | ĐXMS-2026-0040 STOPPED | Bấm \[Sao chép thành ĐXMS mới\], Lưu | Có ĐXMS mới mã khác, Loại Tạo mới, Sao chép từ ĐXMS-2026-0040, ở bước 1; ĐXMS-2026-0040 vẫn Dừng xử lý |
| AC-0136-24 | Mở Sao chép từ ĐXMS có Nhiệm vụ đã ngừng sử dụng | Bấm \[Lưu\] | Không lưu, hiện câu chọn lại tại ô Nhiệm vụ / Đề tài, dự án |
| AC-0136-25 | Mở Sao chép | Bấm \[Hủy\], chọn \[Rời khỏi\] | Không có ĐXMS mới nào được tạo |

#### 3.1.1.3 DTMS_CN_0137 Xem chi tiết ĐXMS

##### 3.1.1.3.1 Thông tin chung chức năng

- **Mục đích:** Xem toàn bộ một ĐXMS trên một màn **Chi tiết đề xuất mua sắm**: thông tin chung, tiến trình, căn cứ, rà soát tồn kho, yêu cầu báo giá, tài liệu và văn bản, nhân sự thực hiện; từ đây tạo ĐXMS điều chỉnh, Sao chép, Hủy ĐXMS.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem (BR-DXMS-01-09).

- **Đường dẫn truy cập:** Danh sách ĐXMS \> Mã ĐXMS hoặc bấm dòng; Việc của tôi \> công việc của ĐXMS (màn xử lý công việc, mục 3.1.1.3.3); link Mã ĐXMS ở các màn khác (Điều chỉnh từ, Lịch sử điều chỉnh, Danh sách yêu cầu báo giá). TĐ không có quyền vào Danh sách nên đi theo Việc của tôi hoặc link.

- **Tiền điều kiện:**

  - ĐXMS còn tồn tại, người dùng được xem.

- **Hậu điều kiện:**

  - Xem: không đổi dữ liệu. Thao tác Điều chỉnh ĐXMS, Sao chép, Hủy ĐXMS, Cập nhật nhân sự theo chức năng được mở.

##### 3.1.1.3.2 Màn hình

<img src="media/rId94.png" style="width:6.25in;height:7.07348in" alt="Chi tiết đề xuất mua sắm" />

Ảnh minh họa bố cục, dữ liệu mẫu, chụp tab Thông tin chung của một ĐXMS Đã phê duyệt có chuỗi điều chỉnh. Khác ảnh: nút theo trạng thái và quyền của người xem (thành phần 1–5); Thông tin chung có Ngày tạo, Mục đích, khối AI; không có Khối đơn vị, Đợt mua sắm, Hình thức trình ký, các trường của Đề tài / dự án; không có nút Cập nhật người xem. Khi khác nhau, áp dụng mục 3.1.1.3.3.

##### 3.1.1.3.3 Mô tả chi tiết các thành phần

**Màn riêng** \[RIÊNG\]: màn chi tiết của đối tượng ĐXMS, đăng ký vào nền tảng là màn chi tiết đối tượng có 7 tab. Tab của nghiệp vụ khác đăng ký vào màn này dưới tên tab (Căn cứ & hạng mục, Rà soát tồn kho, Yêu cầu báo giá); không có tab gắn với mã bước.

Màn có 7 tab, mặc định mở Thông tin chung; đường dẫn có tên tab thì mở tab đó. Mọi tác nhân được vào màn đều thấy đủ 7 tab, chỉ đọc, trừ thao tác cập nhật kết quả rà soát của TT ở tab Rà soát tồn kho (DTMS_CN_0142) và Cập nhật nhân sự ở tab Nhân sự thực hiện (DTMS_CN_0176).

| Tab | Nội dung | Mô tả tại |
|----|----|----|
| Thông tin chung | Thông tin ĐXMS, khối AI, liên kết điều chỉnh, sao chép; card Lịch sử điều chỉnh | Mục này |
| Tiến trình | Thanh các bước, Lịch sử xử lý | Mục này |
| Căn cứ & hạng mục | Căn cứ pháp lý, Thông tin dự án / đề tài | Mục này, DTMS_CN_0140 |
| Rà soát tồn kho | Kết quả, lịch sử rà soát; chỉ xem, trừ thao tác cập nhật của TT (DTMS_CN_0142) | DTMS_CN_0144 |
| Yêu cầu báo giá | Yêu cầu báo giá của ĐXMS, chỉ xem | DTMS_CN_0149 |
| Tài liệu & văn bản | Văn bản đầu ra, Danh sách tài liệu | Mục này, DTMS_CN_0139 |
| Nhân sự thực hiện | Nhân sự theo bước, Lịch sử thay đổi nhân sự | DTMS_CN_0176 |

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Thao tác** |  |  |  |  |
| 1 | \[Điều chỉnh ĐXMS\] | Button | Input | – | Mở DTMS_CN_0172, ô ĐXMS cần điều chỉnh là ĐXMS này, khóa. Hiện với ĐV của đơn vị đề xuất khi ĐXMS ở APPROVED (BR-DXMS-C-03). |
| 2 | \[Sao chép thành ĐXMS mới\] | Button | Input | – | Theo BR-DXMS-01-15: mở DTMS_CN_0136 điền sẵn. Hiện với ĐV của đơn vị đề xuất khi ĐXMS ở STOPPED. |
| 3 | \[Hủy ĐXMS\] | Button | Input | – | Hộp thoại Hủy ĐXMS theo mục 2.3.2. Hiện với Người phụ trách hồ sơ và TT khi ĐXMS ở APPROVING. |
| 4 | \[Xem BPMN\] | Button | Input | – | Mở sơ đồ quy trình của ĐXMS, tô bước đang chạy, đã qua, như xem chi tiết tiến trình thực thi (DTMS_CN_0134). |
| 5 | Nút quay lại | Button | Input | – | Về màn đã mở trước đó. Vào thẳng bằng đường dẫn thì về Danh sách; người không có quyền Danh sách về Việc của tôi (DTMS_CN_0108). |
|  | **Tab Thông tin chung** |  |  |  |  |
| 6 | Mã ĐXMS, Tên ĐXMS, Nhiệm vụ / Đề tài, dự án, Loại, Đơn vị đề xuất, Người tạo, Ngày tạo, Mức ưu tiên, Mật, Giá trị dự kiến, Thời gian thực hiện, Mục đích | Text | Output | Theo dữ liệu | Như DTMS_CN_0136. Ngày tạo dạng DD/MM/YYYY. Không có giá trị thì hiện "-". Mapping: Như DTMS_CN_0136; proposal.created_at. |
| 7 | Lý do ưu tiên | Text | Output | Theo dữ liệu | Hiện khi Mức ưu tiên Khẩn, Thượng khẩn (BR-DXMS-01-16). Mapping: proposal.priority_reason. |
| 8 | Quy trình | Text | Output | Theo dữ liệu | Luồng con theo BR-DXMS-C-05. Mapping: profile.branch, profile.branch_expected. |
| 9 | Khối AI kiểm tra quy tắc bảo mật | Text | Output | Theo dữ liệu | Hiện khi Mật = Có, kết quả đã lưu. Mapping: proposal.ai_security_check. |
| 10 | Giá trị hiệu lực (gồm VAT) | Text | Output | Theo dữ liệu | Của ĐXMS theo BR-DXMS-C-04, kèm đơn vị tỷ đồng. Mapping: profile.total_value khi hồ sơ Hoàn thành, không thì proposal.estimated_value. |
| 11 | Trạng thái | Tag | Output | Theo dữ liệu | Theo mục 2.3.1.1; ĐXMS điều chỉnh kèm lần điều chỉnh. Mapping: proposal.status, proposal.adjust_no. |
| 12 | Ngày cập nhật | Text | Output | Theo dữ liệu | DD/MM/YYYY. Mapping: proposal.updated_at. |
| 13 | Điều chỉnh từ, Lần điều chỉnh, Lý do điều chỉnh | Text, Link | Output | Theo dữ liệu | Chỉ ĐXMS điều chỉnh. Điều chỉnh từ là link Mã ĐXMS căn cứ, mở màn này của ĐXMS đó; người xem không được thấy thì hiện mã, không có link. Mapping: proposal.adjust_from_id, proposal.adjust_no, proposal.adjust_reason. |
| 14 | Đang điều chỉnh bởi / Được điều chỉnh bởi | Link | Output | Theo dữ liệu | Hiện khi ĐXMS ở ADJUSTING (nhãn Đang điều chỉnh bởi) hoặc SUPERSEDED (nhãn Được điều chỉnh bởi): Mã ĐXMS điều chỉnh của nó, quy tắc link như thành phần 13. Mapping: ĐXMS có proposal.adjust_from_id bằng ĐXMS này. |
| 15 | Sao chép từ | Link | Output | Theo dữ liệu | Chỉ ĐXMS tạo bằng Sao chép (BR-DXMS-01-15), quy tắc link như thành phần 13. Mapping: proposal.copy_from_id. |
| 16 | Card Lịch sử điều chỉnh | Data Grid | Output | Theo dữ liệu | Hiện khi chuỗi điều chỉnh có từ hai ĐXMS (BR-DXMS-C-30). Mỗi ĐXMS của chuỗi một dòng, sắp theo lần: Lần ("Gốc" với ĐXMS gốc), Mã ĐXMS (link; dòng của ĐXMS đang xem in đậm, không link), Giá trị (tỷ đồng) theo BR-DXMS-C-04, Lý do điều chỉnh, Ngày tạo, Trạng thái. Dòng của ĐXMS người xem không được thấy theo BR-DXMS-01-09. Không phân trang. Mapping: proposal.root_id, proposal.adjust_no. |
|  | **Tab Tiến trình** |  |  |  |  |
| 17 | Thanh các bước | Text | Output | Theo dữ liệu | Các bước của quy trình đang chạy theo luồng con: bước đã qua, bước đang có công việc mở, bước chưa tới; mỗi bước ghi tên bước, người xử lý, thời điểm hoàn thành. ĐXMS đã kết thúc thì thanh dừng ở bước cuối đã qua kèm "Kết thúc — đã phê duyệt", "Kết thúc theo chỉ đạo khác" hoặc "Kết thúc — đã hủy". Mapping: Theo tiến trình. |
| 18 | Lịch sử xử lý | Data Grid | Output | Theo dữ liệu | Mỗi lần hoàn thành công việc một dòng: Thời điểm, Bước, Người xử lý, Hành động, Ý kiến. Sắp Thời điểm giảm dần. Như lịch sử của Việc của tôi (DTMS_CN_0110). Mapping: Theo nhật ký tiến trình. |
|  | **Tab Căn cứ & hạng mục** |  |  |  |  |
| 19 | Căn cứ pháp lý | Data Grid | Output | Theo dữ liệu | Văn bản căn cứ của ĐXMS: Thao tác (Tải xuống), Tên tài liệu, Loại tài liệu căn cứ, Ngày tạo. Phần xem của DTMS_CN_0140. Mapping: profile_basis.doc_id. |
| 20 | Thông tin dự án / đề tài | Data Grid | Output | Theo dữ liệu | Dòng chi phí của Nhiệm vụ / Đề tài, dự án dùng cho ĐXMS: Mã, Tên dự án / đề tài, Nguồn vốn, Loại chi phí, Khoản mục chi phí, ĐVT, Số lượng đề xuất, Giá trị dự toán, Giá trị dự tính. Chưa có dòng thì hiện "Chưa có dữ liệu". Mapping: Theo dự toán của Nhiệm vụ / Đề tài, dự án. |
|  | **Tab Tài liệu & văn bản** |  |  |  |  |
| 21 | Văn bản đầu ra | Data Grid | Output | Theo dữ liệu | Mỗi văn bản của ĐXMS một dòng, bản hiện hành: Thao tác (Tải văn bản, Tải PDF), Văn bản (bấm xem trước), Bước, Trạng thái, Ký duyệt, Ngày. Trạng thái: Đang làm, Hoàn thành, Đang trình ký, Đã ký (n/n khi nhiều người ký); văn bản phê duyệt là Đang hiệu lực hoặc Đã thay thế theo DTMS_CN_0139. Ký duyệt: Số văn bản (văn bản phê duyệt) và người ký, người đang chờ ký ghi "(đang chờ)". Ngày: lần ký hoặc cập nhật gần nhất. Văn bản phê duyệt đặt lên đầu. Không có cột, hộp thoại phiên bản. Mapping: Theo văn bản của hồ sơ. |
| 22 | Danh sách tài liệu | Data Grid | Output | Theo dữ liệu | Tài liệu tải lên ở các bước: Thao tác (Tải xuống), Tên tài liệu, Bước, Người tải, Ngày tạo. Mapping: Theo tài liệu của hồ sơ. |

Thứ tự hai khối của tab Tài liệu & văn bản: màn xem đặt Văn bản đầu ra trước; màn xử lý công việc đặt Danh sách tài liệu trước vì người xử lý tải tệp lên ở đó.

**Màn xử lý công việc của ĐXMS** \[RIÊNG\]: Việc của tôi mở công việc của ĐXMS trên chính màn này, theo khuôn màn xử lý công việc của nền tảng (DTMS_CN_0110). Tiêu đề "Xử lý đề xuất mua sắm" khi công việc đang chờ, "Xem chi tiết đề xuất mua sắm" khi người dùng đã xử lý xong. Dưới tiêu đề có thanh trạng thái: đỏ "Đang chờ bạn xử lý" kèm tên bước, hạn; xanh "Bạn đã xử lý xong" kèm tên bước, thời điểm. Nút hành động của bước nằm trên hàng tiêu đề, sinh theo luật hiển thị của bước (mục 2.4.3), không đặt cố định trên màn; nút mở eForm của bước theo luật. Tab Thông tin chung của màn xử lý thay bằng phần thông tin của công việc; các tab khác như màn xem. Thành phần 1–3 không hiện trên màn xử lý.

##### 3.1.1.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Mở màn. |
| 2 | Hệ thống kiểm tra quyền, tải dữ liệu. |
| 3 | Người dùng chuyển tab, mở ĐXMS liên quan, tải tài liệu. |
| 4 | Nếu cần: bấm \[Điều chỉnh ĐXMS\], \[Sao chép thành ĐXMS mới\], \[Hủy ĐXMS\] hoặc Cập nhật nhân sự. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| ĐXMS không còn | "ĐXMS không còn tồn tại." Có nút quay lại |
| Không có quyền xem, gồm ĐXMS Mật ngoài phạm vi (BR-DXMS-01-09) | "Bạn không có quyền thực hiện chức năng này." |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Chưa có tài liệu, văn bản | Bảng tương ứng hiện "Chưa có dữ liệu" (mục 4.2) |
| Tải tệp lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |
| Bấm \[Điều chỉnh ĐXMS\] khi ĐXMS vừa có ĐXMS điều chỉnh đang phê duyệt | "ĐXMS đang có ĐXMS điều chỉnh đang phê duyệt." Tải lại màn |

**Đồng thời:** người khác sửa trong lúc xem thì dữ liệu cập nhật ở lần tải sau.

##### 3.1.1.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0137-01 | ĐXMS Đã phê duyệt, giá trị hồ sơ 236,4 tỷ; giá trị dự kiến 200 tỷ | Mở chi tiết | Giá trị hiệu lực 236,4 tỷ, giá trị dự kiến 200 tỷ |
| AC-0137-02 | ĐXMS-2026-0021 điều chỉnh lần 1 từ ĐXMS-2026-0010, đã phê duyệt | Mở chi tiết ĐXMS-2026-0021 | Thông tin chung có Điều chỉnh từ ĐXMS-2026-0010, Lần 1, Lý do; không có khối so sánh trước – sau; card Lịch sử điều chỉnh có hai dòng, dòng ĐXMS-2026-0021 in đậm |
| AC-0137-03 | Người dùng CQ không thuộc danh sách xử lý của ĐXMS | Mở bằng đường dẫn | Không xem được, hiện thông báo không có quyền |
| AC-0137-04 | Mã ĐXMS không tồn tại | Mở bằng đường dẫn | Hiện "ĐXMS không còn tồn tại." |
| AC-0137-05 | ĐXMS vừa tạo, giá trị dự kiến 200 tỷ | Mở chi tiết | Trạng thái Đang phê duyệt, Giá trị hiệu lực 200 tỷ; tab Tiến trình tô bước 1 đang mở |
| AC-0137-06 | Mọi tác nhân được xem | Mở chi tiết | Thấy đủ 7 tab: Thông tin chung, Tiến trình, Căn cứ & hạng mục, Rà soát tồn kho, Yêu cầu báo giá, Tài liệu & văn bản, Nhân sự thực hiện |
| AC-0137-07 | ĐXMS-2026-0010 Đã được điều chỉnh bởi ĐXMS-2026-0021 | Mở chi tiết ĐXMS-2026-0010 | Trạng thái Đã được điều chỉnh; có "Được điều chỉnh bởi ĐXMS-2026-0021"; không có \[Điều chỉnh ĐXMS\]; văn bản phê duyệt ở tab Tài liệu & văn bản là Đã thay thế |
| AC-0137-08 | Người dùng TĐ đang ở công việc của ĐXMS | Mở công việc | Màn Xử lý đề xuất mua sắm, thanh trạng thái đỏ, nút theo luật của bước |
| AC-0137-09 | ĐXMS APPROVED, ĐV của đơn vị đề xuất | Bấm \[Điều chỉnh ĐXMS\] | Mở DTMS_CN_0172, ô ĐXMS cần điều chỉnh là ĐXMS này, khóa |
| AC-0137-10 | ĐXMS STOPPED, ĐV của đơn vị đề xuất | Bấm \[Sao chép thành ĐXMS mới\] | Mở DTMS_CN_0136 điền sẵn Tên, Nhiệm vụ, Đơn vị đề xuất…; Mã để trống; chưa có ĐXMS mới nào được tạo |
| AC-0137-11 | ĐXMS APPROVING | Mở chi tiết | Không có \[Điều chỉnh ĐXMS\], \[Sao chép thành ĐXMS mới\]; TT thấy \[Hủy ĐXMS\] |
| AC-0137-12 | ĐXMS có tờ trình đã ký lại hai lần | Mở tab Tài liệu & văn bản | Tờ trình một dòng, bản hiện hành; không có cột Phiên bản |
| AC-0137-13 | Người dùng đã xử lý xong bước 13 của ĐXMS | Mở công việc đó từ Việc của tôi | Màn Xem chi tiết đề xuất mua sắm, thanh trạng thái xanh "Bạn đã xử lý xong", không có nút hành động |
| AC-0137-14 | Chuỗi gốc ĐXMS-2026-0010 → 0021 → 0035; PG chỉ thuộc danh sách xử lý của ĐXMS-2026-0035 | PG mở chi tiết ĐXMS-2026-0035 | Card Lịch sử điều chỉnh có ba dòng; hai dòng còn lại chỉ có Lần, Trạng thái, Mã không có link |
| AC-0137-15 | ĐXMS sao chép từ ĐXMS-2026-0040 Dừng xử lý | Mở chi tiết | Có "Sao chép từ ĐXMS-2026-0040"; không có card Lịch sử điều chỉnh |
| AC-0137-16 | Mở tab Căn cứ & hạng mục | Xem tab | Chỉ có Căn cứ pháp lý và Thông tin dự án / đề tài |

#### 3.1.1.4 DTMS_CN_0138 Sửa ĐXMS

##### 3.1.1.4.1 Thông tin chung chức năng

- **Mục đích:** Cập nhật thông tin chung của ĐXMS đang phê duyệt.

- **Người dùng mục tiêu:** ĐV thuộc đơn vị đề xuất của ĐXMS, người tạo (BR-DXMS-01-08).

- **Đường dẫn truy cập:** Danh sách ĐXMS \> icon Sửa.

- **Tiền điều kiện:**

  - ĐXMS còn tồn tại, ở APPROVING, người dùng có quyền sửa (BR-DXMS-01-03).

- **Hậu điều kiện:**

  - ĐXMS cập nhật theo BR-DXMS-01-03.

  - Dữ liệu hồ sơ đã sao chép không đổi (BR-DXMS-01-04).

##### 3.1.1.4.2 Màn hình

<img src="media/rId103.png" style="width:6.25in;height:3.34635in" alt="Chỉnh sửa ĐXMS" />

Ảnh chụp ĐXMS ở Đang phê duyệt. Khác ảnh: ô Đơn vị đề xuất, Mật chỉ đọc; không có Danh sách hồ sơ, \[Tạo hồ sơ\], Tài liệu đính kèm; có ô Lý do ưu tiên khi Mức ưu tiên Khẩn, Thượng khẩn. Khi khác nhau, áp dụng mục 3.1.1.4.3.

##### 3.1.1.4.3 Mô tả chi tiết các thành phần

**Màn riêng** \[RIÊNG\]: màn sửa của đối tượng ĐXMS, mở từ màn danh sách; ghi bảng proposal, không phải màn của bước quy trình.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Mã ĐXMS | Textbox khóa | Output | Giá trị đã lưu | Không sửa. Mapping: proposal.code. |
| 2 | Tên ĐXMS \* | Textbox \[500\] | Input | Giá trị đã lưu | Mapping: proposal.title. |
| 3 | Nhiệm vụ / Đề tài, dự án \* | Dropdown, có tìm kiếm | Input | Giá trị đã lưu | Chỉ mục đã phê duyệt. BR-DXMS-01-10. Mapping: proposal.mission_code. |
| 4 | Loại | Textbox khóa | Output | Theo mục đã chọn | Mapping: Theo mission_code. |
| 5 | Đơn vị đề xuất \* | Dropdown, có tìm kiếm | Output | Giá trị đã lưu | Chỉ đọc (BR-DXMS-01-03). BR-DXMS-01-08. Mapping: proposal.unit_id. |
| 6 | Mức ưu tiên \* | Dropdown | Input | Giá trị đã lưu | Thường, Khẩn, Thượng khẩn. Mapping: proposal.priority. |
| 7 | Lý do ưu tiên \* | Textarea \[1000\] | Input | Giá trị đã lưu | Hiện khi Mức ưu tiên Khẩn, Thượng khẩn (BR-DXMS-01-16). Mapping: proposal.priority_reason. |
| 8 | Mật | Dropdown | Output | Giá trị đã lưu | Không, Có. Chỉ đọc (BR-DXMS-01-03); Mật = Có thì hiện khối AI kiểm tra. Mapping: proposal.secret. |
| 9 | Giá trị dự kiến (tỷ đồng) | Số thập phân | Input | Giá trị đã lưu | Như DTMS_CN_0136. Mapping: proposal.estimated_value. |
| 10 | Thời gian thực hiện | Textbox \[255\] | Input | Giá trị đã lưu | Mapping: proposal.period. |
| 11 | Người tạo | Textbox khóa | Output | Giá trị đã lưu | Không sửa. Mapping: proposal.created_by. |
| 12 | Mục đích | Textarea \[2000\] | Input | Giá trị đã lưu | Mapping: proposal.purpose. |
| 13 | Khối AI kiểm tra quy tắc bảo mật | Bảng chỉ đọc | Output | Kết quả đã lưu | Như DTMS_CN_0136. Mapping: proposal.ai_security_check. |
| 14 | \[Lưu\] | Button | Input | – | Kiểm tra, cập nhật, về Danh sách. Chống bấm lặp, mã yêu cầu theo mục 4.6.6. Gửi lại cùng mã không cập nhật lần hai, không báo xung đột: nội dung như lần trước thì báo thành công; nội dung đã đổi thì hiện câu như DTMS_CN_0136, về Danh sách. |
| 15 | \[Hủy\] | Button | Input | – | Không có thay đổi thì về Danh sách. Có thay đổi thì hỏi như DTMS_CN_0136. |
| 16 | Nút quay lại | Icon | Input | – | Như \[Hủy\]. |

##### 3.1.1.4.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Mở màn, tải dữ liệu đã lưu. |
| 2 | Người dùng sửa. |
| 3 | Bấm \[Lưu\]. |
| 4 | Hệ thống kiểm tra như DTMS_CN_0136, kiểm tra lại quyền, phiên bản bản ghi và trạng thái hiện tại. |
| 5 | Cập nhật, ghi nhật ký giá trị cũ và mới. |
| 6 | Hiện Toast, về Danh sách. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** các lỗi nhập như DTMS_CN_0136, và:

| Trường hợp | Nội dung thông báo |
|----|----|
| Thành công | Toast: "Cập nhật ĐXMS thành công." |
| Không tải được dữ liệu khi mở màn | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Lỗi xử lý khi Lưu | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập |
| Timeout, mất kết nối khi Lưu | Không báo thành công, giữ form để thực hiện lại. Bấm \[Lưu\] lại không cập nhật lần hai (mục 4.6.7) |
| Mở màn hoặc Lưu khi ĐXMS đã sang APPROVED | "ĐXMS đã được phê duyệt nên không sửa được thông tin. Vui lòng tạo ĐXMS điều chỉnh." Không lưu, về Chi tiết |
| Mở màn hoặc Lưu khi ĐXMS đã sang STOPPED | "ĐXMS đã dừng xử lý nên không sửa được thông tin." Không lưu, về Chi tiết |
| ĐXMS không còn | "ĐXMS không còn tồn tại." |
| Không có quyền | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** người khác đã lưu sau khi mình mở màn thì không lưu, hiện "Dữ liệu đã được người khác cập nhật, vui lòng tải lại".

##### 3.1.1.4.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0138-01 | ĐXMS ở APPROVING | Sửa Tên, bấm \[Lưu\] | Cập nhật, hiện Toast, Ngày cập nhật đổi; dữ liệu nhật ký có giá trị cũ và mới (kiểm theo mục 6) |
| AC-0138-02 | ĐXMS ở APPROVING, tiến trình đang chạy | Sửa Mục đích, bấm \[Lưu\] | ĐXMS đổi, dữ liệu hồ sơ đã sao chép không đổi |
| AC-0138-03 | ĐXMS ở APPROVED | Mở màn Chỉnh sửa bằng đường dẫn | Không mở được, hiện câu yêu cầu tạo ĐXMS điều chỉnh, về Chi tiết |
| AC-0138-04 | ĐXMS ở ADJUSTING, SUPERSEDED hoặc STOPPED | Xem Danh sách | Không có icon Sửa ở dòng đó |
| AC-0138-05 | Hai người mở cùng ĐXMS, người A đã lưu | Người B bấm \[Lưu\] | Không lưu, hiện câu tải lại |
| AC-0138-06 | Đang sửa, ĐXMS vừa được phê duyệt | Bấm \[Lưu\] | Không lưu, hiện câu yêu cầu tạo ĐXMS điều chỉnh |
| AC-0138-07 | Người thuộc đơn vị khác, không phải người tạo ĐXMS đó | Mở màn Chỉnh sửa bằng đường dẫn | Hiện thông báo không có quyền |
| AC-0138-08 | ĐXMS ở APPROVING, Mức ưu tiên Thường | Đổi sang Khẩn, để trống Lý do ưu tiên, bấm \[Lưu\] | Không lưu, inline "Vui lòng nhập Lý do ưu tiên." |
| AC-0138-09 | ĐXMS ở APPROVING | Mở màn | Ô Đơn vị đề xuất, Mật chỉ đọc, các ô khác sửa được |
| AC-0138-10 | ĐXMS Khẩn có Lý do ưu tiên | Đổi Mức ưu tiên về Thường, bấm \[Lưu\] | Lưu được, ô Lý do ưu tiên ẩn, lý do bị xóa |
| AC-0138-11 | Lần Lưu trước đã vào máy chủ nhưng mất phản hồi | Bấm \[Lưu\] lại | Cập nhật một lần, không hiện câu "người khác cập nhật" |
| AC-0138-13 | ĐXMS ở APPROVING, Đơn vị đề xuất đã ngừng sử dụng | Sửa Mục đích, bấm \[Lưu\] | Lưu được, Đơn vị đề xuất giữ nguyên |
| AC-0138-16 | ĐV A vừa Lưu ĐXMS Mật, ĐV B đang mở màn Sửa, AI ghi kết quả xong | B bấm \[Lưu\] | Lưu được; Ngày cập nhật chỉ đổi theo lần Lưu của người dùng |

#### 3.1.1.5 DTMS_CN_0139 Xem kết quả và văn bản phê duyệt

##### 3.1.1.5.1 Thông tin chung chức năng

- **Mục đích:** Xem văn bản phê duyệt của ĐXMS, và biết văn bản đó còn hiệu lực hay đã được thay bằng văn bản của ĐXMS điều chỉnh.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết đề xuất mua sắm \> tab Tài liệu & văn bản \> khối Văn bản đầu ra, dòng văn bản phê duyệt.

- **Tiền điều kiện:**

  - Được xem ĐXMS.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.1.5.2 Màn hình

Không có ảnh riêng: văn bản phê duyệt là một dòng của khối Văn bản đầu ra (DTMS_CN_0137, ảnh tab Tài liệu & văn bản).

##### 3.1.1.5.3 Mô tả chi tiết các thành phần

**Phần riêng** \[RIÊNG\]: dòng của khối Văn bản đầu ra trong tab Tài liệu & văn bản của màn Chi tiết đề xuất mua sắm; không có màn, tab riêng.

Văn bản phê duyệt là văn bản đã ký ở bước 61 của hồ sơ của ĐXMS. ĐXMS chưa Đã phê duyệt thì không có dòng này. Dòng đặt lên đầu khối.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Văn bản | Text | Output | Theo dữ liệu | Tên văn bản đã ký, không tính lại khi ngưỡng đổi: nhánh từ ngưỡng trở lên là BM-08 Quyết định phê duyệt ĐXMS; nhánh dưới ngưỡng là BM-09 Tờ trình ĐXMS. ĐXMS điều chỉnh theo giá trị sau điều chỉnh. Mapping: Văn bản SIGNED của bước 61. |
| 2 | Bước | Text | Output | Theo dữ liệu | Bước 61. |
| 3 | Trạng thái | Tag | Output | Theo dữ liệu | "Đang hiệu lực" khi ĐXMS là ĐXMS hiệu lực của chuỗi (BR-DXMS-C-30); "Đã thay thế" khi ĐXMS ở SUPERSEDED. Tính trên toàn chuỗi, kể cả ĐXMS người xem không được thấy. Mapping: proposal.status. |
| 4 | Ký duyệt | Text | Output | Theo dữ liệu | "Số {Số văn bản}"; Số văn bản do VOffice trả về, ĐXMS Mật ký bản giấy thì do người xử lý nhập; kèm người ký. Mapping: Kết quả ký. |
| 5 | Ngày | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Ngày ký. Mapping: Kết quả ký. |
| 6 | Giá trị phê duyệt | Text | Output | Theo dữ liệu | Xem ở Giá trị hiệu lực của tab Thông tin chung (DTMS_CN_0137). Mapping: profile.total_value. |
| 7 | Tải văn bản | Icon | Input | – | Tải văn bản đã ký, hoặc bản scan nếu ký bản giấy. Mapping: Tệp văn bản. |

Văn bản phê duyệt của các ĐXMS khác trong chuỗi xem ở chi tiết của ĐXMS đó, mở từ card Lịch sử điều chỉnh.

##### 3.1.1.5.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                       |
|------|-------------------------------------------------------------|
| 1    | Mở tab Tài liệu & văn bản.                                  |
| 2    | Hệ thống tải văn bản đầu ra, đặt văn bản phê duyệt lên đầu. |
| 3    | Người dùng tải văn bản.                                     |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| ĐXMS chưa Đã phê duyệt | Không có dòng văn bản phê duyệt |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Tải tệp lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |

**Đồng thời:** kết quả ký về trong lúc xem thì dòng mới hiện ở lần tải sau.

##### 3.1.1.5.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0139-01 | ĐXMS MS01.01 đã phê duyệt | Mở tab | Dòng đầu BM-08, "Đang hiệu lực", có số và ngày ký |
| AC-0139-02 | ĐXMS MS01.03 đã phê duyệt | Mở tab | Dòng đầu BM-09, không có BM-08 |
| AC-0139-03 | ĐXMS-2026-0010 đã phê duyệt; ĐXMS-2026-0021 điều chỉnh từ nó đã phê duyệt | Mở tab của từng ĐXMS | ĐXMS-2026-0021: "Đang hiệu lực"; ĐXMS-2026-0010: "Đã thay thế" |
| AC-0139-04 | ĐXMS-2026-0021 điều chỉnh đang phê duyệt | Mở tab của ĐXMS-2026-0010 | Văn bản phê duyệt vẫn "Đang hiệu lực"; ĐXMS-2026-0021 chưa có dòng văn bản phê duyệt |
| AC-0139-05 | ĐXMS kết thúc theo Chỉ đạo khác | Mở tab | Không có dòng văn bản phê duyệt |
| AC-0139-06 | Bước 60 đã đồng ý, chưa có kết quả ký ở bước 61 | Mở tab | Chưa có dòng văn bản phê duyệt |
| AC-0139-07 | ĐXMS Mật ký bản giấy, đã nhập số, ngày, bản scan | Mở tab, tải tệp | Có dòng đúng số, ngày; tải được bản scan |
| AC-0139-08 | ĐXMS-2026-0021 điều chỉnh Mật đã phê duyệt; người dùng không thuộc danh sách xử lý của nó | Mở tab của ĐXMS-2026-0010 | Văn bản phê duyệt hiện "Đã thay thế" |

#### 3.1.1.6 DTMS_CN_0176 Cập nhật nhân sự thực hiện

##### 3.1.1.6.1 Thông tin chung chức năng

- **Mục đích:** Xem nhân sự thực hiện theo bước của ĐXMS; thay người hoặc bổ sung người cho bước chưa xong của ĐXMS đang phê duyệt, không phải chuyển từng công việc (BR-DXMS-01-13, BR-DXMS-01-14).

- **Người dùng mục tiêu:** Thao tác: Người phụ trách hồ sơ (ĐV), TT. Xem: mọi người được xem ĐXMS.

- **Đường dẫn truy cập:** Chi tiết đề xuất mua sắm \> tab Nhân sự thực hiện \> \[Cập nhật nhân sự\] hoặc icon Sửa ở dòng bước; Việc của tôi \> công việc của ĐXMS \> \[Cập nhật nhân sự\].

- **Tiền điều kiện:**

  - Xem: được xem ĐXMS (BR-DXMS-01-09).

  - Thao tác: ĐXMS ở APPROVING, người dùng có quyền thao tác.

- **Hậu điều kiện:**

  - Nhân sự của bước đổi; công việc đang mở của bước chuyển hoặc thêm người nhận; có một dòng Lịch sử thay đổi nhân sự.

##### 3.1.1.6.2 Màn hình

<img src="media/rId118.png" style="width:6.25in;height:3.03711in" alt="Tab Nhân sự thực hiện" />

<img src="media/rId121.png" style="width:6.25in;height:3.03711in" alt="Hộp thoại Cập nhật nhân sự" />

Ảnh minh họa bố cục, chụp ở ĐXMS đang phê duyệt. Khác ảnh: bảng Lịch sử thay đổi nhân sự nằm dưới bảng nhân sự trong cùng tab; khối Ảnh hưởng của thay đổi có thêm dòng Văn bản đang trình ký. Khi khác nhau, áp dụng mục 3.1.1.6.3.

##### 3.1.1.6.3 Mô tả chi tiết các thành phần

**Phần riêng** \[RIÊNG\]: tab Nhân sự thực hiện của màn Chi tiết đề xuất mua sắm và hộp thoại Cập nhật nhân sự. Nút \[Cập nhật nhân sự\] trên công việc là hành động loại Khác trong danh mục hành động, hiện theo luật hiển thị của bước, không đóng công việc.

**Tab Nhân sự thực hiện:**

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Nhân sự theo bước** |  |  |  |  |
| 1 | \[Cập nhật nhân sự\] | Button | Input | – | Hiện khi ĐXMS ở APPROVING và người dùng có quyền thao tác. Mở hộp thoại, ô Bước rỗng. |
| 2 | Thao tác | Icon | Input | – | Sửa: mở hộp thoại, Bước đã chọn sẵn. Hiện như \[Cập nhật nhân sự\]; bước Đã xong thì icon vô hiệu, tooltip "Bước đã xong, không cập nhật được nhân sự." |
| 3 | Bước | Text | Output | Theo dữ liệu | Số bước. |
| 4 | Tên công việc | Text | Output | Theo dữ liệu | Tên bước. Tối đa 2 dòng, quá dài hiện tooltip. |
| 5 | Vai trò thực hiện | Text | Output | Theo dữ liệu | Theo mục 2.3.2. |
| 6 | Nhân sự thực hiện | Text | Output | Theo dữ liệu | Họ tên người được chỉ định, nối bằng dấu phẩy. Bước không chỉ định hiện người hoặc nhóm nhận việc theo BR-DXMS-08-01, kèm chữ "(theo vai trò)". Mapping: proposal_member.user_id. |
| 7 | Trạng thái | Tag | Output | Theo dữ liệu | Đang xử lý: bước có công việc đang mở. Đã xong: theo BR-DXMS-01-14. Chưa tới: còn lại. ĐXMS không ở APPROVING thì hiện "-". Mapping: Theo tiến trình. |
|  | **Lịch sử thay đổi nhân sự** |  |  |  |  |
| 8 | Thời điểm, Người thực hiện, Hình thức, Bước, Nhân sự trước → sau, Văn bản căn cứ, Lý do, Công việc đã chuyển | Data Grid | Output | Theo dữ liệu | Hình thức: Thay người, Bổ sung người. Văn bản căn cứ là link tải. Công việc đã chuyển: số công việc đang mở đã đổi người nhận, hoặc "Chưa tới bước". Thời điểm dạng DD/MM/YYYY HH:mm, sắp giảm dần, không phân trang. Mapping: member_log.\*. |

Bảng nhân sự gồm các bước theo BR-DXMS-01-13 của luồng con của ĐXMS; bước không áp dụng cho luồng con đó không hiện; trước cổng sau bước 10 hiện mọi bước. Sắp theo số bước.

**Hộp thoại Cập nhật nhân sự:**

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Bước \* | Dropdown, có tìm kiếm | Input | Bước đã chọn, hoặc rỗng | Hiện "{số bước} · {tên bước} — {Trạng thái}". Chỉ bước chưa Đã xong. Đổi Bước thì xóa người đã chọn. |
| 2 | Vai trò thực hiện, Nhân sự hiện tại | Textbox khóa | Output | Theo bước | Như cột 5, 6 của tab. |
| 3 | Hình thức | Radio | Input | Thay người | Thay người, Bổ sung người. Bổ sung người vô hiệu khi bước chưa chỉ định (BR-DXMS-01-14). Đổi Hình thức thì xóa người đã chọn. |
| 4 | Người bị thay \* | Dropdown nhiều lựa chọn | Input | Rỗng | Hiện khi Thay người ở bước đã chỉ định. Chỉ người trong Nhân sự hiện tại. Bước chưa chỉ định không có ô này: người thay thế thay toàn bộ người nhận theo vai trò. |
| 5 | Người thay thế \* / Người bổ sung \* | Dropdown nhiều lựa chọn, có tìm kiếm | Input | Rỗng | Nhãn theo Hình thức. "{Họ tên} — {Đơn vị}", người đang hoạt động thuộc vai trò của bước, không gồm Nhân sự hiện tại. |
| 6 | Văn bản căn cứ | Upload | Input | Rỗng | Không bắt buộc. Một tệp, định dạng, dung lượng theo mục 4.1. Mapping: member_log.doc_file_id. |
| 7 | Lý do | Textarea \[1000\] | Input | Rỗng | Không bắt buộc. Mapping: member_log.reason. |
| 8 | Ảnh hưởng của thay đổi | Khối chỉ đọc | Output | Theo dữ liệu | Hệ thống tính lại mỗi khi đổi lựa chọn: công việc đang mở của bước, người nhận hiện tại → người nhận sau khi lưu; lần tới bước giao cho; văn bản đang trình ký có người bị thay là người ký, kèm câu "Không tự thu hồi, xử lý tại công việc Xử lý trình ký."; văn bản người bị thay đã ký, kèm "Giữ nguyên". Không có mục nào thì ghi "Không có". |
| 9 | \[Hủy\], \[Lưu\] | Button | Input | – | \[Lưu\] kiểm tra, áp BR-DXMS-01-14, đóng hộp thoại, tải lại tab. \[Hủy\] đóng, không lưu. |

##### 3.1.1.6.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở tab Nhân sự thực hiện hoặc bấm \[Cập nhật nhân sự\] trên công việc. |
| 2 | Chọn Bước, Hình thức, người; tải văn bản căn cứ, nhập lý do nếu có. |
| 3 | Xem khối Ảnh hưởng của thay đổi, bấm \[Lưu\]. |
| 4 | Hệ thống kiểm tra quyền, bước chưa xong, người còn thuộc vai trò. |
| 5 | Áp BR-DXMS-01-14: lưu nhân sự của bước, đổi người nhận các công việc đang mở, ghi Lịch sử thay đổi nhân sự và nhật ký. |
| 6 | Hiện Toast, tải lại tab. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa chọn Bước | Inline: "Vui lòng chọn Bước." |
| Thay người, chưa chọn Người bị thay | Inline: "Vui lòng chọn Người bị thay." |
| Chưa chọn Người thay thế | Inline: "Vui lòng chọn Người thay thế." |
| Bổ sung người, chưa chọn Người bổ sung | Inline: "Vui lòng chọn Người bổ sung." |
| Bước vừa xong khi Lưu | "Bước đã xong, không cập nhật được nhân sự." Không lưu, tải lại tab |
| ĐXMS vừa kết thúc khi Lưu | "ĐXMS đã kết thúc, không cập nhật được nhân sự." Không lưu |
| Người đã chọn không còn thuộc vai trò khi Lưu | Inline: "{Họ tên} không còn thuộc vai trò {Vai trò}, vui lòng chọn lại." |
| Sai định dạng hoặc vượt dung lượng tệp | Inline tại Văn bản căn cứ, theo mục 4.1 |
| Không có quyền | "Bạn không có quyền thực hiện chức năng này." |
| Thành công | Toast: "Cập nhật nhân sự thành công." |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Không đổi nhân sự, không chuyển công việc nào (mục 4.6.7) |

**Đồng thời:** hai người cùng cập nhật một bước thì người sau nhận "Nhân sự của bước vừa được người khác cập nhật. Vui lòng tải lại." và không lưu. Công việc đang mở mà người bị thay đã nhận xử lý thì bỏ nhận, giữ dữ liệu đang nhập dở, rồi giao người mới (BR-DXMS-01-14).

##### 3.1.1.6.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0176-01 | ĐXMS ở bước 13, bước 13 giao nhóm Chỉ huy; TT mở tab | Thay người bước 13 sang Chỉ huy Nguyễn Văn A, \[Lưu\] | Công việc bước 13 đang mở giao Nguyễn Văn A; tab hiện Nguyễn Văn A; có dòng lịch sử Thay người |
| AC-0176-02 | ĐXMS nhánh từ ngưỡng; bước 42 Chưa tới, đã chỉ định Trần Văn C | Bổ sung người Lê Thị B, \[Lưu\] | Lần tới bước 42 công việc giao cho Trần Văn C và Lê Thị B; lịch sử ghi "Chưa tới bước" |
| AC-0176-03 | Bước 4 đã xong, không có công việc đang mở | Mở hộp thoại, mở ô Bước | Không có bước 4; icon Sửa ở dòng bước 4 vô hiệu |
| AC-0176-04 | Thay người, chưa chọn Người thay thế | Bấm \[Lưu\] | Không lưu, inline "Vui lòng chọn Người thay thế." |
| AC-0176-05 | Không tải văn bản căn cứ, không nhập lý do | Thay người, \[Lưu\] | Lưu được |
| AC-0176-06 | Người A đã ký một văn bản của ĐXMS; A được chỉ định ở bước 47 chưa tới | Thay A ở bước 47, \[Lưu\] | Văn bản A đã ký giữ Đã ký; khối Ảnh hưởng ghi "Giữ nguyên" |
| AC-0176-07 | Văn bản đang trình ký có người bị thay là người ký | Mở hộp thoại, chọn người đó | Khối Ảnh hưởng có dòng văn bản đang trình ký, câu "Không tự thu hồi…"; sau Lưu yêu cầu trình ký không đổi |
| AC-0176-08 | CQ được xem ĐXMS | Mở tab Nhân sự thực hiện | Thấy bảng và lịch sử; không có \[Cập nhật nhân sự\], không có icon Sửa |
| AC-0176-09 | ĐXMS Đã phê duyệt | Mở tab | Cột Trạng thái hiện "-", không có \[Cập nhật nhân sự\] |
| AC-0176-10 | Hai TT cùng mở hộp thoại bước 17, người thứ nhất đã Lưu | Người thứ hai bấm \[Lưu\] | Không lưu, hiện "Nhân sự của bước vừa được người khác cập nhật. Vui lòng tải lại." |
| AC-0176-11 | Người phụ trách hồ sơ đang xử lý công việc bước 5 | Bấm \[Cập nhật nhân sự\] trên công việc | Mở hộp thoại; Lưu không đóng công việc bước 5 |
| AC-0176-12 | Đã chỉ định bước 17 cho Trần Văn C; tiến trình quay lại bước 17 sau bước 16 | Công việc bước 17 tạo lại | Giao Trần Văn C |
| AC-0176-13 | Bước 17 chưa chỉ định | Mở hộp thoại, chọn bước 17 | Bổ sung người vô hiệu, chỉ chọn được Thay người |

### 3.1.2 Căn cứ và hạng mục

Xác định văn bản làm căn cứ của hồ sơ, bóc tách thành hạng mục mua sắm và theo dõi phần căn cứ còn dùng được. Văn bản căn cứ chọn khi tạo luồng (BR-DXMS-01-12) và tại bước 1, hạng mục lập tại bước 5 (BR-DXMS-02-07), xem lại tại tab Căn cứ & hạng mục của Chi tiết đề xuất mua sắm.

Quy tắc của nghiệp vụ 3.1.2:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-02-01 | **Văn bản căn cứ thuộc hồ sơ.** Mỗi hồ sơ có ít nhất một văn bản căn cứ. Một hồ sơ được dùng nhiều văn bản khi gộp công việc tương đồng; khi đó mỗi hạng mục liên kết với đúng một dòng của một văn bản, để phân tách được phạm vi theo từng văn bản |
| BR-DXMS-02-02 | **Văn bản dùng được.** Mọi hồ sơ chọn được mọi văn bản đang dùng được của loại đã chọn, vì luồng con chưa xác định khi chọn căn cứ (BR-DXMS-C-05). Thuộc tính Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt của bộ văn bản chỉ dùng để gợi ý ở bước 48 (BR-DXMS-C-07, BR-DXMS-08-08). Khi Xác nhận, hệ thống kiểm tra lại văn bản đúng loại đã chọn. Văn bản sao chép theo BR-DXMS-09-03 hiện sẵn, không xét lại |
| BR-DXMS-02-03 | **Khai báo văn bản căn cứ.** Văn bản chưa có trong hệ thống thì người dùng khai báo: Loại căn cứ, Số văn bản, Ngày ban hành, Trích yếu, Giá trị, Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt, tệp đính kèm. Số văn bản và Ngày ban hành không trùng văn bản người dùng thấy được. Văn bản khai trong hồ sơ Mật chỉ dùng được trong hồ sơ đó; hồ sơ Điều chỉnh của cùng ĐXMS kế thừa theo BR-DXMS-09-03. Người khai báo được sửa, xóa khi chưa hồ sơ nào xác nhận dùng; đã dùng thì không sửa, không xóa |
| BR-DXMS-02-04 | **Phần căn cứ còn dùng được.** Tính theo từng văn bản, đơn vị tỷ đồng. Mỗi ĐXMS tính một lần theo hồ sơ chi phối (BR-DXMS-C-30); hồ sơ Điều chỉnh đang xử lý chưa được tính cho tới khi Hoàn thành. Đã dùng ở ĐXMS khác: tổng Thành tiền theo cơ sở giá của hạng mục đã xác nhận, liên kết văn bản này, trên hồ sơ chi phối của ĐXMS khác. ĐXMS này đang giữ: tổng Thành tiền của hồ sơ đang hiển thị ở tab, để khớp bảng Hạng mục. Chưa có cơ sở giá thì bằng 0. Còn có thể sử dụng = Giá trị − Đã dùng ở ĐXMS khác − ĐXMS này đang giữ; số âm hiện màu đỏ. Hồ sơ làm Còn có thể sử dụng của một văn bản bị âm thì không xác nhận được Báo giá đạt ở bước 10 (BR-DXMS-04-11). Văn bản không có Giá trị thì ba cột hiện "-" |
| BR-DXMS-02-05 | **Phần dòng căn cứ còn dùng được.** Đã dùng: tổng SL đề xuất của hạng mục đã xác nhận ở bước 5, liên kết dòng này, trên hồ sơ chi phối của ĐXMS khác (BR-DXMS-02-04); nháp chưa xác nhận không tính. Còn lại = SL gốc − Đã dùng. SL đề xuất lớn hơn Còn lại thì không xác nhận được bước 5. Mã ĐXMS khác chỉ hiện với người được thấy ĐXMS đó (BR-DXMS-01-09) |
| BR-DXMS-02-06 | **Giải phóng phần đang dùng.** Hồ sơ sang Dừng xử lý, Đã hủy thì phần của hồ sơ không còn tính vào BR-DXMS-02-04, BR-DXMS-02-05. |
| BR-DXMS-02-07 | **Nơi nhập.** Khi tạo luồng chọn văn bản căn cứ đầu vào (BR-DXMS-01-12); bước 1 xác nhận, chọn thêm hoặc khai báo văn bản; hồ sơ Điều chỉnh chọn ở bước 5 (BR-DXMS-09-13). Bước 5 lập hạng mục và liên kết dòng. Chi tiết đề xuất mua sắm chỉ đọc. Hồ sơ quay lại bước 4 rồi tới bước 5 thì sửa tiếp được hạng mục, và tại bước 5 thêm được văn bản, bỏ được văn bản chưa có hạng mục liên kết, theo BR-DXMS-02-02 |
| BR-DXMS-02-08 | **Hạng mục ngoài căn cứ** được lập, chỉ cảnh báo, không chặn. SL gốc, Đã dùng, Còn lại hiện "-" |
| BR-DXMS-02-09 | **Thiếu dữ liệu căn cứ.** Tại bước 5, nút của luật MS01_T05_TRA_LAI (Thiếu thông tin căn cứ) bắt buộc nhập lý do; hệ thống ghi nhận ở bước 6 là Không đủ, hồ sơ về bước 4 kèm lý do (BR-DXMS-C-09) |

#### 3.1.2.1 DTMS_CN_0140 Lựa chọn và kiểm tra căn cứ hình thành ĐXMS

##### 3.1.2.1.1 Thông tin chung chức năng

- **Mục đích:** Chọn văn bản căn cứ của hồ sơ, biết phần còn dùng được để tránh dùng lặp.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 1. Xem: ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Xử lý: Việc của tôi \> công việc bước 1 \> nút của luật MS01_T01_HOAN_THANH (Hoàn thành). Xem: Chi tiết đề xuất mua sắm \> tab Căn cứ & hạng mục.

- **Tiền điều kiện:**

  - Hồ sơ ở bước 1, người dùng được giao công việc.

  - Hoặc được xem ĐXMS.

- **Hậu điều kiện:**

  - Hồ sơ có văn bản căn cứ, tiến trình sang bước 2.

##### 3.1.2.1.2 Màn hình

<img src="media/rId131.png" style="width:6.25in;height:3.51562in" alt="Chọn căn cứ tại bước 1" />

<img src="media/rId134.png" style="width:6.25in;height:3.51562in" alt="Tab Căn cứ và hạng mục" />

\[CẤU HÌNH\] Ảnh thứ nhất minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t01-can-cu và luật nút của bước (mục 2.4), không dựng riêng. Trường theo mục 7.4; khác ảnh: chọn được nhiều văn bản trong bảng lặp của kiểu trường cancu và có \[Khai báo căn cứ\].

\[RIÊNG\] Ảnh thứ hai là tab Căn cứ & hạng mục của màn Chi tiết đề xuất mua sắm; khác ảnh: nút \[Chỉnh sửa\] chỉ hiện với ĐV của đơn vị đề xuất. Khi khác nhau, áp dụng mục 3.1.2.1.3.

##### 3.1.2.1.3 Mô tả chi tiết các thành phần

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 1 | Activity_1 | Người phụ trách hồ sơ (BR-DXMS-08-01); hồ sơ vừa tạo giao người tạo luồng (DTMS_CN_0154) | dtms-ms01-t01-can-cu | MS01_T01_HOAN_THANH (Hoàn thành) | HOAN_THANH; KT-10 (canCu, văn bản theo Loại căn cứ), KT-11 (canCu, văn bản không trùng); HX-01 | Mục 2.4.3, dòng bước 1, 5 | Bước 2 |

Bước 2, 3 sau bước 1 là tác vụ hệ thống trên BPMN, không có màn (DTMS_CN_0161).

**Phần riêng** \[RIÊNG\]:

- Bảng chọn văn bản căn cứ là kiểu trường eForm tùy biến cancu (Chọn văn bản căn cứ), đăng ký vào bộ dựng eForm (mục 2.4.1), dùng ở bước 1 và bước 5 (DTMS_CN_0141) với khóa canCu, và trên màn tạo luồng (BR-DXMS-01-12). Danh sách văn bản lọc theo Loại của dòng và BR-DXMS-02-02, lấy ở máy chủ. Dòng của bảng lặp và quy tắc hiển thị theo mục 7.4; thành phần như bảng dưới.

- Hộp thoại Khai báo căn cứ và thao tác Sửa, Xóa ở bảng tham khảo thuộc kiểu cancu: ghi thẳng vào danh sách văn bản căn cứ dùng chung (basis_doc), không qua bộ xử lý hành động của bước.

- Bảng Căn cứ mua sắm là tab Căn cứ & hạng mục của màn Chi tiết đề xuất mua sắm (DTMS_CN_0137), chỉ đọc.

**Kiểu trường cancu, thành phần** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Văn bản căn cứ, bảng lặp** |  |  |  |  |
| 1 | Loại căn cứ \* | Dropdown | Input | Theo căn cứ đầu vào (BR-DXMS-01-12); không có thì rỗng | Kế hoạch SXKD năm, Phương án kinh doanh, Tờ trình kinh phí, Quyết định nhiệm vụ khoa học công nghệ, Văn bản chỉ đạo khác. Mapping: khóa canCu\[\].loaiCanCu; nguồn basis_doc.type. |
| 2 | Văn bản căn cứ \* | Dropdown, có tìm kiếm | Input | Theo căn cứ đầu vào (BR-DXMS-01-12); không có thì rỗng | Lọc theo Loại căn cứ và BR-DXMS-02-02. Hiện "{Số} — {Trích yếu}". Đổi Loại thì xóa giá trị đã chọn. Mapping: khóa canCu\[\].vanBanId; HX-01 ghi profile_basis.doc_id (mục 2.4.3). |
| 3 | \[Thêm căn cứ\], icon Xóa | Button | Input | – | Thêm, bỏ một dòng. Còn một dòng thì không có icon Xóa. Ở bước 5 không bỏ được văn bản đã có hạng mục liên kết (BR-DXMS-02-07). |
| 4 | \[Khai báo căn cứ\] | Button | Input | – | Mở hộp thoại Khai báo căn cứ. |
|  | **Bảng tham khảo** |  |  |  |  |
| 5 | Số, Ngày, Loại, Trích yếu, Giá trị (tỷ), Còn lại (tỷ), Đã duyệt cấp Tập đoàn, Thao tác | Bảng | Output | Theo dữ liệu | Văn bản theo Loại đang chọn. Còn lại theo BR-DXMS-02-04. Đã duyệt cấp Tập đoàn: Đã duyệt, Chưa duyệt. Thao tác: Sửa, Xóa, hiện với người khai báo khi văn bản chưa được dùng. Mapping: basis_doc.\*. |

Nút \[Hủy\], \[Lưu nháp\], \[Xác nhận\] là nút của hộp thoại eForm (mục 2.4.4), không thuộc kiểu cancu.

**Hộp thoại Khai báo căn cứ** \[RIÊNG\], thuộc kiểu cancu:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Loại căn cứ \* | Dropdown | Input | Rỗng | Như trên. Mapping: basis_doc.type. |
| 2 | Số văn bản \* | Textbox \[100\] | Input | Rỗng | Cùng Ngày ban hành không trùng văn bản người dùng thấy được (BR-DXMS-02-03). Mapping: basis_doc.doc_no. |
| 3 | Ngày ban hành \* | Date picker \[DD/MM/YYYY\] | Input | Rỗng | Không lớn hơn ngày hiện tại. Mapping: basis_doc.issued_at. |
| 4 | Trích yếu \* | Textarea \[1000\] | Input | Rỗng | Mapping: basis_doc.title. |
| 5 | Giá trị (tỷ đồng) | Số thập phân | Input | Rỗng | Như Giá trị dự kiến ở DTMS_CN_0136. Bỏ trống khi văn bản không có giá trị. Mapping: basis_doc.value. |
| 6 | Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt \* | Radio | Input | Không | Có, Không; mặc định Không. Mapping: basis_doc.group_approved. |
| 7 | Tệp đính kèm \* | Upload | Input | Rỗng | Một tệp PDF, DOCX, XLSX; dung lượng, tên tệp theo mục 4.1. Mapping: basis_doc.file_id. |
| 8 | \[Hủy\], \[Lưu\] | Button | Input | – | Lưu xong, văn bản được chọn ở dòng đang nhập. |

**Tab Căn cứ & hạng mục, bảng Căn cứ mua sắm** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | STT | Number | Output | Theo dữ liệu |  |
| 2 | Số văn bản / mã | Text | Output | Theo dữ liệu | Mapping: basis_doc.doc_no. |
| 3 | Ngày ban hành | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Không có thì hiện "-". Mapping: basis_doc.issued_at. |
| 4 | Trích yếu | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: basis_doc.title. |
| 5 | Loại căn cứ | Text | Output | Theo dữ liệu | Mapping: basis_doc.type. |
| 6 | Giá trị căn cứ (tỷ đồng) | Number | Output | Theo dữ liệu | Căn phải, 2 chữ số thập phân. Mapping: basis_doc.value. |
| 7 | Đã dùng ở ĐXMS khác | Number | Output | Theo dữ liệu | BR-DXMS-02-04. Mapping: Tính. |
| 8 | ĐXMS này đang giữ | Number | Output | Theo dữ liệu | BR-DXMS-02-04. Mapping: Tính. |
| 9 | Còn có thể sử dụng | Number | Output | Theo dữ liệu | BR-DXMS-02-04. Mapping: Tính. |

Tiêu đề bảng ghi kèm nguồn dữ liệu của văn bản, là tệp đính kèm. ĐXMS có nhiều hồ sơ thì lấy hồ sơ hiển thị theo BR-DXMS-C-30. Tab không có phân trang, sắp theo thứ tự chọn.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T01_HOAN_THANH (Hoàn thành) | eForm: ít nhất một dòng; mỗi dòng có Loại căn cứ, Văn bản căn cứ. KT-10: văn bản của mỗi dòng thuộc Loại căn cứ đã chọn, xét lại ở máy chủ (BR-DXMS-02-02); văn bản sao chép theo BR-DXMS-09-03 không xét lại. Không đạt: "Văn bản căn cứ không thuộc loại căn cứ đã chọn.", công việc giữ nguyên. KT-11: không có văn bản chọn hai lần: "Văn bản căn cứ đã được chọn." | HX-01 ghi canCu thành văn bản căn cứ của hồ sơ (mục 2.4.3). Hoàn thành công việc, sang bước 2 |

##### 3.1.2.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV bấm nút của luật MS01_T01_HOAN_THANH (Hoàn thành) ở công việc bước 1. |
| 2 | Chọn Loại căn cứ, Văn bản. |
| 3 | Nếu chưa có văn bản: \[Khai báo căn cứ\], nhập, \[Lưu\]. |
| 4 | Bấm \[Xác nhận\]. |
| 5 | Bộ xử lý chạy KT-10, KT-11 (BR-DXMS-02-02), lưu, HX-01 ghi văn bản căn cứ của hồ sơ, ghi nhật ký, hoàn thành công việc. |
| 6 | Tiến trình sang bước 2. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa chọn Loại căn cứ | Inline: "Vui lòng chọn Loại căn cứ." |
| Chưa chọn Văn bản căn cứ | Inline: "Vui lòng chọn Văn bản căn cứ." |
| Văn bản không đúng loại đã chọn | KT-10, inline: "Văn bản căn cứ không thuộc loại căn cứ đã chọn." Công việc giữ nguyên |
| Một văn bản chọn hai lần | eForm báo inline tại dòng sau: "Văn bản căn cứ đã được chọn."; KT-11 kiểm tra lại khi Xác nhận, chặn với cùng câu |
| Không có văn bản của Loại đang chọn | Ô chọn hiện "Chưa có dữ liệu"; vẫn dùng được \[Khai báo căn cứ\] |
| Khai báo trùng Số văn bản, Ngày ban hành | Inline tại Số văn bản: "Văn bản căn cứ đã tồn tại." |
| Sửa, xóa văn bản đã được dùng | "Văn bản căn cứ đã được hồ sơ sử dụng, không sửa hoặc xóa được." Tải lại danh sách |
| Bấm Sửa ở bảng tham khảo | Mở hộp thoại khai báo ở chế độ sửa, tiêu đề "Sửa văn bản căn cứ", trường và kiểm tra như khai báo, giá trị hiện tại điền sẵn; \[Lưu\] thành công: Toast "Cập nhật văn bản căn cứ thành công." |
| Bấm Xóa ở bảng tham khảo | Hộp thoại "Xóa văn bản căn cứ {Số văn bản}?" \[Xóa\] \[Hủy\]; xóa thành công: Toast "Xóa văn bản căn cứ thành công." |
| Lưu khai báo thành công | Toast "Khai báo văn bản căn cứ thành công."; văn bản được chọn sẵn ở dòng đang nhập |
| Bỏ trống trường bắt buộc khi khai báo | Inline: "Vui lòng nhập {Tên trường}." hoặc "Vui lòng chọn {Tên trường}." |
| Sai định dạng hoặc vượt dung lượng tệp | Inline tại Tệp đính kèm, theo mục 4.1; không lưu |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập; công việc chưa hoàn thành (mục 4.6.7) |
| Công việc đã được xử lý hoặc chuyển người | Theo DTMS_CN_0110, không lưu |
| Tab: hồ sơ chưa qua bước 1 | Tại tab: "Hồ sơ chưa xác nhận căn cứ. Căn cứ và hạng mục được xác nhận, bóc tách ở các bước đầu của hồ sơ Phê duyệt ĐXMS." Bảng rỗng hiện "Chưa có dữ liệu" |

**Đồng thời:** hai người khai báo cùng văn bản thì người sau nhận "Văn bản căn cứ đã tồn tại." Số còn lại thay đổi trong lúc xem thì cập nhật ở lần tải sau; bước 5 kiểm tra lại khi Xác nhận.

##### 3.1.2.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0140-01 | Có văn bản Kế hoạch SXKD đã được Tập đoàn duyệt | Mở ô Loại căn cứ ở bước 1 | Có Kế hoạch SXKD năm |
| AC-0140-02 | Hai văn bản loại Phương án kinh doanh: A chưa, B đã được Tập đoàn duyệt | Mở ô Văn bản | Có cả A và B |
| AC-0140-16 | A chưa, B đã được Tập đoàn duyệt | Chọn cả A và B, Xác nhận | Lưu được (BR-DXMS-02-02); bước 48 gợi ý trên cả hai văn bản |
| AC-0140-03 | Đã chọn Loại, Văn bản | Đổi Loại | Ô Văn bản về rỗng, danh sách theo Loại mới |
| AC-0140-04 | Bỏ trống Văn bản | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu inline |
| AC-0140-05 | Chọn hai văn bản khác nhau | Bấm \[Xác nhận\] | Hồ sơ có hai văn bản, tiến trình sang bước 2 |
| AC-0140-06 | Đã có văn bản 123/QĐ ngày 01/02/2026 | Khai báo trùng số và ngày | Không lưu, hiện "Văn bản căn cứ đã tồn tại." |
| AC-0140-07 | Giá trị 100 tỷ; ĐXMS khác dùng 30 tỷ; ĐXMS đang xem giữ 20 tỷ | Mở tab | Đã dùng 30, Đang giữ 20, Còn 50 |
| AC-0140-08 | Hồ sơ của ĐXMS khác chuyển sang Dừng xử lý | Mở lại tab | Đã dùng ở ĐXMS khác giảm phần của hồ sơ đó |
| AC-0140-09 | Văn bản không có Giá trị | Mở tab | Ba cột tính hiện "-" |
| AC-0140-10 | Luồng vừa tạo, hồ sơ chưa qua bước 1 | Mở tab | Hiện câu hồ sơ chưa xác nhận căn cứ |
| AC-0140-11 | TT không thuộc danh sách xử lý của hồ sơ Mật | Mở tab | Không có dòng văn bản, hạng mục của hồ sơ đó (BR-DXMS-01-09) |
| AC-0140-12 | Hồ sơ 200 tỷ, căn cứ duy nhất là Kế hoạch SXKD đã được Tập đoàn duyệt | Tới bước 48 | Hệ thống chọn sẵn Có, vì Kế hoạch SXKD không được tính là văn bản đã được Tập đoàn duyệt (BR-DXMS-C-07) |
| AC-0140-13 | Khai văn bản loại Phương án kinh doanh, Đã được phê duyệt = Không | Bấm \[Lưu\] | Văn bản được lưu và được chọn ở dòng đang nhập; người khai báo sửa được vì chưa dùng |
| AC-0140-14 | ĐXMS khác có hồ sơ Phê duyệt Hoàn thành 30 tỷ, hồ sơ Điều chỉnh Hoàn thành 35 tỷ | Mở tab ở ĐXMS đang xem | Đã dùng ở ĐXMS khác là 35, không phải 65 |
| AC-0140-15 | Giá trị 100, ĐXMS khác đã dùng 120 | Mở tab | Còn có thể sử dụng hiện -20 |
| AC-0140-17 | Luật MS01_T01_HOAN_THANH kích hoạt, Người phụ trách hồ sơ của hồ sơ vừa tạo luồng với một văn bản đầu vào | Mở công việc bước 1 | Có nút của luật; eForm dtms-ms01-t01-can-cu có bảng văn bản căn cứ chọn sẵn văn bản đầu vào |
| AC-0140-18 | Luật MS01_T01_HOAN_THANH; văn bản B chọn ở dòng loại Phương án kinh doanh, người khai báo đổi Loại của B thành Tờ trình kinh phí sau khi form được mở | Bấm nút của luật, \[Xác nhận\] | Bị chặn bởi KT-10: "Văn bản căn cứ không thuộc loại căn cứ đã chọn."; công việc giữ nguyên |

#### 3.1.2.2 DTMS_CN_0141 Quản lý hạng mục ĐXMS và liên kết căn cứ

##### 3.1.2.2.1 Thông tin chung chức năng

- **Mục đích:** Bóc tách nhu cầu thành hạng mục, liên kết từng hạng mục với dòng căn cứ để truy vết và trừ lùi.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 5. Xem: ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Xử lý: Việc của tôi \> công việc bước 5 \> nút của luật MS01_T05_GUI_DUYET (Xác nhận danh mục) hoặc MS01_T05_TRA_LAI (Thiếu thông tin căn cứ). Xem: Chi tiết đề xuất mua sắm \> tab Căn cứ & hạng mục.

- **Tiền điều kiện:**

  - Hồ sơ ở bước 5, người dùng được giao công việc.

  - Hoặc được xem ĐXMS.

- **Hậu điều kiện:**

  - Xác nhận: có danh sách hạng mục, tiến trình sang bước 6. Thiếu thông tin: tiến trình về bước 4.

##### 3.1.2.2.2 Màn hình

<img src="media/rId143.png" style="width:6.25in;height:3.51562in" alt="Bóc tách hạng mục tại bước 5" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t05-boc-tach và luật nút của bước (mục 2.4), không dựng riêng. Trường theo mục 7.4; khác ảnh: hạng mục do người dùng lập trong bảng của kiểu trường hangmuc, có các ô nhập của hạng mục, \[Thêm hạng mục\], icon Xóa; có bảng văn bản căn cứ của kiểu cancu để thêm, bỏ văn bản; tên nút theo luật. Bảng Hạng mục mua sắm của tab Căn cứ & hạng mục xem tại ảnh mục 3.1.2.1.2. Khi khác nhau, áp dụng mục 3.1.2.2.3.

##### 3.1.2.2.3 Mô tả chi tiết các thành phần

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 5 | Activity_5 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t05-boc-tach | MS01_T05_GUI_DUYET (Xác nhận danh mục); MS01_T05_TRA_LAI (Thiếu thông tin căn cứ) | Xác nhận danh mục: GUI_DUYET, biến đặt basisOk = true; KT-10, KT-11 (canCu), KT-11 (bocTach, dòng căn cứ), KT-12 (bocTach, còn lại của dòng căn cứ); HX-01. Thiếu thông tin căn cứ: TRA_LAI, Lý do bắt buộc, biến đặt basisOk = false; HX-12 (thieuThongTin) | Mục 2.4.3, dòng bước 1, 5 và dòng bước 5 | Bước 6 |

**Bước 6** \[CẤU HÌNH\] là cổng trên BPMN, không có màn: basisOk = true thì sang bước 7 (DTMS_CN_0142, DTMS_CN_0143); basisOk = false thì về bước 4, eForm bước 4 hiện lý do đọc từ biến thieuThongTin (BR-DXMS-02-09, DTMS_CN_0161).

**Phần riêng** \[RIÊNG\]:

- Bảng hạng mục là kiểu trường eForm tùy biến hangmuc (Bảng hạng mục liên kết căn cứ), đăng ký vào bộ dựng eForm (mục 2.4.1), khóa bocTach. Kiểu này đọc ở máy chủ các dòng của văn bản trong canCu, hiện Cấu trúc căn cứ, tính Đã dùng, Còn lại theo BR-DXMS-02-05 khi mở form và khi danh sách văn bản đổi. Dòng của bảng lặp theo mục 7.4; thành phần như bảng dưới.

- Văn bản căn cứ dùng kiểu cancu như bước 1 (DTMS_CN_0140), cùng khóa canCu; văn bản đã có hạng mục liên kết không bỏ được (BR-DXMS-02-07).

- Phép tính Còn lại của dòng căn cứ (BR-DXMS-02-05) đăng ký một lần ở máy chủ: hangmuc dùng để hiện, KT-12 dùng để chặn khi Xác nhận.

- Bảng Hạng mục mua sắm là tab Căn cứ & hạng mục của màn Chi tiết đề xuất mua sắm (DTMS_CN_0137), chỉ đọc.

**Kiểu trường hangmuc, thành phần mỗi dòng một hạng mục** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Cấu trúc căn cứ | Text chỉ đọc | Output | Theo dữ liệu | Các văn bản, nhóm và số dòng đã khai báo; ghi kèm tên tệp nguồn. Mapping: Tính. |
| 2 | Tên hạng mục \* | Textbox \[500\] | Input | Rỗng | Mapping: khóa bocTach\[\].name → proposal_item.name. |
| 3 | ĐVT \* | Dropdown, có tìm kiếm | Input | Rỗng | Từ danh mục Đơn vị tính. Mapping: khóa bocTach\[\].uom → proposal_item.uom. |
| 4 | Nhóm \* | Dropdown | Input | Rỗng | Nhóm 1: hàng hóa, dịch vụ mua sẵn. Nhóm 2: hàng hóa sản xuất theo yêu cầu. Mapping: khóa bocTach\[\].nhom → proposal_item.group. |
| 5 | Ngành hàng \* | Dropdown, có tìm kiếm | Input | Rỗng | Từ danh mục Loại hàng hóa, dịch vụ. Dùng để lọc nhà cung cấp ở DTMS_CN_0145. Mapping: khóa bocTach\[\].nganhHang → proposal_item.goods_type. |
| 6 | Dòng căn cứ \* | Dropdown, có tìm kiếm | Input | Rỗng | Dòng của các văn bản đã chọn, có giá trị Ngoài căn cứ và Thêm dòng mới. Hai hạng mục không dùng chung một dòng; Ngoài căn cứ dùng được cho nhiều hạng mục. Mapping: khóa bocTach\[\].dongCanCu → proposal_item.basis_line_id. |
| 7 | Văn bản, Tên nhóm, Tên dòng mới | Dropdown, Textbox tối đa 255 | Input | Rỗng | Bắt buộc khi Thêm dòng mới. Văn bản trong số đã chọn của hồ sơ. Dòng dùng lại được cho ĐXMS sau. Mapping: khóa bocTach\[\].vanBanMoi, bocTach\[\].nhomMoi, bocTach\[\].tenDongMoi → basis_line.\*. |
| 8 | SL gốc | Số không âm, tối đa 3 chữ số thập phân | Input | Rỗng | Bắt buộc khi Thêm dòng mới. Dòng có sẵn thì chỉ đọc. Ngoài căn cứ hiện "-". Mapping: khóa bocTach\[\].bom → basis_line.quantity. |
| 9 | Đã dùng, Còn lại | Number chỉ đọc | Output | Theo dữ liệu | BR-DXMS-02-05. Mapping: Tính. |
| 10 | SL đề xuất \* | Số lớn hơn 0, tối đa 3 chữ số thập phân | Input | Bằng Còn lại | Mặc định bằng Còn lại. Vượt Còn lại thì dòng hiện "Vượt số còn lại". Mapping: khóa bocTach\[\].prop → proposal_item.proposed_qty. |
| 11 | Ghi chú | Text chỉ đọc | Output | Theo dữ liệu | Ngoài căn cứ: "Hạng mục không có trong căn cứ"; đã dùng: "Đã dùng ở {Mã ĐXMS}". Mapping: Tính. |
| 12 | \[Thêm hạng mục\], icon Xóa | Button | Input | – | Thêm, bỏ một dòng; phải còn ít nhất một dòng. |

Nút \[Hủy\], \[Lưu nháp\], \[Xác nhận\] là nút của hộp thoại eForm (mục 2.4.4), như DTMS_CN_0140.

**Tab Căn cứ & hạng mục, bảng Hạng mục mua sắm** \[RIÊNG\]: STT, Hạng mục, ĐVT, Dòng căn cứ ("{Văn bản} › {Nhóm} › {Dòng}" hoặc "Ngoài căn cứ"), SL theo căn cứ, Đã dùng, SL đề xuất, Ghi chú. Chỉ đọc, không phân trang, sắp theo thứ tự nhập. Số lượng căn phải; không có giá trị thì hiện "-". Chưa qua bước 5 thì "Chưa có dữ liệu".

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T05_GUI_DUYET (Xác nhận danh mục) | eForm: ít nhất một hạng mục; trường bắt buộc của dòng; Văn bản, Tên nhóm, Tên dòng mới, SL gốc khi Thêm dòng mới; SL đề xuất lớn hơn 0. KT-10, KT-11 trên canCu như bước 1. KT-11: hai hạng mục không cùng một dòng căn cứ, trừ Ngoài căn cứ và Thêm dòng mới: "Dòng căn cứ đã được dùng cho hạng mục khác." KT-12: SL đề xuất không lớn hơn Còn lại của dòng tính lại tại lúc Xác nhận: "SL đề xuất vượt số còn lại của dòng căn cứ." | HX-01 ghi canCu thành văn bản căn cứ của hồ sơ; dòng Thêm dòng mới thành dòng căn cứ của văn bản đã chọn; bocTach thành hạng mục của hồ sơ kèm thời điểm xác nhận (mục 2.4.3). Biến đặt basisOk = true. Hoàn thành công việc, sang bước 6 |
| MS01_T05_TRA_LAI (Thiếu thông tin căn cứ) | Lý do bắt buộc, hộp thoại Lý do của nền tảng, tối đa 2000 ký tự (BR-DXMS-02-09) | HX-12 ghi lý do, người, thời điểm vào biến thieuThongTin. Biến đặt basisOk = false. Hạng mục đã lưu nháp giữ trong dữ liệu form của bước, không ghi thành hạng mục của hồ sơ, không tính vào phần đã dùng (BR-DXMS-02-05). Hoàn thành công việc, bước 6 về bước 4 |

##### 3.1.2.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV bấm nút của luật MS01_T05_GUI_DUYET (Xác nhận danh mục). |
| 2 | Lập hạng mục, chọn dòng hoặc thêm dòng mới, nhập SL đề xuất. |
| 3 | Bấm \[Xác nhận\]. |
| 4 | Bộ xử lý chạy KT-10, KT-11, KT-12, tính lại Còn lại tại thời điểm xác nhận. |
| 5 | Lưu, HX-01 ghi văn bản căn cứ, dòng căn cứ mới, hạng mục của hồ sơ, ghi nhật ký, hoàn thành công việc. |
| 6 | Bước 6 đối chiếu; đủ thì sang bước 7. |

**Luồng Thiếu thông tin:**

| Bước | Mô tả |
|----|----|
| 1 | Bấm nút của luật MS01_T05_TRA_LAI (Thiếu thông tin căn cứ). |
| 2 | Nhập Lý do, tối đa 2000 ký tự. |
| 3 | Xác nhận. |
| 4 | HX-12 ghi lý do vào biến thieuThongTin. Hạng mục đã nhập được giữ dạng nháp trong dữ liệu form của bước, không tính vào phần đã dùng. |
| 5 | Bước 6 là Không đủ, tiến trình về bước 4 kèm lý do. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bỏ trống trường bắt buộc | Inline: "Vui lòng nhập {Tên trường}." hoặc "Vui lòng chọn {Tên trường}." |
| SL đề xuất nhỏ hơn hoặc bằng 0, sai định dạng | Inline: "SL đề xuất không hợp lệ." |
| Vượt Còn lại khi Xác nhận | KT-12, inline tại dòng: "SL đề xuất vượt số còn lại của dòng căn cứ." Không hoàn thành, công việc giữ nguyên |
| Hai hạng mục cùng một dòng căn cứ | eForm báo inline tại dòng sau: "Dòng căn cứ đã được dùng cho hạng mục khác."; KT-11 kiểm tra lại khi Xác nhận, chặn với cùng câu |
| Không còn hạng mục nào | Inline: "ĐXMS phải có ít nhất một hạng mục." |
| Có hạng mục Ngoài căn cứ | eForm hiện cảnh báo trên dòng, vẫn xác nhận được |
| Bỏ trống Lý do | Inline: "Vui lòng nhập Lý do." |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập; công việc chưa hoàn thành (mục 4.6.7) |

**Đồng thời:** hai hồ sơ cùng xác nhận một dòng căn cứ thì hồ sơ sau được tính trên Còn lại mới; vượt thì nhận câu vượt số còn lại.

##### 3.1.2.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0141-01 | Dòng SL gốc 24, ĐXMS khác đã dùng 4 | Mở hộp thoại | Đã dùng 4, Còn lại 20, SL đề xuất mặc định 20 |
| AC-0141-02 | Còn lại 20 | Nhập 21, bấm \[Xác nhận\] | Không hoàn thành, hiện câu vượt tại dòng |
| AC-0141-03 | Hai hạng mục cùng chọn Ngoài căn cứ | Bấm \[Xác nhận\] | Hoàn thành được; SL gốc, Đã dùng, Còn lại hiện "-" |
| AC-0141-04 | Chọn Thêm dòng mới, SL gốc 10, SL đề xuất 6 | Xác nhận rồi mở hồ sơ của ĐXMS khác cùng văn bản | Dòng có trong danh sách, Đã dùng 6, Còn lại 4 |
| AC-0141-05 | Xóa hết hạng mục | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu phải có hạng mục |
| AC-0141-06 | Luật MS01_T05_TRA_LAI kích hoạt, công việc bước 5 | Bấm nút của luật (Thiếu thông tin căn cứ), bỏ trống Lý do | Hiện câu inline, chưa chuyển bước |
| AC-0141-07 | Đã nhập Lý do | Xác nhận | Tiến trình về bước 4, người xử lý thấy lý do; hạng mục đã nhập còn khi tới lại bước 5 |
| AC-0141-08 | Hai hồ sơ cùng dòng còn 10, hồ sơ A vừa xác nhận 8 | Hồ sơ B xác nhận 5 | B nhận câu vượt, không hoàn thành |
| AC-0141-09 | Hồ sơ của ĐXMS khác đã dùng dòng, vừa sang Dừng xử lý | Mở hộp thoại ở hồ sơ đang xử lý | Còn lại tăng tương ứng |
| AC-0141-10 | Hồ sơ dùng hai văn bản A, B; Thêm dòng mới chọn văn bản B | Xác nhận, mở bảng Hạng mục | Dòng ghi đúng văn bản B |
| AC-0141-11 | Hồ sơ A có nháp SL 8 trên dòng còn 10, chưa xác nhận | Hồ sơ B xác nhận 5 | B hoàn thành được |
| AC-0141-12 | Hồ sơ về bước 4 vì thiếu văn bản, tới lại bước 5 | \[Thêm căn cứ\], chọn văn bản C | Dòng của C chọn được cho hạng mục |
| AC-0141-13 | Luật MS01_T05_GUI_DUYET; dữ liệu gửi lên có hai hạng mục cùng dòng căn cứ X (không qua kiểm tra của eForm) | Thực thi hành động của luật | Bị chặn bởi KT-11: "Dòng căn cứ đã được dùng cho hạng mục khác."; công việc giữ nguyên, không ghi hạng mục |
| AC-0141-14 | Luật MS01_T05_GUI_DUYET và MS01_T05_TRA_LAI kích hoạt, Người phụ trách hồ sơ | Mở công việc bước 5 | Có hai nút của hai luật; eForm dtms-ms01-t05-boc-tach có bảng văn bản căn cứ và bảng hạng mục |

### 3.1.3 Rà soát tồn kho

Xác định số lượng dùng được từ kho, chốt phần còn phải mua làm đầu vào cho yêu cầu báo giá. Dữ liệu tồn kho từ phân hệ Quản lý tài sản (QLTS), chốt tại bước 7, xem lại tại tab Rà soát tồn kho.

Quy tắc của nghiệp vụ 3.1.3:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-03-01 | **Kết quả rà soát hai lần.** Lần 1 sổ sách: Tồn sổ sách, Đang giữ cho ĐXMS khác. Lần 2 thực tế: Số đủ điều kiện xuất kho, Chất lượng. Mỗi lần có thời điểm, người cập nhật. Bước 7 chỉ hoàn thành được khi đã có kết quả lần 2. Hồ sơ tới bước 7, hệ thống tạo công việc Rà soát tồn kho trong Việc của tôi, giao nhóm TT, ngày hết hạn của công việc theo tham số Hạn Rà soát tồn kho (mục 2.3.6, mặc định 7 NLV); mốc sổ sách (mặc định 3 NLV) chỉ để cảnh báo, mở tab Rà soát tồn kho để cập nhật (DTMS_CN_0142); công việc hoàn thành khi có kết quả lần 2. Thành viên nhóm thuộc danh sách xử lý của hồ sơ (BR-DXMS-01-09); công việc này không thêm bước vào quy trình |
| BR-DXMS-03-02 | **Tồn khả dụng** = Số đủ điều kiện xuất kho − Đang giữ cho ĐXMS khác, không nhỏ hơn 0. Đang giữ tính theo Mã hàng trong kho, gồm Đang tạm giữ và Đã chốt sử dụng của hồ sơ thuộc ĐXMS khác; phần của chính ĐXMS không bị trừ. ĐXMS có hồ sơ Điều chỉnh đã xác nhận bước 7 thì phần ĐXMS đó đang giữ, theo từng Mã hàng, là số lớn hơn giữa Đã chốt sử dụng của hồ sơ căn cứ và Đang tạm giữ của hồ sơ Điều chỉnh, không cộng dồn (BR-DXMS-09-09). Hạng mục không có Mã hàng trong kho (dịch vụ, hạng mục không quản lý tồn) hiện "-" ở các cột tồn, không nhập Dùng từ kho |
| BR-DXMS-03-03 | **Dùng từ kho** từ 0 đến giá trị nhỏ hơn giữa Tồn khả dụng và SL đề xuất; mặc định bằng giá trị lớn nhất đó. **Còn phải mua** = SL đề xuất − Dùng từ kho |
| BR-DXMS-03-04 | **Tồn kho bằng 0** không phải thiếu dữ liệu: bước 7 vẫn hoàn thành, Dùng từ kho bằng 0 (BR-DXMS-C-09) |
| BR-DXMS-03-05 | **Tạm giữ.** Xác nhận bước 7 thì số Dùng từ kho chuyển sang Đang tạm giữ và không tính vào Tồn khả dụng của ĐXMS khác. Hồ sơ Hoàn thành: Đã chốt sử dụng. Hồ sơ Dừng xử lý, Đã hủy: Đã giải phóng. Hồ sơ Điều chỉnh Hoàn thành: phần Đã chốt sử dụng của hồ sơ căn cứ sang Đã giải phóng (BR-DXMS-09-09). Mã ĐXMS khác chỉ hiện với người được thấy ĐXMS đó, ở mọi màn (BR-DXMS-01-09) |
| BR-DXMS-03-06 | **Không cần mua.** Mọi hạng mục có Còn phải mua bằng 0 thì không xác nhận được bước 7. Người dùng giảm Dùng từ kho, hoặc Hủy hồ sơ theo BR-DXMS-C-28 |
| BR-DXMS-03-07 | **Lưu bản rà soát.** Mỗi lần xác nhận bước 7 lưu một bản có mã RSTK-YYYY-NNNN, không sửa. Bản Hiện hành: bản của hồ sơ hiển thị (BR-DXMS-C-30) nếu hồ sơ đó đã xác nhận bước 7; không có thì bản mới nhất. Các bản khác là Bản cũ. Hồ sơ Điều chỉnh rà soát lại, không dùng lại kết quả của hồ sơ trước (BR-DXMS-C-26) |

#### 3.1.3.1 DTMS_CN_0142 Lấy dữ liệu tồn kho từ phân hệ QLTS

##### 3.1.3.1.1 Thông tin chung chức năng

- **Mục đích:** Có số liệu tồn kho theo hạng mục để đơn vị đề xuất chốt ở bước 7.

- **Người dùng mục tiêu:** Cập nhật: TT. Xem: ĐV, CH. Hệ thống gọi QLTS khi có tích hợp.

- **Đường dẫn truy cập:** Việc của tôi \> công việc Rà soát tồn kho; hoặc Chi tiết đề xuất mua sắm \> tab Rà soát tồn kho \> \[Cập nhật kết quả rà soát\].

- **Tiền điều kiện:**

  - Hồ sơ đã qua bước 6, đang ở bước 7.

- **Hậu điều kiện:**

  - Hồ sơ có kết quả rà soát lần 1, lần 2 (BR-DXMS-03-01).

##### 3.1.3.1.2 Màn hình

\[RIÊNG\] Chưa có màn tương ứng. Bố cục theo khuôn hộp thoại nhập bảng của hệ thống; số liệu xem lại tại ảnh mục 3.1.3.3.2.

##### 3.1.3.1.3 Mô tả chi tiết các thành phần

**Nơi đăng ký** \[RIÊNG\]: chức năng không phải bước quy trình, không có eForm, luật nút. Gồm ba phần:

- Tác vụ hệ thống trên BPMN, chạy khi cổng bước 6 sang bước 7 (DTMS_CN_0161): tạo bản rà soát của hồ sơ, tạo công việc Rà soát tồn kho cho nhóm TT, gửi thông báo; khi có tích hợp QLTS thì gửi yêu cầu theo hạng mục và ghi Tồn sổ sách nhận về.

- Công việc Rà soát tồn kho: công việc trong Việc của tôi không gắn bước BPMN, không có eForm và luật nút, mở tab Rà soát tồn kho; hạn theo tham số Hạn Rà soát tồn kho; hoàn thành khi có kết quả lần 2 (BR-DXMS-03-01). Dùng năng lực tạo công việc ngoài bước của nền tảng, như công việc Xử lý trình ký (YC-NT-03).

- Hộp thoại Cập nhật kết quả rà soát: thao tác của tab Rà soát tồn kho trên màn Chi tiết đề xuất mua sắm (DTMS_CN_0137, tab ở DTMS_CN_0144), ghi thẳng bản rà soát (stock_review, stock_review_line), không qua bộ xử lý hành động của bước. Bước 7 đọc số liệu qua kiểu trường tonkho (DTMS_CN_0143).

**Hộp thoại Cập nhật kết quả rà soát** \[RIÊNG\]: nút \[Cập nhật kết quả rà soát\] trên tab chỉ hiện với TT khi hồ sơ ở bước 7. Hộp thoại gồm:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Lần rà soát \* | Radio | Input | Rỗng | Sổ sách, Thực tế. Thực tế chỉ chọn được khi đã có Sổ sách. Mapping: stock_review.phase. |
| 2 | Hạng mục, ĐVT, SL đề xuất | Text chỉ đọc | Output | Theo dữ liệu | Theo hạng mục của hồ sơ. Ô số liệu của dòng khóa khi Mã hàng trong kho còn trống. Mapping: proposal_item.\*. |
| 3 | Mã hàng trong kho | Textbox \[50\] | Input | Rỗng | TT nhập theo QLTS; bỏ trống là không quản lý tồn, dòng hiện "-". Khi có tích hợp thì chọn từ QLTS. Mapping: stock_review_line.item_code. |
| 4 | Tồn sổ sách | Số không âm | Input | Rỗng | Bắt buộc khi Sổ sách và có Mã hàng. Mapping: stock_review_line.book_qty. |
| 5 | Đang giữ cho ĐXMS khác | Number chỉ đọc | Output | Theo dữ liệu | Hệ thống tính theo BR-DXMS-03-02; hiện kèm Mã ĐXMS theo BR-DXMS-03-05. Mapping: Tính. |
| 6 | Số đủ điều kiện xuất kho | Số không âm | Input | Rỗng | Bắt buộc khi Thực tế và có Mã hàng. Không lớn hơn Tồn sổ sách. Mapping: stock_review_line.actual_qty. |
| 7 | Chất lượng | Textbox \[500\] | Input | Rỗng | Mapping: stock_review_line.quality. |
| 8 | Tệp kết quả \* | Upload | Input | Rỗng | Theo quy tắc tải tệp của hệ thống; đưa vào Tài liệu đính kèm của hồ sơ. Mapping: stock_review.file_id. |
| 9 | \[Hủy\], \[Lưu\] | Button | Input | – | Lưu ghi đè lần rà soát đang chọn và ghi nhật ký, cho tới khi bước 7 được xác nhận. |

##### 3.1.3.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Hồ sơ tới bước 7, hệ thống tạo công việc Rà soát tồn kho cho nhóm TT và thông báo. |
| 2 | TT nhập Sổ sách, \[Lưu\]. |
| 3 | TT, ĐV kiểm đếm. |
| 4 | TT nhập Thực tế, \[Lưu\]. |
| 5 | Hệ thống thông báo ĐV đã có kết quả. |

**Khi có tích hợp QLTS:** ở bước 6, hệ thống gửi yêu cầu theo hạng mục, nhận Tồn sổ sách; TT chỉ còn nhập phần Thực tế. Chi tiết tích hợp ghi theo điểm giao tiếp ở mục 2.2.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bỏ trống trường bắt buộc | Inline: "Vui lòng nhập {Tên trường}." |
| Số đủ điều kiện lớn hơn Tồn sổ sách | Inline: "Số đủ điều kiện xuất kho không được lớn hơn Tồn sổ sách." |
| Chọn Thực tế khi chưa có Sổ sách | Lựa chọn bị vô hiệu |
| Bước 7 đã được xác nhận | Không còn nút; gửi trực tiếp thì nhận "Kết quả rà soát đã được chốt, không cập nhật được." |
| Không có quyền | "Bạn không có quyền thực hiện chức năng này." |
| QLTS lỗi, không phản hồi | Bước 7 hiện Lỗi tích hợp; TT nhập được cả Sổ sách. Hồ sơ giữ nguyên bước |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập (mục 4.6.7) |

**Đồng thời:** ĐV đang xác nhận bước 7 mà TT lưu lại thì việc xác nhận kiểm tra theo số mới nhất (DTMS_CN_0143).

##### 3.1.3.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0142-01 | Hồ sơ vừa tới bước 7 | Hệ thống xử lý | Nhóm TT nhận thông báo, thấy nút \[Cập nhật kết quả rà soát\], kể cả khi hồ sơ Mật |
| AC-0142-02 | Chưa có Sổ sách | Mở hộp thoại | Không chọn được Thực tế |
| AC-0142-03 | Tồn sổ sách 8 | Nhập Số đủ điều kiện 9, \[Lưu\] | Không lưu, hiện câu inline |
| AC-0142-04 | Hồ sơ không Mật khác đang giữ 2 của cùng Mã hàng trong kho | Mở hộp thoại | Đang giữ 2, kèm Mã ĐXMS đó |
| AC-0142-05 | ĐV của đơn vị đề xuất | Mở tab | Không có nút cập nhật |
| AC-0142-06 | Bước 7 đã xác nhận | TT gửi cập nhật trực tiếp | Không lưu, hiện câu đã chốt |
| AC-0142-07 | Đã có Sổ sách, chưa có Thực tế | ĐV xác nhận bước 7 | Không hoàn thành (AC-0143-05) |

#### 3.1.3.2 DTMS_CN_0143 Rà soát và chốt nhu cầu mua sau sử dụng tồn kho

##### 3.1.3.2.1 Thông tin chung chức năng

- **Mục đích:** Chốt số dùng từ kho, số còn phải mua.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 7. Xem: CH, TT.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 7 \> nút của luật MS01_T07_HOAN_THANH (Hoàn thành).

- **Tiền điều kiện:**

  - Hồ sơ ở bước 7, người dùng được giao công việc.

- **Hậu điều kiện:**

  - Có bản rà soát, số Dùng từ kho được tạm giữ, tiến trình sang bước 8.

##### 3.1.3.2.2 Màn hình

<img src="media/rId159.png" style="width:6.25in;height:3.51562in" alt="Chốt rà soát tồn kho tại bước 7" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t07-ra-soat-ton-kho và luật nút của bước (mục 2.4), không dựng riêng. Trường theo mục 7.4; khác ảnh: nút của luật MS01_T07_HOAN_THANH luôn hiện, chưa đủ hai lần rà soát thì bị chặn khi bấm (KT-13); dòng hiện thêm Số đủ điều kiện xuất kho, Chất lượng; hạng mục tồn bằng 0 vẫn có ô Dùng từ kho, giá trị 0, chỉ đọc.

##### 3.1.3.2.3 Mô tả chi tiết các thành phần

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 7 | Activity_7 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t07-ra-soat-ton-kho | MS01_T07_HOAN_THANH (Hoàn thành) | HOAN_THANH; KT-13 (đã có kết quả thực tế), KT-12 (ruaSoatKho, giới hạn Dùng từ kho), KT-14 (ruaSoatKho, còn hạng mục phải mua); HX-01, HX-13 | Mục 2.4.3, dòng bước 7 | Bước 8 |

Tác vụ hệ thống khi hồ sơ tới bước 7, công việc Rà soát tồn kho của nhóm TT và cập nhật kết quả rà soát: DTMS_CN_0142. Bước 7 không có nhánh trả lại trên BPMN.

**Phần riêng** \[RIÊNG\]:

- Bảng chốt dùng từ kho là kiểu trường eForm tùy biến tonkho (Bảng chốt dùng từ kho), đăng ký vào bộ dựng eForm (mục 2.4.1), khóa ruaSoatKho. Khi mở form, kiểu này đọc ở máy chủ bản rà soát mới nhất của hồ sơ (DTMS_CN_0142), mỗi dòng một hạng mục; tính Đang giữ, Tồn khả dụng theo BR-DXMS-03-02, giới hạn và giá trị mặc định của Dùng từ kho theo BR-DXMS-03-03; SL mua tính ngay khi nhập. Dòng của bảng lặp theo mục 7.4; thành phần như bảng dưới.

- Phép tính giới hạn Dùng từ kho (giá trị nhỏ hơn giữa Tồn khả dụng và SL đề xuất) đăng ký một lần ở máy chủ: tonkho dùng để hiện, KT-12 dùng để chặn khi Xác nhận.

- Chốt bản rà soát là hậu xử lý HX-13 (mục 2.5.3), gắn với luật MS01_T07_HOAN_THANH.

**Kiểu trường tonkho, thành phần** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Dòng trạng thái | Text | Output | Theo dữ liệu | "Kết quả rà soát tồn kho: {Chưa có kết quả, Đã có kết quả sổ sách, Đã có kết quả thực tế, Lỗi tích hợp} · {Mã} · {ngày}". Mapping: stock_review.\*. |
| 2 | Tên hạng mục, SL đề xuất | Text chỉ đọc | Output | Theo dữ liệu | Mapping: proposal_item.\*. |
| 3 | Tồn sổ sách, Đang giữ, Số đủ điều kiện, Tồn khả dụng | Number chỉ đọc | Output | Theo dữ liệu | BR-DXMS-03-01, BR-DXMS-03-02. Đang giữ kèm Mã ĐXMS. Mapping: stock_review_line.\*, Tính. |
| 4 | Chất lượng | Text chỉ đọc | Output | Theo dữ liệu | Mapping: stock_review_line.quality. |
| 5 | Dùng từ kho | Số không âm | Input | Rỗng | Bắt buộc khi Tồn khả dụng lớn hơn 0. BR-DXMS-03-03. Tồn khả dụng bằng 0 thì giá trị 0, chỉ đọc. Không quản lý tồn thì không hiện. Mapping: khóa ruaSoatKho\[\].fromStock → stock_review_line.use_qty. |
| 6 | SL mua | Number chỉ đọc | Output | Theo dữ liệu | BR-DXMS-03-03, tính ngay khi nhập. Mapping: Tính. |

Nút \[Hủy\], \[Lưu nháp\], \[Xác nhận\] là nút của hộp thoại eForm (mục 2.4.4), như DTMS_CN_0140.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T07_HOAN_THANH (Hoàn thành) | eForm: Dùng từ kho hợp lệ ở mọi dòng có Tồn khả dụng lớn hơn 0. KT-13: bản rà soát của hồ sơ đã có kết quả thực tế (BR-DXMS-03-01): "Chưa có kết quả rà soát thực tế, chưa hoàn thành được." KT-12: Dùng từ kho của mỗi dòng không lớn hơn giới hạn tính lại theo số mới nhất: "Dùng từ kho không được lớn hơn {giá trị}." KT-14: ít nhất một hạng mục có SL mua lớn hơn 0 (BR-DXMS-03-06): "Toàn bộ nhu cầu được đáp ứng từ kho. Vui lòng giảm số dùng từ kho hoặc hủy hồ sơ." Không đạt thì công việc giữ nguyên, chưa tạm giữ | HX-01 ghi Dùng từ kho của ruaSoatKho vào dòng rà soát (mục 2.4.3); HX-13 chốt bản rà soát: sinh mã RSTK-YYYY-NNNN, ghi thời điểm xác nhận và Đang giữ cho ĐXMS khác tại lúc xác nhận, chuyển Dùng từ kho sang Đang tạm giữ (BR-DXMS-03-05, BR-DXMS-03-07), hoàn thành công việc Rà soát tồn kho nếu còn. Hoàn thành công việc, sang bước 8; hạng mục có SL mua bằng 0 không đưa vào yêu cầu báo giá |

##### 3.1.3.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV bấm nút của luật MS01_T07_HOAN_THANH (Hoàn thành). |
| 2 | Xem kết quả, nhập Dùng từ kho. |
| 3 | Bấm \[Xác nhận\]. |
| 4 | Bộ xử lý chạy KT-13 (BR-DXMS-03-01), KT-12 (BR-DXMS-03-03), KT-14 (BR-DXMS-03-06) theo số mới nhất. |
| 5 | HX-01 ghi Dùng từ kho, HX-13 lưu bản, tạm giữ; ghi nhật ký. |
| 6 | Tiến trình sang bước 8; hạng mục có SL mua bằng 0 không đưa vào yêu cầu báo giá. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có kết quả lần 2 | eForm hiện trạng thái; nút của luật vẫn hiện, bấm rồi \[Xác nhận\] thì KT-13 chặn: "Chưa có kết quả rà soát thực tế, chưa hoàn thành được." Công việc giữ nguyên |
| Dùng từ kho vượt giới hạn | eForm báo inline tại dòng; KT-12 kiểm tra lại khi Xác nhận: "Dùng từ kho không được lớn hơn {giá trị}." |
| Dùng từ kho sai định dạng, bỏ trống | Inline: "Dùng từ kho không hợp lệ." |
| Mọi hạng mục có SL mua bằng 0 | KT-14: "Toàn bộ nhu cầu được đáp ứng từ kho. Vui lòng giảm số dùng từ kho hoặc hủy hồ sơ." Không hoàn thành |
| Tồn khả dụng giảm khi Xác nhận | KT-12 tính theo số mới nhất, hiện câu vượt giới hạn tại dòng, không hoàn thành; eForm tải lại số mới |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập; chưa tạm giữ (mục 4.6.7) |

**Đồng thời:** hai hồ sơ cùng giữ một mã hàng thì hồ sơ xác nhận sau tính trên Tồn khả dụng đã trừ hồ sơ trước.

##### 3.1.3.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0143-01 | SL đề xuất 40, đủ điều kiện 8, đang giữ 2 | Mở hộp thoại | Tồn khả dụng 6, Dùng từ kho mặc định 6, SL mua 34 |
| AC-0143-02 | Như trên | Nhập Dùng từ kho 7, \[Xác nhận\] | Không hoàn thành, hiện "Dùng từ kho không được lớn hơn 6." |
| AC-0143-03 | Hạng mục tồn bằng 0 | Mở hộp thoại, \[Xác nhận\] | Dùng từ kho 0 khóa, SL mua bằng SL đề xuất, hoàn thành được |
| AC-0143-04 | Hạng mục không quản lý tồn | Mở hộp thoại | Cột tồn hiện "-", SL mua bằng SL đề xuất |
| AC-0143-05 | Chưa có kết quả lần 2 | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu chưa có kết quả |
| AC-0143-06 | Mọi hạng mục dùng hết từ kho | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu toàn bộ nhu cầu |
| AC-0143-07 | Hồ sơ B vừa giữ 3 của cùng Mã hàng trong kho, Tồn khả dụng hồ sơ A còn 3 | Hồ sơ A xác nhận 6 | Không hoàn thành, hiện giới hạn 3 |
| AC-0143-08 | Xác nhận thành công, có hạng mục SL mua 0 | Sang bước 8 | Hạng mục đó không có trong yêu cầu báo giá |
| AC-0143-09 | Xác nhận Dùng từ kho 6, ĐXMS không Mật | Mở hồ sơ khác cùng Mã hàng trong kho | Đang giữ thêm 6 kèm Mã ĐXMS này |
| AC-0143-10 | Hồ sơ đang giữ, chuyển Dừng xử lý | Mở hồ sơ khác | Tồn khả dụng tăng lại 6; tab ghi Đã giải phóng |
| AC-0143-11 | Hồ sơ đang giữ 6, chuyển Hoàn thành | Mở hồ sơ của ĐXMS khác | Đang giữ vẫn tính 6; Tồn khả dụng không tăng |
| AC-0143-12 | Hồ sơ Phê duyệt Hoàn thành đã chốt 6; hồ sơ Điều chỉnh của cùng ĐXMS rà soát lại | Mở hộp thoại | 6 không bị trừ vào Tồn khả dụng |
| AC-0143-13 | Luật MS01_T07_HOAN_THANH kích hoạt; bản rà soát mới có kết quả sổ sách | ĐV mở bước 7, bấm nút của luật, \[Xác nhận\] | Nút hiện như mọi lúc; bị chặn bởi KT-13: "Chưa có kết quả rà soát thực tế, chưa hoàn thành được."; công việc giữ nguyên, chưa tạm giữ |
| AC-0143-14 | Luật MS01_T07_HOAN_THANH; mọi hạng mục có Dùng từ kho bằng SL đề xuất | Bấm nút của luật, \[Xác nhận\] | Bị chặn bởi KT-14: "Toàn bộ nhu cầu được đáp ứng từ kho. Vui lòng giảm số dùng từ kho hoặc hủy hồ sơ."; không sinh mã bản rà soát |

#### 3.1.3.3 DTMS_CN_0144 Xem lịch sử rà soát tồn kho

##### 3.1.3.3.1 Thông tin chung chức năng

- **Mục đích:** Xem kết quả hiện hành và các bản rà soát trước, phân biệt kết quả cũ và mới khi điều chỉnh.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết đề xuất mua sắm \> tab Rà soát tồn kho.

- **Tiền điều kiện:**

  - Được xem ĐXMS.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.3.3.2 Màn hình

<img src="media/rId168.png" style="width:6.25in;height:3.51562in" alt="Tab Rà soát tồn kho" />

Ảnh minh họa bố cục. Khác ảnh: có thêm cột Số đủ điều kiện, Chất lượng; TT ở bước 7 có \[Cập nhật kết quả rà soát\]; nút \[Chỉnh sửa\] chỉ hiện với ĐV của đơn vị đề xuất.

##### 3.1.3.3.3 Mô tả chi tiết các thành phần

**Nơi đăng ký** \[RIÊNG\]: tab Rà soát tồn kho của màn Chi tiết đề xuất mua sắm (DTMS_CN_0137); không phải bước quy trình, không có eForm, luật nút. Thao tác \[Cập nhật kết quả rà soát\] của tab theo DTMS_CN_0142.

**Bảng Kết quả rà soát tồn kho** \[RIÊNG\]: theo bản Hiện hành mà người xem được thấy (BR-DXMS-01-09). Tiêu đề ghi Mã, ngày lấy số liệu. Chỉ đọc, không phân trang, sắp theo thứ tự hạng mục.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | STT, Hạng mục, ĐVT, SL đề xuất | Text | Output | Theo dữ liệu | Mapping: proposal_item.\*. |
| 2 | Tồn sổ sách, Số đủ điều kiện, Chất lượng | Text | Output | Theo dữ liệu | Không quản lý tồn thì hiện "-". Mapping: stock_review_line.\*. |
| 3 | Đang giữ cho ĐXMS khác | Text | Output | Theo dữ liệu | "{Số} — {Mã ĐXMS}"; ĐXMS người xem không được thấy thì chỉ hiện số. Không có thì "-". Mapping: Tính. |
| 4 | Tồn khả dụng | Text | Output | Theo dữ liệu | BR-DXMS-03-02. Mapping: Tính. |
| 5 | Chốt dùng từ kho | Text | Output | Theo dữ liệu | Mapping: stock_review_line.use_qty. |
| 6 | Tạm giữ | Text | Output | Theo dữ liệu | Tag theo BR-DXMS-03-05; Dùng từ kho bằng 0 thì "-". Mapping: Tính. |
| 7 | Còn phải mua | Text | Output | Theo dữ liệu | In đậm. Mapping: Tính. |

**Bảng Lịch sử rà soát tồn kho** \[RIÊNG\]: sắp theo Thời điểm giảm dần, không phân trang, lọc theo BR-DXMS-01-09.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | STT | Text | Output | Theo dữ liệu |  |
| 2 | Mã kết quả | Text | Output | Theo dữ liệu | RSTK-YYYY-NNNN, bấm mở số liệu của bản đó ở bảng trên. Mapping: stock_review.code. |
| 3 | Thời điểm | Text | Output | Theo dữ liệu | DD/MM/YYYY HH:mm, lúc xác nhận bước 7. Mapping: stock_review.confirmed_at. |
| 4 | Hồ sơ | Text | Output | Theo dữ liệu | Link mở DTMS_CN_0155. Mapping: stock_review.profile_id. |
| 5 | Nội dung | Text | Output | Theo dữ liệu | "Rà soát lần đầu (hồ sơ Phê duyệt ĐXMS)", "Rà soát lại khi điều chỉnh ĐXMS", "Rà soát lại ở hồ sơ mới sau khi dừng". Mapping: Tính. |
| 6 | Hiệu lực | Text | Output | Theo dữ liệu | Tag Hiện hành, Bản cũ. Mapping: Tính. |

##### 3.1.3.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                |
|------|--------------------------------------|
| 1    | Mở tab.                              |
| 2    | Hệ thống tải bản hiện hành, lịch sử. |
| 3    | Người dùng mở bản cũ hoặc mở hồ sơ.  |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có kết quả | Tại tab: "Chưa có kết quả rà soát tồn kho. Dữ liệu tồn kho được cập nhật sau khi hồ sơ bóc tách căn cứ." |
| Đang xem bản cũ | Tiêu đề ghi "Bản cũ", có link về bản hiện hành |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Mọi bản bị ẩn theo BR-DXMS-01-09 | Tại tab: "Chưa có dữ liệu" |

**Đồng thời:** bản mới xác nhận trong lúc xem thì hiện ở lần tải sau.

##### 3.1.3.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0144-01 | Hồ sơ Phê duyệt đã xác nhận bước 7 | Mở tab | Có bảng số liệu; lịch sử một dòng Hiện hành |
| AC-0144-02 | Hồ sơ Điều chỉnh vừa xác nhận bước rà soát | Mở tab | Lịch sử hai dòng; dòng điều chỉnh Hiện hành, dòng trước Bản cũ; bảng số liệu theo bản mới |
| AC-0144-03 | Như trên | Bấm Mã bản cũ | Bảng hiện số liệu bản cũ, tiêu đề ghi "Bản cũ" |
| AC-0144-04 | Hồ sơ đang xử lý, Dùng từ kho 6 | Mở tab | Tạm giữ: Đang tạm giữ |
| AC-0144-05 | Hồ sơ Hoàn thành | Mở tab | Tạm giữ: Đã chốt sử dụng |
| AC-0144-06 | Hồ sơ chưa qua bước 7 | Mở tab | Hiện câu chưa có kết quả |
| AC-0144-07 | Hàng đang giữ cho ĐXMS Mật ngoài phạm vi xem của người dùng | Mở tab | Chỉ hiện số, không có Mã ĐXMS |
| AC-0144-08 | Hồ sơ Điều chỉnh đã xác nhận rà soát, rồi Dừng xử lý | Mở tab | Bản của hồ sơ Hoàn thành trước đó là Hiện hành; bản của hồ sơ dừng là Bản cũ, ghi Đã giải phóng |

### 3.1.4 Yêu cầu báo giá trong ĐXMS

Lập yêu cầu báo giá từ phần còn phải mua, gửi nhà cung cấp, ghi nhận báo giá, xác lập cơ sở giá và tổng giá trị ĐXMS. Thực hiện tại bước 8, 9, 10; xem lại tại tab Yêu cầu báo giá.

Quy tắc của nghiệp vụ 3.1.4:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-04-01 | **Một yêu cầu cho mỗi lần gửi.** Mỗi lần chạy bước 9 sinh một yêu cầu báo giá, mã YCBG-{YYYY-NNNN của Mã ĐXMS}-{LL}. LL là lần gửi, hai chữ số, tăng liên tục theo ĐXMS qua mọi hồ sơ, nên không trùng khi có hồ sơ mới. Yêu cầu đã gửi không sửa |
| BR-DXMS-04-02 | **Hạng mục yêu cầu** là các hạng mục có Còn phải mua lớn hơn 0 của bản rà soát hiện hành, chia theo Nhóm 1, Nhóm 2. Số lượng không sửa ở bước 8; cần đổi thì xử lý theo nghiệp vụ tương ứng trước khi sang bước 8. Mỗi nhóm có hạng mục phải có tài liệu kỹ thuật: Nhóm 1 chỉ tiêu kỹ thuật; Nhóm 2 bảng bóc tách khối lượng và danh mục vật tư, linh kiện |
| BR-DXMS-04-03 | **Chọn nhà cung cấp.** Danh sách lấy từ danh mục Nhà cung cấp, đang Hoạt động, có ngành hàng trùng ngành hàng của hạng mục. Đang bị cấm: không chọn được, vẫn hiện ở bảng Tình trạng. Hạn chế: chọn được. Phải có ít nhất một nhà cung cấp, tính cả nhà cung cấp mới. Nhà cung cấp đưa vào bằng Mã số thuế (BR-DXMS-04-04) hoặc từ tệp (DTMS_CN_0146) không xét ngành hàng, chỉ cảnh báo |
| BR-DXMS-04-04 | **Nhà cung cấp mới.** Người dùng nhập Tên, Mã số thuế, Email, Ngành hàng; khi Xác nhận, hệ thống thêm vào danh mục ở trạng thái Hoạt động, ghi nguồn là mã hồ sơ, rồi gửi yêu cầu. Mã nhà cung cấp do hệ thống sinh; Phân loại mặc định Trong nước; Mã số thuế bắt buộc. Mã số thuế đã có: nhà cung cấp đó đang hoạt động, không bị cấm thì hệ thống dùng nhà cung cấp đã có, thông báo tại dòng, không đổi danh mục; đang bị cấm, dừng hoạt động thì báo lỗi |
| BR-DXMS-04-05 | **Hạn trả lời** bắt buộc, không nhỏ hơn ngày gửi. Mặc định: có Nhóm 2 là ngày gửi cộng 7 ngày; chỉ Nhóm 1 là ngày gửi cộng 5 ngày; tính cả thứ Bảy, Chủ nhật, không tính ngày lễ, Tết theo lịch nghỉ của hệ thống. Công việc bước 10 có hạn bằng Hạn trả lời |
| BR-DXMS-04-06 | **Gửi yêu cầu (bước 9).** Hệ thống gửi email thay TTMS tới Email nhận yêu cầu của từng nhà cung cấp, kèm phiếu yêu cầu theo mẫu BM-YCBG (hạng mục, số lượng, Hạn trả lời, Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác, Đầu mối tiếp nhận báo giá) và tài liệu kỹ thuật. Gửi lỗi với một nhà cung cấp thì dòng đó ghi Gửi lỗi, không chặn nhà cung cấp khác, hồ sơ vẫn sang bước 10. Không có cổng nhà cung cấp, người dùng tải tệp báo giá lên |
| BR-DXMS-04-07 | **Hồ sơ Mật** (Mật trên hồ sơ hoặc trên ĐXMS là Có) không gửi email từ hệ thống, vì quy trình không có bước duyệt gửi qua email. Bước 9 chỉ sinh yêu cầu, Kênh gửi ghi "Ngoài hệ thống", đơn vị đề xuất tự gửi bản giấy, tiến trình vẫn sang bước 10 |
| BR-DXMS-04-08 | **Trạng thái yêu cầu.** Đang chờ báo giá WAITING: đã gửi, chưa ghi nhận báo giá nào. Đã nhận báo giá RECEIVED: có ít nhất một báo giá. Báo giá đạt PASSED, Báo giá không đạt FAILED: kết quả bước 10 theo BR-DXMS-04-12. Đã hủy CANCELED: hồ sơ sang Dừng xử lý, Đã hủy khi yêu cầu chưa có kết quả. |
| BR-DXMS-04-09 | **Báo giá của nhà cung cấp** gồm tệp, Ngày báo giá, Hiệu lực đến, Loại tiền, Tỷ giá, Đơn giá báo theo hạng mục tính bằng Loại tiền. Đơn giá quy đổi (tỷ đồng) = Đơn giá báo × Tỷ giá ÷ 1.000.000.000; VNĐ có Tỷ giá bằng 1. AI đọc tệp, gợi ý các trường; người dùng kiểm tra, sửa, xác nhận (BR-DXMS-C-08). Hệ thống lưu cả giá trị AI gợi ý và giá trị người dùng chốt. Báo giá có Hiệu lực đến nhỏ hơn ngày Xác nhận là hết hiệu lực, không dùng để tính |
| BR-DXMS-04-10 | **Cơ sở giá của hạng mục.** Mặc định là Đơn giá quy đổi thấp nhất trong các báo giá còn hiệu lực, gồm VAT. Người dùng được chọn báo giá khác, bắt buộc ghi lý do. Thành tiền = Đơn giá quy đổi × Còn phải mua. Tổng giá trị theo cơ sở giá = tổng Thành tiền; là giá trị của hồ sơ, dùng cho BR-DXMS-C-01, BR-DXMS-C-06, BR-DXMS-02-04. Hệ thống lưu và tính trên số đầy đủ, chỉ làm tròn khi hiển thị: đơn giá 3, Thành tiền và Tổng 2 chữ số thập phân |
| BR-DXMS-04-11 | **Điều kiện Báo giá đạt.** Mỗi hạng mục có ít nhất một báo giá còn hiệu lực. Mỗi nhà cung cấp nhận yêu cầu có tệp báo giá, hoặc được đánh dấu Không phản hồi. Với mỗi văn bản căn cứ có Giá trị và có hạng mục liên kết: Giá trị − Đã dùng ở ĐXMS khác − tổng Thành tiền theo cơ sở giá đang chọn của các hạng mục liên kết văn bản đó không âm (BR-DXMS-02-04). Điều kiện này áp cả khi chọn Vẫn đạt (BR-DXMS-04-12) |
| BR-DXMS-04-12 | **Kết quả bước 10.** Người dùng bấm nút của luật MS01_T10_XAC_NHAN (Báo giá đạt) và AI không kết luận Không đạt: yêu cầu là PASSED, hồ sơ sang cổng giá trị. Người dùng bấm nút của luật MS01_T10_TRA_LAI (Không đạt — gửi lại YCBG): yêu cầu là FAILED, về bước 9 với nội dung của eForm gửi lại. AI kiểm tra đơn giá, Ngày báo giá, Hiệu lực đến người dùng chốt có khớp tệp không. Người dùng bấm đạt mà AI kết luận Không đạt: không lưu kết quả, hồ sơ ở lại bước 10, eForm hiện lý do của AI; người dùng sửa dữ liệu rồi bấm lại, hoặc chọn nút của luật MS01_T10_TRA_LAI. Từ lần AI Không đạt thứ hai liên tiếp có thêm lựa chọn Vẫn đạt, Lý do bắt buộc, tối đa 2000 ký tự: yêu cầu là PASSED, lý do ghi nhật ký và hiện cho Chỉ huy đơn vị ở bước 13. Hệ thống không tự gửi lại yêu cầu. AI lỗi thì theo lựa chọn của người dùng |

#### 3.1.4.1 DTMS_CN_0145 Lập yêu cầu báo giá và chọn nhà cung cấp

##### 3.1.4.1.1 Thông tin chung chức năng

- **Mục đích:** Lập yêu cầu báo giá từ phần còn phải mua và chọn nhà cung cấp nhận.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 8. Bước 9: hệ thống. Xem: CH, TT.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 8 \> nút của luật MS01_T08_HOAN_THANH (Hoàn thành).

- **Tiền điều kiện:**

  - Hồ sơ ở bước 8, người dùng được giao công việc.

- **Hậu điều kiện:**

  - Có yêu cầu báo giá WAITING, đã gửi theo BR-DXMS-04-06 hoặc BR-DXMS-04-07, tiến trình sang bước 10.

##### 3.1.4.1.2 Màn hình

<img src="media/rId178.png" style="width:6.25in;height:3.51562in" alt="Lập yêu cầu báo giá tại bước 8" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t08-ycbg và luật nút của bước (mục 2.4), không dựng riêng. Ảnh là phần đầu của eForm; bên dưới là bảng Tình trạng, Nhà cung cấp mới, Hạn trả lời, Điều khoản trên phiếu, bảng Đối soát. Trường và thứ tự theo mục 7.4; khác ảnh: có ô Tài liệu kỹ thuật theo nhóm; hạng mục chỉ đọc, lấy từ bản rà soát (BR-DXMS-04-02).

##### 3.1.4.1.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 8 | ĐV xem hạng mục còn phải mua theo Nhóm 1, Nhóm 2, tải tài liệu kỹ thuật theo nhóm, chọn nhà cung cấp, thêm nhà cung cấp mới nếu cần, đặt Hạn trả lời và điều khoản trên phiếu, xem đối soát ĐXMS |
| 9 | Tác vụ hệ thống sinh yêu cầu báo giá, gửi email thay TTMS cho từng nhà cung cấp (BR-DXMS-04-06), hoặc chỉ sinh yêu cầu với Kênh gửi "Ngoài hệ thống" khi hồ sơ Mật (BR-DXMS-04-07); tiến trình sang bước 10 |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 8 | Activity_8 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t08-ycbg | MS01_T08_HOAN_THANH (Hoàn thành) | HOAN_THANH; KT-01 (nccSel, danh mục Nhà cung cấp), KT-15 (nccMoi, Mã số thuế), KT-08 (hanTraLoi); HX-15 (hanTraLoi), HX-14 (nccMoi) | Mục 2.4.3, dòng bước 8, 10 (nccMoi) và dòng bước 9 | Bước 9 |

**Bước 9** \[CẤU HÌNH\] là tác vụ hệ thống trên BPMN, không có màn: chạy tác vụ Sinh và gửi yêu cầu báo giá (phần riêng bên dưới), xong thì sang bước 10. Bước 9 chạy lại mỗi khi bước 10 đi theo luật MS01_T10_TRA_LAI (DTMS_CN_0148). Hạn của công việc bước 10 bằng hanTraLoi (BR-DXMS-04-05), khai ở cấu hình hạn của công việc trên BPMN.

**Dữ liệu chỉ xem của eForm** (mục 2.4.3): ycbgNhom1, ycbgNhom2 là hạng mục Nhóm 1, Nhóm 2 có Còn phải mua lớn hơn 0 của bản rà soát hiện hành (BR-DXMS-04-02), mỗi dòng gồm STT, Hàng hóa / dịch vụ, SL mua, Ngành hàng; doiSoatDxms, doiSoatGiaTri là kết quả đối soát ĐXMS; bốn biến này do hệ thống ghi khi bản rà soát tồn kho được xác nhận (DTMS_CN_0143). hanTraLoiMacDinh là Hạn trả lời mặc định theo BR-DXMS-04-05, do HX-15 ghi: ở luật hoàn thành bước rà soát tồn kho cho bước 8, ở tác vụ bước 9 cho lần gửi lại. lanGuiYcbg do tác vụ bước 9 ghi, rỗng ở bước 8; eForm dùng biến này để hiện các trường của lần gửi lại khi được mở từ luật MS01_T10_TRA_LAI.

**Phần riêng** \[RIÊNG\]:

- Trường Nhà cung cấp nhận YCBG đăng ký là kiểu trường eForm tùy biến nhacungcap (mục 2.4.1), khóa nccSel, tham số: hạng mục ycbgNhom1, ycbgNhom2; bảng nhà cung cấp mới nccMoi; cho phép nhập từ tệp. Trường đọc danh mục Nhà cung cấp ở máy chủ theo BR-DXMS-04-03: đang Hoạt động, có ngành hàng trùng ngành hàng của hạng mục, hiện "{Mã} — {Tên}"; đang bị cấm thì không có ô chọn, vẫn hiện ở bảng Tình trạng nhà cung cấp; hạn chế thì chọn được. Kèm bảng Tình trạng nhà cung cấp (Mã, Tên, Email nhận YCBG, Ngành hàng, Tình trạng: Bình thường, Cấm đến {ngày}, Hạn chế) và nút \[Nhập từ tệp\] (DTMS_CN_0146). Mã số thuế ở dòng nccMoi được tra danh mục khi nhập: trùng nhà cung cấp dùng được thì hiện tại dòng "Đã có nhà cung cấp {Mã} — {Tên}, yêu cầu sẽ gửi cho nhà cung cấp này."

- Tác vụ Sinh và gửi yêu cầu báo giá (bước 9) đăng ký là tác vụ hệ thống trên BPMN. Đọc biến ycbgNhom1, ycbgNhom2, taiLieuKyThuatNhom1, taiLieuKyThuatNhom2, nccNhan (danh sách nhà cung cấp cuối do HX-14 ghi, gồm nhà cung cấp mới), hanTraLoi, dkThanhToan, diaDiemGiao, yeuCauKhac, dauMoiBg, secret, dxmsMat. Ghi quotation (code theo BR-DXMS-04-01, round, status = WAITING, channel, sent_at, due_date, tech_file_ids, payment_terms, delivery_place, other_requirements, contact_user_id), quotation_item (proposal_item_id, buy_qty), quotation_vendor (vendor_id, send_status, send_error). Sinh phiếu theo mẫu BM-YCBG (hạng mục, số lượng, Hạn trả lời, Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác, Đầu mối tiếp nhận báo giá; Đầu mối ghi Họ tên, Số điện thoại, Email theo hồ sơ người dùng). Hồ sơ không Mật: gửi email thay TTMS tới Email nhận YCBG của từng nhà cung cấp, kèm phiếu và tài liệu kỹ thuật; gửi lỗi với một nhà cung cấp thì dòng đó FAILED kèm nội dung lỗi, không chặn nhà cung cấp khác (BR-DXMS-04-06). Hồ sơ Mật (secret hoặc dxmsMat là Có): không gửi email, channel = OUTSIDE, mọi dòng OUTSIDE (BR-DXMS-04-07). Ghi biến cho bước 10: lanGuiYcbg, maYcbg, baoGia (một dòng cho mỗi nhà cung cấp nhận yêu cầu, kèm Tình trạng gửi và một dòng đơn giá cho mỗi hạng mục), hanTraLoiMacDinh cho lần gửi lại. Ghi nhật ký "đã gửi".

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T08_HOAN_THANH (Hoàn thành) | eForm: có ít nhất một nhà cung cấp, tính cả nhà cung cấp mới ("Vui lòng chọn ít nhất một nhà cung cấp."); nhóm có hạng mục có Tài liệu kỹ thuật ("Vui lòng tải lên tài liệu kỹ thuật của {nhóm}."); Hạn trả lời có giá trị; dòng nhà cung cấp mới đủ Tên, Mã số thuế, Email đúng định dạng, Ngành hàng. KT-01: nhà cung cấp đã chọn còn Hoạt động, không bị cấm. KT-15: Mã số thuế của nhà cung cấp mới không thuộc nhà cung cấp đang bị cấm, dừng hoạt động. KT-08: Hạn trả lời không nhỏ hơn ngày gửi | HX-15 tính lại hanTraLoi theo ngày gửi khi người dùng giữ giá trị mặc định (BR-DXMS-04-05). HX-14 thêm nhà cung cấp mới vào danh mục ở trạng thái Hoạt động, Mã do hệ thống sinh, Phân loại Trong nước, nguồn là mã hồ sơ; Mã số thuế đã có của nhà cung cấp dùng được thì dùng nhà cung cấp đó, không đổi danh mục (BR-DXMS-04-04); ghi nccNhan. Dòng Không khớp của đối soát chỉ cảnh báo, không chặn. Ghi nhật ký, hoàn thành công việc, sang bước 9 |

##### 3.1.4.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV bấm nút của luật MS01_T08_HOAN_THANH (Hoàn thành). |
| 2 | Chọn nhà cung cấp, thêm nhà cung cấp mới nếu cần, tải tài liệu, đặt hạn. |
| 3 | Bấm \[Xác nhận\]. |
| 4 | Hệ thống kiểm tra (KT-01, KT-15, KT-08), thêm nhà cung cấp mới (HX-14), ghi nhật ký, hoàn thành công việc. |
| 5 | Bước 9 sinh yêu cầu, gửi email. |
| 6 | Tiến trình sang bước 10. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa chọn nhà cung cấp | Inline: "Vui lòng chọn ít nhất một nhà cung cấp." |
| Không có nhà cung cấp phù hợp | Checklist hiện "Chưa có dữ liệu"; vẫn thêm được nhà cung cấp mới |
| Nhà cung cấp đã chọn vừa bị cấm, dừng hoạt động khi Xác nhận | KT-01, inline: "Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại." Không hoàn thành, công việc giữ nguyên |
| Thiếu tài liệu kỹ thuật | Inline: "Vui lòng tải lên tài liệu kỹ thuật của {nhóm}." |
| Bỏ trống Hạn, Hạn nhỏ hơn ngày gửi | Inline: "Vui lòng chọn Hạn trả lời." (eForm) hoặc KT-08: "Hạn trả lời không được nhỏ hơn ngày gửi." |
| Email nhà cung cấp mới sai định dạng | Inline: "Email không hợp lệ." |
| Trùng Mã số thuế của nhà cung cấp dùng được | Thông báo tại dòng khi nhập (nhacungcap): "Đã có nhà cung cấp {Mã} — {Tên}, yêu cầu sẽ gửi cho nhà cung cấp này." Vẫn hoàn thành được; HX-14 dùng nhà cung cấp đã có |
| Trùng Mã số thuế của nhà cung cấp bị cấm, dừng hoạt động | KT-15, inline tại dòng: "Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại." Công việc giữ nguyên |
| Thiếu Ngành hàng của nhà cung cấp mới | Inline: "Vui lòng chọn Ngành hàng." |
| Bản rà soát có Còn phải mua đều bằng 0 | Không xảy ra theo BR-DXMS-03-06 |
| Gửi email lỗi với một số nhà cung cấp | Không báo cho ĐV ở bước này; dòng ghi Gửi lỗi tại DTMS_CN_0148, DTMS_CN_0151 |
| Lỗi xử lý, timeout khi Xác nhận | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập; chưa sinh yêu cầu, chưa thêm nhà cung cấp (mục 4.6.7) |

**Đồng thời:** hai hồ sơ cùng thêm một Mã số thuế thì hồ sơ sau dùng nhà cung cấp hồ sơ trước vừa thêm.

##### 3.1.4.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0145-01 | Bản rà soát có hạng mục 1 (SL mua 20), hạng mục 2 (SL mua 0) | Mở hộp thoại | Chỉ có hạng mục 1, SL 20 |
| AC-0145-02 | Hạng mục ngành Viễn thông; nhà cung cấp A cùng ngành, B khác ngành | Mở hộp thoại | Có A, không có B |
| AC-0145-03 | Nhà cung cấp C cùng ngành, đang bị cấm; D bị hạn chế | Mở hộp thoại | C không có ô chọn, có ở bảng Tình trạng; D chọn được |
| AC-0145-04 | Có Nhóm 2, ngày gửi 06/10/2026 | Mở hộp thoại | Hạn trả lời mặc định 13/10/2026 |
| AC-0145-05 | Chỉ Nhóm 1, ngày gửi 06/10/2026 | Mở hộp thoại | Hạn trả lời mặc định 11/10/2026 |
| AC-0145-16 | Chỉ Nhóm 1, ngày gửi 28/08/2026; 02/09/2026 là ngày lễ trong lịch nghỉ | Mở hộp thoại | Hạn trả lời mặc định 03/09/2026 |
| AC-0145-06 | Không chọn nhà cung cấp, có một nhà cung cấp mới hợp lệ | Bấm \[Xác nhận\] | Hoàn thành; nhà cung cấp có trong danh mục, ghi nguồn mã hồ sơ, được gửi yêu cầu |
| AC-0145-07 | Không chọn, không có nhà cung cấp mới | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu inline |
| AC-0145-08 | Hồ sơ không Mật, ba nhà cung cấp | Xác nhận | Có YCBG-2026-0117-01 ở WAITING, ba email; lịch sử ghi đã gửi |
| AC-0145-09 | Email của một nhà cung cấp bị máy chủ thư từ chối | Bước 9 chạy | Hai nhà cung cấp còn lại vẫn nhận; dòng lỗi ghi Gửi lỗi; hồ sơ sang bước 10 |
| AC-0145-10 | Hồ sơ Mật | Xác nhận | Không có email nào; Kênh gửi "Ngoài hệ thống"; hồ sơ sang bước 10 |
| AC-0145-11 | Đối soát có dòng Không khớp | Bấm \[Xác nhận\] | Vẫn hoàn thành được |
| AC-0145-12 | ĐXMS đã có YCBG-2026-0117-02 ở hồ sơ dừng, tạo hồ sơ mới | Hồ sơ mới gửi yêu cầu | Mã mới YCBG-2026-0117-03 |
| AC-0145-13 | Mã số thuế trùng nhà cung cấp đang hoạt động, khác ngành hàng | Xác nhận | Yêu cầu gửi cho nhà cung cấp đã có; danh mục không đổi |
| AC-0145-14 | ĐXMS Mật = Có, hồ sơ đổi Mật về Không ở bước 4 | Xác nhận | Không có email; Kênh gửi "Ngoài hệ thống" |
| AC-0145-15 | SL đề xuất 6, Còn lại 20; Ngoài căn cứ một dòng | Mở hộp thoại | Dòng 1 Khớp; dòng Ngoài căn cứ Không có trong nguồn |
| AC-0145-17 | Luật MS01_T08_HOAN_THANH kích hoạt; nhà cung cấp A đã chọn bị cấm sau khi mở eForm | Bấm nút của luật, \[Xác nhận\] | Nút hiện như mọi lúc; bị chặn bởi KT-01: "Nhà cung cấp A không còn hợp lệ, vui lòng chọn lại."; công việc giữ nguyên, chưa thêm nhà cung cấp mới, chưa sinh yêu cầu |
| AC-0145-18 | Luật MS01_T08_HOAN_THANH kích hoạt; ngày gửi 06/10/2026, Hạn trả lời sửa thành 05/10/2026 | Bấm nút của luật, \[Xác nhận\] | Bị chặn bởi KT-08: "Hạn trả lời không được nhỏ hơn ngày gửi."; công việc giữ nguyên |
| AC-0145-19 | Nhà cung cấp mới có Mã số thuế trùng nhà cung cấp đang bị cấm | Bấm nút của luật MS01_T08_HOAN_THANH, \[Xác nhận\] | Bị chặn bởi KT-15, câu tại dòng; danh mục không đổi; công việc giữ nguyên |
| AC-0145-20 | Thêm một trường vào eForm dtms-ms01-t08-ycbg | Mở bước 8 của hồ sơ mới | Có trường mới; giá trị lưu trong dữ liệu form của bước; không sửa mã nguồn (AC-CH-03) |

#### 3.1.4.2 DTMS_CN_0146 Nhập yêu cầu báo giá từ tệp

##### 3.1.4.2.1 Thông tin chung chức năng

- **Mục đích:** Nhập nhanh danh sách nhà cung cấp nhận yêu cầu thay cho chọn tay.

- **Người dùng mục tiêu:** ĐV tại bước 8.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 8 \> nút của luật MS01_T08_HOAN_THANH (Hoàn thành) \> trường Nhà cung cấp nhận YCBG \> \[Nhập từ tệp\].

- **Tiền điều kiện:**

  - Hồ sơ ở bước 8, người dùng được giao công việc.

- **Hậu điều kiện:**

  - Lựa chọn nhà cung cấp, nhà cung cấp mới trên eForm bước 8 được cập nhật.

  - Chưa lưu cho tới khi Xác nhận.

##### 3.1.4.2.2 Màn hình

Chưa có màn tương ứng. Bố cục theo hộp thoại nhập tệp của danh mục Nhà cung cấp.

##### 3.1.4.2.3 Mô tả chi tiết các thành phần

Đăng ký vào nền tảng: hộp thoại này là một phần của kiểu trường eForm tùy biến nhacungcap (mục 2.4.1, DTMS_CN_0145), mở từ nút \[Nhập từ tệp\] của trường Nhà cung cấp nhận YCBG; không phải màn của bước. Kết quả nhập chỉ đổi giá trị nccSel và các dòng nccMoi trên eForm đang mở; danh mục Nhà cung cấp chỉ đổi khi Xác nhận eForm, do HX-14 của luật thực hiện.

**Hộp thoại Nhập từ tệp** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | \[Tải tệp mẫu\] | Link | Input | – | Tệp XLSX, cột: Mã nhà cung cấp, Tên, Mã số thuế, Email nhận YCBG, Ngành hàng. |
| 2 | Tệp nhập \* | Upload | Input | Rỗng | Một tệp XLSX theo mẫu, tối đa 500 dòng; dung lượng theo mục 4.1. |
| 3 | Kết quả kiểm tra | Bảng chỉ đọc | Output | Theo dữ liệu | Dòng, Mã hoặc Tên, Kết quả (Hợp lệ, Lỗi), Nội dung lỗi. Mapping: Tính. |
| 4 | \[Hủy\] | Button | Input | – | Đóng, không đổi eForm bước 8. |
| 5 | \[Nhập\] | Button | Input | – | Dùng được khi mọi dòng Hợp lệ. |

Dòng có Mã nhà cung cấp: đối chiếu danh mục; đang bị cấm, dừng hoạt động thì lỗi; khác ngành hàng thì cảnh báo, vẫn nhập. Dòng không có Mã: xử lý như nhà cung cấp mới theo BR-DXMS-04-04. Hạng mục, số lượng không nhập từ tệp, theo BR-DXMS-04-02.

##### 3.1.4.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Bấm \[Nhập từ tệp\]. |
| 2 | Tải tệp mẫu, điền, tải lên. |
| 3 | Hệ thống kiểm tra từng dòng, hiện kết quả. |
| 4 | Bấm \[Nhập\]. |
| 5 | Trường Nhà cung cấp nhận YCBG trên eForm bước 8 cập nhật lựa chọn, thêm dòng nhà cung cấp mới, giữ các lựa chọn đã có. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Sai định dạng tệp, không đúng mẫu | Inline: "Tệp không đúng mẫu. Vui lòng tải tệp mẫu." |
| Tệp không có dòng dữ liệu | Inline: "Tệp không có dữ liệu." |
| Quá 500 dòng | Inline: "Tệp vượt quá 500 dòng." |
| Mã không có trong danh mục | Lỗi dòng: "Nhà cung cấp không tồn tại." |
| Nhà cung cấp đang bị cấm, dừng hoạt động | Lỗi dòng: "Nhà cung cấp đang bị cấm hoặc dừng hoạt động." |
| Nhà cung cấp khác ngành hàng | Cảnh báo tại dòng: "Nhà cung cấp không có ngành hàng của hạng mục." Vẫn là Hợp lệ |
| Thiếu Tên, Mã số thuế, Email, Ngành hàng khi không có Mã; Email sai | Lỗi dòng: "Thiếu thông tin bắt buộc.", "Email không hợp lệ." |
| Mã số thuế đã có | Xử lý theo BR-DXMS-04-04 |
| Trùng dòng trong tệp | Lỗi dòng: "Nhà cung cấp bị trùng trong tệp." |
| Lỗi xử lý | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |

**Đồng thời:** kiểm tra lại khi Xác nhận bước 8 theo DTMS_CN_0145 (KT-01, KT-15).

##### 3.1.4.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0146-01 | Tệp có 2 mã hợp lệ, 1 dòng không mã đủ thông tin | Tải lên, bấm \[Nhập\] | Hai nhà cung cấp được chọn; có một dòng nhà cung cấp mới |
| AC-0146-02 | Tệp có một dòng mã không tồn tại | Tải lên | Bảng ghi lỗi dòng đó; \[Nhập\] vô hiệu; eForm bước 8 không đổi |
| AC-0146-03 | Tệp có nhà cung cấp đang bị cấm | Tải lên | Lỗi tại dòng đó |
| AC-0146-04 | Đã chọn sẵn nhà cung cấp A | Nhập tệp có B | Cả A, B được chọn |
| AC-0146-05 | Tệp PDF | Tải lên | Hiện câu không đúng mẫu |
| AC-0146-06 | Đã nhập xong | Bấm \[Hủy\] ở eForm bước 8 | Không có nhà cung cấp mới nào được thêm vào danh mục |

#### 3.1.4.3 DTMS_CN_0147 Quản lý tài liệu báo giá

##### 3.1.4.3.1 Thông tin chung chức năng

- **Mục đích:** Lưu tệp báo giá của từng nhà cung cấp, làm đầu vào cho AI và cho đánh giá.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 10. Xem: CH, TT, CQ.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 10 \> nút của luật MS01_T10_XAC_NHAN (Báo giá đạt) \> Tệp báo giá; Chi tiết yêu cầu báo giá \> Tệp báo giá.

- **Tiền điều kiện:**

  - Hồ sơ ở bước 10, người dùng được giao công việc.

  - Hoặc được xem hồ sơ.

- **Hậu điều kiện:**

  - Tệp báo giá gắn với nhà cung cấp và lần gửi.

##### 3.1.4.3.2 Màn hình

<img src="media/rId193.png" style="width:6.25in;height:5.76823in" alt="Danh sách tài liệu tại bước 10" />

Ảnh minh họa bố cục. Khác ảnh: các dòng báo giá là trường Tệp báo giá của eForm bước 10, không nằm trong khối Danh sách tài liệu của công việc; dòng ghi "chưa tải lên" thay vì "bắt buộc" khi nhà cung cấp được đánh dấu Không phản hồi; có icon Xóa với tệp vừa tải.

##### 3.1.4.3.3 Mô tả chi tiết các thành phần

Đăng ký vào nền tảng: kiểu trường eForm tùy biến tepbaogia (mục 2.4.1), khóa tepBaoGia, đặt trong eForm dtms-ms01-t10-bao-gia của bước 10 (DTMS_CN_0148), hiện chỉ xem ở Chi tiết yêu cầu báo giá (DTMS_CN_0151). Bố cục như khối Danh sách tài liệu (DTMS_CN_0110); tài liệu khác của hồ sơ vẫn tải ở khối Danh sách tài liệu của công việc, theo DTMS_CN_0110. Tải lên, thay, xóa tệp chạy ngay qua dịch vụ của trường, không chờ Xác nhận eForm.

**Trường Tệp báo giá** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | STT | Number | Output | Theo dữ liệu |  |
| 2 | Thao tác | Icon | Input | – | Dòng chưa có tệp: Tải lên. Dòng có tệp: Tải xuống; Thay tệp, Xóa khi công việc bước 10 chưa hoàn thành. |
| 3 | Tên tài liệu | Text | Output | Theo dữ liệu | Chưa có tệp: "Báo giá — {Nhà cung cấp} — bắt buộc, chưa tải lên". Có tệp: tên tệp. Mapping: quote.file_id. |
| 4 | Ngày tạo | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Chưa có tệp thì hiện "-". Mapping: quote.uploaded_at. |

Tệp theo mục 4.1, mỗi nhà cung cấp một tệp cho mỗi lần gửi. Tải lên xong AI đọc tệp theo BR-DXMS-04-09, giá trị gợi ý ghi vào dòng của nhà cung cấp trong baoGia của eForm và quote.ai_suggest. Lần gửi lại có dòng báo giá mới; tệp của lần trước vẫn giữ, xem tại DTMS_CN_0151. ĐV, CH của đơn vị đề xuất, TT, CQ được tải xuống, lọc theo BR-DXMS-01-09; PG, TV, TĐ thấy dòng báo giá nhưng không có icon tải tệp.

##### 3.1.4.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                      |
|------|------------------------------------------------------------|
| 1    | Bấm Tải lên ở dòng nhà cung cấp.                           |
| 2    | Chọn tệp.                                                  |
| 3    | Hệ thống kiểm tra, lưu, ghi nhật ký, chạy AI đọc tệp.      |
| 4    | Dòng hiện tên tệp. Yêu cầu sang RECEIVED nếu đang WAITING. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Sai định dạng, vượt dung lượng | Thông báo theo mục 4.1, không lưu |
| AI lỗi khi đọc | Không chặn; các trường báo giá để trống cho người dùng nhập |
| Xóa tệp | Hỏi: "Bạn có chắc chắn muốn xóa tệp {Tên tệp} không?" \[Hủy\], \[Xóa\]. Xóa giá trị báo giá đã ghi nhận của nhà cung cấp đó. Không còn báo giá nào thì yêu cầu về WAITING |
| Bước 10 đã hoàn thành, trừ khi Sửa lại theo BR-DXMS-04-08 | Không còn thao tác Tải lên, Thay tệp, Xóa; gửi trực tiếp nhận "Bạn không có quyền thực hiện chức năng này." |
| Tải lên hoặc tải xuống lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |

**Đồng thời:** một công việc một người xử lý theo DTMS_CN_0110.

##### 3.1.4.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0147-01 | Yêu cầu có 3 nhà cung cấp | Mở eForm bước 10 | Có 3 dòng "bắt buộc, chưa tải lên" ở trường Tệp báo giá |
| AC-0147-02 | Yêu cầu WAITING | Tải tệp hợp lệ cho một nhà cung cấp | Dòng hiện tên tệp; yêu cầu sang RECEIVED |
| AC-0147-03 | Đã có một tệp duy nhất | Xóa tệp, xác nhận | Dòng về chưa tải lên; yêu cầu về WAITING; giá trị báo giá bị xóa |
| AC-0147-04 | Bước 10 đã hoàn thành | ĐV mở lại | Chỉ có Tải xuống |
| AC-0147-05 | Lần gửi 2 | Mở eForm bước 10 | Dòng báo giá của lần 2; tệp lần 1 xem được ở chi tiết yêu cầu lần 1 |
| AC-0147-06 | Dịch vụ AI lỗi | Tải tệp | Tệp lưu được; trường báo giá trống |

#### 3.1.4.4 DTMS_CN_0148 Đánh giá báo giá và xác lập cơ sở giá

##### 3.1.4.4.1 Thông tin chung chức năng

- **Mục đích:** Ghi nhận, so sánh báo giá, chốt cơ sở giá và tổng giá trị, quyết định đạt hay gửi lại.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 10. Xem: CH, TT, CQ.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 10 \> nút của luật MS01_T10_XAC_NHAN (Báo giá đạt) hoặc MS01_T10_TRA_LAI (Không đạt — gửi lại YCBG).

- **Tiền điều kiện:**

  - Hồ sơ ở bước 10, người dùng được giao công việc.

- **Hậu điều kiện:**

  - Yêu cầu PASSED và hồ sơ sang cổng giá trị.

  - Hoặc FAILED và tiến trình về bước 9.

##### 3.1.4.4.2 Màn hình

<img src="media/rId202.png" style="width:6.25in;height:3.51562in" alt="Đánh giá báo giá tại bước 10" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t10-bao-gia và luật nút của bước (mục 2.4), không dựng riêng. Ảnh là một phần của eForm. Trường theo mục 7.4; khác ảnh: trường báo giá nhập được, có cột Cơ sở giá, Thành tiền, Tổng và Kết quả AI; có trường Tệp báo giá (DTMS_CN_0147). Đơn giá các dòng hết hiệu lực không được đánh dấu Thấp nhất, theo BR-DXMS-04-10. Nút của luật MS01_T10_TRA_LAI mở eForm dtms-ms01-t08-ycbg của bước 8 ở chế độ gửi lại.

##### 3.1.4.4.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 10 | ĐV tải tệp báo giá của từng nhà cung cấp, kiểm tra và sửa giá trị AI đọc, chốt cơ sở giá; chọn đạt, hoặc không đạt và gửi lại yêu cầu |
| Cổng sau bước 10 | Đạt: sang cổng giá trị (BR-DXMS-C-05). Không đạt: về bước 9 sinh yêu cầu lần mới |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 10 | Activity_10 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t10-bao-gia; luật MS01_T10_TRA_LAI mở dtms-ms01-t08-ycbg | MS01_T10_XAC_NHAN (Báo giá đạt); MS01_T10_TRA_LAI (Không đạt — gửi lại YCBG) | Đạt: XAC_NHAN; KT-16, KT-17, KT-06 (AI kiểm tra báo giá); HX-04 (baoGia), HX-01. Không đạt: TRA_LAI, không đặt Lý do bắt buộc, biến bắt buộc lyDoKhongDat; KT-01, KT-15, KT-08; HX-15, HX-14, HX-01 | Mục 2.4.3, dòng bước 10 | Đạt: cổng giá trị. Không đạt: bước 9 |

**Cổng sau bước 10** \[CẤU HÌNH\] trên BPMN: outcome confirmed=true sang cổng giá trị, rẽ theo tongGiaTriCoSo so với ngưỡng hồ sơ giữ khi Lưu (BR-DXMS-C-05): dưới ngưỡng sang bước 11, luồng MS01.03; từ ngưỡng trở lên sang bước 12. Outcome approved=false về bước 9. Kết quả AI kiểm tra báo giá đã xét ở KT-06 trước khi hoàn thành công việc, cổng không xét lại. Hệ thống không tự gửi lại yêu cầu (BR-DXMS-04-12). Hạn của công việc bước 10 bằng hanTraLoi (DTMS_CN_0145).

**Dữ liệu chỉ xem của eForm** (mục 2.4.3): lanGuiYcbg, maYcbg và giá trị khởi tạo của baoGia (nhà cung cấp, Tình trạng gửi: Đã gửi, Gửi lỗi, Ngoài hệ thống; dòng đơn giá theo hạng mục) do tác vụ bước 9 ghi; giá trị AI đọc từ tệp do trường Tệp báo giá ghi vào baoGia (DTMS_CN_0147). ycbgNhom1, ycbgNhom2 như DTMS_CN_0145. hoSo.nguong là ngưỡng hồ sơ giữ khi Lưu. aiKiemTraBaoGia do KT-06 ghi: Kết quả (Đạt, Không đạt, Chưa có kết quả), chi tiết, nguồn là các tệp đã đọc, lý do, số lần Không đạt liên tiếp.

**Phần riêng** \[RIÊNG\]:

- Bảng so sánh báo giá và cơ sở giá đăng ký là kiểu trường eForm tùy biến sosanhbaogia (mục 2.4.1), khóa coSoGia, tham số: bảng báo giá baoGia, hạng mục ycbgNhom1, ycbgNhom2, biến tổng tongGiaTriCoSo. Mỗi hạng mục một dòng: Đơn giá quy đổi (tỷ đồng) của từng nhà cung cấp = Đơn giá báo × Tỷ giá ÷ 1.000.000.000, VNĐ có Tỷ giá bằng 1 (BR-DXMS-04-09); giá thấp nhất trong các báo giá còn hiệu lực đánh dấu Thấp nhất; báo giá có Hiệu lực đến nhỏ hơn ngày hiện tại ghi "(hết hiệu lực)", không dùng để tính. Cơ sở giá chọn trong các nhà cung cấp còn hiệu lực có giá, mặc định giá thấp nhất, cùng giá thì lấy nhà cung cấp có Ngày báo giá sớm hơn; chọn khác thì Lý do chọn khác giá thấp nhất bắt buộc, tối đa 500 ký tự ("Vui lòng nhập lý do chọn cơ sở giá."). Thành tiền = Đơn giá quy đổi × Còn phải mua; Tổng giá trị theo cơ sở giá = tổng Thành tiền, ghi tongGiaTriCoSo; tính ngay khi đổi, lưu và tính trên số đầy đủ, hiển thị đơn giá 3, Thành tiền và Tổng 2 chữ số thập phân (BR-DXMS-04-10). Dưới bảng liệt kê chữ đỏ văn bản căn cứ bị vượt theo BR-DXMS-04-11, số liệu lấy từ máy chủ; khi Xác nhận, KT-17 kiểm tra lại. Mapping: quotation_item.base_quote_id, quotation_item.base_reason.

- Trường Tệp báo giá đăng ký là kiểu trường eForm tùy biến tepbaogia, khóa tepBaoGia (DTMS_CN_0147).

- AI kiểm tra báo giá là bộ kiểm tra AI của KT-06 (mục 2.5.2): kiểm tra đơn giá, Ngày báo giá, Hiệu lực đến người dùng chốt có khớp tệp báo giá không (BR-DXMS-04-12). Kết quả ghi aiKiemTraBaoGia và quotation.ai_check.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T10_XAC_NHAN (Báo giá đạt) | eForm: nhà cung cấp không đánh dấu Không phản hồi có Ngày báo giá, Hiệu lực đến, Loại tiền; Tỷ giá khi Loại tiền không phải VNĐ; Ngày báo giá không lớn hơn ngày hiện tại; Hiệu lực đến không nhỏ hơn Ngày báo giá; chọn cơ sở giá khác giá thấp nhất thì có Lý do; chọn Vẫn đạt thì có Lý do. KT-16: mỗi nhà cung cấp có tệp báo giá hoặc được đánh dấu Không phản hồi; mỗi hạng mục có ít nhất một báo giá còn hiệu lực. KT-17: không vượt phần căn cứ còn có thể sử dụng (BR-DXMS-04-11), kể cả khi chọn Vẫn đạt. KT-06: AI kiểm tra báo giá; Không đạt thì chặn, eForm hiện lý do của AI; AI lỗi hoặc chưa có kết quả thì đạt, nhật ký ghi Chưa có kết quả; từ lần Không đạt thứ hai liên tiếp, chọn Vẫn đạt kèm Lý do thì đạt (BR-DXMS-04-12) | HX-04 lưu giá trị AI gợi ý và giá trị người dùng chốt của báo giá (BR-DXMS-C-08). HX-01 ghi báo giá, đơn giá, cơ sở giá, kết quả AI và lý do Vẫn đạt; yêu cầu sang PASSED, ghi ngày có kết quả; giá trị hồ sơ bằng tongGiaTriCoSo. Lý do Vẫn đạt ghi nhật ký, hiện cho Chỉ huy đơn vị ở bước 13. Hoàn thành công việc, sang cổng giá trị |
| MS01_T10_TRA_LAI (Không đạt — gửi lại YCBG) | Mở eForm dtms-ms01-t08-ycbg ở chế độ gửi lại: Lý do (lyDoKhongDat), Nhà cung cấp nhận (mặc định các nhà cung cấp lần này còn hợp lệ, thêm được), Nhà cung cấp mới, Tài liệu kỹ thuật (mặc định của lần trước, thay được), Hạn trả lời (theo BR-DXMS-04-05). eForm: Lý do bắt buộc, tối đa 2000 ký tự; các kiểm tra của eForm như bước 8. KT-01, KT-15, KT-08 như luật MS01_T08_HOAN_THANH | HX-15, HX-14 như bước 8. HX-01: yêu cầu hiện hành sang FAILED, ghi Lý do, ngày có kết quả; nội dung yêu cầu lần trước không đổi. Hoàn thành công việc, về bước 9 sinh yêu cầu lần mới; hạng mục lần gửi lại giữ nguyên |

##### 3.1.4.4.4 Luồng nghiệp vụ

**Luồng đạt:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV bấm nút của luật MS01_T10_XAC_NHAN (Báo giá đạt). |
| 2 | Kiểm tra, sửa trường báo giá, cơ sở giá. |
| 3 | Bấm \[Xác nhận\]. |
| 4 | Hệ thống kiểm tra (KT-16, KT-17), lấy kết quả AI (KT-06), ghi báo giá, cơ sở giá, Tổng (HX-04, HX-01), ghi nhật ký. |
| 5 | Áp BR-DXMS-04-12: sang cổng giá trị; AI Không đạt thì KT-06 chặn, ở lại bước 10, eForm hiện lý do của AI. |

**Luồng không đạt:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV bấm nút của luật MS01_T10_TRA_LAI (Không đạt — gửi lại YCBG); eForm bước 8 mở ở chế độ gửi lại. |
| 2 | Nhập Lý do, chọn nhà cung cấp, Hạn. |
| 3 | Bấm \[Xác nhận\]. |
| 4 | Yêu cầu sang FAILED, tiến trình về bước 9, sinh yêu cầu lần mới. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Nhà cung cấp chưa có tệp, chưa đánh dấu Không phản hồi | KT-16, inline tại dòng: "Vui lòng tải lên báo giá hoặc đánh dấu Không phản hồi." Công việc giữ nguyên |
| Hạng mục không có báo giá còn hiệu lực | KT-16, inline tại dòng: "Hạng mục {Tên} chưa có báo giá còn hiệu lực." Công việc giữ nguyên |
| Bỏ trống trường bắt buộc | Inline: "Vui lòng nhập {Tên trường}." hoặc "Vui lòng chọn {Tên trường}." |
| Hiệu lực đến nhỏ hơn Ngày báo giá | Inline: "Hiệu lực đến không được nhỏ hơn Ngày báo giá." |
| Thiếu lý do khi chọn khác giá thấp nhất | Inline: "Vui lòng nhập lý do chọn cơ sở giá." |
| Vượt phần căn cứ còn có thể sử dụng (BR-DXMS-04-11) | KT-17, inline đỏ dưới bảng So sánh, mỗi văn bản một dòng: "Văn bản căn cứ {Số văn bản} còn có thể sử dụng {x} tỷ đồng, hạng mục liên kết có Thành tiền {y} tỷ đồng. Vui lòng chọn lại cơ sở giá hoặc chọn Không đạt — gửi lại YCBG." Không lưu, hồ sơ ở lại bước 10 |
| Mọi nhà cung cấp Không phản hồi | Nút của luật MS01_T10_XAC_NHAN bị chặn bởi KT-16 với câu hạng mục chưa có báo giá; dùng nút của luật MS01_T10_TRA_LAI |
| Đạt nhưng AI Không đạt | KT-06, tại eForm: "AI kiểm tra báo giá: Không đạt — {Lý do}. Vui lòng kiểm tra lại dữ liệu." Không lưu, công việc giữ nguyên; từ lần thứ hai liên tiếp eForm hiện thêm lựa chọn Vẫn đạt (BR-DXMS-04-12) |
| AI chưa có kết quả khi Xác nhận | Theo lựa chọn của người dùng, nhật ký ghi Chưa có kết quả |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập; công việc chưa hoàn thành (mục 4.6.7) |

**Đồng thời:** một công việc một người xử lý theo DTMS_CN_0110. Giá trị hồ sơ chỉ cập nhật khi yêu cầu PASSED.

##### 3.1.4.4.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0148-01 | Hạng mục SL 20; đơn giá A 3,2, B 3,35, C 3,28 tỷ; đều còn hiệu lực | Mở hộp thoại | Cơ sở giá A, Thành tiền 64,00 |
| AC-0148-02 | Như trên, C giá 3,1 nhưng hết hiệu lực | Mở hộp thoại | C ghi hết hiệu lực; cơ sở giá vẫn A |
| AC-0148-03 | Chọn cơ sở giá B, bỏ trống lý do | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu inline |
| AC-0148-04 | Luật MS01_T10_XAC_NHAN kích hoạt; nhà cung cấp C chưa có tệp, chưa đánh dấu Không phản hồi | Bấm nút của luật, \[Xác nhận\] | Nút hiện như mọi lúc; bị chặn bởi KT-16: "Vui lòng tải lên báo giá hoặc đánh dấu Không phản hồi." tại dòng C; công việc giữ nguyên |
| AC-0148-05 | Đánh dấu C Không phản hồi, A, B đủ giá | Bấm \[Xác nhận\] | Hoàn thành được |
| AC-0148-06 | Luật MS01_T10_XAC_NHAN kích hoạt; Tổng 150 tỷ, ngưỡng 160; AI Đạt | Bấm nút của luật (Báo giá đạt), \[Xác nhận\] | Yêu cầu PASSED, giá trị hồ sơ bằng Tổng; hồ sơ sang bước 11, luồng MS01.03 |
| AC-0148-07 | Luật MS01_T10_XAC_NHAN kích hoạt; đơn giá người dùng chốt khác tệp, AI Không đạt | Bấm nút của luật, \[Xác nhận\] | Bị chặn bởi KT-06: không lưu, ở lại bước 10, eForm hiện lý do của AI; không có yêu cầu gửi lại |
| AC-0148-19 | AI Không đạt lần thứ hai liên tiếp | Chọn Vẫn đạt, nhập Lý do, \[Xác nhận\] | Yêu cầu PASSED; Chỉ huy đơn vị thấy lý do ở bước 13 |
| AC-0148-08 | Dịch vụ AI lỗi | Bấm nút của luật MS01_T10_XAC_NHAN (Báo giá đạt), \[Xác nhận\] | KT-06 đạt, nhật ký ghi Chưa có kết quả; sang cổng giá trị |
| AC-0148-09 | Lý do bỏ trống | Bấm nút của luật MS01_T10_TRA_LAI (Không đạt — gửi lại YCBG), \[Xác nhận\] | Không hoàn thành, hiện câu inline |
| AC-0148-10 | Không đạt, thêm nhà cung cấp D, hạn mới | Xác nhận | Yêu cầu lần 2 gửi cả D, hạn mới; lần 1 ở FAILED, nội dung không đổi |
| AC-0148-11 | Tổng 180 tỷ, ngưỡng 160; AI Đạt | Bấm nút của luật MS01_T10_XAC_NHAN (Báo giá đạt), \[Xác nhận\] | Hồ sơ sang bước 12; Quy trình hiện luồng dự kiến kèm "(dự kiến)" (BR-DXMS-C-05) |
| AC-0148-18 | Tổng đúng bằng ngưỡng 160 tỷ | Qua cổng sau bước 10 | Sang bước 12 (từ ngưỡng trở lên) |
| AC-0148-12 | Báo giá USD, Tỷ giá trống | Bấm \[Xác nhận\] | Không hoàn thành, hiện câu nhập Tỷ giá |
| AC-0148-13 | AI gợi ý đơn giá, người dùng sửa | Xác nhận | Hệ thống lưu cả hai giá trị (kiểm theo mục 2.3.5) |
| AC-0148-14 | Đơn giá báo 100.000 USD, Tỷ giá 25.000, SL mua 2 | Mở hộp thoại | Đơn giá quy đổi 2,500 tỷ, Thành tiền 5,00 |
| AC-0148-15 | Đơn giá 1.200.000 VNĐ, SL mua 1.000 | Mở hộp thoại | Thành tiền 1,20 tỷ |
| AC-0148-17 | Mọi nhà cung cấp Không phản hồi | Bấm nút của luật MS01_T10_TRA_LAI, thêm nhà cung cấp mới, \[Xác nhận\] | Yêu cầu lần 2 gửi cho nhà cung cấp mới |
| AC-0148-20 | Văn bản căn cứ Giá trị 100 tỷ, ĐXMS khác đã dùng 60 tỷ; hạng mục liên kết văn bản này có Thành tiền theo cơ sở giá 45 tỷ; AI Đạt | Bấm nút của luật MS01_T10_XAC_NHAN (Báo giá đạt), \[Xác nhận\] | Bị chặn bởi KT-17: không lưu, ở lại bước 10; hiện câu văn bản còn có thể sử dụng 40,00 tỷ, Thành tiền 45,00 tỷ; yêu cầu vẫn RECEIVED |
| AC-0148-21 | Như AC-0148-20, AI Không đạt lần thứ hai liên tiếp | Chọn Vẫn đạt, nhập Lý do, \[Xác nhận\] | Vẫn không lưu vì vượt phần căn cứ |
| AC-0148-22 | Luật MS01_T10_TRA_LAI kích hoạt; lần 1 gửi A, B, C; C bị cấm sau khi gửi | Bấm nút của luật | Mở eForm dtms-ms01-t08-ycbg ở chế độ gửi lại: có Lý do; Nhà cung cấp nhận chọn sẵn A, B; Tài liệu kỹ thuật của lần 1; không có bảng Đối soát |
| AC-0148-23 | Luật MS01_T10_XAC_NHAN kích hoạt; mọi nhà cung cấp Không phản hồi | Bấm nút của luật, \[Xác nhận\] | Nút hiện như mọi lúc; bị chặn bởi KT-16: "Hạng mục {Tên} chưa có báo giá còn hiệu lực."; công việc giữ nguyên |

#### 3.1.4.5 DTMS_CN_0149 Xem lịch sử báo giá, cơ sở giá

##### 3.1.4.5.1 Thông tin chung chức năng

- **Mục đích:** Xem các lần yêu cầu báo giá của ĐXMS, so sánh báo giá gần nhất, diễn biến tổng giá trị.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết đề xuất mua sắm \> tab Yêu cầu báo giá.

- **Tiền điều kiện:**

  - Được xem ĐXMS.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.4.5.2 Màn hình

<img src="media/rId211.png" style="width:6.25in;height:3.58398in" alt="Tab Yêu cầu báo giá" />

Ảnh minh họa bố cục. Nút \[Chỉnh sửa\] chỉ hiện với ĐV của đơn vị đề xuất.

##### 3.1.4.5.3 Mô tả chi tiết các thành phần

Đăng ký vào nền tảng: tab Yêu cầu báo giá của màn Chi tiết đề xuất mua sắm; không phải màn của bước. Dữ liệu lọc theo BR-DXMS-01-09, chỉ đọc, không phân trang.

**Tab Yêu cầu báo giá** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Danh sách yêu cầu báo giá** |  |  |  |  |
| 1 | STT, Trạng thái, Mã yêu cầu báo giá, Lần, Nhà cung cấp nhận, Số báo giá đã nhận, Ngày gửi, Hạn báo giá | Text | Output | Theo dữ liệu | Mã mở DTMS_CN_0151. Sắp theo Lần tăng dần. Tối đa 2 dòng ở cột Nhà cung cấp, quá dài hiện tooltip. Mapping: quotation.\*. |
|  | **So sánh báo giá và cơ sở giá** |  |  |  |  |
| 2 | STT, Hạng mục, ĐVT, Số lượng, đơn giá từng nhà cung cấp, Cơ sở giá, Thành tiền | Text | Output | Theo dữ liệu | Của yêu cầu gần nhất có báo giá; tiêu đề ghi mã. Dòng cuối Tổng giá trị theo cơ sở giá. Giá cơ sở in đậm, giá hết hiệu lực hiện mờ. Chú thích: "Đơn giá quy đổi VNĐ, gồm VAT". Mapping: quote_line.\*. |
|  | **Lịch sử cơ sở giá** |  |  |  |  |
| 3 | STT, Yêu cầu báo giá, Ngày, Kết quả, Tổng giá trị theo cơ sở giá | Text | Output | Theo dữ liệu | Yêu cầu có báo giá. Ngày là ngày có kết quả; chưa có kết quả thì hiện "-". Kết quả theo tag trạng thái. Mapping: quotation.\*. |

##### 3.1.4.5.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                  |
|------|------------------------|
| 1    | Mở tab.                |
| 2    | Hệ thống tải dữ liệu.  |
| 3    | Người dùng mở yêu cầu. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có yêu cầu | Tại tab: "Chưa có yêu cầu báo giá. Yêu cầu báo giá được khởi tạo từ phần nhu cầu còn phải mua sau rà soát tồn kho." |
| Có yêu cầu, chưa có báo giá | Bảng So sánh: "Chưa nhận được báo giá." |
| Mọi dòng bị ẩn theo BR-DXMS-01-09 | Tại tab: "Chưa có dữ liệu" |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |

**Đồng thời:** dữ liệu mới hiện ở lần tải sau.

##### 3.1.4.5.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0149-01 | Lần 1 FAILED, lần 2 PASSED | Mở tab | Hai dòng; So sánh theo lần 2; Lịch sử có hai dòng với hai Tổng |
| AC-0149-02 | Lần 1 WAITING, chưa có tệp | Mở tab | So sánh hiện "Chưa nhận được báo giá."; Lịch sử rỗng |
| AC-0149-03 | Hồ sơ chưa qua bước 9 | Mở tab | Hiện câu chưa có yêu cầu |
| AC-0149-04 | Hồ sơ Mật, TT ngoài danh sách xử lý | Mở tab | Không có yêu cầu của hồ sơ đó |
| AC-0149-05 | Yêu cầu RECEIVED, chưa có kết quả | Mở tab | Lịch sử ghi Ngày "-" |
| AC-0149-06 | Bấm Mã yêu cầu |  | Mở DTMS_CN_0151 |

### 3.1.5 Danh sách yêu cầu báo giá

Tra cứu yêu cầu báo giá trên toàn bộ ĐXMS trong phạm vi được xem, xem chi tiết và xuất tệp. Yêu cầu chỉ tạo trong quy trình tại DTMS_CN_0145, không tạo ở đây. Trạng thái theo BR-DXMS-04-08.

#### 3.1.5.1 DTMS_CN_0150 Xem danh sách yêu cầu báo giá và tìm kiếm

##### 3.1.5.1.1 Thông tin chung chức năng

- **Mục đích:** Tra cứu yêu cầu báo giá theo mã, ĐXMS, hồ sơ, đơn vị, trạng thái, nhà cung cấp.

- **Người dùng mục tiêu:** ĐV, CH, TT (mục 2.3.2).

- **Đường dẫn truy cập:** Đầu tư mua sắm \> Quản lý đề xuất mua sắm \> Yêu cầu báo giá ĐXMS.

- **Tiền điều kiện:**

  - Đã đăng nhập, có quyền xem.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.5.1.2 Màn hình

<img src="media/rId221.png" style="width:6.25in;height:3.51562in" alt="Danh sách yêu cầu báo giá" />

<img src="media/rId224.png" style="width:6.25in;height:4.10482in" alt="Tìm kiếm nâng cao" />

Ảnh minh họa bố cục. Khác ảnh: ô Từ khóa luôn hiện cùng khối nâng cao; nút trong khối là \[Đặt lại\]; dòng và icon chưa lọc theo đơn vị, quyền. Khi khác nhau, áp dụng mục 3.1.5.1.3.

##### 3.1.5.1.3 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tìm kiếm** |  |  |  |  |
| 1 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo mã YCBG, mã ĐXMS, tên ĐXMS". **Chứa**, không phân biệt hoa thường và dấu, Enter tương đương \[Tìm kiếm\] theo mục 4.3. Mapping: quotation.code, proposal.code, proposal.title. |
|  | **Tìm kiếm nâng cao** |  |  |  |  |
| 2 | Mã yêu cầu báo giá | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: quotation.code. |
| 3 | Mã ĐXMS | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: proposal.code. |
| 4 | Mã hồ sơ | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: profile.code. |
| 5 | Đơn vị đề xuất | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**. Mapping: proposal.unit_id. |
| 6 | Trạng thái | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc** danh sách đã chọn. Giá trị theo BR-DXMS-04-08. Mapping: quotation.status. |
| 7 | Nhà cung cấp | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**, yêu cầu có nhà cung cấp này. Hiện "{Mã} - {Tên}". Mapping: quotation_vendor.vendor_id. |
| 8 | Ngày gửi từ, Ngày gửi đến | Date picker \[DD/MM/YYYY\] | Input | Rỗng | Từ ≤ Ngày gửi ≤ Đến, tính cả hai đầu. Mapping: quotation.sent_at. |
|  | **Thao tác** |  |  |  |  |
| 9 | \[Xuất excel\] | Button | Input | – | Theo DTMS_CN_0152. Hiện với ĐV, TT; xuất theo phạm vi xem. |
| 10 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\], \[Tìm kiếm\], \[Đặt lại\] | Button | Input | – | Như DTMS_CN_0135. |
|  | **Lưới** |  |  |  |  |
| 11 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong tập kết quả. |
| 12 | Thao tác | Icon | Input | – | Xuất file theo DTMS_CN_0152, hiện với ĐV của đơn vị đề xuất, TT. |
| 13 | Trạng thái | Tag | Output | Theo dữ liệu | BR-DXMS-04-08. Mapping: quotation.status. |
| 14 | Mã yêu cầu báo giá | Link | Input | – | Mở DTMS_CN_0151. Mapping: quotation.code. |
| 15 | Mã ĐXMS | Link | Input | – | Mở DTMS_CN_0137. Mapping: proposal.code. |
| 16 | Mã hồ sơ | Link | Input | – | Mở DTMS_CN_0155. Mapping: profile.code. |
| 17 | Tên ĐXMS | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: proposal.title. |
| 18 | Đơn vị đề xuất | Text | Output | Theo dữ liệu | Mapping: proposal.unit_id. |
| 19 | Lần | Number | Output | Theo dữ liệu | Căn giữa. Mapping: quotation.round. |
| 20 | Số NCC nhận | Number | Output | Theo dữ liệu | Căn giữa. Mapping: Tính. |
| 21 | Số báo giá đã nhận | Number | Output | Theo dữ liệu | Căn giữa, số nhà cung cấp đã có tệp báo giá. Mapping: Tính. |
| 22 | Ngày gửi | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: quotation.sent_at. |
| 23 | Hạn báo giá | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: quotation.due_date. |

Phạm vi: ĐV, CH thấy yêu cầu của hồ sơ thuộc đơn vị mình; TT thấy toàn bộ; lọc theo BR-DXMS-01-09. Người tạo không thuộc đơn vị đề xuất không thấy yêu cầu tại danh sách này. Sắp xếp mặc định: Ngày gửi giảm dần, cùng ngày thì Mã giảm dần. Phân trang theo mục 4.4. Bấm vào dòng cũng mở DTMS_CN_0151.

##### 3.1.5.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                        |
|------|----------------------------------------------|
| 1    | Mở màn.                                      |
| 2    | Hệ thống tải yêu cầu trong phạm vi, trang 1. |
| 3    | Người dùng tìm kiếm, phân trang.             |
| 4    | Mở chi tiết hoặc xuất tệp.                   |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có yêu cầu trong phạm vi | Giữ tiêu đề bảng, hiện "Chưa có dữ liệu" (mục 4.2) |
| Có dữ liệu, không khớp điều kiện | Hiện "Không tìm thấy dữ liệu phù hợp" |
| Ngày gửi từ lớn hơn Ngày gửi đến | Inline: "Ngày gửi từ không được lớn hơn Ngày gửi đến." Không tìm |
| Không tải được | Tại vùng lưới: "Không thể tải dữ liệu. Vui lòng thử lại." Giữ điều kiện tìm (mục 4.6.3) |
| Không có quyền vào màn | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** yêu cầu mới hiện ở lần tải sau.

##### 3.1.5.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0150-01 | ĐV đơn vị A; có yêu cầu của đơn vị A, B | Mở màn | Chỉ thấy yêu cầu của đơn vị A |
| AC-0150-02 | Có yêu cầu của ĐXMS tên "Mua sắm máy chủ" | Nhập "may chu", Enter | Có yêu cầu đó, về trang 1 |
| AC-0150-03 | Đã nhập từ khóa, chọn Trạng thái PASSED | Bấm \[Tìm kiếm\] | Kết quả thỏa đồng thời cả hai |
| AC-0150-04 | Yêu cầu X gửi nhà cung cấp A; Y gửi B | Lọc Nhà cung cấp A | Chỉ có X |
| AC-0150-05 | Ngày gửi từ 10/10/2026, đến 01/10/2026 | Bấm \[Tìm kiếm\] | Hiện câu inline, không tìm |
| AC-0150-06 | Đã có điều kiện tìm | Bấm \[Đặt lại\] | Điều kiện rỗng, danh sách đầy đủ, trang 1 |
| AC-0150-07 | CH của đơn vị | Mở màn | Không có \[Xuất excel\], không có icon Xuất file |
| AC-0150-08 | Hồ sơ Mật, TT ngoài danh sách xử lý | TT mở màn | Không có yêu cầu của hồ sơ đó |
| AC-0150-09 | Người dùng CQ | Mở đường dẫn màn | Hiện thông báo không có quyền |
| AC-0150-10 | Yêu cầu có 3 nhà cung cấp, 2 đã có tệp | Xem dòng | Số NCC nhận 3, Số báo giá đã nhận 2 |

#### 3.1.5.2 DTMS_CN_0151 Xem chi tiết yêu cầu báo giá

##### 3.1.5.2.1 Thông tin chung chức năng

- **Mục đích:** Xem đầy đủ một yêu cầu: hạng mục, nhà cung cấp, báo giá, so sánh, lịch sử.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Danh sách yêu cầu báo giá \> Mã; Chi tiết đề xuất mua sắm \> tab Yêu cầu báo giá \> Mã.

- **Tiền điều kiện:**

  - Yêu cầu còn tồn tại, người dùng được thấy hồ sơ của yêu cầu (BR-DXMS-01-09).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.5.2.2 Màn hình

<img src="media/rId233.png" style="width:6.25in;height:7.14518in" alt="Chi tiết yêu cầu báo giá" />

Ảnh minh họa bố cục. Dòng có Hiệu lực đến trước Ngày báo giá là dữ liệu mẫu, không hợp lệ theo mục 3.1.4.4.4. Nút \[Xuất file\] chỉ hiện với ĐV của đơn vị đề xuất, TT.

##### 3.1.5.2.3 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Thao tác** |  |  |  |  |
| 1 | \[Xuất file\] | Button | Input | – | Theo DTMS_CN_0152. Hiện với ĐV của đơn vị đề xuất, TT. |
| 2 | Nút quay lại | Button | Input | – | Về màn đã mở trước đó. Vào thẳng bằng đường dẫn thì về Danh sách; người không có quyền Danh sách về Việc của tôi (DTMS_CN_0108). |
|  | **Thông tin chung** |  |  |  |  |
| 3 | Mã yêu cầu báo giá, Lần gửi, Trạng thái, Mã ĐXMS (link), Tên ĐXMS, Mã hồ sơ (link), Đơn vị đề xuất, Người tạo, Ngày gửi, Hạn báo giá, Kênh gửi, Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác, Đầu mối tiếp nhận báo giá | Text | Output | Theo dữ liệu | Kênh gửi: "Email hệ thống (thay TTMS)" hoặc "Ngoài hệ thống". Không có giá trị thì hiện "-". Mapping: quotation.\*. |
|  | **Hạng mục yêu cầu báo giá** |  |  |  |  |
| 4 | STT, Hạng mục, Đơn vị tính, Số lượng, Ngành hàng | Data Grid | Output | Theo dữ liệu | Kèm Nhóm, tệp tài liệu kỹ thuật tải được. Mapping: quotation_item.\*. |
|  | **Nhà cung cấp nhận yêu cầu** |  |  |  |  |
| 5 | STT, Mã, Tên, Email nhận yêu cầu báo giá, Tình trạng, Ngày báo giá, Hiệu lực đến, Tệp báo giá | Data Grid | Output | Theo dữ liệu | Tình trạng: Chưa phản hồi, Gửi lỗi, Không phản hồi, Đã nhận báo giá, Hết hiệu lực. Tệp bấm để tải. Mapping: quotation_vendor.\*, quote.\*. |
|  | **So sánh báo giá** |  |  |  |  |
| 6 | Như DTMS_CN_0149, của chính yêu cầu này | Text | Output | Theo dữ liệu | Chưa có báo giá: "Chưa nhận được báo giá." Kèm lý do nếu chọn khác giá thấp nhất. Mapping: quote_line.\*. |
|  | **Kết quả AI** |  |  |  |  |
| 7 | Kết quả, chi tiết | Text | Output | Theo dữ liệu | Hiện khi đã có kết quả. Mapping: quotation.ai_check. |
|  | **Lịch sử xử lý** |  |  |  |  |
| 8 | STT, Thời gian, Người thực hiện, Nội dung | Data Grid | Output | Theo dữ liệu | Khởi tạo; Gửi email tới {n} nhà cung cấp; Ghi nhận báo giá của {Tên}; kết quả kèm lý do; Hủy do hồ sơ kết thúc. Sắp theo thời gian tăng dần, không phân trang. Mapping: Nhật ký. |

Tệp báo giá, Email hiện với ĐV, CH của đơn vị đề xuất, TT, CQ. Tác nhân khác, gồm ĐV, CH khác đơn vị đề xuất, thấy "-" ở hai cột này.

##### 3.1.5.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                        |
|------|----------------------------------------------|
| 1    | Mở màn.                                      |
| 2    | Hệ thống kiểm tra quyền, tải dữ liệu.        |
| 3    | Người dùng xem, tải tệp, mở ĐXMS hoặc hồ sơ. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Yêu cầu không tồn tại | "Không tìm thấy yêu cầu báo giá." Có nút quay lại |
| Không có quyền xem | "Bạn không có quyền thực hiện chức năng này." |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Tải tệp lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |

**Đồng thời:** dữ liệu mới hiện ở lần tải sau.

##### 3.1.5.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0151-01 | Yêu cầu PASSED có 3 nhà cung cấp | Mở màn | Đủ các khối; Tổng khớp tab Yêu cầu báo giá nếu là lần gần nhất |
| AC-0151-02 | Yêu cầu WAITING | Mở màn | Nhà cung cấp ở Chưa phản hồi; So sánh hiện chưa nhận báo giá |
| AC-0151-03 | Một nhà cung cấp gửi email lỗi | Mở màn | Dòng đó ở Gửi lỗi |
| AC-0151-04 | Hồ sơ Mật | Mở màn | Kênh gửi "Ngoài hệ thống"; lịch sử không có dòng gửi email |
| AC-0151-05 | Người dùng PG được xem | Mở màn | Không có \[Xuất file\]; Email, Tệp báo giá hiện "-" |
| AC-0151-09 | Người dùng CQ được xem | Mở màn | Không có \[Xuất file\]; thấy Email, tải được Tệp báo giá |
| AC-0151-10 | ĐV đơn vị B thuộc danh sách xử lý của hồ sơ đơn vị A | Mở màn | Không có \[Xuất file\]; Email, Tệp báo giá hiện "-" |
| AC-0151-06 | Hồ sơ dừng khi yêu cầu WAITING | Mở màn | Trạng thái CANCELED; lịch sử có dòng Hủy do hồ sơ kết thúc |
| AC-0151-07 | Hồ sơ Mật, TT ngoài danh sách xử lý | Mở bằng đường dẫn | Hiện thông báo không có quyền |
| AC-0151-08 | Mã không tồn tại | Mở bằng đường dẫn | Hiện "Không tìm thấy yêu cầu báo giá." |

#### 3.1.5.3 DTMS_CN_0152 Xuất file yêu cầu báo giá

##### 3.1.5.3.1 Thông tin chung chức năng

- **Mục đích:** Tải phiếu của một yêu cầu, hoặc danh sách yêu cầu đang lọc.

- **Người dùng mục tiêu:** Xuất: ĐV của đơn vị đề xuất, TT. CH xem tệp đính kèm trên chi tiết, không xuất.

- **Đường dẫn truy cập:** Danh sách yêu cầu báo giá \> \[Xuất excel\] hoặc icon Xuất file; Chi tiết yêu cầu báo giá \> \[Xuất file\].

- **Tiền điều kiện:**

  - Người dùng được xem yêu cầu.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

  - Tệp được tải về.

  - Ghi nhật ký.

##### 3.1.5.3.2 Màn hình

Không có màn riêng. Nút nằm trên các màn tại mục 3.1.5.1.2, 3.1.5.2.2.

##### 3.1.5.3.3 Mô tả chi tiết các thành phần

| Loại xuất | Tên tệp | Nội dung |
|----|----|----|
| Phiếu một yêu cầu | {Mã yêu cầu}.xlsx | Tiêu đề: Mã yêu cầu, Hạn báo giá, đơn vị đề xuất. Cột: STT, Mã yêu cầu báo giá, Hạng mục, Đơn vị tính, Số lượng, Hạn báo giá, Nhà cung cấp nhận. Cùng nội dung email ở bước 9 |
| Danh sách | Danh_sach_yeu_cau_bao_gia\_{YYYYMMDDHHmmss}.xlsx | Cột: STT, Mã yêu cầu báo giá, Mã ĐXMS, Mã hồ sơ, Tên ĐXMS, Đơn vị đề xuất, Lần, Số NCC nhận, Số báo giá đã nhận, Ngày gửi, Hạn báo giá, Trạng thái. Toàn bộ kết quả theo điều kiện đang áp và phạm vi xem, không chỉ trang đang xem, theo thứ tự đang hiển thị |

Phiếu không có đơn giá, báo giá của nhà cung cấp.

##### 3.1.5.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                  |
|------|----------------------------------------|
| 1    | Bấm nút xuất.                          |
| 2    | Hệ thống kiểm tra lại quyền, sinh tệp. |
| 3    | Trình duyệt tải tệp.                   |
| 4    | Hiện Toast "Xuất file thành công."     |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Không có dòng để xuất | Toast: "Không có dữ liệu để xuất." Không sinh tệp |
| Không có quyền, yêu cầu không còn trong phạm vi | "Bạn không có quyền thực hiện chức năng này." |
| Lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." (mục 4.6.7) |

**Đồng thời:** tệp theo dữ liệu tại thời điểm sinh tệp.

##### 3.1.5.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0152-01 | Yêu cầu có 5 hạng mục | Bấm \[Xuất file\] | Tệp {Mã}.xlsx có 5 dòng, không có đơn giá |
| AC-0152-02 | Đang lọc ra 25 yêu cầu, trang 10 dòng | Bấm \[Xuất excel\] | Tệp có 25 dòng, cùng thứ tự |
| AC-0152-03 | Bộ lọc không có kết quả | Bấm \[Xuất excel\] | Hiện "Không có dữ liệu để xuất.", không có tệp |
| AC-0152-04 | Hồ sơ Mật ngoài phạm vi của TT | TT xuất danh sách | Tệp không có yêu cầu đó |
| AC-0152-05 | CH gửi yêu cầu xuất trực tiếp |  | Hiện thông báo không có quyền |
| AC-0152-06 | Xuất thành công | Kiểm tra nhật ký (mục 2.3.5) | Có người, thời điểm, loại xuất |

### 3.1.6 Hồ sơ ĐXMS

Quản lý hồ sơ, là một lần xử lý của ĐXMS theo quy trình: tra cứu, khởi tạo, xem chi tiết, văn bản, kết quả ký, phiên bản. Trạng thái hồ sơ theo mục 2.3.1.2, giai đoạn theo mục 2.3.1.4. Hồ sơ Điều chỉnh dùng chung các màn này; phần tạo hồ sơ và so sánh tại nghiệp vụ 3.1.9.

Quy tắc của nghiệp vụ 3.1.6:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-06-01 | **Mã hồ sơ** do hệ thống sinh khi Lưu, dạng HS-YYYY-NNNN: YYYY là năm tạo, NNNN là số tăng dần trong năm, bắt đầu từ 0001. Không sửa được, không dùng lại kể cả lần lưu bị lỗi. Hồ sơ không có Dự thảo và không xóa được; hồ sơ chỉ kết thúc theo mục 2.3.1.2 |
| BR-DXMS-06-02 | **Thông tin hồ sơ giữ riêng.** Khi tạo, hồ sơ sao chép từ ĐXMS: Đơn vị đề xuất, Mức ưu tiên, Mật, Nhiệm vụ / Đề tài, dự án, Thời gian thực hiện, Mục đích. Mật là Có nếu ĐXMS hoặc hồ sơ gần nhất của ĐXMS là Có; hồ sơ Điều chỉnh xét hồ sơ căn cứ theo BR-DXMS-09-03. Hồ sơ Điều chỉnh sao chép từ hồ sơ Hoàn thành gần nhất (DTMS_CN_0172). Sau đó hồ sơ không đổi theo ĐXMS (BR-DXMS-01-04); Mật, Thời gian thực hiện, Mục đích, Nguồn vốn sửa trên hồ sơ tại bước 4. Danh sách và chi tiết hồ sơ hiện giá trị của hồ sơ. Đơn vị đề xuất của hồ sơ và của ĐXMS luôn trùng nhau vì ĐXMS khóa trường này khi đã có hồ sơ (BR-DXMS-01-03) |
| BR-DXMS-06-03 | **Tổng giá trị của hồ sơ** là Tổng giá trị theo cơ sở giá (BR-DXMS-04-10), có từ lần yêu cầu báo giá PASSED đầu tiên. Trước đó hệ thống hiện "-", không lấy Giá trị dự kiến của ĐXMS. Sau bước 10 không có thao tác đổi Tổng giá trị, kể cả khi tiếp thu ý kiến CQCM: dòng ý kiến thuộc mục Giá trị và cơ sở giá chỉ chọn được Bảo lưu (DTMS_CN_0158); cần đổi thì Hủy hồ sơ (BR-DXMS-C-28) và tạo hồ sơ mới. Hồ sơ Điều chỉnh hiện nhãn Giá trị sau điều chỉnh |
| BR-DXMS-06-04 | **Điều kiện tạo hồ sơ Phê duyệt.** Người tạo là ĐV của đơn vị đề xuất của ĐXMS (BR-DXMS-01-08). ĐXMS ở STOPPED (BR-DXMS-C-02, BR-DXMS-C-03); hồ sơ Phê duyệt đầu tiên tạo cùng luồng (BR-DXMS-01-11). Hệ thống kiểm tra lại khi Lưu. Hồ sơ luôn thuộc đúng một ĐXMS, không tạo hồ sơ tự do |
| BR-DXMS-06-05 | **Khởi tạo tiến trình.** Lưu thực hiện trọn một lần: sinh Mã, sao chép thông tin, khởi tạo tiến trình theo phiên bản đang hoạt động của quy trình theo Loại hồ sơ (BR-DXMS-C-05), giao bước 1 cho người tạo, ĐXMS sang APPROVING. Một phần lỗi thì không có gì được tạo. Hồ sơ giữ ngưỡng phân luồng tại lúc Lưu; ngưỡng đổi sau đó không áp cho hồ sơ này. Quy trình không có phiên bản đang hoạt động thì không Lưu được |
| BR-DXMS-06-07 | **Phiên bản hồ sơ.** Đánh số v1, v2… riêng cho từng hồ sơ. v1 sinh khi hoàn tất bước 11 hoặc 12 lần đầu. Tăng 1 mỗi lần hoàn tất bước 27, kể cả khi không đổi nội dung, vì sau bước 27 CQCM luôn kiểm tra, ký lại; khi hoàn tất bước 28; khi hoàn tất bước 11 hoặc 12 nếu hồ sơ đã qua bước 25. Bước 11, 12 làm lại do Chỉ huy đơn vị trả về trước lần gửi CQCM đầu tiên thì sửa trên v1. Phiên bản hiện tại là phiên bản lớn nhất. Mỗi phiên bản lưu nội dung biểu mẫu và các tệp văn bản tại thời điểm đó, không sửa được. Phiên bản tăng thì văn bản đã ký của phiên bản cũ sang OBSOLETE (BR-DXMS-C-11) |
| BR-DXMS-06-08 | **So sánh phiên bản.** So từng trường của biểu mẫu và từng bảng, chỉ hiện nội dung khác nhau. Tệp không so nội dung, chỉ báo tệp đã thay và cho tải hai bản. Chỉ so trong cùng một hồ sơ |
| BR-DXMS-06-09 | **Văn bản và kết quả ký.** Văn bản đầu ra có trạng thái theo mục 2.3.1.3 và gắn phiên bản hồ sơ. Mỗi lần trình ký lưu một dòng kết quả ký (BR-DXMS-C-21); lần gửi lại là dòng mới, dòng cũ giữ nguyên. Văn bản OBSOLETE vẫn xem, tải được, có nhãn trạng thái. Văn bản phê duyệt của hồ sơ là văn bản SIGNED ở bước 61, liên kết sang DTMS_CN_0139 |

#### 3.1.6.1 DTMS_CN_0153 Xem danh sách hồ sơ ĐXMS và tìm kiếm

##### 3.1.6.1.1 Thông tin chung chức năng

- **Mục đích:** Tra cứu hồ sơ trên toàn bộ ĐXMS trong phạm vi được xem.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV (mục 2.3.2). TĐ vào hồ sơ từ Việc của tôi.

- **Đường dẫn truy cập:** Đầu tư mua sắm \> Quản lý đề xuất mua sắm \> Luồng mua sắm \> tab Hồ sơ.

- **Tiền điều kiện:**

  - Đã đăng nhập, có quyền xem.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.6.1.2 Màn hình

<img src="media/rId249.png" style="width:6.25in;height:3.51562in" alt="Danh sách hồ sơ ĐXMS" />

<img src="media/rId252.png" style="width:6.25in;height:4.11133in" alt="Tìm kiếm nâng cao" />

Ảnh minh họa bố cục, chụp ở phương án Tách. Khác ảnh: màn là tab Hồ sơ của Danh sách luồng mua sắm; ô Từ khóa luôn hiện cùng khối nâng cao; nút trong khối là \[Đặt lại\]; Mã ĐXMS là link; có cột Giai đoạn, ô lọc Giai đoạn; dòng và nút chưa lọc theo quyền. Khi khác nhau, áp dụng mục 3.1.6.1.3.

##### 3.1.6.1.3 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tab** |  |  |  |  |
| 1 | Luồng mua sắm, Hồ sơ, Hồ sơ điều chỉnh | Tab | Input | – | Tab của Danh sách luồng mua sắm (DTMS_CN_0135); các thành phần dưới thuộc tab Hồ sơ. Tab Hồ sơ điều chỉnh theo DTMS_CN_0171. |
|  | **Tìm kiếm** |  |  |  |  |
| 2 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo mã hồ sơ, mã ĐXMS, tên hồ sơ". **Chứa**, không phân biệt hoa thường và dấu, Enter tương đương \[Tìm kiếm\] theo mục 4.3. Mapping: profile.code, proposal.code, profile.title. |
|  | **Tìm kiếm nâng cao** |  |  |  |  |
| 3 | Mã hồ sơ | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: profile.code. |
| 4 | Mã ĐXMS | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: proposal.code. |
| 5 | Tên hồ sơ | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: profile.title. |
| 6 | Loại hồ sơ | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. Phê duyệt ĐXMS, Điều chỉnh ĐXMS. Mapping: profile.type. |
| 7 | Đơn vị đề xuất | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**. Mapping: profile.unit_id. |
| 8 | Quy trình | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. MS01 (chưa xác định), MS01.01, MS01.02, MS01.03, MS02 (chưa xác định), MS02.01, MS02.02, MS02.03. Khớp theo luồng; hồ sơ "(dự kiến)" khớp theo luồng dự kiến (BR-DXMS-C-05). Mapping: profile.process_key, profile.branch, profile.branch_expected. |
| 9 | Trạng thái | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. Giá trị theo mục 2.3.1.2. Mapping: profile.status. |
| 10 | Giai đoạn | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. Giá trị theo mục 2.3.1.4. Chỉ khớp hồ sơ Đang xử lý. Mapping: Suy từ bước. |
| 11 | Mức ưu tiên | Dropdown một lựa chọn | Input | Rỗng | **Bằng**. Thường, Khẩn, Thượng khẩn. Mapping: profile.priority. |
|  | **Thao tác** |  |  |  |  |
| 12 | \[Thêm mới\] | Button | Input | – | Mở DTMS_CN_0154, ô ĐXMS để trống. Hiện với ĐV. |
| 13 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\], \[Tìm kiếm\], \[Đặt lại\] | Button | Input | – | Như DTMS_CN_0135. |
|  | **Lưới** |  |  |  |  |
| 14 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong tập kết quả. |
| 15 | Trạng thái | Tag | Output | Theo dữ liệu | Mục 2.3.1.2. Mapping: profile.status. |
| 16 | Mã hồ sơ | Link | Input | – | Mở DTMS_CN_0155. Mapping: profile.code. |
| 17 | Mã ĐXMS | Link | Input | – | Mở DTMS_CN_0137. Mapping: proposal.code. |
| 18 | Tên hồ sơ | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: profile.title. |
| 19 | Loại hồ sơ | Text | Output | Theo dữ liệu | Mapping: profile.type. |
| 20 | Đơn vị đề xuất | Text | Output | Theo dữ liệu | Mapping: profile.unit_id. |
| 21 | Tổng giá trị (tỷ đồng) | Number | Output | Theo dữ liệu | BR-DXMS-06-03, căn phải. Mapping: profile.total_value. |
| 22 | Mức ưu tiên | Text | Output | Theo dữ liệu | Mapping: profile.priority. |
| 23 | Quy trình | Text | Output | Theo dữ liệu | Mã luồng con theo BR-DXMS-C-05; chưa qua cổng sau bước 10 hiện "MS01" hoặc "MS02". Mapping: profile.process_key, profile.branch, profile.branch_expected. |
| 24 | Giai đoạn | Text | Output | Theo dữ liệu | Mục 2.3.1.4. Hồ sơ đã kết thúc hiện "-". Mapping: Suy từ bước. |
| 25 | Bước hiện tại | Text | Output | Theo dữ liệu | Tên bước đang xử lý; nhiều việc song song thì nối bằng dấu phẩy, không lặp. Hồ sơ đã kết thúc theo DTMS_CN_0137. Mapping: Theo tiến trình. |
| 26 | Ngày cập nhật | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: profile.updated_at. |

Không có cột Thao tác; xử lý công việc từ Việc của tôi. Phạm vi dòng theo BR-DXMS-01-09. Sắp xếp mặc định: Ngày cập nhật giảm dần, cùng ngày thì Mã hồ sơ giảm dần. Phân trang theo mục 4.4. Bấm vào dòng cũng mở DTMS_CN_0155.

##### 3.1.6.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                      |
|------|--------------------------------------------|
| 1    | Mở màn.                                    |
| 2    | Hệ thống tải hồ sơ trong phạm vi, trang 1. |
| 3    | Người dùng tìm kiếm, phân trang.           |
| 4    | Mở chi tiết hoặc thêm mới.                 |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có hồ sơ trong phạm vi | Giữ tiêu đề bảng, hiện "Chưa có dữ liệu" (mục 4.2) |
| Có dữ liệu, không khớp điều kiện | Hiện "Không tìm thấy dữ liệu phù hợp" |
| Không tải được | Tại vùng lưới: "Không thể tải dữ liệu. Vui lòng thử lại." Giữ điều kiện tìm (mục 4.6.3) |
| Không có quyền vào màn | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** hồ sơ mới, bước mới hiện ở lần tải sau.

##### 3.1.6.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0153-01 | CH đơn vị A; có hồ sơ của đơn vị A, B | Mở màn | Chỉ thấy hồ sơ đơn vị A; không có \[Thêm mới\] |
| AC-0153-02 | Có hồ sơ tên "Mua sắm máy chủ" | Nhập "may chu", Enter | Có hồ sơ đó, về trang 1 |
| AC-0153-03 | Đã nhập từ khóa, chọn Quy trình MS01.03 | Bấm \[Tìm kiếm\] | Kết quả thỏa đồng thời cả hai |
| AC-0153-04 | Đã có điều kiện tìm | Bấm \[Đặt lại\] | Điều kiện rỗng, danh sách đầy đủ, trang 1 |
| AC-0153-05 | Hồ sơ Mật; TT không thuộc danh sách xử lý | TT mở màn | Không có dòng đó |
| AC-0153-06 | CQ được giao một việc của hồ sơ X, không được giao hồ sơ Y | CQ mở màn | Chỉ có hồ sơ X |
| AC-0153-07 | Hồ sơ đang ở bước 46, 47 song song | Xem dòng | Bước hiện tại một tên "Xem xét, ký BM-05", Giai đoạn GĐ-11 Ký thẩm định |
| AC-0153-08 | Hồ sơ Hoàn thành | Xem dòng | Giai đoạn "-", Bước hiện tại "Kết thúc — đã phê duyệt" |
| AC-0153-09 | Hồ sơ ở bước 4, chưa có báo giá đạt | Xem dòng | Tổng giá trị "-" |
| AC-0153-10 | Lọc Giai đoạn GĐ-07 | Bấm \[Tìm kiếm\] | Không có hồ sơ đã kết thúc |
| AC-0153-11 | Người dùng TĐ | Mở đường dẫn màn | Hiện thông báo không có quyền |
| AC-0153-12 | ĐXMS đã đổi Mức ưu tiên sau khi tạo hồ sơ | Xem dòng hồ sơ | Hiện Mức ưu tiên của hồ sơ, không đổi theo ĐXMS |

#### 3.1.6.2 DTMS_CN_0154 Khởi tạo hồ sơ phê duyệt ĐXMS

##### 3.1.6.2.1 Thông tin chung chức năng

- **Mục đích:** Tạo hồ sơ Phê duyệt mới cho luồng đã dừng và khởi tạo tiến trình MS01. Hồ sơ Phê duyệt đầu tiên tạo cùng luồng tại DTMS_CN_0136.

- **Người dùng mục tiêu:** ĐV của đơn vị đề xuất.

- **Đường dẫn truy cập:** Chi tiết luồng mua sắm hoặc Chỉnh sửa ĐXMS \> \[Tạo hồ sơ\] (ô ĐXMS khóa); Danh sách luồng mua sắm \> tab Hồ sơ \> \[Thêm mới\] (chọn ĐXMS).

- **Tiền điều kiện:**

  - Có ít nhất một ĐXMS thỏa BR-DXMS-06-04.

- **Hậu điều kiện:**

  - Hồ sơ PROCESSING, tiến trình chạy, bước 1 giao người tạo, ĐXMS APPROVING. Luồng con xác định khi chạy (BR-DXMS-C-05).

##### 3.1.6.2.2 Màn hình

<img src="media/rId261.png" style="width:6.25in;height:3.51562in" alt="Thêm mới hồ sơ" />

<img src="media/rId264.png" style="width:6.25in;height:3.51562in" alt="Lỗi bỏ trống trường bắt buộc" />

Ảnh minh họa bố cục. Khác ảnh: ô Quy trình chỉ đọc, hiện MS01 hoặc MS02 (BR-DXMS-C-05). Câu thông báo theo mục 3.1.6.2.4. Nhãn nút là \[Hủy\].

##### 3.1.6.2.3 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Mã hồ sơ | Textbox khóa | Output | Placeholder "Hệ thống tự sinh" | BR-DXMS-06-01. Mapping: profile.code. |
| 2 | Tên hồ sơ \* | Textbox \[500\] | Input | Tên ĐXMS đã chọn | Placeholder "Nhập tên hồ sơ". Sửa được; đổi ĐXMS thì tự cập nhật nếu người dùng chưa sửa tay. Không kiểm trùng, như BR-DXMS-01-02. Mapping: profile.title. |
| 3 | Loại hồ sơ \* | Dropdown | Input | Tự chọn khi ĐXMS chỉ tạo được một loại | Phê duyệt ĐXMS; Điều chỉnh ĐXMS. Chọn Điều chỉnh ĐXMS thì các trường riêng và cách lưu theo DTMS_CN_0172. Mapping: profile.type. |
| 4 | Quy trình | Textbox khóa | Output | Theo Loại hồ sơ | "MS01 — Phê duyệt đề xuất mua sắm" hoặc "MS02 — Điều chỉnh đề xuất mua sắm"; chưa chọn Loại thì rỗng. Người dùng không chọn quy trình (BR-DXMS-C-05). Mapping: profile.process_key. |
| 5 | ĐXMS \* | Dropdown, có tìm kiếm | Input | ĐXMS đang mở, hoặc rỗng | Hiện "{Mã} - {Tên}". Mở từ ĐXMS thì khóa. Chỉ liệt kê ĐXMS thuộc đơn vị của người dùng, ở STOPPED, APPROVED. Đổi ĐXMS thì xóa Loại hồ sơ. Mapping: profile.proposal_id. |
| 6 | Người tạo | Textbox khóa | Output | Người dùng hiện tại | Không sửa. Mapping: profile.created_by. |
| 7 | \[Lưu\] | Button | Input | – | Kiểm tra, khởi tạo theo BR-DXMS-06-05, mở công việc bước 1. Chống bấm lặp, mã yêu cầu theo mục 4.6.6; gửi lại cùng mã không tạo hồ sơ thứ hai, xử lý như DTMS_CN_0136. |
| 8 | \[Hủy\] | Button | Input | – | Về màn đã mở trước đó. Đã nhập thì hỏi như DTMS_CN_0136. |
| 9 | Nút quay lại | Icon | Input | – | Như \[Hủy\]. |

##### 3.1.6.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Mở màn. |
| 2 | Chọn ĐXMS nếu chưa khóa, Loại hồ sơ; sửa Tên. |
| 3 | Bấm \[Lưu\]. |
| 4 | Hệ thống kiểm tra quyền, trạng thái ĐXMS, hiện lỗi tại tất cả các trường sai cùng lúc. |
| 5 | Khởi tạo theo BR-DXMS-06-05, ghi nhật ký. |
| 6 | Hiện Toast, mở công việc bước 1. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Nội dung thông báo |
|----|----|
| Bỏ trống Tên hồ sơ | Inline: "Vui lòng nhập Tên hồ sơ." |
| Chưa chọn ĐXMS | Inline: "Vui lòng chọn ĐXMS." |
| Chưa chọn Loại hồ sơ | Inline: "Vui lòng chọn Loại hồ sơ." |
| Vượt độ dài | Không nhận thêm ký tự, inline: "Không được nhập quá {maxlength} ký tự." |
| ĐXMS có hồ sơ đang xử lý | Inline tại Loại hồ sơ: "ĐXMS đang có hồ sơ đang xử lý." |
| Chọn Phê duyệt khi ĐXMS APPROVED | Inline tại Loại hồ sơ: "ĐXMS đã được phê duyệt. Chọn loại hồ sơ Điều chỉnh ĐXMS." |
| Chọn Điều chỉnh khi ĐXMS chưa phê duyệt | Inline tại Loại hồ sơ: "ĐXMS chưa được phê duyệt nên chưa tạo được hồ sơ điều chỉnh." |
| Không có quyền, ĐXMS đã đổi sang đơn vị khác | "Bạn không có quyền thực hiện chức năng này." |
| Thành công | Toast: "Thêm mới hồ sơ thành công." |
| Lỗi khởi tạo tiến trình, lỗi xử lý | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập, không có hồ sơ |
| Timeout, mất kết nối | Không báo thành công, giữ form. Bấm \[Lưu\] lại không tạo hồ sơ thứ hai (mục 4.6.7) |

**Đồng thời:** hai ĐV cùng tạo hồ sơ cho một ĐXMS thì người đến trước được tạo; người sau nhận "ĐXMS đang có hồ sơ đang xử lý."

##### 3.1.6.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0154-01 | ĐXMS STOPPED, Loại Phê duyệt ĐXMS | Bấm \[Lưu\] | Có hồ sơ PROCESSING chạy MS01, Quy trình hiện "MS01", Mã đúng dạng, bước 1 giao người tạo, ĐXMS APPROVING, mở công việc bước 1 |
| AC-0154-02 | Mở từ Chi tiết luồng mua sắm STOPPED | Mở màn | Ô ĐXMS khóa, Loại hồ sơ là Phê duyệt ĐXMS, Tên bằng Tên ĐXMS |
| AC-0154-03 | ĐXMS STOPPED | Tạo hồ sơ Phê duyệt | Tạo được, ĐXMS về APPROVING |
| AC-0154-04 | Bỏ trống mọi trường | Bấm \[Lưu\] | Không lưu, hiện đồng thời ba thông báo inline |
| AC-0154-05 | Người khác vừa tạo hồ sơ cho ĐXMS | Bấm \[Lưu\] | Không lưu, hiện "ĐXMS đang có hồ sơ đang xử lý." |
| AC-0154-06 | Tiến trình không khởi tạo được | Bấm \[Lưu\] | Không có hồ sơ, ĐXMS giữ trạng thái, hiện Toast lỗi |
| AC-0154-07 | Lần Lưu trước đã tạo hồ sơ, mất phản hồi | Bấm \[Lưu\] lại | Không có hồ sơ thứ hai |
| AC-0154-08 | Người tạo ĐXMS không thuộc đơn vị đề xuất | Gửi yêu cầu tạo hồ sơ trực tiếp | Hiện thông báo không có quyền |
| AC-0154-09 | Danh sách luồng mua sắm của đơn vị có ĐXMS APPROVING | Mở ô ĐXMS | Không có ĐXMS đó |
| AC-0154-11 | Ngưỡng 160 tỷ; hồ sơ Tổng 170 tỷ, mọi căn cứ đã được Tập đoàn duyệt, không có Kế hoạch SXKD | Qua cổng sau bước 10 | Sang bước 12, luồng dự kiến MS01.02 (BR-DXMS-C-05, BR-DXMS-C-07) |
| AC-0154-18 | Hồ sơ trước đã đổi Mật sang Có, ĐXMS vẫn Không, ĐXMS STOPPED | Tạo hồ sơ Phê duyệt mới | Hồ sơ mới Mật = Có |
| AC-0154-14 | Ngưỡng đổi từ 160 sang 200 tỷ sau khi tạo hồ sơ | Hồ sơ qua cổng sau bước 10 với Tổng 170 tỷ | Sang bước 12 theo 160 tỷ đã giữ |

#### 3.1.6.3 DTMS_CN_0155 Xem hồ sơ ĐXMS, tài liệu và kết quả phê duyệt

##### 3.1.6.3.1 Thông tin chung chức năng

- **Mục đích:** Tập hợp dữ liệu, tiến trình, tài liệu, văn bản, kết quả ký và lịch sử của một hồ sơ.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Danh sách hồ sơ \> Mã hồ sơ; Chi tiết luồng mua sắm \> Mã hồ sơ; Danh sách yêu cầu báo giá \> Mã hồ sơ; Giám sát tiến trình (DTMS_CN_0132) \> Mã hồ sơ; công việc trong Việc của tôi.

- **Tiền điều kiện:**

  - Hồ sơ còn tồn tại, người dùng được thấy hồ sơ (BR-DXMS-01-09).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.6.3.2 Màn hình

<img src="media/rId273.png" style="width:6.25in;height:5.46224in" alt="Chi tiết hồ sơ" />

<img src="media/rId276.png" style="width:6.25in;height:3.51562in" alt="Chi tiết BPMN" />

Ảnh minh họa bố cục. Khác ảnh: có \[Thẩm định và ý kiến\], Giai đoạn, Phiên bản hiện tại, Vòng xử lý; bảng Văn bản đầu ra có thêm cột; có khối Kết quả ký. Khi khác nhau, áp dụng mục 3.1.6.3.3.

##### 3.1.6.3.3 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Thao tác** |  |  |  |  |
| 1 | \[Xem BPMN\] | Button | Input | – | Mở màn Chi tiết BPMN. |
| 2 | \[Hủy hồ sơ\] | Button | Input | – | Hiện với Người phụ trách hồ sơ, TT khi hồ sơ PROCESSING; theo mục 2.3.2. |
| 3 | \[Thẩm định và ý kiến\] | Button | Input | – | Mở màn tại DTMS_CN_0157. Hiện với ĐV, CH, TT, CQ, PG, TV. |
| 4 | Nút quay lại | Button | Input | – | Về màn đã mở trước đó. Vào thẳng bằng đường dẫn thì về Danh sách; người không có quyền Danh sách về Việc của tôi. |
|  | **Thông tin chung** |  |  |  |  |
| 5 | Mã hồ sơ, Tên hồ sơ, Mã ĐXMS (link), Loại hồ sơ, Quy trình | Text | Output | Theo dữ liệu | Quy trình hiện "{Mã} — {Tên}" của MS01 hoặc MS02. Mapping: profile.\*. |
| 6 | Trạng thái, Giai đoạn, Bước hiện tại | Text | Output | Theo dữ liệu | Như DTMS_CN_0153. Mapping: Theo tiến trình. |
| 7 | Mức ưu tiên, Đơn vị đề xuất, Thời gian thực hiện, Nguồn vốn, Mật | Text | Output | Theo dữ liệu | Giá trị của hồ sơ (BR-DXMS-06-02). Mapping: profile.\*. |
| 8 | Người phụ trách | Text | Output | Theo dữ liệu | Người tạo hồ sơ. Mapping: profile.created_by. |
| 9 | Tổng giá trị (gồm VAT) | Text | Output | Theo dữ liệu | BR-DXMS-06-03, kèm đơn vị tỷ đồng. Mapping: profile.total_value. |
| 10 | KPI toàn trình | Text | Output | Theo dữ liệu | "{đã dùng} / {giới hạn} ngày làm việc", giới hạn theo tham số Giới hạn KPI toàn trình (mục 2.3.6), từ T0 của lần thẩm định đầu tiên, không đặt lại ở lần sau. Chưa tới bước 18 hiện "-". Mapping: Tính. |
| 11 | Phiên bản hiện tại | Text | Output | Theo dữ liệu | Link mở DTMS_CN_0156. Chưa có phiên bản hiện "-". Mapping: Tính. |
| 12 | Vòng xử lý | Text | Output | Theo dữ liệu | "{n}". Vượt 2 thì kèm nhãn Vượt ngưỡng (BR-DXMS-C-15). Mapping: Tính. |
| 13 | Luồng | Text | Output | Theo dữ liệu | Luồng con theo BR-DXMS-C-05: chưa qua cổng sau bước 10 hiện "Chưa xác định"; đã qua cổng, chưa xong bước 48 hiện luồng dự kiến kèm "(dự kiến)". Mapping: profile.branch, profile.branch_expected. |
| 14 | Hồ sơ căn cứ, Lần điều chỉnh, Lý do điều chỉnh | Text | Output | Theo dữ liệu | Chỉ hồ sơ Điều chỉnh; cùng các khối So sánh trước – sau, Tác động điều chỉnh tại DTMS_CN_0173. Mapping: profile.base_profile_id, profile.adjust_no, profile.branch, profile.adjust_reason. |
|  | **Quy trình** |  |  |  |  |
| 15 | Dải bước | Text | Output | Theo dữ liệu | Các bước người dùng hồ sơ đi qua, theo cột Áp dụng mục 7.1. Mỗi bước có tên, tác nhân, trạng thái Đã xong, Đang xử lý, Sắp tới. Bước không áp dụng cho luồng của hồ sơ theo cột Áp dụng mục 7.1 thì không hiện. Trước cổng sau bước 10 hiện bước 1–10; các bước còn lại Sắp tới theo luồng ước tính, có ghi chú "Các bước sau bước 10 là dự kiến": hồ sơ Phê duyệt ước tính theo Giá trị dự kiến của ĐXMS, không có thì chỉ hiện bước 1–10; hồ sơ Điều chỉnh theo Giá trị sau điều chỉnh dự kiến ở bước 4 (chưa nhập thì theo phía của hồ sơ căn cứ, BR-DXMS-09-07). Sau cổng theo luồng hoặc luồng dự kiến (BR-DXMS-C-05). Bước đã qua khi hồ sơ đi lặp giữ Đã xong. Mapping: Theo tiến trình. |
|  | **Danh sách tài liệu** |  |  |  |  |
| 16 | STT, Thao tác (Tải xuống), Tên tài liệu, Ngày tạo | Data Grid | Output | Theo dữ liệu | Sắp Ngày tạo tăng dần. Tài liệu đầu vào của hồ sơ: căn cứ, bảng hạng mục, kết quả rà soát, báo giá, BM-03 ký nháy, biên bản họp, tệp tải lên. Biên bản họp chỉ hiện với vai trò có quyền DTMS_CN_0160. Chỉ xem. Mapping: profile_file.\*. |
| 17 | \[Chọn mẫu tài liệu\] | Button | Input | – | Xem, tải mẫu tài liệu của quy trình, như màn xử lý công việc. |
|  | **Văn bản đầu ra** |  |  |  |  |
| 18 | STT, Thao tác (Tải xuống), Tên tài liệu (bấm để xem), Phiên bản, Trạng thái, Số văn bản, Ngày ký, Ngày tạo | Data Grid | Output | Theo dữ liệu | Sắp theo thứ tự bước trong mục 7.1, cùng bước thì Phiên bản giảm dần. Văn bản hệ thống sinh theo bước, mục 7.1: BM-01 hoặc BM-09, BM-02, Checklist, BM-03, BM-04 (mỗi bản một dòng), BM-05, BM-06, BM-07, BM-08. BR-DXMS-06-09, BR-DXMS-07-04. Không có giá trị thì hiện "-". Mapping: profile_doc.\*. |
|  | **Kết quả ký** |  |  |  |  |
| 19 | STT, Văn bản, Phiên bản, Người ký, Mã yêu cầu, Thời điểm gửi, Trạng thái, Thời điểm nhận kết quả, Lần gửi | Data Grid | Output | Theo dữ liệu | Sắp theo Thời điểm gửi giảm dần, không phân trang. Hồ sơ Mật ký bản giấy: Mã yêu cầu hiện "Ký bản giấy", người nhập là người xử lý bước. BR-DXMS-06-09. Mapping: sign_request.\*. |
|  | **Văn bản phê duyệt** |  |  |  |  |
| 20 | Hiện dòng "{Tên văn bản} — {Số} — {Ngày ký}" kèm link tới tab Kết quả & văn bản phê duyệt | Text | Output | Theo dữ liệu | Hiện khi hồ sơ COMPLETED, theo DTMS_CN_0139. Mapping: Kết quả ký. |
|  | **Lịch sử hồ sơ** |  |  |  |  |
| 21 | Mỗi lượt xử lý: Tên bước, Trạng thái (Hoàn thành, Chưa xử lý), Người thực hiện, Thời gian DD/MM/YYYY HH:mm; \[Xem nhận xét\] khi có | Data Grid | Output | Theo dữ liệu | Sắp thời gian tăng dần, không phân trang. Gồm mọi lượt lặp. \[Xem nhận xét\] theo BR-DXMS-07-04. Mapping: Nhật ký. |

**Màn Chi tiết BPMN:** Thông tin chung như trên ở 3 cột; tiêu đề "Bước hiện tại: {Tên bước}" kèm quy trình; sơ đồ của đúng phiên bản quy trình hồ sơ đang chạy, tô bước đang xử lý, nhiều việc song song thì tô tất cả; kéo để di chuyển, cuộn chuột để phóng to, thu nhỏ; \[Xem quy trình\] về Chi tiết hồ sơ. Hồ sơ đã kết thúc thì không tô bước nào, hiện toàn bộ sơ đồ vừa khung.

##### 3.1.6.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Mở màn. |
| 2 | Hệ thống kiểm tra quyền, tải dữ liệu. |
| 3 | Người dùng xem, tải tệp, xem văn bản, mở Chi tiết BPMN, Thẩm định và ý kiến, ĐXMS. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Hồ sơ không tồn tại | "Không tìm thấy hồ sơ." Có nút quay lại |
| Không có quyền xem, gồm hồ sơ Mật ngoài phạm vi | "Bạn không có quyền thực hiện chức năng này." |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Chưa có tài liệu, văn bản, kết quả ký | Bảng tương ứng hiện "Chưa có dữ liệu" (mục 4.2) |
| Tải tệp lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |
| Không tải được sơ đồ | Tại vùng sơ đồ: "Không thể tải dữ liệu. Vui lòng thử lại." Thông tin chung vẫn hiện (mục 4.6.3) |

**Đồng thời:** bước chuyển, kết quả ký về trong lúc xem thì hiện ở lần tải sau.

##### 3.1.6.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0155-01 | Hồ sơ MS01.02 đang ở bước 42 | Mở màn | Dải bước không có bước 49–56; bước 42 Đang xử lý; Giai đoạn GĐ-11 |
| AC-0155-02 | Hồ sơ MS01.03 | Mở màn | Dải bước không có bước 12, 41–59; văn bản có BM-09, không có BM-05 |
| AC-0155-03 | BM-04 v1 đã ký, hồ sơ đã sang v2 | Xem Văn bản đầu ra | Dòng BM-04 v1 ở Không còn hiệu lực, vẫn tải được |
| AC-0155-04 | VOffice báo lỗi một lần, gửi lại thành công | Xem Kết quả ký | Hai dòng: Lỗi gửi và Đã ký, Lần gửi 1 và 2 |
| AC-0155-05 | Hồ sơ Mật ký bản giấy, đã nhập kết quả | Xem Kết quả ký | Mã yêu cầu "Ký bản giấy", Trạng thái Đã ký |
| AC-0155-06 | Hồ sơ COMPLETED | Mở màn | Có dòng Văn bản phê duyệt, link mở đúng tab của ĐXMS |
| AC-0155-07 | Hồ sơ Phê duyệt Tổng 200 tỷ, đang ở bước 20 | Mở màn | Luồng hiện luồng dự kiến kèm "(dự kiến)"; dải bước theo luồng đó |
| AC-0155-08 | CQ không thuộc danh sách xử lý | Mở bằng đường dẫn | Hiện thông báo không có quyền |
| AC-0155-09 | TĐ được giao bước 53 | Mở màn | Xem được; không có \[Thẩm định và ý kiến\]; có link Mã ĐXMS |
| AC-0155-10 | Hồ sơ đang ở bước 46, 47 song song | Mở Chi tiết BPMN | Tô cả hai bước |
| AC-0155-11 | Mã không tồn tại | Mở bằng đường dẫn | Hiện "Không tìm thấy hồ sơ." |
| AC-0155-12 | Hồ sơ tạo bằng form, đang ở bước 4 | Mở màn | KPI toàn trình, Phiên bản hiện tại, Tổng giá trị đều hiện "-" |
| AC-0155-13 | CQ của Ban Pháp chế, hồ sơ có BM-04 của Ban Tài chính | Xem Văn bản đầu ra, Kết quả ký | Không có dòng BM-04 của Ban Tài chính |
| AC-0155-14 | Hồ sơ PROCESSING, Người phụ trách bấm \[Hủy hồ sơ\], nhập Lý do | Xác nhận | Hồ sơ CANCELED, công việc đang mở bị hủy, Toast "Hủy hồ sơ thành công." |
| AC-0155-15 | CQ mở Chi tiết hồ sơ | Xem thao tác | Không có \[Hủy hồ sơ\] |

#### 3.1.6.4 DTMS_CN_0156 Tra cứu và so sánh phiên bản hồ sơ ĐXMS

##### 3.1.6.4.1 Thông tin chung chức năng

- **Mục đích:** Xem các phiên bản của hồ sơ, biết phiên bản hiện tại, tình trạng BM-04, và nội dung đổi giữa hai phiên bản.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết luồng mua sắm \> tab Lịch sử phiên bản; Chi tiết hồ sơ \> Phiên bản hiện tại.

- **Tiền điều kiện:**

  - Được thấy ĐXMS. Nội dung lọc theo BR-DXMS-01-09.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.6.4.2 Màn hình

<img src="media/rId285.png" style="width:6.25in;height:3.51562in" alt="Lịch sử phiên bản" />

Ảnh minh họa bố cục. Khác ảnh: có ô chọn Hồ sơ, hai ô chọn phiên bản, Tệp; nút \[Chỉnh sửa\] chỉ hiện với ĐV của đơn vị đề xuất.

##### 3.1.6.4.3 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Chọn hồ sơ** |  |  |  |  |
| 1 | Hồ sơ | Dropdown một lựa chọn | Input | Hồ sơ tạo gần nhất | Các hồ sơ của ĐXMS người dùng được thấy, gồm Phê duyệt, Điều chỉnh, đã kết thúc. Mặc định hồ sơ tạo gần nhất. Hiện "{Mã} — {Loại hồ sơ}". Mở từ Chi tiết hồ sơ thì chọn sẵn hồ sơ đó. Mapping: profile.id. |
|  | **Lịch sử** |  |  |  |  |
| 2 | STT | Number | Output | Theo dữ liệu |  |
| 3 | Phiên bản | Text | Output | Theo dữ liệu | v1, v2…. Mapping: profile_version.no. |
| 4 | Thời điểm | DateTime \[DD/MM/YYYY HH:mm\] | Output | Theo dữ liệu | Hoàn tất bước sinh phiên bản. Mapping: profile_version.created_at. |
| 5 | Người cập nhật | Text | Output | Theo dữ liệu | Mapping: profile_version.created_by. |
| 6 | Nội dung | Text | Output | Theo dữ liệu | "Lập dự thảo hồ sơ ĐXMS"; "Hoàn chỉnh theo ý kiến CQCM"; "Giải trình ý kiến CQCM"; "Xử lý lại theo kết luận"; "Sửa theo chỉ đạo Chỉ huy đơn vị"; "Hoàn chỉnh theo lý do trả lại". Mapping: profile_version.reason. |
| 7 | BM-04 hợp lệ / CQCM | Text | Output | Theo dữ liệu | x là số CQCM có BM-04 hợp lệ trên phiên bản đó, tính tại lúc phiên bản đó còn là hiện tại; n là số CQCM của lần thẩm định gắn với phiên bản đó. Phiên bản cũ ghi kèm "(hết hiệu lực)". Chưa có danh sách CQCM hiện "-". Mapping: Tính. |
| 8 | Hiện tại | Tag | Output | Theo dữ liệu | Hiện ở phiên bản lớn nhất. Mapping: Tính. |
|  | **So sánh** |  |  |  |  |
| 9 | Phiên bản A, Phiên bản B | Dropdown | Input | Phiên bản liền trước; phiên bản hiện tại | Mặc định phiên bản liền trước và phiên bản hiện tại. Hiện khi hồ sơ có từ hai phiên bản. |
| 10 | STT, Nội dung, Phiên bản A, Phiên bản B | Bảng | Output | Theo dữ liệu | BR-DXMS-06-08. Nội dung: "{Văn bản} · {Trường}". Phần bỏ gạch ngang, phần mới màu nhấn. Mapping: Bản lưu của phiên bản. |
| 11 | Tệp | Icon | Input | – | Với dòng là tệp: tải bản A, bản B. Mapping: Bản lưu của phiên bản. |

##### 3.1.6.4.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                         |
|------|---------------------------------------------------------------|
| 1    | Mở tab.                                                       |
| 2    | Hệ thống tải hồ sơ, phiên bản.                                |
| 3    | Người dùng đổi Hồ sơ, chọn hai phiên bản.                     |
| 4    | Hệ thống tính và hiện phần khác nhau, không cần bấm thêm nút. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Hồ sơ chưa có phiên bản | "Chưa có phiên bản hồ sơ. Phiên bản đầu được tạo khi lập dự thảo hồ sơ ĐXMS." |
| Có hồ sơ nhưng mọi hồ sơ bị ẩn theo BR-DXMS-01-09 | Tại tab: "Chưa có dữ liệu" |
| Chọn hai phiên bản giống nhau | Bảng so sánh: "Vui lòng chọn hai phiên bản khác nhau." |
| Hai phiên bản không có khác biệt | Bảng so sánh: "Hai phiên bản không có nội dung khác nhau." |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Tải tệp lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |

**Đồng thời:** phiên bản mới hiện ở lần tải sau; bảng đang so giữ hai phiên bản đã chọn.

##### 3.1.6.4.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0156-01 | Hồ sơ vừa hoàn tất bước 12 lần đầu | Mở tab | Một dòng v1, Hiện tại; không có bảng so sánh |
| AC-0156-02 | Chỉ huy đơn vị trả về bước 12 trước khi gửi CQCM | Hoàn tất lại bước 12, mở tab | Vẫn chỉ có v1 |
| AC-0156-03 | Hồ sơ v1 có 3/3 BM-04 hợp lệ, không có Bảo lưu, ĐV đã sửa dự thảo | Hoàn tất bước 27 | Có v2, Hiện tại, "0/3"; dòng v1 "3/3 (hết hiệu lực)" |
| AC-0156-12 | Mọi BM-04 đều OK, ĐV không sửa gì | Hoàn tất bước 27, mở so sánh | Có v2, "0/{n}" tới khi CQCM ký lại; bảng hiện "Hai phiên bản không có nội dung khác nhau." |
| AC-0156-04 | Hồ sơ v1, có dòng Bảo lưu | Hoàn tất bước 28 | Có v2, Nội dung "Giải trình ý kiến CQCM" |
| AC-0156-05 | Hồ sơ đã có BM-04, kết luận Yêu cầu xử lý lại | Hoàn tất bước 11 hoặc 12 | Phiên bản tăng 1 |
| AC-0156-06 | Hai phiên bản khác Biện pháp thực hiện | Mở so sánh | Một dòng, phần cũ gạch ngang, phần mới màu nhấn |
| AC-0156-07 | Chọn v2 ở cả hai ô | Xem bảng | Hiện câu chọn hai phiên bản khác nhau |
| AC-0156-08 | ĐXMS có hồ sơ Phê duyệt và Điều chỉnh, mỗi hồ sơ có v1 | Đổi ô Hồ sơ | Danh sách phiên bản đổi theo; không so chéo hai hồ sơ |
| AC-0156-09 | PG chỉ được giao hồ sơ Điều chỉnh | Mở tab | Ô Hồ sơ chỉ có hồ sơ Điều chỉnh |
| AC-0156-10 | Dòng so sánh là tệp BM-01 đã thay | Bấm icon | Tải được cả hai bản |
| AC-0156-11 | Bản v2 là phiên bản lớn nhất, đang ở bước 35 | Mở tab | BM-04 hợp lệ / CQCM của v2 là "0/{n}" cho tới khi có kết quả ký lại |

### 3.1.7 Thẩm định và xử lý ý kiến

Theo dõi các CQCM của hồ sơ, kết quả thẩm định, cách đơn vị đề xuất xử lý từng ý kiến, số vòng và kết quả họp. Các chức năng này dùng chung màn **Thẩm định và ý kiến** \[RIÊNG\], mở từ Chi tiết hồ sơ (DTMS_CN_0155), gồm bốn tab, chỉ đọc. Dữ liệu nhập tại các bước quy trình: chọn và xác nhận CQCM ở DTMS_CN_0163; lập BM-04 ở DTMS_CN_0164; quyết định, giải trình ở DTMS_CN_0158; họp, kết luận ở DTMS_CN_0160. Rẽ nhánh sau các bước này theo DTMS_CN_0165, mục 7.2.

| Tab                | Chức năng    | ĐV, CH, TT, CQ, TV | PG    | TĐ    |
|--------------------|--------------|--------------------|-------|-------|
| Cơ quan và kết quả | DTMS_CN_0157 | Có                 | Có    | Không |
| Xử lý ý kiến       | DTMS_CN_0158 | Có                 | Không | Không |
| Vòng và lịch sử    | DTMS_CN_0159 | Có                 | Không | Không |
| Họp, kết luận      | DTMS_CN_0160 | Có                 | Không | Không |

Quy tắc của nghiệp vụ 3.1.7:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-07-01 | **Lần thẩm định** là số lần hồ sơ qua bước 18, bắt đầu từ 1. Mỗi lần có danh sách CQCM, Hạn góp ý, Đầu mối tiếp nhận, BM-03 riêng. Quay lại bước 19 do Chỉ huy CQCM không đồng ý, xung đột ý kiến, hoặc BM-04 bị từ chối ký thì vẫn cùng lần. "Lần mới nhất" là lần đã gửi; danh sách đang lập ở bước 16, 17 chưa thành lần. Lần thẩm định khác Vòng xử lý: vòng chỉ tăng ở bước 29 (BR-DXMS-C-15), còn lần tăng cả khi hồ sơ xử lý lại theo kết luận họp |
| BR-DXMS-07-02 | **Xác nhận danh sách CQCM.** Trạng thái: Chờ xác nhận khi ĐV gửi ở bước 16; Đã xác nhận khi TTMS đồng ý ở bước 17; Trả lại khi TTMS không đồng ý, kèm lý do. Lần trả lại được lưu, không ghi đè. CQCM bắt buộc theo BR-DXMS-C-12 có nhãn Bắt buộc |
| BR-DXMS-07-03 | **Tính hợp lệ BM-04.** Hợp lệ khi đủ điều kiện BR-DXMS-C-13, và là bản ký sau cùng của CQCM đó trên phiên bản hiện tại. Không hợp lệ thì ghi lý do: Chưa có kết quả ký; Đang rà soát xung đột; Từ chối (CQCM đó quay lại bước 19, hoặc bước 35 nếu là ký lại, mục 7.2); Đã hủy; Phiên bản cũ; Có bản ký mới hơn; CQCM không còn trong danh sách. BM-04 ký lại ở bước 36 là một bản mới của cùng lần thẩm định. Bộ đếm "{x}/{n}": x là số CQCM có BM-04 hợp lệ, n là số CQCM trong danh sách đã xác nhận của lần mới nhất |
| BR-DXMS-07-04 | **Ý kiến giữa các CQCM.** CQ chỉ thấy BM-04, ý kiến, nhận xét của cơ quan mình. Ở dòng cơ quan khác, CQ thấy Tên, trạng thái xác nhận, tính hợp lệ, không thấy Số ý kiến, nội dung, tệp. Áp dụng ở mọi màn, gồm Chi tiết đề xuất mua sắm, Chi tiết hồ sơ, Thẩm định và ý kiến, kể cả sau khi đủ BM-04. Các vai trò khác được xem hồ sơ thấy toàn bộ, gồm TĐ và ĐV, CH khác đơn vị đề xuất thuộc danh sách xử lý. Không thuộc quy tắc này: BM-02 và Phụ lục 1 vì gửi chung các CQCM, gồm cả ở So sánh phiên bản; BM-05; biên bản, kết luận họp. Người có nhiều vai trò theo mục 2.3.2; người TTMS xử lý bước 19, 20, 35, 36 cho phần của TTMS thấy toàn bộ như vai trò TT |
| BR-DXMS-07-05 | **Dòng ý kiến.** Khi hồ sơ tới bước 25, mỗi mục đánh giá Không OK trên BM-04 hợp lệ của lần thẩm định hiện tại sinh một dòng, gồm CQCM, Lần, Phiên bản, Mục, Nội dung nhận xét, Hướng dẫn sửa. Dòng đã có không sinh lại khi hồ sơ qua bước 25 lần nữa. Hồ sơ bị trả lại sau ký (BR-DXMS-C-20) sinh thêm một dòng từ lý do trả lại, nguồn là "{Người trả lại} — bước {n}", không có Mục. Mỗi dòng có Quyết định và Kết quả. **Quyết định:** Chờ quyết định PENDING, Tiếp thu ACCEPTED, Bảo lưu RESERVED. **Kết quả:** Đang xử lý IN_PROGRESS, Đã xử lý RESOLVED, Theo kết luận CONCLUDED, Chuyển lần sau CARRIED, Không còn áp dụng DROPPED |
| BR-DXMS-07-06 | **Quyết định ở bước 26.** ĐV quyết định mọi dòng Đang xử lý. Có ít nhất một dòng Bảo lưu thì sang bước 28; không có thì sang bước 27. Không có dòng Đang xử lý thì bảng trống, \[Xác nhận\] sang bước 27. Hồ sơ bị trả lại sau ký có dòng từ lý do trả lại, ĐV cũng chọn Tiếp thu hoặc Bảo lưu; Bảo lưu thì đi nhánh giải trình như ý kiến CQCM. Sửa được quyết định cho tới khi hoàn thành bước 26 |
| BR-DXMS-07-07 | **Giải trình ở bước 28.** Bảng gồm mọi dòng Đang xử lý, nhóm theo CQCM, đúng bố cục Phụ lục 1 BM-02. Mọi dòng có Nội dung giải trình. Có dòng Tiếp thu thì ĐV sửa dự thảo trong cùng bước này. Hoàn thành thì hệ thống sinh BM-02 và Phụ lục 1, tăng phiên bản (BR-DXMS-06-07); bước 29 tăng vòng. Hoàn thành bước 27 ở mọi nhánh, hệ thống sinh lại BM-02 và Phụ lục 1 từ các dòng hiện có, kèm kết luận họp nếu có; dòng Tiếp thu chưa có giải trình để trống. Phần sinh lại này thuộc phiên bản mới của bước 27 |
| BR-DXMS-07-08 | **Kết quả của dòng.** Đã xử lý: CQCM chọn Đạt ở bước 35, hoặc BM-04 lần sau của CQCM đó đánh giá OK ở mục đó. Chuyển lần sau: BM-04 lần sau của CQCM đó vẫn Không OK ở mục đó, hệ thống sinh dòng mới. Theo kết luận: dòng đang Bảo lưu khi kết quả họp là Đã thống nhất, hoặc kết luận là Thống nhất phương án. Kết luận Yêu cầu xử lý lại không đổi Kết quả; dòng được xét tiếp ở BM-04 lần sau. CQCM chọn Chưa đạt ở bước 35: dòng được chấm Chưa đạt về Đang xử lý; dòng chấm Đạt giữ Đã xử lý. Không còn áp dụng: dòng Đang xử lý của CQCM không có trong danh sách lần mới, khi TTMS xác nhận lần đó. Dòng từ lý do trả lại: đã Bảo lưu và đã giải trình thì không hiện lại ở bước 26, không tính vào cổng sau bước 26; người trả lại đồng ý ở lần ký sau thì Đã xử lý, trả lại nữa thì Chuyển lần sau và sinh dòng mới |
| BR-DXMS-07-09 | **Họp, kết luận.** Mỗi lần hồ sơ tới bước 31 sinh một bản ghi họp, Lần họp tăng dần. Bản ghi gồm Thời gian, Địa điểm, Thành phần ở bước 31; Biên bản, Kết luận, Kết quả ở bước 32; Kết luận của Thủ trưởng VHT và lựa chọn ở bước 34 nếu có. Hoàn thành bước thì phần đó không sửa. Hệ thống không gửi lịch họp; yêu cầu họp ở bước 30 gửi ĐV, các CQCM của lần mới nhất, TT theo BR-DXMS-C-23. Họp không đặt lại vòng (BR-DXMS-C-15) |
| BR-DXMS-07-10 | **Xung đột ý kiến (bước 24).** AI báo xung đột thì chỉ CQCM có ý kiến liên quan quay về bước 19; BM-04 của các CQCM liên quan thành không hợp lệ tới khi ký bản mới, nên hồ sơ chờ đủ ở bước 23; BM-04 của CQCM khác giữ nguyên. Mỗi CQCM liên quan thấy mục bị xung đột và gợi ý của AI, không thấy tên, nội dung của cơ quan khác. Trong một lần thẩm định, hồ sơ chỉ quay về bước 19 vì xung đột một lần; lần kiểm tra sau còn xung đột thì sang bước 25, nội dung xung đột hiện cho ĐV ở bước 26 và ghi Lịch sử. AI lỗi hoặc không có kết quả thì sang bước 25 |

#### 3.1.7.1 DTMS_CN_0157 Theo dõi cơ quan và kết quả thẩm định

##### 3.1.7.1.1 Thông tin chung chức năng

- **Mục đích:** Biết hồ sơ gửi CQCM nào, TTMS đã xác nhận chưa, kết quả từng CQCM, BM-04 nào còn hợp lệ với phiên bản hiện tại.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết hồ sơ \> \[Thẩm định và ý kiến\] \> tab Cơ quan và kết quả.

- **Tiền điều kiện:**

  - Được thấy hồ sơ (BR-DXMS-01-09).

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.7.1.2 Màn hình

Màn chưa có bản vẽ giao diện. Bố cục theo màn Chi tiết hồ sơ: tiêu đề "Thẩm định và ý kiến", nút quay lại về Chi tiết hồ sơ, dòng Mã hồ sơ, Tên hồ sơ, Phiên bản hiện tại, Vòng xử lý, rồi các tab.

\[RIÊNG\] Màn Thẩm định và ý kiến là màn riêng của module, đăng ký là màn mở từ nút \[Thẩm định và ý kiến\] của màn Chi tiết hồ sơ (DTMS_CN_0155), không có menu riêng; mỗi tab là một chức năng (DTMS_CN_0157–DTMS_CN_0160). Màn chỉ đọc bảng nghiệp vụ do các bước quy trình ghi (mục 2.4.3) và do tác vụ hệ thống ghi, không nhập dữ liệu tại màn, không dựng bằng eForm.

##### 3.1.7.1.3 Mô tả chi tiết các thành phần

**Tab Cơ quan và kết quả** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Chọn lần** |  |  |  |  |
| 1 | Lần thẩm định | Dropdown | Input | Đang lập nếu có, không thì lần mới nhất | Dropdown. Hiện "Lần {n} — gửi ngày {Ngày gửi}". Có danh sách đang lập chưa qua bước 18 thì thêm mục "Đang lập" và mặc định mở mục này; không có thì mặc định lần mới nhất. Mapping: appraisal_round.no. |
|  | **Thông tin lần** |  |  |  |  |
| 2 | Hạn góp ý, Đầu mối tiếp nhận, BM-03 (bấm để tải), Ngày gửi CQCM (T0), KPI toàn trình | Text | Output | Theo dữ liệu | Theo bước 16, 17, 18. Chưa có giá trị thì hiện "-". Ngày gửi theo lần đang chọn; KPI như DTMS_CN_0155, không đổi theo lần. Mapping: appraisal_round.\*. |
|  | **Xác nhận của TTMS** |  |  |  |  |
| 3 | Trạng thái, Người xác nhận, Thời điểm, Lý do trả lại | Text | Output | Theo dữ liệu | BR-DXMS-07-02. Bấm \[Lịch sử xác nhận\] mở hộp thoại các lần trả lại: Thời điểm, Người, Lý do. Mapping: appraisal_round.confirm\_\*. |
|  | **CQCM** |  |  |  |  |
| 4 | STT, CQCM, Nhãn Bắt buộc, Người xử lý, Chỉ huy CQCM, Trạng thái BM-04, Lần, Phiên bản, Số ý kiến Không OK, Ngày ký, Hợp lệ, Lý do không hợp lệ, Tệp | Data Grid | Output | Theo dữ liệu | Mỗi CQCM một dòng, là bản BM-04 mới nhất của lần đang chọn. Trạng thái BM-04 theo mục 2.3.1.3, thêm Chưa lập khi chưa có dự thảo. Số ý kiến, Tệp theo BR-DXMS-07-04. BR-DXMS-07-03. Mapping: bm04.\*. |
|  | **Tổng hợp** |  |  |  |  |
| 5 | "BM-04 hợp lệ: {x}/{n}" | Text | Output | Theo dữ liệu | BR-DXMS-07-03, tính trên phiên bản hiện tại, n theo lần mới nhất. Không hiện ở mục Đang lập. Mapping: Tính. |
|  | **Xung đột** |  |  |  |  |
| 6 | Kết quả AI kiểm tra xung đột | Text | Output | Theo dữ liệu | Hiện khi đã có kết quả, theo BR-DXMS-07-10. CQ chỉ thấy mục liên quan tới cơ quan mình, không thấy tên, nội dung của cơ quan khác. Mapping: profile.ai_conflict. |
|  | **Lịch sử BM-04** |  |  |  |  |
| 7 | STT, CQCM, Lần, Phiên bản, Thời điểm ký, Trạng thái, Hợp lệ, Tệp | Data Grid | Output | Theo dữ liệu | Mọi bản BM-04 đã trình ký của hồ sơ, sắp Thời điểm ký giảm dần, không phân trang. Mapping: bm04.\*. |

Hồ sơ dưới ngưỡng dùng cùng màn; mọi CQCM phản hồi bằng BM-04 (BR-DXMS-C-13). Bổ sung người thẩm định theo BR-DXMS-C-28 chỉ thêm người xử lý trong CQCM đã có, không thêm CQCM, không đổi n. Thêm CQCM thực hiện ở bước 16 của lần sau.

##### 3.1.7.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                             |
|------|---------------------------------------------------|
| 1    | Bấm \[Thẩm định và ý kiến\].                      |
| 2    | Hệ thống kiểm tra quyền, tải lần mới nhất.        |
| 3    | Người dùng đổi lần, tải BM-04, BM-03, chuyển tab. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Hồ sơ chưa tới bước 16 | "Hồ sơ chưa có danh sách CQCM." |
| Không có quyền xem | "Bạn không có quyền thực hiện chức năng này." |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Tải tệp lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." |

**Đồng thời:** kết quả ký về trong lúc xem thì hiện ở lần tải sau.

##### 3.1.7.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0157-01 | ĐV vừa gửi danh sách ở bước 16 | Mở tab | Trạng thái xác nhận Chờ xác nhận; các dòng BM-04 ở Chưa lập |
| AC-0157-02 | TTMS trả lại danh sách kèm lý do | Mở tab, \[Lịch sử xác nhận\] | Trạng thái Trả lại, thấy lý do; hộp thoại có một dòng |
| AC-0157-03 | 3 CQCM, 2 đã ký trên phiên bản hiện tại | Mở tab | "BM-04 hợp lệ: 2/3" |
| AC-0157-04 | Hồ sơ v1 đủ BM-04, vừa hoàn tất bước 27 lên v2 | Mở tab | "BM-04 hợp lệ: 0/3"; các bản v1 Không hợp lệ, lý do Phiên bản cũ |
| AC-0157-05 | CQCM A đã ký, AI báo xung đột, A ký lại cùng phiên bản | Xem Lịch sử BM-04 | Bản đầu Không hợp lệ, lý do Có bản ký mới hơn; bản sau Hợp lệ |
| AC-0157-06 | VOffice từ chối BM-04 của CQCM A | Mở tab | Dòng A Không hợp lệ, lý do Từ chối; bộ đếm không tính A; CQCM A có lại công việc bước 19 |
| AC-0157-07 | Người dùng CQ của Ban Pháp chế | Mở tab | Dòng Ban Tài chính không có Số ý kiến, Tệp; khối Xung đột không có tên, nội dung của Ban Tài chính |
| AC-0157-08 | Người dùng PG | Mở màn | Chỉ có tab Cơ quan và kết quả; thấy đủ Số ý kiến, Tệp |
| AC-0157-09 | Hồ sơ đã gửi CQCM 3 lần, vòng 3, bước 34 Yêu cầu xử lý lại, gửi CQCM lần nữa | Mở ô Lần thẩm định | Có lần 4, Vòng xử lý vẫn 3 |
| AC-0157-11 | Hồ sơ vòng 1 đang ở bước 17, TTMS vừa trả lại | Mở tab | Mặc định mục Đang lập, Trạng thái Trả lại, thấy lý do; lần 1 vẫn chọn được |
| AC-0157-12 | Hai CQCM giữ ý kiến trái nhau, đã quay về bước 19 một lần | Bước 24 vẫn báo xung đột | Hồ sơ sang bước 25; bước 26 hiện nội dung xung đột |
| AC-0157-14 | Xung đột giữa A, B, cả hai quay về bước 19; A đã ký lại, B chưa | Mở tab | B Không hợp lệ, lý do Đang rà soát xung đột; hồ sơ chờ, chưa sang bước 24 |
| AC-0157-13 | Dịch vụ AI lỗi ở bước 24 | Hồ sơ tới bước 24 | Sang bước 25 |
| AC-0157-10 | Hồ sơ đang ở bước 4 | Mở màn | Hiện "Hồ sơ chưa có danh sách CQCM." |

#### 3.1.7.2 DTMS_CN_0158 Cập nhật tiếp thu, giải trình và bảo lưu ý kiến

##### 3.1.7.2.1 Thông tin chung chức năng

- **Mục đích:** Ghi quyết định của đơn vị đề xuất với từng ý kiến CQCM, lập giải trình, và truy được cách xử lý từng ý kiến.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 26, 28. Xem: CH, TT, CQ, TV.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 26 \> nút của luật MS01_T26_HOAN_THANH (Hoàn thành); Việc của tôi \> công việc bước 28 \> nút của luật MS01_T28_GUI_DUYET (Gửi giải trình); Chi tiết hồ sơ \> \[Thẩm định và ý kiến\] \> tab Xử lý ý kiến.

- **Tiền điều kiện:**

  - Thao tác: hồ sơ ở đúng bước, người dùng được giao. Xem: được thấy hồ sơ.

- **Hậu điều kiện:**

  - Dòng ý kiến có quyết định.

  - Tiến trình theo BR-DXMS-07-06, BR-DXMS-07-07.

##### 3.1.7.2.2 Màn hình

<img src="media/rId301.png" style="width:6.25in;height:3.51562in" alt="Quyết định với từng ý kiến tại bước 26" />

<img src="media/rId304.png" style="width:6.25in;height:3.51562in" alt="Giải trình tại bước 28" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t26-ket-qua-bm04, dtms-ms01-t28-giai-trinh và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: Quyết định mặc định chưa chọn, không có gợi ý quyết định của AI; bước 26 không có ô Nội dung sửa / giải trình (giải trình nhập ở bước 28); bước 28 có Tham chiếu, Ghi chú nhập được và các mục của Tờ trình sửa được khi có dòng Tiếp thu. Tab Xử lý ý kiến \[RIÊNG\] chưa có bản vẽ giao diện, bố cục theo mục 3.1.7.2.3.

##### 3.1.7.2.3 Mô tả chi tiết các thành phần

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 26 | Activity_26 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t26-ket-qua-bm04 | MS01_T26_HOAN_THANH (Hoàn thành) | HOAN_THANH; KT-18 (quyetDinhYKien, mục Giá trị và cơ sở giá chỉ nhận Không đồng ý); HX-01, HX-16 (nạp giaiTrinh) | Mục 2.4.3, dòng bước 26 | Có dòng Không đồng ý: bước 28. Không có: bước 27 (BR-DXMS-07-06) |
| 28 | Activity_28 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t28-giai-trinh | MS01_T28_GUI_DUYET (Gửi giải trình) | GUI_DUYET; HX-01, HX-05, HX-02 (văn bản theo luồng con, YC-NT-04: BM-02, Phụ lục 1, Tờ trình BM-01; MS01.03 là BM-09), HX-16 (nạp nokGiaiTrinh) | Mục 2.4.3, dòng bước 28 | Bước 29 (DTMS_CN_0165) |

**Cổng sau bước 26** \[CẤU HÌNH\] trên BPMN, không lập trình: biểu thức trên biến quyetDinhYKien; có ít nhất một dòng Không đồng ý (RESERVE) thì sang bước 28; không có, hoặc bảng trống, thì sang bước 27 (BR-DXMS-07-06). Bước 29 tăng vòng và cổng sau bước 29 theo DTMS_CN_0165.

**Phần riêng** \[RIÊNG\]:

- Dữ liệu của eForm bước 26 (cột Đọc biến, mục 7.4) do tác vụ hệ thống bước 24, 25 ghi (DTMS_CN_0165): quyetDinhYKien là giá trị khởi tạo của bảng quyết định, gồm mọi dòng ý kiến Đang xử lý của hồ sơ theo BR-DXMS-07-05, mỗi dòng có mã dòng, Nguồn (CQCM hoặc "{Người trả lại} — bước {n}"), Mục, Nội dung nhận xét; dòng từ lý do trả lại đã Bảo lưu và đã giải trình không đưa vào (BR-DXMS-07-08). bm04TrangThai là các phiếu BM-04 của lần thẩm định hiện tại. traLaiKy là bước, người, lý do khi hồ sơ bị trả lại sau ký (BR-DXMS-C-20). aiXungDot là kết quả AI kiểm tra xung đột ở bước 24, gồm nội dung xung đột khi đã quay về bước 19 một lần (BR-DXMS-07-10). aiDongBo là AI tóm tắt, gộp ý kiến theo mục kèm hướng dẫn sửa ở bước 25 (BR-DXMS-C-08).

- Dữ liệu của eForm bước 28: giaiTrinh do HX-16 của luật MS01_T26_HOAN_THANH nạp, gồm mọi dòng ý kiến Đang xử lý đã có Quyết định, sắp theo CQCM (BR-DXMS-07-07); vongGiaiTrinh là Vòng xử lý hiện tại của hồ sơ. Các mục của Tờ trình dùng cùng khóa eForm với bước 11, 12, 27 (DTMS_CN_0162, DTMS_CN_0165), giá trị khởi tạo là nội dung phiên bản hiện tại, để mẫu Tờ trình sinh lại dùng chung trường trộn.

- nokGiaiTrinh do HX-16 của luật MS01_T28_GUI_DUYET nạp: dòng Bảo lưu Đang xử lý kèm Nội dung giải trình, Tham chiếu; eForm bước 31–34 đọc biến này (DTMS_CN_0160).

- Tab Xử lý ý kiến: tab của màn Thẩm định và ý kiến, đăng ký như DTMS_CN_0157 (màn mở từ Chi tiết hồ sơ); đọc bảng opinion, không nhập tại tab.

**Mẫu văn bản BM-02 và Phụ lục 1** \[CẤU HÌNH\] (mẫu Word, trường trộn là khóa eForm bước 28, BR-DXMS-08-03): Phụ lục 1 mỗi dòng giaiTrinh một dòng, nhóm theo nguon: Ý kiến nhận xét nhanXet, Tiếp thu / Bảo lưu quyetDinh, Nội dung giải trình noiDung, Tham chiếu thamChieu, Ghi chú ghiChu. Khi hoàn thành bước 27, BM-02 và Phụ lục 1 sinh lại từ các dòng ý kiến hiện có (BR-DXMS-07-07, DTMS_CN_0165).

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T26_HOAN_THANH (Hoàn thành) | eForm: mọi dòng có Quyết định. KT-18: dòng thuộc mục Giá trị và cơ sở giá chỉ nhận Không đồng ý (BR-DXMS-06-03); không đạt thì chặn tại dòng: "Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới.", công việc giữ nguyên | HX-01 ghi Quyết định (Đồng ý sửa lưu Tiếp thu, Không đồng ý lưu Bảo lưu), người quyết định, thời điểm vào từng dòng ý kiến; HX-16 nạp các dòng Đang xử lý đã có Quyết định vào giaiTrinh. Bảng trống thì vẫn hoàn thành. Hoàn thành công việc; cổng sau bước 26 rẽ theo BR-DXMS-07-06 |
| MS01_T28_GUI_DUYET (Gửi giải trình) | eForm: mọi dòng có Nội dung giải trình; có dòng Tiếp thu thì các mục bắt buộc của Tờ trình có giá trị như bước 11, 12 | HX-01 ghi Nội dung giải trình, Tham chiếu, Ghi chú vào từng dòng ý kiến; HX-05 tăng phiên bản (BR-DXMS-06-07); HX-02 sinh BM-02, Phụ lục 1 và Tờ trình theo luồng con từ dữ liệu form, gắn phiên bản mới (BR-DXMS-07-07); HX-16 nạp dòng Bảo lưu Đang xử lý vào nokGiaiTrinh. Hoàn thành công việc, sang bước 29: tăng vòng, rẽ theo BR-DXMS-C-15 |

**Tab Xử lý ý kiến** \[RIÊNG\] (chỉ đọc):

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Bộ lọc | Dropdown | Input | Lần mới nhất | Lần thẩm định (mặc định lần mới nhất, có "Tất cả"), CQCM, Quyết định, Kết quả. Lọc ngay khi chọn, **Bằng**. |
| 2 | Tổng hợp | Text | Output | Theo dữ liệu | "{a} tiếp thu · {b} bảo lưu · {c} chờ quyết định" trên tập đang lọc. Mapping: Tính. |
| 3 | Lưới | Data Grid | Output | Theo dữ liệu | STT, CQCM, Lần, Phiên bản, Mục, Nội dung nhận xét, Hướng dẫn sửa, Quyết định, Nội dung giải trình, Tham chiếu, Ghi chú, Kết quả, Người quyết định, Thời điểm. Nhóm theo CQCM, trong nhóm theo Lần tăng dần, không phân trang. CQ chỉ thấy dòng của cơ quan mình (BR-DXMS-07-04). Mapping: opinion.\*. |

##### 3.1.7.2.4 Luồng nghiệp vụ

**Luồng bước 26:**

| Bước | Mô tả                                                               |
|------|---------------------------------------------------------------------|
| 1    | ĐV mở công việc, bấm nút của luật MS01_T26_HOAN_THANH (Hoàn thành). |
| 2    | Xem trạng thái, gợi ý AI, chọn quyết định từng dòng.                |
| 3    | Bấm \[Xác nhận\].                                                   |
| 4    | Hệ thống kiểm tra, lưu, ghi nhật ký.                                |
| 5    | Sang bước 27 hoặc 28 theo BR-DXMS-07-06.                            |

**Luồng bước 28:**

| Bước | Mô tả                                                          |
|------|----------------------------------------------------------------|
| 1    | ĐV bấm nút của luật MS01_T28_GUI_DUYET (Gửi giải trình).       |
| 2    | Nhập giải trình; có dòng Tiếp thu thì sửa Tờ trình trong form. |
| 3    | Bấm \[Xác nhận\].                                              |
| 4    | Hệ thống sinh BM-02, tăng phiên bản, ghi nhật ký.              |
| 5    | Bước 29 tăng vòng, rẽ theo BR-DXMS-C-15.                       |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Dòng chưa chọn Quyết định | Inline tại dòng: "Vui lòng chọn Quyết định." |
| Dòng thuộc mục Giá trị và cơ sở giá chọn Đồng ý sửa | KT-18, inline tại dòng: "Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới." Công việc giữ nguyên |
| Dòng chưa nhập giải trình | Inline tại dòng: "Vui lòng nhập Nội dung giải trình." |
| Có dòng Tiếp thu, bỏ trống trường bắt buộc của Tờ trình | Inline: "Vui lòng nhập {Tên trường}." |
| Không có dòng Đang xử lý ở bước 26 | Bảng hiện "Không có ý kiến cần quyết định." \[Xác nhận\] sang bước 27 |
| AI chưa có kết quả, lỗi | Khối AI hiện "Chưa có kết quả gợi ý AI." (BR-DXMS-08-06); không chặn xử lý |
| Sinh BM-02 lỗi | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Không hoàn thành, giữ dữ liệu đã nhập |
| Công việc đã được xử lý hoặc chuyển người khác khi Xác nhận | Theo DTMS_CN_0112 |
| Tab không có dữ liệu | "Chưa có dữ liệu" |
| Tab không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |

**Đồng thời:** bước 26, 28 mỗi lúc một người xử lý; người sau theo DTMS_CN_0112.

##### 3.1.7.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0158-01 | 2 BM-04 hợp lệ có 3 mục Không OK | Hồ sơ tới bước 26 | Bảng có 3 dòng, Quyết định chưa chọn |
| AC-0158-02 | Mọi dòng chọn Đồng ý sửa | Bấm \[Xác nhận\] | Dòng lưu Tiếp thu, sang bước 27, vòng không đổi |
| AC-0158-03 | Một dòng Không đồng ý | Bấm \[Xác nhận\] | Sang bước 28, dòng đó lưu Bảo lưu |
| AC-0158-04 | Một dòng chưa chọn | Bấm \[Xác nhận\] | Không chuyển bước, hiện lỗi tại dòng |
| AC-0158-05 | Bước 28, 1 Tiếp thu, 1 Bảo lưu, xóa trắng mục Sự cần thiết phải mua sắm của Tờ trình | Bấm \[Xác nhận\] | Không chuyển bước, hiện "Vui lòng nhập Sự cần thiết phải mua sắm." |
| AC-0158-06 | Bước 28 đủ dữ liệu, vòng đang 0 | Bấm \[Xác nhận\] | Có BM-02 và Phụ lục 1, phiên bản tăng 1, vòng 1, về bước 13 |
| AC-0158-07 | Bước 28 đủ dữ liệu, vòng đang 2 | Bấm \[Xác nhận\] | Vòng 3, sang bước 30 |
| AC-0158-08 | Tất cả BM-04 không có Không OK | Hồ sơ tới bước 26, bấm \[Xác nhận\] | Bảng trống, sang bước 27 |
| AC-0158-09 | Phó TGĐ không đồng ý BM-05, ĐV chọn Không đồng ý với lý do đó | Mở bước 26, bấm \[Xác nhận\] | Có dòng từ lý do trả lại; sang bước 28 |
| AC-0158-19 | Dòng trả lại đã Bảo lưu, đã giải trình; hồ sơ qua CQCM lần mới, mọi BM-04 OK | Hồ sơ tới bước 26 | Không có dòng đó, sang bước 27, tới lại bước ký của người trả lại |
| AC-0158-20 | Người trả lại đồng ý ở lần ký sau | Mở tab | Dòng đó Đã xử lý |
| AC-0158-15 | Có dòng từ lý do trả lại, ĐV chọn Đồng ý sửa | Bấm \[Xác nhận\] | Sang bước 27 |
| AC-0158-16 | CQCM A có dòng X, Y; ở bước 35 A chấm X Chưa đạt, Y Đạt | Mở tab | X về Đang xử lý, Y giữ Đã xử lý |
| AC-0158-17 | Danh sách lần 2 bỏ CQCM A, TTMS xác nhận | Mở tab | Dòng Đang xử lý của A là Không còn áp dụng; bước 26 sau không có dòng đó |
| AC-0158-18 | Không có Bảo lưu, ĐV hoàn thành bước 27 | Xem Văn bản đầu ra | Có BM-02 và Phụ lục 1 |
| AC-0158-10 | CQCM chọn Đạt ở bước 35 cho dòng Tiếp thu | Mở tab | Kết quả Đã xử lý |
| AC-0158-11 | BM-04 lần 2 vẫn Không OK ở mục đó | Mở tab, Tất cả lần | Dòng lần 1 Chuyển lần sau, có dòng lần 2 |
| AC-0158-12 | Người dùng CQ của Ban Tài chính | Mở tab | Chỉ có dòng của Ban Tài chính |
| AC-0158-13 | Người dùng PG | Mở màn | Không có tab Xử lý ý kiến |
| AC-0158-14 | Đã chọn quyết định, bấm \[Lưu nháp\], đóng hộp thoại | Mở lại | Giữ lựa chọn, chưa chuyển bước |
| AC-0158-21 | Luật MS01_T26_HOAN_THANH kích hoạt; dòng thuộc mục Giá trị và cơ sở giá chọn Đồng ý sửa | Bấm nút của luật, \[Xác nhận\] | Nút vẫn hiện; bị chặn bởi KT-18 tại dòng: "Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới."; công việc giữ nguyên |
| AC-0158-22 | Luật MS01_T26_HOAN_THANH, MS01_T28_GUI_DUYET kích hoạt, vai trò ĐV nhận việc | Mở bước 26, bước 28, bấm nút của luật | Mở eForm dtms-ms01-t26-ket-qua-bm04, dtms-ms01-t28-giai-trinh trong hộp thoại eForm của nền tảng |
| AC-0158-23 | Bước 28 có một dòng Tiếp thu | Mở eForm bước 28 | Có các mục của Tờ trình mang nội dung phiên bản hiện tại; bước 28 không có dòng Tiếp thu thì không có các mục này |
| AC-0158-24 | Thêm một trường vào eForm dtms-ms01-t28-giai-trinh | Mở bước 28 | Có trường mới; giá trị lưu trong dữ liệu form của bước; không sửa mã nguồn (AC-CH-03) |

#### 3.1.7.3 DTMS_CN_0159 Theo dõi các vòng và lịch sử xử lý ý kiến

##### 3.1.7.3.1 Thông tin chung chức năng

- **Mục đích:** Biết hồ sơ đã qua bao nhiêu lần thẩm định, bao nhiêu vòng giải trình, có vượt ngưỡng không, và toàn bộ sự kiện xử lý ý kiến.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, TV trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết hồ sơ \> \[Thẩm định và ý kiến\] \> tab Vòng và lịch sử.

- **Tiền điều kiện:**

  - Được thấy hồ sơ.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.7.3.2 Màn hình

Màn chưa có bản vẽ giao diện, bố cục theo mục 3.1.7.3.3.

\[RIÊNG\] Tab Vòng và lịch sử của màn Thẩm định và ý kiến, đăng ký như DTMS_CN_0157 (màn mở từ Chi tiết hồ sơ, không có menu riêng). Tab chỉ đọc lần thẩm định, dòng ý kiến, cuộc họp và nhật ký của hồ sơ, không nhập dữ liệu tại tab, không dựng bằng eForm.

##### 3.1.7.3.3 Mô tả chi tiết các thành phần

**Tab Vòng và lịch sử** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tóm tắt** |  |  |  |  |
| 1 | Vòng xử lý, Ngưỡng, Số lần thẩm định, Số lần họp | Text | Output | Theo dữ liệu | Ngưỡng cố định là 2 vòng. Vượt thì hiện cảnh báo: "Hồ sơ đã vượt 2 vòng xử lý, cần họp thống nhất." Mapping: Tính. |
|  | **Theo lần** |  |  |  |  |
| 2 | STT, Lần thẩm định, Phiên bản lúc gửi, Ngày gửi CQCM, Ngày đủ BM-04, Số ý kiến Không OK, Tiếp thu, Bảo lưu, Hướng xử lý | Data Grid | Output | Theo dữ liệu | Hướng xử lý: Hoàn chỉnh hồ sơ; Giải trình, sang vòng {n}; Họp lần {m}; Đang xử lý. Sắp Lần tăng dần, không phân trang. Mapping: appraisal_round.\*, opinion.\*. |
|  | **Lịch sử** |  |  |  |  |
| 3 | STT, Thời gian, Người thực hiện, Hành động, Lần, Vòng, Phiên bản, Nội dung | Data Grid | Output | Theo dữ liệu | Sự kiện: gửi CQCM, ký BM-04, AI báo xung đột, quyết định từng dòng, giải trình, tăng vòng, cảnh báo họp, kết quả họp, kết luận, CQCM kiểm tra lại, trả lại sau ký kèm lý do. Sắp thời gian tăng dần, không phân trang. Mapping: Nhật ký. |

Với CQ: Theo lần hiện số của cơ quan mình; Lịch sử không có nội dung BM-04 của cơ quan khác (BR-DXMS-07-04).

##### 3.1.7.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                               |
|------|-------------------------------------|
| 1    | Mở tab.                             |
| 2    | Hệ thống tải tóm tắt, lần, lịch sử. |
| 3    | Người dùng xem.                     |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Hồ sơ chưa qua bước 18 | Bảng hiện "Chưa có dữ liệu"; Vòng xử lý 0 |
| Không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |
| Không có quyền vào tab, gửi yêu cầu trực tiếp | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** sự kiện mới hiện ở lần tải sau.

##### 3.1.7.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0159-01 | Hồ sơ vừa gửi CQCM lần đầu | Mở tab | Vòng 0, Số lần thẩm định 1, Hướng xử lý Đang xử lý |
| AC-0159-02 | Hồ sơ không có Bảo lưu, sang bước 27 | Mở tab | Vòng không đổi, Hướng xử lý Hoàn chỉnh hồ sơ |
| AC-0159-03 | Hồ sơ qua bước 29 hai lần | Mở tab | Vòng 2, không có cảnh báo |
| AC-0159-04 | Hồ sơ qua bước 29 lần ba | Mở tab | Vòng 3, có cảnh báo, Hướng xử lý Họp lần 1 |
| AC-0159-05 | Đã họp, sau đó có Bảo lưu lần nữa | Hồ sơ qua bước 29 | Vòng 4, không đặt lại; tới bước 31 thì Số lần họp 2 |
| AC-0159-06 | Bước 34 Yêu cầu xử lý lại, gửi CQCM lại | Mở tab | Số lần thẩm định tăng, Vòng không đổi |
| AC-0159-07 | BM-05 bị trả lại | Mở tab | Lịch sử có dòng trả lại kèm lý do, Số lần thẩm định không đổi |
| AC-0159-08 | Người dùng CQ của Ban Pháp chế | Mở tab | Theo lần, Lịch sử không có ý kiến của Ban Tài chính |

#### 3.1.7.4 DTMS_CN_0160 Ghi nhận kết quả họp, kết luận xử lý

##### 3.1.7.4.1 Thông tin chung chức năng

- **Mục đích:** Lưu kết quả họp thống nhất khi vượt 2 vòng và kết luận của Thủ trưởng VHT, làm cơ sở xử lý tiếp.

- **Người dùng mục tiêu:** Thao tác: TT tại bước 31, 32, 33; TV tại bước 34. Xem: ĐV, CH, CQ.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 31 \> nút của luật MS01_T31_HOAN_THANH (Đã tổ chức họp); bước 32 \> MS01_T32_XAC_NHAN (Đã thống nhất) hoặc MS01_T32_TRA_LAI (Chưa thống nhất — trình cấp cao hơn); bước 33 \> MS01_T33_HOAN_THANH (Hoàn thành); bước 34 \> MS01_T34_XAC_NHAN (Thống nhất phương án) hoặc MS01_T34_TRA_LAI (Yêu cầu xử lý lại); Chi tiết hồ sơ \> \[Thẩm định và ý kiến\] \> tab Họp, kết luận.

- **Tiền điều kiện:**

  - Thao tác: hồ sơ ở đúng bước, người dùng được giao. Xem: được thấy hồ sơ.

- **Hậu điều kiện:**

  - Có bản ghi họp.

  - Tiến trình theo BR-DXMS-C-16.

##### 3.1.7.4.2 Màn hình

<img src="media/rId319.png" style="width:6.25in;height:3.51562in" alt="Tổ chức họp tại bước 31" />

<img src="media/rId322.png" style="width:6.25in;height:3.51562in" alt="Cập nhật kết quả họp tại bước 32" />

<img src="media/rId325.png" style="width:6.25in;height:3.51562in" alt="Kết luận tại bước 34" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu, dữ liệu mẫu đã điền sẵn, số dòng nội dung vướng mắc là mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t31-to-chuc-hop, dtms-ms01-t32-ket-qua-hop, dtms-ms01-t33-trinh-cap-cao, dtms-ms01-t34-ket-luan và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: Kết luận, Kết luận của Thủ trưởng mặc định rỗng; Biên bản họp tải trong eForm bước 32; bảng Nội dung vướng mắc là các dòng Bảo lưu Đang xử lý; bước 33, 34 hiện Biên bản họp, Kết luận của cuộc họp. Tab Họp, kết luận \[RIÊNG\] chưa có bản vẽ giao diện, bố cục theo mục 3.1.7.4.3.

##### 3.1.7.4.3 Mô tả chi tiết các thành phần

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 31 | Activity_31 | Nhóm chuyên viên TTMS; người nhận việc đầu tiên của nhóm trong hồ sơ được giao thẳng (BR-DXMS-08-01) | dtms-ms01-t31-to-chuc-hop | MS01_T31_HOAN_THANH (Đã tổ chức họp) | HOAN_THANH; KT-01 (thanhPhanHop, người dùng còn hoạt động); HX-01 | Mục 2.4.3, dòng bước 31 | Bước 32 |
| 32 | Activity_32 | Như bước 31 | dtms-ms01-t32-ket-qua-hop | MS01_T32_XAC_NHAN (Đã thống nhất); MS01_T32_TRA_LAI (Chưa thống nhất — trình cấp cao hơn) | Đã thống nhất: XAC_NHAN, biến đặt ketQuaHop = AGREED; HX-01, HX-17. Chưa thống nhất: TRA_LAI, không đặt Lý do bắt buộc, mở eForm của bước, biến đặt ketQuaHop = NOT_AGREED; HX-01 | Mục 2.4.3, dòng bước 32 | Đã thống nhất: bước 27. Chưa thống nhất: bước 33 |
| 33 | Activity_33 | Như bước 31 | dtms-ms01-t33-trinh-cap-cao | MS01_T33_HOAN_THANH (Hoàn thành) | HOAN_THANH | — | Bước 34 |
| 34 | Activity_34 | Thủ trưởng VHT (BR-DXMS-08-01) | dtms-ms01-t34-ket-luan | MS01_T34_XAC_NHAN (Thống nhất phương án); MS01_T34_TRA_LAI (Yêu cầu xử lý lại) | Cả hai luật mở eForm của bước, không đặt Lý do bắt buộc, biến bắt buộc ketLuan. Thống nhất phương án: XAC_NHAN, biến đặt luaChonKetLuan = APPROVE_PLAN; HX-01, HX-17. Yêu cầu xử lý lại: TRA_LAI, biến đặt luaChonKetLuan = REPROCESS; HX-01 | Mục 2.4.3, dòng bước 34 | Thống nhất phương án: bước 27. Yêu cầu xử lý lại: bước 11 (MS01.03, dưới ngưỡng) hoặc bước 12 (MS01.01, .02, từ ngưỡng trở lên) (BR-DXMS-C-16) |

**Bước 30 và các cổng** \[CẤU HÌNH\] trên BPMN, không lập trình:

- Bước 30 gửi cảnh báo và yêu cầu họp, giao bước 31, theo DTMS_CN_0165. Hệ thống không gửi lịch họp (BR-DXMS-07-09).

- Cổng sau bước 32 rẽ theo ketQuaHop: AGREED sang bước 27, NOT_AGREED sang bước 33.

- Cổng sau bước 34 rẽ theo luaChonKetLuan: APPROVE_PLAN sang bước 27; REPROCESS rẽ tiếp theo luồng con của hồ sơ về bước 11 hoặc 12, đi thẳng về dự thảo, không qua bước 14 (mục 7.2).

**Phần riêng** \[RIÊNG\]:

- Bản ghi họp: HX-01 của luật MS01_T31_HOAN_THANH tạo bản ghi họp mới của hồ sơ, Lần họp tăng dần, gắn lần thẩm định mới nhất (BR-DXMS-07-09); HX-01 của luật bước 32, 34 ghi vào bản ghi họp đó theo mục 2.4.3. Hoàn thành bước thì phần đã ghi không sửa: bước sau chỉ đọc lại. Biên bản họp đồng thời vào Danh sách tài liệu của hồ sơ (profile_file, nhóm MINUTES; hồ sơ Mật thì chỉ người trong danh sách xử lý được xem).

- Dữ liệu của eForm (cột Đọc biến, mục 7.4): nokGiaiTrinh do HX-16 của luật MS01_T28_GUI_DUYET nạp (DTMS_CN_0158), gồm dòng Bảo lưu Đang xử lý kèm Nội dung giải trình, Tham chiếu; vongGiaiTrinh là Vòng xử lý của hồ sơ; giá trị khởi tạo của thanhPhanHop do tác vụ hệ thống bước 30 ghi vào biến cùng khóa: ĐV, CH của hồ sơ, người xử lý các CQCM của lần mới nhất, người TTMS xử lý hồ sơ; danh sách chọn @nguoiDungOptions là người dùng đang hoạt động của hệ thống. Bước 33, 34 đọc lại bienBanHop, ketLuanHop của bước 32; bước 27 đọc ketLuanHop, ketLuan (DTMS_CN_0165).

- Tab Họp, kết luận: tab của màn Thẩm định và ý kiến, đăng ký như DTMS_CN_0157; đọc bảng meeting, opinion, không nhập tại tab.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T31_HOAN_THANH (Đã tổ chức họp) | eForm: Thời gian, Địa điểm, ít nhất một người ở Thành phần; Thời gian không so với hiện tại vì có thể ghi lại cuộc họp đã diễn ra. KT-01: mọi người ở Thành phần còn hoạt động; không đạt thì chặn: "Thành phần {Tên} không còn hợp lệ, vui lòng chọn lại." | HX-01 tạo bản ghi họp, ghi Thời gian, Địa điểm, Thành phần. Hoàn thành công việc, giao bước 32 |
| MS01_T32_XAC_NHAN (Đã thống nhất) | eForm: Biên bản họp, Kết luận có giá trị | Biến đặt ketQuaHop = AGREED; HX-01 ghi Biên bản, Kết luận, Kết quả Đã thống nhất vào bản ghi họp, đưa Biên bản vào Danh sách tài liệu; HX-17 chuyển dòng Bảo lưu Đang xử lý thành Theo kết luận (BR-DXMS-07-08). Hoàn thành công việc, sang bước 27 |
| MS01_T32_TRA_LAI (Chưa thống nhất — trình cấp cao hơn) | eForm: như luật MS01_T32_XAC_NHAN | Biến đặt ketQuaHop = NOT_AGREED; HX-01 như trên, Kết quả Chưa thống nhất; dòng Bảo lưu giữ Đang xử lý. Hoàn thành công việc, sang bước 33 |
| MS01_T33_HOAN_THANH (Hoàn thành) | — | Hoàn thành công việc, giao bước 34 cho Thủ trưởng VHT |
| MS01_T34_XAC_NHAN (Thống nhất phương án) | eForm và biến bắt buộc: Kết luận của Thủ trưởng có giá trị | Biến đặt luaChonKetLuan = APPROVE_PLAN; HX-01 ghi Kết luận của Thủ trưởng, lựa chọn vào bản ghi họp; HX-17 như luật MS01_T32_XAC_NHAN. Hoàn thành công việc, sang bước 27 |
| MS01_T34_TRA_LAI (Yêu cầu xử lý lại) | eForm và biến bắt buộc: như luật MS01_T34_XAC_NHAN | Biến đặt luaChonKetLuan = REPROCESS; HX-01 như trên; Kết quả của dòng không đổi, dòng được xét tiếp ở BM-04 lần sau (BR-DXMS-07-08). Hoàn thành công việc, về bước 11 hoặc 12 (BR-DXMS-C-16) |

**Tab Họp, kết luận** \[RIÊNG\] (chỉ đọc): mỗi lần họp một khối, mới nhất ở trên: Lần họp, Thời gian, Địa điểm, Thành phần, Biên bản (tải), Kết luận, Kết quả; Kết luận của Thủ trưởng, Người kết luận, Thời điểm, Lựa chọn khi có; bảng Nội dung vướng mắc tại thời điểm họp. Với CQ, bảng chỉ có dòng của cơ quan mình; Biên bản, Kết luận vẫn thấy vì CQ là thành phần họp. Mapping: meeting.\*, opinion.\*.

##### 3.1.7.4.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                          |
|------|----------------------------------------------------------------|
| 1    | Bước 30 cảnh báo, gửi yêu cầu họp.                             |
| 2    | TT nhập thông tin họp, bước 31.                                |
| 3    | TT nhập biên bản, kết luận, chọn kết quả, bước 32.             |
| 4    | Đã thống nhất thì sang bước 27.                                |
| 5    | Chưa thống nhất thì TT trình ở bước 33, TV kết luận ở bước 34. |
| 6    | Hồ sơ đi tiếp theo lựa chọn; mỗi thao tác ghi nhật ký.         |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Thiếu Thời gian, Địa điểm, Thành phần, Kết luận | Inline: "Vui lòng nhập {Tên trường}." |
| Chưa tải biên bản | Inline: "Vui lòng tải lên Biên bản họp." |
| Tải tệp lỗi, sai định dạng | Theo mục 4.1 |
| Thành viên họp đã ngừng hoạt động khi Xác nhận | KT-01, inline: "Thành phần {Tên} không còn hợp lệ, vui lòng chọn lại." Công việc giữ nguyên |
| Công việc đã xử lý hoặc chuyển người khác | Theo DTMS_CN_0112 |
| Lỗi xử lý | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Giữ dữ liệu đã nhập |
| Tab chưa có cuộc họp | "Chưa có dữ liệu" |
| Tab không tải được | "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |

**Đồng thời:** bước 31–34 mỗi lúc một người xử lý; người sau theo DTMS_CN_0112.

##### 3.1.7.4.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0160-01 | Hồ sơ vừa vượt 2 vòng | Kiểm tra thông báo | ĐV, các CQCM, TT nhận yêu cầu họp; TT có công việc bước 31 |
| AC-0160-02 | Bước 31 bỏ trống Địa điểm | Bấm \[Xác nhận\] | Không chuyển bước, hiện lỗi inline |
| AC-0160-03 | Bước 32 chưa tải biên bản | Bấm \[Xác nhận\] | Không chuyển bước, hiện "Vui lòng tải lên Biên bản họp." |
| AC-0160-04 | Luật MS01_T32_XAC_NHAN (Đã thống nhất) kích hoạt; bước 32 đủ dữ liệu | Bấm nút của luật, \[Xác nhận\] | Sang bước 27; dòng Bảo lưu chuyển Theo kết luận; biên bản có ở Danh sách tài liệu |
| AC-0160-05 | Luật MS01_T32_TRA_LAI (Chưa thống nhất — trình cấp cao hơn) kích hoạt; bước 32 đủ dữ liệu | Bấm nút của luật, \[Xác nhận\] | Sang bước 33; dòng Bảo lưu giữ Đang xử lý |
| AC-0160-06 | Luật MS01_T34_XAC_NHAN (Thống nhất phương án) kích hoạt; bước 34 bỏ trống Kết luận của Thủ trưởng | Bấm nút của luật, \[Xác nhận\] | Không chuyển bước, hiện lỗi inline |
| AC-0160-07 | Luật MS01_T34_TRA_LAI (Yêu cầu xử lý lại) kích hoạt; bước 34, hồ sơ 120 tỷ | Bấm nút của luật, nhập Kết luận, \[Xác nhận\] | Về bước 11, dòng giữ Đang xử lý |
| AC-0160-08 | Luật MS01_T34_TRA_LAI (Yêu cầu xử lý lại) kích hoạt; bước 34, hồ sơ 200 tỷ | Bấm nút của luật, nhập Kết luận, \[Xác nhận\] | Về bước 12 |
| AC-0160-09 | Hồ sơ đã họp 2 lần | Mở tab | Hai khối, lần 2 ở trên; Vòng xử lý không về 0 |
| AC-0160-10 | Người dùng CQ của Ban Pháp chế | Mở tab | Thấy biên bản, kết luận; bảng vướng mắc chỉ có dòng Ban Pháp chế |
| AC-0160-11 | TV đã kết luận | Mở tab | Có Kết luận, Người kết luận, Thời điểm; không sửa được |
| AC-0160-12 | Luật MS01_T31_HOAN_THANH kích hoạt; một người ở Thành phần bị ngừng hoạt động sau khi mở form | Bấm nút của luật, \[Xác nhận\] | Nút vẫn hiện; bị chặn bởi KT-01: "Thành phần {Tên} không còn hợp lệ, vui lòng chọn lại."; không tạo bản ghi họp; công việc giữ nguyên |
| AC-0160-13 | Luật MS01_T34_XAC_NHAN, MS01_T34_TRA_LAI kích hoạt, vai trò Thủ trưởng VHT | Mở bước 34 | Có nút của hai luật; cả hai mở eForm dtms-ms01-t34-ket-luan có ô Kết luận của Thủ trưởng, không mở hộp thoại Lý do |
| AC-0160-14 | Gọi API thực thi luật MS01_T34_TRA_LAI với Kết luận của Thủ trưởng rỗng | Gửi yêu cầu | Bị từ chối theo biến bắt buộc của luật: "Vui lòng nhập Lý do."; công việc giữ nguyên |
| AC-0160-15 | Thêm một trường vào eForm dtms-ms01-t31-to-chuc-hop | Mở bước 31 | Có trường mới; giá trị lưu trong dữ liệu form của bước; không sửa mã nguồn (AC-CH-03) |

### 3.1.8 Xử lý các bước quy trình phê duyệt

Xử lý từng bước của quy trình MS01 với ba luồng con MS01.01, MS01.02, MS01.03 (BR-DXMS-C-05) từ bước 1 tới bước 61: ai nhận việc, form của bước, nút, văn bản sinh ra, việc hệ thống tự làm và hướng đi sau bước. Trình tự bước, nhánh, giai đoạn theo mục 7.1, 7.2; bảng dưới chỉ ghi bước nào thuộc luồng nào. Các bước đã đặc tả ở nghiệp vụ khác chỉ dẫn chiếu: bước 1 (DTMS_CN_0140), 5 (DTMS_CN_0141), 7 (DTMS_CN_0143), 8, 9 (DTMS_CN_0145), 10 (DTMS_CN_0148), 26, 28 (DTMS_CN_0158), 31–34 (DTMS_CN_0160).

| Chức năng    | Bước  | MS01.01      | MS01.02        | MS01.03               |
|--------------|-------|--------------|----------------|-----------------------|
| DTMS_CN_0161 | 1–6   | Có           | Có             | Có                    |
| DTMS_CN_0162 | 11–14 | 12, 13, 14   | 12, 13, 14     | 11, 13, 14            |
| DTMS_CN_0163 | 15–18 | Có           | Có             | Có                    |
| DTMS_CN_0164 | 19–23 | Có           | Có             | Có                    |
| DTMS_CN_0165 | 24–34 | Có           | Có             | Có                    |
| DTMS_CN_0166 | 35–37 | Checklist 01 | Checklist 01   | Checklist 02          |
| DTMS_CN_0167 | 38–40 | Không        | Không          | Có                    |
| DTMS_CN_0168 | 41–47 | Có           | Có             | Không                 |
| DTMS_CN_0169 | 48–56 | 48–56        | 48, chọn Không | Không                 |
| DTMS_CN_0170 | 57–61 | BM-08        | BM-08          | Chỉ 60, 61 trên BM-09 |

Quy tắc của nghiệp vụ 3.1.8:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-08-01 | **Người nhận việc.** Bước có nhân sự thực hiện chỉ định (BR-DXMS-01-13) giao những người được chỉ định; các bước khác theo quy tắc sau. Bước của ĐV giao Người phụ trách hồ sơ. Bước 13 giao nhóm Chỉ huy của đơn vị đề xuất. Bước 17, 31, 32, 33, 42, 48, 50, 58, 59 giao nhóm chuyên viên TTMS; người nhận việc đầu tiên trong nhóm này của hồ sơ được giao thẳng các bước đó về sau, trừ khi chuyển người xử lý. Bước 38, 43 giao nhóm lãnh đạo TTMS, là người ký với tư cách CQCM về đầu tư – xây dựng. Bước 19, 35 tạo một công việc cho mỗi CQCM trong danh sách đã xác nhận của lần mới nhất, giao nhóm chuyên viên của CQCM đó, kể cả TTMS với tư cách CQCM về đầu tư – xây dựng; bước 20, 36, 46 giao nhóm Chỉ huy của CQCM đó. Bước 39, 47 giao Phó TGĐ/Phó GĐ phụ trách lĩnh vực của hồ sơ. Bước 34, 51 giao Thủ trưởng VHT; bước 60 giao Người có thẩm quyền theo BR-DXMS-C-29. Bước 53–56 theo BR-DXMS-08-09. Giao nhóm thì người nhận việc trước xử lý, theo DTMS_CN_0109 |
| BR-DXMS-08-02 | **Khung xử lý** \[NỀN TẢNG\]. Công việc mở từ Việc của tôi (DTMS_CN_0108–0112). Màn, nút, hộp thoại và trình tự xử lý theo mục 2.4, 2.5; nút của từng bước theo phụ lục mục 7.5, eForm theo mục 7.4. Bước 13, 35 lấy lý do theo từng phần, từng dòng trong eForm của bước thay cho hộp thoại Lý do (luật của nút không đồng ý, chưa đạt không đặt Lý do bắt buộc, gắn KT-02). Hồ sơ không còn PROCESSING thì không còn công việc |
| BR-DXMS-08-03 | **Văn bản của bước** sinh từ mẫu Word của biểu mẫu và dữ liệu form khi hoàn thành bước, theo E-form (DTMS_CN_0001–0003), gắn phiên bản hiện tại (BR-DXMS-06-07, BR-DXMS-06-09), xem ở Văn bản đầu ra của Chi tiết hồ sơ. Trường lấy từ hồ sơ (Tên, Đơn vị đề xuất, Tổng giá trị, Nguồn vốn, Thời gian thực hiện, danh mục hạng mục, văn bản căn cứ) không nhập lại trong form. Tổng giá trị hiện bằng số và bằng chữ, đã gồm VAT |
| BR-DXMS-08-04 | **Trình ký.** Hộp thoại Trình ký, nhận kết quả ký, công việc Xử lý trình ký là năng lực nền tảng YC-NT-03, chạy qua hậu xử lý HX-03; quy tắc của ĐXMS như sau. Nút có ký mở hộp thoại Trình ký, chỉ đọc: Văn bản, Phiên bản, Người ký theo BR-DXMS-08-05, Hình thức ký. Hồ sơ không Mật: Ký điện tử qua VOffice; hệ thống tạo yêu cầu trình ký, lưu theo BR-DXMS-C-21, công việc hoàn thành, hướng đi sau bước chờ kết quả. Hồ sơ Mật: Ký bản giấy; người ký nhập Số văn bản, Ngày ký, tải bản scan đã ký ngay trong hộp thoại, kết quả là Đã ký khi Xác nhận (BR-DXMS-C-25). BM-03 do hệ thống gửi ở bước 18, không qua hộp thoại; hồ sơ Mật thì người xử lý bước 17 nhận công việc Nhập kết quả ký bản giấy. Kết quả ký: Đã ký thì đi tiếp. Từ chối thì tính như người ký chọn Không đồng ý, lý do lấy từ VOffice, theo mục 7.2. Đã hủy hoặc Lỗi gửi thì hồ sơ giữ nguyên, hệ thống tạo công việc **Xử lý trình ký** cho người xử lý bước liền trước (bước 18: người xử lý bước 17), gồm thông tin lỗi và hai nút. \[Gửi lại\]: Lỗi gửi thì gửi lại với cùng khóa chống trùng, VOffice đã nhận thì không tạo yêu cầu thứ hai; Đã hủy thì tạo yêu cầu mới. Mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09). \[Coi như Từ chối\]: Lý do bắt buộc, đi nhánh Từ chối của văn bản đó (mục 7.2). Yêu cầu do hệ thống chủ động hủy (hồ sơ bị hủy, CQCM Chưa đạt ở bước 35) ghi Đã hủy, văn bản sang OBSOLETE, không tạo công việc Xử lý trình ký |
| BR-DXMS-08-05 | **Văn bản ký và người ký.** BM-03: bước 18, Chỉ huy đơn vị đề xuất đã đồng ý ở bước 13 lần gần nhất. BM-04: bước 22, Chỉ huy CQCM. BM-04 ký lại và Checklist: bước 37, Chỉ huy CQCM. BM-09 thẩm định: bước 40, TTMS và Phó TGĐ/Phó GĐ. BM-05: bước 44 TTMS, rồi bước 46 Chỉ huy CQCM về tài chính kế toán và CQCM có liên quan, bước 47 Phó TGĐ/Phó GĐ. BM-06: bước 52, Thủ trưởng VHT, không ký cấp phó. BM-08 hoặc BM-09 phê duyệt: bước 61, Người có thẩm quyền. Người ký là người đã chọn đồng ý ở bước liền trước, trừ BM-03; bước liền trước là bước của nhóm lãnh đạo, Chỉ huy hoặc Thủ trưởng theo BR-DXMS-08-01 |
| BR-DXMS-08-06 | **Bước AI.** Bước 3, 14, 21, 24, 25, 41, 49 và các lần AI kiểm tra trước khi gửi (sau bước 11, 12; trước bước 17, 36) chỉ sinh gợi ý theo BR-DXMS-C-08, ghi vào hồ sơ để form của bước sau hiện. AI lỗi hoặc quá 5 phút chưa có kết quả thì tiến trình vẫn đi tiếp, form của bước sau hiện "Chưa có kết quả gợi ý AI."; văn bản AI soạn (BM-05, BM-06) thì sinh bản trống từ mẫu, đã điền sẵn trường lấy từ hồ sơ. Riêng AI kiểm tra trước khi gửi sau bước 11, 12: lỗi thì cho gửi; Không đạt thì ở lại bước, từ lần Không đạt thứ hai liên tiếp có thêm lựa chọn Vẫn gửi, Lý do bắt buộc, Chỉ huy đơn vị thấy lý do ở bước 13. Bước 24 theo BR-DXMS-07-10 |
| BR-DXMS-08-07 | **Ký song song** (bước 38+39, 46+47): kết quả của nhánh là Đồng ý khi văn bản của nhánh đó Đã ký; Không đồng ý khi người ký chọn Không đồng ý hoặc VOffice trả Từ chối. Hệ thống chờ đủ hai nhánh (BR-DXMS-C-19); một nhánh Không đồng ý thì công việc của nhánh kia vẫn giữ, người đó vẫn xử lý được. Đủ hai nhánh mà có Không đồng ý thì về bước 25, mọi lý do thành dòng ý kiến (BR-DXMS-07-05). Bước 46 có nhiều CQCM thì nhánh CQCM là Đồng ý khi mọi CQCM Đã ký |
| BR-DXMS-08-08 | **Báo cáo Tổng Giám đốc Tập đoàn (bước 48).** Hai lựa chọn Có, Không đều dùng được. Hệ thống chọn sẵn theo gợi ý BR-DXMS-C-07 trên văn bản căn cứ và giá trị của hồ sơ, kèm lý do gợi ý; lưu cả gợi ý và lựa chọn. TTMS chọn khác gợi ý thì Lý do bắt buộc, tối đa 2000 ký tự. Có: sang bước 49, luồng .01. Không: sang bước 57, luồng .02 (BR-DXMS-C-05). Hồ sơ Điều chỉnh xét thêm theo BR-DXMS-09-11 |
| BR-DXMS-08-09 | **Bước của Tập đoàn (53–56).** Mỗi bước tạo một công việc giao đồng thời nhóm Ban ĐTXD Tập đoàn (bước 53–55) hoặc Tổng Giám đốc Tập đoàn (bước 56) và người xử lý bước 48 của hồ sơ; ai xử lý trước thì công việc hoàn thành. Người TTMS xử lý là ghi nhận thay: ở bước 53, 54, 56 bắt buộc tải văn bản nhận được, nhật ký ghi người ghi nhận và bên ra kết quả. Nhóm Tập đoàn chưa có người dùng thì công việc chỉ đến người TTMS |
| BR-DXMS-08-10 | **Phê duyệt (bước 60, 61).** Phê duyệt: trình ký BM-08 (MS01.01, .02) hoặc ký ô PHÊ DUYỆT trên BM-09 (MS01.03). Đã ký: hồ sơ COMPLETED, ĐXMS APPROVED, văn bản phê duyệt có Số văn bản, Ngày ký (DTMS_CN_0139). Từ chối ký: như Yêu cầu hoàn chỉnh, về bước 25. Chỉ đạo khác: hồ sơ STOPPED theo BR-DXMS-C-22. KPI toàn trình dừng khi Người có thẩm quyền bấm Phê duyệt (mục 2.3.3); văn bản phê duyệt bị Từ chối ký thì KPI chạy tiếp, dừng ở lần Phê duyệt sau |

**Ngoại lệ chung của mọi bước** (mục ngoại lệ của từng chức năng chỉ ghi phần riêng):

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Trường bắt buộc bỏ trống | Inline: "Vui lòng nhập {Tên trường}." hoặc "Vui lòng chọn {Tên trường}." |
| Lý do trả lại, không đồng ý bỏ trống | Inline: "Vui lòng nhập Lý do." |
| Công việc đã được xử lý, chuyển người khác, hoặc hồ sơ đã kết thúc khi Xác nhận | Theo DTMS_CN_0112 |
| Tải tệp lỗi, sai định dạng, quá dung lượng | Theo mục 4.1 |
| Sinh văn bản lỗi, lỗi xử lý, timeout | Toast: "Không thể thực hiện yêu cầu. Vui lòng thử lại." Không hoàn thành, giữ dữ liệu đã nhập (mục 4.6.7) |
| Ký bản giấy thiếu Số văn bản, Ngày ký, bản scan | Inline tại trường thiếu |
| VOffice lỗi khi gửi | Văn bản ở Lỗi gửi; công việc Xử lý trình ký theo BR-DXMS-08-04, câu "Gửi trình ký chưa thành công. Vui lòng Gửi lại." |

#### 3.1.8.1 DTMS_CN_0161 Xử lý bước: Xác định thông tin cơ bản, bóc tách căn cứ

##### 3.1.8.1.1 Thông tin chung chức năng

- **Mục đích:** Từ căn cứ đã chọn, chốt thông tin cơ bản của hồ sơ và danh mục hạng mục, đủ dữ liệu để sang rà soát tồn kho.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 1, 4, 5. Bước 2, 3, 6: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 4 \> nút của luật MS01_T04_HOAN_THANH (Hoàn thành).

- **Tiền điều kiện:**

  - Hồ sơ vừa khởi tạo (DTMS_CN_0154), công việc bước 1 giao người tạo.

- **Hậu điều kiện:**

  - Thông tin cơ bản của hồ sơ đã xác nhận.

  - Hạng mục đã xác nhận.

  - Tiến trình sang bước 7, hoặc về bước 4 khi thiếu dữ liệu.

##### 3.1.8.1.2 Màn hình

<img src="media/rId335.png" style="width:6.25in;height:3.51562in" alt="Rà soát thông tin cơ bản tại bước 4" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t04-thong-tin-co-ban và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: Tên hồ sơ, Mức ưu tiên chỉ đọc; Mục đích là ô chữ; có thêm Loại mua sắm, Thời gian thực hiện; có thông báo lý do khi hồ sơ quay về từ bước 6. Bước 1 xem DTMS_CN_0140, bước 5 xem DTMS_CN_0141.

##### 3.1.8.1.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 1 | ĐV chọn hoặc khai báo văn bản căn cứ, theo DTMS_CN_0140 |
| 2 | Tác vụ hệ thống lấy dữ liệu của văn bản đã chọn: thông tin khai báo, tệp đính kèm, các dòng đã khai báo. Không có nguồn dữ liệu tự động khác (BR-DXMS-02-07) |
| 3 | Tác vụ AI đọc tệp căn cứ, ghi biến aiGoiY (gợi ý Loại mua sắm, Mục đích, Phạm vi, Thời gian thực hiện, Nguồn vốn, mỗi mục kèm đoạn nguồn) và aiEstimate (Giá trị dự kiến). Lỗi theo BR-DXMS-08-06 |
| 4 | ĐV rà soát, xác nhận thông tin cơ bản |
| 5 | ĐV lập hạng mục, liên kết dòng căn cứ; hoặc báo Thiếu thông tin căn cứ, theo DTMS_CN_0141 |
| 6 | Cổng sau bước 5: Đủ khi bước 5 xác nhận danh mục, sang bước 7 và gửi yêu cầu tồn kho theo DTMS_CN_0142; Không đủ khi bước 5 chọn Thiếu thông tin căn cứ, về bước 4, biến thieuThongTin mang lý do (BR-DXMS-02-09) |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 4 | Activity_4 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t04-thong-tin-co-ban | MS01_T04_HOAN_THANH (Hoàn thành) | HOAN_THANH; KT-01 (fundId, danh mục Nguồn vốn); HX-04, HX-01 | Mục 2.4.3, dòng bước 4 | Bước 5 |

Bước 1, 5 có cấu hình riêng ở DTMS_CN_0140, DTMS_CN_0141. Bước 2, 3, 6 là tác vụ hệ thống, cổng trên BPMN, không có màn.

**Phần riêng** \[RIÊNG\]:

- Bảng gợi ý AI dùng kiểu trường aisuggest (mục 2.4.1), khóa aiGoiY; mục → trường đích: Loại mua sắm → purchaseType, Mục đích → purpose, Phạm vi → scope, Thời gian thực hiện → period, Nguồn vốn → fundId. Mặc định Chấp nhận. AI chưa có kết quả thì bảng rỗng, eForm hiện "Chưa có kết quả gợi ý AI.", các trường giữ giá trị của hồ sơ.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T04_HOAN_THANH (Hoàn thành) | eForm: Loại mua sắm, Mục đích, Nguồn vốn, Thời gian thực hiện, Mật có giá trị; dòng gợi ý chọn Sửa có Nội dung sửa. KT-01: Nguồn vốn còn hoạt động | HX-04 lưu gợi ý AI, quyết định và giá trị chốt (BR-DXMS-C-08); HX-01 ghi purchaseType, purpose, scope, fundId, period, secret vào hồ sơ. Tên hồ sơ, Mức ưu tiên không đổi (BR-DXMS-06-02). Mật Không khi ĐXMS Mật = Có: eForm cảnh báo, vẫn lưu. Hoàn thành công việc, sang bước 5 |

##### 3.1.8.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV hoàn thành bước 1. |
| 2 | Bước 2, 3 chạy. |
| 3 | ĐV mở bước 4, xem gợi ý, chọn quyết định từng mục, sửa trường, \[Xác nhận\]. |
| 4 | ĐV hoàn thành bước 5. |
| 5 | Bước 6 sang bước 7. |

**Luồng thay thế:** bước 5 chọn Thiếu thông tin căn cứ thì về bước 4; ĐV sửa thông tin, tới lại bước 5 sửa tiếp hạng mục hoặc văn bản (BR-DXMS-02-07). Không giới hạn số lần.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chọn Sửa, bỏ trống Nội dung sửa | Inline tại dòng: "Vui lòng nhập Nội dung sửa." |
| Nguồn vốn vừa ngừng hoạt động khi Xác nhận | KT-01, inline: "Nguồn vốn không còn hiệu lực, vui lòng chọn lại." Công việc giữ nguyên |
| AI chưa có kết quả | Bảng hiện "Chưa có kết quả gợi ý AI."; các trường giữ giá trị của hồ sơ |

**Đồng thời:** bước 4 mỗi lúc một người xử lý.

##### 3.1.8.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0161-01 | ĐV hoàn thành bước 1 | Mở bước 4 | Có bảng gợi ý AI, mỗi mục có Nguồn, mặc định Chấp nhận |
| AC-0161-02 | Mục Mục đích chọn Sửa, nhập nội dung | Bấm \[Xác nhận\] | Mục đích của hồ sơ là nội dung sửa; lưu cả gợi ý AI |
| AC-0161-03 | Mục Nguồn vốn chọn Bỏ | Bấm \[Xác nhận\] | Không lưu, báo "Vui lòng chọn Nguồn vốn." |
| AC-0161-04 | Dịch vụ AI lỗi ở bước 3 | Mở bước 4 | Bảng hiện "Chưa có kết quả gợi ý AI.", vẫn xác nhận được |
| AC-0161-05 | Hồ sơ MS01.03, AI ước 200 tỷ | Mở bước 4 | Có cảnh báo giá trị, không chặn |
| AC-0161-06 | Bước 5 chọn Thiếu thông tin căn cứ, lý do "Thiếu dự toán" | Bước 6 chạy | Hồ sơ về bước 4, có thông báo lý do |
| AC-0161-07 | Bước 5 xác nhận danh mục | Bước 6 chạy | Hồ sơ sang bước 7, giai đoạn GĐ-02 |
| AC-0161-08 | ĐXMS Mật = Có, ĐV chọn Mật Không | Bấm \[Xác nhận\] | Có cảnh báo, lưu được; Mật của ĐXMS không đổi |
| AC-0161-09 | ĐV sửa Thời gian thực hiện | Bấm \[Xác nhận\] | Hồ sơ có thời gian mới; ĐXMS không đổi (BR-DXMS-06-02) |
| AC-0161-10 | Luật MS01_T04_HOAN_THANH; Nguồn vốn đã chọn bị ngừng hoạt động sau khi mở form | Bấm \[Xác nhận\] | Bị chặn bởi KT-01: "Nguồn vốn không còn hiệu lực, vui lòng chọn lại."; công việc giữ nguyên |
| AC-0161-11 | Thêm một trường vào eForm dtms-ms01-t04-thong-tin-co-ban | Mở bước 4 của hồ sơ mới | Có trường mới; giá trị lưu trong dữ liệu form của bước; không sửa mã nguồn (AC-CH-03) |

#### 3.1.8.2 DTMS_CN_0162 Xử lý bước: Hoàn thiện dự thảo, thẩm định cấp đơn vị

##### 3.1.8.2.1 Thông tin chung chức năng

- **Mục đích:** Lập dự thảo Tờ trình (BM-01 hoặc BM-09) kèm Phụ lục chi phí, Checklist; Chỉ huy đơn vị kiểm duyệt trước khi gửi ra ngoài đơn vị.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 11, 12; CH tại bước 13. Bước 14 và AI kiểm tra trước khi gửi: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 11 hoặc 12 \> nút của luật MS01_T11_GUI_DUYET hoặc MS01_T12_GUI_DUYET (Gửi chỉ huy duyệt); Việc của tôi \> công việc bước 13 \> nút của luật MS01_T13_XAC_NHAN (Đồng ý) hoặc MS01_T13_TU_CHOI (Không đồng ý).

- **Tiền điều kiện:**

  - Hồ sơ ở bước 11 (MS01.03) hoặc 12 (MS01.01, .02).

  - Hoặc bước 13.

- **Hậu điều kiện:**

  - Có dự thảo của phiên bản hiện tại.

  - Chỉ huy đồng ý thì sang bước 15, không đồng ý thì về bước dự thảo.

##### 3.1.8.2.2 Màn hình

<img src="media/rId344.png" style="width:6.25in;height:3.51562in" alt="Hoàn thiện dự thảo BM-01 tại bước 12" />

<img src="media/rId347.png" style="width:6.25in;height:3.51562in" alt="Chỉ huy đơn vị duyệt tại bước 13" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t11-12-du-thao (bước 11, 12), dtms-ms01-t13-chi-huy-duyet (bước 13) và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: bước 11 dùng cùng eForm, Checklist 02 thay Checklist 01 theo luồng con, văn bản sinh ra là BM-09 thay BM-01; mục của Tờ trình đủ như BM-01 (Mục đích, Sự cần thiết, Danh mục hàng hóa, Giá trị, Nguồn vốn, Đánh giá hiệu quả, Biện pháp, Kế hoạch); Danh mục hàng hóa, Phụ lục chi phí, Checklist chỉ xem; không sinh BM-02 ở bước này; có ô Vẫn gửi và Lý do từ lần AI kiểm tra Không đạt thứ hai liên tiếp; bước 13 có thêm khối Giải trình của đơn vị khi hồ sơ về từ bước 29 và bảng phản hồi của đơn vị theo chỉ đạo lần trước.

##### 3.1.8.2.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 11, 12 | ĐV hoàn thiện dự thảo Tờ trình kèm Phụ lục chi phí, Checklist: bước 11 (MS01.03) theo BM-09 và Checklist 02, bước 12 (MS01.01, .02) theo BM-01 và Checklist 01; gửi Chỉ huy đơn vị duyệt. Khi gửi, AI kiểm tra hồ sơ trước (BR-DXMS-08-06), là kiểm tra KT-06 của luật |
| 13 | CH duyệt từng phần của dự thảo, đồng ý hoặc không đồng ý |
| 14 | Tác vụ AI đọc các phần Không đạt và dự thảo, sinh hướng dẫn sửa cho từng phần, ghi vào hồ sơ: biến traLai13 (lý do, tóm tắt nội dung chưa đạt) và phanHoiChiHuy (mỗi phần Không đạt một dòng: Phần, Chỉ đạo, Hướng dẫn AI). Hồ sơ về bước 11 nếu dưới ngưỡng, bước 12 nếu từ ngưỡng trở lên. Lỗi theo BR-DXMS-08-06 |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 11, 12 | Activity_11 (MS01.03), Activity_12 (MS01.01, .02) | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t11-12-du-thao | MS01_T11_GUI_DUYET, MS01_T12_GUI_DUYET (Gửi chỉ huy duyệt) | GUI_DUYET; KT-06 (AI kiểm tra trước khi gửi); HX-01, HX-04 (aiSuCanThiet), HX-05, HX-02. Văn bản theo luồng con (YC-NT-04): BM-01, Phụ lục chi phí, Checklist 01; MS01.03 là BM-09, Phụ lục chi phí, Checklist 02 | Mục 2.4.3, dòng bước 11, 12 | Bước 13 |
| 13 | Activity_13 | Nhóm Chỉ huy của đơn vị đề xuất (BR-DXMS-08-01) | dtms-ms01-t13-chi-huy-duyet | MS01_T13_XAC_NHAN (Đồng ý); MS01_T13_TU_CHOI (Không đồng ý) | Đồng ý: XAC_NHAN; KT-03; HX-01. Không đồng ý: TU_CHOI, không đặt Lý do bắt buộc, lý do theo từng phần trong eForm (BR-DXMS-08-02); KT-02; HX-01 | Mục 2.4.3, dòng bước 13 | Đồng ý: bước 15. Không đồng ý: bước 14 |

Bước 11 và 12 cùng eForm, cùng mã hành động, khác task key và luồng con; phần khác nhau (văn bản, Checklist) là tham số theo luồng con. Bước 14 là tác vụ AI trên BPMN, không có màn; cổng sau bước 14 rẽ theo luồng con của hồ sơ: MS01.03 về bước 11, MS01.01, .02 về bước 12.

Khối chỉ xem của eForm đọc biến của hồ sơ, không nhập lại (BR-DXMS-08-03): hoSo.nguoiCoThamQuyen (Kính gửi, Người có thẩm quyền theo BR-DXMS-08-01), hoSo.canCu, hoSo.tong, hoSo.tongBangChu, hoSo.nguonVon, hoSo.ten, hoSo.soHangMuc, period (bước 4), danhMucHang (hạng mục đã xác nhận: Tên, Đơn vị tính, SL mua sau tồn kho), phuLucChiPhi (từ DTMS_CN_0148), coCauChiPhi, cauTonKho (câu tự sinh từ kết quả rà soát: "Sử dụng {n} hạng mục từ tồn kho, giá trị {x} tỷ đồng." hoặc "Không sử dụng hàng tồn kho."), checklist (dòng theo biểu mẫu Checklist của luồng con, Tình trạng tính theo tài liệu đã có trên hồ sơ), lichSuSua (nhật ký), giaiTrinh, vongGiaiTrinh (bước 28, 29), ketLuan (bước 34).

**Phần riêng** \[RIÊNG\]:

- Bảng gợi ý Sự cần thiết dùng kiểu trường aisuggest (mục 2.4.1), khóa aiSuCanThiet, một mục: Sự cần thiết → suCanThiet; gợi ý theo hiện trạng, tồn kho, căn cứ, Loại mua sắm. Mặc định chưa chọn quyết định. AI chưa có kết quả thì bảng rỗng, eForm hiện "Chưa có kết quả gợi ý AI.", ĐV nhập trực tiếp Sự cần thiết.

- AI kiểm tra trước khi gửi đăng ký là mã kiểm tra KT-06 (mục 2.5.2), gọi dịch vụ AI; kết quả ghi biến aiCheck (kết quả, lý do, số lần Không đạt liên tiếp) để eForm bước 11, 12, 13 hiện.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T11_GUI_DUYET, MS01_T12_GUI_DUYET (Gửi chỉ huy duyệt) | eForm: Mục đích, Sự cần thiết, Biện pháp thực hiện, Kế hoạch tổ chức thực hiện có giá trị; dòng gợi ý Sự cần thiết đã chọn quyết định, chọn Sửa có Nội dung sửa; khi về từ bước 14, mọi dòng Phản hồi chỉ đạo có Xử lý, dòng Không sửa có Giải trình; chọn Vẫn gửi thì có Lý do. KT-06: AI kiểm tra hồ sơ (BR-DXMS-08-06); Không đạt thì chặn, ở lại bước, eForm hiện kết luận AI; AI lỗi hoặc quá thời gian chờ thì đạt; từ lần Không đạt thứ hai liên tiếp, chọn Vẫn gửi kèm Lý do thì đạt, lưu lý do | HX-01 ghi Phản hồi chỉ đạo; HX-04 lưu gợi ý AI Sự cần thiết, quyết định, giá trị chốt (BR-DXMS-C-08); HX-05 gắn phiên bản theo BR-DXMS-06-07: v1 khi hoàn tất lần đầu, tăng 1 khi hồ sơ đã qua bước 25, làm lại do Chỉ huy đơn vị trả về trước lần gửi CQCM đầu tiên thì giữ v1; sau đó HX-02 sinh Tờ trình, Phụ lục chi phí, Checklist theo luồng con, gắn phiên bản hiện tại (BR-DXMS-08-03); không sinh BM-02. Hoàn thành công việc, giao bước 13 cho nhóm Chỉ huy đơn vị đề xuất |
| MS01_T13_XAC_NHAN (Đồng ý) | eForm: mọi phần có Kết quả. KT-03: mọi phần Đạt | HX-01 lưu kết quả duyệt từng phần; hoàn thành công việc, sang bước 15 |
| MS01_T13_TU_CHOI (Không đồng ý) | eForm: mỗi phần Không đạt có Lý do, chỉ đạo. KT-02: ít nhất một phần Không đạt | HX-01 lưu kết quả duyệt; các phần Không đạt là lý do trả lại; hoàn thành công việc, sang bước 14: AI sinh hướng dẫn sửa từng phần; hồ sơ về bước 11 nếu dưới ngưỡng, bước 12 nếu từ ngưỡng trở lên |

##### 3.1.8.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV mở bước 12, nhập các mục, bấm nút của luật MS01_T12_GUI_DUYET (Gửi chỉ huy duyệt), \[Xác nhận\]. |
| 2 | KT-06: AI kiểm tra Đạt; hệ thống sinh văn bản, giao bước 13. |
| 3 | CH xem, để mọi phần Đạt, bấm nút của luật MS01_T13_XAC_NHAN (Đồng ý), \[Xác nhận\]. |
| 4 | Sang bước 15. |

**Luồng thay thế:** CH đặt phần Không đạt, bấm nút của luật MS01_T13_TU_CHOI (Không đồng ý); bước 14 sinh hướng dẫn; ĐV sửa, trả lời từng chỉ đạo, gửi lại. Hồ sơ về từ bước 29 (vòng ≤ 2): CH xem giải trình, đồng ý thì gửi lại CQCM qua bước 15.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| AI kiểm tra Không đạt | KT-06 chặn: không chuyển bước, công việc giữ nguyên; eForm hiện kết luận AI; toast "AI kiểm tra hồ sơ: Không đạt — {Lý do}. Hồ sơ chưa được gửi." Từ lần thứ hai liên tiếp, eForm có ô Vẫn gửi và Lý do (BR-DXMS-08-06) |
| Sự cần thiết chưa chọn quyết định | Inline: "Vui lòng chọn quyết định cho gợi ý AI." |
| AI chưa có gợi ý Sự cần thiết | Bảng gợi ý hiện "Chưa có kết quả gợi ý AI."; ĐV nhập trực tiếp Sự cần thiết |
| Dòng Không sửa thiếu Giải trình | Inline tại dòng: "Vui lòng nhập Giải trình." |
| Bấm nút của luật MS01_T13_XAC_NHAN (Đồng ý) khi có phần Không đạt | KT-03: "Còn phần Không đạt, không thể đồng ý." Công việc giữ nguyên |
| Bấm nút của luật MS01_T13_TU_CHOI (Không đồng ý) khi mọi phần Đạt | KT-02: "Vui lòng chọn ít nhất một phần Không đạt." Công việc giữ nguyên |

**Đồng thời:** ĐV đang sửa dự thảo thì hồ sơ chưa tới bước 13, CH không có công việc.

##### 3.1.8.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0162-01 | Hồ sơ MS01.01 qua bước 10 | Mở công việc | Là bước 12, form BM-01, Checklist 01 |
| AC-0162-02 | Hồ sơ MS01.03 | Mở công việc | Là bước 11, form BM-09, Checklist 02 |
| AC-0162-03 | Bỏ trống Biện pháp thực hiện | Bấm \[Xác nhận\] | Không chuyển bước, lỗi inline |
| AC-0162-04 | AI kết luận thiếu nội dung | Bấm \[Xác nhận\] | Bị chặn bởi KT-06, ở lại bước 12, có thông báo lý do |
| AC-0162-05 | Đủ dữ liệu, lần đầu | Bấm \[Xác nhận\] | Có BM-01 v1, Phụ lục, Checklist ở Văn bản đầu ra; CH có công việc bước 13 |
| AC-0162-06 | CH để phần "2.3 Giá trị" Không đạt, lý do | Bấm nút của luật MS01_T13_TU_CHOI (Không đồng ý) | Bước 14 chạy, hồ sơ về bước 12, ĐV thấy dòng phản hồi phần Giá trị |
| AC-0162-07 | ĐV chọn Không sửa, nhập giải trình | Gửi lại; CH mở bước 13 | CH thấy giải trình |
| AC-0162-08 | Lần sửa trước lần gửi CQCM đầu tiên | Gửi lại | Vẫn v1 (BR-DXMS-06-07) |
| AC-0162-09 | Hồ sơ đã qua bước 25, về bước 12 theo kết luận bước 34 | Bấm \[Xác nhận\] | Phiên bản tăng 1 |
| AC-0162-10 | Hồ sơ về từ bước 29, vòng 1 | CH mở bước 13 | Có khối Giải trình của đơn vị |
| AC-0162-11 | AI kiểm tra lỗi | Bấm \[Xác nhận\] | Vẫn sang bước 13 |
| AC-0162-12 | AI Không đạt lần thứ hai liên tiếp, ĐV chọn Vẫn gửi, nhập lý do | Bấm \[Xác nhận\] | Sang bước 13; CH thấy lý do |
| AC-0162-13 | Hồ sơ MS01.03, CH đặt một phần Không đạt | Bấm nút của luật MS01_T13_TU_CHOI (Không đồng ý) | Bước 14 chạy, về bước 11 |
| AC-0162-14 | Mọi phần Đạt | CH bấm nút của luật MS01_T13_XAC_NHAN (Đồng ý) | Sang bước 15, có dự thảo BM-03 |
| AC-0162-15 | Luật MS01_T13_XAC_NHAN kích hoạt; phần "2.3 Giá trị" Không đạt | CH bấm nút của luật | Nút vẫn hiện; bị chặn bởi KT-03: "Còn phần Không đạt, không thể đồng ý."; công việc giữ nguyên, không sang bước 15 |
| AC-0162-16 | Luật MS01_T13_TU_CHOI kích hoạt; mọi phần Đạt | CH bấm nút của luật | Nút vẫn hiện; bị chặn bởi KT-02: "Vui lòng chọn ít nhất một phần Không đạt."; công việc giữ nguyên |
| AC-0162-17 | Luật MS01_T11_GUI_DUYET, MS01_T12_GUI_DUYET kích hoạt | Mở bước 11 của hồ sơ MS01.03 và bước 12 của hồ sơ MS01.01 | Cùng eForm dtms-ms01-t11-12-du-thao; bước 11 hiện Checklist 02, bước 12 hiện Checklist 01; nút cùng tên (Gửi chỉ huy duyệt) |

#### 3.1.8.3 DTMS_CN_0163 Xử lý bước: Chọn và xác nhận danh sách CQCM

##### 3.1.8.3.1 Thông tin chung chức năng

- **Mục đích:** Lập phiếu yêu cầu thẩm định BM-03, chọn CQCM; TTMS xác nhận danh sách đúng, đủ; hệ thống trình ký BM-03 và gửi CQCM.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 16; TT tại bước 17. Bước 15, 18: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 16 \> nút của luật MS01_T16_GUI_DUYET (Gửi TTMS xác nhận danh sách CQCM); Việc của tôi \> công việc bước 17 \> nút của luật MS01_T17_XAC_NHAN (Danh sách đúng, đủ — gửi yêu cầu thẩm định) hoặc MS01_T17_TU_CHOI (Chưa đúng/đủ — trả lại).

- **Tiền điều kiện:**

  - Chỉ huy đơn vị đồng ý ở bước 13.

- **Hậu điều kiện:**

  - Có lần thẩm định mới (BR-DXMS-07-01).

  - BM-03 Đã ký.

  - Mỗi CQCM có công việc bước 19.

  - Mốc T0.

##### 3.1.8.3.2 Màn hình

<img src="media/rId356.png" style="width:6.25in;height:3.51562in" alt="Lập phiếu yêu cầu thẩm định tại bước 16" />

<img src="media/rId359.png" style="width:6.25in;height:3.51562in" alt="TTMS xác nhận danh sách CQCM tại bước 17" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t16-chon-cqcm (bước 16), dtms-ms01-t17-xac-nhan-cqcm (bước 17) và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: hai CQCM bắt buộc chọn sẵn, không bỏ được, ở cả hai nhánh giá trị; BM-03 ký nháy tải trong eForm của bước 16; Hạn góp ý nhập ở bước 17, không nhập ở bước 16; không nhập nội dung BM-03 ở bước 16 (dự thảo sinh từ hồ sơ); có Lần thẩm định và lịch sử trả lại; bước 17 không có ô Nhận xét khi đồng ý.

##### 3.1.8.3.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 15 | Tác vụ hệ thống sinh dự thảo BM-03 từ hồ sơ: Tên ĐXMS, đơn vị đề xuất, văn bản căn cứ; ghi biến lanThamDinh (lần sẽ gửi, bằng số lần đã gửi cộng 1, BR-DXMS-07-01) và giá trị khởi tạo của cqcmList (mọi CQCM đang hoạt động; hai CQCM bắt buộc theo BR-DXMS-C-12 có cờ Bắt buộc; CQCM của lần trước chọn sẵn); giao bước 16 cho ĐV |
| 16 | ĐV chọn CQCM, Đầu mối tiếp nhận, tải BM-03 đã ký nháy, gửi TTMS xác nhận |
| 16 → 17 | Tác vụ AI đối chiếu thành phần CQCM theo hạng mục, nguồn vốn của hồ sơ, ghi biến aiCqcm (Đủ thành phần hoặc Thiếu, kèm lý do); chỉ gợi ý. Lỗi theo BR-DXMS-08-06 |
| 17 | TT xem danh sách, kết quả AI, BM-03; chốt Hạn góp ý; xác nhận danh sách đúng, đủ hoặc trả lại |
| 18 | Tác vụ hệ thống điền Hạn góp ý vào BM-03, trình ký BM-03; Đã ký thì mở lần thẩm định mới và gửi CQCM; Từ chối thì về bước 16 kèm lý do |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 16 | Activity_16 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t16-chon-cqcm | MS01_T16_GUI_DUYET (Gửi TTMS xác nhận danh sách CQCM) | GUI_DUYET; KT-07 (cqcmList, CQCM bắt buộc); KT-01 (cqcmList\[\].agencyId, danh mục CQCM); HX-01, HX-07 (Chờ xác nhận), HX-06 (hanGopYMacDinh) | Mục 2.4.3, dòng bước 16 | Bước 17 |
| 17 | Activity_17 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms01-t17-xac-nhan-cqcm | MS01_T17_XAC_NHAN (Danh sách đúng, đủ — gửi yêu cầu thẩm định); MS01_T17_TU_CHOI (Chưa đúng/đủ — trả lại) | Đúng, đủ: XAC_NHAN; KT-08 (hanGopY, lần đầu); HX-01, HX-07 (Đã xác nhận). Trả lại: TU_CHOI, Lý do bắt buộc; HX-07 (Trả lại) | Mục 2.4.3, dòng bước 17 | Đúng, đủ: bước 18. Trả lại: bước 16 |

Bước 15, tác vụ AI sau bước 16 và bước 18 là tác vụ hệ thống trên BPMN, không có màn. Khối chỉ xem đọc biến: lanThamDinh, cqcmList (bước 15, 16), traLai17, lichSuTraLaiCqcm (HX-07 của luật MS01_T17_TU_CHOI), tuChoiKyBm03 (kết quả ký ở bước 18), aiCqcm (tác vụ AI), hanGopYMacDinh (HX-06), nguoiDungOptions (người dùng của đơn vị đề xuất, kèm Điện thoại, Email từ hồ sơ người dùng), hoSo.nguoiPhuTrach.

**Bước 18** \[CẤU HÌNH\] trên BPMN là chuỗi tác vụ hệ thống: HX-02 điền Hạn góp ý vào BM-03; HX-03 trình ký BM-03 cho Chỉ huy đơn vị đề xuất đã đồng ý ở bước 13 lần gần nhất (BR-DXMS-08-04, BR-DXMS-08-05), không qua hộp thoại Trình ký; chờ kết quả ký. Hồ sơ Mật: người xử lý bước 17 nhận công việc Nhập kết quả ký bản giấy (YC-NT-03); nhập xong mới gửi CQCM. Đã ký: chạy HX-08, rồi bước 19 chạy đa thể hiện theo danh sách CQCM của lần vừa gửi, mỗi CQCM một công việc. Từ chối: ghi tuChoiKyBm03 kèm lý do, về bước 16. Lỗi gửi hoặc Đã hủy: công việc Xử lý trình ký giao người xử lý bước 17 (YC-NT-03, BR-DXMS-08-04): \[Gửi lại\] khi Lỗi gửi thì gửi lại cùng khóa chống trùng, khi Đã hủy thì tạo yêu cầu mới, mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09); \[Coi như Từ chối\] bắt buộc Lý do, đi nhánh Từ chối của văn bản (mục 7.2).

**Phần riêng** \[RIÊNG\]:

- HX-08 Mở lần thẩm định, đăng ký là tác vụ hệ thống của bước 18 sau khi BM-03 Đã ký (mục 2.5.3): lần đang lập thành lần mới nhất (tăng lần thẩm định); ghi T0 bằng thời điểm gửi; tính lại Hạn góp ý bằng T0 cộng cùng số NLV nếu TTMS không sửa tay (HX-06); gửi thông báo kèm BM-03, hồ sơ cho Đầu mối và người xử lý của từng CQCM; các dòng ý kiến của CQCM không còn trong danh sách thành Không còn áp dụng (BR-DXMS-07-08); CQCM chưa có người xử lý thì vẫn gửi, công việc vào nhóm của CQCM, thông báo TTMS "CQCM {Tên} chưa có người xử lý."

- Tác vụ AI đối chiếu thành phần CQCM là tác vụ hệ thống trên BPMN, ghi biến aiCqcm; eForm bước 17 hiện bằng khối ai.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T16_GUI_DUYET (Gửi TTMS xác nhận danh sách CQCM) | eForm: có Đầu mối tiếp nhận; đã tải BM-03 ký nháy. KT-07: danh sách có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán (BR-DXMS-C-12). KT-01: mọi CQCM đã chọn đang hoạt động | HX-01 ghi danh sách CQCM, đầu mối, tệp BM-03 ký nháy vào lần thẩm định đang lập; HX-07 đặt trạng thái xác nhận Chờ xác nhận (BR-DXMS-07-02); HX-06 tính hanGopYMacDinh: lần đầu ngày hiện tại cộng hạn thẩm định (mục 2.3.3) tính NLV, từ lần 2 bằng Hạn góp ý của lần đầu. Hoàn thành công việc, giao bước 17 cho nhóm chuyên viên TTMS |
| MS01_T17_XAC_NHAN (Danh sách đúng, đủ — gửi yêu cầu thẩm định) | eForm: Hạn góp ý có giá trị; \[Xác nhận\] của hộp thoại eForm là bước xác nhận của TT. KT-08: lần đầu, Hạn góp ý không nhỏ hơn ngày hiện tại | HX-01 ghi Hạn góp ý; HX-07 đặt Đã xác nhận, người, thời điểm xác nhận; hoàn thành công việc, sang bước 18 |
| MS01_T17_TU_CHOI (Chưa đúng/đủ — trả lại) | Lý do bắt buộc (hộp thoại Lý do) | HX-07 đặt Trả lại, lưu lý do riêng cho lần trả lại, không ghi đè; hoàn thành công việc, về bước 16 |

##### 3.1.8.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Bước 15 sinh BM-03. |
| 2 | ĐV chọn CQCM, đầu mối, tải BM-03 ký nháy, bấm nút của luật MS01_T16_GUI_DUYET (Gửi TTMS xác nhận danh sách CQCM), \[Xác nhận\]. |
| 3 | TT xem, bấm nút của luật MS01_T17_XAC_NHAN (Danh sách đúng, đủ — gửi yêu cầu thẩm định), giữ hoặc sửa Hạn góp ý, \[Xác nhận\]. |
| 4 | Bước 18 trình ký, gửi CQCM. |

**Luồng thay thế:** TT bấm nút của luật MS01_T17_TU_CHOI (Chưa đúng/đủ — trả lại), nhập Lý do; ĐV sửa danh sách, gửi lại; mỗi lần trả lại lưu riêng.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bỏ chọn CQCM bắt buộc qua API | KT-07, lỗi: "Danh sách phải có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán." Công việc giữ nguyên |
| CQCM đã chọn vừa ngừng hoạt động khi Xác nhận | KT-01, inline: "CQCM {Tên} không còn hoạt động, vui lòng chọn lại." Công việc giữ nguyên |
| Lần đầu, Hạn góp ý nhỏ hơn ngày hiện tại | KT-08, inline: "Hạn góp ý không được nhỏ hơn ngày hiện tại." Công việc giữ nguyên |
| Chưa tải BM-03 ký nháy | Inline: "Vui lòng tải lên BM-03 đã ký nháy." |
| CQCM chưa có người xử lý | Bước 18 vẫn gửi; công việc vào nhóm của CQCM; thông báo TTMS "CQCM {Tên} chưa có người xử lý." |

**Đồng thời:** bước 16, 17 mỗi lúc một người xử lý.

##### 3.1.8.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0163-01 | Hồ sơ dưới 160 tỷ | Mở bước 16 | Hai CQCM bắt buộc đã chọn, không bỏ được |
| AC-0163-02 | Ngày 01/10/2026, hồ sơ 200 tỷ, lần 1 | TT mở bước 17 | Hạn góp ý mặc định 13/10/2026 (8 NLV) |
| AC-0163-10 | Lần 1 hạn 13/10/2026, lần 2 TT mở bước 17 ngày 20/10/2026 | Xem Hạn góp ý | Mặc định 13/10/2026, TT sửa được; giữ nguyên thì vẫn xác nhận được, công việc bước 19 Quá hạn ngay |
| AC-0163-03 | Chưa tải BM-03 ký nháy | Bấm \[Xác nhận\] | Không chuyển bước, lỗi inline |
| AC-0163-04 | ĐV gửi danh sách | TT mở bước 17 | Thấy danh sách, kết quả AI, BM-03 |
| AC-0163-05 | TT trả lại, lý do "Thiếu Ban Pháp chế" | ĐV mở bước 16 | Có thông báo lý do; trạng thái Trả lại |
| AC-0163-06 | TT đồng ý | Bước 18 chạy, Chỉ huy ký BM-03 | Ba CQCM có công việc bước 19; T0 là thời điểm gửi; Lần thẩm định 1 |
| AC-0163-07 | Chỉ huy từ chối BM-03 trên VOffice | Nhận kết quả | Hồ sơ về bước 16, có lý do |
| AC-0163-08 | Lần 2 bỏ CQCM A | Bước 18 gửi | A không có công việc; dòng Đang xử lý của A Không còn áp dụng |
| AC-0163-09 | Hồ sơ Mật | Bước 18 | Người xử lý bước 17 có công việc Nhập kết quả ký bản giấy BM-03; nhập xong mới gửi CQCM |
| AC-0163-11 | VOffice lỗi khi gửi BM-03 | Bước 18 | Người xử lý bước 17 có công việc Xử lý trình ký; Gửi lại không tạo yêu cầu thứ hai |
| AC-0163-12 | Luật MS01_T16_GUI_DUYET kích hoạt; dữ liệu gửi qua API không có CQCM về tài chính kế toán | Gọi thực thi hành động | Bị chặn bởi KT-07: "Danh sách phải có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán."; công việc giữ nguyên |
| AC-0163-13 | Luật MS01_T16_GUI_DUYET kích hoạt; Ban Pháp chế đã chọn bị ngừng hoạt động sau khi mở form | Bấm \[Xác nhận\] | Bị chặn bởi KT-01: "CQCM Ban Pháp chế không còn hoạt động, vui lòng chọn lại."; công việc giữ nguyên |
| AC-0163-14 | Luật MS01_T17_XAC_NHAN kích hoạt; lần 1, Hạn góp ý nhỏ hơn ngày hiện tại | Bấm \[Xác nhận\] | Bị chặn bởi KT-08: "Hạn góp ý không được nhỏ hơn ngày hiện tại."; công việc giữ nguyên |
| AC-0163-15 | Luật MS01_T17_TU_CHOI kích hoạt, đặt Lý do bắt buộc | TT bấm nút của luật, bỏ trống Lý do | Mở hộp thoại Lý do; báo "Vui lòng nhập Lý do."; nhập Lý do thì về bước 16, ĐV thấy lý do và dòng mới trong Lịch sử trả lại |

#### 3.1.8.4 DTMS_CN_0164 Xử lý bước: CQCM thẩm định bằng BM-04

##### 3.1.8.4.1 Thông tin chung chức năng

- **Mục đích:** Mỗi CQCM lập phiếu nhận xét BM-04, Chỉ huy CQCM duyệt và ký; hệ thống tổng hợp đủ BM-04 hợp lệ.

- **Người dùng mục tiêu:** Thao tác: CQ tại bước 19 (chuyên viên), 20 (Chỉ huy CQCM). Bước 21, 22, 23: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 19 \> nút của luật MS01_T19_HOAN_THANH (Hoàn thành phiếu, trình chỉ huy); Việc của tôi \> công việc bước 20 \> nút của luật MS01_T20_TRINH_KY (Đồng ý & trình ký BM-04) hoặc MS01_T20_TU_CHOI (Không đồng ý).

- **Tiền điều kiện:**

  - Bước 18 đã gửi.

  - Hoặc hồ sơ về bước 19 do xung đột, BM-04 bị từ chối.

- **Hậu điều kiện:**

  - BM-04 Đã ký của từng CQCM.

  - Đủ thì sang bước 24.

##### 3.1.8.4.2 Màn hình

<img src="media/rId368.png" style="width:6.25in;height:3.51562in" alt="Lập BM-04 tại bước 19" />

<img src="media/rId371.png" style="width:6.25in;height:3.51562in" alt="Chỉ huy CQCM duyệt BM-04 tại bước 20" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t19-bm04, dtms-ms01-t20-ky-bm04 và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: bước 19 có Ý kiến chung, Đầu mối phối hợp, khối lý do quay lại; khi lần thẩm định sau lần 1 có thêm ý kiến lần trước của cơ quan mình và BM-02; Nội dung nhận xét chỉ bắt buộc với mục Không OK; không có dòng kết luận phiếu; bước 20 có liên kết dự thảo BM-04.

##### 3.1.8.4.3 Mô tả chi tiết các thành phần

**Mục đánh giá của BM-04** \[CẤU HÌNH\]: Căn cứ; Sự cần thiết; Phạm vi, số lượng; Giá trị và cơ sở giá; Nguồn vốn; Biện pháp thực hiện; Phương án kỹ thuật – công nghệ. Đây là danh mục cấu hình, nạp làm dòng khởi tạo của bảng bm04Phieu trong eForm bước 19; sửa danh mục không cần đổi mã.

**Các bước:**

| Bước | Xử lý |
|----|----|
| 19 | Chuyên viên CQCM lập phiếu nhận xét theo mục đánh giá |
| 20 | Chỉ huy CQCM xem phiếu, đồng ý và trình ký BM-04, hoặc không đồng ý kèm nhận xét |
| 21 | Tác vụ AI tóm tắt nhận xét của Chỉ huy thành việc cần sửa theo mục, về bước 19 cho đúng CQCM |
| 22 | Trình ký BM-04 cho Chỉ huy CQCM qua VOffice hoặc ghi kết quả ký bản giấy, theo BR-DXMS-08-04; thông báo đơn vị đề xuất khi Đã ký |
| 23 | Xét BR-DXMS-C-13, BR-DXMS-07-03 mỗi khi có kết quả ký mới. Đủ BM-04 hợp lệ của mọi CQCM thì sang bước 24; chưa đủ thì chờ. BM-04 bị Từ chối thì CQCM đó có lại công việc bước 19 (mục 7.2) |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 19 | Activity_19 | Nhóm chuyên viên của từng CQCM, một công việc cho mỗi CQCM trong danh sách đã xác nhận của lần mới nhất, kể cả TTMS với tư cách CQCM về đầu tư – xây dựng (BR-DXMS-08-01) | dtms-ms01-t19-bm04 | MS01_T19_HOAN_THANH (Hoàn thành phiếu, trình chỉ huy) | HOAN_THANH; HX-04, HX-01, HX-02 (dự thảo BM-04) | Mục 2.4.3, dòng bước 19 | Bước 20 của CQCM đó |
| 20 | Activity_20 | Nhóm Chỉ huy của CQCM đó (BR-DXMS-08-01) | dtms-ms01-t20-ky-bm04 | MS01_T20_TRINH_KY (Đồng ý & trình ký BM-04); MS01_T20_TU_CHOI (Không đồng ý) | Đồng ý: TRINH_KY; HX-02, HX-03 mặc định, văn bản BM-04. Không đồng ý: TU_CHOI, Lý do bắt buộc | — | Đồng ý: bước 22. Không đồng ý: bước 21 |

**Bước 21, 22, 23** \[CẤU HÌNH\] trên BPMN, không có màn:

- Bước 19–22 chạy đa thể hiện theo danh sách CQCM đã xác nhận của lần mới nhất (biến cqcmList, mục 2.4.3 dòng bước 16, 17). Vòng 20 → 21 → 19 và BM-04 bị Từ chối → 19 nằm trong thể hiện của CQCM đó; CQCM khác không bị ảnh hưởng.

- Bước 21 là tác vụ AI (BR-DXMS-08-06): đọc lý do của luật MS01_T20_TU_CHOI và phiếu của CQCM, ghi biến traLai20 (nhận xét của Chỉ huy, tóm tắt việc cần sửa theo mục); về bước 19 của CQCM đó.

- Bước 22 là bước chờ kết quả ký của BPMN sau hậu xử lý HX-03 của luật MS01_T20_TRINH_KY. Đã ký thì gửi thông báo đơn vị đề xuất theo mẫu thông báo của bước. Lỗi gửi, Đã hủy: công việc Xử lý trình ký theo YC-NT-03. Từ chối: biến tuChoiBm04 (người ký, lý do từ VOffice), về bước 19 của CQCM đó.

- Bước 23 chạy mỗi khi có kết quả ký mới; cổng sau bước 23: Đủ sang bước 24, Chưa đủ chờ (mục 7.2).

**Phần riêng** \[RIÊNG\]:

- Xét BM-04 hợp lệ (bước 23): tác vụ hệ thống trên BPMN tại bước 23, cập nhật bm04.valid, bm04.invalid_reason, appraisal_round.bm04_complete_at theo BR-DXMS-C-13, BR-DXMS-07-03, đếm "{x}/{n}". Dùng lại ở bước chờ ký lại sau bước 36 (BR-DXMS-C-17). Kết quả ký về cùng lúc thì xét lần lượt, chỉ sang bước 24 một lần.

- Biến chỉ xem của eForm bước 19 (cột Đọc biến, mục 7.4): traLai20 do bước 21 ghi; xungDotBm04 do tác vụ AI bước 24 ghi riêng cho từng CQCM liên quan, chỉ gồm mục xung đột và gợi ý, không có tên, nội dung của cơ quan khác (BR-DXMS-07-04, BR-DXMS-07-10); tuChoiBm04 do bước 22 ghi; yKienLanTruoc là các dòng ý kiến của chính CQCM ở các lần trước (bảng opinion) kèm Quyết định, Giải trình, Kết quả; Gợi ý AI của từng mục là cột aiGoiY của dòng bm04Phieu, do tác vụ AI bước 21, 24 điền khi có.

**Mẫu văn bản BM-04** \[CẤU HÌNH\] (mẫu Word Phiếu nhận xét, trường trộn là khóa eForm bước 19, BR-DXMS-08-03): Kính gửi đơn vị đề xuất; căn cứ BM-03; mỗi dòng bm04Phieu có danhGia Không OK một đoạn "{muc}: {nhanXet}. Đề nghị: {huongDan}"; yKienChung; dauMoiPhoiHop. Không có dòng Không OK thì thân văn bản ghi "{CQCM} thống nhất với nội dung dự thảo ĐXMS."

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T19_HOAN_THANH (Hoàn thành phiếu, trình chỉ huy) | eForm: mọi mục có Đánh giá; mục Không OK có Nội dung nhận xét; có Đầu mối phối hợp. Người dùng là chuyên viên của CQCM được giao (thứ tự 1 của mục 2.5) | HX-04 lưu gợi ý AI và quyết định của từng mục (BR-DXMS-C-08); HX-01 ghi phiếu và mục đánh giá theo mục 2.4.3, dòng bước 19; HX-02 sinh dự thảo BM-04 (BR-DXMS-08-03). Hoàn thành công việc, giao bước 20 cho nhóm Chỉ huy của CQCM đó |
| MS01_T20_TRINH_KY (Đồng ý & trình ký BM-04) | Người dùng là Chỉ huy của CQCM đó | HX-02 sinh BM-04 từ dữ liệu bước 19, gắn phiên bản hiện tại; HX-03 trình ký BM-04 cho Chỉ huy CQCM (BR-DXMS-08-04, BR-DXMS-08-05); sang bước 22. Đã ký: bước 23 xét BR-DXMS-C-13, BR-DXMS-07-03, đủ BM-04 hợp lệ của mọi CQCM thì sang bước 24, chưa đủ thì chờ. Từ chối: CQCM đó có lại công việc bước 19 |
| MS01_T20_TU_CHOI (Không đồng ý) | Lý do bắt buộc, hộp thoại Lý do của nền tảng (nhận xét của Chỉ huy) | Hoàn thành công việc; bước 21 AI tóm tắt nhận xét thành việc cần sửa theo mục; về bước 19 của đúng CQCM đó; CQCM khác không bị ảnh hưởng |
| Công việc Xử lý trình ký của bước 22 \[NỀN TẢNG\] (YC-NT-03) | Người xử lý bước liền trước; văn bản ở Lỗi gửi hoặc Đã hủy (BR-DXMS-08-04). \[Coi như Từ chối\] bắt buộc Lý do | \[Gửi lại\]: Lỗi gửi thì gửi lại cùng khóa chống trùng, Đã hủy thì tạo yêu cầu mới; mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09). \[Coi như Từ chối\]: đi nhánh Từ chối của văn bản (mục 7.2) |

##### 3.1.8.4.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Mỗi CQCM nhận bước 19, lập phiếu, xác nhận. |
| 2 | Chỉ huy CQCM xem, bấm nút của luật MS01_T20_TRINH_KY (Đồng ý & trình ký BM-04). |
| 3 | Bước 22 trình ký. |
| 4 | Bước 23 chờ đủ, sang bước 24. |

**Luồng thay thế:** Chỉ huy bấm nút của luật MS01_T20_TU_CHOI (Không đồng ý) thì qua bước 21 về bước 19 của CQCM đó; các CQCM khác không bị ảnh hưởng.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Mục chưa đánh giá | Inline tại dòng: "Vui lòng chọn Đánh giá." |
| Không OK, bỏ trống Nội dung nhận xét | Inline tại dòng: "Vui lòng nhập Nội dung nhận xét." |
| Hồ sơ không đủ điều kiện để thẩm định | Bước 19 không có luật từ chối thẩm định; CQCM đánh giá Không OK, ghi ở Ý kiến chung |
| Quá Hạn góp ý | Công việc Quá hạn theo BR-DXMS-C-27, không dừng |
| AI tóm tắt lỗi ở bước 21 | Bước 19 hiện nhận xét của Chỉ huy, phần tóm tắt hiện "Chưa có kết quả gợi ý AI." (BR-DXMS-08-06) |

**Đồng thời:** các CQCM xử lý song song, mỗi công việc mỗi lúc một người. Kết quả ký về cùng lúc thì bước 23 xét lần lượt, chỉ tạo một lần sang bước 24.

##### 3.1.8.4.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0164-01 | Ba CQCM được gửi | Mỗi chuyên viên mở bước 19 | Mỗi người một phiếu, 7 mục, không thấy phiếu cơ quan khác |
| AC-0164-02 | Mục Nguồn vốn Không OK, bỏ trống nhận xét | Bấm \[Xác nhận\] | Lỗi inline tại dòng |
| AC-0164-03 | Mọi mục OK | Xác nhận | BM-04 có câu "thống nhất với nội dung dự thảo ĐXMS" |
| AC-0164-04 | Luật MS01_T20_TU_CHOI kích hoạt, Chỉ huy CQCM ở bước 20 | Bấm nút của luật, nhập Lý do | Bước 21 chạy; chuyên viên có lại bước 19 với nhận xét của Chỉ huy và tóm tắt |
| AC-0164-05 | Chỉ huy đồng ý, ký điện tử | VOffice trả Đã ký | BM-04 hợp lệ; bộ đếm "1/3" |
| AC-0164-06 | 2/3 CQCM Đã ký | Mở tab Cơ quan và kết quả | Hồ sơ ở bước 23, chờ |
| AC-0164-07 | CQCM thứ ba Đã ký | Bước 23 xét | Sang bước 24 một lần |
| AC-0164-08 | VOffice từ chối BM-04 của A | Nhận kết quả | A có lại bước 19; hồ sơ vẫn chờ |
| AC-0164-09 | Lần thẩm định 2 | Chuyên viên A mở bước 19 | Thấy ý kiến lần 1 của A và BM-02 |
| AC-0164-10 | VOffice lỗi khi gửi BM-04 | Bước 22 | Lỗi gửi; Chỉ huy CQCM có công việc Xử lý trình ký; Gửi lại không tạo yêu cầu thứ hai |
| AC-0164-11 | Luật MS01_T20_TRINH_KY, MS01_T20_TU_CHOI kích hoạt, vai trò Chỉ huy CQCM | Mở bước 20 | Có nút của hai luật; nút của luật MS01_T20_TU_CHOI mở hộp thoại Lý do, nút của luật MS01_T20_TRINH_KY mở hộp thoại Trình ký BM-04 |
| AC-0164-12 | Mục Phạm vi, số lượng OK, bỏ trống Nội dung nhận xét; các mục khác hợp lệ | Bấm \[Xác nhận\] ở bước 19 | Lưu được; Nội dung nhận xét chỉ bắt buộc với mục Không OK |
| AC-0164-13 | Phiếu 7 mục, 2 mục Không OK | Bấm \[Xác nhận\] ở bước 19 | Có dự thảo BM-04 ở Văn bản đầu ra với hai đoạn nhận xét; phiếu ghi Số ý kiến Không OK là 2 |
| AC-0164-14 | Danh mục Mục đánh giá BM-04 thêm một mục | Chuyên viên mở bước 19 của lần thẩm định mới | Phiếu có 8 mục; không sửa mã nguồn |
| AC-0164-15 | Thêm một trường vào eForm dtms-ms01-t19-bm04 | Mở bước 19 | Có trường mới; giá trị lưu trong dữ liệu form của bước; không sửa mã nguồn (AC-CH-03) |

#### 3.1.8.5 DTMS_CN_0165 Xử lý bước: Xử lý ý kiến, giải trình, họp, kết luận

##### 3.1.8.5.1 Thông tin chung chức năng

- **Mục đích:** Từ BM-04 đã đủ, kiểm tra xung đột, tổng hợp ý kiến, để đơn vị đề xuất tiếp thu hoặc giải trình, hoàn chỉnh hồ sơ; vượt 2 vòng thì họp, kết luận.

- **Người dùng mục tiêu:** Thao tác: ĐV tại bước 26, 27, 28; TT tại bước 31, 32, 33; TV tại bước 34. Bước 24, 25, 29, 30: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 27 \> nút của luật MS01_T27_GUI_DUYET (Gửi hồ sơ hoàn chỉnh cho CQCM). Bước 26, 28 theo DTMS_CN_0158; bước 31–34 theo DTMS_CN_0160.

- **Tiền điều kiện:**

  - Hồ sơ tới bước 24.

  - Hoặc tới bước 25 do bị trả lại sau ký (BR-DXMS-C-20).

- **Hậu điều kiện:**

  - Hồ sơ hoàn chỉnh ở phiên bản mới, sang bước 35.

  - Hoặc về bước 13 (giải trình, vòng ≤ 2).

  - Hoặc về bước 11, 12 (kết luận Yêu cầu xử lý lại).

##### 3.1.8.5.2 Màn hình

<img src="media/rId380.png" style="width:6.25in;height:3.51562in" alt="Hoàn chỉnh hồ sơ tại bước 27" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t27-hoan-chinh và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: bước 27 có các mục của Tờ trình sửa được như bước 11, 12; bảng việc cần sửa có nguồn từng dòng; có kết luận họp, kết luận của Người có thẩm quyền, lý do Chưa đạt ở bước 35 khi có; Tờ trình là BM-01 hoặc BM-09, Checklist 01 hoặc 02 theo luồng con. Ảnh bước 26, 28 ở DTMS_CN_0158; bước 31, 32, 34 ở DTMS_CN_0160.

##### 3.1.8.5.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 24 | AI so các BM-04 hợp lệ của lần hiện tại, tìm cặp nhận xét trái nhau trên cùng mục. Có thì theo BR-DXMS-07-10; không có, lỗi, hoặc đã quay về một lần thì sang bước 25 |
| 25 | Sinh dòng ý kiến theo BR-DXMS-07-05, kể cả dòng từ lý do trả lại; AI tóm tắt, gộp ý kiến theo mục kèm hướng dẫn sửa; thông báo ĐV; giao bước 26 |
| 26 | ĐV quyết định từng dòng, theo DTMS_CN_0158. Có Bảo lưu thì sang bước 28, không có thì sang bước 27 (BR-DXMS-07-06) |
| 27 | ĐV hoàn chỉnh hồ sơ. Xác nhận: tăng phiên bản, sinh lại Tờ trình, Phụ lục, Checklist, BM-02 và Phụ lục 1 (BR-DXMS-07-07); văn bản đã ký của phiên bản cũ sang OBSOLETE; tạo công việc bước 35 cho mọi CQCM của lần mới nhất |
| 28 | ĐV lập giải trình, theo DTMS_CN_0158 |
| 29 | Tăng Vòng xử lý 1. Vòng lớn hơn 2 thì sang bước 30; không thì về bước 13 (BR-DXMS-C-15) |
| 30 | Gửi cảnh báo và yêu cầu họp tới ĐV, các CQCM của lần mới nhất, TT (BR-DXMS-07-09); giao bước 31 cho TT |
| 31–34 | Họp, kết quả họp, trình, kết luận theo DTMS_CN_0160. Đã thống nhất, Thống nhất phương án thì sang bước 27; Yêu cầu xử lý lại thì về bước 11 hoặc 12 (BR-DXMS-C-16) |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 27 | Activity_27 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms01-t27-hoan-chinh | MS01_T27_GUI_DUYET (Gửi hồ sơ hoàn chỉnh cho CQCM) | GUI_DUYET; HX-05, HX-02. Văn bản theo luồng con (YC-NT-04): BM-01, Checklist 01; MS01.03 là BM-09, Checklist 02; mọi luồng thêm Phụ lục chi phí, BM-02 và Phụ lục 1 | — | Bước 35, một công việc cho mỗi CQCM của danh sách đã xác nhận của lần mới nhất |

Bước 26, 28 có cấu hình ở DTMS_CN_0158; bước 31–34 ở DTMS_CN_0160.

**Bước 24, 25, 29, 30** \[CẤU HÌNH\] là tác vụ hệ thống và cổng trên BPMN, không có màn:

- Bước 24: tác vụ AI; cổng sau bước 24 theo kết quả AI và appraisal_round.conflict_checked: Có xung đột, chưa quay về lần nào trong lần thẩm định thì về bước 19 của đúng các CQCM liên quan (biến xungDotBm04 cho từng CQCM); Không, AI lỗi, hoặc đã quay về một lần thì sang bước 25 (BR-DXMS-07-10, mục 7.2).

- Bước 25: tác vụ hệ thống sinh dòng ý kiến, tác vụ AI tóm tắt; gửi thông báo ĐV theo mẫu thông báo của bước; giao bước 26.

- Bước 29: tác vụ hệ thống tăng profile.loop_no; cổng sau bước 29: lớn hơn 2 sang bước 30, không thì về bước 13 (BR-DXMS-C-15).

- Bước 30: gửi cảnh báo và yêu cầu họp theo mẫu thông báo tới ĐV, các CQCM của lần mới nhất, TT; giao bước 31.

- Hồ sơ bị trả lại sau ký ở bước 38, 39, 40, 42, 44, 46, 47, 51, 52, 53, 56, 60, 61 vào bước 25 theo mục 7.2.

**Phần riêng** \[RIÊNG\]:

- Kiểm tra xung đột (bước 24): tác vụ AI trên BPMN tại bước 24, ghi profile.ai_conflict; với mỗi CQCM liên quan ghi biến xungDotBm04 chỉ gồm mục xung đột và gợi ý, không có tên, nội dung của cơ quan khác (BR-DXMS-07-04); BM-04 của CQCM liên quan thành không hợp lệ tới khi ký bản mới; đặt appraisal_round.conflict_checked.

- Sinh dòng ý kiến (bước 25): tác vụ hệ thống trên BPMN tại bước 25, sinh dòng opinion từ bm04_item Không OK của BM-04 hợp lệ và từ lý do trả lại theo BR-DXMS-07-05; dòng đã có không sinh lại. Tác vụ AI tóm tắt ghi profile.ai_summary; lỗi thì dòng ý kiến vẫn sinh.

- Biến chỉ xem của eForm bước 27 (cột Đọc biến, mục 7.4): viecCanSua là dòng opinion Tiếp thu, Đang xử lý của hồ sơ kèm nguồn (CQCM hoặc "{Người trả lại} — bước {n}"); ketLuanHop, ketLuan là khóa eForm bước 32, 34 của lần họp, kết luận gần nhất; chuaDat35 là các dòng Chưa đạt ở bước 35 trên phiên bản hiện tại (bảng opinion_check, mục 2.4.3 dòng bước 35), có khi hồ sơ về từ bước 35; linkSoSanh là liên kết mở So sánh phiên bản (DTMS_CN_0156), mặc định so phiên bản hiện tại với phiên bản CQCM đã nhận xét. Các mục của Tờ trình dùng cùng khóa eForm với bước 11, 12 (DTMS_CN_0162), giá trị khởi tạo là nội dung phiên bản hiện tại, để mẫu Tờ trình sinh lại dùng chung trường trộn.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T27_GUI_DUYET (Gửi hồ sơ hoàn chỉnh cho CQCM) | eForm: các mục bắt buộc của Tờ trình có giá trị như bước 11, 12. Người dùng là người nhận công việc (ĐV) | HX-05 tăng phiên bản, kể cả khi không đổi nội dung (BR-DXMS-06-07); văn bản đã ký của phiên bản cũ sang OBSOLETE (BR-DXMS-C-11). HX-02 sinh lại Tờ trình, Phụ lục chi phí, Checklist, BM-02 và Phụ lục 1 từ các dòng ý kiến hiện có, kèm kết luận họp nếu có (BR-DXMS-07-07), gắn phiên bản mới. Hoàn thành công việc; BPMN tạo công việc bước 35 cho mọi CQCM của lần mới nhất |
| Luật của bước 26, 28, 31–34 | Theo DTMS_CN_0158, DTMS_CN_0160 | Theo DTMS_CN_0158, DTMS_CN_0160 |

##### 3.1.8.5.4 Luồng nghiệp vụ

**Luồng chính, tiếp thu toàn bộ:**

| Bước | Mô tả |
|----|----|
| 1 | Bước 24 không xung đột. |
| 2 | Bước 25 tổng hợp. |
| 3 | ĐV đồng ý sửa mọi dòng ở bước 26. |
| 4 | ĐV sửa Tờ trình ở bước 27, bấm nút của luật MS01_T27_GUI_DUYET, \[Xác nhận\]. |
| 5 | Sang bước 35. |

**Luồng thay thế:**

| Tình huống | Hướng đi |
|----|----|
| Có dòng Bảo lưu | 26 → 28 → 29; vòng ≤ 2 về 13 → 15 → 18, lần thẩm định mới; vòng \> 2 sang 30 → 31 → 32 |
| Họp đã thống nhất | 32 → 27; dòng Bảo lưu chuyển Theo kết luận |
| Họp chưa thống nhất | 32 → 33 → 34; Thống nhất phương án → 27; Yêu cầu xử lý lại → 11 hoặc 12 |
| Bị trả lại sau ký (bước 38, 39, 40, 42, 44, 46, 47, 51, 52, 53, 56, 60, 61) | Vào bước 25 với dòng từ lý do trả lại, đi tiếp như trên |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| AI tóm tắt lỗi ở bước 25 | Dòng ý kiến vẫn sinh; khối tóm tắt ở bước 26 hiện "Chưa có kết quả gợi ý AI." |
| Không có dòng ý kiến nào khi tới bước 25 | Bước 26 hiện bảng trống, \[Xác nhận\] sang bước 27 |
| Gửi cảnh báo họp lỗi với một người nhận | Ghi lỗi gửi ở Thông báo, không chặn bước 31 |

**Đồng thời:** bước 26, 27, 28 mỗi lúc một người. Trong lúc hồ sơ ở bước 25–34, CQCM không có công việc trên hồ sơ.

##### 3.1.8.5.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0165-01 | Đủ 3 BM-04, AI không thấy xung đột | Bước 24 chạy | Sang bước 25; dòng ý kiến sinh; ĐV có bước 26 |
| AC-0165-02 | Mọi dòng Tiếp thu, hồ sơ v1 | ĐV xác nhận bước 27 | v2; Văn bản đầu ra có BM-01 v2, BM-02; BM-04 v1 OBSOLETE; mỗi CQCM có bước 35 |
| AC-0165-03 | Bước 26 có Bảo lưu, vòng 0 | ĐV xác nhận bước 28 | Vòng 1, về bước 13 |
| AC-0165-04 | Vòng đang 2, có Bảo lưu | ĐV xác nhận bước 28 | Vòng 3, bước 30 gửi yêu cầu họp, TT có bước 31 |
| AC-0165-05 | TT ở bước 32, luật MS01_T32_XAC_NHAN (Đã thống nhất) kích hoạt | Bấm nút của luật | Sang bước 27; bước 27 hiện kết luận họp ở Việc cần sửa |
| AC-0165-06 | TV ở bước 34, hồ sơ 120 tỷ, luật MS01_T34_TRA_LAI (Yêu cầu xử lý lại) kích hoạt | Bấm nút của luật | Về bước 11 |
| AC-0165-07 | Phó TGĐ không đồng ý BM-05, lý do "Thiếu so sánh đơn giá" | Hồ sơ tới bước 26 | Có dòng nguồn "{Phó TGĐ} — bước 47" |
| AC-0165-08 | Về từ bước 35, Ban Tài chính Chưa đạt | ĐV mở bước 27 | Có thông báo lý do của Ban Tài chính |
| AC-0165-09 | Không đổi nội dung ở bước 27 | Xác nhận | Vẫn tăng phiên bản (BR-DXMS-06-07) |
| AC-0165-10 | AI báo xung đột giữa Ban Pháp chế và Ban Tài chính, lần đầu | Bước 24 | Hai CQCM có lại bước 19, mỗi bên thấy mục xung đột, không thấy tên cơ quan kia; Phòng Chất lượng giữ BM-04 |
| AC-0165-11 | Hồ sơ v2, ĐV xác nhận bước 28 | Kiểm tra | v3 (BR-DXMS-06-07) |
| AC-0165-12 | TV ở bước 34, luật MS01_T34_XAC_NHAN (Thống nhất phương án) kích hoạt | Bấm nút của luật | Sang bước 27; dòng Bảo lưu chuyển Theo kết luận |
| AC-0165-13 | Luật MS01_T27_GUI_DUYET kích hoạt, ĐV nhận bước 27 | Mở bước 27, bấm nút của luật | Mở eForm dtms-ms01-t27-hoan-chinh; các mục của Tờ trình mang nội dung phiên bản hiện tại |
| AC-0165-14 | Hồ sơ MS01.03 | Mở bước 27, bấm nút của luật MS01_T27_GUI_DUYET | Tên nút như ở MS01.01; eForm hiện Tờ trình BM-09 và Checklist 02 |
| AC-0165-15 | Bước 27, bỏ trống 2.6 Biện pháp thực hiện | Bấm \[Xác nhận\] | Không lưu, inline "Vui lòng nhập 2.6 Biện pháp thực hiện."; phiên bản không tăng, công việc giữ nguyên |
| AC-0165-16 | Thêm một trường vào eForm dtms-ms01-t27-hoan-chinh | Mở bước 27 | Có trường mới; giá trị lưu trong dữ liệu form của bước; không sửa mã nguồn (AC-CH-03) |

#### 3.1.8.6 DTMS_CN_0166 Xử lý bước: Rà soát lại, ký lại phiên bản hiện tại

##### 3.1.8.6.1 Thông tin chung chức năng

- **Mục đích:** CQCM kiểm tra hồ sơ đã hoàn chỉnh, ký lại BM-04 và Checklist trên phiên bản hiện tại.

- **Người dùng mục tiêu:** Thao tác: CQ tại bước 35 (chuyên viên), 36 (Chỉ huy CQCM). Bước 37: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 35 \> nút của luật MS01_T35_XAC_NHAN (Đạt) hoặc MS01_T35_TRA_LAI (Chưa đạt); Việc của tôi \> công việc bước 36 \> nút của luật MS01_T36_TRINH_KY (Xác nhận ký BM-04 và Checklist).

- **Tiền điều kiện:**

  - ĐV hoàn tất bước 27.

- **Hậu điều kiện:**

  - Mọi CQCM có BM-04 và Checklist Đã ký trên phiên bản hiện tại, hồ sơ sang bước 38 và 39 (MS01.03) hoặc 41.

  - Hoặc về bước 27.

##### 3.1.8.6.2 Màn hình

<img src="media/rId389.png" style="width:6.25in;height:3.51562in" alt="CQCM kiểm tra lại tại bước 35" />

<img src="media/rId392.png" style="width:6.25in;height:3.51562in" alt="Xác nhận ký BM-04 và Checklist tại bước 36" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm và luật nút của bước (mục 2.4), không dựng riêng. Trường theo mục 7.4; khác ảnh: bước 35 có Kết quả kiểm tra theo từng dòng, ý kiến gồm mọi lần thẩm định của cơ quan mình; bước 36 có dự thảo BM-04 ký lại; tên nút bước 36 như nhau ở mọi luồng con.

##### 3.1.8.6.3 Mô tả chi tiết các thành phần

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 35 | Activity_35 | Nhóm chuyên viên của từng CQCM, một công việc cho mỗi CQCM của danh sách đã xác nhận (BR-DXMS-08-01) | dtms-ms01-t35-kiem-tra-sua | MS01_T35_XAC_NHAN (Đạt); MS01_T35_TRA_LAI (Chưa đạt) | Đạt: XAC_NHAN; KT-03; HX-01. Chưa đạt: TRA_LAI, không đặt Lý do bắt buộc, lý do theo dòng trong eForm; KT-02; HX-01 | Mục 2.4.3, dòng bước 35 | Đạt: bước 36 của CQCM đó. Chưa đạt: bước 27 |
| 36 | Activity_36 | Nhóm Chỉ huy của CQCM đó | dtms-ms01-t36-ky-checklist | MS01_T36_TRINH_KY (Xác nhận ký BM-04 và Checklist) | TRINH_KY; HX-02, HX-03 mặc định. Văn bản theo luồng con (YC-NT-04): BM-04 ký lại và Checklist 01; MS01.03 là Checklist 02 | — | Bước 37 |

**Bước 37** là bước chờ kết quả ký của BPMN: trình ký BM-04 ký lại và Checklist cho Chỉ huy CQCM theo BR-DXMS-08-04; xét BR-DXMS-C-17 mỗi khi có kết quả: đủ mọi CQCM của lần mới nhất có BM-04 và Checklist Đã ký trên phiên bản hiện tại thì sang bước tiếp theo giá trị (mục 7.2); chưa đủ thì chờ; BM-04 bị Từ chối thì CQCM đó có lại bước 35. Công việc Xử lý trình ký khi Lỗi gửi, Đã hủy theo YC-NT-03.

**Một CQCM Chưa đạt** \[CẤU HÌNH\] trên BPMN: bước 35–37 chạy đa thể hiện theo danh sách CQCM; outcome Chưa đạt của một thể hiện là điều kiện kết thúc sớm của cả nhóm. Khác với ký song song (BR-DXMS-08-07), hệ thống không chờ CQCM khác, vì sau bước 27 phiên bản tăng và mọi kết quả kiểm tra cũ hết hiệu lực. Công việc bước 35, 36 đang mở của CQCM khác bị hủy, ghi nhật ký "Hủy do {CQCM} Chưa đạt"; yêu cầu trình ký bước 37 đang chờ của phiên bản này được hủy trên VOffice, kết quả về sau được ghi nhưng văn bản ở OBSOLETE (BR-DXMS-08-04). Sau bước 27, mọi CQCM làm lại bước 35 trên phiên bản mới.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T35_XAC_NHAN (Đạt) | eForm: mọi dòng có Kết quả kiểm tra. KT-03: mọi dòng Đạt. Cơ quan không có dòng ý kiến thì đạt KT-03 | HX-01: dòng thành Đã xử lý, dòng Theo kết luận giữ nguyên (BR-DXMS-07-08); hoàn thành công việc, giao bước 36 cho nhóm Chỉ huy của CQCM đó |
| MS01_T35_TRA_LAI (Chưa đạt) | eForm: dòng Chưa đạt có Lý do. KT-02: ít nhất một dòng Chưa đạt | HX-01: dòng Chưa đạt về Đang xử lý; hồ sơ về bước 27, các thể hiện khác kết thúc như đoạn trên |
| MS01_T36_TRINH_KY (Xác nhận ký BM-04 và Checklist) | — | HX-02 sinh BM-04 ký lại từ kết quả bước 35; HX-03 trình ký BM-04 ký lại và Checklist theo luồng con; sang bước 37 |

##### 3.1.8.6.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                               |
|------|-----------------------------------------------------|
| 1    | Mỗi CQCM nhận bước 35, kiểm tra từng dòng, \[Đạt\]. |
| 2    | Chỉ huy CQCM xem Checklist, \[Xác nhận ký\].        |
| 3    | Bước 37 chờ đủ, sang bước ký thẩm định.             |

**Luồng thay thế:** một CQCM Chưa đạt thì về bước 27, các công việc song song bị hủy.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Dòng chưa chọn Kết quả kiểm tra | Inline tại dòng: "Vui lòng chọn Kết quả kiểm tra." |
| Bấm nút Đạt khi có dòng Chưa đạt | KT-03: "Còn ý kiến Chưa đạt, không thể chọn Đạt." Công việc giữ nguyên |
| Bấm nút Chưa đạt khi mọi dòng Đạt hoặc không có dòng | KT-02: "Vui lòng chọn ít nhất một ý kiến Chưa đạt." Công việc giữ nguyên |
| Công việc bị hủy do CQCM khác Chưa đạt khi đang mở | Theo DTMS_CN_0112 |
| AI kiểm tra đủ hồ sơ lỗi | Khối hiện "Chưa có kết quả gợi ý AI."; vẫn ký được |

**Đồng thời:** các CQCM song song; hai CQCM bấm Chưa đạt cùng lúc thì hồ sơ về bước 27 một lần, lý do của cả hai được ghi.

##### 3.1.8.6.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0166-01 | Hồ sơ v2, 3 CQCM | ĐV hoàn tất bước 27 | Mỗi CQCM có bước 35 |
| AC-0166-02 | Ban Tài chính mở bước 35 | Xem bảng | Chỉ có dòng của Ban Tài chính |
| AC-0166-03 | Mọi dòng Đạt | Bấm \[Đạt\] | Dòng Đã xử lý; Chỉ huy có bước 36 |
| AC-0166-04 | Ban Pháp chế đã ở bước 36, Ban Tài chính Chưa đạt | Ban Tài chính bấm \[Chưa đạt\] | Hồ sơ về bước 27; công việc bước 36 của Ban Pháp chế bị hủy |
| AC-0166-05 | Sau đó ĐV hoàn tất bước 27 lên v3 | Ban Pháp chế mở bước 35 | Có công việc mới, thấy Kết quả kiểm tra lần trước |
| AC-0166-06 | Hồ sơ MS01.03, luật MS01_T36_TRINH_KY kích hoạt | Chỉ huy CQCM mở bước 36, bấm nút của luật | Tên nút như ở MS01.01 (Xác nhận ký BM-04 và Checklist); hộp thoại Trình ký có BM-04 ký lại và Checklist 02 |
| AC-0166-07 | 2/3 CQCM Đã ký v3 | Kiểm tra bước 37 | Chờ, chưa sang bước 41 |
| AC-0166-08 | Đủ 3 CQCM, hồ sơ 200 tỷ | Bước 37 xét | Sang bước 41 |
| AC-0166-09 | Đủ 3 CQCM, hồ sơ 120 tỷ | Bước 37 xét | Tạo đồng thời bước 38, 39 |
| AC-0166-10 | Cơ quan không có dòng ý kiến | Mở bước 35, bấm nút Chưa đạt | eForm hiện "Không có ý kiến cần kiểm tra."; nút Đạt, Chưa đạt đều hiện; Chưa đạt bị chặn bởi KT-02, Đạt dùng được |
| AC-0166-13 | Ban Tài chính có một dòng Chưa đạt | Bấm nút Đạt | Bị chặn bởi KT-03, công việc giữ nguyên, không giao bước 36 |
| AC-0166-11 | VOffice từ chối BM-04 ký lại của Ban Pháp chế | Nhận kết quả | Ban Pháp chế có lại bước 35; hồ sơ chờ |
| AC-0166-12 | Ban Pháp chế BM-04 Đã ký, Checklist chưa có kết quả | Bước 37 xét | Chưa đủ, hồ sơ chờ |

#### 3.1.8.7 DTMS_CN_0167 Xử lý bước: Ký thẩm định trực tiếp BM-09

##### 3.1.8.7.1 Thông tin chung chức năng

- **Mục đích:** Hồ sơ dưới ngưỡng: TTMS và Phó TGĐ/Phó GĐ ký thẩm định trực tiếp trên BM-09.

- **Người dùng mục tiêu:** Thao tác: TT tại bước 38; PG tại bước 39. Bước 40: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 38 \> nút của luật MS01_T38_TRINH_KY (Ký thẩm định BM-09) hoặc MS01_T38_TU_CHOI (Không đồng ý); công việc bước 39 \> nút của luật MS01_T39_TRINH_KY (Ký thẩm định BM-09) hoặc MS01_T39_TU_CHOI (Không đồng ý).

- **Tiền điều kiện:**

  - Hồ sơ MS01.03 qua bước 37.

- **Hậu điều kiện:**

  - BM-09 có đủ hai chữ ký thẩm định, sang bước 60.

  - Hoặc về bước 25.

##### 3.1.8.7.2 Màn hình

<img src="media/rId401.png" style="width:6.25in;height:3.51562in" alt="Ký thẩm định BM-09 tại bước 38" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms01-t38-39-ky-bm09 và luật nút của bước (mục 2.4), không dựng riêng; bước 38, 39 dùng cùng eForm. Trường theo mục 7.4; khác ảnh: có KPI toàn trình; có dòng Hồ sơ kèm theo (Checklist 02, BM-04 đã ký, BM-02).

##### 3.1.8.7.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 37 | Đủ mọi CQCM Đã ký BM-04 và Checklist, hồ sơ MS01.03: mở hai nhánh song song, tạo đồng thời bước 38, 39 (DTMS_CN_0166) |
| 38 | Lãnh đạo TTMS ký thẩm định BM-09 với tư cách CQCM về đầu tư – xây dựng, hoặc không đồng ý |
| 39 | Phó TGĐ/Phó GĐ phụ trách lĩnh vực ký thẩm định BM-09, hoặc không đồng ý |
| 40 | Tổng hợp kết quả hai nhánh theo BR-DXMS-08-07: hai nhánh Đồng ý thì sang bước 60; có Không đồng ý, kể cả VOffice Từ chối, thì về bước 25 |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 38 | Activity_38 | Nhóm lãnh đạo TTMS, ký với tư cách CQCM về đầu tư – xây dựng (BR-DXMS-08-01) | dtms-ms01-t38-39-ky-bm09 | MS01_T38_TRINH_KY (Ký thẩm định BM-09); MS01_T38_TU_CHOI (Không đồng ý) | Ký: TRINH_KY; HX-02, HX-03 mặc định, văn bản BM-09 của phiên bản hiện tại, người ký là người xử lý. Không đồng ý: TU_CHOI, Lý do bắt buộc | — | Nhánh TTMS, tới bước 40 |
| 39 | Activity_39 | Phó TGĐ/Phó GĐ phụ trách lĩnh vực của hồ sơ (BR-DXMS-08-01) | dtms-ms01-t38-39-ky-bm09 | MS01_T39_TRINH_KY (Ký thẩm định BM-09); MS01_T39_TU_CHOI (Không đồng ý) | Như bước 38 | — | Nhánh Phó TGĐ/Phó GĐ, tới bước 40 |

**Dữ liệu chỉ xem của eForm** (mục 2.4.3): kpiToanTrinh do API thông tin hồ sơ tính khi mở công việc, "{đã dùng} / {giới hạn} NLV" từ T0 của lần thẩm định đầu, giới hạn theo tham số Giới hạn KPI toàn trình (mục 2.3.6, mặc định 10 NLV), cùng cách tính với Chi tiết hồ sơ (DTMS_CN_0155, BR-DXMS-C-27); kyBm09 do nền tảng trình ký ghi khi gửi trình ký và khi nhận kết quả ký (YC-NT-03): Người ký, Tư cách, Trạng thái, Thời điểm; phienBan là phiên bản hiện tại của hồ sơ.

**Ký song song và bước 40** \[CẤU HÌNH\] trên BPMN, không lập trình: sau bước 37 là cổng song song mở hai nhánh. Mỗi nhánh gồm công việc ký (bước 38 hoặc 39) và điểm chờ kết quả ký của văn bản nhánh đó (YC-NT-03). Kết quả nhánh theo BR-DXMS-08-07: Đồng ý khi BM-09 của nhánh Đã ký; Không đồng ý khi người ký bấm nút của luật TU_CHOI của bước hoặc VOffice trả Từ chối, lý do lấy từ VOffice. Nhánh Không đồng ý không kết thúc nhánh kia: công việc của nhánh kia giữ nguyên, người đó vẫn xử lý được. Bước 40 là cổng hợp song song chờ đủ hai nhánh có kết quả (BR-DXMS-C-19), như điểm chờ-23 (mục 7.2), tiếp theo là cổng rẽ nhánh: hai nhánh Đồng ý thì sang bước 60; có Không đồng ý thì về bước 25. Kết quả hai nhánh về cùng lúc thì cổng hợp xét một lần.

**Xử lý trình ký** \[NỀN TẢNG\] (YC-NT-03, BR-DXMS-08-04): yêu cầu trình ký của bước 38, 39 ở Lỗi gửi hoặc Đã hủy thì người xử lý bước liền trước nhận công việc Xử lý trình ký với \[Gửi lại\], \[Coi như Từ chối\]. \[Gửi lại\]: Lỗi gửi thì gửi lại cùng khóa chống trùng, Đã hủy thì tạo yêu cầu mới; mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09). \[Coi như Từ chối\]: Lý do bắt buộc, nhánh của văn bản đó là Không đồng ý (mục 7.2).

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T38_TRINH_KY, MS01_T39_TRINH_KY (Ký thẩm định BM-09) | Người dùng thuộc vai trò nhận việc của bước theo BR-DXMS-08-01 (luật lọc theo vai trò) | Hộp thoại Trình ký cho chính người xử lý (BR-DXMS-08-04, BR-DXMS-08-05): HX-02 dùng BM-09 của phiên bản hiện tại, không sinh bản mới khi văn bản đã có; HX-03 gửi trình ký. Hoàn thành công việc; nhánh chờ kết quả ký, Đã ký thì nhánh Đồng ý |
| MS01_T38_TU_CHOI, MS01_T39_TU_CHOI (Không đồng ý) | Lý do bắt buộc, hộp thoại Lý do của nền tảng | Nhánh là Không đồng ý (outcome agreed=false); công việc của nhánh kia giữ nguyên. Đủ hai nhánh thì về bước 25; bước 25 sinh dòng ý kiến từ lý do (BR-DXMS-07-05) |

##### 3.1.8.7.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                     |
|------|-------------------------------------------|
| 1    | Bước 37 tạo bước 38, 39 song song.        |
| 2    | Mỗi người xem, ký.                        |
| 3    | Bước 40 nhận đủ hai chữ ký, sang bước 60. |

**Luồng thay thế:** một người Không đồng ý thì chờ người kia xử lý xong, về bước 25.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** theo ngoại lệ chung, BR-DXMS-08-04.

**Đồng thời:** hai người xử lý độc lập; kết quả về cùng lúc thì bước 40 xét một lần.

##### 3.1.8.7.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0167-01 | Hồ sơ MS01.03 qua bước 37 | Kiểm tra Việc của tôi | TT có bước 38, PG có bước 39 |
| AC-0167-02 | TT Đã ký, PG chưa xử lý | Kiểm tra | Hồ sơ chờ; khối chữ ký TT Đã ký |
| AC-0167-03 | Cả hai Đã ký | Bước 40 xét | Sang bước 60, TV có công việc |
| AC-0167-04 | PG Không đồng ý, TT chưa xử lý | Kiểm tra | Hồ sơ chờ; TT vẫn có bước 38 |
| AC-0167-05 | Sau đó TT ký | Bước 40 xét | Về bước 25, có dòng ý kiến từ lý do của PG |
| AC-0167-06 | VOffice từ chối chữ ký của TT | Nhận kết quả | Nhánh TT là Không đồng ý, lý do từ VOffice |
| AC-0167-07 | Hồ sơ MS01.01 | Kiểm tra | Không có bước 38–40 |
| AC-0167-08 | Luật MS01_T38_TRINH_KY, MS01_T38_TU_CHOI kích hoạt, người dùng thuộc nhóm lãnh đạo TTMS | Mở bước 38 | Có nút của hai luật; nút của luật MS01_T38_TU_CHOI mở hộp thoại Lý do, bỏ trống Lý do thì báo "Vui lòng nhập Lý do." |
| AC-0167-09 | TT bấm nút của luật MS01_T38_TU_CHOI, PG chưa xử lý | PG mở bước 39 | Nút của luật MS01_T39_TRINH_KY vẫn hiện và dùng được; bước 40 chưa xét tới khi nhánh của PG có kết quả |

#### 3.1.8.8 DTMS_CN_0168 Xử lý bước: Lập và ký BM-05

##### 3.1.8.8.1 Thông tin chung chức năng

- **Mục đích:** Hồ sơ từ ngưỡng trở lên: AI soạn Báo cáo kết quả thẩm định BM-05, TTMS rà soát và ký trước, rồi CQCM và Phó TGĐ/Phó GĐ ký.

- **Người dùng mục tiêu:** Thao tác: TT tại bước 42, 43; CQ tại bước 46; PG tại bước 47. Bước 41, 44, 45: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 42 \> nút của luật MS01_T42_XAC_NHAN (Hoàn tất rà soát BM-05) hoặc MS01_T42_TRA_LAI (Hồ sơ chưa đạt — trả đơn vị); bước 43 \> MS01_T43_TRINH_KY (Xác nhận đủ điều kiện & ký BM-05 (TTMS)) hoặc MS01_T43_TRA_LAI (Trả lại); bước 46 \> MS01_T46_TRINH_KY (Ký BM-05) hoặc MS01_T46_TU_CHOI (Không đồng ý); bước 47 \> MS01_T47_TRINH_KY (Đồng ý, ký BM-05) hoặc MS01_T47_TU_CHOI (Không đồng ý).

- **Tiền điều kiện:**

  - Hồ sơ MS01.01, .02 qua bước 37.

- **Hậu điều kiện:**

  - BM-05 Đã ký đủ, sang bước 48.

  - Hoặc về bước 25.

##### 3.1.8.8.2 Màn hình

<img src="media/rId410.png" style="width:6.25in;height:3.51562in" alt="TTMS rà soát BM-05 tại bước 42" />

<img src="media/rId413.png" style="width:6.25in;height:3.51562in" alt="Ký BM-05 tại bước 46" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm và luật nút của bước (mục 2.4), không dựng riêng: bước 42 eForm dtms-ms01-t42-ra-soat-bm05, bước 43 dtms-ms01-t43-du-dieu-kien, bước 46, 47 cùng eForm dtms-ms01-t46-47-ky-bm05. Trường theo mục 7.4; khác ảnh: bước 42 đủ mục BM-05 như bảng Mục BM-05 dưới đây, phần I không có Quyết định; bước 43 có danh sách điều kiện với kết quả Đạt / Chưa đạt và BM-05 chỉ đọc, có thêm nút Trả lại; bước 46 chỉ giao CQCM về tài chính kế toán và CQCM có liên quan.

##### 3.1.8.8.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 41 | Tác vụ AI soạn dự thảo BM-05 theo mục, mỗi mục kèm nguồn, ghi biến bm05 (bảng Mục BM-05 dưới đây); phần I lấy từ hồ sơ, không qua AI. Lỗi theo BR-DXMS-08-06 |
| 42 | Chuyên viên TTMS rà soát từng mục, chốt dự thảo BM-05; hoặc trả đơn vị |
| 43 | Lãnh đạo TTMS xác nhận hồ sơ đủ điều kiện giao ký và ký BM-05 với tư cách CQCM về đầu tư – xây dựng; hoặc trả lại |
| 44 | Điểm chờ kết quả ký BM-05 của người xử lý bước 43 (BR-DXMS-08-04, BR-DXMS-08-05). Đã ký: sang bước 45. Từ chối: về bước 25 (BR-DXMS-C-20) |
| 45 | Chỉ tới được khi BM-05 của TTMS Đã ký (BR-DXMS-C-18). Tạo bước 46 cho CQCM về tài chính kế toán và từng CQCM có liên quan (các CQCM khác trong danh sách đã xác nhận, trừ TTMS), bước 47 cho Phó TGĐ/Phó GĐ; gửi thông báo giao việc |
| 46, 47 | Chỉ huy từng CQCM được giao (bước 46) và Phó TGĐ/Phó GĐ (bước 47) ký BM-05 hoặc không đồng ý; tổng hợp theo BR-DXMS-08-07: mọi nhánh Đã ký thì sang bước 48; có Không đồng ý, kể cả VOffice Từ chối, thì về bước 25 |

**Mục BM-05 do bước 41 soạn:**

| Phần BM-05 | Mục | Nguồn |
|----|----|----|
| I. Tóm tắt nội dung ĐXMS | Mục tiêu; Phạm vi, quy mô; Giá trị; Nguồn vốn; Thời gian thực hiện | Tờ trình phiên bản hiện tại, hồ sơ |
| II\. Kết quả thẩm định | 1\. Sự tuân thủ quy định; 2. Lý do, sự cần thiết; 3. Tính phù hợp: Mục tiêu, Phạm vi số lượng gồm hiện trạng tồn kho, Giá trị, Nguồn vốn, Biện pháp và kế hoạch, Hiệu quả | AI soạn từ Tờ trình, BM-04, BM-02, kết quả rà soát tồn kho, báo giá |
| III\. Kết luận | Câu đề nghị Người có thẩm quyền phê duyệt | Mẫu |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 42 | Activity_42 | Nhóm chuyên viên TTMS; người nhận việc đầu tiên của nhóm trong hồ sơ được giao thẳng (BR-DXMS-08-01) | dtms-ms01-t42-ra-soat-bm05 | MS01_T42_XAC_NHAN (Hoàn tất rà soát BM-05); MS01_T42_TRA_LAI (Hồ sơ chưa đạt — trả đơn vị) | Hoàn tất: XAC_NHAN; HX-04 (bm05), HX-01, HX-02 mặc định (BM-05), HX-09 (KT-04 → dieuKienKyBm05). Trả: TRA_LAI, Lý do bắt buộc | Mục 2.4.3, dòng bước 42 | Hoàn tất: bước 43. Trả: bước 25 |
| 43 | Activity_43 | Nhóm lãnh đạo TTMS, ký với tư cách CQCM về đầu tư – xây dựng (BR-DXMS-08-01) | dtms-ms01-t43-du-dieu-kien | MS01_T43_TRINH_KY (Xác nhận đủ điều kiện & ký BM-05 (TTMS)); MS01_T43_TRA_LAI (Trả lại) | Ký: TRINH_KY; KT-04; HX-02, HX-03 mặc định, văn bản BM-05. Trả lại: TRA_LAI, Lý do bắt buộc | — | Ký: bước 44. Trả lại: bước 25 |
| 46 | Activity_46 | Nhóm Chỉ huy của từng CQCM được giao ở bước 45 (BR-DXMS-08-01) | dtms-ms01-t46-47-ky-bm05 | MS01_T46_TRINH_KY (Ký BM-05); MS01_T46_TU_CHOI (Không đồng ý) | Ký: TRINH_KY; HX-02, HX-03 mặc định, văn bản BM-05. Không đồng ý: TU_CHOI, Lý do bắt buộc | — | Nhánh CQCM, tới cổng hợp sau bước 46, 47 |
| 47 | Activity_47 | Phó TGĐ/Phó GĐ phụ trách lĩnh vực của hồ sơ (BR-DXMS-08-01) | dtms-ms01-t46-47-ky-bm05 | MS01_T47_TRINH_KY (Đồng ý, ký BM-05); MS01_T47_TU_CHOI (Không đồng ý) | Như bước 46 | — | Nhánh Phó TGĐ/Phó GĐ, tới cổng hợp sau bước 46, 47 |

**Dữ liệu chỉ xem của eForm** (mục 2.4.3): bm05 ở bước 42 khởi tạo từ biến do tác vụ AI bước 41 ghi; bước 43 đọc bm05 đã chốt ở bước 42. dieuKienKyBm05 do HX-09 của luật MS01_T42_XAC_NHAN ghi: hai dòng điều kiện của KT-04 với kết quả Đạt / Chưa đạt lúc hoàn thành bước 42; khối này chỉ để người dùng xem, KT-04 kiểm tra lại khi bấm nút ký. kyBm05 do nền tảng trình ký ghi khi gửi trình ký và khi nhận kết quả ký (YC-NT-03): Người ký, Đơn vị / tư cách, Trạng thái (Đã ký, Chưa ký, Không đồng ý), Trình ký lúc, Ký lúc, Thời gian xử lý (NLV), KPI ký, Lý do từ chối. aiKpiKy tính từ kyBm05 và hạn ký của từng người: số người trong định mức, số người quá hạn. phienBan là phiên bản hiện tại của hồ sơ.

**Bước 41, 44, 45 và ký song song 46+47** \[CẤU HÌNH\] trên BPMN, không lập trình:

- Bước 41 là tác vụ hệ thống chạy tác vụ AI soạn BM-05 (phần riêng bên dưới).

- Bước 44 là điểm chờ kết quả ký BM-05 do HX-03 của luật MS01_T43_TRINH_KY gửi; cổng sau bước 44 rẽ theo kết quả ký: Đã ký sang bước 45, Từ chối về bước 25.

- Bước 45 là cổng song song mở hai nhánh. Nhánh CQCM: bước 46 chạy đa thể hiện theo danh sách CQCM đã xác nhận của lần mới nhất trừ TTMS, mỗi thể hiện giao nhóm Chỉ huy của CQCM đó. Nhánh Phó TGĐ/Phó GĐ: bước 47. Thông báo giao việc theo cấu hình thông báo của công việc. Mỗi thể hiện, mỗi nhánh gồm công việc ký và điểm chờ kết quả ký của văn bản (YC-NT-03).

- Kết quả theo BR-DXMS-08-07: thể hiện, nhánh là Đồng ý khi BM-05 của người ký đó Đã ký; Không đồng ý khi người ký bấm nút của luật TU_CHOI của bước hoặc VOffice trả Từ chối, lý do lấy từ VOffice. Nhánh CQCM là Đồng ý khi mọi CQCM Đã ký.

- Không kết thúc sớm: một thể hiện hoặc một nhánh Không đồng ý thì công việc của thể hiện, nhánh khác giữ nguyên, người đó vẫn xử lý được; đa thể hiện bước 46 hoàn tất khi mọi thể hiện có kết quả (khác bước 35, DTMS_CN_0166). Cổng hợp song song sau bước 46, 47 chờ đủ hai nhánh (BR-DXMS-C-19), tiếp theo là cổng rẽ nhánh: mọi nhánh Đồng ý thì sang bước 48; có Không đồng ý thì về bước 25, đi lại vòng hoàn chỉnh và ký trên phiên bản mới (BR-DXMS-C-20).

**Xử lý trình ký** \[NỀN TẢNG\] (YC-NT-03, BR-DXMS-08-04): yêu cầu trình ký của bước 44, 46, 47 ở Lỗi gửi hoặc Đã hủy thì người xử lý bước liền trước nhận công việc Xử lý trình ký với \[Gửi lại\], \[Coi như Từ chối\]. \[Gửi lại\]: Lỗi gửi thì gửi lại cùng khóa chống trùng, Đã hủy thì tạo yêu cầu mới; mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09). \[Coi như Từ chối\]: Lý do bắt buộc, đi nhánh Từ chối của văn bản đó (mục 7.2).

**Phần riêng** \[RIÊNG\]:

- Tác vụ AI soạn BM-05 (bước 41) đăng ký là tác vụ hệ thống trên BPMN. Đầu ra: biến bm05, mỗi dòng một mục của bảng Mục BM-05 với Phần, Mục, Gợi ý, Nguồn; dòng phần I lấy từ hồ sơ phiên bản hiện tại. AI lỗi hoặc quá thời gian chờ (BR-DXMS-08-06): vẫn ghi đủ dòng, phần I có nội dung, các mục khác Gợi ý rỗng; eForm bước 42 hiện "Chưa có kết quả gợi ý AI.", TTMS nhập bằng Sửa.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T42_XAC_NHAN (Hoàn tất rà soát BM-05) | eForm: mục chọn Sửa có Nội dung sửa | HX-04 lưu gợi ý AI, quyết định và giá trị chốt từng mục (BR-DXMS-C-08); HX-01 ghi bm05 vào bm05_item của phiên bản hiện tại; HX-02 sinh BM-05 từ mẫu và quyết định từng mục (BR-DXMS-08-03); HX-09 ghi kết quả từng điều kiện của KT-04 vào dieuKienKyBm05. Hoàn thành công việc, giao bước 43 cho nhóm lãnh đạo TTMS |
| MS01_T42_TRA_LAI (Hồ sơ chưa đạt — trả đơn vị) | Lý do bắt buộc, hộp thoại Lý do của nền tảng | Về bước 25; bước 25 sinh dòng ý kiến từ lý do, nguồn TTMS — bước 42 (BR-DXMS-07-05) |
| MS01_T43_TRINH_KY (Xác nhận đủ điều kiện & ký BM-05 (TTMS)) | KT-04: BM-05 đã được rà soát trên phiên bản hiện tại và mọi CQCM có BM-04, Checklist Đã ký trên phiên bản hiện tại. Không đạt thì chặn: "Hồ sơ chưa đủ điều kiện giao ký BM-05.", công việc giữ nguyên | Hộp thoại Trình ký cho chính người xử lý, tư cách CQCM về đầu tư – xây dựng (BR-DXMS-08-05): HX-02 dùng BM-05 đã sinh ở bước 42 của phiên bản hiện tại, không sinh bản mới; HX-03 gửi trình ký. Hoàn thành công việc, sang bước 44 |
| MS01_T43_TRA_LAI (Trả lại) | Lý do bắt buộc, hộp thoại Lý do của nền tảng | Về bước 25; bước 25 sinh dòng ý kiến từ lý do (BR-DXMS-C-20, BR-DXMS-07-05) |
| MS01_T46_TRINH_KY (Ký BM-05), MS01_T47_TRINH_KY (Đồng ý, ký BM-05) | Người dùng thuộc vai trò nhận việc của bước theo BR-DXMS-08-01 (luật lọc theo vai trò) | Hộp thoại Trình ký cho chính người xử lý: HX-02 dùng BM-05 đã có chữ ký TTMS của phiên bản hiện tại, không sinh bản mới; HX-03 gửi trình ký. Hoàn thành công việc; thể hiện, nhánh chờ kết quả ký, tổng hợp như đoạn trên |
| MS01_T46_TU_CHOI, MS01_T47_TU_CHOI (Không đồng ý) | Lý do bắt buộc, hộp thoại Lý do của nền tảng | Thể hiện, nhánh là Không đồng ý (outcome agreed=false); công việc khác giữ nguyên. Đủ mọi nhánh thì về bước 25, bước 25 sinh dòng ý kiến từ lý do (BR-DXMS-C-20, BR-DXMS-07-05) |

##### 3.1.8.8.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                         |
|------|-------------------------------|
| 1    | Bước 41 soạn BM-05.           |
| 2    | TT rà soát, hoàn tất.         |
| 3    | TT xác nhận đủ điều kiện, ký. |
| 4    | TTMS Đã ký, bước 45 giao ký.  |
| 5    | CQCM, Phó TGĐ ký.             |
| 6    | Đủ thì sang bước 48.          |

**Luồng thay thế:** TT trả đơn vị ở bước 42; bên ký bước 46, 47 Không đồng ý: về bước 25, đi lại vòng hoàn chỉnh và ký trên phiên bản mới (BR-DXMS-C-20).

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Mục chọn Sửa, bỏ trống nội dung | Inline tại dòng: "Vui lòng nhập Nội dung sửa." |
| Bấm nút của luật MS01_T43_TRINH_KY khi có điều kiện Chưa đạt | KT-04: "Hồ sơ chưa đủ điều kiện giao ký BM-05." Không tạo yêu cầu trình ký, công việc giữ nguyên. Nút của luật MS01_T43_TRA_LAI (Trả lại) vẫn dùng được: hộp thoại Lý do, về bước 25 (BR-DXMS-C-20) |
| AI soạn BM-05 lỗi | Bảng hiện phần I, các mục khác rỗng, "Chưa có kết quả gợi ý AI."; TT nhập bằng Sửa |

**Đồng thời:** bước 46, 47 song song; các CQCM ở bước 46 song song với nhau.

##### 3.1.8.8.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0168-01 | Hồ sơ 200 tỷ qua bước 37 | Bước 41 chạy | TT có bước 42, bảng mục có gợi ý và nguồn |
| AC-0168-02 | TT sửa mục "Giá trị" | Hoàn tất | BM-05 có nội dung sửa; lưu cả gợi ý AI |
| AC-0168-03 | TT bấm nút của luật MS01_T42_TRA_LAI (Hồ sơ chưa đạt — trả đơn vị), nhập lý do | Xác nhận | Về bước 25, có dòng ý kiến nguồn TTMS — bước 42 |
| AC-0168-04 | TTMS chưa Đã ký BM-05 | Kiểm tra Việc của tôi | CQCM, Phó TGĐ chưa có công việc ký |
| AC-0168-05 | Danh sách đã xác nhận: TTMS, Ban Tài chính, Ban Pháp chế, Phòng Chất lượng; TTMS Đã ký | Bước 45 chạy | Chỉ huy Ban Tài chính, Ban Pháp chế, Phòng Chất lượng có bước 46; Phó TGĐ có bước 47; TTMS không có bước 46 |
| AC-0168-06 | Mọi bên Đã ký | Tổng hợp | Sang bước 48 |
| AC-0168-07 | Phó TGĐ Không đồng ý, CQCM chưa ký xong | Kiểm tra | Hồ sơ chờ; khi các CQCM xử lý xong thì về bước 25 |
| AC-0168-08 | Sau khi về bước 25, ĐV hoàn chỉnh lên phiên bản mới | Xem BM-05 cũ | OBSOLETE |
| AC-0168-09 | Hồ sơ MS01.03 | Kiểm tra | Không có bước 41–47 |
| AC-0168-10 | VOffice từ chối BM-05 của TTMS ở bước 44 | Nhận kết quả | Về bước 25, CQCM, Phó TGĐ không có công việc ký |
| AC-0168-11 | Bước 43, điều kiện BM-04 của Ban Tài chính Chưa đạt | TTMS bấm nút của luật MS01_T43_TRA_LAI (Trả lại), nhập lý do | Hồ sơ về bước 25, lý do thành dòng ý kiến |
| AC-0168-12 | Luật MS01_T43_TRINH_KY kích hoạt; Checklist của Ban Pháp chế chưa Đã ký trên phiên bản hiện tại | Lãnh đạo TTMS mở bước 43, bấm nút của luật, Xác nhận | Nút hiện như mọi lúc; bị chặn bởi KT-04: "Hồ sơ chưa đủ điều kiện giao ký BM-05."; không tạo yêu cầu trình ký; công việc giữ nguyên |
| AC-0168-13 | Bước 42 hoàn tất, mọi CQCM Đã ký BM-04 và Checklist trên phiên bản hiện tại | Lãnh đạo TTMS mở bước 43 | eForm hiện hai điều kiện, cả hai Đạt; có nút của luật MS01_T43_TRINH_KY và MS01_T43_TRA_LAI; bấm nút ký, Xác nhận thì mở hộp thoại Trình ký BM-05 cho chính người xử lý, sang bước 44 |
| AC-0168-14 | Bước 46 có Ban Tài chính, Ban Pháp chế; Ban Tài chính bấm nút của luật MS01_T46_TU_CHOI | Kiểm tra Việc của tôi | Công việc bước 46 của Ban Pháp chế và bước 47 vẫn còn; hồ sơ chưa về bước 25 tới khi mọi nhánh có kết quả |

#### 3.1.8.9 DTMS_CN_0169 Xử lý bước: Báo cáo Tập đoàn BM-06, BM-07

##### 3.1.8.9.1 Thông tin chung chức năng

- **Mục đích:** Xác định có báo cáo Tổng Giám đốc Tập đoàn; có thì lập, ký BM-06, Ban ĐTXD lập BM-07, Tổng Giám đốc Tập đoàn cho ý kiến.

- **Người dùng mục tiêu:** Thao tác: TT tại bước 48, 50; TV tại bước 51; TĐ tại bước 53–56 (BR-DXMS-08-09). Bước 49, 52: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 48 \> nút của luật MS01_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn) hoặc MS01_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn); bước 50 \> nút của luật MS01_T50_HOAN_THANH (Hoàn thành); bước 51 \> nút của luật MS01_T51_TRINH_KY (Đồng ý trình ký BM-06) hoặc MS01_T51_TU_CHOI (Không đồng ý); bước 53 \> nút của luật MS01_T53_XAC_NHAN (Chấp nhận hồ sơ, lập BM-07) hoặc MS01_T53_TRA_LAI (Trả lại); bước 54, 55 \> nút của luật MS01_T54_HOAN_THANH, MS01_T55_HOAN_THANH (Hoàn thành); bước 56 \> nút của luật MS01_T56_XAC_NHAN (TGĐ Tập đoàn đồng ý) hoặc MS01_T56_TRA_LAI (Trả lại).

- **Tiền điều kiện:**

  - BM-05 Đã ký đủ.

- **Hậu điều kiện:**

  - Sang bước 57.

  - Hoặc về bước 25.

##### 3.1.8.9.2 Màn hình

<img src="media/rId422.png" style="width:6.25in;height:3.51562in" alt="TTMS xác định báo cáo Tập đoàn tại bước 48" />

<img src="media/rId425.png" style="width:6.25in;height:3.51562in" alt="Thủ trưởng VHT xác nhận trình ký BM-06 tại bước 51" />

<img src="media/rId428.png" style="width:6.25in;height:3.51562in" alt="Ban ĐTXD xem xét tại bước 53" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm và luật nút của bước (mục 2.4), không dựng riêng. Trường theo mục 7.4; khác ảnh: bước 48 có bảng căn cứ, khối gợi ý Có / Không kèm lý do và ô Lý do, hai nút của bước hiển thị như nhau; bước 50 có bảng mục BM-06 và Đầu mối phối hợp; bước 51 có Tệp đính kèm, Lý do không đồng ý; bước 53, 56 có ô tải văn bản nhận được; bước 54 có BM-07 đã ký, Số văn bản, Ngày ký; bước 56 có Ý kiến của Tổng Giám đốc Tập đoàn.

##### 3.1.8.9.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 48 | TTMS xác định có báo cáo Tổng Giám đốc Tập đoàn hay không, theo BR-DXMS-08-08 |
| 49 | Tác vụ AI soạn dự thảo BM-06 theo mục, ghi biến bm06: phần I mục 2 (lý do, sự cần thiết), mục 3 (tóm tắt danh mục) do AI soạn, kèm nguồn; mục 1, 4, 5, 6 lấy từ hồ sơ; phần II theo mẫu. Lỗi theo BR-DXMS-08-06 |
| 50 | TTMS rà soát bảng mục BM-06, chọn Đầu mối phối hợp |
| 51 | Thủ trưởng VHT xem BM-06, BM-05, hồ sơ kèm, tải tệp đính kèm; đồng ý trình ký BM-06 hoặc không đồng ý |
| 52 | Bước chờ kết quả ký BM-06; Đã ký thì gửi BM-06 kèm hồ sơ tới Ban ĐTXD Tập đoàn qua VOffice, giao bước 53 (BR-DXMS-08-09) |
| 53 | Ban ĐTXD Tập đoàn xem xét hồ sơ: chấp nhận, lập BM-07; hoặc trả lại |
| 54 | Ban ĐTXD Tập đoàn ghi BM-07 đã ký ngoài hệ thống và gửi Tổng Giám đốc Tập đoàn |
| 55 | Ban ĐTXD Tập đoàn xác nhận thông báo kèm BM-07 cho TTMS và Đầu mối của đơn vị đề xuất |
| 56 | Tổng Giám đốc Tập đoàn cho ý kiến: đồng ý hoặc trả lại |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 48 | Activity_48 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms01-t48-bao-cao-td | MS01_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn); MS01_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn) | XAC_NHAN; biến đặt reportTD = true và luồng con MS01.01 / reportTD = false và luồng con MS01.02; KT-05 (reportSuggested, giá trị của nút, reportReason); HX-01 | Mục 2.4.3, dòng bước 48 | Có: bước 49. Không: bước 57 |
| 50 | Activity_50 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms01-t50-51-bm06, phần RA_SOAT | MS01_T50_HOAN_THANH (Hoàn thành) | HOAN_THANH; HX-02 mặc định sinh BM-06; HX-04 (bm06) | — | Bước 51 |
| 51 | Activity_51 | Thủ trưởng VHT (BR-DXMS-08-01) | dtms-ms01-t50-51-bm06, phần XAC_NHAN | MS01_T51_TRINH_KY (Đồng ý trình ký BM-06); MS01_T51_TU_CHOI (Không đồng ý) | Đồng ý: TRINH_KY; HX-02, HX-03 mặc định, văn bản BM-06; HX-01. Không đồng ý: TU_CHOI, không đặt Lý do bắt buộc, mở eForm của bước, biến bắt buộc lyDoTraLai; HX-01 | Mục 2.4.3, dòng bước 51 | Đồng ý: bước 52. Không đồng ý: bước 25 |
| 53 | Activity_53 | Nhóm Ban ĐTXD Tập đoàn và người xử lý bước 48, giao đồng thời (BR-DXMS-08-09, YC-NT-05) | dtms-ms01-t53-56-tap-doan, phần XEM_XET | MS01_T53_XAC_NHAN (Chấp nhận hồ sơ, lập BM-07); MS01_T53_TRA_LAI (Trả lại) | Chấp nhận: XAC_NHAN; KT-09 (vanBanNhanDuoc); HX-10 (vanBanNhanDuoc, Ban ĐTXD Tập đoàn). Trả lại: TRA_LAI, không đặt Lý do bắt buộc, mở eForm của bước, biến bắt buộc lyDoTraLai; KT-09, HX-10 như Chấp nhận | — | Chấp nhận: bước 54. Trả lại: bước 25 |
| 54 | Activity_54 | Như bước 53 | dtms-ms01-t53-56-tap-doan, phần BM07 | MS01_T54_HOAN_THANH (Hoàn thành) | HOAN_THANH; HX-01; HX-10 (bm07Tep, Ban ĐTXD Tập đoàn) | Mục 2.4.3, dòng bước 54 | Bước 55 |
| 55 | Activity_55 | Như bước 53 | dtms-ms01-t53-56-tap-doan, phần THONG_BAO | MS01_T55_HOAN_THANH (Hoàn thành) | HOAN_THANH; HX-11 (người nhận dauMoiBm06, dauMoi; văn bản bm07Tep) | — | Bước 56 |
| 56 | Activity_56 | Nhóm Tổng Giám đốc Tập đoàn và người xử lý bước 48, giao đồng thời (BR-DXMS-08-09, YC-NT-05) | dtms-ms01-t53-56-tap-doan, phần Y_KIEN | MS01_T56_XAC_NHAN (TGĐ Tập đoàn đồng ý); MS01_T56_TRA_LAI (Trả lại) | Đồng ý: XAC_NHAN; KT-09 (yKienTdTep); HX-01; HX-10 (yKienTdTep, Tổng Giám đốc Tập đoàn). Trả lại: TRA_LAI, không đặt Lý do bắt buộc, mở eForm của bước, biến bắt buộc lyDoTraLai; KT-09, HX-01, HX-10 như Đồng ý | Mục 2.4.3, dòng bước 56 | Đồng ý: bước 57. Trả lại: bước 25 |

**Phần eForm theo bước** \[CẤU HÌNH\]: eForm dtms-ms01-t50-51-bm06 dùng cho bước 50, 51; dtms-ms01-t53-56-tap-doan dùng cho bước 53–56. Mỗi bước khai trên BPMN một biến cục bộ của task (phanBm06, phanTapDoan) với giá trị ghi ở cột eForm; dòng của eForm ẩn, hiện theo biến này (cột Điều kiện ẩn, mục 7.4). Trường bắt buộc nằm trong dòng bị ẩn thì không kiểm tra. Không xử lý nào đọc task key.

**Bước 49, 52** là tác vụ hệ thống và bước chờ trên BPMN, không có màn. Bước 49: tác vụ AI ghi biến bm06; AI lỗi hoặc quá 5 phút thì bm06 rỗng, eForm bước 50 hiện "Chưa có kết quả gợi ý AI.", BM-06 sinh bản trống từ mẫu, đã điền trường lấy từ hồ sơ (BR-DXMS-08-06). Bước 52: chờ kết quả ký BM-06 theo BR-DXMS-08-04; người ký là Thủ trưởng VHT, không ký cấp phó (BR-DXMS-08-05). Đã ký thì tác vụ hệ thống gửi BM-06 kèm hồ sơ tới Ban ĐTXD Tập đoàn qua VOffice rồi giao bước 53; gửi lỗi như Lỗi gửi ở BR-DXMS-08-04. VOffice trả Từ chối thì về bước 25, lý do lấy từ VOffice. Công việc Xử lý trình ký khi Lỗi gửi, Đã hủy theo YC-NT-03, giao người xử lý bước 51: \[Gửi lại\] khi Lỗi gửi thì gửi lại cùng khóa chống trùng, khi Đã hủy thì tạo yêu cầu mới, mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09); \[Coi như Từ chối\] bắt buộc Lý do, đi nhánh Từ chối của văn bản (mục 7.2).

**Bước 53–56 giao đồng thời** \[CẤU HÌNH\] theo YC-NT-05: mỗi bước một công việc giao nhóm Tập đoàn của bước và người xử lý bước 48 của hồ sơ; ai xử lý trước thì công việc hoàn thành cho cả hai bên. Nhóm Tập đoàn chưa có người dùng thì công việc chỉ đến người TTMS. Người thực hiện là người được giao đích danh (người xử lý bước 48) thì là ghi nhận thay: KT-09 bắt buộc văn bản nhận được ở bước 53, 56 (bước 54: BM-07 đã ký, bắt buộc trong eForm); HX-10 ghi văn bản và nhật ký người ghi nhận, bên ra kết quả (BR-DXMS-08-09).

**Phần riêng** \[RIÊNG\]:

- **Gợi ý báo cáo Tổng Giám đốc Tập đoàn** (BR-DXMS-C-07): tác vụ hệ thống trên BPMN, chạy trước bước 48, xét giá trị của hồ sơ so với ngưỡng hồ sơ giữ và thuộc tính Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt của các văn bản căn cứ (Kế hoạch SXKD hằng năm không tính). Ghi biến reportSuggested (true / false), reportSuggestReason (lý do gợi ý theo căn cứ), canCuTd (danh sách căn cứ: Văn bản, Loại, Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt). Cùng logic dùng khi lưu luồng dự kiến lúc hồ sơ đi bước 12 (BR-DXMS-C-05). Đăng ký là tác vụ hệ thống, không gắn mã bước.

- **Tác vụ AI soạn BM-06** (bước 49): tác vụ hệ thống trên BPMN theo BR-DXMS-C-08, BR-DXMS-08-06; mỗi dòng của bm06 gồm Mục, Gợi ý, Nguồn, cờ lấy từ hồ sơ.

- **Gửi BM-06 tới Ban ĐTXD Tập đoàn qua VOffice** (bước 52): tích hợp VOffice, đăng ký là tác vụ hệ thống trên BPMN.

Bảng mục BM-06 ở bước 50 là bảng lặp của eForm, không cần kiểu trường tùy biến: mỗi mục do AI soạn có Quyết định Chấp nhận / Sửa / Bỏ; trường tính noiDungChot của dòng là nội dung đưa vào mẫu BM-06 (Chấp nhận: Gợi ý; Sửa: Nội dung sửa; Bỏ: rỗng).

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn) | KT-05: gợi ý là Không (reportSuggested = false) thì Lý do có giá trị, tối đa 2000 ký tự | Biến đặt reportTD = true, luồng con MS01.01. HX-01 ghi lựa chọn, gợi ý và Lý do vào hồ sơ (BR-DXMS-08-08). Hoàn thành công việc; bước 49 soạn dự thảo BM-06, giao bước 50 |
| MS01_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn) | KT-05: gợi ý là Có (reportSuggested = true) thì Lý do có giá trị | Biến đặt reportTD = false, luồng con MS01.02. HX-01 như trên. Hoàn thành công việc, sang bước 57 |
| MS01_T50_HOAN_THANH (Hoàn thành) | eForm: Đầu mối phối hợp có giá trị; mục chọn Sửa có Nội dung sửa | HX-04 lưu quyết định từng mục, gợi ý AI và nội dung chốt vào bảng mục BM-06 theo phiên bản (BR-DXMS-C-08); HX-02 sinh BM-06 (BR-DXMS-08-03); giao bước 51 cho Thủ trưởng VHT |
| MS01_T51_TRINH_KY (Đồng ý trình ký BM-06) | eForm: Tệp đính kèm có giá trị | HX-01 ghi tệp đính kèm của bước. Hộp thoại Trình ký cho chính Thủ trưởng VHT, không ký cấp phó (BR-DXMS-08-05); HX-03 trình ký BM-06; sang bước 52 |
| MS01_T51_TU_CHOI (Không đồng ý) | eForm: Tệp đính kèm có giá trị. Biến bắt buộc lyDoTraLai | HX-01 ghi tệp đính kèm. Về bước 25; lý do thành dòng ý kiến nguồn "Thủ trưởng VHT — bước 51" (BR-DXMS-07-05) |
| MS01_T53_XAC_NHAN (Chấp nhận hồ sơ, lập BM-07) | KT-09: người thực hiện ghi nhận thay thì Văn bản nhận được có giá trị | HX-10 ghi văn bản nhận được; ghi nhận thay thì nhật ký ghi người ghi nhận và bên ra kết quả là Ban ĐTXD Tập đoàn. Công việc hoàn thành cho cả hai bên; sang bước 54 |
| MS01_T53_TRA_LAI (Trả lại) | Biến bắt buộc lyDoTraLai. KT-09 như trên | HX-10 như trên. Về bước 25; lý do thành dòng ý kiến nguồn "Ban ĐTXD — bước 53" |
| MS01_T54_HOAN_THANH (Hoàn thành) | eForm: BM-07 đã ký, Số văn bản, Ngày ký có giá trị | HX-01 ghi BM-07 (tệp, Số văn bản, Ngày ký) vào báo cáo Tập đoàn của hồ sơ; BM-07 do Trưởng ban Ban ĐTXD Tập đoàn ký ngoài hệ thống. HX-10 ghi văn bản, nhật ký ghi nhận thay khi người TTMS xử lý; nhật ký ghi gửi BM-07 tới Tổng Giám đốc Tập đoàn. Sang bước 55 |
| MS01_T55_HOAN_THANH (Hoàn thành) | — | HX-11 gửi thông báo kèm BM-07 cho TTMS (Đầu mối phối hợp của bước 50) và Đầu mối tiếp nhận của đơn vị đề xuất. Sang bước 56 |
| MS01_T56_XAC_NHAN (TGĐ Tập đoàn đồng ý) | KT-09: người thực hiện ghi nhận thay thì Phiếu ý kiến hoặc văn bản nhận được có giá trị | HX-01 ghi ý kiến, tệp, thời điểm ghi nhận vào báo cáo Tập đoàn của hồ sơ. HX-10: ghi nhận thay thì nhật ký ghi người ghi nhận, bên ra kết quả là Tổng Giám đốc Tập đoàn. Sang bước 57 |
| MS01_T56_TRA_LAI (Trả lại) | Biến bắt buộc lyDoTraLai. KT-09 như trên | HX-01, HX-10 như trên. Về bước 25 với dòng ý kiến từ lý do |

##### 3.1.8.9.4 Luồng nghiệp vụ

**Luồng chính MS01.01:**

| Bước | Mô tả                                          |
|------|------------------------------------------------|
| 1    | TT chọn Có.                                    |
| 2    | AI soạn BM-06, TT rà soát.                     |
| 3    | TV đồng ý, ký.                                 |
| 4    | Gửi Ban ĐTXD.                                  |
| 5    | Ban ĐTXD chấp nhận, lập, gửi BM-07, thông báo. |
| 6    | Tổng Giám đốc Tập đoàn đồng ý.                 |
| 7    | Sang bước 57.                                  |

**Luồng MS01.02:** 48 → 57.

**Luồng thay thế:** bước 51, 53, 56 không đồng ý, trả lại thì về bước 25 với dòng ý kiến từ lý do.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bước 48 bấm nút khác gợi ý, bỏ trống Lý do | KT-05, inline: "Vui lòng nhập Lý do." Công việc giữ nguyên |
| Bước 51 chưa tải tệp | eForm, inline: "Vui lòng tải lên tệp đính kèm." Áp cho cả hai nút của bước |
| Bước 54 thiếu BM-07, Số văn bản hoặc Ngày ký | eForm, inline: "Vui lòng tải lên BM-07."; Số văn bản, Ngày ký theo ngoại lệ chung |
| Gửi BM-06 tới Ban ĐTXD lỗi | Như Lỗi gửi ở BR-DXMS-08-04 |
| Bước 51, 53, 56 bấm nút không đồng ý, trả lại, bỏ trống Lý do | Biến bắt buộc lyDoTraLai, inline: "Vui lòng nhập Lý do." Công việc giữ nguyên |
| Bước 53, 56 người xử lý bước 48 ghi nhận thay, chưa tải văn bản | KT-09, inline: "Vui lòng tải Văn bản nhận được." Công việc giữ nguyên cho cả hai bên |
| AI soạn BM-06 lỗi hoặc quá 5 phút ở bước 49 | Bước 50 hiện "Chưa có kết quả gợi ý AI."; BM-06 sinh bản trống từ mẫu (BR-DXMS-08-06) |

**Đồng thời:** mỗi bước mỗi lúc một người.

##### 3.1.8.9.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0169-01 | Hồ sơ 200 tỷ, căn cứ là Phương án kinh doanh chưa được Tập đoàn duyệt | Mở bước 48 | Khối gợi ý hiện Có kèm lý do theo căn cứ; nút của luật MS01_T48_XAC_NHAN và MS01_T48_XAC_NHAN_2 đều hiện, như nhau |
| AC-0169-02 | Hồ sơ 200 tỷ, mọi căn cứ đã được Tập đoàn duyệt, không có Kế hoạch SXKD; gợi ý Không | Bấm nút của luật MS01_T48_XAC_NHAN_2 | Sang bước 57, Luồng MS01.02; không cần Lý do |
| AC-0169-03 | Gợi ý Có | Bấm nút của luật MS01_T48_XAC_NHAN_2, bỏ trống Lý do | Bị chặn bởi KT-05: "Vui lòng nhập Lý do."; công việc giữ nguyên |
| AC-0169-04 | TT bấm nút của luật MS01_T48_XAC_NHAN | Bước 49 chạy | TT có bước 50, bảng mục BM-06 |
| AC-0169-05 | TV đồng ý, ký điện tử, Đã ký | Bước 52 | BM-06 gửi Ban ĐTXD; có công việc bước 53 |
| AC-0169-06 | Ban ĐTXD nhập Lý do | Bấm nút của luật MS01_T53_TRA_LAI | Về bước 25, dòng ý kiến nguồn Ban ĐTXD — bước 53 |
| AC-0169-07 | Bước 54 tải BM-07, nhập số, ngày | Bấm nút của luật MS01_T54_HOAN_THANH | Có công việc bước 55; hoàn thành bước 55 thì gửi thông báo kèm BM-07 cho TTMS và Đầu mối đơn vị |
| AC-0169-08 | Kết quả TGĐ Tập đoàn về bằng văn bản ngoài hệ thống | TT ghi nhận thay ở bước 56 | Nhật ký ghi TT ghi nhận, bên ra kết quả là TGĐ Tập đoàn |
| AC-0169-10 | Nhóm Ban ĐTXD chưa có người dùng | Bước 52 Đã ký | Công việc bước 53 chỉ đến người xử lý bước 48; người này bấm nút của luật MS01_T53_XAC_NHAN phải tải văn bản (KT-09) |
| AC-0169-15 | Luật MS01_T53_XAC_NHAN; người xử lý bước 48 xử lý bước 53, không tải văn bản | Bấm nút của luật | Bị chặn bởi KT-09: "Vui lòng tải Văn bản nhận được."; công việc giữ nguyên cho cả hai bên |
| AC-0169-11 | Người dùng Ban ĐTXD xử lý bước 53 trước | Bấm nút của luật MS01_T53_XAC_NHAN | Công việc của người TTMS cũng đóng |
| AC-0169-12 | TV nhập Lý do, có tệp | Bấm nút của luật MS01_T51_TU_CHOI | Về bước 25, dòng ý kiến nguồn Thủ trưởng VHT — bước 51 |
| AC-0169-13 | TGĐ Tập đoàn nhập Lý do | Bấm nút của luật MS01_T56_TRA_LAI | Về bước 25 |
| AC-0169-14 | VOffice từ chối BM-06 | Nhận kết quả | Về bước 25, lý do từ VOffice |
| AC-0169-09 | TGĐ Tập đoàn mở bước 56 | Bấm nút của luật MS01_T56_XAC_NHAN | Sang bước 57 |
| AC-0169-16 | Gợi ý Không, TT nhập Lý do | Bấm nút của luật MS01_T48_XAC_NHAN | Sang bước 49, Luồng MS01.01; hồ sơ lưu gợi ý Không, lựa chọn Có, Lý do |
| AC-0169-17 | Thủ trưởng VHT mở bước 51, chưa tải Tệp đính kèm | Bấm nút của luật MS01_T51_TU_CHOI hoặc MS01_T51_TRINH_KY | Không lưu, inline "Vui lòng tải lên tệp đính kèm." |
| AC-0169-18 | Người dùng Ban ĐTXD xử lý bước 53, không tải văn bản | Bấm nút của luật MS01_T53_XAC_NHAN | Không bị chặn: KT-09 chỉ áp khi ghi nhận thay; sang bước 54 |
| AC-0169-19 | Người xử lý bước 48 ghi nhận thay ở bước 56, tải phiếu ý kiến | Bấm nút của luật MS01_T56_XAC_NHAN | Văn bản ghi với cờ ghi nhận thay; nhật ký ghi người ghi nhận, bên ra kết quả là Tổng Giám đốc Tập đoàn |
| AC-0169-20 | Bước 50 và 51 dùng chung eForm dtms-ms01-t50-51-bm06 | Thủ trưởng VHT mở bước 51 | Không có bảng mục BM-06, Đầu mối phối hợp; có Tệp đính kèm, Lý do không đồng ý (biến bước phanBm06) |

#### 3.1.8.10 DTMS_CN_0170 Xử lý bước: Quyết định phê duyệt BM-08, ký duyệt

##### 3.1.8.10.1 Thông tin chung chức năng

- **Mục đích:** Sinh và rà soát Quyết định phê duyệt BM-08 (MS01.01, .02), trình Người có thẩm quyền phê duyệt và ký; MS01.03 ký duyệt trực tiếp trên BM-09.

- **Người dùng mục tiêu:** Thao tác: TT tại bước 58, 59; Người có thẩm quyền (cột TV, BR-DXMS-C-29) tại bước 60. Bước 57, 61: hệ thống.

- **Đường dẫn truy cập:** Việc của tôi \> công việc bước 58 \> nút của luật MS01_T58_HOAN_THANH (Hoàn thành); bước 59 \> nút của luật MS01_T59_GUI_DUYET (Trình phê duyệt); bước 60 \> nút của luật MS01_T60_PHE_DUYET (Phê duyệt), MS01_T60_TRA_LAI (Yêu cầu hoàn chỉnh) hoặc MS01_T60_TRA_LAI_2 (Chỉ đạo khác — kết thúc).

- **Tiền điều kiện:**

  - MS01.01, .02: hồ sơ qua bước 48 hoặc 56. MS01.03: qua bước 40.

- **Hậu điều kiện:**

  - Hồ sơ COMPLETED, ĐXMS APPROVED.

  - Hoặc STOPPED.

  - Hoặc về bước 25.

##### 3.1.8.10.2 Màn hình

<img src="media/rId437.png" style="width:6.25in;height:3.51562in" alt="TTMS rà soát dự thảo BM-08 tại bước 58" />

<img src="media/rId440.png" style="width:6.25in;height:3.51562in" alt="Người có thẩm quyền phê duyệt BM-08 tại bước 60" />

<img src="media/rId443.png" style="width:6.25in;height:3.51562in" alt="Người có thẩm quyền ký duyệt BM-09 tại bước 60" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm và luật nút của bước (mục 2.4), không dựng riêng. Trường theo mục 7.4; khác ảnh: bước 58 có ô Điều 2. Tổ chức thực hiện, Nơi nhận và bảng Checklist 01; bước 60 dùng một eForm cho mọi luồng con, có KPI toàn trình, khối văn bản phê duyệt theo luồng con, khối Ý kiến của Tổng Giám đốc Tập đoàn khi hồ sơ qua bước 56; tên nút của luật bước 60 như nhau ở mọi luồng con.

##### 3.1.8.10.3 Mô tả chi tiết các thành phần

**Các bước:**

| Bước | Xử lý |
|----|----|
| 57 | Tác vụ hệ thống sinh dự thảo BM-08 từ mẫu, ghi biến bm08DaSinh, bm08Dieu2Mau |
| 58 | TTMS rà soát dự thảo BM-08, nhập Điều 2. Tổ chức thực hiện, Nơi nhận |
| 59 | TTMS trình Quyết định phê duyệt cho Người có thẩm quyền |
| 60 | Người có thẩm quyền phê duyệt, yêu cầu hoàn chỉnh hoặc chỉ đạo khác. MS01.03 tới thẳng từ bước 40, ký trên BM-09 |
| 61 | Bước chờ kết quả ký văn bản phê duyệt, theo BR-DXMS-08-10 |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 58 | Activity_58 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms01-t58-60-bm08 | MS01_T58_HOAN_THANH (Hoàn thành) | HOAN_THANH; HX-02 mặc định sinh lại BM-08 | — | Bước 59 |
| 59 | Activity_59 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms01-t58-60-bm08 | MS01_T59_GUI_DUYET (Trình phê duyệt) | GUI_DUYET; HX-02 mặc định | — | Bước 60, giao Người có thẩm quyền theo BR-DXMS-C-29 |
| 60 | Activity_60 | Người có thẩm quyền (BR-DXMS-C-29) | dtms-ms01-t60-phe-duyet-bm09, dòng theo luồng con | MS01_T60_PHE_DUYET (Phê duyệt); MS01_T60_TRA_LAI (Yêu cầu hoàn chỉnh); MS01_T60_TRA_LAI_2 (Chỉ đạo khác — kết thúc) | Phê duyệt: PHE_DUYET; HX-02, HX-03 mặc định; văn bản theo luồng con (YC-NT-04): BM-08 cho MS01.01, .02, ô PHÊ DUYỆT trên BM-09 cho MS01.03. Yêu cầu hoàn chỉnh: TRA_LAI, Lý do bắt buộc. Chỉ đạo khác: TRA_LAI, Lý do bắt buộc, biến đặt chiDaoKhac = true, câu xác nhận của luật | — | Phê duyệt: bước 61. Yêu cầu hoàn chỉnh: bước 25. Chỉ đạo khác: kết thúc ở Dừng xử lý |

**Bước 57, 61** là tác vụ hệ thống và bước chờ trên BPMN, không có màn.

- Bước 57: sinh dự thảo BM-08 bằng năng lực sinh văn bản của HX-02, mẫu BM-08 gắn với bước. Trường trộn của mẫu: Căn cứ (Quy chế, Tờ trình số và ngày, BM-05 số và ngày); Điều 1 mục 1–5 (Mục đích, Phạm vi quy mô, Giá trị bằng số và chữ kèm cơ cấu chi phí, Nguồn vốn, Thời gian) lấy từ Tờ trình phiên bản hiện tại; Điều 2, Điều 3 theo mẫu. Ghi biến bm08DaSinh (sinh được hay không) và bm08Dieu2Mau (câu mẫu Điều 2 giao đơn vị đề xuất tổ chức mua sắm). Sinh lỗi thì bm08DaSinh = false, tiến trình vẫn sang bước 58; nút của luật MS01_T58_HOAN_THANH sinh lại.

- Bước 61: chờ kết quả ký văn bản phê duyệt theo BR-DXMS-08-04, BR-DXMS-08-10. Đã ký: hồ sơ COMPLETED, ĐXMS APPROVED, văn bản phê duyệt có Số văn bản, Ngày ký (DTMS_CN_0139), mọi công việc còn mở của hồ sơ bị hủy. Từ chối ký: như Yêu cầu hoàn chỉnh, về bước 25, KPI toàn trình chạy tiếp. Công việc Xử lý trình ký khi Lỗi gửi, Đã hủy theo YC-NT-03, giao người xử lý bước 60: \[Gửi lại\] khi Lỗi gửi thì gửi lại cùng khóa chống trùng, khi Đã hủy thì tạo yêu cầu mới, mỗi lần gửi là một dòng kết quả ký mới (BR-DXMS-06-09); \[Coi như Từ chối\] bắt buộc Lý do, đi nhánh Từ chối của văn bản (mục 7.2).

**Một eForm cho bước 60** \[CẤU HÌNH\]: dòng của eForm dtms-ms01-t60-phe-duyet-bm09 theo luồng con của hồ sơ (cột Luồng con, mục 7.4): MS01.01, .02 hiện văn bản BM-08 và hồ sơ kèm; MS01.03 hiện khối chữ ký thẩm định BM-09; MS01.01 hiện Ý kiến của Tổng Giám đốc Tập đoàn của bước 56 và gợi ý AI. Cổng sau bước 60 rẽ theo outcome của mã hành động và biến chiDaoKhac.

**Dữ liệu chỉ xem** của eForm bước 58, 60: checklist (Checklist 01 của phiên bản hiện tại, như bước 12); kpi, kpiGioiHan (KPI toàn trình tính theo mục 2.3.3, như Chi tiết hồ sơ DTMS_CN_0155; giới hạn theo tham số Giới hạn KPI toàn trình, mục 2.3.6, mặc định 20 hoặc 10 NLV); phienBan; kyBm09 (kết quả ký thẩm định bước 40); yKienTdNoiDung, yKienTdTep (bước 56); yKienTdAi.

**Phần riêng** \[RIÊNG\]:

- **Tác vụ AI đọc ý kiến của Tổng Giám đốc Tập đoàn**: tác vụ hệ thống trên BPMN, chạy sau bước 56 khi Tổng Giám đốc Tập đoàn đồng ý, trước bước 57; ghi biến yKienTdAi (tóm tắt, hướng dẫn hoàn thiện). Lỗi hoặc quá 5 phút thì tiến trình đi tiếp, khối hiện "Chưa có kết quả gợi ý AI." (BR-DXMS-08-06).

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS01_T58_HOAN_THANH (Hoàn thành) | eForm: Điều 2. Tổ chức thực hiện, Nơi nhận có giá trị | HX-02 sinh lại BM-08 với Điều 2, Nơi nhận (BR-DXMS-08-03); giao bước 59 |
| MS01_T59_GUI_DUYET (Trình phê duyệt) | — | Giao bước 60 cho Người có thẩm quyền theo BR-DXMS-C-29. Hồ sơ kèm BM-08: Checklist 01, BM-02, BM-04, BM-05; BM-06, BM-07 khi hồ sơ qua bước 49–56 |
| MS01_T60_PHE_DUYET (Phê duyệt) | — | KPI toàn trình dừng ở thời điểm hoàn thành công việc này (mục 2.3.3). Hộp thoại Trình ký cho chính người xử lý; HX-02 sinh BM-08 (MS01.01, .02), MS01.03 dùng BM-09 đã có hai chữ ký thẩm định; HX-03 trình ký văn bản theo luồng con. Sang bước 61 |
| MS01_T60_TRA_LAI (Yêu cầu hoàn chỉnh) | Lý do bắt buộc (hộp thoại Lý do) | Về bước 25 với dòng ý kiến từ lý do (BR-DXMS-07-05) |
| MS01_T60_TRA_LAI_2 (Chỉ đạo khác — kết thúc) | Lý do bắt buộc (hộp thoại Lý do). Câu xác nhận của luật: "Hồ sơ sẽ kết thúc ở Dừng xử lý và không xử lý tiếp được. Tiếp tục?"; chọn Hủy thì không thực thi, không đổi gì | Biến đặt chiDaoKhac = true; cổng BPMN đi tới kết thúc Kết thúc theo chỉ đạo khác; hồ sơ STOPPED theo BR-DXMS-C-22 |

Câu xác nhận trước khi thực thi là thuộc tính của luật, dùng chung cho mọi nút kết thúc hồ sơ; nền tảng chưa có thì ghi thành yêu cầu bổ sung nền tảng (mục 2.4.5).

##### 3.1.8.10.4 Luồng nghiệp vụ

**Luồng chính MS01.01, .02:** 57 → 58 → 59 → 60 Phê duyệt → 61 Đã ký → COMPLETED.

**Luồng MS01.03:** 40 → 60 Phê duyệt (ký ô PHÊ DUYỆT trên BM-09) → 61.

**Luồng thay thế:** Yêu cầu hoàn chỉnh, Từ chối ký thì về bước 25; Chỉ đạo khác thì STOPPED.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Sinh BM-08 lỗi ở bước 57 | eForm bước 58 hiện "Chưa sinh được dự thảo."; nút của luật MS01_T58_HOAN_THANH sinh lại (HX-02) |
| Bấm nút của luật MS01_T60_TRA_LAI_2, chọn Hủy ở hộp thoại xác nhận | Không thực thi, không đổi gì; công việc giữ nguyên |
| Tác vụ AI đọc ý kiến Tập đoàn lỗi hoặc quá 5 phút | Bước 60 hiện "Chưa có kết quả gợi ý AI."; vẫn phê duyệt được (BR-DXMS-08-06) |

**Đồng thời:** mỗi bước mỗi lúc một người. Hồ sơ COMPLETED thì mọi công việc còn mở của hồ sơ bị hủy.

##### 3.1.8.10.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0170-01 | MS01.02 chọn Không ở bước 48 | Bước 57 chạy | TT có bước 58; BM-08 có Giá trị bằng số và chữ của hồ sơ |
| AC-0170-02 | Bỏ trống Điều 2 | Bấm nút của luật MS01_T58_HOAN_THANH, \[Xác nhận\] | Inline "Vui lòng nhập Điều 2. Tổ chức thực hiện."; không hoàn thành |
| AC-0170-03 | MS01.02 | Mở bước 59 | Hồ sơ kèm không có BM-06, BM-07 |
| AC-0170-04 | TV bấm nút của luật MS01_T60_PHE_DUYET, ký điện tử, Đã ký | Bước 61 | Hồ sơ COMPLETED, ĐXMS APPROVED; tab Kết quả có Số, Ngày ký |
| AC-0170-05 | TV bấm nút của luật MS01_T60_PHE_DUYET, VOffice trả Từ chối | Nhận kết quả | Về bước 25 với dòng ý kiến từ lý do |
| AC-0170-06 | TV nhập Lý do | Bấm nút của luật MS01_T60_TRA_LAI | Về bước 25 |
| AC-0170-07 | TV nhập Lý do, đồng ý ở hộp thoại xác nhận | Bấm nút của luật MS01_T60_TRA_LAI_2 | Hồ sơ STOPPED, ĐXMS STOPPED, tạo được hồ sơ Phê duyệt mới |
| AC-0170-08 | MS01.03 qua bước 40, luật MS01_T60_PHE_DUYET kích hoạt | TV mở bước 60 | Văn bản là BM-09 có hai chữ ký thẩm định; KPI "/ 10 NLV"; nút của luật tên như ở MS01.01 (Phê duyệt); hộp thoại Trình ký là ô PHÊ DUYỆT trên BM-09 |
| AC-0170-09 | T0 01/10/2026, Phê duyệt 20/10/2026 | Xem KPI ở Chi tiết hồ sơ | KPI 13 NLV, dừng khi bấm Phê duyệt |
| AC-0170-10 | Hồ sơ Mật | TV bấm nút của luật MS01_T60_PHE_DUYET | Chỉ Ký bản giấy; nhập Số, Ngày, bản scan thì COMPLETED |
| AC-0170-11 | Hồ sơ MS01.02, luật MS01_T60_PHE_DUYET kích hoạt | TV mở bước 60 | eForm dtms-ms01-t60-phe-duyet-bm09 hiện khối BM-08; không có khối chữ ký BM-09, không có Ý kiến của Tổng Giám đốc Tập đoàn |
| AC-0170-12 | Hồ sơ MS01.01 qua bước 56 có ý kiến và tệp | TV mở bước 60 | Có khối Ý kiến của Tổng Giám đốc Tập đoàn và gợi ý AI |
| AC-0170-13 | Sinh BM-08 lỗi ở bước 57 | TT mở bước 58, bấm nút của luật MS01_T58_HOAN_THANH, \[Xác nhận\] | eForm hiện "Chưa sinh được dự thảo." trước khi bấm; sau khi bấm có BM-08 ở Văn bản đầu ra, giao bước 59 |

### 3.1.9 Điều chỉnh ĐXMS

Điều chỉnh một ĐXMS đã được phê duyệt bằng hồ sơ Điều chỉnh: tra cứu hồ sơ điều chỉnh, lập hồ sơ từ phiên bản đang có hiệu lực, so sánh trước – sau và kiểm tra tác động, theo dõi phiên bản có hiệu lực, và phần khác của các bước quy trình điều chỉnh so với quy trình phê duyệt. Hồ sơ Điều chỉnh dùng chung các màn của nghiệp vụ 3.1.6 (Chi tiết hồ sơ, Lịch sử phiên bản), 3.7 (Thẩm định và ý kiến) và các bước của nghiệp vụ 3.1.8; nghiệp vụ này chỉ ghi phần riêng.

Quy tắc của nghiệp vụ 3.1.9:

| Mã | Quy tắc |
|----|----|
| BR-DXMS-09-01 | **Quy trình điều chỉnh.** Hồ sơ Điều chỉnh chạy quy trình MS02, có cùng bước, tác nhân, nhánh, hạn như quy trình MS01 (mục 2.3.3, 7.1, 7.2). Luồng con **MS02.01**, **MS02.02**, **MS02.03** xác định theo BR-DXMS-C-05, giá trị dùng là Giá trị sau điều chỉnh (BR-DXMS-09-05). Văn bản căn cứ không đổi sau bước 10 nên luồng dự kiến giữ tới khi hoàn thành bước 48; các ô lọc Luồng, Quy trình khớp theo luồng dự kiến. Ngưỡng là ngưỡng hồ sơ giữ khi Lưu (BR-DXMS-06-05) |
| BR-DXMS-09-02 | **Điều kiện tạo.** ĐXMS ở APPROVED (BR-DXMS-C-03), không có hồ sơ Đang xử lý (BR-DXMS-C-02), người tạo là ĐV của đơn vị đề xuất (BR-DXMS-01-08). Lưu thực hiện trọn một lần như BR-DXMS-06-05: sinh Mã hồ sơ, xác định Hồ sơ căn cứ, sao chép dữ liệu theo BR-DXMS-09-03, khởi tạo tiến trình MS02, giao bước 1 cho người tạo, ĐXMS sang ADJUSTING. Một phần lỗi thì không có gì được tạo. Hệ thống kiểm tra lại khi Lưu |
| BR-DXMS-09-03 | **Hồ sơ căn cứ và dữ liệu kế thừa.** Hồ sơ căn cứ là hồ sơ COMPLETED có thời điểm nhận kết quả ký mới nhất của ĐXMS (hồ sơ đang "Đang hiệu lực" ở DTMS_CN_0139), Phê duyệt hoặc Điều chỉnh lần trước; xác định khi Lưu, không đổi sau đó. Khi tạo, hồ sơ Điều chỉnh sao chép từ hồ sơ căn cứ: các trường tại BR-DXMS-06-02 (Mật là Có nếu ĐXMS hoặc hồ sơ căn cứ là Có), Loại mua sắm, Phạm vi, Nguồn vốn, văn bản căn cứ cùng liên kết hạng mục, danh mục hạng mục cùng Số lượng đề xuất, Đơn giá, Thành tiền theo cơ sở giá. Bộ giá trị sao chép là **giá trị trước điều chỉnh**, lưu riêng, không sửa được; đây là dữ liệu của hồ sơ Điều chỉnh, người được thấy hồ sơ Điều chỉnh thì thấy, kể cả khi không được thấy hồ sơ căn cứ. Không sao chép: kết quả rà soát tồn kho, yêu cầu báo giá, cơ sở giá (làm lại theo BR-DXMS-C-26); phiên bản, văn bản đầu ra, kết quả ký, ý kiến CQCM, vòng xử lý (đếm lại từ 0). Dữ liệu của hồ sơ căn cứ không đổi |
| BR-DXMS-09-04 | **Lần điều chỉnh** của hồ sơ bằng số hồ sơ Điều chỉnh COMPLETED của ĐXMS tại lúc Lưu cộng 1. Hồ sơ Điều chỉnh dừng hoặc bị hủy không làm tăng số này; hồ sơ tạo lại sau đó mang cùng Lần điều chỉnh. Tên hồ sơ mặc định "Điều chỉnh lần {n} — {Tên ĐXMS}". Trạng thái ĐXMS hiện số lần đã điều chỉnh xong (mục 2.3.1.1) |
| BR-DXMS-09-05 | **Giá trị sau điều chỉnh.** Bước 4 ghi Giá trị sau điều chỉnh dự kiến, chỉ dùng để cảnh báo. Giá trị sau điều chỉnh chính thức là Tổng giá trị theo cơ sở giá của hồ sơ Điều chỉnh (BR-DXMS-06-03), có từ lần yêu cầu báo giá PASSED đầu tiên; là giá trị cổng sau bước 10 đọc, giá trị phân luồng, giá trị xác định Người có thẩm quyền (BR-DXMS-C-26). Chênh lệch = Giá trị sau điều chỉnh − Tổng giá trị của hồ sơ căn cứ, hiện dạng "{±x} tỷ đồng ({±y}%)", hai chữ số thập phân. Sau bước 10 không đổi được, như BR-DXMS-06-03 |
| BR-DXMS-09-06 | **Hạng mục bị ảnh hưởng.** Tại bước 5, mỗi hạng mục có Loại thay đổi do hệ thống tính so với giá trị trước điều chỉnh, một hạng mục có thể có nhiều loại cùng lúc: Không đổi, Tăng số lượng, Giảm số lượng, Bỏ (Số lượng điều chỉnh bằng 0), Thêm mới, Đổi nội dung (đổi Tên, Thông số kỹ thuật, Đơn vị tính). Số lượng so sánh là Số lượng đề xuất. Sau bước 10 có thêm Đổi đơn giá khi Đơn giá theo cơ sở giá mới khác Đơn giá trước điều chỉnh. Hạng mục bị ảnh hưởng là mọi hạng mục khác Không đổi. Rà soát tồn kho (bước 6, 7) và yêu cầu báo giá (bước 8–10) làm lại cho mọi hạng mục khác Bỏ. Hạng mục Bỏ không vào Tổng giá trị và không bị xóa khỏi bảng so sánh |
| BR-DXMS-09-07 | **Tác động điều chỉnh.** Hệ thống tính và hiện: Chênh lệch giá trị; Chuyển ngưỡng khi phía của hồ sơ căn cứ khác phía của Giá trị sau điều chỉnh. Phía của hồ sơ căn cứ theo luồng thực tế của nó: MS01.03, MS02.03 là dưới ngưỡng, còn lại là từ ngưỡng trở lên; phía sau điều chỉnh theo ngưỡng hồ sơ Điều chỉnh giữ (BR-DXMS-09-01), nên ngưỡng hệ thống đổi giữa hai lần không làm sai kết luận; Đổi văn bản phê duyệt so với văn bản SIGNED của hồ sơ căn cứ (BM-08 sang BM-09 hoặc ngược lại); Đổi Người có thẩm quyền so với người đã ký văn bản phê duyệt của hồ sơ căn cứ, người mới theo BR-DXMS-09-12; Báo cáo Tổng Giám đốc Tập đoàn theo gợi ý BR-DXMS-C-07; số hạng mục bị ảnh hưởng; hạng mục đã có kết quả thực hiện mà Số lượng điều chỉnh nhỏ hơn số đã ký hợp đồng. Tác động chỉ cảnh báo, không chặn. Bước 4 tính theo Giá trị sau điều chỉnh dự kiến; bước 5 tính phần hạng mục; trên form bước 10 tính theo Tổng giá trị của cơ sở giá đang chốt trong form, trước khi bấm \[Báo giá đạt\]; giá trị chỉ thành chính thức khi yêu cầu PASSED; sau bước 10 tính theo giá trị chính thức. Ô "Đã xem tác động điều chỉnh" bắt buộc: ở bước 4 khi có Chuyển ngưỡng; ở bước 5 khi có hạng mục giảm dưới số đã ký; ở bước 10 khi bấm \[Báo giá đạt\] mà có Chuyển ngưỡng hoặc giảm dưới số đã ký |
| BR-DXMS-09-08 | **Kết quả đã thực hiện (bước 2).** Hệ thống lấy: văn bản phê duyệt của hồ sơ căn cứ (BM-08 hoặc BM-09, BM-05, BM-06 nếu có) kèm Số, Ngày ký; kế hoạch lựa chọn nhà thầu, gói thầu, hợp đồng có nguồn hình thành là ĐXMS, kèm trạng thái; với hợp đồng đã ký, số lượng đã ký theo từng hạng mục. Lưu bản chụp tại thời điểm lấy, gắn hồ sơ Điều chỉnh, chỉ xem. Phân hệ nguồn chưa có dữ liệu hoặc lỗi thì ghi "Chưa có dữ liệu", tiến trình vẫn đi tiếp. Kết quả đã thực hiện không khóa hạng mục |
| BR-DXMS-09-09 | **Hiệu lực sau điều chỉnh.** Hồ sơ Điều chỉnh COMPLETED (bước 61 Đã ký) thì: hồ sơ này thành phiên bản có hiệu lực của ĐXMS; giá trị hiệu lực bằng Giá trị sau điều chỉnh (BR-DXMS-C-04); văn bản phê duyệt của hồ sơ căn cứ sang "Đã thay thế" (DTMS_CN_0139); ĐXMS về APPROVED, số lần điều chỉnh tăng 1; phần căn cứ, tồn kho tính theo hồ sơ này (BR-DXMS-02-04, BR-DXMS-03-07); phần Đã chốt sử dụng của hồ sơ căn cứ sang Đã giải phóng, phần Đang tạm giữ của hồ sơ Điều chỉnh sang Đã chốt sử dụng (BR-DXMS-03-05). Hồ sơ Điều chỉnh kết thúc ở STOPPED hoặc CANCELED thì ĐXMS về APPROVED, phiên bản có hiệu lực giữ nguyên (BR-DXMS-C-22), phần tồn kho hồ sơ đó đang giữ được giải phóng, phần Đã chốt sử dụng của hồ sơ căn cứ giữ nguyên. Hồ sơ căn cứ luôn giữ COMPLETED |
| BR-DXMS-09-10 | **Ngân sách.** Điều chỉnh, bổ sung ngân sách thực hiện song song theo quy trình ngân sách, ngoài hệ thống này. Hồ sơ Điều chỉnh chỉ ghi Ghi chú ngân sách ở bước 4, đưa vào văn bản dự thảo. Tình trạng ngân sách không chặn bước nào |
| BR-DXMS-09-11 | **Báo cáo Tổng Giám đốc Tập đoàn ở hồ sơ Điều chỉnh (bước 48).** Như BR-DXMS-08-08; gợi ý BR-DXMS-C-07 xét trên văn bản căn cứ của hồ sơ Điều chỉnh tại bước 48 và Giá trị sau điều chỉnh. Có: luồng con MS02.01. Không: luồng con MS02.02 |
| BR-DXMS-09-12 | **Người có thẩm quyền sau điều chỉnh** theo BR-DXMS-C-29, giá trị dùng là Giá trị sau điều chỉnh. Công việc bước 60 giao người này |
| BR-DXMS-09-13 | **Văn bản căn cứ của hồ sơ Điều chỉnh.** Bước 5 chọn được mọi văn bản đang dùng được, như hồ sơ Phê duyệt (BR-DXMS-02-02). Văn bản kế thừa theo BR-DXMS-09-03 hiện sẵn, không xét lại. Khi hoàn thành bước 5, phần căn cứ còn dùng được kiểm tra như DTMS_CN_0141 cho phần tăng thêm so với hồ sơ căn cứ. Phần đó có thể bị ĐXMS khác dùng trong lúc hồ sơ Điều chỉnh đang xử lý (BR-DXMS-02-04), nên ở bước 58 (MS02.01, MS02.02) và bước 60 hệ thống kiểm tra lại; vượt thì form hiện "Văn bản căn cứ {Số văn bản} đã được dùng vượt {x} tỷ đồng so với giá trị còn lại.", không chặn |

**Phần khác của quy trình điều chỉnh** (bước không có trong bảng đi như nghiệp vụ 3.1.8, form có thêm dòng đầu "Điều chỉnh lần {n} · căn cứ hồ sơ {Mã} · đã phê duyệt {x} tỷ → sau điều chỉnh {y} tỷ ({±z}) · luồng {Mã}"):

| Bước | Tên bước điều chỉnh | Khác quy trình phê duyệt | Chức năng |
|----|----|----|----|
| 1 | Chọn ĐXMS đã được phê duyệt cần điều chỉnh | ĐXMS đã chọn khi tạo hồ sơ; form chỉ xác nhận | DTMS_CN_0172 |
| 2 | Lấy dữ liệu ĐXMS cũ và kết quả đã thực hiện | BR-DXMS-09-08 | DTMS_CN_0172 |
| 3 | AI gợi ý thông tin điều chỉnh | Gợi ý lý do, phạm vi, hạng mục có thể cần điều chỉnh | DTMS_CN_0172 |
| 4 | Xác định lý do, phạm vi và xác nhận nội dung điều chỉnh | Form riêng thay form thông tin cơ bản | DTMS_CN_0172 |
| 5 | Chọn/bóc tách căn cứ và nội dung cần điều chỉnh | Hạng mục kế thừa, Loại thay đổi theo BR-DXMS-09-06 | DTMS_CN_0172 |
| 6, 7 | Đối chiếu, nhận rà soát tồn kho tại thời điểm điều chỉnh | Làm lại; kết quả của hồ sơ căn cứ chỉ xem | DTMS_CN_0175 |
| 8–10 | Yêu cầu báo giá điều chỉnh, tổng hợp báo giá | Làm lại; cơ sở giá cũ chỉ xem | DTMS_CN_0175 |
| 11, 12 | Hoàn thiện dự thảo điều chỉnh | Văn bản bản điều chỉnh | DTMS_CN_0175 |
| 48 | Xác định có cần báo cáo TGĐ Tập đoàn | BR-DXMS-09-11 | DTMS_CN_0175 |
| 57, 60, 61 | Quyết định phê duyệt điều chỉnh, phê duyệt, ký duyệt | Văn bản bản điều chỉnh; thẩm quyền sau điều chỉnh; hiệu lực theo BR-DXMS-09-09 | DTMS_CN_0175 |

#### 3.1.9.1 DTMS_CN_0171 Xem danh sách hồ sơ điều chỉnh

##### 3.1.9.1.1 Thông tin chung chức năng

- **Mục đích:** Tra cứu riêng các hồ sơ Điều chỉnh, thấy nhanh mức thay đổi giá trị và luồng của từng lần điều chỉnh.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV (mục 2.3.2).

- **Đường dẫn truy cập:** Đầu tư mua sắm \> Quản lý đề xuất mua sắm \> Luồng mua sắm \> tab Hồ sơ điều chỉnh.

- **Tiền điều kiện:**

  - Đã đăng nhập, có quyền xem.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.9.1.2 Màn hình

<img src="media/rId453.png" style="width:6.25in;height:3.51562in" alt="Danh sách hồ sơ" />

Ảnh minh họa bố cục của màn danh sách hồ sơ. Khác ảnh: là tab Hồ sơ điều chỉnh của Danh sách luồng mua sắm (DTMS_CN_0135), cạnh tab Luồng mua sắm và Hồ sơ (DTMS_CN_0153); tab Hồ sơ điều chỉnh chỉ có hồ sơ loại Điều chỉnh ĐXMS, cột và ô lọc theo mục 3.1.9.1.3.

##### 3.1.9.1.3 Mô tả chi tiết các thành phần

**Tab Hồ sơ điều chỉnh** \[RIÊNG\]: màn danh sách, đăng ký là tab của màn Danh sách luồng mua sắm (DTMS_CN_0135), không phải bước quy trình. Mapping là cột bảng nghiệp vụ; Nhóm lý do, Lý do điều chỉnh do HX-01 ghi ở bước 4 của quy trình MS02 (mục 2.4.3):

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tab** |  |  |  |  |
| 1 | Luồng mua sắm, Hồ sơ, Hồ sơ điều chỉnh | Tab | Input | – | Tab của DTMS_CN_0135; tab Hồ sơ theo DTMS_CN_0153. Đổi tab thì xóa điều kiện tìm, về trang 1. |
|  | **Tìm kiếm** |  |  |  |  |
| 2 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo mã hồ sơ, mã ĐXMS, tên hồ sơ". **Chứa**, không phân biệt hoa thường và dấu, Enter tương đương \[Tìm kiếm\] theo mục 4.3. Mapping: profile.code, proposal.code, profile.title. |
|  | **Tìm kiếm nâng cao** |  |  |  |  |
| 3 | Mã hồ sơ | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: profile.code. |
| 4 | Mã ĐXMS | Textbox \[255\] | Input | Rỗng | **Chứa**. Mapping: proposal.code. |
| 5 | Đơn vị đề xuất | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | **Bằng**. Mapping: profile.unit_id. |
| 6 | Luồng | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. MS02 (chưa xác định), MS02.01, MS02.02, MS02.03. Hồ sơ "(dự kiến)" khớp theo luồng dự kiến. Mapping: profile.branch, profile.branch_expected. |
| 7 | Trạng thái | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. Giá trị theo mục 2.3.1.2. Mapping: profile.status. |
| 8 | Nhóm lý do | Dropdown nhiều lựa chọn | Input | Rỗng | **Thuộc**. Giá trị tại DTMS_CN_0172. Mapping: profile.adjust_reason_group. |
| 9 | Chuyển ngưỡng | Dropdown một lựa chọn | Input | Rỗng | **Bằng**. Có, Không. Hồ sơ chưa có Giá trị sau điều chỉnh không khớp cả hai. Mapping: Tính. |
| 10 | Ngày tạo từ, đến | Date picker \[DD/MM/YYYY\] | Input | Rỗng | Từ ≤ Đến; gồm cả hai ngày. Mapping: profile.created_at. |
|  | **Thao tác** |  |  |  |  |
| 11 | \[Thêm mới\] | Button | Input | – | Mở DTMS_CN_0172, ô ĐXMS để trống, Loại hồ sơ khóa ở Điều chỉnh ĐXMS, ô ĐXMS chỉ liệt kê ĐXMS APPROVED thỏa BR-DXMS-09-02. Hiện với ĐV. |
| 12 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\], \[Tìm kiếm\], \[Đặt lại\] | Button | Input | – | Như DTMS_CN_0135. |
|  | **Lưới** |  |  |  |  |
| 13 | STT | Number | Output | Theo dữ liệu | Theo vị trí trong tập kết quả. |
| 14 | Trạng thái | Tag | Output | Theo dữ liệu | Mục 2.3.1.2. Mapping: profile.status. |
| 15 | Mã hồ sơ | Link | Input | – | Mở DTMS_CN_0155. Mapping: profile.code. |
| 16 | Mã ĐXMS | Link | Input | – | Mở DTMS_CN_0137. Mapping: proposal.code. |
| 17 | Lần điều chỉnh | Number | Output | Theo dữ liệu | BR-DXMS-09-04. Mapping: profile.adjust_no. |
| 18 | Hồ sơ căn cứ | Link | Input | – | BR-DXMS-09-03. Người xem không được thấy hồ sơ đó thì hiện "-". Mapping: profile.base_profile_id. |
| 19 | Tên hồ sơ | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: profile.title. |
| 20 | Đơn vị đề xuất | Text | Output | Theo dữ liệu | Mapping: profile.unit_id. |
| 21 | Giá trị trước điều chỉnh (tỷ đồng) | Number | Output | Theo dữ liệu | Tổng giá trị của hồ sơ căn cứ, căn phải. Mapping: profile.value_before. |
| 22 | Giá trị sau điều chỉnh (tỷ đồng) | Number | Output | Theo dữ liệu | BR-DXMS-09-05, căn phải. Chưa có thì "-". Mapping: profile.total_value. |
| 23 | Chênh lệch | Text | Output | Theo dữ liệu | Theo BR-DXMS-09-05; tăng màu nhấn, giảm màu thường. Chưa có Giá trị sau điều chỉnh thì "-". Mapping: Tính. |
| 24 | Chuyển ngưỡng | Tag | Output | Theo dữ liệu | Hiện "Chuyển ngưỡng" khi có theo BR-DXMS-09-07; không có thì để trống. Mapping: Tính. |
| 25 | Luồng | Text | Output | Theo dữ liệu | BR-DXMS-09-01. Mapping: profile.branch, profile.branch_expected. |
| 26 | Bước hiện tại | Text | Output | Theo dữ liệu | Như DTMS_CN_0153. Mapping: Theo tiến trình. |
| 27 | Ngày cập nhật | Date \[DD/MM/YYYY\] | Output | Theo dữ liệu | Mapping: profile.updated_at. |

Không có cột Thao tác. Phạm vi dòng theo BR-DXMS-01-09. Sắp xếp mặc định: Ngày cập nhật giảm dần, cùng ngày thì Mã hồ sơ giảm dần. Phân trang theo mục 4.4. Bấm vào dòng cũng mở DTMS_CN_0155.

##### 3.1.9.1.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                 |
|------|-------------------------------------------------------|
| 1    | Mở tab.                                               |
| 2    | Hệ thống tải hồ sơ Điều chỉnh trong phạm vi, trang 1. |
| 3    | Người dùng tìm kiếm, phân trang.                      |
| 4    | Mở chi tiết hồ sơ, ĐXMS, hồ sơ căn cứ, hoặc thêm mới. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Chưa có hồ sơ Điều chỉnh trong phạm vi | Giữ tiêu đề bảng, hiện "Chưa có dữ liệu" (mục 4.2) |
| Có dữ liệu, không khớp điều kiện | "Không tìm thấy dữ liệu phù hợp" |
| Ngày tạo từ lớn hơn Ngày tạo đến | Inline tại Ngày tạo từ: "Ngày tạo từ không được lớn hơn Ngày tạo đến." Không tìm |
| Không tải được | Tại vùng lưới: "Không thể tải dữ liệu. Vui lòng thử lại." Giữ điều kiện tìm (mục 4.6.3) |
| Không có quyền vào màn | "Bạn không có quyền thực hiện chức năng này." |

**Đồng thời:** hồ sơ mới, luồng con mới xác định hiện ở lần tải sau.

##### 3.1.9.1.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0171-01 | Có 3 hồ sơ Phê duyệt, 2 hồ sơ Điều chỉnh trong phạm vi | Mở tab Hồ sơ điều chỉnh | Chỉ có 2 dòng Điều chỉnh |
| AC-0171-02 | Hồ sơ căn cứ MS01.02 210,5 tỷ, Giá trị sau điều chỉnh 150 tỷ, ngưỡng 160 | Xem dòng | Chênh lệch "-60,50 tỷ đồng (-28,74%)", có tag Chuyển ngưỡng, Luồng MS02.03 |
| AC-0171-03 | Hồ sơ Điều chỉnh ở bước 4 | Xem dòng | Giá trị sau điều chỉnh, Chênh lệch "-"; Luồng "MS02" |
| AC-0171-04 | Hồ sơ đã qua bước 12, chưa qua bước 48, gợi ý Không báo cáo | Xem dòng | Luồng "MS02.02 (dự kiến)" |
| AC-0171-05 | Lọc Chuyển ngưỡng = Có | Bấm \[Tìm kiếm\] | Không có hồ sơ chưa có Giá trị sau điều chỉnh |
| AC-0171-06 | PG được giao hồ sơ Điều chỉnh, không có trong hồ sơ căn cứ | Mở tab | Thấy dòng; cột Hồ sơ căn cứ "-" |
| AC-0171-07 | CH đơn vị A | Mở tab | Chỉ thấy hồ sơ Điều chỉnh đơn vị A; không có \[Thêm mới\] |
| AC-0171-08 | Đã có điều kiện tìm ở tab Hồ sơ điều chỉnh | Chuyển sang tab Hồ sơ | Điều kiện rỗng, trang 1 |
| AC-0171-09 | Ngày tạo từ 10/10/2026, đến 01/10/2026 | Bấm \[Tìm kiếm\] | Không tìm, báo lỗi tại Ngày tạo từ |
| AC-0171-10 | ĐV ở tab Hồ sơ điều chỉnh | Bấm \[Thêm mới\], mở ô ĐXMS | Loại hồ sơ khóa Điều chỉnh ĐXMS; không có ĐXMS STOPPED |
| AC-0171-11 | Hồ sơ căn cứ MS01.03 150 tỷ lập khi ngưỡng 160; ngưỡng đổi 140; hồ sơ Điều chỉnh tạo sau đó, căn cứ có Kế hoạch SXKD hằng năm, Giá trị sau điều chỉnh 150 tỷ, đang ở bước 13 | Xem dòng | Có tag Chuyển ngưỡng; Luồng "MS02.01 (dự kiến)" |

#### 3.1.9.2 DTMS_CN_0172 Lập hồ sơ điều chỉnh từ phiên bản đã duyệt

##### 3.1.9.2.1 Thông tin chung chức năng

- **Mục đích:** Tạo hồ sơ Điều chỉnh từ phiên bản đang có hiệu lực của ĐXMS, xác định lý do, phạm vi, nội dung và hạng mục điều chỉnh, đủ dữ liệu để rà soát tồn kho và báo giá lại.

- **Người dùng mục tiêu:** ĐV của đơn vị đề xuất. Bước 2, 3: hệ thống.

- **Đường dẫn truy cập:** Chi tiết luồng mua sắm hoặc Chỉnh sửa ĐXMS APPROVED \> \[Tạo hồ sơ\] (ô ĐXMS khóa); tab Hồ sơ \> \[Thêm mới\], chọn Loại hồ sơ Điều chỉnh ĐXMS; tab Hồ sơ điều chỉnh \> \[Thêm mới\]. Việc của tôi \> công việc bước 1 \> nút của luật MS02_T01_HOAN_THANH (Hoàn thành); bước 4 \> nút của luật MS02_T04_HOAN_THANH (Hoàn thành); bước 5 \> nút của luật MS02_T05_GUI_DUYET (Xác nhận danh mục) hoặc MS02_T05_TRA_LAI (Thiếu thông tin căn cứ).

- **Tiền điều kiện:**

  - Có ít nhất một ĐXMS thỏa BR-DXMS-09-02.

- **Hậu điều kiện:**

  - Hồ sơ Điều chỉnh PROCESSING, ĐXMS ADJUSTING, có Hồ sơ căn cứ, bộ giá trị trước điều chỉnh.

  - Sau bước 5 có nội dung điều chỉnh và hạng mục đã xác nhận, tiến trình sang bước 6.

##### 3.1.9.2.2 Màn hình

<img src="media/rId462.png" style="width:6.25in;height:3.51562in" alt="Thêm mới hồ sơ loại Điều chỉnh" />

<img src="media/rId465.png" style="width:6.25in;height:3.51562in" alt="Bước 1 xác nhận ĐXMS cần điều chỉnh" />

<img src="media/rId468.png" style="width:6.25in;height:3.51562in" alt="Bước 4 nội dung điều chỉnh" />

\[RIÊNG\] Ảnh thứ nhất minh họa bố cục màn Thêm mới hồ sơ. Khác ảnh: có thêm Hồ sơ căn cứ, Lần điều chỉnh, Giá trị hiệu lực; ô Quy trình khóa.

\[CẤU HÌNH\] Ảnh bước 1, bước 4 minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms02-t01-dxms-dieu-chinh (bước 1), dtms-ms02-t04-noi-dung-dieu-chinh (bước 4) và luật nút của bước (mục 2.4), không dựng riêng. Trường và thứ tự theo mục 7.4; khác ảnh: bước 1 không có bảng Kết quả đã thực hiện (bước 2 mới lấy); bước 4 không có ô Giá trị sau điều chỉnh bắt buộc mà là Giá trị sau điều chỉnh dự kiến, không bắt buộc; bước 4 có thêm Thông tin cơ bản, Căn cứ phát sinh, khối Tác động, ô Đã xem tác động điều chỉnh; Nhóm lý do, Phạm vi điều chỉnh theo mục 7.4. Bước 5 dùng eForm dtms-ms02-t05-boc-tach, gồm dòng kế thừa eForm bước 5 của quy trình phê duyệt (DTMS_CN_0141) và các cột của hồ sơ Điều chỉnh.

##### 3.1.9.2.3 Mô tả chi tiết các thành phần

**Màn Thêm mới hồ sơ, Loại hồ sơ = Điều chỉnh ĐXMS** \[RIÊNG\]: là màn Thêm mới hồ sơ của DTMS_CN_0154 (màn riêng có menu, không phải bước quy trình); các trường không ghi dưới đây như DTMS_CN_0154. \[Lưu\] khởi tạo tiến trình MS02 và ghi biến khởi tạo để eForm các bước đọc: adj.dxms, adj.dxmsTen (Mã, Tên ĐXMS), adj.from, adj.fromFlow, adj.fromAt (Hồ sơ căn cứ, quy trình, ngày hoàn thành), adj.before (Giá trị hiệu lực), adj.lan (Lần điều chỉnh), adjOldDocs (văn bản phê duyệt của hồ sơ căn cứ), adjTruoc (bộ giá trị trước điều chỉnh, BR-DXMS-09-03), hoSo.ngayTao (ngày tạo hồ sơ), và giá trị kế thừa purchaseType, purpose, scope, secret, period, fundId.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Tên hồ sơ \* | Textbox \[500\] | Input | "Điều chỉnh lần {n} — {Tên ĐXMS}" | BR-DXMS-09-04. Sửa được. Mapping: profile.title. |
| 2 | Loại hồ sơ \* | Dropdown | Input | Điều chỉnh ĐXMS khi ĐXMS APPROVED | Như DTMS_CN_0154. Mapping: profile.type. |
| 3 | Quy trình | Textbox khóa | Output | "MS02 — Điều chỉnh đề xuất mua sắm" | BR-DXMS-09-01. Quy trình không có phiên bản đang hoạt động thì không Lưu được. Mapping: profile.process_key. |
| 4 | ĐXMS \* | Dropdown, có tìm kiếm | Input | ĐXMS đang mở, hoặc rỗng | Như DTMS_CN_0154. Mapping: profile.proposal_id. |
| 5 | Hồ sơ căn cứ | Textbox khóa | Output | Tự điền khi chọn ĐXMS | "{Mã hồ sơ} — {Loại hồ sơ} — {Văn bản phê duyệt} số {Số}, ngày {Ngày ký}". BR-DXMS-09-03. Mapping: profile.base_profile_id. |
| 6 | Lần điều chỉnh | Textbox khóa | Output | Tự điền | BR-DXMS-09-04. Mapping: profile.adjust_no. |
| 7 | Giá trị hiệu lực | Textbox khóa | Output | Tự điền | Giá trị hiệu lực của ĐXMS, tỷ đồng, gồm VAT. Mapping: profile.value_before. |
| 8 | \[Lưu\] | Button | Input | – | Kiểm tra, khởi tạo theo BR-DXMS-09-02, mở công việc bước 1. Chống tạo trùng như DTMS_CN_0154. |

**Các bước:**

| Bước | Xử lý |
|----|----|
| 1 | ĐV xem ĐXMS, hồ sơ căn cứ, văn bản phê duyệt cũ, chọn Đây là ĐXMS cần điều chỉnh. Không đổi được ĐXMS ở bước này; chọn sai thì Hủy hồ sơ (BR-DXMS-C-28) |
| 2 | Tác vụ hệ thống lấy dữ liệu theo BR-DXMS-09-08, lưu bản chụp gắn hồ sơ và ghi biến adjDone (Loại, Mã, Nội dung, Trạng thái, Thời điểm lấy). Lỗi thì adjDone rỗng, tiến trình đi tiếp |
| 3 | Tác vụ AI đọc hồ sơ căn cứ và kết quả đã thực hiện, ghi biến adjAi: gợi ý Nhóm lý do, Phạm vi điều chỉnh, hạng mục có thể cần điều chỉnh, mỗi mục kèm nguồn. Lỗi theo BR-DXMS-08-06 |
| 4 | ĐV nhập nội dung điều chỉnh: thông tin cơ bản, Nhóm lý do, Phạm vi điều chỉnh, Lý do, Căn cứ phát sinh, Giá trị sau điều chỉnh dự kiến, bảng trước – sau, Ghi chú ngân sách; xem khối Tác động |
| 5 | ĐV điều chỉnh văn bản căn cứ, hạng mục theo DTMS_CN_0141, trên bộ hạng mục kế thừa; hệ thống tính Loại thay đổi theo BR-DXMS-09-06. Thiếu thông tin căn cứ thì về bước 4 như DTMS_CN_0161 |
| 6 | Cổng sau bước 5 như DTMS_CN_0161: Đủ thì sang rà soát tồn kho (DTMS_CN_0175); Không đủ thì về bước 4, biến thieuThongTin mang lý do |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5):

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 1 | Activity_1 | Người tạo hồ sơ, là Người phụ trách hồ sơ (BR-DXMS-09-02, BR-DXMS-08-01) | dtms-ms02-t01-dxms-dieu-chinh | MS02_T01_HOAN_THANH (Hoàn thành) | HOAN_THANH | — | Bước 2 |
| 4 | Activity_4 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms02-t04-noi-dung-dieu-chinh | MS02_T04_HOAN_THANH (Hoàn thành) | HOAN_THANH; KT-01 (fundId, danh mục Nguồn vốn, khi chọn phạm vi Nguồn vốn); KT-19 (daXemTacDongDuKien, Chuyển ngưỡng, giaTriSauDuKien); HX-04 (adjAi), HX-01 | Mục 2.4.3, dòng bước 4 và bước 4 (MS02) | Bước 5 |
| 5 | Activity_5 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms02-t05-boc-tach | MS02_T05_GUI_DUYET (Xác nhận danh mục); MS02_T05_TRA_LAI (Thiếu thông tin căn cứ) | Xác nhận danh mục: GUI_DUYET, biến đặt basisOk = true; kiểm tra, hậu xử lý của luật cùng đuôi mã ở DTMS_CN_0141, số còn lại của dòng căn cứ xét trên phần tăng thêm (BR-DXMS-09-13); thêm KT-20 (còn hạng mục khác Bỏ); KT-20 (có hạng mục khác Không đổi, khi phạm vi chỉ có Danh mục hàng hóa, số lượng); KT-19 (daXemTacDongHangMuc, Giảm dưới số đã ký). Thiếu thông tin căn cứ: như luật bước 5 của quy trình phê duyệt | Bảng hạng mục (DTMS_CN_0141) | Cổng sau bước 5 |

Bước 2, 3 là tác vụ hệ thống, bước 6 là cổng trên BPMN, không có màn. Luật MS02_T05_TRA_LAI áp như luật cùng đuôi mã của quy trình phê duyệt (mục 7.5).

**Phần riêng** \[RIÊNG\]:

- **Bảng gợi ý AI** dùng kiểu trường aisuggest (mục 2.4.1), khóa adjAi; mục → trường đích: Nhóm lý do → lyDoNhom, Phạm vi điều chỉnh → phamViDc; mục Hạng mục có thể cần điều chỉnh chỉ để xem, không có trường đích, sửa hạng mục ở bước 5. Mặc định Chấp nhận. AI chưa có kết quả thì bảng rỗng, eForm hiện "Chưa có kết quả gợi ý AI.".

- **Bảng trước – sau** dùng kiểu trường tùy biến adjrows (adjrows, mục 2.4.1), khóa adjRows: một dòng cho mỗi phạm vi đã chọn trừ Danh mục hàng hóa, số lượng (sửa ở bước 5) và Giá trị (tính sau bước 10); cùng các dòng tự thêm, chỉ đọc, cho mỗi trường Thông tin cơ bản (purchaseType, purpose, scope, secret) khác giá trị trước điều chỉnh, và khi đó tự chọn phạm vi Thông tin cơ bản. Trước điều chỉnh: dòng Thời gian thực hiện, Nguồn vốn, dòng Thông tin cơ bản chỉ đọc, từ bộ giá trị trước điều chỉnh (adjTruoc); dòng Chỉ tiêu kỹ thuật, Nội dung khác người dùng nhập nội dung đang được phê duyệt. Sau điều chỉnh: Thời gian thực hiện tối đa 255 ký tự, Nguồn vốn chọn từ danh mục đang hoạt động, còn lại tối đa 2000 ký tự; phải khác Trước điều chỉnh. Sau điều chỉnh của Thời gian thực hiện, Nguồn vốn điền vào period, fundId. Bỏ một phạm vi đã có dòng thì hỏi "Bỏ phạm vi {Tên} sẽ xóa nội dung đã nhập của phạm vi này. Tiếp tục?" \[Đồng ý\] \[Hủy\].

- **Khối điều chỉnh** dùng kiểu trường tùy biến adjimpact (adjimpact, mục 2.4.1), đặc tả ở DTMS_CN_0173: bước 4, 5 có dòng đầu; bước 4 có nút \[Xem so sánh trước – sau\] và khối Tác động tính theo giaTriSauDuKien, chưa nhập giá trị dự kiến thì chỉ hiện phần không cần giá trị; bước 5 có khối Tác động tính phần hạng mục.

- **Lấy kết quả đã thực hiện** (bước 2): tích hợp các phân hệ nguồn (văn bản phê duyệt, kế hoạch lựa chọn nhà thầu, gói thầu, hợp đồng có nguồn hình thành là ĐXMS), đăng ký là tác vụ hệ thống trên BPMN MS02; ghi bản chụp gắn hồ sơ và biến adjDone.

- **Tác vụ AI gợi ý thông tin điều chỉnh** (bước 3): tác vụ hệ thống trên BPMN theo BR-DXMS-C-08, BR-DXMS-08-06, ghi biến adjAi.

- **Bảng hạng mục của hồ sơ Điều chỉnh** (bước 5): phần riêng của kiểu trường bảng hạng mục của DTMS_CN_0141, chạy khi hồ sơ là loại Điều chỉnh ĐXMS, không đọc mã bước. Dòng kế thừa có thêm Số lượng trước, Đơn giá trước (chỉ đọc, từ bộ giá trị trước điều chỉnh), Loại thay đổi (BR-DXMS-09-06), Đã ký hợp đồng (số lượng theo BR-DXMS-09-08, "-" khi chưa có); các cột này là dòng con của bảng lặp trong eForm bước 5 (mục 7.4). Không xóa được dòng kế thừa, chỉ chọn Bỏ hạng mục (Số lượng điều chỉnh bằng 0), dòng Bỏ hiện gạch ngang; bỏ chọn là Khôi phục, Số lượng về giá trị trước. Dòng Thêm mới (không có Số lượng trước) xóa được như DTMS_CN_0141. Có hạng mục giảm dưới số đã ký thì dòng hiện cảnh báo. Văn bản căn cứ theo BR-DXMS-09-13; khi hoàn thành bước 5, Còn lại của dòng căn cứ kiểm tra như DTMS_CN_0141 trên phần tăng thêm so với hồ sơ căn cứ.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi phần riêng của bước:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS02_T01_HOAN_THANH (Hoàn thành) | eForm: Đây là ĐXMS cần điều chỉnh được chọn | Hoàn thành công việc; bước 2 lấy kết quả đã thực hiện |
| MS02_T04_HOAN_THANH (Hoàn thành) | eForm: Loại mua sắm, Mục đích, Mật, Nhóm lý do, Phạm vi điều chỉnh (ít nhất một), Lý do điều chỉnh có giá trị; Giá trị sau điều chỉnh dự kiến lớn hơn 0 khi có nhập; dòng bảng trước – sau có Sau điều chỉnh khác Trước điều chỉnh, dòng Chỉ tiêu kỹ thuật, Nội dung khác có Trước điều chỉnh; dòng gợi ý chọn Sửa có Nội dung sửa. KT-01: Nguồn vốn sau điều chỉnh còn hoạt động, khi chọn phạm vi Nguồn vốn. KT-19: có Chuyển ngưỡng theo giá trị dự kiến thì Đã xem tác động điều chỉnh được chọn | HX-04 lưu gợi ý AI, quyết định và giá trị chốt (BR-DXMS-C-08); HX-01 ghi Loại mua sắm, Mục đích, Phạm vi, Mật, Thời gian thực hiện, Nguồn vốn sau điều chỉnh và Nhóm lý do, Lý do, Giá trị dự kiến, Ghi chú ngân sách, bảng trước – sau, Căn cứ phát sinh vào hồ sơ (mục 2.4.3); bộ giá trị trước điều chỉnh không đổi. Hoàn thành công việc, sang bước 5 |
| MS02_T05_GUI_DUYET (Xác nhận danh mục) | Bảng hạng mục: như DTMS_CN_0141, Còn lại của dòng căn cứ xét trên phần tăng thêm (BR-DXMS-09-13). KT-20: còn ít nhất một hạng mục khác Bỏ. KT-20: bước 4 chỉ chọn phạm vi Danh mục hàng hóa, số lượng thì có ít nhất một hạng mục khác Không đổi. KT-19: có hạng mục giảm dưới số đã ký thì Đã xem tác động điều chỉnh được chọn | Bảng hạng mục lưu hạng mục và Loại thay đổi; biến đặt basisOk = true; hoàn thành công việc, cổng sau bước 5 sang rà soát tồn kho |
| MS02_T05_TRA_LAI (Thiếu thông tin căn cứ) | Như luật bước 5 của quy trình phê duyệt | Biến đặt basisOk = false; về bước 4, biến thieuThongTin mang lý do |

##### 3.1.9.2.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | ĐV mở Thêm mới hồ sơ hoặc \[Tạo hồ sơ\] ở ĐXMS APPROVED. |
| 2 | Chọn ĐXMS nếu chưa khóa; hệ thống điền Loại hồ sơ, Quy trình, Hồ sơ căn cứ, Lần điều chỉnh, Giá trị hiệu lực. |
| 3 | \[Lưu\]; hệ thống kiểm tra, khởi tạo theo BR-DXMS-09-02, hiện Toast "Thêm mới hồ sơ thành công.", mở công việc bước 1. |
| 4 | ĐV chọn Đây là ĐXMS cần điều chỉnh, bấm nút của luật MS02_T01_HOAN_THANH (Hoàn thành), \[Xác nhận\]. |
| 5 | Bước 2, 3 chạy. |
| 6 | ĐV nhập bước 4, bấm nút của luật MS02_T04_HOAN_THANH (Hoàn thành), \[Xác nhận\]. |
| 7 | ĐV hoàn thành bước 5 bằng nút của luật MS02_T05_GUI_DUYET (Xác nhận danh mục). |
| 8 | Bước 6 sang rà soát tồn kho. |

**Luồng thay thế:** bước 5 bấm nút của luật MS02_T05_TRA_LAI (Thiếu thông tin căn cứ) thì về bước 4, như DTMS_CN_0161. Bước 4 bỏ một phạm vi đã có dòng trong bảng trước – sau thì dòng đó bị xóa sau khi người dùng đồng ý ở hộp thoại "Bỏ phạm vi {Tên} sẽ xóa nội dung đã nhập của phạm vi này. Tiếp tục?" \[Đồng ý\] \[Hủy\].

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ của DTMS_CN_0154 và ngoại lệ chung của mục 3.1.8:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| ĐXMS chưa có hồ sơ COMPLETED dù ở APPROVED (dữ liệu lệch) | Inline tại ĐXMS: "Không xác định được hồ sơ căn cứ của ĐXMS." Không lưu |
| Bước 1 chưa chọn Đây là ĐXMS cần điều chỉnh | eForm, inline: "Vui lòng chọn Đây là ĐXMS cần điều chỉnh." |
| Bước 4 chưa chọn Phạm vi điều chỉnh | Inline: "Vui lòng chọn Phạm vi điều chỉnh." |
| Sau điều chỉnh trùng Trước điều chỉnh | Inline tại dòng: "Nội dung sau điều chỉnh phải khác nội dung trước điều chỉnh." |
| Bước 4 chọn phạm vi Nguồn vốn, Nguồn vốn sau điều chỉnh vừa ngừng hoạt động khi Xác nhận | KT-01, inline tại dòng Nguồn vốn của bảng trước – sau: "Nguồn vốn không còn hiệu lực, vui lòng chọn lại." Công việc giữ nguyên |
| Giá trị dự kiến không lớn hơn 0 | Inline: "Giá trị sau điều chỉnh dự kiến phải lớn hơn 0." |
| Có tác động phải xem mà chưa chọn (bước 4, 5) | KT-19, inline: "Vui lòng xem và chọn Đã xem tác động điều chỉnh." Công việc giữ nguyên |
| Bước 5 không còn hạng mục nào khác Bỏ | KT-20, inline tại bảng: "Hồ sơ điều chỉnh phải còn ít nhất một hạng mục." Công việc giữ nguyên |
| Bước 5 không có hạng mục khác Không đổi và bước 4 chỉ chọn phạm vi Danh mục hàng hóa, số lượng | KT-20, inline tại bảng: "Chưa có hạng mục nào được điều chỉnh." Công việc giữ nguyên |
| Lấy kết quả đã thực hiện lỗi ở bước 2 | Bảng ở bước 4 hiện "Chưa có dữ liệu"; không chặn |
| Quy trình MS02 không có phiên bản đang hoạt động | Inline tại Quy trình: "Quy trình chưa có phiên bản đang hoạt động. Vui lòng liên hệ quản trị quy trình." Không lưu |
| Bỏ trống Trước điều chỉnh ở dòng Chỉ tiêu kỹ thuật, Nội dung khác | Inline: "Vui lòng nhập Trước điều chỉnh." |

**Đồng thời:** như DTMS_CN_0154; hai ĐV cùng tạo hồ sơ Điều chỉnh cho một ĐXMS thì người đến trước được tạo. Một hồ sơ Điều chỉnh khác vừa Hoàn thành trước khi Lưu thì Hồ sơ căn cứ, Lần điều chỉnh tính lại khi Lưu, hiện Toast "Hồ sơ căn cứ đã thay đổi thành {Mã}. Vui lòng kiểm tra lại." và không lưu.

##### 3.1.9.2.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0172-01 | ĐXMS APPROVED, hồ sơ căn cứ HS-2026-0103 210,5 tỷ, chưa từng điều chỉnh | Mở \[Tạo hồ sơ\] | Loại Điều chỉnh ĐXMS, Quy trình MS02 khóa, Hồ sơ căn cứ HS-2026-0103, Lần điều chỉnh 1, Tên "Điều chỉnh lần 1 — {Tên ĐXMS}" |
| AC-0172-02 | Như trên | Bấm \[Lưu\] | Hồ sơ PROCESSING, ĐXMS ADJUSTING, bước 1 giao người tạo, có bộ giá trị trước điều chỉnh 210,5 tỷ |
| AC-0172-03 | ĐXMS đã điều chỉnh lần 1 Hoàn thành, lần 2 Dừng xử lý | Tạo hồ sơ Điều chỉnh | Lần điều chỉnh 2; Hồ sơ căn cứ là hồ sơ lần 1 |
| AC-0172-04 | ĐXMS ADJUSTING | Chọn ĐXMS ở Thêm mới | ĐXMS không có trong danh sách |
| AC-0172-05 | Hồ sơ căn cứ Mật Có, ĐXMS Mật Không | Lưu | Hồ sơ Điều chỉnh Mật Có |
| AC-0172-06 | Hồ sơ căn cứ có rà soát tồn kho, báo giá | Lưu, mở tab Rà soát tồn kho trước khi xác nhận bước 7 | Chưa có bản rà soát của hồ sơ mới; bản của hồ sơ căn cứ là Hiện hành (BR-DXMS-03-07) |
| AC-0172-07 | Bước 1 | Bấm \[Xác nhận\] không chọn ô xác nhận | Không lưu, báo lỗi inline |
| AC-0172-08 | Bước 4 chọn phạm vi Thời gian thực hiện, nhập Sau điều chỉnh "01/2027 – 12/2027" | Bấm \[Xác nhận\] | Hồ sơ có Thời gian thực hiện mới; bộ giá trị trước không đổi |
| AC-0172-09 | Bước 4 nhập giá trị dự kiến 150 tỷ, hồ sơ căn cứ MS01.02 210,5 tỷ, ngưỡng 160 | Xem khối Tác động | Có Chuyển ngưỡng, Đổi văn bản phê duyệt BM-08 sang BM-09; chưa chọn Đã xem tác động điều chỉnh thì nút của luật MS02_T04_HOAN_THANH bị chặn bởi KT-19 |
| AC-0172-10 | Bước 4 không nhập giá trị dự kiến | Bấm \[Xác nhận\] | Lưu được; không có cảnh báo chuyển ngưỡng |
| AC-0172-11 | Bước 5, hạng mục kế thừa SL 40, sửa thành 34 | Xem dòng | Loại thay đổi Giảm số lượng, Số lượng trước 40 |
| AC-0172-12 | Bước 5, hạng mục đã ký hợp đồng 20, sửa thành 10 | Bấm nút của luật MS02_T05_GUI_DUYET (Xác nhận danh mục), \[Xác nhận\] | Dòng có cảnh báo giảm dưới số đã ký; chưa chọn Đã xem tác động điều chỉnh thì bị chặn bởi KT-19, công việc giữ nguyên; chọn rồi thì sang rà soát tồn kho |
| AC-0172-13 | Bước 5, dòng kế thừa | Tìm thao tác xóa dòng | Không có thao tác xóa; chọn Bỏ hạng mục thì dòng hiện gạch ngang, Loại thay đổi Bỏ; bỏ chọn (Khôi phục) thì Số lượng về Số lượng trước |
| AC-0172-14 | Dịch vụ lấy kết quả thực hiện lỗi | Mở bước 4 | Bảng kết quả hiện "Chưa có dữ liệu", vẫn Xác nhận được |
| AC-0172-15 | Hồ sơ Điều chỉnh khác của cùng ĐXMS vừa Hoàn thành khi đang ở màn Thêm mới | Bấm \[Lưu\] | Không lưu, hiện Toast hồ sơ căn cứ đã thay đổi |
| AC-0172-16 | Hồ sơ Điều chỉnh vừa tạo | Mở Lịch sử phiên bản | Không có phiên bản; v1 sinh khi hoàn tất bước 11 hoặc 12 |
| AC-0172-17 | Quy trình MS02 không có phiên bản đang hoạt động | Bấm \[Lưu\] | Không lưu, báo lỗi tại Quy trình |
| AC-0172-18 | Bước 4 đổi Mục đích khác giá trị kế thừa | Bấm \[Xác nhận\] | Mục đích của hồ sơ đổi; bảng trước – sau có dòng Mục đích chỉ đọc |
| AC-0172-19 | Bước 4 chọn phạm vi Chỉ tiêu kỹ thuật, bỏ trống Trước điều chỉnh | Bấm \[Xác nhận\] | Không lưu, báo "Vui lòng nhập Trước điều chỉnh." |
| AC-0172-20 | Hồ sơ căn cứ MS01.02; bước 5 thêm văn bản Kế hoạch SXKD hằng năm | Mở ô chọn văn bản | Văn bản có trong danh sách (BR-DXMS-09-13) |
| AC-0172-21 | Luật MS02_T04_HOAN_THANH kích hoạt; giá trị dự kiến 150 tỷ, hồ sơ căn cứ MS01.02 210,5 tỷ, ngưỡng 160; chưa chọn Đã xem tác động điều chỉnh | Bấm nút của luật, \[Xác nhận\] | Nút vẫn hiện; bị chặn bởi KT-19: "Vui lòng xem và chọn Đã xem tác động điều chỉnh."; công việc giữ nguyên |
| AC-0172-22 | Luật MS02_T05_GUI_DUYET kích hoạt; mọi hạng mục kế thừa chọn Bỏ, không có dòng Thêm mới | Bấm nút của luật, \[Xác nhận\] | Bị chặn bởi KT-20: "Hồ sơ điều chỉnh phải còn ít nhất một hạng mục."; công việc giữ nguyên |
| AC-0172-23 | Bước 4 chỉ chọn phạm vi Danh mục hàng hóa, số lượng; bước 5 không đổi hạng mục nào | Bấm nút của luật MS02_T05_GUI_DUYET, \[Xác nhận\] | Bị chặn bởi KT-20: "Chưa có hạng mục nào được điều chỉnh."; công việc giữ nguyên |
| AC-0172-24 | Bước 4 chọn phạm vi Nguồn vốn, Sau điều chỉnh là nguồn vốn bị ngừng hoạt động sau khi mở form | Bấm nút của luật MS02_T04_HOAN_THANH, \[Xác nhận\] | Bị chặn bởi KT-01: "Nguồn vốn không còn hiệu lực, vui lòng chọn lại."; công việc giữ nguyên |
| AC-0172-25 | Bước 4 không chọn phạm vi Nguồn vốn; nguồn vốn kế thừa đã ngừng hoạt động | Bấm nút của luật MS02_T04_HOAN_THANH, \[Xác nhận\] | Không bị chặn bởi KT-01; Nguồn vốn của hồ sơ giữ giá trị kế thừa |
| AC-0172-26 | Thêm một trường vào eForm dtms-ms01-t05-boc-tach | Mở bước 5 của hồ sơ Điều chỉnh mới | Có trường mới nhờ dòng kế thừa của dtms-ms02-t05-boc-tach; không sửa eForm MS02, không sửa mã nguồn (AC-CH-03) |

#### 3.1.9.3 DTMS_CN_0173 So sánh và kiểm tra tác động điều chỉnh

##### 3.1.9.3.1 Thông tin chung chức năng

- **Mục đích:** Cho người lập, người thẩm định và người phê duyệt thấy phần nào đổi so với phiên bản đã duyệt và điều chỉnh ảnh hưởng tới luồng, văn bản, thẩm quyền, hạng mục thế nào.

- **Người dùng mục tiêu:** Xem: ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem. Thao tác: ĐV chọn Đã xem tác động ở bước 4, 5, 10 (BR-DXMS-09-07).

- **Đường dẫn truy cập:** Chi tiết hồ sơ Điều chỉnh \> khối So sánh trước – sau, khối Tác động điều chỉnh; form các bước 4, 10, 11, 12, 13, 16, 17, 19, 35, 42, 48, 58, 60 của hồ sơ Điều chỉnh \> \[Xem so sánh trước – sau\].

- **Tiền điều kiện:**

  - Hồ sơ loại Điều chỉnh ĐXMS, người dùng được thấy hồ sơ (BR-DXMS-01-09).

- **Hậu điều kiện:**

  - Không đổi dữ liệu, trừ ô Đã xem tác động ở bước 4, 5, 10.

##### 3.1.9.3.2 Màn hình

<img src="media/rId477.png" style="width:6.25in;height:3.51562in" alt="So sánh trước – sau trên chi tiết hồ sơ" />

Ảnh chụp hồ sơ chuyển ngưỡng từ 210,5 xuống 150 tỷ. Khác ảnh: bảng có thêm cột Chênh lệch, khối Hạng mục bị ảnh hưởng, khối Tác động điều chỉnh; thông tin chung có Hồ sơ căn cứ, Lần điều chỉnh, Luồng.

##### 3.1.9.3.3 Mô tả chi tiết các thành phần

\[RIÊNG\] Đăng ký vào nền tảng: Thông tin chung phần riêng và hai khối So sánh, Tác động là khối của màn Chi tiết hồ sơ (DTMS_CN_0155), hiện khi hồ sơ là loại Điều chỉnh ĐXMS; trên form bước là kiểu trường eForm tùy biến adjimpact (adjimpact, mục 2.4.1), tham số theo dòng eForm của bước (mục 7.4). Hai nơi đọc cùng một nguồn tính so sánh, tác động. Ô Đã xem tác động điều chỉnh ở bước 4, 5, 10 là trường của eForm bước, kiểm tra bằng KT-19 (mục 2.5.2).

**Thông tin chung, phần riêng của hồ sơ Điều chỉnh** \[RIÊNG\] (thêm vào DTMS_CN_0155): Hồ sơ căn cứ (link, BR-DXMS-09-03; không được thấy thì "-"), Lần điều chỉnh, Luồng (BR-DXMS-09-01), Giá trị sau điều chỉnh (gồm VAT) thay nhãn Tổng giá trị, Nhóm lý do, Lý do điều chỉnh, Ghi chú ngân sách.

**Khối So sánh trước – sau điều chỉnh** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Căn cứ | Text | Output | Theo dữ liệu | "Căn cứ: hồ sơ {Mã}" kèm link, như cột Hồ sơ căn cứ. Mapping: profile.base_profile_id. |
| 2 | STT | Number | Output | Theo dữ liệu |  |
| 3 | Nội dung | Text | Output | Theo dữ liệu | Dòng cố định: Tổng giá trị (gồm VAT); Thời gian thực hiện; Nguồn vốn; Danh mục hạng mục. Sau đó các dòng của bảng trước – sau bước 4. |
| 4 | Đã phê duyệt | Text | Output | Theo dữ liệu | Giá trị trước điều chỉnh. Danh mục hạng mục: "{n} hạng mục". Mapping: profile.value_before, profile_adjust_row.before. |
| 5 | Sau điều chỉnh | Text | Output | Theo dữ liệu | Giá trị hiện tại của hồ sơ. Tổng giá trị chưa có thì "-". Khác Đã phê duyệt thì màu nhấn. Mapping: profile.\*, profile_adjust_row.after. |
| 6 | Chênh lệch | Text | Output | Theo dữ liệu | Dòng Tổng giá trị theo BR-DXMS-09-05. Dòng khác: "Có thay đổi" hoặc "-". Mapping: Tính. |

**Khối Hạng mục bị ảnh hưởng** \[RIÊNG\]: STT, Tên hạng mục, Loại thay đổi, Số lượng trước, Số lượng sau, Đơn giá trước, Đơn giá sau, Thành tiền trước, Thành tiền sau, Chênh lệch, Đã ký hợp đồng. Chỉ có dòng khác Không đổi (BR-DXMS-09-06); \[Hiện cả hạng mục không đổi\] bật, tắt các dòng còn lại. Đơn giá sau, Thành tiền sau "-" tới khi có cơ sở giá. Sắp theo STT hạng mục, không phân trang.

**Khối Tác động điều chỉnh** \[RIÊNG\]:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Chênh lệch giá trị | Text | Output | Theo dữ liệu | Theo BR-DXMS-09-05. Mapping: Tính. |
| 2 | Luồng | Text | Output | Theo dữ liệu | "Hồ sơ căn cứ: {từ / dưới} {ngưỡng} tỷ ({Quy trình}) → sau điều chỉnh: {từ / dưới} {ngưỡng} tỷ ({Luồng})". Chuyển ngưỡng thì có tag Chuyển ngưỡng. Mapping: Tính. |
| 3 | Văn bản phê duyệt | Text | Output | Theo dữ liệu | "{BM cũ} → {BM mới}", hoặc "Không đổi ({BM})". Mapping: Tính. |
| 4 | Người có thẩm quyền | Text | Output | Theo dữ liệu | "{Người đã ký văn bản phê duyệt của hồ sơ căn cứ} → {Người có thẩm quyền theo BR-DXMS-09-12}"; cùng một người thì "Không đổi". Mapping: Tính. |
| 5 | Báo cáo Tổng Giám đốc Tập đoàn | Text | Output | Theo dữ liệu | Gợi ý theo BR-DXMS-C-07, kèm lý do. Sau bước 48: lựa chọn của TTMS. Mapping: Tính, profile.report_group. |
| 6 | Hạng mục bị ảnh hưởng | Text | Output | Theo dữ liệu | "{n} / {tổng} hạng mục". Mapping: Tính. |
| 7 | Giảm dưới số đã ký | Text | Output | Theo dữ liệu | Danh sách hạng mục có Số lượng sau nhỏ hơn số đã ký hợp đồng; không có thì không hiện dòng. Mapping: Tính. |
| 8 | Thời điểm tính | Text | Output | Theo dữ liệu | "Tính theo Giá trị sau điều chỉnh dự kiến" trước bước 10; "Tính theo cơ sở giá đang chốt" trên form bước 10; "Tính theo cơ sở giá ngày {DD/MM/YYYY}" sau bước 10. Mapping: Tính. |

**Trên form các bước** \[RIÊNG\], kiểu trường adjimpact (adjimpact); bước nào hiện phần nào là tham số của dòng eForm, không đọc mã bước: dòng đầu như bảng phần khác của nghiệp vụ 3.1.9; khi có Chuyển ngưỡng thêm thông báo "Giá trị sau điều chỉnh {x} tỷ đồng {vượt lên / xuống dưới} ngưỡng {n} tỷ đồng so với hồ sơ căn cứ. Hồ sơ đi luồng {Luồng}, văn bản phê duyệt {BM}." \[Xem so sánh trước – sau\] mở hai khối trên trong hộp thoại chỉ xem.

##### 3.1.9.3.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả |
|----|----|
| 1 | Người dùng mở Chi tiết hồ sơ Điều chỉnh hoặc form bước. |
| 2 | Hệ thống tính so sánh, tác động từ dữ liệu hiện tại của hồ sơ và bộ giá trị trước điều chỉnh. |
| 3 | Người dùng xem, bật hạng mục không đổi, mở hồ sơ căn cứ. |
| 4 | Ở bước 4, 5, 10, ĐV chọn Đã xem tác động khi bắt buộc rồi Xác nhận bước. |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Hồ sơ không phải loại Điều chỉnh | Không có hai khối |
| Không tải được | Tại khối: "Không thể tải dữ liệu. Vui lòng thử lại." Phần khác của màn vẫn hiện (mục 4.6.3) |
| Chưa có hạng mục bị ảnh hưởng | Khối Hạng mục bị ảnh hưởng: "Không có hạng mục thay đổi." |
| Chưa xác định được Người có thẩm quyền | Dòng Người có thẩm quyền: "Chưa xác định" |

**Đồng thời:** dữ liệu đổi ở bước đang xử lý hiện ở lần tải sau; khối không tự làm mới.

##### 3.1.9.3.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0173-01 | Hồ sơ căn cứ 210,5 tỷ MS01.02; hồ sơ Điều chỉnh qua bước 10 với 150 tỷ, ngưỡng 160 | Mở Chi tiết hồ sơ | Tổng giá trị 210,5 → 150, Chênh lệch "-60,50 tỷ đồng (-28,74%)"; Luồng có tag Chuyển ngưỡng; Văn bản phê duyệt "BM-08 → BM-09" |
| AC-0173-02 | Hồ sơ ở bước 4, có giá trị dự kiến 172 tỷ, hồ sơ căn cứ 152 tỷ | Mở form bước 4 | Tác động ghi "Tính theo Giá trị sau điều chỉnh dự kiến", có Chuyển ngưỡng |
| AC-0173-03 | Hồ sơ có 5 hạng mục, 1 hạng mục Giảm số lượng | Mở Chi tiết hồ sơ | Khối Hạng mục bị ảnh hưởng 1 dòng; Hạng mục bị ảnh hưởng "1 / 5" |
| AC-0173-04 | Như trên | Bật \[Hiện cả hạng mục không đổi\] | 5 dòng |
| AC-0173-05 | Bảng phân cấp: dưới 160 tỷ là Phó TGĐ A, từ 160 tỷ là Thủ trưởng VHT; hồ sơ căn cứ 210,5 tỷ do Thủ trưởng VHT ký; sau điều chỉnh 150 tỷ | Mở form bước 60 | Dòng Người có thẩm quyền "Thủ trưởng VHT → Phó TGĐ A"; công việc bước 60 giao Phó TGĐ A |
| AC-0173-10 | Chưa cấu hình bảng phân cấp; hồ sơ căn cứ do Thủ trưởng VHT ký | Mở form bước 60 | Dòng Người có thẩm quyền "Không đổi" |
| AC-0173-06 | Hồ sơ Phê duyệt | Mở Chi tiết hồ sơ | Không có khối So sánh, Tác động |
| AC-0173-07 | Bước 10, cơ sở giá đang chốt 200 tỷ, hồ sơ căn cứ MS01.02 210,5 tỷ, không giảm dưới số đã ký | Bấm \[Báo giá đạt\] | Không cần chọn Đã xem tác động |
| AC-0173-11 | Bước 10, cơ sở giá đang chốt 150 tỷ, hồ sơ căn cứ MS01.02 | Bấm \[Báo giá đạt\] chưa chọn Đã xem tác động | Không xác nhận, báo chọn Đã xem tác động; khối ghi "Tính theo cơ sở giá đang chốt" |
| AC-0173-08 | CQ mở form bước 19 của hồ sơ Điều chỉnh | Bấm \[Xem so sánh trước – sau\] | Hộp thoại chỉ xem có hai khối |
| AC-0173-09 | Hồ sơ đã qua bước 48, TTMS chọn Có | Mở Chi tiết hồ sơ | Báo cáo Tổng Giám đốc Tập đoàn hiện "Có (TTMS xác nhận)" |

#### 3.1.9.4 DTMS_CN_0174 Theo dõi lịch sử và phiên bản ĐXMS có hiệu lực

##### 3.1.9.4.1 Thông tin chung chức năng

- **Mục đích:** Biết phiên bản nào của ĐXMS đang có hiệu lực và chuỗi các lần điều chỉnh từ lần phê duyệt ban đầu.

- **Người dùng mục tiêu:** ĐV, CH, TT, CQ, PG, TV, TĐ trong phạm vi được xem.

- **Đường dẫn truy cập:** Chi tiết luồng mua sắm \> tab Thông tin chung \> Phiên bản có hiệu lực, khối Lịch sử điều chỉnh.

- **Tiền điều kiện:**

  - Được xem ĐXMS.

- **Hậu điều kiện:**

  - Không đổi dữ liệu.

##### 3.1.9.4.2 Màn hình

<img src="media/rId486.png" style="width:6.25in;height:3.51562in" alt="Chi tiết luồng mua sắm sau điều chỉnh lần 1" />

Ảnh chụp ĐXMS đã điều chỉnh lần 1. Khác ảnh: thông tin chung có Phiên bản có hiệu lực; có khối Lịch sử điều chỉnh cuối tab Thông tin chung.

##### 3.1.9.4.3 Mô tả chi tiết các thành phần

**Thông tin chung, phần thêm** \[RIÊNG\]: trường của tab Thông tin chung màn Chi tiết luồng mua sắm (DTMS_CN_0137), không phải bước quy trình; các trường khác theo DTMS_CN_0137:

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Trạng thái | Text | Output | Theo dữ liệu | Như DTMS_CN_0137, kèm số lần điều chỉnh (BR-DXMS-09-04). Mapping: Suy từ hồ sơ. |
| 2 | Giá trị hiệu lực | Text | Output | Theo dữ liệu | BR-DXMS-C-04, BR-DXMS-09-09. Mapping: Tính. |
| 3 | Phiên bản có hiệu lực | Text | Output | Theo dữ liệu | "{Mã hồ sơ} — {Phê duyệt / Điều chỉnh lần n} — {Văn bản} số {Số}, ngày {Ngày ký}", link mở DTMS_CN_0155. Chưa có hồ sơ COMPLETED thì "-". Không được thấy hồ sơ đó thì "-" như BR-DXMS-01-09. Mapping: Hồ sơ "Đang hiệu lực" theo DTMS_CN_0139. |

**Khối Lịch sử điều chỉnh** \[RIÊNG\]: khối cuối tab Thông tin chung của màn Chi tiết luồng mua sắm (DTMS_CN_0137), hiện khi ĐXMS có hồ sơ Điều chỉnh. Lý do điều chỉnh do HX-01 ghi ở bước 4 của quy trình MS02 (mục 2.4.3):

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Lần | Text | Output | Theo dữ liệu | "Phê duyệt" cho hồ sơ Phê duyệt COMPLETED; "Điều chỉnh lần {n}" cho hồ sơ Điều chỉnh. Mapping: profile.adjust_no. |
| 2 | Hồ sơ | Link | Input | – | Mở DTMS_CN_0155. Mapping: profile.code. |
| 3 | Hồ sơ căn cứ | Link | Input | – | "-" với dòng Phê duyệt. Mapping: profile.base_profile_id. |
| 4 | Lý do | Text | Output | Theo dữ liệu | Lý do điều chỉnh, tối đa 2 dòng, quá dài hiện tooltip. Mapping: profile.adjust_reason. |
| 5 | Giá trị (tỷ đồng) | Number | Output | Theo dữ liệu | Giá trị của hồ sơ; dòng Điều chỉnh chưa có giá trị chính thức thì "-". Mapping: profile.total_value. |
| 6 | Chênh lệch | Text | Output | Theo dữ liệu | So với hồ sơ căn cứ, theo BR-DXMS-09-05; dòng Phê duyệt "-". Mapping: Tính. |
| 7 | Luồng | Text | Output | Theo dữ liệu | Mã quy trình hoặc luồng theo BR-DXMS-09-01. Mapping: profile.process_key, profile.branch, profile.branch_expected. |
| 8 | Trạng thái hồ sơ | Tag | Output | Theo dữ liệu | Mục 2.3.1.2. Mapping: profile.status. |
| 9 | Văn bản phê duyệt | Text | Output | Theo dữ liệu | "{Văn bản} số {Số}, ngày {Ngày ký}" khi COMPLETED; còn lại "-". Mapping: Kết quả ký. |
| 10 | Hiệu lực | Tag | Output | Theo dữ liệu | Đang hiệu lực, Đã thay thế theo DTMS_CN_0139; hồ sơ không COMPLETED để trống. Mapping: Tính. |

Khác tab Tiến trình (DTMS_CN_0137: mọi hồ sơ, theo tiến trình) và tab Kết quả & văn bản phê duyệt (DTMS_CN_0139: chỉ hồ sơ được duyệt, theo văn bản), khối này là chuỗi điều chỉnh, có giá trị, chênh lệch, lý do từng lần. Hiệu lực đọc cùng nguồn với DTMS_CN_0139 nên luôn trùng. Gồm hồ sơ Phê duyệt COMPLETED và mọi hồ sơ Điều chỉnh, kể cả STOPPED, CANCELED; không gồm hồ sơ Phê duyệt chưa được duyệt. Lọc theo BR-DXMS-01-09. Sắp theo Ngày tạo tăng dần, không phân trang.

##### 3.1.9.4.4 Luồng nghiệp vụ

**Luồng chính:**

| Bước | Mô tả                                                 |
|------|-------------------------------------------------------|
| 1    | Mở Chi tiết luồng mua sắm.                            |
| 2    | Hệ thống xác định phiên bản có hiệu lực, tải lịch sử. |
| 3    | Người dùng mở hồ sơ, văn bản.                         |

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:**

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| ĐXMS chưa có hồ sơ Điều chỉnh | Không hiện khối Lịch sử điều chỉnh |
| Mọi dòng bị ẩn theo BR-DXMS-01-09 | Tại khối: "Chưa có dữ liệu" |
| Không tải được | Tại khối: "Không thể tải dữ liệu. Vui lòng thử lại." (mục 4.6.3) |

**Đồng thời:** kết quả ký ở bước 61 về trong lúc xem thì Phiên bản có hiệu lực và khối đổi ở lần tải sau.

##### 3.1.9.4.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0174-01 | Hồ sơ Phê duyệt 210,5 tỷ, hồ sơ Điều chỉnh lần 1 150 tỷ đều COMPLETED | Mở Chi tiết luồng mua sắm | Trạng thái "Đã phê duyệt (điều chỉnh lần 1)", Giá trị hiệu lực 150, Phiên bản có hiệu lực là hồ sơ lần 1 |
| AC-0174-02 | Như trên | Xem khối Lịch sử điều chỉnh | Hai dòng: Phê duyệt "Đã thay thế"; Điều chỉnh lần 1 "-60,50 tỷ đồng (-28,74%)", "Đang hiệu lực" |
| AC-0174-03 | Hồ sơ Điều chỉnh lần 1 đang xử lý | Mở Chi tiết luồng mua sắm | Trạng thái Đang điều chỉnh; Phiên bản có hiệu lực vẫn là hồ sơ Phê duyệt; dòng lần 1 không có Hiệu lực |
| AC-0174-04 | Hồ sơ Điều chỉnh lần 1 Dừng xử lý, lần 1 tạo lại Hoàn thành | Xem khối | Ba dòng; hai dòng "Điều chỉnh lần 1", một Dừng xử lý, một Đang hiệu lực |
| AC-0174-05 | ĐXMS chỉ có hồ sơ Phê duyệt | Mở Chi tiết luồng mua sắm | Không có khối Lịch sử điều chỉnh; Phiên bản có hiệu lực là hồ sơ Phê duyệt |
| AC-0174-06 | PG chỉ được giao hồ sơ Điều chỉnh lần 1 | Mở Chi tiết luồng mua sắm | Khối có một dòng; Hồ sơ căn cứ "-" |
| AC-0174-07 | Hồ sơ Điều chỉnh đang hiệu lực là Mật, người xem không thuộc danh sách | Mở Chi tiết luồng mua sắm | Phiên bản có hiệu lực "-", Giá trị hiệu lực "-" |

#### 3.1.9.5 DTMS_CN_0175 Xử lý bước: Phần khác biệt của luồng điều chỉnh MS02

##### 3.1.9.5.1 Thông tin chung chức năng

- **Mục đích:** Xử lý các bước của quy trình điều chỉnh có khác quy trình phê duyệt: rà soát tồn kho, báo giá lại, phân luồng theo giá trị sau điều chỉnh, văn bản bản điều chỉnh, báo cáo Tập đoàn, phê duyệt theo thẩm quyền sau điều chỉnh.

- **Người dùng mục tiêu:** Theo bảng vai trò mục 2.3.2, như bước tương ứng của nghiệp vụ 3.1.8.

- **Đường dẫn truy cập:** Việc của tôi \> công việc của bước \> nút của luật MS02\_… của bước (mục 7.5), vd bước 10 \> nút của luật MS02_T10_XAC_NHAN (Báo giá đạt); bước 48 \> nút của luật MS02_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn) hoặc MS02_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn).

- **Tiền điều kiện:**

  - Hồ sơ Điều chỉnh đã qua bước 5 (DTMS_CN_0172).

- **Hậu điều kiện:**

  - Như nghiệp vụ 3.1.8.

  - Khi bước 61 Đã ký thì hiệu lực theo BR-DXMS-09-09.

##### 3.1.9.5.2 Màn hình

<img src="media/rId495.png" style="width:6.25in;height:3.51562in" alt="Bước 7 rà soát tồn kho tại thời điểm điều chỉnh" />

\[CẤU HÌNH\] Ảnh minh họa một cấu hình mẫu. Màn do nền tảng dựng từ eForm dtms-ms02-t07-ra-soat-ton-kho và luật nút của bước (mục 2.4), không dựng riêng. Mỗi eForm dtms-ms02-… của bước 6–61 gồm khối điều chỉnh kiểu adjimpact ở đầu (adjimpact, DTMS_CN_0173), dòng kế thừa eForm cùng bước của quy trình phê duyệt và các dòng thêm khi bước có phần khác (mục 7.4); trường và thứ tự theo mục 7.4. Khác ảnh: cột Kết quả cũ ghi "Hồ sơ căn cứ: khả dụng {x}, dùng từ kho {y}"; có cột Loại thay đổi; hạng mục Bỏ không có trong form.

##### 3.1.9.5.3 Mô tả chi tiết các thành phần

**Các bước** (chỉ ghi phần khác; bước không ghi đi như nghiệp vụ 3.1.8):

| Bước | Xử lý |
|----|----|
| 6 | Tác vụ hệ thống gửi yêu cầu rà soát tồn kho mới theo DTMS_CN_0142 cho mọi hạng mục khác Bỏ, thời điểm lấy là thời điểm chạy bước. Phần tồn kho hồ sơ căn cứ đã chốt không bị trừ vào Tồn khả dụng của hồ sơ Điều chỉnh (BR-DXMS-03-02) |
| 7 | ĐV rà soát lại theo DTMS_CN_0143; mỗi dòng có thêm Kết quả cũ (khả dụng, dùng từ kho của hồ sơ căn cứ; hồ sơ căn cứ không có thì "-") và Loại thay đổi, chỉ đọc. Không có thao tác dùng lại kết quả cũ |
| 8, 9 | Yêu cầu báo giá điều chỉnh theo DTMS_CN_0145 cho mọi hạng mục khác Bỏ có Còn phải mua lớn hơn 0. Yêu cầu, báo giá của hồ sơ căn cứ không chuyển sang, không dùng làm báo giá của hồ sơ này |
| 10 | ĐV tổng hợp báo giá theo DTMS_CN_0148; xem bảng So với cơ sở giá của hồ sơ căn cứ (Hạng mục, Đơn giá trước, Đơn giá mới, Chênh lệch) và khối Tác động tính theo cơ sở giá đang chốt. Báo giá phải có Ngày báo giá từ ngày tạo hồ sơ Điều chỉnh trở về sau. Khi PASSED: Giá trị sau điều chỉnh chính thức (BR-DXMS-09-05). Cổng sau bước 10 rẽ bước 11 hoặc 12, ghi Luồng theo BR-DXMS-09-01 |
| 11, 12 | Dự thảo bản điều chỉnh như DTMS_CN_0162. BM-09 hoặc BM-01 có thêm mục "Nội dung điều chỉnh": căn cứ điều chỉnh (Hồ sơ căn cứ, văn bản phê duyệt số, ngày), Nhóm lý do, Lý do, bảng trước – sau và hạng mục bị ảnh hưởng (DTMS_CN_0173), Giá trị trước, sau, chênh lệch, kết quả đã thực hiện, Ghi chú ngân sách. Tiêu đề "Tờ trình điều chỉnh đề xuất mua sắm". Checklist theo luồng sau điều chỉnh |
| 15–47 | Như nghiệp vụ 3.1.8. BM-03, BM-04, BM-05 ghi đối tượng là "hồ sơ điều chỉnh ĐXMS {Mã ĐXMS} lần {n}". Danh sách CQCM bắt buộc như BR-DXMS-C-12. Vòng xử lý của hồ sơ Điều chỉnh đếm từ 0 |
| 48 | TTMS xác định có báo cáo Tổng Giám đốc Tập đoàn theo BR-DXMS-09-11, như DTMS_CN_0169: hai nút Có, Không hiển thị như nhau; gợi ý (Có / Không, lý do) là khối chỉ xem; chọn khác gợi ý thì Lý do bắt buộc, tối đa 2000 ký tự |
| 49–56 | Như nghiệp vụ 3.1.8. BM-06 về nội dung điều chỉnh, có mục Nội dung điều chỉnh như bước 11, 12; BM-07 do Ban ĐTXD Tập đoàn lập ngoài hệ thống |
| 57, 58 | Bước 57 sinh BM-08 bản điều chỉnh: tiêu đề "Quyết định phê duyệt điều chỉnh đề xuất mua sắm"; Điều 1 phê duyệt điều chỉnh, ghi văn bản phê duyệt cũ số, ngày và từng nội dung trước → sau; Điều 2 các nội dung khác giữ nguyên theo văn bản phê duyệt cũ. Bước 58 kiểm tra lại căn cứ theo BR-DXMS-09-13, vượt thì eForm hiện cảnh báo, không chặn |
| 60 | Người có thẩm quyền theo BR-DXMS-09-12; eForm hiện dòng Người có thẩm quyền của khối Tác động và cảnh báo căn cứ theo BR-DXMS-09-13. Phê duyệt, Yêu cầu hoàn chỉnh, Chỉ đạo khác như BR-DXMS-08-10; Chỉ đạo khác thì hồ sơ STOPPED, ĐXMS về APPROVED (BR-DXMS-09-09) |
| 61 | Ký duyệt BM-08 hoặc BM-09 bản điều chỉnh. Đã ký: hồ sơ COMPLETED, áp BR-DXMS-09-09, thông báo cho Người phụ trách hồ sơ và TTMS: "Hồ sơ điều chỉnh {Mã hồ sơ} của ĐXMS {Mã ĐXMS} đã được phê duyệt. Giá trị hiệu lực: {y} tỷ đồng." |

**Cấu hình bước** \[CẤU HÌNH\] (mục 7.3, 7.5). Bước của MS02 có cùng số bước, task key, người nhận, eForm kế thừa và luật cùng đuôi mã với bước tương ứng của MS01 (BR-DXMS-09-01). Luật MS02\_… áp mọi kiểm tra, hậu xử lý, tham số của luật MS01\_… cùng đuôi mã (mục 7.5), trừ các luật có dòng riêng dưới đây. Bảng chỉ ghi bước có phần khác:

| Bước | Task key | Người nhận | eForm | Luật nút | Bộ xử lý, kiểm tra, hậu xử lý | Dữ liệu nghiệp vụ | Hướng đi |
|----|----|----|----|----|----|----|----|
| 7 | Activity_7 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms02-t07-ra-soat-ton-kho | MS02_T07_HOAN_THANH (Hoàn thành) | HOAN_THANH; như luật cùng đuôi mã của MS01 | Bản rà soát tồn kho (DTMS_CN_0143) | Bước 8 |
| 8 | Activity_8 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms02-t08-ycbg | MS02_T08_TRA_LAI (Tạo yêu cầu báo giá) | Như luật cùng đuôi mã của MS01 | Yêu cầu báo giá (DTMS_CN_0145) | Bước 9 |
| 10 | Activity_10 | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms02-t10-bao-gia | MS02_T10_XAC_NHAN (Báo giá đạt); MS02_T10_TRA_LAI (Không đạt — gửi lại YCBG) | Báo giá đạt: XAC_NHAN; kiểm tra, hậu xử lý của luật cùng đuôi mã ở DTMS_CN_0148; thêm KT-21 (hoSo.ngayTao); KT-19 (daXemTacDongBaoGia, Chuyển ngưỡng hoặc Giảm dưới số đã ký, cơ sở giá đang chốt). Không đạt: như MS01 | Cơ sở giá (DTMS_CN_0148) | Báo giá đạt: cổng sau bước 10, bước 11 khi dưới ngưỡng, bước 12 khi từ ngưỡng trở lên. Không đạt: bước 9 |
| 11, 12 | Activity_11 (MS02.03), Activity_12 (MS02.01, .02) | Người phụ trách hồ sơ (BR-DXMS-08-01) | dtms-ms02-t11-12-du-thao | MS02_T11_GUI_DUYET, MS02_T12_GUI_DUYET (Gửi chỉ huy duyệt) | GUI_DUYET; như MS01, thêm HX-18 (dieuChinh) trước HX-02; văn bản bản điều chỉnh theo luồng con: MS02.01, .02 là BM-01, Phụ lục chi phí, Checklist 01; MS02.03 là BM-09, Phụ lục chi phí, Checklist 02 | Mục 2.4.3, dòng bước 11, 12 | Bước 13 |
| 48 | Activity_48 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms02-t48-bao-cao-td | MS02_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn); MS02_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn) | XAC_NHAN; biến đặt reportTD = true và luồng con MS02.01 / reportTD = false và luồng con MS02.02; KT-05 (reportSuggested, giá trị của nút, reportReason); HX-01 | Mục 2.4.3, dòng bước 48 | Có: bước 49. Không: bước 57 |
| 58, 59 | Activity_58, Activity_59 | Nhóm chuyên viên TTMS (BR-DXMS-08-01) | dtms-ms02-t58-60-bm08 | MS02_T58_HOAN_THANH (Hoàn thành); MS02_T59_GUI_DUYET (Trình phê duyệt) | Như MS01; HX-02 sinh BM-08 bản điều chỉnh | — | Bước 59; bước 60 |
| 60 | Activity_60 | Người có thẩm quyền theo BR-DXMS-09-12 | dtms-ms02-t60-phe-duyet-bm09, dòng theo luồng con | MS02_T60_PHE_DUYET (Phê duyệt); MS02_T60_TRA_LAI (Yêu cầu hoàn chỉnh); MS02_T60_TRA_LAI_2 (Chỉ đạo khác — kết thúc) | Như MS01; văn bản theo luồng con: BM-08 bản điều chỉnh cho MS02.01, .02, ô PHÊ DUYỆT trên BM-09 bản điều chỉnh cho MS02.03 | — | Phê duyệt: bước 61. Yêu cầu hoàn chỉnh: bước 25. Chỉ đạo khác: kết thúc ở Dừng xử lý |

**eForm của bước MS02** \[CẤU HÌNH\]: eForm dtms-ms02-… khai một dòng kế thừa eForm cùng bước của MS01 (mục 7.4), nên sửa eForm MS01 thì eForm MS02 đổi theo. Dòng đầu mỗi eForm là khối adjimpact; tham số của khối theo bước: dòng đầu ở mọi bước; nút \[Xem so sánh trước – sau\] ở bước 10, 11, 12, 13, 16, 17, 19, 35, 42, 48, 58, 59, 60; bảng So với cơ sở giá của hồ sơ căn cứ và khối Tác động theo cơ sở giá đang chốt ở bước 10; dòng Người có thẩm quyền ở bước 60; cảnh báo căn cứ BR-DXMS-09-13 ở bước 58, 59, 60. Bước 7 thêm dòng con Kết quả cũ, Loại thay đổi vào bảng lặp rà soát; bước 10 thêm ô daXemTacDongBaoGia và dòng nhắc ngày báo giá. Dòng có cột Luồng con của eForm MS01 áp cho luồng con cùng đuôi của MS02 (MS01.01 ứng với MS02.01, MS01.02 với MS02.02, MS01.03 với MS02.03).

**Bước hệ thống, cổng** \[CẤU HÌNH\]: bước 6, 9 là tác vụ hệ thống của rà soát tồn kho, yêu cầu báo giá như MS01. Cổng sau bước 10 đọc giá trị của hồ sơ và ngưỡng hồ sơ giữ như MS01; với hồ sơ Điều chỉnh, giá trị của hồ sơ là Giá trị sau điều chỉnh chính thức. Bước 57 sinh BM-08 bằng năng lực sinh văn bản của HX-02 với mẫu bản điều chỉnh. Bước 61 chờ kết quả ký như MS01; Đã ký thì chạy tác vụ áp hiệu lực (Phần riêng). Người nhận bước 60 theo cùng quy tắc giao việc của MS01 (BR-DXMS-C-29), giá trị dùng là Giá trị sau điều chỉnh (BR-DXMS-09-12); bảng phân cấp không có khoảng chứa giá trị thì giao Thủ trưởng VHT. Hạn của từng bước theo mục 2.3.3, cột theo Giá trị sau điều chỉnh khi đã qua cổng sau bước 10; trước đó theo cột của hồ sơ căn cứ.

**Mẫu văn bản bản điều chỉnh** \[CẤU HÌNH\]: mẫu gắn với bước, eForm của MS02, khác mẫu cùng bước của MS01; trường trộn là khóa eForm và biến dieuChinh do HX-18 ghi ở bước 11, 12. BM-01, BM-09 (bước 11, 12, 27): mục Nội dung điều chỉnh, tiêu đề Tờ trình điều chỉnh đề xuất mua sắm. BM-03, BM-04, BM-05: đối tượng là hồ sơ điều chỉnh ĐXMS {Mã ĐXMS} lần {n}. BM-06 (bước 50): mục Nội dung điều chỉnh. BM-08 (bước 57, 58, 60): tiêu đề, Điều 1, Điều 2 như bảng Các bước.

**Phần riêng** \[RIÊNG\]:

- **Khối điều chỉnh** kiểu trường adjimpact (adjimpact, mục 2.4.1), đặc tả ở DTMS_CN_0173; tham số theo dòng eForm của bước.

- **Rà soát tồn kho của hồ sơ Điều chỉnh** (DTMS_CN_0142, DTMS_CN_0143): chạy khi hồ sơ là loại Điều chỉnh ĐXMS, không đọc mã bước. Dòng chỉ gồm hạng mục khác Bỏ; mỗi dòng có Kết quả cũ (cuAvail, cuDung) từ bản rà soát của hồ sơ căn cứ và Loại thay đổi (loaiThayDoi); Tồn khả dụng không trừ phần đã chốt của hồ sơ căn cứ (BR-DXMS-03-02).

- **Yêu cầu báo giá của hồ sơ Điều chỉnh** (DTMS_CN_0145): chỉ hạng mục khác Bỏ có Còn phải mua lớn hơn 0; yêu cầu, báo giá của hồ sơ căn cứ không chuyển sang.

- **Ngày báo giá** của hồ sơ Điều chỉnh: mã kiểm tra KT-21 (mục 2.5.2), tham số ngày mốc là ngày tạo hồ sơ.

- **Dữ liệu điều chỉnh cho mẫu văn bản**: mã hậu xử lý HX-18 (mục 2.5.3), ghi biến dieuChinh từ cùng nguồn tính so sánh, tác động của DTMS_CN_0173.

- **Áp hiệu lực sau điều chỉnh**: tác vụ hệ thống trên BPMN MS02, chạy sau kết quả Đã ký của bước 61, trước sự kiện kết thúc: áp BR-DXMS-09-09 và gửi thông báo trong hệ thống cho Người phụ trách hồ sơ và TTMS. Hồ sơ kết thúc ở STOPPED hoặc CANCELED thì xử lý kết thúc hồ sơ theo BR-DXMS-09-09 (ĐXMS về APPROVED, phiên bản có hiệu lực giữ nguyên, giải phóng tồn kho hồ sơ đang giữ); xử lý này đọc loại hồ sơ, không đọc mã bước.

**Hành động** \[CẤU HÌNH\]. Trình tự chung theo mục 2.5; bảng chỉ ghi luật MS02\_… có phần khác luật cùng đuôi mã của MS01:

| Luật | Kiểm tra trước hành động | Kết quả khi thành công |
|----|----|----|
| MS02_T10_XAC_NHAN (Báo giá đạt) | Như luật cùng đuôi mã của MS01. KT-21: mọi báo giá được tính có Ngày báo giá từ ngày tạo hồ sơ trở về sau. KT-19: tác động tính theo cơ sở giá đang chốt có Chuyển ngưỡng hoặc Giảm dưới số đã ký thì Đã xem tác động điều chỉnh được chọn | Như MS01: yêu cầu PASSED, cơ sở giá chốt; Giá trị sau điều chỉnh chính thức (BR-DXMS-09-05). Cổng sau bước 10 rẽ theo giá trị này, ghi Luồng (BR-DXMS-09-01) |
| MS02_T11_GUI_DUYET, MS02_T12_GUI_DUYET (Gửi chỉ huy duyệt) | Như luật cùng đuôi mã của MS01 (KT-06) | Như MS01; HX-18 ghi dieuChinh sau HX-05, trước HX-02; HX-02 sinh Tờ trình bản điều chỉnh, Phụ lục chi phí, Checklist theo luồng con MS02 |
| MS02_T27_GUI_DUYET (Gửi hồ sơ hoàn chỉnh cho CQCM) | Như MS01 | Như MS01; HX-02 sinh văn bản bản điều chỉnh theo luồng con MS02 |
| MS02_T36_TRINH_KY (Xác nhận ký BM-04 và Checklist) | Như MS01 | Như MS01; văn bản ký theo luồng con MS02: Checklist 01, MS02.03 là Checklist 02 |
| MS02_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn) | KT-05: gợi ý là Không thì Lý do có giá trị. Gợi ý xét trên văn bản căn cứ của hồ sơ Điều chỉnh tại bước 48 và Giá trị sau điều chỉnh (BR-DXMS-09-11) | Biến đặt reportTD = true, luồng con MS02.01. HX-01 như MS01. Sang bước 49 |
| MS02_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn) | KT-05: gợi ý là Có thì Lý do có giá trị | Biến đặt reportTD = false, luồng con MS02.02. HX-01 như MS01. Sang bước 57 |
| MS02_T60_PHE_DUYET (Phê duyệt) | — | Như MS01; HX-02, HX-03 trình ký BM-08 bản điều chỉnh (MS02.01, .02) hoặc ô PHÊ DUYỆT trên BM-09 bản điều chỉnh (MS02.03). Sang bước 61 |
| MS02_T60_TRA_LAI_2 (Chỉ đạo khác — kết thúc) | Như MS01 | Biến đặt chiDaoKhac = true; hồ sơ STOPPED; ĐXMS về APPROVED, phiên bản có hiệu lực giữ nguyên, tồn kho hồ sơ đang giữ được giải phóng (BR-DXMS-09-09) |

Luật MS02\_… khác chạy như luật cùng đuôi mã của MS01 ở DTMS_CN_0161–DTMS_CN_0170.

##### 3.1.9.5.4 Luồng nghiệp vụ

**Luồng chính MS02.03:** 6 → 7 → 8 → 9 → 10 (dưới ngưỡng) → 11 → 13 → … → 37 → 38 ‖ 39 → 40 → 60 → 61, theo mục 7.1, 7.2.

**Luồng chính MS02.01, MS02.02:** 6 → … → 10 (từ ngưỡng) → 12 → 13 → … → 47 → 48: Có → 49–56 → 57 (MS02.01); Không → 57 (MS02.02) → 58 → 59 → 60 → 61.

**Luồng thay thế:** các nhánh trả lại, vòng xử lý, họp, ký lại, từ chối ký như nghiệp vụ 3.1.8. Hồ sơ đã qua cổng sau bước 10 không đổi luồng giữa MS02.03 và MS02.01, .02.

**Thông báo kiểm tra dữ liệu và xử lý ngoại lệ:** ngoài ngoại lệ chung của mục 3.1.8:

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bước 10 có báo giá ngày trước ngày tạo hồ sơ | KT-21, inline tại dòng: "Báo giá phải có ngày từ {ngày tạo hồ sơ} trở về sau." Công việc giữ nguyên |
| Bước 48 bấm nút khác gợi ý, bỏ trống Lý do | KT-05, inline: "Vui lòng nhập Lý do." Công việc giữ nguyên |
| Bước 10 có tác động phải xem, chưa chọn | KT-19, inline: "Vui lòng xem và chọn Đã xem tác động điều chỉnh." Công việc giữ nguyên |
| Bảng phân cấp không có khoảng chứa Giá trị sau điều chỉnh | Công việc bước 60 giao Thủ trưởng VHT theo BR-DXMS-09-12 |

**Đồng thời:** như nghiệp vụ 3.1.8. Hồ sơ Phê duyệt không thể chạy cùng lúc với hồ sơ Điều chỉnh của cùng ĐXMS (BR-DXMS-C-02).

##### 3.1.9.5.5 Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0175-01 | Hồ sơ căn cứ có kết quả rà soát dùng từ kho 6; Tồn khả dụng mới 4, SL đề xuất 10 | Mở form bước 7 | Có cột Kết quả cũ "dùng từ kho 6"; ô Dùng từ kho mặc định 4 theo BR-DXMS-03-03, sửa được |
| AC-0175-02 | Hạng mục Bỏ ở bước 5 | Bước 6, 8 chạy | Không có dòng của hạng mục đó trong yêu cầu rà soát, yêu cầu báo giá |
| AC-0175-03 | Báo giá ngày 15/09/2026, hồ sơ tạo 01/10/2026 | Bước 10 bấm nút của luật MS02_T10_XAC_NHAN (Báo giá đạt), \[Xác nhận\] | Nút vẫn hiện; bị chặn bởi KT-21, báo lỗi tại dòng; công việc giữ nguyên |
| AC-0175-04 | Bước 10 PASSED, Tổng 150 tỷ, ngưỡng 160 | Qua cổng | Sang bước 11, Luồng MS02.03 |
| AC-0175-05 | Hồ sơ căn cứ MS01.03 152 tỷ; căn cứ của hồ sơ Điều chỉnh có Kế hoạch SXKD hằng năm; bước 10 PASSED 172 tỷ | Qua cổng | Sang bước 12, Luồng "MS02.01 (dự kiến)" |
| AC-0175-06 | Bước 12 hoàn tất | Xem BM-01 | Có mục Nội dung điều chỉnh, tiêu đề Tờ trình điều chỉnh đề xuất mua sắm |
| AC-0175-07 | Bước 48, gợi ý Không | TTMS nhập Lý do, bấm nút của luật MS02_T48_XAC_NHAN (Có báo cáo TGĐ Tập đoàn), \[Xác nhận\] | Sang bước 49, Luồng MS02.01 |
| AC-0175-08 | Bước 48, gợi ý Có | TTMS bấm nút của luật MS02_T48_XAC_NHAN_2 (Không báo cáo TGĐ Tập đoàn), bỏ trống Lý do | Bị chặn bởi KT-05: "Vui lòng nhập Lý do."; công việc giữ nguyên |
| AC-0175-09 | Bước 58 hồ sơ MS02.02 | Xem BM-08 | Tiêu đề Quyết định phê duyệt điều chỉnh, Điều 1 có văn bản phê duyệt cũ và nội dung trước → sau |
| AC-0175-10 | Bước 61 Đã ký, Giá trị sau điều chỉnh 150 tỷ | Kết quả ký về | Hồ sơ COMPLETED; ĐXMS APPROVED, điều chỉnh lần 1, Giá trị hiệu lực 150; Hồ sơ căn cứ "Đã thay thế"; có thông báo |
| AC-0175-15 | Cùng Mã hàng: hồ sơ căn cứ đã chốt dùng từ kho 6; hồ sơ Điều chỉnh đã xác nhận bước 7, tạm giữ 4 | Xem Tồn khả dụng ở ĐXMS khác trước và sau khi bước 61 Đã ký | Trước: bị trừ 6 (số lớn hơn, BR-DXMS-03-02). Sau: phần 6 Đã giải phóng, phần 4 Đã chốt sử dụng, bị trừ 4; Tồn khả dụng tăng 2 |
| AC-0175-16 | Văn bản căn cứ còn 5 tỷ khi hoàn thành bước 5 của hồ sơ Điều chỉnh tăng 5 tỷ; sau đó ĐXMS khác dùng 3 tỷ | Mở form bước 60 | Có cảnh báo văn bản đã dùng vượt 3 tỷ đồng; vẫn Phê duyệt được |
| AC-0175-11 | Bước 60, Người có thẩm quyền nhập Lý do | Bấm nút của luật MS02_T60_TRA_LAI_2 (Chỉ đạo khác — kết thúc), đồng ý ở câu xác nhận | Hồ sơ STOPPED; ĐXMS APPROVED; Giá trị hiệu lực không đổi; tồn kho hồ sơ đang giữ được giải phóng |
| AC-0175-12 | Hồ sơ Điều chỉnh MS02.03, Phó TGĐ không đồng ý BM-09 | Đủ hai nhánh | Về bước 25 như BR-DXMS-08-07 |
| AC-0175-13 | Hồ sơ căn cứ đã qua 3 vòng | Hồ sơ Điều chỉnh tới bước 29 lần đầu | Vòng xử lý là 1 |
| AC-0175-14 | Luật MS02_T10_XAC_NHAN kích hoạt; cơ sở giá đang chốt 150 tỷ, hồ sơ căn cứ MS01.02 210,5 tỷ, ngưỡng 160; chưa chọn Đã xem tác động điều chỉnh | Bấm nút của luật, \[Xác nhận\] | Nút vẫn hiện; bị chặn bởi KT-19: "Vui lòng xem và chọn Đã xem tác động điều chỉnh."; công việc giữ nguyên |
| AC-0175-17 | Luật MS01_T13_XAC_NHAN gắn KT-03; luật MS02_T13_XAC_NHAN không có dòng riêng | CH bấm nút của luật MS02_T13_XAC_NHAN (Đồng ý) khi còn phần Không đạt | Bị chặn bởi KT-03 như quy trình phê duyệt: "Còn phần Không đạt, không thể đồng ý." |
| AC-0175-18 | Thêm một trường vào eForm dtms-ms01-t13-chi-huy-duyet | Mở bước 13 của hồ sơ Điều chỉnh | Có trường mới nhờ dòng kế thừa của dtms-ms02-t13-chi-huy-duyet; không sửa eForm MS02, không sửa mã nguồn (AC-CH-03) |
| AC-0175-19 | Hồ sơ Điều chỉnh ở bước 20 và bước 19 | Mở form của hai bước | Cả hai có dòng đầu điều chỉnh; chỉ bước 19 có \[Xem so sánh trước – sau\] (tham số của khối adjimpact) |
| AC-0175-20 | Hồ sơ Điều chỉnh MS02.03 ở bước 36 | Mở form, bấm nút của luật MS02_T36_TRINH_KY | Văn bản ký là BM-04 ký lại và Checklist 02 theo luồng con MS02.03 |

# 4. THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG

Chương này quy định các thành phần, kịch bản dùng chung cho mọi chức năng ở mục 3. Chức năng chỉ mô tả phần riêng; phần không mô tả thì áp dụng chương này. Khi chức năng quy định khác, áp dụng quy định của chức năng. Quy tắc nghiệp vụ chung của module ở mục 2.3.4.

## 4.1 Trường điều khiển dùng chung

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
| Button – hành động phụ | Hủy, Không, Đặt lại, Đóng, quay lại. Không đổi dữ liệu nghiệp vụ. \[Hủy\] trên màn Thêm mới, Chỉnh sửa: chưa nhập gì thì đóng; đã nhập thì hỏi xác nhận bằng hộp thoại Hủy thay đổi. |
| Icon Button | Mỗi icon một thao tác xác định (Xem, Chỉnh sửa, Xóa, Tải xuống…). Di chuột hiện tooltip tên thao tác. Thao tác trên đúng bản ghi được chọn. Hiện hay ẩn theo phân quyền và điều kiện nghiệp vụ; không có thao tác nào thì ô trống. |
| Link | Mở màn chi tiết hoặc tệp của đúng bản ghi. Hiện dạng liên kết. |
| Label, Text | Hiển thị tiêu đề, tên trường, dữ liệu chỉ đọc. Không sửa trực tiếp. Không có giá trị thì hiện "-". Nội dung dài theo mục 4.2. |
| Tag, Badge | Hiển thị trạng thái hoặc phân loại. Màu, nhãn theo bộ trạng thái của mục 2.3.1. |
| Tooltip | Bổ sung thông tin cho control, icon, nội dung bị rút gọn. Nội dung bị cắt thì tooltip hiện đủ giá trị gốc. Ẩn khi rời vùng kích hoạt. |
| Trường bắt buộc | Có dấu \* cạnh tên trường. Không chấp nhận Null, rỗng, chỉ khoảng trắng. Không hợp lệ thì hiện lỗi tại trường, không lưu, không xác nhận. Trường bắt buộc có điều kiện ghi điều kiện tại mô tả trường. |
| File upload | Chọn tệp hoặc kéo thả. Định dạng cho phép: .doc, .docx, .xls, .xlsx, .pdf, trừ khi chức năng quy định hẹp hơn; tối đa 10 MB mỗi tệp; tên tệp tối đa 255 ký tự. Phía xử lý kiểm tra cả phần mở rộng và kiểu nội dung, từ chối tệp rỗng. Đang tải lên hiện tiến trình, không gửi lặp. Thành công: tải lại danh sách tài liệu, hiện Toast thành công. Thất bại: hiện lỗi theo mục 4.5, 4.6, giữ nguyên danh sách. |

## 4.2 Bảng danh sách dùng chung

### 4.2.1 Thông tin chung chức năng

- **Mục đích:** Quy định thống nhất cách hiển thị, xử lý dữ liệu dạng bảng trên các màn danh sách, lưới trong màn chi tiết và hộp thoại.

- **Phạm vi áp dụng:** Mọi chức năng dùng bảng để hiển thị tập bản ghi.

- **Tiền điều kiện:**

  - Người dùng đã mở chức năng có bảng.

  - Người dùng có quyền xem dữ liệu tương ứng.

- **Hậu điều kiện:**

  - Bảng hiển thị dữ liệu theo kết quả truy vấn và điều kiện hiện tại.

  - Trạng thái có dữ liệu, không có dữ liệu, đang tải, lỗi được hiển thị tương ứng.

### 4.2.2 Mô tả chi tiết các thành phần

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

### 4.2.3 Quy tắc hiển thị bảng

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

## 4.3 Kịch bản tìm kiếm và lọc dùng chung

### 4.3.1 Thông tin chung chức năng

- **Mục đích:** Thu hẹp dữ liệu hiển thị theo từ khóa và một hoặc nhiều điều kiện lọc.

- **Phạm vi áp dụng:** Màn danh sách, hộp thoại, vùng dữ liệu có tìm kiếm, lọc.

- **Tiền điều kiện:**

  - Người dùng đã mở chức năng có dữ liệu cần tra cứu.

  - Người dùng có quyền xem dữ liệu tương ứng.

- **Hậu điều kiện:**

  - Dữ liệu hiển thị theo điều kiện đã áp.

  - Phân trang tính lại theo tập kết quả mới.

### 4.3.2 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Từ khóa | Search box \[255\] | Input | Rỗng | Tìm trên các trường chức năng quy định. Luôn hiện, kể cả khi mở khối tìm kiếm nâng cao. |
| 2 | Điều kiện tìm kiếm nâng cao | Control theo chức năng | Input | Theo chức năng | Thu hẹp theo một hoặc nhiều tiêu chí. Cách đối sánh (Chứa, Bằng, Thuộc, khoảng Từ – Đến) ghi tại từng trường của chức năng. |
| 3 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\] | Button | Input | – | Mở, đóng khối điều kiện nâng cao. Đóng khối vẫn giữ điều kiện đã áp, bỏ giá trị đã nhập mà chưa áp; nút ghi kèm số điều kiện đang áp, ví dụ \[Tìm kiếm nâng cao (2)\]. |
| 4 | \[Tìm kiếm\] | Button | Input | – | Áp đồng thời từ khóa và mọi điều kiện đang nhập. Enter tại ô từ khóa tương đương. |
| 5 | \[Đặt lại\] | Button | Input | – | Xóa từ khóa, đưa điều kiện về giá trị khởi tạo, tải lại. |

### 4.3.3 Quy tắc tìm kiếm và lọc

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

## 4.4 Phân trang dùng chung

### 4.4.1 Thông tin chung chức năng

- **Mục đích:** Chia tập dữ liệu thành trang, cho chọn số bản ghi mỗi trang và chuyển trang.

- **Phạm vi áp dụng:** Bảng, danh sách có phân trang. Chức năng ghi "không phân trang" thì hiển thị toàn bộ.

- **Giá trị khởi tạo:** trang 1; 10 bản ghi mỗi trang.

- **Hậu điều kiện:** Danh sách hiển thị đúng dữ liệu của trang được chọn; thông tin phân trang cập nhật tương ứng.

### 4.4.2 Mô tả chi tiết các thành phần

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

### 4.4.3 Công thức tính

Quy ước: TotalRecord là tổng số bản ghi; PageSize là số bản ghi mỗi trang; CurrentPage là trang hiện tại; Position là vị trí bản ghi trong trang, bắt đầu từ 1.

| Nội dung          | Công thức                                            |
|-------------------|------------------------------------------------------|
| Tổng số trang     | TotalPage = CEILING(TotalRecord / PageSize)          |
| Số thứ tự bản ghi | STT = (CurrentPage − 1) × PageSize + Position        |
| Bản ghi bắt đầu   | StartRecord = (CurrentPage − 1) × PageSize + 1       |
| Bản ghi kết thúc  | EndRecord = MIN(CurrentPage × PageSize, TotalRecord) |

TotalRecord = 0: không có bản ghi; trang hiện tại là 1; không hiện số trang chọn được; mọi nút điều hướng khóa. Sau khi xóa bản ghi cuối cùng của trang cuối, CurrentPage lớn hơn TotalPage thì về trang TotalPage.

### 4.4.4 Quy tắc hiển thị

**Hiển thị số trang:** tổng số trang ≤ 5 thì hiện tất cả; lớn hơn 5 thì hiện trang hiện tại và các trang lân cận, dùng "..." cho khoảng bị ẩn; trang đầu, trang cuối luôn tới được bằng nút điều hướng.

**Trạng thái nút điều hướng:**

| Trạng thái | Trang đầu | Trang trước | Trang sau | Trang cuối |
|----|----|----|----|----|
| Không có dữ liệu | Khóa | Khóa | Khóa | Khóa |
| Trang đầu tiên | Khóa | Khóa | Mở nếu có hơn 1 trang | Mở nếu có hơn 1 trang |
| Trang giữa | Mở | Mở | Mở | Mở |
| Trang cuối cùng | Mở nếu có hơn 1 trang | Mở nếu có hơn 1 trang | Khóa | Khóa |

**Giữ điều kiện khi chuyển trang:** giữ từ khóa, điều kiện lọc, số bản ghi mỗi trang, thứ tự sắp xếp; chỉ đổi trang truy vấn.

## 4.5 Kiểm tra dữ liệu và thông báo lỗi dùng chung

### 4.5.1 Thông tin chung

- **Mục đích:** Bảo đảm dữ liệu đầu vào đúng ràng buộc trước khi lưu hoặc xử lý nghiệp vụ.

- **Phạm vi áp dụng:** Trường nhập, form Thêm mới, Chỉnh sửa, hộp thoại xử lý bước, hộp thoại có nhập liệu.

- **Nguyên tắc:**

  - Kiểm tra trước khi xử lý nghiệp vụ.

  - Lỗi chỉ rõ trường và nguyên nhân.

  - Không xóa dữ liệu người dùng đã nhập khi kiểm tra không đạt.

  - Còn lỗi thì không lưu, không chuyển bước.

### 4.5.2 Nguyên tắc kiểm tra dữ liệu

- Phía giao diện kiểm tra trước khi gửi: bắt buộc, độ dài, định dạng, miền giá trị.

- Phía xử lý kiểm tra lại khi nhận yêu cầu: tính duy nhất, sự tồn tại của dữ liệu tham chiếu, trạng thái bản ghi, quyền, quy tắc nghiệp vụ.

- Form có nhiều trường lỗi: hiện lỗi tại mọi trường xác định được, không bắt người dùng sửa từng lỗi rồi gửi lại mới biết lỗi tiếp theo. Phía xử lý trả nhiều lỗi thì hiện lỗi tại từng trường tương ứng.

- Dữ liệu không hợp lệ: không lưu, giữ form, giữ dữ liệu đã nhập, hiện lỗi tại trường.

- Trường đã sửa thành hợp lệ thì ẩn lỗi của trường đó.

- Kiểm tra lại toàn bộ khi người dùng xác nhận lưu, kể cả trường đã kiểm tra trước đó.

### 4.5.3 Quy tắc hiển thị lỗi tại trường

| Nội dung        | Quy tắc                                         |
|-----------------|-------------------------------------------------|
| Vị trí          | Ngay dưới trường lỗi                            |
| Hình thức       | Inline Message, màu lỗi theo thiết kế giao diện |
| Trường lỗi      | Có trạng thái hiển thị khác trường hợp lệ       |
| Thời điểm hiện  | Khi xác định trường không hợp lệ                |
| Thời điểm ẩn    | Khi giá trị được sửa và hợp lệ                  |
| Nhiều lỗi       | Hiện đồng thời tại các trường                   |
| Dữ liệu đã nhập | Không bị xóa                                    |

### 4.5.4 Các trường hợp kiểm tra dùng chung

| STT | Trường hợp | Điều kiện | Nội dung thông báo |
|----|----|----|----|
| 1 | Chưa nhập trường bắt buộc | Null, rỗng, chỉ khoảng trắng | "Vui lòng nhập {Tên trường}." |
| 2 | Chưa chọn trường bắt buộc | Trường lựa chọn, tải tệp chưa có giá trị hợp lệ | "Vui lòng chọn {Tên trường}." |
| 3 | Vượt độ dài tối đa | Nhập hoặc dán vượt độ dài của trường | Chỉ ghi nhận phần trong giới hạn; "Không được nhập quá {maxlength} ký tự." |
| 4 | Sai định dạng | Không đúng định dạng quy định | Câu cụ thể tại chức năng; không có thì "{Tên trường} không hợp lệ." |
| 5 | Trùng dữ liệu | Trường yêu cầu duy nhất đã tồn tại | "{Tên trường} đã tồn tại." |
| 6 | Giá trị không còn hợp lệ | Giá trị tham chiếu đã xóa, ngừng sử dụng hoặc không còn đáp ứng điều kiện chọn | Câu cụ thể theo đối tượng tại chức năng; không lưu |

### 4.5.5 Thông báo sai định dạng

Trường có định dạng cụ thể thì ưu tiên câu nêu rõ điều kiện hợp lệ, ví dụ "Ngày tạo từ không được lớn hơn Ngày tạo đến.". Câu cụ thể ghi tại trường của chức năng. Chương này chỉ quy định cách kiểm tra và cách hiện lỗi, không áp một định dạng chung cho mọi trường.

### 4.5.6 Kiểm tra tính duy nhất

Chỉ áp cho trường chức năng quy định là duy nhất; không mặc định mọi trường đều duy nhất.

- **Thêm mới:** kiểm tra giá trị đã tồn tại; đã tồn tại thì không lưu, hiện lỗi tại trường.

- **Chỉnh sửa:** trường duy nhất được phép sửa thì kiểm tra với bản ghi khác, loại trừ chính bản ghi đang sửa; trùng thì không cập nhật.

- Câu thông báo: "{Tên trường} đã tồn tại."

- Mã do hệ thống sinh (Mã ĐXMS, mã hồ sơ, mã yêu cầu báo giá…) không qua kiểm tra này; tính duy nhất do cách sinh mã bảo đảm.

### 4.5.7 Xử lý lỗi trả về từ phía xử lý

| Trường hợp | Cách xử lý |
|----|----|
| Lỗi gắn một trường | Inline Message tại trường |
| Nhiều trường cùng lỗi | Hiện đồng thời tại các trường |
| Lỗi nghiệp vụ không gắn trường | Thông báo chung theo mục 4.6, câu cụ thể tại chức năng |
| Bản ghi không còn tồn tại | Không lưu; "{Đối tượng} không còn tồn tại."; tải lại dữ liệu khi cần |
| Không còn quyền | Không đổi dữ liệu; "Bạn không có quyền thực hiện chức năng này." |
| Lỗi hệ thống, mất kết nối, timeout | Không coi là thành công; giữ dữ liệu trên form; hiện lỗi theo mục 4.6 |

## 4.6 Thông báo chung và trạng thái xử lý

### 4.6.1 Thông tin chung

- **Mục đích:** Chuẩn hóa cách phản hồi kết quả, trạng thái của thao tác.

- **Phạm vi áp dụng:** Chức năng có tải dữ liệu, gửi yêu cầu xử lý, cần phản hồi kết quả.

- **Nguyên tắc:**

  - Thông báo phản ánh đúng kết quả thực tế.

  - Không báo thành công khi hệ thống chưa xác nhận thành công.

  - Lỗi đủ rõ để người dùng biết thao tác chưa xong và việc cần làm tiếp.

  - Lỗi tại trường theo mục 4.5; không dùng Toast thay cho lỗi xác định được tại một trường.

### 4.6.2 Các hình thức thông báo

| STT | Loại | Phạm vi sử dụng | Quy tắc |
|----|----|----|----|
| 1 | Toast thành công | Thao tác đã hoàn tất | Hiện sau khi hệ thống xác nhận thành công; nêu rõ hành động, đối tượng |
| 2 | Toast lỗi | Lỗi không gắn một trường | Lỗi hệ thống, quyền, trạng thái dữ liệu, nghiệp vụ chung |
| 3 | Toast cảnh báo, thông tin | Cần lưu ý nhưng thao tác không thất bại | Nêu rõ trạng thái hoặc lưu ý |
| 4 | Inline Message | Lỗi tại trường | Theo mục 4.5 |
| 5 | Empty State | Không có dữ liệu | Hiện tại vùng dữ liệu, không dùng Toast |
| 6 | Error State | Không tải được một vùng | Hiện tại vùng lỗi, có thao tác thử lại khi nghiệp vụ cho phép |
| 7 | Hộp thoại xác nhận | Thao tác không hoàn tác được hoặc làm mất dữ liệu đang nhập | Tiêu đề, nội dung, hai nút; nội dung cụ thể tại chức năng |

### 4.6.3 Quy tắc nội dung thông báo

Cấu trúc: {Kết quả hoặc Hành động} + {Đối tượng} + {thông tin bổ sung nếu cần}. {Đối tượng} là tên đối tượng nghiệp vụ, ví dụ ĐXMS, hồ sơ, yêu cầu báo giá.

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
| Dữ liệu đã bị người khác thay đổi | "Dữ liệu đã có sự thay đổi trên hệ thống. Vui lòng làm mới dữ liệu và thử lại." |
| Hủy khi đã nhập dữ liệu | Hộp thoại tiêu đề "Hủy thay đổi", nội dung "Các thay đổi chưa lưu sẽ bị mất. Bạn có chắc chắn muốn thoát?", nút \[Ở lại\], \[Rời khỏi\] |

### 4.6.4 Trạng thái xử lý dùng chung

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

### 4.6.5 Quy tắc Loading

- Hiện ngay khi bắt đầu thao tác có thời gian chờ đáng kể.

- Phạm vi Loading theo phạm vi dữ liệu: cả nội dung chính, vùng bảng, hoặc một thành phần. Ưu tiên theo vùng thay vì khóa toàn màn.

- Khi Loading, khóa thao tác có thể tạo yêu cầu trùng.

- Kết thúc khi có kết quả thành công, lỗi, timeout hoặc trạng thái kết thúc khác. Không để Loading tồn tại khi yêu cầu đã thất bại.

### 4.6.6 Quy tắc chống thao tác lặp

Khi một thao tác thay đổi dữ liệu đang xử lý:

- Không cho bấm lại nút xác nhận; không gửi nhiều yêu cầu giống nhau từ một thao tác.

- Không cho thao tác khác gây xung đột trên cùng đối tượng khi chưa có kết quả.

- Có kết quả thì đưa control về trạng thái theo dữ liệu hiện tại.

- Form Thêm mới, Chỉnh sửa, hộp thoại xử lý bước: mỗi lần mở có một mã yêu cầu; gửi lại cùng mã không tạo hoặc cập nhật lần hai. Kết quả của lần gửi lại mô tả tại chức năng.

Áp cho Lưu, Xóa, Bật/Tắt, Xác nhận bước, Trình ký, Thử lại, Gửi lại.

### 4.6.7 Xử lý kết quả thao tác thay đổi dữ liệu

| Kết quả | Cách xử lý |
|----|----|
| Thành công | Toast thành công; cập nhật dữ liệu liên quan; đóng form hoặc hộp thoại nếu luồng yêu cầu |
| Kiểm tra dữ liệu không đạt | Không gửi hoặc dừng; Inline Message theo mục 4.5 |
| Lỗi nghiệp vụ | Không cập nhật; câu lỗi cụ thể tại chức năng |
| Không có quyền | Không thay đổi; "Bạn không có quyền thực hiện chức năng này." |
| Bản ghi đã đổi, đã xóa | Không cập nhật trên dữ liệu cũ; thông báo, tải lại dữ liệu |
| Lỗi hệ thống | Không xác nhận thành công; Toast lỗi |
| Timeout, mất kết nối | Không xác nhận thành công; giữ form để kiểm tra hoặc thực hiện lại; tải lại để biết kết quả thật khi cần |

## 4.7 Xóa bản ghi dùng chung

### 4.7.1 Thông tin chung chức năng

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

### 4.7.2 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Biểu tượng cảnh báo | Icon | Output | Theo thiết kế | Cho biết đây là thao tác loại bỏ dữ liệu |
| 2 | Tiêu đề | Label | Output | "Xóa {Đối tượng}" | Thể hiện rõ đây là thao tác xóa |
| 3 | Nội dung xác nhận | Label | Output | Theo bản ghi được chọn | "Bạn có chắc chắn muốn xóa {Đối tượng} {Tên} - {Mã} không? Thao tác này không thể hoàn tác." Tên, Mã được nhấn mạnh. Đối tượng không có Tên thì chỉ ghi Mã. Câu riêng, nếu có, ghi tại chức năng |
| 4 | \[Hủy\] | Button | Input | – | Đóng hộp thoại, không xóa; danh sách giữ nguyên |
| 5 | \[Xóa\] | Button | Input | – | Kiểm tra lại quyền, sự tồn tại, điều kiện được xóa rồi xóa đúng bản ghi đã chọn. Khóa nút trong khi xử lý |

### 4.7.3 Quy tắc xác định bản ghi xóa

| Quy tắc | Mô tả |
|----|----|
| Đúng bản ghi | Thao tác Xóa gắn với định danh bản ghi của dòng được chọn |
| Hiện để đối chiếu | Hộp thoại hiện Tên và Mã để người dùng kiểm tra |
| Không đổi đối tượng | Xác nhận áp đúng bản ghi đã chọn khi mở hộp thoại |
| Dữ liệu đã thay đổi | Dùng dữ liệu tại thời điểm xác nhận để xét điều kiện được xóa |

### 4.7.4 Quy tắc kiểm tra trước khi xóa

| Nhóm kiểm tra | Xử lý |
|----|----|
| Quyền | Không còn quyền thì không xóa, "Bạn không có quyền thực hiện chức năng này." |
| Sự tồn tại | Bản ghi không còn hoặc đã bị xóa thì không xóa lại, "{Đối tượng} không còn tồn tại.", tải lại danh sách |
| Ràng buộc nghiệp vụ | Bản ghi đang được dùng hoặc không đủ điều kiện thì không xóa, hiện câu nguyên nhân của chức năng |
| Hợp lệ | Chỉ xóa khi mọi điều kiện đạt |

### 4.7.5 Quy tắc xử lý sau khi xóa

- **Thành công:** đóng hộp thoại; Toast "Xóa {Đối tượng} thành công."; tải lại danh sách theo từ khóa, điều kiện lọc, số bản ghi mỗi trang hiện tại; cập nhật tổng số bản ghi, phân trang (mục 4.4.3).

- **Không thành công:** dữ liệu không đổi; hiện lỗi; giữ điều kiện tìm kiếm, lọc; cho thực hiện lại nếu nguyên nhân cho phép.

### 4.7.6 Các trường hợp xử lý

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

## 4.8 Bật/Tắt trạng thái dùng chung

### 4.8.1 Thông tin chung chức năng

- **Mục đích:** Đổi trạng thái hoạt động của bản ghi mà không xóa dữ liệu.

- **Phạm vi áp dụng:** Chức năng có Toggle đổi trạng thái trực tiếp. Module ĐXMS hiện không có chức năng dùng Toggle; trạng thái ĐXMS, hồ sơ, văn bản suy từ tiến trình (mục 2.3.1), không bật tắt tay. Mục này áp khi module sau này có danh mục, cấu hình cần bật tắt.

- **Người dùng mục tiêu:** Người có quyền cập nhật trạng thái đối tượng.

- **Tiền điều kiện:**

  - Bản ghi còn tồn tại.

  - Người dùng có quyền cập nhật trạng thái.

  - Bản ghi đáp ứng điều kiện đổi trạng thái của chức năng.

- **Hậu điều kiện:**

  - Trạng thái mới được lưu, Toggle hiện đúng trạng thái mới.

  - Danh sách cập nhật; nhật ký ghi theo mục 2.3.5.

### 4.8.2 Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Trạng thái | Toggle Switch | Input/Output | Theo trạng thái hiện tại | Bật là Đang hoạt động, Tắt là Ngừng hoạt động. Đổi Toggle thì chưa cập nhật, hiện hộp thoại xác nhận |
| 2 | Tiêu đề | Label | Output | Theo trạng thái cần chuyển | Đang hoạt động thì "Ngừng hoạt động"; Ngừng hoạt động thì "Kích hoạt" |
| 3 | Nội dung xác nhận | Label | Output | Theo bản ghi được chọn | Theo mục 4.8.4; tên bản ghi được nhấn mạnh |
| 4 | \[Không\] | Button | Input | – | Đóng hộp thoại, không cập nhật, Toggle về trạng thái trước |
| 5 | \[Có\] | Button | Input | – | Kiểm tra lại quyền, sự tồn tại, trạng thái hiện tại, điều kiện nghiệp vụ rồi cập nhật. Khóa nút trong khi xử lý |

### 4.8.3 Quy tắc xác định trạng thái

| Trạng thái hiện tại | Thao tác   | Trạng thái mới  | Tiêu đề hộp thoại |
|---------------------|------------|-----------------|-------------------|
| Đang hoạt động      | Tắt Toggle | Ngừng hoạt động | Ngừng hoạt động   |
| Ngừng hoạt động     | Bật Toggle | Đang hoạt động  | Kích hoạt         |

### 4.8.4 Quy tắc nội dung xác nhận

- Sang Ngừng hoạt động: "Bạn có chắc chắn muốn ngừng hoạt động {Đối tượng}: {Tên đối tượng} không?"

- Sang Đang hoạt động: "Bạn có chắc chắn muốn kích hoạt {Đối tượng}: {Tên đối tượng} không?"

- Tên không đủ nhận diện duy nhất thì ghi kèm Mã.

### 4.8.5 Kiểm tra trước khi cập nhật trạng thái

| Nhóm kiểm tra | Cách xử lý |
|----|----|
| Quyền | Không còn quyền thì không cập nhật, thông báo không có quyền |
| Sự tồn tại | Bản ghi không còn thì không cập nhật, thông báo, tải lại |
| Trạng thái hiện tại | Xét trạng thái thực tế tại thời điểm xác nhận, không theo dữ liệu cũ trên màn |
| Ràng buộc nghiệp vụ | Không được đổi thì không cập nhật, hiện câu nguyên nhân của chức năng |

### 4.8.6 Quy tắc xử lý Toggle

- Trước khi xác nhận: hiện hộp thoại; trạng thái mới chưa được coi là đã cập nhật; không phát sinh thay đổi dữ liệu.

- Chọn \[Không\]: đóng hộp thoại, không cập nhật, Toggle về trạng thái ban đầu.

- Chọn \[Có\]: kiểm tra theo mục 4.8.5; hợp lệ thì gửi yêu cầu; khóa nút trong khi xử lý.

### 4.8.7 Quy tắc xử lý kết quả

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

## 4.9 Phân hệ dùng lại

Việc của tôi và xử lý công việc, E-form và sinh văn bản, Ma trận hành động và giám sát tiến trình, Mẫu thông báo và chuông thông báo dùng lại thiết kế của các phân hệ tương ứng; danh sách và chức năng dẫn chiếu ở mục 2.2, không mô tả lại tại đây.

# 5. THIẾT KẾ CƠ SỞ DỮ LIỆU

## 5.1 Cơ sở dữ liệu module Quản lý đề xuất mua sắm

### 5.1.1 Mô hình dữ liệu

Hệ thống sử dụng các thành phần lưu trữ sau:

- **MariaDB:** lưu dữ liệu nghiệp vụ của module: ĐXMS, hồ sơ, phiên bản, căn cứ, hạng mục, rà soát tồn kho, yêu cầu báo giá, thẩm định, ý kiến, họp, trình ký. Cấu trúc bảng quản lý bằng Liquibase, cùng cơ chế với các service hiện có.

- **Kho tệp MinIO:** lưu nội dung tệp (văn bản căn cứ, tài liệu kỹ thuật, báo giá, văn bản đầu ra, biên bản, tệp đã ký). Bảng nghiệp vụ chỉ lưu mã tệp file_id.

- **Dịch vụ nhật ký dùng chung:** lưu nhật ký thao tác theo mục 2.3.5, không lưu trong các bảng dưới.

- **Camunda:** lưu tiến trình, bước, công việc của hồ sơ. Bảng profile lưu khóa tiến trình để liên kết; trạng thái, giai đoạn hồ sơ suy từ tiến trình theo mục 2.3.1, không có bảng trạng thái riêng.

- **Danh mục dùng chung:** đơn vị, người dùng, nhiệm vụ / đề tài, dự án, nguồn vốn, loại hàng hóa, đơn vị tính, loại tiền, nhà cung cấp do phân hệ Danh mục và hệ thống người dùng quản lý; module chỉ lưu mã tham chiếu.

Mô hình thực thể liên kết như các hình dưới:

Hình 1. ĐXMS, hồ sơ, văn bản:

<img src="media/rId553.png" style="width:6.25in;height:17.61853in" alt="Mô hình thực thể liên kết: ĐXMS, hồ sơ, văn bản" />

Hình 2. Căn cứ, hạng mục, rà soát tồn kho, báo giá:

<img src="media/rId556.png" style="width:6.25in;height:7.15315in" alt="Mô hình thực thể liên kết: căn cứ, hạng mục, tồn kho, báo giá" />

Hình 3. Thẩm định, ý kiến, họp, báo cáo:

<img src="media/rId559.png" style="width:6.25in;height:5.54556in" alt="Mô hình thực thể liên kết: thẩm định, ý kiến" />

Mũi tên đi từ bảng con tới bảng cha theo khóa ngoại. Bảng profile, profile_version, profile_doc lặp lại ở nhiều hình để nối các nhóm. Hình chỉ ghi các cột chính; đủ cột xem mục 5.1.2.

Các bảng dữ liệu như sau:

| STT | Table | Loại | Mô tả |
|----|----|----|----|
| 1 | proposal | MariaDB | ĐXMS (luồng): đối tượng cha, tạo cùng hồ sơ Phê duyệt đầu tiên (BR-DXMS-01-11) |
| 2 | profile | MariaDB | Hồ sơ Phê duyệt hoặc Điều chỉnh của ĐXMS; mỗi hồ sơ một tiến trình |
| 3 | profile_version | MariaDB | Phiên bản hồ sơ v1, v2… (BR-DXMS-06-07) |
| 4 | profile_doc | MariaDB | Văn bản đầu ra sinh theo bước, gắn phiên bản |
| 5 | profile_file | MariaDB | Tài liệu đầu vào, tệp tải lên của hồ sơ |
| 6 | step_file | MariaDB | Văn bản tải lên tại một bước, gồm văn bản ghi nhận thay |
| 7 | sign_request | MariaDB | Một lần trình ký một văn bản (BR-DXMS-C-21) |
| 8 | basis_doc | MariaDB | Văn bản căn cứ đã khai báo, dùng chung giữa các ĐXMS |
| 9 | basis_line | MariaDB | Dòng của văn bản căn cứ |
| 10 | profile_basis | MariaDB | Văn bản căn cứ hồ sơ đang dùng |
| 11 | proposal_item | MariaDB | Hạng mục mua sắm của hồ sơ |
| 12 | stock_review | MariaDB | Bản rà soát tồn kho (BR-DXMS-03-07) |
| 13 | stock_review_line | MariaDB | Dòng rà soát theo hạng mục, phần tạm giữ |
| 14 | quotation | MariaDB | Yêu cầu báo giá |
| 15 | quotation_item | MariaDB | Hạng mục của yêu cầu báo giá, cơ sở giá |
| 16 | quotation_vendor | MariaDB | Nhà cung cấp được gửi yêu cầu |
| 17 | quote | MariaDB | Báo giá nhận về của một nhà cung cấp |
| 18 | quote_line | MariaDB | Đơn giá từng hạng mục trong báo giá |
| 19 | vendor | MariaDB, danh mục dùng chung | Nhà cung cấp; chỉ liệt kê trường module dùng |
| 20 | draft | MariaDB | Nội dung dự thảo BM-01 hoặc BM-09 theo phiên bản |
| 21 | draft_review | MariaDB | Kết quả duyệt từng phần của Chỉ huy đơn vị, phản hồi của đơn vị đề xuất |
| 22 | appraisal_round | MariaDB | Lần thẩm định (BR-DXMS-07-01) |
| 23 | appraisal_confirm | MariaDB | Các lần TTMS xác nhận, trả lại danh sách CQCM (BR-DXMS-07-02) |
| 24 | appraisal_agency | MariaDB | CQCM của một lần thẩm định |
| 25 | bm04 | MariaDB | Phiếu thẩm định BM-04 của một CQCM |
| 26 | bm04_item | MariaDB | Mục đánh giá trên BM-04 |
| 27 | opinion | MariaDB | Dòng ý kiến cần xử lý (BR-DXMS-07-05) |
| 28 | opinion_check | MariaDB | Kết quả CQCM kiểm tra lại dòng ý kiến ở bước 35 |
| 29 | meeting | MariaDB | Cuộc họp, kết luận (BR-DXMS-07-09) |
| 30 | bm05_item | MariaDB | Mục nội dung BM-05 |
| 31 | bm06 | MariaDB | Thông tin chung BM-06 |
| 32 | bm06_item | MariaDB | Mục nội dung BM-06 |
| 33 | group_report | MariaDB | Báo cáo Tập đoàn: BM-07, ý kiến Tổng Giám đốc Tập đoàn |
| 34 | bm08 | MariaDB | Nội dung riêng của quyết định phê duyệt BM-08 |
| 35 | profile_adjust_row | MariaDB | Bảng trước – sau của hồ sơ Điều chỉnh |
| 36 | profile_adjust_done | MariaDB | Kết quả đã thực hiện lấy ở bước 2 của hồ sơ Điều chỉnh (BR-DXMS-09-08) |
| 37 | proposal_member | MariaDB | Nhân sự thực hiện chỉ định theo bước của luồng (BR-DXMS-01-13) |
| 38 | member_log | MariaDB | Lịch sử thay đổi nhân sự (BR-DXMS-01-14) |
| 39 | code_sequence | MariaDB | Bộ đếm sinh mã, bảo đảm mã không dùng lại |

### 5.1.2 Chi tiết các bảng CSDL

Quy ước: Nullable x là được rỗng; Unikey x là duy nhất (kể cả khi kết hợp, ghi rõ ở mục 5.1.3); P/F Key: P khóa chính, F khóa ngoại tới bảng trong module, F\* mã tham chiếu tới danh mục, người dùng hoặc hệ thống khác (không ràng buộc khóa ngoại trong CSDL). Mã trạng thái theo mục 2.3.1.5, kiểu VARCHAR(20). Giá trị tiền đơn vị tỷ đồng; giá trị tính toán lưu 6 chữ số thập phân, hiển thị làm tròn 2 chữ số.

**Cột chung của mọi bảng**, không nhắc lại trong từng bảng:

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | id | BIGINT |  | x | P | Tự tăng | Khóa chính |
| 2 | created_at | DATETIME |  |  |  | Thời điểm ghi | Thời điểm tạo |
| 3 | created_by | VARCHAR(100) |  |  | F\* | Người dùng hiện tại | Tài khoản người tạo |
| 4 | updated_at | DATETIME | x |  |  |  | Thời điểm cập nhật gần nhất |
| 5 | updated_by | VARCHAR(100) | x |  | F\* |  | Tài khoản người cập nhật gần nhất |

#### proposal

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  | Hệ thống sinh | Mã ĐXMS ĐXMS-YYYY-NNNN (BR-DXMS-01-01). Không sửa |
| 2 | title | VARCHAR(500) |  |  |  |  | Tên ĐXMS, không kiểm trùng (BR-DXMS-01-02) |
| 3 | mission_code | VARCHAR(50) |  |  | F\* |  | Mã Nhiệm vụ / Đề tài, dự án; Loại suy từ mã này |
| 4 | unit_id | VARCHAR(50) |  |  | F\* | Đơn vị chính của người tạo | Đơn vị đề xuất |
| 5 | priority | VARCHAR(20) |  |  |  | NORMAL | Mức ưu tiên: NORMAL Thường, URGENT Khẩn, TOP_URGENT Thượng khẩn |
| 6 | secret | TINYINT(1) |  |  |  | 0 | Mật: 1 Có, 0 Không |
| 7 | estimated_value | DECIMAL(11,2) | x |  |  |  | Giá trị dự kiến, tỷ đồng, ≥ 0 (BR-DXMS-01-06) |
| 8 | period | VARCHAR(255) | x |  |  |  | Thời gian thực hiện |
| 9 | purpose | VARCHAR(2000) | x |  |  |  | Mục đích |
| 10 | ai_security_check | JSON | x |  |  |  | Kết quả AI kiểm tra 4 quy tắc bảo mật: quy tắc, kết quả, gợi ý, thời điểm (BR-DXMS-01-07). Rỗng khi Mật = 0 |
| 11 | status | VARCHAR(20) |  |  |  | APPROVING | Trạng thái ĐXMS (mục 2.3.1.1): APPROVING, APPROVED, ADJUSTING, SUPERSEDED, STOPPED. Hệ thống cập nhật theo hồ sơ, không nhập tay |
| 12 | priority_reason | VARCHAR(1000) | x |  |  |  | Lý do ưu tiên, bắt buộc khi Khẩn, Thượng khẩn (BR-DXMS-01-16) |
| 13 | adjust_from_id | BIGINT | x |  | F |  | Điều chỉnh từ: ĐXMS căn cứ. Có giá trị là Loại Điều chỉnh (BR-DXMS-C-03) |
| 14 | adjust_no | INT |  |  |  | 0 | Lần điều chỉnh: 0 với ĐXMS không phải điều chỉnh; ĐXMS điều chỉnh = lần của ĐXMS căn cứ + 1 |
| 15 | adjust_reason | VARCHAR(2000) | x |  |  |  | Lý do điều chỉnh (DTMS_CN_0172) |
| 16 | root_id | BIGINT | x |  | F |  | ĐXMS gốc của chuỗi điều chỉnh (BR-DXMS-C-30); rỗng với ĐXMS gốc |
| 17 | copy_from_id | BIGINT | x |  | F |  | Sao chép từ (BR-DXMS-01-15), chỉ để tham khảo |
| 18 | adjust_count | INT |  |  |  | 0 | Số lần điều chỉnh đã hoàn thành, hiện kèm trạng thái |
| 19 | effective_profile_id | BIGINT | x |  | F |  | Hồ sơ có hiệu lực (BR-DXMS-C-04, BR-DXMS-09-09); rỗng khi chưa có hồ sơ Hoàn thành |
| 20 | deleted | TINYINT(1) |  |  |  | 0 | 1 khi người lập xóa ĐXMS chưa gửi hoặc bị trả lại (BR-DXMS-01-05), xóa mềm theo khuôn mục 4.7; ĐXMS khác luôn 0 |
| 21 | version | INT |  |  |  | 0 | Khóa lạc quan, phát hiện hai người cùng sửa |

#### profile

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  | Hệ thống sinh | Mã hồ sơ HS-YYYY-NNNN (BR-DXMS-06-01) |
| 2 | proposal_id | BIGINT |  |  | F |  | ĐXMS của hồ sơ |
| 3 | type | VARCHAR(20) |  |  |  |  | Loại hồ sơ: APPROVAL Phê duyệt, ADJUSTMENT Điều chỉnh |
| 4 | title | VARCHAR(500) |  |  |  |  | Tên hồ sơ |
| 5 | unit_id | VARCHAR(50) |  |  | F\* | Theo ĐXMS | Đơn vị đề xuất, sao chép khi tạo (BR-DXMS-06-02) |
| 6 | priority | VARCHAR(20) |  |  |  | Theo ĐXMS | Mức ưu tiên |
| 7 | secret | TINYINT(1) |  |  |  | Theo BR-DXMS-06-02 | Mật của hồ sơ |
| 8 | mission_code | VARCHAR(50) |  |  | F\* | Theo ĐXMS | Nhiệm vụ / Đề tài, dự án |
| 9 | period | VARCHAR(255) | x |  |  | Theo ĐXMS | Thời gian thực hiện |
| 10 | purpose | VARCHAR(2000) | x |  |  | Theo ĐXMS | Mục đích |
| 11 | purchase_type | VARCHAR(50) | x |  |  |  | Loại mua sắm, nhập ở bước 4 |
| 12 | scope | VARCHAR(2000) | x |  |  |  | Phạm vi, quy mô |
| 13 | fund_id | VARCHAR(50) | x |  | F\* |  | Nguồn vốn (danh mục Nguồn vốn) |
| 14 | process_key | VARCHAR(50) |  |  |  | Theo Loại hồ sơ | Quy trình: MS01 (Phê duyệt) hoặc MS02 (Điều chỉnh) (BR-DXMS-C-05) |
| 15 | process_version | INT |  |  |  |  | Phiên bản quy trình đang hoạt động lúc khởi tạo |
| 16 | process_instance_key | VARCHAR(50) | x | x | F\* |  | Khóa tiến trình trên Camunda |
| 17 | branch | VARCHAR(20) | x |  |  |  | Luồng con thực tế: MS01.01, MS01.02, MS01.03, MS02.01, MS02.02, MS02.03. Rỗng khi chưa xác định (BR-DXMS-C-05) |
| 18 | branch_expected | VARCHAR(20) | x |  |  |  | Luồng dự kiến từ cổng sau bước 10 tới khi hoàn thành bước 48 (BR-DXMS-C-05) |
| 19 | threshold | DECIMAL(11,2) |  |  |  | Tham số lúc Lưu | Ngưỡng phân luồng giữ khi Lưu (BR-DXMS-06-05) |
| 20 | status | VARCHAR(20) |  |  |  | PROCESSING | Trạng thái hồ sơ (mục 2.3.1.2) |
| 21 | total_value | DECIMAL(18,6) | x |  |  |  | Tổng giá trị theo cơ sở giá, tỷ đồng (BR-DXMS-06-03); rỗng tới khi có yêu cầu PASSED |
| 22 | value_before | DECIMAL(18,6) | x |  |  |  | Giá trị trước điều chỉnh, lấy từ hồ sơ căn cứ |
| 23 | current_version_no | INT | x |  |  |  | Phiên bản hiện tại; rỗng tới khi sinh v1 |
| 24 | loop_no | INT |  |  |  | 0 | Vòng xử lý (BR-DXMS-C-15) |
| 25 | report_group | TINYINT(1) | x |  |  |  | Có báo cáo Tổng Giám đốc Tập đoàn (bước 48): 1 Có, 0 Không |
| 26 | report_suggested | TINYINT(1) | x |  |  |  | Gợi ý của hệ thống ở bước 48 theo BR-DXMS-C-07: 1 Có, 0 Không |
| 27 | report_reason | VARCHAR(2000) | x |  |  |  | Lý do chọn khác gợi ý ở bước 48 (BR-DXMS-08-08) |
| 28 | base_profile_id | BIGINT | x |  | F |  | Hồ sơ căn cứ của hồ sơ Điều chỉnh (BR-DXMS-09-03) |
| 29 | adjust_no | INT | x |  |  |  | Lần điều chỉnh (BR-DXMS-09-04) |
| 30 | adjust_confirmed | TINYINT(1) | x |  |  |  | Đã xác nhận "Đây là ĐXMS cần điều chỉnh" |
| 31 | adjust_reason_group | VARCHAR(50) | x |  |  |  | Nhóm lý do điều chỉnh |
| 32 | adjust_scope | JSON | x |  |  |  | Phạm vi điều chỉnh, mảng mã đã chọn |
| 33 | adjust_reason | VARCHAR(2000) | x |  |  |  | Lý do điều chỉnh |
| 34 | adjust_estimate | DECIMAL(11,2) | x |  |  |  | Giá trị sau điều chỉnh dự kiến (BR-DXMS-09-05) |
| 35 | budget_note | VARCHAR(2000) | x |  |  |  | Ghi chú ngân sách (BR-DXMS-09-10) |
| 36 | impact_ack | TINYINT(1) | x |  |  |  | Đã xem tác động điều chỉnh khi Chuyển ngưỡng (BR-DXMS-09-07) |
| 37 | ai_estimate | JSON | x |  |  |  | AI gợi ý giá trị dự kiến ở bước 3, kèm nguồn |
| 38 | ai_basic | JSON | x |  |  |  | Bảng gợi ý thông tin cơ bản: mục, gợi ý, nguồn, quyết định, nội dung chốt (BR-DXMS-C-08) |
| 39 | ai_adjust | JSON | x |  |  |  | Bảng gợi ý của hồ sơ Điều chỉnh |
| 40 | ai_check | JSON | x |  |  |  | Kết quả AI kiểm tra trước khi gửi bước 11, 12 |
| 41 | ai_conflict | JSON | x |  |  |  | Kết quả AI kiểm tra xung đột ý kiến (BR-DXMS-07-10) |
| 42 | ai_summary | JSON | x |  |  |  | AI tóm tắt ý kiến CQCM |
| 43 | ai_docs | JSON | x |  |  |  | AI kiểm tra đủ hồ sơ theo Checklist |
| 44 | cancel_reason | VARCHAR(2000) | x |  |  |  | Lý do hủy, dừng hồ sơ |
| 45 | signed_at | DATETIME | x |  |  |  | Thời điểm nhận kết quả ký văn bản phê duyệt (bước 61); dùng để xác định hồ sơ mới nhất (BR-DXMS-C-04, BR-DXMS-C-30) |
| 46 | processing_key | BIGINT | x | x |  | Tính | Cột sinh: bằng proposal_id khi status = PROCESSING, ngược lại rỗng. Bảo đảm BR-DXMS-C-02 |
| 47 | version | INT |  |  |  | 0 | Khóa lạc quan |

created_by của bảng này là Người phụ trách hồ sơ (BR-DXMS-08-01).

#### profile_version

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | no | INT |  | x |  |  | Số phiên bản 1, 2…; duy nhất trong hồ sơ |
| 3 | reason | VARCHAR(255) |  |  |  |  | Nội dung cập nhật, ví dụ "Hoàn chỉnh theo ý kiến CQCM" |
| 4 | step_no | VARCHAR(10) |  |  |  |  | Bước sinh phiên bản: 11, 12, 27, 28 |
| 5 | snapshot | JSON |  |  |  |  | Nội dung biểu mẫu, bảng của phiên bản, dùng để so sánh (BR-DXMS-06-08) |

#### profile_doc

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 2 | profile_version_id | BIGINT | x |  | F |  | Phiên bản hồ sơ khi sinh văn bản |
| 3 | step_no | VARCHAR(10) |  |  |  |  | Bước sinh văn bản (mục 7.1) |
| 4 | form_code | VARCHAR(30) |  |  |  |  | Mã biểu mẫu: BM-01…BM-09, Phụ lục, Checklist 01, 02 |
| 5 | name | VARCHAR(255) |  |  |  |  | Tên tài liệu |
| 6 | status | VARCHAR(20) |  |  |  | DRAFT | Trạng thái văn bản (mục 2.3.1.3) |
| 7 | agency_id | VARCHAR(50) | x |  | F\* |  | CQCM của văn bản khi văn bản thuộc riêng một CQCM (BM-04) |
| 8 | doc_no | VARCHAR(100) | x |  |  |  | Số văn bản sau khi ký |
| 9 | signed_date | DATE | x |  |  |  | Ngày ký |
| 10 | file_id | VARCHAR(100) |  |  | F\* |  | Tệp trên kho tệp; bản đã ký thay bản dự thảo khi nhận kết quả |
| 11 | draft_file_id | VARCHAR(100) | x |  | F\* |  | Bản dự thảo trước khi ký |

#### profile_file

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 2 | name | VARCHAR(255) |  |  |  | Tên tệp | Tên tài liệu |
| 3 | category | VARCHAR(30) |  |  |  |  | Nhóm tài liệu: BASIS căn cứ, ITEMS bảng hạng mục, STOCK rà soát, QUOTE báo giá, BM03_INITIAL BM-03 ký nháy, MINUTES biên bản họp, ADJUST_BASIS căn cứ phát sinh, UPLOAD tệp tải lên |
| 4 | file_id | VARCHAR(100) |  |  | F\* |  | Tệp trên kho tệp |
| 5 | secret_only | TINYINT(1) |  |  |  | 0 | Chỉ người trong danh sách xử lý được xem (biên bản họp hồ sơ Mật) |

#### step_file

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 2 | step_no | VARCHAR(10) |  |  |  |  | Bước tải tệp |
| 3 | task_id | VARCHAR(50) |  |  | F\* |  | Công việc trên Camunda |
| 4 | kind | VARCHAR(30) |  |  |  |  | ATTACHMENT tệp đính kèm, RECEIVED_DOC văn bản nhận được ghi nhận thay (BR-DXMS-08-09) |
| 5 | file_id | VARCHAR(100) |  |  | F\* |  | Tệp trên kho tệp |
| 6 | on_behalf | TINYINT(1) |  |  |  | 0 | Người xử lý TTMS ghi nhận thay người ký ngoài hệ thống |

#### sign_request

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_doc_id | BIGINT |  |  | F |  | Văn bản trình ký |
| 2 | profile_version_no | INT | x |  |  |  | Phiên bản hồ sơ lúc trình |
| 3 | step_no | VARCHAR(10) |  |  |  |  | Bước trình ký |
| 4 | signer_id | VARCHAR(100) |  |  | F\* |  | Người ký (BR-DXMS-08-05) |
| 5 | signer_role | VARCHAR(100) | x |  |  |  | Tư cách ký, ví dụ TTMS, Phó Tổng Giám đốc |
| 6 | sign_mode | VARCHAR(20) |  |  |  |  | ELECTRONIC ký điện tử qua VOffice, PAPER ký bản giấy (hồ sơ Mật) |
| 7 | request_code | VARCHAR(100) | x | x | F\* |  | Mã yêu cầu trình ký trên VOffice; rỗng khi ký bản giấy |
| 8 | send_no | INT |  |  |  | 1 | Lần gửi; Gửi lại tạo dòng mới với số tăng, dòng cũ giữ nguyên (BR-DXMS-06-09) |
| 9 | sent_at | DATETIME |  |  |  |  | Thời điểm gửi trình ký |
| 10 | status | VARCHAR(20) |  |  |  | PENDING_SIGN | Trạng thái (mục 2.3.1.3) |
| 11 | result_at | DATETIME | x |  |  |  | Thời điểm nhận kết quả |
| 12 | reject_reason | VARCHAR(2000) | x |  |  |  | Lý do từ chối, không đồng ý |
| 13 | error_message | VARCHAR(1000) | x |  |  |  | Nội dung lỗi khi FAILED |
| 14 | paper_doc_no | VARCHAR(100) | x |  |  |  | Số văn bản ký bản giấy |
| 15 | paper_signed_date | DATE | x |  |  |  | Ngày ký bản giấy |

#### basis_doc

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | type | VARCHAR(50) |  |  |  |  | Loại căn cứ: Kế hoạch SXKD hằng năm, Phương án kinh doanh, Quyết định phê duyệt nhiệm vụ, Tờ trình, Kế hoạch, Chủ trương, Văn bản chỉ đạo khác |
| 2 | doc_no | VARCHAR(100) |  | x |  |  | Số văn bản; duy nhất cùng issued_at trong phạm vi người dùng thấy (BR-DXMS-02-03) |
| 3 | issued_at | DATE |  | x |  |  | Ngày ban hành |
| 4 | title | VARCHAR(1000) |  |  |  |  | Trích yếu |
| 5 | value | DECIMAL(18,6) | x |  |  |  | Giá trị, tỷ đồng |
| 6 | group_approved | TINYINT(1) |  |  |  | 0 | Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt |
| 7 | file_id | VARCHAR(100) |  |  | F\* |  | Tệp văn bản |
| 8 | unit_id | VARCHAR(50) |  |  | F\* |  | Đơn vị của người khai báo, dùng xét phạm vi thấy văn bản |
| 9 | deleted | TINYINT(1) |  |  |  | 0 | Xóa mềm; chỉ xóa được khi văn bản chưa được hồ sơ nào dùng |
| 10 | version | INT |  |  |  | 0 | Khóa lạc quan |

#### basis_line

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | basis_doc_id | BIGINT |  |  | F |  | Văn bản căn cứ |
| 2 | group_name | VARCHAR(255) | x |  |  |  | Tên nhóm trong văn bản |
| 3 | name | VARCHAR(255) |  |  |  |  | Tên dòng |
| 4 | quantity | DECIMAL(18,3) | x |  |  |  | SL gốc của dòng (BR-DXMS-02-05) |
| 5 | source_file | VARCHAR(255) | x |  |  |  | Tên tệp nguồn khi bóc tách |

#### profile_basis

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | doc_id | BIGINT |  | x | F |  | Văn bản căn cứ (basis_doc). Cặp hồ sơ – văn bản là duy nhất |
| 3 | inherited | TINYINT(1) |  |  |  | 0 | Văn bản kế thừa từ hồ sơ căn cứ (BR-DXMS-09-13) |

#### proposal_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 2 | sort_no | INT |  |  |  |  | Thứ tự hiển thị |
| 3 | name | VARCHAR(500) |  |  |  |  | Tên hàng hóa, dịch vụ |
| 4 | uom | VARCHAR(50) |  |  | F\* |  | Đơn vị tính (danh mục) |
| 5 | group | TINYINT |  |  |  |  | Nhóm 1 hoặc 2 |
| 6 | goods_type | VARCHAR(50) |  |  | F\* |  | Ngành hàng (danh mục Loại hàng hóa, dịch vụ) |
| 7 | basis_line_id | BIGINT | x |  | F |  | Dòng căn cứ liên kết; rỗng là hạng mục ngoài căn cứ (BR-DXMS-02-08) |
| 8 | proposed_qty | DECIMAL(18,3) |  |  |  |  | SL đề xuất; với hồ sơ Điều chỉnh là Số lượng điều chỉnh |
| 9 | confirmed_at | DATETIME | x |  |  |  | Thời điểm xác nhận ở bước 5; rỗng là nháp, không tính phần đã dùng |
| 10 | base_item_id | BIGINT | x |  | F |  | Hạng mục tương ứng của hồ sơ căn cứ (hồ sơ Điều chỉnh) |
| 11 | change_types | JSON | x |  |  |  | Loại thay đổi so với trước điều chỉnh, có thể nhiều giá trị (BR-DXMS-09-06) |

#### stock_review

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) | x | x |  | Sinh khi xác nhận | Mã bản rà soát RSTK-YYYY-NNNN |
| 2 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 3 | phase | VARCHAR(20) |  |  |  | BOOK | Lần rà soát đã có: BOOK sổ sách, ACTUAL thực tế (BR-DXMS-03-01) |
| 4 | book_updated_at | DATETIME | x |  |  |  | Thời điểm cập nhật kết quả sổ sách |
| 5 | book_updated_by | VARCHAR(100) | x |  | F\* |  | Người cập nhật kết quả sổ sách |
| 6 | actual_updated_at | DATETIME | x |  |  |  | Thời điểm cập nhật kết quả thực tế |
| 7 | actual_updated_by | VARCHAR(100) | x |  | F\* |  | Người cập nhật kết quả thực tế |
| 8 | integration_status | VARCHAR(20) | x |  |  |  | OK, ERROR khi lấy số liệu từ phân hệ kho |
| 9 | file_id | VARCHAR(100) | x |  | F\* |  | Tệp kết quả rà soát |
| 10 | confirmed_at | DATETIME | x |  |  |  | Thời điểm xác nhận bước 7; sau đó bản không sửa |

#### stock_review_line

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | stock_review_id | BIGINT |  | x | F |  | Bản rà soát |
| 2 | proposal_item_id | BIGINT |  | x | F |  | Hạng mục; một dòng cho mỗi hạng mục của bản |
| 3 | item_code | VARCHAR(50) | x |  | F\* |  | Mã hàng trong kho; rỗng là không quản lý tồn |
| 4 | book_qty | DECIMAL(18,3) | x |  |  |  | Tồn sổ sách |
| 5 | held_other_qty | DECIMAL(18,3) | x |  |  |  | Đang giữ cho ĐXMS khác tại lúc xác nhận |
| 6 | actual_qty | DECIMAL(18,3) | x |  |  |  | Số đủ điều kiện xuất kho |
| 7 | quality | VARCHAR(500) | x |  |  |  | Chất lượng |
| 8 | use_qty | DECIMAL(18,3) | x |  |  |  | Dùng từ kho (BR-DXMS-03-03) |
| 9 | hold_status | VARCHAR(20) | x |  |  |  | Phần giữ: HOLDING Đang tạm giữ, USED Đã chốt sử dụng, RELEASED Đã giải phóng (BR-DXMS-03-05) |

#### quotation

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  | Hệ thống sinh | Mã YCBG-{YYYY-NNNN}-{LL} (BR-DXMS-04-01) |
| 2 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 3 | round | INT |  |  |  |  | Lần gửi LL, tăng theo ĐXMS qua mọi hồ sơ |
| 4 | status | VARCHAR(20) |  |  |  | WAITING | WAITING, RECEIVED, PASSED, FAILED, CANCELED (BR-DXMS-04-08) |
| 5 | channel | VARCHAR(20) |  |  |  | EMAIL | Kênh gửi: EMAIL email hệ thống thay TTMS, OUTSIDE ngoài hệ thống |
| 6 | sent_at | DATETIME |  |  |  |  | Ngày gửi |
| 7 | due_date | DATE |  |  |  | Theo BR-DXMS-04-05 | Hạn báo giá |
| 8 | tech_file_ids | JSON | x |  |  |  | Tài liệu kỹ thuật theo Nhóm 1, Nhóm 2 |
| 9 | ai_check | JSON | x |  |  |  | Kết quả AI kiểm tra báo giá; lý do Vẫn đạt nếu có (BR-DXMS-04-12) |
| 10 | result_at | DATETIME | x |  |  |  | Ngày có kết quả bước 10 |
| 11 | fail_note | VARCHAR(2000) | x |  |  |  | Nội dung khi Không đạt, gửi lại |
| 12 | payment_terms | VARCHAR(4000) | x |  |  |  | Điều kiện thanh toán ghi trên phiếu (BR-DXMS-04-06) |
| 13 | delivery_place | VARCHAR(500) | x |  |  |  | Địa điểm giao hàng |
| 14 | other_requirements | VARCHAR(2000) | x |  |  |  | Các yêu cầu khác |
| 15 | contact_user_id | BIGINT | x |  | F |  | Đầu mối tiếp nhận báo giá |

#### quotation_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | quotation_id | BIGINT |  | x | F |  | Yêu cầu báo giá |
| 2 | proposal_item_id | BIGINT |  | x | F |  | Hạng mục |
| 3 | buy_qty | DECIMAL(18,3) |  |  |  |  | Còn phải mua tại lúc gửi |
| 4 | base_quote_id | BIGINT | x |  | F | Giá thấp nhất | Báo giá làm cơ sở giá (quote) (BR-DXMS-04-10) |
| 5 | base_reason | VARCHAR(2000) | x |  |  |  | Lý do chọn khác giá thấp nhất; bắt buộc khi khác |

#### quotation_vendor

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | quotation_id | BIGINT |  | x | F |  | Yêu cầu báo giá |
| 2 | vendor_id | BIGINT |  | x | F |  | Nhà cung cấp |
| 3 | send_status | VARCHAR(20) |  |  |  |  | SENT Đã gửi, FAILED Gửi lỗi, OUTSIDE Ngoài hệ thống |
| 4 | send_error | VARCHAR(1000) | x |  |  |  | Nội dung lỗi gửi |

#### quote

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | quotation_vendor_id | BIGINT |  | x | F |  | Nhà cung cấp của yêu cầu; mỗi nhà cung cấp một báo giá |
| 2 | no_response | TINYINT(1) |  |  |  | 0 | Không phản hồi (BR-DXMS-04-11) |
| 3 | quote_date | DATE | x |  |  |  | Ngày báo giá |
| 4 | valid_until | DATE | x |  |  |  | Hiệu lực đến |
| 5 | currency | VARCHAR(10) | x |  | F\* | VND | Loại tiền (danh mục) |
| 6 | exchange_rate | DECIMAL(18,6) | x |  |  | 1 | Tỷ giá; VNĐ bằng 1 (BR-DXMS-04-09) |
| 7 | file_id | VARCHAR(100) | x |  | F\* |  | Tệp báo giá |
| 8 | uploaded_at | DATETIME | x |  |  |  | Thời điểm tải tệp |
| 9 | ai_suggest | JSON | x |  |  |  | Giá trị AI đọc từ tệp, lưu cùng giá trị người dùng chốt (BR-DXMS-C-08) |

#### quote_line

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | quote_id | BIGINT |  | x | F |  | Báo giá |
| 2 | quotation_item_id | BIGINT |  | x | F |  | Hạng mục của yêu cầu |
| 3 | unit_price | DECIMAL(20,4) | x |  |  |  | Đơn giá báo theo Loại tiền, gồm VAT; rỗng là không báo |
| 4 | unit_price_converted | DECIMAL(20,9) | x |  |  | Tính | Đơn giá quy đổi, tỷ đồng (BR-DXMS-04-09) |
| 5 | ai_suggested | TINYINT(1) |  |  |  | 0 | Giá do AI gợi ý, người dùng chưa sửa |

#### vendor

Bảng thuộc danh mục Nhà cung cấp dùng chung; module chỉ đọc và thêm nhà cung cấp mới theo BR-DXMS-04-04.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(30) |  | x |  | Hệ thống sinh | Mã nhà cung cấp |
| 2 | name | VARCHAR(255) |  |  |  |  | Tên |
| 3 | tax_code | VARCHAR(20) |  | x |  |  | Mã số thuế |
| 4 | email | VARCHAR(255) |  |  |  |  | Email nhận yêu cầu báo giá |
| 5 | goods_types | JSON |  |  |  |  | Ngành hàng |
| 6 | status | VARCHAR(20) |  |  |  | ACTIVE | Hoạt động, Ngừng hoạt động |
| 7 | restriction | VARCHAR(20) | x |  |  |  | BANNED Cấm, LIMITED Hạn chế |
| 8 | banned_until | DATE | x |  |  |  | Cấm đến ngày |
| 9 | classification | VARCHAR(20) |  |  |  | DOMESTIC | Phân loại, mặc định Trong nước |
| 10 | source_profile_code | VARCHAR(30) | x |  |  |  | Mã hồ sơ đã thêm nhà cung cấp |

#### draft

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_version_id | BIGINT |  | x | F |  | Phiên bản hồ sơ; mỗi phiên bản một bản dự thảo |
| 2 | form_code | VARCHAR(10) |  |  |  |  | BM-01 hoặc BM-09 |
| 3 | purpose | TEXT | x |  |  |  | Mục đích |
| 4 | necessity | TEXT | x |  |  |  | Sự cần thiết |
| 5 | plan | TEXT | x |  |  |  | Kế hoạch thực hiện |
| 6 | method | TEXT | x |  |  |  | Phương thức mua sắm |
| 7 | budget | TEXT | x |  |  |  | Dự toán, nguồn vốn |
| 8 | efficiency | TEXT | x |  |  |  | Hiệu quả |
| 9 | ai_suggest | JSON | x |  |  |  | Nội dung AI gợi ý từng mục |

#### draft_review

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 2 | review_no | INT |  |  |  |  | Lần duyệt ở bước 13 |
| 3 | part | VARCHAR(100) |  |  |  |  | Phần: mục của Tờ trình, Phụ lục chi phí, Checklist |
| 4 | result | VARCHAR(20) |  |  |  | PASS | PASS Đạt, FAIL Không đạt |
| 5 | reason | VARCHAR(2000) | x |  |  |  | Lý do, chỉ đạo; bắt buộc khi Không đạt |
| 6 | ai_guide | TEXT | x |  |  |  | Hướng dẫn sửa AI sinh ở bước 14 |
| 7 | response | VARCHAR(20) | x |  |  |  | Phản hồi của đơn vị đề xuất: FIXED Đã sửa, NOT_FIXED Không sửa |
| 8 | response_note | VARCHAR(2000) | x |  |  |  | Giải trình; bắt buộc khi Không sửa |

#### appraisal_round

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | no | INT |  | x |  |  | Lần thẩm định, bắt đầu từ 1 (BR-DXMS-07-01) |
| 3 | due_date | DATE | x |  |  |  | Hạn góp ý |
| 4 | contact_id | VARCHAR(100) | x |  | F\* |  | Đầu mối tiếp nhận của đơn vị đề xuất |
| 5 | bm03_draft_file_id | VARCHAR(100) | x |  | F\* |  | BM-03 đã ký nháy |
| 6 | confirm_status | VARCHAR(20) | x |  |  |  | Trạng thái xác nhận danh sách CQCM gần nhất: PENDING, CONFIRMED, RETURNED |
| 7 | confirm_by | VARCHAR(100) | x |  | F\* |  | Người xác nhận gần nhất |
| 8 | confirm_at | DATETIME | x |  |  |  | Thời điểm xác nhận gần nhất |
| 9 | confirm_reason | VARCHAR(2000) | x |  |  |  | Lý do trả lại gần nhất |
| 10 | ai_check | JSON | x |  |  |  | AI đối chiếu thành phần CQCM |
| 11 | sent_at | DATETIME | x |  |  |  | Thời điểm gửi CQCM; lần 1 là T0 (mục 2.3.3) |
| 12 | version_no_sent | INT | x |  |  |  | Phiên bản hồ sơ lúc gửi |
| 13 | bm04_complete_at | DATETIME | x |  |  |  | Ngày đủ BM-04 hợp lệ |
| 14 | conflict_checked | TINYINT(1) |  |  |  | 0 | Đã dùng lần quay lại bước 19 do xung đột (BR-DXMS-C-14) |

#### appraisal_confirm

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | appraisal_round_id | BIGINT |  |  | F |  | Lần thẩm định |
| 2 | status | VARCHAR(20) |  |  |  |  | PENDING, CONFIRMED, RETURNED |
| 3 | reason | VARCHAR(2000) | x |  |  |  | Lý do trả lại |
| 4 | agencies | JSON |  |  |  |  | Danh sách CQCM tại lần gửi, để xem lại |

#### appraisal_agency

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | appraisal_round_id | BIGINT |  | x | F |  | Lần thẩm định |
| 2 | agency_id | VARCHAR(50) |  | x | F\* |  | CQCM (đơn vị) |
| 3 | required | TINYINT(1) |  |  |  | 0 | CQCM bắt buộc theo BR-DXMS-C-12 |
| 4 | function_note | VARCHAR(255) | x |  |  |  | Chức năng liên quan |
| 5 | handler_id | VARCHAR(100) | x |  | F\* |  | Người xử lý của CQCM |

#### bm04

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | appraisal_round_id | BIGINT |  |  | F |  | Lần thẩm định |
| 2 | agency_id | VARCHAR(50) |  |  | F\* |  | CQCM |
| 3 | profile_version_no | INT |  |  |  |  | Phiên bản hồ sơ được thẩm định |
| 4 | profile_doc_id | BIGINT | x |  | F |  | Văn bản BM-04 sinh ra, trạng thái ký theo văn bản |
| 5 | resign | TINYINT(1) |  |  |  | 0 | Bản ký lại ở bước 37 |
| 6 | general_comment | VARCHAR(4000) | x |  |  |  | Ý kiến chung |
| 7 | contact_id | VARCHAR(100) |  |  | F\* | Người xử lý | Đầu mối phối hợp |
| 8 | preparer_id | VARCHAR(100) |  |  | F\* |  | Người lập |
| 9 | approver_id | VARCHAR(100) | x |  | F\* |  | Chỉ huy CQCM |
| 10 | not_ok_count | INT |  |  |  | 0 | Số mục Không OK |
| 11 | valid | TINYINT(1) |  |  |  | 0 | Hợp lệ theo BR-DXMS-07-03 |
| 12 | invalid_reason | VARCHAR(50) | x |  |  |  | Lý do không hợp lệ (BR-DXMS-07-03) |

#### bm04_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | bm04_id | BIGINT |  | x | F |  | Phiếu BM-04 |
| 2 | section | VARCHAR(100) |  | x |  |  | Mục đánh giá |
| 3 | result | VARCHAR(20) | x |  |  |  | OK, NOT_OK; rỗng là chưa chọn |
| 4 | comment | VARCHAR(2000) | x |  |  |  | Nội dung nhận xét; bắt buộc khi Không OK |
| 5 | guide | VARCHAR(2000) | x |  |  |  | Hướng dẫn sửa |
| 6 | ai_suggest | VARCHAR(2000) | x |  |  |  | Gợi ý AI |
| 7 | ai_decision | VARCHAR(20) | x |  |  |  | Quyết định với gợi ý: ACCEPT, EDIT, DROP |

#### opinion

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ |
| 2 | appraisal_round_id | BIGINT | x |  | F |  | Lần thẩm định; rỗng với dòng từ lý do trả lại sau ký |
| 3 | source_type | VARCHAR(20) |  |  |  |  | AGENCY CQCM, RETURN người trả lại (BR-DXMS-07-05) |
| 4 | agency_id | VARCHAR(50) | x |  | F\* |  | CQCM của dòng |
| 5 | bm04_item_id | BIGINT | x |  | F |  | Mục BM-04 sinh ra dòng |
| 6 | version_no | INT |  |  |  |  | Phiên bản hồ sơ khi sinh dòng |
| 7 | section | VARCHAR(100) |  |  |  |  | Mục |
| 8 | comment | VARCHAR(2000) |  |  |  |  | Nội dung nhận xét |
| 9 | guide | VARCHAR(2000) | x |  |  |  | Hướng dẫn sửa |
| 10 | decision | VARCHAR(20) | x |  |  |  | ACCEPT Tiếp thu, RESERVE Bảo lưu (BR-DXMS-07-06) |
| 11 | explanation | VARCHAR(2000) | x |  |  |  | Nội dung giải trình |
| 12 | reference | VARCHAR(500) | x |  |  |  | Tham chiếu |
| 13 | note | VARCHAR(1000) | x |  |  |  | Ghi chú |
| 14 | decided_by | VARCHAR(100) | x |  | F\* |  | Người quyết định |
| 15 | decided_at | DATETIME | x |  |  |  | Thời điểm quyết định |
| 16 | status | VARCHAR(20) |  |  |  | PROCESSING | Kết quả dòng: PROCESSING Đang xử lý, RESOLVED Đã xử lý, NEXT_ROUND Chuyển lần sau, BY_CONCLUSION Theo kết luận, NOT_APPLICABLE Không còn áp dụng (BR-DXMS-07-08) |

#### opinion_check

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | opinion_id | BIGINT |  |  | F |  | Dòng ý kiến |
| 2 | version_no | INT |  |  |  |  | Phiên bản hồ sơ được kiểm tra |
| 3 | result | VARCHAR(20) |  |  |  |  | PASS Đạt, FAIL Chưa đạt |
| 4 | reason | VARCHAR(2000) | x |  |  |  | Lý do; bắt buộc khi Chưa đạt |

#### meeting

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | appraisal_round_id | BIGINT | x |  | F |  | Lần thẩm định khi họp |
| 3 | no | INT |  | x |  |  | Lần họp, tăng dần trong hồ sơ |
| 4 | held_at | DATETIME |  |  |  |  | Thời gian họp |
| 5 | place | VARCHAR(255) |  |  |  |  | Địa điểm |
| 6 | member_ids | JSON |  |  |  |  | Thành phần, ít nhất một người |
| 7 | minutes_file_id | VARCHAR(100) | x |  | F\* |  | Biên bản họp |
| 8 | conclusion | VARCHAR(4000) | x |  |  |  | Kết luận |
| 9 | result | VARCHAR(20) | x |  |  |  | AGREED Đã thống nhất, NOT_AGREED Chưa thống nhất |
| 10 | leader_conclusion | VARCHAR(4000) | x |  |  |  | Kết luận của Thủ trưởng VHT |
| 11 | leader_result | VARCHAR(30) | x |  |  |  | Lựa chọn của Thủ trưởng VHT ở bước 34 |

#### bm05_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_version_id | BIGINT |  | x | F |  | Phiên bản hồ sơ |
| 2 | section | VARCHAR(100) |  | x |  |  | Mục BM-05 |
| 3 | ai_suggest | TEXT | x |  |  |  | Gợi ý AI |
| 4 | source | VARCHAR(500) | x |  |  |  | Nguồn của gợi ý |
| 5 | decision | VARCHAR(20) | x |  |  | ACCEPT | ACCEPT Chấp nhận, EDIT Sửa, DROP Bỏ; rỗng ở phần I |
| 6 | content | VARCHAR(4000) | x |  |  |  | Nội dung sửa; bắt buộc khi Sửa |

#### bm06

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | contact_id | VARCHAR(100) |  |  | F\* |  | Đầu mối phối hợp, người dùng TTMS |

#### bm06_item

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_version_id | BIGINT |  | x | F |  | Phiên bản hồ sơ |
| 2 | section | VARCHAR(100) |  | x |  |  | Mục BM-06 |
| 3 | ai_suggest | TEXT | x |  |  |  | Gợi ý AI |
| 4 | source | VARCHAR(500) | x |  |  |  | Nguồn của gợi ý |
| 5 | decision | VARCHAR(20) | x |  |  | ACCEPT | ACCEPT, EDIT, DROP |
| 6 | content | VARCHAR(4000) | x |  |  |  | Nội dung sửa; bắt buộc khi Sửa |

#### group_report

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | bm07_file_id | VARCHAR(100) | x |  | F\* |  | BM-07 đã ký ngoài hệ thống |
| 3 | bm07_no | VARCHAR(100) | x |  |  |  | Số văn bản BM-07 |
| 4 | bm07_signed_date | DATE | x |  |  |  | Ngày ký BM-07 |
| 5 | opinion | VARCHAR(4000) | x |  |  |  | Ý kiến của Tổng Giám đốc Tập đoàn |
| 6 | opinion_file_id | VARCHAR(100) | x |  | F\* |  | Phiếu ý kiến hoặc văn bản nhận được |
| 7 | opinion_ai | JSON | x |  |  |  | Gợi ý AI đọc ý kiến |
| 8 | opinion_at | DATETIME | x |  |  |  | Thời điểm ghi nhận ý kiến |

#### bm08

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | article2 | VARCHAR(4000) |  |  |  | Câu mẫu | Điều 2. Tổ chức thực hiện |
| 3 | recipients | VARCHAR(1000) |  |  |  | "Như Điều 3; Lưu: VT" | Nơi nhận |

#### profile_adjust_row

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ Điều chỉnh |
| 2 | field | VARCHAR(50) |  | x |  |  | Trường điều chỉnh: Thời gian thực hiện, Nguồn vốn, Chỉ tiêu kỹ thuật, Nội dung khác, trường của Thông tin cơ bản |
| 3 | before | VARCHAR(2000) | x |  |  |  | Giá trị trước điều chỉnh (mã) |
| 4 | before_text | VARCHAR(2000) | x |  |  |  | Giá trị trước điều chỉnh để hiển thị |
| 5 | after | VARCHAR(2000) | x |  |  |  | Giá trị sau điều chỉnh |
| 6 | sort_no | INT |  |  |  |  | Thứ tự |

#### profile_adjust_done

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  |  | F |  | Hồ sơ Điều chỉnh |
| 2 | kind | VARCHAR(30) |  |  |  |  | APPROVAL_DOC văn bản phê duyệt, BID_PLAN kế hoạch lựa chọn nhà thầu, PACKAGE gói thầu, CONTRACT hợp đồng |
| 3 | ref_code | VARCHAR(100) |  |  | F\* |  | Mã, số của đối tượng |
| 4 | content | VARCHAR(2000) | x |  |  |  | Nội dung, ví dụ số lượng đã ký |
| 5 | ref_status | VARCHAR(50) | x |  |  |  | Trạng thái tại lúc lấy |
| 6 | fetched_at | DATETIME |  |  |  |  | Thời điểm lấy (bước 2) |

#### proposal_member

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | proposal_id | BIGINT |  | x | F |  | ĐXMS (luồng) |
| 2 | step | VARCHAR(10) |  | x |  |  | Số bước của quy trình MS01, theo BR-DXMS-01-13; hồ sơ Điều chỉnh dùng cùng số bước |
| 3 | user_id | VARCHAR(100) |  | x | F\* |  | Người được chỉ định; thuộc vai trò nhận việc của bước tại lúc lưu |

#### member_log

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | proposal_id | BIGINT |  |  | F |  | ĐXMS (luồng) |
| 2 | profile_id | BIGINT |  |  | F |  | Hồ sơ đang xử lý lúc cập nhật |
| 3 | step | VARCHAR(10) |  |  |  |  | Số bước |
| 4 | mode | VARCHAR(20) |  |  |  |  | REPLACE Thay người, ADD Bổ sung người |
| 5 | users_before | JSON |  |  |  |  | Người nhận trước khi cập nhật; bước chưa chỉ định ghi vai trò, nhóm |
| 6 | users_after | JSON |  |  |  |  | Người nhận sau khi cập nhật |
| 7 | doc_file_id | VARCHAR(100) | x |  | F\* |  | Văn bản căn cứ, mã tệp trong kho tệp |
| 8 | reason | VARCHAR(1000) | x |  |  |  | Lý do |
| 9 | moved_count | INT |  |  |  | 0 | Số công việc đang mở đã đổi người nhận |

#### task_form

Dữ liệu eForm của bước (mục 2.4.3): một dòng cho mỗi hồ sơ và công việc, ghi đè khi lưu nháp lại.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | profile_id | BIGINT |  | x | F |  | Hồ sơ |
| 2 | process_instance_key | VARCHAR(50) |  |  | F\* |  | Khóa tiến trình trên Camunda |
| 3 | user_task_key | VARCHAR(50) |  | x | F\* |  | Khóa công việc trên Camunda |
| 4 | element_id | VARCHAR(100) |  |  |  |  | Task key của bước trên BPMN |
| 5 | form_key | VARCHAR(100) |  |  |  |  | Mã eForm của bước (mục 7.4) |
| 6 | schema_json | JSON |  |  |  |  | Bản chụp schema eForm lúc lưu |
| 7 | variables_json | JSON | x |  |  |  | Dữ liệu form theo khóa trường |
| 8 | action_code | VARCHAR(50) | x |  |  |  | Mã hành động của lần Xác nhận (mục 2.5.1) |
| 9 | comment | VARCHAR(2000) | x |  |  |  | Lý do, nhận xét kèm hành động |
| 10 | status | VARCHAR(20) |  |  |  | DRAFT | DRAFT Nháp, SUBMITTING Đang gửi, SUBMITTED Đã gửi, FAILED Lỗi |
| 11 | actor | VARCHAR(100) |  |  | F\* |  | Người thực hiện lần lưu gần nhất |
| 12 | submitted_at | DATETIME | x |  |  |  | Thời điểm Xác nhận thành công |

#### task_form_history

Mỗi lần Lưu nháp hoặc Xác nhận thêm một dòng; không sửa, không xóa.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | task_form_id | BIGINT |  |  | F |  | Dòng task_form |
| 2 | user_task_key | VARCHAR(50) |  |  | F\* |  | Khóa công việc trên Camunda |
| 3 | form_key | VARCHAR(100) |  |  |  |  | Mã eForm |
| 4 | variables_json | JSON | x |  |  |  | Dữ liệu form tại lần lưu |
| 5 | is_submit | TINYINT(1) |  |  |  | 0 | 1 Xác nhận, 0 Lưu nháp |
| 6 | actor | VARCHAR(100) |  |  | F\* |  | Người thực hiện |

#### code_sequence

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | prefix | VARCHAR(10) |  | x |  |  | Tiền tố: ĐXMS, HS, RSTK |
| 2 | year | INT |  | x |  |  | Năm |
| 3 | last_no | INT |  |  |  | 0 | Số đã cấp gần nhất; tăng trong cùng giao dịch cấp mã, không lùi khi lần lưu lỗi |

### 5.1.3 Constraint

| STT | Bảng | Ràng buộc | Nội dung |
|----|----|----|----|
| 1 | Mọi bảng | Khóa chính | id |
| 2 | proposal, profile, quotation, stock_review, vendor | Duy nhất | code. Mã cấp qua code_sequence, không dùng lại (BR-DXMS-01-01, BR-DXMS-06-01) |
| 3 | profile | Duy nhất | processing_key: mỗi ĐXMS tối đa một hồ sơ PROCESSING (BR-DXMS-C-02) |
| 4 | profile | Khóa ngoại | proposal_id → proposal; base_profile_id → profile |
| 5 | profile | Kiểm tra | type = ADJUSTMENT thì base_profile_id, adjust_no khác rỗng |
| 6 | profile_version | Duy nhất | (profile_id, no) |
| 7 | profile_basis | Duy nhất | (profile_id, doc_id) |
| 8 | basis_doc | Duy nhất | (doc_no, issued_at) trên bản ghi chưa xóa (BR-DXMS-02-03) |
| 9 | proposal_item | Khóa ngoại | profile_id → profile; basis_line_id → basis_line; base_item_id → proposal_item |
| 10 | stock_review_line | Duy nhất | (stock_review_id, proposal_item_id) |
| 11 | stock_review_line | Kiểm tra | use_qty ≥ 0 |
| 12 | quotation | Duy nhất | code; (profile_id, round) |
| 13 | quotation_item | Duy nhất | (quotation_id, proposal_item_id) |
| 14 | quotation_vendor | Duy nhất | (quotation_id, vendor_id) |
| 15 | quote | Duy nhất | quotation_vendor_id |
| 16 | quote_line | Duy nhất | (quote_id, quotation_item_id) |
| 17 | quote, quote_line, proposal_item, basis_line | Kiểm tra | exchange_rate \> 0; đơn giá, số lượng ≥ 0 |
| 18 | draft | Duy nhất | profile_version_id |
| 19 | appraisal_round | Duy nhất | (profile_id, no) |
| 20 | appraisal_agency | Duy nhất | (appraisal_round_id, agency_id) |
| 21 | bm04_item | Duy nhất | (bm04_id, section) |
| 22 | meeting | Duy nhất | (profile_id, no) |
| 23 | bm05_item, bm06_item | Duy nhất | (profile_version_id, section) |
| 24 | bm06, bm08, group_report | Duy nhất | profile_id |
| 25 | profile_adjust_row | Duy nhất | (profile_id, field) |
| 26 | sign_request | Duy nhất | request_code khi khác rỗng; Gửi lại không tạo yêu cầu trùng (BR-DXMS-C-21) |
| 27 | code_sequence | Duy nhất | (prefix, year) |
| 28 | proposal_member | Duy nhất | (proposal_id, step, user_id) |
| 29 | proposal_member, member_log | Khóa ngoại | proposal_id → proposal; member_log.profile_id → profile |

Bảng con xóa theo bảng cha không áp dụng: văn bản căn cứ xóa mềm; ĐXMS, hồ sơ chỉ xóa mềm khi ĐXMS chưa gửi hoặc bị trả lại (BR-DXMS-01-05, BR-DXMS-06-01).

### 5.1.4 Index

| STT | Tên index | Bảng | Cột | Mục đích |
|----|----|----|----|----|
| 1 | idx_proposal_list | proposal | deleted, unit_id, created_at | Danh sách ĐXMS theo đơn vị, sắp Ngày tạo |
| 2 | idx_proposal_status | proposal | status | Lọc trạng thái |
| 3 | idx_proposal_mission | proposal | mission_code | Lọc Nhiệm vụ / Đề tài, dự án |
| 4 | idx_profile_proposal | profile | proposal_id, status | Hồ sơ của ĐXMS, hồ sơ hiển thị, hồ sơ chi phối |
| 5 | idx_profile_list | profile | unit_id, type, status, updated_at | Danh sách hồ sơ |
| 6 | idx_profile_instance | profile | process_instance_key | Tìm hồ sơ từ sự kiện Camunda |
| 7 | idx_profile_doc | profile_doc | profile_id, step_no, profile_version_id | Văn bản đầu ra |
| 8 | idx_sign_doc | sign_request | profile_doc_id, sent_at | Lịch sử ký |
| 9 | idx_basis_line_doc | basis_line | basis_doc_id | Dòng của văn bản |
| 10 | idx_item_basis_line | proposal_item | basis_line_id | Tính phần căn cứ đã dùng (BR-DXMS-02-05) |
| 11 | idx_item_profile | proposal_item | profile_id, sort_no | Hạng mục của hồ sơ |
| 12 | idx_stock_line_item | stock_review_line | item_code, hold_status | Tính Đang giữ theo Mã hàng (BR-DXMS-03-02) |
| 13 | idx_quotation_list | quotation | status, sent_at | Danh sách yêu cầu báo giá |
| 14 | idx_quotation_profile | quotation | profile_id, round | Yêu cầu của hồ sơ |
| 15 | idx_opinion_round | opinion | profile_id, appraisal_round_id, status | Bảng ý kiến, lọc kết quả |
| 16 | idx_bm04_round | bm04 | appraisal_round_id, agency_id, profile_version_no | Tính BM-04 hợp lệ |
| 17 | idx_vendor_tax | vendor | tax_code | Kiểm tra Mã số thuế (BR-DXMS-04-04) |
| 18 | idx_member_log | member_log | proposal_id, created_at | Lịch sử thay đổi nhân sự của luồng |

Mọi cột khóa ngoại có index riêng nếu không là cột đầu của index trên.

### 5.1.5 Trigger

Không sử dụng. Cập nhật trạng thái ĐXMS, giá trị hiệu lực, phần tạm giữ, kết quả dòng ý kiến do service thực hiện trong cùng giao dịch với thao tác nghiệp vụ.

### 5.1.6 Store Procedure/Function

Không sử dụng. Logic sinh mã, tính toán, kiểm tra nằm ở service; cột processing_key là cột sinh của bảng, không phải hàm.

# 6. THIẾT KẾ ĐẢM BẢO TUÂN THỦ TIÊU CHUẨN QUẢN TRỊ DỮ LIỆU

Mục này liệt kê dữ liệu của module cần quản trị, bảo mật, kiểm soát chất lượng, quản lý siêu dữ liệu và lưu trữ. Tên bảng, trường theo mục 5.

## 6.1 Quản trị dữ liệu

Bảng danh mục dữ liệu CDE:

| STT | Tên trường dữ liệu | Mô tả | Bảng dữ liệu | Trường dữ liệu | Loại dữ liệu | Chủ sở hữu dữ liệu |
|----|----|----|----|----|----|----|
| 1 | Mã ĐXMS | Mã định danh ĐXMS, duy nhất, không dùng lại (BR-DXMS-01-01) | proposal | code | Dữ liệu chủ | Đơn vị đề xuất |
| 2 | Tên ĐXMS | Tên đề xuất mua sắm | proposal | title | Dữ liệu chủ | Đơn vị đề xuất |
| 3 | Đơn vị đề xuất | Đơn vị có nhu cầu hoặc được giao chủ trì | proposal | unit_id | Dữ liệu chủ | Đơn vị đề xuất |
| 4 | Mật | Độ mật của ĐXMS, quyết định phạm vi xem và cách ký (BR-DXMS-C-25) | proposal, profile | secret | Dữ liệu chủ | Đơn vị đề xuất |
| 5 | Mã hồ sơ | Mã định danh hồ sơ Phê duyệt, Điều chỉnh (BR-DXMS-06-01) | profile | code | Dữ liệu giao dịch | Đơn vị đề xuất |
| 6 | Trạng thái hồ sơ | Trạng thái suy từ tiến trình (mục 2.3.1.2) | profile | status | Dữ liệu giao dịch | Đơn vị đề xuất |
| 7 | Tổng giá trị hồ sơ | Tổng giá trị theo cơ sở giá, tỷ đồng, gồm VAT (BR-DXMS-06-03) | profile | total_value | Dữ liệu giao dịch | Đơn vị đề xuất |
| 8 | Giá trị trước điều chỉnh | Giá trị của hồ sơ căn cứ khi tạo hồ sơ Điều chỉnh (BR-DXMS-09-05) | profile | value_before | Dữ liệu giao dịch | Đơn vị đề xuất |
| 9 | Hạng mục mua sắm | Tên, số lượng đề xuất của từng hạng mục | proposal_item | name, proposed_qty | Dữ liệu giao dịch | Đơn vị đề xuất |
| 10 | Văn bản căn cứ | Số, ngày, giá trị văn bản căn cứ (BR-DXMS-02-03) | basis_doc | doc_no, issued_at, value | Dữ liệu tham chiếu | Đơn vị ban hành văn bản căn cứ |
| 11 | Kết quả rà soát tồn kho | Số lượng sổ sách, thực tế, sử dụng (BR-DXMS-03-07) | stock_review_line | book_qty, actual_qty, use_qty | Dữ liệu giao dịch | Đơn vị quản lý kho |
| 12 | Đơn giá báo giá | Đơn giá nhà cung cấp báo (BR-DXMS-04-09) | quote_line | unit_price | Dữ liệu giao dịch | TTMS |
| 13 | Cơ sở giá | Báo giá được chọn làm cơ sở giá của hạng mục (BR-DXMS-04-10) | quotation_item | base_quote_id, base_reason | Dữ liệu giao dịch | TTMS |
| 14 | Nhà cung cấp | Tên, email nhận yêu cầu báo giá | vendor | name, email | Dữ liệu chủ | TTMS |
| 15 | Ý kiến thẩm định | Ý kiến của CQCM và quyết định xử lý (BR-DXMS-07-05) | opinion | decision, explanation | Dữ liệu giao dịch | CQCM tương ứng |
| 16 | Kết quả ký | Trạng thái, thời điểm nhận kết quả ký (BR-DXMS-C-21) | sign_request | status, result_at | Dữ liệu giao dịch | Người ký |

## 6.2 Bảo mật dữ liệu

Danh sách dữ liệu cần tuân thủ tiêu chuẩn bảo mật:

| STT | Tên trường dữ liệu | Hệ thống/Phân hệ | Phân cấp bảo mật | Phân loại bảo mật | Định nghĩa các vai trò và phân quyền dữ liệu tương ứng | Làm mờ - marking dữ liệu |
|----|----|----|----|----|----|----|
| 1 | Toàn bộ dữ liệu ĐXMS, hồ sơ có Mật = Có | ĐTMS / Quản lý ĐXMS | Mật | Dữ liệu nghiệp vụ mật | Chỉ người tạo, ĐV, CH của đơn vị đề xuất và người thuộc danh sách xử lý của hồ sơ được xem (BR-DXMS-01-09, BR-DXMS-C-25). Người khác không có dòng trên danh sách, mở bằng đường dẫn thì báo không có quyền | Hiện nhãn Mật trên danh sách, chi tiết. Văn bản ký bản giấy, không gửi qua VOffice, không gửi yêu cầu báo giá qua email hệ thống khi chưa được duyệt (BR-DXMS-04-07) |
| 2 | Giá trị, đơn giá, cơ sở giá | ĐTMS / Quản lý ĐXMS | Nội bộ | Dữ liệu tài chính | Theo phạm vi xem hồ sơ (BR-DXMS-01-09). Giá trị hiệu lực hiện "-" khi người xem không được thấy hồ sơ quyết định giá trị | Không làm mờ với người được xem; ẩn với người ngoài phạm vi |
| 3 | Báo giá, tài liệu báo giá của nhà cung cấp | ĐTMS / Quản lý ĐXMS | Nội bộ | Dữ liệu tài chính của bên thứ ba | Theo phạm vi xem hồ sơ. Không gửi báo giá của nhà cung cấp này cho nhà cung cấp khác | Không làm mờ |
| 4 | Email, mã số thuế nhà cung cấp | ĐTMS / Danh mục nhà cung cấp | Nội bộ | Thông tin liên hệ | Người lập yêu cầu báo giá và người xem hồ sơ | Không làm mờ |
| 5 | Ý kiến thẩm định, BM-04 của CQCM | ĐTMS / Quản lý ĐXMS | Nội bộ | Dữ liệu nghiệp vụ | Mỗi CQCM chỉ thấy ý kiến của cơ quan mình (BR-DXMS-07-04); đơn vị đề xuất, TTMS thấy tất cả | Không làm mờ |
| 6 | Văn bản đã ký, kết quả ký | ĐTMS / Quản lý ĐXMS | Theo Mật của hồ sơ | Văn bản hành chính | Theo phạm vi xem hồ sơ | Theo dòng 1 nếu hồ sơ Mật |
| 7 | Nhật ký thao tác | Dịch vụ nhật ký dùng chung | Nội bộ | Dữ liệu kiểm soát | Chỉ quản trị hệ thống truy vấn (mục 2.3.5) | Không làm mờ |

Giải pháp đảm bảo:

| Dữ liệu | DB | App | BI | SOC |
|----|----|----|----|----|
| Dữ liệu Mật (dòng 1) | Tài khoản ứng dụng riêng cho CSDL module; người dùng không truy cập trực tiếp CSDL | Lọc phạm vi xem ở phía xử lý cho mọi danh sách, chi tiết, xuất tệp, không chỉ ẩn trên giao diện (BR-DXMS-01-09); ký bản giấy | Không cung cấp cho kho dữ liệu, báo cáo | Ghi nhật ký mọi thao tác xem, sửa, ký |
| Dữ liệu tài chính (dòng 2, 3) | Như trên | Lọc theo phạm vi xem hồ sơ; giá trị hiệu lực tính trên toàn bộ hồ sơ hoàn thành | Không cung cấp | Ghi nhật ký thao tác sửa, xuất tệp |
| Ý kiến thẩm định (dòng 5) | Như trên | Lọc theo CQCM của người xem | Không cung cấp | Ghi nhật ký |
| Tệp đính kèm, văn bản | Lưu trong kho tệp dùng chung, CSDL chỉ giữ mã tệp | Tải tệp qua phía xử lý, kiểm tra quyền xem hồ sơ trước khi trả tệp | Không cung cấp | Ghi nhật ký tải, xuất |

## 6.3 Chất lượng dữ liệu

Danh sách dữ liệu cần tuân thủ tiêu chuẩn chất lượng dữ liệu:

| STT | Luật check | Đối tượng check | Loại tiêu chuẩn đánh giá | Mô tả chi tiết luật đánh giá | Đầu vào cần cung cấp |
|----|----|----|----|----|----|
| 1 | Mã duy nhất | proposal.code, profile.code | Tính duy nhất | Không có hai bản ghi cùng mã, kể cả bản ghi đã xóa mềm (BR-DXMS-01-01, BR-DXMS-06-01) | Bảng proposal, profile |
| 2 | Trường bắt buộc | Tên ĐXMS, Nhiệm vụ / Đề tài, dự án, Đơn vị đề xuất, Mức ưu tiên, Mật | Tính đầy đủ | Không rỗng, không chỉ gồm khoảng trắng (mục 4.5) | Bảng proposal |
| 3 | Tham chiếu còn hợp lệ | proposal.unit_id, proposal.mission_code | Tính toàn vẹn | Giá trị phải còn trong danh mục nguồn tại thời điểm lưu (BR-DXMS-01-10) | Danh mục đơn vị, nhiệm vụ |
| 4 | Giá trị trong miền | proposal.estimated_value, số lượng, đơn giá, tỷ giá | Tính hợp lệ | Không âm; tối đa 9 chữ số phần nguyên, 2 chữ số thập phân; tỷ giá lớn hơn 0 khi tiền tệ khác VNĐ | Bảng proposal, proposal_item, quote, quote_line |
| 5 | Tổng giá trị khớp hạng mục | profile.total_value | Tính nhất quán | Bằng tổng thành tiền các hạng mục theo cơ sở giá (BR-DXMS-06-03) | Bảng profile, proposal_item, quotation_item, quote_line |
| 6 | Trạng thái suy ra | Trạng thái ĐXMS, hồ sơ | Tính nhất quán | Trạng thái ĐXMS khớp trạng thái các hồ sơ; trạng thái hồ sơ khớp tiến trình (mục 2.3.1) | Bảng proposal, profile, tiến trình |
| 7 | Số lượng không vượt căn cứ | proposal_item.proposed_qty | Tính nhất quán | So với phần còn dùng được của dòng căn cứ; vượt thì cảnh báo (BR-DXMS-02-05) | Bảng proposal_item, basis_line |
| 8 | Khoảng ngày hợp lệ | Ngày báo giá, ngày hiệu lực báo giá, ngày lọc | Tính hợp lệ | Ngày bắt đầu không lớn hơn ngày kết thúc | Bảng quote |
| 9 | Định dạng email | Email nhà cung cấp | Tính hợp lệ | Đúng định dạng email (mục 4.5) | Bảng vendor |
| 10 | Phiên bản kết quả ký | sign_request | Tính kịp thời | Kết quả ký chỉ hợp lệ trên đúng phiên bản hồ sơ hiện tại (BR-DXMS-C-11) | Bảng sign_request, profile_version |

## 6.4 Quản lý siêu dữ liệu

### 6.4.1 Thông tin đối tượng dữ liệu

| STT | Tên đối tượng | Mô tả | Loại đối tượng | Thông tin liên quan | Kiểu dữ liệu | Thời gian tạo | Thời gian chỉnh sửa lần cuối | Cấp độ bảo mật | Dữ liệu trọng yếu | Đơn vị chủ dữ liệu | Đầu mối quản lý dữ liệu | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| 01 | proposal | ĐXMS | Bảng | Mục 3.1.1 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật | Có | Đơn vị đề xuất | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 02 | profile | Hồ sơ Phê duyệt, Điều chỉnh | Bảng | Mục 3.1.6, 3.1.9 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật | Có | Đơn vị đề xuất | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 03 | proposal_item | Hạng mục mua sắm | Bảng | Mục 3.1.2 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật của hồ sơ | Có | Đơn vị đề xuất | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 04 | quotation, quote, quote_line | Yêu cầu báo giá, báo giá | Bảng | Mục 3.1.4, 3.1.5 | Bảng quan hệ | Theo created_at | Theo updated_at | Nội bộ | Có | TTMS | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 05 | opinion, appraisal_round | Thẩm định, ý kiến | Bảng | Mục 3.1.7 | Bảng quan hệ | Theo created_at | Theo updated_at | Nội bộ | Có | CQCM | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 06 | sign_request, profile_doc | Văn bản, trình ký | Bảng | Mục 3.1.6, 3.1.8 | Bảng quan hệ | Theo created_at | Theo updated_at | Theo Mật của hồ sơ | Có | Đơn vị đề xuất | TTMS | VHT | Đơn vị phát triển ĐTMS |
| 07 | Tệp đính kèm | Tài liệu, văn bản, báo giá | Tệp | Mục 3.1.6 | DOCX, XLSX, PDF | Thời điểm tải lên | Không sửa, chỉ thay | Theo Mật của hồ sơ | Có | Đơn vị tải lên | TTMS | VHT | Đơn vị phát triển ĐTMS |

Các bảng khác của mục 5.1.2 có siêu dữ liệu như bảng cha của chúng.

### 6.4.2 Thông tin hệ thống

| STT | Tên ứng dụng | Mô tả | Phiên bản | Đơn vị chủ sở hữu hệ thống | Đầu mối quản trị kỹ thuật |
|----|----|----|----|----|----|
| 01 | ĐTMS – Quản lý đề xuất mua sắm | Lập, thẩm định, phê duyệt, điều chỉnh ĐXMS | 1.0 | VHT | Đơn vị phát triển ĐTMS |

### 6.4.3 Thông tin luồng dữ liệu

| STT | Tên luồng dữ liệu | Mô tả | Lệnh tổng hợp | Đầu mối quản lý | Hệ thống/nghiệp vụ sử dụng luồng |
|----|----|----|----|----|----|
| 01 | Tồn kho | Nhận tồn kho sổ sách, kiểm thực tế, phần đang giữ | Theo giao tiếp của phân hệ Quản lý tài sản | Đơn vị quản lý kho | Rà soát tồn kho (mục 3.1.3) |
| 02 | Dữ liệu căn cứ | Nhận kế hoạch, dự toán, eBOM, mBOM | Chưa xác định | Đơn vị ban hành căn cứ | Căn cứ và hạng mục (mục 3.1.2) |
| 03 | Trình ký | Gửi văn bản trình ký, nhận kết quả ký | Theo giao tiếp VOffice | Văn phòng | Các bước ký (mục 3.1.8) |
| 04 | Đồng bộ SAP | Gửi thông tin từ tờ trình đã phê duyệt | Theo giao tiếp SAP | Phòng Tài chính | Phê duyệt (mục 3.1.8) |
| 05 | AI | Gửi nội dung hồ sơ, nhận gợi ý, kết quả kiểm tra | Theo giao tiếp AI | Đơn vị phát triển ĐTMS | Các bước AI (BR-DXMS-08-06) |
| 06 | Kết quả đã thực hiện | Nhận kết quả lựa chọn nhà thầu, hợp đồng | Chưa xác định | TTMS | Điều chỉnh ĐXMS (mục 3.1.9) |

### 6.4.4 Thông tin thuật ngữ nghiệp vụ

Thuật ngữ nghiệp vụ của module định nghĩa tại mục 1.3. Bảng sau ghi các thuật ngữ có quy tắc tính:

| STT | Tên thuật ngữ | Tên viết tắt / tên gợi nhớ | Định nghĩa | Quy tắc nghiệp vụ/công thức tính | Đơn vị định nghĩa thuật ngữ | Các thuật ngữ liên quan | Trường dữ liệu liên kết | Thời điểm tạo | Lịch sử chỉnh sửa |
|----|----|----|----|----|----|----|----|----|----|
| 01 | Đề xuất mua sắm | ĐXMS | Mục 1.3 | Trạng thái suy từ hồ sơ (mục 2.3.1.1) | VHT | Hồ sơ | proposal.code | 02/11/2026 | Theo bảng ghi nhận thay đổi |
| 02 | Giá trị hiệu lực | — | Mục 1.3 | BR-DXMS-C-04 | VHT | Phiên bản có hiệu lực | profile.total_value | 02/11/2026 | Theo bảng ghi nhận thay đổi |
| 03 | Cơ sở giá | — | Mục 1.3 | BR-DXMS-04-10 | VHT | Báo giá | quotation_item.base_quote_id | 02/11/2026 | Theo bảng ghi nhận thay đổi |
| 04 | Tồn khả dụng | — | Mục 1.3 | BR-DXMS-03-02 | VHT | Rà soát tồn kho | stock_review_line.use_qty | 02/11/2026 | Theo bảng ghi nhận thay đổi |
| 05 | Vòng xử lý | — | Mục 1.3 | BR-DXMS-C-15 | VHT | Lần thẩm định | profile | 02/11/2026 | Theo bảng ghi nhận thay đổi |
| 06 | Ngày làm việc | NLV | Mục 1.3 | Mục 2.3.3 | VHT | Hạn xử lý | — | 02/11/2026 | Theo bảng ghi nhận thay đổi |

## 6.5 Lưu trữ và vận hành

| STT | Dữ liệu | Mô tả | Đối tượng dữ liệu | Thời gian lưu trữ trên hạ tầng tốc độ cao | Thời gian lưu trữ trên hạ tầng tốc độ trung bình | Thời gian lưu trữ trên hạ tầng tốc độ thấp (backup offline) | Tần suất backup |
|----|----|----|----|----|----|----|----|
|  | **Dữ liệu nghiệp vụ** |  |  |  |  |  |  |
| 01 | ĐXMS, hồ sơ, hạng mục, báo giá, thẩm định | Dữ liệu các bảng mục 5.1.2 | Dữ liệu giao dịch | Toàn bộ thời gian vận hành | Không áp dụng | Lâu dài | Hằng ngày |
| 02 | Tệp đính kèm, văn bản đã ký | Tệp trong kho tệp dùng chung | Tệp | Toàn bộ thời gian vận hành | Không áp dụng | Lâu dài | Hằng ngày |
|  | **Dữ liệu kiểm soát** |  |  |  |  |  |  |
| 03 | Nhật ký thao tác | Mục 2.3.5 | Nhật ký | Theo dịch vụ nhật ký dùng chung | Theo dịch vụ nhật ký dùng chung | Theo dịch vụ nhật ký dùng chung | Theo dịch vụ nhật ký dùng chung |

Không xóa vật lý ĐXMS, hồ sơ; chỉ xóa mềm ĐXMS chưa gửi hoặc bị trả lại (BR-DXMS-01-05).

# 7. PHỤ LỤC

## 7.1 Bảng bước quy trình

Áp dụng cho quy trình phê duyệt ĐXMS MS01. Quy trình điều chỉnh ĐXMS MS02 có cùng số bước, cùng tác nhân và cùng nhánh; tên bước, phần khác biệt mô tả tại nghiệp vụ 3.1.9. Cột Áp dụng ghi luồng con (BR-DXMS-C-05); với hồ sơ Điều chỉnh đọc MS01.01, .02, .03 là MS02.01, .02, .03. Giai đoạn định nghĩa tại mục 2.3.1.4.

| Bước | Tên bước | Tác nhân | Giai đoạn | Loại | Chức năng | Áp dụng | Bước quy trình ban hành | Văn bản |
|----|----|----|----|----|----|----|----|----|
| 1 | Chọn căn cứ và nội dung mua sắm | Đơn vị đề xuất | GĐ-01 | Người dùng | DTMS_CN_0161 | Cả ba | Bước 1 | — |
| 2 | Lấy dữ liệu căn cứ đã phê duyệt | Hệ thống | GĐ-01 | Tự động | DTMS_CN_0161 | Cả ba | Bước 1 | — |
| 3 | AI gợi ý thông tin cơ bản ĐXMS | Hệ thống | GĐ-01 | Tự động | DTMS_CN_0161 | Cả ba | Bước 1 | — |
| 4 | Rà soát và xác nhận thông tin cơ bản | Đơn vị đề xuất | GĐ-01 | Người dùng | DTMS_CN_0161 | Cả ba | Bước 1 | Thông tin cơ bản |
| 5 | Chọn/bóc tách căn cứ mua sắm | Đơn vị đề xuất | GĐ-01 | Người dùng | DTMS_CN_0161 | Cả ba | Bước 1 | — |
| 6 | Đối chiếu Dự toán + eBOM + mBOM và thông tin tồn kho từ module Quản lý kho | Hệ thống | GĐ-01 | Tự động | DTMS_CN_0161 | Cả ba | Bước 1 | — |
| 7 | Nhận thông tin rà soát tồn kho khả dụng | Đơn vị đề xuất | GĐ-02 | Người dùng | DTMS_CN_0143 | Cả ba | Bước 1 | Kết quả rà soát tồn kho |
| 8 | Khởi tạo yêu cầu báo giá | Đơn vị đề xuất | GĐ-03 | Người dùng | DTMS_CN_0145 | Cả ba | Bước 1 | Yêu cầu báo giá |
| 9 | Gửi yêu cầu báo giá thay TTMS | Hệ thống | GĐ-03 | Tự động | DTMS_CN_0145 | Cả ba | Bước 1 | Yêu cầu báo giá |
| 10 | Tổng hợp và kiểm tra báo giá | Đơn vị đề xuất | GĐ-03 | Người dùng | DTMS_CN_0148 | Cả ba | Bước 1 | Báo giá |
| 11 | Hoàn thiện dự thảo ĐXMS (\<160 tỷ) | Đơn vị đề xuất | GĐ-04 | Người dùng | DTMS_CN_0162 | MS01.03 | Bước 8 | BM-09, Checklist 02 |
| 12 | Hoàn thiện dự thảo ĐXMS (≥160 tỷ) | Đơn vị đề xuất | GĐ-04 | Người dùng | DTMS_CN_0162 | MS01.01, .02 | Bước 2 | BM-01, Checklist 01 |
| 13 | Thẩm định cấp đơn vị | Chỉ huy đơn vị đề xuất | GĐ-05 | Người dùng | DTMS_CN_0162 | Cả ba | Bước 2, 8 | BM-01, Checklist 01 hoặc BM-09, Checklist 02 |
| 14 | AI lọc nội dung chưa đạt và hướng dẫn sửa dự thảo | Hệ thống | GĐ-04 | Tự động | DTMS_CN_0162 | Cả ba | Bước 2, 8 | BM-01, Checklist 01 hoặc BM-09, Checklist 02 |
| 15 | Tạo dự thảo yêu cầu thẩm định, trình ký và thông báo | Hệ thống | GĐ-06 | Tự động | DTMS_CN_0163 | Cả ba | Bước 2, 8 | BM-03 |
| 16 | Lập phiếu yêu cầu thẩm định và chọn CQCM | Đơn vị đề xuất | GĐ-06 | Người dùng | DTMS_CN_0163 | Cả ba | Bước 2, 8 | BM-03 |
| 17 | Xác nhận danh sách CQCM thẩm định | TTMS | GĐ-06 | Người dùng | DTMS_CN_0163 | Cả ba | Bước 2, 8 | BM-03 |
| 18 | Gửi yêu cầu thẩm định, trình ký và thông báo | Hệ thống | GĐ-06 | Tự động | DTMS_CN_0163 | Cả ba | Bước 2, 8 | BM-03 |
| 19 | Rà soát, hoàn thiện BM-04 | CQCM | GĐ-07 | Người dùng | DTMS_CN_0164 | Cả ba | Bước 3, 8 | BM-04 |
| 20 | Xác nhận trình ký BM-04 | Chỉ huy CQCM | GĐ-07 | Người dùng | DTMS_CN_0164 | Cả ba | Bước 3, 8 | BM-04 |
| 21 | AI lọc nội dung cần sửa trên BM-04 | Hệ thống | GĐ-07 | Tự động | DTMS_CN_0164 | Cả ba | Bước 3, 8 | BM-04 |
| 22 | Tạo/gửi trình ký BM-04 và thông báo qua VOffice | Hệ thống | GĐ-07 | Tự động | DTMS_CN_0164 | Cả ba | Bước 3, 8 | BM-04 |
| 23 | Tổng hợp BM-04 đã ký của các CQCM | Hệ thống | GĐ-07 | Tự động | DTMS_CN_0164 | Cả ba | Bước 3, 8 | BM-04 |
| 24 | AI kiểm tra xung đột BM-04 giữa các CQCM | Hệ thống | GĐ-07 | Tự động | DTMS_CN_0165 | Cả ba | Bước 3, 8 | BM-04 |
| 25 | AI tóm tắt nội dung NOK và gửi đơn vị đề xuất | Hệ thống | GĐ-08 | Tự động | DTMS_CN_0165 | Cả ba | Bước 4, 8 | BM-04 |
| 26 | Rà soát BM-04 và xác định nội dung cần cập nhật ĐXMS | Đơn vị đề xuất | GĐ-08 | Người dùng | DTMS_CN_0165 | Cả ba | Bước 4, 8 | BM-04, BM-01 hoặc BM-09 |
| 27 | Hoàn chỉnh hồ sơ trình ĐXMS | Đơn vị đề xuất | GĐ-10 | Người dùng | DTMS_CN_0165 | Cả ba | Bước 4, 8 | BM-01 hoặc BM-09, BM-02, BM-04, Checklist |
| 28 | Lập nội dung giải trình | Đơn vị đề xuất | GĐ-08 | Người dùng | DTMS_CN_0165 | Cả ba | Bước 4, 8 | BM-02, Phụ lục 1 |
| 29 | Tăng số vòng xử lý lại | Hệ thống | GĐ-08 | Tự động | DTMS_CN_0165 | Cả ba | Bước 4, 8 | — |
| 30 | Gửi cảnh báo và yêu cầu họp | Hệ thống | GĐ-09 | Tự động | DTMS_CN_0165 | Cả ba | Xử lý ngoại lệ | — |
| 31 | Tổ chức họp thống nhất các bên | TTMS | GĐ-09 | Người dùng | DTMS_CN_0165 | Cả ba | Xử lý ngoại lệ | — |
| 32 | Cập nhật kết quả cuộc họp | TTMS | GĐ-09 | Người dùng | DTMS_CN_0165 | Cả ba | Xử lý ngoại lệ | Kết quả cuộc họp |
| 33 | Trình cấp cao hơn kết luận | TTMS | GĐ-09 | Người dùng | DTMS_CN_0165 | Cả ba | Xử lý ngoại lệ | Kết quả cuộc họp |
| 34 | Xem xét, kết luận nội dung chưa thống nhất | Thủ trưởng VHT | GĐ-09 | Người dùng | DTMS_CN_0165 | Cả ba | Xử lý ngoại lệ | — |
| 35 | Kiểm tra lại nội dung hồ sơ đã hoàn chỉnh | CQCM | GĐ-10 | Người dùng | DTMS_CN_0166 | Cả ba | Bước 4, 8 | BM-01 hoặc BM-09, Checklist |
| 36 | Xác nhận ký BM-04 và Checklist theo luồng | CQCM | GĐ-10 | Người dùng | DTMS_CN_0166 | Cả ba | Bước 4, 8 | BM-04, Checklist |
| 37 | Gửi trình ký và tổng hợp BM-04/Checklist theo luồng | Hệ thống | GĐ-10 | Tự động | DTMS_CN_0166 | Cả ba | Bước 4, 8 | BM-04, Checklist |
| 38 | Ký thẩm định trực tiếp BM-09 | TTMS | GĐ-11 | Người dùng | DTMS_CN_0167 | MS01.03 | Bước 9 | BM-09, Checklist 02 |
| 39 | Ký thẩm định trực tiếp BM-09 | Phó TGĐ/Phó GĐ | GĐ-11 | Người dùng | DTMS_CN_0167 | MS01.03 | Bước 9 | BM-09, Checklist 02 |
| 40 | Gửi trình ký và tổng hợp BM-09 | Hệ thống | GĐ-11 | Tự động | DTMS_CN_0167 | MS01.03 | Bước 9 | BM-09, Checklist 02 |
| 41 | AI soạn thảo Báo cáo kết quả thẩm định | Hệ thống | GĐ-11 | Tự động | DTMS_CN_0168 | MS01.01, .02 | Bước 5, 6 | BM-05 |
| 42 | Rà soát, cập nhật BM-05 | TTMS | GĐ-11 | Người dùng | DTMS_CN_0168 | MS01.01, .02 | Bước 5, 6 | BM-05, Checklist 01 |
| 43 | Xác nhận hồ sơ đủ điều kiện giao ký BM-05 | TTMS | GĐ-11 | Người dùng | DTMS_CN_0168 | MS01.01, .02 | Bước 5, 6 | BM-05, Checklist 01 |
| 44 | Trình ký BM-05 của TTMS | Hệ thống | GĐ-11 | Tự động | DTMS_CN_0168 | MS01.01, .02 | Bước 6 | BM-05 |
| 45 | Thông báo/giao việc ký BM-05 theo phân công | Hệ thống | GĐ-11 | Tự động | DTMS_CN_0168 | MS01.01, .02 | Bước 6 | BM-05 |
| 46 | Xem xét, ký BM-05 | CQCM | GĐ-11 | Người dùng | DTMS_CN_0168 | MS01.01, .02 | Bước 6 | BM-05 |
| 47 | Xem xét, ký BM-05 | Phó TGĐ/Phó GĐ | GĐ-11 | Người dùng | DTMS_CN_0168 | MS01.01, .02 | Bước 6 | BM-05 |
| 48 | Xác định có cần báo cáo TGĐ Tập đoàn | TTMS | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01, .02 | Bước 6 | — |
| 49 | AI soạn Công văn báo cáo TGĐ Tập đoàn | Hệ thống | GĐ-12 | Tự động | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-06 |
| 50 | Rà soát, cập nhật Công văn báo cáo TGĐ | TTMS | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-06 |
| 51 | Xem xét, xác nhận trình ký Công văn báo cáo TGĐ | Thủ trưởng VHT | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-06 |
| 52 | Trình ký BM-06 qua VOffice và chuyển Ban ĐTXD | Hệ thống | GĐ-12 | Tự động | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-06 |
| 53 | Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn | Ban ĐTXD Tập đoàn | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-06, BM-07 |
| 54 | Gửi BM-07 đến TGĐ Tập đoàn | Ban ĐTXD Tập đoàn | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-07 |
| 55 | Thông báo đồng thời cho hai đầu mối | Ban ĐTXD Tập đoàn | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-07 |
| 56 | Xem xét và cho ý kiến về nội dung ĐXMS | TGĐ Tập đoàn | GĐ-12 | Người dùng | DTMS_CN_0169 | MS01.01 | Bước 6 | BM-07 |
| 57 | Tự động sinh dự thảo Quyết định phê duyệt ĐXMS | Hệ thống | GĐ-13 | Tự động | DTMS_CN_0170 | MS01.01, .02 | Bước 7 | BM-08 |
| 58 | Rà soát, xác nhận dự thảo Quyết định phê duyệt | TTMS | GĐ-13 | Người dùng | DTMS_CN_0170 | MS01.01, .02 | Bước 7 | BM-08, Checklist 01 |
| 59 | Trình Quyết định phê duyệt ĐXMS | TTMS | GĐ-13 | Người dùng | DTMS_CN_0170 | MS01.01, .02 | Bước 7 | BM-08, Checklist 01 |
| 60 | Xem xét, phê duyệt ĐXMS | Thủ trưởng VHT | GĐ-13 | Người dùng | DTMS_CN_0170 | Cả ba | Bước 7, 10 | BM-08 hoặc BM-09 |
| 61 | Tạo/gửi ký duyệt trên VOffice | Hệ thống | GĐ-14 | Tự động | DTMS_CN_0170 | Cả ba | Bước 7, 10 | BM-08 hoặc BM-09 |

## 7.2 Bảng nhánh rẽ theo từng cổng

Cột Nguồn là bước đứng trước cổng; cổng nối tiếp cổng ghi kèm nhãn nhánh đã đi qua. Nhãn nhánh theo bản vẽ; nhãn "\<160 tỷ", "≥160 tỷ" là so với ngưỡng hồ sơ giữ (BR-DXMS-C-01, mặc định 160 tỷ đồng); nút tương ứng trên màn ghi ở nghiệp vụ 3.1.8 (ví dụ Không đạt ở bước 13 là nút \[Không đồng ý\], Đồng ý ở bước 60 là nút \[Phê duyệt\]). Chờ-23, chờ-37 là điểm chờ tin báo kết quả ký. Cột Trạng thái là trạng thái hồ sơ sau nhánh.

| Nguồn | Nhãn nhánh | Đích | Áp dụng | Giai đoạn sau nhánh | Trạng thái | Ý nghĩa | Quy tắc |
|----|----|----|----|----|----|----|----|
| 6 | Đủ | 7 | Cả ba | GĐ-02 | Đang xử lý | Dữ liệu căn cứ đầy đủ | BR-DXMS-C-09 |
| 6 | Không đủ | 4 | Cả ba | GĐ-01 | Đang xử lý | Thiếu dữ liệu căn cứ, người dùng rà soát lại thông tin cơ bản | BR-DXMS-C-09 |
| 10 | Đạt | cổng 10/Đạt | Cả ba | GĐ-04 | Đang xử lý | Báo giá đạt, sang phân luồng theo giá trị | BR-DXMS-C-10 |
| 10 | Không đạt | 9 | Cả ba | GĐ-03 | Đang xử lý | Gửi lại yêu cầu báo giá | BR-DXMS-C-10 |
| 10/Đạt | \<160 tỷ | 11 | MS01.03 | GĐ-04 | Đang xử lý | Lập BM-09, Checklist 02 | BR-DXMS-C-01, BR-DXMS-C-06 |
| 10/Đạt | ≥160 tỷ | 12 | MS01.01, .02 | GĐ-04 | Đang xử lý | Lập BM-01, Checklist 01 | BR-DXMS-C-01, BR-DXMS-C-06 |
| 13 | Đồng ý | 15 | Cả ba | GĐ-06 | Đang xử lý | Chỉ huy đơn vị duyệt dự thảo | — |
| 13 | Không đạt | 14 | Cả ba | GĐ-04 | Đang xử lý | AI lọc nội dung chưa đạt | BR-DXMS-C-08 |
| 14 | Sửa dự thảo (\<160 tỷ) | 11 | MS01.03 | GĐ-04 | Đang xử lý | Sửa BM-09 | BR-DXMS-C-01 |
| 14 | Sửa dự thảo (≥160 tỷ) | 12 | MS01.01, .02 | GĐ-04 | Đang xử lý | Sửa BM-01 | BR-DXMS-C-01 |
| 17 | Đồng ý | 18 | Cả ba | GĐ-06 | Đang xử lý | TTMS xác nhận danh sách CQCM đúng, đủ | BR-DXMS-C-12 |
| 17 | Không đồng ý | 16 | Cả ba | GĐ-06 | Đang xử lý | Trả lại, lưu lý do, chọn lại danh sách | BR-DXMS-C-12 |
| 20 | Đồng ý | 22 | Cả ba | GĐ-07 | Đang xử lý | Chỉ huy CQCM đồng ý trình ký BM-04 | BR-DXMS-C-21 |
| 20 | Không đồng ý | 21 | Cả ba | GĐ-07 | Đang xử lý | AI tóm tắt phần cần sửa trên BM-04 | BR-DXMS-C-08 |
| 21 | Sửa BM-04 | 19 | Cả ba | GĐ-07 | Đang xử lý | CQCM sửa BM-04 | — |
| 23 | Chưa đủ | chờ-23 | Cả ba | GĐ-07 | Đang xử lý | Chờ kết quả ký của CQCM còn lại | BR-DXMS-C-13 |
| 23 | Đủ | 24 | Cả ba | GĐ-07 | Đang xử lý | Đủ BM-04 hợp lệ của danh sách đã xác nhận | BR-DXMS-C-13 |
| 24 | Có | 19 | Cả ba | GĐ-07 | Đang xử lý | Có xung đột, CQCM rà soát lại BM-04 | BR-DXMS-C-14 |
| 24 | Không | 25 | Cả ba | GĐ-08 | Đang xử lý | Không có xung đột, tóm tắt ý kiến gửi đơn vị đề xuất | BR-DXMS-C-14 |
| 26 | Đồng ý sửa | 27 | Cả ba | GĐ-10 | Đang xử lý | Tiếp thu toàn bộ ý kiến, không tăng vòng | BR-DXMS-C-15 |
| 26 | Không đồng ý | 28 | Cả ba | GĐ-08 | Đang xử lý | Có nội dung bảo lưu, lập giải trình | BR-DXMS-C-15 |
| 29 | \>2 vòng | 30 | Cả ba | GĐ-09 | Đang xử lý | Cảnh báo, yêu cầu họp | BR-DXMS-C-15, BR-DXMS-C-16 |
| 29 | ≤2 vòng | 13 | Cả ba | GĐ-05 | Đang xử lý | Về Chỉ huy đơn vị, gửi lại CQCM | BR-DXMS-C-15 |
| 32 | Chưa thống nhất | 33 | Cả ba | GĐ-09 | Đang xử lý | TTMS trình Thủ trưởng VHT kết luận | BR-DXMS-C-16 |
| 32 | Đã thống nhất | 27 | Cả ba | GĐ-10 | Đang xử lý | Hoàn chỉnh theo kết quả họp | BR-DXMS-C-16 |
| 34 | Thống nhất phương án | 27 | Cả ba | GĐ-10 | Đang xử lý | Hoàn chỉnh theo kết luận | BR-DXMS-C-16 |
| 34 | Yêu cầu xử lý lại | 12 | Cả ba | GĐ-04 | Đang xử lý | Về lập dự thảo; hồ sơ dưới ngưỡng về bước 11 theo quy tắc | BR-DXMS-C-16 |
| 35 | Chưa đạt | 27 | Cả ba | GĐ-10 | Đang xử lý | CQCM yêu cầu hoàn chỉnh tiếp | BR-DXMS-C-17 |
| 35 | Đạt | 36 | Cả ba | GĐ-10 | Đang xử lý | CQCM xác nhận đã xử lý yêu cầu | BR-DXMS-C-17 |
| 37 | Chưa đủ | chờ-37 | Cả ba | GĐ-10 | Đang xử lý | Chờ đủ kết quả ký của phiên bản hiện tại | BR-DXMS-C-17 |
| 37 | Đủ | cổng 37/Đủ | Cả ba | GĐ-11 | Đang xử lý | Đủ kết quả ký phiên bản hiện tại, sang phân luồng | BR-DXMS-C-17 |
| 37/Đủ | \<160 tỷ | cổng 37/Đủ/\<160 tỷ | MS01.03 | GĐ-11 | Đang xử lý | Sang ký thẩm định trực tiếp BM-09 | BR-DXMS-C-01 |
| 37/Đủ | ≥160 tỷ | 41 | MS01.01, .02 | GĐ-11 | Đang xử lý | Sang lập BM-05 | BR-DXMS-C-01 |
| 37/Đủ/\<160 tỷ | — | 38 | MS01.03 | GĐ-11 | Đang xử lý | Song song: TTMS ký | BR-DXMS-C-19 |
| 37/Đủ/\<160 tỷ | — | 39 | MS01.03 | GĐ-11 | Đang xử lý | Song song: Phó TGĐ/Phó GĐ ký | BR-DXMS-C-19 |
| 38+39 | Đồng ý | 40 | MS01.03 | GĐ-11 | Đang xử lý | Cả hai đồng ý | BR-DXMS-C-19 |
| 38+39 | Không đồng ý | 25 | MS01.03 | GĐ-08 | Đang xử lý | Có bên không đồng ý | BR-DXMS-C-19, BR-DXMS-C-20 |
| 42 | Đồng ý | 43 | MS01.01, .02 | GĐ-11 | Đang xử lý | TTMS đồng ý nội dung BM-05 | BR-DXMS-C-18 |
| 42 | Không đồng ý | 25 | MS01.01, .02 | GĐ-08 | Đang xử lý | Hồ sơ không đủ điều kiện, trả đơn vị đề xuất | BR-DXMS-C-20 |
| 45 | — | 46 | MS01.01, .02 | GĐ-11 | Đang xử lý | Song song: CQCM ký, sau khi TTMS ký thành công | BR-DXMS-C-18, BR-DXMS-C-19 |
| 45 | — | 47 | MS01.01, .02 | GĐ-11 | Đang xử lý | Song song: Phó TGĐ/Phó GĐ ký, sau khi TTMS ký thành công | BR-DXMS-C-18, BR-DXMS-C-19 |
| 46+47 | Đồng ý | 48 | MS01.01, .02 | GĐ-12 | Đang xử lý | Cả hai đồng ý | BR-DXMS-C-19 |
| 46+47 | Không đồng ý | 25 | MS01.01, .02 | GĐ-08 | Đang xử lý | Có bên không đồng ý | BR-DXMS-C-19, BR-DXMS-C-20 |
| 48 | Có | 49 | MS01.01 | GĐ-12 | Đang xử lý | TTMS chọn Có báo cáo TGĐ Tập đoàn | BR-DXMS-08-08 |
| 48 | Không | cổng 48/Không+56/Đồng ý | MS01.02 | GĐ-13 | Đang xử lý | TTMS chọn Không báo cáo, sang phê duyệt | BR-DXMS-08-08 |
| 48/Không+56/Đồng ý | — | 57 | MS01.01, .02 | GĐ-13 | Đang xử lý | Hội tụ, sinh dự thảo BM-08 | — |
| 51 | Đồng ý | 52 | MS01.01 | GĐ-12 | Đang xử lý | Thủ trưởng VHT đồng ý trình ký BM-06 | BR-DXMS-C-21 |
| 51 | Không đồng ý | 25 | MS01.01 | GĐ-08 | Đang xử lý | Thủ trưởng VHT không đồng ý | BR-DXMS-C-20 |
| 53 | Chấp nhận | 54 | MS01.01 | GĐ-12 | Đang xử lý | Ban ĐTXD chấp nhận, lập BM-07 | — |
| 53 | Trả lại | 25 | MS01.01 | GĐ-08 | Đang xử lý | Ban ĐTXD trả lại hồ sơ | BR-DXMS-C-20 |
| 56 | Đồng ý | cổng 48/Không+56/Đồng ý | MS01.01 | GĐ-13 | Đang xử lý | TGĐ Tập đoàn đồng ý | — |
| 56 | Trả lại | 25 | MS01.01 | GĐ-08 | Đang xử lý | TGĐ Tập đoàn trả lại | BR-DXMS-C-20 |
| 60 | Chỉ đạo khác | Kết thúc: Kết thúc theo chỉ đạo khác | Cả ba | — | Dừng xử lý | Hồ sơ sang Dừng xử lý | BR-DXMS-C-22 |
| 60 | Đồng ý | 61 | Cả ba | GĐ-14 | Đang xử lý | Người có thẩm quyền đồng ý, chuyển ký duyệt | BR-DXMS-C-21 |
| 60 | Yêu cầu hoàn chỉnh | 25 | Cả ba | GĐ-08 | Đang xử lý | Người có thẩm quyền yêu cầu hoàn chỉnh | BR-DXMS-C-20 |
| 61 | — | Kết thúc: Đã xác nhận phê duyệt và chuyển VO | Cả ba | — | Hoàn thành | Hồ sơ sang Hoàn thành khi nhận kết quả ký hợp lệ | BR-DXMS-C-21 |
| chờ-23 | Có kết quả mới | 23 | Cả ba | GĐ-07 | Đang xử lý | Tổng hợp lại khi có kết quả ký mới | BR-DXMS-C-13 |
| chờ-37 | Có kết quả mới | 37 | Cả ba | GĐ-10 | Đang xử lý | Tổng hợp lại khi có kết quả ký mới | BR-DXMS-C-17 |

Bổ sung ngoài sơ đồ, hệ thống vẫn phải thực hiện:

| Vị trí | Nội dung | Quy tắc |
|----|----|----|
| Bước 10 | Cổng báo giá đọc thêm kết quả AI kiểm tra báo giá | BR-DXMS-C-10 |
| Sau bước 11, 12 | AI kiểm tra hồ sơ trước khi gửi Chỉ huy đơn vị. Không đạt thì ở lại bước dự thảo, hiện lý do; từ lần Không đạt thứ hai liên tiếp được Vẫn gửi kèm lý do | BR-DXMS-C-08, BR-DXMS-08-06 |
| Bước 26 | Cổng rẽ theo việc có dòng Bảo lưu trong bảng quyết định từng ý kiến, không theo nút người dùng bấm | BR-DXMS-C-15 |
| Bước 24 | Quay về bước 19 tối đa một lần trong một lần thẩm định; AI lỗi thì sang bước 25 | BR-DXMS-07-10 |
| Chờ-23, chờ-37 | BM-04 bị từ chối ký thì về bước 19 (chờ-23) hoặc bước 35 (chờ-37) của đúng CQCM | BR-DXMS-07-03 |
| Bước 18 | Chờ BM-03 Đã ký rồi mới gửi CQCM; Từ chối thì về bước 16 | BR-DXMS-08-04, BR-DXMS-08-05 |
| Bước 44 | BM-05 của TTMS bị từ chối thì về bước 25 | BR-DXMS-08-04, BR-DXMS-C-20 |
| Bước 52 | BM-06 bị từ chối thì về bước 25 như Thủ trưởng VHT không đồng ý | BR-DXMS-08-04 |
| Bước 61 | Văn bản phê duyệt bị từ chối ký thì về bước 25 | BR-DXMS-08-10 |
| 38+39, 46+47 | Nhánh tính Đồng ý khi văn bản của nhánh Đã ký; chờ kết quả ký như chờ-23. VOffice Từ chối tính như Không đồng ý, về bước 25 | BR-DXMS-08-07 |

## 7.3 Bảng cấu hình bước

**\[CẤU HÌNH\]** Sinh từ cấu hình bàn giao (cau-hinh/buoc.csv), không sửa tay. Mỗi dòng là một bước người dùng của BPMN; màn xử lý của bước do nền tảng dựng từ eForm và luật nút ở cột tương ứng, không dựng màn riêng (chương Mô hình thực thi). Task key là quy ước đặt id phần tử khi dựng BPMN trên Camunda.

**Quy trình MS01** — 42 bước người dùng.

| Bước | Task key | Tên bước | Vai trò | Áp dụng | eForm | Luật nút | Văn bản |
|----|----|----|----|----|----|----|----|
| 1 | Activity_1 | Chọn căn cứ và nội dung mua sắm | R-DVDX-CQ | Cả ba | dtms-ms01-t01-can-cu | MS01_T01_HOAN_THANH | — |
| 4 | Activity_4 | Rà soát và xác nhận thông tin cơ bản | R-DVDX-CQ | Cả ba | dtms-ms01-t04-thong-tin-co-ban | MS01_T04_HOAN_THANH | — |
| 5 | Activity_5 | Chọn/bóc tách căn cứ mua sắm | R-DVDX-CQ | Cả ba | dtms-ms01-t05-boc-tach | MS01_T05_GUI_DUYET, MS01_T05_TRA_LAI | — |
| 5.1 | Activity_5.1 | Chỉ huy ĐVĐX xác nhận khởi tạo | R-DVDX-CH | Cả ba | dtms-ms01-t05-1-chi-huy-xac-nhan | MS01_T5.1_XAC_NHAN, MS01_T5.1_TRA_LAI | — |
| 7 | Activity_7 | Nhận thông tin rà soát tồn kho khả dụng | R-QLTS | Cả ba | dtms-ms01-t07-ra-soat-ton-kho | MS01_T07_HOAN_THANH | — |
| 7.1 | Activity_7.1 | Chỉ huy Kho duyệt kết quả rà soát tồn kho | R-QLTS-CH | Cả ba | dtms-ms01-t07-1-chi-huy-kho-duyet | MS01_T7.1_HOAN_THANH, MS01_T7.1_TRA_LAI | — |
| 8 | Activity_8 | Khởi tạo yêu cầu báo giá | R-TTMS-THAU | Cả ba | dtms-ms01-t08-ycbg | MS01_T08_HOAN_THANH | — |
| 10 | Activity_10 | Tổng hợp và kiểm tra báo giá | R-TTMS-THAU | Cả ba | dtms-ms01-t10-bao-gia | MS01_T10_XAC_NHAN, MS01_T10_TRA_LAI | — |
| 10.1 | Activity_10.1 | Chỉ huy Thầu TTMS duyệt kết quả báo giá | R-TTMS-THAU-CH | Cả ba | dtms-ms01-t10-1-chi-huy-thau-duyet | MS01_T10.1_XAC_NHAN, MS01_T10.1_TU_CHOI | — |
| 11 | Activity_11 | Hoàn thiện dự thảo ĐXMS (\<160 tỷ) | R-DVDX-CQ | MS01.03 | dtms-ms01-t11-12-du-thao | MS01_T11_GUI_DUYET | — |
| 12 | Activity_12 | Hoàn thiện dự thảo ĐXMS (≥160 tỷ) | R-DVDX-CQ | MS01.01, MS01.02 | dtms-ms01-t11-12-du-thao | MS01_T12_GUI_DUYET | BM-01; BM-02; BM-09 |
| 13 | Activity_13 | Thẩm định cấp đơn vị | R-DVDX-CH | Cả ba | dtms-ms01-t13-chi-huy-duyet | MS01_T13_XAC_NHAN, MS01_T13_TU_CHOI | BM-01; BM-02; BM-09 |
| 16 | Activity_16 | Lập phiếu yêu cầu thẩm định và chọn CQCM | R-DVDX-CQ | Cả ba | dtms-ms01-t16-chon-cqcm | MS01_T16_GUI_DUYET | BM-03 |
| 16.1 | Activity_16.1 | Chỉ huy ĐVĐX duyệt BM-03 và danh sách CQCM | R-DVDX-CH | Cả ba | dtms-ms01-t16-1-chi-huy-duyet-bm03 | MS01_T16.1_PHE_DUYET, MS01_T16.1_TRA_LAI | — |
| 17 | Activity_17 | Xác nhận danh sách CQCM thẩm định | R-TTMS | Cả ba | dtms-ms01-t17-xac-nhan-cqcm | MS01_T17_XAC_NHAN, MS01_T17_TU_CHOI | BM-03 |
| 19 | Activity_19 | Rà soát, hoàn thiện BM-04 | R-CQCM, R-TC | Cả ba | dtms-ms01-t19-bm04 | MS01_T19_HOAN_THANH | — |
| 20 | Activity_20 | Xác nhận trình ký BM-04 | R-CQCM-CH | Cả ba | dtms-ms01-t20-ky-bm04 | MS01_T20_TRINH_KY, MS01_T20_TU_CHOI | BM-04 |
| 26 | Activity_26 | Rà soát BM-04 và xác định nội dung cần cập nhật ĐXMS | R-DVDX-CQ | Cả ba | dtms-ms01-t26-ket-qua-bm04 | MS01_T26_HOAN_THANH | — |
| 27 | Activity_27 | Hoàn chỉnh hồ sơ trình ĐXMS | R-DVDX-CQ | Cả ba | dtms-ms01-t27-hoan-chinh | MS01_T27_GUI_DUYET | BM-01; BM-09 |
| 28 | Activity_28 | Lập nội dung giải trình | R-DVDX-CQ | Cả ba | dtms-ms01-t28-giai-trinh | MS01_T28_GUI_DUYET | BM-02 |
| 31 | Activity_31 | Tổ chức họp thống nhất các bên | R-TTMS | Cả ba | dtms-ms01-t31-to-chuc-hop | MS01_T31_HOAN_THANH | — |
| 32 | Activity_32 | Cập nhật kết quả cuộc họp | R-TTMS | Cả ba | dtms-ms01-t32-ket-qua-hop | MS01_T32_XAC_NHAN, MS01_T32_TRA_LAI | — |
| 33 | Activity_33 | Trình cấp cao hơn kết luận | R-TTMS | Cả ba | dtms-ms01-t33-trinh-cap-cao | MS01_T33_HOAN_THANH | — |
| 34 | Activity_34 | Xem xét, kết luận nội dung chưa thống nhất | R-TGD-VHT | Cả ba | dtms-ms01-t34-ket-luan | MS01_T34_XAC_NHAN, MS01_T34_TRA_LAI | — |
| 35 | Activity_35 | Kiểm tra lại nội dung hồ sơ đã hoàn chỉnh | R-CQCM, R-TC | Cả ba | dtms-ms01-t35-kiem-tra-sua | MS01_T35_XAC_NHAN, MS01_T35_TRA_LAI | — |
| 36 | Activity_36 | Xác nhận ký BM-04 và Checklist theo luồng | R-CQCM, R-TC | Cả ba | dtms-ms01-t36-ky-checklist | MS01_T36_TRINH_KY | BM-04 ký lại + Checklist 01 (MS01.03: Checklist 02) |
| 38 | Activity_38 | Ký thẩm định trực tiếp BM-09 | R-TTMS | MS01.03 | dtms-ms01-t38-39-ky-bm09 | MS01_T38_TRINH_KY, MS01_T38_TU_CHOI | BM-09 |
| 39 | Activity_39 | Ký thẩm định trực tiếp BM-09 | R-PTGD | MS01.03 | dtms-ms01-t38-39-ky-bm09 | MS01_T39_TRINH_KY, MS01_T39_TU_CHOI | BM-09 |
| 42 | Activity_42 | Rà soát, cập nhật BM-05 | R-TTMS | MS01.01, MS01.02 | dtms-ms01-t42-ra-soat-bm05 | MS01_T42_XAC_NHAN, MS01_T42_TRA_LAI | BM-05 |
| 43 | Activity_43 | Xác nhận hồ sơ đủ điều kiện giao ký BM-05 | R-TTMS | MS01.01, MS01.02 | dtms-ms01-t43-du-dieu-kien | MS01_T43_TRINH_KY, MS01_T43_TRA_LAI | BM-05 |
| 46 | Activity_46 | Xem xét, ký BM-05 | R-CQCM, R-TC | MS01.01, MS01.02 | dtms-ms01-t46-47-ky-bm05 | MS01_T46_TRINH_KY, MS01_T46_TU_CHOI | BM-05 |
| 47 | Activity_47 | Xem xét, ký BM-05 | R-PTGD | MS01.01, MS01.02 | dtms-ms01-t46-47-ky-bm05 | MS01_T47_TRINH_KY, MS01_T47_TU_CHOI | BM-05 |
| 48 | Activity_48 | Xác định có cần báo cáo TGĐ Tập đoàn | R-TTMS | MS01.01, MS01.02 | dtms-ms01-t48-bao-cao-td | MS01_T48_XAC_NHAN, MS01_T48_XAC_NHAN_2 | BM-05 |
| 50 | Activity_50 | Rà soát, cập nhật Công văn báo cáo TGĐ | R-TTMS | MS01.01 | dtms-ms01-t50-51-bm06 | MS01_T50_HOAN_THANH | BM-06 |
| 51 | Activity_51 | Xem xét, xác nhận trình ký Công văn báo cáo TGĐ | R-TGD-VHT | MS01.01 | dtms-ms01-t50-51-bm06 | MS01_T51_TRINH_KY, MS01_T51_TU_CHOI | BM-06 |
| 53 | Activity_53 | Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn | R-BAN-DTXD | MS01.01 | dtms-ms01-t53-56-tap-doan | MS01_T53_XAC_NHAN, MS01_T53_TRA_LAI | BM-06 |
| 54 | Activity_54 | Gửi BM-07 đến TGĐ Tập đoàn | R-BAN-DTXD | MS01.01 | dtms-ms01-t53-56-tap-doan | MS01_T54_HOAN_THANH | BM-06 |
| 55 | Activity_55 | Thông báo đồng thời cho hai đầu mối | R-BAN-DTXD | MS01.01 | dtms-ms01-t53-56-tap-doan | MS01_T55_HOAN_THANH | BM-06 |
| 56 | Activity_56 | Xem xét và cho ý kiến về nội dung ĐXMS | R-BAN-DTXD | MS01.01 | dtms-ms01-t53-56-tap-doan | MS01_T56_XAC_NHAN, MS01_T56_TRA_LAI | BM-06 |
| 58 | Activity_58 | Rà soát, xác nhận dự thảo Quyết định phê duyệt | R-TTMS | MS01.01, MS01.02 | dtms-ms01-t58-60-bm08 | MS01_T58_HOAN_THANH | BM-08 |
| 59 | Activity_59 | Trình Quyết định phê duyệt ĐXMS | R-TTMS | MS01.01, MS01.02 | dtms-ms01-t58-60-bm08 | MS01_T59_GUI_DUYET | BM-08 |
| 60 | Activity_60 | Xem xét, phê duyệt ĐXMS | R-TGD-VHT | Cả ba | dtms-ms01-t58-60-bm08 / dtms-ms01-t60-phe-duyet-bm09 | MS01_T60_PHE_DUYET, MS01_T60_TRA_LAI, MS01_T60_TRA_LAI_2 | BM-08 (MS01.03: BM-09 ô PHÊ DUYỆT) |

**Quy trình MS02** — 38 bước người dùng.

| Bước | Task key | Tên bước | Vai trò | Áp dụng | eForm | Luật nút | Văn bản |
|----|----|----|----|----|----|----|----|
| 1 | Activity_1 | Chọn ĐXMS đã được phê duyệt cần điều chỉnh | R-DVDX-CQ | MS02 | dtms-ms02-t01-dxms-dieu-chinh | MS02_T01_HOAN_THANH | — |
| 4 | Activity_4 | Xác định lý do, phạm vi và xác nhận nội dung điều chỉnh | R-DVDX-CQ | MS02 | dtms-ms02-t04-noi-dung-dieu-chinh | MS02_T04_HOAN_THANH | — |
| 5 | Activity_5 | Chọn/bóc tách căn cứ và nội dung cần điều chỉnh | R-DVDX-CQ | MS02 | dtms-ms02-t05-boc-tach | MS02_T05_GUI_DUYET, MS02_T05_TRA_LAI | — |
| 7 | Activity_7 | Nhận thông tin rà soát tồn kho cập nhật | R-DVDX-CQ | MS02 | dtms-ms02-t07-ra-soat-ton-kho | MS02_T07_HOAN_THANH | — |
| 8 | Activity_8 | Khởi tạo yêu cầu báo giá điều chỉnh | R-DVDX-CQ | MS02 | dtms-ms02-t08-ycbg | MS02_T08_HOAN_THANH | — |
| 10 | Activity_10 | Tổng hợp và kiểm tra báo giá tại thời điểm điều chỉnh | R-DVDX-CQ | MS02 | dtms-ms02-t10-bao-gia | MS02_T10_XAC_NHAN, MS02_T10_TRA_LAI | — |
| 11 | Activity_11 | Hoàn thiện dự thảo điều chỉnh ĐXMS (\<160 tỷ) | R-DVDX-CQ | MS02 | dtms-ms02-t11-12-du-thao | MS02_T11_GUI_DUYET | BM-01; BM-02; BM-09 |
| 12 | Activity_12 | Hoàn thiện dự thảo điều chỉnh ĐXMS (≥160 tỷ) | R-DVDX-CQ | MS02 | dtms-ms02-t11-12-du-thao | MS02_T12_GUI_DUYET | BM-01; BM-02; BM-09 |
| 13 | Activity_13 | Thẩm định cấp đơn vị đối với hồ sơ điều chỉnh | R-DVDX-CH | MS02 | dtms-ms02-t13-chi-huy-duyet | MS02_T13_XAC_NHAN, MS02_T13_TU_CHOI | BM-01; BM-02; BM-09 |
| 16 | Activity_16 | Lập phiếu yêu cầu thẩm định điều chỉnh và chọn CQCM | R-DVDX-CQ | MS02 | dtms-ms02-t16-chon-cqcm | MS02_T16_GUI_DUYET | BM-03 |
| 17 | Activity_17 | Xác nhận danh sách CQCM thẩm định điều chỉnh | R-TTMS | MS02 | dtms-ms02-t17-xac-nhan-cqcm | MS02_T17_XAC_NHAN, MS02_T17_TU_CHOI | BM-03 |
| 19 | Activity_19 | Rà soát, hoàn thiện BM-04 cho hồ sơ điều chỉnh | R-CQCM, R-TC | MS02 | dtms-ms02-t19-bm04 | MS02_T19_HOAN_THANH | — |
| 20 | Activity_20 | Xác nhận trình ký BM-04 | R-CQCM-CH | MS02 | dtms-ms02-t20-ky-bm04 | MS02_T20_TRINH_KY, MS02_T20_TU_CHOI | BM-04 |
| 26 | Activity_26 | Rà soát BM-04 và xác định nội dung cần cập nhật hồ sơ điều chỉnh | R-DVDX-CQ | MS02 | dtms-ms02-t26-ket-qua-bm04 | MS02_T26_HOAN_THANH | — |
| 27 | Activity_27 | Hoàn chỉnh hồ sơ trình điều chỉnh ĐXMS | R-DVDX-CQ | MS02 | dtms-ms02-t27-hoan-chinh | MS02_T27_GUI_DUYET | BM-01; BM-09 |
| 28 | Activity_28 | Lập nội dung giải trình | R-DVDX-CQ | MS02 | dtms-ms02-t28-giai-trinh | MS02_T28_GUI_DUYET | BM-02 |
| 31 | Activity_31 | Tổ chức họp thống nhất các bên | R-TTMS | MS02 | dtms-ms02-t31-to-chuc-hop | MS02_T31_HOAN_THANH | — |
| 32 | Activity_32 | Cập nhật kết quả cuộc họp | R-TTMS | MS02 | dtms-ms02-t32-ket-qua-hop | MS02_T32_XAC_NHAN, MS02_T32_TRA_LAI | — |
| 33 | Activity_33 | Trình cấp cao hơn kết luận | R-TTMS | MS02 | dtms-ms02-t33-trinh-cap-cao | MS02_T33_HOAN_THANH | — |
| 34 | Activity_34 | Xem xét, kết luận nội dung chưa thống nhất | R-TGD-VHT | MS02 | dtms-ms02-t34-ket-luan | MS02_T34_XAC_NHAN, MS02_T34_TRA_LAI | — |
| 35 | Activity_35 | Kiểm tra lại nội dung hồ sơ điều chỉnh đã hoàn chỉnh | R-CQCM, R-TC | MS02 | dtms-ms02-t35-kiem-tra-sua | MS02_T35_XAC_NHAN, MS02_T35_TRA_LAI | — |
| 36 | Activity_36 | Xác nhận ký BM-04 và Checklist theo luồng | R-CQCM, R-TC | MS02 | dtms-ms02-t36-ky-checklist | MS02_T36_TRINH_KY | BM-04 ký lại + Checklist 01 (MS02.03: Checklist 02) |
| 38 | Activity_38 | Ký thẩm định trực tiếp BM-09 | R-TTMS | MS02 | dtms-ms02-t38-39-ky-bm09 | MS02_T38_TRINH_KY, MS02_T38_TU_CHOI | BM-09 |
| 39 | Activity_39 | Ký thẩm định trực tiếp BM-09 | R-PTGD | MS02 | dtms-ms02-t38-39-ky-bm09 | MS02_T39_TRINH_KY, MS02_T39_TU_CHOI | BM-09 |
| 42 | Activity_42 | Rà soát, cập nhật BM-05 | R-TTMS | MS02 | dtms-ms02-t42-ra-soat-bm05 | MS02_T42_XAC_NHAN, MS02_T42_TRA_LAI | BM-05 |
| 43 | Activity_43 | Xác nhận hồ sơ điều chỉnh đủ điều kiện giao ký BM-05 | R-TTMS | MS02 | dtms-ms02-t43-du-dieu-kien | MS02_T43_TRINH_KY, MS02_T43_TRA_LAI | BM-05 |
| 46 | Activity_46 | Xem xét, ký BM-05 | R-CQCM, R-TC | MS02 | dtms-ms02-t46-47-ky-bm05 | MS02_T46_TRINH_KY, MS02_T46_TU_CHOI | BM-05 |
| 47 | Activity_47 | Xem xét, ký BM-05 | R-PTGD | MS02 | dtms-ms02-t46-47-ky-bm05 | MS02_T47_TRINH_KY, MS02_T47_TU_CHOI | BM-05 |
| 48 | Activity_48 | Xác định có cần báo cáo TGĐ Tập đoàn | R-TTMS | MS02 | dtms-ms02-t48-bao-cao-td | MS02_T48_XAC_NHAN, MS02_T48_XAC_NHAN_2 | BM-05 |
| 50 | Activity_50 | Rà soát, cập nhật Công văn báo cáo TGĐ | R-TTMS | MS02 | dtms-ms02-t50-51-bm06 | MS02_T50_HOAN_THANH | BM-06 |
| 51 | Activity_51 | Xem xét, xác nhận trình ký Công văn báo cáo TGĐ | R-TGD-VHT | MS02 | dtms-ms02-t50-51-bm06 | MS02_T51_TRINH_KY, MS02_T51_TU_CHOI | BM-06 |
| 53 | Activity_53 | Xem xét hồ sơ điều chỉnh, lập Báo cáo gửi TGĐ Tập đoàn | R-BAN-DTXD | MS02 | dtms-ms02-t53-56-tap-doan | MS02_T53_XAC_NHAN, MS02_T53_TRA_LAI | BM-06 |
| 54 | Activity_54 | Gửi BM-07 đến TGĐ Tập đoàn | R-BAN-DTXD | MS02 | dtms-ms02-t53-56-tap-doan | MS02_T54_HOAN_THANH | BM-06 |
| 55 | Activity_55 | Thông báo đồng thời cho hai đầu mối | R-BAN-DTXD | MS02 | dtms-ms02-t53-56-tap-doan | MS02_T55_HOAN_THANH | BM-06 |
| 56 | Activity_56 | Xem xét và cho ý kiến về nội dung điều chỉnh ĐXMS | R-BAN-DTXD | MS02 | dtms-ms02-t53-56-tap-doan | MS02_T56_XAC_NHAN, MS02_T56_TRA_LAI | BM-06 |
| 58 | Activity_58 | Rà soát, xác nhận dự thảo Quyết định phê duyệt điều chỉnh | R-TTMS | MS02 | dtms-ms02-t58-60-bm08 | MS02_T58_HOAN_THANH | BM-08 |
| 59 | Activity_59 | Trình Quyết định phê duyệt điều chỉnh ĐXMS | R-TTMS | MS02 | dtms-ms02-t58-60-bm08 | MS02_T59_GUI_DUYET | BM-08 |
| 60 | Activity_60 | Xem xét, phê duyệt điều chỉnh ĐXMS | R-TGD-VHT | MS02 | dtms-ms02-t58-60-bm08 / dtms-ms02-t60-phe-duyet-bm09 | MS02_T60_PHE_DUYET, MS02_T60_TRA_LAI, MS02_T60_TRA_LAI_2 | BM-08 bản điều chỉnh (MS02.03: BM-09 bản điều chỉnh, ô PHÊ DUYỆT) |

## 7.4 Phụ lục E — Biểu mẫu eForm của các bước

**\[CẤU HÌNH\]** Mỗi mục là một eForm bàn giao dưới dạng tệp schema Camunda Form (cau-hinh/eform/\<mã\>.json) để nạp vào Quản lý E-form; **không code thành màn**. Dữ liệu người dùng nhập lưu nguyên JSON theo khóa trường (mục 2.4.3); cột Khóa là tên biến trong JSON và trong biến quy trình, dùng làm trường trộn của mẫu văn bản. Khóa dạng cha\[\].con là cột của dòng trong bảng lặp cha.

Kiểu theo Camunda Form: text, html khối chữ chỉ xem; table bảng chỉ xem đọc biến ở cột Đọc biến; ai khối gợi ý AI chỉ xem; dynamiclist bảng lặp (dynamiclist+: người dùng thêm, xóa dòng); aisuggest bảng gợi ý AI có quyết định, kiểu trường tùy biến (mục 2.4.1), cột Lựa chọn ghi mục → khóa trường nhận giá trị; còn lại là trường nhập. Lựa chọn @biến là danh sách lấy từ biến quy trình. Cột Luồng con: trường chỉ hiện ở các luồng con ghi trong cột, còn lại hiện ở mọi luồng con — một eForm cho mọi luồng con, không tách form.

### 7.4.1 dtms-ms01-t01-can-cu

Quy trình MS01, bước 1.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | — | text | — | — | — | — | — | — | Văn bản căn cứ đầu vào chọn khi tạo luồng hiện sẵn. Xác nhận, chọn thêm hoặc bỏ văn bản; văn bản chưa có trong hệ thống thì bấm \[Khai báo căn cứ\]. |
| 2 | canCu | Văn bản căn cứ | cancu | Có | — | khaiBao=có; boKhiCoHangMuc=không; bangThamKhao=có | — | — | — | Kiểu trường tùy biến Chọn văn bản căn cứ (mục 2.4.1). Bảng lặp, ít nhất một dòng (BR-DXMS-02-01). Giá trị khởi tạo: văn bản căn cứ đầu vào ghi vào hồ sơ khi tạo luồng, biến canCu khởi tạo cùng tiến trình … |
| 3 | canCu\[\].loaiCanCu | Loại căn cứ | select | Có | — | @dmLoaiCanCu | — | — | — | Danh mục Loại tài liệu căn cứ, chỉ mục đang hoạt động: Kế hoạch SXKD năm, Phương án kinh doanh, Tờ trình kinh phí, Quyết định nhiệm vụ khoa học công nghệ, Văn bản chỉ đạo khác. Đổi Loại thì xóa Văn bản căn cứ đã chọn … |
| 4 | canCu\[\].vanBanId | Văn bản căn cứ | select | Có | — | @vanBanCanCu | — | — | — | Có tìm kiếm. Văn bản dùng được theo Loại căn cứ của dòng và BR-DXMS-02-02, lấy ở máy chủ; hiện “{Số} — {Trích yếu}”. Không có văn bản thì ô hiện “Chưa có dữ liệu”, vẫn dùng được \[Khai báo căn cứ\]. KT-10 kiểm tra lại … |

### 7.4.2 dtms-ms01-t04-thong-tin-co-ban

Quy trình MS01, bước 4.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Lý do thiếu thông tin | text | — | — | — | — | =not(thieuThongTin) | thieuThongTin | Thiếu thông tin căn cứ: {{thieuThongTin.lyDo}} — {{thieuThongTin.nguoi}}, {{thieuThongTin.thoiDiem}} |
| 2 | — | Cảnh báo giá trị | text | — | — | — | — | =not(aiEstimateOff) | aiEstimate, hoSo.quyTrinh, hoSo.dieuKien | Giá trị dự kiến khoảng {{aiEstimate}} tỷ đồng, lệch điều kiện của quy trình {{hoSo.quyTrinh}} ({{hoSo.dieuKien}}). Hệ thống sẽ kiểm tra lại sau khi có báo giá. |
| 3 | — | Tên hồ sơ, Mức ưu tiên | text | — | — | — | — | — | hoSo.ten, hoSo.mucUuTien | **Tên hồ sơ:** {{hoSo.ten}} · **Mức ưu tiên:** {{hoSo.mucUuTien}} |
| 4 | aiGoiY | Gợi ý AI — thông tin cơ bản | aisuggest | — | — | Loại mua sắm=purchaseType; Mục đích=purpose; Phạm vi=scope; Thời gian thực hiện=period; Nguồn vốn=fundId | — | — | aiGoiY | Dòng lấy từ biến aiGoiY do bước 3 ghi: Loại mua sắm, Mục đích, Phạm vi, Thời gian thực hiện, Nguồn vốn, Giá trị dự kiến. Quyết định của dòng điền vào trường tương ứng bên dưới |
| 5 | aiGoiY\[\]. | — | text | — | — | — | — | — | — | **{{this.muc}}** |
| 6 | aiGoiY\[\]. | — | text | — | — | — | — | — | — | {{this.goiY}} |
| 7 | aiGoiY\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | Chấp nhận | — | — | — |
| 8 | aiGoiY\[\].noiDungSua | Nội dung sửa | textarea | Có | 2000 | — | — | =this.quyetDinh != "Sửa" | — | — |
| 9 | — | — | text | — | — | — | — | =count(aiGoiY) \> 0 | — | Chưa có kết quả gợi ý AI. |
| 10 | purchaseType | Loại mua sắm | select | Có | — | DT=Duy trì hoạt động thường xuyên; SX=Liên tục SXKD; KH=Triển khai hoạt động khoa học công nghệ; QP=Quốc phòng, an ninh, chính trị | — | — | — | — |
| 11 | purpose | Mục đích | textarea | Có | 2000 | — | — | — | — | Giá trị khởi tạo: Mục đích của hồ sơ (biến purpose) |
| 12 | scope | Phạm vi, quy mô | textarea | — | 2000 | — | — | — | — | — |
| 13 | fundId | Nguồn vốn | select | Có | — | @dmNguonVon | — | — | — | Danh mục Nguồn vốn, chỉ mục đang hoạt động, có tìm kiếm |
| 14 | period | Thời gian thực hiện | textfield | Có | 255 | — | — | — | — | Ví dụ "01/2027 – 09/2027" |
| 15 | secret | Mật | radio | Có | — | false=Không; true=Có | — | — | — | — |
| 16 | — | Cảnh báo Mật | text | — | — | — | — | =not(dxmsMat and secret = "false") | dxmsMat | ĐXMS đang là Mật, hồ sơ sẽ không được bảo vệ như hồ sơ Mật. |

### 7.4.3 dtms-ms01-t05-boc-tach

Quy trình MS01, bước 5.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | canCu | Văn bản căn cứ | cancu | Có | — | khaiBao=có; boKhiCoHangMuc=không; bangThamKhao=có | — | — | — | Như bước 1 (DTMS_CN_0140), cùng khóa. Giá trị khởi tạo: văn bản căn cứ đã xác nhận của hồ sơ (biến canCu). Thêm được văn bản; bỏ được văn bản chưa có hạng mục liên kết (BR-DXMS-02-07); dòng của văn bản thêm mới chọn … |
| 2 | canCu\[\].loaiCanCu | Loại căn cứ | select | Có | — | @dmLoaiCanCu | — | — | — | Như bước 1 |
| 3 | canCu\[\].vanBanId | Văn bản căn cứ | select | Có | — | @vanBanCanCu | — | — | — | Như bước 1 |
| 4 | bocTach | Hạng mục | hangmuc | Có | — | vanBan=canCu | — | — | — | Kiểu trường tùy biến Bảng hạng mục liên kết căn cứ (mục 2.4.1). Đầu bảng hiện Cấu trúc căn cứ: các văn bản trong canCu, nhóm và số dòng đã khai báo, kèm tên tệp nguồn. Mỗi dòng một hạng mục; \[Thêm hạng mục\] thêm dòng, … |
| 5 | bocTach\[\].name | Tên hạng mục | textfield | Có | 500 | — | — | — | — | — |
| 6 | bocTach\[\].uom | ĐVT | select | Có | — | @dmDonViTinh | — | — | — | Danh mục Đơn vị tính, có tìm kiếm |
| 7 | bocTach\[\].nhom | Nhóm | select | Có | — | 1=Nhóm 1: hàng hóa, dịch vụ mua sẵn; 2=Nhóm 2: hàng hóa sản xuất theo yêu cầu | — | — | — | — |
| 8 | bocTach\[\].nganhHang | Ngành hàng | select | Có | — | @nganhOptions | — | — | — | Danh mục Loại hàng hóa, dịch vụ, có tìm kiếm. Dùng để lọc nhà cung cấp ở DTMS_CN_0145 |
| 9 | bocTach\[\].dongCanCu | Dòng căn cứ | select | Có | — | @dongCanCu | — | — | — | Có tìm kiếm. Dòng của các văn bản trong canCu, hiện “{Văn bản} › {Nhóm} › {Dòng}”, thêm hai giá trị NGOAI=Ngoài căn cứ, MOI=Thêm dòng mới. Hai hạng mục không dùng chung một dòng: inline tại dòng sau “Dòng căn cứ đã … |
| 10 | bocTach\[\].vanBanMoi | Văn bản | select | Có | — | @canCu | — | =this.dongCanCu != "MOI" | — | Văn bản trong số đã chọn của hồ sơ (canCu). Bắt buộc khi Thêm dòng mới |
| 11 | bocTach\[\].nhomMoi | Tên nhóm | textfield | Có | 255 | — | — | =this.dongCanCu != "MOI" | — | Bắt buộc khi Thêm dòng mới |
| 12 | bocTach\[\].tenDongMoi | Tên dòng mới | textfield | Có | 255 | — | — | =this.dongCanCu != "MOI" | — | Bắt buộc khi Thêm dòng mới. Dòng mới dùng lại được cho ĐXMS sau |
| 13 | bocTach\[\].bom | SL gốc | number | Có | — | — | — | =this.dongCanCu != "MOI" | — | Số không âm, tối đa 3 chữ số thập phân. Bắt buộc khi Thêm dòng mới; dòng có sẵn thì SL gốc chỉ đọc ở dòng dưới |
| 14 | bocTach\[\]. | — | text | — | — | — | — | — | — | SL gốc **{{this.slGoc}}** · Đã dùng {{this.daDung}} · Còn lại **{{this.conLai}}** |
| 15 | bocTach\[\].prop | SL đề xuất | number | Có | — | — | Còn lại của dòng | — | — | Lớn hơn 0, tối đa 3 chữ số thập phân; sai thì inline “SL đề xuất không hợp lệ.” Mặc định bằng Còn lại. Vượt Còn lại thì dòng hiện “Vượt số còn lại”; KT-12 kiểm tra lại khi Xác nhận |
| 16 | bocTach\[\]. | — | text | — | — | — | — | =this.ghiChu = "" | — | *{{this.ghiChu}}* |

### 7.4.4 dtms-ms01-t05-1-chi-huy-xac-nhan

Quy trình MS01, bước 5.1.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | — | text | — | — | — | — | — | tenHoSo | Xác nhận khởi tạo hồ sơ **{{tenHoSo}}** và danh mục bóc tách trước khi gửi Phòng Quản lý tài sản rà soát tồn kho. |
| 2 | — | Danh mục hàng hoá đã bóc tách | table | — | — | n=STT; hang=Hàng hoá / dịch vụ; dvt=ĐVT; sl=SL đề xuất | — | — | bocTachXem | — |
| 3 | yKien | Ý kiến | textarea | — | 2000 | — | — | — | — | — |

### 7.4.5 dtms-ms01-t07-ra-soat-ton-kho

Quy trình MS01, bước 7.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | ruaSoatKho | Kết quả rà soát tồn kho | tonkho | — | — | — | — | — | — | Kiểu trường tùy biến Bảng chốt dùng từ kho (mục 2.4.1). Khi mở form đọc ở máy chủ bản rà soát mới nhất của hồ sơ (DTMS_CN_0142). Dòng trạng thái đầu bảng: “Kết quả rà soát tồn kho: {Chưa có kết quả, Đã có kết quả sổ … |
| 2 | ruaSoatKho\[\]. | — | text | — | — | — | — | — | — | **{{this.n}}. {{this.name}}** SL đề xuất: {{this.prop}} |
| 3 | ruaSoatKho\[\]. | — | text | — | — | — | — | — | — | Tồn sổ sách **{{this.book}}** · Đang giữ {{this.held}} {{this.heldDxms}} · Số đủ điều kiện {{this.actual}} · Tồn khả dụng **{{this.avail}}** Chất lượng: {{this.quality}} |
| 4 | ruaSoatKho\[\].fromStock | Dùng từ kho | number | — | — | — | Giá trị nhỏ hơn giữa Tồn khả dụng và SL đề xuất | =not(this.coKho) | — | Số không âm, bắt buộc khi Tồn khả dụng lớn hơn 0; từ 0 đến giá trị nhỏ hơn giữa Tồn khả dụng và SL đề xuất (BR-DXMS-03-03). Vượt thì inline “Dùng từ kho không được lớn hơn {giá trị}.”; sai định dạng, bỏ trống thì … |
| 5 | ruaSoatKho\[\]. | — | text | — | — | — | — | — | — | SL mua: **{{this.prop - (if this.coKho then this.fromStock else 0)}}** |

### 7.4.6 dtms-ms01-t07-1-chi-huy-kho-duyet

Quy trình MS01, bước 7.1.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | — | text | — | — | — | — | — | tenHoSo | Duyệt kết quả rà soát tồn kho và Biên bản rà soát vật tư, linh kiện tồn kho của hồ sơ **{{tenHoSo}}** (bảng kết quả ở màn xử lý). |
| 2 | yKien | Ý kiến | textarea | — | 2000 | — | — | — | — | — |

### 7.4.7 dtms-ms01-t08-ycbg

Quy trình MS01, bước 8.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Thông báo gửi lại | text | — | — | — | — | =lanGuiYcbg = null | lanGuiYcbg | **Lần gửi {{lanGuiYcbg}} không đạt — gửi lại yêu cầu báo giá.** Hạng mục giữ nguyên; yêu cầu lần trước không đổi nội dung. |
| 2 | lyDoKhongDat | Lý do | textarea | Có | 2000 | — | — | =lanGuiYcbg = null | — | Chỉ hiện khi eForm mở từ luật MS01_T10_TRA_LAI (gửi lại, BR-DXMS-04-12); là biến bắt buộc của luật đó. HX-01 ghi vào yêu cầu hiện hành |
| 3 | — | — | text | — | — | — | — | — | — | \### Hạng mục yêu cầu báo giá |
| 4 | — | Yêu cầu nhóm 1 | table | — | — | stt=STT; hang=Hàng hóa / dịch vụ; sl=SL mua; nganh=Ngành hàng | — | =count(ycbgNhom1) = 0 | ycbgNhom1 | Hạng mục Nhóm 1 có Còn phải mua lớn hơn 0 của bản rà soát hiện hành (BR-DXMS-04-02); biến do hệ thống ghi khi bản rà soát tồn kho được xác nhận (DTMS_CN_0143). Số lượng không sửa. Nhóm không có hạng mục thì không hiện |
| 5 | — | Yêu cầu nhóm 2 | table | — | — | stt=STT; hang=Hàng hóa / dịch vụ; sl=SL mua; nganh=Ngành hàng | — | =count(ycbgNhom2) = 0 | ycbgNhom2 | Như Yêu cầu nhóm 1, cho Nhóm 2 |
| 6 | — | — | text | — | — | — | — | — | — | \### Tài liệu kỹ thuật |
| 7 | taiLieuKyThuatNhom1 | Tài liệu kỹ thuật nhóm 1 (chỉ tiêu kỹ thuật) | filepicker | Có | — | — | — | =count(ycbgNhom1) = 0 | — | Nhiều tệp, theo quy tắc tải tệp của hệ thống (mục 4.1). Bắt buộc khi Nhóm 1 có hạng mục (BR-DXMS-04-02): "Vui lòng tải lên tài liệu kỹ thuật của Nhóm 1." Đưa vào Tài liệu đính kèm của hồ sơ. Gửi lại: giá trị khởi tạo … |
| 8 | taiLieuKyThuatNhom2 | Tài liệu kỹ thuật nhóm 2 (bảng bóc tách khối lượng, danh mục vật tư, linh kiện) | filepicker | Có | — | — | — | =count(ycbgNhom2) = 0 | — | Như nhóm 1, cho Nhóm 2: "Vui lòng tải lên tài liệu kỹ thuật của Nhóm 2." |
| 9 | — | — | text | — | — | — | — | — | — | \### Nhà cung cấp nhận yêu cầu |
| 10 | nccSel | Nhà cung cấp nhận YCBG | nhacungcap | — | — | hangMuc=ycbgNhom1, ycbgNhom2; nccMoi=nccMoi; nhapTuTep=true | — | — | ycbgNhom1, ycbgNhom2 | Kiểu trường tùy biến nhacungcap (mục 2.4.1). Checklist hiện "{Mã} — {Tên}" theo BR-DXMS-04-03: danh mục Nhà cung cấp đang Hoạt động, có ngành hàng trùng ngành hàng của hạng mục; đang bị cấm thì không có ô chọn; hạn … |
| 11 | nccMoi | Nhà cung cấp mới | dynamiclist+ | — | — | — | — | — | — | Thêm dòng, icon Xóa. BR-DXMS-04-04: khi Xác nhận, HX-14 thêm vào danh mục. Mã số thuế được trường nccSel (nhacungcap) tra danh mục khi nhập: trùng nhà cung cấp dùng được thì hiện tại dòng "Đã có nhà cung cấp {Mã} — … |
| 12 | nccMoi\[\].ten | Tên | textfield | Có | 255 | — | — | — | — | — |
| 13 | nccMoi\[\].mst | Mã số thuế | textfield | Có | 20 | — | — | — | — | — |
| 14 | nccMoi\[\].email | Email nhận YCBG | textfield | Có | 255 | — | — | — | — | Đúng định dạng email: "Email không hợp lệ." |
| 15 | nccMoi\[\].nganh | Ngành hàng | select | Có | — | @dmNganhHang | — | — | — | Danh mục Ngành hàng: "Vui lòng chọn Ngành hàng." |
| 16 | — | Đã chọn {n} nhà cung cấp | text | — | — | — | — | — | nccSel, nccMoi | Đã chọn **{{count(nccSel) + count(nccMoi)}}** nhà cung cấp |
| 17 | — | — | text | — | — | — | — | — | — | \### Hạn và điều khoản trên phiếu |
| 18 | hanTraLoi | Hạn trả lời | datetime | Có | — | — | =hanTraLoiMacDinh | — | hanTraLoiMacDinh | DD/MM/YYYY. BR-DXMS-04-05: giá trị khởi tạo là biến hanTraLoiMacDinh (có Nhóm 2: ngày gửi cộng 7 ngày; chỉ Nhóm 1: cộng 5 ngày; tính cả thứ Bảy, Chủ nhật, không tính ngày lễ, Tết theo lịch nghỉ). Không nhỏ hơn ngày … |
| 19 | dkThanhToan | Điều kiện thanh toán | textarea | — | 4000 | — | — | =lanGuiYcbg != null | — | Ghi trên phiếu và email gửi nhà cung cấp (BR-DXMS-04-06). Gửi lại: giữ giá trị lần trước |
| 20 | diaDiemGiao | Địa điểm giao hàng | textfield | — | 500 | — | — | =lanGuiYcbg != null | — | Như Điều kiện thanh toán |
| 21 | yeuCauKhac | Các yêu cầu khác | textarea | — | 2000 | — | — | =lanGuiYcbg != null | — | Như Điều kiện thanh toán; ví dụ yêu cầu bảo hành, lắp đặt, giao theo lô |
| 22 | dauMoiBg | Đầu mối tiếp nhận báo giá | select | — | — | @dauMoiBgOptions | — | =lanGuiYcbg != null | — | Một lựa chọn trong người thuộc danh sách xử lý của hồ sơ; giá trị khởi tạo là người xử lý bước. Phiếu ghi Họ tên, Số điện thoại, Email theo hồ sơ người dùng |
| 23 | — | — | text | — | — | — | — | =lanGuiYcbg != null | — | \### Đối soát ĐXMS |
| 24 | — | Đối soát ĐXMS | table | — | — | hangMuc=Hạng mục; deXuat=ĐXMS đề xuất; theoNguon=Theo nguồn; ketQua=Kết quả; ghiChu=Ghi chú | — | =lanGuiYcbg != null | doiSoatDxms | Theo nguồn là phần còn lại của dòng căn cứ. Kết quả: Khớp khi SL đề xuất không lớn hơn Còn lại, Không khớp khi lớn hơn, Không có trong nguồn khi Ngoài căn cứ. Biến do hệ thống ghi khi bản rà soát tồn kho được xác nhận … |
| 25 | — | Dòng giá trị của đối soát | text | — | — | — | — | =lanGuiYcbg != null or doiSoatGiaTri = null | doiSoatGiaTri | Giá trị dự kiến của ĐXMS **{{doiSoatGiaTri.giaTriDuKien}}** tỷ đồng · Tổng Còn có thể sử dụng của các văn bản **{{doiSoatGiaTri.conLai}}** tỷ đồng · {{doiSoatGiaTri.ketQua}} |

### 7.4.8 dtms-ms01-t10-bao-gia

Quy trình MS01, bước 10.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Lần gửi YCBG | text | — | — | — | — | — | lanGuiYcbg, maYcbg | Lần gửi YCBG: **{{lanGuiYcbg}}** · Mã yêu cầu: {{maYcbg}} |
| 2 | — | — | text | — | — | — | — | — | — | \### Tệp báo giá |
| 3 | tepBaoGia | Tệp báo giá | tepbaogia | — | — | baoGia=baoGia | — | — | lanGuiYcbg | Kiểu trường tùy biến tepbaogia (DTMS_CN_0147): một dòng cho mỗi nhà cung cấp của lần gửi hiện tại, Tải lên, Tải xuống, Thay tệp, Xóa chạy ngay; tải lên xong AI đọc tệp, ghi gợi ý vào dòng của nhà cung cấp trong baoGia … |
| 4 | — | — | text | — | — | — | — | — | — | \### Báo giá của từng nhà cung cấp |
| 5 | baoGia | Báo giá | dynamiclist | — | — | — | — | — | baoGia | Một dòng cho mỗi nhà cung cấp nhận yêu cầu của lần gửi hiện tại; không thêm, xóa dòng. Giá trị khởi tạo: tác vụ bước 9 ghi nhà cung cấp, Tình trạng gửi, dòng đơn giá theo hạng mục; trường Tệp báo giá ghi giá trị AI … |
| 6 | baoGia\[\]. | — | text | — | — | — | — | — | — | **{{this.ma}} — {{this.ten}}** · Tình trạng gửi: {{this.tinhTrangGui}} · Tệp: {{if this.tenTep = null then "chưa tải lên" else this.tenTep}} |
| 7 | baoGia\[\].khongPhanHoi | Không phản hồi | checkbox | — | — | — | — | — | — | Chọn thì bỏ qua các trường dưới, không cần tệp (BR-DXMS-04-11) |
| 8 | baoGia\[\].ngayBaoGia | Ngày báo giá | datetime | Có | — | — | — | =this.khongPhanHoi = true | — | DD/MM/YYYY. Giá trị khởi tạo theo AI đọc; không lớn hơn ngày hiện tại |
| 9 | baoGia\[\].hieuLucDen | Hiệu lực đến | datetime | Có | — | — | — | =this.khongPhanHoi = true | — | DD/MM/YYYY. Không nhỏ hơn Ngày báo giá: "Hiệu lực đến không được nhỏ hơn Ngày báo giá." Nhỏ hơn ngày Xác nhận thì dòng ghi "(hết hiệu lực)", không dùng để tính (BR-DXMS-04-09) |
| 10 | baoGia\[\].loaiTien | Loại tiền | select | Có | — | @dmTienTe | — | =this.khongPhanHoi = true | — | Danh mục Tiền tệ; giá trị khởi tạo theo nhà cung cấp |
| 11 | baoGia\[\].tyGia | Tỷ giá | number | Có | — | — | — | =this.khongPhanHoi = true or this.loaiTien = "VND" | — | Lớn hơn 0; quy đổi về đồng Việt Nam. Bắt buộc khi Loại tiền không phải VNĐ; VNĐ có Tỷ giá bằng 1 |
| 12 | baoGia\[\].donGia | Đơn giá báo theo hạng mục | dynamiclist | — | — | — | — | =this.khongPhanHoi = true | — | Một dòng cho mỗi hạng mục của yêu cầu; không thêm, xóa dòng |
| 13 | baoGia\[\].donGia\[\]. | — | text | — | — | — | — | — | — | {{this.hangMuc}} · SL mua {{this.slMua}}{{if this.goiYAi = true then " · Gợi ý AI" else ""}} |
| 14 | baoGia\[\].donGia\[\].giaBao | Đơn giá báo | number | — | — | — | — | — | — | Theo Loại tiền, gồm VAT, không âm. Bắt buộc với hạng mục nhà cung cấp báo; bỏ trống là không báo hạng mục đó. Giá AI gợi ý có dấu hiệu Gợi ý AI; người dùng sửa thì mất dấu hiệu. Đơn giá quy đổi (tỷ đồng) hiện ở bảng … |
| 15 | — | — | text | — | — | — | — | — | — | \### So sánh và cơ sở giá |
| 16 | coSoGia | So sánh báo giá và cơ sở giá | sosanhbaogia | Có | — | baoGia=baoGia; hangMuc=ycbgNhom1, ycbgNhom2; tong=tongGiaTriCoSo | — | — | baoGia, ycbgNhom1, ycbgNhom2 | Kiểu trường tùy biến sosanhbaogia. Mỗi hạng mục một dòng: Hạng mục, ĐVT, Số lượng, Đơn giá quy đổi (tỷ đồng) của từng nhà cung cấp = Đơn giá báo × Tỷ giá ÷ 1.000.000.000, giá thấp nhất trong các báo giá còn hiệu lực … |
| 17 | — | Tổng giá trị so với ngưỡng | text | — | — | — | — | — | tongGiaTriCoSo, hoSo.nguong | Tổng giá trị **{{tongGiaTriCoSo}}** tỷ — {{if tongGiaTriCoSo \< hoSo.nguong then "Dưới ngưỡng" else "Từ ngưỡng trở lên"}} {{hoSo.nguong}} tỷ |
| 18 | — | Kết quả AI kiểm tra báo giá | ai | — | — | — | — | — | aiKiemTraBaoGia | Kết quả: **{{if aiKiemTraBaoGia = null then "Chưa có kết quả" else aiKiemTraBaoGia.ketQua}}** {{aiKiemTraBaoGia.chiTiet}} *Nguồn: {{aiKiemTraBaoGia.nguon}}* |
| 19 | — | Kết luận AI Không đạt | html | — | — | — | — | =aiKiemTraBaoGia = null or aiKiemTraBaoGia.ketQua != "Không đạt" | aiKiemTraBaoGia.lyDo | AI kiểm tra báo giá: Không đạt — {{aiKiemTraBaoGia.lyDo}}. Vui lòng kiểm tra lại dữ liệu. |
| 20 | vanDat | Vẫn đạt | checkbox | — | — | — | — | =not(aiKiemTraBaoGia.soLanKhongDat \>= 2) | aiKiemTraBaoGia.soLanKhongDat | Hiện từ lần AI kết luận Không đạt thứ hai liên tiếp (BR-DXMS-04-12). Chọn thì đạt dù AI kết luận Không đạt; KT-17 vẫn áp; Chỉ huy đơn vị thấy lý do ở bước 13 |
| 21 | lyDoVanDat | Lý do vẫn đạt | textarea | Có | 2000 | — | — | =vanDat != true | — | — |

### 7.4.9 dtms-ms01-t10-1-chi-huy-thau-duyet

Quy trình MS01, bước 10.1.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | — | text | — | — | — | — | — | giaTriBaoGiaTxt | Phê duyệt kết quả báo giá của Thầu TTMS: Giá trị báo giá cuối cùng **{{giaTriBaoGiaTxt}}** (gồm VAT). |
| 2 | — | Tệp báo giá của nhà cung cấp | table | — | — | ncc=Nhà cung cấp; tep=Tệp báo giá | — | — | baoGiaTep | — |
| 3 | — | — | text | — | — | — | — | — | if | {{if ghiChuBaoGia = null or ghiChuBaoGia = "" then "" else "**Ghi chú của Thầu:** " + ghiChuBaoGia}} |
| 4 | yKien | Ý kiến | textarea | — | 2000 | — | — | — | — | — |

### 7.4.10 dtms-ms01-t11-12-du-thao

Quy trình MS01, bước 11, 12. Văn bản của bước: BM-01, BM-02, BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Lý do trả lại của Chỉ huy đơn vị | html | — | — | — | — | =traLai13 = null | traLai13.lyDo, traLai13.loc | — | Chỉ huy đơn vị trả lại: “{{traLai13.lyDo}}”. AI lọc nội dung chưa đạt: {{traLai13.loc}} |
| 2 | — | Kết luận của Người có thẩm quyền | html | — | — | — | — | =ketLuan = null | ketLuan | — | Hồ sơ xử lý lại theo kết luận của Người có thẩm quyền: “{{ketLuan}}” |
| 3 | phanHoiChiHuy | Phản hồi chỉ đạo | dynamiclist | — | — | — | — | =traLai13 = null | phanHoiChiHuy | — | Bắt buộc khi hồ sơ về từ bước 14. Mỗi phần Không đạt một dòng; giá trị khởi tạo từ biến phanHoiChiHuy do tác vụ AI bước 14 ghi (Phần, Chỉ đạo, Hướng dẫn AI chỉ xem) |
| 4 | phanHoiChiHuy\[\]. | — | text | — | — | — | — | — | — | — | **{{this.phan}}** — Chỉ đạo: {{this.chiDao}} *Hướng dẫn AI:* {{this.huongDanAi}} |
| 5 | phanHoiChiHuy\[\].xuLy | Xử lý | radio | Có | — | Đã sửa; Không sửa | — | — | — | — | — |
| 6 | phanHoiChiHuy\[\].giaiTrinh | Giải trình | textarea | Có | 2000 | — | — | =this.xuLy != "Không sửa" | — | — | Bắt buộc khi Không sửa |
| 7 | — | Kết quả AI kiểm tra | html | — | — | — | — | =aiCheck = null or aiCheck.ketQua != "Không đạt" | aiCheck.lyDo | — | AI kiểm tra hồ sơ: Không đạt — {{aiCheck.lyDo}}. Hồ sơ chưa được gửi. |
| 8 | vanGui | Vẫn gửi | checkbox | — | — | — | — | =not(aiCheck.soLanKhongDat \>= 2) | aiCheck.soLanKhongDat | — | Hiện từ lần AI kết luận Không đạt thứ hai liên tiếp (BR-DXMS-08-06). Chọn thì gửi dù AI kết luận Không đạt; Chỉ huy đơn vị thấy lý do ở bước 13 |
| 9 | lyDoVanGui | Lý do vẫn gửi | textarea | Có | 2000 | — | — | =vanGui != true | — | — | — |
| 10 | — | Kính gửi | text | — | — | — | — | — | hoSo.nguoiCoThamQuyen | — | **Kính gửi:** {{hoSo.nguoiCoThamQuyen}} |
| 11 | — | Căn cứ | text | — | — | — | — | — | hoSo.canCu | — | **Căn cứ:** {{hoSo.canCu}} |
| 12 | mucDich | 1\. Mục đích | textarea | Có | 2000 | — | =purpose | — | — | — | Giá trị khởi tạo: Mục đích của hồ sơ (biến purpose, bước 4). Sửa ở đây chỉ đổi Tờ trình, không đổi Mục đích của hồ sơ |
| 13 | aiSuCanThiet | Gợi ý AI — Sự cần thiết phải mua sắm | aisuggest | — | — | Sự cần thiết=suCanThiet | — | — | aiSuCanThiet | — | Một dòng; gợi ý theo hiện trạng, tồn kho, căn cứ, Loại mua sắm, kèm nguồn. Mặc định chưa chọn quyết định. Quyết định điền vào trường Sự cần thiết bên dưới |
| 14 | aiSuCanThiet\[\]. | — | text | — | — | — | — | — | — | — | **{{this.muc}}** |
| 15 | aiSuCanThiet\[\]. | — | text | — | — | — | — | — | — | — | {{this.goiY}} *Nguồn:* {{this.nguon}} |
| 16 | aiSuCanThiet\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | — | — | — | — | Mặc định chưa chọn |
| 17 | aiSuCanThiet\[\].noiDungSua | Nội dung sửa | textarea | Có | 4000 | — | — | =this.quyetDinh != "Sửa" | — | — | — |
| 18 | — | — | text | — | — | — | — | =count(aiSuCanThiet) \> 0 | — | — | Chưa có kết quả gợi ý AI. |
| 19 | suCanThiet | 2.1 Sự cần thiết phải mua sắm | textarea | Có | 4000 | — | — | — | — | — | — |
| 20 | — | 2.2 Danh mục hàng hóa, dịch vụ | table | — | — | n=TT; hang=Tên hàng hóa, dịch vụ; dvt=Đơn vị tính; slMua=SL mua sau tồn kho | — | — | danhMucHang | — | Chỉ xem. Hạng mục đã xác nhận của hồ sơ |
| 21 | — | 2.3 Giá trị | text | — | — | — | — | — | hoSo.tong, hoSo.tongBangChu, coCauChiPhi | — | **2.3 Giá trị:** {{hoSo.tong}} đồng, đã gồm VAT, theo cơ sở giá (bằng chữ: {{hoSo.tongBangChu}}). Cơ cấu theo Loại chi phí: {{coCauChiPhi}} |
| 22 | phuongPhap | Phương pháp tính toán | textarea | — | 4000 | — | — | — | — | — | — |
| 23 | phuongPhapSoLuong | Phương pháp tính số lượng | textarea | — | 4000 | — | — | — | — | — | — |
| 24 | quanDiem | Quan điểm thực hiện | textarea | — | 4000 | — | — | — | — | — | — |
| 25 | phuongAn | Phương án kỹ thuật – công nghệ | textarea | — | 4000 | — | — | — | — | — | — |
| 26 | coSoDonGia | Cơ sở xác định đơn giá | textarea | — | 4000 | — | — | — | — | — | — |
| 27 | — | Sử dụng hàng tồn kho | text | — | — | — | — | — | cauTonKho | — | **Sử dụng hàng tồn kho:** {{cauTonKho}} |
| 28 | — | 2.4 Nguồn vốn, Thời gian thực hiện | text | — | — | — | — | — | hoSo.nguonVon, period | — | **a) Nguồn vốn:** {{hoSo.nguonVon}} · **b) Thời gian thực hiện:** {{period}} |
| 29 | nguonNganSach | Nguồn ngân sách | textfield | — | 500 | — | — | — | — | — | — |
| 30 | hieuQua | 2.5 Đánh giá hiệu quả | textarea | — | 4000 | — | — | — | — | — | — |
| 31 | bienPhap | 2.6 Biện pháp thực hiện | textarea | Có | 4000 | — | — | — | — | — | — |
| 32 | keHoach | Kế hoạch tổ chức thực hiện | textarea | Có | 4000 | — | — | — | — | — | — |
| 33 | — | Phụ lục chi phí | table | — | — | n=STT; hang=Hàng hóa; sl=SL mua; donGia=Đơn giá; thanhTien=Thành tiền; coSo=Cơ sở giá; loaiChiPhi=Loại chi phí | — | — | phuLucChiPhi | — | Chỉ xem. Từ kết quả đánh giá báo giá, cơ sở giá (DTMS_CN_0148) |
| 34 | — | Checklist 01 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.01+MS01.02 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 35 | — | Checklist 02 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.03 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 36 | — | — | text | — | — | — | — | — | — | — | *Sau khi gửi, Tờ trình, Phụ lục chi phí và Checklist của phiên bản hiện tại xem ở **Văn bản đầu ra**.* |

### 7.4.11 dtms-ms01-t13-chi-huy-duyet

Quy trình MS01, bước 13. Văn bản của bước: BM-01, BM-02, BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Kết quả AI kiểm tra | text | — | — | — | — | =aiCheck = null | aiCheck.ketQua, aiCheck.lyDo | — | **AI kiểm tra hồ sơ (chỉ tham khảo):** {{aiCheck.ketQua}} — {{aiCheck.lyDo}} |
| 2 | — | Lý do vẫn gửi | html | — | — | — | — | =vanGui != true | lyDoVanGui | — | Đơn vị vẫn gửi dù AI kết luận Không đạt. Lý do: “{{lyDoVanGui}}” |
| 3 | — | Tóm tắt dự thảo | text | — | — | — | — | — | hoSo.ten, hoSo.tong, hoSo.nguonVon, period, hoSo.soHangMuc | — | \### Tóm tắt dự thảo **{{hoSo.ten}}** · Tổng giá trị {{hoSo.tong}} · Nguồn vốn {{hoSo.nguonVon}} · Thời gian {{period}} · {{hoSo.soHangMuc}} hạng mục |
| 4 | — | Giải trình của đơn vị | text | — | — | — | — | =vongGiaiTrinh = null | vongGiaiTrinh | — | \### Giải trình của đơn vị (vòng {{vongGiaiTrinh}}) BM-02 và Phụ lục 1 mới nhất xem ở **Văn bản đầu ra**. |
| 5 | — | Bảng giải trình | table | — | — | yKien=Ý kiến; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình | — | =vongGiaiTrinh = null | giaiTrinh | — | Chỉ xem. Hiện khi hồ sơ về từ bước 29; dòng do bước 28 ghi |
| 6 | — | Phản hồi của đơn vị theo chỉ đạo lần trước | table | — | — | phan=Phần; chiDao=Chỉ đạo; xuLy=Xử lý; giaiTrinh=Giải trình | — | =count(phanHoiChiHuy) = 0 | phanHoiChiHuy | — | Chỉ xem. Phản hồi của đơn vị ở bước 11, 12 cho lần Không đồng ý trước |
| 7 | — | Lịch sử chỉnh sửa theo phần | table | — | — | phienBan=Phiên bản; phan=Phần; noiDung=Nội dung cập nhật; nguoi=Người sửa; thoiDiem=Thời điểm | — | =count(lichSuSua) = 0 | lichSuSua | — | Chỉ xem, từ nhật ký; ẩn khi chưa có |
| 8 | — | Cơ cấu chi phí | text | — | — | — | — | — | coCauChiPhi | — | **Cơ cấu chi phí theo Loại chi phí:** {{coCauChiPhi}} |
| 9 | — | Phụ lục chi phí | table | — | — | n=STT; hang=Hàng hóa; sl=SL mua; donGia=Đơn giá; thanhTien=Thành tiền; coSo=Cơ sở giá; loaiChiPhi=Loại chi phí | — | — | phuLucChiPhi | — | Chỉ xem, như bước 11, 12 |
| 10 | — | Checklist 01 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.01+MS01.02 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 11 | — | Checklist 02 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.03 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 12 | duyetPhan | Duyệt từng phần | dynamiclist | — | — | — | 1\. Mục đích; 2.1 Sự cần thiết phải mua sắm; 2.2 Danh mục hàng hóa, dịch vụ; 2.3 Giá trị; 2.4 Nguồn vốn, Thời gian thực hiện; 2.5 Đánh giá hiệu quả; 2.6 Biện pháp, Kế hoạch tổ chức thực hiện; Phụ lục chi phí; Checklist | — | — | — | Mỗi phần một dòng: các mục của Tờ trình, Phụ lục chi phí, Checklist. Danh sách phần là giá trị khởi tạo của eForm (cột Mặc định), mỗi phần mặc định Đạt |
| 13 | duyetPhan\[\]. | — | text | — | — | — | — | — | — | — | **{{this.phan}}** |
| 14 | duyetPhan\[\].ketQua | Kết quả | radio | Có | — | Đạt; Không đạt | Đạt | — | — | — | — |
| 15 | duyetPhan\[\].lyDo | Lý do, chỉ đạo | textarea | Có | 2000 | — | — | =this.ketQua != "Không đạt" | — | — | Bắt buộc khi Không đạt; là lý do trả lại của phần |

### 7.4.12 dtms-ms01-t16-chon-cqcm

Quy trình MS01, bước 16. Văn bản của bước: BM-03.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Lý do trả lại của TTMS | html | — | — | — | — | =traLai17 = null | traLai17.lyDo | TTMS trả lại danh sách CQCM: “{{traLai17.lyDo}}”. Cập nhật danh sách rồi gửi lại TTMS xác nhận. |
| 2 | — | Lý do từ chối ký BM-03 | html | — | — | — | — | =tuChoiKyBm03 = null | tuChoiKyBm03.lyDo | BM-03 bị từ chối ký: “{{tuChoiKyBm03.lyDo}}”. Cập nhật rồi gửi lại TTMS xác nhận. |
| 3 | — | Lịch sử trả lại | table | — | — | thoiDiem=Thời điểm; nguoi=Người trả lại; lyDo=Lý do | — | =count(lichSuTraLaiCqcm) = 0 | lichSuTraLaiCqcm | Chỉ xem. Mỗi lần TTMS trả lại một dòng, không ghi đè (BR-DXMS-07-02) |
| 4 | — | Lần thẩm định | text | — | — | — | — | — | lanThamDinh | **Lần thẩm định:** Lần {{lanThamDinh}} |
| 5 | cqcmList | Chọn CQCM | dynamiclist | — | — | — | — | — | cqcmList | Mỗi CQCM đang hoạt động một dòng (mã agencyId, tên, chức năng, cờ batBuoc, người xử lý nguoiXuLy theo danh mục CQCM). Giá trị khởi tạo từ biến cqcmList do bước 15 ghi: CQCM về đầu tư – xây dựng và CQCM về tài chính kế … |
| 6 | cqcmList\[\]. | — | text | — | — | — | — | — | — | **{{this.ten}}** — {{this.chucNang}} |
| 7 | cqcmList\[\]. | — | text | — | — | — | — | =not(this.batBuoc) | — | **Bắt buộc** |
| 8 | cqcmList\[\].chon | Chọn | checkbox | — | — | — | — | =this.batBuoc | — | — |
| 9 | dauMoi | Đầu mối tiếp nhận | select | Có | — | @nguoiDungOptions | =hoSo.nguoiPhuTrach | — | — | Người dùng của đơn vị đề xuất, có tìm kiếm. Mặc định Người phụ trách hồ sơ |
| 10 | — | Liên hệ đầu mối | text | — | — | — | — | =dauMoi = null | nguoiDungOptions, dauMoi | Điện thoại: {{nguoiDungOptions\[item.value = dauMoi\]\[1\].dienThoai}} · Email: {{nguoiDungOptions\[item.value = dauMoi\]\[1\].email}} |
| 11 | — | BM-03 | text | — | — | — | — | — | — | Dự thảo BM-03 do hệ thống sinh từ hồ sơ: xem ở **Văn bản đầu ra**. Ký nháy xác nhận nội dung rồi tải lên bên dưới. Bản ký nháy chưa có Hạn góp ý; Hạn góp ý do TTMS chốt ở bước 17, hệ thống điền ở bước 18. |
| 12 | bm03KyNhay | BM-03 đã ký nháy | filepicker | Có | — | — | — | — | — | Một tệp, theo quy tắc tải tệp (mục 4.1). Bỏ trống: "Vui lòng tải lên BM-03 đã ký nháy." |

### 7.4.13 dtms-ms01-t16-1-chi-huy-duyet-bm03

Quy trình MS01, bước 16.1.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Cơ quan chuyên môn thẩm định — Kính gửi | table | — | — | donVi=Đơn vị; chucNang=Nội dung góp ý theo chức năng; nguoi=Người thẩm định | — | — | cqcmXem | — |
| 2 | — | — | text | — | — | — | — | — | bm03Vv | **Trích yếu:** {{bm03Vv}} |
| 3 | — | — | text | — | — | — | — | — | bm03CanCu | **Căn cứ:** {{bm03CanCu}} |
| 4 | — | — | text | — | — | — | — | — | bm03NoiDung | **Nội dung đề nghị góp ý:** {{bm03NoiDung}} |
| 5 | — | — | text | — | — | — | — | — | hanGopY | **Hạn góp ý:** {{hanGopY}} |
| 6 | — | — | text | — | — | — | — | — | dauMoiTen | **Đầu mối tiếp nhận:** {{dauMoiTen}} |
| 7 | — | — | text | — | — | — | — | — | dmDienThoai | **Điện thoại đầu mối:** {{dmDienThoai}} |
| 8 | — | — | text | — | — | — | — | — | dmEmail | **Email đầu mối:** {{dmEmail}} |
| 9 | — | — | text | — | — | — | — | — | bm03NoiNhan | **Nơi nhận:** {{bm03NoiNhan}} |
| 10 | — | — | text | — | — | — | — | — | bm03Tep | **Phiếu BM-03 đã ký nháy:** {{bm03Tep}} |
| 11 | yKien | Ý kiến | textarea | — | 2000 | — | — | — | — | — |

### 7.4.14 dtms-ms01-t17-xac-nhan-cqcm

Quy trình MS01, bước 17. Văn bản của bước: BM-03.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Danh sách CQCM | table | — | — | ten=CQCM; batBuoc=Bắt buộc; chucNang=Chức năng liên quan; nguoiXuLy=Người xử lý | — | — | cqcmList\[item.chon or item.batBuoc\] | Chỉ xem. CQCM đã chọn ở bước 16; cột Bắt buộc hiện nhãn Bắt buộc với CQCM theo BR-DXMS-C-12 |
| 2 | — | AI đối chiếu thành phần CQCM | ai | — | — | — | — | — | aiCqcm.ketQua, aiCqcm.chiTiet | **AI đối chiếu thành phần CQCM:** {{aiCqcm.ketQua}} {{aiCqcm.chiTiet}} |
| 3 | — | — | text | — | — | — | — | =aiCqcm != null | — | Chưa có kết quả gợi ý AI. |
| 4 | — | BM-03 | text | — | — | — | — | — | nguoiDungOptions, dauMoi, bm03KyNhay | **Phiếu yêu cầu thẩm định (BM-03):** Đầu mối tiếp nhận {{nguoiDungOptions\[item.value = dauMoi\]\[1\].label}} · Tệp ký nháy {{bm03KyNhay}} · Dự thảo ở **Văn bản đầu ra** |
| 5 | hanGopY | Hạn góp ý | datetime | Có | — | — | =hanGopYMacDinh | — | hanGopYMacDinh | Ngày, DD/MM/YYYY. Giá trị khởi tạo: biến hanGopYMacDinh — lần đầu là ngày hiện tại cộng hạn thẩm định theo mục 2.3.3, tính NLV; từ lần 2 là Hạn góp ý của lần đầu. TTMS sửa được khi hồ sơ có yêu cầu đặc thù về tiến độ; … |
| 6 | — | — | html | — | — | — | — | =not(lanThamDinh \> 1 and hanGopY \< today()) | lanThamDinh | Hạn góp ý nhỏ hơn ngày hiện tại: công việc bước 19 sẽ Quá hạn ngay khi gửi. |
| 7 | — | — | text | — | — | — | — | — | — | *Sau khi xác nhận, hệ thống điền Hạn góp ý vào BM-03, trình Chỉ huy đơn vị đề xuất ký BM-03 và gửi yêu cầu thẩm định tới các CQCM trong danh sách.* |

### 7.4.15 dtms-ms01-t19-bm04

Quy trình MS01, bước 19.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Tiêu đề | text | — | — | — | — | — | cqcmTen, lan, phienBan | **{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}} *Phiếu riêng của {{cqcmTen}}, không hiển thị ý kiến của cơ quan khác.* |
| 2 | — | Lý do quay lại — Chỉ huy CQCM | text | — | — | — | — | =traLai20 = null | traLai20.lyDo, traLai20.tomTat | Chỉ huy CQCM không đồng ý: “{{traLai20.lyDo}}” Việc cần sửa theo mục (AI tóm tắt): {{traLai20.tomTat}} |
| 3 | — | AI tóm tắt chưa có kết quả | text | — | — | — | — | =traLai20 = null or traLai20.tomTat != null | — | Chưa có kết quả gợi ý AI. |
| 4 | — | Lý do quay lại — rà soát xung đột | text | — | — | — | — | =xungDotBm04 = null | xungDotBm04.muc, xungDotBm04.goiY | Ý kiến của cơ quan có thể mâu thuẫn với cơ quan khác, đề nghị rà soát lại mục: {{xungDotBm04.muc}} Gợi ý AI: {{xungDotBm04.goiY}} |
| 5 | — | Lý do quay lại — BM-04 bị từ chối ký | text | — | — | — | — | =tuChoiBm04 = null | tuChoiBm04.nguoi, tuChoiBm04.lyDo | BM-04 bị từ chối ký — {{tuChoiBm04.nguoi}}: “{{tuChoiBm04.lyDo}}” |
| 6 | — | Ý kiến lần trước của cơ quan | table | — | — | lan=Lần; muc=Mục; nhanXet=Nội dung nhận xét; quyetDinh=Quyết định; giaiTrinh=Giải trình; ketQua=Kết quả | — | =lan = 1 | yKienLanTruoc | Hiện từ lần thẩm định thứ 2: các dòng ý kiến của chính cơ quan ở các lần trước |
| 7 | — | BM-02 và Phụ lục 1 | text | — | — | — | — | =lan = 1 | phienBan | BM-02 và Phụ lục 1 của đơn vị đề xuất (hồ sơ v{{phienBan}}): xem ở **Văn bản đầu ra**. |
| 8 | bm04Phieu | Phiếu nhận xét theo mục | dynamiclist | — | — | — | — | — | bm04Phieu | Mỗi dòng một mục đánh giá. Dòng khởi tạo từ danh mục Mục đánh giá BM-04; lần sau giữ dữ liệu đã lưu của cơ quan. Không thêm, xóa dòng |
| 9 | bm04Phieu\[\]. | — | text | — | — | — | — | — | — | **{{this.muc}}** |
| 10 | bm04Phieu\[\].danhGia | Đánh giá | radio | Có | — | OK; Không OK | — | — | — | Mặc định chưa chọn. Thông báo khi bỏ trống: "Vui lòng chọn Đánh giá." |
| 11 | bm04Phieu\[\].nhanXet | Nội dung nhận xét | textarea | — | 2000 | — | — | — | — | Bắt buộc khi Đánh giá Không OK (validate của eForm), thông báo "Vui lòng nhập Nội dung nhận xét."; mục OK không bắt buộc |
| 12 | bm04Phieu\[\]. | — | text | — | — | — | — | =this.danhGia != "Không OK" or this.aiGoiY = null | — | Gợi ý AI: *{{this.aiGoiY}}* |
| 13 | bm04Phieu\[\].quyetDinhAi | Gợi ý AI | radio | — | — | Chấp nhận; Sửa; Bỏ | — | =this.danhGia != "Không OK" or this.aiGoiY = null | — | Hiện khi mục Không OK và có gợi ý. Chấp nhận thì điền gợi ý vào Nội dung nhận xét. Gợi ý và quyết định được lưu (BR-DXMS-C-08) |
| 14 | bm04Phieu\[\].huongDan | Hướng dẫn sửa | textarea | — | 2000 | — | — | =this.danhGia != "Không OK" | — | — |
| 15 | yKienChung | Ý kiến chung | textarea | — | 4000 | — | — | — | — | Đưa vào thân BM-04. Hồ sơ không đủ điều kiện thẩm định thì ghi ở đây và đánh giá Không OK ở mục liên quan |
| 16 | dauMoiPhoiHop | Đầu mối phối hợp | select | Có | — | @nguoiDungCqcm | — | — | — | Người dùng của CQCM, có tìm kiếm; mặc định người xử lý công việc |

### 7.4.16 dtms-ms01-t20-ky-bm04

Quy trình MS01, bước 20.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Tiêu đề | text | — | — | — | — | — | cqcmTen, lan, phienBan | **{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}} |
| 2 | — | Phiếu nhận xét do chuyên viên lập | table | — | — | muc=Mục; danhGia=Đánh giá; nhanXet=Nội dung nhận xét; huongDan=Hướng dẫn sửa | — | — | bm04Phieu | Chỉ đọc, dữ liệu bước 19 của cùng CQCM |
| 3 | — | Dự thảo BM-04 | text | — | — | — | — | — | — | Dự thảo BM-04 của phiếu này: xem ở **Văn bản đầu ra**. |

### 7.4.17 dtms-ms01-t26-ket-qua-bm04

Quy trình MS01, bước 26.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Lý do trả lại | html | — | — | — | — | =traLaiKy = null | traLaiKy.buoc, traLaiKy.nguoi, traLaiKy.lyDo | Hồ sơ bị trả lại ở bước {{traLaiKy.buoc}} — {{traLaiKy.nguoi}}: {{traLaiKy.lyDo}} |
| 2 | — | Trạng thái phiếu BM-04 | table | — | — | cqcm=CQCM; nguoi=Người lập / Chỉ huy; lan=Lần; ky=Ký; khongOk=Số Không OK | — | — | bm04TrangThai | Chỉ đọc; các phiếu BM-04 của lần thẩm định hiện tại |
| 3 | — | Kết quả AI kiểm tra xung đột | ai | — | — | — | — | =aiXungDot = null | aiXungDot | **AI kiểm tra xung đột giữa các BM-04:** {{aiXungDot}} |
| 4 | — | Kết quả AI kiểm tra xung đột | text | — | — | — | — | =aiXungDot != null | — | **AI kiểm tra xung đột giữa các BM-04:** Chưa có kết quả gợi ý AI. |
| 5 | — | Gợi ý AI đồng bộ ý kiến | ai | — | — | — | — | =aiDongBo = null | aiDongBo | **AI tóm tắt, gộp ý kiến theo mục, kèm hướng dẫn sửa:** {{aiDongBo}} |
| 6 | — | Gợi ý AI đồng bộ ý kiến | text | — | — | — | — | =aiDongBo != null | — | **AI tóm tắt, gộp ý kiến theo mục:** Chưa có kết quả gợi ý AI. |
| 7 | quyetDinhYKien | Quyết định với từng ý kiến | dynamiclist | — | — | — | — | — | — | Dòng khởi tạo: biến cùng khóa do tác vụ hệ thống bước 25 ghi, gồm mọi dòng ý kiến Đang xử lý (mã dòng, nguồn, mục, nội dung nhận xét); dòng từ lý do trả lại cũng là một dòng. Không thêm, xóa dòng |
| 8 | quyetDinhYKien\[\]. | — | text | — | — | — | — | — | — | **{{this.nguon}}** · {{this.muc}} |
| 9 | quyetDinhYKien\[\]. | — | text | — | — | — | — | — | — | {{this.nhanXet}} |
| 10 | quyetDinhYKien\[\].quyetDinh | Quyết định | radio | Có | — | ACCEPT=Đồng ý sửa; RESERVE=Không đồng ý | — | — | — | Mặc định chưa chọn. Đồng ý sửa lưu Tiếp thu, Không đồng ý lưu Bảo lưu (BR-DXMS-07-05). Sửa được tới khi hoàn thành bước. Dòng thuộc mục Giá trị và cơ sở giá chỉ nhận Không đồng ý: eForm báo tại dòng, máy chủ kiểm tra … |
| 11 | quyetDinhYKien\[\]. | — | text | — | — | — | — | =this.muc != "Giá trị và cơ sở giá" | — | *Chỉ chọn được Không đồng ý: Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới.* |
| 12 | — | Không có ý kiến | text | — | — | — | — | =count(quyetDinhYKien) \> 0 | — | Không có ý kiến cần quyết định. |
| 13 | — | — | text | — | — | — | — | — | — | Có ý kiến Không đồng ý thì hồ sơ sang lập giải trình; đồng ý sửa toàn bộ thì sang hoàn chỉnh hồ sơ. |

### 7.4.18 dtms-ms01-t27-hoan-chinh

Quy trình MS01, bước 27. Văn bản của bước: BM-01, BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Việc cần sửa | table | — | — | nguon=Nguồn; muc=Mục; nhanXet=Nội dung nhận xét; huongDan=Hướng dẫn sửa | — | =count(viecCanSua) = 0 | viecCanSua | — | Dòng ý kiến Tiếp thu, Đang xử lý của hồ sơ; Nguồn là CQCM hoặc người trả lại |
| 2 | — | Không có việc cần sửa | text | — | — | — | — | =count(viecCanSua) \> 0 | — | — | Không có nội dung phải sửa. |
| 3 | — | Kết luận cuộc họp | text | — | — | — | — | =ketLuanHop = null | ketLuanHop | — | **Kết luận cuộc họp:** {{ketLuanHop}} |
| 4 | — | Kết luận của Người có thẩm quyền | text | — | — | — | — | =ketLuan = null | ketLuan | — | **Kết luận của Người có thẩm quyền:** {{ketLuan}} |
| 5 | — | Chưa đạt ở bước 35 | table | — | — | cqcm=CQCM; muc=Mục; lyDo=Lý do | — | =count(chuaDat35) = 0 | chuaDat35 | — | Hiện khi hồ sơ về từ bước 35: lý do Chưa đạt của từng CQCM trên phiên bản hiện tại |
| 6 | — | So sánh phiên bản | text | — | — | — | — | — | linkSoSanh | — | [So sánh phiên bản]({{linkSoSanh}}): phiên bản hiện tại với phiên bản CQCM đã nhận xét. |
| 7 | — | Tờ trình | text | — | — | — | — | — | — | MS01.01+MS01.02 | \### Tờ trình BM-01 |
| 8 | — | Tờ trình | text | — | — | — | — | — | — | MS01.03 | \### Tờ trình BM-09 |
| 9 | — | Kính gửi | text | — | — | — | — | — | hoSo.nguoiCoThamQuyen | — | **Kính gửi:** {{hoSo.nguoiCoThamQuyen}} |
| 10 | — | Căn cứ | text | — | — | — | — | — | hoSo.canCu | — | **Căn cứ:** {{hoSo.canCu}} |
| 11 | mucDich | 1\. Mục đích | textarea | Có | 2000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 12 | suCanThiet | 2.1 Sự cần thiết phải mua sắm | textarea | Có | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12; ở bước 27 không có bảng gợi ý AI |
| 13 | — | 2.2 Danh mục hàng hóa, dịch vụ | table | — | — | n=TT; hang=Tên hàng hóa, dịch vụ; dvt=Đơn vị tính; slMua=SL mua sau tồn kho | — | — | danhMucHang | — | Hạng mục đã xác nhận của hồ sơ, SL mua sau tồn kho; chỉ đọc |
| 14 | — | 2.3 Giá trị | text | — | — | — | — | — | hoSo.tong, hoSo.tongBangChu, coCauChiPhi | — | **2.3 Giá trị:** {{hoSo.tong}} đồng, đã gồm VAT, theo cơ sở giá (bằng chữ: {{hoSo.tongBangChu}}). Cơ cấu theo Loại chi phí: {{coCauChiPhi}} |
| 15 | phuongPhap | Phương pháp tính toán | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 16 | phuongPhapSoLuong | Phương pháp tính số lượng | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 17 | quanDiem | Quan điểm thực hiện | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 18 | phuongAn | Phương án kỹ thuật – công nghệ | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 19 | coSoDonGia | Cơ sở xác định đơn giá | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 20 | — | Sử dụng hàng tồn kho | text | — | — | — | — | — | cauTonKho | — | **Sử dụng hàng tồn kho:** {{cauTonKho}} |
| 21 | — | 2.4 Nguồn vốn, Thời gian thực hiện | text | — | — | — | — | — | hoSo.nguonVon, period | — | **a) Nguồn vốn:** {{hoSo.nguonVon}} · **b) Thời gian thực hiện:** {{period}} |
| 22 | nguonNganSach | Nguồn ngân sách | textfield | — | 500 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12; không bắt buộc |
| 23 | hieuQua | 2.5 Đánh giá hiệu quả | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 24 | bienPhap | 2.6 Biện pháp thực hiện | textarea | Có | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 25 | keHoach | Kế hoạch tổ chức thực hiện | textarea | Có | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 26 | — | Phụ lục chi phí | table | — | — | n=STT; hang=Hàng hóa; sl=SL mua; donGia=Đơn giá; thanhTien=Thành tiền; coSo=Cơ sở giá; loaiChiPhi=Loại chi phí | — | — | phuLucChiPhi | — | Chỉ đọc, như bước 11, 12 |
| 27 | — | Checklist 01 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.01+MS01.02 | Chỉ đọc; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 28 | — | Checklist 02 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.03 | Chỉ đọc; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 29 | — | Ghi chú gửi | text | — | — | — | — | — | — | — | Khi gửi, hệ thống tạo phiên bản mới và sinh lại Tờ trình, Phụ lục chi phí, Checklist, BM-02 và Phụ lục 1 ở **Văn bản đầu ra**. |

### 7.4.19 dtms-ms01-t28-giai-trinh

Quy trình MS01, bước 28. Văn bản của bước: BM-02.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | — | text | — | — | — | — | — | vongGiaiTrinh | — | Vòng xử lý **{{vongGiaiTrinh}}** · {{count(giaiTrinh\[quyetDinh = "ACCEPT"\])}} ý kiến tiếp thu, {{count(giaiTrinh\[quyetDinh = "RESERVE"\])}} ý kiến bảo lưu |
| 2 | giaiTrinh | Phụ lục 1 BM-02 — Bảng giải trình ý kiến | dynamiclist | — | — | — | — | — | — | — | Dòng khởi tạo: biến cùng khóa do HX-16 của luật MS01_T26_HOAN_THANH nạp, gồm mọi dòng ý kiến Đang xử lý đã có Quyết định, sắp theo CQCM, bố cục Phụ lục 1 BM-02. Không thêm, xóa dòng |
| 3 | giaiTrinh\[\]. | — | text | — | — | — | — | — | — | — | **{{this.nguon}}** · {{this.muc}} {{this.nhanXet}} |
| 4 | giaiTrinh\[\]. | — | text | — | — | — | — | — | — | — | **{{if this.quyetDinh = "ACCEPT" then "Tiếp thu" else "Bảo lưu"}}** |
| 5 | giaiTrinh\[\].noiDung | Nội dung giải trình | textarea | Có | 2000 | — | — | — | — | — | Mọi dòng, cả Tiếp thu và Bảo lưu |
| 6 | giaiTrinh\[\].thamChieu | Tham chiếu trong văn bản | textfield | — | 255 | — | — | — | — | — | Ví dụ: BM-01 mục 9 |
| 7 | giaiTrinh\[\].ghiChu | Ghi chú | textfield | — | 500 | — | — | — | — | — | — |
| 8 | — | Tờ trình | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Có dòng Tiếp thu: sửa phần tiếp thu của Tờ trình ngay trong bước này; khi gửi, Tờ trình sinh lại từ dữ liệu form. |
| 9 | — | Tờ trình | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | MS01.01+MS01.02 | \### Tờ trình BM-01 |
| 10 | — | Tờ trình | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | MS01.03 | \### Tờ trình BM-09 |
| 11 | — | Kính gửi | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.nguoiCoThamQuyen | — | **Kính gửi:** {{hoSo.nguoiCoThamQuyen}} |
| 12 | — | Căn cứ | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.canCu | — | **Căn cứ:** {{hoSo.canCu}} |
| 13 | mucDich | 1\. Mục đích | textarea | Có | 2000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 14 | suCanThiet | 2.1 Sự cần thiết phải mua sắm | textarea | Có | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 15 | — | 2.2 Danh mục hàng hóa, dịch vụ | table | — | — | n=TT; hang=Tên hàng hóa, dịch vụ; dvt=Đơn vị tính; slMua=SL mua sau tồn kho | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | danhMucHang | — | Hạng mục đã xác nhận của hồ sơ, SL mua sau tồn kho; chỉ đọc |
| 16 | — | 2.3 Giá trị | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.tong, hoSo.tongBangChu, coCauChiPhi | — | **2.3 Giá trị:** {{hoSo.tong}} đồng, đã gồm VAT, theo cơ sở giá (bằng chữ: {{hoSo.tongBangChu}}). Cơ cấu theo Loại chi phí: {{coCauChiPhi}} |
| 17 | phuongPhap | Phương pháp tính toán | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 18 | phuongPhapSoLuong | Phương pháp tính số lượng | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 19 | quanDiem | Quan điểm thực hiện | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 20 | phuongAn | Phương án kỹ thuật – công nghệ | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 21 | coSoDonGia | Cơ sở xác định đơn giá | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 22 | — | Sử dụng hàng tồn kho | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | cauTonKho | — | **Sử dụng hàng tồn kho:** {{cauTonKho}} |
| 23 | — | 2.4 Nguồn vốn, Thời gian thực hiện | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.nguonVon, period | — | **a) Nguồn vốn:** {{hoSo.nguonVon}} · **b) Thời gian thực hiện:** {{period}} |
| 24 | nguonNganSach | Nguồn ngân sách | textfield | — | 500 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; không bắt buộc |
| 25 | hieuQua | 2.5 Đánh giá hiệu quả | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 26 | bienPhap | 2.6 Biện pháp thực hiện | textarea | Có | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 27 | keHoach | Kế hoạch tổ chức thực hiện | textarea | Có | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 28 | — | — | text | — | — | — | — | — | — | — | Khi gửi, hệ thống tăng phiên bản và sinh BM-02, Phụ lục 1, Tờ trình ở **Văn bản đầu ra**. |

### 7.4.20 dtms-ms01-t31-to-chuc-hop

Quy trình MS01, bước 31.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | — | text | — | — | — | — | — | hoSo.ma, vongGiaiTrinh | \### Cảnh báo vượt số vòng xử lý Hồ sơ {{hoSo.ma}} đã qua **{{vongGiaiTrinh}}** vòng xử lý, vượt ngưỡng 2. Đã gửi yêu cầu họp tới đơn vị đề xuất, các CQCM và TTMS. |
| 2 | thoiGianHop | Thời gian | datetime | Có | — | — | — | — | — | DD/MM/YYYY HH:mm. Không so với ngày hiện tại vì có thể ghi lại cuộc họp đã diễn ra |
| 3 | diaDiemHop | Địa điểm | textfield | Có | 255 | — | — | — | — | — |
| 4 | thanhPhanHop | Thành phần | taglist | Có | — | @nguoiDungOptions | — | — | — | Nhiều lựa chọn, có tìm kiếm, ít nhất một người. Giá trị khởi tạo: biến cùng khóa do tác vụ hệ thống bước 30 ghi (ĐV, CH của hồ sơ; người xử lý các CQCM của lần mới nhất; người TTMS xử lý hồ sơ). Máy chủ kiểm tra người … |
| 5 | — | Nội dung còn vướng mắc | table | — | — | nguon=CQCM; nhanXet=Ý kiến nhận xét; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình; thamChieu=Tham chiếu | — | — | nokGiaiTrinh | Dòng Bảo lưu Đang xử lý; chỉ đọc |

### 7.4.21 dtms-ms01-t32-ket-qua-hop

Quy trình MS01, bước 32.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | bienBanHop | Biên bản họp | filepicker | Có | — | — | — | — | — | Một tệp, theo quy tắc tải tệp của hệ thống; đưa vào Danh sách tài liệu. Thông báo khi thiếu: "Vui lòng tải lên Biên bản họp." |
| 2 | ketLuanHop | Kết luận | textarea | Có | 2000 | — | — | — | — | Mặc định rỗng; bắt buộc với cả hai nút của bước |

### 7.4.22 dtms-ms01-t33-trinh-cap-cao

Quy trình MS01, bước 33.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Nội dung chưa thống nhất | table | — | — | nguon=CQCM; nhanXet=Ý kiến nhận xét; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình; thamChieu=Tham chiếu | — | — | nokGiaiTrinh | Dòng Bảo lưu Đang xử lý; chỉ đọc |
| 2 | — | Biên bản họp | text | — | — | — | — | — | bienBanHop | **Biên bản họp:** {{bienBanHop}} |
| 3 | — | Kết luận của cuộc họp | text | — | — | — | — | — | ketLuanHop | **Kết luận của cuộc họp:** {{ketLuanHop}} |

### 7.4.23 dtms-ms01-t34-ket-luan

Quy trình MS01, bước 34.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Nội dung chưa thống nhất | table | — | — | nguon=CQCM; nhanXet=Ý kiến nhận xét; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình; thamChieu=Tham chiếu | — | — | nokGiaiTrinh | Dòng Bảo lưu Đang xử lý; chỉ đọc |
| 2 | — | Biên bản họp | text | — | — | — | — | — | bienBanHop | **Biên bản họp:** {{bienBanHop}} |
| 3 | — | Kết luận của cuộc họp | text | — | — | — | — | — | ketLuanHop | **Kết luận của cuộc họp:** {{ketLuanHop}} |
| 4 | ketLuan | Kết luận của Thủ trưởng | textarea | Có | 2000 | — | — | — | — | Mặc định rỗng; áp dụng cho cả hai nút; cũng là biến bắt buộc của hai luật bước 34 |

### 7.4.24 dtms-ms01-t35-kiem-tra-sua

Quy trình MS01, bước 35.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Tiêu đề, So sánh phiên bản | text | — | — | — | — | — | cqcmTen, phienBan | \### {{cqcmTen}} · Hồ sơ v{{phienBan}} |
| 2 | — | Kết quả kiểm tra lần trước | text | — | — | — | — | =not(ketQuaLanTruoc) | ketQuaLanTruoc | Kết quả kiểm tra lần trước (chỉ tham khảo): {{ketQuaLanTruoc}} |
| 3 | kiemTraYKien | Ý kiến của cơ quan | dynamiclist | — | — | — | — | — | kiemTraYKien | Dòng ý kiến của CQCM này qua mọi lần thẩm định, trừ dòng Không còn áp dụng; giá trị khởi tạo từ biến kiemTraYKien |
| 4 | kiemTraYKien\[\]. | — | text | — | — | — | — | — | — | **Lần {{this.lan}} · {{this.muc}}** |
| 5 | kiemTraYKien\[\]. | — | text | — | — | — | — | — | — | Quyết định của đơn vị: {{this.quyetDinhDv}} · Giải trình: {{this.giaiTrinh}} · Tham chiếu: {{this.thamChieu}} · Kết quả hiện tại: {{this.ketQuaHienTai}} |
| 6 | kiemTraYKien\[\].ketQuaKiemTra | Kết quả kiểm tra | radio | Có | — | Đạt; Chưa đạt | — | — | — | Mặc định chưa chọn |
| 7 | kiemTraYKien\[\].lyDo | Lý do | textarea | Có | 2000 | — | — | =this.ketQuaKiemTra != "Chưa đạt" | — | — |
| 8 | — | — | text | — | — | — | — | =count(kiemTraYKien) \> 0 | — | Không có ý kiến cần kiểm tra. |

### 7.4.25 dtms-ms01-t36-ky-checklist

Quy trình MS01, bước 36.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | ✦ Gợi ý AI — kiểm tra đủ hồ sơ | ai | — | — | — | — | — | aiHoSo | **Kết quả: {{aiHoSo.ketQua}}** |
| 2 | — | Checklist hồ sơ của phiên bản hiện tại | table | — | — | nhom=Nhóm; muc=Danh mục hồ sơ; yeuCau=Yêu cầu; tinhTrang=Tình trạng; tep=Tệp | — | — | checklist | — |
| 3 | — | — | text | — | — | — | — | — | clName, phienBan | Dự thảo BM-04 ký lại (các dòng đã kiểm tra ở bước 35 kèm câu "Đơn vị đã xử lý ý kiến.") và {{clName}} của phiên bản v{{phienBan}}: xem ở **Văn bản đầu ra**. |

### 7.4.26 dtms-ms01-t38-39-ky-bm09

Quy trình MS01, bước 38, 39. Văn bản của bước: BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | KPI toàn trình | text | — | — | — | — | — | kpiToanTrinh | **KPI toàn trình:** {{kpiToanTrinh}} |
| 2 | — | Khối chữ ký BM-09 (kết quả ký từ VOffice) | table | — | — | nguoiKy=Người ký; tuCach=Tư cách; trangThai=Trạng thái; thoiDiem=Thời điểm | — | — | kyBm09 | Một dòng TTMS, một dòng Phó TGĐ/Phó GĐ; lần trình ký mới nhất của mỗi người ký trên BM-09 phiên bản hiện tại. Biến do nền tảng trình ký ghi (YC-NT-03) |
| 3 | — | BM-09 bản trình ký, hồ sơ kèm theo | text | — | — | — | — | — | phienBan | BM-09 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**. Hồ sơ kèm theo: Checklist 02, BM-04 đã ký, BM-02 ở **Danh sách tài liệu**. |

### 7.4.27 dtms-ms01-t42-ra-soat-bm05

Quy trình MS01, bước 42. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | bm05 | BM-05 Báo cáo kết quả thẩm định — dự thảo AI soạn | dynamiclist | — | — | — | — | — | bm05 | Dòng lấy từ biến bm05 do tác vụ AI bước 41 ghi, mỗi dòng một mục của phần I, II, III (Phần, Mục, Gợi ý, Nguồn); dòng phần I lấy từ hồ sơ, không qua AI. Không thêm, xóa dòng |
| 2 | bm05\[\]. | — | text | — | — | — | — | — | — | **{{this.phan}} · {{this.muc}}** |
| 3 | bm05\[\]. | — | text | — | — | — | — | — | — | {{this.goiY}} *Nguồn: {{this.nguon}}* |
| 4 | bm05\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | Chấp nhận | =this.phan = "I" | — | Phần I không có Quyết định |
| 5 | bm05\[\].noiDungSua | Nội dung sửa | textarea | Có | 4000 | — | — | =this.quyetDinh != "Sửa" | — | Bắt buộc khi Sửa |
| 6 | — | — | text | — | — | — | — | =some r in bm05 satisfies (r.phan != "I" and r.goiY != null and r.goiY != "") | bm05 | Chưa có kết quả gợi ý AI. |
| 7 | — | — | text | — | — | — | — | — | — | Bản BM-05 sinh từ mẫu và quyết định ở bảng trên xem ở **Văn bản đầu ra** sau khi hoàn tất rà soát. |

### 7.4.28 dtms-ms01-t43-du-dieu-kien

Quy trình MS01, bước 43. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Điều kiện giao ký BM-05 | table | — | — | dieuKien=Điều kiện; ketQua=Kết quả | — | — | dieuKienKyBm05 | Hai dòng: BM-05 đã được rà soát trên phiên bản hiện tại; mọi CQCM có BM-04 và Checklist Đã ký trên phiên bản hiện tại. Kết quả Đạt / Chưa đạt do HX-09 ghi khi hoàn thành bước 42 (điều kiện của KT-04). Chỉ xem; KT-04 … |
| 2 | — | Gợi ý khi chưa đủ điều kiện | text | — | — | — | — | =every d in dieuKienKyBm05 satisfies d.ketQua = "Đạt" | dieuKienKyBm05 | Hồ sơ chưa đủ điều kiện giao ký BM-05. Chọn Trả lại để đưa hồ sơ về đơn vị. |
| 3 | — | BM-05 Báo cáo kết quả thẩm định | table | — | — | phan=Phần; muc=Mục; goiY=Gợi ý AI; quyetDinh=Quyết định; noiDungSua=Nội dung sửa | — | — | bm05 | BM-05 đã chốt ở bước 42, chỉ đọc |
| 4 | — | — | text | — | — | — | — | — | phienBan | BM-05 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**. |

### 7.4.29 dtms-ms01-t46-47-ky-bm05

Quy trình MS01, bước 46, 47. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Người ký BM-05 (kết quả ký từ VOffice) | table | — | — | nguoiKy=Người ký; tuCach=Đơn vị / tư cách; trangThai=Trạng thái; trinhLuc=Trình ký lúc; kyLuc=Ký lúc; thoiGian=Thời gian xử lý (NLV); kpi=KPI ký; lyDo=Lý do từ chối | — | — | kyBm05 | Mọi người ký BM-05 của phiên bản hiện tại: TTMS, CQCM về tài chính kế toán, CQCM có liên quan, Phó TGĐ/Phó GĐ; Trạng thái Đã ký, Chưa ký, Không đồng ý. Biến do nền tảng trình ký ghi (YC-NT-03) |
| 2 | — | ✦ Gợi ý AI — đánh giá KPI người ký | ai | — | — | — | — | — | aiKpiKy | {{aiKpiKy}} |
| 3 | — | — | text | — | — | — | — | — | phienBan | BM-05 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**. |

### 7.4.30 dtms-ms01-t48-bao-cao-td

Quy trình MS01, bước 48. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | BM-05 đã ký đủ | text | — | — | — | — | — | — | \### BM-05 đã ký đủ - TTMS đã ký với tư cách CQCM về đầu tư – xây dựng. - CQCM về tài chính kế toán, CQCM có liên quan và Phó TGĐ/Phó GĐ đã ký. |
| 2 | — | Căn cứ của hồ sơ | table | — | — | vanBan=Văn bản; loai=Loại; tdDuyet=Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt | — | — | canCuTd | Chỉ xem. Dòng lấy từ biến canCuTd do tác vụ gợi ý báo cáo Tập đoàn ghi trước bước 48 |
| 3 | — | Gợi ý của hệ thống | text | — | — | — | — | — | reportSuggested, reportSuggestReason | **Gợi ý:** {{#if reportSuggested}}Có{{else}}Không{{/if}} báo cáo Tổng Giám đốc Tập đoàn — {{reportSuggestReason}} |
| 4 | — | Hướng dẫn chọn | text | — | — | — | — | — | — | Hai lựa chọn Có, Không đều dùng được. Chọn khác gợi ý thì nhập Lý do. |
| 5 | reportReason | Lý do | textarea | — | 2000 | — | — | — | — | Bắt buộc khi bấm nút khác gợi ý; máy chủ kiểm tra bằng KT-05 (BR-DXMS-08-08) |

### 7.4.31 dtms-ms01-t50-51-bm06

Quy trình MS01, bước 50, 51. Văn bản của bước: BM-06.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Hướng dẫn rà soát BM-06 | text | — | — | — | — | =phanBm06 != "RA_SOAT" | phanBm06 | Dự thảo **BM-06** do AI soạn theo mục từ BM-05 và hồ sơ. Bản sinh từ bảng dưới xem ở **Văn bản đầu ra**. |
| 2 | bm06 | Bảng mục BM-06 | dynamiclist | — | — | — | — | =phanBm06 != "RA_SOAT" | bm06 | Dòng lấy từ biến bm06 do tác vụ AI bước 49 ghi: muc, goiY, nguon, tuHoSo. Mục lấy từ hồ sơ (phần I mục 1, 4, 5, 6) không có Quyết định |
| 3 | bm06\[\]. | — | text | — | — | — | — | — | — | **{{this.muc}}** |
| 4 | bm06\[\]. | — | text | — | — | — | — | — | — | {{this.goiY}} *Nguồn: {{this.nguon}}* |
| 5 | bm06\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | Chấp nhận | =this.tuHoSo | — | — |
| 6 | bm06\[\].noiDungSua | Nội dung sửa | textarea | Có | 4000 | — | — | =this.quyetDinh != "Sửa" | — | — |
| 7 | bm06\[\].noiDungChot | — | expression | — | — | — | =if this.tuHoSo or this.quyetDinh = "Chấp nhận" then this.goiY else if this.quyetDinh = "Sửa" then this.noiDungSua else "" | — | — | Nội dung của mục đưa vào mẫu BM-06 (trường trộn) |
| 8 | — | — | text | — | — | — | — | =phanBm06 != "RA_SOAT" or count(bm06) \> 0 | bm06 | Chưa có kết quả gợi ý AI. |
| 9 | dauMoiBm06 | Đầu mối phối hợp | select | Có | — | @nguoiDungTtms | — | =phanBm06 != "RA_SOAT" | — | Người dùng TTMS, có tìm kiếm. Trường trộn của BM-06; người nhận thông báo kèm BM-07 ở bước 55 |
| 10 | — | Hướng dẫn xác nhận | text | — | — | — | — | =phanBm06 != "XAC_NHAN" | phanBm06 | BM-06, BM-05 và hồ sơ kèm xem ở **Văn bản đầu ra**. |
| 11 | tepDinhKemBm06 | Tệp đính kèm | filepicker | Có | — | — | — | =phanBm06 != "XAC_NHAN" | — | Nhiều tệp. Bắt buộc ở cả hai nút của bước xác nhận |
| 12 | lyDoTraLai | Lý do không đồng ý | textarea | — | 2000 | — | — | =phanBm06 != "XAC_NHAN" | — | Biến bắt buộc của luật không đồng ý (mục 2.5, thứ tự 3); thành dòng ý kiến khi hồ sơ tới bước 25 (BR-DXMS-07-05) |

### 7.4.32 dtms-ms01-t53-56-tap-doan

Quy trình MS01, bước 53, 54, 55, 56. Văn bản của bước: BM-06.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Xem xét hồ sơ | text | — | — | — | — | =phanTapDoan != "XEM_XET" | phanTapDoan | \### Xem xét hồ sơ, lập BM-07 BM-06 và hồ sơ kèm xem ở **Văn bản đầu ra**. |
| 2 | — | Gửi BM-07 | text | — | — | — | — | =phanTapDoan != "BM07" | phanTapDoan | \### Gửi BM-07 tới Tổng Giám đốc Tập đoàn BM-07 do Trưởng ban Ban ĐTXD Tập đoàn ký ngoài hệ thống; tải bản đã ký. |
| 3 | — | Thông báo | text | — | — | — | — | =phanTapDoan != "THONG_BAO" | phanTapDoan | \### Thông báo cho TTMS và Đầu mối của đơn vị đề xuất Xác nhận thì hệ thống gửi thông báo kèm BM-07. |
| 4 | — | Ý kiến Tập đoàn | text | — | — | — | — | =phanTapDoan != "Y_KIEN" | phanTapDoan | \### Tổng Giám đốc Tập đoàn xem xét, cho ý kiến |
| 5 | vanBanNhanDuoc | Văn bản nhận được | filepicker | — | — | — | — | =phanTapDoan != "XEM_XET" | — | Một tệp: văn bản chấp nhận hoặc trả lại của Ban ĐTXD Tập đoàn. Bắt buộc khi ghi nhận thay; máy chủ kiểm tra bằng KT-09 |
| 6 | bm07Tep | BM-07 đã ký | filepicker | Có | — | — | — | =phanTapDoan != "BM07" | — | Một tệp |
| 7 | bm07So | Số văn bản | textfield | Có | 100 | — | — | =phanTapDoan != "BM07" | — | — |
| 8 | bm07Ngay | Ngày ký | datetime | Có | — | — | — | =phanTapDoan != "BM07" | — | — |
| 9 | yKienTdNoiDung | Ý kiến của Tổng Giám đốc Tập đoàn | textarea | — | 4000 | — | — | =phanTapDoan != "Y_KIEN" | — | — |
| 10 | yKienTdTep | Phiếu ý kiến hoặc văn bản nhận được | filepicker | — | — | — | — | =phanTapDoan != "Y_KIEN" | — | Một tệp. Bắt buộc khi ghi nhận thay; máy chủ kiểm tra bằng KT-09 |
| 11 | lyDoTraLai | Lý do trả lại | textarea | — | 2000 | — | — | =phanTapDoan != "XEM_XET" and phanTapDoan != "Y_KIEN" | — | Biến bắt buộc của luật trả lại (mục 2.5, thứ tự 3); thành dòng ý kiến khi hồ sơ tới bước 25 (BR-DXMS-07-05) |

### 7.4.33 dtms-ms01-t58-60-bm08

Quy trình MS01, bước 58, 59, 60. Văn bản của bước: BM-08.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Dự thảo BM-08 | text | — | — | — | — | — | — | Dự thảo **Quyết định BM-08** do hệ thống sinh — xem ở **Văn bản đầu ra**. Hồ sơ kèm (Checklist 01, BM-02, BM-04, BM-05; BM-06, BM-07 nếu có) ở Danh sách tài liệu. |
| 2 | — | Chưa sinh được dự thảo | text | — | — | — | — | =bm08DaSinh | bm08DaSinh | Chưa sinh được dự thảo. |
| 3 | bm08Dieu2 | Điều 2. Tổ chức thực hiện | textarea | Có | 4000 | — | =bm08Dieu2Mau | — | bm08Dieu2Mau | Giá trị khởi tạo: câu mẫu giao đơn vị đề xuất tổ chức mua sắm (biến bm08Dieu2Mau do bước 57 ghi từ mẫu). Trường trộn Điều 2 của BM-08 |
| 4 | bm08NoiNhan | Nơi nhận | textarea | Có | 1000 | — | Như Điều 3; Lưu: VT | — | — | Trường trộn Nơi nhận của BM-08 |
| 5 | — | Checklist 01 của phiên bản hiện tại | table | — | — | nhom=Nhóm; muc=Danh mục hồ sơ; yeuCau=Yêu cầu; tinhTrang=Tình trạng; tep=Tệp | — | — | checklist | Chỉ xem, như bước 12 |

### 7.4.34 dtms-ms01-t60-phe-duyet-bm09

Quy trình MS01, bước 60. Văn bản của bước: BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | KPI toàn trình | text | — | — | — | — | — | kpi, kpiGioiHan, phienBan | — | **KPI toàn trình:** {{kpi}} / {{kpiGioiHan}} NLV · **Phiên bản trình:** v{{phienBan}} |
| 2 | — | Văn bản phê duyệt BM-08 | text | — | — | — | — | — | — | MS01.01+MS01.02 | Văn bản phê duyệt: **Quyết định BM-08** — xem ở **Văn bản đầu ra**. Hồ sơ kèm (Checklist 01, BM-02, BM-04, BM-05; BM-06, BM-07 nếu có) ở Danh sách tài liệu. |
| 3 | — | Khối chữ ký thẩm định BM-09 | table | — | — | nguoiKy=Người ký; tuCach=Tư cách; trangThai=Trạng thái; thoiDiem=Thời điểm | — | — | kyBm09 | MS01.03 | Chỉ xem: kết quả ký thẩm định bước 40 |
| 4 | — | Văn bản phê duyệt BM-09 | text | — | — | — | — | — | — | MS01.03 | Văn bản phê duyệt: **BM-09** đã có chữ ký thẩm định — xem ở **Văn bản đầu ra**. Phê duyệt là ký ô PHÊ DUYỆT trên BM-09. |
| 5 | — | Ý kiến của Tổng Giám đốc Tập đoàn | text | — | — | — | — | — | yKienTdNoiDung, yKienTdTep | MS01.01 | \### Ý kiến của Tổng Giám đốc Tập đoàn {{yKienTdNoiDung}} *Phiếu ý kiến hoặc văn bản nhận được: {{yKienTdTep}}* |
| 6 | — | ✦ Gợi ý AI — đọc ý kiến của Tổng Giám đốc Tập đoàn | ai | — | — | — | — | =yKienTdAi = null | yKienTdAi | MS01.01 | {{yKienTdAi}} |
| 7 | — | — | text | — | — | — | — | =yKienTdAi != null | yKienTdAi | MS01.01 | Chưa có kết quả gợi ý AI. |

### 7.4.35 dtms-ms02-t01-dxms-dieu-chinh

Quy trình MS02, bước 1.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | ĐXMS cần điều chỉnh | text | — | — | — | — | — | adj.dxms, adj.dxmsTen, adj.from, adj.fromFlow, adj.fromAt, adj.before | \### ĐXMS cần điều chỉnh **{{adj.dxms}}** — {{adj.dxmsTen}} Hồ sơ căn cứ: **{{adj.from}}** (quy trình {{adj.fromFlow}}, hoàn thành {{adj.fromAt}}) · Giá trị hiệu lực **{{adj.before}} tỷ đồng** |
| 2 | — | Văn bản phê duyệt của hồ sơ căn cứ | table | — | — | vanBan=Văn bản; ten=Tên; hoSo=Hồ sơ; so=Số; ngayKy=Ngày ký; tep=Tệp | — | — | adjOldDocs | Chỉ xem; tải được tệp đã ký. Dòng lấy từ biến adjOldDocs do màn Thêm mới ghi khi tạo hồ sơ (kết quả ký của hồ sơ căn cứ) |
| 3 | xacNhanDxms | Đây là ĐXMS cần điều chỉnh | checkbox | Có | — | — | — | — | — | Thông báo khi bỏ trống: "Vui lòng chọn Đây là ĐXMS cần điều chỉnh." |
| 4 | — | Hướng dẫn | text | — | — | — | — | — | — | Không đổi được ĐXMS ở bước này; chọn sai thì Hủy hồ sơ. |

### 7.4.36 dtms-ms02-t04-noi-dung-dieu-chinh

Quy trình MS02, bước 4.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Lý do thiếu thông tin | text | — | — | — | — | =not(thieuThongTin) | thieuThongTin | Thiếu thông tin căn cứ: {{thieuThongTin.lyDo}} — {{thieuThongTin.nguoi}}, {{thieuThongTin.thoiDiem}} |
| 3 | adjAi | Gợi ý AI — thông tin điều chỉnh | aisuggest | — | — | Nhóm lý do=lyDoNhom; Phạm vi điều chỉnh=phamViDc; Hạng mục có thể cần điều chỉnh= | — | — | adjAi | Dòng lấy từ biến adjAi do tác vụ AI bước 3 ghi: Nhóm lý do, Phạm vi điều chỉnh, Hạng mục có thể cần điều chỉnh, mỗi mục kèm nguồn. Mục Hạng mục có thể cần điều chỉnh không có trường đích, chỉ để xem; sửa hạng mục ở … |
| 4 | adjAi\[\]. | — | text | — | — | — | — | — | — | **{{this.muc}}** |
| 5 | adjAi\[\]. | — | text | — | — | — | — | — | — | {{this.goiY}} *Nguồn: {{this.nguon}}* |
| 6 | adjAi\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | Chấp nhận | — | — | — |
| 7 | adjAi\[\].noiDungSua | Nội dung sửa | textarea | Có | 2000 | — | — | =this.quyetDinh != "Sửa" | — | — |
| 8 | — | — | text | — | — | — | — | =count(adjAi) \> 0 | — | Chưa có kết quả gợi ý AI. |
| 9 | — | Kết quả đã thực hiện | table | — | — | loai=Loại; ma=Mã; noiDung=Nội dung; trangThai=Trạng thái; thoiDiemLay=Thời điểm lấy | — | =count(adjDone) = 0 | adjDone | Chỉ xem (BR-DXMS-09-08). Dòng lấy từ biến adjDone do tác vụ hệ thống bước 2 ghi |
| 10 | — | Kết quả đã thực hiện — chưa có | text | — | — | — | — | =count(adjDone) \> 0 | adjDone | **Kết quả đã thực hiện:** Chưa có dữ liệu |
| 11 | purchaseType | Loại mua sắm | select | Có | — | DT=Duy trì hoạt động thường xuyên; SX=Liên tục SXKD; KH=Triển khai hoạt động khoa học công nghệ; QP=Quốc phòng, an ninh, chính trị | — | — | — | Giá trị khởi tạo: giá trị kế thừa (biến purchaseType ghi khi tạo hồ sơ). Khác giá trị trước điều chỉnh thì bảng trước – sau tự thêm dòng chỉ đọc |
| 12 | purpose | Mục đích | textarea | Có | 2000 | — | — | — | — | Giá trị khởi tạo: giá trị kế thừa. Khác giá trị trước điều chỉnh thì bảng trước – sau tự thêm dòng chỉ đọc |
| 13 | scope | Phạm vi, quy mô | textarea | — | 2000 | — | — | — | — | Giá trị khởi tạo: giá trị kế thừa. Khác giá trị trước điều chỉnh thì bảng trước – sau tự thêm dòng chỉ đọc |
| 14 | secret | Mật | radio | Có | — | false=Không; true=Có | — | — | — | Giá trị khởi tạo: giá trị kế thừa (Có nếu ĐXMS hoặc hồ sơ căn cứ là Có, BR-DXMS-09-03) |
| 15 | — | Cảnh báo Mật | text | — | — | — | — | =not(dxmsMat and secret = "false") | dxmsMat | ĐXMS đang là Mật, hồ sơ sẽ không được bảo vệ như hồ sơ Mật. |
| 16 | lyDoNhom | Nhóm lý do | select | Có | — | GIA=Thay đổi giá thị trường; QUY_MO=Thay đổi quy mô, số lượng; KY_THUAT=Thay đổi yêu cầu kỹ thuật, phương án công nghệ; NGUON_VON_TG=Thay đổi nguồn vốn, thời gian; KHAC=Khác | — | — | — | — |
| 17 | phamViDc | Phạm vi điều chỉnh | checklist | Có | — | GIA_TRI=Giá trị; DANH_MUC=Danh mục hàng hóa, số lượng; THONG_TIN=Thông tin cơ bản; CHI_TIEU=Chỉ tiêu kỹ thuật; THOI_GIAN=Thời gian thực hiện; NGUON_VON=Nguồn vốn; KHAC=Nội dung khác | — | — | — | Ít nhất một ("Vui lòng chọn Phạm vi điều chỉnh."). Bảng trước – sau tự chọn Thông tin cơ bản khi một trường Thông tin cơ bản khác giá trị trước điều chỉnh |
| 18 | lyDoDc | Lý do điều chỉnh | textarea | Có | 2000 | — | — | — | — | Nêu căn cứ, nguyên nhân phát sinh |
| 19 | canCuPhatSinh | Căn cứ phát sinh | filepicker | — | — | — | — | — | — | Nhiều tệp, theo mục 4.1. Văn bản chứng minh lý do điều chỉnh; HX-01 ghi vào Danh sách tài liệu của hồ sơ |
| 20 | giaTriSauDuKien | Giá trị sau điều chỉnh dự kiến (tỷ đồng, gồm VAT) | number | — | — | — | — | — | — | Không bắt buộc; lớn hơn 0, 2 chữ số thập phân (validate của eForm: "Giá trị sau điều chỉnh dự kiến phải lớn hơn 0."). Chỉ dùng để cảnh báo (BR-DXMS-09-05) |
| 21 | — | Chênh lệch dự kiến | text | — | — | — | — | =giaTriSauDuKien = null | adj.before, giaTriSauDuKien | Đã phê duyệt **{{adj.before}} tỷ** · chênh lệch **{{giaTriSauDuKien - adj.before}} tỷ** |
| 22 | adjRows | Bảng trước – sau | adjrows | — | — | phamVi=phamViDc; THOI_GIAN=period; NGUON_VON=fundId; CHI_TIEU=; KHAC=; THONG_TIN=purchaseType+purpose+scope+secret; truoc=adjTruoc | — | — | adjTruoc | Kiểu trường adjrows. Cột: Nội dung; Trước điều chỉnh (chỉ đọc từ adjTruoc khi phạm vi có trường nguồn; ô nhập tối đa 2000, bắt buộc với Chỉ tiêu kỹ thuật, Nội dung khác); Sau điều chỉnh (bắt buộc; Thời gian thực hiện … |
| 23 | nganSach | Ghi chú ngân sách | textarea | — | 2000 | — | — | — | — | BR-DXMS-09-10; đưa vào văn bản dự thảo |
| 24 | — | Khối điều chỉnh | adjimpact | — | — | hien=tacDong; coSo=giaTriSauDuKien | — | — | — | Kiểu trường adjimpact: khối Tác động điều chỉnh tính theo Giá trị sau điều chỉnh dự kiến; chưa nhập giá trị dự kiến thì chỉ hiện phần không cần giá trị |
| 25 | daXemTacDongDuKien | Đã xem tác động điều chỉnh | checkbox | — | — | — | — | — | — | Bắt buộc khi có Chuyển ngưỡng theo giá trị dự kiến; máy chủ kiểm tra bằng KT-19 (BR-DXMS-09-07) |

### 7.4.37 dtms-ms02-t05-boc-tach

Quy trình MS02, bước 5.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+tacDong; coSo=hangMuc | — | — | — | Kiểu trường adjimpact: dòng đầu điều chỉnh; khối Tác động tính phần hạng mục trong form (BR-DXMS-09-07) |
| 2 | canCu | Văn bản căn cứ | cancu | Có | — | khaiBao=có; boKhiCoHangMuc=không; bangThamKhao=có | — | — | — | Như bước 1 (DTMS_CN_0140), cùng khóa. Giá trị khởi tạo: văn bản căn cứ đã xác nhận của hồ sơ (biến canCu). Thêm được văn bản; bỏ được văn bản chưa có hạng mục liên kết (BR-DXMS-02-07); dòng của văn bản thêm mới chọn … |
| 3 | canCu\[\].loaiCanCu | Loại căn cứ | select | Có | — | @dmLoaiCanCu | — | — | — | Như bước 1 |
| 4 | canCu\[\].vanBanId | Văn bản căn cứ | select | Có | — | @vanBanCanCu | — | — | — | Như bước 1 |
| 5 | bocTach | Hạng mục | hangmuc | Có | — | vanBan=canCu | — | — | — | Kiểu trường tùy biến Bảng hạng mục liên kết căn cứ (mục 2.4.1). Đầu bảng hiện Cấu trúc căn cứ: các văn bản trong canCu, nhóm và số dòng đã khai báo, kèm tên tệp nguồn. Mỗi dòng một hạng mục; \[Thêm hạng mục\] thêm dòng, … |
| 6 | bocTach\[\].name | Tên hạng mục | textfield | Có | 500 | — | — | — | — | — |
| 7 | bocTach\[\].uom | ĐVT | select | Có | — | @dmDonViTinh | — | — | — | Danh mục Đơn vị tính, có tìm kiếm |
| 8 | bocTach\[\].nhom | Nhóm | select | Có | — | 1=Nhóm 1: hàng hóa, dịch vụ mua sẵn; 2=Nhóm 2: hàng hóa sản xuất theo yêu cầu | — | — | — | — |
| 9 | bocTach\[\].nganhHang | Ngành hàng | select | Có | — | @nganhOptions | — | — | — | Danh mục Loại hàng hóa, dịch vụ, có tìm kiếm. Dùng để lọc nhà cung cấp ở DTMS_CN_0145 |
| 10 | bocTach\[\].dongCanCu | Dòng căn cứ | select | Có | — | @dongCanCu | — | — | — | Có tìm kiếm. Dòng của các văn bản trong canCu, hiện “{Văn bản} › {Nhóm} › {Dòng}”, thêm hai giá trị NGOAI=Ngoài căn cứ, MOI=Thêm dòng mới. Hai hạng mục không dùng chung một dòng: inline tại dòng sau “Dòng căn cứ đã … |
| 11 | bocTach\[\].vanBanMoi | Văn bản | select | Có | — | @canCu | — | =this.dongCanCu != "MOI" | — | Văn bản trong số đã chọn của hồ sơ (canCu). Bắt buộc khi Thêm dòng mới |
| 12 | bocTach\[\].nhomMoi | Tên nhóm | textfield | Có | 255 | — | — | =this.dongCanCu != "MOI" | — | Bắt buộc khi Thêm dòng mới |
| 13 | bocTach\[\].tenDongMoi | Tên dòng mới | textfield | Có | 255 | — | — | =this.dongCanCu != "MOI" | — | Bắt buộc khi Thêm dòng mới. Dòng mới dùng lại được cho ĐXMS sau |
| 14 | bocTach\[\].bom | SL gốc | number | Có | — | — | — | =this.dongCanCu != "MOI" | — | Số không âm, tối đa 3 chữ số thập phân. Bắt buộc khi Thêm dòng mới; dòng có sẵn thì SL gốc chỉ đọc ở dòng dưới |
| 15 | bocTach\[\]. | — | text | — | — | — | — | — | — | SL gốc **{{this.slGoc}}** · Đã dùng {{this.daDung}} · Còn lại **{{this.conLai}}** |
| 16 | bocTach\[\].prop | SL đề xuất | number | Có | — | — | Còn lại của dòng | — | — | Lớn hơn 0, tối đa 3 chữ số thập phân; sai thì inline “SL đề xuất không hợp lệ.” Mặc định bằng Còn lại. Vượt Còn lại thì dòng hiện “Vượt số còn lại”; KT-12 kiểm tra lại khi Xác nhận |
| 17 | bocTach\[\]. | — | text | — | — | — | — | =this.ghiChu = "" | — | *{{this.ghiChu}}* |
| 18 | bocTach\[\]. | Trước điều chỉnh | text | — | — | — | — | =this.slTruoc = null | — | Trước: SL **{{this.slTruoc}}** · Đơn giá {{this.donGiaTruoc}} · Đã ký hợp đồng {{this.daKyHd}} |
| 19 | bocTach\[\].bo | Bỏ hạng mục | checkbox | — | — | — | — | =this.slTruoc = null | — | Chỉ ở dòng kế thừa (có slTruoc). Chọn: Số lượng điều chỉnh bằng 0, dòng hiện gạch ngang; bỏ chọn là Khôi phục, SL đề xuất về slTruoc. Dòng kế thừa không xóa được, chỉ Bỏ |
| 20 | bocTach\[\]. | Loại thay đổi | text | — | — | — | — | — | — | Loại thay đổi: **{{this.loaiThayDoi}}** |
| 21 | bocTach\[\]. | Cảnh báo giảm dưới số đã ký | text | — | — | — | — | =this.daKyHd = null or (not(this.bo) and this.prop \>= this.daKyHd) | — | *Số lượng điều chỉnh nhỏ hơn số đã ký hợp đồng ({{this.daKyHd}}).* |
| 22 | daXemTacDongHangMuc | Đã xem tác động điều chỉnh | checkbox | — | — | — | — | — | — | Bắt buộc khi có hạng mục giảm dưới số đã ký; máy chủ kiểm tra bằng KT-19 (BR-DXMS-09-07) |

### 7.4.38 dtms-ms02-t07-ra-soat-ton-kho

Quy trình MS02, bước 7.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | ruaSoatKho | Kết quả rà soát tồn kho | tonkho | — | — | — | — | — | — | Kiểu trường tùy biến Bảng chốt dùng từ kho (mục 2.4.1). Khi mở form đọc ở máy chủ bản rà soát mới nhất của hồ sơ (DTMS_CN_0142). Dòng trạng thái đầu bảng: “Kết quả rà soát tồn kho: {Chưa có kết quả, Đã có kết quả sổ … |
| 3 | ruaSoatKho\[\]. | — | text | — | — | — | — | — | — | **{{this.n}}. {{this.name}}** SL đề xuất: {{this.prop}} |
| 4 | ruaSoatKho\[\]. | — | text | — | — | — | — | — | — | Tồn sổ sách **{{this.book}}** · Đang giữ {{this.held}} {{this.heldDxms}} · Số đủ điều kiện {{this.actual}} · Tồn khả dụng **{{this.avail}}** Chất lượng: {{this.quality}} |
| 5 | ruaSoatKho\[\].fromStock | Dùng từ kho | number | — | — | — | Giá trị nhỏ hơn giữa Tồn khả dụng và SL đề xuất | =not(this.coKho) | — | Số không âm, bắt buộc khi Tồn khả dụng lớn hơn 0; từ 0 đến giá trị nhỏ hơn giữa Tồn khả dụng và SL đề xuất (BR-DXMS-03-03). Vượt thì inline “Dùng từ kho không được lớn hơn {giá trị}.”; sai định dạng, bỏ trống thì … |
| 6 | ruaSoatKho\[\]. | — | text | — | — | — | — | — | — | SL mua: **{{this.prop - (if this.coKho then this.fromStock else 0)}}** |
| 7 | ruaSoatKho\[\]. | Kết quả cũ | text | — | — | — | — | — | — | *Hồ sơ căn cứ: khả dụng {{this.cuAvail}}, dùng từ kho {{this.cuDung}}* |
| 8 | ruaSoatKho\[\]. | Loại thay đổi | text | — | — | — | — | — | — | Loại thay đổi: **{{this.loaiThayDoi}}** |

### 7.4.39 dtms-ms02-t08-ycbg

Quy trình MS02, bước 8.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Thông báo gửi lại | text | — | — | — | — | =lanGuiYcbg = null | lanGuiYcbg | **Lần gửi {{lanGuiYcbg}} không đạt — gửi lại yêu cầu báo giá.** Hạng mục giữ nguyên; yêu cầu lần trước không đổi nội dung. |
| 3 | lyDoKhongDat | Lý do | textarea | Có | 2000 | — | — | =lanGuiYcbg = null | — | Chỉ hiện khi eForm mở từ luật MS01_T10_TRA_LAI (gửi lại, BR-DXMS-04-12); là biến bắt buộc của luật đó. HX-01 ghi vào yêu cầu hiện hành |
| 4 | — | — | text | — | — | — | — | — | — | \### Hạng mục yêu cầu báo giá |
| 5 | — | Yêu cầu nhóm 1 | table | — | — | stt=STT; hang=Hàng hóa / dịch vụ; sl=SL mua; nganh=Ngành hàng | — | =count(ycbgNhom1) = 0 | ycbgNhom1 | Hạng mục Nhóm 1 có Còn phải mua lớn hơn 0 của bản rà soát hiện hành (BR-DXMS-04-02); biến do hệ thống ghi khi bản rà soát tồn kho được xác nhận (DTMS_CN_0143). Số lượng không sửa. Nhóm không có hạng mục thì không hiện |
| 6 | — | Yêu cầu nhóm 2 | table | — | — | stt=STT; hang=Hàng hóa / dịch vụ; sl=SL mua; nganh=Ngành hàng | — | =count(ycbgNhom2) = 0 | ycbgNhom2 | Như Yêu cầu nhóm 1, cho Nhóm 2 |
| 7 | — | — | text | — | — | — | — | — | — | \### Tài liệu kỹ thuật |
| 8 | taiLieuKyThuatNhom1 | Tài liệu kỹ thuật nhóm 1 (chỉ tiêu kỹ thuật) | filepicker | Có | — | — | — | =count(ycbgNhom1) = 0 | — | Nhiều tệp, theo quy tắc tải tệp của hệ thống (mục 4.1). Bắt buộc khi Nhóm 1 có hạng mục (BR-DXMS-04-02): "Vui lòng tải lên tài liệu kỹ thuật của Nhóm 1." Đưa vào Tài liệu đính kèm của hồ sơ. Gửi lại: giá trị khởi tạo … |
| 9 | taiLieuKyThuatNhom2 | Tài liệu kỹ thuật nhóm 2 (bảng bóc tách khối lượng, danh mục vật tư, linh kiện) | filepicker | Có | — | — | — | =count(ycbgNhom2) = 0 | — | Như nhóm 1, cho Nhóm 2: "Vui lòng tải lên tài liệu kỹ thuật của Nhóm 2." |
| 10 | — | — | text | — | — | — | — | — | — | \### Nhà cung cấp nhận yêu cầu |
| 11 | nccSel | Nhà cung cấp nhận YCBG | nhacungcap | — | — | hangMuc=ycbgNhom1, ycbgNhom2; nccMoi=nccMoi; nhapTuTep=true | — | — | ycbgNhom1, ycbgNhom2 | Kiểu trường tùy biến nhacungcap (mục 2.4.1). Checklist hiện "{Mã} — {Tên}" theo BR-DXMS-04-03: danh mục Nhà cung cấp đang Hoạt động, có ngành hàng trùng ngành hàng của hạng mục; đang bị cấm thì không có ô chọn; hạn … |
| 12 | nccMoi | Nhà cung cấp mới | dynamiclist+ | — | — | — | — | — | — | Thêm dòng, icon Xóa. BR-DXMS-04-04: khi Xác nhận, HX-14 thêm vào danh mục. Mã số thuế được trường nccSel (nhacungcap) tra danh mục khi nhập: trùng nhà cung cấp dùng được thì hiện tại dòng "Đã có nhà cung cấp {Mã} — … |
| 13 | nccMoi\[\].ten | Tên | textfield | Có | 255 | — | — | — | — | — |
| 14 | nccMoi\[\].mst | Mã số thuế | textfield | Có | 20 | — | — | — | — | — |
| 15 | nccMoi\[\].email | Email nhận YCBG | textfield | Có | 255 | — | — | — | — | Đúng định dạng email: "Email không hợp lệ." |
| 16 | nccMoi\[\].nganh | Ngành hàng | select | Có | — | @dmNganhHang | — | — | — | Danh mục Ngành hàng: "Vui lòng chọn Ngành hàng." |
| 17 | — | Đã chọn {n} nhà cung cấp | text | — | — | — | — | — | nccSel, nccMoi | Đã chọn **{{count(nccSel) + count(nccMoi)}}** nhà cung cấp |
| 18 | — | — | text | — | — | — | — | — | — | \### Hạn và điều khoản trên phiếu |
| 19 | hanTraLoi | Hạn trả lời | datetime | Có | — | — | =hanTraLoiMacDinh | — | hanTraLoiMacDinh | DD/MM/YYYY. BR-DXMS-04-05: giá trị khởi tạo là biến hanTraLoiMacDinh (có Nhóm 2: ngày gửi cộng 7 ngày; chỉ Nhóm 1: cộng 5 ngày; tính cả thứ Bảy, Chủ nhật, không tính ngày lễ, Tết theo lịch nghỉ). Không nhỏ hơn ngày … |
| 20 | dkThanhToan | Điều kiện thanh toán | textarea | — | 4000 | — | — | =lanGuiYcbg != null | — | Ghi trên phiếu và email gửi nhà cung cấp (BR-DXMS-04-06). Gửi lại: giữ giá trị lần trước |
| 21 | diaDiemGiao | Địa điểm giao hàng | textfield | — | 500 | — | — | =lanGuiYcbg != null | — | Như Điều kiện thanh toán |
| 22 | yeuCauKhac | Các yêu cầu khác | textarea | — | 2000 | — | — | =lanGuiYcbg != null | — | Như Điều kiện thanh toán; ví dụ yêu cầu bảo hành, lắp đặt, giao theo lô |
| 23 | dauMoiBg | Đầu mối tiếp nhận báo giá | select | — | — | @dauMoiBgOptions | — | =lanGuiYcbg != null | — | Một lựa chọn trong người thuộc danh sách xử lý của hồ sơ; giá trị khởi tạo là người xử lý bước. Phiếu ghi Họ tên, Số điện thoại, Email theo hồ sơ người dùng |
| 24 | — | — | text | — | — | — | — | =lanGuiYcbg != null | — | \### Đối soát ĐXMS |
| 25 | — | Đối soát ĐXMS | table | — | — | hangMuc=Hạng mục; deXuat=ĐXMS đề xuất; theoNguon=Theo nguồn; ketQua=Kết quả; ghiChu=Ghi chú | — | =lanGuiYcbg != null | doiSoatDxms | Theo nguồn là phần còn lại của dòng căn cứ. Kết quả: Khớp khi SL đề xuất không lớn hơn Còn lại, Không khớp khi lớn hơn, Không có trong nguồn khi Ngoài căn cứ. Biến do hệ thống ghi khi bản rà soát tồn kho được xác nhận … |
| 26 | — | Dòng giá trị của đối soát | text | — | — | — | — | =lanGuiYcbg != null or doiSoatGiaTri = null | doiSoatGiaTri | Giá trị dự kiến của ĐXMS **{{doiSoatGiaTri.giaTriDuKien}}** tỷ đồng · Tổng Còn có thể sử dụng của các văn bản **{{doiSoatGiaTri.conLai}}** tỷ đồng · {{doiSoatGiaTri.ketQua}} |

### 7.4.40 dtms-ms02-t10-bao-gia

Quy trình MS02, bước 10.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Lần gửi YCBG | text | — | — | — | — | — | lanGuiYcbg, maYcbg | Lần gửi YCBG: **{{lanGuiYcbg}}** · Mã yêu cầu: {{maYcbg}} |
| 3 | — | — | text | — | — | — | — | — | — | \### Tệp báo giá |
| 4 | tepBaoGia | Tệp báo giá | tepbaogia | — | — | baoGia=baoGia | — | — | lanGuiYcbg | Kiểu trường tùy biến tepbaogia (DTMS_CN_0147): một dòng cho mỗi nhà cung cấp của lần gửi hiện tại, Tải lên, Tải xuống, Thay tệp, Xóa chạy ngay; tải lên xong AI đọc tệp, ghi gợi ý vào dòng của nhà cung cấp trong baoGia … |
| 5 | — | — | text | — | — | — | — | — | — | \### Báo giá của từng nhà cung cấp |
| 6 | baoGia | Báo giá | dynamiclist | — | — | — | — | — | baoGia | Một dòng cho mỗi nhà cung cấp nhận yêu cầu của lần gửi hiện tại; không thêm, xóa dòng. Giá trị khởi tạo: tác vụ bước 9 ghi nhà cung cấp, Tình trạng gửi, dòng đơn giá theo hạng mục; trường Tệp báo giá ghi giá trị AI … |
| 7 | baoGia\[\]. | — | text | — | — | — | — | — | — | **{{this.ma}} — {{this.ten}}** · Tình trạng gửi: {{this.tinhTrangGui}} · Tệp: {{if this.tenTep = null then "chưa tải lên" else this.tenTep}} |
| 8 | baoGia\[\].khongPhanHoi | Không phản hồi | checkbox | — | — | — | — | — | — | Chọn thì bỏ qua các trường dưới, không cần tệp (BR-DXMS-04-11) |
| 9 | baoGia\[\].ngayBaoGia | Ngày báo giá | datetime | Có | — | — | — | =this.khongPhanHoi = true | — | DD/MM/YYYY. Giá trị khởi tạo theo AI đọc; không lớn hơn ngày hiện tại |
| 10 | baoGia\[\].hieuLucDen | Hiệu lực đến | datetime | Có | — | — | — | =this.khongPhanHoi = true | — | DD/MM/YYYY. Không nhỏ hơn Ngày báo giá: "Hiệu lực đến không được nhỏ hơn Ngày báo giá." Nhỏ hơn ngày Xác nhận thì dòng ghi "(hết hiệu lực)", không dùng để tính (BR-DXMS-04-09) |
| 11 | baoGia\[\].loaiTien | Loại tiền | select | Có | — | @dmTienTe | — | =this.khongPhanHoi = true | — | Danh mục Tiền tệ; giá trị khởi tạo theo nhà cung cấp |
| 12 | baoGia\[\].tyGia | Tỷ giá | number | Có | — | — | — | =this.khongPhanHoi = true or this.loaiTien = "VND" | — | Lớn hơn 0; quy đổi về đồng Việt Nam. Bắt buộc khi Loại tiền không phải VNĐ; VNĐ có Tỷ giá bằng 1 |
| 13 | baoGia\[\].donGia | Đơn giá báo theo hạng mục | dynamiclist | — | — | — | — | =this.khongPhanHoi = true | — | Một dòng cho mỗi hạng mục của yêu cầu; không thêm, xóa dòng |
| 14 | baoGia\[\].donGia\[\]. | — | text | — | — | — | — | — | — | {{this.hangMuc}} · SL mua {{this.slMua}}{{if this.goiYAi = true then " · Gợi ý AI" else ""}} |
| 15 | baoGia\[\].donGia\[\].giaBao | Đơn giá báo | number | — | — | — | — | — | — | Theo Loại tiền, gồm VAT, không âm. Bắt buộc với hạng mục nhà cung cấp báo; bỏ trống là không báo hạng mục đó. Giá AI gợi ý có dấu hiệu Gợi ý AI; người dùng sửa thì mất dấu hiệu. Đơn giá quy đổi (tỷ đồng) hiện ở bảng … |
| 16 | — | — | text | — | — | — | — | — | — | \### So sánh và cơ sở giá |
| 17 | coSoGia | So sánh báo giá và cơ sở giá | sosanhbaogia | Có | — | baoGia=baoGia; hangMuc=ycbgNhom1, ycbgNhom2; tong=tongGiaTriCoSo | — | — | baoGia, ycbgNhom1, ycbgNhom2 | Kiểu trường tùy biến sosanhbaogia. Mỗi hạng mục một dòng: Hạng mục, ĐVT, Số lượng, Đơn giá quy đổi (tỷ đồng) của từng nhà cung cấp = Đơn giá báo × Tỷ giá ÷ 1.000.000.000, giá thấp nhất trong các báo giá còn hiệu lực … |
| 18 | — | Tổng giá trị so với ngưỡng | text | — | — | — | — | — | tongGiaTriCoSo, hoSo.nguong | Tổng giá trị **{{tongGiaTriCoSo}}** tỷ — {{if tongGiaTriCoSo \< hoSo.nguong then "Dưới ngưỡng" else "Từ ngưỡng trở lên"}} {{hoSo.nguong}} tỷ |
| 19 | — | Kết quả AI kiểm tra báo giá | ai | — | — | — | — | — | aiKiemTraBaoGia | Kết quả: **{{if aiKiemTraBaoGia = null then "Chưa có kết quả" else aiKiemTraBaoGia.ketQua}}** {{aiKiemTraBaoGia.chiTiet}} *Nguồn: {{aiKiemTraBaoGia.nguon}}* |
| 20 | — | Kết luận AI Không đạt | html | — | — | — | — | =aiKiemTraBaoGia = null or aiKiemTraBaoGia.ketQua != "Không đạt" | aiKiemTraBaoGia.lyDo | AI kiểm tra báo giá: Không đạt — {{aiKiemTraBaoGia.lyDo}}. Vui lòng kiểm tra lại dữ liệu. |
| 21 | vanDat | Vẫn đạt | checkbox | — | — | — | — | =not(aiKiemTraBaoGia.soLanKhongDat \>= 2) | aiKiemTraBaoGia.soLanKhongDat | Hiện từ lần AI kết luận Không đạt thứ hai liên tiếp (BR-DXMS-04-12). Chọn thì đạt dù AI kết luận Không đạt; KT-17 vẫn áp; Chỉ huy đơn vị thấy lý do ở bước 13 |
| 22 | lyDoVanDat | Lý do vẫn đạt | textarea | Có | 2000 | — | — | =vanDat != true | — | — |
| 23 | — | Khối điều chỉnh | adjimpact | — | — | hien=donGia+tacDong; coSo=coSoGia | — | — | — | Kiểu trường adjimpact: bảng So với cơ sở giá của hồ sơ căn cứ (Hạng mục, Đơn giá trước, Đơn giá mới, Chênh lệch); khối Tác động tính theo cơ sở giá đang chốt trong form |
| 24 | — | Ngày báo giá | text | — | — | — | — | — | hoSo.ngayTao | Báo giá được tính phải có Ngày báo giá từ **{{hoSo.ngayTao}}** (ngày tạo hồ sơ) trở về sau. |
| 25 | daXemTacDongBaoGia | Đã xem tác động điều chỉnh | checkbox | — | — | — | — | — | — | Bắt buộc khi bấm Báo giá đạt mà có Chuyển ngưỡng hoặc Giảm dưới số đã ký; máy chủ kiểm tra bằng KT-19 (BR-DXMS-09-07) |

### 7.4.41 dtms-ms02-t11-12-du-thao

Quy trình MS02, bước 11, 12. Văn bản của bước: BM-01, BM-02, BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Lý do trả lại của Chỉ huy đơn vị | html | — | — | — | — | =traLai13 = null | traLai13.lyDo, traLai13.loc | — | Chỉ huy đơn vị trả lại: “{{traLai13.lyDo}}”. AI lọc nội dung chưa đạt: {{traLai13.loc}} |
| 3 | — | Kết luận của Người có thẩm quyền | html | — | — | — | — | =ketLuan = null | ketLuan | — | Hồ sơ xử lý lại theo kết luận của Người có thẩm quyền: “{{ketLuan}}” |
| 4 | phanHoiChiHuy | Phản hồi chỉ đạo | dynamiclist | — | — | — | — | =traLai13 = null | phanHoiChiHuy | — | Bắt buộc khi hồ sơ về từ bước 14. Mỗi phần Không đạt một dòng; giá trị khởi tạo từ biến phanHoiChiHuy do tác vụ AI bước 14 ghi (Phần, Chỉ đạo, Hướng dẫn AI chỉ xem) |
| 5 | phanHoiChiHuy\[\]. | — | text | — | — | — | — | — | — | — | **{{this.phan}}** — Chỉ đạo: {{this.chiDao}} *Hướng dẫn AI:* {{this.huongDanAi}} |
| 6 | phanHoiChiHuy\[\].xuLy | Xử lý | radio | Có | — | Đã sửa; Không sửa | — | — | — | — | — |
| 7 | phanHoiChiHuy\[\].giaiTrinh | Giải trình | textarea | Có | 2000 | — | — | =this.xuLy != "Không sửa" | — | — | Bắt buộc khi Không sửa |
| 8 | — | Kết quả AI kiểm tra | html | — | — | — | — | =aiCheck = null or aiCheck.ketQua != "Không đạt" | aiCheck.lyDo | — | AI kiểm tra hồ sơ: Không đạt — {{aiCheck.lyDo}}. Hồ sơ chưa được gửi. |
| 9 | vanGui | Vẫn gửi | checkbox | — | — | — | — | =not(aiCheck.soLanKhongDat \>= 2) | aiCheck.soLanKhongDat | — | Hiện từ lần AI kết luận Không đạt thứ hai liên tiếp (BR-DXMS-08-06). Chọn thì gửi dù AI kết luận Không đạt; Chỉ huy đơn vị thấy lý do ở bước 13 |
| 10 | lyDoVanGui | Lý do vẫn gửi | textarea | Có | 2000 | — | — | =vanGui != true | — | — | — |
| 11 | — | Kính gửi | text | — | — | — | — | — | hoSo.nguoiCoThamQuyen | — | **Kính gửi:** {{hoSo.nguoiCoThamQuyen}} |
| 12 | — | Căn cứ | text | — | — | — | — | — | hoSo.canCu | — | **Căn cứ:** {{hoSo.canCu}} |
| 13 | mucDich | 1\. Mục đích | textarea | Có | 2000 | — | =purpose | — | — | — | Giá trị khởi tạo: Mục đích của hồ sơ (biến purpose, bước 4). Sửa ở đây chỉ đổi Tờ trình, không đổi Mục đích của hồ sơ |
| 14 | aiSuCanThiet | Gợi ý AI — Sự cần thiết phải mua sắm | aisuggest | — | — | Sự cần thiết=suCanThiet | — | — | aiSuCanThiet | — | Một dòng; gợi ý theo hiện trạng, tồn kho, căn cứ, Loại mua sắm, kèm nguồn. Mặc định chưa chọn quyết định. Quyết định điền vào trường Sự cần thiết bên dưới |
| 15 | aiSuCanThiet\[\]. | — | text | — | — | — | — | — | — | — | **{{this.muc}}** |
| 16 | aiSuCanThiet\[\]. | — | text | — | — | — | — | — | — | — | {{this.goiY}} *Nguồn:* {{this.nguon}} |
| 17 | aiSuCanThiet\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | — | — | — | — | Mặc định chưa chọn |
| 18 | aiSuCanThiet\[\].noiDungSua | Nội dung sửa | textarea | Có | 4000 | — | — | =this.quyetDinh != "Sửa" | — | — | — |
| 19 | — | — | text | — | — | — | — | =count(aiSuCanThiet) \> 0 | — | — | Chưa có kết quả gợi ý AI. |
| 20 | suCanThiet | 2.1 Sự cần thiết phải mua sắm | textarea | Có | 4000 | — | — | — | — | — | — |
| 21 | — | 2.2 Danh mục hàng hóa, dịch vụ | table | — | — | n=TT; hang=Tên hàng hóa, dịch vụ; dvt=Đơn vị tính; slMua=SL mua sau tồn kho | — | — | danhMucHang | — | Chỉ xem. Hạng mục đã xác nhận của hồ sơ |
| 22 | — | 2.3 Giá trị | text | — | — | — | — | — | hoSo.tong, hoSo.tongBangChu, coCauChiPhi | — | **2.3 Giá trị:** {{hoSo.tong}} đồng, đã gồm VAT, theo cơ sở giá (bằng chữ: {{hoSo.tongBangChu}}). Cơ cấu theo Loại chi phí: {{coCauChiPhi}} |
| 23 | phuongPhap | Phương pháp tính toán | textarea | — | 4000 | — | — | — | — | — | — |
| 24 | phuongPhapSoLuong | Phương pháp tính số lượng | textarea | — | 4000 | — | — | — | — | — | — |
| 25 | quanDiem | Quan điểm thực hiện | textarea | — | 4000 | — | — | — | — | — | — |
| 26 | phuongAn | Phương án kỹ thuật – công nghệ | textarea | — | 4000 | — | — | — | — | — | — |
| 27 | coSoDonGia | Cơ sở xác định đơn giá | textarea | — | 4000 | — | — | — | — | — | — |
| 28 | — | Sử dụng hàng tồn kho | text | — | — | — | — | — | cauTonKho | — | **Sử dụng hàng tồn kho:** {{cauTonKho}} |
| 29 | — | 2.4 Nguồn vốn, Thời gian thực hiện | text | — | — | — | — | — | hoSo.nguonVon, period | — | **a) Nguồn vốn:** {{hoSo.nguonVon}} · **b) Thời gian thực hiện:** {{period}} |
| 30 | nguonNganSach | Nguồn ngân sách | textfield | — | 500 | — | — | — | — | — | — |
| 31 | hieuQua | 2.5 Đánh giá hiệu quả | textarea | — | 4000 | — | — | — | — | — | — |
| 32 | bienPhap | 2.6 Biện pháp thực hiện | textarea | Có | 4000 | — | — | — | — | — | — |
| 33 | keHoach | Kế hoạch tổ chức thực hiện | textarea | Có | 4000 | — | — | — | — | — | — |
| 34 | — | Phụ lục chi phí | table | — | — | n=STT; hang=Hàng hóa; sl=SL mua; donGia=Đơn giá; thanhTien=Thành tiền; coSo=Cơ sở giá; loaiChiPhi=Loại chi phí | — | — | phuLucChiPhi | — | Chỉ xem. Từ kết quả đánh giá báo giá, cơ sở giá (DTMS_CN_0148) |
| 35 | — | Checklist 01 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.01+MS01.02 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 36 | — | Checklist 02 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.03 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 37 | — | — | text | — | — | — | — | — | — | — | *Sau khi gửi, Tờ trình, Phụ lục chi phí và Checklist của phiên bản hiện tại xem ở **Văn bản đầu ra**.* |

### 7.4.42 dtms-ms02-t13-chi-huy-duyet

Quy trình MS02, bước 13. Văn bản của bước: BM-01, BM-02, BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Kết quả AI kiểm tra | text | — | — | — | — | =aiCheck = null | aiCheck.ketQua, aiCheck.lyDo | — | **AI kiểm tra hồ sơ (chỉ tham khảo):** {{aiCheck.ketQua}} — {{aiCheck.lyDo}} |
| 3 | — | Lý do vẫn gửi | html | — | — | — | — | =vanGui != true | lyDoVanGui | — | Đơn vị vẫn gửi dù AI kết luận Không đạt. Lý do: “{{lyDoVanGui}}” |
| 4 | — | Tóm tắt dự thảo | text | — | — | — | — | — | hoSo.ten, hoSo.tong, hoSo.nguonVon, period, hoSo.soHangMuc | — | \### Tóm tắt dự thảo **{{hoSo.ten}}** · Tổng giá trị {{hoSo.tong}} · Nguồn vốn {{hoSo.nguonVon}} · Thời gian {{period}} · {{hoSo.soHangMuc}} hạng mục |
| 5 | — | Giải trình của đơn vị | text | — | — | — | — | =vongGiaiTrinh = null | vongGiaiTrinh | — | \### Giải trình của đơn vị (vòng {{vongGiaiTrinh}}) BM-02 và Phụ lục 1 mới nhất xem ở **Văn bản đầu ra**. |
| 6 | — | Bảng giải trình | table | — | — | yKien=Ý kiến; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình | — | =vongGiaiTrinh = null | giaiTrinh | — | Chỉ xem. Hiện khi hồ sơ về từ bước 29; dòng do bước 28 ghi |
| 7 | — | Phản hồi của đơn vị theo chỉ đạo lần trước | table | — | — | phan=Phần; chiDao=Chỉ đạo; xuLy=Xử lý; giaiTrinh=Giải trình | — | =count(phanHoiChiHuy) = 0 | phanHoiChiHuy | — | Chỉ xem. Phản hồi của đơn vị ở bước 11, 12 cho lần Không đồng ý trước |
| 8 | — | Lịch sử chỉnh sửa theo phần | table | — | — | phienBan=Phiên bản; phan=Phần; noiDung=Nội dung cập nhật; nguoi=Người sửa; thoiDiem=Thời điểm | — | =count(lichSuSua) = 0 | lichSuSua | — | Chỉ xem, từ nhật ký; ẩn khi chưa có |
| 9 | — | Cơ cấu chi phí | text | — | — | — | — | — | coCauChiPhi | — | **Cơ cấu chi phí theo Loại chi phí:** {{coCauChiPhi}} |
| 10 | — | Phụ lục chi phí | table | — | — | n=STT; hang=Hàng hóa; sl=SL mua; donGia=Đơn giá; thanhTien=Thành tiền; coSo=Cơ sở giá; loaiChiPhi=Loại chi phí | — | — | phuLucChiPhi | — | Chỉ xem, như bước 11, 12 |
| 11 | — | Checklist 01 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.01+MS01.02 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 12 | — | Checklist 02 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.03 | Chỉ xem. Dòng theo biểu mẫu Checklist của luồng con; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 13 | duyetPhan | Duyệt từng phần | dynamiclist | — | — | — | 1\. Mục đích; 2.1 Sự cần thiết phải mua sắm; 2.2 Danh mục hàng hóa, dịch vụ; 2.3 Giá trị; 2.4 Nguồn vốn, Thời gian thực hiện; 2.5 Đánh giá hiệu quả; 2.6 Biện pháp, Kế hoạch tổ chức thực hiện; Phụ lục chi phí; Checklist | — | — | — | Mỗi phần một dòng: các mục của Tờ trình, Phụ lục chi phí, Checklist. Danh sách phần là giá trị khởi tạo của eForm (cột Mặc định), mỗi phần mặc định Đạt |
| 14 | duyetPhan\[\]. | — | text | — | — | — | — | — | — | — | **{{this.phan}}** |
| 15 | duyetPhan\[\].ketQua | Kết quả | radio | Có | — | Đạt; Không đạt | Đạt | — | — | — | — |
| 16 | duyetPhan\[\].lyDo | Lý do, chỉ đạo | textarea | Có | 2000 | — | — | =this.ketQua != "Không đạt" | — | — | Bắt buộc khi Không đạt; là lý do trả lại của phần |

### 7.4.43 dtms-ms02-t16-chon-cqcm

Quy trình MS02, bước 16. Văn bản của bước: BM-03.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Lý do trả lại của TTMS | html | — | — | — | — | =traLai17 = null | traLai17.lyDo | TTMS trả lại danh sách CQCM: “{{traLai17.lyDo}}”. Cập nhật danh sách rồi gửi lại TTMS xác nhận. |
| 3 | — | Lý do từ chối ký BM-03 | html | — | — | — | — | =tuChoiKyBm03 = null | tuChoiKyBm03.lyDo | BM-03 bị từ chối ký: “{{tuChoiKyBm03.lyDo}}”. Cập nhật rồi gửi lại TTMS xác nhận. |
| 4 | — | Lịch sử trả lại | table | — | — | thoiDiem=Thời điểm; nguoi=Người trả lại; lyDo=Lý do | — | =count(lichSuTraLaiCqcm) = 0 | lichSuTraLaiCqcm | Chỉ xem. Mỗi lần TTMS trả lại một dòng, không ghi đè (BR-DXMS-07-02) |
| 5 | — | Lần thẩm định | text | — | — | — | — | — | lanThamDinh | **Lần thẩm định:** Lần {{lanThamDinh}} |
| 6 | cqcmList | Chọn CQCM | dynamiclist | — | — | — | — | — | cqcmList | Mỗi CQCM đang hoạt động một dòng (mã agencyId, tên, chức năng, cờ batBuoc, người xử lý nguoiXuLy theo danh mục CQCM). Giá trị khởi tạo từ biến cqcmList do bước 15 ghi: CQCM về đầu tư – xây dựng và CQCM về tài chính kế … |
| 7 | cqcmList\[\]. | — | text | — | — | — | — | — | — | **{{this.ten}}** — {{this.chucNang}} |
| 8 | cqcmList\[\]. | — | text | — | — | — | — | =not(this.batBuoc) | — | **Bắt buộc** |
| 9 | cqcmList\[\].chon | Chọn | checkbox | — | — | — | — | =this.batBuoc | — | — |
| 10 | dauMoi | Đầu mối tiếp nhận | select | Có | — | @nguoiDungOptions | =hoSo.nguoiPhuTrach | — | — | Người dùng của đơn vị đề xuất, có tìm kiếm. Mặc định Người phụ trách hồ sơ |
| 11 | — | Liên hệ đầu mối | text | — | — | — | — | =dauMoi = null | nguoiDungOptions, dauMoi | Điện thoại: {{nguoiDungOptions\[item.value = dauMoi\]\[1\].dienThoai}} · Email: {{nguoiDungOptions\[item.value = dauMoi\]\[1\].email}} |
| 12 | — | BM-03 | text | — | — | — | — | — | — | Dự thảo BM-03 do hệ thống sinh từ hồ sơ: xem ở **Văn bản đầu ra**. Ký nháy xác nhận nội dung rồi tải lên bên dưới. Bản ký nháy chưa có Hạn góp ý; Hạn góp ý do TTMS chốt ở bước 17, hệ thống điền ở bước 18. |
| 13 | bm03KyNhay | BM-03 đã ký nháy | filepicker | Có | — | — | — | — | — | Một tệp, theo quy tắc tải tệp (mục 4.1). Bỏ trống: "Vui lòng tải lên BM-03 đã ký nháy." |

### 7.4.44 dtms-ms02-t17-xac-nhan-cqcm

Quy trình MS02, bước 17. Văn bản của bước: BM-03.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Danh sách CQCM | table | — | — | ten=CQCM; batBuoc=Bắt buộc; chucNang=Chức năng liên quan; nguoiXuLy=Người xử lý | — | — | cqcmList\[item.chon or item.batBuoc\] | Chỉ xem. CQCM đã chọn ở bước 16; cột Bắt buộc hiện nhãn Bắt buộc với CQCM theo BR-DXMS-C-12 |
| 3 | — | AI đối chiếu thành phần CQCM | ai | — | — | — | — | — | aiCqcm.ketQua, aiCqcm.chiTiet | **AI đối chiếu thành phần CQCM:** {{aiCqcm.ketQua}} {{aiCqcm.chiTiet}} |
| 4 | — | — | text | — | — | — | — | =aiCqcm != null | — | Chưa có kết quả gợi ý AI. |
| 5 | — | BM-03 | text | — | — | — | — | — | nguoiDungOptions, dauMoi, bm03KyNhay | **Phiếu yêu cầu thẩm định (BM-03):** Đầu mối tiếp nhận {{nguoiDungOptions\[item.value = dauMoi\]\[1\].label}} · Tệp ký nháy {{bm03KyNhay}} · Dự thảo ở **Văn bản đầu ra** |
| 6 | hanGopY | Hạn góp ý | datetime | Có | — | — | =hanGopYMacDinh | — | hanGopYMacDinh | Ngày, DD/MM/YYYY. Giá trị khởi tạo: biến hanGopYMacDinh — lần đầu là ngày hiện tại cộng hạn thẩm định theo mục 2.3.3, tính NLV; từ lần 2 là Hạn góp ý của lần đầu. TTMS sửa được khi hồ sơ có yêu cầu đặc thù về tiến độ; … |
| 7 | — | — | html | — | — | — | — | =not(lanThamDinh \> 1 and hanGopY \< today()) | lanThamDinh | Hạn góp ý nhỏ hơn ngày hiện tại: công việc bước 19 sẽ Quá hạn ngay khi gửi. |
| 8 | — | — | text | — | — | — | — | — | — | *Sau khi xác nhận, hệ thống điền Hạn góp ý vào BM-03, trình Chỉ huy đơn vị đề xuất ký BM-03 và gửi yêu cầu thẩm định tới các CQCM trong danh sách.* |

### 7.4.45 dtms-ms02-t19-bm04

Quy trình MS02, bước 19.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Tiêu đề | text | — | — | — | — | — | cqcmTen, lan, phienBan | **{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}} *Phiếu riêng của {{cqcmTen}}, không hiển thị ý kiến của cơ quan khác.* |
| 3 | — | Lý do quay lại — Chỉ huy CQCM | text | — | — | — | — | =traLai20 = null | traLai20.lyDo, traLai20.tomTat | Chỉ huy CQCM không đồng ý: “{{traLai20.lyDo}}” Việc cần sửa theo mục (AI tóm tắt): {{traLai20.tomTat}} |
| 4 | — | AI tóm tắt chưa có kết quả | text | — | — | — | — | =traLai20 = null or traLai20.tomTat != null | — | Chưa có kết quả gợi ý AI. |
| 5 | — | Lý do quay lại — rà soát xung đột | text | — | — | — | — | =xungDotBm04 = null | xungDotBm04.muc, xungDotBm04.goiY | Ý kiến của cơ quan có thể mâu thuẫn với cơ quan khác, đề nghị rà soát lại mục: {{xungDotBm04.muc}} Gợi ý AI: {{xungDotBm04.goiY}} |
| 6 | — | Lý do quay lại — BM-04 bị từ chối ký | text | — | — | — | — | =tuChoiBm04 = null | tuChoiBm04.nguoi, tuChoiBm04.lyDo | BM-04 bị từ chối ký — {{tuChoiBm04.nguoi}}: “{{tuChoiBm04.lyDo}}” |
| 7 | — | Ý kiến lần trước của cơ quan | table | — | — | lan=Lần; muc=Mục; nhanXet=Nội dung nhận xét; quyetDinh=Quyết định; giaiTrinh=Giải trình; ketQua=Kết quả | — | =lan = 1 | yKienLanTruoc | Hiện từ lần thẩm định thứ 2: các dòng ý kiến của chính cơ quan ở các lần trước |
| 8 | — | BM-02 và Phụ lục 1 | text | — | — | — | — | =lan = 1 | phienBan | BM-02 và Phụ lục 1 của đơn vị đề xuất (hồ sơ v{{phienBan}}): xem ở **Văn bản đầu ra**. |
| 9 | bm04Phieu | Phiếu nhận xét theo mục | dynamiclist | — | — | — | — | — | bm04Phieu | Mỗi dòng một mục đánh giá. Dòng khởi tạo từ danh mục Mục đánh giá BM-04; lần sau giữ dữ liệu đã lưu của cơ quan. Không thêm, xóa dòng |
| 10 | bm04Phieu\[\]. | — | text | — | — | — | — | — | — | **{{this.muc}}** |
| 11 | bm04Phieu\[\].danhGia | Đánh giá | radio | Có | — | OK; Không OK | — | — | — | Mặc định chưa chọn. Thông báo khi bỏ trống: "Vui lòng chọn Đánh giá." |
| 12 | bm04Phieu\[\].nhanXet | Nội dung nhận xét | textarea | — | 2000 | — | — | — | — | Bắt buộc khi Đánh giá Không OK (validate của eForm), thông báo "Vui lòng nhập Nội dung nhận xét."; mục OK không bắt buộc |
| 13 | bm04Phieu\[\]. | — | text | — | — | — | — | =this.danhGia != "Không OK" or this.aiGoiY = null | — | Gợi ý AI: *{{this.aiGoiY}}* |
| 14 | bm04Phieu\[\].quyetDinhAi | Gợi ý AI | radio | — | — | Chấp nhận; Sửa; Bỏ | — | =this.danhGia != "Không OK" or this.aiGoiY = null | — | Hiện khi mục Không OK và có gợi ý. Chấp nhận thì điền gợi ý vào Nội dung nhận xét. Gợi ý và quyết định được lưu (BR-DXMS-C-08) |
| 15 | bm04Phieu\[\].huongDan | Hướng dẫn sửa | textarea | — | 2000 | — | — | =this.danhGia != "Không OK" | — | — |
| 16 | yKienChung | Ý kiến chung | textarea | — | 4000 | — | — | — | — | Đưa vào thân BM-04. Hồ sơ không đủ điều kiện thẩm định thì ghi ở đây và đánh giá Không OK ở mục liên quan |
| 17 | dauMoiPhoiHop | Đầu mối phối hợp | select | Có | — | @nguoiDungCqcm | — | — | — | Người dùng của CQCM, có tìm kiếm; mặc định người xử lý công việc |

### 7.4.46 dtms-ms02-t20-ky-bm04

Quy trình MS02, bước 20.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Tiêu đề | text | — | — | — | — | — | cqcmTen, lan, phienBan | **{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}} |
| 3 | — | Phiếu nhận xét do chuyên viên lập | table | — | — | muc=Mục; danhGia=Đánh giá; nhanXet=Nội dung nhận xét; huongDan=Hướng dẫn sửa | — | — | bm04Phieu | Chỉ đọc, dữ liệu bước 19 của cùng CQCM |
| 4 | — | Dự thảo BM-04 | text | — | — | — | — | — | — | Dự thảo BM-04 của phiếu này: xem ở **Văn bản đầu ra**. |

### 7.4.47 dtms-ms02-t26-ket-qua-bm04

Quy trình MS02, bước 26.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Lý do trả lại | html | — | — | — | — | =traLaiKy = null | traLaiKy.buoc, traLaiKy.nguoi, traLaiKy.lyDo | Hồ sơ bị trả lại ở bước {{traLaiKy.buoc}} — {{traLaiKy.nguoi}}: {{traLaiKy.lyDo}} |
| 3 | — | Trạng thái phiếu BM-04 | table | — | — | cqcm=CQCM; nguoi=Người lập / Chỉ huy; lan=Lần; ky=Ký; khongOk=Số Không OK | — | — | bm04TrangThai | Chỉ đọc; các phiếu BM-04 của lần thẩm định hiện tại |
| 4 | — | Kết quả AI kiểm tra xung đột | ai | — | — | — | — | =aiXungDot = null | aiXungDot | **AI kiểm tra xung đột giữa các BM-04:** {{aiXungDot}} |
| 5 | — | Kết quả AI kiểm tra xung đột | text | — | — | — | — | =aiXungDot != null | — | **AI kiểm tra xung đột giữa các BM-04:** Chưa có kết quả gợi ý AI. |
| 6 | — | Gợi ý AI đồng bộ ý kiến | ai | — | — | — | — | =aiDongBo = null | aiDongBo | **AI tóm tắt, gộp ý kiến theo mục, kèm hướng dẫn sửa:** {{aiDongBo}} |
| 7 | — | Gợi ý AI đồng bộ ý kiến | text | — | — | — | — | =aiDongBo != null | — | **AI tóm tắt, gộp ý kiến theo mục:** Chưa có kết quả gợi ý AI. |
| 8 | quyetDinhYKien | Quyết định với từng ý kiến | dynamiclist | — | — | — | — | — | — | Dòng khởi tạo: biến cùng khóa do tác vụ hệ thống bước 25 ghi, gồm mọi dòng ý kiến Đang xử lý (mã dòng, nguồn, mục, nội dung nhận xét); dòng từ lý do trả lại cũng là một dòng. Không thêm, xóa dòng |
| 9 | quyetDinhYKien\[\]. | — | text | — | — | — | — | — | — | **{{this.nguon}}** · {{this.muc}} |
| 10 | quyetDinhYKien\[\]. | — | text | — | — | — | — | — | — | {{this.nhanXet}} |
| 11 | quyetDinhYKien\[\].quyetDinh | Quyết định | radio | Có | — | ACCEPT=Đồng ý sửa; RESERVE=Không đồng ý | — | — | — | Mặc định chưa chọn. Đồng ý sửa lưu Tiếp thu, Không đồng ý lưu Bảo lưu (BR-DXMS-07-05). Sửa được tới khi hoàn thành bước. Dòng thuộc mục Giá trị và cơ sở giá chỉ nhận Không đồng ý: eForm báo tại dòng, máy chủ kiểm tra … |
| 12 | quyetDinhYKien\[\]. | — | text | — | — | — | — | =this.muc != "Giá trị và cơ sở giá" | — | *Chỉ chọn được Không đồng ý: Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới.* |
| 13 | — | Không có ý kiến | text | — | — | — | — | =count(quyetDinhYKien) \> 0 | — | Không có ý kiến cần quyết định. |
| 14 | — | — | text | — | — | — | — | — | — | Có ý kiến Không đồng ý thì hồ sơ sang lập giải trình; đồng ý sửa toàn bộ thì sang hoàn chỉnh hồ sơ. |

### 7.4.48 dtms-ms02-t27-hoan-chinh

Quy trình MS02, bước 27. Văn bản của bước: BM-01, BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Việc cần sửa | table | — | — | nguon=Nguồn; muc=Mục; nhanXet=Nội dung nhận xét; huongDan=Hướng dẫn sửa | — | =count(viecCanSua) = 0 | viecCanSua | — | Dòng ý kiến Tiếp thu, Đang xử lý của hồ sơ; Nguồn là CQCM hoặc người trả lại |
| 3 | — | Không có việc cần sửa | text | — | — | — | — | =count(viecCanSua) \> 0 | — | — | Không có nội dung phải sửa. |
| 4 | — | Kết luận cuộc họp | text | — | — | — | — | =ketLuanHop = null | ketLuanHop | — | **Kết luận cuộc họp:** {{ketLuanHop}} |
| 5 | — | Kết luận của Người có thẩm quyền | text | — | — | — | — | =ketLuan = null | ketLuan | — | **Kết luận của Người có thẩm quyền:** {{ketLuan}} |
| 6 | — | Chưa đạt ở bước 35 | table | — | — | cqcm=CQCM; muc=Mục; lyDo=Lý do | — | =count(chuaDat35) = 0 | chuaDat35 | — | Hiện khi hồ sơ về từ bước 35: lý do Chưa đạt của từng CQCM trên phiên bản hiện tại |
| 7 | — | So sánh phiên bản | text | — | — | — | — | — | linkSoSanh | — | [So sánh phiên bản]({{linkSoSanh}}): phiên bản hiện tại với phiên bản CQCM đã nhận xét. |
| 8 | — | Tờ trình | text | — | — | — | — | — | — | MS01.01+MS01.02 | \### Tờ trình BM-01 |
| 9 | — | Tờ trình | text | — | — | — | — | — | — | MS01.03 | \### Tờ trình BM-09 |
| 10 | — | Kính gửi | text | — | — | — | — | — | hoSo.nguoiCoThamQuyen | — | **Kính gửi:** {{hoSo.nguoiCoThamQuyen}} |
| 11 | — | Căn cứ | text | — | — | — | — | — | hoSo.canCu | — | **Căn cứ:** {{hoSo.canCu}} |
| 12 | mucDich | 1\. Mục đích | textarea | Có | 2000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 13 | suCanThiet | 2.1 Sự cần thiết phải mua sắm | textarea | Có | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12; ở bước 27 không có bảng gợi ý AI |
| 14 | — | 2.2 Danh mục hàng hóa, dịch vụ | table | — | — | n=TT; hang=Tên hàng hóa, dịch vụ; dvt=Đơn vị tính; slMua=SL mua sau tồn kho | — | — | danhMucHang | — | Hạng mục đã xác nhận của hồ sơ, SL mua sau tồn kho; chỉ đọc |
| 15 | — | 2.3 Giá trị | text | — | — | — | — | — | hoSo.tong, hoSo.tongBangChu, coCauChiPhi | — | **2.3 Giá trị:** {{hoSo.tong}} đồng, đã gồm VAT, theo cơ sở giá (bằng chữ: {{hoSo.tongBangChu}}). Cơ cấu theo Loại chi phí: {{coCauChiPhi}} |
| 16 | phuongPhap | Phương pháp tính toán | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 17 | phuongPhapSoLuong | Phương pháp tính số lượng | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 18 | quanDiem | Quan điểm thực hiện | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 19 | phuongAn | Phương án kỹ thuật – công nghệ | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 20 | coSoDonGia | Cơ sở xác định đơn giá | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 21 | — | Sử dụng hàng tồn kho | text | — | — | — | — | — | cauTonKho | — | **Sử dụng hàng tồn kho:** {{cauTonKho}} |
| 22 | — | 2.4 Nguồn vốn, Thời gian thực hiện | text | — | — | — | — | — | hoSo.nguonVon, period | — | **a) Nguồn vốn:** {{hoSo.nguonVon}} · **b) Thời gian thực hiện:** {{period}} |
| 23 | nguonNganSach | Nguồn ngân sách | textfield | — | 500 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12; không bắt buộc |
| 24 | hieuQua | 2.5 Đánh giá hiệu quả | textarea | — | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 25 | bienPhap | 2.6 Biện pháp thực hiện | textarea | Có | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 26 | keHoach | Kế hoạch tổ chức thực hiện | textarea | Có | 4000 | — | — | — | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12 |
| 27 | — | Phụ lục chi phí | table | — | — | n=STT; hang=Hàng hóa; sl=SL mua; donGia=Đơn giá; thanhTien=Thành tiền; coSo=Cơ sở giá; loaiChiPhi=Loại chi phí | — | — | phuLucChiPhi | — | Chỉ đọc, như bước 11, 12 |
| 28 | — | Checklist 01 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.01+MS01.02 | Chỉ đọc; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 29 | — | Checklist 02 | table | — | — | tt=TT; muc=Danh mục hồ sơ; soVb=Số văn bản; ngayVb=Ngày văn bản; nguoiKy=Người ký; tinhTrang=Tình trạng; yeuCau=Yêu cầu; ghiChu=Ghi chú | — | — | checklist | MS01.03 | Chỉ đọc; Tình trạng tính theo tài liệu đã có trên hồ sơ |
| 30 | — | Ghi chú gửi | text | — | — | — | — | — | — | — | Khi gửi, hệ thống tạo phiên bản mới và sinh lại Tờ trình, Phụ lục chi phí, Checklist, BM-02 và Phụ lục 1 ở **Văn bản đầu ra**. |

### 7.4.49 dtms-ms02-t28-giai-trinh

Quy trình MS02, bước 28. Văn bản của bước: BM-02.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | — | text | — | — | — | — | — | vongGiaiTrinh | — | Vòng xử lý **{{vongGiaiTrinh}}** · {{count(giaiTrinh\[quyetDinh = "ACCEPT"\])}} ý kiến tiếp thu, {{count(giaiTrinh\[quyetDinh = "RESERVE"\])}} ý kiến bảo lưu |
| 3 | giaiTrinh | Phụ lục 1 BM-02 — Bảng giải trình ý kiến | dynamiclist | — | — | — | — | — | — | — | Dòng khởi tạo: biến cùng khóa do HX-16 của luật MS01_T26_HOAN_THANH nạp, gồm mọi dòng ý kiến Đang xử lý đã có Quyết định, sắp theo CQCM, bố cục Phụ lục 1 BM-02. Không thêm, xóa dòng |
| 4 | giaiTrinh\[\]. | — | text | — | — | — | — | — | — | — | **{{this.nguon}}** · {{this.muc}} {{this.nhanXet}} |
| 5 | giaiTrinh\[\]. | — | text | — | — | — | — | — | — | — | **{{if this.quyetDinh = "ACCEPT" then "Tiếp thu" else "Bảo lưu"}}** |
| 6 | giaiTrinh\[\].noiDung | Nội dung giải trình | textarea | Có | 2000 | — | — | — | — | — | Mọi dòng, cả Tiếp thu và Bảo lưu |
| 7 | giaiTrinh\[\].thamChieu | Tham chiếu trong văn bản | textfield | — | 255 | — | — | — | — | — | Ví dụ: BM-01 mục 9 |
| 8 | giaiTrinh\[\].ghiChu | Ghi chú | textfield | — | 500 | — | — | — | — | — | — |
| 9 | — | Tờ trình | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Có dòng Tiếp thu: sửa phần tiếp thu của Tờ trình ngay trong bước này; khi gửi, Tờ trình sinh lại từ dữ liệu form. |
| 10 | — | Tờ trình | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | MS01.01+MS01.02 | \### Tờ trình BM-01 |
| 11 | — | Tờ trình | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | MS01.03 | \### Tờ trình BM-09 |
| 12 | — | Kính gửi | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.nguoiCoThamQuyen | — | **Kính gửi:** {{hoSo.nguoiCoThamQuyen}} |
| 13 | — | Căn cứ | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.canCu | — | **Căn cứ:** {{hoSo.canCu}} |
| 14 | mucDich | 1\. Mục đích | textarea | Có | 2000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 15 | suCanThiet | 2.1 Sự cần thiết phải mua sắm | textarea | Có | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 16 | — | 2.2 Danh mục hàng hóa, dịch vụ | table | — | — | n=TT; hang=Tên hàng hóa, dịch vụ; dvt=Đơn vị tính; slMua=SL mua sau tồn kho | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | danhMucHang | — | Hạng mục đã xác nhận của hồ sơ, SL mua sau tồn kho; chỉ đọc |
| 17 | — | 2.3 Giá trị | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.tong, hoSo.tongBangChu, coCauChiPhi | — | **2.3 Giá trị:** {{hoSo.tong}} đồng, đã gồm VAT, theo cơ sở giá (bằng chữ: {{hoSo.tongBangChu}}). Cơ cấu theo Loại chi phí: {{coCauChiPhi}} |
| 18 | phuongPhap | Phương pháp tính toán | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 19 | phuongPhapSoLuong | Phương pháp tính số lượng | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 20 | quanDiem | Quan điểm thực hiện | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 21 | phuongAn | Phương án kỹ thuật – công nghệ | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 22 | coSoDonGia | Cơ sở xác định đơn giá | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 23 | — | Sử dụng hàng tồn kho | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | cauTonKho | — | **Sử dụng hàng tồn kho:** {{cauTonKho}} |
| 24 | — | 2.4 Nguồn vốn, Thời gian thực hiện | text | — | — | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | hoSo.nguonVon, period | — | **a) Nguồn vốn:** {{hoSo.nguonVon}} · **b) Thời gian thực hiện:** {{period}} |
| 25 | nguonNganSach | Nguồn ngân sách | textfield | — | 500 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; không bắt buộc |
| 26 | hieuQua | 2.5 Đánh giá hiệu quả | textarea | — | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27 |
| 27 | bienPhap | 2.6 Biện pháp thực hiện | textarea | Có | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 28 | keHoach | Kế hoạch tổ chức thực hiện | textarea | Có | 4000 | — | — | =count(giaiTrinh\[quyetDinh = "ACCEPT"\]) = 0 | — | — | Giá trị khởi tạo: nội dung phiên bản hiện tại. Cùng khóa với eForm bước 11, 12, 27; bắt buộc khi hiện |
| 29 | — | — | text | — | — | — | — | — | — | — | Khi gửi, hệ thống tăng phiên bản và sinh BM-02, Phụ lục 1, Tờ trình ở **Văn bản đầu ra**. |

### 7.4.50 dtms-ms02-t31-to-chuc-hop

Quy trình MS02, bước 31.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | — | text | — | — | — | — | — | hoSo.ma, vongGiaiTrinh | \### Cảnh báo vượt số vòng xử lý Hồ sơ {{hoSo.ma}} đã qua **{{vongGiaiTrinh}}** vòng xử lý, vượt ngưỡng 2. Đã gửi yêu cầu họp tới đơn vị đề xuất, các CQCM và TTMS. |
| 3 | thoiGianHop | Thời gian | datetime | Có | — | — | — | — | — | DD/MM/YYYY HH:mm. Không so với ngày hiện tại vì có thể ghi lại cuộc họp đã diễn ra |
| 4 | diaDiemHop | Địa điểm | textfield | Có | 255 | — | — | — | — | — |
| 5 | thanhPhanHop | Thành phần | taglist | Có | — | @nguoiDungOptions | — | — | — | Nhiều lựa chọn, có tìm kiếm, ít nhất một người. Giá trị khởi tạo: biến cùng khóa do tác vụ hệ thống bước 30 ghi (ĐV, CH của hồ sơ; người xử lý các CQCM của lần mới nhất; người TTMS xử lý hồ sơ). Máy chủ kiểm tra người … |
| 6 | — | Nội dung còn vướng mắc | table | — | — | nguon=CQCM; nhanXet=Ý kiến nhận xét; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình; thamChieu=Tham chiếu | — | — | nokGiaiTrinh | Dòng Bảo lưu Đang xử lý; chỉ đọc |

### 7.4.51 dtms-ms02-t32-ket-qua-hop

Quy trình MS02, bước 32.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | bienBanHop | Biên bản họp | filepicker | Có | — | — | — | — | — | Một tệp, theo quy tắc tải tệp của hệ thống; đưa vào Danh sách tài liệu. Thông báo khi thiếu: "Vui lòng tải lên Biên bản họp." |
| 3 | ketLuanHop | Kết luận | textarea | Có | 2000 | — | — | — | — | Mặc định rỗng; bắt buộc với cả hai nút của bước |

### 7.4.52 dtms-ms02-t33-trinh-cap-cao

Quy trình MS02, bước 33.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Nội dung chưa thống nhất | table | — | — | nguon=CQCM; nhanXet=Ý kiến nhận xét; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình; thamChieu=Tham chiếu | — | — | nokGiaiTrinh | Dòng Bảo lưu Đang xử lý; chỉ đọc |
| 3 | — | Biên bản họp | text | — | — | — | — | — | bienBanHop | **Biên bản họp:** {{bienBanHop}} |
| 4 | — | Kết luận của cuộc họp | text | — | — | — | — | — | ketLuanHop | **Kết luận của cuộc họp:** {{ketLuanHop}} |

### 7.4.53 dtms-ms02-t34-ket-luan

Quy trình MS02, bước 34.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Nội dung chưa thống nhất | table | — | — | nguon=CQCM; nhanXet=Ý kiến nhận xét; quyetDinh=Tiếp thu / Bảo lưu; noiDung=Nội dung giải trình; thamChieu=Tham chiếu | — | — | nokGiaiTrinh | Dòng Bảo lưu Đang xử lý; chỉ đọc |
| 3 | — | Biên bản họp | text | — | — | — | — | — | bienBanHop | **Biên bản họp:** {{bienBanHop}} |
| 4 | — | Kết luận của cuộc họp | text | — | — | — | — | — | ketLuanHop | **Kết luận của cuộc họp:** {{ketLuanHop}} |
| 5 | ketLuan | Kết luận của Thủ trưởng | textarea | Có | 2000 | — | — | — | — | Mặc định rỗng; áp dụng cho cả hai nút; cũng là biến bắt buộc của hai luật bước 34 |

### 7.4.54 dtms-ms02-t35-kiem-tra-sua

Quy trình MS02, bước 35.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | Tiêu đề, So sánh phiên bản | text | — | — | — | — | — | cqcmTen, phienBan | \### {{cqcmTen}} · Hồ sơ v{{phienBan}} |
| 3 | — | Kết quả kiểm tra lần trước | text | — | — | — | — | =not(ketQuaLanTruoc) | ketQuaLanTruoc | Kết quả kiểm tra lần trước (chỉ tham khảo): {{ketQuaLanTruoc}} |
| 4 | kiemTraYKien | Ý kiến của cơ quan | dynamiclist | — | — | — | — | — | kiemTraYKien | Dòng ý kiến của CQCM này qua mọi lần thẩm định, trừ dòng Không còn áp dụng; giá trị khởi tạo từ biến kiemTraYKien |
| 5 | kiemTraYKien\[\]. | — | text | — | — | — | — | — | — | **Lần {{this.lan}} · {{this.muc}}** |
| 6 | kiemTraYKien\[\]. | — | text | — | — | — | — | — | — | Quyết định của đơn vị: {{this.quyetDinhDv}} · Giải trình: {{this.giaiTrinh}} · Tham chiếu: {{this.thamChieu}} · Kết quả hiện tại: {{this.ketQuaHienTai}} |
| 7 | kiemTraYKien\[\].ketQuaKiemTra | Kết quả kiểm tra | radio | Có | — | Đạt; Chưa đạt | — | — | — | Mặc định chưa chọn |
| 8 | kiemTraYKien\[\].lyDo | Lý do | textarea | Có | 2000 | — | — | =this.ketQuaKiemTra != "Chưa đạt" | — | — |
| 9 | — | — | text | — | — | — | — | =count(kiemTraYKien) \> 0 | — | Không có ý kiến cần kiểm tra. |

### 7.4.55 dtms-ms02-t36-ky-checklist

Quy trình MS02, bước 36.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | ✦ Gợi ý AI — kiểm tra đủ hồ sơ | ai | — | — | — | — | — | aiHoSo | **Kết quả: {{aiHoSo.ketQua}}** |
| 3 | — | Checklist hồ sơ của phiên bản hiện tại | table | — | — | nhom=Nhóm; muc=Danh mục hồ sơ; yeuCau=Yêu cầu; tinhTrang=Tình trạng; tep=Tệp | — | — | checklist | — |
| 4 | — | — | text | — | — | — | — | — | clName, phienBan | Dự thảo BM-04 ký lại (các dòng đã kiểm tra ở bước 35 kèm câu "Đơn vị đã xử lý ý kiến.") và {{clName}} của phiên bản v{{phienBan}}: xem ở **Văn bản đầu ra**. |

### 7.4.56 dtms-ms02-t38-39-ky-bm09

Quy trình MS02, bước 38, 39. Văn bản của bước: BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | KPI toàn trình | text | — | — | — | — | — | kpiToanTrinh | **KPI toàn trình:** {{kpiToanTrinh}} |
| 3 | — | Khối chữ ký BM-09 (kết quả ký từ VOffice) | table | — | — | nguoiKy=Người ký; tuCach=Tư cách; trangThai=Trạng thái; thoiDiem=Thời điểm | — | — | kyBm09 | Một dòng TTMS, một dòng Phó TGĐ/Phó GĐ; lần trình ký mới nhất của mỗi người ký trên BM-09 phiên bản hiện tại. Biến do nền tảng trình ký ghi (YC-NT-03) |
| 4 | — | BM-09 bản trình ký, hồ sơ kèm theo | text | — | — | — | — | — | phienBan | BM-09 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**. Hồ sơ kèm theo: Checklist 02, BM-04 đã ký, BM-02 ở **Danh sách tài liệu**. |

### 7.4.57 dtms-ms02-t42-ra-soat-bm05

Quy trình MS02, bước 42. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | bm05 | BM-05 Báo cáo kết quả thẩm định — dự thảo AI soạn | dynamiclist | — | — | — | — | — | bm05 | Dòng lấy từ biến bm05 do tác vụ AI bước 41 ghi, mỗi dòng một mục của phần I, II, III (Phần, Mục, Gợi ý, Nguồn); dòng phần I lấy từ hồ sơ, không qua AI. Không thêm, xóa dòng |
| 3 | bm05\[\]. | — | text | — | — | — | — | — | — | **{{this.phan}} · {{this.muc}}** |
| 4 | bm05\[\]. | — | text | — | — | — | — | — | — | {{this.goiY}} *Nguồn: {{this.nguon}}* |
| 5 | bm05\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | Chấp nhận | =this.phan = "I" | — | Phần I không có Quyết định |
| 6 | bm05\[\].noiDungSua | Nội dung sửa | textarea | Có | 4000 | — | — | =this.quyetDinh != "Sửa" | — | Bắt buộc khi Sửa |
| 7 | — | — | text | — | — | — | — | =some r in bm05 satisfies (r.phan != "I" and r.goiY != null and r.goiY != "") | bm05 | Chưa có kết quả gợi ý AI. |
| 8 | — | — | text | — | — | — | — | — | — | Bản BM-05 sinh từ mẫu và quyết định ở bảng trên xem ở **Văn bản đầu ra** sau khi hoàn tất rà soát. |

### 7.4.58 dtms-ms02-t43-du-dieu-kien

Quy trình MS02, bước 43. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Điều kiện giao ký BM-05 | table | — | — | dieuKien=Điều kiện; ketQua=Kết quả | — | — | dieuKienKyBm05 | Hai dòng: BM-05 đã được rà soát trên phiên bản hiện tại; mọi CQCM có BM-04 và Checklist Đã ký trên phiên bản hiện tại. Kết quả Đạt / Chưa đạt do HX-09 ghi khi hoàn thành bước 42 (điều kiện của KT-04). Chỉ xem; KT-04 … |
| 3 | — | Gợi ý khi chưa đủ điều kiện | text | — | — | — | — | =every d in dieuKienKyBm05 satisfies d.ketQua = "Đạt" | dieuKienKyBm05 | Hồ sơ chưa đủ điều kiện giao ký BM-05. Chọn Trả lại để đưa hồ sơ về đơn vị. |
| 4 | — | BM-05 Báo cáo kết quả thẩm định | table | — | — | phan=Phần; muc=Mục; goiY=Gợi ý AI; quyetDinh=Quyết định; noiDungSua=Nội dung sửa | — | — | bm05 | BM-05 đã chốt ở bước 42, chỉ đọc |
| 5 | — | — | text | — | — | — | — | — | phienBan | BM-05 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**. |

### 7.4.59 dtms-ms02-t46-47-ky-bm05

Quy trình MS02, bước 46, 47. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Người ký BM-05 (kết quả ký từ VOffice) | table | — | — | nguoiKy=Người ký; tuCach=Đơn vị / tư cách; trangThai=Trạng thái; trinhLuc=Trình ký lúc; kyLuc=Ký lúc; thoiGian=Thời gian xử lý (NLV); kpi=KPI ký; lyDo=Lý do từ chối | — | — | kyBm05 | Mọi người ký BM-05 của phiên bản hiện tại: TTMS, CQCM về tài chính kế toán, CQCM có liên quan, Phó TGĐ/Phó GĐ; Trạng thái Đã ký, Chưa ký, Không đồng ý. Biến do nền tảng trình ký ghi (YC-NT-03) |
| 3 | — | ✦ Gợi ý AI — đánh giá KPI người ký | ai | — | — | — | — | — | aiKpiKy | {{aiKpiKy}} |
| 4 | — | — | text | — | — | — | — | — | phienBan | BM-05 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**. |

### 7.4.60 dtms-ms02-t48-bao-cao-td

Quy trình MS02, bước 48. Văn bản của bước: BM-05.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau |
| 2 | — | BM-05 đã ký đủ | text | — | — | — | — | — | — | \### BM-05 đã ký đủ - TTMS đã ký với tư cách CQCM về đầu tư – xây dựng. - CQCM về tài chính kế toán, CQCM có liên quan và Phó TGĐ/Phó GĐ đã ký. |
| 3 | — | Căn cứ của hồ sơ | table | — | — | vanBan=Văn bản; loai=Loại; tdDuyet=Đã được Chủ tịch hoặc Tổng Giám đốc Tập đoàn phê duyệt | — | — | canCuTd | Chỉ xem. Dòng lấy từ biến canCuTd do tác vụ gợi ý báo cáo Tập đoàn ghi trước bước 48 |
| 4 | — | Gợi ý của hệ thống | text | — | — | — | — | — | reportSuggested, reportSuggestReason | **Gợi ý:** {{#if reportSuggested}}Có{{else}}Không{{/if}} báo cáo Tổng Giám đốc Tập đoàn — {{reportSuggestReason}} |
| 5 | — | Hướng dẫn chọn | text | — | — | — | — | — | — | Hai lựa chọn Có, Không đều dùng được. Chọn khác gợi ý thì nhập Lý do. |
| 6 | reportReason | Lý do | textarea | — | 2000 | — | — | — | — | Bắt buộc khi bấm nút khác gợi ý; máy chủ kiểm tra bằng KT-05 (BR-DXMS-08-08) |

### 7.4.61 dtms-ms02-t50-51-bm06

Quy trình MS02, bước 50, 51. Văn bản của bước: BM-06.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Hướng dẫn rà soát BM-06 | text | — | — | — | — | =phanBm06 != "RA_SOAT" | phanBm06 | Dự thảo **BM-06** do AI soạn theo mục từ BM-05 và hồ sơ. Bản sinh từ bảng dưới xem ở **Văn bản đầu ra**. |
| 3 | bm06 | Bảng mục BM-06 | dynamiclist | — | — | — | — | =phanBm06 != "RA_SOAT" | bm06 | Dòng lấy từ biến bm06 do tác vụ AI bước 49 ghi: muc, goiY, nguon, tuHoSo. Mục lấy từ hồ sơ (phần I mục 1, 4, 5, 6) không có Quyết định |
| 4 | bm06\[\]. | — | text | — | — | — | — | — | — | **{{this.muc}}** |
| 5 | bm06\[\]. | — | text | — | — | — | — | — | — | {{this.goiY}} *Nguồn: {{this.nguon}}* |
| 6 | bm06\[\].quyetDinh | Quyết định | radio | Có | — | Chấp nhận; Sửa; Bỏ | Chấp nhận | =this.tuHoSo | — | — |
| 7 | bm06\[\].noiDungSua | Nội dung sửa | textarea | Có | 4000 | — | — | =this.quyetDinh != "Sửa" | — | — |
| 8 | bm06\[\].noiDungChot | — | expression | — | — | — | =if this.tuHoSo or this.quyetDinh = "Chấp nhận" then this.goiY else if this.quyetDinh = "Sửa" then this.noiDungSua else "" | — | — | Nội dung của mục đưa vào mẫu BM-06 (trường trộn) |
| 9 | — | — | text | — | — | — | — | =phanBm06 != "RA_SOAT" or count(bm06) \> 0 | bm06 | Chưa có kết quả gợi ý AI. |
| 10 | dauMoiBm06 | Đầu mối phối hợp | select | Có | — | @nguoiDungTtms | — | =phanBm06 != "RA_SOAT" | — | Người dùng TTMS, có tìm kiếm. Trường trộn của BM-06; người nhận thông báo kèm BM-07 ở bước 55 |
| 11 | — | Hướng dẫn xác nhận | text | — | — | — | — | =phanBm06 != "XAC_NHAN" | phanBm06 | BM-06, BM-05 và hồ sơ kèm xem ở **Văn bản đầu ra**. |
| 12 | tepDinhKemBm06 | Tệp đính kèm | filepicker | Có | — | — | — | =phanBm06 != "XAC_NHAN" | — | Nhiều tệp. Bắt buộc ở cả hai nút của bước xác nhận |
| 13 | lyDoTraLai | Lý do không đồng ý | textarea | — | 2000 | — | — | =phanBm06 != "XAC_NHAN" | — | Biến bắt buộc của luật không đồng ý (mục 2.5, thứ tự 3); thành dòng ý kiến khi hồ sơ tới bước 25 (BR-DXMS-07-05) |

### 7.4.62 dtms-ms02-t53-56-tap-doan

Quy trình MS02, bước 53, 54, 55, 56. Văn bản của bước: BM-06.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng |
| 2 | — | Xem xét hồ sơ | text | — | — | — | — | =phanTapDoan != "XEM_XET" | phanTapDoan | \### Xem xét hồ sơ, lập BM-07 BM-06 và hồ sơ kèm xem ở **Văn bản đầu ra**. |
| 3 | — | Gửi BM-07 | text | — | — | — | — | =phanTapDoan != "BM07" | phanTapDoan | \### Gửi BM-07 tới Tổng Giám đốc Tập đoàn BM-07 do Trưởng ban Ban ĐTXD Tập đoàn ký ngoài hệ thống; tải bản đã ký. |
| 4 | — | Thông báo | text | — | — | — | — | =phanTapDoan != "THONG_BAO" | phanTapDoan | \### Thông báo cho TTMS và Đầu mối của đơn vị đề xuất Xác nhận thì hệ thống gửi thông báo kèm BM-07. |
| 5 | — | Ý kiến Tập đoàn | text | — | — | — | — | =phanTapDoan != "Y_KIEN" | phanTapDoan | \### Tổng Giám đốc Tập đoàn xem xét, cho ý kiến |
| 6 | vanBanNhanDuoc | Văn bản nhận được | filepicker | — | — | — | — | =phanTapDoan != "XEM_XET" | — | Một tệp: văn bản chấp nhận hoặc trả lại của Ban ĐTXD Tập đoàn. Bắt buộc khi ghi nhận thay; máy chủ kiểm tra bằng KT-09 |
| 7 | bm07Tep | BM-07 đã ký | filepicker | Có | — | — | — | =phanTapDoan != "BM07" | — | Một tệp |
| 8 | bm07So | Số văn bản | textfield | Có | 100 | — | — | =phanTapDoan != "BM07" | — | — |
| 9 | bm07Ngay | Ngày ký | datetime | Có | — | — | — | =phanTapDoan != "BM07" | — | — |
| 10 | yKienTdNoiDung | Ý kiến của Tổng Giám đốc Tập đoàn | textarea | — | 4000 | — | — | =phanTapDoan != "Y_KIEN" | — | — |
| 11 | yKienTdTep | Phiếu ý kiến hoặc văn bản nhận được | filepicker | — | — | — | — | =phanTapDoan != "Y_KIEN" | — | Một tệp. Bắt buộc khi ghi nhận thay; máy chủ kiểm tra bằng KT-09 |
| 12 | lyDoTraLai | Lý do trả lại | textarea | — | 2000 | — | — | =phanTapDoan != "XEM_XET" and phanTapDoan != "Y_KIEN" | — | Biến bắt buộc của luật trả lại (mục 2.5, thứ tự 3); thành dòng ý kiến khi hồ sơ tới bước 25 (BR-DXMS-07-05) |

### 7.4.63 dtms-ms02-t58-60-bm08

Quy trình MS02, bước 58, 59, 60. Văn bản của bước: BM-08.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh+canCu | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau; cảnh báo căn cứ đã dùng vượt (BR-DXMS-09-13), không chặn |
| 2 | — | Dự thảo BM-08 | text | — | — | — | — | — | — | Dự thảo **Quyết định BM-08** do hệ thống sinh — xem ở **Văn bản đầu ra**. Hồ sơ kèm (Checklist 01, BM-02, BM-04, BM-05; BM-06, BM-07 nếu có) ở Danh sách tài liệu. |
| 3 | — | Chưa sinh được dự thảo | text | — | — | — | — | =bm08DaSinh | bm08DaSinh | Chưa sinh được dự thảo. |
| 4 | bm08Dieu2 | Điều 2. Tổ chức thực hiện | textarea | Có | 4000 | — | =bm08Dieu2Mau | — | bm08Dieu2Mau | Giá trị khởi tạo: câu mẫu giao đơn vị đề xuất tổ chức mua sắm (biến bm08Dieu2Mau do bước 57 ghi từ mẫu). Trường trộn Điều 2 của BM-08 |
| 5 | bm08NoiNhan | Nơi nhận | textarea | Có | 1000 | — | Như Điều 3; Lưu: VT | — | — | Trường trộn Nơi nhận của BM-08 |
| 6 | — | Checklist 01 của phiên bản hiện tại | table | — | — | nhom=Nhóm; muc=Danh mục hồ sơ; yeuCau=Yêu cầu; tinhTrang=Tình trạng; tep=Tệp | — | — | checklist | Chỉ xem, như bước 12 |

### 7.4.64 dtms-ms02-t60-phe-duyet-bm09

Quy trình MS02, bước 60. Văn bản của bước: BM-09.

| STT | Khóa | Nhãn | Kiểu | Bắt buộc | Độ dài | Lựa chọn | Mặc định | Điều kiện ẩn | Đọc biến | Luồng con | Mô tả |
|----|----|----|----|----|----|----|----|----|----|----|----|
| 1 | — | Khối điều chỉnh | adjimpact | — | — | hien=dongDau+soSanh+nguoiCoThamQuyen+canCu | — | — | — | — | Kiểu trường adjimpact (DTMS_CN_0173): dòng đầu điều chỉnh và thông báo khi Chuyển ngưỡng; nút Xem so sánh trước – sau; dòng Người có thẩm quyền; cảnh báo căn cứ đã dùng vượt (BR-DXMS-09-13), không chặn |
| 2 | — | KPI toàn trình | text | — | — | — | — | — | kpi, kpiGioiHan, phienBan | — | **KPI toàn trình:** {{kpi}} / {{kpiGioiHan}} NLV · **Phiên bản trình:** v{{phienBan}} |
| 3 | — | Văn bản phê duyệt BM-08 | text | — | — | — | — | — | — | MS01.01+MS01.02 | Văn bản phê duyệt: **Quyết định BM-08** — xem ở **Văn bản đầu ra**. Hồ sơ kèm (Checklist 01, BM-02, BM-04, BM-05; BM-06, BM-07 nếu có) ở Danh sách tài liệu. |
| 4 | — | Khối chữ ký thẩm định BM-09 | table | — | — | nguoiKy=Người ký; tuCach=Tư cách; trangThai=Trạng thái; thoiDiem=Thời điểm | — | — | kyBm09 | MS01.03 | Chỉ xem: kết quả ký thẩm định bước 40 |
| 5 | — | Văn bản phê duyệt BM-09 | text | — | — | — | — | — | — | MS01.03 | Văn bản phê duyệt: **BM-09** đã có chữ ký thẩm định — xem ở **Văn bản đầu ra**. Phê duyệt là ký ô PHÊ DUYỆT trên BM-09. |
| 6 | — | Ý kiến của Tổng Giám đốc Tập đoàn | text | — | — | — | — | — | yKienTdNoiDung, yKienTdTep | MS01.01 | \### Ý kiến của Tổng Giám đốc Tập đoàn {{yKienTdNoiDung}} *Phiếu ý kiến hoặc văn bản nhận được: {{yKienTdTep}}* |
| 7 | — | ✦ Gợi ý AI — đọc ý kiến của Tổng Giám đốc Tập đoàn | ai | — | — | — | — | =yKienTdAi = null | yKienTdAi | MS01.01 | {{yKienTdAi}} |
| 8 | — | — | text | — | — | — | — | =yKienTdAi != null | yKienTdAi | MS01.01 | Chưa có kết quả gợi ý AI. |

## 7.5 Phụ lục M — Luật hiển thị nút

**\[CẤU HÌNH\]** Dữ liệu seed của bảng luật hiển thị hành động (cau-hinh/luat-nut.csv). **Nút trên màn xử lý chỉ đến từ bảng này**; đổi tên, thêm, bớt, ngừng nút là sửa luật, không sửa code. Luật chỉ lọc tĩnh theo quy trình, bước, màn, biểu mẫu, vai trò; điều kiện theo dữ liệu hồ sơ do bộ xử lý của mã hành động kiểm tra khi bấm (D1). Cột Lý do: nút mở hộp thoại lý do bắt buộc của nền tảng thay cho eForm. Cột Kiểm tra, Hậu xử lý: mã của mục 2.5.2, 2.5.3 kèm tham số trong ngoặc; hậu xử lý mặc định của mã hành động (mục 2.5.1) không ghi lại.

| Mã luật | Bước | Mã hành động | Loại | Tên hiển thị | eForm | Vai trò | Lý do | Văn bản trình ký | Biến đặt | Kiểm tra | Hậu xử lý |
|----|----|----|----|----|----|----|----|----|----|----|----|
| MS01_T01_HOAN_THANH | MS01 · 1 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t01-can-cu | R-DVDX-CQ | Không | — | — | KT-10(canCu; vanBanId; loaiCanCu; văn bản dùng được theo BR-DXMS-02-02; bỏ qua dòng kế thừa theo BR-DXMS-09-03; Văn bản căn cứ không thuộc loại căn cứ đã chọn.); KT-11(canCu; vanBanId; —; Văn bản căn cứ đã được chọn.) | HX-01 |
| MS01_T04_HOAN_THANH | MS01 · 4 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t04-thong-tin-co-ban | R-DVDX-CQ | Không | — | — | KT-01(fundId; Nguồn vốn) | HX-01; HX-04 |
| MS01_T05_GUI_DUYET | MS01 · 5 | GUI_DUYET | MAIN | Xác nhận danh mục | dtms-ms01-t05-boc-tach | R-DVDX-CQ | Không | — | basisOk=true | KT-10(canCu; vanBanId; loaiCanCu; văn bản dùng được theo BR-DXMS-02-02; bỏ qua dòng kế thừa theo BR-DXMS-09-03; Văn bản căn cứ không thuộc loại căn cứ đã chọn.); KT-11(canCu; vanBanId; —; Văn bản căn cứ đã được chọn.); KT-11(bocTach; dongCanCu; NGOAI, MOI; Dòng căn cứ đã được dùng cho hạng mục khác.); KT-12(bocTach; prop; còn lại của dòng căn cứ theo dongCanCu, BR-DXMS-02-05, bỏ qua NGOAI, MOI; SL đề xuất vượt số còn lại của dòng căn cứ.) | HX-01 |
| MS01_T05_TRA_LAI | MS01 · 5 | TRA_LAI | DETAIL | Thiếu thông tin căn cứ | — | R-DVDX-CQ | Có | — | basisOk=false | — | HX-12(thieuThongTin) |
| MS01_T5.1_XAC_NHAN | MS01 · 5.1 | XAC_NHAN | MAIN | Xác nhận khởi tạo | dtms-ms01-t05-1-chi-huy-xac-nhan | R-DVDX-CH | Không | — | — | — | — |
| MS01_T5.1_TRA_LAI | MS01 · 5.1 | TRA_LAI | DETAIL | Trả lại | — | R-DVDX-CH | Có | — | — | — | — |
| MS01_T07_HOAN_THANH | MS01 · 7 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t07-ra-soat-ton-kho | R-DVDX-CQ | Không | — | — | KT-13(stock_review.phase của bản rà soát mới nhất; ACTUAL; Chưa có kết quả rà soát thực tế, chưa hoàn thành được.); KT-12(ruaSoatKho; fromStock; nhỏ hơn giữa Tồn khả dụng theo BR-DXMS-03-02 và SL đề xuất của hạng mục; Dùng từ kho không được lớn hơn {giá trị}.); KT-14(ruaSoatKho; SL đề xuất của hạng mục − fromStock \> 0; Toàn bộ nhu cầu được đáp ứng từ kho. Vui lòng giảm số dùng từ kho hoặc hủy hồ sơ.) | HX-01; HX-13 |
| MS01_T7.1_HOAN_THANH | MS01 · 7.1 | HOAN_THANH | MAIN | Duyệt | dtms-ms01-t07-1-chi-huy-kho-duyet | — | Không | — | — | — | — |
| MS01_T7.1_TRA_LAI | MS01 · 7.1 | TRA_LAI | DETAIL | Trả lại | — | — | Có | — | — | — | — |
| MS01_T08_HOAN_THANH | MS01 · 8 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t08-ycbg | R-DVDX-CQ | Không | — | — | KT-01(nccSel; danh mục Nhà cung cấp: Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-15(nccMoi; mst; danh mục Nhà cung cấp theo Mã số thuế; Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-08(hanTraLoi; luôn áp dụng; Hạn trả lời không được nhỏ hơn ngày gửi.) | HX-15(hanTraLoi; ngày Xác nhận; 7 khi có Nhóm 2, 5 khi chỉ Nhóm 1; khóa giữ hanTraLoiMacDinh); HX-14(nccMoi; nccSel; danh mục Nhà cung cấp; nguồn = mã hồ sơ; nccNhan) |
| MS01_T10_XAC_NHAN | MS01 · 10 | XAC_NHAN | MAIN | Báo giá đạt | dtms-ms01-t10-bao-gia | R-DVDX-CQ | Không | — | — | KT-16(baoGia; khongPhanHoi; hieuLucDen; donGia; ngày Xác nhận); KT-17(coSoGia; Văn bản căn cứ {Số văn bản} còn có thể sử dụng {x} tỷ đồng, hạng mục liên kết có Thành tiền {y} tỷ đồng. Vui lòng chọn lại cơ sở giá hoặc chọn Không đạt — gửi lại YCBG.); KT-06(AI kiểm tra báo giá; aiKiemTraBaoGia; thời gian chờ theo BR-DXMS-08-06; vanDat; lyDoVanDat; 2; AI kiểm tra báo giá: Không đạt — {Lý do}. Vui lòng kiểm tra lại dữ liệu.) | HX-04(baoGia); HX-01 |
| MS01_T10_TRA_LAI | MS01 · 10 | TRA_LAI | DETAIL | Không đạt — gửi lại YCBG | dtms-ms01-t08-ycbg | R-DVDX-CQ | Không · biến bắt buộc lyDoKhongDat | — | — | KT-01(nccSel; danh mục Nhà cung cấp: Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-15(nccMoi; mst; danh mục Nhà cung cấp theo Mã số thuế; Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-08(hanTraLoi; luôn áp dụng; Hạn trả lời không được nhỏ hơn ngày gửi.) | HX-15(hanTraLoi; ngày Xác nhận; 7 khi có Nhóm 2, 5 khi chỉ Nhóm 1; khóa giữ hanTraLoiMacDinh); HX-14(nccMoi; nccSel; danh mục Nhà cung cấp; nguồn = mã hồ sơ; nccNhan); HX-01 |
| MS01_T10.1_XAC_NHAN | MS01 · 10.1 | XAC_NHAN | MAIN | Đồng ý | dtms-ms01-t10-1-chi-huy-thau-duyet | — | Không | — | — | — | — |
| MS01_T10.1_TU_CHOI | MS01 · 10.1 | TU_CHOI | DETAIL | Từ chối | — | — | Có | — | — | — | — |
| MS01_T11_GUI_DUYET | MS01 · 11 | GUI_DUYET | MAIN | Gửi chỉ huy duyệt | dtms-ms01-t11-12-du-thao | R-DVDX-CQ | Không | — | — | KT-06(AI kiểm tra dự thảo; aiCheck; thời gian chờ theo BR-DXMS-08-06; vanGui; lyDoVanGui; 2) | HX-01; HX-04(aiSuCanThiet); HX-05(BR-DXMS-06-07); HX-02(BM-09 + Phụ lục chi phí + Checklist 02) |
| MS01_T12_GUI_DUYET | MS01 · 12 | GUI_DUYET | MAIN | Gửi chỉ huy duyệt | dtms-ms01-t11-12-du-thao | R-DVDX-CQ | Không | — | — | KT-06(AI kiểm tra dự thảo; aiCheck; thời gian chờ theo BR-DXMS-08-06; vanGui; lyDoVanGui; 2) | HX-01; HX-04(aiSuCanThiet); HX-05(BR-DXMS-06-07); HX-02(BM-01 + Phụ lục chi phí + Checklist 01) |
| MS01_T13_XAC_NHAN | MS01 · 13 | XAC_NHAN | MAIN | Đồng ý | dtms-ms01-t13-chi-huy-duyet | R-DVDX-CH | Không | — | — | KT-03(duyetPhan; ketQua; Đạt; Còn phần Không đạt, không thể đồng ý.) | HX-01 |
| MS01_T13_TU_CHOI | MS01 · 13 | TU_CHOI | DETAIL | Không đồng ý | dtms-ms01-t13-chi-huy-duyet | R-DVDX-CH | Không | — | — | KT-02(duyetPhan; ketQua; Không đạt; Vui lòng chọn ít nhất một phần Không đạt.) | HX-01 |
| MS01_T16_GUI_DUYET | MS01 · 16 | GUI_DUYET | MAIN | Gửi TTMS xác nhận danh sách CQCM | dtms-ms01-t16-chon-cqcm | R-DVDX-CQ | Không | — | — | KT-07(cqcmList; agencyId; chon; danh mục CQCM, cờ Bắt buộc; Danh sách phải có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán.); KT-01(cqcmList\[\].agencyId; danh mục CQCM; CQCM {Tên} không còn hoạt động, vui lòng chọn lại.) | HX-01; HX-07(appraisal_round.confirm_status; PENDING; appraisal_confirm); HX-06(hanGopYMacDinh; ngày hiện tại; hạn thẩm định mục 2.3.3; lanThamDinh = 1; hanGopYLanDau) |
| MS01_T16.1_PHE_DUYET | MS01 · 16.1 | PHE_DUYET | MAIN | Phê duyệt phiếu yêu cầu thẩm định | dtms-ms01-t16-1-chi-huy-duyet-bm03 | R-DVDX-CH | Không | — | — | — | — |
| MS01_T16.1_TRA_LAI | MS01 · 16.1 | TRA_LAI | DETAIL | Trả lại | — | R-DVDX-CH | Có | — | — | — | — |
| MS01_T17_XAC_NHAN | MS01 · 17 | XAC_NHAN | MAIN | Danh sách đúng, đủ — gửi yêu cầu thẩm định | dtms-ms01-t17-xac-nhan-cqcm | R-TTMS | Không | — | — | KT-08(hanGopY; lanThamDinh = 1; Hạn góp ý không được nhỏ hơn ngày hiện tại.) | HX-01; HX-07(appraisal_round.confirm_status; CONFIRMED; appraisal_confirm) |
| MS01_T17_TU_CHOI | MS01 · 17 | TU_CHOI | DETAIL | Chưa đúng/đủ — trả lại | — | R-TTMS | Có | — | — | — | HX-07(appraisal_round.confirm_status; RETURNED; appraisal_confirm; traLai17; lichSuTraLaiCqcm) |
| MS01_T19_HOAN_THANH | MS01 · 19 | HOAN_THANH | MAIN | Hoàn thành phiếu, trình chỉ huy | dtms-ms01-t19-bm04 | R-CQCM, R-TC | Không | — | — | — | HX-04(bm04Phieu); HX-01; HX-02(BM-04 dự thảo) |
| MS01_T20_TRINH_KY | MS01 · 20 | TRINH_KY | MAIN | Đồng ý & trình ký BM-04 | dtms-ms01-t20-ky-bm04 | R-CQCM-CH | Không | BM-04 | — | — | — |
| MS01_T20_TU_CHOI | MS01 · 20 | TU_CHOI | DETAIL | Không đồng ý | — | R-CQCM-CH | Có | — | — | — | — |
| MS01_T26_HOAN_THANH | MS01 · 26 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t26-ket-qua-bm04 | R-DVDX-CQ | Không | — | — | KT-18(quyetDinhYKien; muc; Giá trị và cơ sở giá; quyetDinh; RESERVE; Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới.) | HX-01; HX-16(opinion; status = PROCESSING và decision có giá trị; theo CQCM; giaiTrinh) |
| MS01_T27_GUI_DUYET | MS01 · 27 | GUI_DUYET | MAIN | Gửi hồ sơ hoàn chỉnh cho CQCM | dtms-ms01-t27-hoan-chinh | R-DVDX-CQ | Không | — | — | — | HX-05; HX-02(BM-01, Phụ lục chi phí, Checklist 01, BM-02, Phụ lục 1 \| MS01.03: BM-09, Phụ lục chi phí, Checklist 02, BM-02, Phụ lục 1) |
| MS01_T28_GUI_DUYET | MS01 · 28 | GUI_DUYET | MAIN | Gửi giải trình | dtms-ms01-t28-giai-trinh | R-DVDX-CQ | Không | — | — | — | HX-01; HX-05; HX-02(BM-01, BM-02, Phụ lục 1 \| MS01.03: BM-09, BM-02, Phụ lục 1); HX-16(opinion; status = PROCESSING và decision = RESERVE; theo CQCM; nokGiaiTrinh) |
| MS01_T31_HOAN_THANH | MS01 · 31 | HOAN_THANH | MAIN | Đã tổ chức họp | dtms-ms01-t31-to-chuc-hop | R-TTMS | Không | — | — | KT-01(thanhPhanHop; danh mục người dùng; Thành phần {Tên} không còn hợp lệ, vui lòng chọn lại.) | HX-01 |
| MS01_T32_XAC_NHAN | MS01 · 32 | XAC_NHAN | MAIN | Đã thống nhất | dtms-ms01-t32-ket-qua-hop | R-TTMS | Không | — | ketQuaHop=AGREED | — | HX-01; HX-17(opinion; decision = RESERVE và status = PROCESSING; status = BY_CONCLUSION) |
| MS01_T32_TRA_LAI | MS01 · 32 | TRA_LAI | DETAIL | Chưa thống nhất — trình cấp cao hơn | dtms-ms01-t32-ket-qua-hop | R-TTMS | Không | — | ketQuaHop=NOT_AGREED | — | HX-01 |
| MS01_T33_HOAN_THANH | MS01 · 33 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t33-trinh-cap-cao | R-TTMS | Không | — | — | — | — |
| MS01_T34_XAC_NHAN | MS01 · 34 | XAC_NHAN | MAIN | Thống nhất phương án | dtms-ms01-t34-ket-luan | R-TGD-VHT | Không · biến bắt buộc ketLuan | — | luaChonKetLuan=APPROVE_PLAN | — | HX-01; HX-17(opinion; decision = RESERVE và status = PROCESSING; status = BY_CONCLUSION) |
| MS01_T34_TRA_LAI | MS01 · 34 | TRA_LAI | DETAIL | Yêu cầu xử lý lại | dtms-ms01-t34-ket-luan | R-TGD-VHT | Không · biến bắt buộc ketLuan | — | luaChonKetLuan=REPROCESS | — | HX-01 |
| MS01_T35_XAC_NHAN | MS01 · 35 | XAC_NHAN | MAIN | Đạt | dtms-ms01-t35-kiem-tra-sua | R-CQCM, R-TC | Không | — | — | KT-03(kiemTraYKien; ketQuaKiemTra; Đạt; Còn ý kiến Chưa đạt, không thể chọn Đạt.) | HX-01 |
| MS01_T35_TRA_LAI | MS01 · 35 | TRA_LAI | DETAIL | Chưa đạt | dtms-ms01-t35-kiem-tra-sua | R-CQCM, R-TC | Không | — | — | KT-02(kiemTraYKien; ketQuaKiemTra; Chưa đạt; Vui lòng chọn ít nhất một ý kiến Chưa đạt.) | HX-01 |
| MS01_T36_TRINH_KY | MS01 · 36 | TRINH_KY | MAIN | Xác nhận ký BM-04 và Checklist | dtms-ms01-t36-ky-checklist | R-CQCM, R-TC | Không | BM-04 ký lại + Checklist 01 (MS01.03: Checklist 02) | — | — | — |
| MS01_T38_TRINH_KY | MS01 · 38 | TRINH_KY | MAIN | Ký thẩm định BM-09 | dtms-ms01-t38-39-ky-bm09 | R-TTMS | Không | BM-09 | — | — | — |
| MS01_T38_TU_CHOI | MS01 · 38 | TU_CHOI | DETAIL | Không đồng ý | — | R-TTMS | Có | — | — | — | — |
| MS01_T39_TRINH_KY | MS01 · 39 | TRINH_KY | MAIN | Ký thẩm định BM-09 | dtms-ms01-t38-39-ky-bm09 | R-PTGD | Không | BM-09 | — | — | — |
| MS01_T39_TU_CHOI | MS01 · 39 | TU_CHOI | DETAIL | Không đồng ý | — | R-PTGD | Có | — | — | — | — |
| MS01_T42_XAC_NHAN | MS01 · 42 | XAC_NHAN | MAIN | Hoàn tất rà soát BM-05 | dtms-ms01-t42-ra-soat-bm05 | R-TTMS | Không | — | — | — | HX-04(bm05); HX-01; HX-09(KT-04; dieuKienKyBm05) |
| MS01_T42_TRA_LAI | MS01 · 42 | TRA_LAI | DETAIL | Hồ sơ chưa đạt — trả đơn vị | — | R-TTMS | Có | — | — | — | — |
| MS01_T43_TRINH_KY | MS01 · 43 | TRINH_KY | MAIN | Xác nhận đủ điều kiện & ký BM-05 (TTMS) | dtms-ms01-t43-du-dieu-kien | R-TTMS | Không | BM-05 | — | KT-04 | — |
| MS01_T43_TRA_LAI | MS01 · 43 | TRA_LAI | DETAIL | Trả lại | — | R-TTMS | Có | — | — | — | — |
| MS01_T46_TRINH_KY | MS01 · 46 | TRINH_KY | MAIN | Ký BM-05 | dtms-ms01-t46-47-ky-bm05 | R-CQCM, R-TC | Không | BM-05 | — | — | — |
| MS01_T46_TU_CHOI | MS01 · 46 | TU_CHOI | DETAIL | Không đồng ý | — | R-CQCM, R-TC | Có | — | — | — | — |
| MS01_T47_TRINH_KY | MS01 · 47 | TRINH_KY | MAIN | Đồng ý, ký BM-05 | dtms-ms01-t46-47-ky-bm05 | R-PTGD | Không | BM-05 | — | — | — |
| MS01_T47_TU_CHOI | MS01 · 47 | TU_CHOI | DETAIL | Không đồng ý | — | R-PTGD | Có | — | — | — | — |
| MS01_T48_XAC_NHAN | MS01 · 48 | XAC_NHAN | MAIN | Có báo cáo TGĐ Tập đoàn | dtms-ms01-t48-bao-cao-td | R-TTMS | Không | — | reportTD=true; process="MS01.01" | KT-05(reportSuggested; true; reportReason) | HX-01 |
| MS01_T48_XAC_NHAN_2 | MS01 · 48 | XAC_NHAN | MAIN | Không báo cáo TGĐ Tập đoàn | dtms-ms01-t48-bao-cao-td | R-TTMS | Không | — | reportTD=false; process="MS01.02" | KT-05(reportSuggested; false; reportReason) | HX-01 |
| MS01_T50_HOAN_THANH | MS01 · 50 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t50-51-bm06 | R-TTMS | Không | — | — | — | HX-04(bm06) |
| MS01_T51_TRINH_KY | MS01 · 51 | TRINH_KY | MAIN | Đồng ý trình ký BM-06 | dtms-ms01-t50-51-bm06 | R-TGD-VHT | Không | BM-06 | — | — | HX-01 |
| MS01_T51_TU_CHOI | MS01 · 51 | TU_CHOI | DETAIL | Không đồng ý | dtms-ms01-t50-51-bm06 | R-TGD-VHT | Không · biến bắt buộc lyDoTraLai | — | — | — | HX-01 |
| MS01_T53_XAC_NHAN | MS01 · 53 | XAC_NHAN | MAIN | Chấp nhận hồ sơ, lập BM-07 | dtms-ms01-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không | — | — | KT-09(vanBanNhanDuoc; Vui lòng tải Văn bản nhận được.) | HX-10(vanBanNhanDuoc; Ban ĐTXD Tập đoàn) |
| MS01_T53_TRA_LAI | MS01 · 53 | TRA_LAI | DETAIL | Trả lại | dtms-ms01-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không · biến bắt buộc lyDoTraLai | — | — | KT-09(vanBanNhanDuoc; Vui lòng tải Văn bản nhận được.) | HX-10(vanBanNhanDuoc; Ban ĐTXD Tập đoàn) |
| MS01_T54_HOAN_THANH | MS01 · 54 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không | — | — | — | HX-01; HX-10(bm07Tep; Ban ĐTXD Tập đoàn) |
| MS01_T55_HOAN_THANH | MS01 · 55 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không | — | — | — | HX-11(dauMoiBm06; dauMoi; bm07Tep) |
| MS01_T56_XAC_NHAN | MS01 · 56 | XAC_NHAN | MAIN | TGĐ Tập đoàn đồng ý | dtms-ms01-t53-56-tap-doan | R-TGD-TD, R-TTMS | Không | — | — | KT-09(yKienTdTep; Vui lòng tải Văn bản nhận được.) | HX-01; HX-10(yKienTdTep; Tổng Giám đốc Tập đoàn) |
| MS01_T56_TRA_LAI | MS01 · 56 | TRA_LAI | DETAIL | Trả lại | dtms-ms01-t53-56-tap-doan | R-TGD-TD, R-TTMS | Không · biến bắt buộc lyDoTraLai | — | — | KT-09(yKienTdTep; Vui lòng tải Văn bản nhận được.) | HX-01; HX-10(yKienTdTep; Tổng Giám đốc Tập đoàn) |
| MS01_T58_HOAN_THANH | MS01 · 58 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms01-t58-60-bm08 | R-TTMS | Không | — | — | — | — |
| MS01_T59_GUI_DUYET | MS01 · 59 | GUI_DUYET | MAIN | Trình phê duyệt | dtms-ms01-t58-60-bm08 | R-TTMS | Không | — | — | — | — |
| MS01_T60_PHE_DUYET | MS01 · 60 | PHE_DUYET | MAIN | Phê duyệt | dtms-ms01-t60-phe-duyet-bm09 | R-TGD-VHT | Không | BM-08 (MS01.03: BM-09 ô PHÊ DUYỆT) | — | — | — |
| MS01_T60_TRA_LAI | MS01 · 60 | TRA_LAI | DETAIL | Yêu cầu hoàn chỉnh | — | R-TGD-VHT | Có | — | — | — | — |
| MS01_T60_TRA_LAI_2 | MS01 · 60 | TRA_LAI | DETAIL | Chỉ đạo khác — kết thúc | — | R-TGD-VHT | Có | — | chiDaoKhac=true | — | — |
| MS02_T01_HOAN_THANH | MS02 · 1 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t01-dxms-dieu-chinh | R-DVDX-CQ | Không | — | — | KT-10(canCu; vanBanId; loaiCanCu; văn bản dùng được theo BR-DXMS-02-02; bỏ qua dòng kế thừa theo BR-DXMS-09-03; Văn bản căn cứ không thuộc loại căn cứ đã chọn.); KT-11(canCu; vanBanId; —; Văn bản căn cứ đã được chọn.) | HX-01 |
| MS02_T04_HOAN_THANH | MS02 · 4 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t04-noi-dung-dieu-chinh | R-DVDX-CQ | Không | — | — | KT-01(fundId; Nguồn vốn; khi phamViDc chứa NGUON_VON); KT-19(daXemTacDongDuKien; Chuyển ngưỡng; giaTriSauDuKien; Vui lòng xem và chọn Đã xem tác động điều chỉnh.) | HX-04(adjAi); HX-01 |
| MS02_T05_GUI_DUYET | MS02 · 5 | GUI_DUYET | MAIN | Xác nhận danh mục | dtms-ms02-t05-boc-tach | R-DVDX-CQ | Không | — | basisOk=true | KT-10(canCu; vanBanId; loaiCanCu; văn bản dùng được theo BR-DXMS-02-02; bỏ qua dòng kế thừa theo BR-DXMS-09-03; Văn bản căn cứ không thuộc loại căn cứ đã chọn.); KT-11(canCu; vanBanId; —; Văn bản căn cứ đã được chọn.); KT-11(bocTach; dongCanCu; NGOAI, MOI; Dòng căn cứ đã được dùng cho hạng mục khác.); KT-12(bocTach; prop - slTruoc (phần tăng thêm so với hồ sơ căn cứ, BR-DXMS-09-13; dòng Thêm mới tính cả SL đề xuất); còn lại của dòng căn cứ theo dongCanCu, BR-DXMS-02-05, bỏ qua NGOAI, MOI; SL đề xuất vượt số còn lại của dòng căn cứ.); KT-20(bocTach; bo khác true; 1; luôn áp; Hồ sơ điều chỉnh phải còn ít nhất một hạng mục.); KT-20(bocTach; loaiThayDoi khác Không đổi (dòng không có slTruoc là Thêm mới); 1; phamViDc chỉ gồm DANH_MUC; Chưa có hạng mục nào được điều chỉnh.); KT-19(daXemTacDongHangMuc; Giảm dưới số đã ký; hạng mục trong form; Vui lòng xem và chọn Đã xem tác động điều chỉnh.) | HX-01 |
| MS02_T05_TRA_LAI | MS02 · 5 | TRA_LAI | DETAIL | Thiếu thông tin căn cứ | — | R-DVDX-CQ | Có | — | basisOk=false | — | HX-12(thieuThongTin) |
| MS02_T07_HOAN_THANH | MS02 · 7 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t07-ra-soat-ton-kho | R-DVDX-CQ | Không | — | — | KT-13(stock_review.phase của bản rà soát mới nhất; ACTUAL; Chưa có kết quả rà soát thực tế, chưa hoàn thành được.); KT-12(ruaSoatKho; fromStock; nhỏ hơn giữa Tồn khả dụng theo BR-DXMS-03-02 và SL đề xuất của hạng mục; Dùng từ kho không được lớn hơn {giá trị}.); KT-14(ruaSoatKho; SL đề xuất của hạng mục − fromStock \> 0; Toàn bộ nhu cầu được đáp ứng từ kho. Vui lòng giảm số dùng từ kho hoặc hủy hồ sơ.) | HX-01; HX-13 |
| MS02_T08_HOAN_THANH | MS02 · 8 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t08-ycbg | R-DVDX-CQ | Không | — | — | KT-01(nccSel; danh mục Nhà cung cấp: Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-15(nccMoi; mst; danh mục Nhà cung cấp theo Mã số thuế; Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-08(hanTraLoi; luôn áp dụng; Hạn trả lời không được nhỏ hơn ngày gửi.) | HX-15(hanTraLoi; ngày Xác nhận; 7 khi có Nhóm 2, 5 khi chỉ Nhóm 1; khóa giữ hanTraLoiMacDinh); HX-14(nccMoi; nccSel; danh mục Nhà cung cấp; nguồn = mã hồ sơ; nccNhan) |
| MS02_T10_XAC_NHAN | MS02 · 10 | XAC_NHAN | MAIN | Báo giá đạt | dtms-ms02-t10-bao-gia | R-DVDX-CQ | Không | — | — | KT-16(baoGia; khongPhanHoi; hieuLucDen; donGia; ngày Xác nhận); KT-21(hoSo.ngayTao; Báo giá phải có ngày từ {ngày tạo hồ sơ} trở về sau.); KT-17(coSoGia; Văn bản căn cứ {Số văn bản} còn có thể sử dụng {x} tỷ đồng, hạng mục liên kết có Thành tiền {y} tỷ đồng. Vui lòng chọn lại cơ sở giá hoặc chọn Không đạt — gửi lại YCBG.); KT-19(daXemTacDongBaoGia; Chuyển ngưỡng, Giảm dưới số đã ký; cơ sở giá đang chốt; Vui lòng xem và chọn Đã xem tác động điều chỉnh.); KT-06(AI kiểm tra báo giá; aiKiemTraBaoGia; thời gian chờ theo BR-DXMS-08-06; vanDat; lyDoVanDat; 2; AI kiểm tra báo giá: Không đạt — {Lý do}. Vui lòng kiểm tra lại dữ liệu.) | HX-04(baoGia); HX-01 |
| MS02_T10_TRA_LAI | MS02 · 10 | TRA_LAI | DETAIL | Không đạt — gửi lại YCBG | dtms-ms02-t08-ycbg | R-DVDX-CQ | Không · biến bắt buộc lyDoKhongDat | — | — | KT-01(nccSel; danh mục Nhà cung cấp: Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-15(nccMoi; mst; danh mục Nhà cung cấp theo Mã số thuế; Hoạt động, không bị Cấm; Nhà cung cấp {Tên} không còn hợp lệ, vui lòng chọn lại.); KT-08(hanTraLoi; luôn áp dụng; Hạn trả lời không được nhỏ hơn ngày gửi.) | HX-15(hanTraLoi; ngày Xác nhận; 7 khi có Nhóm 2, 5 khi chỉ Nhóm 1; khóa giữ hanTraLoiMacDinh); HX-14(nccMoi; nccSel; danh mục Nhà cung cấp; nguồn = mã hồ sơ; nccNhan); HX-01 |
| MS02_T11_GUI_DUYET | MS02 · 11 | GUI_DUYET | MAIN | Gửi chỉ huy duyệt | dtms-ms02-t11-12-du-thao | R-DVDX-CQ | Không | — | — | KT-06(AI kiểm tra dự thảo; aiCheck; thời gian chờ theo BR-DXMS-08-06; vanGui; lyDoVanGui; 2) | HX-01; HX-04(aiSuCanThiet); HX-05(BR-DXMS-06-07); HX-18(dieuChinh); HX-02(BM-09 bản điều chỉnh + Phụ lục chi phí + Checklist 02) |
| MS02_T12_GUI_DUYET | MS02 · 12 | GUI_DUYET | MAIN | Gửi chỉ huy duyệt | dtms-ms02-t11-12-du-thao | R-DVDX-CQ | Không | — | — | KT-06(AI kiểm tra dự thảo; aiCheck; thời gian chờ theo BR-DXMS-08-06; vanGui; lyDoVanGui; 2) | HX-01; HX-04(aiSuCanThiet); HX-05(BR-DXMS-06-07); HX-18(dieuChinh); HX-02(BM-01 bản điều chỉnh + Phụ lục chi phí + Checklist 01) |
| MS02_T13_XAC_NHAN | MS02 · 13 | XAC_NHAN | MAIN | Đồng ý | dtms-ms02-t13-chi-huy-duyet | R-DVDX-CH | Không | — | — | KT-03(duyetPhan; ketQua; Đạt; Còn phần Không đạt, không thể đồng ý.) | HX-01 |
| MS02_T13_TU_CHOI | MS02 · 13 | TU_CHOI | DETAIL | Không đồng ý | dtms-ms02-t13-chi-huy-duyet | R-DVDX-CH | Không | — | — | KT-02(duyetPhan; ketQua; Không đạt; Vui lòng chọn ít nhất một phần Không đạt.) | HX-01 |
| MS02_T16_GUI_DUYET | MS02 · 16 | GUI_DUYET | MAIN | Gửi TTMS xác nhận danh sách CQCM | dtms-ms02-t16-chon-cqcm | R-DVDX-CQ | Không | — | — | KT-07(cqcmList; agencyId; chon; danh mục CQCM, cờ Bắt buộc; Danh sách phải có CQCM về đầu tư – xây dựng và CQCM về tài chính kế toán.); KT-01(cqcmList\[\].agencyId; danh mục CQCM; CQCM {Tên} không còn hoạt động, vui lòng chọn lại.) | HX-01; HX-07(appraisal_round.confirm_status; PENDING; appraisal_confirm); HX-06(hanGopYMacDinh; ngày hiện tại; hạn thẩm định mục 2.3.3; lanThamDinh = 1; hanGopYLanDau) |
| MS02_T17_XAC_NHAN | MS02 · 17 | XAC_NHAN | MAIN | Danh sách đúng, đủ — gửi yêu cầu thẩm định | dtms-ms02-t17-xac-nhan-cqcm | R-TTMS | Không | — | — | KT-08(hanGopY; lanThamDinh = 1; Hạn góp ý không được nhỏ hơn ngày hiện tại.) | HX-01; HX-07(appraisal_round.confirm_status; CONFIRMED; appraisal_confirm) |
| MS02_T17_TU_CHOI | MS02 · 17 | TU_CHOI | DETAIL | Chưa đúng/đủ — trả lại | — | R-TTMS | Có | — | — | — | HX-07(appraisal_round.confirm_status; RETURNED; appraisal_confirm; traLai17; lichSuTraLaiCqcm) |
| MS02_T19_HOAN_THANH | MS02 · 19 | HOAN_THANH | MAIN | Hoàn thành phiếu, trình chỉ huy | dtms-ms02-t19-bm04 | R-CQCM, R-TC | Không | — | — | — | HX-04(bm04Phieu); HX-01; HX-02(BM-04 dự thảo) |
| MS02_T20_TRINH_KY | MS02 · 20 | TRINH_KY | MAIN | Đồng ý & trình ký BM-04 | dtms-ms02-t20-ky-bm04 | R-CQCM-CH | Không | BM-04 | — | — | — |
| MS02_T20_TU_CHOI | MS02 · 20 | TU_CHOI | DETAIL | Không đồng ý | — | R-CQCM-CH | Có | — | — | — | — |
| MS02_T26_HOAN_THANH | MS02 · 26 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t26-ket-qua-bm04 | R-DVDX-CQ | Không | — | — | KT-18(quyetDinhYKien; muc; Giá trị và cơ sở giá; quyetDinh; RESERVE; Giá trị hồ sơ không đổi được sau khi có báo giá đạt. Cần đổi giá trị thì Hủy hồ sơ và tạo hồ sơ mới.) | HX-01; HX-16(opinion; status = PROCESSING và decision có giá trị; theo CQCM; giaiTrinh) |
| MS02_T27_GUI_DUYET | MS02 · 27 | GUI_DUYET | MAIN | Gửi hồ sơ hoàn chỉnh cho CQCM | dtms-ms02-t27-hoan-chinh | R-DVDX-CQ | Không | — | — | — | HX-05; HX-02(BM-01 bản điều chỉnh, Phụ lục chi phí, Checklist 01, BM-02, Phụ lục 1 \| MS02.03: BM-09 bản điều chỉnh, Phụ lục chi phí, Checklist 02, BM-02, Phụ lục 1) |
| MS02_T28_GUI_DUYET | MS02 · 28 | GUI_DUYET | MAIN | Gửi giải trình | dtms-ms02-t28-giai-trinh | R-DVDX-CQ | Không | — | — | — | HX-01; HX-05; HX-02(BM-01, BM-02, Phụ lục 1 \| MS01.03: BM-09, BM-02, Phụ lục 1); HX-16(opinion; status = PROCESSING và decision = RESERVE; theo CQCM; nokGiaiTrinh) |
| MS02_T31_HOAN_THANH | MS02 · 31 | HOAN_THANH | MAIN | Đã tổ chức họp | dtms-ms02-t31-to-chuc-hop | R-TTMS | Không | — | — | KT-01(thanhPhanHop; danh mục người dùng; Thành phần {Tên} không còn hợp lệ, vui lòng chọn lại.) | HX-01 |
| MS02_T32_XAC_NHAN | MS02 · 32 | XAC_NHAN | MAIN | Đã thống nhất | dtms-ms02-t32-ket-qua-hop | R-TTMS | Không | — | ketQuaHop=AGREED | — | HX-01; HX-17(opinion; decision = RESERVE và status = PROCESSING; status = BY_CONCLUSION) |
| MS02_T32_TRA_LAI | MS02 · 32 | TRA_LAI | DETAIL | Chưa thống nhất — trình cấp cao hơn | dtms-ms02-t32-ket-qua-hop | R-TTMS | Không | — | ketQuaHop=NOT_AGREED | — | HX-01 |
| MS02_T33_HOAN_THANH | MS02 · 33 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t33-trinh-cap-cao | R-TTMS | Không | — | — | — | — |
| MS02_T34_XAC_NHAN | MS02 · 34 | XAC_NHAN | MAIN | Thống nhất phương án | dtms-ms02-t34-ket-luan | R-TGD-VHT | Không · biến bắt buộc ketLuan | — | luaChonKetLuan=APPROVE_PLAN | — | HX-01; HX-17(opinion; decision = RESERVE và status = PROCESSING; status = BY_CONCLUSION) |
| MS02_T34_TRA_LAI | MS02 · 34 | TRA_LAI | DETAIL | Yêu cầu xử lý lại | dtms-ms02-t34-ket-luan | R-TGD-VHT | Không · biến bắt buộc ketLuan | — | luaChonKetLuan=REPROCESS | — | HX-01 |
| MS02_T35_XAC_NHAN | MS02 · 35 | XAC_NHAN | MAIN | Đạt | dtms-ms02-t35-kiem-tra-sua | R-CQCM, R-TC | Không | — | — | KT-03(kiemTraYKien; ketQuaKiemTra; Đạt; Còn ý kiến Chưa đạt, không thể chọn Đạt.) | HX-01 |
| MS02_T35_TRA_LAI | MS02 · 35 | TRA_LAI | DETAIL | Chưa đạt | dtms-ms02-t35-kiem-tra-sua | R-CQCM, R-TC | Không | — | — | KT-02(kiemTraYKien; ketQuaKiemTra; Chưa đạt; Vui lòng chọn ít nhất một ý kiến Chưa đạt.) | HX-01 |
| MS02_T36_TRINH_KY | MS02 · 36 | TRINH_KY | MAIN | Xác nhận ký BM-04 và Checklist | dtms-ms02-t36-ky-checklist | R-CQCM, R-TC | Không | BM-04 ký lại + Checklist 01 (MS02.03: Checklist 02) | — | — | — |
| MS02_T38_TRINH_KY | MS02 · 38 | TRINH_KY | MAIN | Ký thẩm định BM-09 | dtms-ms02-t38-39-ky-bm09 | R-TTMS | Không | BM-09 | — | — | — |
| MS02_T38_TU_CHOI | MS02 · 38 | TU_CHOI | DETAIL | Không đồng ý | — | R-TTMS | Có | — | — | — | — |
| MS02_T39_TRINH_KY | MS02 · 39 | TRINH_KY | MAIN | Ký thẩm định BM-09 | dtms-ms02-t38-39-ky-bm09 | R-PTGD | Không | BM-09 | — | — | — |
| MS02_T39_TU_CHOI | MS02 · 39 | TU_CHOI | DETAIL | Không đồng ý | — | R-PTGD | Có | — | — | — | — |
| MS02_T42_XAC_NHAN | MS02 · 42 | XAC_NHAN | MAIN | Hoàn tất rà soát BM-05 | dtms-ms02-t42-ra-soat-bm05 | R-TTMS | Không | — | — | — | HX-04(bm05); HX-01; HX-09(KT-04; dieuKienKyBm05) |
| MS02_T42_TRA_LAI | MS02 · 42 | TRA_LAI | DETAIL | Hồ sơ chưa đạt — trả đơn vị | — | R-TTMS | Có | — | — | — | — |
| MS02_T43_TRINH_KY | MS02 · 43 | TRINH_KY | MAIN | Xác nhận đủ điều kiện & ký BM-05 (TTMS) | dtms-ms02-t43-du-dieu-kien | R-TTMS | Không | BM-05 | — | KT-04 | — |
| MS02_T43_TRA_LAI | MS02 · 43 | TRA_LAI | DETAIL | Trả lại | — | R-TTMS | Có | — | — | — | — |
| MS02_T46_TRINH_KY | MS02 · 46 | TRINH_KY | MAIN | Ký BM-05 | dtms-ms02-t46-47-ky-bm05 | R-CQCM, R-TC | Không | BM-05 | — | — | — |
| MS02_T46_TU_CHOI | MS02 · 46 | TU_CHOI | DETAIL | Không đồng ý | — | R-CQCM, R-TC | Có | — | — | — | — |
| MS02_T47_TRINH_KY | MS02 · 47 | TRINH_KY | MAIN | Đồng ý, ký BM-05 | dtms-ms02-t46-47-ky-bm05 | R-PTGD | Không | BM-05 | — | — | — |
| MS02_T47_TU_CHOI | MS02 · 47 | TU_CHOI | DETAIL | Không đồng ý | — | R-PTGD | Có | — | — | — | — |
| MS02_T48_XAC_NHAN | MS02 · 48 | XAC_NHAN | MAIN | Có báo cáo TGĐ Tập đoàn | dtms-ms02-t48-bao-cao-td | R-TTMS | Không | — | reportTD=true | KT-05(reportSuggested; true; reportReason) | HX-01 |
| MS02_T48_XAC_NHAN_2 | MS02 · 48 | XAC_NHAN | MAIN | Không báo cáo TGĐ Tập đoàn | dtms-ms02-t48-bao-cao-td | R-TTMS | Không | — | reportTD=false | KT-05(reportSuggested; false; reportReason) | HX-01 |
| MS02_T50_HOAN_THANH | MS02 · 50 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t50-51-bm06 | R-TTMS | Không | — | — | — | HX-04(bm06) |
| MS02_T51_TRINH_KY | MS02 · 51 | TRINH_KY | MAIN | Đồng ý trình ký BM-06 | dtms-ms02-t50-51-bm06 | R-TGD-VHT | Không | BM-06 | — | — | HX-01 |
| MS02_T51_TU_CHOI | MS02 · 51 | TU_CHOI | DETAIL | Không đồng ý | dtms-ms02-t50-51-bm06 | R-TGD-VHT | Không · biến bắt buộc lyDoTraLai | — | — | — | HX-01 |
| MS02_T53_XAC_NHAN | MS02 · 53 | XAC_NHAN | MAIN | Chấp nhận hồ sơ, lập BM-07 | dtms-ms02-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không | — | — | KT-09(vanBanNhanDuoc; Vui lòng tải Văn bản nhận được.) | HX-10(vanBanNhanDuoc; Ban ĐTXD Tập đoàn) |
| MS02_T53_TRA_LAI | MS02 · 53 | TRA_LAI | DETAIL | Trả lại | dtms-ms02-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không · biến bắt buộc lyDoTraLai | — | — | KT-09(vanBanNhanDuoc; Vui lòng tải Văn bản nhận được.) | HX-10(vanBanNhanDuoc; Ban ĐTXD Tập đoàn) |
| MS02_T54_HOAN_THANH | MS02 · 54 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không | — | — | — | HX-01; HX-10(bm07Tep; Ban ĐTXD Tập đoàn) |
| MS02_T55_HOAN_THANH | MS02 · 55 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t53-56-tap-doan | R-BAN-DTXD, R-TTMS | Không | — | — | — | HX-11(dauMoiBm06; dauMoi; bm07Tep) |
| MS02_T56_XAC_NHAN | MS02 · 56 | XAC_NHAN | MAIN | TGĐ Tập đoàn đồng ý | dtms-ms02-t53-56-tap-doan | R-TGD-TD, R-TTMS | Không | — | — | KT-09(yKienTdTep; Vui lòng tải Văn bản nhận được.) | HX-01; HX-10(yKienTdTep; Tổng Giám đốc Tập đoàn) |
| MS02_T56_TRA_LAI | MS02 · 56 | TRA_LAI | DETAIL | Trả lại | dtms-ms02-t53-56-tap-doan | R-TGD-TD, R-TTMS | Không · biến bắt buộc lyDoTraLai | — | — | KT-09(yKienTdTep; Vui lòng tải Văn bản nhận được.) | HX-01; HX-10(yKienTdTep; Tổng Giám đốc Tập đoàn) |
| MS02_T58_HOAN_THANH | MS02 · 58 | HOAN_THANH | MAIN | Hoàn thành | dtms-ms02-t58-60-bm08 | R-TTMS | Không | — | — | — | — |
| MS02_T59_GUI_DUYET | MS02 · 59 | GUI_DUYET | MAIN | Trình phê duyệt | dtms-ms02-t58-60-bm08 | R-TTMS | Không | — | — | — | — |
| MS02_T60_PHE_DUYET | MS02 · 60 | PHE_DUYET | MAIN | Phê duyệt | dtms-ms02-t60-phe-duyet-bm09 | R-TGD-VHT | Không | BM-08 bản điều chỉnh (MS02.03: BM-09 bản điều chỉnh, ô PHÊ DUYỆT) | — | — | — |
| MS02_T60_TRA_LAI | MS02 · 60 | TRA_LAI | DETAIL | Yêu cầu hoàn chỉnh | — | R-TGD-VHT | Có | — | — | — | — |
| MS02_T60_TRA_LAI_2 | MS02 · 60 | TRA_LAI | DETAIL | Chỉ đạo khác — kết thúc | — | R-TGD-VHT | Có | — | chiDaoKhac=true | — | — |

## 7.6 Danh mục hành động

**\[CẤU HÌNH\]** Seed danh mục hành động (cau-hinh/hanh-dong.csv). Mỗi mã hành động gắn một bộ xử lý của nền tảng; outcome là biến trả cho cổng BPMN.

| Mã               | Tên              | Loại   | Outcome             |
|------------------|------------------|--------|---------------------|
| GUI_DUYET        | Gửi duyệt        | MAIN   | action=SUBMIT       |
| PHE_DUYET        | Phê duyệt        | MAIN   | approved=true       |
| XAC_NHAN         | Xác nhận         | MAIN   | confirmed=true      |
| TRINH_KY         | Trình ký         | MAIN   | signRequested=true  |
| HOAN_THANH       | Hoàn thành       | MAIN   | completed=true      |
| TRA_LAI          | Trả lại          | DETAIL | approved=false      |
| TU_CHOI          | Từ chối          | DETAIL | agreed=false        |
| SUA_LAI          | Sửa lại          | DETAIL | mismatchAction=EDIT |
| CHUYEN_QUY_TRINH | Chuyển quy trình | OTHER  | mismatchAction=MOVE |
| LUU              | Lưu              | OTHER  | —                   |
| UPDATE_MEMBERS   | Cập nhật nhân sự | OTHER  | —                   |
