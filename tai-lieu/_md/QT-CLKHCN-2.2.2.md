<!-- pk-source: 03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Tài liệu VHT gửi/Khối 1/Quy trình/Quy trình khác/QT.VHT.CLKHCN.2.2.2_QT Thiet ke và che tao mãu phan cung.pdf -->
<!-- pk-sha256: 729d12bb6d24897b7917507d5acaea3ee3eac6ca96676ee20fbf3ca967870736 -->
<!-- pk-generated: 2026-11-16 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# QT-CLKHCN-2.2.2 — bản đọc máy sinh

> Nguồn: `project-knowledge/03. Thiết kế (Tài liệu BA)/Quản lý sản xuất/02. Tài liệu BA-20261116T071237Z-1-001/02. Tài liệu BA/Tài liệu VHT gửi/Khối 1/Quy trình/Quy trình khác/QT.VHT.CLKHCN.2.2.2_QT Thiet ke và che tao mãu phan cung.pdf`. Trích dẫn thì ghi mã **QT-CLKHCN-2.2.2** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.


<!-- trang 1 -->
```text
      Số và ký hiệu: QT.VHT.CLKHCN.38                TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                           Mã hiệu: QT.VHT.CLKHCN.2.2.2_09:46ky, a da 09/
      Ngày đến: 17/09/2024                                                                                                           Ngàycó hiệu lực: 20/09/2024
                                                        QUY TRÌNH THIẾT KẾ VÀ CHẾ                                                    Lần ban hành: 4
                                                             TẠO MẪU PHẦN CỨNG                                                       Trang: 1/17

                                                                  BẢNG THEO DÕI SỬA ĐỔI                                              hi T                        uyen V
                                                                                                                                       hao                            uH
                                                                                                                                     _Bui T
                          STT Trang                               Nội dung bổ sung, sửa đổi                                          Ngày có hiệu lực

                                1                         Đổi tên và mã Quy trình phù hợp Khung                                            m do
                                                                                                                                              c Ng
                                                          Quy trình                                            466141

                                                          Điều chỉnh biểu tượng trong lưu đồ quy                                     Tong G
                                                                                                                                          ia
                                2                         trình theo đúng guideline hướng dẫn vẽ

                                                          lưu đồ

                                                          Điều chỉnh phương pháp đánh giá KPI
                                                                                         1/2026                7:53:01
                                                          tuân thủ quy trình để tăng thời gian,

                                                          kiểm soát chất lượng nghiên cứu, thiết

                                3                         kế, chế tạo sản phẩm, bằng việc tăng tỉ      /2024
                                                                                       u Ha da 6 09/1      1
                                                          trọng đánh giá hoàn thành các bước

                                                          nghiên cứu, thiết kế, chế tạo theo thực tế ky, 17/0
                                                                                 o_09:4                   9
                                                          vận hành.

                                                                     hi Tha      Nguyen
                                                                  Tong G _Bui T       V

                                                          466141               iam
                                                                                  doc

                                              7/09/20 26  :01
                                                        24 17:53
                                   /11/20               Biên soạn                      Kiểm tra                                      Phê duyệt

                   c Nguye o_09:Chữ kýn Vu 46 H 09a da kyDương Thị Anh
                                                 ,1         Thư

        Thi
          Tha

466141_ T B on uig Giam
                      do

                                              Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 2 -->
```text
      Số và ký hiệu: QT.VHT.CLKHCN.38                TCTCÔNGNGHIỆPCÔNGNGHỆCAOVIETTEL Mãhiệu:QT.VHT.CLKHCN.2.2.2                                                       ky, a da 09/
      Ngày đến: 17/09/2024                                                                                                                                      _09:46
                                                                                                                                     Ngàycó hiệu lực: 20/09/2024
                                                        QUY TRÌNH THIẾT KẾ VÀ CHẾ                                                    Lần ban hành: 4
                                                             TẠO MẪU PHẦN CỨNG                                                       Trang: 2/17

                                                                   TÓM TẮT QUY TRÌNH                                                 hi T                       uyen V
                                                                                                                                       hao                           uH
                          1. Mục đích:                                                                                               _Bui T

                              Quy trình hướng dẫn các bước cần thực hiện, các dữ liệu và các tài liệu cần                                  m do
                          xây dựng trong quá trình thiết kế module phần cứng (module mạch điện tử,                                            c Ng
                          module điện - điều khiển, module thông tin mạng) nhằm đảm bảo chất lượng sản
                          phẩm nghiên cứu và lưu trữ lại tri thức...
                                                                                                               466141                Tong G
                          2. Phạm vi và đối tượng áp dụng                                                                                 ia

                          2.1 Phạm vi áp dụng

                              - Quy trình mô tả vòng đời thiết kế phần cứng (module mạch điện tử,
                          module điện - điều khiển, module thông tin mạng), và các dữ liệu tạo ra trong
                          quá trình thiết kế phần cứng.
                                                                                         1/2026                7:53:01
                                                                                                       /2024
                                                                                                           1
                                - Áp dụng trong toàn Tổng Công ty công nghiệp công nghệ cao Viettel.
                                                                                       u Ha da 6 09/1
                          2.2 Đối tượng áp dụng                                                      ky, 17/0
                                                                                                          9
                              - Áp dụng cho tất cả các kỹ sư tham gia các hạng mục thiết kế phần cứng
                          thuộc các đề tài, dự án trong toàn Tổng Công ty công nghiệp công nghệ cao Viettel.
                                                                                 o_09:4
                              - Áp dụng cho toàn bộ các thiết kế phần cứng. PM sẽ đánh giá mức độ
                          phức tạp của đầu bài thiết kế để lựa chon quy trình thiết kế phần cứng đầy đủ
                          hoặc quy trình thiết kế rút gọn.
                                                                   hi Tha        Nguyen
                                                                  Tong G _Bui T       V
                          3. Tóm tắt Quy trình:

                               PM đánh giá mức độ phức tạp của mạch, hệ thống phần cứng của đầu bàiiam
                          thiết kế để lựa chọn quy trình thực hiện là quy trình thiết kế đầy đủ hay quy trìnhdoc
                          thiết kế rút gọn. Quy trình thiết kế đầy đủ gồm 12 bước với 03 vai trò chính:
                                                          466141
                                        Tên vai trò/ đơn vị                    Bước    Các bước chịu trách nhiệm thực hiện
                                PM/Kỹ sư thiết kế hệ thống7/09/20 26:01          1                           Tên bước
                                                        24 17:53                 2
                                Kỹ sư thiết kế phần cứng/11/20                  3.2    Lập kế hoạch thiết kế phần cứng
                                n Vu 46 H 09Kỹ sư kiểm tra thiết kế phần cứng   3.1    Xây dựng yêu cầu thiết kế phần cứng
                   c Nguye o_09:            a da ky                             4.1    Kiểm tra thiết kế kiến trúc phần cứng
                                                 ,1                             4.2    Thiết kế kiến trúc phần cứng
                                                                                4.4    Phân tích, lựa chọn giải pháp và linh kiện chính
        Thi                                                                     4.6    Thiết kế schematic
          Tha                                                                    5     Thiết kế PCB
                                                                                       Hoàn thiện và trình phê duyệt tài liệu thiết kế
                                                                                 6     Chế tạo bộ mẫu
                                                                                       Kiểm tra và báo cáo kết quả kiểm tra tính năng,
                                                                                4.3    đo kiểm CTKT và bring-up
                                                                                4.5    Kiểm tra thiết kế schematic
                                                                                       Kiểm tra thiết kế PCB

466141_ T B on uig Giam
                      do

                                              Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 3 -->
