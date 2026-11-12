// T29 B8 — Đề tài / dự án (S6, S7), plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md v0.5 §3.10.
// SCR-103 danh sách + lọc Loại → Loại chi tiết, Khối → Đơn vị, Xuất Excel 18 cột; SCR-104 tab Dự toán: thêm / sửa / copy / xóa dòng,
// Nhập tay (P-199), xóa bị chặn khi có ĐXMS, Chi mua sắm chỉ TTMS (D-64), accordion đợt ĐXMS; nhãn "Đề tài / dự án" ở ĐXMS (D-66).
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const pick = async (scope, id, value) => {
  const page = scope.page ? scope.page() : scope;
  await scope.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await scope.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const listCodes = (page) => page.locator('[data-dt-list] tbody tr td:nth-child(4)').allInnerTexts();
const line = (page, id) => page.locator(`[data-vtt-row="${id}"]`);
const DT = 'NV-KHCN-2026-014';

test('SCR-103: menu, lọc Loại → Loại chi tiết, Khối → Đơn vị lập, Xuất Excel theo TPL-DADT-EX', async ({ page }) => {
  await fresh(page, '#/de-tai');
  // T34 (người dùng 09/11): Đề tài / dự án là menu cấp 1, ngay trên Quản lý đề xuất mua sắm.
  await expect(page.locator('.sb-nav [data-go="de-tai"]')).toHaveClass(/active/);
  const tops = (await page.locator('.sb-nav > .nav:not(.child) .l').allInnerTexts()).map((x) => x.trim());
  expect(tops[tops.indexOf('Đề tài / dự án') + 1]).toBe('Quản lý đề xuất mua sắm');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách đề tài / dự án');
  await expect(page.locator('[data-dt-list] thead th')).toHaveText(['STT', 'Trạng thái', 'Loại dự án / đề tài', 'Mã dự án / đề tài', 'Tên dự án / đề tài', 'Đơn vị lập', 'Chủ nhiệm',
    'Nguồn vốn', 'Tổng dự toán (tỷ đồng)', 'TG bắt đầu', 'TG kết thúc', 'Số ngày còn thực hiện', 'Nguồn dữ liệu']);
  await expect(page.locator('[data-create]')).toHaveCount(0);

  await page.locator('#dt-kw').fill('đường sắt');
  await page.locator('#dt-kw').press('Enter');
  await expect.poll(() => listCodes(page)).toEqual(['009-26-VHT-RDP-DS']);

  // Rà 11/11/2026 (SRS DTMS_CN_0240): từ khóa luôn hiện và áp cùng điều kiện nâng cao — xoá từ khóa trước khi lọc theo Loại.
  await page.locator('#dt-kw').fill('');
  await page.locator('[data-dt="adv"]').click();
  await pick(page, 'dtf-loai', 'KHCN');
  await page.locator('[data-vsel="dtf-loaiCt"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(7);
  await page.locator('.pg-title').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  await expect.poll(async () => (await listCodes(page)).sort()).toEqual(['004-26-VHT-RDP-DS', '009-26-VHT-RDP-DS', 'DT-KHCN-2027-002', 'NV-KHCN-2025-031', 'NV-KHCN-2026-006', 'NV-KHCN-2026-014']);
  await expect(page.locator('[data-dt-list] tbody')).not.toContainText('Chuyển từ hệ thống cũ');

  await page.locator('[data-dt="reset"]').click();
  await pick(page, 'dtf-block', 'Khối 2');
  await page.locator('[data-vsel="dtf-unit"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveText(['Trung tâm Giải pháp và tích hợp']);
  await page.locator('.pg-title').click();
  await pick(page, 'dtf-loai', 'SXKD');
  await page.locator('.adv button[type="submit"]').click({ force: true });
  await expect.poll(async () => (await listCodes(page)).sort()).toEqual(['005-26-VHT-BP-M', '020-26-VHT-BP-C']);

  const dl = page.waitForEvent('download');
  await page.locator('[data-dt="export"]').click();
  const file = await dl;
  expect(file.suggestedFilename()).toBe('Danh sach Du an De tai.csv');
  const csv = readFileSync(await file.path(), 'utf8').replace(/^﻿/, '').split('\n');
  expect(csv[2].split('","').length).toBe(18);
  expect(csv[2]).toContain('Tổng Giá trị đầu tư mua sắm');
  expect(csv.length).toBe(5);
  await page.locator('[data-dt-list] tbody tr').first().locator('td:nth-child(4) a').click();
  await expect(page).toHaveURL(/#\/de-tai\//);
  expect(page.errors).toEqual([]);
});

test('SCR-104: 5 tab cho mọi Loại (T31 B2); dự toán chỉ xem (góp ý 05/11), ghim cột Loại CP / Khoản mục; accordion đợt; xuất', async ({ page }) => {
  await fresh(page, '#/de-tai/' + encodeURIComponent('DA-2026-002'));
  // T29 B15 (D-80): ẩn tab Gói thầu / Hợp đồng (cờ D.show); 11/11/2026 tab KĐT liên quan riêng.
  await expect(page.locator('[data-dt-tab]')).toHaveText(['Thông tin chung', 'Dự toán chi phí', 'ĐXMS liên quan', 'KĐT liên quan', 'Văn bản pháp lý']);
  await expect(page.locator('main .ginfo').first()).toContainText('Đồng bộ HR Tool');

  await go(page, '#/de-tai/' + encodeURIComponent(DT));
  await expect(page.locator('main .ginfo').first()).toContainText('Đồng bộ KHCN');
  await page.locator('[data-dt-tab="du-toan"]').click();
  await expect(page.locator('[data-dt-kpi] .dt-tip').nth(1)).toHaveAttribute('title', 'Đề xuất mua sắm, khoản đầu tư đang xử lý'); // V1.4: nhãn Đang giữ, tooltip
  // Chỉ xem: không Thêm mới, không cột Thao tác (Sao chép / Sửa / Xoá) — kể cả đơn vị lập đề tài.
  await expect(page.locator('[data-dt-x="add"]')).toHaveCount(0);
  await expect(page.locator('[data-dt-edit], [data-dt-copy], [data-dt-del]')).toHaveCount(0);
  await expect(page.locator('[data-dt-dutoan] thead th')).not.toContainText(['Thao tác']);
  // Ghim cột: STT và Loại chi phí / Khoản mục chi phí đứng yên khi cuộn ngang.
  const head = page.locator('[data-dt-dutoan] thead th.pin');
  await expect(head).toHaveText(['STT', 'Loại chi phí / Khoản mục chi phí']);
  const vp = page.locator('[data-dt-dutoan] .vtable-vp');
  const x0 = await head.nth(1).evaluate((e) => e.getBoundingClientRect().left);
  await vp.evaluate((e) => { e.scrollLeft = 600; });
  expect(await vp.evaluate((e) => e.scrollLeft)).toBeGreaterThan(0);
  expect(await head.nth(1).evaluate((e) => e.getBoundingClientRect().left)).toBe(x0);
  await vp.evaluate((e) => { e.scrollLeft = 0; });
  // Accordion: khoản mục 1 có đợt của ĐXMS-2026-0101 (đang phê duyệt).
  await line(page, `${DT}-1`).locator('[data-vtt]').click();
  await expect(line(page, `${DT}-1:ĐXMS-2026-0101`)).toContainText('ĐXMS-2026-0101');
  await expect(line(page, `${DT}-1:ĐXMS-2026-0101`)).toContainText('Đang phê duyệt');
  // Vai không phải TTMS: không đổi được Chi mua sắm, Trạng thái chỉ là nhãn.
  await expect(page.locator(`[data-dt-buy="${DT}-1"]`)).toBeDisabled();
  await expect(line(page, `${DT}-1`).locator('[data-vsel]')).toHaveCount(0);
  // D-79: trạng thái suy từ ĐXMS — khoản mục 1 có ĐXMS-2026-0101 đang phê duyệt.
  await expect(line(page, `${DT}-1`)).toContainText('Đang mua sắm');
  const dl = page.waitForEvent('download');
  await page.locator('[data-dt-x="export"]').click();
  expect((await dl).suggestedFilename()).toBe(`Du toan ${DT}.csv`);
  expect(page.errors).toEqual([]);
});

test('SCR-104 (SRS-DADT V1.4 BR-DADT-02-10): Chi mua sắm / Hoàn thành qua chế độ chỉnh sửa; bỏ khi đang giữ bị chặn lúc [Lưu]; Hoàn thành → không bóc tách thêm (P-203)', async ({ page }) => {
  await fresh(page, '#/de-tai/' + encodeURIComponent(DT));
  await page.evaluate(() => Flow.setPersona('lan'));
  await page.locator('[data-dt-tab="du-toan"]').click();
  // Mặc định chỉ xem, kể cả TTMS.
  await expect(page.locator(`[data-dt-buy="${DT}-1"]`)).toBeDisabled();
  await page.locator('[data-dt-e="edit"]').click();
  // Bỏ Chi mua sắm khoản mục đang giữ: chỉ là nháp, bị chặn khi [Lưu], không ghi gì, giữ nháp.
  await page.locator(`[data-dt-buy="${DT}-1"]`).click();
  await expect(line(page, `${DT}-1`).locator('[data-dt-dirty]')).toHaveCount(1);
  await page.locator('[data-dt-e="save"]').click();
  expect(await lastToast(page)).toContain('Khoản mục đang được giữ bởi ĐXMS-2026-0101');
  await expect(page.locator(`[data-dt-buy="${DT}-1"]`)).not.toBeChecked();
  expect(await page.evaluate((c) => D.duToanOf(c).find((l) => l.id === c + '-1').buy, DT)).toBe(true);
  await page.locator('[data-dt-e="cancel"]').click();
  await expect(page.locator(`[data-dt-buy="${DT}-1"]`)).toBeChecked();
  // Dòng chưa đánh dấu: không có Trạng thái. Đánh dấu trong nháp: Trạng thái suy, chưa chọn Hoàn thành được tới khi lưu.
  await page.locator('[data-dt-e="edit"]').click();
  await expect(line(page, `${DT}-5`).locator('[data-vsel]')).toHaveCount(0);
  await expect(line(page, `${DT}-5`)).not.toContainText('Chưa mua sắm');
  await page.locator(`[data-dt-buy="${DT}-5"]`).check();
  await expect(line(page, `${DT}-5`)).toContainText('Chưa mua sắm');
  await expect(line(page, `${DT}-5`).locator('[data-vsel]')).toHaveCount(0);
  await page.locator('[data-dt-e="save"]').click();
  expect(await lastToast(page)).toContain('Cập nhật khoản mục thành công.');
  expect(await page.evaluate((c) => D.duToanOf(c).find((l) => l.id === c + '-5').buy, DT)).toBe(true);
  // TTMS chọn Hoàn thành → [Lưu] hỏi xác nhận "Cập nhật khoản mục".
  await page.locator('[data-dt-e="edit"]').click();
  const st = line(page, `${DT}-5`).locator(`[data-vsel="dts-${DT}-5"]`);
  await expect(st).toContainText('Chưa mua sắm');
  await st.click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Hoàn thành' }).click();
  await line(page, `${DT}-6`).locator(`[data-vsel="dts-${DT}-6"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Hoàn thành' }).click();
  await page.locator('[data-dt-e="save"]').click();
  const dlg = page.locator('[data-dt-confirm]');
  await expect(dlg).toContainText('Khoản mục Dự phòng phí sẽ không còn bóc tách được vào đề xuất mua sắm, khoản đầu tư.');
  await expect(dlg).toContainText('Khoản mục Máy tính xách tay cấu hình cao sẽ không còn bóc tách được');
  await expect(dlg).toContainText('Bạn có chắc chắn?');
  await page.locator('[data-dt-ok]').click();
  expect(await lastToast(page)).toContain('Cập nhật khoản mục thành công.');
  await expect(line(page, `${DT}-5`)).toContainText('Hoàn thành');
  expect(await page.evaluate((c) => D.duToanOf(c).find((l) => l.id === c + '-5').status, DT)).toBe('Hoàn thành');
  // Khoản mục Hoàn thành không còn trong danh sách bóc tách khi tạo KĐT (GIẢ LẬP P-203): dòng 6 (PL2) đã Hoàn thành.
  await go(page, '#/kdt/create');
  await page.locator('[data-vsel="k-nv"]').click();
  await page.locator(`.vsel-panel [data-opt="${DT}"]`).click();
  await page.keyboard.press('Escape'); // T45: k-nv chọn nhiều — danh sách giữ mở sau khi chọn
  await page.locator('[data-vsel="kc-ctype"]').click();
  await page.locator('.vsel-panel [data-opt="PL2"]').click();
  await page.locator('[data-vsel="kc-cline"]').click();
  await expect(page.locator(`.vsel-panel [data-opt="${DT}-1"]`)).toHaveCount(1);
  await expect(page.locator(`.vsel-panel [data-opt="${DT}-6"]`)).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('D-66: ĐXMS hiện "Đề tài / dự án", mở chi tiết đề tài; ĐXMS liên quan có ĐXMS đã phê duyệt', async ({ page }) => {
  await fresh(page, '#/dxms/' + encodeURIComponent('ĐXMS-2026-0072'));
  const link = page.locator(`main [data-go="de-tai/${encodeURIComponent('NV-KHCN-2026-006')}"]`);
  await expect(link).toContainText('NV-KHCN-2026-006');
  await link.click();
  await expect(page).toHaveURL(/#\/de-tai\/NV-KHCN-2026-006$/);
  await page.locator('[data-dt-tab="dxms"]').click();
  await expect(page.locator('main tbody').first()).toContainText('ĐXMS-2026-0072');
  await expect(page.locator('main tbody').first()).toContainText('Đã phê duyệt');
  await page.locator('[data-dt-tab="phap-ly"]').click();
  await expect(page.locator('main tbody')).toContainText('0917/QĐ-VHT');
  // Góp ý 05/11: cột tải file văn bản pháp lý.
  await expect(page.locator('main thead th').nth(1)).toHaveText('Thao tác');
  await page.locator('main tbody [data-dl="0917-QĐ-VHT.pdf"]').click();
  expect(await lastToast(page)).toContain('Đã tải xuống 0917-QĐ-VHT.pdf');
  expect(page.errors).toEqual([]);
});
