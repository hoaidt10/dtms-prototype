// @ts-check
// T71 S10 (D-124): SX-17 Nhu cầu vật tư (MBOM × số lượng, tồn kho, còn thiếu, hạn đặt hàng; Thêm mới / Sửa / Xoá / Tạo từ MBOM) → Lập đề xuất mua sắm chọn sẵn;
// Góp ý 27/11: Lưu gọi API-01 tạo ĐXMS trên ĐTMS ngay (bỏ luồng SX-MS duyệt nội bộ), một mã ĐXMS; danh sách Gói thầu, hợp đồng đọc ngược ĐTMS.
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
  await expect(ncRow(page, 'DA-SX-2026-001', 'FPGA-XC7K325')).toContainText('ĐXMS-2026-0058');
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

test('Lập đề xuất từ nhu cầu: Lưu → tạo ĐXMS trên ĐTMS, nhu cầu chuyển Đã đề xuất', async ({ page }) => {
  await fresh(page, '#/sx/nhu-cau');
  await as(page, 'qt', '#/sx/nhu-cau');
  // Dòng VHT mua trực tiếp còn thiếu, chưa có đề xuất (chọn được) → Lập đề xuất mua sắm chọn sẵn.
  const sel = page.locator('[data-sxnc-sel]').first();
  const nc = await sel.getAttribute('data-sxnc-sel');
  const mat = await page.evaluate((c) => SxNc.all().find((r) => r.code === c).mat, nc);
  await sel.check();
  await page.locator('[data-sxnc-prop]').click();
  await expect(page.locator('.pg-title')).toContainText('Lập đề xuất mua sắm');
  await expect(page.locator('#sxm-title')).toHaveValue(/theo nhu cầu vật tư$/);
  await expect(page.locator(`[data-sxm-on="${mat}"]`)).toBeChecked();
  await page.locator('[data-sxm-form] button[type="submit"]').click();
  await expect(page).toHaveURL(/#\/sx\/mua-sam$/);
  const dx = await page.evaluate(() => SxMs.all()[0].code);
  expect(dx).toMatch(/^ĐXMS-2026-\d{4}$/);
  expect(await page.evaluate((c) => Flow.findDxms(c).src, dx)).toBe('SX');
  await expect(page.locator('.vtable tbody tr', { hasText: dx })).toContainText('Chưa khởi tạo');
  await as(page, 'qt', '#/sx/nhu-cau');
  await page.locator('[data-tkw]').fill(nc);
  await page.locator('[data-tkw]').press('Enter');
  const after = page.locator('.vtable tbody tr', { has: page.locator(`[data-sxnc-view="${nc}"]`) });
  await expect(after).toContainText('Đã đề xuất');
  await expect(after).toContainText(dx);
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
  await row(page, 'HĐ-2026-0019').locator('a.link', { hasText: 'ĐXMS-2026-0058' }).click();
  await expect(page.locator('main')).toContainText('Mua sắm vật tư leadtime dài VT-25 đợt 1');
  await as(page, 'sxk2', '#/sx/goi-thau-hd');
  await expect(page.locator('.vtable tbody tr.click')).not.toHaveCount(0);
  await expect(page.locator('.vtable tbody')).not.toContainText('DA-SX-2026-001');
  expect(page.errors).toEqual([]);
});
