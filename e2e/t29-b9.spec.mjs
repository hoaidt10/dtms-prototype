// T29 B9 — Lập ĐXMS từ dự toán (S8), plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md v0.5 §3.10.
// Thêm mới luồng mua sắm (SCR-96): chỉ khoản mục Chi mua sắm còn khả dụng, + Thêm vào ĐXMS, Số lượng / Giá trị dự tính, cảnh báo vượt phần còn lại
// (không chặn); Loại khác KHCN chỉ tham khảo (D-60); người thẩm định theo vai trò (D-62); dòng đã bóc tách hiện ở bước 01 (duToanChon) và là đợt
// ĐXMS của khoản mục ở SCR-104.
import { test, expect } from '@playwright/test';
import { fresh, openForm } from './helpers.mjs';

const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const opts = async (page, id) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  const v = await page.locator('.vsel-panel [data-opt]').evaluateAll((es) => es.map((e) => e.dataset.opt));
  await page.locator('.pg-title').click();
  return v;
};
const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const DT = 'NV-KHCN-2026-014';

test('SCR-96 S8: bóc tách từ dự toán vào ĐXMS → bước 01 có dòng đã bóc tách → SCR-104 có đợt mới', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + '#/luong/create');
  await page.locator('#lf-title').fill('Mua sắm thiết bị đo đợt 2 cho trạm gNodeB');

  // D-60: Loại khác KHCN — dự toán chỉ tham khảo.
  await pick(page, 'lf-nv', 'DA-2026-002');
  await expect(page.locator('[data-lf-cost] .vcard-h')).toContainText('Dự toán tham khảo');

  await pick(page, 'lf-nv', DT);
  await expect(page.locator('[data-lf-cost] .vcard-h')).not.toContainText('Dự toán tham khảo');
  // Chỉ Loại chi phí có khoản mục Chi mua sắm: PL3 (quản lý), PL6 (dự phòng) không có.
  expect((await opts(page, 'lf-ctype')).sort()).toEqual(['PL2', 'PL4', 'PL5']);
  await pick(page, 'lf-ctype', 'PL5');
  expect(await opts(page, 'lf-cline')).toEqual([`${DT}-4`]);
  await pick(page, 'lf-ctype', 'PL2');
  // Khoản mục 6 (10 chiếc) đã giữ 2 chiếc ở ĐXMS-2026-0101 → còn 8.
  await page.locator('[data-vsel="lf-cline"]').click();
  await expect(page.locator(`.vsel-panel [data-opt="${DT}-6"]`)).toContainText('còn 8 Chiếc');
  await page.locator(`.vsel-panel [data-opt="${DT}-6"]`).click();
  await expect(page.locator('[data-lf-cadd]')).toHaveText(/Thêm vào ĐXMS/);
  await page.locator('[data-lf-cadd]').click();
  await pick(page, 'lf-ctype', 'PL2');
  await pick(page, 'lf-cline', `${DT}-1`);
  await page.locator('[data-lf-cadd]').click();
  await expect(page.locator('[data-lf-cost] tbody tr')).toHaveCount(2);
  await page.locator('[data-lf-cqty]').nth(0).fill('9');
  await page.locator('[data-lf-cval]').nth(0).fill('300.000.000');
  await page.locator('[data-lf-cqty]').nth(1).fill('2');
  await page.locator('[data-lf-cval]').nth(1).fill('50000000000');
  // D-75: không còn Danh sách người thẩm định.
  await expect(page.locator('[data-lf-rev]')).toHaveCount(0);

  // Cảnh báo vượt phần còn lại hiện sau khi vẽ lại, không chặn Lưu.
  await expect(page.locator('[data-lf-cwarn]')).toHaveText('Vượt khối lượng còn lại (8).');
  const up = (names) => page.locator('#lf-file').setInputFiles(names.map((name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(16) })));
  await up(['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  // Lưu đổi hash sang màn việc; không chờ điều hướng của trình duyệt (Playwright chờ mãi sau click ở kịch bản có cảnh báo).
  await page.locator('#lf-draft').click({ noWaitAfter: true });
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  const st = await page.evaluate(() => { const x = Flow.findDxms(Flow.state.dxms); return { code: x.code, cost: x.cost }; });
  expect(st.cost.map((r) => [r.line, r.qty, r.value])).toEqual([[`${DT}-6`, 9, 0.3], [`${DT}-1`, 2, 50]]);

  // Bước 01: T37 (RV-PROTO-0911 #4) bỏ khối căn cứ khả dụng; dòng đã bóc tách vẫn ở bảng Thông tin dự án / đề tài của màn Lập.
  await expect(page.locator('[data-basis-avail]')).toHaveCount(0);
  await expect(page.locator('[data-lf-cost]')).toContainText('Thiết bị, máy đo chuyên dụng');

  // SCR-104: khoản mục 6 có đợt của ĐXMS vừa tạo (đang phê duyệt = đang giữ).
  await go(page, '#/de-tai/' + encodeURIComponent(DT));
  await page.locator('[data-dt-tab="du-toan"]').click();
  await page.locator(`[data-vtt-row="${DT}-6"] [data-vtt]`).click();
  await expect(page.locator(`[data-vtt-row="${DT}-6:${st.code}"]`)).toContainText('Đang phê duyệt');
  await expect(page.locator(`[data-vtt-row="${DT}-6:${st.code}"]`)).toContainText('9');
  // Khoản mục đang được giữ → TTMS không bỏ được Chi mua sắm.
  await page.evaluate(() => Flow.setPersona('lan'));
  await page.locator(`[data-dt-buy="${DT}-6"]`).click();
  await expect(page.locator(`[data-dt-buy="${DT}-6"]`)).toBeChecked();

  // Tab Căn cứ của luồng: có ĐVT, Số lượng, link mở đề tài.
  await go(page, '#/luong/' + encodeURIComponent(st.code));
  await page.locator('[data-ltab="can-cu"]').click();
  await expect(page.locator(`main [data-go="de-tai/${DT}"]`).first()).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Bước 05: nút chính là "Gửi rà soát tồn kho" (Q5), danh mục vượt số còn lại vẫn bị chặn', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const label = await page.evaluate(() => {
    const def = Flow.def ? Flow.def() : null;
    return def && def[5] && def[5].choices ? def[5].choices.find((c) => c.main).label : null;
  });
  expect(label).toBe('Gửi rà soát tồn kho');
});
