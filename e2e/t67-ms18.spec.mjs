// T67 T2 (D-118) — MS18 Lập và phê duyệt KHLCNT chạy luồng (BPMN-MS18-TOBE): khởi tạo từ SCR-80, eForm từng bước, Tổ thẩm định cam kết song song,
// tuyến VHT (kiểm tra BM02) và tuyến Tập đoàn (thẩm định, ý kiến Ban ĐTXD, Phiếu trình GQCV), VOffice / ký cứng, đăng tải, KHLCNT Đã phê duyệt.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|ngoài BPMN/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const tasksOf = (page) => page.evaluate(() => Flow.caseTokens('admin').map((t) => `${t.task}:${t.who}`).sort());
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => (Flow.caseTokens(w).find((t) => String(t.task) === String(k)) || {}).id, [who, n]);
  expect(id, `việc bước ${n} của ${who}`).toBeTruthy();
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
/* Bước có form: mở bằng nút, (tuỳ chọn) chỉnh form, Xác nhận. */
async function step(page, who, n, label, fill) {
  await openTask(page, who, n);
  await act(page, label);
  await expect(page.locator('.vmodal .ef-body')).toBeVisible();
  if (fill) await fill();
  await ok(page);
}
async function start(page, code) {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'thau');
  await goto(page, '#/khlcnt/' + encodeURIComponent(code));
  await page.locator(`[data-kh-start="${code}"]`).click();
  await expect(page.locator('.overlay .modal')).toContainText('cấp phê duyệt không đổi được');
  await page.locator('#kh-start-ok').click();
  await expect(page).toHaveURL(new RegExp('#/task/HSKH-' + code.slice(7) + ':k'));
}
async function camKet(page, list) {
  for (const w of list) {
    await step(page, w, 8, 'Xác nhận cam kết', () => page.locator('[data-ef-chk="camKet"]').check());
    await done(page);
  }
}

