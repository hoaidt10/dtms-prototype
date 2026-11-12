// T16 B3 — Backlog W1_T10 (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2k): Quản lý hợp đồng (SCR-84…87), Thông báo (SCR-88…91,
// theo notification-template / notification-channel), Tổng quan (SCR-92) và Báo cáo (SCR-93, hr-tools report-dashboard).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const rows = (page) => page.locator('main .vtable tbody tr');

test('Menu: Thông báo, Hợp đồng, Báo cáo mở màn thật; route cũ #/ph/… chuyển hướng; không chữ BA', async ({ page }) => {
  await as(page, 'minh', '#/ph/hop-dong');
  await expect(page).toHaveURL(/#\/hop-dong$/);
  for (const [h, t] of [['#/ph/po', 'Danh sách thỏa thuận khung'], ['#/ph/mau-thong-bao', 'Mẫu thông báo'], ['#/ph/kenh-thong-bao', 'Kênh thông báo'],
    ['#/ph/bao-cao', 'Báo cáo tổng hợp'], ['#/ph/bao-cao-lcnt', 'Báo cáo lựa chọn nhà thầu'], ['#/tong-quan', 'Tổng quan']]) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toHaveText(t);
    expect(await mainText(page)).not.toMatch(BA);
  }
  await go(page, '#/bao-cao/tien-do');
  await expect(page.locator('.sb-nav .nav.active')).toHaveText('Báo cáo tiến độ & tồn đọng');
  expect(page.errors).toEqual([]);
});

