/* Tổng quan + Báo cáo theo Backlog W1_T10 (T16 B3, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2k) — màn tĩnh (D-17).
   Khuôn: repo-khcn-hr-tools-fe features/reporting/report-dashboard (khối lọc trắng, tiêu đề 22px, biểu đồ vẽ bằng phần tử thường như
   monthly-allocation-chart / cpnc-usage-chart, bảng có "Xuất báo cáo") + app-tabs; ô chỉ số theo ô của ecat common-catalog/overview.
   S4: mọi số liệu tính từ cùng dữ liệu nghiệp vụ của prototype (ĐXMS, KĐT, KHLCNT, gói thầu, hợp đồng, Giám sát tiến trình).
   SCR-92 #/tong-quan, SCR-93 #/bao-cao/<nhóm>. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, toast, pager } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => S.head(o);
  const K = () => window.Thau.kit;
  const HD = () => window.HopDong;
  const r2 = (n) => Math.round(n * 100) / 100;
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const yearOf = (s) => String(s || '').split('/')[2] || '';
  const KIND = { DXMS: 'ĐXMS', KDT: 'Khoản đầu tư', KHLCNT: 'KHLCNT', GOI: 'Gói thầu', HD: 'Hợp đồng' };
  const GRP = { run: 'Đang xử lý', done: 'Hoàn thành', stop: 'Dừng / huỷ' };
  /* Bảng màu biểu đồ: 4 ô đầu của bảng categorical tham chiếu (skill dataviz, validator PASS; tương phản thấp → luôn in nhãn số). */
  const C = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'];

  /* ---------- Dữ liệu hợp nhất ---------- */
  function facts() {
    const cases = S.allCases(), cat = K().cat;
    const dx = Flow.dxmsAll().map((x) => {
      const m = S.dxmsMeta(x, cases), nv = D.nvOf(x.nv) || {};
      return { kind: 'DXMS', code: x.code, title: x.title, href: 'dxms/' + encodeURIComponent(x.code), unit: x.unit, field: nv.field || 'KHAC', fund: nv.fund || 'CPTX',
        st: S.DXMS_STATUS[m.state][0], grp: m.state === 'OK' ? 'done' : m.state === 'STOP' ? 'stop' : 'run', value: m.value, date: x.created, adj: m.hs.some((c) => c.kind === 'DC'), approved: m.state === 'OK' || m.approved };
    });
    const kd = Flow.kdtAll().map((x) => {
      const m = window.Kdt.meta(x);
      return { kind: 'KDT', code: x.code, title: x.title, href: 'kdt/' + encodeURIComponent(x.code), unit: x.unit, field: x.field, fund: x.type === 'KHCN' ? 'KHCN' : x.type === 'TBNB' ? 'DTPT' : 'SXKD',
        st: window.Kdt.KDT_STAGE[m.stage][0], grp: m.stage === 'OK' ? 'done' : m.stage === 'STOP' ? 'stop' : 'run', value: m.value, date: x.created, type: x.type, nature: x.nature, group: m.group || 'Chưa phân luồng', approved: m.approved, stage: m.stage };
    });
    const src = (kind, code) => (kind === 'KDT' ? kd : dx).find((x) => x.code === code) || {};
    const T = window.Thau;
    const kh = T.khAll().map((k) => {
      const s = src(k.src[0], k.src[1]), gs = T.pkgsOf(k);
      return { kind: 'KHLCNT', code: k.code, title: k.title, href: 'khlcnt/' + encodeURIComponent(k.code), unit: s.unit, field: s.field, fund: s.fund, st: T.KH_ST[k.st][0],
        grp: k.st === 'OK' ? 'done' : 'run', value: r2(gs.reduce((a, g) => a + g.price, 0)), n: gs.length, date: k.created, adj: (k.versions || []).length > 1 || k.st === 'ADJ', srcCode: k.src[1], srcDate: s.date };
    });
    const gt = T.PK.map((g) => {
      const r = T.pkRow(g), k = kh.find((x) => x.code === g.kh) || {}, win = g.winner && (g.bidders || []).find((b) => b[0] === g.winner);
      const kn = (g.events || []).filter((e) => /Kiến nghị/.test(e[0]));
      return { kind: 'GOI', code: g.code, title: g.name, href: 'goi-thau/' + encodeURIComponent(g.code), unit: k.unit, field: k.field, fund: k.fund, st: T.PK_ST[r.stx][0], stx: r.stx,
        grp: r.stx === 'KQ' ? 'done' : r.stx === 'HUY' ? 'stop' : 'run', value: g.price, win: win ? win[1] : null, winner: g.winner || (g.assignee ? null : null), assignee: g.assignee, form: g.form, type: g.type, method: g.method, online: g.online,
        kn: kn.length, knOpen: kn.filter((e) => !/Đã giải quyết/.test(e[3])).length, knEv: kn, adj: k.adj, date: k.date, kq: g.kq, start: g.start, kh: g.kh, srcDate: k.srcDate, bidders: g.bidders || [] };
    });
    const hd = HD().all().map((h) => {
      const g = h.pkg && gt.find((x) => x.code === h.pkg);
      return { kind: 'HD', code: h.code, title: h.title, href: 'hop-dong/' + encodeURIComponent(h.code), unit: h.unit, field: g ? g.field : 'VTCNTT', fund: g ? g.fund : 'DTPT', st: HD().HD_ST[h.st][0], stc: h.st,
        grp: h.st === 'DONG' ? 'done' : h.st === 'CD' ? 'stop' : 'run', value: h.value, cap: h.cap, paid: HD().paidSum(h), remain: HD().remain(h), adv: HD().advOf(h), type: h.type, esign: h.esign, signed: !!h.sign,
        prog: HD().prog(h)[0], eff: HD().eff(h)[0], date: h.sign || h.created, ncc: h.ncc, late: HD().lateMs(h), end: h.end, pays: h.pays || [], h };
    });
    return { dx, kd, kh, gt, hd, all: [].concat(dx, kd, kh, gt, hd) };
  }

  /* Hồ sơ quá hạn: Giám sát tiến trình (trạng thái Quá hạn); số ngày quá hạn = ngày làm việc từ hạn bước (ngày nhận + SLA bước) đến ngày dữ liệu. */
  function wd(a, b) { const p = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d); }; let n = 0; const x = p(a), e = p(b); while (x < e) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) n += 1; } return n; }
  function overdue() {
    const cases = S.allCases().concat(Flow.kdtCases());
    return window.QuyTrinh.monitorRows().filter((r) => r.status === 'Quá hạn').map((r) => {
      const c = cases.find((x) => x.code === r.code) || {};
      const obj = c.kdt ? Flow.findKdt(c.kdt) : c.dxms ? Flow.findDxms(c.dxms) : null;
      const flow = (c.flow || '').startsWith('MS13') || c.kdt ? 'MS13' : 'MS01';
      const sla = Math.max(1, Math.ceil(((D.flows[flow] || {})[c.task] || {}).nlv * 2 || 1));
      const since = c.live ? Flow.dateOf(Math.min(...Flow.state.tokens.map((t) => t.since))) : c.updated || r.updated;
      return { kind: c.kdt ? 'KDT' : 'DXMS', code: r.code, href: r.href, title: c.title || (obj || {}).title || '', step: r.step || '-', proc: r.proc, unit: (obj || {}).unit || '-',
        who: c.live ? [...new Set(Flow.state.tokens.map((t) => window.UI.persona(t.who).name))].join(', ') : c.creator || '-', since, days: Math.max(1, wd(since, HD().TODAY) - sla) };
    });
  }

  /* ---------- Biểu đồ (phần tử thường, như hr-tools report-dashboard) ---------- */
  const fmtN = (v, money) => (money ? ty(v, 2) : String(v));
  /* Cột dọc: lưới đứt nét, nhãn số trên cột (monthly-allocation-chart). items: [{label, value, drill}] */
  function vbars(title, items, o) {
    const max = Math.max(1, ...items.map((x) => x.value));
    return `<section class="bc-card"><h3 class="bc-t">${esc(title)}</h3>
      <div class="bc-v"><div class="bc-grid">${[0, 1, 2, 3, 4].map(() => '<span></span>').join('')}</div>
        <div class="bc-cols" style="grid-template-columns:repeat(${items.length || 1},minmax(0,1fr))">${items.map((x) => `<div class="bc-col">
          <span class="bc-n">${fmtN(x.value, o && o.money)}</span><span class="bc-bar ${x.drill ? 'click' : ''}" style="height:${Math.max(x.value ? 2 : 0, x.value / max * 100)}%;background:${C[0]}" ${x.drill ? `data-drill="${esc(x.drill)}"` : ''} data-tip="${esc(x.label)}: ${fmtN(x.value, o && o.money)}${o && o.unit ? ' ' + o.unit : ''}"></span></div>`).join('')}</div></div>
      <div class="bc-xl" style="grid-template-columns:repeat(${items.length || 1},minmax(0,1fr))">${items.map((x) => `<span title="${esc(x.label)}">${esc(x.label)}</span>`).join('')}</div>
      ${o && o.unit ? `<div class="bc-leg"><span class="sw" style="background:${C[0]}"></span>${esc(o.legend || title)} (${esc(o.unit)})</div>` : ''}</section>`;
  }
  /* Thanh ngang: nhãn trái, thanh, giá trị (cpnc-usage-chart). */
  function hbars(title, items, o) {
    const max = Math.max(1, ...items.map((x) => x.value));
    const body = items.length ? items.map((x) => `<div class="bc-hr ${x.drill ? 'click' : ''}" ${x.drill ? `data-drill="${esc(x.drill)}"` : ''}>
        <span class="bc-hl" title="${esc(x.label)}">${esc(x.label)}</span>
        <span class="bc-ht"><span class="bc-hb" style="width:${x.value / max * 100}%;background:${x.color || C[0]}" data-tip="${esc(x.label)}: ${fmtN(x.value, o && o.money)}${o && o.unit ? ' ' + o.unit : ''}"></span></span>
        <span class="bc-hv num">${fmtN(x.value, o && o.money)}${x.sub ? `<span class="bc-sub">${esc(x.sub)}</span>` : ''}</span></div>`).join('') : '<div class="empty-t">Không có dữ liệu</div>';
    return `<section class="bc-card"><h3 class="bc-t">${esc(title)}</h3><div class="bc-h">${body}</div>${o && o.unit ? `<div class="bc-unit">ĐVT: ${esc(o.unit)}</div>` : ''}</section>`;
  }
  /* Thanh 100% hai phần (tỷ lệ số hoá): khe 2px giữa phần, chú giải + nhãn %. */
  function stack(title, parts) {
    const tot = parts.reduce((a, p) => a + p.value, 0) || 1;
    return `<section class="bc-card"><h3 class="bc-t">${esc(title)}</h3>
      <div class="bc-stack" role="img" aria-label="${esc(parts.map((p) => `${p.label} ${Math.round(p.value / tot * 100)}%`).join(', '))}">${parts.map((p, i) => p.value ? `<span style="flex:${p.value};background:${C[i]}" data-tip="${esc(p.label)}: ${p.value} (${Math.round(p.value / tot * 100)}%)"></span>` : '').join('')}</div>
      <ul class="bc-legend">${parts.map((p, i) => `<li><span class="sw" style="background:${C[i]}"></span>${esc(p.label)}: <b class="num">${p.value}</b> (${Math.round(p.value / tot * 100)}%)</li>`).join('')}</ul></section>`;
  }
  /* Ô chỉ số theo ô của ecat common-catalog/overview. */
  const tile = (label, value, sub, go) => `<${go ? `a class="ov-tile rp-tile" href="#/${go}" data-go="${go}"` : 'div class="ov-tile rp-tile"'}>
      <span class="ov-tx"><span class="t">${esc(label)}</span>${sub ? `<span class="d">${esc(sub)}</span>` : ''}</span><span class="ov-n"><span class="n num">${value}</span></span></${go ? 'a' : 'div'}>`;
  const countBy = (rows, key, labels, order) => {
    const m = new Map((order || []).map((k) => [k, 0]));
    rows.forEach((r) => { const k = typeof key === 'function' ? key(r) : r[key]; m.set(k, (m.get(k) || 0) + 1); });
    return [...m.entries()].map(([k, v]) => ({ key: k, label: labels ? labels(k) : k, value: v }));
  };
  const sumBy = (rows, key, labels) => {
    const m = new Map();
    rows.forEach((r) => { const k = typeof key === 'function' ? key(r) : r[key]; m.set(k, r2((m.get(k) || 0) + (r.value || 0))); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ key: k, label: labels ? labels(k) : k, value: v }));
  };
  const pct = (a, b) => (b ? Math.round(a / b * 100) : 0);

  /* ---------- Bộ lọc chung (khối lọc trắng của report-dashboard) ---------- */
  const emptyF = () => ({ year: null, from: '', to: '', unit: null, field: null, fund: null, kind: [], st: [] });
  const FL = {};
  const fst = (id) => (FL[id] = FL[id] || { f: emptyF(), d: emptyF(), at: '07/10/2026 08:00' });
  function statusOpts(kinds, fx) {
    if (kinds.length === 1) return [...new Set(fx.all.filter((x) => x.kind === kinds[0]).map((x) => x.st))].map((s) => ({ value: s, label: s }));
    return Object.entries(GRP).map(([value, label]) => ({ value, label }));
  }
  function applyF(rows, f) {
    return rows.filter((x) => (!f.year || yearOf(x.date) === f.year) && (!f.from || dk(x.date) >= dk(f.from)) && (!f.to || dk(x.date) <= dk(f.to))
      && (!f.unit || x.unit === f.unit) && (!f.field || x.field === f.field) && (!f.fund || x.fund === f.fund) && (!f.kind.length || f.kind.includes(x.kind))
      && (!f.st.length || f.st.includes(x.st) || f.st.includes(x.grp)));
  }
  function filterBar(id, fx, o) {
    const L = fst(id), d = L.d;
    const set = (k) => (v) => { d[k] = v; if (k === 'kind') d.st = []; rerender(); };
    const sel = (k, label, opts, extra) => `<div class="vfield rp-f"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: `rp-${id}-${k}`, value: d[k], clear: true, searchable: true, placeholder: 'Tất cả', options: opts, onChange: set(k) }, extra))}</div>`;
    const units = [...new Set(fx.all.map((x) => x.unit).filter(Boolean))].sort();
    const kinds = o.kinds || [];
    return `<section class="rp-filter" data-rp="${id}">
      ${sel('year', 'Năm', ['2026', '2025'].map((y) => ({ value: y, label: 'Năm ' + y })), { searchable: false, placeholder: 'Tất cả các năm' })}
      <div class="vfield rp-f sm"><div class="lr"><label>Từ ngày</label></div><input class="vctl" data-rpf="${id}:from" placeholder="DD/MM/YYYY" value="${esc(d.from)}"></div>
      <div class="vfield rp-f sm"><div class="lr"><label>Đến ngày</label></div><input class="vctl" data-rpf="${id}:to" placeholder="DD/MM/YYYY" value="${esc(d.to)}"></div>
      ${sel('unit', 'Đơn vị', units.map((u) => ({ value: u, label: u })))}
      ${sel('field', 'Lĩnh vực', K().catOpts('linh-vuc'), { searchable: false })}
      ${o.fund ? sel('fund', 'Nguồn kinh phí', K().catOpts('nguon-von'), { searchable: false }) : ''}
      ${o.kindSel ? sel('kind', 'Loại nghiệp vụ', Object.entries(KIND).map(([value, label]) => ({ value, label })), { multi: true, searchable: false }) : ''}
      ${o.noStatus ? '' : sel('st', 'Trạng thái', statusOpts(o.kindSel ? d.kind : kinds, fx), { multi: true, searchable: false })}
      <div class="rp-acts"><button type="button" class="vbtn secondary" data-rpa="${id}:reset">Làm mới</button><button type="button" class="vbtn primary" data-rpa="${id}:go">Tìm kiếm</button></div></section>`;
  }

  /* ---------- SCR-92 Tổng quan ---------- */
  const TQ = { tab: 'kpi' };
  function tongQuan() {
    // Theo: fe/repo-khcn-hr-tools-fe/src/app/features/reporting/report-dashboard/report-dashboard.component.html (khối lọc + biểu đồ) + app-tabs; ô chỉ số theo ecat common-catalog/overview
    const fx = facts(), L = fst('tq'), f = L.f;
    const A = applyF(fx.all, f);
    const of = (k) => A.filter((x) => x.kind === k);
    const dx = of('DXMS'), kd = of('KDT'), kh = of('KHLCNT'), gt = of('GOI'), hd = of('HD');
    const sumV = (a) => r2(a.reduce((s, x) => s + (x.value || 0), 0));
    const od = overdue().filter((o) => (!f.unit || o.unit === f.unit) && (!f.kind.length || f.kind.includes(o.kind)));
    const lateHd = hd.filter((h) => h.late.length);
    const gtLate = gt.filter((g) => g.grp === 'run' && g.stx !== 'KH' && /Quý III\/2026|Quý II\/2026/.test(g.start));
    const kn = gt.filter((g) => g.knOpen);
    const info = {
      scr: 'SCR-92', name: 'Tổng quan', uc: 'Backlog W1_T10 › Tổng quan (dòng 2–46)',
      notes: [
        'Khuôn report-dashboard của repo-khcn-hr-tools-fe: khối lọc (Làm mới / Tìm kiếm), tiêu đề khối 22px, biểu đồ vẽ bằng phần tử thường (cột dọc lưới đứt nét, thanh ngang có nhãn số) + app-tabs cho 7 nhóm chỉ số. Ô chỉ số theo ô của Tổng quan Danh mục dùng chung (ecat overview), bấm mở danh sách / báo cáo tương ứng.',
        'Số liệu do API tổng hợp của BE tính trên dữ liệu nghiệp vụ (ĐXMS, KĐT, KHLCNT, gói thầu, hợp đồng) và trạng thái điều phối Camunda (quá hạn); "Làm mới dữ liệu" gọi lại API, "Cập nhật lúc" là thời điểm tổng hợp gần nhất. Lọc đơn vị theo phạm vi quyền người dùng.',
        'Lĩnh vực, nguồn kinh phí của ĐXMS lấy theo Nhiệm vụ / Đề tài, dự án làm căn cứ; KHLCNT / gói thầu kế thừa từ đối tượng nguồn. Giá trị thanh toán phụ thuộc MS24 / SAP.',
        'Lọc Trạng thái: chọn đúng một loại nghiệp vụ thì lọc theo trạng thái của loại đó; nhiều loại thì theo nhóm Đang xử lý / Hoàn thành / Dừng, huỷ.',
      ],
      src: 'hr-tools reporting/report-dashboard · /reporting',
    };
    const tabsL = [['kpi', 'Chỉ số tổng quan'], ['td', 'Tiến độ nghiệp vụ'], ['gt', 'Phân tích giá trị'], ['dt', 'Phân tích đấu thầu'], ['hd', 'Phân tích hợp đồng'], ['tt', 'Thanh toán'], ['cb', 'Cảnh báo']];
    const paid = r2(hd.reduce((s, h) => s + h.paid, 0)), remain = r2(hd.reduce((s, h) => s + h.remain, 0));
    const body = {
      kpi: () => `<div class="rp-tiles">
          ${tile('Tổng số ĐXMS', dx.length, 'Trong phạm vi lọc', 'dxms')}${tile('Giá trị ĐXMS', ty(sumV(dx), 2), 'tỷ đồng', 'bao-cao/dxms')}
          ${tile('Tổng số khoản đầu tư', kd.length, 'Trong phạm vi lọc', 'kdt')}${tile('Tổng mức vốn khoản đầu tư', ty(sumV(kd), 2), 'tỷ đồng', 'bao-cao/kdt')}
          ${tile('Tổng số KHLCNT', kh.length, 'Kế hoạch lựa chọn nhà thầu', 'khlcnt')}${tile('Tổng số gói thầu', gt.length, 'Thuộc các KHLCNT', 'goi-thau')}
          ${tile('Tổng giá gói thầu đã duyệt', ty(sumV(gt.filter((g) => g.stx !== 'KH')), 2), 'tỷ đồng — KHLCNT đã phê duyệt', 'bao-cao/lcnt')}${tile('Tổng số hợp đồng', hd.length, 'Hình thành từ KQLCNT và dữ liệu cũ', 'hop-dong')}
          ${tile('Tổng giá trị hợp đồng', ty(sumV(hd), 2), 'tỷ đồng', 'bao-cao/hop-dong')}${tile('Giá trị đã thanh toán', ty(paid, 2), 'tỷ đồng — theo MS24 / SAP', 'bao-cao/hop-dong')}
          ${tile('Giá trị còn phải thanh toán', ty(remain, 2), 'tỷ đồng', 'bao-cao/hop-dong')}${tile('Hồ sơ / công việc quá hạn', od.length + lateHd.length, `${od.length} hồ sơ quy trình, ${lateHd.length} hợp đồng`, 'bao-cao/tien-do')}</div>`,
      td: () => {
        const by = (rows) => countBy(rows, 'st').map((x) => ({ label: x.label, value: x.value }));
        const fun = [['ĐXMS', fx.dx.length], ['ĐXMS đã phê duyệt', fx.dx.filter((x) => x.approved).length], ['KHLCNT', fx.kh.length], ['Gói thầu', fx.gt.length], ['Gói thầu có KQLCNT', fx.gt.filter((g) => g.stx === 'KQ').length], ['Hợp đồng', fx.hd.length], ['Hợp đồng đã ký', fx.hd.filter((h) => h.signed).length]]
          .map(([label, value]) => ({ label, value: applyF(fx.all, f).length ? value : 0 }));
        return `<h2 class="rp-h2">Theo dõi xuyên suốt vòng đời</h2>${hbars('Từ nhu cầu đến hợp đồng (số lượng)', fun)}
          <h2 class="rp-h2">Số lượng theo trạng thái</h2><div class="rp-g2">${hbars('ĐXMS theo trạng thái', by(dx))}${hbars('Khoản đầu tư theo trạng thái', by(kd))}${hbars('KHLCNT theo trạng thái', by(kh))}${hbars('Gói thầu theo trạng thái', by(gt))}${hbars('Hợp đồng theo trạng thái', by(hd))}</div>`;
      },
      gt: () => {
        const cat = K().cat, inv = dx.concat(kd);
        return `<div class="rp-g2">${hbars('Giá trị đầu tư / mua sắm theo đơn vị', sumBy(inv, 'unit'), { money: true, unit: 'tỷ đồng' })}
          ${hbars('Giá trị theo lĩnh vực', sumBy(inv, 'field', (k) => cat('linh-vuc', k)).map((x) => Object.assign(x, { sub: `${inv.filter((i) => i.field === x.key).length} đối tượng` })), { money: true, unit: 'tỷ đồng' })}
          ${hbars('Giá trị theo nguồn kinh phí', sumBy(inv, 'fund', (k) => cat('nguon-von', k)), { money: true, unit: 'tỷ đồng' })}
          ${hbars('Giá trị theo loại khoản đầu tư', sumBy(kd, 'type', (k) => cat('loai-kdt', k)), { money: true, unit: 'tỷ đồng' })}</div>`;
      },
      dt: () => {
        const cat = K().cat, withKq = gt.filter((g) => g.kq && g.srcDate);
        const avg = withKq.length ? Math.round(withKq.reduce((s, g) => s + Math.abs(HD().days(g.srcDate, g.kq[1])), 0) / withKq.length) : 0;
        return `<div class="rp-tiles">${tile('Tỷ lệ gói thầu phát sinh kiến nghị', pct(gt.filter((g) => g.kn).length, gt.length) + '%', `${gt.filter((g) => g.kn).length}/${gt.length} gói`)}
            ${tile('Tỷ lệ gói thầu điều chỉnh KHLCNT', pct(gt.filter((g) => g.adj).length, gt.length) + '%', `${gt.filter((g) => g.adj).length}/${gt.length} gói — so với KHLCNT ban đầu`)}
            ${tile('Thời gian trung bình xử lý mua sắm', avg + ' ngày', `Từ lập đối tượng nguồn đến KQLCNT · ${withKq.length} gói`)}</div>
          <div class="rp-g2">${hbars('Gói thầu theo hình thức lựa chọn nhà thầu', countBy(gt, 'form', (k) => cat('hinh-thuc-lcnt', k)).sort((a, b) => b.value - a.value))}
          ${hbars('Gói thầu theo loại gói thầu', countBy(gt, 'type', (k) => cat('loai-goi-thau', k)).sort((a, b) => b.value - a.value))}
          ${stack('Gói thầu qua mạng / không qua mạng', [{ label: 'Qua mạng', value: gt.filter((g) => g.online).length }, { label: 'Không qua mạng', value: gt.filter((g) => !g.online).length }])}</div>`;
      },
      hd: () => {
        const cat = K().cat, sg = hd.filter((h) => h.signed);
        return `<div class="rp-g2">${hbars('Hợp đồng theo loại hợp đồng', countBy(hd, 'type', (k) => cat('loai-hop-dong', k)))}
          ${hbars('Hợp đồng theo trạng thái thực hiện', countBy(hd, 'st'))}
          ${stack('Tỷ lệ hợp đồng ký điện tử (hợp đồng đã ký)', [{ label: 'Ký điện tử (VContract)', value: sg.filter((h) => h.esign).length }, { label: 'Ký giấy', value: sg.filter((h) => !h.esign).length }])}
          ${hbars('Tiến độ thực hiện hợp đồng', countBy(hd.filter((h) => h.prog !== 'Chưa thực hiện'), 'prog', null, ['Đúng tiến độ', 'Chậm tiến độ', 'Hoàn thành']))}</div>`;
      },
      tt: () => {
        const rows = hd.filter((h) => h.signed);
        const cap = r2(rows.reduce((s, h) => s + h.cap, 0)), pd = r2(rows.reduce((s, h) => s + h.paid, 0));
        return `<div class="rp-tiles">${tile('Tỷ lệ thanh toán thực tế / giá gói thầu', pct(pd, cap) + '%', `${ty(pd, 2)} / ${ty(cap, 2)} tỷ đồng · KPI quy chế LCNT`)}</div>
          ${K().card('Thanh toán theo hợp đồng', K().table([['Mã hợp đồng', 150], ['Tên hợp đồng', 320], ['Giá gói thầu (tỷ đồng)', 160, 'r'], ['Giá trị hợp đồng', 150, 'r'], ['Đã thanh toán', 150, 'r'], ['Tỷ lệ / giá gói', 130, 'r']], rows,
            (h) => `<td><a class="link" data-go="${h.href}">${esc(h.code)}</a></td><td>${K().clamp(h.title)}</td><td class="r num">${ty(h.cap, 2)}</td><td class="r num">${ty(h.value, 2)}</td><td class="r num">${ty(h.paid, 2)}</td><td class="r num">${pct(h.paid, h.cap)}%</td>`), 'Phụ thuộc dữ liệu MS24 / SAP')}`;
      },
      cb: () => `${K().card('Danh sách hồ sơ quá hạn', K().table([['Mã hồ sơ', 150], ['Loại', 120], ['Tên', 300], ['Bước đang xử lý', 280], ['Đơn vị', 200], ['Số ngày quá hạn', 140, 'r']], od,
          (o) => `<td><a class="link" data-go="${o.href}">${esc(o.code)}</a></td><td>${esc(KIND[o.kind])}</td><td>${K().clamp(o.title)}</td><td>${K().clamp(o.step)}</td><td>${K().clamp(o.unit)}</td><td class="r num">${o.days}</td>`), 'ĐXMS / KĐT theo Giám sát tiến trình')}
        ${K().card('Gói thầu chậm tiến độ', K().table([['Mã gói thầu', 150], ['Tên gói thầu', 320], ['Thời gian bắt đầu LCNT (kế hoạch)', 220], ['Trạng thái', 200, 'c']], gtLate,
          (g) => `<td><a class="link" data-go="${g.href}">${esc(g.code)}</a></td><td>${K().clamp(g.title)}</td><td>${esc(g.start)}</td><td class="c">${badge(g.st, 'warning')}</td>`), 'So với kế hoạch LCNT')}
        ${K().card('Hợp đồng chậm tiến độ', K().table([['Mã hợp đồng', 150], ['Tên hợp đồng', 320], ['Mốc chậm', 320], ['Số ngày chậm', 130, 'r']], lateHd,
          (h) => `<td><a class="link" data-go="${h.href}">${esc(h.code)}</a></td><td>${K().clamp(h.title)}</td><td>${K().clamp(h.late.map((m) => m[0]).join('; '))}</td><td class="r num">${Math.max(...h.late.map((m) => HD().days(m[1], HD().TODAY)))}</td>`), 'So kế hoạch và thực tế')}
        ${K().card('Hồ sơ có kiến nghị / khiếu nại đang xử lý', K().table([['Gói thầu', 150], ['Tên gói thầu', 300], ['Nội dung', 420], ['Trạng thái', 200]], kn,
          (g) => `<td><a class="link" data-go="${g.href}">${esc(g.code)}</a></td><td>${K().clamp(g.title)}</td><td>${K().clamp(g.knEv.filter((e) => !/Đã giải quyết/.test(e[3])).map((e) => e[2]).join(' '))}</td><td>${K().clamp(g.knEv.filter((e) => !/Đã giải quyết/.test(e[3])).map((e) => e[3]).join('; '))}</td>`), 'Ưu tiên hiển thị cho chuyên quản / lãnh đạo')}`,
    };
    return `<div class="pg">${head({ title: 'Tổng quan', info, right: `<span class="rp-at">Cập nhật lúc ${esc(L.at)}</span><button type="button" class="vbtn secondary" data-rp-refresh="tq">${icon('reload')} Làm mới dữ liệu</button>` })}
      ${filterBar('tq', fx, { kindSel: true })}
      <nav class="tabs dx-tabs" role="tablist">${tabsL.map(([k, l]) => `<button type="button" class="tab ${TQ.tab === k ? 'on' : ''}" role="tab" aria-selected="${TQ.tab === k}" data-tqtab="${k}">${l}</button>`).join('')}</nav>
      ${body[TQ.tab]()}</div>`;
  }

  /* ---------- SCR-93 Báo cáo — khuôn chung theo cấu hình ---------- */
  const lk = (r) => `<a class="link" data-go="${r.href}">${esc(r.code)}</a>`;
  const cl = (v) => K().clamp(v);
  const money = (v) => (v == null ? K().dash : ty(v, 2));
  /* Cột chi tiết: [tiêu đề, rộng, căn, html(r), khoá sắp xếp(r), giá trị xuất(r)] */
  const COL = {
    code: ['Mã', 160, '', lk, (r) => r.code, (r) => r.code], kind: ['Loại nghiệp vụ', 140, '', (r) => esc(KIND[r.kind]), (r) => KIND[r.kind], (r) => KIND[r.kind]],
    title: ['Tên', 320, '', (r) => cl(r.title), (r) => r.title, (r) => r.title], unit: ['Đơn vị', 200, '', (r) => cl(r.unit), (r) => r.unit, (r) => r.unit],
    field: ['Lĩnh vực', 160, '', (r) => esc(K().cat('linh-vuc', r.field)), (r) => r.field, (r) => K().cat('linh-vuc', r.field)],
    fund: ['Nguồn kinh phí', 180, '', (r) => esc(K().cat('nguon-von', r.fund)), (r) => r.fund, (r) => K().cat('nguon-von', r.fund)],
    st: ['Trạng thái', 200, 'c', (r) => badge(r.st, r.grp === 'done' ? 'success' : r.grp === 'stop' ? 'default' : 'info'), (r) => r.st, (r) => r.st],
    value: ['Giá trị (tỷ đồng)', 150, 'r', (r) => `<span class="num">${money(r.value)}</span>`, (r) => r.value || 0, (r) => r.value],
    date: ['Ngày', 120, '', (r) => `<span class="num">${esc(r.date)}</span>`, (r) => dk(r.date), (r) => r.date],
  };
  const col = (h, w, a, html, key, out) => [h, w, a, html, key, out || key];
  const REPORTS = {
    'tong-hop': { title: 'Báo cáo tổng hợp', bl: 'Báo cáo tổng hợp (dòng 517–532)', list: [
      { key: 'dtms', title: 'Báo cáo tổng hợp đầu tư mua sắm', fund: true, kindSel: true, rows: (fx) => fx.all,
        metrics: (rs) => Object.entries(KIND).map(([k, l]) => { const a = rs.filter((x) => x.kind === k); return [l, a.length, ty(r2(a.reduce((s, x) => s + (x.value || 0), 0)), 2) + ' tỷ đồng', (r) => r.kind === k]; }),
        groups: [['Tổng hợp theo đơn vị', 'unit'], ['Tổng hợp theo lĩnh vực', 'field', (k) => K().cat('linh-vuc', k)], ['Tổng hợp theo nguồn kinh phí', 'fund', (k) => K().cat('nguon-von', k)]], money: true,
        cols: ['code', 'kind', 'title', 'unit', 'field', 'fund', 'st', 'value', 'date'] },
      { key: 'chuoi', title: 'Báo cáo tiến độ toàn chuỗi ĐTMS', kindSel: true, rows: (fx) => fx.all,
        metrics: (rs, fx) => [['Đang xử lý (tồn đọng)', rs.filter((x) => x.grp === 'run').length, 'hồ sơ chưa hoàn tất', (r) => r.grp === 'run'], ['Hoàn thành', rs.filter((x) => x.grp === 'done').length, '', (r) => r.grp === 'done'],
          ['Dừng / huỷ', rs.filter((x) => x.grp === 'stop').length, '', (r) => r.grp === 'stop'], ['Quá hạn', fx.od.length + rs.filter((x) => x.kind === 'HD' && x.late.length).length, 'theo SLA / mốc', (r) => r.overdue]],
        groups: [['Số lượng theo giai đoạn nghiệp vụ', 'kind', (k) => KIND[k], Object.keys(KIND)], ['Số lượng theo trạng thái xử lý', 'grp', (k) => GRP[k], Object.keys(GRP)]], count: true,
        cols: ['code', 'kind', 'title', 'unit', 'st', col('Quá hạn', 110, 'c', (r) => (r.overdue ? badge('Quá hạn', 'error') : K().dash), (r) => (r.overdue ? 1 : 0), (r) => (r.overdue ? 'Quá hạn' : '')), 'date'] },
    ] },
    dxms: { title: 'Báo cáo ĐXMS', bl: 'Báo cáo ĐXMS (dòng 533–541)', list: [
      { key: 'dxms', title: 'Báo cáo tình hình ĐXMS', kinds: ['DXMS'], fund: true, rows: (fx) => fx.dx,
        metrics: (rs) => [['Tổng số ĐXMS', rs.length, ty(r2(rs.reduce((s, x) => s + x.value, 0)), 2) + ' tỷ đồng', () => true], ['Đã phê duyệt', rs.filter((x) => x.grp === 'done').length, '', (r) => r.grp === 'done'],
          ['Đang xử lý', rs.filter((x) => x.grp === 'run').length, '', (r) => r.grp === 'run'], ['Phát sinh điều chỉnh', rs.filter((x) => x.adj).length, 'hồ sơ MS02', (r) => r.adj]],
        groups: [['Theo trạng thái', 'st'], ['Theo đơn vị đề xuất', 'unit'], ['Theo lĩnh vực', 'field', (k) => K().cat('linh-vuc', k)], ['Theo khoảng giá trị', (r) => (r.value < 20 ? '< 20 tỷ' : r.value < 100 ? '20 – 100 tỷ' : '≥ 100 tỷ'), null, ['< 20 tỷ', '20 – 100 tỷ', '≥ 100 tỷ']]], count: true,
        cols: ['code', 'title', 'unit', 'field', 'st', 'value', 'date'] },
    ] },
    kdt: { title: 'Báo cáo khoản đầu tư', bl: 'Báo cáo Khoản đầu tư (dòng 542–550)', list: [
      { key: 'kdt', title: 'Báo cáo tình hình khoản đầu tư', kinds: ['KDT'], fund: true, rows: (fx) => fx.kd,
        metrics: (rs) => [['Tổng số khoản đầu tư', rs.length, '', () => true], ['Tổng mức vốn', ty(r2(rs.reduce((s, x) => s + x.value, 0)), 2), 'tỷ đồng', () => true], ['Đã phê duyệt chủ trương', rs.filter((x) => x.stage === 'CT_OK').length, 'chờ hồ sơ phê duyệt KĐT', (r) => r.stage === 'CT_OK'],
          ['Đã phê duyệt', rs.filter((x) => x.approved).length, '', (r) => r.approved]],
        groups: [['Theo trạng thái', 'st'], ['Theo đơn vị', 'unit'], ['Theo lĩnh vực', 'field', (k) => K().cat('linh-vuc', k)], ['Theo loại khoản đầu tư', 'type', (k) => K().cat('loai-kdt', k)],
          ['Theo tính chất khoản đầu tư', 'nature', (k) => K().cat('tinh-chat-tai-san', k)], ['Theo nhóm phân loại', 'group']], count: true,
        cols: ['code', 'title', 'unit', 'field', col('Loại KĐT', 160, '', (r) => esc(K().cat('loai-kdt', r.type)), (r) => r.type, (r) => K().cat('loai-kdt', r.type)), col('Nhóm', 120, '', (r) => esc(r.group), (r) => r.group), 'st', 'value', 'date'] },
    ] },
    lcnt: { title: 'Báo cáo lựa chọn nhà thầu', bl: 'Báo cáo lựa chọn nhà thầu (dòng 551–590)', list: [
      { key: 'khlcnt', title: 'Báo cáo KHLCNT', kinds: ['KHLCNT'], rows: (fx) => fx.kh,
        metrics: (rs) => [['Tổng số KHLCNT', rs.length, '', () => true], ['Tổng số gói thầu', rs.reduce((s, x) => s + x.n, 0), '', () => true], ['Tổng giá trị KHLCNT', ty(r2(rs.reduce((s, x) => s + x.value, 0)), 2), 'tỷ đồng', () => true], ['Phát sinh điều chỉnh', rs.filter((x) => x.adj).length, 'so với KHLCNT ban đầu', (r) => r.adj]],
        groups: [['Theo trạng thái', 'st'], ['Theo đơn vị', 'unit']], count: true,
        cols: ['code', 'title', 'unit', col('Số gói thầu', 110, 'r', (r) => r.n, (r) => r.n), 'st', 'value', col('Điều chỉnh', 110, 'c', (r) => (r.adj ? 'Có' : 'Không'), (r) => (r.adj ? 1 : 0), (r) => (r.adj ? 'Có' : 'Không')), 'date'] },
      { key: 'to-chuc', title: 'Báo cáo tình hình tổ chức LCNT', kinds: ['GOI'], rows: (fx) => fx.gt,
        metrics: (rs) => [['Tổng số gói thầu', rs.length, ty(r2(rs.reduce((s, x) => s + x.value, 0)), 2) + ' tỷ đồng', () => true], ['Qua mạng', rs.filter((x) => x.online).length, '', (r) => r.online], ['Không qua mạng', rs.filter((x) => !x.online).length, '', (r) => !r.online],
          ['Chậm tiến độ', rs.filter((x) => x.late).length, 'so với KHLCNT', (r) => r.late]],
        groups: [['Theo trạng thái', 'st'], ['Theo loại gói thầu', 'type', (k) => K().cat('loai-goi-thau', k)], ['Theo hình thức LCNT', 'form', (k) => K().cat('hinh-thuc-lcnt', k)], ['Theo phương thức LCNT', 'method', (k) => K().cat('phuong-thuc-lcnt', k)]], count: true,
        cols: ['code', 'title', col('Hình thức LCNT', 190, '', (r) => esc(K().cat('hinh-thuc-lcnt', r.form)), (r) => r.form, (r) => K().cat('hinh-thuc-lcnt', r.form)), col('Qua mạng', 100, 'c', (r) => (r.online ? 'Có' : 'Không'), (r) => (r.online ? 1 : 0), (r) => (r.online ? 'Có' : 'Không')), 'st', 'value'] },
      { key: 'kq', title: 'Báo cáo kết quả LCNT', kinds: ['GOI'], rows: (fx) => fx.gt.filter((g) => g.stx === 'KQ' || g.stx === 'HUY'),
        metrics: (rs) => { const k = rs.filter((x) => x.stx === 'KQ'); return [['Gói đã có KQLCNT', k.length, '', (r) => r.stx === 'KQ'], ['Tổng giá gói thầu', ty(r2(k.reduce((s, x) => s + x.value, 0)), 2), 'tỷ đồng', (r) => r.stx === 'KQ'],
          ['Tổng giá trúng thầu', ty(r2(k.reduce((s, x) => s + (x.win || x.value), 0)), 2), 'tỷ đồng', (r) => r.stx === 'KQ'], ['Gói thầu bị huỷ', rs.filter((x) => x.stx === 'HUY').length, '', (r) => r.stx === 'HUY']]; },
        groups: [['Theo nhà thầu trúng thầu', (r) => (r.winner ? K().nccName(r.winner) : r.assignee || 'Huỷ thầu')]], count: true,
        cols: ['code', 'title', 'st', 'value', col('Giá trúng thầu', 150, 'r', (r) => `<span class="num">${money(r.win)}</span>`, (r) => r.win || 0, (r) => r.win), col('Nhà thầu / đơn vị thực hiện', 260, '', (r) => cl(r.winner ? K().nccName(r.winner) : r.assignee), (r) => r.winner || '', (r) => (r.winner ? K().nccName(r.winner) : r.assignee))] },
      { key: 'hieu-qua', title: 'Báo cáo hiệu quả LCNT', kinds: ['GOI'], noStatus: true, rows: (fx) => fx.gt.filter((g) => g.kq && g.srcDate).map((g) => Object.assign({}, g, { dur: Math.abs(HD().days(g.srcDate, g.kq[1])) })),
        metrics: (rs) => [['Thời gian trung bình tổ chức LCNT', (rs.length ? Math.round(rs.reduce((s, x) => s + x.dur, 0) / rs.length) : 0) + ' ngày', 'từ lập đối tượng nguồn đến KQLCNT', () => true], ['Số gói cấu thành chỉ tiêu', rs.length, '', () => true]],
        groups: [['Thời gian theo hình thức LCNT (ngày, trung bình)', 'form', (k) => K().cat('hinh-thuc-lcnt', k), null, 'dur']],
        cols: ['code', 'title', col('Hình thức LCNT', 190, '', (r) => esc(K().cat('hinh-thuc-lcnt', r.form)), (r) => r.form, (r) => K().cat('hinh-thuc-lcnt', r.form)), col('Ngày lập nguồn', 130, '', (r) => esc(r.srcDate), (r) => dk(r.srcDate), (r) => r.srcDate), col('Ngày KQLCNT', 130, '', (r) => esc(r.kq[1]), (r) => dk(r.kq[1]), (r) => r.kq[1]), col('Số ngày', 100, 'r', (r) => r.dur, (r) => r.dur)] },
      { key: 'nha-thau', title: 'Báo cáo nhà thầu', noStatus: true, rows: (fx) => {
          const m = new Map();
          fx.gt.forEach((g) => (g.bidders || []).forEach((b) => { const x = m.get(b[0]) || { kind: 'NCC', code: b[0], title: K().nccName(b[0]), href: 'dmdc/nha-cung-cap', join: 0, won: 0, wonV: 0, hd: 0, hist: [], date: g.date, unit: g.unit, field: g.field }; x.join += 1; if (g.winner === b[0] && g.stx === 'KQ') { x.won += 1; x.wonV = r2(x.wonV + b[1]); } x.hist.push(g.code); m.set(b[0], x); }));
          fx.hd.forEach((h) => { const x = m.get(h.ncc) || { kind: 'NCC', code: h.ncc, title: K().nccName(h.ncc), href: 'dmdc/nha-cung-cap', join: 0, won: 0, wonV: 0, hd: 0, hist: [], date: h.date, unit: h.unit, field: h.field }; x.hd += 1; m.set(h.ncc, x); });
          return [...m.values()].map((x) => Object.assign(x, { value: x.wonV })); },
        metrics: (rs) => [['Số nhà thầu', rs.length, '', () => true], ['Lượt tham gia', rs.reduce((s, x) => s + x.join, 0), '', (r) => r.join], ['Lượt trúng thầu', rs.reduce((s, x) => s + x.won, 0), '', (r) => r.won]],
        groups: [['Giá trị trúng thầu theo nhà thầu', 'title', null, null, 'value']], money: true,
        cols: [col('Mã nhà thầu', 140, '', (r) => esc(r.code), (r) => r.code), 'title', col('Số gói tham gia', 130, 'r', (r) => r.join, (r) => r.join), col('Số gói trúng', 120, 'r', (r) => r.won, (r) => r.won),
          col('Giá trị trúng thầu', 150, 'r', (r) => `<span class="num">${money(r.wonV)}</span>`, (r) => r.wonV), col('Số hợp đồng', 110, 'r', (r) => r.hd, (r) => r.hd), col('Lịch sử tham gia', 300, '', (r) => cl(r.hist.join(', ')), (r) => r.hist.length, (r) => r.hist.join(', '))] },
      { key: 'kpi', title: 'Báo cáo KPI hoạt động LCNT', noStatus: true, rows: (fx) => {
          const g = fx.gt, h = fx.hd, sg = h.filter((x) => x.signed), kq = g.filter((x) => x.kq && x.srcDate);
          const cap = r2(sg.reduce((s, x) => s + x.cap, 0)), pd = r2(sg.reduce((s, x) => s + x.paid, 0));
          return [['Thời gian TB từ đề xuất đến KQLCNT / ký HĐ', (kq.length ? Math.round(kq.reduce((s, x) => s + Math.abs(HD().days(x.srcDate, x.kq[1])), 0) / kq.length) : 0) + ' ngày', `${kq.length} gói`],
            ['Tỷ lệ gói thầu thực hiện qua mạng', pct(g.filter((x) => x.online).length, g.length) + '%', `${g.filter((x) => x.online).length}/${g.length} gói`],
            ['Tỷ lệ hợp đồng ký điện tử', pct(sg.filter((x) => x.esign).length, sg.length) + '%', `${sg.filter((x) => x.esign).length}/${sg.length} hợp đồng đã ký`],
            ['Tỷ lệ gói thầu phát sinh kiến nghị / khiếu nại', pct(g.filter((x) => x.kn).length, g.length) + '%', `${g.filter((x) => x.kn).length}/${g.length} gói`],
            ['Tỷ lệ thanh toán thực tế / giá gói thầu', pct(pd, cap) + '%', `${ty(pd, 2)} / ${ty(cap, 2)} tỷ đồng — phụ thuộc MS24 / SAP`],
            ['Tỷ lệ gói thầu điều chỉnh so với KHLCNT ban đầu', pct(g.filter((x) => x.adj).length, g.length) + '%', `${g.filter((x) => x.adj).length}/${g.length} gói`]]
            .map(([title, v, sub], i) => ({ kind: 'KPI', code: 'KPI-0' + (i + 1), title, v, sub, href: 'bao-cao/lcnt', date: '01/01/2026' })); },
        metrics: null, groups: [],
        cols: [col('Mã chỉ tiêu', 120, '', (r) => esc(r.code), (r) => r.code), 'title', col('Giá trị', 120, 'r', (r) => `<b class="num">${esc(r.v)}</b>`, (r) => parseFloat(r.v), (r) => r.v), col('Dữ liệu cấu thành', 360, '', (r) => cl(r.sub), (r) => r.sub)] },
    ] },
    'hop-dong': { title: 'Báo cáo hợp đồng', bl: 'Báo cáo hợp đồng (dòng 591–608)', list: [
      { key: 'tinh-hinh', title: 'Báo cáo tình hình hợp đồng', kinds: ['HD'], rows: (fx) => fx.hd,
        metrics: (rs) => [['Tổng số hợp đồng', rs.length, ty(r2(rs.reduce((s, x) => s + x.value, 0)), 2) + ' tỷ đồng', () => true], ['Đúng tiến độ', rs.filter((x) => x.prog === 'Đúng tiến độ').length, '', (r) => r.prog === 'Đúng tiến độ'],
          ['Chậm tiến độ', rs.filter((x) => x.prog === 'Chậm tiến độ').length, '', (r) => r.prog === 'Chậm tiến độ'], [`Sắp hết hạn (≤ ${HD().warnDays('hd')} ngày)`, rs.filter((x) => x.soon).length, 'ngưỡng theo Trigger thông báo', (r) => r.soon]],
        groups: [['Theo trạng thái', 'st'], ['Theo loại hợp đồng', 'type', (k) => K().cat('loai-hop-dong', k)], ['Theo nhà thầu', (r) => K().nccName(r.ncc)], ['Theo đơn vị', 'unit']], count: true,
        cols: ['code', 'title', col('Nhà thầu', 240, '', (r) => cl(K().nccName(r.ncc)), (r) => r.ncc, (r) => K().nccName(r.ncc)), 'unit', 'st', col('Tiến độ', 140, 'c', (r) => esc(r.prog), (r) => r.prog), 'value', col('Ngày hết hạn', 120, '', (r) => esc(r.end || '-'), (r) => dk(r.end), (r) => r.end)] },
      { key: 'thanh-toan', title: 'Báo cáo thanh toán hợp đồng', kinds: ['HD'], noStatus: true, rows: (fx) => fx.hd,
        metrics: (rs) => { const v = r2(rs.reduce((s, x) => s + x.value, 0)), pd = r2(rs.reduce((s, x) => s + x.paid, 0)); return [['Tổng giá trị hợp đồng', ty(v, 2), 'tỷ đồng', () => true], ['Đã tạm ứng', ty(r2(rs.reduce((s, x) => s + x.adv, 0)), 2), 'tỷ đồng', (r) => r.adv > 0],
          ['Đã thanh toán', ty(pd, 2), 'tỷ đồng', (r) => r.paid > 0], ['Còn phải thanh toán', ty(r2(rs.reduce((s, x) => s + x.remain, 0)), 2), 'tỷ đồng', (r) => r.remain > 0], ['Tỷ lệ thanh toán', pct(pd, v) + '%', '', () => true]]; },
        groups: [['Thanh toán theo thời gian (tháng)', null, null, null, 'pays'], ['Đã thanh toán theo đơn vị', 'unit', null, null, 'paid']], money: true,
        cols: ['code', 'title', 'unit', 'value', col('Đã tạm ứng', 120, 'r', (r) => money(r.adv), (r) => r.adv), col('Đã thanh toán', 130, 'r', (r) => money(r.paid), (r) => r.paid), col('Còn phải thanh toán', 150, 'r', (r) => money(r.remain), (r) => r.remain),
          col('Tỷ lệ', 90, 'r', (r) => pct(r.paid, r.value) + '%', (r) => pct(r.paid, r.value)), col('Số đợt thanh toán', 130, 'r', (r) => r.pays.length, (r) => r.pays.length)] },
    ] },
    'tien-do': { title: 'Báo cáo tiến độ & tồn đọng', bl: 'Báo cáo tiến độ & tồn đọng (dòng 609–621) + KPI xử lý theo bước (comment Figma #11, #16, #20)', list: [
      { key: 'qua-han', title: 'Báo cáo hồ sơ quá hạn', noStatus: true, rows: (fx) => fx.od,
        metrics: (rs) => [['Hồ sơ quá hạn', rs.length, '', () => true], ['Số ngày quá hạn lớn nhất', rs.length ? Math.max(...rs.map((x) => x.days)) : 0, 'ngày làm việc', () => true]],
        groups: [['Theo nghiệp vụ', 'kind', (k) => KIND[k]], ['Theo đơn vị', 'unit'], ['Theo bước xử lý', 'step']], count: true,
        cols: ['code', 'kind', 'title', col('Bước đang xử lý', 280, '', (r) => cl(r.step), (r) => r.step), col('Người / đơn vị đang xử lý', 240, '', (r) => cl(r.who), (r) => r.who), 'unit', col('Ngày nhận', 120, '', (r) => esc(r.since), (r) => dk(r.since), (r) => r.since), col('Số ngày quá hạn', 130, 'r', (r) => r.days, (r) => r.days)] },
      { key: 'kien-nghi', title: 'Báo cáo kiến nghị / khiếu nại', noStatus: true, rows: (fx) => fx.gt.flatMap((g) => g.knEv.map((e, i) => ({ kind: 'GOI', code: g.code, href: g.href, title: g.title, unit: g.unit, field: g.field, date: e[1], content: e[2], stt: e[3], open: !/Đã giải quyết/.test(e[3]), days: Math.max(0, HD().days(e[1], HD().TODAY)), i }))),
        metrics: (rs) => [['Tổng số kiến nghị / khiếu nại', rs.length, '', () => true], ['Đang giải quyết', rs.filter((x) => x.open).length, '', (r) => r.open], ['Đã giải quyết', rs.filter((x) => !x.open).length, '', (r) => !r.open]],
        groups: [['Theo trạng thái xử lý', (r) => (r.open ? 'Đang giải quyết' : 'Đã giải quyết')], ['Theo gói thầu', 'code']], count: true,
        cols: [col('Gói thầu', 150, '', lk, (r) => r.code, (r) => r.code), 'title', col('Ngày nhận', 120, '', (r) => esc(r.date), (r) => dk(r.date), (r) => r.date), col('Nội dung', 380, '', (r) => cl(r.content), (r) => r.content), col('Trạng thái xử lý', 220, '', (r) => cl(r.stt), (r) => r.stt), col('Thời gian xử lý (ngày)', 160, 'r', (r) => r.days, (r) => r.days)] },
      { key: 'kpi-buoc', title: 'Báo cáo KPI xử lý theo bước', noStatus: true, rows: () => kpiSteps(),
        metrics: (rs) => [['Số bước theo dõi', rs.length, 'quy trình MS01.01', () => true], ['Bước vượt KPI', rs.filter((x) => x.avg > x.kpi).length, '', (r) => r.avg > r.kpi], ['Số lần ký cứng', rs.reduce((s, x) => s + x.hard, 0), 'có lý do bắt buộc', (r) => r.hard > 0]],
        groups: [['Thời gian xử lý trung bình theo bước (ngày làm việc)', 'title', null, null, 'avg']],
        cols: [col('Bước', 80, 'c', (r) => esc(r.code), (r) => Number(r.code)), 'title', col('Số hồ sơ', 100, 'r', (r) => r.n, (r) => r.n), col('Thời gian TB (ngày LV)', 170, 'r', (r) => ty(r.avg, 1), (r) => r.avg),
          col('KPI (ngày LV)', 130, 'r', (r) => r.kpi, (r) => r.kpi), col('Đạt KPI', 110, 'c', (r) => (r.avg <= r.kpi ? badge('Đạt', 'success') : badge('Vượt', 'error')), (r) => (r.avg <= r.kpi ? 1 : 0), (r) => (r.avg <= r.kpi ? 'Đạt' : 'Vượt')),
          col('Số vòng trả lại', 130, 'r', (r) => r.rounds, (r) => r.rounds), col('Số ý kiến', 100, 'r', (r) => r.cmt, (r) => r.cmt), col('Số lần ký cứng', 130, 'r', (r) => r.hard, (r) => r.hard)] },
    ] },
  };
  /* KPI theo bước: thống kê lịch sử task Camunda của hồ sơ MS01.01 (thời gian, số vòng trả lại, số ý kiến) + số lần ký cứng ghi ở bước trình ký (vars.hardSigns). */
  function kpiSteps() {
    const F = D.flows.MS01, hard = (Flow.state.vars && Flow.state.vars.hardSigns) || [];
    return [[1, 6, 0.9, 0, 2], [5, 6, 1.6, 0, 1], [8, 5, 1.2, 1, 3], [10, 5, 2.4, 1, 4], [13, 4, 1.1, 2, 9], [19, 4, 3.6, 0, 8], [26, 4, 1.4, 1, 5], [36, 3, 1.0, 0, 2], [46, 3, 2.7, 1, 4], [60, 2, 1.8, 0, 3]]
      .map(([t, n, avg, rounds, cmt]) => ({ kind: 'KPI', code: String(t).padStart(2, '0'), title: Flow.taskName ? (F[t] || {}).name || Flow.taskName(t) : '', href: 'quy-trinh', n, avg, rounds, cmt,
        kpi: Math.max(1, Math.ceil(((F[t] || {}).nlv || 0.5) * 2)), hard: (t === 46 ? 2 : t === 60 ? 1 : 0) + hard.filter((x) => x.task === t).length, date: '01/10/2026' }));
  }

  const RP = {};
  const rst = (id) => (RP[id] = RP[id] || { tab: null, drill: null, sort: null, dir: 1 });
  function report(group) {
    // Theo: fe/repo-khcn-hr-tools-fe/src/app/features/reporting/report-dashboard (khối lọc, biểu đồ, bảng + Xuất báo cáo) + app-tabs cho các báo cáo trong nhóm
    const G = REPORTS[group];
    if (!G) return S.viecCuaToi();
    const R = rst(group);
    if (!G.list.some((x) => x.key === R.tab)) R.tab = G.list[0].key;
    const cfg = G.list.find((x) => x.key === R.tab), id = group + ':' + cfg.key;
    const fx = facts();
    fx.od = overdue();
    fx.all.forEach((x) => { x.overdue = (x.kind === 'HD' && x.late.length) || fx.od.some((o) => (S.allCases().concat(Flow.kdtCases()).find((c) => c.code === o.code) || {})[x.kind === 'KDT' ? 'kdt' : 'dxms'] === x.code && (x.kind === 'DXMS' || x.kind === 'KDT')); });
    fx.hd.forEach((h) => { h.soon = h.end && h.grp === 'run' && HD().dk(h.end) >= HD().dk(HD().TODAY) && HD().days(HD().TODAY, h.end) <= HD().warnDays('hd'); });
    fx.gt.forEach((g) => { g.late = g.grp === 'run' && g.stx !== 'KH' && /Quý III\/2026|Quý II\/2026/.test(g.start); });
    const L = fst(id), f = L.f;
    const rows = applyF(cfg.rows(fx), Object.assign({}, f, cfg.noStatus ? { st: [] } : {}, cfg.key === 'kpi' || cfg.key === 'kpi-buoc' ? { year: null, from: '', to: '' } : {}));
    const ms = cfg.metrics ? cfg.metrics(rows, fx) : null;
    const drill = R.drill && R.drill.id === id ? R.drill : null;
    let det = drill ? rows.filter(drill.fn) : rows.slice();
    if (R.sort != null) { const c = colOf(cfg.cols[R.sort]); det.sort((a, b) => { const x = c[4](a), y = c[4](b); return (x > y ? 1 : x < y ? -1 : 0) * R.dir; }); }
    const lst = K().LST[id] = K().LST[id] || { page: 1, size: 10, psOpen: false };
    const pages = Math.max(1, Math.ceil(det.length / lst.size)); if (lst.page > pages) lst.page = pages;
    const from = (lst.page - 1) * lst.size;
    const charts = (cfg.groups || []).map((gr, gi) => {
      const [title, key, lab, order, val] = gr;
      let items;
      if (val === 'pays') {
        const m = new Map();
        rows.forEach((h) => h.pays.filter((p) => p[7] === 'PAID').forEach((p) => { const k2 = p[8].slice(3); m.set(k2, r2((m.get(k2) || 0) + r2(p[3] - p[4] - p[5] - p[6]))); }));
        items = [...m.entries()].sort((a, b) => dk('01/' + a[0]).localeCompare(dk('01/' + b[0]))).map(([k2, v]) => ({ label: k2, value: v }));
        return vbars(title, items, { money: true, unit: 'tỷ đồng', legend: 'Đã thanh toán' });
      }
      const kf = typeof key === 'function' ? key : (r) => r[key];
      if (val) {
        const m = new Map(), n = new Map();
        rows.forEach((r) => { const k2 = kf(r); m.set(k2, (m.get(k2) || 0) + (r[val] || 0)); n.set(k2, (n.get(k2) || 0) + 1); });
        items = [...m.entries()].map(([k2, v]) => ({ key: k2, label: lab ? lab(k2) : k2, value: r2(val === 'dur' || val === 'avg' ? v / n.get(k2) : v) })).sort((a, b) => b.value - a.value);
      } else items = cfg.count ? countBy(rows, kf, lab, order) : sumBy(rows, kf, lab);
      const isMoney = !cfg.count && !(val === 'dur' || val === 'avg');
      return hbars(title, items.map((x, xi) => Object.assign(x, { drill: `${id}|${gi}|${xi}` })), isMoney ? { money: true, unit: 'tỷ đồng' } : val ? { unit: 'ngày' } : null);
    });
    /* Ghi lại bộ lọc drill-down để bấm thanh / ô chỉ tiêu lọc bảng chi tiết. */
    DR[id] = { groups: (cfg.groups || []).map((gr) => { const kf = typeof gr[1] === 'function' ? gr[1] : (r) => r[gr[1]]; const items = []; const seen = new Set();
      const src = cfg.count ? countBy(rows, kf, gr[2], gr[3]) : null;
      (src || rows.map((r) => ({ key: kf(r), label: gr[2] ? gr[2](kf(r)) : kf(r) }))).forEach((x) => { if (!seen.has(x.key)) { seen.add(x.key); items.push(x); } });
      if (!src && gr[4] !== 'pays') { const m = new Map(); rows.forEach((r) => { const k2 = kf(r); m.set(k2, (m.get(k2) || 0) + (gr[4] ? (r[gr[4]] || 0) : (r.value || 0))) ; }); items.sort((a, b) => (m.get(b.key) || 0) - (m.get(a.key) || 0)); }
      return items.map((x) => ({ label: `${gr[0]}: ${x.label}`, fn: (r) => kf(r) === x.key })); }), metrics: (ms || []).map((m) => ({ label: m[0], fn: m[3] })) };
    const info = {
      scr: 'SCR-93', name: G.title + ' · ' + cfg.title, uc: 'Backlog W1_T10 › Báo cáo › ' + G.bl + '; Tính năng dùng chung báo cáo (dòng 505–516)',
      notes: [
        'Khuôn chung cho mọi báo cáo (report-dashboard của repo-khcn-hr-tools-fe): khối lọc (thời gian năm / khoảng ngày, đơn vị theo phạm vi quyền, lĩnh vực, nguồn kinh phí khi báo cáo hỗ trợ, trạng thái tuỳ báo cáo; Làm mới / Tìm kiếm) → chỉ tiêu tổng hợp → biểu đồ theo chiều nhóm → bảng chi tiết có sắp xếp, phân trang, <b>Xuất báo cáo</b> (Excel theo bộ lọc).',
        '<b>Drill-down</b>: bấm ô chỉ tiêu hoặc thanh biểu đồ để lọc bảng chi tiết; bấm mã để mở đối tượng nghiệp vụ (ĐXMS / KĐT / KHLCNT / gói thầu / hợp đồng).',
        'Mỗi báo cáo = một cấu hình (chỉ tiêu, chiều nhóm, cột chi tiết) trên cùng khuôn; BE cung cấp API báo cáo theo bộ lọc. Số liệu tính từ cùng dữ liệu với các danh sách.',
        cfg.key === 'kpi-buoc' ? 'KPI xử lý theo bước (comment Figma #11, #16, #20): thời gian xử lý, số vòng trả lại, số ý kiến lấy từ lịch sử task Camunda; KPI = SLA bước; số lần ký cứng lấy từ kết quả trình ký (hình thức ký + lý do).' : '',
        cfg.key === 'qua-han' ? 'Quá hạn lấy trạng thái điều phối từ Camunda (Giám sát tiến trình); số ngày quá hạn = ngày làm việc tính từ hạn xử lý bước.' : '',
      ].filter(Boolean),
      q: cfg.key === 'tinh-hinh' ? ['P-80'] : [], src: 'hr-tools reporting/report-dashboard · /reporting',
    };
    const cols = cfg.cols.map(colOf);
    const out = det;
    EX[id] = { title: cfg.title, cols, rows: out };
    return `<div class="pg">${head({ title: G.title, info })}
      ${G.list.length > 1 ? `<nav class="tabs dx-tabs" role="tablist">${G.list.map((x) => `<button type="button" class="tab ${R.tab === x.key ? 'on' : ''}" role="tab" aria-selected="${R.tab === x.key}" data-rptab="${group}:${x.key}">${esc(x.title)}</button>`).join('')}</nav>` : ''}
      ${filterBar(id, fx, { kinds: cfg.kinds || [], kindSel: cfg.kindSel, fund: cfg.fund, noStatus: cfg.noStatus || !cfg.kinds && !cfg.kindSel })}
      ${ms ? `<h2 class="rp-h2">${esc(cfg.title)}</h2><div class="rp-tiles">${ms.map((m, i) => `<button type="button" class="ov-tile rp-tile ${drill && drill.label === m[0] ? 'on' : ''}" data-drill="${id}|m|${i}"><span class="ov-tx"><span class="t">${esc(m[0])}</span>${m[2] ? `<span class="d">${esc(m[2])}</span>` : ''}</span><span class="ov-n"><span class="n num">${m[1]}</span></span></button>`).join('')}</div>` : `<h2 class="rp-h2">${esc(cfg.title)}</h2>`}
      ${charts.length ? `<div class="rp-g2">${charts.join('')}</div>` : ''}
      <section class="flex vcard rp-det"><div class="vcard-h"><h3>${drill ? 'Chi tiết — ' + esc(drill.label) : 'Danh sách chi tiết'}</h3>
          <div class="r">${drill ? `<button type="button" class="vbtn secondary" data-drill-clear="${id}">${icon('x')} Bỏ lọc chi tiết</button>` : ''}<button type="button" class="vbtn secondary" data-rp-export="${id}">${icon('excel')} Xuất báo cáo</button></div></div>
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map((c, i) => `<th class="${c[2] || ''} sortable" style="width:${c[1]}px;min-width:${c[1]}px" data-rpsort="${group}:${i}">${esc(c[0])}<span class="sort">${R.sort === i ? (R.dir > 0 ? '▲' : '▼') : '↕'}</span></th>`).join('')}</tr></thead>
          <tbody>${out.slice(from, from + lst.size).map((r, i) => `<tr><td class="ord">${from + i + 1}</td>${cols.map((c) => `<td class="${c[2] || ''}">${c[3](r)}</td>`).join('')}</tr>`).join('') || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Không có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id, total: out.length, page: lst.page, size: lst.size, open: lst.psOpen })}</section></div>`;
  }
  const colOf = (c) => (typeof c === 'string' ? COL[c] : c);
  const DR = {}, EX = {};

  /* ---------- Sự kiện ---------- */
  function applyFilter(id) { const L = fst(id); L.f = JSON.parse(JSON.stringify(L.d)); Object.keys(RP).forEach((g) => { if (RP[g].drill && RP[g].drill.id === id) RP[g].drill = null; }); if (K().LST[id]) K().LST[id].page = 1; rerender(); }
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-rpf]');
    if (f) { const [g, key, k2] = f.dataset.rpf.split(':'); const id = k2 ? g + ':' + key : g; fst(id).d[k2 || key] = f.value; }
  });
  document.addEventListener('click', (e) => {
    const t = e.target;
    const tq = t.closest('[data-tqtab]');
    if (tq) { TQ.tab = tq.dataset.tqtab; rerender(); return; }
    const rt = t.closest('[data-rptab]');
    if (rt) { const [g, k2] = rt.dataset.rptab.split(':'); rst(g).tab = k2; rst(g).drill = null; rst(g).sort = null; rerender(); return; }
    const a = t.closest('[data-rpa]');
    if (a) { const parts = a.dataset.rpa.split(':'), act = parts.pop(), id = parts.join(':'); if (act === 'reset') { fst(id).d = emptyF(); fst(id).f = emptyF(); } applyFilter(id); return; }
    const rf = t.closest('[data-rp-refresh]');
    if (rf) { const d = new Date(); fst(rf.dataset.rpRefresh).at = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`; toast('<b>Thành công</b><br>Đã cập nhật số liệu Dashboard'); rerender(); return; }
    const dr = t.closest('[data-drill]');
    if (dr && dr.dataset.drill.includes('|')) {
      const [id, gi, xi] = dr.dataset.drill.split('|'), g = id.split(':')[0], src = DR[id];
      if (!src) return;
      const it = gi === 'm' ? src.metrics[Number(xi)] : (src.groups[Number(gi)] || [])[Number(xi)];
      if (!it) return;
      rst(g).drill = { id, label: it.label, fn: it.fn };
      if (K().LST[id]) K().LST[id].page = 1;
      rerender();
      const det = document.querySelector('.rp-det'); if (det) det.scrollIntoView({ block: 'start' });
      return;
    }
    const dc = t.closest('[data-drill-clear]');
    if (dc) { rst(dc.dataset.drillClear.split(':')[0]).drill = null; rerender(); return; }
    const so = t.closest('[data-rpsort]');
    if (so) { const [g, i] = so.dataset.rpsort.split(':'), R = rst(g); if (R.sort === Number(i)) R.dir = -R.dir; else { R.sort = Number(i); R.dir = 1; } rerender(); return; }
    const ex = t.closest('[data-rp-export]');
    if (ex) {
      const x = EX[ex.dataset.rpExport];
      const strip = (v) => String(v == null ? '' : v).replace(/"/g, '""');
      const csv = '﻿' + [['STT'].concat(x.cols.map((c) => c[0]))].concat(x.rows.map((r, i) => [i + 1].concat(x.cols.map((c) => (c[5] || c[4])(r))))).map((l) => l.map((v) => `"${strip(v)}"`).join(',')).join('\n');
      const name = x.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '-') + '.csv';
      try { const u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const l = document.createElement('a'); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000); } catch (err) { /* bỏ qua */ }
      toast(`<b>Thành công</b><br>Xuất báo cáo thành công (${x.rows.length} dòng) — ${esc(name)}`);
    }
  });
  /* Ô Từ ngày / Đến ngày dùng khoá "<id>:<trường>" — id báo cáo có dạng "nhóm:báo cáo". */
  window.BaoCao = { tongQuan, report, REPORTS, facts };
})();
