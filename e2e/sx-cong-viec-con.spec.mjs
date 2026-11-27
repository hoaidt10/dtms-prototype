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
  const cell = rowCode(page, 'BT-2026-002').locator('td').nth(3); // STT, Thao tác (góp ý 27/11), Trạng thái, Phiếu bất thường
  await expect(cell.locator('a[title="Xem chi tiết phiếu bất thường"]')).toContainText('Khối quang học lệch trục quang');
  await expect(cell.locator('.faint')).toHaveText('BT-2026-002');
  await expect(rowCode(page, 'BT-2026-002')).toContainText('Sản xuất tổ hợp quan sát quang điện tử QĐ-12');
  expect(page.errors).toEqual([]);
});

test('Mục 4: chi tiết dự án — Tiến độ và chất lượng (Từ VMMS), Bất thường & thay đổi, Nghiệm thu sản phẩm (một bảng), Dữ liệu VMMS, Tài liệu', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'qt', '#/sx/du-an/DA-SX-2026-003');
  const tabs = await page.locator('[data-ttab]').allInnerTexts();
  expect(tabs).toContain('Tiến độ và chất lượng'); // góp ý 27/11: bỏ chữ (Từ VMMS)
  expect(tabs.join('|')).not.toContain('Từ VMMS');
  expect(tabs).toContain('Nghiệm thu sản phẩm');
  // Tiến độ và chất lượng: một bảng, có Số lỗi / Tỷ lệ đạt / IPQC; không còn Nhật ký sản lượng, Trạm đo, Định mức, nút Cập nhật.
  await page.locator('[data-ttab="btp"]').click();
  const btp = page.locator('[data-sx-btp]');
  await expect(btp.locator('table')).toHaveCount(2); // góp ý 27/11: bảng Tiến độ + bảng Chất lượng
  await expect(btp.locator('[data-btp-qual] thead')).toContainText('Tỷ lệ đạt');
  await expect(btp.locator('[data-sxnt-ipqc-new]')).toHaveCount(0); // bỏ Thêm mới
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

