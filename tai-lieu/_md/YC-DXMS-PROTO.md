<!-- pk-source: 02. VHT gửi/ĐXMS-20261104/NỘI DUNG CHỈNH SỬA VÀ BỔ SUNG PROTOTYPE HỆ THỐNG ĐỀ XUẤT MUA SẮM (ĐXMS).docx -->
<!-- pk-sha256: db98aa6bd59be16815f7cf2e2357b749fd0a9f1e9d89e9e4779275c0f4437726 -->
<!-- pk-generated: 2026-11-04 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# YC-DXMS-PROTO — bản đọc máy sinh

> Nguồn: `project-knowledge/02. VHT gửi/ĐXMS-20261104/NỘI DUNG CHỈNH SỬA VÀ BỔ SUNG PROTOTYPE HỆ THỐNG ĐỀ XUẤT MUA SẮM (ĐXMS).docx`. Trích dẫn thì ghi mã **YC-DXMS-PROTO** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

### NỘI DUNG CHỈNH SỬA VÀ BỔ SUNG PROTOTYPE HỆ THỐNG ĐỀ XUẤT MUA SẮM (ĐXMS)

*Tài liệu Đặc tả Yêu cầu Cập nhật Giao diện & Luồng Thao tác dựa trên Kết quả Rà soát Hệ thống Cũ và Thống nhất Đội ngũ BA*

#### 1. Tổng quan & Bối cảnh Cập nhật Prototype

Trong quá trình chuyển đổi số và nâng cấp Hệ thống Đầu tư Mua sắm (ĐTMS) tại Viettel High Tech (VHT), đội ngũ Phân tích Nghiệp vụ (BA) đã tiến hành rà soát chuyên sâu hiện trạng vận hành trên hệ thống ĐTMS cũ, đối chiếu với tài liệu luồng thao tác (ĐTMS_Note màn hình HT cũ.xlsx) và tổ chức các phiên họp kỹ thuật ("Họp BA").

Kết quả rà soát cho thấy hệ thống cũ tồn tại một số điểm nghẽn về mặt trải nghiệm người dùng (UX) và đứt gãy dữ liệu (Data Discontinuity) — đặc biệt là việc cán bộ thẩm định phải tải file Word về máy cá nhân để soi xét thủ công, dữ liệu dự toán bóc tách thiếu tính liên kết với các đợt mua sắm thực tế, và chưa có cơ chế kiểm soát danh mục được phép mua sắm từ đầu nguồn.

Để hoàn thiện bản Prototype chuẩn bị cho giai đoạn phát triển phần mềm, tài liệu này tổng hợp toàn bộ các nội dung cần chỉnh sửa, bổ sung chi tiết trên giao diện và luồng thao tác của màn hình Đề xuất mua sắm (ĐXMS).

#### 2. Yêu cầu Bổ sung Module Đề tài/dự án

Tờ trình ĐXMS không tự sinh ra độc lập mà bắt buộc phải gắn với một Đề tài/Dự án đầu vào đã được phê duyệt. Prototype hiện tại cần bổ sung phân hệ và các trường thông tin quản lý nguồn như sau:

##### 2.1. Thêm Trường & Dropdown "Nhiệm vụ / Đề tài / Dự án"

- **Thao tác trên UI:** Tại màn hình khởi tạo ĐXMS của Đơn vị đề xuất, bổ sung trường bắt buộc chọn Nhiệm vụ / Đề tài / Dự án.

- **Cơ chế đồng bộ dữ liệu:** Hệ thống ĐTMS không trực tiếp khởi tạo hay quản lý danh mục Đề tài, mà thực hiện **đồng bộ tự động từ phân hệ Quản lý Khoa học Công nghệ (KHCN)** về hệ thống ĐTMS.

- **Phạm vi ưu tiên (Pha 1):** Hiện tại phân hệ KHCN đã phát triển và sẵn sàng dữ liệu, do đó hệ thống sẽ ưu tiên đồng bộ toàn bộ danh mục Nhiệm vụ / Đề tài / Dự án KHCN trước. Các nguồn nhu cầu khác như Phương án kinh doanh (PAKD) hay Sản xuất kinh doanh thường xuyên sẽ tiếp tục giữ cơ chế đồng bộ dữ liệu cũ hoặc mở rộng ở pha sau.

##### 2.2. Bổ sung Màn hình Tra cứu & Xem Chi tiết Danh mục Đề tài / Dự án

- **Thêm Menu chuyên biệt:** Tạo một màn hình danh sách (Data List) để người dùng và cán bộ Trung tâm Mua sắm (TTMS) có thể truy cập xem danh sách toàn bộ các Đề tài / Dự án KHCN đã được đồng bộ về ĐTMS.

