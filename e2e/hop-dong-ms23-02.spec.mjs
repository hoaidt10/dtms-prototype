// T25 B6: MS23.02 Bàn giao trên HĐ-2026-0052 — hồ sơ tự sinh từ thông báo của nhà thầu; hàng hoá đủ 22 bước qua eForm, ngày thực tế về mốc đúng đợt, mở đợt thanh toán; không đạt, thay thế, hạn 7 ngày; hủy, phạt, dịch vụ.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const HD = 'HĐ-2026-0052', BG = 'HSBG-2026-0052-01', HREF = '#/hop-dong/' + encodeURIComponent(HD);
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-1\d\d|ngoài BPMN|\[Q\d|\[\?|\*\*\*\*/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const openPanel = async (page) => { if (!(await page.locator('.demo-panel').count())) await page.locator('#demo').click(); };
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const ok = (page) => page.locator('.vmodal #ok').click();
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const up = (page) => page.locator('[data-req-up]').first().click();
const text = (page, key, v) => page.locator(`[data-ef="${key}"]`).fill(v);
const check = (page, key) => page.locator(`[data-ef-chk="${key}"]`).check();
async function pick(page, key, label) { await page.locator(`[data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${label}"]`).click(); }
async function openTask(page, who, n, code = BG) {
  await as(page, who);
  const id = await page.evaluate(([w, k, c]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k) && t.caseCode === c).id, [who, n, code]);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}
async function step(page, who, n, label, fill, code = BG) {
  await openTask(page, who, n, code);
  await act(page, label);
  if (fill) await fill();
  await ok(page);
  await done(page);
}
const reason = async (page, who, n, label) => {
  await openTask(page, who, n);
  await act(page, label);
  await page.locator('.vmodal textarea').fill('Theo kết quả kiểm tra');
  await page.locator('.vmodal .vbtn.primary').click();
  await done(page);
};
const row = (page, name) => page.locator('.vtable tbody tr', { hasText: name }).first();
const branch = (page, re) => page.evaluate((src) => { const b = D.demoSets.find((d) => d.key === 'MS23.02').branches.find((x) => new RegExp(src).test(x.name)); Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); }, re);