```text
      Số và ký hiệu: QT.VHT.CLKHCN.38                          TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                        Mã hiệu: QT.VHT.CLKHCN.2.2.2_09:46ky, a da 09/
      Ngày đến: 17/09/2024                                                                                                                  Ngàycó hiệu lực: 20/09/2024
                                                                  QUY TRÌNH THIẾT KẾ VÀ CHẾ                                                 Lần ban hành: 4
                                                                       TẠO MẪU PHẦN CỨNG                                                    Trang: 3/17

                                                                         NỘI DUNG QUY TRÌNH                                                 hi T                        uyen V
                                                                                                                                              hao                            uH
                          1. Mục đích:

                              Quy trình hướng dẫn các bước cần thực hiện, các dữ liệu và các tài liệu cần                                   _Bui Tm do
                          xây dựng trong quá trình thiết kế module phần cứng (module mạch điện tử,                                                   c Ng
                          module điện - điều khiển, module thông tin mạng) nhằm đảm bảo chất lượng sản
                          phẩm nghiên cứu và lưu trữ lại tri thức...
                                                                                                                      466141
                          2. Phạm vi và đối tượng áp dụng                                                                                   Tong G
                                                                                                                                                 ia
                          2.1 Phạm vi áp dụng
                              - Quy trình mô tả vòng đời thiết kế phần cứng (module mạch điện tử,1/2026               7:53:01

                          module điện - điều khiển, module thông tin mạng), và các dữ liệu tạo ra trong
                          quá trình thiết kế phần cứng.

                              - Áp dụng trong toàn Tổng Công ty công nghiệp công nghệ cao Viettel.
                                                                                              u Ha da 6 09/1  /2024
                                                                                                                  1
                          2.2 Đối tượng áp dụng                                                             ky, 17/0
                                                                                        o_09:4                   9
                              - Áp dụng cho tất cả các kỹ sư tham gia các hạng mục thiết kế phần cứng
                          thuộc các đề tài, dự án trong toàn Tổng Công ty công nghiệp công nghệ cao Viettel.

                              - Áp dụng cho toàn bộ các thiết kế phần cứng. PM sẽ đánh giá mức độ
                          phức tạp của đầu bài thiết kế để lựa chon quy trình thiết kế phần cứng đầy đủ
                          hoặc quy trình thiết kế rút gọn.
                                                                         hi Tha         Nguyen
                                                                                             V
                          3. Tài liệu liên quan:
                          4. Giải thích thuật ngữ, định nghĩa, khái niệm và từ viết tắt:
                                                                         Tong G _Bui T
                            Viết tắt                             Đầy đủ466141         iam                           Giải thích
                          PM                         Product Manager                     doc  Chủ nhiệm đề tài/dự án/nhiệm vụ
                          KS                         Kỹ sư
                          BOM                        Bill Of Material                         Danh mục vật tư linh kiện

                          LIB                        Library                                  Thư viện sử dụng trong project PCB

                                PCB                  7/09/20 26Printed Circuit Board:01       Sơ đồ mạch in
                                SCH                            Schematic24 17:53              Sơ đồ mạch nguyên lý
                                CTKT   /11/20                  Chỉ tiêu kỹ thuật
                                TKHT   n Vu 46 H 09            Thiết kế hệ thống              Đơn vị/cá nhân chịu trách nhiệm cuối cùng về
                   c Nguye o_09:TKPC               a da ky     Thiết kế phần cứng             việc hoàn thành hoạt động được thực hiện
                                KT TKPC                 ,1     Kiểm tra thiết kế phần cứng    đúng quy trình và yêu cầu, có quyền ra quyết
                                                                                              định và phê duyệt liên quan đến hoạt động
        Thi                     A                              Accountable                    Đơn vị/cá nhân cung cấp thông tin và tư vấn
          Tha                                                                                 hỗ trợ trước và trong quá trình thực hiện hoạt
                                C                              Consulted                      động
      _ T B on uig Giam                                                                       Đơn vị/cá nhân được thông báo thông tin sau
                      do        I                              Informed

466141                                               Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 4 -->
```text
      Số và ký hiệu: QT.VHT.CLKHCN.38                TCTCÔNGNGHIỆPCÔNGNGHỆCAOVIETTEL Mãhiệu:QT.VHT.CLKHCN.2.2.2                                                       ky, a da 09/
      Ngày đến: 17/09/2024                                                                                                                                      _09:46
                                                        QUY TRÌNH THIẾT KẾ VÀ CHẾ                                                    Ngàycó hiệu lực: 20/09/2024
                            Viết tắt                         TẠO MẪU PHẦN CỨNG                                                       Lần ban hành: 4
                                                                                                                                     Trang: 4/17
                                                                                                                                     hi T
                                                          Đầy đủ                                             Giải thích                hao                      uyen V
                                                                                       khi hoạt động được thực hiện                                                  uH

                          R                   Responsible                              Đơn vị/cá nhân chủ trì thực hiện hoạt động
                                                                                                                                     _Bui T
                                                                                       Đơn vị/cá nhân tạo điều kiện, hỗ trợ thực hiện
                                                                                       hoạt động
                          S                   Support                                                                                      m do
                                                                                                                                              c Ng
                                                                                                               466141
                          KPIs Key Performance Indicators Là các tiêu chí, chỉ số đánh giá và đo lường
                                                                                việc thực hiện quy trình
                                                                                                                                     Tong G
                          5. Nội dung quy trình                                                                                           ia

                          5.1 Sự kiện bắt đầu và sự kiện kết thúc quy trình              1/2026                7:53:01
                                                                                                       /2024
                              - Sự kiện bắt đầu: Nhận được yêu cầu thiết kế phần cứng cho sản phẩm từ      1
                          chủ nhiệm dự án/sản phẩm.

                              - Sự kiến kết thúc: Chế tạo bo mạch mẫu, hoàn thành kiểm tra đánh giá chỉ
                          tiêu kỹ thuật bo mạch, hoàn thành các tài liệu chuyển giao tích hợp hệ thống và
                          chuẩn bị sản xuất
                                                                                       u Ha da 6 09/1
                          5.2 Đầu vào và đầu ra của quy trình                    o_09:4              ky, 17/0
                              - Đầu vào quy trình:                                                        9

                                             Kế hoạch phát triển sản phẩm
                                                                  hi Tha
                                             Tính năng và chỉ tiêu kỹ thuật của sản phẩm
                                                                                 Nguyen
                                     Thiết kế sơ bộ của sản phẩm                     V
                                - Đầu ra quy trình:
                                                                  Tong G _Bui T
                          TT                                                   iam                                                   Ghi chú
                                                                                  doc
                                                                  Tên tài liệu/dữ liệu
                                                          466141
                                I Tài liệu thiết kế

                                1 Kế hoạch thiết kế phần cứng

                                2 Tài liệu yêu cầu thiết kế phần cứng

                                3 Tài liệu thiết kế kiến trúc:01                                                                     Nếu áp dụng QT
                                4 Tài liệu phân tích thiết kế                                                                        đầy đủ
                                5 Tài liệu thiết kế chi tiết
                                  /11/20      7/09/20 2624 17:53
                                8 Tài liệu hướng dẫn bring-up bo mạch, kiểm tra tính năng và
                                     chỉ tiêu kỹ thuật mức mạch
                                n Vu 46 H 09
                                9 Báo cáo bring-up, kiểm tra tính năng và chỉ tiêu kỹ thuật

                   c Nguye o_09:            a da ky                                                                                  Nếu áp dụng QT
                                                 ,1                                                                                  rút gọn
                                10 Tài liệu thiết kế phần cứng rút gọn

        Thi                     II Dữ liệu thiết kế
          Tha                    1 PCB project
                                 2 PCB FABRICATION
      _ T B on ui               2.1 Gerber

466141           g Giam
                      do

                                              Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 5 -->
