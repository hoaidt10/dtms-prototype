/* Phân hệ Quản lý sản xuất — Chất lượng & nghiệm thu (T71 S8, D-121). SX-12: danh sách đề nghị nghiệm thu lô, Tra cứu hồ sơ theo số sê-ri, chi tiết; luồng SX-NT trên sx-flow.js;
   tab Chất lượng & nghiệm thu của dự án (IQC đồng bộ VMMS chỉ xem, các lô, nhập kho).
   OQC Không đạt → kết thúc hồ sơ, hệ thống lập phiếu bất thường (SxBt.createAuto). Lãnh đạo duyệt → cấp chứng chỉ chất lượng. Đề nghị nhập kho bị chặn khi lô chưa có biên bản đạt (GUARD nt.minutes).
   Bước 6 nhận phiếu nhập kho (API-04, GIẢ LẬP P-253). Route: #/sx/nghiem-thu, #/sx/nghiem-thu/<mã>. Lưu localStorage sx-proto-nt. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const matName = (c) => (Object.values(window.D.sxMbom || {}).flat().find((m) => m.code === c) || {}).name || '';
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const F = () => window.SxFlow;
  const P = () => window.SxDuAn;
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };

  /* ---------- Lưu ---------- */
  const KEY = 'sx-proto-nt';
  const blank = () => ({ created: [], edit: {}, ipqc: [], trial: {}, oqc: [], oqcDel: [], oqcDone: {}, ntm: [] });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const patch = (code, data) => { const own = U.created.find((x) => x.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign({}, U.edit[code], data); persist(); };

  /* ---------- Lô ---------- */
  const ser = (project, n) => { const [pre, w] = D.sxSerial[project] || ['SN-', 5]; return pre + String(n).padStart(w, '0'); };
  const itemsOf = (p) => P().b9Items(p);
  function decorate(x) {
    const p = P().byCode(x.project), it = p ? itemsOf(p).find((i) => i.key === x.item) : null;
    return Object.assign({}, x, { pm: p ? p.pm : null, itemText: it ? it.name : x.item, unitName: p ? p.unitName : '', serials: `${ser(x.project, x.from)} – ${ser(x.project, x.to)}` });
  }
  const all = () => U.created.concat(D.sxLots).map((x) => decorate(Object.assign({}, x, U.edit[x.code] || {})));
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const caseOf = (x) => { const l = F().cases(x.code, 'SX-NT'); return l[l.length - 1] || null; };
  function stOf(x) {
    if (x.oqc === 'NOK') return ['Không đạt OQC', 'error'];
    if (x.stocked) return ['Đã nhập kho', 'success'];
    if (x.cert) return ['Chờ nhập kho', 'info'];
    return ['Đang nghiệm thu', 'warning'];
  }
  const stepOf = (x) => { const c = caseOf(x); if (!c || c.status === 'done') return ''; const st = D.sxFlows['SX-NT'].steps.find((s) => String(s[0]) === String((c.tokens[0] || {}).step)); return st ? `${st[0]}. ${st[1]}` : ''; };
  /* Số còn đề nghị được = đã sản xuất (bán thành phẩm / lô: lũy kế; mốc VMC: % × số lượng dự án) − đã đề nghị (trừ lô không đạt). */
  function available(p, ck) {
    const it = itemsOf(p).find((i) => i.key === ck), r = window.SxBtp.progress(p, ck);
    const made = it && it.target == null ? Math.floor(r.pct * p.qty / 100) : r.done;
    return made - all().filter((x) => x.project === p.code && x.item === ck && x.oqc !== 'NOK').reduce((a, x) => a + x.qty, 0);
  }
  const nextFrom = (project) => Math.max(0, ...all().filter((x) => x.project === project).map((x) => x.to)) + 1;
  const nextCode = (list, key, pre, w) => { const n = Math.max(0, ...list.map((x) => x[key]).filter(Boolean).map((c) => Number(String(c).slice(-w)))) + 1; return `${pre}${String(n).padStart(w, '0')}`; };
  const allPnk = () => all().map((x) => ({ pnk: x.pnk })).concat(D.sxProposals.flatMap((pr) => ((pr.sync || {}).kho || []).map((k) => ({ pnk: k[0] }))));
  const involved = (x) => F().cases(x.code).some((c) => c.tokens.some((t) => t.who === pid()) || c.hist.some((h) => h.who === pid()));
  const visible = () => { const ids = new Set(P().visible().map((p) => p.code)); return all().filter((x) => ids.has(x.project) || involved(x)); };
  const RUN = ['IN_PRODUCTION', 'ACCEPTANCE'];
  const canRequest = (p) => RUN.includes(p.status) && (isAdmin() || p.pm === pid() || (pid() === 'sxnm' && p.factory === 'NM-HP'));

  /* ---------- Bộ chặn, bộ xử lý hành động của SX-NT ---------- */
  Object.assign(F().GUARD, {
    'nt.minutes': (c) => { const x = byCode(c.obj); return x && x.bb && x.cert ? null : 'Lô chưa có biên bản nghiệm thu đạt và chứng chỉ chất lượng, chưa đề nghị nhập kho được.'; },
  });
  /* (b) Q12: trạng thái dự án theo nghiệm thu — đủ số lượng dự án đã vào nghiệm thu → Nghiệm thu; đủ số lượng đã nhập kho → PM Đóng dự án (bước 15) → Hoàn thành. */
  const lotQty = (code) => all().filter((x) => x.project === code && x.oqc !== 'NOK').reduce((a, x) => a + x.qty, 0);
  const stockQty = (code) => all().filter((x) => x.project === code && x.stocked).reduce((a, x) => a + x.qty, 0);
  Object.assign(F().ACT, {
    'nt.start': (c) => {
      const x = byCode(c.obj), p = x && P().byCode(x.project);
      if (p && p.status === 'IN_PRODUCTION' && lotQty(p.code) >= p.qty) P().patch(p.code, { status: 'ACCEPTANCE' }, 'Chuyển nghiệm thu', `Đủ ${num(p.qty)} ${p.unitName} đã vào nghiệm thu`);
    },
    'nt.oqc': (c, ch, x) => {
      const it = byCode(c.obj), v = x.values || {};
      if (ch && ch[2] === 'no') {
        c.vars.oqcNok = true;
        const bt = window.SxBt.createAuto({ project: it.project, title: `Lô ${it.code} không đạt đánh giá xuất xưởng (OQC)`, desc: v.oqcKetQua || '', place: 'Đánh giá chất lượng xuất xưởng', qty: it.qty });
        patch(c.obj, { oqc: 'NOK', issue: bt });
        P().log(it.project, 'Lô không đạt đánh giá xuất xưởng', `${it.code} → phiếu bất thường ${bt}`);
      } else patch(c.obj, { oqc: 'DAT' });
    },
    'nt.cert': (c, ch) => {
      if (ch && ch[2] === 'no') return;
      const it = byCode(c.obj), cert = nextCode(all(), 'cert', 'CQ-2026-', 4), v = c.vars;
      patch(c.obj, { bb: v.bbSo, cert });
      if (v.bbFile) P().addDoc(it.project, [v.bbFile, 'NT', it.code, pid(), D.sxToday]);
      if (v.bbHoc) P().addDoc(it.project, [v.bbHoc, 'HOC', it.code, pid(), D.sxToday]);
      if (v.bbCoCq) P().addDoc(it.project, [v.bbCoCq, 'COCQ', it.code, pid(), D.sxToday]);
      P().log(it.project, 'Phê duyệt nghiệm thu, cấp chứng chỉ chất lượng', `${it.code}: ${cert}`);
    },
    'nt.stock': (c) => {
      const it = byCode(c.obj), pnk = nextCode(allPnk(), 'pnk', 'PNK-2026-', 4);
      patch(c.obj, { pnk, stocked: D.sxToday });
      if (c.vars.nkBbBaoGoi) P().addDoc(it.project, [c.vars.nkBbBaoGoi, 'NT', `${it.code} · sau bao gói`, pid(), D.sxToday]);
      P().log(it.project, 'Nhập kho Tổng công ty', `${it.code}: ${pnk} (${num(it.qty)} ${it.unitName})`);
      const p = P().byCode(it.project);
      if (p && stockQty(p.code) >= p.qty) P().log(p.code, 'Đủ số lượng nhập kho', 'Sẵn sàng đóng dự án, lưu hồ sơ sản xuất');
    },
  });

  /* ---------- Tra cứu theo số sê-ri ---------- */
  function lookup(s) {
    const q = String(s || '').trim().toUpperCase();
    for (const [project, [pre]] of Object.entries(D.sxSerial)) {
      if (!q.startsWith(pre) || !/^\d+$/.test(q.slice(pre.length))) continue;
      const n = Number(q.slice(pre.length)), lot = all().filter((x) => x.project === project && x.oqc !== 'NOK').find((x) => n >= x.from && n <= x.to);
      if (!lot) return { q, none: true };
      /* Thay đổi kỹ thuật áp dụng: ECN đã bàn giao nhà máy, áp dụng từ số sê-ri ≤ sê-ri tra cứu. */
      const ecn = window.SxTd ? window.SxTd.all().filter((t) => t.project === project && t.ecn && t.closed).map((t) => { const c = F().cases(t.code, 'SX-TD').slice(-1)[0] || { vars: {} }; return Object.assign({}, t, { from: c.vars.bgSeri || '' }); })
        .filter((t) => { const m = /(\d+)$/.exec(t.from); return m && Number(m[1]) <= n; }) : [];
      return { q, lot, project: P().byCode(project), ecn };
    }
    return { q, none: true };
  }
  const M = { seri: '', res: null };
  function lookupCard() {
    const k = K(), r = M.res;
    let out = '';
    if (r && r.none) out = `<p class="t-err" data-sxnt-res>Không tìm thấy số sê-ri ${esc(r.q)} trong hồ sơ nghiệm thu.</p>`;
    else if (r) {
      const x = r.lot;
      out = `<div data-sxnt-res><div class="ginfo c3">${k.kv('Số sê-ri', esc(r.q))}${k.kv('Dự án', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a> · ${esc(r.project.product)} ${esc(r.project.version)}`)}
        ${k.kv('Lô nghiệm thu', `<a class="link" data-go="${href(x)}">${esc(x.code)}</a> · ${esc(x.itemText)}`)}${k.kv('Đánh giá xuất xưởng', x.oqc === 'DAT' ? badge('Đạt', 'success') : badge('Chưa đánh giá', 'default'))}
        ${k.kv('Biên bản nghiệm thu', x.bb ? esc(x.bb) : null)}${k.kv('Chứng chỉ chất lượng', x.cert ? esc(x.cert) : null)}${k.kv('Phiếu nhập kho', x.pnk ? esc(`${x.pnk} · ${dmy(x.stocked)}`) : null)}
        ${k.kv('Thay đổi kỹ thuật đã áp dụng', r.ecn.length ? r.ecn.map((t) => `<a class="link" data-go="sx/thay-doi/${encodeURIComponent(t.code)}">${esc(t.ecn)}</a> (từ ${esc(t.from)})`).join(', ') : null, 'span2')}</div></div>`;
    }
    return `<section class="vcard pad24" data-sxnt-seri><div class="vcard-h"><h3>Tra cứu hồ sơ theo số sê-ri</h3></div>
      <div class="row" style="gap:8px;margin-bottom:12px"><label class="vsearch" style="width:320px">${icon('search')}<input id="sxnt-seri" maxlength="50" placeholder="Nhập số sê-ri, vd WM6-045120" value="${esc(M.seri)}"></label>
      <button type="button" class="vbtn primary" data-sxnt-find>Tra cứu</button></div>${out}</section>`;
  }

  /* ---------- SX-12 Danh sách ---------- */
  const href = (x) => 'sx/nghiem-thu/' + encodeURIComponent(x.code);
  function list() {
    const k = K();
    const info = {
      scr: 'SX-12', name: 'Nghiệm thu sản phẩm', uc: 'SX-KS-K1 §3.1 bước 12–14; SX-KS-K2 §4.3 (nghiệm thu theo lô), §6 API-04',
      notes: [
        'Đề nghị nghiệm thu lô là đối tượng cha của hồ sơ luồng nghiệm thu (6 bước nháp — GIẢ LẬP P-238). Đề nghị ở tab Chất lượng & nghiệm thu của dự án; số lượng không vượt số đã sản xuất chưa nghiệm thu; sê-ri cấp liên tiếp (P-253).',
        'OQC Không đạt → hồ sơ kết thúc, hệ thống lập phiếu bất thường. Lãnh đạo duyệt biên bản → cấp chứng chỉ chất lượng. Đề nghị nhập kho bị chặn khi lô chưa có biên bản đạt; phiếu nhập kho nhận qua API-04 (GIẢ LẬP).',
        '<b>Tra cứu hồ sơ theo số sê-ri</b>: lô, kết quả OQC, biên bản, chứng chỉ, phiếu nhập kho và thay đổi kỹ thuật (ECN) đã áp dụng từ số sê-ri bàn giao.',
      ],
      q: ['P-238', 'P-253'], src: 'task-management/task-management.component · /task-management',
    };
    return k.listPage({
      id: 'sxnt', exp: 'Nghiem thu san pham', title: 'Nghiệm thu sản phẩm', ph: 'Tìm kiếm theo mã, dự án, chứng chỉ', info, top: lookupCard(),
      rows: () => visible().map((x) => Object.assign(x, { st: stOf(x), step: stepOf(x) })).sort((a, b) => (a.code < b.code ? 1 : -1)),
      kwText: (x) => `${x.code} ${x.project} ${x.cert || ''} ${x.pnk || ''}`,
      empty: () => ({ code: '', project: null }),
      match: (x, f) => k.has(f.code, x.code) && (!f.project || x.project === f.project),
      adv: (txt, sel) => `${txt('code', 'Mã đề nghị')}${sel('project', 'Dự án', { options: P().visible().map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` })) })}`,
      cols: [['Trạng thái', 150, 'c'], ['Đề nghị nghiệm thu (hạng mục / lô)', 300], ['Dự án', 240], ['Số lượng', 110, 'r'], ['Dải sê-ri', 220], ['Biên bản', 110], ['Chứng chỉ', 130], ['Phiếu nhập kho', 140], ['Bước hiện tại', 240]],
      href,
      cell: (x) => `<td class="c">${badge(...x.st)}</td><td>${NC(x.itemText, x.code, { go: href(x), tip: 'Xem chi tiết đề nghị nghiệm thu' })}</td><td>${PJ(x.project)}</td><td class="r num">${num(x.qty)}</td>
        <td class="num">${esc(x.serials)}</td><td>${x.bb ? esc(x.bb) : k.dash}</td><td>${x.cert ? esc(x.cert) : k.dash}</td><td>${x.pnk ? esc(x.pnk) : k.dash}</td><td>${x.step ? k.clamp(x.step) : k.dash}</td>`,
    });
  }

  /* ---------- Đề nghị nghiệm thu (= bước 1) ---------- */
  async function create(project) {
    const p = P().byCode(project), f = window.EForms.sx['SX-NT'].dn;
    const items = itemsOf(p).map((i) => [i.key, `${i.name} — còn ${num(available(p, i.key))} ${p.unitName}`, available(p, i.key)]).filter((i) => i[2] > 0);
    if (!items.length) { toast('Dự án chưa có sản phẩm hoàn thành chưa nghiệm thu.', 'warn'); return; }
    const r = await window.EFormRun.open({ title: 'Đề nghị nghiệm thu lô', schema: Object.assign({ id: f.id }, f.schema({ projectText: `${p.code} — ${p.name}`, items: items.map((i) => [i[0], i[1]]) })), values: { ntItem: items[0][0] },
      check: (v) => { const a = available(p, v.ntItem); return Number(v.ntQty) > a ? `Số lượng đề nghị vượt số đã sản xuất chưa nghiệm thu (${num(a)} ${p.unitName}).` : null; } });
    if (!r || !r.submit) return;
    const v = r.values, code = nextCode(all(), 'code', 'NT-2026-', 3), from = nextFrom(project), qty = Number(v.ntQty);
    U.created.unshift({ code, project, item: v.ntItem, qty, from, to: from + qty - 1, creator: pid(), created: D.sxToday, note: v.ntGhiChu || '' });
    persist();
    const c = F().start('SX-NT', code);
    F().complete(c.code, c.tokens[0].id, -1, v);
    P().log(project, 'Đề nghị nghiệm thu lô', `${code}: ${num(qty)} ${p.unitName}`);
    toast('<b>Thành công</b><br>Gửi đề nghị nghiệm thu thành công!');
    location.hash = '#/' + href({ code });
  }

  /* ---------- Chi tiết (cũng là thân màn xử lý việc của SX-NT) ---------- */
  const tabKey = (code) => 'nt:' + code;
  function detail(code, opt) {
    const o = opt || {}, k = K(), x = byCode(code);
    if (!x || !visible().some((y) => y.code === code)) return `<div class="pg">${head({ title: o.title || 'Xem chi tiết đề nghị nghiệm thu', back: o.back || 'sx/nghiem-thu', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy đề nghị nghiệm thu hoặc bạn không có quyền xem.')}</div>`;
    const c = caseOf(x), v = (c && c.vars) || {};
    const info = { scr: 'SX-12', name: 'Chi tiết đề nghị nghiệm thu lô', uc: 'SX-KS-K1 §3.1 bước 12–14; SX-KS-K2 §4.3', notes: ['Khuôn task-create (mode detail) + app-tabs; màn xử lý việc của luồng nghiệm thu dùng chính thân màn này + thanh trạng thái.'], q: ['P-253', 'P-258'], src: 'task-create (mode detail) · app-tabs' };
    const tInfo = () => k.card('Thông tin lô', `<div class="ginfo c3">${k.kv('Mã đề nghị', esc(x.code))}${k.kv('Trạng thái', badge(...stOf(x)))}${k.kv('Dự án sản xuất', `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.project)}">${esc(x.project)}</a>`)}
        ${k.kv('Hạng mục / lô', esc(x.itemText))}${k.kv('Số lượng', `${num(x.qty)} ${esc(x.unitName)}`)}${k.kv('Dải số sê-ri', esc(x.serials))}
        ${k.kv('Người đề nghị', esc(pName(x.creator)))}${k.kv('Ngày đề nghị', esc(dmy(x.created)))}${k.kv('Phiếu bất thường', x.issue ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.issue)}">${esc(x.issue)}</a>` : null)}</div>`);
    const tKq = () => `<div data-sxnt-kq>${k.card('Kết quả kiểm tra và nghiệm thu', `<div class="ginfo c3">
        ${k.kv('Đánh giá xuất xưởng (OQC)', x.oqc ? badge(x.oqc === 'DAT' ? 'Đạt' : 'Không đạt', x.oqc === 'DAT' ? 'success' : 'error') : null)}${k.kv('Cỡ mẫu', v.oqcMau ? esc(v.oqcMau) : null)}${k.kv('Kết quả OQC', v.oqcKetQua ? esc(v.oqcKetQua) : null)}
        ${k.kv('Biên bản nghiệm thu', x.bb ? esc(x.bb) : null)}${k.kv('Kết luận', v.bbKetLuan ? esc(v.bbKetLuan) : null, 'span2')}
        ${k.kv('Chứng chỉ chất lượng', x.cert ? esc(x.cert) : null)}${k.kv('Phiếu nhập kho TCT', x.pnk ? esc(x.pnk) : null)}${k.kv('Ngày nhập kho', x.stocked ? esc(dmy(x.stocked)) : null)}</div>`)}</div>`;
    const tTt = () => { if (!c) return k.card('Tiến trình', '<p class="faint">Chưa có hồ sơ.</p>'); const pr = F().progress(c); return k.card('Hồ sơ nghiệm thu', pr.top + pr.steps) + k.card('Lịch sử xử lý', pr.hist); };
    return `<div class="pg" data-sxnt-detail="${esc(x.code)}">
      ${head({ title: o.title || 'Xem chi tiết đề nghị nghiệm thu', back: o.back || 'sx/nghiem-thu', lg: true, info })}
      ${o.bar || ''}
      ${k.tabs(tabKey(x.code), [['info', 'Thông tin lô'], ['kq', 'Kết quả kiểm tra'], ['tt', 'Tiến trình']], { info: tInfo, kq: tKq, tt: tTt })}</div>`;
  }
  function ctx(code) {
    const x = byCode(code);
    return { lo: { code: x.code, itemText: x.itemText, qtyText: `${num(x.qty)} ${x.unitName}`, project: x.project, serials: x.serials, cert: x.cert || '' } };
  }

  /* ---------- Tab Chất lượng & nghiệm thu của dự án ---------- */
  /* ---------- (b) Q9 IPQC — kiểm soát chất lượng công đoạn ---------- */
  const ipqcAll = () => (U.ipqc || []).concat(D.sxIpqc || []);
  const canQa = (p) => RUN.includes(p.status) && (isAdmin() || D.roleOf(pid()) === 'R-SX-QA');
  function ipqcCard(p) {
    const k = K(), l = ipqcAll().filter((x) => x.project === p.code).sort((a, b) => (a.at < b.at ? 1 : -1)), items = itemsOf(p);
    const itName = (key) => (items.find((i) => i.key === key) || {}).name || key;
    return `<section class="vcard pad24" data-sxnt-ipqc><div class="vcard-h"><h3>Kiểm soát chất lượng công đoạn (IPQC)</h3>${canQa(p) ? `<button type="button" class="vbtn secondary" data-sxnt-ipqc-new="${esc(p.code)}">${icon('add')} Thêm kết quả IPQC</button>` : ''}</div>
      ${k.table([['Lần kiểm tra (hạng mục / lô)', 300], ['Công đoạn', 200], ['Số kiểm', 100, 'r'], ['Số đạt', 100, 'r'], ['Kết quả', 120, 'c'], ['Nội dung', 300], ['Phiếu bất thường', 150], ['Người kiểm', 170], ['Ngày', 110]], l,
    (x) => `<td>${NC(itName(x.item), x.code)}</td><td>${k.clamp(x.stage)}</td><td class="r num">${num(x.n)}</td><td class="r num">${num(x.ok)}</td>
      <td class="c">${x.kq === 'DAT' ? badge('Đạt', 'success') : badge('Không đạt', 'error')}</td><td>${x.note ? k.clamp(x.note) : k.dash}</td>
      <td>${x.issue ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.issue)}">${esc(x.issue)}</a>` : k.dash}</td><td>${k.clamp(pName(x.who))}</td><td class="num">${esc(dmy(x.at))}</td>`)}</section>`;
  }
  async function ipqcDlg(code) {
    const p = P().byCode(code), { txt, sel, num: n, rad, ta, file, req, opts } = window.EForms.b, L = (c) => ({ layout: { columns: c } });
    const r = await window.EFormRun.open({ title: 'Thêm kết quả IPQC', schema: { id: 'sx-ipqc', components: [
      txt(`Dự án **${p.code}** — ${p.name}. Đánh giá theo lưu trình đo kiểm từng module, bán thành phẩm và Hướng dẫn kiểm soát chất lượng trong sản xuất.`),
      sel('item', 'Hạng mục / lô', req(Object.assign(L(8), { values: opts(itemsOf(p).map((i) => [i.key, i.name])) }))),
      sel('stage', 'Công đoạn', req(Object.assign(L(8), { values: opts(D.sxIpqcStages) }))),
      n('n', 'Số lượng kiểm tra', req(Object.assign(L(8), { validate: { required: true, min: 1 } }))), n('ok', 'Số lượng đạt', req(Object.assign(L(8), { validate: { required: true, min: 0 } }))),
      rad('kq', 'Kết quả', req({ values: opts([['DAT', 'Đạt'], ['NOK', 'Không đạt — lập phiếu bất thường']]) })),
      ta('note', 'Mô tả lỗi (ghi vào phiếu bất thường)', req({ rows: 2, conditional: { hide: '=kq != "NOK"' } })), ta('noteOk', 'Ghi chú', { rows: 2, conditional: { hide: '=kq = "NOK"' } }),
      file('file', 'Hồ sơ đo kiểm, đánh giá chất lượng công đoạn', L(16))] },
    values: { kq: 'DAT' }, check: (v) => (Number(v.ok) > Number(v.n) ? 'Số lượng đạt không lớn hơn số lượng kiểm tra.' : null) });
    if (!r || !r.submit) return;
    const v = r.values, x = { code: nextCode(ipqcAll(), 'code', 'IPQC-2026-', 3), project: code, item: v.item, stage: v.stage, n: Number(v.n), ok: Number(v.ok), kq: v.kq, who: pid(), at: D.sxToday, note: (v.kq === 'NOK' ? v.note : v.noteOk) || '' };
    if (v.kq === 'NOK') x.issue = window.SxBt.createAuto({ project: code, title: `IPQC ${v.stage} không đạt — ${(itemsOf(p).find((i) => i.key === v.item) || {}).name || v.item}`, desc: v.note || '', place: `Kiểm soát chất lượng công đoạn: ${v.stage}`, qty: x.n - x.ok });
    U.ipqc = [x].concat(U.ipqc || []); persist();
    if (v.file) P().addDoc(code, [v.file, 'IPQC', x.code, pid(), D.sxToday]);
    P().log(code, 'Ghi kết quả IPQC', `${x.code}: ${v.stage} ${x.ok}/${x.n}${x.issue ? ` → phiếu bất thường ${x.issue}` : ''}`);
    toast(`<b>Thành công</b><br>${x.issue ? `Đã ghi kết quả và lập phiếu bất thường ${x.issue}.` : 'Thêm mới thành công!'}`); rerender();
  }
  /* ---------- (b) Q10 Thử nghiệm thực tế (bước 11, ĐV NCPT chủ trì) ---------- */
  const trialOf = (p) => Object.assign({}, (D.sxTrial || {})[p.code], (U.trial || {})[p.code]);
  const trialPct = (p) => { if (!p.trial) return null; const t = trialOf(p); return t.kq === 'DAT' ? 100 : t.duyet ? 50 : t.kb ? 20 : null; };
  const canTrial = (p) => p.trial && ['PREPARING', 'IN_PRODUCTION', 'ACCEPTANCE'].includes(p.status) && (isAdmin() || D.roleOf(pid()) === 'R-SX-RD');
  function trialCard(p) {
    if (!p.trial) return '';
    const k = K(), t = trialOf(p);
    const st = t.kq === 'DAT' ? badge('Đạt', 'success') : t.kq === 'NOK' ? badge('Không đạt', 'error') : t.duyet ? badge('Đã duyệt kịch bản, kế hoạch', 'info') : badge('Chưa lập', 'default');
    return `<section class="vcard pad24" data-sxnt-trial><div class="vcard-h"><h3>Thử nghiệm thực tế</h3>${canTrial(p) ? `<button type="button" class="vbtn secondary" data-sxnt-trial-up="${esc(p.code)}">Cập nhật thử nghiệm</button>` : ''}</div>
      <div class="ginfo c3">${k.kv('Trạng thái', st)}${k.kv('Địa điểm thử nghiệm', t.place ? esc(t.place) : null)}${k.kv('Thời gian', t.from ? esc(`${dmy(t.from)} – ${dmy(t.to || '')}`) : null)}
        ${k.kv('Kịch bản thử nghiệm', t.kb ? esc(t.kb) : null)}${k.kv('Kế hoạch thử nghiệm', t.kh ? esc(t.kh) : null)}${k.kv('Ngày phê duyệt kịch bản, kế hoạch', t.duyet ? esc(dmy(t.duyet)) : null)}
        ${k.kv('Kết quả thử nghiệm', t.kqFile ? esc(t.kqFile) : null)}${k.kv('Đánh giá', t.kqNote ? esc(t.kqNote) : null, 'span2')}
        ${k.kv('Phiếu bất thường', t.issue ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(t.issue)}">${esc(t.issue)}</a>` : null)}${k.kv('Đơn vị chủ trì', 'Đơn vị Nghiên cứu phát triển')}</div></section>`;
  }
  async function trialDlg(code) {
    const p = P().byCode(code), t = trialOf(p), { txt, tf, dt, rad, ta, file, req, opts } = window.EForms.b, L = (c) => ({ layout: { columns: c } });
    const r = await window.EFormRun.open({ title: 'Cập nhật thử nghiệm thực tế', schema: { id: 'sx-trial', components: [
      txt('Khảo sát vị trí, thống nhất kịch bản với đơn vị sử dụng, lập kế hoạch thử nghiệm; đánh giá kết quả theo Bộ tài liệu Phương pháp đo kiểm chỉ tiêu, đánh giá tính năng.'),
      tf('place', 'Địa điểm thử nghiệm', req(L(16))), dt('from', 'Từ ngày', req(L(8))), dt('to', 'Đến ngày', req(L(8))),
      file('kb', 'Kịch bản thử nghiệm', req(L(8))), file('kh', 'Kế hoạch thử nghiệm', req(L(8))), dt('duyet', 'Ngày phê duyệt kịch bản, kế hoạch', L(8)),
      rad('kq', 'Kết quả thử nghiệm', { values: opts([['', 'Chưa có kết quả'], ['DAT', 'Đạt'], ['NOK', 'Không đạt — lập phiếu bất thường']]) }),
      file('kqFile', 'Kết quả thử nghiệm tại đơn vị', req(Object.assign(L(16), { conditional: { hide: '=kq = ""' } }))), ta('kqNote', 'Đánh giá, nội dung lỗi', { rows: 2, conditional: { hide: '=kq = ""' } })] },
    values: { place: t.place || '', from: t.from ? dmy(t.from) : '', to: t.to ? dmy(t.to) : '', kb: t.kb || '', kh: t.kh || '', duyet: t.duyet ? dmy(t.duyet) : '', kq: t.kq || '', kqFile: t.kqFile || '', kqNote: t.kqNote || '' } });
    if (!r || !r.submit) return;
    const v = r.values, iso = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '')); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
    const x = { place: v.place, from: iso(v.from), to: iso(v.to), kb: v.kb, kh: v.kh, duyet: iso(v.duyet), kq: v.kq || null, kqFile: v.kq ? v.kqFile : '', kqNote: v.kq ? v.kqNote : '', issue: t.issue || null, who: pid() };
    if (v.kq === 'NOK' && t.kq !== 'NOK') x.issue = window.SxBt.createAuto({ project: code, title: `Thử nghiệm thực tế không đạt — ${p.product}`, desc: v.kqNote || '', place: v.place, qty: 1 });
    U.trial = Object.assign({}, U.trial, { [code]: x }); persist();
    if (v.kq && v.kqFile && v.kqFile !== t.kqFile) P().addDoc(code, [v.kqFile, 'TN', 'v1.0', pid(), D.sxToday]);
    P().log(code, 'Cập nhật thử nghiệm thực tế', v.kq === 'DAT' ? 'Kết quả: Đạt' : v.kq === 'NOK' ? `Kết quả: Không đạt → phiếu bất thường ${x.issue}` : 'Kịch bản, kế hoạch thử nghiệm');
    toast('<b>Thành công</b><br>Cập nhật thành công!'); rerender();
  }
  /* ---------- (b) Q12 Đóng dự án — bước 15 Lưu hồ sơ sản xuất và thông tin truy xuất lô hàng ---------- */
  const canClose = (p) => p.status === 'ACCEPTANCE' && stockQty(p.code) >= p.qty && (isAdmin() || p.pm === pid());
  const headBtn = (p) => (canClose(p) ? `<button type="button" class="vbtn primary" data-sxnt-close="${esc(p.code)}">Đóng dự án</button>` : '');
  async function closeDlg(code) {
    const p = P().byCode(code), { txt, file, ta, chk, req } = window.EForms.b;
    const r = await window.EFormRun.open({ title: 'Đóng dự án, lưu hồ sơ sản xuất', schema: { id: 'sx-close', components: [
      txt(`**${p.code}** — ${p.name}
