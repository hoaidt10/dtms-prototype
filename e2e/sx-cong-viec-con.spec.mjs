// @ts-check
// Góp ý 26/11 (hoaidt10): bỏ nhãn trạng thái ở từng bước của tab Kế hoạch; Việc của tôi tổng hợp 2 nguồn — công việc từ Kế hoạch (chia công việc con, cập nhật tiến độ,
// chi tiết 3 tab) và việc được giao từ quy trình (mở màn Xử lý, link tới màn nghiệp vụ, menu sáng mục nghiệp vụ); Việc cá nhân gộp vào Việc của tôi.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const list = (page) => page.locator('[data-sx-tasks] tbody');
const rowOf = (page, text) => list(page).locator('tr', { hasText: text }).first();

test('Kế hoạch không còn nhãn trạng thái ở từng bước', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001/ke-hoach');
  await expect(page.locator('[data-sx-plan]')).toBeVisible();
  await expect(page.locator('[data-sx-plan]')).not.toContainText('Chờ duyệt điều chỉnh');
  expect(page.errors).toEqual([]);
});

test('Việc của tôi: 2 nguồn (Kế hoạch / Quy trình), lọc Phân loại, không link dự án; việc quy trình link màn nghiệp vụ, menu sáng mục nghiệp vụ', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  // Menu: Việc của tôi (Việc cá nhân đã gộp).
  await expect(page.locator('.sb-nav .nav.active').first()).toContainText('Việc của tôi');
  await expect(page.locator('.sb-nav', { hasText: 'Việc cá nhân' })).toHaveCount(0);
  await expect(page.locator('[data-sx-tasks] thead')).toContainText('Phân loại');
  // Công việc từ Kế hoạch: Thêm công việc con; việc có công việc con thì % tự tính (không cập nhật tay).
  const kh = rowOf(page, 'Bảo đảm máy móc, công cụ dụng cụ');
  await expect(kh).toContainText('Kế hoạch');
  await expect(kh.locator('[title="Thêm công việc con"]')).toHaveCount(1);
  await expect(kh.locator('[data-sxcv-upd]')).toHaveCount(0);
  // Việc quy trình: không có Thêm công việc con / Cập nhật tiến độ; tên công việc link tới phiếu bất thường.
  const qt = rowOf(page, 'Tiếp nhận');
  await expect(qt).toContainText('Quy trình');
  await expect(qt.locator('[title="Thêm công việc con"], [data-sxcv-upd]')).toHaveCount(0);
  await expect(qt.locator('a[title="Xem chi tiết phiếu bất thường"]')).toHaveAttribute('data-go', 'sx/bat-thuong/BT-2026-004');
  // Không còn link dự án.
  await expect(list(page).locator('a[data-go^="sx/du-an/"]')).toHaveCount(0);
  // Lọc Phân loại.
  await pick(page, 'sxv-src', 'KH');
  await expect(list(page).locator('tr', { hasText: 'Quy trình' })).toHaveCount(0);
  await pick(page, 'sxv-src', 'QT');
  await expect(list(page).locator('tr', { hasText: 'Kế hoạch' })).toHaveCount(0);
  await page.locator('[data-vsel-clear="sxv-src"]').click();
  // Mở việc quy trình → màn Xử lý, menu sáng Bất thường sản xuất.
  await rowOf(page, 'Tiếp nhận').locator('[title="Mở màn hình xử lý"]').first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText('Tiếp nhận');
  await expect(page.locator('.sb-nav .nav.active').first()).toContainText('Bất thường sản xuất');
  await expect(page.locator('[data-sx-split], [data-sx-subs]')).toHaveCount(0); // không còn chia việc con ở việc quy trình
  // Link cũ Việc cá nhân chuyển về Việc của tôi.
  await as(page, 'sxpm', '#/sx/cong-viec/ca-nhan');
  await expect(page.locator('[data-sx-tasks]')).toBeVisible();
  expect(page.errors).toEqual([]);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
});

test('Công việc từ Kế hoạch: chi tiết 3 tab, thêm công việc con (người cùng đơn vị), cập nhật tiến độ ở Việc của tôi, % việc cha tự tính; PM / lãnh đạo cấp cao theo dõi', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await rowOf(page, 'Bảo đảm máy móc, công cụ dụng cụ').locator('button[title="Xem chi tiết công việc"]').click();
  await expect(page.locator('[data-sxcv-detail]')).toBeVisible();
  expect(await page.locator('.tab').allInnerTexts()).toEqual(['Thông tin chung', 'Công việc con (3)', 'Lịch sử cập nhật']);
  await expect(page.locator('[data-sxcv-detail]')).toContainText('63% (theo công việc con)');
  // Thêm công việc con: người thực hiện chỉ cùng đơn vị (Trung tâm Sản xuất — Khối 1).
  await page.locator('[data-go^="sx/cong-viec/create/CN/cha/"]').click();
  await page.locator('[data-vsel="cvf-owner"]').click();
  expect((await page.locator('.vsel-panel [data-opt]').evaluateAll((l) => l.map((o) => o.getAttribute('data-opt')))).sort()).toEqual(['sxpm', 'sxsub']);
  await page.locator('.vsel-panel [data-opt="sxsub"]').click();
  await page.locator('#cvf-title').fill('Hiệu chuẩn bàn đo quang học');
  await page.locator('#cvf-due').fill('20/11/2026');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('[data-sxcv-detail]')).toContainText('Hiệu chuẩn bàn đo quang học');
  // Người thực hiện cập nhật tiến độ ngay ở Việc của tôi (không mở chi tiết).
  await as(page, 'sxsub', '#/sx/viec-cua-toi');
  const r = rowOf(page, 'Chế tạo Jig, Stencil');
  await expect(r).toContainText('Kế hoạch');
  await expect(r).toContainText('Công việc con của: Bảo đảm máy móc');
  await r.locator('[data-sxcv-upd]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await page.locator('#cvu-pct').fill('100');
  await page.locator('#cvu-ok').click();
  await expect(rowOf(page, 'Chế tạo Jig, Stencil')).toContainText('Hoàn thành');
  // % việc cha tự tính: (50 + 100 + 100 + 0) / 4.
  await as(page, 'sxpm', '#/sx/cong-viec/NV-SX-2026-001');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('63% (theo công việc con)');
  // Theo dõi: lãnh đạo cấp cao xem được công việc con; người ngoài không.
  await as(page, 'sxceo', '#/sx/cong-viec/CV-SX-2026-002');
  await expect(page.locator('[data-sxcv-detail]')).toBeVisible();
  await as(page, 'sxkd', '#/sx/cong-viec/CV-SX-2026-002');
  await expect(page.locator('[data-sxcv-detail]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
