// @ts-check
// T71 S4 (D-121 Q6): SX-10 đề xuất mua sắm từ sản xuất — MBOM dự toán, tồn kho; tab Mua sắm & hợp đồng đọc ngược ĐTMS (API-02/03/04).
// Góp ý 27/11: Lưu gọi API-01 tạo ĐXMS trên ĐTMS ngay (bỏ duyệt SX-MS); một mã (mã ĐXMS), một tên; cột Trạng thái gửi ĐTMS và Trạng thái phê duyệt.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };

test('SX-10 danh sách: một mã ĐXMS một tên, Trạng thái gửi ĐTMS / Trạng thái phê duyệt; ĐXMS mở Chi tiết ĐTMS; tab Mua sắm & hợp đồng có hợp đồng, nhập kho', async ({ page }) => {
  await fresh(page, '#/sx/mua-sam');
  await as(page, 'sxpm', '#/sx/mua-sam');
  await expect(page.locator('.pg-title')).toContainText('Danh sách đề xuất mua sắm từ sản xuất');
  await expect(page.locator('.vtable thead')).toContainText('Trạng thái gửi ĐTMS');
  await expect(page.locator('.vtable thead')).toContainText('Trạng thái phê duyệt');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('main')).not.toContainText('ĐXSX');
  const ok = page.locator('.vtable tbody tr', { hasText: 'ĐXMS-2026-0058' });
  await expect(ok).toContainText('Đã gửi');
  await expect(ok).toContainText('Đã phê duyệt');
  await expect(ok.locator('[data-sxm-del], [data-go$="/edit"]')).toHaveCount(0); // đã vào quy trình phê duyệt ĐTMS
  const err = page.locator('.vtable tbody tr', { hasText: 'Chưa có mã ĐXMS' });
  await expect(err).toContainText('Gửi lỗi');
  await expect(err.locator('[data-sxm-resend]')).toHaveCount(1);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // ĐXMS mở thẳng Chi tiết đề xuất mua sắm của ĐTMS (nguồn Phân hệ Quản lý sản xuất).
  await ok.locator('a.link').first().click();
  await expect(page.locator('main')).toContainText('Phân hệ Quản lý sản xuất · DA-SX-2026-001');
  await as(page, 'sxk2', '#/sx/du-an/DA-SX-2026-003');
  await page.locator('[data-ttab="ms"]').click();
  await expect(page.locator('[data-sx-ms]')).toContainText('ĐXMS-2026-0066');
  await expect(page.locator('[data-sx-ms]')).toContainText('Trạng thái phê duyệt');
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
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await expect(page.locator('.hd-alert.error')).toContainText('chưa có trong Kho sản phẩm sẵn sàng sản xuất');
  await expect(page).toHaveURL(/create\/DA-SX-2026-005$/);
  expect(page.errors).toEqual([]);
});

