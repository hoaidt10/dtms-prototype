/*
 * Biến quy trình cho eForm của màn xử lý task (B0.4 (2)). Trên hệ thống thật, mỗi biến do một task / service task / BE ghi
 * (cột "Nguồn" của bảng phân loại docs/dtms/prototype-B04-phan-loai-task.md §4); prototype tính lại từ dữ liệu mẫu (D) và
 * trạng thái luồng (Flow) để demo chạy được. Dữ liệu người dùng nhập ở eForm lưu ở Flow.ui theo đúng key của form
 * (Camunda: biến cùng tên với key của trường).
 * Gồm: EVars.of(tok) — biến cho form của token; EVars.doc(code) — xem trước Văn bản đầu ra (mẫu Word + dữ liệu eForm);
 * EVars.check(tok, choice, values) — kiểm tra phía BE khi submit (G3, E3, KĐT bước 12); helper dùng chung (h).
 */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, persona, avatar, ty, pad2, cqcmUnit, badge } = window.UI;

  const U = () => Flow.ui;
  const R = () => D.caseRef;
  const kdt = () => !!Flow.state.kdt;
  const small = () => Flow.isSmall();
  const draftTask = () => (small() ? 11 : 12);
  const tt = () => (small() ? 'BM-09' : 'BM-01');
  const clName = () => (small() ? 'Checklist 02' : 'Checklist 01');
  const buyItems = () => D.items.filter((i) => i.buy > 0);
  const vv = (x) => (Array.isArray(x) ? x[Flow.doneCount(27) ? 1 : 0] : x);
  const vnd = (t) => Math.round(t * 1e9).toLocaleString('vi-VN');
  const selCqcm = () => D.cqcm.filter((c) => Flow.cqcmSel().includes(c.id));
  const catName = (key, code) => ((window.Catalog ? window.Catalog.rows(key) : []).find((r) => r.code === code) || {}).name || code || '';
  const proc = () => Flow.state.vars.process;
  const procOf = (k) => D.processes[k] || {};
  const fileCode = () => Flow.ci().code.replace('Đ', 'D');
  const condOf = (k) => Flow.condOf(k);
  const pname = (id) => persona(id).name;

  /* ---------- Căn cứ (task 01) ---------- */
  const basisList = (bt) => D.basisDocsFor(proc()).filter((d) => (!bt || d.type === bt) && (kdt() || D.basisFits(proc(), d)));
  function basisSel() {
    const u = U(), bt = u.basisType || R().basisType, list = basisList(null);
    const doc = list.find((d) => d.id === u.basisDoc) || (u.basisDoc ? null : list.find((d) => d.id === R().basisDoc) || list[0]) || null;
    return { bt, list, doc };
  }
  const basisDoc = () => basisSel().doc || D.basisDocsFor(proc()).find((d) => d.id === R().basisDoc);

  /* ---------- Bóc tách, tồn kho (task 05, 07) ---------- */
  const lineRemain = (i) => (i.bom == null ? null : i.bom - i.used);
  const propOf = (i) => { const r = (U().bocTach || []).find((x) => x.n === i.n); return r && r.prop != null ? r.prop : i.prop; };

  /* ---------- BM-04, giải trình (task 19–28) ---------- */
  const respOf = (c) => ((U().resp || {})[c]) || (D.responses[c] || {}).decision || 'Tiếp thu';
  function opinionsOf(c) {
    const edits = (U().bm04 || {})[c] || {}, base = D.opinions[c] || {};
    const accepted = Flow.state.vars.round > 0 && respOf(c) === 'Bảo lưu';
    return D.bm04Sections.filter((s) => base[s] || edits[s]).map((s) => {
      const o = Object.assign({ sec: s }, base[s] || {}, edits[s] || {});
      return accepted && !o.ok ? Object.assign({}, o, { ok: true, text: 'Chấp nhận giải trình của đơn vị.', guide: '' }) : o;
    });
  }
  const bm04Round = () => 1 + Flow.state.vars.round;
  const nok = () => selCqcm().flatMap((c) => opinionsOf(c.id).filter((o) => !o.ok).map((o) => Object.assign({ cqcm: c.id }, o)));
  const version = () => 1 + Flow.doneCount(27);

  /* ---------- Báo giá (task 10) — kết quả service task AI kiểm tra báo giá (quoteCheck, DX-03) ---------- */
  const nccName = (code) => { const n = D.nccOf(code); return n.short || n.name || code; };
  const nccDefault = () => D.quotes.map((q) => q.ncc);
  const itemGoods = () => [...new Set(D.items.map((i) => i.goods))];
  const goodsName = (code) => (window.Catalog.rows('loai-hang-hoa').find((r) => r.code === code) || {}).name || code;
  const quoteAttempt = () => Math.max(1, Flow.doneCount(9));
  const quoteFail = () => R().quoteFailFirst && quoteAttempt() === 1 && !Flow.state.replaces && !Flow.state.history.some((h) => h.task === 10 && h.action === 'Báo giá đạt');

  /* ---------- Ký (VOffice) ---------- */
  function signOf(task) {
    const h = Flow.state.history;
    let from = 0;
    h.forEach((x, i) => { if ((x.task === 11 || x.task === 27) && x.who) from = i + 1; });
    const done = h.slice(from).filter((x) => String(x.task) === String(task) && x.who).pop();
    if (done) return { st: /^Không|^Yêu cầu|^Chỉ đạo/.test(done.action) ? 'Không đồng ý' : 'Đã ký', at: Flow.dateOf(done.t) };
    return { st: Flow.state.tokens.some((t) => String(t.task) === String(task)) ? 'Chưa ký' : 'Chưa trình ký', at: null };
  }
  const bm09Signs = () => ({ ttms: signOf(38), ptgd: signOf(39), tgd: signOf(60) });
  const signRowV = (who, role, st, at) => ({ nguoiKy: pname(who), tuCach: role, trangThai: st, thoiDiem: at || '-' });
  function signTask(task, who) {
    const done = Flow.state.history.find((h) => String(h.task) === String(task) && h.who === who && !h.system);
    const open = Flow.state.tokens.some((t) => String(t.task) === String(task) && t.who === who);
    return done ? (/^Không/.test(done.action) ? 'Không đồng ý' : 'Đã ký') : open ? 'Chưa ký' : 'Không ký';
  }

  /* Hồ sơ vừa bị trả về task 25 → 26 từ bước ký / phê duyệt. */
  function returnedFrom() {
    const h = Flow.state.history, i = h.map((x) => x.task).lastIndexOf(25);
    for (let k = i - 1; k >= 0; k--) {
      if (h[k].system) { if (h[k].task === 24 || h[k].task === 23) return null; continue; }
      return h[k].reason ? h[k] : null;
    }
    return null;
  }

  /* ---------- KĐT: giai đoạn thẩm định, ý kiến theo lượt ---------- */
  const kd = () => Flow.findKdt(Flow.state.kdt) || {};
  const tdKey = () => Flow.state.vars.td || 'GOP';
  const kdtVer = () => 1 + Flow.state.history.filter((h) => h.who && (h.td || 'GOP') === tdKey()
    && (['23', '33', '53'].includes(String(h.task)) || (String(h.task) === '28' && /^Bổ sung/.test(h.action)))).length;
  const STAGES = {
    GOP: { title: 'Hồ sơ gộp chủ trương và KĐT', doc: 'Văn bản gộp BM-00', cl: null, cq: 'BM-09',
      crit: ['Pháp lý', 'Mục tiêu', 'Nhu cầu, sự cần thiết', 'Quy mô, danh mục', 'Tổng mức vốn', 'Đủ 03 điều kiện hồ sơ gộp'] },
    CT: { title: 'Hồ sơ chủ trương KĐT', doc: 'Tờ trình BM-01', cl: 'Checklist 01', cq: 'BM-09',
      crit: ['Pháp lý', 'Mục tiêu', 'Nhu cầu, sự cần thiết', 'Phạm vi, quy mô', 'Tổng mức vốn', 'Phù hợp giai đoạn chủ trương'] },
    KDT: { title: 'Hồ sơ phê duyệt KĐT', doc: 'Tờ trình BM-03', cl: 'Checklist 02', cq: 'BM-10',
      crit: ['Pháp lý, phù hợp chủ trương đã phê duyệt', 'Mục tiêu, sự cần thiết', 'Quy mô đầu tư', 'Tổng mức vốn', 'Nguồn vốn, thời gian thực hiện', 'Hiệu quả, lợi ích'] },
  };
  const stg = () => STAGES[tdKey()] || STAGES.CT;
  const hostOf = () => (U().host !== undefined ? U().host : R().host);
  const needHost = () => kd().type === 'KHCN';
  const kNeed = () => !!U().kNeed || Flow.doneCount(39) > 0;
  const HOSTS = ['Trung tâm Mua sắm', 'Trung tâm Vô tuyến', 'Viện Nghiên cứu phát triển Vô tuyến'];
  const CQ_FN = { PC: 'Pháp lý, thẩm quyền, Quy chế LCNT', TC: 'Tài chính, nguồn vốn, phân loại TSCĐ / CCDC', CL: 'Chất lượng, chỉ tiêu kỹ thuật' };
  const counters = () => `Vòng check ${Flow.tdCount('chk')}/2 · Họp ${Flow.tdCount('meet')}/2`;
  const aiText = (key) => (D.aiBasic.find((a) => a.key === key) || {}).value || '';
  const rvIdx = (open24) => Math.max(0, Flow.tdRound() - (open24 ? 0 : 1));
  const rvOf = (i, id) => D.kdtReview(tdKey(), i)[id] || {};
  const fixOf = (i, id) => D.kdtFix(tdKey(), i, id, U());
  const fixItems = (i) => ['TTMS'].concat(Flow.cqcmSel()).filter((id) => fixOf(i, id))
    .flatMap((id) => (rvOf(i, id).items || [['Nội dung', 'Cần bổ sung, làm rõ.', '']]).map((x) => ({ id, sec: x[0], text: x[1], guide: x[2] || '' })));
  const unitOf = (id) => (id === 'TTMS' ? 'TTMS (CQCM chủ trì)' : cqcmUnit(id));
  const b3 = () => R().bm03 || {};
  const ctSigned = () => signOf(44);

  /* Gợi ý AI theo mục (G2): một dòng / mục — Gợi ý, Nguồn chỉ đọc; Quyết định Chấp nhận / Sửa / Bỏ; Nội dung sửa.
     Dòng đã có quyết định (Flow.ui[path]) được giữ. def = quyết định mặc định ('Chấp nhận' hoặc null = chưa chọn). */
  function aiRows(path, list, def) {
    const saved = U()[path] || [];
    return list.map((x) => Object.assign({ key: x.key, muc: x.muc, goiY: x.goiY, nguon: x.nguon, quyetDinh: def, noiDungSua: '' },
      saved.find((s) => s.key === x.key) || {}, { goiY: x.goiY, nguon: x.nguon, muc: x.muc }));
  }
  /* Giá trị cuối của một dòng gợi ý AI (BE tính khi Xác nhận): Chấp nhận → gợi ý; Sửa → nội dung sửa; Bỏ / chưa chọn → rỗng. */
  const aiFinal = (r) => (!r ? '' : r.quyetDinh === 'Chấp nhận' ? r.goiY : r.quyetDinh === 'Sửa' ? r.noiDungSua || '' : '');
  const aiOf = (path, key) => aiFinal((U()[path] || []).find((r) => r.key === key));

  /* Task 13 — các phần chỉ huy duyệt (comment #6–8). */
  const PARTS = () => ['1. Sự cần thiết', '2–3. Mục đích, phạm vi, quy mô', '4. Tổng kinh phí, phụ lục chi phí', '5–6. Phương pháp tính, phương án kỹ thuật',
    '7–8. Nguồn vốn, sử dụng hàng tồn kho', '9–10. Biện pháp, kế hoạch thực hiện', 'BM-02 Thuyết minh', clName()];
  /* Nguồn đối soát ở task 08 (comment #4): theo nhiệm vụ / đề tài của ĐXMS, mặc định theo loại căn cứ. */
  const SRC = { mbom: 'MBOM + dự toán nhiệm vụ KHCN', dutoan: 'Dự toán dự án SXKD (PAKD)', khn: 'Kế hoạch mua sắm thường xuyên năm (KHN)' };
  function srcKey() {
    const x = Flow.findDxms && Flow.ci().dxms ? Flow.findDxms(Flow.ci().dxms) : null, nv = x && D.nvOf ? D.nvOf(x.nv) : null;
    if (nv) return nv.src;
    const bt = (basisDoc() || {}).type;
    return bt === 'khcn' ? 'mbom' : bt === 'pakd' ? 'dutoan' : 'khn';
  }

  /* Lý do của lượt xử lý gần nhất ở `task` (dùng cho banner "trả lại"). */
  const back = (task) => { const h = Flow.lastOf(task); return h && h.reason ? h : null; };
  const lastIdx = (k) => Flow.state.history.map((x) => String(x.task)).lastIndexOf(String(k));

  /* Checklist 01/02 của ĐXMS (§5.6): tình trạng tự điền từ tài liệu đã có trên hồ sơ. */
  const checklistRows = () => D.checklist.map((c) => {
    const ok = c.by == null ? null : Flow.taskStatus(c.by) !== 'todo' || c.by === draftTask();
    return { nhom: c.g, muc: c.name, so: c.no, yeuCau: c.req, tinhTrang: ok == null ? 'Không có' : ok ? 'Đủ' : 'Thiếu' };
  });
  /* Checklist số 01 / 02 của KĐT (BM-8.6.5): không xoá dòng khi thiếu tài liệu — cột Ghi chú. */
  function kdtChecklist(no) {
    const b = basisDoc(), x = b3();
    const cqDone = Flow.state.history.some((h) => String(h.task) === '26' && h.who && (no === 2 ? h.td === 'KDT' : true));
    const rows = no === 1 ? [
      ['I', 'VĂN BẢN TRÌNH KÝ'],
      ['1', 'Tờ trình chủ trương KĐT (ký trực tiếp) (BM-01) và các Phụ lục', 'Bắt buộc', `Dự thảo v${kdtVer()}`, true],
      ['2', 'Phiếu trình giải quyết công việc (BM-06)', 'Tùy chọn', '', null, 'Không sử dụng'],
      ['3', 'Checklist số 01', 'Bắt buộc', 'Bản này', true],
      ['II', 'VĂN BẢN ĐÍNH KÈM'],
      ['1.1', 'Căn cứ pháp lý: Kế hoạch SXKD / PAKD / đề tài hàng năm', 'Bắt buộc', b ? b.no : '', true],
      ['1.2', 'Hợp đồng, thỏa thuận hợp tác, biên bản ghi nhớ với khách hàng', 'Nếu có', '', null, 'Không áp dụng — căn cứ là đề tài KHCN'],
      ['1.3', 'Văn bản kết luận, chính sách, chủ trương, chỉ đạo khác', 'Nếu có', '', null, 'Không có'],
      ['2.1', 'Công văn đề nghị phối hợp thẩm định chủ trương KĐT (BM-07)', 'Nếu có', '', null, 'CQCM gửi ý kiến trực tiếp, không phát hành công văn riêng'],
      ['2.2', 'Văn bản thẩm định chủ trương KĐT của CQCM (BM-09)', 'Nếu có', '', cqDone || null, cqDone ? '' : 'Bổ sung sau khi CQCM thẩm định'],
      ['3.1', 'Sở cứ giá (hợp đồng tương tự, báo giá, dự toán chi tiết…)', 'Bắt buộc', `${D.quotes.length} báo giá`, true],
      ['3.2', 'Hồ sơ, báo cáo khảo sát, thiết kế', 'Tùy chọn', R().ebom, true],
      ['3.3', 'Kế hoạch, chủ trương, định hướng của Nhà nước và Tập đoàn', 'Tùy chọn', '', null, 'Không có']] : [
      ['I', 'HỒ SƠ KĐT'],
      ['1', 'Tờ trình thẩm định, phê duyệt KĐT (BM-03) và các Phụ lục', 'Bắt buộc', `Dự thảo v${kdtVer()}`, true],
      ['2', 'Phiếu trình giải quyết công việc (BM-06)', 'Tùy chọn', '', null, 'Không sử dụng'],
      ['3', 'Checklist số 02', 'Bắt buộc', 'Bản này', true],
      ['II', 'TÀI LIỆU ĐÍNH KÈM'],
      ['1.1', 'Căn cứ pháp lý: Kế hoạch SXKD / PAKD / đề tài hàng năm', 'Bắt buộc', b ? b.no : '', true],
      ['1.2', 'Hợp đồng, thỏa thuận hợp tác, biên bản ghi nhớ với khách hàng', 'Nếu có', '', null, 'Không áp dụng'],
      ['1.3', 'Văn bản kết luận, chính sách, chủ trương, chỉ đạo khác', 'Nếu có', x.ctNo ? `${x.ctNo} (BM-01 đã phê duyệt)` : '', !!x.ctNo],
      ['2.1', 'Công văn đề nghị phối hợp thẩm định KĐT (BM-08)', 'Nếu có', '', null, 'CQCM gửi ý kiến trực tiếp, không phát hành công văn riêng'],
      ['2.2', 'Văn bản thẩm định KĐT của CQCM (BM-10)', 'Nếu có', '', cqDone || null, cqDone ? '' : 'Bổ sung sau khi CQCM thẩm định'],
      ['3.1', 'Sở cứ giá (hợp đồng tương tự, báo giá, dự toán chi tiết…)', 'Bắt buộc', `${D.quotes.length} báo giá`, true],
      ['3.2', 'Tài liệu khác về hồ sơ, báo cáo khảo sát, thiết kế', 'Tùy chọn', R().ebom, true],
      ['3.3', 'Kế hoạch, chủ trương, định hướng của Nhà nước và Tập đoàn', 'Tùy chọn', '', null, 'Không có']];
    const saved = U()['checklist0' + no] || [];
    return rows.map((r) => (r.length === 2 ? { tt: r[0], muc: r[1], header: true, so: '', yeuCau: '', tinhTrang: '', ghiChu: '' }
      : { tt: r[0], muc: r[1], yeuCau: r[2], so: r[3], tinhTrang: r[4] ? 'Đủ' : 'Không có', ghiChu: ((saved.find((s) => s.tt === r[0] && s.muc === r[1]) || {}).ghiChu) ?? (r[5] || '') }));
  }

  /* Tổng hợp chung của hồ sơ — Thông tin chung của khung đã hiện; biến này để form và mẫu văn bản dùng. */
  function hoSo() {
    const ci = Flow.ci();
    return { ma: ci.code, ten: ci.title, donVi: ci.unit, nguonVon: ci.fund, thoiGian: ci.period, tong: ty(D.caseInfo.total), quyTrinh: proc() || '', dieuKien: proc() ? condOf(proc()) : '' };
  }

  /* ---------- Biến cho form của token ---------- */
  function of(tok) {
    const u = U(), n = tok.task, ci = Flow.ci();
    const v = { hoSo: hoSo(), phienBan: kdt() ? kdtVer() : version(), tt: tt(), clName: clName(), lan: pad2(bm04Round()) };

    /* 01 */
    const bs = basisSel();
    v.basisType = u.basisType || R().basisType;
    v.basisDoc = u.basisDoc || (bs.doc && bs.doc.id) || null;
    v.basisDocOptions = bs.list.map((d) => ({ value: d.id, label: `${d.no} — ${d.title}`, type: d.type }));
    v.basisDocs = bs.list.map((d) => ({ typeId: d.type, so: d.no, ngay: d.date, loai: ((kdt() ? D.kdtBasisTypes : D.basisTypes).find((b) => b.id === d.type) || {}).name || d.type,
      trichYeu: d.title, giaTri: d.value ? ty(d.value) : '-', conLai: d.value ? ty(d.remain) : '-', tdDuyet: d.group ? 'Đã duyệt' : 'Chưa duyệt' }));

    /* 04 */
    v.aiEstimateOff = !kdt() && !Flow.inRange(proc(), D.aiEstimate);
    v.aiEstimate = ty(D.aiEstimate, 0);
    v.tenDeXuat = u.tenDeXuat || ci.title;
    v.purposeCode = u.purposeCode || R().purposeCode;
    v.secret = u.secret != null ? u.secret : false;
    v.priority = u.priority || D.caseInfo.priority;
    v.fund = u.fund !== undefined ? u.fund : (D.aiBasic.find((a) => a.key === 'fund') || {}).code || null;
    v.fundOptions = window.Catalog.rows('nguon-von').filter((r) => r.active || r.code === v.fund).map((r) => ({ value: r.code, label: r.name }));
    v.aiGoiY = aiRows('aiGoiY', D.aiBasic.map((a) => ({ key: a.key, muc: a.label, goiY: a.value, nguon: `${a.from} (căn cứ ${basisDoc() ? basisDoc().no : ''})` })), 'Chấp nhận');
    if (kdt()) { const k = kd(); v.kdtInfo = { linhVuc: catName('linh-vuc', k.field), loai: catName('loai-kdt', k.type), tinhChat: catName('tinh-chat-tai-san', k.nature) }; }

    /* 05 */
    v.basisTreeText = D.tree.map((x) => (x.children ? `- **${x.name}**: ${x.children.map((c) => `${c.name} (${c.lines.length} dòng)`).join('; ')}` : `- **${x.name}** (${x.lines.length} dòng)`)).join('\n');
    v.bocTachNguon = R().src;
    v.bocTach = D.items.map((i) => ({ n: i.n, name: i.name, uom: i.uom, bom: i.bom == null ? '-' : i.bom, used: i.used == null ? '-' : i.used,
      usedIn: D.usedIn[i.n] || '', remain: lineRemain(i), remainText: lineRemain(i) == null ? '-' : lineRemain(i), prop: propOf(i), nhom: i.group ? 'Nhóm ' + i.group : '-', warn: i.warn || '' }));

    /* 07 — kết quả tích hợp hệ thống kho (task 06, service task) */
    v.stock = { trangThai: 'Đã có kết quả', ma: R().rstk, gui: Flow.dateOf(Math.max(0, Flow.state.clock - 1)) };
    const fs = u.ruaSoatKho || [];
    v.ruaSoatKho = D.items.map((i) => {
      const avail = i.stock == null ? null : i.stock, max = Math.min(avail || 0, propOf(i)), sv = fs.find((x) => x.n === i.n);
      return { n: i.n, name: i.name, prop: propOf(i), book: i.book != null ? i.book : avail == null ? '-' : avail, held: i.held ? `${i.held} (${i.heldFor})` : avail == null ? '-' : 0,
        avail: avail == null ? '-' : avail, coKho: !!avail, max, fromStock: sv && sv.fromStock != null ? sv.fromStock : avail ? max : 0 };
    });

    /* 08 — NCC lọc theo ngành hàng (BE / danh mục Nhà cung cấp): dừng hoạt động không vào danh sách, bị cấm không vào options */
    const want = itemGoods();
    const list = window.Catalog.rows('nha-cung-cap').filter((r) => r.active && (r.goods || []).some((x) => want.includes(x)));
    const banned = (r) => !!(r.ban && r.ban.until);
    const grp = (g) => buyItems().filter((i) => i.group === g).map((i) => ({ n: i.n, hang: i.name, sl: `${i.buy} ${i.uom}`, nganh: goodsName(i.goods) }));
    v.ycbgNhom1 = grp(1); v.ycbgNhom2 = grp(2); v.group2Note = R().group2Note || '';
    v.nccOptions = list.filter((r) => !banned(r)).map((r) => ({ value: r.code, label: `${r.code} — ${r.name}` }));
    v.nccList = list.map((r) => ({ ma: r.code, ten: r.name, email: r.email, nganh: r.goods.filter((x) => want.includes(x)).map(goodsName).join(', '),
      tinhTrang: !r.ban ? 'Bình thường' : r.ban.until ? 'Cấm đến ' + r.ban.until : 'Hạn chế' }));
    v.nccSel = u.nccSel || nccDefault().filter((c) => v.nccOptions.some((o) => o.value === c));
    v.hanTraLoi = u.hanTraLoi || Flow.dateOf(Flow.state.clock + 3);
    v.nganhOptions = window.Catalog.rows('loai-hang-hoa').filter((r) => r.active !== false).map((r) => ({ value: r.code, label: r.name }));
    v.nccMoi = u.nccMoi || [];
    /* Comment #4 — kết quả service task đối soát (biến doiSoat). */
    const sk = srcKey(), doc0 = basisDoc() || {};
    v.doiSoatNguon = `${SRC[sk]}${doc0.no ? ' · căn cứ ' + doc0.no : ''}`;
    const estTotal = D.items.reduce((a, i) => a + (i.amount || 0), 0);
    v.doiSoat = D.items.map((i) => {
      const rm = lineRemain(i), p = propOf(i);
      return { hang: `${i.n}. ${i.name}`, de: `${p} ${i.uom}`, nguon: rm == null ? '-' : `${rm} ${i.uom} (còn lại)`,
        ketQua: rm == null ? 'Không có trong nguồn' : p <= rm ? 'Khớp' : 'Không khớp', ghiChu: rm == null ? 'Ngoài ' + (sk === 'khn' ? 'KHN' : 'MBOM / dự toán') + ' — chỉ cảnh báo' : '' };
    }).concat(doc0.remain != null ? [{ hang: 'Tổng giá trị dự kiến (gồm VAT)', de: ty(estTotal) + ' tỷ', nguon: ty(doc0.remain) + ' tỷ (dự toán còn lại)',
      ketQua: estTotal <= doc0.remain ? 'Khớp' : 'Không khớp', ghiChu: '' }] : []);

    /* 10 — báo giá (bảng dọc), AI kiểm tra báo giá (quoteCheck), kiểm tra khớp quy trình (matchCheck) */
    const fail = quoteFail();
    v.lanGuiYcbg = quoteAttempt();
    v.baoGia = D.quotes.flatMap((q) => buyItems().map((i) => {
      const p = q.prices[i.n], min = Math.min(...D.quotes.map((x) => x.prices[i.n])), expired = fail && q.ncc === 'NCC-000003';
      return { ncc: nccName(q.ncc), ngay: q.date, tienTe: D.nccOf(q.ncc).currency || 'VNĐ', dong: `Dòng ${i.n}`, donGia: ty(p),
        hieuLuc: expired ? q.valid + ' (hết hiệu lực)' : (q.validRetry && !fail ? q.validRetry : q.valid), thapNhat: p === min ? 'Thấp nhất' : '' };
    }));
    v.quoteCheck = fail
      ? { ketQua: 'Không đạt', chiTiet: `- ${nccName('NCC-000003')}: báo giá hết hiệu lực từ 20/09/2026, dùng cho dòng 3 (buồng đo OTA).\n- Cần ít nhất 3 báo giá còn hiệu lực cho mỗi dòng.` }
      : { ketQua: 'Đạt', chiTiet: `- ${D.quotes.length}/${D.quotes.length} báo giá còn hiệu lực, đủ ${buyItems().length} dòng.\n- Đơn giá thấp nhất mỗi dòng dùng làm cơ sở giá.` };
    const mc = Flow.matchCheck();
    v.matchCheck = { tong: ty(mc.total), ketQua: mc.ok ? 'Khớp' : 'Không khớp', quyTrinh: mc.process, dieuKien: condOf(mc.process), goiY: mc.suggest,
      nhanh: mc.ok ? (mc.process === 'MS01.03' ? 'dự thảo Tờ trình BM-09' : 'dự thảo Tờ trình BM-01') : 'ĐVĐX xử lý hồ sơ không khớp' };
    v.tongMucVon = ty(D.caseInfo.total);

    /* 10a */
    v.checks = Flow.state.vars.checks.map((c, i) => ({ lan: i + 1, ngay: Flow.dateOf(c.t), giaTri: ty(c.total), quyTrinh: c.process || c.group || '', ketQua: c.ok ? 'Khớp' : 'Không khớp' }));
    v.hoSoMoi = D.caseCodes[1];
    v.saoChep = ['Căn cứ và phạm vi', 'Thông tin cơ bản', 'Danh mục hàng hoá sau trừ lùi', `Kết quả rà soát tồn kho ${R().rstk}`, 'Yêu cầu báo giá và 3 báo giá'].map((x) => '- ' + x).join('\n');

    /* 11 / 12 — tờ trình: nội dung từng mục (L1), "Sự cần thiết" theo gợi ý AI (G2), kết quả AI kiểm tra (DX-01) */
    const d = R().doc || {};
    v.mucDich = u.mucDich != null ? u.mucDich : D.aiBasic[0].value;
    v.phamVi = u.phamVi != null ? u.phamVi : D.aiBasic[1].value;
    v.phuongPhap = u.phuongPhap != null ? u.phuongPhap : `Đơn giá thấp nhất trong 3 báo giá hợp lệ (${D.quotes.map((q) => nccName(q.ncc)).join(', ')}).`;
    v.phuongAn = u.phuongAn != null ? u.phuongAn : d.tech || '';
    v.nguonVonTt = u.nguonVonTt != null ? u.nguonVonTt : (d.fund ? vv(d.fund) : D.caseInfo.fund);
    v.bienPhap = u.bienPhap != null ? u.bienPhap : vv(d.measures) || '';
    v.keHoach = u.keHoach != null ? u.keHoach : (typeof d.plan === 'string' ? d.plan : '');
    v.tongKinhPhi = vv(d.total) || '';
    v.cauTonKho = d.stock || '';
    v.aiSuCanThiet = aiRows('aiSuCanThiet', [{ key: 'suCanThiet', muc: 'Sự cần thiết', goiY: d.necessity || '', nguon: `Căn cứ ${(basisDoc() || {}).no || ''}, thông tin cơ bản của hồ sơ` }], null);
    v.aiCheck = u.aiCheck || null;
    v.phuLucChiPhi = D.items.map((i) => ({ n: i.n, hang: i.name, sl: i.buy, donGia: ty(i.price), thanhTien: ty(i.amount), coSo: i.buy ? `Báo giá ${nccName('NCC-000001')}` : 'Dùng tồn kho', loai: i.cost || '' }));
    v.checklist = checklistRows();
    const rej = Flow.lastOf(13);
    v.traLai13 = rej && rej.action === 'Không đồng ý' && Flow.doneCount(draftTask()) === Flow.doneCount(13) ? { lyDo: rej.reason || '', loc: 'Mục “Kế hoạch tổ chức thực hiện” chưa có mốc giao hàng từng lô.' } : null;
    /* Comment #10 — phản hồi từng phần chỉ huy chấm Không đạt (lượt trả lại gần nhất). */
    const nokParts = (u.duyetPhan || []).filter((r) => r.ketQua === 'Không đạt');
    v.phanHoiChiHuy = !v.traLai13 ? [] : (nokParts.length ? nokParts.map((r) => ({ phan: r.phan, chiDao: r.lyDo })) : [{ phan: 'Chung', chiDao: rej.reason || '' }])
      .map((r) => Object.assign(r, { xuLy: 'Đã sửa', giaiTrinh: '' }));

    /* 13 */
    v.tomTat = `**Tên:** ${ci.title}\n**Căn cứ:** ${(basisDoc() || {}).no || ''} · **Giá trị:** ${ty(D.caseInfo.total)} tỷ (${buyItems().length} hạng mục)\n**Nguồn vốn:** ${D.caseInfo.fund} · **Thời gian:** ${D.caseInfo.period} · **Quy trình:** ${proc()}${small() ? ` (${tt()} + ${clName()})` : ''} — khớp giá trị`;
    v.coCauChiPhi = buyItems().map((i) => ({ n: i.n, hang: i.name, thanhTien: ty(i.amount), tyTrong: ty((i.amount / D.caseInfo.total) * 100, 1) + '%' }));
    /* Comment #9 — lịch sử chỉnh sửa theo phần (BE ghi mỗi lần gửi lại sau khi chỉ huy trả lại). */
    const ph = Flow.doneCount(draftTask()) > 1 ? (u.phanHoiChiHuy || []) : [], sent = Flow.lastOf(draftTask());
    v.lichSuSua = ph.map((r) => ({ phienBan: `Lần gửi ${Flow.doneCount(draftTask())}`, phan: r.phan,
      noiDung: r.xuLy === 'Không sửa' ? `Không sửa — giải trình: ${r.giaiTrinh}` : `Đã sửa theo chỉ đạo: ${r.chiDao}`, nguoi: pname('minh'), thoiDiem: sent ? Flow.dateOf(sent.t) : '-' }));
    const nSua = ph.filter((r) => r.xuLy !== 'Không sửa').length;
    v.aiTomTatSua = `${nSua} phần đã sửa theo chỉ đạo, ${ph.length - nSua} phần giữ nguyên có giải trình. Đối chiếu nội dung trước / sau ở tab Lịch sử phiên bản.`;
    v.duyetPhan = PARTS().map((p) => {
      const g = ph.find((r) => r.phan === p);
      return { phan: p, ketQua: 'Đạt', lyDo: '', giaiTrinh: g ? (g.xuLy === 'Không sửa' ? 'Người soạn giải trình: ' + g.giaiTrinh : 'Người soạn: đã sửa theo chỉ đạo') : '' };
    });

    /* 16 */
    const cs = Flow.cqcmSel();
    v.cqcmSel = u.cqcmSel || (small() ? [...new Set(cs.concat(['TC']))] : cs);
    v.cqcmValues = D.cqcm.map((c) => ({ value: c.id, label: `${c.unit} — ${pname(c.doer)}` }));
    v.hanGopY = u.hanGopY || Flow.dateOf(Flow.state.clock + 5);
    v.dauMoi = u.dauMoi || 'minh';
    v.nguoiDungOptions = D.personas.map((p) => ({ value: p.id, label: `${p.name} — ${p.role}` }));
    const b17 = Flow.lastOf(17);
    v.traLai17 = b17 && /^Chưa/.test(b17.action) && Flow.doneCount(16) === Flow.doneCount(17) ? { lyDo: b17.reason || '' } : null;

    /* 17 */
    const fn = { PC: 'Pháp lý, hợp đồng, quy chế LCNT', TC: 'Tài chính kế toán, nguồn vốn, cơ cấu chi phí', CL: 'Chất lượng, chỉ tiêu kỹ thuật thiết bị đo' };
    v.cqcmChon = selCqcm().map((c) => ({ cqcm: c.unit, chucNang: fn[c.id] || '', nguoiXuLy: pname(c.doer) }));
    const need = [['TC', small() ? 'Hồ sơ dưới 160 tỷ → CQCM Tài chính bắt buộc (QT B8.2)' : 'Hồ sơ có hạng mục dịch vụ và nguồn vốn → cần CQCM Tài chính'],
      ['CL', 'Có hàng hoá cần chỉ tiêu kỹ thuật → cần CQCM Chất lượng']].concat(small() ? [] : [['PC', 'Áp dụng Quy chế LCNT → cần Ban Pháp chế']]);
    v.aiCqcm = { ketQua: need.every(([id]) => cs.includes(id)) ? 'Đủ thành phần' : 'Thiếu thành phần', chiTiet: need.map(([id, t]) => `- ${t}: **${cs.includes(id) ? 'có' : 'chưa có'}**`).join('\n') };
    v.bm03 = { han: Flow.dateOf(Flow.state.clock + 5), tep: `BM-03_${fileCode()}_ky-nhay.pdf` };

    /* 19 / 20 — phiếu BM-04 của CQCM (biến cục bộ của từng instance multi-instance) */
    if (tok.cqcm) {
      const c = tok.cqcm, rows = opinionsOf(c);
      v.cqcmTen = cqcmUnit(c);
      v.bm04Phieu = D.bm04Sections.map((s) => {
        const r = rows.find((x) => x.sec === s) || { sec: s, ok: true };
        return { muc: s, danhGia: r.ok ? 'OK' : 'Không OK', nhanXet: r.text || '', huongDan: r.guide || '',
          aiGoiY: r.ok ? '' : 'Đối chiếu QT 10.2.1 mục 5.3 — nhận xét phù hợp; đề nghị nêu rõ tài liệu cần bổ sung.', quyetDinhAi: r.ok ? null : 'Chấp nhận' };
      });
      v.bm04KetQua = v.bm04Phieu.map((r) => ({ muc: r.muc, danhGia: r.danhGia, nhanXet: r.nhanXet || '-', huongDan: r.huongDan || '-' }));
      const firstNok = Object.entries(D.opinions[c] || {}).filter(([, o]) => !o.ok);
      v.yKienLan01 = firstNok.map(([sec, o]) => ({ muc: sec, yKien: o.text, trangThai: respOf(c) === 'Bảo lưu' ? 'Đã giải trình, CQCM chấp nhận' : 'Đã tiếp thu, sửa ở v' + version() }));
    }

    /* 26 */
    const rb = returnedFrom();
    v.traLaiKy = rb ? { buoc: Flow.taskName(rb.task), nguoi: pname(rb.who), lyDo: rb.reason } : null;
    const signedBy = Flow.state.history.filter((h) => h.task === 20 && /^Đồng ý/.test(h.action)).map((h) => h.cqcm);
    v.bm04TrangThai = selCqcm().map((c) => ({ cqcm: c.unit, nguoi: `${persona(c.doer).short} / ${persona(c.signer).short}`, lan: pad2(bm04Round()), ky: signedBy.includes(c.id) ? 'Đã ký' : 'Chưa ký',
      khongOk: opinionsOf(c.id).filter((o) => !o.ok).length }));
    v.quyetDinhYKien = nok().map((o) => ({ cqcm: o.cqcm, cqcmTen: cqcmUnit(o.cqcm), muc: o.sec, yKien: o.text, quyetDinh: respOf(o.cqcm) }));
    v.vongGiaiTrinh = Flow.state.vars.round;
    /* Comment #13, #15 — AI đồng bộ ý kiến các CQCM theo mục BM-01 (service task 25). */
    const bySec = {};
    nok().forEach((o) => { (bySec[o.sec] = bySec[o.sec] || []).push(o); });
    v.aiDongBo = Object.entries(bySec).map(([sec, l]) => `- **${sec}** (${l.map((o) => cqcmUnit(o.cqcm)).join(', ')}): ${l.map((o) => o.guide || o.text).join(' ')}${l.length > 1 ? ' — các cơ quan cùng yêu cầu, sửa một lần cho cả hai.' : ''}`).join('\n')
      || '- Không có ý kiến cần sửa.';

    /* 27 / 28 */
    const accepted = Flow.state.vars.round > 0 ? selCqcm().filter((c) => respOf(c.id) === 'Bảo lưu') : [];
    v.viecCanSua = nok().filter((o) => respOf(o.cqcm) === 'Tiếp thu').map((o) => `- ${o.sec}: ${o.guide || o.text}`)
      .concat(accepted.map((c) => `- ${c.unit} đã chấp nhận giải trình: ghi chú làm rõ trong hồ sơ.`)).join('\n');
    const savedGt = u.giaiTrinh || [];
    v.giaiTrinh = nok().map((o, i) => {
      const dd = respOf(o.cqcm), r = D.responses[o.cqcm] || {}, sv = savedGt.find((x) => x.cqcm === o.cqcm && x.muc === o.sec);
      return { cqcm: o.cqcm, muc: o.sec, yKien: `${cqcmUnit(o.cqcm)} · ${o.sec}: ${o.text}`, quyetDinh: dd, noiDung: sv ? sv.noiDung : (dd === 'Bảo lưu' && r.keepText) || r.text || '', thamChieu: r.ref || '' };
    });
    v.tongHopGiaiTrinh = `${nok().filter((o) => respOf(o.cqcm) === 'Tiếp thu').length} ý kiến tiếp thu, ${nok().filter((o) => respOf(o.cqcm) === 'Bảo lưu').length} ý kiến bảo lưu`;
    v.nokGiaiTrinh = v.giaiTrinh.map((g) => ({ yKien: g.yKien, quyetDinh: g.quyetDinh, giaiTrinh: g.noiDung, thamChieu: g.thamChieu }));

    /* 31–34 (họp MS01) */
    v.thoiGianHop = u.thoiGianHop || `${Flow.dateOf(Flow.state.clock + 1)} 14:00`;
    v.diaDiemHop = u.diaDiemHop || (kdt() ? (R().meeting || {}).place || '' : 'Phòng họp 3, tầng 5');
    v.thanhPhanHop = u.thanhPhanHop || ['minh', 'hai'].concat(kdt() ? Flow.cqcmSel().map((c) => (D.cqcm.find((x) => x.id === c) || {}).doer).filter(Boolean) : selCqcm().map((c) => c.doer), ['lan']);

    /* 36 — comment #17: AI đối chiếu Checklist với tài liệu trên hồ sơ */
    const thieu = v.checklist.filter((c) => c.tinhTrang === 'Thiếu' && c.yeuCau === 'Bắt buộc');
    v.aiHoSo = thieu.length ? { ketQua: 'Thiếu hồ sơ', chiTiet: thieu.map((c) => `- Thiếu: ${c.muc}`).join('\n') }
      : { ketQua: 'Đủ hồ sơ', chiTiet: `- ${v.checklist.filter((c) => c.tinhTrang === 'Đủ').length} mục bắt buộc đã có trên hồ sơ v${version()}.\n- Mục "Nếu có" không có tài liệu: ${v.checklist.filter((c) => c.tinhTrang === 'Không có').map((c) => c.muc).join(', ') || 'không'}.` };

    /* 38 / 39 / 60 — khối chữ ký BM-09 (kết quả ký từ VOffice) */
    const s9 = bm09Signs();
    v.kyBm09 = [signRowV('lan', 'CQCM về ĐTXD (TTMS)', s9.ttms.st, s9.ttms.at), signRowV('binh', 'Phó Tổng Giám đốc', s9.ptgd.st, s9.ptgd.at)]
      .concat(selCqcm().map((c) => signRowV(c.doer, `CQCM ${c.unit}`, 'Đã thể hiện qua BM-04 + Checklist 02', null)))
      .concat(n === 60 ? [signRowV('tgd', 'Người có thẩm quyền — ô PHÊ DUYỆT', s9.tgd.st, s9.tgd.at)] : []);
    const kpi = Flow.kpiUsed(), lim = D.kpiLimit[proc()] || 20;
    v.kpi = kpi === null ? '-' : `${ty(kpi, 1)} / ${lim} ngày làm việc (${kpi <= lim ? 'trong hạn' : 'quá hạn'})`;

    /* 42 / 43 — BM-05 do AI soạn (task 41), TTMS quyết định theo mục (G2) */
    v.bm05 = aiRows('bm05', D.bm05.map(([k, x]) => ({ key: k, muc: k, goiY: x, nguon: `AI soạn từ hồ sơ v${version()}, BM-04 và bảng giải trình` })), 'Chấp nhận');
    v.bm05View = v.bm05.map((r) => ({ muc: r.muc, noiDung: aiFinal(r) || '(bỏ)' })).concat([{ muc: 'Kết luận', noiDung: 'Đủ điều kiện trình phê duyệt ĐXMS.' }]);

    /* 46 / 47 */
    const ttms = Flow.lastOf(43);
    /* Comment #18–21: thời điểm trình ký / ký và lý do từ chối lấy từ kết quả VOffice; thời gian xử lý, KPI do BE tính (định mức mẫu 0,5 NLV). */
    const sent45 = Flow.lastOf(43), t0 = sent45 ? sent45.t : null;
    const signInfo = (task, who) => {
      const d = Flow.state.history.find((x) => String(x.task) === String(task) && x.who === who && !x.system);
      const used = d && t0 != null ? Math.max(0, d.t - t0) / 2 : null;
      return { trinhLuc: t0 != null ? Flow.dateOf(t0) : '-', kyLuc: d ? Flow.dateOf(d.t) : '-', thoiGian: used == null ? '-' : `${ty(used, 1)} NLV`,
        kpi: used == null ? '-' : used <= 0.5 ? 'Đạt' : 'Quá hạn', lyDo: d && /^Không/.test(d.action) ? d.reason || '' : '-' };
    };
    v.kyBm05 = [Object.assign({ nguoiKy: pname('lan'), tuCach: 'TTMS — CQCM chủ trì về ĐTXD (ký trước)', trangThai: ttms ? 'Đã ký' : 'Không ký' },
      { trinhLuc: ttms ? Flow.dateOf(ttms.t) : '-', kyLuc: ttms ? Flow.dateOf(ttms.t) : '-', thoiGian: '-', kpi: '-', lyDo: '-' })]
      .concat(selCqcm().map((c) => Object.assign({ nguoiKy: pname(c.doer), tuCach: c.unit, trangThai: signTask(46, c.doer) }, signInfo(46, c.doer))),
        [Object.assign({ nguoiKy: pname('binh'), tuCach: 'Phó TGĐ chuyên trách', trangThai: signTask(47, 'binh') }, signInfo(47, 'binh'))]);
    const late = v.kyBm05.filter((r) => r.kpi === 'Quá hạn').length, signed = v.kyBm05.filter((r) => r.kpi === 'Đạt').length;
    v.aiKpiKy = `${signed} người ký trong định mức, ${late} người quá hạn. ${late ? 'Đề xuất nhắc việc người quá hạn và ghi nhận vào KPI bước ký BM-05.' : 'Chưa có người ký quá hạn ở lượt này.'}`;

    /* 48 */
    const bd = basisDoc() || {};
    v.canCuTd = `${bd.no || ''} — **${bd.group ? 'đã' : 'chưa'}** được CT/TGĐ Tập đoàn phê duyệt · Tổng giá trị ${ty(D.caseInfo.total)} tỷ đồng`;

    /* 60 — comment #22, #23: phiếu nhận xét của Tập đoàn (VOffice hoặc tải lên) + AI đọc nhận xét */
    const td56 = Flow.lastOf(56);
    v.yKienTd = { co: !!Flow.state.vars.reportTD && !!td56, tep: u.tdReviewFile ? 'đã tải lên ở Danh sách tài liệu' : `nhận qua VOffice (VO-2026-558812)${td56 ? ' ngày ' + Flow.dateOf(td56.t) : ''}`,
      tomTat: 'TGĐ Tập đoàn đồng ý chủ trương; đề nghị VHT rà soát lại tiến độ giao hàng buồng đo OTA và bổ sung phương án dự phòng nhà cung cấp.',
      ai: '- Cập nhật mục "Kế hoạch tổ chức thực hiện" của BM-01: mốc giao hàng từng lô buồng đo OTA.\n- Bổ sung phương án dự phòng nhà cung cấp vào BM-02 (thuyết minh).\n- Điều 2 của Quyết định BM-08: giao TTMS theo dõi tiến độ giao hàng.' };

    /* 53–56 — kết quả từ VOffice (giả lập phía Tập đoàn) */
    v.voffice = `**BM-06:** Số 3321/VHT-TTMS · đã ký VOffice\n**BM-07:** ${n >= 54 ? 'Số 1187/BC-ĐTXD · ' + Flow.dateOf(Flow.state.clock) : 'Đang lập'}\n**Nhận qua:** VOffice (mã VO-2026-558812)`;

    if (kdt()) Object.assign(v, kdtVars(tok, u));
    return v;
  }

  /* Biến riêng của hồ sơ KĐT (MS13-TO BE). */
  function kdtVars(tok, u) {
    const n = tok.task, k = kd(), v = {}, total = D.caseInfo.total, cs = Flow.cqcmSel(), m = R().meeting || {};
    v.kdtLabel = `Tổng mức vốn thực tế ${ty(total)} tỷ (gồm VAT, sau khi trừ tồn kho) — gửi Ban Tài chính và TTMS xác nhận trước khi hệ thống xác định nhóm khoản đầu tư.`;
    /* 11 */
    v.kdtTomTat = `**Mã KĐT:** ${k.code || ''} · **Tên KĐT:** ${k.title || ''}\n**Loại KĐT:** ${catName('loai-kdt', k.type)} · **Tính chất tài sản:** ${catName('tinh-chat-tai-san', k.nature)}\n**Tổng mức vốn thực tế (gồm VAT):** ${ty(total)} tỷ đồng · **Nguồn vốn:** ${D.caseInfo.fund}`;
    v.danhMuc = buyItems().map((i) => ({ n: i.n, hang: i.name, sl: `${i.buy} ${i.uom}`, thanhTien: ty(i.amount), loai: i.cost || '' }));
    v.tscd = u.tscd !== false;
    v.tscdNote = u.tscdNote || '';
    /* 12 */
    const r = Flow.kdtCheck(), f = r.factors, bad = u.factorBad || {};
    v.yeuTo = [['field', 'Lĩnh vực', catName('linh-vuc', f.field), 'Khoản đầu tư'], ['type', 'Loại KĐT', catName('loai-kdt', f.type), 'Khoản đầu tư'],
      ['total', 'Tổng mức vốn thực tế (gồm VAT)', ty(r.total) + ' tỷ đồng', 'Báo giá đã chốt'], ['nature', 'Tính chất tài sản', catName('tinh-chat-tai-san', f.nature), 'Khoản đầu tư']]
      .map(([key, yt, gt, ng]) => ({ key, yeuTo: yt, giaTri: gt, nguon: ng, dung: !bad[key] }));
    const ts = Flow.state.tokens.some((t) => String(t.task) === '11'), tsDone = Flow.lastOf(11);
    v.tscdKetQua = ts ? `Chờ xác nhận — ${pname('thu')} (Ban Tài chính)` : tsDone ? `${tsDone.action === 'Xác nhận OK' ? 'OK' : 'Không OK'} · Hình thành TSCĐ: ${u.tscd === false ? 'Không' : 'Có'} — ${pname(tsDone.who)}, ${Flow.dateOf(tsDone.t)}` : '-';
    const th = r.ms13 ? `${catName('linh-vuc', r.ms13.field)}: dưới ${ty(r.ms13.to, 0)} tỷ đồng` : 'Chưa có ngưỡng MS13 cho lĩnh vực này';
    v.phanLuong = { nhom: D.kdtGroups[r.group] || r.group, nguong: th, nhanh: r.group === 'MS13' ? D.kdtBranches[r.merge ? 'BM00' : '2GD'] : '-', ms13: r.group === 'MS13',
      canhBao: r.group === 'MS13' ? '' : `Tổng mức vốn thực tế ${ty(r.total)} tỷ đồng không thuộc ngưỡng MS13 (${th}). Khi đủ hai xác nhận OK, hồ sơ kết thúc và chuyển xử lý theo ${r.group}.`,
      baoGiaChuaDat: Flow.state.vars.quoteOk === false };
    v.mergeConds = r.conds.map((c) => ({ dieuKien: c.label, ketQua: c.ok ? 'Đạt' : 'Không đạt' }));
    /* 14 */
    v.aiDuThao = aiRows('aiDuThao', [{ key: 'mucTieu', muc: 'Mục tiêu', goiY: aiText('purposeText'), nguon: 'Thông tin cơ bản của hồ sơ' },
      { key: 'phamVi', muc: 'Phạm vi, quy mô', goiY: aiText('scope'), nguon: 'Thông tin cơ bản của hồ sơ' }], 'Chấp nhận');
    v.nguonVonKdt = u.nguonVonKdt || D.caseInfo.fund;
    v.thoiGianKdt = u.thoiGianKdt || D.caseInfo.period;
    v.bienPhapKdt = u.bienPhapKdt || 'Lựa chọn nhà thầu năm 2027; lắp đặt, hiệu chuẩn và nghiệm thu trong 06 tháng sau ký hợp đồng.';
    v.tonKhoKdt = '02 máy phân tích phổ 44 GHz (giảm mua từ 12 xuống 10)';
    /* 16 */
    const dd = R().doc || {};
    v.aiSoan = aiRows('aiSoan', [['phuongAn', 'Phương án kỹ thuật – công nghệ', dd.tech], ['phuongPhap', 'Phương pháp tính', dd.method], ['hieuQua', 'Đánh giá hiệu quả', dd.effect], ['toChuc', 'Tổ chức thực hiện', dd.org]]
      .map(([key, muc, goiY]) => ({ key, muc, goiY: goiY || '', nguon: 'AI soạn theo cấu trúc tờ trình KĐT' })), 'Chấp nhận');
    v.hinhThuc = `**Tổng mức vốn thực tế:** ${ty(total)} tỷ đồng · **Loại KĐT:** ${catName('loai-kdt', k.type)} · **Tính chất tài sản:** ${catName('tinh-chat-tai-san', k.nature)}\n**Hình thức dự kiến:** ${D.kdtBranches[r.merge ? 'BM00' : '2GD']}`;
    /* 18–20 */
    v.bm00Nguon = [['A. Chủ trương (mục 1–7)', `Căn cứ ${(basisDoc() || {}).no || ''}, thông tin cơ bản của hồ sơ`], ['B. Quy mô, phương pháp tính (mục 8, 10)', `Danh mục sau trừ tồn kho (${R().rstk}), ${D.quotes.length} báo giá`], ['B. Kế hoạch, tổ chức thực hiện (mục 11–13)', 'Tiến độ trong căn cứ']]
      .map(([phan, nguon]) => ({ phan, nguon, trangThai: 'Đã điền' }));
    v.mucTieuK = u.mucTieuK != null ? u.mucTieuK : aiText('purposeText');
    v.suCanThietK = u.suCanThietK != null ? u.suCanThietK : dd.necessity || '';
    v.toChucK = u.toChucK != null ? u.toChucK : dd.org || '';
    v.phuongPhapK = u.phuongPhapK != null ? u.phuongPhapK : dd.method || '';
    v.yKienChiHuy = u.yKienChiHuy != null ? u.yKienChiHuy : R().lead || '';
    v.nguoiChoYKien = `${pname('hai')} — Chỉ huy đơn vị đề xuất`;
    /* 36 / 39 — "Sự cần thiết" của BM-01 theo gợi ý AI (DX-01: thiếu thì AI kiểm tra trả lại ở bước 39) */
    v.aiSuCanThietK = aiRows('aiSuCanThietK', [{ key: 'suCanThiet', muc: 'Sự cần thiết (mục 4.2)', goiY: dd.necessity || '', nguon: `Căn cứ ${(basisDoc() || {}).no || ''}, nhu cầu trong đề xuất` }], kNeed() ? 'Chấp nhận' : null);
    v.phuLucDanhMuc = buyItems().map((i) => ({ n: i.n, hang: i.name, sl: `${i.buy} ${i.uom}`, donGia: ty(i.price), thanhTien: ty(i.amount), loai: i.cost || '' }));
    v.checklist01 = kdtChecklist(1);
    v.checklist02 = kdtChecklist(2);
    v.ketLuanCl = u.ketLuanCl || (n === 47 ? 'Hồ sơ đảm bảo đủ điều kiện trình thẩm định, phê duyệt KĐT.' : 'Hồ sơ đảm bảo đủ điều kiện trình thẩm định, phê duyệt chủ trương KĐT.');
    /* 21 / 38 / 48 / 39 */
    const b24 = Flow.lastOf(24);
    v.traLai24 = b24 && /^Danh sách/.test(b24.action) && lastIdx(24) > lastIdx(n) ? { lyDo: b24.reason || '' } : null;
    v.yKienLead = n === 21 && Flow.lastOf(20) ? `Ý kiến Chỉ huy ĐVĐX (${pname('hai')}): “${R().lead || ''}”` : '';
    v.chuTri = `**Cơ quan chủ trì:** Trung tâm Mua sắm (TTMS) · **Người xử lý:** ${pname('lan')}`;
    v.cqcmValuesK = D.cqcm.map((c) => ({ value: c.id, label: `${c.unit} — ${CQ_FN[c.id] || ''} · ${pname(c.doer)}` }));
    v.cqcmSel = u.cqcmSel || cs;
    v.host = hostOf() || null;
    v.canDonViChuTri = needHost();
    v.loaiKdt = catName('loai-kdt', k.type);
    v.dsDauMoi = [{ ma: 'TTMS', nguoi: pname('lan'), vaiTro: 'Cơ quan chủ trì thẩm định', donVi: 'Trung tâm Mua sắm (TTMS)' }]
      .concat(D.cqcm.map((c) => ({ ma: c.id, nguoi: pname(c.doer), vaiTro: 'CQCM phối hợp', donVi: c.unit })));
    v.aiCheckK = u.aiCheckK || null;
    /* 24 / 26 — thẩm định theo lượt */
    const open24 = n === 24, i = rvIdx(open24);
    v.luot = pad2(i + 1);
    v.giaiDoan = stg();
    v.demVong = counters();
    if (n === 24) {
      const lastIn = Flow.state.history.filter((h) => h.who && (h.td || 'GOP') === tdKey() && ['23', '28', '33'].includes(String(h.task))).pop();
      v.banner24 = !lastIn ? '' : { 33: `Hồ sơ đã cập nhật theo nội dung đã thống nhất sau họp (phiên bản v${kdtVer()}).`, 23: 'Đơn vị đề xuất đã bổ sung, gửi lại hồ sơ.',
        28: `Đơn vị đề xuất đã bổ sung hồ sơ theo ý kiến lượt ${pad2(i)} (phiên bản v${kdtVer()}).` }[String(lastIn.task)];
      v.raSoat = `**${stg().doc}:** phiên bản v${kdtVer()}${stg().cl ? ` · ${stg().cl} đủ` : ''} · **Đơn vị chủ trì:** ${hostOf() || '-'}\n**CQCM phối hợp:** ${cs.map(cqcmUnit).join('; ') || 'Không chọn'}\n`
        + [['TC', 'Có danh mục hình thành TSCĐ → cần Ban Tài chính'], ['PC', 'Áp dụng Quy chế LCNT → cần Ban Pháp chế']].map(([id, t]) => `- ${t}: **${cs.includes(id) ? 'có' : 'chưa có'}**`).join('\n');
      v.thamDinh = stg().crit.map((c, j) => ({ stt: j + 1, noiDung: c, danhGia: 'Đạt' }));
      v.nhanXetTtms = (rvOf(i, 'TTMS').items || []).map((x) => `${x[0]}: ${x[1]}`).join(' ');
      v.ketLuanTd = fixOf(i, 'TTMS') ? 'Cần sửa đổi, giải trình' : 'Đồng ý';
      v.yKienTruoc = Array.from({ length: i }, (_, j) => fixItems(j).map((x) => ({ luot: pad2(j + 1), donVi: unitOf(x.id), noiDung: x.text, traLoi: (R().reply || [])[j] || '' }))).flat();
    }
    if (n === 26 && tok.cqcm) {
      const c = tok.cqcm;
      v.cqcmTen = cqcmUnit(c);
      v.aiPhanHoi = `- Đối chiếu ${stg().doc} v${kdtVer()} với chức năng ${cqcmUnit(c)}: ${CQ_FN[c] || ''}.` + (i > 0 ? `\n- Lượt trước: ${fixOf(i - 1, c) ? 'có ý kiến cần sửa — kiểm tra nội dung đơn vị đã bổ sung / giải trình.' : 'không có ý kiến.'}` : '');
      v.phieuNhanXet = (rvOf(i, c).items || []).map((x) => ({ muc: x[0], nhanXet: x[1], huongDan: x[2] || '' }));
      v.ketLuanTd = fixOf(i, c) ? 'Cần sửa đổi, giải trình' : 'Đồng ý';
    }
    /* 23 / 28 / 29 / 31–35 / 53 */
    const ip = rvIdx(false), chk = Flow.tdCount('chk'), meet = Flow.tdCount('meet'), pend = fixItems(ip);
    const b51 = Flow.lastOf(51);
    v.goiYSua = n === 53 ? `- TTMS: “${(b51 && b51.reason) || ''}”\n- Cập nhật Tờ trình BM-03 và Phụ lục thuyết minh theo hướng dẫn; bổ sung tài liệu vào Checklist 02.`
      : `- TTMS: “${(b24 && b24.reason) || ''}”\n- Đối chiếu Checklist 01: bổ sung tài liệu còn thiếu, cập nhật tờ trình.`;
    v.hoSoGd = `**${stg().doc}:** phiên bản v${kdtVer()}${stg().cl ? ` · **${stg().cl}:** đủ` : ''}${n === 53 ? ` · tạo phiên bản v${kdtVer() + 1} khi gửi` : ''}`;
    v.chiDao = Flow.state.vars.directed && Flow.lastOf(35) ? `Kết luận của Thủ trưởng: “${Flow.lastOf(35).reason || ''}”` : '';
    v.aiTongHop = pend.map((x) => `- **${unitOf(x.id)} · ${x.sec}:** ${x.guide || x.text}`).join('\n');
    v.soNoiDung = pend.length;
    const savedTl = u.traLoi || [];
    v.traLoi = pend.map((x) => ({ donVi: unitOf(x.id), muc: x.sec, yKien: x.text, traLoi: ((savedTl.find((s) => s.donVi === unitOf(x.id) && s.muc === x.sec) || {}).traLoi) ?? ((R().reply || [])[Math.min(chk, (R().reply || [1]).length - 1)] || '') }));
    v.noiDungChuaTn = pend.map((x) => ({ donVi: unitOf(x.id), muc: x.sec, yKien: x.text, traLoi: (R().reply || [])[Math.max(0, chk - 1)] || '' }));
    v.lanHop = meet + 1; v.soVongCheck = chk; v.soLanHop = meet;
    v.ketLuanHop = u.ketLuanHop != null ? u.ketLuanHop : m.result || '';
    v.dieuChinh = (m.changes || []).map((c) => ({ noiDung: c[0], truoc: c[1], sau: c[2] }));
    const a31 = Flow.doneCount(31) > Flow.doneCount(33), st = (done, opn) => (done ? 'Đã xác nhận' : opn ? 'Chờ xác nhận' : 'Chưa đến lượt');
    v.xacNhanSauHop = [{ nguoi: pname('minh'), vaiTro: 'Chuyên quản ĐVĐX', trangThai: st(a31, n === 31) }, { nguoi: pname('hai'), vaiTro: 'Chỉ huy ĐVĐX', trangThai: st(false, n === 32) }];
    v.bienBan = Array.from({ length: meet }, (_, j) => `- Bien-ban-hop-lan-${j + 1}-${fileCode()}.pdf`).join('\n') || '- (chưa có)';
    v.ketLuanTt = u.ketLuanTt != null ? u.ketLuanTt : 'Chấp nhận ý kiến Ban Tài chính; đơn vị đề xuất tách phần hiệu chuẩn định kỳ khỏi giá trị TSCĐ và hoàn chỉnh hồ sơ.';
    /* 46 */
    const hi = Flow.state.history.map((x) => String(x.task));
    v.traLai51 = hi.lastIndexOf('53') > hi.lastIndexOf('46') ? `Báo cáo thẩm định chưa được thông qua: “${(b51 || {}).reason || ''}” — hoàn chỉnh hồ sơ theo hướng dẫn.` : '';
    v.keThua = [['Tên, phân loại, lĩnh vực KĐT', 'BM-01 mục 1–3'], ['Mục tiêu, sự cần thiết', 'BM-01 mục 4.1, 4.2'], ['Tổng mức vốn, cơ cấu chi phí', 'BM-01 mục 5 (cập nhật sau họp)'],
      ['Nguồn vốn, thời gian thực hiện', 'BM-01 mục 6'], ['Tổ chức thực hiện, đơn vị chủ trì', `BM-01 mục II${hostOf() ? ' · ' + hostOf() : ''}`]].map(([noiDung, tu]) => ({ noiDung, tu, trangThai: 'Đã điền' }));
    const ct = ctSigned();
    v.chuTruong = `Chủ trương BM-01 ${b3().ctNo || ''} — Thủ trưởng ký duyệt${ct.at ? ' ngày ' + ct.at : ''}.`;
    v.hienTrang = u.hienTrang != null ? u.hienTrang : b3().state || '';
    v.ruiRo = u.ruiRo != null ? u.ruiRo : b3().risk || '';
    v.diaDiem = u.diaDiem != null ? u.diaDiem : b3().place || '';
    /* 51 / 42 / 44 / 54 / 55 / 56 */
    v.ketQuaTd = `**Kết luận:** CQCM thống nhất, không còn ý kiến cần sửa · **Hồ sơ:** ${stg().doc} v${kdtVer()}\n**Vòng check:** ${chk}/2 · **Số lần họp:** ${meet}/2 · **CQCM phối hợp:** ${cs.map(cqcmUnit).join('; ') || '-'}\n**Cấp xử lý:** VHT — không cần ý kiến Tập đoàn`;
    const sent39 = Flow.lastOf(39), a = signOf(42), b = signOf(44);
    v.kyBm01 = [{ nguoiKy: pname('hai'), tuCach: 'Đơn vị đề xuất', trangThai: sent39 ? 'Đã trình' : 'Chưa trình', thoiDiem: sent39 ? Flow.dateOf(sent39.t) : '-' },
      signRowV('lan', 'Cơ quan chủ trì thẩm định (TTMS)', a.st, a.at), { nguoiKy: '-', tuCach: 'Phó TGĐ phụ trách (nếu có)', trangThai: 'Không có', thoiDiem: '-' },
      signRowV('tgd', 'Người có thẩm quyền — ô PHÊ DUYỆT', b.st, b.at)];
    const r51 = Flow.lastOf(51), s54 = signOf(54);
    v.kyBm18 = [{ nguoiKy: pname('lan'), tuCach: 'Cơ quan chủ trì thẩm định — BM-14', trangThai: r51 ? 'Đã trình' : 'Chưa trình', thoiDiem: r51 ? Flow.dateOf(r51.t) : '-' }, signRowV('tgd', 'Người có thẩm quyền — Quyết định BM-18', s54.st, s54.at)];
    const sent55 = Flow.lastOf(55), s56 = signOf(56);
    v.kyBm00 = [{ nguoiKy: pname('minh'), tuCach: 'Đơn vị đề xuất — trình ký', trangThai: sent55 ? 'Đã trình' : 'Chưa trình', thoiDiem: sent55 ? Flow.dateOf(sent55.t) : '-' }, signRowV('tgd', 'Người có thẩm quyền — ô PHÊ DUYỆT', s56.st, s56.at)];
    return v;
  }

  /* ---------- Văn bản đầu ra: mẫu Word + dữ liệu eForm → xem trước PDF (L4) ---------- */
  const docSec = (no, title, inner, req) => `<div class="doc-sec"><h4>${no}. ${title}${req ? ' <span class="req">*</span>' : ''}</h4>${inner}</div>`;
  const P = (s) => `<p>${esc(s || '')}</p>`;
  const buyList = () => `<p>${buyItems().map((i) => `${esc(i.name)} (${i.buy} ${esc(i.uom)})`).join('; ')}.</p>`;
  const moneyText = (t) => `<p>${vnd(t)} đồng (${ty(t)} tỷ đồng), đã bao gồm VAT.</p>`;
  const missing = '<p class="missing">Chưa có nội dung.</p>';

  /* Tờ trình BM-01 (≥ 160 tỷ) hoặc BM-09 (< 160 tỷ, P-19): 10 mục lấy từ eForm task 11/12. */
  function docTt() {
    const v = of({ task: draftTask() }), s = small() ? bm09Signs() : null, nec = U().necessity;
    return `<div class="doc paper"><p class="c"><b>TỜ TRÌNH ĐỀ XUẤT MUA SẮM (${tt()})</b><br>${esc(Flow.ci().title)} · Phiên bản v${version()}</p>
      ${s ? `<div class="doc-sec"><h4>PHÊ DUYỆT</h4><p>${esc(pname('tgd'))} — Tổng Giám đốc · ${esc(s.tgd.st)}${s.tgd.at ? ' ' + s.tgd.at : ''}</p></div>` : ''}
      ${docSec(1, 'Sự cần thiết', nec ? P(nec) : missing, true)}${docSec(2, 'Mục đích', P(v.mucDich))}${docSec(3, 'Phạm vi, quy mô', P(v.phamVi))}
      ${docSec(4, 'Tổng kinh phí (gồm VAT)', P(v.tongKinhPhi))}${docSec(5, 'Phương pháp tính, cơ sở đơn giá', P(v.phuongPhap))}${docSec(6, 'Phương án kỹ thuật – công nghệ', P(v.phuongAn))}
      ${docSec(7, 'Nguồn vốn', P(v.nguonVonTt))}${docSec(8, 'Sử dụng hàng tồn kho', P(`“${v.cauTonKho}”`))}${docSec(9, 'Biện pháp thực hiện', P(v.bienPhap))}${docSec(10, 'Kế hoạch tổ chức thực hiện', P(v.keHoach))}
      ${s ? `<div class="doc-sec"><h4>Thẩm định</h4><p>CQCM về ĐTXD (TTMS): ${esc(pname('lan'))} · ${esc(s.ttms.st)}</p><p>Phó Tổng Giám đốc: ${esc(pname('binh'))} · ${esc(s.ptgd.st)}</p></div>` : ''}</div>`;
  }
  function docBm03() {
    const cs = Flow.cqcmSel();
    return `<div class="doc paper"><p class="c"><b>PHIẾU YÊU CẦU THẨM ĐỊNH</b><br>Số: ……/PYC-TTVT · Ngày ${Flow.dateOf(Flow.state.clock)}</p>
      <p>Kính gửi: ${esc(cs.map(cqcmUnit).join('; ')) || '<i>chưa chọn</i>'}.</p><p>${esc(D.caseInfo.unit)} đề nghị thẩm định hồ sơ <b>${esc(Flow.ci().code)}</b> — ${esc(Flow.ci().title)}, giá trị ${ty(D.caseInfo.total)} tỷ đồng.</p>
      <p>Hạn gửi ý kiến (BM-04): ${esc(U().hanGopY || Flow.dateOf(Flow.state.clock + 5))}.</p><p class="r">GIÁM ĐỐC TRUNG TÂM<br><br><i>${esc(pname('hai'))}</i></p></div>`;
  }
  const docBm05 = () => { const v = of({ task: 42 }); return `<div class="doc paper"><p class="c"><b>BÁO CÁO KẾT QUẢ THẨM ĐỊNH (BM-05)</b><br>${esc(Flow.ci().title)} · hồ sơ v${version()}</p>${v.bm05View.map((r) => docSec(r.muc, '', P(r.noiDung)).replace('. </h4>', '</h4>')).join('')}</div>`; };
  const docBm06 = () => `<div class="doc paper"><p>Kính gửi: Tổng Giám đốc Tập đoàn (qua Ban Đầu tư - Xây dựng)</p><p>VHT báo cáo đề xuất mua sắm <b>${esc(Flow.ci().title)}</b>, giá trị ${ty(D.caseInfo.total)} tỷ đồng, căn cứ ${esc((basisDoc() || {}).no || '')} (${(basisDoc() || {}).group ? 'đã' : 'chưa'} được CT/TGĐ Tập đoàn phê duyệt), đã được thẩm định theo BM-05.</p>
    <p>VHT kính đề nghị Tổng Giám đốc Tập đoàn cho ý kiến để VHT phê duyệt ĐXMS.</p></div>`;
  const docBm08 = () => `<div class="doc paper"><p class="c"><b>QUYẾT ĐỊNH</b><br>Về việc phê duyệt đề xuất mua sắm ${esc(Flow.ci().title.toLowerCase())}</p>
    <p><b>Điều 1.</b> Phê duyệt đề xuất mua sắm với nội dung: tên ${esc(Flow.ci().title)}; tổng giá trị ${vnd(D.caseInfo.total)} đồng (gồm VAT); nguồn vốn ${esc(D.caseInfo.fund)}; thời gian ${esc(D.caseInfo.period)}; danh mục ${buyItems().length} hạng mục (phụ lục kèm theo).</p>
    <p><b>Điều 2.</b> ${esc(D.caseInfo.unit)} chủ trì tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn; TTMS, Ban Tài chính phối hợp.</p>
    <p><b>Điều 3.</b> Quyết định có hiệu lực từ ngày ký.</p><p class="r">TỔNG GIÁM ĐỐC<br><br><i>${esc(pname('tgd'))}</i></p></div>`;
  const docBm02 = () => `<div class="doc paper"><p class="c"><b>THUYẾT MINH ĐỀ XUẤT MUA SẮM (BM-02)</b></p><p>Hệ thống sinh từ ${tt()} và phụ lục chi phí. Phụ lục 1 (giải trình ý kiến) được điền khi lập giải trình.</p></div>`;

  /* KĐT: BM-01 chủ trương, BM-00 gộp, BM-03 + phụ lục thuyết minh, BM-14, BM-18. */
  function docBm01K() {
    const d = R().doc || {}, k = kd(), total = D.caseInfo.total, sg = signOf(44), host = hostOf(), u = U();
    const cost = Flow.doneCount(33) ? P(R().meeting.changes[1][2] + '.') : '';
    return `<div class="doc paper"><div class="doc-sec"><h4>PHÊ DUYỆT</h4><p>${esc(pname('tgd'))} — Tổng Giám đốc · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p></div>
      <div class="doc-sec"><h4>I. THÔNG TIN CHUNG</h4></div>
      ${docSec(1, 'Tên khoản đầu tư', P(k.title || Flow.ci().title))}${docSec(2, 'Phân loại KĐT', P(catName('loai-kdt', k.type)))}${docSec(3, 'Lĩnh vực đầu tư', P(catName('linh-vuc', k.field)))}
      ${docSec('4.1', 'Mục đích, mục tiêu', P(u.mucTieuK || aiText('purposeText')))}${docSec('4.2', 'Sự cần thiết', kNeed() ? P(aiOf('aiSuCanThietK', 'suCanThiet') || d.necessity) : missing, true)}
      ${docSec('5.1', 'Tổng mức vốn dự kiến (gồm VAT)', `<p>${vnd(total)} đồng (${ty(total)} tỷ đồng)</p>`)}
      ${docSec('5.2', 'Phương pháp tính toán', `${P(u.phuongPhapK || d.method)}${P('Phương án kỹ thuật – công nghệ: ' + (d.tech || ''))}${buyList()}${cost}`)}
      ${docSec(6, 'Nguồn vốn và thời gian thực hiện', `${P((d.fund || '') + '.')}${P(d.period)}`)}${docSec(7, 'Đánh giá hiệu quả', P(d.effect))}
      <div class="doc-sec"><h4>II. TỔ CHỨC THỰC HIỆN</h4>${P(u.toChucK || d.org)}${host ? P('Đơn vị chủ trì: ' + host + '.') : ''}</div></div>`;
  }
  function docBm00() {
    const d = R().doc || {}, k = kd(), sg = signOf(56), u = U();
    return `<div class="doc paper"><div class="doc-sec"><h4>PHÊ DUYỆT</h4><p>${esc(pname('tgd'))} — Tổng Giám đốc · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p></div>
      <div class="doc-sec"><h4>A. CHỦ TRƯƠNG ĐẦU TƯ</h4></div>
      ${docSec(1, 'Tên khoản đầu tư', P(k.title || Flow.ci().title))}${docSec(2, 'Phân loại KĐT', P(catName('loai-kdt', k.type)))}${docSec(3, 'Lĩnh vực đầu tư', P(catName('linh-vuc', k.field)))}
      ${docSec(4, 'Mục tiêu đầu tư', P(u.mucTieuK || aiText('purposeText')))}${docSec(5, 'Sự cần thiết', P(u.suCanThietK || d.necessity), true)}${docSec(6, 'Tổng mức vốn', moneyText(D.caseInfo.total))}
      ${docSec(7, 'Nguồn vốn và thời gian thực hiện', `${P((d.fund || '') + '.')}${P(d.period)}`)}
      <div class="doc-sec"><h4>B. KHOẢN ĐẦU TƯ</h4></div>
      ${docSec(8, 'Quy mô đầu tư', buyList())}${docSec(9, 'Phương án kỹ thuật – công nghệ', P(d.tech))}${docSec(10, 'Phương pháp tính toán', P(d.method))}
      ${docSec(11, 'Kế hoạch thực hiện', `<ul class="plain">${(Array.isArray(d.plan) ? d.plan : []).map(([a, b]) => `<li>${esc(a)}: ${esc(b)}</li>`).join('')}</ul>`)}
      ${docSec(12, 'Tổ chức thực hiện', P(u.toChucK || d.org))}${docSec(13, 'Đánh giá hiệu quả', P(d.effect))}</div>`;
  }
  function docBm03K() {
    const k = kd(), d = R().doc || {}, x = b3(), ct = ctSigned(), u = U();
    return `<div class="doc paper"><div class="doc-sec"><h4>TỜ TRÌNH — Thẩm định, phê duyệt Khoản đầu tư</h4><p>Số: ${esc(x.no || '')} · Kính gửi: ${esc(x.decider || 'Tổng Giám đốc VHT')}</p>
        <p>Căn cứ Tờ trình số ${esc(x.ctNo || '')}${ct.at ? ` ngày ${ct.at}` : ''} về việc phê duyệt chủ trương KĐT đã được Tổng Giám đốc phê duyệt; căn cứ ${esc((basisDoc() || {}).no || '')}.</p></div>
      <div class="doc-sec"><h4>I. THÔNG TIN CHUNG VỀ KHOẢN ĐẦU TƯ</h4></div>
      ${docSec(1, 'Tên khoản đầu tư', P(k.title || Flow.ci().title))}${docSec(2, 'Phân loại KĐT', P(catName('loai-kdt', k.type)))}${docSec(3, 'Lĩnh vực đầu tư', P(catName('linh-vuc', k.field)))}
      ${docSec(4, 'Người quyết định đầu tư', P(x.decider))}${docSec(5, 'Chủ đầu tư', P(k.unit || Flow.ci().unit))}${docSec(6, 'Mục tiêu đầu tư', P(aiText('purposeText')))}
      ${docSec(7, 'Địa điểm đầu tư', P(u.diaDiem || x.place))}${docSec(8, 'Tổng mức vốn', moneyText(D.caseInfo.total))}${docSec(9, 'Quy mô đầu tư', buyList())}
      ${docSec(10, 'Nguồn vốn', P(d.fund))}${docSec(11, 'Thời gian thực hiện mua sắm', P(d.period))}
      <div class="doc-sec"><h4>II. KIẾN NGHỊ, ĐỀ XUẤT</h4>${P(`${k.unit || ''} kính trình ${x.decider || ''} xem xét, tổ chức thẩm định và phê duyệt Khoản đầu tư làm cơ sở để các đơn vị thực hiện các thủ tục tiếp theo.`)}</div></div>`;
  }
  function docAnnex() {
    const d = R().doc || {}, x = b3(), costs = (R().bm18 || {}).costs || [], u = U();
    return `<div class="doc paper"><p class="c"><b>PHỤ LỤC THUYẾT MINH KHOẢN ĐẦU TƯ</b></p>
      ${docSec(1, 'Mục đích / mục tiêu, sự cần thiết', `${P(aiText('purposeText'))}<p><b>Đánh giá hiện trạng:</b> ${esc(u.hienTrang || x.state || '')}</p><p><b>Kết luận về sự cần thiết:</b> ${esc(d.necessity || '')}</p>`)}
      ${docSec(2, 'Phương án thiết kế công nghệ, giải pháp triển khai', `${P(d.tech)}${P('Địa điểm: ' + (u.diaDiem || x.place || '') + '.')}${P('Rủi ro: ' + (u.ruiRo || x.risk || ''))}`)}
      ${docSec(3, 'Tổng mức vốn', `${moneyText(D.caseInfo.total)}${costs.length ? `<ul class="plain">${costs.map(([a, val]) => `<li>${esc(a)}: ${ty(val)} tỷ đồng</li>`).join('')}</ul>` : ''}${P('Phương pháp tính toán: ' + (d.method || ''))}`)}
      ${docSec(4, 'Tổ chức thực hiện', `${P(d.org)}<ul class="plain">${(x.milestones || []).map(([a, b]) => `<li>${esc(a)}: ${esc(b)}</li>`).join('')}</ul>`)}
      ${docSec(5, 'Đánh giá hiệu quả', P(d.effect))}</div>`;
  }
  function docBm14() {
    const k = kd(), cs = Flow.cqcmSel(), x = R().bm14 || {}, nr = Math.max(1, Flow.tdRound());
    const pend = Array.from({ length: nr }, (_, j) => fixItems(j)).flat();
    return `<div class="doc paper"><div class="doc-sec"><h4>BÁO CÁO KẾT QUẢ THẨM ĐỊNH — Khoản đầu tư ${esc(k.title || '')}</h4><p>Số: ${esc(x.no || '')} · Kính gửi: ${esc(b3().decider || 'Tổng Giám đốc VHT')}</p></div>
      <div class="doc-sec"><h4>Phần thứ nhất — Tài liệu thẩm định và tổ chức thẩm định</h4><ul class="plain"><li>Tờ trình ${esc(b3().no || '')} (BM-03, phiên bản v${kdtVer()}) và Checklist 02 của ${esc(k.unit || '')}.</li>
        <li>Văn bản thẩm định của ${cs.length} CQCM: ${esc(cs.map(cqcmUnit).join('; ') || '-')}.</li><li>Cơ quan chủ trì thẩm định: Trung tâm Mua sắm (TTMS). Hình thức thẩm định: lấy ý kiến bằng văn bản.</li></ul></div>
      <div class="doc-sec"><h4>Phần thứ hai — Ý kiến thẩm định khoản đầu tư</h4></div>
      ${docSec('I', 'Thông tin chung', P(`${catName('loai-kdt', k.type)} · ${catName('linh-vuc', k.field)} · Tổng mức vốn ${ty(D.caseInfo.total)} tỷ đồng · ${(R().doc || {}).fund || ''}.`))}
      ${docSec('II.1', 'Các nội dung đồng thuận', `<ul class="plain">${(x.agreed || []).map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`)}
      ${docSec('II.2', 'Nội dung cần bổ sung làm rõ', pend.length ? `<ul class="plain">${pend.map((p) => `<li>${esc(unitOf(p.id))}: ${esc(p.text)}</li>`).join('')}</ul>` : P('Không có.'))}
      ${docSec('II.3', 'Giải trình của đại diện chủ đầu tư', P(x.explain))}
      ${docSec('III', 'Ý kiến của cơ quan chủ trì thẩm định', `<ul class="plain">${['Kết quả thẩm định về mặt pháp lý', 'Kết quả thẩm định về mục tiêu và sự cần thiết', 'Kết quả thẩm định các nội dung chính của KĐT'].map((a) => `<li>${a} — Đánh giá: <b>Đạt</b>.</li>`).join('')}</ul>`)}
      ${docSec('IV', 'Kiến nghị', P(`Kiến nghị ${b3().decider || 'Tổng Giám đốc VHT'} xem xét, quyết định phê duyệt Khoản đầu tư để các đơn vị triển khai các bước tiếp theo.`))}</div>`;
  }
  function docBm18() {
    const k = kd(), d = R().doc || {}, x = R().bm18 || {}, sg = signOf(54);
    return `<div class="doc paper"><div class="doc-sec"><h4>QUYẾT ĐỊNH — Phê duyệt khoản đầu tư ${esc(k.title || '')}</h4><p>Số: ${esc(x.no || '')}/QĐ-VHT · ${esc(pname('tgd'))} — Tổng Giám đốc · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p>
        <p>Căn cứ Tờ trình chủ trương ${esc(b3().ctNo || '')} đã được phê duyệt; xét Tờ trình ${esc(b3().no || '')}; theo đề nghị của TTMS tại Báo cáo kết quả thẩm định ${esc((R().bm14 || {}).no || '')}.</p></div>
      <div class="doc-sec"><h4>Điều 1. Phê duyệt khoản đầu tư với các nội dung chính</h4></div>
      ${docSec(1, 'Tên khoản đầu tư', P(k.title))}${docSec(2, 'Phân loại KĐT · Lĩnh vực', P(`${catName('loai-kdt', k.type)} · ${catName('linh-vuc', k.field)}`))}
      ${docSec(3, 'Người quyết định đầu tư · Chủ đầu tư', P(`${b3().decider || ''} · ${x.owner || k.unit || ''}`))}${docSec(4, 'Mục tiêu đầu tư', P(aiText('purposeText')))}
      ${docSec(5, 'Tổng mức vốn', `${moneyText(D.caseInfo.total)}${(x.costs || []).length ? `<ul class="plain">${x.costs.map(([a, val]) => `<li>${esc(a)}: ${ty(val)} tỷ đồng</li>`).join('')}</ul>` : ''}`)}
      ${docSec(6, 'Nguồn vốn · Thời gian thực hiện mua sắm', P(`${d.fund || ''} · ${d.period || ''}`))}
      <div class="doc-sec"><h4>Điều 2. Tổ chức thực hiện</h4>${P(`Giao ${x.owner || k.unit || ''} là chủ đầu tư: lập kế hoạch triển khai chi tiết, trình phê duyệt kế hoạch lựa chọn nhà thầu, tổ chức nghiệm thu, quyết toán và báo cáo định kỳ theo quy định.`)}</div>
      <div class="doc-sec"><h4>Điều 3. Hiệu lực</h4><p>Quyết định có hiệu lực kể từ ngày ký.</p></div></div>`;
  }

  /* code → { name, html }. KĐT dùng BM-01 / BM-03 của bộ biểu mẫu KĐT (BM-8.6.5). */
  const DOC = {
    'BM-01': () => (kdt() ? { name: 'Tờ trình chủ trương KĐT', html: docBm01K() } : { name: 'Tờ trình đề xuất mua sắm', html: docTt() }),
    'BM-09': () => ({ name: 'Tờ trình đề xuất mua sắm', html: docTt() }),
    'BM-02': () => ({ name: 'Thuyết minh ĐXMS', html: docBm02() }),
    'BM-03': () => (kdt() ? { name: 'Tờ trình thẩm định, phê duyệt KĐT', html: docBm03K() } : { name: 'Phiếu yêu cầu thẩm định', html: docBm03() }),
    'PL-TM': () => ({ name: 'Phụ lục thuyết minh KĐT', html: docAnnex() }),
    'BM-05': () => ({ name: 'Báo cáo kết quả thẩm định', html: docBm05() }),
    'BM-06': () => ({ name: 'Công văn báo cáo TGĐ Tập đoàn', html: docBm06() }),
    'BM-08': () => ({ name: 'Quyết định phê duyệt ĐXMS', html: docBm08() }),
    'BM-00': () => ({ name: 'Hồ sơ gộp chủ trương và KĐT', html: docBm00() }),
    'BM-14': () => ({ name: 'Báo cáo kết quả thẩm định KĐT', html: docBm14() }),
    'BM-18': () => ({ name: 'Quyết định phê duyệt KĐT', html: docBm18() }),
  };
  const doc = (code) => (DOC[code] ? DOC[code]() : null);

  /* ---------- Kiểm tra phía BE khi submit (G3, G7/E3, KĐT bước 12) ----------
     Tài liệu bắt buộc theo hành động (E3) đọc ở Danh sách tài liệu (Flow.ui[key] = đã tải lên). */
  const REQ_DOCS = {
    MS01: { 16: [['bm03File', 'Phiếu yêu cầu thẩm định (BM-03) đã ký nháy']], 32: [['minutesFile', 'Biên bản họp']], 51: [['bm06File', 'Tệp đính kèm khi xác nhận (BM-06 đã ký nháy)']] },
    MS13: { 29: [['kMinutes', 'Biên bản họp']] },
  };
  /* Comment #5: báo giá của từng NCC nhận YCBG — bắt buộc với nút "Báo giá đạt". Comment #22: phiếu nhận xét Tập đoàn — tuỳ chọn. */
  const quoteKey = (code) => 'quote_' + code;
  function reqDocs(tok) {
    const list = ((REQ_DOCS[kdt() ? 'MS13' : 'MS01'][tok.task]) || []).map(([key, name]) => ({ key, name, have: !!U()[key] }));
    if (!kdt() && String(tok.task) === '10') (U().nccSel || nccDefault()).forEach((c) => list.push({ key: quoteKey(c), name: `Báo giá — ${nccName(c)}`, have: !!U()[quoteKey(c)], only: /^Báo giá đạt/ }));
    if (!kdt() && tok.task === 60 && !small() && Flow.state.vars.reportTD) list.push({ key: 'tdReviewFile', name: 'Phiếu nhận xét của Tập đoàn', have: !!U().tdReviewFile, opt: true });
    return list;
  }
  function check(tok, choice, vals) {
    const n = tok.task, lbl = choice ? choice.label : '';
    const miss = reqDocs(tok).find((x) => !x.have && !x.opt && (!x.only || x.only.test(lbl)));
    if (miss && !(kdt() && n === 29 && /^Chưa/.test(lbl))) return `Bạn cần tải lên ${miss.name} ở Danh sách tài liệu.`;
    if (!vals) return null;
    if (n === 1 && (of(tok).basisDocOptions.find((o) => o.value === vals.basisDoc) || {}).type !== vals.basisType) return 'Văn bản căn cứ không thuộc loại căn cứ đã chọn.';
    if (n === 5 && lbl.startsWith('Xác nhận') && (vals.bocTach || []).some((r) => r.remain != null && r.prop > r.remain)) return 'Có dòng vượt số lượng còn lại sau trừ lùi.';
    if (!kdt() && n === 16 && small() && !(vals.cqcmSel || []).includes('TC')) return 'Hồ sơ dưới 160 tỷ: CQCM Tài chính bắt buộc (QT B8.2).';
    if (kdt() && n === 12 && lbl === 'Xác nhận OK' && (vals.yeuTo || []).some((r) => !r.dung)) return 'Có yếu tố chưa đúng — chọn “Không OK” và nhập lý do.';
    if (n === 7 && (vals.ruaSoatKho || []).some((r) => r.coKho && r.fromStock > r.max)) return 'Số dùng từ kho vượt số khả dụng hoặc số đề xuất.';
    /* Comment #8: chỉ duyệt tổng thể khi mọi phần Đạt; Không đồng ý cần ít nhất một phần Không đạt. */
    if (!kdt() && n === 13 && vals.duyetPhan) {
      const bad = vals.duyetPhan.filter((r) => r.ketQua === 'Không đạt').length;
      if (lbl === 'Đồng ý' && bad) return `Còn ${bad} phần Không đạt — chưa duyệt tổng thể được. Chọn “Không đồng ý” để trả lại người soạn.`;
      if (lbl === 'Không đồng ý' && !bad) return 'Chọn Không đạt cho ít nhất một phần và nhập lý do, chỉ đạo.';
    }
    return null;
  }

  window.EVars = {
    of, doc, check, reqDocs,
    h: { kdt, small, tt, clName, draftTask, proc, procOf, condOf, version, kdtVer, basisDoc, basisSel, quoteFail, quoteAttempt, nok, respOf, selCqcm, stg, tdKey,
      needHost, hostOf, kNeed, kd, catName, signOf, returnedFrom, aiFinal, aiOf, buyItems, rvIdx, fixOf, HOSTS, pname, lineRemain, propOf, bm04Round },
  };
})();
