// T29 B3a + B5 — SCR-105 Rà soát tồn kho: việc của Phòng QLTS / Thủ kho (ngoài sơ đồ) khi hồ sơ ở bước 7; nhập MỘT lần theo cột biên bản BM-RSTK
// (D-82, review Huylx4 #21–24); bước 7 của ĐVĐX chỉ xác nhận được khi Kho đã nhập; biên bản rà soát + phiếu yêu cầu (C1, C2 — P-186, P-187).
import { test, expect } from '@playwright/test';
import { fresh, openForm, lastToast, aiApply } from './helpers.mjs';

const ed = (page) => page.locator('[data-rsk-ed]');
const cell = (page, n, k) => ed(page).locator(`[data-rsk-in="${n}:${k}"]`);
// T59 Q8: biên bản kiểm đếm có ký là ô riêng (#rsk-sign); Tệp kết quả Excel ở #rsk-file.
// T72 #78 (D-122 Q2): bỏ ô Biên bản kiểm đếm có ký — trước: tải #rsk-sign.
const upload = async () => {};
const asPersona = (page, pid, hash) => page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; }, [pid, hash]);

// T59 (D-114 Q4, Q8, Q9): không còn màn riêng SCR-105 — Kho nhập trên tab Rà soát tồn kho của màn việc bước 7; Gửi Chỉ huy Kho là nút đóng việc
// trên thanh trạng thái; hai ô tệp (Tệp kết quả Excel, Biên bản kiểm đếm có ký); không sinh biên bản …/BBRS-MS.
test('Kho (T59 Q4): việc bước 7 mở tab Rà soát tồn kho chế độ nhập theo cột BM-RSTK, SL xuất kho ≤ tồn khả dụng; Gửi Chỉ huy Kho là hoàn thành bước 7', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-scene="1b"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.persona)).toBe('qlts');
  await expect(page.locator('.task-acts [data-act]')).toHaveText(['Gửi Chỉ huy Kho']);
  await expect(page.locator('[data-rsk-card]')).toHaveCount(0);
  // Việc của tôi (vai Kho) có việc bước 7 (token BPMN, không còn dòng ngoài sơ đồ); chuông đếm 1.
  expect(await page.evaluate(() => Flow.pendingCount('qlts'))).toBe(1);
  expect(await page.evaluate(() => RaSoatKho.taskRows('qlts', {}).length)).toBe(0);
  await expect(page.locator('.vmodal')).toHaveCount(0);
  await expect(page.locator('[data-rsk] tbody tr')).toHaveCount(5);
  // Cột theo BM-RSTK (#21, #24): nhóm Yêu cầu / Kết quả rà soát / Hợp đồng đầu vào / Ghi chú.
  const th = await page.locator('[data-rsk] thead th').allInnerTexts();
  for (const h of ['Yêu cầu', 'Kết quả rà soát', 'Hợp đồng đầu vào', 'SL tồn kho', 'SL xuất kho', 'SL điều chuyển', 'SL cần mua', 'Nguyên giá (VNĐ)', 'Số hợp đồng', 'Nguồn gốc Đề tài / Dự án']) expect(th).toContain(h);
  expect(th).not.toContain('Tồn sổ sách');

  // Kho nhập một lần (#22, #23: không còn Lần rà soát Sổ sách / Thực tế).
  await expect(ed(page).locator('[data-rsk-ph], .vradio')).toHaveCount(0);
  await expect(cell(page, 4, 'code')).toHaveValue('VT-4248');
  await expect(cell(page, 5, 'code')).toHaveValue('');
  await expect(cell(page, 5, 'stock')).toBeDisabled();
  await cell(page, 4, 'stock').fill('8');
  await cell(page, 4, 'out').fill('7');
  for (const n of [1, 2, 3]) { await cell(page, n, 'stock').fill('0'); await cell(page, n, 'out').fill('0'); }
  const send = () => page.locator('.task-acts [data-act]', { hasText: 'Gửi Chỉ huy Kho' }).click();
  await send();
  // Khả dụng dòng 4 = 8 − 2 (đang giữ cho ĐXMS-2026-0098) → xuất 7 bị chặn; thiếu hai tệp.
  await expect(ed(page).locator('.msg')).toHaveText(['Vui lòng tải lên Tệp kết quả.', 'SL xuất kho không được lớn hơn tồn khả dụng (6).']);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['7']);
  await cell(page, 4, 'out').fill('6');
  await cell(page, 4, 'out').blur();
  await expect(ed(page).locator('[data-rsk-buy="4"]')).toHaveText('34');
  await cell(page, 4, 'contract').fill('HĐ-2025-0314');
  await cell(page, 4, 'bin').fill('Thùng 31');
  await upload(page);
  await expect(cell(page, 4, 'contract')).toHaveValue('HĐ-2025-0314');
  // Lưu nháp (trong tab): giữ số đã nhập, chưa chuyển bước.
  await page.locator('[data-rsk-draft]').click();
  expect(await lastToast(page)).toContain('Đã lưu nháp');
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['7']);
  await page.locator('#rsk-file').setInputFiles({ name: 'Ket-qua.csv', mimeType: 'text/csv', buffer: Buffer.alloc(8) });
  // Tệp Excel → hệ thống đọc và điền lại bảng (GIẢ LẬP số mẫu) — nhập lại các ô vừa sửa.
  await cell(page, 4, 'out').fill('6');
  await cell(page, 4, 'contract').fill('HĐ-2025-0314');
  await cell(page, 4, 'bin').fill('Thùng 31');
  await send();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await lastToast(page)).toContain('trình Chỉ huy Kho duyệt');
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('7.1');
  expect(await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '7.1').who)).toBe('khoch');
  expect(await page.evaluate(() => Flow.pendingCount('qlts'))).toBe(0);
  // Đã chốt: #/ra-soat-kho chuyển về Chi tiết ĐXMS tab Rà soát tồn kho; màn việc 7.1 chỉ xem kết quả, không có biên bản sinh (Q9).
  await asPersona(page, 'qlts', '#/ra-soat-kho');
  await expect(page).toHaveURL(/#\/luong\/.+\/ton-kho$/);
  await expect(page.locator('[data-rsk-save], [data-rsk-ed]')).toHaveCount(0);
  const k71 = await page.evaluate(() => Flow.state.tokens[0].id);
  await asPersona(page, 'khoch', '#/task/' + k71);
  await expect(page.locator('[data-rsk-view] .ginfo')).toContainText('Đã chốt ở bước 7');
  const r4 = page.locator('[data-rsk-view] tbody tr').nth(3);
  await expect(r4).toContainText('2 — ĐXMS-2026-0098');
  await expect(r4).toContainText('HĐ-2025-0314');
  await expect(r4).toContainText('Thùng 31');
  await expect(page.locator('[data-rsk-bb]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('/BBRS-MS');
  expect(page.errors).toEqual([]);
});

// T29 B3b — card Đánh giá báo giá và cơ sở giá ở bước 10 (DTMS_CN_0148, BR-DXMS-04-09…11).
const bg = (page) => page.locator('[data-bg-card]');
test('Báo giá: theo NCC (Không phản hồi, hiệu lực, loại tiền); cơ sở giá theo hạng mục, chọn khác bắt buộc lý do; tổng theo cơ sở giá là giá trị hồ sơ', async ({ page }) => {
  // Review nhi 06/11 #2: card Đánh giá báo giá tạm ẩn (D.quoteManual) — bật lại cờ thì chạy lại test này.
  test.skip(true, 'D.quoteManual: card Đánh giá báo giá tạm ẩn');
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(10, 'minh'); const k = Flow.state.tokens.find((t) => t.task === 10); Flow.setPersona(k.who); return k.id; });
  await page.evaluate((i) => { location.hash = '#/task/' + i; }, id);
  await expect(bg(page)).toBeVisible();
  await expect(bg(page).locator('[data-bg-ncc]')).toHaveCount(3);
  // Lần gửi 1: NCC Gamma hết hiệu lực; NCC Alpha thấp nhất mọi hạng mục → tổng 182,90.
  await expect(bg(page).locator('[data-bg-ncc="NCC-000003"]')).toContainText('Hết hiệu lực');
  await expect(bg(page).locator('[data-bg-total]')).toHaveText('182,90');
  // Chọn NCC Beta cho hạng mục 2 (2,15 > 2,10): bắt buộc lý do, tổng tăng 20 × 0,05 = 1,00.
  await bg(page).locator('[data-vsel="bg-base-2"]').click();
  await page.locator('.vsel-panel [data-opt="NCC-000002"]').click();
  await expect(bg(page).locator('[data-bg-total]')).toHaveText('183,90');
  await expect(bg(page).locator('[data-bg-item="2"] .vfield.invalid')).toHaveCount(1);
  await page.locator('[data-req-up^="quote_"]').first().waitFor();
  for (let i = 0; i < 5 && (await page.locator('[data-req-up^="quote_"]').count()); i++) await page.locator('[data-req-up^="quote_"]').first().click();
  await page.locator('.task-acts [data-act]', { hasText: 'Báo giá đạt' }).first().click();
  const f = page.locator('.vmodal.ef');
  await expect(f).toBeVisible();
  await f.locator('#ok').click();
  expect(await lastToast(page)).toContain('cần nhập lý do');
  await f.locator('[data-close]').first().click();
  await bg(page).locator('[data-bg-in="base:2"]').fill('Beta bảo hành 36 tháng');
  await bg(page).locator('[data-bg-in="base:2"]').dispatchEvent('change');
  await expect(bg(page).locator('[data-bg-item="2"] .vfield.invalid')).toHaveCount(0);
  // NCC Beta Không phản hồi → không còn là lựa chọn, hạng mục 2 về giá thấp nhất.
  await bg(page).locator('[data-bg-none="NCC-000002"]').check();
  await expect(bg(page).locator('[data-bg-ncc="NCC-000002"]')).toContainText('Không phản hồi');
  await expect(bg(page).locator('[data-bg-in="NCC-000002:date"]')).toBeDisabled();
  await expect(bg(page).locator('[data-bg-total]')).toHaveText('182,90');
  // Ngoại tệ: Gamma USD có tỷ giá; xoá tỷ giá thì không xác nhận được.
  await expect(bg(page).locator('[data-bg-in="NCC-000003:rate"]')).toHaveValue('25.400');
  expect(await page.evaluate(() => BaoGia.problems())).toEqual([]);
  await bg(page).locator('[data-bg-in="NCC-000003:rate"]').fill('');
  await bg(page).locator('[data-bg-in="NCC-000003:rate"]').dispatchEvent('change');
  expect(await page.evaluate(() => BaoGia.problems())).toEqual(['NCC Gamma: chưa nhập Tỷ giá.']);
  expect(page.errors).toEqual([]);
});

