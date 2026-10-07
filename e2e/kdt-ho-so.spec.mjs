// T11 B5 — PH09 Khoản đầu tư (plan docs/dtms/prototype-KDT-chuan-bi.md §8 B5): Chi tiết hồ sơ KĐT (SCR-20 dùng lại) + Xem BPMN MS13 tô bước;
// nối Việc của tôi / Giám sát tiến trình; C3 cho các màn KĐT (không chữ BA ngoài nút (i), mọi hàng trong danh sách mở được).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập|WBS|D-\d+\b|P-\d|TO BE|BBLV|❓/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const go = async (page, h) => {
  await page.evaluate((x) => { location.hash = x; }, h);
  await expect(page.locator('main')).toBeVisible();
};
const enc = (s) => encodeURIComponent(s);
const as = (page, who) => page.evaluate((id) => Flow.setPersona(id), who);
const jump = (page, task, who, kdt, vars) => page.evaluate(([t, w, k, v]) => Flow.jumpTo(t, w, v, 'MS13', k), [task, who, kdt, vars || null]);
// Làm việc ở `task` bằng nút có nhãn bắt đầu bằng `label` (không qua màn — chỉ để đưa hồ sơ tới bước cần xem).
const act = (page, task, label) => page.evaluate(([t, l]) => {
  const tok = Flow.state.tokens.find((k) => String(k.task) === String(t));
  Flow.complete(tok.id, Flow.choices(tok.task).find((c) => c.label.startsWith(l)), 'Nội dung thử');
}, [task, label]);
const card = (page) => page.locator('.dmain > section > h3, .dmain > section > .vcard-h > h3').allInnerTexts();

test('SCR-20 KĐT: mọi mã hồ sơ ở Danh sách hồ sơ của 13 KĐT mở Chi tiết hồ sơ, Xem BPMN mở sơ đồ MS13 / MS14, quay lại đúng màn', async ({ page }) => {
  await fresh(page, '#/kdt');
  const kdts = await page.evaluate(() => Flow.kdtAll().map((x) => x.code));
  expect(kdts.length).toBeGreaterThanOrEqual(12);
  let opened = 0;
  for (const k of kdts) {
    await go(page, `#/kdt/${enc(k)}`);
    const codes = await page.locator('[data-kdt-profiles] tbody a.link[data-go^="ho-so-kdt/"]').allInnerTexts();
    for (const code of codes) {
      await go(page, `#/kdt/${enc(k)}`);
      await page.locator(`[data-kdt-profiles] tbody a.link[data-go="ho-so-kdt/${code}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#/ho-so-kdt/${code}$`));
      await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
      expect(await card(page)).toEqual(['Thông tin chung', 'Quy trình', 'Danh sách tài liệu', 'Văn bản đầu ra']);
      await expect(page.locator('.ginfo')).toContainText(`Mã KĐT${k}`);
      await expect(page.locator('.ginfo')).toContainText('Loại hồ sơPhê duyệt KĐT');
      expect(await mainText(page)).not.toMatch(BA);
      await page.locator('.pg-head .r .vbtn', { hasText: 'Xem BPMN' }).click();
      await expect(page.locator('.pg-title')).toHaveText('Chi tiết BPMN');
      await expect(page.locator('.bp-vp')).toHaveAttribute('data-page', code === 'HS-2026-0019' ? 'MS14-TO BE' : 'MS13-TO BE');
      expect(await mainText(page)).not.toMatch(BA);
      await page.locator('.pg-head .r .vbtn', { hasText: 'Xem quy trình' }).click();
      await page.locator('.pg-head .back').click();
      await expect(page).toHaveURL(new RegExp(`#/kdt/${enc(k)}$`));
      opened += 1;
    }
  }
  expect(opened).toBeGreaterThanOrEqual(13);
  expect(page.errors).toEqual([]);
});

