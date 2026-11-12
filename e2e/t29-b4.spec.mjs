// T29 B4 — P1 chặn Báo giá đạt khi vượt phần căn cứ (BR-DXMS-04-11 sửa 04/11) và P2 điều khoản phiếu YCBG ở bước 8 (BR-DXMS-04-06, DTMS_CN_0145 mục 7a–7d).
// Plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md §3.5, §3.6.
import { test, expect } from '@playwright/test';
import { fresh, openForm, lastToast } from './helpers.mjs';

const bg = (page) => page.locator('[data-bg-card]');

test('P1: nhánh demo vượt căn cứ — bảng Đối chiếu phần căn cứ âm, câu đỏ; Báo giá đạt bị chặn, ở lại bước 10; chọn lại cơ sở giá thì xác nhận được', async ({ page }) => {
  // Review nhi 06/11 #2: card Đánh giá báo giá tạm ẩn (D.quoteManual) — bật lại cờ thì chạy lại test này.
  test.skip(true, 'D.quoteManual: card Đánh giá báo giá tạm ẩn');
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-branch]', { hasText: 'Báo giá vượt phần căn cứ' }).click();
  await expect(page).toHaveURL(/#\/task\//);
  await expect(bg(page)).toBeVisible();
  // Beta 39,5 tỷ × 2 hệ thống buồng đo OTA: hạng mục liên kết 1482/QĐ-VHT = 64 + 42 + 79 + 11,9 = 196,90 (hạng mục 5 Ngoài căn cứ không tính).
  await expect(bg(page).locator('[data-bg-total]')).toHaveText('205,90');
  const row = bg(page).locator('[data-bg-basis] [data-bg-doc="qd1"]');
  await expect(row).toContainText('1482/QĐ-VHT');
  await expect(row.locator('td').nth(5)).toHaveText('196,90');
  await expect(row.locator('td').last()).toHaveText('-7,50');
  await expect(row.locator('td').last()).toHaveClass(/t-err/);
  await expect(bg(page).locator('[data-bg-over]')).toHaveText('Văn bản căn cứ 1482/QĐ-VHT còn có thể sử dụng 189,40 tỷ đồng, hạng mục liên kết có Thành tiền 196,90 tỷ đồng. Vui lòng chọn lại cơ sở giá hoặc chọn Không đạt — tạo YCBG mới.');

  // Báo giá đạt: không lưu, hồ sơ ở lại bước 10.
  const f = await openForm(page, 'Báo giá đạt');
  await f.locator('#ok').click();
  await expect(f).toBeVisible();
  expect(await lastToast(page)).toContain('Văn bản căn cứ 1482/QĐ-VHT còn có thể sử dụng 189,40 tỷ đồng');
  await f.locator('[data-close]').first().click();
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => t.task))).toContain(10);

  // Chọn lại cơ sở giá Alpha (thấp nhất) cho hạng mục 3: còn 15,50, hết câu đỏ, xác nhận được → sang cổng giá trị.
  await bg(page).locator('[data-vsel="bg-base-3"]').click();
  await page.locator('.vsel-panel [data-opt="NCC-000001"]').click();
  await expect(bg(page).locator('[data-bg-over]')).toHaveCount(0);
  await expect(row.locator('td').last()).toHaveText('15,50');
  await expect(row.locator('td').last()).not.toHaveClass(/t-err/);
  expect(await page.evaluate(() => BaoGia.problems())).toEqual([]);
  const f2 = await openForm(page, 'Báo giá đạt');
  await f2.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  // Lần gửi 1 có NCC Gamma hết hiệu lực → cổng DX-03 có thể đưa về bước 09; ở đây chỉ kiểm bước 10 đã ghi Báo giá đạt.
  await expect.poll(() => page.evaluate(() => Flow.state.history.some((h) => String(h.task) === '10' && h.action === 'Báo giá đạt'))).toBe(true);
  expect(await page.evaluate(() => Flow.state.vars.totalQ)).toBe(182.9);
  expect(page.errors).toEqual([]);
});

