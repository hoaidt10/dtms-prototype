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
  assert.equal(Flow.caseTokens('phd', HD).filter((t) => t.caseCode === CODE23).length, 1, 'lần thông báo thứ hai');
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
  assert.equal(by('T5').triggers.length, 2);
  const t6 = by('T6');
  assert.ok(t6.track.ms[0].actual);
  assert.equal(t6.notices[0].dot, t6.track.ms[0].name, 'thông báo giao hàng đúng đợt: bước 3 xong trước khi biên bản về');
  assert.deepEqual(plain(t6.trackLog.map((r) => r[0])), plain(t6.trackLog.map((r) => r[0])).sort((a, b) => a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join(''))), 'nhật ký theo thời gian');
  // Điểm ❓ của DG-MS23 §D đủ 10 mục.
  for (const p of ['P-120', 'P-135', 'P-136', 'P-137', 'P-138', 'P-139', 'P-140', 'P-141', 'P-142', 'P-143']) assert.match(D.openPoints[p].def, /^GIẢ LẬP/, p);
});

/* ---------- T25 B3: MS24 Thanh toán ---------- */
const CODE24 = 'HSTT-2026-0052-01';
const jump24 = (w, b) => w.Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
const set24 = (w) => w.D.demoSets.find((d) => d.key === 'MS24');

test('MS24: 20 bước có cấu hình; mọi đích tồn tại; mã hồ sơ theo đợt; kế hoạch thanh toán khớp giá trị hợp đồng', () => {
  const w = boot();
  const A = w.D.flows.MS24, T = w.BPMN_FLOWS.MS24.tasks;
  for (let n = 1; n <= 20; n++) {
    assert.ok(A[n], `thiếu bước ${n}`);
    if (T[n].type !== 'service') assert.ok(A[n].who && A[n].scr, `bước ${n}`);
  }
  for (const [k, f] of Object.entries(A)) {
    for (const d of [f.next, ...(f.choices || []).map((c) => c.to)].filter((x) => x != null)) assert.ok(d === 'END' || A[d], `${k} → ${d}`);
  }
  assert.equal(w.D.hdCaseCode(HD, 'MS24'), CODE24);
  assert.equal(w.D.hdCaseCode(HD, 'MS24', 2), 'HSTT-2026-0052-02');
  const net = w.D.hdPayPlan[HD].reduce((s, p) => s + p.value - p.adv - p.hold, 0);
  assert.equal(Math.round(net * 100) / 100, 191.2, 'tổng ròng các đợt = giá trị hợp đồng');
});

test('MS24: mũi tên của engine khớp bản vẽ cho hai tuyến ký', () => {
  const w = boot();
  const A = w.D.flows.MS24, e = w.BPMN_FLOWS.MS24.edges;
  const has = (a, b) => e.some((x) => String(x[0]) === String(a) && String(x[1]) === String(b));
  // Tuyến bảng tổng hợp: G3…G6 là cổng sau 7…10; tuyến đề nghị: G7…G10 là cổng sau 13…16.
  [[7, 'G3', 8], [8, 'G4', 9], [9, 'G5', 10], [10, 'G6', 12]].forEach(([n, g, to]) => {
    assert.ok(has(n, g) && has(g, to) && has(g, 11), `bản vẽ bước ${n}`);
    assert.equal(A[n].choices[0].to, to);
    assert.equal(A[n].choices[1].to, 11);
  });
  [[13, 'G7', 14], [14, 'G8', 15], [15, 'G9', 16], [16, 'G10', 18]].forEach(([n, g, to]) => {
    assert.ok(has(n, g) && has(g, to) && has(g, 17), `bản vẽ bước ${n}`);
    assert.equal(A[n].choices[0].to, to);
    assert.equal(A[n].choices[1].to, 17);
  });
  assert.ok(has(11, 7) && A[11].next === 7 && has(17, 12) && A[17].next === 12 && has(12, 13) && A[12].next === 13);
});

test('MS24 nhánh chính: đi hết 20 bước, kết thúc lần thanh toán, không đụng hồ sơ khác', () => {
  const w = boot();
  const { Flow } = w;
  Flow.jumpToScene('P2', 'MS24');
  assert.equal(Flow.state.code, CODE24);
  assert.equal(Flow.demoSet().key, 'MS24');
  assert.deepEqual(plain(at(w)), [2]);
  realStep(w, 2);
  assert.deepEqual(plain(at(w)), [5], 'mặc định có bảng tổng hợp');
  assert.ok(Flow.state.history.some((h) => String(h.task) === '4' && h.system));
  realStep(w, 5);
  assert.ok(Flow.state.history.some((h) => String(h.task) === '6' && h.system));
  for (const [n, who] of [[7, 'tckt'], [8, 'tgd'], [9, 'vthu'], [10, 'td']]) { assert.equal(Flow.state.tokens[0].who, who, `bước ${n}`); realStep(w, n); }
  realStep(w, 12);
  for (const [n, who] of [[13, 'tckt'], [14, 'tgd'], [15, 'vthu'], [16, 'td']]) { assert.equal(Flow.state.tokens[0].who, who, `bước ${n}`); realStep(w, n); }
  realStep(w, 18);
  realStep(w, 19);
  assert.equal(Flow.state.status, 'approved');
  assert.ok(Flow.state.history.some((h) => String(h.task) === '20' && h.system));
  assert.ok(Flow.state.history.some((h) => /Hoàn tất lần thanh toán/.test(h.action)));
  assert.equal(Flow.caseOf(CODE23).status, 'running', 'hồ sơ theo dõi còn chạy');
  assert.equal(Flow.taskStatus(3), 'cond');
  assert.equal(Flow.taskStatus(11), 'cond');
});

