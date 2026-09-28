/*
 * Bộ máy luồng cho prototype: chạy 61 task BPMN MS01 v1.1 (+ 10a, 10b) theo D.flow, có token song song (mỗi CQCM một token),
 * điểm hợp nhất (join), cổng theo biến (gw), cổng kiểm tra khớp quy trình và bộ đếm vòng giải trình.
 * Hồ sơ chỉ có instance khi người dùng Lưu ở SCR-25 (chọn quy trình, start ngay — chốt 2026-09-28). Hồ sơ thuộc một ĐXMS (D-10):
 * ĐXMS tạo riêng ở SCR-28 (không start quy trình); prototype chạy luồng cho một hồ sơ Phê duyệt tại một thời điểm.
 * Trạng thái lưu localStorage của trình duyệt (chỉ để người review mở lại không mất chỗ đang xem); lỗi lưu thì vẫn chạy bình thường.
 */
(function () {
  const KEY = 'dtms-proto-v4';
  const T = window.BPMN_TASKS;
  const F = window.D.flow;
  const D = window.D;
  const listeners = [];

  let S = null;

  /* status: new (chưa tạo hồ sơ) | running | approved | stopped | moved (đã chuyển quy trình).
     dxms = mã ĐXMS của hồ sơ chạy luồng; name = tên hồ sơ. dxmsUser/dxmsEdit/dxmsDel/adj: ĐXMS và hồ sơ Điều chỉnh tạo trên prototype. */
  function fresh(process) {
    return {
      persona: 'minh', tokens: [], clock: 0, seq: 0, code: null, dxms: null, name: null, replaces: null, movedTo: null, archived: [],
      dxmsUser: [], dxmsEdit: {}, dxmsDel: [], adj: [],
      vars: { round: 0, reportTD: null, process: process || null, big: process !== 'MS01.03', basisOk: true, checks: [], th: process ? D.dxmsRules() : null },
      history: [], status: 'new', kpiStart: null, kpiEnd: null, qNotes: {}, lastScene: 1, ui: {},
    };
  }

  /* Dữ liệu không thuộc riêng hồ sơ chạy luồng — giữ qua các lần tạo hồ sơ mới (ĐXMS, hồ sơ Điều chỉnh đã tạo, ý kiến ❓). */
  const CARRY = ['qNotes', 'dxmsUser', 'dxmsEdit', 'dxmsDel', 'adj'];
  const carry = (from, to) => { CARRY.forEach((k) => { if (from && from[k] != null) to[k] = from[k]; }); return to; };

  /* ĐXMS của luồng demo khi nhảy cảnh (dữ liệu hồ sơ mẫu §2.3). */
  const demoDxms = () => ({ code: D.dxmsCode0, title: D.caseInfo.title, unit: D.caseInfo.unit, priority: D.caseInfo.priority, est: D.aiEstimate,
    period: D.caseInfo.period, secret: false, purpose: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển trạm gNodeB thế hệ 2.',
    creator: 'Nguyễn Văn Minh', created: '01/10/2026', updated: '01/10/2026' });

  /* Mã hồ sơ đã dùng (mẫu, đã tạo, đang chạy, đã chuyển quy trình). Hồ sơ Phê duyệt đầu tiên giữ 4 số của ĐXMS; còn lại lấy số trống từ 0127. */
  function usedCodes() {
    return new Set(D.otherCases.map((c) => c.code).concat(S.adj.map((c) => c.code), S.archived.map((c) => c.code), S.code ? [S.code] : [], D.caseCodes.slice(1)));
  }
  function nextCaseCode(dxms, kind) {
    const used = usedCodes();
    const own = 'HS-2026-' + dxms.slice(-4);
    if (kind === 'PD' && !used.has(own)) return own;
    for (let n = 127; ; n++) { const c = 'HS-2026-' + String(n).padStart(4, '0'); if (!used.has(c)) return c; }
  }
  function nextDxmsCode() {
    const used = new Set(D.dxmsList.map((x) => x.code).concat(S.dxmsUser.map((x) => x.code)));
    if (!used.has(D.dxmsCode0)) return D.dxmsCode0;
    for (let n = 127; ; n++) { const c = 'ĐXMS-2026-' + String(n).padStart(4, '0'); if (!used.has(c)) return c; }
  }

  /* Lưu ở SCR-25 = sinh mã hồ sơ + start instance của quy trình đã chọn; task 1 giao cho người tạo. */
  function start(opts) {
    opts = opts || {};
    S.dxms = opts.dxms || D.dxmsCode0;
    if (!Flow.findDxms(S.dxms)) S.dxmsUser.push(demoDxms());
    S.code = opts.code || nextCaseCode(S.dxms, 'PD');
    S.name = opts.name || null;
    S.status = 'running';
    S.persona = 'minh';
    log('START', { system: true, action: `Khởi tạo ${S.code} theo quy trình ${S.vars.process}` });
    enter(1, {});
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } }
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* bỏ qua */ }
    return null;
  }
  function emit() { save(); listeners.forEach((fn) => fn(S)); }

  /* Task BPMN (1–61, 10a, 10b); các khoá khác trong D.flow là cổng / điểm nối của prototype. */
  const isTask = (k) => Object.prototype.hasOwnProperty.call(T, String(k));
  const taskName = (k) => (isTask(k) ? T[k].name : k);

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
    const doc = D.basisDocs.find((d) => d.id === ((S.ui || {}).basisDoc || D.basisDocs[0].id));
    const want = doc && doc.group ? 'MS01.02' : 'MS01.01';
    return r.procs.includes(want) ? want : r.procs[0];
  }
  /* Điều kiện của quy trình theo ngưỡng hồ sơ đang giữ. */
  const condOf = (process) => D.procCond(process, rules());

  function whoFor(key, ctx) {
    const w = F[key] && F[key].who;
    if (!w) return null;
    if (w.startsWith('cqcm:')) {
      const c = window.D.cqcm.find((x) => x.id === ctx.cqcm);
      return c ? c[w.slice(5)] : null;
    }
    return w;
  }

  function log(key, entry) {
    S.history.push(Object.assign({ task: key, t: S.clock }, entry));
  }

  /* Đưa luồng vào `key` với ngữ cảnh (group, cqcm). Task hệ thống chạy ngay rồi đi tiếp. */
  function enter(key, ctx) {
    ctx = ctx || {};
    if (key === 'END' || key === 'END_OTHER') {
      S.status = key === 'END' ? 'approved' : 'stopped';
      log(key, { system: true, action: key === 'END' ? 'Kết thúc — ĐXMS đã phê duyệt' : 'Kết thúc theo chỉ đạo khác' });
      return;
    }
    if (key === 'END_MOVED') {
      S.status = 'moved';
      log(key, { system: true, action: `Kết thúc — đã chuyển quy trình, được thay bởi ${S.movedTo.code}` });
      return;
    }
    const f = F[key] || {};

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
      if (isTask(key)) log(key, { system: true, action: T[key].name });
      if (f.kpiStart && S.kpiStart === null) S.kpiStart = S.clock;
      const sel = S.ui && S.ui.cqcmSel;
      window.D.cqcm.filter((c) => !sel || sel.includes(c.id)).forEach((c) => addToken(f.to, { group: f.fork, cqcm: c.id }));
      (f.also || []).forEach((b) => addToken(b.task, { group: f.fork }, b.who));
      return;
    }

    /* Task hệ thống chạy ngay; cổng (gw) chỉ chọn nhánh, không ghi nhật ký. */
    const isService = isTask(key) && T[key].type === 'service';
    if (isService || f.gw) {
      if (isService) log(key, { system: true, action: T[key].name, cqcm: ctx.cqcm, t: ctx.t != null ? ctx.t : S.clock });
      if (f.moves) S.movedTo = { code: D.caseCodes[1], process: matchCheck().suggest };
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
    S.tokens.push({ id: 'k' + S.seq, task: key, group: ctx.group || null, cqcm: ctx.cqcm || null,
      who: who || whoFor(key, ctx), since: ctx.t != null ? ctx.t : S.clock });
  }

  /* Mỗi token mang mốc thời gian của nhánh mình (since). Việc song song (các CQCM, Tài chính ‖ TTMS) vì thế
     không cộng dồn; đồng hồ chung là lúc bên chậm nhất xong, và điểm join tiếp tục từ mốc đó. */
  function advanceClock(tok, f) {
    const fin = Math.round((tok.since + (f.nlv || 0.5)) * 100) / 100;
    S.clock = Math.max(S.clock, fin);
    return fin;
  }

  /* Hoàn thành token bằng lựa chọn `choice` (object trong F[key].choices, hoặc null = next mặc định). */
  function complete(tokenId, choice, reason) {
    const tok = S.tokens.find((t) => t.id === tokenId);
    if (!tok) return;
    const f = F[tok.task];
    const fin = advanceClock(tok, f);
    S.tokens = S.tokens.filter((t) => t.id !== tokenId);
    const label = choice ? choice.label : (f.actionLabel || 'Hoàn thành');
    log(tok.task, { who: tok.who, action: label, reason: reason || null, cqcm: tok.cqcm, since: tok.since });
    if (f.round) S.vars.round += 1;
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

  /* Nút chính của task: `mainWhen(vars)` (tuỳ trạng thái) được ưu tiên hơn cờ `main`. */
  function mainChoice(key) {
    const f = F[key];
    if (!f.choices) return null;
    return f.choices.find((c) => (c.mainWhen ? c.mainWhen(S.vars) : c.main)) || null;
  }

  /* Tua nhanh từ đầu theo nhánh chính cho tới khi có token ở task `target` (hoặc kết thúc). */
  function fastForward(target, process) {
    S = carry({ qNotes: S ? S.qNotes : {} }, fresh(process || 'MS01.01'));
    if (target === 'NEW') { S.vars.process = null; return; }
    start();
    let guard = 0;
    while (S.status === 'running' && guard++ < 400) {
      if (target !== 'END' && S.tokens.some((t) => String(t.task) === String(target))) break;
      const tok = S.tokens[0];
      if (!tok) break;
      const f = F[tok.task];
      const c = mainChoice(tok.task);
      const fin = advanceClock(tok, f);
      S.tokens = S.tokens.filter((t) => t.id !== tok.id);
      log(tok.task, { who: tok.who, action: c ? c.label : (f.actionLabel || 'Hoàn thành'), cqcm: tok.cqcm, ff: true });
      if (f.round) S.vars.round += 1;
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
    },
    onChange(fn) { listeners.push(fn); },
    /* Về trạng thái chưa tạo hồ sơ — chạy lại từ SCR-25. */
    reset() { const keep = S ? S.qNotes : {}; const p = S ? S.persona : 'minh'; S = fresh(); S.qNotes = keep; S.persona = p; emit(); },
    /* SCR-25 Lưu (loại Phê duyệt): start instance theo quy trình người dùng chọn; sau đó không đổi được quy trình.
       opts: { dxms, name }. Prototype chạy một hồ sơ: hồ sơ đang chạy trước đó (nếu có) được thay. */
    create(process, opts) {
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
    jumpToScene(n) {
      const sc = window.D.scenes.find((s) => s.n === n);
      const keep = S.qNotes;
      fastForward(sc.start);
      S.qNotes = keep; S.persona = sc.who; S.lastScene = n;
      emit();
    },
    /* Nhánh phụ: tua tới `task` (hồ sơ tạo theo `process`, mặc định MS01.01), đặt biến (vd. round) và vai. */
    jumpTo(task, who, vars, process) {
      const keep = S.qNotes;
      fastForward(task, process);
      S.qNotes = keep; S.persona = who; Object.assign(S.vars, vars || {});
      emit();
    },
    /* Hồ sơ đang chạy: dữ liệu mẫu + mã, tên, quy trình của instance. */
    /* Hồ sơ đang chạy: dữ liệu mẫu + mã, tên, quy trình của instance + thông tin ĐXMS cha (title = tên ĐXMS, name = tên hồ sơ). */
    ci() {
      const x = (S.dxms && Flow.findDxms(S.dxms)) || {};
      const title = x.title || D.caseInfo.title;
      return Object.assign({}, D.caseInfo, { code: S.code || '—', dxms: S.dxms || '—', kind: 'PD', title, name: S.name || title, flow: S.vars.process || '—',
        unit: x.unit || D.caseInfo.unit, priority: x.priority || D.caseInfo.priority, secret: !!x.secret, period: x.period || D.caseInfo.period });
    },
    matchCheck,
    condOf,
    inRange: (process, total) => D.inRange(process, total, rules()),
    isTask,
    setPersona(id) { S.persona = id; emit(); },
    /* Dữ liệu người dùng nhập trên các màn (lựa chọn, tệp giả lập, cờ AI). */
    get ui() { return S.ui || (S.ui = {}); },
    setUi(k, v) { (S.ui || (S.ui = {}))[k] = v; emit(); },
    doneCount(n) { return S.history.filter((h) => String(h.task) === String(n)).length; },
    lastOf(n) { return S.history.filter((h) => String(h.task) === String(n)).slice(-1)[0]; },
    complete,
    mainChoice,
    tokensFor(pid) { return S.tokens.filter((t) => t.who === pid); },
    token(id) { return S.tokens.find((t) => t.id === id); },
    setNote(pid, text) { if (text) S.qNotes[pid] = text; else delete S.qNotes[pid]; emit(); },
    taskName,
    /* Trạng thái từng task cho timeline: done | active | todo | na (nhánh của quy trình khác, hồ sơ không đi qua)
       | cond (10a/10b — chỉ chạy khi giá trị không khớp quy trình). */
    taskStatus(n) {
      if (S.tokens.some((t) => String(t.task) === String(n))) return 'active';
      if (S.history.some((h) => String(h.task) === String(n))) return 'done';
      if ((D.notApplicable[S.vars.process] || []).includes(Number(n))) return 'na';
      if (['10a', '10b'].includes(String(n))) return 'cond';
      return 'todo';
    },
    currentStage() {
      if (S.status !== 'running') return null;
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