// T29 B3b — SCR-73 tìm theo Dự án / Đề tài, từ khoá + bộ lọc đồng thời; SCR-106 Thêm mới / Cập nhật YCBG (RV-PROTO-0511 #9, #10).
const pickV = async (page, id, value) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${value}"]`).click(); };
test('YCBG: Thêm mới (Lưu nháp → Cập nhật → Lưu — T37), không sửa sau khi Lưu; danh sách lọc theo Dự án / Đề tài cùng từ khoá', async ({ page }) => {
  await fresh(page, '#/ycbg');
  await expect(page.locator('main .vtable th')).toContainText(['Dự án / Đề tài']);
  await page.locator('main .pg-head .r [data-go="ycbg/create"]').click();
  await expect(page).toHaveURL(/#\/ycbg\/create$/);
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới yêu cầu báo giá');
  await page.locator('[data-yc-save="send"]').click();
  await expect(page.locator('.vfield.invalid .msg').first()).toHaveText('Bạn cần nhập Tên yêu cầu báo giá.');
  await page.locator('[data-yc-in="title"]').fill('Khảo sát giá máy đo phổ cho đề tài 014');
  await pickV(page, 'yc-nv', 'NV-KHCN-2026-014');
  await page.keyboard.press('Escape');
  await page.locator('[data-yc-save="draft"]').click();
  await expect(page).toHaveURL(/#\/ycbg\/YCBG-2026-0001$/);
  await expect(page.locator('.ginfo').first()).toContainText('Nháp');
  await expect(page.locator('.ginfo').first()).toContainText('NV-KHCN-2026-014');
  // Cập nhật bản nháp: thêm hàng hoá, nhà cung cấp, điều khoản; Lưu (T37: trước Lưu và gửi).
  await page.locator('main .pg-head .r [data-go$="/edit"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Cập nhật yêu cầu báo giá');
  await expect(page.locator('[data-yc-in="title"]')).toHaveValue('Khảo sát giá máy đo phổ cho đề tài 014');
  await page.locator('[data-yc-it="0.name"]').fill('Máy phân tích phổ vector 44 GHz');
  await page.locator('[data-yc-it="0.uom"]').fill('Bộ');
  await page.locator('[data-yc-it="0.qty"]').fill('2');
  await page.locator('[data-yc-in="terms.payment"]').fill('02 đợt: 40 % khi ký, 60 % khi nghiệm thu');
  await page.locator('[data-yc-in="terms.place"]').fill('Kho Viettel Hòa Lạc');
  await page.locator('[data-yc-save="send"]').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn ít nhất một đối tác.']);
  const ncc = await page.evaluate(() => Catalog.rows('nha-cung-cap').find((r) => r.active && !r.ban).code);
  await pickV(page, 'yc-ncc', ncc);
  await page.keyboard.press('Escape');
  await page.locator('[data-yc-save="send"]').click();
  await expect(page).toHaveURL(/#\/ycbg\/YCBG-2026-0001$/);
  await expect(page.locator('.ginfo').first()).toContainText('Đang chờ báo giá');
  await expect(page.locator('main')).toContainText('Kho Viettel Hòa Lạc');
  await expect(page.locator('main .pg-head .r [data-go$="/edit"]')).toHaveCount(0);
  // Danh sách: từ khoá + lọc Dự án / Đề tài cùng lúc.
  await page.evaluate(() => { location.hash = '#/ycbg'; });
  await page.locator('[data-y="adv"]').click();
  await pickV(page, 'yf-nv', 'NV-KHCN-2026-014');
  await page.locator('[data-yadv] button[type="submit"]').click();
  await expect(page.locator('main tbody tr', { hasText: 'YCBG-2026-0001' })).toHaveCount(1);
  await page.locator('#y-kw').fill('không có từ này');
  await page.locator('#y-kw').press('Enter');
  await expect(page.locator('main tbody tr', { hasText: 'YCBG-2026-0001' })).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

// T29 B3c + B12 (D-81) — bước 1: căn cứ chính + bổ sung (BR-DXMS-02-04) hiện ở khối chỉ xem Thông tin chung (Đã dùng / Đang giữ / Còn lại);
// hộp thoại Hoàn thành chỉ xác nhận; tab Căn cứ của ĐXMS hiện đủ văn bản. Căn cứ bổ sung chọn khi tạo luồng (hồ sơ demo đặt sẵn — GIẢ LẬP).
test('Căn cứ: căn cứ bổ sung; khối chỉ xem có Đã dùng / Đang giữ / Còn lại; bước 1 trên màn Lập ĐXMS; tab Căn cứ & hạng mục hiện đủ', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(1, 'minh'); return Flow.state.tokens.find((t) => t.task === 1).id; });
  await page.evaluate((i) => { location.hash = '#/task/' + i; }, id);
  // T37 (RV-PROTO-0911 #4): bỏ khối chỉ xem Văn bản căn cứ và giá trị còn khả dụng; căn cứ bổ sung vẫn lưu ở Flow.ui.basisMore.
  await expect(page.locator('[data-basis-avail]')).toHaveCount(0);
  await page.evaluate(() => { const v = EVars.of(Flow.state.tokens[0]); Flow.setUi('basisMore', [v.basisMoreOptions.find((o) => o.value !== v.basisDoc).value]); App.render(); });
  // T29 B19 (DX-11): bước 1 là màn Lập ĐXMS — Gửi (Chấp nhận mọi gợi ý AI) giữ căn cứ bổ sung.
  await aiApply(page);
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await page.evaluate(() => (Flow.ui.basisMore || []).length)).toBe(1);
  // T34: tab Căn cứ & hạng mục chuyển sang Chi tiết luồng mua sắm (SCR-97).
  await page.evaluate(() => { location.hash = '#/luong/' + encodeURIComponent(Flow.state.dxms); });
  await page.locator('[data-ltab="can-cu"]').click();
  // T37 #3: tab chỉ còn Căn cứ pháp lý + Thông tin dự án / đề tài.
  await expect(page.locator('main .vcard', { hasText: 'Căn cứ pháp lý' })).toHaveCount(1);
  await expect(page.locator('main .vcard', { hasText: 'Căn cứ mua sắm' })).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Rà soát tồn kho: Hợp đồng đầu vào là nhóm con của Kết quả rà soát; hai ô tệp trên bảng; Tệp kết quả Excel được đọc điền bảng (T59 Q8 — mở lại T37 #5); Gửi chuyển 7.1', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-scene="1b"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  const box = ed(page);
  await expect(box).toBeVisible();
  // Tiêu đề ba tầng: hàng 1 Kết quả rà soát (11 cột), hàng 2 có Hợp đồng đầu vào (5 cột) cạnh các cột lá của kết quả.
  const rowsH = box.locator('thead tr');
  await expect(rowsH).toHaveCount(3);
  await expect(rowsH.nth(0).locator('th', { hasText: 'Kết quả rà soát' })).toHaveAttribute('colspan', '11');
  await expect(rowsH.nth(0)).not.toContainText('Hợp đồng đầu vào');
  await expect(rowsH.nth(1).locator('th', { hasText: 'Hợp đồng đầu vào' })).toHaveAttribute('colspan', '5');
  await expect(rowsH.nth(2).locator('th')).toHaveText(['Nguyên giá (VNĐ)', 'Thuế GTGT', 'Số hợp đồng', 'Nguồn gốc Đề tài / Dự án', 'Đơn giá nhận (VNĐ)']);
  // Ô Tệp kết quả nằm trên bảng (T72 #78: bỏ ô Biên bản kiểm đếm).
  await expect(box.locator('.rsk-up')).toHaveCount(1);
  const yUp = (await box.locator('.rsk-ups').boundingBox()).y, yTb = (await box.locator('table').boundingBox()).y;
  expect(yUp).toBeLessThan(yTb);
  await page.locator('#rsk-file').setInputFiles({ name: 'Ket-qua-ra-soat.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.alloc(16) });
  await expect(box.locator('.rsk-file')).toHaveText('Ket-qua-ra-soat.xlsx');
  await expect(box.locator('[data-rsk-imported]')).toBeVisible();
  await expect(cell(page, 4, 'out')).toHaveValue('6');
  await upload(page);
  await page.locator('.task-acts [data-act]', { hasText: 'Gửi Chỉ huy Kho' }).click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await page.evaluate(() => RaSoatKho.done())).toBe(true);
});