test('MS24 nhánh: thiếu căn cứ; không yêu cầu bảng tổng hợp; hai tuyến trả sửa không lẫn nhau; SAP lỗi Gửi lại', () => {
  const w = boot();
  const { Flow } = w;
  const b = set24(w).branches;
  jump24(w, b[0]);
  realStep(w, 2, 'Yêu cầu bổ sung');
  assert.deepEqual(plain(at(w)), [3]);
  realStep(w, 3);
  assert.deepEqual(plain(at(w)), [2]);

  jump24(w, b[1]);
  assert.deepEqual(plain(at(w)), [12], 'không có bảng tổng hợp: 4 → 12');
  assert.ok(!Flow.state.history.some((h) => String(h.task) === '6'));
  assert.equal(Flow.taskStatus(5), 'cond');
  assert.equal(Flow.taskStatus(10), 'cond');

  jump24(w, b[2]);
  assert.equal(Flow.state.tokens[0].who, 'vthu');
  realStep(w, 9, 'Không đồng ý');
  assert.deepEqual(plain(at(w)), [11]);
  realStep(w, 11);
  assert.deepEqual(plain(at(w)), [7], 'trình lại từ Phòng tài chính');

  jump24(w, b[3]);
  realStep(w, 16, 'Không đồng ý');
  assert.deepEqual(plain(at(w)), [17]);
  realStep(w, 17);
  assert.deepEqual(plain(at(w)), [12]);
  realStep(w, 12);
  assert.deepEqual(plain(at(w)), [13], 'không quay về tuyến bảng tổng hợp');

  jump24(w, b[4]);
  assert.deepEqual(plain(at(w)), [20]);
  assert.equal(Flow.state.tokens[0].who, 'tckt');
  assert.equal(Flow.state.status, 'running');
  assert.ok(Flow.state.history.some((h) => /^Lỗi đồng bộ SAP/.test(h.action)));
  realStep(w, 20);
  assert.equal(Flow.state.status, 'approved', 'gửi lại thành công');
  for (const p of ['P-124', 'P-125', 'P-144', 'P-145', 'P-146', 'P-147', 'P-148', 'P-149', 'P-150', 'P-151', 'P-152', 'P-153']) assert.match(w.D.openPoints[p].def, /^GIẢ LẬP/, p);
});

