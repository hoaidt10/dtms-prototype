<!-- pk-source: 02. VHT gửi/ĐT mua sắm/Bản mềm QT QLTS chuyển đổi số/1. Luồng nghiệp vụ_P_ĐT.docx -->
<!-- pk-sha256: 055760b159b74342a6b88705b00786534eb86f52ca354e5db40c54f38f9693fc -->
<!-- pk-generated: 2026-09-29 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# LNV-PDT — bản đọc máy sinh

> Nguồn: `project-knowledge/02. VHT gửi/ĐT mua sắm/Bản mềm QT QLTS chuyển đổi số/1. Luồng nghiệp vụ_P_ĐT.docx`. Trích dẫn thì ghi mã **LNV-PDT** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

## 3. Tóm tắt nội dung quy trình

1.  

<!-- -->

1.  
2.  
3.  

### 3.1. Các luồng nghiệp vụ chính

Tổng thể các luồng nghiệp vụ của Module Đầu tư: Gồm <span class="mark">04 luồng chính và 40 luồng nghiệp vụ thành phần như sau</span>:

<table style="width:100%;">
<colgroup>
<col style="width: 9%" />
<col style="width: 19%" />
<col style="width: 53%" />
<col style="width: 17%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>TT</strong></th>
<th style="text-align: center;"><strong>Mã Quy trình, nghiệp vụ</strong></th>
<th style="text-align: center;"><strong>Tên quy trình/nghiệp vụ</strong></th>
<th style="text-align: center;"><strong>Pha phát triển</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong><mark>1</mark></strong></td>
<td><strong><mark>ĐT01</mark></strong></td>
<td><strong><mark>Nghiệp vụ Lập kế</mark></strong> <strong><mark>hoạch lựa chọn nhà thầu</mark></strong></td>
<td style="text-align: center;"><mark>Pha 1</mark></td>
</tr>
<tr>
<td><mark>1.1</mark></td>
<td><blockquote>
<p><mark>ĐT01.01</mark></p>
</blockquote></td>
<td><blockquote>
<p><mark>Luồng nghiệp vụ lập thông tin gói thầu</mark></p>
</blockquote></td>
<td style="text-align: center;"><mark>Pha 1</mark></td>
</tr>
<tr>
<td><mark>1.2</mark></td>
<td><blockquote>
<p><mark>ĐT01.02</mark></p>
</blockquote></td>
<td><blockquote>
<p><mark>Luồng nghiệp vụ lập tờ trình KHLCNT.</mark></p>
</blockquote></td>
<td style="text-align: center;"><mark>Pha 1</mark></td>
</tr>
<tr>
<td><mark>1.3</mark></td>
<td><blockquote>
<p><mark>ĐT01.03</mark></p>
</blockquote></td>
<td><blockquote>
<p><mark>Luồng nghiệp vụ lập Báo cáo kiểm tra KHLCNT.</mark></p>
</blockquote></td>
<td style="text-align: center;"><mark>Pha 1</mark></td>
</tr>
<tr>
<td><mark>1.4</mark></td>
<td><blockquote>
<p><mark>ĐT01.04</mark></p>
</blockquote></td>
<td><blockquote>
<p><mark>Luồng nghiệp vụ lập Quyết định phê duyệt KHLCNT.</mark></p>
</blockquote></td>
<td style="text-align: center;"><mark>Pha 1</mark></td>
</tr>
<tr>
<td><strong>2</strong></td>
<td><strong>ĐT02</strong></td>
<td><strong>Nghiệp vụ Tổ chức lựa chọn nhà thầu</strong></td>
<td style="text-align: center;">Pha 1</td>
</tr>
<tr>
<td>2.1</td>
<td><blockquote>
<p>ĐT02.01</p>
</blockquote></td>
<td><blockquote>
<p>Luồng nghiệp vụ TCLCNT đối với ĐXMS</p>
</blockquote></td>
<td style="text-align: center;">Pha 1</td>
</tr>
<tr>
<td><em><mark>2.1.1</mark></em></td>
<td><blockquote>
<p><em><mark>ĐT02.01.01</mark></em></p>
</blockquote></td>
<td><blockquote>
<p><em><mark>Luồng nghiệp vụ Đối với gói thầu</mark></em> <em><mark>ĐTRR</mark></em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.2</em></td>
<td><blockquote>
<p><em>ĐT02.01.02</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐTHC</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.3</em></td>
<td><blockquote>
<p><em>ĐT02.01.03</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CGTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.4</em></td>
<td><blockquote>
<p><em>ĐT02.01.04</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu MSTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.5</em></td>
<td><blockquote>
<p><em>ĐT02.01.05</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CĐT RG</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.6</em></td>
<td><blockquote>
<p><em>ĐT02.01.06</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CĐT TT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.7</em></td>
<td><blockquote>
<p><em>ĐT02.01.07</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐPTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.8</em></td>
<td><blockquote>
<p><em>ĐT02.01.08</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐH</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.9</em></td>
<td><blockquote>
<p><em>ĐT02.01.09</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu GNV</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.10</em></td>
<td><blockquote>
<p><em>ĐT02.01.10</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu TTH</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.1.11</em></td>
<td><blockquote>
<p><em>ĐT02.01.11</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu THĐB</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td>2.2</td>
<td><blockquote>
<p>ĐT02.02</p>
</blockquote></td>
<td><blockquote>
<p>Luồng nghiệp vụ TCLCNT đối với Khoản Đầu tư</p>
</blockquote></td>
<td style="text-align: center;">Pha 2</td>
</tr>
<tr>
<td><em>2.2.1</em></td>
<td><blockquote>
<p><em>ĐT02.02.01</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐTRR</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.2</em></td>
<td><blockquote>
<p><em>ĐT02.02.02</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐTHC</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.3</em></td>
<td><blockquote>
<p><em>ĐT02.02.03</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CGTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.4</em></td>
<td><blockquote>
<p><em>ĐT02.02.04</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu MSTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.5</em></td>
<td><blockquote>
<p><em>ĐT02.02.05</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CĐT RG</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.6</em></td>
<td><blockquote>
<p><em>ĐT02.02.06</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CĐT TT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.7</em></td>
<td><blockquote>
<p><em>ĐT02.02.07</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐPTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.8</em></td>
<td><blockquote>
<p><em>ĐT02.02.08</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐH</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.9</em></td>
<td><blockquote>
<p><em>ĐT02.02.09</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu GNV</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.10</em></td>
<td><blockquote>
<p><em>ĐT02.02.10</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu TTH</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.2.11</em></td>
<td><blockquote>
<p><em>ĐT02.02.11</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu THĐB</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td>2.3</td>
<td><blockquote>
<p>ĐT02.03</p>
</blockquote></td>
<td><blockquote>
<p>Luồng nghiệp vụ TCLCNT đối với Dự án Đầu tư</p>
</blockquote></td>
<td style="text-align: center;">Pha 2</td>
</tr>
<tr>
<td><em>2.3.1</em></td>
<td><blockquote>
<p><em>ĐT02.03.01</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐTRR</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.2</em></td>
<td><blockquote>
<p><em>ĐT02.03.02</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐTHC</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.3</em></td>
<td><blockquote>
<p><em>ĐT02.03.03</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CGTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.4</em></td>
<td><blockquote>
<p><em>ĐT02.03.04</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu MSTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.5</em></td>
<td><blockquote>
<p><em>ĐT02.03.05</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CĐT RG</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.6</em></td>
<td><blockquote>
<p><em>ĐT02.03.06</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu CĐT TT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.7</em></td>
<td><blockquote>
<p><em>ĐT02.03.07</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐPTT</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.8</em></td>
<td><blockquote>
<p><em>ĐT02.03.08</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu ĐH</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.9</em></td>
<td><blockquote>
<p><em>ĐT02.03.09</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu GNV</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.10</em></td>
<td><blockquote>
<p><em>ĐT02.03.10</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu TTH</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><em>2.3.11</em></td>
<td><blockquote>
<p><em>ĐT02.03.11</em></p>
</blockquote></td>
<td><blockquote>
<p><em>Luồng nghiệp vụ Đối với gói thầu THĐB</em></p>
</blockquote></td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td><strong>3</strong></td>
<td><strong>ĐT03</strong></td>
<td><p><strong>Nghiệp vụ Quản lý, tổng hợp thông tin</strong></p>
<p><em>(Báo cáo, quản lý số văn bản; chia sẻ các case tình huống trong đấu thầu,….)</em></p></td>
<td style="text-align: center;"><strong>Pha 1</strong></td>
</tr>
<tr>
<td><strong>4</strong></td>
<td><strong>ĐT04</strong></td>
<td><p><strong>Nghiệp vụ Quản lý, lưu trữ Hồ sơ, tài liệu, văn bản pháp lý</strong></p>
<p><em>(Chia sẻ HSDT/HSMT; chứng chỉ đấu thầu; thông tin đối tác; biểu mẫu,..)</em></p></td>
<td style="text-align: center;"><strong>Pha 1</strong></td>
</tr>
</tbody>
</table>

### 
