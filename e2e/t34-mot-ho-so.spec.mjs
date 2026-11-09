// T34 (D-85…D-91) — mô hình 1 ĐXMS – 1 hồ sơ, chỉ còn phương án Gộp: Điều chỉnh tạo ĐXMS mới qua màn Thêm mới điều chỉnh ĐXMS
// (khuôn Lập ĐXMS); ĐXMS cũ Đang điều chỉnh → Đã được điều chỉnh / về Đã phê duyệt; ĐXMS Dừng xử lý làm lại bằng Sao chép (GIẢ LẬP P-226).
// Plan docs/dtms/prototype-T34-dxms-mot-ho-so-chuan-bi.md §6.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const lg = (code) => '#/luong/' + encodeURIComponent(code);
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const ginfo = (page) => page.locator('.gen .ginfo');
const stOf = (page, code) => page.evaluate((c) => Screens.dxmsMeta(Flow.findDxms(c), Screens.allCases()).state, code);

async function saveAdj(page, reason = 'Điều chỉnh thử') {
  await page.locator('#lf-adjReason').fill(reason);
  await page.locator('#lf-save').click();
}

test('Điều chỉnh ĐXMS từ Chi tiết luồng: màn Thêm mới điều chỉnh điền sẵn từ ĐXMS cũ; Lưu tạo ĐXMS mới + hồ sơ MS02; dừng bản điều chỉnh thì ĐXMS cũ về Đã phê duyệt', async ({ page }) => {
  await fresh(page, lg('ĐXMS-2026-0103'));
  await page.locator('[data-adj-dxms]').click();
  await expect(page).toHaveURL(/#\/dieu-chinh-dxms\/create\//);
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới điều chỉnh ĐXMS');
  // Khối Điều chỉnh + các khối của Lập ĐXMS, điền sẵn từ ĐXMS cũ; Đề tài / dự án, Đơn vị đề xuất, Mật khoá.
  await expect(page.locator('[data-vsel="lf-adj-from"]')).toHaveClass(/dis/);
  await expect(page.locator('#lf-adj-n')).toHaveValue('1');
  await expect(page.locator('#lf-adj-before')).toHaveValue('210.500.000.000');
  await expect(page.locator('#lf-title')).toHaveValue('Mua sắm hệ thống mô phỏng mạng lõi 5G');
  for (const id of ['lf-nv', 'lf-unit', 'lf-sec']) await expect(page.locator(`[data-vsel="${id}"]`)).toHaveClass(/dis/);
  await expect(page.locator('[data-lf-cost]')).toBeVisible();
  await expect(page.locator('[data-lf-chung]')).toBeVisible();
  // Lý do bắt buộc; sửa được tên và giá trị trên màn.
  await page.locator('#lf-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toContainText(['Bạn cần nhập Lý do điều chỉnh.']);
  await page.locator('#lf-title').fill('Mua sắm hệ thống mô phỏng mạng lõi 5G — bổ sung');
  await page.locator('#lf-est').fill('230.000.000.000');
  await saveAdj(page, 'Bổ sung 01 cụm mô phỏng');
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const ci = await page.evaluate(() => { const c = Flow.ci(), x = Flow.findDxms(c.dxms); return [c.code, c.dxms, c.kind, x.adjFrom, x.adjN, x.title, x.reason, Flow.state.vars.adj.before, Flow.state.vars.adj.total]; });
  expect(ci).toEqual(['HS-2026-0127', 'ĐXMS-2026-0127', 'DC', 'ĐXMS-2026-0103', 1, 'Mua sắm hệ thống mô phỏng mạng lõi 5G — bổ sung', 'Bổ sung 01 cụm mô phỏng', 210.5, 230]);
  expect(await stOf(page, 'ĐXMS-2026-0127')).toBe('PD');
  expect(await stOf(page, 'ĐXMS-2026-0103')).toBe('DC');

  // ĐXMS cũ: không còn nút Điều chỉnh; tạo lại điều chỉnh bị chặn.
  await go(page, lg('ĐXMS-2026-0103'));
  await expect(page.locator('[data-adj-dxms]')).toHaveCount(0);
  await expect(ginfo(page)).toContainText('Đang điều chỉnh bởiĐXMS-2026-0127');
  await go(page, '#/dieu-chinh-dxms/create/' + encodeURIComponent('ĐXMS-2026-0103'));
  await saveAdj(page);
  await expect(page.locator('.vfield.invalid .msg')).toContainText(['ĐXMS đang được điều chỉnh (ĐXMS-2026-0127).']);

  // Bản điều chỉnh dừng → ĐXMS cũ về Đã phê duyệt, ĐXMS điều chỉnh Dừng xử lý.
  await page.evaluate(() => { Flow.state.status = 'stopped'; Flow.state.tokens = []; });
  expect(await stOf(page, 'ĐXMS-2026-0103')).toBe('OK');
  expect(await stOf(page, 'ĐXMS-2026-0127')).toBe('STOP');
  expect(page.errors).toEqual([]);
});

test('Chỉ điều chỉnh bản còn hiệu lực của chuỗi: 0084 đã được điều chỉnh không chọn được; 0112 → lần 2', async ({ page }) => {
  await fresh(page, '#/dieu-chinh-dxms/create');
  await page.locator('[data-vsel="lf-adj-from"]').click();
  const opts = await page.locator('.vsel-panel [data-opt]').evaluateAll((os) => os.map((o) => o.dataset.opt));
  expect(opts).toContain('ĐXMS-2026-0112');
  expect(opts).not.toContain('ĐXMS-2026-0084');
  expect(opts).not.toContain('ĐXMS-2026-0121');
  await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0112"]').click();
  await expect(page.locator('#lf-adj-n')).toHaveValue('2');
  await saveAdj(page);
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  expect(await page.evaluate(() => Flow.dxmsChain(Flow.ci().dxms).map((x) => [x.code, x.adjN || 0]))).toEqual([['ĐXMS-2026-0084', 0], ['ĐXMS-2026-0112', 1], ['ĐXMS-2026-0127', 2]]);
  await go(page, lg('ĐXMS-2026-0084'));
  await expect(page.locator('[data-dxms-chain] tbody tr')).toHaveCount(3);
  await expect(ginfo(page)).toContainText('Được điều chỉnh bởiĐXMS-2026-0112');
  expect(page.errors).toEqual([]);
});

test('ĐXMS Dừng xử lý: Sao chép thành ĐXMS mới (chưa có hồ sơ, Sao chép từ) rồi Lập hồ sơ trên ĐXMS mới', async ({ page }) => {
  await fresh(page, lg('ĐXMS-2026-0095'));
  await expect(ginfo(page)).toContainText('Dừng xử lý');
  await expect(page.locator('[data-adj-dxms]')).toHaveCount(0);
  await page.locator('[data-copy-dxms]').click();
  await expect(page).toHaveURL(new RegExp('#/luong/' + encodeURIComponent('ĐXMS-2026-0127') + '$'));
  await expect(ginfo(page)).toContainText('Sao chép từĐXMS-2026-0095');
  await expect(ginfo(page)).toContainText('Chưa có hồ sơ');
  await page.locator('[data-lap-dxms]').click();
  await expect(page).toHaveURL(/#\/luong\/create\//);
  await expect(page.locator('#lf-title')).toHaveValue('Mua sắm vật tư tiêu hao cho xưởng sản xuất thử');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.ci().dxms, Flow.ci().code])).toEqual(['ĐXMS-2026-0127', 'HS-2026-0127']);
  expect(page.errors).toEqual([]);
});

