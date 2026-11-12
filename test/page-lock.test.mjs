// tools/page-lock.mjs — khoá bản đăng web bằng mã truy cập.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lockSite, seal, open, deriveKey } from '../tools/page-lock.mjs';

function fixture() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'page-lock-'));
  const w = (p, c) => { fs.mkdirSync(path.dirname(path.join(d, p)), { recursive: true }); fs.writeFileSync(path.join(d, p), c); };
  w('index.html', '<!doctype html><html lang="vi"><head><meta name="review-api" content=""><title>T</title></head><body><div id="app"></div>\n<script src="js/a.js"></script>\n<script src="js/sub/b.js"></script>\n</body></html>');
  w('js/a.js', 'window.A = "BI-MAT-A";');
  w('js/sub/b.js', 'window.B = A + 1;');
  w('HUONG-DAN.html', '<html><head><title>HD</title></head><body><img src="huong-dan/x.jpg"></body></html>');
  w('huong-dan/x.jpg', Buffer.from([0xff, 0xd8, 0xff]));
  w('assets/mau/m.docx', 'DOCX');
  w('assets/app.css', 'body{}');
  return d;
}
const salted = (d) => Buffer.from(fs.readFileSync(path.join(d, 'index.html'), 'utf8').match(/"salt":"([^"]+)"/)[1], 'base64');

test('seal / open: đúng khoá mở được, sai khoá báo lỗi', () => {
  const salt = Buffer.alloc(16, 1), k = deriveKey('ma-dung-1', salt);
  const box = seal({ a: 'xin chào' }, k);
  assert.deepEqual(open(box, k), { a: 'xin chào' });
  assert.throws(() => open(box, deriveKey('ma-sai-12', salt)));
});

test('lockSite: không còn bản rõ, gói giữ thứ tự script, ảnh hướng dẫn nhúng sẵn', () => {
  const d = fixture();
  const r = lockSite(d, 'abcde-12345');
  assert.deepEqual(r, { scripts: 2, files: 1, guide: true });
  for (const p of ['js', 'huong-dan', 'assets/mau']) assert.ok(!fs.existsSync(path.join(d, p)), p);
  assert.ok(fs.existsSync(path.join(d, 'assets/app.css')));
  const idx = fs.readFileSync(path.join(d, 'index.html'), 'utf8');
  assert.ok(!idx.includes('BI-MAT-A') && idx.includes('x/app.bin') && idx.includes('noindex'));
  const k = deriveKey('abcde-12345', salted(d));
  const app = open(fs.readFileSync(path.join(d, 'x/app.bin')), k);
  assert.deepEqual(app.scripts.map((s) => s.src), ['js/a.js', 'js/sub/b.js']);
  assert.equal(app.files['assets/mau/m.docx'].b64, Buffer.from('DOCX').toString('base64'));
  const g = open(fs.readFileSync(path.join(d, 'x/guide.bin')), k);
  assert.match(g.html, /src="data:image\/jpeg;base64,/);
  assert.throws(() => open(fs.readFileSync(path.join(d, 'x/app.bin')), deriveKey('sai', salted(d))));
});

test('lockSite: từ chối mã ngắn và js lọt ngoài index.html', () => {
  assert.throws(() => lockSite(fixture(), '123'), /6 ký tự/);
  const d = fixture();
  fs.writeFileSync(path.join(d, 'js', 'le.js'), '1');
  assert.throws(() => lockSite(d, 'abcde-12345'), /le\.js/);
});

test('lockSite: salt cố định giữa các lần đăng (người xem không phải nhập lại mã)', () => {
  const s = Buffer.alloc(16, 7).toString('base64');
  const a = fixture(), b = fixture();
  lockSite(a, 'abcde-12345', s); lockSite(b, 'abcde-12345', s);
  assert.equal(salted(a).toString('base64'), s);
  assert.equal(salted(b).toString('base64'), s);
  assert.throws(() => lockSite(fixture(), 'abcde-12345', 'YWJj'), /16 byte/);
});
