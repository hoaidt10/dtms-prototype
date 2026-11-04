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
  await expect(page.locator('.sidebar .child.active')).toHaveText('Đề tài / dự án');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách đề tài / dự án');
  await expect(page.locator('[data-dt-list] thead th')).toHaveText(['STT', 'Trạng thái', 'Loại dự án / đề tài', 'Mã dự án / đề tài', 'Tên dự án / đề tài', 'Đơn vị lập', 'Chủ nhiệm',
    'Nguồn vốn', 'Tổng dự toán (tỷ đồng)', 'TG bắt đầu', 'TG kết thúc', 'Số ngày còn thực hiện', 'Nguồn dữ liệu']);
  await expect(page.locator('[data-create]')).toHaveCount(0);

  await page.locator('#dt-kw').fill('đường sắt');
  await page.locator('#dt-kw').press('Enter');
  await expect.poll(() => listCodes(page)).toEqual(['009-26-VHT-RDP-DS']);

  await page.locator('[data-dt="adv"]').click();
  await pick(page, 'dtf-loai', 'KHCN');
  await page.locator('[data-vsel="dtf-loaiCt"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(7);
  await page.locator('.pg-title').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  await expect.poll(async () => (await listCodes(page)).sort()).toEqual(['004-26-VHT-RDP-DS', '009-26-VHT-RDP-DS', 'DT-KHCN-2027-002', 'NV-KHCN-2025-031', 'NV-KHCN-2026-006', 'NV-KHCN-2026-014']);
  await expect(page.locator('[data-dt-list] tbody')).not.toContainText('Nhập ở hệ thống cũ');

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

test('SCR-104: 4 tab cho mọi Loại; dự toán — thêm, Nhập tay, sửa, copy, xóa; xóa bị chặn khi có ĐXMS; accordion đợt', async ({ page }) => {
  await fresh(page, '#/de-tai/' + encodeURIComponent('DA-2026-002'));
  await expect(page.locator('[data-dt-tab]')).toHaveText(['Thông tin chung', 'Dự toán chi phí', 'ĐXMS liên quan', 'Văn bản pháp lý']);
  await expect(page.locator('main .ginfo')).toContainText('Nhập ở hệ thống cũ');

  await go(page, '#/de-tai/' + encodeURIComponent(DT));
  await expect(page.locator('main .ginfo')).toContainText('KHCN (đồng bộ)');
  await page.locator('[data-dt-tab="du-toan"]').click();
  await expect(page.locator('[data-dt-kpi]')).toContainText('Đang giữ (ĐXMS đang xử lý)');
  // Accordion: khoản mục 1 có đợt của ĐXMS-2026-0101 (đang phê duyệt).
  await line(page, `${DT}-1`).locator('[data-vtt]').click();
  await expect(line(page, `${DT}-1:ĐXMS-2026-0101`)).toContainText('ĐXMS-2026-0101');
  await expect(line(page, `${DT}-1:ĐXMS-2026-0101`)).toContainText('Đang phê duyệt');
  // Chuyên quản ĐVĐX (đơn vị lập): có thao tác, không đổi được Chi mua sắm.
  await expect(page.locator(`[data-dt-buy="${DT}-1"]`)).toBeDisabled();

  await page.locator('[data-dt-x="add"]').click();
  const dlg = page.locator('.vmodal');
  await dlg.locator('#dtl-save').click();
  await expect(dlg.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn Loại chi phí.', 'Bạn cần nhập Khoản mục chi phí.', 'Bạn cần nhập Khối lượng cần thực hiện.', 'Bạn cần nhập Giá trị trước thuế.']);
  await pick(dlg, 'dtl-type', 'PL2');
  await dlg.locator('[data-lf="item"]').fill('Bộ nguồn DC lập trình');
  await dlg.locator('[data-lf="uom"]').fill('Bộ');
  await dlg.locator('[data-lf="qty"]').fill('5');
  await dlg.locator('[data-lf="pre"]').fill('1,2');
  await expect(dlg.locator('[data-ff="tax"] input')).toHaveValue('0,12');
  await expect(dlg.locator('[data-ff="value"] input')).toHaveValue('1,32');
  await dlg.locator('#dtl-save').click();
  await expect(dlg).toHaveCount(0);
  expect(await lastToast(page)).toContain('Thêm mới thành công');
  const added = `${DT}-10`;
  await expect(line(page, added)).toContainText('Bộ nguồn DC lập trình');
  await expect(line(page, added)).toContainText('1,32');

  await line(page, added).locator(`[data-dt-edit="${added}"]`).click();
  await dlg.locator('[data-lf="manual"]').check();
  await dlg.locator('[data-lf="tax"]').fill('0,1');
  await expect(dlg.locator('[data-ff="value"] input')).toHaveValue('1,30');
  await dlg.locator('#dtl-save').click();
  await expect(line(page, added)).toContainText('1,30');

  await line(page, added).locator(`[data-dt-copy="${added}"]`).click();
  await expect(dlg.locator('[data-lf="item"]')).toHaveValue('Bộ nguồn DC lập trình (bản sao)');
  await dlg.locator('#dtl-save').click();
  await expect(line(page, `${DT}-11`)).toContainText('(bản sao)');
  await line(page, `${DT}-11`).locator(`[data-dt-del="${DT}-11"]`).click();
  await page.locator('#cf-ok').click();
  await expect(line(page, `${DT}-11`)).toHaveCount(0);

  await line(page, `${DT}-1`).locator(`[data-dt-del="${DT}-1"]`).click();
  expect(await lastToast(page)).toContain('Khoản mục đã được dùng ở ĐXMS-2026-0101');
  await expect(line(page, `${DT}-1`)).toHaveCount(1);
  const dl = page.waitForEvent('download');
  await page.locator('[data-dt-x="export"]').click();
  expect((await dl).suggestedFilename()).toBe(`Du toan ${DT}.csv`);
  expect(page.errors).toEqual([]);
});

test('SCR-104: Chi mua sắm chỉ TTMS; bỏ tích bị chặn khi ĐXMS đang giữ (D-64); tích dòng mới hiện Trạng thái', async ({ page }) => {
  await fresh(page, '#/de-tai/' + encodeURIComponent(DT));
  await page.evaluate(() => Flow.setPersona('lan'));
  await page.locator('[data-dt-tab="du-toan"]').click();
  await expect(page.locator('[data-dt-x="add"]')).toHaveCount(0);
  await expect(page.locator(`[data-dt-del="${DT}-1"]`)).toHaveCount(0);
  await page.locator(`[data-dt-buy="${DT}-1"]`).click();
  expect(await lastToast(page)).toContain('Khoản mục đang được giữ bởi ĐXMS-2026-0101');
  await expect(page.locator(`[data-dt-buy="${DT}-1"]`)).toBeChecked();
  await expect(line(page, `${DT}-5`).locator('td').last()).toBeVisible();
  await expect(line(page, `${DT}-5`)).not.toContainText('Đang thực hiện');
  await page.locator(`[data-dt-buy="${DT}-5"]`).check();
  expect(await lastToast(page)).toContain('Cập nhật Chi mua sắm thành công');
  await expect(line(page, `${DT}-5`)).toContainText('Đang thực hiện');
  expect(await page.evaluate((c) => D.duToanOf(c).find((l) => l.id === c + '-5').buy, DT)).toBe(true);
  expect(page.errors).toEqual([]);
});

test('D-66: ĐXMS hiện "Đề tài / dự án", mở chi tiết đề tài; ĐXMS liên quan có ĐXMS đã phê duyệt', async ({ page }) => {
  await fresh(page, '#/dxms/' + encodeURIComponent('ĐXMS-2026-0072'));
  const link = page.locator(`main [data-go="de-tai/${encodeURIComponent('NV-KHCN-2026-006')}"]`);
  await expect(link).toContainText('NV-KHCN-2026-006');
  await link.click();
  await expect(page).toHaveURL(/#\/de-tai\/NV-KHCN-2026-006$/);
  await page.locator('[data-dt-tab="dxms"]').click();
  await expect(page.locator('main tbody')).toContainText('ĐXMS-2026-0072');
  await expect(page.locator('main tbody')).toContainText('Đã phê duyệt');
  await page.locator('[data-dt-tab="phap-ly"]').click();
  await expect(page.locator('main tbody')).toContainText('0917/QĐ-VHT');
  expect(page.errors).toEqual([]);
});
