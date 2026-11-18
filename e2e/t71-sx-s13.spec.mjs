// @ts-check
// T71 S13: Tổng quan SX-01 (5 chỉ số số dự án + Cần chú ý, mọi ô số bấm mở danh sách cấu thành) và Báo cáo SX-14
// (7 dashboard SX-ULNL + Đối chiếu quyết toán; Q16: báo cáo tiến độ định kỳ / đột xuất, KPI ≥ 90 / ≥ 80 / ≥ 90 %, VTLK leadtime dài kèm mã tương đương).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const tileN = (page, label) => page.locator('.ov-tile', { hasText: label }).locator('.ov-n .n');
const detRows = (page) => page.locator('.rp-det tbody tr');

test('Tổng quan: 5 chỉ số số dự án + 4 ô Cần chú ý; mọi ô bấm mở ngăn chi tiết có đúng số bản ghi', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/tong-quan');
  await expect(page.locator('main h1, main .pg-h h1').first()).toContainText('Dashboard'); // T74 #95
  const expectN = { 'Dự án lũy kế': '4', 'Dự án đang thực hiện': '3', 'Dự án đúng tiến độ': '2', 'Dự án đang nghiệm thu': '1', 'Dự án mới mở': '1',
    'Bất thường quá hạn, sắp đến hạn': '1', 'Vật tư trễ hạn đặt hàng': '4', 'Thay đổi kỹ thuật đang xử lý': '1', 'Lô chờ nghiệm thu, nhập kho': '1' };
  for (const [l, n] of Object.entries(expectN)) await expect(tileN(page, l)).toHaveText(n);
  // Mỗi ô: ngăn chi tiết có đúng số dòng bằng con số trên ô (S4 của rule: số có nguồn).
  for (const [l, n] of Object.entries(expectN)) {
    await page.locator('.ov-tile', { hasText: l }).click();
    const dr = page.locator('.vmodal.drawer');
    await expect(dr).toContainText(l);
    await expect(dr.locator('tbody tr')).toHaveCount(Number(n));
    await dr.locator('[data-close]').first().click();
    await expect(dr).toHaveCount(0);
  }
  // Đúng tiến độ: DA-001, DA-003 (chậm dưới 15 điểm); bấm mã mở chi tiết dự án.
  await page.locator('.ov-tile', { hasText: 'Dự án đúng tiến độ' }).click();
  await expect(page.locator('.vmodal.drawer tbody')).toContainText('DA-SX-2026-001');
  await expect(page.locator('.vmodal.drawer tbody')).toContainText('DA-SX-2026-003');
  await page.locator('.vmodal.drawer [data-go="sx/du-an/DA-SX-2026-003"]').click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/DA-SX-2026-003$/);
  // Bảng tiến độ: 4 dự án chưa hoàn thành, DA-002 chậm 35 điểm.
  await as(page, 'qt', '#/sx/tong-quan');
  await expect(page.locator('main .vcard', { hasText: 'Tiến độ dự án so với kế hoạch' }).locator('tbody tr')).toHaveCount(4);
  await expect(page.locator('main .vcard', { hasText: 'Tiến độ dự án so với kế hoạch' }).locator('tr', { hasText: 'DA-SX-2026-002' })).toContainText('-39 điểm'); // T74 #97: bước 4 đọc mua sắm / cung ứng thật (DA-002 chưa gửi đề xuất) — trước -35
  // Lọc Khối 2.
  await pick(page, 'sxr-khoi', 'K2');
  await expect(tileN(page, 'Dự án lũy kế')).toHaveText('2');
  await expect(tileN(page, 'Thay đổi kỹ thuật đang xử lý')).toHaveText('0');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Tổng quan theo phạm vi vai: Chuyên viên QLSX Khối 2 chỉ thấy dự án Khối 2', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'sxk2', '#/sx/tong-quan');
  await expect(tileN(page, 'Dự án lũy kế')).toHaveText('2');
  await page.locator('.ov-tile', { hasText: 'Dự án lũy kế' }).click();
  await expect(page.locator('.vmodal.drawer tbody')).not.toContainText('DA-SX-2026-001');
  expect(page.errors).toEqual([]);
});

