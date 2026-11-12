// T11 B2 / T18 B2 (BPMN 12/10, 78 bước) — PH09 Khoản đầu tư, cảnh 1–3 (plan docs/dtms/prototype-KDT-chuan-bi.md §2.4, §8): hồ sơ KĐT chạy luồng MS13 —
// task 1–10 (body MS01 với nhãn KĐT), SCR-57 Ban Tài chính ‖ SCR-58 TTMS, cổng phân luồng / báo giá / gộp; nhánh chuyển MS14 (SCR-66).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, state, openForm, aiDecide, closeForm, uploadReq, signGo } from './helpers.mjs';

// B0.4 (2): nội dung bước nằm trong eForm (dialog khi bấm nút) và Văn bản đầu ra (xem trước PDF).
async function formText(page, label) { const f = await openForm(page, label); const t = await f.innerText(); await closeForm(page); return t; }
async function previewText(page, name) {
  await page.locator('[data-preview]', { hasText: name }).first().click();
  const t = await page.locator('.pdf-view').innerText();
  await page.locator('.overlay [data-close]').first().click();
  return t;
}

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|WBS|D-\d|P-\d/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const pick = async (page, id, text) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: text }).first().click();
  // T45: Đề tài / dự án (k-nv) là chọn nhiều — danh sách giữ mở sau khi chọn, Escape để đóng.
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
const as = (page, who) => page.evaluate((id) => Flow.setPersona(id), who);
// Mở việc đầu tiên của vai đang đăng nhập.
async function openMine(page, task) {
  const s = await state(page);
  const tok = s.mine.find((t) => task == null || String(t.task) === String(task));
  expect(tok, `vai hiện tại phải có việc ${task ?? ''}`).toBeTruthy();
  await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tok.id);
  await expect(page.locator('.pg-title')).toHaveText(/Xem chi tiết hồ sơ|Xử lý hồ sơ/);
  return tok;
}
// Công cụ demo › Hồ sơ demo KĐT-2026-0032 rồi mở nhánh phụ thứ i.
async function branch(page, i) {
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await expect(page).toHaveURL(/#\/kdt\/create$/);
  await page.locator('#demo').click();
  await page.locator(`.demo-panel [data-branch="${i}"]`).click();
  await expect(page).toHaveURL(/#\/task\//);
}

test('Cảnh 1–3: tạo KĐT, tạo hồ sơ start MS13; task 1–10; Ban Tài chính ‖ TTMS xác nhận → MS13 hai giai đoạn, sang dự thảo', async ({ page }) => {
  await fresh(page, '#/kdt/create');
  await page.locator('#k-title').fill('Đầu tư hệ thống đo kiểm OTA tích hợp phục vụ nhiệm vụ KHCN 5G-A');
  await pick(page, 'k-nv', 'DT-KHCN-2027-002');
  await pick(page, 'k-field', 'Viễn thông - CNTT');
  await pick(page, 'k-type', 'Khoa học công nghệ');
  await pick(page, 'k-nature', 'Cần tích hợp');
  await page.locator('#k-est').fill('120');
  await page.locator('#k-save').click();
  await expect(page).toHaveURL(/#\/kdt$/);
  // Chỉnh sửa › Tạo hồ sơ › Lưu = start quy trình, mở ngay bước 01.
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0032') + '/edit'; });
  // Màn Thêm mới hồ sơ chủ trương KĐT (khuôn SCR-96) gộp bước 1–5; cảnh này đi từng bước qua eForm → tạo hồ sơ bằng engine (như Lưu nháp).
  await page.evaluate(() => { Flow.createKdtCase('KĐT-2026-0032', { kind: 'CT' }); location.hash = '#/task/' + Flow.state.tokens[0].id; });
  await expect(page).toHaveURL(/#\/task\//);
  const gi = page.locator('.tmain .ginfo').first();
  await expect(gi).toContainText('Mã KĐTKĐT-2026-0032');
  // T45 (D-103): hồ sơ chạy từ bước 1 là hồ sơ phê duyệt chủ trương KĐT.
  await expect(gi).toContainText('Loại hồ sơPhê duyệt chủ trương KĐT');
  await expect(gi).toContainText('Chưa xác định nhóm (MS13 · MS14 · MS15)');
  await expect(gi).toContainText('Tổng mức vốn dự kiến120,00 tỷ đồng');
  expect(await formText(page)).toContain('2318/QĐ-VHT');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);

  // Task 4: Thông tin cơ bản KĐT — 3 yếu tố phân luồng khoá, không có Mức ưu tiên.
  await openMine(page, 4);
  await expect(gi).toContainText('Tính chất tài sảnCần tích hợp');
  const f4 = await openForm(page);
  await expect(f4.locator('label', { hasText: /^Mức ưu tiên$/ })).toHaveCount(0);
  await expect(f4.locator('label', { hasText: /^Tính chất tài sản$/ })).toHaveCount(0);
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  for (const n of [5, 7, 8]) { await openMine(page, n); expect(await primary(page)).toBe(true); }
  // Task 10: chốt tổng mức vốn → gửi đồng thời hai yêu cầu xác nhận.
  await openMine(page, 10);
  expect(await formText(page)).toContain('Tổng mức vốn thực tế 118,50 tỷ');
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Chốt tổng mức vốn, gửi xác nhận');
  expect(await primary(page)).toBe(true);
  expect((await state(page)).any.sort()).toEqual(['lan', 'thu']);

  // SCR-57 — Ban Tài chính.
  await as(page, 'thu');
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  // T58: hồ sơ mẫu HS-2026-0029 cũng có việc chờ cùng tên → lọc theo mã KĐT.
  const r57 = page.locator('.vtable tbody tr', { hasText: 'Xác nhận hình thành TSCĐ' }).filter({ hasText: 'Chưa xử lý' }).filter({ hasText: 'KĐT-2026-0032' });
  await expect(r57).toContainText('KĐT-2026-0032');
  // T34 v0.2 (D-92): Việc của tôi không có cột Loại / Mã hồ sơ — mã hồ sơ (hồ sơ chủ trương, T45) ở data-code.
  await expect(r57).toHaveAttribute('data-code', 'HS-2026-0032');
  await r57.locator('td').nth(4).click();
  const t57 = await formText(page, 'Xác nhận OK');
  for (const x of ['Hình thành tài sản cố định', 'Danh mục đầu tư', 'Máy phân tích phổ vector 44 GHz']) expect(t57).toContain(x);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Xác nhận OK')).toBe(true);
  expect((await state(page)).any).toEqual(['lan']);

  // SCR-58 — TTMS: 04 yếu tố + kết quả phân luồng; yếu tố sai thì không cho Xác nhận OK.
  await as(page, 'lan');
  await openMine(page, 12);
  const m = await openForm(page, 'Xác nhận OK');
  await expect(m).toContainText('Xác nhận 04 yếu tố định danh');
  await expect(m).toContainText('Đơn giản'); // T56 Q7: Nhóm KĐT không ghi mã
  await expect(m).toContainText('Viễn thông - CNTT: dưới 160 tỷ đồng');
  await expect(m).toContainText('BM01→BM03');
  await expect(m.locator('.ef-text', { hasText: 'Xác nhận hình thành TSCĐ' })).toContainText('OK');
  await expect(m.locator('.vbadge', { hasText: /^Không đạt$/ })).toHaveCount(2);
  expect(await mainText(page)).not.toMatch(BA);
  // Bỏ chọn "Đúng" ở Tính chất tài sản → BE từ chối "Xác nhận OK".
  await m.locator('[data-ef-chk="yeuTo::3::dung"]').uncheck();
  await m.locator('#ok').click();
  expect(await lastToast(page)).toContain('Có yếu tố chưa đúng');
  await m.locator('[data-ef-chk="yeuTo::3::dung"]').check();
  await m.locator('#ok').click();
  expect(await page.evaluate(() => [Flow.state.vars.group, Flow.state.vars.branch, Flow.state.tokens.map((t) => t.task), Flow.state.vars.cap.ct])).toEqual(['MS13', '2GD', [15], 'VHT']);

  // 13 xác định thẩm quyền (service) → Minh: bước 15 dự thảo; Thông tin chung có nhóm và nhánh.
  await as(page, 'minh');
  await openMine(page, 15);
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Hoàn thành dự thảo');
  await expect(gi).toContainText('MS13 · KĐT đơn giản');
  await expect(gi).toContainText('BM01→BM03');
  await expect(gi).toContainText('Tổng mức vốn thực tế (gồm VAT)118,50 tỷ đồng');
  // Danh sách KĐT: trạng thái suy từ hồ sơ.
  await page.evaluate(() => { location.hash = '#/kdt'; });
  const row = page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' });
  await expect(row.locator('.vbadge')).toHaveText('Đang lập chủ trương');
  await expect(row).toContainText('Đơn giản'); // T56 Q7
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ SCR-66: KĐT-2026-0033 (lĩnh vực Khác, 96 tỷ) vượt ngưỡng MS13 → chuyển luồng MS14, hồ sơ mới của cùng KĐT', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 0);
  expect(await page.evaluate(() => [Flow.state.persona, Flow.state.tokens.map((t) => t.task)])).toEqual(['lan', [12]]);
  const f = await openForm(page, 'Xác nhận OK');
  await expect(f.locator('.banner-bad')).toContainText('96,00 tỷ đồng không thuộc ngưỡng MS13 (Lĩnh vực khác: dưới 90 tỷ đồng)');
  await expect(f).toContainText('Thông thường'); // T56 Q7
  await f.locator('#ok').click();
  const m = page.locator('main');
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0033\/chuyen-luong$/);
  expect(await lastToast(page)).toContain('chuyển luồng MS14');
  await expect(page.locator('.pg-title')).toContainText('Thông báo chuyển luồng');
  await expect(m).toContainText('HS-2026-0033');
  await expect(m).toContainText('Đã chuyển luồng');
  await expect(m.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(m.locator('.vtable tbody tr')).toContainText('HS-2026-0127');
  await expect(m.locator('.vtable tbody tr')).toContainText('Thông thường'); // T56 Q7
  expect(await mainText(page)).not.toMatch(BA);
  // Danh sách KĐT; Chi tiết KĐT › Danh sách hồ sơ có liên kết tới thông báo.
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0033' }).locator('.vbadge')).toHaveText('Chuyển MS14');
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0033'); });
  await expect(page.locator('[data-kdt-profiles] tbody tr')).toHaveCount(2);
  await page.locator('[data-kdt-profiles] a', { hasText: 'Kết thúc — đã chuyển luồng (HS-2026-0127)' }).click();
  await expect(page).toHaveURL(/chuyen-luong$/);
  // Việc của tôi của ĐVĐX: hồ sơ mới MS14 mở thông báo chuyển luồng.
  await as(page, 'minh');
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  const r = page.locator('.vtable tbody tr[data-code="HS-2026-0127"]');
  await expect(r).toContainText('MS14');
  await r.locator('td').nth(4).click();
  await expect(page).toHaveURL(/chuyen-luong$/);
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ: TTMS xác nhận 04 yếu tố Không OK → AI gợi ý, hồ sơ về bước 10 kèm lý do', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 1);
  expect(await primary(page, 'Không OK')).toBe(true);
  expect(await page.evaluate(() => [Flow.state.tokens.map((t) => `${t.task}:${t.who}`), Flow.state.vars.group || null])).toEqual([['10:minh'], null]);
  await as(page, 'minh');
  await openMine(page, 10);
  await expect(page.locator('.trail [data-note]')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

test('Công cụ demo KĐT: cảnh K2, K3 đặt đúng việc; cảnh K3 TTMS thấy Ban Tài chính đang chờ', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await page.locator('#demo').click();
  await expect(page.locator('.demo-panel [data-scene]')).toHaveCount(10);
  await page.locator('.demo-panel [data-scene="K2"]').click();
  expect(await page.evaluate(() => [Flow.state.persona, Flow.state.tokens.map((t) => t.task)])).toEqual(['minh', [7]]);
  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="K3"]').click();
  expect(await formText(page, 'Xác nhận OK')).toContain('Hình thành tài sản cố định');
  expect(await page.evaluate(() => [Flow.state.persona, Flow.state.tokens.map((t) => t.task).sort()])).toEqual(['thu', [11, 12]]);
  await as(page, 'lan');
  await openMine(page, 12);
  expect(await formText(page, 'Xác nhận OK')).toContain('Chờ xác nhận');
  expect(page.errors).toEqual([]);
});

// T11 B3 / T18 B2 — cảnh 4–6 (BPMN 12/10): dự thảo, BM-01 + Checklist 01, chọn CQCM, CQCM chủ trì xác nhận danh sách, trình;
// khối chung 25–38 vòng BM-01: TTMS thẩm định ‖ CQCM gửi ý kiến, 02 vòng check → họp lần 1 → Chuyên quản, Chỉ huy xác nhận → cập nhật;
// TTMS thẩm định và hoàn chỉnh (46) → cổng cấp duyệt VHT → ký 47 / 48.
test('Cảnh 4–6: chủ trương BM-01, thẩm định vòng BM-01 ở khối chung 25–38 (vòng check 2/2, họp 1/2), ký thẩm định và ký duyệt chủ trương', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="K4"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  const m = page.locator('main');
  const gi = page.locator('.tmain .ginfo').first();
  const run = async (who, task, label) => { await as(page, who); await openMine(page, task); expect(await primary(page, label)).toBe(true); };
  expect(await formText(page)).toContain('Biện pháp, kế hoạch thực hiện');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Hoàn thành dự thảo')).toBe(true);
  await openMine(page, 17);
  const t17 = await formText(page);
  expect(t17).toContain('AI hỗ trợ soạn nội dung đề xuất');
  expect(t17).toContain('BM01→BM03');
  // Kết quả bước 13 (thẩm quyền): KHCN 118,5 tỷ → VHT / VHT.
  expect(t17).toContain('Phê duyệt chủ trương: VHT · Phê duyệt KĐT: VHT');
  expect(await primary(page)).toBe(true);
  // 39: tờ trình BM-01 theo mẫu KĐT, mục Sự cần thiết còn trống (bản xem trước ở Văn bản đầu ra) → chọn gợi ý AI.
  await openMine(page, 39);
  const t39 = await formText(page);
  expect(t39).toContain('Tờ trình chủ trương KĐT (BM-01)');
  expect(t39).toContain('4.2. Sự cần thiết');
  expect(await previewText(page, 'BM-01')).toContain('Chưa có nội dung.');
  expect(await mainText(page)).not.toMatch(BA);
  const f39 = await openForm(page);
  await aiDecide(f39, 'Sự cần thiết');
  await f39.locator('#ok').click();
  await openMine(page, 40);
  const f40 = await openForm(page);
  await expect(f40).toContainText('Checklist số 01');
  await expect(f40.locator('input[value="Không áp dụng — căn cứ là đề tài KHCN"]')).toHaveCount(1);
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await openMine(page, 41);
  const t41 = await formText(page);
  expect(t41).toContain('Chọn CQCM phối hợp thẩm định chủ trương');
  expect(t41).toContain('Đơn vị chủ trì');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  // 42 (mới): CQCM chủ trì xác nhận danh sách CQCM.
  await as(page, 'lan');
  await openMine(page, 42);
  const t42 = await formText(page, 'Đồng ý danh sách CQCM');
  expect(t42).toContain('CQCM phối hợp do đơn vị đề xuất chọn');
  expect(t42).toContain('Ban Tài chính');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Đồng ý danh sách CQCM')).toBe(true);
  // 43 → 44 HT/AI kiểm tra đạt → 45 mở vòng BM-01 → cổng đủ điều kiện → TTMS thẩm định (27).
  await run('minh', 43, 'Trình hồ sơ');
  expect(await page.evaluate(() => [Flow.state.vars.td, Flow.state.tokens.map((t) => `${t.task}:${t.who}`)])).toEqual(['CT', ['27:lan']]);

  // Vòng BM-01 — lượt 1: Ban Tài chính cần sửa → ĐVĐX bổ sung.
  await as(page, 'lan');
  await openMine(page, 27);
  await expect(gi).toContainText('Thẩm định chủ trương BM-01');
  const t27 = await formText(page);
  expect(t27).toContain('Rà soát tính hợp lệ');
  expect(t27).toContain('Vòng check 0/2');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'thu');
  await openMine(page, 29);
  const f29 = await openForm(page);
  await expect(f29).toContainText('Phiếu nhận xét (BM-09)');
  await expect(f29).toContainText('Ban Tài chính');
  await expect(f29.locator('textarea', { hasText: 'Chưa tách chi phí TSCĐ / CCDC' })).toHaveCount(1);
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await run('hoa', 29);
  await as(page, 'minh');
  await openMine(page, 31);
  expect(await formText(page)).toContain('Bảng tiếp thu, giải trình ý kiến');
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Bổ sung hồ sơ theo ý kiến');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  // Lượt 2: vẫn cần sửa → giải trình → họp.
  await run('lan', 27); await run('thu', 29); await run('hoa', 29);
  await as(page, 'minh');
  await openMine(page, 31);
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Giải trình, bảo lưu ý kiến');
  expect(await primary(page)).toBe(true);
  await as(page, 'lan');
  await openMine(page, 32);
  const f32 = await openForm(page);
  await expect(f32).toContainText('tổ chức họp lần 1/2');
  await expect(f32).toContainText('Vòng check 2/2');
  await f32.locator('#ok').click();
  expect(await lastToast(page)).toContain('Biên bản họp');
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('[data-req-up="kMinutes"]').click();
  expect(await primary(page, 'Đã thống nhất sau họp')).toBe(true);
  await as(page, 'minh');
  await openMine(page, 34);
  const t34 = await formText(page);
  expect(t34).toContain('Nội dung điều chỉnh đã thống nhất sau họp');
  expect(t34).toContain('Họp 1/2');
  expect(await primary(page)).toBe(true);
  await as(page, 'hai');
  await openMine(page, 35);
  const f35 = await openForm(page);
  await expect(f35.locator('.vbadge', { hasText: /^Đã xác nhận$/ })).toHaveCount(1);
  await closeForm(page);
  expect(await primary(page)).toBe(true);
  await run('minh', 36);
  // Lượt 3 thống nhất → ra khỏi khối chung theo vòng BM-01 → TTMS thẩm định và hoàn chỉnh (46) → cấp VHT → ký.
  await run('lan', 27); await run('thu', 29); await run('hoa', 29);
  await as(page, 'lan');
  await openMine(page, 46);
  const t46 = await formText(page);
  expect(t46).toContain('Ý kiến thẩm định đã xử lý trong vòng');
  expect(t46).toContain('Phê duyệt chủ trương: VHT');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await openMine(page, 47);
  expect(await formText(page, 'Ký thẩm định')).toContain('Khối chữ ký BM-01');
  await expect(m.locator('[data-preview]', { hasText: 'BM-01 Tờ trình chủ trương KĐT' })).toHaveCount(1);
  await expect(m).toContainText('Bien-ban-hop-');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký thẩm định trên tờ trình')).toBe(true);
  await as(page, 'tgd');
  await openMine(page, 48);
  expect(await formText(page, 'Ký phê duyệt chủ trương')).toContain('Phê duyệt chủ trương: VHT');
  expect(await primary(page, 'Ký phê duyệt chủ trương')).toBe(true);
  // T45 (D-103): ký chủ trương kết thúc hồ sơ chủ trương → KĐT Đã phê duyệt chủ trương.
  expect(await page.evaluate(() => [Flow.state.status, Flow.state.tokens.length, Flow.kdtCases().find((c) => c.code === Flow.state.code).stage])).toEqual(['approved', 0, 'CT_OK']);
  const ctCode = await page.evaluate(() => Flow.state.code);
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Đã phê duyệt chủ trương');
  // ĐVĐX tạo hồ sơ phê duyệt KĐT chọn hồ sơ chủ trương → 49 AI → 50 lập hồ sơ KĐT: kế thừa bộ đếm vòng BM-01 2/2 vòng check, 1/2 lần họp (P-54).
  await as(page, 'minh');
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0032') + '/tao-ho-so'; });
  await expect(page.locator('[data-vsel="kc-parent"]')).toContainText(ctCode);
  // Bước 50 đi qua eForm ở dưới → tạo hồ sơ KĐT bằng engine (như Lưu nháp của màn).
  await page.evaluate((p) => { Flow.createKdtCase('KĐT-2026-0032', { kind: 'KDT', parent: p }); location.hash = '#/task/' + Flow.state.tokens[0].id; }, ctCode);
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.state.code, Flow.state.tokens.map((t) => `${t.task}:${t.who}`), Flow.state.vars.chk.CT, Flow.state.vars.meet.CT])).toEqual([ctCode + '-2', ['50:minh'], 2, 1]);
  // Văn bản đầu ra BM-01 (kế thừa); trạng thái KĐT.
  await openMine(page, 50);
  await expect(m).toContainText('BM-01 Tờ trình chủ trương KĐT (đã phê duyệt)');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Đang lập hồ sơ KĐT');
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ cảnh 5–6: CQCM chủ trì không đồng ý danh sách CQCM → bước 41; TGĐ VHT không ký — chỉ đạo dừng → KĐT dừng theo chỉ đạo', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 2);
  expect(await primary(page, 'Không đồng ý')).toBe(true);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => `${t.task}:${t.who}`))).toEqual(['41:minh']);
  await as(page, 'minh');
  await openMine(page, 41);
  expect(await formText(page)).toContain('CQCM chủ trì không đồng ý danh sách CQCM: “Nội dung thử”');
  await branch(page, 4);
  expect(await page.evaluate(() => Flow.state.persona)).toBe('tgd');
  expect(await primary(page, 'Không đồng ý — chỉ đạo dừng')).toBe(true);
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0032$/);
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Dừng theo chỉ đạo');
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ T18: HT/AI kiểm tra tờ trình Không đạt → về 39; hồ sơ chưa đủ điều kiện thẩm định → 26 → chọn lại CQCM (41); chủ trương thuộc Tập đoàn → 63 → 64', async ({ page }) => {
  await fresh(page, '#/kdt');
  // 43 → 44 → cổng "AI kiểm tra đạt?" Không đạt → 39, banner lý do.
  await branch(page, 7);
  expect(await primary(page, 'Trình hồ sơ')).toBe(true);
  expect(await lastToast(page)).toContain('Không đạt');
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => `${t.task}:${t.who}`))).toEqual(['39:minh']);
  await openMine(page, 39);
  const f39 = await openForm(page);
  await expect(f39.locator('.banner-bad')).toContainText('thiếu mục bắt buộc');
  await closeForm(page);
  // Cổng "Hồ sơ đủ điều kiện thẩm định?" = Chưa → AI gợi ý (25) → ĐVĐX sửa (26) → chọn lại CQCM của vòng BM-01.
  await branch(page, 8);
  const t26 = await formText(page);
  expect(t26).toContain('AI gợi ý thông tin cần chỉnh sửa');
  expect(t26).toContain('chưa đủ điều kiện');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Đã sửa hồ sơ')).toBe(true);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => `${t.task}:${t.who}`))).toEqual(['41:minh']);
  // Cổng cấp duyệt chủ trương (sau 46) = Tập đoàn → 63 AI dự thảo công văn (service) → 64 ĐVĐX hoàn thiện bộ hồ sơ.
  await branch(page, 9);
  await expect(page.locator('.tmain .ginfo').first()).toContainText('Hoàn thiện công văn và bộ hồ sơ gửi Tập đoàn');
  await expect(page.locator('.task-acts [data-act].primary')).toHaveCount(1);
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Đang trình Tập đoàn');
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0032'); });
  await page.locator('.dx-tabs [data-dtab="phan-loai"]').click();
  await expect(page.locator('section', { hasText: 'Cấp có thẩm quyền phê duyệt' })).toContainText('Tổng Giám đốc Tập đoàn');
  expect(page.errors).toEqual([]);
});

