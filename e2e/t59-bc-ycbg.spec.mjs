// T59 (D-114) B1, B5, B6, #48 — plan docs/dtms/prototype-T59-review-sheet-1211b.md: chip cho ô chọn nhiều (#43 Q1),
// Top 5 điểm nghẽn ở Báo cáo ĐXMS / KĐT (#52, #53 Q6), Danh sách YCBG bỏ Mã hồ sơ + gộp "Đã nhận báo giá" (#55, #56 Q7),
// cột Kết quả rà soát tồn kho ở Lịch sử rà soát tồn kho (#48).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });

test('#43: Trạng thái ở Danh sách ĐXMS hiện chip; bấm x bỏ một giá trị, không mở danh sách; lọc lại', async ({ page }) => {
  await fresh(page, '#/luong');
  await page.locator('[data-lg="adv"]').click();
  const trig = page.locator('[data-vsel="lgf-st"]');
  await expect(trig.locator('.vsel-label.ph')).toHaveText('Tất cả trạng thái');
  await trig.click();
  const opts = page.locator('.vsel-panel .vsel-opt');
  const a = (await opts.nth(0).textContent()).trim(), b = (await opts.nth(1).textContent()).trim();
  await opts.nth(0).click();
  await opts.nth(1).click();
  await page.keyboard.press('Escape');
  const chips = trig.locator('.vsel-chip:not(.more)');
  await expect(chips).toHaveCount(2);
  await expect(chips.locator('.vsel-chip-l')).toHaveText([a, b]);
  await page.locator('[data-lgadv] button[type="submit"]').click();
  const n2 = await page.locator('main tbody tr.click').count();
  // Bỏ chip đầu: không mở danh sách, còn 1 chip (giá trị thứ hai).
  await page.locator('[data-vsel="lgf-st"] .vsel-chip-x').first().click();
  await expect(page.locator('.vsel-panel')).toHaveCount(0);
  await expect(page.locator('[data-vsel="lgf-st"] .vsel-chip:not(.more)')).toHaveCount(1);
  await expect(page.locator('[data-vsel="lgf-st"] .vsel-chip-l')).toHaveText(b);
  await page.locator('[data-lgadv] button[type="submit"]').click();
  const n1 = await page.locator('main tbody tr.click').count();
  expect(n1).toBeLessThanOrEqual(n2);
  // Bỏ chip cuối → placeholder.
  await page.locator('[data-vsel="lgf-st"] .vsel-chip-x').click();
  await expect(page.locator('[data-vsel="lgf-st"] .vsel-label.ph')).toHaveText('Tất cả trạng thái');
  expect(page.errors).toEqual([]);
});

test('#43: chọn nhiều chip không vừa một hàng thì gộp "+n"', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await fresh(page, '#/luong');
  await page.locator('[data-lg="adv"]').click();
  await page.locator('[data-vsel="lgf-st"]').click();
  const opts = page.locator('.vsel-panel .vsel-opt');
  const n = await opts.count();
  for (let i = 0; i < n; i++) await opts.nth(i).click();
  await page.keyboard.press('Escape');
  const more = page.locator('[data-vsel="lgf-st"] .vsel-chip.more');
  await expect(more).toBeVisible();
  await expect(more).toHaveText(/^\+\d+$/);
  const box = await page.locator('[data-vsel="lgf-st"] .vsel-chips').evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
  expect(box).toBe(true);
});

test('#52, #53: Top 5 điểm nghẽn là khối đầu tiên của Báo cáo ĐXMS và KĐT; KĐT bỏ Theo trạng thái; bấm thanh lọc chi tiết', async ({ page }) => {
  await as(page, 'minh', '#/bao-cao/dxms');
  await expect(page.locator('.bc-card').first().locator('.bc-t')).toHaveText('Top 5 điểm nghẽn quy trình ĐXMS');
  const rowsD = page.locator('.bc-card').first().locator('.bc-hr');
  expect(await rowsD.count()).toBeGreaterThan(0);
  expect(await rowsD.count()).toBeLessThanOrEqual(5);
  await expect(rowsD.first().locator('.bc-hl')).toHaveText(/^Bước [\w.]+ — .+/);
  await expect(rowsD.first().locator('.bc-hb')).toHaveAttribute('data-tip', /hồ sơ quá hạn — trung bình .+ ngày quá hạn/);
  await rowsD.first().click();
  await expect(page.locator('.rp-det h3')).toContainText('Chi tiết — Top 5 điểm nghẽn quy trình ĐXMS: Bước');
  expect(await page.locator('.rp-det tbody tr').count()).toBeGreaterThan(0);
  await go(page, '#/bao-cao/kdt');
  await expect(page.locator('.bc-card').first().locator('.bc-t')).toHaveText('Top 5 điểm nghẽn quy trình KĐT');
  await expect(page.locator('.bc-card .bc-t', { hasText: /^Theo trạng thái$/ })).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('#55, #56: Danh sách YCBG không có cột / ô tìm Mã hồ sơ; Trạng thái không có "Đã nhận báo giá"', async ({ page }) => {
  await fresh(page, '#/ycbg');
  const heads = await page.locator('main thead th').allTextContents();
  expect(heads).not.toContain('Mã hồ sơ');
  expect(heads).toContain('Số báo giá đã nhận');
  await expect(page.locator('main tbody')).not.toContainText('Đã nhận báo giá');
  await page.locator('[data-y="adv"]').click();
  await expect(page.locator('[data-yadv] input[data-yf="hs"]')).toHaveCount(0);
  await page.locator('[data-vsel="yf-st"]').click();
  const labels = (await page.locator('.vsel-panel .vsel-opt').allTextContents()).map((s) => s.trim());
  expect(labels).toEqual(['Nháp', 'Đang chờ báo giá', 'Báo giá đạt', 'Báo giá không đạt', 'Đã huỷ']);
  // Lọc Đang chờ báo giá gồm cả YCBG đã nhận báo giá (trạng thái nội bộ GOT).
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Đang chờ báo giá' }).click();
  await page.keyboard.press('Escape');
  await page.locator('[data-yadv] button[type="submit"]').click();
  const want = await page.evaluate(() => Ycbg.allYcbg('all').filter((y) => y.status === 'WAIT' || y.status === 'GOT').length);
  await expect(page.locator('.vpager')).toBeVisible();
  const total = await page.evaluate(() => [...document.querySelectorAll('main tbody tr.click')].length);
  expect(total).toBe(Math.min(10, want));
  // Xuất excel không có cột Mã hồ sơ.
  const dl = page.waitForEvent('download');
  await page.locator('[data-y="export"]').click();
  const path = await (await dl).path();
  const fs = await import('node:fs');
  expect(fs.readFileSync(path, 'utf8').split(/\r?\n/)[0]).not.toContain('Mã hồ sơ');
  expect(page.errors).toEqual([]);
});

test('#48: Lịch sử rà soát tồn kho có cột Kết quả rà soát tồn kho (tên tệp, tải được)', async ({ page }) => {
  await fresh(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0077'));
  await page.locator('.dx-tabs [data-dtab], .dx-tabs [data-ltab]', { hasText: 'Rà soát tồn kho' }).first().click();
  const h = card(page, 'Lịch sử rà soát tồn kho');
  const heads = await h.locator('thead th').allTextContents();
  expect(heads).toContain('Kết quả rà soát tồn kho');
  expect(heads).not.toContain('Hồ sơ');
  await expect(h.locator('tbody tr').first().locator('[data-dl]')).toHaveCount(1);
  await expect(h.locator('tbody tr').first().locator('[data-dl] svg')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});
