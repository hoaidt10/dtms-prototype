// Kiểm tra nền của luồng Hợp đồng (T25 B0): trích 7 trang BPMN, kho hồ sơ con (D-47), khối ký dùng chung (D-50), vai mới (D-51).
// Chạy: node --test prototype/dtms/test/hop-dong.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('../js/', import.meta.url);
const PAGES = [['ms22', 'MS22', 'MS22', 13], ['ms23', 'MS23', 'MS23 - Tổng quan', 5], ['ms23-01', 'MS23.01', 'MS23.01', 12], ['ms23-02', 'MS23.02', 'MS23.02', 22],
  ['ms23-03', 'MS23.03', 'MS23.03', 14], ['ms23-04', 'MS23.04', 'MS23.04', 14], ['ms24', 'MS24', 'MS24', 20]];

function boot(store = {}) {
  const window = {};
  const ctx = vm.createContext({
    window,
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
    console,
  });
  const files = ['bpmn-tasks.js', 'bpmn-tasks-ms13.js', 'bpmn-tasks-ms02.js', ...PAGES.map((p) => `bpmn-tasks-${p[0]}.js`), ...PAGES.map((p) => `bpmn-diagram-${p[0]}.js`), 'data.js', 'flow.js'];
  for (const f of files) vm.runInContext(readFileSync(new URL(f, dir), 'utf8'), ctx, { filename: f });
  window.Flow.init();
  return window;
}

/* Luồng thử: hai bước người, một bước của nhà thầu; khối ký có VContract. Luồng thật dựng ở các bước sau, test này chỉ kiểm cơ chế của engine. */
function stub(w) {
  w.D.flows.MS22 = {
    1: { who: 'phd', nlv: 0.5, choices: [{ label: 'Trình', to: 2, main: true }, { label: 'Ký', sign: 'Hợp đồng', to: 3 }] },
    2: { who: 'tphd', nlv: 0.5, next: 3 },
    3: { who: 'phd', nlv: 0.5, external: 'Nhà thầu', next: 'END' },
    4: { vo: 'VContract', next: 5 },
    5: { gw: true, kyReturn: true },
    6: { who: 'ky:signer', nlv: 0.5, next: 5 },
  };
  w.D.flows.MS24 = { 1: { who: 'tckt', nlv: 0.5, next: 'END' } };
  w.D.kyConf.MS22 = { choose: 9, soft: 4, hard: 6, vcontract: 4 };
}
const plain = (x) => JSON.parse(JSON.stringify(x));
const tok = (w) => w.Flow.state.tokens[0];
const done = (w, label) => {
  const t = tok(w), f = w.Flow.def()[t.task];
  w.Flow.complete(t.id, label ? f.choices.find((c) => c.label === label) : null);
};

test('Trích đủ 7 trang Hợp đồng: số bước theo diễn giải, hình vẽ đúng tỉ lệ', () => {
  const w = boot();
  for (const [, key, page, n] of PAGES) {
    const f = w.BPMN_FLOWS[key], g = w.BPMN_DIAGRAMS[page];
    assert.equal(f.page, page);
    assert.equal(Object.keys(f.tasks).length, n, `${key}: số bước`);
    for (let i = 1; i <= n; i++) assert.ok(g.nodes.some((x) => x.k === 'task' && x.t === String(i)), `${key}: hình bước ${i}`);
    // Mũi tên treo trong bản vẽ không được kéo khung hình ra xa (DG-MS23.02 §D 16).
    assert.ok(g.box[2] < 20000 && g.box[3] < 6000, `${key}: khung ${g.box}`);
    for (const e of g.edges) for (const p of e.p) assert.ok(Number.isFinite(p[0]) && Number.isFinite(p[1]), `${key}: toạ độ mũi tên`);
  }
});

test('MS22: mũi tên khớp DG-MS22 §B.2 (song song 2 ‖ 3, AI về 6 / 7, trả về bước 9)', () => {
  const { edges: e, gateways: g } = boot().BPMN_FLOWS.MS22;
  const has = (a, b, re) => e.some((x) => String(x[0]) === String(a) && String(x[1]) === String(b) && (!re || re.test(x[2])));
  assert.equal(g.G1.kind, 'and');
  assert.ok(has('G1', 2) && has('G1', 3) && has('G2', 4));
  assert.ok(has('G3', 8, /^OK/) && has('G3', 'G4', /Not OK/));
  assert.ok(has('G4', 6, /Có/) && has('G4', 7, /Không/) && has(6, 5) && has(7, 5));
  assert.ok(has('G6', 11, /Có/) && has('G6', 9, /Không/) && has(13, 'E1'));
});

