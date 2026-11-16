// T16 B1 — Backlog W1_T10 (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §4 B1): DMDC 6 danh mục + Xem chi tiết, Nhập biểu mẫu E-form,
// tìm kiếm nâng cao SCR-41 / SCR-27, tab Chi tiết ĐXMS (SCR-29), Yêu cầu báo giá ĐXMS (SCR-73/74).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

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
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const tab = (page, label) => page.locator('.dx-tabs [data-dtab], .dx-tabs [data-ltab]', { hasText: label }).first().click();
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });

test('DMDC: 6 danh mục mới theo Backlog — tiêu đề, dữ liệu mẫu, số trên Tổng quan', async ({ page }) => {
  await as(page, 'qt', '#/dmdc');
  const NEW = [['loai-doi-tac', 'Loại đối tác', 6], ['don-vi-tinh', 'Đơn vị tính', 10], ['tien-te', 'Tiền tệ', 6],
    ['loai-goi-thau', 'Loại gói thầu', 6], ['phuong-phap-danh-gia', 'Phương pháp đánh giá', 7], ['hinh-thuc-bao-dam', 'Hình thức bảo đảm', 5]];
  for (const [key, title, n] of NEW) {
    await expect(page.locator(`.ov-tile[href="#/dmdc/${key}"] .n`)).toHaveText(String(n));
  }
  for (const [key, title, n] of NEW) {
    await go(page, '#/dmdc/' + key);
    await expect(page.locator('.pg-title')).toHaveText('Danh sách ' + title.toLowerCase());
    await expect(page.locator('.vtable tbody tr')).toHaveCount(n);
    expect(await mainText(page)).not.toMatch(BA);
  }
  await go(page, '#/dmdc/hinh-thuc-bao-dam');
  await expect(page.locator('.vtable tbody tr', { hasText: 'BL_NH' })).toContainText('Bảo đảm dự thầu, Bảo đảm thực hiện hợp đồng');
  expect(page.errors).toEqual([]);
});

