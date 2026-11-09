// T29 B18 — popup bước 8 (Khởi tạo YCBG) theo màn Cập nhật yêu cầu báo giá của hệ thống cũ đủ 3 ảnh (HT-DXMS-IMG) và mẫu BM-YCKT:
// lưu ý bảo mật, bảng dự án có Nguồn vốn, chọn đối tác → bảng có Email, Thời hạn tiếp nhận báo giá, mẫu Yêu cầu kỹ thuật,
// Bảo hành / Năm sản xuất (P-214), Đầu mối tiếp nhận báo giá nhiều người → bảng Họ tên, Đơn vị.
import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { fresh } from './helpers.mjs';

const jump8 = (page) => page.evaluate(() => {
  Flow.jumpTo(8, 'minh', {}, 'MS01.01', undefined, null, false);
  const k = Flow.state.tokens.find((x) => String(x.task) === '8');
  Flow.setPersona(k.who);
  location.hash = '#/task/' + k.id;
  return k.who;
});
const form = (page) => page.locator('.vmodal.ef');

test('B18: popup bước 8 bố cục theo màn YCBG cũ; Xác nhận lưu đầu mối nhiều người, bảo hành, năm sản xuất → Chi tiết YCBG', async ({ page }) => {
  await fresh(page);
  const who = await jump8(page);
  await page.locator('.task-acts [data-act].primary').click();
  const f = form(page);
  // Tiêu đề hộp thoại theo nội dung (eForm title), nút trên màn việc vẫn là nhãn hành động.
  await expect(f.locator('.vmodal-h h3')).toHaveText('Yêu cầu báo giá');
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Tạo yêu cầu báo giá');
  await expect(f.locator('.banner-info')).toContainText('yêu cầu bảo mật');
  await expect(f.locator('[data-ef-field="hanTraLoi"] label')).toHaveText('Thời hạn tiếp nhận báo giá');
  // Dự án / đề tài của luồng, có Nguồn vốn.
  await expect(f.locator('.ef-table', { hasText: 'Thông tin dự án / đề tài' }).locator('tbody tr')).toContainText(['NV-KHCN-2026-014']);
  // Đối tác đã chọn → bảng có Email; thêm một đối tác thì bảng thêm dòng.
  const ncc = f.locator('.ef-table', { hasText: 'Danh sách đối tác nhận yêu cầu báo giá' });
  await expect(ncc.locator('tbody tr')).toHaveCount(3);
  await expect(ncc.locator('tbody tr', { hasText: 'NCC-000001' })).toContainText('baogia@alphatech.vn');
  await f.locator('[data-vsel="ef-nccSel"]').click();
  await page.locator('.vsel-panel [data-opt="NCC-000004"]').click();
  await f.locator('.ef-text h4').first().click();
  await expect(ncc.locator('tbody tr')).toHaveCount(4);
  // Hàng hoá: Model / Mã NSX tham khảo; mẫu Yêu cầu kỹ thuật tải được.
  await expect(f.locator('[data-ef-field="ycbgHang::0::model"] label')).toHaveText('Model / Mã NSX tham khảo');
  const tpl = f.locator('a[data-ycbg-tpl]');
  await expect(tpl).toHaveAttribute('href', 'assets/mau/BM-YCKT.docx');
  expect(existsSync(new URL('../' + (await tpl.getAttribute('href')), import.meta.url))).toBe(true);
  // Bảo hành, năm sản xuất điền sẵn (P-214 GIẢ LẬP).
  await expect(f.locator('[data-ef="baoHanh"]')).toHaveValue('12');
  await expect(f.locator('[data-ef="namSx"]')).toHaveValue('2025');
  await f.locator('[data-ef="baoHanh"]').fill('24');
  // Đầu mối: mặc định người xử lý bước; chọn thêm Phạm Thị Lan → bảng hai người có Đơn vị.
  const dm = f.locator('.ef-table', { hasText: 'Họ và tên' });
  await expect(dm.locator('tbody tr')).toHaveCount(1);
  await f.locator('[data-vsel="ef-dauMoiBg"]').click();
  await page.locator('.vsel-panel [data-opt="lan"]').click();
  await f.locator('.ef-text h4').first().click();
  await expect(dm.locator('tbody tr')).toHaveCount(2);
  await expect(dm.locator('tbody tr', { hasText: 'Phạm Thị Lan' })).toContainText('Trung tâm Mua sắm');
  // Bỏ hết đầu mối → bắt buộc.
  await f.locator('[data-vsel="ef-dauMoiBg"]').click();
  await page.locator(`.vsel-panel [data-opt="${who}"]`).click();
  await page.locator('.vsel-panel [data-opt="lan"]').click();
  await f.locator('.ef-text h4').first().click();
  await f.locator('#ok').click();
  await expect(f.locator('[data-ef-field="dauMoiBg"] .msg')).toHaveText('Bạn cần chọn đầu mối tiếp nhận báo giá');
  await f.locator('[data-vsel="ef-dauMoiBg"]').click();
  await page.locator(`.vsel-panel [data-opt="${who}"]`).click();
  await page.locator('.vsel-panel [data-opt="lan"]').click();
  await f.locator('.ef-text h4').first().click();
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  expect(await page.evaluate(() => [Flow.ui.dauMoiBg, Flow.ui.baoHanh, Flow.ui.namSx, Flow.ui.nccSel.length])).toEqual([[who, 'lan'], 24, 2025, 4]);

  // Chi tiết YCBG (SCR-74): điều khoản có Bảo hành, Năm sản xuất, hai đầu mối.
  const code = await page.evaluate(() => Ycbg.ycbgOf(Flow.state.dxms).pop().code);
  await page.evaluate((c) => { location.hash = '#/ycbg/' + encodeURIComponent(c); }, code);
  const card = page.locator('main .vcard', { hasText: 'Điều khoản trên phiếu yêu cầu báo giá' });
  await expect(card).toContainText('24 tháng');
  await expect(card).toContainText('2025');
  await expect(card).toContainText('Phạm Thị Lan');
  await expect(card).toContainText(await page.evaluate((w) => UI.persona(w).name, who));
  expect(page.errors).toEqual([]);
});