test('Cổng các trang Hợp đồng có câu hỏi; chấm trang trí không thành sự kiện', () => {
  const w = boot();
  assert.equal(w.BPMN_FLOWS['MS23.01'].gateways.G1.name, 'Là sửa đổi hợp đồng?');
  assert.equal(w.BPMN_FLOWS.MS24.gateways.G1.name, 'Hồ sơ đủ căn cứ?');
  for (const [, key] of PAGES) assert.ok(!Object.values(w.BPMN_FLOWS[key].events).some((x) => x.name === 'USER TASK'), key);
});

test('Vai mới D-51: có tài khoản, không có tài khoản Nhà thầu', () => {
  const { D } = boot();
  for (const id of ['phd', 'tphd', 'dvsd', 'qlts', 'tckt', 'vthu']) assert.ok(D.personas.some((p) => p.id === id), id);
  assert.ok(!D.personas.some((p) => /Nhà thầu|Nhà cung cấp/.test(p.role)));
  assert.equal(new Set(D.personas.map((p) => p.id)).size, D.personas.length);
  assert.equal(D.familyOf('MS23.02'), 'MS23.02');
  assert.equal(D.familyOf('MS01.01'), 'MS01');
});

test('D-47: hồ sơ con chạy song song, không đụng hồ sơ đang chạy ở luồng chính', () => {
  const w = boot();
  stub(w);
  const { Flow, D } = w;
  Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' });
  const main = Flow.state.code, caseInfo = D.caseInfo;
  assert.ok(!Flow.inCase());
  Flow.setPersona('phd');

  Flow.startCase('MS22', { code: 'HS-HD-1', parent: 'HĐ-2026-0052' });
  assert.ok(Flow.inCase());
  assert.equal(Flow.state.code, 'HS-HD-1');
  assert.equal(Flow.state.persona, 'phd', 'vai đi theo');
  assert.equal(tok(w).task, 1);
  Flow.startCase('MS24', { code: 'TT-1', parent: 'HĐ-2026-0052' });
  assert.equal(Flow.state.code, 'TT-1');
  assert.equal(tok(w).who, 'tckt');

  // Hai hồ sơ con giữ tiến độ riêng; việc kèm mã hồ sơ.
  assert.ok(Flow.openCase('HS-HD-1'));
  done(w, 'Trình');
  assert.equal(tok(w).task, 2);
  assert.ok(Flow.openCase('TT-1'));
  assert.equal(tok(w).task, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(Flow.caseTokens('tphd').map((t) => [t.caseCode, t.task]))), [['HS-HD-1', 2]]);
  assert.equal(Flow.caseTokens('admin').length, 2);
  assert.equal(Flow.cases('HĐ-2026-0052').length, 2);
  assert.equal(Flow.cases('HĐ-khác').length, 0);
  assert.equal(Flow.openCase('không có'), false);

  // Về luồng chính: đúng hồ sơ, đúng dữ liệu mẫu, việc của hồ sơ con không lẫn vào tokensFor.
  Flow.setPersona('minh');
  Flow.toMain();
  assert.ok(!Flow.inCase());
  assert.equal(Flow.state.code, main);
  assert.equal(Flow.state.persona, 'minh');
  assert.equal(D.caseInfo, caseInfo);
  assert.ok(Flow.state.tokens.every((t) => String(t.task) === '1'));
  assert.equal(Flow.tokensFor('tphd').length, 0);
});

test('D-47: tải lại trang giữ cả luồng chính và hồ sơ con; Reset luồng xoá hồ sơ con', () => {
  const store = {};
  let w = boot(store);
  stub(w);
  w.Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' });
  const main = w.Flow.state.code;
  w.Flow.startCase('MS22', { code: 'HS-HD-1', parent: 'HĐ-2026-0052' });
  done(w, 'Trình');

  w = boot(store);
  stub(w);
  assert.ok(!w.Flow.inCase(), 'khởi động ở luồng chính');
  assert.equal(w.Flow.state.code, main);
  assert.ok(w.Flow.openCase('HS-HD-1'));
  assert.equal(tok(w).task, 2);
  assert.equal(tok(w).who, 'tphd');

  w.Flow.reset();
  assert.ok(!w.Flow.inCase());
  assert.equal(w.Flow.cases().length, 0);
  assert.equal(store['dtms-proto-cases-v1'], undefined);
  assert.equal(w.Flow.state.status, 'new');
});

