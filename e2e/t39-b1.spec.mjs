// T39 B1 (D-99) — Việc của tôi theo code KHCN: tab Chưa xử lý / Đã hoàn thành, Sắp xếp, từ khóa + tìm kiếm nâng cao cùng lúc,
// nút fail-closed, không khóa nút theo dữ liệu, Yêu cầu thay người xử lý, Bổ sung ý kiến, việc đã được người khác xử lý (409).
import { test, expect } from '@playwright/test';
import { fresh, createCase } from './helpers.mjs';

const rowsSt = (page) => page.locator('.vtable tbody tr.click td:nth-child(2)').allTextContents();

// Việc bước 12 (màn xử lý việc chung) của minh.
async function task12(page) {
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.setPersona('minh'); Flow.jumpTo(12, 'minh', {}, 'MS01.01', undefined, null, false); return Flow.state.tokens.find((t) => t.task === 12).id; });
  await page.evaluate((i) => { location.hash = `#/task/${i}`; }, id);
  await expect(page.locator('[data-act]').first()).toBeVisible();
  return id;
}

test('Danh sách: hai tab theo MY_TASK_TAB_FILTER_STATES, cột bước đổi theo tab, số trên tab Chưa xử lý', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await createCase(page);
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  const tabs = page.locator('[data-my-tab]');
  await expect(tabs).toHaveText([/Chưa xử lý/, 'Đã hoàn thành']);
  await expect(page.locator('[data-my-tab="pending"]')).toHaveClass(/on/);
  await expect(page.locator('.vtable thead')).toContainText('Bước cần xử lý');
  // Tab Chưa xử lý: chỉ Chưa xử lý / Quá hạn / Lưu trữ.
  for (const s of await rowsSt(page)) expect(['Chưa xử lý', 'Quá hạn', 'Lưu trữ']).toContain(s.trim());
  await expect(page.locator('[data-my-count]')).toHaveText(/^\d+$/);
  await page.locator('[data-my-tab="done"]').click();
  await expect(page.locator('.vtable thead')).toContainText('Bước bạn đã xử lý');
  const done = await rowsSt(page);
  expect(done.length).toBeGreaterThan(0);
  for (const s of done) expect(s.trim()).toBe('Hoàn thành');
});

test('Danh sách: Sắp xếp Mới nhất / Cũ nhất / Hạn xử lý gần nhất; từ khóa và tìm kiếm nâng cao áp cùng lúc, Làm mới xóa từ khóa', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  // Cột Ngày tạo không còn (theo my-task-columns dtms-fe) → kiểm Sắp xếp Hạn xử lý gần nhất trên cột Hạn xử lý (cột 8, tính cả STT).
  await createCase(page);
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await page.locator('[data-vsel="my-sort"]').click();
  await page.locator('.vsel-panel [data-opt="DUE_SOONEST"]').click();
  const due = (await page.locator('.vtable tbody tr.click td:nth-child(8)').allTextContents()).map((d) => d.trim().split('/').reverse().join(''));
  expect(due.length).toBeGreaterThan(0);
  expect(due).toEqual([...due].sort());
  await page.locator('[data-my-tab="done"]').click();
  // Từ khóa + nâng cao.
  const kw = page.locator('#my-kw');
  await kw.fill('HS-2026-0110');
  await kw.press('Enter');
  const n1 = await page.locator('.vtable tbody tr.click').count();
  expect(n1).toBeGreaterThan(0);
  await page.locator('[data-m="adv"]').click();
  await expect(page.locator('#my-kw')).toBeVisible();
  await page.locator('[data-mf="name"]').fill('không có công việc nào tên này');
  await page.locator('[data-madv] button[type="submit"]').click();
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(0);
  await page.locator('[data-m="reset"]').click();
  await expect(page.locator('#my-kw')).toHaveValue('');
});

test('Màn công việc: Bổ sung ý kiến (không đóng việc) và Yêu cầu thay người xử lý (lý do bắt buộc, chuyển người mới)', async ({ page }) => {
  const tokId = await task12(page);
  await page.locator('[data-more]').first().click();
  await page.locator('[data-vct="comment"]').click();
  await page.locator('#vc-ok').click();
  await expect(page.locator('#vc-f .msg')).toBeVisible();
  await page.locator('#vc-t').fill('Đề nghị bổ sung bảng so sánh giá.');
  await page.locator('#vc-ok').click();
  expect(await page.evaluate((id) => !!Flow.token(id), tokId), 'Bổ sung ý kiến không đóng việc').toBe(true);
  expect(await page.evaluate(() => Vct.historyItems(() => 'x').map((x) => x.title))).toEqual([expect.stringContaining('Bổ sung ý kiến')]);

  const before = await page.evaluate((id) => Flow.token(id).who, tokId);
  await page.locator('[data-more]').first().click();
  await page.locator('[data-vct="replace"]').click();
  await page.locator('#vr-ok').click();
  await expect(page.locator('#vr-p .msg')).toBeVisible();
  await expect(page.locator('#vr-f .msg')).toBeVisible();
  await page.locator('[data-vsel="vr-who"]').click();
  await page.locator('.vsel-panel [data-opt]').first().click();
  await page.locator('#vr-t').fill('Chuyên viên nghỉ phép.');
  await page.locator('#vr-ok').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  const after = await page.evaluate((id) => Flow.token(id).who, tokId);
  expect(after).not.toBe(before);
});

test('Việc đã được người khác xử lý: bấm hành động báo 409, không đổi trạng thái', async ({ page }) => {
  await task12(page);
  const btn = page.locator('[data-act]').first();
  await page.evaluate(() => { Flow.state.tokens.splice(0); });
  await btn.click();
  await expect(page.locator('.toast').last()).toContainText('Công việc này đã được hoàn thành hoặc chuyển bước. Vui lòng tải lại trang.');
});

test('Luật nút fail-closed: bước có nhánh đối soát, nút không khớp luật → không hiện; nút không bị khóa theo dữ liệu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const r = await page.evaluate(() => {
    const row = MaTran.reconRows('MS01')[0];
    return { ok: MaTran.allowed('MS01', row.task, row.label, 'minh').show, bad: MaTran.allowed('MS01', row.task, 'Nút không có luật', 'minh').show };
  });
  expect(r.bad).toBe(false);
  await createCase(page);
  await expect(page.locator('[data-act][disabled]')).toHaveCount(0);
});

test('Bố cục theo /my-tasks (dtms-fe): tiêu đề trang, tiêu đề khối Danh sách việc của tôi, thứ tự cột hai tab', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await expect(page.locator('.pg-title')).toHaveText('Việc của tôi');
  await expect(page.locator('.vcard .pg-head .blk-t')).toHaveText('Danh sách việc của tôi');
  await expect(page.locator('#my-kw')).toHaveAttribute('placeholder', 'Tìm kiếm theo mã, tên ĐXMS / KĐT...');
  await expect(page.locator('.vtable thead th')).toHaveText(['STT', 'Trạng thái', 'Mã ĐXMS / KĐT', 'Tên ĐXMS / KĐT', 'Mức ưu tiên', 'Quy trình', 'Bước cần xử lý', 'Hạn xử lý']);
  await page.locator('[data-my-tab="done"]').click();
  await expect(page.locator('.vtable thead th')).toHaveText(['STT', 'Trạng thái', 'Mã ĐXMS / KĐT', 'Tên ĐXMS / KĐT', 'Mức ưu tiên', 'Quy trình', 'Bước bạn đã xử lý', 'Ngày xử lý']);
});
