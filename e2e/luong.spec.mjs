// T17 — Phương án Gộp menu "Luồng mua sắm" (plan docs/dtms/prototype-T17-luong-mua-sam-chuan-bi.md v0.2).
// B1: công tắc Tách / Gộp (D-25), SCR-95 Danh sách luồng, SCR-96 Tạo luồng (D-26 một lần Lưu, D-30 tệp căn cứ, D-27 nhân sự chỉ định theo bước), DMDC SCR-99.
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

// Nhập Thông tin chung + chọn quy trình.
async function fillGeneral(page, proc = 'MS01.01') {
  await page.locator('#lf-title').fill('Luồng mua sắm cho dự án A');
  await pick(page, 'lf-nv', 'NV-KHCN-2026-014');
  await pick(page, 'lf-proc', proc);
}

test('D-25: công tắc Tách / Gộp — Gộp thay hai mục ĐXMS / Hồ sơ bằng Luồng mua sắm, route cũ vẫn mở', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveCount(1);
  await expect(page.locator('.sb-nav [data-go="luong"]')).toHaveCount(0);
  await page.locator('#demo').click();
  await page.locator('[data-luong-mode="gop"]').click();
  await expect(page).toHaveURL(/#\/luong$/);
  await expect(page.locator('.sb-nav [data-go="luong"]')).toHaveCount(1);
  await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveCount(0);
  await expect(page.locator('.sb-nav [data-go="ho-so-dxms"]')).toHaveCount(0);
  await expect(page.locator('.sb-nav [data-go="ycbg"]')).toHaveCount(1);
  await expect(page.locator('.sb-nav .nav.active')).toHaveAttribute('data-go', 'luong');
  await expect(page.locator('.pg-head h1, .pg-head h2').first()).toContainText('Danh sách luồng mua sắm');
  // Route cũ vẫn mở, mục Luồng mua sắm sáng.
  await page.evaluate(() => { location.hash = '#/dxms'; });
  await expect(page.locator('.sb-nav .nav.active')).toHaveAttribute('data-go', 'luong');
  await page.locator('#demo').click();
  await page.locator('[data-luong-mode="tach"]').click();
  await expect(page).toHaveURL(/#\/dxms$/);
  await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

// Thêm một dòng chỉ định: chọn bước rồi chọn nhân sự.
async function addRow(page, step, people) {
  await page.locator('[data-lf-add]').click();
  const id = await page.locator('[data-lf-members] tbody tr').last().locator('[data-row-step]').getAttribute('data-row-step');
  if (step) await pick(page, 'lf-step-' + id, step);
  if (people.length) {
    await page.locator(`[data-vsel="lf-m-${id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await page.locator(`[data-vsel="lf-m-${id}"]`).click();
    for (const p of people) await page.locator(`.vsel-panel [data-opt="${p}"]`).click();
    await page.keyboard.press('Escape');
  }
  return id;
}

test('SCR-96: Nhân sự thực hiện — mỗi dòng một bước (Bước, Tên công việc, Vai trò); Thêm / Xóa dòng; bước đã chọn không chọn lại', async ({ page }) => {
  await gop(page, '#/luong/create');
  await expect(page.locator('[data-lf-members]')).toContainText('Chọn Quy trình để chỉ định nhân sự');
  await expect(page.locator('[data-lf-add]')).toBeDisabled();
  await fillGeneral(page, 'MS01.01');
  await expect(page.locator('[data-lf-members] .vcard-h')).not.toContainText('Bước không chỉ định');
  await expect(page.locator('[data-lf-members] thead th')).toHaveText(['STT', 'Thao tác', 'Bước', 'Tên công việc', 'Vai trò thực hiện', 'Nhân sự thực hiện']);
  // Mặc định không có dòng: không bước nào bắt buộc chỉ định.
  await expect(page.locator('[data-lf-members] .vtable-empty')).toContainText('Chưa chỉ định nhân sự cho bước nào');
  await addRow(page, '47', []);
  const row = page.locator('[data-lf-members] tbody tr').first();
  await expect(row.locator('td:nth-child(3) .vsel-label')).toHaveText('47');
  await expect(row.locator('td:nth-child(4)')).toHaveText(await page.evaluate(() => BPMN_TASKS['47'].name));
  await expect(row.locator('td:nth-child(5)')).toHaveText('Phó Tổng Giám đốc');
  // Danh sách bước: chỉ bước người dùng của quy trình; bước đã có dòng, bước hệ thống, bước không áp dụng không có.
  const id2 = await addRow(page, null, []);
  await page.locator(`[data-vsel="lf-step-${id2}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.locator(`[data-vsel="lf-step-${id2}"]`).click();
  await expect(page.locator('.vsel-panel [data-opt="47"]')).toHaveCount(0);
  await expect(page.locator('.vsel-panel [data-opt="39"]')).toHaveCount(0);
  await expect(page.locator('.vsel-panel [data-opt="2"]')).toHaveCount(0);
  await expect(page.locator('.vsel-panel [data-opt="1"]')).toContainText('01 · Chọn căn cứ');
  // Nhân sự theo vai trò của bước (bước 17 — Chuyên viên TTMS: Lan, Mai).
  await page.locator('.vsel-panel [data-opt="17"]').click();
  await page.locator(`[data-vsel="lf-m-${id2}"]`).click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveCount(2);
  await page.keyboard.press('Escape');
  // Xóa dòng.
  await page.locator(`[data-lf-rdel="${id2}"]`).click();
  await expect(page.locator('[data-lf-members] tbody tr')).toHaveCount(1);
  // Đổi sang MS01.03: bước 47 không áp dụng → dòng bị bỏ.
  await pick(page, 'lf-proc', 'MS01.03');
  await expect(page.locator('[data-lf-members] .vtable-empty')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

test('D-30 / D-27: thiếu tệp của loại căn cứ bắt buộc / chưa chọn loại / dòng chỉ định thiếu bước hoặc người → không Lưu được', async ({ page }) => {
  await gop(page, '#/luong/create');
  await fillGeneral(page);
  await page.locator('#lf-save').click();
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Thiếu tài liệu căn cứ bắt buộc');
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Kế hoạch mua sắm năm');
  await expect(page.locator('[data-lf-basis]')).not.toContainText('Loại bắt buộc');
  await upload(page, ['QD-1482-VHT.pdf']);
  await page.locator('#lf-save').click();
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Bạn cần chọn Loại tài liệu căn cứ');
  await pick(page, 'lf-type-1', 'QD_NV');
  await addRow(page, null, []);
  await addRow(page, '13', []);
  await page.locator('#lf-save').click();
  await expect(page.locator('[data-lf-basis] .lf-err')).toContainText('Kế hoạch mua sắm năm');
  await expect(page.locator('[data-lf-basis] .lf-err')).not.toContainText('QĐ giao nhiệm vụ');
  await expect(page.locator('[data-row-step] .msg')).toContainText('Bạn cần chọn Bước');
  await expect(page.locator('[data-row-people] .msg')).toContainText('ít nhất một người');
  await expect(page).toHaveURL(/#\/luong\/create$/);
  expect(page.errors).toEqual([]);
});

test('D-26 / D-27: Lưu tạo ĐXMS + hồ sơ Phê duyệt + start; task 01 mở; tệp gắn đúng nơi; bước chỉ định giao người đã chọn', async ({ page }) => {
  await gop(page, '#/luong/create');
  await fillGeneral(page);
  await upload(page, ['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf', 'Bao-gia-so-bo.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await pick(page, 'lf-type-3', 'BAO_GIA');
  // Báo giá chỉ áp dụng cho hồ sơ → Gắn vào = Hồ sơ Phê duyệt, khoá.
  await expect(page.locator('[data-vsel="lf-tg-3"]')).toContainText('Hồ sơ Phê duyệt');
  // Bước 17 (Chuyên viên TTMS) chỉ định Mai; bước 01 chỉ định Minh + Ngọc.
  await addRow(page, '17', ['mai']);
  await addRow(page, '1', ['minh', 'ngoc']);
  await page.locator('#lf-save').click();
  await expect(page).toHaveURL(/#\/task\/k\d+$/);
  expect(await lastToast(page)).toContain('Đã tạo luồng');
  const st = await page.evaluate(() => {
    const x = Flow.findDxms(Flow.state.dxms);
    return { members: x.members, basis: x.basis.map((f) => f.type), uploads: Flow.ui.uploads.map((f) => f.name), proc: Flow.state.vars.process, t1: Flow.state.tokens[0] };
  });
  expect(st.members).toEqual({ 17: ['mai'], 1: ['minh', 'ngoc'] });
  expect(st.basis).toEqual(['QD_NV', 'KH_NAM']);
  expect(st.uploads).toEqual(['Bao-gia-so-bo.pdf']);
  expect(st.proc).toBe('MS01.01');
  expect(String(st.t1.task)).toBe('1');
  expect(st.t1.cands).toEqual(['minh', 'ngoc']);
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
// Tạo luồng MS01.01 đủ căn cứ bắt buộc, chỉ định bước 17 → Mai; trả về mã ĐXMS.
async function newLuong(page) {
  await gop(page, '#/luong/create');
  await fillGeneral(page);
  await upload(page, ['QD-1482-VHT.pdf', 'KH-mua-sam-2026.pdf']);
  await pick(page, 'lf-type-1', 'QD_NV');
  await pick(page, 'lf-type-2', 'KH_NAM');
  await addRow(page, '17', ['mai']);
  await page.locator('#lf-save').click();
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

test('SCR-97: Chi tiết luồng 6 tab; Nhân sự thực hiện theo bước — chỉ định / theo vai trò, trạng thái bước, bước đã xong khoá (D-28)', async ({ page }) => {
  const code = await newLuong(page);
  await page.evaluate(() => { location.hash = '#/luong'; });
  await page.locator('.vtable tbody tr').first().locator('td').nth(4).click();
  await expect(page).toHaveURL(/#\/luong\/.+/);
  await expect(page.locator('[data-ltab]')).toHaveText(['Thông tin chung', 'Tiến trình', 'Căn cứ', 'Nhân sự thực hiện', 'Văn bản & ký duyệt', 'Lịch sử thay đổi nhân sự']);
  await expect(page.locator('main')).toContainText('Luồng mua sắm cho dự án A');
  await page.locator('[data-ltab="tien-trinh"]').click();
  await expect(page.locator('main')).toContainText(await page.evaluate(() => Flow.state.code));
  await expect(page.locator('main')).toContainText('Quy trình hồ sơ');
  await page.locator('[data-ltab="can-cu"]').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
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

test('SCR-98: Thay người ở bước chưa tới — bắt buộc chọn người, ảnh hưởng, lịch sử; luồng tới bước giao người mới', async ({ page }) => {
  const code = await newLuong(page);
  await openTab(page, code, 'nhan-su');
  await stepRow(page, '13').locator('[data-um-open]').click();
  await expect(page.locator('.vmodal')).toContainText('Cập nhật nhân sự');
  await expect(page.locator('.vmodal [data-vsel="um-step"] .vsel-label')).toContainText('13');
  await page.locator('#um-ok').click();
  await expect(page.locator('.vmodal')).toContainText('Bạn cần chọn người bị thay.');
  await expect(page.locator('.vmodal')).toContainText('Bạn cần chọn người thay thế.');
  await umPick(page, 'um-drop', ['hai']);
  await umPick(page, 'um-add', ['son']);
  await expect(page.locator('[data-um-impact]')).toContainText('Không có — luồng chưa tới bước này');
  await expect(page.locator('[data-um-impact]')).toContainText('Lý Văn Sơn');
  await page.locator('#um-file').setInputFiles({ name: 'QD-dieu-dong-123.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(8) });
  await page.locator('#um-reason').fill('Đi công tác');
  await page.locator('#um-ok').click();
  await expect(page.locator('.vmodal')).toHaveCount(0);
  expect(await lastToast(page)).toContain('Đã thay người ở bước 13');
  await expect(stepRow(page, '13')).toContainText('Lý Văn Sơn');
  await expect(stepRow(page, '13')).not.toContainText('theo vai trò');
  await page.locator('[data-ltab="lich-su"]').click();
  const row = page.locator('.vtable tbody tr').first();
  await expect(row).toContainText('Thay người');
  await expect(row).toContainText('Trần Đức Hải');
  await expect(row).toContainText('Lý Văn Sơn');
  await expect(row).toContainText('QD-dieu-dong-123.pdf');
  await expect(row).toContainText('Đi công tác');
  await expect(row).toContainText('Chưa tới bước');
  // Luồng tới bước 13: giao Sơn, ĐXMS lưu nhân sự mới.
  await runTo(page, 13);
  const st = await page.evaluate((c) => ({ who: Flow.state.tokens.find((t) => String(t.task) === '13').who, hai: Flow.tokensFor('hai').length, m: Flow.findDxms(c).members['13'] }), code);
  expect(st).toEqual({ who: 'son', hai: 0, m: ['son'] });
  expect(page.errors).toEqual([]);
});

test('SCR-98 từ màn xử lý task: Thay người task đang mở chuyển ngay; Bổ sung thêm candidate', async ({ page }) => {
  await newLuong(page);
  await page.locator('.task-acts [data-um-open]').click();
  await page.locator('.vmodal [data-vsel="um-step"]').click();
  await expect(page.locator('.vsel-panel [data-opt="1"]')).toContainText('Đang xử lý');
  await page.locator('.vsel-panel [data-opt="1"]').click();
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
  expect(await lastToast(page)).toContain('Đã bổ sung người ở bước 17');
  expect(await lastToast(page)).toContain('Đinh Thị Mai, Phạm Thị Lan');
  await runTo(page, 17);
  const t17 = await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '17').cands);
  expect(t17).toEqual(['mai', 'lan']);
  expect(page.errors).toEqual([]);
});

test('D-29 (3): thay người đã ký — văn bản đã ký giữ nguyên; tab Văn bản & ký duyệt; bước đã xong không chọn được', async ({ page }) => {
  const code = await newLuong(page);
  expect(await runTo(page, 42)).toBe(true);
  await openTab(page, code, 'van-ban');
  // Bước 17 ký hai lần (vòng giải trình quay lại 13 → 17) — lần đầu.
  const bm03 = page.locator('.vtable tbody tr', { hasText: 'BM-03' }).first();
  await expect(bm03).toContainText('Đinh Thị Mai');
  await expect(bm03).toContainText('Đã ký');
  await expect(page.locator('.vtable tbody tr', { hasText: 'Đang trình ký' })).toHaveCount(0);
  // Bước 17 đã xong → không có trong danh sách bước. Bước 42 (theo vai trò: Lan) thay bằng Mai.
  await page.evaluate((c) => Luong.membersDialog(c, null), code);
  await page.locator('.vmodal [data-vsel="um-step"]').click();
  await expect(page.locator('.vsel-panel [data-opt="17"]')).toHaveCount(0);
  await page.locator('.vsel-panel [data-opt="42"]').click();
  await umPick(page, 'um-drop', ['lan']);
  await umPick(page, 'um-add', ['mai']);
  await expect(page.locator('[data-um-impact]')).toContainText('Không có văn bản người bị thay đã ký');
  await page.locator('#um-ok').click();
  // Thay lại Mai (đã ký BM-03 ở bước 17) → BM-03 giữ nguyên.
  await page.evaluate((c) => Luong.membersDialog(c, '42'), code);
  await umPick(page, 'um-drop', ['mai']);
  await umPick(page, 'um-add', ['lan']);
  await expect(page.locator('[data-um-impact]')).toContainText('BM-03 (Đinh Thị Mai');
  await expect(page.locator('[data-um-impact]')).toContainText('giữ nguyên');
  await page.locator('#um-ok').click();
  await expect(bm03).toContainText('Đinh Thị Mai');
  await expect(bm03).toContainText('Đã ký');
  expect(await page.evaluate(() => Flow.state.tokens.find((t) => String(t.task) === '42').who)).toBe('lan');
  expect(page.errors).toEqual([]);
});