```text
      Số và ký hiệu: QT.VHT.CLKHCN.38                TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                           Mã hiệu: QT.VHT.CLKHCN.2.2.2_09:46ky, a da 09/
      Ngày đến: 17/09/2024                                                                                                           Ngàycó hiệu lực: 20/09/2024
                                                        QUY TRÌNH THIẾT KẾ VÀ CHẾ                                                    Lần ban hành: 4
                                                             TẠO MẪU PHẦN CỨNG                                                       Trang: 5/17

                          TT                                                                                                         hi T
                                                                                                                                       hao
                                                                  Tên tài liệu/dữ liệu                                               Ghi chú                     uyen V
                                                                                                                                                                      uH
                          2.2 NCDrill

                          2.3 Stackup, Fab-note                                                                                      _Bui T

                                3 PCB ASSEMBLY                                                                                             m do
                                                                                                                                              c Ng
                          3.1 X-Y data (pick and place)                                                        466141

                          3.2 Assembly Drawing                                                                                       Tong G
                                                                                                                                          ia
                          3.3 3D MCAD

                          3.4 BOM                                                                                                    Nếu có

                          III Tài liệu khác

                                                                                         1/2026
                                1 Tài liệu yêu cầu phần mềm bring-up và kiểm tra tính năng Nếu có
                                                                                                               7:53:01
                                2 Tài liệu yêu cầu về cơ khí                                                                         Nếu có

                          III Checklist kiểm tra kỹ thuật                              u Ha da 6 09/1  /2024                         Checklist
                                                                                                           1
                                1 Checklist kiểm tra yêu cầu thiết kế phần cứng

                                2 Checklist kiểm tra thiết kế kiến trúc                              ky, 17/0
                                                                                 o_09:4                   9
                                3 Checklist kiểm tra schematic

                                4 Checklist kiểm tra BOM

                                5 Checklist kiểm tra PCB          hi Tha

                          IV Sản phẩm mẫu                                        Nguyen
                                                                                      V
                                                                  Tong G _Bui T
                                                          466141               iam
                                                                                  doc

                                              7/09/20 26  :01
                                                        24 17:53
                                  /11/20
                                n Vu 46 H 09
                   c Nguye o_09:            a da ky
                                                 ,1

        Thi
          Tha

466141_ T B on uig Giam
                      do

                                              Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 6 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                    TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                                                                                                              Mã hiệu: QT.VHT.CLKHCN.2.2.2 46                                                 09/
Ngày đến: 17/09/2024                                                                                                                  QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                                                                                              Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                                                                                                                                                                                                                                                             hao a _ da        ky, 17/
                                                                                                                                                                                                                                                                                                                               Lần ban hành: 4

                                                                                                                                                                                                                                                                                                                               Trang:6/17                          hi T Vu H

5.3 Lưu đồ quy trình                                                                                                                                                                                                                                                                                                                                               ui T guyen
a. Quy trình đầy đủ                                                                                                                                                                                                                                                                                                                                                _B c N
                                                               PM hoặc KS thiết                                                                                                                                                                                                                                                6141                                  m do NOK Phê duyệt? OK
                                                                                           NOK Phê duyệt?kế hệ thống               NOK Phê duyệt? OK                                                                                                                                                                                                               Gia
                                                                                                                     OK

                                                                                                                                                                                                                                                                                                                               46 ng                                                         - Sản phẩm HW
                                                                                                                                                                                                                                                                                                                                                                                             - Bộ TL thiết kế

                                                               Trưởng nhóm thiết kế phần cứng                                                   OK                                                                                                                                                                             To                                  OK
                                                                                                                                   NOK Kiểm tra?
                                                                                                                                                                                                                                                                                                                                                                   NOK Ký duyệt?

QUY TRÌNH THIẾT KẾ CHI TIẾT VÀ CHẾ TẠO MẪU PHẦN CỨNG (ĐẦY ĐỦ)                                  1. Lập kế hoạch  2. Xây dựng yêu    3.2. Kiểm tra thiết                    /11/202264 17:53:01 4.1.Phântích,lựaNOK Kiểm tra? OK                                                                            NOK Phê duyệt? OK
                                                                                                thiết kế phần   cầu thiết kế phần  kế kiến trúc phần                      9 0 chọn giải pháp và
                                                                                                                                                                          0 /2 linh kiện chính
                                                                                                     cứng              cứng                cứng                           9:46 , 17/09 Tàiliệuphântích

                                                                                                                                   3.1. Thiết kế kiến                       y thiết kế
                                                               KS thiết kế phần cứng                                                trúc phần cứng                                          4.2. Thiết kế                                                                                                                                                          6. Kiểm tra và báo
                                                                                                                                                                                             schematic                                                                                                                                                             cáo kết quả kiểm
                                                                                                                                                       Tài liệu thiết kế                                                                                                                                                                                           tra tính năng, đo
                                                                                                                                                           kiến trúc                                                         Tài liệu phân tích
                                                                                                                                                                                                                             thiết kế                                                                                                                                kiểm CTKT và
                                                                                                                                                                                                                              SCH, BOM                                                                                                                                  bring-up
                                                                                                                                                                           i Thi Thauyoe_n0Vu Ha da k 4.3.Kiểmtrathiết                                          4.4. Thiết kế PCB                         4.6. Hoàn thiện và   5. Chế tạo bộ mẫu
                                                                                                                                                                                                                                                                                                          trình phê duyệt tài
                                                                                                                                                                                g kế schematic,
                                                                                                                                                                                                                                                                                                              liệu thiết kế
                                                                                                                                                                          u N BOM
                                                                                                                                                                                                                                                                                     Tài liệu yêu cầu về                       -TL thiết kế chi tiết
                                                                                                                                                                                                                                                                                     cơ khí (shield)                           - TL HD bring-up bo mạch, kiểm tra
                                                                                                                                                                                                                                                                                                                               tính năng và đo kiểm CTKT
                                                                                                                                                                                                                                                                                     PCB, HS gia công
                                                                                                                                                                                                                                                                                     3D MCAD

                                                               KS kiểm tra thiết kế phần cứng                                                                                                                                                    Không đạt      4.5. Kiểm tra thiết  Không đạt
                                                                                                                                                                                                                                                  Kết quả? Đạt        kế PCB          Kết quả? Đạt
                                                                                                                                                                                 _B doc - Checklist kiểm traschmatic
                                                                                                                                                                          466141Tong Giam -ChecklistBOM

                                                                                                                                   /20 1 2 7 6 :53:01
                                                                                                                 09/1 9/ 1 2024
                                                                                                                :46 y, 17/0
                                                                                               o_09 a da k
                                                                                               i T e h n a Vu H
ui T c N h guy
41_ i B am do
4661 Tong G
                                                                                                                                   Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 7 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                     TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                                        Mã hiệu: QT.VHT.CLKHCN.2.2.2 46                              09/
Ngày đến: 17/09/2024                                                                                                   QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                        Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                                                                                                                                     ha H o a _ da                     ky, 17/
                                                                                                                                                                                                                                          Lần ban hành: 4

b. Quy trình rút gọn                                                                                                                                                                                                                      Trang:7/17 i Thi T Vu yen

                                                                          PM hoặc KS thiết                                                                                                                                                _B NOK Phê duyệt? OK oc Nugu
                                                                             kế hệ thống                                                                                                                                                     41 d
                                                                                                                                NOK Phê duyệt? OK

                                                                                                                                                                                                                                          66 g 1 Giam                  - Sản phẩm HW
                                                                                                                                                                                                                                          4 Ton                        - Bộ TL thiết kế

          QUY TRÌNH THIẾT KẾ CHI TIẾT VÀ CHẾ TẠO MẪU PHẦN CỨNG (RÚT GỌN)  Trưởng nhóm thiết kế phần cứng  1. Lập kế hoạch  2. Xây dựng yêu                                                    1/2 1 0 7 2 :5 6 3:01                                     OK
                                                                                                           thiết kế phần                                       NOK Kết quả? 09O/1K /2024                                                  NOK Ký duyệt?
                                                                                                                           cầu thiết kế phần                        :46 17/09
                                                                                                                cứng              cứng                                                                                                         6. Kiểm tra và báo
                                                                                                                                                                                                                                                cáo kết quả kiểm
                                                                                                                                                               hao_04. Kiểm tra th 9 aiếtky,                                                    tra tính năng, đo

                                                                                                                                                                           d                                                                      kiểm CTKT và
                                                                                                                                                                    kế phầnacứng                                                                     bring-up
                                                                                                                                                                       H
                                                                                                                                                   hi T en Vu
                                                                                                                                                   ui T Nguy
                                                                                                                                              41 i _ am B doc
                                                                          KS thiết kế phần cứng                                 4661 ng G                           3. Thiết kế phần                                   5. Chế tạo bộ mẫu
                                                                                                                                                                          cứng
                                                                                                                                              To

                                                                                                                           026 :53:01                                                 - Yêu cầu cơ khí chasis, outline, sheild                                     -TL thiết kế chi tiết
                                                                                                                                                                                      - Yêu cầ phần mềm bring-up                                                   - TL HD bring-up bo mạch, kiểm tra
                                                                                                                                                                                                                                                                   tính năng và đo kiểm CTKT

                                                                                                                    11/2 24 17
                                                                                                                    09/ /09/20
                                                                                                          :46 y, 17
                                                                                                          _09 da k
                                                                                                          hao u Ha
                                                                          i T en V
          Th guy
Bu d i oc N
141 G _ iam
466 Tong
                                                                                                                                Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 8 -->
```text
                                      TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                               Mã hiệu: QT.VHT.CLKHCN.2.2.2 46                09/

Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                                    Ngày có hiệu lực: 20/09/2024 09: , 17               /
Ngày đến: 17/09/2024
                                                                                                                                                                               o_ a ky
                                      QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                  Lần ban hành: 4  hi n T V h u Haa           d

                                                                                                                                                   Trang:8/17