// T11 B4 / T18 B2 — cảnh 7–9: hồ sơ KĐT BM-03 + Checklist 02, thẩm định KĐT (vòng BM-03), Chỉ huy ký tờ trình, TTMS ký BM-14, TGĐ ký BM-18;
// nhánh gộp BM-00 trên KĐT-2026-0031.
async function scene(page, n) {
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await page.locator('#demo').click();
  await page.locator(`.demo-panel [data-scene="${n}"]`).click();
  await expect(page).toHaveURL(/#\/task\//);
}
test('Cảnh 7–8: BM-03 + Checklist 02 kế thừa chủ trương, thẩm định KĐT (vòng BM-03), Chỉ huy ký tờ trình, TTMS ký BM-14, TGĐ VHT ký BM-18 → Đã phê duyệt', async ({ page }) => {
  await fresh(page, '#/kdt');
  await scene(page, 'K7');
  const m = page.locator('main');
  const gi = page.locator('.tmain .ginfo').first();
  const run = async (who, task, label) => { await as(page, who); await openMine(page, task); expect(await primary(page, label)).toBe(true); };
  const t50 = await formText(page);
  expect(t50).toContain('AI gợi ý từ chủ trương đã phê duyệt');
  expect(t50).toContain('Tờ trình BM-03 và Phụ lục thuyết minh');
  const bm03 = await previewText(page, 'BM-03');
  expect(bm03).toContain('I. THÔNG TIN CHUNG VỀ KHOẢN ĐẦU TƯ');
  expect(bm03).toContain('1387/TTr-TTVT');
  expect(await previewText(page, 'PL-TM')).toContain('Chi phí hiệu chuẩn định kỳ năm thứ hai (chi phí hoạt động): 2,40 tỷ đồng');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Hoàn thành hồ sơ phê duyệt KĐT')).toBe(true);
  await openMine(page, 51);
  const t51 = await formText(page);
  expect(t51).toContain('Checklist số 02 — Kiểm tra hồ sơ trình thẩm định, phê duyệt KĐT đơn giản');
  expect(t51).toContain('1387/TTr-TTVT (BM-01 đã phê duyệt)');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await openMine(page, 52);
  const t52 = await formText(page);
  expect(t52).toContain('Chọn CQCM phối hợp thẩm định KĐT');
  expect(t52).toContain('Đầu mối nhận hồ sơ');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Gửi danh sách CQCM')).toBe(true);
  await run('lan', 53, 'Đồng ý danh sách CQCM');
  expect(await page.evaluate(() => [Flow.state.vars.td, Flow.state.tokens.map((t) => `${t.task}:${t.who}`)])).toEqual(['KDT', ['27:lan']]);
  // Vòng BM-03 — TTMS thẩm định ‖ CQCM gửi văn bản thẩm định KĐT (BM-10), 1 lượt thống nhất; bộ đếm riêng của vòng.
  await as(page, 'lan');
  await openMine(page, 27);
  await expect(gi).toContainText('Thẩm định KĐT BM-03');
  const t27 = await formText(page);
  for (const x of ['Tờ trình BM-03', 'Checklist 02 đủ', 'Vòng check 0/2']) expect(t27).toContain(x);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'thu');
  await openMine(page, 29);
  expect(await formText(page)).toContain('Phiếu nhận xét (BM-10)');
  expect(await primary(page)).toBe(true);
  await run('hoa', 29);
  // 55 TTMS thẩm định và hoàn chỉnh hồ sơ KĐT → cổng cấp duyệt KĐT = VHT → 56 Chỉ huy ĐVĐX ký tờ trình BM-03.
  await as(page, 'lan');
  await openMine(page, 55);
  expect(await formText(page)).toContain('Phê duyệt KĐT: VHT');
  expect(await primary(page)).toBe(true);
  await as(page, 'hai');
  await openMine(page, 56);
  expect(await formText(page, 'Ký tờ trình')).toContain('Khối chữ ký Tờ trình BM-03');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký tờ trình phê duyệt KĐT')).toBe(true);
  // 57: TTMS ký BM-14, trình dự thảo BM-18.
  await as(page, 'lan');
  await openMine(page, 57);
  const t57 = await formText(page, 'Ký báo cáo');
  expect(t57).toContain('Kết quả thẩm định KĐT');
  expect(await previewText(page, 'BM-14')).toContain('Phần thứ nhất — Tài liệu thẩm định và tổ chức thẩm định');
  expect(await previewText(page, 'BM-18')).toContain('Điều 1. Phê duyệt khoản đầu tư với các nội dung chính');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký báo cáo thẩm định BM-14')).toBe(true);
  // 60: TGĐ VHT ký ban hành BM-18.
  await as(page, 'tgd');
  await openMine(page, 60);
  await expect(m.locator('[data-preview]', { hasText: 'BM-18 Quyết định phê duyệt KĐT' })).toHaveCount(1);
  await expect(m.locator('[data-preview]', { hasText: 'BM-14 Báo cáo kết quả thẩm định KĐT' })).toHaveCount(1);
  expect(await formText(page, 'Ký ban hành')).toContain('Cơ quan chủ trì thẩm định — BM-14');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký ban hành Quyết định phê duyệt KĐT')).toBe(true);
  expect(await lastToast(page)).toContain('Đã phê duyệt khoản đầu tư');
  // Chi tiết KĐT: Đã phê duyệt, văn bản đầu ra, nút Lập KHLCNT (T16 B2, thay Tạo gói thầu mờ).
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0032$/);
  await expect(m).toContainText('Đã phê duyệt');
  await page.locator('[data-dtab="tai-lieu"]').click(); // 12/11: văn bản ở tab Tài liệu & văn bản
  await expect(m).toContainText('BM-18 Quyết định phê duyệt KĐT');
  await expect(m).toContainText('BM-14 Báo cáo kết quả thẩm định KĐT');
  await page.locator('[data-dtab="info"]').click();
  await expect(page.locator('.pg-head [data-go^="khlcnt/create/KDT/"]')).toHaveText('Lập KHLCNT');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Đã phê duyệt');
  expect(page.errors).toEqual([]);
});

