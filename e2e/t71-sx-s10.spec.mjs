// @ts-check
// T71 S10 (D-124): SX-17 Nhu cầu vật tư (MBOM × số lượng, tồn kho, còn thiếu, hạn đặt hàng; Thêm mới / Sửa / Xoá / Tạo từ MBOM) → Lập đề xuất mua sắm chọn sẵn;
// luồng SX-MS duyệt nội bộ (Từ chối bắt buộc lý do, sửa gửi lại; Duyệt → gửi sang ĐTMS tạo ĐXMS); danh sách Gói thầu, hợp đồng đọc ngược ĐTMS.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const row = (page, text) => page.locator('.vtable tbody tr', { hasText: text });
const ncRow = (page, project, mat) => page.locator('.vtable tbody tr', { hasText: project }).filter({ hasText: mat });
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};

test('Nhu cầu vật tư: còn thiếu, hạn đặt hàng, trạng thái theo đề xuất; sửa, thêm mới, xoá, tạo từ MBOM', async ({ page }) => {
  await fresh(page, '#/sx/nhu-cau');
  await as(page, 'sxpm', '#/sx/nhu-cau');
  await expect(page.locator('.pg-title')).toContainText('Danh sách nhu cầu vật tư');
  await expect(page.locator('.sb-nav [data-go="sx/nhu-cau"]')).toHaveClass(/active/);
  // Pin VT-25: nhu cầu 2 × 40 = 80, tồn 30, thiếu 50; dự án VMC tổng thầu, leadtime 12 tuần → mặc định Đối tác mua ((b) Q7).
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('80');
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('50');
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('Đối tác mua');
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V').locator('[data-sxnc-sel]')).toHaveCount(0);
  await expect(ncRow(page, 'DA-SX-2026-001', 'FPGA-XC7K325')).toContainText('Đã đề xuất');
  await expect(ncRow(page, 'DA-SX-2026-001', 'FPGA-XC7K325')).toContainText('ĐXSX-2026-001');
  await expect(ncRow(page, 'DA-SX-2026-001', 'FPGA-XC7K325').locator('[data-sxnc-sel]')).toHaveCount(0);
  await expect(ncRow(page, 'DA-SX-2026-001', 'FPGA-XC7K325').locator('[data-sxnc-del]')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Bấm dòng mở Xem chi tiết.
  await ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V').locator('td').nth(7).click();
  await expect(page.locator('.vmodal')).toContainText('Xem chi tiết nhu cầu vật tư');
  await page.locator('.vmodal [data-close]').first().click();
  // Sửa số lượng: thiếu tăng.
  // Sửa: số lượng và chuyển sang VHT mua trực tiếp → ngày cần đã qua hạn đặt hàng.
  await ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V').locator('[data-sxnc-edit]').click();
  await page.locator('.vmodal [data-ef="ncQty"]').fill('90');
  await page.locator('.vmodal [data-vsel="ef-ncBuyer"]').click(); await page.locator('.vsel-panel [data-opt="VHT"]').click();
  await page.locator('.vmodal #ok').click();
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('60');
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('Trễ hạn đặt hàng');
  // Khối 2: thêm mới dòng cho dự án chưa có nhu cầu, xoá; tạo từ MBOM thêm phần còn lại.
  await as(page, 'sxk2', '#/sx/nhu-cau');
  const n0 = await page.locator('.vtable tbody tr.click').count();
  await page.locator('[data-sxnc-add]').click();
  await page.locator('.vmodal [data-vsel="ef-ncMat"]').click();
  await page.locator('.vsel-panel [data-opt^="DA-SX-2026-004|"]').first().click();
  await page.locator('.vmodal [data-ef="ncQty"]').fill('3000');
  await page.locator('.vmodal [data-ef="ncNeed"]').fill('01/02/2027');
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(n0 + 1);
  await expect(row(page, 'NCVT-004-01')).toContainText('01/02/2027');
  await row(page, 'NCVT-004-01').locator('[data-sxnc-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(n0);
  await page.locator('[data-sxnc-mbom]').click();
  await page.locator('.vmodal [data-vsel="ef-ncProject"]').click();
  await page.locator('.vsel-panel [data-opt="DA-SX-2026-004"]').click();
  await page.locator('.vmodal #ok').click();
  const added = await page.evaluate(() => SxNc.all().filter((r) => r.project === 'DA-SX-2026-004').length);
  expect(added).toBeGreaterThan(0);
  expect(page.errors).toEqual([]);
});

test('Lập đề xuất từ nhu cầu; Lãnh đạo Khối từ chối (bắt buộc lý do), sửa gửi lại, duyệt → gửi sang ĐTMS', async ({ page }) => {
  await fresh(page, '#/sx/nhu-cau');
  await as(page, 'sxpm', '#/sx/nhu-cau');
  // Dự án VMC: pin, vỏ cơ khí mặc định đối tác mua — chuyển sang VHT mua trực tiếp để lập đề xuất.
  for (const mat of ['BAT-LI-12V', 'MECH-VT25']) {
    await ncRow(page, 'DA-SX-2026-001', mat).locator('[data-sxnc-edit]').click();
    await page.locator('.vmodal [data-vsel="ef-ncBuyer"]').click(); await page.locator('.vsel-panel [data-opt="VHT"]').click();
    await page.locator('.vmodal #ok').click();
  }
  await ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V').locator('[data-sxnc-sel]').check();
  // Hai dự án khác nhau → cảnh báo; bỏ dòng thứ hai.
  await ncRow(page, 'DA-SX-2026-002', 'IR-DET-640').locator('[data-sxnc-sel]').check();
  await page.locator('[data-sxnc-prop]').click();
  await expect(page.locator('.toast').last()).toContainText('cùng một dự án');
  await ncRow(page, 'DA-SX-2026-002', 'IR-DET-640').locator('[data-sxnc-sel]').uncheck();
  await ncRow(page, 'DA-SX-2026-001', 'MECH-VT25').locator('[data-sxnc-sel]').check();
  await expect(page.locator('[data-sxnc-prop]')).toContainText('(2)');
  await page.locator('[data-sxnc-prop]').click();
  await expect(page.locator('.pg-title')).toContainText('Lập đề xuất mua sắm');
  await expect(page.locator('#sxm-title')).toHaveValue('Mua sắm vật tư sản xuất VT-25 theo nhu cầu vật tư');
  await expect(page.locator('[data-sxm-on]:checked')).toHaveCount(2);
  await expect(page.locator('[data-sxm-qty="BAT-LI-12V"]')).toHaveValue('50');
  await expect(page.locator('[data-sxm-qty="MECH-VT25"]')).toHaveValue('40');
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await expect(page.locator('.vmodal')).toContainText('Gửi phê duyệt đề xuất');
  await page.locator('.vmodal [data-sxm-send-ok]').click();
  await expect(page.locator('[data-sxm-detail] .ginfo').first()).toContainText('Chờ phê duyệt');
  await expect(page.locator('[data-sxm-hs]')).toContainText('Lãnh đạo Khối xem xét');
  await expect(page.locator('[data-sxm-submit]')).toHaveCount(0);
  await as(page, 'sxpm', '#/sx/nhu-cau');
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('Đang đề xuất');
  // Lãnh đạo Khối từ chối: lý do bắt buộc.
  await openTask(page, 'sxld', 'Lãnh đạo Khối xem xét');
  await expect(page.locator('[data-sxm-detail]')).toContainText('BAT-LI-12V');
  await page.locator('[data-sx-do="1"]').click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal')).toContainText('Lý do từ chối');
  await page.locator('.vmodal [data-ef="ykNoiDung"]').fill('Gộp vỏ cơ khí vào đợt 2 cùng bo mạch.');
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxpm', '#/sx/mua-sam/' + encodeURIComponent('ĐXSX-2026-003'));
  await expect(page.locator('[data-sxm-detail] .ginfo').first()).toContainText('Bị từ chối');
  await expect(page.locator('.hd-alert.error')).toContainText('Gộp vỏ cơ khí vào đợt 2');
  // Sửa: bỏ vỏ cơ khí, gửi lại.
  await page.locator('[data-go$="/edit"]').click();
  await page.locator('[data-sxm-on="MECH-VT25"]').uncheck();
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await page.locator('.vmodal [data-sxm-send-ok]').click();
  await expect(page.locator('[data-sxm-detail] .ginfo').first()).toContainText('Chờ phê duyệt');
  await openTask(page, 'sxld', 'Lãnh đạo Khối xem xét');
  await page.locator('[data-sx-do="0"]').click();
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxpm', '#/sx/mua-sam/' + encodeURIComponent('ĐXSX-2026-003'));
  await expect(page.locator('[data-sxm-detail] .ginfo').first()).toContainText('Đã gửi ĐTMS');
  await expect(page.locator('[data-sxm-detail] .ginfo').first()).toContainText('Nguyễn Hữu Phong');
  await expect(page.locator('[data-sxm-hs]')).toContainText('Kết thúc — đề xuất đã gửi sang ĐTMS');
  await expect(page.locator('[data-sxm-chain]')).toContainText('Chưa khởi tạo');
  const dx = await page.evaluate(() => SxMs.byCode('ĐXSX-2026-003').dxms);
  expect(await page.evaluate((c) => { const x = Flow.findDxms(c); return [x.src, x.sxProject]; }, dx)).toEqual(['SX', 'DA-SX-2026-001']);
  await as(page, 'sxpm', '#/sx/nhu-cau');
  await expect(ncRow(page, 'DA-SX-2026-001', 'BAT-LI-12V')).toContainText('Đã đề xuất');
  await expect(ncRow(page, 'DA-SX-2026-001', 'MECH-VT25')).toContainText('Trễ hạn đặt hàng');
  // Lịch sử dự án có từ chối, duyệt, gửi ĐTMS.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody')).toContainText('Từ chối đề xuất mua sắm');
  await expect(page.locator('main .vtable tbody')).toContainText('Duyệt đề xuất mua sắm');
  await expect(page.locator('main .vtable tbody')).toContainText('Gửi đề xuất mua sắm sang ĐTMS');
  expect(page.errors).toEqual([]);
});

test('Gói thầu, hợp đồng: đọc ngược ĐTMS theo phạm vi vai, mở đề xuất nguồn', async ({ page }) => {
  await fresh(page, '#/sx/goi-thau-hd');
  await as(page, 'sxpm', '#/sx/goi-thau-hd');
  await expect(page.locator('.pg-title')).toContainText('Danh sách gói thầu, hợp đồng');
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(2);
  await expect(row(page, 'GT-2026-0008')).toContainText('Gói thầu');
  await expect(row(page, 'HĐ-2026-0019')).toContainText('14.650.000.000');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await row(page, 'HĐ-2026-0019').locator('a.link', { hasText: 'ĐXSX-2026-001' }).click();
  await expect(page.locator('[data-sxm-detail]')).toContainText('Mua sắm vật tư leadtime dài VT-25 đợt 1');
  await as(page, 'sxk2', '#/sx/goi-thau-hd');
  await expect(page.locator('.vtable tbody tr.click')).not.toHaveCount(0);
  await expect(page.locator('.vtable tbody')).not.toContainText('DA-SX-2026-001');
  expect(page.errors).toEqual([]);
});
