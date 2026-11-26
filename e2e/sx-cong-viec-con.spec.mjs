// @ts-check
// Góp ý 26/11 (hoaidt10): bỏ nhãn trạng thái ở từng bước của tab Kế hoạch; Việc của tôi = giao diện danh sách Việc cá nhân cũ, tổng hợp công việc từ kế hoạch
// và công việc từ quy trình (Phân loại); việc giao theo bước kế hoạch là công việc (không phải nhiệm vụ đơn vị); nhiệm vụ đơn vị theo dõi tiến độ dự án;
// công việc con chỉ ở công việc từ kế hoạch (chi tiết 3 tab).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const pick = async (page, id, val) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const rows = (page) => page.locator('.vtable tbody tr');
const row = (page, text) => rows(page).filter({ hasText: text }).first();
const rowCode = (page, code) => page.locator(`.vtable tbody tr[data-code="${code}"]`).first();

test('Kế hoạch không còn nhãn trạng thái ở từng bước', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001/ke-hoach');
  await expect(page.locator('[data-sx-plan]')).toBeVisible();
  await expect(page.locator('[data-sx-plan]')).not.toContainText('Chờ duyệt điều chỉnh');
  expect(page.errors).toEqual([]);
});

test('Việc của tôi: giao diện Việc cá nhân cũ, 2 nguồn (Phân loại), việc quy trình mở màn Xử lý và sáng menu nghiệp vụ', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await expect(page.locator('.pg-title')).toContainText('Việc của tôi');
  await expect(page.locator('.sb-nav .nav.active').first()).toContainText('Việc của tôi');
  await expect(page.locator('.sb-nav', { hasText: 'Việc cá nhân' })).toHaveCount(0);
  // Giao diện danh sách cũ: ô chỉ số, tìm kiếm nâng cao, phân trang, cột Phân loại.
  await expect(page.locator('[data-sxcv-tile="CN|over"]')).toBeVisible();
  await expect(page.locator('[data-tl="sxcv-CN:adv"]')).toBeVisible();
  await expect(page.locator('[data-pager="sxcv-CN"]')).toBeVisible();
  await expect(page.locator('.vtable thead')).toContainText('Phân loại');
  // Công việc từ kế hoạch: Thêm công việc con; có công việc con thì không cập nhật tay.
  const kh = rowCode(page, 'CV-SX-2026-006');
  await expect(kh).toContainText('Công việc từ kế hoạch');
  await expect(kh.locator('[title="Thêm công việc con"]')).toHaveCount(1);
  await expect(kh.locator('[data-sxcv-upd]')).toHaveCount(0);
  await expect(rowCode(page, 'CV-SX-2026-004').locator('[data-sxcv-upd]')).toHaveCount(1);
  // Công việc từ quy trình: không có 2 nút trên; link tới phiếu bất thường.
  const qt = rowCode(page, 'HSBT-BT-2026-004-01');
  await expect(qt).toContainText('Công việc từ quy trình');
  await expect(qt.locator('[title="Thêm công việc con"], [data-sxcv-upd]')).toHaveCount(0);
  await expect(qt.locator('a[title="Xem chi tiết phiếu bất thường"]')).toHaveAttribute('data-go', 'sx/bat-thuong/BT-2026-004');
  // Tìm kiếm nâng cao theo Phân loại.
  await page.locator('[data-tl="sxcv-CN:adv"]').click();
  await pick(page, 'tf-sxcv-CN-loai', 'QT');
  await page.locator('[data-tadv="sxcv-CN"] button[type="submit"]').click();
  await expect(rows(page).filter({ hasText: 'Công việc từ kế hoạch' })).toHaveCount(0);
  await expect(rows(page).filter({ hasText: 'Công việc từ quy trình' }).first()).toBeVisible();
  await page.locator('[data-tl="sxcv-CN:reset"]').click();
  // Mở việc quy trình → màn Xử lý, menu sáng Bất thường sản xuất.
  await rowCode(page, 'HSBT-BT-2026-004-01').locator('a[title="Mở màn hình xử lý"]').click();
  await expect(page.locator('[data-sbar="process"]')).toContainText('Tiếp nhận');
  await expect(page.locator('.sb-nav .nav.active').first()).toContainText('Bất thường sản xuất');
  // Link cũ Việc cá nhân = Việc của tôi.
  await as(page, 'sxpm', '#/sx/cong-viec/ca-nhan');
  await expect(page.locator('.pg-title')).toContainText('Việc của tôi');
  expect(page.errors).toEqual([]);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
});

