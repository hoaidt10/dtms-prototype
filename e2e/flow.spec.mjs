// Kịch bản demo §2.4 bằng click thật: tạo ĐXMS (SCR-28), tạo hồ sơ Phê duyệt và chọn quy trình (SCR-25), chạy luồng chính MS01.01
// (BPMN MS01 v1.1, 61 task) tới phê duyệt, rồi thử 6 nhánh phụ (gồm B-3e: chọn nhầm quy trình → 10a → 10b → mở hồ sơ mới của cùng ĐXMS).
// Bản Playwright của tools/e2e.mjs (bỏ phần chụp ảnh từng màn).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, state, createDxms, createCase } from './helpers.mjs';

test('SCR-28 → SCR-25: tạo ĐXMS không start quy trình; Tạo hồ sơ khoá ĐXMS, chọn sẵn loại Phê duyệt; bắt buộc quy trình; MS01.02 chưa mở; Lưu là start task 01', async ({ page }) => {
  await fresh(page, '#/dxms');
  expect((await state(page)).s).toBe('new');
  await page.locator('[data-create="dxms"]').click();
  await expect(page.locator('.pg-title')).toContainText('Thêm mới ĐXMS');
  await expect(page.locator('input[placeholder="Hệ thống tự sinh"]')).toBeDisabled();
  await page.locator('#x-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên ĐXMS.']);
  await page.locator('#x-est').fill('abc');
  await page.locator('#x-title').fill('Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2');
  await page.locator('#x-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Giá trị dự kiến không đúng định dạng.']);
  await page.locator('#x-est').fill('183');
  await page.locator('#x-save').click();
  await expect(page).toHaveURL(/#\/dxms$/);
  expect(await lastToast(page)).toContain('Thêm mới ĐXMS thành công!');
  expect((await state(page)).s, 'tạo ĐXMS không start quy trình (D-11)').toBe('new');
  const row = page.locator('tr[data-code="ĐXMS-2026-0117"]');
  await expect(row).toContainText('Chưa có hồ sơ');
  await expect(row).toContainText('183,00');
  await expect(row.locator('[data-del-dxms]')).toHaveCount(1);

  // Chi tiết ĐXMS: không có Tạo hồ sơ (như source); Chỉnh sửa → Danh sách hồ sơ → Tạo hồ sơ.
  await row.locator('.link').click();
  await expect(page.locator('.pg-title')).toContainText('Xem chi tiết ĐXMS');
  await expect(page.locator('[data-dxms-profiles] .vcard-h .vbtn')).toHaveCount(0);
  await page.locator('.pg-head .r [data-go$="/edit"]').click();
  await page.locator('[data-dxms-profiles] .vcard-h .vbtn').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/create\/%C4%90XMS-2026-0117$/);
  await expect(page.locator('.pg-title')).toContainText('Thêm mới hồ sơ');
  await expect(page.locator('[data-vsel="c-dxms"]')).toHaveClass(/dis/);
  await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Phê duyệt ĐXMS');
  await expect(page.locator('#c-name')).toHaveValue('Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2');
  await page.locator('#c-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn Quy trình.']);
  await page.locator('[data-vsel="c-proc"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt.dis')).toHaveCount(1);
  await page.locator('.vsel-panel [data-opt="MS01.01"]').click();
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await lastToast(page)).toContain('Thêm mới thành công');
  await expect(page.locator('.tmain .ginfo')).toContainText('MS01.01');
  await expect(page.locator('.tmain .ginfo')).toContainText('Mã ĐXMSĐXMS-2026-0117');
  // Task 1 chỉ hiện căn cứ chưa được TĐ duyệt (qd1, qd2 — loại QĐ nhiệm vụ KHCN có 1482 và 0917).
  await expect(page.locator('tr[data-ui="basisDoc"]')).toHaveCount(2);
  const s = await page.evaluate(() => ({ code: Flow.ci().code, dxms: Flow.ci().dxms, flow: Flow.ci().flow, tok: Flow.state.tokens.map((t) => [t.task, t.who]) }));
  expect(s).toEqual({ code: 'HS-2026-0117', dxms: 'ĐXMS-2026-0117', flow: 'MS01.01', tok: [[1, 'minh']] });
  // ĐXMS giờ Đang phê duyệt, không xoá được; Danh sách hồ sơ của ĐXMS có hồ sơ vừa tạo.
  await page.evaluate(() => { location.hash = '#/dxms'; });
  await expect(page.locator('tr[data-code="ĐXMS-2026-0117"]')).toContainText('Đang phê duyệt');
  await expect(page.locator('tr[data-code="ĐXMS-2026-0117"] [data-del-dxms]')).toHaveCount(0);
  await page.locator('tr[data-code="ĐXMS-2026-0117"] .link').click();
  await expect(page.locator('[data-dxms-profiles] tbody')).toContainText('HS-2026-0117');
  expect(page.errors).toEqual([]);
});

