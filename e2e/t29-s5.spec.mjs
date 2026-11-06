// T29 S5 — trường theo HT-DXMS-NOTE ("TTr" trong Note = ĐXMS), plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md §3.9, D-59.
// F1 Khối đơn vị, F2 Người tạo / Mật, F3 lọc CQCM / tình trạng / ngày thẩm định, F4 cột, F5 Số / Ngày Tờ trình, F6 Đợt, F7 phụ lục,
// F8 tình trạng CQCM, F9 Cập nhật người xem, F10 tải PDF.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const rowCodes = (page) => page.locator('main .vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code).filter(Boolean));

test('F1, F3, F5: Danh sách hồ sơ ĐXMS — lọc Khối (Đơn vị theo khối), CQCM / tình trạng thẩm định; cột Số, Ngày Tờ trình', async ({ page }) => {
  await fresh(page, '#/ho-so-dxms');
  await expect(page.locator('tr[data-code="HS-2026-0103"]')).toContainText('103/TTr-TTML');
  await expect(page.locator('tr[data-code="HS-2026-0121"] td').nth(11)).toHaveText('-');
  await page.locator('[data-l="adv"]').click();
  await pick(page, 'f-block', 'Khối 3');
  await page.locator('[data-vsel="f-unit"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveText(['Nhà máy sản xuất thử nghiệm']);
  await page.keyboard.press('Escape');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  expect((await rowCodes(page)).sort()).toEqual(['HS-2026-0077', 'HS-2026-0095', 'HS-2026-0126']);
  await page.locator('[data-l="reset"]').click();
  await pick(page, 'f-rvSt', 'Yêu cầu sửa');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const codes = await rowCodes(page);
  expect(codes.length).toBeGreaterThan(0);
  for (const c of codes) await expect(page.locator(`tr[data-code="${c}"] td`).nth(11)).not.toHaveText('-');
  expect(page.errors).toEqual([]);
});

test('F1, F2, F4, F6: Danh sách ĐXMS — lọc Mật, Người tạo; cột Nhiệm vụ, Đợt; Thêm mới gợi ý Đợt theo nhiệm vụ', async ({ page }) => {
  await fresh(page, '#/dxms');
  await expect(page.locator('tr[data-code="ĐXMS-2026-0124"]')).toContainText('DA-2026-002 — Sản xuất module RRU 5G');
  await page.locator('[data-xl="adv"]').click();
  await pick(page, 'xf-secret', 'Có');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  expect(await rowCodes(page)).toEqual(['ĐXMS-2026-0089']);
  await page.locator('[data-xl="reset"]').click();
  await pick(page, 'xf-creator', 'Phan Văn Lộc');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  expect((await rowCodes(page)).length).toBe(3);

  await page.locator('[data-create="dxms"]').click();
  await page.locator('#x-title').fill('Mua sắm bổ sung module RRU đợt mới');
  await pick(page, 'x-nv', 'DA-2026-002');
  await expect(page.locator('#x-dot')).toHaveValue('3');
  await page.locator('#x-save').click();
  await expect(page).toHaveURL(/#\/dxms$/);
  await page.locator('[data-xl="adv"]').click();
  const code = await page.evaluate(() => Flow.dxmsAll()[0].code);
  await expect(page.locator(`tr[data-code="${code}"] td`).nth(6)).toHaveText('3');
  expect(page.errors).toEqual([]);
});

test('F9: Cập nhật người xem ở Chi tiết ĐXMS; Thông tin chung có Đợt, Khối đơn vị, Người được xem', async ({ page }) => {
  await fresh(page, '#/dxms/' + encodeURIComponent('ĐXMS-2026-0103'));
  await expect(page.locator('.ginfo')).toContainText('Khối 1');
  await page.locator('[data-viewers]').click();
  await pick(page, 'vw-users', 'quang');
  await page.locator('.vmodal-h h3').click();
  await page.locator('#vw-ok').click();
  expect(await lastToast(page)).toContain('Cập nhật người xem thành công');
  await expect(page.locator('.ginfo')).toContainText('Bùi Minh Quang');
  expect(page.errors).toEqual([]);
});

test('F5, F8, F10: Chi tiết hồ sơ — Số, ngày Tờ trình; hộp thoại Tình trạng thẩm định; tải PDF văn bản đầu ra', async ({ page }) => {
  await fresh(page, '#/ho-so-dxms/HS-2026-0103');
  await expect(page.locator('.ginfo')).toContainText('103/TTr-TTML');
  await expect(page.locator('.dmain > .vcard')).toHaveCount(4);
  await page.locator('[data-review]').click();
  await expect(page.locator('[data-review-dlg] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-review-dlg]')).toContainText('Ban Pháp chế');
  await page.locator('.vmodal [data-close]').first().click();
  await page.locator('[aria-label="Tải xuống PDF"]').first().click();
  expect(await lastToast(page)).toMatch(/\.pdf/);
  expect(page.errors).toEqual([]);
});

test('F7, F8: bước lập dự thảo — phụ lục chọn Có (B17, P-212) bắt buộc tải lên, Checklist Đủ; hồ sơ đang thẩm định hiện Chưa xem / Đang xem', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(12, 'minh', { phuLuc: { plCtkt: 'Có' } }, 'MS01.01', undefined, null, false); });
  const tok = await page.evaluate(() => Flow.tokensFor('minh').find((t) => t.task === 12).id);
  await go(page, '#/task/' + tok);
  await expect(page.locator('.doc-req', { hasText: 'Phụ lục' })).toHaveCount(1);
  await expect(page.locator('.doc-req', { hasText: 'Phụ lục' })).toContainText('Phụ lục Chỉ tiêu kỹ thuật — bắt buộc');
  await page.locator('[data-req-up="plCtkt"]').click();
  await expect(page.locator('.doc-req', { hasText: 'Phụ lục' })).toHaveCount(0);
  const st = await page.evaluate(() => EVars.of(Flow.state.tokens.find((t) => t.task === 12)).checklist.find((c) => c.muc === 'Phụ lục Chỉ tiêu kỹ thuật').tinhTrang);
  expect(st).toBe('Đủ');

  // Bước 19: mỗi CQCM một việc; chưa lưu nháp → Chưa xem; lưu nháp → Đang xem.
  await page.evaluate(() => { Flow.jumpTo(19, 'hoa', {}, 'MS01.01', undefined, null, false); });
  const rv = await page.evaluate(() => EVars.h.reviewRows().map((r) => r.st));
  expect(rv.length).toBeGreaterThan(0);
  expect(rv.every((s) => s === 'Chưa xem')).toBe(true);
  const after = await page.evaluate(() => {
    const t = Flow.state.tokens.find((k) => k.task === 19);
    Flow.setUi('efDraft', { [t.id]: {} });
    return EVars.h.reviewRows().find((r) => r.id === t.cqcm).st;
  });
  expect(after).toBe('Đang xem');
  expect(page.errors).toEqual([]);
});

