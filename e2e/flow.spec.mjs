// Kịch bản demo §2.4 bằng click thật: tạo ĐXMS (SCR-28), tạo hồ sơ Phê duyệt (SCR-25, quy trình MS01 chỉ đọc — T29 B1, D-54), chạy luồng chính
// (BPMN MS01 v1.1, 61 task; luồng con MS01.01) tới phê duyệt, rồi thử 5 nhánh phụ.
// Bản Playwright của tools/e2e.mjs (bỏ phần chụp ảnh từng màn).
import { test, expect } from '@playwright/test';
import { fresh, primary, lastToast, state, createDxms, createCase, openForm, aiDecide, closeForm, uploadReq, aiApply } from './helpers.mjs';

// T34 (D-90): SCR-28, SCR-25 — comment cùng màn Tách.
// [T34 bỏ Tách] test('SCR-28 → SCR-25: tạo ĐXMS không start quy trình; Tạo hồ sơ khoá ĐXMS, chọn sẵn loại Phê duyệt; Quy trình MS01 chỉ đọc; Lưu là start task 01', async ({ page }) => {
// [T34 bỏ Tách]   await fresh(page, '#/dxms');
// [T34 bỏ Tách]   expect((await state(page)).s).toBe('new');
// [T34 bỏ Tách]   await page.locator('[data-create="dxms"]').click();
// [T34 bỏ Tách]   await expect(page.locator('.pg-title')).toContainText('Thêm mới ĐXMS');
// [T34 bỏ Tách]   await expect(page.locator('input[placeholder="Hệ thống tự sinh"]')).toBeDisabled();
// [T34 bỏ Tách]   await page.locator('#x-save').click();
// [T34 bỏ Tách]   await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên ĐXMS.', 'Bạn cần chọn Đề tài / dự án.']);
// [T34 bỏ Tách]   await page.locator('[data-vsel="x-nv"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="NV-KHCN-2026-014"]').click();
// [T34 bỏ Tách]   await page.locator('#x-est').fill('abc');
// [T34 bỏ Tách]   await page.locator('#x-title').fill('Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2');
// [T34 bỏ Tách]   await page.locator('#x-save').click();
// [T34 bỏ Tách]   await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Giá trị dự kiến không đúng định dạng.']);
// [T34 bỏ Tách]   await page.locator('#x-est').fill('183');
// [T34 bỏ Tách]   await page.locator('#x-save').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/dxms$/);
// [T34 bỏ Tách]   expect(await lastToast(page)).toContain('Thêm mới ĐXMS thành công!');
// [T34 bỏ Tách]   expect((await state(page)).s, 'tạo ĐXMS không start quy trình (D-11)').toBe('new');
// [T34 bỏ Tách]   const row = page.locator('tr[data-code="ĐXMS-2026-0117"]');
// [T34 bỏ Tách]   await expect(row).toContainText('Chưa có hồ sơ');
// [T34 bỏ Tách]   await expect(row).toContainText('183,00');
// [T34 bỏ Tách]   await expect(row.locator('[data-del-dxms]')).toHaveCount(1);
// [T34 bỏ Tách] 
// [T34 bỏ Tách]   // Chi tiết ĐXMS: không có Tạo hồ sơ (như source); Chỉnh sửa → Danh sách hồ sơ → Tạo hồ sơ.
// [T34 bỏ Tách]   await row.locator('.link').click();
// [T34 bỏ Tách]   await expect(page.locator('.pg-title')).toContainText('Xem chi tiết ĐXMS');
// [T34 bỏ Tách]   await expect(page.locator('[data-dxms-profiles] .vcard-h .vbtn')).toHaveCount(0);
// [T34 bỏ Tách]   await page.locator('.pg-head .r [data-go$="/edit"]').click();
// [T34 bỏ Tách]   await page.locator('[data-dxms-profiles] .vcard-h .vbtn').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/ho-so-dxms\/create\/%C4%90XMS-2026-0117$/);
// [T34 bỏ Tách]   await expect(page.locator('.pg-title')).toContainText('Thêm mới hồ sơ');
// [T34 bỏ Tách]   await expect(page.locator('[data-vsel="c-dxms"]')).toHaveClass(/dis/);
// [T34 bỏ Tách]   await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Phê duyệt ĐXMS');
// [T34 bỏ Tách]   await expect(page.locator('#c-name')).toHaveValue('Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2');
// [T34 bỏ Tách]   await expect(page.locator('#c-proc')).toBeDisabled();
// [T34 bỏ Tách]   await expect(page.locator('#c-proc')).toHaveValue('MS01 — Phê duyệt đề xuất mua sắm');
// [T34 bỏ Tách]   await page.locator('#c-save').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/task\//);
// [T34 bỏ Tách]   expect(await lastToast(page)).toContain('Thêm mới thành công');
// [T34 bỏ Tách]   // Task 1 (T29 B19, DX-11): việc bước 1 mở màn Lập ĐXMS (bước 1–5), không mở hộp thoại; căn cứ và phần còn khả dụng hiện ở phần bước 1.
// [T34 bỏ Tách]   await expect(page.locator('[data-luong-form]')).toHaveCount(1);
// [T34 bỏ Tách]   await expect(page.locator('[data-luong-form] input[disabled]').first()).toHaveValue('ĐXMS-2026-0117');
// [T34 bỏ Tách]   await expect(page.locator('.vmodal.ef')).toHaveCount(0);
// [T34 bỏ Tách]   await expect(page.locator('[data-basis-avail] tbody').first()).toContainText('1482/QĐ-VHT');
// [T34 bỏ Tách]   const s = await page.evaluate(() => ({ code: Flow.ci().code, dxms: Flow.ci().dxms, flow: Flow.ci().flow, tok: Flow.state.tokens.map((t) => [t.task, t.who]) }));
// [T34 bỏ Tách]   expect(s).toEqual({ code: 'HS-2026-0117', dxms: 'ĐXMS-2026-0117', flow: 'MS01.01', tok: [[1, 'minh']] });
// [T34 bỏ Tách]   // ĐXMS giờ Đang phê duyệt, không xoá được; Danh sách hồ sơ của ĐXMS có hồ sơ vừa tạo.
// [T34 bỏ Tách]   await page.evaluate(() => { location.hash = '#/dxms'; });
// [T34 bỏ Tách]   await expect(page.locator('tr[data-code="ĐXMS-2026-0117"]')).toContainText('Đang phê duyệt');
// [T34 bỏ Tách]   await expect(page.locator('tr[data-code="ĐXMS-2026-0117"] [data-del-dxms]')).toHaveCount(0);
// [T34 bỏ Tách]   await page.locator('tr[data-code="ĐXMS-2026-0117"] .link').click();
// [T34 bỏ Tách]   await expect(page.locator('[data-dxms-profiles] tbody')).toContainText('HS-2026-0117');
// [T34 bỏ Tách]   expect(page.errors).toEqual([]);
// [T34 bỏ Tách] });