test('Góp ý 27/11: Hạng mục kế hoạch đầy đủ (công việc con theo việc cha, việc quy trình theo bước); dữ liệu cũ nhiều cấp gom về 1 cấp; dòng con không link việc cha', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  const heads = await page.locator('.vtable thead th').allInnerTexts(), iPlan = heads.indexOf('Hạng mục kế hoạch'), iPar = heads.indexOf('Công việc cha');
  await expect(rowCode(page, 'CV-SX-2026-001').locator('td').nth(iPlan)).toContainText('7. Bảo đảm máy móc');
  await expect(rowCode(page, 'HSBT-BT-2026-004-01').locator('td').nth(iPlan)).toContainText('9. Theo dõi sản lượng');
  await expect(rowCode(page, 'CV-SX-2026-001').locator('td').nth(iPar).locator('a')).toHaveCount(0);
  await page.evaluate(() => { const U = JSON.parse(localStorage.getItem('sx-proto-cv') || '{"created":[],"edit":{},"del":[],"log":{},"seq":{}}');
    U.ver = 3; U.created.push({ code: 'CV-SX-2026-090', kind: 'CN', title: 'Việc cháu (dữ liệu cũ)', project: 'DA-SX-2026-002', plan: null, parent: 'CV-SX-2026-003', owner: 'sxpm', assigner: 'sxpm', start: '2026-11-10', due: '2026-11-25', prio: 'TB', remind: 2, pct: 0, src: 'TAY', created: '2026-11-10', log: [] });
    localStorage.setItem('sx-proto-cv', JSON.stringify(U)); });
  await page.reload();
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  const no = (await rowCode(page, 'CV-SX-2026-006').locator('td.ord').innerText()).trim();
  await expect(rowCode(page, 'CV-SX-2026-090').locator('td.ord')).toHaveText(`${no}.4`);
  await as(page, 'sxpm', '#/sx/cong-viec/CV-SX-2026-003');
  expect(await page.locator('.tab').allInnerTexts()).toEqual(['Thông tin chung', 'Lịch sử cập nhật']);
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: dữ liệu cũ trùng mã việc mẫu được làm mới — dòng n.j mở đúng công việc con của dòng n', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  // Dữ liệu cũ (chưa có phiên bản): việc con tạo trước đây mang mã CV-SX-2026-006, trùng việc mẫu có 3 công việc con.
  await page.evaluate(() => localStorage.setItem('sx-proto-cv', JSON.stringify({ created: [{ code: 'CV-SX-2026-006', kind: 'CN', title: 'Việc con cũ trùng mã', project: 'DA-SX-2026-001', plan: null, parent: 'CV-SX-2026-004', owner: 'sxpm', assigner: 'sxpm', start: '2026-11-16', due: '2026-11-17', prio: 'TB', remind: 2, pct: 0, src: 'TAY', created: '2026-11-16', log: [] }], edit: {}, del: [], log: {}, seq: {} })));
  await page.reload();
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await expect(page.locator('.vtable tbody tr', { hasText: 'Việc con cũ trùng mã' })).toHaveCount(0);
  const rows = await page.locator('.vtable tbody tr').evaluateAll((l) => l.map((r) => [r.querySelector('td.ord').textContent.trim(), r.dataset.code]));
  const par = {};
  for (const [no, code] of rows) {
    if (!no.includes('.')) { par[no] = code; continue; }
    const x = await page.evaluate((c) => { const y = SxCv.byCode(c); return [y.code, y.parent]; }, code);
    expect(x, no).toEqual([code, par[no.split('.')[0]]]);
  }
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: Điều kiện SX có Thêm mới; Đề xuất mua sắm có Thêm mới / Sửa / Xoá; PASXKD, đề nghị nghiệm thu, OQC có Sửa / Xoá; Hồ sơ dự án điều hướng tab Tài liệu', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  // Điều kiện sản xuất: Thêm mới (cả khi đang sản xuất), mỗi dòng thêm có Sửa / Xoá.
  await as(page, 'qt', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="m4"]').click();
  await expect(page.locator('[data-m4-add]')).toContainText('Thêm điều kiện');
  // Đề xuất mua sắm: danh sách đề xuất của Sản xuất, Thêm mới mở cùng màn với tab dự án.
  await as(page, 'qt', '#/sx/mua-sam');
  await expect(page.locator('a[data-go="sx/mua-sam/create"], button[data-go="sx/mua-sam/create"]')).toHaveCount(1);
  await expect(page.locator('.vtable thead')).toContainText('Thao tác');
  await page.locator('[data-go="sx/mua-sam/create"]').click();
  await expect(page.locator('.pg-title')).toContainText('Lập đề xuất mua sắm');
  // PASXKD: phương án Đang chuẩn bị có Xoá; dòng đầu vào có Xoá.
  await as(page, 'qt', '#/sx/pasxkd');
  const draft = page.locator('.vtable tbody tr', { hasText: 'Đang chuẩn bị' }).first();
  await expect(draft.locator('[data-sxpa-del]')).toHaveCount(1);
  // Đề nghị nghiệm thu chờ OQC (NT-2026-005): Sửa / Xoá.
  await as(page, 'qt', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="nt"]').click();
  await expect(page.locator('[data-sxnt-lot-edit="NT-2026-005"]')).toHaveCount(1);
  await expect(page.locator('[data-sxnt-lot-del="NT-2026-005"]')).toHaveCount(1);
  await page.locator('[data-sxnt-lot-del="NT-2026-005"]').click();
  await page.locator('#cf-ok').click();
  await expect(page.locator('[data-sx-nt]')).not.toContainText('NT-2026-005');
  expect(await page.evaluate(() => SxFlow.caseOf('HSNT-NT-2026-005-01').status)).toBe('done');
  // Hồ sơ dự án → tab Tài liệu.
  await as(page, 'qt', '#/sx/ho-so');
  await page.locator('.vtable tbody tr', { hasText: 'DA-SX-2026-002' }).locator('a[title="Xem tài liệu của dự án"]').click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/DA-SX-2026-002\/docs$/);
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: PASXKD lập không cần nhiệm vụ; Chi tiết PASXKD không có nút Lập dự án (lập ở menu Dự án); Quản lý quy trình Sản xuất chỉ có 3 quy trình SX', async ({ page }) => {
  await fresh(page, '#/sx/pasxkd');
  // (1) Lập PASXKD không chọn nhiệm vụ.
  await as(page, 'sxpm', '#/sx/pasxkd');
  await page.locator('[data-sxpa-new]').first().click();
  await expect(page.locator('.vmodal')).toContainText('Nhiệm vụ được giao (không bắt buộc)');
  await page.locator('.vmodal [data-ef="title"]').fill('Phương án sản xuất độc lập');
  await page.locator('.vmodal [data-vsel="ef-product"]').click(); await page.locator('.vsel-panel [data-opt="VT-25"]').click();
  await page.locator('.vmodal [data-ef="qty"]').fill('10');
  await page.locator('.vmodal [data-vsel="ef-model"]').click(); await page.locator('.vsel-panel [data-opt]').first().click();
  await page.locator('.vmodal [data-ef="start"]').fill('01/01/2027');
  await page.locator('.vmodal [data-ef="due"]').fill('01/06/2027');
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/sx\/pasxkd\/PAKD-/);
  const pa = await page.evaluate(() => SxPa.all().find((x) => x.title === 'Phương án sản xuất độc lập'));
  expect(pa.nv).toBeNull();
  // (2) PASXKD đã phê duyệt: không có nút Lập dự án sản xuất; menu Dự án sản xuất › Thêm mới vẫn chọn được phương án không gắn nhiệm vụ.
  await as(page, 'sxpm', '#/sx/pasxkd/PAKD-2026-214');
  await expect(page.locator('.pg-head')).not.toContainText('Lập dự án sản xuất');
  await expect(page.locator('[data-go^="sx/du-an/create/"]')).toHaveCount(0);
  // (3) Quản lý quy trình của Sản xuất: 3 quy trình SX, không còn quy trình ĐTMS; ĐTMS giữ nguyên.
  await as(page, 'qt', '#/sx/quy-trinh');
  const qt = page.locator('main');
  for (const n of ['Quy trình hoạt động sản xuất', 'Quy trình quản lý bất thường trong sản xuất', 'Quy trình quản lý thay đổi kỹ thuật trong sản xuất']) await expect(qt).toContainText(n);
  await expect(qt).not.toContainText('đề xuất mua sắm');
  await expect(qt).not.toContainText('DTMS_MS01');
  await as(page, 'qt', '#/quy-trinh');
  await expect(page.locator('main')).toContainText('DTMS_MS01');
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: Hoàn thiện đầu vào — tải kèm / xoá tài liệu cho từng mục đầu vào (B1.1–B1.4); phương án đã duyệt chỉ xem', async ({ page }) => {
  await fresh(page, '#/sx/pasxkd');
  await as(page, 'sxpm', '#/sx/pasxkd/PAKD-2026-409');
  await page.locator('[data-ttab="dv"]').click();
  for (const s of ['B11', 'B12', 'B13', 'B14']) await expect(page.locator(`[data-sxpa="${s}"] thead`)).toContainText('Tài liệu');
  const up = page.locator('[data-sxpa="B11"] [data-sxpa-fup]').first();
  const key = await up.getAttribute('data-sxpa-fup');
  await up.setInputFiles([{ name: 'Van-ban-giao-nhiem-vu.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') }, { name: 'Bien-ban-hop.docx', mimeType: 'application/octet-stream', buffer: Buffer.from('y') }]);
  const cell = page.locator(`[data-sxpa-files="${key}"]`);
  await expect(cell).toContainText('Van-ban-giao-nhiem-vu.pdf');
  await expect(cell).toContainText('Bien-ban-hop.docx');
  await page.locator('[data-sxpa="B14"] [data-sxpa-fup]').first().setInputFiles({ name: 'Bao-gia-NCC.pdf', mimeType: 'application/pdf', buffer: Buffer.from('z') });
  await expect(page.locator('[data-sxpa="B14"]')).toContainText('Bao-gia-NCC.pdf');
  await cell.locator('[data-sxpa-frm$="|0"]').click();
  await page.locator('#cf-ok').click();
  await expect(cell).not.toContainText('Van-ban-giao-nhiem-vu.pdf');
  await expect(cell).toContainText('Bien-ban-hop.docx');
  // Giữ sau khi tải lại trang.
  await page.reload();
  await as(page, 'sxpm', '#/sx/pasxkd/PAKD-2026-409');
  await page.locator('[data-ttab="dv"]').click();
  await expect(page.locator(`[data-sxpa-files="${key}"]`)).toContainText('Bien-ban-hop.docx');
  // Phương án đã phê duyệt: không tải lên / xoá.
  await as(page, 'sxpm', '#/sx/pasxkd/PAKD-2026-214');
  await page.locator('[data-ttab="dv"]').click();
  await expect(page.locator('[data-sxpa-fup], [data-sxpa-frm]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: Điều kiện sản xuất — MD1, MD2 (Tài liệu, phương pháp công nghệ) người dùng tự Cập nhật tiến độ, Sửa, Xoá như các điều kiện khác', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'qt', '#/sx/du-an/DA-SX-2026-004');
  await page.locator('[data-ttab="m4"]').click();
  for (const ik of ['MD1', 'MD2']) {
    await expect(page.locator(`[data-m4="DA-SX-2026-004|${ik}"]`)).toHaveText('Cập nhật tiến độ');
    await expect(page.locator(`[data-m4-edit="DA-SX-2026-004|${ik}"], [data-m4-del="DA-SX-2026-004|${ik}"]`)).toHaveCount(2);
  }
  const row = page.locator('[data-sx-m4] tbody tr', { has: page.locator('[data-m4="DA-SX-2026-004|MD2"]') });
  await expect(row).toContainText('Chưa đạt');
  await expect(row).not.toContainText('Hệ thống');
  await page.locator('[data-m4="DA-SX-2026-004|MD2"]').click();
  await page.locator(`.vmodal [data-ef-radio="kq"][data-v='"DAT"']`).click();
  await page.locator('.vmodal #ok').click();
  await expect(row).toContainText('Đạt');
  await expect(row).not.toContainText('Chưa đạt');
  expect(page.errors).toEqual([]);
});

