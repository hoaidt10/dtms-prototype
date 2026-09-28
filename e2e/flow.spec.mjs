// Kịch bản demo §2.4 bằng click thật: tạo ĐXMS và chọn quy trình (SCR-25), chạy luồng chính MS01.01 (BPMN MS01 v1.1, 61 task)
// tới phê duyệt, rồi thử 6 nhánh phụ (gồm B-3e: chọn nhầm quy trình → 10a → 10b → mở hồ sơ mới).
// Bản Playwright của tools/e2e.mjs (bỏ phần chụp ảnh từng màn).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, state } from './helpers.mjs';

// SCR-25 (trang #/dxms/create theo profile-form): nhập tên, chọn quy trình rồi Lưu; hồ sơ start ngay và mở task 01.
async function pickProcess(page, proc) {
  await page.locator('[data-vsel="c-proc"]').click();
  await page.locator(`.vsel-panel [data-opt="${proc}"]`).click();
}
async function createCase(page, proc) {
  await page.locator('[data-create]').first().click();
  await expect(page).toHaveURL(/#\/dxms\/create$/);
  await page.locator('#c-title').fill('Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2');
  await pickProcess(page, proc);
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/task\//);
}

test('SCR-25: trang tạo mới; bắt buộc tên + quy trình; MS01.02 chưa mở; mã tự sinh; Lưu là start task 01', async ({ page }) => {
  await fresh(page, '#/dxms');
  expect((await state(page)).s).toBe('new');
  await page.locator('[data-create]').first().click();
  await expect(page).toHaveURL(/#\/dxms\/create$/);
  await expect(page.locator('.pg-title')).toContainText('Thêm mới ĐXMS');
  await expect(page.locator('input[placeholder="Hệ thống tự sinh"]')).toBeDisabled();
  await page.locator('#c-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên ĐXMS.', 'Bạn cần chọn Quy trình.']);
  await page.locator('[data-vsel="c-proc"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt.dis')).toHaveCount(1);
  await page.locator('.vsel-panel [data-opt="MS01.01"]').click();
  await page.locator('#c-title').fill('Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2');
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await lastToast(page)).toContain('Thêm mới thành công');
  await expect(page.locator('.tmain .ginfo')).toContainText('MS01.01');
  // Task 1 chỉ hiện căn cứ chưa được TĐ duyệt (qd1, qd2 — loại QĐ nhiệm vụ KHCN có 1482 và 0917).
  await expect(page.locator('tr[data-ui="basisDoc"]')).toHaveCount(2);
  const s = await page.evaluate(() => ({ code: Flow.ci().code, flow: Flow.ci().flow, tok: Flow.state.tokens.map((t) => [t.task, t.who]) }));
  expect(s).toEqual({ code: 'ĐXMS-2026-0117', flow: 'MS01.01', tok: [[1, 'minh']] });
  expect(page.errors).toEqual([]);
});

test('luồng chính tới phê duyệt', async ({ page }) => {
  test.setTimeout(120_000);
  await fresh(page, '#/dxms');
  await createCase(page, 'MS01.01');

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

    // Điều kiện trước của kịch bản
    if (tok.task === 4) await page.locator('[data-ai-all]').click();
    if (tok.task === 10 && (await page.evaluate(() => Flow.doneCount(9))) === 1) {
      await primary(page);
      expect(await lastToast(page), 'T10 lần 1 phải chặn "Báo giá đạt"').toContain('Không đạt');
      await primary(page, 'Không đạt');
      continue;
    }
    if (tok.task === 12 && !(await page.evaluate(() => !!Flow.ui.necessity))) {
      await primary(page);
      expect(await lastToast(page), 'T12 phải báo AI Fail khi thiếu Sự cần thiết').toContain('Fail');
      await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tok.id);
      await page.locator('[data-ui="necessity"]').click();
    }
    if (tok.task === 16 && !(await page.evaluate(() => !!Flow.ui.bm03File))) {
      await primary(page);
      expect(await lastToast(page), 'T16 phải yêu cầu đính kèm BM-03').toContain('BM-03');
      await page.locator('[data-ui="bm03File"]').click();
    }
    if (tok.task === 32) await page.locator('[data-ui="minutesFile"]').click();
    if (tok.task === 51) await page.locator('[data-ui="bm06File"]').click();

    expect(await primary(page), `Kẹt ở task ${tok.task}`).toBe(true);
  }

  const fin = await page.evaluate(() => ({ s: Flow.state.status, kpi: Flow.kpiUsed(), q9: Flow.doneCount(9), checks: Flow.state.vars.checks.map((c) => c.ok) }));
  expect(fin.s, 'Luồng chính phải tới phê duyệt').toBe('approved');
  expect(fin.checks, 'Cổng kiểm tra khớp qua 1 lần, khớp').toEqual([true]);
  expect(fin.q9, 'YCBG phải gửi 2 lần').toBe(2);
  expect(fin.kpi, 'KPI phải ≤ 20 NLV').toBeLessThanOrEqual(20);
  expect(page.errors).toEqual([]);
});

