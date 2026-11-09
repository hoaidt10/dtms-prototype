// T36 B1 (D-96) — nút Đồng bộ đề tài / dự án ở SCR-103, hộp thoại Phạm vi, SCR-109 Lịch sử đồng bộ (#/de-tai/dong-bo).
// Plan docs/dtms/T36-srs-dong-bo-dadt-ke-hoach.md v0.2, B0 K1…K7.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const as = (page, id) => page.evaluate((p) => { window.Flow.setPersona(p); }, id);
const menu = (page) => page.locator('[data-sy-menu]');

test('Nút chỉ Quản trị hệ thống, TTMS thấy; menu xổ 3 mục; Nguồn dữ liệu theo nguồn, lọc được', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'minh');
  await expect(menu(page)).toHaveCount(0);
  await as(page, 'lan');
  await expect(menu(page)).toHaveText(/Đồng bộ đề tài \/ dự án/);
  await menu(page).click();
  await expect(page.locator('[data-sy-pop] .vbtn')).toHaveText(['Đồng bộ từ KHCN', 'Đồng bộ từ HR Tool', 'Xem lịch sử đồng bộ']);
  await page.locator('.pg-title').click();
  await expect(page.locator('[data-sy-pop]')).toHaveCount(0);
  await as(page, 'qt');
  await expect(menu(page)).toHaveCount(1);

  const body = page.locator('[data-dt-list] tbody');
  await expect(body).toContainText('Đồng bộ KHCN');
  await expect(body).toContainText('Đồng bộ HR Tool');
  await expect(body).toContainText('Chuyển từ hệ thống cũ');
  await page.locator('[data-dt="adv"]').click();
  await page.locator('[data-vsel="dtf-src"]').click();
  await page.locator('.vsel-panel [data-opt="Đồng bộ HR Tool"]').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const codes = (await page.locator('[data-dt-list] tbody tr td:nth-child(4)').allInnerTexts()).sort();
  expect(codes).toEqual(['005-26-VHT-BP-M', '020-26-VHT-BP-C', 'DA-2026-002', 'KHN-2027-DTPT']);
  expect(page.errors).toEqual([]);
});

test('Đồng bộ từ HR Tool: hộp thoại Phạm vi, bắt buộc Mã khi Một đề tài, chạy nền, khoá nguồn đang chạy, kết quả có link Xem chi tiết', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'lan');
  await menu(page).click();
  await page.locator('[data-sy-src="HRTOOL"]').click();
  const dlg = page.locator('.vmodal');
  await expect(dlg.locator('h3')).toHaveText('Đồng bộ đề tài / dự án từ HR Tool');
  await expect(dlg.locator('.vradio-opt')).toHaveText(['Thay đổi từ mốc', 'Toàn bộ', 'Một đề tài']);
  await expect(dlg.locator('.vradio-opt.on')).toHaveText('Thay đổi từ mốc');
  await dlg.locator('[data-sy-sc="one"]').click();
  await dlg.locator('#sy-ok').click();
  await expect(dlg.locator('#sy-one .msg')).toHaveText('Vui lòng nhập Mã dự án / đề tài.');
  await dlg.locator('#sy-code').fill('NV-KHCN-2026-014');
  await dlg.locator('#sy-ok').click();
  await expect(dlg).toHaveCount(0);
  expect(await lastToast(page)).toContain('Đã bắt đầu lần đồng bộ DB-2026-00041.');

  await menu(page).click();
  await expect(page.locator('[data-sy-src="HRTOOL"]')).toBeDisabled();
  await expect(page.locator('[data-sy-src="KHCN"]')).toBeEnabled();
  await page.locator('.pg-title').click();

  await expect.poll(() => lastToast(page), { timeout: 6000 }).toContain('Lần DB-2026-00041 (HR Tool)');
  await page.locator('.toast [data-sy-run="DB-2026-00041"]').click();
  await expect(page).toHaveURL(/#\/de-tai\/dong-bo$/);
  const d = page.locator('.vmodal');
  await expect(d.locator('h3')).toHaveText('Chi tiết lần đồng bộ DB-2026-00041');
  await expect(d.locator('[data-sy-items] tbody')).toContainText('Nhiệm vụ Khoa học công nghệ lấy từ phân hệ Quản lý Khoa học công nghệ, bỏ qua.');
  expect(page.errors).toEqual([]);
});

