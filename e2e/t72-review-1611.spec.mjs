// T72 — sửa prototype theo kho comment review 13–16/11/2026 (#75–#90), D-122
// (plan docs/dtms/prototype-T72-review-sheet-1611.md): KĐT bóc tách hạng mục + ô số, Lập ĐXMS hệ thống bóc tách + SL còn được mua,
// Thông tin chung / Văn bản đầu ra ĐXMS, Rà soát tồn kho, YCBG mức giá + AI, Phụ lục chi phí Tờ trình, Trình ký.
import { test, expect } from '@playwright/test';
import { fresh, createCase, openForm, aiFill } from './helpers.mjs';

test.describe.configure({ timeout: 90_000 });
const go = (page, h) => page.evaluate((x) => { location.hash = x; }, h);
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
const first = async (page, id) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
// Bảng đứng trước hàng chọn Loại chi phí / Khoản mục trong card.
const tableBeforePicker = (card, pickSel) => card.evaluate((c, s) => {
  const t = c.querySelector('.vtable'), p = c.querySelector(s);
  return !!t && !!p && !!(t.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING);
}, pickSel);

test('#75, #76, #82: KĐT — tên Bóc tách hạng mục, bảng trên hàng chọn; "0.001" là 0,001 tỷ, không báo Vượt giá trị dự toán', async ({ page }) => {
  await fresh(page, '#/kdt/create');
  await expect(page.locator('[data-kc-cost] h3')).toHaveText('Bóc tách hạng mục');
  await fresh(page, '#/ho-so-ct-kdt/create');
  await pick(page, 'kc-kdt', 'KĐT-2026-0021');
  const card = page.locator('[data-kc-cost]');
  await expect(card.locator('h3')).toHaveText('Căn cứ và nội dung KĐT — Bóc tách hạng mục');
  expect(await tableBeforePicker(card, '[data-kc-pick]')).toBe(true);
  // T72b (D-123): hệ thống đã bóc tách sẵn khi chọn đề tài — xoá các dòng đó để test tự thêm.
  while (await page.locator('[data-kc-cdel]').count()) await page.locator('[data-kc-cdel]').first().click();
  await first(page, 'kc-ctype');
  await first(page, 'kc-cline');
  await page.locator('[data-kc-cadd]').click();
  await page.locator('[data-kc-cqty]').first().fill('1');
  const val = () => page.locator('[data-kc-cval]').first();
  // Kiểu Việt Nam đọc đúng; nhiều dấu chấm = phân cách nghìn; rời ô thì hiện lại theo định dạng Việt Nam.
  for (const [inp, out] of [['1.234,5', '1.234,5'], ['1,5', '1,5'], ['1.000.000', '1.000.000'], ['0.001', '0,001']]) {
    await val().fill(inp);
    await val().press('Tab');
    await expect(val()).toHaveValue(out);
  }
  // 0,001 tỷ nhỏ hơn dự toán dòng → Gửi đi tiếp (trước: đọc thành 1 tỷ, báo Vượt giá trị dự toán, chặn).
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(page.errors).toEqual([]);
});

test('T72b (D-123): KĐT — chọn đề tài thì hệ thống bóc tách, cột SL còn được mua, vượt chỉ cảnh báo', async ({ page }) => {
  await fresh(page, '#/kdt/create');
  const card = page.locator('[data-kc-cost]');
  await page.locator('[data-vsel="k-nv"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
  await expect(card.locator('[data-kc-cqty]').first()).toBeVisible();
  await expect(card.locator('[data-kc-cqty]').first()).not.toHaveValue('');
  await expect(card.locator('[data-kc-cval]').first()).not.toHaveValue('');
  await expect(card.locator('thead th')).toContainText(['Còn lại khả dụng', 'SL còn được mua']);
  await expect(card.locator('[data-kc-cqleft]').first()).toHaveText(/^\d+ \S+/);
  await expect(card.locator('[data-kc-ai]')).toHaveCount(0);
  const left = Number((await card.locator('[data-kc-cqleft]').first().innerText()).split(' ')[0]);
  await card.locator('[data-kc-cqty]').first().fill(String(left + 5));
  await card.locator('[data-kc-cqty]').first().press('Tab');
  await page.locator('#k-title').fill('KĐT thử bóc tách hệ thống').catch(() => {});
  await page.locator('#k-save').click();
  await expect(page.locator('main')).not.toContainText('Vượt giá trị dự toán');
  expect(page.errors).toEqual([]);
});

test('#83, #84, Q8, Q9: Lập ĐXMS — không còn AI ở khối Căn cứ, hệ thống bóc tách sẵn, cột SL còn được mua, bảng trên hàng chọn', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await createCase(page);
  await page.locator('[data-luong-form]').waitFor();
  const card = page.locator('[data-lf-cost]');
  await expect(card.locator('h3')).toContainText('Căn cứ và nội dung mua sắm — Bóc tách hạng mục');
  await expect(card.locator('[data-lf-ai-sec]')).toHaveCount(0);
  await expect(card.locator('thead th')).toContainText(['Còn lại khả dụng', 'SL còn được mua']);
  await expect(card.locator('tbody [data-lf-cqty]').first()).toBeVisible();
  await expect(card.locator('[data-lf-cqleft]').first()).toHaveText(/^\d+ \S+/);
  await expect(card.locator('[data-lf-boc-sum]')).toContainText('Hệ thống đã đối chiếu');
  await expect(card).not.toContainText('AI');
  expect(await tableBeforePicker(card, '[data-lf-pick]')).toBe(true);
  // Vượt SL còn được mua: cảnh báo, không chặn.
  await card.locator('[data-lf-cqty]').first().fill('999');
  await card.locator('[data-lf-cqty]').first().press('Tab');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(page.errors).toEqual([]);
});