test('Hợp đồng: danh sách mở được mọi dòng; 10 tab chi tiết không lỗi; cảnh báo bảo đảm, chậm tiến độ, tạm dừng ký', async ({ page }) => {
  await as(page, 'minh', '#/hop-dong');
  const codes = await page.locator('main .vtable tbody tr[data-code]').evaluateAll((r) => r.map((x) => x.dataset.code));
  expect(codes.length).toBe(5);
  for (const c of codes) {
    await go(page, '#/hop-dong/' + encodeURIComponent(c));
    await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết hợp đồng');
    for (const t of ['info', 'dt', 'hm', 'tt', 'bd', 'td', 'bg', 'pay', 'vb', 'tl']) {
      await page.locator(`.dx-tabs [data-ttab="${t}"]`).click();
      expect(await mainText(page)).not.toMatch(BA);
    }
  }
  await go(page, '#/hop-dong/' + encodeURIComponent('HĐ-2025-0187'));
  await expect(page.locator('.hd-alert.warning').first()).toContainText('Bảo đảm thực hiện hợp đồng hết hiệu lực ngày 31/10/2026');
  await expect(page.locator('.hd-alert.warning').nth(1)).toContainText('Hợp đồng hết hạn ngày 30/11/2026'); // P-80 giả lập: CONTRACT_EXPIRING 90 ngày
  await expect(page.locator('.hd-alert.error')).toContainText('quá hạn 38 ngày');
  await go(page, '#/hop-dong/' + encodeURIComponent('HĐ-2026-0052'));
  await expect(page.locator('.hd-alert.error')).toContainText('Tạm dừng ký hợp đồng');
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await expect(card(page, 'Đối chiếu dự thảo hợp đồng')).toContainText('Lệch');
  await expect(card(page, 'So sánh dự thảo v1 / v2').locator('tbody tr')).toHaveCount(2);
  // HĐ đã thanh lý: khoá chỉnh sửa, không có nút Thêm phụ lục
  await go(page, '#/hop-dong/' + encodeURIComponent('HĐ-2025-0152'));
  await expect(page.locator('.hd-alert.info')).toContainText('đã khoá chỉnh sửa');
  await page.locator('.dx-tabs [data-ttab="vb"]').click();
  await expect(page.locator('[data-hd-annex]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Hợp đồng: Tạo hợp đồng từ KQLCNT (GT-2026-0027) — sao chép nhà thầu, giá; gói đã có HĐ thì nút thành Xem hợp đồng', async ({ page }) => {
  await as(page, 'minh', '#/goi-thau/GT-2026-0027');
  await page.locator('.pg-head [data-go="hop-dong/create/GT-2026-0027"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hợp đồng');
  await expect(page.locator('main')).toContainText('Hạng mục hợp đồng (sao chép từ phạm vi gói thầu)');
  await expect(page.locator('input[value="Công ty TNHH Công nghệ Alpha"]')).toHaveCount(1);
  await page.locator('#hd-save').click();
  expect(await lastToast(page)).toContain('Thêm mới hợp đồng thành công');
  await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết hợp đồng');
  await expect(page.locator('main')).toContainText('Đang thương thảo');
  await go(page, '#/goi-thau/GT-2026-0027');
  await expect(page.locator('.pg-head')).toContainText('Xem hợp đồng');
  await go(page, '#/goi-thau/GT-2026-0021');
  await expect(page.locator('.pg-head [data-go^="hop-dong/"]')).toHaveText('Xem hợp đồng');
  expect(page.errors).toEqual([]);
});

test('Hợp đồng: phụ lục vượt giới hạn bị chặn; tạo hồ sơ thanh toán từ nghiệm thu; tìm kiếm nâng cao theo Tiến độ', async ({ page }) => {
  await as(page, 'minh', '#/hop-dong/' + encodeURIComponent('HĐ-2026-0012'));
  await page.locator('.dx-tabs [data-ttab="vb"]').click();
  await page.locator('[data-hd-annex]').click();
  await page.locator('#ax-c').fill('Bổ sung 01 router biên');
  await page.locator('#ax-v').fill('4.5');
  await page.locator('#ax-ok').click();
  await expect(page.locator('#ax-f2 .msg')).toContainText('vượt giới hạn 32,00');
  await page.locator('#ax-v').fill('1.2');
  await page.locator('#ax-ok').click();
  expect(await lastToast(page)).toContain('Thêm phụ lục hợp đồng thành công');
  await expect(card(page, 'Văn bản phát sinh').locator('tbody tr')).toHaveCount(3);
  await go(page, '#/hop-dong/' + encodeURIComponent('HĐ-2025-0187'));
  await page.locator('.dx-tabs [data-ttab="pay"]').click();
  await expect(page.locator('[data-hd-pay]')).toHaveCount(0); // NT-01 đã có hồ sơ thanh toán
  await go(page, '#/hop-dong');
  await page.locator('[data-tl="hdl:adv"]').click();
  await page.locator('[data-vsel="tf-hdl-prog"]').click();
  await page.locator('.vsel-panel [data-opt="Chậm tiến độ"]').click();
  await page.locator('[data-tadv="hdl"] button[type="submit"]').click();
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page).first()).toContainText('HĐ-2025-0187');
  expect(page.errors).toEqual([]);
});

test('Thỏa thuận khung: giá trị đã gọi / còn lại; mở chi tiết đơn hàng', async ({ page }) => {
  await as(page, 'minh', '#/thoa-thuan-khung');
  await expect(rows(page)).toHaveCount(3);
  await go(page, '#/thoa-thuan-khung/TTK-2026-0003');
  await expect(card(page, 'Giá trị thỏa thuận khung')).toContainText('26,70 tỷ đồng');
  await expect(card(page, 'Giá trị thỏa thuận khung')).toContainText('3,30 tỷ đồng');
  await page.locator('[data-fw-order]').first().click();
  await expect(page.locator('.vmodal')).toContainText('Chi tiết đơn hàng ĐH-2026-0003-01');
  expect(page.errors).toEqual([]);
});

test('Mẫu thông báo (notification-template): thêm mới kiểm tra bắt buộc / mã trùng; bật tắt có xác nhận; xem chi tiết có sự kiện dùng mẫu', async ({ page }) => {
  await as(page, 'qt', '#/mau-thong-bao');
  await expect(rows(page)).toHaveCount(10);
  await page.locator('.pg-head [data-go="mau-thong-bao/create"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Tạo mới mẫu thông báo');
  await expect(page.locator('main')).toContainText('Biến hỗ trợ: {{maHoSo}}');
  await page.locator('#tb-save').click();
  await expect(page.locator('main')).toContainText('Bạn cần nhập Mã mẫu thông báo.');
  await expect(page.locator('main')).toContainText('Bạn cần nhập Tên mẫu thông báo.');
  await page.locator('#tb-code').fill('task_assigned_email');
  await page.locator('#tb-name').fill('Giao việc mới');
  await page.locator('#tb-save').click();
  await expect(page.locator('main')).toContainText('Mã mẫu thông báo đã tồn tại.');
  await page.locator('#tb-code').fill('contract signed email');
  await page.locator('#tb-save').click();
  expect(await lastToast(page)).toContain('Thêm mới mẫu thông báo thành công');
  await expect(rows(page).first()).toContainText('CONTRACT_SIGNED_EMAIL');
  // Bật / tắt: hộp thoại xác nhận Dừng hoạt động
  await page.locator('[data-tb-tg="1"]').click();
  await expect(page.locator('.vconfirm')).toContainText('Dừng hoạt động');
  await page.locator('#cf-ok').click();
  await expect(page.locator('[data-tb-tg="1"]')).toHaveAttribute('aria-checked', 'false');
  await go(page, '#/mau-thong-bao/detail/2');
  await expect(card(page, 'Sự kiện sử dụng mẫu')).toContainText('TASK_ASSIGNED');
  // Rời trang khi đang sửa → hỏi xác nhận
  await page.locator('.pg-head [data-go="mau-thong-bao/edit/2"]').click();
  await page.locator('#tb-name').fill('Giao việc xử lý hồ sơ (sửa)');
  await page.locator('[data-tb-cancel]').click();
  await expect(page.locator('.vconfirm')).toContainText('Bạn có chắc chắn muốn rời khỏi trang?');
  expect(page.errors).toEqual([]);
});

test('Kênh thông báo: 4 kênh, bật SMS có xác nhận Kích hoạt; cấu hình kênh', async ({ page }) => {
  await as(page, 'qt', '#/kenh-thong-bao');
  await expect(page.locator('.ch-card')).toHaveCount(4);
  await page.locator('[data-ch-tg="SMS"]').click();
  await expect(page.locator('.vconfirm')).toContainText('Bạn có chắc chắn muốn kích hoạt kênh thông báo: SMS không?');
  await page.locator('#cf-ok').click();
  expect(await lastToast(page)).toContain('Đã bật kênh thông báo thành công.');
  await page.locator('[data-ch-cfg="EMAIL"]').click();
  await expect(page.locator('.vmodal')).toContainText('SMTP Host');
  await page.locator('#cfg-ok').click();
  expect(await lastToast(page)).toContain('Cập nhật cấu hình kênh thành công.');
  expect(page.errors).toEqual([]);
});

test('D-44: bỏ Trigger thông báo — menu Thông báo còn 2 mục, route cũ mở trang Đang phát triển, sự kiện của mẫu không còn link', async ({ page }) => {
  await as(page, 'qt', '#/mau-thong-bao');
  await expect(page.locator('.sb-nav [data-go="trigger-thong-bao"]')).toHaveCount(0);
  await expect(page.locator('.sb-nav [data-go="kenh-thong-bao"]')).toHaveCount(1);
  await go(page, '#/trigger-thong-bao');
  await expect(page.locator('main')).toContainText('Tính năng đang được phát triển');
  await go(page, '#/mau-thong-bao');
  await rows(page).first().locator('a.link').first().click();
  await expect(card(page, 'Sự kiện sử dụng mẫu').locator('a')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Tổng quan: 7 tab không lỗi; ô chỉ số khớp dữ liệu; lọc loại nghiệp vụ; làm mới dữ liệu', async ({ page }) => {
  await as(page, 'minh', '#/tong-quan');
  await expect(page.locator('.rp-tile', { hasText: 'Tổng số hợp đồng' }).locator('.n')).toHaveText('5');
  for (const t of ['kpi', 'td', 'gt', 'dt', 'hd', 'tt', 'cb']) {
    await page.locator(`[data-tqtab="${t}"]`).click();
    expect(await mainText(page)).not.toMatch(BA);
  }
  await expect(card(page, 'Hợp đồng chậm tiến độ').locator('tbody tr')).toHaveCount(1);
  await expect(card(page, 'Hồ sơ có kiến nghị / khiếu nại đang xử lý').locator('tbody tr')).toHaveCount(1);
  await page.locator('[data-tqtab="td"]').click();
  await expect(page.locator('.bc-card', { hasText: 'Từ nhu cầu đến hợp đồng' }).locator('.bc-hr')).toHaveCount(10);
  await page.locator('[data-rp-refresh="tq"]').click();
  expect(await lastToast(page)).toContain('Đã cập nhật số liệu Dashboard');
  expect(page.errors).toEqual([]);
});

test('Báo cáo: 6 nhóm, mọi báo cáo dựng không lỗi; drill-down lọc bảng chi tiết; sắp xếp; xuất báo cáo', async ({ page }) => {
  await as(page, 'minh', '#/bao-cao/tong-hop');
  const groups = { 'tong-hop': 2, dxms: 1, kdt: 1, lcnt: 6, 'hop-dong': 2, 'tien-do': 3 };
  for (const [g, n] of Object.entries(groups)) {
    await go(page, '#/bao-cao/' + g);
    const tabs = page.locator('[data-rptab]');
    await expect(tabs).toHaveCount(n > 1 ? n : 0);
    for (let i = 0; i < n; i += 1) {
      if (n > 1) await tabs.nth(i).click();
      await expect(page.locator('.rp-det')).toBeVisible();
      expect(await mainText(page)).not.toMatch(BA);
    }
  }
  // Drill-down: bấm thanh "Đang thương thảo" của Báo cáo tình hình hợp đồng
  await go(page, '#/bao-cao/hop-dong');
  await page.locator('[data-rptab="hop-dong:tinh-hinh"]').click();
  await page.locator('.bc-hr', { hasText: 'Đang thương thảo' }).first().click();
  await expect(page.locator('.rp-det h3')).toContainText('Chi tiết — Theo trạng thái: Đang thương thảo');
  await expect(page.locator('.rp-det tbody tr')).toHaveCount(1);
  await page.locator('[data-drill-clear]').click();
  await expect(page.locator('.rp-det tbody tr')).toHaveCount(5);
  // Sắp xếp theo giá trị
  await page.locator('.rp-det th', { hasText: 'Giá trị (tỷ đồng)' }).click();
  await expect(page.locator('.rp-det tbody tr').first()).toContainText('HĐ-2025-0152');
  await page.locator('[data-rp-export]').click();
  expect(await lastToast(page)).toContain('Xuất báo cáo thành công (5 dòng)');
  // KPI xử lý theo bước (nhóm C comment Figma)
  await go(page, '#/bao-cao/tien-do');
  await page.locator('[data-rptab="tien-do:kpi-buoc"]').click();
  await expect(page.locator('.rp-tile', { hasText: 'Số lần ký ngoài hệ thống' })).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Giả lập P-80: ngưỡng cảnh báo là tham số hệ thống (thỏa thuận khung 90 ngày)', async ({ page }) => {
  await as(page, 'admin', '#/thoa-thuan-khung');
  await expect(rows(page).filter({ hasText: 'TTK-2025-0007' })).toContainText('Sắp hết hạn (85 ngày)');
  expect(page.errors).toEqual([]);
});

test('Giả lập P-81: Thêm đơn hàng chặn vượt giá trị còn lại; đơn mới chuyển bước Chờ xác nhận → Đang giao', async ({ page }) => {
  await as(page, 'minh', '#/thoa-thuan-khung/TTK-2026-0003');
  await page.locator('[data-fw-new]').click();
  await page.locator('#od-c').fill('Linh kiện bổ sung lô RRU tháng 12');
  await page.locator('#od-v').fill('4');
  await page.locator('#od-ok').click();
  await expect(page.locator('.vmodal')).toContainText('vượt giá trị còn lại 3,30 tỷ đồng');
  await page.locator('#od-v').fill('2');
  await page.locator('#od-ok').click();
  expect(await lastToast(page)).toContain('ĐH-2026-0003-05');
  await expect(card(page, 'Giá trị thỏa thuận khung')).toContainText('1,30 tỷ đồng');
  await page.locator('[data-fw-order="TTK-2026-0003|ĐH-2026-0003-05"]').click();
  await page.locator('#ord-next').click();
  await expect(card(page, 'Danh sách đơn hàng').locator('tbody tr').filter({ hasText: 'ĐH-2026-0003-05' })).toContainText('Đang giao');
  expect(page.errors).toEqual([]);
});
