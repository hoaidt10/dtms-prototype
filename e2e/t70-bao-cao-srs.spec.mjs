// T70 — prototype Báo cáo theo SRS 30 Khuôn chung Báo cáo V0.4 và SRS 31 Báo cáo tình hình ĐXMS V0.4
// (review V0.3 của Châu 13/11/2026, D-120): Quý / Tháng, tiền theo đồng, thứ tự thanh, trạng thái theo vòng đời,
// Lĩnh vực khác, 11 cột + sắp xếp mặc định, cột Tính vào tổng trong tệp xuất.
import { test, expect } from '@playwright/test';
import fs from 'fs';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 90_000 });
const tile = (page, label) => page.locator('.rp-tile', { has: page.locator('.t', { hasText: new RegExp('^' + label + '$') }) });
const card = (page, title) => page.locator('.bc-card', { has: page.locator('.bc-t', { hasText: new RegExp('^' + title + '$') }) });
const nums = async (loc) => (await loc.allInnerTexts()).map((t) => Number(t.replace(/\D/g, '')));
const pick = async (page, id, text) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: text }).first().click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};

test('SRS 31: phụ đề đồng, bốn thẻ, nhãn khoảng giá trị, thanh giảm dần, không có "Chưa xác định"', async ({ page }) => {
  await fresh(page, '#/bao-cao/dxms');
  await expect(tile(page, 'Tổng số ĐXMS').locator('.d')).toHaveText(/^[\d.]+ đồng — bản tính vào tổng$/);
  await expect(page.locator('main')).not.toContainText('tỷ đồng — bản hiệu lực');
  await expect(page.locator('.bc-card .bc-t')).toHaveText(['Top 5 điểm nghẽn quy trình ĐXMS', 'Theo đơn vị đề xuất', 'Theo lĩnh vực', 'Theo khoảng giá trị']);
  await expect(card(page, 'Theo khoảng giá trị').locator('.bc-hl')).toHaveText(['Dưới 20 tỷ đồng', 'Từ 20 đến dưới 100 tỷ đồng', 'Từ 100 tỷ đồng']);
  for (const t of ['Theo đơn vị đề xuất', 'Theo lĩnh vực']) {
    const v = await nums(card(page, t).locator('.bc-hv'));
    expect(v).toEqual([...v].sort((a, b) => b - a));
  }
  await expect(card(page, 'Theo lĩnh vực')).toContainText('Lĩnh vực khác');
  await expect(page.locator('main')).not.toContainText('Chưa xác định');
  await page.locator('[data-vsel="rp-dxms:dxms-field"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).not.toContainText(['Chưa xác định']);
  await page.keyboard.press('Escape');
  expect(page.errors).toEqual([]);
});

test('SRS 31 BR-BDX-01-06, 01-07: 11 cột, sắp xếp theo thứ tự mặc định, Giá trị theo đồng có "*", tệp xuất thêm Tính vào tổng', async ({ page }) => {
  await fresh(page, '#/bao-cao/dxms');
  const det = page.locator('.rp-det');
  const heads = (await det.locator('thead th').allInnerTexts()).map((h) => h.replace(/[▲▼↕]/g, '').trim());
  expect(heads).toEqual(['STT', 'Mã ĐXMS', 'Tên đề xuất mua sắm', 'Đề tài / dự án', 'Đơn vị đề xuất', 'Lĩnh vực', 'Nguồn kinh phí', 'Trạng thái', 'Giá trị (đồng)', 'Điều chỉnh từ', 'Ngày tạo']);
  const dates = await det.locator('tbody tr td:last-child').allInnerTexts();
  const key = (d) => d.split('/').reverse().join('');
  expect(dates.map(key)).toEqual([...dates.map(key)].sort().reverse());
  await expect(det.locator('tbody tr', { hasText: 'ĐXMS-2026-0126' })).toContainText('(điều chỉnh lần 1)');
  // Trang chứa 0126: giá trị "*" theo đồng
  await page.locator('[data-ps-open]').first().click();
  await page.locator('[data-ps="50"]').first().click();
  const r126 = det.locator('tbody tr', { hasText: 'ĐXMS-2026-0126' });
  await expect(r126).toContainText('248.900.000.000*');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('[data-rp-export]').click()]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  const head = csv.split('\n')[0];
  expect(head).toContain('"Tính vào tổng"');
  expect(csv).toMatch(/"ĐXMS-2026-0126".*"248900000000".*"Không"/);
  expect(page.errors).toEqual([]);
});

