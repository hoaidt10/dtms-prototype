// T16 B0.5 — sửa theo comment Figma nhóm A + khung Gợi ý AI nhóm B (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2d).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, openForm, closeForm, aiDecide, uploadReq } from './helpers.mjs';

async function jump(page, task, vars = {}, proc = 'MS01.01') {
  return page.evaluate(([t, v, p]) => {
    Flow.jumpTo(t, 'minh', v, p, undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return k.id;
  }, [task, vars, proc]);
}
const docs = (page) => page.locator('section.vcard', { hasText: 'Danh sách tài liệu' });
const outs = (page) => page.locator('section.vcard', { hasText: 'Văn bản đầu ra' });

// T34 (D-90): SCR-28 Thêm mới ĐXMS — comment cùng màn Tách.
// [T34 bỏ Tách] test('#1, #12 SCR-28: Nhiệm vụ / Đề tài bắt buộc; Mật → AI kiểm tra quy tắc bảo mật', async ({ page }) => {
// [T34 bỏ Tách]   await fresh(page, '#/dxms/create');
// [T34 bỏ Tách]   await page.locator('#x-title').fill('Mua sắm anten băng Ka');
// [T34 bỏ Tách]   await page.locator('#x-save').click();
// [T34 bỏ Tách]   await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn Đề tài / dự án.']);
// [T34 bỏ Tách]   await expect(page.locator('[data-sec-check]')).toHaveCount(0);
// [T34 bỏ Tách]   await page.locator('[data-vsel="x-nv"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="NV-KHCN-2026-006"]').click();
// [T34 bỏ Tách]   await expect(page.locator('input[value="Nhiệm vụ KHCN"]')).toHaveCount(1);
// [T34 bỏ Tách]   await page.locator('[data-vsel="x-sec"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="Có"]').click();
// [T34 bỏ Tách]   const card = page.locator('[data-sec-check]');
// [T34 bỏ Tách]   await expect(card).toContainText('AI kiểm tra quy tắc bảo mật');
// [T34 bỏ Tách]   await expect(card.locator('tr', { hasText: 'Tên ĐXMS' }).locator('.vbadge')).toHaveText('Không đạt');
// [T34 bỏ Tách]   await page.locator('#x-title').fill('Mua sắm thiết bị đo kiểm');
// [T34 bỏ Tách]   await page.locator('#x-title').blur();
// [T34 bỏ Tách]   await expect(page.locator('[data-sec-check] tr', { hasText: 'Tên ĐXMS' }).locator('.vbadge')).toHaveText('Đạt');
// [T34 bỏ Tách]   await page.locator('#x-save').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/dxms$/);
// [T34 bỏ Tách]   const code = await page.evaluate(() => Flow.dxmsAll()[0].code);
// [T34 bỏ Tách]   await page.evaluate((c) => { location.hash = '#/dxms/' + encodeURIComponent(c); }, code);
// [T34 bỏ Tách]   await expect(page.locator('.ginfo')).toContainText('NV-KHCN-2026-006 — Anten mảng pha băng Ka');
// [T34 bỏ Tách]   expect(page.errors).toEqual([]);
// [T34 bỏ Tách] });

test('#24: Chọn mẫu tài liệu theo bước + quy trình; Văn bản đầu ra có Trạng thái', async ({ page }) => {
  await fresh(page);
  // T29 B15 (review Huylx4 #5): bước không có biểu mẫu của bước (bước 1) thì không hiện nút.
  await jump(page, 1);
  await expect(docs(page).locator('[data-tpl]')).toHaveCount(0);
  const dlg = page.locator('.vmodal', { hasText: 'Danh sách tài liệu mẫu' });
  await jump(page, 16);
  await docs(page).locator('[data-tpl]').click();
  await expect(dlg.locator('#tpl-here')).toBeChecked();
  await expect(dlg.locator('tbody tr')).toHaveCount(1);
  await expect(dlg.locator('tbody')).toContainText('BM-03');
  // Bỏ "Chỉ mẫu của bước này": mẫu của cả quy trình theo luồng (≥ 160 tỷ: BM-01, không BM-09).
  await dlg.locator('#tpl-here').uncheck();
  await expect(dlg.locator('tbody')).not.toContainText('BM-09');
  await expect(dlg.locator('tbody')).toContainText('BM-01');
  await dlg.locator('[data-close]').first().click();
  // Task 12: dự thảo AI soạn → "AI đã gợi ý"; Lưu nháp → "Đang làm"; văn bản bước trước → "Hoàn thành".
  await jump(page, 12);
  await expect(outs(page).locator('tr', { hasText: 'BM-01' }).locator('.vbadge')).toHaveText('AI đã gợi ý');
  const f = await openForm(page);
  await f.locator('#ef-draft').click();
  await expect(outs(page).locator('tr', { hasText: 'BM-01' }).locator('.vbadge')).toHaveText('Đang làm');
  await jump(page, 17);
  await expect(outs(page).locator('tr', { hasText: 'BM-01' }).locator('.vbadge')).toHaveText('Hoàn thành');
  expect(page.errors).toEqual([]);
});

test('#3 task 08: thêm NCC mới (bảng lặp); review nhi 06/11 #24: không còn Đối soát ĐXMS', async ({ page }) => {
  await fresh(page);
  await jump(page, 8);
  const f = await openForm(page);
  await expect(f).not.toContainText('Đối soát ĐXMS');
  const dl = f.locator('.ef-dl', { hasText: 'Nhà cung cấp mới' });
  await dl.locator('[data-ef-add]').click();
  await dl.locator('[data-ef="nccMoi::0::ten"]').fill('Công ty TNHH Đo kiểm Delta');
  await dl.locator('[data-ef="nccMoi::0::email"]').fill('sai-email');
  await dl.locator('[data-vsel="ef-nccMoi::0::nganh"]').click();
  await page.locator('.vsel-panel [data-opt]').first().click();
  await f.locator('#ok').click();
  await expect(f.locator('.vfield.invalid .msg')).toHaveText(['Sai định dạng']);
  await f.locator('[data-ef="nccMoi::0::email"]').fill('baogia@delta.vn');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  expect(await page.evaluate(() => Flow.ui.nccMoi[0].email)).toBe('baogia@delta.vn');
  expect(page.errors).toEqual([]);
});

test('#5 task 10: báo giá từng NCC là tài liệu bắt buộc của "Báo giá đạt"', async ({ page }) => {
  await fresh(page);
  await jump(page, 10);
  await expect(docs(page).locator('.doc-req', { hasText: 'Báo giá — NCC Alpha' })).toContainText('bắt buộc, chưa tải lên');
  await primary(page, 'Báo giá đạt');
  expect(await lastToast(page)).toContain('Báo giá — NCC');
  await closeForm(page);
  await uploadReq(page, 'quote_');
  await expect(docs(page).locator('.doc-req')).toHaveCount(0);
  await expect(docs(page)).toContainText('Bao-gia-Alpha.pdf');
  expect(page.errors).toEqual([]);
});

test('#6–10 task 13: duyệt từng phần, Đồng ý chỉ khi mọi phần Đạt; phản hồi + giải trình ở task 12; lịch sử chỉnh sửa', async ({ page }) => {
  await fresh(page);
  await jump(page, 13);
  let f = await openForm(page, 'Đồng ý');
  await expect(f.locator('.ef-dl', { hasText: 'Duyệt từng phần' }).locator('.ef-row')).toHaveCount(8);
  const row = f.locator('.ef-row', { hasText: '6. Biện pháp' });
  // Góp ý 06/11: Đạt hay Không đạt đều có ô Lý do, hướng dẫn / chỉ đạo, không bắt buộc.
  await expect(row.locator('textarea')).toHaveCount(1);
  await expect(f.locator('.ef-dl', { hasText: 'Duyệt từng phần' }).locator('textarea')).toHaveCount(8);
  await row.locator('[data-ef-radio$="ketQua"]', { hasText: 'Không đạt' }).click();
  await expect(row.locator('textarea')).toHaveCount(1);
  await f.locator('#ok').click();
  await expect(f.locator('.vfield.invalid')).toHaveCount(0);
  await f.locator('.ef-row', { hasText: '6. Biện pháp' }).locator('textarea').fill('Bổ sung mốc giao hàng từng lô.');
  await f.locator('#ok').click();
  expect(await lastToast(page)).toContain('chưa duyệt tổng thể được');
  await closeForm(page);
  f = await openForm(page, 'Không đồng ý');
  await f.locator('#ef-no').click();
  expect(await lastToast(page)).toContain('ít nhất một phần');
  await f.locator('.ef-row', { hasText: '6. Biện pháp' }).locator('[data-ef-radio$="ketQua"]', { hasText: 'Không đạt' }).click();
  await f.locator('.ef-row', { hasText: '6. Biện pháp' }).locator('textarea').fill('Bổ sung mốc giao hàng từng lô.');
  await f.locator('#ef-no').click();
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => t.task))).toEqual([12]);
  expect(await page.evaluate(() => Flow.lastOf(13).reason)).toBe('6. Biện pháp, kế hoạch thực hiện: Bổ sung mốc giao hàng từng lô.');
  // Task 12: phản hồi chỉ đạo — Không sửa thì giải trình bắt buộc.
  await page.evaluate(() => { Flow.setPersona('minh'); location.hash = '#/task/' + Flow.state.tokens[0].id; });
  f = await openForm(page);
  const fb = f.locator('.ef-dl', { hasText: 'Phản hồi chỉ đạo' });
  await expect(fb).toContainText('Bổ sung mốc giao hàng từng lô.');
  await fb.locator('[data-ef-radio$="xuLy"]', { hasText: 'Không sửa' }).click();
  await aiDecide(f, 'Sự cần thiết');
  await f.locator('#ok').click();
  await expect(f.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập giải trình']);
  await f.locator('.ef-dl', { hasText: 'Phản hồi chỉ đạo' }).locator('textarea').fill('Mốc giao hàng đã có ở phụ lục tiến độ.');
  await f.locator('#ok').click();
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => t.task))).toEqual([13]);
  // Task 13 lần 2: giải trình hiện ở dòng của phần; lịch sử chỉnh sửa + AI tóm tắt.
  await page.evaluate(() => { Flow.setPersona('hai'); location.hash = '#/task/' + Flow.state.tokens[0].id; });
  f = await openForm(page, 'Đồng ý');
  await expect(f.locator('.ef-row', { hasText: '6. Biện pháp' })).toContainText('Người soạn giải trình: Mốc giao hàng đã có ở phụ lục tiến độ.');
  await expect(f.locator('.ef-table', { hasText: 'Lịch sử chỉnh sửa theo phần' })).toContainText('Không sửa — giải trình');
  await expect(f.locator('.ai-box', { hasText: 'tóm tắt thay đổi' })).toContainText('1 phần giữ nguyên có giải trình');
  await f.locator('#ok').click();
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => t.task))).toEqual([16]);
  expect(page.errors).toEqual([]);
});

