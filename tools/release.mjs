// T33 B0 — đóng gói prototype gửi khách (plan docs/dtms/T33-goi-prototype-khach-ke-hoach.md §3.1).
//   node tools/release.mjs [--date YYYY-MM-DD] [--suffix NN] [--out <thư mục>] [--menu gop|tach] [--no-zip] [--force] [--check]
// --out: đóng bản nháp ra thư mục khác (mặc định prototype/_release); danh sách bản trước vẫn đọc từ _release.
// Kết quả: prototype/_release/DTMS-Prototype-<ngày>/ (+ .zip). Chỉ lấy tệp trong danh sách được phép (release-lib ALLOW);
// kiểm tham chiếu, tệp JS không ai nạp, mẫu cấm; chèn meta proto-build; sinh HUONG-DAN-MO.txt từ tools/release/HUONG-DAN-MO.txt.
// --check: chạy luôn tools/release-check.mjs trên tệp .zip vừa tạo.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { listFiles, checkSet, stampBuild, fillGuide, VER_RE } from './release-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REL = path.resolve(ROOT, '..', '_release');
const args = process.argv.slice(2), flag = (f) => args.includes(f);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const date = opt('--date') || today();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('--date phải dạng YYYY-MM-DD'); process.exit(2); }
/* --suffix NN: bản thứ hai trở đi trong cùng ngày → DTMS-Prototype-<ngày>-NN (bản đã gửi không ghi đè). */
const suffix = opt('--suffix');
if (suffix && !/^\d{1,3}$/.test(suffix)) { console.error('--suffix phải là số, vd 02'); process.exit(2); }
const ver = suffix ? `${date}-${suffix}` : date;

const OUT = opt('--out') ? path.resolve(opt('--out')) : REL;
fs.mkdirSync(OUT, { recursive: true });
/* --menu tach|gop: phương án menu mặc định của bản gửi (mặc định gop — khách chọn phương án Gộp, T27 B9b). */
const menu = opt('--menu') || 'gop';
if (!['tach', 'gop'].includes(menu)) { console.error('--menu phải là tach hoặc gop'); process.exit(2); }
const name = `DTMS-Prototype-${ver}`, dir = path.join(OUT, name), zip = dir + '.zip';
const files = listFiles(ROOT);
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const { errors, warnings } = checkSet(files, read);
warnings.forEach((w) => console.log('  ! ' + w));
if (errors.length) { console.error('Không đóng gói — lỗi:'); errors.forEach((e) => console.error('  ✗ ' + e)); process.exit(1); }

if (fs.existsSync(dir) || fs.existsSync(zip)) {
  if (!flag('--force')) { console.error(`Đã có ${name} trong _release — thêm --force để ghi đè.`); process.exit(1); }
  fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(zip, { force: true });
}
for (const rel of files) {
  const to = path.join(dir, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (rel === 'index.html') fs.writeFileSync(to, stampBuild(read(rel), ver, menu));
  else fs.copyFileSync(path.join(ROOT, rel), to);
}
const prev = fs.existsSync(REL) ? fs.readdirSync(REL).map((n) => (/^DTMS-Prototype-(.+)\.zip$/.exec(n) || [])[1]).filter((v) => v && VER_RE.test(v) && v < ver).sort() : [];
const tpl = fs.readFileSync(path.join(ROOT, 'tools', 'release', 'HUONG-DAN-MO.txt'), 'utf8');
const txt = fillGuide(tpl, { date: ver, prev, guide: files.includes('HUONG-DAN.html') }).replace(/\r?\n/g, '\r\n');
fs.writeFileSync(path.join(dir, 'HUONG-DAN-MO.txt'), '\uFEFF' + txt);

const size = (p) => { let s = 0; const w = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const a = path.join(d, e.name); if (e.isDirectory()) w(a); else s += fs.statSync(a).size; }); w(p); return s; };
console.log(`Đã chép ${files.length + 1} tệp (${files.filter((f) => f.startsWith('js/')).length} JS) → ${path.relative(process.cwd(), dir)} (${(size(dir) / 1048576).toFixed(2)} MB)`);

if (!flag('--no-zip')) {
  // tar của Windows (bsdtar) nén được zip; tar của Git Bash (GNU) thì không → gọi thẳng System32.
  const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
  const r = process.platform === 'win32' ? spawnSync(tar, ['-a', '-c', '-f', zip, '-C', OUT, name], { stdio: 'inherit' })
    : spawnSync('zip', ['-r', '-q', zip, name], { cwd: OUT, stdio: 'inherit' });
  if (r.status !== 0) { console.error('Nén zip lỗi.'); process.exit(1); }
  console.log(`Đã nén → ${path.relative(process.cwd(), zip)} (${(fs.statSync(zip).size / 1024).toFixed(0)} KB)`);
  if (flag('--check')) {
    const c = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'release-check.mjs'), zip], { stdio: 'inherit' });
    process.exit(c.status);
  }
}
