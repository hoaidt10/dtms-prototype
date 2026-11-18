// T77 (D-129): đọc modules.json — file thuộc phân hệ nào, nhánh đang làm phân hệ nào. Dùng cho hook, CODEOWNERS, kiểm tra.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'modules.json'), 'utf8'));

// Glob tối giản: ** = mọi thứ (kể cả /), * = mọi ký tự trừ /.
export const globRe = (g) => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\0').replace(/\*/g, '[^/]*').replace(/\0/g, '.*') + '$');
const RULES = [['shared', M.shared.files], ...Object.entries(M.modules).map(([k, m]) => [k, m.files])]
  .map(([k, gs]) => [k, gs.map(globRe)]);

/** Phân hệ của một đường dẫn tương đối (dấu /) — 'shared', khóa phân hệ, hoặc null (chưa xếp). */
export function moduleOf(rel) {
  const r = rel.split(path.sep).join('/').replace(/^\.\//, '');
  for (const [k, res] of RULES) if (res.some((re) => re.test(r))) return k;
  return null;
}

/** Phân hệ theo tên nhánh `<phân-hệ>/<việc>`; null nếu nhánh không theo mẫu (vd main). */
export function moduleOfBranch(branch) {
  const k = (branch || '').split('/')[0];
  return M.modules[k] ? k : null;
}
