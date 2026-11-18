// T69 — Tổng quan theo SRS 34 V0.1 (docs/SRS/34-srs-tong-quan, lệch L1–L10 ở B0-ra-nguon.md §3): tiền theo đồng, mô tả ô, nhóm gói thầu theo LC,
// gói chậm theo kỳ kế hoạch / việc quá hạn, Hồ sơ cần chú ý gói thầu có sắp đến hạn + Bước hiện tại, cùng số ngày theo Mã, ĐXMS không tính vào tổng kèm "*",
// ngăn chi tiết Mã giảm dần, tên tệp xuất Tong_quan_{tab}_{chỉ số}_….
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const tile = (page, label) => page.locator('.tq-m', { has: page.locator('.t', { hasText: new RegExp('^' + label + '$') }) });
const stN = (page, label) => page.locator('.tq-st', { has: page.locator('.tq-st-l', { hasText: new RegExp('^' + label + '$') }) }).locator('.tq-st-n');
const att = (page) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: 'Hồ sơ cần chú ý' }) });
const attCodes = (page) => att(page).locator('tbody tr td:nth-child(2)').allTextContents();

test('L1, L2, L7: tiền theo đồng, mô tả ô theo SRS; Hồ sơ cần chú ý cùng số ngày xếp theo Mã', async ({ page }) => {
  page.errors = []; page.on('pageerror', (e) => page.errors.push(String(e)));
  await fresh(page, '#/tong-quan');
  await expect(tile(page, 'Tổng giá trị ĐXMS').locator('.n')).toHaveText('2.145.400.000.000 đồng'); // 17/11: + 6 ĐXMS nguồn KHLCNT
  await expect(tile(page, 'Tổng giá trị ĐXMS').locator('.d')).toHaveText('Đồng · giá trị bản tính vào tổng');
  await expect(tile(page, 'ĐXMS quá hạn xử lý').locator('.d')).toHaveText('Chưa hoàn tất, vượt hạn xử lý');
  await expect(att(page).locator('thead')).toContainText('Giá trị (đồng)');
  expect((await attCodes(page)).map((s) => s.trim().slice(-4))).toEqual(['0101', '0134', '0121', '0128', '0135', '0129', '0136', '0130', '0137']);
  await page.locator('[data-tq4="hd"]').click();
  await expect(tile(page, 'Giá trị đã thanh toán').locator('.n')).toHaveText('124.780.000.000 đồng'); // 17/11: + 14 hợp đồng mẫu
  await expect(tile(page, 'Giá trị còn phải thanh toán').locator('.n')).toHaveText('324.991.000.000 đồng');
  expect(page.errors).toEqual([]);
});

test('L10, L5, L6: gói thầu theo LC; chậm theo kỳ kế hoạch; Hồ sơ cần chú ý thêm sắp đến hạn, cột Bước hiện tại', async ({ page }) => {
  await fresh(page, '#/tong-quan');
  await page.locator('[data-tq4="goi"]').click();
  for (const [l, n] of [['Đang LCNT', '8'], ['Chờ phê duyệt kết quả', '1'], ['Đã có kết quả', '8'], ['Chậm tiến độ', '5']]) await expect(stN(page, l)).toHaveText(n);
  await expect(tile(page, 'Tổng giá gói thầu đã duyệt').locator('.n')).toHaveText('628.600.000.000 đồng'); // 17/11: + gói của KHLCNT-2026-0001 / 0002 / 0005 / 0007 (110,0 tỷ)
  await expect(att(page).locator('thead')).toContainText('Bước hiện tại');
  expect((await attCodes(page)).map((s) => s.trim())).toEqual(['GT-2026-0024', 'GT-2026-0026', 'GT-2026-0045', 'GT-2026-0046', 'GT-2026-0047', 'GT-2026-0029', 'GT-2026-0048', 'GT-2026-0022']); // 17/11: + gói Quý III/2026 chưa có kết quả
  const rows = att(page).locator('tbody tr');
  await expect(rows.nth(0)).toContainText('Quý III/2026');
  await expect(rows.nth(0)).toContainText('Chậm tiến độ');
  await expect(rows.nth(5)).toContainText('Đến hạn hôm nay');
  await expect(rows.nth(7)).toContainText('Còn 2 ngày');
});

test('L8, L9: ngăn chi tiết Mã giảm dần, ĐXMS không tính vào tổng kèm "*", tên tệp xuất', async ({ page }) => {
  await fresh(page, '#/tong-quan');
  await tile(page, 'Tổng số ĐXMS').click();
  const dr = page.locator('.vmodal.drawer');
  const codes = (await dr.locator('tbody tr td:nth-child(2)').allTextContents()).map((s) => s.trim());
  expect(codes).toEqual([...codes].sort().reverse());
  await expect(dr.locator('tbody tr', { hasText: 'ĐXMS-2026-0141' })).toContainText('6.500.000.000*');
  await expect(dr.locator('thead')).toContainText('Giá trị (đồng)');
  await dr.locator('[data-close]').first().click();
  await tile(page, 'ĐXMS quá hạn xử lý').click();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('.vmodal.drawer [data-tq-export]').click()]);
  expect(dl.suggestedFilename()).toMatch(/^Tong_quan_DXMS_qua_han_\d{14}\.csv$/);
  expect(await lastToast(page)).toContain('Xuất excel thành công (2 dòng)');
});