test('D-47: nhảy cảnh demo khi đang ở hồ sơ con thì về luồng chính, hồ sơ con còn nguyên', () => {
  const w = boot();
  stub(w);
  w.Flow.startCase('MS22', { code: 'HS-HD-1', parent: 'HĐ-2026-0052' });
  const set = w.D.demoSets[0];
  w.Flow.jumpToScene(set.scenes[1].n, set.key);
  assert.ok(!w.Flow.inCase());
  assert.ok(w.Flow.state.vars.process.startsWith('MS01'));
  assert.ok(w.Flow.caseOf('HS-HD-1'));
});

test('D-50: khối ký dùng chung — VContract, Mật buộc bản cứng; bước nhà thầu chỉ ghi nhận', () => {
  const w = boot();
  stub(w);
  const { Flow } = w;
  Flow.startCase('MS22', { code: 'HS-KY', parent: 'HĐ-2026-0052' });
  const sign = Flow.def()[1].choices[1];

  Flow.complete(tok(w).id, sign, null, { mode: 'vcontract' });
  assert.equal(Flow.state.vars.kyLog[0].mode, 'vcontract');
  assert.ok(Flow.state.history.some((h) => String(h.task) === '9' && /VContract$/.test(h.action)));
  assert.ok(Flow.state.history.some((h) => String(h.task) === '4' && /^Trình ký VContract Hợp đồng/.test(h.action)));
  assert.equal(tok(w).task, 3, 'xong khối ký về đúng đích của nút');

  done(w);
  const h = Flow.state.history.find((x) => String(x.task) === '3');
  assert.equal(h.party, 'Nhà thầu');
  assert.equal(h.who, 'phd');

  // Lỗi gửi VContract: token dừng ở bước gửi cho người trình, như Gửi lại của VOffice.
  Flow.startCase('MS22', { code: 'HS-KY2', parent: 'HĐ-2026-0052' });
  Flow.setUi('voFail', true);
  Flow.complete(tok(w).id, sign, null, { mode: 'vcontract' });
  assert.equal(tok(w).task, 4);
  assert.ok(Flow.state.history.some((x) => /^Lỗi gửi VContract/.test(x.action)));

  // Hồ sơ Mật: dù chọn VContract vẫn bản cứng, không ghi bước chọn hình thức.
  Flow.startCase('MS22', { code: 'HS-KY3', parent: 'HĐ-2026-0052' });
  Flow.setUi('secret', true);
  Flow.complete(tok(w).id, sign, null, { mode: 'vcontract' });
  assert.equal(tok(w).task, 6);
  assert.equal(tok(w).who, 'phd');
  assert.ok(!Flow.state.history.some((x) => String(x.task) === '9'));

  // Quy trình không khai báo khối ký: nút có `sign` đi thẳng như cũ.
  assert.equal(w.D.kyConf.MS01, undefined);
  assert.equal(w.D.kyConf.MS02, undefined);
});

/* ---------- T25 B1: luồng MS22 thật ---------- */
const startReal = (w) => w.Flow.startCase('MS22', { code: w.D.hdCaseCode('HĐ-2026-0052'), parent: 'HĐ-2026-0052', clock: w.D.hdCaseClock });
const realStep = (w, task, label) => {
  const t = w.Flow.state.tokens.find((x) => String(x.task) === String(task));
  assert.ok(t, `phải có việc ở bước ${task}, đang có ${w.Flow.state.tokens.map((x) => x.task)}`);
  const f = w.Flow.def()[t.task];
  w.Flow.complete(t.id, f.choices ? (label ? w.Flow.choices(t.task).find((c) => c.label.startsWith(label)) : w.Flow.mainChoice(t.task)) : null, 'lý do');
};
const at = (w) => w.Flow.state.tokens.map((t) => Number(t.task)).sort((a, b) => a - b);

