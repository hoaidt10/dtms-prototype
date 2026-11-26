/* Phân hệ Quản lý sản xuất — Công việc (T71 S9, D-124; SX-ULNL nhóm "Quản lý công việc"). SX-16:
   danh sách Việc cá nhân / Nhiệm vụ đơn vị (ô chỉ số lọc nhanh, Nhập Excel, Xuất Excel, Sửa / Xoá), Thêm mới / Chỉnh sửa (trang riêng), Chi tiết (Thông tin chung · Công việc con · Lịch sử cập nhật),
   Cập nhật tiến độ (hộp thoại), công việc con nhiều cấp (% việc cha = trung bình việc con), Giao việc từ tab Kế hoạch & mốc (% hạng mục lấy từ công việc gắn hạng mục, trừ bước 9 đọc sản lượng),
   kick-off (bước 5 luồng SX-KH) tự giao nhiệm vụ đơn vị cho bước 4–8 của kế hoạch gốc, nhắc hạn (chuông + Việc của tôi). GIẢ LẬP P-254.
   Route: #/sx/cong-viec/ca-nhan | don-vi, #/sx/cong-viec/create/<CN|DV>[/du-an/<dự án>/<hạng mục>][/cha/<mã việc cha>], #/sx/cong-viec/<mã>[/edit]. Lưu localStorage sx-proto-cv. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vSelect, vModal, vTreeTable } = window.UI;
  const K = () => window.Thau.kit;
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const P = () => window.SxDuAn;

  /* ---------- Ngày ---------- */
  const DAY = 86400000;
  const ms = (s) => Date.parse(String(s).slice(0, 10) + 'T00:00:00');
  const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;
  const daysLeft = (due) => Math.round((ms(due) - ms(D.sxToday)) / DAY);

  /* ---------- Kho công việc ---------- */
  const KEY = 'sx-proto-cv';
  const blank = () => ({ created: [], edit: {}, del: [], log: {}, seq: { CN: 0, DV: 0 } });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const raw = () => U.created.concat(D.sxWork).filter((x) => !U.del.includes(x.code))
    .map((x) => Object.assign({}, x, U.edit[x.code] || {}, { log: (x.log || []).concat(U.log[x.code] || []) }));
  const pid = () => Flow.state.persona;
  const me = () => D.personas.find((x) => x.id === pid()) || {};
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const unitOf = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.unit : ''; };
  const KIND = { CN: 'Việc cá nhân', DV: 'Nhiệm vụ đơn vị' };
  const LIST = { CN: 'ca-nhan', DV: 'don-vi' };
  /* Góp ý 26/11 (hoaidt10): Việc cá nhân gộp vào Việc của tôi (#/sx/viec-cua-toi, sx-flow.js) — #/sx/cong-viec/ca-nhan chuyển về đó. */
  const listHref = (kind) => (kind === 'DV' ? 'sx/cong-viec/don-vi' : 'sx/viec-cua-toi');

  /* % và trạng thái: việc có việc con → % = trung bình việc con (đệ quy), hoàn thành khi mọi việc con hoàn thành. */
  function tree() {
    const l = raw(), by = new Map(l.map((x) => [x.code, x]));
    l.forEach((x) => { x.kids = l.filter((y) => y.parent === x.code); });
    const calc = (x) => {
      if (x.done !== undefined) return x;
      if (x.kids.length) { x.kids.forEach(calc); x.pct = Math.round(x.kids.reduce((a, y) => a + y.pct, 0) / x.kids.length); x.doneAt = x.kids.every((y) => y.pct >= 100) ? x.kids.map((y) => y.doneAt).sort().pop() : null; }
      x.done = x.pct >= 100;
      return x;
    };
    l.forEach(calc);
    return { l, by };
  }
  function stOf(x) {
    if (x.done) return ['Hoàn thành', 'success'];
    if (x.due < D.sxToday) return ['Quá hạn', 'error'];
    return x.pct > 0 ? ['Đang thực hiện', 'info'] : ['Chưa thực hiện', 'default'];
  }
  /* Sắp đến hạn: chưa xong, còn ≤ số ngày nhắc trước của việc (mặc định 2). */
  const soon = (x) => !x.done && x.due >= D.sxToday && daysLeft(x.due) <= (x.remind == null ? 2 : x.remind);
  const all = () => tree().l;
  const byCode = (code) => tree().by.get(code) || null;
  const ancestors = (x, by) => { const a = []; let c = x; while (c && c.parent && by.get(c.parent)) { c = by.get(c.parent); a.push(c); } return a; };

  /* ---------- Phạm vi xem (GIẢ LẬP P-241 / P-254) ---------- */
  const projOk = (x) => !x.project || P().visible().some((p) => p.code === x.project);
  const pmOf = (x) => { const p = x.project && P().byCode(x.project); return p ? p.pm : null; };
  function canSee(x) {
    const id = pid();
    if (isAdmin()) return true;
    if (x.owner === id || x.assigner === id) return true;
    /* Công việc con: PM dự án và lãnh đạo cấp cao (Ban Giám đốc Khối, Ban Tổng Giám đốc) theo dõi tiến độ người thực hiện (Q-SX-01). */
    if (x.parent && projOk(x) && (pmOf(x) === id || ['R-SX-LD', 'R-SX-TGD'].includes(D.roleOf(id)))) return true;
    if (x.kind === 'CN') return false;
    return projOk(x) && (unitOf(x.owner) === me().unit || pmOf(x) === id || D.roleOf(id) === 'R-SX-LD');
  }
  const LEADS = ['R-SX-PM', 'R-SX-SUBPM', 'R-SX-LD'];
  const canAssign = () => isAdmin() || LEADS.includes(D.roleOf(pid()));
  const canCreate = (kind) => (kind === 'CN' ? !!D.roleOf(pid()) || isAdmin() : isAdmin() || ['R-SX-PM', 'R-SX-LD'].includes(D.roleOf(pid())));
  const canEdit = (x) => !x.done && (isAdmin() || x.assigner === pid());
  const canUpdate = (x) => !x.done && !x.kids.length && (isAdmin() || x.owner === pid() || x.assigner === pid());
  /* Xoá: việc chưa bắt đầu cập nhật, không có việc con, không sinh từ kế hoạch; người giao hoặc quản trị. */
  const canDel = (x) => !x.log.length && x.pct === 0 && !x.kids.length && x.src !== 'KH' && (isAdmin() || x.assigner === pid());

  /* ---------- Liên kết kế hoạch (cho sx-du-an.js) ---------- */
  /* Công việc cấp 1 gắn hạng mục kế hoạch: % = trung bình, ngày thực tế = ngày hoàn thành muộn nhất khi tất cả xong. null = hạng mục chưa có công việc. */
  function planProgress(code, key) {
    const l = all().filter((x) => x.project === code && x.plan === key && !x.parent);
    if (!l.length) return null;
    const pct = Math.round(l.reduce((a, x) => a + x.pct, 0) / l.length);
    return { pct, act: l.every((x) => x.done) ? ms(l.map((x) => x.doneAt).sort().pop()) : null, n: l.length };
  }
  const canPlan = (p) => !!p.baseline && p.status !== 'DONE' && (isAdmin() || p.pm === pid());
  /* Cột Công việc của bảng Kế hoạch & mốc: số công việc gắn hạng mục + nút Giao việc (hạng mục lá, trừ bước 9 — bước 9 giao theo bán thành phẩm / mốc / lô ở tab Bán thành phẩm). */
  function planCell(p, r) {
    const key = r.key.split('.').slice(1).join('.') || r.key;
    if (r.children && key !== 'B4') return '';
    const n = all().filter((x) => x.project === p.code && x.plan === key && !x.parent).length;
    const cnt = n ? `<a class="link" data-go="sx/cong-viec/don-vi" data-sxcv-plan="${esc(p.code)}|${esc(key)}">${n} việc</a>` : '';
    const btn = canPlan(p) && !/^B9/.test(key) ? `<button type="button" class="vbtn sm secondary" data-go="sx/cong-viec/create/DV/du-an/${encodeURIComponent(p.code)}/${encodeURIComponent(key)}">Giao việc</button>` : '';
    return `<span class="row" style="gap:8px;justify-content:flex-end">${cnt}${btn}</span>`;
  }
  /* Kick-off chốt kế hoạch gốc (SX-KH bước 5) → nhiệm vụ đơn vị cho bước 4–8 (chuẩn bị 4M, thống nhất phương án với nhà máy), người đầu mối theo vai của bước. */
  const BY_NAME = (n) => (D.personas.find((x) => x.name === n) || {}).id || null;
  function fromPlan(code) {
    const p = P().byCode(code);
    if (!p) return 0;
    const g = P().planOf(p, true), steps = g[1].children.concat(g[2].children.filter((x) => x.key === 'B8'));
    let n = 0;
    steps.forEach((r) => {
      if (all().some((x) => x.project === code && x.plan === r.key && x.src === 'KH')) return;
      const owner = BY_NAME(r.who) || p.pm;
      add({ kind: 'DV', title: r.name.replace(/^\d+\.\s*/, ''), project: code, plan: r.key, parent: null, owner, assigner: p.pm, start: iso(Math.max(r.s, ms(D.sxToday))), due: iso(r.e),
        prio: 'TB', remind: 3, pct: 0, src: 'KH', desc: 'Giao khi kick-off dự án, theo kế hoạch gốc.' });
      n += 1;
    });
    if (n) P().log(code, 'Giao nhiệm vụ theo kế hoạch gốc', `${n} nhiệm vụ đơn vị`);
    return n;
  }
  function add(o) {
    const pre = o.kind === 'DV' ? 'NV-SX-2026-' : 'CV-SX-2026-', n = Math.max(0, ...all().filter((x) => x.code.startsWith(pre)).map((x) => Number(x.code.slice(-3)))) + 1;
    const x = Object.assign({ code: pre + String(n).padStart(3, '0'), created: D.sxToday, log: [] }, o);
    U.created.unshift(x);
    persist();
    return x;
  }
  if (window.SxFlow) {
    const prev = window.SxFlow.ACT['kh.baseline'];
    window.SxFlow.ACT['kh.baseline'] = (c, ch, x) => { if (prev) prev(c, ch, x); fromPlan(c.obj); };
  }

  /* ---------- Nhắc hạn (chuông, Việc của tôi) ---------- */
  const reminders = (id) => all().filter((x) => x.owner === id && !x.done && (x.due < D.sxToday || soon(x)));
  const remindCount = (id) => reminders(id || pid()).length;
  function remindBar() {
    const l = reminders(pid());
    if (!l.length) return '';
    const over = l.filter((x) => x.due < D.sxToday).length, near = l.length - over;
    const txt = [over ? `${over} công việc quá hạn` : '', near ? `${near} công việc sắp đến hạn` : ''].filter(Boolean).join(', ');
    const kind = l.every((x) => x.kind === 'DV') ? 'DV' : 'CN';
    return `<div class="hd-alerts" data-sxcv-remind><div class="hd-alert ${over ? 'error' : 'warning'}">${icon('info')}<span>Bạn có ${txt}: ${esc(l.slice(0, 3).map((x) => x.title).join('; '))}${l.length > 3 ? '…' : ''}.
      <a class="link" data-go="${listHref(kind)}"${kind === 'DV' ? ' data-sxcv-tile="DV|mine"' : ''} title="Xem danh sách công việc">Xem công việc</a></span></div></div>`;
  }

  /* ---------- SX-16 Danh sách ---------- */
  const href = (x) => 'sx/cong-viec/' + encodeURIComponent(x.code);
  const TILE = {}; // bộ lọc nhanh theo ô chỉ số, theo loại
  const TILES = [['all', 'Tổng số', 'Mọi công việc trong phạm vi xem'], ['open', 'Chưa hoàn thành', 'Chưa thực hiện, đang thực hiện, quá hạn'], ['done', 'Đã hoàn thành', 'Đạt 100%'],
    ['over', 'Quá hạn', 'Chưa xong, đã qua hạn hoàn thành', 'bad'], ['soon', 'Sắp đến hạn', 'Còn trong số ngày nhắc trước hạn', 'warn'], ['mine', 'Giao cho tôi', 'Tôi là người thực hiện / đầu mối']];
  const tileOk = (t, x) => ({ all: true, open: !x.done, done: x.done, over: !x.done && x.due < D.sxToday, soon: soon(x), mine: x.owner === pid() })[t || 'all'];
  const base = (kind) => all().filter((x) => x.kind === kind && canSee(x));
  const rowsOf = (kind) => base(kind).filter((x) => tileOk(TILE[kind], x)).map((x) => Object.assign(x, { st: stOf(x) })).sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.code < b.code ? -1 : 1));
  /* T74 #97: bước 4 là nhóm (2 mục con) nhưng vẫn giao việc được ở cấp bước — hạng mục giao việc = lá (trừ mốc bước 9) + nhóm bước 4. */
  const flat = (rows) => rows.flatMap((r) => [r].concat(r.children ? flat(r.children) : []));
  const assignable = (p) => flat(P().planOf(p)).filter((r) => !/^G\d$/.test(r.key) && !/^B9\./.test(r.key) && (!r.children || r.key === 'B4'));
  const planName = (x) => { if (!x.plan || !x.project) return ''; const p = P().byCode(x.project); const r = p && assignable(p).find((y) => y.key === x.plan || y.key.endsWith('.' + x.plan)); return r ? r.name : x.plan; };
  const leftCell = (x, k) => { if (x.done) return k.dash; const d = daysLeft(x.due); return `<span class="num ${d < 0 ? 't-err' : ''}"${d >= 0 && soon(x) ? ' style="color:#B54708"' : ''}>${d < 0 ? `Quá ${-d} ngày` : `${d} ngày`}</span>`; };
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" ${attrs}>${icon(ic)}</button>`;
  const ID = (kind) => 'sxcv-' + kind;
  function filtered(kind) {
    const k = K(), L = k.LST[ID(kind)], n = window.UI.norm;
    return rowsOf(kind).filter((x) => (!L ? true : !L.adv ? !L.kw || n(kwText(x)).includes(n(L.kw)) : match(x, L.f, k)));
  }
  const kwText = (x) => `${x.code} ${x.title} ${x.project || ''} ${pName(x.owner)}`;
  const match = (x, f, k) => k.has(f.code, x.code) && k.has(f.title, x.title) && (!f.project || x.project === f.project) && (!f.owner || x.owner === f.owner)
    && k.inSet(f.st, x.st[0]) && (!f.prio || x.prio === f.prio) && (!f.src || x.src === f.src);
  /* T74 #94 / #96: dòng Nhiệm vụ đơn vị. Độ trễ (ngày) = ngày hoàn thành (chưa xong: hôm nay) trừ hạn, không trễ để trống (P-269). */
  const lateDays = (x) => { const end = x.done ? (x.doneAt || x.due) : D.sxToday; const d = Math.round((ms(String(end).slice(0, 10)) - ms(x.due)) / DAY); return d > 0 ? d : 0; };
  function dvCell(x, k) {
    const st = window.SxDuAn.stageName(x.plan), late = lateDays(x);
    return `<td class="c"><div class="acts">${canEdit(x) ? iconBtn('edit', 'Sửa', `data-go="${href(x)}/edit"`) : ''}${canDel(x) ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-sxcv-del="${esc(x.code)}"`)}` : ''}</div></td>
      <td class="c">${badge(...x.st)}</td><td><a class="link" data-go="${href(x)}">${esc(x.code)}</a><div>${k.clamp(x.title)}</div>${x.project ? `<div class="faint">Dự án ${esc(x.project)}</div>` : ''}</td>
      <td>${k.clamp(pName(x.owner))}<div class="faint">${k.clamp(unitOf(x.owner))}</div></td><td>${st ? k.clamp(st) : k.dash}</td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="hd-bar" style="flex:1" role="img" aria-label="Tiến độ ${x.pct}%"><span style="width:${x.pct}%"></span></div><span class="num">${x.pct}%</span></div></td>
      <td class="num">${esc(dmy(x.created || x.start))}</td><td class="num${x.st[0] === 'Quá hạn' ? ' due-over' : ''}">${esc(dmy(x.due))}</td>
      <td class="r num ${late ? 't-err' : ''}">${late ? late : k.dash}</td>`;
  }
  function list(kind) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (công việc; cột Thao tác Sửa / Xoá như B5); ô chỉ số theo ecat common-catalog/overview như SCR-92
    const k = K(), dv = kind === 'DV', b = base(kind), cur = TILE[kind] || 'all';
    const info = {
      scr: 'SX-16', name: dv ? 'Danh sách nhiệm vụ đơn vị' : 'Danh sách việc cá nhân', uc: 'SX-ULNL nhóm Quản lý công việc (Quản lý việc cá nhân, Quản lý nhiệm vụ đơn vị); SX-KS-K1 §3.1 bước 3 (kick-off giao nhiệm vụ PM / Sub PM)',
      notes: [
        dv ? '<b>Nhiệm vụ đơn vị</b>: việc giao cho một đơn vị (người đầu mối), thường gắn dự án và hạng mục kế hoạch. Kick-off (bước 5 luồng Phê duyệt kế hoạch) tự giao nhiệm vụ cho bước 4–8 của kế hoạch gốc; PM giao thêm bằng nút <b>Giao việc</b> ở tab Kế hoạch & mốc của dự án. Phạm vi xem: người thực hiện, người giao, cùng đơn vị với người đầu mối, PM dự án, Lãnh đạo Khối.'
          : '<b>Việc cá nhân</b>: việc của một người — tự tạo, hoặc được giao làm việc con của nhiệm vụ đơn vị. Chỉ người thực hiện và người giao thấy.',
        ...(dv ? ['<b>T74 (comment #94 / #96):</b> mục con của nhóm <b>Quản lý nhiệm vụ</b>; cột như Quản lý nhiệm vụ KHCN — Nhiệm vụ (mã, tên), Chủ nhiệm · Đơn vị (người đầu mối, đơn vị), <b>Giai đoạn</b> (giai đoạn QT.VHT.TTSX.4A.1.1 của hạng mục kế hoạch gắn nhiệm vụ), Tiến độ (thanh %), Ngày nhận nhiệm vụ (ngày giao), Hạn xử lý, <b>Độ trễ (ngày)</b> = ngày hoàn thành (chưa xong: hôm nay) trừ hạn, không trễ để trống (GIẢ LẬP P-269).'] : []),
        'Công việc con nhiều cấp (Thêm công việc con ở Chi tiết): % việc cha = trung bình việc con; việc cha chỉ hoàn thành khi mọi việc con hoàn thành. % hạng mục kế hoạch (trừ bước 9 đọc nhật ký sản lượng) lấy từ công việc cấp 1 gắn hạng mục.',
        'Ô chỉ số = lọc nhanh (bấm lại ô đang chọn hoặc Tổng số để bỏ lọc). Quá hạn: chưa xong, đã qua hạn. Sắp đến hạn: còn trong số ngày <b>Nhắc trước hạn</b> của việc (mặc định 2) — cũng hiện ở chuông và Việc của tôi của người thực hiện.',
        'Xoá: chỉ việc chưa cập nhật tiến độ, không có việc con, không sinh từ kế hoạch; người giao. Xuất Excel theo bộ lọc đang áp dụng (BE xuất .xlsx; prototype tải .csv). Nhập Excel: file mẫu, kiểm lỗi từng dòng, chỉ ghi khi Xác nhận nhập.',
      ],
      q: ['P-254', 'P-241', 'P-269'], src: 'task-management/task-management.component · /task-management; ecat common-catalog/overview (ô chỉ số); vht-import-dialog',
    };
    const tiles = `<div class="rp-tiles tq-metrics" data-sxcv-tiles>${TILES.map(([t, l, d, c]) => `<button type="button" class="ov-tile rp-tile tq-m ${cur === t ? 'on' : ''}" data-sxcv-tile="${kind}|${t}" aria-pressed="${cur === t}">
      <span class="ov-tx"><span class="t">${esc(l)}</span><span class="d">${esc(d)}</span></span><span class="ov-n"><span class="n num ${c || ''}">${b.filter((x) => tileOk(t, x)).length}</span></span></button>`).join('')}</div>`;
    const ST = ['Chưa thực hiện', 'Đang thực hiện', 'Quá hạn', 'Hoàn thành'];
    /* Nhánh hoaidt10: Việc cá nhân chỉ còn Xuất Excel (bỏ Nhập Excel, Thêm mới); Nhiệm vụ đơn vị giữ đủ nút. */
    const right = (dv ? `<button type="button" class="vbtn secondary" data-sxcv-import="${kind}">${icon('upload')} Nhập Excel</button>` : '') + `<button type="button" class="vbtn secondary" data-sxcv-export="${kind}">${icon('excel')} Xuất Excel</button>`
      + (dv && canCreate(kind) ? `<button class="vbtn primary" data-go="sx/cong-viec/create/${kind}">${icon('add')} Thêm mới</button>` : '');
    const people = D.personas.filter((x) => x.sx).map((x) => ({ value: x.id, label: x.name }));
    return k.listPage({
      id: ID(kind), title: dv ? 'Danh sách nhiệm vụ đơn vị' : 'Danh sách việc cá nhân', ph: 'Tìm kiếm theo mã, tên công việc, dự án', info, right, top: `<div data-sxcv-list="${kind}">${tiles}</div>`,
      rows: () => rowsOf(kind), kwText,
      empty: () => ({ code: '', title: '', project: null, owner: null, st: [], prio: null, src: null }),
      match: (x, f) => match(x, f, k),
      adv: (txt, sel) => `${txt('code', 'Mã công việc')}${txt('title', 'Tên công việc')}
        ${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}
        ${sel('owner', dv ? 'Người đầu mối' : 'Người thực hiện', { options: people })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ST.map((x) => ({ value: x, label: x })) })}
        ${sel('prio', 'Mức ưu tiên', { searchable: false, options: Object.entries(D.sxPrio).map(([value, v]) => ({ value, label: v[0] })) })}
        ${dv ? sel('src', 'Nguồn', { searchable: false, options: Object.entries(D.sxWorkSrc).map(([value, label]) => ({ value, label })) }) : ''}`,
      /* T74 #94 / #96: Nhiệm vụ đơn vị theo bộ cột của KHCN — Trạng thái, Nhiệm vụ, Chủ nhiệm · Đơn vị, Giai đoạn, Tiến độ, Ngày nhận nhiệm vụ, Hạn xử lý, Độ trễ (ngày).
         Việc cá nhân giữ bộ cột cũ. */
      cols: dv ? [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Nhiệm vụ', 340], ['Chủ nhiệm · Đơn vị', 240], ['Giai đoạn', 220], ['Tiến độ', 170], ['Ngày nhận nhiệm vụ', 150], ['Hạn xử lý', 120], ['Độ trễ (ngày)', 120, 'r']]
        : [['Thao tác', 100, 'c'], ['Trạng thái', 150, 'c'], ['Mã công việc', 150], ['Tên công việc', 300], ['Dự án', 140], ['Hạng mục kế hoạch', 220], ['Công việc cha', 150],
        [dv ? 'Đơn vị thực hiện' : 'Người thực hiện', 220], [dv ? 'Người đầu mối' : 'Người giao', 170], ['Ngày bắt đầu', 120], ['Hạn hoàn thành', 130], ['Còn lại', 110, 'r'], ['Hoàn thành', 110, 'r'], ['Mức ưu tiên', 120, 'c']],
      href,
      cell: (x) => (dv ? dvCell(x, k) : `<td class="c"><div class="acts">${canEdit(x) ? iconBtn('edit', 'Sửa', `data-go="${href(x)}/edit"`) : ''}${canDel(x) ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-sxcv-del="${esc(x.code)}"`)}` : ''}</div></td>
        <td class="c">${badge(...x.st)}</td><td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${k.clamp(x.title)}</td><td>${x.project ? esc(x.project) : k.dash}</td>
        <td>${x.plan ? k.clamp(planName(x)) : k.dash}</td><td>${x.parent ? `<a class="link" data-go="${href({ code: x.parent })}">${esc(x.parent)}</a>` : k.dash}</td>
        <td>${k.clamp(dv ? unitOf(x.owner) : pName(x.owner))}</td><td>${k.clamp(pName(dv ? x.owner : x.assigner))}</td><td class="num">${esc(dmy(x.start))}</td>
        <td class="num${x.st[0] === 'Quá hạn' ? ' due-over' : ''}">${esc(dmy(x.due))}</td><td class="r">${leftCell(x, k)}</td><td class="r num">${x.pct}%</td>
        <td class="c">${badge(...D.sxPrio[x.prio || 'TB'])}</td>`),
    });
  }

  /* ---------- Xuất Excel (.csv trong prototype) ---------- */
  function exportList(kind) {
    const dv = kind === 'DV', l = filtered(kind);
    const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const headRow = ['STT', 'Mã công việc', 'Tên công việc', 'Trạng thái', 'Dự án', 'Hạng mục kế hoạch', 'Công việc cha', dv ? 'Đơn vị thực hiện' : 'Người thực hiện', dv ? 'Người đầu mối' : 'Người giao',
      'Ngày bắt đầu', 'Hạn hoàn thành', 'Hoàn thành (%)', 'Mức ưu tiên'].concat(dv ? ['Nguồn'] : []);
    const lines = [[dv ? 'DANH SÁCH NHIỆM VỤ ĐƠN VỊ' : 'DANH SÁCH VIỆC CÁ NHÂN'], [], headRow].concat(l.map((x, i) => [i + 1, x.code, x.title, x.st[0], x.project || '', planName(x), x.parent || '',
      dv ? unitOf(x.owner) : pName(x.owner), pName(dv ? x.owner : x.assigner), dmy(x.start), dmy(x.due), x.pct, D.sxPrio[x.prio || 'TB'][0]].concat(dv ? [D.sxWorkSrc[x.src] || ''] : [])));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = dv ? 'Danh sach nhiem vu don vi.csv' : 'Danh sach viec ca nhan.csv';
    a.click();
    toast('<b>Thành công</b><br>Xuất file thành công');
  }

  /* ---------- Nhập Excel (vht-import-dialog + Kết quả nhập dữ liệu, như Nhập nhà cung cấp) ----------
     File giả lập 6 dòng: dòng 4 hạn trước ngày bắt đầu, dòng 6 người thực hiện không có trong hệ thống. */
  const IMP = [
    ['Lập danh sách vật tư tiêu hao đợt 2', 'DA-SX-2026-002', 'sxsub', '2026-11-17', '2026-11-28', 'TB'],
    ['Kiểm tra hồ sơ chất lượng lô linh kiện FPGA về kho', 'DA-SX-2026-001', 'sxqa', '2026-11-18', '2026-11-25', 'CAO'],
    ['Cập nhật quy trình công nghệ tích hợp khối quang học', 'DA-SX-2026-002', 'sxrd', '2026-11-17', '2026-12-05', 'TB'],
    ['Tổng hợp chi phí gia công tháng 11', 'DA-SX-2026-003', 'sxk2', '2026-11-30', '2026-11-20', 'THAP'],
    ['Đào tạo bổ sung công nhân đo kiểm', 'DA-SX-2026-002', 'sxpm', '2026-11-20', '2026-12-10', 'TB'],
    ['Đối chiếu biên bản giao nhận với VMC', 'DA-SX-2026-001', 'Nguyễn Văn X', '2026-11-18', '2026-11-30', 'TB'],
  ];
  function importDlg(kind) {
    let file = null;
    const pick = () => {
      const m = vModal({ title: 'Nhập dữ liệu', size: 'w780', body: `<div class="imp">
          <div class="imp-banner"><span class="imp-bl">${icon('file')}File mẫu nhập ${kind === 'DV' ? 'nhiệm vụ đơn vị' : 'việc cá nhân'}</span>
            <button type="button" class="imp-tpl" data-imp-tpl>${icon('download')}Tải file mẫu</button></div>
          <button type="button" class="imp-zone" data-imp-zone><span class="imp-glyph">${icon('upload')}</span>
            <span class="imp-hint">${file ? esc(file) : 'Kéo thả file vào đây hoặc bấm để chọn'}</span>
            <span class="imp-sub">${file ? '12,6 KB' : 'Hỗ trợ định dạng .xlsx, .csv (tối đa 10MB)'}</span></button></div>`,
      actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-go" ${file ? '' : 'disabled'}>Nhập dữ liệu</button>` });
      m.el.querySelector('[data-imp-tpl]').onclick = () => toast(`<b>Thành công</b><br>Đã tải file mau-nhap-${kind === 'DV' ? 'nhiem-vu-don-vi' : 'viec-ca-nhan'}.xlsx`);
      m.el.querySelector('[data-imp-zone]').onclick = () => { file = 'danh-sach-cong-viec.xlsx'; m.close(); pick(); };
      m.el.querySelector('#imp-go').onclick = () => { m.close(); result(); };
    };
    const result = () => {
      const res = IMP.map(([title, project, owner, s, e, prio], i) => {
        const errs = [], p = D.personas.find((x) => x.id === owner);
        if (!p) errs.push(`Người thực hiện ${owner} không có trong hệ thống.`);
        if (e < s) errs.push('Hạn hoàn thành phải sau hoặc bằng Ngày bắt đầu.');
        if (!P().byCode(project)) errs.push(`Dự án ${project} không tồn tại.`);
        return { n: i + 1, v: { title, project, owner, start: s, due: e, prio }, errs, who: p ? p.name : owner };
      });
      const ok = res.filter((r) => !r.errs.length), cell = (v) => (v ? esc(v) : '<span class="dash">-</span>');
      const body = res.map((r) => `<tr><td class="ord">${r.n}</td><td class="c">${r.errs.length ? badge('Lỗi', 'error') : badge('Hợp lệ', 'success')}</td>
          <td>${r.errs.length ? `<span class="imp-err">${esc(r.errs.join(' '))}</span>` : '<span class="dash">-</span>'}</td><td>${cell(r.v.title)}</td><td>${cell(r.v.project)}</td>
          <td>${cell(r.who)}</td><td class="num">${cell(dmy(r.v.start))}</td><td class="num">${cell(dmy(r.v.due))}</td><td>${cell(D.sxPrio[r.v.prio][0])}</td></tr>`).join('');
      const m = vModal({ title: 'Kết quả nhập dữ liệu', size: 'xl', body: `<div class="imp-res" data-sxcv-imp>
          <div class="imp-top"><span class="imp-sum">${ok.length}/${res.length} dòng hợp lệ</span><button type="button" class="vbtn primary" data-imp-again>${icon('upload')} Nhập file mới</button></div>
          <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th><th class="c" style="min-width:110px">Kết quả</th><th style="min-width:260px">Nội dung lỗi</th>
            <th style="min-width:280px">Tên công việc</th><th style="min-width:140px">Dự án</th><th style="min-width:180px">${kind === 'DV' ? 'Người đầu mối' : 'Người thực hiện'}</th><th style="min-width:120px">Ngày bắt đầu</th><th style="min-width:130px">Hạn hoàn thành</th><th style="min-width:120px">Mức ưu tiên</th></tr></thead>
            <tbody>${body}</tbody></table></div></div>`,
      actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-ok" ${ok.length ? '' : 'disabled'}>Xác nhận nhập</button>` });
      m.el.querySelector('[data-imp-again]').onclick = () => { file = null; m.close(); pick(); };
      m.el.querySelector('#imp-ok').onclick = () => {
        ok.forEach((r) => add(Object.assign({ kind, plan: null, parent: null, assigner: pid(), remind: 2, pct: 0, src: 'XLS', desc: '' }, r.v)));
        m.close();
        K().LST[ID(kind)] && (K().LST[ID(kind)].page = 1);
        toast(`<b>Thành công</b><br>Nhập công việc thành công (${ok.length} công việc)`);
        rerender();
      };
    };
    pick();
  }

  /* ---------- Thêm mới / Chỉnh sửa ---------- */
  const F = { code: null, kind: 'CN', v: {}, err: {}, lock: {} };
  function resetForm(o) {
    F.err = {}; F.lock = {};
    const x = o.code && byCode(o.code);
    if (x) { F.code = x.code; F.kind = x.kind; F.v = { title: x.title, project: x.project, plan: x.plan, parent: x.parent, owner: x.owner, start: dmy(x.start), due: dmy(x.due), prio: x.prio || 'TB', remind: String(x.remind == null ? 2 : x.remind), desc: x.desc || '' }; return; }
    F.code = null; F.kind = o.kind === 'DV' ? 'DV' : 'CN';
    const par = o.parent && byCode(o.parent);
    F.v = { title: '', project: par ? par.project : o.project || null, plan: o.plan || null, parent: par ? par.code : null, owner: F.kind === 'CN' && !canAssign() ? pid() : null,
      start: dmy(D.sxToday), due: '', prio: 'TB', remind: '2', desc: '' };
    if (o.project) F.lock.project = true;
    if (o.plan) F.lock.plan = true;
    if (par) { F.lock.project = !!par.project; F.lock.parent = true; }
  }
  const leafOpts = (code) => { const p = code && P().byCode(code); return p ? assignable(p).map((r) => ({ value: r.key, label: r.name })) : []; };
  function form(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create / edit)
    const k = K(), v = F.v, err = F.err, x = code ? byCode(code) : null, kind = x ? x.kind : F.kind, dv = kind === 'DV';
    const back = x ? href(x) : v.parent ? href({ code: v.parent }) : v.project && F.lock.plan ? `sx/du-an/${encodeURIComponent(v.project)}/ke-hoach` : listHref(kind);
    const title = `${x ? 'Chỉnh sửa' : 'Thêm mới'} ${dv ? 'nhiệm vụ đơn vị' : 'việc cá nhân'}`;
    if (x && !canEdit(x)) return `<div class="pg">${head({ title, back, lg: true })}${k.emptyCard('Thông tin chung', 'Công việc đã hoàn thành hoặc bạn không phải người giao việc.')}</div>`;
    if (!x && !canCreate(kind)) return `<div class="pg">${head({ title, back, lg: true })}${k.emptyCard('Thông tin chung', 'Bạn không có quyền giao nhiệm vụ đơn vị.')}</div>`;
    const info = {
      scr: 'SX-16', name: title, uc: 'SX-ULNL Quản lý công việc (Thêm mới, Chỉnh sửa; Giao việc, Phân rã nhiều cấp của QL dự án)',
      notes: [
        'Khuôn task-create (mode create / edit), trang riêng có route (B6). Mã do hệ thống sinh: NV-SX-… nhiệm vụ đơn vị, CV-SX-… việc cá nhân.',
        'Mở từ <b>Giao việc</b> ở tab Kế hoạch & mốc: Dự án và Hạng mục kế hoạch khoá sẵn. Mở từ <b>Thêm công việc con</b>: khoá Công việc cha; hạn việc con không được sau hạn việc cha.',
        '<b>Nhiệm vụ đơn vị chưa có dự án</b> (hoaidt10 23/11): nhiệm vụ sản xuất được giao trước khi có dự án — đầu mối lập Phương án sản xuất kinh doanh từ nhiệm vụ; PASXKD được phê duyệt thì lập dự án, dự án tự gắn vào nhiệm vụ.',
        'Việc cá nhân: người không phải PM / Sub PM / Lãnh đạo chỉ tạo việc cho chính mình. Nhiệm vụ đơn vị: Đơn vị thực hiện = đơn vị của người đầu mối (thật: danh mục đơn vị + nhân sự từ hệ thống Nhân sự).',
      ],
      q: ['P-254'], src: 'task-management/components/task-create · /task-management/create',
    };
    const { by } = tree();
    const bad = new Set(x ? [x.code].concat(all().filter((y) => ancestors(y, by).some((a) => a.code === x.code)).map((y) => y.code)) : []);
    const parents = all().filter((y) => canSee(y) && !y.done && !bad.has(y.code) && (!v.project || y.project === v.project)).map((y) => ({ value: y.code, label: `${y.code} — ${y.title}` }));
    /* Công việc con (có Công việc cha): người thực hiện chỉ trong đơn vị của người thực hiện việc cha (Q-SX-01). */
    const parOwner = v.parent && (byCode(v.parent) || {}).owner;
    const ppl = D.personas.filter((p) => p.sx && (parOwner ? p.unit === unitOf(parOwner) : dv || canAssign() || p.id === pid())).map((p) => ({ value: p.id, label: dv ? `${p.name} — ${p.unit}` : `${p.name} — ${p.role}` }));
    const sel = (id, key, opts, o) => vSelect(Object.assign({ id, value: v[key], searchable: true, placeholder: 'Chọn ' + ((o && o.ph) || ''), invalid: !!err[key], options: opts, disabled: !!F.lock[key],
      onChange: (val) => { keep(); v[key] = val; delete err[key]; if (key === 'project') { v.plan = null; if (v.parent && (byCode(v.parent) || {}).project !== val) v.parent = null; } rerender(); } }, o || {}));
    return `<form class="pg" data-sxcv-form="${x ? esc(x.code) : ''}">
      ${head({ title, back, lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung</h3>
        <div class="grid3">
          ${k.field('Mã công việc', `<input class="vctl" value="${x ? esc(x.code) : ''}" placeholder="Hệ thống tự sinh" disabled>`)}
          ${k.field('Tên công việc', `<input class="vctl" id="cvf-title" maxlength="500" placeholder="Nhập tên công việc" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span2' })}
          ${k.field('Dự án sản xuất', sel('cvf-project', 'project', P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })), { ph: 'dự án', clear: true }), { err: err.project })}
          ${k.field('Hạng mục kế hoạch', sel('cvf-plan', 'plan', leafOpts(v.project), { ph: 'hạng mục', clear: true, disabled: !!F.lock.plan || !v.project }))}
          ${k.field('Công việc cha', sel('cvf-parent', 'parent', parents, { ph: 'công việc cha', clear: true }), { err: err.parent })}
          ${k.field(dv ? 'Người đầu mối' : 'Người thực hiện', sel('cvf-owner', 'owner', ppl, { ph: dv ? 'người đầu mối' : 'người thực hiện' }), { req: true, err: err.owner })}
          ${k.field(dv ? 'Đơn vị thực hiện' : 'Người giao', `<input class="vctl" value="${esc(dv ? unitOf(v.owner) : pName(x ? x.assigner : pid()))}" placeholder="${dv ? 'Theo người đầu mối' : ''}" disabled>`)}
          ${k.field('Mức ưu tiên', sel('cvf-prio', 'prio', Object.entries(D.sxPrio).map(([value, p]) => ({ value, label: p[0] })), { searchable: false, ph: 'mức ưu tiên' }), { req: true })}
          ${k.field('Ngày bắt đầu', window.UI.vDate('id="cvf-start"', v.start, { invalid: !!err.start }), { req: true, err: err.start })}
          ${k.field('Hạn hoàn thành', window.UI.vDate('id="cvf-due"', v.due, { invalid: !!err.due }), { req: true, err: err.due })}
          ${k.field('Nhắc trước hạn (ngày)', `<input class="vctl" id="cvf-remind" inputmode="numeric" maxlength="2" value="${esc(v.remind)}" ${err.remind ? 'aria-invalid="true"' : ''}>`, { err: err.remind })}
          ${k.field('Mô tả', `<textarea class="vctl" id="cvf-desc" rows="3" maxlength="2000" placeholder="Nhập mô tả công việc, kết quả cần đạt">${esc(v.desc)}</textarea>`, { cls: 'span3' })}
        </div></section></form>`;
  }
  function keep() {
    const g = (id) => document.getElementById(id);
    [['title', 'cvf-title'], ['start', 'cvf-start'], ['due', 'cvf-due'], ['remind', 'cvf-remind'], ['desc', 'cvf-desc']].forEach(([k, id]) => { if (g(id)) F.v[k] = g(id).value; });
  }
  function save() {
    keep();
    const v = F.v, err = F.err = {}, x = F.code && byCode(F.code), kind = x ? x.kind : F.kind;
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên công việc.';
    if (!v.owner) err.owner = kind === 'DV' ? 'Bạn cần chọn Người đầu mối.' : 'Bạn cần chọn Người thực hiện.';
    const s = fromDmy(v.start), e = fromDmy(v.due);
    if (!s) err.start = 'Bạn cần nhập Ngày bắt đầu đúng định dạng DD/MM/YYYY.';
    if (!e) err.due = 'Bạn cần nhập Hạn hoàn thành đúng định dạng DD/MM/YYYY.';
    else if (s && e < s) err.due = 'Hạn hoàn thành phải sau hoặc bằng Ngày bắt đầu.';
    const par = v.parent && byCode(v.parent);
    if (par && v.owner && unitOf(v.owner) !== unitOf(par.owner)) err.owner = 'Người thực hiện công việc con phải cùng đơn vị với người thực hiện công việc cha.';
    if (!err.due && par && e > par.due) err.due = `Hạn hoàn thành không được sau hạn của công việc cha (${dmy(par.due)}).`;
    if (!/^\d{1,2}$/.test(String(v.remind).trim())) err.remind = 'Nhắc trước hạn là số ngày từ 0 đến 99.';
    if (Object.keys(err).length) { rerender(); return; }
    const data = { title: v.title.trim(), project: v.project || null, plan: v.plan || null, parent: v.parent || null, owner: v.owner, start: s, due: e, prio: v.prio, remind: Number(v.remind), desc: v.desc.trim() };
    let code = F.code;
    if (x) {
      const own = U.created.find((y) => y.code === code);
      if (own) Object.assign(own, data); else U.edit[code] = Object.assign(U.edit[code] || {}, data);
      persist();
      toast('<b>Thành công</b><br>Cập nhật thành công!');
    } else {
      code = add(Object.assign({ kind, assigner: pid(), pct: 0, src: 'TAY' }, data)).code;
      if (data.project && data.plan) P().log(data.project, 'Giao việc theo hạng mục kế hoạch', `${code}: ${data.title} — ${pName(data.owner)}`);
      toast('<b>Thành công</b><br>Thêm mới thành công!');
    }
    location.hash = '#/' + href({ code });
  }

  /* ---------- Chi tiết ---------- */
  const tabKey = (code) => 'cv:' + code;
  function detail(code) {
    const k = K(), { by } = tree(), x = by.get(code);
    if (!x || !canSee(x)) return `<div class="pg">${head({ title: 'Xem chi tiết công việc', back: listHref('CN'), lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy công việc hoặc bạn không có quyền xem.')}</div>`;
    const dv = x.kind === 'DV', st = stOf(x), back = listHref(x.kind);
    const info = {
      scr: 'SX-16', name: 'Chi tiết công việc', uc: 'SX-ULNL Quản lý công việc (Xem chi tiết; Phân rã nhiều cấp, Cập nhật tiến độ, Nhắc hạn của QL dự án)',
      notes: ['Khuôn task-create (mode detail) + app-tabs. Tab Công việc con là bảng cây (vht-tree-table) mọi cấp.',
        '<b>Cập nhật tiến độ</b> (hộp thoại): người thực hiện hoặc người giao, việc không có việc con; 100% = hoàn thành, ghi ngày hoàn thành. Mỗi lần cập nhật một dòng Lịch sử cập nhật.',
        'Việc gắn hạng mục kế hoạch: % của hạng mục ở tab Kế hoạch & mốc là trung bình các công việc cấp 1 của hạng mục.'],
      q: ['P-254'], src: 'task-management/components/task-create (mode detail) · @khcn-core/ui app-tabs, vht-tree-table',
    };
    const canPa = x.kind === 'DV' && !x.project && !x.parent && !!window.SxPa && !window.SxPa.all().some((y) => y.nv === x.code) && (x.owner === pid() || isAdmin());
    const right = (canPa ? `<button type="button" class="vbtn primary" data-sxpa-new="${esc(x.code)}">${icon('add')} Lập phương án SXKD</button>` : '') + (canUpdate(x) ? `<button type="button" class="vbtn primary" data-sxcv-upd="${esc(x.code)}">Cập nhật tiến độ</button>` : '')
      + (canSplit(x) ? `<button type="button" class="vbtn secondary" data-go="sx/cong-viec/create/CN/cha/${encodeURIComponent(x.code)}">${icon('add')} Thêm công việc con</button>` : '')
      + (canEdit(x) ? `<button type="button" class="vbtn secondary" data-go="${href(x)}/edit">${icon('edit')} Chỉnh sửa</button>` : '');
    const d = daysLeft(x.due);
    const alert = st[0] === 'Quá hạn' ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Công việc quá hạn ${-d} ngày (hạn ${esc(dmy(x.due))}).</span></div></div>`
      : soon(x) ? `<div class="hd-alerts"><div class="hd-alert warning">${icon('info')}<span>Công việc sắp đến hạn: còn ${d} ngày (hạn ${esc(dmy(x.due))}).</span></div></div>` : '';
    const anc = ancestors(x, by).reverse();
    const tInfo = () => k.card('Thông tin chung', `<div class="ginfo c3">
        ${k.kv('Mã công việc', esc(x.code))}${k.kv('Tên công việc', esc(x.title), 'span2')}
        ${k.kv('Loại', esc(KIND[x.kind]))}${k.kv('Trạng thái', badge(...st))}${k.kv('Hoàn thành', `${x.pct}%${x.kids.length ? ' (theo công việc con)' : ''}`)}
        ${k.kv('Dự án sản xuất', x.project ? `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>` : null)}${k.kv('Hạng mục kế hoạch', x.plan ? esc(planName(x)) : null, 'span2')}
        ${dv && window.SxPa ? k.kv('Phương án sản xuất kinh doanh', ((pa) => (pa ? `<a class="link" data-go="sx/pasxkd/${encodeURIComponent(pa.code)}">${esc(pa.no)} — ${esc(pa.title)}</a>` : null))(window.SxPa.all().find((y) => y.nv === x.code)), 'span3') : ''}
        ${k.kv('Công việc cha', anc.length ? anc.map((a) => `<a class="link" data-go="${href(a)}">${esc(a.code)}</a>`).join(' › ') : null, 'span3')}
        ${k.kv(dv ? 'Người đầu mối' : 'Người thực hiện', esc(pName(x.owner)))}${k.kv('Đơn vị thực hiện', esc(unitOf(x.owner)))}${k.kv('Người giao', esc(pName(x.assigner)))}
        ${k.kv('Ngày bắt đầu', esc(dmy(x.start)))}${k.kv('Hạn hoàn thành', esc(dmy(x.due)))}${k.kv('Ngày hoàn thành', x.doneAt ? esc(dmy(x.doneAt)) : null)}
        ${k.kv('Mức ưu tiên', badge(...D.sxPrio[x.prio || 'TB']))}${k.kv('Nhắc trước hạn', `${x.remind == null ? 2 : x.remind} ngày`)}${dv ? k.kv('Nguồn', esc(D.sxWorkSrc[x.src] || '')) : ''}
        ${k.kv('Mô tả', esc(x.desc || ''), 'span3')}${k.kv('Ngày tạo', esc(dmy(x.created)))}</div>`);
    const open = T.open[x.code] || (T.open[x.code] = new Set());
    const node = (y) => ({ key: y.code, code: y.code, r: y, children: y.kids.length ? y.kids.map(node) : null });
    const tKids = () => `<section class="vcard" data-sxcv-kids><div class="vcard-h"><h3>Công việc con</h3><span class="cap">${x.kids.length ? `% công việc này = trung bình ${x.kids.length} công việc con trực tiếp` : ''}</span></div>
      ${vTreeTable({ id: 'sxcv-kids', expanded: open, empty: 'Chưa có công việc con', rows: x.kids.map(node),
    onToggle: (key) => { if (open.has(key)) open.delete(key); else open.add(key); rerender(); },
    columns: [
      { h: 'Mã công việc', w: 220, toggler: true, cell: (n) => `<a class="link" data-go="${href(n.r)}">${esc(n.r.code)}</a>` },
      { h: 'Tên công việc', w: 320, cell: (n) => k.clamp(n.r.title) },
      { h: 'Người thực hiện', w: 200, cell: (n) => k.clamp(pName(n.r.owner)) },
      { h: 'Hạn hoàn thành', w: 130, cell: (n) => `<span class="num${!n.r.done && n.r.due < D.sxToday ? ' t-err' : ''}">${esc(dmy(n.r.due))}</span>` },
      { h: 'Hoàn thành', w: 110, align: 'r', cell: (n) => `<span class="num">${n.r.pct}%</span>` },
      { h: 'Trạng thái', w: 150, align: 'c', cell: (n) => badge(...stOf(n.r)) }] })}</section>`;
    const tLog = () => k.card('Lịch sử cập nhật', k.table([['Thời gian', 160], ['Người cập nhật', 220], ['Hoàn thành', 110, 'r'], ['Ghi chú', 460]], x.log.slice().sort((a, b) => (a[0] < b[0] ? 1 : -1)),
      (h) => `<td class="num">${esc(dmy(h[0]))}</td><td>${k.clamp(pName(h[1]))}</td><td class="r num">${h[2]}%</td><td>${h[3] ? k.clamp(h[3]) : k.dash}</td>`));
    return `<div class="pg" data-sxcv-detail="${esc(x.code)}">
      ${head({ title: 'Xem chi tiết công việc', back, lg: true, info, right })}${alert}
      ${k.tabs(tabKey(x.code), [['info', 'Thông tin chung'], ['kids', `Công việc con (${x.kids.length})`], ['log', 'Lịch sử cập nhật']], { info: tInfo, kids: tKids, log: tLog })}</div>`;
  }
  const T = { open: {} };

  /* ---------- Cập nhật tiến độ ---------- */
  function updDlg(code) {
    const x = byCode(code);
    if (!x || !canUpdate(x)) return;
    const m = vModal({ title: 'Cập nhật tiến độ', size: 'md', body: `<div class="grid2" data-sxcv-upd-dlg>
        ${K().field('Hoàn thành (%)', `<input class="vctl" id="cvu-pct" inputmode="numeric" maxlength="3" value="${x.pct}">`, { req: true })}
        ${K().field('Hiện tại', `<input class="vctl" value="${x.pct}% — ${esc(stOf(x)[0])}" disabled>`)}
        ${K().field('Ghi chú', '<textarea class="vctl" id="cvu-note" rows="3" maxlength="1000" placeholder="Nhập kết quả, vướng mắc"></textarea>', { cls: 'span2' })}
        <p class="msg t-err" id="cvu-err" role="alert" style="grid-column:1/-1;margin:0"></p></div>`,
    actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" id="cvu-ok">Lưu</button>' });
    m.el.querySelector('#cvu-ok').onclick = () => {
      const t = m.el.querySelector('#cvu-pct').value.trim(), note = m.el.querySelector('#cvu-note').value.trim(), e = m.el.querySelector('#cvu-err');
      if (!/^\d{1,3}$/.test(t) || Number(t) > 100) { e.textContent = 'Hoàn thành là số nguyên từ 0 đến 100.'; return; }
      const pct = Number(t), data = { pct, doneAt: pct >= 100 ? D.sxToday : null };
      const own = U.created.find((y) => y.code === code);
      if (own) Object.assign(own, data); else U.edit[code] = Object.assign(U.edit[code] || {}, data);
      (U.log[code] = U.log[code] || []).push([nowStamp(), pid(), pct, note]);
      persist(); m.close();
      toast('<b>Thành công</b><br>Cập nhật tiến độ thành công!');
      rerender();
    };
  }

  /* ---------- Sự kiện ---------- */
  /* Xoá nằm trong dòng có data-go: bắt ở pha capture để không mở chi tiết. */
  document.addEventListener('click', async (e) => {
    const del = e.target.closest && e.target.closest('[data-sxcv-del]');
    if (!del) return;
    e.stopPropagation(); e.preventDefault();
    const x = byCode(del.dataset.sxcvDel);
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa công việc: ${x.title} không?`, hl: x.title, cancel: 'Hủy', ok: 'Xoá' });
    if (!yes) return;
    U.del.push(x.code); U.created = U.created.filter((y) => y.code !== x.code);
    persist();
    toast('<b>Thành công</b><br>Xoá công việc thành công');
    rerender();
  }, true);
  /* Cập nhật tiến độ: nút có thể nằm trong dòng có data-go (Việc của tôi) — bắt ở pha capture để không mở chi tiết. */
  document.addEventListener('click', (e) => {
    const u = e.target.closest && e.target.closest('[data-sxcv-upd]');
    if (!u) return;
    e.stopPropagation(); e.preventDefault();
    updDlg(u.dataset.sxcvUpd);
  }, true);
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sxcv-tile],[data-sxcv-import],[data-sxcv-export],[data-sxcv-plan]');
    if (!t) return;
    if (t.dataset.sxcvTile) {
      const [kind, tile] = t.dataset.sxcvTile.split('|');
      TILE[kind] = TILE[kind] === tile && !t.dataset.go ? 'all' : tile;
      const L = K().LST[ID(kind)]; if (L) L.page = 1;
      if (!t.dataset.go) rerender();
      return;
    }
    if (t.dataset.sxcvPlan) {
      const p = t.dataset.sxcvPlan.split('|')[0], L = K().LST[ID('DV')];
      TILE.DV = 'all';
      if (L) { L.adv = true; L.f = Object.assign(L.empty(), { project: p }); L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
      return;
    }
    if (t.dataset.sxcvImport) { importDlg(t.dataset.sxcvImport); return; }
    if (t.dataset.sxcvExport) { exportList(t.dataset.sxcvExport); return; }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest && e.target.closest('[data-sxcv-form]');
    if (!f) return;
    e.preventDefault(); save();
  });

  /* Router con: parts sau 'cong-viec'. */
  function route(parts) {
    const [a, b] = parts;
    if (a === 'ca-nhan') return window.SxFlow.route(['viec-cua-toi']); // Việc cá nhân gộp vào Việc của tôi
    if (a === 'don-vi') return list('DV');
    if (a === 'create') return form(null);
    if (a && b === 'edit') return form(decodeURIComponent(a));
    if (a) return detail(decodeURIComponent(a));
    return list('CN');
  }
  function enter(parts) {
    if (parts[0] !== 'cong-viec') return;
    const [, a, b, c, d] = parts;
    if (a === 'create') resetForm({ kind: b, project: c === 'du-an' ? decodeURIComponent(d) : null, plan: c === 'du-an' && parts[5] ? decodeURIComponent(parts[5]) : null, parent: c === 'cha' ? decodeURIComponent(d) : null });
    else if (a && b === 'edit') resetForm({ code: decodeURIComponent(a) });
    else if (a && a !== 'ca-nhan' && a !== 'don-vi') K().setTab(tabKey(decodeURIComponent(a)), 'info');
  }
  /* Mục sidebar đang chọn cho route chi tiết / thêm mới: theo loại công việc. */
  function activePath(r) {
    const parts = r.split('/').slice(2);
    if (parts[0] === 'ca-nhan') return 'sx/viec-cua-toi';
    if (parts[0] === 'don-vi') return null;
    if (parts[0] === 'create') return listHref(parts[1] === 'DV' ? 'DV' : 'CN');
    const x = parts[0] && byCode(decodeURIComponent(parts[0]));
    return listHref(x ? x.kind : 'CN');
  }
  function reset() { U = blank(); persist(); Object.keys(TILE).forEach((k) => delete TILE[k]); }

  /* Số việc chưa hoàn thành người đang đăng nhập xem được (số đỏ ở menu Việc cá nhân). */
  const openCount = (kind) => base(kind).filter((x) => !x.done).length;
  /* Việc của tôi (góp ý 26/11): công việc từ Kế hoạch giao cho tôi — nhiệm vụ đơn vị, việc cá nhân, công việc con mà tôi là người thực hiện / đầu mối. */
  const myRows = (id) => all().filter((x) => x.owner === id);
  const openMine = (id) => myRows(id || pid()).filter((x) => !x.done).length;
  /* Chia công việc con: việc từ Kế hoạch chưa xong, người thực hiện / đầu mối hoặc người giao. */
  const canSplit = (x) => !x.done && (isAdmin() || x.owner === pid() || x.assigner === pid());
  /* PASXKD được lập dự án → gắn dự án vào nhiệm vụ (sx-du-an.js save). */
  function linkProject(code, project) {
    const own = U.created.find((y) => y.code === code);
    if (own) own.project = project; else U.edit[code] = Object.assign(U.edit[code] || {}, { project });
    persist();
  }
  window.SxCv = { linkProject, openCount, route, enter, reset, all, byCode, activePath, planProgress, planCell, fromPlan, remindCount, remindBar, reminders, stOf, myRows, openMine, canSplit, canUpdate, canEdit, canDel, KIND };
})();
