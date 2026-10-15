// Kiểm tra luồng Điều chỉnh ĐXMS (MS02, T21) của prototype: trang "MS02 ver1.1" (61 bước, trùng topo MS01 v1.1, không 10a/10b),
// phân nhánh theo giá trị sau điều chỉnh và căn cứ của ĐXMS cũ (plan T21 D-37, D-39).
// Chạy: node --test prototype/dtms/test/ms02.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../js/', import.meta.url);

function boot() {
  const store = {};
  const window = {};
  const ctx = vm.createContext({
    window,
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } },
    console,
  });
  for (const f of ['bpmn-tasks.js', 'bpmn-tasks-ms13.js', 'bpmn-tasks-ms02.js', 'data.js', 'flow.js']) {
    vm.runInContext(readFileSync(new URL(f, dir), 'utf8'), ctx, { filename: f });
  }
  window.Flow.init();
  return window;
}

// Làm việc của token đầu tiên (hoặc ở pick.task), nút theo nhãn hoặc nút chính — định nghĩa luồng theo quy trình đang chạy (Flow.def()).
function step(w, pick) {
  const { Flow } = w;
  const tok = pick && pick.task ? Flow.state.tokens.find((t) => t.task === pick.task) : Flow.state.tokens[0];
  assert.ok(tok, `phải còn token${pick && pick.task ? ' ở task ' + pick.task : ''}`);
  const f = Flow.def()[tok.task];
  let choice = null;
  if (f.choices) {
    choice = pick && pick.label ? Flow.choices(tok.task).find((c) => c.label.startsWith(pick.label)) : Flow.mainChoice(tok.task);
    assert.ok(choice, `task ${tok.task} không có lựa chọn ${pick && pick.label}`);
  }
  Flow.complete(tok.id, choice, choice && choice.reason ? 'lý do test' : null);
  return tok;
}
const plain = (x) => JSON.parse(JSON.stringify(x));
const has = (w, task) => w.Flow.state.tokens.some((t) => String(t.task) === String(task));
function runUntil(w, task, max = 300) {
  let n = 0;
  while (!has(w, task) && w.Flow.state.status === 'running' && n++ < max) step(w);
  assert.ok(has(w, task), `phải tới task ${task}`);
}
function runMain(w, max = 400) {
  let n = 0;
  while (w.Flow.state.status === 'running' && n++ < max) step(w);
}
const statusOf = (w, ns) => ns.map((n) => w.Flow.taskStatus(n));

test('61 bước MS02 trích từ trang MS02 ver1.1, đều có cấu hình trong D.flows.MS02; không có 10a/10b', () => {
  const w = boot();
  const B = w.BPMN_FLOWS.MS02, A = w.D.flows.MS02;
  assert.equal(B.page, 'MS02 ver1.1');
  assert.equal(Object.keys(B.tasks).length, 61);
  assert.equal(B.tasks[1].name, 'Chọn ĐXMS đã được phê duyệt cần điều chỉnh');
  assert.ok(!A['10a'] && !A['10b']);
  for (let n = 1; n <= 61; n++) {
    assert.ok(A[n], `thiếu flow task ${n}`);
    if (B.tasks[n].type === 'user') assert.ok(A[n].who && A[n].scr, `user task ${n} thiếu who/scr`);
  }
  for (const [k, f] of Object.entries(A)) {
    const dests = [f.next, f.to, ...(f.choices || []).map((c) => c.to), ...(f.forkTo || []).map((b) => b.task), ...(f.also || []).map((b) => b.task)];
    if (f.varGate) dests.push(...Object.values(Object.values(f.varGate)[0]));
    if (f.roundGate) dests.push(f.roundGate.over, f.roundGate.under);
    for (const d of dests.filter((x) => x != null)) assert.ok(['END', 'END_OTHER'].includes(d) || A[d], `${k} → ${d} không tồn tại`);
  }
  // Mũi tên của trang: cổng sau 10 rẽ 11 / 12 theo giá trị (không có cổng "khớp quy trình").
  const g = B.edges.filter((e) => /^G/.test(e[0]) && ['11', '12'].includes(String(e[1])) && /160/.test(e[2])).map((e) => e[2]);
  assert.deepEqual(plain(g).sort(), ['<160 tỷ', '≥160 tỷ']);
});

test('MS02.02: ĐXMS đã phê duyệt theo MS01.02 → hồ sơ DC, ≥ 160 tỷ, chọn sẵn Không báo cáo Tập đoàn, phê duyệt BM-08', () => {
  const w = boot();
  const { Flow } = w;
  const code = Flow.createAdj({ dxms: 'ĐXMS-2026-0103', name: 'Điều chỉnh lần 1 — Mua sắm hệ thống mô phỏng mạng lõi 5G', before: 210.5 });
  const ci = Flow.ci();
  assert.equal(ci.code, code);
  assert.equal(ci.kind, 'DC');
  assert.equal(ci.flow, 'MS02');
  assert.equal(ci.from, 'HS-2026-0103');
  assert.equal(Flow.state.vars.basisTD, true);
  assert.equal(Flow.state.tokens[0].task, 1);
  assert.equal(Flow.taskName(1), 'Chọn ĐXMS đã được phê duyệt cần điều chỉnh');
  runUntil(w, 48);
  assert.equal(Flow.mainChoice(48).label, 'Không báo cáo TGĐ Tập đoàn');
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.ci().branch, 'MS02.02');
  assert.deepEqual(statusOf(w, [12, 41, 46, 47, 48, 57, 60, 61]), Array(8).fill('done'));
  assert.deepEqual(statusOf(w, [11, 38, 39, 40, 49, 52, 56]), Array(7).fill('na'));
});

