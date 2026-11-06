// T25 B5: MS23.01 Văn bản phát sinh trên HĐ-2026-0052 — phụ lục đủ 12 bước qua eForm cập nhật giá trị, ngày hết hạn, mốc; văn bản khác không qua đề xuất; chặn vượt giới hạn.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const HD = 'HĐ-2026-0052', VB = 'HSVB-2026-0052-01', VB2 = 'HSVB-2026-0052-02', HREF = '#/hop-dong/' + encodeURIComponent(HD);
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-1\d\d|ngoài BPMN|\[Q\d|\[\?|\*\*\*\*/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const openPanel = async (page) => { if (!(await page.locator('.demo-panel').count())) await page.locator('#demo').click(); };
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const ok = (page) => page.locator('.vmodal #ok').click();
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const up = (page) => page.locator('[data-req-up]').first().click();
const text = (page, key, v) => page.locator(`[data-ef="${key}"]`).fill(v);
async function pick(page, key, label) { await page.locator(`[data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${label}"]`).click(); }
async function openTask(page, who, n, code = VB) {
  await as(page, who);
  const id = await page.evaluate(([w, k, c]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k) && t.caseCode === c).id, [who, n, code]);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}
async function step(page, who, n, label, fill, code = VB) {
  await openTask(page, who, n, code);
  await act(page, label);
  if (fill) await fill();
  await ok(page);
  await done(page);
}
/* Hợp đồng đã ký, có dòng Luồng con cần khởi tạo. */
async function toSigned(page) {
  await fresh(page, '#/viec-cua-toi');
  await openPanel(page);
  await page.locator('[data-demo-set="MS23.01"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
}
const tabVb = (page) => page.locator('.dx-tabs [data-ttab="vb"]').click();
/* Bước 1: chọn loại, nhập nội dung, bắt buộc căn cứ. */
async function step1(page, loai, noiDung, code = VB) {
  await openTask(page, 'phd', 1, code);
  await up(page);
  await act(page, 'Hoàn thành lập thông tin');
  await pick(page, 'vbLoai', loai);
  await text(page, 'vbNoiDung', noiDung);
  await ok(page);
  await done(page);
}

test('Phụ lục đủ 12 bước qua eForm: chặn vượt giới hạn; xong thì giá trị, ngày hết hạn, mốc, tab Văn bản phát sinh đều đổi', async ({ page }) => {
  await toSigned(page);
  const main = page.locator('.main');
  // Dòng Luồng con cần khởi tạo có Tạo hồ sơ; chỉ Phòng Hợp đồng
  await as(page, 'lan');
  await expect(page.locator('[data-hd-newnt="MS23.01"]')).toHaveCount(0);
  await as(page, 'phd');
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(main).toContainText('Luồng con cần khởi tạo');
  const end0 = await page.evaluate((h) => HopDong.find(h).end, HD);
  const plan0 = await page.evaluate(() => Flow.caseOf('HSTD-2026-0052').vars.track.ms[0].plan);
  await page.locator('.vtable [data-hd-newnt="MS23.01"]').click();
  await expect(page).toHaveURL(/ho-so-hd\/HSVB-2026-0052-01/);
  await goto(page, HREF);
  await expect(page.locator('.vtable tbody tr', { hasText: 'Văn bản phát sinh' }).first()).toContainText('Đã khởi tạo');
  // Bước 1 thiếu căn cứ bị chặn
  await openTask(page, 'phd', 1);
  expect(await main.innerText()).not.toMatch(BA);
  await act(page, 'Hoàn thành lập thông tin');
  await pick(page, 'vbLoai', 'Phụ lục hợp đồng');
  await text(page, 'vbNoiDung', 'Bổ sung khối lượng lắp đặt, gia hạn');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Căn cứ, hồ sơ liên quan');
  await page.locator('.vmodal [data-close]').first().click();
  await step1(page, 'Phụ lục hợp đồng', 'Bổ sung khối lượng lắp đặt, gia hạn');
  // Bước 2: vượt giới hạn 195 tỷ bị chặn
  await openTask(page, 'phd', 2);
  await act(page, 'Trình đề xuất sửa đổi');
  await page.locator('[data-ef-chk="vbDuocPhep"]').check();
  await text(page, 'vbThongNhat', 'Bổ sung khối lượng lắp đặt, gia hạn 30 ngày');
  await text(page, 'vbGiaTri', '10');
  await text(page, 'vbGiaHan', '30');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('vượt giới hạn');
  await text(page, 'vbGiaTri', '2.5');
  await ok(page);
  await done(page);
  // Bước 3: Tổng Giám đốc thấy giá trị sau điều chỉnh
  await openTask(page, 'tgd', 3);
  await act(page, 'Duyệt đề xuất');
  await expect(page.locator('.vmodal')).toContainText('193,7');
  await ok(page);
  await done(page);
  // Bước 6, 8, 9, 10
  await step(page, 'phd', 6, 'Hoàn thiện văn bản');
  await step(page, 'tphd', 8, 'Phê duyệt để trình ký');
  await step(page, 'phd', 9, 'Trình ký');
  await openTask(page, 'tgd', 10);
  expect(await main.innerText()).not.toMatch(BA);
  await act(page, 'Đồng ý và ký');
  await expect(page.locator('.vmodal')).toContainText('VContract');
  await ok(page);
  await done(page);
  // Giá trị chưa đổi trước bước 12
  expect(await page.evaluate((h) => HopDong.find(h).value, HD)).toBe(191.2);
  // Bước 11: bắt buộc bản ký
  await openTask(page, 'phd', 11);
  await up(page);
  await act(page, 'Cập nhật và gửi lại');
  await text(page, 'vbSo', 'PL01/052/2026/HĐMB-VHT');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  // Tab Văn bản phát sinh: bản đã ký, so sánh trước / sau
  await expect(page.locator('[data-hd-cases]')).toContainText(VB);
  await expect(page.locator('[data-hd-cases]')).toContainText('Hoàn thành');
  await expect(main).toContainText('PL01/052/2026/HĐMB-VHT');
  await expect(main).toContainText('+2,5');
  await expect(main).toContainText('So sánh trước / sau điều chỉnh');
  await expect(main).toContainText('193,70 tỷ đồng');
  expect(await main.innerText()).not.toMatch(BA);
  const h = await page.evaluate((c) => { const x = HopDong.find(c); return { value: x.value, value0: x.value0, end: x.end, end0: x.end0, plan: Flow.caseOf('HSTD-2026-0052').vars.track.ms[0].plan }; }, HD);
  expect(h.value).toBe(193.7);
  expect(h.value0).toBe(191.2);
  expect(h.end0).toBe(end0);
  expect(h.end).not.toBe(end0);
  expect(h.plan).not.toBe(plan0);
  // Tab Thông tin chung, Hạng mục, Tiến độ
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  await expect(main).toContainText('Giá trị ban đầu (trước phụ lục)');
  await page.locator('.dx-tabs [data-ttab="hm"]').click();
  await expect(main).toContainText('Khớp giá trị hợp đồng');
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(main).toContainText('AI cập nhật tiến độ có hiệu lực');
  // Chi tiết hồ sơ, BPMN
  await goto(page, '#/ho-so-hd/' + VB);
  await expect(main).toContainText('VB-TTR');
  await expect(main).toContainText('VB-DT');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-h h2')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Văn bản khác: tạo từ tab Văn bản phát sinh, nhiều hồ sơ; biên bản làm việc không đổi hợp đồng; biên bản phạt vào Phạt / bồi thường', async ({ page }) => {
  await toSigned(page);
  const main = page.locator('.main');
  await as(page, 'phd');
  await tabVb(page);
  await expect(page.locator('[data-hd-annex]')).toHaveCount(0);
  await page.locator('[data-hd-cases] [data-hd-newnt="MS23.01"]').click();
  await expect(page).toHaveURL(/ho-so-hd\/HSVB-2026-0052-01/);
  await goto(page, HREF);
  await page.locator('[data-hd-cases] [data-hd-newnt="MS23.01"]').click();
  await expect(page).toHaveURL(/ho-so-hd\/HSVB-2026-0052-02/);
  await goto(page, HREF);
  await expect(page.locator('[data-hd-cases] tbody tr')).toHaveCount(2);
  // Dòng cần khởi tạo vẫn chờ: hồ sơ tạo từ tab không gắn dòng này
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(page.locator('.vtable tbody tr', { hasText: 'Có phát sinh cần lập văn bản' }).first()).toContainText('Chờ khởi tạo');
  // Biên bản làm việc: bước 1 → 6, không có việc bước 2
  await step1(page, 'Biên bản làm việc', 'Làm việc với nhà thầu về chậm giao');
  expect(await page.evaluate((c) => Flow.caseOf(c).tokens.map((t) => String(t.task)), VB)).toEqual(['6']);
  await step(page, 'phd', 6, 'Hoàn thiện văn bản');
  await step(page, 'tphd', 8, 'Phê duyệt để trình ký');
  await step(page, 'phd', 9, 'Trình ký');
  await step(page, 'tgd', 10, 'Đồng ý và ký');
  await openTask(page, 'phd', 11);
  await up(page);
  await act(page, 'Cập nhật và gửi lại');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(main).toContainText('Biên bản làm việc');
  await expect(main).not.toContainText('So sánh trước / sau điều chỉnh');
  expect(await page.evaluate((c) => HopDong.find(c).value, HD)).toBe(191.2);
  // Biên bản phạt: bắt buộc giá trị phạt
  await step1(page, 'Biên bản phạt', 'Phạt chậm giao đợt 1', VB2);
  await openTask(page, 'phd', 6, VB2);
  await act(page, 'Hoàn thiện văn bản');
  await text(page, 'vbGiaPhat', '0.5');
  await ok(page);
  await done(page);
  await step(page, 'tphd', 8, 'Phê duyệt để trình ký', null, VB2);
  await step(page, 'phd', 9, 'Trình ký', null, VB2);
  await step(page, 'tgd', 10, 'Đồng ý và ký', null, VB2);
  await openTask(page, 'phd', 11, VB2);
  await up(page);
  await act(page, 'Cập nhật và gửi lại');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(main).toContainText('-0,5');
  await page.locator('.dx-tabs [data-ttab="pay"]').click();
  await expect(main).toContainText('Phạt / bồi thường');
  await expect(main).toContainText('Phạt chậm giao đợt 1');
  expect(await page.evaluate((c) => HopDong.find(c).value, HD)).toBe(191.2);
  expect(page.errors).toEqual([]);
});

test('Trả về và cảnh báo: Tổng Giám đốc không ký về bước 9; AI cảnh báo hiện ở bước 8, không chặn', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const set = await page.evaluate(() => D.demoSets.find((d) => d.key === 'MS23.01').branches.map((b) => b.name));
  const go = (i) => page.evaluate((k) => { const b = D.demoSets.find((d) => d.key === 'MS23.01').branches[k]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); }, i);
  await go(set.findIndex((x) => /AI cảnh báo/.test(x)));
  await openTask(page, 'tphd', 8);
  await act(page, 'Phê duyệt để trình ký');
  await expect(page.locator('.vmodal')).toContainText('AI cảnh báo');
  await page.locator('.vmodal [data-close]').first().click();
  await go(set.findIndex((x) => /không ký/.test(x)));
  await openTask(page, 'tgd', 10);
  await act(page, 'Không đồng ý');
  await page.locator('.vmodal textarea').fill('Sửa căn cứ');
  await page.locator('.vmodal .vbtn.primary').click();
  await done(page);
  await openTask(page, 'phd', 9);
  await expect(page.locator('.task-acts [data-act]', { hasText: 'Trình ký' })).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Bộ demo: mọi cảnh và nhánh phụ mở đúng việc, không có chữ BA; hợp đồng mẫu khác giữ Thêm phụ lục', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const set = await page.evaluate(() => { const s = D.demoSets.find((d) => d.key === 'MS23.01'); return { scenes: s.scenes.map((x) => ({ n: x.n, start: x.start, who: x.who })), branches: s.branches.length }; });
  for (const sc of set.scenes) {
    await page.evaluate((n) => Flow.jumpToScene(n, 'MS23.01'), sc.n);
    if (sc.start === 'BASE' || sc.start === 'END') continue;
    const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k)).id, [sc.who, sc.start]);
    await goto(page, '#/task/' + id);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  for (let i = 0; i < set.branches; i++) {
    const r = await page.evaluate((x) => { const b = D.demoSets.find((d) => d.key === 'MS23.01').branches[x]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); return Flow.caseTokens(b.who).find((t) => String(t.task) === String(b.task)).id; }, i);
    await goto(page, '#/task/' + r);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  // Công cụ demo: cảnh tổng kết mở tab Văn bản phát sinh
  await openPanel(page);
  await page.locator('[data-demo-set="MS23.01"]').click();
  await openPanel(page);
  await page.locator('[data-scene="V10"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(page.locator('.dx-tabs [data-ttab="vb"].on')).toBeVisible();
  // Hợp đồng mẫu khác
  await as(page, 'phd');
  await goto(page, '#/hop-dong/' + encodeURIComponent('HĐ-2026-0012'));
  await tabVb(page);
  await expect(page.locator('[data-hd-annex]')).toBeVisible();
  await expect(page.locator('[data-hd-cases]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
