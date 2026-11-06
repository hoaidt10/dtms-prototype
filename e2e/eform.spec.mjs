// T10 B1–B3 — Quản lý E-Form: SCR-49 Danh sách biểu mẫu e-form + SCR-53 Lịch sử + SCR-50 hộp thoại Thêm mới / Chỉnh sửa
// + SCR-51 Thiết kế biểu mẫu + SCR-52 Xem trước,
// theo ecat common-catalog/catalogs/e-form.
// Plan docs/dtms/prototype-EFORM-chuan-bi.md (D-4 menu Hồ sơ & biểu mẫu, P-47 chặn xoá biểu mẫu đang dùng, P-48 chỉ Quản trị hệ thống).
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { fresh, lastToast, INDEX } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const asAdmin = async (page, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('qt'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const row = (page, code) => page.locator(`.ef-table tbody tr[data-code="${code}"]`);
const rows = (page) => page.locator('.ef-table tbody tr[data-code]');

test('D-42: mục Quản lý E-form ở sidebar phân hệ Danh mục dùng chung mở #/eform; route cũ #/ph/eform chuyển hướng', async ({ page }) => {
  await asAdmin(page, '#/dmdc');
  await expect(page.locator('.sb-nav [data-go="eform"] .l')).toHaveText('Quản lý E-form');
  await page.locator('.sb-nav [data-go="eform"]').click();
  await expect(page).toHaveURL(/#\/eform$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách biểu mẫu e-form');
  await expect(page.locator('.sb-nav [data-go="eform"]')).toHaveClass(/active/);
  await page.evaluate(() => { location.hash = '#/ph/eform'; });
  await expect(page).toHaveURL(/#\/eform$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách biểu mẫu e-form');
  expect(page.errors).toEqual([]);
});

test('P-48: vai khác Quản trị hệ thống thấy thông báo chưa được cấp quyền', async ({ page }) => {
  await fresh(page, '#/eform');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách biểu mẫu e-form');
  await expect(page.locator('.ov-empty')).toHaveText('Bạn chưa được cấp quyền truy cập chức năng này');
  await expect(page.locator('.ef-table')).toHaveCount(0);
});

test('SCR-49: tiêu đề, nút, cột theo e-form-list; 12 biểu mẫu, phân trang 20 → 10', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await expect(page.locator('.pg-head .r .vbtn')).toHaveText([/Nhập biểu mẫu/, /Xuất excel/, /Thêm mới/]);
  await expect(page.locator('.ef-table th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã biểu mẫu', 'Tên biểu mẫu', 'Loại', 'Số trường']);
  await expect(page.locator('#ef-kw')).toHaveAttribute('placeholder', 'Tìm kiếm theo mã biểu mẫu, tên...');
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 12');
  await expect(page.locator('.vpager .ps-t')).toHaveText('20');
  await expect(rows(page)).toHaveCount(12);
  // 4 icon thao tác theo thứ tự source; Số trường tính từ thiết kế (BM-04: 7 mục + Kết luận; BM-01: 6 trường).
  expect(await row(page, 'BM-04').locator('.ef-acts button').evaluateAll((bs) => bs.map((b) => b.title))).toEqual(['Thiết kế', 'Chỉnh sửa', 'Xem lịch sử', 'Xoá']);
  await expect(row(page, 'BM-04').locator('td').last()).toHaveText('8');
  await expect(row(page, 'BM-01').locator('td').last()).toHaveText('6');
  await expect(row(page, 'BM-01-V0').locator('.vswitch')).not.toHaveClass(/on/);
  await page.locator('.vpager .ps-t').click();
  await expect(page.locator('.vpager .ps-l li')).toHaveText(['10', '20', '50', '100']);
  await page.locator('.vpager [data-ps="10"]').click();
  await expect(rows(page)).toHaveCount(10);
  await page.locator('.vpager [data-pg="2"]').first().click();
  await expect(rows(page)).toHaveCount(2);
  expect(page.errors).toEqual([]);
});

test('SCR-49: lọc Trạng thái áp ngay; ô tìm lọc ngay khi gõ theo mã, tên, loại', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await page.locator('#ef-kw').pressSequentially('checklist');
  await expect(rows(page)).toHaveCount(2);
  await expect(page.locator('#ef-kw')).toBeFocused();
  await page.locator('#ef-kw').fill('');
  await expect(rows(page)).toHaveCount(12);
  await page.locator('#ef-kw').fill('Công văn');
  await expect(rows(page)).toHaveCount(2);
  await page.locator('#ef-kw').fill('');
  await page.locator('[data-vsel="ef-st"]').click();
  await page.locator('.vsel-panel [data-opt="INACTIVE"]').click();
  await expect(rows(page)).toHaveCount(1);
  await expect(row(page, 'BM-01-V0')).toBeVisible();
  await page.locator('[data-vsel-clear="ef-st"]').click();
  await expect(rows(page)).toHaveCount(12);
});

test('SCR-49: công tắc trạng thái hỏi xác nhận, toast theo source, lưu qua tải lại', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await row(page, 'BM-02').locator('.vswitch').click();
  await expect(page.locator('.vconfirm')).toContainText('Bạn có chắc chắn muốn dừng hoạt động biểu mẫu e-form: Thuyết minh / phụ lục giải trình - BM-02 không?');
  await page.locator('.vconfirm [data-close]').last().click();
  await expect(row(page, 'BM-02').locator('.vswitch')).toHaveClass(/on/);
  await row(page, 'BM-02').locator('.vswitch').click();
  await page.locator('.vconfirm #cf-ok').click();
  await expect(row(page, 'BM-02').locator('.vswitch')).not.toHaveClass(/on/);
  expect(await lastToast(page)).toContain('Dừng hoạt động biểu mẫu e-form thành công');
  await page.reload();
  await expect(row(page, 'BM-02').locator('.vswitch')).not.toHaveClass(/on/);
});

test('P-47: xoá biểu mẫu đang gắn bước quy trình bị chặn; biểu mẫu không dùng xoá được', async ({ page }) => {
  await asAdmin(page, '#/eform');
  expect(await page.evaluate(() => [EForm.usedIn('BM-06').length > 0, EForm.usedIn('CL-02').length > 0, EForm.usedIn('BM-01-V0').length])).toEqual([true, true, 0]);
  await row(page, 'BM-01').locator('[data-ef-del]').click();
  await expect(page.locator('.vconfirm')).toContainText('Bạn có chắc chắn muốn xóa biểu mẫu e-form: Tờ trình đề xuất mua sắm - BM-01 không?');
  await page.locator('.vconfirm #cf-ok').click();
  await expect.poll(() => lastToast(page)).toContain('đang được sử dụng');
  await expect(row(page, 'BM-01')).toBeVisible();
  await row(page, 'BM-01-V0').locator('[data-ef-del]').click();
  await page.locator('.vconfirm #cf-ok').click();
  await expect(row(page, 'BM-01-V0')).toHaveCount(0);
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 11');
  expect(await lastToast(page)).toContain('Xoá biểu mẫu e-form thành công');
  // Khôi phục dữ liệu E-Form ở nút công cụ demo.
  await page.locator('#demo').click();
  await page.locator('#reset-eform').click();
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 12');
});

test('SCR-49: Xuất excel tải CSV của danh sách đang lọc', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await page.locator('#ef-kw').fill('checklist');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('[data-ef-export]').click()]);
  expect(dl.suggestedFilename()).toMatch(/^Danh_sach_bieu_mau_eform_\d+\.csv$/);
  const lines = readFileSync(await dl.path(), 'utf8').replace(/^﻿/, '').split('\n');
  expect(lines[0]).toBe('STT,Mã biểu mẫu,Tên biểu mẫu,Loại,Số trường,Trạng thái');
  expect(lines).toHaveLength(3);
  expect(lines[1]).toBe('1,"CL-01","Checklist 01 — danh mục hồ sơ (≥ 160 tỷ)","Checklist",2,"Hoạt động"');
  expect(await lastToast(page)).toContain('Xuất file thành công');
});