test('Cảnh 9: nhánh gộp BM-00 (KĐT-2026-0031) — dự thảo, Chỉ huy cho ý kiến, chọn CQCM, xác nhận DS, ký phiếu yêu cầu, thẩm định 1 lượt, TTMS ký BM-14, TGĐ VHT ký hồ sơ gộp', async ({ page }) => {
  await fresh(page, '#/kdt');
  await scene(page, 'K9');
  const m = page.locator('main');
  const run = async (who, task, label) => { await as(page, who); await openMine(page, task); expect(await primary(page, label)).toBe(true); };
  const gi = page.locator('.tmain .ginfo').first();
  await expect(gi).toContainText('Mã KĐTKĐT-2026-0031');
  await expect(gi).toContainText('Nhánh hồ sơBM00');
  expect(await formText(page)).toContain('AI hỗ trợ lập dự thảo văn bản gộp');
  const bm00 = await previewText(page, 'BM-00');
  expect(bm00).toContain('A. CHỦ TRƯƠNG ĐẦU TƯ');
  expect(bm00).toContain('B. KHOẢN ĐẦU TƯ');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Hoàn thành dự thảo BM-00')).toBe(true);
  await openMine(page, 20);
  expect(await formText(page)).toContain('Người cho ý kiến');
  expect(await primary(page, 'Gửi xin ý kiến Chỉ huy')).toBe(true);
  await as(page, 'hai');
  await openMine(page, 21);
  expect(await formText(page)).toContain('Ý kiến của Chỉ huy đơn vị đề xuất');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'minh');
  await openMine(page, 22);
  const t22 = await formText(page);
  expect(t22).toContain('Ý kiến Chỉ huy ĐVĐX');
  expect(t22).toContain('Chọn CQCM phối hợp thẩm định hồ sơ gộp');
  expect(t22).not.toContain('Đơn vị chủ trì lựa chọn nhà thầu');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await run('lan', 23, 'Đồng ý danh sách CQCM');
  await as(page, 'hai');
  await openMine(page, 24);
  expect(await formText(page, 'Ký phiếu')).toContain('Phiếu yêu cầu thẩm định hồ sơ gộp');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký phiếu yêu cầu thẩm định')).toBe(true);
  await as(page, 'lan');
  await openMine(page, 27);
  expect(await formText(page)).toContain('Văn bản gộp BM-00');
  await expect(gi).toContainText('Thẩm định hồ sơ gộp BM-00');
  expect(await primary(page)).toBe(true);
  await run('thu', 29); await run('hoa', 29);
  await as(page, 'lan');
  await openMine(page, 61);
  expect(await formText(page, 'Ký báo cáo')).toContain('Kết quả thẩm định hồ sơ gộp');
  await expect(m.locator('[data-preview]', { hasText: 'BM-14' })).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký báo cáo thẩm định BM-14')).toBe(true);
  await as(page, 'tgd');
  await openMine(page, 62);
  expect(await formText(page, 'Ký phê duyệt hồ sơ gộp')).toContain('Khối chữ ký BM-00');
  await expect(m.locator('[data-preview]', { hasText: 'BM-00 Hồ sơ gộp chủ trương và KĐT' })).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký phê duyệt hồ sơ gộp')).toBe(true);
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0031$/);
  await page.locator('[data-dtab="tai-lieu"]').click(); // 12/11: văn bản ở tab Tài liệu & văn bản
  await expect(m).toContainText('BM-00 Hồ sơ chủ trương và KĐT (văn bản gộp'); // tên như Chi tiết hồ sơ: (văn bản gộp, đã phê duyệt)
  await page.locator('[data-dtab="info"]').click();
  await expect(m.locator('[data-kdt-profiles] tbody tr')).toHaveCount(1);
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0031' }).locator('.vbadge')).toHaveText('Đã phê duyệt');
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ cảnh 8: báo cáo BM-14 không được thông qua → AI tóm tắt, ĐVĐX hoàn chỉnh → lập lại BM-03 (v2)', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 5);
  expect(await primary(page, 'Báo cáo không được thông qua')).toBe(true);
  await as(page, 'minh');
  await openMine(page, 59);
  const t59 = await formText(page);
  expect(t59).toContain('AI tóm tắt phản hồi và gợi ý điều chỉnh');
  expect(t59).toContain('Nội dung thử');
  expect(await primary(page, 'Hoàn chỉnh hồ sơ')).toBe(true);
  await openMine(page, 50);
  expect(await formText(page)).toContain('Báo cáo thẩm định chưa được thông qua');
  await expect(page.locator('[data-preview]', { hasText: 'BM-03' })).toContainText('dự thảo v2');
  expect(page.errors).toEqual([]);
});

