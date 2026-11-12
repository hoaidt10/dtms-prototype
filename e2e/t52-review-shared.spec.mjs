// T52 — Kho comment chung (Google Sheet + Apps Script). Chạy chính tools/review-sheet/Code.gs trong Node với Sheet giả,
// trình duyệt gọi https://sheet.test/exec → page.route chuyển vào doGet / doPost.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { INDEX } from './helpers.mjs';

const API = 'https://sheet.test/exec';

/* ---------- Google Sheet giả, đủ cho Code.gs ---------- */
function fakeSheet() {
  const sheets = {};
  const mk = () => {
    const rows = [];
    const sh = {
      rows,
      appendRow: (v) => { rows.push(v.slice()); },
      setFrozenRows() {},
      getLastRow: () => rows.length,
      deleteRow: (r) => { rows.splice(r - 1, 1); },
      getRange: (r, c, nr = 1, nc = 1) => ({
        setFontWeight() { return this; },
        getValue: () => (rows[r - 1] || [])[c - 1] ?? '',
        getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => (rows[r - 1 + i] || [])[c - 1 + j] ?? '')),
        setValues: (vals) => vals.forEach((v, i) => { const row = rows[r - 1 + i] || (rows[r - 1 + i] = []); v.forEach((x, j) => { row[c - 1 + j] = x; }); }),
      }),
    };
    return sh;
  };
  const ss = { getSheetByName: (n) => sheets[n] || null, insertSheet: (n) => (sheets[n] = mk()) };
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ s, setMimeType() { return this; } }) },
    JSON, Date, String, Math, Object, Error,
  };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL('../tools/review-sheet/Code.gs', import.meta.url), 'utf8'), ctx);
  return { sheets, ctx, down: false, calls: 0 };
}

/* Nối trình duyệt vào Sheet giả (server.down = true → lỗi mạng). */
async function connect(page, server) {
  if (!page.errors) {
    page.errors = [];
    page.on('pageerror', (e) => page.errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) page.errors.push(m.text()); });
  }
  await page.route(API + '**', async (route) => {
    const req = route.request();
    if (server.down) return route.abort('internetdisconnected');
    server.calls++;
    const u = new URL(req.url());
    const res = req.method() === 'POST'
      ? server.ctx.doPost({ postData: { contents: req.postData() } })
      : server.ctx.doGet({ parameter: Object.fromEntries(u.searchParams) });
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: res.s });
  });
}
async function openShared(page, server, hash = '#/luong', extra = '', who = 'Người A') {
  await connect(page, server);
  await page.addInitScript((w) => { if (!localStorage.getItem('dtms-review-author')) localStorage.setItem('dtms-review-author', w); }, who);
  await page.goto(`${INDEX}?review-api=${encodeURIComponent(API)}${extra}${hash}`);
  await expect(page.locator('#app')).not.toBeEmpty();
}
const synced = (page) => page.evaluate(async () => { await window.Review.sync(); return window.Review.status(); });
const rows = (server) => (server.sheets.comments ? server.sheets.comments.rows.slice(1) : []);
const json = (server) => rows(server).map((r) => JSON.parse(r[r.length - 1]));

async function addComment(page, locator, text) {
  if (await page.locator('.rv-pop').count()) await page.keyboard.press('Escape');
  await page.keyboard.press('c');
  await locator.click();
  const pop = page.locator('.rv-pop');
  if (await pop.locator('.rv-author').count()) await pop.locator('.rv-author').fill('Người A');
  await pop.locator('.rv-text').fill(text);
  await pop.locator('[data-rv="save"]').click();
  await page.keyboard.press('Escape');
}

