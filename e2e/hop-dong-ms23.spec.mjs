// T25 B2: MS23 Tổng quan trên HĐ-2026-0052 — hồ sơ theo dõi tự sinh sau MS22, sự kiện từ công cụ demo, bước 3 qua eForm, tab Tiến độ thực hiện đọc từ hồ sơ.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const HD = 'HĐ-2026-0052', CASE = 'HSTD-2026-0052', HREF = '#/hop-dong/' + encodeURIComponent(HD);
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-1\d\d|ngoài BPMN/;
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const openPanel = async (page) => { if (!(await page.locator('.demo-panel').count())) await page.locator('#demo').click(); };
const event = async (page, label) => { await openPanel(page); await page.locator('[data-hd-event]', { hasText: label }).click(); };
const pickSet = async (page) => { await openPanel(page); await page.locator('[data-demo-set="MS23"]').click(); await expect(page).toHaveURL(/#\/hop-dong\//); };

test('MS23: chọn bộ demo → tab Tiến độ có hồ sơ theo dõi và mốc AI trích xuất; hợp đồng Đang thực hiện', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await pickSet(page);
  const main = page.locator('.main');
  await expect(page.locator('[data-hd-cases]')).toContainText(CASE);
  await expect(page.locator('[data-hd-cases]')).toContainText('Đang xử lý');
  await expect(main).toContainText('Thông tin AI trích xuất từ hợp đồng đã ký');
  await expect(main).toContainText('Giao đợt 1: máy gắn linh kiện');
  await expect(main).toContainText('Nghiệm thu tổng thể');
  await expect(main).toContainText('Nhật ký theo dõi');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('.dx-tabs [data-ttab="bg"]').click();
  await expect(main).toContainText('BG-01');
  await expect(main).toContainText('Chưa giao');
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  await expect(main).toContainText('Đang thực hiện');
  await expect(main).toContainText('Đúng tiến độ');
  expect(page.errors).toEqual([]);
});

test('MS23: 5 nhánh sự kiện từ công cụ demo; bước 3 qua eForm, bắt buộc thông báo của nhà thầu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await pickSet(page);
  const main = page.locator('.main');
  // Bước 2
  await event(page, 'Đến mốc giao hàng');
  await expect(main).toContainText('Nhắc giao hàng đã gửi');
  await expect(main).toContainText('Đã gửi nhắc: Giao đợt 1');
  // Bước 3: có việc của Phòng Hợp đồng ở Việc của tôi
  await event(page, 'Nhà thầu thông báo giao hàng');
  await page.evaluate(() => Flow.setPersona('phd'));
  await goto(page, '#/viec-cua-toi');
  const row = page.locator('.vtable tbody tr', { hasText: 'Ghi nhận thông báo giao hàng' });
  await expect(row).toContainText(HD);
  await expect(row).toContainText(CASE);
  await expect(page.locator('.bell .count')).toHaveText('1');
  await goto(page, '#/task/' + (await page.evaluate(() => Flow.caseTokens('phd')[0].id)));
  await expect(page.locator('.ginfo')).toContainText(HD);
  expect(await main.innerText()).not.toMatch(BA);
  // Thiếu thông báo của nhà thầu thì bị chặn
  await page.locator('.task-acts [data-act]', { hasText: 'Hoàn thành ghi nhận' }).click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.toast').last()).toContainText('Thông báo giao hàng của nhà thầu');
  await page.locator('.vmodal [data-close]').first().click();
  await page.locator('[data-req-up]').first().click();
  await page.locator('.task-acts [data-act]', { hasText: 'Hoàn thành ghi nhận' }).click();
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  // Bước 4 ghi về hồ sơ theo dõi
  await goto(page, HREF);
  await expect(main).toContainText('Thông báo giao hàng của nhà thầu');
  await expect(main).toContainText('Phòng Quản lý tài sản');
  // Đến hạn
  await event(page, 'Đến hạn nghiệm thu');
  await expect(main).toContainText('Luồng con cần khởi tạo');
  await expect(main).toContainText('Chờ khởi tạo');
  // Bước 5: mốc có ngày thực tế, tỷ lệ hoàn thành tăng
  await page.evaluate(() => Flow.hdEvent('HĐ-2026-0052', 5, { loai: 'biên bản bàn giao', kind: 'GIAO' }));
  await expect(main).toContainText('61%');
  await expect(main).toContainText('AI cập nhật ngày thực tế');
  await page.locator('.dx-tabs [data-ttab="bg"]').click();
  await expect(page.locator('.vtable tbody tr', { hasText: 'BG-01' })).toContainText('Đạt');
  expect(page.errors).toEqual([]);
});

test('MS23: chi tiết hồ sơ và Xem BPMN; hồ sơ MS22 vẫn mở được; hợp đồng khác không có hồ sơ theo dõi', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await pickSet(page);
  const main = page.locator('.main');
  await page.locator('[data-hd-cases] a', { hasText: CASE }).click();
  await expect(page).toHaveURL(/ho-so-hd\/HSTD-2026-0052/);
  await expect(main).toContainText('Theo dõi thực hiện hợp đồng');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-root [data-task="3"]').first()).toBeVisible();
  await goto(page, '#/ho-so-hd/HSHD-2026-0052');
  await expect(main).toContainText('Thương thảo và ký hợp đồng');
  await goto(page, '#/hop-dong/' + encodeURIComponent('HĐ-2025-0187'));
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(page.locator('[data-hd-cases]')).toHaveCount(0);
  await expect(main).toContainText('Kế hoạch / mốc thực hiện');
  expect(page.errors).toEqual([]);
});

test('Bộ demo MS23: mọi cảnh mở được, không có chữ BA', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await pickSet(page);
  const scenes = await page.evaluate(() => D.demoSets.find((d) => d.key === 'MS23').scenes.map((s) => s.n));
  for (const n of scenes) {
    await openPanel(page);
    await page.locator(`[data-scene="${n}"]`).click();
    await expect(page.locator('.main .vcard').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  expect(page.errors).toEqual([]);
});
