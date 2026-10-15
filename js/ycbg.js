/* Quản lý ĐXMS — phần bổ sung theo Backlog W1_T10 (T16 B1, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md):
   SCR-73 Danh sách yêu cầu báo giá ĐXMS (#/ycbg), SCR-74 Chi tiết yêu cầu báo giá (#/ycbg/<mã>) và các tab của SCR-29 Chi tiết ĐXMS
   (Căn cứ & hạng mục, Rà soát tồn kho, Yêu cầu báo giá, Lịch sử phiên bản, Kết quả & văn bản phê duyệt).
   Mọi số liệu suy từ hồ sơ của ĐXMS (S4): hồ sơ đang chạy luồng đọc lịch sử bước (Flow), hồ sơ mẫu đọc bước hiện tại (task) — bước chưa qua thì tab trống.
   T16 B2: dùng chung cho KĐT — MS13 có cùng số bước căn cứ (1, 5), tồn kho (6, 7), YCBG (8–10) với MS01: SCR-76/77 YCBG KĐT (#/ycbg-kdt[/<mã>]),
   tab Căn cứ & hạng mục / Rà soát tồn kho / Yêu cầu báo giá của SCR-56 Chi tiết KĐT (kdt-b2.js). */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, pager, norm, toast, persona } = window.UI;
  const rerender = () => window.App.render();
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const num = (v, d) => (v == null ? dash : ty(v, d == null ? 0 : d));
  const toDate = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d); };
  const fmt = (t) => t.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const addDays = (s, n) => { const t = toDate(s); t.setDate(t.getDate() + n); return fmt(t); };
  const dkey = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const table = (cols, rows, cell, foot) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr>${cell(r, i)}</tr>`).join('') || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody>${foot || ''}</table></div>`;
  const ord = (i) => `<td class="ord">${i + 1}</td>`;
  const csv = (name, head, rows) => {
    const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + [head].concat(rows).map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = name;
    a.click();
    toast('<b>Thành công</b><br>Xuất file thành công');
  };

  /* ---------- Dữ liệu của một ĐXMS ----------
     pd = hồ sơ Phê duyệt hiện hành (bỏ hồ sơ đã chuyển quy trình); did(n) = hồ sơ đã qua bước n.
     Hồ sơ mẫu: đang xử lý ở task k → đã qua các bước < k; Hoàn thành / Đã chuyển quy trình → đã qua hết; Dừng xử lý → dừng sau báo giá. */
  const NAME0 = (t) => { const s = String(t || '').replace(/^Mua sắm\s+/i, ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  function sampleItems(x) {
    const est = x.est || 10, svc = /dịch vụ|phần mềm/i.test(x.title);
    const lines = svc
      ? [[NAME0(x.title), 'Gói', 1, 0.9, 'VTCNTT'], ['Dịch vụ triển khai, đào tạo, chuyển giao', 'Gói', 1, 0.1, 'DVPTV']]
      : [[NAME0(x.title), 'Hệ thống', est >= 100 ? 2 : 1, 0.82, 'VTCNTT'], ['Vật tư, phụ kiện đi kèm', 'Bộ', 10, 0.1, 'NCSX'], ['Dịch vụ lắp đặt, đào tạo, chuyển giao', 'Gói', 1, 0.08, 'DVPTV']];
    return lines.map(([name, uom, qty, share, goods], i) => {
      const amount = Math.round(est * share * 100) / 100;
      const stock = i === 1 ? 2 : 0;
      return { n: i + 1, name, uom, goods, bom: qty + stock, used: 0, prop: qty + stock, stock, book: stock, buy: qty, price: Math.round((amount / qty) * 1000) / 1000, amount };
    });
  }
  /* NCC nhận YCBG của ĐXMS mẫu: 3 NCC đang hoạt động, không bị cấm, chọn theo số hiệu ĐXMS. */
  function sampleNcc(code) {
    const all = window.Catalog.rows('nha-cung-cap').filter((r) => r.active && !r.ban);
    const k = Number(code.slice(-4)) || 0;
    return [0, 1, 2].map((i) => all[(k + i * 3) % all.length]);
  }
  const isKdt = (code) => /^KĐT-/.test(code || '');
  /* Căn cứ của KĐT mẫu chưa có bộ demo: kế hoạch trang bị nội bộ (TBNB), kế hoạch SXKD của nhà máy, còn lại đề tài KHCN. */
  const kdtBasis = (x) => (x.type === 'TBNB' ? 'kd5' : /Nhà máy/.test(x.unit) ? 'kd2' : 'kd1');
  function dataOf(code) {
    const kdt = isKdt(code);
    const x = kdt ? Flow.findKdt(code) : Flow.findDxms(code);
    if (!x) return null;
    const cases = kdt ? Flow.kdtCases().filter((c) => c.kdt === code) : S.allCases().filter((c) => c.dxms === code);
    const pd = kdt ? (cases.find((c) => c.st !== 'moved') || cases[0] || null)
      : cases.find((c) => c.kind === 'PD' && c.st !== 'moved') || cases.find((c) => c.kind === 'PD') || null;
    const live = !!(pd && pd.live && (!kdt || Flow.state.kdt === code));
    const demo = D.demoCases[code] || (live ? D.demoCases[kdt ? D.kdtCode0 : D.dxmsCode0] : null);
    /* Hồ sơ KĐT chuyển sang MS14 mang theo căn cứ, tồn kho, báo giá của hồ sơ MS13 → coi như đã qua các bước đó. */
    const reached = !pd ? 0 : live ? null : pd.st === 'processing' && pd.flow !== 'MS14' ? (pd.task || 1) : pd.st === 'stopped' && !kdt ? 11 : 99;
    const did = (n) => (live ? Flow.doneCount(n) > 0 : reached > n);
    const at = (n, off) => (live ? (Flow.lastOf(n) ? Flow.dateOf(Flow.lastOf(n).t) : null) : pd ? addDays(pd.created, off) : null);
    const items = (demo ? demo.items : sampleItems(x)).map((r) => Object.assign({}, r));
    const nv = kdt ? null : D.nvOf(x.nv);
    const ref = (demo && demo.ref) || {};
    const docs = kdt ? D.kdtBasisDocs : D.basisDocs;
    const basisDoc = docs.find((d) => d.id === ((live && Flow.ui.basisDoc) || ref.basisDoc)) || (nv && D.basisDocs.find((d) => d.id === nv.basis))
      || (kdt ? D.kdtBasisDocs.find((d) => d.id === kdtBasis(x)) : null) || null;
    const obj = kdt ? 'KĐT' : 'ĐXMS';
    const hsHref = (c) => (kdt ? 'ho-so-kdt/' + encodeURIComponent(c.code) : S.caseHref(c));
    return { x, kdt, obj, cases, pd, live, demo, did, at, items, nv, ref, basisDoc, hsHref };
  }

  /* ---------- Yêu cầu báo giá: một YCBG mỗi lần chạy task 08 (gửi ở service task 09, nhận và kiểm tra ở task 10) ---------- */
  const YST = { WAIT: ['Đang chờ báo giá', 'info'], GOT: ['Đã nhận báo giá', 'warning'], OK: ['Báo giá đạt', 'success'], FAIL: ['Báo giá không đạt', 'error'], CANCEL: ['Đã huỷ', 'default'] };
  function ycbgOf(code) {
    const g = dataOf(code);
    if (!g || !g.pd || !g.did(8)) return [];
    const { x, pd, live, demo, items } = g;
    const quotes = demo ? demo.quotes : sampleNcc(code).map((n, i) => ({ ncc: n.code, date: addDays(pd.created, 9), valid: addDays(pd.created, 99),
      prices: items.reduce((o, it) => { o[it.n] = Math.round(it.price * [1, 1.04, 0.97][i] * 1000) / 1000; return o; }, {}) }));
    const failFirst = !!(g.ref.quoteFailFirst);
    /* Số lần gửi YCBG = số lần chạy service task 09 (task 10 Không đạt quay về 09 gửi lại); hồ sơ mẫu = 2 nếu lần đầu Không đạt và đã qua task 10. */
    const sends = live ? Flow.state.history.filter((h) => String(h.task) === '9') : [];
    const checks = live ? Flow.state.history.filter((h) => String(h.task) === '10' && h.who) : [];
    const sent = live ? Math.max(1, sends.length) : failFirst && g.did(10) ? 2 : 1;
    const checked = live ? checks.length : g.did(10) ? sent : 0;
    const out = [];
    for (let i = 1; i <= sent; i++) {
      const date = live ? Flow.dateOf((sends[i - 1] || Flow.lastOf(8) || {}).t || Flow.state.clock) : addDays(pd.created, 5 + (i - 1) * 9);
      let st = 'WAIT';
      if (i <= checked) st = i < sent || (live && checks[i - 1].action !== 'Báo giá đạt') ? 'FAIL' : 'OK';
      else if (live ? Flow.state.tokens.some((t) => String(t.task) === '10') : g.did(9)) st = 'GOT';
      if (st !== 'OK' && st !== 'FAIL' && (pd.st === 'stopped' || pd.st === 'moved')) st = 'CANCEL';
      const got = st !== 'WAIT' && st !== 'CANCEL';
      /* Lần đầu Không đạt (bộ demo): NCC thứ 3 gửi báo giá hết hiệu lực; lần 2 gửi lại báo giá còn hiệu lực. */
      const ncc = quotes.map((q, k) => {
        const r = D.nccOf(q.ncc);
        const expired = failFirst && i === 1 && k === 2;
        return { code: q.ncc, name: r.name || r.short, short: r.short, email: r.email || '', currency: r.currency, got,
          date: got ? addDays(date, 2 + k) : null, valid: got ? (i > 1 && q.validRetry ? q.validRetry : q.valid) : null, expired, prices: q.prices };
      });
      out.push({ code: `YCBG-${g.kdt ? x.code : x.code.slice(5)}-${String(i).padStart(2, '0')}`, lan: i, kdt: g.kdt, dxms: x.code, title: x.title, unit: x.unit, hs: pd.code, hsHref: g.hsHref(pd),
        creator: x.creator || persona('minh').name, status: st, sent: date, due: addDays(date, 7), items, ncc });
    }
    return out;
  }
  /* Cơ sở giá từng hạng mục = đơn giá thấp nhất trong các báo giá còn hiệu lực của YCBG (task 10). */
  function basisOf(y) {
    const ok = y.ncc.filter((n) => n.got && !n.expired);
    return y.items.map((it) => {
      const best = ok.map((n) => ({ n, p: n.prices[it.n] })).filter((v) => v.p != null).sort((a, b) => a.p - b.p)[0];
      return { it, best, amount: best ? Math.round(best.p * it.buy * 100) / 100 : null };
    });
  }
  /* kind: 'dxms' (SCR-73) / 'kdt' (SCR-76); không truyền = cả hai (tra theo mã). */
  const allYcbg = (kind) => (kind === 'kdt' ? Flow.kdtAll() : kind === 'dxms' ? Flow.dxmsAll() : Flow.dxmsAll().concat(Flow.kdtAll())).flatMap((x) => ycbgOf(x.code));

  /* ---------- SCR-73 Danh sách yêu cầu báo giá ĐXMS / SCR-76 YCBG KĐT (khuôn profile-list) ---------- */
  const emptyF = () => ({ code: '', dxms: '', hs: '', unit: null, st: [], ncc: null, from: '', to: '' });
  const newL = () => ({ kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false });
  const LS = { dxms: newL(), kdt: newL() };
  /* Nhãn theo đối tượng cha: ĐXMS (#/ycbg) hoặc KĐT (#/ycbg-kdt). */
  const K = {
    dxms: { obj: 'ĐXMS', objHref: (c) => 'dxms/' + encodeURIComponent(c) },
    kdt: { obj: 'KĐT', objHref: (c) => 'kdt/' + encodeURIComponent(c) },
  };
  let kind = 'dxms';
  function filtered(k) {
    const L = LS[k], f = L.f, n = norm;
    return allYcbg(k).filter((y) => (!L.adv
      ? !L.kw || n(`${y.code} ${y.dxms} ${y.title}`).includes(n(L.kw))
      : (!f.code || n(y.code).includes(n(f.code))) && (!f.dxms || n(y.dxms).includes(n(f.dxms))) && (!f.hs || n(y.hs).includes(n(f.hs)))
        && (!f.unit || y.unit === f.unit) && (!f.st.length || f.st.includes(y.status)) && (!f.ncc || y.ncc.some((c) => c.code === f.ncc))
        && (!f.from || dkey(y.sent) >= dkey(f.from)) && (!f.to || dkey(y.sent) <= dkey(f.to))))
      .sort((a, b) => dkey(b.sent).localeCompare(dkey(a.sent)) || b.code.localeCompare(a.code));
  }
  function advPanel(k) {
    const d = LS[k].d, all = allYcbg(k), o = K[k];
    const txt = (key, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-yf="${key}" maxlength="255" placeholder="${ph}" value="${esc(d[key])}"></div>`;
    const sel = (key, label, opt) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'yf-' + key, value: d[key], clear: true, searchable: true,
      onChange: (v) => { d[key] = v; rerender(); } }, opt))}</div>`;
    const units = [...new Set(all.map((y) => y.unit))];
    const nccs = [...new Map(all.flatMap((y) => y.ncc).map((c) => [c.code, c])).values()];
    return `<form class="adv" data-yadv><div class="grid3">
        ${txt('code', 'Mã yêu cầu báo giá', 'Nhập mã yêu cầu báo giá')}${txt('dxms', 'Mã ' + o.obj, 'Nhập mã ' + o.obj)}${txt('hs', 'Mã hồ sơ', 'Nhập mã hồ sơ')}
        ${sel('unit', 'Đơn vị đề xuất', { placeholder: 'Chọn đơn vị đề xuất', options: units.map((u) => ({ value: u, label: u })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, placeholder: 'Tất cả trạng thái', options: Object.entries(YST).map(([value, [label]]) => ({ value, label })) })}
        ${sel('ncc', 'Nhà cung cấp', { placeholder: 'Chọn nhà cung cấp', options: nccs.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` })) })}
        ${txt('from', 'Ngày gửi từ', 'DD/MM/YYYY')}${txt('to', 'Ngày gửi đến', 'DD/MM/YYYY')}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-y="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  const yHref = (y) => (y.kdt ? 'ycbg-kdt/' : 'ycbg/') + encodeURIComponent(y.code);
  const LIST_INFO = {
    scr: 'SCR-73', name: 'Danh sách yêu cầu báo giá ĐXMS', uc: 'UC-07-03 · UR-PRE-21/22',
    notes: [
      'Backlog W1_T10 › Quản lý ĐXMS › Yêu cầu báo giá ĐXMS: danh sách, tìm kiếm nâng cao, xem chi tiết, xuất file (T16 B1). Khuôn profile-list: ô tìm + Tìm kiếm nâng cao, bảng một thông tin một cột, phân trang 10 / 20 / 50.',
      'Mỗi lần hồ sơ chạy task 08 "Khởi tạo yêu cầu báo giá" sinh một YCBG (mã YCBG-&lt;số ĐXMS&gt;-&lt;lần&gt;); service task 09 gửi email thay TTMS cho các NCC đã chọn; task 10 ghi nhận báo giá và kết quả kiểm tra. Danh sách là tra cứu — không tạo YCBG ở đây (tạo trong luồng, S2).',
      'Trạng thái: Đang chờ báo giá (đã gửi, chưa đến task 10) → Đã nhận báo giá (đang ở task 10) → Báo giá đạt / Báo giá không đạt (kết quả task 10; Không đạt thì hồ sơ quay về task 08, sinh YCBG lần sau). Hồ sơ dừng / chuyển quy trình khi YCBG còn chờ → Đã huỷ.',
      'Cần dev: bảng YCBG (ĐXMS, hồ sơ, lần, NCC nhận, hạn) do BE ghi ở task 08/09; báo giá của NCC = tài liệu "Báo giá — (NCC)" ở task 10 (B0.5 #5). Xuất excel tải danh sách đang lọc.',
      'Dữ liệu mẫu suy từ hồ sơ của các ĐXMS: hồ sơ chưa qua task 08 không có YCBG.',
    ],
    q: ['P-72', 'P-74'], src: 'profile-management/profile-list · /khcn-profile-management',
  };
  const LIST_INFO_KDT = {
    scr: 'SCR-76', name: 'Danh sách yêu cầu báo giá KĐT', uc: 'UC-05-01 · Backlog W1_T10 › Yêu cầu báo giá KĐT (dòng 310–313)',
    notes: [
      'T16 B2: cùng khuôn và cùng cơ chế với Yêu cầu báo giá ĐXMS (SCR-73) — profile-list, ô tìm + Tìm kiếm nâng cao, Xuất excel.',
      'Nguồn: hồ sơ Phê duyệt KĐT chạy MS13 — bước 8 "Khởi tạo / chỉnh sửa yêu cầu báo giá" (ĐVĐX KĐT), service task 9 gửi yêu cầu, bước 10 "Tổng hợp và kiểm tra báo giá". Mỗi lần chạy bước 8 sinh một YCBG, mã YCBG-&lt;mã KĐT&gt;-&lt;lần&gt;.',
      'Tổng giá trị theo cơ sở giá của YCBG đạt là tổng mức vốn thực tế — yếu tố thứ tư để phân luồng MS13 / MS14 / MS15 (bước 12).',
      'Hồ sơ đã chuyển MS14 mang theo YCBG của hồ sơ MS13. Import YCBG chưa dựng (P-74, cùng câu hỏi với ĐXMS).',
    ],
    q: ['P-72', 'P-74'], src: 'profile-management/profile-list · /khcn-profile-management',
  };
  function list(k) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
    kind = k || 'dxms';
    const L = LS[kind], o = K[kind];
    const rows = filtered(kind);
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 80, 'c'], ['Trạng thái', 169, 'c'], ['Mã yêu cầu báo giá', 200], ['Mã ' + o.obj, 160], ['Mã hồ sơ', 140], ['Tên ' + o.obj, 300],
      ['Đơn vị đề xuất', 185], ['Lần', 70, 'c'], ['Số NCC nhận', 110, 'c'], ['Số báo giá đã nhận', 140, 'c'], ['Ngày gửi', 120], ['Hạn báo giá', 120]];
    const body = rows.slice(from, from + L.size).map((y, i) => `<tr class="click" data-go="${yHref(y)}" data-code="${esc(y.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts"><button type="button" class="vbtn icon ghost" aria-label="Xuất file" title="Xuất file" data-y-export="${esc(y.code)}">${icon('download')}</button></div></td>
        <td class="c">${badge(...YST[y.status])}</td><td><a class="link" data-go="${yHref(y)}">${esc(y.code)}</a></td>
        <td><a class="link" data-go="${o.objHref(y.dxms)}">${esc(y.dxms)}</a></td><td><a class="link" data-go="${y.hsHref}">${esc(y.hs)}</a></td>
        <td>${clamp(y.title)}</td><td>${clamp(y.unit)}</td><td class="c">${y.lan}</td><td class="c">${y.ncc.length}</td><td class="c">${y.ncc.filter((c) => c.got).length}</td>
        <td class="num">${esc(y.sent)}</td><td class="num">${esc(y.due)}</td></tr>`).join('');
    return `<div class="pg">
      ${S.head({ title: 'Danh sách yêu cầu báo giá', info: kind === 'kdt' ? LIST_INFO_KDT : LIST_INFO, right: `<button class="vbtn secondary" data-y="export">${icon('excel')} Xuất excel</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="y-kw" maxlength="255" placeholder="Tìm kiếm theo mã YCBG, mã ${o.obj}, tên ${o.obj}" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-y="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel(kind) : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'ycbg', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }
  function exportList() {
    const o = K[kind];
    csv(`Danh_sach_yeu_cau_bao_gia_${Date.now()}.csv`, ['STT', 'Mã yêu cầu báo giá', 'Mã ' + o.obj, 'Mã hồ sơ', 'Tên ' + o.obj, 'Đơn vị đề xuất', 'Lần', 'Số NCC nhận', 'Số báo giá đã nhận', 'Ngày gửi', 'Hạn báo giá', 'Trạng thái'],
      filtered(kind).map((y, i) => [i + 1, y.code, y.dxms, y.hs, y.title, y.unit, y.lan, y.ncc.length, y.ncc.filter((c) => c.got).length, y.sent, y.due, YST[y.status][0]]));
  }
  /* Xuất file YCBG: phiếu gửi NCC — hạng mục, số lượng, hạn báo giá (cùng nội dung email service task 09). */
  function exportOne(y) {
    csv(`${y.code}.csv`, ['STT', 'Mã yêu cầu báo giá', 'Hạng mục', 'Đơn vị tính', 'Số lượng', 'Hạn báo giá', 'Nhà cung cấp nhận'],
      y.items.map((it, i) => [i + 1, y.code, it.name, it.uom, it.buy, y.due, y.ncc.map((c) => c.name).join('; ')]));
  }

  /* ---------- SCR-74 Chi tiết yêu cầu báo giá (khuôn profile-detail: cards thông tin chung + bảng) ---------- */
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
  function compareCard(y, title) {
    const nc = y.ncc.filter((n) => n.got);
    if (!nc.length) return `<section class="vcard pad24"><h3>${title || 'So sánh báo giá'}</h3><div class="empty-t">Chưa nhận được báo giá.</div></section>`;
    const bs = basisOf(y);
    const total = bs.reduce((s, b) => s + (b.amount || 0), 0);
    const cols = [['Hạng mục', 280], ['ĐVT', 90], ['Số lượng', 90, 'r']].concat(nc.map((n) => [`${esc(n.short)} (tỷ đồng)`, 130, 'r']), [['Cơ sở giá', 140], ['Thành tiền (tỷ đồng)', 150, 'r']]);
    return `<section class="vcard pad24"><div class="vcard-h"><h3>${title || 'So sánh báo giá'}</h3><span class="cap">Đơn giá quy đổi VNĐ, gồm VAT · cơ sở giá = đơn giá thấp nhất trong báo giá còn hiệu lực</span></div>
      ${table(cols, bs, (b, i) => `${ord(i)}<td>${clamp(b.it.name)}</td><td>${esc(b.it.uom)}</td><td class="r num">${num(b.it.buy)}</td>
        ${nc.map((n) => `<td class="r num">${n.expired ? `<span class="dash" title="Báo giá hết hiệu lực">${ty(n.prices[b.it.n], 3)}</span>` : b.best && b.best.n === n ? `<b>${ty(n.prices[b.it.n], 3)}</b>` : num(n.prices[b.it.n], 3)}</td>`).join('')}
        <td>${b.best ? esc(b.best.n.short) : dash}</td><td class="r num">${num(b.amount, 2)}</td>`,
        `<tfoot><tr><td></td><td colspan="${cols.length - 1}"><b>Tổng giá trị theo cơ sở giá</b></td><td class="r num"><b>${ty(total, 2)}</b></td></tr></tfoot>`)}</section>`;
  }
  function detail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-detail/profile-detail.component.html
    const y = allYcbg().find((v) => v.code === code);
    const back = (y ? y.kdt : /^YCBG-KĐT/.test(code)) ? 'ycbg-kdt' : 'ycbg';
    if (!y) return `<div class="pg">${S.head({ title: 'Xem chi tiết yêu cầu báo giá', back, lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy yêu cầu báo giá.</div></section></div>`;
    const info = {
      scr: 'SCR-74', name: 'Chi tiết yêu cầu báo giá', uc: 'UC-07-03 · UR-PRE-21/22',
      notes: [
        'Khuôn profile-detail: card Thông tin chung lưới 3 cột, các card bảng bên dưới; nút Xuất file trên hàng tiêu đề tải phiếu YCBG (hạng mục, số lượng, hạn) — cùng nội dung email service task 09 gửi NCC.',
        'Hạng mục yêu cầu = phần còn phải mua sau rà soát tồn kho (task 07). Nhà cung cấp nhận yêu cầu chọn ở task 08 (lọc theo ngành hàng; B0.5 #3 thêm NCC mới). Báo giá = tài liệu "Báo giá — (NCC)" tải lên ở task 10.',
        'So sánh báo giá: đơn giá thấp nhất trong các báo giá còn hiệu lực là cơ sở giá của hạng mục; báo giá hết hiệu lực hiện mờ, không dùng. Kết quả Đạt / Không đạt là quyết định ở task 10 (DX-03: AI kiểm tra báo giá ghi biến quoteCheck).',
        'Mã ĐXMS, mã hồ sơ mở màn chi tiết tương ứng.',
      ],
      q: ['P-06', 'P-26', 'P-72'], src: 'profile-management/profile-detail · /khcn-profile-management/:id/view',
    };
    if (y.kdt) {
      info.scr = 'SCR-77'; info.name = 'Chi tiết yêu cầu báo giá KĐT'; info.uc = 'UC-05-01 · Backlog W1_T10 › Yêu cầu báo giá KĐT (dòng 312–313)';
      info.notes = ['Cùng khuôn SCR-74 (profile-detail). Bước MS13: 7 rà soát tồn kho → 8 khởi tạo YCBG → 9 hệ thống gửi → 10 tổng hợp, kiểm tra báo giá.'].concat(info.notes.slice(0, 3));
    }
    const o = K[y.kdt ? 'kdt' : 'dxms'];
    const NST = (n) => (!n.got ? badge('Chưa phản hồi', 'default') : n.expired ? badge('Hết hiệu lực', 'error') : badge('Đã nhận báo giá', 'success'));
    const qFile = (n) => `Bao-gia-${String(n.short || n.code).replace(/^NCC /, '')}${y.lan > 1 ? '-lan-' + y.lan : ''}.pdf`;
    const hist = [{ at: y.sent, who: y.creator, act: 'Khởi tạo yêu cầu báo giá' }, { at: y.sent, who: 'Hệ thống ĐTMS', act: `Gửi email yêu cầu báo giá tới ${y.ncc.length} nhà cung cấp` }]
      .concat(y.ncc.filter((n) => n.got).map((n) => ({ at: n.date, who: y.creator, act: `Ghi nhận báo giá của ${n.name}` })))
      .concat(y.status === 'OK' || y.status === 'FAIL' ? [{ at: addDays(y.sent, 6), who: y.creator, act: YST[y.status][0] }] : y.status === 'CANCEL' ? [{ at: addDays(y.sent, 3), who: 'Hệ thống ĐTMS', act: 'Huỷ do hồ sơ kết thúc' }] : []);
    return `<div class="pg">
      ${S.head({ title: 'Xem chi tiết yêu cầu báo giá', back, lg: true, info, right: `<button class="vbtn secondary" data-y-export="${esc(y.code)}">${icon('download')} Xuất file</button>` })}
      <section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo c3">
        ${kv('Mã yêu cầu báo giá', esc(y.code))}${kv('Lần gửi', String(y.lan))}${kv('Trạng thái', badge(...YST[y.status]))}
        ${kv('Mã ' + o.obj, `<a class="link-red" href="#/${o.objHref(y.dxms)}">${esc(y.dxms)}</a>`)}${kv('Tên ' + o.obj, esc(y.title), 'span2')}
        ${kv('Mã hồ sơ', `<a class="link-red" href="#/${y.hsHref}">${esc(y.hs)}</a>`)}${kv('Đơn vị đề xuất', esc(y.unit))}${kv('Người tạo', esc(y.creator))}
        ${kv('Ngày gửi', esc(y.sent))}${kv('Hạn báo giá', esc(y.due))}${kv('Kênh gửi', 'Email hệ thống (thay TTMS)')}</div></section>
      <section class="vcard pad24"><h3>Hạng mục yêu cầu báo giá</h3>
        ${table([['Hạng mục', 360], ['Đơn vị tính', 120], ['Số lượng', 110, 'r'], ['Ngành hàng', 220]], y.items, (it, i) => `${ord(i)}<td>${clamp(it.name)}</td><td>${esc(it.uom)}</td>
          <td class="r num">${num(it.buy)}</td><td>${clamp((window.Catalog.rows('loai-hang-hoa').find((r) => r.code === it.goods) || {}).name)}</td>`)}</section>
      <section class="vcard pad24"><h3>Nhà cung cấp nhận yêu cầu</h3>
        ${table([['Mã nhà cung cấp', 140], ['Tên nhà cung cấp', 280], ['Email nhận yêu cầu báo giá', 220], ['Tình trạng', 150, 'c'], ['Ngày báo giá', 120], ['Hiệu lực đến', 120], ['Tệp báo giá', 220]], y.ncc,
          (n, i) => `${ord(i)}<td>${esc(n.code)}</td><td>${clamp(n.name)}</td><td>${clamp(n.email)}</td><td class="c">${NST(n)}</td><td class="num">${n.date ? esc(n.date) : dash}</td>
            <td class="num">${n.valid ? esc(n.valid) : dash}</td><td>${n.got ? `<a class="link-red" href="#" data-dl="${esc(qFile(n))}">${esc(qFile(n))}</a>` : dash}</td>`)}</section>
      ${compareCard(y)}
      <section class="vcard pad24"><h3>Lịch sử xử lý</h3>
        ${table([['Thời gian', 140], ['Người thực hiện', 220], ['Nội dung', 420]], hist, (h, i) => `${ord(i)}<td class="num">${esc(h.at)}</td><td>${esc(h.who)}</td><td>${clamp(h.act)}</td>`)}</section>
    </div>`;
  }

  /* ---------- SCR-29 Chi tiết ĐXMS: các tab theo Backlog (app-tabs = p-tabs của @khcn-core/ui) ---------- */
  const TABS = [['info', 'Thông tin chung'], ['can-cu', 'Căn cứ & hạng mục'], ['ton-kho', 'Rà soát tồn kho'], ['ycbg', 'Yêu cầu báo giá'],
    ['phien-ban', 'Lịch sử phiên bản'], ['ket-qua', 'Kết quả & văn bản phê duyệt']];
  const TAB = { code: null, tab: 'info', cmp: null };
  const emptyCard = (title, text) => `<section class="vcard pad24"><h3>${title}</h3><div class="empty-t">${text}</div></section>`;
  const treeLine = (g, n) => { const t = (g.demo && g.demo.tree) || []; for (const grp of t) { if ((grp.lines || []).includes(n)) return grp.name; for (const ch of grp.children || []) if (ch.lines.includes(n)) return `${grp.name} › ${ch.name}`; } return g.nv ? g.nv.name : ''; };

  function tabCanCu(g) {
    const T1 = g.kdt ? 'Căn cứ hình thành KĐT' : 'Căn cứ mua sắm';
    if (!g.pd) return emptyCard(T1, `${g.obj} chưa có hồ sơ. Căn cứ và hạng mục được chọn, bóc tách ở các bước đầu của hồ sơ Phê duyệt ${g.obj}.`);
    const b = g.basisDoc, hold = g.items.reduce((s, it) => s + (it.amount || 0), 0);
    const basisRows = b ? [{ no: b.no, date: b.date, title: b.title, type: ((g.kdt ? D.kdtBasisTypes : D.basisTypes).find((t) => t.id === b.type) || {}).name, value: b.value, other: Math.round((b.value - b.remain) * 100) / 100, hold, remain: Math.round((b.remain - hold) * 100) / 100 }]
      : g.nv ? [{ no: g.nv.code, date: '', title: g.nv.name, type: g.nv.kind, value: null, other: null, hold, remain: null }] : [];
    const basis = `<section class="vcard pad24"><div class="vcard-h"><h3>${T1}</h3><span class="cap">Nguồn: ${esc(g.ref.src || (g.nv ? g.nv.kind : 'Kế hoạch / dự toán'))}</span></div>
      ${table([['Số văn bản / mã', 150], ['Ngày ban hành', 120], ['Trích yếu', 340], ['Loại căn cứ', 170], ['Giá trị căn cứ (tỷ đồng)', 150, 'r'], [`Đã dùng ở ${g.obj} khác`, 150, 'r'], [`${g.obj} này đang giữ`, 140, 'r'], ['Còn có thể sử dụng', 140, 'r']],
        g.did(1) ? basisRows : [], (r, i) => `${ord(i)}<td>${esc(r.no)}</td><td class="num">${r.date ? esc(r.date) : dash}</td><td>${clamp(r.title)}</td><td>${clamp(r.type)}</td>
          <td class="r num">${num(r.value, 2)}</td><td class="r num">${num(r.other, 2)}</td><td class="r num">${num(r.hold, 2)}</td><td class="r num">${num(r.remain, 2)}</td>`)}</section>`;
    const used = (g.demo && g.demo.usedIn) || {};
    const items = `<section class="vcard pad24"><div class="vcard-h"><h3>${g.kdt ? 'Hạng mục đầu tư' : 'Hạng mục mua sắm'}</h3>${g.ref.ebom ? `<span class="cap">Bóc tách từ ${esc(g.ref.ebom)}</span>` : ''}</div>
      ${table([['Hạng mục', 300], ['ĐVT', 90], ['Dòng căn cứ', 240], ['SL theo căn cứ', 120, 'r'], ['Đã dùng', 90, 'r'], ['SL đề xuất', 110, 'r'], ['Ghi chú', 280]], g.did(5) ? g.items : [],
        (it, i) => `${ord(i)}<td>${clamp(it.name)}</td><td>${esc(it.uom)}</td><td>${clamp(it.warn ? 'Ngoài căn cứ' : treeLine(g, it.n))}</td><td class="r num">${num(it.bom)}</td>
          <td class="r num">${num(it.used)}</td><td class="r num">${num(it.prop)}</td><td>${clamp(it.warn || (used[it.n] ? 'Đã dùng ở ' + used[it.n] : ''))}</td>`)}</section>`;
    return basis + items;
  }
  function tabTonKho(g) {
    if (!g.pd || !g.did(7)) return emptyCard('Rà soát tồn kho', 'Chưa có kết quả rà soát tồn kho. Hệ thống lấy dữ liệu tồn kho từ phân hệ Quản lý kho sau khi hồ sơ bóc tách căn cứ.');
    const hold = g.pd.st === 'processing' ? ['Đang tạm giữ', 'warning'] : g.pd.st === 'done' ? ['Đã chốt sử dụng', 'success'] : ['Đã giải phóng', 'default'];
    const at7 = g.at(7, 3) || g.pd.created;
    const rstk = g.ref.rstk || `RSTK-${g.x.code.slice(5)}`;
    const snaps = [{ code: rstk, at: at7, by: g.pd.code, why: `Rà soát lần đầu (hồ sơ Phê duyệt ${g.obj})`, cur: true }];
    (g.kdt ? [] : g.cases.filter((c) => c.kind === 'DC')).forEach((c, i) => { snaps[0].cur = false; snaps.push({ code: `${rstk}-DC${i + 1}`, at: addDays(c.created, 2), by: c.code, why: 'Rà soát lại khi điều chỉnh ĐXMS (MS02)', cur: true }); });
    return `<section class="vcard pad24"><div class="vcard-h"><h3>Kết quả rà soát tồn kho</h3><span class="cap">${esc(rstk)} · lấy từ phân hệ Quản lý kho ngày ${esc(at7)}</span></div>
      ${table([['Hạng mục', 280], ['ĐVT', 80], ['SL đề xuất', 100, 'r'], ['Tồn sổ sách', 110, 'r'], [`Đang giữ cho ${g.obj} khác`, 200], ['Tồn khả dụng', 110, 'r'], ['Chốt dùng từ kho', 130, 'r'], ['Tạm giữ', 150, 'c'], ['Còn phải mua', 120, 'r']], g.items,
        (it, i) => { const take = (it.prop || 0) - (it.buy || 0); return `${ord(i)}<td>${clamp(it.name)}</td><td>${esc(it.uom)}</td><td class="r num">${num(it.prop)}</td>
          <td class="r num">${num(it.book != null ? it.book : it.stock)}</td><td>${it.held ? esc(`${it.held} — ${it.heldFor}`) : dash}</td><td class="r num">${num(it.stock)}</td>
          <td class="r num">${num(take)}</td><td class="c">${take > 0 ? badge(...hold) : dash}</td><td class="r num"><b>${num(it.buy)}</b></td>`; })}</section>
      <section class="vcard pad24"><h3>Lịch sử rà soát tồn kho</h3>
        ${table([['Mã kết quả', 200], ['Thời điểm', 130], ['Hồ sơ', 150], ['Nội dung', 360], ['Hiệu lực', 140, 'c']], snaps.reverse(), (s, i) => `${ord(i)}<td>${esc(s.code)}</td><td class="num">${esc(s.at)}</td>
          <td><a class="link" data-go="${g.hsHref(g.cases.find((c) => c.code === s.by) || { code: s.by })}">${esc(s.by)}</a></td><td>${clamp(s.why)}</td><td class="c">${s.cur ? badge('Hiện hành', 'success') : badge('Bản cũ', 'default')}</td>`)}</section>`;
  }
  function tabYcbg(g) {
    const ys = ycbgOf(g.x.code);
    if (!ys.length) return emptyCard('Yêu cầu báo giá', 'Chưa có yêu cầu báo giá. Yêu cầu báo giá được khởi tạo từ phần nhu cầu còn phải mua sau rà soát tồn kho.');
    const last = ys[ys.length - 1];
    const totals = ys.filter((y) => y.ncc.some((n) => n.got)).map((y) => ({ y, total: basisOf(y).reduce((s, b) => s + (b.amount || 0), 0) }));
    return `<section class="vcard pad24"><h3>Danh sách yêu cầu báo giá</h3>
      ${table([['Trạng thái', 169, 'c'], ['Mã yêu cầu báo giá', 180], ['Lần', 60, 'c'], ['Nhà cung cấp nhận', 360], ['Số báo giá đã nhận', 140, 'c'], ['Ngày gửi', 120], ['Hạn báo giá', 120]], ys,
        (y, i) => `${ord(i)}<td class="c">${badge(...YST[y.status])}</td><td><a class="link" data-go="${yHref(y)}">${esc(y.code)}</a></td><td class="c">${y.lan}</td>
          <td>${clamp(y.ncc.map((n) => n.name).join('; '))}</td><td class="c">${y.ncc.filter((n) => n.got).length}</td><td class="num">${esc(y.sent)}</td><td class="num">${esc(y.due)}</td>`)}</section>
      ${compareCard(last, `So sánh báo giá và cơ sở giá — ${esc(last.code)}`)}
      <section class="vcard pad24"><h3>Lịch sử cơ sở giá</h3>
        ${table([['Yêu cầu báo giá', 180], ['Ngày', 120], ['Kết quả', 169, 'c'], ['Tổng giá trị theo cơ sở giá (tỷ đồng)', 260, 'r']], totals,
          (t, i) => `${ord(i)}<td>${esc(t.y.code)}</td><td class="num">${esc(addDays(t.y.sent, 6))}</td><td class="c">${badge(...YST[t.y.status])}</td><td class="r num">${ty(t.total, 2)}</td>`)}</section>`;
  }
  /* Phiên bản hồ sơ: v1 khi lập dự thảo (task 11/12); v2 khi hoàn chỉnh theo ý kiến CQCM (task 27) — kết quả ký BM-04 của v1 không còn hiệu lực. */
  function versionsOf(g) {
    if (!g.pd) return [];
    const draft = g.did(11) || g.did(12), fix = g.did(27);
    if (!draft) return [];
    const nCq = ((g.ref.cqcm || ['PC', 'TC'])).length;
    const signed = g.did(22) ? nCq : 0;
    const vs = [{ v: 'v1', at: g.at(12, 14) || g.at(11, 14), who: g.pd.creator, why: 'Lập dự thảo hồ sơ ĐXMS', bm04: fix ? `${signed}/${nCq} (hết hiệu lực)` : `${signed}/${nCq}` }];
    if (fix) vs.push({ v: 'v2', at: g.at(27, 30), who: g.pd.creator, why: 'Hoàn chỉnh theo ý kiến CQCM', bm04: g.did(37) ? `${nCq}/${nCq}` : `0/${nCq}` });
    vs[vs.length - 1].cur = true;
    return vs;
  }
  const GENERIC_DIFF = [
    { field: 'Tờ trình · Biện pháp thực hiện', from: 'Tổ chức lựa chọn nhà thầu theo quy định', to: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn' },
    { field: 'Phụ lục chi phí · Cơ sở giá', from: '2 báo giá', to: '3 báo giá còn hiệu lực' },
  ];
  function tabPhienBan(g) {
    const vs = versionsOf(g);
    if (!vs.length) return emptyCard('Lịch sử phiên bản', 'Chưa có phiên bản hồ sơ. Phiên bản đầu được tạo khi lập dự thảo hồ sơ ĐXMS.');
    const cur = vs.find((v) => v.cur);
    const cmp = vs.length > 1 ? `<section class="vcard pad24" data-dxms-cmp><div class="vcard-h"><h3>So sánh phiên bản</h3><span class="cap">v1 → v2 · thay đổi sau khi CQCM yêu cầu sửa</span></div>
      ${table([['Nội dung', 280], ['Phiên bản v1', 380], ['Phiên bản v2', 380]], (g.demo && g.demo.versionDiff) || GENERIC_DIFF,
        (d, i) => `${ord(i)}<td>${clamp(d.field)}</td><td><span class="diff-old">${esc(d.from)}</span></td><td><span class="diff-new">${esc(d.to)}</span></td>`)}</section>` : '';
    return `<section class="vcard pad24"><div class="vcard-h"><h3>Lịch sử phiên bản hồ sơ</h3><span class="cap">Phiên bản hiện tại: ${esc(cur.v)} · ${esc(g.pd.code)}</span></div>
      ${table([['Phiên bản', 110], ['Thời điểm', 130], ['Người cập nhật', 200], ['Nội dung', 300], ['BM-04 đã ký / CQCM', 200], ['Hiện tại', 130, 'c']], vs,
        (v, i) => `${ord(i)}<td>${esc(v.v)}</td><td class="num">${esc(v.at || '')}</td><td>${esc(v.who)}</td><td>${clamp(v.why)}</td><td>${esc(v.bm04)}</td><td class="c">${v.cur ? badge('Hiện tại', 'success') : dash}</td>`)}</section>${cmp}`;
  }
  function tabKetQua(g) {
    const done = g.cases.filter((c) => c.st === 'done').sort((a, b) => dkey(b.updated).localeCompare(dkey(a.updated)));
    if (!done.length) return emptyCard('Kết quả & văn bản phê duyệt', 'ĐXMS chưa có hồ sơ được phê duyệt.');
    const doc = (c) => (c.kind === 'DC' ? ['QĐ điều chỉnh ĐXMS', 'QĐ-VHT'] : c.flow === 'MS01.03' ? ['BM-09 Tờ trình ĐXMS (đã phê duyệt)', 'TTr-VHT'] : ['BM-08 Quyết định phê duyệt ĐXMS', c.flow === 'MS01.01' ? 'QĐ-TĐ' : 'QĐ-VHT']);
    const rows = done.map((c, i) => ({ c, doc: doc(c), no: `${String(1000 + (Number(c.code.slice(-4)) * 7) % 900).padStart(4, '0')}/${doc(c)[1]}`, cur: i === 0 }));
    return `<section class="vcard pad24"><h3>Kết quả & văn bản phê duyệt</h3>
      ${table([['Hồ sơ', 150], ['Loại hồ sơ', 150], ['Quy trình', 100], ['Văn bản phê duyệt', 280], ['Số văn bản', 140], ['Ngày ký', 120], ['Giá trị phê duyệt (tỷ đồng)', 190, 'r'], ['Hiệu lực', 150, 'c'], ['Tệp', 80, 'c']], rows,
        (r, i) => `${ord(i)}<td><a class="link" data-go="${S.caseHref(r.c)}">${esc(r.c.code)}</a></td><td>${esc(D.kinds[r.c.kind].label)}</td><td>${esc(r.c.flow)}</td><td>${clamp(r.doc[0])}</td>
          <td>${esc(r.no)}</td><td class="num">${esc(r.c.updated)}</td><td class="r num">${ty(r.c.total, 2)}</td><td class="c">${r.cur ? badge('Đang hiệu lực', 'success') : badge('Đã thay thế', 'default')}</td>
          <td class="c"><button type="button" class="vbtn icon ghost" aria-label="Tải xuống" data-dl="${esc(r.no.replace(/\//g, '-'))}.pdf">${icon('download')}</button></td>`)}</section>`;
  }

  const TAB_INFO = [
    'Tab theo Backlog W1_T10 › Quản lý ĐXMS (T16 B1). Khuôn: app-tabs (p-tabs) của @khcn-core/ui; tab Thông tin chung giữ nguyên bố cục task-create mode detail. Các tab khác chỉ xem — dữ liệu do các bước của hồ sơ ghi (S2, S4), không nhập ở đây.',
    'Căn cứ & hạng mục: căn cứ chọn ở task 01, bóc tách hạng mục ở task 05 (nguồn eBOM / mBOM / dự toán / KHN theo nhiệm vụ — P-73). Cột "Đã dùng ở ĐXMS khác / đang giữ / còn có thể sử dụng" do BE tính trên các ĐXMS cùng căn cứ để tránh dùng lặp (cần dev: bảng giữ chỗ căn cứ).',
    'Rà soát tồn kho: service task 06 lấy tồn kho từ phân hệ Quản lý kho (tích hợp ❓), task 07 chốt số dùng từ kho. Tạm giữ = khoá số lượng cho ĐXMS này đến khi hồ sơ kết thúc; mỗi lần rà soát lưu một bản (MS02 rà soát lại) — cần dev: API giữ chỗ + snapshot.',
    'Yêu cầu báo giá: các YCBG của ĐXMS (SCR-73/74), so sánh báo giá và cơ sở giá của YCBG gần nhất, tổng giá trị theo cơ sở giá, lịch sử theo từng lần. Import YCBG chưa dựng — chờ mẫu tệp (P-74).',
    'Lịch sử phiên bản (DEV-1): v1 khi lập dự thảo (task 11/12), v2 khi hoàn chỉnh theo ý kiến CQCM (task 27); BM-04 chỉ hợp lệ với đúng phiên bản (Backlog "Theo dõi tính hợp lệ BM-04 theo phiên bản"). So sánh hiện các nội dung đổi giữa hai phiên bản.',
    'Kết quả & văn bản phê duyệt: hồ sơ Hoàn thành của ĐXMS và văn bản phê duyệt (BM-08 / BM-09 / QĐ điều chỉnh) — truy ngược hồ sơ nào tạo ra quyết định đang hiệu lực.',
  ];
  /* opt (KĐT, kdt-b2.js): list = danh sách tab [[khoá, nhãn]], bodies = hàm vẽ tab riêng (g → HTML). */
  function tabs(code, infoCards, opt) {
    const list = (opt && opt.list) || TABS;
    if (TAB.code !== code || !list.some(([k]) => k === TAB.tab)) { TAB.code = code; TAB.tab = 'info'; }
    const g = dataOf(code);
    const all = Object.assign({ info: () => infoCards, 'can-cu': () => tabCanCu(g), 'ton-kho': () => tabTonKho(g), ycbg: () => tabYcbg(g), 'phien-ban': () => tabPhienBan(g), 'ket-qua': () => tabKetQua(g) },
      opt && opt.bodies ? Object.fromEntries(Object.entries(opt.bodies).map(([k, f]) => [k, () => f(g)])) : {});
    const body = all[TAB.tab]();
    return `<nav class="tabs dx-tabs" role="tablist">${list.map(([k, l]) => `<button type="button" class="tab ${TAB.tab === k ? 'on' : ''}" role="tab" aria-selected="${TAB.tab === k}" data-dtab="${k}">${l}</button>`).join('')}</nav>${body}`;
  }

  /* ---------- Sự kiện ---------- */
  const onList = () => /^#\/ycbg(-kdt)?\/?$/.test(location.hash);
  const Lk = () => LS[/^#\/ycbg-kdt/.test(location.hash) ? 'kdt' : 'dxms'];
  document.addEventListener('click', (e) => {
    const t = e.target;
    const tb = t.closest('[data-dtab]');
    if (tb) { TAB.tab = tb.dataset.dtab; rerender(); return; }
    const ex = t.closest('[data-y-export]');
    if (ex) { e.preventDefault(); e.stopImmediatePropagation(); const y = allYcbg().find((v) => v.code === ex.dataset.yExport); if (y) exportOne(y); return; }
    if (!onList()) return;
    const L = Lk();
    const pg = t.closest('[data-pager="ycbg"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (L.psOpen) { L.psOpen = false; rerender(); }
    const y = t.closest('[data-y]');
    if (!y) return;
    if (y.dataset.y === 'export') { exportList(); return; }
    if (y.dataset.y === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
    if (y.dataset.y === 'reset') { L.d = emptyF(); L.f = emptyF(); L.page = 1; }
    rerender();
  }, true);
  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-yadv]')) return;
    e.preventDefault();
    const L = Lk();
    L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-yf]');
    if (f) Lk().d[f.dataset.yf] = f.value;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'y-kw') return;
    const L = Lk();
    L.kw = e.target.value.trim(); L.page = 1; rerender();
    const k = document.getElementById('y-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  window.Ycbg = { list, detail, tabs, ycbgOf, allYcbg, dataOf, basisOf, TAB_INFO, YST, table, ord, emptyCard, addDays, dkey, csv };
})();
