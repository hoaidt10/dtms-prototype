// @ts-check
// T74 — comment QLSX 17/11 (docs/sx/T74-comment-qlsx-1711.md). Lát A: #95 Dashboard + Gợi ý cho bạn, #98 trạng thái phiếu bất thường theo bước,
// #100 / #101 phân loại + mức độ + hồ sơ đính kèm BM.QLBT.01 ở bước lập phiếu.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const row = (page, code) => page.locator('.vtable tbody tr', { hasText: code });

test('#95: Dashboard đứng đầu menu; khối Gợi ý cho bạn tối đa 5 dòng, xếp theo mức khẩn, nút mở màn xử lý', async ({ page }) => {
  await fresh(page, '#/sx/tong-quan');
  await as(page, 'sxpm', '#/sx/tong-quan');
  await expect(page.locator('.sb-nav .nav .l').first()).toHaveText('Dashboard');
  await expect(page.locator('main h1, main .pg-h h1').first()).toContainText('Dashboard');
  const sug = page.locator('[data-sx-goi-y] .hd-alert');
  const n = await sug.count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThanOrEqual(5);
  // Giám đốc dự án có việc chưa xử lý → có gợi ý về việc; phiếu BT-2026-002 quá hạn → gợi ý mức đỏ đứng trước mức vàng.
  await expect(page.locator('[data-sx-goi-y]')).toContainText('việc');
  await expect(page.locator('[data-sx-goi-y]')).toContainText('BT-2026-002');
  const tones = await sug.evaluateAll((l) => l.map((e) => (e.classList.contains('error') ? 1 : e.classList.contains('warning') ? 2 : 3)));
  expect(tones).toEqual([...tones].sort((a, b) => a - b));
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await page.locator('[data-sx-goi-y] .hd-alert', { hasText: 'BT-2026-002' }).locator('button').click();
  await expect(page).toHaveURL(/#\/sx\/bat-thuong\/BT-2026-002$/);
  expect(page.errors).toEqual([]);
});

test('#98: trạng thái phiếu theo bước luồng — Chờ đánh giá giải pháp, Chờ đánh giá kết quả xử lý, Đã đóng; quá hạn tô đỏ ở Hạn xử lý', async ({ page }) => {
  await fresh(page, '#/sx/bat-thuong');
  await as(page, 'sxqa', '#/sx/bat-thuong');
  await expect(row(page, 'BT-2026-004')).toContainText('Chờ tiếp nhận');
  await expect(row(page, 'BT-2026-002')).toContainText('Đang xử lý');
  await expect(row(page, 'BT-2026-002').locator('.due-over')).toHaveCount(1);
  await expect(row(page, 'BT-2026-001')).toContainText('Đã đóng');
  // Chạy luồng BT-2026-004 tới bước 4, rồi bước 6.
  const go = (ci, values) => page.evaluate(([i, v]) => { const c = SxFlow.caseOf('HSBT-BT-2026-004-01'); SxFlow.complete(c.code, c.tokens[0].id, i, v); }, [ci, values]);
  await go(0, { blNguyenNhan: 'Thiếu CO.' });
  await go(-1, { paBienPhap: 'Bổ sung CO.', paHan: '30/11/2026' });
  await as(page, 'sxqa', '#/sx/bat-thuong');
  await expect(row(page, 'BT-2026-004')).toContainText('Chờ đánh giá giải pháp');
  await go(0, {});
  await go(-1, { tkKetQua: 'Đã nhận CO.' });
  await as(page, 'sxqa', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="bt"]').click();
  await expect(page.locator('[data-sx-bt] .vtable tbody tr', { hasText: 'BT-2026-004' })).toContainText('Chờ đánh giá kết quả xử lý');
  // Bộ lọc Trạng thái của danh sách dùng đúng 7 trạng thái theo bước.
  expect(await page.evaluate(() => SxBt.ST_LIST)).toEqual(['Chờ tiếp nhận', 'Đang đề xuất giải pháp', 'Chờ đánh giá giải pháp', 'Đang xử lý', 'Chờ đánh giá kết quả xử lý', 'Đang lưu hồ sơ', 'Đã đóng']);
  expect(page.errors).toEqual([]);
});

test('#100 / #101: phiếu có phân loại, mức độ, dự đoán nguyên nhân, hồ sơ đính kèm theo mục BM.QLBT.01; bước tiếp nhận không còn ô phân loại', async ({ page }) => {
  await fresh(page, '#/sx/bat-thuong');
  await as(page, 'sxpm', '#/sx/bat-thuong/BT-2026-004');
  await expect(page.locator('.ginfo').first()).toContainText('Nghiêm trọng');
  await expect(page.locator('.ginfo').first()).toContainText('Dự đoán sơ bộ nguyên nhân');
  const files = page.locator('.vcard', { hasText: 'Hồ sơ đính kèm (BM.QLBT.01)' });
  await expect(files).toContainText('BM.QLBT.01_BT-2026-004.pdf');
  await expect(files).toContainText('Hồ sơ IQC vật tư, linh kiện, bán thành phẩm');
  await expect(files).toContainText('Hồ sơ kiểm định / hiệu chuẩn phương tiện đo');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Form bước 2 (Hoàn thành tiếp nhận): không có Loại / Mức độ, có Tài liệu đính kèm.
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: 'BT-2026-004' }).first().click();
  await page.locator('[data-sx-do]', { hasText: 'Hoàn thành tiếp nhận' }).click();
  await expect(page.locator('.vmodal [data-vsel="ef-blLoai"]')).toHaveCount(0);
  await expect(page.locator('.vmodal [data-vsel="ef-blMucDo"]')).toHaveCount(0);
  await expect(page.locator('.vmodal [data-ef-file="blFile"]')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

test('#94 / #96: nhóm Quản lý nhiệm vụ (Việc của tôi có số, Nhiệm vụ đơn vị, Việc cá nhân); Việc của tôi có Bước n/N, Giai đoạn, Ngày nhận việc, Độ trễ', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxpm', '#/sx/viec-cua-toi');
  await expect(page.locator('.sb-nav .nav .l').nth(1)).toHaveText('Quản lý nhiệm vụ');
  await expect(page.locator('.sb-nav .nav.child .l')).toContainText(['Việc của tôi', 'Nhiệm vụ đơn vị', 'Việc cá nhân']);
  await expect(page.locator('.sb-nav .nav.child', { hasText: 'Việc của tôi' }).locator('.badge-n')).toHaveText(/\d+/);
  await expect(page.locator('[data-sx-tasks] thead th')).toHaveText(['STT', 'Trạng thái', 'Mã dự án', 'Tên công việc', 'Bước cần xử lý', 'Giai đoạn', 'Ngày nhận việc', 'Hạn xử lý', 'Ngày xử lý', 'Độ trễ']);
  const r = page.locator('[data-sx-tasks] tbody tr', { hasText: 'BT-2026-004' }).first();
  await expect(r).toContainText('DA-SX-2026-001');
  await expect(r).toContainText('2/7 Tiếp nhận');
  await expect(r).toContainText('3. Tổ chức sản xuất và giao hàng');
  // BT-2026-002 bước 5 của R&D đã quá hạn → Độ trễ theo ngày, tô đỏ.
  await as(page, 'sxrd', '#/sx/viec-cua-toi');
  const late = page.locator('[data-sx-tasks] tbody tr', { hasText: 'Triển khai theo loại' }).first();
  await expect(late.locator('td').last()).toHaveText(/^\d+ (ngày|giờ)$/);
  await expect(late.locator('td').last()).toHaveClass(/t-err/);
  // Độ trễ dưới 1 ngày ghi giờ.
  expect(await page.evaluate(() => SxFlow.delayTxt('2026-11-17', '2026-11-18 05:20'))).toBe('6 giờ');
  expect(await page.evaluate(() => SxFlow.delayTxt('2026-11-17', '2026-11-20 08:00'))).toBe('2 ngày');
  expect(await page.evaluate(() => SxFlow.delayTxt('2026-11-17', '2026-11-17 16:00'))).toBe('');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Nhiệm vụ đơn vị: cột như KHCN.
  await as(page, 'sxpm', '#/sx/cong-viec/don-vi');
  await expect(page.locator('main .vtable thead th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Nhiệm vụ', 'Chủ nhiệm · Đơn vị', 'Giai đoạn', 'Tiến độ', 'Ngày nhận nhiệm vụ', 'Hạn xử lý', 'Độ trễ (ngày)']);
  const nv = page.locator('main .vtable tbody tr', { hasText: 'NV-SX-2026-001' });
  await expect(nv).toContainText('2. Chuẩn bị sản xuất (4M)');
  await expect(nv.locator('.hd-bar')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});

const pickEf = async (page, key, val) => { await page.locator(`.vmodal [data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const ok = (page) => page.locator('.vmodal #ok').click();
const tab = (page, k) => page.locator(`[data-ttab="${k}"]`).click();

test('#97: Chi tiết dự án — thứ tự tab, Mã / Tên nhiệm vụ, bước 4 có 2 mục con, VMC: Ký hợp đồng tổng thầu trước bước 8', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await expect(page.locator('.tabs [data-ttab]')).toContainText(['Thông tin chung', 'Kế hoạch & mốc', 'Phê duyệt kế hoạch', 'Nhân sự', 'Hồ sơ chuyển giao', 'Điều kiện sản xuất']);
  const info = page.locator('.ginfo').first();
  await expect(info).toContainText('Mã nhiệm vụ');
  await expect(info.locator('a[data-go^="sx/cong-viec/NV-SX-"]')).toHaveCount(1);
  await tab(page, 'plan');
  await expect(page.locator('[data-sx-plan] tbody')).toContainText('Đề xuất mua sắm');
  await expect(page.locator('[data-sx-plan] tbody')).toContainText('Tiến độ cung ứng');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await tab(page, 'plan');
  // Cột STT của cây đánh số phân cấp (2.1, 3.1, 3.2.1 …) — chính là số mục người review dùng.
  const names = await page.locator('[data-sx-plan] tbody tr').allInnerTexts();
  expect(names.find((n) => n.includes('Ký hợp đồng tổng thầu với VMC'))).toMatch(/^3\.1\s/);
  expect(names.find((n) => n.includes('4. Bảo đảm vật tư'))).toMatch(/^2\.1\s/);
  const iHd = names.findIndex((n) => n.includes('Ký hợp đồng tổng thầu với VMC')), i8 = names.findIndex((n) => n.includes('8. Thống nhất phương án'));
  expect(iHd).toBeGreaterThan(-1);
  expect(iHd).toBeLessThan(i8);
  await expect(page.locator('[data-sx-plan] tbody')).not.toContainText('Vật tư, linh kiện về đủ');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('#97: Thêm kế hoạch → Chưa phê duyệt (không tính tiến độ) → Trình → Lãnh đạo phê duyệt; danh sách phê duyệt chưa duyệt đứng đầu', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  const before = await page.evaluate(() => SxDuAn.progressOf(SxDuAn.byCode('DA-SX-2026-002')));
  await tab(page, 'plan');
  await page.locator('[data-sxkh-add]').click();
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(4);
  await page.locator('.vmodal [data-ef="khTen"]').fill('Đánh giá năng lực nhà cung cấp vỏ cơ khí');
  await pickEf(page, 'khCha', 'G2');
  await pickEf(page, 'khNguoi', 'Trần Quốc Việt');
  await page.locator('.vmodal [data-ef="khKt"]').fill('01/11/2026');
  await page.locator('.vmodal [data-ef="khKt"]').press('Tab');
  await ok(page);
  await expect(page.locator('.toast').last()).toContainText('không được trước ngày bắt đầu');
  await page.locator('.vmodal [data-ef="khKt"]').fill('30/11/2026');
  await page.locator('.vmodal [data-ef="khKt"]').press('Tab');
  await ok(page);
  const row = page.locator('[data-sx-plan] tbody tr', { hasText: 'Đánh giá năng lực nhà cung cấp vỏ cơ khí' });
  await expect(row).toContainText('Chưa phê duyệt');
  expect(await page.evaluate(() => SxDuAn.progressOf(SxDuAn.byCode('DA-SX-2026-002')))).toBe(before);
  await tab(page, 'kh');
  const list = page.locator('[data-sx-kh-list] .vtable').first().locator('tbody tr');
  await expect(list.first()).toContainText('Bổ sung kế hoạch lần 1');
  await expect(list.first()).toContainText('Nháp');
  await list.first().locator('[data-sxkh-send]').click();
  await expect(list.first()).toContainText('Chờ phê duyệt');
  await expect(list.first().locator('[data-sxkh-ok]')).toHaveCount(0); // PM không tự duyệt
  await as(page, 'sxld', '#/sx/du-an/DA-SX-2026-002');
  await tab(page, 'kh');
  await page.locator('[data-sx-kh-list] [data-sxkh-ok]').click();
  await expect(page.locator('[data-sx-kh-list] .vtable').first().locator('tbody tr', { hasText: 'Bổ sung kế hoạch lần 1' })).toContainText('Đã phê duyệt');
  await tab(page, 'plan');
  await expect(page.locator('[data-sx-plan] tbody tr', { hasText: 'Đánh giá năng lực nhà cung cấp vỏ cơ khí' })).not.toContainText('Chưa phê duyệt');
  expect(page.errors).toEqual([]);
});

test('#97: Nhân sự (thêm, không xoá người đang phụ trách); Hồ sơ chuyển giao có Phiên bản, Nguồn; Điều kiện sản xuất thêm / sửa / xoá; Tài liệu theo loại', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await tab(page, 'ns');
  const ns = page.locator('[data-sx-ns] tbody tr');
  await expect(ns.filter({ hasText: 'Trần Quốc Việt' })).toHaveCount(1);
  await ns.filter({ hasText: 'Trần Quốc Việt' }).locator('[data-sxns-del]').click();
  await expect(page.locator('.toast').last()).toContainText('đang phụ trách');
  const n0 = await ns.count();
  await page.locator('[data-sxns-add]').click();
  const pick = await page.evaluate(() => D.personas.find((x) => x.id === 'sxld').name);
  await pickEf(page, 'nsTen', pick);
  await page.locator('.vmodal [data-ef="nsVaiTro"]').fill('Phê duyệt kế hoạch');
  await ok(page);
  await expect(ns).toHaveCount(n0 + 1);
  await ns.filter({ hasText: pick }).locator('[data-sxns-del]').click();
  await expect(ns).toHaveCount(n0);
  // Hồ sơ chuyển giao.
  await tab(page, 'cg');
  const cg = page.locator('[data-sx-cg] .vcard', { hasText: 'Danh mục tài liệu nhận từ COP1' });
  await expect(cg.locator('thead')).toContainText('Phiên bản');
  await expect(cg.locator('thead')).toContainText('Nguồn');
  await expect(cg).toContainText('Đồng bộ từ Quản lý hồ sơ KHCN');
  // DA-SX-2026-002: sản phẩm vào Kho trước khi có hệ thống → mã hồ sơ mở Sản phẩm sẵn sàng sản xuất; dự án có gói thì mở chi tiết gói (sx/chuyen-giao/<gói>).
  await expect(cg.locator('tbody a[data-go^="sx/san-pham"]').first()).toBeVisible();
  // Điều kiện sản xuất.
  await tab(page, 'm4');
  await expect(page.locator('[data-sx-m4] h3')).toHaveText('Điều kiện sản xuất');
  const all0 = await page.evaluate(() => SxCg.gate(SxDuAn.byCode('DA-SX-2026-002')).all);
  await page.locator('[data-m4-add]').click();
  await pickEf(page, 'gk', 'MAN');
  await page.locator('.vmodal [data-ef="iname"]').fill('Chứng chỉ an toàn bức xạ của tổ đo kiểm');
  await ok(page);
  expect(await page.evaluate(() => SxCg.gate(SxDuAn.byCode('DA-SX-2026-002')).all)).toBe(all0 + 1);
  const own = page.locator('[data-sx-m4] tbody tr', { hasText: 'Chứng chỉ an toàn bức xạ' });
  await expect(own.locator('[data-m4-del]')).toHaveCount(1);
  // Góp ý 27/11: tiêu chí mặc định cũng xoá được (có xác nhận); nút Cập nhật đổi thành Cập nhật tiến độ.
  const base = page.locator('[data-sx-m4] tbody tr', { hasText: 'Nhân sự phục vụ sản xuất' });
  await expect(base.locator('[data-m4-del]')).toHaveCount(1);
  await expect(base.locator('[data-m4]')).toHaveText('Cập nhật tiến độ');
  await own.locator('[data-m4-del]').click();
  await page.locator('#cf-ok').click();
  await expect(own).toHaveCount(0);
  expect(await page.evaluate(() => SxCg.gate(SxDuAn.byCode('DA-SX-2026-002')).all)).toBe(all0);
  await base.locator('[data-m4-del]').click();
  await page.locator('#cf-ok').click();
  await expect(base).toHaveCount(0);
  expect(await page.evaluate(() => SxCg.gate(SxDuAn.byCode('DA-SX-2026-002')).all)).toBe(all0 - 1);
  // Tài liệu theo loại.
  await tab(page, 'docs');
  // Góp ý 26/11 mục 4 (hoaidt10): Tài liệu là một bảng theo danh mục (dòng danh mục + dòng tài liệu), danh mục trống ghi "Chưa có tài liệu".
  await expect(page.locator('[data-sx-docs] table')).toHaveCount(1);
  await expect(page.locator('[data-sx-docs]')).toContainText('Chưa có tài liệu');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
