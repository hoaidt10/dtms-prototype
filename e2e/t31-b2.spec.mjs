// T31 B2 — K3 Đề tài / dự án ↔ KĐT (plan docs/dtms/prototype-T31-kdt-ia-chuan-bi.md §3 K3; D-69): nhãn "Đề tài / dự án" + link SCR-104
// ở SCR-54, 55, 56, 75; SCR-104 tab ĐXMS / KĐT liên quan, tab Gói thầu / Hợp đồng (IA-DXMS dòng 4), trường IA dòng 5–7 còn thiếu.
import { test, expect } from '@playwright/test';
import { fresh as fresh0 } from './helpers.mjs';

// T29 B15 (D-80): bản demo ĐXMS ẩn KĐT liên quan và tab Gói thầu / Hợp đồng ở SCR-104 — test T31 bật lại cờ.
async function fresh(page, hash) {
  await fresh0(page, hash);
  await page.evaluate(() => { Object.assign(D.show, { dtKdt: true, dtThau: true }); App.render(); });
}

const enc = encodeURIComponent;
const NV = 'DT-KHCN-2027-002'; // đề tài của KĐT-2026-0012 (đã phê duyệt, có KHLCNT-2026-0013)

test('SCR-54, 56: cột / nhãn "Đề tài / dự án", mã mở Chi tiết đề tài; KĐT liên quan', async ({ page }) => {
  await fresh(page, '#/kdt');
  await expect(page.locator('main .vtable thead th')).toContainText(['Đề tài / dự án']);
  await expect(page.locator('main')).not.toContainText('Nhiệm vụ / Đề tài, dự án');

  await fresh(page, '#/kdt/' + enc('KĐT-2026-0012'));
  const link = page.locator(`main [data-go="de-tai/${enc(NV)}"]`).first();
  await expect(link).toContainText(NV);
  await expect(page.locator('main .ginfo')).toContainText('Loại');
  await link.click();
  await expect(page).toHaveURL(new RegExp(`#/de-tai/${enc(NV)}$`));
  await expect(page.locator('[data-dt-tab]')).toHaveText(['Thông tin chung', 'Dự toán chi phí', 'ĐXMS liên quan', 'KĐT liên quan', 'Gói thầu / Hợp đồng', 'Văn bản pháp lý']);
  await page.locator('[data-dt-tab="kdt"]').click();
  const kdt = page.locator('[data-dt-kdt]');
  await expect(kdt).toContainText('KĐT-2026-0012');
  // T45 (D-104): KĐT chọn nhiều đề tài / dự án — đề tài có KĐT khi nằm trong nvs.
  const want = await page.evaluate((nv) => Flow.kdtAll().filter((x) => (x.nvs || [x.nv]).includes(nv)).map((x) => x.code), NV);
  await expect(kdt.locator('tbody tr')).toHaveCount(want.length);
  await kdt.locator(`[data-go="kdt/${enc('KĐT-2026-0012')}"]`).click();
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0012$/);
  expect(page.errors).toEqual([]);
});

test('SCR-55: nhãn, ô Loại chỉ đọc theo đề tài, thông báo bắt buộc', async ({ page }) => {
  await fresh(page, '#/kdt/create');
  await page.locator('#k-save').click();
  await expect(page.locator('.vfield.invalid .msg').nth(1)).toHaveText('Bạn cần chọn Đề tài / dự án.');
  await page.locator('[data-vsel="k-nv"]').click();
  await page.locator(`.vsel-panel [data-opt="${NV}"]`).click();
  const kind = await page.evaluate((nv) => D.nvOf(nv).kind, NV);
  await expect(page.locator('main .vfield', { hasText: /^Loại$/ }).locator('input')).toHaveValue(kind);
  expect(page.errors).toEqual([]);
});