/* Ghi nhận thông báo của nhà thầu ở MS23 bước 3: sinh hồ sơ bàn giao của đợt. */
async function toCase(page) {
  await fresh(page, '#/viec-cua-toi');
  await openPanel(page);
  await page.locator('[data-demo-set="MS23.02"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await as(page, 'phd');
  await page.locator('.dx-tabs [data-ttab="bg"]').click();
  await expect(page.locator('[data-hd-newnt="MS23.02"]')).toHaveCount(0);
  await openTask(page, 'phd', 3, 'HSTD-2026-0052');
  await up(page);
  await act(page, 'Hoàn thành ghi nhận');
  await ok(page);
  await done(page);
}

test('Hàng hoá đủ 22 bước qua eForm: hồ sơ tự sinh; đợt đang bàn giao; HOC đã ký cập nhật mốc, mở đợt thanh toán', async ({ page }) => {
  await toCase(page);
  const main = page.locator('.main');
  await goto(page, HREF);
  await page.locator('.dx-tabs [data-ttab="bg"]').click();
  await expect(page.locator('[data-hd-cases]')).toContainText(BG);
  await expect(row(page, 'BG-01')).toContainText('Đang bàn giao');
  expect(await main.innerText()).not.toMatch(BA);
  // Việc thứ hai trong Việc của tôi của Phòng Hợp đồng
  await step(page, 'phd', 1, 'Hoàn thành tiếp nhận', () => pick(page, 'bgLoai', 'Hàng hoá'));
  await step(page, 'phd', 2, 'Gửi thông báo giao hàng', () => text(page, 'bgThongBao', 'Chuẩn bị tiếp nhận đợt 1'));
  // Bước 3 bắt buộc hồ sơ kho
  await openTask(page, 'qlts', 3);
  expect(await main.innerText()).not.toMatch(BA);
  await act(page, 'Ghi nhận giao nhận');
  await text(page, 'bgPhieuKho', 'PNK-0091');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Hồ sơ giao nhận, hồ sơ kho');
  await page.locator('.vmodal [data-close]').first().click();
  await up(page);
  await act(page, 'Ghi nhận giao nhận');
  await text(page, 'bgPhieuKho', 'PNK-0091');
  await ok(page);
  await done(page);
  await step(page, 'qlts', 5, 'Gửi yêu cầu kiểm tra');
  await openTask(page, 'dvsd', 6);
  await up(page);
  await page.locator('.task-acts [data-act][data-choice="0"]').click();
  await text(page, 'bgKetQua', 'Đạt yêu cầu kỹ thuật');
  await ok(page);
  await done(page);
  await step(page, 'phd', 14, 'Đủ hàng', () => check(page, 'bgDuHoSo'));
  await step(page, 'phd', 18, 'Hoàn thiện HOC');
  await step(page, 'tphd', 20, 'Phê duyệt để trình ký');
  await openTask(page, 'phd', 21);
  await up(page);
  await act(page, 'Cập nhật HOC đã ký');
  await page.locator('[data-ef="bgNgay"]').fill('05/02/2027');
  await check(page, 'bgDuChuKy');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  // Về tab Bàn giao: ngày thực tế, KCS đạt
  await expect(row(page, 'BG-01')).toContainText('05/02/2027');
  await expect(row(page, 'BG-01')).toContainText('Đạt');
  await expect(page.locator('[data-hd-cases]')).toContainText('Hoàn thành');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(main).toContainText('AI cập nhật ngày thực tế 05/02/2027');
  // Đợt thanh toán 1 mở theo bàn giao thật
  await page.locator('.dx-tabs [data-ttab="pay"]').click();
  await page.locator('[data-hd-pay]').click();
  await page.locator('[data-vsel="pay-dot"]').click();
  await expect(page.locator('.vsel-panel [data-opt]', { hasText: 'Thanh toán đợt 1' })).toHaveCount(1);
  await page.locator('.vsel-panel [data-opt]').first().click();
  await page.locator('.vmodal [data-close]').first().click();
  // Chi tiết hồ sơ, BPMN
  await goto(page, '#/ho-so-hd/' + BG);
  await expect(main).toContainText('BG-TB');
  await expect(main).toContainText('BG-HOC');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-h h2')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Không đạt, thay thế: chặn ngày giao sau hạn 7 ngày; trong hạn thì làm lại giao nhận; lần hai không đạt sang quyền từ chối', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await branch(page, 'Kết quả không đạt lần đầu');
  await openTask(page, 'dvsd', 6);
  await up(page);
  await reason(page, 'dvsd', 6, 'Không đạt');
  await step(page, 'qlts', 7, 'Cho bổ sung', () => text(page, 'bgKhongDat', 'Lò hàn sai cấu hình'));
  const han = await page.evaluate((c) => Flow.caseOf(c).vars.bgHan, BG);
  await openTask(page, 'qlts', 8);
  await act(page, 'Có hàng trong hạn');
  await expect(page.locator('.vmodal')).toContainText(han);
  await page.locator('[data-ef="bgNgayBs"]').fill('31/12/2099');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('sau hạn');
  await page.locator('[data-ef="bgNgayBs"]').fill(han);
  await ok(page);
  await done(page);
  // Làm lại giao nhận, form báo hàng thay thế
  await openTask(page, 'qlts', 3);
  await up(page);
  await act(page, 'Ghi nhận giao nhận');
  await expect(page.locator('.vmodal')).toContainText('Hàng bổ sung, thay thế');
  await text(page, 'bgPhieuKho', 'PNK-0092');
  await ok(page);
  await done(page);
  await step(page, 'qlts', 5, 'Gửi yêu cầu kiểm tra');
  await reason(page, 'dvsd', 6, 'Không đạt');
  await openTask(page, 'qlts', 9);
  expect(await page.locator('.main').innerText()).not.toMatch(BA);
  await act(page, 'Ghi nhận quyền từ chối');
  await text(page, 'bgTuChoi', 'Thay thế vẫn không đạt');
  await ok(page);
  await done(page);
  expect(page.errors).toEqual([]);
});

test('Ba hướng xử lý và dịch vụ: bảng đợt hiện đúng trạng thái; hủy toàn bộ làm hợp đồng Chấm dứt', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const main = page.locator('.main');
  // Xin ý kiến: chờ
  await branch(page, 'Xin ý kiến');
  await step(page, 'phd', 13, 'Trình xin ý kiến', () => text(page, 'bgVuongMac', 'Nhà sản xuất ngừng dòng máy'));
  await goto(page, HREF);
  await page.locator('.dx-tabs [data-ttab="bg"]').click();
  await expect(row(page, 'BG-01')).toContainText('Chờ ý kiến chỉ đạo');
  // Phạt: mở MS23.01, chờ
  await branch(page, 'Xử lý vi phạm');
  await step(page, 'phd', 11, 'Chuyển xử lý vi phạm', () => text(page, 'bgViPham', 'Chậm giao, chất lượng không đạt'));
  await goto(page, HREF);
  await expect(row(page, 'BG-01')).toContainText('Chuyển MS23.01');
  await openTask(page, 'phd', 1, 'HSVB-2026-0052-01');
  await act(page, 'Hoàn thành lập thông tin');
  await expect(page.locator('.vmodal .vsel, .vmodal [data-vsel="ef-vbLoai"]').first()).toContainText('Biên bản phạt');
  await page.locator('.vmodal [data-close]').first().click();
  // Hủy toàn bộ
  await branch(page, 'Thủ tục hủy');
  await openTask(page, 'phd', 12);
  await act(page, 'Hoàn tất thủ tục hủy');
  await pick(page, 'bgPhamVi', 'Toàn bộ hợp đồng');
  await text(page, 'bgLyDoHuy', 'Không hoàn thành mục tiêu mua sắm');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(page.locator('.toast').last()).toContainText('hủy toàn bộ hợp đồng');
  await expect(row(page, 'BG-01')).toContainText('Đã hủy');
  await goto(page, '#/hop-dong');
  await expect(page.locator('.vtable tbody tr', { hasText: HD })).toContainText('Chấm dứt');
  // Dịch vụ: dòng cần khởi tạo MS23.03, nhánh KCS dịch vụ
  await branch(page, 'Dịch vụ');
  await openTask(page, 'dvsd', 4);
  await up(page);
  await act(page, 'Xác nhận thực hiện dịch vụ');
  await text(page, 'bgDichVu', 'Hoàn thành lắp đặt');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(row(page, 'BG-01')).toContainText('Đã chuyển nghiệm thu');
  await as(page, 'phd');
  await page.locator('.dx-tabs [data-ttab="td"]').click();
  await expect(row(page, 'Có hồ sơ dịch vụ cần nghiệm thu')).toContainText('Chờ khởi tạo');
  await row(page, 'Có hồ sơ dịch vụ cần nghiệm thu').locator('[data-hd-newnt]').click();
  await expect(page).toHaveURL(/ho-so-hd\/HSNT-2026-0052/);
  expect(await page.evaluate(() => Flow.caseOf('HSNT-2026-0052').tokens.map((t) => [String(t.task), t.who]))).toEqual([['2', 'dvsd']]);
  await expect(main).not.toContainText('undefined');
  expect(page.errors).toEqual([]);
});

