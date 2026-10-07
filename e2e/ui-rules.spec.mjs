// Rule .harness/rules/prototype-ui.md: prototype như app thật (A1–A8), layout theo source (B5, B6), kiểm tra C3.
// Mỗi bước áp rule thêm màn đã sửa vào CLEAN_ROUTES.
import { test, expect } from '@playwright/test';
import { fresh, open, primary, INDEX } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const CLEAN_ROUTES = ['#/viec-cua-toi', '#/dxms', '#/dxms/create', '#/dxms/%C4%90XMS-2026-0077', '#/dxms/%C4%90XMS-2026-0077/edit',
  '#/ho-so-dxms', '#/ho-so-dxms/create', '#/ho-so-dxms/create/%C4%90XMS-2026-0119', '#/ho-so-dxms/HS-2026-0103', '#/ho-so-dxms/HS-2026-0106',
  '#/ho-so-dxms/HS-2026-0106/bpmn', '#/ho-so-dxms/create/%C4%90XMS-2026-0098', '#/ho-so-dxms/HS-2026-0072', '#/ho-so-dxms/HS-2026-0126', '#/ho-so-dxms/HS-2026-0126/bpmn', '#/ph/goi-thau'];

// Chữ hiển thị trong vùng nội dung, bỏ nút (i) (popover chỉ gắn vào body khi bấm).
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});

test('A6: topbar không còn nhãn PROTOTYPE / nút demo; công cụ demo là nút nổi góc dưới phải', async ({ page }) => {
  await fresh(page, '#/dxms');
  await expect(page.locator('.topbar')).not.toContainText(/PROTOTYPE|demo/i);
  const fab = await page.locator('#demo').boundingBox();
  const vp = page.viewportSize();
  expect(fab.x).toBeGreaterThan(vp.width - 100);
  expect(fab.y).toBeGreaterThan(vp.height - 100);
  await page.locator('#who').click();
  await expect(page.locator('.menu-pop')).toContainText('Chuyển tài khoản');
});

for (const r of CLEAN_ROUTES) {
  test(`A1: không có chữ BA ngoài nút (i) — ${decodeURIComponent(r)}`, async ({ page }) => {
    await fresh(page, r);
    await expect(page.locator('main .info-i').first()).toBeVisible();
    expect(await mainText(page)).not.toMatch(BA);
    expect(page.errors).toEqual([]);
  });
}

test('A2: nút (i) mở ghi chú BA của màn, có điểm ❓ bấm được', async ({ page }) => {
  await fresh(page, '#/ho-so-dxms/create');
  await page.locator('.pg-title .info-i').click();
  await expect(page.locator('.info-pop')).toContainText('SCR-25');
  await expect(page.locator('.info-pop')).toContainText('profile-form');
  await page.locator('.info-pop [data-q="P-26"]').click();
  await expect(page.locator('.overlay')).toContainText('P-26');
});

test('C4: ?capture=1 ẩn nút (i) và nút công cụ demo', async ({ page }) => {
  await open(page, '#/dxms');
  await page.goto(INDEX + '?capture=1#/dxms');
  await expect(page.locator('.pg-title')).toBeVisible();
  await expect(page.locator('.info-i').first()).toBeHidden();
  await expect(page.locator('#demo')).toBeHidden();
});

