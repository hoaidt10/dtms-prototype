// T33 B0 — tools/release-lib.mjs: chọn tệp theo danh sách được phép, kiểm tham chiếu, chèn proto-build, khuôn hướng dẫn.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listFiles, checkSet, stampBuild, fillGuide, htmlRefs, cssRefs, allowed } from '../tools/release-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fixture(files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'rel-test-'));
  for (const [rel, body] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true }); fs.writeFileSync(path.join(d, rel), body); }
  return d;
}
const HTML = '<html><head>\n<link rel="stylesheet" href="assets/app.css"></head><body><script src="js/a.js"></script><a href="#/x">x</a><a href="https://x.vn">y</a></body></html>';

test('listFiles chỉ lấy tệp trong danh sách được phép', () => {
  const d = fixture({ 'index.html': HTML, 'assets/app.css': '', 'js/a.js': '', 'README.md': '', 'e2e/x.spec.mjs': '', 'node_modules/p/i.js': '',
    'undefined/z.txt': '', 'tools/t.mjs': '', 'package.json': '{}' });
  assert.deepEqual(listFiles(d), ['assets/app.css', 'index.html', 'js/a.js']);
  assert.equal(allowed('js/eforms/ms01.js'), true);
  assert.equal(allowed('jsx/a.js'), false);
});

test('checkSet báo tham chiếu thiếu, JS không ai nạp, CSS url thiếu, mẫu cấm', () => {
  const files = { 'index.html': HTML.replace('js/a.js', 'js/missing.js'), 'assets/app.css': "@font-face{src:url('fonts/R.ttf')}", 'js/a.js': "img('assets/none.svg'); fetch('http://localhost:8080')", 'js/.env': 'X=1' };
  const { errors } = checkSet(Object.keys(files).sort(), (r) => files[r]);
  assert.ok(errors.includes('index.html tham chiếu tệp không có: js/missing.js'));
  assert.ok(errors.includes('Tệp JS không được index.html nạp: js/a.js'));
  assert.ok(errors.includes('assets/app.css tham chiếu tệp không có: assets/fonts/R.ttf'));
  assert.ok(errors.includes('js/a.js tham chiếu tệp không có: assets/none.svg'));
  assert.ok(errors.includes('js/a.js chứa localhost'));
  assert.ok(errors.includes('tệp .env: js/.env'));
});

test('checkSet đạt với bộ tệp hợp lệ; prototype thật không có lỗi', () => {
  const files = { 'index.html': HTML, 'assets/app.css': "src:url('fonts/R.ttf')", 'assets/fonts/R.ttf': '', 'js/a.js': "x('assets/fonts/R.ttf')" };
  assert.deepEqual(checkSet(Object.keys(files), (r) => files[r]).errors, []);
  const real = listFiles(ROOT);
  const { errors } = checkSet(real, (r) => fs.readFileSync(path.join(ROOT, r), 'utf8'));
  assert.deepEqual(errors, []);
  assert.ok(real.filter((f) => f.startsWith('js/')).length >= 60);
});

test('htmlRefs / cssRefs bỏ liên kết ngoài, chuẩn hoá đường dẫn', () => {
  assert.deepEqual(htmlRefs(HTML), ['assets/app.css', 'js/a.js']);
  assert.deepEqual(cssRefs("a{b:url(\"../img/x.png?v=1\")} c{d:url(data:image/png;base64,AA)}", 'assets/css/app.css'), ['assets/img/x.png']);
});

test('stampBuild chèn hoặc thay meta proto-build', () => {
  const a = stampBuild('<html><head>\n<title>x</title></head></html>', '2026-11-05');
  assert.match(a, /<head>\n {2}<meta name="proto-build" content="2026-11-05">\n<title>/);
  assert.equal((stampBuild(a, '2026-11-06').match(/proto-build/g) || []).length, 1);
  assert.match(stampBuild(a, '2026-11-06'), /content="2026-11-06"/);
  const g = stampBuild(a, '2026-11-06', 'gop');
  assert.match(g, /<meta name="proto-menu" content="gop">/);
  assert.equal((stampBuild(g, '2026-11-07', 'tach').match(/proto-menu/g) || []).length, 1);
});

test('fillGuide điền ngày, các bản trước, dòng HUONG-DAN.html khi có', () => {
  assert.equal(fillGuide('{{DATE}} ({{PREV}})', { date: '2026-11-05-02', prev: ['2026-11-04', '2026-11-05'], guide: false }), '05/11/2026 (lần 02) (04/11, 05/11)');
  const tpl = 'bản ngày {{DATE}}\n\n{{GUIDE}}CÁCH MỞ\nbản trước ({{PREV}})';
  assert.equal(fillGuide(tpl, { date: '2026-11-06', prev: ['2026-10-26', '2026-11-05'], guide: false }), 'bản ngày 06/11/2026\n\nCÁCH MỞ\nbản trước (26/10, 05/11)');
  assert.match(fillGuide(tpl, { date: '2026-11-06', prev: [], guide: true }), /HUONG-DAN\.html\n\nCÁCH MỞ\nbản trước \(chưa có\)/);
  const real = fs.readFileSync(path.join(ROOT, 'tools', 'release', 'HUONG-DAN-MO.txt'), 'utf8');
  assert.doesNotMatch(fillGuide(real, { date: '2026-11-06', prev: ['2026-11-05'], guide: true }), /\{\{/);
});