// T18 B3 — khối ký chung 75–78 (D-34): hộp thoại Trình ký = bước 75; hồ sơ Mật bắt buộc bản cứng (77 → 78, scan bắt buộc); lỗi gửi VOffice → Gửi lại (P-94).
const toks = (page) => page.evaluate(() => Flow.state.tokens.map((t) => `${t.task}:${t.who}`));
test('Khối ký chung: hồ sơ Mật ký bản cứng 47 → 77 → 78 (scan bắt buộc) → 48; lỗi gửi VOffice → Gửi lại; không Mật chọn Bản cứng ở bước 48', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 10);
  await openForm(page);
  await page.locator('.vmodal.ef #ok').click();
  // T54: hộp thoại Trình ký VOffice (SRS 32) — hồ sơ Mật chỉ Ký ngoài hệ thống, Ký tay.
  const dlg = page.locator('.overlay', { hasText: 'Trình ký VOffice — BM-01' });
  await expect(dlg.locator('.vradio-opt.dis').first()).toHaveText('VOffice');
  await expect(dlg.locator('.vradio-opt.on[data-mode="hard"]')).toHaveText('Ký ngoài hệ thống');
  await expect(dlg).toContainText('Đối tượng Mật');
  await dlg.locator('#go').click();
  expect(await lastToast(page)).toContain('ký ngoài hệ thống');  // T54: "Bản cứng" → Ký ngoài hệ thống (SRS 32 Q9 A)
  expect(await toks(page)).toEqual(['77:lan']);
  await openMine(page, 77);
  await expect(page.locator('.tmain .ginfo').first()).toContainText('ký BM-01 — bước 47');
  expect(await formText(page)).toContain('Hình thức ký: Ký ngoài hệ thống — hồ sơ Mật');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['78:minh']);
  await as(page, 'minh');
  await openMine(page, 78);
  expect(await primary(page)).toBe(true);
  expect(await lastToast(page)).toContain('Bản scan BM-01 đã ký');
  expect(await toks(page)).toEqual(['78:minh']);
  await closeForm(page);
  await uploadReq(page, 'kyScan_');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['48:tgd']);
  // Quy trình của hồ sơ: 77, 78 đã xong; hồ sơ Mật không qua 75–76. Chi tiết hồ sơ ghi Mật: Có.
  expect(await page.evaluate(() => [75, 76, 77, 78].map(Flow.taskStatus))).toEqual(['na', 'na', 'done', 'done']);
  await page.evaluate(() => { location.hash = '#/ho-so-kdt/' + encodeURIComponent(Flow.state.code); });
  await expect(page.locator('main')).toContainText('MậtCó');

  // Lỗi gửi VOffice (P-94): việc Gửi lại cho người trình, gửi lại thành công → bước 48.
  await branch(page, 11);
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['76:lan']);
  await openMine(page, 76);
  expect(await formText(page)).toContain('Gửi VOffice không thành công');
  expect(await primary(page, 'Gửi lại VOffice')).toBe(true);
  expect(await toks(page)).toEqual(['48:tgd']);
  // Không Mật: TGĐ chọn Bản cứng ở hộp thoại → 77 cho TGĐ.
  await as(page, 'tgd');
  await openMine(page, 48);
  await openForm(page);
  await page.locator('.vmodal.ef #ok').click();
  const d48 = page.locator('.overlay', { hasText: 'Trình ký VOffice — BM-01' });
  await expect(d48.locator('[data-mode="soft"]')).toHaveClass(/on/);
  await d48.locator('[data-mode="hard"]').click();
  await expect(d48).toContainText('bước 77');
  // SRS 32 BR-TKV-01-13: không Mật thì Lý do ký ngoài hệ thống bắt buộc.
  await d48.locator('#hr').fill('Lãnh đạo yêu cầu ký bản giấy');
  await d48.locator('#go').click();
  expect(await toks(page)).toEqual(['77:tgd']);
  expect(page.errors).toEqual([]);
});

