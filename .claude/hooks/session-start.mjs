// T77 S2: SessionStart — chèn digest theo nhánh (phân hệ, state, ca cách ly). Lỗi thì im lặng.
import { execSync } from 'node:child_process';
import { sessionDigest } from '../../tools/collab-lib.mjs';

try {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  process.stdout.write(sessionDigest(branch) + '\n');
} catch { /* fail-open */ }