test('Tuyến VHT: khởi tạo → gói, Tờ trình, Tổ thẩm định cam kết song song → kiểm tra BM02 → VOffice → đăng tải → KHLCNT Đã phê duyệt', async ({ page }) => {
  const KH = 'KHLCNT-2026-0017', CASE = 'HSKH-2026-0017';
  await start(page, KH);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await expect(page.locator('.ginfo').first()).toContainText(KH);
  await expect(page.locator('.ginfo').first()).toContainText('Tổng Công ty');
  // Bước 1–2 đã ghi nhận lúc khởi tạo, việc đang mở là bước 3.
  expect(await tasksOf(page)).toEqual(['3:thau']);
  await act(page, 'Hoàn thành tạo gói'); await ok(page); await done(page);
  await step(page, 'thau', 4, 'Hoàn thành thông tin gói', () => page.locator('[data-ef-chk="khDaKiemTra"]').check()); await done(page);
  await step(page, 'thau', 5, 'Hoàn thành Tờ trình'); await done(page);
  await step(page, 'thau', 6, 'Gửi Tổ thẩm định xác nhận'); await done(page);
  // Bước 7 tạo việc cam kết cho từng thành viên; Việc của tôi của thành viên có dòng mang mã KHLCNT.
  expect(await tasksOf(page)).toEqual(['8:binh', '8:tckt', '8:thauch']);
  await as(page, 'tckt');
  await expect(page.locator('.vtable tbody tr', { hasText: 'Xác nhận cam kết' })).toContainText(KH);
  await camKet(page, ['binh', 'tckt']);
  expect(await tasksOf(page)).toEqual(['8:thauch']);
  await camKet(page, ['thauch']);
  // Đủ cam kết → cổng Cấp phê duyệt = VHT → bước 10 (TTMS kiểm tra).
  expect(await tasksOf(page)).toEqual(['10:lan']);
  await openTask(page, 'lan', 10);
  await act(page, 'Kết quả kiểm tra');
  await expect(page.locator('.vmodal')).toContainText('Sự đầy đủ hồ sơ trình theo danh mục quy định');
  await ok(page); await done(page);
  // Bước 11: chọn Trình ký VOffice → 16, 17 (hệ thống) → G5 thành công → 21.
  await step(page, 'thau', 11, 'Trình ký VOffice'); await done(page);
  expect(await tasksOf(page)).toEqual(['21:thau']);
  await step(page, 'thau', 21, 'Đăng tải KHLCNT', () => page.locator('[data-ef-chk="khDangTai"]').check());
  // Kết thúc → Chi tiết KHLCNT, trạng thái Đã phê duyệt, văn bản có số / ngày theo các bước.
  await expect(page).toHaveURL(new RegExp('#/khlcnt/' + encodeURIComponent(KH) + '$'));
  await expect(page.locator('.ginfo').first()).toContainText('Hoàn thành KHLCNT');
  await expect(page.locator('.ginfo').first()).toContainText('Hoàn thành KHLCNT');
  await page.locator('.dx-tabs [data-ttab="checklist"]').click();
  await expect(page.locator('main')).toContainText('/QĐ-VHT');
  await expect(page.locator('main')).toContainText('/TTr-MS-ĐT');
  // Hồ sơ xử lý: lịch sử đủ, văn bản đầu ra BM01, BM02, BM03.
  await page.locator(`[data-go="ho-so-hd/${CASE}"]`).first().click();
  await expect(page.locator('.ginfo').first()).toContainText('Mã KHLCNT');
  await expect(page.locator('main')).toContainText('KH-BM03');
  expect(await page.evaluate((c) => Flow.caseOf(c).history.filter((h) => h.system).map((h) => String(h.task)), CASE)).toEqual(expect.arrayContaining(['7', '16', '17', '22', '23']));
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Kiểm tra Không đáp ứng → 9 → 5 → cam kết lại; người ký từ chối → 19 → 9; lỗi VOffice tự thử lại (18)', async ({ page }) => {
  const KH = 'KHLCNT-2026-0017', CASE = 'HSKH-2026-0017';
  await start(page, KH);
  await act(page, 'Hoàn thành tạo gói'); await ok(page); await done(page);
  await step(page, 'thau', 4, 'Hoàn thành thông tin gói', () => page.locator('[data-ef-chk="khDaKiemTra"]').check()); await done(page);
  await step(page, 'thau', 5, 'Hoàn thành Tờ trình'); await done(page);
  await step(page, 'thau', 6, 'Gửi Tổ thẩm định xác nhận'); await done(page);
  await camKet(page, ['binh', 'tckt', 'thauch']);
  // Chọn Không đáp ứng khi mọi tiêu chí Đáp ứng → bị chặn; đổi một tiêu chí → trả sửa.
  await openTask(page, 'lan', 10);
  await act(page, 'Kết quả kiểm tra');
  await page.locator('.vmodal #ef-no').click();
  await expect(page.locator('.toast').last()).toContainText('Bạn cần nhập ý kiến khi từ chối');
  await page.locator('[data-ef="khNhanXet"]').fill('Bổ sung cơ sở giá gói thầu.');
  await page.locator('.vmodal #ef-no').click();
  await expect(page.locator('.toast').last()).toContainText('ít nhất một tiêu chí Không đáp ứng');
  await page.locator('[data-ef-radio="khKiemTra::6::kq"][data-v=\'"Không đáp ứng"\']').click();
  await page.locator('[data-ef="khKiemTra::6::nhanXet"]').fill('Giá gói thầu chưa có báo giá đối chứng.');
  await page.locator('[data-ef="khNhanXet"]').fill('Bổ sung cơ sở giá gói thầu.');
  await page.locator('.vmodal #ef-no').click();
  await done(page);
  expect(await tasksOf(page)).toEqual(['9:thau']);
  await openTask(page, 'thau', 9);
  await act(page, 'Gửi lại');
  await expect(page.locator('.vmodal')).toContainText('Bổ sung cơ sở giá gói thầu.');
  await page.locator('[data-ef="khNoiDungSua"]').fill('Đã bổ sung báo giá đối chứng.');
  await ok(page); await done(page);
  expect(await tasksOf(page)).toEqual(['5:thau']);
  await step(page, 'thau', 5, 'Hoàn thành Tờ trình'); await done(page);
  await step(page, 'thau', 6, 'Gửi Tổ thẩm định xác nhận'); await done(page);
  await camKet(page, ['binh', 'tckt', 'thauch']);
  // Vòng kiểm tra sau giữ kết quả vòng trước: tiêu chí 6 còn Không đáp ứng thì Đáp ứng bị chặn; đổi lại rồi mới qua.
  await openTask(page, 'lan', 10); await act(page, 'Kết quả kiểm tra'); await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Còn tiêu chí Không đáp ứng');
  await page.locator('[data-ef-radio="khKiemTra::6::kq"][data-v=\'"Đáp ứng"\']').click();
  await ok(page); await done(page);
  // Lỗi kỹ thuật VOffice (lần 1) rồi người ký từ chối (lần 2).
  await page.evaluate((c) => { Flow.caseOf(c).ui.voFail = true; Flow.caseOf(c).ui.signReject = true; }, CASE);
  await step(page, 'thau', 11, 'Trình ký VOffice'); await done(page);
  const sys = await page.evaluate((c) => Flow.caseOf(c).history.map((h) => String(h.task)), CASE);
  expect(sys.filter((x) => x === '16').length).toBe(2);
  expect(sys).toContain('18');
  expect(await tasksOf(page)).toEqual(['19:thau']);
  await step(page, 'thau', 19, 'Chuyển chỉnh sửa', () => page.locator('[data-ef="khChuyenSua"]').fill('Điều chỉnh thời gian bắt đầu LCNT.')); await done(page);
  expect(await tasksOf(page)).toEqual(['9:thau']);
  expect(page.errors).toEqual([]);
});

