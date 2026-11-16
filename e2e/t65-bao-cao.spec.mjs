// T65 — kho comment #69–#74 (phuctd7, 12/11/2026) ở Báo cáo tổng hợp, áp cho khuôn chung của mọi màn báo cáo:
// Từ ngày / Đến ngày hai trường có nhãn riêng (#74); popover chọn ngày theo design system thay lịch trình duyệt (#72, #73);
// drill-down có icon ← quay lại ở tiêu đề "Chi tiết — …", bỏ nút "Bỏ lọc chi tiết" (#69, #71); "Xuất bảng chi tiết" có tooltip (#70).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 90_000 });
const go = async (page, h) => { await page.evaluate((x) => { location.hash = x; }, h); await expect(page.locator('main')).toBeVisible(); };

test('#74 #72 #73: mọi nhóm báo cáo có Từ ngày, Đến ngày riêng; icon lịch mở popover (T2 đầu tuần, Hôm nay / Xóa), chọn ngày ghi DD/MM/YYYY', async ({ page }) => {
  await fresh(page, '#/bao-cao/tong-hop');
  for (const g of ['tong-hop', 'dxms', 'kdt', 'lcnt', 'hop-dong', 'tien-do']) {
    await go(page, '#/bao-cao/' + g);
    const f = page.locator('.rp-filter');
    await expect(f.locator('.vrange-a label')).toHaveText('Từ ngày');
    await expect(f.locator('.vrange-b label')).toHaveText('Đến ngày');
    await expect(f.locator('.vrange-sep')).toHaveCount(0);
  }
  await go(page, '#/bao-cao/tong-hop');
  const f = page.locator('.rp-filter');
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  await f.locator('.vrange-a [data-vdate-pick]').click();
  const dp = page.locator('.vdp');
  await expect(dp).toBeVisible();
  await expect(dp.locator('.vdp-g th')).toHaveText(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']);
  await expect(dp.locator('.vdp-bar button')).toHaveText(['Hôm nay', 'Xóa']);
  // Tháng trước rồi chọn ngày 15.
  const t0 = await dp.locator('.vdp-title').innerText();
  await dp.locator('[data-vdp-nav="-1"]').click();
  await expect(dp.locator('.vdp-title')).not.toHaveText(t0);
  await dp.locator('.vdp-d:not(.oth)', { hasText: /^15$/ }).click();
  await expect(dp).toHaveCount(0);
  const v = await f.locator('.vrange-a input[data-vdate]').inputValue();
  expect(v).toMatch(/^15\/\d{2}\/\d{4}$/);
  // Chọn tháng / năm qua tiêu đề; Xóa làm rỗng; Esc đóng.
  await f.locator('.vrange-b [data-vdate-pick]').click();
  await dp.locator('[data-vdp-mode="year"]').click();
  await dp.locator('[data-vdp-year="2025"]').click();
  await dp.locator('[data-vdp-month="11"]').click();
  await expect(dp.locator('[data-vdp-mode="month"]')).toHaveText('Tháng Mười Hai');
  await dp.locator('[data-vdp-day="31/12/2025"]').click();
  await expect(f.locator('.vrange-b input[data-vdate]')).toHaveValue('31/12/2025');
  await f.locator('.vrange-b [data-vdate-pick]').click();
  await expect(dp.locator('.vdp-d.on')).toHaveText('31');
  await dp.locator('[data-vdp-clear]').click();
  await expect(f.locator('.vrange-b input[data-vdate]')).toHaveValue('');
  await f.locator('.vrange-a [data-vdate-pick]').click();
  await page.keyboard.press('Escape');
  await expect(dp).toHaveCount(0);
  // Áp bộ lọc theo ngày đã chọn: sheet Bộ lọc ghi Từ ngày.
  await page.locator('[data-rpa$=":go"]').click();
  expect(page.errors).toEqual([]);
});

test('#69 #70 #71: drill-down — tiêu đề có icon ← quay lại, không còn "Bỏ lọc chi tiết"; nút Xuất bảng chi tiết / Xuất báo cáo có tooltip', async ({ page }) => {
  await fresh(page, '#/bao-cao/hop-dong');
  await page.locator('[data-rptab="hop-dong:tinh-hinh"]').click();
  const det = page.locator('.rp-det');
  await expect(det.locator('h3 .rp-back')).toHaveCount(0);
  await expect(det.locator('[data-rp-export]')).toHaveText('Xuất bảng chi tiết');
  await expect(det.locator('[data-rp-export]')).toHaveAttribute('title', /các dòng đang hiện ở bảng/);
  await expect(det.locator('[data-rp-export-all]')).toHaveAttribute('title', /toàn bộ báo cáo/);
  await page.locator('.bc-hr', { hasText: 'Đang thương thảo' }).first().click();
  await expect(det.locator('h3')).toContainText('Chi tiết — Theo trạng thái: Đang thương thảo');
  await expect(det.locator('h3 .rp-back')).toHaveAttribute('aria-label', 'Quay lại danh sách chi tiết đầy đủ');
  await expect(det.locator('[data-drill-cap]')).toBeVisible();
  await expect(det).not.toContainText('Bỏ lọc chi tiết');
  await expect(det.locator('tbody tr')).toHaveCount(1);
  await det.locator('h3 .rp-back').click();
  await expect(det.locator('h3')).toHaveText('Danh sách chi tiết');
  await expect(det.locator('tbody tr')).toHaveCount(7); // T67: + 2 hợp đồng mẫu
  expect(page.errors).toEqual([]);
});