test('Góp ý 27/11: Bất thường sản xuất — cột Thao tác Sửa / Xoá ở danh sách và bảng Phiếu bất thường của tab dự án (phiếu Lưu nháp)', async ({ page }) => {
  await fresh(page, '#/sx/bat-thuong');
  await as(page, 'sxpm', '#/sx/bat-thuong');
  await expect(page.locator('.vtable thead')).toContainText('Thao tác');
  const draft = rowCode(page, 'BT-2026-005');
  await expect(draft.locator('[data-sxbt-edit], [data-sxbt-del]')).toHaveCount(2);
  await expect(rowCode(page, 'BT-2026-001').locator('[data-sxbt-edit], [data-sxbt-del]')).toHaveCount(0); // đã gửi xử lý
  await draft.locator('[data-sxbt-edit]').click();
  await expect(page.locator('.vmodal')).toContainText('Sửa phiếu bất thường');
  await expect(page).toHaveURL(/#\/sx\/bat-thuong$/); // không mở chi tiết
  await page.locator('.vmodal [data-close]').first().click();
  // Tab Bất thường & thay đổi của dự án: Xoá ở lại tab.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="bt"]').click();
  await expect(page.locator('[data-sx-bt] thead').first()).toContainText('Thao tác');
  const r = page.locator('[data-sx-bt] tbody tr', { hasText: 'BT-2026-005' });
  await expect(r.locator('[data-sxbt-edit], [data-sxbt-del]')).toHaveCount(2);
  await r.locator('[data-sxbt-del]').click();
  await page.locator('#cf-ok').click();
  await expect(page).toHaveURL(/#\/sx\/du-an\/DA-SX-2026-001/);
  await expect(page.locator('[data-sx-bt]')).not.toContainText('BT-2026-005');
  expect(page.errors).toEqual([]);
});
