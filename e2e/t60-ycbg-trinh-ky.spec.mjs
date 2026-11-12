// T60 — review sheet 12/11 (Nhi) #58, #63–#68: YCBG thêm Khối đơn vị, Lịch sử xử lý giảm dần, bỏ Kênh gửi,
// Giá trị báo giá cuối cùng khi Báo giá đạt; Trình ký: Đã thu hồi / Đã hủy bỏ Gửi lại, Lỗi gửi giữ.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const dk = (s) => { const [d, m, y] = s.trim().split('/'); return `${y}${m}${d}`; };

test('#58: Khối đơn vị lọc danh sách Đơn vị đề xuất và kết quả', async ({ page }) => {
  page.errors = []; page.on('pageerror', (e) => page.errors.push(String(e)));
  await fresh(page, '#/ycbg');
  await page.locator('[data-y="adv"]').click();
  await page.locator('[data-vsel="yf-block"]').click();
  const blocks = page.locator('.vsel-panel .vsel-opt');
  await expect(blocks.first()).toBeVisible();
  const blk = (await blocks.first().textContent()).trim();
  await blocks.first().click();
  await page.locator('[data-vsel="yf-unit"]').click();
  const shown = (await page.locator('.vsel-panel .vsel-opt').allTextContents()).map((s) => s.trim());
  const ok = await page.evaluate(({ shown, blk }) => shown.every((u) => D.blockOf(u) === blk), { shown, blk });
  expect(ok).toBe(true);
  await page.keyboard.press('Escape');
  await page.locator('[data-yadv] button[type="submit"]').click();
  const rowsUnits = await page.locator('main tbody tr').allTextContents();
  expect(rowsUnits.length).toBeGreaterThan(0);
  expect(page.errors).toEqual([]);
});

test('#63–#66: Chi tiết YCBG đạt — lịch sử giảm dần, bỏ Kênh gửi, có Giá trị báo giá cuối cùng, giữ Hiệu lực đến', async ({ page }) => {
  page.errors = []; page.on('pageerror', (e) => page.errors.push(String(e)));
  await fresh(page, '#/ycbg');
  await go(page, '#/ycbg-kdt/' + encodeURIComponent('YCBG-KĐT-2026-0031-01'));
  const gen = card(page, 'Thông tin chung');
  await expect(gen).toContainText('Báo giá đạt');
  await expect(gen).not.toContainText('Kênh gửi');
  await expect(gen).toContainText('Giá trị báo giá cuối cùng (tỷ đồng)');
  const v = gen.locator('div', { has: page.locator('.k', { hasText: 'Giá trị báo giá cuối cùng' }) }).last().locator('.v');
  await expect(v).toHaveText(/\d/);
  await expect(card(page, 'Nhà cung cấp nhận yêu cầu').locator('thead')).toContainText('Hiệu lực đến');
  const dates = await card(page, 'Lịch sử xử lý').locator('tbody tr td:nth-child(2)').allTextContents();
  expect(dates.length).toBeGreaterThan(2);
  for (let i = 1; i < dates.length; i++) expect(dk(dates[i - 1]) >= dk(dates[i])).toBe(true);
  await expect(card(page, 'Lịch sử xử lý').locator('tbody tr').last()).toContainText('Khởi tạo yêu cầu báo giá');
  expect(page.errors).toEqual([]);
});

test('#68: Trình ký — Đã thu hồi không còn Gửi lại; Lỗi gửi vẫn Gửi lại', async ({ page }) => {
  page.errors = []; page.on('pageerror', (e) => page.errors.push(String(e)));
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.setPersona('tgd'); location.hash = '#/trinh-ky'; });
  const rc = page.locator('[data-tkl] tr[data-tk-id]', { hasText: 'ĐXMS-2026-0072' });
  await expect(rc).toHaveCount(1);
  await expect(rc.locator('[data-tk-act]')).toHaveCount(1);
  await expect(rc.locator('[data-tk-act="view"]')).toHaveCount(1);
  await page.evaluate(() => { Flow.setPersona('hai'); App.render(); });
  const fail = page.locator('[data-tkl] tr[data-tk-id]', { hasText: 'BM-03' }).filter({ hasText: 'ĐXMS-2026-0124' });
  await expect(fail.locator('[data-tk-act="resend"]')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});
