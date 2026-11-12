// Khoá bản đăng web của prototype bằng mã truy cập (mã hoá thật, không phải màn chặn giả).
//   import { lockSite } from './page-lock.mjs';  lockSite(<thư mục bản release>, <mã>)
//   node tools/page-lock.mjs <thư mục> <mã>      (khoá tại chỗ)
// Cách làm: index.html + toàn bộ js/ (theo đúng thứ tự <script>), HUONG-DAN.html (ảnh nhúng sẵn) và tệp mẫu
// assets/mau/ được gộp, nén gzip, mã hoá AES-256-GCM với khoá PBKDF2-SHA256 từ mã → x/app.bin, x/guide.bin.
// index.html / HUONG-DAN.html thay bằng màn nhập mã; giải mã trong trình duyệt (WebCrypto), sai mã = không có nội dung.
// Để nguyên (không nhạy cảm): assets/app.css, assets/fonts/, assets/empty-table.svg.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ITER = 310000;
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.gif': 'image/gif',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.pdf': 'application/pdf' };

export function deriveKey(code, salt) { return crypto.pbkdf2Sync(String(code).normalize('NFC'), salt, ITER, 32, 'sha256'); }

// Gói = iv(12) | bản mã | tag(16) — đúng định dạng AES-GCM của WebCrypto.
export function seal(obj, key) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([c.update(zlib.gzipSync(Buffer.from(JSON.stringify(obj), 'utf8'), { level: 9 })), c.final()]);
  return Buffer.concat([iv, body, c.getAuthTag()]);
}
export function open(buf, key) {
  const d = crypto.createDecipheriv('aes-256-gcm', key, buf.subarray(0, 12));
  d.setAuthTag(buf.subarray(buf.length - 16));
  return JSON.parse(zlib.gunzipSync(Buffer.concat([d.update(buf.subarray(12, buf.length - 16)), d.final()])).toString('utf8'));
}

const walk = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]) : [];
const rel = (root, f) => path.relative(root, f).split(path.sep).join('/');

