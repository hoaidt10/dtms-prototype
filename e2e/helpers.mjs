// Tiện ích dùng chung cho test Playwright của prototype.
import { expect } from '@playwright/test';

export const INDEX = new URL('../index.html', import.meta.url).href;

// Mở một route (hash) và gom lỗi console/pageerror vào page.errors.
export async function open(page, hash = '#/viec-cua-toi') {
  if (!page.errors) {
    page.errors = [];
    page.on('pageerror', (e) => page.errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') page.errors.push(m.text()); });
  }
  await page.goto(INDEX + hash);
  await expect(page.locator('#app')).not.toBeEmpty();
}

// Xoá trạng thái đã lưu để luồng chạy lại từ đầu.
export async function fresh(page, hash) {
  await open(page, hash);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#app')).not.toBeEmpty();
}

export const lastToast = (page) => page.evaluate(() => [...document.querySelectorAll('.toast')].map((t) => t.className + '|' + t.textContent).pop() || '');

export const state = (page) => page.evaluate(() => ({
  s: Flow.state.status,
  mine: Flow.tokensFor(Flow.state.persona).map((t) => ({ id: t.id, task: t.task })),
  any: Flow.state.tokens.map((t) => t.who),
}));

// Bấm nút hành động (chính, hoặc theo nhãn); nếu mở hộp thoại lý do / trình ký thì điền và xác nhận.
export async function primary(page, label) {
  // Nút hành động nằm trên hàng tiêu đề (my-task-detail); nút phụ thứ hai trở đi nằm trong "Thao tác khác".
  const find = () => (label ? page.locator('.task-acts [data-act]', { hasText: label }).first() : page.locator('.task-acts [data-act].primary').first());
  let btn = find();
  if (!(await btn.count()) && label && (await page.locator('[data-more]').count())) { await page.locator('[data-more]').click(); btn = find(); }
  if (!(await btn.count())) return false;
  await btn.click();
  for (let i = 0; i < 2; i++) {
    const overlay = page.locator('.overlay');
    if (!(await overlay.count())) break;
    const ta = overlay.locator('textarea:visible');
    if (await ta.count()) await ta.first().fill('Nội dung thử');
    await overlay.locator('#ok, #go').first().click();
  }
  return true;
}
