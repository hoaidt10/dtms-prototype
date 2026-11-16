// @ts-check
// T71 S12 (D-124): phần dùng chung của phân hệ Sản xuất — Xuất Excel mọi danh sách (đúng cột đang hiện), Nhập Excel dự án / nhu cầu vật tư,
// Xoá chỉ khi chưa khởi tạo luồng, tab Dữ liệu VMMS chỉ xem, Mẫu thông báo SX, ký số MySign ở bước Lãnh đạo ký, ECR nguồn "Hệ thống KHCN" + ECN đồng bộ ngược.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const csv = async (page, id) => {
  const dl = page.waitForEvent('download');
  await page.locator(`[data-lx="${id}"]`).click();
  const file = await dl;
  const rows = readFileSync(await file.path(), 'utf8').replace(/^﻿/, '').split('\n').map((r) => r.slice(1, -1).split('","'));
  return { name: file.suggestedFilename(), rows };
};

test('Xuất Excel: mọi danh sách SX có nút; tệp đúng cột đang hiện (bỏ Thao tác, cột chọn), mọi dòng thỏa bộ lọc', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'qt', '#/sx/du-an');
  const ex = await csv(page, 'sxda');
  expect(ex.name).toBe('Danh sach du an san xuat.csv');
  expect(ex.rows[2]).toEqual(['STT', 'Trạng thái', 'Mã dự án', 'Tên dự án', 'Sản phẩm · phiên bản', 'Khối', 'Mô hình tổ chức', 'Số lượng', 'Đơn vị sản xuất', 'Giám đốc dự án', 'Ngày bắt đầu', 'Ngày kết thúc', 'Tiến độ', 'Mốc chậm']);
  expect(ex.rows.slice(3).map((r) => r[2]).sort()).toEqual(['DA-SX-2026-001', 'DA-SX-2026-002', 'DA-SX-2026-003', 'DA-SX-2026-004']);
  // Theo bộ lọc đang áp (ô tìm kiếm).
  await page.locator('#sxda-kw').fill('WM-6');
  await page.locator('#sxda-kw').press('Enter');
  const ex2 = await csv(page, 'sxda');
  expect(ex2.rows.slice(3).map((r) => r[2])).toEqual(['DA-SX-2026-003']);
  // Nhu cầu vật tư: bỏ cột chọn và Thao tác.
  await as(page, 'qt', '#/sx/nhu-cau');
  const nc = await csv(page, 'sxnc');
  expect(nc.rows[2][0]).toBe('STT');
  expect(nc.rows[2]).not.toContain('Thao tác');
  expect(nc.rows[2]).not.toContain('');
  expect(nc.rows[2][1]).toBe('Trạng thái');
  // Các danh sách khác đều có nút Xuất Excel.
  for (const [h, id] of [['sx/chuyen-giao', 'sxcg'], ['sx/san-pham', 'sxsp'], ['sx/mua-sam', 'sxms'], ['sx/goi-thau-hd', 'sxgt'], ['sx/bat-thuong', 'sxbt'], ['sx/thay-doi', 'sxtd'],
    ['sx/nghiem-thu', 'sxnt'], ['sx/ho-so', 'sxhs'], ['sx/bai-hoc', 'sxbh']]) {
    await as(page, 'qt', '#/' + h);
    await expect(page.locator(`[data-lx="${id}"]`), h).toHaveText(/Xuất Excel/);
  }
  expect(page.errors).toEqual([]);
});