test('DMDC: Tiền tệ — thêm mới, Mã khoá khi sửa, xoá bản ghi đang dùng bị chặn', async ({ page }) => {
  await as(page, 'qt', '#/dmdc/tien-te');
  await page.locator('[data-cat-new]').click();
  const m = page.locator('.vmodal');
  await m.locator('[data-cf="code"]').fill('sgd');
  await expect(m.locator('[data-cf="code"]')).toHaveValue('SGD');
  await m.locator('[data-cf="name"]').fill('Đô la Singapore');
  await m.locator('#cat-save').click();
  await expect(m.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Ký hiệu.', 'Bạn cần chọn Số chữ số thập phân.']);
  await m.locator('[data-cf="symbol"]').fill('S$');
  await m.locator('[data-vsel="cf-decimals"]').click();
  await page.locator('.vsel-panel [data-opt="2"]').click();
  await m.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Thêm mới tiền tệ thành công');
  await expect(page.locator('.vtable tbody tr').first()).toContainText('SGD');
  await page.locator('.vtable tbody tr', { hasText: 'USD' }).locator('[data-cat-edit]').click();
  await expect(page.locator('.vmodal [data-cf="code"]')).toBeDisabled();
  await page.locator('.vmodal [data-close]').first().click();
  await page.locator('.vtable tbody tr', { hasText: 'VND' }).locator('[data-cat-del]').click();
  await page.locator('#cf-ok').click();
  expect(await lastToast(page)).toContain('đang được sử dụng trong 15 hồ sơ, không thể xoá');
  expect(page.errors).toEqual([]);
});

test('DMDC: Xem chi tiết — bấm Mã mở hộp thoại chỉ xem; Chỉnh sửa chuyển sang hộp thoại sửa; Ngưỡng bấm cột đầu', async ({ page }) => {
  await as(page, 'qt', '#/dmdc/loai-hop-dong');
  await page.locator('.vtable tbody tr', { hasText: 'TRON_GOI' }).locator('[data-cat-view]').click();
  const m = page.locator('.vmodal');
  await expect(m.locator('h3')).toHaveText('Xem chi tiết loại hợp đồng');
  await expect(m.locator('[data-cf="name"]')).toHaveValue('Trọn gói');
  await expect(m.locator('[data-cf="name"]')).toBeDisabled();
  await expect(m.locator('[data-cf="description"]')).toBeDisabled();
  await expect(m.locator('.req:not([hidden])')).toHaveCount(0);
  await expect(m.locator('#cat-save')).toHaveCount(0);
  await m.locator('#cat-edit').click();
  await expect(page.locator('.vmodal h3')).toHaveText('Chỉnh sửa loại hợp đồng');
  await expect(page.locator('.vmodal [data-cf="name"]')).toBeEnabled();
  await page.locator('.vmodal [data-close]').first().click();
  await go(page, '#/dmdc/nha-cung-cap');
  await page.locator('.vtable tbody tr', { hasText: 'NCC-000001' }).locator('[data-cat-view]').click();
  await expect(page.locator('.vmodal h3')).toHaveText('Xem chi tiết nhà cung cấp');
  await expect(page.locator('.vmodal [data-vsel="cf-goods"]')).toHaveClass(/dis/);
  await page.locator('.vmodal [data-close]').first().click();
  await go(page, '#/dmdc/nguong-phan-luong');
  await page.locator('.vtable tbody tr').first().locator('[data-cat-view]').click();
  await expect(page.locator('.vmodal h3')).toHaveText('Xem chi tiết ngưỡng phân luồng');
  expect(page.errors).toEqual([]);
});

test('E-form: Nhập biểu mẫu — kiểm tra từng biểu mẫu, mã trùng báo lỗi, biểu mẫu nhập vào ở trạng thái Dừng hoạt động', async ({ page }) => {
  await as(page, 'qt', '#/eform');
  const n0 = await page.locator('.ef-table tbody tr').count();
  await page.locator('[data-ef-import]').click();
  await expect(page.locator('#imp-go')).toBeDisabled();
  await page.locator('[data-imp-zone]').click();
  await page.locator('#imp-go').click();
  const res = page.locator('.vmodal', { hasText: 'Kết quả nhập dữ liệu' });
  await expect(res.locator('.imp-sum')).toHaveText('2/3 biểu mẫu hợp lệ');
  await expect(res.locator('tbody tr').nth(2)).toContainText('Mã biểu mẫu BM-04 đã tồn tại.');
  await page.locator('#imp-ok').click();
  expect(await lastToast(page)).toContain('Nhập biểu mẫu thành công (2 biểu mẫu)');
  await expect(page.locator('.ef-table tbody tr')).toHaveCount(n0 + 2);
  await expect(page.locator('.ef-table tbody tr[data-code="BM-10"] .vswitch')).not.toHaveClass(/on/);
  expect(page.errors).toEqual([]);
});

test('SCR-41: Tìm kiếm nâng cao — ẩn ô tìm và ô Trạng thái; lọc Mã + Trạng thái chỉ còn phiên bản khớp; Làm mới', async ({ page }) => {
  await as(page, 'qt', '#/quy-trinh');
  await page.locator('[data-wf="adv"]').click();
  await expect(page.locator('#wf-kw')).toHaveCount(0);
  await expect(page.locator('[data-vsel="wf-st"]')).toHaveCount(0);
  await page.locator('[data-wff="code"]').fill('MS01');
  await page.locator('[data-vsel="wfa-st"]').click();
  await page.locator('.vsel-panel [data-opt="DELETED"]').click();
  await page.locator('[data-wfadv] button[type="submit"]').click();
  const rows = page.locator('.vtree tbody tr, table tbody tr');
  await expect(page.locator('main tbody')).toContainText('DTMS_MS01');
  await expect(page.locator('main tbody')).not.toContainText('DTMS_MS01_02');
  await page.locator('[data-wf="adv-reset"]').click();
  await expect(page.locator('main tbody')).toContainText('DTMS_MS14');
  await page.locator('[data-wf="adv"]').click();
  await expect(page.locator('#wf-kw')).toHaveCount(1);
  expect(rows).toBeTruthy();
  expect(page.errors).toEqual([]);
});

// T34 (D-90): SCR-27 Danh sách ĐXMS — comment cùng màn Tách.
// [T34 bỏ Tách] test('SCR-27: Tìm kiếm nâng cao ĐXMS — Trạng thái, Nhiệm vụ / Đề tài', async ({ page }) => {
// [T34 bỏ Tách]   await fresh(page, '#/dxms');
// [T34 bỏ Tách]   await page.locator('[data-xl="adv"]').click();
// [T34 bỏ Tách]   await expect(page.locator('#dxms-kw')).toHaveCount(0);
// [T34 bỏ Tách]   await page.locator('[data-vsel="xf-st"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="OK"]').click();
// [T34 bỏ Tách]   await page.keyboard.press('Escape');
// [T34 bỏ Tách]   await page.locator('[data-xadv] button[type="submit"]').click();
// [T34 bỏ Tách]   const rows = page.locator('main .vtable tbody tr');
// [T34 bỏ Tách]   expect(await rows.count()).toBeGreaterThan(0);
// [T34 bỏ Tách]   // T21 D-40: ĐXMS đã có hồ sơ Điều chỉnh hoàn thành ghi thêm số lần điều chỉnh.
// [T34 bỏ Tách]   for (const t of await rows.locator('td:nth-child(3)').allInnerTexts()) expect(t).toMatch(/^Đã phê duyệt( \(điều chỉnh lần \d+\))?$/);
// [T34 bỏ Tách]   await page.locator('[data-xl="reset"]').click();
// [T34 bỏ Tách]   await page.locator('[data-vsel="xf-nv"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="DA-2026-002"]').click();
// [T34 bỏ Tách]   await page.locator('[data-xadv] button[type="submit"]').click();
// [T34 bỏ Tách]   await expect(rows).toHaveCount(3); // T34: 0124, 0077 và ĐXMS điều chỉnh 0126
// [T34 bỏ Tách]   expect(page.errors).toEqual([]);
// [T34 bỏ Tách] });

// T34: các tab của Chi tiết ĐXMS cũ (SCR-29) chuyển sang Chi tiết luồng mua sắm (SCR-97).
test('SCR-97 (tab chuyển từ SCR-29): ĐXMS đã phê duyệt có điều chỉnh: căn cứ, tồn kho 2 lần rà soát, YCBG, phiên bản, kết quả', async ({ page }) => {
  await fresh(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0077'));
  await expect(page.locator('.dx-tabs .tab.on')).toHaveText('Thông tin chung');
  await expect(page.locator('[data-dxms-chain] tbody tr')).toHaveCount(2);
  // T37 (RV-PROTO-0911 #3): tab Căn cứ & hạng mục chỉ còn Căn cứ pháp lý + Thông tin dự án / đề tài.
  await tab(page, 'Căn cứ & hạng mục');
  await expect(card(page, 'Căn cứ pháp lý')).toBeVisible();
  await expect(card(page, 'Thông tin dự án / đề tài')).toBeVisible();
  await expect(page.locator('main .vcard', { hasText: 'Căn cứ mua sắm' })).toHaveCount(0);
  await expect(page.locator('main .vcard', { hasText: 'Hạng mục mua sắm' })).toHaveCount(0);
  await tab(page, 'Rà soát tồn kho');
  await expect(card(page, 'Lịch sử rà soát tồn kho').locator('tbody tr')).toHaveCount(2);
  // T59 #48: cột Hồ sơ → Kết quả rà soát tồn kho (tên tệp, tải được). [T59 #48] cũ: toContainText('HS-2026-0126')
  await expect(card(page, 'Lịch sử rà soát tồn kho').locator('thead')).toContainText('Kết quả rà soát tồn kho');
  await expect(card(page, 'Lịch sử rà soát tồn kho').locator('tbody tr').first().locator('[data-dl]')).toHaveCount(1);
  await tab(page, 'Yêu cầu báo giá');
  await expect(card(page, 'Danh sách yêu cầu báo giá').locator('tbody tr')).toHaveCount(1);
  await expect(card(page, 'Danh sách yêu cầu báo giá')).toContainText('Báo giá đạt');
  // T37 #3: bỏ So sánh báo giá và cơ sở giá; cột Tổng giá trị theo cơ sở giá trong Danh sách.
  await expect(card(page, 'Danh sách yêu cầu báo giá').locator('thead')).toContainText('Tổng giá trị theo cơ sở giá (tỷ đồng)');
  await expect(page.locator('main [data-ycbg-total]').first()).not.toHaveText('-');
  await expect(page.locator('main .vcard', { hasText: 'So sánh báo giá' })).toHaveCount(0);
  // D-95: Văn bản đầu ra gộp Kết quả & văn bản phê duyệt (dòng đầu, Đang hiệu lực) và Lịch sử phiên bản (bấm phiên bản Tờ trình).
  await tab(page, 'Tài liệu & văn bản');
  const kq = page.locator('[data-dx-docs] tbody tr').first();
  await expect(kq).toContainText('BM-08 Quyết định phê duyệt ĐXMS');
  // T72 #80 (D-122 Q3): bỏ cột Trạng thái / Ký duyệt — trước: kq chứa 'Đang hiệu lực'.
  await expect(page.locator('[data-dx-docs] thead')).not.toContainText('Trạng thái');
  // T37 #3: không theo dõi / so sánh phiên bản — không còn cột Phiên bản.
  await expect(page.locator('[data-dx-docs] thead')).not.toContainText('Phiên bản');
  await expect(page.locator('[data-dx-docs] [data-dx-ver]')).toHaveCount(0);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

// T34: các tab của Chi tiết ĐXMS cũ (SCR-29) chuyển sang Chi tiết luồng mua sắm (SCR-97).
test('SCR-97 (tab chuyển từ SCR-29): ĐXMS chưa có hồ sơ — các tab báo chưa có dữ liệu; hồ sơ đang ở bước đầu chưa có YCBG', async ({ page }) => {
  await fresh(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0124'));
  for (const [t, msg] of [['Rà soát tồn kho', 'Chưa có kết quả rà soát tồn kho'], ['Yêu cầu báo giá', 'Chưa có yêu cầu báo giá'],
  ]) {
    await tab(page, t);
    await expect(page.locator('main .empty-t')).toContainText(msg);
  }
  await go(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0121'));
  await tab(page, 'Căn cứ & hạng mục');
  await expect(card(page, 'Căn cứ pháp lý')).toBeVisible(); // T37 #3: không còn Căn cứ mua sắm / Hạng mục mua sắm
  await expect(page.locator('main .vcard', { hasText: 'Hạng mục mua sắm' })).toHaveCount(0);
  await tab(page, 'Yêu cầu báo giá');
  await expect(page.locator('main .empty-t')).toContainText('Chưa có yêu cầu báo giá');
  expect(page.errors).toEqual([]);
});

test('SCR-73/74: Danh sách yêu cầu báo giá — tìm kiếm nâng cao, mở chi tiết, xuất file; mọi dòng mở được', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('.sb-nav [data-toggle="Quản lý thầu"]').click(); // T56 Q1: Yêu cầu báo giá thuộc Quản lý thầu
  await page.locator('.sb-nav [data-go="ycbg"]').click();
  await expect(page).toHaveURL(/#\/ycbg$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách yêu cầu báo giá');
  const rows = page.locator('main .vtable tbody tr');
  const n = await rows.count();
  expect(n).toBeGreaterThan(3);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('[data-y="adv"]').click();
  await page.locator('[data-vsel="yf-st"]').click();
  await page.locator('.vsel-panel [data-opt="WAIT"]').click();
  await page.keyboard.press('Escape');
  await page.locator('[data-yadv] button[type="submit"]').click();
  for (const t of await rows.locator('td:nth-child(3)').allInnerTexts()) expect(t).toBe('Đang chờ báo giá');
  await page.locator('[data-y="reset"]').click();
  await expect(rows).toHaveCount(Math.min(n, 10));
  const codes = await rows.locator('td:nth-child(4)').allInnerTexts();
  for (const c of codes) {
    await go(page, '#/ycbg/' + encodeURIComponent(c));
    await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết yêu cầu báo giá');
    await expect(page.locator('main .ginfo').first()).toContainText(c);
  }
  await go(page, '#/ycbg/' + encodeURIComponent(codes[0]));
  await expect(card(page, 'Hạng mục yêu cầu báo giá').locator('tbody tr').first()).not.toContainText('Chưa có dữ liệu');
  await expect(card(page, 'Nhà cung cấp nhận yêu cầu').locator('tbody tr')).toHaveCount(3);
  const dl = page.waitForEvent('download');
  await page.locator('.pg-head [data-y-export]').click();
  expect((await dl).suggestedFilename()).toBe(codes[0] + '.csv');
  await go(page, '#/ycbg');
  // 12/11: menu gộp — cột 5 Loại đối tượng, cột 6 mã đối tượng; chọn dòng ĐXMS.
  await rows.filter({ has: page.locator('td:nth-child(5)', { hasText: /^ĐXMS$/ }) }).filter({ has: page.locator('td:nth-child(6) a') }).first().locator('td:nth-child(6) a').click();
  await expect(page).toHaveURL(/#\/luong\//); // T34: liên kết ĐXMS mở Chi tiết luồng (SCR-97)
  expect(page.errors).toEqual([]);
});

// T34: các tab của Chi tiết ĐXMS cũ (SCR-29) chuyển sang Chi tiết luồng mua sắm (SCR-97).
test('Hồ sơ chạy luồng: qua task 10 thì ĐXMS có YCBG đạt và tab Rà soát tồn kho có kết quả', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(12, 'minh', {}, 'MS01.01', undefined, null, false); });
  const code = await page.evaluate(() => Flow.state.dxms);
  await go(page, '#/luong/' + encodeURIComponent(code));
  await tab(page, 'Rà soát tồn kho');
  await expect(card(page, 'Kết quả rà soát tồn kho').locator('tbody tr')).toHaveCount(5);
  await tab(page, 'Yêu cầu báo giá');
  const ys = card(page, 'Danh sách yêu cầu báo giá').locator('tbody tr');
  expect(await ys.count()).toBeGreaterThan(0);
  await expect(ys.last()).toContainText('Báo giá đạt');
  await go(page, '#/ycbg');
  await expect(page.locator('main .vtable tbody')).toContainText(code);
  expect(page.errors).toEqual([]);
});