test('SCR-20 KĐT mẫu: tiến độ, lịch sử, văn bản đầu ra theo bản ghi — HS-2026-0012 đã phê duyệt, HS-2026-0024 trong quy trình con 41, HS-2026-0031 nhánh gộp', async ({ page }) => {
  await fresh(page, '#/ho-so-kdt/HS-2026-0012');
  const gi = page.locator('.ginfo');
  await expect(gi).toContainText('Quy trìnhMS13 · KĐT đơn giản');
  await expect(gi).toContainText('Nhánh hồ sơHai giai đoạn (BM-01 → BM-03)');
  await expect(gi).toContainText('Trạng tháiHoàn thành');
  await expect(gi).toContainText('Tổng mức vốn thực tế (gồm VAT)138,50 tỷ đồng');
  await expect(page.locator('.vsteps .vsteps-c.active')).toHaveCount(0);
  await expect(page.locator('.dmain section').nth(3)).toContainText('BM-18 Quyết định phê duyệt KĐT');
  await expect(page.locator('.drail .vtl li')).not.toHaveCount(0);
  // Hai giai đoạn: không có bước của nhánh gộp (BM-00) và nhánh Tập đoàn.
  const steps = await page.evaluate(() => [...document.querySelectorAll('.drail .vtl .ti')].map((x) => x.textContent).join('|'));
  expect(steps).not.toMatch(/BM-00|Tập đoàn/);

  await go(page, '#/ho-so-kdt/HS-2026-0024');
  await expect(gi).toContainText('Bước hiện tại');
  await expect(page.locator('.vsteps .vsteps-c.active')).toHaveCount(1);
  await page.locator('.pg-head .r .vbtn', { hasText: 'Xem BPMN' }).click();
  await expect(page.locator('.bp-vp')).toHaveAttribute('data-active', '41');

  await go(page, '#/ho-so-kdt/HS-2026-0031');
  await expect(gi).toContainText('Nhánh hồ sơGộp BM-00');
  await expect(gi).toContainText('Quy trìnhMS13 · KĐT đơn giản');

  // Hồ sơ đã chuyển luồng ↔ hồ sơ mới MS14 liên kết hai chiều.
  await go(page, '#/ho-so-kdt/HS-2026-0018');
  await expect(gi).toContainText('Trạng tháiĐã chuyển luồng');
  await page.locator('.ginfo a', { hasText: 'HS-2026-0019' }).click();
  await expect(page).toHaveURL(/#\/ho-so-kdt\/HS-2026-0019$/);
  await expect(gi).toContainText('Thay thế choHS-2026-0018');
  expect(await mainText(page)).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('SCR-20 KĐT đang chạy: cảnh K5 (bước 24 trong quy trình con 41) — Chi tiết hồ sơ, bộ đếm thẩm định, Xem BPMN tô 41 và 24; cảnh K10 tổng kết', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.jumpToScene('K5', 'MS13'));
  const code = await page.evaluate(() => Flow.state.code);
  // Xem BPMN từ màn xử lý task: tô bước quy trình con và bước của khối thẩm định.
  await page.evaluate(() => { location.hash = '#/task/' + Flow.state.tokens[0].id; });
  await page.locator('.task-acts .vbtn', { hasText: 'Xem BPMN' }).click();
  await expect(page.locator('.bp-vp')).toHaveAttribute('data-active', '41,24');
  await expect(page.locator('.bp-h h2')).toContainText('(Thẩm định');
  expect(await mainText(page)).not.toMatch(BA);
  // Chi tiết hồ sơ đang chạy (#/ho-so → khuôn KĐT), menu Khoản đầu tư sáng.
  await go(page, '#/ho-so');
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
  await expect(page.locator('.ginfo')).toContainText(`Mã hồ sơ${code}`);
  await expect(page.locator('.ginfo')).toContainText('Trạng tháiĐang xử lý');
  await expect(page.locator('.ginfo')).toContainText('Thẩm địnhChủ trương: vòng check');
  await expect(page.locator('.sb-nav .nav.active')).toContainText('Khoản đầu tư');
  await go(page, `#/ho-so-kdt/${code}/bpmn`);
  await expect(page.locator('.bp-vp')).toHaveAttribute('data-active', '41,24');

  // K10: tua tới Quyết định phê duyệt, mở Chi tiết KĐT → hồ sơ → văn bản đầu ra BM-01, BM-14, BM-18.
  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-scene="K10"]').click();
  await expect(page).toHaveURL(new RegExp(`#/kdt/${enc('KĐT-2026-0032')}$`));
  await expect(page.locator('main')).toContainText('Đã phê duyệt');
  await page.locator(`[data-kdt-profiles] tbody a.link[data-go="ho-so-kdt/${code}"]`).click();
  await expect(page.locator('.ginfo')).toContainText('Trạng tháiHoàn thành');
  await expect(page.locator('.ginfo')).toContainText('Thẩm địnhChủ trương: vòng check 2/2, họp 1/2');
  const outs = await page.locator('.dmain section').nth(3).locator('tbody td:nth-child(3)').allInnerTexts();
  expect(outs.map((x) => x.slice(0, 5))).toEqual(['BM-01', 'BM-14', 'BM-18']);
  await expect(page.locator('.vsteps .vsteps-c.active')).toHaveCount(0);
  await page.locator('.pg-head .back').click();
  await expect(page).toHaveURL(new RegExp(`#/kdt/${enc('KĐT-2026-0032')}$`));
  expect(page.errors).toEqual([]);
});

