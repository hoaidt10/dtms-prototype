// T25 B4: MS23.03 Nghiệm thu + MS23.04 Thanh lý trên HĐ-2026-0052 — ký riêng, ký chung qua G1, G2, G3; ngày thực tế về MS23; hợp đồng Đã thanh lý.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const HD = 'HĐ-2026-0052', NT = 'HSNT-2026-0052', TL = 'HSTL-2026-0052', HREF = '#/hop-dong/' + encodeURIComponent(HD);
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-1\d\d|ngoài BPMN|\[Q\d|\*\*\*\*/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const openPanel = async (page) => { if (!(await page.locator('.demo-panel').count())) await page.locator('#demo').click(); };
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const ok = (page) => page.locator('.vmodal #ok').click();
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const up = (page) => page.locator('[data-req-up]').first().click();
/* Việc của `who` ở bước `n` trên đúng hồ sơ. */
async function openTask(page, who, n, code) {
  await as(page, who);
  const id = await page.evaluate(([w, k, c]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k) && t.caseCode === c).id, [who, n, code]);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}
async function step(page, who, n, code, label, fill) {
  await openTask(page, who, n, code);
  await act(page, label);
  if (fill) await fill();
  await ok(page);
  await done(page);
}
const sign = (page, who, n, code, label = 'Đồng ý và ký') => step(page, who, n, code, label);
const check = (page, key) => page.locator(`[data-ef-chk="${key}"]`).check();
const text = (page, key, v) => page.locator(`[data-ef="${key}"]`).fill(v);
async function pick(page, key, label) { await page.locator(`[data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${label}"]`).click(); }

