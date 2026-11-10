// T48 + T49 (docs/dtms/prototype-T48-tong-quan.md, prototype-T49-bao-cao.md): Tổng quan và Báo cáo theo T34 (1 ĐXMS – 1 hồ sơ),
// SRS 12 V0.4 (ĐXMS Chưa khởi tạo), D-103 / D-104 (KĐT 2 loại hồ sơ, nhiều đề tài) và các dòng WBS-0211 STT 500–616 còn thiếu.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const tileN = (page, label) => page.locator('.rp-tile', { has: page.locator('.t', { hasText: new RegExp('^' + label + '$') }) }).locator('.n');
const tileD = (page, label) => page.locator('.rp-tile', { has: page.locator('.t', { hasText: new RegExp('^' + label + '$') }) }).locator('.d');
const pick = async (page, id, text) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: text }).first().click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
const bar = (page, card, label) => page.locator('.bc-card', { hasText: card }).locator('.bc-hr', { has: page.locator('.bc-hl', { hasText: new RegExp('^' + label + '$') }) }).locator('.bc-hv');

test('Tổng quan (T48): ĐXMS không đếm nháp, giá trị không đếm đôi chuỗi điều chỉnh; KĐT tách chủ trương; phễu theo lọc', async ({ page }) => {
  await as(page, 'minh', '#/tong-quan');
  // 15 ĐXMS mẫu, 3 Chưa khởi tạo (0124, 0119, 0098) → 12
  await expect(tileN(page, 'Tổng số ĐXMS')).toHaveText('12');
  // Giá trị: chuỗi 0084 → 0112 chỉ cộng 0112; 0077 (Đang điều chỉnh) → 0126 (đang chạy) chỉ cộng 0077
  const v = await page.evaluate(() => UI.ty(841.2, 2));
  await expect(tileN(page, 'Giá trị ĐXMS')).toHaveText(v);
  await expect(tileD(page, 'Tổng số khoản đầu tư')).toHaveText('6 đã duyệt chủ trương, 2 đã duyệt KĐT');
  await page.locator('[data-tqtab="td"]').click();
  const fun = page.locator('.bc-card', { hasText: 'Từ nhu cầu đến hợp đồng' });
  await expect(fun.locator('.bc-hr')).toHaveCount(10);
  await expect(bar(page, 'Từ nhu cầu đến hợp đồng', 'ĐXMS')).toHaveText('12');
  await expect(bar(page, 'Từ nhu cầu đến hợp đồng', 'KĐT đã duyệt chủ trương')).toHaveText('6');
  // Lọc Đơn vị → phễu đổi theo tập đã lọc (trước T48 phễu bỏ qua bộ lọc)
  await pick(page, 'rp-tq-unit', 'Phòng Chất lượng');
  await page.locator('[data-rpa="tq:go"]').click();
  await expect(bar(page, 'Từ nhu cầu đến hợp đồng', 'ĐXMS')).not.toHaveText('12');
  // Lọc Trạng thái = Chưa khởi tạo (một loại ĐXMS) → ĐXMS nháp hiện
  await page.locator('[data-rpa="tq:reset"]').click();
  await pick(page, 'rp-tq-kind', 'ĐXMS');
  await pick(page, 'rp-tq-st', 'Chưa khởi tạo');
  await page.locator('[data-rpa="tq:go"]').click();
  await page.locator('[data-tqtab="kpi"]').click();
  await expect(tileN(page, 'Tổng số ĐXMS')).toHaveText('3');
  expect(page.errors).toEqual([]);
});

test('Báo cáo ĐXMS, KĐT (T49 R1–R7): đã phê duyệt gồm DC / SUP; phát sinh điều chỉnh theo ĐXMS gốc; KĐT theo loại hồ sơ; quá hạn có loại hồ sơ và hợp đồng', async ({ page }) => {
  await as(page, 'minh', '#/bao-cao/dxms');
  await expect(tileN(page, 'Tổng số ĐXMS')).toHaveText('12');
  await expect(tileN(page, 'Đã phê duyệt')).toHaveText('6'); // 0112, 0103, 0089, 0084 (SUP), 0077 (DC), 0072
  await expect(tileN(page, 'Phát sinh điều chỉnh')).toHaveText('2');
  await expect(tileD(page, 'Phát sinh điều chỉnh')).toContainText('2 lần điều chỉnh');
  await page.locator('.rp-tile', { hasText: 'Phát sinh điều chỉnh' }).click();
  await expect(page.locator('.rp-det tbody tr')).toHaveCount(4); // cả 2 chuỗi
  await expect(page.locator('.rp-det tbody')).toContainText('ĐXMS-2026-0084');
  await go(page, '#/bao-cao/kdt');
  await expect(page.locator('.bc-card', { hasText: 'Theo loại hồ sơ đang chạy' })).toBeVisible();
  await expect(bar(page, 'Theo loại hồ sơ đang chạy', 'Hồ sơ phê duyệt KĐT')).toHaveText('4');
  await go(page, '#/bao-cao/tong-hop');
  await page.locator('[data-rptab="tong-hop:chuoi"]').click();
  await expect(bar(page, 'Số lượng theo giai đoạn nghiệp vụ', 'KĐT – chủ trương')).toBeVisible();
  await expect(bar(page, 'Số lượng theo giai đoạn nghiệp vụ', 'KĐT – phê duyệt KĐT')).toHaveText('4');
  await go(page, '#/bao-cao/tien-do');
  await page.locator('[data-rptab="tien-do:qua-han"]').click();
  await expect(page.locator('.rp-det tbody tr')).toHaveCount(3);
  await expect(page.locator('.rp-det tbody')).toContainText('Hồ sơ phê duyệt KĐT');
  await expect(page.locator('.rp-det tbody')).toContainText('HĐ-2025-0187');
  await expect(tileN(page, 'Hợp đồng chậm mốc')).toHaveText('1');
  expect(page.errors).toEqual([]);
});