test('B5: Danh sách hồ sơ ĐXMS theo profile-list — cột, tìm kiếm, tìm kiếm nâng cao, phân trang', async ({ page }) => {
  await fresh(page, '#/ho-so-dxms');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách hồ sơ ĐXMS');
  await expect(page.locator('.sb-nav [data-go="ho-so-dxms"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-head .r [data-create="hs"]')).toHaveText(/Thêm mới/);
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã hồ sơ', 'Mã ĐXMS', 'Tên hồ sơ', 'Loại hồ sơ', 'Đơn vị đề xuất',
    'Tổng giá trị (tỷ đồng)', 'Mức ưu tiên', 'Quy trình', 'Bước hiện tại', 'Ngày cập nhật']);
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 13');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(10);
  await page.locator('.vpager [data-pg="2"]').first().click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(3);
  await expect(page.locator('.vtable tbody tr').first().locator('td').first()).toHaveText('11');

  await page.locator('#hs-kw').fill('may chu');
  await page.locator('#hs-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody')).toContainText('HS-2026-0121');
  // Tìm theo mã ĐXMS ra mọi hồ sơ của ĐXMS đó (Phê duyệt + Điều chỉnh).
  await page.locator('#hs-kw').fill('ĐXMS-2026-0077');
  await page.locator('#hs-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('.vtable tbody')).toContainText('Điều chỉnh ĐXMS');

  await page.locator('[data-l="adv"]').click();
  await expect(page.locator('#hs-kw')).toHaveCount(0);
  await expect(page.locator('[data-l="adv"]')).toHaveText('Ẩn tìm kiếm nâng cao');
  await page.locator('[data-vsel="f-st"]').click();
  await page.locator('.vsel-panel [data-opt="done"]').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const n = await page.locator('.vtable tbody tr').count();
  expect(n).toBe(6);
  for (let i = 0; i < n; i++) await expect(page.locator('.vtable tbody tr').nth(i).locator('.vbadge')).toHaveText('Hoàn thành');
  await page.locator('[data-vsel="f-kind"]').click();
  await page.locator('.vsel-panel [data-opt="DC"]').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody')).toContainText('HS-2026-0112');
  await page.locator('[data-l="reset"]').click();
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 13');
});

