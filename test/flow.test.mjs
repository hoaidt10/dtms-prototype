// Kiểm tra bộ máy luồng MS01.01 của prototype theo BPMN chuẩn ĐTMS.drawio / MS01 v1.1 (61 task + 10a, 10b)
// và quyết định "chọn quy trình khi tạo ĐXMS" (2026-09-28).
// Chạy: node --test prototype/dtms/test/flow.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../js/', import.meta.url);

// Mặc định: tạo hồ sơ theo MS01.01 (SCR-25) ngay sau khi mở. `process: null` = giữ trạng thái chưa tạo.
function boot(process = 'MS01.01', total) {
  const store = {};
  const window = {};
  const ctx = vm.createContext({
    window,
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } },
    console,
  });
  for (const f of ['bpmn-tasks.js', 'data.js', 'flow.js']) {
    vm.runInContext(readFileSync(new URL(f, dir), 'utf8'), ctx, { filename: f });
  }
  if (total != null) window.D.caseInfo.total = total;
  window.Flow.init();
  if (process) window.Flow.create(process);
  return window;
}

// Làm việc của token đầu tiên (hoặc token ở pick.task), chọn nút theo nhãn hoặc nút chính.
function step(w, pick) {
  const { Flow, D } = w;
  const tok = pick && pick.task ? Flow.state.tokens.find((t) => t.task === pick.task) : Flow.state.tokens[0];
  assert.ok(tok, `phải còn token${pick && pick.task ? ' ở task ' + pick.task : ''}`);
  const f = D.flow[tok.task];
  let choice = null;
  if (f.choices) {
    choice = pick && pick.label ? f.choices.find((c) => c.label.startsWith(pick.label)) : Flow.mainChoice(tok.task);
    assert.ok(choice, `task ${tok.task} không có lựa chọn ${pick && pick.label}`);
  }
  Flow.complete(tok.id, choice, choice && choice.reason ? 'lý do test' : null);
  return tok;
}

// Mảng tạo trong vm context khác realm → so bằng JSON.
const plain = (x) => JSON.parse(JSON.stringify(x));
const has = (w, task, who) => w.Flow.state.tokens.some((t) => t.task === task && (!who || t.who === who));
function runUntil(w, task, max = 300) {
  let n = 0;
  while (!has(w, task) && w.Flow.state.status === 'running' && n++ < max) step(w);
  assert.ok(has(w, task), `phải tới task ${task}`);
}
function runMain(w, max = 400) {
  let n = 0;
  while (w.Flow.state.status === 'running' && n++ < max) step(w);
}

test('61 task đều có trong BPMN v1.1 và có cấu hình trong D.flow', () => {
  const w = boot();
  assert.equal(w.BPMN_SOURCE.page, 'MS01 v1.1');
  for (const n of [...Array.from({ length: 61 }, (_, i) => i + 1), '10a', '10b']) {
    assert.ok(w.BPMN_TASKS[n], `thiếu BPMN task ${n}`);
    assert.ok(w.D.flow[n], `thiếu flow task ${n}`);
    if (w.BPMN_TASKS[n].type === 'user') assert.ok(w.D.flow[n].who && w.D.flow[n].scr, `user task ${n} thiếu who/scr`);
  }
  // Mọi đích đi tới đều tồn tại.
  for (const [k, f] of Object.entries(w.D.flow)) {
    const dests = [f.next, f.to, ...(f.choices || []).map((c) => c.to), ...(f.forkTo || []).map((b) => b.task), ...(f.also || []).map((b) => b.task)];
    if (f.varGate) dests.push(...Object.values(Object.values(f.varGate)[0]));
    if (f.roundGate) dests.push(f.roundGate.over, f.roundGate.under);
    if (f.matchGate) dests.push(...Object.values(f.matchGate));
    for (const d of dests.filter((x) => x != null)) assert.ok(['END', 'END_OTHER', 'END_MOVED'].includes(d) || w.D.flow[d], `${k} → ${d} không tồn tại`);
  }
});