test('#77, #80, #81: Chi tiết ĐXMS — bỏ Giá trị dự kiến; Văn bản đầu ra 3 cột, một nút Tải xuống', async ({ page }) => {
  await fresh(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0137'));
  const gen = page.locator('main section.gen').first();
  await expect(gen).toContainText('Giá trị đề xuất');
  await expect(gen).not.toContainText('Giá trị dự kiến');
  await page.locator('[data-ltab="tai-lieu"]').click();
  const docs = page.locator('[data-dx-docs]');
  const hs = (await docs.locator('thead th').allInnerTexts()).map((s) => s.trim()).filter((s) => s && s !== 'STT');
  expect(hs).toEqual(['Thao tác', 'Văn bản', 'Ngày']);
  await expect(docs.locator('tbody tr').first().locator('td.c button')).toHaveCount(1);
  await expect(docs.locator('tbody tr').first().locator('td.c button')).toHaveAttribute('aria-label', 'Tải xuống');
  expect(page.errors).toEqual([]);
});

test('#78, #79: Rà soát tồn kho bước 7 — nhãn Tệp kết quả, không còn Biên bản kiểm đếm; Gửi không cần biên bản', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const t7 = await page.evaluate(() => { Flow.jumpTo(7, 'qlts'); Flow.setPersona('qlts'); return Flow.state.tokens.find((t) => String(t.task) === '7').id; });
  await go(page, '#/task/' + t7);
  await page.locator('[data-ltab="ton-kho"]').click().catch(() => {});
  await page.locator('[data-rsk-ed]').waitFor();
  await expect(page.locator('[data-rsk-ed] .rsk-up label').first()).toHaveText('Tệp kết quả');
  await expect(page.locator('[data-rsk-signf]')).toHaveCount(0);
  await expect(page.locator('[data-rsk-ed]')).not.toContainText('Biên bản kiểm đếm');
  expect(page.errors).toEqual([]);
});

test('#85, #86: YCBG bước 8 — Mức giá làm cơ sở mặc định Thấp nhất; ✦ Gợi ý từ AI điền điều khoản đang trống', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(8, 'minh'); const k = Flow.state.tokens.find((t) => String(t.task) === '8'); Flow.setPersona(k.who); return k.id; });
  await go(page, '#/task/' + id);
  const form = await openForm(page, 'Tạo yêu cầu báo giá');
  await expect(form.locator('[data-vsel="ef-mucGia"]')).toContainText('Thấp nhất');
  await expect(form.locator('[data-ef="dkThanhToan"]')).toHaveValue('');
  await expect(form.locator('[data-ef-aifill]')).toHaveText('✦ Gợi ý từ AI');
  await aiFill(page);
  await expect(form.locator('[data-ef="dkThanhToan"]')).not.toHaveValue('');
  await expect(form.locator('[data-ef-field="dkThanhToan"] [data-ef-ai-src]')).toContainText('Nguồn');
  expect(page.errors).toEqual([]);
});

test('#87–#89: Tờ trình bước 12 — Cơ sở giá dropdown NCC, chọn thì Đơn giá tự điền; chú thích Thấp nhất · Trung bình', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(12, 'minh', {}, 'MS01.01', undefined, null, false); Flow.setPersona('minh'); });
  const id = await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '12').id);
  await go(page, '#/task/' + id);
  const form = await openForm(page, 'Soạn thảo tờ trình ĐXMS');
  const sel = form.locator('[data-vsel="ef-phuLucEd::0::coSo"]');
  await sel.scrollIntoViewIfNeeded();
  await expect(sel).toContainText('NCC Alpha — ');
  await expect(sel).toContainText('(thấp nhất)');
  await expect(form.locator('.ef-row').first()).toContainText(/Thấp nhất: [\d,]+ tỷ · Trung bình: [\d,]+ tỷ/);
  const dg = form.locator('[data-ef="phuLucEd::0::donGia"]');
  const before = await dg.inputValue();
  await sel.click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'NCC Beta' }).first().click();
  await expect(form.locator('[data-ef="phuLucEd::0::donGia"]')).not.toHaveValue(before);
  await expect(form.locator('[data-vsel="ef-phuLucEd::0::coSo"]')).toContainText('NCC Beta — ');
  expect(page.errors).toEqual([]);
});

test('#90: Trình ký — nút hàng loạt bấm được khi chưa chọn dòng, hộp mật khẩu có Tên đăng nhập', async ({ page }) => {
  await fresh(page, '#/trinh-ky');
  const b = page.locator('[data-tk-bulk="sync"]');
  await expect(b).toBeEnabled();
  await expect(page.locator('[data-tk-bulk="fetch"]')).toBeEnabled();
  const pending = await page.evaluate(() => document.querySelectorAll('[data-tkl] tbody tr').length);
  expect(pending).toBeGreaterThan(0);
  await b.click();
  const m = page.locator('.vmodal').last();
  if (await page.locator('#tk-pw2').count()) {
    await expect(m).toContainText('Tên đăng nhập');
    await expect(m).not.toContainText('Tên người dùng');
  } else {
    await expect(page.locator('.toast').last()).toContainText('Không có lần trình nào');
  }
  expect(page.errors).toEqual([]);
});
