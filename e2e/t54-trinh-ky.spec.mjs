// T54 — Trình ký VOffice theo SRS 32 (hộp thoại 0271, màn Trình ký 0274, thao tác 0273). Plan docs/dtms/prototype-T54-trinh-ky-voffice.md.
import { test, expect } from '@playwright/test';
import { fresh, lastToast, createDxms } from './helpers.mjs';

async function jump(page, task, vars = {}, proc = 'MS01.01') {
  return page.evaluate(([t, v, p]) => {
    Flow.jumpTo(t, 'minh', v, p, undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
    return k.id;
  }, [task, vars, proc]);
}
/* Bấm nút chính của bước, xác nhận eForm nếu có, chờ hộp thoại Trình ký VOffice. */
async function openSign(page) {
  await page.locator('.task-acts [data-act].primary').click();
  const ef = page.locator('.vmodal.ef');
  if (await ef.count()) await ef.locator('#ok').click();
  await expect(page.locator('.tk-dlg')).toBeVisible();
  return page.locator('.overlay').last();
}

test('0271: bước 60 BM-08 — gợi ý theo cấu hình, khóa trước khi kết nối, người ký mẫu không trùng, dòng Tổng Giám đốc khóa', async ({ page }) => {
  await fresh(page);
  await jump(page, 60);
  const dlg = await openSign(page);
  await expect(dlg.locator('.vmodal-h h3')).toContainText('Trình ký VOffice — BM-08');
  await expect(dlg.locator('[data-tk-info="title"]')).toHaveValue(/Quyết định phê duyệt đề xuất mua sắm/);
  await expect(dlg.locator('[data-tk-info="symbol"]')).toHaveValue('QĐ');
  // Người soạn thảo (58) và Người trình duyệt (59) cùng một chuyên viên TTMS → một dòng; dòng Tổng Giám đốc khóa.
  await expect(dlg.locator('[data-tk-row]')).toHaveCount(2);
  await expect(dlg.locator('[data-tk-row="1"] [data-tk-pos="1"]')).toHaveValue('TỔNG GIÁM ĐỐC');
  await expect(dlg.locator('[data-tk-row="1"] [data-tk="del"]')).toHaveCount(0);
  await expect(dlg.locator('[data-tk-row="0"] [data-tk="del"]')).toHaveCount(1);
  await expect(dlg.locator('.tk-off').first()).toBeVisible();
  // Sai mật khẩu → toast lỗi.
  await dlg.locator('#tk-pw').fill('sai');
  await dlg.locator('#tk-pw').press('Enter');
  expect(await lastToast(page)).toContain('Tài khoản hoặc mật khẩu chưa đúng');
  await dlg.locator('#tk-pw').fill('Vht@2026');
  await dlg.locator('#tk-pw').press('Enter');
  expect(await lastToast(page)).toContain('Kết nối với hệ thống VOffice thành công');
  await expect(dlg.locator('.tk-off')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('0271: thêm người ký Giữ nhóm / Chèn nhóm, quá số chân ký thì chặn, gửi tạo lần trình Đã ký', async ({ page }) => {
  await fresh(page);
  await jump(page, 60);
  const dlg = await openSign(page);
  await dlg.locator('#tk-pw').fill('Vht@2026');
  await dlg.locator('#tk-pw').press('Enter');
  await dlg.locator('[data-tk-row="0"] [data-tk="add"]').click();
  await page.locator('[data-g="keep"]').click();
  await expect(dlg.locator('[data-tk-row]')).toHaveCount(3);
  await expect(dlg.locator('[data-tk-row="1"] [data-tk-pos="1"]')).toHaveValue('Người phê duyệt');
  // Dòng mới chưa có người ký → chặn.
  await dlg.locator('#go').click();
  expect(await lastToast(page)).toContain('Vui lòng chọn Tên người ký');
  await dlg.locator('[data-tk-row="1"] [data-tk="del"]').click();
  // Bật hiển thị chữ ký ở dòng 1 → 2 chân ký > 1.
  await dlg.locator('[data-tk-show="0"]').check();
  await dlg.locator('#go').click();
  expect(await lastToast(page)).toContain('Văn bản chỉ có 1 vị trí chữ ký');
  await dlg.locator('[data-tk-show="0"]').uncheck();
  await dlg.locator('#go').click();
  await expect(page.locator('.tk-dlg')).toHaveCount(0);
  const r = await page.evaluate(() => TrinhKy.list().slice(-1)[0]);
  expect(r.doc).toBe('BM-08');
  expect(r.st).toBe('SIGNED');
  expect(r.fetched).toBe(false);
  expect(r.signers.map((s) => s.g)).toEqual([1, 2]);
  expect(r.trans).toMatch(/^DTMS-DXMS-.*-60-BM-08-1-[A-Z0-9]{6}$/);
  expect(page.errors).toEqual([]);
});

test('0271: ký ngoài hệ thống — bắt buộc lý do, lần trình Chờ nhập kết quả', async ({ page }) => {
  await fresh(page);
  await jump(page, 43);
  const dlg = await openSign(page);
  await dlg.locator('[data-mode="hard"]').click();
  await expect(dlg.locator('#tk-pw')).toHaveCount(0);
  await dlg.locator('#go').click();
  expect(await lastToast(page)).toContain('Vui lòng nhập Lý do ký ngoài hệ thống');
  await dlg.locator('#hr').fill('VOffice gián đoạn');
  await dlg.locator('#go').click();
  await expect(page.locator('.tk-dlg')).toHaveCount(0);
  const r = await page.evaluate(() => TrinhKy.list().slice(-1)[0]);
  expect([r.method, r.st, r.offReason]).toEqual(['OFFLINE', 'OFFLINE_PENDING', 'VOffice gián đoạn']);
  await expect.poll(() => page.evaluate(() => (Flow.state.vars.hardSigns || []).map((x) => x.reason))).toEqual(['VOffice gián đoạn']);
  expect(page.errors).toEqual([]);
});

test('BM-03 trình ở bước 16.1, bước 18 không tự trình', async ({ page }) => {
  await fresh(page);
  await jump(page, '16.1');
  const dlg = await openSign(page);
  await expect(dlg.locator('.vmodal-h h3')).toContainText('BM-03');
  await expect(dlg.locator('[data-tk-row="0"] [data-tk-pos="0"]')).toHaveValue('THỦ TRƯỞNG ĐƠN VỊ');
  await dlg.locator('#tk-pw').fill('Vht@2026');
  await dlg.locator('#go').click();
  await expect(page.locator('.tk-dlg')).toHaveCount(0);
  const sys = await page.evaluate(() => Flow.state.history.filter((h) => h.signDoc === 'BM-03').length);
  expect(sys).toBe(0);
  expect(await page.evaluate(() => TrinhKy.list().slice(-1)[0].doc)).toBe('BM-03');
  expect(page.errors).toEqual([]);
});

test('0274: màn Trình ký — tab, Thu hồi, Lấy bản đã ký hàng loạt, Chi tiết lần trình', async ({ page }) => {
  await fresh(page);
  await page.evaluate(() => Flow.setPersona('tung'));
  await page.evaluate(() => { location.hash = '#/trinh-ky'; });
  await expect(page.locator('.pg-title')).toContainText('Trình ký');
  await expect(page.locator('.sidebar, nav, aside').first()).toBeVisible();
  // T56 Q3, Q4: một danh sách (không tab); trạng thái theo 5 giá trị VOffice. Đỗ Mạnh Tùng trình 2 lần BM-04 (Đã hủy → Chưa trình ký, Chờ ký → Đang xử lý).
  await expect(page.locator('[data-tk-tab]')).toHaveCount(0);
  const tung = page.locator('[data-tk-id]', { hasText: 'Đỗ Mạnh Tùng' }).filter({ hasText: 'BM-04' });
  await expect(tung).toHaveCount(2);
  const pending = tung.filter({ hasText: 'Đang xử lý' });
  await pending.locator('[data-tk-act="recall"]').click();
  await page.locator('#tk-rc-ok').click();
  expect(await lastToast(page)).toContain('Vui lòng nhập Lý do');
  await page.locator('#tk-rc').fill('Sai người ký');
  await page.locator('#tk-rc-ok').click();
  await expect(tung.filter({ hasText: 'Chưa trình ký' })).toHaveCount(2);
  // Người khác (TGĐ) không thấy nút Thu hồi trên lần trình của Tùng; Tôi trình của TGĐ có lần trình Đã ký đã lấy bản ký.
  await page.evaluate(() => { Flow.setPersona('lan'); App.render(); });
  const signedNotFetched = page.locator('[data-tk-id]', { hasText: 'Chưa lấy' });
  const nf = await signedNotFetched.count();
  expect(nf).toBeGreaterThan(0);
  await signedNotFetched.first().locator('[data-tk-sel]').check();
  await page.locator('[data-tk-bulk="fetch"]').click();
  await page.locator('#tk-pw2').fill('Vht@2026');
  await page.locator('#tk-pw-ok').click();
  await expect(page.locator('[data-tk-id]', { hasText: 'Chưa lấy' })).toHaveCount(nf - 1);
  await page.locator('[data-tk-id]').first().locator('[data-tk-act="view"]').click();
  await expect(page.locator('.vmodal-h h3', { hasText: 'Chi tiết lần trình' })).toBeVisible();
  await expect(page.locator('.vmodal', { hasText: 'Lịch sử cập nhật' })).toContainText('Mã giao dịch'); // T56 #22
  expect(page.errors).toEqual([]);
});

test('03-08: khối Trình ký ở tab Tài liệu & văn bản của ĐXMS — lần trình mới nhất, bấm dòng mở Chi tiết lần trình', async ({ page }) => {
  await fresh(page);
  await jump(page, 60);
  const dlg = await openSign(page);
  await dlg.locator('#tk-pw').fill('Vht@2026');
  await dlg.locator('#go').click();
  await expect(page.locator('.tk-dlg')).toHaveCount(0);
  const code = await page.evaluate(() => Flow.state.dxms);
  await page.evaluate((c) => { location.hash = '#/luong/' + encodeURIComponent(c); }, code);
  await page.locator('[data-ltab="tai-lieu"]').click();
  const blk = page.locator('[data-tkb]');
  await expect(blk.locator('h3')).toHaveText('Trình ký');
  const row = blk.locator('[data-tk-id]', { hasText: 'BM-08' });
  await expect(row).toContainText('Đã ký');
  await expect(row).toContainText('Chưa lấy');
  // Lần trình mẫu của ĐXMS khác không lẫn vào đối tượng đang chạy.
  await expect(blk.locator('[data-tk-id]', { hasText: 'BM-04' })).toHaveCount(0);
  await row.locator('td').nth(1).click();
  await expect(page.locator('.vmodal-h h3', { hasText: 'Chi tiết lần trình' })).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('Q9 A: Hình thức trình ký ĐXMS là VOffice / Ký ngoài hệ thống; giá trị cũ "Bản cứng" đọc thành Ký ngoài hệ thống', async ({ page }) => {
  await fresh(page);
  const code = await createDxms(page);
  await page.evaluate((c) => { Flow.findDxms(c).sign = 'Bản cứng'; }, code);
  await page.evaluate((c) => { location.hash = '#/luong/' + encodeURIComponent(c); }, code);
  await expect(page.locator('.ginfo', { hasText: 'Hình thức trình ký' }).first()).toContainText('Ký ngoài hệ thống');
  await expect(page.locator('#app')).not.toContainText('Bản cứng');
  expect(page.errors).toEqual([]);
});

test('KĐT hồ sơ Mật: bước 47 ký ngoài hệ thống → khối Trình ký Chờ nhập kết quả; bước 78 xong → Đã ký', async ({ page }) => {
  await fresh(page);
  // Như test/flow.test.mjs T18 B3: dựng hồ sơ MS13 Mật ở bước 47.
  await page.evaluate(() => Flow.jumpTo(47, 'lan', null, 'MS13', null, { secret: true }));
  const ok = await page.evaluate(() => !!Flow.state.kdt && Flow.isMat && Flow.isMat());
  test.skip(!ok, 'Không dựng được hồ sơ KĐT Mật bằng jumpTo');
  const id = await page.evaluate(() => { const k = Flow.state.tokens.find((x) => String(x.task) === '47'); Flow.setPersona(k.who); location.hash = '#/task/' + k.id; return k.id; });
  expect(id).toBeTruthy();
  const dlg = await openSign(page);
  await expect(dlg.locator('#tk-pw')).toHaveCount(0);
  await dlg.locator('#go').click();
  await expect(page.locator('.tk-dlg')).toHaveCount(0);
  const kdt = await page.evaluate(() => Flow.state.kdt);
  expect(await page.evaluate((k) => TrinhKy.latest(k).map((r) => r.st), kdt)).toEqual(['OFFLINE_PENDING']);
  // 77 → 78 hoàn thành bằng engine.
  for (const t of ['77', '78']) {
    await page.evaluate((tt) => { const k = Flow.state.tokens.find((x) => String(x.task) === tt); Flow.complete(k.id, Flow.mainChoice(k.task)); }, t);
  }
  expect(await page.evaluate((k) => TrinhKy.latest(k).map((r) => r.st), kdt)).toEqual(['SIGNED']);
  await page.evaluate((k) => { location.hash = '#/kdt/' + encodeURIComponent(k); }, kdt);
  await page.locator('[data-dtab="tai-lieu"]').click(); // 12/11: khối Trình ký ở tab Tài liệu & văn bản
  await expect(page.locator('[data-tkb] [data-tk-id]').first()).toContainText('Đã ký');
  expect(page.errors).toEqual([]);
});

test('0273: Nhập kết quả ký ngoài hệ thống — công việc Nhập kết quả ký (SRS 32 V0.4)', async ({ page }) => {
  await fresh(page);
  await page.evaluate(() => { Flow.setPersona('lan'); location.hash = '#/viec-cua-toi'; });
  await page.locator('tr', { hasText: 'Nhập kết quả ký — BM-09' }).locator('a').first().click();
  await expect(page).toHaveURL(/#\/trinh-ky\/viec\//);
  await expect(page.locator('[data-tk-req]')).toContainText('Ký ngoài hệ thống — Ký tay');
  await page.locator('[data-tkt="result"]').click();
  expect(await lastToast(page)).toContain('Vui lòng tải bản đã ký');
  await page.locator('[data-kq-up="0"]').click();
  await page.locator('#kq-no').fill('15/TTr-TTMS');
  await page.locator('[data-tkt="result"]').click();
  await expect(page.locator('[data-sbar="view"]')).toBeVisible();
  await page.evaluate(() => { location.hash = '#/trinh-ky'; });
  await expect(page.locator('[data-tk-id]', { hasText: '15/TTr-TTMS' })).toContainText('Đã ký duyệt');
  expect(page.errors).toEqual([]);
});

test('T58 / D-112: lần trình Từ chối không có Gửi lại / Coi như Từ chối; Lỗi gửi vẫn Gửi lại', async ({ page }) => {
  await fresh(page);
  // Người trình lần trình Từ chối (ĐXMS-2026-0089, Bình): chỉ Xem.
  await page.evaluate(() => { Flow.setPersona('binh'); location.hash = '#/trinh-ky'; });
  const rej = page.locator('[data-tkl] tr[data-tk-id]', { hasText: 'ĐXMS-2026-0089' });
  await expect(rej).toHaveCount(1);
  await expect(rej.locator('[data-tk-act]')).toHaveCount(1);
  await expect(rej.locator('[data-tk-act="view"]')).toHaveCount(1);
  await expect(rej.locator('[data-tk-act="resend"]')).toHaveCount(0);
  await expect(page.locator('[data-tkl] [title="Coi như Từ chối"]')).toHaveCount(0);
  expect(await page.evaluate(() => TrinhKy.list().filter((r) => r.st === 'REJECTED_SIGN').length)).toBe(1);
  // Lần trình Lỗi gửi (ĐXMS-2026-0124 BM-03, Hải): dòng có Mở công việc → công việc Xử lý trình ký → Gửi lại cùng lần trình → Đã ký.
  await page.evaluate(() => { Flow.setPersona('hai'); App.render(); });
  const fail = page.locator('[data-tkl] tr[data-tk-id]', { hasText: 'BM-03' }).filter({ hasText: 'ĐXMS-2026-0124' });
  await expect(fail.locator('[data-tk-act="resend"]')).toHaveCount(0);
  await fail.locator('[data-tk-act="task"]').click();
  await expect(page.locator('[data-tk-req]')).toContainText('Không kết nối được hệ thống VOffice');
  const n = await page.evaluate(() => TrinhKy.list().length);
  await page.locator('[data-tkt="resend"]').click();
  await page.locator('#tk-pw2').fill('Vht@2026');
  await page.locator('#tk-pw-ok').click();
  expect(await lastToast(page)).toContain('Trình ký VOffice thành công');
  expect(await page.evaluate(() => TrinhKy.list().length)).toBe(n); // Lỗi gửi: không tạo lần trình mới
  await expect(page.locator('[data-sbar="view"]')).toBeVisible();
  await page.evaluate(() => { location.hash = '#/trinh-ky'; });
  await expect(fail.locator('[data-tk-act="task"]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('0273: công việc Xử lý trình ký — Đã thu hồi, Coi như Từ chối; Việc của tôi có dòng, xong sang Đã hoàn thành (SRS 32 V0.4)', async ({ page }) => {
  await fresh(page);
  await page.evaluate(() => { Flow.setPersona('tgd'); location.hash = '#/viec-cua-toi'; });
  const row = page.locator('tr', { hasText: 'Xử lý trình ký — BM-06' });
  await expect(row).toHaveCount(1);
  await row.locator('a').first().click();
  await page.locator('[data-tkt="reject"]').click();
  await page.locator('#tk-cr-ok').click();
  expect(await lastToast(page)).toContain('Vui lòng nhập Lý do');
  await page.locator('#tk-cr').fill('Sửa nội dung báo cáo');
  await page.locator('#tk-cr-ok').click();
  await expect(page.locator('[data-sbar="view"]')).toBeVisible();
  expect(await page.evaluate(() => TrinhKy.list().find((r) => r.obj === 'ĐXMS-2026-0072').st)).toBe('REJECTED_SIGN');
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('tr', { hasText: 'Xử lý trình ký — BM-06' })).toHaveCount(0);
  // Lần trình Đã hủy đã có lần trình mới thay (ĐXMS-2026-0117 BM-04 lần 1) không có công việc.
  expect(await page.evaluate(() => TrinhKy.taskRows('tung', false).length)).toBe(0);
  expect(page.errors).toEqual([]);
});

test('SRS 32 V0.4: hộp thoại có tên văn bản, khối, dung lượng, Đơn vị là ô chọn; Tìm kiếm nâng cao Loại đối tượng / Mẫu văn bản / Ngày trình; Chi tiết có Cách ký, Ngày ban hành, Nội dung', async ({ page }) => {
  await fresh(page);
  await jump(page, 60);
  const dlg = await openSign(page);
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Trình ký VOffice — BM-08 Quyết định phê duyệt ĐXMS');
  await expect(dlg.locator('.tk-sec')).toHaveText(['Kết nối VOffice', 'Thông tin văn bản']);
  await expect(dlg.locator('.tk-file').first()).toContainText(/tệp chính, \d+,\d MB/);
  await expect(dlg.locator('[data-vsel="tk-u0"]')).toHaveCount(1);
  await page.locator('.overlay [data-close]').last().click();
  await page.evaluate(() => { Flow.setPersona('lan'); location.hash = '#/trinh-ky'; });
  await page.locator('[data-tk-adv]').click();
  await page.locator('[data-vsel="tkf-form"]').click();
  await page.locator('.vsel-panel [data-opt="BM-09"]').click();
  await page.locator('[data-tkf-d="from"]').fill('05/11/2026');
  await page.locator('[data-tkf-d="to"]').fill('10/11/2026');
  await page.locator('[data-tkadv] button[type="submit"]').click();
  await expect(page.locator('[data-tkl] tbody tr[data-tk-id]')).toHaveCount(2);
  await page.locator('[data-tkf-d="from"]').fill('10/11/2026');
  await page.locator('[data-tkf-d="to"]').fill('05/11/2026');
  await page.locator('[data-tkadv] button[type="submit"]').click();
  await expect(page.locator('[data-tkadv]')).toContainText('Ngày trình không hợp lệ.');
  await page.locator('[data-tk-reset]').click();
  await page.locator('[data-tk-adv]').click();
  await page.locator('[data-tk-id="8"] [data-tk-act="view"]').click();
  const m = page.locator('.overlay .vmodal').last();
  for (const k of ['Cách ký', 'Ngày ban hành']) await expect(m).toContainText(k);
  await expect(m).toContainText('Ký tay');
  expect(page.errors).toEqual([]);
});
