// @ts-check
// Góp ý 26/11 (hoaidt10): bỏ nhãn trạng thái ở từng bước của tab Kế hoạch; bỏ công việc con của nhiệm vụ đơn vị;
// chia công việc con từ việc ở Việc của tôi (user task Camunda) — % việc cha theo công việc con, xong hết thì hoàn thành việc cha.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const CASE = 'HSBT-BT-2026-002-01';
const taskRow = (page) => page.locator('[data-sx-tasks] tbody tr.sxv-todo', { hasText: 'Triển khai theo loại' });
/* Người thực hiện cập nhật 100% công việc con ở chi tiết việc cá nhân. */
async function finish(page, pid, code) {
  await as(page, pid, '#/sx/cong-viec/' + code);
  await page.locator('[data-sxcv-upd]').click();
  await page.locator('#cvu-pct').fill('100');
  await page.locator('#cvu-ok').click();
}

test('Kế hoạch không còn nhãn trạng thái ở từng bước; nhiệm vụ đơn vị không còn công việc con', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001/ke-hoach');
  await expect(page.locator('[data-sx-plan]')).toBeVisible();
  await expect(page.locator('[data-sx-plan]')).not.toContainText('Chờ duyệt điều chỉnh');
  await as(page, 'sxpm', '#/sx/cong-viec/NV-SX-2026-001');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('60%');
  await expect(page.locator('[data-sxcv-upd]')).toHaveCount(1); // % nhiệm vụ cập nhật tay
  await expect(page.locator('[data-sxcv-detail]')).not.toContainText('Thêm công việc con');
  await expect(page.locator('.tab', { hasText: 'Công việc con' })).toHaveCount(0);
  await as(page, 'sxpm', '#/sx/cong-viec/create/DV');
  await expect(page.locator('[data-vsel="cvf-parent"]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Chia công việc con (người cùng đơn vị); còn việc con thì không gửi được; xong hết → việc cha tự hoàn thành; PM, lãnh đạo cấp cao theo dõi', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxrd', '#/sx/viec-cua-toi');
  await expect(taskRow(page)).toContainText('Công việc con 1/3 · 53%');
  // Icon Chia công việc con trong dòng không mở màn Xử lý.
  await taskRow(page).locator('[data-sx-split]').click();
  await expect(page.locator('[data-sxcv-split]')).toContainText('Công việc con đã chia (3)');
  // Chỉ người cùng đơn vị (Trung tâm Nghiên cứu thiết kế — Khối 1); bước một kết quả → không có ô chọn kết quả.
  expect(await page.locator('[data-sub-row="0"] [data-f="owner"] option').evaluateAll((l) => l.map((o) => o.value).sort())).toEqual(['sxgdtt', 'sxrd', 'sxrdck', 'sxrddk']);
  await expect(page.locator('[data-sub-res]')).toHaveCount(0);
  await page.locator('[data-sub-add]').click();
  await expect(page.locator('[data-sub-row]')).toHaveCount(2);
  await page.locator('[data-sub-del="1"]').click();
  await page.locator('[data-sub-ok]').click();
  await expect(page.locator('[data-sub-err]')).toContainText('Dòng 1: Bạn cần nhập Tên công việc.');
  const today = await page.evaluate(() => D.sxToday);
  await page.locator('[data-sub-row="0"] [data-f="title"]').fill('Cập nhật bản vẽ gá đỡ rev B lên VMMS');
  await page.locator('[data-sub-row="0"] [data-f="due"]').fill(today);
  await page.locator('[data-sub-ok]').click();
  await expect(page.locator('.toast').last()).toContainText('Đã chia 1 công việc con');
  await expect(taskRow(page)).toContainText('Công việc con 1/4');
  // Màn Xử lý: thẻ Công việc con; gửi khi còn việc con thì bị chặn.
  await taskRow(page).locator('a.link').last().click();
  await expect(page.locator('[data-sx-subs] tbody tr')).toHaveCount(4);
  await page.locator('[data-sx-do]', { hasText: 'Hoàn thành triển khai' }).click();
  await expect(page.locator('.toast').last()).toContainText('Còn 3 / 4 công việc con chưa hoàn thành');
  await expect(page.locator('.vmodal')).toHaveCount(0);
  // Người theo dõi: PM dự án và lãnh đạo cấp cao (Tổng Giám đốc) thấy công việc con; người ngoài (Sub PM) không thấy.
  for (const who of ['sxpm', 'sxceo']) {
    await as(page, who, '#/sx/cong-viec/ca-nhan');
    await expect(page.locator('.vtable tbody tr', { hasText: 'CV-SX-2026-008' })).toContainText('Triển khai theo loại');
  }
  await as(page, 'sxsub', '#/sx/cong-viec/ca-nhan');
  await expect(page.locator('.vtable tbody tr', { hasText: 'CV-SX-2026-008' })).toHaveCount(0);
  // Hoàn thành mọi công việc con → việc cha tự hoàn thành (Kết quả triển khai bắt buộc điền tổng hợp công việc con), chuyển bước 6.
  await finish(page, 'sxrdck', 'CV-SX-2026-007');
  await finish(page, 'sxrddk', 'CV-SX-2026-008');
  const mine = await page.evaluate(() => SxCv.all().find((x) => x.src === 'UT' && x.owner === 'sxrd' && x.pct === 0).code);
  await finish(page, 'sxrd', mine);
  await expect(page.locator('.toast').last()).toContainText('hệ thống tự hoàn thành việc cha');
  const c = await page.evaluate((code) => { const x = SxFlow.caseOf(code); return { tok: x.tokens.map((t) => [t.step, t.who]), v: x.vars.tkKetQua, h: x.hist.filter((y) => y.step === 5).pop() }; }, CASE);
  expect(c.tok).toEqual([[6, 'sxqa']]);
  expect(c.v).toContain('Hoàn thành 4 công việc con: Phân tích nguyên nhân lệch trục');
  expect(c.h.who).toBe('sxrd');
  expect(c.h.act).toBe('Hoàn thành triển khai (tự động)');
  await as(page, 'sxrd', '#/sx/viec-cua-toi');
  await expect(taskRow(page)).toHaveCount(0);
  expect(page.errors).toEqual([]);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
});

test('Bước nhiều kết quả: chọn kết quả khi chia việc → xong hết công việc con thì tự áp kết quả đó', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  // Kỹ sư QA: việc Kiểm tra kết quả (Đạt / Không đạt) của BT-2026-003.
  await as(page, 'sxqa', '#/sx/viec-cua-toi');
  const row = page.locator('[data-sx-tasks] tbody tr.sxv-todo', { hasText: 'Kiểm tra kết quả' }).first();
  await row.locator('[data-sx-split]').click();
  expect(await page.locator('[data-sub-res] option').allTextContents()).toEqual(['Đạt (OK)']); // không có nút Không đạt
  const today = await page.evaluate(() => D.sxToday);
  await page.locator('[data-sub-row="0"] [data-f="title"]').fill('Đo lại 5 mẫu sau khắc phục');
  await page.locator('[data-sub-row="0"] [data-f="due"]').fill(today);
  await page.locator('[data-sub-ok]').click();
  const code = await page.evaluate(() => SxCv.all().find((x) => x.title === 'Đo lại 5 mẫu sau khắc phục').code);
  await finish(page, 'sxqa', code);
  await expect(page.locator('.toast').last()).toContainText('hệ thống tự hoàn thành việc cha');
  const c = await page.evaluate(() => { const x = SxFlow.caseOf('HSBT-BT-2026-003-01'); return { tok: x.tokens.map((t) => t.step), h: x.hist.filter((y) => y.step === 6).pop() }; });
  expect(c.tok).toEqual([7]);
  expect(c.h.act).toBe('Đạt (OK) (tự động)');
  expect(page.errors).toEqual([]);
});

