/* Phân hệ Quản lý sản xuất — T71 S13: Tổng quan SX-01 + Báo cáo SX-14 (7 dashboard của SX-ULNL dòng 2531–2537 + Đối chiếu quyết toán, công đoạn 6 mức nhẹ).
   Căn cứ: SX-ULNL sheet NL Chuc nang (Báo cáo thống kê: 5 chỉ số số dự án, Dashboard điều hành dự án; Báo cáo tiến độ đột xuất / định kỳ);
   QT-TTSX-4A11 §5.4 bước 9 (báo cáo tiến độ), §5.7 (KPI tỷ lệ hoàn thành tiến độ ≥ 90 %/quý), §5.8 (danh sách VTLK leadtime dài, mã tương đương đổi chéo) — plan T71 §10 Q16.
   Khuôn: hr-tools reporting/report-dashboard (khối lọc, ô chỉ tiêu, biểu đồ, bảng chi tiết, Xuất báo cáo) như SCR-93; Tổng quan như SCR-92 (ô chỉ số bấm mở ngăn chi tiết).
   Số liệu đọc từ cùng nguồn với các danh sách SX (SxDuAn, SxBt, SxTd, SxNt, SxNc, SxMs, SxFlow) — thật: API báo cáo của BE trên cùng bảng nghiệp vụ. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, badge, vSelect, toast } = window.UI;
  const K = () => window.Thau.kit;
  const P = () => window.SxDuAn;
  const rerender = () => window.App.render();
  const DAY = 86400000;
  const ms = (iso) => Date.parse(String(iso).slice(0, 10) + 'T00:00:00');
  const stampMs = (s) => Date.parse(String(s).replace(' ', 'T') + (String(s).length <= 10 ? 'T00:00:00' : ':00'));
  const today = () => ms(D.sxToday);
  const isoL = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dmy = (iso) => { if (!iso) return ''; const [y, m, d] = String(iso).slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const r1 = (n) => Math.round(n * 10) / 10;
  const pctOf = (a, b) => (b ? Math.round(a / b * 100) : null);
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const C = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#8e6bd8', '#98a2b3'];
  const KHOI = { K1: 'Khối 1', K2: 'Khối 2' };
  const MODEL = { VMC_TONG_THAU: 'VMC tổng thầu', VHT_TU_SX: 'VHT tự sản xuất', GIA_CONG: 'Thuê gia công' };
  const RUN = ['PREPARING', 'IN_PRODUCTION', 'ACCEPTANCE'];

  /* ---------- Bộ lọc chung (Khối, Dự án; báo cáo Tiến độ thêm Kỳ báo cáo) ---------- */
  const F = { khoi: null, project: null, period: 'DX', at: `${dmy(D.sxToday)} 07:00` };
  const R = {}; // trạng thái từng báo cáo: { drill: { label, fn } }
  const projects = () => P().visible().filter((p) => (!F.khoi || p.khoi === F.khoi) && (!F.project || p.code === F.project));
  const inScope = (code) => projects().some((p) => p.code === code);

  /* ---------- Tiến độ dự án: thực hiện (tab Kế hoạch & mốc) và kế hoạch đến ngày (cùng cách gộp của SxDuAn.roll) ---------- */
  function planned(node) {
    if (!node.children) { const d = Math.max(DAY, node.e - node.s); return Math.max(0, Math.min(1, (today() - node.s) / d)) * 100; }
    const w = node.children.reduce((a, x) => a + (x.e - x.s || DAY), 0);
    return node.children.reduce((a, x) => a + planned(x) * (x.e - x.s || DAY), 0) / (w || 1);
  }
  function prog(p) {
    const g = P().planOf(p), lv = P().leaves(g);
    const late = lv.filter((r) => P().stOf(r)[0] === 'Chậm tiến độ');
    const plan = Math.round(planned({ children: g })), act = P().progressOf(p);
    const stage = g.find((x) => x.pct < 100);
    const run = RUN.includes(p.status);
    /* Đúng tiến độ: thực hiện không thấp hơn kế hoạch đến ngày từ 15 điểm % trở lên (ngưỡng nguy cơ chậm của P-250, cùng cảnh báo ở tab Bán thành phẩm & tiến độ). */
    return { act, plan, gap: act - plan, late, stage: stage ? stage.name : 'Đã hoàn thành các giai đoạn', run, ok: run && act - plan > -LATE_PT };
  }
  const LATE_PT = 15;
  const onTrack = (p, g) => g.ok;

  /* ---------- Bên xử lý (thời gian chờ) theo vai của người được giao ---------- */
  const BEN = { 'R-SX-LD': 'Ban Giám đốc Khối', 'R-SX-TGD': 'Ban Tổng Giám đốc', 'R-SX-PM': 'Quản lý sản xuất', 'R-SX-SUBPM': 'Quản lý sản xuất',
    'R-SX-RD': 'Nghiên cứu phát triển', 'R-SX-GDTT': 'Nghiên cứu phát triển', 'R-SX-QA': 'Đảm bảo chất lượng', 'R-SX-NM': 'Nhà máy, đối tác', 'R-SX-KD': 'Kinh doanh' };
  const benOf = (id) => BEN[D.roleOf(id)] || 'Khác';
  const FLOW_NAME = (f) => (D.sxFlows[f] && D.sxFlows[f].name) || f;
  /* Hồ sơ luồng → dự án: đối tượng cha là dự án, phiếu, ECR, lô, đề xuất hoặc gói chuyển giao (gói chưa có dự án). */
  function projOf(obj) {
    if (P().byCode(obj)) return obj;
    for (const m of [window.SxBt, window.SxTd, window.SxNt, window.SxMs]) { const x = m && m.byCode(obj); if (x) return x.project; }
    return null;
  }
  const stepDef = (flow, step) => (D.sxFlows[flow].steps.find((s) => String(s[0]) === String(step)) || []);
  function waits() {
    const now = today() + 17 * 3600000, out = [];
    window.SxFlow.cases().forEach((c) => {
      const project = projOf(c.obj);
      if (project ? !inScope(project) : (F.project || F.khoi)) return;
      const row = (step, who, since, at, open) => {
        const st = stepDef(c.flow, step), days = r1(((at ? stampMs(at) : now) - stampMs(since)) / DAY), nlv = (st[3] || {}).nlv || 2;
        out.push({ code: c.code, flow: c.flow, obj: c.obj, project, step: `${st[0]}. ${st[1] || ''}`, who, ben: benOf(who), since, at, open, days, nlv, late: days > nlv });
      };
      c.hist.filter((h) => h.step != null && h.who && h.since && !h.sys).forEach((h) => row(h.step, h.who, h.since, h.at, false));
      c.tokens.forEach((t) => row(t.step, t.who, t.since, null, true));
    });
    return out;
  }

  /* ---------- KPI quy trình (SX-ULNL dòng 2536; KPI 1 theo QT-TTSX-4A11 §5.7) ----------
     GIẢ LẬP P-267: hạn thay đổi kỹ thuật theo cấp duyệt (ngày làm việc từ ngày lập ECR tới khi hoàn thành bàn giao). */
  const TD_SLA = { C1: 10, C2: 20, C3: 40, C4: 60 };
  function kpis() {
    const ps = projects().map((p) => Object.assign({ p }, prog(p))).filter((x) => x.run && x.plan > 0);
    const k1 = ps.map((x) => ({ code: x.p.code, title: x.p.name, href: 'sx/du-an/' + encodeURIComponent(x.p.code), v: Math.min(100, Math.round(x.act / x.plan * 100)), txt: `Thực hiện ${x.act}% / kế hoạch đến ngày ${x.plan}%` }));
    const bt = window.SxBt, iss = bt.all().filter((x) => inScope(x.project) && x.due && (x.closed || bt.isOver(x)));
    const k2 = iss.map((x) => ({ code: x.code, title: x.title, href: 'sx/bat-thuong/' + encodeURIComponent(x.code), ok: !!x.closed && x.closed <= x.due, txt: x.closed ? `Hạn ${dmy(x.due)} · đóng ${dmy(x.closed)}` : `Hạn ${dmy(x.due)} · chưa đóng` }));
    const td = window.SxTd.all().filter((x) => inScope(x.project) && x.level).map((x) => {
      const n = TD_SLA[x.level], due = bt.addWd(x.created, n), ok = !!x.closed && x.closed <= due, over = !x.closed && D.sxToday > due;
      return { code: x.code, title: x.title, href: 'sx/thay-doi/' + encodeURIComponent(x.code), ok, over, done: !!x.closed, txt: `Cấp ${x.level} · hạn ${dmy(due)} (${n} ngày làm việc)${x.closed ? ` · hoàn thành ${dmy(x.closed)}` : ''}` };
    }).filter((x) => x.done || x.over);
    const avg = (a) => (a.length ? Math.round(a.reduce((s, x) => s + x.v, 0) / a.length) : null);
    return [
      { key: 'tien-do', name: 'Tỷ lệ hoàn thành tiến độ sản xuất', target: 90, value: avg(k1), items: k1.map((x) => Object.assign(x, { ok: x.v >= 90 })), how: 'Khối lượng hoàn thành / khối lượng yêu cầu đến ngày theo kế hoạch, trung bình các dự án đang thực hiện; theo dõi hằng quý' },
      { key: 'bat-thuong', name: 'Tỷ lệ bất thường xử lý đúng hạn', target: 80, value: pctOf(k2.filter((x) => x.ok).length, k2.length), items: k2, how: 'Phiếu đóng trong hạn SLA / (phiếu đã đóng + phiếu đang quá hạn); Loại 3 theo nhà máy không tính' },
      { key: 'thay-doi', name: 'Tỷ lệ thay đổi kỹ thuật đúng hạn', target: 90, value: pctOf(td.filter((x) => x.ok).length, td.length), items: td, how: 'Yêu cầu hoàn thành trong hạn theo cấp duyệt / (đã hoàn thành + đang quá hạn)' },
    ];
  }

  /* ---------- Vật tư leadtime dài, Export License + mã tương đương (QT-TTSX-4A11 §5.8) ---------- */
  function vtlk() {
    const m = new Map();
    projects().forEach((p) => (D.sxMbom[p.product] || []).filter((x) => x.lt >= 16 || x.el).forEach((x) => {
      const r = m.get(x.code) || Object.assign({}, x, { projects: [], need: 0 });
      r.projects.push(p.code); r.need += x.per * p.qty; m.set(x.code, r);
    }));
    return [...m.values()].map((r) => Object.assign(r, { stock: D.sxStock[r.code] || 0, alt: (D.sxAlt || {})[r.code] || [] })).sort((a, b) => b.lt - a.lt || a.code.localeCompare(b.code));
  }

  /* ---------- Đối chiếu quyết toán (công đoạn 6, mức nhẹ — P-243) ---------- */
  function settle() {
    return projects().map((p) => {
      const est = (D.sxMbom[p.product] || []).reduce((a, x) => a + x.per * p.qty * x.price, 0);
      const props = window.SxMs.all().filter((x) => x.project === p.code);
      const prop = props.filter((x) => x.sent).reduce((a, x) => a + window.SxMs.totalOf(x), 0);
      const hd = props.flatMap((x) => (x.sync && x.sync.hd) || []);
      const hdv = hd.reduce((a, h) => a + (h[5] || 0), 0);
      const stocked = window.SxNt.all().filter((x) => x.project === p.code && x.stocked).reduce((a, x) => a + x.qty, 0);
      const ready = p.status === 'DONE' || (stocked >= p.qty && p.qty > 0);
      return { code: p.code, title: p.name, href: 'sx/du-an/' + encodeURIComponent(p.code), p, est, prop, hd: hd.length, hdv, gap: hdv ? hdv - est : null, stocked,
        st: ready ? ['Sẵn sàng quyết toán', 'success'] : hd.length ? ['Đang thực hiện hợp đồng', 'info'] : ['Chưa có hợp đồng', 'default'] };
    });
  }

  /* ---------- Biểu đồ (khuôn report-dashboard, cùng lớp CSS với Báo cáo ĐTMS) ---------- */
  function hbars(title, items, o) {
    const max = Math.max(1, ...items.map((x) => x.value), (o && o.max) || 0);
    const body = items.length ? items.map((x) => `<div class="bc-hr ${x.drill ? 'click' : ''}" ${x.drill ? `data-sxr-drill="${esc(x.drill)}"` : ''}>
        <span class="bc-hl" title="${esc(x.label)}">${esc(x.label)}</span>
        <span class="bc-ht"><span class="bc-hb" style="width:${x.value / max * 100}%;background:${x.color || C[0]}" data-tip="${esc(x.tip || `${x.label}: ${num(x.value)}${o && o.unit ? ' ' + o.unit : ''}`)}"></span></span>
        <span class="bc-hv num">${num(x.value)}${o && o.pct ? '%' : ''}${x.sub ? `<span class="bc-sub">${esc(x.sub)}</span>` : ''}</span></div>`).join('') : '<div class="empty-t">Không có dữ liệu</div>';
    return `<section class="bc-card"><h3 class="bc-t">${esc(title)}</h3><div class="bc-h">${body}</div>${o && o.unit ? `<div class="bc-unit">ĐVT: ${esc(o.unit)}</div>` : ''}</section>`;
  }
  /* Hai thanh mỗi dòng: thực hiện và kế hoạch đến ngày (chênh lệch ở cột số). */
  function pairs(title, items) {
    const body = items.length ? items.map((x) => `<div class="bc-hr ${x.drill ? 'click' : ''}" ${x.drill ? `data-sxr-drill="${esc(x.drill)}"` : ''}>
        <span class="bc-hl" title="${esc(x.label)}">${esc(x.label)}</span>
        <span class="bc-ht sxr-pair"><span class="bc-hb" style="width:${x.a}%;background:${x.late ? C[1] : C[0]}" data-tip="Thực hiện: ${x.a}%"></span><span class="bc-hb" style="width:${x.b}%;background:${C[5]}" data-tip="Kế hoạch đến ngày: ${x.b}%"></span></span>
        <span class="bc-hv num">${x.a}%<span class="bc-sub">KH ${x.b}%</span></span></div>`).join('') : '<div class="empty-t">Không có dữ liệu</div>';
    return `<section class="bc-card"><h3 class="bc-t">${esc(title)}</h3><div class="bc-h">${body}</div>
      <ul class="bc-legend"><li><span class="sw" style="background:${C[0]}"></span>Thực hiện</li><li><span class="sw" style="background:${C[1]}"></span>Thực hiện — chậm tiến độ</li><li><span class="sw" style="background:${C[5]}"></span>Kế hoạch đến ngày</li></ul></section>`;
  }
  /* Biểu đồ tròn (vành khuyên): mỗi phần một màu, giữa vành là tổng; chú giải bên phải có số lượng và tỷ lệ. */
  function donut(title, items, o) {
    const tot = items.reduce((a, x) => a + x.value, 0), R = 52, L = 2 * Math.PI * R;
    let off = 0;
    const arcs = tot ? items.filter((x) => x.value > 0).map((x) => {
      const len = x.value / tot * L, s = `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${x.color}" stroke-width="22" stroke-dasharray="${len} ${L - len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)" data-tip="${esc(x.label)}: ${num(x.value)} (${Math.round(x.value / tot * 100)}%)"></circle>`;
      off += len; return s;
    }).join('') : `<circle cx="70" cy="70" r="${R}" fill="none" stroke="#98a2b3" stroke-opacity=".35" stroke-width="22"></circle>`;
    const leg = items.map((x) => `<li style="display:flex;align-items:center;gap:8px;padding:3px 0"><span class="sw" style="width:10px;height:10px;border-radius:2px;flex:none;background:${x.color}"></span><span style="flex:1;min-width:0">${esc(x.label)}</span><b class="num">${num(x.value)}</b><span class="num" style="width:44px;text-align:right;opacity:.7">${tot ? Math.round(x.value / tot * 100) : 0}%</span></li>`).join('');
    return `<section class="bc-card"><h3 class="bc-t">${esc(title)}</h3>
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;padding:8px 4px">
        <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="${esc(title)}" style="flex:none">${arcs}
          <text x="70" y="68" text-anchor="middle" font-size="26" font-weight="700" fill="currentColor">${num(tot)}</text><text x="70" y="86" text-anchor="middle" font-size="11" fill="currentColor" opacity=".65">${esc((o && o.unit) || '')}</text></svg>
        <ul style="list-style:none;margin:0;padding:0;flex:1;min-width:200px">${leg}</ul></div>${o && o.note ? `<div class="bc-unit">${esc(o.note)}</div>` : ''}</section>`;
  }
  const countBy = (rows, key, order, label) => {
    const m = new Map((order || []).map((k) => [k, 0]));
    rows.forEach((r) => { const k = key(r); m.set(k, (m.get(k) || 0) + 1); });
    const out = [...m.entries()].map(([k, v]) => ({ key: k, label: label ? label(k) : k, value: v }));
    return order ? out : out.sort((a, b) => b.value - a.value || String(a.label).localeCompare(String(b.label), 'vi'));
  };
  const projLabel = (code) => code;

  /* ---------- Các báo cáo SX-14: mỗi báo cáo = một cấu hình (chỉ tiêu, chiều nhóm, cột chi tiết) trên cùng khuôn ---------- */
  const link = (r) => `<a class="link" data-go="${r.href}">${esc(r.code)}</a>`;
  const projCell = (code) => (code ? `<a class="link" data-go="sx/du-an/${encodeURIComponent(code)}">${esc(code)}</a>` : K().dash);
  const PERIOD = { DX: 'Đột xuất — lũy kế đến ngày', TUAN: 'Định kỳ tuần', THANG: 'Định kỳ tháng', QUY: 'Định kỳ quý' };
  function periodRange() {
    const t = new Date(today());
    if (F.period === 'TUAN') { const mon = today() - ((t.getDay() + 6) % 7) * DAY; return [mon, `Tuần ${dmy(isoL(mon))} – ${dmy(D.sxToday)}`]; }
    if (F.period === 'THANG') { const s = `${D.sxToday.slice(0, 7)}-01`; return [ms(s), `Tháng ${D.sxToday.slice(5, 7)}/${D.sxToday.slice(0, 4)}`]; }
    if (F.period === 'QUY') { const q = Math.floor((t.getMonth()) / 3), s = `${D.sxToday.slice(0, 4)}-${String(q * 3 + 1).padStart(2, '0')}-01`; return [ms(s), `Quý ${['I', 'II', 'III', 'IV'][q]}/${D.sxToday.slice(0, 4)}`]; }
    return [0, `Lũy kế đến ${dmy(D.sxToday)}`];
  }
  /* Sự kiện trong kỳ của báo cáo tiến độ định kỳ (Q16): sản lượng, phiếu bất thường, ECR, nghiệm thu, nhập kho. */
  function events(from) {
    const ev = [], ok = (d, code) => d && ms(d) >= from && ms(d) <= today() && inScope(code);
    projects().forEach((p) => window.SxBtp.logsOf(p.code).forEach((l) => { if (ok(l.date, p.code)) ev.push({ date: l.date, project: p.code, kind: 'Sản lượng', code: l.item, text: `${l.item}: ${num(l.qty)}${/^M/.test(l.item) ? '%' : ' ' + p.unitName} đạt${l.ng ? `, ${num(l.ng)} lỗi` : ''}${l.note ? ' — ' + l.note : ''}`, href: 'sx/du-an/' + encodeURIComponent(p.code) }); }));
    window.SxBt.all().forEach((x) => { if (ok(x.found, x.project)) ev.push({ date: x.found, project: x.project, kind: 'Bất thường', code: x.code, text: x.title, href: 'sx/bat-thuong/' + encodeURIComponent(x.code) }); });
    window.SxTd.all().forEach((x) => { if (ok(x.created, x.project)) ev.push({ date: x.created, project: x.project, kind: 'Thay đổi kỹ thuật', code: x.code, text: x.title, href: 'sx/thay-doi/' + encodeURIComponent(x.code) }); });
    window.SxNt.all().forEach((x) => {
      if (ok(x.created, x.project)) ev.push({ date: x.created, project: x.project, kind: 'Nghiệm thu', code: x.code, text: `Đề nghị nghiệm thu ${x.itemText}: ${num(x.qty)} ${x.unitName}`, href: 'sx/nghiem-thu/' + encodeURIComponent(x.code) });
      if (ok(x.stocked, x.project)) ev.push({ date: x.stocked, project: x.project, kind: 'Nhập kho', code: x.code, text: `${x.pnk || ''} — ${num(x.qty)} ${x.unitName}`, href: 'sx/nghiem-thu/' + encodeURIComponent(x.code) });
    });
    return ev.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.code.localeCompare(b.code)));
  }

  const REPORTS = {
    'tien-do': {
      title: 'Tiến độ sản xuất', ulnl: 'Dashboard tiến độ sản xuất; Báo cáo tiến độ đột xuất / định kỳ',
      rows: () => projects().map((p) => Object.assign({ code: p.code, title: p.name, href: 'sx/du-an/' + encodeURIComponent(p.code), p }, prog(p))),
      metrics: (rows) => {
        const run = rows.filter((r) => r.run), avg = (k) => (run.length ? Math.round(run.reduce((a, r) => a + r[k], 0) / run.length) : 0);
        return [['Dự án đang thực hiện', num(run.length), 'Chuẩn bị, đang sản xuất, nghiệm thu', (r) => r.run],
          ['Đúng tiến độ', num(run.filter((r) => r.ok).length), `Thực hiện chậm dưới ${LATE_PT} điểm so với kế hoạch`, (r) => r.ok],
          ['Chậm tiến độ', num(run.filter((r) => !r.ok).length), `Chậm từ ${LATE_PT} điểm trở lên`, (r) => r.run && !r.ok],
          ['Tiến độ thực hiện bình quân', `${avg('act')}%`, `Kế hoạch đến ngày bình quân ${avg('plan')}%`, (r) => r.run]];
      },
      charts: (rows, id) => [pairs('Thực hiện so với kế hoạch đến ngày', rows.filter((r) => r.run || r.act).map((r, i) => ({ label: r.code, a: r.act, b: r.plan, late: r.run && !r.ok, drill: `${id}|g|0|${i}`, key: r.code }))),
        hbars('Số hạng mục chậm theo dự án', rows.filter((r) => r.late.length).map((r) => ({ key: r.code, label: r.code, value: r.late.length, color: C[1], tip: `${r.code}: ${r.late.length} hạng mục chậm — ${r.late.map((x) => x.name).join('; ')}` })), { unit: 'hạng mục' })],
      groups: (rows) => [rows.filter((r) => r.run || r.act).map((r) => ({ label: `Dự án ${r.code}`, fn: (x) => x.code === r.code }))],
      cols: [['Mã dự án', 140, '', link, (r) => r.code], ['Tên dự án', 280, '', (r) => K().clamp(r.title), (r) => r.title], ['Khối', 80, '', (r) => esc(KHOI[r.p.khoi]), (r) => KHOI[r.p.khoi]],
        ['Mô hình', 140, '', (r) => esc(MODEL[r.p.model] || ''), (r) => MODEL[r.p.model] || ''], ['Trạng thái', 150, 'c', (r) => badge(D.sxStatus[r.p.status], D.sxStatusV[r.p.status]), (r) => D.sxStatus[r.p.status]],
        ['Giai đoạn hiện tại', 220, '', (r) => K().clamp(r.stage), (r) => r.stage], ['Thực hiện', 100, 'r', (r) => `<span class="num">${r.act}%</span>`, (r) => r.act + '%'],
        ['Kế hoạch đến ngày', 140, 'r', (r) => `<span class="num">${r.plan}%</span>`, (r) => r.plan + '%'], ['Chênh lệch', 110, 'r', (r) => `<span class="num ${r.gap < 0 ? 't-err' : ''}">${r.gap > 0 ? '+' : ''}${r.gap} điểm</span>`, (r) => r.gap],
        ['Hạng mục chậm', 240, '', (r) => (r.late.length ? K().clamp(r.late.map((x) => x.name).join('; ')) : K().dash), (r) => r.late.map((x) => x.name).join('; ')],
        ['Ngày kết thúc', 120, '', (r) => esc(dmy(r.p.end)), (r) => dmy(r.p.end)]],
      period: true,
    },
    'chat-luong': {
      title: 'Chất lượng', ulnl: 'Dashboard chất lượng',
      rows: () => {
        const ip = window.SxNt.ipqcAll().filter((x) => inScope(x.project)).map((x) => ({ code: x.code, kind: 'IPQC', href: 'sx/du-an/' + encodeURIComponent(x.project), project: x.project, title: `${x.item} · ${x.stage}`, n: x.n, ok: x.ok, kq: x.kq === 'DAT' ? 'Đạt' : 'Không đạt', date: x.at, note: x.note || '' }));
        const lot = window.SxNt.all().filter((x) => inScope(x.project)).map((x) => ({ code: x.code, kind: 'OQC — nghiệm thu', href: 'sx/nghiem-thu/' + encodeURIComponent(x.code), project: x.project, title: `${x.itemText} · ${x.serials}`, n: x.qty, ok: x.oqc === 'DAT' ? x.qty : x.oqc === 'NOK' ? 0 : null,
          kq: x.oqc === 'DAT' ? 'Đạt' : x.oqc === 'NOK' ? 'Không đạt' : 'Chờ OQC', date: x.created, note: window.SxNt.stOf(x)[0] }));
        const iqc = projects().flatMap((p) => (D.sxIqc[p.code] || []).map(([code, mat, n, kq, date]) => ({ code, kind: 'IQC — vật tư đầu vào', href: 'sx/du-an/' + encodeURIComponent(p.code), project: p.code, title: mat, n, ok: /^Đạt/.test(kq) ? n : 0, kq: /^Đạt/.test(kq) ? 'Đạt' : 'Không đạt', date, note: kq })));
        return ip.concat(lot, iqc).sort((a, b) => (a.date < b.date ? 1 : -1));
      },
      metrics: (rows) => {
        const by = (k) => rows.filter((r) => r.kind.startsWith(k)), rate = (a) => { const d = a.filter((r) => r.ok != null); const t = d.reduce((s, r) => s + r.n, 0); return t ? `${num(r1(d.reduce((s, r) => s + r.ok, 0) / t * 100))}%` : '-'; };
        return [['Lượt kiểm tra IPQC', num(by('IPQC').length), `Tỷ lệ đạt theo số lượng ${rate(by('IPQC'))}`, (r) => r.kind === 'IPQC'],
          ['IPQC không đạt', num(by('IPQC').filter((r) => r.kq === 'Không đạt').length), 'Đã tự lập phiếu bất thường', (r) => r.kind === 'IPQC' && r.kq === 'Không đạt'],
          ['Lô nghiệm thu', num(by('OQC').length), `Đạt OQC ${by('OQC').filter((r) => r.kq === 'Đạt').length} · chờ ${by('OQC').filter((r) => r.kq === 'Chờ OQC').length}`, (r) => r.kind.startsWith('OQC')],
          ['Lô vật tư IQC', num(by('IQC').length), `Không đạt / tạm dừng ${by('IQC').filter((r) => r.kq !== 'Đạt').length}`, (r) => r.kind.startsWith('IQC')]];
      },
      charts: (rows, id) => {
        const ip = rows.filter((r) => r.kind === 'IPQC'), m = new Map();
        ip.forEach((r) => { const v = m.get(r.project) || { n: 0, ok: 0 }; v.n += r.n; v.ok += r.ok; m.set(r.project, v); });
        const byP = [...m.entries()].map(([k, v], i) => ({ key: k, label: k, value: r1(v.ok / v.n * 100), color: v.ok / v.n < 0.99 ? C[1] : C[2], sub: `${num(v.ok)} / ${num(v.n)}`, drill: `${id}|g|0|${i}` }));
        const kq = countBy(rows, (r) => r.kq, ['Đạt', 'Không đạt', 'Chờ OQC']).map((x, i) => Object.assign(x, { color: [C[2], C[1], C[3]][i], drill: `${id}|g|1|${i}` }));
        return [hbars('Tỷ lệ đạt IPQC theo dự án', byP, { unit: '% số lượng đạt', pct: true, max: 100 }), hbars('Kết quả kiểm tra', kq, { unit: 'lượt / lô' })];
      },
      groups: (rows) => {
        const ps = [...new Set(rows.filter((r) => r.kind === 'IPQC').map((r) => r.project))];
        return [ps.map((k) => ({ label: `IPQC dự án ${k}`, fn: (r) => r.kind === 'IPQC' && r.project === k })), ['Đạt', 'Không đạt', 'Chờ OQC'].map((k) => ({ label: `Kết quả ${k}`, fn: (r) => r.kq === k }))];
      },
      cols: [['Mã', 150, '', link, (r) => r.code], ['Loại kiểm tra', 180, '', (r) => esc(r.kind), (r) => r.kind], ['Dự án', 140, '', (r) => projCell(r.project), (r) => r.project],
        ['Hạng mục / vật tư', 260, '', (r) => K().clamp(r.title), (r) => r.title], ['Số lượng kiểm', 120, 'r', (r) => `<span class="num">${num(r.n)}</span>`, (r) => r.n],
        ['Số đạt', 110, 'r', (r) => (r.ok == null ? K().dash : `<span class="num">${num(r.ok)}</span>`), (r) => (r.ok == null ? '' : r.ok)],
        ['Kết quả', 120, 'c', (r) => badge(r.kq, r.kq === 'Đạt' ? 'success' : r.kq === 'Không đạt' ? 'error' : 'warning'), (r) => r.kq], ['Ngày', 110, '', (r) => esc(dmy(r.date)), (r) => dmy(r.date)],
        ['Ghi chú', 260, '', (r) => K().clamp(r.note), (r) => r.note]],
    },
    'bat-thuong': {
      title: 'Bất thường theo dự án', ulnl: 'Dashboard về bất thường theo dự án',
      rows: () => window.SxBt.all().filter((x) => inScope(x.project)).map((x) => Object.assign({}, x, { href: 'sx/bat-thuong/' + encodeURIComponent(x.code), st: window.SxBt.stOf(x), left: window.SxBt.leftOf(x) })),
      metrics: (rows) => {
        const done = rows.filter((r) => r.closed && r.due), ok = done.filter((r) => r.closed <= r.due).length;
        return [['Tổng số phiếu', num(rows.length), 'Theo bộ lọc', () => true], ['Đang mở', num(rows.filter((r) => !r.closed).length), 'Chưa đóng, gồm chờ tiếp nhận', (r) => !r.closed],
          ['Quá hạn', num(rows.filter((r) => window.SxBt.isOver(r)).length), 'Chưa đóng, đã qua hạn SLA', (r) => window.SxBt.isOver(r)],
          ['Đã đóng', num(rows.filter((r) => r.closed).length), done.length ? `Đúng hạn ${ok} / ${done.length} phiếu có hạn` : 'Chưa có phiếu đóng có hạn', (r) => !!r.closed]];
      },
      charts: (rows, id) => {
        const ST = window.SxBt.ST_LIST; // T74 #98: trạng thái theo bước luồng
        const ps = countBy(rows, (r) => r.project).map((x, i) => Object.assign(x, { drill: `${id}|g|0|${i}`, sub: rows.filter((r) => r.project === x.key && !r.closed).length ? `${rows.filter((r) => r.project === x.key && !r.closed).length} đang mở` : '' }));
        const ty = countBy(rows, (r) => (r.type ? r.type : 'CHUA'), ['L1', 'L2', 'L3', 'CHUA'], (k) => (k === 'CHUA' ? 'Chưa phân loại' : window.SxBt.classText(k, null))).map((x, i) => Object.assign(x, { drill: `${id}|g|1|${i}` }));
        const st = countBy(rows, (r) => r.st[0], ST).map((x, i) => Object.assign(x, { drill: `${id}|g|2|${i}`, color: x.key.startsWith('Chờ đánh giá') ? C[1] : x.key === 'Đã đóng' ? C[2] : C[0] }));
        return [hbars('Số phiếu theo dự án', ps, { unit: 'phiếu' }), hbars('Theo loại bất thường', ty, { unit: 'phiếu' }), hbars('Theo trạng thái', st, { unit: 'phiếu' })];
      },
      groups: (rows) => [countBy(rows, (r) => r.project).map((x) => ({ label: `Dự án ${x.key}`, fn: (r) => r.project === x.key })),
        ['L1', 'L2', 'L3', 'CHUA'].map((k) => ({ label: k === 'CHUA' ? 'Chưa phân loại' : window.SxBt.classText(k, null), fn: (r) => (r.type || 'CHUA') === k })),
        window.SxBt.ST_LIST.map((k) => ({ label: k, fn: (r) => r.st[0] === k }))],
      cols: [['Mã phiếu', 130, '', link, (r) => r.code], ['Tiêu đề', 280, '', (r) => K().clamp(r.title), (r) => r.title], ['Dự án', 140, '', (r) => projCell(r.project), (r) => r.project],
        ['Phân loại', 200, '', (r) => (r.type ? esc(window.SxBt.classText(r.type, r.sev)) : K().dash), (r) => (r.type ? window.SxBt.classText(r.type, r.sev) : '')],
        ['Ngày phát hiện', 120, '', (r) => esc(dmy(r.found)), (r) => dmy(r.found)], ['Hạn xử lý', 120, '', (r) => (r.due ? esc(dmy(r.due)) : K().dash), (r) => dmy(r.due)],
        ['Ngày đóng', 120, '', (r) => (r.closed ? esc(dmy(r.closed)) : K().dash), (r) => dmy(r.closed)], ['Trạng thái', 170, 'c', (r) => badge(...r.st), (r) => r.st[0]]],
    },
    'thay-doi': {
      title: 'Thay đổi kỹ thuật', ulnl: 'Dashboard về thay đổi kỹ thuật',
      rows: () => window.SxTd.all().filter((x) => inScope(x.project)).map((x) => Object.assign({}, x, { href: 'sx/thay-doi/' + encodeURIComponent(x.code), st: window.SxTd.stOf(x), srcT: x.src === 'KHCN' ? 'Hệ thống KHCN' : x.issue ? 'Từ phiếu bất thường' : 'Lập trực tiếp' })),
      metrics: (rows) => [['Tổng số yêu cầu', num(rows.length), 'ECR theo bộ lọc', () => true], ['Đang xử lý', num(rows.filter((r) => r.st[0] === 'Đang xử lý').length), 'Chưa phê duyệt lệnh thay đổi', (r) => r.st[0] === 'Đang xử lý'],
        ['Đã phê duyệt / ban hành', num(rows.filter((r) => r.eco && !r.closed).length), 'Có ECO, chưa bàn giao xong', (r) => !!r.eco && !r.closed], ['Hoàn thành', num(rows.filter((r) => r.closed).length), 'Đã bàn giao nhà máy áp dụng', (r) => !!r.closed]],
      charts: (rows, id) => [hbars('Theo dự án', countBy(rows, (r) => r.project).map((x, i) => Object.assign(x, { drill: `${id}|g|0|${i}` })), { unit: 'yêu cầu' }),
        hbars('Theo cấp phê duyệt', countBy(rows, (r) => r.level || 'CHUA', ['C1', 'C2', 'C3', 'C4', 'CHUA'], (k) => (k === 'CHUA' ? 'Chưa xác định cấp' : `Cấp ${k.slice(1)}`)).map((x, i) => Object.assign(x, { drill: `${id}|g|1|${i}` })), { unit: 'yêu cầu' }),
        hbars('Theo nguồn yêu cầu', countBy(rows, (r) => r.srcT, ['Lập trực tiếp', 'Từ phiếu bất thường', 'Hệ thống KHCN']).map((x, i) => Object.assign(x, { drill: `${id}|g|2|${i}` })), { unit: 'yêu cầu' })],
      groups: (rows) => [countBy(rows, (r) => r.project).map((x) => ({ label: `Dự án ${x.key}`, fn: (r) => r.project === x.key })),
        ['C1', 'C2', 'C3', 'C4', 'CHUA'].map((k) => ({ label: k === 'CHUA' ? 'Chưa xác định cấp' : `Cấp ${k.slice(1)}`, fn: (r) => (r.level || 'CHUA') === k })),
        ['Lập trực tiếp', 'Từ phiếu bất thường', 'Hệ thống KHCN'].map((k) => ({ label: `Nguồn ${k}`, fn: (r) => r.srcT === k }))],
      cols: [['Mã yêu cầu', 130, '', link, (r) => r.code], ['Tiêu đề', 300, '', (r) => K().clamp(r.title), (r) => r.title], ['Dự án', 140, '', (r) => projCell(r.project), (r) => r.project],
        ['Nguồn', 160, '', (r) => esc(r.srcT), (r) => r.srcT], ['Cấp duyệt', 100, 'c', (r) => (r.level ? esc('Cấp ' + r.level.slice(1)) : K().dash), (r) => r.level || ''],
        ['ECO', 130, '', (r) => (r.eco ? esc(r.eco) : K().dash), (r) => r.eco || ''], ['ECN', 130, '', (r) => (r.ecn ? esc(r.ecn) : K().dash), (r) => r.ecn || ''],
        ['Ngày lập', 110, '', (r) => esc(dmy(r.created)), (r) => dmy(r.created)], ['Trạng thái', 170, 'c', (r) => badge(...r.st), (r) => r.st[0]]],
    },
    'vat-tu': {
      title: 'Vật tư theo ngày cần', ulnl: 'Tình trạng vật tư theo ngày cần',
      rows: () => window.SxNc.all().filter((r) => inScope(r.project)).map((r) => Object.assign({}, r, { href: 'sx/nhu-cau', month: r.need.slice(0, 7) })).sort((a, b) => (a.need < b.need ? -1 : a.need > b.need ? 1 : a.code.localeCompare(b.code))),
      metrics: (rows) => [['Dòng nhu cầu vật tư', num(rows.length), 'Theo bộ lọc', () => true], ['Trễ hạn đặt hàng', num(rows.filter((r) => r.st[0] === 'Trễ hạn đặt hàng').length), 'Hạn đặt hàng = ngày cần − leadtime đã qua', (r) => r.st[0] === 'Trễ hạn đặt hàng'],
        ['Chưa đề xuất', num(rows.filter((r) => r.st[0] === 'Chưa đề xuất').length), 'Còn thiếu so với tồn kho, VHT mua', (r) => r.st[0] === 'Chưa đề xuất'],
        ['Đã / đang đề xuất', num(rows.filter((r) => r.prop).length), 'Có đề xuất mua sắm', (r) => !!r.prop]],
      charts: (rows, id) => {
        const months = [...new Set(rows.map((r) => r.month))].sort();
        const ST = ['Trễ hạn đặt hàng', 'Chưa đề xuất', 'Đang đề xuất', 'Đã đề xuất', 'Đủ tồn kho', 'Đối tác mua'];
        return [hbars('Số dòng vật tư theo tháng cần', months.map((m, i) => ({ key: m, label: `Tháng ${m.slice(5)}/${m.slice(0, 4)}`, value: rows.filter((r) => r.month === m).length, sub: rows.filter((r) => r.month === m && r.st[0] === 'Trễ hạn đặt hàng').length ? `${rows.filter((r) => r.month === m && r.st[0] === 'Trễ hạn đặt hàng').length} trễ hạn đặt hàng` : '', drill: `${id}|g|0|${i}` })), { unit: 'dòng vật tư' }),
          hbars('Theo tình trạng', countBy(rows, (r) => r.st[0], ST).map((x, i) => Object.assign(x, { color: x.key === 'Trễ hạn đặt hàng' ? C[1] : x.key === 'Chưa đề xuất' ? C[3] : C[0], drill: `${id}|g|1|${i}` })), { unit: 'dòng vật tư' })];
      },
      groups: (rows) => [[...new Set(rows.map((r) => r.month))].sort().map((m) => ({ label: `Tháng cần ${m.slice(5)}/${m.slice(0, 4)}`, fn: (r) => r.month === m })),
        ['Trễ hạn đặt hàng', 'Chưa đề xuất', 'Đang đề xuất', 'Đã đề xuất', 'Đủ tồn kho', 'Đối tác mua'].map((k) => ({ label: k, fn: (r) => r.st[0] === k }))],
      cols: [['Mã nhu cầu', 130, '', link, (r) => r.code], ['Dự án', 140, '', (r) => projCell(r.project), (r) => r.project], ['Mã vật tư', 150, '', (r) => esc(r.mat), (r) => r.mat],
        ['Tên vật tư', 240, '', (r) => K().clamp(r.m.name), (r) => r.m.name], ['Nhu cầu', 110, 'r', (r) => `<span class="num">${num(r.qty)}</span>`, (r) => r.qty], ['Còn thiếu', 110, 'r', (r) => `<span class="num">${num(r.short)}</span>`, (r) => r.short],
        ['Leadtime (tuần)', 120, 'r', (r) => `<span class="num">${num(r.m.lt)}</span>`, (r) => r.m.lt], ['Ngày cần', 110, '', (r) => esc(dmy(r.need)), (r) => dmy(r.need)],
        ['Hạn đặt hàng', 120, '', (r) => `<span class="${r.st[0] === 'Trễ hạn đặt hàng' ? 't-err' : ''}">${esc(dmy(r.order))}</span>`, (r) => dmy(r.order)], ['Tình trạng', 160, 'c', (r) => badge(...r.st), (r) => r.st[0]]],
      extra: () => {
        const list = vtlk();
        const body = list.length ? K().table([['Mã vật tư', 150], ['Tên vật tư', 240], ['Leadtime (tuần)', 120, 'r'], ['Export License', 120, 'c'], ['Dự án sử dụng', 200], ['Nhu cầu', 110, 'r'], ['Tồn kho', 100, 'r'], ['Mã tương đương có thể đổi chéo', 340]], list,
          (r) => `<td>${esc(r.code)}</td><td>${K().clamp(r.name)}</td><td class="r num">${r.lt}</td><td class="c">${r.el ? badge('Cần', 'warning') : K().dash}</td><td>${r.projects.map(projCell).join(', ')}</td>
            <td class="r num">${num(r.need)}</td><td class="r num">${num(r.stock)}</td><td>${r.alt.length ? r.alt.map(([c, n, note]) => `<div><b>${esc(c)}</b> — ${esc(n)}${note ? `<span class="bc-sub">${esc(note)}</span>` : ''}</div>`).join('') : '<span class="cap">Chưa có mã tương đương</span>'}</td>`)
          : '<div class="empty-t">Không có vật tư leadtime dài hoặc cần Export License theo bộ lọc</div>';
        return `<section class="vcard" data-sxr-vtlk><div class="vcard-h"><h3>Danh sách vật tư leadtime dài, Export License</h3><span class="cap">${list.length} mã · leadtime từ 16 tuần hoặc cần Export License · lập từ MBOM và dữ liệu mua sắm các dự án</span></div>${body}</section>`;
      },
      xextra: () => [['[Vật tư leadtime dài, Export License]'], ['STT', 'Mã vật tư', 'Tên vật tư', 'Leadtime (tuần)', 'Export License', 'Dự án sử dụng', 'Nhu cầu', 'Tồn kho', 'Mã tương đương có thể đổi chéo']]
        .concat(vtlk().map((r, i) => [i + 1, r.code, r.name, r.lt, r.el ? 'Cần' : '', r.projects.join('; '), r.need, r.stock, r.alt.map((a) => `${a[0]} — ${a[1]}`).join('; ')])),
    },
    kpi: {
      title: 'KPI quy trình', ulnl: 'KPI quy trình (tiến độ ≥ 90%, bất thường đúng hạn ≥ 80%, TĐKT ≥ 90%)',
      rows: () => kpis().flatMap((k) => k.items.map((x) => Object.assign({ kpi: k.key, kpiName: k.name }, x))),
      metrics: () => kpis().map((k) => [k.name, k.value == null ? '-' : `${k.value}%`, `Mục tiêu ≥ ${k.target}% · ${k.value == null ? 'chưa có số liệu' : k.value >= k.target ? 'Đạt' : 'Chưa đạt'}`, (r) => r.kpi === k.key, k.value != null && k.value < k.target]),
      charts: (rows, id) => {
        const k = kpis();
        return [hbars('Tỷ lệ hoàn thành tiến độ theo dự án (mục tiêu ≥ 90%)', k[0].items.map((x, i) => ({ key: x.code, label: x.code, value: x.v, color: x.v >= 90 ? C[2] : C[1], sub: x.v >= 90 ? 'Đạt' : 'Chưa đạt', drill: `${id}|g|0|${i}` })), { unit: '%', pct: true, max: 100 }),
          hbars('Giá trị KPI so với mục tiêu', k.map((x, i) => ({ key: x.key, label: x.name, value: x.value || 0, color: x.value != null && x.value >= x.target ? C[2] : C[1], sub: `Mục tiêu ≥ ${x.target}%`, drill: `${id}|g|1|${i}` })), { unit: '%', pct: true, max: 100 })];
      },
      groups: () => { const k = kpis(); return [k[0].items.map((x) => ({ label: `Tiến độ ${x.code}`, fn: (r) => r.kpi === 'tien-do' && r.code === x.code })), k.map((x) => ({ label: x.name, fn: (r) => r.kpi === x.key }))]; },
      cols: [['KPI', 260, '', (r) => esc(r.kpiName), (r) => r.kpiName], ['Mã', 150, '', link, (r) => r.code], ['Nội dung', 280, '', (r) => K().clamp(r.title), (r) => r.title],
        ['Giá trị dùng để tính', 340, '', (r) => K().clamp(r.v != null ? `${r.v}% — ${r.txt}` : r.txt), (r) => (r.v != null ? `${r.v}% — ${r.txt}` : r.txt)],
        ['Kết quả', 120, 'c', (r) => badge(r.ok ? 'Đạt' : 'Chưa đạt', r.ok ? 'success' : 'error'), (r) => (r.ok ? 'Đạt' : 'Chưa đạt')]],
      lead: () => `<div class="sxr-how">${kpis().map((k) => `<p class="cap"><b>${esc(k.name)}</b>: ${esc(k.how)}.</p>`).join('')}</div>`,
    },
    'cho-xu-ly': {
      title: 'Thời gian chờ theo bên xử lý', ulnl: 'Thời gian chờ theo bên xử lý',
      rows: () => waits().map((w) => Object.assign(w, { href: hrefCase(w) })).sort((a, b) => (a.open === b.open ? b.days - a.days : a.open ? -1 : 1)),
      metrics: (rows) => {
        const done = rows.filter((r) => !r.open), open = rows.filter((r) => r.open), avg = (a) => (a.length ? r1(a.reduce((s, r) => s + r.days, 0) / a.length) : 0);
        return [['Việc đang chờ xử lý', num(open.length), `Chờ bình quân ${num(avg(open))} ngày`, (r) => r.open], ['Việc đang chờ quá hạn', num(open.filter((r) => r.late).length), 'Vượt số ngày chuẩn của bước', (r) => r.open && r.late],
          ['Bước đã xử lý', num(done.length), `Thời gian xử lý bình quân ${num(avg(done))} ngày`, (r) => !r.open], ['Bước xử lý quá hạn', num(done.filter((r) => r.late).length), 'Đã xử lý nhưng vượt số ngày chuẩn', (r) => !r.open && r.late]];
      },
      charts: (rows, id) => {
        const bens = [...new Set(rows.map((r) => r.ben))];
        const avg = bens.map((b) => { const a = rows.filter((r) => r.ben === b); return { key: b, label: b, value: r1(a.reduce((s, r) => s + r.days, 0) / a.length), sub: `${a.length} lượt · ${a.filter((r) => r.late).length} quá hạn` }; }).sort((a, b) => b.value - a.value);
        const open = bens.map((b) => ({ key: b, label: b, value: rows.filter((r) => r.ben === b && r.open).length })).filter((x) => x.value).sort((a, b) => b.value - a.value);
        return [hbars('Thời gian bình quân mỗi lượt theo bên xử lý', avg.map((x, i) => Object.assign(x, { drill: `${id}|g|0|${i}` })), { unit: 'ngày' }),
          hbars('Việc đang chờ theo bên xử lý', open.map((x, i) => Object.assign(x, { color: C[3], drill: `${id}|g|1|${i}` })), { unit: 'việc' })];
      },
      groups: (rows) => {
        const bens = [...new Set(rows.map((r) => r.ben))];
        const a = bens.map((b) => { const x = rows.filter((r) => r.ben === b); return [b, x.reduce((s, r) => s + r.days, 0) / x.length]; }).sort((x, y) => y[1] - x[1]).map(([b]) => b);
        const o = bens.map((b) => [b, rows.filter((r) => r.ben === b && r.open).length]).filter((x) => x[1]).sort((x, y) => y[1] - x[1]).map(([b]) => b);
        return [a.map((b) => ({ label: `Bên ${b}`, fn: (r) => r.ben === b })), o.map((b) => ({ label: `Đang chờ — ${b}`, fn: (r) => r.ben === b && r.open }))];
      },
      cols: [['Hồ sơ', 200, '', (r) => `<a class="link" data-go="${r.href}">${esc(r.code)}</a>`, (r) => r.code], ['Quy trình', 220, '', (r) => K().clamp(FLOW_NAME(r.flow)), (r) => FLOW_NAME(r.flow)],
        ['Dự án', 140, '', (r) => projCell(r.project), (r) => r.project || ''], ['Bước', 240, '', (r) => K().clamp(r.step), (r) => r.step], ['Bên xử lý', 180, '', (r) => esc(r.ben), (r) => r.ben],
        ['Người xử lý', 170, '', (r) => K().clamp(pName(r.who)), (r) => pName(r.who)], ['Nhận việc', 140, '', (r) => esc(dmy(r.since) + r.since.slice(10)), (r) => r.since],
        ['Xử lý xong', 140, '', (r) => (r.open ? badge('Đang chờ', 'warning') : esc(dmy(r.at) + r.at.slice(10))), (r) => (r.open ? 'Đang chờ' : r.at)],
        ['Số ngày', 100, 'r', (r) => `<span class="num ${r.late ? 't-err' : ''}">${num(r.days)}</span>`, (r) => r.days], ['Chuẩn (ngày)', 110, 'r', (r) => `<span class="num">${r.nlv}</span>`, (r) => r.nlv]],
    },
    'quyet-toan': {
      title: 'Đối chiếu quyết toán', ulnl: 'Thanh quyết toán (công đoạn 6, mức nhẹ)',
      rows: () => settle(),
      metrics: (rows) => {
        const sum = (k) => rows.reduce((a, r) => a + (r[k] || 0), 0);
        return [['Giá trị vật tư dự toán', `${num(sum('est'))} <small>đồng</small>`, 'MBOM × số lượng dự án', () => true], ['Giá trị hợp đồng', `${num(sum('hdv'))} <small>đồng</small>`, `${rows.reduce((a, r) => a + r.hd, 0)} hợp đồng đọc từ ĐTMS`, (r) => r.hd > 0],
          ['Chênh lệch hợp đồng − dự toán', `${num(rows.filter((r) => r.gap != null).reduce((a, r) => a + r.gap, 0))} <small>đồng</small>`, 'Chỉ dự án đã có hợp đồng', (r) => r.gap != null],
          ['Sẵn sàng quyết toán', num(rows.filter((r) => r.st[0] === 'Sẵn sàng quyết toán').length), 'Đã nhập kho đủ số lượng hoặc đã đóng dự án', (r) => r.st[0] === 'Sẵn sàng quyết toán']];
      },
      charts: (rows, id) => [hbars('Nhập kho so với số lượng dự án', rows.map((r, i) => ({ key: r.code, label: r.code, value: Math.round(r.stocked / (r.p.qty || 1) * 100), color: r.stocked >= r.p.qty ? C[2] : C[0], sub: `${num(r.stocked)} / ${num(r.p.qty)} ${r.p.unitName}`, drill: `${id}|g|0|${i}` })), { unit: '% số lượng', pct: true, max: 100 }),
        hbars('Theo tình trạng quyết toán', countBy(rows, (r) => r.st[0], ['Chưa có hợp đồng', 'Đang thực hiện hợp đồng', 'Sẵn sàng quyết toán']).map((x, i) => Object.assign(x, { drill: `${id}|g|1|${i}` })), { unit: 'dự án' })],
      groups: (rows) => [rows.map((r) => ({ label: `Dự án ${r.code}`, fn: (x) => x.code === r.code })), ['Chưa có hợp đồng', 'Đang thực hiện hợp đồng', 'Sẵn sàng quyết toán'].map((k) => ({ label: k, fn: (r) => r.st[0] === k }))],
      cols: [['Mã dự án', 140, '', link, (r) => r.code], ['Tên dự án', 260, '', (r) => K().clamp(r.title), (r) => r.title], ['Vật tư dự toán (đồng)', 170, 'r', (r) => `<span class="num">${num(r.est)}</span>`, (r) => r.est],
        ['Đề xuất đã gửi ĐTMS (đồng)', 190, 'r', (r) => `<span class="num">${num(r.prop)}</span>`, (r) => r.prop], ['Số hợp đồng', 110, 'r', (r) => `<span class="num">${r.hd}</span>`, (r) => r.hd],
        ['Giá trị hợp đồng (đồng)', 170, 'r', (r) => (r.hd ? `<span class="num">${num(r.hdv)}</span>` : K().dash), (r) => (r.hd ? r.hdv : '')],
        ['Chênh lệch (đồng)', 160, 'r', (r) => (r.gap == null ? K().dash : `<span class="num">${num(r.gap)}</span>`), (r) => (r.gap == null ? '' : r.gap)],
        ['Đã nhập kho', 140, 'r', (r) => `<span class="num">${num(r.stocked)} / ${num(r.p.qty)}</span>`, (r) => `${r.stocked}/${r.p.qty}`], ['Tình trạng', 190, 'c', (r) => badge(...r.st), (r) => r.st[0]]],
    },
  };
  /* Hồ sơ luồng → màn đối tượng cha (chi tiết dự án / phiếu / ECR / lô / đề xuất / gói chuyển giao). */
  function hrefCase(w) {
    const pre = { 'SX-BT': 'sx/bat-thuong/', 'SX-TD': 'sx/thay-doi/', 'SX-NT': 'sx/nghiem-thu/', 'SX-MS': 'sx/mua-sam/', 'SX-BG': 'sx/chuyen-giao/' }[w.flow];
    return pre ? pre + encodeURIComponent(w.obj) : w.project ? 'sx/du-an/' + encodeURIComponent(w.project) : 'sx/viec-cua-toi';
  }

  /* ---------- Khối lọc ---------- */
  function filterBar(withPeriod) {
    const ps = P().visible().filter((p) => !F.khoi || p.khoi === F.khoi);
    return `<section class="rp-filter sxr-filter">
      <div class="vfield" style="width:200px"><div class="lr"><label>Khối</label></div>${vSelect({ id: 'sxr-khoi', value: F.khoi, clear: true, searchable: false, placeholder: 'Tất cả', options: Object.entries(KHOI).map(([value, label]) => ({ value, label })), onChange: (v) => { F.khoi = v || null; if (F.project && !P().visible().some((p) => p.code === F.project && (!F.khoi || p.khoi === F.khoi))) F.project = null; clearDrill(); rerender(); } })}</div>
      <div class="vfield" style="width:360px"><div class="lr"><label>Dự án</label></div>${vSelect({ id: 'sxr-project', value: F.project, clear: true, searchable: true, placeholder: 'Tất cả', options: ps.map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })), onChange: (v) => { F.project = v || null; clearDrill(); rerender(); } })}</div>
      ${withPeriod ? `<div class="vfield" style="width:240px"><div class="lr"><label>Kỳ báo cáo</label></div>${vSelect({ id: 'sxr-period', value: F.period, searchable: false, options: Object.entries(PERIOD).map(([value, label]) => ({ value, label })), onChange: (v) => { F.period = v || 'DX'; rerender(); } })}</div>` : ''}
      </section>`;
  }
  const clearDrill = () => Object.keys(R).forEach((k) => { R[k].drill = null; });
  const filterTxt = () => `Khối: ${F.khoi ? KHOI[F.khoi] : 'Tất cả'}; Dự án: ${F.project || 'Tất cả'}`;

  /* ---------- SX-14 Báo cáo ---------- */
  const EX = {};
  function report(key) {
    // Theo: fe/repo-khcn-hr-tools-fe/src/app/features/reporting/report-dashboard (khối lọc, chỉ tiêu, biểu đồ, bảng chi tiết + Xuất báo cáo) — như SCR-93
    const cfg = REPORTS[key] || REPORTS['tien-do'], id = REPORTS[key] ? key : 'tien-do';
    const st = R[id] = R[id] || { drill: null };
    const rows = cfg.rows(), ms4 = cfg.metrics(rows), groups = cfg.groups(rows);
    const det = st.drill ? rows.filter(st.drill.fn) : rows;
    const [pFrom, pLabel] = cfg.period ? periodRange() : [0, ''];
    const ev = cfg.period ? events(pFrom) : [];
    const k = K();
    EX[id] = { title: cfg.title, cfg, rows: det, ms: ms4, ev, pLabel };
    const info = {
      scr: 'SX-14', name: `Báo cáo · ${cfg.title}`, uc: `SX-ULNL sheet NL Chuc nang › Báo cáo thống kê › Dashboard điều hành dự án › ${cfg.ulnl}`,
      notes: [
        'Khuôn chung của báo cáo (report-dashboard của repo-khcn-hr-tools-fe, như báo cáo ĐTMS): khối lọc → chỉ tiêu tổng hợp → biểu đồ theo chiều nhóm → bảng chi tiết → Xuất báo cáo. Mỗi báo cáo là một dòng cấu hình loại báo cáo (chỉ tiêu, chiều nhóm, cột) trên bộ máy Báo cáo dùng chung — không code riêng màn.',
        'Bộ lọc: <b>Khối</b>, <b>Dự án</b> (trong phạm vi dữ liệu của vai, như Danh sách dự án). Bấm ô chỉ tiêu hoặc thanh biểu đồ để lọc bảng chi tiết; bấm ← để quay lại danh sách đầy đủ; bấm mã để mở đối tượng nghiệp vụ.',
        'Số liệu tính từ cùng dữ liệu với các danh sách của phân hệ (dự án, kế hoạch & mốc, phiếu bất thường, yêu cầu thay đổi kỹ thuật, nghiệm thu, nhu cầu vật tư, đề xuất mua sắm, hồ sơ quy trình). Thật: API báo cáo của BE theo bộ lọc.',
        id === 'tien-do' ? '<b>Tiến độ</b>: Thực hiện = % hoàn thành ở tab Kế hoạch & mốc; Kế hoạch đến ngày = phần thời gian kế hoạch đã trôi qua của từng hạng mục, gộp cùng trọng số thời gian. Đúng tiến độ = % thực hiện thấp hơn % kế hoạch đến ngày dưới 15 điểm (ngưỡng nguy cơ chậm P-250); Hạng mục chậm = hạng mục quá hạn chưa xong (cột Mốc chậm của Danh sách dự án). <b>Kỳ báo cáo</b> (QT-TTSX-4A11 §5.4 bước 9, Q16): Đột xuất = lũy kế tại ngày lập; Định kỳ tuần / tháng / quý thêm bảng <b>Sự kiện trong kỳ</b> (sản lượng, bất thường, thay đổi kỹ thuật, nghiệm thu, nhập kho). GIẢ LẬP P-267: mẫu báo cáo tiến độ định kỳ, người nhận, lịch gửi tự động chưa có.' : '',
        id === 'chat-luong' ? '<b>Chất lượng</b>: IPQC (tab Chất lượng & nghiệm thu), OQC của đề nghị nghiệm thu, IQC đồng bộ VMMS (chỉ xem). Tỷ lệ đạt IPQC theo số lượng kiểm.' : '',
        id === 'bat-thuong' ? '<b>Bất thường</b>: trạng thái và hạn theo danh mục Loại bất thường và SLA (P-240, P-251).' : '',
        id === 'thay-doi' ? '<b>Thay đổi kỹ thuật</b>: nguồn = Lập trực tiếp / Từ phiếu bất thường Loại 2 / Hệ thống KHCN (P-257); cấp duyệt C1–C4 (P-252).' : '',
        id === 'vat-tu' ? '<b>Vật tư theo ngày cần</b>: dòng của Nhu cầu vật tư (ngày cần, hạn đặt hàng, tình trạng — P-260). Bảng <b>vật tư leadtime dài, Export License</b> theo biện pháp kiểm soát rủi ro QT-TTSX-4A11 §5.8: lập từ MBOM và dữ liệu mua sắm các dự án, kèm <b>mã tương đương có thể đổi chéo</b>. GIẢ LẬP P-267: mã tương đương là dữ liệu mẫu; ngưỡng leadtime dài 16 tuần như đề xuất mua sắm đợt 1.' : '',
        id === 'kpi' ? '<b>KPI quy trình</b> (SX-ULNL dòng 2536): (1) Tỷ lệ hoàn thành tiến độ sản xuất ≥ 90% — QT-TTSX-4A11 §5.7 (khối lượng hoàn thành / khối lượng yêu cầu của giai đoạn × 100, theo dõi hằng quý; ĐV QLSX thực hiện, ĐV ĐBCL rà soát); (2) bất thường xử lý đúng hạn ≥ 80%; (3) thay đổi kỹ thuật đúng hạn ≥ 90%. GIẢ LẬP P-267: KPI 1 tính trên kế hoạch đến ngày dữ liệu; hạn thay đổi kỹ thuật theo cấp C1 10 / C2 20 / C3 40 / C4 60 ngày làm việc; KPI 2, 3 chưa có văn bản gốc (QT 4A.1.2, 4A.1.3).' : '',
        id === 'cho-xu-ly' ? '<b>Thời gian chờ theo bên xử lý</b>: mỗi lượt = một việc của hồ sơ quy trình (nhận việc → xử lý xong, hoặc đang chờ đến hôm nay); bên xử lý theo vai của người được giao. Chuẩn = số ngày của bước trong cấu hình quy trình (mặc định 2). Thật: lịch sử task Camunda. GIẢ LẬP: tính ngày lịch, chưa trừ ngày nghỉ.' : '',
        id === 'quyet-toan' ? '<b>Đối chiếu quyết toán</b> (công đoạn 6, mức nhẹ — D-121 Q2, P-243): đối chiếu giá trị vật tư dự toán (MBOM), đề xuất mua sắm đã gửi ĐTMS, hợp đồng đọc ngược từ ĐTMS và số lượng đã nhập kho. Không lập hồ sơ quyết toán trên phân hệ.' : '',
        'Xuất báo cáo: tệp gồm bộ lọc, chỉ tiêu, bảng chi tiết' + (cfg.period ? ', sự kiện trong kỳ' : '') + (cfg.xextra ? ', danh sách vật tư leadtime dài' : '') + '. GIẢ LẬP: prototype tải .csv, BE xuất .xlsx.',
      ].filter(Boolean),
      q: ['P-243', 'P-267'], src: 'hr-tools reporting/report-dashboard · /reporting',
    };
    const tiles = ms4.map((m, i) => `<button type="button" class="ov-tile rp-tile ${st.drill && st.drill.label === m[0] ? 'on' : ''}" data-sxr-drill="${id}|m|${i}"><span class="ov-tx"><span class="t">${esc(m[0])}</span>${m[2] ? `<span class="d">${esc(m[2])}</span>` : ''}</span><span class="ov-n"><span class="n num ${m[4] ? 't-err' : ''}">${m[1]}</span></span></button>`).join('');
    const charts = cfg.charts(rows, id);
    const cols = cfg.cols;
    const tbl = det.length ? k.table(cols.map((c) => [c[0], c[1], c[2]]), det, (r) => cols.map((c) => `<td class="${c[2] || ''}">${c[3](r)}</td>`).join(''))
      : '<div class="empty-t">Không có dữ liệu phù hợp</div>';
    const evTbl = cfg.period ? `<section class="vcard" data-sxr-events><div class="vcard-h"><h3>Sự kiện trong kỳ — ${esc(pLabel)}</h3><span class="cap">${ev.length} sự kiện</span></div>
      ${ev.length ? k.table([['Ngày', 110], ['Dự án', 140], ['Loại', 160], ['Mã', 150], ['Nội dung', 420]], ev, (e) => `<td>${esc(dmy(e.date))}</td><td>${projCell(e.project)}</td><td>${esc(e.kind)}</td><td><a class="link" data-go="${e.href}">${esc(e.code)}</a></td><td>${k.clamp(e.text)}</td>`) : '<div class="empty-t">Không có sự kiện trong kỳ</div>'}</section>` : '';
    return `<div class="pg" data-sxr="${id}">${S.head({ title: cfg.title, info, right: `<span class="rp-at">Cập nhật lúc ${esc(F.at)}</span><button type="button" class="vbtn secondary" data-sxr-refresh>${icon('reload')} Làm mới dữ liệu</button>` })}
      ${filterBar(!!cfg.period)}
      ${cfg.period ? `<h2 class="rp-h2">Báo cáo tiến độ sản xuất — ${esc(PERIOD[F.period])} · ${esc(pLabel)}</h2>` : `<h2 class="rp-h2">${esc(cfg.title)}</h2>`}
      <div class="rp-tiles">${tiles}</div>
      ${cfg.lead ? cfg.lead() : ''}
      <div class="rp-g2">${charts.join('')}</div>
      <section class="flex vcard rp-det"><div class="vcard-h"><h3 class="${st.drill ? 'rp-back-h' : ''}">${st.drill ? `<button type="button" class="rp-back" data-sxr-back="${id}" title="Quay lại danh sách chi tiết đầy đủ" aria-label="Quay lại danh sách chi tiết đầy đủ">${icon('back')}</button>Chi tiết — ${esc(st.drill.label)}` : 'Danh sách chi tiết'}</h3>
        <div class="r"><button type="button" class="vbtn primary" data-sxr-export="${id}">${icon('excel')} Xuất báo cáo</button></div></div>
        ${st.drill ? '<p class="cap rp-drill-cap">Bảng đang lọc theo mục bạn đã bấm ở ô chỉ tiêu / biểu đồ. Bấm ← để quay lại danh sách chi tiết đầy đủ.</p>' : ''}
        ${tbl}</section>
      ${evTbl}${cfg.extra ? cfg.extra() : ''}</div>`;
  }

  /* ---------- SX-01 Tổng quan điều hành ---------- */
  const TQD = {};
  function overview() {
    // Theo: hr-tools reporting/report-dashboard (khối lọc) + ô chỉ số ecat common-catalog/overview; ngăn chi tiết = vht-modal dạng drawer — như SCR-92
    const ps = projects().map((p) => Object.assign({ code: p.code, title: p.name, href: 'sx/du-an/' + encodeURIComponent(p.code), p }, prog(p)));
    const since30 = isoL(today() - 30 * DAY);
    const lots = window.SxNt.all().filter((x) => inScope(x.project) && ['Đang nghiệm thu', 'Chờ nhập kho'].includes(window.SxNt.stOf(x)[0]));
    const accP = ps.filter((x) => x.p.status === 'ACCEPTANCE' || lots.some((l) => l.project === x.code));
    const iss = window.SxBt.all().filter((x) => inScope(x.project) && !x.closed).map((x) => Object.assign({}, x, { left: window.SxBt.leftOf(x), st: window.SxBt.stOf(x), href: 'sx/bat-thuong/' + encodeURIComponent(x.code) }));
    const issAtt = iss.filter((x) => x.left != null && x.left <= 2).sort((a, b) => a.left - b.left);
    const mats = window.SxNc.all().filter((r) => inScope(r.project) && r.st[0] === 'Trễ hạn đặt hàng').map((r) => Object.assign({}, r, { href: 'sx/nhu-cau', title: r.m.name }));
    const tds = window.SxTd.all().filter((x) => inScope(x.project) && !x.closed).map((x) => Object.assign({}, x, { href: 'sx/thay-doi/' + encodeURIComponent(x.code), st: window.SxTd.stOf(x) }));
    const pCols = [['Mã dự án', 140], ['Tên dự án', 280], ['Trạng thái', 150, 'c'], ['Thực hiện', 100, 'r'], ['Kế hoạch đến ngày', 140, 'r'], ['Hạng mục chậm', 120, 'r']];
    const pCell = (x) => `<td><a class="link" data-go="${x.href}" data-close>${esc(x.code)}</a></td><td>${K().clamp(x.title)}</td><td class="c">${badge(D.sxStatus[x.p.status], D.sxStatusV[x.p.status])}</td>
      <td class="r num">${x.act}%</td><td class="r num">${x.plan}%</td><td class="r num ${x.late.length ? 't-err' : ''}">${x.late.length}</td>`;
    /* [tên, mô tả (nguồn), danh sách cấu thành, cột, ô, màu] — SX-ULNL dòng 2526–2530 (5 chỉ số) + mục Cần chú ý của SX-01 (plan T71 §4). */
    const M = [
      ['Dự án lũy kế', 'Mọi dự án sản xuất đến hiện tại', ps, pCols, pCell],
      ['Dự án đang thực hiện', 'Chuẩn bị, đang sản xuất, nghiệm thu', ps.filter((x) => x.run), pCols, pCell],
      ['Dự án đúng tiến độ', `Đang thực hiện, chậm dưới ${LATE_PT} điểm so với kế hoạch`, ps.filter((x) => onTrack(x.p, x)), pCols, pCell],
      ['Dự án đang nghiệm thu', 'Có lô đang nghiệm thu hoặc chờ nhập kho', accP, pCols, pCell],
      ['Dự án mới mở', `Tạo trong 30 ngày gần nhất (từ ${dmy(since30)})`, ps.filter((x) => (x.p.created || '') >= since30), pCols, pCell],
    ];
    const A = [
      ['Bất thường quá hạn, sắp đến hạn', 'Chưa đóng, còn dưới 3 ngày làm việc', issAtt, [['Mã phiếu', 130], ['Tiêu đề', 280], ['Dự án', 140], ['Hạn xử lý', 120], ['Còn lại', 120, 'c']],
        (x) => `<td><a class="link" data-go="${x.href}" data-close>${esc(x.code)}</a></td><td>${K().clamp(x.title)}</td><td>${esc(x.project)}</td><td>${esc(dmy(x.due))}</td><td class="c">${x.left < 0 ? badge(`Quá hạn ${-x.left} ngày`, 'error') : x.left === 0 ? badge('Đến hạn hôm nay', 'warning') : badge(`Còn ${x.left} ngày`, 'warning')}</td>`, 'bad'],
      ['Vật tư trễ hạn đặt hàng', 'Thiếu so với tồn kho, quá hạn đặt hàng', mats, [['Mã nhu cầu', 130], ['Dự án', 140], ['Vật tư', 260], ['Còn thiếu', 110, 'r'], ['Hạn đặt hàng', 120]],
        (x) => `<td><a class="link" data-go="${x.href}" data-close>${esc(x.code)}</a></td><td>${esc(x.project)}</td><td>${K().clamp(`${x.mat} — ${x.m.name}`)}</td><td class="r num">${num(x.short)}</td><td class="t-err">${esc(dmy(x.order))}</td>`, 'bad'],
      ['Thay đổi kỹ thuật đang xử lý', 'Chưa bàn giao nhà máy áp dụng', tds, [['Mã yêu cầu', 130], ['Tiêu đề', 300], ['Dự án', 140], ['Trạng thái', 170, 'c']],
        (x) => `<td><a class="link" data-go="${x.href}" data-close>${esc(x.code)}</a></td><td>${K().clamp(x.title)}</td><td>${esc(x.project)}</td><td class="c">${badge(...x.st)}</td>`, 'warn'],
      ['Lô chờ nghiệm thu, nhập kho', 'Đề nghị nghiệm thu chưa nhập kho', lots.map((x) => Object.assign({}, x, { href: 'sx/nghiem-thu/' + encodeURIComponent(x.code) })), [['Mã đề nghị', 130], ['Dự án', 140], ['Hạng mục', 220], ['Số lượng', 110, 'r'], ['Trạng thái', 160, 'c']],
        (x) => `<td><a class="link" data-go="${x.href}" data-close>${esc(x.code)}</a></td><td>${esc(x.project)}</td><td>${K().clamp(x.itemText)}</td><td class="r num">${num(x.qty)}</td><td class="c">${badge(...window.SxNt.stOf(x))}</td>`, 'warn'],
    ];
    M.forEach((m, i) => { TQD['m' + i] = m; }); A.forEach((m, i) => { TQD['a' + i] = m; });
    const tile = (m, key) => `<button type="button" class="ov-tile rp-tile tq-m" data-sxtq="${key}"><span class="ov-tx"><span class="t">${esc(m[0])}</span><span class="d">${esc(m[1])}</span></span>
      <span class="ov-n"><span class="n num ${m[5] && m[2].length ? m[5] : ''}">${m[2].length}</span></span></button>`;
    const run = ps.filter((x) => x.run || x.p.status === 'PLANNING');
    /* Biểu đồ Dashboard (nhánh hoaidt10): cùng nguồn số liệu với các danh sách SX; tái dùng hbars / pairs của Báo cáo. */
    const withColor = (a, cs) => a.map((x, i) => Object.assign(x, { color: cs[i % cs.length] }));
    const stKeys = Object.keys(D.sxStatus || {});
    const cProg = pairs('Tiến độ dự án: thực hiện so với kế hoạch đến ngày', run.map((x) => ({ label: x.code, a: x.act, b: x.plan, late: x.gap <= -LATE_PT })));
    const btAll = window.SxBt.all().filter((x) => inScope(x.project));
    const cBt = hbars('Phiếu bất thường theo trạng thái', withColor(countBy(btAll, (x) => window.SxBt.stOf(x)[0]), [C[1], C[3], C[0], C[2], C[5]]), { unit: 'phiếu' });
    const tdAll = window.SxTd.all().filter((x) => inScope(x.project));
    const cTd = hbars('Thay đổi kỹ thuật theo trạng thái', withColor(countBy(tdAll, (x) => window.SxTd.stOf(x)[0]), [C[4], C[0], C[3], C[2], C[5]]), { unit: 'yêu cầu' });
    const cKpi = hbars('KPI quy trình so với mục tiêu', kpis().filter((x) => x.value != null).map((x) => ({ label: x.name, value: x.value, sub: 'MT ' + x.target + '%', color: x.value >= x.target ? C[2] : C[1] })), { pct: true, max: 100 });
    const STC = { PLANNING: C[5], PREPARING: C[3], IN_PRODUCTION: C[2], ACCEPTANCE: C[0], DONE: C[4] };
    const dStatus = donut('Dự án theo trạng thái', stKeys.map((k) => ({ label: D.sxStatus[k], value: ps.filter((x) => x.p.status === k).length, color: STC[k] || C[5] })), { unit: 'dự án', note: `Dự án mới mở trong 30 ngày gần nhất (từ ${dmy(since30)}): ${M[4][2].length}` });
    const runP = ps.filter((x) => x.run);
    const dTrack = donut('Dự án đang thực hiện theo tiến độ', [{ label: 'Đúng tiến độ', value: runP.filter((x) => onTrack(x.p, x)).length, color: C[2] }, { label: 'Chậm tiến độ', value: runP.filter((x) => !onTrack(x.p, x)).length, color: C[1] }], { unit: 'đang thực hiện', note: `Chậm từ ${LATE_PT} điểm trở lên so với kế hoạch đến ngày` });
    const donuts = `<section class="tq-blk" data-sx-so-du-an><h2 class="rp-h2">Số dự án</h2><p class="cap">Theo bộ lọc Khối, Dự án ở trên</p><div class="rp-g2">${dStatus}${dTrack}</div></section>`;
    const charts = `<section class="tq-blk" data-sx-bieu-do><h2 class="rp-h2">Biểu đồ</h2><p class="cap">Theo bộ lọc Khối, Dự án ở trên</p><div class="rp-g2">${cProg}${cBt}${cTd}${cKpi}</div></section>`;
    const info = {
      scr: 'SX-01', name: 'Dashboard', uc: 'SX-ULNL sheet NL Chuc nang › Báo cáo thống kê › Tổng quan dự án (dòng 2526–2530); SX-KS-K2 §2.4 (Dashboard KPI sản xuất); plan T71 §4 SX-01',
      notes: [
        '<b>T74 (comment #95):</b> mục menu <b>Tổng quan</b> đổi tên <b>Dashboard</b>, đứng đầu menu như phân hệ KHCN. Khối <b>Gợi ý cho bạn</b> đã bỏ khỏi trang (nhánh hoaidt10).',
        '<b>Số dự án</b> — 5 chỉ số của SX-ULNL: lũy kế, đang thực hiện (Chuẩn bị sản xuất, Đang sản xuất, Nghiệm thu), đúng tiến độ (đang thực hiện, % thực hiện thấp hơn % kế hoạch đến ngày dưới 15 điểm — ngưỡng nguy cơ chậm P-250; cột Hạng mục chậm vẫn đếm hạng mục quá hạn chưa xong như cột Mốc chậm ở Danh sách dự án), đang nghiệm thu (trạng thái Nghiệm thu hoặc có lô đang nghiệm thu / chờ nhập kho), mới mở (tạo trong 30 ngày gần nhất).',
        '<b>Cần chú ý</b>: phiếu bất thường quá hạn / còn dưới 3 ngày làm việc (SLA), vật tư trễ hạn đặt hàng (Nhu cầu vật tư), thay đổi kỹ thuật chưa hoàn thành, lô chờ nghiệm thu / nhập kho.',
        'Bấm ô chỉ số → ngăn chi tiết bên phải: danh sách bản ghi cấu thành con số, bấm mã mở màn chi tiết. Bảng <b>Tiến độ dự án so với kế hoạch</b>: dự án chưa hoàn thành; biểu đồ phân tích xem ở mục Báo cáo.',
        '<b>Cấu hình</b>: một dòng định nghĩa báo cáo loại Tổng quan (như D-119) — chỉ số, nguồn, ngưỡng sắp đến hạn. Bộ lọc Khối, Dự án theo phạm vi dữ liệu của vai. Thật: API tổng hợp của BE; "Làm mới dữ liệu" gọi lại API.',
        'GIẢ LẬP P-267: ngưỡng "mới mở" 30 ngày và "sắp đến hạn" 3 ngày làm việc chưa có trong tài liệu; ngày dữ liệu cố định ' + dmy(D.sxToday) + '.',
      ],
      q: ['P-243', 'P-267', 'P-268'], src: 'hr-tools reporting/report-dashboard · /reporting',
    };
    return `<div class="pg" data-sxtq-page>${S.head({ title: 'Dashboard', info, right: `<span class="rp-at">Cập nhật lúc ${esc(F.at)}</span><button type="button" class="vbtn secondary" data-sxr-refresh>${icon('reload')} Làm mới dữ liệu</button>` })}
      ${filterBar(false)}
      ${donuts}
      <section class="tq-blk"><h2 class="rp-h2">Cần chú ý</h2>
        <div class="rp-tiles">${A.map((m, i) => tile(m, 'a' + i)).join('')}</div></section>
      ${charts}
      ${K().card('Tiến độ dự án so với kế hoạch', run.length ? K().table([['Mã dự án', 140], ['Tên dự án', 280], ['Khối', 80], ['Trạng thái', 150, 'c'], ['Giai đoạn hiện tại', 220], ['Thực hiện', 100, 'r'], ['Kế hoạch đến ngày', 140, 'r'], ['Chênh lệch', 110, 'r'], ['Hạng mục chậm', 120, 'r']], run,
        (x) => `<td><a class="link" data-go="${x.href}">${esc(x.code)}</a></td><td>${K().clamp(x.title)}</td><td>${esc(KHOI[x.p.khoi])}</td><td class="c">${badge(D.sxStatus[x.p.status], D.sxStatusV[x.p.status])}</td><td>${K().clamp(x.stage)}</td>
          <td class="r num">${x.act}%</td><td class="r num">${x.plan}%</td><td class="r num ${x.gap < 0 ? 't-err' : ''}">${x.gap > 0 ? '+' : ''}${x.gap} điểm</td><td class="r num ${x.late.length ? 't-err' : ''}">${x.late.length}</td>`)
        : '<div class="empty-t">Không có dự án chưa hoàn thành theo bộ lọc</div>', `${run.length} dự án chưa hoàn thành · <a class="link" data-go="sx/bao-cao/tien-do">Xem báo cáo tiến độ</a>`)}</div>`;
  }
  function tqDrawer(key) {
    const m = TQD[key]; if (!m) return;
    const tbl = m[2].length ? K().table(m[3], m[2], m[4]) : '<div class="empty-t">Không có dữ liệu phù hợp</div>';
    const d = window.UI.vModal({ title: m[0], size: 'drawer', body: `<div class="stack"><p class="cap">${esc(m[1])} · ${esc(filterTxt())}</p><div class="tq-dr-n"><b>${m[2].length}</b> bản ghi</div>${tbl}</div>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
    d.el.dataset.sxtqDrawer = key;
  }

  /* ---------- Xuất báo cáo (.csv thay .xlsx — GIẢ LẬP) ---------- */
  function download(name, lines) {
    const strip = (v) => String(v == null ? '' : v).replace(/<[^>]+>/g, '').replace(/"/g, '""');
    const csv = '﻿' + lines.map((l) => l.map((v) => `"${strip(v)}"`).join(',')).join('\n');
    try { const u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000); } catch (err) { /* bỏ qua */ }
  }
  const fileName = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '_');
  function exportReport(id) {
    const x = EX[id]; if (!x) return;
    const who = window.UI.persona(Flow.state.persona).name;
    const lines = [[`Báo cáo ${x.title}${x.cfg.period ? ` — ${PERIOD[F.period]} · ${x.pLabel}` : ''}`], [filterTxt()], [`Người xuất: ${who}; ngày dữ liệu: ${dmy(D.sxToday)}`], [],
      ['[Chỉ tiêu]'], ...x.ms.map((m) => [m[0], m[1], m[2]]), [], ['[Chi tiết]'], ['STT'].concat(x.cfg.cols.map((c) => c[0])), ...x.rows.map((r, i) => [i + 1].concat(x.cfg.cols.map((c) => c[4](r))))];
    if (x.cfg.period) lines.push([], [`[Sự kiện trong kỳ — ${x.pLabel}]`], ['STT', 'Ngày', 'Dự án', 'Loại', 'Mã', 'Nội dung'], ...x.ev.map((e, i) => [i + 1, dmy(e.date), e.project, e.kind, e.code, e.text]));
    if (x.cfg.xextra) lines.push([], ...x.cfg.xextra());
    const name = `Bao_cao_${fileName(x.title)}_${D.sxToday.replace(/-/g, '')}.csv`;
    download(name, lines);
    toast(`<b>Thành công</b><br>Xuất báo cáo thành công (${x.rows.length} dòng chi tiết) — ${esc(name)}`);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target; if (!t) return;
    const q = t.closest('[data-sxtq]'); if (q) { tqDrawer(q.dataset.sxtq); return; }
    const dr = t.closest('[data-sxr-drill]');
    if (dr) {
      const [id, kind, a, b] = dr.dataset.sxrDrill.split('|'), cfg = REPORTS[id]; if (!cfg) return;
      const rows = cfg.rows();
      const pick = kind === 'm' ? (() => { const m = cfg.metrics(rows)[Number(a)]; return m && { label: m[0], fn: m[3] }; })() : (cfg.groups(rows)[Number(a)] || [])[Number(b)];
      if (!pick) return;
      R[id] = R[id] || {}; R[id].drill = R[id].drill && R[id].drill.label === pick.label ? null : pick;
      rerender(); return;
    }
    const bk = t.closest('[data-sxr-back]'); if (bk) { (R[bk.dataset.sxrBack] || {}).drill = null; rerender(); return; }
    const ex = t.closest('[data-sxr-export]'); if (ex) { exportReport(ex.dataset.sxrExport); return; }
    if (t.closest('[data-sxr-refresh]')) { const n = new Date(), p2 = (v) => String(v).padStart(2, '0'); F.at = `${dmy(D.sxToday)} ${p2(n.getHours())}:${p2(n.getMinutes())}`; rerender(); toast('<b>Thành công</b><br>Đã làm mới dữ liệu'); }
  });

  const reset = () => { F.khoi = null; F.project = null; F.period = 'DX'; clearDrill(); };
  window.SxBc = { overview, report, REPORTS, kpis, vtlk, settle, waits, prog, reset };
})();