test('Báo cáo (T49 R8–R13): 2 kiểu xuất; KPI đến ký HĐ + đối tượng cấu thành; nhà thầu; thanh toán theo đợt; kiến nghị theo thời gian xử lý', async ({ page }) => {
  await as(page, 'minh', '#/bao-cao/hop-dong');
  await page.locator('[data-rptab="hop-dong:tinh-hinh"]').click();
  await page.locator('[data-rp-export-all]').click();
  expect(await lastToast(page)).toMatch(/Xuất báo cáo theo bộ lọc thành công \(4 chỉ tiêu, 4 chiều nhóm, 5 dòng chi tiết\)/);
  await page.locator('[data-rp-export]').click();
  expect(await lastToast(page)).toContain('Xuất báo cáo thành công (5 dòng)');
  // Thanh toán theo đợt
  await page.locator('[data-rptab="hop-dong:thanh-toan"]').click();
  const nHd = await page.locator('.rp-det tbody tr').count();
  await page.locator('[data-rp-view="hop-dong:dot"]').click();
  await expect(page.locator('.rp-det h3')).toHaveText('Danh sách đợt thanh toán');
  await expect(page.locator('.rp-det thead')).toContainText('Thực thanh toán');
  expect(await page.locator('.rp-det tbody tr').count()).toBeGreaterThan(nHd);
  // KPI LCNT
  await go(page, '#/bao-cao/lcnt');
  await page.locator('[data-rptab="lcnt:kpi"]').click();
  await expect(page.locator('.rp-det tbody tr').first()).toContainText('ký HĐ');
  await page.locator('[data-rp-kpi="KPI-02"]').click();
  await expect(page.locator('.rp-kpi-det h3')).toContainText('Tỷ lệ gói thầu thực hiện qua mạng');
  expect(await page.locator('.rp-kpi-det tbody tr').count()).toBeGreaterThan(0);
  // Nhà thầu
  await page.locator('[data-rptab="lcnt:nha-thau"]').click();
  await expect(page.locator('.bc-card', { hasText: 'Số gói tham gia theo nhà thầu' })).toBeVisible();
  await page.locator('[data-rp-ncc]').first().click();
  await expect(page.locator('.vmodal')).toContainText('Lịch sử tham gia / trúng thầu');
  await page.locator('.vmodal [data-close]').first().click();
  // Kiến nghị: đã giải quyết tính đến ngày giải quyết (28/09 → 06/10 = 8 ngày)
  await go(page, '#/bao-cao/tien-do');
  await page.locator('[data-rptab="tien-do:kien-nghi"]').click();
  await expect(page.locator('.bc-card', { hasText: 'Theo thời gian xử lý' })).toBeVisible();
  await expect(page.locator('.rp-det tbody tr', { hasText: 'Theta Messtechnik' })).toContainText('06/10/2026');
  await expect(page.locator('.rp-det tbody tr', { hasText: 'Theta Messtechnik' }).locator('td').last()).toHaveText('8');
  expect(page.errors).toEqual([]);
});

test('Dữ liệu mẫu báo cáo (T49 Q3, R13): KĐT nhiều đề tài khác nguồn chia giá trị theo dòng bóc tách; kiến nghị trải đủ khoảng thời gian xử lý', async ({ page }) => {
  await as(page, 'minh', '#/bao-cao/kdt');
  // KĐT-2026-0028: 52,0 (Đầu tư phát triển) + 22,5 (Quỹ phát triển KHCN) → 70% / 30%
  const r28 = page.locator('.rp-det tbody tr', { hasText: 'KĐT-2026-0028' });
  await expect(r28).toContainText('70%');
  await expect(r28).toContainText('30%');
  await expect(page.locator('.rp-det tbody tr', { hasText: 'KĐT-2026-0025' })).toContainText('%');
  await go(page, '#/bao-cao/tien-do');
  await page.locator('[data-rptab="tien-do:kien-nghi"]').click();
  await expect(tileN(page, 'Đã giải quyết')).toHaveText('3');
  for (const b of ['≤ 7 ngày', '8 – 15 ngày', '16 – 30 ngày', '> 30 ngày']) await expect(bar(page, 'Theo thời gian xử lý', b)).toHaveText('1');
  expect(page.errors).toEqual([]);
});
