// @ts-check
// T71 S8 (D-121): SX-12 chất lượng & nghiệm thu — tra cứu theo số sê-ri, luồng SX-NT (OQC, biên bản, chứng chỉ, nhập kho), OQC không đạt lập phiếu bất thường, chặn nhập kho khi chưa có biên bản.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const ok = (page) => page.locator('.vmodal #ok').click();
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const done = (page) => expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
const find = async (page, s) => { await page.locator('#sxnt-seri').fill(s); await page.locator('[data-sxnt-find]').click(); };

test('SX-12 danh sách và tra cứu số sê-ri: lô, chứng chỉ, phiếu nhập kho, ECN đã áp dụng', async ({ page }) => {
  await fresh(page, '#/sx/nghiem-thu');
  await as(page, 'sxqa', '#/sx/nghiem-thu');
  await expect(page.locator('.pg-title')).toContainText('Nghiệm thu sản phẩm');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(5);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await find(page, 'WM6-045120');
  await expect(page.locator('[data-sxnt-res]')).toContainText('NT-2026-003');
  await expect(page.locator('[data-sxnt-res]')).toContainText('CQ-2026-0132');
  await expect(page.locator('[data-sxnt-res]')).toContainText('PNK-2026-0508');
  await find(page, 'WM6-099999');
  await expect(page.locator('[data-sxnt-res]')).toContainText('Không tìm thấy số sê-ri WM6-099999');
  // VT-25: ECN-2026-001 áp dụng từ sê-ri VT25-0009.
  await find(page, 'VT25-0010');
  await expect(page.locator('[data-sxnt-res]')).toContainText('ECN-2026-001');
  await find(page, 'VT25-0005');
  await expect(page.locator('[data-sxnt-res]')).not.toContainText('ECN-2026-001');
  expect(page.errors).toEqual([]);
});

test('Luồng nghiệm thu đạt: OQC, biên bản, Lãnh đạo cấp chứng chỉ, nhập kho; chưa có biên bản thì chặn nhập kho', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  expect(await page.evaluate(() => SxFlow.GUARD['nt.minutes']({ obj: 'NT-2026-005' }))).toContain('chưa đề nghị nhập kho được');
  await openTask(page, 'sxqa', 'Đánh giá chất lượng xuất xưởng');
  await page.locator('[data-sx-do]', { hasText: 'Đạt' }).first().click();
  await page.locator('.vmodal [data-ef="oqcMau"]').fill('12 / 12 bộ');
  await page.locator('.vmodal [data-ef="oqcKetQua"]').fill('Đạt toàn bộ chỉ tiêu.');
  await ok(page); await done(page);
  await openTask(page, 'sxqa', 'Lập biên bản nghiệm thu');
  await page.locator('[data-sx-do]').click();
  await page.locator('.vmodal [data-ef="bbNgay"]').fill('16/11/2026');
  await page.locator('.vmodal [data-ef="bbNgay"]').press('Tab');
  await page.locator('.vmodal [data-ef="bbSo"]').fill('85/BB-NT');
  await page.locator('.vmodal [data-ef="bbKetLuan"]').fill('Đồng ý nghiệm thu 12 bộ đợt 1.');
  await page.locator('.vmodal [data-ef-file="bbFile"]').setInputFiles({ name: 'BB.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await page.locator('.vmodal [data-ef-file="bbHoc"]').setInputFiles({ name: 'HOC.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await ok(page); await done(page);
  await openTask(page, 'sxld', 'Phê duyệt nghiệm thu');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await ok(page); await page.locator('.vmodal [data-mysign-ok]').click(); await done(page);
  expect(await page.evaluate(() => SxNt.byCode('NT-2026-005').cert)).toBe('CQ-2026-0151');
  await openTask(page, 'sxpm', 'Bao gói, nghiệm thu sau bao gói');
  await page.locator('[data-sx-do]').click();
  await page.locator('.vmodal [data-ef-chk="nkBaoGoi"]').check();
  await page.locator('.vmodal [data-ef-file="nkBbBaoGoi"]').setInputFiles({ name: 'BB-bao-goi.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await page.locator('.vmodal [data-ef="nkKho"]').fill('Kho thành phẩm Tổng công ty');
  await ok(page); await done(page);
  expect(await page.evaluate(() => { const x = SxNt.byCode('NT-2026-005'); return [x.pnk, x.stocked]; })).toEqual(['PNK-2026-0562', '2026-11-16']);
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="nt"]').click();
  await expect(page.locator('[data-sx-nt] tbody tr', { hasText: 'NT-2026-005' })).toContainText('Đã nhập kho');
  await expect(page.locator('[data-sx-nt]')).toContainText('IQC-2026-0901');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Nhà máy đề nghị nghiệm thu lô 5: vượt số đã sản xuất bị chặn; OQC không đạt lập phiếu bất thường', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxnm', '#/sx/du-an/DA-SX-2026-003');
  await page.locator('[data-ttab="nt"]').click();
  await page.locator('[data-sxnt-new="DA-SX-2026-003"]').click();
  await page.locator('.vmodal [data-ef="ntQty"]').fill('13000');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('vượt số đã sản xuất chưa nghiệm thu (12.000');
  await page.locator('.vmodal [data-ef="ntQty"]').fill('6000');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/nghiem-thu\/NT-2026-006$/);
  await expect(page.locator('.ginfo')).toContainText('WM6-080001 – WM6-086000');
  await openTask(page, 'sxqa', 'Đánh giá chất lượng xuất xưởng');
  await page.locator('[data-sx-do]', { hasText: 'Không đạt' }).click();
  await page.locator('.vmodal [data-ef="oqcMau"]').fill('200 / 6.000 (AQL 0,65)');
  await page.locator('.vmodal [data-ef="oqcKetQua"]').fill('5 thiết bị mất kết nối Wi-Fi sau 30 phút.');
  await ok(page); await done(page);
  expect(await page.evaluate(() => { const x = SxNt.byCode('NT-2026-006'); return [x.oqc, x.issue]; })).toEqual(['NOK', 'BT-2026-005']);
  await as(page, 'sxk2', '#/sx/bat-thuong/BT-2026-005');
  await expect(page.locator('.ginfo')).toContainText('Chờ tiếp nhận');
  await expect(page.locator('.ginfo')).toContainText('không đạt đánh giá xuất xưởng');
  await as(page, 'sxk2', '#/sx/nghiem-thu/NT-2026-006');
  await page.locator('[data-ttab="tt"]').click();
  await expect(page.locator('main')).toContainText('đã lập phiếu bất thường');
  expect(page.errors).toEqual([]);
});
