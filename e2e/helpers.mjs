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
  // T59 Q4: bước 7 nhập trên tab Rà soát tồn kho của màn việc — tải tệp (đọc Excel điền bảng) rồi bấm Gửi Chỉ huy Kho.
  if (/Gửi Chỉ huy Kho/.test(text)) { await fillRsk(page); return true; }
  await btn.click();
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
    else {
      // T54: hộp thoại Trình ký VOffice cần mật khẩu VOffice (GIẢ LẬP: chuỗi bất kỳ khác rỗng).
      const pw = overlay.locator('#tk-pw');
      if (await pw.count()) await pw.fill('Vht@2026');
      await overlay.locator('#ok, #go').first().click();
    }
  }
  return true;
}

// Review nhi 06/11 #34: bấm ✦ Gợi ý từ AI ở form Soạn thảo tờ trình (nếu có), chờ AI điền xong.
// T54: bấm Trình ký ở hộp thoại Trình ký VOffice — điền mật khẩu VOffice (GIẢ LẬP) khi hình thức VOffice.
export async function signGo(dlg) {
  const pw = dlg.locator('#tk-pw');
  if (await pw.count()) await pw.fill('Vht@2026');
  await dlg.locator('#go').click();
}

export async function aiFill(page) {
  const b = page.locator('.vmodal.ef [data-ef-aifill]');
  if (!(await b.count())) return;
  await page.evaluate(() => { D.aiDelay = 0; });
  await b.click();
  await expect(page.locator('[data-ef-ai-wait]')).toHaveCount(0);
  await expect(page.locator('.vmodal.ef [data-ef-aifill]')).toBeEnabled();
}

// T59 Q4, Q8 (D-114): nhập kết quả rà soát trên tab Rà soát tồn kho của màn việc bước 7 rồi Gửi Chỉ huy Kho (nút trên thanh trạng thái).
// Tệp kết quả Excel → hệ thống điền bảng (GIẢ LẬP số mẫu); Biên bản kiểm đếm có ký bắt buộc. Vẫn điền số mẫu vào ô cho chắc.
export async function fillRsk(page, send = true) {
  await page.locator('[data-rsk-ed]').waitFor();
  await page.locator('#rsk-file').setInputFiles({ name: 'Ket-qua-ra-soat.xlsx', mimeType: 'application/vnd.ms-excel', buffer: Buffer.alloc(16) });
  await expect(page.locator('.rsk-file')).toHaveText('Ket-qua-ra-soat.xlsx');
  // T72 #78 (D-122 Q2): bỏ ô Biên bản kiểm đếm có ký.
  await page.evaluate(() => {
    D.rstkSample(D.items, Flow.state.clock).kq.rows.forEach((r) => Object.keys(r).forEach((k) => {
      const el = document.querySelector(`[data-rsk-in="${r.n}:${k}"]`);
      if (el) el.value = r[k] == null ? '' : String(r[k]);
    }));
  });
  if (send) {
    const own = page.locator('[data-rsk-save]');
    if (await own.count()) await own.click();
    else await page.locator('.task-acts [data-act]', { hasText: 'Gửi Chỉ huy Kho' }).first().click();
    await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  }
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