test('hai người cùng thấy comment, trả lời, trạng thái; số ghim do kho cấp; ảnh chụp tải khi mở ngữ cảnh', async ({ browser }) => {
  const server = fakeSheet();
  const A = await (await browser.newContext()).newPage();
  const B = await (await browser.newContext()).newPage();
  await openShared(A, server);
  await openShared(B, server, '#/luong', '', 'Người B');

  await addComment(A, A.locator('.main h1').first(), 'Tiêu đề nên ghi rõ hơn.');
  await expect.poll(() => rows(server).length).toBe(1);
  const [c] = json(server);
  expect(c).toMatchObject({ no: 1, author: 'Người A', text: 'Tiêu đề nên ghi rõ hơn.', status: 'open' });
  expect(c.where.route).toBe('#/luong');
  // Cột đọc được trên Sheet.
  const head = server.sheets.comments.rows[0];
  const row = Object.fromEntries(head.map((k, i) => [k, rows(server)[0][i]]));
  expect(row).toMatchObject({ status: 'Chưa xử lý', author: 'Người A', text: 'Tiêu đề nên ghi rõ hơn.' });
  expect(row.screen).toMatch(/^SCR-/);
  expect(server.sheets.snapshots.rows.length).toBe(2); // tiêu đề + 1 ảnh chụp

  // B thấy comment của A (ghim trên đúng màn), trả lời, đánh dấu đã xử lý.
  expect((await synced(B)).err).toBe('');
  await expect(B.locator('.rv-pin', { hasText: /^1$/ })).toBeVisible();
  await B.locator('.rv-pin', { hasText: /^1$/ }).click();
  await B.locator('.rv-pop .rv-text').fill('Đồng ý, sẽ sửa.');
  await B.locator('.rv-pop [data-rv="reply"]').click();
  await B.locator('.rv-pop [data-rv="toggle"]').click();
  await expect.poll(() => json(server)[0].status).toBe('resolved');
  expect(json(server)[0].replies.map((r) => r.author + ': ' + r.text)).toEqual(['Người B: Đồng ý, sẽ sửa.']);
  // B không phải người tạo → không có nút Xoá.
  await expect(B.locator('.rv-pop [data-rv="del"]')).toHaveCount(0);

  // A tải lại thấy trả lời + trạng thái.
  await synced(A);
  const a = await A.evaluate(() => window.Review.data().comments[0]);
  expect(a.status).toBe('resolved');
  expect(a.replies.length).toBe(1);

  // Comment thứ hai từ B cùng lúc với A: kho cấp số 2, 3 không trùng.
  await addComment(B, B.locator('.main h1').first(), 'Thêm cột Đơn vị.');
  await addComment(A, A.locator('.main h1').first(), 'Thiếu nút Xuất Excel.');
  await expect.poll(() => rows(server).length).toBe(3);
  expect(json(server).map((x) => x.no).sort()).toEqual([1, 2, 3]);

  // Danh sách "Tất cả" ở máy B có đủ 3 comment, không cần nhập JSON.
  await synced(B);
  await B.locator('#rv-fab').click();
  await B.locator('[data-rv="panel"]').click();
  await B.locator('.rv-filt [data-filt="all"]').click();
  await expect(B.locator('.rv-item')).toHaveCount(3);
  await expect(B.locator('.rv-panel .rv-sync')).toContainText('Kho chung · cập nhật');

  // Máy mới (không có ảnh chụp) mở đúng ngữ cảnh: ảnh chụp tải từ kho.
  const C = await (await browser.newContext()).newPage();
  await openShared(C, server, '#/luong');
  await synced(C);
  expect(await C.evaluate(() => Object.keys(window.Review.data().snapshots).length)).toBe(0);
  C.on('dialog', (d) => d.accept());
  await C.locator(`[data-pin="${c.id}"]`).dispatchEvent('click'); // 3 ghim chồng trên cùng tiêu đề
  await C.locator('.rv-pop [data-rv="ctx"]').click();
  await C.waitForLoadState('load');
  // Trang tải lại sau khi nạp ảnh chụp — đọc lỗi giữa chừng thì thử lại.
  await expect.poll(() => C.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('dtms-proto-')).length).catch(() => 0)).toBeGreaterThan(0);
  await C.waitForLoadState('load');
  expect(C.url()).toContain('#/luong');

  for (const p of [A, B]) expect(p.errors).toEqual([]);
});

test('mất mạng: comment xếp hàng, có mạng lại thì tự gửi; người tạo xoá được', async ({ page }) => {
  const server = fakeSheet();
  await openShared(page, server);
  await synced(page);
  server.down = true;
  await addComment(page, page.locator('.main h1').first(), 'Ghi khi mất mạng.');
  await expect.poll(async () => (await page.evaluate(() => window.Review.status())).outbox).toBe(1);
  expect(rows(server).length).toBe(0);
  await page.locator('#rv-fab').click();
  await expect(page.locator('.rv-menu .rv-sync')).toContainText('1 chờ gửi');
  await page.keyboard.press('Escape');
  // Tải lại trang khi vẫn mất mạng: comment vẫn hiện (bản sao trên máy + hàng đợi).
  await page.reload();
  await expect(page.locator('.rv-pin', { hasText: /^1$/ })).toBeVisible();
  server.down = false;
  const st = await synced(page);
  expect(st.outbox).toBe(0);
  expect(json(server).map((x) => x.text)).toEqual(['Ghi khi mất mạng.']);
  // Xoá.
  page.on('dialog', (d) => d.accept());
  await page.locator('.rv-pin', { hasText: /^1$/ }).click();
  await page.locator('.rv-pop [data-rv="del"]').click();
  await expect.poll(() => rows(server).length).toBe(0);
});

test('comment cũ trên máy (T30) gửi lên kho chung; link ?rv= mở đúng comment', async ({ page }) => {
  const server = fakeSheet();
  // Ghi comment ở chế độ cũ (không có kho).
  await connect(page, server);
  await page.goto(INDEX + '?review-api=off#/luong');
  await page.evaluate(() => localStorage.setItem('dtms-review-author', 'Người A'));
  await addComment(page, page.locator('.main h1').first(), 'Comment cũ trên máy.');
  expect(server.calls).toBe(0);
  // Bật kho chung: menu có mục gửi comment cũ.
  await page.goto(`${INDEX}?review-api=${encodeURIComponent(API)}#/luong`);
  await synced(page);
  await page.locator('#rv-fab').click();
  page.on('dialog', (d) => d.accept());
  await page.locator('[data-rv="legacy"]').click();
  await expect.poll(() => json(server).map((x) => x.text)).toEqual(['Comment cũ trên máy.']);
  expect(await page.evaluate(() => [!!localStorage.getItem('dtms-review-v1'), !!localStorage.getItem('dtms-review-v1-da-gui')])).toEqual([false, true]);

  // Link từ Sheet (giả lập địa chỉ http bằng base) — mở ?rv=<id> thì hiện luồng trao đổi của comment.
  const id = json(server)[0].id;
  await page.goto(`${INDEX}?review-api=${encodeURIComponent(API)}&rv=${encodeURIComponent(id)}#/luong`);
  await expect(page.locator('.rv-pop')).toContainText('Comment cũ trên máy.');
  expect(page.url()).not.toContain('rv=');
});
