// T77 (D-129): sinh .github/CODEOWNERS từ modules.json. node tools/codeowners.mjs [--check]
// Mặc định mọi file thuộc người tích hợp; phân hệ có owners thì file của phân hệ thuộc owners + người tích hợp.
// (Repo cá nhân gói Free: CODEOWNERS chỉ tự mời review, không bắt buộc — xem CLAUDE.md.)
import fs from 'node:fs';
import path from 'node:path';
import { M, ROOT } from './modules-lib.mjs';

const at = (u) => '@' + u.replace(/^@/, '');
let out = '# SINH TỰ ĐỘNG từ modules.json bằng `node tools/codeowners.mjs` — không sửa tay.\n' +
  `* ${at(M.integrator)}\n`;
for (const [k, m] of Object.entries(M.modules)) {
  if (!m.owners.length) { out += `\n# ${k} — ${m.label}: chưa giao BA (thuộc người tích hợp)\n`; continue; }
  out += `\n# ${k} — ${m.label}\n`;
  const who = [...m.owners.map(at), at(M.integrator)].join(' ');
  for (const g of m.files) out += `/${g} ${who}\n`;
}
const p = path.join(ROOT, '.github', 'CODEOWNERS');
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== out) { console.error('.github/CODEOWNERS lệch modules.json — chạy node tools/codeowners.mjs'); process.exit(1); }
  console.log('CODEOWNERS khớp modules.json');
} else {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, out);
  console.log('Đã ghi .github/CODEOWNERS');
}