test('Bộ demo MS24: mọi cảnh đúng việc, đúng vai; cảnh đầu là hợp đồng đã ký, chưa có hồ sơ thanh toán; clockOf ngược dateOf', () => {
  const w = boot();
  const { Flow } = w;
  for (const s of set24(w).scenes) {
    Flow.jumpToScene(s.n, 'MS24');
    if (s.start === 'BASE') { assert.equal(Flow.caseOf(CODE24), null); assert.ok(Flow.caseOf(CODE23)); continue; }
    if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', s.n); continue; }
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}`);
  }
  assert.equal(Flow.dateOf(Flow.clockOf(Flow.dateOf(40))), Flow.dateOf(40));
});

/* ---------- T25 B4: MS23.03 + MS23.04 ---------- */
const CNT = 'HSNT-2026-0052', CTL = 'HSTL-2026-0052';
const NTP = 'MS23.03', TLP = 'MS23.04';
const load = (w, code) => { w.Flow.openCase(code); return w.Flow.state; };
const toStartNt = (w) => { w.Flow.jumpToScene('N1', NTP); w.Flow.startHd(NTP, HD); };

test('MS23.03, .04: đủ 14 bước; mọi đích tồn tại; cổng và mũi tên khớp bản vẽ', () => {
  const w = boot();
  for (const p of [NTP, TLP]) {
    const A = w.D.flows[p], T = w.BPMN_FLOWS[p].tasks;
    for (let n = 1; n <= 14; n++) {
      assert.ok(A[n], `${p} thiếu bước ${n}`);
      if (T[n].type !== 'service') assert.ok(A[n].who && A[n].scr, `${p} bước ${n}`);
    }
    for (const [k, f] of Object.entries(A)) for (const d of [f.next, ...(f.choices || []).map((c) => c.to)].filter((x) => x != null)) assert.ok(d === 'END' || A[d], `${p} ${k} → ${d}`);
  }
  const N = w.BPMN_FLOWS[NTP].edges, L = w.BPMN_FLOWS[TLP].edges, has = (E, a, b) => E.some((x) => String(x[0]) === String(a) && String(x[1]) === String(b));
  assert.ok(has(N, 'G5', 10) && has(N, 'G5', 6) && has(N, 'G6', 11) && has(N, 'G6', 6) && has(N, 'G8', 13) && has(N, 'G8', 6) && has(N, 'G7', 12));
  assert.equal(w.D.flows[NTP][9].choices[1].to, 6);
  assert.equal(w.D.flows[NTP][11].choices[1].to, 6, 'GIẢ LẬP P-154: nhánh treo trên bản vẽ');
  assert.ok(has(L, 'G7', 10) && has(L, 'G7', 7) && has(L, 'G10', 13) && has(L, 'G10', 7));
  assert.equal(w.D.flows[TLP][12].choices[1].to, 7);
  assert.equal(w.D.hdCaseCode(HD, NTP), CNT);
  assert.equal(w.D.hdCaseCode(HD, TLP), CTL);
});

test('Ký riêng: MS23.03 đi hết, G1 sinh MS23.04; bước 14 cập nhật ngày thực tế qua MS23 bước 5; MS23.04 đi hết tuyến ký riêng', () => {
  const w = boot();
  const { Flow } = w;
  toStartNt(w);
  assert.equal(Flow.state.code, CNT);
  assert.deepEqual(plain(at(w)), [1], 'tài sản → bước 1');
  assert.equal(Flow.state.tokens[0].who, 'lan');
  realStep(w, 1);
  realStep(w, 3);
  assert.deepEqual(plain(at(w)), [6], 'qua AI soạn bước 5');
  assert.equal(Flow.caseOf(CTL), null, 'chưa có G1');
  realStep(w, 6);
  assert.equal(Flow.caseOf(CTL).tokens[0].task, 1, 'G1 sinh hồ sơ thanh lý');
  assert.equal(Flow.caseOf(CTL).vars.plan, 'RIENG');
  assert.deepEqual(plain(at(w)), [9], 'ký riêng: không qua bước 7');
  for (const [n, who] of [[9, 'tphd'], [10, 'binh'], [11, 'vthu'], [12, 'tgd']]) { assert.equal(Flow.state.tokens[0].who, who, `bước ${n}`); realStep(w, n); }
  Flow.setUi('tnNgay', '30/05/2027');
  realStep(w, 13);
  assert.equal(Flow.state.status, 'approved');
  const t = trk(w).track.ms.find((m) => m.kind === 'NT');
  assert.equal(t.actual, '30/05/2027', 'ngày thật từ biên bản, không phải ngày kế hoạch');
  assert.equal(Flow.caseOf(CODE23).history.filter((h) => String(h.task) === '5').length, 1, 'một lần cập nhật');

  load(w, CTL);
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [3], 'ký riêng → chờ');
  realStep(w, 3, 'Tiếp tục chờ');
  assert.deepEqual(plain(at(w)), [3], 'ở lại chờ');
  realStep(w, 3);
  realStep(w, 4);
  Flow.setUi('tlQuyetToan', 190);
  realStep(w, 5);
  assert.deepEqual(plain(at(w)), [7], 'quyết toán → AI soạn → hoàn thiện');
  realStep(w, 7);
  for (const [n, who] of [[9, 'tphd'], [10, 'binh'], [11, 'vthu'], [12, 'tgd']]) { assert.equal(Flow.state.tokens[0].who, who, `.04 bước ${n}`); realStep(w, n); }
  realStep(w, 13);
  assert.equal(Flow.state.status, 'approved');
  assert.ok(Flow.state.history.some((h) => /Hoàn tất biên bản thanh lý/.test(h.action)));
  assert.ok(trk(w).trackLog.at(-1)[2].includes('kết quả thanh lý'));
});

test('Ký chung: hai hồ sơ chờ nhau qua G2, G3; một tuyến ký ở MS23.03; trả về sửa ở MS23.03 và tập hợp lại, không có tuyến thanh lý song song', () => {
  const w = boot();
  const { Flow } = w;
  toStartNt(w);
  Flow.setUi('tnPhuongAn', 'CHUNG');
  realStep(w, 1);
  realStep(w, 3);
  realStep(w, 6);
  assert.equal(Flow.state.tokens.length, 0, 'chờ G2, không có bước 7');
  assert.match(Flow.state.vars.hold, /Chờ biên bản thanh lý/);

  load(w, CTL);
  assert.equal(Flow.state.vars.plan, 'CHUNG');
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [2]);
  realStep(w, 2);
  assert.deepEqual(plain(at(w)), [7]);
  realStep(w, 7);
  assert.equal(Flow.state.tokens.length, 0, 'gửi G2 rồi chờ G3');
  assert.match(Flow.state.vars.hold, /Chờ kết quả ký chung/);
  assert.equal(Flow.taskStatus(9), 'cond', 'không có tuyến ký thanh lý');

  load(w, CNT);
  assert.deepEqual(plain(at(w)), [7], 'G2 mở bước 7');
  assert.equal(Flow.state.vars.hold, undefined);
  realStep(w, 7);
  realStep(w, 9);
  realStep(w, 10);
  realStep(w, 11);
  realStep(w, 12, 'Không đồng ý');
  assert.deepEqual(plain(at(w)), [6], 'trả về bước 6');
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [7], 'tập hợp lại, biên bản thanh lý vẫn còn, không chờ G2 lần nữa');
  assert.equal(Flow.caseOf(CTL).tokens.length, 0);
  realStep(w, 7);
  for (const n of [9, 10, 11, 12]) realStep(w, n);
  realStep(w, 13);
  assert.equal(Flow.state.status, 'approved');
  assert.deepEqual(plain(Flow.caseOf(CTL).tokens.map((t) => t.task)), [13], 'G3 mở bước 13 của MS23.04');
  load(w, CTL);
  realStep(w, 13);
  assert.equal(Flow.state.status, 'approved');
  for (const n of [9, 10, 11, 12, 3, 4, 5]) assert.ok(!Flow.state.history.some((h) => String(h.task) === String(n)), `ký chung không qua .04 bước ${n}`);
});

test('Nhánh: thiếu chứng từ; KCS chưa đạt → khắc phục → KCS lại; dịch vụ; AI không đạt; Văn thư trả; không yêu cầu thanh lý', () => {
  const w = boot();
  const { Flow } = w;
  const b = w.D.demoSets.find((d) => d.key === NTP).branches, go = (x) => Flow.jumpTo(x.task, x.who, x.vars, x.process, x.dxms, x.ui, x.settle, x.pre);
  go(b[0]);
  realStep(w, 3, 'Thiếu chứng từ');
  assert.deepEqual(plain(at(w)), [3]);
  go(b[1]);
  realStep(w, 3, 'KCS chưa đạt');
  assert.deepEqual(plain(at(w)), [4]);
  assert.equal(Flow.state.tokens[0].who, 'dvsd');
  realStep(w, 4);
  assert.deepEqual(plain(at(w)), [1], 'về đơn vị chủ quản ký lại');
  go(b[2]);
  assert.deepEqual(plain(at(w)), [2]);
  assert.equal(Flow.taskStatus(1), 'cond');
  go(b[3]);
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [6], 'AI không đạt về bước 6');
  assert.equal(Flow.state.vars.aiNt.ok, false);
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [9], 'lần sau đạt');
  go(b[4]);
  realStep(w, 11, 'Không đạt');
  assert.deepEqual(plain(at(w)), [6]);
  go(b[5]);
  const tl = Flow.caseOf(CTL);
  assert.equal(tl.status, 'approved', 'không yêu cầu thanh lý: kết thúc ngay');
  assert.match(tl.history.at(-1).action, /Không thực hiện thanh lý/);
  assert.equal(tl.tokens.length, 0);
  go(b[6]);
  realStep(w, 12, 'Không đồng ý');
  assert.deepEqual(plain(at(w)), [7]);
  realStep(w, 7);
  assert.deepEqual(plain(at(w)), [9], 'trình lại từ Trưởng phòng Hợp đồng');
});

test('Bộ demo nghiệm thu, thanh lý: mọi cảnh đúng việc, đúng vai; ❓ B4 giả lập', () => {
  const w = boot();
  const { Flow, D } = w;
  for (const key of [NTP, TLP]) {
    for (const s of D.demoSets.find((d) => d.key === key).scenes) {
      Flow.jumpToScene(s.n, key);
      assert.equal(Flow.demoSet().key, key, s.n);
      if (s.start === 'BASE') { assert.equal(Flow.caseOf(CNT), null); assert.equal(trk(w).triggers[0].flow, NTP); continue; }
      if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', s.n); continue; }
      assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}: ${Flow.state.code} ${Flow.state.tokens.map((t) => t.task)}`);
    }
  }
  assert.equal(Flow.caseOf(CTL).status, 'approved');
  for (let n = 154; n <= 160; n++) assert.match(D.openPoints['P-' + n].def, /^GIẢ LẬP/);
});

