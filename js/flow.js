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

  /* Luồng theo quy trình của hồ sơ đang chạy (plan KĐT §6 #2): F() = định nghĩa luồng trong D.flows, T() = task BPMN của trang tương ứng.
     MS01.01 / .02 / .03 dùng chung D.flow (trang MS01 v1.1); MS13 dùng D.flows.MS13 + BPMN_FLOWS.MS13 (trang MS13-TO BE). */
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
    S.dxms = opts.dxms || D.dxmsCode0;
    D.useCase(S.dxms);
    if (!Flow.findDxms(S.dxms)) S.dxmsUser.push(demoDxms());
    S.code = opts.code || nextCaseCode(S.dxms, 'PD');
    S.name = opts.name || null;
    S.status = 'running';
    S.persona = 'minh';
    log('START', { system: true, action: `Khởi tạo ${S.code} theo quy trình ${S.vars.process}` });
    enter(1, {});
  }

  /* Hồ sơ Phê duyệt KĐT (D-12): Lưu = start instance MS13-TO BE, bước 1 giao người tạo. Nhóm KĐT chưa xác định tới cổng phân luồng (D-7);
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
  /* Trạng thái KĐT (kdt.js KDT_STAGE) suy từ bước đang chờ của hồ sơ chạy luồng, theo cụm của MS13-TO BE (§1.2). */
  function kdtStage() {
    if (S.status === 'moved') return 'MS14';
    if (S.status === 'approved') return 'OK';
    if (S.status === 'stopped') return 'STOP';
    const ns = S.tokens.map(stepOf).filter(isTask).map(Number);
    const n = ns.length ? Math.min(...ns) : 1, gop = S.vars.branch === 'BM00';
    if (S.vars.sub === 41) return 'TDCT';
    if (S.vars.sub === 49) return 'TDKDT';
    if (n <= 10 || n === 13) return 'LAP';
    if (n <= 12) return 'PL';
    if (n <= 16) return gop ? 'GOP' : 'CT';
    if (n <= 21) return 'GOP';
    if (n <= 35) return 'TDGOP';
    if (n <= 40) return 'CT';
    if (n <= 42) return 'TDCT';
    if (n <= 44) return 'KYCT';
    if (n <= 48) return 'HS';
    if (n <= 53) return 'TDKDT';
    if (n === 54) return 'KYQD';
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
  /* Văn bản đầu ra của hồ sơ KĐT (§4.2): BM-01 khi Thủ trưởng ký duyệt chủ trương (44), BM-14 khi báo cáo thẩm định được thông qua (51),
     BM-18 khi Thủ trưởng ký Quyết định (54), BM-00 khi Thủ trưởng ký hồ sơ gộp (56). Lấy lần xử lý gần nhất đạt kết quả. */
  const KDOCS = [['BM-01', 44, /^Ký/], ['BM-14', 51, /^Trình báo cáo/], ['BM-18', 54, /^Ký/], ['BM-00', 56, /^Ký/]];
  function kdtDocs() {
    return KDOCS.map(([code, by, ok]) => {
      const h = S.history.filter((x) => String(x.task) === String(by) && x.who && ok.test(x.action)).pop();
      return h ? { code, by, at: Flow.dateOf(h.t) } : null;
    }).filter(Boolean);
  }
  /* Tạo hồ sơ khác khi đang chạy một hồ sơ KĐT: giữ hồ sơ KĐT cũ ở trạng thái hiện tại trong danh sách hồ sơ của KĐT. */
  function freezeKdt() {
    if (S && S.kdt && S.status !== 'new') S.kdtCases = liveKdt().map((c) => Object.assign({}, c, { live: false })).concat(S.kdtCases);
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } }
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* bỏ qua */ }
    return null;
  }
  function emit() { save(); listeners.forEach((fn) => fn(S)); }

  /* Task BPMN của quy trình (MS01: 1–61, 10a, 10b); các khoá khác trong định nghĩa luồng là cổng / điểm nối của prototype. */
  const isTask = (k) => Object.prototype.hasOwnProperty.call(T(), String(k));
  const taskName = (k) => (isTask(k) ? T()[k].name : k);
  /* Quy trình con MS13 (41, 49): chạy lại khối thẩm định 22–35 (plan KĐT §1.2a mục 4). Token / nhật ký của khối mang `sub` = số bước quy trình con;
     timeline, trạng thái KĐT, danh sách hồ sơ tính việc đó là bước 41 / 49. */
  const stepOf = (t) => t.sub || t.task;
  /* Bộ đếm theo giai đoạn thẩm định (vars.td: GOP = hồ sơ gộp, CT = chủ trương 41, KDT = hồ sơ KĐT 49 — P-54 đếm riêng mỗi giai đoạn):
     chk = số vòng check (lượt ĐVĐX bổ sung / giải trình ở bước 28), meet = số lần họp (bước 30 tăng). */
  const tdOf = () => S.vars.td || 'GOP';
  function bump(k) { const o = Object.assign({}, S.vars[k]); o[tdOf()] = (o[tdOf()] || 0) + 1; S.vars[k] = o; }
  /* Số lượt TTMS đã thẩm định (bước 24) trong giai đoạn hiện tại — chỉ số vòng của ý kiến mẫu (D.kdtReview). */
  const tdRound = () => S.history.filter((h) => String(h.task) === '24' && h.who && (h.td || 'GOP') === tdOf()).length;

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
    if (w.startsWith('cqcm:')) {
      const c = window.D.cqcm.find((x) => x.id === ctx.cqcm);
      return c ? c[w.slice(5)] : null;
    }
    return w;
  }

  function log(key, entry) {
    S.history.push(Object.assign({ task: key, t: S.clock }, S.vars.sub ? { sub: S.vars.sub } : {}, S.vars.td ? { td: S.vars.td } : {}, entry));
  }

  /* Đưa luồng vào `key` với ngữ cảnh (group, cqcm). Task hệ thống chạy ngay rồi đi tiếp. */
  function enter(key, ctx) {
    ctx = ctx || {};
    if (key === 'END' || key === 'END_OTHER') {
      S.status = key === 'END' ? 'approved' : 'stopped';
      const endKdt = S.vars.branch === 'BM00' ? 'Kết thúc — hồ sơ gộp BM-00 đã ký duyệt' : 'Kết thúc — Quyết định phê duyệt KĐT';
      log(key, { system: true, action: key === 'END' ? (S.kdt ? endKdt : 'Kết thúc — ĐXMS đã phê duyệt') : 'Kết thúc theo chỉ đạo khác' });
      return;
    }
    if (key === 'END_MOVED') {
      S.status = 'moved';
      log(key, { system: true, action: S.kdt ? `Kết thúc — chuyển luồng ${S.movedTo.process}, hồ sơ mới ${S.movedTo.code}` : `Kết thúc — đã chuyển quy trình, được thay bởi ${S.movedTo.code}` });
      return;
    }
    const f = F()[key] || {};

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

    /* Task hệ thống chạy ngay; cổng (gw) chỉ chọn nhánh, không ghi nhật ký. */
    const isService = isTask(key) && T()[key].type === 'service';
    if (isService || f.gw) {
      if (f.td) S.vars.td = f.td;
      if (f.sub) { S.vars.sub = f.sub; log(key, { system: true, action: `Quy trình con: ${T()[key].name}` }); }
      if (f.endSub) S.vars.sub = null;
      if (f.bump) bump(f.bump);
      if (isService) log(key, { system: true, action: T()[key].name, cqcm: ctx.cqcm, t: ctx.t != null ? ctx.t : S.clock });
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

  function addToken(key, ctx, who) {
    S.seq += 1;
    S.tokens.push({ id: 'k' + S.seq, task: key, group: ctx.group || null, cqcm: ctx.cqcm || null, sub: S.vars.sub || null,
      who: who || whoFor(key, ctx), since: ctx.t != null ? ctx.t : S.clock });
  }

  /* Mỗi token mang mốc thời gian của nhánh mình (since). Việc song song (các CQCM, Tài chính ‖ TTMS) vì thế
     không cộng dồn; đồng hồ chung là lúc bên chậm nhất xong, và điểm join tiếp tục từ mốc đó. */
  function advanceClock(tok, f) {
    const fin = Math.round((tok.since + (f.nlv || 0.5)) * 100) / 100;
    S.clock = Math.max(S.clock, fin);
    return fin;
  }

  /* Hoàn thành token bằng lựa chọn `choice` (object trong F()[key].choices, hoặc null = next mặc định). */
  function complete(tokenId, choice, reason) {
    const tok = S.tokens.find((t) => t.id === tokenId);
    if (!tok) return;
    const f = F()[tok.task];
    const fin = advanceClock(tok, f);
    S.tokens = S.tokens.filter((t) => t.id !== tokenId);
    const label = choice ? choice.label : (f.actionLabel || 'Hoàn thành');
    log(tok.task, { who: tok.who, action: label, reason: reason || null, cqcm: tok.cqcm, since: tok.since });
    if (f.round) S.vars.round += 1;
    if (f.bump) bump(f.bump);
    if (choice && choice.set) Object.assign(S.vars, choice.set);
    if (f.kpiEnd && choice && choice.label === (mainChoice(tok.task) || {}).label) S.kpiEnd = S.clock;
    let ctx = { group: tok.group, cqcm: tok.cqcm, t: fin };
    if (choice && choice.cancelGroup) {
      S.tokens = S.tokens.filter((t) => t.group !== tok.group);
      ctx = {};
    }
    enter(choice ? choice.to : f.next, ctx);
    emit();
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
  const demoSet = () => (S.dxms && D.demoSets.find((d) => d.dxms === S.dxms))
    || (S.kdt && D.demoSets.find((d) => d.kdt === S.kdt || (d.also || []).includes(S.kdt))) || setOf(S.demoKey);

  /* Tua nhanh từ đầu theo nhánh chính cho tới khi có token ở task `target` (hoặc kết thúc).
     dxms = ĐXMS của hồ sơ (bộ dữ liệu mẫu); ui = lựa chọn đặt sẵn trên màn (vd. ĐVĐX bảo lưu ý kiến ở task 26). */
  function fastForward(target, process, dxms, ui, settle) {
    const key = (D.demoSets.find((d) => d.dxms === (dxms || D.dxmsCode0) || d.kdt === dxms || (d.also || []).includes(dxms)) || D.demoSets[0]).key;
    S = carry({ qNotes: S ? S.qNotes : {} }, fresh(process || 'MS01.01'));
    S.demoKey = key;
    if (ui) S.ui = JSON.parse(JSON.stringify(ui));
    if (target === 'NEW') { S.vars.process = null; D.useCase(dxms || D.dxmsCode0); return; }
    start({ dxms });
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
      enter(c ? c.to : f.next, { group: tok.group, cqcm: tok.cqcm, t: fin });
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
      D.useCase(S.kdt || S.dxms || demoSet().dxms || demoSet().kdt);
    },
    onChange(fn) { listeners.push(fn); },
    /* Về trạng thái chưa tạo hồ sơ — chạy lại từ SCR-25. */
    reset() { const keep = S ? S.qNotes : {}; const p = S ? S.persona : 'minh'; S = fresh(); S.qNotes = keep; S.persona = p; D.useCase(D.dxmsCode0); emit(); },
    /* SCR-25 Lưu (loại Phê duyệt): start instance theo quy trình người dùng chọn; sau đó không đổi được quy trình.
       opts: { dxms, name }. Prototype chạy một hồ sơ: hồ sơ đang chạy trước đó (nếu có) được thay. */
    create(process, opts) {
      freezeKdt();
      S = carry(S, fresh(process));
      start(opts);
      emit();
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
    /* Thêm mới hồ sơ Phê duyệt KĐT: Lưu = khởi tạo instance MS13-TO BE (bước 1 giao người tạo); nhóm MS13/14/15 chưa xác định tới cổng phân luồng
       sau bước 11 ‖ 12 (D-7). Prototype chạy một hồ sơ: hồ sơ đang chạy trước đó được thay (hồ sơ KĐT cũ giữ lại ở trạng thái hiện tại). */
    createKdtCase(opts) {
      const who = S.persona;
      freezeKdt();
      S = carry(S, fresh('MS13'));
      S.persona = who;
      startKdt({ kdt: opts.kdt, name: opts.name });
      emit();
      return S.code;
    },
    kdtCheck,
    kdtStage,
    tdRound,
    /* Bộ đếm của giai đoạn thẩm định hiện tại: chk (vòng check), meet (lần họp). */
    tdCount: (k) => ((S.vars[k] || {})[tdOf()] || 0),
    /* SCR-25 Lưu (loại Điều chỉnh): ghi nhận hồ sơ MS02 ở bước đầu tiên. Luồng MS02 chưa chạy trên prototype nên mở ở chế độ xem. */
    createAdj(opts) {
      const code = nextCaseCode(opts.dxms, 'DC'), now = Flow.dateOf(S.clock);
      S.adj.unshift({ code, dxms: opts.dxms, kind: 'DC', title: opts.name, total: opts.total, flow: opts.process, st: 'processing', task: 1,
        created: now, updated: now, creator: window.D.personas.find((p) => p.id === S.persona).name });
      emit();
      return code;
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
      const keep = S.qNotes;
      fastForward(sc.start, set.key, sc.kdt || set.dxms || set.kdt);
      S.qNotes = keep; S.persona = sc.who; S.lastScene = n;
      emit();
      return sc;
    },
    /* Nhánh phụ: tua tới `task` (hồ sơ của `dxms` tạo theo `process`, mặc định ĐXMS-2026-0117 · MS01.01), đặt lựa chọn trên màn (ui),
       biến (vd. round) và vai. */
    jumpTo(task, who, vars, process, dxms, ui, settle) {
      const keep = S.qNotes;
      fastForward(task, process, dxms, ui, settle);
      S.qNotes = keep; S.persona = who; Object.assign(S.vars, vars || {});
      emit();
    },
    /* Công cụ demo › Chọn hồ sơ demo: đặt lại luồng về trước bước tạo hồ sơ của bộ `key` (ý kiến ❓ giữ nguyên). */
    pickDemo(key) { return Flow.jumpToScene(setOf(key).scenes[0].n, key); },
    demoSet,
    /* CQCM đơn vị chọn ở task 16; chưa chọn thì theo hồ sơ mẫu (D.caseRef.cqcm). */
    cqcmSel() { return (S.ui && S.ui.cqcmSel) || D.caseRef.cqcm; },
    isSmall,
    choices: choicesOf,
    choiceOf,
    scrOf,
    /* Hồ sơ đang chạy: dữ liệu mẫu + mã, tên, quy trình của instance. */
    /* Hồ sơ đang chạy: dữ liệu mẫu + mã, tên, quy trình của instance + thông tin ĐXMS cha (title = tên ĐXMS, name = tên hồ sơ). */
    ci() {
      if (S.kdt) {
        const k = Flow.findKdt(S.kdt) || {};
        return Object.assign({}, D.caseInfo, { code: S.code || '—', dxms: S.kdt, kdt: S.kdt, isKdt: true, kind: 'PD', title: k.title || D.caseInfo.title,
          name: S.name || k.title || D.caseInfo.title, flow: S.vars.group || 'Chưa xác định nhóm', group: S.vars.group || null, branch: S.vars.branch || null,
          unit: k.unit || D.caseInfo.unit, secret: !!k.secret, period: k.period || D.caseInfo.period, est: k.est });
      }
      const x = (S.dxms && Flow.findDxms(S.dxms)) || {};
      const title = x.title || D.caseInfo.title;
      return Object.assign({}, D.caseInfo, { code: S.code || '—', dxms: S.dxms || '—', kind: 'PD', title, name: S.name || title, flow: S.vars.process || '—',
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
    tokensFor(pid) { return D.allAccess(pid) ? S.tokens.slice() : S.tokens.filter((t) => t.who === pid); },
    token(id) { return S.tokens.find((t) => t.id === id); },
    setNote(pid, text) { if (text) S.qNotes[pid] = text; else delete S.qNotes[pid]; emit(); },
    taskName,
    /* Trạng thái từng task cho timeline: done | active | todo | na (nhánh của quy trình khác, hồ sơ không đi qua)
       | cond (10a/10b — chỉ chạy khi giá trị không khớp quy trình). */
    taskStatus(n) {
      const own = (x) => String(stepOf(x)) === String(n);
      if (S.tokens.some(own)) return 'active';
      if (S.history.some(own)) return 'done';
      if ((S.kdt ? D.kdtNa(S.vars) : D.notApplicable[S.vars.process] || []).includes(Number(n))) return 'na';
      if (!S.kdt && ['10a', '10b'].includes(String(n))) return 'cond';
      return 'todo';
    },
    currentStage() {
      if (S.status !== 'running' || S.kdt) return null;
      const nums = S.tokens.map((t) => t.task).filter(isTask).map((k) => parseInt(k, 10));
      const n = nums.length ? Math.min(...nums) : 1;
      return window.D.stages.find((s) => n >= s.from && n <= s.to);
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