Đã nhập kho ${num(stockQty(code))} / ${num(p.qty)} ${p.unitName}. Hồ sơ phát sinh ở các bước (theo từng lô và toàn dự án) được tập hợp ở Hồ sơ dự án; thông tin truy xuất tra theo số sê-ri.`),
      chk('ok', '', req({ text: 'Đã tập hợp đủ hồ sơ sản xuất và thông tin truy xuất lô hàng' })), file('file', 'Danh mục hồ sơ sản xuất của dự án', { layout: { columns: 12 } }), ta('note', 'Ghi chú', { rows: 2 })] }, values: {} });
    if (!r || !r.submit) return;
    if (r.values.file) P().addDoc(code, [r.values.file, 'KHAC', 'v1.0', pid(), D.sxToday]);
    P().patch(code, { status: 'DONE', closed: D.sxToday }, 'Đóng dự án', 'Lưu hồ sơ sản xuất và thông tin truy xuất lô hàng');
    toast('<b>Thành công</b><br>Dự án đã hoàn thành!'); rerender();
  }
  /* ---------- (b) Bước 12 — Đánh giá chất lượng xuất xưởng (OQC): người dùng tự thêm nội dung đánh giá; đạt đủ → xác nhận hoàn thành, không đạt → chuyển sang tạo Phiếu bất thường ---------- */
  const oqcSeed = (p) => (['IN_PRODUCTION', 'ACCEPTANCE', 'DONE'].includes(p.status) ? [
    ['Kiểm tra ngoại quan, nhãn mác, bao gói', 'Không xước, nứt, đúng nhãn theo bản vẽ', 'Đạt 100% mẫu kiểm tra'],
    ['Đo kiểm chỉ tiêu kỹ thuật theo lưu trình đo kiểm', 'Đạt chỉ tiêu nội bộ / chiến - kỹ thuật được phê duyệt', 'Các chỉ tiêu trong ngưỡng cho phép'],
    ['Đối chiếu số sê-ri và hồ sơ truy xuất', 'Số sê-ri khớp hồ sơ lô, đủ chứng chỉ chất lượng thành phần', 'Khớp 100%']]
    .map((r, i) => ({ code: `OQC-${p.code.slice(-3)}-0${i + 1}`, project: p.code, item: '', content: r[0], criteria: r[1], actual: r[2], kq: 'DAT', who: 'sxqa', at: p.baseline || D.sxToday, seed: true })) : []);
  const oqcAll = (p) => (U.oqc || []).filter((x) => x.project === p.code).concat(oqcSeed(p).filter((x) => !(U.oqcDel || []).includes(x.code)));
  const oqcDone = (p) => (U.oqcDone || {})[p.code] || (['DONE'].includes(p.status) ? { at: p.closed || D.sxToday, who: 'sxqa' } : null);
  function oqcCard(p) {
    const k = K(), l = oqcAll(p), bad = l.filter((x) => x.kq === 'NOK'), done = oqcDone(p), items = itemsOf(p);
    const itName = (key) => (key ? (items.find((i) => i.key === key) || {}).name || key : 'Toàn dự án');
    const st = done ? badge('Đã hoàn thành OQC', 'success') : bad.length ? badge('Có nội dung không đạt', 'error') : l.length ? badge('Đang đánh giá', 'info') : badge('Chưa đánh giá', 'default');
    const can = canQa(p) && !done;
    const gate = done ? `<p class="cap" style="margin:8px 0">Hoàn thành ngày ${esc(dmy(done.at))} — ${esc(pName(done.who))}.</p>`
      : bad.length ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>${bad.length} nội dung đánh giá không đạt, chưa thể xác nhận hoàn thành OQC. ${can ? `<a class="link" data-sxnt-oqc-bt="${esc(p.code)}">Tạo phiếu bất thường</a>` : ''}</span></div></div>`
        : l.length ? `<p class="cap" style="margin:8px 0">Đáp ứng đầy đủ các điều kiện đánh giá (${l.length} / ${l.length} nội dung đạt) — có thể xác nhận hoàn thành OQC.</p>` : '<p class="cap" style="margin:8px 0">Thêm các nội dung đánh giá xuất xưởng; đạt đủ thì xác nhận hoàn thành, không đạt thì lập phiếu bất thường.</p>';
    return `<section class="vcard pad24" data-sxnt-oqc><div class="vcard-h"><h3>Đánh giá chất lượng xuất xưởng (OQC)</h3><div class="row">${st}
        ${can ? `<button type="button" class="vbtn secondary" data-sxnt-oqc-add="${esc(p.code)}">${icon('add')} Thêm nội dung đánh giá</button>
        <button type="button" class="vbtn primary" data-sxnt-oqc-done="${esc(p.code)}" ${l.length && !bad.length ? '' : 'disabled'}>Xác nhận hoàn thành OQC</button>` : ''}</div></div>${gate}
      ${k.table([['Hạng mục / lô', 200], ['Nội dung đánh giá', 380], ['Tiêu chí / yêu cầu', 280], ['Kết quả ghi nhận', 220], ['Kết luận', 120, 'c'], ['Người đánh giá', 170], ['Ngày', 110], ['Tệp', 200]].concat(can ? [['', 70, 'c']] : []), l,
    (x) => `<td>${k.clamp(itName(x.item))}</td><td>${NC(x.content, x.code)}</td><td>${x.criteria ? k.clamp(x.criteria) : k.dash}</td><td>${x.actual ? k.clamp(x.actual) : k.dash}</td>
      <td class="c">${x.kq === 'DAT' ? badge('Đạt', 'success') : badge('Không đạt', 'error')}</td><td>${k.clamp(pName(x.who))}</td><td class="num">${esc(dmy(x.at))}</td><td>${x.file ? `<a class="link">${esc(x.file)}</a>` : k.dash}</td>
      ${can ? `<td class="c"><button type="button" class="vbtn icon ghost" aria-label="Xoá" title="Xoá" data-sxnt-oqc-del="${esc(x.code)}">${icon('del')}</button></td>` : ''}`)}</section>`;
  }
  async function oqcDlg(code) {
    const p = P().byCode(code), { txt, tf, sel, rad, file, req, opts } = window.EForms.b, L = (c) => ({ layout: { columns: c } });
    const r = await window.EFormRun.open({ title: 'Thêm nội dung đánh giá OQC', schema: { id: 'sx-oqc', components: [
      txt(`Dự án **${p.code}** — ${p.name}. Ghi nhận từng nội dung đánh giá chất lượng xuất xưởng; kết luận Không đạt thì chuyển sang lập phiếu bất thường.`),
      sel('item', 'Hạng mục / lô', Object.assign(L(8), { values: opts([['', 'Toàn dự án']].concat(itemsOf(p).map((i) => [i.key, i.name]))) })),
      tf('content', 'Nội dung đánh giá', req(L(16))), tf('criteria', 'Tiêu chí / yêu cầu', L(16)), tf('actual', 'Kết quả ghi nhận', L(16)),
      rad('kq', 'Kết luận', req({ values: opts([['DAT', 'Đạt'], ['NOK', 'Không đạt']]) })), file('file', 'Biên bản, hồ sơ đánh giá', L(16))] }, values: { kq: 'DAT', item: '' } });
    if (!r || !r.submit) return;
    const v = r.values, x = { code: nextCode((U.oqc || []).concat(oqcAll(p)), 'code', `OQC-${p.code.slice(-3)}-`, 2), project: code, item: v.item || '', content: String(v.content || '').trim(), criteria: String(v.criteria || '').trim(), actual: String(v.actual || '').trim(), kq: v.kq, who: pid(), at: D.sxToday, file: v.file || '' };
    U.oqc = [x].concat(U.oqc || []); persist();
    if (v.file) P().addDoc(code, [v.file, 'OQC', x.code, pid(), D.sxToday]);
    P().log(code, 'Thêm nội dung đánh giá OQC', `${x.code}: ${x.content} — ${x.kq === 'DAT' ? 'Đạt' : 'Không đạt'}`);
    toast(x.kq === 'NOK' ? '<b>Đã ghi nhận</b><br>Nội dung không đạt — dùng liên kết Tạo phiếu bất thường để xử lý.' : '<b>Thành công</b><br>Thêm mới thành công!'); rerender();
  }
  /* ---------- Nghiệm thu: thông tin do người dùng chủ động nhập (theo dõi tiến độ, tình trạng nghiệm thu) ---------- */
  const NT_LEVEL = { TCT: 'Tổng công ty', BQP: 'Bộ Quốc phòng', KH: 'Khách hàng / đơn vị sử dụng', NB: 'Nội bộ' };
  const NT_ST = { CHUA: ['Chưa nghiệm thu', 'default'], DANG: ['Đang nghiệm thu', 'info'], DAT: ['Đạt', 'success'], NOK: ['Không đạt', 'error'] };
  const ntManual = (p) => (U.ntm || []).filter((x) => x.project === p.code);
  const canNtm = (p) => p.status !== 'PLANNING' && (isAdmin() || p.pm === pid() || D.roleOf(pid()) === 'R-SX-QA');
  function ntManualCard(p) {
    const k = K(), l = ntManual(p), can = canNtm(p), avg = l.length ? Math.round(l.reduce((a, x) => a + (x.pct || 0), 0) / l.length) : null;
    return `<h4 class="ginfo-sub" style="margin-top:20px">Thông tin nghiệm thu nhập tay${avg == null ? '' : ` <span class="faint">(${l.length} nội dung · tiến độ trung bình ${avg}%)</span>`}</h4>
      <div class="row" style="justify-content:flex-end;margin-bottom:8px">${can ? `<button type="button" class="vbtn secondary" data-sxnt-ntm-add="${esc(p.code)}">${icon('add')} Thêm thông tin nghiệm thu</button>` : ''}</div>
      ${k.table([['Nội dung nghiệm thu', 380], ['Cấp nghiệm thu', 190], ['Ngày dự kiến / thực hiện', 150], ['Tiến độ', 100, 'r'], ['Tình trạng', 150, 'c'], ['Biên bản', 200], ['Ghi chú', 240]].concat(can ? [['Thao tác', 100, 'c']] : []), l,
    (x) => `<td>${NC(x.content, x.code)}</td><td>${esc(NT_LEVEL[x.level] || '')}</td><td class="num">${x.date ? esc(dmy(x.date)) : k.dash}</td><td class="r num">${x.pct || 0}%</td><td class="c">${badge(...(NT_ST[x.st] || NT_ST.CHUA))}</td>
      <td>${x.file ? `<a class="link">${esc(x.file)}</a>` : k.dash}</td><td>${x.note ? k.clamp(x.note) : k.dash}</td>
      ${can ? `<td class="c"><div class="acts"><button type="button" class="vbtn icon ghost" aria-label="Sửa" title="Sửa" data-sxnt-ntm-edit="${esc(x.code)}">${icon('edit')}</button><span class="sep"></span><button type="button" class="vbtn icon ghost" aria-label="Xoá" title="Xoá" data-sxnt-ntm-del="${esc(x.code)}">${icon('del')}</button></div></td>` : ''}`)}`;
  }
  async function ntmDlg(code, edit) {
    const p = P().byCode(edit ? (U.ntm.find((y) => y.code === edit) || {}).project : code), cur = edit ? U.ntm.find((y) => y.code === edit) : null, { txt, tf, dt, num: n, sel, ta, file, req, opts } = window.EForms.b, L = (c) => ({ layout: { columns: c } });
    const iso = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '')); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
    const r = await window.EFormRun.open({ title: edit ? 'Sửa thông tin nghiệm thu' : 'Thêm thông tin nghiệm thu', schema: { id: 'sx-ntm', components: [
      txt(`Dự án **${p.code}** — ${p.name}. Nhập chủ động nội dung nghiệm thu để theo dõi tiến độ và tình trạng.`),
      tf('content', 'Nội dung nghiệm thu', req(L(16))), sel('level', 'Cấp nghiệm thu', req(Object.assign(L(8), { searchable: false, values: opts(Object.entries(NT_LEVEL)) }))),
      sel('st', 'Tình trạng', req(Object.assign(L(8), { searchable: false, values: opts(Object.entries(NT_ST).map(([a, b]) => [a, b[0]])) }))),
      dt('date', 'Ngày dự kiến / thực hiện', L(8)), n('pct', 'Tiến độ (%)', Object.assign({ validate: { min: 0, max: 100 } }, L(8))),
      file('file', 'Biên bản nghiệm thu', L(16)), ta('note', 'Ghi chú', { rows: 2 })] },
    values: cur ? { content: cur.content, level: cur.level, st: cur.st, date: cur.date ? dmy(cur.date) : '', pct: cur.pct || 0, file: cur.file || '', note: cur.note || '' } : { level: 'TCT', st: 'CHUA', pct: 0 },
    check: (v) => (v.date && !iso(v.date) ? 'Ngày phải đúng định dạng DD/MM/YYYY.' : null) });
    if (!r || !r.submit) return;
    const v = r.values, d = { content: String(v.content || '').trim(), level: v.level, st: v.st, date: iso(v.date), pct: Number(v.pct || 0), file: v.file || '', note: String(v.note || '').trim() };
    if (cur) Object.assign(cur, d);
    else U.ntm = [Object.assign({ code: nextCode(U.ntm || [], 'code', 'NTT-' + p.code.slice(-3) + '-', 2), project: p.code, who: pid(), at: D.sxToday }, d)].concat(U.ntm || []);
    persist();
    if (v.file) P().addDoc(p.code, [v.file, 'NT', 'v1.0', pid(), D.sxToday]);
    P().log(p.code, edit ? 'Sửa thông tin nghiệm thu' : 'Thêm thông tin nghiệm thu', d.content);
    toast('<b>Thành công</b><br>' + (edit ? 'Cập nhật thành công!' : 'Thêm mới thành công!')); rerender();
  }
  /* ---------- Tab Nghiệm thu sản phẩm (góp ý 26/11 mục 4: Chất lượng & nghiệm thu → Nghiệm thu sản phẩm, một bảng duy nhất) ----------
     Dòng: Thử nghiệm thực tế (dự án có thử nghiệm) · Đánh giá chất lượng xuất xưởng (OQC, xem / thêm nội dung trong hộp thoại) · từng đề nghị nghiệm thu theo lô
     (biên bản, chứng chỉ, phiếu nhập kho) · nội dung nghiệm thu nhập tay. IPQC chuyển sang tab Tiến độ và chất lượng; IQC sang tab Dữ liệu VMMS. */
  function projectTab(p) {
    const k = K(), lots = all().filter((x) => x.project === p.code).map((x) => Object.assign(x, { st: stOf(x) })), rows = [];
    if (p.trial) rows.push({ t: 'TN' });
    if (['IN_PRODUCTION', 'ACCEPTANCE', 'DONE'].includes(p.status) || oqcAll(p).length) rows.push({ t: 'OQC' });
    lots.forEach((x) => rows.push({ t: 'LOT', x }));
    ntManual(p).forEach((x) => rows.push({ t: 'NTM', x }));
    const ib = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" title="${label}" aria-label="${label}" ${attrs}>${icon(ic)}</button>`;
    const docs = (l) => (l.filter((x) => x[1]).length ? l.filter((x) => x[1]).map(([lb, v]) => `<div><span class="faint">${lb}:</span> ${esc(v)}</div>`).join('') : k.dash);
    const cells = (r) => {
      if (r.t === 'TN') {
        const t = trialOf(p), st = t.kq === 'DAT' ? ['Đạt', 'success'] : t.kq === 'NOK' ? ['Không đạt', 'error'] : t.duyet ? ['Đã duyệt kịch bản', 'info'] : ['Chưa lập', 'default'];
        return `<td><b>Thử nghiệm thực tế</b>${t.place ? `<div class="faint">${esc(t.place)}</div>` : ''}</td><td>Đơn vị sử dụng (NCPT chủ trì)</td><td>${k.dash}</td>
          <td class="num">${t.from ? esc(`${dmy(t.from)} – ${dmy(t.to || '')}`) : k.dash}</td><td>${docs([['Kịch bản', t.kb], ['Kế hoạch', t.kh], ['Kết quả', t.kqFile]])}${t.issue ? `<div><a class="link" data-go="sx/bat-thuong/${encodeURIComponent(t.issue)}" title="Xem chi tiết phiếu bất thường">${esc(t.issue)}</a></div>` : ''}</td>
          <td class="c">${badge(...st)}</td><td class="c"><div class="acts">${canTrial(p) ? ib('edit', 'Cập nhật thử nghiệm', `data-sxnt-trial-up="${esc(p.code)}"`) : ''}</div></td>`;
      }
      if (r.t === 'OQC') {
        const l = oqcAll(p), bad = l.filter((x) => x.kq === 'NOK').length, done = oqcDone(p), can = canQa(p) && !done;
        const st = done ? ['Đã hoàn thành', 'success'] : bad ? ['Có nội dung không đạt', 'error'] : l.length ? ['Đang đánh giá', 'info'] : ['Chưa đánh giá', 'default'];
        return `<td><a class="link" data-sxnt-oqc-view="${esc(p.code)}" title="Xem nội dung đánh giá OQC"><b>Đánh giá chất lượng xuất xưởng (OQC)</b></a></td><td>Nội bộ (Đảm bảo chất lượng)</td><td>${l.length ? `${l.length - bad}/${l.length} nội dung đạt` : k.dash}</td>
          <td class="num">${done ? esc(dmy(done.at)) : k.dash}</td><td>${k.dash}</td><td class="c">${badge(...st)}</td>
          <td class="c"><div class="acts">${ib('search', 'Xem nội dung đánh giá OQC', `data-sxnt-oqc-view="${esc(p.code)}"`)}${can ? ib('add', 'Thêm nội dung đánh giá', `data-sxnt-oqc-add="${esc(p.code)}"`) : ''}
            ${can && l.length && !bad ? ib('check', 'Xác nhận hoàn thành OQC', `data-sxnt-oqc-done="${esc(p.code)}"`) : ''}${can && bad ? ib('info', 'Tạo phiếu bất thường', `data-sxnt-oqc-bt="${esc(p.code)}"`) : ''}</div></td>`;
      }
      if (r.t === 'LOT') {
        const x = r.x, step = stepOf(x);
        return `<td>${NC(x.itemText, x.code, { go: href(x), tip: 'Xem chi tiết đề nghị nghiệm thu' })}</td><td>Tổng công ty</td><td><span class="num">${num(x.qty)} ${esc(x.unitName)}</span><div class="faint">${esc(x.serials)}</div></td>
          <td class="num">${esc(dmy(x.stocked || x.created))}</td><td>${docs([['Biên bản', x.bb], ['Chứng chỉ', x.cert], ['Phiếu nhập kho', x.pnk]])}</td>
          <td class="c">${badge(...x.st)}${step ? `<div class="faint" style="font-size:12px">${esc(step)}</div>` : ''}</td><td class="c"><div class="acts">${ib('search', 'Xem chi tiết đề nghị nghiệm thu', `data-go="${href(x)}"`)}</div></td>`;
      }
      const x = r.x, cn = canNtm(p);
      return `<td>${NC(x.content, x.code)}${x.note ? `<div class="faint">${esc(x.note)}</div>` : ''}</td><td>${esc(NT_LEVEL[x.level] || '')}</td><td><span class="num">Tiến độ ${x.pct || 0}%</span></td>
        <td class="num">${x.date ? esc(dmy(x.date)) : k.dash}</td><td>${docs([['Biên bản', x.file]])}</td><td class="c">${badge(...(NT_ST[x.st] || NT_ST.CHUA))}</td>
        <td class="c"><div class="acts">${cn ? ib('edit', 'Sửa', `data-sxnt-ntm-edit="${esc(x.code)}"`) + ib('del', 'Xoá', `data-sxnt-ntm-del="${esc(x.code)}"`) : ''}</div></td>`;
    };
    const btns = (canRequest(p) ? `<button type="button" class="vbtn secondary" data-sxnt-new="${esc(p.code)}">${icon('add')} Đề nghị nghiệm thu</button>` : '')
      + (canNtm(p) ? `<button type="button" class="vbtn secondary" data-sxnt-ntm-add="${esc(p.code)}">${icon('add')} Thêm thông tin nghiệm thu</button>` : '');
    return `<div data-sx-nt><section class="vcard pad24"><div class="vcard-h"><h3>Nghiệm thu sản phẩm</h3><div class="row">${btns}</div></div>
      ${k.table([['Nội dung nghiệm thu', 360], ['Cấp nghiệm thu', 200], ['Số lượng / kết quả', 200], ['Ngày', 150], ['Hồ sơ', 260], ['Tình trạng', 170, 'c'], ['Thao tác', 130, 'c']], rows, cells)}</section></div>`;
  }
  /* Nội dung đánh giá OQC (bấm dòng OQC): bảng đánh giá trong hộp thoại; thao tác trong hộp thoại đóng hộp thoại rồi xử lý như ở màn. */
  function oqcView(code) {
    const p = P().byCode(code), m = window.UI.vModal({ title: 'Đánh giá chất lượng xuất xưởng (OQC)', size: 'xl', body: oqcCard(p), actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
    m.el.addEventListener('click', (e) => { if (e.target.closest('[data-sxnt-oqc-add],[data-sxnt-oqc-done],[data-sxnt-oqc-del],[data-sxnt-oqc-bt]')) m.close(); });
  }
  document.addEventListener('click', (e) => { const v = e.target.closest && e.target.closest('[data-sxnt-oqc-view]'); if (v) oqcView(v.dataset.sxntOqcView); });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    const oa = t.closest('[data-sxnt-oqc-add]'); if (oa) { oqcDlg(oa.dataset.sxntOqcAdd); return; }
    const od = t.closest('[data-sxnt-oqc-del]');
    if (od) { const c = od.dataset.sxntOqcDel; U.oqc = (U.oqc || []).filter((y) => y.code !== c); U.oqcDel = (U.oqcDel || []).concat(c); persist(); rerender(); return; }
    const ok = t.closest('[data-sxnt-oqc-done]');
    if (ok && !ok.disabled) { const code = ok.dataset.sxntOqcDone; U.oqcDone = Object.assign({}, U.oqcDone, { [code]: { at: D.sxToday, who: pid() } }); persist(); P().log(code, 'Hoàn thành đánh giá chất lượng xuất xưởng (OQC)', 'Đáp ứng đầy đủ điều kiện đánh giá'); toast('<b>Thành công</b><br>Đã xác nhận hoàn thành OQC.'); rerender(); return; }
    const ob = t.closest('[data-sxnt-oqc-bt]'); if (ob) { e.preventDefault(); window.SxBt.create(ob.dataset.sxntOqcBt); return; }
    const na = t.closest('[data-sxnt-ntm-add]'); if (na) { ntmDlg(na.dataset.sxntNtmAdd, null); return; }
    const ne = t.closest('[data-sxnt-ntm-edit]'); if (ne) { ntmDlg(null, ne.dataset.sxntNtmEdit); return; }
    const nd = t.closest('[data-sxnt-ntm-del]'); if (nd) { U.ntm = (U.ntm || []).filter((y) => y.code !== nd.dataset.sxntNtmDel); persist(); rerender(); return; }
    const q = t.closest('[data-sxnt-ipqc-new]'); if (q) { ipqcDlg(q.dataset.sxntIpqcNew); return; }
    const tr = t.closest('[data-sxnt-trial-up]'); if (tr) { trialDlg(tr.dataset.sxntTrialUp); return; }
    const cl = t.closest('[data-sxnt-close]'); if (cl) { closeDlg(cl.dataset.sxntClose); return; }
    const n = t.closest('[data-sxnt-new]');
    if (n) { create(n.dataset.sxntNew); return; }
    if (t.closest('[data-sxnt-find]')) { const i = document.getElementById('sxnt-seri'); M.seri = i ? i.value.trim() : ''; M.res = M.seri ? lookup(M.seri) : null; rerender(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'sxnt-seri') { M.seri = e.target.value.trim(); M.res = M.seri ? lookup(M.seri) : null; rerender(); } });
  function route(parts) { return parts[1] ? detail(decodeURIComponent(parts[1])) : list(); }
  function enter(parts) { if (parts[0] === 'nghiem-thu' && parts[1]) K().setTab(tabKey(decodeURIComponent(parts[1])), 'info'); }
  function reset() { U = blank(); persist(); M.seri = ''; M.res = null; }

  window.SxNt = { route, enter, reset, all, byCode, detail, ctx, tabKey, viewTitle: 'Xem chi tiết đề nghị nghiệm thu', stOf, projectTab, lookup, available, headBtn, trialPct, ipqcAll };
})();
