// @ts-check
// T24 B4 (D-46): áp dụng luật hiển thị (Q1), đồng bộ từ Camunda có kết quả (Q2), mã quyền (Q3), Minimap + Phân công (Q4).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const go = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const as = (page, pid) => page.evaluate((p) => Flow.setPersona(p), pid);
const NO_ACCESS = 'Bạn chưa được cấp quyền truy cập chức năng này';
const V2 = '2251799813690112';

/* Mở màn xử lý việc đầu tiên đang chờ của một cảnh mẫu MS01.01. */
async function openTask(page) {
  await fresh(page, '#/viec-cua-toi');
  const t = await page.evaluate(() => {
    const scene = D.demoSets.find((d) => d.key === 'MS01.01').scenes.find((s) => s.start !== 'NEW' && s.start !== 'END');
    Flow.jumpToScene(scene.n, 'MS01.01');
    const k = Flow.state.tokens[0];
    Flow.setPersona(k.who);
    return { id: k.id, who: k.who, task: String(k.task), flow: Flow.ci().flow };
  });
  await go(page, `#/task/${t.id}`);
  await expect(page.locator('main .pg-head [data-act]').first()).toBeVisible();
  return t;
}
// T29 B1 (D-54): hồ sơ của luồng con MS01.0x dùng luật của quy trình MS01.
const ruleIds = (page, t) => page.evaluate((x) => MaTran.rules().filter((r) => r.proc === x.flow.replace(/^MS01\.0[1-3]$/, 'MS01') && r.step === 'Activity_' + x.task).map((r) => r.id), t);
const setRule = (page, id, k, v) => page.evaluate(([i, kk, vv]) => { MaTran.rules().find((r) => r.id === i)[kk] = vv; App.render(); }, [id, k, v]);

test('Q1: tắt luật bằng công tắc thì nút ẩn; bật lại thì hiện; đổi Tên hiển thị đổi nhãn; xoá luật thì ẩn', async ({ page }) => {
  const t = await openTask(page);
  const btns = page.locator('main .pg-head [data-act]');
  const n = await btns.count();
  const [id] = await ruleIds(page, t);
  const code = await page.evaluate((i) => MaTran.rules().find((r) => r.id === i).code, id);

  await as(page, 'qt');
  await go(page, '#/ma-tran/display-rule');
  await page.locator('#mt-kw').fill(code);
  await page.locator('#mt-kw').press('Enter');
  await page.locator(`[data-mt-tg="${id}"]`).click();
  await page.getByRole('button', { name: 'Có', exact: true }).click();
  await expect(page.locator(`[data-mt-tg="${id}"]`)).toHaveAttribute('aria-checked', 'false');

  await as(page, t.who);
  await go(page, `#/task/${t.id}`);
  await expect(page.locator('main .pg-head [data-go$="/bpmn"]')).toBeVisible();
  await expect(btns).toHaveCount(n - 1);

  await setRule(page, id, 'active', true);
  await expect(btns).toHaveCount(n);

  await setRule(page, id, 'name', 'Nhãn mới của luật');
  await expect(btns.filter({ hasText: 'Nhãn mới của luật' })).toHaveCount(1);

  await page.evaluate((i) => { const a = MaTran.rules(); a.splice(a.findIndex((r) => r.id === i), 1); App.render(); }, id);
  await expect(btns).toHaveCount(n - 1);
  expect(page.errors).toEqual([]);
});

