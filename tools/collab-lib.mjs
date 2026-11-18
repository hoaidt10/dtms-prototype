// T77 S2 (D-129): logic của hook Claude Code cho BA (thuần, test ở test/collab.test.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { M, ROOT, moduleOf, moduleOfBranch } from './modules-lib.mjs';

const list = () => Object.entries(M.modules).map(([k, m]) => `${k} (${m.label})`).join('; ');

/** Cảnh báo khi sửa file `rel` trên nhánh `branch`; null = không cảnh báo. */
export function guardMessage(branch, rel) {
  const r = rel.split(path.sep).join('/');
  if (r.startsWith('..') || path.isAbsolute(r)) return null; // ngoài repo
  if (r.startsWith('state/')) return null; // state của phân hệ: ai cũng ghi được state của mình
  const mine = moduleOfBranch(branch);
  if (!mine) {
    return `Đang ở nhánh "${branch}" — không theo mẫu <phân-hệ>/<việc>. BA không sửa trên main: ` +
      `tạo nhánh trước (git switch -c <phân-hệ>/<việc>), phân hệ: ${list()}. Người tích hợp làm việc từ workspace cds-vht thì bỏ qua cảnh báo này.`;
  }
  const own = moduleOf(r);
  if (own === mine) return null;
  if (own === null || own === 'shared') {
    return `${r} là file DÙNG CHUNG (người tích hợp giữ). Chỉ sửa khi thật cần, sửa ít nhất, và ghi lý do ở mục "File dùng chung" của PR.`;
  }
  return `${r} thuộc phân hệ ${own} (${M.modules[own].label}), không phải ${mine}. Không sửa file của phân hệ khác — ` +
    'cần thay đổi ở đó thì ghi vào PR / hỏi người tích hợp.';
}

/** Digest đầu phiên theo nhánh. */
export function sessionDigest(branch) {
  const mine = moduleOfBranch(branch);
  const lines = ['📋 Prototype ĐTMS — repo nguồn (đọc CLAUDE.md trước mọi việc).'];
  if (!mine) {
    lines.push(`Nhánh hiện tại: ${branch || '?'} — chưa theo mẫu <phân-hệ>/<việc>. BA: kéo main mới (git pull --rebase) rồi tạo nhánh của việc trước khi sửa.`);
    lines.push(`Phân hệ: ${list()}.`);
    return lines.join('\n');
  }
  const m = M.modules[mine];
  lines.push(`Nhánh ${branch} → phân hệ **${mine}** (${m.label}); tiền tố số mới: P-${m.prefix}-xx, DX-${m.prefix}-xx, Q-${m.prefix}-xx, SCR-${m.prefix}-xx.`);
  const sp = path.join(ROOT, 'state', `${mine}.md`);
  if (fs.existsSync(sp)) {
    const s = fs.readFileSync(sp, 'utf8');
    const now = (s.match(/## Now\s*\n([\s\S]*?)(\n## |$)/) || [])[1];
    if (now && now.trim()) lines.push(`State (state/${mine}.md) — Now:\n${now.trim().slice(0, 1200)}`);
    lines.push(`Đọc đủ state/${mine}.md; cập nhật Now cuối mỗi pha.`);
  }
  try {
    const q = JSON.parse(fs.readFileSync(path.join(ROOT, 'e2e', 'quarantine.json'), 'utf8')).tests.filter((t) => t.area === mine);
    if (q.length) lines.push(`Ca e2e cách ly của phân hệ: ${q.length} (e2e/quarantine.json) — sửa dần, xanh thì xoá dòng.`);
  } catch { /* không có danh sách cách ly */ }
  return lines.join('\n');
}
