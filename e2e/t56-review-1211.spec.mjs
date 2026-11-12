// T56 — sửa prototype theo kho comment review 12/11/2026 (plan docs/dtms/prototype-T56-review-sheet-1211.md, Q1–Q10 duyệt "Đồng ý toàn bộ").
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

test('A #1–#8: lọc báo cáo — ô Năm chỉ số năm; Từ ngày - Đến ngày là hai ô lịch có icon và dấu "-"; chọn ngày ghi DD/MM/YYYY', async ({ page }) => {
  await fresh(page, '#/tong-quan');
  const f = page.locator('.rp-filter').first();
  const rg = f.locator('.vrange');
  await expect(rg).toHaveCount(1);
  await expect(rg.locator('.vdate')).toHaveCount(2);
  await expect(rg.locator('.vdate-ic')).toHaveCount(2);
  await expect(rg.locator('.vrange-sep')).toHaveText('-');
  // Gõ số tự chèn "/".
  const from = rg.locator('input[data-vdate]').first();
  await from.fill('01102026');
  await expect(from).toHaveValue('01/10/2026');
  // Ô Năm: nhãn lựa chọn là "2026", không "Năm 2026".
  await f.locator('[data-vsel$="-year"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt')).toHaveText(['2026', '2025']);
});

test('A: mọi màn lọc khoảng ngày dùng hai ô + "-" (ĐXMS ghép một chuỗi Từ – Đến cho bộ lọc cũ)', async ({ page }) => {
  await fresh(page, '#/luong');
  await page.locator('[data-lg="adv"]').click();
  const rg = page.locator('[data-lgadv] .vrange');
  await expect(rg.locator('.vdate')).toHaveCount(2);
  await rg.locator('input[data-vrange="a"]').fill('01012026');
  await rg.locator('input[data-vrange="b"]').fill('31122026');
  await expect(rg.locator('input[data-vrange-val]')).toHaveValue('01/01/2026 – 31/12/2026');
  for (const [hash, adv] of [['#/kdt', null], ['#/ycbg', null], ['#/quan-ly-ho-so', '[data-qh="adv"]'], ['#/de-tai', null]]) {
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.locator(adv || 'button:has-text("Tìm kiếm nâng cao")').first().click();
    await expect(page.locator('form.adv .vrange').first().locator('.vrange-sep')).toHaveText('-');
  }
});

test('B #9, #13, #15–#20: Lập / Danh sách / Chi tiết ĐXMS', async ({ page }) => {
  await fresh(page, '#/luong/create');
  await expect(page.locator('[data-lf-members] h3')).toHaveText('Thành phần tham gia');
  await expect(page.locator('main')).not.toContainText('Gợi ý từ AI ở khối này');
  await expect(page.locator('#lf-d-form')).toHaveCount(0);
  await page.evaluate(() => { location.hash = '#/luong'; });
  const heads = await page.locator('main thead th').allTextContents();
  const at = heads.indexOf('Giá trị đề xuất (tỷ đồng)');
  expect(at).toBeGreaterThan(0);
  expect(heads[at + 1]).toBe('Đơn vị đề xuất');
  expect(heads[heads.indexOf('Người tạo') + 1]).toBe('Ngày tạo');
  const dl = page.waitForEvent('download');
  await page.locator('[data-lg="export"]').click();
  expect((await dl).suggestedFilename()).toBe('danh-sach-de-xuat-mua-sam.csv');
  await page.evaluate(() => { location.hash = '#/luong/' + encodeURIComponent('ĐXMS-2026-0124'); });
  const gi = page.locator('main .ginfo').first();
  await expect(gi).toContainText('Ngày tạo');
  await expect(gi).toContainText('Giá trị đề xuất');
  await expect(gi).not.toContainText('Giá trị hiệu lực');
});

test('B #11: Quản lý tài liệu ĐXMS có trạng thái Hoàn thành cho văn bản không trình ký; #12 dải tab Việc của tôi không cuộn', async ({ page }) => {
  await fresh(page, '#/quan-ly-ho-so');
  await page.locator('[data-qh="adv"]').click();
  await page.locator('[data-vsel="qh-st"]').click();
  await expect(page.locator('.vsel-panel')).toContainText('Hoàn thành');
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  const ov = await page.locator('nav.vct-tabs').evaluate((n) => getComputedStyle(n).overflow);
  expect(ov).toBe('visible');
});

