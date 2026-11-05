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