/* ---------- T25 B5: MS23.01 Văn bản phát sinh ---------- */
const VBP = 'MS23.01', CVB = 'HSVB-2026-0052-01', CVB2 = 'HSVB-2026-0052-02';
const toStartVb = (w) => { w.Flow.jumpToScene('V1', VBP); w.Flow.startHd(VBP, HD); };
const planOf = (w) => trk(w).track.ms.map((m) => m.plan);

test('MS23.01: 12 bước có cấu hình; mọi đích tồn tại; mũi tên engine khớp bản vẽ; mã hồ sơ theo lần; tên bước không mang ghi chú chờ chốt', () => {
  const w = boot();
  const A = w.D.flows[VBP], T = w.BPMN_FLOWS[VBP].tasks, E = w.BPMN_FLOWS[VBP].edges, has = (a, b, re) => E.some((x) => String(x[0]) === String(a) && String(x[1]) === String(b) && (!re || re.test(x[2])));
  for (let n = 1; n <= 12; n++) {
    assert.ok(A[n], `thiếu bước ${n}`);
    if (T[n].type !== 'service') assert.ok(A[n].who && A[n].scr, `bước ${n}`);
    assert.ok(!/\[\?/.test(T[n].name), `tên bước ${n}`);
  }
  for (const [k, f] of Object.entries(A)) for (const d of [f.next, ...(f.choices || []).map((c) => c.to)].filter((x) => x != null)) assert.ok(d === 'END' || A[d], `${k} → ${d}`);
  assert.ok(has(1, 'G1') && has('G1', 2, /Có/) && has('G1', 'G3', /Không/) && has('G2', 'G3', /Có/) && has('G2', 2, /Không/) && has('G3', 4));
  assert.ok(has('G4', 5, /OK/) && has('G4', 1, /Không OK/) && has(7, 8) && has('G5', 9, /Có/) && has('G5', 6, /Không/) && has('G6', 11, /Có/) && has('G6', 9, /Không/) && has(12, 'E1'));
  assert.equal(A[3].choices[0].to, 'g3');
  assert.equal(A[3].choices[1].to, 2);
  assert.equal(A[8].choices[1].to, 6);
  assert.equal(A[10].choices[1].to, 9);
  assert.equal(w.D.hdCaseCode(HD, VBP, 2), CVB2);
  assert.equal(w.D.hdCaseCode(HD, 'MS24', 2), 'HSTT-2026-0052-02', 'MS24 giữ cách đánh mã');
  assert.equal(w.D.hdCaseCode(HD, NTP), CNT, 'quy trình một hồ sơ không có số lần');
});

test('Phụ lục: đi đủ 12 bước, gia hạn dời mốc chưa xong qua MS23 bước 5, kết thúc một văn bản, hợp đồng chưa kết thúc', () => {
  const w = boot();
  const { Flow } = w;
  toStartVb(w);
  assert.equal(Flow.state.code, CVB);
  assert.deepEqual(plain(at(w)), [1]);
  assert.equal(Flow.state.tokens[0].who, 'phd');
  const before = planOf(w);
  Flow.setUi('vbLoai', 'Phụ lục hợp đồng');
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [2], 'sửa đổi hợp đồng → 2');
  Object.entries({ vbGiaTri: 2.5, vbGiaHan: 30, vbSo: 'PL01/052' }).forEach(([k, v]) => Flow.setUi(k, v));
  realStep(w, 2);
  assert.equal(Flow.state.tokens[0].who, 'tgd', 'Người có thẩm quyền');
  realStep(w, 3);
  assert.deepEqual(plain(at(w)), [6], 'qua AI 4, 5');
  assert.equal(Flow.state.vars.aiVbIn.ok, true);
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [8], 'AI 7 không có cổng');
  assert.equal(Flow.state.tokens[0].who, 'tphd');
  realStep(w, 8);
  realStep(w, 9);
  assert.equal(Flow.state.tokens[0].who, 'tgd');
  realStep(w, 10);
  assert.deepEqual(plain(at(w)), [11]);
  assert.deepEqual(plain(planOf(w)), plain(before), 'chưa tới bước 12 thì mốc giữ nguyên');
  Flow.setUi('vbNgayKy', '20/11/2026');
  realStep(w, 11);
  assert.equal(Flow.state.status, 'approved');
  assert.ok(Flow.state.history.some((h) => /Hoàn tất một văn bản phát sinh/.test(h.action)));
  const shifted = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d + 30).toLocaleDateString('en-GB'); };
  assert.deepEqual(plain(planOf(w)), plain(before).map(shifted), 'mọi mốc chưa xong dời 30 ngày');
  assert.match(trk(w).trackLog.at(-1)[2], /dời 3 mốc chưa hoàn thành thêm 30 ngày/);
  assert.equal(trk(w).trackLog.at(-1)[0], '20/11/2026');
  assert.equal(Flow.caseOf(CODE23).status, 'running', 'hồ sơ theo dõi vẫn chạy');
});

