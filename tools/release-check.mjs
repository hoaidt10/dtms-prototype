// T33 B0 — kiểm bản gói gửi khách như người nhận: giải nén ra thư mục tạm, mở file:// bằng Chromium (plan T33 §3.1).
//   node tools/release-check.mjs <đường dẫn .zip | thư mục đã giải nén>
// Kiểm: đủ HUONG-DAN-MO.txt (UTF-8 BOM), index.html có proto-build; mở được, 0 lỗi console / pageerror, 0 tài nguyên hỏng;
// thanh menu có mục; lần đầu hiện danh sách 7 tour; tua hồ sơ demo tới bước 1 được; HUONG-DAN.html (nếu có) không ảnh hỏng.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const src = process.argv[2];
if (!src || !fs.existsSync(src)) { console.error('Dùng: node tools/release-check.mjs <tệp .zip | thư mục>'); process.exit(2); }
let root = path.resolve(src), tmp = null;
if (src.endsWith('.zip')) {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dtms-release-'));
  const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'unzip';
  const r = process.platform === 'win32' ? spawnSync(tar, ['-x', '-f', path.resolve(src), '-C', tmp]) : spawnSync('unzip', ['-q', path.resolve(src), '-d', tmp]);
  if (r.status !== 0) { console.error('Giải nén lỗi'); process.exit(1); }
  const sub = fs.readdirSync(tmp);
  root = sub.length === 1 && fs.statSync(path.join(tmp, sub[0])).isDirectory() ? path.join(tmp, sub[0]) : tmp;
}
const fails = [], ok = (m) => console.log('  ✓ ' + m), bad = (m) => { fails.push(m); console.log('  ✗ ' + m); };

const guide = path.join(root, 'HUONG-DAN-MO.txt');
if (!fs.existsSync(guide)) bad('Thiếu HUONG-DAN-MO.txt');
else { const b = fs.readFileSync(guide); b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf ? ok('HUONG-DAN-MO.txt UTF-8 có BOM') : bad('HUONG-DAN-MO.txt thiếu BOM'); if (/\{\{/.test(b.toString('utf8'))) bad('HUONG-DAN-MO.txt còn chỗ {{…}} chưa điền'); }
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const build = (/<meta name="proto-build" content="([^"]+)"/.exec(html) || [])[1];
build ? ok('proto-build ' + build) : bad('index.html thiếu proto-build');

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('requestfailed', (r) => errs.push('Không tải được ' + r.url()));
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href + '#/viec-cua-toi');
  await page.waitForSelector('#app .sidebar', { timeout: 15000 });
  const menus = await page.locator('.sb-nav > *').count();
  menus > 0 ? ok(`Mở file:// được, thanh menu ${menus} mục`) : bad('Thanh menu trống');
  // T33 B2: bản gửi khách, lần mở đầu tự hiện danh sách 7 tour.
  const welcome = await page.waitForSelector('.overlay.tour-menu', { timeout: 3000 }).then(() => true).catch(() => false);
  const tours = welcome ? await page.locator('.overlay.tour-menu .tour-list button').count() : 0;
  welcome && tours === 7 ? ok('Lần mở đầu hiện danh sách 7 tour') : bad(`Không tự hiện danh sách tour (thấy ${tours})`);
  if (welcome) await page.locator('.overlay.tour-menu [data-close]').click();
  const b2 = await page.evaluate(() => (document.querySelector('meta[name="proto-build"]') || {}).content);
  b2 === build ? ok('Trang đọc được proto-build') : bad('Trang không đọc được proto-build');
  const t1 = await page.evaluate(() => { localStorage.clear(); Flow.reset(); Flow.jumpTo(1, 'minh'); return Flow.state.tokens.some((t) => t.task === 1); });
  t1 ? ok('Tua hồ sơ demo tới bước 1') : bad('Không tua được tới bước 1');
  await page.evaluate(() => { location.hash = '#/task/' + Flow.state.tokens.find((t) => t.task === 1).id; });
  // Bước 1 nay là màn Lập ĐXMS toàn trang (#lf-save); các bước khác vẫn dùng .task-acts.
  await page.waitForSelector('.task-acts [data-act], #lf-save', { timeout: 10000 });
  ok('Mở màn việc bước 1');
  if (fs.existsSync(path.join(root, 'HUONG-DAN.html'))) {
    await page.goto(pathToFileURL(path.join(root, 'HUONG-DAN.html')).href);
    // Ảnh loading="lazy" chưa tải khi chưa cuộn tới → ép tải hết rồi mới đếm ảnh hỏng.
    await page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }); })));
    const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.getAttribute('src')));
    broken.length ? bad('HUONG-DAN.html ảnh hỏng: ' + broken.join(', ')) : ok(`HUONG-DAN.html ${await page.evaluate(() => document.images.length)} ảnh`);
  }
  errs.length ? bad('Lỗi khi chạy: ' + [...new Set(errs)].join(' | ')) : ok('0 lỗi console');
} finally {
  await browser.close();
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(fails.length ? `KHÔNG ĐẠT (${fails.length} lỗi)` : 'ĐẠT');
process.exit(fails.length ? 1 : 0);
