/* Phân hệ Quản lý sản xuất — Thay đổi kỹ thuật (T71 S7, D-121). SX-09: danh sách yêu cầu thay đổi (ECR), Thêm mới (SXL.07; mở được từ phiếu bất thường Loại 2), chi tiết; luồng SX-TD trên sx-flow.js.
   Bước 3 chọn phạm vi thay đổi theo danh mục "Cấp phê duyệt thay đổi kỹ thuật" (SX-13) → bước 4 giao người phê duyệt của cấp (D.sxLevelWho — GIẢ LẬP P-252).
   Bước 5 / 8 (service task) cấp mã ECO / ECN và ghi Nhật ký quản lý dự án (SXL.10); ECN cập nhật phiên bản của dự án. Route: #/sx/thay-doi, #/sx/thay-doi/<mã>. Lưu localStorage sx-proto-td. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const head = (o) => window.Screens.head(o);
  const F = () => window.SxFlow;
  const P = () => window.SxDuAn;
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };

  /* ---------- Lưu ---------- */
  const KEY = 'sx-proto-td';
  const blank = () => ({ created: [], edit: {}, log: {} });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const levelRow = (c) => window.Catalog.rows('sx-cap-duyet').find((r) => r.code === c) || null;
  const decorate = (x) => { const p = P().byCode(x.project); return Object.assign({}, x, { pm: p ? p.pm : null, approver: x.level ? D.sxLevelWho(x.level, p) : null, product: p ? p.product : '', version: p ? p.version : '' }); };
  const all = () => U.created.concat(D.sxChanges).map((x) => decorate(Object.assign({}, x, U.edit[x.code] || {})));
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const caseOf = (x) => { const l = F().cases(x.code, 'SX-TD'); return l[l.length - 1] || null; };
  const patch = (code, data) => { const own = U.created.find((x) => x.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign({}, U.edit[code], data); persist(); };
  const nextNo = (prefix) => { const n = Math.max(0, ...all().map((x) => x[prefix === 'ECO' ? 'eco' : prefix === 'ECN' ? 'ecn' : 'code']).filter(Boolean).map((c) => Number(c.slice(-3)))) + 1; return `${prefix}-2026-${String(n).padStart(3, '0')}`; };
  const logOf = (project) => (D.sxPmLog[project] || []).concat(U.log[project] || []);
  const addLog = (project, row) => { (U.log[project] = U.log[project] || []).push(row); persist(); };
  function stOf(x) {
    if (x.closed) return ['Hoàn thành', 'success'];
    if (x.ecn) return ['Đã ban hành ECN', 'info'];
    if (x.eco) return ['Đã phê duyệt ECO', 'info'];
    return ['Đang xử lý', 'warning'];
  }
  const stepOf = (x) => { const c = caseOf(x); if (!c || c.status === 'done') return ''; const st = D.sxFlows['SX-TD'].steps.find((s) => String(s[0]) === String((c.tokens[0] || {}).step)); return st ? `${st[0]}. ${st[1]}` : ''; };
  const whoOf = (x) => { const c = caseOf(x); return c && c.tokens[0] ? pName(c.tokens[0].who) : ''; };
  const involved = (x) => F().cases(x.code).some((c) => c.tokens.some((t) => t.who === pid()) || c.hist.some((h) => h.who === pid()));
  const visible = () => { const ids = new Set(P().visible().map((p) => p.code)); return all().filter((x) => ids.has(x.project) || involved(x)); };
  const canCreate = () => isAdmin() || ['R-SX-PM', 'R-SX-RD'].includes(D.roleOf(pid()));

  /* ---------- Bộ xử lý hành động của SX-TD ---------- */
  Object.assign(F().ACT, {
    'td.start': () => {},
    'td.level': (c, ch, x) => patch(c.obj, { level: (x.values || {}).ecoCap }),
    /* Bước 5: cấp mã ECO, ghi Nhật ký quản lý dự án. */
    'td.eco': (c) => { const it = byCode(c.obj), code = nextNo('ECO'); patch(c.obj, { eco: code, ecoDate: D.sxToday }); addLog(it.project, [D.sxToday, 'ECO', code, c.vars.ecoNoiDung || '', '', it.code]); P().log(it.project, 'Phê duyệt lệnh thay đổi kỹ thuật', `${code} (${it.code})`); },
    /* Bước 8: cấp mã ECN, ghi nhật ký với phiên bản tài liệu; dự án chuyển sang phiên bản mới. */
    'td.ecn': (c) => { const it = byCode(c.obj), code = nextNo('ECN'), ver = c.vars.ecoPhienBan || ''; patch(c.obj, { ecn: code, ecnDate: D.sxToday }); addLog(it.project, [D.sxToday, 'ECN', code, c.vars.ecnNoiDung || '', ver, it.code]);
      P().patch(it.project, ver ? { version: ver } : {}, 'Ban hành thông báo thay đổi kỹ thuật', `${code}${ver ? ` — phiên bản ${ver}` : ''}`);
      /* T71 S12 (P-257): ECR nhận từ KHCN → đồng bộ ngược ECN (mã, ngày ban hành, phiên bản) về hệ thống KHCN qua API tích hợp — GIẢ LẬP. */
      if (it.src === 'KHCN') { patch(c.obj, { khcnSync: D.sxToday }); c.hist.push({ step: null, who: null, act: 'Đồng bộ ECN về hệ thống KHCN', note: `${code} → ${it.khcn}`, at: `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}` }); } },
    'td.close': (c) => { const it = byCode(c.obj); patch(c.obj, { closed: D.sxToday }); P().log(it.project, 'Bàn giao thay đổi kỹ thuật cho nhà máy', it.code); },
  });

  /* Nguồn yêu cầu thay đổi: lập trong phân hệ hoặc nhận từ hệ thống KHCN (T71 S12). */
  const SRC = { SX: 'Phân hệ sản xuất', KHCN: 'Hệ thống KHCN' };
  const srcText = (x) => (x.src === 'KHCN' ? `${SRC.KHCN} · ${x.khcn}` : SRC.SX);
  /* ---------- SX-09 Danh sách ---------- */
  const href = (x) => 'sx/thay-doi/' + encodeURIComponent(x.code);
  function list() {
    const k = K();
    const info = {
      scr: 'SX-09', name: 'Danh sách yêu cầu thay đổi kỹ thuật', uc: 'SX-KS-K1 §3.3 (QT.VHT.TTSX.4A.1.3), Bảng 8',
      notes: [
        '<b>Dữ liệu đồng bộ từ phân hệ KHCN</b>: danh sách chỉ xem, không có Thêm mới ở phân hệ Quản lý sản xuất.',
        'Yêu cầu thay đổi kỹ thuật (ECR) là đối tượng cha của hồ sơ luồng thay đổi kỹ thuật (9 bước nháp — GIẢ LẬP P-238). Thêm mới = lập ECR (bước 1); mở từ phiếu bất thường Loại 2 thì ghi phiếu nguồn.',
        '<b>Nguồn</b> (T71 S12, P-257): Phân hệ sản xuất (lập tay / từ phiếu bất thường Loại 2) hoặc <b>Hệ thống KHCN</b> — yêu cầu thay đổi từ đề tài nghiên cứu cải tiến nhận qua API tích hợp, hệ thống ghi bước 1 và giao R&D phân tích; ECN ban hành (bước 8) được đồng bộ ngược về KHCN (GIẢ LẬP).',
        'Bước 3 chọn <b>phạm vi thay đổi</b> theo danh mục Cấp phê duyệt thay đổi kỹ thuật → người phê duyệt bước 4 theo cấp (C1 PM dự án, C2 Giám đốc TT Nghiên cứu thiết kế, C3 Ban Giám đốc Khối, C4 Ban Tổng Giám đốc — GIẢ LẬP P-252). Bước 5 / 8 hệ thống cấp mã ECO / ECN và ghi Nhật ký quản lý dự án (SXL.10).',
      ],
      q: ['P-238', 'P-252', 'P-257'], src: 'task-management/task-management.component · /task-management',
    };
    return k.listPage({
      id: 'sxtd', exp: 'Danh sach yeu cau thay doi ky thuat', title: 'Danh sách yêu cầu thay đổi kỹ thuật', ph: 'Tìm kiếm theo mã, tên, dự án', info,
      right: '', /* Bỏ Thêm mới: yêu cầu thay đổi kỹ thuật đồng bộ từ phân hệ KHCN */
      rows: () => visible().map((x) => Object.assign(x, { st: stOf(x), step: stepOf(x), who: whoOf(x) })).sort((a, b) => (a.code < b.code ? 1 : -1)),
      kwText: (x) => `${x.code} ${x.title} ${x.project} ${x.eco || ''} ${x.ecn || ''}`,
      empty: () => ({ code: '', title: '', project: null, level: null, src: null }),
      match: (x, f) => k.has(f.code, x.code) && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.level || x.level === f.level) && (!f.src || (x.src || 'SX') === f.src),
      adv: (txt, sel) => `${txt('code', 'Mã ECR')}${txt('title', 'Tên yêu cầu')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('level', 'Cấp phê duyệt', { options: k.catOpts('sx-cap-duyet') })}
        ${sel('src', 'Nguồn', { searchable: false, options: Object.entries(SRC).map(([value, label]) => ({ value, label })) })}`,
      cols: [['Trạng thái', 170, 'c'], ['Yêu cầu thay đổi kỹ thuật (ECR)', 340], ['Dự án', 240], ['Nguồn', 160], ['Phiếu bất thường', 130], ['Cấp phê duyệt', 200], ['ECO', 130], ['ECN', 130], ['Bước hiện tại', 240], ['Người đang xử lý', 170]],
      href,
      cell: (x) => `<td class="c">${badge(...x.st)}</td><td>${NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết yêu cầu thay đổi kỹ thuật' })}</td><td>${PJ(x.project)}</td><td>${k.clamp(srcText(x))}</td>
        <td>${x.issue ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.issue)}" title="Xem chi tiết phiếu bất thường">${esc(x.issue)}</a>` : k.dash}</td><td>${x.level ? k.clamp(`${x.level} — ${levelRow(x.level).name}`) : k.dash}</td>
        <td>${x.eco ? esc(x.eco) : k.dash}</td><td>${x.ecn ? esc(x.ecn) : k.dash}</td><td>${x.step ? k.clamp(x.step) : k.dash}</td><td>${x.who ? k.clamp(x.who) : k.dash}</td>`,
    });
  }

  /* ---------- Thêm mới ECR (= bước 1) ---------- */
  const issueOpts = (project) => window.SxBt.all().filter((i) => i.type === 'L2' && !i.closed && (!project || i.project === project)).map((i) => [i.code, `${i.code} — ${i.title}`]);
  async function create(project, issue) {
    const f = window.EForms.sx['SX-TD'].ecr;
    const projects = P().visible().filter((p) => p.status !== 'PLANNING' && p.status !== 'DONE').map((p) => [p.code, `${p.code} — ${p.name}`]);
    const it = issue ? window.SxBt.byCode(issue) : null;
    const r = await window.EFormRun.open({ title: 'Thêm mới yêu cầu thay đổi kỹ thuật', schema: Object.assign({ id: f.id }, f.schema({ projects, issues: issueOpts(project) })),
      values: { tdProject: project || null, tdIssue: issue || null, tdTitle: it ? `Thay đổi thiết kế xử lý ${it.code}: ${it.title}` : '', tdLyDo: it ? it.desc : '' } });
    if (!r || !r.submit) return;
    const v = r.values, code = nextNo('ECR');
    U.created.unshift({ code, project: v.tdProject, title: v.tdTitle.trim(), reason: v.tdLyDo.trim(), issue: v.tdIssue || null, creator: pid(), created: D.sxToday });
    persist();
    const c = F().start('SX-TD', code);
    F().complete(c.code, c.tokens[0].id, -1, v);
    P().log(v.tdProject, 'Lập yêu cầu thay đổi kỹ thuật', `${code}${v.tdIssue ? ` (từ ${v.tdIssue})` : ''}`);
    toast('<b>Thành công</b><br>Thêm mới thành công!');
    location.hash = '#/' + href({ code });
  }

  /* ---------- Chi tiết ECR (cũng là thân màn xử lý việc của SX-TD) ---------- */
  const tabKey = (code) => 'td:' + code;
  function detail(code, opt) {
    const o = opt || {}, k = K(), x = byCode(code);
    if (!x || !visible().some((y) => y.code === code)) return `<div class="pg">${head({ title: o.title || 'Xem chi tiết yêu cầu thay đổi kỹ thuật', back: o.back || 'sx/thay-doi', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy yêu cầu thay đổi kỹ thuật hoặc bạn không có quyền xem.')}</div>`;
    const c = caseOf(x), v = (c && c.vars) || {}, lv = x.level && levelRow(x.level);
    const info = {
      scr: 'SX-09', name: 'Chi tiết yêu cầu thay đổi kỹ thuật', uc: 'SX-KS-K1 §3.3, Bảng 8',
      notes: ['Khuôn task-create (mode detail) + app-tabs; màn xử lý việc của luồng thay đổi kỹ thuật dùng chính thân màn này + thanh trạng thái (my-task-detail).',
        'Cấp phê duyệt hiện sau khi R&D chọn phạm vi thay đổi ở bước 3; mã ECO / ECN do hệ thống cấp ở bước 5 / 8 và ghi Nhật ký quản lý dự án (tab Bất thường & thay đổi của dự án).'],
      q: ['P-238', 'P-252', 'P-257'], src: 'task-management/components/task-create (mode detail) · @khcn-core/ui app-tabs',
    };
    const tInfo = () => k.card('Thông tin chung', `<div class="ginfo c3">
        ${k.kv('Mã ECR', esc(x.code))}${k.kv('Tên yêu cầu thay đổi', esc(x.title), 'span2')}
        ${k.kv('Trạng thái', badge(...stOf(x)))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}${k.kv('Phiếu bất thường nguồn', x.issue ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.issue)}">${esc(x.issue)}</a>` : null)}
        ${k.kv('Nguồn yêu cầu', esc(SRC[x.src || 'SX']))}${k.kv('Mã yêu cầu trên KHCN', x.khcn ? esc(x.khcn) : null)}${k.kv('Đồng bộ ECN về KHCN', x.src === 'KHCN' ? (x.khcnSync ? `Đã đồng bộ ngày ${esc(dmy(x.khcnSync))}` : 'Chưa ban hành ECN') : null)}
        ${k.kv('Lý do thay đổi', esc(x.reason || ''), 'span3')}
        ${k.kv('Cấp phê duyệt', lv ? esc(`${x.level} — ${lv.name}`) : null, 'span2')}${k.kv('Người phê duyệt', x.approver ? esc(pName(x.approver)) : null)}
        ${k.kv('Mã ECO', x.eco ? esc(`${x.eco} · ${dmy(x.ecoDate)}`) : null)}${k.kv('Mã ECN', x.ecn ? esc(`${x.ecn} · ${dmy(x.ecnDate)}`) : null)}${k.kv('Ngày hoàn thành', x.closed ? esc(dmy(x.closed)) : null)}
        ${k.kv('Người lập', esc(pName(x.creator)))}${k.kv('Ngày lập', esc(dmy(x.created)))}</div>`);
    const tTd = () => `<div data-sxtd-content>${k.card('Phân tích và thay đổi', `<div class="ginfo c3">
        ${k.kv('Nội dung đề xuất', v.tdNoiDung ? esc(v.tdNoiDung) : null, 'span3')}
        ${k.kv('Ảnh hưởng cấu hình', v.ptCauHinh ? esc(v.ptCauHinh) : null, 'span2')}${k.kv('Ảnh hưởng tiến độ', v.ptTienDo != null ? `${v.ptTienDo} ngày` : null)}
        ${k.kv('Ảnh hưởng eBOM', v.ptEbom ? esc(v.ptEbom) : null, 'span2')}${k.kv('Chi phí phát sinh', v.ptChiPhi != null ? `${num(v.ptChiPhi)} đồng` : null)}
        ${k.kv('Lệnh thay đổi (ECO)', v.ecoNoiDung ? esc(v.ecoNoiDung) : null, 'span2')}${k.kv('Phiên bản sau thay đổi', v.ecoPhienBan ? esc(v.ecoPhienBan) : null)}
        ${k.kv('Thông báo thay đổi (ECN)', v.ecnNoiDung ? esc(v.ecnNoiDung) : null, 'span2')}${k.kv('Tài liệu đã cập nhật', (v.ecnTaiLieu || []).length ? esc(v.ecnTaiLieu.join(', ')) : null)}
        ${k.kv('Kết quả đo kiểm mẫu', v.ktKetQua ? esc(v.ktKetQua) : null, 'span3')}
        ${k.kv('Nhà máy áp dụng từ', v.bgNgay ? esc(`${v.bgNgay}, sê-ri ${v.bgSeri || ''}`) : null)}</div>`)}</div>`;
    const tTt = () => { if (!c) return k.card('Tiến trình', '<p class="faint">Chưa có hồ sơ.</p>'); const pr = F().progress(c); return k.card('Hồ sơ thay đổi kỹ thuật', pr.top + pr.steps) + k.card('Lịch sử xử lý', pr.hist); };
    return `<div class="pg" data-sxtd-detail="${esc(x.code)}">
      ${head({ title: o.title || 'Xem chi tiết yêu cầu thay đổi kỹ thuật', back: o.back || 'sx/thay-doi', lg: true, info })}
      ${o.bar || ''}
      ${k.tabs(tabKey(x.code), [['info', 'Thông tin chung'], ['td', 'Phân tích và thay đổi'], ['tt', 'Tiến trình']], { info: tInfo, td: tTd, tt: tTt })}</div>`;
  }
  function ctx(code) {
    const x = byCode(code);
    return { ecr: { code: x.code, title: x.title, project: x.project, product: x.product, version: x.version, eco: x.eco || '', ecn: x.ecn || '', issueText: x.issue ? ` · từ phiếu ${x.issue}` : '' },
      tdLyDo: x.reason, levels: window.Catalog.rows('sx-cap-duyet').filter((r) => r.active !== false).map((r) => [r.code, `${r.code} — ${r.name}: ${r.description}`]) };
  }

  /* ---------- Phần thay đổi kỹ thuật + Nhật ký quản lý dự án trong tab Bất thường & thay đổi của dự án ---------- */
  function projectPart(p) {
    const k = K(), l = all().filter((x) => x.project === p.code).map((x) => Object.assign(x, { st: stOf(x) }));
    const can = canCreate() && p.status !== 'PLANNING' && p.status !== 'DONE';
    const log = logOf(p.code).slice().sort((a, b) => (a[0] < b[0] ? 1 : -1));
    return `<section class="vcard pad24" data-sx-td><div class="vcard-h"><h3>Thay đổi kỹ thuật</h3><span class="cap">Đồng bộ từ phân hệ KHCN</span></div>
      ${k.table([['Yêu cầu thay đổi kỹ thuật (ECR)', 420], ['Cấp phê duyệt', 90, 'c'], ['ECO', 130], ['ECN', 130], ['Trạng thái', 170, 'c']], l,
    (x) => `<td>${NC(x.title, x.code, { go: href(x), tip: 'Xem chi tiết yêu cầu thay đổi kỹ thuật' })}</td><td class="c">${x.level ? esc(x.level) : k.dash}</td><td>${x.eco ? esc(x.eco) : k.dash}</td><td>${x.ecn ? esc(x.ecn) : k.dash}</td><td class="c">${badge(...x.st)}</td>`)}</section>
      <section class="vcard pad24" data-sx-log><div class="vcard-h"><h3>Nhật ký quản lý dự án</h3><span class="cap">Theo SXL.10 — mã ECO / ECN, ngày ban hành, phiên bản tài liệu</span></div>
      ${k.table([['Ngày', 120], ['Loại', 80, 'c'], ['Nội dung', 480], ['Phiên bản tài liệu', 160], ['ECR', 130]], log,
    (r) => `<td class="num">${esc(dmy(r[0]))}</td><td class="c">${esc(r[1])}</td><td>${NC(r[3], r[2])}</td><td>${r[4] ? esc(r[4]) : k.dash}</td><td><a class="link" data-go="${href({ code: r[5] })}" title="Xem chi tiết yêu cầu thay đổi kỹ thuật">${esc(r[5])}</a></td>`)}</section>`;
  }
  /* Nút mở ECR trên phiếu bất thường Loại 2 chưa đóng, chưa có ECR. */
  const ecrOf = (issue) => all().find((x) => x.issue === issue) || null;
  const issueBtn = () => ''; /* Bỏ nút mở ECR từ phiếu bất thường: yêu cầu thay đổi kỹ thuật đồng bộ từ phân hệ KHCN */

  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-sxtd-new]'); if (b) create(b.dataset.sxtdNew || null, b.dataset.sxtdIssue || null); });
  function route(parts) { return parts[1] ? detail(decodeURIComponent(parts[1])) : list(); }
  function enter(parts) { if (parts[0] === 'thay-doi' && parts[1]) K().setTab(tabKey(decodeURIComponent(parts[1])), 'info'); }
  function reset() { U = blank(); persist(); }

  window.SxTd = { route, enter, reset, all, byCode, detail, ctx, tabKey, viewTitle: 'Xem chi tiết yêu cầu thay đổi kỹ thuật', stOf, projectPart, issueBtn, ecrOf, logOf };
})();