test('#14, #13/#15, #17 (B): phiếu BM-04 riêng; AI đồng bộ ý kiến ở task 26; AI kiểm tra đủ hồ sơ ở task 36', async ({ page }) => {
  await fresh(page);
  await jump(page, 19);
  let f = await openForm(page);
  await expect(f).toContainText('không hiển thị ý kiến của cơ quan khác');
  await closeForm(page);
  await jump(page, 26);
  f = await openForm(page);
  // Góp ý 06/11: nút ✦ Gợi ý từ AI → popup (kết quả AI bước 24, 25 + gợi ý từng ý kiến) → Áp dụng điền vào form.
  await expect(f.locator('.ai-box')).toHaveCount(0);
  await f.locator('[data-ef-ai="quyetDinhYKien"]').click();
  const pop = page.locator('[data-ef-ai-pop]');
  await expect(pop.locator('.lf-ai2')).toContainText('Nguồn vốn');
  await expect(pop.locator('.lf-ai2')).toContainText('Không có xung đột');
  await expect(pop.locator('tr[data-ai-row]')).toHaveCount(2);
  // Ý kiến Ban Tài chính: AI gợi ý Không đồng ý + dự thảo giải trình; bỏ chọn ý kiến đầu → giữ nguyên trên form.
  const tc = pop.locator('tr[data-ai-row]', { hasText: 'Nguồn vốn' });
  await expect(tc.locator('.vradio-opt.on')).toHaveText('Không đồng ý');
  await expect(tc.locator('textarea')).toHaveValue(/TSCĐ/);
  await tc.locator('textarea').fill('Giải trình đã sửa trong popup');
  await pop.locator('tr[data-ai-row]', { hasText: 'Biện pháp' }).locator('[data-ai-on]').uncheck();
  await page.locator('[data-ef-ai-apply]').click();
  await expect(pop).toHaveCount(0);
  const row = f.locator('.ef-row', { hasText: 'Nguồn vốn' });
  await expect(row.locator('[data-ef-radio$="quyetDinh"].on')).toHaveText('Không đồng ý');
  await expect(row.locator('textarea')).toHaveValue('Giải trình đã sửa trong popup');
  await expect(f.locator('.ef-row', { hasText: 'Biện pháp' }).locator('textarea')).toHaveValue('');
  await expect(f.locator('[data-ef-ai="quyetDinhYKien"]')).toHaveText('✦ Gợi ý lại');
  await closeForm(page);
  await jump(page, 36);
  f = await openForm(page);
  await expect(f.locator('.ai-box', { hasText: 'kiểm tra đủ hồ sơ' })).toContainText('Kết quả:');
  expect(page.errors).toEqual([]);
});

