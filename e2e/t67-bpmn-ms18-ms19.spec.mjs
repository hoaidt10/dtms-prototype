// T67 T1 (D-118) — MS18 / MS19 TO-BE trong Danh sách quy trình (SCR-41) và sơ đồ SCR-42, nguồn trang MS18 / MS19 của ĐTMS.drawio 16/11 (BPMN-DTMS-1611).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const as = async (page, who, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate((p) => Flow.setPersona(p), who);
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const K18 = '2251799813692410', K19 = '2251799813692482';
/* Kéo phần tử về giữa khung, phóng to rồi bấm (như clickElement của quy-trinh-bpmn.spec.mjs). */
async function pick(page, id) {
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

test('SCR-41: MS18, MS19 có trong danh sách, một phiên bản Hoạt động', async ({ page }) => {
  await as(page, 'qt', '#/quy-trinh');
  const rows = page.locator('.vtt tbody tr');
  await expect(rows.locator('td:nth-child(4)')).toContainText(['Lập và phê duyệt kế hoạch lựa chọn nhà thầu', 'Tổ chức lựa chọn nhà thầu']);
  await page.locator('[data-vtt-key="DTMS_MS18"]').click();
  const kid = page.locator('.vtt tbody tr.child');
  await expect(kid).toHaveCount(1);
  await expect(kid.locator('.vbadge')).toHaveText('Hoạt động');
  await expect(kid.locator('a.link')).toHaveText('MS18');
  expect(page.errors).toEqual([]);
});

test('SCR-42: sơ đồ MS18 — 23 bước, service task tích hợp, user task có vai', async ({ page }) => {
  await as(page, 'qt', `#/quy-trinh/${K18}`);
  await expect(page.locator('.bp-vp[data-page="MS18"]')).toHaveCount(1);
  await expect(page.locator('.ginfo .v').nth(2)).toHaveText('Lập và phê duyệt kế hoạch lựa chọn nhà thầu');
  await expect(page.locator('.bp-vp [data-el^="Activity_"]')).toHaveCount(23);
  await pick(page, 'Activity_10');
  const panel = page.locator('.wf-el');
  await expect(panel.locator('.wf-el-h .t')).toHaveText('userTask');
  await expect(panel.locator('.wf-el-h .s')).toHaveText('Kiểm tra KHLCNT');
  await expect(panel.locator('.wf-f .v').nth(3)).toHaveText('TTMS / Tổ thẩm định');
  // Nền tím (VOffice / Cổng đấu thầu) và nền xanh lá (hệ thống) = service task.
  for (const id of ['Activity_16', 'Activity_22', 'Activity_7']) {
    await pick(page, id);
    await expect(panel.locator('.wf-el-h .t')).toHaveText('serviceTask');
  }
  await expect(panel.locator('.vacc-h')).toHaveText(['Chung', 'Tài liệu mô tả', 'Tích hợp']);
  await expect(page.locator('.wf-vh .ds').first()).toContainText('23 bước');
  expect(await page.evaluate(() => document.querySelector('main').innerText)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('SCR-42: sơ đồ MS19 — 24 bước, 10 quy trình con theo hình thức LCNT', async ({ page }) => {
  await as(page, 'qt', `#/quy-trinh/${K19}`);
  await expect(page.locator('.bp-vp[data-page="MS19"]')).toHaveCount(1);
  await expect(page.locator('.bp-vp [data-el^="Activity_"]')).toHaveCount(24);
  const types = await page.evaluate(() => window.BPMN_DIAGRAMS.MS19.nodes.filter((n) => n.el && n.el.type === 'callActivity').map((n) => n.t));
  expect(types).toEqual(['3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  await pick(page, 'Activity_7');
  const panel = page.locator('.wf-el');
  await expect(panel.locator('.wf-el-h .t')).toHaveText('callActivity');
  await expect(panel.locator('.wf-el-h .s')).toHaveText('Chỉ định thầu');
  await expect(panel.locator('.vacc-h')).toHaveText(['Chung', 'Tài liệu mô tả']);
  // Bảng bước sinh từ cùng trang (bpmn-tasks-ms19.js): cổng Hình thức LCNT rẽ 10 nhánh.
  const g1 = await page.evaluate(() => window.BPMN_FLOWS.MS19.edges.filter((e) => e[0] === 'G1').length);
  expect(g1).toBe(10);
  expect(page.errors).toEqual([]);
});
