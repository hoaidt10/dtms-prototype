// T11 B2 — PH09 Khoản đầu tư, cảnh 1–3 (plan docs/dtms/prototype-KDT-chuan-bi.md §2.4, §8): hồ sơ KĐT chạy luồng MS13-TO BE —
// task 1–10 (body MS01 với nhãn KĐT), SCR-57 Ban Tài chính ‖ SCR-58 TTMS, cổng phân luồng / báo giá / gộp; nhánh chuyển MS14 (SCR-66).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, state, openForm, aiDecide, closeForm } from './helpers.mjs';

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
};
const as = (page, who) => page.evaluate((id) => Flow.setPersona(id), who);
// Mở việc đầu tiên của vai đang đăng nhập.
async function openMine(page, task) {
  const s = await state(page);
  const tok = s.mine.find((t) => task == null || String(t.task) === String(task));
  expect(tok, `vai hiện tại phải có việc ${task ?? ''}`).toBeTruthy();
  await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tok.id);
  await expect(page.locator('.pg-title')).toContainText('Xem chi tiết hồ sơ');
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
  await pick(page, 'k-field', 'Viễn thông - CNTT');
  await pick(page, 'k-type', 'Khoa học công nghệ');
  await pick(page, 'k-nature', 'Cần tích hợp');
  await page.locator('#k-est').fill('120');
  await page.locator('#k-save').click();
  await expect(page).toHaveURL(/#\/kdt$/);
  // Chỉnh sửa › Tạo hồ sơ › Lưu = start quy trình, mở ngay bước 01.
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0032') + '/edit'; });
  await page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]').click();
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  const gi = page.locator('.tmain .ginfo').first();
  await expect(gi).toContainText('Mã KĐTKĐT-2026-0032');
  await expect(gi).toContainText('Loại hồ sơPhê duyệt KĐT');
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
  const r57 = page.locator('.vtable tbody tr', { hasText: 'Xác nhận hình thành TSCĐ' }).filter({ hasText: 'Chưa xử lý' });
  await expect(r57).toContainText('KĐT-2026-0032');
  await expect(r57).toContainText('Phê duyệt KĐT');
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
  await expect(m).toContainText('MS13 · KĐT đơn giản');
  await expect(m).toContainText('Viễn thông - CNTT: dưới 160 tỷ đồng');
  await expect(m).toContainText('Hai giai đoạn (BM-01 → BM-03)');
  await expect(m.locator('.ef-text', { hasText: 'Xác nhận hình thành TSCĐ' })).toContainText('OK');
  await expect(m.locator('.vbadge', { hasText: /^Không đạt$/ })).toHaveCount(2);
  expect(await mainText(page)).not.toMatch(BA);
  // Bỏ chọn "Đúng" ở Tính chất tài sản → BE từ chối "Xác nhận OK".
  await m.locator('[data-ef-chk="yeuTo::3::dung"]').uncheck();
  await m.locator('#ok').click();
  expect(await lastToast(page)).toContain('Có yếu tố chưa đúng');
  await m.locator('[data-ef-chk="yeuTo::3::dung"]').check();
  await m.locator('#ok').click();
  expect(await page.evaluate(() => [Flow.state.vars.group, Flow.state.vars.branch, Flow.state.tokens.map((t) => t.task)])).toEqual(['MS13', '2GD', [14]]);

  // Minh: bước 14 dự thảo (B3); Thông tin chung có nhóm và nhánh.
  await as(page, 'minh');
  await openMine(page, 14);
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Hoàn thành dự thảo');
  await expect(gi).toContainText('MS13 · KĐT đơn giản');
  await expect(gi).toContainText('Hai giai đoạn (BM-01 → BM-03)');
  await expect(gi).toContainText('Tổng mức vốn thực tế (gồm VAT)118,50 tỷ đồng');
  // Danh sách KĐT: trạng thái suy từ hồ sơ.
  await page.evaluate(() => { location.hash = '#/kdt'; });
  const row = page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' });
  await expect(row.locator('.vbadge')).toHaveText('Đang lập chủ trương');
  await expect(row).toContainText('MS13');
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ SCR-66: KĐT-2026-0033 (lĩnh vực Khác, 96 tỷ) vượt ngưỡng MS13 → chuyển luồng MS14, hồ sơ mới của cùng KĐT', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 0);
  expect(await page.evaluate(() => [Flow.state.persona, Flow.state.tokens.map((t) => t.task)])).toEqual(['lan', [12]]);
  const f = await openForm(page, 'Xác nhận OK');
  await expect(f.locator('.banner-bad')).toContainText('96,00 tỷ đồng không thuộc ngưỡng MS13 (Lĩnh vực khác: dưới 90 tỷ đồng)');
  await expect(f).toContainText('MS14 · KĐT thông thường');
  await f.locator('#ok').click();
  const m = page.locator('main');
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0033\/chuyen-luong$/);
  expect(await lastToast(page)).toContain('chuyển luồng MS14');
  await expect(page.locator('.pg-title')).toContainText('Thông báo chuyển luồng');
  await expect(m).toContainText('HS-2026-0033');
  await expect(m).toContainText('Đã chuyển luồng');
  await expect(m.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(m.locator('.vtable tbody tr')).toContainText('HS-2026-0127');
  await expect(m.locator('.vtable tbody tr')).toContainText('MS14 · KĐT thông thường');
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
  const r = page.locator('.vtable tbody tr', { hasText: 'HS-2026-0127' });
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

// T11 B3 — cảnh 4–6: dự thảo, BM-01 + Checklist 01, chọn CQCM / đơn vị chủ trì, trình (kiểm tra trước khi gửi Không đạt rồi đạt);
// quy trình con 41: TTMS thẩm định ‖ CQCM gửi ý kiến, 02 vòng check → họp lần 1 → Chuyên quản, Chỉ huy xác nhận → cập nhật; ký 42 / 44.
test('Cảnh 4–6: chủ trương BM-01, thẩm định trong quy trình con 41 (vòng check 2/2, họp 1/2), ký thẩm định và ký duyệt chủ trương', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="K4"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  const m = page.locator('main');
  const run = async (who, task, label) => { await as(page, who); await openMine(page, task); expect(await primary(page, label)).toBe(true); };
  expect(await formText(page)).toContain('Biện pháp, kế hoạch thực hiện');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Hoàn thành dự thảo')).toBe(true);
  await openMine(page, 16);
  const t16 = await formText(page);
  expect(t16).toContain('AI hỗ trợ soạn nội dung đề xuất');
  expect(t16).toContain('Hai giai đoạn (BM-01 → BM-03)');
  expect(await primary(page)).toBe(true);
  // 36: tờ trình BM-01 theo mẫu KĐT, mục Sự cần thiết còn trống (bản xem trước ở Văn bản đầu ra).
  await openMine(page, 36);
  const t36 = await formText(page);
  expect(t36).toContain('Tờ trình chủ trương KĐT (BM-01)');
  expect(t36).toContain('4.2. Sự cần thiết');
  expect(await previewText(page, 'BM-01')).toContain('Chưa có nội dung.');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await openMine(page, 37);
  const f37 = await openForm(page);
  await expect(f37).toContainText('Checklist số 01');
  await expect(f37.locator('input[value="Không áp dụng — căn cứ là đề tài KHCN"]')).toHaveCount(1);
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await openMine(page, 38);
  const t38 = await formText(page);
  expect(t38).toContain('Chọn CQCM phối hợp thẩm định chủ trương');
  expect(t38).toContain('Đơn vị chủ trì');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  // 39 → 40 (DX-01): kiểm tra trước khi gửi Không đạt (thiếu Sự cần thiết) → ở lại bước 39; chọn gợi ý AI rồi trình.
  await openMine(page, 39);
  await (await openForm(page)).locator('#ok').click();
  expect(await lastToast(page)).toContain('Không đạt');
  expect((await state(page)).mine.map((t) => t.task)).toEqual([39]);
  const f39 = await openForm(page);
  await expect(f39.locator('.banner-bad')).toContainText('Không đạt');
  await aiDecide(f39, 'Sự cần thiết');
  await f39.locator('#ok').click();
  expect(await page.evaluate(() => [Flow.state.vars.sub, Flow.state.tokens.map((t) => `${t.task}:${t.who}`)])).toEqual([41, ['24:lan']]);

  // Quy trình con 41 — lượt 1: Ban Tài chính cần sửa → ĐVĐX bổ sung.
  await as(page, 'lan');
  await openMine(page, 24);
  await expect(page.locator('.tmain .ginfo').first()).toContainText('Thẩm định nội dung hồ sơ (bước 41 · Thẩm định và hoàn chỉnh hồ sơ)');
  const t24 = await formText(page);
  expect(t24).toContain('Rà soát tính hợp lệ & danh sách CQCM');
  expect(t24).toContain('Vòng check 0/2');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'thu');
  await openMine(page, 26);
  const f26 = await openForm(page);
  await expect(f26).toContainText('Phiếu nhận xét (BM-09)');
  await expect(f26).toContainText('Ban Tài chính');
  await expect(f26.locator('textarea', { hasText: 'Chưa tách chi phí TSCĐ / CCDC' })).toHaveCount(1);
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await run('hoa', 26);
  await as(page, 'minh');
  await openMine(page, 28);
  expect(await formText(page)).toContain('Bảng tiếp thu, giải trình ý kiến');
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Bổ sung hồ sơ theo ý kiến');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  // Lượt 2: vẫn cần sửa → giải trình → họp.
  await run('lan', 24); await run('thu', 26); await run('hoa', 26);
  await as(page, 'minh');
  await openMine(page, 28);
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Giải trình, bảo lưu ý kiến');
  expect(await primary(page)).toBe(true);
  await as(page, 'lan');
  await openMine(page, 29);
  const f29 = await openForm(page);
  await expect(f29).toContainText('tổ chức họp lần 1/2');
  await expect(f29).toContainText('Vòng check 2/2');
  await f29.locator('#ok').click();
  expect(await lastToast(page)).toContain('Biên bản họp');
  await closeForm(page);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('[data-req-up="kMinutes"]').click();
  expect(await primary(page, 'Đã thống nhất sau họp')).toBe(true);
  await as(page, 'minh');
  await openMine(page, 31);
  const t31 = await formText(page);
  expect(t31).toContain('Nội dung điều chỉnh đã thống nhất sau họp');
  expect(t31).toContain('Họp 1/2');
  expect(await primary(page)).toBe(true);
  await as(page, 'hai');
  await openMine(page, 32);
  const f32 = await openForm(page);
  await expect(f32.locator('.vbadge', { hasText: /^Đã xác nhận$/ })).toHaveCount(1);
  await closeForm(page);
  expect(await primary(page)).toBe(true);
  await run('minh', 33);
  // Lượt 3 thống nhất → ra khỏi quy trình con → ký.
  await run('lan', 24); await run('thu', 26); await run('hoa', 26);
  await as(page, 'lan');
  await openMine(page, 42);
  expect(await formText(page, 'Ký thẩm định')).toContain('Khối chữ ký BM-01');
  await expect(m.locator('[data-preview]', { hasText: 'BM-01 Tờ trình chủ trương KĐT' })).toHaveCount(1);
  await expect(m).toContainText('Bien-ban-hop-');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký thẩm định trên tờ trình')).toBe(true);
  await as(page, 'tgd');
  await openMine(page, 44);
  expect(await formText(page, 'Ký duyệt chủ trương')).toContain('VHT — không cần ý kiến Tập đoàn');
  expect(await primary(page, 'Ký duyệt chủ trương')).toBe(true);
  // Bước 45 sang giai đoạn KĐT: bộ đếm riêng (P-54); bộ đếm chủ trương giữ 2/2 vòng check, 1/2 lần họp.
  expect(await page.evaluate(() => [Flow.state.tokens.map((t) => `${t.task}:${t.who}`), Flow.state.vars.chk.CT, Flow.state.vars.meet.CT, Flow.tdCount('chk')])).toEqual([['46:minh'], 2, 1, 0]);
  // Văn bản đầu ra BM-01; trạng thái KĐT.
  await as(page, 'minh');
  await openMine(page, 46);
  await expect(m).toContainText('BM-01 Tờ trình chủ trương KĐT (đã phê duyệt)');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Đang lập hồ sơ KĐT');
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ cảnh 5–6: TTMS trả lại danh sách CQCM → bước 38; Thủ trưởng không ký — chỉ đạo dừng → KĐT dừng theo chỉ đạo', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 2);
  expect(await primary(page, 'Danh sách CQCM chưa đạt')).toBe(true);
  await as(page, 'minh');
  await openMine(page, 38);
  expect(await formText(page)).toContain('TTMS trả lại danh sách CQCM');
  await branch(page, 4);
  expect(await page.evaluate(() => Flow.state.persona)).toBe('tgd');
  expect(await primary(page, 'Không ký — chỉ đạo dừng')).toBe(true);
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0032$/);
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Dừng theo chỉ đạo');
  expect(page.errors).toEqual([]);
});

