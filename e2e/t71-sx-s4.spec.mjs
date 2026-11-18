// @ts-check
// T71 S4 (D-121 Q6): SX-10 đề xuất mua sắm từ sản xuất — MBOM dự toán, tồn kho, Gửi sang ĐTMS tạo ĐXMS thật; tab Mua sắm & hợp đồng đọc ngược ĐTMS (API-02/03/04).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };

test('SX-10 danh sách theo phạm vi vai; chi tiết đề xuất mẫu có tiến trình ĐTMS; tab Mua sắm & hợp đồng có hợp đồng, nhập kho', async ({ page }) => {
  await fresh(page, '#/sx/mua-sam');
  await as(page, 'sxpm', '#/sx/mua-sam');
  await expect(page.locator('.pg-title')).toContainText('Danh sách đề xuất mua sắm từ sản xuất');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody tr')).toContainText('ĐXMS-2026-0058');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await page.locator('.vtable tbody a.link').first().click();
  await expect(page.locator('[data-sxm-chain] tbody tr')).toHaveCount(5); // ĐXMS, KHLCNT, gói, hợp đồng, phiếu nhập kho
  await expect(page.locator('[data-sxm-chain]')).toContainText('HĐ-2026-0019');
  await expect(page.locator('[data-go$="/edit"]')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await as(page, 'sxk2', '#/sx/du-an/DA-SX-2026-003');
  await page.locator('[data-ttab="ms"]').click();
  await expect(page.locator('[data-sx-ms]')).toContainText('ĐXSX-2026-002');
  await expect(page.locator('[data-sx-ms]')).toContainText('51.600.000.000');
  await expect(page.locator('[data-sx-ms]')).toContainText('PNK-2026-0561');
  expect(page.errors).toEqual([]);
});

test('Sản phẩm chưa qua cổng chuyển giao thì chưa lập được đề xuất', async ({ page }) => {
  await fresh(page, '#/sx/mua-sam');
  // (b) Q2: Thêm mới dự án chỉ chọn sản phẩm đã chuyển giao; dữ liệu chuyển đổi (dự án TS-08 lập trước khi có hệ thống) vẫn bị chặn ở đề xuất mua sắm.
  await page.evaluate(() => localStorage.setItem('sx-proto-du-an', JSON.stringify({ created: [{ code: 'DA-SX-2026-005', name: 'Sản xuất TS-08', khoi: 'K1', basis: ['NV', 'QĐ 1/QĐ-VHT'], product: 'TS-08', version: 'v1.0_HW_Rev1',
    model: 'VHT_TU_SX', qty: 2, unitName: 'bộ', factory: null, pm: 'sxpm', start: '2026-12-01', end: '2027-09-30', status: 'PREPARING', perf: 0, cap: 1, baseline: '2026-11-10', creator: 'sxpm', created: '2026-11-01', docs: [], hist: [] }], edit: {}, docs: {}, hist: {} })));
  await page.reload();
  await as(page, 'sxpm', '#/sx/mua-sam/create/DA-SX-2026-005');
  await expect(page.locator('#sxm-title')).toHaveValue('Mua sắm vật tư sản xuất TS-08 — đợt 1');
  await page.locator('[data-sxm-save]').click();
  await expect(page.locator('.hd-alert.error')).toContainText('chưa có trong Kho sản phẩm sẵn sàng sản xuất');
  await expect(page).toHaveURL(/create\/DA-SX-2026-005$/);
  expect(page.errors).toEqual([]);
});

test('Cảnh C: lập đề xuất đợt 2 từ dự án, tra tồn kho, gửi phê duyệt, Lãnh đạo Khối duyệt → gửi sang ĐTMS tạo ĐXMS thật có nguồn Sản xuất; trạng thái đọc ngược', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="ms"]').click();
  await page.locator('[data-sx-ms] [data-go="sx/mua-sam/create/DA-SX-2026-001"]').click();
  await expect(page.locator('.pg-title')).toContainText('Lập đề xuất mua sắm');
  await expect(page.locator('[data-sxm-lines] tbody tr')).toHaveCount(6);
  await pick(page, 'sxm-dot', '2');
  await expect(page.locator('#sxm-title')).toHaveValue('Mua sắm vật tư sản xuất VT-25 — đợt 2');
  await expect(page.locator('[data-sxm-on]:checked')).toHaveCount(3); // leadtime dưới 16 tuần
  await page.locator('[data-sxm-stock]').click();
  await expect(page.locator('[data-sxm-lines] .cap')).toContainText('Tồn kho cập nhật');
  // Pin: nhu cầu 80, tồn 30 → đề xuất 50.
  await expect(page.locator('[data-sxm-qty="BAT-LI-12V"]')).toHaveValue('50');
  await expect(page.locator('[data-sxm-total]')).toHaveText('845.000.000');
  for (const c of ['PCB-VT25-MB', 'BAT-LI-12V', 'MECH-VT25']) await page.locator(`[data-sxm-on="${c}"]`).uncheck();
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await expect(page.locator('[data-sxm-lines] .t-err')).toContainText('Bạn cần chọn ít nhất một vật tư');
  await page.locator('[data-sxm-on="MECH-VT25"]').check();
  await page.locator('[data-sxm-qty="MECH-VT25"]').fill('20');
  await page.locator('[data-sxm-qty="MECH-VT25"]').press('Tab');
  await expect(page.locator('[data-sxm-total]')).toHaveText('196.000.000');
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await page.locator('.vmodal [data-sxm-send-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/mua-sam\/%C4%90XSX-2026-003$/);
  // T71 S10 (D-124): gửi phê duyệt trước, Lãnh đạo Khối duyệt thì hệ thống mới gửi sang ĐTMS.
  await expect(page.locator('.ginfo').first()).toContainText('Chờ phê duyệt');
  await expect(page.locator('[data-go$="/edit"]')).toHaveCount(0);
  await as(page, 'sxld', '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: 'Lãnh đạo Khối xem xét' }).first().click();
  await page.locator('[data-sx-do="0"]').click();
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxpm', '#/sx/mua-sam/' + encodeURIComponent('ĐXSX-2026-003'));
  await expect(page.locator('.ginfo').first()).toContainText('Đã gửi ĐTMS');
  await expect(page.locator('[data-sxm-chain]')).toContainText('Chưa khởi tạo');
  const dx = await page.evaluate(() => SxMs.byCode('ĐXSX-2026-003').dxms);
  expect(dx).toMatch(/^ĐXMS-2026-\d{4}$/);
  expect(await page.evaluate((c) => { const x = Flow.findDxms(c); return [x.src, x.sxProject, x.unit, x.est]; }, dx)).toEqual(['SX', 'DA-SX-2026-001', 'Trung tâm Sản xuất', 0.196]);
  await expect(page.locator('[data-go$="/edit"]')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Bên ĐTMS: Chi tiết ĐXMS ghi nguồn Phân hệ Quản lý sản xuất.
  await as(page, 'admin', '#/luong/' + encodeURIComponent(dx));
  await expect(page.locator('main')).toContainText('Phân hệ Quản lý sản xuất · DA-SX-2026-001');
  // Lịch sử dự án.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody tr').first()).toContainText('Gửi đề xuất mua sắm sang ĐTMS');
  expect(page.errors).toEqual([]);
});