test('Cảnh C: lập đề xuất đợt 2 từ dự án, tra tồn kho, Lưu → tạo ĐXMS trên ĐTMS (nguồn Sản xuất); sửa, xoá khi ĐXMS Chưa khởi tạo; gửi lại đề xuất gửi lỗi', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="ms"]').click();
  await page.locator('[data-sx-ms] [data-go="sx/mua-sam/create/DA-SX-2026-001"]').click();
  await expect(page.locator('.pg-title')).toContainText('Lập đề xuất mua sắm');
  await expect(page.locator('[data-sxm-form]')).toContainText('Mã ĐXMS');
  await expect(page.locator('[data-sxm-form]')).toContainText('Tên đề xuất mua sắm');
  await expect(page.locator('[data-sxm-save], [data-sxm-submit]')).toHaveCount(0); // không còn Lưu nháp / Gửi phê duyệt nội bộ
  await expect(page.locator('[data-sxm-lines] tbody tr')).toHaveCount(6);
  await pick(page, 'sxm-dot', '2');
  await expect(page.locator('#sxm-title')).toHaveValue('Mua sắm vật tư sản xuất VT-25 — đợt 2');
  await expect(page.locator('[data-sxm-on]:checked')).toHaveCount(3); // leadtime dưới 16 tuần
  await page.locator('[data-sxm-stock]').click();
  await expect(page.locator('[data-sxm-lines] .cap')).toContainText('Tồn kho cập nhật');
  await expect(page.locator('[data-sxm-qty="BAT-LI-12V"]')).toHaveValue('50'); // nhu cầu 80, tồn 30
  await expect(page.locator('[data-sxm-total]')).toHaveText('845.000.000');
  for (const c of ['PCB-VT25-MB', 'BAT-LI-12V', 'MECH-VT25']) await page.locator(`[data-sxm-on="${c}"]`).uncheck();
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await expect(page.locator('[data-sxm-lines] .t-err')).toContainText('Bạn cần chọn ít nhất một vật tư');
  await page.locator('[data-sxm-on="MECH-VT25"]').check();
  await page.locator('[data-sxm-qty="MECH-VT25"]').fill('20');
  await page.locator('[data-sxm-qty="MECH-VT25"]').press('Tab');
  await expect(page.locator('[data-sxm-total]')).toHaveText('196.000.000');
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  // Lưu = gọi API tạo ĐXMS trên ĐTMS ngay; về danh sách.
  await expect(page).toHaveURL(/#\/sx\/mua-sam$/);
  const dx = await page.evaluate(() => SxMs.all().find((x) => x.title === 'Mua sắm vật tư sản xuất VT-25 — đợt 2').code);
  expect(dx).toMatch(/^ĐXMS-2026-\d{4}$/);
  expect(await page.evaluate((c) => { const x = Flow.findDxms(c); return [x.src, x.sxProject, x.unit, x.est]; }, dx)).toEqual(['SX', 'DA-SX-2026-001', 'Trung tâm Sản xuất', 0.196]);
  const r = page.locator('.vtable tbody tr', { hasText: dx });
  await expect(r).toContainText('Đã gửi');
  await expect(r).toContainText('Chưa khởi tạo');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Sửa (ĐXMS còn Chưa khởi tạo) → cập nhật ĐXMS trên ĐTMS.
  await r.locator('[data-go$="/edit"]').click();
  await expect(page.locator('[data-sxm-form] input[disabled]').first()).toHaveValue(dx);
  await page.locator('#sxm-title').fill('Mua sắm vỏ cơ khí VT-25 đợt 2');
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await expect(page).toHaveURL(/#\/sx\/mua-sam$/);
  expect(await page.evaluate((c) => Flow.findDxms(c).title, dx)).toBe('Mua sắm vỏ cơ khí VT-25 đợt 2');
  // Bên ĐTMS: Chi tiết ĐXMS ghi nguồn Phân hệ Quản lý sản xuất, không còn mã đề xuất riêng.
  await as(page, 'admin', '#/luong/' + encodeURIComponent(dx));
  await expect(page.locator('main')).toContainText('Phân hệ Quản lý sản xuất · DA-SX-2026-001');
  await expect(page.locator('main')).not.toContainText('ĐXSX');
  // Gửi lại đề xuất gửi lỗi → có mã ĐXMS.
  await as(page, 'sxpm', '#/sx/mua-sam');
  await page.locator('.vtable tbody tr', { hasText: 'Chưa có mã ĐXMS' }).locator('[data-sxm-resend]').click();
  await expect(page).toHaveURL(/#\/sx\/mua-sam$/);
  await expect(page.locator('.vtable tbody tr', { hasText: 'Mua sắm bổ sung đầu nối' })).toContainText(/ĐXMS-2026-\d{4}/);
  await expect(page.locator('.vtable tbody')).not.toContainText('Gửi lỗi');
  // Xoá → xoá ĐXMS trên ĐTMS.
  await page.locator('.vtable tbody tr', { hasText: dx }).locator('[data-sxm-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('.vtable tbody')).not.toContainText(dx);
  expect(await page.evaluate((c) => !!Flow.findDxms(c), dx)).toBe(false);
  // Lịch sử dự án.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody')).toContainText('Lập đề xuất mua sắm (tạo ĐXMS trên ĐTMS)');
  expect(page.errors).toEqual([]);
});