test('C #22–#26, #31: Trình ký một danh sách, lọc Người trình ký / Người ký, 5 trạng thái VOffice; hộp thoại Lịch sử cập nhật', async ({ page }) => {
  await fresh(page, '#/trinh-ky');
  await expect(page.locator('[data-tk-tab]')).toHaveCount(0);
  const all = await page.evaluate(() => TrinhKy.list().length);
  await expect(page.locator('[data-tkl] tbody tr[data-tk-id]')).toHaveCount(Math.min(all, 20));
  await page.locator('[data-tk-adv]').click();
  await expect(page.locator('[data-tkadv] label')).toContainText(['Trạng thái', 'Người trình ký', 'Người ký', 'Hình thức', 'Bản ký']);
  await page.locator('[data-vsel="tkf-st"]').click();
  const opts = page.locator('.vsel-panel');
  for (const s of ['Chưa trình ký', 'Đang xử lý', 'Bị từ chối', 'Đã ký duyệt', 'Đã ban hành']) await expect(opts).toContainText(s);
  await expect(opts).not.toContainText('Lỗi gửi');
  await page.keyboard.press('Escape');
  await page.locator('[data-tk-adv]').click();
  // Hộp thoại Chi tiết lần trình.
  await page.locator('[data-tkl] tbody tr[data-tk-id] [data-tk-act="view"]').first().click();
  const m = page.locator('.overlay .vmodal');
  await expect(m).toContainText('Lịch sử cập nhật');
  await expect(m).not.toContainText('Nhật ký');
  const rows = m.locator('.vfield:has(label:text("Lịch sử cập nhật")) tbody tr td:first-child');
  const times = await rows.allInnerTexts();
  for (const t of times) expect(t).toMatch(/^\d{2}:\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/);
  const key = (t) => t.replace(/^(\d{2}:\d{2}:\d{2}) - (\d{2})\/(\d{2})\/(\d{4})$/, '$4$3$2$1');
  expect([...times].map(key)).toEqual([...times].map(key).sort().reverse());
  await expect(m.locator('button[data-tk-file]').first()).toBeVisible();
});

test('D #28, #35, #38, #29: Nhóm KĐT ghi Đơn giản / Thông thường, nhánh BM01→BM03, chưa xác định "-"; #30 menu KĐT; #10/#32/#33 YCBG thuộc Quản lý thầu', async ({ page }) => {
  await fresh(page, '#/ho-so-ct-kdt');
  const main = page.locator('main');
  await expect(main).not.toContainText('MS13 · KĐT đơn giản');
  await expect(main).not.toContainText('Hai giai đoạn');
  await expect(main.locator('tbody')).toContainText('Đơn giản');
  await expect(main.locator('tbody')).toContainText('BM01→BM03');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await expect(main.locator('tbody')).not.toContainText('Chưa xác định');
  const kdtMenu = page.locator('.sb-nav [data-go="kdt"]').locator('xpath=following-sibling::button');
  await expect(page.locator('.sb-nav')).toContainText('Chủ trương KĐT');
  const labels = await page.locator('.sb-nav .nav.child').allInnerTexts();
  const i = labels.findIndex((l) => l.trim() === 'Khoản đầu tư');
  expect(labels.slice(i, i + 5).map((l) => l.trim())).toEqual(['Khoản đầu tư', 'Chủ trương KĐT', 'Tài liệu chủ trương KĐT', 'Phê duyệt KĐT', 'Tài liệu phê duyệt KĐT']);
  void kdtMenu;
  // Tài liệu chủ trương KĐT: khuôn SCR-107.
  await page.locator('.sb-nav [data-go="tai-lieu-ct-kdt"]').click();
  await expect(page.locator('[data-ktl] h1')).toContainText('Tài liệu chủ trương KĐT');
  await expect(page.locator('[data-ktl] tbody tr').first()).toContainText('BM-01');
  // Yêu cầu báo giá nằm trong Quản lý thầu; các mục thầu khác vẫn ẩn (D-76).
  await page.locator('.sb-nav [data-toggle="Quản lý thầu"]').click();
  await expect(page.locator('.sb-nav [data-go="ycbg"]')).toBeVisible();
  await expect(page.locator('.sb-nav [data-go="khlcnt"]')).toHaveCount(0);
});

test('E #21, #34: Báo cáo quá hạn có khối Theo người xử lý; Báo cáo ĐXMS bỏ khối Theo trạng thái', async ({ page }) => {
  await fresh(page, '#/bao-cao/tien-do');
  await expect(page.locator('main')).toContainText('Theo người xử lý');
  await page.evaluate(() => { location.hash = '#/bao-cao/dxms'; });
  await expect(page.locator('main')).toContainText('Theo đơn vị đề xuất');
  await expect(page.locator('main section h3, main section h4').filter({ hasText: /^Theo trạng thái$/ })).toHaveCount(0);
});

