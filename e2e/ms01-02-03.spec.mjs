// T6 — MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098) bằng click thật, theo docs/dtms/prototype-MS01-02-03-chuan-bi.md §3.4:
// chọn hồ sơ demo ở công cụ demo → Thêm mới hồ sơ (ĐXMS khoá) → chọn quy trình → chạy luồng chính tới phê duyệt; nhánh phụ B-3a…d.
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, state, openForm, aiDecide, closeForm, uploadReq } from './helpers.mjs';

// Công cụ demo › Hồ sơ demo: mở Thêm mới hồ sơ khoá ĐXMS của bộ, chọn quy trình rồi Lưu.
async function startDemo(page, key) {
  await page.locator('#demo').click();
  await page.locator(`[data-demo-set="${key}"]`).click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/create\//);
  await expect(page.locator('[data-vsel="c-dxms"]')).toHaveClass(/dis/);
  await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Phê duyệt ĐXMS');
  await page.locator('[data-vsel="c-proc"]').click();
  await page.locator(`.vsel-panel [data-opt="${key}"]`).click();
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/task\//);
}

// Chạy luồng chính bằng nút chính, tự đổi vai; xử lý các điều kiện trước của kịch bản. Trả về danh sách task đã mở.
async function runMain(page, onTask) {
  const seen = [];
  let steps = 0;
  while (steps++ < 200) {
    const s = await state(page);
    if (s.s !== 'running') break;
    if (!s.mine.length) {
      await page.locator('#who').click();
      await page.locator(`.menu-pop [data-persona="${s.any[0]}"]`).click();
      continue;
    }
    const tok = s.mine[0];
    await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tok.id);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    seen.push(tok.task);
    if (onTask) await onTask(tok);
    if ((tok.task === 11 || tok.task === 12) && !(await page.evaluate(() => !!Flow.ui.necessity))) {
      const f = await openForm(page);
      await aiDecide(f, 'Sự cần thiết');
      await f.locator('#ok').click();
      continue;
    }
    if (tok.task === 10) await uploadReq(page, 'quote_');
    if (tok.task === 16 && !(await page.evaluate(() => !!Flow.ui.bm03File))) await page.locator('[data-req-up="bm03File"]').click();
    if (tok.task === 32) await page.locator('[data-req-up="minutesFile"]').click();
    if (tok.task === 51) await page.locator('[data-req-up="bm06File"]').click();
    expect(await primary(page), `Kẹt ở task ${tok.task}`).toBe(true);
  }
  return seen;
}