test('Bộ demo: mọi cảnh và nhánh phụ mở đúng việc, không có chữ BA; không còn nút giả lập biên bản bàn giao', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const set = await page.evaluate(() => { const s = D.demoSets.find((d) => d.key === 'MS23.02'); return { scenes: s.scenes.map((x) => ({ n: x.n, start: x.start, who: x.who })), branches: s.branches.length }; });
  for (const sc of set.scenes) {
    await page.evaluate((n) => Flow.jumpToScene(n, 'MS23.02'), sc.n);
    if (sc.start === 'BASE' || sc.start === 'END') continue;
    const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k) && t.caseCode === 'HSBG-2026-0052-01').id, [sc.who, sc.start]);
    await goto(page, '#/task/' + id);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  for (let i = 0; i < set.branches; i++) {
    const r = await page.evaluate((x) => { const b = D.demoSets.find((d) => d.key === 'MS23.02').branches[x]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); return Flow.caseTokens(b.who).find((t) => String(t.task) === String(b.task) && t.caseCode === 'HSBG-2026-0052-01').id; }, i);
    await goto(page, '#/task/' + r);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  // Công cụ demo
  await openPanel(page);
  await page.locator('[data-demo-set="MS23"]').click();
  await openPanel(page);
  await expect(page.locator('[data-hd-event]', { hasText: 'biên bản bàn giao' })).toHaveCount(0);
  await page.locator('[data-demo-set="MS23.02"]').click();
  await openPanel(page);
  await page.locator('[data-scene="G11"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(page.locator('.dx-tabs [data-ttab="bg"].on')).toBeVisible();
  expect(page.errors).toEqual([]);
});
