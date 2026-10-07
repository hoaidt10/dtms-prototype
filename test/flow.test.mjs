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
  for (const f of ['bpmn-tasks.js', 'bpmn-tasks-ms13.js', 'data.js', 'flow.js']) {
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
  assert.equal(Flow.ci().code, 'HS-2026-0117');
  assert.equal(Flow.ci().dxms, 'ĐXMS-2026-0117');
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

test('DX-02: task 26 một nút, cổng rẽ theo ý kiến bảo lưu — lần đầu sang giải trình (28), sau một vòng sang hoàn chỉnh (27)', () => {
  const w = boot();
  runUntil(w, 26);
  assert.equal(w.Flow.mainChoice(26), null);
  step(w);
  assert.deepEqual(Array.from(w.Flow.state.tokens, (t) => t.task), [28]);
  step(w);
  runUntil(w, 26);
  step(w);
  assert.deepEqual(Array.from(w.Flow.state.tokens, (t) => t.task), [27]);
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

test('mở prototype: chưa có hồ sơ; tạo ĐXMS không start quy trình; Lưu hồ sơ ở SCR-25 mới start instance và giao task 1 cho người tạo', () => {
  const w = boot(null);
  const { Flow } = w;
  assert.equal(Flow.state.status, 'new');
  assert.equal(Flow.state.tokens.length, 0);
  assert.equal(Flow.caseStatus(), 'Chưa tạo');
  const dx = Flow.createDxms({ title: 'ĐXMS thử', unit: 'Trung tâm Vô tuyến', priority: 'Thường', est: 180 });
  assert.equal(dx, 'ĐXMS-2026-0117');
  assert.equal(Flow.state.status, 'new', 'tạo ĐXMS không start quy trình (D-11)');
  assert.equal(Flow.state.tokens.length, 0);
  Flow.create('MS01.01', { dxms: dx, name: 'Hồ sơ thử' });
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.ci().code, 'HS-2026-0117');
  assert.equal(Flow.ci().dxms, 'ĐXMS-2026-0117');
  assert.equal(Flow.ci().title, 'ĐXMS thử');
  assert.equal(Flow.ci().name, 'Hồ sơ thử');
  assert.equal(Flow.ci().flow, 'MS01.01');
  assert.deepEqual(Array.from(Flow.state.tokens, (t) => [t.task, t.who]), [[1, 'minh']]);
  // ĐXMS vẫn còn sau khi tạo hồ sơ; Reset luồng xoá cả ĐXMS tạo trên prototype.
  assert.equal(Flow.findDxms(dx).title, 'ĐXMS thử');
  Flow.reset();
  assert.equal(Flow.state.status, 'new');
  assert.equal(Flow.findDxms(dx), null);
});

test('ĐXMS: mã tự sinh, sửa/xoá; hồ sơ Phê duyệt giữ số của ĐXMS, hồ sơ Điều chỉnh lấy số trống', () => {
  const w = boot(null);
  const { Flow } = w;
  assert.equal(Flow.createDxms({ title: 'A' }), 'ĐXMS-2026-0117');
  assert.equal(Flow.createDxms({ title: 'B' }), 'ĐXMS-2026-0127');
  assert.deepEqual(plain(Flow.dxmsAll().slice(0, 2).map((x) => x.code)), ['ĐXMS-2026-0127', 'ĐXMS-2026-0117']);
  Flow.updateDxms('ĐXMS-2026-0119', { title: 'Máy in 3D (sửa)' });
  assert.equal(Flow.findDxms('ĐXMS-2026-0119').title, 'Máy in 3D (sửa)');
  Flow.deleteDxms('ĐXMS-2026-0127');
  Flow.deleteDxms('ĐXMS-2026-0119');
  assert.equal(Flow.findDxms('ĐXMS-2026-0127'), null);
  assert.equal(Flow.findDxms('ĐXMS-2026-0119'), null);
  // Hồ sơ Điều chỉnh của ĐXMS-2026-0103 (đã phê duyệt): số trống đầu tiên từ 0127; ĐXMS và hồ sơ đã tạo được giữ khi tạo hồ sơ Phê duyệt khác.
  assert.equal(Flow.createAdj({ dxms: 'ĐXMS-2026-0103', name: 'Điều chỉnh lần 1', process: 'MS02', total: 220 }), 'HS-2026-0127');
  Flow.create('MS01.03', { dxms: 'ĐXMS-2026-0117' });
  assert.equal(Flow.ci().code, 'HS-2026-0117');
  assert.equal(Flow.state.adj[0].code, 'HS-2026-0127');
  assert.equal(Flow.state.adj[0].kind, 'DC');
  assert.equal(Flow.findDxms('ĐXMS-2026-0117').title, 'A');
  assert.equal(Flow.nextCaseCode('ĐXMS-2026-0098', 'PD'), 'HS-2026-0098', 'ĐXMS-2026-0098 chưa có hồ sơ → hồ sơ Phê duyệt giữ số của ĐXMS');
  assert.equal(Flow.nextCaseCode('ĐXMS-2026-0106', 'PD'), 'HS-2026-0128', 'HS-2026-0106 đã có (hồ sơ mẫu) → số trống');
});

test('task 1 chỉ hiện căn cứ hợp với quy trình đã chọn', () => {
  const { D } = boot(null);
  const ids = (p) => plain(D.basisDocs.filter((d) => D.basisFits(p, d)).map((d) => d.id));
  assert.deepEqual(ids('MS01.01'), ['qd1', 'qd2', 'qd5']);
  assert.deepEqual(ids('MS01.02'), ['qd3', 'qd4']);
  assert.deepEqual(ids('MS01.03'), ['qd1', 'qd2', 'qd3', 'qd4', 'qd5']);
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

test('chuyển quy trình: 10b tạo hồ sơ mới của cùng ĐXMS theo MS01.01, hồ sơ cũ "Đã chuyển quy trình"; hồ sơ mới làm lại từ task 1 và chạy tới phê duyệt', () => {
  const w = boot('MS01.03');
  const { Flow } = w;
  Flow.setUi('basisDoc', 'qd1');
  runUntil(w, '10a');
  step(w, { task: '10a', label: 'Chuyển quy trình' });
  assert.equal(Flow.state.status, 'moved');
  assert.equal(Flow.caseStatus(), 'Đã chuyển quy trình');
  assert.equal(Flow.taskStatus('10b'), 'done');
  assert.deepEqual({ ...Flow.state.movedTo }, { code: 'HS-2026-0125', process: 'MS01.01' });
  assert.equal(Flow.state.tokens.length, 0);
  assert.equal(Flow.kpiUsed(), null, 'không tính KPI');

  Flow.openReplacement();
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.ci().code, 'HS-2026-0125');
  assert.equal(Flow.ci().dxms, 'ĐXMS-2026-0117', 'cùng ĐXMS');
  assert.equal(Flow.ci().flow, 'MS01.01');
  assert.equal(Flow.state.replaces, 'HS-2026-0117');
  assert.equal(Flow.state.archived.length, 1);
  assert.equal(Flow.state.archived[0].replacedBy, 'HS-2026-0125');
  assert.equal(Flow.state.archived[0].dxms, 'ĐXMS-2026-0117');
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

// T6 — MS01.02 (ĐXMS-2026-0124) và MS01.03 (ĐXMS-2026-0098): docs/dtms/prototype-MS01-02-03-chuan-bi.md §3, §8.3.
function bootCase(dxms, process) {
  const w = boot(null);
  w.Flow.create(process, { dxms });
  return w;
}

test('dữ liệu theo ĐXMS: hồ sơ của 0124 / 0098 dùng bộ dữ liệu riêng; hồ sơ Phê duyệt giữ số của ĐXMS', () => {
  const w = bootCase('ĐXMS-2026-0124', 'MS01.02');
  assert.equal(w.Flow.ci().code, 'HS-2026-0124');
  assert.equal(w.Flow.ci().total, 176.4);
  assert.equal(w.D.items.length, 4);
  assert.equal(w.D.caseRef.basisDoc, 'qd4');
  w.Flow.create('MS01.03', { dxms: 'ĐXMS-2026-0098' });
  assert.equal(w.Flow.ci().code, 'HS-2026-0098');
  assert.equal(w.Flow.ci().total, 45.2);
  assert.deepEqual(plain(w.Flow.cqcmSel()), ['TC', 'CL']);
  w.Flow.reset();
  assert.equal(w.D.caseInfo.total, 182.9, 'reset về bộ dữ liệu ĐXMS-2026-0117');
});

test('MS01.02: chạy tới phê duyệt; task 48 luôn "Không báo cáo" (lựa chọn Có bị khoá), bỏ 49–56 và nhánh < 160 tỷ', () => {
  const w = bootCase('ĐXMS-2026-0124', 'MS01.02');
  const { Flow } = w;
  runUntil(w, 48);
  const [yes, no] = Flow.choices(48);
  assert.ok(yes.lockWhen(Flow.state.vars), 'Có báo cáo phải bị khoá');
  assert.equal(no.lockWhen, undefined);
  assert.equal(Flow.mainChoice(48).label, no.label);
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.state.vars.reportTD, false);
  for (const n of [49, 50, 51, 52, 53, 54, 55, 56, 11, 38, 39, 40]) assert.equal(Flow.taskStatus(n), 'na', `task ${n} phải là na`);
  for (const n of [12, 17, 24, 27, 36, 41, 44, 47, 48, 57, 60, 61]) assert.equal(Flow.taskStatus(n), 'done', `task ${n} phải đã chạy`);
  assert.equal(Flow.state.vars.round, 0, 'ĐVĐX đồng ý sửa — không giải trình');
  assert.deepEqual(plain(Flow.state.vars.checks.map((c) => c.ok)), [true]);
  assert.ok(Flow.kpiUsed() <= w.D.kpiLimit['MS01.02']);
});

test('MS01.03: chạy tới phê duyệt qua 11 → 2 CQCM → ký BM-04 + Checklist 02 → TTMS ‖ Phó TGĐ ký BM-09 → Thủ trưởng phê duyệt; KPI ≤ 10 NLV', () => {
  const w = bootCase('ĐXMS-2026-0098', 'MS01.03');
  const { Flow } = w;
  runUntil(w, 19);
  assert.deepEqual(Array.from(Flow.state.tokens, (t) => t.who).sort(), ['quang', 'thu'], 'chỉ Ban Tài chính và Phòng Chất lượng góp ý');
  runUntil(w, 36);
  assert.equal(Flow.mainChoice(36).label, 'Xác nhận ký BM-04 & Checklist 02');
  assert.equal(Flow.mainChoice(36).sign, 'BM-04 + Checklist 02');
  runUntil(w, 38);
  assert.ok(has(w, 39, 'binh'));
  runUntil(w, 60);
  assert.equal(Flow.scrOf(60), 'SCR-24');
  assert.equal(Flow.mainChoice(60).sign, 'BM-09');
  runMain(w);
  assert.equal(Flow.state.status, 'approved');
  for (const n of [11, 13, 17, 24, 26, 27, 35, 36, 38, 39, 40, 60, 61]) assert.equal(Flow.taskStatus(n), 'done', `task ${n} phải đã chạy`);
  for (const n of [12, 41, 42, 47, 48, 49, 57, 58, 59]) assert.equal(Flow.taskStatus(n), 'na', `task ${n} phải là na`);
  assert.equal(Flow.state.vars.round, 0);
  assert.ok(Flow.kpiUsed() > 0 && Flow.kpiUsed() <= w.D.kpiLimit['MS01.03'], `KPI ${Flow.kpiUsed()}`);
});

test('MS01.01 giữ nhãn Checklist 01 / BM-08 và màn SCR-19 ở task 60', () => {
  const w = boot();
  runUntil(w, 36);
  assert.equal(w.Flow.mainChoice(36).label, 'Xác nhận ký BM-04 & Checklist 01');
  runUntil(w, 60);
  assert.equal(w.Flow.scrOf(60), 'SCR-19');
  assert.equal(w.Flow.mainChoice(60).sign, 'BM-08');
});

test('MS01.03 B-3b: Phó TGĐ không đồng ý BM-09 → huỷ lượt ký TTMS, trả ĐVĐX qua 25 → 26', () => {
  const w = bootCase('ĐXMS-2026-0098', 'MS01.03');
  runUntil(w, 39);
  step(w, { task: 39, label: 'Không đồng ý' });
  assert.deepEqual(Array.from(w.Flow.state.tokens, (t) => t.task), [26]);
  assert.equal(w.Flow.taskStatus(25), 'done');
});

test('MS01.03 B-3a: Thủ trưởng yêu cầu hoàn chỉnh → 25 → 26; hoàn chỉnh lại thì ký lại BM-04 + Checklist 02 và BM-09', () => {
  const w = bootCase('ĐXMS-2026-0098', 'MS01.03');
  runUntil(w, 60);
  step(w, { task: 60, label: 'Yêu cầu hoàn chỉnh' });
  assert.ok(has(w, 26, 'minh'));
  runMain(w);
  assert.equal(w.Flow.state.status, 'approved');
  assert.equal(w.Flow.doneCount(36), 4, 'hai CQCM ký BM-04 + Checklist 02 hai lần');
  assert.equal(w.Flow.doneCount(38), 2);
});

test('MS01.03 B-3d: ĐVĐX bảo lưu ý kiến → giải trình; vòng 3/2 → họp → Thủ trưởng "Yêu cầu xử lý lại" về task 11 (P-23)', () => {
  const w = boot(null);
  w.Flow.jumpTo(28, 'minh', { round: 2 }, 'MS01.03', 'ĐXMS-2026-0098', { resp: { TC: 'Bảo lưu' } });
  assert.ok(has(w, 28, 'minh'));
  step(w, { task: 28 });
  assert.ok(has(w, 31, 'lan'));
  step(w, { task: 31 });
  step(w, { task: 32, label: 'Chưa thống nhất' });
  step(w, { task: 33 });
  step(w, { task: 34, label: 'Yêu cầu xử lý lại' });
  assert.ok(has(w, 11, 'minh'), 'nhánh < 160 tỷ về dự thảo BM-09');
});

test('bộ demo: mỗi cảnh của ba hồ sơ demo đặt đúng task, vai và hồ sơ; nhánh phụ mở đúng việc', () => {
  const w = boot(null);
  const { Flow, D } = w;
  for (const set of D.demoSets) {
    for (const s of set.scenes) {
      Flow.jumpToScene(s.n, set.key);
      assert.equal(Flow.demoSet().key, set.key, `cảnh ${s.n}: bộ demo`);
      if (s.start === 'NEW') { assert.equal(Flow.state.status, 'new'); continue; }
      if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', `cảnh ${s.n}`); continue; }
      assert.equal(Flow.ci().dxms, s.kdt || set.dxms || set.kdt);
      assert.equal(Flow.state.vars.process === set.key || Flow.ci().flow === set.key, true, `cảnh ${s.n}: quy trình`);
      assert.ok(Flow.state.tokens.find((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}: ${s.who} phải có việc ở task ${s.start}`);
    }
    for (const b of set.branches) {
      Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
      assert.ok(Flow.state.tokens.find((t) => String(t.task) === String(b.task) && t.who === b.who), `${set.key} · ${b.name}`);
    }
  }
  Flow.pickDemo('MS01.03');
  assert.equal(Flow.state.status, 'new');
  assert.equal(Flow.demoSet().key, 'MS01.03');
});

test('P-34: đổi ngưỡng sau khi tạo hồ sơ không ảnh hưởng hồ sơ đang chạy', () => {
  const w = boot(null, 155);
  w.Flow.create('MS01.03');
  w.D.dxmsRules = TH150;
  runUntil(w, 11);
  assert.equal(w.Flow.matchCheck().ok, true);
  assert.equal(w.Flow.condOf('MS01.03'), '< 160 tỷ · mọi loại căn cứ');
});

// T11 B1 — engine luồng theo quy trình (plan KĐT §6 #2): MS01.0x dùng D.flow / BPMN_TASKS; MS13 dùng D.flows.MS13 + BPMN_FLOWS.MS13.
test('B1 KĐT: engine chọn định nghĩa luồng theo quy trình; tạo KĐT không start quy trình, tạo hồ sơ KĐT start MS13', () => {
  const w = boot(null);
  const { Flow, D } = w;
  assert.deepEqual(['MS01.01', 'MS01.02', 'MS01.03', 'MS13', null].map(D.familyOf), ['MS01', 'MS01', 'MS01', 'MS13', 'MS01']);
  Flow.create('MS01.03');
  assert.equal(Flow.def(), D.flow);
  assert.equal(Flow.tasks(), w.BPMN_TASKS);
  assert.equal(Object.keys(w.BPMN_FLOWS.MS13.tasks).length, 64);
  // KĐT: mã đầu tiên KĐT-2026-0032, tạo KĐT không đổi luồng đang chạy; hồ sơ Phê duyệt giữ 4 số của KĐT, start MS13 ở bước 1, chưa xác định nhóm (B2).
  const code = Flow.createKdt({ title: 'KĐT thử', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 10 });
  assert.equal(code, 'KĐT-2026-0032');
  assert.equal(Flow.state.vars.process, 'MS01.03');
  assert.equal(Flow.createKdtCase({ kdt: code, name: 'Hồ sơ thử' }), 'HS-2026-0032');
  const hs = Flow.kdtCases().find((c) => c.kdt === code);
  assert.deepEqual(plain([hs.flow, hs.task, hs.st, hs.stage]), [null, 1, 'processing', 'LAP']);
  assert.equal(Flow.state.vars.process, 'MS13');
  assert.equal(Flow.def(), D.flows.MS13);
  assert.equal(Flow.createKdt({ title: 'KĐT thử 2' }), 'KĐT-2026-0034');
});

// T11 B2 — cảnh 1–3 của plan KĐT: task 1–13, xác nhận song song 11 ‖ 12, cổng phân luồng / báo giá / gộp, nhánh chuyển MS14.
function kdtStep(w, task, label) {
  const { Flow } = w;
  const tok = Flow.state.tokens.find((t) => String(t.task) === String(task));
  assert.ok(tok, `phải còn token ở task ${task}`);
  const f = Flow.def()[tok.task];
  const choice = f.choices ? (label ? Flow.choices(tok.task).find((c) => c.label.startsWith(label)) : Flow.mainChoice(tok.task)) : null;
  if (f.choices) assert.ok(choice, `task ${task}: ${label}`);
  Flow.complete(tok.id, choice, choice && choice.reason ? 'lý do test' : null);
}
function kdtCase(w, data) {
  const code = w.Flow.createKdt(Object.assign({ title: 'KĐT thử', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 120 }, data));
  w.Flow.createKdtCase({ kdt: code, name: 'Hồ sơ thử' });
  for (const n of [1, 4, 5, 7, 8, 10]) kdtStep(w, n);
  return code;
}
const tasksOf = (w) => plain(w.Flow.state.tokens.map((t) => `${t.task}:${t.who}`).sort());

test('B2 KĐT: task 1–10 → 11 ‖ 12 song song, chờ đủ 02 kết quả → MS13 hai giai đoạn, sang task 14', () => {
  const w = boot(null);
  const { Flow } = w;
  const code = kdtCase(w);
  assert.deepEqual(tasksOf(w), ['11:thu', '12:lan']);
  assert.equal(Flow.kdtStage(), 'PL');
  assert.equal(Flow.kdtCases().find((c) => c.kdt === code).total, 118.5);
  kdtStep(w, 11);
  assert.deepEqual(tasksOf(w), ['12:lan'], 'chờ TTMS');
  assert.equal(Flow.state.vars.group, undefined);
  kdtStep(w, 12);
  assert.deepEqual(tasksOf(w), ['14:minh']);
  assert.deepEqual(plain([Flow.state.vars.group, Flow.state.vars.branch, Flow.kdtStage()]), ['MS13', '2GD', 'CT']);
  const hs = Flow.kdtCases().find((c) => c.kdt === code);
  assert.deepEqual(plain([hs.flow, hs.branch, hs.stage, hs.task]), ['MS13', '2GD', 'CT', 14]);
  assert.equal(Flow.ci().flow, 'MS13');
  // Nhánh gộp BM-00 không áp dụng cho hồ sơ hai giai đoạn; nhánh Tập đoàn luôn không áp dụng (P-56).
  assert.equal(Flow.taskStatus(17), 'na');
  assert.equal(Flow.taskStatus(57), 'na');
  assert.equal(Flow.taskStatus(36), 'todo');
  // Cổng gộp sau task 16 → 36 (BM-01).
  kdtStep(w, 14); kdtStep(w, 16);
  assert.deepEqual(tasksOf(w), ['36:minh']);
});

test('B2 KĐT: Trang bị nội bộ + Nguyên chiếc + mức vốn MS13 → gộp BM-00 (task 17 → 18)', () => {
  const w = boot(null);
  const { Flow } = w;
  kdtCase(w, { type: 'TBNB', nature: 'NGUYEN_CHIEC' });
  kdtStep(w, 12); kdtStep(w, 11);
  assert.deepEqual(plain([Flow.state.vars.group, Flow.state.vars.branch, Flow.kdtStage()]), ['MS13', 'BM00', 'GOP']);
  assert.equal(Flow.kdtCheck().merge, true);
  kdtStep(w, 14); kdtStep(w, 16);
  assert.deepEqual(tasksOf(w), ['18:minh']);
  assert.ok(Flow.state.history.some((h) => String(h.task) === '17' && h.system));
});

test('B2 KĐT: xác nhận Không OK → AI gợi ý (13) → task 10; báo giá chưa đạt → sau xác nhận về task 08', () => {
  const w = boot(null);
  const { Flow } = w;
  kdtCase(w);
  kdtStep(w, 11);
  kdtStep(w, 12, 'Không OK');
  assert.deepEqual(tasksOf(w), ['10:minh']);
  assert.ok(Flow.state.history.some((h) => String(h.task) === '13' && h.system));
  assert.equal(Flow.state.vars.group, undefined, 'chưa phân luồng');
  kdtStep(w, 10, 'Báo giá chưa đạt');
  kdtStep(w, 11); kdtStep(w, 12);
  assert.deepEqual(tasksOf(w), ['8:minh']);
  assert.equal(Flow.state.vars.group, 'MS13');
});

test('B2 KĐT: KĐT-2026-0033 (lĩnh vực Khác, 96 tỷ ≥ 90) → chuyển luồng MS14, hồ sơ mới của cùng KĐT', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[0];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['12:lan'], 'Ban Tài chính đã xác nhận (settle)');
  assert.equal(Flow.kdtCheck().group, 'MS14');
  kdtStep(w, 12);
  assert.equal(Flow.state.status, 'moved');
  assert.deepEqual(plain(Flow.state.movedTo), { code: 'HS-2026-0127', process: 'MS14' });
  const hs = Flow.kdtCases().filter((c) => c.kdt === 'KĐT-2026-0033');
  assert.deepEqual(plain(hs.map((c) => [c.code, c.flow, c.st, c.stage])), [['HS-2026-0127', 'MS14', 'processing', 'MS14'], ['HS-2026-0033', 'MS13', 'moved', 'MS14']]);
  // Tạo hồ sơ khác: hồ sơ KĐT cũ giữ lại ở danh sách hồ sơ của KĐT.
  Flow.create('MS01.01');
  assert.equal(Flow.kdtCases().filter((c) => c.kdt === 'KĐT-2026-0033').length, 2);
});

test('B2 KĐT: ngưỡng KĐT hồ sơ giữ lúc tạo (như P-34)', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const code = w.Flow.createKdt({ title: 'KĐT thử', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 120 });
  Flow.createKdtCase({ kdt: code, name: 'Hồ sơ thử' });
  D.kdtRules = () => [{ field: '*', asset: '*', from: 0, to: 50, procs: ['MS13'] }];
  assert.equal(Flow.kdtCheck().group, 'MS13');
});

// T11 B3 — cảnh 4–6 của plan KĐT: dự thảo (14–16), chủ trương BM-01 (36–40), quy trình con 41 chạy khối thẩm định 22–35, ký 42 / 44.
const two = (w) => { kdtStep(w, 11); kdtStep(w, 12); };
// Hồ sơ KĐT-2026-0032 (hai giai đoạn) đã qua dự thảo, tới bước 24 của quy trình con 41.
function toReview(w) {
  kdtCase(w);
  two(w);
  for (const n of [14, 16, 36, 37, 38, 39]) kdtStep(w, n);
}
const counts = (w) => plain([w.Flow.tdCount('chk'), w.Flow.tdCount('meet')]);

test('B3 KĐT: 14–16 → cổng gộp → 36–40 → quy trình con 41 (lượt 1 cần sửa, lượt 2 giải trình → họp 1, xác nhận, cập nhật) → 42 → 44 → 46', () => {
  const w = boot(null);
  const { Flow } = w;
  toReview(w);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  assert.equal(Flow.state.vars.sub, 41);
  assert.equal(Flow.state.tokens[0].sub, 41);
  assert.equal(Flow.taskStatus(41), 'active', 'việc trong khối thẩm định tính là bước 41');
  assert.equal(Flow.taskStatus(24), 'na', 'khối 22–35 vẽ cho hồ sơ gộp — hai giai đoạn không hiện riêng');
  assert.equal(Flow.kdtStage(), 'TDCT');
  assert.equal(Flow.kdtCases()[0].task, 41);
  // Lượt 1: CQCM Tài chính ‖ Pháp chế; Tài chính cần sửa → ĐVĐX bổ sung → TTMS rà soát lại.
  kdtStep(w, 24);
  assert.deepEqual(tasksOf(w), ['26:hoa', '26:thu']);
  kdtStep(w, 26); kdtStep(w, 26);
  assert.deepEqual(tasksOf(w), ['28:minh']);
  assert.equal(Flow.mainChoice(28).label, 'Bổ sung hồ sơ theo ý kiến');
  kdtStep(w, 28);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  assert.deepEqual(counts(w), [1, 0]);
  // Lượt 2: vẫn cần sửa → ĐVĐX giải trình → chưa thống nhất → họp lần 1 → Chuyên quản → Chỉ huy → cập nhật → lượt 3 thống nhất.
  kdtStep(w, 24); kdtStep(w, 26); kdtStep(w, 26);
  assert.equal(Flow.mainChoice(28).label, 'Giải trình, bảo lưu ý kiến');
  kdtStep(w, 28);
  assert.deepEqual(tasksOf(w), ['29:lan']);
  kdtStep(w, 29);
  assert.deepEqual(counts(w), [2, 1]);
  assert.deepEqual(tasksOf(w), ['31:minh']);
  kdtStep(w, 31);
  assert.deepEqual(tasksOf(w), ['32:hai']);
  kdtStep(w, 32); kdtStep(w, 33);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  kdtStep(w, 24); kdtStep(w, 26); kdtStep(w, 26);
  assert.deepEqual(tasksOf(w), ['42:lan'], 'không còn ý kiến cần sửa → ra khỏi quy trình con');
  assert.equal(Flow.state.vars.sub, null);
  assert.equal(Flow.taskStatus(41), 'done');
  assert.equal(Flow.kdtStage(), 'TDCT');
  kdtStep(w, 42);
  assert.deepEqual(tasksOf(w), ['44:tgd'], 'cấp VHT (P-56): không qua bước 43');
  assert.equal(Flow.kdtStage(), 'KYCT');
  kdtStep(w, 44);
  assert.deepEqual(tasksOf(w), ['46:minh']);
  assert.equal(Flow.kdtStage(), 'HS');
  assert.ok(Flow.state.history.some((h) => String(h.task) === '45' && h.system));
  assert.deepEqual(plain([Flow.state.vars.chk.CT, Flow.state.vars.meet.CT]), [2, 1], 'bộ đếm giai đoạn chủ trương giữ nguyên');
  assert.deepEqual(counts(w), [0, 0], 'bước 45 sang giai đoạn KĐT — bộ đếm riêng (P-54)');
});

test('B3 KĐT: TTMS trả lại danh sách CQCM → bước 38 (ra khỏi quy trình con); không chọn CQCM → bỏ bước 25–26', () => {
  const w = boot(null);
  const { Flow } = w;
  toReview(w);
  kdtStep(w, 24, 'Danh sách CQCM');
  assert.deepEqual(tasksOf(w), ['38:minh']);
  assert.equal(Flow.state.vars.sub, null);
  Flow.setUi('cqcmSel', []);
  kdtStep(w, 38); kdtStep(w, 39);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  kdtStep(w, 24);
  assert.deepEqual(tasksOf(w), ['42:lan'], 'TTMS đồng ý, không có CQCM phối hợp');
  // Hồ sơ chưa đủ điều kiện → AI gợi ý (22) → ĐVĐX bổ sung (23) → TTMS.
  const w2 = boot(null);
  toReview(w2);
  kdtStep(w2, 24, 'Hồ sơ chưa đủ');
  assert.deepEqual(tasksOf(w2), ['23:minh']);
  assert.ok(w2.Flow.state.history.some((h) => String(h.task) === '22' && h.system && h.sub === 41));
  kdtStep(w2, 23);
  assert.deepEqual(tasksOf(w2), ['24:lan']);
});

test('B3 KĐT: họp đủ 02 lần vẫn chưa thống nhất → báo cáo (34) → Thủ trưởng kết luận (35); chỉ đạo xử lý → 28, chỉ đạo dừng → kết thúc', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[3];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['29:lan']);
  assert.deepEqual(counts(w), [2, 1]);
  kdtStep(w, 29, 'Chưa thống nhất');
  assert.deepEqual(counts(w), [2, 2]);
  assert.deepEqual(tasksOf(w), ['34:lan'], 'không tổ chức họp lần 3');
  kdtStep(w, 34);
  assert.deepEqual(tasksOf(w), ['35:tgd']);
  kdtStep(w, 35);
  assert.deepEqual(tasksOf(w), ['28:minh']);
  assert.equal(Flow.mainChoice(28).label, 'Bổ sung hồ sơ theo ý kiến', 'làm theo kết luận');
  kdtStep(w, 28);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  kdtStep(w, 29, 'Chưa thống nhất'); kdtStep(w, 34); kdtStep(w, 35, 'Chỉ đạo dừng');
  assert.equal(Flow.state.status, 'stopped');
  assert.equal(Flow.kdtStage(), 'STOP');
});

test('B3 KĐT: Thủ trưởng không ký — chỉ đạo xử lý → cổng gộp → 36 (bộ đếm không đặt lại); cảnh K4–K6 đặt đúng việc', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const set = D.demoSets.find((d) => d.key === 'MS13');
  const b = set.branches[4];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['44:tgd']);
  kdtStep(w, 44, 'Không ký — chỉ đạo xử lý');
  assert.deepEqual(tasksOf(w), ['36:minh']);
  assert.deepEqual(counts(w), [2, 1]);
  for (const [n, task, who] of [['K4', 14, 'minh'], ['K5', 24, 'lan'], ['K6', 42, 'lan']]) {
    Flow.jumpToScene(n, 'MS13');
    assert.deepEqual(plain([Flow.state.persona, Flow.state.tokens.map((t) => t.task)]), [who, [task]], `cảnh ${n}`);
  }
});

// T11 B4 — cảnh 7–9 của plan KĐT: hồ sơ KĐT BM-03 (45–48) → quy trình con 49 → BM-14 (51) → ký BM-18 (54); nhánh gộp BM-00 (17–21 → khối E → 55–56).
const docsOf = (w) => plain(w.Flow.kdtDocs().map((d) => d.code));
test('B4 KĐT: 45 → 46–48 → quy trình con 49 (1 lượt thống nhất) → 51 BM-14 → 54 ký BM-18 → Đã phê duyệt; văn bản đầu ra BM-01, BM-14, BM-18', () => {
  const w = boot(null);
  const { Flow } = w;
  Flow.jumpToScene('K7', 'MS13');
  assert.deepEqual(tasksOf(w), ['46:minh']);
  assert.equal(Flow.state.vars.td, 'KDT');
  assert.deepEqual(docsOf(w), ['BM-01']);
  kdtStep(w, 46); kdtStep(w, 47);
  assert.equal(Flow.kdtStage(), 'HS');
  kdtStep(w, 48);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  assert.equal(Flow.state.vars.sub, 49);
  assert.equal(Flow.taskStatus(49), 'active');
  assert.equal(Flow.kdtStage(), 'TDKDT');
  kdtStep(w, 24);
  assert.deepEqual(tasksOf(w), ['26:hoa', '26:thu']);
  kdtStep(w, 26); kdtStep(w, 26);
  assert.deepEqual(tasksOf(w), ['51:lan'], 'không còn ý kiến cần sửa → ra khỏi quy trình con, cấp VHT (không qua bước 50)');
  assert.equal(Flow.state.vars.sub, null);
  assert.deepEqual(counts(w), [0, 0]);
  kdtStep(w, 51);
  assert.deepEqual(tasksOf(w), ['54:tgd']);
  assert.equal(Flow.kdtStage(), 'KYQD');
  assert.deepEqual(docsOf(w), ['BM-01', 'BM-14']);
  kdtStep(w, 54);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.kdtStage(), 'OK');
  assert.deepEqual(docsOf(w), ['BM-01', 'BM-14', 'BM-18']);
  const hs = Flow.kdtCases().find((c) => c.kdt === 'KĐT-2026-0032');
  assert.deepEqual(plain([hs.st, hs.stage, hs.total, hs.docs.map((d) => d[0])]), ['done', 'OK', 118.5, ['BM-01', 'BM-14', 'BM-18']]);
  assert.match(Flow.state.history.slice(-1)[0].action, /Quyết định phê duyệt KĐT/);
});

test('B4 KĐT: báo cáo chưa thông qua → 52 → 53 → 46 (BM-03 lên v2); TTMS trả lại danh sách CQCM trong 49 → 48; Thủ trưởng không ký BM-18 → cổng gộp → 36', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[5];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['51:lan']);
  kdtStep(w, 51, 'Báo cáo chưa');
  assert.deepEqual(tasksOf(w), ['53:minh']);
  assert.ok(Flow.state.history.some((h) => String(h.task) === '52' && h.system));
  kdtStep(w, 53);
  assert.deepEqual(tasksOf(w), ['46:minh']);
  kdtStep(w, 46); kdtStep(w, 47); kdtStep(w, 48);
  kdtStep(w, 24, 'Danh sách CQCM');
  assert.deepEqual(tasksOf(w), ['48:minh'], 'trả lại danh sách CQCM → bước 48, ra khỏi quy trình con 49');
  assert.equal(Flow.state.vars.sub, null);
  Flow.jumpToScene('K8', 'MS13');
  kdtStep(w, 51);
  kdtStep(w, 54, 'Không ký');
  assert.deepEqual(tasksOf(w), ['36:minh'], 'G21 Không → cổng gộp → hai giai đoạn');
  assert.equal(Flow.state.vars.td, 'CT');
});

test('B4 KĐT: nhánh gộp BM-00 trên KĐT-2026-0031 (chạy lại hồ sơ mẫu HS-2026-0031) — 18–21 → thẩm định GOP → 55 → 56 ký BM-00; không ký → 17 → 18', () => {
  const w = boot(null);
  const { Flow, D } = w;
  Flow.jumpToScene('K9', 'MS13');
  assert.deepEqual(plain([Flow.state.kdt, Flow.state.code, Flow.state.vars.branch, Flow.state.vars.td]), ['KĐT-2026-0031', 'HS-2026-0031', 'BM00', 'GOP']);
  assert.equal(Flow.kdtCases().filter((c) => c.code === 'HS-2026-0031').length, 1, 'bản ghi mẫu trùng mã bị thay bằng hồ sơ đang chạy');
  assert.equal(Flow.taskStatus(36), 'na');
  assert.equal(Flow.taskStatus(55), 'todo');
  assert.deepEqual(tasksOf(w), ['18:minh']);
  kdtStep(w, 18); kdtStep(w, 19);
  assert.deepEqual(tasksOf(w), ['20:hai']);
  kdtStep(w, 20);
  assert.deepEqual(tasksOf(w), ['21:minh'], 'bước 20 không có cổng đồng ý / không');
  kdtStep(w, 21);
  assert.deepEqual(tasksOf(w), ['24:lan']);
  assert.ok(!Flow.state.vars.sub, 'nhánh gộp chạy khối E trực tiếp, không qua quy trình con');
  assert.equal(Flow.kdtStage(), 'TDGOP');
  kdtStep(w, 24); kdtStep(w, 26); kdtStep(w, 26);
  assert.deepEqual(tasksOf(w), ['55:minh'], 'không cần sửa → phân cấp VHT → ĐVĐX trình ký');
  assert.equal(Flow.kdtStage(), 'KYGOP');
  kdtStep(w, 55); kdtStep(w, 56);
  assert.equal(Flow.state.status, 'approved');
  assert.deepEqual(docsOf(w), ['BM-00']);
  assert.match(Flow.state.history.slice(-1)[0].action, /hồ sơ gộp BM-00/);
  // Không ký: "Kết quả phê duyệt / chỉ đạo?" Không → cổng gộp → 17 (AI) → 18; TTMS trả lại danh sách CQCM → 21.
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[6];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  kdtStep(w, 56, 'Không ký');
  assert.deepEqual(tasksOf(w), ['18:minh']);
  Flow.jumpTo(24, 'lan', null, 'MS13', 'KĐT-2026-0031');
  kdtStep(w, 24, 'Danh sách CQCM');
  assert.deepEqual(tasksOf(w), ['21:minh']);
});

test('B5 KĐT: cảnh K10 tua KĐT-2026-0032 tới Quyết định phê duyệt — hồ sơ Hoàn thành, KĐT Đã phê duyệt, văn bản BM-01, BM-14, BM-18; bộ đếm theo giai đoạn', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const sc = Flow.jumpToScene('K10', 'MS13');
  assert.equal(sc.go, 'kdt/' + encodeURIComponent(D.kdtCode0));
  assert.deepEqual(plain([Flow.state.status, Flow.state.kdt, Flow.state.persona, Flow.state.tokens.length]), ['approved', 'KĐT-2026-0032', 'lan', 0]);
  assert.equal(Flow.kdtStage(), 'OK');
  assert.deepEqual(docsOf(w), ['BM-01', 'BM-14', 'BM-18']);
  const rec = Flow.kdtCases().find((c) => c.code === Flow.state.code);
  assert.deepEqual(plain([rec.st, rec.flow, rec.branch, rec.live]), ['done', 'MS13', '2GD', true]);
  assert.deepEqual(plain([Flow.state.vars.chk, Flow.state.vars.meet]), [{ CT: 2 }, { CT: 1 }], 'chủ trương: vòng check 2/2, họp 1/2 (§2.3); KĐT 1 lượt thống nhất');
  assert.equal(Flow.taskStatus(54), 'done');
  assert.equal(Flow.taskStatus(17), 'na', 'hồ sơ hai giai đoạn không đi nhánh gộp');
});