test('Trả lại / từ chối việc còn công việc con: xác nhận, công việc con chưa xong chuyển Đã huỷ', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  // Việc Tiếp nhận của PM (BT-2026-004, có nút Trả lại người lập) — chia 1 công việc con.
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  const row = page.locator('[data-sx-tasks] tbody tr.sxv-todo', { hasText: 'Tiếp nhận' }).first();
  await row.locator('[data-sx-split]').click();
  const today = await page.evaluate(() => D.sxToday);
  await page.locator('[data-sub-row="0"] [data-f="title"]').fill('Xác minh CO lô 2 với nhà cung cấp');
  await page.locator('[data-sub-row="0"] [data-f="due"]').fill(today);
  await page.locator('[data-sub-ok]').click();
  await row.locator('a.link').last().click();
  await page.locator('[data-sx-do]', { hasText: 'Trả lại người lập' }).click();
  await expect(page.locator('.vconfirm')).toContainText('1 công việc con chưa hoàn thành sẽ chuyển Đã huỷ');
  await page.locator('#cf-ok').click();
  await page.locator('.vmodal [data-ef="blLyDoTra"]').fill('Bổ sung CO lô 2.');
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  const st = await page.evaluate(() => SxCv.all().filter((x) => x.src === 'UT' && x.title.startsWith('Xác minh CO')).map((x) => SxCv.stOf(x)[0]));
  expect(st).toEqual(['Đã huỷ']);
  expect(page.errors).toEqual([]);
});