- **Hiển thị thông tin thuộc tính dự án (90% thuộc tính KHCN):** Màn hình chi tiết hiển thị đầy đủ thông tin chung của dự án (Tên đề tài, Mã nhiệm vụ, Chủ nhiệm đề tài, Đơn vị chủ trì, Tổng kinh phí, Thời gian thực hiện, Lĩnh vực) và toàn bộ Bảng bóc tách dự toán hạng mục R&D đã được phê duyệt.

#### 3. Yêu cầu Chỉnh sửa Màn hình Bóc tách Dự toán & Khấu trừ Nhu cầu

Màn hình hiển thị Bóc tách dự toán của Đề tài / Dự án là sở cứ gốc để Đơn vị đề xuất trích xuất danh mục vật tư/thiết bị cần đặt mua. Prototype cần cập nhật các tính năng quản lý nâng cao tại màn hình này:

##### 3.1. Bổ sung Cột "Chi mua sắm" (Quyền kiểm soát của TTMS)

- **Mục đích:** Khắc phục tình trạng Đơn vị đề xuất tạo ĐXMS tràn lan cho cả những hạng mục không thuộc diện mua sắm qua Trung tâm Mua sắm (như chi phí nhân công, chi phí hội thảo, quản lý chung).

- **Quy tắc UI/UX:**

- Bổ sung một cột Checkbox có tên **"Chi mua sắm"** trên Bảng dự toán chi tiết.

- **Chỉ riêng người dùng thuộc Trung tâm Mua sắm (TTMS)** mới có quyền tích chọn hoặc bỏ tích checkbox này.

- Đơn vị đề xuất khi lập ĐXMS chỉ được phép chọn/bóc tách những dòng hàng hóa, vật tư, thiết bị đã được TTMS tích chọn "Chi mua sắm".

##### 3.2. Mở rộng Giao diện Dạng Xổ xuống (Accordion Drill-down) cho từng Hạng mục

- **Trải nghiệm người dùng cũ (AS-IS):** Hệ thống cũ chỉ hiển thị danh mục dòng phẳng, đơn điệu, chỉ ghi nhận tổng giá trị cuối cùng, khiến người dùng không biết hạng mục đó đã được mua bao nhiêu lần và trạng thái ra sao.

- **Cải tiến Prototype mới (TO-BE):**

- Tại mỗi dòng hạng mục thiết bị/vật tư (ví dụ: *Máy tính xách tay cấu hình cao - Số lượng 10 chiếc* ), bổ sung biểu tượng xổ xuống (Dropdown / Accordion).

- Khi người dùng click xổ xuống, hệ thống hiển thị bảng chi tiết các đợt ĐXMS đã được khởi tạo liên quan đến hạng mục đó:

- *Đợt 1:* Mua 02 chiếc — Mã ĐXMS: DXMS-2026-001 — Trạng thái: **Hoàn thành** .

- *Đợt 2:* Mua 03 chiếc — Mã ĐXMS: DXMS-2026-015 — Trạng thái: **Đang thực hiện** .

- Giúp cán bộ quản lý nhìn rõ ngay tỷ lệ % công việc đã thực thi, số lượng còn lại có thể mua, và liên kết trực tiếp (hyperlink) tới hồ sơ ĐXMS tương ứng trên ĐTMS.

##### 3.3. Tự động Tính toán & Đồng bộ Chỉ số Thực hiện

- Hệ thống tự động tính toán lũy kế số lượng/giá trị từ các đợt ĐXMS đã duyệt để cập nhật ngược lại các chỉ số: Số lượng đã đăng ký mua, Giá trị thực hiện (theo Hợp đồng/Quyết toán), Giá trị tiết kiệm, và Số lượng/Kinh phí còn lại khả dụng.

#### 4. Yêu cầu Cải tiến Màn hình Lập ĐXMS & Khai báo Thông tin Ban đầu

Màn hình Soạn thảo/Khởi tạo Tờ trình ĐXMS cần được thiết kế lại để tối ưu hóa thao tác bóc tách và phân luồng tự động:

##### 4.1. Thao tác Bóc tách Danh mục từ Dự toán vào Tờ trình

1.  **Quy trình thao tác:**

2.  Người dùng chọn Đề tài / Dự án KHCN căn cứ.

3.  Hệ thống tải danh mục Loại chi phí và Khoản mục chi phí tương ứng dưới dạng 2 cột Dropdown liên hoàn (Cha - Con).

4.  Người dùng chọn hạng mục, nhập Số lượng đề xuất và Giá trị dự tính.