test('SRS 30 BR-BCC-01-02: Quý, Tháng khoá khi chưa chọn Năm; chọn Tháng xoá Quý; lọc theo quý', async ({ page }) => {
  await fresh(page, '#/bao-cao/dxms');
  const f = page.locator('.rp-filter');
  await expect(f.locator('label', { hasText: /^Quý$/ })).toBeVisible();
  await expect(f.locator('[data-vsel="rp-dxms:dxms-q"]')).toHaveClass(/dis/);
  await expect(f.locator('[data-vsel="rp-dxms:dxms-m"]')).toHaveClass(/dis/);
  const n0 = Number(await tile(page, 'Tổng số ĐXMS').locator('.n').innerText());
  await pick(page, 'rp-dxms:dxms-year', '2026');
  await pick(page, 'rp-dxms:dxms-q', 'Quý III');
  await pick(page, 'rp-dxms:dxms-m', 'Tháng 9');
  await expect(f.locator('[data-vsel="rp-dxms:dxms-q"] .vsel-label')).toHaveClass(/ph/);
  await pick(page, 'rp-dxms:dxms-q', 'Quý III');
  await page.locator('[data-rpa="dxms:dxms:go"]').click();
  const n1 = Number(await tile(page, 'Tổng số ĐXMS').locator('.n').innerText());
  expect(n1).toBeLessThan(n0);
  const dates = await page.locator('.rp-det tbody tr td:last-child').allInnerTexts();
  for (const d of dates) expect(['07', '08', '09']).toContain(d.split('/')[1]);
  // Tổng quan không có Quý, Tháng (SRS 34 BR-TQ-01-01)
  await page.evaluate(() => { location.hash = '#/tong-quan'; });
  await expect(page.locator('.rp-filter')).toBeVisible();
  await expect(page.locator('.rp-filter label', { hasText: /^Quý$/ })).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('SRS 30 BR-BCC-01-03, 02-03, C-06: trạng thái theo vòng đời (ô lọc + thẻ), tiền ở mọi báo cáo theo đồng', async ({ page }) => {
  await fresh(page, '#/bao-cao/dxms');
  await page.locator('[data-vsel="rp-dxms:dxms-st"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Chưa khởi tạo', 'Đang phê duyệt', 'Đã phê duyệt', 'Đang điều chỉnh', 'Đã được điều chỉnh', 'Dừng xử lý']);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { location.hash = '#/bao-cao/hop-dong'; });
  await page.locator('[data-rptab="hop-dong:tinh-hinh"]').click();
  await expect(card(page, 'Theo trạng thái').locator('.bc-hl')).toHaveText(['Đang thương thảo', 'Đang trình ký', 'Đang thực hiện', 'Đang thanh lý', 'Đã thanh lý', 'Chấm dứt']);
  await expect(tile(page, 'Tổng số hợp đồng').locator('.d')).toHaveText(/^[\d.]+ đồng$/);
  for (const g of ['tong-hop', 'dxms', 'kdt', 'lcnt', 'hop-dong', 'tien-do']) {
    await page.evaluate((x) => { location.hash = '#/bao-cao/' + x; }, g);
    await expect(page.locator('.rp-det')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('tỷ đồng)');
  }
  expect(page.errors).toEqual([]);
});