test('Việc của tôi: cột Mã ĐXMS / KĐT, việc KĐT đang chờ và đã xử lý (hồ sơ mẫu), lọc Loại hồ sơ Phê duyệt KĐT; mọi dòng mở được', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.jumpToScene('K8', 'MS13'));
  await as(page, 'lan');
  await go(page, '#/viec-cua-toi');
  await expect(page.locator('.vtable thead th').nth(3)).toHaveText('Mã ĐXMS / KĐT');
  await page.locator('[data-m="adv"]').click();
  await page.locator('[data-vsel="m-type"]').click();
  await page.locator('.vsel-panel .vsel-opt', { hasText: 'Phê duyệt KĐT' }).click();
  await page.keyboard.press('Escape');
  await page.locator('[data-madv] button[type="submit"]').click();
  await page.locator('.vpager .ps-t').click();
  await page.locator('.vpager [data-ps="50"]').click();
  const rows = page.locator('.vtable tbody tr');
  const n = await rows.count();
  expect(n).toBeGreaterThanOrEqual(4);
  const types = await page.locator('.vtable tbody td:nth-child(8)').allInnerTexts();
  expect(new Set(types)).toEqual(new Set(['Phê duyệt KĐT']));
  await expect(rows.first()).toContainText('Chưa xử lý');
  await expect(page.locator('.vtable tbody')).toContainText('KĐT-2026-0012');
  // Mọi dòng mở được: việc đang chờ → màn xử lý task; việc đã xử lý → Chi tiết hồ sơ KĐT.
  const targets = await page.locator('.vtable tbody tr').evaluateAll((tr) => tr.map((r) => r.dataset.go));
  for (const t of targets) {
    await go(page, '#/' + t);
    await expect(page.locator('.pg-title')).toHaveText(/Xem chi tiết hồ sơ|Chi tiết hồ sơ/);
    await expect(page.locator('main')).not.toContainText('Không tìm thấy');
    expect(await mainText(page)).not.toMatch(BA);
  }
  // Việc đã xử lý của hồ sơ mẫu quay lại Việc của tôi.
  await go(page, '#/viec-cua-toi');
  await page.locator('.vtable tbody tr', { hasText: 'HS-2026-0012' }).first().click();
  await expect(page).toHaveURL(/#\/ho-so-kdt\/HS-2026-0012$/);
  await page.locator('.pg-head .back').click();
  await expect(page).toHaveURL(/#\/viec-cua-toi$/);
  expect(page.errors).toEqual([]);
});