test('MS01.02 (ĐXMS-2026-0124): chỉ căn cứ đã được TĐ duyệt; khớp ≥ 160 tỷ; task 48 khoá "Có báo cáo"; phê duyệt không qua 49–56', async ({ page }) => {
  test.setTimeout(120_000);
  await fresh(page, '#/viec-cua-toi');
  await startDemo(page, 'MS01.02');
  // Task 01 (eForm của quy trình MS01.02): không có loại Kế hoạch SXKD năm; văn bản chọn sẵn 1876/QĐ-TĐ (đã duyệt).
  const f1 = await openForm(page);
  await expect(f1.locator('[data-vsel="ef-basisDoc"]')).toContainText('1876/QĐ-TĐ');
  await expect(f1.locator('.ef-table .vbadge', { hasText: 'Chưa duyệt' })).toHaveCount(0);
  await f1.locator('[data-vsel="ef-basisType"]').click();
  await expect(page.locator('.vsel-panel [data-opt="khsx"]')).toHaveCount(0);
  await f1.locator('[data-vsel="ef-basisType"]').click();
  await closeForm(page);

  const seen = await runMain(page, async (tok) => {
    if (tok.task === 10) { const f = await openForm(page); await expect(f).toContainText('Khớp'); await closeForm(page); }
    if (tok.task === 48) {
      await expect(page.locator('.task-acts [data-act]', { hasText: 'Có báo cáo' })).toBeDisabled();
      await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Không báo cáo TGĐ Tập đoàn');
    }
  });
  const fin = await page.evaluate(() => ({ s: Flow.state.status, code: Flow.ci().code, flow: Flow.ci().flow, q9: Flow.doneCount(9), na: [49, 53, 56].map((n) => Flow.taskStatus(n)) }));
  expect(fin).toEqual({ s: 'approved', code: 'HS-2026-0124', flow: 'MS01.02', q9: 1, na: ['na', 'na', 'na'] });
  expect(seen).not.toContain(50);
  await expect(page).toHaveURL(/#\/ho-so$/);
  await expect(page.locator('.ginfo')).toContainText('/ 20 ngày làm việc');
  expect(page.errors).toEqual([]);
});

test('MS01.03 (ĐXMS-2026-0098): BM-09 + Checklist 02, Ban Tài chính bắt buộc, ký BM-04 + Checklist 02, SCR-23 ký BM-09, SCR-24 phê duyệt; KPI ≤ 10 NLV', async ({ page }) => {
  test.setTimeout(120_000);
  await fresh(page, '#/viec-cua-toi');
  await startDemo(page, 'MS01.03');
  const f1 = await openForm(page);
  await expect(f1.locator('[data-vsel="ef-basisDoc"]')).toContainText('0412/QĐ-VHT');
  await closeForm(page);

  const seen = await runMain(page, async (tok) => {
    if (tok.task === 7) {
      const f = await openForm(page);
      await expect(f.locator('.ef-row', { hasText: 'Bộ kit hiệu chuẩn' }).locator('[data-ef$="fromStock"]')).toHaveCount(1);
      await closeForm(page);
    }
    if (tok.task === 11) {
      const f = await openForm(page);
      await expect(f.locator('.ef-group > .ef-gh')).toContainText('Tờ trình BM-09');
      await expect(f.locator('.ef-table .ef-lbl', { hasText: 'Checklist 02' })).toHaveCount(1);
      await closeForm(page);
      await page.locator('[data-preview]', { hasText: 'BM-09' }).click();
      await expect(page.locator('.pdf-view')).toContainText('PHÊ DUYỆT');
      await page.locator('.overlay [data-close]').first().click();
    }
    if (tok.task === 16) {
      // G3: Ban Tài chính chọn sẵn; bỏ chọn thì BE từ chối khi Xác nhận.
      await page.locator('[data-req-up="bm03File"]').click();
      const f = await openForm(page);
      const tc = f.locator('[data-ef-list="cqcmSel"][data-v=\'"TC"\']');
      await expect(tc).toBeChecked();
      await expect(f.locator('[data-ef-list="cqcmSel"][data-v=\'"PC"\']')).not.toBeChecked();
      await tc.uncheck();
      await f.locator('#ok').click();
      expect(await lastToast(page)).toContain('CQCM Tài chính bắt buộc');
      await closeForm(page);
    }
    if (tok.task === 36) await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Xác nhận ký BM-04 & Checklist 02');
    if (tok.task === 38 || tok.task === 39) {
      await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Ký thẩm định BM-09');
      const f = await openForm(page);
      await expect(f).toContainText('Khối chữ ký BM-09');
      await expect(f).toContainText('Đã thể hiện qua BM-04 + Checklist 02');
      await closeForm(page);
    }
    if (tok.task === 60) {
      await expect(page.locator('[data-preview]', { hasText: 'BM-09' })).toHaveCount(1);
      await expect(page.locator('[data-preview]', { hasText: 'BM-08' })).toHaveCount(0);
      const f = await openForm(page);
      await expect(f).toContainText('trong hạn');
      await closeForm(page);
    }
  });
  expect(seen).toEqual(expect.arrayContaining([11, 38, 39, 60]));
  expect(seen).not.toContain(12);
  expect(seen).not.toContain(42);
  const fin = await page.evaluate(() => ({ s: Flow.state.status, code: Flow.ci().code, kpi: Flow.kpiUsed(), cq: Flow.state.history.filter((h) => h.task === 19).map((h) => h.who).sort() }));
  expect(fin.s).toBe('approved');
  expect(fin.code).toBe('HS-2026-0098');
  expect(fin.kpi).toBeLessThanOrEqual(10);
  expect(fin.cq).toEqual(['quang', 'thu']);
  await expect(page.locator('.ginfo')).toContainText('/ 10 ngày làm việc');
  await expect(page.locator('.dmain')).toContainText('BM-09');
  expect(page.errors).toEqual([]);
});

// [nhánh, task mở ra, vai, nút bấm, task phải tới] — nhánh phụ bộ MS01.03 (D.demoSets).
const branches = [
  [0, 60, 'tgd', 'Yêu cầu hoàn chỉnh', 26],
  [1, 39, 'binh', 'Không đồng ý', 26],
  [2, 17, 'lan', 'Chưa đúng', 16],
  [3, 28, 'minh', 'Gửi giải trình', 31],
];
for (const [i, from, who, label, expected] of branches) {
  test(`MS01.03 nhánh phụ ${i}: task ${from} → ${expected}`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await page.locator('#demo').click();
    await page.locator('[data-demo-set="MS01.03"]').click();
    await page.locator('#demo').click();
    await page.locator(`[data-branch="${i}"]`).click();
    await expect(page).toHaveURL(/#\/task\//);
    expect(await page.evaluate(() => [Flow.ci().dxms, Flow.state.persona])).toEqual(['ĐXMS-2026-0098', who]);
    await primary(page, label);
    await expect.poll(() => page.evaluate((t) => Flow.state.tokens.some((k) => k.task === t), expected)).toBe(true);
    if (expected === 26) {
      const tok = await page.evaluate(() => Flow.state.tokens.find((k) => k.task === 26).id);
      await page.evaluate((id) => { Flow.setPersona('minh'); location.hash = `#/task/${id}`; }, tok);
      const f = await openForm(page);
      await expect(f.locator('.banner-bad')).toContainText('Nội dung thử');
    }
    expect(page.errors).toEqual([]);
  });
}

test('công cụ demo: cảnh của bộ đang chọn; đổi bộ thì đặt lại luồng, giữ ý kiến ❓', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setNote('P-20', 'ý kiến thử'));
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS01.03"]').click();
  await page.locator('#demo').click();
  await expect(page.locator('.demo-panel [data-scene]')).toHaveCount(7);
  await page.locator('.demo-panel [data-scene="3-5"]').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.state.persona, Flow.ci().code, Flow.state.tokens.map((t) => t.task).sort()])).toEqual(['lan', 'HS-2026-0098', [38, 39]]);
  const f = await openForm(page);
  await expect(f).toContainText('Khối chữ ký BM-09');
  await closeForm(page);
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS01.02"]').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/create\/%C4%90XMS-2026-0124$/);
  expect(await page.evaluate(() => [Flow.state.status, Flow.state.qNotes['P-20']])).toEqual(['new', 'ý kiến thử']);
  expect(await lastToast(page)).toContain('ĐXMS-2026-0124');
  expect(page.errors).toEqual([]);
});