5.  Bấm nút **+ Thêm vào ĐXMS** : Dòng nhu cầu sẽ được chèn vào Bảng danh mục ĐXMS bên dưới.

6.  **Gộp Luồng Tự động (MS01):** Prototype không yêu cầu người dùng phải chọn thủ công luồng "ĐXMS trên 160 tỷ" hay "ĐXMS dưới 160 tỷ" ngay từ màn hình khởi tạo. Hệ thống sẽ tự động căn cứ vào **Tổng giá trị ĐXMS** (sau khi đã trừ tồn kho và cập nhật báo giá) để tự động kích hoạt luồng quy trình tương ứng ( **MS01.01/MS01.02** hoặc **MS01.03** ).

##### 4.2. Chọn Đơn vị & Cơ quan Chuyên môn (CQCM) Thẩm định

- Bổ sung trường chọn Đơn vị **thẩm định** ngay trên biểu mẫu khởi tạo ĐXMS.

- Cho phép chọn đích danh hoặc chọn theo vai trò phòng ban

##### 4.3. Tích hợp Bước Rà soát Tồn kho Khả dụng (WMS)

- Sau khi Đơn vị đề xuất lập xong dự thảo danh mục ĐXMS và lưu hồ sơ, hệ thống tự động sinh yêu cầu chuyển thông tin sang **Phân hệ Kho / Quản lý Tài sản** .

- Bộ phận Kho thực hiện rà soát tồn kho khả dụng trên hệ thống WMS, nhập số lượng có thể đáp ứng từ kho, và tính ra Số lượng thực tế cần mua sắm (Số lượng cần mua = Số lượng đề xuất - Số lượng tồn kho khả dụng).

- Bảng kết quả rà soát tồn kho bắt buộc phải có xác nhận/ký điện tử của **Chỉ huy Kho / Trưởng phòng Quản lý tài sản** (qua VOffice hoặc ký mềm/ký cứng) mới đủ điều kiện đính kèm làm sở cứ cho hồ sơ ĐXMS chuyển sang bước thẩm định chính thức.

#### 5. Yêu cầu Chuẩn hóa Màn hình Thẩm định Tờ trình CQCM (Khắc phục hạn chế AS-IS)

Màn hình Thẩm định Tờ trình của Cơ quan Chuyên môn là nơi ghi nhận các ý kiến đánh giá chuyên môn (Pháp lý, Giá cả, Cấu hình kỹ thuật, Sự cần thiết).

5.1. Bảng So sánh Nhược điểm AS-IS & Giải pháp TO-BE trên Prototype

Hạng mục UX/UI,Hiện trạng Hệ thống Cũ (AS-IS),Thiết kế Prototype Mới (TO-BE)

Phương thức đọc hồ sơ,Cán bộ thẩm định bắt buộc phải bấm tải file Word/Excel đính kèm về máy tính cá nhân để đọc và đối chiếu.,"Tích hợp Trình xem Văn bản / eForm trực tuyến (Document Viewer) ngay trên màn hình thẩm định, không cần tải file về máy."

Phương thức ghi nhận Comment,"Cán bộ ghi nhận ý kiến bằng cách sửa trực tiếp/Track Changes trong file Word rồi upload lại, hoặc dán link comment.","Box ""Góp ý đề xuất sửa đổi"" cấu trúc hóa : Cung cấp Textbox nhập nội dung chi tiết + Radio Button chọn trạng thái (OK / Not OK) trực tiếp trên giao diện."

Phản hồi ý kiến,Ý kiến thẩm định bị phân tán trong các file đính kèm khác nhau qua từng đợt trình.,"Bảng ""Lịch sử phản hồi ý kiến thẩm định"" : Hiển thị chuỗi lịch sử comment theo dạng Timeline/Table, phân định rõ ý kiến lần 1, lần 2, lần 3."

Hành động thẩm định,"Nút bấm không rõ ràng, dễ nhầm lẫn giữa lưu tạm và chốt kết quả.","Bộ nút thao tác chuẩn hóa : Ghi lại (Lưu tạm ý kiến), Đồng ý (Chốt OK), Yêu cầu sửa (Gửi Not OK về ĐVĐX), Hủy thẩm định (Trả hồ sơ)."

##### 5.2. Cấu trúc Màn hình Thẩm định CQCM trên Prototype

Màn hình Thẩm định Tờ trình ĐXMS được chia thành 4 khu vực chính:

1.  **Khu vực 1: Thông tin Tờ trình & Trình xem File/eForm trực tuyến** — Cho phép xem Tờ trình ĐXMS, Checklist 01/02, Bảng bóc tách danh mục và kết quả rà soát tồn kho.

