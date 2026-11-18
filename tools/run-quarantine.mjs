// T77 S4: chạy riêng các ca e2e cách ly (e2e/quarantine.json) — npm run test:quarantine [-- <tham số playwright>].
// Sửa xong một ca: chạy lệnh này, ca đó xanh thì xoá dòng của nó khỏi quarantine.json.
import { spawnSync } from 'node:child_process';

const r = spawnSync('npx', ['playwright', 'test', ...process.argv.slice(2)], {
  stdio: 'inherit', shell: true, env: { ...process.env, QUARANTINE: 'only' },
});
process.exit(r.status ?? 1);
