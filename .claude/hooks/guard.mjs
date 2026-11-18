// T77 S2: PreToolUse (Edit|Write) — cảnh báo khi BA sửa file của phân hệ khác / file dùng chung / sửa trên main.
// Chỉ cảnh báo (allow + lý do). Lỗi nội bộ → cho qua im lặng.
import { execSync } from 'node:child_process';
import path from 'node:path';
import { ROOT } from '../../tools/modules-lib.mjs';
import { guardMessage } from '../../tools/collab-lib.mjs';

let buf = '';
process.stdin.on('data', (c) => { buf += c; });
process.stdin.on('end', () => {
  try {
    const fp = JSON.parse(buf).tool_input?.file_path;
    if (!fp) process.exit(0);
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const msg = guardMessage(branch, path.relative(ROOT, path.resolve(fp)));
    if (msg) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow', permissionDecisionReason: msg } }));
    }
  } catch { /* fail-open */ }
  process.exit(0);
});
