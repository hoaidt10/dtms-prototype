// T77 S2: phân hệ theo file / nhánh, cảnh báo guard, digest đầu phiên, CODEOWNERS khớp modules.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { moduleOf, moduleOfBranch, globRe, M } from '../tools/modules-lib.mjs';
import { guardMessage, sessionDigest } from '../tools/collab-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('glob: * không qua /, ** qua /', () => {
  assert.ok(globRe('js/kdt*.js').test('js/kdt-b2.js'));
  assert.ok(!globRe('js/kdt*.js').test('js/x/kdt.js'));
  assert.ok(globRe('assets/**').test('assets/a/b.css'));
});

test('moduleOf: file phân hệ, file dùng chung, file chưa xếp', () => {
  assert.equal(moduleOf('js/kdt-b2.js'), 'kdt');
  assert.equal(moduleOf('js/sx-du-an.js'), 'sx');
  assert.equal(moduleOf('js/eforms/sx-kh.js'), 'sx');
  assert.equal(moduleOf('js/hop-dong.js'), 'hop-dong');
  assert.equal(moduleOf('js/bpmn-tasks-ms23-02.js'), 'hop-dong');
  assert.equal(moduleOf('js/app.js'), 'shared');
  assert.equal(moduleOf('tai-lieu/_md/QT-10.2.1.md'), 'shared');
  assert.equal(moduleOf('README.md'), null);
});

test('không file nào thuộc hai phân hệ', () => {
  const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  const keys = Object.keys(M.modules);
  for (const f of files) {
    const hit = keys.filter((k) => M.modules[k].files.some((g) => globRe(g).test(f)));
    assert.ok(hit.length <= 1, `${f}: ${hit.join(', ')}`);
  }
});

test('moduleOfBranch', () => {
  assert.equal(moduleOfBranch('kdt/t80-tham-dinh'), 'kdt');
  assert.equal(moduleOfBranch('main'), null);
  assert.equal(moduleOfBranch('abc/x'), null);
});

test('guardMessage: đúng phân hệ im lặng; phân hệ khác / dùng chung / main thì cảnh báo', () => {
  assert.equal(guardMessage('kdt/x', 'js/kdt.js'), null);
  assert.equal(guardMessage('kdt/x', 'state/kdt.md'), null);
  assert.match(guardMessage('kdt/x', 'js/sx-du-an.js'), /thuộc phân hệ sx/);
  assert.match(guardMessage('kdt/x', 'js/app.js'), /DÙNG CHUNG/);
  assert.match(guardMessage('kdt/x', 'README.md'), /DÙNG CHUNG/);
  assert.match(guardMessage('main', 'js/kdt.js'), /không theo mẫu/);
  assert.equal(guardMessage('kdt/x', '../ngoai.txt'), null);
});

test('sessionDigest: nhánh phân hệ có tiền tố số + state; main nhắc tạo nhánh', () => {
  const d = sessionDigest('sx/t90-ke-hoach');
  assert.match(d, /phân hệ \*\*sx\*\*/);
  assert.match(d, /P-SX-xx/);
  assert.match(d, /state\/sx\.md/);
  assert.match(sessionDigest('main'), /tạo nhánh/);
});

test('hook guard đọc stdin, trả allow + lý do (không chặn)', () => {
  const r = spawnSync(process.execPath, ['.claude/hooks/guard.mjs'], { cwd: ROOT, input: JSON.stringify({ tool_input: { file_path: path.join(ROOT, 'js', 'app.js') } }), encoding: 'utf8' });
  assert.equal(r.status, 0);
  if (r.stdout) assert.equal(JSON.parse(r.stdout).hookSpecificOutput.permissionDecision, 'allow');
});

test('CODEOWNERS khớp modules.json', () => {
  const r = spawnSync(process.execPath, ['tools/codeowners.mjs', '--check'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
});
