// @ts-check
// SCR-101 Danh sách Phân hệ + khung theo phân hệ (D-42, team BA 30/10/2026).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task 0|Prototype|minh hoạ/;

test('Logo topbar về Danh sách Phân hệ: 6 thẻ, không sidebar, tiêu đề theo source; đổi thẻ / bảng và nhớ lựa chọn', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('.topbar .brand').click();
  await expect(page).toHaveURL(/#\/phan-he$/);
  await expect(page.locator('.ss-head h1')).toContainText('Danh sách Phân hệ');
  await expect(page.locator('.ss-head p')).toHaveText('Chọn phân hệ để truy cập vào các module nghiệp vụ của bạn');
  await expect(page.locator('.sidebar')).toHaveCount(0);
  await expect(page.locator('.ss-card h2')).toHaveText(['Người dùng tập trung', 'Danh mục dùng chung', 'Quản trị khoa học công nghệ', 'Quản lý nhân công', 'Đầu tư mua sắm', 'Quản lý hàng hóa đề tài dự án']);
  await expect(page.locator('[data-ss="project-goods"]')).toBeDisabled();
  expect(await page.locator('.ss-grid').innerText()).not.toMatch(BA);
  await page.locator('[data-ss-view="TABLE"]').click();
  await expect(page.locator('.ss-table th')).toHaveText(['Phân hệ', 'Mô tả', 'Hành động']);
  await expect(page.locator('.ss-table tbody tr')).toHaveCount(6);
  await page.reload();
  await expect(page.locator('.ss-table')).toBeVisible();
  await page.locator('[data-ss-view="GRID"]').click();
  await expect(page.locator('.ss-card')).toHaveCount(6);
  expect(page.errors).toEqual([]);
});

test('Truy cập: Danh mục dùng chung mở sidebar riêng; Đầu tư mua sắm về Việc của tôi; phân hệ ngoài phạm vi mở Đang phát triển', async ({ page }) => {
  await fresh(page, '#/phan-he');
  await page.locator('[data-ss="common-catalog"]').click();
  await expect(page).toHaveURL(/#\/dmdc$/);
  await expect(page.locator('.sb-head .t')).toHaveText('Danh mục dùng chung');
  await expect(page.locator('.topbar .brand-text')).toContainText('Danh mục dùng chung');
  await expect(page.locator('.sb-nav [data-go="viec-cua-toi"]')).toHaveCount(0);
  await page.locator('.sb-nav [data-go="ph/dm-vai-tro"]').click();
  await expect(page.locator('main')).toContainText('Tính năng đang được phát triển');
  await expect(page.locator('.sb-head .t')).toHaveText('Danh mục dùng chung');
  await page.locator('.topbar .brand').click();
  await page.locator('[data-ss="procurement"]').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  await expect(page.locator('.sb-head .t')).toHaveText('Đầu tư mua sắm');
  await page.locator('.topbar .brand').click();
  await page.locator('[data-ss="iam"]').click();
  await expect(page.locator('main')).toContainText('Tính năng đang được phát triển');
  await expect(page.locator('.sidebar')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Route cũ vẫn mở trong sidebar phân hệ: danh mục chung, danh mục nhóm Đầu tư mua sắm, E-form', async ({ page }) => {
  await fresh(page, '#/dmdc/nguon-von');
  await page.evaluate(() => Flow.setPersona('qt'));
  await expect(page.locator('.sb-nav [data-go="dmdc/nguon-von"]')).toHaveClass(/active/);
  await page.evaluate(() => { location.hash = '#/dmdc/loai-hop-dong'; });
  await expect(page.locator('.sb-nav [data-go="dmdc/loai-hop-dong"]')).toHaveClass(/active/);
  await page.evaluate(() => { location.hash = '#/eform'; });
  await expect(page.locator('.sb-head .t')).toHaveText('Danh mục dùng chung');
  await expect(page.locator('.sb-nav [data-go="eform"]')).toHaveClass(/active/);
  expect(page.errors).toEqual([]);
});
