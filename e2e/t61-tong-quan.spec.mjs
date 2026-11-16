// T61 (D-116) — Tổng quan làm gọn theo ý tưởng BA owner: 4 tab theo đối tượng, mỗi tab Chỉ số điều hành / Tiến độ nghiệp vụ / Hồ sơ cần chú ý;
// bấm chỉ số mở ngăn chi tiết; Trạng thái = 4 nhóm của tab; #60 dải tab không thanh cuộn. Plan docs/dtms/prototype-T61-tong-quan-4-tab.md.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const tileN = (page, label) => page.locator('.tq-m', { has: page.locator('.t', { hasText: new RegExp('^' + label + '$') }) }).locator('.n');
const stN = (page, label) => page.locator('.tq-st', { has: page.locator('.tq-st-l', { hasText: new RegExp('^' + label + '$') }) }).locator('.tq-st-n');
const att = (page) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: 'Hồ sơ cần chú ý' }) });

test('4 tab, mỗi tab 3 khối; số chỉ số khớp ngăn chi tiết; thẻ Quá hạn đếm chéo', async ({ page }) => {
  page.errors = []; page.on('pageerror', (e) => page.errors.push(String(e)));
  await fresh(page, '#/tong-quan');
  await expect(page.locator('[data-tq4]')).toHaveText(['Đề xuất mua sắm', 'Khoản đầu tư', 'Gói thầu', 'Hợp đồng']);
  await expect(page.locator('[data-tqtab]')).toHaveCount(0);
  await expect(page.locator('[data-vsel="rp-tq-kind"]')).toHaveCount(0);
  const metrics = { dxms: 4, kdt: 4, goi: 4, hd: 6 };
  for (const [k, n] of Object.entries(metrics)) {
    await page.locator(`[data-tq4="${k}"]`).click();
    await expect(page.locator('.tq-m')).toHaveCount(n);
    await expect(page.locator('.tq-st')).toHaveCount(4);
    await expect(att(page)).toHaveCount(1);
    // Ô đếm đầu tiên = số dòng ngăn chi tiết.
    const total = (await page.locator('.tq-m').first().locator('.n').textContent()).trim();
    await page.locator('.tq-m').first().click();
    const dr = page.locator('.vmodal.drawer');
    await expect(dr).toBeVisible();
    await expect(dr.locator('.tq-dr-n b')).toHaveText(total);
    await dr.locator('[data-close]').first().click();
    await expect(dr).toHaveCount(0);
  }
  // ĐXMS: Tổng số không đếm nháp (27, như T48); thẻ trạng thái run + wait + done ≤ tổng; Quá hạn đếm chéo.
  await page.locator('[data-tq4="dxms"]').click();
  await expect(tileN(page, 'Tổng số ĐXMS')).toHaveText('27');
  await expect(tileN(page, 'Tổng giá trị ĐXMS')).toContainText('1.963.600.000.000'); // T69 L1: đồng
  const n = async (l) => Number((await stN(page, l).textContent()).trim());
  expect((await n('Đang xử lý')) + (await n('Chờ phê duyệt')) + (await n('Đã phê duyệt'))).toBeLessThanOrEqual(27);
  expect(await n('Quá hạn')).toBeGreaterThan(0);
  expect(await n('Quá hạn')).toBe(Number((await tileN(page, 'ĐXMS quá hạn xử lý').textContent()).trim()));
  // Hồ sơ cần chú ý: có quá hạn, gấp nhất lên đầu.
  const first = att(page).locator('tbody tr').first();
  await expect(first).toContainText('Quá hạn');
  expect(page.errors).toEqual([]);
});

test('Lọc Trạng thái theo 4 nhóm của tab; đổi tab bỏ lọc; Xuất excel ở ngăn chi tiết', async ({ page }) => {
  page.errors = []; page.on('pageerror', (e) => page.errors.push(String(e)));
  await fresh(page, '#/tong-quan');
  await page.locator('[data-tq4="hd"]').click();
  await page.locator('[data-vsel="rp-tq-st"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Đang thực hiện', 'Chờ hoàn tất', 'Đã hoàn thành', 'Chậm tiến độ']);
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Chậm tiến độ' }).click();
  await page.keyboard.press('Escape');
  await page.locator('[data-rpa="tq:go"]').click();
  const late = (await tileN(page, 'Hợp đồng chậm tiến độ').textContent()).trim();
  await expect(tileN(page, 'Tổng số hợp đồng')).toHaveText(late);
  await expect(att(page).locator('tbody tr')).toHaveCount(Number(late));
  await page.locator('[data-tq4="goi"]').click();
  await page.locator('[data-vsel="rp-tq-st"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Đang LCNT', 'Chờ phê duyệt kết quả', 'Đã có kết quả', 'Chậm tiến độ']);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-vsel="rp-tq-st"] .vsel-chip')).toHaveCount(0);
  await page.locator('.tq-st').last().click();
  await page.locator('.vmodal.drawer [data-tq-export]').click();
  expect(await lastToast(page)).toContain('Xuất excel thành công');
  expect(page.errors).toEqual([]);
});

test('#60: dải tab không hiện thanh cuộn', async ({ page }) => {
  await fresh(page, '#/tong-quan');
  const sw = await page.locator('nav.tabs').first().evaluate((el) => getComputedStyle(el).scrollbarWidth);
  expect(sw).toBe('none');
});