test('A5: mọi hồ sơ trong danh sách mở được', async ({ page }) => {
  await fresh(page, '#/ho-so-dxms');
  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const codes = await page.locator('.vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code));
  expect(codes.length).toBe(13);
  for (const code of codes) {
    await page.evaluate(() => { location.hash = '#/ho-so-dxms'; });
    await page.locator(`tr[data-code="${code}"] .link`).click();
    await expect(page.locator('.ginfo')).toContainText(code);
    await expect(page.locator('.dmain .vsteps, .dmain .vst').first()).toBeVisible();
  }
  expect(page.errors).toEqual([]);
});

test('B5: Danh sách ĐXMS theo task-management — cột, chỉ ô tìm kiếm, trạng thái suy từ hồ sơ, mọi ĐXMS mở được, Xoá khi chưa có hồ sơ', async ({ page }) => {
  await fresh(page, '#/dxms');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách ĐXMS');
  await expect(page.locator('.sb-nav [data-go="dxms"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-head .r [data-create="dxms"]')).toHaveText(/Thêm mới/);
  await expect(page.locator('[data-l="adv"]')).toHaveCount(0);
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã ĐXMS', 'Tên ĐXMS', 'Đơn vị đề xuất',
    'Giá trị hiệu lực (tỷ đồng)', 'Mức ưu tiên', 'Ngày cập nhật']);
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 13');
  const st = (code) => page.locator(`tr[data-code="${code}"] .vbadge`);
  await expect(st('ĐXMS-2026-0119')).toHaveText('Chưa có hồ sơ');
  await expect(st('ĐXMS-2026-0121')).toHaveText('Đang phê duyệt');
  await expect(st('ĐXMS-2026-0103')).toHaveText('Đã phê duyệt');
  await page.locator('.vpager [data-pg="2"]').first().click();
  await expect(st('ĐXMS-2026-0077')).toHaveText('Đang điều chỉnh');
  // Giá trị hiệu lực = hồ sơ Hoàn thành gần nhất (Điều chỉnh 9,60 → 11,20). 0084 ở trang 2 (0124 thêm đầu danh sách).
  await expect(page.locator('tr[data-code="ĐXMS-2026-0084"]')).toContainText('11,20');
  await page.locator('.vpager [data-pg="1"]').first().click();
  // Xoá được ĐXMS chưa có hồ sơ: 0119, 0124 và 0098 (hai ĐXMS demo MS01.02 / MS01.03 — hồ sơ tạo khi chạy luồng).
  await expect(page.locator('[data-del-dxms]')).toHaveCount(3);

  await page.locator('#dxms-kw').fill('may in');
  await page.locator('#dxms-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await page.locator('[data-del-dxms="ĐXMS-2026-0119"]').click();
  await expect(page).toHaveURL(/#\/dxms$/);
  await page.locator('.vconfirm #cf-ok').click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody')).toContainText('Chưa có dữ liệu');

  await page.locator('#dxms-kw').fill('');
  await page.locator('#dxms-kw').press('Enter');
  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const codes = await page.locator('.vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code));
  expect(codes.length).toBe(12);
  for (const code of codes) {
    await page.evaluate(() => { location.hash = '#/dxms'; });
    await page.locator(`tr[data-code="${code}"] .link`).click();
    await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết ĐXMS');
    await expect(page.locator('.gen .ginfo')).toContainText(code);
    await expect(page.locator('[data-dxms-profiles] tbody tr').first()).toContainText(['ĐXMS-2026-0124', 'ĐXMS-2026-0098'].includes(code) ? 'Chưa có dữ liệu' : 'HS-2026-');
  }
  // ĐXMS có hai hồ sơ (Phê duyệt đã chuyển quy trình + hồ sơ thay thế); mở hồ sơ từ đây thì quay lại đúng ĐXMS.
  await page.evaluate(() => { location.hash = '#/dxms/%C4%90XMS-2026-0072'; });
  await expect(page.locator('[data-dxms-profiles] tbody tr')).toHaveCount(2);
  await page.locator('[data-dxms-profiles] a.link', { hasText: 'HS-2026-0074' }).click();
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
  await page.locator('.pg-head .vbtn.back').click();
  await expect(page).toHaveURL(/#\/dxms\/%C4%90XMS-2026-0072$/);
  expect(page.errors).toEqual([]);
});

test('B5: Việc của tôi theo my-tasks — không tab, cột, lọc Trạng thái, mọi dòng mở được', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(10, 'minh'); location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('.pg-title')).toHaveText('Danh sách việc của tôi');
  await expect(page.locator('main .tab')).toHaveCount(0);
  await expect(page.locator('main [data-create]')).toHaveCount(0);
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Trạng thái', 'Mã hồ sơ', 'Mã ĐXMS / KĐT', 'Hành động', 'Ngày tạo',
    'Hạn xử lý', 'Loại hồ sơ', 'Mức ưu tiên', 'Quy trình']);
  await expect(page.locator('#my-kw')).toHaveAttribute('placeholder', /Tìm kiếm theo tên công việc/);
  const first = page.locator('.vtable tbody tr').first();
  await expect(first.locator('.vbadge')).toHaveText(/Chưa xử lý|Quá hạn/);
  await expect(first).toContainText('Tổng hợp và kiểm tra báo giá');

  await page.locator('[data-m="adv"]').click();
  await expect(page.locator('#my-kw')).toHaveCount(0);
  await expect(page.locator('[data-vsel="m-st"] .vsel-label')).toHaveText('Tất cả công việc');
  await page.locator('[data-vsel="m-st"]').click();
  await page.locator('.vsel-panel [data-opt="HOAN_THANH"]').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const n = await page.locator('.vtable tbody tr').count();
  expect(n).toBeGreaterThan(5);
  for (let i = 0; i < n; i++) await expect(page.locator('.vtable tbody tr').nth(i).locator('.vbadge')).toHaveText('Hoàn thành');
  await page.locator('[data-m="reset"]').click();

  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const rows = await page.locator('.vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.go));
  expect(rows.length).toBeGreaterThan(10);
  for (let i = 0; i < rows.length; i++) {
    await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
    await page.locator('.vtable tbody tr').nth(i).locator('.link').click();
    await expect(page).not.toHaveURL(/#\/viec-cua-toi$/);
    await expect(page.locator('main')).not.toContainText('không còn tồn tại');
  }
  expect(page.errors).toEqual([]);
});

test('B5: sau Chuyển quy trình, việc đầu tiên của hồ sơ thay thế (cùng ĐXMS) nằm trong Việc của tôi', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => {
    Flow.jumpTo('10a', 'minh', {}, 'MS01.03');
    const t = Flow.state.tokens.find((k) => k.task === '10a');
    Flow.complete(t.id, D.flow['10a'].choices.find((c) => c.label.startsWith('Chuyển')), 'x');
    location.hash = '#/viec-cua-toi';
  });
  const row = page.locator('tr[data-code="HS-2026-0125"]');
  await expect(row).toContainText('Chưa xử lý');
  await expect(row).toContainText('ĐXMS-2026-0117');
  await row.locator('.link').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.ci().code, Flow.ci().dxms])).toEqual(['HS-2026-0125', 'ĐXMS-2026-0117']);
});

