// T67 T4 (D-118): trạng thái hai lớp KHL-xx / LC-xx (THAU-TT-1311 §1, §3.4, §4.1) do quy trình đặt, và cột tiến độ §7
// (Giai đoạn · Bước hiện tại · Đơn vị / người xử lý · Bắt đầu bước · Hạn xử lý · Thời gian tại bước · Vướng mắc) trên SCR-78 / SCR-81.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|ngoài BPMN/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const PROG = ['Giai đoạn', 'Bước hiện tại', 'Đơn vị / người xử lý', 'Bắt đầu bước', 'Hạn xử lý', 'Thời gian tại bước', 'Vướng mắc'];
const row = (page, code) => page.locator('main .vtable tbody tr', { has: page.locator(`text="${code}"`) });
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => (Flow.caseTokens(w).find((t) => String(t.task) === String(k)) || {}).id, [who, n]);
  expect(id, `việc bước ${n} của ${who}`).toBeTruthy();
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('Danh sách KHLCNT: trạng thái KHL theo bước MS18, cột tiến độ và vướng mắc', async ({ page }) => {
  await fresh(page, '#/khlcnt');
  await expect(page.locator('main .vtable thead th')).toContainText(['Trạng thái', 'Mã KHLCNT', 'Tên KHLCNT', ...PROG]);
  // Mẫu quy đổi trạng thái cũ (§2).
  await expect(row(page, 'KHLCNT-2026-0017')).toContainText('Nháp KHLCNT');
  await expect(row(page, 'KHLCNT-2026-0017')).toContainText('Chưa khởi tạo quy trình');
  await expect(row(page, 'KHLCNT-2026-0016')).toContainText('Đang kiểm tra/thẩm định KHLCNT');
  await expect(row(page, 'KHLCNT-2026-0016')).toContainText('12. Thẩm định KHLCNT');
  await expect(row(page, 'KHLCNT-2026-0016')).toContainText('Hoàng Quốc Bình');
  await expect(row(page, 'KHLCNT-2026-0016')).toContainText('Hình thức và phương thức lựa chọn nhà thầu: Gói bản quyền');
  await expect(row(page, 'KHLCNT-2026-0014')).toContainText('Hoàn thành KHLCNT');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Chạy MS18 tuyến VHT: các bước đổi trạng thái.
  await as(page, 'thau');
  await page.evaluate(() => Flow.startKh('KHLCNT-2026-0017', { level: 'TCT', name: 'KHLCNT thuê hạ tầng' }));
  const st = () => page.evaluate(() => Thau.khProg(Thau.khOf('KHLCNT-2026-0017')));
  expect((await st()).khl).toBe('KHL-02');
  expect((await st()).step).toContain('3. ');
  await page.evaluate(() => Flow.startKh('KHLCNT-2026-0017', { level: 'TCT', name: 'KHLCNT thuê hạ tầng', target: 8 }));
  let p = await st();
  expect([p.khl, p.issue]).toEqual(['KHL-03', 'Chờ 3 thành viên Tổ thẩm định cam kết']);
  expect(p.who).toContain('Hoàng Quốc Bình');
  await page.evaluate(() => Flow.startKh('KHLCNT-2026-0017', { level: 'TCT', name: 'KHLCNT thuê hạ tầng', target: 10 }));
  p = await st();
  expect([p.khl, p.who]).toEqual(['KHL-04', 'Trung tâm Mua sắm / Phạm Thị Lan']);
  expect(p.due).toMatch(/^\d\d\/\d\d\/2026$/);
  // Trả sửa ở bước 10 → KHL-05, vướng mắc = lý do trả sửa.
  await openTask(page, 'lan', 10);
  await page.locator('.task-acts [data-act]', { hasText: 'Kết quả kiểm tra' }).click();
  await page.locator('[data-ef-radio="khKiemTra::6::kq"][data-v=\'"Không đáp ứng"\']').click();
  await page.locator('[data-ef="khKiemTra::6::nhanXet"]').fill('Giá gói thầu chưa có báo giá đối chứng.');
  await page.locator('[data-ef="khNhanXet"]').fill('Bổ sung cơ sở giá gói thầu.');
  await page.locator('.vmodal #ef-no').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  await goto(page, '#/khlcnt');
  await expect(row(page, 'KHLCNT-2026-0017')).toContainText('Yêu cầu chỉnh sửa KHLCNT');
  await expect(row(page, 'KHLCNT-2026-0017')).toContainText('Trả sửa: Bổ sung cơ sở giá gói thầu.');
  // Lọc theo Trạng thái và Giai đoạn dùng danh mục mới.
  expect(await page.evaluate(() => Object.keys(Thau.KHL))).toEqual(['KHL-01', 'KHL-02', 'KHL-03', 'KHL-04', 'KHL-05', 'KHL-06', 'KHL-07', 'KHL-08', 'KHL-09', 'KHL-10', 'KHL-X']);
  // Chi tiết KHLCNT hiện trạng thái mới.
  await goto(page, '#/khlcnt/KHLCNT-2026-0017');
  await expect(page.locator('.ginfo').first()).toContainText('Yêu cầu chỉnh sửa KHLCNT');
  // Tua hết luồng → Hoàn thành KHLCNT.
  await page.evaluate(() => Flow.startKh('KHLCNT-2026-0017', { level: 'TCT', name: 'KHLCNT thuê hạ tầng', target: 21 }));
  expect((await st()).khl).toBe('KHL-08');
  expect(page.errors).toEqual([]);
});

test('Danh sách gói thầu: trạng thái LC theo backbone, tiến độ và vướng mắc', async ({ page }) => {
  await fresh(page, '#/goi-thau');
  await expect(page.locator('main .vtable thead th')).toContainText(['Trạng thái', 'Mã gói thầu', 'Tên gói thầu', ...PROG]);
  await expect(row(page, 'GT-2026-0029')).toContainText('Đang mở/tiếp nhận hồ sơ');
  await expect(row(page, 'GT-2026-0029')).toContainText('Chỉ có 01 nhà thầu nộp hồ sơ — Chờ Chủ đầu tư quyết định');
  await expect(row(page, 'GT-2026-0022')).toContainText('Đang đánh giá hồ sơ');
  await expect(row(page, 'GT-2026-0022')).toContainText('Đánh giá HSĐX');
  await expect(row(page, 'GT-2026-0030')).toContainText('Đã hủy / Không thực hiện');
  // GT-2026-0034 ở trang 2: kiểm dữ liệu dòng.
  expect(await page.evaluate(() => { const r = Thau.pkRow(Thau.pkOf('GT-2026-0034')); return [r.lc, r.prog.step]; }))
    .toEqual(['CHO-KH', 'KHLCNT-2026-0017: Chưa khởi tạo quy trình']);
  await expect(row(page, 'GT-2026-0021')).toContainText('Hoàn thành lựa chọn nhà thầu');
  await expect(row(page, 'GT-2026-0021')).toContainText('Tạm dừng ký hợp đồng — Đang hiệu lực');
  expect(await page.evaluate(() => Object.keys(Thau.LC).filter((c) => c.startsWith('LC-')))).toEqual(['LC-01', 'LC-02', 'LC-03', 'LC-04', 'LC-05', 'LC-06', 'LC-07', 'LC-08', 'LC-09', 'LC-10', 'LC-11', 'LC-X']);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await page.locator('main .vtable tbody tr', { hasText: 'GT-2026-0029' }).locator('a.link').first().click();
  await expect(page.locator('.ginfo').first()).toContainText('Đang mở/tiếp nhận hồ sơ');
  expect(page.errors).toEqual([]);
});
