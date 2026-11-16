/* Phân hệ Quản lý sản xuất — Chất lượng & nghiệm thu (T71 S8, D-121). SX-12: danh sách đề nghị nghiệm thu lô, Tra cứu hồ sơ theo số sê-ri, chi tiết; luồng SX-NT trên sx-flow.js;
   tab Chất lượng & nghiệm thu của dự án (IQC đồng bộ VMMS chỉ xem, các lô, nhập kho).
   OQC Không đạt → kết thúc hồ sơ, hệ thống lập phiếu bất thường (SxBt.createAuto). Lãnh đạo duyệt → cấp chứng chỉ chất lượng. Đề nghị nhập kho bị chặn khi lô chưa có biên bản đạt (GUARD nt.minutes).
   Bước 6 nhận phiếu nhập kho (API-04, GIẢ LẬP P-253). Route: #/sx/nghiem-thu, #/sx/nghiem-thu/<mã>. Lưu localStorage sx-proto-nt. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
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
  const blank = () => ({ created: [], edit: {} });
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
  Object.assign(F().ACT, {
    'nt.start': () => {},
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
      const it = byCode(c.obj), cert = nextCode(all(), 'cert', 'CQ-2026-', 4);
      patch(c.obj, { bb: c.vars.bbSo, cert });
      P().log(it.project, 'Phê duyệt nghiệm thu, cấp chứng chỉ chất lượng', `${it.code}: ${cert}`);
    },
    'nt.stock': (c) => {
      const it = byCode(c.obj), pnk = nextCode(allPnk(), 'pnk', 'PNK-2026-', 4);
      patch(c.obj, { pnk, stocked: D.sxToday });
      P().log(it.project, 'Nhập kho Tổng công ty', `${it.code}: ${pnk} (${num(it.qty)} ${it.unitName})`);
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
      cols: [['Trạng thái', 150, 'c'], ['Mã đề nghị', 120], ['Dự án', 140], ['Hạng mục / lô', 220], ['Số lượng', 110, 'r'], ['Dải sê-ri', 220], ['Biên bản', 110], ['Chứng chỉ', 130], ['Phiếu nhập kho', 140], ['Bước hiện tại', 240]],
      href,
      cell: (x) => `<td class="c">${badge(...x.st)}</td><td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${esc(x.project)}</td><td>${k.clamp(x.itemText)}</td><td class="r num">${num(x.qty)}</td>
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
  function projectTab(p) {
    const k = K(), l = all().filter((x) => x.project === p.code).map((x) => Object.assign(x, { st: stOf(x) }));
    const iqc = D.sxIqc[p.code] || [];
    return `<div data-sx-nt>
      <section class="vcard pad24"><div class="vcard-h"><h3>Nghiệm thu theo lô</h3>${canRequest(p) ? `<button type="button" class="vbtn secondary" data-sxnt-new="${esc(p.code)}">${icon('add')} Đề nghị nghiệm thu</button>` : ''}</div>
        ${k.table([['Mã đề nghị', 120], ['Hạng mục / lô', 220], ['Số lượng', 100, 'r'], ['Dải sê-ri', 220], ['Chứng chỉ', 130], ['Phiếu nhập kho', 140], ['Trạng thái', 150, 'c']], l,
    (x) => `<td><a class="link" data-go="${href(x)}">${esc(x.code)}</a></td><td>${k.clamp(x.itemText)}</td><td class="r num">${num(x.qty)}</td><td class="num">${esc(x.serials)}</td>
      <td>${x.cert ? esc(x.cert) : k.dash}</td><td>${x.pnk ? esc(x.pnk) : k.dash}</td><td class="c">${badge(...x.st)}</td>`)}</section>
      <section class="vcard pad24"><div class="vcard-h"><h3>Kiểm tra vật tư đầu vào (IQC)</h3><span class="cap">Chỉ xem — đồng bộ từ VMMS</span></div>
        ${iqc.length ? k.table([['Lô IQC', 140], ['Mã vật tư', 160], ['Số lượng', 120, 'r'], ['Kết quả', 260], ['Ngày', 120]], iqc,
    (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${num(r[2])}</td><td>${k.clamp(r[3])}</td><td class="num">${esc(dmy(r[4]))}</td>`) : '<p class="faint">Chưa có kết quả IQC đồng bộ từ VMMS.</p>'}</section></div>`;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    const n = t.closest('[data-sxnt-new]');
    if (n) { create(n.dataset.sxntNew); return; }
    if (t.closest('[data-sxnt-find]')) { const i = document.getElementById('sxnt-seri'); M.seri = i ? i.value.trim() : ''; M.res = M.seri ? lookup(M.seri) : null; rerender(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'sxnt-seri') { M.seri = e.target.value.trim(); M.res = M.seri ? lookup(M.seri) : null; rerender(); } });
  function route(parts) { return parts[1] ? detail(decodeURIComponent(parts[1])) : list(); }
  function enter(parts) { if (parts[0] === 'nghiem-thu' && parts[1]) K().setTab(tabKey(decodeURIComponent(parts[1])), 'info'); }
  function reset() { U = blank(); persist(); M.seri = ''; M.res = null; }

  window.SxNt = { route, enter, reset, all, byCode, detail, ctx, tabKey, viewTitle: 'Xem chi tiết đề nghị nghiệm thu', projectTab, lookup, available };
})();