// Màn xử lý task theo my-task-detail (B7): nút trên hàng tiêu đề, lưới 5 + 2, card theo thứ tự source, không chữ BA (C3).
const TASKS = [[1, 'minh'], [4, 'minh'], [5, 'minh'], [7, 'minh'], [8, 'minh'], [10, 'minh'], [12, 'minh'], [13, 'hai'], [16, 'minh'], [17, 'lan'], [19, 'hoa'],
  [20, 'hoa'], [26, 'minh'], [27, 'minh'], [28, 'minh'], [35, 'hoa'], [36, 'hoa'], [42, 'lan'], [43, 'lan'], [46, 'hoa'], [47, 'binh'], [48, 'lan'],
  [50, 'lan'], [51, 'tgd'], [53, 'td'], [56, 'td'], [58, 'lan'], [59, 'lan'], [60, 'tgd']];
const openTask = (page, task, who, proc, dxms) => page.evaluate(([t, w, p, d]) => {
  Flow.jumpTo(t, w, {}, p, d);
  const k = Flow.state.tokens.find((x) => String(x.task) === String(t) && (!w || x.who === w)) || Flow.state.tokens.find((x) => String(x.task) === String(t));
  Flow.setPersona(k.who);
  location.hash = '#/task/' + k.id;
}, [task, who, proc, dxms]);
// T6: màn task của hồ sơ MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098) — biến thể BM-09, SCR-23, SCR-24.
const TASKS_T6 = [[1, 'minh', 'MS01.02', 'ĐXMS-2026-0124'], [48, 'lan', 'MS01.02', 'ĐXMS-2026-0124'], [60, 'tgd', 'MS01.02', 'ĐXMS-2026-0124'],
  [1, 'minh', 'MS01.03', 'ĐXMS-2026-0098'], [7, 'minh', 'MS01.03', 'ĐXMS-2026-0098'], [10, 'minh', 'MS01.03', 'ĐXMS-2026-0098'], [11, 'minh', 'MS01.03', 'ĐXMS-2026-0098'],
  [13, 'hai', 'MS01.03', 'ĐXMS-2026-0098'], [16, 'minh', 'MS01.03', 'ĐXMS-2026-0098'], [17, 'lan', 'MS01.03', 'ĐXMS-2026-0098'], [19, 'thu', 'MS01.03', 'ĐXMS-2026-0098'],
  [26, 'minh', 'MS01.03', 'ĐXMS-2026-0098'], [27, 'minh', 'MS01.03', 'ĐXMS-2026-0098'], [36, 'thu', 'MS01.03', 'ĐXMS-2026-0098'],
  [38, 'lan', 'MS01.03', 'ĐXMS-2026-0098'], [39, 'binh', 'MS01.03', 'ĐXMS-2026-0098'], [60, 'tgd', 'MS01.03', 'ĐXMS-2026-0098']];