test('Mốc đã có ngày thực tế không dời; mỗi hồ sơ ký cập nhật một lần; hồ sơ thứ hai không sớm hơn hồ sơ trước', () => {
  const w = boot();
  const { Flow } = w;
  toStartVb(w);
  Flow.toMain();
  assert.ok(Flow.hdEvent(HD, 5, { loai: 'biên bản bàn giao', kind: 'GIAO' }));
  const done0 = plain(trk(w).track.ms[0]);
  assert.ok(done0.actual);
  const first = Flow.caseOf(CVB), code2 = Flow.startHd(VBP, HD);
  assert.equal(code2, CVB2);
  assert.equal(Flow.state.name, 'Văn bản phát sinh 02');
  assert.ok(Flow.state.clock >= first.clock);
  const other = plain(planOf(w)[1]);
  Flow.setUi('vbGiaHan', 10);
  for (const n of [1, 2, 3, 6, 8, 9, 10, 11]) realStep(w, n);
  assert.equal(Flow.state.status, 'approved');
  assert.equal(trk(w).track.ms[0].plan, done0.plan, 'mốc đã xong giữ nguyên');
  assert.notEqual(planOf(w)[1], other, 'mốc chưa xong dời');
  // Phát lại tín hiệu của cùng hồ sơ: không dời lần hai
  const again = plain(planOf(w)), logs = trk(w).trackLog.length;
  assert.equal(w.D.hdSignals.MS23.vb(trk(w), {}, Flow.state.ui, Flow.state), null);
  assert.deepEqual(plain(planOf(w)), again);
  assert.equal(trk(w).trackLog.length, logs);
});