test('Menu Điều chỉnh đề xuất mua sắm (SCR-108) ngay dưới Luồng mua sắm; danh sách ĐXMS điều chỉnh; route cũ của phương án Tách về Luồng mua sắm', async ({ page }) => {
  await fresh(page, '#/luong');
  const paths = await page.locator('.sb-nav [data-go]').evaluateAll((as) => as.map((a) => a.dataset.go));
  expect(paths[paths.indexOf('luong') + 1]).toBe('dieu-chinh-dxms');
  expect(paths).not.toContain('dxms');
  expect(paths).not.toContain('ho-so-dxms');
  await page.locator('#demo').click();
  await expect(page.locator('[data-luong-mode]')).toHaveCount(0);
  await page.locator('#demo').click();
  await page.locator('.sb-nav [data-go="dieu-chinh-dxms"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Điều chỉnh đề xuất mua sắm');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('tr[data-code="ĐXMS-2026-0126"]')).toContainText('ĐXMS-2026-0077');
  await expect(page.locator('tr[data-code="ĐXMS-2026-0112"]')).toContainText('9,60');
  await expect(page.locator('tr[data-code="ĐXMS-2026-0112"]')).toContainText('11,20');
  await page.locator('.pg-head [data-go="dieu-chinh-dxms/create"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới điều chỉnh ĐXMS');
  // Route cũ (Tách) chuyển sang Gộp.
  for (const [from, to] of [['#/dxms', /#\/luong$/], ['#/ho-so-dxms', /#\/luong$/], ['#/dxms/' + encodeURIComponent('ĐXMS-2026-0103'), /#\/luong\/%C4%90XMS-2026-0103$/],
    ['#/ho-so-dxms/create/' + encodeURIComponent('ĐXMS-2026-0119'), /#\/luong\/create\/%C4%90XMS-2026-0119$/]]) {
    await go(page, from);
    await expect(page).toHaveURL(to);
  }
  expect(page.errors).toEqual([]);
});

test('Người dùng 09/11: Đề tài / dự án là menu cấp 1 trên Quản lý đề xuất mua sắm; Thông tin chung SCR-97 có Nguồn vốn, Số / ngày TTr chủ trương, QĐ phê duyệt dự án, QĐ phê duyệt dự toán', async ({ page }) => {
  await fresh(page, lg('ĐXMS-2026-0103'));
  const tops = (await page.locator('.sb-nav > .nav:not(.child) .l').allInnerTexts()).map((x) => x.trim());
  expect(tops.indexOf('Quản lý đề xuất mua sắm') - tops.indexOf('Đề tài / dự án')).toBe(1);
  await expect(ginfo(page)).toContainText('Nguồn vốnQuỹ phát triển KHCN');
  await expect(ginfo(page)).toContainText('Số / ngày TTr chủ trương2104/TTr-VHT ngày 20/11/2025');
  await expect(ginfo(page)).toContainText('Số / ngày QĐ phê duyệt dự toán2211/QĐ-TĐ ngày 05/12/2025');
  await expect(ginfo(page)).toContainText('Số / ngày QĐ phê duyệt dự án');
  await page.locator('.sb-nav [data-go="de-tai"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Danh sách đề tài / dự án');
  expect(page.errors).toEqual([]);
});