test('B7: màn xử lý task theo my-task-detail — hàng tiêu đề, lưới 5 + 2, thứ tự card', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await openTask(page, 60, 'tgd');
  await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết hồ sơ');
  await expect(page.locator('.task-acts > .vbtn')).toHaveText(['Phê duyệt', 'Yêu cầu hoàn chỉnh', 'Xem BPMN']);
  await expect(page.locator('.task-acts [data-act].primary')).toHaveText('Phê duyệt');
  await page.locator('[data-more]').click();
  await expect(page.locator('.more-pop [data-act]')).toHaveText(['Chỉ đạo khác — kết thúc']);
  const h3 = await page.locator('.tmain > section > h3, .tmain > section > .vcard-h > h3').allInnerTexts();
  expect(h3.slice(0, 2)).toEqual(['Thông tin chung', 'Quy trình']);
  expect(h3.slice(-2)).toEqual(['Danh sách tài liệu', 'Văn bản đầu ra']);
  await expect(page.locator('.trail h3')).toHaveText('Lịch sử hồ sơ');
  await expect(page.locator('.vsteps .vsteps-c.active')).toHaveCount(1);
  await expect(page.locator('.trail .vbadge', { hasText: 'Chưa xử lý' })).toHaveCount(1);
  const g = await page.evaluate(() => [document.querySelector('.tmain').getBoundingClientRect().width, document.querySelector('.trail').getBoundingClientRect().width]);
  expect(g[0] / g[1]).toBeGreaterThan(2.2);
  expect(page.errors).toEqual([]);
});

test('B7: Lịch sử hồ sơ — Xem nhận xét mở hộp thoại nội dung nhận xét', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.locator('#demo').click();
  await page.locator('[data-branch="1"]').click();
  await primary(page, 'Không đồng ý');
  await page.evaluate(() => { location.hash = '#/task/' + Flow.state.tokens[0].id; });
  await page.locator('.trail [data-note]').first().click();
  await expect(page.locator('.vmodal-h')).toHaveText('Xem chi tiết nhận xét');
  await expect(page.locator('.note-view')).toContainText('Nội dung thử');
});

for (const [task, who] of TASKS) {
  test(`C3: màn task ${task} không có chữ BA ngoài nút (i)`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await openTask(page, task, who);
    await expect(page.locator('.pg-title .info-i')).toBeVisible();
    expect(await mainText(page)).not.toMatch(/SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|BBLV|❓/i);
    expect(page.errors).toEqual([]);
  });
}
for (const [task, who, proc, dxms] of TASKS_T6) {
  test(`C3: ${proc} màn task ${task} không có chữ BA ngoài nút (i)`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await openTask(page, task, who, proc, dxms);
    await expect(page.locator('.pg-title .info-i')).toBeVisible();
    expect(await mainText(page)).not.toMatch(/SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|BBLV|❓/i);
    await expect(page.locator('.tmain .ginfo').first()).toContainText(dxms);
    expect(page.errors).toEqual([]);
  });
}