// T34 (D-90): SCR-25 (luật thay bằng t34-mot-ho-so) — comment cùng màn Tách.
// [T34 bỏ Tách] test('SCR-25 luật R1–R3: ĐXMS đã phê duyệt chỉ tạo được Điều chỉnh; đang có hồ sơ xử lý thì chặn; hồ sơ Điều chỉnh khởi tạo luồng MS02', async ({ page }) => {
// [T34 bỏ Tách]   await fresh(page, '#/ho-so-dxms');
// [T34 bỏ Tách]   await page.locator('[data-create="hs"]').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/ho-so-dxms\/create$/);
// [T34 bỏ Tách]   await page.locator('#c-save').click();
// [T34 bỏ Tách]   await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên hồ sơ.', 'Bạn cần chọn Loại hồ sơ.', 'Bạn cần chọn ĐXMS.']);
// [T34 bỏ Tách]   // ĐXMS-2026-0103 đã phê duyệt: chọn Phê duyệt bị chặn.
// [T34 bỏ Tách]   await page.locator('[data-vsel="c-dxms"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0103"]').click();
// [T34 bỏ Tách]   await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Điều chỉnh ĐXMS');
// [T34 bỏ Tách]   await expect(page.locator('#c-proc')).toHaveValue(/^MS02 — /);
// [T34 bỏ Tách]   await expect(page.locator('#c-name')).toHaveValue('Điều chỉnh lần 1 — Mua sắm hệ thống mô phỏng mạng lõi 5G');
// [T34 bỏ Tách]   await page.locator('[data-vsel="c-kind"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="PD"]').click();
// [T34 bỏ Tách]   await page.locator('#c-save').click();
// [T34 bỏ Tách]   await expect(page.locator('.vfield.invalid .msg')).toHaveText(['ĐXMS đã được phê duyệt. Chọn loại hồ sơ Điều chỉnh ĐXMS.']);
// [T34 bỏ Tách]   // ĐXMS-2026-0077 đang có hồ sơ Điều chỉnh xử lý: chặn mọi loại.
// [T34 bỏ Tách]   await page.locator('[data-vsel="c-dxms"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0077"]').click();
// [T34 bỏ Tách]   await page.locator('[data-vsel="c-kind"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="DC"]').click();
// [T34 bỏ Tách]   await page.locator('#c-save').click();
// [T34 bỏ Tách]   await expect(page.locator('.vfield.invalid .msg')).toHaveText(['ĐXMS đang được điều chỉnh (ĐXMS-2026-0126).']);
// [T34 bỏ Tách]   // ĐXMS-2026-0103: tạo hồ sơ Điều chỉnh → khởi tạo luồng MS02 (T21 D-36), mở bước 1; ĐXMS chuyển Đang điều chỉnh.
// [T34 bỏ Tách]   await page.locator('[data-vsel="c-dxms"]').click();
// [T34 bỏ Tách]   await page.locator('.vsel-panel [data-opt="ĐXMS-2026-0103"]').click();
// [T34 bỏ Tách]   await page.locator('#c-save').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/task\/k\d+$/);
// [T34 bỏ Tách]   expect((await state(page)).s, 'hồ sơ Điều chỉnh chạy luồng').toBe('running');
// [T34 bỏ Tách]   await page.evaluate(() => { location.hash = '#/ho-so-dxms/HS-2026-0127'; });
// [T34 bỏ Tách]   await expect(page.locator('.ginfo')).toContainText('Loại hồ sơĐiều chỉnh ĐXMS');
// [T34 bỏ Tách]   await expect(page.locator('.ginfo')).toContainText('MS02 — Điều chỉnh đề xuất mua sắm');
// [T34 bỏ Tách]   await expect(page.locator('.ginfo')).toContainText('Giá trị sau điều chỉnh (gồm VAT)210,50 tỷ đồng');
// [T34 bỏ Tách]   await page.evaluate(() => { location.hash = '#/dxms'; });
// [T34 bỏ Tách]   await expect(page.locator('tr[data-code="ĐXMS-2026-0103"]')).toContainText('Đang điều chỉnh');
// [T34 bỏ Tách]   expect(page.errors).toEqual([]);
// [T34 bỏ Tách] });

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
    // T29 B19 (DX-11): bước 1 / 4 / 5 là màn Lập ĐXMS — Chấp nhận mọi gợi ý AI rồi Gửi.
    await expect(page.locator('.task-acts [data-act], [data-luong-form]').first()).toBeVisible();
    if (await page.locator('[data-luong-form]').count()) {
      await aiApply(page);
      await page.locator('#lf-save').click();
      await expect(page).toHaveURL(/#\/viec-cua-toi$/);
      continue;
    }
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();

    // Điều kiện trước của kịch bản
    // T29 B3a: bước 7 chỉ xác nhận được khi Kho (Phòng QLTS) đã nhập lần 2 — mô phỏng Kho đã làm (luồng Kho kiểm ở t29-b3.spec).
    if (tok.task === 7) await page.evaluate(() => RaSoatKho.has('p2') || RaSoatKho.fillSample());
    if (tok.task === 10) await uploadReq(page, 'quote_');
    // DX-03: lần YCBG đầu AI Không đạt — bấm "Báo giá đạt" vẫn quay lại task 09 (cổng đọc quoteCheck).
    // Review nhi 06/11 #2 (D.quoteManual): không còn AI kiểm tra báo giá — Thầu tự quyết Báo giá đạt.
    if (tok.task === 10 && !(await page.evaluate(() => D.quoteManual)) && (await page.evaluate(() => Flow.doneCount(9))) === 1) {
      await primary(page);
      expect(await lastToast(page), 'T10 lần 1: AI Không đạt → về task 09').toContain('Không đạt');
      continue;
    }
    // DX-01: thiếu "Sự cần thiết" → AI kiểm tra Không đạt, hồ sơ ở lại task 12; AI điền ô trống (review nhi 06/11 #35) rồi gửi lại.
    if (tok.task === 12 && !(await page.evaluate(() => !!Flow.ui.necessity))) {
      const f0 = await openForm(page);
      await f0.locator('[data-ef="mucDich"]').fill('Mục đích mua sắm.');
      await f0.locator('[data-ef="phamVi"]').fill('Danh mục theo bóc tách.');
      await f0.locator('#ok').click();
      expect(await lastToast(page), 'T12 phải báo AI Fail khi thiếu Sự cần thiết').toContain('Fail');
      await page.evaluate((id) => { location.hash = `#/task/${id}`; }, tok.id);
      const f = await openForm(page);
      await expect(f.locator('.banner-bad')).toContainText('Không đạt');
      await aiDecide(f, 'Sự cần thiết');
      await f.locator('#ok').click();
      continue;
    }
    // E3: tài liệu bắt buộc — tải lên ngay trong popup (Tài liệu đính kèm), cùng khoá với Danh sách tài liệu.
    if (tok.task === 16 && !(await page.evaluate(() => !!Flow.ui.bm03File))) {
      await primary(page);
      expect(await lastToast(page), 'T16 phải yêu cầu đính kèm BM-03').toContain('BM-03');
      const f = page.locator('.vmodal.ef');
      await expect(f.locator('.ef-docs'), 'Popup T16 phải có chỗ tải BM-03').toContainText('BM-03');
      await f.locator('[data-ef-doc="bm03File"]').setInputFiles({ name: 'BM-03.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
      await expect(f.locator('.ef-docs')).toContainText('Đã tải lên');
      await f.locator('#ok').click();
      await expect(f).toHaveCount(0);
      expect(await page.evaluate(() => !!Flow.ui.bm03File)).toBe(true);
      continue;
    }
    if (tok.task === 32) await page.locator('[data-req-up="minutesFile"]').click();
    if (tok.task === 51) await page.locator('[data-req-up="bm06File"]').click();

    expect(await primary(page), `Kẹt ở task ${tok.task}`).toBe(true);
  }

  const fin = await page.evaluate(() => ({ s: Flow.state.status, kpi: Flow.kpiUsed(), q9: Flow.doneCount(9), checks: Flow.state.vars.checks.map((c) => c.ok) }));
  expect(fin.s, 'Luồng chính phải tới phê duyệt').toBe('approved');
  expect(fin.checks, 'Cổng kiểm tra khớp qua 1 lần, khớp').toEqual([true]);
  // Review nhi 06/11 #2: không còn AI kiểm tra báo giá → YCBG gửi một lần (Thầu tự chọn Không đạt khi cần).
  expect(fin.q9, 'Số lần gửi YCBG').toBe(await page.evaluate(() => (D.quoteManual ? 1 : 2)));
  expect(fin.kpi, 'KPI phải ≤ 20 NLV').toBeLessThanOrEqual(20);
  expect(page.errors).toEqual([]);
});

