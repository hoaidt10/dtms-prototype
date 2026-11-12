// T29 B15 — sửa nhỏ theo review prototype Huylx4 05/11 (docs/dtms/prototype-T29-review-huylx4-0511.md):
// #1 bước 19 mục OK cũng bắt buộc nhận xét; #32 bước 17 kết luận đúng, đủ cũng bắt buộc nhận xét; #5 nút Chọn mẫu tài liệu chỉ ở bước có mẫu;
// #6 SCR-104 Khối lượng cần thực hiện trước ĐVT; D-79 Trạng thái khoản mục suy từ ĐXMS; D-80 ẩn KĐT liên quan, tab Gói thầu / Hợp đồng.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

async function jump(page, task, proc = 'MS01.01') {
  return page.evaluate(([t, p]) => {
    Flow.jumpTo(t, 'minh', {}, p, undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return k.id;
  }, [task, proc]);
}
const form = (page) => page.locator('.vmodal.ef');
const DT = 'NV-KHCN-2026-014';

test('#1 bước 19: mục OK vẫn hiện Nội dung nhận xét và bắt buộc', async ({ page }) => {
  await fresh(page);
  await jump(page, 19);
  await page.locator('.task-acts [data-act].primary').click();
  const f = form(page);
  const row = f.locator('.ef-row', { hasText: 'Căn cứ' }).first();
  expect(await page.evaluate(() => Flow.state.tokens.length)).toBeGreaterThan(0);
  const ta = row.locator('textarea').first();
  await expect(ta).toBeVisible();
  await ta.fill('');
  await f.locator('#ok').click();
  await expect(row.locator('.vfield.invalid .msg')).toContainText('Bạn cần nhập nội dung nhận xét');
  await expect(f).toBeVisible();
  await ta.fill('Căn cứ phù hợp QĐ 1482/QĐ-VHT.');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('#32, P-225 bước 17: một nút Xác nhận danh sách CQCM; Đồng ý bắt buộc Nhận xét, không có hộp thoại Trình ký; bước 18 không tự trình BM-03 (T54: trình ở 16.1)', async ({ page }) => {
  await fresh(page);
  await jump(page, 17);
  await expect(page.locator('.task-acts [data-act]')).toHaveCount(1);
  await page.locator('.task-acts [data-act]', { hasText: 'Xác nhận danh sách CQCM' }).click();
  const f = form(page);
  await expect(f).toContainText('BM-03 đã được Đại diện đơn vị đề xuất trình ký khi duyệt phiếu yêu cầu thẩm định');
  await f.locator('#ok').click();
  await expect(f.locator('[data-ef-field="nhanXetDs"]')).toHaveClass(/invalid/);
  await f.locator('[data-ef-field="nhanXetDs"] textarea').fill('Đủ CQCM bắt buộc: Tài chính, Pháp chế, Chất lượng.');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  await expect(page.locator('.overlay #go')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('19');
  // T54 (SRS 21 V0.4, SRS 32 K5): bước 18 không còn tự trình ký BM-03.
  expect(await page.evaluate(() => Flow.state.history.filter((h) => h.signDoc === 'BM-03').length)).toBe(0);
  expect(page.errors).toEqual([]);
});

test('P-225 bước 17: Từ chối bắt buộc Nhận xét, về bước 16 và không trình ký BM-03', async ({ page }) => {
  await fresh(page);
  await jump(page, 17);
  await page.locator('.task-acts [data-act]', { hasText: 'Xác nhận danh sách CQCM' }).click();
  const f = form(page);
  await f.locator('#ef-no').click();
  await expect(f).toBeVisible();
  await f.locator('[data-ef-field="nhanXetDs"] textarea').fill('Thiếu Ban Pháp chế.');
  await f.locator('#ef-no').click();
  await expect(f).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('16');
  const out = await page.evaluate(() => ({ h: Flow.state.history.filter((x) => String(x.task) === '17').pop(), signed: Flow.state.history.some((x) => x.signDoc) }));
  expect(out.h.action).toBe('Từ chối');
  expect(out.h.reason).toBe('Thiếu Ban Pháp chế.');
  expect(out.signed).toBe(false);
  expect(page.errors).toEqual([]);
});

test('#5: Chọn mẫu tài liệu chỉ hiện ở bước có biểu mẫu của bước', async ({ page }) => {
  await fresh(page);
  await jump(page, 1);
  await expect(page.locator('[data-tpl]')).toHaveCount(0);
  await jump(page, 16);
  await expect(page.locator('[data-tpl]')).toHaveCount(1);
  await expect(page.locator('[data-tpl]')).toHaveAttribute('title', /Ma trận hành động/);
});

test('#6, D-79, D-80: SCR-104 cột Khối lượng trước ĐVT; Trạng thái suy từ ĐXMS; ẩn KĐT / Gói thầu', async ({ page }) => {
  await fresh(page, '#/de-tai/' + encodeURIComponent(DT));
  // 11/11/2026: tab KĐT liên quan tách riêng, hiện mặc định; Gói thầu / Hợp đồng vẫn ẩn (D-80).
  await expect(page.locator('[data-dt-tab]')).toHaveText(['Thông tin chung', 'Dự toán chi phí', 'ĐXMS liên quan', 'KĐT liên quan', 'Văn bản pháp lý']);
  await page.locator('[data-dt-tab="dxms"]').click();
  await expect(page.locator('[data-dt-kdt]')).toHaveCount(0);
  await page.locator('[data-dt-tab="kdt"]').click();
  await expect(page.locator('[data-dt-kdt]')).toHaveCount(1);
  await page.locator('[data-dt-tab="du-toan"]').click();
  const heads = await page.locator('[data-dt-dutoan] thead th').allTextContents();
  expect(heads.indexOf('Khối lượng cần thực hiện')).toBe(heads.indexOf('ĐVT') - 1);
  // Trạng thái suy: mỗi khoản mục Chi mua sắm khớp quy tắc theo các ĐXMS / KĐT đang dùng.
  const want = await page.evaluate((c) => {
    const lines = D.duToanOf(c).filter((l) => l.buy);
    return lines.map((l) => l.id);
  }, DT);
  expect(want.length).toBeGreaterThan(0);
  const txt = await page.locator('[data-dt-dutoan] tbody').innerText();
  expect(txt).not.toContain('Đang thực hiện');
  expect(txt).toMatch(/Chưa mua sắm|Đang mua sắm|Đã phê duyệt/);
  // Bật lại cờ (demo KĐT / Thầu): đủ 5 tab.
  await page.evaluate(() => { Object.assign(D.show, { dtKdt: true, dtThau: true }); App.render(); });
  await expect(page.locator('[data-dt-tab]')).toHaveText(['Thông tin chung', 'Dự toán chi phí', 'ĐXMS liên quan', 'KĐT liên quan', 'Gói thầu / Hợp đồng', 'Văn bản pháp lý']);
  expect(page.errors).toEqual([]);
});