// T18 B4 — tuyến Tập đoàn 63–74 (người dùng mở D-8, 12/10). Người Tập đoàn = tài khoản giả lập "td" (P-96).
test('Tuyến Tập đoàn: công văn 64 → TGĐ VHT ký 65 → các Ban nhận xét 67 → tiếp thu 68 → ký trình lại 69 → Ban ĐTXD chưa đạt → 68; TGĐ Tập đoàn ký chủ trương → kết thúc hồ sơ chủ trương', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 9);
  const f64 = await formText(page);
  expect(f64).toContain('Hồ sơ trình Tập đoàn: Hồ sơ chủ trương KĐT');
  expect(f64).toContain('Bộ hồ sơ gửi Tập đoàn');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await previewText(page, 'CV-TD')).toContain('Kính gửi: Tổng Giám đốc Tập đoàn');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['65:tgd']);
  await as(page, 'tgd');
  await openMine(page, 65);
  await openForm(page);
  await page.locator('.vmodal.ef #ok').click();
  const dlg = page.locator('.overlay', { hasText: 'Trình ký VOffice — Công văn trình Tập đoàn' });
  await expect(dlg.locator('[data-mode="soft"]')).toHaveClass(/on/);
  await signGo(dlg);
  expect(await toks(page)).toEqual(['67:td']);
  // Các Ban Tập đoàn (tài khoản giả lập) gửi phiếu nhận xét BM-09 (chủ trương).
  await as(page, 'td');
  await openMine(page, 67);
  expect(await formText(page)).toContain('Phiếu nhận xét BM-09 của các Ban chuyên môn Tập đoàn');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['68:minh']);
  await as(page, 'minh');
  await openMine(page, 68);
  expect(await formText(page)).toContain('Báo cáo giải trình, tiếp thu ý kiến Tập đoàn');
  expect(await previewText(page, 'BM-06')).toContain('Ban Tài chính — Tổng mức vốn');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['69:tgd']);
  await as(page, 'tgd');
  await openMine(page, 69);
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['70:td']);
  // Ban ĐTXD kiểm tra chưa đạt → trả trực tiếp ĐVĐX, banner ghi lý do.
  await as(page, 'td');
  await openMine(page, 70);
  expect(await primary(page, 'Chưa đạt')).toBe(true);
  expect(await toks(page)).toEqual(['68:minh']);
  await as(page, 'minh');
  await openMine(page, 68);
  const f68 = await openForm(page);
  await expect(f68.locator('.banner-moved, .banner-bad').first()).toContainText('Ban ĐTXD Tập đoàn yêu cầu bổ sung: “Nội dung thử”');
  await closeForm(page);
  // TGĐ Tập đoàn ký chủ trương BM-01 → 74 lưu kết quả → G36 chủ trương → kết thúc hồ sơ chủ trương (T45, D-103): KĐT Đã phê duyệt chủ trương.
  await branch(page, 14);
  expect(await formText(page)).toContain('Ký trực tiếp Tờ trình BM-01');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual([]);
  expect(await page.evaluate(() => [Flow.state.status, Flow.kdtCases().find((c) => c.code === Flow.state.code).stage, Flow.kdtCtChoices('KĐT-2026-0032').map((c) => c.code)]))
    .toEqual(['approved', 'CT_OK', [await page.evaluate(() => Flow.state.code)]]);
  await page.evaluate(() => { location.hash = '#/ho-so-kdt/' + encodeURIComponent(Flow.state.code); });
  const main = page.locator('main');
  await expect(main).toContainText('CV-TD Công văn trình Tập đoàn (đã ký)');
  await expect(main).toContainText('BM-01 Tờ trình chủ trương KĐT (đã phê duyệt) — cấp Tập đoàn');
  expect(await page.evaluate(() => EVars.doc('BM-01').html)).toContain('Tổng Giám đốc Tập đoàn · Đã ký');
  expect(page.errors).toEqual([]);
});

