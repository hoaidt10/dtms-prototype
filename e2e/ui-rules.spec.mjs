// Rule .harness/rules/prototype-ui.md: prototype như app thật (A1–A8), layout theo source (B5, B6), kiểm tra C3.
// Mỗi bước áp rule thêm màn đã sửa vào CLEAN_ROUTES.
import { test, expect } from '@playwright/test';
import { fresh, open, primary, INDEX } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const CLEAN_ROUTES = ['#/viec-cua-toi', '#/dxms', '#/dxms/create', '#/dxms/%C4%90XMS-2026-0103', '#/dxms/%C4%90XMS-2026-0098',
  '#/dxms/%C4%90XMS-2026-0098/bpmn', '#/dxms/%C4%90XMS-2026-0072', '#/ph/goi-thau'];

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
  await fresh(page, '#/dxms/create');
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

test('B5: Danh sách ĐXMS theo profile-list — cột, tìm kiếm, tìm kiếm nâng cao, phân trang', async ({ page }) => {
  await fresh(page, '#/dxms');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách ĐXMS');
  await expect(page.locator('.pg-head .r [data-create]')).toHaveText(/Thêm mới/);
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã hồ sơ', 'Tên hồ sơ', 'Đơn vị đề xuất',
    'Tổng giá trị (tỷ đồng)', 'Quy trình', 'Mức ưu tiên', 'Bước hiện tại', 'Ngày cập nhật']);
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 12');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(10);
  await page.locator('.vpager [data-pg="2"]').first().click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  await expect(page.locator('.vtable tbody tr').first().locator('td').first()).toHaveText('11');

  await page.locator('#dxms-kw').fill('may chu');
  await page.locator('#dxms-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody')).toContainText('ĐXMS-2026-0121');

  await page.locator('[data-l="adv"]').click();
  await expect(page.locator('#dxms-kw')).toHaveCount(0);
  await expect(page.locator('[data-l="adv"]')).toHaveText('Ẩn tìm kiếm nâng cao');
  await page.locator('[data-vsel="f-st"]').click();
  await page.locator('.vsel-panel [data-opt="done"]').click();
  await page.locator('.adv button[type="submit"]').click({ force: true });
  const n = await page.locator('.vtable tbody tr').count();
  expect(n).toBe(5);
  for (let i = 0; i < n; i++) await expect(page.locator('.vtable tbody tr').nth(i).locator('.vbadge')).toHaveText('Hoàn thành');
  await page.locator('[data-l="reset"]').click();
  await expect(page.locator('.vpager')).toContainText('Tổng số bản ghi: 12');
});

test('A5: mọi hồ sơ trong danh sách mở được', async ({ page }) => {
  await fresh(page, '#/dxms');
  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const codes = await page.locator('.vtable tbody tr').evaluateAll((rs) => rs.map((r) => r.dataset.code));
  expect(codes.length).toBe(12);
  for (const code of codes) {
    await page.evaluate(() => { location.hash = '#/dxms'; });
    await page.locator(`tr[data-code="${code}"] .link`).click();
    await expect(page.locator('.ginfo')).toContainText(code);
  }
  expect(page.errors).toEqual([]);
});

test('B5: Việc của tôi theo my-tasks — không tab, cột, lọc Trạng thái, mọi dòng mở được', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(10, 'minh'); location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('.pg-title')).toHaveText('Danh sách việc của tôi');
  await expect(page.locator('main .tab')).toHaveCount(0);
  await expect(page.locator('main [data-create]')).toHaveCount(0);
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Trạng thái', 'Mã hồ sơ', 'Tên hồ sơ', 'Hành động', 'Ngày tạo',
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

test('B5: sau Chuyển quy trình, việc đầu tiên của ĐXMS thay thế nằm trong Việc của tôi', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => {
    Flow.jumpTo('10a', 'minh', {}, 'MS01.03');
    const t = Flow.state.tokens.find((k) => k.task === '10a');
    Flow.complete(t.id, D.flow['10a'].choices.find((c) => c.label.startsWith('Chuyển')), 'x');
    location.hash = '#/viec-cua-toi';
  });
  const row = page.locator('tr[data-code="ĐXMS-2026-0125"]');
  await expect(row).toContainText('Chưa xử lý');
  await row.locator('.link').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => Flow.ci().code)).toBe('ĐXMS-2026-0125');
});

// Màn xử lý task theo my-task-detail (B7): nút trên hàng tiêu đề, lưới 5 + 2, card theo thứ tự source, không chữ BA (C3).
const TASKS = [[1, 'minh'], [4, 'minh'], [5, 'minh'], [7, 'minh'], [8, 'minh'], [10, 'minh'], [12, 'minh'], [13, 'hai'], [16, 'minh'], [17, 'lan'], [19, 'hoa'],
  [20, 'hoa'], [26, 'minh'], [27, 'minh'], [28, 'minh'], [35, 'hoa'], [36, 'hoa'], [42, 'lan'], [43, 'lan'], [46, 'hoa'], [47, 'binh'], [48, 'lan'],
  [50, 'lan'], [51, 'tgd'], [53, 'td'], [56, 'td'], [58, 'lan'], [59, 'lan'], [60, 'tgd']];
const openTask = (page, task, who, proc) => page.evaluate(([t, w, p]) => {
  Flow.jumpTo(t, w, {}, p);
  const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
  Flow.setPersona(k.who);
  location.hash = '#/task/' + k.id;
}, [task, who, proc]);

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
