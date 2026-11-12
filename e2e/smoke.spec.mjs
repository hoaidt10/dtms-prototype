// Mỗi màn chính mở được, có nội dung, không lỗi console.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const routes = [
  ['#/viec-cua-toi', 'SCR-01 Việc của tôi'],
  ['#/chon-vai', 'SCR-00 Chọn vai'],
  ['#/dxms', 'SCR-27 Danh sách ĐXMS'],
  ['#/dxms/create', 'SCR-28 Thêm mới ĐXMS'],
  ['#/dxms/%C4%90XMS-2026-0103/edit', 'SCR-28 Chỉnh sửa ĐXMS'],
  ['#/dxms/%C4%90XMS-2026-0103', 'SCR-29 Chi tiết ĐXMS'],
  ['#/dxms/%C4%90XMS-2026-9999', 'SCR-29 ĐXMS không tồn tại'],
  ['#/ho-so-dxms', 'SCR-02 Danh sách hồ sơ ĐXMS'],
  ['#/ho-so-dxms/create', 'SCR-25 Thêm mới hồ sơ'],
  ['#/ho-so-dxms/HS-2026-0103', 'Chi tiết hồ sơ mẫu'],
  ['#/ho-so-dxms/HS-2026-0103/bpmn', 'Chi tiết BPMN hồ sơ mẫu'],
  ['#/ho-so-dxms/HS-2026-0126/bpmn', 'Chi tiết BPMN hồ sơ Điều chỉnh (MS02)'],
  ['#/ph/dieu-chinh', 'Route cũ Điều chỉnh ĐXMS → Hồ sơ ĐXMS'],
  ['#/ho-so', 'SCR-20 khi chưa tạo hồ sơ'],
  ['#/ho-so/bpmn', 'SCR-20 BPMN khi chưa tạo hồ sơ'],
  ['#/cho-chot', 'Điểm ❓'],
  ['#/ph/goi-thau', 'Phân hệ khác'],
];

for (const [hash, name] of routes) {
  test(`mở ${name}`, async ({ page }) => {
    await fresh(page, hash);
    await expect(page.locator('main, #app').first()).toBeVisible();
    expect(page.errors).toEqual([]);
  });
}
