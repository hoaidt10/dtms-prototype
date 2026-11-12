// SRS-DADT V1.4 (đối chiếu bản V3.0, docs/SRS/10-srs-dadt/doi-chieu-v3.md mục 3 P1 – P5) — tab Dự toán chi phí của SCR-104:
// chế độ chỉnh sửa BR-DADT-02-10 (DTMS_CN_0244), ba mốc giá trị BR-DADT-02-05, 10 chỉ số BR-DADT-02-07 (DTMS_CN_0245), tệp xuất BR-DADT-02-08 (DTMS_CN_0246).
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const line = (page, id) => page.locator(`[data-vtt-row="${id}"]`);
const DT = 'NV-KHCN-2026-014', DT2 = 'NV-KHCN-2026-006';
const openTab = async (page, code, persona) => {
  await fresh(page, '#/de-tai/' + encodeURIComponent(code));
  if (persona) await page.evaluate((p) => Flow.setPersona(p), persona);
  await page.locator('[data-dt-tab="du-toan"]').click();
};
const KPI = ['Tổng dự toán (gồm VAT)', 'Giá trị chi mua sắm', 'Đã đăng ký', 'Đang giữ', 'Còn lại khả dụng', 'Giá trị chọn thầu', 'Giá trị chọn HĐ',
  'Giá trị sau khi tất toán HĐ', 'Giá trị tiết kiệm', 'Tỷ lệ đã đăng ký mua'];

test('P2, P3: 10 chỉ số; ba mốc thay Giá trị thực hiện; chưa có mốc thì "-"; có mốc thì cộng theo dòng con, tiết kiệm = dự toán − mốc muộn nhất', async ({ page }) => {
  await openTab(page, DT);
  await expect(page.locator('[data-dt-kpi] .ginfo > div .k')).toHaveText(KPI);
  await expect(page.locator('[data-dt-kpi] .dt-tip')).toHaveCount(3);
  const heads = await page.locator('[data-dt-dutoan] thead th').allTextContents();
  expect(heads).not.toContain('Giá trị thực hiện');
  const at = heads.indexOf('Giá trị chọn thầu');
  expect(heads.slice(at, at + 4)).toEqual(['Giá trị chọn thầu', 'Giá trị chọn HĐ', 'Giá trị sau khi tất toán HĐ', 'Giá trị tiết kiệm']);
  // Đề tài chưa có gói thầu / hợp đồng: ba mốc, tiết kiệm "-" (cả chỉ số).
  const kv = (i) => page.locator('[data-dt-kpi] .ginfo > div').nth(i).locator('.v');
  for (const i of [5, 6, 7, 8]) await expect(kv(i)).toHaveText('-');

  // NV-KHCN-2026-006: ĐXMS-2026-0072 đã phê duyệt — khoản mục 1 đủ ba mốc, khoản mục 2 hai mốc (GIẢ LẬP D.duToanMoc).
  await openTab(page, DT2);
  const col = (h) => heads.indexOf(h);
  const cellText = async (id, h) => (await line(page, id).locator('td').nth(col(h)).innerText()).trim();
  expect(await cellText(`${DT2}-1`, 'Giá trị chọn thầu')).toBe('176,80');
  expect(await cellText(`${DT2}-1`, 'Giá trị sau khi tất toán HĐ')).toBe('173,95');
  expect(await cellText(`${DT2}-1`, 'Giá trị tiết kiệm')).toBe('8,55');
  expect(await cellText(`${DT2}-2`, 'Giá trị sau khi tất toán HĐ')).toBe('-');
  expect(await cellText(`${DT2}-2`, 'Giá trị tiết kiệm')).toBe('1,30');
  await expect(kv(5)).toHaveText('198,90 tỷ đồng');
  await expect(kv(7)).toHaveText('173,95 tỷ đồng');
  await expect(kv(8)).toHaveText('9,85 tỷ đồng');
  // Dòng con có mốc của chính nó.
  await line(page, `${DT2}-1`).locator('[data-vtt]').click();
  const sub = line(page, `${DT2}-1:ĐXMS-2026-0072`);
  expect((await sub.locator('td').nth(col('Giá trị chọn HĐ')).innerText()).trim()).toBe('174,50');
  expect(page.errors).toEqual([]);
});

