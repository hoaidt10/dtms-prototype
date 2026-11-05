// T33 B0 — phần thuần của đóng gói prototype (không ghi đĩa ngoài hàm copy), để unit test được.
// Plan docs/dtms/T33-goi-prototype-khach-ke-hoach.md §3.1.
import fs from 'node:fs';
import path from 'node:path';

/* Danh sách được phép: chỉ những đường dẫn này vào gói. Thư mục kết thúc bằng '/'. */
export const ALLOW = ['index.html', 'assets/', 'js/', 'HUONG-DAN.html', 'huong-dan/'];
/* Tệp sinh khi đóng gói (không lấy từ thư mục nguồn). */
export const GENERATED = ['HUONG-DAN-MO.txt'];

const norm = (p) => p.split(path.sep).join('/');
export const allowed = (rel) => ALLOW.some((a) => (a.endsWith('/') ? rel.startsWith(a) : rel === a));

/* Liệt kê tệp nguồn được phép (đường dẫn tương đối, '/'), sắp xếp. */
export function listFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name), rel = norm(path.relative(root, abs));
      if (e.isDirectory()) { if (ALLOW.some((a) => a.endsWith('/') && (a.startsWith(rel + '/') || rel.startsWith(a)))) walk(abs); }
      else if (allowed(rel)) out.push(rel);
    }
  };
  walk(root);
  return out.sort();
}

/* Tham chiếu tệp cục bộ trong HTML (src / href, bỏ http(s), #, data:, mailto:). */
export function htmlRefs(html) {
  const refs = [];
  for (const m of html.matchAll(/\b(?:src|href)\s*=\s*"([^"]+)"/g)) {
    const u = m[1].split(/[?#]/)[0];
    if (!u || /^(https?:|data:|mailto:|javascript:|#)/i.test(m[1])) continue;
    refs.push(decodeURI(u));
  }
  return [...new Set(refs)];
}
/* url(...) trong CSS, tương đối với tệp CSS. */
export function cssRefs(css, cssRel) {
  const base = path.posix.dirname(cssRel);
  return [...new Set([...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]).filter((u) => !/^(data:|https?:|#)/i.test(u))
    .map((u) => path.posix.normalize(path.posix.join(base, u.split(/[?#]/)[0]))))];
}
/* Chuỗi 'assets/...' viết thẳng trong JS. */
export const jsAssetRefs = (src) => [...new Set([...src.matchAll(/['"`(]((?:assets)\/[A-Za-z0-9_./-]+\.[a-z0-9]+)/g)].map((m) => m[1]))];

/* Mẫu bị cấm trong tệp vào gói (bí mật, môi trường dev). */
export const FORBID = [
  [/(^|\/)\.env(\.|$)/, 'tệp .env'],
  [/\.map$/, 'source map'],
  [/\.(pem|key|pfx|p12)$/i, 'tệp khoá'],
];
export const FORBID_TEXT = [
  [/\blocalhost(:\d+)?\b/, 'localhost'],
  [/\b127\.0\.0\.1\b/, '127.0.0.1'],
  [/\b[A-Z]:\\\\(Users|Windows|Program)/i, 'đường dẫn tuyệt đối Windows'],
  [/file:\/\/\/[A-Z]:/i, 'đường dẫn file:/// tuyệt đối'],
];

/* Kiểm bộ tệp sẽ đóng gói. read(rel) → nội dung chuỗi. Trả { errors, warnings }. */
export function checkSet(files, read) {
  const errors = [], warnings = [], has = new Set(files);
  if (!has.has('index.html')) return { errors: ['Thiếu index.html'], warnings };
  const html = read('index.html');
  const refs = htmlRefs(html);
  refs.filter((r) => !has.has(r)).forEach((r) => errors.push(`index.html tham chiếu tệp không có: ${r}`));
  const loaded = new Set(refs);
  files.filter((f) => f.startsWith('js/') && f.endsWith('.js') && !loaded.has(f)).forEach((f) => errors.push(`Tệp JS không được index.html nạp: ${f}`));
  files.filter((f) => f.endsWith('.css')).forEach((f) => cssRefs(read(f), f).filter((r) => !has.has(r)).forEach((r) => errors.push(`${f} tham chiếu tệp không có: ${r}`)));
  files.filter((f) => f.endsWith('.js')).forEach((f) => jsAssetRefs(read(f)).filter((r) => !has.has(r)).forEach((r) => errors.push(`${f} tham chiếu tệp không có: ${r}`)));
  if (has.has('HUONG-DAN.html')) htmlRefs(read('HUONG-DAN.html')).filter((r) => !/^index\.html$/.test(r) && !has.has(r)).forEach((r) => errors.push(`HUONG-DAN.html tham chiếu tệp không có: ${r}`));
  for (const f of files) {
    for (const [re, what] of FORBID) if (re.test(f)) errors.push(`${what}: ${f}`);
    if (/\.(html|js|css|txt|json)$/.test(f)) { const t = read(f); for (const [re, what] of FORBID_TEXT) if (re.test(t)) errors.push(`${f} chứa ${what}`); }
  }
  if (!/<meta\s+name="proto-build"/.test(html)) warnings.push('index.html nguồn chưa có meta proto-build (sẽ chèn khi đóng gói)');
  return { errors, warnings };
}

/* Chèn / thay một meta theo name. */
function stampMeta(html, name, content) {
  const re = new RegExp(`<meta\\s+name="${name}"[^>]*>`), tag = `<meta name="${name}" content="${content}">`;
  if (re.test(html)) return html.replace(re, tag);
  /* Sau <meta charset> nếu có (charset nên đứng đầu <head>). */
  const cs = /<meta\s+charset=[^>]*>(\r?\n?)/i;
  if (cs.test(html)) return html.replace(cs, (m, nl) => `${m}${nl || '\n'}  ${tag}${nl || '\n'}`);
  return html.replace(/<head>(\r?\n?)/i, (m, nl) => `<head>${nl || '\n'}  ${tag}${nl || '\n'}`);
}
/* proto-build: ngày bản build (comment T30). proto-menu: phương án menu mặc định của bản gửi (khách chọn Gộp — luong.js đọc). */
export function stampBuild(html, date, menu) {
  let out = stampMeta(html, 'proto-build', date);
  if (menu) out = stampMeta(out, 'proto-menu', menu);
  return out;
}

/* Mã bản: YYYY-MM-DD hoặc YYYY-MM-DD-NN (nhiều bản trong một ngày, --suffix NN). */
export const VER_RE = /^(\d{4})-(\d{2})-(\d{2})(?:-(\d+))?$/;
const verText = (v, withYear) => { const [, y, m, d, n] = VER_RE.exec(v); return `${d}/${m}${withYear ? '/' + y : ''}${n ? ` (lần ${n})` : ''}`; };
/* Khuôn HUONG-DAN-MO.txt: {{DATE}} (dd/mm/yyyy [bản NN]), {{PREV}} (các bản trước), {{GUIDE}} (dòng trỏ HUONG-DAN.html nếu có).
   date / prev là mã bản (VER_RE). */
export function fillGuide(tpl, { date, prev, guide }) {
  return tpl.replace(/\{\{DATE\}\}/g, verText(date, true)).replace(/\{\{PREV\}\}/g, prev.length ? prev.map((p) => verText(p, false)).join(', ') : 'chưa có')
    .replace(/\{\{GUIDE\}\}\r?\n?/g, guide ? 'Hướng dẫn chi tiết (cách dùng, luồng ĐXMS theo 7 tác vụ, ảnh màn hình): nháy đúp tệp  HUONG-DAN.html\n\n' : '');
}
