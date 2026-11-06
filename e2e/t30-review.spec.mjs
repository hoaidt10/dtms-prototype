// T30 — Comment review kiểu Figma (docs/dtms/prototype-T30-review-comment.md §5).
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const pin = (page, no) => page.locator('.rv-pin', { hasText: new RegExp(`^${no}$`) });

async function addComment(page, locator, text, type) {
  await page.keyboard.press('c');
  await expect(page.locator('body')).toHaveClass(/rv-mode/);
  await locator.click();
  const pop = page.locator('.rv-pop');
  await expect(pop).toBeVisible();
  if (await pop.locator('.rv-author').count()) await pop.locator('.rv-author').fill('Nguyễn Văn Review');
  if (type) await pop.locator('.rv-type').selectOption(type);
  await pop.locator('.rv-text').fill(text);
  await pop.locator('[data-rv="save"]').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/rv-mode/);
}

test('ghim comment trên phần tử, chặn click vào app, ghim theo phần tử sau khi app vẽ lại', async ({ page }) => {
  await fresh(page, '#/dxms');
  const url = page.url();
  const add = page.locator('.main button', { hasText: 'Thêm mới' }).first();
  await addComment(page, add, 'Nút Thêm mới nên đặt cạnh ô tìm kiếm.', 'Giao diện');
  // Chế độ comment chặn click: bấm Thêm mới không chuyển màn.
  expect(page.url()).toBe(url);
  await expect(pin(page, 1)).toBeVisible();
  // Ghim nằm trong khung phần tử.
  const b = await add.boundingBox(), p = await pin(page, 1).boundingBox();
  expect(p.x + 4).toBeGreaterThanOrEqual(b.x - 1);
  expect(p.x + 4).toBeLessThanOrEqual(b.x + b.width + 1);
  // Sang màn khác: ghim ẩn; quay lại: ghim hiện lại đúng chỗ.
  await page.evaluate(() => { location.hash = '#/viec-cua-toi'; });
  await expect(page.locator('.rv-pin')).toHaveCount(0);
  await page.evaluate(() => { location.hash = '#/dxms'; });
  await expect(pin(page, 1)).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('JSON xuất ra tự đủ nghĩa: màn, vai, phần tử, ngữ cảnh, ảnh chụp dữ liệu', async ({ page }) => {
  await fresh(page, '#/dxms');
  await addComment(page, page.locator('.main h1').first(), 'Tiêu đề nên ghi rõ "Danh sách đề xuất mua sắm".', 'Nghiệp vụ');
  const out = await page.evaluate(() => window.Review.exportJson());
  expect(out.format).toBe('dtms-prototype-review');
  expect(out.readme.length).toBeGreaterThan(5);
  expect(out.reviewer).toBe('Nguyễn Văn Review');
  const c = out.comments[0];
  expect(c).toMatchObject({ no: 1, type: 'Nghiệp vụ', status: 'open', author: 'Nguyễn Văn Review' });
  expect(c.where.route).toBe('#/dxms');
  expect(c.where.screen.scr).toMatch(/^SCR-/);
  expect(c.where.title).not.toBe('');
  expect(c.where.persona.name).toBeTruthy();
  expect(c.where.menu).not.toBe('');
  expect(c.target.tag).toBe('h1');
  expect(c.target.text).not.toBe('');
  expect(c.context.length).toBeGreaterThan(20);
  expect(Object.keys(out.snapshots)).toContain(c.snapshot);
  expect(Object.keys(out.snapshots[c.snapshot]).some((k) => k.startsWith('dtms-proto-'))).toBeTruthy();
});

test('trả lời, đã xử lý, nhập JSON sang máy khác, mở đúng ngữ cảnh', async ({ page }) => {
  await fresh(page, '#/dxms');
  // Ghim ở màn xử lý task với vai khác để kiểm ngữ cảnh.
  await page.evaluate(() => {
    Flow.jumpTo(12, 'minh', {}, 'MS01.01', undefined, null, false);
    const k = Flow.state.tokens.find((x) => String(x.task) === '12');
    Flow.setPersona(k.who);
    location.hash = '#/task/' + k.id;
  });
  await expect(page.locator('.main h1').first()).toBeVisible();
  const route = await page.evaluate(() => location.hash);
  await addComment(page, page.locator('.main h1').first(), 'Bước này thiếu hạn xử lý.', 'Câu hỏi');
  await pin(page, 1).click();
  const pop = page.locator('.rv-pop');
  await expect(pop.locator('.rv-meta')).toContainText('Bước 12');
  await pop.locator('.rv-text').fill('Đã ghi nhận, sẽ thêm cột Hạn.');
  await pop.locator('[data-rv="reply"]').click();
  await expect(pop.locator('.rv-msg.rep')).toContainText('Đã ghi nhận');
  await pop.locator('[data-rv="toggle"]').click();
  await expect(pop.locator('.rv-st')).toHaveText('Đã xử lý');
  const out = await page.evaluate(() => window.Review.exportJson());
  expect(out.comments[0].where.task).toMatchObject({ no: 12 });
  expect(out.comments[0].replies).toHaveLength(1);

  // "Máy khác": xoá sạch rồi nhập tệp, ghim về đúng route sau Mở đúng ngữ cảnh.
  await page.evaluate(() => { localStorage.clear(); location.hash = '#/viec-cua-toi'; });
  await page.reload();
  const r = await page.evaluate((data) => window.Review.importData(data), out);
  expect(r).toEqual({ add: 1, upd: 0 });
  // Nhập lại lần nữa không nhân đôi.
  expect(await page.evaluate((data) => window.Review.importData(data), out)).toEqual({ add: 0, upd: 0 });
  await page.locator('#rv-fab').click();
  await page.locator('[data-rv="panel"]').click();
  await page.locator('.rv-filt [data-filt="all"]').click();
  page.once('dialog', (d) => d.accept()); // comment ở màn khác → xác nhận mở màn đó
  await page.locator('.rv-item').first().click();
  // Khác màn → confirm mở màn đó; thread mở, bấm Mở đúng ngữ cảnh (confirm thay dữ liệu) → tải lại.
  page.once('dialog', (d) => d.accept());
  await page.locator('.rv-pop [data-rv="ctx"]').click();
  await page.waitForLoadState('load');
  await expect(page).toHaveURL(new RegExp(route.replace('#', '#') + '$'));
  await expect(pin(page, 1)).toBeVisible();
  await expect(page.locator('.rv-pop')).toContainText('Bước này thiếu hạn xử lý.');
  expect(page.errors).toEqual([]);
});

test('hai người review gửi tệp, review-merge.mjs gộp ra review.md + ảnh', async ({ page }, info) => {
  test.setTimeout(120000);
  await fresh(page, '#/dxms');
  await addComment(page, page.locator('.main h1').first(), 'Thiếu bộ lọc theo năm.', 'Nghiệp vụ');
  const a = await page.evaluate(() => window.Review.exportJson());
  // Người thứ hai: nhập tệp của người một, trả lời, rồi thêm comment của mình.
  await page.evaluate((d) => { localStorage.clear(); localStorage.setItem('dtms-review-author', 'Lê Thị Hai'); }, null);
  await page.reload();
  await page.evaluate((d) => window.Review.importData(d), a);
  await pin(page, 1).click();
  await page.locator('.rv-pop .rv-text').fill('Đồng ý, thêm lọc năm.');
  await page.locator('.rv-pop [data-rv="reply"]').click();
  await page.keyboard.press('Escape');
  await addComment(page, page.locator('.main button', { hasText: 'Thêm mới' }).first(), 'Đổi nhãn thành "Tạo ĐXMS".', 'Giao diện');
  const b = await page.evaluate(() => window.Review.exportJson());
  expect(b.comments).toHaveLength(2);

  const { writeFileSync, readFileSync, existsSync } = await import('node:fs');
  const { execFileSync } = await import('node:child_process');
  const fa = info.outputPath('a.json'), fb = info.outputPath('b.json'), out = info.outputPath('gop');
  writeFileSync(fa, JSON.stringify(a)); writeFileSync(fb, JSON.stringify(b));
  execFileSync('node', ['tools/review-merge.mjs', out, fa, fb, '--shots'], { cwd: new URL('..', import.meta.url), stdio: 'pipe' });
  const merged = JSON.parse(readFileSync(out + '/review-merged.json', 'utf8'));
  expect(merged.comments).toHaveLength(2);
  expect(merged.comments[0].replies.map((r) => r.author)).toEqual(['Lê Thị Hai']);
  const md = readFileSync(out + '/review.md', 'utf8');
  expect(md).toContain('Thiếu bộ lọc theo năm.');
  expect(md).toContain('Lê Thị Hai');
  expect(md).toMatch(/SCR-\d+/);
  expect(md).not.toContain('không tìm lại được phần tử');
  expect(existsSync(out + '/shots/R01.png') && existsSync(out + '/shots/R02.png')).toBeTruthy();
});

test('ẩn khi chụp Figma (?capture=1)', async ({ page }) => {
  await fresh(page, '#/dxms');
  await page.goto(page.url().replace('index.html#', 'index.html?capture=1#'));
  await expect(page.locator('#rv-fab')).toBeHidden();
});

test('bước BPMN theo đúng quy trình của hồ sơ (MS13 bước 27), ô tiêu đề cột ghi "Tiêu đề cột"', async ({ page }) => {
  await fresh(page, '#/kdt');
  await page.evaluate(() => { Flow.jumpToScene('K5', 'MS13'); Flow.setPersona('lan'); });
  await expect.poll(() => page.evaluate(() => Flow.tokensFor(Flow.state.persona).some((k) => String(k.task) === '27'))).toBe(true);
  await page.evaluate(() => { location.hash = '#/task/' + Flow.tokensFor(Flow.state.persona).find((k) => String(k.task) === '27').id; });
  const card = page.locator('[data-td-card="kdt"]');
  await expect(card).toBeVisible();
  await addComment(page, card.locator('button').first(), 'Thẻ thẩm định: thêm hạn xử lý.', 'Nghiệp vụ');
  await page.evaluate(() => { location.hash = '#/kdt'; });
  await addComment(page, page.locator('.main table thead th').nth(1), 'Cột này nên rộng hơn.', 'Giao diện');
  const cs = await page.evaluate(() => window.Review.data().comments);
  expect(cs[0].where.task).toMatchObject({ no: 27, process: 'MS13', name: 'Thẩm định nội dung hồ sơ' });
  expect(cs[0].where.task.actor).toContain('CQCM');
  expect(cs[1].target.label).toMatch(/^Tiêu đề cột: /);
  expect(page.errors).toEqual([]);
});
