// T31 B4 (K5) — Thẩm định CQCM bốn khu cho KĐT MS13, plan docs/dtms/prototype-T31-kdt-ia-chuan-bi.md §K5; SRS-KDT BR-KDT-08-04…06.
// Bước 27 (TTMS, CQCM chủ trì): khu 1 hồ sơ của vòng xem trực tuyến, khu 2 lịch sử theo vòng / lượt, khu 3 Đạt / Không đạt từng nội dung thẩm định,
// khu 4 Ghi lại giữ Đang thẩm định. Bước 29 (CQCM phối hợp): không thấy kết luận, nội dung của cơ quan khác. Bước 46 / 55: tổng hợp kết quả vòng.
import { test, expect } from '@playwright/test';
import { fresh, primary } from './helpers.mjs';

const card = (page) => page.locator('[data-td-card="kdt"]');
const as = (page, who) => page.evaluate((id) => Flow.setPersona(id), who);
const goTask = async (page, task) => {
  await expect.poll(() => page.evaluate((t) => Flow.tokensFor(Flow.state.persona).some((k) => String(k.task) === String(t)), task)).toBe(true);
  await page.evaluate((t) => { location.hash = '#/task/' + Flow.tokensFor(Flow.state.persona).find((k) => String(k.task) === String(t)).id; }, task);
};
const toTask = async (page, task) => {
  await expect.poll(() => page.evaluate((t) => Flow.tokensFor(Flow.state.persona).some((k) => String(k.task) === String(t)), task)).toBe(true);
  await page.evaluate((t) => { location.hash = '#/task/' + Flow.tokensFor(Flow.state.persona).find((k) => String(k.task) === String(t)).id; }, task);
  await expect(card(page)).toBeVisible();
};
const NX = 'Chưa nêu căn cứ xác định đơn giá buồng đo OTA.';

test('Vòng BM-01: lượt 01 Ghi lại giữ Đang thẩm định → Không đạt; CQCM phối hợp không thấy kết luận cơ quan khác; lượt 02 có lịch sử hai lượt', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.evaluate(() => Flow.jumpToScene('K5', 'MS13'));
  await as(page, 'lan');
  await toTask(page, 27);
  const c = card(page);

  // Khu 1: tờ trình BM-01, Checklist 01, bảng hạng mục, rà soát tồn kho.
  await expect(c.locator('[data-td-tab="tt"]')).toContainText('BM-01');
  await expect(c.locator('[data-td-body="tt"] .pdf-view')).toBeVisible();
  await expect(c.locator('[data-td-tab="pl"]')).toHaveCount(0);
  await c.locator('[data-td-tab="cl"]').click();
  await expect(c.locator('[data-td-tab="cl"]')).toHaveText('Checklist 01');
  await expect(c.locator('[data-td-body="cl"] tbody tr').first()).toBeVisible();
  await c.locator('[data-td-tab="hm"]').click();
  await expect(c.locator('[data-td-body="hm"] tbody tr').first()).toBeVisible();
  await c.locator('[data-td-tab="rs"]').click();
  await expect(c.locator('[data-td-body="rs"] tbody tr').first()).toBeVisible();

  // Khu 2: lượt 01 mới có việc đang thẩm định của TTMS. Khu 3: sáu nội dung thẩm định chủ trương, mọi nội dung Đạt.
  await expect(c.locator('[data-td-lan]')).toHaveCount(1);
  await expect(c.locator('[data-td-lan="CT-1"] [data-td-ev="TTMS"]')).toContainText('Đang xử lý');
  await expect(c.locator('[data-td-zone="3"] h4')).toContainText('Vòng BM-01 · Lượt 01');
  await expect(c.locator('[data-td-zone="3"] tbody tr')).toHaveCount(6);
  await expect(c.locator('[data-td-kl]')).toHaveText('Kết luận: Đạt');

  // Khu 4: Ghi lại mở eForm chỉ Hủy / Ghi lại; Không đạt bắt buộc nhận xét, kết luận hệ thống tính.
  await page.locator('[data-td-save]').click();
  const f = page.locator('.vmodal.ef');
  await expect(f.locator('#ef-draft')).toHaveText('Ghi lại');
  await expect(f.locator('#ok')).toHaveCount(0);
  const row = f.locator('.ef-row', { hasText: 'Tổng mức vốn' });
  await row.locator('[data-ef-radio$="danhGia"]', { hasText: 'Không đạt' }).click();
  await row.locator('textarea').first().fill(NX);
  await expect(f).toContainText('Kết luận: Cần sửa đổi, giải trình');
  await f.locator('#ef-draft').click();
  await expect(f).toHaveCount(0);
  await expect(c.locator('[data-td-zone="3"]')).toContainText('Đã ghi lại · Đang thẩm định');
  await expect(c.locator('[data-td-kl]')).toHaveText('Kết luận: Cần sửa đổi, giải trình');
  await expect(c.locator('[data-td-zone="3"]')).toContainText(NX);
  expect(await page.evaluate(() => Flow.tokensFor('lan').some((k) => String(k.task) === '27'))).toBe(true);

  // Hoàn thành thẩm định: dialog giữ bản ghi lại.
  await page.locator('.task-acts [data-act].primary').click();
  await expect(f.locator('#ef-draft')).toHaveText('Ghi lại');
  await expect(f).toContainText('Kết luận: Cần sửa đổi, giải trình');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);

  // 29 Ban Tài chính: kết quả TTMS hiện cho mọi CQCM; cơ quan chưa gửi chỉ có trạng thái.
  await as(page, 'thu');
  await toTask(page, 29);
  const ttms = c.locator('[data-td-lan="CT-1"] [data-td-ev="TTMS"]');
  await expect(ttms).toContainText('Cần sửa đổi, giải trình');
  await expect(ttms).toContainText(NX);
  await expect(c.locator('[data-td-lan="CT-1"]')).toContainText('Đang xử lý');
  await expect(c.locator('[data-td-zone="3"] h4')).toContainText('Phiếu nhận xét BM-09 — Ban Tài chính');
  await expect(page.locator('[data-td-save]')).toHaveCount(1);
  expect(await primary(page)).toBe(true);

  // 29 cơ quan còn lại: dòng Ban Tài chính chỉ có Đã gửi, không có kết luận, nội dung.
  const other = await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '29').who);
  await as(page, other);
  await toTask(page, 29);
  const tc = c.locator('[data-td-lan="CT-1"] [data-td-ev="TC"]');
  await expect(tc).toContainText('Đã gửi');
  await expect(tc).toContainText('không hiển thị');
  await expect(tc).not.toContainText('Cần sửa đổi');
  await expect(tc).not.toContainText('Chưa tách chi phí');
  expect(await primary(page)).toBe(true);

  // 31 ĐVĐX bổ sung → lượt 02: lịch sử hai lượt, lượt hiện tại ở trên; TTMS thấy toàn bộ.
  await as(page, 'minh');
  await goTask(page, 31);
  await expect(card(page)).toHaveCount(0);
  expect(await primary(page, 'Bổ sung hồ sơ theo ý kiến')).toBe(true);
  await as(page, 'lan');
  await toTask(page, 27);
  await expect(c.locator('[data-td-zone="3"] h4')).toContainText('Lượt 02');
  await expect(c.locator('[data-td-lan]')).toHaveCount(2);
  await expect(c.locator('[data-td-lan]').first()).toHaveAttribute('data-td-lan', 'CT-2');
  await expect(c.locator('[data-td-lan="CT-2"]')).toContainText('Lượt hiện tại');
  await expect(c.locator('[data-td-lan="CT-1"] [data-td-ev="TTMS"]')).toContainText(NX);
  // Phiếu Ban Tài chính lượt 01 = bản đã gửi (helper primary ghi "Nội dung thử" vào nhận xét đầu), kết luận Cần sửa đổi, giải trình.
  await expect(c.locator('[data-td-lan="CT-1"] [data-td-ev="TC"]')).toContainText('Nội dung thử');
  await expect(c.locator('[data-td-lan="CT-1"] [data-td-ev="TC"]')).toContainText('Cần sửa đổi, giải trình');
  await expect(c.locator('[data-td-lan="CT-1"]')).toContainText('bổ sung hồ sơ theo ý kiến');
  expect(page.errors).toEqual([]);
});

