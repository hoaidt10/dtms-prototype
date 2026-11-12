// T25 B3: MS24 Thanh toán theo đợt trên HĐ-2026-0052 — bấm đủ hai tuyến ký qua eForm, tab Thanh toán đọc từ hồ sơ con, đợt theo điều kiện mốc, SAP lỗi Gửi lại.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const HD = 'HĐ-2026-0052', CASE = 'HSTT-2026-0052-01', HREF = '#/hop-dong/' + encodeURIComponent(HD);
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-1\d\d|ngoài BPMN|\[Q\d|\*\*\*\*/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const openPanel = async (page) => { if (!(await page.locator('.demo-panel').count())) await page.locator('#demo').click(); };
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const ok = (page) => page.locator('.vmodal #ok').click();
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k)).id, [who, n]);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
/* Bước ký: mở việc, bấm Đồng ý và ký, xác nhận form. */
async function sign(page, who, n) {
  await openTask(page, who, n);
  await act(page, 'Đồng ý và ký');
  await ok(page);
  await done(page);
}
async function pickSet(page) { await openPanel(page); await page.locator('[data-demo-set="MS24"]').click(); await expect(page).toHaveURL(/#\/hop-dong\//); }
async function create(page) {
  await page.evaluate(() => Flow.setPersona('phd'));
  await page.locator('[data-hd-pay]').click();
  await page.locator('.vmodal #pay-ok').click();
  await expect(page).toHaveURL(/#\/task\/HSTT-2026-0052-01:k/);
}

test('MS24 đủ hai tuyến ký 4 cấp qua eForm; tab Thanh toán, SAP, tổng hợp đọc từ hồ sơ con', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await pickSet(page);
  const main = page.locator('.main');
  await expect(main).toContainText('Kế hoạch thanh toán');
  await expect(main).toContainText('Giữ lại bảo hành');
  expect(await main.innerText()).not.toMatch(BA);
  await create(page);
  expect(await main.innerText()).not.toMatch(BA);
  await expect(page.locator('.ginfo')).toContainText(HD);
  // Bước 1: thiếu hồ sơ thì bị chặn
  await act(page, 'Gửi hồ sơ thanh toán');
  await page.locator('[data-ef="ttNoiDung"]').fill('Hồ sơ tạm ứng, bảo lãnh tạm ứng');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Hồ sơ thanh toán');
  await page.locator('.vmodal [data-close]').first().click();
  await page.locator('[data-req-up]').first().click();
  await act(page, 'Gửi hồ sơ thanh toán');
  await page.locator('[data-ef="ttNoiDung"]').fill('Hồ sơ tạm ứng, bảo lãnh tạm ứng');
  await ok(page);
  await done(page);
  // Bước 2
  await openTask(page, 'phd', 2);
  await act(page, 'Đủ căn cứ thanh toán');
  await expect(page.locator('.vmodal')).toContainText('38,24');
  await ok(page);
  await done(page);
  // Bước 5 → AI lập bảng tổng hợp
  await openTask(page, 'phd', 5);
  await page.locator('[data-req-up]').first().click();
  await act(page, 'Cung cấp hoá đơn');
  await page.locator('[data-ef="ttSoHoaDon"]').fill('HĐ0001234');
  await ok(page);
  await done(page);
  // Tuyến bảng tổng hợp
  await openTask(page, 'tckt', 7);
  await act(page, 'Đồng ý và ký');
  await expect(page.locator('.vmodal')).toContainText('HĐ0001234');
  await ok(page);
  await done(page);
  await sign(page, 'tgd', 8);
  await sign(page, 'vthu', 9);
  // Văn thư đã ký; TGĐ Tập đoàn trả → sửa → trình lại từ Phòng tài chính
  await openTask(page, 'td', 10);
  await act(page, 'Không đồng ý');
  await page.locator('.vmodal textarea').fill('Sửa nội dung hoá đơn');
  await page.locator('.vmodal .vbtn.primary').click();
  await done(page);
  await openTask(page, 'phd', 11);
  await act(page, 'Trình ký lại');
  await page.locator('[data-ef="ttSuaBth"]').fill('Đã sửa');
  await ok(page);
  await done(page);
  for (const [who, n] of [['tckt', 7], ['tgd', 8], ['vthu', 9], ['td', 10]]) await sign(page, who, n);
  // Bước 12, tab Thanh toán đang lập
  await openTask(page, 'phd', 12);
  await act(page, 'Hoàn thiện và trình ký');
  await ok(page);
  await done(page);
  await goto(page, HREF);
  await expect(page.locator('.vtable tbody tr', { hasText: CASE })).toContainText('Đang ký đề nghị');
  for (const [who, n] of [['tckt', 13], ['tgd', 14], ['vthu', 15], ['td', 16]]) await sign(page, who, n);
  // Bước 18
  await openTask(page, 'tckt', 18);
  await act(page, 'Đã thanh toán');
  await page.locator('[data-ef="ttNgayTT"]').fill('30/10/2026');
  await page.locator('[data-ef="ttChungTu"]').fill('UNC-0091');
  await ok(page);
  await done(page);
  // Bước 19: bắt buộc minh chứng; xong về tab Thanh toán
  await openTask(page, 'tckt', 19);
  await page.locator('[data-req-up]').first().click();
  await act(page, 'Cập nhật trạng thái');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  const row = page.locator('.vtable tbody tr', { hasText: CASE });
  await expect(row).toContainText('Đã thanh toán');
  await expect(row).toContainText('Đã đồng bộ');
  await expect(main).toContainText('38,24');
  expect(await main.innerText()).not.toMatch(BA);
  // Hết đợt đủ điều kiện: nút biến mất cho tới khi có mốc
  await as(page, 'phd');
  await expect(page.locator('[data-hd-pay]')).toHaveCount(0);
  // Chi tiết hồ sơ con, BPMN
  await row.locator('a').click();
  await expect(page).toHaveURL(/ho-so-hd\/HSTT-2026-0052-01/);
  await expect(main).toContainText('TT-DNCT');
  await expect(main).toContainText('TT-BTH');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-h h2')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('MS24: đợt theo điều kiện mốc — có biên bản bàn giao mới tạo được đợt 1, không trùng đợt; chỉ Phòng Hợp đồng tạo', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await pickSet(page);
  await as(page, 'tckt');
  await expect(page.locator('[data-hd-pay]')).toHaveCount(0);
  await as(page, 'phd');
  await page.locator('[data-hd-pay]').click();
  await page.locator('[data-vsel="pay-dot"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(1);
  await page.locator('.vsel-panel [data-opt]').first().click();
  await page.locator('.vmodal [data-close]').first().click();
  // Biên bản bàn giao đã ký → có thêm đợt 1, đồng hồ hồ sơ từ ngày mốc
  await page.evaluate((hd) => Flow.hdEvent(hd, 5, { loai: 'biên bản bàn giao', kind: 'GIAO' }), HD);
  await page.locator('[data-hd-pay]').click();
  await page.locator('[data-vsel="pay-dot"]').click();
  await page.locator('.vsel-panel [data-opt]', { hasText: 'Thanh toán đợt 1' }).click();
  await expect(page.locator('.vmodal input.vctl').nth(1)).toHaveValue(/^116,6/);
  await page.locator('.vmodal #pay-ok').click();
  await expect(page).toHaveURL(/#\/task\/HSTT-2026-0052-01:k/);
  const r = await page.evaluate(() => [Flow.state.name, Flow.dateOf(Flow.state.clock), Flow.caseOf('HSTD-2026-0052').vars.track.ms[0].actual]);
  expect(r[0]).toBe('Thanh toán đợt 1');
  expect(r[1]).toBe(r[2]);
  expect(page.errors).toEqual([]);
});

test('Hợp đồng mẫu khác giữ hộp thoại thanh toán tĩnh; HĐ-2026-0052 chưa ký thì chưa có kế hoạch', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'phd');
  await goto(page, '#/hop-dong/' + encodeURIComponent('HĐ-2026-0012'));
  await page.locator('.dx-tabs [data-ttab="pay"]').click();
  await expect(page.locator('.main')).toContainText('TT-2026-0109');
  await goto(page, HREF);
  await page.locator('.dx-tabs [data-ttab="pay"]').click();
  await expect(page.locator('[data-hd-pay]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Bộ demo MS24: cảnh và nhánh phụ mở đúng việc, không có chữ BA; SAP lỗi hiện ở tab, Gửi lại xong đồng bộ', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const set = await page.evaluate(() => { const s = D.demoSets.find((d) => d.key === 'MS24'); return { scenes: s.scenes.map((x) => ({ n: x.n, start: x.start, who: x.who })), branches: s.branches.length }; });
  for (const sc of set.scenes) {
    await page.evaluate((n) => Flow.jumpToScene(n, 'MS24'), sc.n);
    if (sc.start === 'BASE' || sc.start === 'END') continue;
    const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k)).id, [sc.who, sc.start]);
    await goto(page, '#/task/' + id);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  for (let i = 0; i < set.branches; i++) {
    const r = await page.evaluate((k) => { const b = D.demoSets.find((d) => d.key === 'MS24').branches[k]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); return Flow.caseTokens(b.who).find((t) => String(t.task) === String(b.task)).id; }, i);
    await goto(page, '#/task/' + r);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  // Nhánh cuối: SAP lỗi
  await page.evaluate((h) => { HopDong.openTab(h, 'pay'); }, HD);
  await expect(page.locator('.vtable tbody tr', { hasText: CASE })).toContainText('Lỗi đồng bộ');
  await openTask(page, 'tckt', 20);
  await act(page, 'Gửi lại SAP');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(page.locator('.vtable tbody tr', { hasText: CASE })).toContainText('Đã đồng bộ');
  expect(page.errors).toEqual([]);
});
