// T25 B1: MS22 Thương thảo và ký hợp đồng chạy trên HĐ-2026-0052 — bấm đủ 13 bước qua eForm, Việc của tôi, Xem BPMN, Chi tiết hợp đồng.
import { test, expect } from '@playwright/test';
import { fresh, signGo } from './helpers.mjs';

const HD = 'HĐ-2026-0052', CASE = 'HSHD-2026-0052', HREF = '#/hop-dong/' + encodeURIComponent(HD);
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-1\d\d|ngoài BPMN/;

const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
/* Mở việc của bước `n` bằng tài khoản `who`. */
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k)).id, [who, n]);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.pg-title, h1').first()).toHaveText(/Xem chi tiết hồ sơ|Xử lý hồ sơ/);
}
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
/* Gõ như người dùng: chọn hết rồi gõ (fill của Playwright nối vào ô number có sẵn giá trị); chờ form vẽ lại sau khi rời ô trước. */
const typeNum = async (page, key, v) => { const f = page.locator(`[data-ef="${key}"]`); await f.click(); await page.waitForTimeout(50); await page.keyboard.press('Control+A'); await page.keyboard.type(v); await expect(f).toHaveValue(v); };
const up = (page) => page.locator('[data-req-up]').first().click();
/* Xong bước: quay về Việc của tôi. */
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);

async function start(page) {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'phd');
  await goto(page, HREF);
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await page.locator('[data-hd-newcase]').click();
  await expect(page).toHaveURL(/#\/task\/HSHD-2026-0052:k/);
}