test('Tập đoàn (mẫu KHLCNT-2026-0016): thẩm định → ý kiến Ban ĐTXD → giải trình, Phiếu trình → ký cứng → đăng tải', async ({ page }) => {
  const KH = 'KHLCNT-2026-0016', CASE = 'HSKH-2026-0016';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'binh');
  await goto(page, '#/khlcnt/' + encodeURIComponent(KH));
  await page.locator(`[data-kh-sample="${KH}"]`).click();
  await expect(page).toHaveURL(new RegExp('#/task/' + CASE + ':k'));
  await expect(page.locator('.ginfo').first()).toContainText('Tập đoàn');
  // Tua theo nhánh chính: đã qua cam kết của 3 thành viên, tuyến Tập đoàn không qua bước 10–11.
  expect(await tasksOf(page)).toEqual(['12:binh']);
  expect(await page.evaluate((c) => Flow.caseOf(c).history.filter((h) => String(h.task) === '8').length, CASE)).toBe(3);
  await act(page, 'Kết quả thẩm định');
  await expect(page.locator('.vmodal')).toContainText('Hình thức và phương thức lựa chọn nhà thầu');
  await ok(page); await done(page);
  // Bước 13: Phiếu nhận xét bắt buộc tải lên.
  await openTask(page, 'thau', 13);
  await act(page, 'Ghi nhận ý kiến');
  await page.locator('[data-ef="khPnxSo"]').fill('512/PNX-ĐTXD');
  await page.locator('[data-ef="khPnxNgay"]').fill('20/10/2026');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Phiếu nhận xét của Ban ĐTXD Tập đoàn');
  await page.locator('.vmodal [data-close]').first().click();
  await page.locator('[data-req-up]').first().click();
  await act(page, 'Ghi nhận ý kiến');
  await page.locator('[data-ef="khPnxSo"]').fill('512/PNX-ĐTXD');
  await page.locator('[data-ef="khPnxNgay"]').fill('20/10/2026');
  await ok(page); await done(page);
  await step(page, 'thau', 14, 'Hoàn thành giải trình', async () => {
    await page.locator('[data-ef="khYKien::0::giaiTrinh"]').fill('Giá niêm yết của hãng, có xác nhận độc quyền.');
    await page.locator('[data-ef="khYKien::1::giaiTrinh"]').fill('Đã có văn bản chấp thuận chủ trương.');
  });
  await done(page);
  // Bước 15 → Trình ký cứng → bước 20 (bằng chứng ký bắt buộc).
  await step(page, 'thau', 15, 'Trình ký cứng'); await done(page);
  expect(await tasksOf(page)).toEqual(['20:thau']);
  await page.evaluate((c) => { Flow.caseOf(c).ui.khQdKyFile = true; }, CASE);
  await step(page, 'thau', 20, 'Xác nhận kết quả ký', async () => {
    await page.locator('[data-ef="khQdSo"]').fill('1408/QĐ-CNVTQĐ');
    await page.locator('[data-ef="khQdNgay"]').fill('27/10/2026');
  });
  await done(page);
  await step(page, 'thau', 21, 'Đăng tải KHLCNT', () => page.locator('[data-ef-chk="khDangTai"]').check());
  await expect(page).toHaveURL(new RegExp('#/khlcnt/' + encodeURIComponent(KH) + '$'));
  await expect(page.locator('.ginfo').first()).toContainText('Hoàn thành KHLCNT');
  const st = await page.evaluate((c) => Flow.caseOf(c).history.map((h) => String(h.task)), CASE);
  expect(st).not.toContain('10');
  expect(st).toEqual(expect.arrayContaining(['12', '13', '14', '15', '20', '22', '23']));
  expect(page.errors).toEqual([]);
});