test('P1: hạng mục Ngoài căn cứ không tính; văn bản bổ sung chưa có hạng mục liên kết thì không chặn', async ({ page }) => {
  // Review nhi 06/11 #2: card Đánh giá báo giá tạm ẩn (D.quoteManual) — bật lại cờ thì chạy lại test này.
  test.skip(true, 'D.quoteManual: card Đánh giá báo giá tạm ẩn');
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(10, 'minh', null, null, null, { basisMore: ['qd2'] }); const k = Flow.state.tokens.find((t) => t.task === 10); Flow.setPersona(k.who); return k.id; });
  await page.evaluate((i) => { location.hash = '#/task/' + i; }, id);
  await expect(bg(page).locator('[data-bg-basis] tbody tr')).toHaveCount(2);
  const more = bg(page).locator('[data-bg-doc="qd2"]');
  await expect(more).toContainText('(bổ sung)');
  await expect(more.locator('td').nth(5)).toHaveText('-');
  // Dịch vụ đào tạo (Ngoài căn cứ) tăng giá không làm âm văn bản chính.
  await bg(page).locator('[data-bg-in="NCC-000001:p5"]').fill('30.000.000.000');
  await bg(page).locator('[data-bg-in="NCC-000001:p5"]').dispatchEvent('change');
  await expect(bg(page).locator('[data-bg-doc="qd1"] td').last()).toHaveText('15,50');
  const bc = await page.evaluate(() => BaoGia.basisCheck().map((r) => [r.d.no, r.linked, r.remain]));
  expect(bc).toEqual([['1482/QĐ-VHT', 4, 15.5], ['0917/QĐ-VHT', 0, 41.2]]);
  expect(await page.evaluate(() => BaoGia.problems())).toEqual([]);
  expect(page.errors).toEqual([]);
});

test('P2: bước 8 có nhóm Điều khoản trên phiếu (mẫu điền sẵn, đầu mối mặc định người xử lý); lưu vào Chi tiết YCBG và file xuất', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(8, 'minh'); const k = Flow.state.tokens.find((t) => t.task === 8); Flow.setPersona(k.who); return k.id; });
  await page.evaluate((i) => { location.hash = '#/task/' + i; }, id);
  const f = await openForm(page);
  await expect(f).toContainText('Điều khoản trên phiếu yêu cầu báo giá');
  await expect(f.locator('[data-ef="dkThanhToan"]')).toHaveValue(/40 %.*60 %/);
  await expect(f.locator('[data-ef="diaDiemGiao"]')).toHaveValue(/Kho Viettel Hòa Lạc/);
  await expect(f.locator('[data-ef="yeuCauKhac"]')).toHaveValue(/07 ngày/);
  const who = await page.evaluate(() => Flow.state.tokens.find((t) => t.task === 8).who);
  await expect(f.locator('[data-vsel="ef-dauMoiBg"]')).toContainText(await page.evaluate((w) => UI.persona(w).name, who));
  // Quá độ dài Địa điểm giao hàng (500) không xác nhận được.
  await f.locator('[data-ef="diaDiemGiao"]').fill('x'.repeat(501));
  await f.locator('#ok').click();
  await expect(f.locator('[data-ef-field="diaDiemGiao"] .msg')).toHaveText('Tối đa 500 ký tự');
  await f.locator('[data-ef="diaDiemGiao"]').fill('Kho Trung tâm Vô tuyến — Tòa nhà VHT, Hòa Lạc');
  await f.locator('[data-ef="yeuCauKhac"]').fill('Giao theo 02 lô; bảo hành 24 tháng.');
  await f.locator('[data-vsel="ef-dauMoiBg"]').click();
  await page.locator('.vsel-panel [data-opt="lan"]').click();
  await f.locator('.ef-text h4').first().click();
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  expect(await page.evaluate(() => [Flow.ui.diaDiemGiao, Flow.ui.dauMoiBg])).toEqual(['Kho Trung tâm Vô tuyến — Tòa nhà VHT, Hòa Lạc', [who, 'lan']]);

  // SCR-74: card Điều khoản trên phiếu hiện 4 trường; lần gửi lại giữ nguyên.
  const code = await page.evaluate(() => Ycbg.ycbgOf(Flow.state.dxms).pop().code);
  await page.evaluate((c) => { location.hash = '#/ycbg/' + encodeURIComponent(c); }, code);
  const card = page.locator('main .vcard', { hasText: 'Điều khoản trên phiếu yêu cầu báo giá' });
  await expect(card).toContainText('40 %');
  await expect(card).toContainText('Kho Trung tâm Vô tuyến — Tòa nhà VHT, Hòa Lạc');
  await expect(card).toContainText('Giao theo 02 lô; bảo hành 24 tháng.');
  await expect(card).toContainText('Phạm Thị Lan');
  await expect(card).toContainText('lan@viettel.com.vn');
  const dl = page.waitForEvent('download');
  await page.locator(`[data-y-export="${code}"]`).click();
  const file = await (await dl).createReadStream();
  const txt = await new Promise((r) => { let s = ''; file.on('data', (d) => { s += d; }); file.on('end', () => r(s)); });
  expect(txt).toContain('Đầu mối tiếp nhận báo giá');
  expect(txt).toContain('Kho Trung tâm Vô tuyến');
  expect(page.errors).toEqual([]);
});