test('Tuyến Tập đoàn: hồ sơ gộp KĐT-2026-0031 — Ban ĐTXD lập BM-14 + dự thảo BM-18 (72), TGĐ Tập đoàn ký (73) → hoàn tất phê duyệt cấp Tập đoàn', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 15);
  expect(await page.evaluate(() => Flow.state.persona)).toBe('td');
  expect(await formText(page)).toContain('Cơ quan chủ trì thẩm định: Ban Đầu tư – Xây dựng Tập đoàn');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual(['73:td']);
  await openMine(page, 73);
  expect(await formText(page)).toContain('Ký ban hành Quyết định BM-18');
  expect(await primary(page)).toBe(true);
  expect(await toks(page)).toEqual([]);
  expect(await page.evaluate(() => Flow.state.status)).toBe('approved');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0031' }).locator('.vbadge').first()).toHaveText('Đã phê duyệt');
  await page.evaluate(() => { location.hash = '#/ho-so-kdt/' + encodeURIComponent(Flow.state.code); });
  await expect(page.locator('main')).toContainText('BM-18 Quyết định phê duyệt KĐT — cấp Tập đoàn');
  expect(await page.evaluate(() => EVars.doc('BM-18').html)).toContain('QĐ-VTG · Tổng Giám đốc Tập đoàn');
  expect(page.errors).toEqual([]);
});
