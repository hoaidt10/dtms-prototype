// T29 B10 — Thẩm định CQCM bốn khu (S9), plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md v0.5 §3.10; YC-DXMS-PROTO §5, §6.
// Màn việc bước 19 / 20 MS01: khu 1 Hồ sơ thẩm định (xem trực tuyến), khu 2 Lịch sử ý kiến theo lần (CQCM khác không thấy nội dung — P-200),
// khu 3 Phiếu BM-04 theo mục + kết luận Đồng ý / Yêu cầu sửa (Q7), khu 4 nút Ghi lại (Lưu nháp eForm) / Hoàn thành phiếu; chỉ huy Không đồng ý.
import { test, expect } from '@playwright/test';
import { fresh, primary } from './helpers.mjs';

const card = (page) => page.locator('[data-td-card]');
const toTask = async (page, task) => {
  await expect.poll(() => page.evaluate((t) => Flow.tokensFor(Flow.state.persona).some((k) => String(k.task) === String(t)), task)).toBe(true);
  await page.evaluate((t) => { location.hash = '#/task/' + Flow.tokensFor(Flow.state.persona).find((k) => String(k.task) === String(t)).id; }, task);
  await expect(card(page)).toBeVisible();
};

test('Lần 01: Ghi lại giữ Đang thẩm định → hoàn thành phiếu Yêu cầu sửa → chỉ huy trả lại → lịch sử có nội dung, lý do', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.jumpToScene(4, 'MS01.01'));
  await toTask(page, 19);

  // Khu 1: xem trực tuyến bốn tab.
  await expect(card(page).locator('[data-td-body="tt"] .pdf-view')).toBeVisible();
  await card(page).locator('[data-td-tab="cl"]').click();
  await expect(card(page).locator('[data-td-body="cl"] tbody tr').first()).toBeVisible();
  await card(page).locator('[data-td-tab="bt"]').click();
  await expect(card(page).locator('[data-td-body="bt"]')).toContainText('Máy phân tích phổ vector 44 GHz');
  await card(page).locator('[data-td-tab="rs"]').click();
  await expect(card(page).locator('[data-td-body="rs"] tbody tr').first()).toBeVisible();

  // Khu 2: lần 01 mới có yêu cầu thẩm định, chưa có phiếu.
  await expect(card(page).locator('[data-td-lan]')).toHaveCount(1);
  await expect(card(page).locator('[data-td-lan="1"]')).toContainText('hệ thống gửi yêu cầu thẩm định');

  // Khu 4: Ghi lại mở eForm chỉ có Hủy / Ghi lại.
  await page.locator('[data-td-save]').click();
  const f = page.locator('.vmodal.ef');
  await expect(f.locator('#ef-draft')).toHaveText('Ghi lại');
  await expect(f.locator('#ok')).toHaveCount(0);
  const row = f.locator('.ef-row', { hasText: 'Sự cần thiết' });
  await row.locator('[data-ef-radio$="danhGia"]', { hasText: 'Không OK' }).click();
  await row.locator('textarea').first().fill('Chưa nêu rõ nhu cầu sử dụng của trạm thử nghiệm.');
  await expect(f).toContainText('Kết luận phiếu: Yêu cầu sửa');
  await f.locator('#ef-draft').click();
  // Khu 3: bản ghi lại, hồ sơ vẫn ở bước 19.
  await expect(card(page).locator('[data-td-zone="3"]')).toContainText('Đã ghi lại · Đang thẩm định');
  await expect(card(page).locator('[data-td-kl]')).toHaveText('Kết luận: Yêu cầu sửa');
  await expect(card(page).locator('[data-td-zone="3"]')).toContainText('Chưa nêu rõ nhu cầu sử dụng');
  expect(await page.evaluate(() => Flow.tokensFor('hoa').some((k) => String(k.task) === '19'))).toBe(true);

  // Hoàn thành phiếu: dialog giữ bản ghi lại, nút nháp mang nhãn Ghi lại.
  await page.locator('.task-acts [data-act].primary').click();
  await expect(f.locator('#ef-draft')).toHaveText('Ghi lại');
  await expect(f).toContainText('Kết luận phiếu: Yêu cầu sửa');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);

  // Bước 20 (chỉ huy Ban Pháp chế): lịch sử có nội dung phiếu của cơ quan mình, cơ quan khác chỉ có kết luận.
  await page.evaluate(() => Flow.setPersona('tung'));
  await toTask(page, 20);
  await expect(page.locator('[data-td-save]')).toHaveCount(0);
  const own = card(page).locator('[data-td-ev="PC"]').first();
  await expect(own).toContainText('Chuyên viên hoàn thành phiếu BM-04');
  await expect(own).toContainText('Chưa nêu rõ nhu cầu sử dụng');
  await expect(own).toContainText('Yêu cầu sửa');
  const other = card(page).locator('[data-td-ev="TC"], [data-td-ev="CL"]');
  if (await other.count()) await expect(other.first()).toContainText('không hiển thị');
  await expect(card(page).locator('[data-td-kl]')).toHaveText('Kết luận: Yêu cầu sửa');

  // Không đồng ý → trả chuyên viên (21 → 19); lịch sử có lý do.
  await primary(page, 'Không đồng ý');
  await page.evaluate(() => Flow.setPersona('hoa'));
  await toTask(page, 19);
  await expect(card(page).locator('[data-td-ev="PC"]', { hasText: 'trả chuyên viên' })).toContainText('Lý do: Nội dung thử');
  expect(page.errors).toEqual([]);
});

test('Lần 02 (nhánh phụ): lịch sử hai lần, lần hiện tại ở trên; phiếu lần 02', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-branch="5"]').click();
  await expect(card(page)).toBeVisible();
  expect(await page.evaluate(() => Flow.state.vars.round)).toBe(1);
  await expect(card(page).locator('[data-td-lan]')).toHaveCount(2);
  await expect(card(page).locator('[data-td-lan]').first()).toHaveAttribute('data-td-lan', '2');
  await expect(card(page).locator('[data-td-lan="2"]')).toContainText('Lần hiện tại');
  // Lần 01 của Ban Pháp chế: ý kiến mẫu Không OK ở mục Biện pháp thực hiện; sau lần 01 ĐV gửi giải trình.
  await expect(card(page).locator('[data-td-lan="1"] [data-td-ev="PC"]').first()).toContainText('Quy chế LCNT');
  await expect(card(page).locator('[data-td-lan="1"]')).toContainText('gửi giải trình');
  await expect(card(page).locator('[data-td-zone="3"] h4')).toContainText('Lần 02');
  expect(page.errors).toEqual([]);
});