// [nhánh, task mở ra, nút bấm, task phải tới] — theo BRANCHES trong app.js.
const branches = [
  [0, '10a', 'Chuyển quy trình', '10b'],
  [1, 13, 'Không đồng ý', 12],
  [2, 17, 'Chưa đúng', 16],
  [3, 28, 'Gửi giải trình', 31],
  [4, 48, 'Không báo cáo', 58],
  [5, 60, 'Yêu cầu hoàn chỉnh', 26],
];

for (const [i, from, label, expected] of branches) {
  test(`nhánh phụ ${i}: task ${from} → ${expected}`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await page.locator('#demo').click();
    await page.locator(`[data-branch="${i}"]`).click();
    await expect.poll(async () => (await state(page)).mine.map((t) => t.task)).toContain(from);

    await primary(page, label);
    if (i === 4) expect(await page.evaluate(() => Flow.state.vars.reportTD)).toBe(false);
    if (i === 3) expect(await page.evaluate(() => Flow.state.vars.round)).toBe(3);
    await expect.poll(() => page.evaluate((t) => Flow.taskStatus(t) !== 'todo' || Flow.state.tokens.some((k) => k.task === t), expected)).toBe(true);
    expect(page.errors).toEqual([]);
  });
}

test('B-3e: Sửa lại ở 10a về task 10; Chuyển quy trình → hồ sơ cũ "Đã chuyển quy trình", mở hồ sơ mới MS01.01 từ task 01', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-branch="0"]').click();
  await expect(page.locator('.banner-bad')).toBeVisible();
  await expect(page.locator('.cmp')).toContainText('MS01.01');
  await primary(page, 'Sửa lại');
  await expect.poll(async () => (await state(page)).mine.map((t) => t.task)).toContain(10);
  const tok10 = (await state(page)).mine.find((t) => t.task === 10);
  await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tok10.id);
  await expect(page.locator('.flow-label')).toContainText('Không khớp');
  await primary(page, 'Báo giá đạt');
  await expect.poll(async () => (await state(page)).mine.map((t) => t.task)).toContain('10a');
  const tokA = (await state(page)).mine.find((t) => t.task === '10a');
  await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tokA.id);
  await primary(page, 'Chuyển quy trình');
  await expect(page).toHaveURL(/#\/ho-so$/);
  await expect(page.locator('.ginfo')).toContainText('Được thay bởiĐXMS-2026-0125');
  await expect(page.locator('.ginfo')).toContainText('Đã chuyển quy trình');
  expect((await state(page)).s).toBe('moved');
  await page.locator('.ginfo [data-open-new]').click();
  await expect(page).toHaveURL(/#\/task\//);
  const s = await page.evaluate(() => ({ s: Flow.state.status, code: Flow.ci().code, flow: Flow.ci().flow, replaces: Flow.state.replaces, tok: Flow.state.tokens.map((t) => t.task) }));
  expect(s).toEqual({ s: 'running', code: 'ĐXMS-2026-0125', flow: 'MS01.01', replaces: 'ĐXMS-2026-0117', tok: [1] });
  await page.evaluate(() => { location.hash = '#/dxms'; });
  await expect(page.locator('tr[data-code="ĐXMS-2026-0117"]')).toContainText('Đã chuyển quy trình');
  await expect(page.locator('tr[data-go="ho-so"]')).toContainText('ĐXMS-2026-0125');
  await page.locator('tr[data-code="ĐXMS-2026-0117"] .link').click();
  await expect(page.locator('.ginfo')).toContainText('Được thay bởi');
  expect(page.errors).toEqual([]);
});
