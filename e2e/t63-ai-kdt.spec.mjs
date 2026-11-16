// T63 (D-117) — plan docs/dtms/prototype-T63-ai-ho-so-kdt.md: ✦ Gợi ý từ AI trên màn Thêm mới hồ sơ chủ trương / phê duyệt KĐT
// theo khuôn Lập ĐXMS (P-216): Thông tin chung (bước 3), Căn cứ pháp lý (bước 2) của hồ sơ chủ trương; Nội dung tờ trình KĐT (bước 49) của hồ sơ phê duyệt.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

// Màn Thêm mới hồ sơ KĐT nặng (bóc tách, nhiều dropdown): chạy song song cả bộ dễ quá 30 s — nới thời gian chờ, không đổi kiểm tra.
test.describe.configure({ timeout: 90_000 });

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|WBS|D-\d+\b|P-\d|TO BE|BBLV|❓/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const go = async (page, h) => {
  await page.evaluate((x) => { location.hash = x; }, h);
  await expect(page.locator('main')).toBeVisible();
};
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};
const addCost = async (page) => {
  // T72b (D-123): hệ thống đã bóc tách sẵn khi chọn đề tài — xoá các dòng đó để test tự thêm.
  while (await page.locator('[data-kc-cdel]').count()) await page.locator('[data-kc-cdel]').first().click();
  await page.locator('[data-vsel="kc-ctype"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  await page.locator('[data-vsel="kc-cline"]').click();
  await page.locator('.vsel-panel .vsel-opt').first().click();
  await page.locator('[data-kc-cadd]').click();
  await page.locator('[data-kc-cqty]').first().fill('1');
  await page.locator('[data-kc-cval]').first().fill('0,1');
};
const popup = (page) => page.locator('[data-lf-ai-pop]');
const enc = encodeURIComponent;

test('Hồ sơ chủ trương: ✦ Gợi ý từ AI ở Thông tin chung — Hủy giữ màn; Áp dụng điền Mục tiêu / Tổng mức vốn / Thời gian có nhãn ✦ AI; Gửi ghi aiGoiY', async ({ page }) => {
  const k = 'KĐT-2026-0021';
  await fresh(page, '#/ho-so-ct-kdt/create');
  await pick(page, 'kc-kdt', k);
  const chung = page.locator('[data-kc-chung]');
  const btn = chung.locator('[data-kc-ai="chung"]');
  await expect(btn).toHaveText('✦ Gợi ý từ AI');
  // Không có nút AI ở khối bóc tách (MS13 bước 5 do người làm).
  await expect(page.locator('[data-kc-cost] [data-kc-ai]')).toHaveCount(0);
  await page.locator('#kc-purpose').fill('');
  // Hủy: màn giữ nguyên.
  await btn.click();
  await expect(popup(page)).toBeVisible();
  await expect(popup(page)).toContainText('Bước 3 · Gợi ý thông tin cơ bản KĐT');
  await expect(popup(page)).toContainText('Bước 2 · AI đã lấy dữ liệu căn cứ');
  const keys = await popup(page).locator('[data-kc-pop-row]').evaluateAll((rs) => rs.map((r) => r.dataset.kcPopRow));
  expect(keys).toEqual(['purposeText', 'scope', 'value', 'fund', 'period', 'bienPhap']);
  await expect(popup(page).locator('[data-kc-pop-row="scope"]')).toContainText('Không có ô trên màn');
  await page.locator('.vmodal [data-close]').last().click();
  await expect(popup(page)).toHaveCount(0);
  await expect(page.locator('#kc-purpose')).toHaveValue('');
  await expect(chung.locator('.lf-ai-tag')).toHaveCount(0);
  // Áp dụng: bỏ chọn Thời gian, sửa Mục tiêu.
  await btn.click();
  await popup(page).locator('[data-kc-pop-on="period"]').uncheck();
  await popup(page).locator('[data-kc-pop-txt="purposeText"]').fill('Mục tiêu đã sửa theo đơn vị');
  await page.locator('[data-lf-ai-apply]').click();
  await expect(popup(page)).toHaveCount(0);
  await expect(page.locator('#kc-purpose')).toHaveValue('Mục tiêu đã sửa theo đơn vị');
  await expect(page.locator('.vfield', { has: page.locator('#kc-purpose') }).locator('.lf-ai-tag')).toHaveCount(1);
  await expect(page.locator('.vfield', { has: page.locator('#kc-xest') }).locator('.lf-ai-tag')).toHaveCount(1);
  await expect(page.locator('.vfield', { has: page.locator('#kc-period') }).locator('.lf-ai-tag')).toHaveCount(0);
  await expect(btn).toHaveText('✦ Gợi ý lại');
  await expect(page.locator('[data-kc-cost] [data-lf-ai2]')).toHaveCount(1);
  expect(await mainText(page)).not.toMatch(BA);
  // Vẫn sửa được sau khi áp dụng; Gửi hoàn thành 01–05, quyết định AI vào biến eForm bước 4.
  await page.locator('#kc-purpose').fill('Mục tiêu sửa lại trên màn');
  await addCost(page);
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  const r = await page.evaluate(() => ({ tok: Flow.state.tokens.map((t) => String(t.task)), ai: (Flow.ui.aiGoiY || []).map((x) => `${x.key}:${x.quyetDinh}`) }));
  expect(r.tok).toEqual(['7']);
  expect(r.ai).toEqual(expect.arrayContaining(['purposeText:Sửa', 'period:Bỏ', 'scope:Chấp nhận', 'bienPhap:Chấp nhận']));
  expect(await page.evaluate((c) => Flow.findKdt(c).purpose, k)).toBe('Mục tiêu sửa lại trên màn');
  expect(page.errors).toEqual([]);
});

test('Hồ sơ chủ trương: Căn cứ pháp lý — AI gợi ý loại căn cứ theo tên tệp và nội dung căn cứ pháp lý; Gửi khi chưa bấm AI vẫn được', async ({ page }) => {
  await fresh(page, '#/ho-so-ct-kdt/create');
  await pick(page, 'kc-kdt', 'KĐT-2026-0021');
  const basis = page.locator('[data-kc-basis]');
  await page.locator('#kc-bfile').setInputFiles([{ name: 'QD-phe-duyet-de-tai.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') },
    { name: 'Hop-dong-hop-tac.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') }]);
  await expect(basis.locator('tbody tr')).toHaveCount(2);
  await basis.locator('[data-kc-ai="legal"]').click();
  await expect(popup(page).locator('[data-kc-pop-row^="file-"]')).toHaveCount(2);
  await expect(popup(page).locator('[data-kc-pop-row^="file-"]').nth(0)).toContainText('Kế hoạch SXKD / PAKD / đề tài hàng năm');
  await expect(popup(page).locator('[data-kc-pop-row^="file-"]').nth(1)).toContainText('Hợp đồng / thoả thuận hợp tác');
  await page.locator('[data-lf-ai-apply]').click();
  await expect(basis.locator('tbody .lf-ai-tag')).toHaveCount(2);
  expect(await page.evaluate(() => document.querySelector('#kc-legal').value)).toMatch(/KHN-2027-DTPT/);
  await expect(page.locator('.vfield', { has: page.locator('#kc-legal') }).locator('.lf-ai-tag')).toHaveCount(1);
  // Gửi không bắt buộc bấm AI ở Thông tin chung.
  await addCost(page);
  await page.locator('#kc-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toEqual(['7']);
  expect(page.errors).toEqual([]);
});