test('MS22: 13 bước đều có cấu hình; mọi đích tồn tại; bước người có who, scr', () => {
  const w = boot();
  const A = w.D.flows.MS22, T = w.BPMN_FLOWS.MS22.tasks;
  for (let n = 1; n <= 13; n++) {
    assert.ok(A[n], `thiếu bước ${n}`);
    if (T[n].type !== 'service') assert.ok(A[n].who && A[n].scr, `bước ${n}`);
  }
  assert.equal(T[5].type, 'service');
  for (const [k, f] of Object.entries(A)) {
    for (const d of [f.next, ...(f.choices || []).map((c) => c.to), ...(f.forkTo || []).map((b) => b.task)].filter((x) => x != null)) assert.ok(d === 'END' || A[d], `${k} → ${d}`);
  }
});

test('MS22 nhánh chính: 1 → 2 ‖ 3 → 4 → AI Not OK → 6 → AI OK → 8 → 9 → 10 → 11 → 12 → 13 → kết thúc; mã việc kèm mã hồ sơ', () => {
  const w = boot();
  const { Flow } = w;
  startReal(w);
  assert.equal(Flow.ci().isHd, true);
  assert.equal(Flow.ci().dxms, 'HĐ-2026-0052');
  assert.ok(Flow.state.tokens[0].id.startsWith('HSHD-2026-0052:k'));
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [2, 3]);
  assert.equal(Flow.state.tokens.find((t) => t.task === 2).who, 'dvsd');
  realStep(w, 3);
  assert.deepEqual(plain(at(w)), [2], 'chờ đủ hai nhánh');
  realStep(w, 2);
  assert.deepEqual(plain(at(w)), [4]);
  realStep(w, 4);
  assert.deepEqual(plain(at(w)), [6], 'bảo hành 18 tháng < HSMT → thống nhất lại');
  assert.equal(Flow.state.vars.aiHd.ok, false);
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [8], 'AI kiểm tra lại đạt');
  assert.equal(Flow.state.vars.aiHd.lan, 2);
  for (const n of [8, 9, 10, 11, 12]) realStep(w, n);
  assert.equal(Flow.state.vars.hdSign, 'VC');
  realStep(w, 13);
  assert.equal(Flow.state.status, 'approved');
  assert.ok(Flow.state.history.some((h) => /hợp đồng đã ký đầy đủ/.test(h.action)));
  assert.equal(Flow.state.history.find((h) => String(h.task) === '13').party, 'Nhà thầu / Nhà cung cấp');
  assert.equal(Flow.taskStatus(7), 'cond', 'bước 7 chỉ chạy khi có phát sinh');
  assert.equal(Flow.taskStatus(6), 'done');
});

test('MS22 nhánh: thiếu mã hàng → 7; Trưởng phòng trả về 6 / 7; Thủ trưởng không đồng ý → 9; Ghi nhận chưa ký ở lại 13', () => {
  const w = boot();
  const { Flow } = w;
  const set = w.D.demoSets.find((d) => d.key === 'MS22');
  const jump = (b) => Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
  jump(set.branches[0]);
  assert.deepEqual(plain(at(w)), [7]);
  Flow.setUi('hdMissingCode', false);
  realStep(w, 7);
  assert.deepEqual(plain(at(w)), [8], 'đủ mã hàng, bảo hành 24 → đạt');

  jump(set.branches[1]);
  realStep(w, 8, 'Trả chỉnh sửa — sửa nội bộ');
  assert.deepEqual(plain(at(w)), [7]);
  realStep(w, 7);
  assert.deepEqual(plain(at(w)), [8], 'quay lại AI rồi trình lại');

  jump(set.branches[2]);
  realStep(w, 8, 'Trả chỉnh sửa — thống nhất');
  assert.deepEqual(plain(at(w)), [6]);

  jump(set.branches[3]);
  realStep(w, 10, 'Không đồng ý');
  assert.deepEqual(plain(at(w)), [9]);

  jump(set.branches[4]);
  realStep(w, 13, 'Ghi nhận chưa ký');
  assert.deepEqual(plain(at(w)), [13]);
  assert.equal(Flow.state.status, 'running');
});