2.  **Khu vực 2: Khối Lịch sử Phản hồi Ý kiến Thẩm định** — Hiển thị toàn bộ cây lịch sử góp ý của các CQCM khác và các vòng thẩm định trước đó.

3.  **Khu vực 3: Box Góp ý & Đề xuất Sửa đổi** — Nhập nội dung nhận xét chuyên môn, đánh giá chất lượng hồ sơ và chọn trạng thái OK hoặc Not OK.

4.  **Khu vực 4: Thanh Nút Thao tác (Action Bar)** — Chứa các nút Ghi lại, Đồng ý, Yêu cầu sửa, Hủy thẩm định.

#### 6. Tổng hợp Danh mục Nút Thao tác & Quy tắc Chuyển trạng thái

Tên Nút Thao tác,Vị trí / Màn hình,Vai trò Sử dụng,Quy tắc Nghiệp vụ & Chuyển trạng thái

\+ Thêm hạng mục,Lập ĐXMS,Đơn vị đề xuất,Bóc tách từng dòng từ Dự toán KHCN đã chọn xuống bảng danh mục ĐXMS.

Chi mua sắm (Checkbox),Bảng Dự toán,Cán bộ TTMS,Đánh dấu dòng vật tư/thiết bị được phép mua sắm. ĐVĐX chỉ chọn được dòng đã tích.

Xổ xuống ▾ (Accordion),Bảng Dự toán,Tất cả người dùng,Mở rộng danh sách chi tiết các đợt ĐXMS đã tạo gắn với hạng mục thiết bị.

Gửi Rà soát Tồn kho,Lập ĐXMS,Đơn vị đề xuất,Đẩy danh mục đề xuất sang Bộ phận Kho/Tài sản để rà soát WMS.

Xác nhận Tồn kho,Màn hình Kho,Chỉ huy Kho / QLTS,"Ký duyệt biên bản rà soát tồn kho, chốt số lượng thực tế cần đặt mua sắm."

Ghi lại,Thẩm định CQCM,Cán bộ CQCM,"Lưu tạm thông tin nhận xét/comment, hồ sơ giữ nguyên trạng thái Đang thẩm định."

Đồng ý,Thẩm định CQCM,Chỉ huy CQCM,"Chốt kết quả thẩm định đạt (OK), hệ thống chuyển hồ sơ sang bước tổng hợp/trình ký BM-05 hoặc BM-09."

Yêu cầu sửa,Thẩm định CQCM,Cán bộ/Chỉ huy CQCM,"Chốt kết quả không đạt (Not OK), hệ thống tóm tắt nội dung lỗi và trả hồ sơ về ĐVĐX để giải trình (BM-02)."

Hủy thẩm định,Thẩm định CQCM,Chỉ huy CQCM,Hủy đợt thẩm định hiện tại và trả hồ sơ về bước khởi tạo do không đủ điều kiện tối thiểu.

#### 7. Kết luận & Bước tiếp theo

Bản tổng hợp trên đã cụ thể hóa toàn bộ các yêu cầu chỉnh sửa và bổ sung đối với Prototype Đề xuất mua sắm (ĐXMS) dựa trên các cuộc họp nghiệp vụ giữa BA VTIT và đại diện VHT.

\- Prototype theo quy trình MS-01:

1.  Đơn vị đề xuất khởi tạo ĐXMS, chọn tài liệu đầu vào làm căn cứ.

2.  Hệ thống lấy dữ liệu kế hoạch/eBOM/mBOM. AI gợi ý thông tin cơ bản, người dùng rà soát và xác nhận.

3.  Bóc tách căn cứ đến từng dòng/hạng mục. Hệ thống kiểm tra dữ liệu Dự toán, eBOM, mBOM và tồn kho, trừ phần đã dùng hoặc đang bị giữ cho luồng khác.

4.  **Chuyển sang Kho** để rà soát tồn kho (sổ sách và thực tế), đơn vị nhận kết quả RSTK.

5.  Phần thiếu sau RSTK là cơ sở lập yêu cầu báo giá. Hệ thống gửi báo giá tới nhà cung cấp. Nếu báo giá chưa đạt thì quay lại bước gửi/lấy báo giá.

6.  Báo giá đạt thì xác định giá trị ĐXMS và phân luồng (≥ 160 tỷ dùng BM-01 + Checklist 01, \< 160 tỷ dùng BM-09 + Checklist 02), rồi lập dự thảo Tờ trình.

7.  Kiểm duyệt cấp đơn vị, chọn CQCM, TTMS xác nhận danh sách, CQCM thẩm định bằng BM-04