test('Q1: luật sang màn khác hoặc vai khác thì ẩn nút; tài khoản toàn quyền bỏ qua vai; Chi tiết hồ sơ không có nút', async ({ page }) => {
  const t = await openTask(page);
  const btns = page.locator('main .pg-head [data-act]');
  const n = await btns.count();
  const [id] = await ruleIds(page, t);

  await setRule(page, id, 'screen', 'DETAIL');
  await expect(btns).toHaveCount(n - 1);
  await setRule(page, id, 'screen', 'TASK');
  await expect(btns).toHaveCount(n);

  await setRule(page, id, 'roles', ['R-QTHT']);
  await expect(btns).toHaveCount(n - 1);
  await as(page, 'admin');
  await go(page, `#/task/${t.id}`);
  await expect(btns).toHaveCount(n);

  await go(page, '#/ho-so');
  await expect(page.locator('main .pg-head .vbtn.primary')).toHaveText('Xem BPMN');
  await expect(btns).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Q1: luồng con MS01.0x dùng luật của MS01; quy trình chưa có luật (MS13) giữ nguyên nút', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const r = await page.evaluate(() => ({
    a: MaTran.allowed('MS01.03', '11', 'Soạn thảo tờ trình ĐXMS', 'minh').show,
    // T39 B1 (fail-closed): bước đã có nhánh đối soát, nhãn không khớp luật nào → không hiện.
    x: MaTran.allowed('MS01.03', '11', 'Gửi chỉ huy duyệt', 'minh').show,
    k: MaTran.allowed('MS13', '10', 'Bất kỳ', 'minh').show,
  }));
  expect(r).toEqual({ a: true, x: false, k: true });
});

test('Q2: đồng bộ thêm phiên bản, chuyển Dừng hoạt động, sinh luật còn thiếu; lần sau không đổi', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'qt');
  await go(page, '#/quy-trinh');
  const before = await page.evaluate(() => MaTran.rules().length);
  const sync = page.locator('[data-wf="sync"]');
  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(sync).toBeEnabled();
  expect(await lastToast(page)).toContain('Đã đồng bộ danh sách quy trình từ Camunda.');

  for (const k of ['DTMS_MS13', 'DTMS_MS14', 'DTMS_MS01']) await page.locator(`[data-vtt-key="${k}"]`).click();
  await expect(page.locator('.vtt tbody tr.child')).toHaveCount(7);
  // MS14 bản 1 và MS01 bản 1 (v1.0, đã dừng từ trước).
  await expect(page.locator('.vtt tbody tr.child .vbadge', { hasText: 'Dừng hoạt động' })).toHaveCount(2);
  const added = await page.evaluate(() => MaTran.rules().length);
  expect(added - before, 'T29 B1: dữ liệu mẫu đã đủ luật cho MS01').toBe(0);
  const versions = () => page.evaluate(() => QuyTrinh.WORKFLOWS.find((w) => w.code === 'MS14').versions.map((v) => [v.version, v.status]));
  expect(await versions()).toEqual([[2, 'ACTIVE'], [1, 'DELETED']]);

  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(sync).toBeEnabled();
  expect(await page.evaluate(() => MaTran.rules().length)).toBe(added);
  expect(await versions()).toEqual([[2, 'ACTIVE'], [1, 'DELETED']]);

  expect(await page.evaluate(() => MaTran.reconRows('MS01').filter((x) => !x.rule).length)).toBe(0);
  expect(page.errors).toEqual([]);
});

test('Q2: đang có phiên và lỗi Camunda không đổi dữ liệu; Reset luồng về dữ liệu mẫu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'qt');
  await go(page, '#/quy-trinh');
  const count = () => page.evaluate(() => QuyTrinh.WORKFLOWS.reduce((s, w) => s + w.versions.length, 0));
  const n0 = await count();
  const sync = page.locator('[data-wf="sync"]');

  /* Bảng công cụ demo che nút đồng bộ: mở, chọn ca, đóng. */
  const mode = async (m) => { await page.locator('#demo').click(); await page.locator(`[data-wf-mode="${m}"]`).click(); await page.locator('#demo').click(); };

  await mode('busy');
  await sync.click();
  expect(await lastToast(page)).toContain('Đang có phiên đồng bộ đang chạy, vui lòng thử lại sau.');
  await expect(sync).toBeEnabled();
  expect(await count()).toBe(n0);

  await mode('fail');
  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(sync).toBeEnabled();
  expect(await lastToast(page)).toContain('Đồng bộ thất bại');
  expect(await count()).toBe(n0);

  await mode('ok');
  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(sync).toBeEnabled();
  expect(await count()).toBe(n0 + 3);

  /* Huỷ hộp thoại thì giữ nguyên; xác nhận mới về mẫu. */
  await page.locator('#demo').click();
  await page.locator('#reset').click();
  await page.locator('[data-close]').click();
  expect(await count()).toBe(n0 + 3);
  await page.locator('#reset').click();
  await page.locator('#rs').click();
  expect(await count()).toBe(n0);
  expect(await page.evaluate(() => MaTran.reconRows('MS01').filter((x) => !x.rule).length)).toBe(0);

  /* Khôi phục dữ liệu mẫu cũng đưa quy trình và luật về mẫu. */
  await as(page, 'qt');
  await go(page, '#/quy-trinh');
  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(sync).toBeEnabled();
  expect(await count()).toBe(n0 + 3);
  await page.locator('#demo').click();
  await page.locator('#reset-eform').click();
  expect(await count()).toBe(n0);
  expect(page.errors).toEqual([]);
});

