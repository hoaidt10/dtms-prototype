/*
 * Bộ máy luồng cho prototype: chạy 61 task BPMN MS01 v1.1 (+ 10a, 10b) theo D.flow, có token song song (mỗi CQCM một token),
 * điểm hợp nhất (join), cổng theo biến (gw), cổng kiểm tra khớp quy trình và bộ đếm vòng giải trình.
 * Hồ sơ chỉ có instance khi người dùng Lưu ở SCR-25 (chọn quy trình, start ngay — chốt 2026-09-28). Hồ sơ thuộc một ĐXMS (D-10):
 * ĐXMS tạo riêng ở SCR-28 (không start quy trình); prototype chạy luồng cho một hồ sơ Phê duyệt tại một thời điểm.
 * Trạng thái lưu localStorage của trình duyệt (chỉ để người review mở lại không mất chỗ đang xem); lỗi lưu thì vẫn chạy bình thường.
 */
(function () {
  const KEY = 'dtms-proto-v4';
  const D = window.D;
  const listeners = [];

  let S = null;

  /* D-47 (T25): một hợp đồng có nhiều hồ sơ con chạy song song (MS22, MS23.x, MS24). Engine vẫn chạy một S: S của mỗi hồ sơ con nằm trong CASES theo mã,
     mở việc nào thì nạp S của hồ sơ đó (openCase), rời màn thì về luồng chính (toMain). MAIN = S luồng chính trong lúc đang nạp hồ sơ con; null = S là luồng chính.
     Mã việc của hồ sơ con kèm mã hồ sơ. Trên hệ thống thật mỗi hồ sơ con là một process instance riêng. */
  const CASES_KEY = 'dtms-proto-cases-v1';
  let CASES = {};
  let MAIN = null;

  /* Luồng theo quy trình của hồ sơ đang chạy (plan KĐT §6 #2): F() = định nghĩa luồng trong D.flows, T() = task BPMN của trang tương ứng.
     MS01.01 / .02 / .03 dùng chung D.flow (trang MS01 v1.1); MS13 dùng D.flows.MS13 + BPMN_FLOWS.MS13 (trang MS13). */
  const fam = () => D.familyOf(S && S.vars.process);
  const F = () => D.flows[fam()];
  const T = () => (fam() === 'MS01' ? window.BPMN_TASKS : window.BPMN_FLOWS[fam()].tasks);

  /* status: new (chưa tạo hồ sơ) | running | approved | stopped | moved (đã chuyển quy trình).
     dxms = mã ĐXMS của hồ sơ chạy luồng; name = tên hồ sơ. dxmsUser/dxmsEdit/dxmsDel/adj: ĐXMS và hồ sơ Điều chỉnh tạo trên prototype.
     kdtUser/kdtEdit/kdtDel/kdtCases: KĐT và hồ sơ KĐT tạo trên prototype (plan KĐT, D-12). */
  function fresh(process) {
    return {
      persona: 'minh', tokens: [], clock: 0, seq: 0, code: null, dxms: null, kdt: null, creator: null, name: null, replaces: null, movedTo: null, archived: [],
      dxmsUser: [], dxmsEdit: {}, dxmsDel: [], adj: [], kdtUser: [], kdtEdit: {}, kdtDel: [], kdtCases: [],
      vars: { round: 0, reportTD: null, process: process || null, big: process !== 'MS01.03', basisOk: true, checks: [],
        th: process ? (D.familyOf(process) === 'MS13' ? D.kdtRules() : D.dxmsRules()) : null },
      history: [], status: 'new', kpiStart: null, kpiEnd: null, qNotes: {}, lastScene: 1, ui: {},
      /* T17 (D-27): nhân sự chỉ định theo bước của luồng — { bước: [persona] }, lấy từ ĐXMS lúc start; bước không có / null = giao theo vai mặc định như cũ. */
      members: null,
      /* T17 B2 (SCR-98): lịch sử Bổ sung / Thay người của luồng — mỗi lần một bản ghi (D-29, plan §4). */
      memberLog: [],
    };
  }

  /* Dữ liệu không thuộc riêng hồ sơ chạy luồng — giữ qua các lần tạo hồ sơ mới (ĐXMS, KĐT, hồ sơ Điều chỉnh / KĐT đã tạo, ý kiến ❓). */
  const CARRY = ['qNotes', 'dxmsUser', 'dxmsEdit', 'dxmsDel', 'adj', 'kdtUser', 'kdtEdit', 'kdtDel', 'kdtCases'];
  const carry = (from, to) => { CARRY.forEach((k) => { if (from && from[k] != null) to[k] = from[k]; }); return to; };

  /* ĐXMS của luồng demo khi nhảy cảnh (dữ liệu hồ sơ mẫu §2.3). */
  const demoDxms = () => ({ code: D.dxmsCode0, title: D.caseInfo.title, unit: D.caseInfo.unit, priority: D.caseInfo.priority, est: D.aiEstimate,
    period: D.caseInfo.period, secret: false, purpose: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển trạm gNodeB thế hệ 2.',
    creator: 'Nguyễn Văn Minh', created: '01/10/2026', updated: '01/10/2026' });

  /* Mã hồ sơ đã dùng (mẫu, đã tạo, đang chạy, đã chuyển quy trình). Hồ sơ Phê duyệt đầu tiên giữ 4 số của ĐXMS; còn lại lấy số trống từ 0127. */
  function usedCodes() {
    return new Set(D.otherCases.map((c) => c.code).concat(S.adj.map((c) => c.code), S.archived.map((c) => c.code), S.code ? [S.code] : [], D.caseCodes.slice(1),
      D.kdtCases.map((c) => c.code), S.kdtCases.map((c) => c.code)));
  }
  /* parent = mã ĐXMS hoặc mã KĐT; hồ sơ Phê duyệt đầu tiên giữ 4 số của đối tượng cha. */
  function nextCaseCode(parent, kind) {
    const used = usedCodes();
    const own = 'HS-2026-' + parent.slice(-4);
    if (kind === 'PD' && !used.has(own)) return own;
    for (let n = 127; ; n++) { const c = 'HS-2026-' + String(n).padStart(4, '0'); if (!used.has(c)) return c; }
  }
  function nextKdtCode() {
    const used = new Set(D.kdtList.map((x) => x.code).concat(S.kdtUser.map((x) => x.code)));
    if (!used.has(D.kdtCode0)) return D.kdtCode0;
    for (let n = 34; ; n++) { const c = 'KĐT-2026-' + String(n).padStart(4, '0'); if (!used.has(c)) return c; }
  }
  function nextDxmsCode() {
    const used = new Set(D.dxmsList.map((x) => x.code).concat(S.dxmsUser.map((x) => x.code)));
    if (!used.has(D.dxmsCode0)) return D.dxmsCode0;
    for (let n = 127; ; n++) { const c = 'ĐXMS-2026-' + String(n).padStart(4, '0'); if (!used.has(c)) return c; }
  }

  /* Lưu ở SCR-25 = sinh mã hồ sơ + start instance của quy trình đã chọn; task 1 giao cho người tạo.
     Dữ liệu mẫu (danh mục, báo giá, BM-04…) theo ĐXMS của hồ sơ (D.useCase — plan MS01.02/.03 §8.3 việc 3). */
  function start(opts) {
    opts = opts || {};
    if (fam() === 'MS13') return startKdt(opts);
    if (fam() === 'MS02') return startAdj(opts);
    S.dxms = opts.dxms || D.dxmsCode0;
    D.useCase(S.dxms);
    if (!Flow.findDxms(S.dxms)) S.dxmsUser.push(demoDxms());
    S.code = opts.code || nextCaseCode(S.dxms, 'PD');
    S.name = opts.name || null;
    S.status = 'running';
    S.persona = 'minh';
    const own = Flow.findDxms(S.dxms);
    S.members = own && own.members ? JSON.parse(JSON.stringify(own.members)) : null;
    log('START', { system: true, action: `Khởi tạo ${S.code} theo quy trình ${S.vars.process}` });
    enter(1, {});
  }

  /* Hồ sơ đã hoàn thành của ĐXMS (mới nhất trước): hồ sơ tạo trên prototype rồi tới hồ sơ mẫu. last = căn cứ của hồ sơ Điều chỉnh (giá trị trước
     điều chỉnh), pd = hồ sơ Phê duyệt — quy trình MS01.02 nghĩa là căn cứ đã được CT/TGĐ Tập đoàn duyệt (D-39). */
  function adjBase(dxms) {
    const done = S.adj.concat(D.otherCases).filter((c) => c.dxms === dxms && c.st === 'done');
    return { last: done[0] || null, pd: done.find((c) => c.kind === 'PD') || null };
  }
  /* Giá trị sau điều chỉnh là giá trị của hồ sơ (màn, văn bản đọc D.caseInfo.total). Gọi lại sau mỗi lần D.useCase. */
  function useAdj() {
    if (S.vars.adj) D.caseInfo = Object.assign({}, D.caseInfo, { total: S.vars.adj.total });
  }
  /* Prototype chạy một hồ sơ: tạo hồ sơ khác thì hồ sơ đang chạy bị thay. Hồ sơ Điều chỉnh (mọi trạng thái) — và khi tạo hồ sơ Điều chỉnh,
     cả hồ sơ đã hoàn thành (căn cứ điều chỉnh) — được giữ vào danh sách hồ sơ ở trạng thái lúc đó, mở ở chế độ xem. */
  function keepLive(withDone) {
    if (S.kdt || !S.code || !['running', 'approved', 'stopped'].includes(S.status)) return;
    if (!S.vars.adj && !(withDone && S.status === 'approved')) return;
    const c = Flow.ci(), ns = S.tokens.map(stepOf).filter(isTask).map(Number);
    S.adj.unshift(Object.assign({ code: c.code, dxms: c.dxms, kind: c.kind, title: c.name, total: c.total, flow: c.flow,
      st: { running: 'processing', approved: 'done', stopped: 'stopped' }[S.status], created: Flow.dateOf(0), updated: Flow.dateOf(S.clock),
      creator: S.creator || D.personas.find((p) => p.id === 'minh').name }, ns.length ? { task: Math.min(...ns) } : {}, c.reason ? { reason: c.reason } : {},
      c.from ? { from: c.from, before: c.before } : {}));
  }
  /* Hồ sơ Điều chỉnh (T21, D-36): Lưu ở SCR-25 = start instance MS02, bước 1 giao người tạo. vars.adj giữ hồ sơ cũ làm căn cứ
     (from, before) và giá trị sau điều chỉnh (total — lúc tạo bằng giá trị hiệu lực, sửa ở bước 4); big / basisTD theo D-39. */
  function startAdj(opts) {
    S.dxms = opts.dxms;
    D.useCase(S.dxms);
    const b = adjBase(S.dxms), before = opts.before != null ? opts.before : b.last ? b.last.total : D.caseInfo.total;
    const total = opts.total != null ? opts.total : before;
    S.vars.adj = { from: b.last ? b.last.code : null, fromFlow: b.last ? b.last.flow : null, before, total, reason: opts.reason || '' };
    S.vars.basisTD = !!(b.pd && b.pd.flow === 'MS01.02');
    S.vars.big = !D.inRange('MS01.03', total, S.vars.th);
    useAdj();
    S.code = opts.code || nextCaseCode(S.dxms, 'DC');
    S.name = opts.name || null;
    S.creator = (D.personas.find((p) => p.id === S.persona) || D.personas[0]).name;
    S.status = 'running';
    S.persona = 'minh';
    const own = Flow.findDxms(S.dxms);
    S.members = own && own.members ? JSON.parse(JSON.stringify(own.members)) : null;
    log('START', { system: true, action: `Khởi tạo ${S.code} — Điều chỉnh ĐXMS theo quy trình MS02 (căn cứ ${S.vars.adj.from || 'ĐXMS đã phê duyệt'})` });
    enter(1, {});
  }

  /* Hồ sơ Phê duyệt KĐT (D-12): Lưu = start instance MS13, bước 1 giao người tạo. Nhóm KĐT chưa xác định tới cổng phân luồng (D-7);
     hồ sơ giữ 3 yếu tố phân luồng của KĐT lúc tạo (factors) và bản chụp ngưỡng KĐT (vars.th). Nhảy cảnh chưa có KĐT mẫu thì tạo sẵn (D.kdtDemo). */
  function startKdt(opts) {
    S.kdt = opts.kdt || opts.dxms || D.kdtCode0;
    D.useCase(S.kdt);
    if (!Flow.findKdt(S.kdt) && S.kdt === D.kdtCode0) S.kdtUser.push(Object.assign({}, D.kdtDemo));
    const k = Flow.findKdt(S.kdt) || {};
    S.vars.factors = { field: k.field, type: k.type, nature: k.nature, est: k.est };
    S.creator = (D.personas.find((p) => p.id === S.persona) || D.personas[0]).name;
    /* KĐT mẫu đang có hồ sơ xử lý (KĐT-2026-0031, cảnh K9): chạy lại đúng hồ sơ đó — danh sách hồ sơ bỏ bản ghi mẫu trùng mã. */
    const sample = D.kdtCases.find((c) => c.kdt === S.kdt && c.st === 'processing');
    S.code = opts.code || (sample ? sample.code : nextCaseCode(S.kdt, 'PD'));
    S.name = opts.name || k.title || D.caseInfo.title;
    S.status = 'running';
    S.persona = 'minh';
    log('START', { system: true, action: `Khởi tạo ${S.code} — Phê duyệt KĐT` });
    enter(1, {});
  }

  /* Cổng phân luồng KĐT theo 04 yếu tố: nhóm theo Ngưỡng phân luồng (lĩnh vực, tính chất tài sản, tổng mức vốn thực tế);
     gộp BM-00 khi đủ 03 điều kiện (P-51): mức vốn MS13, Nguyên chiếc, Trang bị nội bộ. Không ngưỡng nào chứa giá trị → không thuộc MS13 (MS14). */
  function kdtCheck() {
    const k = S.vars.factors || {}, total = D.caseInfo.total, rs = S.vars.th || D.kdtRules();
    const fits = (r) => (r.field === '*' || r.field === k.field) && (r.asset === '*' || r.asset === k.nature);
    const rule = rs.find((r) => fits(r) && total >= r.from && (r.to == null || total < r.to)) || null;
    const group = rule ? rule.procs[0] : 'MS14';
    const conds = [
      { label: 'Mức vốn thuộc MS13', ok: group === 'MS13' },
      { label: 'Tính chất tài sản: Nguyên chiếc', ok: k.nature === 'NGUYEN_CHIEC' },
      { label: 'Loại KĐT: Trang bị nội bộ', ok: k.type === 'TBNB' }];
    return { total, factors: k, rule, ms13: rs.find((r) => fits(r) && r.procs.includes('MS13')) || null, group, conds, merge: conds.every((c) => c.ok) };
  }
  /* Thẩm quyền phê duyệt (bước 13, D-33): đọc danh mục Phân cấp thẩm quyền KĐT theo 04 yếu tố + tổng mức vốn thực tế; ghi vars.cap
     (ct / kdt = VHT / TD, căn cứ). Cổng cấp duyệt G23 / G27 / G30 gọi lại trước trình ký — dữ liệu phân loại đổi thì kết quả đổi theo. */
  function kdtAuth() {
    const r = D.kdtAuthOf(S.vars.factors || {}, D.caseInfo.total, S.vars.auth);
    S.vars.cap = r;
    return r;
  }
  /* Trạng thái KĐT (kdt.js KDT_STAGE) suy từ bước đang chờ của hồ sơ chạy luồng, theo cụm của trang MS13 bản 12/10 (plan T18 §1). */
  function kdtStage() {
    if (S.status === 'moved') return 'MS14';
    if (S.status === 'approved') return 'OK';
    if (S.status === 'stopped') return 'STOP';
    const ns = S.tokens.map(stepOf).filter(isTask).map(Number);
    const m = ns.length ? Math.min(...ns) : 1, gop = S.vars.branch === 'BM00';
    /* Đang ở khối ký chung 75–78: trạng thái theo bước ký đã gọi khối. */
    const n = m >= 75 && S.vars.ky ? Number(S.vars.ky.task) : m;
    /* Tuyến Tập đoàn 63–74: VHT trình / trình lại (63–66, 68–69); Tập đoàn thẩm định, phê duyệt (67, 70–74). */
    if (n >= 63 && n <= 74) return [67, 70, 71, 72, 73, 74].includes(n) ? 'TDTD' : 'TD';
    if (n <= 10 || n === 14) return 'LAP';
    if (n <= 13) return 'PL';
    if (n <= 17) return gop ? 'GOP' : 'CT';
    if (n <= 24) return 'GOP';
    if (n <= 38) return ({ GOP: 'TDGOP', CT: 'TDCT', KDT: 'TDKDT' })[S.vars.td || 'GOP'];
    if (n <= 44) return 'CT';
    if (n <= 46) return 'TDCT';
    if (n <= 48) return 'KYCT';
    if (n <= 53) return 'HS';
    if (n <= 57) return 'TDKDT';
    if (n <= 59) return 'HS';
    if (n === 60) return 'KYQD';
    return 'KYGOP';
  }
  /* Hồ sơ KĐT đang chạy luồng dưới dạng bản ghi của danh sách hồ sơ KĐT; đã chuyển luồng thì kèm hồ sơ mới (MS14) của cùng KĐT. */
  function liveKdt() {
    if (!S || !S.kdt || S.status === 'new') return [];
    const ns = [...new Set(S.tokens.map(stepOf).filter(isTask).map(Number))].sort((a, b) => a - b);
    const priced = S.history.some((h) => String(h.task) === '10' && h.who);
    /* Hồ sơ đã chuyển luồng vẫn là hồ sơ chạy MS13 (như hồ sơ mẫu HS-2026-0018); nhóm đúng nằm ở hồ sơ mới. */
    const rec = { code: S.code, kdt: S.kdt, kind: 'PD', title: S.name, flow: S.status === 'moved' ? 'MS13' : S.vars.group || null, branch: S.vars.branch || null, stage: kdtStage(),
      st: { running: 'processing', approved: 'done', moved: 'moved', stopped: 'stopped' }[S.status], task: ns.length ? ns[0] : null, tasks: ns.length > 1 ? ns : undefined,
      total: priced ? D.caseInfo.total : undefined, created: Flow.dateOf(0), updated: Flow.dateOf(S.clock), creator: S.creator, live: true,
      replacedBy: S.movedTo ? S.movedTo.code : undefined, docs: kdtDocs().map((d) => [d.code, d.at]) };
    if (S.status !== 'moved') return [rec];
    return [{ code: S.movedTo.code, kdt: S.kdt, kind: 'PD', title: S.name, flow: S.movedTo.process, stage: 'MS14', st: 'processing', task: 1, total: D.caseInfo.total,
      created: Flow.dateOf(S.clock), updated: Flow.dateOf(S.clock), creator: S.creator, replaces: S.code, live: true }, rec];
  }
  /* Văn bản đầu ra của hồ sơ KĐT: BM-01 khi TGĐ VHT ký phê duyệt chủ trương (48), BM-14 khi TTMS ký báo cáo thẩm định (57 / 61),
     BM-18 khi TGĐ VHT ký ban hành Quyết định (60) hoặc ký hồ sơ gộp (62), BM-00 khi ký hồ sơ gộp (62). Lấy lần xử lý gần nhất đạt kết quả.
     Tuyến Tập đoàn: công văn trình (65), báo cáo giải trình BM-06 (69) khi VHT ký xong; văn bản Tập đoàn đã ký nhận ở bước 74 (vars.tdDocs). */
  const KDOCS = [['BM-01', 48, /^Ký phê duyệt/], ['BM-14', 57, /^Ký báo cáo/], ['BM-14', 61, /^Ký báo cáo/], ['BM-18', 60, /^Ký ban hành/],
    ['BM-00', 62, /^Ký phê duyệt/], ['BM-18', 62, /^Ký phê duyệt/], ['CV-TD', 65, /^Ký công văn/], ['BM-06', 69, /^Ký trình/]];
  function kdtDocs() {
    const vhtDocs = KDOCS.map(([code, by, ok]) => {
      if (S.vars.ky && String(S.vars.ky.task) === String(by)) return null;
      const h = S.history.filter((x) => String(x.task) === String(by) && x.who && ok.test(x.action)).pop();
      return h ? { code, by, at: Flow.dateOf(h.t) } : null;
    }).filter(Boolean);
    return vhtDocs.concat((S.vars.tdDocs || []).map((d) => ({ code: d.code, by: 74, at: Flow.dateOf(d.t), td: true })));
  }
  /* Văn bản Tập đoàn ký theo loại hồ sơ trình (DG-MS13 bước 73, 74): chủ trương — BM-01 có chân ký các Ban; KĐT — BM-14 + BM-18; gộp — BM-00 + BM-14 + BM-18. */
  const TD_DOCS = { CT: ['BM-01'], KDT: ['BM-14', 'BM-18'], GOP: ['BM-00', 'BM-14', 'BM-18'] };
  /* Tạo hồ sơ khác khi đang chạy một hồ sơ KĐT: giữ hồ sơ KĐT cũ ở trạng thái hiện tại trong danh sách hồ sơ của KĐT. */
  function freezeKdt() {
    if (S && S.kdt && S.status !== 'new') S.kdtCases = liveKdt().map((c) => Object.assign({}, c, { live: false })).concat(S.kdtCases);
  }

  /* Vai đang đăng nhập và dữ liệu CARRY đi theo khi đổi S giữa luồng chính và hồ sơ con. */
  const passOn = (from, to) => { carry(from, to); to.persona = from.persona; return to; };
  function saveCases() { try { localStorage.setItem(CASES_KEY, JSON.stringify(CASES)); } catch (e) { /* bỏ qua */ } }
  function save() {
    if (MAIN) { passOn(S, MAIN); saveCases(); }
    try { localStorage.setItem(KEY, JSON.stringify(MAIN || S)); } catch (e) { /* bỏ qua */ }
  }
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* bỏ qua */ }
    return null;
  }
  function loadCases() {
    try { return JSON.parse(localStorage.getItem(CASES_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function emit() { save(); listeners.forEach((fn) => fn(S)); }

  /* Dữ liệu mẫu theo đối tượng cha của S luồng chính — gọi khi khởi động và khi rời hồ sơ con. */
  function useMainCase() {
    D.useCase(S.kdt || S.dxms || demoSet().dxms || demoSet().kdt);
    useAdj();
  }
  /* Về luồng chính. Không emit: gọi trong lúc đổi route, trước khi vẽ màn. */
  function toMain() {
    if (!MAIN) return;
    const m = MAIN;
    passOn(S, m);
    saveCases();
    S = m;
    MAIN = null;
    useMainCase();
    save();
  }
  /* Nạp S của hồ sơ con `code`. Trả về false nếu không có hồ sơ đó. */
  function openCase(code) {
    const next = CASES[code];
    if (!next) return false;
    if (next === S) return true;
    if (!MAIN) MAIN = S;
    passOn(S, next);
    S = next;
    save();
    return true;
  }
  /* Tạo hồ sơ con và start instance: o = { code, parent (mã hợp đồng), name, at (bước bắt đầu, mặc định 1), vars, clock }.
     Trả về mã hồ sơ; hồ sơ con trùng mã (chạy lại demo) được thay. */
  function openNew(process, o) {
    const next = passOn(S, fresh(process));
    if (!MAIN) MAIN = S;
    next.clock = o.clock != null ? o.clock : S.clock;
    S = next;
    Object.assign(S, { code: o.code, name: o.name || null, parent: o.parent || null, status: 'running' });
    if (o.ui) S.ui = JSON.parse(JSON.stringify(o.ui));
    Object.assign(S.vars, o.vars || {});
    CASES[o.code] = S;
    log('START', { system: true, action: `Khởi tạo ${o.code} theo quy trình ${process}` });
    enter(o.at != null ? o.at : 1, {});
  }
  function startCase(process, o) {
    openNew(process, o);
    emit();
    return o.code;
  }
  /* Route quyết định S nào đang nạp: việc (task/<mã hồ sơ con>:k…) và chi tiết hồ sơ con (ho-so-hd/<mã>) nạp hồ sơ đó, route khác về luồng chính. */
  function focus(route) {
    const m = /^(?:task\/([^/:]+):|ho-so-hd\/([^/]+))/.exec(route || '');
    if (!m || !openCase(m[1] || m[2])) toMain();
  }
  /* Quy trình kế tiếp tự khởi tạo khi hồ sơ con kết thúc (MS22 ký xong → MS23): start trong kho, S vẫn là hồ sơ vừa xong. */
  function spawnNext() {
    const nx = S.parent && (D.hdProcesses[fam()] || {}).then;
    if (nx) spawnCase(nx(S, Flow.dateOf(S.clock)));
  }
  /* Khởi tạo hồ sơ con từ một bước của hồ sơ đang nạp (G1 của MS23.03 → MS23.04); đã có thì thôi (quay lại bước 6). */
  function spawnCase(o) {
    if (!o) return;
    const many = D.hdProcesses[o.process].many, n = many ? Flow.cases(S.parent).filter((c) => c.vars.process === o.process).length + 1 : undefined, code = D.hdCaseCode(S.parent, o.process, n);
    if (CASES[code]) return;
    const cur = S;
    openNew(o.process, { code, parent: S.parent, at: o.at, vars: o.vars, ui: o.ui, clock: o.clock, name: o.name || (many && D.hdProcesses[o.process].start ? `${D.hdProcesses[o.process].start.name} ${String(n).padStart(2, '0')}` : null) });
    S = cur;
  }
  /* Tín hiệu giữa các hồ sơ con cùng hợp đồng (G2, G3; thật: message correlate theo mã hợp đồng). Ghi nhận vào vars.sig_<tên>, hồ sơ đang chờ thì đi tiếp. */
  function sendSignal(process, name) {
    const c = CASES[D.hdCaseCode(S.parent, process)];
    if (!c) return;
    const cur = S, src = S.ui || {};
    S = c;
    S.vars['sig_' + name] = true;
    const to = D.hdSignals[process][name](S.vars, S.ui || {}, src, cur);
    if (to != null) enter(to, {});
    S = cur;
  }
  /* Tham số tạo hồ sơ có `start` trong D.hdProcesses (MS23.03, MS23.01): đồng hồ bắt đầu từ ngày start.date đọc ở hồ sơ theo dõi. Quy trình many: mã kế tiếp, không sớm hơn hồ sơ trước. */
  function hdOpts(process, hd, more) {
    const P = D.hdProcesses[process], p = P.start, prev = P.many ? Flow.cases(hd).filter((c) => c.vars.process === process) : [], n = prev.length + 1;
    return Object.assign({ code: D.hdCaseCode(hd, process, n), parent: hd, name: P.many ? `${p.name} ${String(n).padStart(2, '0')}` : p.name, at: p.at,
      clock: Math.max(Flow.clockOf(p.date(CASES[D.hdCaseCode(hd, 'MS23')].vars)), ...prev.map((c) => c.clock)), vars: Object.assign({}, p.vars) }, more);
  }
  /* Sự kiện vào hồ sơ đang nạp (MS23 Tổng quan): nhánh độc lập, không phải bước kế tiếp của nhánh khác. */
  function fireEvent(key, data) {
    S.vars.evt = data || {};
    enter(key, {});
  }
  /* Tua hồ sơ con của bộ demo Hợp đồng (D-48): tạo lại hồ sơ, đi theo nhánh chính tới bước `target`; 'NEW' = xoá hồ sơ, về trước bước Tạo hồ sơ. Luồng chính giữ nguyên.
     set.base: bộ của quy trình đi sau (MS23, MS24 sau MS22) — chạy xong quy trình nền ('BASE' = dừng ở đây); hồ sơ đã tự sinh thì nạp và phát các sự kiện của cảnh (evts), chưa có thì tạo; rồi mới tua. */
  function ffCase(target, set, ui, settle, pre, evts) {
    toMain();
    S.demoKey = set.key;
    Flow.cases(set.hd).forEach((c) => { delete CASES[c.code]; });
    if (target === 'NEW') { saveCases(); return; }
    if (set.base) {
      openNew(set.base, { code: D.hdCaseCode(set.hd, set.base), parent: set.hd, clock: D.hdCaseClock });
      advanceTo('END');
      if (set.baseEvts) { openCase(D.hdCaseCode(set.hd, 'MS23')); set.baseEvts.forEach((e) => fireEvent(e.key, e.data)); }
      if (target === 'BASE') return;
      /* Lộ trình qua nhiều hồ sơ con (MS23.03 + .04): mỗi chặng [quy trình, bước đích, ui, biến lúc tạo]. */
      if (pre && pre.legs) {
        pre.legs.forEach(([p, to, u, vs, via]) => {
          const code = D.hdCaseCode(set.hd, p);
          if (!CASES[code]) { const o = hdOpts(p, set.hd, u ? { ui: u } : {}); Object.assign(o.vars, vs); openNew(p, o); } else { openCase(code); if (u) Object.assign(S.ui, u); }
          /* via: nút không phải nhánh chính phải bấm trên đường tới đích [bước, đầu nhãn]; không có nhãn = next của bước. */
          (via || []).forEach(([t, label]) => { advanceTo(t); const tok = S.tokens.find((x) => String(x.task) === String(t)); completeStep(tok.id, label ? choicesOf(t).find((c) => c.label.startsWith(label)) : null, 'Theo kết quả kiểm tra'); });
          advanceTo(to);
        });
        return;
      }
      const code = D.hdCaseCode(set.hd, set.key);
      if (!CASES[code]) openNew(set.key, { code, parent: set.hd, name: (D.hdPayPlan[set.hd][set.vars.dot] || {}).name, ui, vars: Object.assign({}, set.vars, pre) });
      else {
        openCase(code);
        /* Sự kiện trước xử lý xong rồi mới tới sự kiện sau; việc của sự kiện cuối do tua bên dưới quyết định. */
        (evts || []).forEach((e, i) => { if (i) advanceTo('END'); fireEvent(e.key, e.data); });
      }
    } else openNew(set.key, { code: D.hdCaseCode(set.hd, set.key), parent: set.hd, clock: D.hdCaseClock, ui, vars: pre });
    advanceTo(target, settle);
  }
  /* Xoá toàn bộ hồ sơ con (Reset luồng). */
  function clearCases() {
    CASES = {};
    MAIN = null;
    try { localStorage.removeItem(CASES_KEY); } catch (e) { /* bỏ qua */ }
  }

  /* Task BPMN của quy trình (MS01: 1–61, 10a, 10b); các khoá khác trong định nghĩa luồng là cổng / điểm nối của prototype. */
  const isTask = (k) => Object.prototype.hasOwnProperty.call(T(), String(k));
  const taskName = (k) => (isTask(k) ? T()[k].name : k);
  /* Bản 12/10 bỏ quy trình con 41 / 49 (D-32): khối 25–38 là khối chung theo vòng, token mang đúng số bước. */
  const stepOf = (t) => t.task;
  /* Bộ đếm theo vòng thẩm định (vars.td: GOP = BM-00, CT = BM-01, KDT = BM-03 — đếm riêng mỗi vòng, giữ khi bổ sung / trình lại):
     chk = số lượt ĐVĐX bổ sung / giải trình (bước 31), meet = số lần họp (bước 33 tăng). */
  const tdOf = () => S.vars.td || 'GOP';
  function bump(k) { const o = Object.assign({}, S.vars[k]); o[tdOf()] = (o[tdOf()] || 0) + 1; S.vars[k] = o; }
  /* Số lượt CQCM chủ trì đã thẩm định (bước 27) trong vòng hiện tại — chỉ số lượt của ý kiến mẫu (D.kdtReview). */
  const tdRound = () => S.history.filter((h) => String(h.task) === '27' && h.who && (h.td || 'GOP') === tdOf()).length;

  /* Cổng "Giá trị khớp quy trình đã chọn?" sau task 10. Mặc định P-26: tổng giá trị gồm VAT, sau khi trừ tồn kho.
     Ngưỡng = bản chụp Ngưỡng phân luồng lúc tạo hồ sơ (P-34); trạng thái lưu từ bản cũ chưa có bản chụp thì đọc bảng hiện tại. */
  const rules = () => S.vars.th || D.dxmsRules();
  function matchCheck() {
    const total = D.caseInfo.total;
    return { total, ok: D.inRange(S.vars.process, total, rules()), process: S.vars.process, suggest: suggestProcess(total), cond: D.procCond(S.vars.process, rules()) };
  }
  /* Quy trình đúng theo ngưỡng chứa giá trị; ngưỡng áp cho cả MS01.01 và MS01.02 thì chọn theo cờ "căn cứ đã được CT/TGĐ TĐ duyệt"
     của căn cứ đang chọn ở task 1. Không ngưỡng nào chứa giá trị → giữ quy trình đang chọn. */
  function suggestProcess(total) {
    const r = rules().find((x) => total >= x.from && (x.to == null || total < x.to));
    if (!r) return S.vars.process;
    if (r.procs.length === 1) return r.procs[0];
    const doc = D.basisDocs.find((d) => d.id === ((S.ui || {}).basisDoc || D.caseRef.basisDoc));
    const want = doc && doc.group ? 'MS01.02' : 'MS01.01';
    return r.procs.includes(want) ? want : r.procs[0];
  }
  /* Điều kiện của quy trình theo ngưỡng hồ sơ đang giữ. */
  const condOf = (process) => D.procCond(process, rules());

  function whoFor(key, ctx) {
    const w = F()[key] && F()[key].who;
    if (!w) return null;
    /* Khối ký chung (77): người ký của bước ký đang đi qua khối (vars.ky). */
    if (w.startsWith('ky:')) return (S.vars.ky || {})[w.slice(3)] || null;
    if (w.startsWith('cqcm:')) {
      const c = window.D.cqcm.find((x) => x.id === ctx.cqcm);
      return c ? c[w.slice(5)] : null;
    }
    return w;
  }

  function log(key, entry) {
    S.history.push(Object.assign({ task: key, t: S.clock }, S.vars.td ? { td: S.vars.td } : {}, entry));
  }

  /* Đưa luồng vào `key` với ngữ cảnh (group, cqcm). Task hệ thống chạy ngay rồi đi tiếp. */
  function enter(key, ctx) {
    ctx = ctx || {};
    if (key === 'END' || key === 'END_OTHER') {
      S.status = key === 'END' ? 'approved' : 'stopped';
      const endKdt = (S.vars.tdKind && S.vars.tdKind !== 'CT' ? 'Kết thúc — hoàn tất phê duyệt cấp Tập đoàn: ' : 'Kết thúc — ')
        + (S.vars.branch === 'BM00' ? 'hồ sơ gộp BM-00 đã ký duyệt' : 'Quyết định phê duyệt KĐT');
      log(key, { system: true, action: key === 'END' ? (S.parent ? S.vars.endText || (D.hdProcesses[fam()] || {}).end : S.kdt ? endKdt : 'Kết thúc — ĐXMS đã phê duyệt') : 'Kết thúc theo chỉ đạo khác' });
      if (key === 'END') spawnNext();
      return;
    }
    if (key === 'END_MOVED') {
      S.status = 'moved';
      log(key, { system: true, action: S.kdt ? `Kết thúc — chuyển luồng ${S.movedTo.process}, hồ sơ mới ${S.movedTo.code}` : `Kết thúc — đã chuyển quy trình, được thay bởi ${S.movedTo.code}` });
      return;
    }
    const f = F()[key] || {};
    /* Bước chưa dựng: token đứng yên ở đây (MS13 bản 12/10 đã dựng đủ 78 bước — T18 B4). */
    if (f.wip) {
      log(key, { system: true, action: 'Bước chưa dựng trên prototype' });
      addToken(key, ctx);
      return;
    }
    /* 76 Trình và nhận kết quả ký VOffice (service): gửi hồ sơ, callback trả trạng thái + PDF đã ký → G3. Giả lập lỗi gửi (ui.voFail, P-94):
       token ở 76 cho người trình, nút Gửi lại chạy lại bước này. D-50: f.vo = true là VOffice; f.vo = 'VContract' là cùng cơ chế qua VContract. */
    if (f.vo) {
      const k = S.vars.ky || {}, ch = f.vo === true ? 'VOffice' : f.vo;
      if (S.ui && S.ui.voFail) {
        S.ui.voFail = false;
        log(key, { system: true, action: `Lỗi gửi ${ch} — ${k.doc} chưa trình được (P-94)` });
        addToken(key, ctx, k.by);
        return;
      }
      log(key, { system: true, action: `Trình ký ${ch} ${k.doc} — đã nhận callback, lưu PDF đã ký` });
      return enter(f.next, ctx);
    }

    if (f.join) {
      const others = S.tokens.filter((t) => t.group === f.join);
      if (others.length > 0) {
        log(key, { system: true, action: `Chờ đủ phiếu (${others.length} bên còn đang xử lý)`, cqcm: ctx.cqcm });
        return;
      }
      ctx = {};
    }

    if (f.forkTo) {
      f.forkTo.forEach((b) => addToken(b.task, { group: f.group }, b.who));
      return;
    }
    if (f.fork) {
      if (isTask(key)) log(key, { system: true, action: T()[key].name });
      if (f.kpiStart && S.kpiStart === null) S.kpiStart = S.clock;
      const sel = Flow.cqcmSel();
      window.D.cqcm.filter((c) => sel.includes(c.id)).forEach((c) => addToken(f.to, { group: f.fork, cqcm: c.id }));
      (f.also || []).forEach((b) => addToken(b.task, { group: f.fork }, b.who));
      return;
    }

    /* Service task lỗi giả lập (MS24 bước 20, P-125): token dừng ở bước này cho người phụ trách, nút Gửi lại chạy lại bước — như VOffice P-94. */
    if (f.retry && S.ui && S.ui[f.retry.flag]) {
      S.ui[f.retry.flag] = false;
      log(key, { system: true, action: f.retry.fail });
      addToken(key, ctx, f.retry.who);
      return;
    }

    /* Task hệ thống chạy ngay; cổng (gw) chỉ chọn nhánh, không ghi nhật ký. */
    const isService = isTask(key) && T()[key].type === 'service';
    if (isService || f.gw) {
      if (f.td) S.vars.td = f.td;
      if (f.bump) bump(f.bump);
      /* G3 "Đã ghi nhận kết quả ký?" → E1 trở về bước ký của luồng chính: đi tiếp theo nút đã chọn ở bước đó (vars.ky.to). */
      if (f.kyReturn) {
        const k = S.vars.ky;
        S.vars.kyLog = (S.vars.kyLog || []).concat([{ task: k.task, doc: k.doc, mode: k.mode, t: S.clock }]);
        delete S.vars.ky;
        return enter(k.to, ctx);
      }
      if (f.run) f.run(S.vars, S.ui || (S.ui = {}));
      if (f.spawn) spawnCase(f.spawn(S.vars));
      if (f.signal) sendSignal(...f.signal);
      /* Nhánh sự kiện kết thúc ở đây, hồ sơ vẫn chạy (MS23 Tổng quan không có sự kiện kết thúc chung — DG-MS23 §C.8). */
      if (f.stop) { if (isService) log(key, { system: true, action: T()[key].name, t: S.clock }); return; }
      if (isService) {
        const a = f.auth ? kdtAuth() : null;
        /* 66 chuyển hồ sơ lên Tập đoàn theo hình thức ký công văn (65) — P-99; 74 nhận văn bản Tập đoàn đã ký theo loại hồ sơ trình. */
        const k65 = f.tdSend ? (S.vars.kyLog || []).filter((x) => String(x.task) === '65').pop() : null;
        const extra = a ? ` — chủ trương: ${D.kdtLevels[a.ct]}, KĐT: ${D.kdtLevels[a.kdt]} (${a.basis})`
          : f.tdSend ? (k65 && k65.mode === 'hard' ? ' — chuyển bộ hồ sơ giấy, bản scan đã cập nhật ở bước 78' : ' — gửi qua tích hợp VOffice, nhận trạng thái')
          : f.tdResult ? ` — ${TD_DOCS[S.vars.tdKind || 'KDT'].join(', ')} đã ký, lưu PDF` : '';
        log(key, { system: true, action: T()[key].name + extra, cqcm: ctx.cqcm, t: ctx.t != null ? ctx.t : S.clock });
        if (f.tdResult) S.vars.tdDocs = (S.vars.tdDocs || []).concat(TD_DOCS[S.vars.tdKind || 'KDT'].map((code) => ({ code, kind: S.vars.tdKind, t: ctx.t != null ? ctx.t : S.clock })));
      }
      /* Cổng cấp duyệt đã xác định (G23 chủ trương, G27 KĐT, G30 hồ sơ gộp — gộp lên Tập đoàn khi một trong hai thuộc Tập đoàn). */
      if (f.capGate) {
        const a = kdtAuth(), g = f.capGate;
        const lv = g.of === 'CT' ? a.ct : g.of === 'KDT' ? a.kdt : (a.ct === 'TD' || a.kdt === 'TD' ? 'TD' : 'VHT');
        /* Ra Tập đoàn: ghi loại hồ sơ trình (G34 / G36 đọc) và các loại đã trình (timeline). */
        if (lv === 'TD') Object.assign(S.vars, { tdKind: g.of, tdKinds: [...new Set((S.vars.tdKinds || []).concat(g.of))] });
        return enter(lv === 'TD' ? g.td : g.vht, {});
      }
      if (f.moves) S.movedTo = S.kdt ? { code: nextCaseCode(S.kdt, 'PD'), process: S.vars.group || 'MS14' } : { code: D.caseCodes[1], process: matchCheck().suggest };
      if (f.groupGate) {
        const r = kdtCheck();
        Object.assign(S.vars, { group: r.group, branch: r.group === 'MS13' ? (r.merge ? 'BM00' : '2GD') : null });
        S.vars.checks.push({ t: ctx.t != null ? ctx.t : S.clock, total: r.total, group: r.group });
        return enter(r.group === 'MS13' ? f.groupGate.yes : f.groupGate.no, {});
      }
      if (f.mergeGate) {
        const r = kdtCheck();
        S.vars.branch = r.merge ? 'BM00' : '2GD';
        /* Giai đoạn thẩm định sau cổng gộp: hồ sơ gộp (GOP) hoặc chủ trương (CT; KĐT đặt ở bước 45). */
        S.vars.td = r.merge ? 'GOP' : 'CT';
        return enter(r.merge ? f.mergeGate.yes : f.mergeGate.no, {});
      }
      if (f.when) return enter(f.when(S.vars, S.ui || {}), {});
      if (f.matchGate) {
        const r = matchCheck();
        S.vars.checks.push({ t: ctx.t != null ? ctx.t : S.clock, total: r.total, process: r.process, ok: r.ok, suggest: r.suggest });
        if (!r.ok) return enter(f.matchGate.miss, {});
        return enter(r.process === 'MS01.03' ? f.matchGate.small : f.matchGate.big, {});
      }
      if (f.round) S.vars.round += 1;
      if (f.roundGate) return enter(S.vars.round > 2 ? f.roundGate.over : f.roundGate.under, {});
      if (f.varGate) {
        const [v, map] = Object.entries(f.varGate)[0];
        return enter(map[String(!!S.vars[v])], {});
      }
      return enter(f.next, ctx);
    }
    addToken(key, ctx);
  }

  /* Người nhận task theo chỉ định của luồng (T17 D-27): S.members = { bước: [người] }. Bước có chỉ định thì task giao mọi người đã chọn
     (candidate users = username thay roleCode, như BE replaceCandidateUsers), `who` = người đầu tiên; bước không chỉ định giao theo vai trò như quy trình. */
  function candsOf(key) {
    const list = S.members && S.members[String(key)];
    return list && list.length ? list.slice() : null;
  }
  function addToken(key, ctx, who) {
    S.seq += 1;
    const w = who || whoFor(key, ctx), cands = candsOf(key);
    /* Hồ sơ con: mã việc kèm mã hồ sơ để route task/<mã> tìm đúng hồ sơ (D-47). */
    S.tokens.push(Object.assign({ id: (S.parent ? S.code + ':' : '') + 'k' + S.seq, task: key, group: ctx.group || null, cqcm: ctx.cqcm || null,
      who: cands ? cands[0] : w, since: ctx.t != null ? ctx.t : S.clock }, cands ? { cands } : {}));
  }

  /* Mỗi token mang mốc thời gian của nhánh mình (since). Việc song song (các CQCM, Tài chính ‖ TTMS) vì thế
     không cộng dồn; đồng hồ chung là lúc bên chậm nhất xong, và điểm join tiếp tục từ mốc đó. */
  function advanceClock(tok, f) {
    const fin = Math.round((tok.since + (f.nlv || 0.5)) * 100) / 100;
    S.clock = Math.max(S.clock, fin);
    return fin;
  }

  /* Khối ký chung (D-34, D-50; Camunda: call activity DTMS_KY_CHUNG, biến hinhThucKy, mat). Quy trình nào có khối ký thì khai báo ở D.kyConf
     { choose: bước ghi hình thức, soft: bước ký điện tử, hard: bước ký bản cứng, vcontract: bước ký VContract nếu có }. Nút ký (`sign`, P-91) không đi thẳng tới đích
     mà vào khối: Mật → hard (bắt buộc bản cứng); không Mật → chọn hình thức (prototype: hộp thoại Trình ký của bước ký — điểm tự quyết T18 B3-1)
     → bước theo hình thức → G3 → về bước chính (vars.ky.to). Mật = lựa chọn ở bước 4 (ui.secret), chưa chọn thì theo KĐT. */
  const isMat = () => (S.ui && S.ui.secret != null ? !!S.ui.secret : !!(Flow.findKdt(S.kdt) || {}).secret);
  const kyConf = () => D.kyConf[fam()] || null;
  const viaKy = (choice) => !!(kyConf() && choice && choice.sign);
  const KY_NAME = { soft: 'VOffice', hard: 'Bản cứng', vcontract: 'VContract' };
  function kySign(tok, choice, mode, ctx) {
    const c = kyConf(), mat = isMat(), m = mat || mode === 'hard' ? 'hard' : mode === 'vcontract' && c.vcontract != null ? 'vcontract' : 'soft';
    S.vars.ky = { task: tok.task, doc: choice.sign, to: choice.to, by: tok.who, signer: tok.who, mode: m, mat };
    if (!mat) log(c.choose, { who: tok.who, action: `Chọn hình thức ký ${choice.sign}: ${KY_NAME[m]}` });
    enter(c[m], ctx);
  }

  /* Hoàn thành token bằng lựa chọn `choice` (object trong F()[key].choices, hoặc null = next mặc định). */
  function complete(tokenId, choice, reason, sign) { completeStep(tokenId, choice, reason, sign); emit(); }
  /* Không emit: emit vẽ lại màn, route có thể nạp hồ sơ khác giữa lúc tua demo (ffCase via). */
  function completeStep(tokenId, choice, reason, sign) {
    const tok = S.tokens.find((t) => t.id === tokenId);
    if (!tok) return;
    const f = F()[tok.task];
    const fin = advanceClock(tok, f);
    S.tokens = S.tokens.filter((t) => t.id !== tokenId);
    const label = choice ? choice.label : (f.actionLabel || 'Hoàn thành');
    /* D-50: bước của bên ngoài hệ thống (f.external, vd. NCC ký): người xử lý chỉ ghi nhận kết quả, không có tài khoản bên ngoài đăng nhập. */
    log(tok.task, Object.assign({ who: tok.who, action: label, reason: reason || null, cqcm: tok.cqcm, since: tok.since }, f.external ? { party: f.external } : {}));
    if (f.round) S.vars.round += 1;
    if (f.bump) bump(f.bump);
    if (choice && choice.set) Object.assign(S.vars, choice.set);
    if (f.kpiEnd && choice && choice.label === (mainChoice(tok.task) || {}).label) S.kpiEnd = S.clock;
    let ctx = { group: tok.group, cqcm: tok.cqcm, t: fin };
    if (choice && choice.cancelGroup) {
      S.tokens = S.tokens.filter((t) => t.group !== tok.group);
      ctx = {};
    }
    if (viaKy(choice)) kySign(tok, choice, sign && sign.mode, ctx);
    else enter(choice ? choice.to : f.next, ctx);
  }

  /* Hồ sơ đi nhánh < 160 tỷ (MS01.03): nhãn / văn bản ký / màn thay thế theo `small`, `scrSmall` của D.flow. */
  const isSmall = () => S.vars.big === false;
  const choiceOf = (c) => (c && c.small && isSmall() ? Object.assign({}, c, c.small, { small: null }) : c);
  const choicesOf = (key) => (F()[key].choices || []).map(choiceOf);
  const scrOf = (key) => (isSmall() && F()[key].scrSmall) || F()[key].scr;

  /* Nút chính của task: `mainWhen(vars, ui)` (tuỳ trạng thái) được ưu tiên hơn cờ `main`. */
  function mainChoice(key) {
    const f = F()[key];
    if (!f.choices) return null;
    return choicesOf(key).find((c) => (c.mainWhen ? c.mainWhen(S.vars, S.ui) : c.main)) || null;
  }

  /* Bộ demo (D.demoSets): theo ĐXMS của hồ sơ đang chạy; chưa có hồ sơ thì theo bộ vừa chọn ở công cụ demo. */
  const setOf = (key) => D.demoSets.find((d) => d.key === key) || D.demoSets[0];
  const demoSet = () => (S.parent && MAIN && MAIN.demoKey && setOf(MAIN.demoKey).hd === S.parent && setOf(MAIN.demoKey)) || (S.parent && D.demoSets.find((d) => d.hd === S.parent && d.key === fam())) || (S.demoKey && setOf(S.demoKey).hd && setOf(S.demoKey))
    || (S.dxms && D.demoSets.find((d) => d.dxms === S.dxms || (d.also || []).includes(S.dxms)))
    || (S.kdt && D.demoSets.find((d) => d.kdt === S.kdt || (d.also || []).includes(S.kdt))) || setOf(S.demoKey);

  /* Tua nhanh từ đầu theo nhánh chính cho tới khi có token ở task `target` (hoặc kết thúc).
     dxms = ĐXMS của hồ sơ (bộ dữ liệu mẫu); ui = lựa chọn đặt sẵn trên màn (vd. ĐVĐX bảo lưu ý kiến ở task 26);
     pre = biến đặt ngay sau khi khởi tạo, trước khi tua (vd. bản chụp danh mục Phân cấp thẩm quyền KĐT — vars.auth). */
  function fastForward(target, process, dxms, ui, settle, pre) {
    toMain();
    const key =(D.demoSets.find((d) => d.dxms === (dxms || D.dxmsCode0) || d.kdt === dxms || (d.also || []).includes(dxms)) || D.demoSets[0]).key;
    S = carry({ qNotes: S ? S.qNotes : {} }, fresh(process || 'MS01.01'));
    S.demoKey = key;
    if (ui) S.ui = JSON.parse(JSON.stringify(ui));
    if (target === 'NEW') { S.vars.process = null; D.useCase(dxms || D.dxmsCode0); return; }
    /* pre.adj (bộ Điều chỉnh MS02): giá trị / lý do sau điều chỉnh truyền vào startAdj như đã xác nhận ở bước 4. */
    const p = pre ? JSON.parse(JSON.stringify(pre)) : null, adj = p && p.adj;
    if (p) delete p.adj;
    start(Object.assign({ dxms }, adj || {}));
    if (p) Object.assign(S.vars, p);
    advanceTo(target, settle);
  }
  function advanceTo(target, settle) {
    let guard = 0;
    while (S.status === 'running' && guard++ < 400) {
      /* settle: đã tới task đích nhưng còn nhánh song song khác → làm xong nhánh đó trước (vd. Ban Tài chính đã xác nhận khi TTMS mở bước 12). */
      const at = (t) => String(t.task) === String(target);
      const hit = target !== 'END' && S.tokens.some(at);
      if (hit && !(settle && S.tokens.some((t) => !at(t)))) break;
      const tok = hit ? S.tokens.find((t) => !at(t)) : S.tokens[0];
      if (!tok) break;
      const f = F()[tok.task];
      if (f.wip) break;
      const c = mainChoice(tok.task);
      const fin = advanceClock(tok, f);
      S.tokens = S.tokens.filter((t) => t.id !== tok.id);
      log(tok.task, { who: tok.who, action: c ? c.label : (f.actionLabel || 'Hoàn thành'), cqcm: tok.cqcm, ff: true });
      if (f.round) S.vars.round += 1;
      if (f.bump) bump(f.bump);
      if (c && c.set) Object.assign(S.vars, c.set);
      if (f.kpiEnd && c) S.kpiEnd = S.clock;
      const ctx = { group: tok.group, cqcm: tok.cqcm, t: fin };
      if (viaKy(c)) kySign(tok, c, null, ctx); else enter(c ? c.to : f.next, ctx);
    }
  }

  /* ---------- API ---------- */
  const Flow = {
    get state() { return S; },
    init() {
      S = load();
      if (!S || !S.tokens) { S = fresh(); save(); }
      /* Trạng thái lưu từ bản trước khi có KĐT. */
      ['kdtUser', 'kdtDel', 'kdtCases'].forEach((k) => { if (!S[k]) S[k] = []; });
      if (!S.kdtEdit) S.kdtEdit = {};
      CASES = loadCases();
      useMainCase();
    },
    onChange(fn) { listeners.push(fn); },
    /* Về trạng thái chưa tạo hồ sơ — chạy lại từ SCR-25. Hồ sơ con của hợp đồng cũng xoá. */
    reset() { toMain(); clearCases(); const keep = S ? S.qNotes : {}; const p = S ? S.persona : 'minh'; S = fresh(); S.qNotes = keep; S.persona = p; D.useCase(D.dxmsCode0); emit(); },
    /* D-47: kho hồ sơ con. startCase = tạo + start; openCase / toMain = nạp / rời; cases = các hồ sơ con (lọc theo mã hợp đồng);
       caseTokens = việc đang chờ của `pid` trên mọi hồ sơ con, kèm caseCode vì mã token chỉ duy nhất trong một hồ sơ. */
    startCase,
    openCase,
    toMain,
    focus,
    inCase: () => !!MAIN,
    cases(parent) { return Object.values(CASES).filter((c) => !parent || c.parent === parent); },
    caseOf(code) { return CASES[code] || null; },
    caseTokens(pid, parent) {
      return Flow.cases(parent).flatMap((c) => c.tokens.filter((t) => D.allAccess(pid) || t.who === pid || (t.cands || []).includes(pid)).map((t) => Object.assign({}, t, { caseCode: c.code,
        name: window.BPMN_FLOWS[D.familyOf(c.vars.process)].tasks[t.task].name })));
    },
    /* Tạo hồ sơ có tham số trong D.hdProcesses.start (MS23.03, MS23.01 từ Chi tiết hợp đồng). vars: biến thêm lúc tạo. Trả về mã hồ sơ. */
    startHd(process, hd, vars) { const o = hdOpts(process, hd); Object.assign(o.vars, vars); return startCase(process, o); },
    /* Sự kiện của hồ sơ theo dõi hợp đồng (D-49): chạy trên hồ sơ MS23 rồi trả về hồ sơ đang nạp. Chưa có hồ sơ (hợp đồng chưa ký xong) thì trả về false. */
    hdEvent(hd, key, data) {
      const code = D.hdCaseCode(hd, 'MS23'), back = MAIN ? S.code : null;
      if (!openCase(code)) return false;
      fireEvent(key, data);
      if (!back) toMain(); else openCase(back);
      emit();
      return true;
    },
    /* Số việc đang chờ của `pid` trên luồng chính và mọi hồ sơ con (chuông, menu Việc của tôi, chuyển tài khoản). */
    pendingCount(pid) {
      const m = MAIN || S;
      return m.tokens.filter((t) => D.allAccess(pid) || t.who === pid || (t.cands || []).includes(pid)).length + Flow.caseTokens(pid).length;
    },
    /* SCR-25 Lưu (loại Phê duyệt): start instance theo quy trình người dùng chọn; sau đó không đổi được quy trình.
       opts: { dxms, name }. Prototype chạy một hồ sơ: hồ sơ đang chạy trước đó (nếu có) được thay. */
    create(process, opts) {
      toMain();
      freezeKdt();
      keepLive(false);
      S = carry(S, fresh(process));
      start(opts);
      emit();
    },
    /* SCR-96 Tạo luồng (T17 D-26): tạo ĐXMS (kèm nhân sự chỉ định theo bước, tệp căn cứ gắn ĐXMS) rồi tạo hồ sơ Phê duyệt và start quy trình
       trong một lần Lưu — trên hệ thống thật BE gọi lần lượt API tạo ĐXMS, tạo hồ sơ (profile-form). Tệp căn cứ gắn hồ sơ vào Danh sách tài liệu.
       Task 01 giao người tạo nếu người tạo thuộc vai trò Chuyên quản đã chọn. Trả về mã ĐXMS. */
    createLuong(data, opts) {
      toMain();
      const creator = S.persona, code = nextDxmsCode(), now = Flow.dateOf(S.clock);
      S.dxmsUser.unshift(Object.assign({ creator: window.D.personas.find((p) => p.id === creator).name, created: now }, data, { code, updated: now, luong: true }));
      S = carry(S, fresh(opts.process));
      start({ dxms: code, name: opts.name });
      S.ui.uploads = (opts.caseFiles || []).map((f) => Object.assign({ at: now }, f));
      const t1 = S.tokens.find((t) => String(t.task) === '1');
      S.persona = t1 && (t1.cands || [t1.who]).includes(creator) ? creator : (t1 ? t1.who : creator);
      emit();
      return code;
    },
    /* Người đang nhận việc của bước `key` trong luồng: chỉ định (S.members) hoặc theo vai trò như quy trình (who của bước). */
    membersOf(key) {
      const k = String(key), list = S.members && S.members[k];
      if (list && list.length) return { list: list.slice(), set: true };
      const w = (F()[k] || {}).who;
      return { list: w && !w.startsWith('cqcm:') ? [w] : [], set: false };
    },
    /* SCR-98 Cập nhật nhân sự (T17 D-29): o = { task, mode: 'add' | 'replace', add: [người], drop: [người], doc, reason }.
       Bổ sung = thêm candidate; Thay = bỏ người cũ, thêm người mới. Task đang mở của bước giao lại ngay (BE replaceCandidateUsers),
       lần sau tới bước cũng giao theo danh sách mới. Văn bản đã ký giữ nguyên. Không cần duyệt. Trả về bản ghi lịch sử. */
    updateMembers(o) {
      const k = String(o.task), cur = Flow.membersOf(k).list;
      const drop = o.mode === 'replace' ? o.drop || [] : [];
      const rest = cur.filter((x) => !drop.includes(x)), list = rest.concat((o.add || []).filter((x) => !rest.includes(x)));
      S.members = Object.assign({}, S.members, { [k]: list });
      const own = S.dxmsUser.find((x) => x.code === S.dxms);
      if (own) own.members = Object.assign({}, own.members, { [k]: list.slice() });
      const moved = [];
      S.tokens.filter((t) => String(t.task) === k).forEach((t) => {
        t.cands = list.slice();
        if (!list.includes(t.who)) t.who = list[0];
        moved.push(t.id);
      });
      const rec = { t: S.clock, at: Flow.dateOf(S.clock), by: S.persona, task: k, mode: o.mode, old: cur, now: list.slice(), add: (o.add || []).slice(), drop: drop.slice(),
        doc: o.doc || null, reason: o.reason || null, moved };
      S.memberLog = (S.memberLog || []).concat([rec]);
      emit();
      return rec;
    },
    /* SCR-28 Lưu: tạo ĐXMS (không start quy trình — D-11). Trả về mã ĐXMS. */
    createDxms(data) {
      const code = nextDxmsCode(), now = Flow.dateOf(S.clock);
      S.dxmsUser.unshift(Object.assign({ creator: window.D.personas.find((p) => p.id === S.persona).name, created: now }, data, { code, updated: now }));
      emit();
      return code;
    },
    updateDxms(code, patch) {
      const own = S.dxmsUser.find((x) => x.code === code);
      const p = Object.assign({}, patch, { updated: Flow.dateOf(S.clock) });
      if (own) Object.assign(own, p); else S.dxmsEdit[code] = Object.assign({}, S.dxmsEdit[code], p);
      emit();
    },
    deleteDxms(code) {
      S.dxmsUser = S.dxmsUser.filter((x) => x.code !== code);
      if (D.dxmsList.some((x) => x.code === code)) S.dxmsDel = S.dxmsDel.concat([code]);
      emit();
    },
    /* ĐXMS đang có: tạo trên prototype (mới nhất trước) + mẫu đã áp chỉnh sửa, bỏ bản ghi đã xoá. */
    dxmsAll() {
      return S.dxmsUser.concat(D.dxmsList.filter((x) => !S.dxmsDel.includes(x.code)).map((x) => Object.assign({}, x, S.dxmsEdit[x.code] || {})));
    },
    findDxms(code) { return Flow.dxmsAll().find((x) => x.code === code) || null; },
    /* KĐT (SCR-55): tạo / sửa / xoá như ĐXMS — không start quy trình (D-12). */
    createKdt(data) {
      const code = nextKdtCode(), now = Flow.dateOf(S.clock);
      S.kdtUser.unshift(Object.assign({ creator: window.D.personas.find((p) => p.id === S.persona).name, created: now }, data, { code, updated: now }));
      emit();
      return code;
    },
    updateKdt(code, patch) {
      const own = S.kdtUser.find((x) => x.code === code);
      const p = Object.assign({}, patch, { updated: Flow.dateOf(S.clock) });
      if (own) Object.assign(own, p); else S.kdtEdit[code] = Object.assign({}, S.kdtEdit[code], p);
      emit();
    },
    deleteKdt(code) {
      S.kdtUser = S.kdtUser.filter((x) => x.code !== code);
      if (D.kdtList.some((x) => x.code === code)) S.kdtDel = S.kdtDel.concat([code]);
      emit();
    },
    kdtAll() {
      return S.kdtUser.concat(D.kdtList.filter((x) => !S.kdtDel.includes(x.code)).map((x) => Object.assign({}, x, S.kdtEdit[x.code] || {})));
    },
    findKdt(code) { return Flow.kdtAll().find((x) => x.code === code) || null; },
    /* Hồ sơ KĐT tạo trên prototype + hồ sơ mẫu. */
    kdtCases() {
      const own = liveKdt().concat(S.kdtCases), codes = new Set(own.map((c) => c.code));
      return own.concat(D.kdtCases.filter((c) => !codes.has(c.code)));
    },
    kdtDocs,
    /* Thêm mới hồ sơ Phê duyệt KĐT: Lưu = khởi tạo instance MS13 (bước 1 giao người tạo); nhóm MS13/14/15 chưa xác định tới cổng phân luồng
       sau bước 11 ‖ 12 (D-7). Prototype chạy một hồ sơ: hồ sơ đang chạy trước đó được thay (hồ sơ KĐT cũ giữ lại ở trạng thái hiện tại). */
    createKdtCase(opts) {
      toMain();
      const who = S.persona;
      freezeKdt();
      S = carry(S, fresh('MS13'));
      S.persona = who;
      startKdt({ kdt: opts.kdt, name: opts.name });
      emit();
      return S.code;
    },
    kdtCheck,
    kdtAuth,
    kdtStage,
    tdRound,
    /* Bộ đếm của giai đoạn thẩm định hiện tại: chk (vòng check), meet (lần họp). */
    tdCount: (k) => ((S.vars[k] || {})[tdOf()] || 0),
    /* SCR-25 Lưu (loại Điều chỉnh, T21 D-36): start instance MS02 như hồ sơ Phê duyệt. opts: { dxms, name, before?, total?, reason? }.
       Hồ sơ đang chạy đã hoàn thành (vd. vừa phê duyệt ĐXMS này) được giữ vào danh sách hồ sơ để làm căn cứ điều chỉnh. Trả về mã hồ sơ. */
    createAdj(opts) {
      toMain();
      freezeKdt();
      keepLive(true);
      const who = S.persona;
      S = carry(S, fresh('MS02'));
      S.persona = who;
      start(opts);
      emit();
      return S.code;
    },
    /* Bước 4 (B2): sửa lý do / giá trị sau điều chỉnh của hồ sơ Điều chỉnh đang chạy. */
    setAdj(patch) {
      if (!S.vars.adj) return;
      Object.assign(S.vars.adj, patch);
      useAdj();
      emit();
    },
    nextCaseCode: (dxms, kind) => nextCaseCode(dxms, kind),
    /* Sau 10b: mở hồ sơ mới của cùng ĐXMS theo quy trình đúng. Mặc định P-26: hồ sơ mới làm lại từ task 1 với dữ liệu đã sao chép sẵn. */
    openReplacement() {
      if (S.status !== 'moved') return;
      const ci = Flow.ci();
      const old = { code: ci.code, dxms: ci.dxms, kind: 'PD', title: ci.name, total: ci.total, flow: ci.flow, status: 'Đã chuyển quy trình',
        updated: Flow.dateOf(S.clock), replacedBy: S.movedTo.code };
      const prev = S, ui = JSON.parse(JSON.stringify(S.ui || {})), archived = (S.archived || []).concat([old]), to = S.movedTo;
      delete ui.aiFail;
      S = carry(prev, fresh(to.process));
      Object.assign(S, { ui, archived, replaces: old.code });
      start({ code: to.code, dxms: old.dxms, name: old.title });
      emit();
    },
    /* Cảnh `n` của bộ demo `key` (mặc định bộ đang dùng). Trả về cảnh. */
    jumpToScene(n, key) {
      const set = key ? setOf(key) : demoSet();
      const sc = set.scenes.find((s) => String(s.n) === String(n));
      if (set.hd) {
        ffCase(sc.start, set, sc.ui, false, sc.pre, (sc.evts || []).map((i) => set.events[i]));
        S.persona = sc.who; S.lastScene = n;
        emit();
        return sc;
      }
      const keep = S.qNotes;
      fastForward(sc.start, set.key, sc.kdt || sc.dxms || set.dxms || set.kdt, sc.ui, false, sc.pre);
      S.qNotes = keep; S.persona = sc.who; S.lastScene = n;
      emit();
      return sc;
    },
    /* Nhánh phụ: tua tới `task` (hồ sơ của `dxms` tạo theo `process`, mặc định ĐXMS-2026-0117 · MS01.01), đặt lựa chọn trên màn (ui),
       biến (vd. round) và vai. */
    jumpTo(task, who, vars, process, dxms, ui, settle, pre) {
      const hs = D.demoSets.find((d) => d.hd && d.key === process);
      if (hs) {
        ffCase(task, hs, ui, settle, pre);
        S.persona = who; Object.assign(S.vars, vars || {});
        emit();
        return;
      }
      const keep = S.qNotes;
      fastForward(task, process, dxms, ui, settle, pre);
      S.qNotes = keep; S.persona = who; Object.assign(S.vars, vars || {});
      emit();
    },
    /* Công cụ demo › Chọn hồ sơ demo: đặt lại luồng về trước bước tạo hồ sơ của bộ `key` (ý kiến ❓ giữ nguyên). */
    pickDemo(key) { return Flow.jumpToScene(setOf(key).scenes[0].n, key); },
    demoSet,
    /* CQCM đơn vị chọn ở task 16; chưa chọn thì theo hồ sơ mẫu (D.caseRef.cqcm). */
    cqcmSel() { return (S.ui && S.ui.cqcmSel) || D.caseRef.cqcm; },
    isSmall,
    /* Hồ sơ KĐT Mật (bước 4, mặc định theo KĐT) — khối ký chung bắt buộc bản cứng. */
    isMat,
    choices: choicesOf,
    choiceOf,
    scrOf,
    /* Hồ sơ đang chạy: dữ liệu mẫu + mã, tên, quy trình của instance. */
    /* Hồ sơ đang chạy: dữ liệu mẫu + mã, tên, quy trình của instance + thông tin ĐXMS cha (title = tên ĐXMS, name = tên hồ sơ). */
    ci() {
      /* Hồ sơ con của hợp đồng: dữ liệu lấy từ hợp đồng cha (hop-dong.js). */
      if (S.parent) {
        const h = (window.HopDong && window.HopDong.find(S.parent)) || {};
        return Object.assign({}, D.caseInfo, { code: S.code, dxms: S.parent, hd: S.parent, isHd: true, kind: 'HD', title: h.title, name: S.name || h.title, flow: S.vars.process,
          unit: h.unit, total: h.value, owner: h.owner, ncc: h.ncc, secret: false });
      }
      if (S.kdt) {
        const k = Flow.findKdt(S.kdt) || {};
        return Object.assign({}, D.caseInfo, { code: S.code || '—', dxms: S.kdt, kdt: S.kdt, isKdt: true, kind: 'PD', title: k.title || D.caseInfo.title,
          name: S.name || k.title || D.caseInfo.title, flow: S.vars.group || 'Chưa xác định nhóm', group: S.vars.group || null, branch: S.vars.branch || null,
          unit: k.unit || D.caseInfo.unit, secret: isMat(), period: k.period || D.caseInfo.period, est: k.est });
      }
      const x = (S.dxms && Flow.findDxms(S.dxms)) || {};
      const title = x.title || D.caseInfo.title;
      const a = S.vars.adj;
      return Object.assign({}, D.caseInfo, { code: S.code || '—', dxms: S.dxms || '—', kind: a ? 'DC' : 'PD', title, name: S.name || title, flow: S.vars.process || '—',
        before: a ? a.before : null, reason: a ? a.reason : null, from: a ? a.from : null, branch: a ? D.adjBranch(S.vars) : null,
        unit: x.unit || D.caseInfo.unit, priority: x.priority || D.caseInfo.priority, secret: !!x.secret, period: x.period || D.caseInfo.period });
    },
    matchCheck,
    condOf,
    inRange: (process, total) => D.inRange(process, total, rules()),
    /* Định nghĩa luồng và task BPMN của quy trình hồ sơ đang chạy — màn, body dùng thay cho D.flow / BPMN_TASKS khi có luồng MS13 (B2). */
    def: () => F(),
    tasks: () => T(),
    isTask,
    setPersona(id) { S.persona = id; emit(); },
    /* Dữ liệu người dùng nhập trên các màn (lựa chọn, tệp giả lập, cờ AI). */
    get ui() { return S.ui || (S.ui = {}); },
    setUi(k, v) { (S.ui || (S.ui = {}))[k] = v; emit(); },
    /* Xác nhận eForm: ghi các biến của form một lần (một lần emit). */
    setUiMany(o) { Object.assign(S.ui || (S.ui = {}), o); emit(); },
    doneCount(n) { return S.history.filter((h) => String(h.task) === String(n)).length; },
    lastOf(n) { return S.history.filter((h) => String(h.task) === String(n)).slice(-1)[0]; },
    complete,
    mainChoice,
    tokensFor(pid) { return D.allAccess(pid) ? S.tokens.slice() : S.tokens.filter((t) => t.who === pid || (t.cands || []).includes(pid)); },
    token(id) { return S.tokens.find((t) => t.id === id); },
    setNote(pid, text) { if (text) S.qNotes[pid] = text; else delete S.qNotes[pid]; emit(); },
    taskName,
    /* Trạng thái từng task cho timeline: done | active | todo | na (nhánh của quy trình khác, hồ sơ không đi qua)
       | cond (10a/10b — chỉ chạy khi giá trị không khớp quy trình). */
    taskStatus(n) {
      const own = (x) => String(stepOf(x)) === String(n);
      if (S.tokens.some(own)) return 'active';
      if (S.history.some(own)) return 'done';
      /* Bước chỉ chạy khi có phát sinh (MS22 bước 6, 7) hoặc theo điều kiện của hồ sơ (MS24 bước 5–10 khi không yêu cầu bảng tổng hợp). */
      const opt = (F()[n] || {}).optional;
      if (typeof opt === 'function' ? opt(S.vars, S.ui || {}) : opt) return 'cond';
      if ((S.kdt ? D.kdtNa(S.vars, isMat()) : D.naOf(S.vars)).includes(Number(n))) return 'na';
      /* Ký bản cứng 77–78 của hồ sơ không Mật: chỉ chạy khi người trình chọn Bản cứng ở 75. */
      if (S.kdt && !isMat() && ['77', '78'].includes(String(n))) return 'cond';
      if (!S.kdt && ['10a', '10b'].includes(String(n))) return 'cond';
      return 'todo';
    },
    currentStage() {
      if (S.status !== 'running' || S.kdt || S.parent) return null;
      const nums = S.tokens.map((t) => t.task).filter(isTask).map((k) => parseInt(k, 10));
      const n = nums.length ? Math.min(...nums) : 1;
      return window.D.stages.find((s) => n >= s.from && n <= s.to);
    },
    /* Ngược của dateOf: số ngày làm việc nhỏ nhất có ngày không trước `date` (dd/mm/yyyy). */
    clockOf(date) {
      const k = (s) => s.split('/').reverse().join('');
      let n = 0;
      while (n < 2000 && k(Flow.dateOf(n)) < k(date)) n += 1;
      return n;
    },
    caseStatus() {
      if (S.status === 'new') return 'Chưa tạo';
      if (S.status === 'approved') return 'Đã phê duyệt';
      if (S.status === 'stopped') return 'Kết thúc theo chỉ đạo khác';
      if (S.status === 'moved') return 'Đã chuyển quy trình';
      const st = Flow.currentStage();
      return st ? st.status : '—';
    },
    kpiUsed() {
      if (S.kpiStart === null) return null;
      return Math.round(((S.kpiEnd !== null ? S.kpiEnd : S.clock) - S.kpiStart) * 100) / 100;
    },
    /* Đổi NLV giả lập sang ngày lịch, bắt đầu 01/10/2026, bỏ thứ Bảy, Chủ nhật. */
    dateOf(nlv) {
      const d = new Date(2026, 9, 1);
      let left = Math.floor(nlv);
      while (left > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) left -= 1; }
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
  };
  window.Flow = Flow;
})();