test('Hồ sơ phê duyệt: Nội dung tờ trình KĐT trống khi tạo; ✦ Gợi ý từ AI (bước 49) kế thừa BM-01 → Áp dụng; Lưu nháp mở lại giữ nội dung và nhãn', async ({ page }) => {
  const K = 'KĐT-2026-0032';
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((k) => Flow.jumpTo('CT_END', 'minh', null, 'MS13', k), K);
  await go(page, '#/kdt/' + enc(K) + '/tao-ho-so');
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hồ sơ phê duyệt KĐT');
  const card = page.locator('[data-kc-bm03]');
  await expect(card.locator('#kc-t-hienTrang')).toHaveValue('');
  // Hồ sơ phê duyệt không có nút AI ở Thông tin chung, Căn cứ pháp lý.
  await expect(page.locator('[data-kc-chung] [data-kc-ai], [data-kc-basis] [data-kc-ai]')).toHaveCount(0);
  await card.locator('[data-kc-ai="bm03"]').click();
  await expect(popup(page)).toContainText('Bước 49 · Gợi ý hồ sơ KĐT từ chủ trương HS-2026-0032');
  await expect(popup(page)).toContainText('Kế thừa từ BM-01');
  await popup(page).locator('[data-kc-pop-on="ruiRo"]').uncheck();
  await page.locator('[data-lf-ai-apply]').click();
  await expect(card.locator('#kc-t-hienTrang')).not.toHaveValue('');
  await expect(card.locator('#kc-t-ruiRo')).toHaveValue('');
  await expect(card.locator('.vfield', { has: page.locator('#kc-t-hienTrang') }).locator('.lf-ai-tag')).toHaveCount(1);
  await expect(card.locator('.vfield', { has: page.locator('#kc-t-ruiRo') }).locator('.lf-ai-tag')).toHaveCount(0);
  await expect(card.locator('[data-kc-ai="bm03"]')).toHaveText('✦ Gợi ý lại');
  expect(await mainText(page)).not.toMatch(BA);
  const ht = await card.locator('#kc-t-hienTrang').inputValue();
  await page.locator('#kc-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  await expect(page.locator('.pg-title')).toHaveText('Lập hồ sơ phê duyệt KĐT');
  await expect(page.locator('#kc-t-hienTrang')).toHaveValue(ht);
  await expect(page.locator('#kc-t-ruiRo')).toHaveValue('');
  await expect(page.locator('.vfield', { has: page.locator('#kc-t-hienTrang') }).locator('.lf-ai-tag')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});
