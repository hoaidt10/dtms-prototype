// T9 B2 — SCR-41 Danh sách quy trình (workflow-management, vht-tree-table) + SCR-42 Chi tiết quy trình (workflow-detail).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const rows = (page) => page.locator('.vtt tbody tr');
const V2 = '2251799813690112';
/* Kéo phần tử về giữa khung, phóng to bằng con lăn rồi bấm vào nó (như bấm trên bpmn-js). */
async function clickElement(page, id) {
  const at = () => page.evaluate((i) => {
    const r = document.querySelector(`.bp-vp [data-el="${i}"]`).firstElementChild.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, id);
  const vp = await page.locator('.bp-vp').boundingBox();
  const mid = { x: vp.x + vp.width / 2, y: vp.y + vp.height / 2 };
  for (let i = 0; i < 8; i++) {
    const c = await at();
    await page.mouse.move(mid.x, mid.y); await page.mouse.down();
    await page.mouse.move(mid.x + (mid.x - c.x), mid.y + (mid.y - c.y), { steps: 3 }); await page.mouse.up();
    await page.mouse.move(mid.x, mid.y); await page.mouse.wheel(0, -300);
  }
  const c = await at();
  await page.mouse.click(c.x, c.y);
}

test('SCR-41: bố cục theo workflow-management — nút đồng bộ, lọc, cây quy trình/phiên bản', async ({ page }) => {
  await as(page, 'qt', '#/quy-trinh');
  await expect(page.locator('.sb-nav [data-go="quy-trinh"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách quy trình');
  await expect(page.locator('main > .pg > .pg-head .r .vbtn.primary')).toHaveText('Đồng bộ từ Camunda');
  await expect(page.locator('.blk-t')).toHaveText('Danh sách quy trình');
  await expect(page.locator('[data-vsel="wf-st"]')).toContainText('Trạng thái');
  await expect(page.locator('#wf-kw')).toHaveAttribute('placeholder', 'Tìm kiếm theo mã, tên quy trình');
  await expect(page.locator('.vtt th')).toHaveText(['STT', 'Mã quy trình', 'Mã Camunda', 'Tên quy trình', 'Trạng thái', 'Phiên bản', 'SL hồ sơ đang xử lý']);
  // P-37 đã chốt: MS01.01 / .02 / .03 là ba quy trình riêng.
  await expect(rows(page)).toHaveCount(6);
  await expect(rows(page).locator('td:nth-child(3)')).toHaveText(['DTMS_MS01_01', 'DTMS_MS01_02', 'DTMS_MS01_03', 'DTMS_MS02', 'DTMS_MS13', 'DTMS_MS14']);
  await expect(rows(page).nth(2).locator('td:nth-child(4)')).toHaveText('Phê duyệt ĐXMS < 160 tỷ');
  // Dòng cha: Mã quy trình "-", không badge, không liên kết.
  await expect(rows(page).first().locator('td:nth-child(2) .vtt-c')).toHaveText('-');
  await expect(page.locator('.vtt tbody .vbadge, .vtt tbody a.link')).toHaveCount(0);
  await page.locator('[data-vtt-key="DTMS_MS01_01"]').click();
  await expect(rows(page)).toHaveCount(8);
  await expect(rows(page).locator('td.ord')).toHaveText(['1', '1.1', '1.2', '2', '3', '4', '5', '6']);
  const kids = page.locator('.vtt tbody tr.child');
  await expect(kids.locator('.vbadge')).toHaveText(['Hoạt động', 'Dừng hoạt động']);
  await expect(kids.locator('a.link')).toHaveText(['MS01.01', 'MS01.01']);
  await expect(kids.locator('td:nth-child(6)')).toHaveText(['2', '1']);
  // SL hồ sơ đang xử lý khớp Giám sát tiến trình (Đang chạy + Quá hạn, MS01.01 phiên bản 2).
  const n = await page.evaluate(() => QuyTrinh.monitorRows().filter((r) => r.proc === 'MS01.01' && r.version === 2 && ['Đang chạy', 'Quá hạn'].includes(r.status)).length);
  expect(n).toBeGreaterThan(0);
  await expect(kids.first().locator('td:nth-child(7)')).toHaveText(String(n));
  await page.locator('[data-vtt-key="DTMS_MS01_01"]').click();
  await expect(rows(page)).toHaveCount(6);
  // MS01.03 đếm riêng hồ sơ của quy trình này.
  const n3 = await page.evaluate(() => QuyTrinh.monitorRows().filter((r) => r.proc === 'MS01.03' && ['Đang chạy', 'Quá hạn'].includes(r.status)).length);
  expect(n3).toBeGreaterThan(0);
  await expect(rows(page).nth(2).locator('td:nth-child(7)')).toHaveText(String(n3));
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('SCR-41: tìm theo mã/tên khi Enter, lọc Trạng thái, cả hai thu gọn các dòng đã mở; đồng bộ báo thành công', async ({ page }) => {
  await as(page, 'qt', '#/quy-trinh');
  await page.locator('[data-vtt-key="DTMS_MS01_01"]').click();
  await page.locator('#wf-kw').fill('khoản đầu tư');
  await page.locator('#wf-kw').press('Enter');
  await expect(rows(page)).toHaveCount(1);
  await expect(rows(page)).toContainText('Chủ trương khoản đầu tư');
  await page.locator('#wf-kw').fill('ms01');
  await page.locator('#wf-kw').press('Enter');
  await expect(rows(page)).toHaveCount(3); // đã thu gọn
  await page.locator('#wf-kw').fill('');
  await page.locator('#wf-kw').press('Enter');
  await page.locator('[data-vsel="wf-st"]').click();
  await expect(page.locator('.vsel-opt')).toHaveText(['Hoạt động', 'Dừng hoạt động']);
  await page.locator('.vsel-opt', { hasText: 'Dừng hoạt động' }).click();
  await expect(rows(page)).toHaveCount(1);
  await page.locator('[data-vtt-key="DTMS_MS01_01"]').click();
  await expect(page.locator('.vtt tbody tr.child .vbadge')).toHaveText(['Dừng hoạt động']);

  const sync = page.locator('[data-wf="sync"]');
  await sync.click();
  await expect(sync).toBeDisabled();
  await expect(sync).toBeEnabled();
  expect(await lastToast(page)).toContain('Đã đồng bộ danh sách quy trình từ Camunda.');
});

test('P-41: Quy trình BPMN chỉ Quản trị hệ thống; vai khác thấy thông báo, không có nút đồng bộ', async ({ page }) => {
  await as(page, 'lan', '#/quy-trinh');
  await expect(page.locator('main')).toContainText('Bạn chưa được cấp quyền truy cập chức năng này');
  await expect(page.locator('[data-wf="sync"], .vtt')).toHaveCount(0);
  await page.goto(page.url().replace(/#.*$/, `#/quy-trinh/${V2}`));
  await expect(page.locator('main')).toContainText('Bạn chưa được cấp quyền truy cập chức năng này');
  await page.locator('.pg-title .info-i').click();
  await expect(page.locator('.info-pop')).toContainText('workflow-detail');
});

test('SCR-42: chi tiết theo workflow-detail — Thông tin quy trình, sơ đồ có toolbar, Lịch sử phiên bản; quay lại', async ({ page }) => {
  await as(page, 'qt', '#/quy-trinh');
  await page.locator('[data-vtt-key="DTMS_MS01_01"]').click();
  await page.locator('.vtt tbody tr.child a.link').first().click();
  await expect(page).toHaveURL(new RegExp(`#/quy-trinh/${V2}$`));
  await expect(page.locator('.sb-nav [data-go="quy-trinh"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết quy trình');
  await expect(page.locator('.tmain .vcard > h3')).toHaveText(['Thông tin quy trình', 'Sơ đồ quy trình']);
  await expect(page.locator('.ginfo .k')).toHaveText(['Mã quy trình', 'Mã Camunda', 'Tên quy trình', 'Phiên bản', 'Phiên bản Deploy', 'Trạng thái', 'Số hồ sơ đang xử lý']);
  await expect(page.locator('.ginfo .v').nth(5)).toHaveText('Hoạt động');
  await expect(page.locator('.ginfo .vbadge')).toHaveCount(0);
  await expect(page.locator('.bp-vp[data-page="MS01 v1.1"]')).toHaveCSS('height', '500px');
  await expect(page.locator('.bp-tb [data-bpz]')).toHaveCount(3);
  await expect(page.locator('.trail h3')).toHaveText('Lịch sử phiên bản');
  await expect(page.locator('.wf-vh .vn')).toHaveText(['v1.1', 'v1.0']);
  await expect(page.locator('.wf-vh .mk.on')).toHaveCount(1);
  await expect(page.locator('.wf-vh .ds').first()).toContainText('Mô tả phiên bản:');
  await expect(page.locator('.wf-el')).toHaveCount(0);
  // Toolbar phóng to đổi tỉ lệ sơ đồ.
  const scale = () => page.locator('.bp-root').getAttribute('transform');
  const s0 = await scale();
  await page.locator('[data-bpz="in"]').click();
  expect(await scale()).not.toBe(s0);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('.pg-head .vbtn.back').click();
  await expect(page).toHaveURL(/#\/quy-trinh$/);
  expect(page.errors).toEqual([]);
});

test('SCR-42: bấm phần tử sơ đồ → viền đỏ + panel nhóm theo loại; Service Task có Tích hợp; đóng panel', async ({ page }) => {
  await as(page, 'qt', `#/quy-trinh/${V2}`);
  await clickElement(page, 'Activity_11');
  const panel = page.locator('.wf-el');
  await expect(panel.locator('.wf-el-h .t')).toHaveText('userTask');
  await expect(panel.locator('.wf-el-h .s')).toHaveText('Hoàn thiện dự thảo ĐXMS (<160 tỷ)');
  await expect(panel.locator('.vacc-h')).toHaveText(['Chung', 'Tài liệu mô tả', 'Phân công', 'Biểu mẫu phần tử']);
  await expect(panel.locator('.wf-f .k')).toHaveText(['Tên', 'ID', 'Mô tả', 'Nhóm phụ trách', 'Người cụ thể', 'Cần vai trò', 'Biểu mẫu']);
  await expect(panel.locator('.wf-f .v').nth(1)).toHaveText('Activity_11');
  await expect(panel.locator('.wf-f .v').nth(3)).toHaveText('Đơn vị đề xuất mua sắm');
  await expect(panel.locator('.wf-f .v').nth(6)).toContainText('BM-09');
  await expect(page.locator('.bp-vp [data-el="Activity_11"] > rect')).toHaveAttribute('stroke', '#ee0033');
  await expect(page.locator('.wf-dg')).toHaveClass(/sel/);
  // Thu gọn một nhóm accordion.
  await panel.locator('.vacc-h', { hasText: 'Phân công' }).click();
  await expect(panel.locator('.wf-f .k')).toHaveCount(4);
  // Kéo sơ đồ không chọn phần tử khác.
  const vp = await page.locator('.bp-vp').boundingBox();
  await page.mouse.move(vp.x + 200, vp.y + 250); await page.mouse.down(); await page.mouse.move(vp.x + 300, vp.y + 260, { steps: 5 }); await page.mouse.up();
  await expect(panel.locator('.wf-el-h .s')).toHaveText('Hoàn thiện dự thảo ĐXMS (<160 tỷ)');
  // Service Task: Chung, Tài liệu mô tả, Tích hợp.
  await clickElement(page, 'Activity_44');
  await expect(panel.locator('.wf-el-h .t')).toHaveText('serviceTask');
  await expect(panel.locator('.vacc-h')).toHaveText(['Chung', 'Tài liệu mô tả', 'Tích hợp']);
  await expect(panel.locator('.wf-f .k').last()).toHaveText('Mô tả Job Type');
  await panel.locator('[data-wf="close-el"]').click();
  await expect(page.locator('.wf-el')).toHaveCount(0);
  await expect(page.locator('.wf-dg')).not.toHaveClass(/sel/);
  expect(page.errors).toEqual([]);
});

test('SCR-42: mỗi phiên bản vẽ đúng trang sơ đồ của nó; mã không tồn tại báo không tìm thấy', async ({ page }) => {
  const cases = [['2251799813685377', 'MS01', 'v1.0', 'Dừng hoạt động'], ['2251799813690540', 'MS02 ver1.1', 'v1.1', 'Hoạt động'],
    ['2251799813691208', 'MS13', 'v1.0', 'Hoạt động'], ['2251799813691536', 'MS14', 'v1.0', 'Hoạt động']];
  await as(page, 'qt', '#/quy-trinh');
  for (const [key, pg, ver, st] of cases) {
    await page.goto(page.url().replace(/#.*$/, `#/quy-trinh/${key}`));
    await expect(page.locator(`.bp-vp[data-page="${pg}"]`)).toHaveCount(1);
    expect(await page.locator('.bp-vp [data-el^="Activity_"]').count()).toBeGreaterThan(40);
    await expect(page.locator('.ginfo .v').nth(3)).toHaveText(ver);
    await expect(page.locator('.ginfo .v').nth(5)).toHaveText(st);
  }
  await page.goto(page.url().replace(/#.*$/, '#/quy-trinh/123'));
  await expect(page.locator('main')).toContainText('Không tìm thấy quy trình.');
  expect(page.errors).toEqual([]);
});
