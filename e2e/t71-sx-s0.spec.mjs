// @ts-check
// T71 S0 (D-121): phân hệ Quản lý sản xuất — thẻ ở Danh sách Phân hệ, sidebar riêng, vai Sản xuất, danh mục SX-13 trong Danh mục dùng chung.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;

test('Vào phân hệ từ Danh sách Phân hệ: topbar QLSX, sidebar đủ mục, mục chưa dựng mở Đang phát triển', async ({ page }) => {
  await fresh(page, '#/phan-he');
  await expect(page.locator('.ss-card h2', { hasText: 'Quản lý sản xuất' })).toHaveCount(1);
  await page.locator('[data-ss="production"]').click();
  await expect(page).toHaveURL(/#\/sx\/tong-quan$/);
  await expect(page.locator('.topbar .brand-text')).toContainText('QLSX');
  await expect(page.locator('.sb-head .t')).toHaveText('Quản lý sản xuất');
  await expect(page.locator('.sb-nav .nav .l')).toHaveText(['Việc của tôi', 'Công việc', 'Việc cá nhân', 'Nhiệm vụ đơn vị', 'Tổng quan', 'Dự án sản xuất', 'Chuyển giao từ nghiên cứu', 'Hồ sơ chuyển giao',
    'Sản phẩm sẵn sàng sản xuất', 'Cung ứng vật tư', 'Nhu cầu vật tư', 'Đề xuất mua sắm', 'Gói thầu, hợp đồng', 'Bất thường sản xuất', 'Thay đổi kỹ thuật', 'Nghiệm thu sản phẩm', 'Hồ sơ, tài liệu', 'Báo cáo']);
  await expect(page.locator('.sb-nav [data-go="sx/tong-quan"]')).toHaveClass(/active/);
  await expect(page.locator('main')).toContainText('Tính năng đang được phát triển');
  await expect(page.locator('main .foot')).toContainText('Hệ thống Quản lý sản xuất');
  for (const p of ['sx/du-an', 'sx/chuyen-giao', 'sx/bat-thuong']) {
    await page.locator(`.sb-nav [data-go="${p}"]`).click();
    await expect(page.locator(`.sb-nav [data-go="${p}"]`)).toHaveClass(/active/);
    await expect(page.locator('.sb-head .t')).toHaveText('Quản lý sản xuất');
  }
  await page.locator('.sb-nav [data-toggle="Báo cáo"]').click();
  await page.locator('.sb-nav [data-go="sx/bao-cao/tien-do"]').click();
  await expect(page.locator('.sb-nav [data-go="sx/bao-cao/tien-do"]')).toHaveClass(/active/);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(await page.locator('.sidebar').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Đổi tài khoản trong phân hệ Sản xuất: chỉ vai Sản xuất + quản trị; ở ĐTMS không thấy vai Sản xuất', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await page.locator('#who').click();
  const names = await page.locator('.menu-pop [data-persona]').evaluateAll((els) => els.map((e) => e.getAttribute('data-persona')));
  expect(names).toEqual(expect.arrayContaining(['sxld', 'sxpm', 'sxsub', 'sxrd', 'sxqa', 'sxk2', 'sxnm', 'sxkd', 'qt', 'admin']));
  expect(names).not.toContain('minh');
  await page.locator('.menu-pop [data-persona="sxpm"]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await expect(page.locator('.topbar .who')).toContainText('Trần Quốc Việt');
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await page.locator('#who').click();
  const dtms = await page.locator('.menu-pop [data-persona]').evaluateAll((els) => els.map((e) => e.getAttribute('data-persona')));
  expect(dtms).toContain('minh');
  expect(dtms).not.toContain('sxpm');
  expect(page.errors).toEqual([]);
});

test('Danh mục SX-13 trong Danh mục dùng chung: nhóm Quản lý sản xuất 5 danh mục, mở được, số bản ghi theo nguồn', async ({ page }) => {
  await fresh(page, '#/dmdc');
  await page.evaluate(() => Flow.setPersona('qt'));
  await page.evaluate(() => App.render());
  await expect(page.locator('.sb-nav .nav', { hasText: 'Quản lý sản xuất' })).toHaveCount(1);
  const keys = ['sx-bat-thuong', 'sx-ho-so-chuyen-giao', 'sx-cap-duyet', 'sx-don-vi', 'sx-mo-hinh', 'sx-bieu-mau']; // T71 S11: + Biểu mẫu tài liệu
  const counts = { 'sx-bat-thuong': 3, 'sx-ho-so-chuyen-giao': 47, 'sx-cap-duyet': 4, 'sx-don-vi': 5, 'sx-mo-hinh': 3, 'sx-bieu-mau': 9 };
  for (const k of keys) {
    await page.evaluate((h) => { location.hash = h; }, '#/dmdc/' + k);
    await expect(page.locator(`.sb-nav [data-go="dmdc/${k}"]`)).toHaveClass(/active/);
    expect(await page.evaluate((key) => Catalog.rows(key).length, k)).toBe(counts[k]);
    await expect(page.locator('main table tbody tr').first()).toBeVisible();
  }
  // Khối 1 đủ 27 hồ sơ theo SX-KS-K1 Bảng 10; Khối 2 đủ 20 theo SX-KS-K2.
  const byKhoi = await page.evaluate(() => Catalog.rows('sx-ho-so-chuyen-giao').reduce((a, r) => { a[r.khoi] = (a[r.khoi] || 0) + 1; return a; }, {}));
  expect(byKhoi).toEqual({ K1: 27, K2: 20 });
  // Nhóm Đầu tư mua sắm không lẫn danh mục Sản xuất.
  const dtmsKids = await page.evaluate(() => D.dmdcMenu.find((m) => m.label === 'Đầu tư mua sắm').children.map((c) => c.dmdc));
  expect(dtmsKids.some((k) => k.startsWith('sx-'))).toBe(false);
  expect(page.errors).toEqual([]);
});

test('Luồng nháp và dự án mẫu khai báo đủ cho các lát sau', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  const f = await page.evaluate(() => Object.fromEntries(Object.entries(D.sxFlows).map(([k, v]) => [k, v.steps.length])));
  expect(f).toEqual({ 'SX-KH': 5, 'SX-BG': 6, 'SX-BT': 7, 'SX-TD': 9, 'SX-NT': 6, 'SX-MS': 2 });
  const p = await page.evaluate(() => D.sxProjects.map((x) => [x.khoi, x.model]));
  expect(p).toEqual([['K1', 'VMC_TONG_THAU'], ['K1', 'VHT_TU_SX'], ['K2', 'GIA_CONG'], ['K2', 'VMC_TONG_THAU']]);
  for (const id of ['P-237', 'P-238', 'P-239', 'P-240', 'P-241', 'P-242', 'P-243']) expect(await page.evaluate((i) => !!D.openPoints[i], id)).toBe(true);
  expect(page.errors).toEqual([]);
});