test('F #36, #37: Chi tiết hồ sơ KĐT có thanh trạng thái chứa nút theo Luật hiển thị (như Xem chi tiết ĐXMS)', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.evaluate(() => { Flow.createKdtCase('KĐT-2026-0032', { kind: 'CT' }); });
  const code = await page.evaluate(() => Flow.state.code);
  const who = await page.evaluate(() => Flow.state.tokens[0].who);
  await page.evaluate((w) => Flow.setPersona(w), who);
  await page.evaluate((c) => { location.hash = '#/ho-so-kdt/' + encodeURIComponent(c); }, code);
  const bar = page.locator('[data-sbar="process"]');
  await expect(bar).toContainText('Đang chờ bạn xử lý');
  await expect(bar.locator('[data-act].primary')).toHaveCount(1);
  await expect(page.locator('[data-hs-act]')).toHaveCount(0);
  await expect(page.locator('.pg-head [data-go$="/bpmn"]')).toHaveText('Xem BPMN');
  // Màn xử lý việc KĐT cùng khuôn: nút nằm trong thanh trạng thái.
  const id = await page.evaluate(() => Flow.state.tokens[0].id);
  await page.evaluate((x) => { location.hash = '#/task/' + x; }, id);
  await expect(page.locator('.pg-title')).toHaveText('Xử lý hồ sơ');
  await expect(page.locator('[data-sbar="process"] [data-act].primary')).toHaveCount(1);
  // Người khác: thanh "Đang chờ <tên> xử lý", không nút.
  await page.evaluate((c) => { Flow.setPersona(Flow.state.tokens[0].who === 'tgd' ? 'lan' : 'tgd'); location.hash = '#/ho-so-kdt/' + encodeURIComponent(c); App.render(); }, code);
  await expect(bar).toContainText(/Đang chờ .+ xử lý/);
  await expect(bar.locator('[data-act]')).toHaveCount(0);
  // Hồ sơ mẫu không chạy luồng: thanh báo bước đang chờ, không nút.
  await page.evaluate(() => { location.hash = '#/ho-so-kdt/HS-2026-0031'; });
  await expect(bar).toContainText('Bước 19');
  await expect(bar.locator('[data-act]')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('G #39: Sửa / Xoá ở Danh sách ĐXMS cho ĐXMS chưa gửi — chỉ người lập thấy (BR-LDX-03-04)', async ({ page }) => {
  await fresh(page, '#/luong');
  await page.evaluate(() => { Flow.setPersona('minh'); App.render(); });
  await page.locator('[data-ps-open]').first().click(); // T58: 0124 sang trang 2 → 50 bản ghi/trang
  await page.locator('[data-ps="50"]').first().click();
  const row = page.locator('main tbody tr[data-code="ĐXMS-2026-0124"]');
  await expect(row.locator('[data-lg-edit]')).toHaveCount(1);
  await expect(row.locator('[data-lg-del]')).toHaveCount(1);
  await page.evaluate(() => { Flow.setPersona('tgd'); App.render(); });
  await expect(row.locator('[data-lg-edit], [data-lg-del]')).toHaveCount(0);
});

test('G #40: Việc của tôi — Mã ĐXMS / KĐT là combobox mã + tên, lọc đúng mã', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(17, 'minh'); Flow.setPersona(Flow.state.tokens[0].who); location.hash = '#/viec-cua-toi'; App.render(); });
  await expect(page.locator('main tbody tr td').nth(2)).not.toBeEmpty();
  await page.locator('button:has-text("Tìm kiếm nâng cao")').first().click();
  await expect(page.locator('[data-madv] input[data-mf="dxms"]')).toHaveCount(0);
  const code = (await page.locator('main tbody tr').first().locator('td').nth(2).innerText()).trim();
  await page.locator('[data-vsel="m-dxms"]').click();
  await expect(page.locator('.vsel-panel .vsel-opt').first()).toContainText(' — ');
  await page.locator(`.vsel-panel [data-opt="${code}"]`).click();
  await page.locator('[data-madv] button[type="submit"]').click({ force: true });
  const rows = page.locator('main tbody tr');
  await expect(rows.first()).toContainText(code);
  for (const t of await rows.allInnerTexts()) expect(t).toContain(code);
});

test('G #41, #42: màn xử lý ĐXMS không còn khối Phụ lục kèm theo Tờ trình ở Thông tin chung, khối Trình ký không còn link Xem màn Trình ký', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { Flow.jumpTo(60, 'minh'); const k = Flow.state.tokens[0]; Flow.setPersona(k.who); location.hash = '#/task/' + k.id; });
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
  await expect(page.locator('[data-phu-luc]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Phụ lục kèm theo Tờ trình');
  await expect(page.locator('main')).not.toContainText('Xem màn Trình ký');
});
