// T21 B1 — luồng Điều chỉnh ĐXMS (MS02): tạo hồ sơ Điều chỉnh ở SCR-25 khởi tạo luồng; mọi bước người dùng của ba luồng con mở được
// màn task không lỗi; Chi tiết hồ sơ hiện loại Điều chỉnh, giá trị trước / sau điều chỉnh, sơ đồ trang MS02 ver1.1 (plan T21 §9).
import { test, expect } from '@playwright/test';
import { fresh, state, openForm, closeForm } from './helpers.mjs';

// SCR-25: ĐXMS đã phê duyệt → loại Điều chỉnh chọn sẵn, quy trình MS02 → Lưu mở bước 1.
async function createAdj(page, dxms) {
  await fresh(page, '#/ho-so-dxms/create');
  await page.locator('[data-vsel="c-dxms"]').click();
  await page.locator(`.vsel-panel [data-opt="${dxms}"]`).click();
  await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Điều chỉnh ĐXMS');
  await page.locator('#c-save').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
}

// Đi hết luồng theo nhánh chính; mỗi bước người dùng mở màn task (bắt lỗi hiển thị) rồi hoàn thành bằng nút chính.
// patch(task) chạy trước khi hoàn thành bước (đổi giá trị sau điều chỉnh…). Trả về danh sách bước đã mở.
async function runAll(page, patch) {
  const seen = [];
  for (let i = 0; i < 200; i++) {
    const tok = await page.evaluate(() => {
      if (Flow.state.status !== 'running') return null;
      const t = Flow.state.tokens[0];
      Flow.setPersona(t.who);
      return { id: t.id, task: t.task };
    });
    if (!tok) break;
    await page.evaluate((id) => { location.hash = '#/task/' + id; }, tok.id);
    await expect(page.locator('.task-acts')).toBeVisible();
    seen.push(String(tok.task));
    if (patch) await patch(tok.task);
    await page.evaluate((id) => {
      const t = Flow.token(id), c = Flow.mainChoice(t.task);
      Flow.complete(id, c, c && c.reason ? 'Nội dung thử' : null);
    }, tok.id);
  }
  return seen;
}

test('MS02.02 — ĐXMS-2026-0103 (MS01.02, 210,5 tỷ): tạo hồ sơ Điều chỉnh chạy luồng tới phê duyệt BM-08, bỏ 49–56', async ({ page }) => {
  await createAdj(page, 'ĐXMS-2026-0103');
  await expect(page.locator('body')).toContainText('Chọn ĐXMS đã được phê duyệt cần điều chỉnh');
  const seen = await runAll(page);
  expect((await state(page)).s).toBe('approved');
  expect(seen).toContain('48');
  expect(seen).toContain('60');
  expect(seen.filter((n) => ['11', '38', '39', '49', '50', '51', '53', '56'].includes(n))).toEqual([]);
  expect(await page.evaluate(() => Flow.ci().branch)).toBe('MS02.02');
  await page.evaluate(() => { location.hash = '#/ho-so-dxms/HS-2026-0127'; });
  await expect(page.locator('.ginfo')).toContainText('Loại hồ sơĐiều chỉnh ĐXMS');
  await expect(page.locator('.ginfo')).toContainText('Giá trị sau điều chỉnh (gồm VAT)210,50 tỷ đồng');
  expect(page.errors).toEqual([]);
});

test('MS02.03 — chuyển ngưỡng: ĐXMS ≥ 160 tỷ, giá trị sau điều chỉnh 150 tỷ ở bước 10 → dự thảo 11, ký trực tiếp BM-09', async ({ page }) => {
  await createAdj(page, 'ĐXMS-2026-0103');
  const seen = await runAll(page, async (task) => {
    if (String(task) === '10') await page.evaluate(() => Flow.setAdj({ total: 150, reason: 'Giảm quy mô' }));
  });
  expect((await state(page)).s).toBe('approved');
  expect(seen).toEqual(expect.arrayContaining(['11', '38', '39', '60']));
  expect(seen.filter((n) => ['12', '42', '48', '58'].includes(n))).toEqual([]);
  expect(await page.evaluate(() => Flow.ci().branch)).toBe('MS02.03');
  expect(page.errors).toEqual([]);
});

