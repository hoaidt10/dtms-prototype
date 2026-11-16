// T17 — Phương án Gộp menu "Luồng mua sắm" (plan docs/dtms/prototype-T17-luong-mua-sam-chuan-bi.md v0.2).
// B1: công tắc Tách / Gộp (D-25), SCR-95 Danh sách luồng, SCR-96 Tạo luồng (D-26 một lần Lưu, D-30 tệp căn cứ, D-75 nhân sự theo vai trò — T29 B12), DMDC SCR-99.
// B2: SCR-97 Chi tiết luồng (6 tab), SCR-98 Cập nhật nhân sự — Thay / Bổ sung, bước đã xong khoá (D-28), văn bản đã ký giữ nguyên (D-29).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const gop = async (page, hash = '#/luong') => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.setItem('dtms-proto-menu', 'gop'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const pick = async (page, id, value) => {
  await page.locator(`[data-vsel="${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator(`.vsel-panel [data-opt="${value}"]`).click();
};
const upload = (page, names) => page.locator('#lf-file').setInputFiles(names.map((name) => ({ name, mimeType: 'application/pdf', buffer: Buffer.alloc(16) })));

// Nhập Thông tin chung (T29 B1: không còn Quy trình; est < ngưỡng → luồng con dự kiến MS01.03).
async function fillGeneral(page, est) {
  await page.locator('#lf-title').fill('Luồng mua sắm cho dự án A');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  if (est != null) { await page.locator('#lf-est').fill(String(est)); await page.locator('#lf-est').dispatchEvent('change'); }
}

// T34 (D-90): công tắc Tách / Gộp — comment cùng màn Tách.
// [T34 bỏ Tách] test('D-25: công tắc Tách / Gộp — Gộp thay hai mục ĐXMS / Hồ sơ bằng Luồng mua sắm, route cũ vẫn mở', async ({ page }) => {
// [T34 bỏ Tách]   await fresh(page, '#/viec-cua-toi');
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveCount(1);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="luong"]')).toHaveCount(0);
// [T34 bỏ Tách]   await page.locator('#demo').click();
// [T34 bỏ Tách]   await page.locator('[data-luong-mode="gop"]').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/luong$/);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="luong"]')).toHaveCount(1);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveCount(0);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="ho-so-dxms"]')).toHaveCount(0);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="ycbg"]')).toHaveCount(1);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav .nav.active')).toHaveAttribute('data-go', 'luong');
// [T34 bỏ Tách]   await expect(page.locator('.pg-head h1, .pg-head h2').first()).toContainText('Danh sách luồng mua sắm');
// [T34 bỏ Tách]   // Route cũ vẫn mở, mục Luồng mua sắm sáng.
// [T34 bỏ Tách]   await page.evaluate(() => { location.hash = '#/dxms'; });
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav .nav.active')).toHaveAttribute('data-go', 'luong');
// [T34 bỏ Tách]   await page.locator('#demo').click();
// [T34 bỏ Tách]   await page.locator('[data-luong-mode="tach"]').click();
// [T34 bỏ Tách]   await expect(page).toHaveURL(/#\/dxms$/);
// [T34 bỏ Tách]   await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveCount(1);
// [T34 bỏ Tách]   expect(page.errors).toEqual([]);
// [T34 bỏ Tách] });

// Thêm một dòng chỉ định (D-75): chọn Vai trò thực hiện rồi chọn một Người thực hiện.
async function addRow(page, role, person) {
  await page.locator('[data-lf-add]').click();
  const id = await page.locator('[data-lf-members] tbody tr').last().locator('[data-row-role]').getAttribute('data-row-role');
  if (role) await pick(page, 'lf-role-' + id, role);
  if (person) await pick(page, 'lf-m-' + id, person);
  return id;
}

test('SCR-96 (D-75): Nhân sự thực hiện — Vai trò thực hiện + Người thực hiện; mỗi vai trò một dòng; Thêm / Xóa dòng', async ({ page }) => {
  await gop(page, '#/luong/create');
  await expect(page.locator('[data-lf-add]')).toBeEnabled();
  await expect(page.locator('[data-vsel="lf-proc"]')).toHaveCount(0);
  await fillGeneral(page);
  await expect(page.locator('[data-lf-members] thead th')).toHaveText(['STT', 'Thao tác', 'Vai trò thực hiện', 'Người thực hiện']);
  await expect(page.locator('[data-lf-members] .vtable-empty')).toContainText('Chưa chỉ định');
  await addRow(page, 'R-TTMS', null);
  const row = page.locator('[data-lf-members] tbody tr').first();
  await expect(row.locator('td:nth-child(3) .vsel-label')).toHaveText('Chuyên viên TTMS');
  // Người thực hiện theo vai trò (Chuyên viên TTMS: Lan, Mai), chọn một người.
  await page.locator('[data-vsel="lf-m-1"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveCount(2);
  await page.keyboard.press('Escape');
  // Vai trò đã có dòng không chọn lại; CQCM (chọn ở bước 16) không có trong danh sách.
  const id2 = await addRow(page, null, null);
  await page.locator(`[data-vsel="lf-role-${id2}"]`).click();
  await expect(page.locator('.vsel-panel [data-opt="R-TTMS"]')).toHaveCount(0);
  await expect(page.locator('.vsel-panel [data-opt="R-CQCM"]')).toHaveCount(0);
  await expect(page.locator('.vsel-panel [data-opt="R-DVDX-CH"]')).toContainText('Chỉ huy ĐVĐX');
  await page.keyboard.press('Escape');
  await page.locator(`[data-lf-rdel="${id2}"]`).click();
  await expect(page.locator('[data-lf-members] tbody tr')).toHaveCount(1);
  // Đổi Giá trị dự kiến (luồng con dự kiến đổi) không bỏ dòng — vai trò không phụ thuộc luồng con.
  await page.locator('#lf-est').fill('45.000.000.000'); await page.locator('#lf-est').dispatchEvent('change');
  await expect(page.locator('[data-lf-members] tbody tr')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

test('D-30 / D-75: thiếu tệp của loại căn cứ bắt buộc / chưa chọn loại / dòng chỉ định thiếu vai trò hoặc người → không Lưu được', async ({ page }) => {
  await gop(page, '#/luong/create');
  await fillGeneral(page);
  await page.locator('#lf-draft').click();
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Thiếu tài liệu căn cứ bắt buộc');
  // Lỗi nằm cuối form: Lưu cuộn tới lỗi đầu tiên + toast, không để người dùng tưởng nút không chạy.
  await expect(page.locator('[data-lf-basis] .lf-err')).toBeInViewport();
  // Lỗi cấp card (chưa có tệp nào để tô đỏ): card viền đỏ, chữ lỗi đỏ (không bị .vcard .msg đè thành xám).
  await expect(page.locator('[data-lf-basis]')).toHaveClass(/invalid/);
  await expect(page.locator('[data-lf-basis] .lf-err')).toHaveCSS('color', 'rgb(238, 0, 51)');
  expect(await lastToast(page)).toContain('Chưa lưu được');
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Kế hoạch mua sắm năm');
  await expect(page.locator('[data-lf-basis]')).not.toContainText('Loại bắt buộc');
  await upload(page, ['QD-1482-VHT.pdf']);
  await page.locator('#lf-draft').click();
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Bạn cần chọn Loại tài liệu căn cứ');
  await pick(page, 'lf-type-1', 'QD_NV');
  await addRow(page, null, null);
  await addRow(page, 'R-DVDX-CH', null);
  await page.locator('#lf-draft').click();
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Kế hoạch mua sắm năm');
  await expect(page.locator('[data-lf-basis] .lf-err')).not.toContainText('QĐ giao nhiệm vụ');
  await expect(page.locator('[data-row-role] .msg')).toContainText('Bạn cần chọn Vai trò thực hiện');
  await expect(page.locator('[data-row-people] .msg')).toContainText('Bạn cần chọn Người thực hiện');
  await expect(page).toHaveURL(/#\/luong\/create$/);
  expect(page.errors).toEqual([]);
});

test('D-26 / D-75: Lưu tạo ĐXMS + hồ sơ Phê duyệt + start; task 01 mở; tệp gắn đúng nơi; mọi bước của vai trò giao người đã chọn', async ({ page }) => {
  await gop(page, '#/luong/create');
  await fillGeneral(page);
  await upload(page, ['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf', 'Bao-gia-so-bo.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await pick(page, 'lf-type-3', 'BAO_GIA');
  // Báo giá chỉ áp dụng cho hồ sơ → Gắn vào = Hồ sơ Phê duyệt, khoá.
  await expect(page.locator('[data-vsel="lf-tg-3"]')).toContainText('Hồ sơ Phê duyệt');
  // Chuyên viên TTMS → Mai (mọi bước của vai trò, vd 17, 42); Chuyên quản ĐVĐX → Ngọc (bước 01…).
  await addRow(page, 'R-TTMS', 'mai');
  await addRow(page, 'R-DVDX-CQ', 'ngoc');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  expect(await lastToast(page)).toContain('Đã tạo luồng');
  const st = await page.evaluate(() => {
    const x = Flow.findDxms(Flow.state.dxms);
    return { members: x.members, roles: x.roleMembers, basis: x.basis.map((f) => f.type), uploads: Flow.ui.uploads.map((f) => f.name), proc: Flow.state.vars.process, t1: Flow.state.tokens[0] };
  });
  expect(st.roles).toEqual([{ role: 'R-TTMS', person: 'mai' }, { role: 'R-DVDX-CQ', person: 'ngoc' }]);
  expect([st.members['17'], st.members['42'], st.members['1']]).toEqual([['mai'], ['mai'], ['ngoc']]);
  expect(st.basis).toEqual(['QD_NV', 'KH_NAM']);
  expect(st.uploads).toEqual(['Bao-gia-so-bo.pdf']);
  expect(st.proc).toBe('MS01.01');
  expect(String(st.t1.task)).toBe('1');
  expect(st.t1.cands).toEqual(['ngoc']);
  // Danh sách tài liệu của hồ sơ có tệp căn cứ gắn hồ sơ.
  await expect(page.locator('main')).toContainText('Bao-gia-so-bo.pdf');
  // Danh sách luồng: luồng mới ở đầu, có hồ sơ đang xử lý và người đang xử lý.
  await page.evaluate(() => { location.hash = '#/luong'; });
  const first = page.locator('.vtable tbody tr').first();
  await expect(first).toContainText('Luồng mua sắm cho dự án A');
  await expect(first).toContainText(await page.evaluate(() => Flow.state.code));
  await expect(first).toContainText('Nguyễn Văn Minh');
  // Tua tới bước 17: giao Mai, không giao Lan.
  const r = await page.evaluate(() => {
    for (let i = 0; i < 300; i++) {
      const hit = Flow.state.tokens.find((t) => String(t.task) === '17');
      if (hit) return { who: hit.who, lan: Flow.tokensFor('lan').some((t) => t.id === hit.id), mai: Flow.tokensFor('mai').some((t) => t.id === hit.id) };
      const tok = Flow.state.tokens[0], c = Flow.mainChoice(tok.task);
      Flow.complete(tok.id, c, c && c.reason ? 'lý do' : null);
    }
    return null;
  });
  expect(r).toEqual({ who: 'mai', lan: false, mai: true });
  expect(page.errors).toEqual([]);
});

test('SCR-99: Loại tài liệu căn cứ trong Danh mục dùng chung, cột Áp dụng cho và Bắt buộc', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('qt'));
  await page.evaluate(() => { location.hash = '#/dmdc/loai-tai-lieu-can-cu'; });
  await expect(page.locator('.vtable tbody tr')).toHaveCount(8);
  await expect(page.locator('.vtable tbody tr', { hasText: 'QD_NV' })).toContainText('Bắt buộc');
  await expect(page.locator('.vtable tbody tr', { hasText: 'BAO_GIA' })).toContainText('Hồ sơ Phê duyệt');
  expect(page.errors).toEqual([]);
});

/* ---------- B2: SCR-97 Chi tiết luồng, SCR-98 Cập nhật nhân sự (D-28, D-29) ---------- */
// Tạo luồng MS01.01 đủ căn cứ bắt buộc, chỉ định vai trò Chuyên viên TTMS → Mai (bước 17, 42…); trả về mã ĐXMS.
async function newLuong(page) {
  await gop(page, '#/luong/create');
  await fillGeneral(page);
  await upload(page, ['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await addRow(page, 'R-TTMS', 'mai');
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  return page.evaluate(() => Flow.state.dxms);
}
// Tua luồng theo nhánh chính tới khi có token ở bước `step`.
const runTo = (page, step) => page.evaluate((s) => {
  for (let i = 0; i < 300; i++) {
    if (Flow.state.tokens.some((t) => String(t.task) === s)) return true;
    const tok = Flow.state.tokens[0], c = Flow.mainChoice(tok.task);
    Flow.complete(tok.id, c, c && c.reason ? 'lý do' : null);
  }
  return false;
}, String(step));
const openTab = async (page, code, tab) => {
  await page.evaluate((c) => { location.hash = '#/luong/' + encodeURIComponent(c); }, code);
  await page.locator(`[data-ltab="${tab}"]`).click();
};
const stepRow = (page, step) => page.locator('.vtable tbody tr', { has: page.locator(`[data-um-who="${step}"]`) });
const umPick = async (page, id, values) => {
  await page.locator(`.vmodal [data-vsel="${id}"]`).click();
  for (const v of values) await page.locator(`.vsel-panel [data-opt="${v}"]`).click();
  // Escape đóng cả hộp thoại (vht-modal) → bấm tiêu đề để đóng danh sách chọn.
  await page.locator('.vmodal-h h3').click();
};

const roleOf = (page, step) => page.evaluate((k) => Luong.rolesOf(Flow.state.vars.process).find((r) => r.tasks.includes(k)), step);

test('SCR-97: Chi tiết luồng 6 tab; Nhân sự thực hiện theo bước — chỉ định / theo vai trò, trạng thái bước, bước đã xong khoá (D-28)', async ({ page }) => {
  const code = await newLuong(page);
  await page.evaluate(() => { location.hash = '#/luong'; });
  await page.locator('.vtable tbody tr').first().locator('td').nth(4).click();
  await expect(page).toHaveURL(/#\/luong\/.+/);
  await expect(page.locator('[data-ltab]')).toHaveText(['Thông tin chung', 'Tiến trình', 'Căn cứ', 'Căn cứ & hạng mục', 'Rà soát tồn kho', 'Yêu cầu báo giá', 'Lịch sử phiên bản', 'Nhân sự thực hiện', 'Văn bản & ký duyệt', 'Kết quả & văn bản phê duyệt', 'Lịch sử thay đổi nhân sự']); // T34: thêm 5 tab của SCR-29
  await expect(page.locator('main')).toContainText('Luồng mua sắm cho dự án A');
  await page.locator('[data-ltab="tien-trinh"]').click();
  await expect(page.locator('main')).toContainText(await page.evaluate(() => Flow.state.code));
  await expect(page.locator('main')).toContainText('Quy trình hồ sơ');
  await page.locator('[data-ltab="can-cu"]').click();
  await expect(page.locator('main .vcard').first().locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('main')).toContainText('Kế hoạch mua sắm năm');
  await page.locator('[data-ltab="nhan-su"]').click();
  await expect(stepRow(page, '17')).toContainText('Đinh Thị Mai');
  await expect(stepRow(page, '17')).not.toContainText('theo vai trò');
  await expect(stepRow(page, '13')).toContainText('Trần Đức Hải (theo vai trò)');
  await expect(stepRow(page, '1')).toContainText('Đang xử lý');
  await expect(stepRow(page, '13')).toContainText('Chưa tới');
  // Xong bước 01 → khoá.
  await runTo(page, 4);
  await expect(stepRow(page, '1')).toContainText('Đã xong — khoá');
  await expect(stepRow(page, '1').locator('[data-um-open]')).toBeDisabled();
  await expect(stepRow(page, '13').locator('[data-um-open]')).toBeEnabled();
  await page.locator('[data-ltab="lich-su"]').click();
  await expect(page.locator('main .vtable-empty')).toContainText('Chưa có thay đổi nhân sự');
  expect(code).toMatch(/^ĐXMS-/);
  expect(page.errors).toEqual([]);
});

test('SCR-98: chọn Vai trò thực hiện (D-75), không chọn Bước; Thay người — bắt buộc chọn người, ảnh hưởng, lịch sử; luồng tới bước giao người mới', async ({ page }) => {
  const code = await newLuong(page);
  await openTab(page, code, 'nhan-su');
  await stepRow(page, '13').locator('[data-um-open]').click();
  await expect(page.locator('.vmodal')).toContainText('Cập nhật nhân sự');
  // Nút ở dòng bước 13 mở sẵn vai trò của bước 13; popup không còn trường Bước.
  const r13 = await roleOf(page, '13');
  await expect(page.locator('.vmodal [data-vsel="um-step"]')).toHaveCount(0);
  await expect(page.locator('.vmodal [data-vsel="um-role"] .vsel-label')).toContainText(r13.name);
  await expect(page.locator('#um-cur')).toHaveValue('Trần Đức Hải (theo vai trò)');
  await page.locator('#um-ok').click();
  await expect(page.locator('.vmodal')).toContainText('Bạn cần chọn người bị thay.');
  await expect(page.locator('.vmodal')).toContainText('Bạn cần chọn người thay thế.');
  await umPick(page, 'um-drop', ['hai']);
  await umPick(page, 'um-add', ['son']);
  await expect(page.locator('[data-um-impact]')).toContainText('Bước áp dụng');
  await expect(page.locator('[data-um-impact]')).toContainText('Lý Văn Sơn');
  await page.locator('#um-file').setInputFiles({ name: 'QD-dieu-dong-123.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(8) });
  await page.locator('#um-reason').fill('Đi công tác');
  await page.locator('#um-ok').click();
  await expect(page.locator('.vmodal')).toHaveCount(0);
  expect(await lastToast(page)).toContain(`Đã thay người cho vai trò ${r13.name}`);
  await expect(stepRow(page, '13')).toContainText('Lý Văn Sơn');
  await expect(stepRow(page, '13')).not.toContainText('theo vai trò');
  await page.locator('[data-ltab="lich-su"]').click();
  const row = page.locator('.vtable tbody tr').first();
  await expect(row).toContainText('Thay người');
  await expect(row).toContainText(r13.name);
  await expect(row).toContainText('Trần Đức Hải');
  await expect(row).toContainText('Lý Văn Sơn');
  await expect(row).toContainText('QD-dieu-dong-123.pdf');
  await expect(row).toContainText('Đi công tác');
  // Luồng tới bước 13: giao Sơn, ĐXMS lưu nhân sự mới.
  await runTo(page, 13);
  const st = await page.evaluate((c) => ({ who: Flow.state.tokens.find((t) => String(t.task) === '13').who, hai: Flow.tokensFor('hai').length, m: Flow.findDxms(c).members['13'] }), code);
  expect(st).toEqual({ who: 'son', hai: 0, m: ['son'] });
  expect(page.errors).toEqual([]);
});

test('SCR-98 từ màn xử lý task: Thay người task đang mở chuyển ngay; Bổ sung thêm candidate', async ({ page }) => {
  await newLuong(page);
  // SRS 12 V0.4: màn Lập không có nút Cập nhật nhân sự (SRS 12 mục 3.1.2.1.3) — mở hộp thoại trực tiếp.
  await expect(page.locator('[data-luong-form] [data-um-open]')).toHaveCount(0);
  await page.evaluate(() => Luong.membersDialog(Flow.state.dxms));
  const r1 = await roleOf(page, '1');
  await page.locator('.vmodal [data-vsel="um-role"]').click();
  await page.locator(`.vsel-panel [data-opt="${r1.code}"]`).click();
  await umPick(page, 'um-drop', ['minh']);
  await umPick(page, 'um-add', ['ngoc']);
  await expect(page.locator('[data-um-impact]')).toContainText('Nguyễn Văn Minh → Phan Thị Ngọc');
  await page.locator('#um-ok').click();
  expect(await lastToast(page)).toContain('Chuyển 1 task đang mở');
  const t1 = await page.evaluate(() => { const t = Flow.state.tokens[0]; return { who: t.who, cands: t.cands, minh: Flow.tokensFor('minh').length, log: Flow.state.memberLog[0].moved.length }; });
  expect(t1).toEqual({ who: 'ngoc', cands: ['ngoc'], minh: 0, log: 1 });
  // Bổ sung người ở bước 17 (đã chỉ định Mai): thêm Lan → task giao cả hai.
  await page.evaluate(() => Luong.membersDialog(Flow.state.dxms, '17'));
  await page.locator('[data-um-mode="add"]').click();
  await umPick(page, 'um-add', ['lan']);
  await expect(page.locator('[data-um-impact]')).toContainText('Không ảnh hưởng (Bổ sung)');
  await page.locator('#um-ok').click();
  expect(await lastToast(page)).toContain(`Đã bổ sung người cho vai trò ${(await roleOf(page, '17')).name}`);
  expect(await lastToast(page)).toContain('Đinh Thị Mai, Phạm Thị Lan');
  await runTo(page, 17);
  const t17 = await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '17').cands);
  expect(t17).toEqual(['mai', 'lan']);
  expect(page.errors).toEqual([]);
});

test('D-29 (3): thay người đã ký — văn bản đã ký giữ nguyên; tab Tài liệu & văn bản (Văn bản đầu ra gộp trạng thái ký, D-95); bước đã xong không chọn được', async ({ page }) => {
  const code = await newLuong(page);
  expect(await runTo(page, 48)).toBe(true);
  await openTab(page, code, 'tai-lieu');
  // T54 (SRS 21 V0.4): Chỉ huy ĐVĐX trình ký BM-03 ở bước 16.1 — TTMS không là người ký BM-03.
  // T72 #80 (D-122 Q3): Văn bản đầu ra bỏ cột Trạng thái / Ký duyệt (người ký xem ở menu Trình ký) — trước: kiểm người ký, "Đã ký" trên dòng BM-03 / BM-05.
  await expect(page.locator('[data-dx-docs] tbody tr', { hasText: 'BM-03' })).not.toHaveCount(0);
  await expect(page.locator('[data-dx-docs] tbody tr', { hasText: 'BM-05' })).not.toHaveCount(0);
  await expect(page.locator('[data-dx-docs] thead')).not.toContainText('Ký duyệt');
  // Bước 43 đã xong → không chọn được. Bước 48 (vai trò Chuyên viên TTMS đã chỉ định Mai, D-75) thay bằng Lan.
  await page.evaluate((c) => Luong.membersDialog(c, null), code);
  const r48 = await roleOf(page, '48');
  await page.locator('.vmodal [data-vsel="um-role"]').click();
  await page.locator(`.vsel-panel [data-opt="${r48.code}"]`).click();
  await expect(page.locator('[data-um-impact]')).toContainText('đã xong giữ nguyên');
  // Mai đã ký BM-05 ở bước 43 → BM-05 giữ nguyên.
  await umPick(page, 'um-drop', ['mai']);
  await umPick(page, 'um-add', ['lan']);
  await expect(page.locator('[data-um-impact]')).toContainText('BM-05 (Đinh Thị Mai');
  await expect(page.locator('[data-um-impact]')).toContainText('giữ nguyên');
  await page.locator('#um-ok').click();
  await expect(page.locator('[data-dx-docs] tbody tr', { hasText: 'BM-05' })).not.toHaveCount(0); // T72 #80: văn bản giữ nguyên, người ký xem ở Trình ký
  expect(await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '48').who)).toBe('lan');
  expect(page.errors).toEqual([]);
});