// SCR-20 Chi tiết hồ sơ theo profile-detail, Chi tiết BPMN theo profile-bpmn, Xem BPMN từ task theo my-task-bpmn-detail.
test('B2: Chi tiết hồ sơ theo profile-detail — chỉ nút Xem BPMN, 4 card trái theo thứ tự, Lịch sử hồ sơ bên phải 801 : 333', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await openTask(page, 26, 'minh');
  await page.evaluate(() => { location.hash = '#/ho-so'; });
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
  await expect(page.locator('.pg-head .r .vbtn')).toHaveText(['Xem BPMN']);
  await expect(page.locator('.tabs, .tab')).toHaveCount(0);
  const h3 = await page.locator('.dmain > section > h3, .dmain > section > .vcard-h > h3').allInnerTexts();
  expect(h3).toEqual(['Thông tin chung', 'Quy trình', 'Danh sách tài liệu', 'Văn bản đầu ra']);
  await expect(page.locator('.drail h3')).toHaveText('Lịch sử hồ sơ');
  await expect(page.locator('.ginfo')).toContainText('KPI thẩm định');
  await expect(page.locator('.vsteps .vsteps-c.active')).toHaveCount(1);
  const g = await page.evaluate(() => [document.querySelector('.dmain').getBoundingClientRect().width, document.querySelector('.drail').getBoundingClientRect().width]);
  // flex 801 : 333 như source; padding 24px của card Lịch sử cộng ngoài phần chia nên tỉ lệ thực ≈ 2,1.
  expect(g[0] / g[1]).toBeGreaterThan(1.9);
  expect(g[0] / g[1]).toBeLessThan(2.5);
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('B2: Xem BPMN — Chi tiết BPMN tô bước đang xử lý trên sơ đồ MS01 v1.1; Xem quy trình quay lại', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await openTask(page, 26, 'minh');
  await page.evaluate(() => { location.hash = '#/ho-so'; });
  await page.locator('.pg-head .r .vbtn', { hasText: 'Xem BPMN' }).click();
  await expect(page).toHaveURL(/#\/ho-so\/bpmn$/);
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết BPMN');
  await expect(page.locator('.ginfo.c3')).toBeVisible();
  await expect(page.locator('.bp-h h2')).toHaveText('Bước hiện tại: Rà soát BM-04 và xác định nội dung cần cập nhật ĐXMS');
  await expect(page.locator('.bp-vp')).toHaveCSS('height', '520px');
  await expect(page.locator('.bp-svg [data-task]')).toHaveCount(63);
  await expect(page.locator('.bp-svg [data-task="26"] rect')).toHaveAttribute('stroke', '#5fe495');
  // Canh giữa bước đang xử lý: task 26 nằm trong khung nhìn.
  const inView = await page.evaluate(() => {
    const vp = document.querySelector('.bp-vp').getBoundingClientRect(), t = document.querySelector('.bp-svg [data-task="26"]').getBoundingClientRect();
    return t.left >= vp.left && t.right <= vp.right && t.top >= vp.top && t.bottom <= vp.bottom;
  });
  expect(inView).toBe(true);
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('.pg-head .r .vbtn', { hasText: 'Xem quy trình' }).click();
  await expect(page).toHaveURL(/#\/ho-so$/);
  expect(page.errors).toEqual([]);
});

test('B2: Xem BPMN từ màn xử lý task theo my-task-bpmn-detail', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await openTask(page, 60, 'tgd');
  await page.locator('.task-acts .vbtn', { hasText: 'Xem BPMN' }).click();
  await expect(page).toHaveURL(/#\/task\/.+\/bpmn$/);
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
  await expect(page.locator('.bp-h h2')).toHaveText('Bước hiện tại: Xem xét, phê duyệt ĐXMS');
  await expect(page.locator('.bp-vp')).toHaveCSS('height', '500px');
  await expect(page.locator('.bp-svg [data-task="60"] rect')).toHaveAttribute('stroke', '#5fe495');
  expect(await mainText(page)).not.toMatch(BA);
  await page.locator('.pg-head [data-go^="task/"]').click();
  await expect(page.locator('.pg-title')).toHaveText('Xem chi tiết hồ sơ');
  expect(page.errors).toEqual([]);
});

test('C4: ?capture=1 — sơ đồ BPMN vẽ gọn (không foreignObject) để xuất Figma', async ({ page }) => {
  await page.goto(INDEX + '?capture=1#/viec-cua-toi');
  await page.evaluate(() => { localStorage.clear(); Flow.jumpTo(26, 'minh', {}); location.hash = '#/ho-so/bpmn'; });
  await expect(page.locator('.bp-svg')).toBeVisible();
  await expect(page.locator('.bp-svg foreignObject')).toHaveCount(0);
  await expect(page.locator('.bp-svg')).toContainText('Rà soát BM-04');
});

for (const st of ['approved', 'moved']) {
  test(`C3: Chi tiết hồ sơ và BPMN khi hồ sơ ${st === 'approved' ? 'đã phê duyệt' : 'đã chuyển quy trình'} không có chữ BA`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await page.evaluate((st) => {
      if (st === 'approved') Flow.jumpToScene(9);
      else { Flow.jumpTo('10a', 'minh', {}, 'MS01.03'); const t = Flow.state.tokens.find((k) => k.task === '10a'); Flow.complete(t.id, D.flow['10a'].choices.find((c) => c.label.startsWith('Chuyển')), 'x'); }
      location.hash = '#/ho-so';
    }, st);
    await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
    await expect(page.locator('.ginfo')).toContainText(st === 'approved' ? 'Hoàn thành' : 'Đã chuyển quy trình');
    expect(await mainText(page)).not.toMatch(BA);
    await page.evaluate(() => { location.hash = '#/ho-so/bpmn'; });
    await expect(page.locator('.bp-h h2')).toContainText('Bước hiện tại: Kết thúc');
    expect(await mainText(page)).not.toMatch(BA);
    expect(page.errors).toEqual([]);
  });
}

// T9 B5 — Quản trị quy trình (SCR-41…48): C3 không chữ BA ngoài nút (i), mọi hàng trong danh sách mở được, C4 ?capture=1.
const asQt = async (page, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('qt'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const V2 = '2251799813690112', V1 = '2251799813685377';
// {rule} = id luật mẫu đầu tiên (sinh khi nạp trang).
const WF_ROUTES = ['#/giam-sat-tien-trinh', '#/quy-trinh', `#/quy-trinh/${V2}`, `#/quy-trinh/${V1}`, '#/quy-trinh/2251799813690540',
  '#/quy-trinh/2251799813691208', '#/ma-tran/display-rule', '#/ma-tran/display-rule/create', '#/ma-tran/display-rule/{rule}/edit',
  '#/ma-tran/display-rule/{rule}/view', '#/ma-tran/bpmn-reconcile', '#/ma-tran/action-catalog', '#/ma-tran/action-catalog/GUI_DUYET'];
const go = (page, h) => page.evaluate((x) => { location.hash = x; }, h);

for (const r of WF_ROUTES) {
  test(`C3: không có chữ BA ngoài nút (i) — ${r}`, async ({ page }) => {
    await asQt(page, '#/quy-trinh');
    const id = await page.evaluate(() => MaTran.rules()[0].id);
    await go(page, r.replace('{rule}', id));
    await expect(page.locator('main .pg-title .info-i').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText(/Không tìm thấy|chưa được cấp quyền|Đang phát triển/);
    expect(await mainText(page)).not.toMatch(BA);
    expect(page.errors).toEqual([]);
  });
}

test('C3: SCR-42 — panel của mọi phần tử trên 5 sơ đồ không có chữ BA', async ({ page }) => {
  await asQt(page, '#/quy-trinh');
  const keys = await page.evaluate(() => QuyTrinh.WORKFLOWS.flatMap((w) => w.versions.map((v) => [v.key, v.page])));
  expect(keys.length).toBe(7);
  for (const [key, pg] of keys) {
    await go(page, '#/quy-trinh/' + key);
    await expect(page.locator('.bp-vp')).toBeVisible();
    const res = await page.evaluate(([k, p]) => {
      const ids = BPMN_DIAGRAMS[p].nodes.filter((n) => n.el).map((n) => n.el.id);
      const re = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i, out = [];
      for (const id of ids) {
        document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key: 'wf/' + k, page: p, id } }));
        const el = document.querySelector('.wf-el');
        if (!el) { out.push(id + ': không mở panel'); continue; }
        const m = el.innerText.match(re);
        if (m) out.push(`${id}: ${m[0]}`);
      }
      return { n: ids.length, out };
    }, [key, pg]);
    expect(res.n).toBeGreaterThan(10);
    expect(res.out, pg).toEqual([]);
  }
  expect(page.errors).toEqual([]);
});

