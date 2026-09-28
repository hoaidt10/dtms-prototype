// Mỗi màn chính mở được, có nội dung, không lỗi console.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const routes = [
  ['#/viec-cua-toi', 'SCR-01 Việc của tôi'],
  ['#/chon-vai', 'SCR-00 Chọn vai'],
  ['#/dxms', 'SCR-02 Danh sách ĐXMS'],
  ['#/dxms/create', 'SCR-25 Tạo mới ĐXMS'],
  ['#/dxms/%C4%90XMS-2026-0103', 'Chi tiết hồ sơ mẫu'],
  ['#/dxms/%C4%90XMS-2026-0103/bpmn', 'Chi tiết BPMN hồ sơ mẫu'],
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