test('Bước 55 (vòng BM-03) và 46 (vòng BM-01): tổng hợp kết quả vòng, Ghi lại nội dung hoàn chỉnh, lịch sử các vòng', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.evaluate(() => Flow.jumpTo(55, 'lan', null, 'MS13', 'KĐT-2026-0032'));
  await toTask(page, 55);
  const c = card(page);
  await expect(c.locator('[data-td-tab="tt"]')).toContainText('BM-03');
  await c.locator('[data-td-tab="pl"]').click();
  await expect(c.locator('[data-td-body="pl"] .pdf-view')).toBeVisible();
  await expect(c.locator('[data-td-tab="cl"]')).toHaveText('Checklist 02');
  // Lịch sử: vòng BM-03 ở trên, vòng BM-01 ba lượt bên dưới.
  await expect(c.locator('[data-td-lan]').first()).toHaveAttribute('data-td-lan', 'KDT-1');
  await expect(c.locator('[data-td-lan="CT-3"]')).toBeVisible();
  const n = await page.evaluate(() => 1 + Flow.cqcmSel().length);
  await expect(c.locator('[data-td-zone="3"] h4')).toContainText('Tổng hợp kết quả thẩm định — Vòng BM-03 · 1 lượt');
  await expect(c.locator('[data-td-zone="3"] tbody tr')).toHaveCount(n);
  // Ghi lại nội dung hoàn chỉnh → hồ sơ vẫn ở bước 55.
  await page.locator('[data-td-save]').click();
  const f = page.locator('.vmodal.ef');
  await expect(f.locator('#ef-draft')).toHaveText('Ghi lại');
  await f.locator('textarea').first().fill('Cập nhật mốc giao hàng buồng đo OTA theo ý kiến Ban Tài chính.');
  await f.locator('#ef-draft').click();
  await expect(c.locator('[data-td-hc]')).toContainText('Cập nhật mốc giao hàng');
  await expect(c.locator('[data-td-zone="3"]')).toContainText('Đã ghi lại · Đang thẩm định');
  expect(await page.evaluate(() => Flow.tokensFor('lan').some((k) => String(k.task) === '55'))).toBe(true);

  // 46: vòng BM-01 ba lượt (Ban Tài chính cần sửa ở lượt 01, 02).
  await page.evaluate(() => Flow.jumpTo(46, 'lan', null, 'MS13', 'KĐT-2026-0032'));
  await toTask(page, 46);
  await expect(c.locator('[data-td-zone="3"] h4')).toContainText('Vòng BM-01 · 3 lượt');
  await expect(c.locator('[data-td-zone="3"] tbody')).toContainText('Cần sửa đổi, giải trình');
  await expect(c.locator('[data-td-lan]').first()).toHaveAttribute('data-td-lan', 'CT-3');
  expect(page.errors).toEqual([]);
});