test('Báo cáo: sidebar 8 báo cáo; mỗi báo cáo có chỉ tiêu, biểu đồ, bảng chi tiết; không lộ nhãn nội bộ', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/tong-quan');
  await page.locator('.sb-nav [data-toggle="Báo cáo"]').click();
  const items = ['Tiến độ sản xuất', 'Chất lượng', 'Bất thường theo dự án', 'Thay đổi kỹ thuật', 'Vật tư theo ngày cần', 'KPI quy trình', 'Thời gian chờ theo bên xử lý', 'Đối chiếu quyết toán'];
  const paths = ['tien-do', 'chat-luong', 'bat-thuong', 'thay-doi', 'vat-tu', 'kpi', 'cho-xu-ly', 'quyet-toan'];
  for (let i = 0; i < paths.length; i += 1) {
    const go = page.locator(`.sb-nav [data-go="sx/bao-cao/${paths[i]}"]`);
    await expect(go).toContainText(items[i]);
    await go.click();
    await expect(go).toHaveClass(/active/);
    await expect(page.locator('main .pg-h h1, main h1').first()).toContainText(items[i]);
    expect(await page.locator('main .rp-tiles .ov-tile').count()).toBeGreaterThanOrEqual(3);
    expect(await page.locator('main .bc-card').count()).toBeGreaterThanOrEqual(2);
    expect(await detRows(page).count()).toBeGreaterThan(0);
    expect(await page.locator('main').innerText()).not.toMatch(BA);
  }
  expect(page.errors).toEqual([]);
});

test('Drill-down: bấm ô chỉ tiêu / thanh biểu đồ lọc bảng chi tiết; ← quay lại đầy đủ', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/bao-cao/bat-thuong');
  await expect(detRows(page)).toHaveCount(4);
  await page.locator('.rp-tiles .ov-tile', { hasText: 'Quá hạn' }).click();
  await expect(page.locator('.rp-det h3')).toContainText('Chi tiết — Quá hạn');
  await expect(detRows(page)).toHaveCount(1);
  await expect(detRows(page)).toContainText('BT-2026-002');
  await page.locator('[data-sxr-back]').click();
  await expect(detRows(page)).toHaveCount(4);
  await page.locator('.bc-card', { hasText: 'Theo loại bất thường' }).locator('.bc-hr', { hasText: 'Loại 3' }).click();
  await expect(detRows(page)).toHaveCount(1);
  await expect(detRows(page)).toContainText('BT-2026-003');
  // Thay đổi kỹ thuật: nguồn Hệ thống KHCN.
  await as(page, 'qt', '#/sx/bao-cao/thay-doi');
  await page.locator('.bc-card', { hasText: 'Theo nguồn yêu cầu' }).locator('.bc-hr', { hasText: 'Hệ thống KHCN' }).click();
  await expect(detRows(page)).toHaveCount(1);
  await expect(detRows(page)).toContainText('ECR-2026-002');
  expect(page.errors).toEqual([]);
});

test('Báo cáo tiến độ định kỳ / đột xuất: kỳ tháng có Sự kiện trong kỳ; Xuất báo cáo có chỉ tiêu, chi tiết, sự kiện', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/bao-cao/tien-do');
  await expect(tileN(page, 'Đúng tiến độ')).toHaveText('2');
  await expect(tileN(page, 'Chậm tiến độ')).toHaveText('1');
  await expect(page.locator('[data-sxr-events]')).toContainText('BT-2026-001'); // đột xuất = lũy kế
  await pick(page, 'sxr-period', 'THANG');
  await expect(page.locator('main h2.rp-h2')).toContainText('Định kỳ tháng · Tháng 11/2026');
  const ev = page.locator('[data-sxr-events]');
  for (const c of ['BT-2026-003', 'BT-2026-004', 'ECR-2026-002', 'NT-2026-005']) await expect(ev).toContainText(c);
  await expect(ev).not.toContainText('BT-2026-001');
  const dl = page.waitForEvent('download');
  await page.locator('[data-sxr-export="tien-do"]').click();
  const file = await dl;
  expect(file.suggestedFilename()).toMatch(/^Bao_cao_Tien_do_san_xuat_\d{8}\.csv$/);
  const txt = readFileSync(await file.path(), 'utf8');
  expect(txt).toContain('Định kỳ tháng');
  expect(txt).toContain('[Chỉ tiêu]');
  expect(txt).toContain('[Chi tiết]');
  expect(txt).toContain('[Sự kiện trong kỳ — Tháng 11/2026]');
  expect(txt).not.toMatch(/<[a-z]/);
  expect(page.errors).toEqual([]);
});