test('SCR-75: cột và bộ lọc Đề tài / dự án', async ({ page }) => {
  await fresh(page, '#/ho-so-kdt');
  await expect(page.locator('main .vtable thead th')).toContainText(['Tên hồ sơ', 'Đề tài / dự án', 'Loại hồ sơ']);
  await page.locator('[data-hk="adv"]').click();
  await page.locator('[data-vsel="hkf-nv"]').click();
  await page.locator(`.vsel-panel [data-opt="${NV}"]`).click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const codes = await page.locator('main .vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code).filter(Boolean));
  expect(codes).toContain('HS-2026-0012');
  // T45 (D-104): lọc "có chứa" đề tài trong danh sách đề tài / dự án của KĐT.
  const has = await page.evaluate(([cs, nv]) => cs.map((c) => (Flow.findKdt(Flow.kdtCases().find((x) => x.code === c).kdt).nvs || []).includes(nv)), [codes, NV]);
  expect(has.every(Boolean)).toBe(true);
  await expect(page.locator(`main tbody [data-go="de-tai/${enc(NV)}"]`).first()).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('SCR-104: trường IA 5–7, card Phê duyệt; tab Gói thầu / Hợp đồng', async ({ page }) => {
  await fresh(page, '#/de-tai/' + enc(NV));
  for (const k of ['Lập theo kế hoạch năm', 'Loại sản phẩm', 'Mã dự án theo KHĐT năm', 'ID dự án trên cổng Đấu thầu QG', 'Người phụ trách báo cáo', 'Địa điểm đầu tư',
    'Ngày nghiệm thu', 'Nội dung, quy mô dự án (thông tin sản phẩm)']) await expect(page.locator('main .ginfo .k', { hasText: k }).first()).toBeVisible();
  const ap = page.locator('[data-dt-approve]');
  await expect(ap.locator('.k')).toHaveText(['Số / ngày TTr chủ trương', 'Số / ngày QĐ phê duyệt dự án', 'Số / ngày QĐ phê duyệt dự toán', 'Người phê duyệt chủ trương',
    'Người phê duyệt dự án', 'Người phê duyệt dự toán', 'Người phê duyệt quyết toán']);
  await expect(ap).toContainText('Tổng Giám đốc');

  await page.locator('[data-dt-tab="thau"]').click();
  const t = await page.evaluate((nv) => { const r = DeTai.thauOf(nv); return { pk: r.pk.map((p) => p.g.code), hd: r.hd.map((x) => x.h.code) }; }, NV);
  expect(t.pk).toEqual(expect.arrayContaining(['GT-2026-0026', 'GT-2026-0027', 'GT-2026-0028']));
  await expect(page.locator('[data-dt-pk] tbody tr')).toHaveCount(t.pk.length);
  await expect(page.locator('[data-dt-pk]')).toContainText('KĐT-2026-0012');
  await expect(page.locator('[data-dt-hd] tbody tr')).toHaveCount(Math.max(1, t.hd.length));
  await page.locator(`[data-dt-pk] [data-go="goi-thau/${enc('GT-2026-0026')}"]`).click();
  await expect(page).toHaveURL(/#\/goi-thau\/GT-2026-0026$/);
  expect(page.errors).toEqual([]);
});

test('SCR-104: gói thầu nhiều nguồn hiện giá trị phân bổ cho đề tài; hợp đồng của gói', async ({ page }) => {
  await fresh(page, '#/de-tai');
  const all = await page.evaluate(() => D.nhiemVu.map((n) => { const r = DeTai.thauOf(n.code); return { nv: n.code, pk: r.pk.map((p) => [p.g.code, p.alloc, p.g.price]), hd: r.hd.length }; }));
  const multi = all.flatMap((a) => a.pk.filter(([c]) => c === 'GT-2026-0032').map((p) => [a.nv, ...p]));
  expect(multi.length).toBeGreaterThan(0);
  multi.forEach(([, , alloc, price]) => expect(alloc).toBeLessThan(price));
  const withHd = all.find((a) => a.hd > 0);
  expect(withHd).toBeTruthy();
  await fresh(page, '#/de-tai/' + enc(withHd.nv));
  await page.locator('[data-dt-tab="thau"]').click();
  await expect(page.locator('[data-dt-hd] tbody tr')).toHaveCount(withHd.hd);
  await expect(page.locator('[data-dt-hd] tbody [data-go^="hop-dong/"]').first()).toBeVisible();
  expect(page.errors).toEqual([]);
});
