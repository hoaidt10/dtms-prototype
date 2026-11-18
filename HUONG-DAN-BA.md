# Hướng dẫn cho BA — sửa prototype ĐTMS

Dành cho BA được giao một phân hệ (xem `modules.json`). Người tích hợp review, merge và đăng bản xem; bạn sửa trên nhánh riêng và mở PR.

## 1. Cài một lần

1. **Quyền repo:** người tích hợp mời tài khoản GitHub của bạn vào `thaiphuc22/dtms-prototype` (quyền Write). Nhận lời mời trong email / github.com.
2. **Công cụ:** Git, Node.js 24 trở lên, Chrome hoặc Edge, Claude Code (CLI hoặc extension VS Code).
3. **Mạng VHT** — GitHub phải qua proxy:

   ```bash
   git config --global http.https://github.com.proxy http://172.16.120.13:3128
   ```

4. **Lấy mã và cài:**

   ```bash
   git clone https://github.com/thaiphuc22/dtms-prototype.git
   cd dtms-prototype
   npm ci
   npx playwright install chromium
   npm test          # lần đầu nên xanh hết (vài phút)
   ```

   `npm ci` / `playwright install` báo lỗi mạng → đặt thêm `HTTPS_PROXY=http://172.16.120.13:3128` rồi chạy lại.
5. **Mở prototype:** mở `index.html` bằng Chrome / Edge (không cần build).
6. **Claude Code:** mở thư mục `dtms-prototype` làm project. Đầu phiên Claude tự đọc `CLAUDE.md` và nhận state của phân hệ theo nhánh;
   khi bạn sửa file ngoài phân hệ, Claude được nhắc.

## 2. Mỗi việc

```bash
git switch main && git pull --rebase                 # lấy main mới nhất
git switch -c kdt/sua-buoc-12                        # nhánh <phân-hệ>/<việc>
# ... sửa (hoặc nhờ Claude Code), bấm thử, sửa / thêm e2e ...
npm test                                             # phải xanh
git add -A && git commit -m "KĐT: sửa bước 12 theo DG-MS13 …"
git push -u origin kdt/sua-buoc-12
```

Mở PR trên github.com (nút **Compare & pull request**) hoặc `gh pr create`. Điền đủ mẫu PR, đính ảnh trước / sau.
CI chạy lại `npm test` trên PR; đỏ thì sửa tiếp trên cùng nhánh (push thêm commit). Người tích hợp góp ý → sửa → push.
Merge xong: `git switch main && git pull --rebase`, xoá nhánh cũ.

## 3. Cần nhớ

- Chỉ sửa file của phân hệ mình (`modules.json`). File dùng chung (`js/app.js`, `screens.js`, `flow.js`, `data.js`, `index.html`…) cần
  sửa thì ghi lý do trong PR.
- Màn mới: đăng ký `window.AppRoutes` trong tệp phân hệ; dữ liệu mới: `js/data-<phân-hệ>.js`; nhật ký: `changelog/<phân-hệ>.md`.
- Số mới có tiền tố phân hệ: `P-KDT-01`, `DX-KDT-01`, `Q-KDT-01`. Ghi vào `state/<phân-hệ>.md`.
- Căn cứ: `tai-lieu/INDEX.md` và bản đọc `tai-lieu/_md/`. Thiếu → hỏi trong PR.
- Không push `main`, không deploy, không sửa `tai-lieu/`, `tools/`, `js/bpmn-*.js`.
- Ca e2e cách ly của phân hệ (`e2e/quarantine.json`) — sửa dần; xanh thì xoá dòng. `npm run test:quarantine -- -g "<tên ca>"`.

Chi tiết: [`CLAUDE.md`](CLAUDE.md), [`.harness/rules/prototype-collab.md`](.harness/rules/prototype-collab.md).