// T11 B4 — cảnh 7–9: hồ sơ KĐT BM-03 + Checklist 02, thẩm định KĐT (quy trình con 49), BM-14, ký BM-18; nhánh gộp BM-00 trên KĐT-2026-0031.
async function scene(page, n) {
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS13"]').click();
  await page.locator('#demo').click();
  await page.locator(`.demo-panel [data-scene="${n}"]`).click();
  await expect(page).toHaveURL(/#\/task\//);
}
test('Cảnh 7–8: BM-03 + Checklist 02 kế thừa chủ trương, thẩm định KĐT (quy trình con 49), BM-14 thông qua, Thủ trưởng ký BM-18 → Đã phê duyệt', async ({ page }) => {
  await fresh(page, '#/kdt');
  await scene(page, 'K7');
  const m = page.locator('main');
  const run = async (who, task, label) => { await as(page, who); await openMine(page, task); expect(await primary(page, label)).toBe(true); };
  const t46 = await formText(page);
  expect(t46).toContain('AI gợi ý từ chủ trương đã phê duyệt');
  expect(t46).toContain('Tờ trình thẩm định, phê duyệt KĐT (BM-03) và các Phụ lục');
  const bm03 = await previewText(page, 'BM-03');
  expect(bm03).toContain('I. THÔNG TIN CHUNG VỀ KHOẢN ĐẦU TƯ');
  expect(bm03).toContain('1387/TTr-TTVT');
  expect(await previewText(page, 'PL-TM')).toContain('Chi phí hiệu chuẩn định kỳ năm thứ hai (chi phí hoạt động): 2,40 tỷ đồng');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Hoàn thành hồ sơ phê duyệt KĐT')).toBe(true);
  await openMine(page, 47);
  const t47 = await formText(page);
  expect(t47).toContain('Checklist số 02 — Kiểm tra hồ sơ trình thẩm định, phê duyệt KĐT đơn giản');
  expect(t47).toContain('1387/TTr-TTVT (BM-01 đã phê duyệt)');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await openMine(page, 48);
  const t48 = await formText(page);
  expect(t48).toContain('Chọn CQCM phối hợp thẩm định KĐT');
  expect(t48).toContain('Đầu mối nhận hồ sơ');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Trình hồ sơ thẩm định KĐT')).toBe(true);
  expect(await page.evaluate(() => [Flow.state.vars.sub, Flow.state.tokens.map((t) => `${t.task}:${t.who}`)])).toEqual([49, ['24:lan']]);
  // Quy trình con 49 — TTMS thẩm định ‖ CQCM gửi văn bản thẩm định KĐT (BM-10), 1 lượt thống nhất.
  await as(page, 'lan');
  await openMine(page, 24);
  await expect(page.locator('.tmain .ginfo').first()).toContainText('(bước 49 · Tổ chức thẩm định KĐT)');
  const t24k = await formText(page);
  for (const x of ['Tờ trình BM-03', 'Checklist 02 đủ', 'Vòng check 0/2']) expect(t24k).toContain(x);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'thu');
  await openMine(page, 26);
  expect(await formText(page)).toContain('Phiếu nhận xét (BM-10)');
  expect(await primary(page)).toBe(true);
  await run('hoa', 26);
  // 51: BM-14 + dự thảo BM-18.
  await as(page, 'lan');
  await openMine(page, 51);
  const t51 = await formText(page, 'Trình báo cáo');
  expect(t51).toContain('Kết quả thẩm định KĐT');
  expect(t51).toContain('VHT — không cần ý kiến Tập đoàn');
  expect(await previewText(page, 'BM-14')).toContain('Phần thứ nhất — Tài liệu thẩm định và tổ chức thẩm định');
  expect(await previewText(page, 'BM-18')).toContain('Điều 1. Phê duyệt khoản đầu tư với các nội dung chính');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Trình báo cáo, dự thảo Quyết định')).toBe(true);
  // 54: Thủ trưởng ký BM-18 qua VOffice (hộp thoại trình ký).
  await as(page, 'tgd');
  await openMine(page, 54);
  await expect(m.locator('[data-preview]', { hasText: 'BM-18 Quyết định phê duyệt KĐT' })).toHaveCount(1);
  await expect(m.locator('[data-preview]', { hasText: 'BM-14 Báo cáo kết quả thẩm định KĐT' })).toHaveCount(1);
  expect(await formText(page, 'Ký Quyết định')).toContain('Cơ quan chủ trì thẩm định — BM-14');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Ký Quyết định phê duyệt KĐT')).toBe(true);
  expect(await lastToast(page)).toContain('Đã phê duyệt khoản đầu tư');
  // Chi tiết KĐT: Đã phê duyệt, văn bản đầu ra, nút Lập KHLCNT (T16 B2, thay Tạo gói thầu mờ).
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0032$/);
  await expect(m).toContainText('Đã phê duyệt');
  await expect(m).toContainText('BM-18 Quyết định phê duyệt KĐT');
  await expect(m).toContainText('BM-14 Báo cáo kết quả thẩm định KĐT');
  await expect(page.locator('.pg-head [data-go^="khlcnt/create/KDT/"]')).toHaveText('Lập KHLCNT');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0032' }).locator('.vbadge')).toHaveText('Đã phê duyệt');
  expect(page.errors).toEqual([]);
});

