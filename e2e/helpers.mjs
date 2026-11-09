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
// T34 (D-90): SCR-28 bỏ cùng phương án Tách — tạo ĐXMS chưa có hồ sơ bằng engine (như dữ liệu mẫu), trả về mã.
export async function createDxms(page, title = 'Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2') {
  return page.evaluate((t) => Flow.createDxms({ title: t, nv: 'NV-KHCN-2026-014', unit: 'Trung tâm Vô tuyến', priority: 'Thường', est: null }), title);
}

// Chỉnh sửa ĐXMS → Danh sách hồ sơ → Tạo hồ sơ (SCR-25, ô ĐXMS khoá, loại Phê duyệt chọn sẵn) → Lưu: start ngay, mở task 01.
// T29 B1 (D-54): không chọn quy trình — Quy trình chỉ đọc (MS01); luồng con dự kiến kiểm ở `proc`.
// T34 (D-90): Lập ĐXMS trên ĐXMS chưa có hồ sơ (#/luong/create/<mã>) → Lưu nháp = tạo hồ sơ + khởi tạo MS01, mở việc Lập ĐXMS.
export async function createCase(page, proc, dxms) {
  const code = dxms || (await createDxms(page));
  await page.evaluate((c) => { location.hash = '#/luong/create/' + encodeURIComponent(c); }, code);
  await page.locator('[data-luong-form]').waitFor();
  await page.locator('#lf-draft').click();
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
  // Review nhi 06/11 #38: màn phê duyệt (13, 16.1, 17) chỉ có một nút, Đồng ý / Từ chối trong form.
  const reject = !!label && /^(Không đồng ý|Từ chối|Trả lại)/.test(label);
  if (!(await btn.count()) && label && /^(Đồng ý|Không đồng ý|Từ chối|Trả lại)/.test(label)) btn = page.locator('.task-acts [data-act]', { hasText: /Phê duyệt|Xác nhận danh sách CQCM/ }).first();
  if (!(await btn.count())) return false;
  const text = await btn.textContent();
  await btn.click();
  // Review nhi 06/11 #21, #31: bước 7 mở màn SCR-105, tải tệp Excel (điền bảng) rồi Gửi Chỉ huy Kho.
  if (/Cập nhật kết quả rà soát/.test(text)) { await fillRsk(page); return true; }
  for (let i = 0; i < 2; i++) {
    const overlay = page.locator('.overlay');
    if (!(await overlay.count())) break;
    await aiFill(page);
    // Task 13 (comment #6–8): nút từ chối mở eForm duyệt từng phần → chấm Không đạt phần đầu tiên.
    const parts = overlay.locator('[data-ef-form="dtms-ms01-t13-chi-huy-duyet"] [data-ef-radio$="ketQua"]', { hasText: 'Không đạt' });
    if (label && /^(Không|Từ chối)/.test(label) && (await parts.count())) await parts.first().click();
    const ta = overlay.locator('textarea:visible');
    if (await ta.count()) await ta.first().fill('Nội dung thử');
    const no = overlay.locator('#ef-no');
    if (reject && (await no.count())) await no.click();
    else await overlay.locator('#ok, #go').first().click();
  }
  return true;
}

// Review nhi 06/11 #34: bấm ✦ Gợi ý từ AI ở form Soạn thảo tờ trình (nếu có), chờ AI điền xong.
export async function aiFill(page) {
  const b = page.locator('.vmodal.ef [data-ef-aifill]');
  if (!(await b.count())) return;
  await page.evaluate(() => { D.aiDelay = 0; });
  await b.click();
  await expect(page.locator('[data-ef-ai-wait]')).toHaveCount(0);
  await expect(page.locator('.vmodal.ef [data-ef-aifill]')).toBeEnabled();
}

