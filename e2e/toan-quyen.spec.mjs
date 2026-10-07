// Tài khoản toàn quyền (persona 'admin', cờ all): thấy mọi việc đang chờ, xử lý thay mọi vai, vào mọi màn quản trị.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const asAll = async (page, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('admin'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};

test('Toàn quyền: có trong danh sách vai; mở được mọi màn quản trị', async ({ page }) => {
  await asAll(page, '#/chon-vai');
  await expect(page.locator('main')).toContainText('Tài khoản toàn quyền');
  for (const h of ['#/quy-trinh', '#/ma-tran/display-rule', '#/giam-sat-tien-trinh', '#/eform', '#/dmdc/nguon-von', '#/dmdc/nha-cung-cap']) {
    await page.evaluate((x) => { location.hash = x; }, h);
    await expect(page.locator('main .pg-title, main h1').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText('chưa được cấp quyền');
  }
  expect(await page.evaluate(() => Catalog.CATALOGS.every((c) => Catalog.canSee(c.key)))).toBe(true);
});

test('Toàn quyền: Việc của tôi có việc của mọi vai; mở việc của vai khác thì có nút xử lý', async ({ page }) => {
  await asAll(page, '#/viec-cua-toi');
  /* Nhảy tới cảnh có việc của vai khác (MS01.03 cảnh 3-3: Ban Tài chính góp ý). */
  await page.evaluate(() => { Flow.jumpToScene('3-3', 'MS01.03'); Flow.setPersona('admin'); });
  const all = await page.evaluate(() => Flow.state.tokens.length);
  expect(all).toBeGreaterThan(0);
  expect(await page.evaluate(() => Flow.tokensFor('admin').length)).toBe(all);
  const tok = await page.evaluate(() => Flow.state.tokens[0]);
  expect(tok.who).not.toBe('admin');
  await page.evaluate((id) => { location.hash = '#/task/' + id; }, tok.id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
});
