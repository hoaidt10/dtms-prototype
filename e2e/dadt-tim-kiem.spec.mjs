// Rà tìm kiếm nâng cao Danh sách đề tài / dự án (SRS-DADT DTMS_CN_0240 V1.3, 11/11/2026): giá trị ô lọc lấy từ Danh mục dùng chung
// (SCR-110 Cấp phê duyệt, SCR-111 Loại, SCR-112 Loại chi tiết có Loại cha, SCR-32 Nguồn vốn), chọn nhiều, ô ngày có kiểm tra,
// Còn khoản mục chưa đóng, lọc Mật theo quyền, từ khóa luôn hiện, nút ghi số điều kiện, Đặt lại.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const as = (page, id) => page.evaluate((p) => { window.Flow.setPersona(p); }, id);
const codes = async (page) => (await page.locator('[data-dt-list] tbody tr td:nth-child(4)').allInnerTexts()).sort();
const opts = async (page, id) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  const t = await page.locator('.vsel-panel [data-opt]').allInnerTexts();
  await page.locator('.pg-title').click();
  return t.map((x) => x.trim());
};
const pick = async (page, id, ...values) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  for (const v of values) await page.locator(`.vsel-panel [data-opt="${v}"]`).click();
  await page.locator('.pg-title').click();
};
const search = (page) => page.locator('.adv button[type="submit"]').click();

test('ô lọc lấy giá trị từ danh mục, Loại → Loại chi tiết chọn nhiều, Nguồn vốn có giá trị ngừng sử dụng', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'lan');
  await page.locator('[data-dt="adv"]').click();
  expect(await opts(page, 'dtf-level')).toEqual(['Tổng Công ty', 'Tập đoàn']);
  expect(await opts(page, 'dtf-loai')).toEqual(['SXKD', 'Dự án đầu tư', 'KHCN', 'Hoạt động TX', 'Dự án đầu tư khác', 'Dự án kinh doanh khác']);
  expect(await opts(page, 'dtf-loaiCt')).toHaveLength(14);
  expect(await opts(page, 'dtf-fund')).toContain('Vốn vay (ngừng sử dụng)');
  expect(await opts(page, 'dtf-src')).toEqual(['Đồng bộ KHCN', 'Đồng bộ HR Tool', 'Chuyển từ hệ thống cũ']);
  // AC-0240-04: KHCN + SXKD → 7 + 3 giá trị; AC-0240-05: bỏ SXKD thì Dự án Kinh doanh bị bỏ chọn.
  await pick(page, 'dtf-loai', 'KHCN', 'SXKD');
  expect(await opts(page, 'dtf-loaiCt')).toHaveLength(10);
  await pick(page, 'dtf-loaiCt', 'Dự án Kinh doanh');
  await pick(page, 'dtf-loai', 'SXKD');
  await expect(page.locator('[data-vsel="dtf-loaiCt"] .vsel-label')).toHaveClass(/ph/);
  // Danh mục thêm giá trị → ô lọc có ngay (AC-0240-27).
  await page.evaluate(() => { window.Catalog.rows('cap-phe-duyet').push({ id: 9, code: 'KHAC', name: 'Cấp khác', active: true, used: 0 }); window.App.render(); });
  expect(await opts(page, 'dtf-level')).toContain('Cấp khác');
  // Tên Nguồn vốn ở danh sách theo danh mục SCR-32 (mã VCSH).
  await page.locator('[data-dt="reset"]').click();
  await pick(page, 'dtf-fund', 'VCSH');
  await search(page);
  await expect(page.locator('[data-dt-list] tbody tr td:nth-child(8)').first()).toHaveText('Vốn góp của chủ sở hữu');
  expect(page.errors).toEqual([]);
});

test('từ khóa áp cùng điều kiện, nút ghi số điều kiện, ô ngày kiểm tra, Còn khoản mục chưa đóng, Đặt lại', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'lan');
  await page.locator('[data-dt="adv"]').click();
  await expect(page.locator('#dt-kw')).toBeVisible();
  // AC-0240-17: chọn Nguồn dữ liệu, nhấn Enter ở từ khóa → áp cả hai.
  await pick(page, 'dtf-src', 'Đồng bộ HR Tool');
  await page.locator('#dt-kw').fill('5G');
  await page.locator('#dt-kw').press('Enter');
  expect(await codes(page)).toEqual(['005-26-VHT-BP-M', '020-26-VHT-BP-C', 'DA-2026-002']);
  await page.locator('[data-dt="adv"]').click();
  await expect(page.locator('[data-dt="adv"]')).toHaveText('Tìm kiếm nâng cao (1)');
  // AC-0240-07: Đến < Từ → lỗi tại ô, không tìm.
  await page.locator('[data-dt="adv"]').click();
  await page.locator('[data-dtf="from"]').fill('01052026');
  await expect(page.locator('[data-dtf="from"]')).toHaveValue('01/05/2026');
  await page.locator('[data-dtf="to"]').fill('30/04/2026');
  await search(page);
  await expect(page.locator('.vfield.invalid .msg')).toHaveText('Đến ngày phải lớn hơn hoặc bằng Từ ngày.');
  expect(await codes(page)).toEqual(['005-26-VHT-BP-M', '020-26-VHT-BP-C', 'DA-2026-002']);
  // Đặt lại: xoá từ khóa và điều kiện.
  await page.locator('[data-dt="reset"]').click();
  await expect(page.locator('#dt-kw')).toHaveValue('');
  // AC-0240-22: chỉ đề tài đã kết thúc còn khoản mục Chi mua sắm chưa đóng.
  await page.locator('[data-dt-open]').check();
  await search(page);
  expect(await codes(page)).toEqual(['020-26-VHT-BP-C']);
  expect(page.errors).toEqual([]);
});

test('lọc DA Mật / Không Mật chỉ có với người được xem đề tài Mật (AC-0240-12, 13)', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'minh');
  await page.locator('[data-dt="adv"]').click();
  await expect(page.locator('[data-vsel="dtf-secret"]')).toHaveCount(0);
  await as(page, 'lan');
  await pick(page, 'dtf-secret', 'Mật');
  await search(page);
  expect(await codes(page)).toEqual(['NV-KHCN-2026-006']);
  expect(page.errors).toEqual([]);
});

test('Số ngày tô màu, Hoàn thành hiện "-", nhãn Không còn ở nguồn, Mã cũ (AC-0240-09, 23, 24; DTMS_CN_0242 ô 4)', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'lan');
  const row = (code) => page.locator('[data-dt-list] tbody tr', { has: page.locator(`a:text-is("${code}")`) });
  await expect(row('KHN-2026-TTVT').locator('td:nth-child(12)')).toHaveClass(/dt-day-yellow/);
  await expect(row('020-26-VHT-BP-C').locator('td:nth-child(12)')).toHaveText('-');
  await page.locator('#dt-kw').fill('004-26');
  await page.locator('#dt-kw').press('Enter');
  await expect(row('004-26-VHT-RDP-DS').locator('td:nth-child(13)')).toContainText('Không còn ở nguồn');
  await page.locator('#dt-kw').fill('005-25');
  await page.locator('#dt-kw').press('Enter');
  expect(await codes(page)).toEqual(['005-26-VHT-BP-M']);
  await page.locator('[data-dt-list] tbody a').first().click();
  await expect(page.locator('main .ginfo').first()).toContainText('Mã cũ: 005-25-VHT-BP-M');
  expect(page.errors).toEqual([]);
});

