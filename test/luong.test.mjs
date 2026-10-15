// T17 — Luồng mua sắm (phương án Gộp): Tạo luồng = tạo ĐXMS + hồ sơ Phê duyệt + start (D-26); task giao theo nhân sự chỉ định của bước (D-27). B2: Cập nhật nhân sự (D-29).
// Chạy: node --test prototype/dtms/test/luong.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../js/', import.meta.url);

function boot() {
  const store = {};
  const window = {};
  const ctx = vm.createContext({ window, localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } }, console });
  for (const f of ['bpmn-tasks.js', 'bpmn-tasks-ms13.js', 'bpmn-tasks-ms02.js', 'data.js', 'flow.js']) vm.runInContext(readFileSync(new URL(f, dir), 'utf8'), ctx, { filename: f });
  window.Flow.init();
  return window;
}

const DATA = { title: 'Luồng mua sắm cho dự án A', nv: 'NV-KHCN-2026-014', unit: 'Trung tâm Vô tuyến', priority: 'Thường', est: null, period: '', secret: false, purpose: '',
  basis: [{ name: 'QD-giao-nhiem-vu.pdf', type: 'QD_NV', at: '01/10/2026' }] };

// Làm việc theo nhánh chính cho tới khi có token thoả `hit`.
function runUntil(w, hit) {
  const { Flow } = w;
  for (let i = 0; i < 300 && Flow.state.status === 'running'; i++) {
    const found = Flow.state.tokens.find(hit);
    if (found) return found;
    const tok = Flow.state.tokens[0];
    const c = Flow.mainChoice(tok.task);
    Flow.complete(tok.id, c, c && c.reason ? 'lý do test' : null);
  }
  return Flow.state.tokens.find(hit) || null;
}

test('Tạo luồng: một lần Lưu tạo ĐXMS + hồ sơ Phê duyệt, start quy trình, lưu nhân sự và căn cứ', () => {
  const w = boot(), { Flow } = w;
  const members = { 1: ['minh', 'ngoc'], 13: ['hai'], 17: ['mai'] };
  const code = Flow.createLuong(Object.assign({ members }, DATA), { process: 'MS01.01', name: DATA.title, caseFiles: [{ name: 'Bao-gia-so-bo.pdf', type: 'BAO_GIA' }] });
  const x = Flow.findDxms(code);
  assert.equal(x.luong, true);
  assert.deepEqual([...x.members['17']], ['mai']);
  assert.equal(x.basis[0].type, 'QD_NV');
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.state.dxms, code);
  assert.equal(Flow.state.vars.process, 'MS01.01');
  assert.equal(Flow.ui.uploads[0].name, 'Bao-gia-so-bo.pdf');
  // Task 01 giao cả hai Chuyên quản đã chọn; người tạo (minh) nhận.
  const t1 = Flow.state.tokens.find((t) => String(t.task) === '1');
  assert.deepEqual([...t1.cands], ['minh', 'ngoc']);
  assert.equal(Flow.state.persona, 'minh');
  assert.equal(Flow.tokensFor('ngoc').length, 1);
});

test('Bước có chỉ định giao người đã chọn (mai); bước TTMS không chỉ định giao theo vai trò như quy trình (lan)', () => {
  const w = boot(), { Flow, D } = w;
  const lanSteps = Object.keys(D.flow).filter((k) => D.flow[k].who === 'lan');
  Flow.createLuong(Object.assign({ members: { [lanSteps[0]]: ['mai'] } }, DATA), { process: 'MS01.01', name: DATA.title });
  const tok = runUntil(w, (t) => String(t.task) === lanSteps[0]);
  assert.ok(tok, 'phải tới bước TTMS được chỉ định');
  assert.equal(tok.who, 'mai');
  assert.deepEqual([...tok.cands], ['mai']);
  assert.equal(Flow.tokensFor('lan').filter((t) => t.id === tok.id).length, 0);
  assert.equal(Flow.tokensFor('mai').filter((t) => t.id === tok.id).length, 1);
  // Bước TTMS khác không có dòng chỉ định → giao Lan, không có cands.
  const next = runUntil(w, (t) => String(t.task) !== lanSteps[0] && (D.flow[t.task] || {}).who === 'lan');
  assert.ok(next, 'phải tới bước TTMS không chỉ định');
  assert.equal(next.who, 'lan');
  assert.equal(next.cands, undefined);
});

test('Hồ sơ tạo theo cách cũ (không có nhân sự luồng) giao như trước', () => {
  const w = boot(), { Flow } = w;
  Flow.create('MS01.01');
  assert.equal(Flow.state.members, null);
  const t1 = Flow.state.tokens[0];
  assert.equal(t1.who, 'minh');
  assert.equal(t1.cands, undefined);
});

test('Cập nhật nhân sự (B2, D-29): Thay người chuyển task đang mở + lần sau; Bổ sung thêm candidate; ghi lịch sử', () => {
  const w = boot(), { Flow } = w;
  const code = Flow.createLuong(Object.assign({ members: { 17: ['mai'] } }, DATA), { process: 'MS01.01', name: DATA.title });
  assert.deepEqual([...Flow.membersOf(13).list], ['hai']);
  assert.equal(Flow.membersOf(13).set, false);
  // Thay ở bước đang mở (01): task chuyển ngay sang Ngọc.
  const r1 = Flow.updateMembers({ task: '1', mode: 'replace', drop: ['minh'], add: ['ngoc'], doc: 'QD.pdf', reason: 'nghỉ phép' });
  const t1 = Flow.state.tokens[0];
  assert.equal(t1.who, 'ngoc');
  assert.deepEqual([...t1.cands], ['ngoc']);
  assert.equal(r1.moved.length, 1);
  assert.deepEqual([...r1.old], ['minh']);
  // Thay ở bước chưa tới (13): ĐXMS lưu nhân sự mới, luồng tới bước giao Sơn.
  const r2 = Flow.updateMembers({ task: '13', mode: 'replace', drop: ['hai'], add: ['son'] });
  assert.equal(r2.moved.length, 0);
  assert.deepEqual([...Flow.findDxms(code).members['13']], ['son']);
  // Bổ sung ở bước 17: Mai + Lan.
  Flow.updateMembers({ task: '17', mode: 'add', add: ['lan'] });
  const t13 = runUntil(w, (t) => String(t.task) === '13');
  assert.equal(t13.who, 'son');
  const t17 = runUntil(w, (t) => String(t.task) === '17');
  assert.deepEqual([...t17.cands], ['mai', 'lan']);
  assert.equal(Flow.state.memberLog.length, 3);
  assert.deepEqual([...Flow.state.memberLog.map((r) => r.mode)], ['replace', 'replace', 'add']);
});
