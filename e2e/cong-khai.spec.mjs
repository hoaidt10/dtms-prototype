// T16 — Công khai & tích hợp đấu thầu (SCR-94, Backlog W1_T10 dòng 409–415): QC-12869 Điều 26, BPMN-MS18 bước 54–60.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const open = async (page) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { location.hash = '#/ph/cong-khai-thau'; });
  await expect(page).toHaveURL(/#\/cong-khai-thau$/);
  await expect(page.locator('.pg-title')).toHaveText('Công khai & tích hợp đấu thầu');
  // D-76: menu Thầu ẩn ở bản demo ĐXMS — bật cờ để kiểm mục menu.
  await page.evaluate(() => { D.show.menuThau = true; App.render(); });
};
const row = (page, id) => page.locator('main .vtable tbody tr', { has: page.locator(`[data-ck-pub="${id}"]`) });

test('Công khai: menu mở màn thật; tin sinh từ dữ liệu thầu; hạn theo Điều 26; không chữ BA', async ({ page }) => {
  await open(page);
  await expect(page.locator('.sb-nav .nav.active')).toHaveText('Công khai & tích hợp đấu thầu');
  expect(await mainText(page)).not.toMatch(BA);
  const it = await page.evaluate(() => CongKhai.items().map((x) => [x.id, x.st, x.due, x.sys]));
  expect(it.length).toBe(18);
  const by = Object.fromEntries(it.map(([id, ...r]) => [id, r]));
  expect(by['KHLCNT:KHLCNT-2026-0009:v2']).toEqual(['ERR', '07/10/2026', 'VTB']);
  expect(by['BBMT:GT-2026-0029']).toEqual(['WAIT', '03/10/2026 10:00', 'VTB']);
  expect(by['KQ:GT-2026-0021']).toEqual(['WAIT', '12/10/2026', 'VTB']);
  expect(by['TBMT:GT-2026-0024'][2]).toBe('DTQG');
  expect(await page.evaluate(() => CongKhai.addWork('02/10/2026', 5))).toBe('09/10/2026');
  // Tin chưa đăng lên đầu danh sách, có tình trạng hạn.
  await expect(row(page, 'KHLCNT:KHLCNT-2026-0009:v2')).toContainText('Đến hạn hôm nay');
  await expect(row(page, 'BBMT:GT-2026-0029')).toContainText('Quá hạn 4 ngày');
  await expect(row(page, 'KQ:GT-2026-0021')).toContainText('Còn 5 ngày');
  // Tìm kiếm nâng cao theo hệ thống đăng tải.
  await page.locator('[data-tl="ckt:adv"]').click();
  await page.locator('[data-vsel="tf-ckt-sys"]').click();
  await page.locator('.vsel-panel [data-opt="DTQG"]').click();
  await page.locator('[data-tadv="ckt"] button[type="submit"]').click();
  await expect(page.locator('main .vtable tbody tr')).toHaveCount(3);
  expect(page.errors).toEqual([]);
});

test('Công khai: Xác nhận đăng tải bắt buộc rà soát thông tin mật; Gửi lại tin lỗi; nhật ký ghi nhận', async ({ page }) => {
  await open(page);
  await page.locator('[data-ck-pub="KQ:GT-2026-0021"]').click();
  const dlg = page.locator('.vmodal');
  await expect(dlg.locator('h3')).toHaveText('Xác nhận đăng tải');
  await expect(dlg).toContainText('Tên nhà thầu trúng thầu, giá trúng thầu');
  await dlg.locator('#ck-ok').click();
  await expect(dlg.locator('#ck-f1 .msg')).toBeVisible();
  await dlg.locator('#ck-secret').check();
  await dlg.locator('#ck-ok').click();
  expect(await lastToast(page)).toContain('Đăng tải KQLCNT GT-2026-0021 lên Cổng đấu thầu Viettel thành công');
  await expect(page.locator('[data-ck-pub="KQ:GT-2026-0021"]')).toHaveCount(0);
  // Gửi lại tin lỗi (BPMN-MS18 bước 60).
  await page.locator('[data-ck-pub="KHLCNT:KHLCNT-2026-0009:v2"]').click();
  await expect(dlg.locator('h3')).toHaveText('Gửi lại tin đăng tải');
  await expect(dlg.locator('.hd-alert.error')).toContainText('Quyết định điều chỉnh KHLCNT');
  await dlg.locator('#ck-secret').check();
  await dlg.locator('#ck-ok').click();
  expect(await lastToast(page)).toContain('Đăng tải KHLCNT KHLCNT-2026-0009');
  expect(await page.evaluate(() => CongKhai.items().find((x) => x.id === 'KHLCNT:KHLCNT-2026-0009:v2').st)).toBe('OK');
  // Nhật ký đồng bộ.
  await page.locator('[data-ck-tab="log"]').click();
  await expect(page.locator('main .vtable tbody tr').first()).toContainText('Đăng tải KHLCNT (gửi lại)');
  await expect(page.locator('main .vtable tbody tr').nth(1)).toContainText('Đăng tải KQLCNT');
  // Kết nối & thời hạn.
  await page.locator('[data-ck-tab="cfg"]').click();
  await expect(page.locator('main section.vcard').first().locator('tbody tr')).toHaveCount(2);
  await expect(page.locator('main section.vcard').nth(1).locator('tbody tr')).toHaveCount(7);
  await expect(page.locator('main section.vcard').nth(1)).toContainText('24 giờ');
  expect(await mainText(page)).not.toMatch(BA);
  // Hàng mở đối tượng nguồn.
  await page.locator('[data-ck-tab="dt"]').click();
  await page.locator('main .vtable tbody tr', { hasText: 'Biên bản mở thầu' }).first().locator('a.link').click();
  await expect(page).toHaveURL(/#\/goi-thau\/GT-2026-00\d\d$/);
  expect(page.errors).toEqual([]);
});