test('nhánh chính chạy tới phê duyệt theo v1.1, KPI ≤ 20 NLV', () => {
  const w = boot();
  runMain(w);
  const { Flow } = w;
  assert.equal(Flow.state.status, 'approved');
  for (const n of [1, 12, 13, 16, 17, 18, 19, 20, 24, 26, 28, 29, 27, 35, 36, 37, 41, 42, 43, 44, 46, 47, 48, 50, 53, 56, 58, 60, 61]) {
    assert.equal(Flow.taskStatus(n), 'done', `task ${n} phải đã chạy`);
  }
  // Nhánh < 160 tỷ không chạy; timeline đánh dấu "không áp dụng". 10a/10b chỉ chạy khi không khớp.
  for (const n of [11, 38, 39, 40]) assert.equal(Flow.taskStatus(n), 'na', `task ${n} phải là na`);
  for (const n of ['10a', '10b']) assert.equal(Flow.taskStatus(n), 'cond');
  assert.deepEqual(plain(Flow.state.vars.checks.map((c) => c.ok)), [true]);
  assert.equal(Flow.ci().code, 'ĐXMS-2026-0117');
  // Giải trình 1 vòng → BM-04 lập 2 lần cho mỗi CQCM.
  assert.equal(Flow.state.vars.round, 1);
  assert.equal(Flow.state.history.filter((h) => h.task === 19).length, 6);
  assert.ok(Flow.kpiUsed() > 0 && Flow.kpiUsed() <= 20, `KPI ${Flow.kpiUsed()}`);
  assert.notEqual(Flow.state.kpiEnd, null);
});

test('TTMS phải xác nhận danh sách CQCM (task 17) trước khi gửi; trả lại thì về task 16', () => {
  const w = boot();
  runUntil(w, 17);
  assert.ok(has(w, 17, 'lan'));
  assert.ok(!has(w, 19));
  step(w, { task: 17, label: 'Chưa đúng' });
  assert.ok(has(w, 16, 'minh'));
});

test('join task 23 chờ đủ 3 phiếu BM-04', () => {
  const w = boot();
  const { Flow } = w;
  runUntil(w, 19);
  assert.equal(Flow.state.tokens.filter((t) => t.task === 19).length, 3);
  assert.deepEqual(Array.from(Flow.state.tokens, (t) => t.who).sort(), ['hoa', 'quang', 'thu']);
  for (let i = 0; i < 4; i++) step(w, { task: Flow.state.tokens.find((t) => t.cqcm !== 'CL').task });
  assert.ok(!has(w, 26));
  while (Flow.state.tokens.some((t) => t.cqcm === 'CL')) step(w, { task: Flow.state.tokens.find((t) => t.cqcm === 'CL').task });
  assert.ok(has(w, 26, 'minh'));
});

test('task 20 của Pháp chế do Trưởng ban Tùng ký', () => {
  const w = boot();
  const { Flow } = w;
  while (!Flow.state.tokens.some((t) => t.task === 20 && t.cqcm === 'PC')) step(w);
  assert.equal(Flow.state.tokens.find((t) => t.task === 20 && t.cqcm === 'PC').who, 'tung');
});

test('giải trình ≤ 2 vòng quay về chỉ huy ĐVĐX (task 13); > 2 vòng → cảnh báo, họp (30, 31)', () => {
  const w = boot();
  runUntil(w, 28);
  step(w, { task: 28 });
  assert.equal(w.Flow.state.vars.round, 1);
  assert.ok(has(w, 13, 'hai'), 'vòng 1 → quay về task 13');
  w.Flow.jumpTo(28, 'minh', { round: 2 });
  step(w, { task: 28 });
  assert.equal(w.Flow.state.vars.round, 3);
  assert.equal(w.Flow.taskStatus(30), 'done');
  assert.ok(has(w, 31, 'lan'));
});

test('lần đầu ở task 26 nhánh chính là giải trình; sau một vòng là đồng ý sửa', () => {
  const w = boot();
  runUntil(w, 26);
  assert.equal(w.Flow.mainChoice(26).to, 28);
  step(w); step(w);
  runUntil(w, 26);
  assert.equal(w.Flow.mainChoice(26).to, 27);
});

test('CQCM "Chưa đạt" ở task 35 huỷ các phiếu song song và trả về task 27', () => {
  const w = boot();
  runUntil(w, 35);
  step(w, { task: 35, label: 'Chưa đạt' });
  assert.deepEqual(Array.from(w.Flow.state.tokens, (t) => t.task), [27]);
});

test('BM-05: TTMS ký trước (43–44), sau đó CQCM ‖ Phó TGĐ (46 ‖ 47), đủ mới sang 48', () => {
  const w = boot();
  const { Flow } = w;
  runUntil(w, 43);
  assert.ok(!has(w, 46) && !has(w, 47));
  step(w, { task: 43 });
  assert.equal(Flow.taskStatus(44), 'done');
  assert.equal(Flow.state.tokens.filter((t) => t.task === 46).length, 3);
  assert.ok(has(w, 47, 'binh'));
  step(w, { task: 47 });
  assert.ok(!has(w, 48));
  while (has(w, 46)) step(w, { task: 46 });
  assert.ok(has(w, 48, 'lan'));
});