test('C3: SCR-41 — mọi dòng phiên bản mở được Chi tiết quy trình', async ({ page }) => {
  await asQt(page, '#/quy-trinh');
  for (const k of ['DTMS_MS01_01', 'DTMS_MS01_02', 'DTMS_MS01_03', 'DTMS_MS02', 'DTMS_MS13', 'DTMS_MS14']) {
    const tg = page.locator(`[data-vtt-key="${k}"]`);
    if (await tg.count()) await tg.click();
  }
  const hrefs = await page.locator('.vtt tbody a.link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBe(7);
  for (const h of hrefs) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toHaveText('Chi tiết quy trình');
    await expect(page.locator('main')).not.toContainText('Không tìm thấy');
  }
  expect(page.errors).toEqual([]);
});

// Gom liên kết của một cột qua mọi trang (cỡ trang 50).
async function allLinks(page, sel, pager) {
  await page.locator(`${pager} .ps-t`).click();
  await page.locator(`${pager} [data-ps="50"]`).click();
  const out = [];
  for (let p = 1; p < 20; p++) {
    out.push(...await page.locator(sel).evaluateAll((as) => as.map((a) => a.getAttribute('href'))));
    const next = page.locator(`${pager} [data-pg="${p + 1}"]`).first();
    if (!(await next.count())) break;
    await next.click();
  }
  return out;
}

