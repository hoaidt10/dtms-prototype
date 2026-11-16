/* T29 B3b — Đánh giá báo giá và xác lập cơ sở giá ở màn việc bước 10 MS01 (plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md §3.4 S4;
   SRS-DXMS 3.1.4.4 DTMS_CN_0148, BR-DXMS-04-09…12). Card nằm trong khung my-task-detail (như card thẩm định B10), eForm bước 10 vẫn mở bằng dialog.
   - Từng nhà cung cấp: Không phản hồi, Ngày báo giá, Hiệu lực đến, Loại tiền, Tỷ giá (bắt buộc khi khác VNĐ).
   - Đơn giá báo theo hạng mục (theo Loại tiền, gồm VAT) → Đơn giá quy đổi (tỷ đồng) = Đơn giá báo × Tỷ giá ÷ 1.000.000.000.
   - Cơ sở giá theo hạng mục: mặc định đơn giá quy đổi thấp nhất trong báo giá còn hiệu lực (cùng giá: Ngày báo giá sớm hơn); chọn khác bắt buộc lý do.
   - Thành tiền = quy đổi × Còn phải mua; Tổng giá trị theo cơ sở giá = giá trị của hồ sơ (BR-DXMS-04-10) → cổng sau bước 10 (vars.totalQ).
   - Báo giá đạt (BR-DXMS-04-11): mỗi hạng mục có ít nhất một báo giá còn hiệu lực; mỗi nhà cung cấp có tệp hoặc Không phản hồi; chọn khác giá thấp nhất có lý do.
   - T29 B4 P1 (BR-DXMS-04-11 sửa 04/11, D-57): mỗi văn bản căn cứ có Giá trị và có hạng mục liên kết — Giá trị − Đã dùng ở ĐXMS khác − tổng Thành tiền
     theo cơ sở giá đang chọn của hạng mục liên kết không âm; âm thì không xác nhận được Báo giá đạt (áp mọi lựa chọn đạt, gồm Vẫn đạt khi có).
     Hạng mục liên kết: hạng mục có dòng căn cứ (không Ngoài căn cứ) liên kết văn bản chính; văn bản bổ sung (B3c) chưa có hạng mục liên kết (GIẢ LẬP).
   Dữ liệu sửa lưu ở Flow.ui.bgEval[mã YCBG] = { ncc: { [mã]: { none, date, valid, cur, rate, prices: { [n]: đơn giá báo } } }, base: { [n]: { ncc, reason } } }. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, badge, vSelect, ty } = window.UI;
  const dash = '<span class="dash">-</span>';
  const RATE = { 'VNĐ': 1, USD: 25400 };
  const CURS = ['VNĐ', 'USD'];
  const dkey = (s) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}${m[2]}${m[1]}` : ''; };
  const numOf = (s) => (s == null || String(s).trim() === '' ? null : Number(String(s).trim().replace(/\./g, '').replace(',', '.')));
  const fmtNum = (v, d) => (v == null || Number.isNaN(v) ? '' : Number(v).toLocaleString('vi-VN', { maximumFractionDigits: d == null ? 2 : d }));

  /* Màn việc nào có card: bước 10 của MS01 đang chạy (không KĐT, hợp đồng, Điều chỉnh MS02). */
  /* Review nhi 06/11 #2: D.quoteManual — tạm ẩn card (Thầu so sánh, đánh giá ngoài hệ thống); không chặn Báo giá đạt theo card. */
  const applies = (tok) => !D.quoteManual && !!tok && String(tok.task) === '10' && !Flow.state.kdt && !Flow.state.parent && !Flow.state.vars.adj && !!window.Ycbg;
  /* T29 B16 — DX-10 (f): bước 10.1 Chỉ huy Thầu TTMS xem card báo giá (chỉ xem) để duyệt. */
  const viewOnly = (tok) => !D.quoteManual && !!tok && String(tok.task) === '10.1' && !Flow.state.kdt && !Flow.state.parent && !!window.Ycbg;
  const yNow = () => { const ys = window.Ycbg.ycbgOf(Flow.state.dxms) || []; return ys[ys.length - 1] || null; };
  const items = () => D.items.filter((i) => i.buy > 0);

  /* Giá trị đang dùng: bản sửa (bgEval) chồng lên báo giá nhận được của YCBG lần hiện tại. Báo giá mẫu là tỷ đồng / đơn vị → đổi về Loại tiền. */
  function model() {
    const y = yNow(), ed = (y && (Flow.ui.bgEval || {})[y.code]) || { ncc: {}, base: {} }, today = dkey(Flow.dateOf(Flow.state.clock));
    const nccs = (y ? y.ncc : []).map((n) => {
      const e = (ed.ncc || {})[n.code] || {}, cur = e.cur || n.currency || 'VNĐ', rate = 'rate' in e ? e.rate : RATE[cur] || null;
      const prices = {};
      items().forEach((i) => {
        const def = n.prices[i.n] == null ? null : Math.round((n.prices[i.n] * 1e9) / (RATE[cur] || 1));
        prices[i.n] = e.prices && e.prices[i.n] !== undefined ? e.prices[i.n] : def;
      });
      const date = e.date !== undefined ? e.date : n.date || '', valid = e.valid !== undefined ? e.valid : n.valid || '';
      const none = !!e.none, live = !none && n.got && !!dkey(valid) && dkey(valid) >= today;
      return { code: n.code, short: n.short, name: n.name, got: n.got, none, date, valid, cur, rate, prices, live,
        conv: (k) => (prices[k] == null || !rate ? null : (prices[k] * rate) / 1e9) };
    });
    const rows = items().map((i) => {
      const opts = nccs.filter((n) => n.live && n.conv(i.n) != null).sort((a, b) => a.conv(i.n) - b.conv(i.n) || dkey(a.date).localeCompare(dkey(b.date)));
      /* [T72 #85, D-122 Q6] mặc định theo Mức giá làm cơ sở của bước 8 (Flow.ui.mucGia): Thấp nhất (mặc định) / Cao nhất / Trung bình (báo giá gần giá trung bình nhất);
         chọn khác mức đó vẫn bắt lý do. Biến low giữ tên cũ, nghĩa = cơ sở giá mặc định. */
      const mg = (Flow.ui || {}).mucGia, avg = opts.length ? opts.reduce((s, n) => s + n.conv(i.n), 0) / opts.length : 0;
      const low = (mg === 'Cao nhất' ? opts[opts.length - 1] : mg === 'Trung bình' ? opts.slice().sort((a, c) => Math.abs(a.conv(i.n) - avg) - Math.abs(c.conv(i.n) - avg))[0] : opts[0]) || null, b = (ed.base || {})[i.n] || {};
      const pick = (b.ncc && opts.find((n) => n.code === b.ncc)) || low;
      const amount = pick ? Math.round(pick.conv(i.n) * i.buy * 100) / 100 : null;
      return { i, opts, low, pick, reason: pick && low && pick !== low ? b.reason || '' : '', other: !!(pick && low && pick !== low), amount };
    });
    const total = Math.round(rows.reduce((s, r) => s + (r.amount || 0), 0) * 100) / 100;
    return { y, nccs, rows, total };
  }

  /* T29 B4 P1 — Đối chiếu phần căn cứ (BR-DXMS-02-04, 04-11). Đã dùng ở ĐXMS khác = Giá trị − phần còn lại trước hồ sơ này (basisDocs.remain). */
  function basisCheck(m) {
    m = m || model();
    const docs = D.basisDocsFor(Flow.state.vars.process), u = Flow.ui || {};
    const main = (!Flow.state.kdt && window.EVars && window.EVars.h.basisSel().doc) || docs.find((d) => d.id === (u.basisDoc || D.caseRef.basisDoc)) || null;
    const more = (u.basisMore || []).filter((id) => !main || id !== main.id).map((id) => docs.find((d) => d.id === id)).filter(Boolean);
    const r2 = (v) => Math.round(v * 100) / 100;
    return (main ? [main] : []).concat(more).map((d) => {
      const linked = d === main ? m.rows.filter((r) => !r.i.warn) : [];
      const amount = r2(linked.reduce((s0, r) => s0 + (r.amount || 0), 0)), other = r2(d.value - d.remain);
      return { d, main: d === main, value: d.value, other, amount, linked: linked.length, remain: r2(d.value - other - amount) };
    });
  }
  const overOf = (bc) => bc.filter((r) => r.value > 0 && r.linked && r.remain < 0);
  const overMsg = (r) => `Văn bản căn cứ ${r.d.no} còn có thể sử dụng ${ty(r.value - r.other, 2)} tỷ đồng, hạng mục liên kết có Thành tiền ${ty(r.amount, 2)} tỷ đồng. Vui lòng chọn lại cơ sở giá hoặc chọn Không đạt — tạo YCBG mới.`;

  /* BR-DXMS-04-11: lỗi chặn Báo giá đạt (không gồm tệp báo giá — kiểm ở Danh sách tài liệu, reqDocs). */
  function problems() {
    const m = model(), out = [];
    m.nccs.forEach((n) => {
      if (n.none) return;
      if (!dkey(n.date)) out.push(`${n.short}: chưa nhập Ngày báo giá.`);
      if (!dkey(n.valid)) out.push(`${n.short}: chưa nhập Hiệu lực đến.`);
      if (n.cur !== 'VNĐ' && !(n.rate > 0)) out.push(`${n.short}: chưa nhập Tỷ giá.`);
    });
    m.rows.forEach((r) => {
      if (!r.opts.length) out.push(`${r.i.name}: chưa có báo giá còn hiệu lực.`);
      else if (r.other && !r.reason.trim()) out.push(`${r.i.name}: chọn cơ sở giá khác giá thấp nhất — cần nhập lý do.`);
    });
    overOf(basisCheck(m)).forEach((r) => out.push(overMsg(r)));
    return out;
  }

  function card(tok) {
    if (!applies(tok) && !viewOnly(tok)) return '';
    const m = model();
    if (!m.y) return '';
    const mine = applies(tok) && Flow.state.tokens.some((t) => t.id === tok.id) && (tok.who === Flow.state.persona || D.allAccess(Flow.state.persona));
    const inp = (k, v, ph, dis, w) => `<input class="vctl" data-bg-in="${esc(k)}" value="${esc(v == null ? '' : v)}" placeholder="${ph}" ${dis || !mine ? 'disabled' : ''} style="min-width:${w || 110}px">`;
    const head = (h, w, a) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`;
    const nccTbl = `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${head('Nhà cung cấp', 200)}${head('Tình trạng gửi', 120)}${head('Không phản hồi', 120, 'c')}
        ${head('Ngày báo giá', 140)}${head('Hiệu lực đến', 140)}${head('Loại tiền', 120)}${head('Tỷ giá', 120)}${head('Hiệu lực', 150, 'c')}</tr></thead><tbody>
      ${m.nccs.map((n, k) => `<tr data-bg-ncc="${esc(n.code)}"><td class="ord">${k + 1}</td><td>${esc(n.name || n.short)}</td><td>${badge('Đã gửi', 'info')}</td>
        <td class="c"><input type="checkbox" data-bg-none="${esc(n.code)}" ${n.none ? 'checked' : ''} ${mine ? '' : 'disabled'} aria-label="Không phản hồi"></td>
        <td>${inp(`${n.code}:date`, n.date, 'DD/MM/YYYY', n.none)}</td><td>${inp(`${n.code}:valid`, n.valid, 'DD/MM/YYYY', n.none)}</td>
        <td>${vSelect({ id: `bg-cur-${n.code}`, value: n.cur, disabled: n.none || !mine, options: CURS.map((c) => ({ value: c, label: c })), onChange: (v) => setNcc(n.code, { cur: v, rate: RATE[v] || null, prices: undefined }) })}</td>
        <td>${n.cur === 'VNĐ' ? dash : inp(`${n.code}:rate`, fmtNum(n.rate, 0), 'Nhập tỷ giá', n.none, 100)}</td>
        <td class="c">${n.none ? badge('Không phản hồi', 'default') : n.live ? badge('Còn hiệu lực', 'success') : badge('Hết hiệu lực', 'error')}</td></tr>`).join('')}</tbody></table></div>`;
    const cmpTbl = `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${head('Hạng mục', 220)}${head('ĐVT', 70)}${head('Còn phải mua', 110, 'r')}
        ${m.nccs.map((n) => head(`${esc(n.short)} — đơn giá (${esc(n.cur)})`, 170, 'r')).join('')}${head('Cơ sở giá', 180)}${head('Lý do chọn khác giá thấp nhất', 220)}${head('Thành tiền (tỷ đồng)', 150, 'r')}</tr></thead><tbody>
      ${m.rows.map((r, k) => `<tr data-bg-item="${r.i.n}"><td class="ord">${k + 1}</td><td><span class="clamp">${esc(r.i.name)}</span></td><td>${esc(r.i.uom)}</td><td class="r num">${fmtNum(r.i.buy, 0)}</td>
        ${m.nccs.map((n) => { const c = n.conv(r.i.n), best = r.pick === n; return `<td class="r">${inp(`${n.code}:p${r.i.n}`, fmtNum(n.prices[r.i.n], 0), 'Không báo', n.none, 130)}
          <div class="cap ${best ? 'b' : ''}">${c == null ? '' : `${best ? '<b>' : ''}${ty(c, 3)} tỷ${best ? '</b>' : ''}${n.live ? '' : ' (hết hiệu lực)'}`}</div></td>`; }).join('')}
        <td>${r.opts.length ? vSelect({ id: `bg-base-${r.i.n}`, value: r.pick ? r.pick.code : null, disabled: !mine, options: r.opts.map((n) => ({ value: n.code, label: `${n.short}${n === r.low ? ' (thấp nhất)' : ''}` })),
          onChange: (v) => setBase(r.i.n, { ncc: v }) }) : '<span class="t-err">Chưa có báo giá còn hiệu lực</span>'}</td>
        <td>${r.other ? `<div class="vfield ${r.reason.trim() ? '' : 'invalid'}">${inp(`base:${r.i.n}`, r.reason, 'Nhập lý do (bắt buộc)', false, 200)}</div>` : dash}</td>
        <td class="r num">${r.amount == null ? dash : ty(r.amount, 2)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td></td><td colspan="${3 + m.nccs.length + 2}"><b>Tổng giá trị theo cơ sở giá</b></td><td class="r num" data-bg-total><b>${ty(m.total, 2)}</b></td></tr></tfoot></table></div>`;
    const bc = basisCheck(m), over = overOf(bc);
    const bcTbl = bc.length ? `<div class="vtable-vp"><table class="vtable" data-bg-basis><thead><tr><th class="ord">STT</th>${head('Văn bản căn cứ', 150)}${head('Trích yếu', 300)}${head('Giá trị (tỷ đồng)', 130, 'r')}
        ${head('Đã dùng ở ĐXMS khác', 150, 'r')}${head('Thành tiền hạng mục liên kết', 180, 'r')}${head('Còn lại', 120, 'r')}</tr></thead><tbody>
      ${bc.map((r, k) => `<tr data-bg-doc="${esc(r.d.id)}"><td class="ord">${k + 1}</td><td>${esc(r.d.no)}${r.main ? '' : ' <span class="cap">(bổ sung)</span>'}</td><td><span class="clamp">${esc(r.d.title)}</span></td>
        <td class="r num">${ty(r.value, 2)}</td><td class="r num">${ty(r.other, 2)}</td><td class="r num">${r.linked ? ty(r.amount, 2) : dash}</td>
        <td class="r num ${r.remain < 0 && r.linked ? 't-err' : ''}">${ty(r.remain, 2)}</td></tr>`).join('')}</tbody></table></div>` : '';
    const overHtml = over.length ? `<div class="bg-over" data-bg-over>${over.map((r) => `<p class="t-err">${esc(overMsg(r))}</p>`).join('')}</div>` : '';
    const th = (Flow.state.vars.th || D.dxmsRules()).find((x) => x.to != null), lim = th ? th.to : 160;
    return `<section class="vcard pad24" data-bg-card><div class="vcard-h"><h3>Đánh giá báo giá và cơ sở giá</h3><span class="cap">${esc(m.y.code)} · lần gửi ${m.y.lan}</span></div>
      <h4 class="sub-h">Báo giá của nhà cung cấp</h4>${nccTbl}
      <h4 class="sub-h">So sánh đơn giá theo hạng mục</h4>${cmpTbl}${overHtml}
      ${bc.length ? `<h4 class="sub-h">Đối chiếu phần căn cứ</h4>${bcTbl}` : ''}
      <p class="cap">Đơn giá báo theo Loại tiền, gồm VAT; dòng nhỏ là đơn giá quy đổi (tỷ đồng) = đơn giá báo × tỷ giá ÷ 1.000.000.000. Tổng giá trị ${ty(m.total, 2)} tỷ — ${m.total >= lim ? 'từ ngưỡng trở lên' : 'dưới ngưỡng'} ${ty(lim, 0)} tỷ.</p></section>`;
  }

  /* Bản sửa theo mã YCBG: lần gửi lại có bản riêng (BR-DXMS-04-01: yêu cầu đã gửi không sửa). */
  function save(fn) {
    const y = yNow();
    if (!y) return;
    const all = JSON.parse(JSON.stringify(Flow.ui.bgEval || {})), e = all[y.code] || { ncc: {}, base: {} };
    fn(e);
    all[y.code] = e;
    Flow.setUi('bgEval', all);
  }
  const setNcc = (code, patch) => save((e) => {
    e.ncc = e.ncc || {};
    const cur = Object.assign({}, e.ncc[code] || {}, patch);
    if ('prices' in patch && patch.prices === undefined) delete cur.prices;
    e.ncc[code] = cur;
  });
  const setBase = (n, patch) => save((e) => { e.base = e.base || {}; e.base[n] = Object.assign({}, e.base[n] || {}, patch); });
  document.addEventListener('change', (e) => {
    const t = e.target;
    const none = t.closest && t.closest('[data-bg-none]');
    if (none) { setNcc(none.dataset.bgNone, { none: none.checked }); return; }
    const inp = t.closest && t.closest('[data-bg-in]');
    if (!inp) return;
    const [a, b] = inp.dataset.bgIn.split(':');
    if (a === 'base') { setBase(Number(b), { reason: inp.value }); return; }
    if (b === 'date' || b === 'valid') { setNcc(a, { [b]: inp.value.trim() }); return; }
    if (b === 'rate') { setNcc(a, { rate: numOf(inp.value) }); return; }
    if (/^p\d+$/.test(b)) {
      const m = model(), n = m.nccs.find((x) => x.code === a), prices = Object.assign({}, n.prices, { [b.slice(1)]: numOf(inp.value) });
      setNcc(a, { prices });
    }
  });

  const notes = () => ['<b>Đánh giá báo giá và cơ sở giá</b> (T29 B3b, DTMS_CN_0148, BR-DXMS-04-09…11): từng nhà cung cấp có Không phản hồi, Ngày báo giá, Hiệu lực đến, Loại tiền, Tỷ giá (bắt buộc khi khác VNĐ); đơn giá báo theo hạng mục, quy đổi tỷ đồng = đơn giá × tỷ giá ÷ 10⁹.',
    '<b>Cơ sở giá theo hạng mục:</b> mặc định đơn giá quy đổi thấp nhất trong các báo giá còn hiệu lực (cùng giá: Ngày báo giá sớm hơn); chọn báo giá khác bắt buộc lý do. Thành tiền = quy đổi × Còn phải mua; <b>Tổng giá trị theo cơ sở giá là giá trị của hồ sơ</b>, cổng "Giá trị?" sau bước 10 rẽ theo giá trị này.',
    '<b>Báo giá đạt</b> chỉ xác nhận được khi: mỗi hạng mục có ít nhất một báo giá còn hiệu lực; mỗi nhà cung cấp có tệp báo giá hoặc được đánh dấu Không phản hồi; chọn khác giá thấp nhất đã có lý do. Bảng tính lại ngay khi sửa (D-57, BE kiểm lại khi Xác nhận — cần dev riêng vì eForm không gọi lại BE khi đổi trường).',
    '<b>Đối chiếu phần căn cứ</b> (T29 B4 P1, BR-DXMS-04-11 sửa 04/11 theo GA-KDT-0411 [08:30]): mỗi văn bản căn cứ có Giá trị và hạng mục liên kết — Còn lại = Giá trị − Đã dùng ở ĐXMS khác − Thành tiền theo cơ sở giá đang chọn của hạng mục liên kết. Còn lại âm thì <b>không xác nhận được Báo giá đạt</b>, câu đỏ dưới bảng So sánh; áp cả Vẫn đạt (BR-DXMS-04-12 — prototype chưa dựng lựa chọn Vẫn đạt, chặn mọi nút bắt đầu bằng "Báo giá đạt"). Hạng mục Ngoài căn cứ không tính. Văn bản bổ sung (bước 1) chưa có hạng mục liên kết — GIẢ LẬP. Tính lại ngay ở client (D-57); BE kiểm lại khi Xác nhận — cần dev riêng.',
    'Card nằm trên màn việc (khung my-task-detail) vì bảng có cột theo từng nhà cung cấp và dropdown cơ sở giá riêng theo dòng — eForm (vht-e-form) chưa có bảng nhập động kiểu này; cần dev riêng hoặc mở rộng component bảng.'];

  window.BaoGia = { card, applies, model, problems, basisCheck, notes, total: () => model().total };
})();
