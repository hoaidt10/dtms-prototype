# Kho comment chung — Google Sheet + Apps Script (T52)

Comment review trên prototype (`js/review.js`) lưu vào một Google Sheet. Ai mở prototype cũng thấy và trả lời được toàn bộ
comment, không cần xuất / nhập JSON. Người review không cần đăng nhập. Không có mã bảo vệ: ai có link prototype cũng đọc và
ghi được (người dùng chốt 11/11).

## Bản đang chạy (cài 2026-11-11)

- Sheet **"DTMS prototype — comment review"** của thaiphuc22@gmail.com: <https://drive.google.com/open?id=10OHbWWEsdtVJ0kvHK-Ma2Xy7-3vEoY7XUZeDaUkBWC8>
- Script gắn với Sheet này: `.clasp.json` (scriptId) cùng thư mục. Bản triển khai `AKfycbxsQGFK…` có URL nằm trong `<meta name="review-api">` của `index.html`.
  Bản đăng Pages được khoá mã, nên URL này không lộ ra ngoài.
- Cập nhật `Code.gs` bằng clasp (`npm i -g @google/clasp`, đã `clasp login`). Chạy trong **PowerShell**: Git Bash báo lỗi
  "Content directory is a symlink".
  ```
  cd prototype\dtms\tools\review-sheet
  clasp push --force
  clasp create-version "<ghi chú>"
  clasp update-deployment AKfycbxsQGFKBQbMJXlsVSbt9tkCVsYyJq0cae7TG_nzIAnlmMmduUdb75Hc6ln1URfXY2208w --versionNumber <số bản vừa tạo>
  ```
  Đổi `oauthScopes` trong `appsscript.json` thì chủ Sheet phải mở URL Web app một lần để cấp lại quyền.
- Trình duyệt tự động hoá (Playwright: e2e, guide-shots, release-check) **bỏ qua** thẻ meta, nên không ghi vào kho thật. Chỉ khi
  truyền rõ `?review-api=` mới ghi.

## Cài một lần (khoảng 5 phút)

1. Tạo một Google Sheet mới, ví dụ **"DTMS prototype — comment review"**.
2. Trên Sheet: **Tiện ích mở rộng › Apps Script**. Xoá nội dung `Code.gs` mặc định, dán toàn bộ [`Code.gs`](Code.gs), rồi **Lưu**.
3. **Triển khai › Tạo bản triển khai mới**, loại **Ứng dụng web**:
   - Thực thi dưới dạng: **Tôi** (chủ Sheet)
   - Người có quyền truy cập: **Bất kỳ ai**
4. Bấm **Triển khai** và cấp quyền cho script (Google sẽ cảnh báo "ứng dụng chưa được xác minh": chọn **Nâng cao › Đi tới …**).
5. Chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`), rồi điền vào `index.html`:
   `<meta name="review-api" content="https://script.google.com/macros/s/…/exec">`.
6. Đăng lại prototype: `node tools/publish-pages.mjs`.

Sửa `Code.gs` về sau: dán bản mới, rồi vào **Triển khai › Quản lý bản triển khai › Sửa (bút chì) › Phiên bản: Mới**. Cách này
giữ nguyên URL. Nếu tạo bản triển khai mới, URL sẽ đổi.

Thử nhanh mà không cần sửa `index.html`: mở `…/index.html?review-api=<URL>`. URL này được nhớ trong trình duyệt; dùng
`?review-api=off` để quay về chế độ chỉ lưu trên máy.

## Trên Sheet có gì

- Sheet **comments**: mỗi comment một dòng, gồm `id`, `no` (số ghim), `status`, `type`, `author`, thời điểm tạo và sửa,
  `screen` (mã SCR + tên màn), `title`, `label` (phần tử được ghim), `text`, `replies`, `link` và `json`.
  - Cột `link` mở prototype đúng comment đó (`?rv=<id>`, chỉ có khi comment được ghi từ bản web).
  - Cột `json` là bản đầy đủ, là nguồn dữ liệu chính. **Không sửa tay cột `json`.** Muốn xoá thì xoá cả dòng.
- Sheet **snapshots**: ảnh chụp dữ liệu prototype lúc ghim, dùng cho nút "Mở đúng ngữ cảnh". Mỗi ô chứa tối đa 40.000 ký tự.

## Trên prototype

- Menu nút tím hiện dòng **Kho chung · cập nhật hh:mm**, hoặc báo lỗi và số thao tác chờ gửi.
- Prototype tự tải lại 30 giây một lần khi tab đang mở, và tải ngay khi quay lại tab. Muốn tải ngay thì bấm **Tải lại từ kho chung**.
- Mất mạng: comment và trả lời vẫn lưu trên máy, xếp hàng chờ, có mạng lại thì tự gửi.
- **Gửi … comment trên máy lên kho chung**: mục này chỉ hiện khi máy còn comment ghi trước khi có kho chung. Bản cũ được cất
  sang khoá `dtms-review-v1-da-gui`, không bị xoá.
- **Tải JSON toàn bộ kho chung**: tệp cùng định dạng với tệp xuất từ prototype, kèm ảnh chụp dữ liệu.
- Nhóm dự án gộp và chụp ảnh thẳng từ kho chung: `node tools/review-merge.mjs <thư-mục-ra> <URL ứng dụng web> --shots`.
- Số ghim do kho cấp, nên nhiều người ghim cùng lúc vẫn không trùng số. Chỉ người tạo comment mới xoá được comment đó.

Kiểm thử: `npx playwright test e2e/t52-review-shared.spec.mjs` chạy chính `Code.gs` trên một Sheet giả.