test('MS22 đủ 13 bước: song song 2 ‖ 3, AI cảnh báo → thống nhất lại, ký, Nhà thầu ký, hợp đồng Đang thực hiện', async ({ page }) => {
  await start(page);
  expect(await page.locator('.main').innerText()).not.toMatch(BA);
  await expect(page.locator('.ginfo')).toContainText(HD);
  // Bước 1
  await act(page, 'Hoàn thành tiếp nhận');
  await page.locator('[data-ef-chk="hdDuHoSo"]').check();
  await ok(page);
  await done(page);
  // Sau bước 1 tách song song: ĐVSD và Phòng Hợp đồng cùng có việc; việc hiện ở Việc của tôi.
  await expect(page.locator('.vtable tbody')).toContainText('Hoàn thiện body và phụ lục giá');
  expect(await page.evaluate(() => Flow.caseTokens('admin').map((t) => t.task).sort())).toEqual([2, 3]);
  await as(page, 'dvsd');
  const row = page.locator('.vtable tbody tr', { hasText: 'Hoàn thiện phụ lục kỹ thuật' });
  await expect(row).toContainText(HD);
  // Việc của tôi không có cột Mã hồ sơ (D-92) — dòng mang mã hồ sơ ở data-code.
  await expect(row).toHaveAttribute('data-code', CASE);
  await expect(page.locator('.bell .count')).toHaveText('1');
  // Bước 2
  await openTask(page, 'dvsd', 2);
  await act(page, 'Hoàn thành phụ lục kỹ thuật');
  await page.locator('[data-ef="hdYeuCau"]').fill('Theo HSMT mục 3');
  await page.locator('[data-ef="hdNghiemThu"]').fill('Theo TCVN');
  await page.locator('[data-ef="hdTienDo"]').fill('210 ngày');
  await ok(page);
  await done(page);
  // Bước 3
  await openTask(page, 'phd', 3);
  await act(page, 'Hoàn thành body và phụ lục giá');
  // T67 H3: mẫu hợp đồng đọc từ HSMT của gói (1.6), chỉ xem; bảng Thông tin điền vào mẫu.
  await expect(page.locator('.vmodal')).toContainText('1.6 — HĐ hàng hóa sẵn có và dịch vụ');
  await expect(page.locator('.vmodal')).toContainText('Thông tin điền vào mẫu');
  await ok(page);
  await done(page);
  // Bước 4: thiếu biên bản thì bị chặn; bảo hành 18 tháng → AI cảnh báo
  await openTask(page, 'phd', 4);
  await act(page, 'Hoàn thành thương thảo');
  await page.locator('[data-ef="hdThongNhat"]').fill('Danh mục, đơn giá theo HSDT');
  await typeNum(page, 'hdBaoHanh', '18');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('Biên bản thương thảo');
  await page.locator('.vmodal [data-close]').first().click();
  await up(page);
  await act(page, 'Hoàn thành thương thảo');
  await page.locator('[data-ef="hdThongNhat"]').fill('Danh mục, đơn giá theo HSDT');
  await typeNum(page, 'hdBaoHanh', '18');
  await ok(page);
  await done(page);
  expect(await page.evaluate(() => Flow.caseTokens('admin').map((t) => t.task))).toEqual([6]);
  // Bước 6: kết quả AI chỉ xem; thống nhất 24 tháng → AI đạt → bước 8
  await openTask(page, 'phd', 6);
  await act(page, 'Cập nhật và kiểm tra lại');
  await expect(page.locator('.vmodal')).toContainText('Bảo hành lò hàn đối lưu 18 tháng');
  await page.locator('[data-ef="hdThongNhatLai"]').fill('Nhà thầu đồng ý 24 tháng');
  await typeNum(page, 'hdBaoHanh', '24');
  await ok(page);
  await done(page);
  // Bước 8
  await openTask(page, 'tphd', 8);
  await act(page, 'Phê duyệt và ký soạn thảo');
  await expect(page.locator('.vmodal')).toContainText('Đạt');
  await ok(page);
  await done(page);
  // Bước 9: đang tạm dừng ký → bắt buộc số văn bản giải quyết kiến nghị
  await openTask(page, 'phd', 9);
  await up(page);
  await act(page, 'Trình Thủ trưởng VHT');
  await expect(page.locator('.vmodal')).toContainText('Tạm dừng ký hợp đồng');
  await page.locator('[data-ef-chk="hdNhayTtms"]').check();
  await page.locator('[data-ef-chk="hdNhayDvsd"]').check();
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toContainText('Số văn bản giải quyết kiến nghị');
  await page.locator('[data-ef="hdVanBanKienNghi"]').fill('1021/QĐ-VHT');
  await ok(page);
  await done(page);
  // Bước 10: Xem BPMN tô đúng bước; ký qua hộp thoại Trình ký
  await openTask(page, 'tgd', 10);
  // T56 Q6: nút Xem BPMN nằm trên hàng tiêu đề, không trong thanh thao tác.
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-h h2')).toContainText('Xem xét, phê duyệt và ký hợp đồng');
  await expect(page.locator('.bp-root [data-task="10"] rect').first()).toHaveAttribute('fill', '#e9fbf0');
  await page.goBack();
  await act(page, 'Phê duyệt và ký hợp đồng');
  await ok(page);
  await signGo(page.locator('.vmodal')); // T54: Trình ký VOffice cần mật khẩu VOffice (GIẢ LẬP)
  await done(page);
  // Bước 11, 12
  await openTask(page, 'phd', 11);
  await act(page, 'Đã nhận hợp đồng');
  await page.locator('[data-ef-chk="hdDaNhan"]').check();
  await ok(page);
  await done(page);
  await openTask(page, 'phd', 12);
  await act(page, 'Gửi ký qua VContract');
  await ok(page);
  await done(page);
  // Bước 13: Ghi nhận chưa ký ở lại bước 13; đã ký thì sang Đang thực hiện
  await openTask(page, 'phd', 13);
  await act(page, 'Ghi nhận chưa ký');
  await page.locator('.vmodal textarea').fill('Nhà thầu xin thêm 02 ngày');
  await page.locator('.vmodal .vbtn.primary').click();
  await done(page);
  expect(await page.evaluate(() => Flow.caseTokens('admin').map((t) => t.task))).toEqual([13]);
  await openTask(page, 'phd', 13);
  await up(page);
  await act(page, 'Ghi nhận đã ký đầy đủ');
  await page.locator('[data-ef="hdNgayKy"]').fill('20/10/2026');
  await ok(page);
  await expect(page).toHaveURL(/#\/hop-dong\//);

  // Chi tiết hợp đồng đọc từ hồ sơ con
  const main = page.locator('.main');
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  await expect(main).toContainText('Đang thực hiện');
  await expect(main).toContainText('052/2026/HĐMB-VHT');
  await expect(main).toContainText('Ký điện tử (VContract)');
  await expect(main).toContainText('20/10/2026');
  await expect(page.locator('.hd-alert.error')).toHaveCount(0);
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await expect(page.locator('[data-hd-cases]')).toContainText('Hoàn thành');
  await expect(main).toContainText('Nhà thầu đồng ý 24 tháng');
  await expect(main).toContainText('Thủ trưởng VHT');
  await expect(page.locator('[data-hd-newcase]')).toHaveCount(0);
  // Danh sách: hợp đồng đổi trạng thái
  await goto(page, '#/hop-dong');
  await expect(page.locator('.vtable tbody tr', { hasText: HD })).toContainText('Đang thực hiện');
  // Chi tiết hồ sơ con + BPMN sau khi kết thúc
  await goto(page, '#/ho-so-hd/' + CASE);
  await expect(main).toContainText('Hoàn thành');
  await expect(main).toContainText('HD-KY Hợp đồng đã ký đầy đủ');
  expect(await main.innerText()).not.toMatch(BA);
  await page.locator('[data-go$="/bpmn"]').click();
  await expect(page.locator('.bp-h h2')).toContainText('hợp đồng đã ký đầy đủ');
  expect(page.errors).toEqual([]);
});

test('MS22: hồ sơ con không đụng hồ sơ đang chạy ở luồng chính; Việc của tôi hiện cả hai', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' }));
  const main = await page.evaluate(() => Flow.state.code);
  await start2(page);
  await goto(page, '#/viec-cua-toi');
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(await page.evaluate(() => [Flow.state.code, Flow.inCase()])).toEqual([main, false]);
  await as(page, 'admin');
  // Không có cột Mã hồ sơ (D-92): kiểm hai hồ sơ qua data-code của dòng.
  await expect(page.locator(`.vtable tbody tr[data-code="${CASE}"]`)).toHaveCount(1);
  await expect(page.locator(`.vtable tbody tr[data-code="${main}"]`)).not.toHaveCount(0);
  // Mở việc hồ sơ chính rồi quay lại việc hợp đồng: đúng hồ sơ theo route
  await goto(page, '#/task/' + (await page.evaluate(() => Flow.tokensFor('admin')[0].id)));
  // T29 B19: việc bước 1 của hồ sơ chính mở màn Lập ĐXMS (Mã ĐXMS ở ô chỉ đọc).
  await expect(page.locator('[data-luong-form] input[disabled]').first()).toHaveValue('ĐXMS-2026-0117');
  await goto(page, '#/task/' + (await page.evaluate(() => Flow.caseTokens('admin')[0].id)));
  await expect(page.locator('.ginfo')).toContainText(HD);
  // Tải lại trang trên màn hồ sơ con
  await page.reload();
  await expect(page.locator('.ginfo')).toContainText(HD);
  expect(page.errors).toEqual([]);
});
async function start2(page) {
  await as(page, 'phd');
  await goto(page, HREF);
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await page.locator('[data-hd-newcase]').click();
  await expect(page).toHaveURL(/#\/task\/HSHD-2026-0052:k/);
}

test('MS22: chỉ HĐ-2026-0052 có Tạo hồ sơ, chỉ Phòng Hợp đồng; hợp đồng khác xem tĩnh; chưa tạo hồ sơ thì giữ dữ liệu mẫu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'minh');
  await goto(page, HREF);
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await expect(page.locator('[data-hd-cases]')).toBeVisible();
  await expect(page.locator('[data-hd-newcase]')).toHaveCount(0);
  await expect(page.locator('.hd-alert.error')).toContainText('Tạm dừng ký hợp đồng');
  await goto(page, '#/hop-dong/' + encodeURIComponent('HĐ-2025-0187'));
  await page.locator('.dx-tabs [data-ttab="tt"]').click();
  await expect(page.locator('[data-hd-cases]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Bộ demo MS22: mọi cảnh và nhánh phụ mở đúng việc, không có chữ BA; nhánh phụ đi đúng đường', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const set = await page.evaluate(() => { const s = D.demoSets.find((d) => d.key === 'MS22'); return { scenes: s.scenes.map((x) => ({ n: x.n, start: x.start, who: x.who })), branches: s.branches.length }; });
  for (const sc of set.scenes) {
    await page.evaluate((n) => Flow.jumpToScene(n, 'MS22'), sc.n);
    if (sc.start === 'NEW' || sc.start === 'END') continue;
    const id = await page.evaluate(([w, k]) => Flow.caseTokens(w).find((t) => String(t.task) === String(k)).id, [sc.who, sc.start]);
    await goto(page, '#/task/' + id);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  for (let i = 0; i < set.branches; i++) {
    const r = await page.evaluate((k) => { const b = D.demoSets.find((d) => d.key === 'MS22').branches[k]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); return Flow.caseTokens(b.who).find((t) => String(t.task) === String(b.task)).id; }, i);
    await goto(page, '#/task/' + r);
    await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
    expect(await page.locator('.main').innerText()).not.toMatch(BA);
  }
  // Trưởng phòng trả về sửa nội bộ: nhận xét → bước 7
  await page.evaluate(() => { const b = D.demoSets.find((d) => d.key === 'MS22').branches[1]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); });
  await goto(page, '#/task/' + (await page.evaluate(() => Flow.caseTokens('tphd')[0].id)));
  await page.locator('.task-acts [data-more]').click().catch(() => {});
  await page.locator('[data-act]', { hasText: 'Trả chỉnh sửa — sửa nội bộ' }).click();
  await page.locator('.vmodal textarea').fill('Sai số quyết định KQLCNT');
  await page.locator('.vmodal .vbtn.primary').click();
  await done(page);
  expect(await page.evaluate(() => Flow.caseTokens('admin').map((t) => t.task))).toEqual([7]);
  // Công cụ demo bấm được bộ MS22, cảnh 1 mở Chi tiết hợp đồng tab Thương thảo
  await page.locator('#demo').click();
  await page.locator('[data-demo-set="MS22"]').click();
  await expect(page).toHaveURL(/#\/hop-dong\//);
  await expect(page.locator('[data-hd-newcase]')).toBeVisible();
  expect(page.errors).toEqual([]);
});
