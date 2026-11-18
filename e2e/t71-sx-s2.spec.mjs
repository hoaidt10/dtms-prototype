// @ts-check
// T71 S2 (D-121): luồng SX-KH Phê duyệt kế hoạch sản xuất — Việc của tôi (SX-15), xử lý việc (SX-05) với eForm BM.QLHDSX.01, kick-off chốt kế hoạch gốc.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 120000 }); // luồng nhiều bước, nhiều lần đổi vai

const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const FILE = { name: 'tep.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') };
/* Mở việc đầu tiên ở tab Chưa xử lý của Việc của tôi. */
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const ef = (page, key) => page.locator(`.vmodal [data-ef="${key}"]`);

test('Việc của tôi Sản xuất: hồ sơ mẫu chờ Ban Giám đốc Khối phê duyệt, quá hạn; mở việc thấy dự án Khối 2 và nội dung kế hoạch', async ({ page }) => {
  await fresh(page, '#/sx/viec-cua-toi');
  await as(page, 'sxld', '#/sx/viec-cua-toi');
  await expect(page.locator('.sb-nav [data-go="sx/viec-cua-toi"]')).toHaveClass(/active/);
  await expect(page.locator('.topbar .bell .count')).toHaveText('1');
  const row = page.locator('[data-sx-tasks] tbody tr');
  await expect(row).toHaveCount(1);
  await expect(row).toContainText('DA-SX-2026-004');
  await expect(row).toContainText('Quá hạn');
  await expect(row).toContainText('Ban Giám đốc Khối phê duyệt kế hoạch sản xuất');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await row.click();
  await expect(page.locator('.pg-title')).toContainText('Xử lý công việc');
  await expect(page.locator('[data-sbar="process"] .sbar-late')).toBeVisible();
  await expect(page.locator('[data-sbar="process"] [data-sx-do]')).toHaveText(['Phê duyệt', 'Trả lại']);
  await page.locator('[data-ttab="kh"]').click();
  await expect(page.locator('[data-sx-kh]')).toContainText('118/KH-TTSX');
  await expect(page.locator('[data-sx-kh]')).toContainText('Linh kiện leadtime dài về đủ');
  await expect(page.locator('.sb-nav [data-go="sx/viec-cua-toi"]')).toHaveClass(/active/);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Người khác không xử lý được việc của Lãnh đạo.
  const url = page.url().split('#')[1];
  await as(page, 'sxpm', '#' + url);
  await expect(page.locator('main')).toContainText('Bạn không có quyền xử lý công việc này.');
  expect(page.errors).toEqual([]);
});

