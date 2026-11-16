// @ts-check
// T71 S5 (D-121): Bán thành phẩm & tiến độ — tab của dự án, SX-11 Cập nhật sản lượng (nhập tay / trạm đo VMMS), cảnh báo chậm / nguy cơ chậm; bước 9 kế hoạch đọc nhật ký.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const row = (page, text) => page.locator('[data-sx-btp] section').first().locator('tbody tr', { hasText: text });
const ok = (page) => page.locator('.vmodal #ok').click();
const tab = async (page) => { await page.locator('[data-ttab="btp"]').click(); await expect(page.locator('[data-sx-btp]')).toBeVisible(); };

test('Gia công theo lô (DA-003, vai Nhà máy): lấy số từ trạm đo, nhập tay vượt còn lại bị chặn, lô xong cập nhật tab Kế hoạch & mốc', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxnm', '#/sx/du-an/DA-SX-2026-003');
  await tab(page);
  await expect(page.locator('[data-sx-btp] section').first().locator('tbody tr')).toHaveCount(6);
  await expect(row(page, 'Lô 5')).toContainText('12.000');
  await expect(row(page, 'Lô 5')).toContainText('Chậm tiến độ');
  await expect(row(page, 'Lô 1').locator('[data-btp-up]')).toHaveCount(0); // lô đã xong
  await expect(page.locator('[data-btp-vmms]')).toContainText('HP-FCT-02');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Trạm đo: lũy kế 12.500 − đã nhập 12.000 = 500.
  await row(page, 'Lô 5').locator('[data-btp-up]').click();
  await page.locator('.vmodal [data-ef-radio="src"]').nth(1).click();
  await expect(page.locator('.vmodal [data-ef="qty"]')).toHaveCount(0);
  await ok(page);
  await expect(row(page, 'Lô 5')).toContainText('12.500');
  await expect(page.locator('.toast').last()).toContainText('vẫn chậm tiến độ');
  // Nhập tay: vượt số còn lại (7.500) bị chặn; đúng thì lô hoàn thành.
  await row(page, 'Lô 5').locator('[data-btp-up]').click();
  await page.locator('.vmodal [data-ef="qty"]').fill('8000');
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef="qty"]').fill('7500');
  await page.locator('.vmodal [data-ef="note"]').fill('Hoàn thành lô 5');
  await ok(page);
  await expect(row(page, 'Lô 5')).toContainText('Hoàn thành');
  await expect(page.locator('[data-sx-btp]')).toContainText('Hoàn thành lô 5');
  await page.locator('[data-ttab="plan"]').click();
  await expect(page.locator('[data-sx-plan] tbody tr', { hasText: 'Lô 5' })).toContainText('100%');
  await expect(page.locator('[data-sx-plan] tbody tr', { hasText: 'Lô 5' })).toContainText('16/11/2026');
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody tr').first()).toContainText('Cập nhật sản lượng');
  expect(page.errors).toEqual([]);
});

test('VMC theo mốc (DA-001): % lũy kế phải lớn hơn hiện tại, ngày không sau hôm nay; Sub PM không cập nhật mốc VMC', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await tab(page);
  await expect(page.locator('[data-sx-btp]')).toContainText('Theo dõi theo mốc tổng');
  await expect(row(page, 'Hoàn thành chế tạo, tích hợp')).toContainText('55%');
  await row(page, 'Hoàn thành chế tạo, tích hợp').locator('[data-btp-up]').click();
  await page.locator('.vmodal [data-ef="qty"]').fill('50');
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef="ngay"]').fill('20/11/2026');
  await page.locator('.vmodal [data-ef="ngay"]').press('Tab');
  await page.locator('.vmodal [data-ef="qty"]').fill('80');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('không được sau ngày hiện tại');
  await page.locator('.vmodal [data-ef="ngay"]').fill('16/11/2026');
  await ok(page);
  await expect(row(page, 'Hoàn thành chế tạo, tích hợp')).toContainText('80%');
  await as(page, 'sxsub', '#/sx/du-an/DA-SX-2026-001');
  await tab(page);
  await expect(page.locator('[data-btp-up]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Tự sản xuất (DA-002): chưa sản xuất thì không cập nhật; đang sản xuất thì Sub PM cập nhật bán thành phẩm, hết nguy cơ chậm', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxsub', '#/sx/du-an/DA-SX-2026-002');
  await tab(page);
  await expect(page.locator('[data-sx-btp]')).toContainText('Dự án chưa bắt đầu sản xuất');
  await expect(page.locator('[data-btp-up]')).toHaveCount(0);
  await expect(page.locator('[data-sx-btp] .hd-alert.warning')).toContainText('nguy cơ chậm');
  await page.evaluate(() => SxDuAn.patch('DA-SX-2026-002', { status: 'IN_PRODUCTION' }));
  await as(page, 'sxsub', '#/sx/du-an/DA-SX-2026-002');
  await tab(page);
  await expect(page.locator('[data-btp-up]')).toHaveCount(5);
  await row(page, 'Khối nguồn').locator('[data-btp-up]').click();
  await page.locator('.vmodal [data-ef="qty"]').fill('11');
  await ok(page);
  await expect(row(page, 'Khối nguồn')).toContainText('Đang thực hiện');
  expect(await page.evaluate(() => SxBtp.items(SxDuAn.byCode('DA-SX-2026-002')).find((x) => x.key === 'BTP3').r.pct)).toBe(92);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