test('SCR-25 luật R1–R3: ĐXMS đã phê duyệt chỉ tạo được Điều chỉnh; đang có hồ sơ xử lý thì chặn; hồ sơ Điều chỉnh mở ở chế độ xem', async ({ page }) => {
  await fresh(page, '#/ho-so-dxms');
  await page.locator('[data-create="hs"]').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/create$/);
  await page.locator('#c-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên hồ sơ.', 'Bạn cần chọn Loại hồ sơ.', 'Bạn cần chọn Quy trình.', 'Bạn cần chọn ĐXMS.']);
  // ĐXMS-2026-0103 đã phê duyệt: chọn Phê duyệt bị chặn.
  await page.locator('[data-vsel="c-dxms"]').click();
  await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0103"]').click();
  await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Điều chỉnh ĐXMS');
  await expect(page.locator('[data-vsel="c-proc"]')).toContainText('MS02');
  await expect(page.locator('#c-name')).toHaveValue('Điều chỉnh lần 1 — Mua sắm hệ thống mô phỏng mạng lõi 5G');
  await page.locator('[data-vsel="c-kind"]').click();
  await page.locator('.vsel-panel [data-opt="PD"]').click();
  await page.locator('[data-vsel="c-proc"]').click();
  await page.locator('.vsel-panel [data-opt="MS01.03"]').click();
  await page.locator('#c-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['ĐXMS đã được phê duyệt. Chọn loại hồ sơ Điều chỉnh ĐXMS.']);
  // ĐXMS-2026-0077 đang có hồ sơ Điều chỉnh xử lý: chặn mọi loại.
  await page.locator('[data-vsel="c-dxms"]').click();
  await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0077"]').click();
  await page.locator('[data-vsel="c-kind"]').click();
  await page.locator('.vsel-panel [data-opt="DC"]').click();
  await page.locator('#c-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['ĐXMS đang có hồ sơ đang xử lý.']);
  // ĐXMS-2026-0103: tạo hồ sơ Điều chỉnh → mở chi tiết hồ sơ ở chế độ xem, ĐXMS chuyển Đang điều chỉnh.
  await page.locator('[data-vsel="c-dxms"]').click();
  await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0103"]').click();
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/HS-2026-0127$/);
  await expect(page.locator('.ginfo')).toContainText('Loại hồ sơĐiều chỉnh ĐXMS');
  await expect(page.locator('.ginfo')).toContainText('MS02 — Điều chỉnh đề xuất mua sắm');
  await expect(page.locator('.ginfo')).toContainText('Giá trị sau điều chỉnh (gồm VAT)210,50 tỷ đồng');
  expect((await state(page)).s, 'hồ sơ Điều chỉnh không chạy luồng').toBe('new');
  await page.evaluate(() => { location.hash = '#/dxms'; });
  await expect(page.locator('tr[data-code="ĐXMS-2026-0103"]')).toContainText('Đang điều chỉnh');
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
  await expect(page.locator('.ginfo')).toContainText('Được thay bởiHS-2026-0125');
  await expect(page.locator('.ginfo')).toContainText('Đã chuyển quy trình');
  expect((await state(page)).s).toBe('moved');
  await page.locator('.ginfo [data-open-new]').click();
  await expect(page).toHaveURL(/#\/task\//);
  const s = await page.evaluate(() => ({ s: Flow.state.status, code: Flow.ci().code, dxms: Flow.ci().dxms, flow: Flow.ci().flow, replaces: Flow.state.replaces, tok: Flow.state.tokens.map((t) => t.task) }));
  expect(s).toEqual({ s: 'running', code: 'HS-2026-0125', dxms: 'ĐXMS-2026-0117', flow: 'MS01.01', replaces: 'HS-2026-0117', tok: [1] });
  await page.evaluate(() => { location.hash = '#/ho-so-dxms'; });
  await expect(page.locator('tr[data-code="HS-2026-0117"]')).toContainText('Đã chuyển quy trình');
  await expect(page.locator('tr[data-go="ho-so"]')).toContainText('HS-2026-0125');
  await page.locator('tr[data-code="HS-2026-0117"] .link').click();
  await expect(page.locator('.ginfo')).toContainText('Được thay bởi');
  // Hai hồ sơ cùng một ĐXMS (D-10): Danh sách hồ sơ của ĐXMS-2026-0117 có cả hai.
  await page.evaluate(() => { location.hash = '#/dxms/%C4%90XMS-2026-0117'; });
  await expect(page.locator('[data-dxms-profiles] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-dxms-profiles] tbody')).toContainText('HS-2026-0125');
  await expect(page.locator('[data-dxms-profiles] tbody')).toContainText('HS-2026-0117');
  expect(page.errors).toEqual([]);
});