// Review nhi 06/11 #21, #31–33: nhập kết quả rà soát trên màn SCR-105 rồi Gửi Chỉ huy Kho.
// T37 (RV-PROTO-0911 #5): tệp chỉ đính kèm, hệ thống không đọc Excel — test nhập bảng bằng số mẫu (D.rstkSample) như người dùng gõ tay.
export async function fillRsk(page, send = true) {
  await page.locator('[data-rsk-ed]').waitFor();
  await page.locator('#rsk-file').setInputFiles({ name: 'Ket-qua-ra-soat.xlsx', mimeType: 'application/vnd.ms-excel', buffer: Buffer.alloc(16) });
  await expect(page.locator('.rsk-file')).toHaveText('Ket-qua-ra-soat.xlsx');
  await page.evaluate(() => {
    D.rstkSample(D.items, Flow.state.clock).kq.rows.forEach((r) => Object.keys(r).forEach((k) => {
      const el = document.querySelector(`[data-rsk-in="${r.n}:${k}"]`);
      if (el) el.value = r[k] == null ? '' : String(r[k]);
    }));
  });
  if (send) { await page.locator('[data-rsk-save]').click(); await expect(page).toHaveURL(/#\/viec-cua-toi$/); }
}

// Màn xử lý task (B0.4 (2)): bấm nút hành động mở dialog eForm của task (my-task-eform-dialog). Trả locator dialog.
export async function openForm(page, label) {
  const find = () => (label ? page.locator('.task-acts [data-act]', { hasText: label }).first() : page.locator('.task-acts [data-act].primary').first());
  let btn = find();
  if (!(await btn.count()) && label && (await page.locator('[data-more]').count())) { await page.locator('[data-more]').click(); btn = find(); }
  // Review nhi 06/11 #38: màn phê duyệt (13, 16.1) chỉ có một nút mở form.
  if (!(await btn.count()) && label && /^(Đồng ý|Không đồng ý|Từ chối|Trả lại)/.test(label)) btn = page.locator('.task-acts [data-act]', { hasText: 'Phê duyệt' }).first();
  await btn.click();
  const form = page.locator('.vmodal.ef');
  await expect(form).toBeVisible();
  return form;
}
// Chọn quyết định (Chấp nhận / Sửa / Bỏ) cho dòng gợi ý AI có mục `muc` trong bảng quyết định G2.
export async function aiDecide(form, muc, decision = 'Chấp nhận') {
  // Review nhi 06/11 #34, #35: Tờ trình MS01 bỏ bảng quyết định — AI tự điền ô trống.
  if ((await form.locator('[data-ef-aifill]').count()) && (await form.locator('[data-ef="suCanThiet"]').count())) { await aiFill(form.page()); return; }
  await form.locator('.ef-row', { hasText: muc }).locator('[data-ef-radio$="quyetDinh"]', { hasText: decision }).click();
}
// Tải lên mọi tài liệu bắt buộc có key bắt đầu bằng `prefix` ở Danh sách tài liệu (vd. 'quote_' = báo giá theo NCC, comment #5).
export async function uploadReq(page, prefix) {
  const sel = `[data-req-up^="${prefix}"]`;
  for (let i = 0; i < 10 && (await page.locator(sel).count()); i++) await page.locator(sel).first().click();
}
// Đóng dialog eForm không lưu.
export const closeForm = (page) => page.locator('.vmodal.ef [data-close]').first().click();
// T29 B19 (góp ý 06/11): màn Lập ĐXMS — bấm ✦ Gợi ý từ AI ở khối Căn cứ (bóc tách) và khối Thông tin cơ bản, Áp dụng popup (khối nào đã áp dụng thì bỏ qua).
export async function aiApply(page, secs = ['boc', 'basic']) {
  await page.locator('[data-luong-form]').waitFor();
  for (const s of secs) {
    const b = page.locator(`[data-lf-ai-sec="${s}"]`);
    if (!(await b.count()) || !(await b.textContent()).includes('Gợi ý từ AI')) continue;
    await b.click();
    await page.locator('[data-lf-ai-apply]').click();
  }
}
