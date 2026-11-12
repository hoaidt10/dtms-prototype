// T29 B16 — DX-10 (D-83): ba cấp chỉ huy duyệt trên ĐTMS, Kho và Thầu TTMS trên sơ đồ (review Huylx4 #25, #27–31).
import { test, expect } from '@playwright/test';
import { fresh, openForm, signGo } from './helpers.mjs';

async function jump(page, task) {
  return page.evaluate((t) => {
    Flow.jumpTo(t, 'minh', {}, 'MS01.01', undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return { id: k.id, who: k.who };
  }, task);
}

test('Bước duyệt mới: tác nhân, card chỉ xem, hộp thoại Duyệt có Ý kiến; danh sách bước có bước DX-10', async ({ page }) => {
  await fresh(page);
  const k51 = await jump(page, '5.1');
  expect(k51.who).toBe('hai');
  await expect(page.locator('.task-acts [data-act]')).toHaveText(['Xác nhận khởi tạo', 'Trả lại']);
  // Card Quy trình có bước DX-10 theo thứ tự.
  const steps = await page.evaluate(() => Screens.processSteps().map((s) => s.title));
  const i = (s) => steps.indexOf(s);
  expect(i('Chỉ huy ĐVĐX xác nhận khởi tạo')).toBeGreaterThan(0);
  expect(i('Chỉ huy Kho duyệt kết quả rà soát tồn kho')).toBeGreaterThan(i('Chỉ huy ĐVĐX xác nhận khởi tạo'));
  expect(i('Chỉ huy Thầu TTMS duyệt kết quả báo giá')).toBeGreaterThan(i('Chỉ huy Kho duyệt kết quả rà soát tồn kho'));
  expect(i('Chỉ huy ĐVĐX duyệt BM-03 và danh sách CQCM')).toBeGreaterThan(i('Chỉ huy Thầu TTMS duyệt kết quả báo giá'));
  const f = await openForm(page);
  await expect(f.locator('.ef-table')).toContainText('Máy phân tích phổ vector 44 GHz');
  await f.locator('[data-ef="yKien"]').fill('Đồng ý khởi tạo.');
  await f.locator('#ok').click();
  await expect(f).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => [String(t.task), t.who]))).toContainEqual(['7', 'qlts']);

  // 7.1 Chỉ huy Kho: T59 Q4 — kết quả rà soát chỉ xem ở tab Rà soát tồn kho (mở sẵn), không có ô nhập.
  const k71 = await jump(page, '7.1');
  expect(k71.who).toBe('khoch');
  await expect(page.locator('[data-rsk-view]')).toBeVisible();
  await expect(page.locator('[data-rsk-ed]')).toHaveCount(0);

  // 8, 10 Thầu TTMS; 10.1 Chỉ huy Thầu (review nhi 06/11 #2, #7: card báo giá tạm ẩn; Đồng ý / Từ chối).
  expect((await jump(page, 8)).who).toBe('thau');
  const k101 = await jump(page, '10.1');
  expect(k101.who).toBe('thauch');
  await expect(page.locator('[data-bg-card]')).toHaveCount(0);
  // Từ chối bắt buộc lý do → về bước 10.
  await page.locator('.task-acts [data-act]', { hasText: 'Từ chối' }).click();
  await expect(page.locator('.vmodal')).toBeVisible();
  await page.locator('.vmodal [data-close]').first().click();
  await expect(page.locator('.vmodal')).toHaveCount(0);

  // 16.1 Chỉ huy ĐVĐX duyệt BM-03 + danh sách CQCM trước TTMS (17).
  await jump(page, '16.1');
  const f2 = await openForm(page);
  await expect(f2.locator('.ef-table')).toContainText('Ban Pháp chế');
  await f2.locator('#ok').click();
  // T54: Phê duyệt 16.1 trình ký BM-03 (hộp thoại Trình ký VOffice).
  await signGo(page.locator('.overlay', { hasText: 'Trình ký VOffice — BM-03' }));
  await expect.poll(() => page.evaluate(() => Flow.state.tokens.map((t) => String(t.task)))).toContain('17');
  // Xem BPMN ở bước DX-10 (chưa có trên sơ đồ v1.1): mở được, không lỗi.
  const k = await jump(page, '7.1');
  await page.evaluate((id) => { location.hash = '#/task/' + id + '/bpmn'; }, k.id);
  await expect(page.locator('main')).not.toBeEmpty();
  expect(page.errors).toEqual([]);
});

test('DX-10 (b): Chỉ huy ĐVĐX tạo luồng → bỏ qua bước xác nhận khởi tạo', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.evaluate(() => Flow.setPersona('hai'));
  await page.goto(page.url().replace(/#.*$/, '') + '#/luong/create');
  const pick = async (id, v) => { await page.locator(`[data-vsel="${id}"]`).scrollIntoViewIfNeeded(); await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${v}"]`).click(); };
  await pick('lf-nv', 'NV-KHCN-2026-014');
  await page.locator('#lf-title').fill('Luồng do chỉ huy tạo');
  await pick('lf-unit', 'Trung tâm Vô tuyến');
  await page.locator('#lf-file').setInputFiles(['a.pdf', 'b.pdf'].map((name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(8) })));
  await pick('lf-type-1', 'QD_NV');
  await pick('lf-type-2', 'KH_NAM');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.state.vars.creatorCh)).toBe(true);
  const r = await page.evaluate(() => {
    for (let i = 0; i < 50 && !Flow.state.tokens.some((t) => String(t.task) === '7'); i++) { const t = Flow.state.tokens[0]; Flow.complete(t.id, Flow.mainChoice(t.task), null); }
    return { passed51: Flow.state.history.some((h) => String(h.task) === '5.1'), st: Flow.taskStatus('5.1') };
  });
  expect(r).toEqual({ passed51: false, st: 'na' });
  expect(page.errors).toEqual([]);
});