5.4 Thuyết minh quy trình                                                                                                                                      Bui T Nguye

a. Quy trình đầy đủ                                                                                                                                       141_        doc
                                                                                                                                                                    m Đầu ra
          TT Hoạt động chính Thực hiện                  Mô tả chi tiết                                                                   Đầu vào
                                                                                                                                         (e) 46 n 6 g Gi (f) a
          (a)  (b)                    (c)                                    (d)                                                                          To

                                             - Xác định cơ cấu và vai trò trách nhiệm của Kỹ sư Yêu cầu thiết kế bao gồm: Đầu

          1 Lập kế hoạch thiết Trưởng nhóm thiết kế                                                   vào, đầu r6a, công nghệ (nếu Cây công việc trên công cụ
               kế phần cứng           TKPC   - Xác định các mốc thời gian chính                       có), ki0nh2phí thự3c:0h1iện, thời QLSX
                                                                                                      gia1n/b2ắt                         và7k:ế5t
                                             - Xây dựng cây công việc trên công cụ QLSX                                             đầu  1         thúc.
                                                                                                      /1 24
                                             - Từ tính năng và chỉ tiêu kỹ thuật của sản phẩm09                                     /20
                                             xác định các tính năng và chỉ tiêu kỹ thuật6của /09
                                                                                       9 :4           - 1T7ài liệu tính năng và chỉ tiêu PM/KS TKHT phê duyệt:,
               Xây dựng yêu cầu Trưởng nhóm  phần cứng                                0      ky kỹ thuật của sản phẩm
          2 thiết kế phần cứng TKPC          - Biên soạn và trình PM/KS TKHT phê_duyệt: da                                                                     Tài liệu yêu cầu thiết kế phần
                                                                                  ao
                                             + Nếu OK: Chuyển sang Bướch3.1.              Ha - Thiết kế sơ bộ của sản phẩm cứng
                                             + Nếu NOK: Quay lại thựcihTiện Bước V2.u
                                                              h en
          3 Thiết kế kiến trúc                          ui T Nguy
                                             - Xây dựng sơ đồ_kBhối phầndcoứcng
                                             - Định nghĩa41các giaioamdiện kết nối giữa các
                                              khối/mô6đ1un/bo mgạcGh
          3.1 Thiết kế kiến trúc KS TKPC     - Xác 4đ6ịnh tínhTonnăng, chỉ tiêu kỹ thuật cho từng 2(f)                                                         Tài liệu thiết kế kiến trúc
               phần cứng
                                             khối/mô đun/bo mạch

                                      1/20         - Phản h1ồi lại những thiếu sót cho bước xây dựng

                                             26 yê5u3:c0ầu thiết kế phần cứng
                                                7:
                                             4 X1 ây dựng checklist và thực hiện kiểm tra thiết kế                                                             - Kết quả kiểm tra thiết kế
               Kiểm tra thiết kế Tr/ư1ởng nh2ó0m2 kiến trúc theo checklist.                                                                                      kiến trúc theo checklist.
          3.2 kiến trúc phần cứng 0T9KPC /09/ - Nếu OK: Chuyển sang Bước 4.1                          2(f), 3.1(f)
                             9:4 k 6 y, 17                                                                                                                     PM/KS TKHT phê duyệt:
          4 Thiết kế c_hi0tiết da            - Nếu NOK: Quay lại Bước 3.1                                                                                      - Tài liệu thiết kế kiến trúc

                  ao Ha                      - Dựa vào kiến trúc hệ thống phần cứng và chỉ tiêu                                                                Trưởng nhóm TKPC phê
               PhTânhtích, lựaVcuhọn           kỹ thuật yêu cầu:                                                                                               duyệt:
          4.1 higiải phápyenvà linh KS TKPC                                                           3.2(f)                                                   - Tài liệu phân tích giải
          i T kiện Nchgíunh                  + Lựa chọn giải pháp kỹ thuật
                                                                                                                                                                 pháp thiết kế bo mạch
Bu doc                                       + Lựa chọn các IC chính

141 G _ iam
466 Tong
                                             Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 9 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38              TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                                 Mã hiệu: QT.VHT.CLKHCN.2.2.2 46   09/
Ngày đến: 17/09/2024                                                                                                                                        Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                                             Tha H o a _ da   ky, 17/
                                             QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                    Lần ban hành: 4
                                                                                                                                                            Trang:9/17
                                                                                                                                                                              hi Vu
TT Hoạt động chính                           Thực hiện                        Mô tả chi tiết                                                     Đầu vào    Bui              T Đầu ra en
                                                                                                                                                                              guy
(a)  (b)                                            (c)                       (d)                                                                      (e)  14 i 1 am _ doc  (Nf)

                                                          + Thực hiện nghiên cứu đánh giá giải pháp có                                                      466 Tong G
                                                             thể sử dụng các phương pháp: mô phỏng, thử

                                                          nghiệm trên kit phát triển, chế tạo mô đun nhỏ
                                                          để thử nghiệm,...

                                                          + Phản hồi lại những thiếu sót cho các bước thiết                       1/2 1 0 7 2 :5 6 3:01

                                                                kế kiến trúc, hoặc xây dựng yêu cầu phần cứng
                                                                (nếu có)
                                                          - Xây dựng tài liệu phân tích giải pháp thiết kế bo
                                                          + Nếu OK: Chuyển sang Bước 4.2 6 mạch trình Trưởng nhóm TKPC phê duyệt: 0 / 9 09 / / 1 2024
                                                          - Thực hiện vẽ mạch nguyên lý _ + Nếu NOK: Thực hiện lại Bước 4.1 09:4   ky, 17
                                                          - Viết tài liệu yêu cầu cho chhưaơnog trìnhHaphdần                      a
                                                           mềm/FPGA phục vụ bring-uipT, kiểm traVchuức năng
                                                          và chỉ tiêu của mạch (nếTu hcó) yen                                                               - Schematic
                     4.2 Thiết kế schematic  KS TKPC      - Gửi tài liệu và thốunig nhất yNêugucầu phần mềm 4.1(f)
                                                                                                                                                            - BOM
                     4.3 Kiểm tra thiết kế                bring-up với Kỹ_sBư phần mdềomc/FPGA
                            schematic                     - Phản hồi lạ4i 1những thiaimếu sót cho các bước phía
                                                           trước (nế6u1có) g G
                   ao_09:46Ha                             - Xây4dự6ng cheTckolnist kiểm tra giải pháp thiết kế và
                Th Vu                                     sơ đồ Schematic
           4.4 iThiết kế PCenB
            Th guy                                         6 - Kiểm01tra BOM (kiểm tra chéo trong nhóm kỹ sư
      1_B am u d i oc N                                  02 th:5iế3t: kế)
 6614 ong Gi                                 KS K1T/2TKPC 4 -17Thực hiện kiểm tra và ghi kết quả vào checklist                    4.1(f), 4.2(f)            - Checklist kiểm tra Schematic
