// @ts-check
// T71 S7 (D-121): SX-09 thay đổi kỹ thuật — ECR mở từ bất thường Loại 2, cấp phê duyệt theo phạm vi thay đổi, ECO / ECN ghi Nhật ký quản lý dự án.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test.describe.configure({ timeout: 150000 });
const BA = /SCR-|SX-\d\d\b|UC-|task 0|Prototype|minh hoạ|GIẢ LẬP/;
const as = async (page, pid, hash) => { await page.evaluate(([p, h]) => { Flow.setPersona(p); location.hash = h; App.render(); }, [pid, hash]); };
const ok = (page) => page.locator('.vmodal #ok').click();
const pickEf = async (page, key, val) => { await page.locator(`.vmodal [data-vsel="ef-${key}"]`).click(); await page.locator(`.vsel-panel [data-opt="${val}"]`).click(); };
const openTask = async (page, pid, step) => {
  await as(page, pid, '#/sx/viec-cua-toi');
  await page.locator('[data-sx-tasks] tbody tr', { hasText: step }).first().click();
  await expect(page.locator('[data-sbar="process"]')).toContainText(step);
};
const done = (page) => expect(page).toHaveURL(/#\/sx\/viec-cua-toi$/);
const tokens = (page) => page.evaluate(() => SxFlow.caseOf('HSTD-ECR-2026-002-01').tokens.map((t) => [String(t.step), t.who]));

test('SX-09 danh sách + thay đổi mẫu đã hoàn thành; Nhật ký quản lý dự án ở tab dự án', async ({ page }) => {
  await fresh(page, '#/sx/thay-doi');
  await as(page, 'sxqa', '#/sx/thay-doi');
  await expect(page.locator('.pg-title')).toContainText('Danh sách yêu cầu thay đổi kỹ thuật');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody tr')).toContainText('ECO-2026-001');
  await expect(page.locator('.vtable tbody tr')).toContainText('Hoàn thành');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-001');
  await page.locator('[data-ttab="bt"]').click();
  await expect(page.locator('[data-sx-log] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-sx-log] tbody tr').first()).toContainText('ECN-2026-001');
  await expect(page.locator('[data-sx-log] tbody tr').first()).toContainText('v2.1_HW_Rev3');
  expect(page.errors).toEqual([]);
});

test('Cảnh E: bất thường Loại 2 mở ECR; cấp C3 trả lại, chọn C2; ECN không đạt làm lại; ECO / ECN ghi nhật ký, dự án lên phiên bản mới', async ({ page }) => {
  await fresh(page, '#/sx/bat-thuong');
  await as(page, 'sxrd', '#/sx/bat-thuong/BT-2026-002');
  await page.locator('[data-sxtd-issue="BT-2026-002"]').click();
  await expect(page.locator('.vmodal [data-ef="tdTitle"]')).toHaveValue(/BT-2026-002/);
  await page.locator('.vmodal [data-ef="tdNoiDung"]').fill('Thiết kế lại gá đỡ cụm thấu kính, tăng gân cứng.');
  await ok(page);
  await expect(page).toHaveURL(/#\/sx\/thay-doi\/ECR-2026-002$/);
  await expect(page.locator('.ginfo')).toContainText('BT-2026-002');
  expect(await tokens(page)).toEqual([['2', 'sxrd']]);
  // Phiếu nguồn: liên kết ECR, hết nút mở.
  await as(page, 'sxrd', '#/sx/bat-thuong/BT-2026-002');
  await expect(page.locator('[data-sxtd-issue]')).toHaveCount(0);

  await openTask(page, 'sxrd', 'Phân tích khả thi');
  await page.locator('[data-sx-do]').click();
  await page.locator('.vmodal [data-ef="ptCauHinh"]').fill('Không đổi giao tiếp; đổi bản vẽ gá đỡ.');
  await page.locator('.vmodal [data-ef="ptEbom"]').fill('Thay chi tiết gá đỡ GD-01 bằng GD-02.');
  await page.locator('.vmodal [data-ef="ptTienDo"]').fill('15');
  await page.locator('.vmodal [data-ef="ptChiPhi"]').fill('85000000');
  await ok(page); await done(page);
  const eco = async (cap) => {
    await openTask(page, 'sxrd', 'Lập lệnh thay đổi ECO');
    await page.locator('[data-sx-do]').click();
    await pickEf(page, 'ecoCap', cap);
    await page.locator('.vmodal [data-ef="ecoPhienBan"]').fill('v1.1_HW_Rev2');
    await page.locator('.vmodal [data-ef="ecoNoiDung"]').fill('Thay gá đỡ GD-01 bằng GD-02, cập nhật bản vẽ cơ khí rev B.');
    await ok(page); await done(page);
  };
  await eco('C3');
  expect(await tokens(page)).toEqual([['4', 'sxld']]);
  await openTask(page, 'sxld', 'Phê duyệt ECO');
  await page.locator('[data-sx-do]', { hasText: 'Trả lại' }).click();
  await page.locator('.vmodal [data-ef="ykNoiDung"]').fill('Thay đổi không ảnh hưởng giao tiếp khối, thuộc cấp Giám đốc Trung tâm.');
  await ok(page); await done(page);
  await eco('C2');
  expect(await tokens(page)).toEqual([['4', 'sxgdtt']]);
  await openTask(page, 'sxgdtt', 'Phê duyệt ECO');
  await page.locator('[data-sx-do]', { hasText: 'Phê duyệt' }).click();
  await ok(page); await done(page);
  expect(await page.evaluate(() => SxTd.byCode('ECR-2026-002').eco)).toBe('ECO-2026-002');
  const ecn = async () => {
    await openTask(page, 'sxrd', 'Cập nhật bản vẽ');
    await page.locator('[data-sx-do]').click();
    await page.locator('.vmodal [data-ef-list="ecnTaiLieu"]').first().check();
    await page.locator('.vmodal [data-ef="ecnNoiDung"]').fill('Ban hành bản vẽ gá đỡ rev B.');
    await page.locator('.vmodal [data-ef-file="ecnFile"]').setInputFiles({ name: 'ECN.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF') });
    await ok(page); await done(page);
  };
  await ecn();
  await openTask(page, 'sxqa', 'Đo kiểm mẫu');
  await page.locator('[data-sx-do]', { hasText: 'Không đạt' }).click();
  await page.locator('.vmodal [data-ef="ktKetQua"]').fill('Mẫu 2 vẫn lệch 0,12 mrad.');
  await ok(page); await done(page);
  expect(await tokens(page)).toEqual([['6', 'sxrd']]);
  await ecn();
  await openTask(page, 'sxqa', 'Đo kiểm mẫu');
  await page.locator('[data-sx-do]', { hasText: 'Đạt' }).first().click();
  await ok(page); await done(page);
  expect(await page.evaluate(() => [SxTd.byCode('ECR-2026-002').ecn, SxDuAn.byCode('DA-SX-2026-002').version])).toEqual(['ECN-2026-002', 'v1.1_HW_Rev2']);
  await openTask(page, 'sxpm', 'Bàn giao nhà máy');
  await page.locator('[data-sx-do]').click();
  await page.locator('.vmodal [data-ef="bgNgay"]').fill('20/11/2026');
  await page.locator('.vmodal [data-ef="bgSeri"]').fill('QD12-0005');
  await ok(page);
  await expect(page.locator('.vmodal .vfield.invalid')).toHaveCount(1); // chưa xác nhận thu hồi tài liệu cũ
  await page.locator('.vmodal [data-ef-chk="bgThuHoi"]').check();
  await ok(page); await done(page);
  await as(page, 'sxpm', '#/sx/du-an/DA-SX-2026-002');
  await page.locator('[data-ttab="bt"]').click();
  await expect(page.locator('[data-sx-td] tbody tr')).toContainText('Hoàn thành');
  await expect(page.locator('[data-sx-log] tbody tr')).toHaveCount(2);
  await expect(page.locator('[data-sx-log]')).toContainText('ECO-2026-002');
  await expect(page.locator('[data-sx-log]')).toContainText('v1.1_HW_Rev2');
  await as(page, 'sxpm', '#/sx/thay-doi/ECR-2026-002');
  await page.locator('[data-ttab="tt"]').click();
  await expect(page.locator('main')).toContainText('Hệ thống cấp mã ECN');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
