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

  /* Review nhi 06/11 #6, #12, #16: xem trước văn bản ngay trong popup eForm — giá trị form đang soạn (chưa lưu) chồng lên biến hồ sơ (LIVE). */
  let LIVE = null;
  const U = () => (LIVE ? Object.assign({}, Flow.ui, LIVE) : Flow.ui);
  const R = () => D.caseRef;
  const kdt = () => !!Flow.state.kdt;
  const small = () => Flow.isSmall();
  const draftTask = () => (small() ? 11 : 12);
  const tt = () => (small() ? 'BM-09' : 'BM-01');
  const clName = () => (small() ? 'Checklist 02' : 'Checklist 01');
  const buyItems = () => D.items.filter((i) => i.buy > 0);
  const vv = (x) => (Array.isArray(x) ? x[Flow.doneCount(27) ? 1 : 0] : x);
  const vnd = (t) => Math.round(t * 1e9).toLocaleString('vi-VN');
  const selCqcm = () => D.cqcm.filter((c) => Flow.cqcmSel().includes(c.id)).map((c) => Object.assign({}, c, { doer: Flow.cqcmDoer(c.id) }));
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
    /* Văn bản căn cứ chính mặc định theo Đề tài / dự án chọn khi tạo luồng (D.nhiemVu[].basis); không có thì theo hồ sơ mẫu. */
    const x = !kdt() && Flow.state.dxms ? Flow.findDxms(Flow.state.dxms) : null, nvB = x && x.nv ? (D.nvOf(x.nv) || {}).basis : null;
    const def = (nvB && list.find((d) => d.id === nvB)) || list.find((d) => d.id === R().basisDoc) || list[0];
    const doc = list.find((d) => d.id === u.basisDoc) || (u.basisDoc ? null : def) || null;
    return { bt, list, doc };
  }
  const basisDoc = () => basisSel().doc || D.basisDocsFor(proc()).find((d) => d.id === R().basisDoc);

  /* ---------- Bóc tách, tồn kho (task 05, 07) ---------- */
  const lineRemain = (i) => (i.bom == null ? null : i.bom - i.used);
  const propOf = (i) => { const r = (U().bocTach || []).find((x) => x.n === i.n); return r && r.prop != null ? r.prop : i.prop; };

  /* ---------- BM-04, giải trình (task 19–28) ---------- */
  const respOf = (c) => ((U().resp || {})[c]) || (D.responses[c] || {}).decision || 'Tiếp thu';
  /* T29 F8 (HT-DXMS-NOTE màn 6, 10; GIẢ LẬP P-191) — tình trạng thẩm định của từng CQCM ở lần gửi gần nhất.
     Chưa xem: việc lập phiếu (19) chưa có bản lưu nháp; Đang xem: đã lưu nháp, hoặc đang trình chỉ huy CQCM ký (20);
     Đã đồng ý / Yêu cầu sửa: phiếu đã ký, không có / có mục Không OK. Số ngày xử lý = ngày làm việc từ lúc gửi (18) tới lúc ký (chưa ký: tới hôm nay). */
  function reviewRows() {
    const sent = Flow.lastOf(18);
    if (kdt() || adj() || !sent) return [];
    const drafts = U().efDraft || {};
    return selCqcm().map((c) => {
      const toks = Flow.state.tokens.filter((t) => t.cqcm === c.id);
      const signed = Flow.state.history.filter((h) => h.task === 20 && h.cqcm === c.id && /^Đồng ý/.test(h.action) && h.t >= sent.t).pop();
      const st = signed ? (opinionsOf(c.id).some((o) => !o.ok) ? 'Yêu cầu sửa' : 'Đã đồng ý')
        : toks.some((t) => t.task === 20 || drafts[t.id]) ? 'Đang xem' : 'Chưa xem';
      const end = signed ? signed.t : Flow.state.clock;
      return { id: c.id, unit: c.unit, who: pname(c.doer), st, sent: Flow.dateOf(sent.t), at: signed ? Flow.dateOf(signed.t) : null, days: ty(Math.max(0, end - sent.t), 1) };
    });
  }
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
    const h = Flow.state.history, ky = Flow.state.vars.ky;
    /* Hồ sơ KĐT: bước ký đang đi qua khối ký chung 75–78 (D-34) — chưa có kết quả. */
    if (kdt() && ky && String(ky.task) === String(task)) return { st: ky.mode === 'hard' ? 'Đang ký bản cứng' : 'Đang trình VOffice', at: null };
    let from = 0;
    if (!kdt()) h.forEach((x, i) => { if ((x.task === 11 || x.task === 27) && x.who) from = i + 1; });
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
    && (['26', '36', '59'].includes(String(h.task)) || (String(h.task) === '31' && /^Bổ sung/.test(h.action)))).length;
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
  const kNeed = () => !!U().kNeed || Flow.doneCount(43) > 0;
  const HOSTS = ['Trung tâm Mua sắm', 'Trung tâm Vô tuyến', 'Viện Nghiên cứu phát triển Vô tuyến'];
  const CQ_FN = { PC: 'Pháp lý, thẩm quyền, Quy chế LCNT', TC: 'Tài chính, nguồn vốn, phân loại TSCĐ / CCDC', CL: 'Chất lượng, chỉ tiêu kỹ thuật' };
  const counters = () => `Vòng check ${Flow.tdCount('chk')}/2 · Họp ${Flow.tdCount('meet')}/2`;
  const aiText = (key) => (D.aiBasic.find((a) => a.key === key) || {}).value || '';
  const rvIdx = (open27) => Math.max(0, Flow.tdRound() - (open27 ? 0 : 1));
  const rvOf = (i, id) => D.kdtReview(tdKey(), i)[id] || {};
  const fixOf = (i, id) => D.kdtFix(tdKey(), i, id, U());
  const fixItems = (i) => ['TTMS'].concat(Flow.cqcmSel()).filter((id) => fixOf(i, id))
    .flatMap((id) => (rvOf(i, id).items || [['Nội dung', 'Cần bổ sung, làm rõ.', '']]).map((x) => ({ id, sec: x[0], text: x[1], guide: x[2] || '' })));
  const unitOf = (id) => (id === 'TTMS' ? 'TTMS (CQCM chủ trì)' : cqcmUnit(id));
  const b3 = () => R().bm03 || {};
  /* Tuyến Tập đoàn 63–74 (T18 B4): loại hồ sơ trình (vars.tdKind) → tên, văn bản chính, mẫu phiếu nhận xét của các Ban Tập đoàn (DG-MS13 bước 67). */
  const TD_KIND = { CT: { title: 'Hồ sơ chủ trương KĐT', doc: 'Tờ trình chủ trương BM-01', code: 'BM-01', cq: 'BM-09' },
    KDT: { title: 'Hồ sơ phê duyệt KĐT', doc: 'Tờ trình BM-03 + Phụ lục thuyết minh', code: 'BM-03', cq: 'BM-10' },
    GOP: { title: 'Hồ sơ gộp chủ trương và KĐT', doc: 'Văn bản gộp BM-00', code: 'BM-00', cq: 'BM-09' } };
  const tdk = () => TD_KIND[Flow.state.vars.tdKind] || TD_KIND.CT;
  const tdKinds = () => Flow.state.vars.tdKinds || [];
  /* Phiếu nhận xét mẫu của các Ban Tập đoàn (bước 67) và nội dung giải trình mặc định (bước 68) — GIẢ LẬP P-96. */
  const TD_REVIEW = [['Ban Khoa học Công nghệ', 'Sự cần thiết', 'Làm rõ mức độ phù hợp với định hướng KHCN giai đoạn 2026–2030 của Tập đoàn.', 'Trích dẫn chương trình KHCN Tập đoàn liên quan; nêu sản phẩm đầu ra cụ thể.'],
    ['Ban Tài chính', 'Tổng mức vốn', 'Đề nghị tách chi phí hiệu chuẩn định kỳ khỏi giá trị đầu tư hình thành tài sản.', 'Tách dòng chi phí hiệu chuẩn sang chi phí thường xuyên.'],
    ['Ban Đầu tư – Xây dựng', 'Hiệu quả đầu tư', 'Bổ sung chỉ tiêu đánh giá hiệu quả sau đầu tư.', 'Bổ sung bảng chỉ tiêu, mốc đánh giá 12 tháng sau đưa vào sử dụng.']];
  const TD_REPLY = ['Đã bổ sung trích dẫn Chương trình KHCN trọng điểm Tập đoàn 2026–2030 (mục 4.2) và danh mục sản phẩm đầu ra.',
    'Đã tách chi phí hiệu chuẩn định kỳ khỏi tổng mức vốn; cập nhật phụ lục chi phí.', 'Đã bổ sung bảng chỉ tiêu hiệu quả (mục 7) và mốc đánh giá sau 12 tháng.'];
  const kdtGop = () => Flow.state.vars.branch === 'BM00';
  const KDT_TD_NAME = { GOP: 'BM-00', CT: 'BM-01', KDT: 'BM-03' };
  const ctSigned = () => signOf(48);

  /* Gợi ý AI theo mục (G2): một dòng / mục — Gợi ý, Nguồn chỉ đọc; Quyết định Chấp nhận / Sửa / Bỏ; Nội dung sửa.
     Dòng đã có quyết định (Flow.ui[path]) được giữ. def = quyết định mặc định ('Chấp nhận' hoặc null = chưa chọn). */
  /* Task 04 (BPMN MS01 v1.1): mục đích; phạm vi / quy mô; giá trị, nguồn vốn, thời gian; biện pháp / kế hoạch thực hiện — theo thứ tự mục 1–6
     của Tờ trình BM-01 / BM-09 (BM-10.2.1). Biện pháp, Kế hoạch tổ chức thực hiện (mục 6) chỉ có ở ĐXMS; KĐT giữ bộ mục của MS13. */
  function basicRows() {
    if (kdt()) return D.aiBasic;
    const d = R().doc || {}, src = (basisDoc() || {}).no || 'căn cứ';
    return D.aiBasic.concat([
      { key: 'bienPhap', label: 'Biện pháp thực hiện', value: vv(d.measures) || '', from: `${src}; BM-01 mục 6 (Luật Đấu thầu / Quy chế LCNT của Tập đoàn)` },
      { key: 'keHoach', label: 'Kế hoạch tổ chức thực hiện', value: typeof d.plan === 'string' ? d.plan : '', from: `Tiến độ trong ${src}` }]);
  }
  /* Giá trị đã xác nhận ở task 04 (Chấp nhận → gợi ý, Sửa → nội dung sửa, Bỏ → rỗng) — đầu vào dự thảo Tờ trình (task 11 / 12). */
  const basicPick = (key, dflt) => {
    const s = (U().aiGoiY || []).find((x) => x.key === key);
    return !s ? dflt : s.quyetDinh === 'Sửa' ? (s.noiDungSua || dflt) : s.quyetDinh === 'Bỏ' ? '' : dflt;
  };
  function aiRows(path, list, def) {
    const saved = U()[path] || [];
    return list.map((x) => Object.assign({ key: x.key, muc: x.muc, goiY: x.goiY, nguon: x.nguon, quyetDinh: def, noiDungSua: '', nhanXet: '' },
      saved.find((s) => s.key === x.key) || {}, { goiY: x.goiY, nguon: x.nguon, muc: x.muc }));
  }
  /* Giá trị cuối của một dòng gợi ý AI (BE tính khi Xác nhận): Chấp nhận → gợi ý; Sửa / Từ chối (task 11, 12) → nội dung sửa / thay thế; Bỏ / chưa chọn → rỗng. */
  const aiFinal = (r) => (!r ? '' : r.quyetDinh === 'Chấp nhận' ? r.goiY : r.quyetDinh === 'Sửa' || r.quyetDinh === 'Từ chối' ? r.noiDungSua || '' : '');
  const aiOf = (path, key) => aiFinal((U()[path] || []).find((r) => r.key === key));

  /* Task 13 — các phần chỉ huy duyệt (comment #6–8). */
  /* Review nhi 06/11 #8, #11: phần duyệt theo mục 1–6 của mẫu BM-01 / BM-09. */
  const PARTS = () => ['1. Mục đích', '2. Phạm vi, quy mô (sự cần thiết, danh mục hàng hóa)', '3. Giá trị, phương pháp tính, phương án kỹ thuật',
    '4. Nguồn vốn, thời gian thực hiện', '5. Đánh giá hiệu quả', '6. Biện pháp, kế hoạch thực hiện', 'BM-02 Thuyết minh', clName()];
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
  /* T29 B17 (P-212): phụ lục của Tờ trình chọn Có / Không — chọn khi tạo luồng (vars.phuLuc), sửa ở bước lập dự thảo (pl_<khoá>);
     vals = giá trị form đang nộp (chưa ghi vào U). */
  const plOn = (key, vals) => ((vals && vals['pl_' + key]) || U()['pl_' + key] || (Flow.state.vars.phuLuc || {})[key] || 'Không') === 'Có';
  /* Review nhi 06/11 #9: tên Tờ trình theo luồng (BM-01 ≥ 160 tỷ / BM-09 < 160 tỷ) — bảng là Checklist 01 / 02 theo giá trị hồ sơ (clName). */
  const clName0 = (c) => c.name.replace('(BM-01)', `(${tt()})`);
  const fileOf = (x) => (typeof x === 'string' ? x : x ? 'Đã tải lên' : '');
  /* Review nhi 06/11 #29: cột Tệp — dòng đã có tệp tải về được (liên kết [tên](dl:tên), eform-run). */
  const checklistRows = () => { const tep = checklistForm(); return D.checklist.map((c, i) => {
    const f = tep[i].tepDa === 'Chưa có tệp' ? '-' : tep[i].tepDa;
    /* T29 F7, B17: phụ lục chọn Có — bắt buộc, Đủ khi đã tải lên; chọn Không — Không áp dụng. */
    if (c.up) return plOn(c.up) ? { nhom: c.g, muc: c.name, so: U()[c.up] ? 'Đã tải lên' : c.no, yeuCau: 'Bắt buộc', tinhTrang: U()[c.up] ? 'Đủ' : 'Thiếu', tep: f }
      : { nhom: c.g, muc: c.name, so: '—', yeuCau: 'Không', tinhTrang: 'Không áp dụng', tep: '-' };
    const ok = c.by == null ? null : Flow.taskStatus(c.by) !== 'todo' || c.by === draftTask();
    return { nhom: c.g, muc: clName0(c), so: c.no, yeuCau: c.req, tinhTrang: ok == null ? 'Không có' : ok ? 'Đủ' : 'Thiếu', tep: f };
  }); };
  /* Review nhi 06/11 #4, #5: Checklist trong popup bước lập dự thảo = danh mục hồ sơ, gộp 6 phụ lục (chọn Có / Không ngay trên dòng),
     mỗi dòng hiện tệp đã có trên hồ sơ và cho tải thêm. Tệp hệ thống sinh (Tờ trình, BM-02) không tải ở đây. Thật: dynamiclist + filepicker của vht-e-form;
     tệp lên MinIO, gắn Loại tài liệu = dòng checklist (danh mục Loại tài liệu), cùng nơi với Danh sách tài liệu. */
  const GEN = /\((BM-0[129])\)$/;
  const SEEDED = { 1: () => `${(basisDoc() || {}).no || 'Văn bản căn cứ'}.pdf`, 10: () => { const up = (U().nccSel || nccDefault()).filter((c) => U()[quoteKey(c)]).map((c) => (typeof U()[quoteKey(c)] === 'string' ? U()[quoteKey(c)] : `Báo giá ${nccName(c)}.pdf`));
    return (up.length ? up : D.quotes.map((q) => `Báo giá ${nccName(q.ncc)}.pdf`)).join(', ') || 'Bao-gia-nha-cung-cap.pdf'; }, 7: () => `${R().rstk || 'Kết quả rà soát tồn kho'}.xlsx` };
  function checklistForm() {
    const extra = U().clFiles || {}, kem = U().clKem || {};
    const link = (s) => String(s).split(', ').filter(Boolean).map((n) => `[${n}](dl:${n})`).join(', ');
    return D.checklist.map((c, i) => {
      const key = c.up || 'cl' + i, gen = !c.up && (GEN.test(c.name) || c.by === draftTask());
      const seeded = !c.up && c.by != null && SEEDED[c.by] && Flow.taskStatus(c.by) !== 'todo' ? SEEDED[c.by]() : '';
      const files = [seeded, c.up ? fileOf(U()[c.up]) : '', extra[key] || ''].filter(Boolean).join(', ');
      const on = c.up ? plOn(c.up) : null;
      const ok = c.up ? (on ? !!files : null) : c.by == null ? (files ? true : null) : Flow.taskStatus(c.by) !== 'todo' || c.by === draftTask();
      /* Review nhi 06/11 #27: Tình trạng Có / Không trên mọi dòng (phụ lục = Kèm theo); mặc định theo tệp đã có. */
      const genFile = gen ? `${/BM-02/.test(c.name) ? 'BM-02' : /^Checklist/.test(c.name) ? clName().replace(' ', '-') : tt()}_du-thao-v${version()}.pdf` : '';
      return { key, up: c.up || '', nhom: c.g, muc: clName0(c), pl: !!c.up, gen, noFile: !gen && !files, kemTheo: c.up ? (on ? 'Có' : 'Không') : gen ? 'Có' : kem[key] || (files || ok ? 'Có' : 'Không'),
        batBuoc: c.up ? 'Không bắt buộc' : c.req === 'Bắt buộc' ? 'Bắt buộc' : 'Không bắt buộc',
        yeuCau: c.up ? (on ? 'Bắt buộc' : 'Không') : c.req, tinhTrang: c.up && !on ? 'Không áp dụng' : ok == null ? 'Không có' : ok ? 'Đủ' : 'Thiếu',
        tepDa: gen ? link(genFile) : files ? link(files) : 'Chưa có tệp', tepMoi: '' };
    });
  }
  /* Giá trị Có / Không của phụ lục và tệp vừa chọn trong bảng Checklist của form (vals.checklistDs) → pl_<khoá>, tệp phụ lục. */
  const plFromForm = (vals) => {
    const o = {};
    ((vals && vals.checklistDs) || []).forEach((r) => { if (r.up) o['pl_' + r.up] = r.kemTheo || 'Không'; });
    return o;
  };
  const formFile = (vals, key) => (((vals && vals.checklistDs) || []).find((r) => r.key === key) || {}).tepMoi || '';
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

  /* ---------- Hồ sơ Điều chỉnh (MS02, T21) — vars.adj do startAdj ghi, bước 4 sửa (Flow.setAdj) ---------- */
  const adj = () => (kdt() ? null : Flow.state.vars.adj || null);
  /* Ngưỡng 160 tỷ: cận trên của khoảng MS01.03 trong bản chụp ngưỡng của hồ sơ. */
  const adjTh = () => ((Flow.state.vars.th || D.dxmsRules()).find((r) => r.procs.includes('MS01.03')) || {}).to || 160;
  /* Luồng con theo giá trị sau điều chỉnh hiện tại (trước cổng sau bước 10 thì vars.big chưa đổi). */
  const adjBranch = () => { const a = adj(); return a ? D.adjBranch(Object.assign({}, Flow.state.vars, { big: a.total >= adjTh() })) : null; };
  const adjCases = () => (Flow.state.adj || []).concat(D.otherCases);
  const adjFrom = () => { const a = adj(); return (a && a.from && adjCases().find((c) => c.code === a.from)) || null; };
  /* Lần điều chỉnh = số hồ sơ Điều chỉnh đã hoàn thành của ĐXMS + 1. */
  const adjLan = () => 1 + adjCases().filter((c) => c.dxms === Flow.state.dxms && c.kind === 'DC' && c.st === 'done' && c.code !== Flow.state.code).length;
  const adjCross = () => { const a = adj(), th = adjTh(); return !!a && (a.before >= th) !== (a.total >= th); };
  /* Bảng so sánh trước – sau (bước 4 sửa cột Sau; dòng giá trị lấy từ ô Giá trị sau điều chỉnh). */
  function adjRows() {
    const a = adj();
    if (!a) return [];
    const x = Flow.findDxms(Flow.state.dxms) || {}, saved = U().adjRows || [];
    const base = [['thoiGian', 'Thời gian thực hiện', x.period || D.caseInfo.period], ['nguonVon', 'Nguồn vốn', D.caseInfo.fund],
      ['danhMuc', 'Danh mục hàng hoá', `${D.items.length} hạng mục theo hồ sơ ${a.from || 'đã phê duyệt'}`]];
    return [{ key: 'gia', noiDung: 'Tổng giá trị (gồm VAT)', truoc: ty(a.before) + ' tỷ đồng', sau: ty(a.total) + ' tỷ đồng' }]
      .concat(base.map(([key, noiDung, truoc]) => { const s = saved.find((r) => r.key === key) || {}; return { key, noiDung, truoc, sau: s.sau ? s.sau : truoc }; }));
  }
  /* Kết quả đã thực hiện của ĐXMS cũ (bước 2, P-100): KHLCNT, gói thầu, hợp đồng của phân hệ Thầu / Hợp đồng. */
  function adjDone() {
    const T = window.Thau, H = window.HopDong, rows = [];
    if (!T) return rows;
    T.khAll().filter((k) => k.src[0] === 'DXMS' && k.src[1] === Flow.state.dxms).forEach((k) => {
      rows.push({ loai: 'KHLCNT', ma: k.code, noiDung: k.title, trangThai: (T.KH_ST[k.st] || [k.st])[0] });
      T.pkgsOf(k).forEach((p) => {
        rows.push({ loai: 'Gói thầu', ma: p.code, noiDung: p.title || p.name || '', trangThai: (T.PK_ST[p.st] || [p.st])[0] });
        const h = H && H.byPkg(p.code);
        if (h) rows.push({ loai: 'Hợp đồng', ma: h.code, noiDung: h.title || h.name || '', trangThai: (H.HD_ST[h.st] || [h.st])[0] });
      });
    });
    return rows;
  }

  /* ---------- Biến cho form của token ---------- */
  function of(tok) {
    if (Flow.state.parent) return window.EForms.hd.vars(tok);
    const u = U(), n = tok.task, ci = Flow.ci();
    const v = { hoSo: hoSo(), phienBan: kdt() ? kdtVer() : version(), tt: tt(), clName: clName(), lan: pad2(bm04Round()) };

    /* MS02 — hồ sơ Điều chỉnh: thông tin chung của lần điều chỉnh, ĐXMS cũ (bước 1), nội dung điều chỉnh (bước 4). */
    const a = adj();
    if (a) {
      const th = adjTh(), fc = adjFrom() || {}, br = adjBranch(), cross = adjCross();
      v.adj = { dxms: ci.dxms, from: a.from || '-', fromFlow: a.fromFlow || '-', fromAt: fc.updated || '-', before: ty(a.before), total: ty(a.total), lan: pad2(adjLan()),
        reason: a.reason || '', chenhLech: (a.total >= a.before ? '+' : '') + ty(a.total - a.before), nhanh: br, nguong: th,
        boVanBan: br === 'MS02.03' ? 'Tờ trình BM-09 + Checklist 02, ký thẩm định trực tiếp' : br === 'MS02.01' ? 'BM-01 + Checklist 01, BM-05, báo cáo Tập đoàn, Quyết định BM-08' : 'BM-01 + Checklist 01, BM-05, Quyết định BM-08',
        cross: cross ? `Hồ sơ chuyển ngưỡng: giá trị sau điều chỉnh ${ty(a.total)} tỷ ${a.total >= th ? '≥' : '<'} ${th} tỷ, ĐXMS cũ ${ty(a.before)} tỷ — luồng ${br}.` : '' };
      const old = fc.flow === 'MS01.03' || (fc.kind === 'DC' && fc.total < th) ? [['BM-09', 'Tờ trình đề xuất mua sắm (Thủ trưởng phê duyệt trên Tờ trình)']]
        : [['BM-08', 'Quyết định phê duyệt ĐXMS'], ['BM-05', 'Báo cáo kết quả thẩm định']].concat(fc.flow === 'MS01.01' ? [['BM-06', 'Công văn báo cáo TGĐ Tập đoàn']] : []);
      v.adjOldDocs = old.map(([ma, ten]) => ({ ma, ten: fc.kind === 'DC' ? ten.replace('ĐXMS', 'điều chỉnh ĐXMS') : ten, hoSo: a.from || '-', ngay: fc.updated || '-' }));
      v.adjDone = adjDone();
      v.giaTriTruoc = a.before;
      v.giaTriSau = u.giaTriSau != null ? u.giaTriSau : a.total;
      v.lyDoNhom = u.lyDoNhom || null;
      v.lyDoDc = u.lyDoDc != null ? u.lyDoDc : a.reason || '';
      v.phamViDc = u.phamViDc || ['Giá trị'];
      v.adjRows = adjRows().filter((r) => r.key !== 'gia');
      v.adjCompare = adjRows();
      v.nganSach = u.nganSach || '';
      v.adjAi = `- Lý do gợi ý: ${a.total >= a.before ? 'giá thị trường tăng so với báo giá của hồ sơ ' + (a.from || 'cũ') : 'giảm quy mô theo nhu cầu thực tế'}.\n- Hạng mục đã có gói thầu / hợp đồng không giảm dưới số đã ký.\n- Nguồn: hồ sơ ${a.from || 'cũ'}, kết quả đã thực hiện của ĐXMS.`;
    }

    /* 01 */
    const bs = basisSel();
    v.basisType = u.basisType || R().basisType;
    v.basisDoc = u.basisDoc || (bs.doc && bs.doc.id) || null;
    v.basisDocOptions = bs.list.map((d) => ({ value: d.id, label: `${d.no} — ${d.title}`, type: d.type }));
    v.basisDocs = bs.list.map((d) => ({ typeId: d.type, so: d.no, ngay: d.date, loai: ((kdt() ? D.kdtBasisTypes : D.basisTypes).find((b) => b.id === d.type) || {}).name || d.type,
      trichYeu: d.title, giaTri: d.value ? ty(d.value) : '-', conLai: d.value ? ty(d.remain) : '-', tdDuyet: d.group ? 'Đã duyệt' : 'Chưa duyệt' }));
    /* T29 B3c (S4, DTMS_CN_0140, BR-DXMS-02-04): văn bản căn cứ bổ sung — chọn nhiều; bảng đã chọn có Đã dùng ở ĐXMS khác / ĐXMS này đang giữ / Còn có thể sử dụng.
       GIẢ LẬP: hạng mục của hồ sơ liên kết văn bản căn cứ chính (dòng căn cứ theo hạng mục làm khi có dự toán chi tiết — DTMS_Q_0401). */
    v.basisMore = (u.basisMore || []).filter((id) => id !== v.basisDoc);
    v.basisMoreOptions = bs.list.map((d) => ({ value: d.id, label: `${d.no} — ${d.title}` }));
    const hold0 = Math.round(buyItems().reduce((s, i) => s + (i.amount || 0), 0) * 100) / 100;
    v.basisAll = bs.list.map((d) => {
      const main = d.id === v.basisDoc, hold = main ? hold0 : 0, rem = d.value ? Math.round((d.remain - hold) * 100) / 100 : null;
      return { id: d.id, so: d.no, loai: ((kdt() ? D.kdtBasisTypes : D.basisTypes).find((b) => b.id === d.type) || {}).name || d.type, vaiTro: main ? 'Chính' : 'Bổ sung',
        giaTri: d.value ? ty(d.value) : '-', daDung: d.value ? ty(d.value - d.remain) : '-', dangGiu: ty(hold), conLai: rem == null ? '-' : ty(rem) };
    });

    /* 04 */
    v.aiEstimateOff = !kdt() && !Flow.inRange(proc(), D.aiEstimate);
    v.aiEstimate = ty(D.aiEstimate, 0);
    v.tenDeXuat = u.tenDeXuat || ci.title;
    v.purposeCode = u.purposeCode || R().purposeCode;
    /* Mật mặc định theo lựa chọn khi tạo luồng (SCR-96); KĐT theo khoản đầu tư. */
    v.secret = u.secret != null ? u.secret : kdt() ? Flow.isMat() : !!ci.secret;
    v.fund = u.fund !== undefined ? u.fund : (D.aiBasic.find((a) => a.key === 'fund') || {}).code || null;
    v.fundOptions = window.Catalog.rows('nguon-von').filter((r) => r.active || r.code === v.fund).map((r) => ({ value: r.code, label: r.name }));
    v.aiGoiY = aiRows('aiGoiY', basicRows().map((a) => ({ key: a.key, muc: a.label, goiY: a.value, nguon: `${a.from} (căn cứ ${basisDoc() ? basisDoc().no : ''})` })), 'Chấp nhận');
    if (kdt()) { const k = kd(); v.kdtInfo = { linhVuc: catName('linh-vuc', k.field), loai: catName('loai-kdt', k.type), tinhChat: catName('tinh-chat-tai-san', k.nature) }; }

    /* T29 S8 (D-60) — dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng: BE ghi biến khi start từ hạng mục của ĐXMS (bảng giữ chỗ căn cứ).
       Chỉ xem ở bước 01, 05; danh mục hàng hoá để rà soát, báo giá vẫn là bocTach (nối vào ở B3 — S4). */
    /* T31 B3 (D-68): hồ sơ KĐT đọc các dòng bóc tách của KĐT (SCR-55). */
    const xDt = kdt() ? Flow.findKdt(Flow.state.kdt) : Flow.findDxms(Flow.state.dxms);
    const ctName = (t) => (D.costTypes.find(([k]) => k === t) || [t, t])[1];
    v.duToanChon = ((xDt && xDt.cost) || []).map((r) => ({ loai: ctName(r.type), khoanMuc: r.item, dvt: r.uom || '-', sl: r.qty == null ? '-' : r.qty,
      giaTri: ty(r.value), duToan: ty(r.budget), goiThau: r.pkg || '-' }));

    /* 05 */
    v.basisTreeText = D.tree.map((x) => (x.children ? `- **${x.name}**: ${x.children.map((c) => `${c.name} (${c.lines.length} dòng)`).join('; ')}` : `- **${x.name}** (${x.lines.length} dòng)`)).join('\n');
    v.bocTachNguon = R().src;
    /* T29 B12 (Huylx4 #20): bảng bóc tách đọc bộ hạng mục mẫu (D.itemsBase) — dòng đã bỏ đánh dấu bo; hạng mục thêm từ dự toán ở hangMucThem. */
    const ed5 = u.bocTachEdit || { drop: [] };
    v.hangMucThem = u.hangMucThem || [];
    v.duToanLineOptions = ((xDt && !kdt() && xDt.nv) ? D.duToanOf(xDt.nv) : []).filter((l) => l.buy && l.status !== 'Hoàn thành')
      .map((l) => ({ value: l.id, label: `${ctName(l.type)} · ${l.item} · ${l.fund || '-'} · ĐVT ${l.uom || '-'} · dự toán ${l.qty == null ? '' : `${l.qty} ${l.uom || ''}, `}${ty(l.value)} tỷ` }));
    v.bocTach = D.itemsBase().map((i) => ({ n: i.n, name: i.name, uom: i.uom, bom: i.bom == null ? '-' : i.bom, used: i.used == null ? '-' : i.used, bo: (ed5.drop || []).includes(i.n),
      usedIn: D.usedIn[i.n] || '', remain: lineRemain(i), remainText: lineRemain(i) == null ? '-' : lineRemain(i), prop: propOf(i), nhom: i.group ? 'Nhóm ' + i.group : '-', warn: i.warn || '' }));

    /* T29 B16 — DX-10: dữ liệu chỉ xem của bốn bước chỉ huy duyệt (5.1, 7.1, 10.1, 16.1). */
    v.tenHoSo = ci.name || ci.title || '';
    v.bocTachXem = D.items.map((i) => ({ n: i.n, hang: i.name, dvt: i.uom, sl: propOf(i) }));
    v.tongBaoGia = (() => { try { return window.BaoGia && !kdt() ? ty(window.BaoGia.total()) : '-'; } catch (e) { return '-'; } })();
    /* Review nhi 06/11 #3, #7 (D.quoteManual): giá trị báo giá cuối cùng Thầu nhập ở bước 10 (đồng); điền sẵn tổng báo giá mẫu (GIẢ LẬP P-219). */
    const gtMau = (() => { try { return Math.round((window.BaoGia && !kdt() ? window.BaoGia.total() : D.caseInfo.total) * 1e9); } catch (e) { return Math.round(D.caseInfo.total * 1e9); } })();
    v.giaTriBaoGia = u.giaTriBaoGia != null ? u.giaTriBaoGia : gtMau;
    v.giaTriBaoGiaTxt = `${vnd(v.giaTriBaoGia / 1e9)} đồng (${ty(v.giaTriBaoGia / 1e9)} tỷ)`;
    v.ghiChuBaoGia = u.ghiChuBaoGia || '';
    v.baoGiaTep = kdt() ? [] : (u.nccSel || nccDefault()).map((c) => ({ ncc: nccName(c), tep: u[quoteKey(c)] ? (typeof u[quoteKey(c)] === 'string' ? u[quoteKey(c)] : 'Đã tải lên') : 'Chưa tải lên' }));
    v.cqcmXem = (Flow.cqcmSel ? Flow.cqcmSel() : []).map((id) => { const c = D.cqcm.find((x) => x.id === id) || {}; return { donVi: c.unit || id, chucNang: CQ_FN[id] || '', nguoi: c.doer ? persona(Flow.cqcmDoer(id)).name : '-' }; });

    /* 07 — kết quả tích hợp hệ thống kho (task 06, service task) */
    v.stock = { trangThai: 'Đã có kết quả', ma: R().rstk, gui: Flow.dateOf(Math.max(0, Flow.state.clock - 1)) };
    const fs = u.ruaSoatKho || [];
    /* T29 B3a + B5 (D-82): MS01 / MS02 đọc kết quả Kho nhập một lần ở SCR-105 (Flow.ui.rstk.kq, cột BM-RSTK); chưa có thì chưa có Tồn khả dụng. KĐT giữ số mẫu. */
    const kho = !kdt() && window.RaSoatKho ? window.RaSoatKho : null, kr = kho ? kho.rows() : null;
    if (kho) v.stock = kho.done() ? { trangThai: 'Đã có kết quả', ma: R().rstk, gui: Flow.dateOf((kho.data().kq || {}).t || 0) }
      : { trangThai: 'Chờ Phòng Quản lý tài sản rà soát', ma: R().rstk, gui: Flow.dateOf(Math.max(0, Flow.state.clock - 1)) };
    v.khoXong = kho ? kho.done() : true;
    v.ruaSoatKho = D.items.map((i) => {
      const k = kr && kr.find((x) => x.n === i.n);
      const avail = k ? (k.managed ? k.avail : null) : i.stock == null ? null : i.stock, max = Math.min(avail || 0, propOf(i)), sv = fs.find((x) => x.n === i.n);
      const book = k ? (k.managed ? k.book : null) : i.book != null ? i.book : avail;
      return { n: i.n, name: i.name, prop: propOf(i), book: book == null ? '-' : book, held: i.held ? `${i.held} (${i.heldFor})` : avail == null && !(k && k.managed) ? '-' : 0,
        actual: k && k.managed && k.actual != null ? k.actual : '-', avail: avail == null ? '-' : avail, coKho: !!avail, max,
        khoOut: k && k.managed && k.out != null ? k.out : '-',
        fromStock: sv && sv.fromStock != null ? sv.fromStock : k && k.managed && k.out != null ? Math.min(k.out, max) : avail ? max : 0 };
    });
    /* MS02: kết quả rà soát của hồ sơ cũ (snapshot lúc hồ sơ cũ hoàn thành, chỉ xem — không dùng lại, GIẢ LẬP P-100). */
    if (a) {
      v.stockCu = `hồ sơ ${a.from || 'cũ'} · ${(adjFrom() || {}).updated || '-'}`;
      v.ruaSoatKho.forEach((r) => { const i = D.items.find((x) => x.n === r.n); const av = i.stock == null ? null : i.stock + (i.n % 2);
        r.cuAvail = av == null ? '-' : av; r.cuDung = av == null ? 0 : Math.min(av, propOf(i)); });
    }

    /* 08 — NCC lọc theo ngành hàng (BE / danh mục Nhà cung cấp): dừng hoạt động không vào danh sách, bị cấm không vào options */
    const want = itemGoods();
    const list = window.Catalog.rows('nha-cung-cap').filter((r) => r.active && (r.goods || []).some((x) => want.includes(x)));
    const banned = (r) => !!(r.ban && r.ban.until);
    const grp = (g) => buyItems().filter((i) => i.group === g).map((i) => ({ n: i.n, hang: i.name, sl: `${i.buy} ${i.uom}`, nganh: goodsName(i.goods) }));
    v.ycbgNhom1 = grp(1); v.ycbgNhom2 = grp(2); v.group2Note = R().group2Note || '';
    /* T29 B12 (Huylx4 #26): hộp thoại bước 8 theo màn Thêm mới YCBG của hệ thống cũ — Thông tin chung, hàng hoá có Model / Yêu cầu kỹ thuật, tài liệu kỹ thuật. */
    const lan8 = Flow.state.history.filter((h) => String(h.task) === '8' && h.who).length + 1;
    v.maYcbg = `YCBG-${String(Flow.state.dxms || '').replace(/^ĐXMS-/, '')}-${lan8}`;
    v.tenYcbg = u.tenYcbg || `Yêu cầu báo giá — ${ci.title}`;
    const nv8 = D.nvOf((Flow.findDxms(Flow.state.dxms) || {}).nv);
    v.duAnYcbg = nv8 ? `${nv8.code} — ${nv8.name}` : '';
    /* T29 B18: bảng Thông tin dự án / đề tài như màn cũ (Mã, Tên, Nguồn vốn) — từ Đề tài / dự án của luồng (SCR-104). */
    v.duAnRows = nv8 ? [{ ma: nv8.code, ten: nv8.name, loai: nv8.loaiCt || nv8.loai || nv8.kind || '', nguonVon: D.fundNames[nv8.fund] || '' }] : [];
    v.ngayYcbg = u.ngayYcbg || Flow.dateOf(Flow.state.clock);
    v.ycbgHang = u.ycbgHang || buyItems().map((i) => ({ n: i.n, hang: i.name, nhom: i.group === 2 ? 'Nhóm 2 — sản xuất theo yêu cầu' : 'Nhóm 1 — mua sẵn', nganh: goodsName(i.goods),
      uom: i.uom, sl: i.buy, model: '', spec: '' }));
    v.tepKyThuat = u.tepKyThuat || ''; v.tepBanVe = u.tepBanVe || ''; v.tepKhac = u.tepKhac || '';
    v.nccOptions = list.filter((r) => !banned(r)).map((r) => ({ value: r.code, label: `${r.code} — ${r.name}` }));
    v.nccList = list.map((r) => ({ ma: r.code, ten: r.name, email: r.email, nganh: r.goods.filter((x) => want.includes(x)).map(goodsName).join(', '),
      tinhTrang: !r.ban ? 'Bình thường' : r.ban.until ? 'Cấm đến ' + r.ban.until : 'Hạn chế' }));
    v.nccSel = u.nccSel || nccDefault().filter((c) => v.nccOptions.some((o) => o.value === c));
    v.hanTraLoi = u.hanTraLoi || Flow.dateOf(Flow.state.clock + 3);
    /* T29 B4 P2: điều khoản phiếu YCBG — giá trị đã nhập, không thì mẫu của hồ sơ demo (D.ycbgTerms0); đầu mối mặc định người xử lý bước. */
    const yt0 = D.ycbgTerms0 || {};
    v.dkThanhToan = u.dkThanhToan != null ? u.dkThanhToan : yt0.payment || '';
    v.diaDiemGiao = u.diaDiemGiao != null ? u.diaDiemGiao : yt0.place || '';
    v.yeuCauKhac = u.yeuCauKhac != null ? u.yeuCauKhac : yt0.other || '';
    v.dauMoiBgOptions = D.ycbgContacts(tok).map((id) => ({ value: id, label: `${pname(id)} — ${persona(id).role}` }));
    /* T29 B18 (màn cũ: chọn nhiều người → bảng Họ tên, Đơn vị): đầu mối là danh sách; bản nháp cũ một người vẫn đọc được. */
    v.dauMoiBg = Array.isArray(u.dauMoiBg) ? u.dauMoiBg : [u.dauMoiBg || tok.who || Flow.state.persona];
    v.dauMoiList = D.ycbgContacts(tok).map((id) => Object.assign({ id }, D.contactParts(id)));
    /* P-214 GIẢ LẬP: BM-YCKT bắt buộc nêu thời gian bảo hành và năm sản xuất — tạm hai trường chung cho phiếu (mẫu: ≥ 12 tháng, từ năm trước). */
    v.baoHanh = u.baoHanh != null ? u.baoHanh : 12;
    v.namSx = u.namSx != null ? u.namSx : Number(Flow.dateOf(Flow.state.clock).split('/')[2]) - 1;
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
    /* MS02: báo giá của hồ sơ cũ để so sánh (chỉ xem, không dùng lại — P-108); đơn giá cũ GIẢ LẬP = thấp nhất mới / 1,04. */
    if (a) {
      v.baoGiaCu = buyItems().map((i) => { const min = Math.min(...D.quotes.map((x) => x.prices[i.n])), cu = min / 1.04;
        return { dong: `Dòng ${i.n}`, hang: i.name, giaCu: ty(cu), giaMoi: ty(min), chenhLech: '+' + ty(((min - cu) / cu) * 100, 1) + '%' }; });
      v.baoGiaCuNgay = (adjFrom() || {}).updated || '-';
      v.quoteAfter = `${D.quotes.length} báo giá nhận sau ngày tạo hồ sơ điều chỉnh (${Flow.dateOf(0)}) — đạt yêu cầu ít nhất 1 báo giá mới.`;
    }
    const mc = Flow.matchCheck();
    /* T29 B1 (D-54): cổng sau task 10 đặt luồng con (không còn "khớp / không khớp"); D-77 Căn cứ đã được phê duyệt chọn sẵn theo luồng. */
    v.canCuDuyet = u.canCuDuyet || (Flow.state.vars.basisTD ? 'Đã phê duyệt' : 'Chưa phê duyệt');
    v.matchCheck = { tong: ty(mc.total), quyTrinh: D.mainProc.code, dieuKien: condOf(mc.suggest), goiY: mc.suggest,
      nhanh: mc.suggest === 'MS01.03' ? 'dự thảo Tờ trình BM-09' : 'dự thảo Tờ trình BM-01' };
    v.tongMucVon = ty(D.caseInfo.total);

    v.checks = Flow.state.vars.checks.map((c, i) => ({ lan: i + 1, ngay: Flow.dateOf(c.t), giaTri: ty(c.total), quyTrinh: c.process || c.group || '', ketQua: c.ok ? 'Khớp' : 'Không khớp' }));

    /* 11 / 12 — tờ trình: nội dung từng mục (L1), "Sự cần thiết" theo gợi ý AI (G2), kết quả AI kiểm tra (DX-01) */
    const d = R().doc || {};
    v.mucDich = u.mucDich != null ? u.mucDich : basicPick('purposeText', D.aiBasic[0].value);
    v.phamVi = u.phamVi != null ? u.phamVi : basicPick('scope', D.aiBasic[1].value);
    v.phuongPhap = u.phuongPhap != null ? u.phuongPhap : `Đơn giá thấp nhất trong 3 báo giá hợp lệ (${D.quotes.map((q) => nccName(q.ncc)).join(', ')}).`;
    v.phuongAn = u.phuongAn != null ? u.phuongAn : d.tech || '';
    v.nguonVonTt = u.nguonVonTt != null ? u.nguonVonTt : (d.fund ? vv(d.fund) : D.caseInfo.fund);
    v.bienPhap = u.bienPhap != null ? u.bienPhap : basicPick('bienPhap', vv(d.measures) || '');
    v.keHoach = u.keHoach != null ? u.keHoach : basicPick('keHoach', typeof d.plan === 'string' ? d.plan : '');
    v.tongKinhPhi = vv(d.total) || '';
    v.cauTonKho = d.stock || '';
    /* Review nhi 06/11 #8: ô nhập theo đúng mục 1–6 của mẫu BM-01 / BM-09 (BM-10.2.1) — thêm Quan điểm thực hiện, Nguồn ngân sách,
       Thời gian thực hiện mua sắm, Đánh giá hiệu quả; Giá trị (mục 3) và Danh mục hàng hoá (mục 2b) chỉ xem, lấy từ báo giá / bóc tách. GIẢ LẬP P-220. */
    v.quanDiem = u.quanDiem != null ? u.quanDiem : '';
    v.nguonNganSach = u.nguonNganSach != null ? u.nguonNganSach : '';
    v.thoiGianTh = u.thoiGianTh != null ? u.thoiGianTh : period2(ci.period).replace(/&ndash;/g, '–');
    v.hieuQua = u.hieuQua != null ? u.hieuQua : '';
    /* Review nhi 06/11 #36 (GIẢ LẬP P-222): Phụ lục chi phí sửa được ở bước lập dự thảo. Mặc định từ hạng mục hồ sơ; Thầu chỉ nhập một giá trị cuối cùng (#3) nên đơn giá mẫu
       được quy đổi theo tỷ lệ cho khớp giá trị đã duyệt — thật: nhập theo hạng mục hoặc đọc từ báo giá, chờ BA (P-219). */
    const edTotal = Flow.ci().total, edBase = D.items.reduce((a, i) => a + (i.buy || 0) * (i.price || 0), 0), edK = edBase > 0 && Math.abs(edBase - edTotal) > 0.05 ? edTotal / edBase : 1;
    v.phuLucEd = u.phuLucEd || D.items.map((i) => ({ n: i.n, hang: i.name, chungLoai: goodsName(i.goods), dvt: i.uom, sl: i.buy || 0, donGia: Math.round((i.price || 0) * edK * 1e4) / 1e4,
      thanhTien: (i.buy || 0) * (i.price || 0) * edK, coSo: i.buy ? `Báo giá ${nccName('NCC-000001')}` : 'Dùng tồn kho', loai: i.cost || '' }));
    v.giaTriDuyetTy = Math.round(edTotal * 100) / 100;
    v.nguongTy = ((Flow.state.vars.th || D.dxmsRules()).find((r) => r.from > 0) || { from: 160 }).from;
    v.danhMucHang = u.phuLucEd ? u.phuLucEd.filter((r) => r.sl > 0).map((r, k) => ({ n: k + 1, hang: r.hang, loai: r.chungLoai, dvt: r.dvt, sl: r.sl }))
      : buyItems().map((i, k) => ({ n: k + 1, hang: i.name, loai: goodsName(i.goods), dvt: i.uom, sl: i.buy }));
    /* Review nhi 06/11 #34, #35: nội dung service task AI soạn cho các ô của Tờ trình, kèm nguồn (GIẢ LẬP — mẫu của hồ sơ demo). */
    const aiNv = D.nvOf && D.nvOf((Flow.findDxms(Flow.state.dxms) || {}).nv), aiCc = `Căn cứ ${(basisDoc() || {}).no || ''}`;
    v.suCanThiet = u.necessity != null ? u.necessity : '';
    v.aiTt = {
      mucDich: { value: basicPick('purposeText', D.aiBasic[0].value), nguon: `${aiCc}, thông tin chung của hồ sơ` },
      suCanThiet: { value: d.necessity || '', nguon: `${aiCc}, kết quả rà soát tồn kho` },
      phamVi: { value: basicPick('scope', D.aiBasic[1].value), nguon: `${aiCc}, danh mục bóc tách` },
      phuongPhap: { value: `Đơn giá thấp nhất trong 3 báo giá hợp lệ (${D.quotes.map((q) => nccName(q.ncc)).join(', ')}).`, nguon: 'Tệp báo giá của nhà cung cấp' },
      quanDiem: { value: 'Mua sắm đúng nhu cầu, tận dụng tồn kho hiện có, ưu tiên hàng hóa đáp ứng yêu cầu kỹ thuật với chi phí hợp lý.', nguon: 'Mẫu BM-10.2.1' },
      phuongAn: { value: d.tech || '', nguon: `${aiCc}, yêu cầu kỹ thuật` },
      nguonNganSach: { value: aiNv ? `Dự toán ${aiNv.code}` : 'Theo căn cứ của hồ sơ', nguon: 'Đề tài / dự án của hồ sơ' },
      hieuQua: { value: 'Giảm chi phí thuê ngoài, chủ động tiến độ thực hiện và nâng cao năng lực của đơn vị.', nguon: aiCc },
      bienPhap: { value: basicPick('bienPhap', vv(d.measures) || ''), nguon: 'Quy chế QC-12868' },
      keHoach: { value: basicPick('keHoach', typeof d.plan === 'string' ? d.plan : ''), nguon: `${aiCc}, thời gian thực hiện của hồ sơ` },
    };
    const tot = Flow.ci().total, costs = Object.entries(buyItems().reduce((o, i) => { const k = COST_LBL[i.cost] || 'Chi phí khác'; o[k] = (o[k] || 0) + (i.amount || 0); return o; }, {}));
    v.giaTriTt = `**Tổng kinh phí đề xuất: ${vnd(tot)} VNĐ (đã bao gồm VAT)**
*(Bằng chữ: ${window.UI.inWords(tot)}./.)*` + (costs.length > 1 ? `
Trong đó:
${costs.map(([k, a]) => `- ${k}: ${vnd(a)} VNĐ`).join('\n')}` : '');
    v.tenTt = small() ? 'Tờ trình đề xuất mua sắm (ký trực tiếp)' : 'Tờ trình thẩm định, phê duyệt đề xuất mua sắm';
    v.checklistDs = checklistForm();
    v.aiSuCanThiet = aiRows('aiSuCanThiet', [{ key: 'suCanThiet', muc: 'Sự cần thiết', goiY: d.necessity || '', nguon: `Căn cứ ${(basisDoc() || {}).no || ''}, thông tin cơ bản của hồ sơ` }], null);
    v.aiCheck = u.aiCheck || null;
    v.phuLucChiPhi = D.items.map((i) => ({ n: i.n, hang: i.name, sl: i.buy, donGia: ty(i.price), thanhTien: ty(i.amount), coSo: i.buy ? `Báo giá ${nccName('NCC-000001')}` : 'Dùng tồn kho', loai: i.cost || '' }));
    D.phuLuc.forEach(([k]) => { v['pl_' + k] = plOn(k) ? 'Có' : 'Không'; });
    v.checklist = checklistRows();
    const rej = Flow.lastOf(13);
    v.traLai13 = rej && rej.action === 'Không đồng ý' && Flow.doneCount(draftTask()) === Flow.doneCount(13) ? { lyDo: rej.reason || '', loc: 'Mục “Kế hoạch tổ chức thực hiện” chưa có mốc giao hàng từng lô.' } : null;
    /* Comment #10 — phản hồi từng phần chỉ huy chấm Không đạt (lượt trả lại gần nhất). */
    const nokParts = (u.duyetPhan || []).filter((r) => r.ketQua === 'Không đạt');
    v.phanHoiChiHuy = !v.traLai13 ? [] : (nokParts.length ? nokParts.map((r) => ({ phan: r.phan, chiDao: r.lyDo })) : [{ phan: 'Chung', chiDao: rej.reason || '' }])
      .map((r) => Object.assign(r, { xuLy: 'Đã sửa', giaiTrinh: '' }));

    /* 13 */
    v.tomTat = `**Tên:** ${ci.title}\n**Căn cứ:** ${(basisDoc() || {}).no || ''} · **Giá trị:** ${ty(Flow.ci().total)} tỷ (${v.danhMucHang.length} hạng mục)\n**Nguồn vốn:** ${D.caseInfo.fund} · **Thời gian:** ${D.caseInfo.period} · **Quy trình:** ${proc()}${small() ? ` (${tt()} + ${clName()})` : ''} — khớp giá trị`;
    v.coCauChiPhi = buyItems().map((i) => ({ n: i.n, hang: i.name, thanhTien: ty(i.amount), tyTrong: ty((i.amount / D.caseInfo.total) * 100, 1) + '%' }));
    /* Comment #9 — lịch sử chỉnh sửa theo phần (BE ghi mỗi lần gửi lại sau khi chỉ huy trả lại). */
    const ph = Flow.doneCount(draftTask()) > 1 ? (u.phanHoiChiHuy || []) : [], sent = Flow.lastOf(draftTask());
    v.lichSuSua = ph.map((r) => ({ phienBan: `Lần gửi ${Flow.doneCount(draftTask())}`, phan: r.phan,
      noiDung: r.xuLy === 'Không sửa' ? `Không sửa — giải trình: ${r.giaiTrinh}` : `Đã sửa theo chỉ đạo: ${r.chiDao}`, nguoi: pname('minh'), thoiDiem: sent ? Flow.dateOf(sent.t) : '-' }));
    const nSua = ph.filter((r) => r.xuLy !== 'Không sửa').length;
    v.aiTomTatSua = `${nSua} phần đã sửa theo chỉ đạo, ${ph.length - nSua} phần giữ nguyên có giải trình. Đối chiếu nội dung trước / sau ở tab Lịch sử phiên bản.`;
    /* Review nhi 06/11 #11: mỗi phần hiện đủ nội dung người soạn đã điền ở bước lập dự thảo (chỉ xem), chỉ huy đọc ngay trên form. */
    const nec13 = U().necessity || aiFinal((v.aiSuCanThiet || [])[0]) || '';
    const dash = (x) => (x && String(x).trim() ? x : '—');
    const cl13 = checklistForm(), need13 = cl13.filter((r) => r.yeuCau === 'Bắt buộc'), ok13 = need13.filter((r) => r.tinhTrang === 'Đủ').length;
    const PART_TXT = [
      `- Mục đích: ${dash(v.mucDich)}`,
      `- a) Sự cần thiết phải mua sắm: ${dash(nec13)}
- Hiện trạng tồn kho: ${dash(v.cauTonKho)}
- b) Danh mục hàng hóa, dịch vụ: ${dash(v.phamVi)}
${v.danhMucHang.map((r) => `- ${r.hang} — ${r.sl} ${r.dvt}`).join('\n')}`,
      `- Tổng kinh phí đề xuất: ${vnd(Flow.ci().total)} VNĐ (đã bao gồm VAT)
- Phương pháp tính toán, cơ sở đơn giá: ${dash(v.phuongPhap)}
- Quan điểm thực hiện: ${dash(v.quanDiem)}
- Phương án kỹ thuật – công nghệ: ${dash(v.phuongAn)}`,
      `- Nguồn vốn: ${dash(v.nguonVonTt)}
- Nguồn ngân sách: ${dash(v.nguonNganSach)}
- Thời gian thực hiện mua sắm: ${dash(v.thoiGianTh)}`,
      `- Đánh giá hiệu quả: ${dash(v.hieuQua)}`,
      `- Biện pháp thực hiện: ${dash(v.bienPhap)}
- Kế hoạch tổ chức thực hiện: ${dash(v.keHoach)}`,
      '- Thuyết minh (BM-02) hệ thống sinh từ Tờ trình và phụ lục chi phí — xem ở Văn bản đầu ra.',
      `- ${ok13}/${need13.length} tài liệu bắt buộc đã đủ${need13.length - ok13 ? `; còn thiếu: ${need13.filter((r) => r.tinhTrang !== 'Đủ').map((r) => r.muc).join('; ')}` : ''}
- Phụ lục kèm theo: ${cl13.filter((r) => r.pl && r.kemTheo === 'Có').map((r) => r.muc).join('; ') || 'Không có'}`];
    v.duyetPhan = PARTS().map((p, k) => {
      const g = ph.find((r) => r.phan === p);
      return { phan: p, noiDung: PART_TXT[k] || '', ketQua: 'Đạt', lyDo: '', giaiTrinh: g ? (g.xuLy === 'Không sửa' ? 'Người soạn giải trình: ' + g.giaiTrinh : 'Người soạn: đã sửa theo chỉ đạo') : '' };
    });

    /* 16 */
    const cs = Flow.cqcmSel();
    v.cqcmSel = u.cqcmSel || (small() ? [...new Set(cs.concat(['TC']))] : cs);
    v.cqcmValues = D.cqcm.map((c) => ({ value: c.id, label: c.unit }));
    /* Review nhi 06/11 #40 (GIẢ LẬP P-224): mỗi CQCM chọn Người thẩm định trong danh sách chuyên viên của đơn vị. */
    v.cqcmNguoiDs = D.cqcm.map((c) => ({ value: c.id, donVi: c.unit, chucNang: CQ_FN[c.id] || '', nguoi: Flow.cqcmDoer(c.id), nguoiOpts: (c.doers || [c.doer]).map((p) => ({ value: p, label: pname(p) })) }));
    v.hanGopY = u.hanGopY || Flow.dateOf(Flow.state.clock + 5);
    v.dauMoi = u.dauMoi || 'minh';
    /* Review nhi 06/11 #14, #15: CQCM chọn bằng danh sách thả xuống, các cơ quan đã chọn hiện thành bảng; trường của phiếu BM-03
       (Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS, BM-10.2.1) — trích yếu, căn cứ, nội dung đề nghị, đầu mối (ĐT, email), nơi nhận. GIẢ LẬP P-220. */
    v.cqcmInfo = D.cqcm.map((c) => ({ value: c.id, donVi: c.unit, chucNang: CQ_FN[c.id] || '', nguoi: pname(Flow.cqcmDoer(c.id)) }));
    const ci16 = Flow.ci(), dm16 = D.contactParts(v.dauMoi) || {};
    v.bm03Vv = u.bm03Vv != null ? u.bm03Vv : `V/v đề nghị góp ý dự thảo hồ sơ ĐXMS ${ci16.title}`;
    v.bm03CanCu = u.bm03CanCu != null ? u.bm03CanCu : [legalLines()[0], plainText(basisLine()).replace(/;$/, ',')].filter(Boolean).join('\n');
    v.bm03NoiDung = u.bm03NoiDung != null ? u.bm03NoiDung : `Trên cơ sở ${plainText(basisName())} đã được phê duyệt, ${ci16.unit || ''} đã hoàn thành dự thảo Hồ sơ đề xuất mua sắm ${ci16.title}. Nhằm đảm bảo ĐXMS được lập, thẩm định đúng quy định, đáp ứng tiến độ mua sắm, ${ci16.unit || ''} kính đề nghị các CQCM phối hợp góp ý dự thảo hồ sơ ĐXMS theo chức năng, nhiệm vụ và gửi ý kiến nhận xét, góp ý để hoàn chỉnh nội dung ĐXMS trước ngày hạn góp ý.`;
    /* Review nhi 06/11 #30: bước 16.1 đọc lại nội dung phiếu BM-03. */
    v.dauMoiTen = pname(v.dauMoi);
    v.bm03Tep = u.bm03File ? (typeof u.bm03File === 'string' ? `[${u.bm03File}](dl:${u.bm03File})` : '[BM-03_ky-nhay.pdf](dl:BM-03_ky-nhay.pdf)') : 'Chưa có tệp';
    v.dmDienThoai = u.dmDienThoai != null ? u.dmDienThoai : dm16.dienThoai || '';
    v.dmEmail = u.dmEmail != null ? u.dmEmail : dm16.email || '';
    v.bm03NoiNhan = u.bm03NoiNhan != null ? u.bm03NoiNhan : `Như trên; Lưu: VT, ${unitSign(ci16.unit)}.`;
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
        return { muc: s, danhGia: r.ok ? 'OK' : 'Không OK', nhanXet: r.text || (r.ok ? 'Đạt yêu cầu.' : ''), huongDan: r.guide || '',
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
    const rv = reviewRows();
    v.bm04TrangThai = selCqcm().map((c) => ({ cqcm: c.unit, nguoi: `${persona(c.doer).short} / ${persona(c.signer).short}`, lan: pad2(bm04Round()), ky: signedBy.includes(c.id) ? 'Đã ký' : 'Chưa ký',
      khongOk: opinionsOf(c.id).filter((o) => !o.ok).length, tinhTrang: (rv.find((r) => r.id === c.id) || {}).st || '-', soNgay: (rv.find((r) => r.id === c.id) || {}).days || '-' }));
    const hx = u.huongXuLy || {}, ykId = (o) => `${o.cqcm}|${o.sec}`;
    v.quyetDinhYKien = nok().map((o) => ({ id: ykId(o), cqcm: o.cqcm, cqcmTen: cqcmUnit(o.cqcm), muc: o.sec, yKien: o.text, quyetDinh: respOf(o.cqcm), huongXuLy: hx[ykId(o)] || '' }));
    v.vongGiaiTrinh = Flow.state.vars.round;
    /* Comment #13, #15 — AI đồng bộ ý kiến các CQCM theo mục BM-01 (service task 25). */
    const bySec = {};
    nok().forEach((o) => { (bySec[o.sec] = bySec[o.sec] || []).push(o); });
    v.aiDongBo = Object.entries(bySec).map(([sec, l]) => `- **${sec}** (${l.map((o) => cqcmUnit(o.cqcm)).join(', ')}): ${l.map((o) => o.guide || o.text).join(' ')}${l.length > 1 ? ' — các cơ quan cùng yêu cầu, sửa một lần cho cả hai.' : ''}`).join('\n')
      || '- Không có ý kiến cần sửa.';
    /* Góp ý 06/11 — gợi ý AI theo từng ý kiến cho popup ✦ Gợi ý từ AI (bước 26). GIẢ LẬP: quyết định gợi ý = dự thảo phản hồi của đơn vị
       (D.responses); Đồng ý sửa → hướng sửa đã gộp theo mục BM-01, Không đồng ý → dự thảo giải trình. */
    v.aiXungDot = 'Không có xung đột — không có cặp ý kiến mâu thuẫn giữa các CQCM trên cùng một mục của BM-01.';
    v.aiYKien = nok().map((o) => {
      const r = D.responses[o.cqcm] || {}, d = r.decision || 'Tiếp thu', same = (bySec[o.sec] || []).filter((x) => x.cqcm !== o.cqcm);
      const fix = `${o.guide || o.text}${same.length ? ` (trùng mục với ${same.map((x) => cqcmUnit(x.cqcm)).join(', ')} — sửa một lần cho cả hai)` : ''}`;
      return { id: ykId(o), cqcmTen: cqcmUnit(o.cqcm), muc: o.sec, yKien: o.text, quyetDinh: d,
        huongXuLy: d === 'Bảo lưu' ? r.keepText || r.text || '' : fix, nguon: `BM-04 của ${cqcmUnit(o.cqcm)} · ${o.sec}${d === 'Bảo lưu' && r.ref ? ` · ${r.ref}` : ''}` };
    });

    /* 27 / 28 */
    const accepted = Flow.state.vars.round > 0 ? selCqcm().filter((c) => respOf(c.id) === 'Bảo lưu') : [];
    v.viecCanSua = nok().filter((o) => respOf(o.cqcm) === 'Tiếp thu').map((o) => `- ${o.sec}: ${hx[ykId(o)] || o.guide || o.text}`)
      .concat(accepted.map((c) => `- ${c.unit} đã chấp nhận giải trình: ghi chú làm rõ trong hồ sơ.`)).join('\n');
    const savedGt = u.giaiTrinh || [];
    v.giaiTrinh = nok().map((o, i) => {
      const dd = respOf(o.cqcm), r = D.responses[o.cqcm] || {}, sv = savedGt.find((x) => x.cqcm === o.cqcm && x.muc === o.sec);
      return { cqcm: o.cqcm, muc: o.sec, yKien: `${cqcmUnit(o.cqcm)} · ${o.sec}: ${o.text}`, quyetDinh: dd, noiDung: sv ? sv.noiDung : (dd === 'Bảo lưu' && (hx[ykId(o)] || r.keepText)) || r.text || '', thamChieu: r.ref || '' };
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

  /* Biến riêng của hồ sơ KĐT (MS13). */
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
    v.hieuQuaK = u.hieuQuaK != null ? u.hieuQuaK : dd.effect || '';
    v.yKienChiHuy = u.yKienChiHuy != null ? u.yKienChiHuy : R().lead || '';
    v.nguoiChoYKien = `${pname('hai')} — Chỉ huy đơn vị đề xuất`;
    /* 36 / 39 — "Sự cần thiết" của BM-01 theo gợi ý AI (DX-01: thiếu thì AI kiểm tra trả lại ở bước 39) */
    v.aiSuCanThietK = aiRows('aiSuCanThietK', [{ key: 'suCanThiet', muc: 'Sự cần thiết (mục 4.2)', goiY: dd.necessity || '', nguon: `Căn cứ ${(basisDoc() || {}).no || ''}, nhu cầu trong đề xuất` }], kNeed() ? 'Chấp nhận' : null);
    v.phuLucDanhMuc = buyItems().map((i) => ({ n: i.n, hang: i.name, sl: `${i.buy} ${i.uom}`, donGia: ty(i.price), thanhTien: ty(i.amount), loai: i.cost || '' }));
    v.checklist01 = kdtChecklist(1);
    v.checklist02 = kdtChecklist(2);
    v.ketLuanCl = u.ketLuanCl || (n === 51 ? 'Hồ sơ đảm bảo đủ điều kiện trình thẩm định, phê duyệt KĐT.' : 'Hồ sơ đảm bảo đủ điều kiện trình thẩm định, phê duyệt chủ trương KĐT.');
    /* 22 / 41 / 52 chọn CQCM — 23 / 42 / 53 CQCM chủ trì xác nhận danh sách (Không đồng ý → quay lại chọn) */
    const conf = { 22: 23, 41: 42, 52: 53 }[n], bc = conf && Flow.lastOf(conf);
    v.traLaiDs = bc && /^Không đồng ý/.test(bc.action) && lastIdx(conf) > lastIdx(n) ? { lyDo: bc.reason || '' } : null;
    v.yKienLead = n === 22 && Flow.lastOf(21) ? `Ý kiến Chỉ huy ĐVĐX (${pname('hai')}): “${R().lead || ''}”` : '';
    v.chuTri = `**Cơ quan chủ trì:** Trung tâm Mua sắm (TTMS) · **Người xử lý:** ${pname('lan')}`;
    v.cqcmValuesK = D.cqcm.map((c) => ({ value: c.id, label: `${c.unit} — ${CQ_FN[c.id] || ''} · ${pname(c.doer)}` }));
    v.cqcmSel = u.cqcmSel || cs;
    v.host = hostOf() || null;
    v.canDonViChuTri = needHost();
    v.loaiKdt = catName('loai-kdt', k.type);
    v.dsDauMoi = [{ ma: 'TTMS', nguoi: pname('lan'), vaiTro: 'Cơ quan chủ trì thẩm định', donVi: 'Trung tâm Mua sắm (TTMS)' }]
      .concat(D.cqcm.map((c) => ({ ma: c.id, nguoi: pname(c.doer), vaiTro: 'CQCM phối hợp', donVi: c.unit })));
    v.aiCheckK = u.aiCheckK || null;
    v.dsCqcm = selCqcm().map((c) => ({ donVi: c.unit, chucNang: CQ_FN[c.id] || '', nguoi: pname(c.doer) }));
    v.hostTen = needHost() ? hostOf() || 'Chưa chọn' : `Không áp dụng (${catName('loai-kdt', k.type)})`;
    /* 13 — thẩm quyền phê duyệt (service task, D-33): kết quả gần nhất; chưa qua bước 13 thì tính thử theo dữ liệu hiện tại */
    const cap = Flow.state.vars.cap || D.kdtAuthOf(Flow.state.vars.factors || { type: k.type, field: k.field }, total, Flow.state.vars.auth);
    v.thamQuyen = `**Phê duyệt chủ trương:** ${D.kdtLevels[cap.ct]} · **Phê duyệt KĐT:** ${D.kdtLevels[cap.kdt]} · **Căn cứ:** ${cap.basis}`;
    /* 76–78 — khối ký chung (D-34): lần ký đang đi qua khối (vars.ky) */
    const ky = Flow.state.vars.ky;
    if (ky) {
      v.kyChung = `**Văn bản:** ${ky.doc} (phiên bản v${kdtVer()}) · **Bước ký:** ${ky.task}. ${Flow.taskName(ky.task)}\n**Người ký:** ${pname(ky.signer)} · **Hình thức ký:** ${ky.mode === 'hard' ? 'Bản cứng' : 'VOffice'}${ky.mat ? ' — hồ sơ Mật, bắt buộc bản cứng' : ''}`;
      v.trangThaiKy = u.trangThaiKy || 'Đã ký';
    }
    v.kyLichSu = (Flow.state.vars.kyLog || []).map((x) => ({ buoc: `${x.task}. ${Flow.taskName(x.task)}`, vanBan: x.doc, hinhThuc: x.mode === 'hard' ? 'Bản cứng' : 'VOffice', luc: Flow.dateOf(x.t) }));
    /* 24 — Chỉ huy ĐVĐX ký phiếu yêu cầu thẩm định (mở vòng hồ sơ gộp) */
    const s24 = signOf(24);
    v.kyPhieu = [signRowV('hai', 'Chỉ huy đơn vị đề xuất', s24.st, s24.at)];
    /* 27 / 29 — thẩm định theo lượt */
    const open27 = n === 27, i = rvIdx(open27);
    v.luot = pad2(i + 1);
    v.giaiDoan = stg();
    v.demVong = counters();
    if (n === 27) {
      const lastIn = Flow.state.history.filter((h) => h.who && (h.td || 'GOP') === tdKey() && ['26', '31', '36'].includes(String(h.task))).pop();
      v.banner27 = !lastIn ? '' : { 36: `Hồ sơ đã cập nhật theo nội dung đã thống nhất sau họp (phiên bản v${kdtVer()}).`, 26: 'Đơn vị đề xuất đã sửa hồ sơ theo kết quả kiểm tra điều kiện thẩm định.',
        31: `Đơn vị đề xuất đã bổ sung hồ sơ theo ý kiến lượt ${pad2(i)} (phiên bản v${kdtVer()}).` }[String(lastIn.task)];
      v.raSoat = `**${stg().doc}:** phiên bản v${kdtVer()}${stg().cl ? ` · ${stg().cl} đủ` : ''} · **Đơn vị chủ trì:** ${hostOf() || '-'}\n**CQCM phối hợp:** ${cs.map(cqcmUnit).join('; ') || 'Không chọn'}\n`
        + [['TC', 'Có danh mục hình thành TSCĐ → cần Ban Tài chính'], ['PC', 'Áp dụng Quy chế LCNT → cần Ban Pháp chế']].map(([id, t]) => `- ${t}: **${cs.includes(id) ? 'có' : 'chưa có'}**`).join('\n');
      /* T31 B4 (BR-KDT-08-04): ý kiến mẫu cần sửa của TTMS → nội dung tương ứng Không đạt kèm nhận xét, hướng dẫn; còn lại Đạt. */
      const tf = fixOf(i, 'TTMS'), ti = rvOf(i, 'TTMS').items || [];
      v.thamDinh = stg().crit.map((c, j) => { const x = tf && ti.find((y) => c.startsWith(y[0]));
        return { stt: j + 1, noiDung: c, danhGia: x ? 'Không đạt' : 'Đạt', nhanXet: x ? x[1] : '', huongDan: x ? x[2] || '' : '' }; });
      if (tf && ti.length && !v.thamDinh.some((r) => r.danhGia === 'Không đạt')) Object.assign(v.thamDinh[0], { danhGia: 'Không đạt', nhanXet: ti[0][1], huongDan: ti[0][2] || '' });
      v.nhanXetTtms = ti.filter((x) => !tf || !stg().crit.some((c) => c.startsWith(x[0]))).map((x) => `${x[0]}: ${x[1]}`).join(' ');
      v.ketLuanTd = v.thamDinh.some((r) => r.danhGia === 'Không đạt') ? 'Cần sửa đổi, giải trình' : 'Đạt';
      v.yKienTruoc = Array.from({ length: i }, (_, j) => fixItems(j).map((x) => ({ luot: pad2(j + 1), donVi: unitOf(x.id), noiDung: x.text, traLoi: (R().reply || [])[j] || '' }))).flat();
    }
    if (n === 29 && tok.cqcm) {
      const c = tok.cqcm;
      v.cqcmTen = cqcmUnit(c);
      v.aiPhanHoi = `- Đối chiếu ${stg().doc} v${kdtVer()} với chức năng ${cqcmUnit(c)}: ${CQ_FN[c] || ''}.` + (i > 0 ? `\n- Lượt trước: ${fixOf(i - 1, c) ? 'có ý kiến cần sửa — kiểm tra nội dung đơn vị đã bổ sung / giải trình.' : 'không có ý kiến.'}` : '');
      v.phieuNhanXet = (rvOf(i, c).items || []).map((x) => ({ muc: x[0], nhanXet: x[1], huongDan: x[2] || '' }));
      v.ketLuanTd = fixOf(i, c) ? 'Cần sửa đổi, giải trình' : 'Đạt';
    }
    /* 26 / 31 / 32 / 34–38 / 59 */
    const ip = rvIdx(false), chk = Flow.tdCount('chk'), meet = Flow.tdCount('meet'), pend = fixItems(ip);
    const b57 = Flow.lastOf(57);
    v.goiYSua = n === 59 ? `- TTMS: “${(b57 && b57.reason) || ''}”\n- Cập nhật Tờ trình BM-03 và Phụ lục thuyết minh theo hướng dẫn; bổ sung tài liệu vào Checklist 02.`
      : `- Kiểm tra điều kiện thẩm định: ${stg().doc} chưa đủ điều kiện — thiếu tài liệu bắt buộc${stg().cl ? ` theo ${stg().cl}` : ''}.\n- Bổ sung tài liệu còn thiếu, cập nhật hồ sơ; sau đó chọn lại CQCM và gửi lại.`;
    v.hoSoGd = `**${stg().doc}:** phiên bản v${kdtVer()}${stg().cl ? ` · **${stg().cl}:** đủ` : ''}${n === 59 ? ` · tạo phiên bản v${kdtVer() + 1} khi gửi` : ''}`;
    v.chiDao = Flow.state.vars.directed && Flow.lastOf(38) ? `Kết luận của Tổng Giám đốc: “${Flow.lastOf(38).reason || ''}”` : '';
    v.aiTongHop = pend.map((x) => `- **${unitOf(x.id)} · ${x.sec}:** ${x.guide || x.text}`).join('\n');
    v.soNoiDung = pend.length;
    const savedTl = u.traLoi || [];
    v.traLoi = pend.map((x) => ({ donVi: unitOf(x.id), muc: x.sec, yKien: x.text, traLoi: ((savedTl.find((s) => s.donVi === unitOf(x.id) && s.muc === x.sec) || {}).traLoi) ?? ((R().reply || [])[Math.min(chk, (R().reply || [1]).length - 1)] || '') }));
    v.noiDungChuaTn = pend.map((x) => ({ donVi: unitOf(x.id), muc: x.sec, yKien: x.text, traLoi: (R().reply || [])[Math.max(0, chk - 1)] || '' }));
    v.lanHop = meet + 1; v.soVongCheck = chk; v.soLanHop = meet;
    v.ketLuanHop = u.ketLuanHop != null ? u.ketLuanHop : m.result || '';
    v.dieuChinh = (m.changes || []).map((c) => ({ noiDung: c[0], truoc: c[1], sau: c[2] }));
    const a34 = Flow.doneCount(34) > Flow.doneCount(36), st = (done, opn) => (done ? 'Đã xác nhận' : opn ? 'Chờ xác nhận' : 'Chưa đến lượt');
    v.xacNhanSauHop = [{ nguoi: pname('minh'), vaiTro: 'Chuyên quản ĐVĐX', trangThai: st(a34, n === 34) }, { nguoi: pname('hai'), vaiTro: 'Chỉ huy ĐVĐX', trangThai: st(false, n === 35) }];
    v.bienBan = Array.from({ length: meet }, (_, j) => `- Bien-ban-hop-lan-${j + 1}-${fileCode()}.pdf`).join('\n') || '- (chưa có)';
    v.ketLuanTt = u.ketLuanTt != null ? u.ketLuanTt : 'Chấp nhận ý kiến Ban Tài chính; đơn vị đề xuất tách phần hiệu chuẩn định kỳ khỏi giá trị TSCĐ và hoàn chỉnh hồ sơ.';
    /* 50 — quay lại sau 57 (báo cáo chưa thông qua → 58 → 59) hoặc 60 (TGĐ VHT không ký BM-18) */
    const hi = Flow.state.history.map((x) => String(x.task)), b60 = Flow.lastOf(60);
    v.traLai57 = hi.lastIndexOf('59') > hi.lastIndexOf('50') ? `Báo cáo thẩm định chưa được thông qua: “${(b57 || {}).reason || ''}” — hoàn chỉnh hồ sơ theo hướng dẫn.`
      : b60 && /^Không/.test(b60.action) && hi.lastIndexOf('60') > hi.lastIndexOf('50') ? `Tổng Giám đốc không ký Quyết định: “${b60.reason || ''}” — sửa Tờ trình BM-03.` : '';
    v.keThua = [['Tên, phân loại, lĩnh vực KĐT', 'BM-01 mục 1–3'], ['Mục tiêu, sự cần thiết', 'BM-01 mục 4.1, 4.2'], ['Tổng mức vốn, cơ cấu chi phí', 'BM-01 mục 5 (cập nhật sau họp)'],
      ['Nguồn vốn, thời gian thực hiện', 'BM-01 mục 6'], ['Tổ chức thực hiện, đơn vị chủ trì', `BM-01 mục II${hostOf() ? ' · ' + hostOf() : ''}`]].map(([noiDung, tu]) => ({ noiDung, tu, trangThai: 'Đã điền' }));
    const ct = ctSigned();
    v.chuTruong = `Chủ trương BM-01 ${b3().ctNo || ''} — Thủ trưởng ký duyệt${ct.at ? ' ngày ' + ct.at : ''}.`;
    v.hienTrang = u.hienTrang != null ? u.hienTrang : b3().state || '';
    v.ruiRo = u.ruiRo != null ? u.ruiRo : b3().risk || '';
    v.diaDiem = u.diaDiem != null ? u.diaDiem : b3().place || '';
    /* T31 B3 (K4b): mục BM-8.6.5 bổ sung ở bước 50 — mặc định từ chủ trương đã duyệt / dữ liệu hồ sơ (GIẢ LẬP). */
    const dflt = (k, d) => (u[k] != null ? u[k] : d || '');
    v.phanTichNhuCau = dflt('phanTichNhuCau', dd.need || aiText('scope'));
    v.ketLuanCanThiet = dflt('ketLuanCanThiet', dd.necessity);
    v.quanDiem = dflt('quanDiem', dd.view);
    v.phuongAnTk = dflt('phuongAnTk', dd.tech);
    v.giaiPhap = dflt('giaiPhap', dd.deploy);
    v.phuongPhapTinh = dflt('phuongPhapTinh', dd.method);
    v.danhGiaHieuQua = dflt('danhGiaHieuQua', dd.effect);
    v.toChucTh = dflt('toChucTh', dd.org);
    v.cacMoc = dflt('cacMoc', (b3().milestones || []).map(([a, b]) => `${a}: ${b}`).join('\n'));
    /* 46 / 55 — ý kiến đã xử lý trong vòng (chỉ xem) */
    v.yKienVong = Array.from({ length: Flow.tdRound() }, (_, j) => fixItems(j).map((x) => ({ luot: pad2(j + 1), donVi: unitOf(x.id), noiDung: x.text, traLoi: (R().reply || [])[j] || '' }))).flat();
    v.hoanChinhTd = u.hoanChinhTd != null ? u.hoanChinhTd : '';
    /* 47 / 48 / 56 / 57 / 60 / 61 / 62 */
    v.ketQuaTd = `**Kết luận:** CQCM thống nhất, không còn ý kiến cần sửa · **Hồ sơ:** ${stg().doc} v${kdtVer()}\n**Vòng check:** ${chk}/2 · **Số lần họp:** ${meet}/2 · **CQCM phối hợp:** ${cs.map(cqcmUnit).join('; ') || '-'}\n${v.thamQuyen}`;
    const sent43 = Flow.lastOf(43), a = signOf(47), b = signOf(48);
    v.kyBm01 = [{ nguoiKy: pname('minh'), tuCach: 'Đơn vị đề xuất', trangThai: sent43 ? 'Đã trình' : 'Chưa trình', thoiDiem: sent43 ? Flow.dateOf(sent43.t) : '-' },
      signRowV('lan', 'Cơ quan chủ trì thẩm định (TTMS)', a.st, a.at), { nguoiKy: '-', tuCach: 'Phó TGĐ phụ trách (nếu có)', trangThai: 'Không có', thoiDiem: '-' },
      signRowV('tgd', 'Người có thẩm quyền — ô PHÊ DUYỆT', b.st, b.at)];
    const s56 = signOf(56), s57 = signOf(57), s60 = signOf(60);
    v.kyBm03 = [signRowV('hai', 'Chỉ huy đơn vị đề xuất — Tờ trình BM-03', s56.st, s56.at)];
    v.kyBm18 = [signRowV('hai', 'Chỉ huy đơn vị đề xuất — Tờ trình BM-03', s56.st, s56.at), signRowV('lan', 'Cơ quan chủ trì thẩm định — BM-14', s57.st, s57.at),
      signRowV('tgd', 'Người có thẩm quyền — Quyết định BM-18', s60.st, s60.at)];
    const s61 = signOf(61), s62 = signOf(62);
    v.kyBm00 = [signRowV('hai', 'Chỉ huy đơn vị đề xuất — Phiếu yêu cầu thẩm định', s24.st, s24.at), signRowV('lan', 'Cơ quan chủ trì thẩm định — BM-14', s61.st, s61.at),
      signRowV('tgd', 'Người có thẩm quyền — ô PHÊ DUYỆT', s62.st, s62.at)];
    /* 63–74 — tuyến Tập đoàn (T18 B4) */
    const K = tdk(), cap2 = Flow.state.vars.cap || cap, at = (t) => { const h = Flow.lastOf(t); return h && h.who ? Flow.dateOf(h.t) : null; };
    v.tdHoSo = `**Hồ sơ trình Tập đoàn:** ${K.title} — ${K.doc} (phiên bản v${kdtVer()}) · **Phiếu nhận xét của Tập đoàn:** ${K.cq}\n**Thẩm quyền:** chủ trương ${D.kdtLevels[cap2.ct]}, KĐT ${D.kdtLevels[cap2.kdt]} (${cap2.basis}) — VHT ký trình, không phê duyệt thay Tập đoàn.`;
    v.boHoSoTd = [['Công văn trình Tập đoàn', Flow.lastOf(63) ? 'AI dự thảo (bước 63), đơn vị đề xuất hoàn thiện' : 'Chưa dự thảo'],
      [`${K.doc} (dự thảo)`, `Đã thẩm định nội bộ — vòng ${KDT_TD_NAME[Flow.state.vars.td || 'CT']}`]]
      .concat(K.code === 'BM-00' ? [] : [[K.code === 'BM-01' ? 'Checklist 01' : 'Checklist 02', 'Đủ']])
      .concat([['Ý kiến thẩm định của TTMS và CQCM', `${Flow.tdRound()} lượt, ${Flow.tdCount('meet')} lần họp`], [`Căn cứ ${(basisDoc() || {}).no || ''}`, 'Danh sách tài liệu']])
      .map(([tl, tt]) => ({ taiLieu: tl, tinhTrang: tt }));
    v.trichYeuCv = u.trichYeuCv != null ? u.trichYeuCv : `V/v đề nghị Tập đoàn xem xét, phê duyệt ${{ 'BM-01': 'chủ trương', 'BM-00': 'chủ trương và', 'BM-03': '' }[K.code]} khoản đầu tư ${k.title || ''}`.replace(/\s+/g, ' ');
    v.noiDungCv = u.noiDungCv != null ? u.noiDungCv : `VHT đã tổ chức thẩm định nội bộ ${K.doc}, tổng mức vốn ${ty(total)} tỷ đồng. Theo phân cấp tại ${cap2.basis}, hồ sơ thuộc thẩm quyền phê duyệt của Tập đoàn; VHT kính trình Tập đoàn xem xét, cho ý kiến và phê duyệt.`;
    const s65 = signOf(65), s69 = signOf(69), s73 = signOf(73);
    v.kyCv = [signRowV('minh', 'Đơn vị đề xuất — hoàn thiện công văn', at(64) ? 'Đã trình' : 'Chưa trình', at(64)), signRowV('tgd', 'TGĐ VHT — ký công văn trình', s65.st, s65.at)];
    v.phieuTd = TD_REVIEW.map(([ban, muc, nhanXet, yeuCau]) => ({ ban, muc, nhanXet, yeuCau }));
    v.phieuTdTen = `Phiếu nhận xét ${K.cq} của các Ban chuyên môn Tập đoàn${at(67) ? ' — nhận ' + at(67) : ''}`;
    const savedGt = u.giaiTrinhTd || [];
    v.giaiTrinhTd = TD_REVIEW.map(([ban, muc, nhanXet], j) => ({ ban, muc, nhanXet, traLoi: ((savedGt.find((x) => x.ban === ban && x.muc === muc) || {}).traLoi) ?? TD_REPLY[j] }));
    const b70 = Flow.lastOf(70), b73 = Flow.lastOf(73), i68 = lastIdx(68);
    v.traLaiTd = b73 && /^Không/.test(b73.action) && lastIdx(73) > i68 ? `TGĐ Tập đoàn yêu cầu sửa: “${b73.reason || ''}” — tiếp thu, hoàn thiện hồ sơ rồi trình ký lại.`
      : b70 && /^Chưa đạt/.test(b70.action) && lastIdx(70) > i68 ? `Ban ĐTXD Tập đoàn yêu cầu bổ sung: “${b70.reason || ''}” — hoàn thiện hồ sơ rồi trình ký lại.` : '';
    v.kyBm06 = [signRowV('minh', 'Đơn vị đề xuất — báo cáo giải trình BM-06', at(68) ? 'Đã trình' : 'Chưa trình', at(68)),
      signRowV('tgd', 'TGĐ VHT / lãnh đạo được ủy quyền — ký trình lại', s69.st, s69.at)];
    v.ketLuanKt = u.ketLuanKt != null ? u.ketLuanKt : 'Hồ sơ đã tiếp thu đủ ý kiến các Ban; báo cáo giải trình BM-06 rõ ràng.';
    v.chanKyBan = ['Ban Khoa học Công nghệ', 'Ban Tài chính', 'Ban Pháp chế', 'Ban Đầu tư – Xây dựng'].map((b) => ({ ban: b, noiDung: 'Ký chân trang Tờ trình BM-01', trangThai: at(71) || n === 73 ? 'Đã ký' : 'Chờ ký' }));
    v.tdLapBc = `**Cơ quan chủ trì thẩm định:** Ban Đầu tư – Xây dựng Tập đoàn · **Hồ sơ:** ${K.doc} v${kdtVer()} · **Báo cáo giải trình:** BM-06 (VHT ký trình lại ${s69.at || '-'})`;
    const prep = K.code === 'BM-01' ? 71 : 72;
    v.kyTd = [{ nguoiKy: 'Ban Đầu tư – Xây dựng Tập đoàn', tuCach: K.code === 'BM-01' ? 'Hoàn thiện hồ sơ, chân ký các Ban (bước 71)' : 'Ký báo cáo thẩm định BM-14 (bước 72)',
      trangThai: at(prep) ? 'Đã ký' : 'Chưa ký', thoiDiem: at(prep) || '-' },
      { nguoiKy: 'Tổng Giám đốc Tập đoàn', tuCach: K.code === 'BM-01' ? 'Ký trực tiếp Tờ trình BM-01' : 'Ký ban hành Quyết định BM-18', trangThai: s73.st, thoiDiem: s73.at || '-' }];
    v.tdTraVe = `**Văn bản Tập đoàn ký:** ${K.code === 'BM-01' ? 'BM-01 có chân ký các Ban' : `BM-14 + BM-18${K.code === 'BM-00' ? ' (kèm BM-00)' : ''}`} · **Kết quả nhận ở bước 74:** VOffice → PDF tự động; bản cứng → bản scan.`;
    return v;
  }

  /* ---------- Văn bản đầu ra: mẫu Word + dữ liệu eForm → xem trước PDF (L4) ---------- */
  const docSec = (no, title, inner, req) => `<div class="doc-sec"><h4>${no}. ${title}${req ? ' <span class="req">*</span>' : ''}</h4>${inner}</div>`;
  const P = (s) => `<p>${esc(s || '')}</p>`;
  const buyList = () => `<p>${buyItems().map((i) => `${esc(i.name)} (${i.buy} ${esc(i.uom)})`).join('; ')}.</p>`;
  const moneyText = (t) => `<p>${vnd(t)} đồng (${ty(t)} tỷ đồng), đã bao gồm VAT.</p>`;
  const missing = '<p class="missing">Chưa có nội dung.</p>';

  /* T29 B17: phụ lục chọn Có (P-212) — in ở mục Danh mục hồ sơ kèm theo của Tờ trình. */
  const plList = () => D.phuLuc.filter(([k]) => plOn(k)).map(([, n]) => n);

  /* Review nhi 06/11 #37 (thay mẫu cũ HT-DXMS-TT của T29 B17): tệp Word = đúng văn bản đang xem trước theo BM-01 / BM-09 (BM-10.2.1).
     Thật: BE trộn mẫu .docx (TTMS tải lên ở Quản lý biểu mẫu) với biến eForm — cùng cơ chế xem trước (ProfileTaskFormService). Prototype: HTML lưu đuôi .doc (Word mở được). */
  function wordOf(html) {
    const css = 'body{font-family:"Times New Roman";font-size:13pt}p{margin:0 0 6pt;text-align:justify}.c{text-align:center}.b,.h,.h2{font-weight:bold}.i{font-style:italic}.ph{color:#666;font-style:italic}.ind,.ind2,.li{margin-left:12pt}table{width:100%;border-collapse:collapse}table.dh td,table.df td{vertical-align:top;width:50%}.dh-l,.dh-r,.df-r,.sg{text-align:center}table.dt th,table.dt td{border:1px solid #000;padding:3pt 5pt}.r{text-align:right}';
    return { name: `${tt()}_To-trinh_${Flow.state.code || 'du-thao'}.doc`,
      html: `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Tờ trình</title><style>${css}</style></head><body>${html || ''}</body></html>` };
  }

  /* ---------- Văn bản theo bộ biểu mẫu BM-10.2.1 (Hướng dẫn biểu mẫu hồ sơ trình thẩm định, phê duyệt ĐXMS — Word gốc "Bieu mau (5).docx") ----------
     Bố cục giữ đúng mẫu: đầu văn bản hai cột (cơ quan chủ quản / đơn vị – Quốc hiệu), tên văn bản, Kính gửi, căn cứ, nội dung theo mục của mẫu,
     Nơi nhận – chữ ký. Ô có dữ liệu trên hệ thống điền từ eForm / Thông tin chung; ô chưa có dữ liệu để "…" (in nghiêng xám) cho người soạn điền trên Word.
     Thật: BE trộn mẫu .docx (TTMS tải lên ở Quản lý biểu mẫu) với biến eForm — prototype dựng HTML cùng bố cục. */
  /* Câu chữ văn bản (đã esc để in HTML) → văn bản thuần cho ô nhập / khối chỉ xem của eForm. */
  const plainText = (x) => String(x).replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const ORG = 'TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL';
  const PH = (s) => `<span class="ph">${esc(s || '…')}</span>`;
  const T_ = (s) => (s ? esc(s).replace(/\n/g, '<br>') : PH());
  const vnDate = (t) => { if (t == null) return 'ngày … tháng … năm 20…'; const [d, m, y] = Flow.dateOf(t).split('/'); return `ngày ${d} tháng ${m} năm ${y}`; };
  const unitSign = (u) => (u || '').split(/\s+/).map((w) => w[0]).join('').toUpperCase();
  const doneAt = (task) => { const h = Flow.lastOf(task); return h && h.who ? h.t : null; };
  /* Số, ngày Tờ trình cấp khi gửi yêu cầu thẩm định (bước 18) — cùng cách với Thông tin chung của SCR-20 (GIẢ LẬP P-192). */
  const ttNo = () => (Flow.lastOf(18) ? `${Flow.ci().code.slice(-3)}/TTr-${unitSign(Flow.ci().unit)}` : '……/TTr-' + unitSign(Flow.ci().unit));
  function docHead(o) {
    return `<table class="dh"><tr><td class="dh-l"><div>${ORG}</div><div class="b">${esc((o.unit || Flow.ci().unit || '').toUpperCase())}</div><div class="dh-rule"></div>
        <div>Số: ${esc(o.no)}</div>${o.vv ? `<div class="dh-vv">${o.vv}</div>` : ''}${o.approve || ''}</td>
      <td class="dh-r"><div class="b">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div><div class="b">Độc lập - Tự do - Hạnh phúc</div><div class="dh-rule"></div>
        <div class="i">Hà Nội, ${vnDate(o.at)}</div></td></tr></table>`;
  }
  /* Ô chữ ký: chức danh, dấu "Đã ký" khi bước ký / duyệt trên luồng đã xong, họ tên. */
  const stamp = (sg) => (sg && sg.st === 'Đã ký' ? `<span class="stamp">Đã ký${sg.at ? ' · ' + esc(sg.at) : ''}</span>` : '');
  const signBox = (title, who, sg, sub) => `<div class="sg"><div class="b">${title}</div>${sub ? `<div class="i">${sub}</div>` : ''}
    <div class="sg-st">${stamp(sg)}</div><div class="b">${who ? esc(pname(who)) : ''}</div></div>`;
  const docFoot = (sign, luu) => `<table class="df"><tr><td class="df-l"><b><i>Nơi nhận:</i></b><br>- Như trên;<br>- Lưu: VT, ${esc(luu || unitSign(Flow.ci().unit))}.</td><td class="df-r">${sign}</td></tr></table>`;
  const legalLines = () => { const x = Flow.findDxms(Flow.state.dxms) || {}; return (x.legal || D.legalDefault.join('\n')).split('\n').filter((s) => s.trim()); };
  const basisLine = () => { const b = basisDoc(); return b ? `Căn cứ Quyết định số ${esc(b.no)} ngày ${esc(b.date)} ${esc(b.title.replace(/^Phê duyệt/, 'phê duyệt'))};` : `Căn cứ ${PH('[Tên tài liệu đầu vào]')};`; };
  const basisName = () => { const b = basisDoc(); return b ? `Quyết định số ${esc(b.no)}` : PH('[Tên tài liệu đầu vào]'); };
  const COST_LBL = { 'Hàng hoá': 'Chi phí mua sắm hàng hóa kinh doanh', CCDC: 'Chi phí mua sắm CCDC', 'Chi phí SXKD': 'Chi phí sản xuất kinh doanh', 'TSCĐ': 'Chi phí mua sắm tài sản cố định' };
  const period2 = (p) => { const m = String(p || '').match(/(\d{2}\/\d{4})\s*[–-]\s*(\d{2}\/\d{4})/); return m ? `Từ tháng ${m[1]} đến tháng ${m[2]}` : (p ? esc(p) : 'Từ tháng …/… đến tháng …/…'); };
  const goodsTable = () => `<table class="dt"><tr><th class="c" style="width:40px">TT</th><th>Tên hàng hóa, dịch vụ</th><th style="width:160px">Chủng loại</th><th class="c" style="width:80px">ĐVT</th><th class="r" style="width:80px">Số lượng</th></tr>
    ${((U().phuLucEd || []).length ? U().phuLucEd.filter((r) => r.sl > 0).map((r) => ({ name: r.hang, kind: r.chungLoai, uom: r.dvt, buy: r.sl })) : buyItems().map((i) => ({ name: i.name, kind: goodsName(i.goods), uom: i.uom, buy: i.buy })))
      .map((i, k) => `<tr><td class="c">${k + 1}</td><td>${esc(i.name)}</td><td>${esc(i.kind)}</td><td class="c">${esc(i.uom)}</td><td class="r">${i.buy}</td></tr>`).join('')}</table>`;

  /* BM-01 Tờ trình thẩm định, phê duyệt ĐXMS (≥ 160 tỷ) / BM-09 Tờ trình ĐXMS ký trực tiếp (< 160 tỷ, P-19): mục 1–6 của mẫu, lấy từ eForm bước 11 / 12. */
  function docTt() {
    const v = of({ task: draftTask() }), ci = Flow.ci(), s = small() ? bm09Signs() : null, total = U().tongTt != null ? U().tongTt : ci.total;
    const nec = U().necessity || aiFinal((v.aiSuCanThiet || [])[0]) || (Flow.taskStatus(draftTask()) !== 'todo' ? (R().doc || {}).necessity : '');
    const name = esc(ci.title), unit = esc(ci.unit || ''), boss = 'Tổng Giám đốc';
    /* Review nhi 06/11 #36: Tờ trình theo Phụ lục chi phí đã sửa ở bước lập dự thảo (đang nhập hoặc đã lưu). */
    const costs = Object.entries((U().phuLucEd || []).length
      ? U().phuLucEd.reduce((o, r) => { const k = COST_LBL[r.loai] || 'Chi phí khác'; o[k] = (o[k] || 0) + (r.sl || 0) * (r.donGia || 0); return o; }, {})
      : buyItems().reduce((o, i) => { const k = COST_LBL[i.cost] || 'Chi phí khác'; o[k] = (o[k] || 0) + (i.amount || 0); return o; }, {}));
    const hp = (n, t) => `<p class="h">${n}. ${t}</p>`, sp = (n, t) => `<p class="h2">${n}) ${t}</p>`, li = (x) => `<p class="li">- ${x}</p>`;
    const ap = s ? Flow.lastOf(60) : null;
    const approve = s ? `<div class="dh-ap"><div class="b">PHÊ DUYỆT</div><div class="i">${ap && ap.who ? vnDate(ap.t) : 'Ngày … tháng … năm 20…'}</div>
      <div class="sg-st">${stamp(s.tgd)}</div><div class="b">TỔNG GIÁM ĐỐC</div><div class="b">${esc(pname('tgd'))}</div></div>` : '';
    const title = small() ? `<p class="c b">TỜ TRÌNH</p><p class="c b">V/v phê duyệt ${adj() ? 'điều chỉnh ' : ''}đề xuất mua sắm ${name}</p>`
      : `<p class="c b">TỜ TRÌNH</p><p class="c b">Thẩm định, phê duyệt ${adj() ? 'điều chỉnh ' : ''}Đề xuất mua sắm <i>${name}</i></p>`;
    const kinhTrinh = small() ? `kính trình ${boss} phê duyệt đề xuất mua sắm <i>${name}</i>` : `kính trình ${boss} tổ chức thẩm định, phê duyệt đề xuất mua sắm <i>${name}</i>`;
    const signs = s ? `<table class="dsg3"><tr><td colspan="3">${signBox('PHÓ TỔNG GIÁM ĐỐC PHỤ TRÁCH', 'binh', s.ptgd)}</td></tr>
        <tr><td>${signBox('CQCM CÓ LIÊN QUAN', null, null, '(nếu có)')}</td><td>${signBox('CƠ QUAN CHUYÊN MÔN VỀ TCKT', null, null)}</td><td>${signBox('CƠ QUAN CHUYÊN MÔN VỀ ĐTXD', 'lan', s.ttms)}</td></tr></table>`
      + docFoot(signBox('ĐƠN VỊ ĐỀ XUẤT MUA SẮM', 'hai', signOf(13), 'GIÁM ĐỐC'))
      : docFoot(signBox('ĐẠI DIỆN ĐƠN VỊ ĐỀ XUẤT', 'hai', signOf(13), 'GIÁM ĐỐC'));
    return `<div class="doc paper a4" data-doc="${tt()}">${docHead({ no: ttNo(), at: doneAt(13), approve })}${title}
      <p class="c kg">Kính gửi: ${boss}.</p>
      ${legalLines().map((l) => `<p class="ind">${esc(l)}</p>`).join('')}<p class="ind">${basisLine()}</p>
      <p class="ind">Trên cơ sở ${basisName()} đã được phê duyệt, ${unit} ${kinhTrinh} với các nội dung chính sau:</p>
      ${adj() ? docAdj() : ''}
      ${hp(1, 'Mục đích')}${li(T_(v.mucDich))}
      ${hp(2, 'Phạm vi, quy mô đề xuất mua sắm')}${sp('a', 'Sự cần thiết phải mua sắm')}${nec ? li(T_(nec)) : '<p class="li missing">- Chưa có nội dung (mục bắt buộc).</p>'}
      ${v.cauTonKho ? li(`Hiện trạng tồn kho: ${T_(v.cauTonKho)}`) : ''}
      ${sp('b', 'Danh mục hàng hóa, dịch vụ')}${li(T_(v.phamVi))}${goodsTable()}
      ${hp(3, 'Giá trị của đề xuất mua sắm')}${li(`Tổng kinh phí đề xuất: <b>${vnd(total)} VNĐ (đã bao gồm VAT)</b>`)}<p class="ind2"><i>(Bằng chữ: ${esc(window.UI.inWords(total))}./.)</i></p>
      ${costs.length > 1 ? `<p class="ind2">Trong đó:</p>${costs.map(([k, a]) => li(`${esc(k)}: ${vnd(a)} VNĐ`)).join('')}` : ''}<p class="ind2">(Chi tiết bảng tính chi phí theo Phụ lục)</p>
      ${li(`Phương pháp tính toán, cơ sở xác định đơn giá: ${T_(v.phuongPhap)}`)}
      ${li(`Quan điểm thực hiện (nếu có): ${T_(v.quanDiem)}`)}
      ${li(`Phương án kỹ thuật – công nghệ (đối với hàng hóa), giải pháp triển khai (đối với dịch vụ): ${T_(v.phuongAn)}`)}
      ${hp(4, 'Nguồn vốn và thời gian thực hiện')}${sp('a', 'Nguồn vốn')}${li(`Nguồn vốn: ${T_(v.nguonVonTt)}`)}${li(`Nguồn ngân sách: ${T_(v.nguonNganSach)}`)}
      ${sp('b', `Thời gian thực hiện mua sắm: ${v.thoiGianTh ? esc(v.thoiGianTh) : period2(ci.period)}`)}
      ${hp(5, 'Đánh giá hiệu quả của ĐXMS (nếu cần thiết)')}${li(T_(v.hieuQua))}
      ${hp(6, 'Biện pháp và kế hoạch tổ chức thực hiện')}${li(`Biện pháp thực hiện: ${T_(v.bienPhap)}`)}${li(`Kế hoạch tổ chức thực hiện: ${T_(v.keHoach)}`)}
      ${adj() ? '' : `<div data-doc-pl><p class="h">Hồ sơ kèm theo</p>${plList().length ? plList().map((n) => li(esc(n))).join('') : li('Không có phụ lục kèm theo.')}</div>`}
      <p class="ind">${unit} ${small() ? `kính trình ${boss} phê duyệt đề xuất mua sắm` : `kính trình ${boss} xem xét, tổ chức thẩm định và phê duyệt đề xuất mua sắm`} làm cơ sở để các đơn vị thực hiện các thủ tục tiếp theo theo đúng quy định của pháp luật và Tập đoàn./.</p>
      ${signs}</div>`;
  }

  /* BM-03 Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS — eForm bước 16 (CQCM, hạn góp ý, đầu mối), chỉ huy ĐVĐX duyệt ở bước 16.1. */
  function docBm03() {
    const ci = Flow.ci(), cs = Flow.cqcmSel(), u = U(), name = esc(ci.title), unit = esc(ci.unit || '');
    const han = u.hanGopY || Flow.dateOf(Flow.state.clock + 5), dm = D.contactParts(u.dauMoi || 'minh') || {};
    const legal0 = legalLines()[0];
    /* Review nhi 06/11 #15: trường của eForm bước 16 (trích yếu, căn cứ, nội dung, ĐT / email đầu mối, nơi nhận) — chưa nhập thì theo câu chữ mẫu. */
    const vv16 = u.bm03Vv ? esc(u.bm03Vv).replace(/^V\/v /, '') : null;
    const canCu = u.bm03CanCu ? u.bm03CanCu.split('\n').filter((x) => x.trim()).map((x) => `<p class="ind">${esc(x)}</p>`).join('') : null;
    const noiDung = u.bm03NoiDung ? `<p class="ind">${esc(u.bm03NoiDung).replace(/trước ngày hạn góp ý\.?$/, `trước ngày <b>${esc(han)}</b>.`)}</p>` : null;
    const dmTel = u.dmDienThoai || dm.dienThoai, dmMail = u.dmEmail || dm.email;
    return `<div class="doc paper a4" data-doc="BM-03">${docHead({ no: `……/${unitSign(ci.unit)}`, at: doneAt('16.1'), vv: vv16 ? `V/v ${vv16}` : `V/v đề nghị góp ý dự thảo hồ sơ ĐXMS <i>${name}</i>` })}
      <table class="kgt"><tr><td class="kgt-l">Kính gửi:</td><td>${cs.length ? cs.map((c) => `<div>- ${esc(cqcmUnit(c))};</div>`).join('') : `<div>${PH('[Các cơ quan chuyên môn]')}</div>`}</td></tr></table>
      ${canCu || `${legal0 ? `<p class="ind">${esc(legal0)}</p>` : ''}<p class="ind">${basisLine().replace(/;$/, ',')}</p>`}
      ${noiDung || `<p class="ind">Trên cơ sở ${basisName()} đã được phê duyệt, ${unit} đã hoàn thành dự thảo Hồ sơ đề xuất mua sắm <i>${name}</i>. Nhằm đảm bảo ĐXMS được lập, thẩm định đúng quy định, đáp ứng tiến độ mua sắm, ${unit} kính đề nghị các CQCM phối hợp góp ý dự thảo hồ sơ ĐXMS theo chức năng, nhiệm vụ và gửi ý kiến nhận xét, góp ý để hoàn chỉnh nội dung ĐXMS trước ngày <b>${esc(han)}</b>.</p>`}
      <p class="ind">(*) Đầu mối tiếp nhận phản hồi, góp ý nội dung ĐXMS:</p>
      <p class="ind">Đ/c ${esc(dm.ten || '…')} – ĐT: ${esc(dmTel || '…')} – Email: ${esc(dmMail || '…')}</p>
      <p class="ind">Trân trọng!</p>
      ${u.bm03NoiNhan ? docFoot(signBox('ĐẠI DIỆN ĐƠN VỊ ĐỀ XUẤT', 'hai', signOf('16.1'), 'GIÁM ĐỐC')).replace(/<b><i>Nơi nhận:<\/i><\/b><br>[\s\S]*?<\/td>/, `<b><i>Nơi nhận:</i></b><br>${u.bm03NoiNhan.split(';').map((x) => x.trim()).filter(Boolean).map((x) => `- ${esc(x)}`).join(';<br>')}</td>`)
        : docFoot(signBox('ĐẠI DIỆN ĐƠN VỊ ĐỀ XUẤT', 'hai', signOf('16.1'), 'GIÁM ĐỐC'))}</div>`;
  }

  /* Checklist số 01 (≥ 160 tỷ) / số 02 (< 160 tỷ) — phần kết luận kiểm tra + bảng danh mục hồ sơ đúng cột của mẫu
     (TT · Danh mục hồ sơ · Số văn bản · Ngày văn bản · Người ký · Tình trạng · Yêu cầu · Ghi chú). Mẫu: không xoá dòng; thiếu / không áp dụng ghi ở Ghi chú.
     Tình trạng suy từ trạng thái luồng (bước đã xong), tệp phụ lục đã tải lên, căn cứ chọn ở bước 1. */
  function clRows() {
    const b = basisDoc(), big = !small(), signed = (t) => signOf(t).st === 'Đã ký';
    const st = (ok, yes, no) => (ok ? yes || 'Đủ' : no || 'Thiếu');
    const draft = Flow.taskStatus(draftTask()) !== 'todo' || Flow.state.tokens.some((t) => t.task === draftTask());
    const r = (tt, muc, o) => Object.assign({ tt, muc }, o || {});
    const grp = (tt, muc, o) => r(tt, muc, Object.assign({ grp: true }, o || {}));
    const inRow = (tt, muc, type) => r(tt, muc, b && b.type === type ? { so: b.no, ngay: b.date, ky: b.group ? 'Tổng Giám đốc Tập đoàn' : 'Tổng Giám đốc', tinhTrang: 'Đủ', input: true } : {});
    const sel = Flow.cqcmSel();
    const signedBm04 = sel.filter((c) => Flow.state.history.some((h) => h.task === 20 && h.cqcm === c && h.who && /^Đồng ý/.test(h.action))).length;
    const gt = Flow.doneCount(26) > 0, pls = D.phuLuc.filter(([k]) => plOn(k)), plDone = pls.filter(([k]) => U()[k]).length;
    const inputs = (n) => [grp(n, 'Tài liệu đầu vào', { yeuCau: 'Bắt buộc', note: 1, tinhTrang: b ? 'Đủ' : 'Thiếu', count: true }),
      inRow(`${n}.1`, 'Kế hoạch SXKD năm…', 'khsx'), inRow(`${n}.2`, 'Phương án kinh doanh', 'pakd'), inRow(`${n}.3`, 'Tờ trình kinh phí', 'ttkp'),
      inRow(`${n}.4`, 'Quyết định phê duyệt nhiệm vụ KHCN', 'khcn'), inRow(`${n}.5`, 'Văn bản kết luận, chính sách, chủ trương, chỉ đạo khác', 'khac')];
    const quoted = Flow.taskStatus(10) === 'done';
    const basis = (n) => [grp(n, 'Sở cứ lập ĐXMS', { yeuCau: 'Bắt buộc' }),
      r(`${n}.1`, 'Sở cứ giá (gồm hợp đồng tương tự, báo giá, dự toán chi tiết...)', { so: `${D.quotes.length} báo giá`, ky: D.quotes.map((q) => nccName(q.ncc)).join(', '),
        tinhTrang: st(quoted), yeuCau: 'Bắt buộc', note: 2, count: true }),
      r(`${n}.2`, 'Tài liệu khác về Hồ sơ, báo cáo khảo sát, thiết kế...', { opt: true, so: [R().ebom, R().rstk].filter(Boolean).join('; '),
        tinhTrang: st(Flow.taskStatus(7) === 'done', 'Đủ', 'Chưa có'), yeuCau: 'Tùy chọn', ghiChu: pls.length ? `Phụ lục: ${plDone}/${pls.length} đã tải lên` : 'eBOM, kết quả rà soát tồn kho' }),
      r(`${n}.3`, 'Tài liệu khác về kế hoạch, chủ trương, định hướng của Nhà nước và Tập đoàn (nếu có)', { opt: true, yeuCau: 'Tùy chọn', ghiChu: 'Không có' })];
    const sign = { merge: 'Văn bản trình ký' };
    const head = [r(1, `${big ? 'Tờ trình thẩm định, phê duyệt ĐXMS (BM-01)' : 'Tờ trình ĐXMS (ký trực tiếp) (BM-09)'} và các Phụ lục`,
        Object.assign({ b: true, tinhTrang: draft ? `Dự thảo v${version()}` : 'Chưa lập', yeuCau: 'Bắt buộc', ghiChu: plList().length ? `${plList().length} phụ lục kèm theo` : '', count: true, ok: draft }, sign)),
      r(2, 'Phiếu trình giải quyết công việc (BM-02)', Object.assign({ opt: true, tinhTrang: gt ? 'Đủ' : '', yeuCau: 'Tùy chọn', ghiChu: gt ? 'Giải trình ý kiến CQCM' : 'Không sử dụng' }, sign)),
      r(3, big ? 'Checklist số 01' : 'Checklist số 02', Object.assign({ b: true, tinhTrang: 'Bản này', yeuCau: 'Bắt buộc' }, sign))];
    if (!big) return [grp('I', 'VĂN BẢN TRÌNH KÝ', { sec: true }), ...head, grp('II', 'VĂN BẢN ĐÍNH KÈM', { sec: true }), ...inputs(1), ...basis(2)];
    const cq = { merge: 'CQ chủ trì thẩm định soạn thảo', mergeAll: true };
    return [grp('I', 'HỒ SƠ ĐXMS', { sec: true }), ...head, grp('II', 'TÀI LIỆU ĐÍNH KÈM', { sec: true }), ...inputs(1),
      grp(2, 'Hồ sơ thẩm định của CQCM (nếu có)', { opt: true, yeuCau: 'Tùy chọn' }),
      r('2.1', 'Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS (BM-03)', { opt: true, ngay: signed('16.1') ? signOf('16.1').at : '', ky: signed('16.1') ? pname('hai') : '', tinhTrang: signed('16.1') ? 'Đã ký' : '', yeuCau: 'Nếu có' }),
      r('2.2', 'Văn bản thẩm định dự thảo ĐXMS của CQCM (BM-04)', { opt: true, so: sel.length ? `${sel.length} phiếu nhận xét` : '', tinhTrang: sel.length ? `${signedBm04}/${sel.length} đã ký` : '', yeuCau: 'Nếu có' }),
      ...basis(3),
      grp('III', 'HỒ SƠ TRÌNH PHÊ DUYỆT ĐXMS CỦA CQCM CHỦ TRÌ THẨM ĐỊNH', { sec: true }),
      r(1, 'Báo cáo kết quả thẩm định ĐXMS (BM-05)', Object.assign({ b: true, yeuCau: 'Bắt buộc' }, cq)),
      r(2, 'Công văn về việc báo cáo Tổng Giám đốc Tập đoàn nội dung ĐXMS trước khi phê duyệt (BM-06)', Object.assign({ opt: true, yeuCau: 'Tùy chọn' }, cq)),
      r(3, 'Báo cáo gửi Tổng Giám đốc Tập đoàn về nội dung ĐXMS (BM-07)', Object.assign({ opt: true, yeuCau: 'Tùy chọn' }, cq, { merge: 'Ban ĐTXD soạn thảo' })),
      r(4, 'Quyết định phê duyệt ĐXMS (BM-08)', Object.assign({ b: true, yeuCau: 'Bắt buộc', note: 3 }, cq))];
  }
  const CL_NOTES = { 1: 'Chỉ điền thông tin của tài liệu đầu vào là căn cứ lập ĐXMS. Các căn cứ khác bỏ trống.',
    2: 'Trường hợp ĐXMS thực hiện hàng năm thì bổ sung bảng so sánh đơn giá của hợp đồng đã ký trong vòng 3 năm gần nhất.',
    3: 'Nếu không thuộc trường hợp phải báo cáo Tổng Giám đốc Tập đoàn theo quy định thì CQCM chủ trì có thể trình ký đồng thời Báo cáo thẩm định và Quyết định phê duyệt ĐXMS.' };
  function docCl() {
    const ci = Flow.ci(), no = small() ? '02' : '01', rows = clRows(), name = esc(ci.title);
    /* Tài liệu bắt buộc do đơn vị lập hồ sơ nộp (không tính phần CQCM chủ trì soạn thảo, không tính chính Checklist). */
    const need = rows.filter((x) => x.count), miss = need.filter((x) => (x.ok != null ? !x.ok : x.tinhTrang !== 'Đủ'));
    const notes = [...new Set(rows.filter((x) => x.note).map((x) => x.note))];
    const cell = (s) => (s ? esc(s) : '');
    const tr = (x) => {
      const cls = [x.sec ? 'sec' : '', x.grp || x.b ? 'b' : '', x.opt ? 'i' : ''].filter(Boolean).join(' ');
      const sup = x.note ? `<sup>(${notes.indexOf(x.note) + 1})</sup>` : '';
      if (x.sec) return `<tr class="${cls}"><td class="c">${x.tt}</td><td colspan="7">${esc(x.muc)}</td></tr>`;
      const stc = x.tinhTrang === 'Thiếu' || x.tinhTrang === 'Chưa lập' ? ' miss' : '';
      const mid = x.merge ? `<td colspan="${x.mergeAll ? 4 : 2}" class="c">${esc(x.merge)}</td>${x.mergeAll ? '' : `<td>${cell(x.ky)}</td><td class="c${stc}">${cell(x.tinhTrang)}</td>`}`
        : `<td>${cell(x.so)}</td><td class="c">${cell(x.ngay)}</td><td>${cell(x.ky)}</td><td class="c${stc}">${cell(x.tinhTrang)}</td>`;
      return `<tr class="${cls}"><td class="c">${x.tt}</td><td>${esc(x.muc)}${sup}</td>${mid}<td class="c">${cell(x.yeuCau)}</td><td>${cell(x.ghiChu)}</td></tr>`;
    };
    return `<div class="doc paper a4 land" data-doc="CL${no}">${docHead({ no: '……', at: doneAt(36), unit: ci.unit })}
      <p class="c b">CHECKLIST SỐ ${no}</p><p class="c b">Kiểm tra hồ sơ trình phê duyệt ĐXMS có giá trị ${small() ? 'dưới 160 tỷ đồng' : 'từ 160 tỷ đồng trở lên'}</p>
      <p class="c kg">Kính gửi: Tổng Giám đốc.</p>
      <p class="ind">Căn cứ Quy trình QT.CNVTQĐ.ĐTXD.10.2.1 và Hướng dẫn về biểu mẫu hồ sơ trình thẩm định, phê duyệt ĐXMS của Tập đoàn;</p>
      <p class="ind">1. Đại diện đơn vị kiểm tra:</p><p class="ind2">- Ông/bà: ${PH()} - Chức vụ: ${PH()}</p>
      <p class="ind">2. Đại diện đơn vị lập hồ sơ:</p><p class="ind2">- Ông/bà: ${esc(pname('minh'))} - Chức vụ: ${esc(persona('minh').role)}, ${esc(ci.unit || '')}</p>
      <p class="ind">${PH('[Tên cá nhân/đơn vị kiểm tra]')} đã tiến hành kiểm tra tính đầy đủ, hợp lệ của Hồ sơ trình thẩm định, phê duyệt ĐXMS <i>${name}</i> theo quy định. Kết quả kiểm tra như sau:</p>
      <p class="h">I. NỘI DUNG, KẾT QUẢ KIỂM TRA</p>
      <p class="li">- Kiểm tra tính đầy đủ của danh mục hồ sơ: ${need.length - miss.length}/${need.length} tài liệu bắt buộc đã có${miss.length ? `; còn thiếu: ${miss.map((x) => esc(x.muc)).join('; ')}` : ''}.</p>
      <p class="li">- Kiểm tra tính hợp lệ về quy cách hồ sơ: ${PH()}</p><p class="ind"><i>(Chi tiết nội dung kiểm tra theo checklist đi kèm)</i></p>
      <p class="h">II. KẾT LUẬN</p>
      <p class="li">- Hồ sơ ${miss.length ? '<b>không đủ điều kiện</b>' : '<b>đảm bảo đủ điều kiện</b>'} trình thẩm định.</p>
      <table class="dsg2"><tr><td>${signBox('ĐƠN VỊ LẬP HỒ SƠ', 'minh', null)}</td><td>${signBox('ĐƠN VỊ KIỂM TRA', null, signOf(36))}</td></tr></table>
      <p class="c b cl-h">CHECKLIST<br>BỘ HỒ SƠ TRÌNH THẨM ĐỊNH, PHÊ DUYỆT ĐỀ XUẤT MUA SẮM</p>
      <div class="dt-wrap"><table class="dt cl"><colgroup><col style="width:40px"><col><col style="width:110px"><col style="width:84px"><col style="width:110px"><col style="width:84px"><col style="width:70px"><col style="width:130px"></colgroup>
        <tr><th>TT</th><th>Danh mục hồ sơ</th><th>Số văn bản</th><th>Ngày văn bản</th><th>Người ký</th><th>Tình trạng</th><th>Yêu cầu</th><th>Ghi chú</th></tr>
        ${rows.map(tr).join('')}</table></div>
      ${notes.length ? `<div class="fn">${notes.map((n, k) => `<p>(${k + 1}) ${esc(CL_NOTES[n])}</p>`).join('')}</div>` : ''}</div>`;
  }
  const docBm05 = () => { const v = of({ task: 42 }); return `<div class="doc paper"><p class="c"><b>BÁO CÁO KẾT QUẢ THẨM ĐỊNH (BM-05)</b><br>${esc(Flow.ci().title)} · hồ sơ v${version()}</p>${v.bm05View.map((r) => docSec(r.muc, '', P(r.noiDung)).replace('. </h4>', '</h4>')).join('')}</div>`; };
  const docBm06 = () => `<div class="doc paper"><p>Kính gửi: Tổng Giám đốc Tập đoàn (qua Ban Đầu tư - Xây dựng)</p><p>VHT báo cáo đề xuất mua sắm <b>${esc(Flow.ci().title)}</b>, giá trị ${ty(D.caseInfo.total)} tỷ đồng, căn cứ ${esc((basisDoc() || {}).no || '')} (${(basisDoc() || {}).group ? 'đã' : 'chưa'} được CT/TGĐ Tập đoàn phê duyệt), đã được thẩm định theo BM-05.</p>
    <p>VHT kính đề nghị Tổng Giám đốc Tập đoàn cho ý kiến để VHT phê duyệt ĐXMS.</p></div>`;
  /* MS02: phần nội dung điều chỉnh của BM-01 / BM-09 / BM-08 điều chỉnh — căn cứ hồ sơ cũ, lý do, bảng trước – sau. */
  function docAdj() {
    const a = adj(), fc = adjFrom() || {};
    return `<div class="doc-sec"><h4>NỘI DUNG ĐIỀU CHỈNH (lần ${pad2(adjLan())})</h4><p>Căn cứ hồ sơ ${esc(a.from || '')} đã được phê duyệt${fc.updated ? ' ngày ' + fc.updated : ''} (quy trình ${esc(a.fromFlow || '')}).</p>
      <p><b>Lý do điều chỉnh:</b> ${esc(U().lyDoDc || a.reason || '') || '<i>chưa nhập</i>'}</p>
      <table class="doc-t"><tr><th>Nội dung</th><th>Đã phê duyệt</th><th>Sau điều chỉnh</th></tr>${adjRows().map((r) => `<tr><td>${esc(r.noiDung)}</td><td>${esc(r.truoc)}</td><td>${esc(r.sau)}</td></tr>`).join('')}</table></div>`;
  }
  const docBm08Adj = () => { const a = adj(), fc = adjFrom() || {}; return `<div class="doc paper"><p class="c"><b>QUYẾT ĐỊNH</b><br>Về việc phê duyệt điều chỉnh đề xuất mua sắm ${esc(Flow.ci().title.toLowerCase())}</p>
    <p>Căn cứ Quyết định phê duyệt ĐXMS theo hồ sơ ${esc(a.from || '')}${fc.updated ? ' ngày ' + fc.updated : ''};</p>
    <p><b>Điều 1.</b> Phê duyệt điều chỉnh đề xuất mua sắm ${esc(Flow.ci().title)} (lần ${pad2(adjLan())}): tổng giá trị từ ${vnd(a.before)} đồng thành ${vnd(a.total)} đồng (gồm VAT). Lý do: ${esc(U().lyDoDc || a.reason || '')}.</p>
    ${docAdj().replace(/<h4>.*?<\/h4>/, '')}
    <p><b>Điều 2.</b> Các nội dung khác giữ nguyên theo Quyết định đã phê duyệt. ${esc(D.caseInfo.unit)} cập nhật kế hoạch lựa chọn nhà thầu, hợp đồng liên quan theo nội dung điều chỉnh.</p>
    <p><b>Điều 3.</b> Quyết định có hiệu lực từ ngày ký.</p><p class="r">TỔNG GIÁM ĐỐC<br><br><i>${esc(pname('tgd'))}</i></p></div>`; };
  const docBm08 = () => (adj() ? docBm08Adj() : `<div class="doc paper"><p class="c"><b>QUYẾT ĐỊNH</b><br>Về việc phê duyệt đề xuất mua sắm ${esc(Flow.ci().title.toLowerCase())}</p>
    <p><b>Điều 1.</b> Phê duyệt đề xuất mua sắm với nội dung: tên ${esc(Flow.ci().title)}; tổng giá trị ${vnd(D.caseInfo.total)} đồng (gồm VAT); nguồn vốn ${esc(D.caseInfo.fund)}; thời gian ${esc(D.caseInfo.period)}; danh mục ${buyItems().length} hạng mục (phụ lục kèm theo).</p>
    <p><b>Điều 2.</b> ${esc(D.caseInfo.unit)} chủ trì tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn; TTMS, Ban Tài chính phối hợp.</p>
    <p><b>Điều 3.</b> Quyết định có hiệu lực từ ngày ký.</p><p class="r">TỔNG GIÁM ĐỐC<br><br><i>${esc(pname('tgd'))}</i></p></div>`);
  const docBm02 = () => `<div class="doc paper"><p class="c"><b>THUYẾT MINH ĐỀ XUẤT MUA SẮM (BM-02)</b></p><p>Hệ thống sinh từ ${tt()} và phụ lục chi phí. Phụ lục 1 (giải trình ý kiến) được điền khi lập giải trình.</p></div>`;

  /* KĐT: BM-01 chủ trương, BM-00 gộp, BM-03 + phụ lục thuyết minh, BM-14, BM-18. Tuyến Tập đoàn: người ký là TGĐ Tập đoàn (bước 73). */
  const TD_SIGNER = 'Tổng Giám đốc Tập đoàn';
  function docBm01K() {
    const d = R().doc || {}, k = kd(), total = D.caseInfo.total, td = tdKinds().includes('CT'), sg = signOf(td ? 73 : 48), host = hostOf(), u = U();
    const cost = Flow.doneCount(36) ? P(R().meeting.changes[1][2] + '.') : '';
    return `<div class="doc paper"><div class="doc-sec"><h4>PHÊ DUYỆT</h4><p>${td ? TD_SIGNER : `${esc(pname('tgd'))} — Tổng Giám đốc`} · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p></div>
      <div class="doc-sec"><h4>I. THÔNG TIN CHUNG</h4></div>
      ${docSec(1, 'Tên khoản đầu tư', P(k.title || Flow.ci().title))}${docSec(2, 'Phân loại KĐT', P(catName('loai-kdt', k.type)))}${docSec(3, 'Lĩnh vực đầu tư', P(catName('linh-vuc', k.field)))}
      ${docSec('4.1', 'Mục đích, mục tiêu', P(u.mucTieuK || aiText('purposeText')))}${docSec('4.2', 'Sự cần thiết', kNeed() ? P(aiOf('aiSuCanThietK', 'suCanThiet') || d.necessity) : missing, true)}
      ${docSec('5.1', 'Tổng mức vốn dự kiến (gồm VAT)', `<p>${vnd(total)} đồng (${ty(total)} tỷ đồng)</p>`)}
      ${docSec('5.2', 'Phương pháp tính toán', `${P(u.phuongPhapK || d.method)}${P('Phương án kỹ thuật – công nghệ: ' + (d.tech || ''))}${buyList()}${cost}`)}
      ${docSec(6, 'Nguồn vốn và thời gian thực hiện', `${P((d.fund || '') + '.')}${P(d.period)}`)}${docSec(7, 'Đánh giá hiệu quả', P(u.hieuQuaK != null ? u.hieuQuaK : d.effect))}
      <div class="doc-sec"><h4>II. TỔ CHỨC THỰC HIỆN</h4>${P(u.toChucK || d.org)}${host ? P('Đơn vị chủ trì: ' + host + '.') : ''}</div></div>`;
  }
  function docBm00() {
    const d = R().doc || {}, k = kd(), sg = signOf(62), u = U();
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
    const f = (k, dv) => (u[k] != null && u[k] !== '' ? u[k] : dv || '');
    return `<div class="doc paper"><p class="c"><b>PHỤ LỤC THUYẾT MINH KHOẢN ĐẦU TƯ</b></p>
      ${docSec(1, 'Mục đích / mục tiêu, sự cần thiết', `${P(aiText('purposeText'))}<p><b>Đánh giá hiện trạng:</b> ${esc(f('hienTrang', x.state))}</p><p><b>Phân tích nhu cầu:</b> ${esc(f('phanTichNhuCau', d.need || aiText('scope')))}</p><p><b>Kết luận về sự cần thiết:</b> ${esc(f('ketLuanCanThiet', d.necessity))}</p>`)}
      ${docSec(2, 'Phương án thiết kế công nghệ, giải pháp triển khai', `${f('quanDiem', d.view) ? P('Quan điểm, định hướng: ' + f('quanDiem', d.view)) : ''}${P(f('phuongAnTk', d.tech))}${P('Địa điểm: ' + f('diaDiem', x.place) + '.')}${f('giaiPhap', d.deploy) ? P('Giải pháp triển khai: ' + f('giaiPhap', d.deploy)) : ''}${P('Rủi ro: ' + f('ruiRo', x.risk))}`)}
      ${docSec(3, 'Tổng mức vốn', `${moneyText(D.caseInfo.total)}${costs.length ? `<ul class="plain">${costs.map(([a, val]) => `<li>${esc(a)}: ${ty(val)} tỷ đồng</li>`).join('')}</ul>` : ''}${P('Phương pháp tính toán, cơ sở đơn giá: ' + f('phuongPhapTinh', d.method))}`)}
      ${docSec(4, 'Tổ chức thực hiện', `${P(f('toChucTh', d.org))}<ul class="plain">${(u.cacMoc != null ? u.cacMoc.split('\n').filter((l) => l.trim()).map((l) => [l]) : (x.milestones || [])).map(([a, b]) => `<li>${esc(a)}${b ? ': ' + esc(b) : ''}</li>`).join('')}</ul>`)}
      ${docSec(5, 'Đánh giá hiệu quả', P(f('danhGiaHieuQua', d.effect)))}</div>`;
  }
  function docBm14() {
    const k = kd(), cs = Flow.cqcmSel(), x = R().bm14 || {}, nr = Math.max(1, Flow.tdRound());
    const pend = Array.from({ length: nr }, (_, j) => fixItems(j)).flat();
    const td = tdKinds().some((t) => t !== 'CT') && Flow.state.history.some((h) => String(h.task) === '72');
    return `<div class="doc paper"><div class="doc-sec"><h4>BÁO CÁO KẾT QUẢ THẨM ĐỊNH — Khoản đầu tư ${esc(k.title || '')}</h4><p>Số: ${esc(x.no || '')} · Kính gửi: ${esc(td ? TD_SIGNER : b3().decider || 'Tổng Giám đốc VHT')}</p></div>
      <div class="doc-sec"><h4>Phần thứ nhất — Tài liệu thẩm định và tổ chức thẩm định</h4><ul class="plain"><li>Tờ trình ${esc(b3().no || '')} (BM-03, phiên bản v${kdtVer()}) và Checklist 02 của ${esc(k.unit || '')}.</li>
        <li>Văn bản thẩm định của ${cs.length} CQCM: ${esc(cs.map(cqcmUnit).join('; ') || '-')}.</li>${td ? '<li>Phiếu nhận xét của các Ban chuyên môn Tập đoàn và Báo cáo giải trình BM-06 của VHT.</li>' : ''}
        <li>Cơ quan chủ trì thẩm định: ${td ? 'Ban Đầu tư – Xây dựng Tập đoàn' : 'Trung tâm Mua sắm (TTMS)'}. Hình thức thẩm định: lấy ý kiến bằng văn bản.</li></ul></div>
      <div class="doc-sec"><h4>Phần thứ hai — Ý kiến thẩm định khoản đầu tư</h4></div>
      ${docSec('I', 'Thông tin chung', P(`${catName('loai-kdt', k.type)} · ${catName('linh-vuc', k.field)} · Tổng mức vốn ${ty(D.caseInfo.total)} tỷ đồng · ${(R().doc || {}).fund || ''}.`))}
      ${docSec('II.1', 'Các nội dung đồng thuận', `<ul class="plain">${(x.agreed || []).map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`)}
      ${docSec('II.2', 'Nội dung cần bổ sung làm rõ', pend.length ? `<ul class="plain">${pend.map((p) => `<li>${esc(unitOf(p.id))}: ${esc(p.text)}</li>`).join('')}</ul>` : P('Không có.'))}
      ${docSec('II.3', 'Giải trình của đại diện chủ đầu tư', P(x.explain))}
      ${docSec('III', 'Ý kiến của cơ quan chủ trì thẩm định', `<ul class="plain">${['Kết quả thẩm định về mặt pháp lý', 'Kết quả thẩm định về mục tiêu và sự cần thiết', 'Kết quả thẩm định các nội dung chính của KĐT'].map((a) => `<li>${a} — Đánh giá: <b>Đạt</b>.</li>`).join('')}</ul>`)}
      ${docSec('IV', 'Kiến nghị', P(`Kiến nghị ${b3().decider || 'Tổng Giám đốc VHT'} xem xét, quyết định phê duyệt Khoản đầu tư để các đơn vị triển khai các bước tiếp theo.`))}</div>`;
  }
  function docBm18() {
    const k = kd(), d = R().doc || {}, x = R().bm18 || {}, td = tdKinds().some((t) => t !== 'CT'), sg = signOf(td ? 73 : kdtGop() ? 62 : 60);
    return `<div class="doc paper"><div class="doc-sec"><h4>QUYẾT ĐỊNH — Phê duyệt khoản đầu tư ${esc(k.title || '')}</h4><p>Số: ${esc(x.no || '')}/QĐ-${td ? 'VTG' : 'VHT'} · ${td ? TD_SIGNER : `${esc(pname('tgd'))} — Tổng Giám đốc`} · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p>
        <p>Căn cứ Tờ trình chủ trương ${esc(b3().ctNo || '')} đã được phê duyệt; xét Tờ trình ${esc(b3().no || '')}; theo đề nghị của TTMS tại Báo cáo kết quả thẩm định ${esc((R().bm14 || {}).no || '')}.</p></div>
      <div class="doc-sec"><h4>Điều 1. Phê duyệt khoản đầu tư với các nội dung chính</h4></div>
      ${docSec(1, 'Tên khoản đầu tư', P(k.title))}${docSec(2, 'Phân loại KĐT · Lĩnh vực', P(`${catName('loai-kdt', k.type)} · ${catName('linh-vuc', k.field)}`))}
      ${docSec(3, 'Người quyết định đầu tư · Chủ đầu tư', P(`${b3().decider || ''} · ${x.owner || k.unit || ''}`))}${docSec(4, 'Mục tiêu đầu tư', P(aiText('purposeText')))}
      ${docSec(5, 'Tổng mức vốn', `${moneyText(D.caseInfo.total)}${(x.costs || []).length ? `<ul class="plain">${x.costs.map(([a, val]) => `<li>${esc(a)}: ${ty(val)} tỷ đồng</li>`).join('')}</ul>` : ''}`)}
      ${docSec(6, 'Nguồn vốn · Thời gian thực hiện mua sắm', P(`${d.fund || ''} · ${d.period || ''}`))}
      <div class="doc-sec"><h4>Điều 2. Tổ chức thực hiện</h4>${P(`Giao ${x.owner || k.unit || ''} là chủ đầu tư: lập kế hoạch triển khai chi tiết, trình phê duyệt kế hoạch lựa chọn nhà thầu, tổ chức nghiệm thu, quyết toán và báo cáo định kỳ theo quy định.`)}</div>
      <div class="doc-sec"><h4>Điều 3. Hiệu lực</h4><p>Quyết định có hiệu lực kể từ ngày ký.</p></div></div>`;
  }

  /* Tuyến Tập đoàn: công văn trình (64–65) và báo cáo giải trình BM-06 (68–69). */
  function docCvTd() {
    const v = of({ task: 64 }), sg = signOf(65);
    return `<div class="doc paper"><p>Số: ……/VHT-TTVT · ${esc(v.trichYeuCv)}</p>
      <p>Kính gửi: Tổng Giám đốc Tập đoàn (qua Ban Đầu tư – Xây dựng).</p><p>${esc(v.noiDungCv)}</p>
      <p>Hồ sơ kèm theo: ${esc(tdk().doc)} (dự thảo); ý kiến thẩm định nội bộ; căn cứ ${esc((basisDoc() || {}).no || '')}.</p>
      <p class="r">TỔNG GIÁM ĐỐC<br><br><i>${esc(pname('tgd'))}</i> · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p></div>`;
  }
  function docBm06K() {
    const rows = of({ task: 68 }).giaiTrinhTd, sg = signOf(69);
    return `<div class="doc paper"><p class="c"><b>BÁO CÁO GIẢI TRÌNH, TIẾP THU Ý KIẾN TẬP ĐOÀN (BM-06)</b><br>${esc(kd().title || '')} · ${esc(tdk().doc)} v${kdtVer()}</p>
      ${rows.map((r, j) => docSec(j + 1, `${r.ban} — ${r.muc}`, `<p><b>Ý kiến:</b> ${esc(r.nhanXet)}</p><p><b>Tiếp thu, giải trình:</b> ${esc(r.traLoi)}</p>`)).join('')}
      <p class="r">TỔNG GIÁM ĐỐC<br><br><i>${esc(pname('tgd'))}</i> · ${esc(sg.st)}${sg.at ? ' ' + sg.at : ''}</p></div>`;
  }

  /* code → { name, html }. KĐT dùng BM-01 / BM-03 của bộ biểu mẫu KĐT (BM-8.6.5). */
  const DOC = {
    'BM-01': () => (kdt() ? { name: 'Tờ trình chủ trương KĐT', html: docBm01K() } : { name: adj() ? 'Tờ trình điều chỉnh ĐXMS' : 'Tờ trình đề xuất mua sắm', html: docTt() }),
    'BM-09': () => ({ name: adj() ? 'Tờ trình điều chỉnh ĐXMS' : 'Tờ trình đề xuất mua sắm', html: docTt() }),
    'BM-02': () => ({ name: 'Thuyết minh ĐXMS', html: docBm02() }),
    'BM-03': () => (kdt() ? { name: 'Tờ trình thẩm định, phê duyệt KĐT', html: docBm03K() } : { name: 'Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS', html: docBm03() }),
    CL01: () => (kdt() ? null : { name: 'Checklist 01 — danh mục hồ sơ', html: docCl() }),
    CL02: () => (kdt() ? null : { name: 'Checklist 02 — danh mục hồ sơ', html: docCl() }),
    'PL-TM': () => ({ name: 'Phụ lục thuyết minh KĐT', html: docAnnex() }),
    'BM-05': () => ({ name: 'Báo cáo kết quả thẩm định', html: docBm05() }),
    'BM-06': () => (kdt() ? { name: 'Báo cáo giải trình, tiếp thu ý kiến Tập đoàn', html: docBm06K() } : { name: 'Công văn báo cáo TGĐ Tập đoàn', html: docBm06() }),
    'CV-TD': () => ({ name: 'Công văn trình Tập đoàn', html: docCvTd() }),
    'BM-08': () => ({ name: adj() ? 'Quyết định phê duyệt điều chỉnh ĐXMS' : 'Quyết định phê duyệt ĐXMS', html: docBm08() }),
    'BM-00': () => ({ name: 'Hồ sơ gộp chủ trương và KĐT', html: docBm00() }),
    PYC: () => ({ name: 'Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS', html: docBm03() }),
    'BM-14': () => ({ name: 'Báo cáo kết quả thẩm định KĐT', html: docBm14() }),
    'BM-18': () => ({ name: 'Quyết định phê duyệt KĐT', html: docBm18() }),
  };
  const doc = (code) => (Flow.state.parent ? window.EForms.hd.doc(code) : DOC[code] ? DOC[code]() : null);

  /* ---------- Kiểm tra phía BE khi submit (G3, G7/E3, KĐT bước 12) ----------
     Tài liệu bắt buộc theo hành động (E3) đọc ở Danh sách tài liệu (Flow.ui[key] = đã tải lên). */
  const REQ_DOCS = {
    MS01: { 16: [['bm03File', 'Phiếu yêu cầu thẩm định (BM-03) đã ký nháy']], 32: [['minutesFile', 'Biên bản họp']], 51: [['bm06File', 'Tệp đính kèm khi xác nhận (BM-06 đã ký nháy)']] },
    MS13: { 32: [['kMinutes', 'Biên bản họp']] },
  };
  /* 78: bản scan của lần ký bản cứng đang cập nhật — mỗi lần ký một tệp (khoá theo bước ký + số lần đã ký qua khối). */
  const kyScanKey = () => { const ky = Flow.state.vars.ky || {}; return `kyScan_${ky.task}_${(Flow.state.vars.kyLog || []).length}`; };
  /* Comment #5: báo giá của từng NCC nhận YCBG — bắt buộc với nút "Báo giá đạt". Comment #22: phiếu nhận xét Tập đoàn — tuỳ chọn. */
  const quoteKey = (code) => 'quote_' + code;
  function reqDocs(tok, vals) {
    if (Flow.state.parent) return window.EForms.hd.reqDocs(tok);
    const list = ((REQ_DOCS[kdt() ? 'MS13' : 'MS01'][tok.task]) || []).map(([key, name]) => ({ key, name, have: !!U()[key] }));
    if (!kdt() && String(tok.task) === '10') (U().nccSel || nccDefault()).forEach((c) => list.push({ key: quoteKey(c), name: `Báo giá — ${nccName(c)}`, have: !!U()[quoteKey(c)], only: /^Báo giá đạt/ }));
    if (kdt() && String(tok.task) === '78') list.push({ key: kyScanKey(), name: `Bản scan ${(Flow.state.vars.ky || {}).doc || 'văn bản'} đã ký`, have: !!U()[kyScanKey()] });
    /* T29 F7, B17 (HT-DXMS-NOTE màn 8, P-212): phụ lục của Tờ trình chọn Có thì bắt buộc tải lên ở bước lập dự thảo; chọn Không thì không hiện. */
    /* Review nhi 06/11 #4, #5: phụ lục chọn / tải ngay trên bảng Checklist của form (inForm — không lặp ở mục Tài liệu đính kèm). */
    if (!kdt() && !adj() && String(tok.task) === String(draftTask())) {
      const pv = vals && vals.checklistDs ? Object.assign({}, vals, plFromForm(vals)) : vals;
      D.phuLuc.filter(([key]) => plOn(key, pv)).forEach(([key, name]) => list.push({ key, name, have: !!U()[key] || !!formFile(vals, key), inForm: true }));
    }
    /* T31 B3 (K4b, IA-DXMS dòng 18): hồ sơ kèm theo Tờ trình BM-03 — phụ lục theo Loại tài liệu, không bắt buộc. */
    if (kdt() && String(tok.task) === '50') D.phuLuc.forEach(([key, name]) => list.push({ key: 'k' + key, name, opt: true, have: !!U()['k' + key] }));
    if (!kdt() && tok.task === 60 && !small() && Flow.state.vars.reportTD) list.push({ key: 'tdReviewFile', name: 'Phiếu nhận xét của Tập đoàn', have: !!U().tdReviewFile, opt: true });
    return list;
  }
  function check(tok, choice, vals) {
    const n = tok.task, lbl = choice ? choice.label : '';
    const miss = reqDocs(tok, vals).find((x) => !x.have && !x.opt && (!x.only || x.only.test(lbl)));
    if (miss && miss.inForm) return `Bạn cần tải lên ${miss.name} (bảng ${clName()} của form hoặc Danh sách tài liệu), hoặc chọn Không kèm theo.`;
    if (miss && !(kdt() && n === 32 && /^Chưa/.test(lbl))) return `Bạn cần tải lên ${miss.name} (mục Tài liệu đính kèm hoặc Danh sách tài liệu).`;
    if (Flow.state.parent) return window.EForms.hd.check(tok, choice, vals);
    if (!vals) return null;
    if (n === 1 && vals.basisDoc !== undefined && (of(tok).basisDocOptions.find((o) => o.value === vals.basisDoc) || {}).type !== vals.basisType) return 'Văn bản căn cứ không thuộc loại căn cứ đã chọn.';
    if (n === 1 && (vals.basisMore || []).includes(vals.basisDoc)) return 'Văn bản căn cứ bổ sung trùng văn bản căn cứ chính.';
    if (n === 5 && (lbl.startsWith('Xác nhận') || lbl === 'Gửi rà soát tồn kho') && (vals.bocTach || []).some((r) => !r.bo && r.remain != null && r.prop > r.remain)) return 'Có dòng vượt số lượng còn lại sau trừ lùi.';
    if (n === 5 && !kdt() && (vals.bocTach || []).every((r) => r.bo) && !(vals.hangMucThem || []).some((r) => r.line)) return 'ĐXMS cần ít nhất một hạng mục.';
    /* Review nhi 06/11 #23: phiếu YCBG phải còn ít nhất một hàng hoá. #27: dòng Bắt buộc phải có; chọn Có thì phải có tệp (trừ phụ lục — kiểm ở reqDocs). */
    if (!kdt() && n === 8 && vals.ycbgHang && !vals.ycbgHang.length) return 'Yêu cầu báo giá cần ít nhất một hàng hoá.';
    if (!kdt() && !adj() && n === draftTask() && vals.checklistDs) {
      const miss1 = vals.checklistDs.find((r) => !r.gen && !r.pl && r.batBuoc === 'Bắt buộc' && r.kemTheo !== 'Có');
      if (miss1) return `${miss1.muc}: danh mục bắt buộc, Tình trạng phải là Có.`;
      const miss2 = vals.checklistDs.find((r) => !r.gen && !r.pl && r.kemTheo === 'Có' && r.noFile && !r.tepMoi);
      if (miss2) return `${miss2.muc}: chọn Có thì cần tải tệp lên.`;
    }
    if (!kdt() && n === 16 && small() && !(vals.cqcmSel || []).includes('TC')) return 'Hồ sơ dưới 160 tỷ: CQCM Tài chính bắt buộc (QT B8.2).';
    if (kdt() && n === 12 && lbl === 'Xác nhận OK' && (vals.yeuTo || []).some((r) => !r.dung)) return 'Có yếu tố chưa đúng — chọn “Không OK” và nhập lý do.';
    /* T29 B3b (BR-DXMS-04-11): Báo giá đạt — đủ trường báo giá, mỗi hạng mục có báo giá còn hiệu lực, chọn khác giá thấp nhất có lý do. */
    if (n === 10 && /^Báo giá đạt/.test(lbl) && window.BaoGia && window.BaoGia.applies(tok)) { const pb = window.BaoGia.problems(); if (pb.length) return pb[0]; }
    if (n === 7 && !kdt() && window.RaSoatKho && !window.RaSoatKho.done()) return 'Chưa có kết quả rà soát tồn kho của Phòng Quản lý tài sản — chưa xác nhận được bước 7.';
    if (n === 7 && (vals.ruaSoatKho || []).some((r) => r.coKho && r.fromStock > r.max)) return 'Số dùng từ kho vượt số khả dụng hoặc số đề xuất.';
    /* BR-DXMS-03-06: mọi hạng mục dùng hết từ kho → không còn nhu cầu mua. */
    if (n === 7 && !kdt() && (vals.ruaSoatKho || []).length && (vals.ruaSoatKho || []).every((r) => (r.prop || 0) - (r.coKho ? r.fromStock || 0 : 0) <= 0)) return 'Mọi hạng mục đều dùng từ kho, không còn phần phải mua. Giảm Dùng từ kho hoặc Hủy hồ sơ.';
    /* Comment #8: chỉ duyệt tổng thể khi mọi phần Đạt; Không đồng ý cần ít nhất một phần Không đạt. */
    if (!kdt() && n === 13 && vals.duyetPhan) {
      const bad = vals.duyetPhan.filter((r) => r.ketQua === 'Không đạt').length;
      if (lbl === 'Đồng ý' && bad) return `Còn ${bad} phần Không đạt — chưa duyệt tổng thể được. Chọn “Từ chối” để trả lại người soạn.`;
      if (lbl === 'Không đồng ý' && !bad) return 'Chọn Không đạt cho ít nhất một phần.';
    }
    return null;
  }

  /* Xem trước văn bản với giá trị form đang soạn (chưa lưu): vals chồng lên biến hồ sơ trong lúc dựng văn bản (LIVE), rồi bỏ. */
  function docLive(code, tok, vals) {
    const e = window.EForms.MS01 && !kdt() && !Flow.state.parent ? window.EForms.MS01(tok, window.EVars.h) : null;
    const out = vals ? Object.assign({}, vals, e && e.write ? e.write(vals, tok, window.EVars.h) : {}) : null;
    LIVE = out;
    try { return doc(code); } finally { LIVE = null; }
  }
  window.EVars = {
    of, doc, docLive, check, reqDocs,
    /* Review nhi 06/11 #37: Xuất file Word Tờ trình (BM-01 / BM-09) đúng văn bản đang xem trước, theo mẫu BM-10.2.1; null nếu không phải Tờ trình ĐXMS. */
    word: (code, html) => (!Flow.state.parent && !kdt() && !adj() && (code === 'BM-01' || code === 'BM-09') ? wordOf(html) : null),
    h: { tdk, kdt, small, tt, clName, draftTask, proc, procOf, condOf, version, kdtVer, basisDoc, basisSel, quoteFail, quoteAttempt, nok, respOf, selCqcm, stg, tdKey,
      needHost, hostOf, kNeed, kd, catName, signOf, returnedFrom, aiFinal, aiOf, buyItems, rvIdx, fixOf, HOSTS, pname, lineRemain, propOf, bm04Round,
      adj, adjTh, adjBranch, adjLan, adjCross, adjRows, reviewRows, opinionsOf },
  };
})();