4T                                           /1          202 kiểm tra.                                                                                      - Checklist BOM
                                             09 , 17/09/
                                             da ky        + Nếu OK: Chuyển sang Bước 4.4.                                                                   - PCB
                                                          + Nếu NOK: Tổ chức họp với kỹ sư thiết kế phân

                                                          tích lỗi và quay lại Bước 4.2

                                                          - Thực hiện layout

                                             KS TKPC      - Viết tài liệu yêu cầu về cơ khí (ví dụ: yêu cầu về 4.2(f), 4.3(f)                               - Hồ sơ gia công: Gerber,
                                                            shield cho bo mạch)                                                                               Pick& Place, Assembly

                                                          - Gửi tài liệu và thống nhất yêu cầu về cơ khí với                                                Drawing, Stack up, BOM.

                                                          Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 10 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38                  TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                                     Mã hiệu: QT.VHT.CLKHCN.2.2.2 46      09/
Ngày đến: 17/09/2024                                QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                     Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                                                     Tha H o a _ da      ky, 17/
                                                                                                                                                                    Lần ban hành: 4
                                                                                                                                                                    Trang:10/17       hi Vu
                                                                                                                                                                                     T Đầu ra en
TT Hoạt động chính                               Thực hiện                                 Mô tả chi tiết                                                  Đầu vào      Bui           guy
                                                     (c)                                                                                                      (e)                    (Nf)
(a)  (b)                                                                                         (d)                                                                    1_- Tài liệduoycêu cầu kỹ thuật
                                                                      kỹ sư thiết kế cơ khí
                                                                    - Phản hồi lại những thiếu sót cho các bước phía                                                46614 giaiacmông bo mạch
                                                                      trước (nếu có)                                                                                    -g 3GD MCAD
                                                                                                                                                                        Ton- Tài liệu yêu cầu về cơ khí

                     4.5 Kiểm tra thiết kế                          - Xây dựng checklist kiểm tra                                 /20 7 2 :5 6 3:01                       shield (nếu có)
                            PCB                                     - Thực hiện kiểm tra và ghi kết quả vào checklist           -1S1chematic4 1
                                                   KS KT TKPC                                                        09/- PCB /202                                      Checklist kiểm tra PCB
                            Hoàn thiện và trình    KS TKPC            kiểm tra.
                     4.6 phê duyệt tài liệu                                                                                                                             Trưởng nhóm TKPC phê
                                                  KS TKPC 26           + Nếu Đạt: Chuyển sang Bước 4.6.                                                                 duyệt:
                            thiết kế                  /20              + Nếu Không đạt: Tổ chức họp với kỹ sư th4iế6t kế 7/09                                           - Tài liệu thiết kế chi tiết
                                                                       phân tích lỗi và quay lại Bước 4.2 _09: a ky, 1                                                  - Tài liệu hướng dẫn bring-
                      5 Chế tạo bộ mẫu           09/ 0 1 9/ 1 2024  - Viết tài liệu hướng dẫn bring-up aboomạch vàaddẫn
                                                                     kiểm tra và đo kiểm chỉ tiêu kTỹ thhuật mứcumHạchiV        - Yêu cầu tính năng và CTKT               up bo mạch và dẫn kiểm
               Kiểm tra và báo:4cá6o                ky, 17/         - Hoàn thiện tài liệu thiết kế chhi tiết phầnecnứng đã được của mạch                                  tra và đo kiểm chỉ tiêu kỹ
               kết quả _k0iể9m tra               daKS TKPC             thực hiện ở bước đầu tiiênT: Cập nhậgtusychematic, PCB,                                            thuật mức mạch
            6 tính naănog, đo kiểHma                                   bổ sung phân tích đánuh giá (nếu cNần)                   - Tài liệu thiết kế chi tiết
               CTTKhT và brinVg-uup                                                 _B        c                                                                         Bo mạch
           i T N h g i uyen                                         -  Trình  Trưởng1nhóm  TKPCdpohê  duyệt:                    - Schematic
    41_ i B am u doc                                                   + Nếu OK1:4ChuyểnGsiaanmg Bước 5.                                                                PM/KS TKHT phê duyệt:
4661 Tong G                                                            + N4ếu6N6OK: Tohnựgc hiện lại Bước 4.6                   - PCB                                   - Báo cáo bring-up, kiểm
                                                                                                                                                                        tra tính năng và CTKT
                                                                              T
                                                                    - Chế tạo mạch in
                                                                                                                                Hồ sơ gia công: Gerber, Pick&
                                                                    - Hàn 0lắ1p linh kiện
                                                                       3:                                                       Place, Assembly Drawing, Stack
                                                                    - P:h5ản hồi lại những thiếu sót cho các bước phía up, BOM.
                                                                    17trước (nếu có)

                                                                    - Thực hiện kiểm tra:                                       - Bo mạch
                                                                      + Thực hiện hàn lắp (nếu cần)                             - Tài liệu hướng dẫn kiểm tra
                                                                      + Thực hiện bring-up bo mạch
                                                                      + Đồng chỉnh, kiểm tra tính năng và CTKT của                và đo kiểm chỉ tiêu kỹ thuật
                                                                          bo mạch.                                                mức mạch
                                                                      + Phân tích nguyên nhân lỗi (nếu có)                      - Tài liệu hướng dẫn bring-up
                                                                      + Phản hồ lại những thiếu sót cho các bước phía             bo mạch
                                                                          trước (nếu có).                                       - Phần mềm hỗ trợ

                                                                    Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 11 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38  TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                                 Mã hiệu: QT.VHT.CLKHCN.2.2.2 46   09/
Ngày đến: 17/09/2024                                                                                                                            Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                                 Tha H o a _ da   ky, 17/
                                 QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                    Lần ban hành: 4
                                                                                                                                                Trang:11/17
                                                                                                                                                                  hi Vu
          TT Hoạt động chính     Thực hiện                    Mô tả chi tiết                                                           Đầu vào  Bui              T Đầu ra en
                                                                                                                                                                  guy
          (a)  (b)               (c)                          (d)                                                                      (e)      14 i 1 am _ doc  (Nf)

                                                Ghi chú: Kỹ sư kiểm tra có thể thực hiện kiểm tra                                               466 Tong G
                                                tính năng và chỉ tiêu độc lập với kỹ sư thiết kế, hoặc

                                                có thể xem xét kết quả kiểm tra của kỹ sư thiết kế
                                                kết hợp với các phương pháp phân tích hoặc mô

                                                phỏng để đánh giá chất lượng thiết kế                   1/2 1 0 7 2 :5 6 3:01

                                                - Biên soạn và trình báo cáo kết quả bring-up, kiểm
                                                  tra tính năng và CTKT bo mạch (qua Trưởng
                                                  nhóm TKPC kiểm tra và qua PM/KS TKHT phê
                                                + Nếu OK: Lưu trữ hồ sơ và kết thúc quy trìn6h. duyệt). 0 / 9 09 / / 1 2024
                                                 + Nếu NOK: Quay lại Bước 4.1 09: k 4 y, 17
