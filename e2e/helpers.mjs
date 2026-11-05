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

// SCR-28 Thêm mới ĐXMS (#/dxms → Thêm mới): nhập tên rồi Lưu — chỉ tạo ĐXMS, không start quy trình (D-11). Trả về mã ĐXMS.
export async function createDxms(page, title = 'Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2') {
  await page.evaluate(() => { location.hash = '#/dxms'; });
  await page.locator('[data-create="dxms"]').click();
  await expect(page).toHaveURL(/#\/dxms\/create$/);
  await page.locator('#x-title').fill(title);
  // Comment Figma #1: ĐXMS bắt buộc chọn nhiệm vụ / đề tài, dự án.
  await page.locator('[data-vsel="x-nv"]').click();
  await page.locator('.vsel-panel [data-opt="NV-KHCN-2026-014"]').click();
  await page.locator('#x-save').click();
  await expect(page).toHaveURL(/#\/dxms$/);
  return page.evaluate(() => Flow.dxmsAll()[0].code);
}

// Chỉnh sửa ĐXMS → Danh sách hồ sơ → Tạo hồ sơ (SCR-25, ô ĐXMS khoá, loại Phê duyệt chọn sẵn) → Lưu: start ngay, mở task 01.
// T29 B1 (D-54): không chọn quy trình — Quy trình chỉ đọc (MS01); luồng con dự kiến kiểm ở `proc`.
export async function createCase(page, proc, dxms) {
  const code = dxms || (await createDxms(page));
  await page.evaluate((c) => { location.hash = `#/dxms/${encodeURIComponent(c)}/edit`; }, code);
  await page.locator('[data-dxms-profiles] .vcard-h [data-go^="ho-so-dxms/create/"]').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/create\//);
  await expect(page.locator('#c-proc')).toHaveValue(/^MS01 — /);
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  if (proc) expect(await page.evaluate(() => Flow.state.vars.process)).toBe(proc);
  return code;
}

export const lastToast =(page) => page.evaluate(() => [...document.querySelectorAll('.toast')].map((t) => t.className + '|' + t.textContent).pop() || '');

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
    // Task 13 (comment #6–8): nút từ chối mở eForm duyệt từng phần → chấm Không đạt phần đầu tiên.
    const parts = overlay.locator('[data-ef-form="dtms-ms01-t13-chi-huy-duyet"] [data-ef-radio$="ketQua"]', { hasText: 'Không đạt' });
    if (label && /^Không/.test(label) && (await parts.count())) await parts.first().click();
    const ta = overlay.locator('textarea:visible');
    if (await ta.count()) await ta.first().fill('Nội dung thử');
    await overlay.locator('#ok, #go').first().click();
  }
  return true;
}

// Màn xử lý task (B0.4 (2)): bấm nút hành động mở dialog eForm của task (my-task-eform-dialog). Trả locator dialog.
export async function openForm(page, label) {
  const find = () => (label ? page.locator('.task-acts [data-act]', { hasText: label }).first() : page.locator('.task-acts [data-act].primary').first());
  let btn = find();
  if (!(await btn.count()) && label && (await page.locator('[data-more]').count())) { await page.locator('[data-more]').click(); btn = find(); }
  await btn.click();
  const form = page.locator('.vmodal.ef');
  await expect(form).toBeVisible();
  return form;
}
// Chọn quyết định (Chấp nhận / Sửa / Bỏ) cho dòng gợi ý AI có mục `muc` trong bảng quyết định G2.
export async function aiDecide(form, muc, decision = 'Chấp nhận') {
  await form.locator('.ef-row', { hasText: muc }).locator('[data-ef-radio$="quyetDinh"]', { hasText: decision }).click();
}
// Tải lên mọi tài liệu bắt buộc có key bắt đầu bằng `prefix` ở Danh sách tài liệu (vd. 'quote_' = báo giá theo NCC, comment #5).
export async function uploadReq(page, prefix) {
  const sel = `[data-req-up^="${prefix}"]`;
  for (let i = 0; i < 10 && (await page.locator(sel).count()); i++) await page.locator(sel).first().click();
}
// Đóng dialog eForm không lưu.
export const closeForm = (page) => page.locator('.vmodal.ef [data-close]').first().click();
