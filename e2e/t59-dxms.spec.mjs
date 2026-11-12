// T59 (D-114) B2–B4 — Chi tiết ĐXMS (#44 Căn cứ pháp lý, #47/#49/#50/#51 Thành phần tham gia), Rà soát tồn kho trên màn việc bước 7
// (#54, C0–C2 / Q4, Q8, Q9), Chi tiết BPMN (#45 toolbar, chú giải, khung thông tin bước; #46 Thông tin chung như màn xem).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const CODE = 'ĐXMS-2026-0117';
const go = (page, h) => page.evaluate((x) => { location.hash = x; }, h);
const pickV = async (page, id, value) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${value}"]`).click(); };
const at10 = (page) => page.evaluate(() => { Flow.jumpTo(10, 'minh'); return Flow.state.tokens.find((t) => String(t.task) === '10').id; });

test('#44: tab Căn cứ & hạng mục luôn có Nội dung căn cứ pháp lý (dữ liệu mẫu; trống thì "-")', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await at10(page);
  await go(page, '#/luong/' + encodeURIComponent(CODE) + '/can-cu');
  await expect(page.locator('[data-dx-legal]')).toContainText('Nội dung căn cứ pháp lý');
  await expect(page.locator('[data-dx-legal] .v')).toContainText('1482/QĐ-VHT');
  await go(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0101') + '/can-cu');
  await expect(page.locator('[data-dx-legal] .v')).toHaveText('-');
  await go(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0138') + '/can-cu');
  await expect(page.locator('[data-dx-legal] .v')).toContainText('NV-KHCN-2026-014');
  expect(page.errors).toEqual([]);
});

test('#47/#49/#50/#51: Thành phần tham gia 3 cột, Cập nhật sửa tại chỗ (Thêm / Sửa / Xóa, Hủy, Lưu), ghi Lịch sử xử lý, không còn Lịch sử thay đổi nhân sự', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const tok = await at10(page);
  // ĐXMS mẫu: một dòng mỗi cặp vai trò – người, nhân sự "Họ tên — Đơn vị"; không chạy quy trình nên không có nút Cập nhật.
  await go(page, '#/luong/' + encodeURIComponent('ĐXMS-2026-0138') + '/nhan-su');
  const tab = page.locator('[data-team-tab]');
  await expect(tab.locator('thead th')).toHaveText(['STT', 'Vai trò thực hiện', 'Nhân sự thực hiện']);
  await expect(tab.locator('tbody tr')).toHaveCount(3);
  await expect(tab.locator('tbody tr').first()).toContainText('Phan Thị Ngọc — Trung tâm Vô tuyến');
  await expect(page.locator('[data-team="edit"]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Lịch sử thay đổi nhân sự');

  // ĐXMS đang chạy: bảng trống → câu trống của SRS; Cập nhật → chế độ sửa.
  await go(page, '#/luong/' + encodeURIComponent(CODE) + '/nhan-su');
  await expect(tab).toContainText('Chưa chỉ định nhân sự thực hiện. Công việc giao theo vai trò của quy trình.');
  await expect(page.locator('main')).not.toContainText('Lịch sử thay đổi nhân sự');
  await expect(page.locator('[data-um-open]')).toHaveCount(0);
  await page.locator('[data-team="edit"]').click();
  await expect(page.locator('[data-team-edit] thead th')).toHaveText(['STT', 'Thao tác', 'Vai trò thực hiện', 'Nhân sự thực hiện']);
  // Hủy: không lưu dòng mới.
  await page.locator('[data-team="add"]').click();
  await page.locator('[data-team="cancel"]').click();
  await expect(page.locator('[data-team-edit]')).toHaveCount(0);
  await expect(tab).toContainText('Chưa chỉ định nhân sự thực hiện.');
  // Thêm dòng chưa chọn → lỗi; chọn Vai trò → Nhân sự → Lưu.
  await page.locator('[data-team="edit"]').click();
  await page.locator('[data-team="add"]').click();
  await page.locator('[data-team="save"]').click();
  await expect(page.locator('[data-team-edit] .msg')).toHaveText(['Bạn cần chọn Vai trò thực hiện.']);
  await pickV(page, 'tm-role-n1', 'R-DVDX-CQ');
  await pickV(page, 'tm-p-n1', 'ngoc');
  await page.locator('[data-team="add"]').click();
  await pickV(page, 'tm-role-n2', 'R-TTMS-THAU');
  await pickV(page, 'tm-p-n2', 'thau');
  await page.locator('[data-team="save"]').click();
  expect(await lastToast(page)).toContain('Cập nhật Thành phần tham gia thành công');
  await expect(page.locator('[data-team-edit]')).toHaveCount(0);
  await expect(tab.locator('tbody tr')).toHaveCount(2);
  await expect(tab).toContainText('Phan Thị Ngọc — Trung tâm Vô tuyến');
  expect(await page.evaluate((c) => Flow.findDxms(c).roleMembers, CODE)).toEqual([{ role: 'R-DVDX-CQ', person: 'ngoc' }, { role: 'R-TTMS-THAU', person: 'thau' }]);
  // Sửa Nhân sự của dòng đã có (vai trò giữ — Q2) và Xóa dòng.
  await page.locator('[data-team="edit"]').click();
  await expect(page.locator('[data-vsel="tm-role-t0"]')).toHaveCount(0);
  await pickV(page, 'tm-p-t0', 'minh');
  await page.locator('[data-team-del="t1"]').click();
  await page.locator('[data-team="save"]').click();
  await expect(tab.locator('tbody tr')).toHaveCount(1);
  await expect(tab).toContainText('Nguyễn Văn Minh');
  // Lịch sử xử lý (tab Tiến trình) có dòng cập nhật.
  await page.locator('[data-ltab="tien-trinh"]').click();
  await expect(page.locator('main .vtl')).toContainText('Cập nhật Thành phần tham gia: +Phan Thị Ngọc (Chuyên quản ĐVĐX), +Ninh Thị Hồng (Chuyên viên Thầu TTMS)');
  await expect(page.locator('main .vtl')).toContainText('+Nguyễn Văn Minh (Chuyên quản ĐVĐX), −Phan Thị Ngọc (Chuyên quản ĐVĐX), −Ninh Thị Hồng (Chuyên viên Thầu TTMS)');
  expect(await page.evaluate(() => (Flow.state.memberLog || []).length)).toBe(0);
  // Màn xử lý việc: không còn nút Cập nhật nhân sự riêng; tab Thành phần tham gia có nút Cập nhật, không đóng việc.
  await page.evaluate((i) => { Flow.setPersona('thau'); location.hash = '#/task/' + i; }, tok);
  await expect(page.locator('main')).not.toContainText('Cập nhật nhân sự');
  await page.locator('[data-ltab="nhan-su"]').click();
  await expect(page.locator('[data-team="edit"]')).toBeVisible();
  await page.locator('[data-team="edit"]').click();
  await page.locator('[data-team="cancel"]').click();
  expect(await page.evaluate((i) => !!Flow.token(i), tok)).toBe(true);
  expect(page.errors).toEqual([]);
});

test('#54, C0–C2 (Q4, Q8, Q9): bước 7 mở màn việc ở tab Rà soát tồn kho chế độ nhập; Excel điền bảng; Biên bản kiểm đếm bắt buộc; 7.1 chỉ xem; không sinh BBRS; #/ra-soat-kho chuyển hướng', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-scene="1b"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  await expect(page.locator('[data-ltab="ton-kho"]')).toHaveClass(/on/);
  await expect(page.locator('[data-rsk-input] [data-rsk-ed]')).toBeVisible();
  await expect(page.locator('.task-acts [data-act]')).toHaveText(['Gửi Chỉ huy Kho']);
  await expect(page.locator('[data-rsk-ed]')).toContainText('Tệp kết quả (Excel theo mẫu BM-RSTK)');
  await expect(page.locator('[data-rsk-ed]')).toContainText('Biên bản kiểm đếm có ký');
  await expect(page.locator('[data-rsk-ed] [data-dl="Mau-ket-qua-ra-soat-ton-kho_BM-RSTK.xlsx"]')).toHaveText('Tải mẫu Excel');
  // Tệp không phải Excel → lỗi; Excel → hệ thống đọc, điền sẵn bảng (GIẢ LẬP), sửa được.
  await page.locator('#rsk-file').setInputFiles({ name: 'anh.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(8) });
  await expect(page.locator('[data-rsk-ed] .msg')).toContainText(['Tệp kết quả phải là tệp Excel']);
  await page.locator('#rsk-file').setInputFiles({ name: 'Ket-qua-ra-soat.xlsx', mimeType: 'application/vnd.ms-excel', buffer: Buffer.alloc(16) });
  await expect(page.locator('[data-rsk-imported]')).toContainText('Đã đọc 5 dòng');
  const out4 = page.locator('[data-rsk-in="4:out"]');
  await expect(out4).toHaveValue('6');
  await out4.fill('5');
  // Gửi (thanh trạng thái) khi thiếu biên bản → báo lỗi, giữ bước 7.
  await page.locator('.task-acts [data-act]', { hasText: 'Gửi Chỉ huy Kho' }).click();
  await expect(page.locator('[data-rsk-ed] .msg')).toHaveText(['Vui lòng tải lên Biên bản kiểm đếm có ký.']);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['7']);
  await expect(out4).toHaveValue('5');
  await page.locator('#rsk-sign').setInputFiles({ name: 'Bien-ban-kiem-dem.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) });
  await page.locator('.task-acts [data-act]', { hasText: 'Gửi Chỉ huy Kho' }).click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await lastToast(page)).not.toContain('biên bản');
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['7.1']);
  expect(await page.evaluate(() => RaSoatKho.resultFile(Flow.state.dxms, { code: 'X', cur: true }))).toEqual({ name: 'Ket-qua-ra-soat.xlsx', sign: 'Bien-ban-kiem-dem.pdf' });
  // 7.1: Chỉ huy Kho xem (không nhập), có tệp kết quả + biên bản, không có Biên bản rà soát sinh.
  const t71 = await page.evaluate(() => { Flow.setPersona('khoch'); return Flow.state.tokens[0].id; });
  await go(page, '#/task/' + t71);
  await expect(page.locator('[data-ltab="ton-kho"]')).toHaveClass(/on/);
  await expect(page.locator('[data-rsk-view]')).toContainText('Ket-qua-ra-soat.xlsx');
  await expect(page.locator('[data-rsk-view]')).toContainText('Bien-ban-kiem-dem.pdf');
  await expect(page.locator('[data-rsk-ed]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('BBRS');
  await page.locator('[data-ltab="tai-lieu"]').click();
  await expect(page.locator('main')).toContainText('Ket-qua-ra-soat.xlsx');
  await expect(page.locator('main')).not.toContainText('Biên bản rà soát (BM-RSTK)');
  await expect(page.locator('main')).not.toContainText('Bien-ban-ra-soat-ton-kho');
  // Route cũ #/ra-soat-kho → màn việc đang mở của bước 7; không có thì Chi tiết ĐXMS tab Rà soát tồn kho.
  await go(page, '#/ra-soat-kho');
  await expect(page).toHaveURL(new RegExp('#/luong/' + encodeURIComponent(CODE) + '/ton-kho$'));
  const t7 = await page.evaluate(() => { Flow.jumpTo(7, 'qlts'); Flow.setPersona('qlts'); return Flow.state.tokens.find((t) => String(t.task) === '7').id; });
  await go(page, '#/ra-soat-kho');
  await expect(page).toHaveURL(new RegExp('#/task/' + t7 + '$'));
  expect(page.errors).toEqual([]);
});

test('#45, #46 (Q5): Chi tiết BPMN có toolbar, chú giải, khung thông tin bước; Thông tin chung như tab Thông tin chung của Chi tiết ĐXMS', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await at10(page);
  await go(page, '#/luong/' + encodeURIComponent(CODE));
  const gen0 = (await page.locator('main section.gen').first().innerText()).trim();
  await go(page, '#/luong/' + encodeURIComponent(CODE) + '/bpmn');
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết BPMN');
  expect((await page.locator('main section.gen').first().innerText()).trim()).toBe(gen0);
  await expect(page.locator('main section.gen')).toContainText('Ngày tạo');
  await expect(page.locator('.bp-tb [data-bpz="in"]')).toBeVisible();
  await expect(page.locator('.bp-tb [data-bpz="out"]')).toBeVisible();
  const lg = page.locator('[data-bp-legend]');
  for (const t of ['Bước đang xử lý', 'Đã hoàn thành', 'Chưa tới', 'Công việc người dùng', 'Tác vụ hệ thống', 'Cổng rẽ nhánh', 'Sự kiện']) await expect(lg).toContainText(t);
  // Phóng to đổi tỷ lệ.
  const tf = () => page.locator('.bp-root').getAttribute('transform');
  const before = await tf();
  await page.locator('.bp-tb [data-bpz="in"]').click();
  expect(await tf()).not.toBe(before);
  // Bấm bước đang xử lý → khung thông tin bước.
  await page.locator('[data-el="Activity_10"] rect').first().click({ force: true });
  const inf = page.locator('[data-bp-info]');
  await expect(inf).toBeVisible();
  await expect(inf).toContainText('Tên bước');
  await expect(inf).toContainText('Vai trò');
  await expect(inf).toContainText('Đang xử lý');
  await expect(inf).toContainText('Người xử lý');
  await inf.locator('[data-bp-close]').click();
  await expect(page.locator('[data-bp-info]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