test('B18: Chọn mẫu tài liệu ở bước 8 có BM-YCKT và BM-YCBG; không thành văn bản đầu ra', async ({ page }) => {
  await fresh(page);
  await jump8(page);
  await page.locator('[data-tpl]').first().click();
  const dlg = page.locator('.vmodal', { hasText: 'Danh sách tài liệu mẫu' });
  await expect(dlg.locator('tbody')).toContainText('BM-YCKT_Mẫu yêu cầu kỹ thuật để báo giá.docx');
  await expect(dlg.locator('tbody')).toContainText('BM-YCBG_Công văn yêu cầu báo giá và Mẫu báo giá.docx');
  expect(page.errors).toEqual([]);
});

test('B18: popup eForm có nút Toàn màn hình — phóng to phủ cửa sổ, thu nhỏ về 85vw, nhớ lựa chọn khi mở lại', async ({ page }) => {
  await fresh(page);
  await jump8(page);
  await page.locator('.task-acts [data-act].primary').click();
  const box = form(page), btn = box.locator('[data-ef-max]');
  await expect(btn).toHaveAttribute('title', 'Toàn màn hình');
  const vw = await page.evaluate(() => innerWidth), vh = await page.evaluate(() => innerHeight);
  expect((await box.boundingBox()).width).toBeLessThan(vw * 0.9);
  await btn.click();
  await expect(box).toHaveClass(/\bmax\b/);
  await expect(btn).toHaveAttribute('title', 'Thu nhỏ');
  const b = await box.boundingBox();
  expect(Math.round(b.width)).toBe(vw);
  expect(Math.round(b.height)).toBe(vh);
  await expect(box.locator('#ok')).toBeInViewport();
  // Đóng rồi mở lại: vẫn toàn màn hình; thu nhỏ lại được.
  await box.locator('[data-close]').first().click();
  await expect(box).toHaveCount(0);
  await page.locator('.task-acts [data-act].primary').click();
  await expect(form(page)).toHaveClass(/\bmax\b/);
  await form(page).locator('[data-ef-max]').click();
  await expect(form(page)).not.toHaveClass(/\bmax\b/);
  expect(page.errors).toEqual([]);
});

