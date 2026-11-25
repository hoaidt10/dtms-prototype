/* Phân hệ Quản lý sản xuất — bộ chạy luồng và Việc của tôi (T71 S2, D-121).
   Một bộ chạy cho mọi luồng nháp D.sxFlows (SX-KH ở S2; SX-BG, SX-BT, SX-TD, SX-NT ở S3, S6–S8): bước, người xử lý, nút, eForm đều đọc từ cấu hình;
   điều kiện / tác động lên dự án nằm ở bộ xử lý hành động ACT (thật: job worker / action handler của engine, không code riêng từng màn).
   Hồ sơ lưu localStorage (sx-proto-flow); hồ sơ mẫu ở D.sxCases. Route: #/sx/viec-cua-toi (SX-15), #/sx/viec/<mã hồ sơ>/<mã việc> (SX-05 — xử lý việc),
   #/sx/viec/<mã hồ sơ>/xem/<chỉ số lịch sử> (việc đã xử lý, chế độ Xem). Màn xử lý việc = Chi tiết dự án + thanh trạng thái (khuôn my-task-detail, như D-92 ĐXMS). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;

  /* ---------- Ngày ---------- */
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const addDays = (s, n) => { const x = new Date(Date.parse(String(s).slice(0, 10) + 'T00:00:00') + n * 86400000); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
  const isoOf = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;

  /* ---------- Kho hồ sơ ---------- */
  const KEY = 'sx-proto-flow';
  const seed = () => ({ cases: JSON.parse(JSON.stringify(D.sxCases || [])), seq: 0 });
  let S = seed();
  try { const x = JSON.parse(localStorage.getItem(KEY) || 'null'); if (x && Array.isArray(x.cases)) S = x; } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } };
  const FL = (k) => D.sxFlows[k];
  const stepOf = (flow, id) => FL(flow).steps.find((s) => String(s[0]) === String(id));
  const cases = (obj, flow) => S.cases.filter((c) => (!obj || c.obj === obj) && (!flow || c.flow === flow));
  const caseOf = (code) => S.cases.find((c) => c.code === code) || null;
  const running = (obj, flow) => cases(obj, flow).find((c) => c.status === 'running') || null;
  const pid = () => Flow.state.persona;
  const isAdmin = (id) => D.allAccess(id) || id === 'qt';
  const mine = (t, id) => t.who === id || isAdmin(id);
  const dueOf = (c, t) => addDays(t.since, (stepOf(c.flow, t.step)[3] || {}).nlv || 2);
  const late = (c, t) => dueOf(c, t) < D.sxToday;
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  /* Đối tượng cha của luồng (D.sxFlows[*].obj): dự án sản xuất (sx-du-an.js) hoặc gói chuyển giao (sx-chuyen-giao.js). Mỗi loại: byCode, detail(code, opt). */
  const OBJ = { project: () => window.SxDuAn, package: () => window.SxCg, issue: () => window.SxBt, change: () => window.SxTd, lot: () => window.SxNt, proposal: () => window.SxMs };
  const objOf = (c) => OBJ[FL(c.flow).obj || 'project']();
  const objRec = (c) => objOf(c).byCode(c.obj);

  /* ---------- Bộ xử lý hành động (cấu hình bước gọi theo tên) ---------- */
  const ACT = {
    'kh.start': (c) => P().log(c.obj, 'Khởi tạo hồ sơ phê duyệt kế hoạch', c.code),
    /* (b) Q1: bước 1 không bắt buộc — bỏ qua thì xoá dữ liệu báo cáo cũ (lần trình trước), ghi lý do; trình thì lưu tài liệu báo cáo phương án. */
    'kh.pa': (c, ch, x) => {
      const v = c.vars, skip = ch && ch[1] === 3;
      if (skip) { ['paTomTat', 'paRangBuoc', 'paGoiMs', 'paPhoiHop', 'paFile', 'paQtcn', 'cdNoiDung'].forEach((k) => delete v[k]); P().log(c.obj, 'Không lập báo cáo phương án sản xuất', v.paLyDo || ''); return; }
      delete v.paLyDo;
      P().log(c.obj, 'Trình báo cáo phương án sản xuất', `${(v.paRangBuoc || []).length} ràng buộc cần xin ý kiến`);
      if (v.paFile && (x.values || {}).paFile) P().addDoc(c.obj, [v.paFile, 'PA', 'v1.0', pid(), D.sxToday]);
    },
    /* Bước 2: ý kiến chỉ đạo của Ban Giám đốc Khối là căn cứ lập kế hoạch (QT bước 1 đầu ra: báo cáo được BGĐ Khối phê duyệt). */
    'kh.direct': (c, ch) => P().log(c.obj, ch && ch[2] === 'no' ? 'Yêu cầu chỉnh sửa báo cáo phương án' : 'Đồng ý phương án sản xuất', c.vars.cdNoiDung || ''),
    'kh.submit': (c) => P().log(c.obj, 'Trình kế hoạch sản xuất', `Kế hoạch số ${c.vars.khSo || ''}`),
    'kh.approve': (c, ch) => P().log(c.obj, ch && ch[2] === 'no' ? 'Trả lại kế hoạch sản xuất' : 'Phê duyệt kế hoạch sản xuất', ch && ch[2] === 'no' ? c.vars.ykNoiDung || '' : `Kế hoạch số ${c.vars.khSo || ''}`),
    /* Bước 5 xong: chốt kế hoạch gốc (khung 15 bước theo ngày dự án + các mốc chính của kế hoạch), dự án sang Chuẩn bị sản xuất, ghi tài liệu kế hoạch đã phê duyệt,
       quyết định giao nhiệm vụ và biên bản kick-off (QT bước 3, Q6). */
    'kh.baseline': (c) => {
      const v = c.vars;
      P().patch(c.obj, { baseline: D.sxToday, status: 'PREPARING', keyMs: v.khMoc || [], subPm: v.koSubPm || null, planNo: v.khSo || '' }, 'Chốt kế hoạch gốc', `Kick-off ngày ${v.koNgay || ''}${v.koChuTri ? `, chủ trì ${pName(v.koChuTri)}` : ''}`);
      P().addDoc(c.obj, [`Kế hoạch sản xuất ${v.khSo || ''} (đã phê duyệt).pdf`, 'KH', 'v1.0', pid(), D.sxToday].concat((v.kySo || []).length ? ['SIGN'] : []));
      if (v.koQuyetDinh) P().addDoc(c.obj, [v.koQuyetDinh, 'QDGV', 'v1.0', pid(), D.sxToday]);
      if (v.koBienBan) P().addDoc(c.obj, [v.koBienBan, 'KO', 'v1.0', pid(), D.sxToday]);
    },
  };
  const run = (name, c, ch, x) => { if (name && ACT[name]) ACT[name](c, ch, x || {}); };
  /* Điều kiện chặn hành động (luật hiển thị nút / kiểm tra trước khi gửi): trả về câu báo lỗi hoặc null. Bộ chặn đăng ký thêm ở module nghiệp vụ. */
  const GUARD = {};
  const guardMsg = (c, t) => { const g = (stepOf(c.flow, t.step)[3] || {}).guard; return g && GUARD[g] ? GUARD[g](c, t) : null; };

  function enter(c, to) {
    if (to === 'end') {
      c.status = 'done'; c.tokens = []; c.ended = nowStamp();
      run(FL(c.flow).onEnd, c);
      c.hist.push({ step: null, who: null, act: (typeof FL(c.flow).endText === 'function' ? FL(c.flow).endText(c) : FL(c.flow).endText) || 'Kết thúc', at: nowStamp() });
      return;
    }
    /* Nhánh song song: next là mảng → mở mọi nhánh cùng lúc (parallel gateway). */
    if (Array.isArray(to)) { c.tokens = []; to.forEach((x) => open(c, x)); return; }
    c.tokens = [];
    open(c, to);
  }
  function open(c, to) {
    const st = stepOf(c.flow, to), o = st[3] || {};
    if (st[2] === 'svc') { run(o.action, c, null, { step: st[0] }); c.hist.push({ step: st[0], who: null, act: o.label || 'Hệ thống xử lý', at: nowStamp() }); enter(c, o.next); return; }
    S.seq += 1;
    c.tokens.push({ id: 't' + S.seq, step: st[0], who: D.sxAssign(st[2], objRec(c)), since: nowStamp() });
  }
  /* Khởi tạo hồ sơ của đối tượng: mã <short>-<mã đối tượng>-<lần>, mở bước 1. Trả về hồ sơ. */
  function start(flow, obj) {
    const n = cases(obj, flow).length + 1, c = { code: `${FL(flow).short}-${obj}-${String(n).padStart(2, '0')}`, flow, obj, status: 'running', started: nowStamp(), tokens: [], vars: {}, hist: [] };
    S.cases.push(c);
    c.hist.push({ step: null, who: pid(), act: 'Khởi tạo hồ sơ', at: nowStamp() });
    run(FL(flow).onStart, c);
    enter(c, FL(flow).steps[0][0]);
    persist();
    return c;
  }
  /* Hoàn thành việc: ghi biến của form (output mapping), ghi lịch sử, chạy bộ xử lý của bước, sang bước theo nút.
     sign = kết quả ký số MySign của bước có cấu hình sign (T71 S12): ghi vào biến kySo của hồ sơ và dòng lịch sử. */
  function complete(code, tokId, ci, values, sign) {
    const c = caseOf(code), t = c && c.tokens.find((x) => x.id === tokId);
    if (!t) return null;
    const st = stepOf(c.flow, t.step), o = st[3] || {}, ch = o.choices ? o.choices[ci] : null, f = formOf(c.flow, o.form);
    const v = {};
    (f ? f.write : []).forEach((k) => { if (values && values[k] !== undefined) v[k] = values[k]; });
    Object.assign(c.vars, v);
    if (c.drafts) delete c.drafts[tokId];
    if (sign) c.vars.kySo = (c.vars.kySo || []).concat([Object.assign({ step: st[0] }, sign)]);
    c.hist.push(Object.assign({ step: st[0], who: pid(), act: ch ? ch[0] : o.label || 'Hoàn thành', note: f && f.note ? f.note(c.vars) : '', since: t.since, at: nowStamp(), values: v }, sign ? { sign } : {}));
    run(o.action, c, ch, { step: st[0], values: v });
    const to = ch ? ch[1] : o.next, rest = c.tokens.filter((x) => x.id !== tokId);
    const join = to !== 'end' && !Array.isArray(to) && (stepOf(c.flow, to)[3] || {}).join;
    /* Hợp nhánh: sang bước join khi mọi nhánh song song đã xong; nhánh khác còn chờ thì chỉ đóng việc này. Đi hướng khác (trả lại) thì huỷ các nhánh còn lại. */
    if (join && rest.length) c.tokens = rest;
    else {
      rest.forEach((x) => c.hist.push({ step: x.step, who: null, act: 'Huỷ do nhánh song song trả lại', since: x.since, at: nowStamp(), sys: true }));
      enter(c, to);
    }
    persist();
    return c;
  }
  const formOf = (flow, key) => (key && window.EForms.sx[flow] ? window.EForms.sx[flow][key] : null);
  const tokensFor = (id) => S.cases.flatMap((c) => c.tokens.filter((t) => mine(t, id)).map((t) => ({ c, t })));
  const pending = (id) => tokensFor(id).length;
  /* T74 #95: số việc quá hạn của người dùng (khối Gợi ý cho bạn trên Dashboard). */
  const overdue = (id) => tokensFor(id).filter(({ c, t }) => late(c, t)).length;

  /* ---------- SX-15 Việc của tôi ---------- */
  /* Góp ý 25/11 (Việc của tôi): gộp 2 tab thành 1 danh sách — việc Chưa xử lý lên trước (hạn gần nhất trước), sau đó việc đã xử lý (mới nhất trước);
     bỏ cột Mã dự án (hiện Tên dự án, link xem chi tiết dự án), bỏ Ngày nhận việc, bỏ đếm bước n/N; cột Bước cần xử lý đổi thành Nội dung cần thực hiện (bấm mở màn Xử lý);
     Ngày xử lý kèm giờ; thêm Kết quả xử lý (Đồng ý / Bị từ chối), cột Thao tác (icon mở màn Xử lý / Xem), bộ lọc Chu kỳ. */
  const M = { kw: '', per: null };
  const FLOW_STAGE = { 'SX-KH': 'G1', 'SX-MS': 'G2', 'SX-BG': 'G2', 'SX-BGNM': 'G2', 'SX-BT': 'G3', 'SX-TD': 'G3', 'SX-NT': 'G3' };
  const projCode = (c) => (P().byCode(c.obj) ? c.obj : (objRec(c) || {}).project || null);
  /* Trạng thái chi tiết theo việc cụ thể của bước (thay cho "Chưa xử lý" chung chung). GIẢ LẬP: suy từ động từ đầu tên bước — thật: cấu hình nhãn trạng thái của bước trong BPMN. */
  const ST_RULE = [[/^(Lập|Tạo)\b/i, 'Đang soạn hồ sơ'], [/^Phê duyệt/i, 'Chờ phê duyệt'], [/phê duyệt/i, 'Chờ phê duyệt'], [/^Thẩm định/i, 'Đang thẩm định'], [/^Kiểm tra/i, 'Đang kiểm tra'],
    [/^Tiếp nhận/i, 'Chờ tiếp nhận'], [/cho ý kiến/i, 'Chờ cho ý kiến'], [/^Phân tích/i, 'Đang phân tích'], [/^Đề xuất/i, 'Đang đề xuất phương án'], [/^Triển khai/i, 'Đang triển khai xử lý'],
    [/^Cập nhật/i, 'Đang cập nhật hồ sơ'], [/^Lưu/i, 'Đang lưu hồ sơ'], [/^Họp/i, 'Đang họp, giao nhiệm vụ'], [/^Đánh giá/i, 'Đang đánh giá'], [/nghiệm thu/i, 'Đang nghiệm thu'], [/^Đơn vị sản xuất/i, 'Chờ đơn vị sản xuất tiếp nhận']];
  const stName = (name) => (ST_RULE.find(([re]) => re.test(name)) || [0, 'Đang xử lý'])[1];
  /* Kết quả xử lý của bước đã xong: nút thuộc nhánh từ chối / trả lại (cờ 'no') → Bị từ chối; còn lại → Đồng ý. */
  const resultOf = (c, h) => { const ch = ((stepOf(c.flow, h.step)[3] || {}).choices || []).find((x) => x[0] === h.act); return ch && ch[2] === 'no' ? ['Bị từ chối', 'error'] : ['Đồng ý', 'success']; };
  /* Độ trễ (Q2, giờ đồng hồ): mốc = cuối ngày Hạn xử lý; dưới 24 giờ tính giờ (làm tròn lên), từ 24 giờ làm tròn ngày; không trễ thì để trống. GIẢ LẬP P-269. */
  const ts = (s) => Date.parse(String(s).replace(' ', 'T') + (String(s).length <= 10 ? 'T00:00:00' : ':00'));
  function delayTxt(due, end) {
    const h = (ts(end) - (Date.parse(due + 'T00:00:00') + DAY_MS)) / 3600000;
    if (!(h > 0)) return '';
    return h < 24 ? `${Math.max(1, Math.ceil(h))} giờ` : `${Math.round(h / 24)} ngày`;
  }
  const DAY_MS = 86400000;
  /* Chu kỳ: so với ngày dữ liệu D.sxToday; việc chưa xử lý xét Hạn xử lý, việc đã xử lý xét Ngày xử lý. */
  const PER = [['NGAY', 'Hôm nay'], ['TUAN', 'Tuần này'], ['THANG', 'Tháng này'], ['QUY', 'Quý này'], ['NAM', 'Năm nay']];
  function perRange(k) {
    const t = new Date(D.sxToday + 'T00:00:00'), iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (k === 'NGAY') return [D.sxToday, D.sxToday];
    if (k === 'TUAN') { const a = new Date(t); a.setDate(t.getDate() - ((t.getDay() + 6) % 7)); const b = new Date(a); b.setDate(a.getDate() + 6); return [iso(a), iso(b)]; }
    if (k === 'THANG') return [iso(new Date(t.getFullYear(), t.getMonth(), 1)), iso(new Date(t.getFullYear(), t.getMonth() + 1, 0))];
    if (k === 'QUY') { const q = Math.floor(t.getMonth() / 3) * 3; return [iso(new Date(t.getFullYear(), q, 1)), iso(new Date(t.getFullYear(), q + 3, 0))]; }
    return [`${t.getFullYear()}-01-01`, `${t.getFullYear()}-12-31`];
  }
  function rows(id) {
    const n = window.UI.norm;
    const base = (c, step, since) => ({ c, step: stepOf(c.flow, step)[1], proj: projCode(c), stage: window.SxDuAn.stageName(FLOW_STAGE[c.flow]), due: addDays(since, (stepOf(c.flow, step)[3] || {}).nlv || 2) });
    const todo = tokensFor(id).map(({ c, t }) => Object.assign(base(c, t.step, t.since), { todo: true, over: late(c, t), go: `sx/viec/${encodeURIComponent(c.code)}/${t.id}`, doneAt: '', res: null }))
      .map((r) => Object.assign(r, { st: [stName(r.step), r.over ? 'error' : 'info'], key: r.due, delay: delayTxt(r.due, nowStamp()) }))
      .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
    const done = S.cases.flatMap((c) => c.hist.map((h, i) => ({ h, i })).filter(({ h }) => h.step != null && h.who && !h.sys && (h.who === id || isAdmin(id)))
      .map(({ h, i }) => Object.assign(base(c, h.step, h.since || h.at), { todo: false, st: ['Đã xử lý', 'success'], doneAt: h.at, key: String(h.at).slice(0, 10), res: resultOf(c, h), go: `sx/viec/${encodeURIComponent(c.code)}/xem/${i}` }))
      .map((r) => Object.assign(r, { delay: delayTxt(r.due, r.doneAt) })))
      .sort((a, b) => (a.doneAt < b.doneAt ? 1 : -1));
    const [from, to] = M.per ? perRange(M.per) : ['', '9999'];
    return todo.concat(done).filter((r) => {
      const p = objRec(r.c) || {}, pj = r.proj && P().byCode(r.proj);
      return r.key >= from && r.key <= to && (!M.kw || n(`${p.code} ${r.proj || ''} ${(pj || {}).name || ''} ${p.name || p.title || ''} ${r.step}`).includes(n(M.kw)));
    });
  }
  const OPEN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function tasks() {
    // Theo: fe/repo-khcn-dtms-fe/src/app/features/my-tasks/my-tasks.component.html (như SCR-01 Việc của tôi của ĐTMS; đối tượng cha = dự án sản xuất)
    const k = K(), id = pid(), list = rows(id), cnt = pending(id);
    const info = {
      scr: 'SX-15', name: 'Việc của tôi (Quản lý sản xuất)', uc: 'CDS-BT-03COP COP2; SX-KS-K1 §3.1–3.3',
      notes: [
        '<b>Góp ý 25/11:</b> gộp 2 tab Chưa xử lý / Đã hoàn thành thành <b>một danh sách</b>, việc chưa xử lý lên trước (hạn gần nhất trước), việc đã xử lý sau (mới nhất trước). Bỏ cột Mã dự án (hiện <b>Tên dự án</b>, link mở chi tiết dự án — tooltip "Xem chi tiết dự án"), bỏ Ngày nhận việc, bỏ đếm bước n/N. Cột <b>Nội dung cần thực hiện</b> (thay Bước cần xử lý) bấm được để mở màn Xử lý; cột <b>Thao tác</b> có icon mở màn Xử lý / Xem. <b>Ngày xử lý</b> kèm giờ. Thêm cột <b>Kết quả xử lý</b>: Đồng ý / Bị từ chối (nút thuộc nhánh trả lại, từ chối). Thêm bộ lọc <b>Chu kỳ</b> (Hôm nay, Tuần, Tháng, Quý, Năm này — việc chưa xử lý xét Hạn xử lý, việc đã xử lý xét Ngày xử lý).',
        '<b>Trạng thái</b> chi tiết theo việc cụ thể của bước (Đang soạn hồ sơ, Chờ phê duyệt, Đang thẩm định, Đang kiểm tra, Chờ tiếp nhận…; đỏ khi quá hạn), việc đã xong là Đã xử lý. GIẢ LẬP: suy từ tên bước — thật: nhãn trạng thái cấu hình theo bước của BPMN.',
        '<b>Giai đoạn</b>: giai đoạn QT.VHT.TTSX.4A.1.1 của quy trình (Lập kế hoạch; Chuẩn bị sản xuất; Tổ chức sản xuất). <b>Độ trễ</b>: tính từ cuối ngày Hạn xử lý tới lúc xử lý (việc chưa xong: tới hiện tại), dưới 1 ngày ghi số giờ — GIẢ LẬP P-269.',
        'Việc sinh từ luồng nháp D.sxFlows (GIẢ LẬP P-238); người xử lý theo vai của bước (GIẢ LẬP P-244). Hạn xử lý = ngày nhận việc + định mức ngày của bước (ngày lịch, GIẢ LẬP); quá hạn tô đỏ.',
      ],
      q: ['P-238', 'P-244', 'P-269'], src: 'my-tasks/my-tasks.component · /my-tasks',
    };
    const cols = [['Trạng thái', 170, 'c'], ['Dự án', 220], ['Tên công việc', 240], ['Nội dung cần thực hiện', 260], ['Giai đoạn', 150],
      ['Hạn xử lý', 110], ['Ngày xử lý', 150], ['Kết quả xử lý', 130, 'c'], ['Độ trễ', 90, 'r'], ['Thao tác', 90, 'c']];
    const body = list.map((r, i) => {
      const p = objRec(r.c) || {}, pj = r.proj && P().byCode(r.proj);
      /* Tên công việc = tên quy trình + đối tượng (phiếu, ECR, lô, gói chuyển giao); dự án ở cột riêng. */
      const title = `${FL(r.c.flow).name}${r.proj && r.proj !== r.c.obj ? `: ${p.name || p.title || r.c.obj}` : pj ? '' : `: ${p.name || p.title || r.c.obj}`}`;
      const projTd = pj ? `<a class="link" data-go="sx/du-an/${encodeURIComponent(pj.code)}" title="Xem chi tiết dự án">${esc(pj.name)}</a>` : k.dash;
      const tip = r.todo ? 'Mở màn hình xử lý' : 'Xem việc đã xử lý';
      return `<tr class="click ${r.todo ? 'sxv-todo' : 'sxv-done'}" data-go="${r.go}"><td class="ord">${i + 1}</td><td class="c">${badge(...r.st)}</td><td>${projTd}</td>
        <td>${k.clamp(title)}</td><td><a class="link" data-go="${r.go}" title="${tip}">${esc(r.step)}</a></td><td>${k.clamp(r.stage)}</td>
        <td class="num${r.over ? ' due-over' : ''}">${esc(dmy(r.due))}</td><td class="num">${r.doneAt ? esc(dmy(r.doneAt)) : k.dash}</td>
        <td class="c">${r.res ? badge(...r.res) : k.dash}</td><td class="r num ${r.delay ? 't-err' : ''}">${r.delay ? esc(r.delay) : k.dash}</td>
        <td class="c"><button type="button" class="vbtn icon ghost" data-go="${r.go}" title="${tip}" aria-label="${tip}">${OPEN}</button></td></tr>`;
    }).join('');
    const perSel = window.UI.vSelect({ id: 'sxv-per', value: M.per, clear: true, searchable: false, placeholder: 'Tất cả', options: PER.map(([value, label]) => ({ value, label })), onChange: (v) => { M.per = v || null; rerender(); } });
    return `<div class="pg" data-sx-tasks>
      ${head({ title: 'Việc của tôi', lg: true, info })}
      ${window.SxCv ? window.SxCv.remindBar() : ''}
      <div class="vcard pad24">
        <div class="pg-head"><h2 class="blk-t sm">Danh sách việc của tôi${cnt ? ` <span class="tag red">${cnt} chưa xử lý</span>` : ''}</h2><div class="r sxv-flt">
          <div class="vfield" style="width:180px"><div class="lr"><label>Chu kỳ</label></div>${perSel}</div>
          <label class="vsearch" style="width:320px">${window.UI.icon('search')}<input id="sxv-kw" maxlength="255" placeholder="Tìm kiếm theo tên dự án, công việc, nội dung..." value="${esc(M.kw)}"></label></div></div>
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${!M.kw && !M.per ? 'Bạn không có công việc nào.' : 'Không có dữ liệu.'}</td></tr>`}</tbody></table></div>
      </div></div>`;
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'sxv-kw') { M.kw = e.target.value.trim(); rerender(); } });

  /* ---------- SX-05 Xử lý việc: Chi tiết dự án + thanh trạng thái, nút theo cấu hình bước ---------- */
  function task(code, tokId, viewIdx) {
    const c = caseOf(code);
    const p = c && objRec(c), O = c && objOf(c);
    const none = (msg) => `<div class="pg">${head({ title: 'Xử lý công việc', back: 'sx/viec-cua-toi', lg: true })}${K().emptyCard('Thông tin chung', msg)}</div>`;
    if (!c || !p) return none('Không tìm thấy công việc.');
    if (viewIdx != null) {
      const h = c.hist[Number(viewIdx)];
      if (!h || h.step == null) return none('Không tìm thấy công việc.');
      const bar = window.Screens.statusBar({ mode: 'view', step: `Bước ${h.step} · ${stepOf(c.flow, h.step)[1]}`, date: dmy(h.at) });
      return O.detail(p.code, { title: O.viewTitle, back: 'sx/viec-cua-toi', bar, task: true });
    }
    const t = c.tokens.find((x) => x.id === tokId);
    if (!t) return none('Công việc đã được xử lý hoặc không còn tồn tại.');
    if (!mine(t, pid())) return none('Bạn không có quyền xử lý công việc này.');
    const st = stepOf(c.flow, t.step), o = st[3] || {};
    const acts = o.choices ? o.choices.map((ch, i) => `<button type="button" class="vbtn ${ch[2] === 'no' ? 'secondary' : 'primary'}" data-sx-do="${i}">${esc(ch[0])}</button>`).join('')
      : `<button type="button" class="vbtn primary" data-sx-do="-1">${esc(o.label || 'Hoàn thành')}</button>`;
    const bar = window.Screens.statusBar({ mode: 'process', step: `Bước ${st[0]} · ${st[1]}`, date: dmy(dueOf(c, t)), overdue: late(c, t), acts, who: t.who !== pid() ? pName(t.who) : '' });
    return `<div data-sx-task="${esc(c.code)}" data-sx-tok="${esc(t.id)}">${O.detail(p.code, { title: 'Xử lý công việc', back: 'sx/viec-cua-toi', bar, task: true, tok: t })}</div>`;
  }
  /* Biến ngữ cảnh của eForm: dự án (đối tượng cha) + biến hồ sơ; mốc chính gợi ý theo khung kế hoạch khi chưa nhập. */
  function ctxOf(c) {
    /* Đối tượng có ctx riêng (gói chuyển giao, phiếu bất thường); dự án dùng ngữ cảnh dưới. */
    if (objOf(c).ctx) return Object.assign(objOf(c).ctx(c.obj), c.vars);
    const p = P().byCode(c.obj), cat = (key, v) => { const r = window.Catalog.rows(key).find((x) => x.code === v); return r ? r.name : v; };
    const plan = P().planOf(p);
    const ms = plan.map((g) => ({ ten: `Hoàn thành giai đoạn ${g.name.toLowerCase()}`, han: dmy(isoOf(g.e)) }));
    /* Vật tư leadtime dài (≥ 20 tuần) hoặc cần Export License, theo MBOM đồng bộ VMMS — khối chỉ xem của form bước 1 (đầu vào QT bước 1). */
    const vtLt = ((D.sxMbom || {})[p.product] || []).filter((m) => m.lt >= 20 || m.el).map((m) => ({ ma: m.code, ten: m.name, lt: String(m.lt), el: m.el ? 'Có' : 'Không' }));
    return Object.assign({ duAn: { code: p.code, name: p.name, product: p.product, version: p.version, factoryText: p.factory ? cat('sx-don-vi', p.factory) : 'chưa chọn', qtyText: `${Number(p.qty).toLocaleString('vi-VN')} ${p.unitName}`, modelText: cat('sx-mo-hinh', p.model) },
      ckTaiLieu: window.SxCg ? window.SxCg.handoverDocs(p) : [], ckLan: (cases(p.code, 'SX-BGNM').filter((x) => x.status === 'done').length || 0) + 1,
      paVtLt: vtLt, leaders: D.personas.filter((x) => x.urd === 'R-SX-LD').map((x) => [x.id, `${x.name} — ${x.role}`]), koChuTri: 'sxld',
      subPms: p.khoi === 'K1' ? [['sxsub', pName('sxsub')]] : [[p.pm, pName(p.pm)]], khMoc: ms, khNhanSu: [{ hoTen: pName(p.pm), donVi: (D.personas.find((x) => x.id === p.pm) || {}).unit || '', vaiTro: 'Giám đốc dự án' }] }, c.vars);
  }
  /* Điền {{biến}} / {{a.b}} của tên tài liệu ký theo ngữ cảnh hồ sơ. */
  const fill = (tpl, v) => String(tpl).replace(/\{\{([\w.]+)\}\}/g, (_, k) => { const x = k.split('.').reduce((o, p) => (o == null ? o : o[p]), v); return x == null ? '' : String(x); }).trim();
  async function act(code, tokId, ci) {
    const c = caseOf(code), t = c.tokens.find((x) => x.id === tokId), st = stepOf(c.flow, t.step), o = st[3] || {}, ch = o.choices ? o.choices[ci] : null, f = formOf(c.flow, o.form);
    let values = {};
    /* Bộ chặn của bước (vd thiếu hồ sơ bắt buộc thì không gửi được) — không áp với nút từ chối. */
    const g = !(ch && ch[2] === 'no') && guardMsg(c, t);
    if (g) { toast(esc(g), 'warn'); return; }
    if (f) {
      const ctx = ctxOf(c);
      const pre = {};
      f.write.forEach((k) => { if (ctx[k] !== undefined) pre[k] = JSON.parse(JSON.stringify(ctx[k])); });
      /* Bản nháp của việc (Lưu nháp) mở lại đúng nội dung đã nhập. */
      Object.assign(pre, (c.drafts || {})[t.id] || {});
      const r = await window.EFormRun.open({ title: ch ? ch[0] : o.label || 'Hoàn thành', schema: Object.assign({ id: f.id }, f.schema(ctx, ch)), vars: ctx, values: pre });
      if (r && r.draft) { c.drafts = Object.assign({}, c.drafts, { [t.id]: r.values }); persist(); toast('<b>Thành công</b><br>Lưu nháp thành công!'); return; }
      if (!r || !r.submit) return;
      values = r.values;
    }
    /* T71 S12 (D-124): bước có cấu hình sign (tài liệu Lãnh đạo ký) — ký số MySign trước khi hoàn thành; nút từ chối / trả lại không ký. GIẢ LẬP P-258. */
    let sign = null;
    if (o.sign && !(ch && ch[2] === 'no')) {
      const doc = fill(o.sign, Object.assign(ctxOf(c), values));
      const r = await window.SxChung.mySign({ doc, reason: ch ? ch[0] : o.label || 'Hoàn thành' });
      if (!r) return;
      sign = Object.assign({ doc }, r);
    }
    complete(code, tokId, ch ? ci : -1, values, sign);
    toast('<b>Thành công</b><br>Xử lý công việc thành công!');
    location.hash = '#/sx/viec-cua-toi';
    rerender();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sx-do]');
    if (!b) return;
    const w = b.closest('[data-sx-task]');
    if (w) act(w.dataset.sxTask, w.dataset.sxTok, Number(b.dataset.sxDo));
  });

  /* Tiến trình hồ sơ dùng chung mọi luồng: thông tin hồ sơ (top), bảng bước (steps), lịch sử xử lý (hist). more = ô thêm ở thông tin hồ sơ. */
  function progress(c, more, split) {
    const k = K(), F = FL(c.flow), o = objRec(c);
    const stRow = (s) => {
      const tok = c.tokens.find((t) => String(t.step) === String(s[0])), h = c.hist.slice().reverse().find((x) => String(x.step) === String(s[0]) && !x.sys);
      const state = tok ? (late(c, tok) ? ['Quá hạn', 'error'] : ['Đang xử lý', 'info']) : h ? ['Đã xử lý', 'success'] : ['Chưa tới', 'default'];
      const who = s[2] === 'svc' ? null : tok ? tok.who : h ? h.who : D.sxAssign(s[2], o);
      const head3 = `<td>${k.clamp(`${s[0]}. ${s[1]}`)}</td><td>${s[2] === 'svc' ? 'Hệ thống' : k.clamp(pName(who))}</td><td class="c">${badge(...state)}</td>`;
      const result = h && !tok ? k.clamp(h.act) + (h.sign ? ' ' + window.SxChung.signedBadge(h.sign) : '') : k.dash;
      if (split) {
        /* Hạn xử lý (SLA) = hạn của bước; Hoàn thành thực tế = lúc xử lý xong (bước đã xong chỉ có thời điểm bắt đầu 'since' nên SLA = since + số ngày làm việc của bước). */
        const sla = tok ? dueOf(c, tok) : h && h.since ? addDays(h.since, (s[3] || {}).nlv || 2) : null, fin = h && !tok ? h.at : null;
        const over = fin && sla && String(fin).slice(0, 10) > String(sla).slice(0, 10);
        return `${head3}<td class="num${tok && late(c, tok) ? ' t-err' : ''}">${sla ? esc(dmy(sla)) : k.dash}</td><td class="num${over ? ' t-err' : ''}">${fin ? esc(dmy(fin)) : k.dash}</td><td>${result}</td>`;
      }
      return `${head3}
        <td class="num">${tok ? esc(dmy(dueOf(c, tok))) : h ? esc(dmy(h.at)) : k.dash}</td><td>${result}</td>`;
    };
    const top = `<div class="ginfo c3">${k.kv('Mã hồ sơ', esc(c.code))}${k.kv('Quy trình', esc(F.name))}${k.kv('Trạng thái', c.status === 'done' ? badge('Hoàn thành', 'success') : badge('Đang xử lý', 'info'))}
      ${k.kv('Ngày khởi tạo', esc(dmy(c.started)))}${k.kv('Ngày kết thúc', c.ended ? esc(dmy(c.ended)) : null)}${more || ''}
      ${(c.vars.kySo || []).length ? k.kv('Tài liệu đã ký số', c.vars.kySo.map((s) => `${esc(s.doc)} ${window.SxChung.signedBadge(s)}`).join('<br>'), 'span3') : ''}</div>`;
    const steps = k.table(split ? [['Tên bước', 400], ['Người xử lý', 200], ['Trạng thái', 130, 'c'], ['Hạn xử lý (SLA)', 150], ['Hoàn thành thực tế', 160], ['Kết quả', 180]]
      : [['Tên bước', 400], ['Người xử lý', 200], ['Trạng thái', 130, 'c'], ['Hạn / ngày xử lý', 150], ['Kết quả', 180]], F.steps, stRow);
    const hist = k.table([['Thời gian', 160], ['Người thực hiện', 200], ['Bước', 300], ['Hành động', 200], ['Nội dung', 360]], c.hist.slice().reverse(),
      (h) => `<td class="num">${esc(dmy(h.at))}</td><td>${h.who ? k.clamp(pName(h.who)) : 'Hệ thống'}</td><td>${h.step != null ? k.clamp(`${h.step}. ${stepOf(c.flow, h.step)[1]}`) : k.dash}</td>
        <td>${k.clamp(h.act)}</td><td>${h.sign ? k.clamp(`Ký số MySign: ${h.sign.doc}${h.note ? ' · ' + h.note : ''}`) : h.note ? k.clamp(h.note) : k.dash}</td>`);
    return { top, steps, hist };
  }
  /* ---------- Tab Phê duyệt kế hoạch của Chi tiết dự án (hồ sơ SX-KH: tiến trình, nội dung kế hoạch, lịch sử xử lý) ---------- */
  function planTab(p) {
    const k = K(), list = cases(p.code, 'SX-KH'), c = list[list.length - 1];
    if (!c) {
      return k.card('Hồ sơ phê duyệt kế hoạch', p.baseline ? '<p class="faint">Kế hoạch được phê duyệt trước khi đưa vào hệ thống — xem tab Lịch sử và Tài liệu.</p>'
        : '<p class="faint">Chưa khởi tạo hồ sơ phê duyệt kế hoạch.</p>');
    }
    const v = c.vars, pr = progress(c, k.kv('Kế hoạch số', v.khSo ? esc(v.khSo) : null)), top = pr.top, steps = pr.steps;
    const files = (keys) => keys.filter((x) => v[x]).map((x) => esc(v[x])).join('; ');
    /* Báo cáo phương án sản xuất (bước 1, không bắt buộc) và ý kiến chỉ đạo của Ban Giám đốc Khối (bước 2). */
    const phName = { TTMS: 'Trung tâm Mua sắm', NCPT: 'Đơn vị Nghiên cứu phát triển', DBCL: 'Đơn vị Đảm bảo chất lượng' };
    const pa = v.paLyDo ? `<div class="ginfo c3">${k.kv('Báo cáo phương án', 'Không lập')}${k.kv('Lý do', esc(v.paLyDo), 'span2')}</div>`
      : v.paTomTat ? `<div class="ginfo c3">${k.kv('Tóm tắt phương án', esc(v.paTomTat), 'span3')}${k.kv('Gói mua sắm dự kiến', v.paGoiMs ? esc(v.paGoiMs) : null, 'span2')}
          ${k.kv('Đơn vị đã phối hợp', (v.paPhoiHop || []).length ? esc(v.paPhoiHop.map((x) => phName[x] || x).join(', ')) : null)}
          ${k.kv('Báo cáo phương án sản xuất', v.paFile ? esc(v.paFile) : null, 'span2')}${k.kv('Hồ sơ quy trình công nghệ, đo kiểm', v.paQtcn ? esc(v.paQtcn) : null)}
          ${k.kv('Ý kiến chỉ đạo của Ban Giám đốc Khối', v.cdNoiDung ? esc(v.cdNoiDung) : null, 'span3')}</div>
        <h4 class="ginfo-sub">Điều kiện ràng buộc cần xin ý kiến</h4>${k.table([['Nội dung ràng buộc', 320], ['Ảnh hưởng tới mốc kế hoạch', 300], ['Đề xuất xin ý kiến', 300]], v.paRangBuoc || [],
          (m) => `<td>${k.clamp(m.noiDung || '')}</td><td>${m.anhHuong ? k.clamp(m.anhHuong) : k.dash}</td><td>${k.clamp(m.deXuat || '')}</td>`)}`
        : '<p class="faint">Báo cáo phương án sản xuất chưa được lập.</p>';
    const ko = v.koBienBan ? `<div class="ginfo c3">${k.kv('Ngày kick-off', esc(v.koNgay || ''))}${k.kv('Chủ trì', esc(pName(v.koChuTri)))}${k.kv('Sub PM', v.koSubPm ? esc(pName(v.koSubPm)) : null)}
        ${k.kv('Quyết định giao nhiệm vụ', esc(v.koQuyetDinh || ''), 'span2')}${k.kv('Biên bản kick-off', esc(v.koBienBan))}${k.kv('Ghi chú', v.koGhiChu ? esc(v.koGhiChu) : null, 'span3')}</div>` : '';
    const content = v.khMucTieu ? `<div class="ginfo c3">
        ${k.kv('Mục tiêu', esc(v.khMucTieu), 'span3')}${k.kv('Kết quả then chốt', [v.khKr1, v.khKr2, v.khKr3].filter(Boolean).map(esc).join('<br>'), 'span3')}
        ${k.kv('Yêu cầu', esc(v.khYeuCau || ''), 'span3')}${k.kv('Phương án tổ chức thực hiện', esc(v.khPhuongAn || ''), 'span3')}
        ${k.kv('Tổ chức thực hiện của các đơn vị', v.khToChuc ? esc(v.khToChuc) : null, 'span3')}${k.kv('Rủi ro, đề xuất', v.khRuiRo ? esc(v.khRuiRo) : null, 'span3')}
        ${k.kv('Phụ lục', files(['khPl1', 'khPl2', 'khPl3', 'khPl4', 'khPl5', 'khPl6']) || null, 'span3')}</div>
      <h4 class="ginfo-sub">Các mốc chính</h4>${k.table([['Mốc chính', 420], ['Thời gian hoàn thành', 180]], v.khMoc || [],
        (m) => `<td>${k.clamp(m.ten || '')}</td><td class="num">${esc(m.han || '')}</td>`)}
      <h4 class="ginfo-sub">Nhân sự chính thực hiện</h4>${k.table([['Họ và tên', 240], ['Đơn vị', 300], ['Vai trò', 200]], v.khNhanSu || [],
        (m) => `<td>${k.clamp(m.hoTen || '')}</td><td>${k.clamp(m.donVi || '')}</td><td>${k.clamp(m.vaiTro || '')}</td>`)}`
      : '<p class="faint">Kế hoạch sản xuất chưa được lập.</p>';
    const hist = pr.hist;
    return `<div data-sx-kh="${esc(c.code)}">${k.card('Hồ sơ phê duyệt kế hoạch', top + steps)}${k.card('Báo cáo phương án sản xuất', pa)}${k.card('Kế hoạch sản xuất (BM.QLHDSX.01)', content)}${ko ? k.card('Kick-off dự án', ko) : ''}${k.card('Lịch sử xử lý', hist)}</div>`;
  }
  /* Nút Khởi tạo phê duyệt kế hoạch ở Chi tiết dự án: PM của dự án, dự án Lập kế hoạch, chưa có hồ sơ đang chạy. */
  const canStartKh = (p) => p.status === 'PLANNING' && !p.baseline && !running(p.code, 'SX-KH') && (p.pm === pid() || isAdmin(pid()));
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sx-kh-start]');
    if (!b) return;
    const c = start('SX-KH', b.dataset.sxKhStart);
    toast('<b>Thành công</b><br>Khởi tạo hồ sơ phê duyệt kế hoạch thành công!');
    location.hash = `#/sx/viec/${encodeURIComponent(c.code)}/${c.tokens[0].id}`;
  });

  /* Mở việc từ Việc của tôi: chọn sẵn tab của luồng ở màn chi tiết đối tượng (FL.tab), sau đó người dùng đổi tab tự do. */
  function enterRoute(parts) {
    if (parts[0] !== 'viec') return;
    const c = caseOf(decodeURIComponent(parts[1] || ''));
    if (c && FL(c.flow).tab) K().setTab(objOf(c).tabKey(c.obj), FL(c.flow).tab);
  }
  function route(parts) {
    if (parts[0] === 'viec-cua-toi') return tasks();
    const code = decodeURIComponent(parts[1] || '');
    return parts[2] === 'xem' ? task(code, null, parts[3]) : task(code, parts[2]);
  }
  function reset() { S = seed(); persist(); }

  window.SxFlow = { route, enter: enterRoute, GUARD, progress, start, complete, cases, caseOf, running, pending, overdue, delayTxt, tokensFor, planTab, canStartKh, reset, ACT };
})();
