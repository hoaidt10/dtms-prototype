// Đăng prototype lên GitHub Pages (repo public riêng, chỉ chứa bản đóng gói — không đụng repo cds-vht).
//   node tools/publish-pages.mjs [--from <thư mục bản release>] [--repo owner/name] [--no-push] [--code <mã>] [--no-lock]
// Bản đăng được KHOÁ bằng mã truy cập (tools/page-lock.mjs — mã hoá AES-GCM, nhập mã mới xem được).
// Mã lấy theo thứ tự: --code, biến môi trường DTMS_PAGES_CODE, tệp prototype/dtms/.env.pages (DTMS_PAGES_CODE=...).
// .env.pages không được commit (sync-github.sh loại .env.*). --no-lock = đăng bản rõ (chỉ khi người dùng yêu cầu).
// Mặc định: đóng gói bản mới từ code hiện tại bằng release.mjs (--out thư mục tạm, --no-zip),
// rồi thay toàn bộ nội dung nhánh main của repo Pages bằng bản đó, commit và push.
// Link: https://<owner>.github.io/<name>/   (bật Pages lần đầu: gh api -X POST repos/<repo>/pages -f source[branch]=main -f source[path]=/)
import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lockSite } from './page-lock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), flag = (f) => args.includes(f);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const repo = opt('--repo') || 'thaiphuc22/dtms-prototype-v2';
const envFile = path.join(ROOT, '.env.pages');
const envTxt = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';
const envLines = envTxt.split(/\r?\n/).filter((l) => l.trim());
const envVal = (k) => { const l = envLines.find((x) => x.split('=')[0].trim() === k); return l ? l.slice(l.indexOf('=') + 1).trim() || null : null; };
const code = opt('--code') || process.env.DTMS_PAGES_CODE || envVal('DTMS_PAGES_CODE');
// Salt cố định theo mã (DTMS_PAGES_SALT trong .env.pages, kèm mã đã dùng): giữ nguyên thì người xem không phải nhập lại mã sau mỗi lần đăng.
let salt = process.env.DTMS_PAGES_SALT || (envVal('DTMS_PAGES_SALT_FOR') === code ? envVal('DTMS_PAGES_SALT') : null);
if (!flag('--no-lock') && code && !salt) {
  salt = crypto.randomBytes(16).toString('base64');
  const kept = envLines.filter((l) => !['DTMS_PAGES_SALT', 'DTMS_PAGES_SALT_FOR'].includes(l.split('=')[0].trim()));
  if (!envVal('DTMS_PAGES_CODE')) kept.unshift(`DTMS_PAGES_CODE=${code}`);
  fs.writeFileSync(envFile, [...kept, `DTMS_PAGES_SALT=${salt}`, `DTMS_PAGES_SALT_FOR=${code}`, ''].join('\n'));
  console.log('Salt mới (mã mới hoặc lần đầu) — người xem sẽ phải nhập mã một lần.');
}
if (!flag('--no-lock') && !code) { console.error('Thiếu mã truy cập: --code <mã>, DTMS_PAGES_CODE hoặc tệp .env.pages.'); process.exit(1); }
const run = (cmd, a, cwd) => {
  const r = spawnSync(cmd, a, { cwd, stdio: 'inherit' });
  if (r.status !== 0) { console.error(`✗ ${cmd} ${a.join(' ')}`); process.exit(1); }
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dtms-pages-'));
let src = opt('--from') && path.resolve(opt('--from'));
if (!src) {
  const out = path.join(tmp, 'build');
  run(process.execPath, [path.join(ROOT, 'tools', 'release.mjs'), '--out', out, '--no-zip', '--force'], ROOT);
  const name = fs.readdirSync(out).find((n) => n.startsWith('DTMS-Prototype-'));
  src = path.join(out, name);
}
if (!fs.existsSync(path.join(src, 'index.html'))) { console.error(`Không thấy index.html trong ${src}`); process.exit(1); }

const site = path.join(tmp, 'site');
run('git', ['clone', '--depth', '1', `https://github.com/${repo}.git`, site]);
for (const e of fs.readdirSync(site)) if (e !== '.git') fs.rmSync(path.join(site, e), { recursive: true, force: true });
fs.cpSync(src, site, { recursive: true });
fs.writeFileSync(path.join(site, '.nojekyll'), '');   // phục vụ nguyên trạng, không qua Jekyll
fs.rmSync(path.join(site, 'HUONG-DAN-MO.txt'), { force: true });  // hướng dẫn giải nén zip — không dùng cho bản web
if (!flag('--no-lock')) {
  try { const r = lockSite(site, code, salt); console.log(`Đã khoá bằng mã: ${r.scripts} script, ${r.files} tệp mẫu${r.guide ? ', HUONG-DAN' : ''}.`); }
  catch (e) { console.error(`✗ Khoá trang lỗi: ${e.message}`); process.exit(1); }
}

const build = path.basename(src);
run('git', ['add', '-A'], site);
const diff = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: site });
if (diff.status === 0) { console.log('Không có thay đổi so với bản đang đăng.'); process.exit(0); }
run('git', ['commit', '-q', '-m', `Đăng ${build}`], site);
if (flag('--no-push')) { console.log(`Đã commit (chưa push) tại ${site}`); process.exit(0); }
run('git', ['push', '-q', 'origin', 'HEAD:main'], site);
const [owner, name] = repo.split('/');
console.log(`Đã đăng ${build} → https://${owner}.github.io/${name}/  (Pages cập nhật sau ~1 phút)`);
fs.rmSync(tmp, { recursive: true, force: true });
