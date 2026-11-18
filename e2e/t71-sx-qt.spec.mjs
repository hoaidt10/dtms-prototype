// @ts-check
// T71 (b) — sửa prototype QLSX theo quy trình gốc QT.VHT.TTSX.4A.1.1 (QT-TTSX-4A11, plan T71 §10 Q1–Q15):
// căn cứ PAKD chọn từ danh sách, sản phẩm phải đã chuyển giao, SX-KH 5 bước mới (bước 1 không bắt buộc, BGĐ cho ý kiến, một lần phê duyệt, kick-off có biên bản),
// 14/27 hồ sơ chuyển giao bắt buộc, bàn giao tài liệu cho đơn vị sản xuất (SX-BGNM), 4M theo QT, Bên mua sắm + tập kết vật tư, IPQC, thử nghiệm thực tế,
// HOC / CO / CQ + nghiệm thu sau bao gói, trạng thái Nghiệm thu / Hoàn thành, dự án đợt tiếp theo.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 150000 });

const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const FILE = { name: 'tep.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const pickEf = (page, key, val) => pick(page, `ef-${key}`, val).then(() => {});
const ef = (page, key) => page.locator(`.vmodal [data-ef="${key}"]`);
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const tab = (page, t) => page.locator(`[data-ttab="${t}"]`).click();

test('Thêm mới dự án từ PAKD đã phê duyệt: điền sẵn, chỉ sản phẩm đã chuyển giao, PAKD dùng một lần', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/create');
  await pick(page, 'sxf-basis', 'PAKD');
  await pick(page, 'sxf-pakd', 'PAKD-2026-409');
  await expect(page.locator('#sxf-name')).toHaveValue('Sản xuất đài ra-đa cảnh giới tầm thấp RĐ-40 đợt 2');
  await expect(page.locator('[data-vsel="sxf-product"]')).toContainText('RĐ-40');
  await expect(page.locator('#sxf-qty')).toHaveValue('6');
  await expect(page.locator('#sxf-end')).toHaveValue('31/10/2027');
  await expect(page.locator('[data-vsel="sxf-khsxkd"]')).toContainText('năm 2027 — Khối 1');
  // Sản phẩm chưa chuyển giao (TS-08) không có trong danh sách.
  await page.locator('[data-vsel="sxf-product"]').click();
  await expect(page.locator('.vsel-panel [data-opt="TS-08"]')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.locator('.pg').first().click({ position: { x: 5, y: 5 } });
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.vfield.invalid')).toHaveCount(3); // mô hình, có thử nghiệm, ngày bắt đầu
  await pick(page, 'sxf-model', 'VHT_TU_SX');
  await pick(page, 'sxf-trial', 'Y');
  await page.locator('#sxf-start').fill('01/12/2026');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/DA-SX-2026-005$/);
  await expect(page.locator('.ginfo')).toContainText('PAKD số 409/PAKD-VHT ngày 09/11/2026');
  await expect(page.locator('.ginfo')).toContainText('Có thử nghiệm thực tế');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await tab(page, 'docs');
  await expect(page.locator('[data-sx-docs]')).toContainText('PAKD 409-PAKD-VHT.pdf');
  // PAKD đã lập dự án thì không còn trong danh sách; căn cứ Nhiệm vụ bắt buộc đính kèm văn bản.
  await as(page, 'sxpm', '#/sx/du-an/create');
  await pick(page, 'sxf-basis', 'PAKD');
  await page.locator('[data-vsel="sxf-pakd"]').click();
  await expect(page.locator('.vsel-panel [data-opt="PAKD-2026-409"]')).toHaveCount(0);
  await expect(page.locator('.vsel-panel [data-opt="PAKD-2026-214"]')).toHaveCount(0); // đã có DA-SX-2026-001
  await page.keyboard.press('Escape');
  await pick(page, 'sxf-basis', 'NV');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.vfield.invalid', { hasText: 'văn bản căn cứ' })).toHaveCount(2); // số văn bản, tệp văn bản
  expect(page.errors).toEqual([]);
});