// [nhánh, task mở ra, nút bấm, task phải tới] — theo BRANCHES trong app.js.
// T29 B1: bỏ nhánh 10a / 10b (D-54) — các nhánh lùi một vị trí.
const branches = [
  [0, 13, 'Không đồng ý', 12],
  [1, 17, 'Từ chối', 16],
  [2, 28, 'Gửi giải trình', 31],
  [3, 48, 'Không báo cáo', 58],
  [4, 60, 'Yêu cầu hoàn chỉnh', 26],
];

for (const [i, from, label, expected] of branches) {
  test(`nhánh phụ ${i}: task ${from} → ${expected}`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await page.locator('#demo').click();
    await page.locator(`[data-branch="${i}"]`).click();
    await expect.poll(async () => (await state(page)).mine.map((t) => t.task)).toContain(from);

    await primary(page, label);
    if (i === 3) expect(await page.evaluate(() => Flow.state.vars.reportTD)).toBe(false);
    if (i === 2) expect(await page.evaluate(() => Flow.state.vars.round)).toBe(3);
    await expect.poll(() => page.evaluate((t) => Flow.taskStatus(t) !== 'todo' || Flow.state.tokens.some((k) => k.task === t), expected)).toBe(true);
    expect(page.errors).toEqual([]);
  });
}
