// T37 — sửa prototype ĐXMS theo review RV-PROTO-0911 (Review prototype (2).docx, 09/11/2026).
// Plan docs/dtms/prototype-T37-review-dxms-0911.md. Mỗi test một mục review; phần bỏ khỏi màn kiểm thêm ở b1-backlog, ms02, t29-*.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const lg = (code) => '#/luong/' + encodeURIComponent(code);
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const tab = (page, name) => page.locator('.dx-tabs .tab', { hasText: name }).click();

test('#1 Danh sách ĐXMS: cột Loại ĐXMS và lọc Tạo mới / Điều chỉnh ở tìm kiếm nâng cao', async ({ page }) => {
  await fresh(page, '#/luong');
  await expect(page.locator('main .vtable th')).toContainText(['Loại ĐXMS']);
  await expect(page.locator('main tr[data-code="ĐXMS-2026-0112"] [data-kind]')).toHaveText('Điều chỉnh');
  await expect(page.locator('main tr[data-code="ĐXMS-2026-0103"] [data-kind]')).toHaveText('Tạo mới');
  await page.locator('[data-lg="adv"]').click();
  await page.locator('[data-vsel="lgf-kind"]').click();
  await page.locator('.vsel-panel [data-opt="Điều chỉnh"]').click();
  await page.locator('[data-lgadv] button[type="submit"]').click();
  const kinds = await page.locator('main tbody [data-kind]').allTextContents();
  expect(kinds.length).toBeGreaterThan(0);
  expect(new Set(kinds)).toEqual(new Set(['Điều chỉnh']));
  expect(page.errors).toEqual([]);
});

test('#2 Thêm mới điều chỉnh: Thông tin dự án / đề tài điền sẵn từ ĐXMS cần điều chỉnh, sửa được, còn khả dụng tính lại phần của ĐXMS cũ', async ({ page }) => {
  await fresh(page, '#/dieu-chinh-dxms/create/' + encodeURIComponent('ĐXMS-2026-0103'));
  const cost = page.locator('[data-lf-cost]');
  await expect(cost.locator('tbody tr')).toHaveCount(2);
  await expect(cost).toContainText('Thiết bị, máy đo chuyên dụng');
  await expect(cost).not.toContainText('Chưa bóc tách chi phí');
  // Sửa được: ô số lượng, xoá dòng.
  const qty = cost.locator('[data-lf-cqty]').first();
  await expect(qty).toBeEnabled();
  await qty.fill('2');
  await expect(qty).toHaveValue('2');
  await cost.locator('[data-lf-cdel]').last().click();
  await expect(cost.locator('tbody tr')).toHaveCount(1);
  // Dòng của ĐXMS cũ chọn lại được (còn khả dụng gồm phần ĐXMS cũ đang giữ).
  await page.locator('[data-vsel="lf-ctype"]').click();
  await expect(page.locator('.vsel-panel [data-opt]').first()).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('#3 Chi tiết ĐXMS điều chỉnh: không Người được xem, không So sánh trước – sau; Căn cứ & hạng mục, Yêu cầu báo giá, Tài liệu & văn bản thu gọn', async ({ page }) => {
  await fresh(page, lg('ĐXMS-2026-0112'));
  const gi = page.locator('.gen .ginfo');
  await expect(gi).toContainText('Điều chỉnh từ');
  await expect(gi).not.toContainText('Người được xem');
  await expect(page.locator('[data-adj-compare]')).toHaveCount(0);
  await tab(page, 'Căn cứ & hạng mục');
  await expect(page.locator('main .vcard', { hasText: 'Thông tin dự án / đề tài' }).locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('main .vcard', { hasText: 'Hạng mục mua sắm' })).toHaveCount(0);
  await go(page, lg('ĐXMS-2026-0077'));
  await tab(page, 'Yêu cầu báo giá');
  await expect(page.locator('[data-ycbg-list] thead')).toContainText('Tổng giá trị theo cơ sở giá (tỷ đồng)');
  await expect(page.locator('main .vcard', { hasText: 'Lịch sử cơ sở giá' })).toHaveCount(0);
  await tab(page, 'Tài liệu & văn bản');
  await expect(page.locator('[data-dx-docs] [data-dx-ver]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('#4 Thêm mới ĐXMS: Khẩn bắt buộc Lý do ưu tiên (đã có); không còn khối Văn bản căn cứ và giá trị còn khả dụng', async ({ page }) => {
  await fresh(page, '#/luong/create');
  await page.locator('[data-vsel="lf-pri"]').click();
  await page.locator('.vsel-panel [data-opt="Khẩn"]').click();
  await expect(page.locator('#lf-priReason')).toBeVisible();
  await page.locator('#lf-save').click();
  await expect(page.locator('.vfield.invalid .msg', { hasText: 'Bạn cần nhập Lý do ưu tiên.' })).toHaveCount(1);
  await expect(page.locator('[data-basis-avail]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('#6 Yêu cầu báo giá: nút Lưu (không còn Lưu và gửi), lưu ý không nói hệ thống tự gửi email', async ({ page }) => {
  await fresh(page, '#/ycbg/create');
  await expect(page.locator('[data-yc-save="send"]')).toHaveText('Lưu');
  await expect(page.locator('main')).not.toContainText('Lưu và gửi');
  await expect(page.locator('[data-yc-note]')).toContainText('chưa tự gửi email');
  expect(page.errors).toEqual([]);
});