test('MS02.01 — TTMS chọn Có báo cáo Tập đoàn ở 48: chạy 49–56 rồi phê duyệt', async ({ page }) => {
  await createAdj(page, 'ĐXMS-2026-0103');
  await page.evaluate(() => {
    for (let i = 0; i < 200 && !Flow.state.tokens.some((t) => t.task === 48); i++) {
      const t = Flow.state.tokens[0], c = Flow.mainChoice(t.task);
      Flow.complete(t.id, c, c && c.reason ? 'x' : null);
    }
    const t = Flow.state.tokens.find((k) => k.task === 48);
    Flow.complete(t.id, Flow.choices(48).find((c) => c.label.startsWith('Có báo cáo')));
  });
  const seen = await runAll(page);
  expect(seen).toEqual(expect.arrayContaining(['50', '51', '53', '54', '55', '56', '58', '59', '60']));
  expect((await state(page)).s).toBe('approved');
  expect(await page.evaluate(() => Flow.ci().branch)).toBe('MS02.01');
  expect(page.errors).toEqual([]);
});

// ---------- T21 B2: eForm bước 1 / 4, kết quả cũ ở 7 / 10, văn bản điều chỉnh, vòng đời D-40 ----------
const goTask = (page, n) => page.evaluate((k) => { const t = Flow.state.tokens.find((x) => String(x.task) === String(k)); Flow.setPersona(t.who); location.hash = '#/task/' + t.id; }, n);

test('B2 — ĐXMS-2026-0103 giảm còn 150 tỷ: bước 1 ĐXMS cũ chỉ xem, bước 4 cảnh báo chuyển ngưỡng, kết quả cũ ở 7 / 10, BM-09 điều chỉnh, ĐXMS điều chỉnh lần 1', async ({ page }) => {
  test.setTimeout(120_000);
  await createAdj(page, 'ĐXMS-2026-0103');
  let f = await openForm(page);
  await expect(f.locator('.ef-body')).toHaveAttribute('data-ef-form', 'dtms-ms02-t01-dxms-dieu-chinh');
  await expect(f).toContainText('HS-2026-0103');
  await expect(f).toContainText('Quyết định phê duyệt ĐXMS');
  await expect(f).toContainText('KHLCNT-2026-0016');
  await f.locator('#ok').click();
  await expect(f.locator('[data-ef-field="xacNhanDxms"].invalid')).toBeVisible();
  await f.locator('[data-ef-chk="xacNhanDxms"]').check();
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);

  await goTask(page, 4);
  f = await openForm(page);
  await expect(f.locator('.ef-body')).toHaveAttribute('data-ef-form', 'dtms-ms02-t04-noi-dung-dieu-chinh');
  await expect(f).toContainText('Gợi ý AI');
  await expect(f).not.toContainText('qua ngưỡng');
  // Nhập giá trị trước và rời ô (dialog vẽ lại khi ô đổi giá trị) rồi mới tới các ô khác.
  await f.locator('[data-ef="giaTriSau"]').fill('150');
  await f.locator('[data-ef="giaTriSau"]').blur();
  await expect(f).toContainText('qua ngưỡng 160 tỷ');
  await expect(f).toContainText('chênh lệch -60,5 tỷ');
  await f.locator('[data-vsel="ef-lyDoNhom"]').click();
  await page.locator('.vsel-panel [data-opt="Thay đổi quy mô, số lượng"]').click();
  await f.locator('[data-ef="lyDoDc"]').fill('Giảm 02 cụm mô phỏng');
  await f.locator('[data-ef="lyDoDc"]').blur();
  await f.locator('#ok').click();
  await expect(page.locator('.vmodal.ef')).toHaveCount(0);
  expect(await page.evaluate(() => [Flow.ci().total, Flow.ci().reason])).toEqual([150, 'Giảm 02 cụm mô phỏng']);

  const seen = await runAll(page, async (task) => {
    if (!['7', '10', '11'].includes(String(task))) return;
    const g = await openForm(page);
    if (String(task) === '7') await expect(g).toContainText('Cũ: khả dụng');
    if (String(task) === '10') { await expect(g).toContainText('So với báo giá của hồ sơ cũ'); await expect(g).toContainText('BM-09 điều chỉnh'); }
    if (String(task) !== '7') await expect(g).toContainText('Hồ sơ chuyển ngưỡng');
    await closeForm(page);
  });
  expect(seen).toEqual(expect.arrayContaining(['11', '38', '39', '60']));
  expect((await state(page)).s).toBe('approved');

  // Chi tiết hồ sơ: so sánh trước – sau, văn bản đầu ra bản điều chỉnh.
  await page.evaluate(() => { location.hash = '#/ho-so-dxms/HS-2026-0127'; });
  const cmp = page.locator('[data-adj-compare]');
  await expect(cmp).toContainText('HS-2026-0103');
  await expect(cmp).toContainText('210,50 tỷ đồng');
  await expect(cmp).toContainText('150,00 tỷ đồng');
  await page.locator('[data-preview-doc^="BM-09 Tờ trình điều chỉnh ĐXMS"]').click();
  await expect(page.locator('.vmodal')).toContainText('NỘI DUNG ĐIỀU CHỈNH');
  await expect(page.locator('.vmodal')).toContainText('Giảm 02 cụm mô phỏng');
  await page.locator('.vmodal [data-close]').first().click();

  // D-40: ĐXMS giữ mã, giá trị hiệu lực = giá trị sau điều chỉnh, trạng thái "Đã phê duyệt (điều chỉnh lần 1)", chuỗi hồ sơ.
  await page.evaluate(() => { location.hash = '#/dxms/' + encodeURIComponent('ĐXMS-2026-0103'); });
  await expect(page.locator('.ginfo')).toContainText('Giá trị hiệu lực (gồm VAT)150,00 tỷ đồng');
  await expect(page.locator('.ginfo')).toContainText('Đã phê duyệt (điều chỉnh lần 1)');
  const row = page.locator('[data-dxms-profiles] tr', { hasText: 'HS-2026-0127' });
  await expect(row).toContainText('Điều chỉnh ĐXMS');
  await expect(row).toContainText('HS-2026-0103');
  expect(page.errors).toEqual([]);
});