test('SX-KH từ đầu đến cuối: khởi tạo, phương án, kế hoạch, yêu cầu chỉnh sửa, trình lại, phê duyệt, kick-off chốt kế hoạch gốc', async ({ page }) => {
  await fresh(page, '#/sx/du-an');
  // DA-004 đã có hồ sơ mẫu đang chạy: không khởi tạo thêm.
  await as(page, 'sxk2', '#/sx/du-an/DA-SX-2026-004');
  await expect(page.locator('.pg-title')).toContainText('Xem chi tiết dự án sản xuất');
  await expect(page.locator('[data-sx-kh-start]')).toHaveCount(0);
  // Dự án mới của sxpm.
  await page.evaluate(() => { localStorage.setItem('sx-proto-du-an', JSON.stringify({ created: [{ code: 'DA-SX-2026-005', name: 'Sản xuất đài ra-đa RĐ-40 đợt 1', khoi: 'K1', basis: ['NV', 'QĐ 2001/QĐ-VHT'],
    product: 'RĐ-40', version: 'v1.3', model: 'VHT_TU_SX', qty: 6, unitName: 'bộ', factory: null, pm: 'sxpm', start: '2026-12-01', end: '2027-09-30', customer: '', goal: '',
    status: 'PLANNING', perf: 0, cap: 0, baseline: null, creator: 'sxpm', created: '2026-11-16', docs: [], hist: [] }], edit: {}, docs: {}, hist: {} })); });
  await page.reload();
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-005');
  await page.locator('[data-sx-kh-start]').click();
  await expect(page).toHaveURL(/#\/sx\/viec\/HSKH-DA-SX-2026-005-01\//);
  await expect(page.locator('[data-sbar="process"]')).toContainText('Bước 1 · Lập báo cáo phương án sản xuất');

  // Bước 1: báo cáo phương án (không bắt buộc — chọn Trình Ban Giám đốc Khối thì báo cáo bắt buộc).
  await page.locator('[data-sx-do]', { hasText: 'Trình Ban Giám đốc Khối' }).click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(2);
  await ef(page, 'paTomTat').fill('Tự tổ chức sản xuất 6 bộ, thuê gia công bo mạch.');
  await page.locator('.vmodal #ef-draft').click();
  await expect(page.locator('.vmodal')).toHaveCount(0);
  await page.locator('[data-sx-do]', { hasText: 'Trình Ban Giám đốc Khối' }).click();
  await expect(ef(page, 'paTomTat')).toHaveValue('Tự tổ chức sản xuất 6 bộ, thuê gia công bo mạch.');
  await page.locator('.vmodal [data-ef-file="paFile"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  // Bước 2: Ban Giám đốc Khối cho ý kiến chỉ đạo (bắt buộc).
  await openTask(page, 'sxld', 'Ban Giám đốc Khối cho ý kiến chỉ đạo');
  await page.locator('[data-sx-do]', { hasText: 'Đồng ý phương án' }).click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await ef(page, 'cdNoiDung').fill('Đồng ý phương án thuê gia công bo mạch.');
  await page.locator('.vmodal #ok').click();

  // Bước 3: kế hoạch BM.QLHDSX.01 — mốc chính và nhân sự điền sẵn theo khung kế hoạch.
  await openTask(page, 'sxpm', 'Lập kế hoạch sản xuất dự án');
  await page.locator('[data-sx-do]').click();
  await expect(page.locator('.vmodal')).toContainText('Đồng ý phương án thuê gia công bo mạch.');
  await expect(page.locator('.vmodal [data-ef="khMoc::0::ten"]')).toHaveValue('Hoàn thành giai đoạn lập kế hoạch');
  await expect(page.locator('.vmodal [data-ef="khNhanSu::0::hoTen"]')).toHaveValue('Trần Quốc Việt');
  await ef(page, 'khSo').fill('205/KH-TTSX');
  await ef(page, 'khMucTieu').fill('Sản xuất 6 bộ RĐ-40 đạt chỉ tiêu.');
  await ef(page, 'khKr1').fill('Nghiệm thu 6 bộ trước 30/09/2027');
  await ef(page, 'khYeuCau').fill('Đạt chỉ tiêu chiến-kỹ thuật.');
  await ef(page, 'khPhuongAn').fill('VHT tự tổ chức sản xuất.');
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(2); // Phụ lục I, VI
  await page.locator('.vmodal [data-ef-file="khPl1"]').setInputFiles(FILE);
  await page.locator('.vmodal [data-ef-file="khPl6"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  // Đang chờ Ban Giám đốc Khối: không còn Chỉnh sửa.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-005');
  await expect(page.locator('[data-go$="/edit"]')).toHaveCount(0);

  // Bước 4: Ban Giám đốc Khối trả lại (ý kiến bắt buộc) → về bước 3.
  await openTask(page, 'sxld', 'Ban Giám đốc Khối phê duyệt kế hoạch sản xuất');
  await page.locator('[data-sx-do]', { hasText: 'Trả lại' }).click();
  await page.locator('.vmodal #ok').click();
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1);
  await ef(page, 'ykNoiDung').fill('Bổ sung mốc thử nghiệm tại trận địa.');
  await page.locator('.vmodal #ok').click();
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-005');
  await expect(page.locator('[data-go$="/edit"]')).toHaveCount(1);
  await openTask(page, 'sxpm', 'Lập kế hoạch sản xuất dự án');
  await page.locator('[data-sx-do]').click();
  await expect(ef(page, 'khSo')).toHaveValue('205/KH-TTSX'); // giữ nội dung đã trình
  await page.locator('.vmodal [data-ef-add="khMoc"]').click();
  await page.locator('.vmodal [data-ef="khMoc::4::ten"]').fill('Thử nghiệm thực tế tại trận địa');
  await page.locator('.vmodal [data-ef="khMoc::4::han"]').fill('15/08/2027');
  await page.locator('.vmodal #ok').click();
  await openTask(page, 'sxld', 'Ban Giám đốc Khối phê duyệt kế hoạch sản xuất');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await page.locator('.vmodal #ok').click();
  await page.locator('.vmodal [data-mysign-ok]').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);

  // Bước 5: kick-off (biên bản, quyết định giao nhiệm vụ bắt buộc), giao Sub PM, chốt kế hoạch gốc.
  await openTask(page, 'sxpm', 'Họp kick-off');
  await page.locator('[data-sx-do]').click();
  await ef(page, 'koNgay').fill('18/11/2026');
  await page.locator('.vmodal [data-ef-file="koQuyetDinh"]').setInputFiles(FILE);
  await page.locator('.vmodal [data-ef-file="koBienBan"]').setInputFiles(FILE);
  await page.locator('.vmodal #ok').click();
  await expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
  await expect(page.locator('[data-sx-tasks] tbody')).not.toContainText('DA-SX-2026-005'); // hết việc của luồng này (còn việc mẫu khác của PM)

  // Kết quả trên dự án.
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-005');
  await expect(page.locator('.ginfo')).toContainText('Chuẩn bị sản xuất');
  await expect(page.locator('.ginfo')).toContainText('Chốt ngày 16/11/2026');
  await page.locator('[data-ttab="kh"]').click();
  await expect(page.locator('[data-sx-kh]')).toContainText('Hoàn thành');
  await expect(page.locator('[data-sx-kh]')).toContainText('Thử nghiệm thực tế tại trận địa');
  await expect(page.locator('[data-sx-kh]')).toContainText('Trả lại');
  await page.locator('[data-ttab="plan"]').click();
  await expect(page.locator('[data-sx-plan] .cap')).toContainText('Kế hoạch gốc chốt ngày 16/11/2026 · Kế hoạch số 205/KH-TTSX');
  expect(await page.evaluate(() => SxDuAn.planOf(SxDuAn.byCode('DA-SX-2026-005'))[0].pct)).toBe(100);
  await page.locator('[data-ttab="docs"]').click();
  await expect(page.locator('[data-sx-docs]')).toContainText('Kế hoạch sản xuất 205/KH-TTSX (đã phê duyệt).pdf');
  await page.locator('[data-ttab="hist"]').click();
  // T71 S9: sau dòng chốt kế hoạch gốc là dòng kick-off giao nhiệm vụ đơn vị (sx-cong-viec.js).
  const top2 = await page.locator('main .vtable tbody tr').evaluateAll((l) => l.slice(0, 2).map((r) => r.innerText).join(' | '));
  expect(top2).toContain('Chốt kế hoạch gốc');
  expect(top2).toContain('Giao nhiệm vụ theo kế hoạch gốc');
  await expect(page.locator('main .vtable tbody')).toContainText('Phê duyệt kế hoạch sản xuất');
  await expect(page.locator('[data-sx-kh-start]')).toHaveCount(0);

  // Việc đã xử lý mở chế độ Xem.
  await as(page, 'sxld', '#/sx/viec-cua-toi');
  await page.locator('[data-sxv-tab="done"]').click();
  await expect(page.locator('[data-sx-tasks] tbody tr', { hasText: 'DA-SX-2026-005' })).toHaveCount(3); // DA-005: ý kiến chỉ đạo 1 lần, phê duyệt 2 lần
  await page.locator('[data-sx-tasks] tbody tr', { hasText: 'DA-SX-2026-005' }).first().click();
  await expect(page.locator('[data-sbar="view"]')).toContainText('Bạn đã xử lý xong');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