b. Quy trình rút gọn                                                          hao H _ a da

          TT Hoạt động chính     Thực hiện                    Mô tả chi itiếTt         Vu                                              Đầu vào                   Đầu ra
                                                              Th yen
          (a)  (b)               (c) ui(d) Ngu                                                                                         (e)                       (f)

                                                - Xác định cơ cấu_vBà vai tròdtorcách nhiệm của Kỹ sư Yêu cầu thiết kế bao gồm: Đầu
          1 Lập kế hoạch thiết   Trưởng nhóm thiết kế 41      am                                        vào, đầu ra, công nghệ (nếu Cây công việc trên công cụ
               kế phần cứng      TKPC           - Xác định6c1ác mốcgthGờii gian chính                   có), kinh phí thực hiện, thời QLSX
                                                - Xây4dự6ng câyTcoônng việc trên công cụ QLSX
                                                                                                        gian bắt đầu và kết thúc.

                                                - Từ tính năng và chỉ tiêu kỹ thuật của sản phẩm
                                     26          xác3:đ0ị1nh các tính năng và chỉ tiêu kỹ thuật của
               Xây dựng yêu cầu Trưởng20nhóm    7p:h5ần cứng                                            - Tài liệu tính năng và chỉ tiêu        PM/KS TKHT phê duyệt:
          2 thiết kế phần cứng TK1PC1/                                                                                                          Tài liệu yêu cầu thiết kế phần
                             /                     1                                                      kỹ thuật của sản phẩm                 cứng
                                 6 0 17 9 /09/  24 - Biên soạn và trình PM/KS TKHT phê duyệt:           - Thiết kế sơ bộ của sản phẩm
                                              20
                                                + Nếu OK: Chuyển sang Bước 3.
               09: a 4 ky,                      + Nếu NOK: Thực hiện lại Bước 2.

               ao_ Ha d
               hi T ye h n Vu
ui T c Ngu
1_ i B am do
14 G
466 Tong
                                                Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 12 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38       TỔNG CÔNG TY CÔNG NGHIỆP CÔNG                        NGHỆ CAO VIETTEL                              Mã hiệu: QT.VHT.CLKHCN.2.2.2 46       09/
Ngày đến: 17/09/2024                     QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO                     MẪU PHẦN CỨNG                                 Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                          Tha H o a _ da       ky, 17/
                                                                                                                          Đầu vào        Lần ban hành: 4
                                                                                                                              (e)        Trang:12/17       hi Vu
                                                                                                                                                          T Đầu ra en
          TT Hoạt động chính          Thực hiện                          Mô tả chi tiết    pháp có thể                                          Bui        guy
                                          (c)                                                                                                             (Nf)
          (a)  (b)                                                             (d)                                                            1_ doc
                                                                                                                                            14 - Tài mliệu thiết kế phần
                                                  - Xây dựng sơ đồ khối phần cứng                                                        466      cGứinag rút gọn.
                                                  - Lựa chọn giải pháp kỹ thuật                                                               on-g Hướng dẫn bring-up bo
                                                  - Lựa chọn các IC chính                                                                     T mạch và dẫn kiểm tra và
                                                  - Thực hiện nghiên cứu đánh giá giải

                                                  sử dụng các phương pháp: mô phỏng, thử nghiệm              /20 7 2 :5 6 3:01                    đo kiểm chỉ tiêu kỹ thuật
                                                  trên kit phát triển, chế tạo mô đun nhỏ để thử             /11 24 1                             mức mạch.
                                                  nghiệm,...
                                                                                                                                                - BOM và các file dữ liệu
                                                  - Thực hiện vẽ mạch nguyên lý                                                                   thiết kế
                                                  - Viết tài liệu yêu cầu cho chương trình phầ0n9 9/20
                                                  mềm/FPGA phục vụ bring-up, kiểm tra chứ:c4n6ăng            Tà7i /l0iệu yêu cầu thiết kế phần  - Tài liệu yêu cầu cho chương
                                                                                                              1                                   trình phần mềm/FPGA
          3 Thiết kế phần cứng        KS TKPC     và chỉ tiêu của mạch (nếu có)            09 kyc, ứng                                            phục vụ bring-up, kiểm
                                                                                                                                                  tra chức năng và chỉ tiêu
                                                  - Thực hiện layout                 o_ da                                                        của mạch (nếu có)
                                                  - Viết tài liệu yêu cầu về cơ khí (hvaí dụ: yêuu Hcầau về
                                                   shield cho bo mạch) hi T n V                                                                 - Tài liệu yêu cầu về cơ khí
                                                  - Viết tài liệu hướng dẫinTbring-up ubyoemạch và dẫn                                            (ví dụ: yêu cầu về shield
                                                   kiểm tra và đo kiểmuchỉ tiêu kcỹNthguật mức mạch                                               cho bo mạch)
                                                  - Hoàn thiện tà1i l_iệBu thiết kdếochi tiết phần cứng đã
                                                  được thự1c 4hiện ở ibaưmớc đầu tiên: Cập nhật                                                 - Tài liệu hướng dẫn bring-
                                                  schem6at6ic,          G      phân  tích  đánh  giá  (nếu                                        up bo mạch và dẫn kiểm
                                                  cần) 4        PCB,nbgổ sung                                                                     tra và đo kiểm chỉ tiêu kỹ
                                                                To                                                                                thuật mức mạch

                                      11/2026     - Xâ3y:0d1ựng checklist kiểm tra giải pháp thiết kế và
                                                   7s:ơ5đồ Schematic
                                                    1
                              9/ /20             24 - Kiểm tra BOM (Kiểm tra chéo trong nhóm kỹ sư
               Kiểm tra thiết kế 0Trưởng /0n9hóm  thiết kế)                                                  - 2(f)
                                 :46                                                                                                            Checklist kiểm tra thiết kế
          4 phần cứng                 TKP,C17     - Thực hiện kiểm tra và ghi kết quả vào checklist - Thiết liệu thiết kế phần cứng             phần cứng rút gọn
                                        y
                     _09 da k                     kiểm tra. Kết quả:                                         rút gọn                            Bo mạch

               i Tha n V o u Ha                   + Nếu OK: Chuyển sang Bước 5.

               h uye                              + Nếu NOK: Tổ chức họp với kỹ sư thiết kế
                                                     phân tích lỗi và quay lại thực hiện Bước 3

 ui5T Chếc tNạog bộ mẫu               KS TKPC     - Chế tạo mạch in                                          Hồ sơ gia công: Gerber, Pick&
B do
141 G _ iam
466 Tong
                                                  Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 13 -->
