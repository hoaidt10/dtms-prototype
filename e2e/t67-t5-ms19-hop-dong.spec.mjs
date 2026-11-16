// T67 T5 (D-118): MS19 Tổ chức LCNT theo từng gói (BPMN-MS19; Q7 = A — rộng rãi 1 túi, chỉ định thầu chi tiết, hình thức khác một bước gộp);
// H1–H5 (từ T66): danh mục Mẫu hợp đồng (BM-HD-2026), mẫu ở HSMT, MS22 bước 3 đọc mẫu, Chi tiết hợp đồng theo mẫu, Danh sách hợp đồng theo hệ thống cũ.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|ngoài BPMN/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const tab = (page, key) => page.locator(`.dx-tabs [data-ttab="${key}"]`).click();
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const lc = (page, code) => page.evaluate((c) => Thau.pkRow(Thau.pkOf(c)).lc, code);
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => (Flow.caseTokens(w).find((t) => String(t.task) === String(k)) || {}).id, [who, n]);
  expect(id, `việc bước ${n} của ${who}`).toBeTruthy();
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('MS19 rộng rãi 1 túi (GT-2026-0029): đánh giá → thương thảo → KQLCNT → ký → công khai → gói Chuyển ký hợp đồng, tab đọc biến', async ({ page }) => {
  const G = 'GT-2026-0029';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'thau');
  await goto(page, '#/goi-thau/' + G);
  await expect(card(page, 'Theo dõi lựa chọn nhà thầu')).toContainText('Đang mở/tiếp nhận hồ sơ');
  await page.locator(`[data-lc-sample="${G}"]`).click();
  await expect(page).toHaveURL(/#\/task\/HSLC-2026-0029:k/);
  expect(await lc(page, G)).toBe('LC-06');
  // Timeline hồ sơ: bước con 3.x, không có quy trình con của hình thức khác.
  await expect(page.locator('main')).toContainText('Đánh giá HSDT');
  await expect(page.locator('main')).not.toContainText('Lập, phê duyệt HSYC');
  // Tab Hồ sơ mời thầu đọc eForm 3.1: mẫu hợp đồng gợi ý theo loại gói (MS_HH → 1.0).
  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'hs');
  await expect(page.locator('main')).toContainText('1.0 — HĐ hàng hóa sẵn có');
  await expect(page.locator('main')).toContainText('10 / 30 / 60');
  await tab(page, 'dg');
  await expect(page.locator('main')).toContainText('được cập nhật ở bước 3.5. Đánh giá HSDT');
  // 3.5 đánh giá, 3.6 thương thảo qua eForm.
  await openTask(page, 'thau', '3.5');
  await act(page, 'Hoàn thành đánh giá'); await ok(page); await done(page);
  await openTask(page, 'thau', '3.6');
  await act(page, 'Hoàn thành thương thảo');
  await page.locator('[data-ef="lcNoiDungTT"]').fill('Thống nhất tiến độ giao hàng 120 ngày.');
  await ok(page); await done(page);
  expect(await lc(page, G)).toBe('LC-08');
  // 14 thẩm định không đạt → 15 → 13 → 14 đạt; vướng mắc = lý do trả sửa.
  await page.evaluate(() => Flow.startLc('GT-2026-0029', { name: 'x', target: 14 }));
  await openTask(page, 'lan', 14);
  await act(page, 'Kết quả thẩm định KQLCNT');
  await page.locator('[data-ef="lcYKienKq"]').fill('Bổ sung biên bản làm rõ HSDT.');
  await page.locator('.vmodal #ef-no').click();
  await done(page);
  expect(await page.evaluate(() => Thau.pkRow(Thau.pkOf('GT-2026-0029')).prog.issue)).toBe('Trả sửa: Bổ sung biên bản làm rõ HSDT.');
  // Tua tới hết: lcFlowDone ghi KQLCNT, gói LC-10, nút Tạo hợp đồng.
  await page.evaluate(() => Flow.startLc('GT-2026-0029', { name: 'x', target: 'END' }));
  expect(await lc(page, G)).toBe('LC-10');
  await goto(page, '#/goi-thau/' + G);
  await expect(page.locator('[data-go^="hop-dong/create/"]')).toHaveCount(1);
  await tab(page, 'dg');
  await expect(card(page, 'Kết quả lựa chọn nhà thầu')).toContainText('/QĐ-VHT');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('MS19 chỉ định thầu (GT-2026-0022) và bước gộp (GT-2026-0034 Đặt hàng) theo hình thức; KHLCNT Hoàn thành mở Khởi tạo tổ chức LCNT', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'thau');
  await page.evaluate(() => Flow.startLc('GT-2026-0022', { name: 'x', target: '7.3' }));
  expect(await lc(page, 'GT-2026-0022')).toBe('LC-06');
  expect(await page.evaluate(() => Flow.caseOf('HSLC-2026-0022').history.map((h) => String(h.task)).filter((t) => t.startsWith('7')))).toEqual(['7.1', '7.2']);
  // KHLCNT-2026-0017 (Đặt hàng) hoàn thành MS18 → gói chờ Khởi tạo tổ chức LCNT (LC-01) → bước gộp 9.
  await page.evaluate(() => Flow.startKh('KHLCNT-2026-0017', { level: 'TCT', name: 'x', target: 'END' }));
  expect(await lc(page, 'GT-2026-0034')).toBe('LC-01');
  await goto(page, '#/goi-thau/GT-2026-0034');
  await page.locator('[data-lc-start="GT-2026-0034"]').click();
  await expect(page).toHaveURL(/#\/task\/HSLC-2026-0034:k/);
  await act(page, 'Khởi tạo tổ chức LCNT');
  await page.locator('[data-ef-chk="lcDaKiemTra"]').check();
  await ok(page); await done(page);
  await openTask(page, 'thau', 9);
  await act(page, 'Hoàn thành');
  await expect(page.locator('.vmodal')).toContainText('Gửi HSYC; nhận HSĐX');
  expect(await page.locator('.vmodal').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('H1–H5: danh mục Mẫu hợp đồng 30 dòng; MS22 bước 3 đọc mẫu 1.6; Chi tiết hợp đồng kế hoạch 10 / 30 / 60; Danh sách hợp đồng cột và lọc mới', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  expect(await page.evaluate(() => Catalog.rows('mau-hop-dong').length)).toBe(30);
  expect(await page.evaluate(() => D.mauOf('1.6').tt)).toBe('10 / 30 / 60');
  // H4: HĐ-2026-0052 — mẫu 1.6, kế hoạch 19,12 / 76,48 / 114,72.
  await as(page, 'phd');
  await goto(page, '#/hop-dong/' + encodeURIComponent('HĐ-2026-0052'));
  await expect(page.locator('.ginfo').first()).toContainText('1.6 — HĐ hàng hóa sẵn có và dịch vụ');
  const plan = await page.evaluate(() => HopDong.planOf(HopDong.find('HĐ-2026-0052')).rows.map((r) => r[3]));
  expect(plan).toEqual([19.12, 76.48, 114.72]);
  // H3: MS22 bước 3 — mẫu chỉ xem, bảng Thông tin điền vào mẫu.
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await page.locator('[data-hd-newcase]').click();
  await expect(page).toHaveURL(/#\/task\/HSHD-2026-0052:k/);
  await act(page, 'Hoàn thành tiếp nhận');
  await page.locator('[data-ef-chk="hdDuHoSo"]').check();
  await ok(page); await done(page);
  await openTask(page, 'phd', 3);
  await act(page, 'Hoàn thành body và phụ lục giá');
  await expect(page.locator('.vmodal')).toContainText('1.6 — HĐ hàng hóa sẵn có và dịch vụ');
  await expect(page.locator('.vmodal')).toContainText('so_qd_phe_duyet_kqlcnt');
  await expect(page.locator('.vmodal')).toContainText('Chưa cấp số');
  await expect(page.locator('[data-vsel="ef-hdMau"]')).toHaveCount(0);
  // H5: Danh sách hợp đồng — cột mới, lọc Giao hàng chậm.
  await page.locator('.vmodal [data-close]').first().click();
  await goto(page, '#/hop-dong');
  await expect(page.locator('main .vtable thead')).toContainText('Còn phải thanh toán (tỷ đồng)');
  await expect(page.locator('main .vtable thead')).toContainText('Hình thức ký');
  const late = await page.evaluate(() => HopDong.all().filter((h) => HopDong.lateMs(h).length).length);
  await page.locator('[data-tl="hdl:adv"]').click();
  await page.locator('[data-vsel="tf-hdl-dlLate"]').click();
  await page.locator('.vsel-panel [data-opt="CO"]').click();
  await page.locator('[data-tadv="hdl"] button[type="submit"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(late || 1);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
