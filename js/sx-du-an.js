/* Phân hệ Quản lý sản xuất — Dự án sản xuất (T71 S1, D-121): SX-02 danh sách, SX-03 thêm mới / chỉnh sửa, SX-04 chi tiết
   (tab Thông tin chung · Kế hoạch & mốc · Tài liệu · Lịch sử; các tab khác thêm ở S3–S8).
   Route: #/sx/du-an, #/sx/du-an/create, #/sx/du-an/<mã>, #/sx/du-an/<mã>/edit. Dữ liệu mẫu ở sx-data.js; thay đổi người dùng lưu localStorage (sx-proto-du-an).
   Kế hoạch & mốc = khung 15 bước QT.VHT.TTSX.4A.1.1 (SX-KS-K1 §3.1); bước 9 có nhánh con theo Mô hình tổ chức (cấu hình, không code riêng từng dự án). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vSelect, vModal, vTreeTable, persona } = window.UI;
  const K = () => window.Thau.kit;
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();

  /* ---------- Ngày ---------- */
  const DAY = 86400000;
  const ms = (iso) => Date.parse(iso + 'T00:00:00');
  const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const today = () => ms(D.sxToday);
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');

  /* ---------- Lưu thay đổi ---------- */
  const KEY = 'sx-proto-du-an';
  let U = { created: [], edit: {}, docs: {}, hist: {}, del: [] };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const all = () => U.created.concat(D.sxProjects).filter((p) => !(U.del || []).includes(p.code)).map((p) => Object.assign({}, p, U.edit[p.code] || {}, {
    docs: (p.docs || []).concat(U.docs[p.code] || []), hist: (p.hist || []).concat(U.hist[p.code] || []) }));
  const byCode = (code) => all().find((p) => p.code === code) || null;
  const addHist = (code, act, note) => { (U.hist[code] = U.hist[code] || []).push([nowStamp(), Flow.state.persona, act, note || '']); };
  /* Cho bộ xử lý hành động của luồng (SxFlow.ACT): ghi lịch sử, cập nhật thuộc tính dự án, thêm tài liệu. */
  const log = (code, act, note) => { addHist(code, act, note); persist(); };
  const patch = (code, data, act, note) => { U.edit[code] = Object.assign(U.edit[code] || {}, data); if (act) addHist(code, act, note); persist(); };
  const addDoc = (code, d) => { (U.docs[code] = U.docs[code] || []).push(d); persist(); };

  /* ---------- Phạm vi dữ liệu theo vai (GIẢ LẬP P-241: thật = phân quyền theo đơn vị / dự án được giao của IAM) ---------- */
  const SCOPE = { sxld: { khoi: 'K1' }, sxpm: { khoi: 'K1' }, sxsub: { khoi: 'K1' }, sxrd: { khoi: 'K1' }, sxk2: { khoi: 'K2' }, sxnm: { factory: 'NM-HP' } };
  /* Ngoài phạm vi vai: người được giao việc trên hồ sơ của dự án (đang chờ hoặc đã xử lý) vẫn xem được dự án đó (như quyền xem theo người xử lý của engine). */
  const involved = (p, id) => !!window.SxFlow && window.SxFlow.cases(p.code).some((c) => c.tokens.some((t) => t.who === id) || c.hist.some((h) => h.who === id));
  const visible = () => { const id = Flow.state.persona, s = SCOPE[id]; return all().filter((p) => !s || (s.khoi ? p.khoi === s.khoi : p.factory === s.factory) || involved(p, id)); };
  const isAdmin = () => D.allAccess(Flow.state.persona) || Flow.state.persona === 'qt';
  const canCreate = () => isAdmin() || D.roleOf(Flow.state.persona) === 'R-SX-PM';
  /* Đang chờ Ban Giám đốc Khối (hồ sơ SX-KH ở bước 2 hoặc 4) thì khoá; bị trả về bước 1 / 3 thì sửa lại được. */
  const inReview = (p) => { const c = window.SxFlow && window.SxFlow.running(p.code, 'SX-KH'); return !!c && c.tokens.some((t) => [2, 4, 5].includes(Number(t.step))); };
  const canEdit = (p) => p.status === 'PLANNING' && (isAdmin() || p.pm === Flow.state.persona) && !inReview(p);
  /* T71 S12 (D-124): Xoá chỉ khi dự án chưa khởi tạo luồng nào (không có hồ sơ của bất kỳ quy trình nào) và chưa có bản ghi con (đề xuất mua sắm, nhu cầu vật tư, công việc,
     phiếu bất thường, thay đổi kỹ thuật, nghiệm thu) — BE: API xoá trả lỗi khi có process instance gắn đối tượng hoặc còn bản ghi con. */
  const hasChild = (code) => [window.SxMs, window.SxNc, window.SxCv, window.SxBt, window.SxTd, window.SxNt].some((m) => m && m.all().some((x) => x.project === code));
  const canDel = (p) => p.status === 'PLANNING' && !p.baseline && (isAdmin() || p.pm === Flow.state.persona || p.creator === Flow.state.persona)
    && !!window.SxFlow && !window.SxFlow.cases(p.code).length && !hasChild(p.code);

  /* ---------- Tra cứu ---------- */
  const catName = (key, code) => { const r = window.Catalog.rows(key).find((x) => x.code === code); return r ? r.name : (code || ''); };
  const KHOI = { K1: 'Khối 1', K2: 'Khối 2' };
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const prodOf = (code) => D.sxProducts.find((x) => x.code === code) || null;
  const stBadge = (p) => badge(D.sxStatus[p.status], D.sxStatusV[p.status]);

  /* ---------- Kế hoạch & mốc (khung QT.VHT.TTSX.4A.1.1) ----------
     Mỗi nhóm [mã, tên, từ, đến (tỷ lệ thời gian dự án), bước]; bước [mã, tên, vai, khoảng trong nhóm?, điều kiện?]. */
  /* T74 #97: M1 = "Ký hợp đồng tổng thầu với VMC" (mô hình VMC tổng thầu) không còn là mốc con của bước 9 — đứng đầu giai đoạn 3, trước bước 8 (mục "3.1" của người review). */
  const G3SPAN = { M1: [0, 0.05], B8: [0, 0.08], B9: [0.05, 0.8], B10: [0.1, 0.85], B11: [0.8, 0.88], B12: [0.86, 0.92], B13: [0.9, 0.96], B14: [0.94, 1] };
  const PLAN = [
    ['G1', 'Lập kế hoạch', 0, 0.12, [['B1', 'Lập báo cáo phương án sản xuất', 'pm'], ['B2', 'Lập kế hoạch sản xuất dự án (BM.QLHDSX.01)', 'pm'], ['B3', 'Kick-off, giao nhiệm vụ, chốt kế hoạch gốc', 'pm']]],
    ['G2', 'Chuẩn bị sản xuất (4M)', 0.08, 0.35, [['B4', 'Bảo đảm vật tư và kinh phí', 'pm'], ['B5', 'Tiếp nhận hồ sơ chuyển giao, chuẩn bị quy trình công nghệ', 'rd'],
      ['B6', 'Bảo đảm nhân lực, đào tạo chuyển giao công nghệ', 'pm'], ['B7', 'Bảo đảm máy móc, công cụ dụng cụ, môi trường sản xuất', 'pm']]],
    ['G3', 'Tổ chức sản xuất và giao hàng', 0.3, 0.97, [['M1', 'Ký hợp đồng tổng thầu với VMC', 'nm', (p) => p.model === 'VMC_TONG_THAU'], ['B8', 'Thống nhất phương án tổ chức sản xuất với nhà máy (BM.QLHDSX.04)', 'pm'], ['B9', 'Theo dõi sản lượng, tiến độ thực tế', 'pm'],
      ['B10', 'Kiểm soát chất lượng công đoạn (IPQC)', 'qa'], ['B11', 'Thử nghiệm thực tế', 'rd', (p) => !!p.trial], ['B12', 'Đánh giá chất lượng xuất xưởng (OQC)', 'qa'],
      ['B13', 'Nghiệm thu cấp Tổng công ty', 'qa'], ['B14', 'Bao gói, nhập kho, đối chiếu số sê-ri', 'pm']]],
    ['G4', 'Lưu trữ và truy xuất', 0.95, 1, [['B15', 'Lưu hồ sơ sản xuất theo số sê-ri', 'pm']]],
  ];
  /* Bước 9 theo Mô hình tổ chức (danh mục sx-mo-hinh): tự sản xuất → bán thành phẩm (Sub PM); VMC tổng thầu → mốc tổng của gói; gia công → lô. */
  function b9Kids(p) {
    if (p.model === 'VHT_TU_SX') {
      return [['BTP1', 'Bán thành phẩm: Khối quang học', 'sub', [0, 0.7], p.qty], ['BTP2', 'Bán thành phẩm: Khối xử lý ảnh', 'sub', [0, 0.6], p.qty], ['BTP3', 'Bán thành phẩm: Khối nguồn', 'sub', [0.05, 0.5], p.qty],
        ['BTP4', 'Bán thành phẩm: Vỏ cơ khí', 'sub', [0, 0.55], p.qty], ['BTP5', 'Tích hợp tổ hợp hoàn chỉnh', 'sub', [0.6, 1], p.qty]];
    }
    if (p.model === 'VMC_TONG_THAU') {
      /* T74 #97: bỏ M2 "Vật tư, linh kiện về đủ" (trùng Tiến độ cung ứng của bước 4), M1 lên giai đoạn 3. */
      return [['M3', 'Hoàn thành chế tạo, tích hợp', 'nm', [0.4, 0.85]],
        ['M4', 'Hoàn thành đo kiểm tại nhà máy', 'nm', [0.8, 1]]];
    }
    const lot = p.lot || Math.ceil(p.qty / 6), n = Math.max(1, Math.ceil(p.qty / lot));
    return Array.from({ length: n }, (_, i) => { const q = Math.min(lot, p.qty - i * lot); return [`L${i + 1}`, `Lô ${i + 1} (${num(q)} ${p.unitName})`, 'nm', [i / n * 0.9, (i + 1) / n * 0.9 + 0.1], q]; });
  }
  function who(p, r) {
    if (r === 'pm') return pName(p.pm);
    if (r === 'rd') return pName('sxrd');
    if (r === 'qa') return pName('sxqa');
    if (r === 'sub') return pName(p.khoi === 'K1' ? 'sxsub' : p.pm);
    return p.factory ? catName('sx-don-vi', p.factory) : 'Đơn vị sản xuất (chưa chọn)';
  }
  /* Tiến độ GIẢ LẬP theo ngày (thật: cập nhật ở các bước luồng, sản lượng nhập tay / trạm đo VMMS — S2, S5): leaf qua hạn = hoàn thành nếu dự án bám kế hoạch (perf ≥ 0,9). */
  /* Điều chỉnh kế hoạch (popup Sửa ở tab Kế hoạch & mốc, sx-ke-hoach.js): lần đã duyệt thay người phụ trách, ngày bắt đầu / kết thúc của hạng mục; lần chờ duyệt chỉ gắn cờ. */
  /* Nhóm / hạng mục thêm mới: điều chỉnh đã duyệt ghi đè người phụ trách và ngày (nhóm: ghi đè sau khi gộp từ mục con); lần chờ duyệt chỉ gắn cờ. */
  function ovr(p, node) {
    const kh = window.SxKh, ov = kh && kh.override(p, node.key);
    if (ov) Object.assign(node, { who: ov.who, s: ov.s, e: ov.e });
    if (kh && kh.pendingAdj(p, node.key)) node.adjPending = true;
    return node;
  }
  function leaf(p, gi, key, name, role, s, e) {
    const kh = window.SxKh, ov = kh && kh.override(p, key);
    const r = leaf0(p, gi, key, name, role, ov ? ov.s : s, ov ? ov.e : e);
    if (ov) r.who = ov.who;
    if (kh && kh.pendingAdj(p, key)) r.adjPending = true;
    return r;
  }
  function leaf0(p, gi, key, name, role, s, e) {
    let pct = 0, act = null;
    /* Đã chốt kế hoạch gốc (bước 3 kick-off) nghĩa là giai đoạn Lập kế hoạch đã xong — thực tế không muộn hơn ngày chốt. */
    if (gi === 0 && p.baseline) return { key, name, who: who(p, role), s, e, pct: 100, act: Math.min(e, ms(p.baseline)) };
    /* T71 S5: hạng mục bước 9 (bán thành phẩm / mốc / lô) lấy % và ngày hoàn thành thực tế từ nhật ký sản lượng (sx-btp.js), không còn giả lập theo ngày. */
    if (/^B9\./.test(key) && window.SxBtp) { const r = window.SxBtp.progress(p, key.slice(3)); return { key, name, who: who(p, role), s, e, pct: r.pct, act: r.act }; }
    /* T74 #97: mốc Ký hợp đồng tổng thầu (M1, đầu giai đoạn 3) vẫn đọc nhật ký sản lượng / mốc như trước. */
    if (key === 'M1' && window.SxBtp) { const r = window.SxBtp.progress(p, 'M1'); return { key, name, who: who(p, role), s, e, pct: r.pct, act: r.act }; }
    /* T74 #97: bước 4 có 2 mục con — Đề xuất mua sắm (% dòng nhu cầu VHT mua đã gửi ĐTMS), Tiến độ cung ứng (% số lượng đã tập kết / nhu cầu). Chưa có nhu cầu vật tư → theo công việc / ngày. */
    if (/^B4\./.test(key) && window.SxNc) {
      const r = sup4(p, key.slice(3));
      if (r != null) return { key, name, who: who(p, role), s, e, pct: r, act: r >= 100 ? Math.min(e, today()) : null };
      const w4 = window.SxCv && (window.SxCv.planProgress(p.code, key) || window.SxCv.planProgress(p.code, 'B4'));
      if (w4) return { key, name, who: who(p, role), s, e, pct: w4.pct, act: w4.act };
    }
    /* (b) Q10: bước 11 lấy % từ thử nghiệm thực tế (kịch bản 20%, kế hoạch duyệt 50%, kết quả Đạt 100%). */
    if (key === 'B11' && window.SxNt && window.SxNt.trialPct(p) != null) return { key, name, who: who(p, role), s, e, pct: window.SxNt.trialPct(p), act: null };
    /* T71 S9: hạng mục đã giao công việc (Giao việc / kick-off) lấy % và ngày hoàn thành thực tế từ công việc cấp 1 gắn hạng mục (sx-cong-viec.js). */
    const w = window.SxCv && window.SxCv.planProgress(p.code, key);
    if (w) return { key, name, who: who(p, role), s, e, pct: w.pct, act: w.act };
    if (gi + 1 <= (p.cap || 0) && p.baseline) {
      const f = Math.max(0, Math.min(1, (today() - s) / Math.max(DAY, e - s))), perf = p.perf || 0;
      pct = f >= 1 ? (perf >= 0.9 ? 100 : Math.round(perf * 100)) : Math.round(f * perf * 100);
      if (pct >= 100) act = e + Math.round((1 - perf) * 40) * DAY;
    }
    return { key, name, who: who(p, role), s, e, pct, act };
  }
  /* % mục con bước 4 từ Nhu cầu vật tư (SX-17): MS = dòng VHT mua có thiếu / có đề xuất → tỷ lệ đã gửi ĐTMS; CU = số lượng tập kết / nhu cầu. null = không có dữ liệu. GIẢ LẬP P-270. */
  let IN4 = false; // Nhu cầu vật tư tính ngày cần từ planOf → chặn gọi lồng (lần lồng trả null, mục con theo công việc / ngày)
  function sup4(p, part) {
    if (IN4) return null;
    let rows;
    IN4 = true;
    try { rows = window.SxNc.all().filter((r) => r.project === p.code); } finally { IN4 = false; }
    if (LATE4.includes(p.status)) return rows.length ? 100 : null; // đã vào sản xuất: mua sắm, cung ứng coi như xong
    if (part === 'MS') {
      const need = rows.filter((r) => r.buyer === 'VHT' && (r.short > 0 || r.prop));
      return need.length ? Math.round(need.filter((r) => r.prop && r.prop.sent).length / need.length * 100) : null;
    }
    const q = rows.reduce((a, r) => a + (r.qty || 0), 0);
    if (!q) return null;
    return Math.min(100, Math.round(rows.reduce((a, r) => a + Math.min(r.qty || 0, (r.sup && r.sup.qty) || 0), 0) / q * 100));
  }
  const LATE4 = ['IN_PRODUCTION', 'ACCEPTANCE', 'DONE'];
  function roll(node) {
    /* T74 #97: hạng mục thêm mới chưa phê duyệt (pending) hiện trên cây nhưng không tính vào ngày, % của nhóm. */
    const k = node.children.filter((x) => !x.pending);
    node.s = Math.min(...k.map((x) => x.s)); node.e = Math.max(...k.map((x) => x.e));
    const w = k.reduce((a, x) => a + (x.e - x.s || DAY), 0);
    node.pct = Math.round(k.reduce((a, x) => a + x.pct * (x.e - x.s || DAY), 0) / w);
    node.act = k.every((x) => x.act) ? Math.max(...k.map((x) => x.act)) : null;
    return node;
  }
  /* T74 #97: hạng mục thêm bằng [Thêm kế hoạch] (sx-ke-hoach.js) — % lấy từ công việc gắn hạng mục, chưa có thì 0. base = chỉ khung QT, không kèm hạng mục thêm. */
  const extraLeaves = (p, parent, base) => (base || !window.SxKh ? [] : window.SxKh.extra(p, parent).map((a) => {
    const w = window.SxCv && window.SxCv.planProgress(p.code, a.key);
    return ovr(p, { key: a.key, name: a.name, who: a.who, s: a.s, e: a.e, pct: w ? w.pct : 0, act: w ? w.act : null, pending: a.pending, added: true });
  }));
  function planOf(p, base) {
    const S0 = ms(p.start), E0 = ms(p.end), span = (a, b) => [S0 + (E0 - S0) * a, S0 + (E0 - S0) * b];
    return PLAN.map(([gk, gn, ga, gb, steps], gi) => {
      const list = steps.filter((x) => !x[3] || x[3](p));
      const children = list.map((st, i) => {
        const [k, n, role] = st;
        const rel = gk === 'G3' ? G3SPAN[k] : [i / list.length, (i + 1) / list.length];
        const [s, e] = span(ga + (gb - ga) * rel[0], ga + (gb - ga) * rel[1]);
        const label = /^B\d/.test(k) ? `${k.slice(1)}. ${n}` : n; // mục ngoài 15 bước QT (M1) không đánh số
        /* T74 #97: bước 4 = nhóm 2 mục con Đề xuất mua sắm, Tiến độ cung ứng. */
        if (k === 'B4') {
          return ovr(p, roll({ key: k, name: label, who: who(p, role),
            children: [['MS', 'Đề xuất mua sắm', [0, 0.6]], ['CU', 'Tiến độ cung ứng', [0.2, 1]]].map(([ck, cn, [a, b]]) => leaf(p, gi, `B4.${ck}`, cn, role, s + (e - s) * a, s + (e - s) * b)).concat(extraLeaves(p, k, base)) }));
        }
        if (k !== 'B9') return leaf(p, gi, k, label, role, s, e);
        return ovr(p, roll({ key: k, name: `${k.slice(1)}. ${n}`, who: who(p, role),
          children: b9Kids(p).map(([ck, cn, cr, [a, b]]) => leaf(p, gi, `${k}.${ck}`, cn, cr, s + (e - s) * a, s + (e - s) * b)).concat(extraLeaves(p, k, base)) }));
      });
      return ovr(p, roll({ key: gk, name: gn, who: pName(p.pm), children: children.concat(extraLeaves(p, gk, base)) }));
    });
  }
  const leaves = (rows) => rows.flatMap((r) => (r.children ? leaves(r.children) : [r]));
  const progressOf = (p) => { const g = planOf(p); return roll({ children: g }).pct; };
  const stOf = (r) => (r.pending ? ['Chưa phê duyệt', 'warning'] : r.pct >= 100 ? ['Hoàn thành', 'success'] : today() < r.s ? ['Chưa bắt đầu', 'default'] : today() > r.e ? ['Chậm tiến độ', 'error'] : ['Đang thực hiện', 'info']);
  const delay = (r) => (r.act ? Math.max(0, Math.round((r.act - r.e) / DAY)) : r.pct < 100 && today() > r.e ? Math.round((today() - r.e) / DAY) : null);
  const lateCount = (p) => leaves(planOf(p)).filter((r) => stOf(r)[0] === 'Chậm tiến độ').length;

  /* ---------- SX-02 Danh sách dự án sản xuất ---------- */
  const href = (p) => 'sx/du-an/' + encodeURIComponent(p.code);
  const rowOf = (p) => Object.assign({}, p, { pmN: pName(p.pm), facN: p.factory ? catName('sx-don-vi', p.factory) : '', modelN: catName('sx-mo-hinh', p.model),
    prog: progressOf(p), late: lateCount(p), prodN: `${p.product} · ${p.version}` });
  /* Ô tổng hợp số lượng (nhánh hoaidt10): lọc nhanh như Nhiệm vụ đơn vị — bấm lại ô đang chọn hoặc Tổng số để bỏ lọc. */
  const DTILE = { cur: 'all' };
  const DTILES = [['all', 'Tổng số', 'Mọi dự án trong phạm vi xem'], ['PLANNING', 'Lập kế hoạch', 'Chưa phê duyệt kế hoạch'], ['PREPARING', 'Chuẩn bị sản xuất', 'Chuyển giao, mua sắm, bàn giao nhà máy'],
    ['IN_PRODUCTION', 'Đang sản xuất', 'Tổ chức sản xuất và giao hàng'], ['ACCEPTANCE', 'Nghiệm thu', 'Có lô nghiệm thu, nhập kho'], ['DONE', 'Hoàn thành', 'Đã hoàn thành các giai đoạn'], ['late', 'Có mốc chậm', 'Còn hạng mục chậm kế hoạch', 't-err']];
  const dTileOk = (t, p) => (t === 'all' ? true : t === 'late' ? p.late > 0 : p.status === t);
  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (dự án sản xuất = đối tượng cha, như ĐXMS / KĐT / KHLCNT)
    const k = K();
    const all = visible().map(rowOf), cur = DTILE.cur;
    const tiles = `<div class="rp-tiles tq-metrics" data-sxda-tiles>${DTILES.map(([t, l, d, c]) => `<button type="button" class="ov-tile rp-tile tq-m ${cur === t ? 'on' : ''}" data-sxda-tile="${t}" aria-pressed="${cur === t}">
      <span class="ov-tx"><span class="t">${esc(l)}</span><span class="d">${esc(d)}</span></span><span class="ov-n"><span class="n num ${c && all.some((p) => dTileOk(t, p)) ? c : ''}">${all.filter((p) => dTileOk(t, p)).length}</span></span></button>`).join('')}</div>`;
    const info = {
      scr: 'SX-02', name: 'Danh sách dự án sản xuất', uc: 'CDS-BT-03COP COP2 A01 (quản lý nhiệm vụ từ khi hình thành), B1; SX-KS-K1 §2.3; SX-KS-K2 §2.2, RBAC MOD-04 F4.1',
      notes: [
        'Dự án sản xuất là <b>đối tượng cha</b> của phân hệ (như ĐXMS / KĐT): hồ sơ con chạy luồng (phê duyệt kế hoạch, chuyển giao, bất thường, thay đổi kỹ thuật, nghiệm thu) gắn vào dự án ở các lát S2–S8.',
        'Theo dõi từ khi có nhiệm vụ, <b>trước khi</b> kế hoạch được phê duyệt (CDS-BT-03COP §2.4): dự án mới ở trạng thái Lập kế hoạch.',
        'Phạm vi dữ liệu theo vai (GIẢ LẬP P-241): vai Khối 1 thấy dự án Khối 1, vai Khối 2 thấy Khối 2, vai Nhà máy chỉ thấy dự án giao cho nhà máy của mình; Lãnh đạo Khối 1 thấy Khối 1; QA, Kinh doanh, Quản trị thấy tất cả. Thật: phân quyền theo đơn vị / dự án của IAM.',
        'Tiến độ (%) và Mốc chậm tính từ tab Kế hoạch & mốc. Không có cột Thao tác (như D-43): mở chi tiết bằng mã; <b>Xoá</b> ở Chi tiết dự án, chỉ khi dự án chưa khởi tạo quy trình nào và chưa có bản ghi con (T71 S12).',
        '<b>Xuất Excel</b>: mọi dòng thỏa tìm kiếm / bộ lọc đang áp, đúng các cột đang hiện (BE xuất .xlsx; prototype tải .csv). <b>Nhập Excel</b>: file mẫu, kiểm lỗi từng dòng (sản phẩm, khối, mô hình, Giám đốc dự án, ngày), chỉ ghi khi Xác nhận nhập; dự án nhập vào ở trạng thái Lập kế hoạch, mã hệ thống tự sinh.',
      ],
      q: ['P-241', 'P-242', 'P-243', 'P-262'], src: 'task-management/task-management.component · /task-management',
    };
    const yes = [{ value: 'CO', label: 'Có' }, { value: 'KHONG', label: 'Không' }];
    return k.listPage({
      id: 'sxda', exp: 'Danh sach du an san xuat', title: 'Danh sách dự án sản xuất', ph: 'Tìm kiếm theo mã, tên dự án, sản phẩm', info,
      right: canCreate() ? `<button type="button" class="vbtn secondary" data-sxda-import>${icon('upload')} Nhập Excel</button><button class="vbtn primary" data-go="sx/du-an/create">${icon('add')} Thêm mới</button>` : '',
      top: `<div data-sxda-list>${tiles}</div>`,
      rows: () => visible().map(rowOf).filter((p) => dTileOk(DTILE.cur, p)), kwText: (p) => `${p.code} ${p.name} ${p.prodN}`,
      empty: () => ({ code: '', name: '', khoi: null, model: null, st: [], factory: null, pm: null, late: null }),
      match: (p, f) => k.has(f.code, p.code) && k.has(f.name, p.name) && (!f.khoi || p.khoi === f.khoi) && (!f.model || p.model === f.model) && k.inSet(f.st, p.status)
        && (!f.factory || p.factory === f.factory) && (!f.pm || p.pm === f.pm) && (!f.late || (f.late === 'CO') === p.late > 0),
      adv: (txt, sel) => `${txt('code', 'Mã dự án')}${txt('name', 'Tên dự án')}
        ${sel('khoi', 'Khối', { searchable: false, options: Object.entries(KHOI).map(([value, label]) => ({ value, label })) })}
        ${sel('model', 'Mô hình tổ chức', { options: k.catOpts('sx-mo-hinh') })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(D.sxStatus).map(([value, label]) => ({ value, label })) })}
        ${sel('factory', 'Đơn vị sản xuất', { options: k.catOpts('sx-don-vi') })}
        ${sel('pm', 'Giám đốc dự án', { options: D.personas.filter((x) => x.urd === 'R-SX-PM').map((x) => ({ value: x.id, label: x.name })) })}
        ${sel('late', 'Có mốc chậm', { searchable: false, options: yes })}`,
      cols: [['Trạng thái', 160, 'c'], ['Mã dự án', 150], ['Tên dự án', 320], ['Sản phẩm · phiên bản', 200], ['Khối', 90], ['Mô hình tổ chức', 200], ['Số lượng', 120, 'r'],
        ['Đơn vị sản xuất', 220], ['Giám đốc dự án', 180], ['Ngày bắt đầu', 120], ['Ngày kết thúc', 120], ['Tiến độ', 100, 'r'], ['Mốc chậm', 100, 'c']],
      href,
      cell: (p) => `<td class="c">${stBadge(p)}</td><td><a class="link" data-go="${href(p)}" title="Xem chi tiết dự án">${esc(p.code)}</a></td><td>${k.clamp(p.name)}</td><td>${k.clamp(p.prodN)}</td>
        <td>${esc(KHOI[p.khoi])}</td><td>${k.clamp(p.modelN)}</td><td class="r num">${num(p.qty)} ${esc(p.unitName)}</td><td>${k.clamp(p.facN)}</td><td>${k.clamp(p.pmN)}</td>
        <td class="num">${esc(dmy(p.start))}</td><td class="num">${esc(dmy(p.end))}</td><td class="r num">${p.prog}%</td>
        <td class="c">${p.late ? badge(String(p.late), 'error') : k.dash}</td>`,
    });
  }

  /* ---------- SX-03 Thêm mới / Chỉnh sửa ---------- */
  const F = { code: null, v: {}, err: {} };
  function resetForm(code) {
    F.code = code || null; F.err = {};
    const p = code && byCode(code);
    F.v = p ? { name: p.name, khoi: p.khoi, basisKind: (p.basis || [])[0] || null, basisNo: p.pakd ? '' : (p.basis || [])[1] || '', pakd: p.pakd || null, basisFile: p.basisFile || '', khsxkd: p.khsxkd || null,
      product: p.product, model: p.model, qty: String(p.qty), unitName: p.unitName, trial: p.trial == null ? null : p.trial ? 'Y' : 'N', prev: p.prev || null,
      factory: p.factory || null, pm: p.pm, start: dmy(p.start), end: dmy(p.end), customer: p.customer || '', goal: p.goal || '' }
      : { name: '', khoi: (SCOPE[Flow.state.persona] || {}).khoi || null, basisKind: 'PAKD', basisNo: '', pakd: null, basisFile: '', khsxkd: null, product: null, model: null, qty: '', unitName: 'bộ',
        trial: null, prev: null, factory: null, pm: D.roleOf(Flow.state.persona) === 'R-SX-PM' ? Flow.state.persona : null, start: '', end: '', customer: '', goal: '' };
    /* (b) Q13: Lập dự án đợt tiếp theo từ dự án Hoàn thành — chép thông tin, để trống căn cứ (P-265). */
    if (!p && NEXT.from) {
      const o = byCode(NEXT.from);
      if (o) Object.assign(F.v, { name: o.name.replace(/\s*—\s*đợt \d+$/, '') + ' — đợt tiếp theo', khoi: o.khoi, product: o.product, model: o.model, unitName: o.unitName, trial: o.trial ? 'Y' : 'N',
        prev: o.code, factory: o.factory || null, pm: o.pm, customer: o.customer || '', goal: o.goal || '' });
      NEXT.from = null;
    }
  }
  const NEXT = { from: null };
  /* (b) Q14: PAKD đã phê duyệt còn dùng được (chưa lập dự án khác), theo khối. GIẢ LẬP P-264. */
  /* Luồng Nhiệm vụ → PASXKD → Dự án (hoaidt10 23/11): nguồn PASXKD là SxPa (sx-pasxkd.js); chỉ PASXKD Đã phê duyệt mới lập được dự án. */
  const pakdAll = () => (window.SxPa ? window.SxPa.all() : D.sxPakd || []);
  const pakdOf = (code) => pakdAll().find((x) => x.code === code) || null;
  const pakdOk = (x) => !!x && (!x.status || x.status === 'APPROVED');
  const pakdUsedBy = (code, self) => all().find((x) => x.pakd === code && x.code !== self) || null;
  function form(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create / edit)
    const k = K(), v = F.v, err = F.err, p = code ? byCode(code) : null;
    const back = p ? href(p) : 'sx/du-an';
    if (p && !canEdit(p)) return `<div class="pg">${head({ title: 'Chỉnh sửa dự án sản xuất', back, lg: true })}${k.emptyCard('Thông tin chung', 'Dự án chỉ chỉnh sửa được ở trạng thái Lập kế hoạch, bởi Giám đốc dự án.')}</div>`;
    const info = {
      scr: 'SX-03', name: p ? 'Chỉnh sửa dự án sản xuất' : 'Thêm mới dự án sản xuất', uc: 'CDS-BT-03COP COP2 B1 (tiếp nhận nhiệm vụ, hoàn thiện đầu vào); SX-KS-K2 §4.3 bước 1; RBAC F4.1',
      notes: [
        '<b>Luồng (hoaidt10 23/11)</b>: Nhiệm vụ đơn vị → Phương án sản xuất kinh doanh (PASXKD) đã phê duyệt → Thêm mới dự án. Dự án mới chỉ lập từ PASXKD <b>Đã phê duyệt</b>, chưa lập dự án (căn cứ Nhiệm vụ / Hợp đồng chỉ còn ở dự án cũ). Chọn PASXKD điền sẵn sản phẩm, số lượng, khách hàng, mô hình tổ chức, giám đốc dự án, ngày bắt đầu / kết thúc (sửa được); lưu xong gắn dự án vào nhiệm vụ của PASXKD.',
        'Khuôn task-create (mode create / edit), trang riêng có route (B6). Lưu = tạo dự án ở trạng thái <b>Lập kế hoạch</b>, chưa khởi tạo quy trình; luồng Phê duyệt kế hoạch sản xuất khởi tạo từ dự án ở S2.',
        'Mã dự án do hệ thống sinh (P-242). Khối quyết định danh mục hồ sơ chuyển giao (27 / 20 hồ sơ); Mô hình tổ chức quyết định cách chia kế hoạch ở bước 9 (bán thành phẩm / mốc tổng VMC / lô gia công) — đều là cấu hình danh mục.',
        '<b>Căn cứ hình thành</b> (QT-TTSX-4A11 §5.1: quy trình bắt đầu khi phương án sản xuất kinh doanh được phê duyệt): Phương án sản xuất kinh doanh → chọn từ danh sách PAKD đã phê duyệt, hệ thống điền sẵn sản phẩm, số lượng, khách hàng, ngày kết thúc, kế hoạch SXKD năm (sửa được); một PAKD lập một dự án (GIẢ LẬP P-264). Nhiệm vụ được giao / Hợp đồng → nhập số văn bản và đính kèm văn bản.',
        '<b>Sản phẩm</b> chỉ chọn trong Kho sản phẩm sẵn sàng sản xuất: chuyển giao R&D → sản xuất (biên bản thành phần đủ điều kiện sản xuất) là đầu vào của quy trình (QT §5.2 mục 27; P-263).',
        '<b>Có thử nghiệm thực tế</b> quyết định bước 11 của kế hoạch (nút rẽ "TN?" của lưu đồ QT-TTSX-4A11-LD). <b>Dự án đợt trước</b>: liên kết các đợt sản xuất cùng sản phẩm (P-265).',
        'Đơn vị sản xuất có thể để trống khi tạo, chọn sau khi lựa chọn nhà thầu. Chỉnh sửa được khi dự án còn ở trạng thái Lập kế hoạch.',
      ],
      q: ['P-242', 'P-243', 'P-263', 'P-264', 'P-265'], src: 'task-management/components/task-create · /task-management/create',
    };
    const prods = D.sxProducts.filter((x) => (!v.khoi || x.khoi === v.khoi) && (window.SxCg.ready(x.code) || (p && p.product === x.code))).map((x) => ({ value: x.code, label: `${x.code} — ${x.name} (${x.version})` }));
    const prod = prodOf(v.product);
    const pakds = pakdAll().filter((x) => pakdOk(x) && (!v.khoi || x.khoi === v.khoi) && !pakdUsedBy(x.code, p && p.code)).map((x) => ({ value: x.code, label: `${x.no} — ${x.title}` }));
    const khs = (D.sxKhsxkd || []).filter((x) => !v.khoi || x.khoi === v.khoi).map((x) => ({ value: x.code, label: x.title }));
    const prevs = all().filter((x) => (!p || x.code !== p.code) && (!v.product || x.product === v.product)).map((x) => ({ value: x.code, label: `${x.code} — ${x.name}` }));
    const sel = (id, key, opts, o) => vSelect(Object.assign({ id, value: v[key], searchable: true, placeholder: 'Chọn ' + ((o && o.ph) || ''), invalid: !!err[key], options: opts,
      onChange: (x) => { keep(); v[key] = x; delete err[key]; if (key === 'khoi' && prod && prod.khoi !== x) v.product = null; if (key === 'pakd') fillPakd(x); if (key === 'basisKind' && x !== 'PAKD') v.pakd = null; rerender(); } }, o || {}));
    const isPakd = v.basisKind === 'PAKD';
    const basisFields = isPakd
      ? k.field('Phương án sản xuất kinh doanh đã phê duyệt', sel('sxf-pakd', 'pakd', pakds, { ph: 'phương án sản xuất kinh doanh' }), { req: true, err: err.pakd, cls: 'span2' })
      : `${k.field('Số, ký hiệu văn bản căn cứ', `<input class="vctl" id="sxf-basisNo" maxlength="255" placeholder="Nhập số, ký hiệu văn bản" value="${esc(v.basisNo)}" ${err.basisNo ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.basisNo })}
         ${k.field('Văn bản căn cứ', `<label class="vbtn secondary">${icon('upload')} ${v.basisFile ? esc(v.basisFile) : 'Tải file lên'}<input type="file" hidden id="sxf-basisFile"></label>`, { req: !p, err: err.basisFile })}`;
    return `<form class="pg" data-sx-form="${p ? esc(p.code) : ''}">
      ${head({ title: p ? 'Chỉnh sửa dự án sản xuất' : 'Thêm mới dự án sản xuất', back, lg: true, info,
    right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung</h3>
        <div class="grid3">
          ${k.field('Mã dự án', `<input class="vctl" value="${p ? esc(p.code) : ''}" placeholder="Hệ thống tự sinh" disabled>`)}
          ${k.field('Tên dự án', `<input class="vctl" id="sxf-name" maxlength="500" placeholder="Nhập tên dự án" value="${esc(v.name)}" ${err.name ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.name, cls: 'span2' })}
          ${k.field('Khối', sel('sxf-khoi', 'khoi', Object.entries(KHOI).map(([value, label]) => ({ value, label })), { searchable: false, ph: 'khối' }), { req: true, err: err.khoi })}
          ${k.field('Căn cứ hình thành', sel('sxf-basis', 'basisKind', Object.entries(D.sxBasis).filter(([value]) => !!p || value === 'PAKD').map(([value, label]) => ({ value, label })), { searchable: false, ph: 'căn cứ', disabled: !p }), { req: true, err: err.basisKind })}
          ${basisFields}
          ${k.field('Kế hoạch sản xuất kinh doanh năm', sel('sxf-khsxkd', 'khsxkd', khs, { searchable: false, clear: true, ph: 'kế hoạch sản xuất kinh doanh năm' }))}
          ${k.field('Sản phẩm', sel('sxf-product', 'product', prods, { ph: 'sản phẩm sẵn sàng sản xuất' }), { req: true, err: err.product, cls: 'span2' })}
          ${k.field('Phiên bản', `<input class="vctl" value="${esc(prod ? prod.version : '')}" placeholder="Theo sản phẩm" disabled>`)}
          ${k.field('Mô hình tổ chức sản xuất', sel('sxf-model', 'model', k.catOpts('sx-mo-hinh'), { searchable: false, ph: 'mô hình' }), { req: true, err: err.model })}
          ${k.field('Số lượng', `<input class="vctl" id="sxf-qty" inputmode="numeric" maxlength="9" placeholder="Nhập số lượng" value="${esc(v.qty)}" ${err.qty ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.qty })}
          ${k.field('Đơn vị tính', sel('sxf-unit', 'unitName', ['bộ', 'thiết bị', 'trạm', 'chiếc'].map((x) => ({ value: x, label: x })), { searchable: false, ph: 'đơn vị tính' }), { req: true })}
          ${k.field('Đơn vị sản xuất', sel('sxf-factory', 'factory', k.catOpts('sx-don-vi'), { clear: true, ph: 'đơn vị sản xuất' }))}
          ${k.field('Có thử nghiệm thực tế', sel('sxf-trial', 'trial', [{ value: 'Y', label: 'Có' }, { value: 'N', label: 'Không' }], { searchable: false, ph: 'có / không' }), { req: true, err: err.trial })}
          ${k.field('Dự án đợt trước', sel('sxf-prev', 'prev', prevs, { clear: true, ph: 'dự án đợt trước' }), { cls: 'span2' })}
          ${k.field('Giám đốc dự án', sel('sxf-pm', 'pm', D.personas.filter((x) => x.urd === 'R-SX-PM').map((x) => ({ value: x.id, label: `${x.name} — ${x.unit}` })), { ph: 'giám đốc dự án' }), { req: true, err: err.pm })}
          ${k.field('Khách hàng / đơn vị sử dụng', `<input class="vctl" id="sxf-customer" maxlength="255" placeholder="Nhập khách hàng / đơn vị sử dụng" value="${esc(v.customer)}">`)}
          ${k.field('Ngày bắt đầu', window.UI.vDate('id="sxf-start"', v.start, { invalid: !!err.start }), { req: true, err: err.start })}
          ${k.field('Ngày kết thúc', window.UI.vDate('id="sxf-end"', v.end, { invalid: !!err.end }), { req: true, err: err.end })}
          ${k.field('Mục tiêu', `<textarea class="vctl" id="sxf-goal" rows="3" maxlength="2000" placeholder="Nhập mục tiêu, kết quả then chốt">${esc(v.goal)}</textarea>`, { cls: 'span3' })}
        </div></section></form>`;
  }
  /* Chọn PAKD: điền sẵn theo phương án sản xuất kinh doanh (người dùng sửa được); sản phẩm chưa chuyển giao thì để trống để chọn sản phẩm sẵn sàng sản xuất. */
  function fillPakd(code) {
    const x = pakdOf(code), v = F.v;
    if (!x) return;
    const pr = prodOf(x.product);
    Object.assign(v, { khoi: x.khoi, qty: String(x.qty), unitName: x.unitName, customer: x.customer, end: dmy(x.due), khsxkd: x.kh, product: pr && window.SxCg.ready(pr.code) ? pr.code : null });
    if (!v.name.trim()) v.name = x.title.replace(/^Phương án sản xuất kinh doanh/, 'Sản xuất');
    if (x.model) v.model = x.model;
    if (x.pm && D.roleOf(x.pm) === 'R-SX-PM') v.pm = x.pm;
    if (x.start) v.start = dmy(x.start);
    if (!v.product) F.err.product = `Sản phẩm ${x.product} của phương án sản xuất kinh doanh chưa có trong Kho sản phẩm sẵn sàng sản xuất.`;
  }
  document.addEventListener('change', (e) => {
    if (e.target.id !== 'sxf-basisFile' || !e.target.files || !e.target.files[0]) return;
    keep(); F.v.basisFile = e.target.files[0].name; delete F.err.basisFile; rerender();
  });
  /* Giữ chữ đã gõ khi vẽ lại (đổi ô chọn). */
  function keep() {
    const g = (id) => document.getElementById(id);
    [['name', 'sxf-name'], ['basisNo', 'sxf-basisNo'], ['qty', 'sxf-qty'], ['customer', 'sxf-customer'], ['start', 'sxf-start'], ['end', 'sxf-end'], ['goal', 'sxf-goal']]
      .forEach(([k, id]) => { if (g(id)) F.v[k] = g(id).value; });
  }
  function save() {
    keep();
    const v = F.v, err = F.err = {};
    if (!v.name.trim()) err.name = 'Bạn cần nhập Tên dự án.';
    if (!v.khoi) err.khoi = 'Bạn cần chọn Khối.';
    if (!v.basisKind) err.basisKind = 'Bạn cần chọn Căn cứ hình thành.';
    else if (v.basisKind === 'PAKD') {
      if (!v.pakd) err.pakd = 'Bạn cần chọn Phương án sản xuất kinh doanh đã phê duyệt.';
      else if (!pakdOk(pakdOf(v.pakd))) err.pakd = 'Phương án sản xuất kinh doanh chưa được phê duyệt.';
      else if (pakdUsedBy(v.pakd, F.code)) err.pakd = `Phương án sản xuất kinh doanh đã được lập dự án ${pakdUsedBy(v.pakd, F.code).code}.`;
    } else {
      if (!v.basisNo.trim()) err.basisNo = 'Bạn cần nhập Số, ký hiệu văn bản căn cứ.';
      if (!F.code && !v.basisFile) err.basisFile = 'Bạn cần tải lên Văn bản căn cứ.';
    }
    if (!v.product) err.product = 'Bạn cần chọn Sản phẩm.';
    else if (!window.SxCg.ready(v.product) && !(F.code && (byCode(F.code) || {}).product === v.product)) err.product = 'Sản phẩm chưa có trong Kho sản phẩm sẵn sàng sản xuất.';
    if (!v.trial) err.trial = 'Bạn cần chọn Có thử nghiệm thực tế.';
    if (!v.model) err.model = 'Bạn cần chọn Mô hình tổ chức sản xuất.';
    if (!/^\d+$/.test(String(v.qty).trim()) || Number(v.qty) <= 0) err.qty = 'Số lượng phải là số nguyên lớn hơn 0.';
    if (!v.pm) err.pm = 'Bạn cần chọn Giám đốc dự án.';
    const s = fromDmy(v.start), e = fromDmy(v.end);
    if (!s) err.start = 'Bạn cần nhập Ngày bắt đầu đúng định dạng DD/MM/YYYY.';
    if (!e) err.end = 'Bạn cần nhập Ngày kết thúc đúng định dạng DD/MM/YYYY.';
    else if (s && ms(e) <= ms(s)) err.end = 'Ngày kết thúc phải sau Ngày bắt đầu.';
    if (Object.keys(err).length) { rerender(); return; }
    const prod = prodOf(v.product);
    const pk = v.basisKind === 'PAKD' ? pakdOf(v.pakd) : null;
    const data = { name: v.name.trim(), khoi: v.khoi, basis: pk ? ['PAKD', `PAKD số ${pk.no} ngày ${dmy(pk.date)}`] : [v.basisKind, v.basisNo.trim()], pakd: pk ? pk.code : null,
      basisFile: pk ? '' : v.basisFile, khsxkd: v.khsxkd || null, product: v.product, version: prod.version, model: v.model, qty: Number(v.qty), unitName: v.unitName,
      trial: v.trial === 'Y', prev: v.prev || null, factory: v.factory || null, pm: v.pm, start: s, end: e, customer: v.customer.trim(), goal: v.goal.trim() };
    let code = F.code;
    if (code) {
      U.edit[code] = Object.assign(U.edit[code] || {}, data);
      addHist(code, 'Cập nhật thông tin dự án', '');
      toast('<b>Thành công</b><br>Cập nhật thành công!');
    } else {
      const n = Math.max(0, ...all().filter((p) => p.code.startsWith('DA-SX-2026-')).map((p) => Number(p.code.slice(-3)))) + 1;
      code = 'DA-SX-2026-' + String(n).padStart(3, '0');
      /* Văn bản căn cứ vào tab Tài liệu: PAKD lấy từ hệ thống nguồn (GIẢ LẬP P-264), Nhiệm vụ / Hợp đồng là tệp người dùng tải lên. */
      const doc = pk ? [`PAKD ${pk.no.replace(/\//g, '-')}.pdf`, 'PAKD', 'v1.0', Flow.state.persona, D.sxToday] : [v.basisFile, v.basisKind, 'v1.0', Flow.state.persona, D.sxToday];
      U.created.unshift(Object.assign({ code, status: 'PLANNING', perf: 0, cap: 0, baseline: null, creator: Flow.state.persona, created: D.sxToday, docs: [doc], hist: [] }, data));
      addHist(code, 'Tạo dự án', pk ? `Từ phương án sản xuất kinh doanh ${pk.no}` : '');
      /* Gắn dự án vào nhiệm vụ đơn vị của PASXKD (nhiệm vụ → PASXKD → dự án). */
      if (pk && pk.nv && window.SxCv && window.SxCv.linkProject) window.SxCv.linkProject(pk.nv, code);
      toast('<b>Thành công</b><br>Thêm mới thành công!');
    }
    persist();
    /* Lưu xong về tab Thông tin chung để thấy thông tin vừa nhập. */
    K().setTab('sx:' + code, 'info');
    location.hash = '#/' + href({ code });
  }

  /* ---------- SX-04 Chi tiết dự án ---------- */
  function detail(code, opt) {
    const o = opt || {};
    // Theo: task-create (mode detail) + app-tabs (@khcn-core/ui), như SCR-86 Chi tiết hợp đồng; bảng kế hoạch vht-tree-table như SCR-104 Dự toán chi phí
    const k = K(), p = byCode(code);
    if (!p || !visible().some((x) => x.code === code)) {
      return `<div class="pg">${head({ title: o.title || 'Xem chi tiết dự án sản xuất', back: o.back || 'sx/du-an', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy dự án sản xuất hoặc bạn không có quyền xem.')}</div>`;
    }
    const plan = planOf(p), prog = roll({ children: plan }).pct, late = leaves(plan).filter((r) => stOf(r)[0] === 'Chậm tiến độ');
    const info = {
      scr: 'SX-04', name: 'Chi tiết dự án sản xuất', uc: 'CDS-BT-03COP COP2 A01, A03, A08; SX-KS-K1 §3.1 (QT.VHT.TTSX.4A.1.1, 15 bước, 4 giai đoạn); SX-KS-K2 §2.2',
      notes: [
        '<b>T74 (comment #97, hoaidt10 17/11):</b> Thông tin chung thêm <b>Mã / Tên nhiệm vụ</b> (nhiệm vụ đơn vị cấp 1 của dự án, mở Chi tiết nhiệm vụ đơn vị). Tab <b>Kế hoạch & mốc</b> đứng trước <b>Phê duyệt kế hoạch</b>. Cây kế hoạch: bước 4 có 2 mục con <b>Đề xuất mua sắm</b> (% dòng nhu cầu VHT mua đã gửi ĐTMS) và <b>Tiến độ cung ứng</b> (% số lượng đã tập kết); mô hình VMC tổng thầu: mốc <b>Ký hợp đồng tổng thầu với VMC</b> đứng đầu giai đoạn 3 trước bước 8, bỏ mốc "Vật tư, linh kiện về đủ" (GIẢ LẬP P-270). Nút <b>Thêm kế hoạch</b> thêm hạng mục vào một giai đoạn / bước 4 / bước 9, ở trạng thái Chưa phê duyệt (không tính vào tiến độ) tới khi lần bổ sung được duyệt. Tab <b>Phê duyệt kế hoạch</b> = danh sách các lần phê duyệt (kế hoạch gốc, các lần bổ sung), chưa duyệt đứng đầu, bấm để xem chi tiết; Lãnh đạo Phê duyệt / Trả lại ngay trên dòng (GIẢ LẬP P-270; thật: luồng điều chỉnh kế hoạch). Tab <b>Nhân sự</b>: người phụ trách trong kế hoạch (BM.QLHDSX.01 — Nhân sự chính), Thêm / Sửa / Xoá; không xoá người đang phụ trách hạng mục. Tab Hồ sơ chuyển giao: <b>Danh mục tài liệu nhận từ COP1</b> có Phiên bản, Nguồn (đồng bộ từ Quản lý hồ sơ KHCN — GIẢ LẬP P-271), mã hồ sơ mở Chuyển giao từ nghiên cứu. <b>Điều kiện 4M → Điều kiện sản xuất</b>: Thêm điều kiện, Sửa (13 tiêu chí QT sửa được nội dung, không xoá), Xoá dòng tự thêm; dòng tự động chỉ đọc. Tab <b>Tài liệu</b> chia theo danh mục loại tài liệu.',
        'Khuôn task-create (mode detail) + app-tabs. Tab: Thông tin chung, Phê duyệt kế hoạch (hồ sơ luồng phê duyệt kế hoạch), Kế hoạch & mốc, Hồ sơ chuyển giao (gói của sản phẩm · phiên bản dự án), <b>Điều kiện 4M</b> (cổng Bắt đầu sản xuất: đủ tiêu chí mới chuyển Đang sản xuất — GIẢ LẬP P-246), <b>Mua sắm & hợp đồng</b> (đề xuất gửi ĐTMS, hợp đồng, nhập kho đọc ngược — P-249), <b>Bán thành phẩm & tiến độ</b> (nhật ký sản lượng, trạm đo VMMS — P-250), <b>Bất thường & thay đổi</b> (phiếu bất thường, hạn xử lý — P-251; thay đổi kỹ thuật, nhật ký quản lý dự án — P-252), <b>Chất lượng & nghiệm thu</b> (nghiệm thu theo lô, IQC từ VMMS — P-253), Tài liệu, Lịch sử.',
        '<b>Thao tác trên Kế hoạch</b>: icon <b>Xem chi tiết</b> (mục có màn riêng thì mở màn đó, còn lại mở hộp thoại chi tiết hạng mục và lịch sử điều chỉnh) và icon <b>Sửa</b> (mọi dòng trừ dòng Hoàn thành, kể cả nhóm; người lập kế hoạch). Giữ thứ tự giai đoạn; nhóm đã hoàn thành hết mặc định thu gọn. Sửa dòng đang chờ duyệt = cập nhật lần chờ duyệt đó. Sửa mở popup đổi người phụ trách, ngày bắt đầu / kết thúc, bắt buộc <b>Lý do sửa</b>; <b>Gửi duyệt</b> tạo lần "Điều chỉnh kế hoạch" ở tab Phê duyệt kế hoạch, dòng hiện nhãn Chờ duyệt điều chỉnh; được duyệt mới đổi trên cây kế hoạch, bị trả lại thì sửa và gửi lại.',
        '<b>Kế hoạch & mốc</b>: khung 15 bước QT.VHT.TTSX.4A.1.1 chia 4 giai đoạn; bước 9 có nhánh con theo <b>Mô hình tổ chức</b> (cấu hình danh mục): tự sản xuất → bán thành phẩm do Sub PM phụ trách; VMC tổng thầu → mốc tổng của gói; thuê gia công → lô (SX-GA-0911 Phần 3). Bước 11 chỉ có khi dự án <b>Có thử nghiệm thực tế</b> (QT-TTSX-4A11-LD nút rẽ "TN?").',
        'Kế hoạch gốc chốt ở bước 5 luồng Phê duyệt kế hoạch sản xuất (S2). Ngày kế hoạch khung chia theo tỷ lệ thời gian dự án; % hoàn thành GIẢ LẬP theo ngày (thật: bước luồng hoàn thành, sản lượng nhập tay / trạm đo VMMS — S5). Ngày hiện tại của phân hệ: ' + dmy(D.sxToday) + '.',
        'Hiển thị bằng bảng cây (vht-tree-table) với cột kế hoạch / thực tế / chênh lệch; <b>biểu đồ Gantt cần dev riêng</b> (@khcn-core/ui chưa có component, D-121 Q8).',
        '<b>Dữ liệu VMMS</b> (T71 S12, D-124 — giữ D-121 Q5 chỉ xem): cấu trúc EBOM / MBOM theo phiên bản (dòng thay theo ECN đánh dấu), lịch sử thay đổi, thiết bị và nhân công của đơn vị sản xuất, lệnh sản xuất theo hạng mục bước 9; nút Đồng bộ ngay gọi API VMMS (job 06:00 hằng ngày). Không sửa ở QLSX — thay đổi cấu trúc qua ECR / ECN (P-256).',
        '<b>Ký số</b>: kế hoạch đã phê duyệt có chữ ký số MySign của Lãnh đạo ở bước 4 hiện nhãn Đã ký số ở tab Tài liệu và Phê duyệt kế hoạch (GIẢ LẬP P-258). <b>Xoá</b> dự án: chỉ Lập kế hoạch, chưa khởi tạo quy trình nào, chưa có bản ghi con (P-262).',
        '<b>Tài liệu</b>: card Danh sách tài liệu chung (Chọn mẫu tài liệu, Tải file lên). Mẫu BM.QLHDSX.01 / 04 lấy từ danh mục mẫu tài liệu (GIẢ LẬP: tạo dòng tài liệu, không sinh tệp).',
      ],
      q: ['P-238', 'P-241', 'P-243', 'P-256', 'P-258', 'P-262', 'P-270', 'P-271'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs, vht-tree-table',
    };
    /* Màn xử lý việc (SX-05) dùng thân màn này: không có nút của màn chi tiết, nút hành động nằm ở thanh trạng thái. */
    const right = o.task ? '' : (window.SxFlow && window.SxFlow.canStartKh(p) ? `<button type="button" class="vbtn secondary" data-sx-kh-start="${esc(p.code)}">Khởi tạo phê duyệt kế hoạch</button>` : '')
      + (window.SxCg ? window.SxCg.headBtn(p) : '')
      + (window.SxNt ? window.SxNt.headBtn(p) : '')
      + (canDel(p) ? `<button type="button" class="vbtn secondary" data-sx-del="${esc(p.code)}">${icon('del')} Xoá</button>` : '')
      + (canEdit(p) ? `<button type="button" class="vbtn primary" data-go="${href(p)}/edit">${icon('edit')} Chỉnh sửa</button>` : '')
      + (p.status === 'DONE' && canCreate() ? `<button type="button" class="vbtn secondary" data-sx-next="${esc(p.code)}">${icon('add')} Lập dự án đợt tiếp theo</button>` : '');
    const alerts = late.length ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>${late.length} hạng mục chậm tiến độ: ${esc(late.slice(0, 3).map((r) => r.name).join('; '))}${late.length > 3 ? '…' : ''}</span></div></div>` : '';
    /* Góp ý 25/11: ở màn Xử lý công việc chỉ hiện thông tin chính của dự án (ẩn mã, căn cứ, mục tiêu, OKR, yêu cầu…); xem đủ ở Chi tiết dự án. */
    const tInfoTask = () => k.card('Thông tin chính của dự án', `<div class="ginfo c3">
        ${k.kv('Tên dự án', `<a class="link" data-go="${href(p)}" title="Xem chi tiết dự án">${esc(p.name)}</a>`, 'span2')}${k.kv('Trạng thái', stBadge(p))}
        ${k.kv('Sản phẩm', esc(`${p.product} — ${(prodOf(p.product) || {}).name || ''}`))}${k.kv('Số lượng', `${num(p.qty)} ${esc(p.unitName)}`)}${k.kv('Giám đốc dự án', esc(pName(p.pm)))}
        ${k.kv('Thời gian thực hiện', esc(`${dmy(p.start)} – ${dmy(p.end)}`))}${k.kv('Tiến độ chung', `${prog}%`)}${k.kv('Đơn vị sản xuất', p.factory ? esc(catName('sx-don-vi', p.factory)) : null)}</div>`);
    const tInfo = () => (o.task ? tInfoTask() : tInfoFull());
    const tInfoFull = () => k.card('Thông tin chung', `<div class="ginfo c3">
        ${k.kv('Mã dự án', esc(p.code))}${k.kv('Tên dự án', esc(p.name), 'span2')}
        ${k.kv('Trạng thái', stBadge(p))}${k.kv('Khối', esc(KHOI[p.khoi]))}${k.kv('Mô hình tổ chức sản xuất', esc(catName('sx-mo-hinh', p.model)))}
        ${k.kv('Sản phẩm', esc(`${p.product} — ${(prodOf(p.product) || {}).name || ''}`))}${k.kv('Phiên bản', esc(p.version))}${k.kv('Số lượng', `${num(p.qty)} ${esc(p.unitName)}`)}
        ${k.kv('Căn cứ hình thành', esc(D.sxBasis[(p.basis || [])[0]] || ''))}${k.kv('Văn bản căn cứ', p.pakd && pakdOf(p.pakd) ? `<a class="link" data-go="sx/pasxkd/${encodeURIComponent(p.pakd)}">${esc(`${(p.basis || [])[1] || ''} — ${pakdOf(p.pakd).title}`)}</a>` : esc((p.basis || [])[1] || ''), 'span2')}
        ${k.kv('Kế hoạch sản xuất kinh doanh năm', p.khsxkd ? esc(((D.sxKhsxkd || []).find((x) => x.code === p.khsxkd) || {}).title || p.khsxkd) : null)}${k.kv('Có thử nghiệm thực tế', p.trial ? 'Có' : 'Không')}
        ${k.kv('Dự án đợt trước', p.prev ? `<a class="link" data-go="${href({ code: p.prev })}">${esc(p.prev)}</a>` : null)}
        ${k.kv('Đơn vị sản xuất', p.factory ? esc(catName('sx-don-vi', p.factory)) : null)}${k.kv('Giám đốc dự án', esc(pName(p.pm)))}${k.kv('Khách hàng / đơn vị sử dụng', esc(p.customer || ''))}
        ${nvKv(p, k)}
        ${k.kv('Ngày bắt đầu', esc(dmy(p.start)))}${k.kv('Ngày kết thúc', esc(dmy(p.end)))}${k.kv('Tiến độ chung', `${prog}%`)}
        ${k.kv('Số kế hoạch', p.planNo ? esc(p.planNo) : null)}${k.kv('Ngày phê duyệt kế hoạch', p.baseline ? esc(dmy(p.baseline)) : null)}${k.kv('Cấp phê duyệt', esc(p.khoi === 'K2' ? 'Ban Giám đốc Khối 2' : 'Ban Giám đốc Khối 1'))}
        ${k.kv('Đơn vị lập kế hoạch', esc(p.unit || (KHOI[p.khoi] || '')))}${k.kv('Đơn vị phối hợp', esc(p.partners || 'Trung tâm Sản xuất; Trung tâm Mua sắm; Trung tâm ĐBCL'), 'span2')}
        ${k.kv('Mục tiêu (Objective)', esc(p.goal || ''), 'span3')}
        ${k.kv('Kết quả then chốt (OKRs)', (p.okr || [`KR1: Hoàn thành sản xuất ${num(p.qty)} ${p.unitName} đúng tiến độ, trước ngày ${dmy(p.end)}`, 'KR2: Đạt chỉ tiêu nội bộ, chỉ tiêu chiến - kỹ thuật được BQP phê duyệt', 'KR3: Vật tư leadtime dài, export license được bảo đảm theo kế hoạch mua sắm']).map(esc).join('<br>'), 'span3')}
        ${k.kv('Yêu cầu', esc(p.req || 'Đạt chỉ tiêu nội bộ, chỉ tiêu chiến - kỹ thuật được BQP phê duyệt, sẵn sàng phục vụ nghiệm thu cấp BQP; hoàn thành kế hoạch sản xuất kinh doanh năm, đảm bảo mục tiêu lên doanh thu của dự án.'), 'span3')}
        ${k.kv('Rủi ro, đề xuất', p.risk ? esc(p.risk) : null, 'span3')}
        ${k.kv('Người tạo', esc(pName(p.creator)))}${k.kv('Ngày tạo', esc(dmy(p.created)))}${k.kv('Kế hoạch gốc', p.baseline ? 'Chốt ngày ' + esc(dmy(p.baseline)) : 'Chưa chốt')}
        ${k.kv('Điều kiện sản xuất', window.SxCg.gateBadge(p))}</div>`);
    /* Cột Thao tác của tab Kế hoạch: nút Xem chi tiết đi tới màn / tab tương ứng của mục (4 → Đề xuất mua sắm, 5 → Chuyển giao từ nghiên cứu, 6–7 → tab Điều kiện sản xuất, 9 → Bán thành phẩm & tiến độ, 10 → Chất lượng & nghiệm thu). */
    const NAV = { B4: ['go', 'sx/mua-sam'], B5: ['go', 'sx/chuyen-giao'], B6: ['tab', 'm4'], B7: ['tab', 'm4'], B9: ['tab', 'btp'], B10: ['tab', 'nt'], B11: ['tab', 'nt'], B12: ['tab', 'nt'], B13: ['tab', 'nt'], B14: ['go', 'sx/nghiem-thu'], B15: ['tab', 'docs'] };
    /* Thao tác: icon Xem chi tiết (mục có màn riêng → mở màn / tab đó; còn lại → hộp thoại chi tiết hạng mục) và Sửa (mọi dòng chưa Hoàn thành → popup sửa kế hoạch, lý do + Gửi duyệt). */
    const EYE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2.5 12S5.5 5.5 12 5.5 21.5 12 21.5 12 18.5 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>';
    const detailBtn = (r) => {
      const n = NAV[r.key.split('.').slice(1).join('.')], at = 'class="vbtn icon ghost" aria-label="Xem chi tiết" title="Xem chi tiết"';
      const view = !n ? `<button type="button" ${at} data-sxkh-view="${esc(p.code)}|${esc(r.okey)}">${EYE}</button>`
        : n[0] === 'go' ? `<button type="button" ${at} data-go="${n[1]}">${EYE}</button>`
          : `<button type="button" ${at} data-sxda-tab="${n[1]}" data-sxda-code="${esc(p.code)}">${EYE}</button>`;
      const can = stOf(r)[0] !== 'Hoàn thành' && window.SxKh && window.SxKh.canEdit(p, r.okey); // mọi dòng chưa Hoàn thành (kể cả nhóm, hạng mục thêm mới)
      const edit = can ? `<span class="sep"></span><button type="button" class="vbtn icon ghost" aria-label="Sửa" title="Sửa" data-sxkh-edit="${esc(p.code)}|${esc(r.okey)}">${icon('edit')}</button>` : '';
      return `<div class="acts">${view}${edit}</div>`;
    };
    const tPlan = () => {
      const cols = [
        { h: 'Hạng mục / mốc', w: 420, toggler: true, cell: (r) => (r.children ? `<b>${esc(r.name)}</b>` : esc(r.name)) + (r.adjPending ? ` ${badge('Chờ duyệt điều chỉnh', 'warning')}` : '') },
        { h: 'Người / đơn vị phụ trách', w: 230, cell: (r) => k.clamp(r.who) },
        { h: 'Bắt đầu kế hoạch', w: 130, cell: (r) => `<span class="num">${esc(dmy(iso(r.s)))}</span>` },
        { h: 'Kết thúc kế hoạch', w: 130, cell: (r) => `<span class="num">${esc(dmy(iso(r.e)))}</span>` },
        { h: 'Kết thúc thực tế', w: 130, cell: (r) => (r.act ? `<span class="num">${esc(dmy(iso(r.act)))}</span>` : k.dash) },
        { h: 'Hoàn thành', w: 110, align: 'r', cell: (r) => `<span class="num">${r.pct}%</span>` },
        { h: 'Chênh lệch (ngày)', w: 130, align: 'r', cell: (r) => { const d = delay(r); return d == null ? k.dash : `<span class="num ${d > 0 ? 't-err' : ''}">${d > 0 ? '+' + d : 0}</span>`; } },
        { h: 'Trạng thái', w: 150, align: 'c', cell: (r) => badge(...stOf(r)) },
      ].concat([{ h: 'Thao tác', w: 110, align: 'c', cell: (r) => detailBtn(r) }]);
      /* Giữ thứ tự giai đoạn theo kế hoạch; mặc định thu gọn nhóm đã hoàn thành hết để dòng đang thực hiện / chậm tiến độ hiện ngay (bấm mở lại được). */
      const open = T.open[p.code] || (T.open[p.code] = new Set(['G1', 'G2', 'G2.B4', 'G3', 'G3.B9', 'G4'].filter((k) => { const r = plan.find((g) => g.key === k.split('.')[0]); const n = r && (k.includes('.') ? (r.children || []).find((c) => c.key === k.split('.')[1]) : r); return !n || n.pct < 100; })));
      const keyed = (rows, pre) => rows.map((r) => Object.assign({}, r, { okey: r.okey || r.key, key: pre ? `${pre}.${r.key.split('.').pop()}` : r.key, children: r.children ? keyed(r.children, pre ? `${pre}.${r.key.split('.').pop()}` : r.key) : null }));
      const cap = p.baseline ? `Kế hoạch gốc chốt ngày ${dmy(p.baseline)}${p.planNo ? ` · Kế hoạch số ${p.planNo}` : ''}` : 'Chưa có kế hoạch gốc — kế hoạch được chốt khi phê duyệt kế hoạch sản xuất';
      return `<section class="vcard" data-sx-plan><div class="vcard-h"><h3>Kế hoạch</h3><div class="row"><span class="cap">${esc(cap)}</span>${window.SxKh ? window.SxKh.planBtn(p) : ''}</div></div>
        ${vTreeTable({ id: 'sx-plan', columns: cols, rows: keyed(plan), expanded: open, empty: 'Chưa có kế hoạch',
    onToggle: (key) => { if (open.has(key)) open.delete(key); else open.add(key); rerender(); } })}</section>`;
    };
    /* T74 #97: tab Tài liệu chia theo danh mục loại tài liệu; loại chưa có tài liệu hiện "Chưa có tài liệu"; cột File đính kèm tải xuống. */
    const tDocs = () => `<section class="vcard pad24" data-sx-docs><div class="vcard-h"><h3>Danh mục tài liệu</h3><div class="row">
        <button type="button" class="vbtn secondary" data-sx-tpl="${esc(p.code)}">Chọn mẫu tài liệu</button>
        <label class="vbtn secondary">${icon('upload')} Tải file lên<input type="file" hidden data-sx-up="${esc(p.code)}"></label></div></div>
      ${docGroups(p, k)}</section>`;
    const tHist = () => k.card('Lịch sử', k.table([['Thời gian', 160], ['Người thực hiện', 220], ['Hành động', 240], ['Nội dung', 420]], p.hist.slice().sort((a, b) => (a[0] < b[0] ? 1 : -1)),
      (h) => `<td class="num">${esc(dmy(h[0]))}</td><td>${k.clamp(pName(h[1]))}</td><td>${k.clamp(h[2])}</td><td>${h[3] ? k.clamp(h[3]) : k.dash}</td>`));
    /* T74 #97: tab Phê duyệt kế hoạch = danh sách các lần phê duyệt (sx-ke-hoach.js), chi tiết lần đang chọn bên dưới. */
    const tKh = () => (window.SxKh ? window.SxKh.tabApproval(p) : window.SxFlow.planTab(p));
    return `<div class="pg" data-sx-detail="${esc(p.code)}">
      ${head({ title: o.title || 'Xem chi tiết dự án sản xuất', back: o.back || 'sx/du-an', lg: true, info: o.info || info, right })}
      ${o.bar || ''}
      ${alerts}
      ${k.tabs('sx:' + p.code, [['info', 'Thông tin chung'], ['plan', 'Kế hoạch'], ['kh', 'Phê duyệt kế hoạch'], ['ns', 'Nhân sự'], ['cg', 'Hồ sơ chuyển giao'], ['m4', 'Điều kiện sản xuất'], ['ms', 'Mua sắm & hợp đồng'], ['btp', 'Bán thành phẩm & tiến độ'], ['bt', 'Bất thường & thay đổi'], ['nt', 'Chất lượng & nghiệm thu'], ['vmms', 'Dữ liệu VMMS'], ['docs', 'Tài liệu'], ['hist', 'Lịch sử']],
    { info: tInfo, kh: tKh, plan: tPlan, ns: () => window.SxKh.tabStaff(p), cg: () => window.SxCg.projectCg(p), m4: () => window.SxCg.projectM4(p), ms: () => window.SxMs.projectTab(p), btp: () => window.SxBtp.projectTab(p), bt: () => window.SxBt.projectTab(p), nt: () => window.SxNt.projectTab(p), vmms: () => window.SxVmms.projectTab(p), docs: tDocs, hist: tHist })}</div>`;
  }
  const T = { open: {} };
  /* Mở tab Kế hoạch tại một hạng mục (từ Lần phê duyệt ở tab Phê duyệt kế hoạch): mở các nhóm cha, tô và cuộn tới dòng. */
  function focusPlan(code, okey) {
    const p = byCode(code); if (!p) return;
    const find = (rows, pre, path) => { for (const r of rows) { const k = pre ? `${pre}.${r.key.split('.').pop()}` : r.key; if (r.key === okey) return path.concat([k]); const f = r.children && find(r.children, k, path.concat([k])); if (f) return f; } return null; };
    const path = find(planOf(p), '', []);
    K().setTab('sx:' + code, 'plan');
    const open = T.open[code] || (T.open[code] = new Set(['G1', 'G2', 'G2.B4', 'G3', 'G3.B9', 'G4']));
    if (path) path.slice(0, -1).forEach((k) => open.add(k));
    rerender();
    if (!path) return;
    setTimeout(() => {
      const tr = document.querySelector(`[data-sx-plan] tr[data-vtt-row="${CSS.escape(path[path.length - 1])}"]`); if (!tr) return;
      tr.classList.add('row-hl'); tr.scrollIntoView({ block: 'center' });
      setTimeout(() => tr.classList.remove('row-hl'), 4000);
    }, 60);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sxda-tab]');
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    K().setTab('sx:' + b.dataset.sxdaCode, b.dataset.sxdaTab);
    rerender();
    toTop();
  }, true);
  /* Xem chi tiết ở tab Kế hoạch: sang màn / tab khác thì về đầu trang. */
  const toTop = () => { window.scrollTo(0, 0); setTimeout(() => window.scrollTo(0, 0), 0); document.querySelectorAll('main, .main, .content, .vmain').forEach((el) => { el.scrollTop = 0; }); };
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('[data-sx-plan] button[data-go]')) toTop(); });
  /* T74 #97: Mã / Tên nhiệm vụ = nhiệm vụ đơn vị cấp 1 của dự án (giao khi kick-off hoặc Giao việc), mở Chi tiết nhiệm vụ đơn vị. */
  function nvKv(p, k) {
    const l = window.SxCv ? window.SxCv.all().filter((x) => x.kind === 'DV' && x.project === p.code && !x.parent).sort((a, b) => ((a.created || a.start) < (b.created || b.start) ? -1 : 1)) : [];
    const x = l[0], more = l.length > 1 ? ` <a class="link" data-go="sx/cong-viec/don-vi">+${l.length - 1} nhiệm vụ khác</a>` : '';
    return k.kv('Mã nhiệm vụ', x ? `<a class="link" data-go="sx/cong-viec/${encodeURIComponent(x.code)}">${esc(x.code)}</a>${more}` : null) + k.kv('Tên nhiệm vụ', x ? esc(x.title) : null, 'span2');
  }
  function docGroups(p, k) {
    const by = {};
    p.docs.forEach((d) => { (by[d[1]] || (by[d[1]] = [])).push(d); });
    const kinds = Object.keys(D.sxDocKind).filter((x) => by[x]).concat(Object.keys(by).filter((x) => !D.sxDocKind[x]));
    const empty = Object.keys(D.sxDocKind).filter((x) => !by[x]);
    const row = (d) => `<td>${k.clamp(d[0])}${d[5] === 'SIGN' ? ' ' + badge('Đã ký số', 'success') : ''}</td><td>${esc(d[2])}</td><td>${k.clamp(pName(d[3]))}</td><td class="num">${esc(dmy(d[4]))}</td>
      <td><a class="link" title="Tải xuống">${icon('download')} ${esc(d[0])}</a></td>`;
    return kinds.map((x) => `<h4 class="ginfo-sub">${esc(D.sxDocKind[x] || x)} <span class="faint">(${by[x].length})</span></h4>${k.table([['Tên tài liệu', 380], ['Phiên bản', 100], ['Người tải lên', 200], ['Ngày tải lên', 130], ['File đính kèm', 300]], by[x].slice().reverse(), row)}`).join('')
      + (empty.length ? `<h4 class="ginfo-sub">Loại tài liệu chưa có</h4>${k.table([['Loại tài liệu', 420], ['Tình trạng', 200]], empty, (x) => `<td>${k.clamp(D.sxDocKind[x])}</td><td class="faint">Chưa có tài liệu</td>`)}` : '');
  }

  /* Chọn mẫu tài liệu: biểu mẫu đang hoạt động, có tệp mẫu, của danh mục Biểu mẫu tài liệu sản xuất (T71 S11 — trước đây cố định BM-QLHDSX-01 / 04). */
  const TPL = () => window.Catalog.rows('sx-bieu-mau').filter((r) => r.active !== false && r.file).map((r) => [r.code, r.kind, r.name]);
  function tplDlg(code) {
    const m = vModal({ title: 'Chọn mẫu tài liệu', size: 'md',
      body: K().table([['Mã biểu mẫu', 200], ['Tên biểu mẫu', 300], ['Loại tài liệu', 260], ['', 120, 'c']], TPL(),
        (t) => `<td>${esc(t[0])}</td><td>${esc(t[2])}</td><td>${esc(D.sxDocKind[t[1]] || '')}</td><td class="c"><button type="button" class="vbtn sm secondary" data-sx-tpl-use="${esc(t[0])}">Sử dụng</button></td>`),
      actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-sx-tpl-use]');
      if (!b) return;
      const t = TPL().find((x) => x[0] === b.dataset.sxTplUse);
      useTpl(code, t);
      m.close(); toast('<b>Thành công</b><br>Thêm tài liệu thành công!'); rerender();
    });
  }
  /* Tạo tài liệu từ biểu mẫu t = [mã, loại, tên] (cũng dùng ở Hồ sơ dự án). */
  function useTpl(code, t) {
    (U.docs[code] = U.docs[code] || []).push([`${t[2]} — ${code}.docx`, t[1], 'v0.1', Flow.state.persona, D.sxToday, 'TPL']);
    addHist(code, 'Tạo tài liệu từ mẫu', `${t[0]} — ${t[2]}`);
    persist();
  }
  /* ---------- T71 S11: tài liệu cho Hồ sơ dự án (SX-18) ----------
     Mỗi tài liệu: { id, project, i (chỉ số trong danh sách của dự án), own (người dùng thêm — sửa / xoá được), d: [tên, loại, phiên bản, người, ngày, nguồn?] }.
     Tài liệu có sẵn của dự án (dữ liệu mẫu) chỉ xem. */
  function docsAll() {
    return all().flatMap((p) => {
      const base = (U.created.concat(D.sxProjects).find((x) => x.code === p.code) || {}).docs || [];
      return p.docs.map((d, i) => ({ id: `${p.code}#${i}`, project: p.code, i, own: i >= base.length, d }));
    });
  }
  function docAdd(code, d) { (U.docs[code] = U.docs[code] || []).push(d); addHist(code, 'Tải lên tài liệu', d[0]); persist(); }
  function docUpdate(id, d) {
    const x = docsAll().find((y) => y.id === id);
    if (!x || !x.own) return;
    const l = U.docs[x.project], off = byCode(x.project).docs.length - l.length;
    l[x.i - off] = d; addHist(x.project, 'Cập nhật tài liệu', d[0]); persist();
  }
  function docRemove(id) {
    const x = docsAll().find((y) => y.id === id);
    if (!x || !x.own) return;
    const l = U.docs[x.project], off = byCode(x.project).docs.length - l.length;
    const [r] = l.splice(x.i - off, 1); addHist(x.project, 'Xoá tài liệu', r[0]); persist();
  }

  document.addEventListener('submit', (e) => {
    const f = e.target.closest && e.target.closest('[data-sx-form]');
    if (!f) return;
    e.preventDefault(); save();
  });
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sx-tpl]');
    if (t) tplDlg(t.dataset.sxTpl);
  });
  document.addEventListener('change', (e) => {
    const u = e.target.closest && e.target.closest('[data-sx-up]');
    if (!u || !u.files || !u.files[0]) return;
    const code = u.dataset.sxUp;
    (U.docs[code] = U.docs[code] || []).push([u.files[0].name, 'KHAC', 'v1.0', Flow.state.persona, D.sxToday]);
    addHist(code, 'Tải lên tài liệu', u.files[0].name);
    persist(); toast('<b>Thành công</b><br>Tải lên thành công!'); rerender();
  });

  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sx-next]');
    if (!b) return;
    NEXT.from = b.dataset.sxNext; location.hash = '#/sx/du-an/create';
  });
  /* ---------- T71 S12: Xoá dự án (chưa khởi tạo luồng), Nhập Excel ---------- */
  document.addEventListener('click', async (e) => {
    const b = e.target.closest && e.target.closest('[data-sx-del]');
    if (!b) return;
    const p = byCode(b.dataset.sxDel);
    if (!p || !canDel(p)) return;
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa dự án sản xuất: ${p.code} — ${p.name} không?`, hl: `${p.code} — ${p.name}`, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    U.created = U.created.filter((x) => x.code !== p.code);
    if (D.sxProjects.some((x) => x.code === p.code)) U.del = (U.del || []).concat(p.code);
    persist();
    toast('<b>Thành công</b><br>Xoá dự án thành công');
    location.hash = '#/sx/du-an';
  });
  /* File giả lập 5 dòng: dòng 3 sản phẩm không có trong danh sách sản phẩm, dòng 4 sản phẩm chưa chuyển giao, dòng 5 ngày kết thúc trước ngày bắt đầu và PAKD đã lập dự án. */
  const IMP = [
    ['Sản xuất loạt bộ phát Wi-Fi Mesh WM-6 cho thị trường trong nước', 'K2', 'GIA_CONG', 'WM-6', 50000, 'thiết bị', 'sxk2', '2027-01-04', '2027-06-30', 'HD', 'Hợp đồng 12/2027/HĐ-VTT'],
    ['Sản xuất đài ra-đa cảnh giới tầm thấp RĐ-40 — đợt 2', 'K1', 'VMC_TONG_THAU', 'RĐ-40', 6, 'bộ', 'sxpm', '2027-02-01', '2027-10-31', 'NV', 'Quyết định 2210/QĐ-VHT'],
    ['Sản xuất thiết bị định tuyến biên ER-9', 'K2', 'GIA_CONG', 'ER-9', 2000, 'thiết bị', 'sxk2', '2027-03-01', '2027-08-31', 'PAKD', 'PAKD 401/PAKD-VHT'],
    ['Sản xuất thiết bị đầu cuối quang ONT-X2 năm 2027', 'K2', 'GIA_CONG', 'ONT-X2', 80000, 'thiết bị', 'sxk2', '2027-01-15', '2027-09-30', 'PAKD', 'PAKD 388/PAKD-VHT'],
    ['Sản xuất trạm 5G Macro gNB-M3 bổ sung', 'K2', 'VMC_TONG_THAU', 'gNB-M3', 500, 'trạm', 'sxk2', '2027-09-01', '2027-05-31', 'PAKD', 'PAKD 352/PAKD-VHT'],
  ];
  function importDlg() {
    window.SxChung.importDlg({ entity: 'dự án sản xuất', tpl: 'mau-nhap-du-an-san-xuat.xlsx', file: 'danh-sach-du-an-san-xuat.xlsx', unit: 'dự án',
      cols: [['Tên dự án', 300], ['Khối', 90], ['Mô hình tổ chức', 200], ['Sản phẩm', 120], ['Số lượng', 110], ['Giám đốc dự án', 170], ['Ngày bắt đầu', 120], ['Ngày kết thúc', 120]],
      rows: () => IMP.map(([name, khoi, model, product, qty, unitName, pm, start, end, bk, bn]) => {
        const errs = [], pr = prodOf(product);
        if (!pr) errs.push(`Sản phẩm ${product} không có trong danh sách sản phẩm.`);
        else if (pr.khoi !== khoi) errs.push(`Sản phẩm ${product} không thuộc ${KHOI[khoi]}.`);
        else if (!window.SxCg.ready(product)) errs.push(`Sản phẩm ${product} chưa có trong Kho sản phẩm sẵn sàng sản xuất.`);
        const pk = bk === 'PAKD' ? pakdAll().filter(pakdOk).find((x) => bn.includes(x.no)) : null;
        if (bk === 'PAKD' && !pk) errs.push(`Không tìm thấy phương án sản xuất kinh doanh đã phê duyệt ${bn}.`);
        else if (pk && pakdUsedBy(pk.code)) errs.push(`Phương án sản xuất kinh doanh ${pk.no} đã được lập dự án ${pakdUsedBy(pk.code).code}.`);
        if (!window.Catalog.rows('sx-mo-hinh').some((r) => r.code === model)) errs.push(`Mô hình tổ chức ${model} không tồn tại.`);
        if (!D.personas.some((x) => x.id === pm && x.urd === 'R-SX-PM')) errs.push('Giám đốc dự án không có trong hệ thống.');
        if (ms(end) <= ms(start)) errs.push('Ngày kết thúc phải sau Ngày bắt đầu.');
        return { errs, data: { name, khoi, model, product, version: pr ? pr.version : '', qty, unitName, pm, start, end, basis: pk ? ['PAKD', `PAKD số ${pk.no} ngày ${dmy(pk.date)}`] : [bk, bn],
          pakd: pk ? pk.code : null, khsxkd: pk ? pk.kh : null, trial: khoi === 'K1', factory: null, customer: pk ? pk.customer : '', goal: '' },
          cells: [name, KHOI[khoi], catName('sx-mo-hinh', model), product, `${num(qty)} ${unitName}`, pName(pm), dmy(start), dmy(end)] };
      }),
      commit: (ok) => {
        ok.forEach((r) => {
          const n = Math.max(0, ...all().filter((p) => p.code.startsWith('DA-SX-2026-')).map((p) => Number(p.code.slice(-3)))) + 1, code = 'DA-SX-2026-' + String(n).padStart(3, '0');
          U.created.unshift(Object.assign({ code, status: 'PLANNING', perf: 0, cap: 0, baseline: null, creator: Flow.state.persona, created: D.sxToday, docs: [], hist: [] }, r.data));
          addHist(code, 'Tạo dự án', 'Nhập từ Excel');
        });
        persist();
        if (K().LST.sxda) K().LST.sxda.page = 1;
        return ok.length;
      } });
  }
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('[data-sxda-import]')) importDlg(); });
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sxda-tile]'); if (!t) return;
    const v = t.dataset.sxdaTile; DTILE.cur = DTILE.cur === v ? 'all' : v;
    if (K().LST.sxda) K().LST.sxda.page = 1;
    rerender();
  });

  /* Router con: parts sau 'du-an'. */
  function route(parts) {
    const [a, b] = parts;
    if (a === 'create') return form(null);
    if (a && b === 'edit') return form(decodeURIComponent(a));
    if (a) { if (b === 'ke-hoach') K().setTab('sx:' + decodeURIComponent(a), 'plan'); else if (['info', 'kh', 'ns', 'cg', 'm4', 'ms', 'btp', 'bt', 'nt', 'vmms', 'docs', 'hist'].includes(b)) K().setTab('sx:' + decodeURIComponent(a), b); return detail(decodeURIComponent(a)); }
    return list();
  }
  function enter(parts) {
    if (parts[0] !== 'du-an') return;
    if (parts[1] === 'create') {
      resetForm(null);
      /* Lập dự án từ Chi tiết PASXKD (#/sx/du-an/create/<mã PASXKD>): chọn sẵn phương án, điền sẵn thông tin. */
      if (parts[2]) { F.v.pakd = decodeURIComponent(parts[2]); fillPakd(F.v.pakd); }
    }
    else if (parts[2] === 'edit') resetForm(decodeURIComponent(parts[1]));
    /* Mở chi tiết từ danh sách / liên kết: về tab Thông tin chung (tab của luồng chỉ chọn sẵn khi mở từ Việc của tôi). */
    else if (parts[1] && !parts[2]) K().setTab('sx:' + decodeURIComponent(parts[1]), 'info');
  }
  function reset() { U = { created: [], edit: {}, docs: {}, hist: {}, del: [] }; persist(); }

  /* Hạng mục sản xuất của bước 9 (cho sx-btp.js): key, tên, vai phụ trách, người phụ trách, mục tiêu (null = mốc theo %), ngày kế hoạch. */
  function b9Items(p) {
    const g3 = planOf(p)[2], b9 = g3.children.find((x) => x.key === 'B9');
    return b9Kids(p).map(([ck, cn, cr, , target]) => { const r = b9.children.find((x) => x.key === 'B9.' + ck); return { key: ck, name: cn, role: cr, who: who(p, cr), target: target || null, s: r.s, e: r.e }; });
  }
  /* T74 #94 / #96: tên giai đoạn (khung 4 giai đoạn QT.VHT.TTSX.4A.1.1) theo mã nhóm G1–G4 hoặc mã hạng mục B1–B15 (B9.x → B9). */
  const stageName = (key) => { const k = String(key || '').split('.')[0]; const g = PLAN.find(([gk, , , , st]) => gk === k || st.some((x) => x[0] === k)); return g ? `${g[0].slice(1)}. ${g[1]}` : ''; };
  window.SxDuAn = { focusPlan, route, enter, reset, all, byCode, visible, canDel, planOf, progressOf, leaves, stOf, detail, log, patch, addDoc, canEdit, b9Items, docsAll, docAdd, docUpdate, docRemove, useTpl, TPL, stageName,
    tabKey: (code) => 'sx:' + code, viewTitle: 'Xem chi tiết dự án sản xuất' };
})();