test('#18–21 task 46: thời điểm trình ký / ký, lý do từ chối, KPI ký; #22, #23 task 60: phiếu Tập đoàn + AI', async ({ page }) => {
  await fresh(page);
  await jump(page, 46);
  let f = await openForm(page);
  const t = f.locator('.ef-table', { hasText: 'Người ký BM-05' });
  for (const h of ['Trình ký lúc', 'Ký lúc', 'Thời gian xử lý', 'KPI ký', 'Lý do từ chối (VOffice)']) await expect(t.locator('th').getByText(h, { exact: true })).toHaveCount(1);
  await expect(f.locator('.ai-box', { hasText: 'KPI người ký' })).toBeVisible();
  await closeForm(page);
  await jump(page, 60, { reportTD: true });
  await expect(docs(page).locator('.doc-req.opt')).toContainText('Phiếu nhận xét của Tập đoàn — nếu có, chưa tải lên');
  await docs(page).locator('[data-req-up="tdReviewFile"]').click();
  await expect(docs(page)).toContainText('Phieu-nhan-xet-Tap-doan');
  expect(page.errors).toEqual([]);
});

test('#11: ký ngoài hệ thống bắt buộc lý do, ghi lại để thống kê (T54: SRS 32 BR-TKV-01-13, kết quả nhập ở màn Trình ký)', async ({ page }) => {
  await fresh(page);
  await jump(page, 43); // Bước 17 không còn hộp thoại Trình ký (P-225): dùng bước ký BM-05 của TTMS.
  await page.locator('.task-acts [data-act].primary').click();
  const ef = page.locator('.vmodal.ef');
  if (await ef.count()) await ef.locator('#ok').click();
  await page.locator('.overlay [data-mode="hard"]').click();
  await page.locator('#go').click();
  expect(await lastToast(page)).toContain('Lý do ký ngoài hệ thống');
  await page.locator('#hr').fill('VOffice gián đoạn');
  await page.locator('#go').click();
  await expect.poll(() => page.evaluate(() => (Flow.state.vars.hardSigns || []).map((x) => x.reason))).toEqual(['VOffice gián đoạn']);
  expect(page.errors).toEqual([]);
});