test('Cảnh 9: nhánh gộp BM-00 (KĐT-2026-0031) — dự thảo, Chỉ huy cho ý kiến, chọn CQCM, thẩm định 1 lượt, trình ký, Thủ trưởng ký hồ sơ gộp', async ({ page }) => {
  await fresh(page, '#/kdt');
  await scene(page, 'K9');
  const m = page.locator('main');
  const run = async (who, task, label) => { await as(page, who); await openMine(page, task); expect(await primary(page, label)).toBe(true); };
  const gi = page.locator('.tmain .ginfo').first();
  await expect(gi).toContainText('Mã KĐTKĐT-2026-0031');
  await expect(gi).toContainText('Nhánh hồ sơGộp BM-00');
  expect(await formText(page)).toContain('AI hỗ trợ lập dự thảo văn bản gộp');
  const bm00 = await previewText(page, 'BM-00');
  expect(bm00).toContain('A. CHỦ TRƯƠNG ĐẦU TƯ');
  expect(bm00).toContain('B. KHOẢN ĐẦU TƯ');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Hoàn thành dự thảo BM-00')).toBe(true);
  await openMine(page, 19);
  expect(await formText(page)).toContain('Người cho ý kiến');
  expect(await primary(page, 'Gửi xin ý kiến Chỉ huy')).toBe(true);
  await as(page, 'hai');
  await openMine(page, 20);
  expect(await formText(page)).toContain('Ý kiến của Chỉ huy đơn vị đề xuất');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'minh');
  await openMine(page, 21);
  const t21 = await formText(page);
  expect(t21).toContain('Ý kiến Chỉ huy ĐVĐX');
  expect(t21).toContain('Chọn CQCM phối hợp thẩm định hồ sơ gộp');
  expect(t21).not.toContain('Đơn vị chủ trì lựa chọn nhà thầu');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page)).toBe(true);
  await as(page, 'lan');
  await openMine(page, 24);
  expect(await formText(page)).toContain('Văn bản gộp BM-00');
  await expect(page.locator('.tmain .ginfo').first()).not.toContainText('(bước 41');
  expect(await primary(page)).toBe(true);
  await run('thu', 26); await run('hoa', 26);
  await as(page, 'minh');
  await openMine(page, 55);
  expect(await formText(page)).toContain('Khối chữ ký BM-00');
  await expect(m.locator('[data-preview]', { hasText: 'BM-00 Hồ sơ gộp chủ trương và KĐT' })).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  expect(await primary(page, 'Trình ký VOffice')).toBe(true);
  await as(page, 'tgd');
  await openMine(page, 56);
  expect(await primary(page, 'Ký duyệt hồ sơ gộp')).toBe(true);
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0031$/);
  await expect(m).toContainText('BM-00 Hồ sơ chủ trương và KĐT (văn bản gộp)');
  await expect(m.locator('[data-kdt-profiles] tbody tr')).toHaveCount(1);
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0031' }).locator('.vbadge')).toHaveText('Đã phê duyệt');
  expect(page.errors).toEqual([]);
});

test('Nhánh phụ cảnh 8: báo cáo BM-14 chưa được thông qua → AI tóm tắt, ĐVĐX hoàn chỉnh → lập lại BM-03 (v2)', async ({ page }) => {
  await fresh(page, '#/kdt');
  await branch(page, 5);
  expect(await primary(page, 'Báo cáo chưa được thông qua')).toBe(true);
  await as(page, 'minh');
  await openMine(page, 53);
  const t53 = await formText(page);
  expect(t53).toContain('AI tóm tắt phản hồi và gợi ý điều chỉnh');
  expect(t53).toContain('Nội dung thử');
  expect(await primary(page, 'Hoàn chỉnh hồ sơ')).toBe(true);
  await openMine(page, 46);
  expect(await formText(page)).toContain('Báo cáo thẩm định chưa được thông qua');
  await expect(page.locator('[data-preview]', { hasText: 'BM-03' })).toContainText('dự thảo v2');
  expect(page.errors).toEqual([]);
});
