// T45 — KĐT hai hồ sơ (D-103) và nhiều đề tài / dự án (D-104), plan docs/dtms/prototype-T45-kdt-2-ho-so.md §4:
// hồ sơ phê duyệt chủ trương KĐT (kind CT, bước 1–48) + hồ sơ phê duyệt KĐT (kind KDT, chọn 1 hồ sơ chủ trương, chạy từ 49);
// hai menu Hồ sơ chủ trương KĐT / Hồ sơ phê duyệt KĐT; cảnh báo lệch luồng 3 chỗ, MS15 chặn Lưu; gộp BM-00 không có hồ sơ KĐT.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|WBS|D-\d+\b|P-\d|TO BE|BBLV|❓/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const go = async (page, h) => {
  await page.evaluate((x) => { location.hash = x; }, h);
  await expect(page.locator('main')).toBeVisible();
};
const enc = encodeURIComponent;
const K = 'KĐT-2026-0032';
const rowCodes = (page) => page.locator('main .vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code).filter(Boolean));
const heads = (page) => page.locator('main .vtable thead th').allInnerTexts();
// Hồ sơ chủ trương của KĐT kịch bản chính tua tới kết thúc (TGĐ VHT ký chủ trương ở bước 48), chưa tạo hồ sơ KĐT.
const ctEnd = (page) => page.evaluate((k) => Flow.jumpTo('CT_END', 'minh', null, 'MS13', k), K);
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
const pickT = async (page, id, text) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: text }).first().click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
const errOf = (page, id) => page.locator('.vfield', { has: page.locator(`[data-vsel="${id}"], #${id}`) }).locator('.msg');

