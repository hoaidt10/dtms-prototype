// Kiểm tra bộ máy luồng MS01 của prototype theo BPMN chuẩn ĐTMS-121026.drawio / MS01 v1.1 (61 task)
// và quyết định "MS01 một quy trình, luồng con do hệ thống đặt" (T29 B1, D-54, D-77).
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
  for (const f of ['bpmn-tasks.js', 'bpmn-tasks-ms13.js', 'bpmn-tasks-ms02.js', 'data.js', 'flow.js']) {
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
  for (const n of Array.from({ length: 61 }, (_, i) => i + 1)) {
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
  // Nhánh < 160 tỷ không chạy; timeline đánh dấu "không áp dụng".
  for (const n of [11, 38, 39, 40]) assert.equal(Flow.taskStatus(n), 'na', `task ${n} phải là na`);
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
  step(w, { task: 17, label: 'Từ chối' });
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
  // T29 B1: chọn Không báo cáo = chốt luồng con MS01.02 → 49–56 "Không áp dụng".
  assert.equal(w.Flow.state.vars.process, 'MS01.02');
  assert.equal(w.Flow.ci().flowLabel, 'MS01.02');
  assert.equal(w.Flow.taskStatus(49), 'na');
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
    // T29 B3a: cảnh Kho — việc ngoài sơ đồ (SCR-105), Kho không có token BPMN; chưa có kết quả rà soát.
    if (s.go === 'ra-soat-kho') { assert.equal((Flow.ui.rstk || {}).kq, undefined); continue; }
    assert.ok(Flow.tokensFor(s.who).length > 0, `cảnh ${s.n}: vai ${s.who} phải có việc`);
  }
});