test('P1: [Chỉnh sửa] chỉ TTMS; nháp có dấu Đã sửa, chỉ số chưa đổi; [Hủy] bỏ nháp; [Lưu] không đổi gì thì chỉ thoát', async ({ page }) => {
  await openTab(page, DT);
  await expect(page.locator('[data-dt-e]')).toHaveCount(0); // vai mặc định không phải TTMS
  await page.evaluate(() => Flow.setPersona('lan'));
  await expect(page.locator('[data-dt-e="edit"]')).toHaveText(/Chỉnh sửa/);
  await expect(page.locator(`[data-dt-buy="${DT}-5"]`)).toBeDisabled();
  await page.locator('[data-dt-e="edit"]').click();
  await expect(page.locator('[data-dt-e]')).toHaveText(['Hủy', 'Lưu']);
  const kpi0 = await page.locator('[data-dt-kpi]').innerText();
  await page.locator(`[data-dt-buy="${DT}-5"]`).check();
  await expect(line(page, `${DT}-5`).locator('[data-dt-dirty]')).toHaveCount(1);
  expect(await page.locator('[data-dt-kpi]').innerText()).toBe(kpi0);
  expect(await page.evaluate((c) => D.duToanOf(c).find((l) => l.id === c + '-5').buy, DT)).toBe(false);
  // Đánh dấu rồi bỏ lại = không đổi → hết dấu.
  await page.locator(`[data-dt-buy="${DT}-5"]`).uncheck();
  await expect(page.locator('[data-dt-dirty]')).toHaveCount(0);
  await page.locator(`[data-dt-buy="${DT}-5"]`).check();
  await page.locator('[data-dt-e="cancel"]').click();
  await expect(page.locator(`[data-dt-buy="${DT}-5"]`)).not.toBeChecked();
  await expect(page.locator('[data-dt-e="edit"]')).toHaveCount(1);
  // [Lưu] khi không đổi gì: thoát, không toast.
  await page.locator('[data-dt-e="edit"]').click();
  await page.locator('[data-dt-e="save"]').click();
  await expect(page.locator('[data-dt-e="edit"]')).toHaveCount(1);
  await expect(page.locator('.toast')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('P1: bỏ Chi mua sắm khoản mục đã đăng ký → hộp xác nhận nêu phần đã đăng ký; [Hủy] giữ nháp; [Đồng ý] ghi, chỉ số tính lại', async ({ page }) => {
  await openTab(page, DT2, 'lan');
  await page.locator('[data-dt-e="edit"]').click();
  await page.locator(`[data-dt-buy="${DT2}-1"]`).uncheck();
  await page.locator('[data-dt-e="save"]').click();
  const dlg = page.locator('[data-dt-confirm]');
  await expect(page.locator('.vmodal-h h3')).toHaveText('Cập nhật khoản mục');
  await expect(dlg).toContainText('Khoản mục Thiết bị, máy đo chuyên dụng sẽ không còn bóc tách được vào đề xuất mua sắm, khoản đầu tư và không tính vào Tổng giá trị đầu tư mua sắm.');
  await expect(dlg).toContainText('Khoản mục đã được đăng ký 182,50 tỷ đồng; phần này giữ nguyên.');
  await page.locator('.vmodal [data-close]').last().click();
  await expect(dlg).toHaveCount(0);
  await expect(page.locator(`[data-dt-buy="${DT2}-1"]`)).not.toBeChecked();
  await expect(page.locator('[data-dt-e="save"]')).toHaveCount(1);
  const buy0 = await page.locator('[data-dt-kpi] .ginfo > div').nth(1).locator('.v').innerText();
  await page.locator('[data-dt-e="save"]').click();
  await page.locator('[data-dt-ok]').click();
  expect(await lastToast(page)).toContain('Cập nhật khoản mục thành công.');
  await expect(page.locator('[data-dt-e="edit"]')).toHaveCount(1);
  expect(await page.locator('[data-dt-kpi] .ginfo > div').nth(1).locator('.v').innerText()).not.toBe(buy0);
  // Đã đăng ký vẫn tính (khoản mục đã bỏ Chi mua sắm còn phần đã dùng — BR-DADT-02-07); Trạng thái "-".
  await expect(page.locator('[data-dt-kpi] .ginfo > div').nth(2).locator('.v')).not.toHaveText('0,00 tỷ đồng');
  expect(page.errors).toEqual([]);
});

test('P1: còn nháp mà chuyển tab hoặc rời màn thì hỏi; [Hủy] ở lại giữ nháp, [Đồng ý] bỏ nháp', async ({ page }) => {
  await openTab(page, DT, 'lan');
  await page.locator('[data-dt-e="edit"]').click();
  await page.locator(`[data-dt-buy="${DT}-5"]`).check();
  await page.locator('[data-dt-tab="info"]').click();
  await expect(page.locator('.vconfirm')).toContainText('Các thay đổi chưa lưu sẽ bị bỏ. Bạn có chắc chắn?');
  await page.locator('.vconfirm [data-close]').last().click();
  await expect(page.locator('[data-dt-dutoan]')).toHaveCount(1);
  await expect(page.locator(`[data-dt-buy="${DT}-5"]`)).toBeChecked();
  // Rời màn bằng nút quay lại / menu.
  await page.locator('.sb-nav [data-go="de-tai"]').click();
  await expect(page.locator('.vconfirm')).toHaveCount(1);
  await page.locator('#cf-ok').click();
  await expect(page).toHaveURL(/#\/de-tai$/);
  expect(await page.evaluate((c) => D.duToanOf(c).find((l) => l.id === c + '-5').buy, DT)).toBe(false);
  expect(page.errors).toEqual([]);
});

test('P4: Xuất Excel dự toán có ba mốc, Giá trị tiết kiệm và phần Chỉ số thực hiện 10 chỉ số (chỉ số "-" để trống)', async ({ page }) => {
  await openTab(page, DT2);
  const dl = page.waitForEvent('download');
  await page.locator('[data-dt-x="export"]').click();
  const file = await dl;
  expect(file.suggestedFilename()).toBe(`Du toan ${DT2}.csv`);
  const rows = readFileSync(await file.path(), 'utf8').replace(/^﻿/, '').split('\n').map((r) => r.slice(1, -1).split('","'));
  const head = rows[1];
  expect(head).toContain('Giá trị chọn thầu');
  expect(head).toContain('Giá trị sau khi tất toán HĐ');
  expect(head).not.toContain('Giá trị thực hiện');
  const at = rows.findIndex((r) => r[0] === 'Chỉ số thực hiện');
  expect(rows.slice(at + 2, at + 12).map((r) => r[0])).toEqual(KPI);
  expect(rows[at + 2 + 5][1]).toBe('198.9');
  expect(page.errors).toEqual([]);

  await openTab(page, DT);
  const dl2 = page.waitForEvent('download');
  await page.locator('[data-dt-x="export"]').click();
  const rows2 = readFileSync(await (await dl2).path(), 'utf8').replace(/^﻿/, '').split('\n').map((r) => r.slice(1, -1).split('","'));
  const at2 = rows2.findIndex((r) => r[0] === 'Chỉ số thực hiện');
  expect(rows2[at2 + 2 + 5]).toEqual(['Giá trị chọn thầu', '']);
});