test('F1, F2, F4: Danh sách luồng (Gộp) — Tìm kiếm nâng cao theo SRS + Khối, Người tạo, Mật; cột Nhiệm vụ, Đợt, Người tạo', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + '#/luong');
  await expect(page.locator('main .vtable th')).toContainText(['Đề tài / dự án', 'Đợt', 'Người tạo']);
  await page.locator('[data-lg="adv"]').click();
  await expect(page.locator('#luong-kw')).toHaveCount(0);
  await pick(page, 'lgf-secret', 'Có');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  expect(await rowCodes(page)).toEqual(['ĐXMS-2026-0089']);
  await page.locator('[data-lg="reset"]').click();
  await pick(page, 'lgf-block', 'Khối 2');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const codes = await rowCodes(page);
  expect(codes.sort()).toEqual(['ĐXMS-2026-0084', 'ĐXMS-2026-0106', 'ĐXMS-2026-0121']);
  expect(page.errors).toEqual([]);
});

// Cách 1 (người dùng chọn 04/11): trường của màn Thêm mới TTr cũ trên Thêm mới luồng, không trái Locked decisions.
test('SCR-96 cách 1 + T29 B12: Loại biểu mẫu / Cấp phê duyệt trống tới khi có giá trị; Hình thức trình ký chọn được (D-74); AI kiểm tra Mật; bóc tách chi phí (đồng, gói thầu dropdown); căn cứ pháp lý', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + '#/luong/create');
  await page.locator('#lf-title').fill('Luồng mua sắm cho dự án A');
  await expect(page.locator('#lf-d-form')).toHaveValue('');
  await expect(page.locator('#lf-d-level')).toHaveValue('');
  await page.locator('#lf-est').fill('45.500.000.000');
  await page.locator('#lf-est').blur();
  await expect(page.locator('#lf-d-form')).toHaveValue('ĐXMS có giá trị dưới nhóm B');
  await expect(page.locator('#lf-d-level')).toHaveValue('Tổng công ty');
  await expect(page.locator('[data-vsel="lf-sign"] .vsel-label')).toHaveText('VOffice');
  await pick(page, 'lf-sec', 'Có');
  await expect(page.locator('[data-vsel="lf-sign"] .vsel-label')).toHaveText('Bản cứng');
  // D-74: hồ sơ Mật vẫn chọn được VOffice.
  await pick(page, 'lf-sign', 'VOffice');
  await expect(page.locator('[data-vsel="lf-sign"] .vsel-label')).toHaveText('VOffice');
  await expect(page.locator('[data-sec-check]')).toContainText('AI kiểm tra quy tắc bảo mật');
  await expect(page.locator('[data-sec-check]')).not.toContainText('Mục đích');
  await expect(page.locator('#lf-purpose')).toHaveCount(0);
  await pick(page, 'lf-sec', 'Không');
  await expect(page.locator('[data-sec-check]')).toHaveCount(0);

  await expect(page.locator('[data-lf-cost]')).toContainText('Chọn Đề tài / dự án');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  // T29 B1 (D-54): không chọn Quy trình — Loại biểu mẫu / Cấp phê duyệt theo Giá trị dự kiến và Căn cứ đã được phê duyệt.
  await page.locator('#lf-est').fill('182900000000');
  await page.locator('#lf-est').blur();
  await expect(page.locator('#lf-d-form')).toHaveValue('ĐXMS có giá trị nhóm B trở lên');
  await expect(page.locator('#lf-d-level')).toHaveValue('Tập đoàn');
  await pick(page, 'lf-ctype', 'PL2');
  await pick(page, 'lf-cline', 'NV-KHCN-2026-014-1');
  await page.locator('[data-lf-cadd]').click();
  await expect(page.locator('[data-lf-cost] tbody tr')).toHaveCount(1);
  await expect(page.locator('[data-lf-cost] tbody')).toContainText('Quỹ phát triển KHCN');
  await page.locator('[data-lf-cqty]').fill('1');
  await page.locator('[data-lf-cval]').fill('999.000.000.000');
  const pkg = await page.locator('[data-lf-cost] [data-vsel^="lf-cpkg-"]').getAttribute('data-vsel');
  await pick(page, pkg, 'Không hình thành gói thầu');
  await page.locator('#lf-legal').fill('QĐ 1482/QĐ-VHT ngày 12/03/2026 phê duyệt nhiệm vụ KHCN');
  await expect(page.locator('[data-lf-rev]')).toHaveCount(0);

  const up = (names) => page.locator('#lf-file').setInputFiles(names.map((name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(16) })));
  await up(['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await page.locator('#lf-draft').click();
  await expect(page.locator('[data-lf-cost] .msg')).toContainText('Vượt giá trị dự toán');
  await expect(page.locator('#lf-legal')).toHaveValue(/1482/);
  await page.locator('[data-lf-cval]').fill('64.000.000.000');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const st = await page.evaluate(() => { const x = Flow.findDxms(Flow.state.dxms); return { code: x.code, cost: x.cost, legal: x.legal, sign: x.sign }; });
  expect(st.cost[0]).toMatchObject({ type: 'PL2', value: 64, pkg: 'Không hình thành gói thầu' });
  expect(st.legal).toContain('1482');
  expect(st.sign).toBe('VOffice');
  await go(page, '#/luong/' + encodeURIComponent(st.code));
  await page.locator('[data-ltab="can-cu"]').click();
  await expect(page.locator('main')).toContainText('Không hình thành gói thầu');
  await expect(page.locator('main')).toContainText('64.000.000.000');
  await expect(page.locator('.lf-legal')).toContainText('1482');
  expect(page.errors).toEqual([]);
});
