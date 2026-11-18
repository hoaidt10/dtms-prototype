# CLAUDE.md — Prototype ĐTMS (repo nguồn)

Prototype HTML bấm được của hệ thống **Đầu tư mua sắm (ĐTMS)** và **Quản lý sản xuất** cho VHT. Nhiều BA cùng sửa, mỗi BA một
phân hệ; một **người tích hợp** (`thaiphuc22`) review, merge và deploy. Bản xem (khoá mã) do người tích hợp đăng ở
`dtms-prototype-v2` — không phải repo này.

## Đọc trước mọi việc — BẮT BUỘC

1. [`.harness/rules/prototype-collab.md`](.harness/rules/prototype-collab.md) — nhánh / PR, chỉ sửa file phân hệ mình, đánh số, tài liệu, giả lập, sửa file an toàn.
2. [`.harness/rules/prototype-ui.md`](.harness/rules/prototype-ui.md) — màn trông như app thật, layout theo màn tương đương của FE VHT.
3. [`.harness/rules/prototype-solution.md`](.harness/rules/prototype-solution.md) — giải pháp làm được khi phát triển thật (cấu hình, eForm, nguồn dữ liệu).
4. `state/<phân-hệ>.md` của phân hệ bạn (hook đầu phiên chèn mục Now theo nhánh).
5. [`tai-lieu/INDEX.md`](tai-lieu/INDEX.md) trước khi dùng tài liệu nghiệp vụ — chỉ dùng mã có ở đó.

## Vòng làm việc (mỗi việc)

- **PLAN:** đọc tài liệu (mã INDEX), màn hiện có, test của màn; ghi plan ngắn vào `state/<phân-hệ>.md` (Now). Màn mới / khối sửa trả lời
  5 câu K1 của `prototype-solution`. Chỗ nguồn không có → `Q-<PH>-xx`, không tự chốt.
- **BUILD:** nhánh `<phân-hệ>/<việc>` từ `main` mới; chỉ sửa file phân hệ (xem `modules.json`); sửa / thêm e2e của màn.
- **VERIFY:** `npm test` xanh, bấm thử, ảnh trước / sau → push nhánh, mở PR theo mẫu → cập nhật Now. Người tích hợp merge + deploy.

## Chạy

```bash
npm ci                                   # lần đầu
npx playwright install chromium          # lần đầu (trình duyệt cho e2e)
npm test                                 # unit (node --test test/) + e2e (Playwright), bỏ qua ca cách ly
npm run test:e2e -- e2e/kdt.spec.mjs     # một spec
npm run test:quarantine                  # chỉ các ca cách ly (e2e/quarantine.json)
```

Mở prototype: mở `index.html` bằng Chrome / Edge (file://, không cần build, không cần mạng).
Trong mạng VHT, GitHub phải qua proxy: `git config http.proxy http://172.16.120.13:3128` (một lần trong repo).

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Nạp toàn bộ `js/` (thứ tự `<script>` quan trọng) |
| `js/app.js`, `screens.js`, `flow.js`, `ui.js`, `data.js` | Khung app, màn chung (Việc của tôi, Chi tiết hồ sơ), động cơ luồng, dữ liệu chung — **dùng chung** |
| `js/<phân-hệ>*.js`, `js/eforms/*.js`, `js/bpmn-*.js` | Màn / eForm / BPMN của từng phân hệ (`js/bpmn-*` sinh tự động từ BPMN khách — không sửa tay) |
| `e2e/*.spec.mjs`, `test/*.test.mjs` | Test Playwright / unit; `e2e/helpers.mjs` dùng chung |
| `modules.json` | Phân hệ → file, tiền tố số, chủ. Nguồn của hook guard và `.github/CODEOWNERS` |
| `state/<phân-hệ>.md` | State của từng phân hệ |
| `tai-lieu/` | Bản chép tài liệu nghiệp vụ (chỉ đọc, sinh tự động) |
| `tools/` | Công cụ của người tích hợp (đóng gói, deploy, sinh BPMN, CODEOWNERS…) |

## Luật cứng

- Không push `main`, không deploy, không sửa `tools/publish-pages.mjs`, `tools/page-lock.mjs`, không tạo `.env*`.
- Không sửa `tai-lieu/`, `.harness/rules/prototype-ui.md`, `prototype-solution.md` (bản chép — đổi ở nguồn của người tích hợp).
- Không sửa `js/bpmn-*.js` bằng tay (sinh từ BPMN khách); BPMN cần đổi → đề xuất `DX-<PH>-xx` trong PR.
- Không đưa dữ liệu thật (mật khẩu, token, tên / số điện thoại thật ngoài persona có sẵn) vào prototype.