test('MS02.03: ĐXMS < 160 tỷ → dự thảo 11, ký trực tiếp BM-09 (38 ‖ 39 → 40) rồi 60', () => {
  const w = boot();
  const { Flow } = w;
  Flow.createAdj({ dxms: 'ĐXMS-2026-0089', name: 'Điều chỉnh lần 1', before: 18.7, total: 21.5 });
  assert.equal(Flow.ci().total, 21.5);
  assert.equal(Flow.ci().before, 18.7);
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.ci().branch, 'MS02.03');
  assert.deepEqual(statusOf(w, [11, 38, 39, 40, 60, 61]), Array(6).fill('done'));
  assert.deepEqual(statusOf(w, [12, 41, 48, 57, 59]), Array(5).fill('na'));
});

test('Chuyển ngưỡng: ĐXMS cũ ≥ 160 tỷ, giá trị sau điều chỉnh < 160 tỷ → cổng sau 10 đi 11 (MS02.03)', () => {
  const w = boot();
  const { Flow } = w;
  Flow.createAdj({ dxms: 'ĐXMS-2026-0103', name: 'Điều chỉnh giảm quy mô', before: 210.5 });
  assert.equal(Flow.state.vars.big, true);
  runUntil(w, 10);
  Flow.setAdj({ total: 150, reason: 'Giảm 02 cụm mô phỏng' });
  assert.equal(w.D.caseInfo.total, 150);
  step(w);
  assert.ok(has(w, 11) && !has(w, 12), 'phải sang dự thảo < 160 tỷ');
  assert.equal(Flow.state.vars.big, false);
  assert.equal(Flow.ci().branch, 'MS02.03');
});

test('MS02.01: phê duyệt ĐXMS theo MS01.01 rồi tạo hồ sơ Điều chỉnh — hồ sơ cũ giữ làm căn cứ, báo cáo Tập đoàn 49–56', () => {
  const w = boot();
  const { Flow } = w;
  Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' });
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  const pd = Flow.ci();
  Flow.createAdj({ dxms: 'ĐXMS-2026-0117', name: 'Điều chỉnh lần 1', before: pd.total, total: pd.total + 12 });
  const kept = Flow.state.adj.find((c) => c.code === 'HS-2026-0117');
  assert.ok(kept && kept.st === 'done' && kept.kind === 'PD' && kept.flow === 'MS01.01', 'hồ sơ Phê duyệt đã xong phải được giữ');
  assert.equal(Flow.ci().from, 'HS-2026-0117');
  assert.equal(Flow.state.vars.basisTD, false);
  assert.notEqual(Flow.ci().code, 'HS-2026-0117');
  runUntil(w, 48);
  assert.equal(Flow.mainChoice(48).label, 'Có báo cáo TGĐ Tập đoàn');
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.ci().branch, 'MS02.01');
  assert.deepEqual(statusOf(w, [49, 50, 51, 52, 53, 56, 57, 60]), Array(8).fill('done'));
});

test('TTMS đổi lựa chọn ở 48 (P-106): căn cứ đã TĐ duyệt nhưng chọn Có báo cáo → đi 49', () => {
  const w = boot();
  const { Flow } = w;
  Flow.createAdj({ dxms: 'ĐXMS-2026-0103', name: 'Điều chỉnh', before: 210.5 });
  runUntil(w, 48);
  step(w, { task: 48, label: 'Có báo cáo' });
  assert.ok(has(w, 50) || has(w, 49) || Flow.state.history.some((h) => String(h.task) === '49'), 'phải sang 49');
  assert.equal(Flow.ci().branch, 'MS02.01');
});

test('Bộ demo MS02 (B3): mọi cảnh / nhánh phụ tua tới đúng bước, đúng vai, đúng luồng con', () => {
  const w = boot();
  const { Flow, D } = w;
  const set = D.demoSets.find((d) => d.key === 'MS02');
  assert.ok(set, 'phải có bộ demo MS02');
  const want = { A7: 'MS02.03', A8: 'MS02.03', A9: 'MS02.01', A10: 'MS02.01', A4: 'MS02.02', A5: 'MS02.02' };
  for (const sc of set.scenes) {
    Flow.jumpToScene(sc.n, 'MS02');
    if (sc.start === 'NEW') { assert.equal(Flow.state.status, 'new', `cảnh ${sc.n}`); continue; }
    if (sc.start === 'END') { assert.equal(Flow.state.status, 'approved', `cảnh ${sc.n}`); continue; }
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(sc.start) && t.who === sc.who), `cảnh ${sc.n}: token ${sc.start} của ${sc.who}`);
    assert.equal(Flow.demoSet().key, 'MS02', `cảnh ${sc.n}: bộ demo theo ĐXMS`);
    if (want[sc.n]) assert.equal(Flow.ci().branch, want[sc.n], `cảnh ${sc.n}: luồng con`);
  }
  for (const b of set.branches) {
    Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(b.task) && (t.who === b.who || (t.cands || []).includes(b.who))), `nhánh ${b.name}`);
    assert.equal(Flow.state.vars.process, 'MS02');
  }
  // Nhánh phụ chạy tiếp được: 13 Không đồng ý → 14 → 12; 47 Không đồng ý → 25.
  const b13 = set.branches[0];
  Flow.jumpTo(b13.task, b13.who, b13.vars, b13.process, b13.dxms);
  step(w, { task: 13, label: 'Không' });
  runUntil(w, 12, 5);
  const b47 = set.branches[3];
  Flow.jumpTo(b47.task, b47.who, b47.vars, b47.process, b47.dxms);
  step(w, { task: 47, label: 'Không' });
  runUntil(w, 26, 5);
});
