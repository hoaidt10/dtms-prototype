// T11 B1 — PH09 Khoản đầu tư (plan docs/dtms/prototype-KDT-chuan-bi.md v0.3): KĐT là đối tượng cha (D-12).
// SCR-54 danh sách #/kdt, SCR-55 thêm mới / chỉnh sửa (không start quy trình), SCR-56 chi tiết, Thêm mới hồ sơ KĐT (khuôn SCR-25, D-7),
// trích luồng MS13 (BPMN_FLOWS.MS13, bản 12/10 từ T18) và engine luồng theo quy trình (D.flows).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|WBS|D-\d|P-\d/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const row = (page, code) => page.locator('.vtable tbody tr', { hasText: code });
const pick = async (page, id, text) => {
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: text }).first().click();
  // T45: Đề tài / dự án (k-nv) là chọn nhiều — danh sách giữ mở sau khi chọn, Escape để đóng.
  if (await page.locator('.vsel-panel').count()) await page.keyboard.press('Escape');
};

test('D-9: menu Khoản đầu tư mở #/kdt; route cũ #/ph/kdt chuyển hướng', async ({ page }) => {
  await fresh(page, '#/ph/kdt');
  await expect(page).toHaveURL(/#\/kdt$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách khoản đầu tư');
  await expect(page.locator('.sb-nav [data-go="kdt"]')).toHaveClass(/active/);
  expect(page.errors).toEqual([]);
});

test('SCR-54: cột, trạng thái suy từ hồ sơ, nhóm KĐT, phân trang, Xoá chỉ khi chưa có hồ sơ', async ({ page }) => {
  await fresh(page, '#/kdt');
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã KĐT', 'Tên KĐT', 'Đề tài / dự án', 'Đơn vị đề xuất', 'Loại KĐT', 'Nhóm KĐT', 'Tổng mức vốn (tỷ đồng)', 'Ngày gửi thẩm định', 'Người tạo', 'Ngày tạo', 'Ngày cập nhật']);
  await expect(page.locator('.vtable tbody tr')).toHaveCount(10);
  await expect(page.locator('[data-pager="kdt"] .tot')).toHaveText('Tổng số bản ghi: 14');
  await expect(row(page, 'KĐT-2026-0033').locator('.vbadge')).toHaveText('Chưa có hồ sơ');
  await expect(row(page, 'KĐT-2026-0033')).toContainText('Chưa xác định');
  await expect(row(page, 'KĐT-2026-0033').locator('[data-del-kdt]')).toHaveCount(1);
  await expect(row(page, 'KĐT-2026-0031').locator('.vbadge')).toHaveText('Đang lập hồ sơ gộp');
  await expect(row(page, 'KĐT-2026-0031')).toContainText('MS13');
  await expect(row(page, 'KĐT-2026-0031').locator('[data-del-kdt]')).toHaveCount(0);
  await expect(row(page, 'KĐT-2026-0029').locator('.vbadge')).toHaveText('Chờ xác nhận phân loại');
  // Trang 2: đã phê duyệt (tổng mức vốn = của hồ sơ Hoàn thành), chuyển MS14.
  await page.locator('[data-pager="kdt"] .pgn[data-pg="2"]').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(4);
  await expect(row(page, 'KĐT-2026-0012').locator('.vbadge')).toHaveText('Đã phê duyệt');
  await expect(row(page, 'KĐT-2026-0012')).toContainText('138,50');
  await expect(row(page, 'KĐT-2026-0018').locator('.vbadge')).toHaveText('Chuyển MS14');
  await expect(row(page, 'KĐT-2026-0018')).toContainText('MS14');
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('SCR-54: tìm kiếm Enter và tìm kiếm nâng cao (Nhóm KĐT, Trạng thái)', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('#kdt-kw').fill('smt');
  await page.locator('#kdt-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await page.locator('[data-kl="adv"]').click();
  await expect(page.locator('#kdt-kw')).toHaveCount(0);
  await pick(page, 'kf-group', 'Chưa xác định');
  await page.locator('[data-kdt-adv] button[type="submit"]').click();
  // 0033 (chưa có hồ sơ), 0030 (bước 8), 0029 (bước 11–12) chưa qua bước 12.
  await expect(page.locator('.vtable tbody tr')).toHaveCount(3);
  await page.locator('[data-kl="reset"]').click();
  // T45: "Đã phê duyệt chủ trương" là trạng thái khác — chọn đúng nhãn.
  await pick(page, 'kf-stage', /^Đã phê duyệt$/);
  await page.locator('[data-kdt-adv] button[type="submit"]').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  expect(page.errors).toEqual([]);
});

test('SCR-55: Thêm mới — bắt buộc, không có trường Quy trình, Lưu không start quy trình, mã KĐT-2026-0032', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('.pg-head [data-go="kdt/create"]').click();
  await expect(page).toHaveURL(/#\/kdt\/create$/);
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới khoản đầu tư');
  await expect(page.locator('main label', { hasText: /^Quy trình$/ })).toHaveCount(0);
  await page.locator('#k-save').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên KĐT.', 'Bạn cần chọn Đề tài / dự án.', 'Bạn cần chọn Lĩnh vực.', 'Bạn cần chọn Loại KĐT.', 'Bạn cần chọn Tính chất tài sản.']);
  await page.locator('#k-title').fill('Đầu tư hệ thống đo kiểm OTA tích hợp phục vụ nhiệm vụ KHCN 5G-A');
  // D-45: chọn nhiệm vụ / đề tài → Lĩnh vực mặc định theo nhiệm vụ
  await pick(page, 'k-nv', 'DT-KHCN-2027-002');
  await expect(page.locator('[data-vsel="k-field"]')).toContainText('Viễn thông - CNTT');
  await pick(page, 'k-type', 'Khoa học công nghệ');
  await pick(page, 'k-nature', 'Cần tích hợp');
  await page.locator('#k-est').fill('120,5');
  await page.locator('#k-save').click();
  await expect(page).toHaveURL(/#\/kdt$/);
  expect(await lastToast(page)).toContain('Thêm mới khoản đầu tư thành công');
  await expect(page.locator('.vtable tbody tr').first()).toContainText('KĐT-2026-0032');
  await expect(page.locator('.vtable tbody tr').first().locator('.vbadge')).toHaveText('Chưa có hồ sơ');
  await expect(page.locator('.vtable tbody tr').first()).toContainText('120,50');
  await expect(page.locator('.vtable tbody tr').first()).toContainText('DT-KHCN-2027-002 — Đề tài phát triển trạm 5G-Advanced năm 2027');
  expect(await page.evaluate(() => Flow.state.status)).toBe('new');
  // Lưu trên trình duyệt; xoá được khi chưa có hồ sơ.
  await page.reload();
  await row(page, 'KĐT-2026-0032').locator('[data-del-kdt]').click();
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('Xóa khoản đầu tư thành công');
  await expect(row(page, 'KĐT-2026-0032')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('SCR-56 / SCR-55 sửa: chi tiết, 3 yếu tố phân luồng khoá khi đã có hồ sơ, danh sách hồ sơ và tài liệu', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.locator('[data-pager="kdt"] .pgn[data-pg="2"]').click();
  await row(page, 'KĐT-2026-0012').locator('td').nth(4).click();
  await expect(page).toHaveURL(/#\/kdt\/K%C4%90T-2026-0012$/);
  await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết khoản đầu tư');
  await expect(page.locator('.ginfo')).toContainText('MS13 · KĐT đơn giản');
  await expect(page.locator('.ginfo')).toContainText('Hai giai đoạn (BM-01 → BM-03)');
  await expect(page.locator('.ginfo')).toContainText('138,50 tỷ đồng');
  // T45 (D-103): hồ sơ chủ trương + hồ sơ phê duyệt KĐT.
  await expect(page.locator('[data-kdt-profiles] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-kdt-profiles] tbody')).toContainText('Phê duyệt chủ trương KĐT');
  await expect(page.locator('[data-kdt-profiles] tbody')).toContainText('HS-2026-0012-2');
  await expect(page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('BM-18 Quyết định phê duyệt KĐT');
  await page.locator('.pg-head [data-go$="/edit"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Chỉnh sửa khoản đầu tư');
  await expect(page.locator('[data-vsel="k-field"]')).toHaveClass(/(^|\s)dis(\s|$)/);
  // KĐT chuyển MS14: hai hồ sơ, hồ sơ MS13 đã chuyển luồng.
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0018'); });
  await expect(page.locator('[data-kdt-profiles] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-kdt-profiles]')).toContainText('Đã chuyển luồng');
  await expect(page.locator('[data-kdt-profiles]')).toContainText('MS14 · KĐT thông thường');
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Tạo hồ sơ KĐT (khuôn SCR-25): ô KĐT, Quy trình khoá; Lưu start MS13, mở bước 01; KĐT đang có hồ sơ thì chặn', async ({ page }) => {
  await fresh(page, '#/kdt/' + encodeURIComponent('KĐT-2026-0033') + '/edit');
  await page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Thêm mới hồ sơ chủ trương KĐT');
  await expect(page.locator('#kc-name')).toHaveValue('Mở rộng dây chuyền SMT cho nhà máy sản xuất thử nghiệm');
  await expect(page.locator('#kc-proc')).toBeDisabled();
  await expect(page.locator('#kc-proc')).toHaveValue(/MS13 · MS14 · MS15/);
  await expect(page.locator('[data-vsel="kc-kdt"]')).toContainText('KĐT-2026-0033');
  await page.locator('#kc-draft').click();
  // Lưu nháp (khuôn SCR-96) = start quy trình MS13, việc bước 01 của người tạo còn mở — mở lại màn Lập hồ sơ chủ trương KĐT.
  await expect(page).toHaveURL(/#\/task\//);
  await expect(page.locator('.pg-title')).toHaveText('Lập hồ sơ chủ trương KĐT');
  await expect(page.locator('[data-vsel="kc-kdt"]')).toContainText('KĐT-2026-0033');
  await page.evaluate(() => { location.hash = '#/kdt/' + encodeURIComponent('KĐT-2026-0033') + '/edit'; });
  const r = page.locator('[data-kdt-profiles] tbody tr');
  await expect(r).toHaveCount(1);
  await expect(r).toContainText('HS-2026-0033');
  await expect(r).toContainText('Chưa xác định nhóm');
  await expect(r).toContainText('Chọn căn cứ và nội dung KĐT');
  await expect(r.locator('.vbadge')).toHaveText('Đang xử lý');
  // Đã có hồ sơ đang xử lý → không tạo thêm.
  await page.locator('[data-kdt-profiles] .vcard-h [data-go$="/tao-ho-so"]').click();
  await page.locator('#kc-draft').click();
  await expect(page.locator('.vfield.invalid .msg')).toHaveText('Khoản đầu tư đang có hồ sơ đang xử lý.');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(row(page, 'KĐT-2026-0033').locator('.vbadge')).toHaveText('Đang lập');
  expect(page.errors).toEqual([]);
});

test('T18 B1: trích MS13 bản 12/10 — 78 bước, 36 cổng, 9 sự kiện, 152 mũi tên; thẩm quyền, cổng phân luồng, gộp, vòng, khối ký chung đúng vị trí', async ({ page }) => {
  await fresh(page, '#/kdt');
  const f = await page.evaluate(() => {
    const x = window.BPMN_FLOWS.MS13;
    const gw = (name) => Object.keys(x.gateways).find((k) => x.gateways[k].name.startsWith(name));
    const out = (k) => x.edges.filter((e) => e[0] === k).map((e) => [e[1], e[2]]);
    return { page: x.page, tasks: Object.keys(x.tasks).length, gws: Object.keys(x.gateways).length, evs: Object.keys(x.events).length, edges: x.edges.length,
      t13: [x.tasks['13'].name, x.tasks['13'].type], and: Object.keys(x.gateways).filter((k) => x.gateways[k].kind === 'and').length,
      ms13: out(gw('Tổng mức vốn thực tế thuộc MS13')), gop: out(gw('Đủ 03 điều kiện lập hồ sơ gộp')), vong: out(gw('Hồ sơ đã thống nhất thuộc vòng nào')),
      after13: out('13'), sign: out(gw('Hồ sơ Mật')), starts: Object.keys(x.events).filter((k) => x.events[k].kind === 'start'),
      fam: [D.familyOf('MS01.03'), D.familyOf('MS13'), D.familyOf(null)], diagram: !!(window.BPMN_DIAGRAMS || {}).MS13 };
  });
  expect(f.page).toBe('MS13');
  expect([f.tasks, f.gws, f.evs, f.edges]).toEqual([78, 36, 9, 152]);
  expect(f.t13).toEqual(['Xác định thẩm quyền phê duyệt', 'service']);
  expect(f.and).toBe(2);
  expect(f.after13.length).toBe(1);
  expect(f.ms13.map((e) => e[1]).sort()).toEqual(['Không thuộc MS13', 'Thuộc MS13']);
  expect(f.gop.map((e) => e[0]).sort()).toEqual(['18', '39']);
  expect(f.vong.map((e) => e[0]).sort()).toEqual(['46', '55', 'G30']);
  expect(f.sign.map((e) => e[0]).sort()).toEqual(['75', '77']);
  expect(f.starts.sort()).toEqual(['S', 'S2']);
  expect(f.fam).toEqual(['MS01', 'MS13', 'MS01']);
  expect(f.diagram).toBe(true);
  expect(page.errors).toEqual([]);
});