test('Việc giao theo bước kế hoạch (kick-off) → công việc ở Việc của tôi của người được giao (không phải nhiệm vụ đơn vị); nhiệm vụ đơn vị theo tiến độ dự án', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  // Kick-off chốt kế hoạch gốc (SX-KH bước 5) giao công việc cho bước 4–8 của kế hoạch.
  const made = await page.evaluate(() => { const before = SxCv.all().length; SxCv.fromPlan('DA-SX-2026-001'); return SxCv.all().slice(0, SxCv.all().length - before).length ? SxCv.all().filter((x) => x.project === 'DA-SX-2026-001' && x.src === 'KH') : []; });
  expect(made.length).toBeGreaterThan(0);
  expect([...new Set(made.map((x) => x.kind))]).toEqual(['CN']);
  const one = made[0];
  await as(page, one.owner, '#/sx/viec-cua-toi');
  await expect(rowCode(page, one.code)).toContainText('Công việc từ kế hoạch');
  await as(page, 'sxpm', '#/sx/cong-viec/don-vi');
  await expect(rows(page).filter({ hasText: one.title })).toHaveCount(0);
  // Nhiệm vụ đơn vị NV-SX-2026-001 (dự án DA-SX-2026-002): % = tiến độ dự án, không cập nhật tay, không có công việc con.
  const pct = await page.evaluate(() => SxDuAn.progressOf(SxDuAn.byCode('DA-SX-2026-002')));
  await expect(row(page, 'NV-SX-2026-001')).toContainText(`${pct}%`);
  await expect(row(page, 'NV-SX-2026-001')).toContainText('Theo tiến độ dự án');
  await as(page, 'sxpm', '#/sx/cong-viec/NV-SX-2026-001');
  expect(await page.locator('.tab').allInnerTexts()).toEqual(['Thông tin chung', 'Lịch sử cập nhật']);
  await expect(page.locator('[data-sxcv-detail]')).toContainText('(theo tiến độ dự án)');
  await expect(page.locator('[data-sxcv-upd], [data-go^="sx/cong-viec/create/CN/cha/"]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Công việc từ kế hoạch: chi tiết 3 tab, thêm công việc con (người cùng đơn vị), cập nhật tiến độ ở Việc của tôi, % việc cha tự tính; PM / lãnh đạo cấp cao theo dõi', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await rowCode(page, 'CV-SX-2026-006').locator('a[title="Xem chi tiết công việc"]').click();
  expect(await page.locator('.tab').allInnerTexts()).toEqual(['Thông tin chung', 'Công việc con (3)', 'Lịch sử cập nhật']);
  await expect(page.locator('[data-sxcv-detail]')).toContainText('63% (theo công việc con)');
  await page.locator('[data-go^="sx/cong-viec/create/CN/cha/"]').click();
  await page.locator('[data-vsel="cvf-owner"]').click();
  expect((await page.locator('.vsel-panel [data-opt]').evaluateAll((l) => l.map((o) => o.getAttribute('data-opt')))).sort()).toEqual(['sxpm', 'sxsub']);
  await page.locator('.vsel-panel [data-opt="sxsub"]').click();
  await page.locator('#cvf-title').fill('Hiệu chuẩn bàn đo quang học');
  await page.locator('#cvf-due').fill('20/11/2026');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('[data-sxcv-detail]')).toContainText('Hiệu chuẩn bàn đo quang học');
  // Người thực hiện cập nhật tiến độ ngay ở Việc của tôi.
  await as(page, 'sxsub', '#/sx/viec-cua-toi');
  const r = rowCode(page, 'CV-SX-2026-002');
  await r.locator('[data-sxcv-upd]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await page.locator('#cvu-pct').fill('100');
  await page.locator('#cvu-ok').click();
  await expect(rowCode(page, 'CV-SX-2026-002')).toContainText('Hoàn thành');
  await as(page, 'sxpm', '#/sx/cong-viec/CV-SX-2026-006');
  await expect(page.locator('[data-sxcv-detail]')).toContainText('63% (theo công việc con)'); // (50 + 100 + 100 + 0) / 4
  await as(page, 'sxceo', '#/sx/cong-viec/CV-SX-2026-002');
  await expect(page.locator('[data-sxcv-detail]')).toBeVisible();
  await as(page, 'sxkd', '#/sx/cong-viec/CV-SX-2026-002');
  await expect(page.locator('[data-sxcv-detail]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Mục 3: không còn cột mã riêng — mã kèm dưới tên (link có tooltip), dự án hiện tên kèm mã', async ({ page }) => {
  await fresh(page, '#/sx/bat-thuong');
  for (const r of ['sx/viec-cua-toi', 'sx/cong-viec/don-vi', 'sx/du-an', 'sx/bat-thuong', 'sx/thay-doi', 'sx/nghiem-thu', 'sx/mua-sam', 'sx/nhu-cau', 'sx/chuyen-giao', 'sx/pasxkd']) {
    await as(page, 'qt', '#/' + r);
    const heads = await page.locator('main th').evaluateAll((l) => l.map((x) => x.textContent.trim()));
    expect(heads.filter((h) => /^Mã\b/.test(h)), r).toEqual([]);
  }
  await as(page, 'sxpm', '#/sx/bat-thuong');
  const cell = rowCode(page, 'BT-2026-002').locator('td').nth(2); // STT, Trạng thái, Phiếu bất thường
  await expect(cell.locator('a[title="Xem chi tiết phiếu bất thường"]')).toContainText('Khối quang học lệch trục quang');
  await expect(cell.locator('.faint')).toHaveText('BT-2026-002');
  await expect(rowCode(page, 'BT-2026-002')).toContainText('Sản xuất tổ hợp quan sát quang điện tử QĐ-12');
  expect(page.errors).toEqual([]);
});

test('Mục 4: chi tiết dự án — Tiến độ và chất lượng (Từ VMMS), Bất thường & thay đổi, Nghiệm thu sản phẩm (một bảng), Dữ liệu VMMS, Tài liệu', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'qt', '#/sx/du-an/DA-SX-2026-003');
  const tabs = await page.locator('[data-ttab]').allInnerTexts();
  expect(tabs).toContain('Tiến độ và chất lượng (Từ VMMS)');
  expect(tabs).toContain('Nghiệm thu sản phẩm');
  // Tiến độ và chất lượng: một bảng, có Số lỗi / Tỷ lệ đạt / IPQC; không còn Nhật ký sản lượng, Trạm đo, Định mức, nút Cập nhật.
  await page.locator('[data-ttab="btp"]').click();
  const btp = page.locator('[data-sx-btp]');
  await expect(btp.locator('table')).toHaveCount(1);
  await expect(btp.locator('thead')).toContainText('Tỷ lệ đạt');
  await expect(btp).not.toContainText('Nhật ký sản lượng');
  await expect(btp.locator('[data-btp-up]')).toHaveCount(0);
  // Bất thường & thay đổi: không còn Nhật ký quản lý dự án.
  await page.locator('[data-ttab="bt"]').click();
  await expect(page.locator('main')).not.toContainText('Nhật ký quản lý dự án');
  // Nghiệm thu sản phẩm: một bảng gồm OQC và các lô.
  await page.locator('[data-ttab="nt"]').click();
  const nt = page.locator('[data-sx-nt]');
  await expect(nt.locator('table')).toHaveCount(1);
  await expect(nt).toContainText('Đánh giá chất lượng xuất xưởng (OQC)');
  await expect(nt).toContainText('NT-2026-001');
  await nt.locator('[data-sxnt-oqc-view]').first().click();
  await expect(page.locator('.vmodal')).toContainText('Nội dung đánh giá');
  await page.locator('.vmodal [data-close]').last().click();
  // Dữ liệu VMMS: thêm Đơn vị sản xuất, Trạm đo, Định mức vật tư, IQC.
  await page.locator('[data-ttab="vmms"]').click();
  for (const part of ['dv', 'tram', 'dm', 'iqc']) await expect(page.locator(`[data-vmms-part$="|${part}"]`)).toHaveCount(1);
  await page.locator('[data-vmms-part$="|dv"]').click();
  await expect(page.locator('[data-vmms-body="dv"]')).toContainText('Đơn vị sản xuất');
  // Tài liệu: không còn Chọn mẫu tài liệu; Thêm danh mục tài liệu; (+) thêm tên tài liệu; Tải file lên ở từng dòng.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await page.locator('[data-ttab="docs"]').click();
  await expect(page.locator('[data-sx-tpl]')).toHaveCount(0);
  await page.locator('[data-sx-doccat]').click();
  await page.locator('#sx-ask').fill('Hồ sơ thử nghiệm');
  await page.locator('#sx-ask-ok').click();
  await page.locator('[data-sx-docadd$="|DM-1"]').click();
  await page.locator('#sx-ask').fill('Biên bản thử rung');
  await page.locator('#sx-ask-ok').click();
  const r = page.locator('[data-sx-docs] tr', { hasText: 'Biên bản thử rung' });
  await expect(r).toContainText('Chưa có tệp');
  await r.locator('input[data-sx-docup]').setInputFiles({ name: 'BB-thu-rung.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await expect(page.locator('[data-sx-docs] tr', { hasText: 'Biên bản thử rung' })).toContainText('BB-thu-rung.pdf');
  await expect(page.locator('[data-sx-docs] tr', { hasText: 'Biên bản thử rung' })).toContainText('v1.0');
  expect(page.errors).toEqual([]);
});

test('Mục 5–6 và 1: Thêm mới đồng bộ trong / ngoài dự án; Hồ sơ chuyển giao không Thêm mới; nhiệm vụ đơn vị không có Công việc cha; tooltip điều hướng', async ({ page }) => {
  await fresh(page, '#/sx/chuyen-giao');
  await as(page, 'qt', '#/sx/chuyen-giao');
  await expect(page.locator('[data-sx-cg-new]')).toHaveCount(0);
  // Nhiệm vụ đơn vị: form Thêm mới không có Công việc cha.
  await as(page, 'qt', '#/sx/cong-viec/create/DV');
  await expect(page.locator('.pg-title')).toContainText('Thêm mới nhiệm vụ đơn vị');
  await expect(page.locator('[data-vsel="cvf-parent"]')).toHaveCount(0);
  // Công việc con (từ Thêm công việc con) vẫn khoá Công việc cha.
  await as(page, 'sxpm', '#/sx/cong-viec/create/CN/cha/CV-SX-2026-006');
  await expect(page.locator('[data-vsel="cvf-parent"]')).toHaveCount(1);
  // Nghiệm thu ngoài menu: Đề nghị nghiệm thu chọn dự án rồi mở cùng hộp thoại với tab dự án.
  await as(page, 'qt', '#/sx/nghiem-thu');
  await page.locator('[data-sxnt-pick]').click();
  await expect(page.locator('#sxnt-pick option')).not.toHaveCount(0);
  await page.locator('#sxnt-pick-ok').click();
  await expect(page.locator('.vmodal, .toast').first()).toBeVisible();
  // Tooltip: mọi link điều hướng có title.
  for (const r of ['sx/bat-thuong', 'sx/du-an', 'sx/viec-cua-toi', 'sx/du-an/DA-SX-2026-002']) {
    await as(page, 'qt', '#/' + r);
    await expect(page.locator('main a[data-go]').first()).toHaveAttribute('title', /.+/);
    expect(await page.locator('main a[data-go]:not([title])').count(), r).toBe(0);
  }
  await as(page, 'qt', '#/sx/bat-thuong');
  await expect(page.locator('main a[data-go^="sx/bat-thuong/"]').first()).toHaveAttribute('title', 'Xem chi tiết phiếu bất thường');
  expect(page.errors).toEqual([]);
});

test('Nhiệm vụ đơn vị: chi tiết không có Công việc cha; Cập nhật tiến độ chỉ ở nhiệm vụ chưa gắn dự án, chưa xong', async ({ page }) => {
  await fresh(page, '#/sx/cong-viec/don-vi');
  for (const [code, upd] of [['NV-SX-2026-001', 0], ['NV-SX-2026-003', 0], ['NV-SX-2026-005', 1], ['NV-SX-2026-006', 1], ['NV-SX-2026-007', 0], ['NV-SX-2026-008', 0]]) {
    await as(page, 'sxld', '#/sx/cong-viec/' + code);
    await expect(page.locator('[data-sxcv-detail]')).not.toContainText('Công việc cha');
    await expect(page.locator('[data-sxcv-upd]'), code).toHaveCount(upd);
  }
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: không sửa / xoá việc được giao (trừ công việc con tự chia, chưa cập nhật); công việc con 1 cấp; STT n.j; Ngày hoàn thành; nhiệm vụ đơn vị bỏ Giai đoạn, có Cập nhật tiến độ', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await expect(page.locator('.vtable thead')).toContainText('Ngày hoàn thành');
  // Việc được giao (từ kế hoạch): không Sửa / Xoá.
  const parent = rowCode(page, 'CV-SX-2026-006');
  await expect(parent.locator('[title="Sửa"], [title="Xoá"]')).toHaveCount(0);
  // Công việc con nằm dưới việc cha, STT n.1 – n.3.
  const no = (await parent.locator('td.ord').innerText()).trim();
  await expect(rowCode(page, 'CV-SX-2026-001').locator('td.ord')).toHaveText(`${no}.1`);
  await expect(rowCode(page, 'CV-SX-2026-003').locator('td.ord')).toHaveText(`${no}.3`);
  await expect(rowCode(page, 'CV-SX-2026-003')).toContainText('28/10/2026'); // ngày hoàn thành
  // Công việc con đã cập nhật tiến độ: không Sửa / Xoá; không chia tiếp.
  await expect(rowCode(page, 'CV-SX-2026-002').locator('[title="Sửa"], [title="Xoá"], [title="Thêm công việc con"]')).toHaveCount(0);
  // Công việc con mới tự chia, chưa cập nhật: Sửa / Xoá được.
  await as(page, 'sxpm', '#/sx/cong-viec/create/CN/cha/CV-SX-2026-006');
  await page.locator('[data-vsel="cvf-owner"]').click(); await page.locator('.vsel-panel [data-opt="sxsub"]').click();
  await page.locator('#cvf-title').fill('Kiểm tra lại đồng hồ đo lực xiết');
  await page.locator('#cvf-due').fill('19/11/2026');
  await page.locator('button[type="submit"]').click();
  const code = await page.evaluate(() => SxCv.all().find((x) => x.title === 'Kiểm tra lại đồng hồ đo lực xiết').code);
  expect(await page.locator('.tab').allInnerTexts()).toEqual(['Thông tin chung', 'Lịch sử cập nhật']); // chi tiết công việc con: không tab Công việc con
  await expect(page.locator('[data-go^="sx/cong-viec/create/CN/cha/"]')).toHaveCount(0);
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await expect(rowCode(page, code).locator('[title="Sửa"]')).toHaveCount(1);
  await expect(rowCode(page, code).locator('[title="Xoá"]')).toHaveCount(1);
  // Người được giao (sxsub) không sửa / xoá được công việc con được giao cho mình.
  await as(page, 'sxsub', '#/sx/viec-cua-toi');
  await expect(rowCode(page, code).locator('[title="Sửa"], [title="Xoá"]')).toHaveCount(0);
  await as(page, 'sxsub', `#/sx/cong-viec/${code}/edit`);
  await expect(page.locator('main')).toContainText('Không sửa được công việc được giao');
  // Nhiệm vụ đơn vị: bỏ cột Giai đoạn, icon Cập nhật tiến độ ở Thao tác.
  await as(page, 'sxpm', '#/sx/cong-viec/don-vi');
  await expect(page.locator('.vtable thead')).not.toContainText('Giai đoạn');
  await expect(rowCode(page, 'NV-SX-2026-005').locator('[data-sxcv-upd]')).toHaveCount(1);
  await expect(rowCode(page, 'NV-SX-2026-001').locator('[data-sxcv-upd]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
