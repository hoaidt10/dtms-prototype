// T9 B3 — Khung Ma trận hành động (action-matrix) + SCR-43 Danh sách luật (display-rule-list) + SCR-44 Thêm/Sửa/Xem (display-rule-form).
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
const rows = (page) => page.locator('.mt-table tbody tr');
const total = (page) => page.locator('[data-pager="mt"] .tot');
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const confirmDlg = (page) => page.locator('.vconfirm');

test('Khung + SCR-43: tiêu đề, tab pill, nút Thêm mới trên hàng tab, bảng theo display-rule-columns', async ({ page }) => {
  await as(page, 'qt', '#/ma-tran');
  await expect(page).toHaveURL(/#\/ma-tran\/display-rule$/);
  await expect(page.locator('.sb-nav [data-go="ma-tran"]')).toHaveClass(/active/);
  await expect(page.locator('main .pg > .pg-title')).toHaveText('Ma trận hành động');
  await expect(page.locator('.mt-tab')).toHaveText(['Luật hiển thị hành động', 'Đối soát BPMN', 'Danh mục hành động']);
  await expect(page.locator('.mt-tab.on')).toHaveText('Luật hiển thị hành động');
  await expect(page.locator('main .pg > .pg-head .r .vbtn.primary')).toHaveText('Thêm mới');
  await expect(page.locator('.mt-card-t')).toHaveText('Danh sách luật hiển thị hành động');
  await expect(page.locator('#mt-kw')).toHaveAttribute('placeholder', 'Tìm kiếm theo mã luật, tên hành động');
  await expect(page.locator('.mt-table th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã luật hành động', 'Mã hành động', 'Tên hành động',
    'Quy trình áp dụng', 'Ngày tạo', 'Ngày cập nhật']);
  const n = await page.evaluate(() => MaTran.rules().length);
  expect(n).toBeGreaterThan(40);
  await expect(total(page)).toHaveText(`Tổng số bản ghi: ${n}`);
  await expect(rows(page)).toHaveCount(10);
  // Cột Thao tác: Sửa + Xoá, không có xem; Trạng thái là công tắc.
  await expect(rows(page).first().locator('[data-mt-edit], [data-mt-del]')).toHaveCount(2);
  await expect(rows(page).first().locator('.vswitch.on')).toHaveCount(1);
  await expect(rows(page).first().locator('td:nth-child(4) a.link')).toHaveText('MS01_T01_HOAN_THANH');
  await expect(rows(page).first().locator('td:nth-child(7)')).toHaveText('MS01 - Đề xuất mua sắm');
  // Nhánh 10a chưa có luật (để demo Đối soát BPMN ở B4).
  expect(await page.evaluate(() => MaTran.rules().filter((r) => r.code.startsWith('MS01_T10A')).length)).toBe(0);
  expect(await mainText(page)).not.toMatch(BA);
  // Hai tab còn lại: màn Đang phát triển trong khung; route cũ chuyển hướng.
  await page.locator('.mt-tab', { hasText: 'Đối soát BPMN' }).click();
  await expect(page.locator('.mt-tab.on')).toHaveText('Đối soát BPMN');
  await expect(page.locator('.mt-soon h2')).toHaveText('Tính năng đang được phát triển');
  await page.goto(page.url().replace(/#.*$/, '') + '#/ph/ma-tran');
  await expect(page).toHaveURL(/#\/ma-tran\/display-rule$/);
});

test('SCR-43: tìm nhanh, tìm nâng cao 6 trường, làm mới, phân trang', async ({ page }) => {
  await as(page, 'qt', '#/ma-tran/display-rule');
  await page.locator('#mt-kw').fill('trả lại');
  await page.locator('#mt-kw').press('Enter');
  const kwCount = await rows(page).count();
  expect(kwCount).toBeGreaterThan(0);
  await expect(rows(page).locator('td:nth-child(6)')).toHaveText(Array(kwCount).fill('Trả lại'));
  await page.locator('[data-mt="adv"]').click();
  await expect(page.locator('#mt-kw')).toHaveCount(0);
  await expect(page.locator('[data-mt="adv"]')).toHaveText('Ẩn tìm kiếm nâng cao');
  await expect(page.locator('[data-mtadv] label')).toHaveText(['Mã luật', 'Mã hành động', 'Tên hành động', 'Quy trình áp dụng', 'Tên quy trình', 'Trạng thái']);
  await page.locator('[data-mtf="act"]').fill('TRINH_KY');
  await page.locator('[data-mtadv] button[type="submit"]').click();
  const n = await rows(page).count();
  expect(n).toBeGreaterThan(3);
  await expect(rows(page).locator('td:nth-child(5)')).toHaveText(Array(n).fill('TRINH_KY'));
  await page.locator('[data-mtf="rule"]').fill('T60');
  await page.locator('[data-mtadv] button[type="submit"]').click();
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).locator('td:nth-child(4)')).toHaveText('MS01_T60_TRINH_KY');
  await page.locator('[data-mt="reset"]').click();
  await expect(page.locator('[data-mtf="rule"]')).toHaveValue('');
  await expect(rows(page)).toHaveCount(10);
  await page.locator('[data-pager="mt"] [data-pg="2"]').first().click();
  await expect(rows(page).first().locator('td.ord')).toHaveText('11');
});

test('SCR-43: công tắc Trạng thái hỏi xác nhận (Không → trả lại), xoá luật', async ({ page }) => {
  await as(page, 'qt', '#/ma-tran/display-rule');
  const sw = rows(page).first().locator('.vswitch');
  await sw.click();
  await expect(confirmDlg(page).locator('h2')).toHaveText('Dừng hoạt động');
  await expect(confirmDlg(page).locator('p')).toHaveText('Bạn có chắc chắn muốn dừng hoạt động luật hiển thị hành động: MS01_T01_HOAN_THANH không?');
  await confirmDlg(page).locator('.vconfirm-b.ghost').click();
  await expect(rows(page).first().locator('.vswitch')).toHaveClass(/on/);
  await rows(page).first().locator('.vswitch').click();
  await confirmDlg(page).locator('#cf-ok').click();
  await expect(rows(page).first().locator('.vswitch')).not.toHaveClass(/on/);
  expect(await lastToast(page)).toContain('Cập nhật trạng thái thành công');
  // Lọc Vô hiệu hóa → đúng 1 dòng; kích hoạt lại.
  await page.locator('[data-mt="adv"]').click();
  await pick(page, 'mt-st', 'INACTIVE');
  await page.locator('[data-mtadv] button[type="submit"]').click();
  await expect(rows(page)).toHaveCount(1);
  await rows(page).first().locator('.vswitch').click();
  await expect(confirmDlg(page).locator('h2')).toHaveText('Kích hoạt');
  await confirmDlg(page).locator('#cf-ok').click();
  await expect(page.locator('.mt-table .vtable-empty')).toHaveCount(1);
  await page.locator('[data-mt="reset"]').click();
  const before = await page.evaluate(() => MaTran.rules().length);
  await rows(page).first().locator('[data-mt-del]').click();
  await expect(confirmDlg(page).locator('p')).toHaveText('Bạn có chắc chắn muốn xóa luật hiển thị hành động: MS01_T01_HOAN_THANH không?');
  await confirmDlg(page).locator('#cf-ok').click();
  expect(await lastToast(page)).toContain('Xóa thành công');
  await expect(total(page)).toHaveText(`Tổng số bản ghi: ${before - 1}`);
});

test('SCR-44 Thêm mới: bắt buộc, Loại theo Hành động, bước lọc theo quy trình, mã viết hoa, trùng mã bị chặn', async ({ page }) => {
  await as(page, 'qt', '#/ma-tran/display-rule');
  await page.locator('main .pg > .pg-head .r .vbtn.primary').click();
  await expect(page).toHaveURL(/#\/ma-tran\/display-rule\/create$/);
  await expect(page.locator('.mt-tabs')).toHaveCount(0);
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới luật hiển thị hành động');
  await expect(page.locator('main .pg-head .r .vbtn')).toHaveText(['Huỷ', 'Lưu']);
  await expect(page.locator('.mt-form label')).toHaveText(['Hành động', 'Tên hiển thị', 'Loại', 'Mã luật hành động', 'Màn hình hiển thị', 'Quy trình áp dụng',
    'Bước trong điều kiện', 'Biểu mẫu sử dụng', 'Vai trò thực hiện']);
  // Thêm mới không có Trạng thái và Xem trước.
  await expect(page.locator('[data-mt-status], [data-mt-preview]')).toHaveCount(0);
  await page.locator('[data-mt-save]').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn Hành động.', 'Bạn cần nhập Tên hiển thị.', 'Bạn cần chọn Loại.', 'Bạn cần nhập Mã luật hành động.',
    'Bạn cần chọn Màn hình hiển thị.', 'Bạn cần chọn Quy trình áp dụng.', 'Bạn cần chọn Bước trong điều kiện.']);
  await pick(page, 'mtf-action', 'SUA_LAI');
  await expect(page.locator('[data-vsel="mtf-type"]')).toHaveText('Hành động chi tiết');
  await expect(page.locator('[data-vsel="mtf-type"]')).toHaveClass(/dis/);
  await page.locator('[data-mt-in="name"]').fill('Sửa lại');
  await page.locator('[data-mt-in="code"]').fill('ms01_t10a_sửa lại');
  await expect(page.locator('[data-mt-in="code"]')).toHaveValue('MS01_T10A_SUALAI');
  await pick(page, 'mtf-screen', 'TASK');
  await page.locator('[data-vsel="mtf-step"]').click();
  await expect(page.locator('.vsel-panel .vsel-empty')).toHaveText('Không có dữ liệu');
  await page.locator('[data-vsel="mtf-step"]').click();
  await pick(page, 'mtf-proc', 'MS01');
  await pick(page, 'mtf-step', 'Activity_10a');
  await pick(page, 'mtf-roles', 'R-DVDX-CQ');
  await page.keyboard.press('Escape');
  await page.locator('.pg-title').click();
  // Đổi quy trình → xoá bước đã chọn.
  await pick(page, 'mtf-proc', 'MS02');
  await expect(page.locator('[data-vsel="mtf-step"]')).toHaveText('Chọn bước');
  await pick(page, 'mtf-proc', 'MS01');
  await pick(page, 'mtf-step', 'Activity_10a');
  await expect(page.locator('.vfield.invalid')).toHaveCount(0);
  await page.locator('[data-mt-save]').click();
  expect(await lastToast(page)).toContain('Thêm mới thành công');
  await expect(page).toHaveURL(/#\/ma-tran\/display-rule$/);
  await expect(rows(page).first().locator('td:nth-child(4)')).toHaveText('MS01_T10A_SUALAI');
  await expect(rows(page).first().locator('td:nth-child(8)')).toHaveText('28/09/2026');
  // Trùng mã: báo lỗi, giữ nguyên form.
  await page.goto(page.url().replace(/#.*$/, '') + '#/ma-tran/display-rule/create');
  await pick(page, 'mtf-action', 'GUI_DUYET');
  await page.locator('[data-mt-in="name"]').fill('Gửi chỉ huy duyệt');
  await page.locator('[data-mt-in="code"]').fill('MS01_T11_GUI_DUYET');
  await pick(page, 'mtf-screen', 'TASK');
  await pick(page, 'mtf-proc', 'MS01');
  await pick(page, 'mtf-step', 'Activity_11');
  await page.locator('[data-mt-save]').click();
  expect(await lastToast(page)).toContain('Mã luật hành động MS01_T11_GUI_DUYET đã tồn tại.');
  await expect(page).toHaveURL(/\/create$/);
  // Huỷ khi đã nhập → hỏi xác nhận.
  await page.locator('[data-mt-cancel].vbtn.secondary').click();
  await expect(confirmDlg(page).locator('h2')).toHaveText('Bạn có chắc muốn hủy?');
  await expect(confirmDlg(page).locator('p')).toHaveText('Thông tin đã nhập sẽ không được lưu lại.');
  await confirmDlg(page).locator('.vconfirm-b.ghost').click();
  await expect(page).toHaveURL(/\/create$/);
  await page.locator('.vbtn.back').click();
  await confirmDlg(page).locator('#cf-ok').click();
  await expect(page).toHaveURL(/#\/ma-tran\/display-rule$/);
});

test('SCR-44 Xem / Chỉnh sửa: nhãn-giá trị, chip vai trò, Xem trước theo Tên hiển thị, mã khoá khi sửa', async ({ page }) => {
  await as(page, 'qt', '#/ma-tran/display-rule');
  await page.locator('#mt-kw').fill('MS01_T13');
  await page.locator('#mt-kw').press('Enter');
  await rows(page).first().locator('td:nth-child(4) a.link').click();
  await expect(page).toHaveURL(/display-rule\/\d+\/view$/);
  await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết luật hiển thị nút');
  await expect(page.locator('main .pg-head .r .vbtn')).toHaveText(['Chỉnh sửa']);
  await expect(page.locator('main input, main [data-vsel]')).toHaveCount(0);
  await expect(page.locator('.mt-ro .k').first()).toHaveText('Hành động');
  await expect(page.locator('[data-mt-preview]')).toHaveText('Đồng ý');
  await expect(page.locator('.mt-chip').first()).toHaveText('R-DVDX-CH - Chỉ huy ĐVĐX');
  await expect(page.locator('.vswitch.ro')).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('main .pg-head .r .vbtn').click();
  await expect(page).toHaveURL(/\/edit$/);
  await expect(page.locator('.pg-title')).toHaveText('Chỉnh sửa luật hiển thị hành động');
  await expect(page.locator('[data-mt-in="code"]')).toBeDisabled();
  await page.locator('[data-mt-in="name"]').fill('Đồng ý đề xuất');
  await expect(page.locator('[data-mt-preview]')).toHaveText('Đồng ý đề xuất');
  await page.locator('[data-mt-in="name"]').fill('');
  await page.locator('[data-mt-in="name"]').blur();
  await expect(page.locator('[data-mt-field="name"] .msg')).toHaveText('Bạn cần nhập Tên hiển thị.');
  await page.locator('[data-mt-in="name"]').fill('Đồng ý đề xuất');
  await page.locator('[data-mt-status]').click();
  await page.locator('[data-mt-save]').click();
  expect(await lastToast(page)).toContain('Cập nhật thành công');
  const r = await page.evaluate(() => MaTran.rules().find((x) => x.code === 'MS01_T13_XAC_NHAN'));
  expect(r.name).toBe('Đồng ý đề xuất');
  expect(r.active).toBe(false);
  expect(r.updated).toBe('28/09/2026');
});

test('Ma trận hành động: vai khác Quản trị hệ thống không được cấp quyền', async ({ page }) => {
  await as(page, 'lan', '#/ma-tran/display-rule');
  await expect(page.locator('.ov-empty')).toHaveText('Bạn chưa được cấp quyền truy cập chức năng này');
  await page.goto(page.url().replace(/#.*$/, '') + '#/ma-tran/display-rule/create');
  await expect(page.locator('.ov-empty')).toHaveText('Bạn chưa được cấp quyền truy cập chức năng này');
});
