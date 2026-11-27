/* Phân hệ Quản lý sản xuất — Đề xuất mua sắm từ sản xuất (T71 S4, D-121 Q6). SX-10: danh sách, lập / chỉnh sửa, chi tiết; tab Mua sắm & hợp đồng của dự án.
   Lập đề xuất: MBOM dự toán (VMMS, chỉ xem) × số lượng dự án, tồn kho khả dụng ERP Kho TCT tra cứu tức thì, đề xuất mua = nhu cầu − tồn (sửa được), chia đợt.
   Góp ý 27/11 (thay T71 S10 / D-124): không còn đề xuất riêng của Sản xuất (mã ĐXSX) và luồng duyệt SX-MS — Lưu gọi API-01 tạo ĐXMS trên ĐTMS ngay (Flow.createDxms),
   đề xuất chỉ có một mã (mã ĐXMS) và một tên; phê duyệt theo quy trình ĐTMS. Hai trạng thái tách rõ: Trạng thái gửi ĐTMS (kết quả gọi API) và Trạng thái phê duyệt (trạng thái ĐXMS trên ĐTMS).
   Lập từ Nhu cầu vật tư (sx-nhu-cau.js) chọn sẵn dòng (preset). Danh sách Gói thầu, hợp đồng (#/sx/goi-thau-hd) đọc ngược từ ĐTMS (API-02, API-03); nhập kho (API-04) GIẢ LẬP.
   Route: #/sx/mua-sam, …/create[/<mã dự án>], …/<mã>, …/<mã>/edit (mã = mã ĐXMS; đề xuất gửi lỗi chưa có mã ĐXMS dùng khoá nội bộ ref). Lưu localStorage sx-proto-ms2. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vSelect, vModal } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };

  /* ---------- Lưu ---------- */
  /* Góp ý 27/11: đổi khoá (sx-proto-ms → sx-proto-ms2) — bản ghi cũ mang mã ĐXSX riêng không còn dùng. */
  const KEY = 'sx-proto-ms2';
  const blank = () => ({ props: [], edit: {}, stockAt: null, del: [], seq: 0 });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  /* ref = khoá nội bộ (route, lưu); code = mã ĐXMS do ĐTMS sinh — rỗng khi gửi lỗi. */
  const all = () => U.props.concat(D.sxProposals).map((x) => Object.assign({ ref: x.code }, x, U.edit[x.ref || x.code] || {})).filter((x) => !(U.del || []).includes(x.ref));
  const byCode = (code) => all().find((x) => x.ref === code || (x.code && x.code === code)) || null;
  const visible = () => { const ids = new Set(P().visible().map((p) => p.code)); return all().filter((x) => ids.has(x.project)); };

  /* ---------- Vật tư ---------- */
  const mbomOf = (p) => D.sxMbom[p.product] || [];
  const stockOf = (code) => D.sxStock[code] || 0;
  /* Dòng đề xuất: lines [mã vật tư, số lượng đề xuất mua]. */
  const linesOf = (x) => { const p = P().byCode(x.project); const m = mbomOf(p); return x.lines.map(([c, q]) => Object.assign({}, m.find((r) => r.code === c) || { code: c, name: c, unit: '', per: 0, price: 0, lt: 0 }, { qty: q })); };
  const totalOf = (x) => linesOf(x).reduce((a, r) => a + r.qty * r.price, 0);
  const patchP = (ref, data) => { const own = U.props.find((y) => y.ref === ref); if (own) Object.assign(own, data); else U.edit[ref] = Object.assign(U.edit[ref] || {}, data); persist(); };

  /* ---------- Hai trạng thái (góp ý 27/11, sửa lại 27/11 lần 2) ----------
     Đề xuất phải được Lãnh đạo Khối duyệt (luồng SX-MS) thì hệ thống mới gọi API-01 tạo ĐXMS trên ĐTMS; chưa duyệt thì chưa tạo, chưa có mã ĐXMS.
     Trạng thái phê duyệt = kết quả duyệt nội bộ Sản xuất: Nháp | Chờ phê duyệt | Bị từ chối | Đã phê duyệt.
     Trạng thái gửi ĐTMS = kết quả gọi API-01: Chưa gửi (chưa duyệt) | Đã gửi (có mã ĐXMS; dòng phụ là trạng thái ĐXMS trên ĐTMS, API-02) | Gửi lỗi (có Gửi lại). */
  const FL = () => window.SxFlow;
  const caseOf = (x) => { const l = FL().cases(x.ref, 'SX-MS'); return l[l.length - 1] || null; };
  const pending = (x) => { const c = caseOf(x); return !!c && c.status === 'running'; };
  const approved = (x) => !!x.approved || (!!x.code && x.api !== 'ERR');
  const APPR = { DRAFT: ['Nháp', 'default'], WAIT: ['Chờ phê duyệt', 'warning'], NO: ['Bị từ chối', 'error'], OK: ['Đã phê duyệt', 'success'] };
  const apprSt = (x) => APPR[approved(x) ? 'OK' : pending(x) ? 'WAIT' : x.rejected ? 'NO' : 'DRAFT'];
  const SEND = { NONE: ['Chưa gửi', 'default'], OK: ['Đã gửi', 'success'], ERR: ['Gửi lỗi', 'error'] };
  const sendSt = (x) => SEND[!approved(x) ? 'NONE' : x.api === 'ERR' || !x.code ? 'ERR' : 'OK'];
  /* Trạng thái ĐXMS trên ĐTMS (Screens.DXMS_STATUS: Chưa khởi tạo, Đang phê duyệt, Đã phê duyệt…), đọc ngược qua API-02. */
  const dtmsSt = (x) => { if (sendSt(x) !== SEND.OK) return null; if (x.sync) return [x.sync.dxms[1], x.sync.dxms[2]]; const d = Flow.findDxms(x.code); return d ? window.Screens.DXMS_STATUS[window.Screens.dxmsMeta(d, window.Screens.allCases()).state] : null; };
  const ownerOk = (x) => isAdmin() || x.creator === pid() || (P().byCode(x.project) || {}).pm === pid();
  const canCreate = () => isAdmin() || D.roleOf(pid()) === 'R-SX-PM';
  /* Sửa: Nháp / Bị từ chối (chưa duyệt, không đang chờ duyệt). Xoá: Nháp chưa gửi phê duyệt lần nào (đã có hồ sơ duyệt thì giữ để tra vết). Đã duyệt thì sửa / điều chỉnh trên ĐTMS. */
  const canEditP = (x) => !approved(x) && !pending(x) && (P().byCode(x.project) || {}).status !== 'DONE' && ownerOk(x);
  const canDelP = (x) => canEditP(x) && !FL().cases(x.ref, 'SX-MS').length;
  const canResend = (x) => sendSt(x) === SEND.ERR && ownerOk(x);

  /* ---------- Tiến trình bên ĐTMS (đọc ngược) ---------- */
  function chain(x) {
    if (x.sync) return Object.assign({ live: false }, x.sync);
    if (!x.code || x.api === 'ERR') return null;
    const d = Flow.findDxms(x.code);
    if (!d) return { live: true, dxms: [x.code, 'Không tìm thấy trên ĐTMS', 'error', ''], pkgs: [], hd: [], kho: [] };
    const m = window.Screens.dxmsMeta(d, window.Screens.allCases()), st = window.Screens.DXMS_STATUS[m.state];
    const T = window.Thau, H = window.HopDong;
    const khs = T ? T.khAll().filter((k) => k.src && k.src[1] === d.code) : [];
    const pkgs = khs.flatMap((k) => T.pkgsOf(k)).map((g) => [g.code, g.name].concat(T.pkStLabel(g)));
    const hd = H ? pkgs.map((g) => H.byPkg(g[0])).filter(Boolean).map((h) => [h.code, h.title].concat(H.HD_ST[h.st] || ['Đang xử lý', 'info'], [h.nccN || '', null, ''])) : [];
    return { live: true, dxms: [d.code, st[0], st[1], d.updated || ''], kh: khs[0] ? [khs[0].code].concat(T.khStLabel(khs[0]), ['']) : null, pkgs, hd, kho: [] };
  }
  function chainTable(x) {
    const k = K(), c = chain(x);
    if (!c) return '<p class="faint">Đề xuất chưa có trên ĐTMS — ĐXMS được tạo khi đề xuất được phê duyệt.</p>';
    const d = (s) => (s && /^\d{4}-/.test(s) ? dmy(s) : s || '');
    const rows = [['Đề xuất mua sắm (ĐXMS)', c.dxms[0], '', [c.dxms[1], c.dxms[2]], d(c.dxms[3]), 'API-02', c.live ? `luong/${encodeURIComponent(c.dxms[0])}` : null]]
      .concat(c.kh ? [['Kế hoạch lựa chọn nhà thầu', c.kh[0], '', [c.kh[1], c.kh[2]], d(c.kh[3]), 'API-02', c.live ? `khlcnt/${encodeURIComponent(c.kh[0])}` : null]] : [])
      .concat(c.pkgs.map((g) => ['Gói thầu', g[0], g[1], [g[2], g[3]], '', 'API-02', c.live ? `goi-thau/${encodeURIComponent(g[0])}` : null]))
      .concat(c.hd.map((h) => ['Hợp đồng', h[0], `${h[1]}${h[4] ? ` · ${h[4]}` : ''}${h[5] ? ` · ${num(h[5])} đồng` : ''}`, [h[2], h[3]], d(h[6]), 'API-03', null]))
      .concat(c.kho.map((n) => ['Phiếu nhập kho TCT', n[0], n[1], [n[3], 'success'], d(n[2]), 'API-04', null]));
    return k.table([['Đối tượng trên ĐTMS', 180], ['Nội dung', 420], ['Trạng thái', 180, 'c'], ['Ngày cập nhật', 120], ['Luồng tích hợp', 110, 'c']], rows,
      (r) => `<td>${esc(r[0])}</td><td>${NC(r[2], r[1], r[6] ? { go: r[6], tip: 'Xem chi tiết' } : {})}</td><td class="c">${badge(r[3][0], r[3][1])}</td>
        <td class="num">${r[4] ? esc(r[4]) : k.dash}</td><td class="c">${esc(r[5])}</td>`)
      + (c.live && !c.pkgs.length ? '<p class="cap">Kế hoạch lựa chọn nhà thầu, gói thầu, hợp đồng và nhập kho hiện ở đây khi ĐTMS xử lý xong các bước tương ứng.</p>' : '');
  }

  /* ---------- SX-10 Danh sách ---------- */
  const href = (x) => 'sx/mua-sam/' + encodeURIComponent(x.code || x.ref);
  const INFO_Q = ['P-248', 'P-249', 'P-243', 'P-262'];
  const ib2 = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" ${attrs}>${icon(ic)}</button>`;
  /* Ô tên đề xuất: một tên, một mã (mã ĐXMS) — chỉ có sau khi được duyệt và gửi sang ĐTMS thành công. */
  const nameCell = (x) => (x.code ? NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết đề xuất mua sắm' })
    : `<a class="link" data-go="${href(x)}" title="Xem chi tiết đề xuất mua sắm">${K().clamp(x.title)}</a><div class="faint">Chưa có mã ĐXMS</div>`);
  const sendCell = (x) => { const d = dtmsSt(x); return `${badge(...sendSt(x))}${d ? `<div class="faint" style="margin-top:4px;white-space:nowrap" title="Trạng thái ĐXMS trên ĐTMS">Trên ĐTMS: ${esc(d[0])}</div>` : ''}${canResend(x) ? `<div style="margin-top:4px"><button type="button" class="vbtn secondary sm" data-sxm-resend="${esc(x.ref)}" title="Gọi lại API tạo ĐXMS trên ĐTMS">Gửi lại</button></div>` : ''}`; };
  const apprCell = (x) => badge(...apprSt(x));
  function list() {
    // Theo: task-management (danh sách ĐXMS) — đề xuất mua sắm của sản xuất là ĐXMS trên ĐTMS (một mã, một tên)
    const k = K();
    const info = {
      scr: 'SX-10', name: 'Danh sách đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.3, §6 (API-01…04); SX-KS-K1 §2.3, §2.5; CDS-BT-03COP COP2 công đoạn 3',
      notes: [
        '<b>Góp ý 27/11:</b> dùng màn Lập đề xuất mua sắm như ĐTMS; mỗi đề xuất <b>một mã (mã ĐXMS) và một tên</b> — bỏ mã ĐXSX riêng. <b>Gửi phê duyệt</b> → Lãnh đạo Khối Duyệt / Từ chối (luồng SX-MS, GIẢ LẬP P-255); <b>được duyệt thì hệ thống mới gọi API-01 tạo ĐXMS</b> trên ĐTMS, chưa duyệt thì chưa tạo, chưa có mã ĐXMS.',
        '<b>Trạng thái phê duyệt</b> = duyệt nội bộ Sản xuất: Nháp → Chờ phê duyệt → Đã phê duyệt / Bị từ chối (sửa rồi gửi lại, hồ sơ phê duyệt mới). <b>Trạng thái gửi ĐTMS</b> = kết quả gọi API-01: Chưa gửi (chưa duyệt) / Đã gửi (có mã ĐXMS; dòng phụ “Trên ĐTMS” là trạng thái ĐXMS bên ĐTMS, API-02) / Gửi lỗi (bấm <b>Gửi lại</b>).',
        'Sửa: Nháp, Bị từ chối. Xoá: Nháp chưa gửi phê duyệt lần nào. Chờ phê duyệt và đã duyệt thì không sửa ở đây — điều chỉnh thực hiện trên ĐTMS.',
        'Hai đề xuất mẫu là dữ liệu chuyển đổi: trạng thái ĐTMS là ảnh đồng bộ (GIẢ LẬP P-249). Đề xuất gửi lỗi mẫu để minh hoạ Gửi lại (GIẢ LẬP).',
      ],
      q: INFO_Q, src: 'task-management/task-management.component · /task-management',
    };
    return k.listPage({
      id: 'sxms', title: 'Danh sách đề xuất mua sắm từ sản xuất', ph: 'Tìm kiếm theo mã ĐXMS, tên đề xuất, dự án', info,
      right: projOpts().length ? `<button type="button" class="vbtn primary" data-go="sx/mua-sam/create" title="Lập đề xuất mua sắm (được duyệt thì tạo ĐXMS trên ĐTMS)">${icon('add')} Thêm mới</button>` : '',
      rows: () => visible().map((x) => Object.assign({}, x, { st: sendSt(x), ap: apprSt(x), total: totalOf(x) })),
      kwText: (x) => `${x.code || ''} ${x.title} ${x.project}`,
      empty: () => ({ code: '', title: '', project: null, dot: null, st: [], ap: [] }),
      match: (x, f) => k.has(f.code, x.code || '') && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.dot || String(x.dot) === String(f.dot))
        && k.inSet(f.st, x.st[0]) && k.inSet(f.ap, x.ap[0]),
      adv: (txt, sel) => `${txt('code', 'Mã ĐXMS')}${txt('title', 'Tên đề xuất')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('dot', 'Đợt', { searchable: false, options: [{ value: '1', label: 'Đợt 1' }, { value: '2', label: 'Đợt 2' }] })}
        ${sel('st', 'Trạng thái gửi ĐTMS', { multi: true, searchable: false, options: Object.values(SEND).map((s) => ({ value: s[0], label: s[0] })) })}
        ${sel('ap', 'Trạng thái phê duyệt', { multi: true, searchable: false, options: Object.values(APPR).map((s) => ({ value: s[0], label: s[0] })) })}`,
      cols: [['Thao tác', 100, 'c'], ['Đề xuất mua sắm', 420], ['Dự án', 240], ['Đợt', 70, 'c'], ['Giá trị dự toán (đồng)', 180, 'r'], ['Trạng thái phê duyệt', 150, 'c'], ['Trạng thái gửi ĐTMS', 170, 'c'], ['Ngày gửi ĐTMS', 130]],
      href,
      cell: (x) => `<td class="c"><div class="acts">${canEditP(x) ? ib2('edit', 'Sửa', `data-go="${href(x)}/edit"`) : ''}${canDelP(x) ? ib2('del', 'Xoá', `data-sxm-del="${esc(x.ref)}"`) : ''}</div></td>
        <td>${nameCell(x)}</td><td>${PJ(x.project)}</td><td class="c">${x.dot}</td><td class="r num">${num(x.total)}</td>
        <td class="c">${apprCell(x)}</td><td class="c">${sendCell(x)}</td><td class="num">${x.sent ? esc(dmy(x.sent)) : k.dash}</td>`,
    });
  }

  /* ---------- SX-10 Lập / Chỉnh sửa (khuôn màn Lập đề xuất mua sắm của ĐTMS, SCR-96) ---------- */
  const F = { ref: null, v: {}, err: {} };
  const projOpts = () => P().visible().filter((p) => p.status !== 'DONE' && (isAdmin() || p.pm === pid()));
  const PRIORITIES = ['Thường', 'Khẩn', 'Thượng khẩn'];
  const periodOf = (p) => (p ? `${dmy(p.start).slice(3)} – ${dmy(p.end).slice(3)}` : '');
  function pick(project, dot) {
    const p = P().byCode(project);
    if (!p) return [];
    return mbomOf(p).map((r) => { const need = r.per * p.qty, buy = Math.max(0, need - stockOf(r.code)); return { code: r.code, on: dot === 2 ? r.lt < 16 : r.lt >= 16, qty: buy }; });
  }
  function resetForm(ref, project) {
    F.ref = ref || null; F.err = {};
    const x = ref && byCode(ref);
    if (x) {
      F.ref = x.ref; // route có thể là mã ĐXMS — lưu theo khoá nội bộ
      const m = pick(x.project, x.dot);
      F.v = { project: x.project, title: x.title, dot: x.dot, note: x.note || '', priority: x.priority || 'Thường', period: x.period || periodOf(P().byCode(x.project)),
        rows: m.map((r) => { const l = x.lines.find((y) => y[0] === r.code); return { code: r.code, on: !!l, qty: l ? l[1] : r.qty }; }) };
      return;
    }
    const p = project && P().byCode(project);
    F.v = { project: p ? p.code : null, title: p ? `Mua sắm vật tư sản xuất ${p.product} — đợt 1` : '', dot: 1, note: '', priority: 'Thường', period: periodOf(p), rows: p ? pick(p.code, 1) : [] };
    /* Lập từ Nhu cầu vật tư: chỉ chọn các dòng đã chọn ở đó, số lượng = phần còn thiếu. */
    if (p && PRESET && PRESET.project === p.code) {
      const map = PRESET.map;
      F.v.rows = F.v.rows.map((r) => ({ code: r.code, on: map[r.code] != null, qty: map[r.code] != null ? map[r.code] : r.qty }));
      F.v.title = `Mua sắm vật tư sản xuất ${p.product} theo nhu cầu vật tư`;
      F.v.note = PRESET.note || '';
    }
    PRESET = null;
  }
  let PRESET = null;
  const preset = (project, map, note) => { PRESET = { project, map, note }; };
  function keep() {
    const g = (id) => document.getElementById(id);
    if (g('sxm-title')) F.v.title = g('sxm-title').value;
    if (g('sxm-note')) F.v.note = g('sxm-note').value;
    if (g('sxm-period')) F.v.period = g('sxm-period').value;
    document.querySelectorAll('[data-sxm-qty]').forEach((i) => { const r = F.v.rows.find((x) => x.code === i.dataset.sxmQty); if (r) r.qty = Math.max(0, Math.floor(Number(i.value) || 0)); });
  }
  function form(ref) {
    // Theo: task-management/components/task-create (mode create / edit) — như màn Lập đề xuất mua sắm của ĐTMS (luong.js form), thêm Dự án sản xuất và bảng vật tư
    const k = K(), v = F.v, err = F.err, x = ref ? byCode(ref) : null;
    const back = x ? href(x) : 'sx/mua-sam';
    if (x && !canEditP(x)) return `<div class="pg">${head({ title: 'Chỉnh sửa đề xuất mua sắm', back, lg: true })}${k.emptyCard('Thông tin chung', approved(x) ? 'Đề xuất đã được phê duyệt và chuyển sang ĐTMS, không chỉnh sửa được ở đây. Điều chỉnh thực hiện trên ĐTMS.' : 'Đề xuất đang chờ phê duyệt, không chỉnh sửa được.')}</div>`;
    const p = v.project ? P().byCode(v.project) : null, cg = window.SxCg, rel = p && cg.relOf(p.product);
    const info = {
      scr: 'SX-10', name: x ? 'Chỉnh sửa đề xuất mua sắm từ sản xuất' : 'Lập đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.1 (Tờ trình mua sắm, tồn kho real-time), §2.3 API-01; SX-KS-K1 §2.3, §2.5; SCR-96',
      notes: [
        '<b>Góp ý 27/11:</b> cùng màn Lập đề xuất mua sắm của ĐTMS (SCR-96) — Mã ĐXMS hệ thống ĐTMS tự sinh, Tên đề xuất mua sắm; thay Đề tài / dự án bằng <b>Dự án sản xuất</b>, Đơn vị đề xuất = Trung tâm Sản xuất.',
        '<b>Lưu nháp</b> lưu ở Sản xuất (chưa tạo gì trên ĐTMS). <b>Gửi phê duyệt</b> khởi tạo hồ sơ phê duyệt đề xuất (Lãnh đạo Khối Duyệt / Từ chối — GIẢ LẬP P-255). <b>Được duyệt thì hệ thống mới gọi API-01 tạo ĐXMS</b> trên ĐTMS (nguồn Phân hệ Quản lý sản xuất) và đề xuất nhận mã ĐXMS; chưa duyệt / bị từ chối thì chưa tạo.',
        'API lỗi (mất kết nối, ĐTMS từ chối) thì Trạng thái gửi ĐTMS = Gửi lỗi, chưa có mã ĐXMS; người lập bấm Gửi lại, không phải duyệt lại (GIẢ LẬP: prototype gọi luôn thành công, đề xuất gửi lỗi có sẵn trong dữ liệu mẫu).',
        'Nguồn kinh phí trích từ căn cứ hình thành của dự án; chỉ tiêu kỹ thuật đính kèm từ Kho sản phẩm sẵn sàng sản xuất — sản phẩm chưa qua cổng chuyển giao thì chưa lập được (SX-KS-K2 §4.1). Giá trị dự kiến = tổng thành tiền các vật tư chọn mua.',
        '<b>Nhu cầu vật tư đề xuất mua</b>: MBOM dự toán (VMMS) × số lượng dự án; <b>Tra cứu tồn kho</b> đọc tồn khả dụng ERP Kho TCT tức thì; đề xuất mua = nhu cầu − tồn, sửa được. Đợt 1 gợi ý vật tư leadtime từ 16 tuần, đợt 2 phần còn lại (GIẢ LẬP P-248). Mở từ Nhu cầu vật tư thì chọn sẵn các vật tư đã chọn ở đó.',
      ],
      q: INFO_Q.concat('P-255'), src: 'task-management/components/task-create · /task-management/create',
    };
    const sel = (id, key, opts, o) => vSelect(Object.assign({ id, value: v[key], placeholder: 'Chọn ' + ((o && o.ph) || ''), invalid: !!err[key], options: opts,
      onChange: (val) => { keep(); v[key] = key === 'dot' ? Number(val) : val; delete err[key];
        if (key === 'project') { const pp = P().byCode(val); v.title = pp ? `Mua sắm vật tư sản xuất ${pp.product} — đợt ${v.dot}` : ''; v.rows = pick(val, v.dot); v.period = periodOf(pp); }
        if (key === 'dot') { v.rows = pick(v.project, v.dot); if (v.project) v.title = v.title.replace(/đợt \d$/, 'đợt ' + v.dot); }
        rerender(); } }, o || {}));
    const m = p ? mbomOf(p) : [];
    const rows = v.rows.map((r) => Object.assign({}, m.find((y) => y.code === r.code), r));
    const total = rows.filter((r) => r.on).reduce((a, r) => a + r.qty * r.price, 0);
    const tbl = p ? k.table([['', 50, 'c'], ['Vật tư', 340], ['ĐVT', 70], ['Định mức / bộ', 110, 'r'], ['Nhu cầu', 110, 'r'], ['Tồn kho TCT', 120, 'r'], ['Đề xuất mua', 130, 'r'],
      ['Đơn giá dự toán (đồng)', 170, 'r'], ['Thành tiền (đồng)', 170, 'r'], ['Leadtime (tuần)', 120, 'r'], ['Export License', 120, 'c']], rows,
    (r) => `<td class="c"><input type="checkbox" data-sxm-on="${esc(r.code)}" ${r.on ? 'checked' : ''} aria-label="Chọn ${esc(r.code)}"></td><td>${NC(r.name, r.code)}</td><td>${esc(r.unit)}</td>
      <td class="r num">${num(r.per)}</td><td class="r num">${num(r.per * p.qty)}</td><td class="r num">${num(stockOf(r.code))}</td>
      <td class="r"><input class="vctl num r" style="width:100px" inputmode="numeric" data-sxm-qty="${esc(r.code)}" value="${r.qty}" ${r.on ? '' : 'disabled'}></td>
      <td class="r num">${num(r.price)}</td><td class="r num">${r.on ? num(r.qty * r.price) : k.dash}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? 'Có' : 'Không'}</td>`) : '<p class="faint">Chọn dự án để lấy nhu cầu vật tư theo MBOM dự toán (xem Danh mục vật tư ở màn Nhu cầu vật tư).</p>';
    const ro = (val, ph) => `<input class="vctl" value="${esc(val)}" placeholder="${ph}" disabled>`;
    return `<form class="pg" data-sxm-form="${x ? esc(x.ref) : ''}">
      ${head({ title: x ? 'Chỉnh sửa đề xuất mua sắm' : 'Lập đề xuất mua sắm', back, lg: true, info,
    right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="button" class="vbtn secondary" data-sxm-save>Lưu nháp</button><button type="submit" class="vbtn primary">Gửi phê duyệt</button>` })}
      ${err.gate ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>${esc(err.gate)}</span></div></div>` : ''}
      ${x && x.rejected ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Đề xuất bị từ chối: ${esc(x.rejected)}</span></div></div>` : ''}
      <section class="vcard"><h3>Thông tin chung</h3><div class="grid3">
        ${k.field('Mã ĐXMS', ro('', 'Hệ thống tự sinh khi đề xuất được phê duyệt'))}
        ${k.field('Tên đề xuất mua sắm', `<input class="vctl" id="sxm-title" maxlength="500" placeholder="Ví dụ: Đề xuất mua sắm vật tư dự án A" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span2' })}
        ${k.field('Dự án sản xuất', sel('sxm-project', 'project', projOpts().map((pp) => ({ value: pp.code, label: `${pp.code} — ${pp.name}` })), { searchable: true, ph: 'dự án', disabled: !!x }), { req: true, err: err.project, cls: 'span2' })}
        ${k.field('Đơn vị đề xuất', ro('Trung tâm Sản xuất', ''), { req: true })}
        ${k.field('Mức ưu tiên', sel('sxm-pri', 'priority', PRIORITIES.map((s) => ({ value: s, label: s })), { searchable: false, ph: 'mức ưu tiên' }), { req: true })}
        ${k.field('Đợt mua sắm', sel('sxm-dot', 'dot', [{ value: 1, label: 'Đợt 1' }, { value: 2, label: 'Đợt 2' }], { ph: 'đợt' }), { req: true })}
        ${k.field('Thời gian thực hiện', `<input class="vctl" id="sxm-period" maxlength="50" placeholder="Ví dụ: 01/2027 – 09/2027" value="${esc(v.period || '')}">`)}
        ${k.field('Giá trị dự kiến (đồng)', ro(p ? num(total) : '', 'Tổng thành tiền vật tư chọn mua'))}
        ${k.field('Nguồn kinh phí', ro(p ? `${D.sxBasis[(p.basis || [])[0]] || ''} — ${(p.basis || [])[1] || ''}` : '', 'Theo căn cứ hình thành của dự án'), { cls: 'span2' })}
        ${k.field('Chỉ tiêu kỹ thuật', ro(p ? (rel ? `${p.product} ${rel.ver || p.version} — Kho sản phẩm sẵn sàng sản xuất${rel.pkg ? ` (gói ${rel.pkg})` : ''}` : 'Sản phẩm chưa có trong Kho sản phẩm sẵn sàng sản xuất') : '', 'Theo Kho sản phẩm sẵn sàng sản xuất'), { cls: 'span2' })}
        ${k.field('Người tạo', ro(pName(x ? x.creator : pid()), ''))}
        ${k.field('Ghi chú', `<textarea class="vctl" id="sxm-note" rows="2" maxlength="2000" placeholder="Nhập ghi chú">${esc(v.note)}</textarea>`, { cls: 'span3' })}
      </div></section>
      <section class="vcard pad24" data-sxm-lines><div class="vcard-h"><h3>Nhu cầu vật tư đề xuất mua</h3><div class="row">
        ${U.stockAt ? `<span class="cap">Tồn kho cập nhật ${esc(U.stockAt)}</span>` : ''}${p ? '<button type="button" class="vbtn secondary" data-sxm-stock>Tra cứu tồn kho</button>' : ''}</div></div>
        ${err.lines ? `<div class="t-err" style="margin:0 0 8px">${esc(err.lines)}</div>` : ''}${tbl}
        ${p ? `<div style="display:flex;justify-content:flex-end;padding-top:12px"><b>Tổng giá trị dự toán: <span data-sxm-total>${num(total)}</span> đồng</b></div>` : ''}</section></form>`;
  }
  function validate(send) {
    keep();
    const v = F.v, err = F.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên đề xuất mua sắm.';
    if (!v.project) err.project = 'Bạn cần chọn Dự án sản xuất.';
    const p = v.project && P().byCode(v.project);
    if (p && !window.SxCg.ready(p.product)) err.gate = `Sản phẩm ${p.product} ${p.version} chưa có trong Kho sản phẩm sẵn sàng sản xuất (gói chuyển giao chưa được duyệt), chưa lập được đề xuất mua sắm.`;
    if (send && p && !v.rows.some((r) => r.on && r.qty > 0)) err.lines = 'Bạn cần chọn ít nhất một vật tư có số lượng đề xuất mua lớn hơn 0.';
    return !Object.keys(err).length;
  }
  /* Lưu ở Sản xuất (chưa tạo gì trên ĐTMS). ref = khoá nội bộ của đề xuất chưa có mã ĐXMS. */
  function store() {
    const v = F.v, lines = v.rows.filter((r) => r.on).map((r) => [r.code, r.qty]);
    const data = { project: v.project, title: v.title.trim(), dot: v.dot, note: v.note.trim(), priority: v.priority, period: (v.period || '').trim(), lines };
    let ref = F.ref;
    if (ref) patchP(ref, data);
    else {
      const n = Math.max(0, ...all().map((x) => Number((/^DX(\d+)$/.exec(x.ref) || [])[1] || 0))) + 1;
      ref = 'DX' + String(n).padStart(4, '0');
      U.props.unshift(Object.assign({ ref, code: '', creator: pid(), created: D.sxToday }, data));
      persist();
      P().log(v.project, 'Lập đề xuất mua sắm', data.title);
    }
    F.ref = ref;
    return ref;
  }
  function saveDraft() {
    if (!validate(false)) { rerender(); return; }
    store();
    toast('<b>Thành công</b><br>Lưu nháp thành công!');
    location.hash = '#/sx/mua-sam';
  }
  /* Gửi phê duyệt: khởi tạo hồ sơ SX-MS (bước 1 Lãnh đạo Khối). Dùng từ form (sau khi lưu) và từ Chi tiết. */
  function submitDlg(ref) {
    const x = byCode(ref);
    if (!x || !canEditP(x)) return;
    if (!x.lines.some((l) => l[1] > 0)) { toast('Bạn cần chọn ít nhất một vật tư có số lượng đề xuất mua lớn hơn 0.', 'warn'); return; }
    const m = vModal({ title: 'Gửi phê duyệt đề xuất', size: 'sm', body: `<p>Gửi đề xuất <b>${esc(x.title)}</b> (dự toán ${num(totalOf(x))} đồng) để Lãnh đạo Khối phê duyệt?</p><p class="cap">Đề xuất được duyệt thì hệ thống mới tạo đề xuất mua sắm trên ĐTMS. Trong thời gian chờ phê duyệt, đề xuất không chỉnh sửa được.</p>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-sxm-send-ok>Gửi</button>' });
    m.el.querySelector('[data-sxm-send-ok]').onclick = () => {
      patchP(ref, { rejected: null });
      FL().start('SX-MS', ref);
      m.close(); toast('<b>Thành công</b><br>Gửi phê duyệt thành công!');
      location.hash = '#/sx/mua-sam';
      rerender();
    };
  }
  function send() {
    if (!validate(true)) { rerender(); return; }
    submitDlg(store());
  }
  /* API-01 (GIẢ LẬP): tạo ĐXMS trên ĐTMS — chỉ gọi khi đề xuất đã được duyệt. Trả mã ĐXMS. */
  function api(x) {
    const p = P().byCode(x.project), est = Math.round(totalOf(x) / 1e6) / 1e3;
    return Flow.createDxms({ nv: null, title: x.title, unit: 'Trung tâm Sản xuất', priority: x.priority || 'Thường', est, period: x.period || periodOf(p), src: 'SX', sxProject: p.code });
  }
  function toDtms(ref) {
    const x = byCode(ref), code = api(x);
    patchP(ref, { code, api: 'OK', sent: D.sxToday, apiErr: null });
    P().log(x.project, 'Gửi đề xuất mua sắm sang ĐTMS (tạo ĐXMS)', `${x.title} → ${code}`);
    return code;
  }
  Object.assign(FL().ACT, {
    'ms.start': (c) => { const x = byCode(c.obj); P().log(x.project, 'Gửi phê duyệt đề xuất mua sắm', x.title); },
    'ms.review': (c, ch) => {
      const x = byCode(c.obj);
      if (ch && ch[2] === 'no') { c.vars.msRejected = true; patchP(x.ref, { rejected: c.vars.ykNoiDung || 'Từ chối' }); P().log(x.project, 'Từ chối đề xuất mua sắm', `${x.title}: ${c.vars.ykNoiDung || ''}`); return; }
      patchP(x.ref, { rejected: null, approved: D.sxToday, approver: pid() });
      P().log(x.project, 'Duyệt đề xuất mua sắm', x.title);
    },
    'ms.send': (c) => { toDtms(c.obj); },
  });
  /* Gửi lại: gọi lại API-01 cho đề xuất đã duyệt nhưng gửi lỗi (không phải duyệt lại). */
  function resend(ref) {
    const x = byCode(ref);
    if (!x || !canResend(x)) return;
    const code = toDtms(ref);
    toast(`<b>Thành công</b><br>Đã gửi sang ĐTMS, mã đề xuất mua sắm ${esc(code)}.`);
    rerender();
  }

  /* ---------- SX-10 Chi tiết ---------- */
  function detail(ref, opt) {
    const o = opt || {}, k = K(), x = byCode(ref);
    const involved = x && FL().cases(x.ref, 'SX-MS').some((cc) => cc.tokens.some((t) => t.who === pid()) || cc.hist.some((h) => h.who === pid()));
    if (!x || (!visible().some((y) => y.ref === x.ref) && !involved && !isAdmin())) return `<div class="pg">${head({ title: o.title || 'Xem chi tiết đề xuất mua sắm', back: o.back || 'sx/mua-sam', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy đề xuất mua sắm hoặc bạn không có quyền xem.')}</div>`;
    /* T73: đã có ĐXMS trên ĐTMS → nguyên các tab của Chi tiết ĐXMS (luong.js body), chỉ xem. */
    if (x.code && window.Luong && Flow.findDxms(x.code) && !o.task && !o.bar) return window.Luong.detailSx(x.code);
    const p = P().byCode(x.project), lines = linesOf(x), hs = caseOf(x), pr = hs ? FL().progress(hs) : null;
    const info = {
      scr: 'SX-10', name: 'Chi tiết đề xuất mua sắm từ sản xuất', uc: 'SX-KS-K2 §2.3, §6',
      notes: ['Đề xuất chưa có trên ĐTMS (Nháp / Chờ phê duyệt / Bị từ chối, hoặc đã duyệt nhưng gửi lỗi): hiện dữ liệu lưu ở Sản xuất. Được duyệt và gửi thành công thì màn này là Chi tiết ĐXMS của ĐTMS.',
        'Card <b>Hồ sơ phê duyệt đề xuất</b>: hồ sơ mới nhất của luồng phê duyệt (P-255). Màn xử lý việc của Lãnh đạo Khối dùng chính thân màn này + thanh trạng thái.',
        '<b>Xoá</b>: chỉ đề xuất Nháp chưa gửi phê duyệt lần nào — đã có hồ sơ phê duyệt (kể cả Bị từ chối) thì giữ để tra vết.'],
      q: INFO_Q.concat('P-255'), src: 'task-create (mode detail)',
    };
    const right = o.task ? '' : (canDelP(x) ? `<button type="button" class="vbtn secondary" data-sxm-del="${esc(x.ref)}">${icon('del')} Xoá</button>` : '')
      + (canEditP(x) ? `<button type="button" class="vbtn secondary" data-go="${href(x)}/edit">${icon('edit')} Chỉnh sửa</button><button type="button" class="vbtn primary" data-sxm-submit="${esc(x.ref)}">Gửi phê duyệt</button>` : '')
      + (canResend(x) ? `<button type="button" class="vbtn primary" data-sxm-resend="${esc(x.ref)}">Gửi lại</button>` : '');
    const alert = x.rejected && !approved(x) && !pending(x) ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Đề xuất bị từ chối: ${esc(x.rejected)}</span></div></div>`
      : x.apiErr ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Gửi sang ĐTMS lỗi: ${esc(x.apiErr)}</span></div></div>` : '';
    return `<div class="pg" data-sxm-detail="${esc(x.ref)}">
      ${head({ title: o.title || 'Xem chi tiết đề xuất mua sắm', back: o.back || 'sx/mua-sam', lg: true, info, right })}${o.bar || ''}${alert}
      ${k.card('Thông tin chung', `<div class="ginfo c3">${k.kv('Mã ĐXMS', x.code ? esc(x.code) : '<span class="faint">Chưa có — tạo khi đề xuất được phê duyệt</span>')}${k.kv('Tên đề xuất mua sắm', esc(x.title), 'span2')}
        ${k.kv('Trạng thái phê duyệt', apprCell(x))}${k.kv('Trạng thái gửi ĐTMS', sendCell(x))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}
        ${k.kv('Đợt mua sắm', String(x.dot))}${k.kv('Mức ưu tiên', esc(x.priority || 'Thường'))}${k.kv('Thời gian thực hiện', x.period ? esc(x.period) : null)}
        ${k.kv('Nguồn kinh phí', p ? esc(`${D.sxBasis[(p.basis || [])[0]] || ''} — ${(p.basis || [])[1] || ''}`) : null, 'span2')}${k.kv('Giá trị dự toán', `${num(totalOf(x))} đồng`)}
        ${k.kv('Người tạo', esc(pName(x.creator)))}${k.kv('Ngày tạo', esc(dmy(x.created)))}${k.kv('Ngày gửi ĐTMS', x.sent ? esc(dmy(x.sent)) : null)}
        ${k.kv('Người duyệt', x.approver ? esc(pName(x.approver)) : null)}${k.kv('Ngày duyệt', x.approved ? esc(dmy(x.approved)) : null)}
        ${k.kv('Ghi chú', x.note ? esc(x.note) : null, 'span3')}</div>`)}
      ${k.card('Nhu cầu vật tư đề xuất mua', k.table([['Vật tư', 330], ['ĐVT', 60], ['Đề xuất mua', 110, 'r'], ['Đơn giá dự toán (đồng)', 150, 'r'], ['Thành tiền (đồng)', 150, 'r'], ['Leadtime (tuần)', 100, 'r'], ['Export License', 100, 'c']], lines,
        (r) => `<td>${NC(r.name, r.code)}</td><td>${esc(r.unit)}</td><td class="r num">${num(r.qty)}</td><td class="r num">${num(r.price)}</td><td class="r num">${num(r.qty * r.price)}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? 'Có' : 'Không'}</td>`))}
      ${pr ? `<div data-sxm-hs>${k.card('Hồ sơ phê duyệt đề xuất', pr.top + pr.steps)}${k.card('Lịch sử xử lý', pr.hist)}</div>` : ''}
      <section class="vcard pad24" data-sxm-chain><div class="vcard-h"><h3>Tiến trình trên ĐTMS</h3>${x.sync ? '<span class="cap">Dữ liệu đồng bộ từ ĐTMS</span>' : ''}</div>${chainTable(x)}</section></div>`;
  }
  /* Ngữ cảnh eForm của luồng SX-MS. */
  function ctx(ref) {
    const x = byCode(ref);
    return { de: { code: x.code || '', title: x.title, project: x.project, dot: x.dot, lines: x.lines.length, totalText: num(totalOf(x)) } };
  }
  /* Nhãn đối tượng ở Việc của tôi / hồ sơ (SxFlow.objLink): tên đề xuất, kèm mã ĐXMS khi đã có — không hiện khoá nội bộ. */
  const label = (ref) => { const x = byCode(ref); return x ? `${x.title}${x.code ? ` (${x.code})` : ''}` : ref; };

  /* ---------- Gói thầu, hợp đồng (đọc ngược ĐTMS — API-02, API-03; chỉ xem) ---------- */
  function pkgRows() {
    return visible().flatMap((x) => {
      const c = chain(x);
      if (!c) return [];
      const go = (kind, code) => (c.live ? `${kind === 'GT' ? 'goi-thau' : 'hop-dong'}/${encodeURIComponent(code)}` : href(x));
      return c.pkgs.map((g) => ({ kind: 'GT', code: g[0], name: g[1], st: [g[2], g[3]], ncc: '', value: null, at: '', x, go: go('GT', g[0]) }))
        .concat(c.hd.map((h) => ({ kind: 'HD', code: h[0], name: h[1], st: [h[2], h[3]], ncc: h[4] || '', value: h[5], at: h[6] || '', x, go: go('HD', h[0]) })));
    });
  }
  function pkgList() {
    // Theo: task-management (danh sách chỉ xem, như SCR-103 Danh sách đề tài / dự án) — dữ liệu đọc ngược ĐTMS
    const k = K(), KIND = { GT: 'Gói thầu', HD: 'Hợp đồng' };
    const info = {
      scr: 'SX-10', name: 'Danh sách gói thầu, hợp đồng của dự án sản xuất', uc: 'SX-ULNL (Thông tin gói thầu, hợp đồng: Danh sách, Tìm kiếm, Xem chi tiết); SX-KS-K2 §6 API-02, API-03',
      notes: ['Chỉ xem: gói thầu và hợp đồng sinh từ các đề xuất mua sắm của dự án sau khi ĐTMS xử lý (API-02 gói thầu, API-03 hợp đồng). Mã mở thẳng màn ĐTMS khi dữ liệu là liên kết trực tiếp; dữ liệu đồng bộ (đề xuất chuyển đổi) mở đề xuất nguồn.',
        'Thật: BE phân hệ Sản xuất gọi API ĐTMS theo mã ĐXMS đã lưu; không lưu bản sao gói thầu / hợp đồng.'],
      q: ['P-249'], src: 'task-management/task-management.component · /task-management (chỉ xem)',
    };
    return k.listPage({
      id: 'sxgt', exp: 'Danh sach goi thau hop dong', title: 'Danh sách gói thầu, hợp đồng', ph: 'Tìm kiếm theo mã, tên, dự án', info,
      rows: () => pkgRows(), kwText: (r) => `${r.code} ${r.name} ${r.x.project} ${r.ncc}`,
      empty: () => ({ kind: null, project: null, code: '' }),
      match: (r, f) => (!f.kind || r.kind === f.kind) && (!f.project || r.x.project === f.project) && k.has(f.code, r.code),
      adv: (txt, sel) => `${sel('kind', 'Loại', { searchable: false, options: Object.entries(KIND).map(([value, label]) => ({ value, label })) })}
        ${sel('project', 'Dự án', { options: P().visible().map((pp) => ({ value: pp.code, label: `${pp.code} — ${pp.name}` })) })}${txt('code', 'Mã gói thầu / hợp đồng')}`,
      cols: [['Trạng thái', 170, 'c'], ['Loại', 100], ['Tên', 400], ['Dự án', 240], ['Đề xuất mua sắm', 150], ['Nhà thầu', 240], ['Giá trị (đồng)', 170, 'r'], ['Ngày ký', 120]],
      href: (r) => r.go,
      cell: (r) => `<td class="c">${badge(...r.st)}</td><td>${KIND[r.kind]}</td><td>${NC(r.name, r.code, { go: r.go, tip: 'Xem chi tiết' })}</td><td>${PJ(r.x.project)}</td>
        <td><a class="link" data-go="${href(r.x)}">${esc(r.x.code)}</a></td><td>${r.ncc ? k.clamp(r.ncc) : k.dash}</td><td class="r num">${r.value ? num(r.value) : k.dash}</td><td class="num">${r.at ? esc(dmy(r.at)) : k.dash}</td>`,
    });
  }

  /* ---------- Tab Mua sắm & hợp đồng của dự án ---------- */
  function projectTab(p) {
    const k = K(), l = all().filter((x) => x.project === p.code);
    const can = p.status !== 'DONE' && (isAdmin() || p.pm === pid());
    const hd = l.flatMap((x) => { const c = chain(x); return c ? c.hd.map((h) => [x, h]) : []; });
    const kho = l.flatMap((x) => { const c = chain(x); return c ? c.kho.map((n) => [x, n]) : []; });
    return `<div data-sx-ms>
      <section class="vcard pad24"><div class="vcard-h"><h3>Đề xuất mua sắm</h3>${can ? `<button type="button" class="vbtn secondary" data-go="sx/mua-sam/create/${encodeURIComponent(p.code)}">${icon('add')} Lập đề xuất mua sắm</button>` : ''}</div>
        ${k.table([['Đề xuất mua sắm', 400], ['Đợt', 70, 'c'], ['Giá trị dự toán (đồng)', 180, 'r'], ['Trạng thái phê duyệt', 150, 'c'], ['Trạng thái gửi ĐTMS', 170, 'c']], l,
    (x) => `<td>${nameCell(x)}</td><td class="c">${x.dot}</td><td class="r num">${num(totalOf(x))}</td>
      <td class="c">${apprCell(x)}</td><td class="c">${sendCell(x)}</td>`)}</section>
      ${k.card('Hợp đồng', k.table([['Hợp đồng', 420], ['Nhà thầu', 260], ['Giá trị (đồng)', 170, 'r'], ['Trạng thái', 150, 'c']], hd,
    ([, h]) => `<td>${NC(h[1], h[0])}</td><td>${h[4] ? k.clamp(h[4]) : k.dash}</td><td class="r num">${h[5] ? num(h[5]) : k.dash}</td><td class="c">${badge(h[2], h[3])}</td>`))}
      ${k.card('Nhập kho Tổng công ty', k.table([['Phiếu nhập kho', 460], ['Ngày nhập', 130], ['Trạng thái', 150, 'c']], kho,
    ([, n]) => `<td>${NC(n[1], n[0])}</td><td class="num">${esc(dmy(n[2]))}</td><td class="c">${badge(n[3], 'success')}</td>`))}
      ${window.SxNc ? window.SxNc.supplyCard(p) : ''}</div>`;
  }

  async function delP(ref) {
    const x = byCode(ref);
    if (!x || !canDelP(x)) return;
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa đề xuất mua sắm: ${x.title} không?`, hl: x.title, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    U.props = U.props.filter((y) => y.ref !== x.ref);
    if (D.sxProposals.some((y) => (y.ref || y.code) === x.ref)) U.del = (U.del || []).concat(x.ref);
    persist();
    P().log(x.project, 'Xoá đề xuất mua sắm', x.title); // chỉ Nháp chưa gửi phê duyệt — chưa có gì trên ĐTMS
    toast('<b>Thành công</b><br>Xoá đề xuất mua sắm thành công');
    if (location.hash !== '#/sx/mua-sam') location.hash = '#/sx/mua-sam'; else rerender();
  }
  /* ---------- Sự kiện ---------- */
  document.addEventListener('submit', (e) => { if (e.target.closest && e.target.closest('[data-sxm-form]')) { e.preventDefault(); send(); } });
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    if (t.closest('[data-sxm-save]')) { saveDraft(); return; }
    const sb = t.closest('[data-sxm-submit]');
    if (sb) { submitDlg(sb.dataset.sxmSubmit); return; }
    const dl = t.closest('[data-sxm-del]');
    if (dl) { e.stopImmediatePropagation(); delP(dl.dataset.sxmDel); return; }
    const rs = t.closest('[data-sxm-resend]');
    if (rs) { e.stopImmediatePropagation(); resend(rs.dataset.sxmResend); return; } // không để dòng (data-go) mở chi tiết
    if (t.closest('[data-sxm-stock]')) { keep(); U.stockAt = `${dmy(D.sxToday)} ${new Date().toTimeString().slice(0, 5)}`; persist(); toast('Đã cập nhật tồn kho khả dụng từ ERP Kho TCT.', 'success'); rerender(); }
  });
  document.addEventListener('change', (e) => {
    const on = e.target.closest && e.target.closest('[data-sxm-on]');
    if (on) { keep(); const r = F.v.rows.find((x) => x.code === on.dataset.sxmOn); if (r) r.on = on.checked; delete F.err.lines; rerender(); return; }
    const q = e.target.closest && e.target.closest('[data-sxm-qty]');
    if (q) { keep(); rerender(); }
  });

  function route(parts) {
    if (parts[0] === 'goi-thau-hd') return pkgList();
    const [, a, b] = parts;
    if (a === 'create') return form(null);
    if (a && b === 'edit') return form(decodeURIComponent(a));
    if (a) { const c = decodeURIComponent(a); return !byCode(c) && /^ĐXMS/.test(c) && window.Luong ? window.Luong.detailSx(c) : detail(c); }
    /* Góp ý 27/11: menu Đề xuất mua sắm — một mã (mã ĐXMS, có khi được duyệt và gửi), một tên; cột Trạng thái phê duyệt (duyệt nội bộ) và Trạng thái gửi ĐTMS. */
    return list();
  }
  function enter(parts) {
    if (parts[0] !== 'mua-sam') return;
    if (parts[1] === 'create') resetForm(null, parts[2] ? decodeURIComponent(parts[2]) : null);
    else if (parts[2] === 'edit') resetForm(decodeURIComponent(parts[1]));
  }
  function reset() { U = blank(); persist(); }

  window.SxMs = { route, enter, reset, all, byCode, chain, projectTab, totalOf, detail, ctx, preset, stOf: apprSt, sendOf: sendSt, label, viewTitle: 'Xem chi tiết đề xuất mua sắm', tabKey: (code) => 'ms:' + code };
})();
