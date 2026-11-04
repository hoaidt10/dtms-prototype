// T9 — Quản trị quy trình: menu cha mới (D-2) + SCR-48 Giám sát tiến trình chỉ xem (D-3) theo process-monitoring.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const rows = (page) => page.locator('.vtable tbody tr');

test('D-15: menu theo 12 module Backlog; Quản lý quy trình có 3 mục (D-2); route cũ của mục bị bỏ vẫn mở', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const tops = await page.locator('.sb-nav > .nav:not(.child) .l').allInnerTexts();
  // Vận hành trước, cấu hình sau; Tích hợp và Trợ lý AI ẩn (2026-10-07).
  expect(tops).toEqual(['Tổng quan', 'Việc của tôi', 'Quản lý đề xuất mua sắm', 'Quản lý khoản đầu tư', 'Quản lý thầu',
    'Quản lý hợp đồng', 'Báo cáo', 'Quản lý quy trình', 'Thông báo']);
  // Mục con của một nhóm = các nút .child liền sau nút nhóm.
  const kids = (label) => page.evaluate((l) => {
    let n = document.querySelector(`.sb-nav [data-toggle="${l}"]`).nextElementSibling;
    const out = [];
    for (; n && n.classList.contains('child'); n = n.nextElementSibling) out.push(n.querySelector('.l').textContent);
    return out;
  }, label);
  await page.locator('.sb-nav [data-toggle="Quản lý quy trình"]').click();
  expect(await kids('Quản lý quy trình')).toEqual(['Quản lý quy trình', 'Ma trận hành động', 'Giám sát tiến trình']);
  // T29 D-63: thêm Đề tài / dự án (SCR-103) đầu nhóm.
  expect(await kids('Quản lý đề xuất mua sắm')).toEqual(['Đề tài / dự án', 'Đề xuất mua sắm', 'Hồ sơ đề xuất mua sắm', 'Yêu cầu báo giá ĐXMS']);
  await page.locator('.sb-nav [data-toggle="Quản lý khoản đầu tư"]').click();
  expect(await kids('Quản lý khoản đầu tư')).toEqual(['Khoản đầu tư', 'Hồ sơ khoản đầu tư', 'Yêu cầu báo giá KĐT']);
  await page.locator('.sb-nav [data-toggle="Quản lý thầu"]').click();
  expect(await kids('Quản lý thầu')).toEqual(['Kế hoạch lựa chọn nhà thầu', 'Gói thầu', 'Nhà thầu & kiểm soát rủi ro', 'Công khai & tích hợp đấu thầu', 'Giám sát hoạt động thầu']);
  // Mục để sau (Giám sát hoạt động thầu — T16 B2): trang Đang phát triển.
  await page.locator('.sb-nav [data-go="ph/giam-sat-thau"]').click();
  await expect(page.locator('.soon h1')).toContainText('Tính năng đang được phát triển');
  await expect(page.locator('.sb-nav [data-go="ph/giam-sat-thau"]')).toHaveClass(/active/);
  // Mục bị bỏ (Kho & tài sản, Quản trị hệ thống…): route cũ vẫn mở trang Đang phát triển.
  await page.evaluate(() => { location.hash = '#/ph/nguoi-dung'; });
  await expect(page.locator('.soon h1')).toContainText('Tính năng đang được phát triển');
  await expect(page.locator('.sb-nav .nav.active')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('D-2: route cũ #/ph/quy-trinh, #/ph/ma-tran chuyển sang route mới', async ({ page }) => {
  await fresh(page, '#/ph/quy-trinh');
  await expect(page).toHaveURL(/#\/quy-trinh$/);
  await expect(page.locator('.sb-nav [data-go="quy-trinh"]')).toHaveClass(/active/);
  await page.goto(page.url().replace(/#.*$/, '#/ph/ma-tran'));
  await expect(page).toHaveURL(/#\/ma-tran\/display-rule$/);
  await expect(page.locator('.sb-nav [data-go="ma-tran"]')).toHaveClass(/active/);
});

test('SCR-48: bố cục theo process-monitoring — không nút tiêu đề, cột, badge, phân trang 10', async ({ page }) => {
  await as(page, 'qt', '#/giam-sat-tien-trinh');
  await expect(page.locator('.sb-nav [data-go="giam-sat-tien-trinh"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-title')).toHaveText('Giám sát tiến trình');
  await expect(page.locator('main > .pg > .pg-head .r')).toHaveCount(0);
  await expect(page.locator('#gs-kw')).toHaveAttribute('placeholder', 'Tìm kiếm theo mã Camunda, mã hồ sơ');
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Trạng thái', 'Mã Camunda', 'Mã hồ sơ', 'Quy trình', 'Bước hiện tại', 'Ngày tạo', 'Ngày cập nhật']);
  await expect(rows(page)).toHaveCount(10);
  // 13 hồ sơ ĐXMS + 13 hồ sơ KĐT (T11 B5).
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 26');
  const st = await page.locator('.vtable tbody .vbadge').allInnerTexts();
  for (const p of ['2', '3']) {
    await page.locator(`.vpager [data-pg="${p}"]`).first().click();
    st.push(...await page.locator('.vtable tbody .vbadge').allInnerTexts());
  }
  for (const s of ['Đang chạy', 'Hoàn thành', 'Quá hạn', 'Đã hủy']) expect(st).toContain(s);
  await expect(rows(page)).toHaveCount(6);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('D-3: chỉ Mã hồ sơ là liên kết, bấm dòng không mở gì; liên kết mở Chi tiết hồ sơ, quay lại giữ trang', async ({ page }) => {
  await as(page, 'qt', '#/giam-sat-tien-trinh');
  await expect(page.locator('.vtable tbody a, .vtable tbody button, .vtable tbody [data-go]')).toHaveCount(10);
  await expect(page.locator('.vtable tbody td:nth-child(4) a.link')).toHaveCount(10);
  await expect(page.locator('.vtable tbody tr.click')).toHaveCount(0);
  await page.locator('.vpager [data-pg="2"]').first().click();
  const r = rows(page).filter({ hasText: 'HS-2026-0101' });
  await expect(r.locator('.vbadge')).toHaveText('Quá hạn');
  await expect(r.locator('.proc-cell .n')).toHaveText('Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ chưa được CT/TGĐ Tập đoàn phê duyệt');
  await expect(r.locator('.proc-cell .s')).toHaveText('MS01.01 - v2.0');
  // Mỗi hồ sơ theo quy trình đã chọn khi tạo (P-37: ba quy trình riêng).
  const procs = await page.evaluate(() => Object.fromEntries(QuyTrinh.monitorRows().map((x) => [x.code, `${x.proc} - v${x.version}.0`])));
  expect(procs['HS-2026-0074']).toBe('MS01.03 - v1.0');
  expect(procs['HS-2026-0103']).toBe('MS01.02 - v1.0');
  // Hồ sơ Điều chỉnh ĐXMS chạy quy trình MS02 (D-10).
  expect(procs['HS-2026-0126']).toBe('MS02 - v1.0');
  await r.locator('td').nth(5).click();
  await expect(page).toHaveURL(/#\/giam-sat-tien-trinh$/);
  await page.locator('.vpager [data-pg="3"]').first().click();
  const old = rows(page).filter({ hasText: 'HS-2026-0072' });
  await expect(old.locator('.vbadge')).toHaveText('Đã hủy');
  await expect(old.locator('.proc-cell .s')).toHaveText('MS01.01 - v1.0');
  await old.locator('a.link').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/HS-2026-0072$/);
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
  await page.locator('.pg-head .vbtn.back').click();
  await expect(page).toHaveURL(/#\/giam-sat-tien-trinh$/);
  await expect(page.locator('.vpager .pgn.on')).toHaveText('3');
});

test('SCR-48: tìm nhanh theo mã hồ sơ / mã Camunda; nâng cao — Mã Camunda chỉ nhập số, lọc trạng thái', async ({ page }) => {
  await as(page, 'lan', '#/giam-sat-tien-trinh');
  await page.locator('#gs-kw').fill('0106');
  await page.locator('#gs-kw').press('Enter');
  await expect(rows(page)).toHaveCount(1);
  const key = await rows(page).locator('td').nth(2).innerText();
  expect(key).toMatch(/^\d{16}$/);
  await page.locator('#gs-kw').fill(key);
  await page.locator('#gs-kw').press('Enter');
  await expect(rows(page)).toHaveText([/HS-2026-0106/]);

  await page.locator('[data-g="adv"]').click();
  await expect(page.locator('#gs-kw')).toHaveCount(0);
  await expect(rows(page)).toHaveCount(1); // mở panel không tải lại danh sách
  await expect(page.locator('.adv label')).toHaveText(['Mã Camunda', 'Mã hồ sơ', 'Quy trình', 'Trạng thái']);
  await page.locator('[data-gf="key"]').fill('12a');
  await expect(page.locator('[data-gfield="key"] .msg')).toHaveText('Chỉ nhập số');
  await page.locator('.adv button[type="submit"]').click();
  await expect(rows(page)).toHaveCount(1); // không tìm khi sai định dạng
  await page.locator('[data-gf="key"]').fill('');
  await expect(page.locator('[data-gfield="key"] .msg')).toBeHidden();
  await page.locator('[data-vsel="g-st"]').click();
  await expect(page.locator('.vsel-opt')).toHaveText(['Đang chạy', 'Hoàn thành', 'Quá hạn']);
  await page.locator('.vsel-opt', { hasText: 'Hoàn thành' }).click();
  await page.locator('.adv button[type="submit"]').click();
  const st = await page.locator('.vtable tbody .vbadge').allInnerTexts();
  expect(st.length).toBeGreaterThan(0);
  expect(new Set(st)).toEqual(new Set(['Hoàn thành']));
  await page.locator('[data-g="reset"]').click();
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 26');
});

test('P-41: vai khác Quản trị hệ thống / TTMS thấy thông báo chưa được cấp quyền', async ({ page }) => {
  await fresh(page, '#/giam-sat-tien-trinh');
  await expect(page.locator('.pg-title')).toHaveText('Giám sát tiến trình');
  await expect(page.locator('.vtable')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('Bạn chưa được cấp quyền truy cập chức năng này');
  await page.locator('.pg-title .info-i').click();
  await expect(page.locator('.info-pop')).toContainText('process-monitoring');
  await expect(page.locator('.info-pop [data-q="P-40"]')).toBeVisible();
});

test('SCR-48: hồ sơ đang chạy luồng hiện ở đầu danh sách, Đang chạy, có bước hiện tại', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(13, 'hai'); Flow.setPersona('qt'); });
  await page.goto(page.url().replace(/#.*$/, '#/giam-sat-tien-trinh'));
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 27');
  const code = await page.evaluate(() => Flow.ci().code);
  const r = rows(page).filter({ hasText: code });
  await expect(r.locator('.vbadge')).toHaveText(/Đang chạy|Quá hạn/);
  await expect(r.locator('td').nth(5)).not.toHaveText('-');
  await r.locator('a.link').click();
  await expect(page).toHaveURL(/#\/ho-so$/);
});