test('T29 B3a + B5 (D-82): tua qua bước 7 điền kết quả rà soát mẫu một lần theo BM-RSTK (Kho); SL xuất kho = khả dụng = tồn − đang giữ', () => {
  const w = boot();
  const { Flow, D } = w;
  w.Flow.jumpTo(7, 'minh');
  assert.equal(Flow.ui.rstk, undefined, 'tới bước 7: Kho chưa nhập');
  w.Flow.jumpTo(8, 'minh');
  const r = Flow.ui.rstk;
  assert.ok(r && r.kq && !r.p1 && !r.p2);
  const i4 = D.items.find((i) => i.n === 4), a = r.kq.rows.find((x) => x.n === 4);
  assert.equal(a.code, D.rstkCode(4));
  assert.equal(a.stock, 8);
  assert.equal(a.out, i4.stock, 'xuất 6 = khả dụng 8 − 2');
  assert.equal(i4.prop - a.out, i4.buy, 'SL cần mua = yêu cầu − xuất kho (BM-RSTK E − K)');
  assert.equal(r.kq.rows.find((x) => x.n === 5).code, '', 'dịch vụ không quản lý tồn');
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

test('ĐXMS: mã tự sinh, sửa/xoá; hồ sơ Phê duyệt giữ số của ĐXMS, hồ sơ Điều chỉnh lấy số trống', { todo: 'T77 S4 cách ly: mã kế tiếp đổi (mong HS-2026-0128, ra HS-2026-0143) — dữ liệu mẫu thêm ở T58 / 17-11' }, () => {
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
  // T34 (D-85): Điều chỉnh tạo ĐXMS mới (mã mới, không lấy 0117), hồ sơ giữ 4 số của ĐXMS mới; chuỗi 0103 → 0127.
  assert.equal(Flow.ci().dxms, 'ĐXMS-2026-0127');
  assert.deepEqual(plain([Flow.findDxms('ĐXMS-2026-0127').adjFrom, Flow.findDxms('ĐXMS-2026-0127').adjN, Flow.findDxms('ĐXMS-2026-0127').root]), ['ĐXMS-2026-0103', 1, 'ĐXMS-2026-0103']);
  assert.deepEqual(plain(Flow.dxmsChain('ĐXMS-2026-0127').map((x) => x.code)), ['ĐXMS-2026-0103', 'ĐXMS-2026-0127']);
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

test('T29 B1: hồ sơ dự kiến MS01.03 nhưng Tổng giá trị 182,90 tỷ — cổng sau task 10 đặt luồng con MS01.01, vào task 12 (không còn 10a / 10b)', () => {
  const w = boot('MS01.03');
  const { Flow, D } = w;
  assert.equal(D.flow['10a'], undefined);
  assert.equal(D.flow['10b'], undefined);
  assert.equal(w.BPMN_TASKS['10a'], undefined);
  runUntil(w, 12);
  assert.ok(has(w, 12, 'minh'));
  assert.equal(Flow.state.vars.process, 'MS01.01');
  assert.equal(Flow.state.vars.big, true);
  assert.equal(Flow.taskStatus(11), 'na');
});

test('T29 B1: hồ sơ dự kiến MS01.01 nhưng 45,2 tỷ — luồng con MS01.03, vào task 11', () => {
  const w = boot('MS01.01', 45.2);
  runUntil(w, 11);
  assert.ok(has(w, 11, 'minh'));
  assert.equal(w.Flow.state.vars.process, 'MS01.03');
  assert.equal(w.Flow.state.vars.big, false);
  assert.equal(w.Flow.ci().flowLabel, 'MS01.03');
});

test('T29 B1: nhãn Quy trình "MS01" trước cổng, ".01 (dự kiến)" tới task 48, chốt sau task 48', () => {
  const w = boot();
  const { Flow } = w;
  assert.equal(Flow.ci().flowLabel, 'MS01');
  runUntil(w, 12);
  assert.equal(Flow.ci().flowLabel, 'MS01.01 (dự kiến)');
  runUntil(w, 50);
  assert.equal(Flow.state.vars.reportTD, true);
  assert.equal(Flow.ci().flowLabel, 'MS01.01');
});

test('T29 B1 (D-77): Căn cứ đã được phê duyệt → luồng con dự kiến MS01.02, task 48 chọn sẵn Không báo cáo và chốt MS01.02', () => {
  const w = boot();
  const { Flow, D } = w;
  assert.equal(D.subFlow(182.9, true), 'MS01.02');
  assert.equal(D.subFlow(182.9, false), 'MS01.01');
  assert.equal(D.subFlow(45.2, true), 'MS01.03');
  assert.equal(D.subFlow(null, true), 'MS01.02');
  Flow.state.vars.basisTD = true;
  runUntil(w, 48);
  assert.equal(Flow.state.vars.process, 'MS01.02', 'cổng sau task 10 theo basisTD');
  const [yes, no] = Flow.choices(48);
  assert.equal(yes.lockWhen, undefined, 'TTMS vẫn chọn được Có báo cáo');
  assert.equal(Flow.mainChoice(48).label, no.label);
  step(w, { task: 48 });
  assert.equal(Flow.state.vars.reportTD, false);
  assert.equal(Flow.state.vars.process, 'MS01.02');
});

// T8 B5 — ngưỡng phân luồng lấy từ bảng Ngưỡng phân luồng (SCR-40, D.dxmsRules), hồ sơ giữ bản chụp lúc tạo (P-34).
const TH150 = () => [{ from: 0, to: 150, procs: ['MS01.03'] }, { from: 150, to: null, procs: ['MS01.01', 'MS01.02'] }];

test('ngưỡng mặc định: điều kiện hiển thị < 160 / ≥ 160 tỷ kèm điều kiện căn cứ', () => {
  const w = boot();
  assert.equal(w.Flow.condOf('MS01.03'), '< 160 tỷ · mọi loại căn cứ');
  assert.equal(w.Flow.condOf('MS01.01'), '≥ 160 tỷ · căn cứ chưa được CT/TGĐ TĐ duyệt');
});

test('ngưỡng MS01 sửa thành 150 tỷ: hồ sơ 155 tỷ dự kiến MS01.03 — cổng đặt MS01.01 theo ngưỡng hồ sơ giữ', () => {
  const w = boot(null, 155);
  w.D.dxmsRules = TH150;
  w.Flow.create('MS01.03');
  assert.equal(w.Flow.condOf('MS01.03'), '< 150 tỷ · mọi loại căn cứ');
  runUntil(w, 12);
  assert.equal(w.Flow.matchCheck().suggest, 'MS01.01');
  assert.equal(w.Flow.state.vars.process, 'MS01.01');
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

test('MS01.02: chạy tới phê duyệt; task 48 chọn sẵn "Không báo cáo" theo căn cứ đã được phê duyệt (D-77), bỏ 49–56 và nhánh < 160 tỷ', () => {
  const w = bootCase('ĐXMS-2026-0124', 'MS01.02');
  const { Flow } = w;
  assert.equal(Flow.state.vars.basisTD, true, 'ĐXMS-2026-0124 có basisTD');
  runUntil(w, 48);
  const [, no] = Flow.choices(48);
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
  for (const set of D.demoSets.filter((d) => !d.hd)) {
    for (const s of set.scenes) {
      Flow.jumpToScene(s.n, set.key);
      assert.equal(Flow.demoSet().key, set.key, `cảnh ${s.n}: bộ demo`);
      if (s.start === 'NEW') { assert.equal(Flow.state.status, 'new'); continue; }
      if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', `cảnh ${s.n}`); continue; }
      // T34 (D-85): hồ sơ Điều chỉnh thuộc ĐXMS mới, Điều chỉnh từ = ĐXMS của cảnh.
      const want = s.kdt || s.dxms || set.dxms || set.kdt;
      assert.equal(Flow.ci().kind === 'DC' ? Flow.ci().adjFrom : Flow.ci().dxms, want, `cảnh ${s.n}: ĐXMS`);
      assert.equal(Flow.state.vars.process === set.key || Flow.ci().flow === set.key, true, `cảnh ${s.n}: quy trình`);
      // T29 B3a: cảnh Kho (việc ngoài sơ đồ) — token bước 7 thuộc ĐVĐX, Kho làm SCR-105.
      if (s.go === 'ra-soat-kho') { assert.ok(Flow.state.tokens.find((t) => String(t.task) === '7'), `cảnh ${s.n}: hồ sơ ở bước 7`); continue; }
      assert.ok(Flow.state.tokens.find((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}: ${s.who} phải có việc ở task ${s.start}`);
    }
    for (const b of set.branches) {
      Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
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
// T18 — luồng MS13 viết lại theo BPMN bản 12/10 (ĐTMS-121026.drawio trang MS13, 78 bước; plan prototype-T18 §1).
test('B1 KĐT: engine chọn định nghĩa luồng theo quy trình; tạo KĐT không start quy trình, tạo hồ sơ KĐT start MS13', { todo: 'T77 S4 cách ly: mã KĐT kế tiếp đổi (mong KĐT-2026-0034, ra KĐT-2026-0041) — dữ liệu mẫu T58' }, () => {
  const w = boot(null);
  const { Flow, D } = w;
  assert.deepEqual(['MS01.01', 'MS01.02', 'MS01.03', 'MS13', null].map(D.familyOf), ['MS01', 'MS01', 'MS01', 'MS13', 'MS01']);
  Flow.create('MS01.03');
  assert.equal(Flow.def(), D.flow);
  assert.equal(Flow.tasks(), w.BPMN_TASKS);
  assert.equal(w.BPMN_FLOWS.MS13.page, 'MS13');
  assert.equal(Object.keys(w.BPMN_FLOWS.MS13.tasks).length, 78);
  // KĐT: mã đầu tiên KĐT-2026-0032, tạo KĐT không đổi luồng đang chạy; hồ sơ Phê duyệt giữ 4 số của KĐT, start MS13 ở bước 1, chưa xác định nhóm.
  const code = Flow.createKdt({ title: 'KĐT thử', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 10 });
  assert.equal(code, 'KĐT-2026-0032');
  assert.equal(Flow.state.vars.process, 'MS01.03');
  assert.equal(Flow.createKdtCase({ kdt: code, name: 'Hồ sơ thử' }), 'HS-2026-0032');
  const hs = Flow.kdtCases().find((c) => c.kdt === code);
  assert.deepEqual(plain([hs.flow, hs.task, hs.st, hs.stage, hs.kind, hs.scope]), [null, 1, 'processing', 'LAP', 'CT', 'CT']);
  assert.equal(Flow.state.vars.process, 'MS13');
  assert.equal(Flow.def(), D.flows.MS13);
  assert.equal(Flow.createKdt({ title: 'KĐT thử 2' }), 'KĐT-2026-0034');
});

test('T18: mọi bước của luồng MS13 (cấp VHT + tuyến Tập đoàn) có trong BPMN 12/10; mỗi mũi tên đích của định nghĩa luồng là bước / cổng có thật', () => {
  const w = boot(null);
  const { D } = w;
  const T = w.BPMN_FLOWS.MS13.tasks, K = D.flows.MS13;
  const keys = new Set(Object.keys(K));
  for (const [k, f] of Object.entries(K)) {
    if (/^\d+$/.test(k)) assert.ok(T[k], `bước ${k} có trong BPMN`);
    const to = [f.next].concat((f.choices || []).map((c) => c.to), f.varGate ? Object.values(Object.values(f.varGate)[0]) : [],
      f.groupGate ? [f.groupGate.yes, f.groupGate.no] : [], f.mergeGate ? [f.mergeGate.yes, f.mergeGate.no] : [], f.capGate ? [f.capGate.vht, f.capGate.td] : [],
      f.forkTo ? f.forkTo.map((b) => b.task) : [], f.fork ? [f.to] : []).filter((x) => x != null);
    for (const t of to) assert.ok(keys.has(String(t)) || /^END/.test(t), `${k} → ${t}`);
  }
  // Bước 1–74 đều có cấu hình (T18 B4: tuyến Tập đoàn 63–74 dựng đủ, không còn bước wip); 75 gộp vào hộp thoại ký (B3-1).
  for (let n = 1; n <= 78; n++) if (n !== 75) assert.ok(K[n], `bước ${n}`);
  assert.ok(!Object.values(K).some((f) => f.wip), 'không còn bước chưa dựng');
  for (const n of [13, 25, 28, 30, 33, 44, 45, 49, 54, 58, 63, 66, 74]) assert.equal(T[n].type, 'service', `bước ${n} là service task`);
  for (const n of [67, 70, 71, 72, 73]) assert.equal(K[n].who, 'td', `bước ${n} của Tập đoàn — tài khoản giả lập (P-96)`);
});

// T11 B2 / T18 — bước 1–17: xác nhận song song 11 ‖ 12, thẩm quyền 13, cổng phân luồng / báo giá / gộp, nhánh chuyển MS14.
function kdtStep(w, task, label) {
  const { Flow } = w;
  const tok = Flow.state.tokens.find((t) => String(t.task) === String(task));
  assert.ok(tok, `phải còn token ở task ${task} (đang có ${Flow.state.tokens.map((t) => t.task).join(', ')})`);
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
const sysLog = (w, n) => w.Flow.state.history.filter((h) => String(h.task) === String(n) && h.system);

test('B2 KĐT: task 1–10 → G5 báo giá → 11 ‖ 12 song song, chờ đủ 02 kết quả → 13 thẩm quyền → MS13 hai giai đoạn, sang bước 15', () => {
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
  assert.deepEqual(tasksOf(w), ['15:minh']);
  // Bước 13 (D-33, P-90): KHCN 118,5 tỷ ≥ 45 → chủ trương VHT, KĐT VHT (UQ-GUQ §1.2.2); ghi vào nhật ký.
  assert.deepEqual(plain(Flow.state.vars.cap), { ct: 'VHT', kdt: 'VHT', basis: 'UQ-GUQ §1.2.2' });
  assert.match(sysLog(w, 13)[0].action, /chủ trương: VHT, KĐT: VHT/);
  assert.deepEqual(plain([Flow.state.vars.group, Flow.state.vars.branch, Flow.kdtStage()]), ['MS13', '2GD', 'CT']);
  const hs = Flow.kdtCases().find((c) => c.kdt === code);
  assert.deepEqual(plain([hs.flow, hs.branch, hs.stage, hs.task]), ['MS13', '2GD', 'CT', 15]);
  assert.equal(Flow.ci().flow, 'MS13');
  // Nhánh gộp BM-00 không áp dụng cho hồ sơ hai giai đoạn; tuyến Tập đoàn (63–74) chưa dựng. Khối ký chung: 75 chờ tới bước ký, 77–78 theo điều kiện (không Mật).
  for (const n of [18, 24, 61, 62, 63, 70]) assert.equal(Flow.taskStatus(n), 'na', `bước ${n}`);
  assert.deepEqual(plain([75, 77, 78].map(Flow.taskStatus)), ['todo', 'cond', 'cond']);
  assert.equal(Flow.taskStatus(39), 'todo');
  assert.equal(Flow.taskStatus(27), 'todo', 'khối chung 25–38 dùng cho cả hai nhánh');
  // G10 cổng gộp sau 17 → 39 (BM-01).
  kdtStep(w, 15); kdtStep(w, 17);
  assert.ok(sysLog(w, 16).length, 'AI hỗ trợ soạn (16) là service');
  assert.deepEqual(tasksOf(w), ['39:minh']);
  assert.equal(Flow.state.vars.td, 'CT');
});

test('B2 KĐT: Trang bị nội bộ + Nguyên chiếc + mức vốn MS13 → gộp BM-00 (AI 18 → bước 19)', () => {
  const w = boot(null);
  const { Flow } = w;
  kdtCase(w, { type: 'TBNB', nature: 'NGUYEN_CHIEC' });
  kdtStep(w, 12); kdtStep(w, 11);
  assert.deepEqual(plain([Flow.state.vars.group, Flow.state.vars.branch, Flow.kdtStage()]), ['MS13', 'BM00', 'GOP']);
  assert.equal(Flow.kdtCheck().merge, true);
  kdtStep(w, 15); kdtStep(w, 17);
  assert.deepEqual(tasksOf(w), ['19:minh']);
  assert.ok(sysLog(w, 18).length);
  assert.equal(Flow.state.vars.td, 'GOP');
  for (const n of [39, 48, 60]) assert.equal(Flow.taskStatus(n), 'na', `bước ${n}`);
});

test('B2 KĐT: xác nhận Không OK → AI gợi ý (14) → bước 10; báo giá chưa đạt → G5 về bước 08 trước khi gửi xác nhận', () => {
  const w = boot(null);
  const { Flow } = w;
  kdtCase(w);
  kdtStep(w, 11);
  kdtStep(w, 12, 'Không OK');
  assert.deepEqual(tasksOf(w), ['10:minh']);
  assert.ok(sysLog(w, 14).length);
  assert.equal(sysLog(w, 13).length, 0, 'chưa xác định thẩm quyền');
  assert.equal(Flow.state.vars.group, undefined, 'chưa phân luồng');
  kdtStep(w, 10, 'Báo giá chưa đạt');
  assert.deepEqual(tasksOf(w), ['8:minh'], 'bản 12/10: G5 nằm ngay sau 10');
  kdtStep(w, 8); kdtStep(w, 10);
  assert.deepEqual(tasksOf(w), ['11:thu', '12:lan']);
  kdtStep(w, 11); kdtStep(w, 12);
  assert.equal(Flow.state.vars.group, 'MS13');
});

test('B2 KĐT: KĐT-2026-0033 (lĩnh vực Khác, 96 tỷ ≥ 90) → 13 → G9 chuyển luồng MS14, hồ sơ mới của cùng KĐT', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[0];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['12:lan'], 'Ban Tài chính đã xác nhận (settle)');
  assert.equal(Flow.kdtCheck().group, 'MS14');
  kdtStep(w, 12);
  assert.ok(sysLog(w, 13).length, 'xác định thẩm quyền trước cổng phân luồng');
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

// T18 — chủ trương BM-01 (39–45) → khối chung 25–38 vòng BM-01 → 46 → ký 47 / 48.
const two = (w) => { kdtStep(w, 11); kdtStep(w, 12); };
// Hồ sơ KĐT-2026-0032 (hai giai đoạn) đã qua dự thảo, trình BM-01 tới bước 43 (chưa trình).
function toSubmit(w) {
  kdtCase(w);
  two(w);
  for (const n of [15, 17, 39, 40, 41, 42]) kdtStep(w, n);
  assert.deepEqual(tasksOf(w), ['43:minh']);
}
const counts = (w) => plain([w.Flow.tdCount('chk'), w.Flow.tdCount('meet')]);

test('B3 KĐT: 39–43 → HT/AI kiểm tra (44) → mở vòng BM-01 (45) → khối chung (lượt 1 cần sửa, lượt 2 giải trình → họp 1, xác nhận, cập nhật) → 46 → 47 → 48 → kết thúc hồ sơ CT; hồ sơ KĐT → 50', () => {
  const w = boot(null);
  const { Flow } = w;
  toSubmit(w);
  kdtStep(w, 43);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  assert.ok(sysLog(w, 44).length && sysLog(w, 45).length);
  assert.equal(Flow.state.vars.td, 'CT');
  assert.equal(Flow.state.tokens[0].sub, undefined, 'không còn quy trình con (D-32)');
  assert.equal(Flow.taskStatus(27), 'active', 'khối chung tô đúng bước');
  assert.equal(Flow.kdtStage(), 'TDCT');
  assert.equal(Flow.kdtCases()[0].task, 27);
  // Lượt 1: CQCM Tài chính ‖ Pháp chế (AI gợi ý 28); Tài chính cần sửa → AI (30) → ĐVĐX bổ sung (31) → thẩm định lại.
  kdtStep(w, 27);
  assert.deepEqual(tasksOf(w), ['29:hoa', '29:thu']);
  assert.ok(sysLog(w, 28).length);
  kdtStep(w, 29); kdtStep(w, 29);
  assert.deepEqual(tasksOf(w), ['31:minh']);
  assert.equal(Flow.mainChoice(31).label, 'Bổ sung hồ sơ theo ý kiến');
  kdtStep(w, 31);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  assert.deepEqual(counts(w), [1, 0]);
  // Lượt 2: vẫn cần sửa → ĐVĐX giải trình → chưa thống nhất → họp lần 1 (32, 33 ghi nhận) → Chuyên quản (34) → Chỉ huy (35) → cập nhật (36) → lượt 3 thống nhất.
  kdtStep(w, 27); kdtStep(w, 29); kdtStep(w, 29);
  assert.equal(Flow.mainChoice(31).label, 'Giải trình, bảo lưu ý kiến');
  kdtStep(w, 31);
  assert.deepEqual(tasksOf(w), ['32:lan']);
  kdtStep(w, 32);
  assert.ok(sysLog(w, 33).length);
  assert.deepEqual(counts(w), [2, 1]);
  assert.deepEqual(tasksOf(w), ['34:minh']);
  kdtStep(w, 34);
  assert.deepEqual(tasksOf(w), ['35:hai']);
  kdtStep(w, 35); kdtStep(w, 36);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  kdtStep(w, 27); kdtStep(w, 29); kdtStep(w, 29);
  assert.deepEqual(tasksOf(w), ['46:lan'], 'không còn ý kiến cần sửa → G16 vòng BM-01 → 46');
  assert.equal(Flow.kdtStage(), 'TDCT');
  kdtStep(w, 46);
  assert.deepEqual(tasksOf(w), ['47:lan'], 'G23 chủ trương cấp VHT');
  assert.equal(Flow.kdtStage(), 'KYCT');
  kdtStep(w, 47);
  assert.deepEqual(tasksOf(w), ['48:tgd']);
  kdtStep(w, 48);
  // T45 (D-103): ký chủ trương = kết thúc hồ sơ CT; KĐT Đã phê duyệt chủ trương.
  assert.deepEqual(plain([Flow.state.status, Flow.kdtStage(), Flow.state.tokens.length]), ['approved', 'CT_OK', 0]);
  assert.match(Flow.state.history.slice(-1)[0].action, /chủ trương KĐT đã phê duyệt/);
  const ct = Flow.state.code;
  assert.deepEqual(plain(Flow.kdtCtChoices(Flow.state.kdt).map((c) => c.code)), [ct]);
  Flow.createKdtCase(Flow.state.kdt, { kind: 'KDT', parent: ct, est: 118.5 });
  assert.deepEqual(tasksOf(w), ['50:minh']);
  assert.equal(Flow.kdtStage(), 'HS');
  assert.ok(sysLog(w, 49).length);
  assert.deepEqual(plain([Flow.state.vars.chk.CT, Flow.state.vars.meet.CT]), [2, 1], 'bộ đếm vòng BM-01 kế thừa từ hồ sơ CT');
});

test('B3 KĐT: CQCM chủ trì không đồng ý DS CQCM → 41; không chọn CQCM → bỏ 28–29; G13 chưa đủ điều kiện → 25 → 26 → về chọn CQCM đúng vòng; G22 AI không đạt → 39', () => {
  const w = boot(null);
  const { Flow } = w;
  kdtCase(w); two(w);
  for (const n of [15, 17, 39, 40, 41]) kdtStep(w, n);
  kdtStep(w, 42, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['41:minh']);
  Flow.setUi('cqcmSel', []);
  kdtStep(w, 41); kdtStep(w, 42); kdtStep(w, 43);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  kdtStep(w, 27);
  assert.deepEqual(tasksOf(w), ['46:lan'], 'CQCM chủ trì đồng ý, không có CQCM phối hợp');
  // Hồ sơ chưa đủ điều kiện (kiểm tra của hệ thống khi mở vòng) → AI (25) → ĐVĐX bổ sung (26) → G12 vòng BM-01 → 41; lần sau đủ điều kiện.
  const w2 = boot(null);
  toSubmit(w2);
  w2.Flow.setUi('inc', { CT: true });
  kdtStep(w2, 43);
  assert.deepEqual(tasksOf(w2), ['26:minh']);
  assert.equal(sysLog(w2, 25)[0].td, 'CT');
  kdtStep(w2, 26);
  assert.deepEqual(tasksOf(w2), ['41:minh']);
  kdtStep(w2, 41); kdtStep(w2, 42); kdtStep(w2, 43);
  assert.deepEqual(tasksOf(w2), ['27:lan']);
  // HT/AI kiểm tra trước khi gửi không đạt → sửa hồ sơ (39).
  const w3 = boot(null);
  toSubmit(w3);
  w3.Flow.setUi('ai44Fail', true);
  kdtStep(w3, 43);
  assert.deepEqual(tasksOf(w3), ['39:minh']);
  assert.equal(sysLog(w3, 45).length, 0, 'chưa mở vòng BM-01');
});

test('B3 KĐT: họp đủ 02 lần vẫn chưa thống nhất → báo cáo (37) → Thủ trưởng kết luận (38); chỉ đạo xử lý → 31, chỉ đạo dừng → kết thúc', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[3];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['32:lan']);
  assert.deepEqual(counts(w), [2, 1]);
  kdtStep(w, 32, 'Chưa thống nhất');
  assert.deepEqual(counts(w), [2, 2]);
  assert.deepEqual(tasksOf(w), ['37:lan'], 'không tổ chức họp lần 3');
  kdtStep(w, 37);
  assert.deepEqual(tasksOf(w), ['38:tgd']);
  kdtStep(w, 38);
  assert.deepEqual(tasksOf(w), ['31:minh']);
  assert.equal(Flow.mainChoice(31).label, 'Bổ sung hồ sơ theo ý kiến', 'làm theo kết luận');
  kdtStep(w, 31);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  kdtStep(w, 32, 'Chưa thống nhất'); kdtStep(w, 37); kdtStep(w, 38, 'Chỉ đạo dừng');
  assert.equal(Flow.state.status, 'stopped');
  assert.equal(Flow.kdtStage(), 'STOP');
});

test('B3 KĐT: TGĐ VHT không đồng ý chủ trương — tiếp tục xử lý → G10 → 39 (bộ đếm không đặt lại), chỉ đạo dừng → kết thúc; cảnh K4–K6 đặt đúng việc', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const set = D.demoSets.find((d) => d.key === 'MS13');
  const b = set.branches[4];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['48:tgd']);
  kdtStep(w, 48, 'Không đồng ý — chỉ đạo xử lý');
  assert.deepEqual(tasksOf(w), ['39:minh']);
  assert.deepEqual(counts(w), [2, 1]);
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  kdtStep(w, 48, 'Không đồng ý — chỉ đạo dừng');
  assert.equal(Flow.state.status, 'stopped');
  for (const [n, task, who] of [['K4', 15, 'minh'], ['K5', 27, 'lan'], ['K6', 47, 'lan']]) {
    Flow.jumpToScene(n, 'MS13');
    assert.deepEqual(plain([Flow.state.persona, Flow.state.tokens.map((t) => t.task)]), [who, [task]], `cảnh ${n}`);
  }
});

// T18 — hồ sơ KĐT BM-03 (49–54) → khối chung vòng BM-03 → 55 → 56 → 57 BM-14 → 60 ký BM-18; nhánh gộp BM-00 (18–24 → khối chung → 61–62).
const docsOf = (w) => plain(w.Flow.kdtDocs().map((d) => d.code));
test('B4 KĐT: 50–53 → mở vòng BM-03 (54, bộ đếm riêng) → 27 → 55 → 56 → 57 BM-14 → 60 ký BM-18 → Đã phê duyệt; văn bản đầu ra BM-01, BM-14, BM-18', () => {
  const w = boot(null);
  const { Flow } = w;
  Flow.jumpToScene('K7', 'MS13');
  assert.deepEqual(tasksOf(w), ['50:minh']);
  assert.deepEqual(docsOf(w), ['BM-01']);
  kdtStep(w, 50); kdtStep(w, 51);
  assert.equal(Flow.kdtStage(), 'HS');
  kdtStep(w, 52);
  assert.deepEqual(tasksOf(w), ['53:lan']);
  kdtStep(w, 53);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  assert.ok(sysLog(w, 54).length);
  assert.equal(Flow.state.vars.td, 'KDT');
  assert.equal(Flow.kdtStage(), 'TDKDT');
  assert.deepEqual(counts(w), [0, 0], 'vòng BM-03 đếm riêng');
  kdtStep(w, 27);
  assert.deepEqual(tasksOf(w), ['29:hoa', '29:thu']);
  kdtStep(w, 29); kdtStep(w, 29);
  assert.deepEqual(tasksOf(w), ['55:lan'], 'không còn ý kiến cần sửa → G16 vòng BM-03 → 55');
  kdtStep(w, 55);
  assert.deepEqual(tasksOf(w), ['56:hai'], 'G27 KĐT cấp VHT → Chỉ huy ĐVĐX ký tờ trình');
  kdtStep(w, 56);
  assert.deepEqual(tasksOf(w), ['57:lan']);
  kdtStep(w, 57);
  assert.deepEqual(tasksOf(w), ['60:tgd']);
  assert.equal(Flow.kdtStage(), 'KYQD');
  assert.deepEqual(docsOf(w), ['BM-01', 'BM-14']);
  kdtStep(w, 60);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(Flow.kdtStage(), 'OK');
  assert.deepEqual(docsOf(w), ['BM-01', 'BM-14', 'BM-18']);
  // T45: hồ sơ KĐT HS-2026-0032-2 (kế thừa BM-01 của hồ sơ CT — danh sách hồ sơ ghi văn bản của chính hồ sơ) + hồ sơ CT HS-2026-0032 Hoàn thành.
  const hs = Flow.kdtCases().find((c) => c.kdt === 'KĐT-2026-0032');
  assert.deepEqual(plain([hs.code, hs.kind, hs.parent, hs.st, hs.stage, hs.total, hs.docs.map((d) => d[0])]), ['HS-2026-0032-2', 'KDT', 'HS-2026-0032', 'done', 'OK', 118.5, ['BM-14', 'BM-18']]);
  const ct = Flow.kdtCases().find((c) => c.code === 'HS-2026-0032');
  assert.deepEqual(plain([ct.kind, ct.scope, ct.st, ct.stage, ct.docs.map((d) => d[0])]), ['CT', 'CT', 'done', 'CT_OK', ['BM-01']]);
  assert.deepEqual(plain(Flow.kdtDocs().filter((d) => d.inh).map((d) => [d.code, d.inh])), [['BM-01', 'HS-2026-0032']]);
  assert.match(Flow.state.history.slice(-1)[0].action, /Quyết định phê duyệt KĐT/);
});

test('B4 KĐT: BM-14 không thông qua → 58 → 59 → 50; DS CQCM BM-03 không đồng ý → 52; TGĐ VHT không đồng ý BM-18 → 50 (giữ vòng BM-03)', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[5];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  assert.deepEqual(tasksOf(w), ['57:lan']);
  kdtStep(w, 57, 'Báo cáo không');
  assert.deepEqual(tasksOf(w), ['59:minh']);
  assert.ok(sysLog(w, 58).length);
  kdtStep(w, 59);
  assert.deepEqual(tasksOf(w), ['50:minh']);
  kdtStep(w, 50); kdtStep(w, 51); kdtStep(w, 52);
  kdtStep(w, 53, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['52:minh']);
  Flow.jumpToScene('K8', 'MS13');
  assert.deepEqual(tasksOf(w), ['56:hai']);
  kdtStep(w, 56); kdtStep(w, 57);
  kdtStep(w, 60, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['50:minh'], 'G29 Không đồng ý: sửa BM-03');
  assert.equal(Flow.state.vars.td, 'KDT');
});

test('B4 KĐT: nhánh gộp BM-00 trên KĐT-2026-0031 (chạy lại hồ sơ mẫu HS-2026-0031) — 19–24 → vòng BM-00 → G30 VHT → 61 → 62; không đồng ý → 19', () => {
  const w = boot(null);
  const { Flow, D } = w;
  Flow.jumpToScene('K9', 'MS13');
  assert.deepEqual(plain([Flow.state.kdt, Flow.state.code, Flow.state.vars.branch, Flow.state.vars.td]), ['KĐT-2026-0031', 'HS-2026-0031', 'BM00', 'GOP']);
  assert.equal(Flow.kdtCases().filter((c) => c.code === 'HS-2026-0031').length, 1, 'bản ghi mẫu trùng mã bị thay bằng hồ sơ đang chạy');
  assert.equal(Flow.taskStatus(39), 'na');
  assert.equal(Flow.taskStatus(61), 'todo');
  assert.deepEqual(tasksOf(w), ['19:minh']);
  kdtStep(w, 19); kdtStep(w, 20);
  assert.deepEqual(tasksOf(w), ['21:hai']);
  kdtStep(w, 21);
  assert.deepEqual(tasksOf(w), ['22:minh'], 'bước 21 không có nhánh trả lại (P-92)');
  kdtStep(w, 22);
  assert.deepEqual(tasksOf(w), ['23:lan']);
  kdtStep(w, 23);
  assert.deepEqual(tasksOf(w), ['24:hai']);
  kdtStep(w, 24);
  assert.deepEqual(tasksOf(w), ['27:lan']);
  assert.equal(Flow.kdtStage(), 'TDGOP');
  kdtStep(w, 27); kdtStep(w, 29); kdtStep(w, 29);
  assert.deepEqual(tasksOf(w), ['61:lan'], 'không cần sửa → G16 BM-00 → G30 cấp VHT → TTMS ký BM-14');
  assert.equal(Flow.kdtStage(), 'KYGOP');
  kdtStep(w, 61); kdtStep(w, 62);
  assert.equal(Flow.state.status, 'approved');
  assert.deepEqual(docsOf(w), ['BM-14', 'BM-00', 'BM-18']);
  assert.match(Flow.state.history.slice(-1)[0].action, /hồ sơ gộp BM-00/);
  const b = D.demoSets.find((d) => d.key === 'MS13').branches[6];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle);
  kdtStep(w, 62, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['19:minh']);
  Flow.jumpTo(23, 'lan', null, 'MS13', 'KĐT-2026-0031');
  kdtStep(w, 23, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['22:minh']);
});

test('T18 D-33: thẩm quyền tính lại ở cổng cấp duyệt — chủ trương thuộc Tập đoàn → 63 AI dự thảo công văn → 64; P-90 KHCN < 45 tỷ → chủ trương Tập đoàn', () => {
  const w = boot(null);
  const { Flow, D } = w;
  assert.deepEqual(plain(D.kdtAuthOf({ type: 'KHCN', field: 'VTCNTT' }, 30)), { ct: 'TD', kdt: 'VHT', basis: 'UQ-GUQ §1.2.1' });
  assert.deepEqual(plain(D.kdtAuthOf({ type: 'BDS', field: 'BDS' }, 5)).ct, 'TD');
  assert.deepEqual(plain(D.kdtAuthOf({ type: 'TBNB', field: 'VTCNTT' }, 12.4)), { ct: 'VHT', kdt: 'VHT', basis: 'UQ-GUQ §1.2.2' });
  assert.match(D.kdtAuthOf({ type: 'XYZ' }, 1).basis, /mặc định VHT/);
  kdtCase(w); two(w);
  assert.equal(Flow.state.vars.cap.ct, 'VHT');
  for (const n of [15, 17, 39, 40, 41, 42, 43]) kdtStep(w, n);
  kdtStep(w, 27); kdtStep(w, 29); kdtStep(w, 29); kdtStep(w, 31);
  // Phân cấp đổi trước trình ký (danh mục SCR-100) → G23 tính lại → Tập đoàn.
  D.kdtAuthRules = () => [{ type: 'KHCN', field: '*', from: 0, to: null, ct: 'TD', kdt: 'VHT', basis: 'thử' }];
  for (;;) { const t = Flow.state.tokens[0]; if (!t || t.task === 46) break; kdtStep(w, t.task); }
  kdtStep(w, 46);
  assert.deepEqual(tasksOf(w), ['64:minh']);
  assert.equal(Flow.state.vars.cap.ct, 'TD');
  assert.deepEqual(plain([Flow.state.vars.tdKind, Flow.state.vars.tdKinds]), ['CT', ['CT']]);
  assert.equal(Flow.kdtStage(), 'TD');
  assert.match(sysLog(w, 63)[0].action, /AI hỗ trợ dự thảo công văn/);
  assert.deepEqual(plain([63, 64, 47, 48, 71, 72].map(Flow.taskStatus)), ['done', 'active', 'na', 'na', 'todo', 'na'], 'chủ trương lên Tập đoàn: bỏ 47–48 và 72');
  // Hồ sơ gộp: G30 lên Tập đoàn khi một trong hai cấp là Tập đoàn.
  const w2 = boot(null);
  w2.D.kdtAuthRules = () => [{ type: 'TBNB', field: '*', from: 0, to: null, ct: 'VHT', kdt: 'TD', basis: 'thử' }];
  w2.Flow.jumpTo(64, 'minh', null, 'MS13', 'KĐT-2026-0031');
  assert.deepEqual(tasksOf(w2), ['64:minh']);
  assert.equal(w2.Flow.state.vars.tdKind, 'GOP');
  assert.deepEqual(plain([61, 62, 71, 72].map(w2.Flow.taskStatus)), ['na', 'na', 'na', 'todo']);
});

test('B5 KĐT: cảnh K10 tua KĐT-2026-0032 tới Quyết định phê duyệt — hồ sơ Hoàn thành, KĐT Đã phê duyệt, văn bản BM-01, BM-14, BM-18; bộ đếm theo vòng', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const sc = Flow.jumpToScene('K10', 'MS13');
  assert.equal(sc.go, 'kdt/' + encodeURIComponent(D.kdtCode0));
  assert.deepEqual(plain([Flow.state.status, Flow.state.kdt, Flow.state.persona, Flow.state.tokens.length]), ['approved', 'KĐT-2026-0032', 'lan', 0]);
  assert.equal(Flow.kdtStage(), 'OK');
  assert.deepEqual(docsOf(w), ['BM-01', 'BM-14', 'BM-18']);
  const rec = Flow.kdtCases().find((c) => c.code === Flow.state.code);
  assert.deepEqual(plain([rec.st, rec.flow, rec.branch, rec.live]), ['done', 'MS13', '2GD', true]);
  assert.deepEqual(plain([Flow.state.vars.chk, Flow.state.vars.meet]), [{ CT: 2 }, { CT: 1 }], 'vòng BM-01: 2 lượt bổ sung / giải trình, họp 1/2; vòng BM-03 1 lượt thống nhất');
  assert.equal(Flow.taskStatus(60), 'done');
  assert.equal(Flow.taskStatus(18), 'na', 'hồ sơ hai giai đoạn không đi nhánh gộp');
});

test('T18 B2 nhánh phụ: hồ sơ chưa đủ điều kiện thẩm định → 26 → chọn lại CQCM vòng BM-01 (41); chủ trương thuộc Tập đoàn (bản chụp danh mục) → 63 → 64', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const bs = D.demoSets.find((d) => d.key === 'MS13').branches;
  const go = (i) => { const b = bs[i]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); };
  go(8);
  assert.deepEqual(tasksOf(w), ['26:minh']);
  assert.equal(Flow.state.vars.td, 'CT');
  kdtStep(w, 26);
  assert.deepEqual(tasksOf(w), ['41:minh'], 'G12 vòng BM-01 → chọn lại CQCM');
  kdtStep(w, 41); kdtStep(w, 42); kdtStep(w, 43);
  assert.deepEqual(tasksOf(w), ['27:lan'], 'cờ kiểm tra dùng một lần — lần mở vòng sau đủ điều kiện');
  go(9);
  assert.deepEqual(tasksOf(w), ['64:minh']);
  assert.deepEqual(plain([Flow.state.vars.cap.ct, Flow.state.vars.cap.kdt, Flow.kdtStage()]), ['TD', 'VHT', 'TD']);
  assert.ok(Flow.state.history.some((h) => String(h.task) === '46' && h.who), 'đi qua thẩm định và hoàn chỉnh chủ trương trước khi rẽ Tập đoàn');
});

// T18 B3 — khối ký chung 75–78 (D-34): bước ký MS13 (P-91) đi qua S2 → G1 Mật? → 75 → G2 → 76 VOffice | 77 → 78 → G3 → về đích của nút.
test('T18 B3: ký VOffice (mặc định) — 75 ghi hình thức, 76 nhận callback, về đúng bước tiếp theo; văn bản chỉ có khi khối ký xong', () => {
  const w = boot(null);
  const { Flow } = w;
  Flow.jumpToScene('K6', 'MS13');
  assert.deepEqual(tasksOf(w), ['47:lan']);
  kdtStep(w, 47);
  assert.deepEqual(tasksOf(w), ['48:tgd'], 'VOffice không tạo việc chờ');
  const h75 = Flow.state.history.filter((h) => String(h.task) === '75');
  assert.deepEqual(plain(h75.map((h) => [h.who, h.action])), [['lan', 'Chọn hình thức ký BM-01: VOffice']]);
  assert.match(sysLog(w, 76)[0].action, /callback/);
  assert.deepEqual(plain(Flow.state.vars.kyLog.map((k) => [k.task, k.doc, k.mode])), [[47, 'BM-01', 'soft']]);
  assert.equal(Flow.state.vars.ky, undefined);
  assert.deepEqual(plain([75, 76, 77, 78].map(Flow.taskStatus)), ['done', 'done', 'cond', 'cond']);
  // Không Mật chọn Bản cứng ở hộp thoại trình ký → 77 (người ký) → 78 (người phụ trách) → 49; BM-01 chỉ thành văn bản đầu ra khi 78 xong.
  const tok = Flow.state.tokens[0];
  Flow.complete(tok.id, Flow.mainChoice(48), null, { mode: 'hard' });
  assert.deepEqual(tasksOf(w), ['77:tgd']);
  assert.equal(Flow.kdtStage(), 'KYCT', 'đang ở khối ký: trạng thái theo bước ký 48');
  assert.deepEqual(docsOf(w), [], 'BM-01 chưa có khi đang ký bản cứng');
  assert.equal(Flow.taskStatus(77), 'active');
  kdtStep(w, 77);
  assert.deepEqual(tasksOf(w), ['78:minh']);
  kdtStep(w, 78);
  assert.deepEqual(plain([Flow.state.status, Flow.kdtStage()]), ['approved', 'CT_OK'], 'G3 → về đích của nút ký 48 (T45: kết thúc hồ sơ CT)');
  assert.deepEqual(docsOf(w), ['BM-01']);
  assert.deepEqual(plain(Flow.state.vars.kyLog.map((k) => [k.task, k.mode])), [[47, 'soft'], [48, 'hard']]);
});

test('T18 B3: hồ sơ Mật — G1 bắt buộc bản cứng (bỏ qua 75–76, kể cả khi chọn VOffice); lỗi gửi VOffice → 76 Gửi lại (P-94); nút không ký không vào khối', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const bs = D.demoSets.find((d) => d.key === 'MS13').branches;
  const go = (i) => { const b = bs[i]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); };
  go(10);
  assert.deepEqual(tasksOf(w), ['47:lan']);
  assert.equal(Flow.isMat(), true);
  Flow.complete(Flow.state.tokens[0].id, Flow.mainChoice(47), null, { mode: 'soft' });
  assert.deepEqual(tasksOf(w), ['77:lan'], 'Mật → 77 dù chọn VOffice');
  assert.equal(Flow.state.history.filter((h) => String(h.task) === '75').length, 0);
  assert.deepEqual(plain([75, 76].map(Flow.taskStatus)), ['na', 'na']);
  assert.equal(Flow.taskStatus(78), 'todo');
  kdtStep(w, 77); kdtStep(w, 78);
  assert.deepEqual(tasksOf(w), ['48:tgd']);
  // Cảnh tua nhanh qua bước ký của hồ sơ Mật cũng đi 77 → 78.
  Flow.jumpTo(48, 'tgd', null, 'MS13', null, { secret: true });
  assert.deepEqual(plain(Flow.state.vars.kyLog.map((k) => [k.task, k.mode])), [[47, 'hard']]);
  assert.ok(Flow.state.history.some((h) => String(h.task) === '78' && h.who === 'minh'));
  // Lỗi gửi VOffice.
  go(11);
  kdtStep(w, 47);
  assert.deepEqual(tasksOf(w), ['76:lan'], 'lỗi gửi → việc Gửi lại cho người trình');
  assert.match(sysLog(w, 76)[0].action, /Lỗi gửi VOffice/);
  assert.equal(Flow.kdtStage(), 'KYCT');
  kdtStep(w, 76);
  assert.deepEqual(tasksOf(w), ['48:tgd']);
  // Nút không đồng ý của bước ký không đi qua khối.
  kdtStep(w, 48, 'Không đồng ý — chỉ đạo dừng');
  assert.equal(Flow.state.status, 'stopped');
  assert.equal(Flow.state.vars.ky, undefined);
});

// T18 B4 — tuyến Tập đoàn 63–74 (người dùng mở D-8, 12/10).
test('T18 B4: chủ trương thuộc Tập đoàn — 64 → 65 ký công văn (khối ký) → 66 → 67 → 68 → 69 → 70 (chưa đạt → 68) → 71 → 73 (không đồng ý → 68) → 74 → kết thúc hồ sơ CT; hồ sơ KĐT cấp VHT từ 49', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const bs = D.demoSets.find((d) => d.key === 'MS13').branches;
  const b = bs[9];
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
  kdtStep(w, 64);
  assert.deepEqual(tasksOf(w), ['65:tgd']);
  kdtStep(w, 65, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['64:minh'], 'TGĐ VHT không ký công văn → hoàn thiện công văn');
  kdtStep(w, 64); kdtStep(w, 65);
  // 65 đi qua khối ký chung (VOffice mặc định) → 66 chuyển hồ sơ (service) → 67 các Ban Tập đoàn.
  assert.deepEqual(tasksOf(w), ['67:td']);
  assert.deepEqual(plain(Flow.state.vars.kyLog.map((k) => [k.task, k.doc, k.mode])).slice(-1), [[65, 'Công văn trình Tập đoàn', 'soft']]);
  assert.match(sysLog(w, 66)[0].action, /gửi qua tích hợp VOffice/);
  assert.equal(Flow.kdtStage(), 'TDTD');
  assert.deepEqual(docsOf(w), ['CV-TD']);
  kdtStep(w, 67);
  assert.deepEqual(tasksOf(w), ['68:minh']);
  assert.equal(Flow.kdtStage(), 'TD');
  kdtStep(w, 68); kdtStep(w, 69);
  assert.deepEqual(tasksOf(w), ['70:td'], '69 ký trình lại qua khối ký, về 70');
  assert.deepEqual(docsOf(w), ['CV-TD', 'BM-06']);
  kdtStep(w, 70, 'Chưa đạt');
  assert.deepEqual(tasksOf(w), ['68:minh'], 'Ban ĐTXD trả trực tiếp ĐVĐX');
  kdtStep(w, 68); kdtStep(w, 69); kdtStep(w, 70);
  assert.deepEqual(tasksOf(w), ['71:td'], 'G34 chủ trương riêng → 71');
  kdtStep(w, 71);
  kdtStep(w, 73, 'Không đồng ý');
  assert.deepEqual(tasksOf(w), ['68:minh']);
  for (const n of [68, 69, 70, 71, 73]) kdtStep(w, n);
  // 74 lưu kết quả (BM-01 do TGĐ Tập đoàn ký) → G36 chủ trương → T45: kết thúc hồ sơ CT; hồ sơ KĐT tạo riêng, chạy từ 49 AI → 50.
  assert.match(sysLog(w, 74)[0].action, /BM-01 đã ký/);
  assert.deepEqual(docsOf(w), ['CV-TD', 'BM-06', 'BM-01']);
  assert.deepEqual(plain([Flow.state.status, Flow.kdtStage()]), ['approved', 'CT_OK']);
  assert.match(Flow.state.history.slice(-1)[0].action, /cấp Tập đoàn: chủ trương BM-01/);
  Flow.createKdtCase(Flow.state.kdt, { kind: 'KDT', parent: Flow.state.code });
  assert.deepEqual(tasksOf(w), ['50:minh']);
  assert.deepEqual(docsOf(w), ['CV-TD', 'BM-06', 'BM-01'], 'văn bản chủ trương kế thừa');
  assert.ok(Flow.kdtDocs().every((d) => d.inh === 'HS-2026-0032'));
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.kdtStage(), 'HS');
  // KĐT cấp VHT (KHCN, UQ-GUQ §1.2.1) → tua tiếp tới kết thúc qua 56 → 57 → 60.
  for (let i = 0; i < 80 && Flow.state.status === 'running'; i++) kdtStep(w, Flow.state.tokens[0].task);
  assert.equal(Flow.state.status, 'approved');
  assert.ok(Flow.state.history.some((h) => String(h.task) === '60' && h.who === 'tgd'), 'KĐT do TGĐ VHT ký');
  assert.match(Flow.state.history.slice(-1)[0].action, /^Kết thúc — Quyết định phê duyệt KĐT/);
  assert.deepEqual(plain([47, 48, 72, 60].map(Flow.taskStatus)), ['na', 'na', 'na', 'done']);
});

test('T18 B4: hồ sơ gộp thuộc Tập đoàn — 72 Ban ĐTXD lập BM-14 + dự thảo BM-18 → 73 → 74 → kết thúc cấp Tập đoàn; công văn ký bản cứng → 66 chuyển bộ hồ sơ giấy', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const bs = D.demoSets.find((d) => d.key === 'MS13').branches;
  const go = (i) => { const b = bs[i]; Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre); };
  go(15);
  assert.deepEqual(tasksOf(w), ['72:td']);
  assert.deepEqual(plain([Flow.state.vars.branch, Flow.state.vars.tdKind]), ['BM00', 'GOP']);
  kdtStep(w, 72); kdtStep(w, 73);
  assert.equal(Flow.state.status, 'approved');
  assert.match(Flow.state.history.slice(-1)[0].action, /hoàn tất phê duyệt cấp Tập đoàn: hồ sơ gộp BM-00/);
  assert.deepEqual(docsOf(w), ['CV-TD', 'BM-06', 'BM-00', 'BM-14', 'BM-18']);
  assert.ok(Flow.kdtDocs().filter((d) => d.td).every((d) => d.by === 74));
  assert.deepEqual(plain([61, 62, 71, 72, 73, 74].map(Flow.taskStatus)), ['na', 'na', 'na', 'done', 'done', 'done']);
  assert.equal(Flow.kdtStage(), 'OK');
  // Hồ sơ Mật: TGĐ VHT ký công văn bản cứng (77 → 78) → 66 ghi chuyển bộ hồ sơ giấy (P-99).
  Flow.jumpTo(65, 'tgd', null, 'MS13', null, { secret: true }, false, bs[9].pre);
  kdtStep(w, 65);
  assert.deepEqual(tasksOf(w), ['77:tgd']);
  kdtStep(w, 77); kdtStep(w, 78);
  assert.deepEqual(tasksOf(w), ['67:td']);
  assert.match(sysLog(w, 66)[0].action, /chuyển bộ hồ sơ giấy/);
});

test('T18 B4: chủ trương và KĐT đều thuộc Tập đoàn — lên Tập đoàn hai lần (71 rồi 72), mỗi lần đúng loại hồ sơ', () => {
  const w = boot(null);
  const { Flow } = w;
  const pre = { auth: [{ type: 'KHCN', field: '*', from: 0, to: null, ct: 'TD', kdt: 'TD', basis: 'thử' }] };
  Flow.jumpTo(73, 'td', null, 'MS13', null, null, false, pre);
  assert.equal(Flow.state.vars.tdKind, 'CT');
  kdtStep(w, 73);
  assert.equal(Flow.kdtStage(), 'CT_OK');
  Flow.createKdtCase(Flow.state.kdt, { kind: 'KDT', parent: Flow.state.code });
  assert.deepEqual(tasksOf(w), ['50:minh']);
  for (let i = 0; i < 60 && !Flow.state.tokens.some((t) => t.task === 64); i++) kdtStep(w, Flow.state.tokens[0].task);
  assert.deepEqual(plain([Flow.state.vars.tdKind, Flow.state.vars.tdKinds]), ['KDT', ['CT', 'KDT']], 'G27 KĐT Tập đoàn → 63 lần hai');
  for (const n of [64, 65, 67, 68, 69, 70]) kdtStep(w, n);
  assert.deepEqual(tasksOf(w), ['72:td'], 'G34: hồ sơ KĐT → 72');
  kdtStep(w, 72); kdtStep(w, 73);
  assert.equal(Flow.state.status, 'approved');
  assert.deepEqual(plain(Flow.state.vars.tdDocs.map((d) => [d.code, d.kind])), [['BM-01', 'CT'], ['BM-14', 'KDT'], ['BM-18', 'KDT']]);
  assert.deepEqual(plain([47, 48, 56, 60].map(Flow.taskStatus)), ['na', 'na', 'na', 'na']);
});

// T29 B16 — DX-10 (D-83): ba cấp chỉ huy duyệt trên ĐTMS; Kho, Thầu TTMS là tác nhân trên sơ đồ; MS02 giữ thứ tự cũ.
test('DX-10: 5 → 5.1 Chỉ huy ĐVĐX → 7 Kho → 7.1 Chỉ huy Kho → 8–10 Thầu → 10.1 Chỉ huy Thầu → 12 → 13 → 16 → 16.1 → 17; trả lại về đúng bước', () => {
  const w = boot();
  const { Flow } = w;
  const seen = [];
  const at = (k) => Flow.state.tokens.find((t) => String(t.task) === String(k));
  const go = (k, label) => kdtStep(w, k, label);
  let n = 0;
  while (!at(17) && n++ < 200) { const t = Flow.state.tokens[0]; seen.push([String(t.task), t.who]); kdtStep(w, t.task); }
  const order = seen.map(([k]) => k);
  const idx = (k) => order.indexOf(k);
  assert.ok(idx('5') < idx('5.1') && idx('5.1') < idx('7') && idx('7') < idx('7.1') && idx('7.1') < idx('8'), order.join(' '));
  assert.ok(idx('10') < idx('10.1') && idx('10.1') < idx('12') && idx('13') < idx('16') && idx('16') < idx('16.1'), order.join(' '));
  const who = Object.fromEntries(seen);
  assert.deepEqual([who['5.1'], who['7'], who['7.1'], who['8'], who['10'], who['10.1'], who['16.1']], ['hai', 'qlts', 'khoch', 'thau', 'thau', 'thauch', 'hai']);
  // Trả lại: 16.1 → 16; 10.1 → 10; 7.1 → 7; 5.1 → 5.
  // Review nhi 06/11 #7: 10.1 Chỉ huy Thầu dùng Đồng ý / Từ chối.
  const back = (k, to) => { const w2 = boot(); w2.Flow.jumpTo(k, 'minh'); kdtStep(w2, k, k === '10.1' ? 'Từ chối' : 'Trả lại'); assert.ok(w2.Flow.state.tokens.some((t) => String(t.task) === String(to)), `${k} trả lại → ${to}`); };
  back('5.1', 5); back('7.1', 7); back('10.1', 10); back('16.1', 16);
});

test('DX-10 (b): người khởi tạo là Chỉ huy ĐVĐX → bỏ qua 5.1 (không áp dụng); MS02 không có bước DX-10', () => {
  const w = boot();
  const { Flow } = w;
  Flow.state.vars.creatorCh = true;
  runUntil(w, 7);
  assert.ok(!Flow.state.history.some((h) => String(h.task) === '5.1'), 'không qua 5.1');
  assert.equal(Flow.taskStatus('5.1'), 'na');
  const a = w.D.flows.MS02;
  for (const k of ['5.1', '7.1', '10.1', '16.1', 'g5']) assert.equal(a[k], undefined, `MS02 không có ${k}`);
  assert.equal(a[7].who, 'minh');
  assert.equal(a[16].next, 17);
});

// T45 (D-103, D-104): KĐT có hai loại hồ sơ — Hồ sơ phê duyệt chủ trương (kind CT) và Hồ sơ phê duyệt KĐT (kind KDT); KĐT nhiều đề tài / dự án.
function bootKdtJs(w) {
  // kdt.js chỉ cần UI khi vẽ màn — meta / KDT_STAGE đọc được với UI giả.
  w.UI = {};
  const ctx = vm.createContext({ window: w, document: { addEventListener() {} } });
  vm.runInContext(readFileSync(new URL('kdt.js', dir), 'utf8'), ctx, { filename: 'kdt.js' });
  return w.Kdt;
}
test('T45: hồ sơ CT 0032 chạy 1 → 48 kết thúc → KĐT Đã phê duyệt chủ trương; kdtCtChoices; hồ sơ KĐT chạy từ 49 kế thừa biến, tới 60 → KĐT Đã phê duyệt', () => {
  const w = boot(null);
  const { Flow, D } = w;
  Flow.jumpTo('CT_END', 'tgd', null, 'MS13', D.kdtCode0);
  assert.deepEqual(plain([Flow.state.code, Flow.state.status, Flow.kdtStage(), Flow.ci().kind, Flow.ci().scope]), ['HS-2026-0032', 'approved', 'CT_OK', 'CT', 'CT']);
  assert.ok(!Flow.state.history.some((h) => Number(h.task) >= 49 && Number(h.task) <= 60), 'hồ sơ CT không đi qua 49–60');
  assert.deepEqual(docsOf(w), ['BM-01']);
  const live = Flow.kdtCases().find((c) => c.code === 'HS-2026-0032');
  assert.deepEqual(plain([live.kind, live.scope, live.st, live.stage]), ['CT', 'CT', 'done', 'CT_OK']);
  const K = bootKdtJs(w);
  assert.deepEqual(plain(K.KDT_STAGE.CT_OK), ['Đã phê duyệt chủ trương', 'success']);
  let m = K.meta(Flow.findKdt(D.kdtCode0));
  assert.deepEqual(plain([m.stage, m.approved, m.ct.code, m.kdt, m.main.code]), ['CT_OK', false, 'HS-2026-0032', null, 'HS-2026-0032']);
  assert.deepEqual(plain(Flow.kdtCtChoices(D.kdtCode0).map((c) => c.code)), ['HS-2026-0032']);
  const vars = plain(Flow.state.vars), clock = Flow.state.clock;
  const code = Flow.createKdtCase(D.kdtCode0, { kind: 'KDT', parent: 'HS-2026-0032', est: 118.5 });
  assert.equal(code, 'HS-2026-0032-2');
  assert.deepEqual(tasksOf(w), ['50:minh']);
  const ci = Flow.ci();
  assert.deepEqual(plain([ci.kind, ci.parent, ci.luongCt, ci.est, ci.lech, ci.total]), ['KDT', 'HS-2026-0032', 'MS13', 118.5, null, 118.5]);
  for (const k of ['factors', 'cap', 'group', 'branch', 'chk', 'meet']) assert.deepEqual(plain(Flow.state.vars[k]), vars[k], `kế thừa biến ${k}`);
  assert.ok(Flow.state.clock >= clock, 'đồng hồ tiếp nối hồ sơ CT');
  assert.equal(Flow.lastOf(48).inh, 'HS-2026-0032', 'lịch sử chủ trương kế thừa (bước 50 đọc ký chủ trương 48)');
  // Hồ sơ CT đóng băng kèm bản chụp; đã có hồ sơ KĐT trỏ tới → không còn chọn được.
  const ct = Flow.state.kdtCases.find((c) => c.code === 'HS-2026-0032');
  assert.ok(ct.snap && ct.snap.vars.group === 'MS13');
  assert.deepEqual(plain(Flow.kdtCtChoices(D.kdtCode0)), []);
  assert.throws(() => Flow.createKdtCase(D.kdtCode0, { kind: 'KDT', parent: 'HS-2026-0032' }), /không hợp lệ/);
  for (let i = 0; i < 80 && Flow.state.status === 'running'; i++) kdtStep(w, Flow.state.tokens[0].task);
  assert.deepEqual(plain([Flow.state.status, Flow.kdtStage()]), ['approved', 'OK']);
  assert.match(Flow.state.history.slice(-1)[0].action, /Quyết định phê duyệt KĐT/);
  m = K.meta(Flow.findKdt(D.kdtCode0));
  assert.deepEqual(plain([m.stage, m.approved, m.ct.code, m.kdt.code, m.main.code, m.value]), ['OK', true, 'HS-2026-0032', 'HS-2026-0032-2', 'HS-2026-0032-2', 118.5]);
});

test('T45: gộp BM-00 (0031) 62 → KĐT Đã phê duyệt, scope CT_KDT, không tạo được hồ sơ KĐT; cảnh K7 / K8 / K10 đi qua hồ sơ CT đã duyệt; Tập đoàn 74 → kết thúc CT', () => {
  const w = boot(null);
  const { Flow, D } = w;
  Flow.jumpTo('END', 'tgd', null, 'MS13', 'KĐT-2026-0031');
  assert.deepEqual(plain([Flow.state.code, Flow.state.status, Flow.kdtStage(), Flow.ci().scope, Flow.state.kdtKind]), ['HS-2026-0031', 'approved', 'OK', 'CT_KDT', 'CT']);
  assert.deepEqual(plain(Flow.kdtCtChoices('KĐT-2026-0031')), []);
  assert.throws(() => Flow.createKdtCase('KĐT-2026-0031', { kind: 'KDT', parent: 'HS-2026-0031', est: 12.4 }), /không hợp lệ/);
  const K = bootKdtJs(w);
  const m = K.meta(Flow.findKdt('KĐT-2026-0031'));
  assert.deepEqual(plain([m.stage, m.approved, m.ct.scope, m.kdt]), ['OK', true, 'CT_KDT', null]);
  for (const [n, task, code] of [['K7', 50, 'HS-2026-0032-2'], ['K8', 56, 'HS-2026-0032-2'], ['K6', 47, 'HS-2026-0032']]) {
    Flow.jumpToScene(n, 'MS13');
    assert.deepEqual(plain([Flow.state.code, Flow.state.tokens.map((t) => t.task)]), [code, [task]], `cảnh ${n}`);
  }
  Flow.jumpToScene('K10', 'MS13');
  assert.deepEqual(plain([Flow.state.code, Flow.state.kdtKind, Flow.state.ctParent, Flow.kdtStage()]), ['HS-2026-0032-2', 'KDT', 'HS-2026-0032', 'OK']);
  assert.deepEqual(plain(Flow.kdtCases().filter((c) => c.kdt === D.kdtCode0).map((c) => [c.code, c.kind, c.st, c.stage])),
    [['HS-2026-0032-2', 'KDT', 'done', 'OK'], ['HS-2026-0032', 'CT', 'done', 'CT_OK']]);
  const b = D.demoSets.find((d) => d.key === 'MS13').branches.find((x) => /kết thúc hồ sơ chủ trương/.test(x.name));
  Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
  kdtStep(w, 73);
  assert.deepEqual(plain([Flow.state.status, Flow.kdtStage(), Flow.state.code]), ['approved', 'CT_OK', 'HS-2026-0032']);
});

test('T45: kdtLuong theo ngưỡng KĐT — MS13 / MS14 / MS15; hồ sơ KĐT vượt ngưỡng → MS14 bản ghi tĩnh bước 46 có lech; MS15 → lỗi', () => {
  const w = boot(null);
  const { Flow, D } = w;
  const vt = { field: 'VTCNTT', nature: 'TICH_HOP' }, kh = { field: 'KHAC', nature: 'TICH_HOP' };
  assert.deepEqual(plain([[vt, 159.9], [vt, 160], [vt, 999], [vt, 1000], [kh, 89], [kh, 90], [kh, 500], [{ field: 'QP' }, 10]].map(([k, v]) => Flow.kdtLuong(k, v))),
    ['MS13', 'MS14', 'MS14', 'MS15', 'MS13', 'MS14', 'MS15', 'MS14']);
  Flow.jumpTo('CT_END', 'minh', null, 'MS13', D.kdtCode0);
  assert.deepEqual(plain([120, 160].map((v) => Flow.kdtLuong(D.kdtCode0, v))), ['MS13', 'MS14'], 'nhận mã KĐT');
  assert.throws(() => Flow.createKdtCase(D.kdtCode0, { kind: 'KDT', parent: 'HS-2026-0032', est: 1200 }), /MS15/);
  assert.equal(Flow.state.code, 'HS-2026-0032', 'MS15 chặn: hồ sơ CT vẫn là hồ sơ đang mở');
  const code = Flow.createKdtCase(D.kdtCode0, { kind: 'KDT', parent: 'HS-2026-0032', est: 175, reason: 'Bổ sung hạng mục' });
  assert.equal(code, 'HS-2026-0032-2');
  const rec = Flow.kdtCases().find((c) => c.code === code);
  assert.deepEqual(plain([rec.kind, rec.parent, rec.flow, rec.st, rec.task, rec.stage, rec.est, rec.luongCt, rec.lech]),
    ['KDT', 'HS-2026-0032', 'MS14', 'processing', 46, 'HS', 175, 'MS13', { from: 'MS13', to: 'MS14', reason: 'Bổ sung hạng mục' }]);
  assert.equal(Flow.state.status, 'new', 'MS14 tĩnh: không còn hồ sơ chạy luồng');
  assert.equal(Flow.kdtCases().filter((c) => c.code === 'HS-2026-0032').length, 1, 'hồ sơ CT đóng băng một bản');
  assert.deepEqual(plain(Flow.kdtCtChoices(D.kdtCode0)), []);
  const s = D.kdtCases.find((c) => c.lech);
  assert.deepEqual(plain([s.code, s.parent, s.flow, s.task, s.lech.from, s.lech.to]), ['HS-2026-0026-2', 'HS-2026-0026', 'MS14', 46, 'MS13', 'MS14']);
  assert.ok(s.lech.reason);
});

test('T45: dữ liệu mẫu — mỗi hồ sơ là CT hoặc KDT; KDT có parent CT Hoàn thành cùng KĐT, mã -2; KĐT nhiều đề tài (nvs), dòng bóc tách có nv; việc mẫu trỏ mã có thật; menu tách hai danh sách', { todo: 'T77 S4 cách ly: HS-2026-0038 CT vượt giới hạn ≤ 48 — dữ liệu mẫu T58' }, () => {
  const w = boot(null);
  const { Flow, D } = w;
  for (const c of D.kdtCases) {
    assert.ok(['CT', 'KDT'].includes(c.kind), c.code);
    if (c.kind === 'CT') assert.equal(c.scope, c.branch === 'BM00' ? 'CT_KDT' : 'CT', `${c.code} scope`);
    else {
      const p = D.kdtCases.find((x) => x.code === c.parent);
      assert.ok(p && p.kind === 'CT' && p.st === 'done' && p.scope === 'CT' && p.kdt === c.kdt, `${c.code} parent`);
      assert.equal(c.code, c.parent + '-2');
      assert.equal(c.luongCt, p.flow);
      assert.ok(c.est != null && 'lech' in c);
      if (c.lech) assert.notEqual(c.lech.from, c.lech.to); else assert.equal(c.flow, c.luongCt);
    }
    if (c.kind === 'CT' && c.st === 'processing' && c.flow !== 'MS14' && c.scope === 'CT') assert.ok((c.task || 0) <= 48, `${c.code} CT ≤ 48`);
  }
  for (const t of D.sampleKdtTasks) {
    const c = D.kdtCases.find((x) => x.code === t.code);
    assert.ok(c, t.code);
    assert.equal(c.kind === 'KDT', t.task >= 49 && t.task <= 60, `${t.code} bước ${t.task}`);
  }
  for (const x of Flow.kdtAll()) { assert.ok(Array.isArray(x.nvs) && x.nvs.length >= 1, x.code); assert.equal(x.nv, x.nvs[0]); }
  assert.ok(D.kdtList.some((x) => x.nvs.length > 1));
  assert.deepEqual(plain(D.kdtDemo.nvs), ['DT-KHCN-2027-002', '009-26-VHT-RDP-DS']);
  assert.deepEqual(plain([...new Set(D.kdtDemo.cost.map((c) => c.nv))]), plain(D.kdtDemo.nvs));
  for (const x of [D.kdtDemo].concat(D.kdtList.filter((k) => k.cost))) for (const c of x.cost) assert.ok(x.nvs.includes(c.nv) && c.line.startsWith(c.nv + '-'), `${x.code} ${c.line}`);
  const code = Flow.createKdt({ title: 'KĐT nhiều đề tài', nvs: ['NV-KHCN-2026-014', 'DA-2026-002'] });
  assert.equal(Flow.findKdt(code).nv, 'NV-KHCN-2026-014');
  Flow.updateKdt(code, { nvs: ['DA-2026-002'] });
  assert.equal(Flow.findKdt(code).nv, 'DA-2026-002');
  Flow.updateKdt('KĐT-2026-0029', { nv: 'DA-2026-002' });
  assert.deepEqual(plain(Flow.findKdt('KĐT-2026-0029').nvs), ['DA-2026-002']);
  // Kiểu gọi cũ createKdtCase({ kdt, name }) vẫn tạo hồ sơ CT.
  assert.equal(Flow.createKdtCase({ kdt: 'KĐT-2026-0033' }), 'HS-2026-0033');
  assert.equal(Flow.state.kdtKind, 'CT');
  const menu = JSON.stringify(D.menu);
  assert.ok(menu.includes('"ho-so-ct-kdt"') && menu.includes('"ho-so-pd-kdt"') && !menu.includes('"ho-so-kdt"'));
});