test('Bộ demo MS22: mọi cảnh đúng việc, đúng vai; luồng chính giữ nguyên; cảnh 1 xoá hồ sơ', () => {
  const w = boot();
  const { Flow, D } = w;
  Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' });
  const main = Flow.state.code;
  const set = D.demoSets.find((d) => d.key === 'MS22');
  for (const s of set.scenes) {
    Flow.jumpToScene(s.n, 'MS22');
    assert.equal(Flow.demoSet().key, 'MS22', s.n);
    if (s.start === 'NEW') { assert.equal(Flow.cases().length, 0); assert.equal(Flow.state.code, main); continue; }
    if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', s.n); continue; }
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}`);
    assert.equal(Flow.state.persona, s.who);
  }
  Flow.focus('viec-cua-toi');
  assert.equal(Flow.state.code, main);
  Flow.focus('task/HSHD-2026-0052:k1');
  assert.equal(Flow.state.code, 'HSHD-2026-0052');
  Flow.focus('ho-so-hd/không-có');
  assert.equal(Flow.state.code, main);
});

/* ---------- T25 B2: MS23 Tổng quan ---------- */
const CODE23 = 'HSTD-2026-0052', HD = 'HĐ-2026-0052';
const toSigned = (w) => { w.Flow.jumpToScene('T1', 'MS23'); w.Flow.toMain(); };
const trk = (w) => w.Flow.caseOf(CODE23).vars;

test('MS23: mã hồ sơ theo quy trình; MS22 kết thúc tự sinh hồ sơ theo dõi, S vẫn là hồ sơ MS22', () => {
  const w = boot();
  const { Flow, D } = w;
  assert.equal(D.hdCaseCode(HD), 'HSHD-2026-0052');
  assert.equal(D.hdCaseCode(HD, 'MS23'), CODE23);
  w.Flow.jumpToScene('H10', 'MS22');
  assert.equal(Flow.state.code, 'HSHD-2026-0052');
  assert.equal(Flow.state.status, 'approved');
  const c = Flow.caseOf(CODE23);
  assert.equal(c.status, 'running', 'không có sự kiện kết thúc chung');
  assert.equal(c.tokens.length, 0, 'bước 1 là service task');
  assert.equal(c.parent, HD);
  assert.deepEqual(plain(c.vars.track.ms.map((m) => m.kind)), ['GIAO', 'GIAO', 'NT']);
  assert.equal(c.vars.track.ms.reduce((s, m) => s + m.rate, 0), 100, 'khối lượng mốc đủ 100%');
  assert.ok(c.history.some((h) => String(h.task) === '1' && h.system));
  // Chạy lại cảnh đầu của MS22: xoá cả hồ sơ theo dõi.
  Flow.jumpToScene('H1', 'MS22');
  assert.equal(Flow.cases(HD).length, 0);
});

test('MS23: 5 bước có cấu hình; chỉ bước 3 là việc của người; bước service kết thúc nhánh', () => {
  const w = boot();
  const A = w.D.flows.MS23, T = w.BPMN_FLOWS.MS23.tasks;
  for (let n = 1; n <= 5; n++) assert.ok(A[n], `thiếu bước ${n}`);
  assert.deepEqual(plain(Object.keys(T).filter((n) => T[n].type !== 'service')), ['3']);
  assert.equal(A[3].who, 'phd');
  assert.equal(A[3].next, 4);
  for (const n of [1, 2, 4, 5]) assert.ok(A[n].stop, `bước ${n}`);
});

test('MS23: sự kiện độc lập, bấm thứ tự nào cũng được; S trả về đúng chỗ', () => {
  const w = boot();
  const { Flow } = w;
  Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' });
  const main = Flow.state.code;
  assert.equal(Flow.hdEvent(HD, 2), false, 'chưa ký thì chưa có hồ sơ theo dõi');
  toSigned(w);
  // Biên bản đến trước: cập nhật mốc giao kế tiếp mà không cần nhắc hay thông báo trước.
  assert.ok(Flow.hdEvent(HD, 5, { loai: 'biên bản bàn giao', kind: 'GIAO' }));
  assert.equal(Flow.state.code, main, 'về luồng chính');
  const ms = () => trk(w).track.ms;
  assert.equal(ms()[0].actual, ms()[0].plan);
  assert.equal(ms()[1].actual, null);
  // Nhắc chọn mốc giao chưa hoàn thành.
  Flow.hdEvent(HD, 2);
  assert.equal(trk(w).reminds[0].ms, ms()[1].name);
  Flow.hdEvent(HD, 5, { loai: 'biên bản bàn giao', kind: 'GIAO' });
  Flow.hdEvent(HD, 2);
  assert.equal(trk(w).reminds.length, 1, 'hết mốc giao thì không gửi nhắc');
  Flow.hdEvent(HD, 5, { loai: 'biên bản bàn giao', kind: 'GIAO' });
  assert.ok(/Không có mốc tương ứng/.test(trk(w).trackLog.at(-1)[2]), 'không có mốc thì không cập nhật');
  Flow.hdEvent(HD, 'S4', { flow: 'MS23.03' });
  assert.equal(trk(w).triggers[0].flow, 'MS23.03');
  assert.equal(Flow.caseOf(CODE23).status, 'running');
});

test('MS23: thông báo giao hàng tạo việc Phòng Hợp đồng; ghi nhận xong thông báo bộ phận, xoá dữ liệu nháp, làm được nhiều lần', () => {
  const w = boot();
  const { Flow } = w;
  toSigned(w);
  Flow.hdEvent(HD, 3);
  const tk = Flow.caseTokens('phd', HD);
  assert.deepEqual(plain(tk.map((t) => [t.caseCode, t.task])), [[CODE23, 3]]);
  assert.ok(tk[0].id.startsWith(CODE23 + ':k'));
  assert.equal(Flow.pendingCount('phd'), 1);
  Flow.focus('task/' + tk[0].id);
  assert.equal(Flow.state.code, CODE23);
  Flow.setUi('tdDot', trk(w).track.ms[1].name);
  Flow.setUi('tdNgayDuKien', '01/02/2027');
  Flow.setUi('tdTb', true);
  Flow.complete(tk[0].id, null);
  assert.equal(Flow.state.tokens.length, 0);
  const n = Flow.state.vars.notices[0];
  assert.equal(n.dot, Flow.state.vars.track.ms[1].name);
  assert.equal(n.ngay, '01/02/2027');
  assert.ok(n.file);
  assert.equal(Flow.state.ui.tdTb, undefined);
  assert.equal(Flow.state.status, 'running');
  assert.ok(Flow.state.history.some((h) => String(h.task) === '4' && h.system));
  Flow.toMain();
  Flow.hdEvent(HD, 3);
  assert.equal(Flow.caseTokens('phd', HD).length, 1, 'lần thông báo thứ hai');
});

test('Bộ demo MS23: mọi cảnh đúng trạng thái, luồng chính giữ nguyên, mỗi cảnh chạy lại từ đầu', () => {
  const w = boot();
  const { Flow, D } = w;
  Flow.create('MS01.01', { dxms: 'ĐXMS-2026-0117', name: 'Phê duyệt' });
  const main = Flow.state.code;
  const set = D.demoSets.find((d) => d.key === 'MS23');
  for (const s of set.scenes) {
    Flow.jumpToScene(s.n, 'MS23');
    assert.equal(Flow.state.code, CODE23, s.n);
    assert.equal(Flow.demoSet().key, 'MS23', s.n);
    assert.equal(Flow.state.tokens.length, s.start === 'END' ? 0 : 1, s.n);
    Flow.toMain();
    assert.equal(Flow.state.code, main);
    assert.equal(Flow.caseOf('HSHD-2026-0052').status, 'approved', s.n);
  }
  const by = (n) => { Flow.jumpToScene(n, 'MS23'); Flow.toMain(); return trk(w); };
  assert.equal(by('T1').reminds, undefined);
  assert.equal(by('T2').reminds.length, 1);
  assert.equal(by('T4').notices.length, 1);
  assert.equal(by('T5').triggers.length, 3);
  const t6 = by('T6');
  assert.ok(t6.track.ms[0].actual);
  assert.equal(t6.notices[0].dot, t6.track.ms[0].name, 'thông báo giao hàng đúng đợt: bước 3 xong trước khi biên bản về');
  assert.deepEqual(plain(t6.trackLog.map((r) => r[0])), plain(t6.trackLog.map((r) => r[0])).sort((a, b) => a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join(''))), 'nhật ký theo thời gian');
  // Điểm ❓ của DG-MS23 §D đủ 10 mục.
  for (const p of ['P-120', 'P-135', 'P-136', 'P-137', 'P-138', 'P-139', 'P-140', 'P-141', 'P-142', 'P-143']) assert.match(D.openPoints[p].def, /^GIẢ LẬP/, p);
});