test('Nhập Excel dự án: kiểm lỗi từng dòng, chỉ ghi dòng hợp lệ; Xoá chỉ dự án chưa khởi tạo luồng', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxk2', '#/sx/du-an');
  await page.locator('[data-sxda-import]').click();
  await expect(page.locator('.vmodal #imp-go')).toBeDisabled();
  await page.locator('.vmodal [data-imp-zone]').click();
  await page.locator('.vmodal #imp-go').click();
  const res = page.locator('.vmodal [data-sx-imp]');
  await expect(res).toContainText('3/5 dòng hợp lệ');
  await expect(res).toContainText('Sản phẩm ER-9 không có trong danh sách sản phẩm.');
  await expect(res).toContainText('Ngày kết thúc phải sau Ngày bắt đầu.');
  await page.locator('.vmodal #imp-ok').click();
  await expect(page.locator('.toast').last()).toContainText('Nhập dữ liệu thành công (3 dự án)');
  // sxk2 thấy Khối 2: 2 mẫu + 2 dự án Khối 2 vừa nhập (dự án RĐ-40 Khối 1 vẫn ghi, ngoài phạm vi xem).
  await expect(page.locator('.vtable tbody')).toContainText('Sản xuất thiết bị đầu cuối quang ONT-X2 năm 2027');
  const code = await page.evaluate(() => SxDuAn.all().find((p) => p.name === 'Sản xuất thiết bị đầu cuối quang ONT-X2 năm 2027').code);
  expect(await page.evaluate((c) => SxDuAn.byCode(c).status, code)).toBe('PLANNING');
  // Dự án đã có hồ sơ luồng: không có nút Xoá.
  await as(page, 'sxk2', '#/sx/du-an/DA-SX-2026-004');
  await expect(page.locator('[data-sx-del]')).toHaveCount(0);
  // Dự án mới nhập: Xoá được.
  await as(page, 'sxk2', '#/sx/du-an/' + encodeURIComponent(code));
  await page.locator('[data-sx-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page).toHaveURL(/#\/sx\/du-an$/);
  await expect(page.locator('.toast').last()).toContainText('Xoá dự án thành công');
  await expect(page.locator('.vtable tbody')).not.toContainText('Sản xuất thiết bị đầu cuối quang ONT-X2 năm 2027');
  // Dự án đã khởi tạo phê duyệt kế hoạch: hết nút Xoá.
  const code2 = await page.evaluate(() => SxDuAn.all().find((p) => p.name.startsWith('Sản xuất loạt bộ phát Wi-Fi Mesh WM-6 cho thị trường trong nước')).code);
  await as(page, 'sxk2', '#/sx/du-an/' + encodeURIComponent(code2));
  await expect(page.locator('[data-sx-del]')).toHaveCount(1);
  await page.locator('[data-sx-kh-start]').click();
  await as(page, 'sxk2', '#/sx/du-an/' + encodeURIComponent(code2));
  await expect(page.locator('[data-sx-del]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Nhập Excel nhu cầu vật tư; Xoá đề xuất mua sắm chỉ khi Nháp chưa gửi phê duyệt', async ({ page }) => {
  await fresh(page, '#/sx/nhu-cau');
  await as(page, 'sxk2', '#/sx/nhu-cau');
  await page.locator('[data-sxnc-import]').click();
  await page.locator('.vmodal [data-imp-zone]').click();
  await page.locator('.vmodal #imp-go').click();
  const res = page.locator('.vmodal [data-sx-imp]');
  await expect(res).toContainText('2/5 dòng hợp lệ');
  await expect(res).toContainText('Vật tư FPGA-XC7K325 không thuộc MBOM của sản phẩm gNB-M3.');
  await expect(res).toContainText('Vật tư SOC-MT7981 đã có dòng nhu cầu của dự án.');
  await expect(res).toContainText('Dự án DA-SX-2026-009 không tồn tại.');
  await page.locator('.vmodal #imp-ok').click();
  expect(await page.evaluate(() => SxNc.all().filter((r) => r.project === 'DA-SX-2026-004').map((r) => r.mat).sort())).toEqual(['FPGA-ZU47DR', 'PA-GAN-80W']);
  // Lập đề xuất từ 2 dòng vừa nhập → Lưu nháp → Xoá được; sau khi gửi phê duyệt thì không.
  await page.locator('[data-sxnc-sel]').first().check();
  await page.locator('[data-sxnc-prop]').click();
  await page.locator('[data-sxm-save]').click();
  await expect(page.locator('[data-sxm-detail]')).toBeVisible();
  await expect(page.locator('[data-sxm-del]')).toHaveCount(1);
  await page.locator('[data-sxm-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page).toHaveURL(/#\/sx\/mua-sam$/);
  await expect(page.locator('.toast').last()).toContainText('Xoá đề xuất mua sắm thành công');
  await page.locator('[data-go="sx/nhu-cau"]').first().click();
  await page.locator('[data-sxnc-sel]').first().check();
  await page.locator('[data-sxnc-prop]').click();
  await page.locator('[data-sxm-save]').click();
  await page.locator('[data-sxm-submit]').click();
  await page.locator('[data-sxm-send-ok]').click();
  await expect(page.locator('[data-sxm-detail]')).toContainText('Chờ phê duyệt');
  await expect(page.locator('[data-sxm-del]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Dữ liệu VMMS: EBOM / MBOM theo phiên bản, lịch sử ECN, thiết bị, nhân công, lệnh sản xuất — chỉ xem; Đồng bộ ngay', async ({ page }) => {
  await fresh(page, '#/sx/du-an/DA-SX-2026-001');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="vmms"]').click();
  const box = page.locator('[data-vmms="DA-SX-2026-001"]');
  await expect(box).toContainText('Đồng bộ lần cuối 16/11/2026 06:00');
  await expect(box.locator('[data-vmms-bom="EBOM"]')).toContainText('Ban hành 30/07/2026 · theo ECN-2026-001');
  await expect(box).toContainText('Khối cao tần');
  await expect(box).toContainText('Thay đổi theo ECN-2026-001');
  // Phiên bản trước ECN: module PA rev A.
  await page.locator('[data-vsel="vm-ver-DA-SX-2026-001"]').click();
  await page.locator('.vsel-panel [data-opt="v2.1_HW_Rev2"]').click();
  await expect(box).toContainText('RF-PA-25W-A');
  await expect(box).not.toContainText('Thay đổi theo');
  // MBOM: công đoạn, vật tư tiêu hao, hao hụt.
  await page.locator('[data-vsel="vm-kind-DA-SX-2026-001"]').click();
  await page.locator('.vsel-panel [data-opt="MBOM"]').click();
  await expect(box.locator('[data-vmms-bom="MBOM"]')).toBeVisible();
  await expect(box).toContainText('Gia công bo mạch (SMT)');
  await expect(box).toContainText('Kem hàn SAC305');
  await expect(box).toContainText('Hao hụt (%)');
  await page.locator('[data-vmms-part="DA-SX-2026-001|ecn"]').click();
  await expect(box).toContainText('ECN-2026-001');
  await expect(box).toContainText('Ban hành bản vẽ bo mạch chính rev 3');
  await page.locator('[data-vmms-part="DA-SX-2026-001|tb"]').click();
  await expect(box).toContainText('TB-VMC-0201');
  await expect(box).toContainText('Đang bảo trì');
  await page.locator('[data-vmms-part="DA-SX-2026-001|nc"]').click();
  await expect(box).toContainText('Tổ tích hợp cao tần');
  await page.locator('[data-vmms-part="DA-SX-2026-001|lsx"]').click();
  await expect(box.locator('tbody tr')).toHaveCount(4);
  await expect(box).toContainText('LSX-001-01');
  // Chỉ xem: không có ô nhập, nút sửa / xoá.
  await expect(box.locator('input, textarea, [data-go$="/edit"], .vbtn.icon')).toHaveCount(0);
  await page.locator('[data-vmms-sync="DA-SX-2026-001"]').click();
  await expect(page.locator('.toast').last()).toContainText('Đồng bộ dữ liệu VMMS thành công');
  await expect(box.locator('[data-vmms-at]')).not.toContainText('06:00');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Ký số MySign ở bước Phê duyệt kế hoạch: huỷ thì việc chưa xong; ký xong hồ sơ, tài liệu hiện Đã ký số', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await openTask(page, 'sxld', 'Xem xét kế hoạch');
  await page.locator('[data-sx-do]', { hasText: 'Đồng ý' }).click();
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxld', 'Phê duyệt kế hoạch sản xuất');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await page.locator('.vmodal #ok').click();
  const sign = page.locator('.vmodal [data-mysign]');
  await expect(sign).toContainText('Kế hoạch sản xuất số 118/KH-TTSX');
  await expect(sign).toContainText('Ký số MySign');
  await expect(sign).toContainText('Viettel-CA');
  // Huỷ ký: việc vẫn ở bước 4.
  await page.locator('.vmodal [data-close]').first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText('Phê duyệt kế hoạch sản xuất');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await page.locator('.vmodal #ok').click();
  await page.locator('.vmodal [data-mysign-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await expect(page.locator('.toast').last()).toContainText('Xử lý công việc thành công');
  // Kick-off → tài liệu kế hoạch đã phê duyệt mang nhãn Đã ký số.
  await openTask(page, 'sxk2', 'Kick-off');
  await page.locator('[data-sx-do]').click();
  await page.locator('.vmodal [data-ef="koNgay"]').fill('18/11/2026');
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxk2', '#/sx/du-an/DA-SX-2026-004');
  await page.locator('[data-ttab="kh"]').click();
  await expect(page.locator('[data-sx-kh]')).toContainText('Tài liệu đã ký số');
  await expect(page.locator('[data-sx-kh] .sx-signed')).toHaveCount(2); // thông tin hồ sơ + kết quả bước 4
  await page.locator('[data-ttab="docs"]').click();
  await expect(page.locator('[data-sx-docs] tbody tr').first()).toContainText('Kế hoạch sản xuất 118/KH-TTSX (đã phê duyệt).pdf');
  await expect(page.locator('[data-sx-docs] tbody tr').first()).toContainText('Đã ký số');
  expect(page.errors).toEqual([]);
});

test('Thay đổi kỹ thuật nguồn Hệ thống KHCN: R&D nhận việc phân tích; ban hành ECN đồng bộ ngược về KHCN', async ({ page }) => {
  await fresh(page, '#/sx/thay-doi');
  await as(page, 'sxrd', '#/sx/thay-doi');
  const r = page.locator('.vtable tbody tr', { hasText: 'ECR-2026-002' });
  await expect(r).toContainText('Hệ thống KHCN · YCTĐ-KHCN-2026-014');
  await expect(page.locator('.vtable tbody tr', { hasText: 'ECR-2026-001' })).toContainText('Phân hệ sản xuất');
  await r.locator('a.link').first().click();
  await expect(page.locator('.ginfo').first()).toContainText('Hệ thống KHCN');
  await expect(page.locator('.ginfo').first()).toContainText('YCTĐ-KHCN-2026-014');
  await expect(page.locator('.ginfo').first()).toContainText('Chưa ban hành ECN');
  await as(page, 'sxrd', '#/sx/viec-cua-toi');
  await expect(page.locator('[data-sx-tasks] tbody')).toContainText('ECR-2026-002');
  // Chạy luồng tới bước 8 (service task cấp ECN).
  await page.evaluate(() => {
    const go = (vals, ci) => { const c = SxFlow.caseOf('HSTD-ECR-2026-002-01'); SxFlow.complete(c.code, c.tokens[0].id, ci == null ? -1 : ci, vals); };
    go({ ptCauHinh: 'Không đổi phần cứng', ptEbom: 'Không đổi', ptTienDo: 3, ptChiPhi: 0 });
    go({ ecoCap: 'C1', ecoNoiDung: 'Cập nhật firmware xử lý ảnh v1.4', ecoPhienBan: 'v1.0_HW_Rev2_FW1.4' });
    go({ ykNoiDung: '' }, 0);
    go({ ecnNoiDung: 'Ban hành firmware xử lý ảnh v1.4', ecnTaiLieu: ['Firmware'] });
    go({ ktKetQua: 'Đạt' }, 0);
  });
  await as(page, 'sxrd', '#/sx/thay-doi/ECR-2026-002');
  await expect(page.locator('.ginfo').first()).toContainText('Đã đồng bộ ngày 16/11/2026');
  await page.locator('[data-ttab="tt"]').click();
  await expect(page.locator('main')).toContainText('Đồng bộ ECN về hệ thống KHCN');
  await expect(page.locator('main')).toContainText('→ YCTĐ-KHCN-2026-014');
  expect(page.errors).toEqual([]);
});

test('Mẫu thông báo trong phân hệ Sản xuất: chỉ mẫu SX_, thêm mới ở lại phân hệ; ĐTMS không thấy mẫu SX', async ({ page }) => {
  await fresh(page, '#/sx/mau-thong-bao');
  await as(page, 'sxpm', '#/sx/mau-thong-bao');
  await expect(page.locator('.sb-nav [data-go="sx/mau-thong-bao"]')).toHaveClass(/active/);
  const codes = await page.locator('.vtable tbody tr td:nth-child(4)').allInnerTexts();
  expect(codes.length).toBe(8);
  expect(codes.every((c) => c.startsWith('SX_'))).toBe(true);
  await page.locator('.vtable tbody tr', { hasText: 'SX_ECN_ISSUED_EMAIL' }).locator('a.link').click();
  await expect(page).toHaveURL(/#\/sx\/mau-thong-bao\/detail\//);
  await expect(page.locator('main')).toContainText('Ban hành thông báo thay đổi kỹ thuật');
  await as(page, 'sxpm', '#/sx/mau-thong-bao/create');
  await page.locator('[data-tbf="code"]').fill('SX_LOT_ACCEPTED_IN_APP');
  await page.locator('[data-tbf="name"]').fill('Lô sản phẩm đã nghiệm thu');
  await page.locator('#tb-save').click();
  await expect(page).toHaveURL(/#\/sx\/mau-thong-bao$/);
  await expect(page.locator('.vtable tbody')).toContainText('SX_LOT_ACCEPTED_IN_APP');
  await as(page, 'qt', '#/mau-thong-bao');
  await expect(page.locator('.vtable tbody')).not.toContainText('SX_');
  expect(page.errors).toEqual([]);
});