test('KPI quy trình: 3 KPI so với mục tiêu ≥ 90 / ≥ 80 / ≥ 90 %; danh sách cấu thành', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/bao-cao/kpi');
  await expect(page.locator('.rp-tiles .ov-tile', { hasText: 'Tỷ lệ hoàn thành tiến độ sản xuất' })).toContainText('Mục tiêu ≥ 90%');
  await expect(page.locator('.rp-tiles .ov-tile', { hasText: 'Tỷ lệ bất thường xử lý đúng hạn' })).toContainText('Mục tiêu ≥ 80%');
  await expect(page.locator('.rp-tiles .ov-tile', { hasText: 'Tỷ lệ thay đổi kỹ thuật đúng hạn' })).toContainText('Mục tiêu ≥ 90%');
  await expect(tileN(page, 'Tỷ lệ bất thường xử lý đúng hạn')).toHaveText('50%'); // BT-001 đóng đúng hạn, BT-002 quá hạn
  await expect(tileN(page, 'Tỷ lệ thay đổi kỹ thuật đúng hạn')).toHaveText('100%');
  await page.locator('.rp-tiles .ov-tile', { hasText: 'Tỷ lệ bất thường xử lý đúng hạn' }).click();
  await expect(detRows(page)).toHaveCount(2);
  expect(page.errors).toEqual([]);
});

test('Vật tư theo ngày cần: danh sách VTLK leadtime dài / Export License kèm mã tương đương; có trong tệp xuất', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/bao-cao/vat-tu');
  await expect(tileN(page, 'Trễ hạn đặt hàng')).toHaveText('4');
  const v = page.locator('[data-sxr-vtlk]');
  await expect(v.locator('tr', { hasText: 'FPGA-XC7K325' })).toContainText('FPGA-XC7K410');
  await expect(v.locator('tr', { hasText: 'SOC-MT7981' })).toContainText('SOC-MT7986');
  await expect(v).not.toContainText('PCB-WM6'); // leadtime 6 tuần, không Export License
  const dl = page.waitForEvent('download');
  await page.locator('[data-sxr-export="vat-tu"]').click();
  const txt = readFileSync(await (await dl).path(), 'utf8');
  expect(txt).toContain('[Vật tư leadtime dài, Export License]');
  expect(txt).toContain('FPGA-XC7K410 — FPGA Kintex-7 XC7K410T');
  expect(page.errors).toEqual([]);
});

test('Thời gian chờ theo bên xử lý và Đối chiếu quyết toán', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'qt', '#/sx/bao-cao/cho-xu-ly');
  await expect(page.locator('.bc-card', { hasText: 'Việc đang chờ theo bên xử lý' })).toContainText('Nghiên cứu phát triển');
  await expect(detRows(page).first()).toContainText('HSBT-BT-2026-002-01');
  await expect(detRows(page).first()).toContainText('Đang chờ');
  await page.locator('.rp-tiles .ov-tile', { hasText: 'Việc đang chờ xử lý' }).click();
  const n = await detRows(page).count();
  await expect(tileN(page, 'Việc đang chờ xử lý')).toHaveText(String(n));
  await as(page, 'qt', '#/sx/bao-cao/quyet-toan');
  await expect(detRows(page).filter({ hasText: 'DA-SX-2026-003' })).toContainText('80.000 / 120.000');
  await expect(detRows(page).filter({ hasText: 'DA-SX-2026-003' })).toContainText('Đang thực hiện hợp đồng');
  expect(page.errors).toEqual([]);
});
