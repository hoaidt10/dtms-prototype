// @ts-check
// T71 S3 (D-121): cổng chuyển giao R&D → sản xuất — SX-06 gói chuyển giao (luồng SX-BG, thẩm định song song), SX-07 Kho sản phẩm sẵn sàng sản xuất,
// tab Hồ sơ chuyển giao + Điều kiện 4M của dự án; dự án chỉ Bắt đầu sản xuất khi đủ cổng.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 }); // luồng nhiều bước, nhiều lần đổi vai

const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const file = (name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
const PKG = 'GCG-TS-08-01'; // (b) Q2: gói đang lập là của TS-08 (chưa có dự án); QĐ-12 đã chuyển giao trước khi lập dự án
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const up = (page, hs, name) => page.locator(`[data-cg-up="${PKG}|${hs}"]`).setInputFiles(file(name));
const ok = (page) => page.locator('.vmodal #ok').click();

test('SX-06 / SX-07: danh sách gói, chi tiết 27 hồ sơ Khối 1, Kho sản phẩm sẵn sàng sản xuất; Nhà máy không xem gói', async ({ page }) => {
  await fresh(page, '#/sx/chuyen-giao');
  await as(page, 'sxrd', '#/sx/chuyen-giao');
  await expect(page.locator('.pg-title')).toContainText('Danh sách gói chuyển giao');
  const row = page.locator('.vtable tbody tr');
  await expect(row).toHaveCount(1);
  await expect(row).toContainText('12 / 14');
  await expect(page.locator('[data-sx-cg-new]')).toBeVisible();
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await row.locator('a.link').first().click();
  await expect(page.locator('.pg-title')).toContainText('Xem chi tiết gói chuyển giao');
  await page.locator('[data-ttab="hs"]').click();
  await expect(page.locator('[data-cg-docs] tbody tr')).toHaveCount(27);
  await expect(page.locator('[data-cg-docs] tbody tr', { hasText: 'K1-HS27' })).toContainText('Lập ở bước 4');
  await expect(page.locator('[data-cg-docs] tbody tr', { hasText: 'K1-HS19' })).toContainText('Chưa tải lên');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Kho: 5 sản phẩm đã phát hành, TS-08 chưa có.
  await page.locator('.sb-nav [data-go="sx/san-pham"]').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(5);
  await expect(page.locator('.vtable tbody')).not.toContainText('TS-08');
  await as(page, 'sxnm', '#/sx/chuyen-giao');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody')).toContainText('Chưa có dữ liệu');
  expect(page.errors).toEqual([]);
});

test('Cảnh B: thiếu hồ sơ bị chặn; QA yêu cầu bổ sung huỷ nhánh QLSX; bổ sung, thẩm định đạt, biên bản → Kho; dự án đủ 4M thì bắt đầu sản xuất', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  // Dự án 002 (QĐ-12 đã chuyển giao): 12 / 13 tiêu chí, còn Jig / Stencil, không bắt đầu sản xuất được.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await expect(page.locator('.ginfo')).toContainText('Chưa đủ điều kiện (12/13)');
  await page.locator('[data-sx-go-prod]').click();
  await expect(page.locator('.toast').last()).toContainText('Chưa đủ điều kiện sản xuất: còn 1 tiêu chí');
  await page.locator('[data-ttab="cg"]').click();
  await expect(page.locator('[data-sx-cg]')).toContainText('đã có trong Kho sản phẩm sẵn sàng sản xuất');

  // R&D: việc bước 1 mở sẵn tab Hồ sơ chuyển giao; gửi khi thiếu hồ sơ bị chặn.
  await openTask(page, 'sxrd', 'Tạo gói chuyển giao');
  await expect(page.locator('[data-cg-docs]')).toBeVisible();
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.toast').last()).toContainText('Còn 2 hồ sơ bắt buộc chưa tải lên');
  await expect(page.locator('.vmodal')).toHaveCount(0);
  await up(page, 'K1-HS19', 'Ho so thiet ke QD-12.zip');
  await up(page, 'K1-HS22', 'Firmware QD-12 v1.0.bin');
  await up(page, 'K1-HS25', 'Danh muc Jig Stencil.xlsx');
  await expect(page.locator('[data-cg-docs] .cap')).toContainText('14 / 14');
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.vmodal')).toContainText('14 / 14');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);

  // Hai nhánh song song: QLSX (sxpm) và QA (sxqa) cùng có việc.
  expect(await page.evaluate(() => SxFlow.caseOf('HSCG-GCG-TS-08-01-01').tokens.map((t) => [t.step, t.who]))).toEqual([['3a', 'sxpm'], ['3b', 'sxqa']]);
  await openTask(page, 'sxqa', 'Thẩm định hồ sơ (Đảm bảo chất lượng)');
  await page.locator('[data-sx-do]', { hasText: 'Yêu cầu bổ sung' }).click();
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(2);
  await page.locator('.vmodal [data-vsel="ef-tdBoSung"]').click();
  await page.locator('.vsel-panel [data-opt="K1-HS19"]').click();
  await page.locator('.vmodal .vmodal-h h3').click(); // đóng danh sách chọn nhiều
  await page.locator('.vmodal [data-ef="tdYk"]').fill('Thiếu bản vẽ cơ khí khối quang học.');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  // Nhánh QLSX bị huỷ, gói về R&D, hồ sơ 19 cần bổ sung.
  expect(await page.evaluate(() => SxFlow.caseOf('HSCG-GCG-TS-08-01-01').tokens.map((t) => [t.step, t.who]))).toEqual([['1', 'sxrd']].map(([a, b]) => [Number(a), b]));
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await expect(page.locator('[data-sx-tasks] tbody')).not.toContainText('Thẩm định hồ sơ');
  await openTask(page, 'sxrd', 'Tạo gói chuyển giao');
  await expect(page.locator('[data-cg-docs] tbody tr', { hasText: 'K1-HS19' })).toContainText('Cần bổ sung');
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.toast').last()).toContainText('Còn 1 hồ sơ bắt buộc');
  await up(page, 'K1-HS19', 'Ho so thiet ke QD-12 (bo sung).zip');
  await page.locator('[data-sx-do]').click();
  await ok(page);

  // Thẩm định đạt cả hai → biên bản → Kho.
  await openTask(page, 'sxpm', 'Thẩm định hồ sơ (Quản lý sản xuất)');
  await page.locator('[data-sx-do]', { hasText: 'Đạt' }).click();
  await ok(page);
  expect(await page.evaluate(() => SxFlow.caseOf('HSCG-GCG-TS-08-01-01').tokens.map((t) => t.step))).toEqual(['3b']);
  await openTask(page, 'sxqa', 'Thẩm định hồ sơ (Đảm bảo chất lượng)');
  await page.locator('[data-sx-do]', { hasText: 'Đạt' }).click();
  await ok(page);
  await openTask(page, 'sxpm', 'Lập biên bản thống nhất');
  await page.locator('[data-sx-do]').click();
  await page.locator('.vmodal [data-ef="bbSo"]').fill('07/BB-TTSX');
  await page.locator('.vmodal [data-ef="bbNgay"]').fill('16/11/2026');
  await page.locator('.vmodal [data-ef="bbThanhPhan"]').fill('Toàn bộ 26 hồ sơ, bản vẽ, firmware, quy trình công nghệ QĐ-12 v1.0_HW_Rev2.');
  await page.locator('.vmodal [data-ef-file="bbFile"]').setInputFiles(file('Bien ban thong nhat QD-12.pdf'));
  await ok(page);
  await page.locator('.vmodal [data-mysign-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);

  await as(page, 'sxpm', '#/sx/chuyen-giao/' + encodeURIComponent(PKG));
  await expect(page.locator('.ginfo')).toContainText('Đã duyệt');
  await page.locator('[data-ttab="hs"]').click();
  await expect(page.locator('[data-cg-docs] tbody tr', { hasText: 'K1-HS27' })).toContainText('Bien ban thong nhat QD-12.pdf');
  await page.locator('[data-ttab="td"]').click();
  await expect(page.locator('[data-cg-td]')).toContainText('07/BB-TTSX');
  await page.locator('[data-ttab="tt"]').click();
  await expect(page.locator('main')).toContainText('Huỷ do nhánh song song trả lại');
  await as(page, 'sxkd', '#/sx/san-pham');
  await expect(page.locator('.vtable tbody tr', { hasText: 'TS-08' })).toContainText(PKG);
  await expect(page.locator('.vtable tbody tr', { hasText: 'TS-08' })).toContainText('16/11/2026');

  // Dự án 002: xác nhận Jig / Stencil → đủ cổng → Bắt đầu sản xuất.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await expect(page.locator('.ginfo')).toContainText('Chưa đủ điều kiện (12/13)');
  await page.locator('[data-ttab="m4"]').click();
  await expect(page.locator('[data-sx-m4] [data-m4]')).toHaveCount(11); // 2 tiêu chí hệ thống (Kho, bàn giao nhà máy) không có nút Cập nhật
  await page.locator('[data-m4="DA-SX-2026-002|MC2"]').click();
  await page.locator('.vmodal [data-ef-radio="kq"][data-v=\'"DAT"\']').click();
  await page.locator('.vmodal [data-ef="note"]').fill('Stencil khối nguồn đã về 16/11/2026');
  await ok(page);
  await expect(page.locator('[data-sx-m4] .hd-alert')).toContainText('Đủ điều kiện sản xuất: 13 / 13');
  await page.locator('[data-sx-go-prod]').click();
  await page.locator('[data-ttab="info"]').click();
  await expect(page.locator('.ginfo')).toContainText('Đang sản xuất');
  await expect(page.locator('[data-sx-go-prod]')).toHaveCount(0);
  await page.locator('[data-ttab="hist"]').click();
  await expect(page.locator('main .vtable tbody tr').first()).toContainText('Bắt đầu sản xuất');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Thêm mới gói chuyển giao: chọn sản phẩm chưa chuyển giao, mở việc bước 1 với 20 hồ sơ Khối 2', async ({ page }) => {
  await fresh(page, '#/sx/chuyen-giao');
  await as(page, 'sxrd', '#/sx/chuyen-giao');
  await page.locator('[data-sx-cg-new]').click();
  await page.locator('[data-cg-new-ok]').click();
  await expect(page.locator('[data-cg-new-err]')).toHaveText('Bạn cần chọn Sản phẩm · phiên bản.');
  await page.locator('[data-vsel="sxcg-new-prod"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(1); // chỉ ONT-X2 (TS-08 đã có gói)
  await page.locator('.vsel-panel [data-opt="ONT-X2"]').click();
  await page.locator('[data-cg-new-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/viec\/HSCG-GCG-ONT-X2-01-01\//);
  await expect(page.locator('[data-cg-docs] tbody tr')).toHaveCount(20);
  await expect(page.locator('[data-cg-docs] .cap')).toContainText('0 / 20');
  expect(page.errors).toEqual([]);
});
