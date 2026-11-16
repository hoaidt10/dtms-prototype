// T67 T3 (D-118, yêu cầu BA): Chi tiết KHLCNT giữ 8 tab như hệ thống cũ (HT-THAU-IMG 7210, HT-THAU-XLS 1.3.2.1–1.3.2.9);
// dữ liệu các tab được điền trong quá trình chạy MS18 — bước chưa tới thì tab ghi bước sẽ cập nhật.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|ngoài BPMN/;
const TABS = ['Thông tin chung', 'Checklist', 'Gói thầu/ Công việc thuộc KHLCNT', 'TTr KHLCNT', 'TĐ KHLCNT', 'Cam kết TTĐ', 'QĐ KHLCNT', 'Phiếu trình GQCV'];
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const tab = (page, key) => page.locator(`.dx-tabs [data-ttab="${key}"]`).click();
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => (Flow.caseTokens(w).find((t) => String(t.task) === String(k)) || {}).id, [who, n]);
  expect(id, `việc bước ${n} của ${who}`).toBeTruthy();
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const detail = (page, code) => goto(page, '#/khlcnt/' + encodeURIComponent(code));

test('Tập đoàn: các tab điền dần theo bước — Checklist, TĐ, Cam kết, Phiếu trình, QĐ', async ({ page }) => {
  const KH = 'KHLCNT-2026-0016';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'binh');
  await detail(page, KH);
  await expect(page.locator('.dx-tabs .tab')).toHaveText(TABS);
  await page.locator(`[data-kh-sample="${KH}"]`).click();
  await expect(page).toHaveURL(/#\/task\/HSKH-2026-0016:k/);
  // Đang ở bước 12: Tờ trình, Tổ thẩm định, cam kết đã có; thẩm định, Phiếu trình, QĐ chưa có.
  await detail(page, KH);
  await tab(page, 'checklist');
  const cl = card(page, 'Checklist kế hoạch lựa chọn nhà thầu');
  await expect(cl.locator('tbody tr').nth(0)).toContainText('/TTr-MS-ĐT');
  await expect(cl.locator('tbody tr').nth(1)).not.toContainText('/BC-TTĐ');
  await tab(page, 'to-trinh');
  await expect(card(page, 'Thành viên Tổ thẩm định').locator('tbody tr')).toHaveCount(3);
  await expect(card(page, 'Giải trình nội dung KHLCNT').locator('tbody tr')).toHaveCount(7);
  await tab(page, 'tham-dinh');
  await expect(page.locator('main')).toContainText('được cập nhật ở bước 12. Thẩm định KHLCNT');
  await tab(page, 'cam-ket');
  await expect(card(page, 'Bản cam kết thành viên Tổ thẩm định').locator('tbody tr', { hasText: 'Đã cam kết' })).toHaveCount(3);
  await tab(page, 'phieu-trinh');
  await expect(page.locator('main')).toContainText('được cập nhật ở bước 13. Ghi nhận ý kiến Ban ĐTXD');
  await tab(page, 'quyet-dinh');
  await expect(page.locator('main')).toContainText('được cập nhật ở bước 15');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  // Bước 12 thẩm định → tab TĐ có Bảng số 2 và lần thẩm định.
  await openTask(page, 'binh', 12);
  await act(page, 'Kết quả thẩm định'); await ok(page); await done(page);
  await detail(page, KH);
  await tab(page, 'tham-dinh');
  await expect(card(page, 'Báo cáo thẩm định KHLCNT').locator('tbody tr')).toHaveCount(7);
  await expect(card(page, 'Các lần thẩm định').locator('tbody tr')).toHaveCount(1);
  await tab(page, 'checklist');
  await expect(card(page, 'Checklist kế hoạch lựa chọn nhà thầu').locator('tbody tr').nth(1)).toContainText('/BC-TTĐ');
  // Bước 13 ghi nhận Phiếu nhận xét → tab Phiếu trình và dòng Checklist "Nhận xét của Ban Đầu tư XD".
  await openTask(page, 'thau', 13);
  await page.evaluate(() => Flow.setUi('khPnxFile', true));
  await act(page, 'Ghi nhận ý kiến');
  await page.locator('[data-ef="khPnxSo"]').fill('512/PNX-ĐTXD');
  await page.locator('[data-ef="khPnxNgay"]').fill('20/10/2026');
  await ok(page); await done(page);
  await detail(page, KH);
  await tab(page, 'phieu-trinh');
  await expect(card(page, 'Phiếu nhận xét của Ban Đầu tư — Xây dựng Tập đoàn')).toContainText('512/PNX-ĐTXD');
  await expect(card(page, 'Ý kiến Ban ĐTXD và giải trình của VHT').locator('tbody tr')).toHaveCount(2);
  await tab(page, 'checklist');
  await expect(card(page, 'Checklist kế hoạch lựa chọn nhà thầu').locator('tbody tr').nth(4)).toContainText('512/PNX-ĐTXD');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('VHT: Phiếu trình GQCV không áp dụng; trước bước 3 tab Gói thầu chờ; sau ký có số QĐ ở tab QĐ', async ({ page }) => {
  const KH = 'KHLCNT-2026-0017';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'thau');
  await detail(page, KH);
  await page.locator(`[data-kh-start="${KH}"]`).click();
  await page.locator('#kh-start-ok').click();
  await expect(page).toHaveURL(/#\/task\/HSKH-2026-0017:k/);
  await detail(page, KH);
  await tab(page, 'goi');
  await expect(page.locator('main')).toContainText('được cập nhật ở bước 3. Tạo gói & phân bổ hạng mục');
  await tab(page, 'phieu-trinh');
  await expect(page.locator('main')).toContainText('Không áp dụng với cấp phê duyệt Tổng Công ty');
  await tab(page, 'checklist');
  await expect(card(page, 'Checklist kế hoạch lựa chọn nhà thầu').locator('tbody tr', { hasText: 'Không áp dụng' })).toHaveCount(2);
  // Tua tới bước 21 (đã ký VOffice) bằng nhánh chính.
  await page.evaluate(() => { Flow.startKh('KHLCNT-2026-0017', { level: 'TCT', name: 'KHLCNT thuê hạ tầng', target: 21 }); });
  await detail(page, KH);
  await tab(page, 'quyet-dinh');
  await expect(card(page, 'Quyết định phê duyệt KHLCNT')).toContainText('/QĐ-VHT');
  await expect(card(page, 'Quyết định phê duyệt KHLCNT')).toContainText('VOffice');
  await expect(card(page, 'Lịch sử trình ký').locator('tbody tr')).toHaveCount(2);
  await tab(page, 'tham-dinh');
  await expect(card(page, 'Báo cáo kiểm tra KHLCNT').locator('tbody tr')).toHaveCount(16);
  expect(page.errors).toEqual([]);
});