test('Phó TGĐ không đồng ý BM-05 → huỷ phiếu còn lại, trả ĐVĐX qua task 25 → 26', () => {
  const w = boot();
  runUntil(w, 47);
  step(w, { task: 47, label: 'Không đồng ý' });
  assert.deepEqual(Array.from(w.Flow.state.tokens, (t) => t.task), [26]);
});

test('TTMS chọn Không báo cáo Tập đoàn ở task 48 → bỏ 49–56, đi thẳng 57', () => {
  const w = boot();
  runUntil(w, 48);
  step(w, { task: 48, label: 'Không báo cáo' });
  runMain(w);
  assert.equal(w.Flow.state.status, 'approved');
  assert.equal(w.Flow.taskStatus(49), 'todo');
  assert.equal(w.Flow.taskStatus(57), 'done');
});

test('Thủ trưởng VHT "Yêu cầu hoàn chỉnh" ở task 60 → task 25 → 26', () => {
  const w = boot();
  runUntil(w, 60);
  step(w, { task: 60, label: 'Yêu cầu hoàn chỉnh' });
  assert.equal(w.Flow.taskStatus(25), 'done');
  assert.ok(has(w, 26));
  assert.equal(w.Flow.state.kpiEnd, null);
});

test('hồ sơ < 160 tỷ chọn MS01.03: khớp ở cổng → task 11 và nhánh ký BM-09 (38 ‖ 39 → 40 → 60)', () => {
  const w = boot('MS01.03', 45.2);
  runUntil(w, 11);
  assert.equal(w.Flow.taskStatus(12), 'na');
  runUntil(w, 38);
  assert.ok(has(w, 39, 'binh'));
  step(w, { task: 38 }); step(w, { task: 39 });
  assert.ok(has(w, 60, 'tgd'));
  assert.equal(w.Flow.taskStatus(41), 'na');
});

test('nhảy tới từng cảnh demo đặt đúng task và vai', () => {
  const w = boot();
  const { Flow, D } = w;
  for (const s of D.scenes) {
    Flow.jumpToScene(s.n);
    if (s.start === 'END') { assert.equal(Flow.state.status, 'approved'); continue; }
    if (s.start === 'NEW') { assert.equal(Flow.state.status, 'new'); assert.equal(Flow.state.tokens.length, 0); continue; }
    assert.ok(Flow.state.tokens.find((t) => t.task === s.start), `cảnh ${s.n}: phải có token ở task ${s.start}`);
    assert.equal(Flow.state.persona, s.who);
    assert.ok(Flow.tokensFor(s.who).length > 0, `cảnh ${s.n}: vai ${s.who} phải có việc`);
  }
});

test('mở prototype: chưa có hồ sơ; Lưu ở SCR-25 mới start instance và giao task 1 cho người tạo', () => {
  const w = boot(null);
  const { Flow } = w;
  assert.equal(Flow.state.status, 'new');
  assert.equal(Flow.state.tokens.length, 0);
  assert.equal(Flow.caseStatus(), 'Chưa tạo');
  Flow.create('MS01.01', { title: 'ĐXMS thử' });
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.ci().code, 'ĐXMS-2026-0117');
  assert.equal(Flow.ci().title, 'ĐXMS thử');
  assert.equal(Flow.ci().flow, 'MS01.01');
  assert.deepEqual(Array.from(Flow.state.tokens, (t) => [t.task, t.who]), [[1, 'minh']]);
  Flow.reset();
  assert.equal(Flow.state.status, 'new');
});

test('task 1 chỉ hiện căn cứ hợp với quy trình đã chọn', () => {
  const { D } = boot(null);
  const ids = (p) => plain(D.basisDocs.filter((d) => D.basisFits(p, d)).map((d) => d.id));
  assert.deepEqual(ids('MS01.01'), ['qd1', 'qd2']);
  assert.deepEqual(ids('MS01.02'), ['qd3']);
  assert.deepEqual(ids('MS01.03'), ['qd1', 'qd2', 'qd3']);
  assert.equal(D.basisFits('MS01.02', { type: 'khsx', group: true }), false, 'MS01.02 không nhận Kế hoạch SXKD năm');
});

