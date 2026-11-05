// T29 B3a + B5 — SCR-105 Rà soát tồn kho: việc của Phòng QLTS / Thủ kho (ngoài sơ đồ) khi hồ sơ ở bước 7; nhập MỘT lần theo cột biên bản BM-RSTK
// (D-82, review Huylx4 #21–24); bước 7 của ĐVĐX chỉ xác nhận được khi Kho đã nhập; biên bản rà soát + phiếu yêu cầu (C1, C2 — P-186, P-187).
import { test, expect } from '@playwright/test';
import { fresh, openForm, lastToast } from './helpers.mjs';

const dlg = (page) => page.locator('.vmodal:has(.rsk-dlg)');
const cell = (page, n, k) => dlg(page).locator(`[data-rsk-in="${n}:${k}"]`);
const upload = (page) => page.locator('#rsk-file').setInputFiles({ name: 'Bien-ban-kiem-dem.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(16) });
const asPersona = (page, pid, hash) => page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; }, [pid, hash]);

test('Kho: cảnh 1b mở Rà soát tồn kho; một lần nhập theo cột BM-RSTK; SL xuất kho ≤ tồn khả dụng; biên bản rà soát; bước 7 chặn tới khi có kết quả', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-scene="1b"]').click();
  // T29 B16 (DX-10): bước 7 là việc của Kho trên sơ đồ — cảnh 1b mở màn xử lý bước 7 có card Kết quả rà soát; màn đủ cột ở #/ra-soat-kho.
  await expect(page).toHaveURL(/#\/task\//);
  await expect(page.locator('[data-rsk-card]')).toBeVisible();
  expect(await page.evaluate(() => Flow.state.persona)).toBe('qlts');
  await page.evaluate(() => { location.hash = '#/ra-soat-kho'; });
  await expect(page.locator('.pg-title')).toHaveText('Rà soát tồn kho');
  await expect(page.locator('.ginfo').first()).toContainText('Chờ kết quả rà soát');
  await expect(page.locator('[data-rsk] tbody tr')).toHaveCount(5);
  // Cột theo BM-RSTK (#21, #24): nhóm Yêu cầu / Kết quả rà soát / Hợp đồng đầu vào / Ghi chú.
  const th = await page.locator('[data-rsk] thead th').allInnerTexts();
  for (const h of ['Yêu cầu', 'Kết quả rà soát', 'Hợp đồng đầu vào', 'SL tồn kho', 'SL xuất kho', 'SL điều chuyển', 'SL cần mua', 'Nguyên giá (VNĐ)', 'Số hợp đồng', 'Nguồn gốc Đề tài / Dự án', 'Đơn giá nhận (VNĐ)', 'Vị trí (thùng)']) expect(th).toContain(h);
  expect(th).not.toContain('Tồn sổ sách');

  // Việc của tôi (vai Kho) có việc bước 7 (token BPMN, không còn dòng ngoài sơ đồ); chuông đếm 1.
  expect(await page.evaluate(() => Flow.pendingCount('qlts'))).toBe(1);
  expect(await page.evaluate(() => RaSoatKho.taskRows('qlts', {}).length)).toBe(0);

  // Kho ở bước 7: chưa có kết quả → banner, Hoàn thành bị chặn.
  const tok7 = await page.evaluate(() => Flow.state.tokens.find((t) => t.task === 7).id);
  await asPersona(page, 'qlts', `#/task/${tok7}`);
  let f = await openForm(page);
  await expect(f.locator('.banner-bad')).toContainText('chưa nhập kết quả rà soát tồn kho');
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toBeVisible();
  expect(await lastToast(page)).toContain('Chưa có kết quả rà soát tồn kho');
  await page.locator('.vmodal.ef [data-close]').first().click();

  // Kho nhập một lần (#22, #23: không còn Lần rà soát Sổ sách / Thực tế).
  await asPersona(page, 'qlts', '#/ra-soat-kho');
  await page.locator('[data-rsk-open]').click();
  await expect(dlg(page).locator('[data-rsk-ph], .vradio')).toHaveCount(0);
  await expect(cell(page, 4, 'code')).toHaveValue('VT-4248');
  await expect(cell(page, 5, 'code')).toHaveValue('');
  await expect(cell(page, 5, 'stock')).toBeDisabled();
  await cell(page, 4, 'stock').fill('8');
  await cell(page, 4, 'out').fill('7');
  for (const n of [1, 2, 3]) { await cell(page, n, 'stock').fill('0'); await cell(page, n, 'out').fill('0'); }
  await dlg(page).locator('[data-rsk-save]').click();
  // Khả dụng dòng 4 = 8 − 2 (đang giữ cho ĐXMS-2026-0098) → xuất 7 bị chặn; thiếu tệp.
  await expect(dlg(page).locator('.msg')).toHaveText(['SL xuất kho không được lớn hơn tồn khả dụng (6).', 'Vui lòng tải lên Tệp kết quả.']);
  await cell(page, 4, 'out').fill('6');
  await cell(page, 4, 'out').blur();
  await expect(dlg(page).locator('[data-rsk-buy="4"]')).toHaveText('34');
  await cell(page, 4, 'contract').fill('HĐ-2025-0314');
  await cell(page, 4, 'bin').fill('Thùng 31');
  await upload(page);
  await dlg(page).locator('[data-rsk-save]').click();
  await expect(dlg(page)).toHaveCount(0);
  expect(await lastToast(page)).toContain('sinh biên bản rà soát');
  await expect(page.locator('.ginfo').first()).toContainText('chờ đơn vị xác nhận bước 7');
  const r4 = page.locator('[data-rsk] tbody tr').nth(3);
  await expect(r4).toContainText('2 — ĐXMS-2026-0098');
  await expect(r4).toContainText('HĐ-2025-0314');
  await expect(r4).toContainText('Thùng 31');
  // Biên bản rà soát (C1): số …/BBRS-MS, câu giữ hàng 30 ngày, chân ký GIẢ LẬP.
  const bb = page.locator('[data-rsk-bb]');
  await expect(bb).toContainText('/BBRS-MS');
  await expect(bb).toContainText('30 ngày');
  await expect(bb).toContainText('Chỉ huy bộ phận QLTS');
  // Việc bước 7 vẫn mở tới khi Kho bấm Hoàn thành (DX-10).
  expect(await page.evaluate(() => Flow.pendingCount('qlts'))).toBe(1);

  // Kho hoàn thành bước 7: khả dụng theo số Kho, Dùng từ kho mặc định = SL xuất kho; biên bản ở Danh sách tài liệu → Chỉ huy Kho duyệt (7.1).
  await asPersona(page, 'qlts', `#/task/${tok7}`);
  await expect(page.locator('main')).toContainText('Bien-ban-ra-soat-ton-kho_');
  await expect(page.locator('main')).toContainText('Phieu-yeu-cau-ra-soat_');
  f = await openForm(page);
  await expect(f.locator('.banner-bad')).toHaveCount(0);
  await expect(f).toContainText('Tồn kho 8');
  await expect(f).toContainText('khả dụng 6');
  await expect(f).toContainText('Kho xuất 6');
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('7.1');
  expect(await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '7.1').who)).toBe('khoch');
  // Đã chốt: Kho không còn nút cập nhật.
  await asPersona(page, 'qlts', '#/ra-soat-kho');
  await expect(page.locator('[data-rsk-open]')).toHaveCount(0);
  await expect(page.locator('.ginfo').first()).toContainText('Đã chốt ở bước 7');
  expect(page.errors).toEqual([]);
});