// salt (base64, 16 byte) cố định giữa các lần đăng → người xem đã ghi nhớ mã không phải nhập lại; đổi mã thì đổi salt.
export function lockSite(dir, code, saltB64) {
  if (!code || String(code).length < 6) throw new Error('Mã truy cập phải có ít nhất 6 ký tự.');
  const salt = saltB64 ? Buffer.from(saltB64, 'base64') : crypto.randomBytes(16);
  if (salt.length !== 16) throw new Error('Salt phải là 16 byte base64.');
  const key = deriveKey(code, salt);

  // 1. App: index.html + script theo thứ tự.
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) throw new Error('index.html có <script> nội tuyến — page-lock chỉ hỗ trợ <script src>.');
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/gi)].map((m) => m[1]);
  if (scripts.some((s) => /^[a-z]+:|^\/\//i.test(s))) throw new Error('index.html tham chiếu script ngoài — không khoá được.');
  const files = {};
  for (const f of walk(path.join(dir, 'assets', 'mau'))) files[rel(dir, f)] = { type: MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', b64: fs.readFileSync(f).toString('base64') };
  const app = { html, scripts: scripts.map((src) => ({ src, code: fs.readFileSync(path.join(dir, src), 'utf8') })), files };
  const jsAll = walk(path.join(dir, 'js')).map((f) => rel(dir, f)).filter((f) => f.endsWith('.js'));
  const missed = jsAll.filter((f) => !scripts.includes(f));
  if (missed.length) throw new Error(`Có tệp js không nằm trong index.html (sẽ bị lộ): ${missed.join(', ')}`);

  // 2. Hướng dẫn: nhúng ảnh huong-dan/ thành data URI.
  let guide = null;
  const gp = path.join(dir, 'HUONG-DAN.html');
  if (fs.existsSync(gp)) {
    const g = fs.readFileSync(gp, 'utf8').replace(/(src|href)="(huong-dan\/[^"]+)"/g, (m, a, p) => {
      const f = path.join(dir, p);
      if (!fs.existsSync(f)) return m;
      return `${a}="data:${MIME[path.extname(f).toLowerCase()] || 'application/octet-stream'};base64,${fs.readFileSync(f).toString('base64')}"`;
    });
    if (/<script/i.test(g)) throw new Error('HUONG-DAN.html có <script> — page-lock chưa hỗ trợ.');
    guide = { html: g };
  }

  // 3. Ghi gói, xoá bản rõ, đặt màn nhập mã.
  fs.mkdirSync(path.join(dir, 'x'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'x', 'app.bin'), seal(app, key));
  if (guide) fs.writeFileSync(path.join(dir, 'x', 'guide.bin'), seal(guide, key));
  for (const p of ['js', 'huong-dan', path.join('assets', 'mau')]) fs.rmSync(path.join(dir, p), { recursive: true, force: true });
  const cfg = { salt: salt.toString('base64'), iter: ITER, kid: crypto.createHash('sha256').update(salt).digest('hex').slice(0, 12) };
  const lang = (html.match(/<html[^>]*\blang="([^"]+)"/i) || [])[1] || 'vi';
  fs.writeFileSync(path.join(dir, 'index.html'), gatePage({ ...cfg, bin: 'x/app.bin', mode: 'app', lang }));
  if (guide) fs.writeFileSync(path.join(dir, 'HUONG-DAN.html'), gatePage({ ...cfg, bin: 'x/guide.bin', mode: 'doc', lang }));
  fs.writeFileSync(path.join(dir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

  // 4. Tự kiểm: không còn tệp bản rõ nhạy cảm, gói mở lại được.
  const left = walk(dir).map((f) => rel(dir, f)).filter((f) => /\.(js|jpg|jpeg|png|docx|xlsx|pdf)$/i.test(f));
  if (left.length) throw new Error(`Còn tệp chưa khoá: ${left.join(', ')}`);
  const back = open(fs.readFileSync(path.join(dir, 'x', 'app.bin')), deriveKey(code, salt));
  if (back.scripts.length !== scripts.length) throw new Error('Gói app.bin không khớp sau khi mở lại.');
  return { scripts: scripts.length, files: Object.keys(files).length, guide: !!guide };
}

// Màn nhập mã — tự chứa (CSS + JS nội tuyến), không phụ thuộc tệp nào đã khoá.
function gatePage(c) {
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Nhập mã truy cập</title>
<style>
  :root { --bg:#f4f5f7; --card:#fff; --tx:#1f2328; --mu:#5b6470; --bd:#d0d4da; --ac:#c8102e; --er:#b42318; }
  @media (prefers-color-scheme: dark) { :root { --bg:#16181c; --card:#20232a; --tx:#e8eaed; --mu:#9aa3ad; --bd:#3a3f47; --ac:#ff4d5e; --er:#ff8a80; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px;
    background:var(--bg); color:var(--tx); font:15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .gate { width:100%; max-width:360px; background:var(--card); border:1px solid var(--bd); border-radius:10px; padding:28px 24px; }
  h1 { font-size:18px; margin:0 0 4px; } p { margin:0 0 18px; color:var(--mu); font-size:14px; }
  label { display:block; font-size:13px; font-weight:600; margin-bottom:6px; }
  input[type=password] { width:100%; padding:10px 12px; font:inherit; color:inherit; background:transparent; border:1px solid var(--bd); border-radius:6px; }
  input[type=password]:focus { outline:2px solid var(--ac); outline-offset:-1px; border-color:var(--ac); }
  .rm { display:flex; gap:8px; align-items:center; margin:12px 0 18px; font-size:13px; color:var(--mu); font-weight:400; }
  button { width:100%; padding:10px; font:inherit; font-weight:600; color:#fff; background:var(--ac); border:0; border-radius:6px; cursor:pointer; }
  button:disabled { opacity:.6; cursor:progress; }
  .err { min-height:20px; margin-top:10px; color:var(--er); font-size:13px; }
</style>
</head>
<body>
<form class="gate" id="gate" hidden autocomplete="off">
  <h1>Prototype ĐTMS</h1>
  <p>Trang này cần mã truy cập. Liên hệ người gửi link để nhận mã.</p>
  <label for="code">Mã truy cập</label>
  <input type="password" id="code" required autofocus>
  <label class="rm"><input type="checkbox" id="remember" checked> Ghi nhớ trên máy này</label>
  <button type="submit" id="go">Vào xem</button>
  <div class="err" id="err" role="alert"></div>
</form>
<script>
(() => {
  const C = ${JSON.stringify({ salt: c.salt, iter: c.iter, kid: c.kid, bin: c.bin, mode: c.mode })};
  const K = 'dtms-gate-' + C.kid, $ = (id) => document.getElementById(id);
  const b64 = (s) => Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0));
  const store = (fn) => { try { return fn(localStorage); } catch (e) { return null; } };
  const sstore = (fn) => { try { return fn(sessionStorage); } catch (e) { return null; } };
  let cipher = null;
  const getBin = () => cipher || (cipher = fetch(C.bin, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error('net'); return r.arrayBuffer(); }));

  async function derive(code) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(code.normalize('NFC')), 'PBKDF2', false, ['deriveBits']);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(C.salt), iterations: C.iter }, base, 256));
  }
  async function decrypt(raw) {
    const buf = new Uint8Array(await getBin());
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.subarray(0, 12) }, key, buf.subarray(12));
    const text = await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    return JSON.parse(text);
  }
  function mount(p) {
    const doc = new DOMParser().parseFromString(p.html, 'text/html');
    doc.querySelectorAll('script').forEach((s) => s.remove());
    document.title = doc.title;
    document.head.innerHTML = doc.head.innerHTML;
    document.body.innerHTML = doc.body.innerHTML;
    for (const a of doc.body.attributes) document.body.setAttribute(a.name, a.value);
    if (p.files) {
      const urls = {};
      for (const [k, f] of Object.entries(p.files)) urls[k] = URL.createObjectURL(new Blob([b64(f.b64)], { type: f.type }));
      document.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        const u = a && urls[a.getAttribute('href')];
        if (u) a.href = u;
      }, true);
    }
    for (const s of p.scripts || []) {
      const el = document.createElement('script');
      el.src = URL.createObjectURL(new Blob([s.code + '\\n//# sourceURL=' + s.src], { type: 'text/javascript' }));
      el.async = false;
      document.body.appendChild(el);
    }
    if (location.hash && C.mode === 'doc') { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) t.scrollIntoView(); }
  }
  const toB64 = (u8) => btoa(String.fromCharCode(...u8));
  async function tryKey(raw) { const p = await decrypt(raw); mount(p); }

  if (!window.crypto || !crypto.subtle || typeof DecompressionStream === 'undefined') {
    document.body.innerHTML = '<p style="padding:24px">Trình duyệt này không hỗ trợ mở trang đã khoá. Dùng Chrome, Edge, Firefox hoặc Safari bản mới.</p>';
    return;
  }
  const saved = store((s) => s.getItem(K)) || sstore((s) => s.getItem(K));
  const showForm = () => { $('gate').hidden = false; $('code').focus(); };
  (saved ? tryKey(b64(saved)).catch(() => { store((s) => s.removeItem(K)); sstore((s) => s.removeItem(K)); showForm(); }) : Promise.resolve(showForm()));

  $('gate').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = $('code').value.trim();
    if (!code) return;
    $('go').disabled = true; $('err').textContent = '';
    try {
      const raw = await derive(code);
      const p = await decrypt(raw);
      const v = toB64(raw);
      if ($('remember').checked) store((s) => s.setItem(K, v)); else sstore((s) => s.setItem(K, v));
      mount(p);
    } catch (err) {
      $('err').textContent = err && err.message === 'net' ? 'Không tải được nội dung, thử lại sau.' : 'Mã không đúng.';
      $('go').disabled = false; $('code').select();
    }
  });
})();
</script>
</body>
</html>
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [dir, code, salt] = process.argv.slice(2);
  if (!dir || !code) { console.error('Dùng: node tools/page-lock.mjs <thư mục> <mã> [salt base64]'); process.exit(1); }
  console.log(lockSite(path.resolve(dir), code, salt));
}