test('SCR-109: khối trạng thái theo nguồn, tab Lần đồng bộ / Lần nhập, lọc Nguồn, Bỏ qua lỗi bắt buộc Lý do', async ({ page }) => {
  await fresh(page, '#/de-tai');
  await as(page, 'qt');
  await menu(page).click();
  await page.locator('[data-sy-hist]').click();
  await expect(page).toHaveURL(/#\/de-tai\/dong-bo$/);
  await expect(page.locator('.pg-title')).toHaveText('Lịch sử đồng bộ đề tài / dự án');
  await expect(page.locator('.sb-nav [data-go="de-tai"]')).toHaveClass(/active/);
  const st = page.locator('[data-sy-status] tbody tr');
  await expect(st).toHaveCount(2);
  await expect(st.nth(0)).toContainText('KHCN');
  await expect(st.nth(0)).toContainText('Hằng ngày lúc 01:00');
  await expect(st.nth(1)).toContainText('HR Tool');
  await expect(st.nth(1)).toContainText('Hằng ngày lúc 01:30');
  await expect(page.locator('[data-sy-tab]')).toHaveText(['Lần đồng bộ', 'Lần nhập']);
  await expect(page.locator('[data-sy-list] thead th')).toHaveText(['STT', 'Trạng thái', 'Mã lần', 'Nguồn', 'Cách chạy', 'Phạm vi', 'Người chạy', 'Bắt đầu', 'Kết thúc',
    'Lấy về', 'Thêm mới', 'Cập nhật', 'Không đổi', 'Bỏ qua', 'Lỗi']);
  await expect(page.locator('[data-sy-list] tbody tr')).toHaveCount(4);

  await page.locator('[data-sy="adv"]').click();
  await page.locator('[data-vsel="syf-src"]').click();
  await page.locator('.vsel-panel [data-opt="HRTOOL"]').click();
  await page.locator('[data-sy-adv] button[type="submit"]').click({ force: true });
  await expect(page.locator('[data-sy-list] tbody tr')).toHaveCount(2);

  // Đề tài còn lỗi của KHCN = 1 → mở chi tiết lọc Lỗi; Bỏ qua lỗi bắt buộc Lý do.
  await st.nth(0).locator('[data-sy-errsrc]').click();
  const d = page.locator('.vmodal');
  await expect(d.locator('[data-sy-items] tbody tr')).toHaveCount(1);
  await d.locator('[data-sy-skip="009-26-VHT-RDP-DS"]').click();
  const sk = page.locator('.vmodal').last();
  await expect(sk.locator('h3')).toHaveText('Bỏ qua lỗi');
  await sk.locator('#sy-skip-ok').click();
  await expect(sk.locator('#sy-rf .msg')).toHaveText('Vui lòng nhập Lý do.');
  await sk.locator('#sy-rsn').fill('Nguồn đã sửa, chờ lần sau.');
  await sk.locator('#sy-skip-ok').click();
  expect(await lastToast(page)).toContain('Cập nhật lỗi đồng bộ thành công.');
  await expect(d.locator('[data-sy-items] tbody')).toContainText('Có');
  await d.locator('[data-close]').last().click();
  await expect(st.nth(0).locator('td').last()).toHaveText('0');

  await page.locator('[data-sy-tab="imp"]').click();
  await expect(page.locator('[data-sy-imports] tbody tr')).toHaveCount(1);
  await page.locator('[data-sy-imp="NH-2026-00012"]').click();
  await expect(page.locator('.vmodal h3')).toHaveText('Chi tiết lần nhập NH-2026-00012');
  expect(page.errors).toEqual([]);
});

test('Vai không có quyền mở lịch sử bằng URL: báo không có quyền, không có nút', async ({ page }) => {
  await fresh(page, '#/de-tai/dong-bo');
  await as(page, 'minh');
  await expect(page.locator('.pg-title')).toHaveText('Lịch sử đồng bộ đề tài / dự án');
  await expect(page.locator('main')).toContainText('Bạn không có quyền thực hiện chức năng này.');
  await expect(menu(page)).toHaveCount(0);
  await expect(page.locator('[data-sy-list]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
