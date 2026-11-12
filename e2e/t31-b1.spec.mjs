// T31 B1 — K1 tìm kiếm nâng cao, K2 cột / Xuất Excel cho Danh sách KĐT (SCR-54) và Danh sách hồ sơ KĐT (SCR-75),
// theo IA-DXMS dòng 10–12, 19–21 (plan docs/dtms/prototype-T31-kdt-ia-chuan-bi.md §3; D-67). Giả lập P-190, P-191, P-192.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const rowCodes = (page) => page.locator('main .vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code).filter(Boolean));
const submit = (page) => page.locator('.adv button[type="submit"]').click({ force: true });
const dk = (s) => s.split('/').reverse().join('');

test('K1, K2: Danh sách KĐT — Khối → Đơn vị, Nhóm trạng thái, Ngày tạo; cột mới; Xuất Excel', async ({ page }) => {
  await fresh(page, '#/kdt');
  const ths = await page.locator('main .vtable thead th').allTextContents();
  expect(ths).toEqual(expect.arrayContaining(['Ngày gửi thẩm định', 'Người tạo', 'Ngày tạo']));

  const dl = page.waitForEvent('download');
  await page.locator('[data-kl="export"]').click();
  const file = await dl;
  expect(file.suggestedFilename()).toBe('danh-sach-khoan-dau-tu.csv');

  await page.locator('[data-kl="adv"]').click();
  await pick(page, 'kf-block', 'Khối 3');
  await page.locator('[data-vsel="kf-unit"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveText(['Nhà máy sản xuất thử nghiệm']);
  await page.keyboard.press('Escape');
  await submit(page);
  const k3 = await rowCodes(page);
  expect(k3).toContain('KĐT-2026-0033');
  const units = await page.evaluate((cs) => cs.map((c) => D.blockOf(Flow.findKdt(c).unit)), k3);
  expect(new Set(units)).toEqual(new Set(['Khối 3']));

  await page.locator('[data-kl="reset"]').click();
  await pick(page, 'kf-stGroup', 'idle');
  await submit(page);
  const idle = await rowCodes(page);
  expect(idle.length).toBeGreaterThan(0);
  const stages = await page.evaluate((cs) => cs.map((c) => Kdt.meta(Flow.findKdt(c)).stage), idle);
  // T45: Đã phê duyệt chủ trương (CT_OK) cũng là KĐT không có hồ sơ đang xử lý.
  for (const s of stages) expect(['NEW', 'CT_OK', 'OK', 'STOP']).toContain(s);

  await page.locator('[data-kl="reset"]').click();
  await page.locator('[data-kf="from"]').fill('15/09/2026');
  await submit(page);
  const late = await rowCodes(page);
  expect(late).toContain('KĐT-2026-0030');
  expect(late).not.toContain('KĐT-2026-0029');
  const created = await page.evaluate((cs) => cs.map((c) => Flow.findKdt(c).created), late);
  for (const c of created) expect(dk(c) >= '20260915').toBe(true);
  expect(page.errors).toEqual([]);
});

test('K1, K2: Danh sách hồ sơ KĐT — Số / Ngày tờ trình, lọc CQCM / Trạng thái với người thẩm định; Xuất Excel', async ({ page }) => {
  // T45 §1.7: #/ho-so-kdt chuyển sang Danh sách hồ sơ chủ trương KĐT (cột Phạm vi trước Tên hồ sơ → Số tờ trình ở cột 13).
  await fresh(page, '#/ho-so-kdt');
  await expect(page).toHaveURL(/#\/ho-so-ct-kdt$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách hồ sơ chủ trương KĐT');
  // T58: thêm hồ sơ mẫu → xem 50 bản ghi/trang để HS-2026-0027, 0030 cùng trang đầu.
  await page.locator('[data-ps-open]').first().click();
  await page.locator('[data-ps="50"]').first().click();
  await expect(page.locator('tr[data-code="HS-2026-0027"] td').nth(13)).toHaveText(/^027\/TTr-/);
  await expect(page.locator('tr[data-code="HS-2026-0030"] td').nth(13)).toHaveText('-');

  const reviewing = async () => {
    await page.locator('[data-hk="adv"]').click();
    await pick(page, 'hkf-rvSt', 'Đang xem');
    await page.keyboard.press('Escape'); // T56: form ngắn hơn (khoảng ngày gộp) — đóng panel chọn nhiều trước khi bấm Tìm kiếm
    await submit(page);
    const open = await rowCodes(page);
    const st = await page.evaluate((cs) => cs.map((c) => Kdt.reviewOf(Flow.kdtCases().find((x) => x.code === c)).some((r) => r.st === 'Đang xem')), open);
    expect(st.every(Boolean)).toBe(true);
    return open;
  };
  expect(await reviewing()).toContain('HS-2026-0024');
  // Hồ sơ phê duyệt KĐT đang thẩm định (vòng BM-03): HS-2026-0027-2; Số tờ trình theo mã hồ sơ.
  await page.evaluate(() => { location.hash = '#/ho-so-pd-kdt'; });
  await expect(page.locator('.pg-title')).toHaveText('Danh sách hồ sơ phê duyệt KĐT');
  expect(await reviewing()).toContain('HS-2026-0027-2');
  const dl2 = page.waitForEvent('download');
  await page.locator('[data-hk="export"]').click();
  expect((await dl2).suggestedFilename()).toBe('danh-sach-ho-so-phe-duyet-kdt.csv');
  // Quay lại danh sách chủ trương: bộ lọc nâng cao của từng danh sách giữ riêng (vẫn mở).
  await page.evaluate(() => { location.hash = '#/ho-so-ct-kdt'; });

  await page.locator('[data-hk="reset"]').click();
  await pick(page, 'hkf-cqcm', 'PC');
  await page.keyboard.press('Escape');
  await submit(page);
  const pc = await rowCodes(page);
  expect(pc).not.toContain('HS-2026-0030');
  expect(pc).toContain('HS-2026-0015');

  const dl = page.waitForEvent('download');
  await page.locator('[data-hk="export"]').click();
  expect((await dl).suggestedFilename()).toBe('danh-sach-ho-so-chu-truong-kdt.csv');
  expect(page.errors).toEqual([]);
});