test('SX-KH: bước 1 bỏ qua được (ghi lý do); trình báo cáo → BGĐ cho ý kiến → kế hoạch → phê duyệt → kick-off có biên bản, quyết định', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  const mk = (code, name) => ({ code, name, khoi: 'K1', basis: ['NV', 'QĐ 2001/QĐ-VHT'], product: 'RĐ-40', version: 'v1.3', model: 'VHT_TU_SX', qty: 6, unitName: 'bộ', factory: 'NM-HL', pm: 'sxpm',
    start: '2026-12-01', end: '2027-09-30', customer: '', goal: '', trial: true, status: 'PLANNING', perf: 0, cap: 0, baseline: null, creator: 'sxpm', created: '2026-11-16', docs: [], hist: [] });
  await page.evaluate((l) => localStorage.setItem('sx-proto-du-an', JSON.stringify({ created: l, edit: {}, docs: {}, hist: {} })), [mk('DA-SX-2026-005', 'RĐ-40 đợt A'), mk('DA-SX-2026-006', 'RĐ-40 đợt B')]);
  await page.reload();
  // Bỏ qua báo cáo phương án → thẳng bước 3.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-005');
  await page.locator('[data-sx-kh-start]').click();
  await expect(page.locator('[data-sbar="process"]')).toContainText('Bước 1 · Lập báo cáo phương án sản xuất (không bắt buộc)');
  await page.locator('[data-sx-do]', { hasText: 'Không lập báo cáo' }).click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await ef(page, 'paLyDo').fill('Không có ràng buộc cần xin ý kiến.');
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxpm', 'Lập kế hoạch sản xuất dự án');
  await expect(page.locator('[data-sx-kh]')).toContainText('Không lập');

  // Đường đầy đủ.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-006');
  await page.locator('[data-sx-kh-start]').click();
  await page.locator('[data-sx-do]', { hasText: 'Trình Ban Giám đốc Khối' }).click();
  await expect(page.locator('.vmodal')).toContainText('Vật tư leadtime dài, Export License');
  await ef(page, 'paTomTat').fill('Tự tổ chức sản xuất 6 bộ.');
  await page.locator('.vmodal [data-ef-add="paRangBuoc"]').click();
  await ef(page, 'paRangBuoc::0::noiDung').fill('Module RF cần Export License');
  await ef(page, 'paRangBuoc::0::deXuat').fill('Mua trước đợt 1');
  await page.locator('.vmodal [data-ef-file="paFile"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await openTask(page, 'sxld', 'Ban Giám đốc Khối cho ý kiến chỉ đạo');
  await page.locator('[data-sx-do]', { hasText: 'Đồng ý phương án' }).click();
  await ef(page, 'cdNoiDung').fill('Đồng ý mua trước module RF.');
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxpm', 'Lập kế hoạch sản xuất dự án');
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.vmodal')).toContainText('Đồng ý mua trước module RF.');
  await ef(page, 'khSo').fill('206/KH-TTSX');
  await ef(page, 'khMucTieu').fill('Sản xuất 6 bộ.');
  await ef(page, 'khKr1').fill('Nghiệm thu 6 bộ');
  await ef(page, 'khYeuCau').fill('Đạt chỉ tiêu.');
  await ef(page, 'khPhuongAn').fill('VHT tự sản xuất.');
  await page.locator('.vmodal [data-ef-file="khPl1"]').setInputFiles(FILE);
  await page.locator('.vmodal [data-ef-file="khPl6"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxld', 'Ban Giám đốc Khối phê duyệt kế hoạch sản xuất');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await page.locator('.vmodal #ok').click();
  await page.locator('.vmodal [data-mysign-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await openTask(page, 'sxpm', 'Họp kick-off');
  await page.locator('[data-sx-do]').click();
  await ef(page, 'koNgay').fill('18/11/2026');
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(2); // quyết định giao nhiệm vụ, biên bản kick-off
  await page.locator('.vmodal [data-ef-file="koQuyetDinh"]').setInputFiles(FILE);
  await page.locator('.vmodal [data-ef-file="koBienBan"]').setInputFiles({ name: 'bien-ban-kickoff.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-006');
  await expect(page.locator('.ginfo').first()).toContainText('Chuẩn bị sản xuất');
  await tab(page, 'docs');
  await expect(page.locator('[data-sx-docs]')).toContainText('Biên bản kick-off');
  await expect(page.locator('[data-sx-docs]')).toContainText('Quyết định giao nhiệm vụ PM, nhóm dự án');
  await expect(page.locator('[data-sx-docs]')).toContainText('Báo cáo phương án sản xuất');
  await tab(page, 'plan');
  await expect(page.locator('[data-sx-plan]')).toContainText('11. Thử nghiệm thực tế');
  expect(page.errors).toEqual([]);
});

test('Hồ sơ chuyển giao Khối 1: 14 hồ sơ bắt buộc theo QT; gói TS-08 thiếu 2 hồ sơ bắt buộc', async ({ page }) => {
  await fresh(page, '#/sx/chuyen-giao');
  await as(page, 'sxrd', '#/sx/chuyen-giao/GCG-TS-08-01');
  await expect(page.locator('.ginfo')).toContainText('12 / 14');
  await tab(page, 'hs');
  await expect(page.locator('[data-cg-docs]')).toContainText('Không bắt buộc');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Bàn giao tài liệu cho đơn vị sản xuất: checklist → nhà máy tiếp nhận → kiểm tra QTCN → BGĐ phê duyệt → 4M tự đạt', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await tab(page, 'cg');
  await page.locator('[data-sx-nm-start]').click();
  await expect(page.locator('[data-sbar="process"]')).toContainText('Lập checklist bàn giao tài liệu');
  await page.locator('[data-sx-do]').click();
  await expect(ef(page, 'ckLan')).toHaveValue('1');
  await expect(page.locator('.vmodal')).toContainText('Quy trình công nghệ lắp ráp');
  await page.locator('.vmodal [data-ef-file="ckFile"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxnm', 'Đơn vị sản xuất tiếp nhận');
  await page.locator('[data-sx-do]', { hasText: 'Xác nhận tiếp nhận' }).click();
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxpm', 'Kiểm tra quy trình công nghệ');
  await page.locator('[data-sx-do]', { hasText: 'Đạt' }).click();
  await ef(page, 'ktKetQua').fill('Nhà máy thực hiện đúng quy trình công nghệ.');
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxld', 'phê duyệt bàn giao tài liệu');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await tab(page, 'm4');
  await expect(page.locator('[data-sx-m4]')).toContainText('Bàn giao lần 1');
  await expect(page.locator('[data-sx-m4]')).toContainText('Phương tiện đo lường, thử nghiệm còn hạn kiểm định');
  // Đào tạo: Đạt bắt buộc biên bản xác nhận nội dung đào tạo.
  await page.locator('[data-m4="DA-SX-2026-002|MAN2"]').click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef-file="file"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await tab(page, 'docs');
  await expect(page.locator('[data-sx-docs]')).toContainText('Biên bản xác nhận nội dung đào tạo');
  await expect(page.locator('[data-sx-docs]')).toContainText('Checklist bàn giao tài liệu cho nhà máy');
  expect(page.errors).toEqual([]);
});

test('Vật tư: Bên mua sắm theo mô hình; dòng đối tác mua không lập đề xuất; cập nhật tập kết vật tư', async ({ page }) => {
  await fresh(page, '#/sx/nhu-cau');
  await as(page, 'sxpm', '#/sx/nhu-cau');
  await expect(page.locator('thead')).toContainText('Bên mua sắm');
  await expect(page.locator('tbody')).toContainText('Đối tác mua'); // VT-25 VMC: vật tư leadtime ngắn
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await tab(page, 'ms');
  const sup = page.locator('[data-sxnc-sup]');
  await expect(sup).toContainText('Tiến độ tập kết vật tư');
  await sup.locator('[data-sxnc-sup-up]').first().click();
  await ef(page, 'supQty').fill('40');
  await page.locator('.vmodal [data-ef-file="supFile"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(sup).toContainText('Đã tập kết đủ');
  expect(page.errors).toEqual([]);
});

test('IPQC không đạt tự lập phiếu bất thường; thử nghiệm thực tế; đủ nhập kho thì Đóng dự án → Hoàn thành → Lập dự án đợt tiếp theo', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxqa', '#/sx/du-an/DA-SX-2026-001');
  await tab(page, 'nt');
  await expect(page.locator('[data-sxnt-ipqc]')).toContainText('IPQC-2026-001');
  await page.locator('[data-sxnt-ipqc-new]').click();
  await pickEf(page, 'item', 'M3');
  await pickEf(page, 'stage', 'Lắp ráp, tích hợp');
  await ef(page, 'n').fill('10');
  await ef(page, 'ok').fill('8');
  await page.locator('.vmodal [data-ef-radio="kq"][data-v=\'"NOK"\']').click();
  await ef(page, 'note').fill('2 bộ sai lệch tần số.');
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.toast').last()).toContainText('phiếu bất thường');
  await expect(page.locator('[data-sxnt-ipqc] tbody tr').first()).toContainText('Không đạt');
  await expect(page.locator('[data-sxnt-trial]')).toContainText('Đã duyệt kịch bản, kế hoạch');
  // Thử nghiệm Đạt (ĐV NCPT).
  await as(page, 'sxrd', '#/sx/du-an/DA-SX-2026-001');
  await tab(page, 'nt');
  await page.locator('[data-sxnt-trial-up]').click();
  await page.locator('.vmodal [data-ef-radio="kq"][data-v=\'"DAT"\']').click();
  await page.locator('.vmodal [data-ef-file="kqFile"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('[data-sxnt-trial]')).toContainText('Đạt');
  // Đủ nhập kho: giả lập 40 / 40 đã nhập kho, dự án Nghiệm thu.
  await page.evaluate(() => {
    localStorage.setItem('sx-proto-nt', JSON.stringify({ created: [{ code: 'NT-2026-090', project: 'DA-SX-2026-001', item: 'M4', qty: 28, from: 13, to: 40, creator: 'sxpm', created: '2026-11-16', oqc: 'DAT', bb: 'BB-1', cert: 'CQ-1', pnk: 'PNK-1', stocked: '2026-11-16' }],
      edit: { 'NT-2026-005': { oqc: 'DAT', bb: 'BB-2', cert: 'CQ-2', pnk: 'PNK-2', stocked: '2026-11-16' } }, ipqc: [], trial: {} }));
    SxDuAn.patch('DA-SX-2026-001', { status: 'ACCEPTANCE' });
  });
  await page.reload();
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-sxnt-close]').click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await page.locator('.vmodal [data-ef-chk="ok"]').check();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.ginfo').first()).toContainText('Hoàn thành');
  await page.locator('[data-sx-next]').click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/create$/);
  await expect(page.locator('[data-vsel="sxf-prev"]')).toContainText('DA-SX-2026-001');
  await expect(page.locator('#sxf-name')).toHaveValue(/đợt tiếp theo$/);
  expect(page.errors).toEqual([]);
});