test('B2 — MS02.02: Quyết định BM-08 điều chỉnh; Việc của tôi ghi loại Điều chỉnh ĐXMS', async ({ page }) => {
  await createAdj(page, 'ĐXMS-2026-0103');
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('tr', { hasText: 'HS-2026-0127' }).first()).toContainText('Điều chỉnh ĐXMS');
  await runAll(page);
  expect((await state(page)).s).toBe('approved');
  await page.evaluate(() => { location.hash = '#/ho-so-dxms/HS-2026-0127'; });
  await page.locator('[data-preview-doc^="BM-08 Quyết định phê duyệt điều chỉnh ĐXMS"]').click();
  await expect(page.locator('.vmodal')).toContainText('phê duyệt điều chỉnh đề xuất mua sắm');
  await expect(page.locator('.vmodal')).toContainText('Các nội dung khác giữ nguyên');
  expect(page.errors).toEqual([]);
});

// ---------- T21 B3: bộ demo MS02 ở Công cụ demo (cảnh A1–A10, nhánh phụ) ----------
test('B3 — Công cụ demo bộ MS02: A1 mở SCR-25 loại Điều chỉnh, A7 chuyển ngưỡng có cảnh báo, A6 ĐXMS điều chỉnh lần 1', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS02"]').click();
  await expect(page).toHaveURL(/#\/ho-so-dxms\/create\//);
  await expect(page.locator('[data-vsel="c-kind"]')).toHaveText('Điều chỉnh ĐXMS');
  await page.locator('#c-save').click();
  await expect(page.locator('body')).toContainText('Chọn ĐXMS đã được phê duyệt cần điều chỉnh');

  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="A7"]').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  expect(await page.evaluate(() => [Flow.ci().branch, Flow.ci().total])).toEqual(['MS02.03', 150]);
  const f = await openForm(page);
  await expect(f).toContainText('Hồ sơ chuyển ngưỡng');
  await closeForm(page);

  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="A9"]').click();
  expect(await page.evaluate(() => [Flow.ci().dxms, Flow.ci().branch, Flow.state.tokens[0].task])).toEqual(['ĐXMS-2026-0072', 'MS02.01', 12]);

  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="A6"]').click();
  await expect(page.locator('.ginfo')).toContainText('Đã phê duyệt (điều chỉnh lần 1)');
  expect(page.errors).toEqual([]);
});

test('B3 — nhánh phụ bộ MS02 mở đúng màn task, không lỗi', async ({ page }) => {
  test.setTimeout(90_000);
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.pickDemo('MS02'));
  const n = await page.evaluate(() => D.demoSets.find((d) => d.key === 'MS02').branches.length);
  for (let i = 0; i < n; i++) {
    await page.locator('#demo').click();
    await page.locator(`.demo-panel [data-branch="${i}"]`).click();
    await expect(page).toHaveURL(/#\/task\/k\d+$/);
    await expect(page.locator('.task-acts')).toBeVisible();
    expect(await page.evaluate(() => Flow.state.vars.process)).toBe('MS02');
  }
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; Flow.setPersona('hai'); });
  await expect(page.locator('tr', { hasText: 'HS-2026-0126' }).first()).toContainText('Điều chỉnh ĐXMS');
  expect(page.errors).toEqual([]);
});
