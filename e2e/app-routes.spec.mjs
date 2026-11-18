// T77 S3 (D-129): chỗ cắm route của phân hệ (window.AppRoutes, js/app.js) — màn mới không thêm dòng vào app.js.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test('AppRoutes: route đăng ký thêm mở đúng trang, sáng đúng menu; route cũ không đổi', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => {
    (window.AppRoutes = window.AppRoutes || []).push({
      id: 'test-ext', match: (r) => r === 'zz-thu-route' || r.startsWith('zz-thu-route/'),
      active: () => 'hop-dong', render: (r) => `<div class="pg"><h1 class="zz-ext">Trang thêm ${r}</h1></div>`,
    });
    location.hash = '#/zz-thu-route/abc';
  });
  await expect(page.locator('.zz-ext')).toHaveText('Trang thêm zz-thu-route/abc');
  await expect(page.locator('.sb-nav .nav.active, .sb-nav .nav.has-active').first()).toBeVisible();
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('.pg-title')).toHaveText('Việc của tôi');
  expect(page.errors || []).toEqual([]);
});

test('AppRoutes: match lỗi không làm hỏng trang', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => {
    (window.AppRoutes = window.AppRoutes || []).push({ id: 'loi', match: () => { throw new Error('x'); }, render: () => '' });
    location.hash = '#/hop-dong';
  });
  await expect(page.locator('.vtable tbody tr').first()).toBeVisible();
});
