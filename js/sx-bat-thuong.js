/* Phân hệ Quản lý sản xuất — Bất thường sản xuất (T71 S6, D-121). SX-08: danh sách phiếu (hạn xử lý theo SLA, quá hạn), Thêm mới (BM.QLBT.01), chi tiết; luồng SX-BT trên sx-flow.js.
   Bước 2 phân loại theo danh mục "Loại bất thường và SLA" (SX-13): loại quyết định đơn vị triển khai ở bước 5 (QLSX → PM dự án, R&D → kỹ sư thiết kế, Nhà máy → nhà máy),
   mức độ quyết định số ngày làm việc; hạn = ngày tiếp nhận + số ngày làm việc (bỏ thứ Bảy, Chủ nhật — GIẢ LẬP P-251). Loại 3 theo quy trình nhà máy, không có hạn (P-240).
   Kiểm tra Không đạt (NOK) quay lại bước 3 (cấu hình choices). Route: #/sx/bat-thuong, #/sx/bat-thuong/<mã>. Lưu localStorage sx-proto-bt. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const prodName = (c) => ((D.sxProducts || []).find((p) => p.code === c) || {}).name || '';
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const F = () => window.SxFlow;
  const P = () => window.SxDuAn;
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };

  /* ---------- Ngày làm việc ---------- */
  const isoD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = (s) => new Date(Date.parse(String(s).slice(0, 10) + 'T00:00:00'));
  function addWd(s, n) { const d = parse(s); let k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) k += 1; } return isoD(d); }
  /* Số ngày làm việc từ a tới b (b > a dương). */
  function wdBetween(a, b) { const s = parse(a), e = parse(b), sign = e >= s ? 1 : -1; const d = new Date(sign > 0 ? s : e), end = sign > 0 ? e : s; let k = 0; while (d < end) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) k += 1; } return k * sign; }

  /* ---------- Phiếu ---------- */
  const KEY = 'sx-proto-bt';
  const blank = () => ({ created: [], edit: {} });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const catRow = (type) => window.Catalog.rows('sx-bat-thuong').find((r) => r.code === type) || null;
  const UNIT_TEXT = { QLSX: 'Quản lý sản xuất', RD: 'Nghiên cứu phát triển (R&D)', NM: 'Nhà máy' };
  const typeText = (t) => { const r = catRow(t); return r ? r.name.split(' — ')[0] : ''; };
  const classText = (t, sev) => [typeText(t), D.sxSev[sev] || ''].filter(Boolean).join(' · ');
  /* Đơn vị / người triển khai bước 5 theo đơn vị xử lý của loại (danh mục). */
  const handlerOf = (x, p) => { const r = catRow(x.type); const u = r ? r.unit : null; return u === 'RD' ? 'sxrd' : u === 'NM' ? 'sxnm' : p ? p.pm : null; };
  function slaOf(x) {
    const r = catRow(x.type);
    if (!r || !x.sev) return null;
    const n = r['sla' + x.sev];
    return n ? Number(n) : null;
  }
  /* Nhánh hoaidt10: tên theo danh mục (Nơi phát hiện, Công đoạn, Ca sản xuất, Đơn vị tính, Nhóm nguyên nhân); không có trong danh mục thì giữ nguyên chữ đã lưu. */
  const catN = (key, c) => { if (!c) return ''; const r = window.Catalog.rows(key).find((x) => x.code === c); return r ? r.name : String(c); };
  const causesText = (x) => (x.causes || []).map((c) => catN('sx-nhom-nguyen-nhan', c)).join(', ');
  const defectPct = (x) => (x.sample > 0 && x.qty != null ? Math.round(x.qty / x.sample * 10000) / 100 : null);
  const spOf = (x, p) => x.spMa || (p ? p.product : '');
  function decorate(x) {
    const p = P().byCode(x.project), sla = slaOf(x), due = sla && x.received ? addWd(x.received, sla) : null;
    const r = catRow(x.type);
    return Object.assign({}, x, { pm: p ? p.pm : null, handler: handlerOf(x, p), sla, due, unitText: r ? UNIT_TEXT[r.unit] : '', projectName: p ? p.name : '',
      spMa: spOf(x, p), spTen: ((D.sxProducts || []).find((s) => s.code === spOf(x, p)) || {}).name || '', khachN: x.khach || (p && p.customer) || '', donViC: x.donVi || (p && p.factory) || '',
      donViN: catN('sx-don-vi', x.donVi || (p && p.factory) || '') });
  }
  const all = () => U.created.concat(D.sxIssues).map((x) => Object.assign({}, x, U.edit[x.code] || {})).filter((x) => !x.deleted).map(decorate);
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const caseOf = (x) => { const l = F().cases(x.code, 'SX-BT'); return l[l.length - 1] || null; };
  /* T74 #98: trạng thái theo bước đang chạy của luồng SX-BT (bước 2…7) + Đã đóng. Quá hạn không còn là trạng thái — tô đỏ ở Hạn xử lý / Còn lại (isOver). */
  const ST_STEP = { 1: ['Chờ tiếp nhận', 'default'], 2: ['Chờ tiếp nhận', 'default'], 3: ['Đang đề xuất giải pháp', 'info'], 4: ['Chờ đánh giá giải pháp', 'warning'],
    5: ['Đang xử lý', 'info'], 6: ['Chờ đánh giá kết quả xử lý', 'warning'], 7: ['Đang lưu hồ sơ', 'info'] };
  const ST_LIST = ['Lưu nháp', 'Chờ tiếp nhận', 'Đang đề xuất giải pháp', 'Chờ đánh giá giải pháp', 'Đang xử lý', 'Chờ đánh giá kết quả xử lý', 'Đang lưu hồ sơ', 'Đã đóng'];
  function stOf(x) {
    if (x.draft) return ['Lưu nháp', 'default'];
    if (x.closed) return ['Đã đóng', 'success'];
    const c = caseOf(x), t = c && c.status !== 'done' ? c.tokens[0] : null;
    if (t && ST_STEP[t.step]) return ST_STEP[t.step];
    return x.received ? ['Đang xử lý', 'info'] : ['Chờ tiếp nhận', 'default'];
  }
  const isOver = (x) => !x.closed && !!x.due && D.sxToday > x.due;
  const leftOf = (x) => (x.due && !x.closed ? wdBetween(D.sxToday, x.due) : null);
  const stepOf = (x) => { const c = caseOf(x); if (!c || c.status === 'done') return ''; const st = D.sxFlows['SX-BT'].steps.find((s) => String(s[0]) === String((c.tokens[0] || {}).step)); return st ? `${st[0]}. ${st[1]}` : ''; };
  const whoOf = (x) => { const c = caseOf(x); return c && c.tokens[0] ? pName(c.tokens[0].who) : ''; };
  const projIds = () => new Set(P().visible().map((p) => p.code));
  const involved = (x) => F().cases(x.code).some((c) => c.tokens.some((t) => t.who === pid()) || c.hist.some((h) => h.who === pid()));
  const visible = () => { const ids = projIds(); return all().filter((x) => ids.has(x.project) || involved(x)); };
  const canCreate = () => isAdmin() || ['R-SX-QA', 'R-SX-PM', 'R-SX-SUBPM', 'R-SX-NM'].includes(D.roleOf(pid()));

  /* ---------- Bộ xử lý hành động của SX-BT ---------- */
  /* Giá trị form lap → bản ghi phiếu (T74 #100). */
  const fromForm = (v) => ({ project: v.btProject, proc: v.btQuyTrinh || '', title: String(v.btTitle || '').trim(), type: v.btLoai || null, sev: v.btMucDo ? Number(v.btMucDo) : null, desc: String(v.btDesc || '').trim(),
    found: fromDmy(String(v.btFound || '').split(' ')[0]), foundTime: String(v.btFound || '').split(' ')[1] || '', place: v.btPlace || '', qty: v.btQty == null || v.btQty === '' ? null : Number(v.btQty), unit: v.btQtyDvt || '', guess: String(v.btGuess || '').trim(),
    spMa: v.btSpMa || '', khach: v.btKhach || '', donVi: v.btDonVi || '', serial: v.btSerial || '', sample: v.btCoMau == null || v.btCoMau === '' ? null : Number(v.btCoMau),
    stage: v.btCongDoan || '', op: String(v.btThaoTac || '').trim(), shift: v.btCa || '', req: String(v.btYeuCau || '').trim(), causes: v.btNhomNN || [],
    actions: (v.btDoiSach || []).filter((r) => String(r.hanhDong || '').trim()).map((r) => ({ hd: String(r.hanhDong).trim(), who: r.nguoi || '', han: fromDmy(r.han) || '' })),
    inspect: v.btKiemTra || [], partner: v.btThamGia || [], media: v.btFileMedia || '',
    docs: String(v.btFiles || '').split(', ').filter(Boolean) });
  const FILE_ITEMS = [['bm', 'Phiếu báo cáo bất thường (BM.QLBT.01)'], ['iqc', 'Hồ sơ IQC vật tư, linh kiện, bán thành phẩm'], ['qc', 'Hồ sơ kiểm soát chất lượng trong sản xuất'],
    ['kd', 'Hồ sơ kiểm định / hiệu chuẩn phương tiện đo'], ['khac', 'Tài liệu liên quan khác']];
  const docsOf = (x) => (x.docs || []).concat(Object.values(Object.assign({}, x.file ? { khac: x.file } : {}, x.files || {})).filter(Boolean));
  const filesOf = (x) => Object.assign({}, x.file ? { khac: x.file } : {}, x.files || {});
  const patch = (code, data) => { const own = U.created.find((x) => x.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign({}, U.edit[code], data); persist(); };
  Object.assign(F().ACT, {
    'bt.start': () => {},
    /* T74 #100: bước 1 (Thêm mới hoặc sửa phiếu bị trả lại) ghi thông tin phiếu, phân loại, mức độ, dự đoán nguyên nhân, tệp đính kèm theo mục BM.QLBT.01. */
    'bt.lap': (c, ch, x) => { const v = x.values || {}; if (!byCode(c.obj) || !v.btProject) return; patch(c.obj, fromForm(v)); }, // phiếu hệ thống tự lập (createAuto) không có giá trị form
    /* Bước 2 (T74 #101): Hoàn thành tiếp nhận → ngày tiếp nhận, hạn xử lý (SLA) theo loại / mức độ của phiếu, đơn vị triển khai; Trả lại người lập → về bước 1.
       Phiếu hệ thống tự lập (chưa có loại) thì PM phân loại tại đây như trước. */
    'bt.classify': (c, ch, x) => {
      const v = x.values || {}, it0 = byCode(c.obj);
      if (ch && ch[2] === 'no') { P().log(it0.project, 'Trả lại phiếu bất thường cho người lập', `${it0.code}: ${v.blLyDoTra || ''}`); return; }
      patch(c.obj, Object.assign({ received: D.sxToday }, v.blLoai ? { type: v.blLoai, sev: Number(v.blMucDo) } : {}));
      const it = byCode(c.obj); P().log(it.project, 'Tiếp nhận phiếu bất thường', `${it.code}: ${classText(it.type, it.sev)}`);
    },
    'bt.check': (c, ch) => { if (ch && ch[2] === 'no') { const it = byCode(c.obj); patch(c.obj, { nok: (it.nok || 0) + 1 }); } },
    'bt.close': (c) => { patch(c.obj, { closed: D.sxToday }); const it = byCode(c.obj); P().log(it.project, 'Đóng phiếu bất thường', it.code); },
  });

  /* ---------- SX-08 Danh sách ---------- */
  const href = (x) => 'sx/bat-thuong/' + encodeURIComponent(x.code);
  const leftCell = (x, k) => { const l = leftOf(x); return l == null ? k.dash : `<span class="num ${l < 0 ? 't-err' : ''}">${l < 0 ? `Quá ${-l} ngày` : `${l} ngày`}</span>`; };
  function list() {
    // Theo: task-management (danh sách đối tượng); cột Hạn xử lý tô đỏ khi quá hạn như Việc của tôi
    const k = K();
    const info = {
      scr: 'SX-08', name: 'Danh sách phiếu bất thường', uc: 'SX-KS-K1 §3.2 (QT.VHT.TTSX.4A.1.2), Bảng 6, Bảng 7; SX-KS-K2 §2.2 (Incident Report)',
      notes: [
        'Phiếu bất thường là đối tượng cha của hồ sơ luồng xử lý bất thường (7 bước nháp — GIẢ LẬP P-238). Thêm mới = lập phiếu BM.QLBT.01 và gửi (bước 1), việc tiếp nhận về Giám đốc dự án.',
        '<b>T74 (comment #98, #100, #101):</b> <b>Trạng thái</b> theo bước đang chạy của luồng — Chờ tiếp nhận (bước 2), Đang đề xuất giải pháp (3), Chờ đánh giá giải pháp (4), Đang xử lý (5), Chờ đánh giá kết quả xử lý (6), Đang lưu hồ sơ (7), Đã đóng; quá hạn không còn là trạng thái mà tô đỏ ở Hạn xử lý và Còn lại. <b>Người lập chọn Phân loại và Mức độ ngay khi Thêm mới</b> (bắt buộc), kèm Dự đoán sơ bộ nguyên nhân và hồ sơ đính kèm theo mục của BM.QLBT.01 (chỉ phiếu BM.QLBT.01 bắt buộc); bước 2 Giám đốc dự án chỉ tiếp nhận, phân tích nguyên nhân, đính kèm tài liệu — phân loại / mức độ sai thì <b>Trả lại người lập</b> (sửa phiếu ở bước 1 rồi gửi lại). Lệch SX-KS-K1 §3.2 bước 2 (phân loại do QLSX) theo ý người review — GIẢ LẬP P-238.',
        'Loại và mức độ theo danh mục <b>Loại bất thường và SLA</b>: loại quyết định đơn vị triển khai (Loại 1 QLSX, Loại 2 R&D, Loại 3 Nhà máy), mức độ quyết định số ngày làm việc. Hạn = ngày tiếp nhận + số ngày làm việc (bỏ thứ Bảy, Chủ nhật; chưa tính ngày lễ — GIẢ LẬP P-251). Loại 3 theo quy trình nhà máy, không có hạn (P-240).',
        'Cột Còn lại: số ngày làm việc tới hạn; quá hạn tô đỏ. Kiểm tra Không đạt quay lại bước đề xuất phương án.',
        '<b>Cột và tìm kiếm nâng cao:</b> thêm Mã SP, Serial, Nhóm nguyên nhân, Ngày xử lý (ngày đóng phiếu) và Mã TĐKT liên kết (yêu cầu thay đổi kỹ thuật mở từ phiếu). Nhóm nguyên nhân lấy từ danh mục Nhóm nguyên nhân bất thường.',
      ],
      q: ['P-238', 'P-240', 'P-251'], src: 'task-management/task-management.component · /task-management',
    };
    const ST = ST_LIST;
    return k.listPage({
      id: 'sxbt', exp: 'Danh sach phieu bat thuong', title: 'Danh sách phiếu bất thường', ph: 'Tìm kiếm theo mã, tiêu đề, dự án', info,
      right: canCreate() ? `<button class="vbtn primary" data-sxbt-new>${icon('add')} Thêm mới</button>` : '',
      rows: () => visible().map((x) => Object.assign(x, { st: stOf(x), step: stepOf(x), who: whoOf(x), ecrCode: ((window.SxTd && window.SxTd.ecrOf(x.code)) || {}).code || '' })).sort((a, b) => (a.code < b.code ? 1 : -1)),
      kwText: (x) => `${x.code} ${x.title} ${x.project}`,
      empty: () => ({ code: '', title: '', project: null, type: null, sev: null, st: [], sp: '', serial: '', nn: null, ecr: '' }),
      match: (x, f) => k.has(f.code, x.code) && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.type || x.type === f.type) && (!f.sev || String(x.sev) === String(f.sev)) && k.inSet(f.st, x.st[0])
        && k.has(f.sp, x.spMa || '') && k.has(f.serial, x.serial || '') && (!f.nn || (x.causes || []).includes(f.nn)) && k.has(f.ecr, x.ecrCode || ''),
      adv: (txt, sel) => `${txt('code', 'Mã phiếu')}${txt('title', 'Tiêu đề')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${txt('sp', 'Mã SP')}${txt('serial', 'Serial')}
        ${sel('type', 'Loại bất thường', { options: k.catOpts('sx-bat-thuong') })}
        ${sel('sev', 'Mức độ', { searchable: false, options: Object.entries(D.sxSev).map(([value, label]) => ({ value, label })) })}
        ${sel('nn', 'Nhóm nguyên nhân', { searchable: false, options: k.catOpts('sx-nhom-nguyen-nhan') })}${txt('ecr', 'Thay đổi kỹ thuật liên kết')}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ST.map((x) => ({ value: x, label: x })) })}`,
      /* Góp ý 26/11 mục 3: bỏ cột Mã phiếu / Mã SP — mã kèm dưới tên (SxChung.nameCode); dự án hiện tên kèm mã. */
      cols: [['Trạng thái', 160, 'c'], ['Phiếu bất thường', 300], ['Dự án', 220], ['Sản phẩm', 200], ['Serial', 130], ['Loại', 90], ['Mức độ', 140], ['Nhóm nguyên nhân', 220], ['Đơn vị xử lý', 190],
        ['Bước hiện tại', 240], ['Người đang xử lý', 170], ['Ngày tiếp nhận', 130], ['Hạn xử lý', 120], ['Còn lại', 110, 'r'], ['Ngày xử lý', 120], ['Thay đổi kỹ thuật liên kết', 170]],
      href,
      cell: (x) => `<td class="c">${badge(...x.st)}</td><td>${NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết phiếu bất thường' })}</td><td>${PJ(x.project)}</td>
        <td>${x.spMa ? NC(prodName(x.spMa), x.spMa) : k.dash}</td><td>${x.serial ? esc(x.serial) : k.dash}</td>
        <td>${x.type ? esc(typeText(x.type)) : k.dash}</td><td>${x.sev ? esc(D.sxSev[x.sev]) : k.dash}</td><td>${(x.causes || []).length ? k.clamp(causesText(x)) : k.dash}</td><td>${x.unitText ? k.clamp(x.unitText) : k.dash}</td>
        <td>${x.step ? k.clamp(x.step) : k.dash}</td><td>${x.who ? k.clamp(x.who) : k.dash}</td><td class="num">${x.received ? esc(dmy(x.received)) : k.dash}</td>
        <td class="num${isOver(x) ? ' due-over' : ''}">${x.due ? esc(dmy(x.due)) : x.type && !x.sla ? 'Theo nhà máy' : k.dash}</td><td class="r">${leftCell(x, k)}</td>
        <td class="num">${x.closed ? esc(dmy(x.closed)) : k.dash}</td><td>${x.ecrCode ? `<a class="link" data-go="sx/thay-doi/${encodeURIComponent(x.ecrCode)}" title="Xem chi tiết yêu cầu thay đổi kỹ thuật">${esc(x.ecrCode)}</a>` : k.dash}</td>`,
    });
  }

  /* ---------- Thêm mới phiếu (BM.QLBT.01) = bước 1 của luồng ---------- */
  const catTypes = () => window.Catalog.rows('sx-bat-thuong').filter((r) => r.active !== false).map((r) => [r.code, r.name]);
  const catList = (key) => window.Catalog.rows(key).filter((r) => r.active !== false).map((r) => [r.code, r.name]);
  /* Nhánh hoaidt10 (25/11): trường Quy trình — danh sách của menu Quản lý quy trình, chỉ quy trình có phiên bản ACTIVE. Góp ý 27/11: quy trình của Sản xuất (D.sxWorkflows), không còn quy trình ĐTMS. */
  const procList = () => (D.sxWorkflows || []).filter((w) => w.versions.some((v) => v.status === 'ACTIVE')).map((w) => [w.code, `${w.code} — ${w.name}`]);
  const procName = (code) => { const p = procList().find((x) => x[0] === code); return p ? p[1] : code; };
  /* Danh sách lựa chọn của form Thêm mới: sản phẩm, khách hàng, đơn vị, serial theo dự án, danh mục chuẩn, nhân sự. */
  function lists() {
    const ps = P().visible().filter((p) => p.status !== 'PLANNING' && p.status !== 'DONE'), staff = D.personas.filter((x) => x.sx), pad = (n, l) => String(n).padStart(l, '0');
    return {
      projects: ps.map((p) => [p.code, `${p.code} — ${p.name}`]),
      procs: procList(),
      projectOpts: ps.map((p) => ({ label: `${p.code} — ${p.name}`, value: p.code, fill: { btSpTen: p.product, btSpMa: p.product, btKhach: p.customer || '', btDonVi: p.factory || '' } })),
      products: D.sxProducts.map((p) => [p.code, p.name]),
      customers: [...new Set(P().all().map((p) => p.customer).filter(Boolean))].map((c) => [c, c]),
      units: catList('sx-don-vi'), places: catList('sx-noi-phat-hien'), dvts: catList('sx-don-vi-tinh'), stages: catList('sx-cong-doan'), shifts: catList('sx-ca-san-xuat'), causes: catList('sx-nhom-nguyen-nhan'),
      staffAll: staff.map((x) => [x.id, x.name]), staffVht: staff.filter((x) => x.urd !== 'R-SX-NM').map((x) => [x.id, x.name]), staffPartner: staff.filter((x) => x.urd === 'R-SX-NM').map((x) => [x.id, x.name]),
      serialOpts: P().all().flatMap((p) => { const s = D.sxSerial[p.code]; return s ? Array.from({ length: 12 }, (_, i) => ({ label: s[0] + pad(i + 1, s[1]), value: s[0] + pad(i + 1, s[1]), proj: p.code })) : []; }),
    };
  }
  async function create(project, editCode) {
    const f = window.EForms.sx['SX-BT'].lap, cur = editCode ? byCode(editCode) : null;
    if (cur) project = cur.project;
    const projects = P().visible().filter((p) => p.status !== 'PLANNING' && p.status !== 'DONE').map((p) => [p.code, `${p.code} — ${p.name}`]);
    const L = lists(), pr = project ? P().byCode(project) : null;
    const r = await window.EFormRun.open({ title: cur ? 'Sửa phiếu bất thường' : 'Thêm mới phiếu bất thường', schema: Object.assign({ id: f.id }, f.schema(Object.assign({ types: catTypes(), sevs: Object.entries(D.sxSev) }, L))), vars: { serialOpts: L.serialOpts },
      values: cur ? Object.fromEntries(Object.entries(ctx(editCode)).filter(([key]) => key.startsWith('bt'))) : Object.assign({ btProject: project || null, btFound: `${dmy(D.sxToday)} ${new Date().toTimeString().slice(0, 5)}`, btQty: null, btCoMau: null }, pr ? { btSpTen: pr.product, btSpMa: pr.product, btKhach: pr.customer || '', btDonVi: pr.factory || '' } : {}),
      check: (v) => {
        const d = fromDmy(String(v.btFound || '').split(' ')[0]);
        if (!d) return 'Ngày xảy ra lỗi phải đúng định dạng DD/MM/YYYY.';
        if (d > D.sxToday) return 'Thời gian xảy ra lỗi không được sau thời điểm hiện tại.';
        if (v.btCoMau != null && v.btCoMau !== '' && v.btQty != null && v.btQty !== '' && Number(v.btQty) > Number(v.btCoMau)) return 'Số lượng ảnh hưởng không được lớn hơn cỡ mẫu kiểm tra.';
        if ((v.btDoiSach || []).some((x) => x.han && !fromDmy(x.han))) return 'Thời hạn của đối sách tức thời phải đúng định dạng DD/MM/YYYY.';
        return null;
      } });
    if (!r || (!r.submit && !r.draft)) return;
    const v = r.values, draft = !!r.draft;
    let code = editCode;
    if (cur) {
      patch(code, Object.assign(fromForm(v), { title: String(v.btTitle || '').trim() || cur.title || 'Phiếu bất thường (nháp)' }, draft ? {} : { draft: false }));
    } else {
      const n = Math.max(0, ...all().map((x) => Number(x.code.slice(-3)))) + 1;
      code = 'BT-2026-' + String(n).padStart(3, '0');
      U.created.unshift(Object.assign({ code }, fromForm(v), { creator: pid() }, draft ? { draft: true, title: String(v.btTitle || '').trim() || 'Phiếu bất thường (nháp)' } : {}));
      persist();
    }
    if (draft) { toast('<b>Thành công</b><br>Lưu nháp thành công!'); location.hash = '#/' + href({ code }); return; }
    const c = F().start('SX-BT', code);
    F().complete(c.code, c.tokens[0].id, -1, v);
    P().log(v.btProject, 'Lập phiếu bất thường', `${code}: ${String(v.btTitle || '').trim()}`);
    toast('<b>Thành công</b><br>' + (cur ? 'Gửi phiếu thành công!' : 'Thêm mới thành công!'));
    location.hash = '#/' + href({ code });
  }

  /* Phiếu do hệ thống lập từ luồng khác (OQC không đạt ở nghiệm thu — S8): người lập = người đang xử lý, bước 1 xong ngay, việc tiếp nhận về PM. Trả về mã phiếu. */
  function createAuto(o) {
    const n = Math.max(0, ...all().map((x) => Number(x.code.slice(-3)))) + 1, code = 'BT-2026-' + String(n).padStart(3, '0');
    U.created.unshift({ code, project: o.project, title: o.title, desc: o.desc || '', found: D.sxToday, place: o.place || '', qty: o.qty == null ? null : o.qty, file: '', creator: pid(), auto: true });
    persist();
    const c = F().start('SX-BT', code);
    F().complete(c.code, c.tokens[0].id, -1, {});
    return code;
  }

  /* ---------- Chi tiết phiếu (cũng là thân màn xử lý việc của SX-BT) ---------- */
  const tabKey = (code) => 'bt:' + code;
  const VER = {};
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  document.addEventListener('change', (e) => { const s = e.target.closest && e.target.closest('[data-sxbt-ver]'); if (s) { VER[s.dataset.sxbtVer] = s.value; rerender(); } });
  function detail(code, opt) {
    const o = opt || {}, k = K(), x = byCode(code);
    if (!x || !visible().some((y) => y.code === code)) return `<div class="pg">${head({ title: o.title || 'Xem chi tiết phiếu bất thường', back: o.back || 'sx/bat-thuong', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy phiếu bất thường hoặc bạn không có quyền xem.')}</div>`;
    const c = caseOf(x), v = Object.assign({}, (c && c.vars) || {}, x.xl || {}), st = stOf(x), l = leftOf(x), ecr = window.SxTd ? window.SxTd.ecrOf(x.code) : null;
    const info = {
      scr: 'SX-08', name: 'Chi tiết phiếu bất thường', uc: 'SX-KS-K1 §3.2, Bảng 6, Bảng 7',
      notes: ['Khuôn task-create (mode detail) + app-tabs; màn xử lý việc của luồng xử lý bất thường dùng chính thân màn này + thanh trạng thái (my-task-detail).',
        'Loại 2 (lỗi thiết kế) ở bước triển khai có ô Đề nghị mở yêu cầu thay đổi kỹ thuật; liên thông sang luồng thay đổi kỹ thuật ở S7.'],
      q: ['P-238', 'P-240', 'P-251'], src: 'task-management/components/task-create (mode detail) · @khcn-core/ui app-tabs',
    };
    const alert = isOver(x) ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Phiếu quá hạn xử lý ${-l} ngày làm việc (hạn ${esc(dmy(x.due))}).</span></div></div>` : '';
    const tInfo = () => k.card('Thông tin phiếu', `<div class="ginfo c3">
        ${k.kv('Mã phiếu', esc(x.code))}${k.kv('Tiêu đề', esc(x.title), 'span2')}
        ${k.kv('Trạng thái', badge(...st))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}${k.kv('Người lập', esc(pName(x.creator)))}
        ${k.kv('Thời gian xảy ra lỗi', esc(dmy(x.found) + (x.foundTime ? ' ' + x.foundTime : '')))}${k.kv('Nơi phát hiện', esc(catN('sx-noi-phat-hien', x.place)))}${k.kv('Công đoạn', x.stage ? esc(catN('sx-cong-doan', x.stage)) : null)}
        ${k.kv('Tên sản phẩm', x.spTen ? esc(x.spTen) : null)}${k.kv('Mã sản phẩm', x.spMa ? esc(x.spMa) : null)}${k.kv('Serial', x.serial ? esc(x.serial) : null)}
        ${k.kv('Khách hàng', x.khachN ? esc(x.khachN) : null)}${k.kv('Đơn vị sản xuất', x.donViN ? esc(x.donViN) : null)}${k.kv('Số hiệu thao tác', x.op ? esc(x.op) : null)}
        ${k.kv('Ca sản xuất', x.shift ? esc(catN('sx-ca-san-xuat', x.shift)) : null)}${k.kv('Cỡ mẫu kiểm tra', x.sample ? esc(String(x.sample)) : null)}${k.kv('Số lượng ảnh hưởng', x.qty != null ? esc(`${x.qty}${x.unit ? ' ' + catN('sx-don-vi-tinh', x.unit).toLowerCase() : ''}`) : null)}
        ${k.kv('Tỷ lệ lỗi', defectPct(x) != null ? esc(String(defectPct(x)).replace('.', ',') + ' %') : null)}${k.kv('Yêu cầu kỹ thuật vi phạm', x.req ? esc(x.req) : null, 'span2')}
        ${k.kv('Quy trình', x.proc ? esc(procName(x.proc)) : null, 'span3')}
        ${k.kv('Mô tả hiện tượng', esc(x.desc || ''), 'span3')}
        ${k.kv('Loại bất thường', x.type ? esc(catRow(x.type).name) : null, 'span2')}${k.kv('Mức độ', x.sev ? esc(D.sxSev[x.sev]) : null)}
        ${k.kv('Đơn vị xử lý', x.unitText ? esc(x.unitText) : null)}${k.kv('Ngày tiếp nhận', x.received ? esc(dmy(x.received)) : null)}
        ${k.kv('Hạn xử lý', x.due ? `${esc(dmy(x.due))} (${x.sla} ngày làm việc)` : x.type && !x.sla ? 'Theo quy trình nhà máy' : x.type && !x.received ? `Tính từ ngày tiếp nhận (${x.sla} ngày làm việc)` : null)}
        ${k.kv('Còn lại', l == null ? null : l < 0 ? `<span class="t-err">Quá hạn ${-l} ngày làm việc</span>` : `${l} ngày làm việc`)}${k.kv('Ngày đóng', x.closed ? esc(dmy(x.closed)) : null)}
        ${k.kv('Số lần kiểm tra không đạt', x.nok ? String(x.nok) : null)}</div>`)
      + k.card('Đối sách tức thời', k.table([['Hành động', 460], ['Người thực hiện', 220], ['Thời hạn', 120]], (x.actions || []).map((a) => [a.hd, pName(a.who), a.han]),
        (r) => `<td>${esc(r[0] || '')}</td><td>${r[1] ? esc(r[1]) : k.dash}</td><td class="num">${r[2] ? esc(dmy(r[2])) : k.dash}</td>`))
      + k.card('Phân tích sơ bộ và xác nhận hiện trường', `<div class="ginfo c3">
        ${k.kv('Nhóm nguyên nhân', causesText(x) ? esc(causesText(x)) : null, 'span3')}${k.kv('Dự đoán sơ bộ nguyên nhân', x.guess ? esc(x.guess) : null, 'span3')}
        ${k.kv('Nhân sự kiểm tra (TT.SX - VHT)', (x.inspect || []).length ? esc((x.inspect || []).map(pName).join(', ')) : null, 'span2')}${k.kv('Nhân sự tham gia (Đối tác SX)', (x.partner || []).length ? esc((x.partner || []).map(pName).join(', ')) : null)}</div>`)
      + k.card('Thông tin xác nhận của hai bên tại hiện trường', k.table([['Bên xác nhận', 260], ['Người xác nhận', 320], ['Ngày xác nhận', 140], ['Trạng thái', 140, 'c'], ['Ý kiến', 400]],
        [['Trung tâm Sản xuất — VHT', (x.inspect || []).map(pName).join(', ')], ['Đối tác sản xuất / Nhà máy', (x.partner || []).map(pName).join(', ')]],
        (r) => `<td>${esc(r[0])}</td><td>${r[1] ? k.clamp(r[1]) : k.dash}</td><td class="num">${r[1] ? esc(dmy(x.found)) : '-'}</td><td class="c">${r[1] ? badge('Đã xác nhận', 'success') : badge('Chưa xác nhận', 'default')}</td><td>${r[1] ? 'Xác nhận hiện tượng, số lượng ảnh hưởng đúng như mô tả tại hiện trường' : k.dash}</td>`))
      + k.card('Ảnh / video lỗi', k.table([['Tệp', 640]], x.media ? [[x.media]] : [], (r) => `<td><a class="link">${esc(r[0])}</a></td>`))
      + k.card('Các tài liệu liên quan', k.table([['Tên tệp', 640]], docsOf(x).map((n) => [n]).concat(v.blFile ? [[v.blFile]] : []),
        (r) => `<td><a class="link">${esc(r[0])}</a></td>`));
    /* ---- Tab Phân tích và xử lý: 4 khối theo BM.QLBT.02 (mockup: dữ liệu suy từ hồ sơ + biến của luồng SX-BT) ---- */
    const allC = F().cases(x.code, 'SX-BT'), evs = allC.flatMap((cc) => cc.hist.map((h) => Object.assign({ cc }, h)));
    const cur = c && c.status !== 'done' && c.tokens[0] ? Number(c.tokens[0].step) : c ? 8 : 0, passed = (n) => cur > n;
    const evAt = (n) => { const h = c && c.hist.slice().reverse().find((y) => y.step === n); return h || null; };
    const parts = (t) => String(t || '').split(/(?<=\.)\s+|;\s*/).map((s) => s.trim()).filter(Boolean);
    const han = v.paHan || (x.due ? dmy(x.due) : '');
    const fix = Array.isArray(v.paKhacPhuc) ? v.paKhacPhuc : parts(v.paBienPhap).map((hd, i) => ({ hd, who: x.handler, han, img: i === 0 && passed(3) ? 'HinhAnh-' + x.code + '-KP01.jpg' : '' }));
    const prevent = Array.isArray(v.paNgan) ? v.paNgan : parts(v.paNgan || v.bhBaiHoc).map((hd) => ({ hd, who: x.pm, han, img: '' }));
    const apprLevel = x.sev && x.sev <= 2 ? 'Ban Giám đốc Khối (Phó Giám đốc Khối)' : 'PM dự án';
    const groups = window.Catalog.rows('sx-nhom-nguyen-nhan'), chosen = x.causes || [];
    const hanTxt = (h) => (h ? (String(h).includes('-') ? dmy(h) : h) : '');
    const actTbl = (rows) => k.table([['Hành động', 460], ['Người thực hiện', 200], ['Thời hạn', 120], ['Hình ảnh mô tả', 240]], rows,
      (r) => `<td>${k.clamp(r.hd)}</td><td>${r.who ? esc(pName(r.who)) : k.dash}</td><td class="num">${r.han ? esc(hanTxt(r.han)) : k.dash}</td><td>${r.img ? `<a class="link">${esc(r.img)}</a>` : k.dash}</td>`);
    const rejected = evs.filter((h) => h.step != null && h.step !== 2 && /Trả lại|Không đạt/.test(h.act));
    const stepName = (n) => { const s = D.sxFlows['SX-BT'].steps.find((y) => y[0] === n); return s ? `${n}. ${s[1]}` : String(n); };
    const b1 = k.card('Xác minh & phân tích nguyên nhân', `<div class="ginfo c3">
        ${k.kv('Trạng thái xác minh của QLSX', passed(2) ? badge('Đã xác minh', 'success') : badge('Chờ xác minh', 'warning'))}${k.kv('Người xác minh', evAt(2) ? esc(pName(evAt(2).who)) : null)}${k.kv('Ngày xác minh', evAt(2) ? esc(dmy(evAt(2).at)) : null)}
        ${k.kv('Loại bất thường (xác nhận lại)', x.type ? esc(typeText(x.type)) : null, 'span2')}${k.kv('Mức độ (xác nhận lại)', x.sev ? esc(D.sxSev[x.sev]) : null)}
        ${k.kv('Phân loại nguyên nhân chính thức (6M + 1, BM.QLBT.02)', (groups.find((g) => chosen.includes(g.code)) || {}).name ? esc(groups.find((g) => chosen.includes(g.code)).name) : null, 'span3')}</div>
      <div class="ginfo c3" style="margin-top:12px">${k.kv('Nội dung phân tích chi tiết', v.blNguyenNhan ? esc(v.blNguyenNhan) : null, 'span3')}${k.kv('File đo kiểm bổ sung', v.blFile ? `<a class="link">${esc(v.blFile)}</a>` : null, 'span3')}</div>`);
    const b2 = k.card('Phương án xử lý', `<div class="ginfo c3">
        ${k.kv('Số phương án xử lý bất thường', fix.length || passed(2) ? esc('PAXL-' + x.code.slice(3) + '-' + String(allC.length).padStart(2, '0')) : null)}${k.kv('Cấp duyệt', esc(apprLevel))}${k.kv('Kết quả phê duyệt', passed(4) ? badge('Đã phê duyệt', 'success') : cur === 4 ? badge('Chờ phê duyệt', 'warning') : null)}</div>
      <h4 class="ginfo-sub">Phương án khắc phục bất thường</h4>${actTbl(fix)}
      <h4 class="ginfo-sub">Hành động ngăn ngừa tái diễn</h4>${actTbl(prevent)}
      <h4 class="ginfo-sub">Lịch sử lý do bị từ chối / đánh giá NOK</h4>
      ${k.table([['Hồ sơ', 200], ['Thời gian', 150], ['Người thực hiện', 200], ['Bước', 260], ['Kết quả', 160], ['Lý do', 460]], rejected, (h) => `<td>${esc(h.cc.code)}</td><td class="num">${esc(dmy(h.at))}</td><td>${esc(pName(h.who))}</td><td>${k.clamp(stepName(h.step))}</td><td>${badge(h.act, 'error')}</td><td>${h.note ? k.clamp(h.note) : k.dash}</td>`)}`);
    const items = fix.map((r) => Object.assign({ kind: 'Khắc phục' }, r)).concat(prevent.map((r) => Object.assign({ kind: 'Ngăn ngừa' }, r)));
    const pct = passed(5) ? 100 : cur === 5 ? 50 : 0, hand = evAt(5);
    const itemPct = (r) => (r.kind === 'Khắc phục' ? pct : passed(7) ? 100 : 0);
    const itemSt = (r) => { const p = itemPct(r); return p >= 100 ? ['Hoàn thành', 'success'] : p ? ['Đang thực hiện', 'info'] : ['Chưa bắt đầu', 'default']; };
    const b3 = k.card('Triển khai & bàn giao tiền xử lý', `${k.table([['Đầu việc', 460], ['Loại', 120], ['Người thực hiện', 200], ['Thời hạn', 120], ['% hoàn thành', 120, 'r'], ['Trạng thái', 150, 'c']], items,
        (r) => `<td>${k.clamp(r.hd)}</td><td>${esc(r.kind)}</td><td>${r.who ? esc(pName(r.who)) : k.dash}</td><td class="num">${r.han ? esc(hanTxt(r.han)) : k.dash}</td><td class="r num">${itemPct(r)}%</td><td class="c">${badge(...itemSt(r))}</td>`)}
      <h4 class="ginfo-sub">Cổng xác nhận bàn giao kết quả tiền xử lý cho đơn vị sản xuất</h4>
      <div class="ginfo c3">${k.kv('Kết quả triển khai', v.tkKetQua ? esc(v.tkKetQua) : null, 'span3')}
        ${k.kv('Trạng thái bàn giao', passed(5) ? badge('Đã bàn giao', 'success') : badge('Chưa bàn giao', 'default'))}${k.kv('Ngày bàn giao', passed(5) && hand ? esc(dmy(hand.at)) : null)}${k.kv('Người bàn giao', passed(5) && hand ? esc(pName(hand.who)) : null)}
        ${k.kv('Đơn vị sản xuất tiếp nhận', x.donViN ? esc(x.donViN) : null)}${k.kv('Biên bản bàn giao', passed(5) ? `<a class="link">${esc('BBBG-TienXuLy-' + x.code + '.pdf')}</a>` : null)}
        ${k.kv('Yêu cầu thay đổi kỹ thuật', ecr ? `<a class="link" data-go="sx/thay-doi/${encodeURIComponent(ecr.code)}">${esc(ecr.code)}</a>` : v.tkEcr ? 'Đề nghị mở' : null)}</div>`);
    const checks = evs.filter((h) => h.step === 6).map((h, i) => { const ok = !/NOK|Không đạt/.test(h.act), tot = x.qty || 0, bad = ok ? 0 : Math.ceil(tot / 4); return { lan: i + 1, at: h.at, who: h.who, form: i % 2 ? 'Trực tiếp trên chuyền' : 'Kiểm tra hồ sơ', good: tot - bad, bad, ok }; });
    if (cur === 6) checks.push({ lan: checks.length + 1, at: null, who: c.tokens[0].who, form: 'Trực tiếp trên chuyền', running: true });
    const tags = [['Mã SP', x.spMa], ['Công đoạn', x.stage ? catN('sx-cong-doan', x.stage) : ''], ['Nhóm nguyên nhân', causesText(x)]].filter((t) => t[1]).map((t) => badge(t[0] + ': ' + t[1], 'default')).join(' ');
    const b4 = k.card('Lịch sử nghiệm thu & bài học kinh nghiệm', `${k.table([['Lần kiểm tra', 110, 'c'], ['Ngày kiểm', 130], ['Người kiểm', 200], ['Hình thức', 190], ['Số lượng đạt / hỏng', 160, 'r'], ['Kết luận', 130, 'c'], ['Biên bản đo kiểm', 300]], checks,
        (r) => `<td class="c">Lần ${r.lan}</td><td class="num">${r.at ? esc(dmy(r.at)) : k.dash}</td><td>${esc(pName(r.who))}</td><td>${esc(r.form)}</td><td class="r num">${r.running ? '-' : `${num(r.good)} / ${num(r.bad)}`}</td><td class="c">${r.running ? badge('Đang kiểm tra', 'info') : r.ok ? badge('OK', 'success') : badge('NOK', 'error')}</td><td>${r.running ? k.dash : `<a class="link">${esc('BBDK-' + x.code + '-L' + r.lan + '.pdf')}</a>`}</td>`)}
      <h4 class="ginfo-sub">Bài học kinh nghiệm</h4>
      <div class="ginfo c3">${k.kv('Nội dung bài học', v.bhBaiHoc ? esc(v.bhBaiHoc) : null, 'span3')}${k.kv('Thẻ (Tag)', v.bhBaiHoc && tags ? tags : null, 'span3')}</div>`);
    const canXl = st[0] === 'Đang xử lý' && !x.closed && !x.draft;
    const tXl = () => `<div data-sxbt-xl style="display:flex;flex-direction:column;gap:20px">${canXl ? `<div class="row" style="justify-content:flex-end"><button type="button" class="vbtn primary" data-sxbt-xl-edit="${esc(x.code)}">${icon('edit')} Chỉnh sửa</button></div>` : ''}${b1}${b2}${b3}${b4}</div>`;
    /* Tab Tiến trình: tách Hạn xử lý (SLA) / Hoàn thành thực tế; chọn phiên bản hồ sơ (HSBT-…-01, -02) để xem lại vòng trước khi phiếu bị NOK. */
    const tTt = () => {
      if (!allC.length) return k.card('Tiến trình', '<p class="faint">Chưa có hồ sơ.</p>');
      const sel = allC.find((y) => y.code === VER[x.code]) || allC[allC.length - 1], pr = F().progress(sel, '', true);
      const bar = `<div class="row" style="gap:12px;align-items:center;margin-bottom:12px"><label class="cap" for="sxbt-ver">Phiên bản hồ sơ</label>
        <select class="vctl" id="sxbt-ver" data-sxbt-ver="${esc(x.code)}" style="width:340px">${allC.map((y) => `<option value="${esc(y.code)}" ${y.code === sel.code ? 'selected' : ''}>${esc(y.code)}${y === allC[allC.length - 1] ? ' (hiện hành)' : ' (vòng trước)'}</option>`).join('')}</select>
        ${allC.length > 1 ? '<span class="cap">Phiếu từng bị đánh giá NOK: chọn vòng để xem lại tiến trình và người xử lý.</span>' : ''}</div>`;
      return bar + k.card('Hồ sơ xử lý bất thường', pr.top + pr.steps) + k.card('Lịch sử xử lý', pr.hist);
    };
    return `<div class="pg" data-sxbt-detail="${esc(x.code)}">
      ${head({ title: o.title || 'Xem chi tiết phiếu bất thường', back: o.back || 'sx/bat-thuong', lg: true, info, right: x.draft && !o.task ? `<button type="button" class="vbtn secondary" data-sxbt-del="${esc(x.code)}">${icon('del')} Xóa</button><button type="button" class="vbtn primary" data-sxbt-edit="${esc(x.code)}">${icon('edit')} Sửa</button>` : o.task || !window.SxTd ? '' : window.SxTd.issueBtn(x) })}
      ${o.bar || ''}${alert}
      ${k.tabs(tabKey(x.code), [['info', 'Thông tin phiếu'], ['xl', 'Phân tích và xử lý'], ['tt', 'Tiến trình']], { info: tInfo, xl: tXl, tt: tTt })}</div>`;
  }
  /* Chỉnh sửa tab Phân tích và xử lý (chỉ khi phiếu Đang xử lý): ghi đè nội dung hồ sơ trên phiếu. */
  async function xlDlg(code) {
    const x = byCode(code), c = caseOf(x), v = Object.assign({}, (c && c.vars) || {}, x.xl || {}), { txt, ta, tf, file } = window.EForms.b, L = (n) => ({ layout: { columns: n } });
    const r = await window.EFormRun.open({ title: 'Chỉnh sửa phân tích và xử lý', schema: { id: 'sx-bt-xl-sua', components: [
      txt(`Phiếu **${x.code}** — ${x.title}. Cập nhật nội dung phân tích, phương án xử lý và kết quả triển khai khi phiếu đang xử lý.`),
      ta('blNguyenNhan', 'Nội dung phân tích nguyên nhân chi tiết', { rows: 3 }), file('blFile', 'File đo kiểm bổ sung', L(16)),
      ta('paBienPhap', 'Phương án khắc phục bất thường (mỗi ý kết thúc bằng dấu chấm)', { rows: 3 }), ta('paNgan', 'Hành động ngăn ngừa tái diễn', { rows: 2 }),
      tf('paHan', 'Thời hạn hoàn thành dự kiến (DD/MM/YYYY)', L(8)), ta('tkKetQua', 'Kết quả triển khai', { rows: 2 })] },
    values: { blNguyenNhan: v.blNguyenNhan || '', blFile: v.blFile || '', paBienPhap: v.paBienPhap || '', paNgan: v.paNgan && !Array.isArray(v.paNgan) ? v.paNgan : v.bhBaiHoc || '', paHan: v.paHan || '', tkKetQua: v.tkKetQua || '' },
    check: (val) => (val.paHan && !fromDmy(val.paHan) ? 'Thời hạn phải đúng định dạng DD/MM/YYYY.' : null) });
    if (!r || !r.submit) return;
    patch(code, { xl: Object.assign({}, x.xl, r.values) });
    P().log(x.project, 'Chỉnh sửa phân tích và xử lý phiếu bất thường', x.code);
    toast('<b>Thành công</b><br>Cập nhật thành công!'); rerender();
  }
  document.addEventListener('click', async (e) => {
    const t = e.target.closest && e.target.closest('[data-sxbt-xl-edit],[data-sxbt-edit],[data-sxbt-del]');
    if (!t) return;
    e.preventDefault();
    if (t.dataset.sxbtXlEdit) { xlDlg(t.dataset.sxbtXlEdit); return; }
    if (t.dataset.sxbtEdit) { create(null, t.dataset.sxbtEdit); return; }
    const x = byCode(t.dataset.sxbtDel);
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa phiếu bất thường: ${x.code} — ${x.title} không?`, hl: `${x.code} — ${x.title}`, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    if (U.created.some((y) => y.code === x.code)) U.created = U.created.filter((y) => y.code !== x.code); else U.edit[x.code] = Object.assign({}, U.edit[x.code], { deleted: true });
    persist(); P().log(x.project, 'Xoá phiếu bất thường nháp', x.code);
    toast('<b>Thành công</b><br>Xoá phiếu bất thường thành công'); location.hash = '#/sx/bat-thuong';
  }, true);
  /* Ngữ cảnh eForm. */
  function ctx(code) {
    const x = byCode(code);
    return Object.assign(lists(), { phieu: { code: x.code, title: x.title, project: x.project, type: x.type, typeText: x.type ? typeText(x.type) : 'Chưa phân loại', sevText: x.sev ? D.sxSev[x.sev] : 'Chưa đánh giá mức độ', handlerText: x.unitText || '' },
      types: window.Catalog.rows('sx-bat-thuong').filter((r) => r.active !== false).map((r) => [r.code, r.name]), sevs: Object.entries(D.sxSev).map(([a, b]) => [a, b]),
      projects: P().visible().filter((p) => p.status !== 'PLANNING' && p.status !== 'DONE').map((p) => [p.code, `${p.code} — ${p.name}`]),
      /* T74 Q10: phiếu bị trả lại → bước 1 mở form lap điền sẵn thông tin phiếu hiện tại. */
      btProject: x.project, btQuyTrinh: x.proc || null, btTitle: x.title, btLoai: x.type || null, btMucDo: x.sev ? String(x.sev) : null, btDesc: x.desc || '', btFound: dmy(x.found) + ' ' + (x.foundTime || '00:00'), btPlace: x.place || '',
      btQty: x.qty, btGuess: x.guess || '', btFiles: docsOf(x).join(', '),
      btSpTen: spOf(x, P().byCode(x.project)), btSpMa: spOf(x, P().byCode(x.project)), btKhach: x.khachN || '', btDonVi: x.donViC || '', btSerial: x.serial || '', btCoMau: x.sample == null ? null : x.sample,
      btFoundTime: x.foundTime || '', btCongDoan: x.stage || null, btThaoTac: x.op || '', btCa: x.shift || null, btYeuCau: x.req || '', btQtyDvt: x.unit || null,
      btDoiSach: (x.actions || []).map((a) => ({ hanhDong: a.hd, nguoi: a.who, han: dmy(a.han) })), btNhomNN: x.causes || [], btKiemTra: x.inspect || [], btThamGia: x.partner || [], btFileMedia: x.media || '' });
  }

  /* ---------- Tab của dự án ---------- */
  function projectTab(p) {
    const k = K(), l = all().filter((x) => x.project === p.code).map((x) => Object.assign(x, { st: stOf(x) }));
    const can = canCreate() && p.status !== 'PLANNING' && p.status !== 'DONE';
    return `<div data-sx-bt><section class="vcard pad24"><div class="vcard-h"><h3>Phiếu bất thường</h3>${can ? `<button type="button" class="vbtn secondary" data-sxbt-new="${esc(p.code)}">${icon('add')} Thêm mới phiếu</button>` : ''}</div>
      ${k.table([['Phiếu bất thường', 380], ['Loại', 90], ['Mức độ', 140], ['Trạng thái', 160, 'c'], ['Hạn xử lý', 120], ['Còn lại', 110, 'r']], l,
    (x) => `<td>${NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết phiếu bất thường' })}</td><td>${x.type ? esc(typeText(x.type)) : k.dash}</td><td>${x.sev ? esc(D.sxSev[x.sev]) : k.dash}</td>
      <td class="c">${badge(...x.st)}</td><td class="num${isOver(x) ? ' due-over' : ''}">${x.due ? esc(dmy(x.due)) : k.dash}</td><td class="r">${leftCell(x, k)}</td>`)}
</section>${window.SxTd ? window.SxTd.projectPart(p) : ''}</div>`;
  }

  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-sxbt-new]'); if (b) create(b.dataset.sxbtNew || null); });
  function route(parts) { return parts[1] ? detail(decodeURIComponent(parts[1])) : list(); }
  function enter(parts) { if (parts[0] === 'bat-thuong' && parts[1]) K().setTab(tabKey(decodeURIComponent(parts[1])), ['info', 'xl', 'tt'].includes(parts[2]) ? parts[2] : 'info'); }
  function reset() { U = blank(); persist(); }

  window.SxBt = { route, enter, reset, all, byCode, detail, ctx, createAuto, create, tabKey, viewTitle: 'Xem chi tiết phiếu bất thường', classText, stOf, isOver, ST_LIST, leftOf, addWd, wdBetween, projectTab };
})();
