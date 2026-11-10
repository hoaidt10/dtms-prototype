// Đăng prototype lên GitHub Pages (repo public riêng, chỉ chứa bản đóng gói — không đụng repo cds-vht).
//   node tools/publish-pages.mjs [--from <thư mục bản release>] [--repo owner/name] [--no-push]
// Mặc định: đóng gói bản mới từ code hiện tại bằng release.mjs (--out thư mục tạm, --no-zip),
// rồi thay toàn bộ nội dung nhánh main của repo Pages bằng bản đó, commit và push.
// Link: https://<owner>.github.io/<name>/   (bật Pages lần đầu: gh api -X POST repos/<repo>/pages -f source[branch]=main -f source[path]=/)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), flag = (f) => args.includes(f);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const repo = opt('--repo') || 'thaiphuc22/dtms-prototype';
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