test('SCR-53: Xem lịch sử mở hộp thoại theo e-form-history-dialog', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await row(page, 'BM-04').locator('[data-ef-hist]').click();
  const m = page.locator('.vmodal.w580');
  await expect(m.locator('.vmodal-h h3')).toHaveText('Lịch sử cập nhật biểu mẫu - BM-04');
  await expect(m.locator('.ef-hist-box > div').first()).toContainText(/Tên biểu mẫu:\s*Phiếu nhận xét/);
  await expect(m.locator('.ef-hist-box > div').nth(1)).toContainText(/Loại:\s*Phiếu/);
  await expect(m.locator('.ef-tl-i')).toHaveCount(3);
  await expect(m.locator('.ef-tl-i .a')).toHaveText(['Cập nhật cấu hình biểu mẫu (v1.2)', 'Cập nhật cấu hình biểu mẫu (v1.1)', 'Tạo mới biểu mẫu (v1.0)']);
  await expect(m.locator('.ef-tl-by').first()).toHaveText('Người thực hiện: Đặng Thu Trang (Quản trị hệ thống)');
  await m.locator('.vmodal-acts .vbtn', { hasText: 'Hủy' }).click();
  await expect(page.locator('.overlay')).toHaveCount(0);
});

// ---------- B2: SCR-50 hộp thoại Thêm mới / Chỉnh sửa (e-form-dialog) ----------
const dlg = (page) => page.locator('.vmodal.w560');
const fieldMsg = (page, k) => dlg(page).locator(`[data-eff="${k}"] .msg`);
const pick = async (page, k, label) => {
  await dlg(page).locator(`[data-vsel="eff-${k}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: label }).click();
};
const fileIn = (page) => dlg(page).locator('[data-ef-file]');
const buf = (n) => Buffer.alloc(n, 1);

test('SCR-50: Thêm mới — bố cục theo e-form-dialog, kiểm tra bắt buộc / định dạng, Tạo & thiết kế → màn Thiết kế', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await page.locator('[data-ef-new]').click();
  await expect(dlg(page).locator('.vmodal-h h3')).toHaveText('Thêm mới biểu mẫu');
  await expect(dlg(page).locator('.vfield > .lr label')).toHaveText(['Loại biểu mẫu', 'Loại hồ sơ', 'Mã biểu mẫu', 'Tên biểu mẫu', 'Mô tả', 'File mẫu']);
  await expect(dlg(page).locator('.vfield .req')).toHaveCount(4);
  await expect(dlg(page).locator('.vmodal-acts .vbtn')).toHaveText(['Hủy', 'Tạo & thiết kế']);
  await expect(dlg(page).locator('.ef-drop')).toContainText('Tải lên hoặc kéo tài liệu');
  // Bấm Tạo khi trống: lỗi dưới cả 4 trường bắt buộc, hộp thoại giữ nguyên.
  await dlg(page).locator('#ef-save').click();
  await expect(fieldMsg(page, 'formType')).toHaveText('Bạn cần chọn Loại biểu mẫu.');
  await expect(fieldMsg(page, 'docType')).toHaveText('Bạn cần chọn Loại hồ sơ.');
  await expect(fieldMsg(page, 'code')).toHaveText('Bạn cần nhập Mã biểu mẫu.');
  await expect(fieldMsg(page, 'name')).toHaveText('Bạn cần nhập Tên biểu mẫu.');
  await expect(fieldMsg(page, 'description')).toBeHidden();
  // Loại biểu mẫu / Loại hồ sơ theo danh mục ĐTMS (§3.1, D-10).
  await dlg(page).locator('[data-vsel="eff-formType"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Tờ trình', 'Thuyết minh', 'Phiếu', 'Báo cáo', 'Công văn', 'Quyết định', 'Checklist']);
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Phiếu' }).click();
  await expect(fieldMsg(page, 'formType')).toBeHidden();
  await dlg(page).locator('[data-vsel="eff-docType"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Phê duyệt ĐXMS', 'Điều chỉnh ĐXMS']);
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Điều chỉnh ĐXMS' }).click();
  // Mã: bỏ dấu, bỏ khoảng trắng, viết hoa; ký tự lạ → không đúng định dạng.
  const code = dlg(page).locator('[data-effi="code"]');
  await code.pressSequentially('bm đc.1');
  await expect(code).toHaveValue('BMDC.1');
  await code.blur();
  await expect(fieldMsg(page, 'code')).toHaveText('Mã biểu mẫu không đúng định dạng.');
  await code.fill('BM-DC-01');
  await expect(fieldMsg(page, 'code')).toBeHidden();
  await expect(code).toHaveAttribute('maxlength', '50');
  await expect(dlg(page).locator('[data-effi="name"]')).toHaveAttribute('maxlength', '255');
  await expect(dlg(page).locator('[data-effi="description"]')).toHaveAttribute('maxlength', '500');
  await dlg(page).locator('[data-effi="name"]').fill('Phiếu đề nghị điều chỉnh ĐXMS');
  await fileIn(page).setInputFiles({ name: 'BM-DC-01_Phieu-dieu-chinh.docx', mimeType: 'application/octet-stream', buffer: buf(2048) });
  await dlg(page).locator('#ef-save').click();
  // Thêm mới → toast + mở màn Thiết kế của biểu mẫu mới (B3 dựng màn này).
  await expect(page.locator('.overlay')).toHaveCount(0);
  expect(await lastToast(page)).toContain('Thêm mới biểu mẫu e-form thành công');
  await expect(page).toHaveURL(/#\/eform\/13\/thiet-ke$/);
  await expect(page.locator('.sb-nav [data-go="eform"]')).toHaveClass(/active/);
  // Quay lại danh sách: biểu mẫu mới ở đầu, Đang hoạt động, 0 trường, lịch sử Tạo mới v1.0.
  await page.goBack();
  await expect(rows(page).first()).toHaveAttribute('data-code', 'BM-DC-01');
  await expect(row(page, 'BM-DC-01').locator('td')).toHaveText(['1', '', '', 'BM-DC-01', 'Phiếu đề nghị điều chỉnh ĐXMS', 'Phiếu', '0']);
  await expect(row(page, 'BM-DC-01').locator('.vswitch')).toHaveClass(/on/);
  expect(await page.evaluate(() => { const r = EForm.rows().find((x) => x.code === 'BM-DC-01'); return [r.docType, r.file, r.history.length, r.history[0].version]; }))
    .toEqual(['Điều chỉnh ĐXMS', 'BM-DC-01_Phieu-dieu-chinh.docx', 1, 'v1.0']);
  await page.reload();
  await expect(row(page, 'BM-DC-01')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('SCR-50: File mẫu — sai đuôi, quá 5MB báo lỗi dưới vùng tải; kéo-thả nhận tệp; nút xoá tệp', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await page.locator('[data-ef-new]').click();
  const err = dlg(page).locator('.ef-file-err');
  await fileIn(page).setInputFiles({ name: 'mau.pdf', mimeType: 'application/pdf', buffer: buf(10) });
  await expect(err).toHaveText('Tập tin không đúng định dạng (.xlsx, .xls, .doc, .docx)');
  await expect(dlg(page).locator('.ef-file')).toHaveCount(0);
  await fileIn(page).setInputFiles({ name: 'mau-lon.docx', mimeType: 'application/octet-stream', buffer: buf(5 * 1024 * 1024 + 1) });
  await expect(err).toHaveText('Dung lượng tập tin vượt quá 5MB');
  // Kéo-thả tệp .xlsx vào vùng tải.
  await dlg(page).locator('[data-ef-drop]').evaluate((z) => {
    const dt = new DataTransfer();
    dt.items.add(new File(['x'], 'Checklist-03.xlsx'));
    z.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt, bubbles: true, cancelable: true }));
    z.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
  });
  await expect(err).toBeHidden();
  await expect(dlg(page).locator('.ef-file .nm')).toHaveText('Checklist-03.xlsx');
  await expect(dlg(page).locator('.ef-drop')).not.toHaveClass(/drag/);
  await dlg(page).locator('[data-ef-file-rm]').click();
  await expect(dlg(page).locator('.ef-file')).toHaveCount(0);
  await expect(dlg(page).locator('.ef-drop')).toContainText('Tải lên hoặc kéo tài liệu');
  expect(page.errors).toEqual([]);
});

test('SCR-50: P-44 mã duy nhất theo cặp (Loại hồ sơ, Mã) — trùng báo lỗi dưới ô Mã', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await page.locator('[data-ef-new]').click();
  await pick(page, 'formType', 'Tờ trình');
  await pick(page, 'docType', 'Phê duyệt ĐXMS');
  await dlg(page).locator('[data-effi="code"]').fill('BM-01');
  await dlg(page).locator('[data-effi="name"]').fill('Tờ trình trùng mã');
  await dlg(page).locator('#ef-save').click();
  await expect(fieldMsg(page, 'code')).toHaveText('Mã biểu mẫu BM-01 đã tồn tại.');
  await expect(dlg(page)).toBeVisible();
  // Cùng mã nhưng Loại hồ sơ khác thì được tạo.
  await pick(page, 'docType', 'Điều chỉnh ĐXMS');
  await dlg(page).locator('#ef-save').click();
  await expect(page).toHaveURL(/#\/eform\/13\/thiet-ke$/);
  await page.goBack();
  await expect(row(page, 'BM-01')).toHaveCount(2);
});

test('SCR-50: Chỉnh sửa từ icon và link Mã — dữ liệu điền sẵn, Mã khoá, Lưu cập nhật danh sách', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await row(page, 'BM-05').locator('.ef-code').click();
  await expect(dlg(page).locator('.vmodal-h h3')).toHaveText('Chỉnh sửa biểu mẫu e-form');
  await expect(dlg(page).locator('.vmodal-acts .vbtn')).toHaveText(['Hủy', 'Lưu']);
  await expect(dlg(page).locator('[data-vsel="eff-formType"]')).toHaveText('Báo cáo');
  await expect(dlg(page).locator('[data-vsel="eff-docType"]')).toHaveText('Phê duyệt ĐXMS');
  await expect(dlg(page).locator('[data-effi="code"]')).toHaveValue('BM-05');
  await expect(dlg(page).locator('[data-effi="code"]')).toBeDisabled();
  await expect(dlg(page).locator('[data-effi="name"]')).toHaveValue('Báo cáo kết quả thẩm định');
  await expect(dlg(page).locator('.ef-file .nm')).toHaveText('BM-05_Bao-cao-ket-qua-tham-dinh.docx');
  // Không sửa gì → Hủy đóng ngay.
  await dlg(page).locator('.vmodal-acts .vbtn', { hasText: 'Hủy' }).click();
  await expect(page.locator('.overlay')).toHaveCount(0);
  await row(page, 'BM-05').locator('.ef-acts [data-ef-edit]').click();
  await dlg(page).locator('[data-effi="name"]').fill('Báo cáo kết quả thẩm định (sửa đổi)');
  await pick(page, 'formType', 'Phiếu');
  await dlg(page).locator('[data-effi="name"]').fill('');
  await dlg(page).locator('#ef-save').click();
  await expect(fieldMsg(page, 'name')).toHaveText('Bạn cần nhập Tên biểu mẫu.');
  await dlg(page).locator('[data-effi="name"]').fill('Báo cáo kết quả thẩm định (sửa đổi)');
  await dlg(page).locator('#ef-save').click();
  await expect(page.locator('.overlay')).toHaveCount(0);
  expect(await lastToast(page)).toContain('Cập nhật biểu mẫu e-form thành công');
  await expect(page).toHaveURL(/#\/eform$/);
  await expect(row(page, 'BM-05').locator('td').nth(4)).toHaveText('Báo cáo kết quả thẩm định (sửa đổi)');
  await expect(row(page, 'BM-05').locator('td').nth(5)).toHaveText('Phiếu');
  await expect(row(page, 'BM-05').locator('td').last()).toHaveText('4');
});

test('SCR-50: đóng khi đã nhập → hỏi xác nhận (Hủy, X, Esc); Tiếp tục chỉnh sửa giữ dữ liệu, Đóng bỏ thay đổi', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await page.locator('[data-ef-new]').click();
  await dlg(page).locator('[data-effi="name"]').fill('Nháp');
  const ask = page.locator('.vconfirm');
  await dlg(page).locator('.vmodal-acts .vbtn', { hasText: 'Hủy' }).click();
  await expect(ask.locator('h2')).toHaveText('Bạn có chắc muốn đóng popup này?');
  await expect(ask).toContainText('Các thay đổi bạn vừa thực hiện sẽ không được lưu lại.');
  await expect(ask.locator('.vconfirm-b')).toHaveText(['Tiếp tục chỉnh sửa', 'Đóng']);
  await ask.locator('.vconfirm-b', { hasText: 'Tiếp tục chỉnh sửa' }).click();
  await expect(ask).toHaveCount(0);
  await expect(dlg(page).locator('[data-effi="name"]')).toHaveValue('Nháp');
  // Esc: lần 1 hỏi, Esc lần 2 chỉ đóng hộp xác nhận.
  await page.keyboard.press('Escape');
  await expect(ask).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(ask).toHaveCount(0);
  await expect(dlg(page)).toBeVisible();
  await dlg(page).locator('.vmodal-x').click();
  await ask.locator('#cf-ok').click();
  await expect(page.locator('.overlay')).toHaveCount(0);
  await expect(rows(page)).toHaveCount(12);
  // Chưa nhập gì → Esc đóng ngay.
  await page.locator('[data-ef-new]').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.overlay')).toHaveCount(0);
});

/* ---------- B3: SCR-51 Thiết kế biểu mẫu + SCR-52 Xem trước (e-form-designer) ---------- */
const cards = (page) => page.locator('#efd-list [data-efd-field]');
const cardLabels = (page) => cards(page).locator('.lb').evaluateAll((xs) => xs.map((x) => x.firstChild.textContent.trim()));
const openDesign = async (page, code) => {
  await asAdmin(page, '#/eform');
  await row(page, code).locator('[data-ef-design]').click();
  await expect(page.locator('.efd-title')).toContainText('Thiết kế biểu mẫu');
};
const pickField = (page, label) => cards(page).filter({ has: page.locator('.lb', { hasText: label }) }).first();
// Kéo-thả bằng DragEvent khi đích nằm ngoài khung nhìn (dragTo cuộn trang giữa chừng làm Chromium huỷ kéo). where: 'top' | 'bottom' của đích.
const dnd = async (page, src, dst, where = 'bottom') => {
  await dst.scrollIntoViewIfNeeded();
  const s = await src.elementHandle(), d = await dst.elementHandle();
  await page.evaluate(([a, b, w]) => {
    const dt = new DataTransfer(), r = b.getBoundingClientRect();
    const fire = (el, type) => el.dispatchEvent(new DragEvent(type, { dataTransfer: dt, bubbles: true, cancelable: true, clientX: r.left + 10, clientY: w === 'top' ? r.top + 4 : r.bottom - 4 }));
    fire(a, 'dragstart'); fire(b, 'dragover'); fire(b, 'drop'); fire(a, 'dragend');
  }, [s, d, where]);
};

test('SCR-51: icon Thiết kế mở trang Thiết kế — thanh trên, Thông tin biểu mẫu, dock trái / canvas / dock phải theo source', async ({ page }) => {
  await openDesign(page, 'BM-04');
  await expect(page).toHaveURL(/#\/eform\/4\/thiet-ke$/);
  await expect(page.locator('.sb-nav [data-go="eform"]')).toHaveClass(/active/);
  await expect(page.locator('.efd-bar .r .vbtn')).toHaveText(['Huỷ', 'Xem trước', 'Lưu thiết kế']);
  await expect(page.locator('[data-efd-undo]')).toBeDisabled();
  await expect(page.locator('[data-efd-redo]')).toBeDisabled();
  // Card Thông tin biểu mẫu: 6 ô, thu gọn / mở lại được.
  await expect(page.locator('.efd-meta-g .k')).toHaveText(['Loại biểu mẫu', 'Loại hồ sơ', 'Mã biểu mẫu', 'Tên biểu mẫu', 'Mô tả', 'File đính kèm']);
  await expect(page.locator('.efd-meta-g .v')).toHaveText(['Phiếu', 'Phê duyệt ĐXMS', 'BM-04', 'Phiếu nhận xét', '--', 'BM-04_Phieu-nhan-xet.docx']);
  await page.locator('[data-efd-meta]').click();
  await expect(page.locator('.efd-meta-g')).toHaveCount(0);
  await page.locator('[data-efd-meta]').click();
  await expect(page.locator('.efd-meta-g')).toBeVisible();
  await expect(page.locator('.efd-tip')).toContainText('key = ketLuan');
  // Dock trái: 2 nhóm, 6 + 5 thành phần; tìm lọc theo nhãn; nhóm thu gọn được.
  await expect(page.locator('.efd-cat-h')).toHaveText(['Nhập liệu', 'Lựa chọn']);
  await expect(page.locator('.efd-dock-i')).toHaveText(['Ô chữ', 'Ô nhiều dòng', 'Số', 'Ngày / giờ', 'Biểu thức (tự tính)', 'Tải tệp',
    'Hộp kiểm', 'Danh sách kiểm', 'Chọn một (radio)', 'Danh sách thả xuống', 'Nhận nhiều chọn']);
  await expect(page.locator('#efd-kw')).toHaveAttribute('placeholder', 'Tìm thành phần');
  await page.locator('#efd-kw').fill('danh sách');
  await expect(page.locator('.efd-dock-i')).toHaveText(['Danh sách kiểm', 'Danh sách thả xuống']);
  await page.locator('#efd-kw').fill('');
  await page.locator('[data-efd-cat="choice"]').click();
  await expect(page.locator('.efd-dock-i')).toHaveCount(6);
  // Canvas: tờ giấy mã — tên + đơn vị; 8 trường (7 mục + Kết luận); trường đầu được chọn → dock phải.
  await expect(page.locator('.efd-paper-h h3')).toHaveText('BM-04 — Phiếu nhận xét');
  await expect(page.locator('.efd-paper-h p')).toHaveText('Tổng Công ty Công nghiệp Công nghệ cao Viettel (TCT VHT)');
  await expect(cards(page)).toHaveCount(8);
  await expect(page.locator('.efd-drop-end')).toHaveText('Kéo thành phần vào đây');
  await expect(cards(page).first()).toHaveClass(/on/);
  await expect(page.locator('.efd-right-h h3')).toHaveText('Thuộc tính trường');
  await expect(page.locator('.efd-sec-p h4')).toHaveText(['Chung', 'Kiểm tra hợp lệ', 'Ẩn/hiện có điều kiện (feel)']);
  await expect(page.locator('#efd-sw-required')).toHaveClass(/on/);
  // Đóng dock phải → trạng thái rỗng; bấm trường khác → chọn trường đó.
  await page.locator('[data-efd-close]').click();
  await expect(page.locator('.efd-right.empty')).toContainText('Chưa chọn trường nào');
  await pickField(page, 'Kết luận').click();
  await expect(page.locator('.efd-badge')).toHaveText('Kết luận');
  await expect(page.locator('.efd-key')).toHaveText('id: ketLuan');
  await expect(pickField(page, 'Kết luận').locator('.vradio-opt')).toHaveText(['Đồng ý', 'Không đồng ý']);
  expect(page.errors).toEqual([]);
});

test('SCR-51: kéo-thả thêm thành phần vào vị trí, đổi thứ tự; Hoàn tác / Làm lại', async ({ page }) => {
  await openDesign(page, 'BM-03');
  expect(await cardLabels(page)).toEqual(['Danh sách CQCM', 'Hạn góp ý', 'Nội dung đề nghị thẩm định']);
  // Thả "Số" lên nửa trên của trường thứ 2 → chèn vào vị trí 2, được chọn, toast theo source.
  await page.locator('[data-efd-new="number"]').dragTo(cards(page).nth(1), { targetPosition: { x: 40, y: 8 } });
  expect(await cardLabels(page)).toEqual(['Danh sách CQCM', 'Số', 'Hạn góp ý', 'Nội dung đề nghị thẩm định']);
  await expect(cards(page).nth(1)).toHaveClass(/on/);
  await expect(page.locator('.efd-key')).toHaveText(/^id: field_\d{4}$/);
  expect(await lastToast(page)).toContain('Đã thêm trường "Số" vào biểu mẫu');
  // Thả vào ô "Kéo thành phần vào đây" → thêm cuối.
  await dnd(page, page.locator('[data-efd-new="file"]'), page.locator('.efd-drop-end'));
  expect((await cardLabels(page)).pop()).toBe('Tải tệp');
  await expect(page.locator('.efd-sec-p h4')).toHaveText(['Chung', 'Cài đặt', 'Kiểm tra hợp lệ', 'Ẩn/hiện có điều kiện (feel)']);
  // Kéo trường cuối lên đầu → đổi thứ tự.
  await dnd(page, cards(page).nth(4), cards(page).first(), 'top');
  expect(await cardLabels(page)).toEqual(['Tải tệp', 'Danh sách CQCM', 'Số', 'Hạn góp ý', 'Nội dung đề nghị thẩm định']);
  // Hoàn tác 3 lần về ban đầu; Làm lại 1 lần.
  for (let i = 0; i < 3; i++) await page.locator('[data-efd-undo]').click();
  expect(await cardLabels(page)).toEqual(['Danh sách CQCM', 'Hạn góp ý', 'Nội dung đề nghị thẩm định']);
  await expect(page.locator('[data-efd-undo]')).toBeDisabled();
  await page.locator('[data-efd-redo]').click();
  expect(await cardLabels(page)).toEqual(['Danh sách CQCM', 'Số', 'Hạn góp ý', 'Nội dung đề nghị thẩm định']);
  expect(page.errors).toEqual([]);
});

test('SCR-51: dock phải theo loại trường; sửa thuộc tính cập nhật canvas; Xoá thành phần', async ({ page }) => {
  await openDesign(page, 'BM-01');
  // Ngày / giờ: có Cài đặt ngày giờ, không có Placeholder / độ dài.
  await pickField(page, 'Thời gian thực hiện').click();
  await expect(page.locator('.efd-sec-p h4')).toHaveText(['Chung', 'Cài đặt ngày giờ', 'Kiểm tra hợp lệ', 'Ẩn/hiện có điều kiện (feel)']);
  await expect(page.locator('[data-efd-p="placeholder"]')).toHaveCount(0);
  await expect(page.locator('[data-efd-p="minLength"]')).toHaveCount(0);
  await expect(page.locator('[data-vsel="efd-fmt"]')).toHaveText('Tháng và năm (mm/yyyy)');
  await page.locator('[data-vsel="efd-fmt"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Ngày (dd/mm/yyyy)', 'Ngày và giờ (dd/mm/yyyy HH:mm)', 'Tháng và năm (mm/yyyy)', 'Năm (yyyy)']);
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Năm (yyyy)' }).click();
  await expect(pickField(page, 'Thời gian thực hiện').locator('input')).toHaveAttribute('placeholder', 'YYYY');
  // Ô nhiều dòng: Placeholder + độ dài (chỉ nhận số); gõ Nhãn cập nhật canvas và badge tại chỗ, một bước hoàn tác.
  await pickField(page, 'Sự cần thiết').click();
  await expect(page.locator('.efd-sec-p h4')).toHaveText(['Chung', 'Kiểm tra hợp lệ', 'Ẩn/hiện có điều kiện (feel)']);
  await page.locator('[data-efd-p="maxLength"]').pressSequentially('2a000');
  await expect(page.locator('[data-efd-p="maxLength"]')).toHaveValue('2000');
  const lbl = page.locator('[data-efd-p="label"]');
  await lbl.fill('');
  await lbl.pressSequentially('Sự cần thiết đầu tư');
  await expect(lbl).toBeFocused();
  await expect(page.locator('.efd-badge')).toHaveText('Sự cần thiết đầu tư');
  await expect(cards(page).nth(1).locator('.lb')).toContainText('Sự cần thiết đầu tư');
  await page.locator('[data-efd-p="placeholder"]').fill('Nêu sự cần thiết');
  await expect(cards(page).nth(1).locator('textarea')).toHaveAttribute('placeholder', 'Nêu sự cần thiết');
  // Tắt Bắt buộc nhập → mất dấu *.
  await expect(cards(page).nth(1).locator('.req')).toHaveCount(1);
  await page.locator('#efd-sw-required').click();
  await expect(cards(page).nth(1).locator('.req')).toHaveCount(0);
  await page.locator('[data-efd-undo]').click(); // bật lại Bắt buộc
  await page.locator('[data-efd-undo]').click(); // bỏ placeholder
  await page.locator('[data-efd-undo]').click(); // bỏ cả chuỗi gõ Nhãn
  await expect(cards(page).nth(1).locator('.lb')).toContainText('Sự cần thiết');
  await expect(cards(page).nth(1).locator('.lb')).not.toContainText('đầu tư');
  // Tải tệp: Cài đặt Nhiều tệp.
  await pickField(page, 'Tệp phụ lục chi phí').click();
  await expect(page.locator('#efd-sw-multiple')).toHaveClass(/on/);
  // Xoá thành phần → toast, dock phải rỗng.
  await page.locator('[data-efd-del]').click();
  expect(await lastToast(page)).toContain('Đã xoá thành phần khỏi biểu mẫu');
  await expect(cards(page)).toHaveCount(5);
  await expect(page.locator('.efd-right.empty')).toBeVisible();
  // Nút xoá hiện khi rê chuột trên trường.
  await cards(page).first().hover();
  await cards(page).first().locator('[data-efd-rm]').click();
  await expect(cards(page)).toHaveCount(4);
  expect(page.errors).toEqual([]);
});

test('SCR-51: Lưu thiết kế → tăng phiên bản, thêm lịch sử, Số trường cập nhật; không đổi thì giữ phiên bản', async ({ page }) => {
  await openDesign(page, 'BM-04');
  await page.locator('[data-efd-save]').click();
  expect(await lastToast(page)).toContain('Lưu thiết kế biểu mẫu thành công!');
  expect(await page.evaluate(() => EForm.rows().find((r) => r.code === 'BM-04').history[0].version)).toBe('v1.2');
  await dnd(page, page.locator('[data-efd-new="text"]'), page.locator('.efd-drop-end'));
  await page.locator('[data-efd-p="label"]').fill('Người nhận xét');
  await page.locator('[data-efd-save]').click();
  // Đã lưu → quay lại không hỏi xác nhận.
  await page.locator('.efd-back').click();
  await expect(page).toHaveURL(/#\/eform$/);
  await expect(row(page, 'BM-04').locator('td').last()).toHaveText('9');
  await row(page, 'BM-04').locator('[data-ef-hist]').click();
  await expect(page.locator('.ef-tl-i').first()).toContainText('Cập nhật cấu hình biểu mẫu (v1.3)');
  await expect(page.locator('.ef-tl-i').first()).toContainText('Cập nhật thiết kế: thêm 1 trường (tổng 9 trường).');
  await page.keyboard.press('Escape');
  // Lưu qua tải lại trang; mở lại thiết kế thấy trường mới.
  await page.reload();
  await row(page, 'BM-04').locator('[data-ef-design]').click();
  await expect(cards(page)).toHaveCount(9);
  await expect(cards(page).last().locator('.lb')).toHaveText('Người nhận xét');
  expect(page.errors).toEqual([]);
});

test('SCR-51: rời màn khi chưa lưu (quay lại, Huỷ) → hỏi xác nhận; hoàn tác về ban đầu thì rời ngay', async ({ page }) => {
  await openDesign(page, 'BM-05');
  // Chưa đổi gì → Huỷ về danh sách ngay.
  await page.locator('.efd-bar .vbtn', { hasText: 'Huỷ' }).click();
  await expect(page).toHaveURL(/#\/eform$/);
  await row(page, 'BM-05').locator('[data-ef-design]').click();
  await pickField(page, 'Kiến nghị').click();
  await page.locator('[data-efd-del]').click();
  const ask = page.locator('.vconfirm');
  await page.locator('.efd-back').click();
  await expect(ask.locator('h2')).toHaveText('Bạn có chắc muốn đóng popup này?');
  await expect(ask).toContainText('Các thay đổi bạn vừa thực hiện sẽ không được lưu lại.');
  await expect(ask.locator('.vconfirm-b')).toHaveText(['Tiếp tục chỉnh sửa', 'Đóng']);
  await ask.locator('.vconfirm-b', { hasText: 'Tiếp tục chỉnh sửa' }).click();
  await expect(page).toHaveURL(/#\/eform\/5\/thiet-ke$/);
  await expect(cards(page)).toHaveCount(3);
  // Hoàn tác về đúng thiết kế đã lưu → không còn thay đổi → rời ngay.
  await page.locator('[data-efd-undo]').click();
  await page.locator('.efd-back').click();
  await expect(page).toHaveURL(/#\/eform$/);
  // Đổi rồi Huỷ → Đóng: bỏ thay đổi, Số trường giữ nguyên; mở lại thấy bản đã lưu.
  await row(page, 'BM-05').locator('[data-ef-design]').click();
  await expect(cards(page)).toHaveCount(4);
  await dnd(page, page.locator('[data-efd-new="checkbox"]'), page.locator('.efd-drop-end'));
  await page.locator('.efd-bar .vbtn', { hasText: 'Huỷ' }).click();
  await ask.locator('#cf-ok').click();
  await expect(page).toHaveURL(/#\/eform$/);
  await expect(row(page, 'BM-05').locator('td').last()).toHaveText('4');
  await row(page, 'BM-05').locator('[data-ef-design]').click();
  await expect(cards(page)).toHaveCount(4);
  // id không tồn tại → về danh sách.
  await page.evaluate(() => { location.hash = '#/eform/999/thiet-ke'; });
  await expect(page).toHaveURL(/#\/eform$/);
  expect(page.errors).toEqual([]);
});

test('SCR-52: Xem trước — tờ giấy, trường theo loại, dấu * bắt buộc, chọn thử được; Đóng', async ({ page }) => {
  await openDesign(page, 'BM-01');
  await page.locator('[data-efd-preview]').click();
  const m = page.locator('.vmodal.w520');
  await expect(m.locator('.vmodal-h h3')).toHaveText('Xem trước biểu mẫu');
  await expect(m.locator('.efd-paper-h h3')).toHaveText('BM-01 — Tờ trình đề xuất mua sắm');
  await expect(m.locator('.efd-paper-h p')).toHaveText('TCT VHT');
  await expect(m.locator('.efp-l .vfield > .lr label')).toHaveText(['Căn cứ', 'Sự cần thiết', 'Tổng giá trị (tỷ đồng)', 'Nguồn vốn', 'Thời gian thực hiện', 'Tệp phụ lục chi phí']);
  await expect(m.locator('.efp-l .vfield .req')).toHaveCount(4);
  await m.locator('[data-efp="canCu"] textarea').fill('Quyết định 123');
  await m.locator('[data-efp="nguonVon"] [data-vsel]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['Vốn KHCN', 'Vốn đầu tư phát triển', 'Vốn SXKD']);
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Vốn SXKD' }).click();
  await expect(m.locator('[data-efp="nguonVon"] .vsel-label')).toHaveText('Vốn SXKD');
  await expect(m.locator('.vmodal-acts .vbtn')).toHaveText(['Đóng']);
  await m.locator('.vmodal-acts .vbtn').click();
  await expect(page.locator('.overlay')).toHaveCount(0);
  // Chọn một (radio): bấm lựa chọn.
  await page.evaluate(() => { location.hash = '#/eform'; });
  await row(page, 'BM-04').locator('[data-ef-design]').click();
  await page.locator('[data-efd-preview]').click();
  const kl = page.locator('.vmodal.w520 [data-efp="ketLuan"] .vradio-opt');
  await kl.nth(1).click();
  await expect(kl.nth(1)).toHaveClass(/on/);
  await expect(kl.nth(0)).not.toHaveClass(/on/);
  expect(page.errors).toEqual([]);
});

test('SCR-51: P-48 vai khác Quản trị hệ thống không vào được màn Thiết kế; C3 không có chữ BA ngoài (i)', async ({ page }) => {
  await fresh(page, '#/eform/4/thiet-ke');
  await expect(page.locator('.ov-empty')).toHaveText('Bạn chưa được cấp quyền truy cập chức năng này');
  await expect(page.locator('.efd-ws')).toHaveCount(0);
  await openDesign(page, 'BM-04');
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('[data-efd-preview]').click();
  expect(await page.locator('.overlay').innerText()).not.toMatch(BA);
  await page.keyboard.press('Escape');
  await page.locator('.efd-title .info-i').click();
  await expect(page.locator('.info-pop')).toContainText('SCR-51');
  await expect(page.locator('.info-pop [data-q="P-45"]')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('C3: không có chữ BA ngoài nút (i); (i) có ghi chú và ❓ P-47; ?capture=1 ẩn (i)', async ({ page }) => {
  await asAdmin(page, '#/eform');
  expect(await mainText(page)).not.toMatch(BA);
  await row(page, 'BM-04').locator('[data-ef-hist]').click();
  expect(await page.locator('.overlay').innerText()).not.toMatch(BA);
  await page.keyboard.press('Escape');
  await page.locator('[data-ef-new]').click();
  expect(await page.locator('.overlay').innerText()).not.toMatch(BA);
  await page.keyboard.press('Escape');
  await page.locator('.pg-title .info-i').click();
  await expect(page.locator('.info-pop')).toContainText('SCR-49');
  await expect(page.locator('.info-pop [data-q="P-47"]')).toBeVisible();
  await page.goto(INDEX + '?capture=1#/eform');
  await expect(page.locator('.pg-title')).toBeVisible();
  await expect(page.locator('.info-i').first()).toBeHidden();
  expect(page.errors).toEqual([]);
});

// T10 B4 — nối SCR-42 (panel Biểu mẫu phần tử → Thiết kế biểu mẫu; chỉ xem khi Dừng hoạt động) và SCR-44 (Biểu mẫu sử dụng lấy biểu mẫu Hoạt động).
// T29 B1 (D-54): MS01 một quy trình (thay MS01.01 / .02 / .03).
const WF = { MS01: '2251799813690112', MS02: '2251799813690540' };
const pickEl = (page, key, pg, id) => page.evaluate(([k, p, i]) => {
  document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/' + k, page: p, id: i } }));
}, [key, pg, id]);
const formCell = (page) => page.locator('.wf-el .wf-f').filter({ has: page.locator('.k', { hasText: /^Biểu mẫu$/ }) }).locator('.v');
const goHash = (page, h) => page.evaluate((x) => { location.hash = x; }, h);
const openWf = async (page, k) => {
  await goHash(page, '#/quy-trinh/' + k);
  await expect(page).toHaveURL(new RegExp(`#/quy-trinh/${k}$`));
  await expect(page.locator('.bp-vp')).toBeVisible();
};

test('B4: SCR-42 — mã biểu mẫu trong panel là link mở Thiết kế biểu mẫu; quay lại / Huỷ về Chi tiết quy trình (MS01, MS02)', async ({ page }) => {
  await asAdmin(page, '#/quy-trinh');
  await openWf(page, WF.MS01);
  await pickEl(page, WF.MS01, 'MS01 v1.1', 'Activity_13');
  await expect(formCell(page)).toHaveText('BM-01; Checklist 01 (đối với luồng >160 tỷ) - BM-09; Checklist 02 (đối với luồng <160 tỷ)');
  await expect(formCell(page).locator('a.link')).toHaveText(['BM-01', 'Checklist 01', 'BM-09', 'Checklist 02']);
  await expect(formCell(page).locator('a.link').nth(1)).toHaveAttribute('title', 'CL-01 - Checklist 01 — danh mục hồ sơ (≥ 160 tỷ)');
  await formCell(page).locator('a.link', { hasText: 'Checklist 01' }).click();
  await expect(page).toHaveURL(/#\/eform\/10\/thiet-ke$/);
  await expect(page.locator('.efd-paper-h h3')).toHaveText('CL-01 — Checklist 01 — danh mục hồ sơ (≥ 160 tỷ)');
  // Biểu mẫu đang hoạt động: sửa được như mở từ danh sách.
  await expect(page.locator('[data-efd-save]')).toBeVisible();
  await expect(page.locator('[data-efd-ro]')).toHaveCount(0);
  await page.locator('.efd-back').click();
  await expect(page).toHaveURL(new RegExp(`#/quy-trinh/${WF.MS01}$`));
  await expect(page.locator('.wf-el')).toBeVisible();
  await formCell(page).locator('a.link', { hasText: 'BM-09' }).click();
  await expect(page).toHaveURL(/#\/eform\/9\/thiet-ke$/);
  await page.locator('.efd-bar [data-efd-leave]', { hasText: 'Huỷ' }).click();
  await expect(page).toHaveURL(new RegExp(`#/quy-trinh/${WF.MS01}$`));
  for (const p of ['MS01']) {
    await openWf(page, WF[p]);
    await pickEl(page, WF[p], 'MS01 v1.1', 'Activity_20');
    await expect(formCell(page).locator('a.link')).toHaveText(['BM-04']);
    await formCell(page).locator('a.link').click();
    await expect(page).toHaveURL(/#\/eform\/4\/thiet-ke$/);
    await page.locator('.efd-back').click();
    await expect(page).toHaveURL(new RegExp(`#/quy-trinh/${WF[p]}$`));
  }
  // MS02: chưa có biểu mẫu E-Form Điều chỉnh ĐXMS (P-43, P-44) → chỉ chữ.
  await openWf(page, WF.MS02);
  const id = await page.evaluate(() => BPMN_DIAGRAMS['MS02 ver1.1'].nodes.find((n) => n.el && /BM-04/.test(n.el.form || '')).el.id);
  await pickEl(page, WF.MS02, 'MS02 ver1.1', id);
  await expect(formCell(page)).toContainText('BM-04');
  await expect(formCell(page).locator('a')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('B4: SCR-42 → biểu mẫu Dừng hoạt động mở chỉ xem; mở từ danh sách vẫn sửa được', async ({ page }) => {
  await asAdmin(page, '#/eform');
  await row(page, 'BM-04').locator('[data-ef-tg]').click();
  await page.locator('.vconfirm #cf-ok').click();
  await expect(row(page, 'BM-04').locator('[data-ef-tg]')).not.toHaveClass(/on/);
  await openWf(page, WF.MS01);
  await pickEl(page, WF.MS01, 'MS01 v1.1', 'Activity_20');
  await formCell(page).locator('a.link').click();
  await expect(page).toHaveURL(/#\/eform\/4\/thiet-ke$/);
  await expect(page.locator('[data-efd-ro]')).toHaveText('Biểu mẫu đang Dừng hoạt động — chỉ xem, không chỉnh sửa được thiết kế.');
  await expect(page.locator('.efd-bar .r .vbtn')).toHaveText(['Xem trước']);
  await expect(page.locator('[data-efd-undo], [data-efd-save], .efd-drop-end, .efd-rm, [data-efd-del]')).toHaveCount(0);
  await expect(page.locator('.efd-dock-i').first()).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('.efd-f').first()).toHaveAttribute('draggable', 'false');
  // Chọn trường khác để xem thuộc tính — ô khoá.
  await page.locator('.efd-f').nth(2).click();
  await expect(page.locator('.efd-f').nth(2)).toHaveClass(/on/);
  await expect(page.locator('#efd-p-label')).toBeDisabled();
  await expect(page.locator('#efd-sw-required')).toBeDisabled();
  await page.locator('[data-efd-preview]').click();
  await expect(page.locator('.overlay')).toContainText('Xem trước biểu mẫu');
  await page.keyboard.press('Escape');
  const before = await page.evaluate(() => EForm.rows().find((r) => r.code === 'BM-04').history.length);
  await page.locator('.efd-back').click();
  await expect(page).toHaveURL(new RegExp(`#/quy-trinh/${WF.MS01}$`));
  expect(await page.evaluate(() => EForm.rows().find((r) => r.code === 'BM-04').history.length)).toBe(before);
  // Từ danh sách (icon Thiết kế) → sửa được như B3.
  await goHash(page, '#/eform');
  await row(page, 'BM-04').locator('[data-ef-design]').click();
  await expect(page.locator('[data-efd-save]')).toBeVisible();
  await expect(page.locator('[data-efd-ro]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('B4: SCR-44 — Biểu mẫu sử dụng lấy biểu mẫu Hoạt động (Mã - Tên); luật gắn biểu mẫu đã dừng vẫn hiện kèm (Dừng hoạt động)', async ({ page }) => {
  await asAdmin(page, '#/ma-tran/display-rule/create');
  await page.locator('[data-vsel="mtf-form"]').click();
  const active = await page.evaluate(() => EForm.rows().filter((r) => r.active).map((r) => r.code));
  expect(active).not.toContain('BM-01-V0');
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(active.length);
  await expect(page.locator('.vsel-panel [data-opt="BM-04"]')).toHaveText('BM-04 - Phiếu nhận xét');
  await expect(page.locator('.vsel-panel [data-opt="CL-02"]')).toHaveText('CL-02 - Checklist 02 — danh mục hồ sơ (< 160 tỷ)');
  await expect(page.locator('.vsel-panel [data-opt="BM-01-V0"]')).toHaveCount(0);
  await page.locator('.vsel-panel [data-opt="BM-04"]').click();
  await expect(page.locator('[data-vsel="mtf-form"]')).toContainText('BM-04 - Phiếu nhận xét');
  // Luật mẫu dùng mã E-Form.
  const forms = await page.evaluate(() => [...new Set(MaTran.rules().map((r) => r.form).filter(Boolean))].sort());
  expect(forms.every((f) => /^(BM|CL)-0\d$/.test(f))).toBe(true);
  // Dừng hoạt động BM-04 → không còn trong danh sách chọn; luật đang gắn BM-04 vẫn hiện.
  await page.evaluate(() => { EForm.rows().find((r) => r.code === 'BM-04').active = false; });
  const id = await page.evaluate(() => MaTran.rules().find((r) => r.form === 'BM-04').id);
  await goHash(page, `#/ma-tran/display-rule/${id}/view`);
  await expect(page.locator('.mt-ro').filter({ hasText: 'Biểu mẫu sử dụng' }).locator('.mt-v')).toHaveText('BM-04 - Phiếu nhận xét (Dừng hoạt động)');
  await goHash(page, `#/ma-tran/display-rule/${id}/edit`);
  await page.locator('[data-vsel="mtf-form"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(active.length);
  await expect(page.locator('.vsel-panel [data-opt="BM-04"]')).toHaveText('BM-04 - Phiếu nhận xét (Dừng hoạt động)');
  expect(page.errors).toEqual([]);
});

test('C3: SCR-42 — mọi link biểu mẫu của MS01 mở được Thiết kế, không chữ BA (cả chế độ chỉ xem)', async ({ page }) => {
  await asAdmin(page, '#/quy-trinh');
  const ids = await page.evaluate(() => [...new Set(BPMN_DIAGRAMS['MS01 v1.1'].nodes.filter((n) => n.el && /BM-|Checklist/.test(n.el.form || '')).map((n) => n.el.id))]);
  const seen = new Set();
  for (const p of ['MS01']) {
    await openWf(page, WF[p]);
    for (const id of ids) {
      await pickEl(page, WF[p], 'MS01 v1.1', id);
      (await formCell(page).locator('a.link').evaluateAll((as) => as.map((a) => a.dataset.efOpen))).forEach((x) => seen.add(x));
    }
  }
  // 11 biểu mẫu ĐXMS được nhắc trên sơ đồ (trừ mẫu 2025 đã dừng).
  expect([...seen].sort((a, b) => a - b)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
  await page.evaluate(() => { EForm.rows().forEach((r) => { r.active = false; }); });
  for (const id of seen) {
    await page.evaluate(([k, i]) => { location.hash = '#/quy-trinh/' + k; setTimeout(() => EForm.openFrom(i, 'quy-trinh/' + k), 0); }, [WF.MS01, id]);
    await expect(page).toHaveURL(new RegExp(`#/eform/${id}/thiet-ke$`));
    await expect(page.locator('[data-efd-ro]')).toBeVisible();
    await expect(page.locator('.efd-f').first()).toBeVisible();
    expect(await mainText(page)).not.toMatch(BA);
  }
  expect(page.errors).toEqual([]);
});