test('Giám sát tiến trình: có hồ sơ KĐT (MS13 / MS14), mã hồ sơ mở Chi tiết hồ sơ KĐT và quay lại; SL đang xử lý của MS13 ở Quy trình BPMN', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.jumpToScene('K7', 'MS13'));
  await as(page, 'qt');
  await go(page, '#/giam-sat-tien-trinh');
  const rows = await page.evaluate(() => QuyTrinh.monitorRows().filter((r) => r.href.startsWith('ho-so-kdt/')));
  expect(rows.length).toBe(await page.evaluate(() => Flow.kdtCases().length));
  expect(new Set(rows.map((r) => r.proc))).toEqual(new Set(['MS13', 'MS14']));
  const running = rows.filter((r) => r.proc === 'MS13' && (r.status === 'Đang chạy' || r.status === 'Quá hạn')).length;
  await page.locator('#gs-kw').fill('HS-2026-0027');
  await page.locator('#gs-kw').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody tr')).toContainText('Quá hạn');
  await expect(page.locator('.vtable tbody tr .proc-cell .s')).toHaveText('MS13 - v1.0');
  await page.locator('.vtable tbody a.link').click();
  await expect(page).toHaveURL(/#\/ho-so-kdt\/HS-2026-0027$/);
  await expect(page.locator('.pg-title')).toHaveText('Chi tiết hồ sơ');
  await page.locator('.pg-head .back').click();
  await expect(page).toHaveURL(/#\/giam-sat-tien-trinh$/);
  // Quy trình BPMN: SL hồ sơ đang xử lý của MS13 = số dòng MS13 đang chạy / quá hạn của Giám sát tiến trình.
  expect(running).toBeGreaterThanOrEqual(9);
  await go(page, '#/quy-trinh');
  const row = page.locator('main table tbody tr', { hasText: 'DTMS_MS13' }).first();
  await expect(row.locator('td').last()).toHaveText(String(running));
  expect(page.errors).toEqual([]);
});

// C3: mọi màn KĐT không có chữ BA ngoài nút (i).
const ROUTES = ['#/kdt', '#/kdt/create', `#/kdt/${enc('KĐT-2026-0031')}`, `#/kdt/${enc('KĐT-2026-0031')}/edit`, `#/kdt/${enc('KĐT-2026-0015')}/tao-ho-so`,
  `#/kdt/${enc('KĐT-2026-0018')}/chuyen-luong`, '#/ho-so-kdt/HS-2026-0028', '#/ho-so-kdt/HS-2026-0019/bpmn'];
for (const r of ROUTES) {
  test(`C3: không có chữ BA ngoài nút (i) — ${decodeURIComponent(r)}`, async ({ page }) => {
    await fresh(page, r);
    await expect(page.locator('main .info-i').first()).toBeVisible();
    expect(await mainText(page)).not.toMatch(BA);
    expect(page.errors).toEqual([]);
  });
}

// Màn xử lý task của mọi bước người dùng MS13 cấp VHT: [bước, KĐT, cách đưa hồ sơ tới bước].
const T2 = 'KĐT-2026-0032', TG = 'KĐT-2026-0031';
const TASKS = [1, 4, 5, 7, 8, 10, 11, 12, 14, 16, 24, 26, 28, 29, 31, 32, 33, 36, 37, 38, 39, 42, 44, 46, 47, 48, 51, 54].map((t) => [t, T2])
  .concat([18, 19, 20, 21, 55, 56].map((t) => [t, TG]))
  .concat([[23, T2, [24, 'Hồ sơ chưa đủ điều kiện']], [34, T2, [29, 'Chưa thống nhất'], { meet: { CT: 1 } }], [35, T2, [29, 'Chưa thống nhất'], { meet: { CT: 1 } }, [34]],
    [53, T2, [51, 'Báo cáo chưa được thông qua']]]);
test('C3: màn xử lý task của mọi bước người dùng MS13 cấp VHT (hai giai đoạn + gộp BM-00) không có chữ BA ngoài nút (i)', async ({ page }) => {
  test.setTimeout(120000);
  await fresh(page, '#/viec-cua-toi');
  for (const [task, kdt, via, vars, then] of TASKS) {
    await jump(page, via ? via[0] : task, 'minh', kdt, vars);
    if (via) await act(page, via[0], via[1]);
    if (then) await page.evaluate((t) => { const k = Flow.state.tokens.find((x) => String(x.task) === String(t)); Flow.complete(k.id, Flow.mainChoice(k.task), 'Nội dung thử'); }, then[0]);
    const id = await page.evaluate((t) => (Flow.state.tokens.find((k) => String(k.task) === String(t)) || {}).id, task);
    expect(id, `phải có việc ở bước ${task} (${kdt})`).toBeTruthy();
    await page.evaluate((x) => { const t = Flow.token(x); Flow.setPersona(t.who); location.hash = '#/task/' + x; }, id);
    await expect(page.locator('.pg-title')).toContainText('Xem chi tiết hồ sơ');
    await expect(page.locator('.pg-title .info-i')).toBeVisible();
    const txt = await mainText(page);
    expect(txt, `bước ${task}`).not.toMatch(BA);
  }
  expect(page.errors).toEqual([]);
});