test('Menu tách hai mục: Danh sách hồ sơ chủ trương KĐT / phê duyệt KĐT theo loại hồ sơ; #/ho-so-kdt chuyển hướng; hồ sơ lệch luồng có tag', async ({ page }) => {
  await fresh(page, '#/ho-so-kdt');
  await expect(page).toHaveURL(/#\/ho-so-ct-kdt$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách hồ sơ chủ trương KĐT');
  await expect(page.locator('.sb-nav [data-go="ho-so-ct-kdt"]')).toHaveClass(/active/);
  await expect(page.locator('.sb-nav [data-go="ho-so-pd-kdt"]')).toHaveCount(1);
  const h1 = await heads(page);
  expect(h1).toContain('Phạm vi');
  expect(h1).not.toContain('Hồ sơ chủ trương');
  // Mọi hồ sơ chủ trương (13 hồ sơ mẫu), không có hồ sơ <mã>-2.
  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const ct = await rowCodes(page);
  expect(ct.length).toBe(await page.evaluate(() => Flow.kdtCases().filter((c) => c.kind !== 'KDT').length));
  expect(ct).toEqual(expect.arrayContaining(['HS-2026-0012', 'HS-2026-0015', 'HS-2026-0031']));
  expect(ct.some((c) => /-2$/.test(c))).toBe(false);
  await expect(page.locator('tr[data-code="HS-2026-0031"]')).toContainText('Chủ trương và KĐT');
  await expect(page.locator('tr[data-code="HS-2026-0028"]')).toContainText('Phê duyệt chủ trương KĐT');
  expect(await mainText(page)).not.toMatch(BA);

  await go(page, '#/ho-so-pd-kdt');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách hồ sơ phê duyệt KĐT');
  await expect(page.locator('.sb-nav [data-go="ho-so-pd-kdt"]')).toHaveClass(/active/);
  expect(await heads(page)).toEqual(expect.arrayContaining(['Hồ sơ chủ trương', 'Luồng khác chủ trương', 'Tổng mức vốn KĐT (tỷ đồng)']));
  expect(await rowCodes(page)).toEqual(['HS-2026-0028-2', 'HS-2026-0027-2', 'HS-2026-0026-2', 'HS-2026-0012-2']);
  const lech = page.locator('tr[data-code="HS-2026-0026-2"]');
  await expect(lech).toContainText('HS-2026-0026');
  await expect(lech).toContainText('MS13 → MS14');
  await expect(page.locator('tr[data-code="HS-2026-0028-2"]')).toContainText('Phê duyệt KĐT');
  expect(await mainText(page)).not.toMatch(BA);

  // Chi tiết hồ sơ KĐT lệch luồng (mẫu HS-2026-0026-2): tag, luồng chủ trương / KĐT, giải trình; menu sáng theo loại hồ sơ.
  await lech.locator('a.link').first().click();
  await expect(page).toHaveURL(/#\/ho-so-kdt\/HS-2026-0026-2$/);
  await expect(page.locator('[data-lech-tag]')).toHaveText('Luồng khác chủ trương');
  const gi = page.locator('.ginfo');
  await expect(gi).toContainText('Loại hồ sơPhê duyệt KĐT');
  await expect(gi).toContainText('Hồ sơ chủ trươngHS-2026-0026');
  await expect(gi).toContainText('Luồng chủ trươngMS13 · KĐT đơn giản');
  await expect(gi).toContainText('Luồng KĐTMS14 · KĐT thông thường');
  await expect(gi).toContainText('Giải trình luồng khác chủ trương');
  await expect(gi).toContainText('Tổng mức vốn KĐT (gồm VAT)172,00 tỷ đồng');
  await expect(page.locator('.sb-nav [data-go="ho-so-pd-kdt"]')).toHaveClass(/active/);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('.pg-head .back').click();
  await expect(page).toHaveURL(/#\/ho-so-pd-kdt$/);
  // Hồ sơ chủ trương mở từ danh sách chủ trương: không có tag, menu chủ trương sáng.
  await go(page, '#/ho-so-kdt/HS-2026-0026');
  await expect(gi).toContainText('Loại hồ sơPhê duyệt chủ trương KĐT');
  await expect(page.locator('[data-lech-tag]')).toHaveCount(0);
  await expect(page.locator('.sb-nav [data-go="ho-so-ct-kdt"]')).toHaveClass(/active/);
  expect(page.errors).toEqual([]);
});

test('Hồ sơ chủ trương 0032 tới bước 48 → KĐT Đã phê duyệt chủ trương; tạo hồ sơ KĐT chọn hồ sơ chủ trương → chạy từ 49 (kế thừa) → 60 → Đã phê duyệt', async ({ page }) => {
  await fresh(page, '#/kdt');
  await ctEnd(page);
  await go(page, '#/kdt');
  await expect(page.locator('.vtable tbody tr', { hasText: K }).locator('.vbadge')).toHaveText('Đã phê duyệt chủ trương');
  await go(page, '#/kdt/' + enc(K));
  await expect(page.locator('[data-kdt-profiles] tbody tr')).toHaveCount(1);
  await expect(page.locator('[data-kdt-profiles] tbody')).toContainText('Phê duyệt chủ trương KĐT');
  await expect(page.locator('[data-kdt-profiles] tbody')).toContainText('Kết thúc — đã phê duyệt chủ trương');

  // Thêm mới hồ sơ: Loại hồ sơ mặc định Phê duyệt KĐT, hồ sơ chủ trương chọn sẵn, Tổng mức vốn KĐT theo chủ trương, Luồng chỉ đọc.
  await go(page, '#/kdt/' + enc(K) + '/edit');
  await page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hồ sơ phê duyệt KĐT');
  await expect(page.locator('[data-vsel="kc-kind"]')).toContainText('Phê duyệt KĐT');
  await expect(page.locator('[data-vsel="kc-parent"]')).toContainText('HS-2026-0032 — MS13');
  await expect(page.locator('#kc-est')).toHaveValue('118,5');
  await expect(page.locator('#kc-luong')).toBeDisabled();
  await expect(page.locator('#kc-luong')).toHaveValue('MS13 · KĐT đơn giản');
  await expect(page.locator('[data-kc-lech]')).toHaveCount(0);
  expect(await mainText(page)).not.toMatch(BA);
  // Chủ trương đã duyệt → không tạo hồ sơ chủ trương thứ hai.
  await pickT(page, 'kc-kind', 'Phê duyệt chủ trương KĐT');
  await expect(errOf(page, 'kc-kind')).toHaveText('Khoản đầu tư đã có hồ sơ chủ trương được phê duyệt — chọn Loại hồ sơ Phê duyệt KĐT.');
  await pick(page, 'kc-kind', 'KDT');
  await expect(errOf(page, 'kc-kind')).toHaveCount(0);
  // Lưu nháp (khuôn SCR-96): tạo hồ sơ HS-2026-0032-2, việc bước 50 (49 là AI) còn mở — mở lại chính màn này, các ô khoá.
  await page.locator('#kc-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.state.code, Flow.state.tokens.map((t) => `${t.task}:${t.who}`)])).toEqual(['HS-2026-0032-2', ['50:minh']]);
  await expect(page.locator('.pg-title')).toHaveText('Lập hồ sơ phê duyệt KĐT');
  await expect(page.locator('[data-vsel="kc-parent"]')).toContainText('HS-2026-0032');
  await expect(page.locator('#kc-est')).toBeDisabled();
  await expect(page.locator('[data-kc-inherit]')).toHaveText('Kế thừa từ hồ sơ chủ trương HS-2026-0032');
  expect(await mainText(page)).not.toMatch(BA);
  // Xem BPMN của việc: Loại hồ sơ của hồ sơ KĐT.
  await go(page, '#/task/' + (await page.evaluate(() => Flow.state.tokens[0].id)) + '/bpmn');
  await expect(page.locator('.bp-vp')).toHaveAttribute('data-active', '50');
  await expect(page.locator('main .ginfo').first()).toContainText('Loại hồ sơPhê duyệt KĐT');
  expect(await mainText(page)).not.toMatch(BA);

  // Chi tiết hồ sơ KĐT: bước 1–48 kế thừa (caption), Lịch sử không lặp việc của hồ sơ chủ trương.
  await go(page, '#/ho-so-kdt/HS-2026-0032-2');
  await expect(page.locator('[data-kdt-inherit]')).toHaveText('Bước 1–48 · Kế thừa từ hồ sơ chủ trương HS-2026-0032');
  const t1 = await page.evaluate(() => BPMN_FLOWS.MS13.tasks[1].name);
  await expect(page.locator('.drail')).not.toContainText(t1);
  await expect(page.locator('.dmain section').nth(3)).toContainText('BM-01');
  await expect(page.locator('.sb-nav [data-go="ho-so-pd-kdt"]')).toHaveClass(/active/);
  await go(page, '#/kdt');
  await expect(page.locator('.vtable tbody tr', { hasText: K }).locator('.vbadge')).toHaveText('Đang lập hồ sơ KĐT');

  // Chạy tiếp hồ sơ KĐT theo nhánh chính tới kết thúc (50 → … → 60).
  const seen = await page.evaluate(() => {
    const s = [];
    for (let i = 0; i < 80 && Flow.state.tokens.length; i++) {
      const t = Flow.state.tokens[0];
      s.push(Number(t.task));
      Flow.complete(t.id, Flow.mainChoice(t.task), 'Nội dung thử');
    }
    return s;
  });
  expect(Math.min(...seen)).toBeGreaterThanOrEqual(27);
  expect(seen).toEqual(expect.arrayContaining([50, 55, 57, 60]));
  expect(seen.filter((n) => n >= 1 && n <= 24)).toEqual([]);
  expect(await page.evaluate(() => Flow.state.status)).toBe('approved');
  await go(page, '#/kdt');
  await expect(page.locator('.vtable tbody tr', { hasText: K }).locator('.vbadge')).toHaveText('Đã phê duyệt');
  await go(page, '#/kdt/' + enc(K));
  const prof = page.locator('[data-kdt-profiles] tbody tr');
  await expect(prof).toHaveCount(2);
  await expect(prof.filter({ hasText: 'HS-2026-0032-2' })).toContainText('Phê duyệt KĐT');
  await expect(prof.filter({ hasText: 'HS-2026-0032-2' }).locator('.vbadge')).toHaveText('Hoàn thành');
  await page.locator('.dx-tabs [data-dtab]', { hasText: 'Kết quả' }).click();
  await expect(page.locator('main section.vcard', { has: page.locator('h3', { hasText: 'Kết quả phê duyệt chủ trương' }) })).toContainText('HS-2026-0032');
  await expect(page.locator('main section.vcard', { has: page.locator('h3', { hasText: 'Kết quả phê duyệt KĐT' }) })).toContainText('HS-2026-0032-2');
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Gộp BM-00 (0031 chạy tới kết thúc, 0015 mẫu) → KĐT Đã phê duyệt, không tạo được hồ sơ KĐT; KĐT chưa có chủ trương được duyệt thì báo', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.evaluate(() => Flow.jumpTo('END', 'minh', null, 'MS13', 'KĐT-2026-0031'));
  expect(await page.evaluate(() => [Flow.state.status, Flow.kdtCases().find((c) => c.code === 'HS-2026-0031').scope, Flow.kdtCtChoices('KĐT-2026-0031').length])).toEqual(['approved', 'CT_KDT', 0]);
  await go(page, '#/kdt');
  await expect(page.locator('.vtable tbody tr', { hasText: 'KĐT-2026-0031' }).locator('.vbadge')).toHaveText('Đã phê duyệt');
  for (const k of ['KĐT-2026-0031', 'KĐT-2026-0015']) {
    await go(page, '#/kdt/' + enc(k));
    await expect(page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]')).toHaveCount(0);
    await expect(page.locator('[data-kdt-profiles] tbody')).toContainText('Phê duyệt chủ trương KĐT');
    await expect(page.locator('[data-kdt-profiles] tbody')).not.toContainText(/HS-2026-\d{4}-2/);
    await go(page, '#/kdt/' + enc(k) + '/tao-ho-so');
    await pick(page, 'kc-kind', 'KDT');
    await expect(errOf(page, 'kc-kind')).toHaveText('Khoản đầu tư đã được phê duyệt. Hồ sơ Điều chỉnh KĐT làm ở đợt sau.');
    await expect(page.locator('[data-vsel="kc-parent"]')).toContainText('Chưa có hồ sơ chủ trương được phê duyệt');
    const n = await page.evaluate(() => Flow.kdtCases().length);
    await page.locator('#kc-save').click();
    await expect(page).toHaveURL(/\/tao-ho-so$/);
    expect(await page.evaluate(() => Flow.kdtCases().length)).toBe(n);
  }
  // KĐT chưa có hồ sơ: Phê duyệt KĐT chưa chọn được.
  await go(page, '#/kdt/' + enc('KĐT-2026-0033') + '/tao-ho-so');
  await pick(page, 'kc-kind', 'KDT');
  await expect(errOf(page, 'kc-kind')).toHaveText('Khoản đầu tư chưa có hồ sơ chủ trương được phê duyệt.');
  await expect(page.locator('#kc-est')).toBeDisabled();
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Tổng mức vốn KĐT lệch luồng chủ trương: thanh vàng, hộp xác nhận bắt buộc Giải trình, tag trên hồ sơ; ra MS15 chặn Lưu', async ({ page }) => {
  await fresh(page, '#/kdt');
  await ctEnd(page);
  await go(page, '#/kdt/' + enc(K) + '/tao-ho-so');
  const est = page.locator('#kc-est'), save = page.locator('#kc-save'), bar = page.locator('[data-kc-lech]');
  // MS15: báo dưới ô, chặn Lưu.
  await est.fill('1200');
  await expect(page.locator('#kc-luong')).toHaveValue('MS15 · KĐT phức tạp');
  await expect(save).toBeDisabled();
  await expect(errOf(page, 'kc-est')).toContainText('Tổng mức vốn KĐT thuộc MS15 · KĐT phức tạp');
  // Trong ngưỡng MS13: không cảnh báo.
  await est.fill('100');
  await expect(save).toBeEnabled();
  await expect(bar).toHaveCount(0);
  await expect(errOf(page, 'kc-est')).toHaveCount(0);
  // Vượt ngưỡng MS13 (160 tỷ, Viễn thông - CNTT) → MS14: thanh vàng ngay khi nhập.
  await est.fill('170');
  await expect(page.locator('#kc-luong')).toHaveValue('MS14 · KĐT thông thường');
  await expect(bar).toContainText('Luồng KĐT: MS14 · KĐT thông thường khác luồng chủ trương: MS13 · KĐT đơn giản (hồ sơ HS-2026-0032)');
  expect(await mainText(page)).not.toMatch(BA);
  const n = await page.evaluate(() => Flow.kdtCases().length);
  await save.click();
  const dlg = page.locator('.overlay', { hasText: 'Xác nhận luồng KĐT khác luồng chủ trương' });
  await expect(dlg).toBeVisible();
  await expect(dlg).toContainText('cần giải trình');
  expect(await dlg.innerText()).not.toMatch(BA);
  // Tăng quy mô: Giải trình bắt buộc.
  await dlg.locator('#kc-lech-ok').click();
  await expect(dlg.locator('#kc-rf')).toHaveClass(/invalid/);
  await expect(dlg.locator('#kc-rf .msg')).toHaveText('Bạn cần nhập Giải trình.');
  // Hủy: không tạo hồ sơ.
  await dlg.locator('[data-close]').first().click();
  await expect(dlg).toHaveCount(0);
  await expect(page).toHaveURL(/\/tao-ho-so$/);
  expect(await page.evaluate(() => Flow.kdtCases().length)).toBe(n);
  await save.click();
  await dlg.locator('#kc-reason').fill('Bổ sung buồng đo thứ hai theo kết luận thẩm định chủ trương.');
  await dlg.locator('#kc-lech-ok').click();
  // MS14 (luồng chưa chạy được): hồ sơ "Đang xử lý" ở bước 46, mở Chi tiết hồ sơ có tag.
  await expect(page).toHaveURL(/#\/ho-so-kdt\/HS-2026-0032-2$/);
  await expect(page.locator('[data-lech-tag]')).toHaveText('Luồng khác chủ trương');
  const gi = page.locator('.ginfo');
  await expect(gi).toContainText('Quy trìnhMS14 · KĐT thông thường');
  await expect(gi).toContainText('Luồng KĐTMS14 · KĐT thông thường');
  await expect(gi).toContainText('Bổ sung buồng đo thứ hai theo kết luận thẩm định chủ trương.');
  await expect(gi).toContainText('Tổng mức vốn KĐT (gồm VAT)170,00 tỷ đồng');
  await expect(page.locator('[data-kdt-inherit]')).toContainText('Kế thừa từ hồ sơ chủ trương HS-2026-0032');
  expect(await mainText(page)).not.toMatch(BA);
  expect(await page.evaluate(() => { const c = Flow.kdtCases().find((x) => x.code === 'HS-2026-0032-2'); return [c.flow, c.task, c.lech.from, c.lech.to]; })).toEqual(['MS14', 46, 'MS13', 'MS14']);
  await go(page, '#/ho-so-pd-kdt');
  await expect(page.locator('tr[data-code="HS-2026-0032-2"]')).toContainText('MS13 → MS14');
  // Hồ sơ chủ trương đã có hồ sơ KĐT dùng → không còn hồ sơ chủ trương để chọn.
  expect(await page.evaluate((k) => Flow.kdtCtChoices(k).length, K)).toBe(0);
  expect(page.errors).toEqual([]);
});

test('KĐT nhiều đề tài / dự án: SCR-55 chọn nhiều + bóc tách theo đề tài, SCR-56, SCR-54 (cột, lọc có chứa), đề tài liệt kê KĐT', async ({ page }) => {
  const A = 'NV-KHCN-2026-014', B = 'NV-KHCN-2026-006';
  await fresh(page, '#/kdt/create');
  await page.locator('#k-title').fill('Đầu tư thiết bị đo kiểm dùng chung cho hai nhiệm vụ KHCN');
  // Chọn nhiều: danh sách giữ mở sau mỗi lần chọn, Escape đóng.
  await page.locator('[data-vsel="k-nv"]').click();
  await page.locator(`.vsel-panel [data-opt="${A}"]`).click();
  await expect(page.locator('.vsel-panel')).toBeVisible();
  await page.locator(`.vsel-panel [data-opt="${B}"]`).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.vsel-panel')).toHaveCount(0);
  await expect(page.locator('[data-vsel="k-nv"]')).toContainText(A);
  await expect(page.locator('[data-vsel="k-nv"]')).toContainText(B);
  await pickT(page, 'k-field', 'Viễn thông - CNTT');
  await pickT(page, 'k-type', 'Khoa học công nghệ');
  await pickT(page, 'k-nature', 'Cần tích hợp');
  await page.locator('#k-est').fill('45');
  // Bóc tách theo dòng dự toán của từng đề tài (khoản mục ghi mã đề tài).
  await pick(page, 'kc-ctype', 'PL2');
  await pick(page, 'kc-cline', `${A}-1`);
  await page.locator('[data-kc-cadd]').click();
  await pick(page, 'kc-ctype', 'PL2');
  await pick(page, 'kc-cline', `${B}-6`);
  await page.locator('[data-kc-cadd]').click();
  const cost = page.locator('[data-kc-cost] tbody tr');
  await expect(cost).toHaveCount(2);
  await expect(cost.nth(0)).toContainText(A);
  await expect(cost.nth(1)).toContainText(B);
  await page.locator('[data-kc-cqty]').nth(0).fill('1');
  await page.locator('[data-kc-cval]').nth(0).fill('40');
  await page.locator('[data-kc-cqty]').nth(1).fill('2');
  await page.locator('[data-kc-cval]').nth(1).fill('0,3');
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('#k-save').click();
  await expect(page).toHaveURL(/#\/kdt$/);
  const x = await page.evaluate(() => { const k = Flow.kdtAll()[0]; return { code: k.code, nvs: k.nvs, nv: k.nv, cost: k.cost.map((r) => [r.line, r.nv]) }; });
  expect(x.nvs).toEqual([A, B]);
  expect(x.nv).toBe(A);
  expect(x.cost).toEqual([[`${A}-1`, A], [`${B}-6`, B]]);

  // SCR-54: cột Đề tài / dự án liệt kê cả hai; lọc theo đề tài thứ hai (có chứa) vẫn ra KĐT.
  const row = page.locator('.vtable tbody tr', { hasText: x.code });
  await expect(row).toContainText(A);
  await expect(row).toContainText(B);
  await page.locator('[data-kl="adv"]').click();
  await pick(page, 'kf-nv', B);
  await page.locator('[data-kdt-adv] button[type="submit"]').click();
  const codes = await page.locator('main .vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.innerText));
  expect(codes.some((t) => t.includes(x.code))).toBe(true);
  expect(codes.some((t) => t.includes('KĐT-2026-0030'))).toBe(true);
  expect(codes.every((t) => t.includes(B))).toBe(true);

  // SCR-56: Thông tin chung + bảng bóc tách theo đề tài.
  await go(page, '#/kdt/' + enc('KĐT-2026-0030'));
  await expect(page.locator('main .ginfo').first()).toContainText(A);
  await expect(page.locator('main .ginfo').first()).toContainText(B);
  await expect(page.locator('[data-kdt-cost] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-kdt-cost] tbody tr').nth(1)).toContainText(B);
  expect(await mainText(page)).not.toMatch(BA);

  // SCR-104 Chi tiết đề tài: KĐT liên quan gồm KĐT có đề tài trong danh sách đề tài / dự án.
  await go(page, '#/de-tai/' + enc(B));
  await page.evaluate(() => { Object.assign(D.show, { dtKdt: true }); App.render(); });
  await page.locator('[data-dt-tab="kdt"]').click();
  const rel = page.locator('[data-dt-kdt]');
  await expect(rel).toContainText('KĐT-2026-0030');
  await expect(rel).toContainText(x.code);
  const want = await page.evaluate((nv) => Flow.kdtAll().filter((k) => k.nvs.includes(nv)).length, B);
  await expect(rel.locator('tbody tr')).toHaveCount(want);
  expect(page.errors).toEqual([]);
});

// C3: các màn mới / đổi của T45 không có chữ BA ngoài nút (i).
const ROUTES = ['#/ho-so-ct-kdt', '#/ho-so-pd-kdt', '#/ho-so-kdt/HS-2026-0026-2', '#/ho-so-kdt/HS-2026-0012-2', '#/ho-so-kdt/HS-2026-0026-2/bpmn',
  `#/kdt/${enc('KĐT-2026-0030')}`, `#/kdt/${enc('KĐT-2026-0012')}`, `#/kdt/${enc('KĐT-2026-0015')}/tao-ho-so`];
for (const r of ROUTES) {
  test(`C3 T45: không có chữ BA ngoài nút (i) — ${decodeURIComponent(r)}`, async ({ page }) => {
    await fresh(page, r);
    await expect(page.locator('main .info-i').first()).toBeVisible();
    expect(await mainText(page)).not.toMatch(BA);
    expect(page.errors).toEqual([]);
  });
}

test('Thêm mới từ hai danh sách hồ sơ: Loại hồ sơ cố định theo danh sách, chọn Khoản đầu tư đủ điều kiện, Huỷ về danh sách', async ({ page }) => {
  await fresh(page, '#/ho-so-ct-kdt');
  await page.locator('main [data-hk-new]').click();
  await expect(page).toHaveURL(/#\/ho-so-ct-kdt\/create$/);
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hồ sơ chủ trương KĐT');
  await expect(page.locator('.sb-nav [data-go="ho-so-ct-kdt"]')).toHaveClass(/active/);
  await expect(page.locator('[data-vsel="kc-kind"]')).toHaveClass(/dis/);
  await expect(page.locator('[data-vsel="kc-kind"]')).toContainText('Phê duyệt chủ trương KĐT');
  await expect(page.locator('[data-vsel="kc-kdt"]')).not.toHaveClass(/dis/);
  await page.locator('[data-vsel="kc-kdt"]').click();
  const opts = await page.locator('.vsel-panel .vsel-opt').allInnerTexts();
  expect(opts.some((t) => t.includes('KĐT-2026-0021'))).toBeTruthy(); // hồ sơ chủ trương đã dừng: tạo lại được
  expect(opts.some((t) => t.includes('KĐT-2026-0031'))).toBeFalsy(); // gộp đang xử lý: không tạo thêm được
  await page.keyboard.press('Escape');
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('main button', { hasText: 'Huỷ' }).click();
  await expect(page).toHaveURL(/#\/ho-so-ct-kdt$/);
  // Mẫu KĐT-2026-0023 (chủ trương HS-2026-0023 đã duyệt, chưa có hồ sơ KĐT): Thêm mới hồ sơ phê duyệt KĐT có KĐT này.
  await go(page, '#/ho-so-pd-kdt/create');
  await expect(page.locator('[data-vsel="kc-kdt"]')).toContainText('KĐT-2026-0023');
  await go(page, '#/ho-so-ct-kdt');

  // Danh sách hồ sơ phê duyệt KĐT: sau khi chủ trương 0032 được duyệt, Thêm mới chọn sẵn KĐT, hồ sơ chủ trương; Lưu mở việc bước 49.
  await ctEnd(page);
  await go(page, '#/ho-so-pd-kdt');
  await page.locator('main [data-hk-new]').click();
  await expect(page).toHaveURL(/#\/ho-so-pd-kdt\/create$/);
  await expect(page.locator('[data-vsel="kc-kind"]')).toContainText('Phê duyệt KĐT');
  await expect(page.locator('[data-vsel="kc-kdt"]')).toContainText(K);
  await expect(page.locator('[data-vsel="kc-parent"]')).toContainText('HS-2026-0032');
  await page.locator('#kc-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('50');
});

// Người dùng 10/11: Thêm mới hồ sơ chủ trương / phê duyệt KĐT theo khuôn Lập đề xuất mua sắm (SCR-96) — chọn KĐT có sẵn, điền sẵn, Lưu nháp / Gửi.
const addCost = async (page) => {
  await page.locator('[data-vsel="kc-ctype"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  await page.locator('[data-vsel="kc-cline"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  await page.locator('[data-kc-cadd]').click();
  await page.locator('[data-kc-cqty]').first().fill('1');
  await page.locator('[data-kc-cval]').first().fill('0,1');
};
test('Thêm mới hồ sơ chủ trương KĐT (khuôn SCR-96): chọn KĐT-2026-0021, điền sẵn; Lưu nháp giữ bước 01; Gửi hoàn thành 01–05 → việc 07', async ({ page }) => {
  const k = 'KĐT-2026-0021';
  await fresh(page, '#/ho-so-ct-kdt/create');
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hồ sơ chủ trương KĐT');
  await expect(page.locator('.pg-head .vbtn:not(.back)')).toHaveText(['Huỷ', 'Lưu nháp', 'Gửi']);
  await pick(page, 'kc-kdt', k);
  const x = await page.evaluate((c) => Flow.findKdt(c), k);
  await expect(page.locator('#kc-name')).toHaveValue(x.title);
  await expect(page.locator('#kc-proc')).toHaveValue(/MS13 · MS14 · MS15/);
  await expect(page.locator('[data-vsel="kc-nv"]')).toContainText(x.nv);
  await expect(page.locator('#kc-xest')).toHaveValue('35');
  await expect(page.locator('#kc-period')).toHaveValue(x.period);
  for (const c of ['data-kc-chung', 'data-kc-cost', 'data-kc-basis', 'data-kc-plcard', 'data-kc-members', 'data-kc-docs']) await expect(page.locator(`[${c}]`)).toHaveCount(1);
  await expect(page.locator('[data-kc-bm03]')).toHaveCount(0);
  expect(await mainText(page)).not.toMatch(BA);
  // Gửi khi chưa bóc tách, phụ lục Có chưa có tệp: báo lỗi, chưa tạo hồ sơ.
  const n = await page.evaluate(() => Flow.kdtCases().length);
  await page.locator('[data-kcp-pl="plDm|Có"]').click();
  await page.locator('#kc-save').click();
  await expect(page.locator('[data-kc-cost] .lf-err')).toHaveText('Bạn cần bóc tách ít nhất một khoản mục chi phí.');
  await expect(page.locator('[data-kcp-f="plDm"] .t-err')).toHaveText('Bạn cần tải tệp phụ lục.');
  expect(await page.evaluate(() => Flow.kdtCases().length)).toBe(n);
  await page.locator('[data-kcp-pl="plDm|Không"]').click();
  await addCost(page);
  await page.locator('[data-kcm-add]').click();
  await pick(page, 'kc-role-m1', await page.evaluate(() => window.Luong.rolesOf('MS13')[0].code));
  await page.locator('[data-vsel="kc-m-m1"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  // Lưu nháp: tạo hồ sơ chủ trương, bước 01 còn mở; mở lại việc → cùng màn, dữ liệu giữ.
  await page.locator('#kc-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.state.kdt, Flow.state.kdtKind, Flow.state.tokens.map((t) => String(t.task))])).toEqual([k, 'CT', ['1']]);
  await expect(page.locator('.pg-title')).toHaveText('Lập hồ sơ chủ trương KĐT');
  await expect(page.locator('[data-kc-cost] tbody tr')).toHaveCount(1);
  const tid = await page.evaluate(() => Flow.state.tokens[0].id);
  await go(page, '#/viec-cua-toi');
  await page.reload();
  await go(page, '#/task/' + tid);
  await expect(page.locator('.pg-title')).toHaveText('Lập hồ sơ chủ trương KĐT');
  await expect(page.locator('[data-kc-cost] tbody tr')).toHaveCount(1);
  await expect(page.locator('[data-kc-members] tbody tr')).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  // KĐT cập nhật theo màn (như Lập ĐXMS ghi vào ĐXMS).
  expect(await page.evaluate((c) => Flow.findKdt(c).cost.length, k)).toBe(1);
  // Gửi: hoàn thành 01 → 05 (02, 03, 06 máy luồng chạy) → việc 07.
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  const r = await page.evaluate(() => ({ tok: Flow.state.tokens.map((t) => String(t.task)), done: Flow.state.history.filter((h) => h.who).map((h) => String(h.task)), bt: Flow.ui.basisType, boc: (Flow.ui.bocTach || []).length }));
  expect(r.tok).toEqual(['7']);
  expect(r.done).toEqual(expect.arrayContaining(['1', '4', '5']));
  expect(r.bt).toBeTruthy();
  expect(r.boc).toBeGreaterThan(0);
  expect(page.errors).toEqual([]);
});

test('Thêm mới hồ sơ phê duyệt KĐT (khuôn SCR-96): KĐT-2026-0023 chọn sẵn, kế thừa chủ trương; 170 tỷ → thanh vàng + Giải trình; Gửi hoàn thành 50 → việc 51', async ({ page }) => {
  await fresh(page, '#/ho-so-pd-kdt/create');
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hồ sơ phê duyệt KĐT');
  await expect(page.locator('[data-vsel="kc-kdt"]')).toContainText('KĐT-2026-0023');
  await expect(page.locator('[data-vsel="kc-parent"]')).toContainText('HS-2026-0023');
  await expect(page.locator('#kc-ctdoc')).toHaveValue(/05\/10\/2026/);
  await expect(page.locator('#kc-est')).toHaveValue('52,6');
  await expect(page.locator('#kc-luong')).toHaveValue('MS13 · KĐT đơn giản');
  await expect(page.locator('[data-kc-inherit]')).toHaveText('Kế thừa từ hồ sơ chủ trương HS-2026-0023');
  await expect(page.locator('[data-vsel="kc-nv"]')).toContainText('NV-KHCN-2026-006');
  await expect(page.locator('[data-vsel="kc-nv"]')).toContainText('NV-KHCN-2026-014');
  await expect(page.locator('[data-vsel="kc-field"]')).toHaveClass(/dis/);
  await expect(page.locator('[data-kc-bm03] textarea')).toHaveCount(11);
  await expect(page.locator('#kc-t-diaDiem')).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  // Lệch luồng: thanh vàng, Giải trình bắt buộc khi tăng quy mô.
  await page.locator('#kc-est').fill('170');
  await expect(page.locator('[data-kc-lech]')).toContainText('MS14 · KĐT thông thường');
  await addCost(page);
  await page.locator('#kc-save').click();
  const dlg = page.locator('.overlay', { hasText: 'Xác nhận luồng KĐT khác luồng chủ trương' });
  await dlg.locator('#kc-lech-ok').click();
  await expect(dlg.locator('#kc-rf .msg')).toHaveText('Bạn cần nhập Giải trình.');
  await dlg.locator('[data-close]').first().click();
  await expect(page).toHaveURL(/#\/ho-so-pd-kdt\/create$/);
  await page.locator('#kc-est').fill('52,6');
  await expect(page.locator('[data-kc-lech]')).toHaveCount(0);
  await page.locator('#kc-t-hienTrang').fill('Hiện trạng thử: chưa có buồng đo mmWave.');
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  const r = await page.evaluate(() => ({ code: Flow.state.code, tok: Flow.state.tokens.map((t) => String(t.task)), ht: Flow.ui.hienTrang, kq: Flow.state.kdtKind }));
  expect(r).toEqual({ code: 'HS-2026-0023-2', tok: ['51'], ht: 'Hiện trạng thử: chưa có buồng đo mmWave.', kq: 'KDT' });
  expect(page.errors).toEqual([]);
});

test('Việc của tôi: việc bước 01 / 50 của hồ sơ lưu nháp từ màn Thêm mới hiện tên "Lập hồ sơ …", mở lại màn', async ({ page }) => {
  await fresh(page, '#/ho-so-pd-kdt/create');
  await expect(page.locator('[data-vsel="kc-kdt"]')).toContainText('KĐT-2026-0023');
  await page.locator('#kc-draft').click();
  await go(page, '#/viec-cua-toi');
  const row = page.locator('main .vtable tbody tr', { hasText: 'KĐT-2026-0023' }).first();
  await expect(row).toContainText('Lập hồ sơ phê duyệt KĐT (bước 50)');
  await go(page, '#/ho-so-kdt/' + enc('HS-2026-0023-2'));
  await expect(page.locator('main')).toContainText('Lập hồ sơ phê duyệt KĐT (bước 50)');
  await go(page, '#/viec-cua-toi');
  await page.locator('main .vtable tbody tr', { hasText: 'KĐT-2026-0023' }).first().click();
  await expect(page.locator('.pg-title')).toContainText('Lập hồ sơ phê duyệt KĐT');

  await fresh(page, '#/ho-so-ct-kdt/create');
  await page.locator('#kc-draft').click();
  await go(page, '#/viec-cua-toi');
  await expect(page.locator('main .vtable tbody')).toContainText('Lập hồ sơ chủ trương KĐT (bước 01–05)');
});