/* Hợp đồng đã ký, đến hạn nghiệm thu: bấm Tạo hồ sơ ở tab Tiến độ; tới bước 6 với phương án `plan`. */
async function toStep6(page) {
  await fresh(page, '#/viec-cua-toi');
  await openPanel(page);
  await page.locator('[data-demo-set="MS23.03"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await as(page, 'lan');
  await expect(page.locator('[data-hd-newnt]')).toHaveCount(0);
  await as(page, 'phd');
  await expect(page.locator('.main')).toContainText('Luồng con cần khởi tạo');
  await page.locator('[data-hd-newnt="MS23.03"]').click();
  await expect(page).toHaveURL(/ho-so-hd\/HSNT-2026-0052/);
  await goto(page, HREF);
  await expect(page.locator('.vtable tbody tr', { hasText: 'Đã khởi tạo' })).toContainText('MS23.03');
  // Bước 1: Trung tâm Mua sắm, bắt buộc KCS
  await openTask(page, 'lan', 1, NT);
  await up(page);
  await act(page, 'Gửi báo cáo KCS');
  await ok(page);
  await done(page);
  await step(page, 'phd', 3, NT, 'Đủ hồ sơ, KCS đạt');
}

test('Ký riêng: MS23.03 đi hết rồi mới được chuẩn bị thanh lý; hợp đồng Đang thanh lý → Đã thanh lý; ngày thực tế về tab Tiến độ', async ({ page }) => {
  await toStep6(page);
  const main = page.locator('.main');
  await step(page, 'phd', 6, NT, 'Hoàn thiện biên bản', async () => {
    await expect(page.locator('.vmodal')).not.toContainText('Phương án ký đã chốt');
    await text(page, 'tnNoiDung', 'Nghiệm thu tổng thể theo hợp đồng');
    await pick(page, 'tnPhuongAn', 'RIENG');
  });
  // G1: có hồ sơ thanh lý; hợp đồng Đang thanh lý
  await step(page, 'phd', 1, TL, 'Hoàn thành kiểm tra', () => check(page, 'tlDaKiemTra'));
  await goto(page, '#/hop-dong');
  await expect(page.locator('.vtable tbody tr', { hasText: HD })).toContainText('Đang thanh lý');
  // Bước 3 MS23.04 bị chặn khi nghiệm thu chưa xong
  await openTask(page, 'phd', 3, TL);
  expect(await main.innerText()).not.toMatch(BA);
  await act(page, 'Nghiệm thu đã ký xong');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Nghiệm thu chưa ký xong');
  await page.locator('.vmodal [data-close]').first().click();
  // Tuyến ký MS23.03
  for (const [who, n] of [['tphd', 9], ['binh', 10]]) await sign(page, who, n, NT);
  await sign(page, 'vthu', 11, NT, 'Hồ sơ đạt');
  await sign(page, 'tgd', 12, NT);
  await openTask(page, 'phd', 13, NT);
  await up(page);
  await act(page, 'Cập nhật biên bản đã ký');
  await check(page, 'tnNccKy');
  await page.locator('[data-ef="tnNgay"]').fill('30/05/2027');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  // Về tab Bàn giao & nghiệm thu; ngày thật về tab Tiến độ
  await expect(main).toContainText('NT-01');
  await expect(main).toContainText('30/05/2027');
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(main).toContainText('AI cập nhật ngày thực tế 30/05/2027: Nghiệm thu tổng thể');
  // Thanh lý riêng: hết chặn
  await step(page, 'phd', 3, TL, 'Nghiệm thu đã ký xong');
  await step(page, 'phd', 4, TL, 'Hoàn thành chuẩn bị');
  await openTask(page, 'phd', 5, TL);
  await up(page);
  await act(page, 'Ghi nhận quyết toán');
  await ok(page);
  await done(page);
  await step(page, 'phd', 7, TL, 'Hoàn thiện biên bản', () => text(page, 'tlNoiDung', 'Thanh lý hợp đồng'));
  for (const [who, n] of [['tphd', 9], ['binh', 10]]) await sign(page, who, n, TL);
  await sign(page, 'vthu', 11, TL, 'Hồ sơ đạt');
  await sign(page, 'tgd', 12, TL);
  await openTask(page, 'phd', 13, TL);
  await up(page);
  await act(page, 'Cập nhật biên bản đã ký');
  await check(page, 'tlNccKy');
  await page.locator('[data-ef="tlNgay"]').fill('15/06/2027');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  // Tab Thanh lý; hợp đồng Đã thanh lý, khoá dữ liệu
  await expect(page.locator('[data-hd-cases]')).toContainText(TL);
  await expect(main).toContainText('Hồ sơ thanh lý');
  await expect(main).toContainText('Đã ký biên bản thanh lý');
  await expect(page.locator('.hd-alert.info')).toContainText('15/06/2027');
  expect(await main.innerText()).not.toMatch(BA);
  await goto(page, '#/hop-dong');
  await expect(page.locator('.vtable tbody tr', { hasText: HD })).toContainText('Đã thanh lý');
  // Chi tiết hồ sơ, BPMN
  await goto(page, '#/ho-so-hd/' + TL);
  await expect(main).toContainText('TL-BB');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-h h2')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Ký chung: chờ G2, một tuyến ký ở MS23.03, G3 về MS23.04; trả về tập hợp lại không chờ G2', async ({ page }) => {
  await toStep6(page);
  const main = page.locator('.main');
  await step(page, 'phd', 6, NT, 'Hoàn thiện biên bản', async () => {
    await text(page, 'tnNoiDung', 'Nghiệm thu tổng thể theo hợp đồng');
    await pick(page, 'tnPhuongAn', 'CHUNG');
  });
  // MS23.03 chờ G2: không có việc, chi tiết hồ sơ nói rõ đang chờ
  await goto(page, '#/ho-so-hd/' + NT);
  await expect(main).toContainText('Chờ biên bản thanh lý hoàn thiện từ MS23.04');
  await step(page, 'phd', 1, TL, 'Hoàn thành kiểm tra', () => check(page, 'tlDaKiemTra'));
  await step(page, 'phd', 2, TL, 'Hoàn thành chuẩn bị');
  await step(page, 'phd', 7, TL, 'Hoàn thiện biên bản', () => text(page, 'tlNoiDung', 'Thanh lý hợp đồng'));
  await goto(page, '#/ho-so-hd/' + TL);
  await expect(main).toContainText('Chờ kết quả ký chung từ MS23.03');
  // G2 mở bước 7 MS23.03
  await step(page, 'phd', 7, NT, 'Tập hợp bộ hồ sơ', () => check(page, 'tnDaTapHop'));
  await openTask(page, 'tphd', 9, NT);
  await act(page, 'Đồng ý và ký');
  await expect(page.locator('.vmodal')).toContainText('Ký chung: hồ sơ gồm biên bản nghiệm thu và biên bản thanh lý');
  await ok(page);
  await done(page);
  await sign(page, 'binh', 10, NT);
  await sign(page, 'vthu', 11, NT, 'Hồ sơ đạt');
  // Tổng Giám đốc trả → sửa ở bước 6 → tập hợp lại ngay
  await openTask(page, 'tgd', 12, NT);
  await act(page, 'Không đồng ý');
  await page.locator('.vmodal textarea').fill('Sửa số liệu');
  await page.locator('.vmodal .vbtn.primary').click();
  await done(page);
  await openTask(page, 'phd', 6, NT);
  await act(page, 'Hoàn thiện biên bản');
  await expect(page.locator('[data-vsel="ef-tnPhuongAn"]')).toHaveCount(0);
  await expect(page.locator('.vmodal')).toContainText('Phương án ký đã chốt');
  await ok(page);
  await done(page);
  await step(page, 'phd', 7, NT, 'Tập hợp bộ hồ sơ', () => check(page, 'tnDaTapHop'));
  for (const [who, n] of [['tphd', 9], ['binh', 10]]) await sign(page, who, n, NT);
  await sign(page, 'vthu', 11, NT, 'Hồ sơ đạt');
  await sign(page, 'tgd', 12, NT);
  // G3
  await openTask(page, 'phd', 13, NT);
  await up(page);
  await act(page, 'Cập nhật biên bản đã ký');
  await check(page, 'tnNccKy');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await openTask(page, 'phd', 13, TL);
  await up(page);
  await act(page, 'Cập nhật biên bản đã ký');
  await check(page, 'tlNccKy');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await goto(page, '#/hop-dong');
  await expect(page.locator('.vtable tbody tr', { hasText: HD })).toContainText('Đã thanh lý');
  expect(await page.evaluate((c) => Flow.caseOf(c).history.some((h) => String(h.task) === '9'), TL)).toBe(false);
  expect(page.errors).toEqual([]);
});

test('Không yêu cầu thanh lý: hợp đồng giữ Đang thực hiện; đợt 2 thanh toán mở sau nghiệm thu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { const b = D.demoSets.find((d) => d.key === 'MS23.03').branches[5]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, { legs: [['MS23.03', 'END', { tnPhuongAn: 'KHONG' }]] }); Flow.setPersona('phd'); HopDong.openTab('HĐ-2026-0052', 'tl'); });
  const main = page.locator('.main');
  await expect(page.locator('[data-hd-cases]')).toContainText('Không thực hiện thanh lý');
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  await expect(main).toContainText('Đang thực hiện');
  await page.locator('.dx-tabs [data-ttab="pay"]').click();
  await page.locator('[data-hd-pay]').click();
  await page.locator('[data-vsel="pay-dot"]').click();
  await expect(page.locator('.vsel-panel [data-opt]', { hasText: 'Thanh toán đợt 2' })).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

test('Hai bộ demo: mọi cảnh và nhánh phụ mở đúng việc, không có chữ BA', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  for (const key of ['MS23.03', 'MS23.04']) {
    const set = await page.evaluate((k) => { const s = D.demoSets.find((d) => d.key === k); return { scenes: s.scenes.map((x) => ({ n: x.n, start: x.start, who: x.who })), branches: s.branches.length }; }, key);
    for (const sc of set.scenes) {
      await page.evaluate(([n, k]) => Flow.jumpToScene(n, k), [sc.n, key]);
      if (sc.start === 'BASE' || sc.start === 'END') continue;
      const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k)).id, [sc.who, sc.start]);
      await goto(page, '#/task/' + id);
      await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
      expect(await page.locator('.main').innerText()).not.toMatch(BA);
    }
    for (let i = 0; i < set.branches; i++) {
      const r = await page.evaluate(([k, x]) => { const b = D.demoSets.find((d) => d.key === k).branches[x]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); return Flow.caseTokens(b.who).find((t) => String(t.task) === String(b.task)).id; }, [key, i]);
      await goto(page, '#/task/' + r);
      await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
      expect(await page.locator('.main').innerText()).not.toMatch(BA);
    }
  }
  // Công cụ demo: bấm cảnh tổng kết mở đúng tab
  await openPanel(page);
  await page.locator('[data-demo-set="MS23.04"]').click();
  await openPanel(page);
  await page.locator('[data-scene="C10"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(page.locator('.dx-tabs [data-ttab="tl"].on')).toBeVisible();
  expect(page.errors).toEqual([]);
});