test('chọn nhầm MS01.03 cho hồ sơ 182,90 tỷ: cổng báo không khớp → 10a; Sửa lại về task 10', () => {
  const w = boot('MS01.03');
  const { Flow } = w;
  runUntil(w, '10a');
  assert.ok(has(w, '10a', 'minh'));
  assert.ok(!has(w, 11) && !has(w, 12));
  assert.deepEqual(plain(Flow.state.vars.checks.map((c) => [c.ok, c.suggest])), [[false, 'MS01.01']]);
  step(w, { task: '10a', label: 'Sửa lại' });
  assert.ok(has(w, 10, 'minh'));
  step(w, { task: 10 });
  assert.ok(has(w, '10a'), 'giá trị vẫn lệch → lại vào 10a');
  assert.equal(Flow.state.vars.checks.length, 2);
});

test('chuyển quy trình: 10b tạo ĐXMS mới theo MS01.01, hồ sơ cũ "Đã chuyển quy trình"; hồ sơ mới làm lại từ task 1 và chạy tới phê duyệt', () => {
  const w = boot('MS01.03');
  const { Flow } = w;
  Flow.setUi('basisDoc', 'qd1');
  runUntil(w, '10a');
  step(w, { task: '10a', label: 'Chuyển quy trình' });
  assert.equal(Flow.state.status, 'moved');
  assert.equal(Flow.caseStatus(), 'Đã chuyển quy trình');
  assert.equal(Flow.taskStatus('10b'), 'done');
  assert.deepEqual({ ...Flow.state.movedTo }, { code: 'ĐXMS-2026-0125', process: 'MS01.01' });
  assert.equal(Flow.state.tokens.length, 0);
  assert.equal(Flow.kpiUsed(), null, 'không tính KPI');

  Flow.openReplacement();
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.ci().code, 'ĐXMS-2026-0125');
  assert.equal(Flow.ci().flow, 'MS01.01');
  assert.equal(Flow.state.replaces, 'ĐXMS-2026-0117');
  assert.equal(Flow.state.archived.length, 1);
  assert.equal(Flow.state.archived[0].replacedBy, 'ĐXMS-2026-0125');
  assert.equal(Flow.ui.basisDoc, 'qd1', 'dữ liệu đã sao chép');
  assert.deepEqual(Array.from(Flow.state.tokens, (t) => t.task), [1]);
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.state.archived.length, 1);
});

test('chọn MS01.01 nhưng giá trị < 160 tỷ: không khớp, gợi ý MS01.03', () => {
  const w = boot('MS01.01', 45.2);
  runUntil(w, '10a');
  assert.equal(w.Flow.matchCheck().suggest, 'MS01.03');
});

test('nhánh phụ B-3e: jumpTo 10a với hồ sơ tạo theo MS01.03', () => {
  const w = boot();
  w.Flow.jumpTo('10a', 'minh', {}, 'MS01.03');
  assert.ok(has(w, '10a', 'minh'));
  assert.equal(w.Flow.ci().flow, 'MS01.03');
});

// T8 B5 — ngưỡng phân luồng lấy từ bảng Ngưỡng phân luồng (SCR-40, D.dxmsRules), hồ sơ giữ bản chụp lúc tạo (P-34).
const TH150 = () => [{ from: 0, to: 150, procs: ['MS01.03'] }, { from: 150, to: null, procs: ['MS01.01', 'MS01.02'] }];

test('ngưỡng mặc định: điều kiện hiển thị < 160 / ≥ 160 tỷ kèm điều kiện căn cứ', () => {
  const w = boot();
  assert.equal(w.Flow.condOf('MS01.03'), '< 160 tỷ · mọi loại căn cứ');
  assert.equal(w.Flow.condOf('MS01.01'), '≥ 160 tỷ · căn cứ chưa được CT/TGĐ TĐ duyệt');
});

test('ngưỡng MS01 sửa thành 150 tỷ: hồ sơ 155 tỷ chọn MS01.03 không khớp, gợi ý MS01.01', () => {
  const w = boot(null, 155);
  w.D.dxmsRules = TH150;
  w.Flow.create('MS01.03');
  assert.equal(w.Flow.condOf('MS01.03'), '< 150 tỷ · mọi loại căn cứ');
  runUntil(w, '10a');
  const r = w.Flow.matchCheck();
  assert.equal(r.ok, false);
  assert.equal(r.suggest, 'MS01.01');
});

test('P-34: đổi ngưỡng sau khi tạo hồ sơ không ảnh hưởng hồ sơ đang chạy', () => {
  const w = boot(null, 155);
  w.Flow.create('MS01.03');
  w.D.dxmsRules = TH150;
  runUntil(w, 11);
  assert.equal(w.Flow.matchCheck().ok, true);
  assert.equal(w.Flow.condOf('MS01.03'), '< 160 tỷ · mọi loại căn cứ');
});
