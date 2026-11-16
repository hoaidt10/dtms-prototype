/* T54 — Trình ký VOffice theo SRS 32 (docs/SRS/32-srs-trinh-ky-voffice; plan docs/dtms/prototype-T54-trinh-ky-voffice.md).
   (1) Hộp thoại Trình ký VOffice (DTMS_CN_0271) thay UI.signDialog cũ — gán trước khi app.js đọc window.UI.
   (2) Lần trình ký (SRS 32 mục 2.4, bảng sign_request): lưu localStorage riêng, độc lập với luồng hồ sơ.
   (3) Màn Trình ký #/trinh-ky (DTMS_CN_0274) và thao tác trên lần trình (DTMS_CN_0273): Thu hồi, Lấy bản đã ký, Cập nhật trạng thái, Nhập kết quả ký.
   GIẢ LẬP (ghi ở (i)): mật khẩu VOffice mọi chuỗi khác rỗng là đúng, trừ "sai"; VOffice trả kết quả ngay (mã 3 — Đã ký, Bản ký Chưa lấy);
   danh mục Hình thức văn bản / Ngành / Độ mật / Độ khẩn và danh bạ VOffice là danh sách tĩnh.
   Theo: fe/repo-khcn-hr-tools-fe/src/app/features/timesheet/timesheet-board/components/timesheet-sign-dialog (hộp thoại),
         fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list (khuôn danh sách), fe/repo-khcn-hr-tools-fe/src/app/features/signing (thao tác theo trạng thái). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, vModal, toast, vSelect, badge, pager, norm } = window.UI;
  const rerender = () => window.App && window.App.render();
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp" title="${esc(v)}">${esc(v)}</span>` : dash);

  /* ---------- Danh mục VOffice (GIẢ LẬP — thật: categories/fields của cổng VOffice) ---------- */
  const FORMS = [{ id: 'TTR', title: 'Tờ trình', abbr: 'TTr' }, { id: 'QD', title: 'Quyết định', abbr: 'QĐ' }, { id: 'CV', title: 'Công văn', abbr: 'CV' },
    { id: 'BC', title: 'Báo cáo', abbr: 'BC' }, { id: 'PT', title: 'Phiếu trình', abbr: 'PT' }, { id: 'BB', title: 'Biên bản', abbr: '' }];
  const AREAS = ['Tổng hợp', 'Đầu tư', 'Tài chính', 'Kỹ thuật'];
  const SECS = ['Không mật', 'Mật', 'Tối mật', 'Tuyệt mật'];
  const PRIOS = ['Không khẩn', 'Khẩn', 'Thượng khẩn', 'Hỏa tốc'];
  /* BR-TKV-01-04: viết tắt của danh mục; không có thì chữ cái đầu mỗi từ, viết hoa. */
  const symbolOf = (id) => { const f = FORMS.find((x) => x.id === id); if (!f) return ''; return f.abbr || f.title.split(/\s+/).map((w) => w[0]).join('').toUpperCase(); };

  /* ---------- Trạng thái lần trình (SRS 32 mục 2.4, màu mục 4) ---------- */
  const ST = { PENDING_SIGN: ['Chờ ký', 'warning'], SIGNED: ['Đã ký', 'success'], REJECTED_SIGN: ['Từ chối', 'error'], CANCELLED_SIGN: ['Đã hủy', 'default'],
    UNPUBLISHED: ['Đã hủy ban hành', 'default'], RECALLED: ['Đã thu hồi', 'default'], FAILED: ['Lỗi gửi', 'error'], OFFLINE_PENDING: ['Chờ nhập kết quả', 'warning'] };
  const logTag = (s) => badge((ST[s] || [s])[0], (ST[s] || [])[1]);
  /* T56 Q4 (review Nhi 12/11 #31; be/vops-office VOfficeStatusEnum.fromVOfficeState state 0–4): danh sách, lọc, khối Trình ký chỉ dùng
     5 trạng thái VOffice trả về. Trạng thái nội bộ ĐTMS (Đã hủy, Đã thu hồi, Đã hủy ban hành, Lỗi gửi, Chờ nhập kết quả) chỉ ở Lịch sử cập nhật. */
  const VST = { DRAFT: ['Chưa trình ký', 'default'], PENDING: ['Đang xử lý', 'warning'], REJECTED: ['Bị từ chối', 'error'], SIGNED: ['Đã ký duyệt', 'success'], PUBLISHED: ['Đã ban hành', 'success'] };
  const vstOf = (r) => (r.st === 'PENDING_SIGN' || r.st === 'OFFLINE_PENDING' ? 'PENDING' : r.st === 'REJECTED_SIGN' ? 'REJECTED'
    : r.st === 'SIGNED' ? (r.docNo && r.method === 'VOFFICE' ? 'PUBLISHED' : 'SIGNED') : 'DRAFT');
  const stTag = (r) => badge(VST[vstOf(r)][0], VST[vstOf(r)][1]);
  /* Lịch sử cập nhật: hh:mm:ss - dd/mm/yyyy (review Nhi #23). */
  const nowTm = () => new Date().toTimeString().slice(0, 8);
  const atOf = (l) => `${l.tm || '08:00:00'} - ${l.at}`;
  const METHOD = { VOFFICE: 'VOffice', OFFLINE: 'Ký ngoài hệ thống' };
  /* Hình thức trình ký của ĐXMS (SRS 32 Q9 A: "Bản cứng" đổi thành "Ký ngoài hệ thống"; dữ liệu lưu cũ vẫn đọc được). */
  const OFF_SIGN = ['Ký ngoài hệ thống', 'Bản cứng'];

  /* Tên tài khoản (= tài khoản đăng nhập, BR-TKV-C-03): tên + chữ cái đầu họ, đệm, bỏ dấu — GIẢ LẬP theo persona. */
  function account(id) {
    const p = persona(id); if (!p) return id || '';
    const w = norm(p.name).split(/\s+/).filter(Boolean); const last = w.pop() || '';
    return (last + w.map((x) => x[0]).join('')).replace(/[^a-z0-9]/g, '');
  }
  const nameOf = (id) => (persona(id) || {}).name || id || '';
  const objLabel = (r) => (String(r.obj || '').startsWith(r.objType) ? String(r.obj || '') : `${r.objType} ${r.obj || ''}`);
  const today = () => (Flow.dateOf ? Flow.dateOf(Flow.state ? Flow.state.clock : 0) : '11/11/2026');

  /* ---------- Cấu hình trình ký mẫu (SRS 32 mục 3.1.2, phụ lục A) ----------
     src: 'ME' = NGUOI_TRINH; số = NGUOI_XU_LY_BUOC (task key). Văn bản không có dòng → mặc định một dòng người trình. */
  const CFG = {
    'BM-03': { form: 'PT', title: 'Phiếu yêu cầu thẩm định đề xuất mua sắm {ma}', rows: [['THỦ TRƯỞNG ĐƠN VỊ', 'ME', 1, 1]] },
    'BM-04': { form: 'PT', title: 'Phiếu nhận xét đề xuất mua sắm {ma}', rows: [['CHỈ HUY CƠ QUAN CHUYÊN MÔN', 'ME', 1, 1]] },
    'BM-09': { form: 'TTR', title: 'Thẩm định trực tiếp tờ trình đề xuất mua sắm {ma}', attach: ['BM-01'], rows: [[null, 'ME', 1, 1]] },
    'BM-05': { form: 'BC', title: 'Báo cáo kết quả thẩm định đề xuất mua sắm {ma}', attach: ['BM-01', 'CL01'], rows: [[null, 'ME', 1, 1]] },
    'BM-06': { form: 'CV', title: 'Báo cáo Tổng Giám đốc Tập đoàn về đề xuất mua sắm {ma}', attach: ['BM-01', 'BM-05', 'CL01'],
      rows: [['Người soạn thảo', 50, 0, 0], ['TỔNG GIÁM ĐỐC', 'ME', 1, 1]] },
    'BM-08': { form: 'QD', title: 'Quyết định phê duyệt đề xuất mua sắm {ma} – {ten}', attach: ['BM-01', 'BM-05'],
      rows: [['Người soạn thảo', 58, 0, 0], ['Người trình duyệt', 59, 0, 0], ['TỔNG GIÁM ĐỐC', 'ME', 1, 1]] },
  };
  const cfgOf = (doc) => CFG[String(doc).split(/\s|\+/)[0]] || { form: 'TTR', title: `${doc} — {ma}`, rows: [[null, 'ME', 1, 1]] };
  const whoOfStep = (k) => {
    const h = (Flow.state.history || []).slice().reverse().find((x) => String(x.task) === String(k) && x.who && !x.system);
    if (h) return h.who;
    const f = (Flow.def() || {})[k];
    return f && typeof f.who === 'string' && persona(f.who) ? f.who : null;
  };

  /* ---------- Lưu lần trình (localStorage riêng) ---------- */
  const STORE = 'dtms-proto-trinh-ky';
  let DB = null;
  function seed() {
    /* Dữ liệu mẫu đủ trạng thái (DTMS_CN_0274) — hồ sơ mẫu của danh sách ĐXMS / KĐT. */
    const S = (o) => Object.assign({ objType: 'ĐXMS', attempt: 1, method: 'VOFFICE', fetched: false, attach: [], log: [] }, o);
    const sg = (g, pos, who, show, locked) => ({ g, pos, who, name: nameOf(who), unit: (persona(who) || {}).unit || '', show: !!show, locked: !!locked });
    const list = [
      S({ obj: 'ĐXMS-2026-0098', objName: 'Mua sắm thiết bị đo kiểm vô tuyến 2026', step: 60, stepName: 'Xem xét, phê duyệt ĐXMS', doc: 'BM-09', by: 'tgd', at: '04/11/2026', st: 'SIGNED',
        signedAt: '05/11/2026', docNo: '98/TTr-VHT', fetched: true, info: { title: 'Phê duyệt trực tiếp tờ trình đề xuất mua sắm ĐXMS-2026-0098', form: 'TTR', symbol: 'TTr' },
        signers: [sg(1, 'TỔNG GIÁM ĐỐC', 'tgd', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0089', objName: 'Mua sắm vật tư thử nghiệm anten', step: 39, stepName: 'Ký thẩm định trực tiếp BM-09', doc: 'BM-09', by: 'binh', at: '06/11/2026', st: 'REJECTED_SIGN',
        reason: 'Lãnh đạo từ chối: Đề nghị bổ sung căn cứ giá', info: { title: 'Thẩm định trực tiếp tờ trình đề xuất mua sắm ĐXMS-2026-0089', form: 'TTR', symbol: 'TTr' },
        signers: [sg(1, 'PHÓ TỔNG GIÁM ĐỐC', 'binh', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0117', objName: 'Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2', step: 20, stepName: 'Xác nhận trình ký BM-04', doc: 'BM-04', by: 'tung', at: '07/11/2026', st: 'CANCELLED_SIGN',
        reason: 'Hủy luồng ký trên VOffice', info: { title: 'Phiếu nhận xét đề xuất mua sắm ĐXMS-2026-0117', form: 'PT', symbol: 'PT' }, signers: [sg(1, 'CHỈ HUY CƠ QUAN CHUYÊN MÔN', 'tung', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0117', objName: 'Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2', step: 20, stepName: 'Xác nhận trình ký BM-04', doc: 'BM-04', by: 'tung', at: '08/11/2026', attempt: 2,
        st: 'PENDING_SIGN', info: { title: 'Phiếu nhận xét đề xuất mua sắm ĐXMS-2026-0117', form: 'PT', symbol: 'PT' }, signers: [sg(1, 'CHỈ HUY CƠ QUAN CHUYÊN MÔN', 'tung', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0124', objName: 'Mua sắm máy chủ phục vụ trung tâm dữ liệu', step: 43, stepName: 'Xác nhận hồ sơ đủ điều kiện giao ký BM-05', doc: 'BM-05', by: 'lan', at: '09/11/2026', st: 'SIGNED',
        signedAt: '09/11/2026', info: { title: 'Báo cáo kết quả thẩm định đề xuất mua sắm ĐXMS-2026-0124', form: 'BC', symbol: 'BC' }, attach: ['BM-01', 'CL01'], signers: [sg(1, 'TRUNG TÂM MUA SẮM', 'lan', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0124', objName: 'Mua sắm máy chủ phục vụ trung tâm dữ liệu', step: 16.1, stepName: 'Chỉ huy ĐVĐX duyệt BM-03 và danh sách CQCM', doc: 'BM-03', by: 'hai', at: '03/11/2026', st: 'FAILED',
        reason: 'Không kết nối được hệ thống VOffice', info: { title: 'Phiếu yêu cầu thẩm định đề xuất mua sắm ĐXMS-2026-0124', form: 'PT', symbol: 'PT' }, signers: [sg(1, 'THỦ TRƯỞNG ĐƠN VỊ', 'hai', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0072', objName: 'Mua sắm thiết bị hạ tầng phòng lab', step: 51, stepName: 'Xác nhận trình ký BM-06', doc: 'BM-06', by: 'tgd', at: '02/11/2026', st: 'RECALLED',
        reason: 'Sai người ký nhóm 1', info: { title: 'Báo cáo Tổng Giám đốc Tập đoàn về đề xuất mua sắm ĐXMS-2026-0072', form: 'CV', symbol: 'CV' },
        signers: [sg(1, 'Người soạn thảo', 'lan', 0, 0), sg(2, 'TỔNG GIÁM ĐỐC', 'tgd', 1, 1)] }),
      S({ obj: 'ĐXMS-2026-0101', objName: 'Mua sắm linh kiện chế thử module RF', step: 38, stepName: 'Ký thẩm định trực tiếp BM-09', doc: 'BM-09', by: 'lan', at: '10/11/2026', method: 'OFFLINE', offMode: 'HAND',
        offReason: 'Đối tượng Mật', st: 'OFFLINE_PENDING', info: {}, signers: [sg(1, 'TRUNG TÂM MUA SẮM', 'lan', 1, 1)] }),
    ];
    list.forEach((r, i) => { r.id = i + 1; r.trans = transOf(r); r.log = [{ at: r.at, tm: `0${8 + (i % 2)}:${String(10 + i * 7).padStart(2, '0')}:${String(i * 13 % 60).padStart(2, '0')}`, actor: r.by, action: 'Trình ký', to: r.method === 'OFFLINE' ? 'OFFLINE_PENDING' : 'PENDING_SIGN' }]
      .concat(r.st !== 'PENDING_SIGN' && r.st !== 'OFFLINE_PENDING' ? [{ at: r.signedAt || r.at, tm: `1${4 + (i % 3)}:${String(5 + i * 4).padStart(2, '0')}:${String(i * 17 % 60).padStart(2, '0')}`, actor: r.st === 'RECALLED' ? r.by : null, action: r.st === 'RECALLED' ? 'Thu hồi' : 'Kết quả từ VOffice', to: r.st, note: r.reason || '' }] : []); });
    return { seq: list.length, list };
  }
  function transOf(r) {
    const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `DTMS-${r.objType === 'KĐT' ? 'KDT' : 'DXMS'}-${r.obj}-${r.step}-${String(r.doc).split(/\s|\+/)[0]}-${r.attempt}-${rnd}`;
  }
  function db() {
    if (DB) return DB;
    try { DB = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { DB = null; }
    if (!DB || !Array.isArray(DB.list)) DB = seed();
    return DB;
  }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(db())); } catch (e) { /* bỏ qua */ } };
  function reset() { DB = null; try { localStorage.removeItem(STORE); } catch (e) { /* bỏ qua */ } }
  function addLog(r, action, to, note, actor) { r.log.push({ at: today(), tm: nowTm(), actor: actor === undefined ? Flow.state.persona : actor, action, from: r.st, to, note: note || '' }); r.st = to; }

  /* ---------- Hộp thoại Trình ký VOffice (DTMS_CN_0271) ---------- */
  function ctx() {
    const ci = Flow.ci ? Flow.ci() : {};
    const m = /#\/task\/([^/?]+)/.exec(location.hash);
    const tok = m && (Flow.state.tokens || []).find((t) => String(t.id) === decodeURIComponent(m[1]));
    const step = tok ? tok.task : '';
    const f = (Flow.def() || {})[step] || {};
    const kdt = !!Flow.state.kdt;
    const secret = kdt ? (Flow.isMat ? Flow.isMat() : false) : !!ci.secret;
    const dx = !kdt && Flow.state.dxms && Flow.findDxms ? Flow.findDxms(Flow.state.dxms) : null;
    return { step, stepName: (Flow.taskName && step !== '' && Flow.taskName(step) !== step ? Flow.taskName(step) : f.name) || '', kdt, secret, offDefault: !!(dx && OFF_SIGN.includes(dx.sign)),
      objType: kdt ? 'KĐT' : 'ĐXMS', obj: kdt ? (Flow.state.kdt || ci.code) : (Flow.state.dxms || ci.dxms || ci.code), objName: ci.title || ci.name || '' };
  }
  /* Lần chạy luồng hiện tại: prototype dựng lại hồ sơ demo cùng mã, nên lần trình gắn với lần chạy (thật: khóa theo tiến trình Camunda). */
  const runOf = () => { if (!Flow.state.tkRun) Flow.state.tkRun = Math.random().toString(36).slice(2, 10); return Flow.state.tkRun; };
  function attemptOf(c, doc) {
    const k = String(doc).split(/\s|\+/)[0];
    const prev = db().list.filter((r) => r.run === runOf() && r.obj === c.obj && String(r.step) === String(c.step) && String(r.doc).split(/\s|\+/)[0] === k);
    return prev.length + 1;
  }
  function openOf(c, doc) {
    const k = String(doc).split(/\s|\+/)[0];
    return db().list.find((r) => r.run === runOf() && r.obj === c.obj && String(r.step) === String(c.step) && String(r.doc).split(/\s|\+/)[0] === k && ['PENDING_SIGN', 'FAILED', 'OFFLINE_PENDING'].includes(r.st));
  }

  function signDialog(doc, who) {
    return new Promise((resolve) => {
      const c = ctx(), cfg = cfgOf(doc), me = who || Flow.state.persona, P = persona(me) || {};
      /* BR-TKV-C-06: một lần trình chưa kết thúc cho mỗi (đối tượng, bước, văn bản). */
      if (openOf(c, doc)) { toast('Văn bản đang trong một lần trình ký chưa kết thúc. Vui lòng xử lý lần trình đó trước.', 'warn'); resolve(null); return; }
      const fill = (t) => String(t || '').replace('{ma}', c.obj || '').replace('{ten}', c.objName || '');
      const rows = cfg.rows.map(([pos, src, locked, show], i) => {
        const id = src === 'ME' ? me : whoOfStep(src);
        return { rel: i === 0 ? null : 'next', pos: pos || String(P.role || 'Người ký').toUpperCase(), who: id, unit: (persona(id) || {}).unit || '', show: !!show, locked: !!locked, cfg: true };
      /* Một người không có hai dòng (BR-TKV-01-09): dòng mẫu không khóa trùng người với dòng khác thì bỏ (vd 58, 59 cùng một chuyên viên TTMS). */
      }).filter((r, i, a) => !r.who || r.locked || !a.some((x, j) => x.who === r.who && (x.locked || j < i)));
      if (rows.length) rows[0].rel = null;
      const st = { mode: c.secret || c.offDefault ? 'hard' : 'soft', off: 'HAND', reason: '', pw: '', conn: false, sub: false,
        info: { title: fill(cfg.title).slice(0, 250), form: cfg.form, symbol: symbolOf(cfg.form), desc: fill(cfg.title).slice(0, 500), area: AREAS[0], sec: SECS[0], prio: PRIOS[0] },
        attach: (cfg.attach || []).map((x) => ({ name: `${x}-${c.obj}.pdf`, on: true, cfg: true })), rows, slots: Math.max(1, rows.filter((r) => r.show).length) };
      const groups = () => { let g = 0; return st.rows.map((r, i) => (g = i === 0 ? 1 : r.rel === 'same' ? g : g + 1)); };
      const req = (v) => (st.sub && !String(v || '').trim() ? 'invalid' : '');
      const msg = (v, t) => (st.sub && !String(v || '').trim() ? `<div class="msg">${t}</div>` : '');
      const dir = D.personas.map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` }));
      const field = (label, inner, req2, cls) => `<div class="vfield ${cls || ''}"><div class="lr"><label>${label}</label>${req2 ? '<span class="req">*</span>' : ''}</div>${inner}</div>`;
      function body() {
        const soft = st.mode === 'soft', dis = soft && !st.conn ? 'disabled' : '', g = groups(), lock = !c.secret;
        const sel = (k, opts) => vSelect({ id: 'tk-' + k, value: st.info[k], disabled: !!dis || k === 'sec', searchable: k === 'form', options: opts.map((x) => (typeof x === 'string' ? { value: x, label: x } : x)), invalid: st.sub && !st.info[k],
          onChange: (v) => { st.info[k] = v; if (k === 'form') st.info.symbol = symbolOf(v); paint(); } });
        const signers = st.rows.map((r, i) => {
          const gOpts = i === 0 ? [{ value: 'first', label: 'Nhóm 1' }] : [{ value: 'same', label: `Nhóm ${g[i - 1]}` }, { value: 'next', label: `Nhóm ${g[i - 1] + 1}` }];
          const err = !r.who ? (r.locked ? `Không xác định được người ký ${esc(r.pos)}. Vui lòng liên hệ quản trị viên.` : (st.sub ? 'Vui lòng chọn Tên người ký.' : '')) : '';
          return `<tr data-tk-row="${i}"><td class="c">${i + 1}</td>
            <td class="c"><div class="acts">${i > 0 ? `<button type="button" class="vbtn icon ghost sm" data-tk="up" aria-label="Lên">↑</button>` : ''}${i < st.rows.length - 1 ? `<button type="button" class="vbtn icon ghost sm" data-tk="down" aria-label="Xuống">↓</button>` : ''}</div></td>
            <td style="min-width:120px">${vSelect({ id: 'tk-g' + i, value: i === 0 ? 'first' : r.rel, disabled: !!dis || i === 0, options: gOpts, onChange: (v) => { r.rel = v; paint(); } })}</td>
            <td><input class="vctl" data-tk-pos="${i}" maxlength="200" value="${esc(r.pos)}" ${r.locked || dis ? 'disabled' : ''}></td>
            <td style="min-width:220px">${vSelect({ id: 'tk-w' + i, value: r.who, searchable: true, placeholder: 'Nhập tên để tìm', disabled: !!dis || (r.locked && !!r.who), invalid: !!err, options: dir,
              onChange: (v) => { r.who = v; r.unit = (persona(v) || {}).unit || ''; paint(); } })}${err ? `<div class="msg err">${err}</div>` : ''}</td>
            <td>${esc(r.unit || '') || dash}</td>
            <td class="c"><input type="checkbox" data-tk-show="${i}" ${r.show ? 'checked' : ''} ${r.locked || dis ? 'disabled' : ''}></td>
            <td class="c"><div class="acts">${r.locked ? `<span title="Người ký bắt buộc theo quy trình">${icon('lock')}</span>` : ''}
              <button type="button" class="vbtn icon ghost sm" data-tk="add" aria-label="Thêm" ${dis}>${icon('plus')}</button>
              ${r.locked ? '' : `<button type="button" class="vbtn icon ghost sm" data-tk="del" aria-label="Xóa" ${dis}>${icon('del')}</button>`}</div></td></tr>`;
        }).join('');
        return `<div class="stack tk-dlg">
          <div class="ginfo"><div><div class="k">Đối tượng</div><div class="v">${esc(objLabel(c))}${c.objName ? ' — ' + esc(c.objName) : ''}</div></div>
            <div><div class="k">Bước</div><div class="v">${esc(c.step ? `Bước ${c.step}${c.stepName ? ' ' + c.stepName : ''}` : '-')}</div></div>
            <div><div class="k">Lần trình</div><div class="v">${attemptOf(c, doc)}</div></div></div>
          ${field('Hình thức trình', `<div class="vradio">${window.UI.vRadio('VOffice', soft, 'data-mode="soft"', c.secret)}${window.UI.vRadio('Ký ngoài hệ thống', !soft, 'data-mode="hard"')}</div>
            ${c.secret ? '<div class="banner-moved">Đối tượng Mật — bắt buộc ký tay, không gửi qua VOffice.</div>' : ''}`)}
          ${soft ? `<div class="grid2">
              ${field('Tên người dùng', `<input class="vctl" value="${esc(account(me))}" disabled>`, true)}
              ${field('Mật khẩu', `<div class="tk-pw"><input class="vctl ${st.sub && !st.pw ? 'invalid' : ''}" id="tk-pw" type="password" autocomplete="off" placeholder="Nhập mật khẩu" value="${esc(st.pw)}">
                ${st.conn ? badge('Đã kết nối', 'success') : badge('Chưa kết nối', 'default')}</div>${st.sub && !st.pw ? '<div class="msg">Vui lòng nhập Mật khẩu.</div>' : ''}`, true, st.sub && !st.pw ? 'invalid' : '')}</div>
            <div class="${dis ? 'tk-off' : ''}">
              <div class="grid2">
                ${field('Trích yếu nội dung văn bản', `<input class="vctl" data-tk-info="title" maxlength="250" value="${esc(st.info.title)}" ${dis}>${msg(st.info.title, 'Vui lòng nhập Trích yếu nội dung văn bản.')}`, true, req(st.info.title))}
                ${field('Hình thức văn bản', sel('form', FORMS.map((f) => ({ value: f.id, label: f.title }))), true)}</div>
              ${field('Nội dung', `<input class="vctl" data-tk-info="desc" maxlength="500" value="${esc(st.info.desc)}" ${dis}>${msg(st.info.desc, 'Vui lòng nhập Nội dung.')}`, true, req(st.info.desc))}
              <div class="grid4">
                ${field('Ký hiệu văn bản', `<input class="vctl" data-tk-info="symbol" maxlength="50" value="${esc(st.info.symbol)}" ${dis}>${msg(st.info.symbol, 'Vui lòng nhập Ký hiệu văn bản.')}`, true, req(st.info.symbol))}
                ${field('Ngành', sel('area', AREAS), true)}${field('Độ mật', sel('sec', SECS), true)}${field('Độ khẩn', sel('prio', PRIOS), true)}</div></div>`
          : `${c.kdt ? '<div class="banner-moved">Sau khi xác nhận: in và trình bản giấy theo đúng người ký, thứ tự ký (bước 77); người phụ trách hồ sơ cập nhật kết quả, đính kèm bản scan (bước 78), xong mới đi tiếp.</div>' : ''}<div class="grid2">${field('Cách ký', `<div class="vradio">${window.UI.vRadio('Ký tay', st.off === 'HAND', 'data-off="HAND"')}${window.UI.vRadio('Tự trình trên VOffice', st.off === 'SELF', 'data-off="SELF"', c.secret)}</div>`)}</div>
            ${c.secret ? '' : field('Lý do ký ngoài hệ thống', `<textarea class="vctl ta" id="hr" rows="2" maxlength="500" placeholder="Nội dung">${esc(st.reason)}</textarea>${st.sub && !st.reason ? '<div class="msg">Vui lòng nhập Lý do ký ngoài hệ thống.</div>' : ''}`, true, st.sub && !st.reason ? 'invalid' : '')}`}
          ${field('Tệp trình ký', `<div class="tk-files"><div class="tk-file">${icon('file')} ${esc(`${doc}-${c.obj || ''}.pdf`)} <span class="faint">(tệp chính)</span></div>
            ${st.attach.map((a, i) => `<div class="tk-file">${a.cfg ? `<input type="checkbox" data-tk-att="${i}" ${a.on ? 'checked' : ''}>` : ''} ${icon('file')} ${esc(a.name)} <span class="faint">(kèm theo, không ký)</span>
              ${a.cfg ? '' : `<button type="button" class="vbtn icon ghost sm" data-tk="att-del" data-i="${i}" aria-label="Xóa">${icon('del')}</button>`}</div>`).join('')}
            ${soft ? `<button type="button" class="vbtn sm secondary" data-tk="att-up" ${dis}>${icon('upload')} Tải tệp lên</button>` : ''}</div>`)}
          <div class="vfield"><div class="lr"><label>Người ký</label><span class="req">*</span></div>
            <div class="vtable-vp ${dis ? 'tk-off' : ''}"><table class="vtable"><thead><tr><th class="c" style="width:50px">STT</th><th class="c" style="width:80px">Sắp xếp</th><th style="width:130px">Nhóm</th>
              <th style="width:180px">Chức danh</th><th style="width:240px">Tên người ký</th><th>Đơn vị</th><th class="c" style="width:110px">Hiển thị chữ ký</th><th class="c" style="width:110px">Hành động</th></tr></thead>
              <tbody>${signers}</tbody></table></div>${lock ? '' : ''}</div></div>`;
      }
      const m = vModal({ title: `Trình ký VOffice — ${doc}`, size: 'xl', body: '<div id="tk-body"></div>',
        actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="go">Trình ký</button>' });
      const box = m.el.querySelector('#tk-body');
      let painting = false;
      function paint() { painting = true; try { box.innerHTML = body(); } finally { painting = false; } m.el.querySelector('#go').textContent = st.mode === 'soft' ? 'Trình ký' : 'Xác nhận'; }
      paint();
      /* BR-TKV-01-02: kiểm tra tài khoản khi rời ô / Enter. */
      function connect(quiet) {
        if (!st.pw) return false;
        if (st.pw === 'sai') { if (st.bad === st.pw) return false; st.bad = st.pw; st.conn = false; toast('Tài khoản hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại', 'error'); paint(); return false; }
        if (!st.conn) { st.conn = true; if (!quiet) toast('Kết nối với hệ thống VOffice thành công'); paint(); }
        return true;
      }
      m.el.addEventListener('input', (e) => {
        const t = e.target;
        if (t.id === 'tk-pw') { st.pw = t.value; st.bad = null; }
        if (t.id === 'hr') st.reason = t.value.trim();
        if (t.dataset.tkInfo) st.info[t.dataset.tkInfo] = t.value;
        if (t.dataset.tkPos) st.rows[+t.dataset.tkPos].pos = t.value;
      });
      m.el.addEventListener('change', (e) => {
        const t = e.target;
        if (t.dataset.tkShow) { st.rows[+t.dataset.tkShow].show = t.checked; }
        if (t.dataset.tkAtt) { st.attach[+t.dataset.tkAtt].on = t.checked; }
      });
      m.el.addEventListener('focusout', (e) => { if (!painting && e.target.id === 'tk-pw' && st.pw && !st.conn) connect(); });
      m.el.addEventListener('keydown', (e) => { if (e.target.id === 'tk-pw' && e.key === 'Enter') { e.preventDefault(); connect(); } });
      m.el.addEventListener('click', (e) => {
        const t = e.target;
        const md = t.closest('[data-mode]');
        if (md) { e.preventDefault(); if (c.secret) return; st.mode = md.dataset.mode; st.sub = false; paint(); return; }
        const of = t.closest('[data-off]');
        if (of) { e.preventDefault(); if (c.secret && of.dataset.off === 'SELF') return; st.off = of.dataset.off; paint(); return; }
        const b = t.closest('[data-tk]');
        if (b) {
          const tr = b.closest('[data-tk-row]'), i = tr ? +tr.dataset.tkRow : -1, k = b.dataset.tk;
          if (k === 'up' && i > 0) { [st.rows[i - 1], st.rows[i]] = [st.rows[i], st.rows[i - 1]]; }
          if (k === 'down' && i < st.rows.length - 1) { [st.rows[i + 1], st.rows[i]] = [st.rows[i], st.rows[i + 1]]; }
          if (k === 'del') st.rows.splice(i, 1);
          if (k === 'add') { askGroup().then((keep) => { if (keep == null) return; st.rows.splice(i + 1, 0, { rel: keep ? 'same' : 'next', pos: 'Người phê duyệt', who: null, unit: '', show: false, locked: false }); paint(); }); return; }
          if (k === 'att-up') { if (st.attach.filter((a) => !a.cfg).length >= 10) { toast('Tệp không hợp lệ. Chỉ chấp nhận PDF, DOC, DOCX, XLS, XLSX, tối đa 20 MB mỗi tệp, 10 tệp.', 'error'); return; } st.attach.push({ name: `Tai-lieu-bo-sung-${st.attach.length + 1}.pdf`, on: true }); }
          if (k === 'att-del') st.attach.splice(+b.dataset.i, 1);
          if (st.rows.length) st.rows[0].rel = null;
          paint(); return;
        }
        if (t.closest('#go')) { e.preventDefault(); submit(); return; }
        if (t.closest('[data-close]') || t === m.el) resolve(null);
      });
      function submit() {
        st.sub = true;
        if (st.mode === 'soft') {
          if (!st.pw) { paint(); return; }
          if (!connect(true)) return;
          const inf = st.info;
          if (!['title', 'form', 'desc', 'symbol', 'area', 'sec', 'prio'].every((k) => String(inf[k] || '').trim())) { paint(); return; }
        } else if (!c.secret && !st.reason) { paint(); toast('Vui lòng nhập Lý do ký ngoài hệ thống.', 'warn'); return; }
        /* TKV-KT-03, 04 (BR-TKV-01-08…10). */
        const miss = st.rows.find((r) => !r.who);
        if (!st.rows.length || miss) { paint(); toast(miss && miss.locked ? `Không xác định được người ký ${miss.pos}. Vui lòng liên hệ quản trị viên.` : 'Vui lòng chọn Tên người ký.', 'warn'); return; }
        const dup = st.rows.find((r, i) => st.rows.findIndex((x) => x.who === r.who) !== i);
        if (dup) { toast(`${nameOf(dup.who)} đã có trong danh sách người ký.`, 'warn'); return; }
        const shown = st.rows.filter((r) => r.show).length;
        if (!shown) { toast('Cần ít nhất một người ký hiển thị chữ ký trên văn bản.', 'warn'); return; }
        if (shown > st.slots) { toast(`Văn bản chỉ có ${st.slots} vị trí chữ ký. Vui lòng bỏ chọn Hiển thị chữ ký ở ${shown - st.slots} người ký.`, 'warn'); return; }
        m.el.querySelector('#go').disabled = true;
        const g = groups(), d = db();
        const r = { id: ++d.seq, run: runOf(), objType: c.objType, obj: c.obj, objName: c.objName, step: c.step, stepName: c.stepName, doc, attempt: attemptOf(c, doc),
          method: st.mode === 'soft' ? 'VOFFICE' : 'OFFLINE', offMode: st.mode === 'soft' ? null : st.off, offReason: st.mode === 'soft' ? '' : (st.reason || 'Đối tượng Mật'),
          info: st.mode === 'soft' ? Object.assign({}, st.info) : {}, attach: st.attach.filter((a) => a.on).map((a) => a.name), by: me, at: today(), fetched: false, log: [],
          signers: st.rows.map((x, i) => ({ g: g[i], pos: x.pos, who: x.who, name: nameOf(x.who), unit: x.unit, show: x.show, locked: x.locked })), st: null };
        r.trans = transOf(r);
        if (r.method === 'VOFFICE') {
          addLog(r, 'Trình ký', 'PENDING_SIGN');
          /* GIẢ LẬP G2: VOffice trả mã 3 (Ký duyệt thành công) ngay — Bản ký Chưa lấy (BR-TKV-C-10). */
          addLog(r, 'Kết quả từ VOffice — Ký duyệt thành công', 'SIGNED', '', null); r.signedAt = today();
        } else addLog(r, 'Trình ký ngoài hệ thống', 'OFFLINE_PENDING', r.offReason);
        d.list.push(r); save();
        if (r.method === 'VOFFICE') toast('Trình ký VOffice thành công');
        m.close();
        resolve({ mode: st.mode, reason: st.mode === 'hard' ? r.offReason : null, req: r.id });
      }
    });
  }
  function askGroup() {
    return new Promise((res) => {
      const m = vModal({ title: 'Giữ nhóm hiện tại hay chèn thêm nhóm?', body: '<p>Chọn cách thêm người ký vào dưới dòng đang chọn.</p>',
        actions: '<button class="vbtn secondary" data-g="keep">Giữ nhóm</button><button class="vbtn primary" data-g="ins">Chèn nhóm</button>' });
      m.el.addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) { m.close(); res(b.dataset.g === 'keep'); } else if (e.target.closest('[data-close]') || e.target === m.el) res(null); });
    });
  }

  /* ---------- Hộp nhập mật khẩu VOffice dùng chung (mục 4) ---------- */
  function askPw(title) {
    return new Promise((res) => {
      const me = Flow.state.persona;
      const m = vModal({ title, body: `<div class="grid2"><div class="vfield"><div class="lr"><label>Tên đăng nhập</label><span class="req">*</span></div><input class="vctl" value="${esc(account(me))}" disabled></div>
        <div class="vfield"><div class="lr"><label>Mật khẩu</label><span class="req">*</span></div><input class="vctl" id="tk-pw2" type="password" autocomplete="off" placeholder="Nhập mật khẩu"></div></div>`,
        actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="tk-pw-ok">Tiếp tục</button>' });
      m.el.addEventListener('click', (e) => {
        if (e.target.closest('#tk-pw-ok')) {
          const v = m.el.querySelector('#tk-pw2').value;
          if (!v) { toast('Vui lòng nhập Mật khẩu.', 'warn'); return; }
          if (v === 'sai') { toast('Tài khoản hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại', 'error'); return; }
          m.close(); res(true);
        } else if (e.target.closest('[data-close]') || e.target === m.el) res(false);
      });
    });
  }

  /* ---------- Thao tác trên lần trình (DTMS_CN_0273) ---------- */
  const isAdmin = () => ['qt', 'qlqt'].includes(Flow.state.persona);
  const isSigner = (r, p) => r.signers.some((s) => s.who === p);
  function acts(r) {
    const p = Flow.state.persona, mine = r.by === p, rel = mine || isSigner(r, p) || isAdmin();
    const a = ['view'];
    if (r.st === 'PENDING_SIGN') { if (rel) a.push('sync'); if (mine) a.push('recall'); }
    if (r.st === 'SIGNED') { a.push('dl'); if (r.method === 'VOFFICE' && !r.fetched && rel) a.push('fetch'); }
    if (r.st === 'OFFLINE_PENDING' && mine) a.push('result');
    /* D-112 (T58): Từ chối không Gửi lại — quy trình đã đi nhánh không đồng ý (BR-TKV-02-03, BR-TKV-04-03). */
    /* [T60 #68] Đã hủy / Đã thu hồi bỏ Gửi lại trên danh sách và khối Trình ký — trình lại từ công việc của bước (hộp thoại Trình ký, lần trình mới).
       Lỗi gửi giữ Gửi lại: lần trình lỗi chưa kết thúc (BR-TKV-C-06) nên không trình mới được. Bản cũ: ['FAILED', 'CANCELLED_SIGN', 'RECALLED'] */
    if (r.st === 'FAILED' && mine) a.push('resend');
    return a;
  }
  const ACT = { view: ['file', 'Xem'], sync: ['reload', 'Cập nhật trạng thái từ VOffice'], recall: ['back', 'Thu hồi'], dl: ['download', 'Tải bản ký'],
    fetch: ['sign', 'Lấy bản đã ký'], result: ['edit', 'Nhập kết quả ký'], resend: ['play', 'Gửi lại'] };
  const find = (id) => db().list.find((r) => String(r.id) === String(id));

  async function fetchSigned(list) {
    const ok = list.filter((r) => r.st === 'SIGNED' && r.method === 'VOFFICE' && !r.fetched);
    if (!(await askPw('Lấy bản đã ký'))) return;
    ok.forEach((r) => { r.fetched = true; r.log.push({ at: today(), actor: Flow.state.persona, action: 'Lấy bản đã ký', from: r.st, to: r.st, note: '' }); });
    save(); toast(list.length > 1 ? `Đã xử lý ${ok.length} / ${list.length} lần trình.` : 'Đã lấy bản đã ký từ VOffice.'); rerender();
  }
  async function syncStatus(list) {
    const ok = list.filter((r) => r.st === 'PENDING_SIGN');
    if (!(await askPw('Cập nhật trạng thái từ VOffice'))) return;
    /* GIẢ LẬP: tra chi tiết văn bản thấy Ký duyệt thành công. */
    ok.forEach((r) => { addLog(r, 'Cập nhật trạng thái từ VOffice — Ký duyệt thành công', 'SIGNED', '', Flow.state.persona); r.signedAt = today(); });
    save(); toast(list.length > 1 ? `Đã xử lý ${ok.length} / ${list.length} lần trình.` : ok.length ? 'Văn bản đã được ký trên VOffice.' : 'Văn bản vẫn đang chờ ký trên VOffice.'); rerender();
  }
  function recall(r) {
    const m = vModal({ title: 'Thu hồi', body: `<p>Thu hồi chỉ có hiệu lực trên ĐTMS. Bạn cần hủy luồng ký trên VOffice để người ký không tiếp tục ký. Bạn có chắc muốn thu hồi?</p>
      <div class="vfield"><div class="lr"><label>Lý do</label><span class="req">*</span></div><textarea class="vctl ta" id="tk-rc" rows="3" maxlength="500" placeholder="Nội dung"></textarea></div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="tk-rc-ok">Thu hồi</button>' });
    m.el.querySelector('#tk-rc-ok').onclick = () => {
      const v = m.el.querySelector('#tk-rc').value.trim();
      if (!v) { toast('Vui lòng nhập Lý do.', 'warn'); return; }
      if (r.st !== 'PENDING_SIGN') { m.close(); toast('Lần trình đã có kết quả từ VOffice, không thu hồi được.', 'warn'); rerender(); return; }
      r.reason = v; addLog(r, 'Thu hồi', 'RECALLED', v); save(); m.close(); toast('Thu hồi thành công'); rerender();
    };
  }
  function enterResult(r) {
    const m = vModal({ title: `Nhập kết quả ký — ${r.doc}`, size: 'md', body: `<div class="stack">
      <div class="vfield"><div class="lr"><label>Kết quả</label></div><div class="vradio">${window.UI.vRadio('Đã ký', true, 'data-kq="ok"')}${window.UI.vRadio('Từ chối', false, 'data-kq="no"')}</div></div>
      <div id="kq-ok" class="stack"><div class="vfield"><div class="lr"><label>Bản ký</label><span class="req">*</span></div><div><button type="button" class="vbtn sm red" id="kq-up">${icon('upload')} Tải file lên</button></div></div>
        <div class="grid2"><div class="vfield"><div class="lr"><label>Số văn bản</label></div><input class="vctl" id="kq-no" maxlength="50"></div>
        <div class="vfield"><div class="lr"><label>Ngày ký</label><span class="req">*</span></div>${window.UI.vDate('id="kq-date"', today())}</div></div></div>
      <div id="kq-no-w" class="stack" style="display:none"><div class="vfield"><div class="lr"><label>Người từ chối</label><span class="req">*</span></div><input class="vctl" id="kq-who" maxlength="200"></div>
        <div class="vfield"><div class="lr"><label>Lý do từ chối</label><span class="req">*</span></div><textarea class="vctl ta" id="kq-rs" rows="3" maxlength="2000"></textarea></div></div></div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="kq-go">Xác nhận kết quả ký</button>' });
    let ok = true, file = false;
    m.el.addEventListener('click', (e) => {
      const k = e.target.closest('[data-kq]');
      if (k) { e.preventDefault(); ok = k.dataset.kq === 'ok'; m.el.querySelectorAll('[data-kq]').forEach((x) => x.classList.toggle('on', x === k)); m.el.querySelector('#kq-ok').style.display = ok ? '' : 'none'; m.el.querySelector('#kq-no-w').style.display = ok ? 'none' : ''; }
      if (e.target.closest('#kq-up')) { file = true; e.target.closest('#kq-up').outerHTML = `<span class="file">${icon('file')} ${esc(r.doc)}-da-ky.pdf</span>`; }
    });
    m.el.querySelector('#kq-go').onclick = () => {
      if (ok) {
        const dt = m.el.querySelector('#kq-date').value.trim();
        if (!file) { toast('Vui lòng tải bản đã ký.', 'warn'); return; }
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dt)) { toast('Ngày ký không hợp lệ.', 'warn'); return; }
        r.docNo = m.el.querySelector('#kq-no').value.trim(); r.signedAt = dt; r.fetched = true; addLog(r, 'Nhập kết quả ký — Đã ký', 'SIGNED');
      } else {
        const w = m.el.querySelector('#kq-who').value.trim(), rs = m.el.querySelector('#kq-rs').value.trim();
        if (!w || !rs) { toast('Vui lòng nhập Người từ chối và Lý do từ chối.', 'warn'); return; }
        r.reason = `${w}: ${rs}`; addLog(r, 'Nhập kết quả ký — Từ chối', 'REJECTED_SIGN', r.reason);
      }
      save(); m.close(); toast('Thực hiện hành động thành công.'); rerender();
    };
  }
  function resend(r) {
    /* D-112: chặn Gửi lại lần trình Từ chối (SRS 32 mục 3.4, bảng trường hợp; AC-0273-17). */
    if (r.st === 'REJECTED_SIGN') { toast('Văn bản đã bị từ chối, quy trình đã chuyển sang bước sửa văn bản. Không gửi lại được lần trình này.', 'warn'); return; }
    if (r.st === 'FAILED') {
      askPw('Gửi lại').then((ok) => { if (!ok) return; addLog(r, 'Gửi lại', 'PENDING_SIGN'); addLog(r, 'Kết quả từ VOffice — Ký duyệt thành công', 'SIGNED', '', null); r.signedAt = today(); save(); toast('Trình ký VOffice thành công'); rerender(); });
      return;
    }
    /* Đã hủy, Đã thu hồi: lần trình mới (BR-TKV-03-02) — GIẢ LẬP: chép lần trước, gửi sau khi nhập mật khẩu. */
    askPw('Gửi lại').then((ok) => {
      if (!ok) return;
      const d = db(), n = JSON.parse(JSON.stringify(r));
      Object.assign(n, { id: ++d.seq, attempt: r.attempt + 1, at: today(), by: Flow.state.persona, st: null, reason: '', fetched: false, log: [], signedAt: null, docNo: '' });
      n.trans = transOf(n); addLog(n, 'Trình ký', 'PENDING_SIGN'); addLog(n, 'Kết quả từ VOffice — Ký duyệt thành công', 'SIGNED', '', null); n.signedAt = today();
      d.list.push(n); save(); toast('Trình ký VOffice thành công'); rerender();
    });
  }
  function view(r) {
    const kv = (k, v) => `<div><div class="k">${k}</div><div class="v">${v || dash}</div></div>`;
    const f = FORMS.find((x) => x.id === (r.info || {}).form);
    vModal({ title: `Chi tiết lần trình — ${r.doc} ${r.obj}`, size: 'xl', body: `<div class="stack">
      <div class="ginfo">${kv('Đối tượng', esc(`${objLabel(r)} — ${r.objName}`))}${kv('Bước', esc(`Bước ${r.step} ${r.stepName || ''}`))}${kv('Lần trình', esc(String(r.attempt)))}
        ${kv('Mã giao dịch', `<code>${esc(r.trans)}</code>`)}${kv('Hình thức', esc(METHOD[r.method] + (r.offMode ? ' — ' + (r.offMode === 'HAND' ? 'Ký tay' : 'Tự trình trên VOffice') : '')))}${kv('Trạng thái', stTag(r))}
        ${kv('Lý do', esc(r.reason || r.offReason || ''))}${kv('Số văn bản', esc(r.docNo || ''))}${kv('Ngày ký', esc(r.signedAt || ''))}</div>
      ${r.method === 'VOFFICE' ? `<div class="ginfo">${kv('Trích yếu', esc(r.info.title || ''))}${kv('Hình thức văn bản', esc(f ? f.title : ''))}${kv('Ký hiệu', esc(r.info.symbol || ''))}
        ${kv('Ngành', esc(r.info.area || AREAS[0]))}${kv('Độ mật', esc(r.info.sec || SECS[0]))}${kv('Độ khẩn', esc(r.info.prio || PRIOS[0]))}</div>` : ''}
      <div class="vfield"><div class="lr"><label>Tệp</label></div><div class="tk-files"><div class="tk-file">${icon('file')} <a class="link" data-tk-file="${esc(r.doc)}-${esc(r.obj)}.pdf">${esc(r.doc)}-${esc(r.obj)}.pdf</a> <span class="faint">(tệp chính${r.st === 'SIGNED' ? (r.fetched ? ', đã có bản ký' : ', bản ký chưa lấy') : ''})</span> <button type="button" class="vbtn icon ghost" data-tk-file="${esc(r.doc)}-${esc(r.obj)}.pdf" aria-label="Tải xuống" title="Tải xuống">${icon('download')}</button></div>
        ${(r.attach || []).map((a) => `<div class="tk-file">${icon('file')} <a class="link" data-tk-file="${esc(a)}">${esc(a)}</a> <span class="faint">(kèm theo)</span> <button type="button" class="vbtn icon ghost" data-tk-file="${esc(a)}" aria-label="Tải xuống" title="Tải xuống">${icon('download')}</button></div>`).join('')}</div></div>
      <div class="vfield"><div class="lr"><label>Người ký</label></div><div class="vtable-vp"><table class="vtable"><thead><tr><th class="c">Nhóm</th><th>Chức danh</th><th>Tên người ký</th><th>Đơn vị</th><th class="c">Hiển thị chữ ký</th><th class="c">Khóa</th></tr></thead>
        <tbody>${r.signers.map((s) => `<tr><td class="c">${s.g}</td><td>${esc(s.pos)}</td><td>${esc(s.name)}</td><td>${esc(s.unit)}</td><td class="c">${s.show ? 'Có' : 'Không'}</td><td class="c">${s.locked ? icon('lock') : ''}</td></tr>`).join('')}</tbody></table></div></div>
      <div class="vfield"><div class="lr"><label>Lịch sử cập nhật</label></div><div class="vtable-vp"><table class="vtable"><thead><tr><th>Thời điểm</th><th>Người / VOffice</th><th>Thao tác</th><th>Trạng thái</th><th>Nội dung</th></tr></thead>
        <tbody>${r.log.map((l, i) => Object.assign({ i }, l)).reverse().map((l) => `<tr><td>${esc(atOf(l))}</td><td>${esc(l.actor ? nameOf(l.actor) : 'VOffice')}</td><td>${esc(l.action)}</td><td>${l.from ? logTag(l.from) + ' → ' : ''}${logTag(l.to)}</td><td>${esc(l.note || '')}</td></tr>`).join('')}</tbody></table></div></div></div>`,
      actions: '<button class="vbtn secondary" data-close>Đóng</button>' });
  }
  function act(k, r) {
    if (k === 'view') return view(r);
    if (k === 'sync') return syncStatus([r]);
    if (k === 'recall') return recall(r);
    if (k === 'fetch') return fetchSigned([r]);
    if (k === 'result') return enterResult(r);
    if (k === 'resend') return resend(r);
    if (k === 'dl') { const name = `${r.doc}-${r.obj}${r.fetched ? '' : '-chua-ky'}.pdf`; if (!r.fetched) toast('Bản chưa có chữ ký. Bản đã ký chưa được lấy về từ VOffice.', 'warn'); else toast(`Đã tải ${esc(name)}`); }
  }


  /* ---------- Khối Trình ký ở màn xử lý công việc / chi tiết đối tượng (BR-TKV-03-08) ----------
     Mỗi văn bản một dòng theo lần trình mới nhất. Đối tượng đang chạy luồng demo: chỉ lần trình của lần chạy hiện tại; đối tượng khác: lần trình mẫu. */
  const liveObj = (obj) => (Flow.state.kdt ? Flow.state.kdt === obj : (Flow.state.dxms || (Flow.ci ? Flow.ci().dxms : null)) === obj);
  function latest(obj) {
    const live = liveObj(obj), by = {};
    db().list.filter((r) => r.obj === obj && (live ? r.run && r.run === Flow.state.tkRun : !r.run)).forEach((r) => {
      const k = String(r.doc).split(/\s|\+/)[0], o = by[k];
      if (!o || r.attempt > o.attempt || (r.attempt === o.attempt && r.id > o.id)) by[k] = r;
    });
    return Object.values(by).sort((a, b) => a.id - b.id);
  }
  function block(obj, o) {
    const list = latest(obj), pad = o && o.pad ? ' pad24' : '';
    const cols = [['Thao tác', 150, 'c'], ['Văn bản', 110], ['Bước', 220], ['Lần trình', 90, 'c'], ['Hình thức', 150], ['Trạng thái', 150, 'c'], ['Bản ký', 100, 'c'], ['Số văn bản', 130], ['Ngày ký', 110, 'c'], ['Lý do', 200]];
    const warn = list.filter((r) => r.st === 'UNPUBLISHED').map((r) => `<div class="banner-moved">Văn bản ${esc(r.doc)} đã bị hủy ban hành trên VOffice ngày ${esc(r.signedAt || r.at)}. Vui lòng xử lý theo quy định.</div>`).join('');
    const body = list.map((r) => `<tr data-tk-id="${r.id}" data-tk-row-view class="tk-click"><td class="c"><div class="acts">${acts(r).map((k) => `<button type="button" class="vbtn icon ghost" data-tk-act="${k}" aria-label="${ACT[k][1]}" title="${ACT[k][1]}">${icon(ACT[k][0])}</button>`).join('')}</div></td>
      <td>${esc(r.doc)}</td><td>${clamp(`Bước ${r.step} ${r.stepName || ''}`)}</td><td class="c">${r.attempt}</td><td>${esc(METHOD[r.method] + (r.offMode ? ' — ' + (r.offMode === 'HAND' ? 'Ký tay' : 'Tự trình trên VOffice') : ''))}</td>
      <td class="c">${stTag(r)}</td><td class="c">${r.st === 'SIGNED' && r.method === 'VOFFICE' ? badge(r.fetched ? 'Đã lấy' : 'Chưa lấy', r.fetched ? 'success' : 'warning') : dash}</td>
      <td>${esc(r.docNo || '') || dash}</td><td class="c">${esc(r.signedAt || '') || dash}</td><td>${clamp(r.reason || r.offReason || '')}</td></tr>`).join('');
    return `<section class="vcard${pad}" data-tkb><div class="vcard-h"><h3>Trình ký</h3>${'' /* [T56 bỏ — review Nhi 12/11 #42] <div class="row"><a class="link" data-go="trinh-ky">Xem màn Trình ký</a></div> */}</div>${warn}
      <div class="vtable-vp"><table class="vtable"><thead><tr>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
      <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length}"><img src="assets/empty-table.svg" alt="">Chưa có văn bản trình ký</td></tr>`}</tbody></table></div></section>`;
  }
  /* Trạng thái ký của văn bản theo lần trình mới nhất (tab Tài liệu & văn bản, Văn bản đầu ra). */
  function docStatus(obj, code) {
    const r = latest(obj).find((x) => String(x.doc).split(/\s|\+/)[0] === String(code).split(/\s|\+/)[0]);
    return r ? { st: r.st, label: VST[vstOf(r)][0], tone: VST[vstOf(r)][1], r } : null;
  }

  /* ---------- Màn Trình ký (DTMS_CN_0274) ---------- */
  const emptyF = () => ({ st: [], method: null, fetched: null, by: null, signer: null });
  const L = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 20, psOpen: false, sel: [] };
  /* T56 Q3 (review Nhi 12/11 #26): bỏ tab Tôi trình / Tôi ký — một danh sách; lọc Người trình ký, Người ký thay tab.
     Phạm vi xem = lần trình của ĐXMS / KĐT người dùng có quyền xem (quyền xem đối tượng cha, S7).
     GIẢ LẬP: mọi vai demo có quyền xem các ĐXMS / KĐT mẫu nên thấy mọi lần trình. Lệch SRS 32 DTMS_CN_0274 (tab). */
  // [T56 bỏ tab] function inTab(r, tab) { const p = Flow.state.persona; if (tab === 'mine') return r.by === p; if (tab === 'sign') return isSigner(r, p); return isAdmin(); }
  const canView = () => true;
  function rows() {
    const f = L.f, dk = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s || '')); return m ? `${m[3]}${m[2].padStart(2, '0')}${m[1].padStart(2, '0')}` : ''; };
    return db().list.filter(canView).filter((r) => (!L.adv ? !L.kw || norm(`${r.obj} ${r.objName} ${(r.info || {}).title || ''} ${r.docNo || ''}`).includes(norm(L.kw))
      : (!f.st.length || f.st.includes(vstOf(r))) && (!f.by || r.by === f.by) && (!f.signer || isSigner(r, f.signer)) && (!f.method || r.method === f.method) && (f.fetched == null || (r.st === 'SIGNED' && (f.fetched === 'y') === !!r.fetched))))
      /* BR-TKV-04-05: Ngày trình giảm dần → Mã đối tượng tăng dần. */
      .sort((a, b) => dk(b.at).localeCompare(dk(a.at)) || a.obj.localeCompare(b.obj) || b.id - a.id);
  }
  /* Ô lọc Người trình ký / Người ký: người có trong các lần trình. */
  const people = (k) => [...new Set(db().list.flatMap((r) => (k === 'by' ? [r.by] : r.signers.map((x) => x.who))).filter(Boolean))]
    .map((id) => ({ value: id, label: nameOf(id) })).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  function page() {
    const p = Flow.state.persona;
    const list = rows(), pages = Math.max(1, Math.ceil(list.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 150, 'c'], ['Đối tượng', 170], ['Tên đối tượng', 240], ['Văn bản', 110], ['Bước', 200], ['Trích yếu', 260], ['Người trình', 160], ['Người ký', 140],
      ['Hình thức', 140], ['Trạng thái', 150, 'c'], ['Bản ký', 110, 'c'], ['Số văn bản', 130], ['Ngày trình', 120, 'c'], ['Ngày ký', 120, 'c']];
    const body = list.slice(from, from + L.size).map((r, i) => {
      const groups = new Set(r.signers.map((s) => s.g)).size;
      return `<tr data-tk-id="${r.id}"><td class="c"><input type="checkbox" data-tk-sel="${r.id}" ${L.sel.includes(r.id) ? 'checked' : ''}></td><td class="ord">${from + i + 1}</td>
        <td class="c"><div class="acts">${acts(r).map((k) => `<button type="button" class="vbtn icon ghost" data-tk-act="${k}" aria-label="${ACT[k][1]}" title="${ACT[k][1]}">${icon(ACT[k][0])}</button>`).join('')}</div></td>
        <td><a class="link" data-go="${r.objType === 'KĐT' ? 'kdt' : 'luong'}/${encodeURIComponent(r.obj)}">${esc(objLabel(r))}</a></td><td>${clamp(r.objName)}</td>
        <td>${esc(r.doc)}</td><td>${clamp(`Bước ${r.step} ${r.stepName || ''}`)}</td><td>${r.method === 'OFFLINE' ? dash : clamp((r.info || {}).title)}</td><td>${esc(nameOf(r.by))}</td>
        <td><span title="${esc(r.signers.map((s) => `Nhóm ${s.g}: ${s.name}`).join('\n'))}">${r.signers.length} người · ${groups} nhóm</span></td><td>${esc(METHOD[r.method])}</td>
        <td class="c">${stTag(r)}</td><td class="c">${r.st === 'SIGNED' && r.method === 'VOFFICE' ? badge(r.fetched ? 'Đã lấy' : 'Chưa lấy', r.fetched ? 'success' : 'warning') : dash}</td>
        <td>${esc(r.docNo || '') || dash}</td><td class="c">${esc(r.at)}</td><td class="c">${esc(r.signedAt || '') || dash}</td></tr>`;
    }).join('');
    const empty = db().list.some(canView) ? 'Không tìm thấy dữ liệu phù hợp' : 'Chưa có dữ liệu';
    const sel = (k, label, opts, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'tkf-' + k, value: L.d[k], clear: true, placeholder: 'Tất cả', options: opts, onChange: (v) => { L.d[k] = v; rerender(); } }, o || {}))}</div>`;
    const info = {
      scr: 'SCR-113', name: 'Trình ký', uc: 'SRS 32 · DTMS_CN_0273, DTMS_CN_0274',
      notes: [
        '<b>T72 (kho comment #90):</b> hộp nhập mật khẩu VOffice ghi <b>Tên đăng nhập</b> (tự điền theo tài khoản, khoá) + Mật khẩu. Nút <b>Lấy bản đã ký</b> / <b>Cập nhật trạng thái</b> luôn bấm được: có chọn dòng → áp cho dòng đã chọn; chưa chọn → áp cho mọi lần trình đủ điều kiện trong danh sách đang xem; không có lần trình nào đủ điều kiện → báo, không mở hộp mật khẩu.',
        '<b>T54</b> (người dùng 11/11): màn theo SRS 32 Trình ký VOffice (<code>docs/SRS/32-srs-trinh-ky-voffice</code>). Mỗi dòng là <b>một lần trình</b>.',
        '<b>T56</b> (review Nhi 12/11): <b>bỏ tab</b> Tôi trình / Tôi ký (#26) — một danh sách, lọc <b>Người trình ký</b>, <b>Người ký</b>; người không trình / không ký vẫn xem được lần trình của ĐXMS / KĐT mình có quyền xem (GIẢ LẬP: mọi vai demo xem được mọi lần trình mẫu). Lệch SRS 32 DTMS_CN_0274. <b>Trạng thái</b> (#31, Q4) chỉ còn 5 giá trị VOffice trả về (<code>be/vops-office</code> <code>VOfficeStatusEnum.fromVOfficeState</code> 0–4): Chưa trình ký, Đang xử lý, Bị từ chối, Đã ký duyệt, Đã ban hành (Đã ký duyệt + có Số văn bản). Đã hủy / Đã thu hồi / Đã hủy ban hành / Lỗi gửi hiện là Chưa trình ký, chi tiết ở <b>Lịch sử cập nhật</b> của hộp thoại (đổi tên từ Nhật ký, #22; thời điểm hh:mm:ss - dd/mm/yyyy, mới nhất trước, #23, #24; tải tệp, #25).',
        'Thao tác theo trạng thái (BR-TKV-04-03): Chờ ký — Cập nhật trạng thái, Thu hồi (người trình); Đã ký — Tải bản ký, Lấy bản đã ký khi Chưa lấy; Từ chối — chỉ Xem (quy trình đã đi nhánh không đồng ý); Lỗi gửi — Gửi lại (Đã hủy / Đã thu hồi: trình lại từ công việc, T60); Chờ nhập kết quả — Nhập kết quả ký. Chọn nhiều dòng để Lấy bản đã ký / Cập nhật trạng thái, nhập mật khẩu VOffice một lần.',
        'GIẢ LẬP: mật khẩu VOffice mọi chuỗi khác rỗng là đúng (gõ <code>sai</code> để thấy lỗi); VOffice trả kết quả ngay (mã 3 — Đã ký, Bản ký Chưa lấy). Thật: cổng VOffice, bảng <code>sign_request</code> (SRS 32 mục 5).',
        'Không thu hồi được trên VOffice (VOffice không có lời gọi hủy — người dùng chốt 11/11): thu hồi chỉ có hiệu lực trên ĐTMS.',
        '<b>T58 / D-112</b> (12/11): Từ chối không Gửi lại — đi nhánh không đồng ý.',
        '<b>T60</b> (review Nhi 12/11 #68): Đã hủy / Đã thu hồi <b>bỏ Gửi lại</b> trên danh sách — trình lại từ công việc của bước (bấm nút trình ký, hộp thoại mở lần trình mới). Chỉ Lỗi gửi còn Gửi lại (gửi lại chính lần trình lỗi). Lệch SRS 32 BR-TKV-04-03. Hộp thoại Trình ký VOffice là popup của nền tảng (#67), không phải eForm của bước: eForm (nếu nút có) xác nhận trước, hệ thống sinh văn bản rồi mới mở popup (BR-TKV-01-01).',
      ],
      src: 'SRS 32 · fe/repo-khcn-hr-tools-fe features/signing · profile-management/profile-list (khuôn)',
    };
    return `<div class="pg" data-tkl>
      ${window.Screens.head({ title: 'Trình ký', info })}
      <div class="vcard">
        <div class="pg-head"><div class="l"><button type="button" class="vbtn secondary" data-tk-bulk="fetch">${icon('sign')} Lấy bản đã ký</button>
          <button type="button" class="vbtn secondary" data-tk-bulk="sync">${icon('reload')} Cập nhật trạng thái</button></div><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:320px">${icon('search')}<input id="tk-kw" maxlength="255" placeholder="Tìm theo mã, tên đối tượng, trích yếu, số văn bản" value="${esc(L.kw)}"></label>`}
          <button type="button" class="vbtn ${L.adv ? 'active' : 'secondary'}" data-tk-adv>${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? `<form class="adv" data-tkadv><div class="grid3">
            ${sel('st', 'Trạng thái', Object.entries(VST).map(([v, [l]]) => ({ value: v, label: l })), { multi: true })}
            ${sel('by', 'Người trình ký', people('by'), { placeholder: 'Tất cả' })}
            ${sel('signer', 'Người ký', people('signer'), { placeholder: 'Tất cả' })}
            ${sel('method', 'Hình thức', Object.entries(METHOD).map(([v, l]) => ({ value: v, label: l })))}
            ${sel('fetched', 'Bản ký', [{ value: 'y', label: 'Đã lấy' }, { value: 'n', label: 'Chưa lấy' }])}</div>
          <div class="acts"><button type="button" class="vbtn secondary" data-tk-reset>Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>` : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="c" style="width:44px"><input type="checkbox" data-tk-selall></th><th class="ord">STT</th>
          ${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 2}"><img src="assets/empty-table.svg" alt="">${empty}</td></tr>`}</tbody></table></div>
        ${pager({ id: 'tk', total: list.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  /* T56 (review Nhi #25): tải tệp ở hộp thoại Chi tiết lần trình. GIẢ LẬP: thông báo tải; thật: API tải tệp của lần trình (MinIO). */
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-tk-file]'); if (!f) return;
    e.preventDefault(); toast(`Đã tải ${esc(f.dataset.tkFile)}`);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-tkl], [data-tkb]')) return;
    const t = e.target;
    if (t.closest('[data-tk-adv]')) { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; rerender(); return; }
    if (t.closest('[data-tk-reset]')) { L.d = emptyF(); L.f = emptyF(); L.page = 1; rerender(); return; }
    const a = t.closest('[data-tk-act]'); if (a) { const r = find(a.closest('[data-tk-id]').dataset.tkId); if (r) act(a.dataset.tkAct, r); return; }
    /* Khối Trình ký: bấm dòng mở Chi tiết lần trình. */
    const rv = t.closest('[data-tk-row-view]'); if (rv && !t.closest('a, button, input')) { const r = find(rv.dataset.tkId); if (r) view(r); return; }
    /* [T72 #90] nút hàng loạt luôn bấm được: chưa chọn dòng → áp cho mọi lần trình đủ điều kiện trong danh sách đang xem; luôn hỏi Tên đăng nhập + Mật khẩu VOffice (askPw). */
    const bk = t.closest('[data-tk-bulk]'); if (bk) { const f = bk.dataset.tkBulk === 'fetch', list = L.sel.length ? L.sel.map(find).filter(Boolean) : rows().filter((r) => (f ? r.st === 'SIGNED' && r.method === 'VOFFICE' && !r.fetched : r.st === 'PENDING_SIGN'));
      if (!list.length) { toast(f ? 'Không có lần trình nào chờ lấy bản đã ký.' : 'Không có lần trình nào đang chờ ký.', 'warn'); return; } L.sel = []; (bk.dataset.tkBulk === 'fetch' ? fetchSigned : syncStatus)(list); return; }
    const pg = t.closest('[data-pager="tk"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg); else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen; else return;
      rerender();
    }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.tkSel) { const id = Number(t.dataset.tkSel); L.sel = t.checked ? L.sel.concat(id) : L.sel.filter((x) => x !== id); rerender(); }
    if (t.hasAttribute && t.hasAttribute('data-tk-selall')) { const ids = rows().slice((L.page - 1) * L.size, L.page * L.size).map((r) => r.id); L.sel = t.checked ? ids : []; rerender(); }
  });
  document.addEventListener('submit', (e) => { if (!e.target.matches('[data-tkadv]')) return; e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); });
  let kwTimer = null;
  document.addEventListener('input', (e) => {
    if (e.target.id !== 'tk-kw') return;
    L.kw = e.target.value; clearTimeout(kwTimer);
    kwTimer = setTimeout(() => { L.page = 1; rerender(); const el = document.getElementById('tk-kw'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 500);
  });

  /* Reset luồng demo (nút nổi) khôi phục cả lần trình mẫu. */
  const flowReset = Flow.reset;
  Flow.reset = function () { reset(); return flowReset.apply(this, arguments); };
  /* KĐT ký ngoài hệ thống: bước 78 (Cập nhật kết quả ký ngoài hệ thống) xong → lần trình Chờ nhập kết quả của lần chạy thành Đã ký (nguồn ký ngoài hệ thống, SRS 27 KPD-HX-09). */
  const flowComplete = Flow.complete;
  Flow.complete = function (tokenId) {
    const tok = (Flow.state.tokens || []).find((t) => t.id === tokenId), kdt = Flow.state.kdt;
    const out = flowComplete.apply(this, arguments);
    if (tok && kdt && String(tok.task) === '78') {
      const r = db().list.filter((x) => x.obj === kdt && x.run === Flow.state.tkRun && x.st === 'OFFLINE_PENDING').pop();
      if (r) { r.signedAt = today(); r.fetched = true; addLog(r, 'Bước 78 — Cập nhật kết quả ký ngoài hệ thống: Đã ký', 'SIGNED'); save(); }
    }
    return out;
  };
  /* Thay hộp thoại ký cũ (app.js đọc window.UI.signDialog lúc nạp). */
  window.UI.signDialog = signDialog;
  window.TrinhKy = { signDialog, page, block, latest, docStatus, list: () => db().list, reset, find, account, OFF_SIGN };
})();