```text
Số và ký hiệu: QT.VHT.CLKHCN.38  TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                                  Mã hiệu: QT.VHT.CLKHCN.2.2.2 46         09/
Ngày đến: 17/09/2024                QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                                  Ngày có hiệu lực: 20/09/2024 09:
                                                                                                                                                                     Tha H o a _ da      ky, 17/
                                                                                                                                                 Lần ban hành: 4
                                                                                                                                                 Trang:13/17         hi Vu
                                                                                                                                                                    T Đầu ra en
TT Hoạt động chính                    Thực hiện                         Mô tả chi tiết                                      Đầu vào                             ui    guy
                                          (c)
(a)                   (b)                                                     (d)                                               (e)              Drawing,1_B doc N   (f)
                                                 - Hàn lắp linh kiện                                           Place, Assembly                     614 iam
                                                 - Phản hồi lại những thiếu sót cho các bước phía              Stack up, BOM.                    46 Tong G

                                                   trước (nếu có)
                                                 - Thực hiện kiểm tra:

                                                            + Thực hiện hàn lắp (nếu cần)                                               26 :01

                                                            + Đồng chỉnh, kiểm tra tính năng và CTKT của / + Thực hiện bring-up bo mạch 20 7:53
                                                            bo mạch.                                           /11 24 1
                                                                                                         09 /20
                                                            + Phân tích nguyên nhân lỗi (nếu có)
                                                            + Phản hồ lại những thiếu sót cho các bướ4c 6phía - B7o/0m9ạch
                                                            trước (nếu có).                        9:          y-, 1Tài liệu hướng dẫn kiểm tra
     Kiểm tra và báo cáo                         Ghi chú: Kỹ sư kiểm tra có thể thựcoh_iệ0n kiểm dtraak và đo kiểm chỉ tiêu kỹ thuật
6 kết quả kiểm tra KS TKPC                       tính năng và chỉ tiêu độc lập với khỹ asư thiết kếH, ahoặc mức mạch                                     PM/KS TKHT phê duyệt -
                                                 có thể xem xét kết quả kiểm itrTa của kỹ sVưuthiết kế - Tài liệu hướng dẫn bring-up                     - Báo cáo bring-up, kiểm
     tính năng, đo kiểm                          kết hợp với các phươngTphháp phânyetínch hoặc mô bo mạch                                                tra tính năng và CTKT
     CTKT và bring-up

                                                 phỏng để đánh giá chấutilượng thiNếtgkuế                      - Phần mềm hỗ trợ
                                                 - Biên soạn và trì_nhBbáo cáodkoếct quả bring-up, kiểm
                                                            tra tính năn4g1và CTiKamT bo mạch (qua Trưởng
                                                            nhóm 6T6KP1C kiểmg tGra và qua PM/KS TKHT phê
                                                            duyệ4t). Ton
                                                            + Nếu OK: Lưu trữ hồ sơ và kết thúc.

                                                6 + N0ế1u NOK: Quay lại Bước 3

                                                          :
             - Đối với quá trình kiểm/2t0ra2 thiế1t7k:5ế3, mạch nguyên lý, mạch PCB phải được thực hiện bởi kỹ sư kiểm tra, độc lập với kỹ sư
thiết        kế.  Kỹ  sư   kiểm  tra  c/ó11thể  trao02đ4ổi  với  kỹ  sư  thiết  kế  hoặc  có  thể  thực  hiện  phân  tích               tính  toán,  mô  phỏng  một  cách  độc  lập  để
đánh giá giải pháp thiế0t9kế. 7/09/               2

                        :46 y, 1
             - Đối với0k9iểm tra BkOM thì có thể thực hiện kiểm tra chéo trong nội bộ kỹ sư thiết kế.
                   o_ a da
             - PMađánh giáHmức độ phức tạp của mạch, hệ thống phần cứng của đầu bài thiết kế để lựa chọn quy trình thực hiện là QT
thiết kiếTđhầy đủnhVayu QT thiết kế rút gọn.
 Th guye
i - ĐốNi với các mạch không phức tạp được áp dụng quy trình rút gọn:
41_ i B am u doc
4661 Tong G
                                                 Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 14 -->
```text
                                    TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                            Mã hiệu: QT.VHT.CLKHCN.2.2.2 46      09/

Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                               Ngày có hiệu lực: 20/09/2024 09:    ky, 17/
Ngày đến: 17/09/2024                                                                                                                                                             a
                                                                                                                                                                       o_
                                    QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                               Lần ban hành: 4       aTh Ha      d

                                                                                                                                              Trang:14/17
               Khi đó các tài liệu “Thiết kế kiến trúc”, “Phân tích thiết kế bo mạch”, “Thiết kế chi tiết”, “Yêu cầu TBhriing-upe”n,V“uYêu
                cầu cơ khí Shield” được gộp thành tài liệu “Thiết kế phần cứng rút gọn” - HW - ThietKePhanCungRuui tGonNguy
                                                                                                                                                        1_B doc
               Các tài liệu Checklist “Checklist kiểm tra thiết kế kiến trúc”, “Checklist kiểm tra schema4tic”, “Checklist kiểm tra
                                                                                                                                              cứn6g61rút       iam
              BOM ”, “Checklist kiểm tra PCB”,                             được  gộp  thành  “Checklist  kiểm  tra  thiết           kế  phần              gọnG”
                                                                                                                                              4 Tong
5.5 Ma trận phân quyền

a. Quy trình đầy đủ                                                                                                    26 :01
                                                                                                                    T/r2ư0ởng nh7ó:5m3
          TT                        Hoạt động chính                                           PM/KS TKHT 1                              1     KS TKPC               KS KT TKPC
                                                                                                               /1 TK2P4C                           C                        I
                                                                                              :46 17 0 / 9 09/20R                                  C                        I
          1 Lập kế hoạch thiết kế phần cứng
                                                                                                                                                   R                        S
          2 Xây dựng yêu cầu thiết kế phần cứng                                               o_0 d 9 a A ky, R                                     I
                                                                                                                                                                            I
           3 Thiết kế kiến trúc                                                       Th V a u H I a                                               R                        R
          3.1 Thiết kế kiến trúc phần cứng                                            Thi uyen A R                                                 R
                                                                                                                                                    I
          3.2 Kiểm tra thiết kế kiến trúc phần cứng                              Bu o i c Ng

          4 Thiết kế chi tiết
          4.1 Phân tích, lựa chọn giải pháp và linh kiện chính 41 i _ am d A
          4.2 Thiết kế schematic 466 n 1 g G S
          4.3 Kiểm tra thiết kế schematic To

          4.5 Kiểm tra thiết kế PCB 1/2 4.4 Thiết kế PCB 02 4 17 6 :53:01                                                           S         R                     I

                                                                                                                                                          I         R

          4.6 Hoàn thiện và trình ph/1ê duyệt t2ài02liệu thiết kế                                                                   A         R                     S
                           09 09/
          5 Chế tạo bộ mẫu6         7/                                                                                              S         R
                       :4 y, 1
              Kiểm tra và9báo cáo kkết quả kiểm tra tính năng, đo kiểm CTKT và
          6 bring-uop_0 a da                                                                  A                                     C         R                     S

              hi T ye h n Vua    H

ui T c Ngu
1_ i B am do
14 G
466 Tong
                                             Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 15 -->
```text
                                 TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                     Mã hiệu: QT.VHT.CLKHCN.2.2.2 46      09/

Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                     Ngày có hiệu lực: 20/09/2024 09: , 17     /
Ngày đến: 17/09/2024
                                                                                                                                                             o_ a ky
                                 QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                        Lần ban hành: 4    hi T V h u Haa d

                                                                                                                                    Trang:15/17

       b. Quy trình rút gọn                                                                                                                          ui T guyen

       TT                        Hoạt động chính                          PM/KS TKHT                                               Trưởng nhóm TKPC_B  KcSNTKPC
                                                                                                                                                41     do
       1 Lập kế hoạch thiết kế phần cứng                                                                                            4R 6 n 6 g 1 G C iam C

       2 Xây dựng yêu cầu thiết kế phần cứng                                   A                                                   R          o  T

       3 Thiết kế phần cứng                                                                                                        A                   R
                                                                                        1/2 1 0 7 2 :5 S R 6 3:R01 I
       4 Kiểm tra                                                                    9/1 024
       5 Chế tạo bộ mẫu
                                                                                              2
       6 Kiểm tra và báo cáo kết quả kiểm tra tính năng, đo kiểm CTKT và A 0 9/ C R6
                 bring-up                                                      9:4 , 17    /0

       5.6 KPI đánh giá việc thực hiện quy trình                        o_0 da ky

       Tên KPI                                Tỷ lệ tuân thủ quy trìnhha       Ha
                                                             i T Vu
       Miêu tả KPI                            Miêu tả: Mức đTộ htuân thủyqenuy trình được đánh giá định kỳ trong suốt quá trình thực hiện đề
                                              tài/dự án. ui   Ngu
                                                     _B doc
                                              Công th1ức tính:mTỷ lệ tuân thủ quy trình = Tổng điểm đạt được của các mục trong checklist
                                              / Tổ6n1g4điểm mGiaax các mục trong checklist * 100
                                              46 ong
                                              Cách tínTh: Tổng điểm đạt được và tổng điểm max trong kỳ đánh giá được tính lũy kế trên

                                              các mục đã thực hiện của checklist
                                 026             :01
                                              :53 Tần suất theo dõi: Hàng quý
                                 11/2 024 17 Đảm bảo đội dự án thực hiện đúng, đủ các bước đã quy định trong quy trình
       Mục đích KPI
       Ngưỡng KPI mục t6iêu09/ 7/09/2
                                              Tối thiểu: 85%                                                                       Tối đa: 100%
                    :4 y, 1
       Đơn vị chịu tr0ác9h nhiệma kthực hiện KPI Trung tâm Nghiên cứu phát triển sản phẩm
                o_ a d
       Đơn vị rhàasoát việucHthực hiện KPI    Trung tâm/Phòng Đảm bảo chất lượng Khối
       Th g i u T yen V
_Bu d i oc N
61 n 4 g 1 Giam
46 To                                       Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 16 -->
```text
                                        TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                           Mã hiệu: QT.VHT.CLKHCN.2.2.2 46               09/

Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                                  Ngày có hiệu lực: 20/09/2024 09: , 17              /
Ngày đến: 17/09/2024
                                                                                                                                                                            o_ a ky
                                        QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG                                                              Lần ban hành: 4           hi n T V h u Haa d

                                                                                                                                                 Trang:16/17