test('C3: SCR-43 — mọi Mã luật mở Xem chi tiết, mọi Mã hành động mở Chi tiết hành động', async ({ page }) => {
  await asQt(page, '#/ma-tran/display-rule');
  const rules = await allLinks(page, '.mt-table tbody td:nth-child(4) a.link', '[data-pager="mt"]');
  expect(rules.length).toBe(await page.evaluate(() => MaTran.rules().length));
  const acts = [...new Set(await page.evaluate(() => MaTran.rules().map((r) => '#/ma-tran/action-catalog/' + r.action)))];
  for (const h of rules) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toContainText('Xem chi tiết luật');
    await expect(page.locator('main')).not.toContainText('Không tìm thấy');
  }
  for (const h of acts) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toContainText('Xem chi tiết hành động');
    await expect(page.locator('main')).not.toContainText('Không tìm thấy');
  }
  expect(page.errors).toEqual([]);
});

test('C3: SCR-46/47 — mọi hành động mở được; mọi quy trình áp dụng mở Chi tiết quy trình', async ({ page }) => {
  await asQt(page, '#/ma-tran/action-catalog');
  const acts = await page.locator('main table tbody a.link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(acts.length).toBe(await page.evaluate(() => MaTran.ACTIONS.length));
  for (const h of acts) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toContainText('Xem chi tiết hành động');
    const procs = await page.locator('main table tbody a.link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    for (const p of procs) {
      await go(page, p);
      await expect(page.locator('.pg-title')).toHaveText('Chi tiết quy trình');
      await expect(page.locator('main')).not.toContainText('Không tìm thấy');
    }
  }
  expect(page.errors).toEqual([]);
});

test('C3: SCR-48 — mọi Mã hồ sơ mở Chi tiết hồ sơ', async ({ page }) => {
  await asQt(page, '#/giam-sat-tien-trinh');
  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const hrefs = await page.locator('.vtable tbody td:nth-child(4) a.link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBe(await page.evaluate(() => QuyTrinh.monitorRows().length));
  expect(hrefs.length).toBeGreaterThan(10);
  for (const h of hrefs) {
    await go(page, h);
    await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
    await expect(page.locator('main')).not.toContainText('không còn tồn tại');
    expect(await mainText(page)).not.toMatch(BA);
  }
  expect(page.errors).toEqual([]);
});

test('C4: ?capture=1 — màn Quản trị quy trình ẩn nút (i); sơ đồ SCR-42 vẽ gọn', async ({ page }) => {
  await page.goto(INDEX + '?capture=1#/viec-cua-toi');
  await page.evaluate(() => { localStorage.clear(); Flow.setPersona('qt'); });
  for (const h of ['#/giam-sat-tien-trinh', '#/quy-trinh', '#/ma-tran/display-rule', '#/ma-tran/bpmn-reconcile', '#/ma-tran/action-catalog']) {
    await go(page, h);
    await expect(page.locator('main .pg-title').first()).toBeVisible();
    await expect(page.locator('main .info-i').first()).toBeHidden();
  }
  await go(page, '#/quy-trinh/' + V2);
  await expect(page.locator('.bp-svg')).toBeVisible();
  await expect(page.locator('.bp-svg foreignObject')).toHaveCount(0);
});