// T29 B18 — SCR-106 Thêm mới / Cập nhật YCBG theo màn cũ (plan §3.11 Y1–Y10, P-213, P-214, P-215), cùng mẫu với eForm bước 8.
const pickV = async (page, id, value) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${value}"]`).click(); await page.keyboard.press('Escape'); };
test('B18: SCR-106 lưu ý bảo mật, bảng dự án / đối tác / đầu mối, giá trị mặc định, nhập CSV, công văn Word, Xem lịch sử', async ({ page }) => {
  await fresh(page, '#/ycbg/create');
  const main = page.locator('main');
  await expect(main.locator('[data-yc-note]')).toContainText('yêu cầu bảo mật');
  await expect(main.locator('.vfield label', { hasText: 'Thời hạn tiếp nhận báo giá' })).toHaveCount(1);
  await expect(main.locator('[data-yc-items] th')).toContainText(['Model / Mã NSX tham khảo']);
  await expect(main.locator('a[data-yc-tpl]')).toHaveAttribute('href', 'assets/mau/BM-YCKT.docx');
  await expect(main.locator('[data-yc-logt], [data-yc-log]')).toHaveCount(0);
  // Đầu mối mặc định người tạo; bảo hành 12, năm SX năm trước.
  const me = await page.evaluate(() => UI.persona(Flow.state.persona).name);
  await expect(main.locator('[data-yc-ctt] tbody tr')).toHaveCount(1);
  await expect(main.locator('[data-yc-ctt] tbody tr')).toContainText(me);
  await expect(main.locator('[data-yc-in="terms.warranty"]')).toHaveValue('12');
  await expect(main.locator('[data-yc-in="terms.year"]')).toHaveValue('2025');
  // Dự án → bảng có Nguồn vốn.
  await main.locator('[data-yc-in="title"]').fill('Khảo sát giá máy đo phổ');
  await pickV(page, 'yc-nv', 'NV-KHCN-2026-014');
  await expect(main.locator('[data-yc-nvt] tbody tr')).toContainText(['Quỹ phát triển KHCN']);
  // Đối tác → bảng có Email; đối tác thiếu email thì chặn Gửi.
  const [ok, noMail] = await page.evaluate(() => { const r = Catalog.rows('nha-cung-cap').filter((x) => x.active && !x.ban); return [r.find((x) => x.email).code, (r.find((x) => !x.email) || {}).code || null]; });
  await pickV(page, 'yc-ncc', ok);
  await expect(main.locator('[data-yc-ncct] tbody tr')).toHaveCount(1);
  await expect(main.locator('[data-yc-ncct] tbody tr')).toContainText('@');
  // Đặt giá trị mặc định.
  await main.locator('[data-yc-def]').click();
  await expect(main.locator('[data-yc-in="terms.place"]')).toHaveValue(/Kho Viettel Hòa Lạc/);
  // Nhập từ Excel (.csv): thêm 2 dòng.
  await main.locator('#yc-xls').setInputFiles({ name: 'hang-hoa.csv', mimeType: 'text/csv', buffer: Buffer.from('﻿"Hàng hoá / dịch vụ","Model / Mã NSX tham khảo","ĐVT","Số lượng","Chỉ tiêu kỹ thuật"\n"Máy phân tích phổ","N9020B","Bộ","2","26,5 GHz"\n"Bộ suy hao","8496B","Cái","4",""\n') });
  await expect(main.locator('[data-yc-it="1.name"]')).toHaveValue('Bộ suy hao');
  await expect(main.locator('[data-yc-it="0.qty"]')).toHaveValue('2');
  // Bỏ hết đầu mối → bắt buộc khi Gửi.
  await main.locator('[data-yc-ctt] [data-yc-rm="contact"]').click();
  await main.locator('[data-yc-save="send"]').click();
  await expect(main.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn đầu mối tiếp nhận báo giá.']);
  await pickV(page, 'yc-contact', 'lan');
  await expect(main.locator('[data-yc-ctt] tbody tr')).toContainText(['Phạm Thị Lan']);
  // Soạn thảo công văn: tải .doc theo BM-YCBG.
  const dl = page.waitForEvent('download');
  await main.locator('[data-yc-word]').click();
  expect((await dl).suggestedFilename()).toMatch(/^BM-YCBG_Cong-van-yeu-cau-bao-gia_.*\.doc$/);
  // Lưu nháp → Cập nhật có Xem lịch sử.
  await main.locator('[data-yc-in="terms.warranty"]').fill('24');
  await main.locator('[data-yc-save="draft"]').click();
  await expect(page).toHaveURL(/#\/ycbg\/YCBG-2026-0001$/);
  const card = main.locator('.vcard', { hasText: 'Điều khoản trên phiếu yêu cầu báo giá' });
  await expect(card).toContainText('24 tháng');
  await expect(card).toContainText('Phạm Thị Lan');
  await main.locator('.pg-head .r [data-go$="/edit"]').click();
  await expect(main.locator('[data-yc-ctt] tbody tr')).toContainText(['Phạm Thị Lan']);
  await main.locator('[data-yc-log]').click();
  await expect(page.locator('[data-yc-logt] tbody tr')).toContainText(['Tạo mới (lưu nháp)']);
  await page.locator('.vmodal [data-close]').last().click();
  if (noMail) {
    await pickV(page, 'yc-ncc', noMail);
    await main.locator('[data-yc-save="send"]').click();
    // T37 (RV-PROTO-0911 #6): chưa gửi email nên đối tác thiếu Email không chặn Lưu.
    await expect(page.locator('.vfield.invalid .msg', { hasText: 'chưa có Email' })).toHaveCount(0);
  }
  expect(page.errors).toEqual([]);
});