5.7 Rủi ro và điểm kiểm soát                                                                                                                                         i T uye
                                                                                                                                                             Loại kiểBmusoát Ng
          TT Các sự kiện rủi ro                 Nguyên nhân            Biện pháp kiểm soát tương ứng                                                         1_ doc

             nhận diện                                                                                Tự động / Bán tự đ6ộ1n4g / Pihaòmng ngừa / Phát hiện

                                                                                                                                                 Thủ côn4g6  g Gvới cùng tần suất giao
                                                                                                                                                             Ton dịch / Phát hiện với tần
                                                                                                                                                              suất thấp hơn tần suất
                                                                                                    1/2 1 0 7 2 :5 6 3:01
                                                                                                                                                                           giao dịch

                                        - Thiếu nhân sự
             Chậm tiến độ nghiên - Nứt gãy chuỗi cung ứng dẫn tới Lập kế hoạch chi tiết và thườn9g/1                                        024
          1                                                                                    0      Th/ủ2công                                              Phòng ngừa
             cứu phát triển             việc đầu tư cho chế thử kéo dài xuyên bám sát kế hoạch 6 /09
                                                                                   09: k 4 y, 17
                                        hơn dự kiến

5.8 Xử lý ngoài lệ (nếu có)                                            Tha u o H _ a da

             Với các trường hợp ngoại lệ, PM đề tài/dự án liên hệ với đi ầu mối cVhuyên quản của Phòng CLKHCN để được hướng dẫn.

                                                                                            n

                                                           Th ye
6. Tài liệu hướng dẫn (nếu có)                                   Bui c Ngu

             Tham chiếu trong quy trình                      141_       Tdêon biểu mẫu                                                                       Tên tài liệu
                                                                     iam
                                                         46 T 6 ong G
             1 Lập kế hoạch thiết kế phần cứng

             2 Xây dựng yêu cầu thiết kế phần cứng           HW - YeuCauThietKe                       Tài liệu yêu cầu thiết kế phần cứng

             3 Thiết kế kiến trúc       202 7 6 :53:01

          3.1 Thiết kế kiến trúc phần c1ứn/g 4 1             HW - ThietKeKienTruc                     Tài liệu thiết kế kiến trúc
                            9/1 /202
          3.2 Kiểm tra thiết kế ki0ến trúc ph0ầ9n cứng       HW - ChecklistThietKeKienTruc
                9:46 y, 17/
             4 Thiết kế ch0i tiết a k                        HW - ThietKePhanCungRutGon               Tài liệu thiết kế phần cứng rút gọn (chỉ áp dụng cho

                 ao Ha_              d                                                                các mạch/module thực hiện theo quy trình rút gọn)
          4.1 PhTâhn tích, lựVa uchọn giải pháp và linh kiện chính HW - PhanTichThietKeBoMach
            hi yen                                                                                    Tài liệu phân tích giải pháp thiết kế bo mạch
          4.T2 Thiết kgếu schematic
Bu d i oc N                                                  HW - YeuCauPhanMemBringUp                Tài liệu yêu cầu phần mềm bring-up

141 G _ iam
466 Tong
                                                     Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 17 -->
```text
                                 TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL                                                         Mã hiệu: QT.VHT.CLKHCN.2.2.2 46    09/
                                    QUY TRÌNH THIẾT KẾ VÀ CHẾ TẠO MẪU PHẦN CỨNG
Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                         Ngày có hiệu lực: 20/09/2024 09: , 17   /
Ngày đến: 17/09/2024
                                                                                                                                                              o_ a ky
                                                                                                                                        Lần ban hành: 4  hi T V h u Haa d

                                                                                                                                        Trang:17/17

              Tham chiếu trong quy trình                                    Tên biểu mẫu                                                Tên tài liệu T     guyen
4.3 Kiểm tra thiết kế schematic                               HW - BOM                                                                         ui
                                                              HW - ChecklistSCH                                                                  41_B doc N
                                                              HW - ChecklistBOM                                                         46 n 6 g 1 Giam
                                                                                                                                                 To

4.4 Thiết kế PCB                                              HW - YeuCauGiaCongBoMach             26 :01
                                                              HW - YeuCauCoKhiShield             T2à0i liệu yêu:5c3ầu cơ khí
                                                                                               /1 0 1 2 / 4 17
4.5 Kiểm tra thiết kế PCB                                     HW - ChecklistPCB           46 09     9/2
                                                                                                 7/T0ài liệu hướng dẫn bring-up bo mạch và kiểm tra,
                                                              HW - HuongDanBringup_ki:emtra 1
4.6 Hoàn thiện và trình phê duyệt tài liệu thiết kế                              09        k   y, đo kiểm chỉ tiêu kỹ thuật mức mạch
                                                                             o_ da
                                                              HW - ThietKeChiTiaetBoMacha        Tài liệu thiết kế bo mạch
                                                                   hi e T n h Vu H
5 Chế tạo bộ mẫu                                                   ui T Nguy

             Kiểm tra và báo cáo kết quả kiểm tra tính năng,  HW B- BaoCaooKcetQuaBringUpCTKT    Báo cáo kết quả bring-up, kiểm tra tính năng và chỉ
6 đo kiểm CTKT và bring-up                                       _d
                                                  661 g 4 G 1 iam                                tiêu kỹ thuật

7. Phụ lục đính kèm                              4             on

TT                               Tên phụ lục                  T                                                                         Mã hiệu

             1 Checklist đánh giá mức2đ6ộ tuân t3h:0ủ1quy trình                  QT.VHT.CLKHCN.2.2.2_CLTTQT
                                   20 7:5
                                 /11 20 / 24 1
                                 46 0 17 9 /09/
                  _09 d : a ky,
             Tha V o u Ha
i T N h g i uyen
41_ i B am u doc
4661 Tong G
                                                 Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```


<!-- trang 18 -->
```text
      Số và ký hiệu: QT.VHT.CLKHCN.38                                                                                                         _09:46  ky, a da 09/
      Ngày đến: 17/09/2024

                                                                               Danh sách ký duyệt                                            hi T
                                                                                                                                               hao
                          STT Người ký                                Đơn vị                        Thời gian                        Ý kiến       uyen V
                                                                                                        ký                                             uH
                           1 TỔNG                               Tổng Giám đốc -                                                      _Bui T
                                CÔNG TY                         Tổng công ty                        23/09/2024 Đã đóng dấu                   m do
                                CÔNG                            Công nghiệp                         15:12:57                                    c Ng
                                NGHIỆP                          Công nghệ cao
                                CÔNG                            Viettel                                                     466141   Tong G
                                NGHỆ CAO                        Trưởng Phòng                                                              ia
                                VIETTEL -                       Chiến lược -
                                CHI                             Khoa học công                         1/2026                7:53:01
                                NHÁNH                           nghệ - Phòng                                        /2024
                                TẬP ĐOÀN                        Chiến lược -                        u Ha da 6 09/1      1
                                CÔNG                            KHCN - Khối cơ                                    ky, 17/0
                                NGHIỆP -                        quan - TCT CNC                o_09:4                   9
                                VIỄN                            - Tổng công ty                      17/09/2024
                                THÔNG                           Công nghiệp    hi Tha         Nguyen17:53:00
                                QUÂN ĐỘI                        Công nghệ cao  Tong G _Bui T       V
                                                                Viettel                             16/09/2024
                           2 NGUYỄN                       466141                            iam     20:49:50
                                VŨ HÀ                                                          doc

                           3 NGUYỄN
                                GIA VINH

                                              7/09/20 26        :01
                                                        24 17:53
                                  /11/20
                                n Vu 46 H 09
                   c Nguye o_09:            a da ky
                                                 ,1

        Thi
          Tha

466141_ T B on uig Giam
                      do

                                              Tài liệu này thuộc sở hữu của Viettel. Việc phát tán, sử dụng trái phép bị nghiêm cấm
```