test('Q3: Người dùng quản trị quy trình xem được, không đồng bộ, không lịch sử phiên bản, Ma trận chỉ xem', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'qlqt');
  await go(page, '#/quy-trinh');
  await expect(page.locator('.vtt')).toBeVisible();
  await expect(page.locator('[data-wf="sync"]')).toHaveCount(0);
  await page.locator('[data-vtt-key="DTMS_MS01"]').click();
  await page.locator('.vtt tbody tr.child a.link').first().click();
  await expect(page.locator('main h1')).toContainText('Chi tiết quy trình');
  await expect(page.locator('main')).toContainText('Sơ đồ quy trình');
  await expect(page.locator('main')).not.toContainText('Lịch sử phiên bản');

  await go(page, '#/ma-tran/display-rule');
  await expect(page.locator('main .mt-tab')).toHaveCount(3);
  await expect(page.locator('main .pg > .pg-head .r .vbtn.primary')).toHaveCount(0);
  await expect(page.locator('[data-mt-edit], [data-mt-del], [data-mt-tg]')).toHaveCount(0);
  await expect(page.locator('main .vswitch').first()).toBeDisabled();
  await go(page, '#/ma-tran/bpmn-reconcile');
  await expect(page.locator('main .mt-tab.on')).toHaveText('Đối soát BPMN');
  await expect(page.locator('[data-mt="sync"]')).toHaveCount(0);
  await go(page, '#/ma-tran/display-rule/create');
  await expect(page.locator('main')).toContainText(NO_ACCESS);
  expect(page.errors).toEqual([]);
});

test('Q3: thiếu QT02 thì Mã quy trình là chữ; TTMS không vào Ma trận; đủ quyền thì có Lịch sử phiên bản', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { D.perms.qlqt = ['QT00', 'QT01']; Flow.setPersona('qlqt'); });
  await go(page, '#/quy-trinh');
  await page.locator('[data-vtt-key="DTMS_MS01"]').click();
  await expect(page.locator('.vtt tbody tr.child').first()).toBeVisible();
  await expect(page.locator('.vtt tbody tr.child a.link')).toHaveCount(0);
  await as(page, 'lan');
  await go(page, '#/ma-tran/display-rule');
  await expect(page.locator('main')).toContainText(NO_ACCESS);
  await as(page, 'qt');
  await go(page, `#/quy-trinh/${V2}`);
  await expect(page.locator('main')).toContainText('Lịch sử phiên bản');
  expect(page.errors).toEqual([]);
});

test('Q4: Minimap đóng khi mở, bật / tắt, bấm để nhảy tới; Phân công có dữ liệu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'qt');
  await go(page, `#/quy-trinh/${V2}`);
  const mini = page.locator('.bp-mini');
  await expect(mini).toHaveCount(0);
  await page.locator('[data-bpz="mini"]').click();
  await expect(mini).toBeVisible();
  const root = page.locator('.bp-root');
  const before = await root.getAttribute('transform');
  await mini.click({ position: { x: 150, y: 56 } });
  expect(await root.getAttribute('transform')).not.toBe(before);
  await page.locator('[data-bpz="mini"]').click();
  await expect(mini).toHaveCount(0);

  const pick = (id) => page.evaluate(([k, i]) => document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/' + k, id: i } })), [V2, id]);
  const v = (label) => page.locator('.wf-f').filter({ has: page.locator('.k', { hasText: label }) }).locator('.v');
  await pick('Activity_11');
  await expect(v('Người cụ thể')).toHaveText('-');
  await expect(v('Cần vai trò')).toContainText('R-');
  await pick('Activity_1');
  await expect(v('Người cụ thể')).toHaveText('=initiator');
  expect(page.errors).toEqual([]);
});