test('Loại khác phụ lục: không qua 2, 3; gia hạn còn sót không dời mốc; các nhánh AI, trả về đúng bản vẽ', () => {
  const w = boot();
  const { Flow, D } = w;
  toStartVb(w);
  const before = planOf(w);
  Flow.setUi('vbLoai', 'Biên bản làm việc');
  Flow.setUi('vbGiaHan', 99);
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [6], 'G1 Không → G3 → 4 → 5 → 6');
  assert.equal(Flow.taskStatus(2), 'cond');
  assert.equal(Flow.taskStatus(3), 'cond');
  for (const n of [6, 8, 9, 10, 11]) realStep(w, n);
  assert.equal(Flow.state.status, 'approved');
  assert.deepEqual(plain(planOf(w)), plain(before));
  assert.match(trk(w).trackLog.at(-1)[1], /biên bản làm việc đã ký đầy đủ/);
  assert.match(trk(w).trackLog.at(-1)[2], /ghi nhận thông tin phát sinh/);
  const b = D.demoSets.find((d) => d.key === VBP).branches, go = (x) => Flow.jumpTo(x.task, x.who, x.vars, x.process, x.dxms, x.ui, x.settle, x.pre);
  go(b[2]);
  realStep(w, 3, 'Chưa duyệt');
  assert.deepEqual(plain(at(w)), [2], 'đề xuất chưa duyệt → 2');
  go(b[3]);
  realStep(w, 3);
  assert.deepEqual(plain(at(w)), [1], 'AI không đạt → 1');
  assert.equal(Flow.state.vars.aiVbIn.ok, false);
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [2], 'phụ lục đi lại nhánh tương ứng');
  realStep(w, 2);
  realStep(w, 3);
  assert.deepEqual(plain(at(w)), [6], 'lần sau đạt');
  go(b[4]);
  assert.deepEqual(plain(at(w)), [8], 'cảnh báo bước 7 không chặn');
  assert.equal(Flow.state.vars.aiVbOut.warn, true);
  go(b[5]);
  realStep(w, 8, 'Không duyệt');
  assert.deepEqual(plain(at(w)), [6]);
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [8], 'qua lại AI bước 7');
  go(b[6]);
  realStep(w, 10, 'Không đồng ý');
  assert.deepEqual(plain(at(w)), [9]);
  realStep(w, 9);
  assert.deepEqual(plain(at(w)), [10]);
});