test('Nghiệm thu lô: biên bản có HOC, CO / CQ; nhập kho yêu cầu xác nhận bao gói', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await openTask(page, 'sxqa', 'Đánh giá chất lượng xuất xưởng');
  await page.locator('[data-sx-do]', { hasText: 'Đạt' }).first().click();
  await ef(page, 'oqcMau').fill('AQL 1.0');
  await ef(page, 'oqcKetQua').fill('Đạt');
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxqa', 'Lập biên bản nghiệm thu cấp Tổng công ty');
  await page.locator('[data-sx-do]').click();
  await ef(page, 'bbSo').fill('55/BB-NT');
  await ef(page, 'bbNgay').fill('16/11/2026');
  await ef(page, 'bbKetLuan').fill('Đạt');
  await page.locator('.vmodal [data-ef-file="bbFile"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1); // HOC
  await page.locator('.vmodal [data-ef-file="bbHoc"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxld', 'Phê duyệt nghiệm thu');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await page.locator('.vmodal #ok').click();
  await page.locator('.vmodal [data-mysign-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await openTask(page, 'sxpm', 'Bao gói, nghiệm thu sau bao gói');
  await page.locator('[data-sx-do]').click();
  await ef(page, 'nkKho').fill('Kho TCT');
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(2); // xác nhận bao gói, biên bản sau bao gói
  expect(page.errors).toEqual([]);
});
