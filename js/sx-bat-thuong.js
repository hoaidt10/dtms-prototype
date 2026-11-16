/* Phân hệ Quản lý sản xuất — Bất thường sản xuất (T71 S6, D-121). SX-08: danh sách phiếu (hạn xử lý theo SLA, quá hạn), Thêm mới (BM.QLBT.01), chi tiết; luồng SX-BT trên sx-flow.js.
   Bước 2 phân loại theo danh mục "Loại bất thường và SLA" (SX-13): loại quyết định đơn vị triển khai ở bước 5 (QLSX → PM dự án, R&D → kỹ sư thiết kế, Nhà máy → nhà máy),
   mức độ quyết định số ngày làm việc; hạn = ngày tiếp nhận + số ngày làm việc (bỏ thứ Bảy, Chủ nhật — GIẢ LẬP P-251). Loại 3 theo quy trình nhà máy, không có hạn (P-240).
   Kiểm tra Không đạt (NOK) quay lại bước 3 (cấu hình choices). Route: #/sx/bat-thuong, #/sx/bat-thuong/<mã>. Lưu localStorage sx-proto-bt. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
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
  function decorate(x) {
    const p = P().byCode(x.project), sla = slaOf(x), due = sla && x.received ? addWd(x.received, sla) : null;
    const r = catRow(x.type);
    return Object.assign({}, x, { pm: p ? p.pm : null, handler: handlerOf(x, p), sla, due, unitText: r ? UNIT_TEXT[r.unit] : '', projectName: p ? p.name : '' });
  }
  const all = () => U.created.concat(D.sxIssues).map((x) => decorate(Object.assign({}, x, U.edit[x.code] || {})));
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const caseOf = (x) => { const l = F().cases(x.code, 'SX-BT'); return l[l.length - 1] || null; };
  /* Trạng thái: Chờ tiếp nhận (chưa phân loại) / Đang xử lý / Quá hạn / Đã đóng. Còn lại: số ngày làm việc tới hạn (âm = quá hạn). */
  function stOf(x) {
    if (x.closed) return x.due && x.closed > x.due ? ['Đã đóng (trễ hạn)', 'warning'] : ['Đã đóng', 'success'];
    if (!x.type) return ['Chờ tiếp nhận', 'default'];
    if (x.due && D.sxToday > x.due) return ['Quá hạn', 'error'];
    return ['Đang xử lý', 'info'];
  }
  const leftOf = (x) => (x.due && !x.closed ? wdBetween(D.sxToday, x.due) : null);
  const stepOf = (x) => { const c = caseOf(x); if (!c || c.status === 'done') return ''; const st = D.sxFlows['SX-BT'].steps.find((s) => String(s[0]) === String((c.tokens[0] || {}).step)); return st ? `${st[0]}. ${st[1]}` : ''; };
  const whoOf = (x) => { const c = caseOf(x); return c && c.tokens[0] ? pName(c.tokens[0].who) : ''; };
  const projIds = () => new Set(P().visible().map((p) => p.code));
  const involved = (x) => F().cases(x.code).some((c) => c.tokens.some((t) => t.who === pid()) || c.hist.some((h) => h.who === pid()));
  const visible = () => { const ids = projIds(); return all().filter((x) => ids.has(x.project) || involved(x)); };
  const canCreate = () => isAdmin() || ['R-SX-QA', 'R-SX-PM', 'R-SX-SUBPM', 'R-SX-NM'].includes(D.roleOf(pid()));

  /* ---------- Bộ xử lý hành động của SX-BT ---------- */
  const patch = (code, data) => { const own = U.created.find((x) => x.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign({}, U.edit[code], data); persist(); };
  Object.assign(F().ACT, {
    'bt.start': () => {},
    /* Bước 2: phân loại, mức độ → ngày tiếp nhận, hạn xử lý (SLA), đơn vị triển khai. */
    'bt.classify': (c, ch, x) => { const v = x.values || {}; patch(c.obj, { type: v.blLoai, sev: Number(v.blMucDo), received: D.sxToday }); const it = byCode(c.obj); P().log(it.project, 'Tiếp nhận phiếu bất thường', `${it.code}: ${classText(it.type, it.sev)}`); },
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
        'Loại và mức độ phân ở bước 2 theo danh mục <b>Loại bất thường và SLA</b>: loại quyết định đơn vị triển khai (Loại 1 QLSX, Loại 2 R&D, Loại 3 Nhà máy), mức độ quyết định số ngày làm việc. Hạn = ngày tiếp nhận + số ngày làm việc (bỏ thứ Bảy, Chủ nhật; chưa tính ngày lễ — GIẢ LẬP P-251). Loại 3 theo quy trình nhà máy, không có hạn (P-240).',
        'Cột Còn lại: số ngày làm việc tới hạn; quá hạn tô đỏ. Kiểm tra Không đạt quay lại bước đề xuất phương án.',
      ],
      q: ['P-238', 'P-240', 'P-251'], src: 'task-management/task-management.component · /task-management',
    };
    const ST = ['Chờ tiếp nhận', 'Đang xử lý', 'Quá hạn', 'Đã đóng', 'Đã đóng (trễ hạn)'];
    return k.listPage({
      id: 'sxbt', exp: 'Danh sach phieu bat thuong', title: 'Danh sách phiếu bất thường', ph: 'Tìm kiếm theo mã, tiêu đề, dự án', info,
      right: canCreate() ? `<button class="vbtn primary" data-sxbt-new>${icon('add')} Thêm mới</button>` : '',
      rows: () => visible().map((x) => Object.assign(x, { st: stOf(x), step: stepOf(x), who: whoOf(x) })).sort((a, b) => (a.code < b.code ? 1 : -1)),
      kwText: (x) => `${x.code} ${x.title} ${x.project}`,
      empty: () => ({ code: '', title: '', project: null, type: null, sev: null, st: [] }),
      match: (x, f) => k.has(f.code, x.code) && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.type || x.type === f.type) && (!f.sev || String(x.sev) === String(f.sev)) && k.inSet(f.st, x.st[0]),
      adv: (txt, sel) => `${txt('code', 'Mã phiếu')}${txt('title', 'Tiêu đề')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('type', 'Loại bất thường', { options: k.catOpts('sx-bat-thuong') })}
        ${sel('sev', 'Mức độ', { searchable: false, options: Object.entries(D.sxSev).map(([value, label]) => ({ value, label })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ST.map((x) => ({ value: x, label: x })) })}`,
      cols: [['Trạng thái', 160, 'c'], ['Mã phiếu', 120], ['Tiêu đề', 280], ['Dự án', 140], ['Loại', 90], ['Mức độ', 140], ['Đơn vị xử lý', 190], ['Bước hiện tại', 240], ['Người đang xử lý', 170], ['Ngày tiếp nhận', 120], ['Hạn xử lý', 120], ['Còn lại', 110, 'r']],
      href,
      cell: (x) => `<td class="c">${badge(...x.st)}</td><td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${k.clamp(x.title)}</td><td>${esc(x.project)}</td>
        <td>${x.type ? esc(typeText(x.type)) : k.dash}</td><td>${x.sev ? esc(D.sxSev[x.sev]) : k.dash}</td><td>${x.unitText ? k.clamp(x.unitText) : k.dash}</td>
        <td>${x.step ? k.clamp(x.step) : k.dash}</td><td>${x.who ? k.clamp(x.who) : k.dash}</td><td class="num">${x.received ? esc(dmy(x.received)) : k.dash}</td>
        <td class="num${x.st[0] === 'Quá hạn' ? ' due-over' : ''}">${x.due ? esc(dmy(x.due)) : x.type && !x.sla ? 'Theo nhà máy' : k.dash}</td><td class="r">${leftCell(x, k)}</td>`,
    });
  }

  /* ---------- Thêm mới phiếu (BM.QLBT.01) = bước 1 của luồng ---------- */
  async function create(project) {
    const f = window.EForms.sx['SX-BT'].lap;
    const projects = P().visible().filter((p) => p.status !== 'PLANNING' && p.status !== 'DONE').map((p) => [p.code, `${p.code} — ${p.name}`]);
    const r = await window.EFormRun.open({ title: 'Thêm mới phiếu bất thường', schema: Object.assign({ id: f.id }, f.schema({ projects })), values: { btProject: project || null, btFound: dmy(D.sxToday), btQty: null },
      check: (v) => { const d = fromDmy(v.btFound); if (!d) return 'Ngày phát hiện phải đúng định dạng DD/MM/YYYY.'; if (d > D.sxToday) return 'Ngày phát hiện không được sau ngày hiện tại.'; return null; } });
    if (!r || !r.submit) return;
    const v = r.values, n = Math.max(0, ...all().map((x) => Number(x.code.slice(-3)))) + 1, code = 'BT-2026-' + String(n).padStart(3, '0');
    U.created.unshift({ code, project: v.btProject, title: v.btTitle.trim(), desc: v.btDesc.trim(), found: fromDmy(v.btFound), place: v.btPlace.trim(), qty: v.btQty == null ? null : Number(v.btQty), file: v.btFile || '', creator: pid() });
    persist();
    const c = F().start('SX-BT', code);
    F().complete(c.code, c.tokens[0].id, -1, v);
    P().log(v.btProject, 'Lập phiếu bất thường', `${code}: ${v.btTitle.trim()}`);
    toast('<b>Thành công</b><br>Thêm mới thành công!');
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
  function detail(code, opt) {
    const o = opt || {}, k = K(), x = byCode(code);
    if (!x || !visible().some((y) => y.code === code)) return `<div class="pg">${head({ title: o.title || 'Xem chi tiết phiếu bất thường', back: o.back || 'sx/bat-thuong', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy phiếu bất thường hoặc bạn không có quyền xem.')}</div>`;
    const c = caseOf(x), v = (c && c.vars) || {}, st = stOf(x), l = leftOf(x), ecr = window.SxTd ? window.SxTd.ecrOf(x.code) : null;
    const info = {
      scr: 'SX-08', name: 'Chi tiết phiếu bất thường', uc: 'SX-KS-K1 §3.2, Bảng 6, Bảng 7',
      notes: ['Khuôn task-create (mode detail) + app-tabs; màn xử lý việc của luồng xử lý bất thường dùng chính thân màn này + thanh trạng thái (my-task-detail).',
        'Loại 2 (lỗi thiết kế) ở bước triển khai có ô Đề nghị mở yêu cầu thay đổi kỹ thuật; liên thông sang luồng thay đổi kỹ thuật ở S7.'],
      q: ['P-238', 'P-240', 'P-251'], src: 'task-management/components/task-create (mode detail) · @khcn-core/ui app-tabs',
    };
    const alert = st[0] === 'Quá hạn' ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Phiếu quá hạn xử lý ${-l} ngày làm việc (hạn ${esc(dmy(x.due))}).</span></div></div>` : '';
    const tInfo = () => k.card('Thông tin phiếu', `<div class="ginfo c3">
        ${k.kv('Mã phiếu', esc(x.code))}${k.kv('Tiêu đề', esc(x.title), 'span2')}
        ${k.kv('Trạng thái', badge(...st))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}${k.kv('Người lập', esc(pName(x.creator)))}
        ${k.kv('Ngày phát hiện', esc(dmy(x.found)))}${k.kv('Nơi phát hiện', esc(x.place || ''))}${k.kv('Số lượng ảnh hưởng', x.qty != null ? esc(String(x.qty)) : null)}
        ${k.kv('Mô tả hiện tượng', esc(x.desc || ''), 'span3')}
        ${k.kv('Loại bất thường', x.type ? esc(catRow(x.type).name) : null, 'span2')}${k.kv('Mức độ', x.sev ? esc(D.sxSev[x.sev]) : null)}
        ${k.kv('Đơn vị xử lý', x.unitText ? esc(x.unitText) : null)}${k.kv('Ngày tiếp nhận', x.received ? esc(dmy(x.received)) : null)}
        ${k.kv('Hạn xử lý', x.due ? `${esc(dmy(x.due))} (${x.sla} ngày làm việc)` : x.type ? 'Theo quy trình nhà máy' : null)}
        ${k.kv('Còn lại', l == null ? null : l < 0 ? `<span class="t-err">Quá hạn ${-l} ngày làm việc</span>` : `${l} ngày làm việc`)}${k.kv('Ngày đóng', x.closed ? esc(dmy(x.closed)) : null)}
        ${k.kv('Số lần kiểm tra không đạt', x.nok ? String(x.nok) : null)}</div>`);
    const tXl = () => `<div data-sxbt-xl>${k.card('Phân tích và xử lý', `<div class="ginfo c3">
        ${k.kv('Nguyên nhân', v.blNguyenNhan ? esc(v.blNguyenNhan) : null, 'span3')}${k.kv('Biện pháp xử lý (BM.QLBT.02)', v.paBienPhap ? esc(v.paBienPhap) : null, 'span2')}${k.kv('Hạn hoàn thành dự kiến', v.paHan ? esc(v.paHan) : null)}
        ${k.kv('Kết quả triển khai', v.tkKetQua ? esc(v.tkKetQua) : null, 'span2')}${k.kv('Yêu cầu thay đổi kỹ thuật', ecr ? `<a class="link" data-go="sx/thay-doi/${encodeURIComponent(ecr.code)}">${esc(ecr.code)}</a>` : v.tkEcr ? 'Đề nghị mở' : null)}
        ${k.kv('Kiểm tra kết quả', v.ktKetQua ? esc(v.ktKetQua) : null, 'span3')}${k.kv('Bài học kinh nghiệm', v.bhBaiHoc ? esc(v.bhBaiHoc) : null, 'span3')}</div>`)}</div>`;
    const tTt = () => { if (!c) return k.card('Tiến trình', '<p class="faint">Chưa có hồ sơ.</p>'); const pr = F().progress(c); return k.card('Hồ sơ xử lý bất thường', pr.top + pr.steps) + k.card('Lịch sử xử lý', pr.hist); };
    return `<div class="pg" data-sxbt-detail="${esc(x.code)}">
      ${head({ title: o.title || 'Xem chi tiết phiếu bất thường', back: o.back || 'sx/bat-thuong', lg: true, info, right: o.task || !window.SxTd ? '' : window.SxTd.issueBtn(x) })}
      ${o.bar || ''}${alert}
      ${k.tabs(tabKey(x.code), [['info', 'Thông tin phiếu'], ['xl', 'Phân tích và xử lý'], ['tt', 'Tiến trình']], { info: tInfo, xl: tXl, tt: tTt })}</div>`;
  }
  /* Ngữ cảnh eForm. */
  function ctx(code) {
    const x = byCode(code);
    return { phieu: { code: x.code, title: x.title, project: x.project, type: x.type, typeText: x.type ? typeText(x.type) : 'Chưa phân loại', sevText: x.sev ? D.sxSev[x.sev] : 'Chưa đánh giá mức độ', handlerText: x.unitText || '' },
      types: window.Catalog.rows('sx-bat-thuong').filter((r) => r.active !== false).map((r) => [r.code, r.name]), sevs: Object.entries(D.sxSev).map(([a, b]) => [a, b]) };
  }

  /* ---------- Tab của dự án ---------- */
  function projectTab(p) {
    const k = K(), l = all().filter((x) => x.project === p.code).map((x) => Object.assign(x, { st: stOf(x) }));
    const can = canCreate() && p.status !== 'PLANNING' && p.status !== 'DONE';
    return `<div data-sx-bt><section class="vcard pad24"><div class="vcard-h"><h3>Phiếu bất thường</h3>${can ? `<button type="button" class="vbtn secondary" data-sxbt-new="${esc(p.code)}">${icon('add')} Thêm mới phiếu</button>` : ''}</div>
      ${k.table([['Mã phiếu', 120], ['Tiêu đề', 320], ['Loại', 90], ['Mức độ', 140], ['Trạng thái', 160, 'c'], ['Hạn xử lý', 120], ['Còn lại', 110, 'r']], l,
    (x) => `<td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${k.clamp(x.title)}</td><td>${x.type ? esc(typeText(x.type)) : k.dash}</td><td>${x.sev ? esc(D.sxSev[x.sev]) : k.dash}</td>
      <td class="c">${badge(...x.st)}</td><td class="num${x.st[0] === 'Quá hạn' ? ' due-over' : ''}">${x.due ? esc(dmy(x.due)) : k.dash}</td><td class="r">${leftCell(x, k)}</td>`)}
</section>${window.SxTd ? window.SxTd.projectPart(p) : ''}</div>`;
  }

  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-sxbt-new]'); if (b) create(b.dataset.sxbtNew || null); });
  function route(parts) { return parts[1] ? detail(decodeURIComponent(parts[1])) : list(); }
  function enter(parts) { if (parts[0] === 'bat-thuong' && parts[1]) K().setTab(tabKey(decodeURIComponent(parts[1])), 'info'); }
  function reset() { U = blank(); persist(); }

  window.SxBt = { route, enter, reset, all, byCode, detail, ctx, createAuto, tabKey, viewTitle: 'Xem chi tiết phiếu bất thường', classText, stOf, leftOf, addWd, wdBetween, projectTab };
})();