test('Bộ demo MS23.01: mọi cảnh đúng việc, đúng vai; cảnh đầu có dòng cần khởi tạo, chưa có hồ sơ; ❓ B5 giả lập', () => {
  const w = boot();
  const { Flow, D } = w;
  const set = D.demoSets.find((d) => d.key === VBP);
  for (const s of set.scenes) {
    Flow.jumpToScene(s.n, VBP);
    assert.equal(Flow.demoSet().key, VBP, s.n);
    if (s.start === 'BASE') { assert.equal(Flow.caseOf(CVB), null); assert.equal(trk(w).triggers[0].flow, VBP); continue; }
    if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', s.n); continue; }
    assert.equal(Flow.state.code, CVB, s.n);
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}: ${Flow.state.tokens.map((t) => t.task)}`);
  }
  for (const b of set.branches) {
    Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(b.task) && t.who === b.who), b.name);
  }
  for (let n = 161; n <= 173; n++) assert.match(D.openPoints['P-' + n].def, /^GIẢ LẬP/);
});

/* ---------- T25 B6: MS23.02 Bàn giao ---------- */
const BGP = 'MS23.02', CBG = 'HSBG-2026-0052-01', CBG2 = 'HSBG-2026-0052-02';
/* Hợp đồng đã ký; nhà thầu thông báo đợt `dot` → hồ sơ bàn giao. */
const notifyBg = (w, dot) => {
  const { Flow } = w;
  Flow.hdEvent(HD, 3);
  Flow.openCase(CODE23);
  if (dot) Flow.setUi('tdDot', dot);
  realStep(w, 3);
  Flow.toMain();
};
const toBg = (w) => { toSigned(w); notifyBg(w); w.Flow.openCase(CBG); };
const toKcs = (w) => { toBg(w); for (const n of [1, 2, 3, 5]) realStep(w, n); };

test('MS23.02: 22 bước có cấu hình; mọi đích tồn tại; mũi tên engine khớp bản vẽ; mũi tên thiếu theo diễn giải; ❓ B6 giả lập', () => {
  const w = boot();
  const A = w.D.flows[BGP], T = w.BPMN_FLOWS[BGP].tasks, E = w.BPMN_FLOWS[BGP].edges, has = (a, b) => E.some((x) => String(x[0]) === String(a) && String(x[1]) === String(b));
  for (let n = 1; n <= 22; n++) {
    assert.ok(A[n], `thiếu bước ${n}`);
    if (T[n].type !== 'service') assert.ok(A[n].who && A[n].scr, `bước ${n}`);
  }
  for (const [k, f] of Object.entries(A)) for (const d of [f.next, ...(f.choices || []).map((c) => c.to)].filter((x) => x != null)) assert.ok(d === 'END' || A[d], `${k} → ${d}`);
  assert.ok(has('G1', 2) && has('G1', 4) && has('G2', 14) && has('G2', 'G3') && has('G3', 9) && has('G4', 8) && has('G4', 9) && has('G5', 3) && has('G5', 9));
  assert.ok(has('G6', 11) && has('G6', 12) && has('G6', 13) && has('G7', 16) && has('G7', 15) && has('G8', 14) && has('G9', 18) && has('G10', 21) && has('G10', 14) && has(22, 'E5'));
  assert.equal(A[6].choices[0].to, 14);
  assert.equal(A[8].choices[0].to, 3);
  assert.equal(A[20].choices[1].to, 14);
  // Thiếu trên bản vẽ, engine theo diễn giải (P-185)
  for (const [a, b] of [[2, 3], [9, 10], [15, 14]]) { assert.ok(!has(a, b), `bản vẽ đã có ${a} → ${b}: bỏ giả lập`); assert.equal(A[a].next, b); }
  assert.equal(w.D.hdCaseCode(HD, BGP, 2), CBG2);
  assert.ok(w.D.hdProcesses[BGP].auto, 'không có nút Tạo hồ sơ');
  for (const k of ['P-122', 'P-123', ...Array.from({ length: 12 }, (_, i) => 'P-' + (174 + i))]) assert.match(w.D.openPoints[k].def, /^GIẢ LẬP/, k);
});

test('Hàng hoá: nhà thầu thông báo sinh hồ sơ theo đợt; đi đủ nhánh chính; bước 22 chỉ cập nhật đúng mốc của đợt, ngày theo HOC', () => {
  const w = boot();
  const { Flow } = w;
  toSigned(w);
  const ms = trk(w).track.ms, d2 = ms[1].name;
  notifyBg(w, d2);
  assert.equal(Flow.caseOf(CBG).vars.msName, d2, 'hồ sơ của đúng đợt, không phải đợt đầu');
  notifyBg(w, d2);
  assert.equal(Flow.caseOf(CBG2), null, 'báo lại cùng đợt không sinh thêm');
  Flow.openCase(CBG);
  assert.equal(Flow.state.name, d2);
  assert.deepEqual(plain(at(w)), [1]);
  for (const [n, who] of [[1, 'phd'], [2, 'phd'], [3, 'qlts'], [5, 'qlts'], [6, 'dvsd'], [14, 'phd']]) { assert.equal(Flow.state.tokens[0].who, who, `bước ${n}`); realStep(w, n); }
  assert.deepEqual(plain(at(w)), [18], 'qua AI 16, 17');
  realStep(w, 18);
  assert.deepEqual(plain(at(w)), [20], 'qua AI 19');
  assert.equal(Flow.state.tokens[0].who, 'tphd');
  realStep(w, 20);
  assert.ok(!trk(w).track.ms[1].actual, 'chưa có HOC đủ chữ ký thì chưa có ngày');
  Flow.setUi('bgNgay', '03/06/2027');
  realStep(w, 21);
  assert.equal(Flow.state.status, 'approved');
  assert.ok(Flow.state.history.some((h) => /Hoàn tất hồ sơ bàn giao/.test(h.action)));
  assert.equal(trk(w).track.ms[1].actual, '03/06/2027');
  assert.equal(trk(w).track.ms[0].actual, null, 'đợt khác giữ nguyên');
  assert.match(trk(w).trackLog.at(-1)[2], /AI cập nhật ngày thực tế 03\/06\/2027/);
  assert.equal(w.D.hdSignals.MS23.bg(trk(w), {}, Flow.state.ui, Flow.state), null, 'mỗi hồ sơ một lần');
  // Đợt tiếp theo có hồ sơ riêng
  notifyBg(w, ms[0].name);
  assert.equal(Flow.caseOf(CBG2).vars.msName, ms[0].name);
});

test('Dịch vụ: không qua kho, KCS; xong bước 4 có dòng cần khởi tạo MS23.03 nhánh dịch vụ, không có ngày bàn giao', () => {
  const w = boot();
  const { Flow } = w;
  toBg(w);
  Flow.setUi('bgLoai', 'Dịch vụ');
  realStep(w, 1);
  assert.deepEqual(plain(at(w)), [4]);
  assert.equal(Flow.state.tokens[0].who, 'dvsd');
  for (const n of [2, 3, 5, 6]) assert.equal(Flow.taskStatus(n), 'cond', `bước ${n}`);
  realStep(w, 4);
  assert.equal(Flow.state.status, 'approved');
  assert.match(Flow.state.history.at(-1).action, /Có hồ sơ dịch vụ cho MS23.03/);
  const t = trk(w).triggers.at(-1);
  assert.equal(t.flow, 'MS23.03');
  assert.equal(t.kcs, 'DV');
  assert.equal(trk(w).track.ms[0].actual, null);
  Flow.toMain();
  Flow.startHd('MS23.03', HD, { kcs: t.kcs });
  assert.deepEqual(plain(at(w)), [2], 'MS23.03 đi nhánh KCS dịch vụ');
});

test('Không đạt: lần đầu → 7; thay thế trong hạn về 3; vẫn không đạt → 9; từ chối ngay, quá hạn → 9; hạn 7 ngày làm việc', () => {
  const w = boot();
  const { Flow } = w;
  toKcs(w);
  realStep(w, 6, 'Không đạt');
  assert.deepEqual(plain(at(w)), [7]);
  assert.equal(Flow.state.tokens[0].who, 'qlts');
  Flow.state.clock = Flow.clockOf('02/11/2026');
  realStep(w, 7, 'Cho bổ sung');
  assert.deepEqual(plain(at(w)), [8]);
  assert.match(Flow.state.vars.bgHan, /^\d\d\/\d\d\/\d{4}$/);
  const [d, m, y] = Flow.state.vars.bgHan.split('/').map(Number), wd = new Date(y, m - 1, d).getDay();
  assert.ok(wd >= 1 && wd <= 5, 'hạn rơi vào ngày làm việc');
  realStep(w, 8, 'Có hàng');
  assert.deepEqual(plain(at(w)), [3], 'làm lại giao nhận');
  realStep(w, 3);
  realStep(w, 5);
  realStep(w, 6, 'Không đạt');
  assert.deepEqual(plain(at(w)), [9], 'lần hai vẫn không đạt: không mở thêm vòng');
  // Đạt sau thay thế đi tiếp bình thường
  const b = w.D.demoSets.find((x) => x.key === BGP).branches, go = (x) => Flow.jumpTo(x.task, x.who, x.vars, x.process, x.dxms, x.ui, x.settle, x.pre);
  go(b[4]);
  realStep(w, 6);
  assert.deepEqual(plain(at(w)), [14], 'sau thay thế đạt');
  go(b[2]);
  realStep(w, 7, 'Từ chối ngay');
  assert.deepEqual(plain(at(w)), [9]);
  go(b[3]);
  realStep(w, 8, 'Không khắc phục');
  assert.deepEqual(plain(at(w)), [9]);
  realStep(w, 9);
  assert.deepEqual(plain(at(w)), [10]);
  assert.equal(Flow.state.tokens[0].who, 'dvsd');
});

test('Ba hướng xử lý không gộp thành đã bàn giao: phạt mở MS23.01 và chờ; hủy kết thúc theo phạm vi; xin ý kiến chờ chỉ đạo', () => {
  const w = boot();
  const { Flow, D } = w;
  const b = D.demoSets.find((x) => x.key === BGP).branches, go = (x) => Flow.jumpTo(x.task, x.who, x.vars, x.process, x.dxms, x.ui, x.settle, x.pre);
  go(b[7]);
  realStep(w, 11);
  assert.equal(Flow.state.status, 'running');
  assert.equal(Flow.state.tokens.length, 0);
  assert.match(Flow.state.vars.hold, /Chuyển MS23.01/);
  const vb = Flow.caseOf('HSVB-2026-0052-01');
  assert.equal(vb.ui.vbLoai, 'Biên bản phạt');
  assert.equal(vb.tokens[0].task, 1);
  assert.equal(Flow.state.code, CBG, 'S vẫn là hồ sơ bàn giao');
  go(b[8]);
  Flow.setUi('bgPhamVi', D.hdBgHuy[1]);
  realStep(w, 12);
  assert.equal(Flow.state.status, 'approved');
  assert.match(Flow.state.history.at(-1).action, /hủy toàn bộ hợp đồng/);
  assert.ok(!trk(w).track.ms[0].actual, 'hủy không có ngày bàn giao');
  go(b[9]);
  realStep(w, 13);
  assert.equal(Flow.state.status, 'running');
  assert.match(Flow.state.vars.hold, /Chờ ý kiến chỉ đạo/);
});

test('Hồ sơ HOC: chưa đủ → 15 → 14; AI 16 không đạt → 14; AI 19 không đạt → 18; Trưởng phòng không duyệt → 14', () => {
  const w = boot();
  const { Flow, D } = w;
  const b = D.demoSets.find((x) => x.key === BGP).branches, go = (x) => Flow.jumpTo(x.task, x.who, x.vars, x.process, x.dxms, x.ui, x.settle, x.pre);
  go(b[10]);
  realStep(w, 14, 'Chưa đủ');
  assert.deepEqual(plain(at(w)), [15]);
  realStep(w, 15);
  assert.deepEqual(plain(at(w)), [14]);
  go(b[11]);
  realStep(w, 14);
  assert.deepEqual(plain(at(w)), [14], 'AI 16 không đạt');
  assert.equal(Flow.state.vars.aiBgIn.ok, false);
  realStep(w, 14);
  assert.deepEqual(plain(at(w)), [18], 'lần sau đạt');
  go(b[12]);
  realStep(w, 18);
  assert.deepEqual(plain(at(w)), [18], 'AI 19 không đạt');
  realStep(w, 18);
  assert.deepEqual(plain(at(w)), [20]);
  go(b[13]);
  realStep(w, 20, 'Không duyệt');
  assert.deepEqual(plain(at(w)), [14]);
});

test('Bộ demo MS23.02: mọi cảnh, nhánh phụ đúng việc, đúng vai; cảnh đầu là việc ghi nhận ở MS23, chưa có hồ sơ', () => {
  const w = boot();
  const { Flow, D } = w;
  const set = D.demoSets.find((d) => d.key === BGP);
  for (const s of set.scenes) {
    Flow.jumpToScene(s.n, BGP);
    assert.equal(Flow.demoSet().key, BGP, s.n);
    if (s.start === 'BASE') { assert.equal(Flow.caseOf(CBG), null); assert.equal(Flow.caseOf(CODE23).tokens[0].task, 3); continue; }
    if (s.start === 'END') { assert.equal(Flow.state.status, 'approved', s.n); assert.ok(trk(w).track.ms[0].actual); continue; }
    assert.equal(Flow.state.code, CBG, s.n);
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(s.start) && t.who === s.who), `cảnh ${s.n}: ${Flow.state.tokens.map((t) => t.task)}`);
  }
  for (const b of set.branches) {
    Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
    assert.ok(Flow.state.tokens.some((t) => String(t.task) === String(b.task) && t.who === b.who), `${b.name}: ${Flow.state.tokens.map((t) => t.task)}`);
  }
});