// T29 B3b — card Đánh giá báo giá và cơ sở giá ở bước 10 (DTMS_CN_0148, BR-DXMS-04-09…11).
const bg = (page) => page.locator('[data-bg-card]');
test('Báo giá: theo NCC (Không phản hồi, hiệu lực, loại tiền); cơ sở giá theo hạng mục, chọn khác bắt buộc lý do; tổng theo cơ sở giá là giá trị hồ sơ', async ({ page }) => {
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
test('YCBG: Thêm mới (Lưu nháp → Cập nhật → Lưu và gửi), không sửa sau khi gửi; danh sách lọc theo Dự án / Đề tài cùng từ khoá', async ({ page }) => {
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
  // Cập nhật bản nháp: thêm hàng hoá, nhà cung cấp, điều khoản; Lưu và gửi.
  await page.locator('main .pg-head .r [data-go$="/edit"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Cập nhật yêu cầu báo giá');
  await expect(page.locator('[data-yc-in="title"]')).toHaveValue('Khảo sát giá máy đo phổ cho đề tài 014');
  await page.locator('[data-yc-it="0.name"]').fill('Máy phân tích phổ vector 44 GHz');
  await page.locator('[data-yc-it="0.uom"]').fill('Bộ');
  await page.locator('[data-yc-it="0.qty"]').fill('2');
  await page.locator('[data-yc-in="terms.payment"]').fill('02 đợt: 40 % khi ký, 60 % khi nghiệm thu');
  await page.locator('[data-yc-in="terms.place"]').fill('Kho Viettel Hòa Lạc');
  await page.locator('[data-yc-save="send"]').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn ít nhất một nhà cung cấp.']);
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
test('Căn cứ: căn cứ bổ sung; khối chỉ xem có Đã dùng / Đang giữ / Còn lại; bước 1 chỉ xác nhận; tab Căn cứ & hạng mục hiện đủ', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const id = await page.evaluate(() => { Flow.jumpTo(1, 'minh'); return Flow.state.tokens.find((t) => t.task === 1).id; });
  await page.evaluate((i) => { location.hash = '#/task/' + i; }, id);
  const chosen = page.locator('[data-basis-avail] .vtable').first();
  await expect(chosen.locator('tbody tr')).toHaveCount(1);
  await expect(chosen.locator('tbody tr').first()).toContainText('Chính');
  await page.evaluate(() => { const v = EVars.of(Flow.state.tokens[0]); Flow.setUi('basisMore', [v.basisMoreOptions.find((o) => o.value !== v.basisDoc).value]); App.render(); });
  await expect(chosen.locator('tbody tr')).toHaveCount(2);
  await expect(chosen.locator('tbody tr').nth(1)).toContainText('Bổ sung');
  await expect(chosen.locator('thead')).toContainText('Còn có thể sử dụng');
  const f = await openForm(page);
  await expect(f.locator('[data-ef-list="basisMore"]')).toHaveCount(0);
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  expect(await page.evaluate(() => (Flow.ui.basisMore || []).length)).toBe(1);
  await page.evaluate(() => { location.hash = '#/dxms/' + encodeURIComponent(Flow.state.dxms); });
  await page.locator('[data-dtab="can-cu"]').click();
  await expect(page.locator('main .vcard', { hasText: 'Căn cứ mua sắm' }).locator('tbody tr')).toHaveCount(2);
  expect(page.errors).toEqual([]);
});
