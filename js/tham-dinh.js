/* T29 S9 — Thẩm định CQCM bốn khu ở màn việc bước 19 / 20 MS01 (plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md v0.5 §3.10 S9;
   YC-DXMS-PROTO §5, §6). Card nằm trong khung my-task-detail (screens.js taskScreen), eForm BM-04 vẫn mở bằng dialog (D-24):
   khu 1 Hồ sơ thẩm định (xem trực tuyến Tờ trình, Checklist, bảng bóc tách, kết quả rà soát tồn kho), khu 2 Lịch sử ý kiến thẩm định theo lần
   (DTMS_CN_0159; CQCM khác chỉ thấy sự kiện và kết luận, không thấy nội dung — BR-DXMS-07-04, P-200), khu 3 Phiếu BM-04 theo mục (OK / Không OK,
   kết luận Đồng ý / Yêu cầu sửa — Q7, P-197), khu 4 là hàng nút của màn việc (Ghi lại = Lưu nháp eForm; Hủy thẩm định chờ DX-09). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, badge, persona, cqcmUnit, pad2 } = window.UI;
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const table = (cols, rows, cell) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r)}</tr>`).join('') : `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>`;
  const TONE = { OK: 'success', 'Không OK': 'error', 'Đủ': 'success', 'Thiếu': 'warning', 'Không có': 'default' };
  const T = { tab: 'tt' };

  /* Màn việc nào có card: bước 19 / 20 của MS01 (không gồm KĐT, hợp đồng, Điều chỉnh MS02). */
  const applies = (tok) => !!tok && !!tok.cqcm && ['19', '20'].includes(String(tok.task)) && !Flow.state.kdt && !Flow.state.parent && !Flow.state.vars.adj;

  /* Phiếu theo mục: bước 19 lấy bản Ghi lại (nháp eForm) nếu có, không thì biến của form; bước 20 lấy phiếu chuyên viên đã lập. */
  function phieu(tok, v) {
    const draft = (Flow.ui.efDraft || {})[tok.id];
    const rows = (draft && draft.bm04Phieu) || v.bm04Phieu || [];
    return { draft: !!draft, rows: rows.map((r) => ({ muc: r.muc, danhGia: r.danhGia || 'OK', nhanXet: r.danhGia === 'OK' ? '' : r.nhanXet || '', huongDan: r.danhGia === 'OK' ? '' : r.huongDan || '' })) };
  }
  const ketLuan = (rows) => (rows.some((r) => r.danhGia !== 'OK') ? 'Yêu cầu sửa' : 'Đồng ý');

  /* Nội dung BM-04 của CQCM `c` ở lần `lan`: bản ghi lúc Xác nhận bước 19 (bm04Hist); tua nhanh không có bản ghi → lần 01 theo ý kiến mẫu,
     lần sau theo phiếu hiện hành (đã tính Tiếp thu / Bảo lưu). */
  function rowsAt(c, lan, nth) {
    const hs = (Flow.ui.bm04Hist || []).filter((x) => x.cqcm === c && x.lan === lan);
    if (hs.length) return (hs[Math.min(nth, hs.length - 1)] || hs[hs.length - 1]).rows;
    const src = lan === 1 ? D.bm04Sections.filter((s) => (D.opinions[c] || {})[s]).map((s) => Object.assign({ sec: s }, D.opinions[c][s])) : window.EVars.h.opinionsOf(c);
    return src.map((o) => ({ muc: o.sec, ok: !!o.ok, text: o.text || '' }));
  }

  /* Khu 2 — sự kiện theo lần thẩm định. Lần tăng khi TTMS Đồng ý danh sách CQCM (bước 17), hệ thống gửi yêu cầu (bước 18, BM-03). Nhãn cũ giữ cho bản chụp hồ sơ đã lưu. */
  function events(tok) {
    const me = tok.cqcm, out = [], seen = {};
    let lan = 0;
    Flow.state.history.forEach((h) => {
      const k = String(h.task);
      if (k === '17' && /^(Đồng ý|Danh sách đúng)/.test(h.action || '')) { lan += 1; out.push({ lan, t: h.t, who: h.who, title: 'TTMS xác nhận danh sách CQCM, hệ thống gửi yêu cầu thẩm định (BM-03)', tone: 'info' }); return; }
      if (!lan) return;
      if ((k === '19' || k === '20') && h.cqcm) {
        const own = h.cqcm === me, key = `${h.cqcm}:${lan}`;
        if (k === '19') {
          const nth = seen[key] = (seen[key] == null ? 0 : seen[key] + 1);
          const rows = rowsAt(h.cqcm, lan, nth), nok = rows.filter((r) => !r.ok);
          out.push({ lan, t: h.t, who: h.who, cqcm: h.cqcm, own, title: 'Chuyên viên hoàn thành phiếu BM-04, trình chỉ huy',
            concl: nok.length ? 'Yêu cầu sửa' : 'Đồng ý', nok: own ? nok : null, n: nok.length });
        } else {
          const ok = /^Đồng ý/.test(h.action || '');
          const rows = rowsAt(h.cqcm, lan, seen[key] || 0), n = rows.filter((r) => !r.ok).length;
          out.push({ lan, t: h.t, who: h.who, cqcm: h.cqcm, own, title: ok ? 'Chỉ huy CQCM đồng ý, trình ký BM-04' : 'Chỉ huy CQCM trả chuyên viên lập lại phiếu',
            concl: ok ? (n ? 'Yêu cầu sửa' : 'Đồng ý') : null, reason: own && !ok ? h.reason : null, n });
        }
        return;
      }
      const ev = { 26: 'Đơn vị đề xuất nhận kết quả BM-04, quyết định tiếp thu / bảo lưu', 28: 'Đơn vị đề xuất gửi giải trình (phụ lục 1 BM-02)', 27: 'Đơn vị đề xuất gửi hồ sơ hoàn chỉnh', 32: 'TTMS tổ chức họp thống nhất ý kiến' }[k];
      if (ev) out.push({ lan, t: h.t, who: h.who, title: ev, tone: 'default' });
    });
    return out;
  }

  const MK = { own: '#ee0033', other: '#5FE495', info: '#3B82F6', default: '#B0B3BA' };
  function timeline(tok) {
    const ev = events(tok), lans = [...new Set(ev.map((e) => e.lan))].sort((a, b) => b - a);
    if (!ev.length) return '<div class="empty-t">Chưa có ý kiến thẩm định.</div>';
    return lans.map((l) => `<div class="td-lan" data-td-lan="${l}"><div class="td-lan-h">Lần ${pad2(l)}${l === lans[0] ? ' ' + badge('Lần hiện tại', 'info') : ''}</div><ul class="vtl">${ev.filter((e) => e.lan === l).map((e) => {
      const mk = e.cqcm ? (e.own ? MK.own : MK.other) : MK[e.tone];
      return `<li data-td-ev="${e.cqcm || ''}"><span class="mk" style="border-color:${mk}"></span><div>
        <div class="top"><span class="ti">${esc(e.title)}${e.cqcm ? ` — <b>${esc(cqcmUnit(e.cqcm))}</b>${e.own ? ' (cơ quan mình)' : ''}` : ''}</span>${e.concl ? badge(e.concl + (e.n ? ` · ${e.n} mục Không OK` : ''), e.concl === 'Đồng ý' ? 'success' : 'error') : ''}</div>
        <div class="cap">${esc(persona(e.who).name)} - ${esc(Flow.dateOf(e.t))}</div>
        ${e.nok && e.nok.length ? `<ul class="plain td-nok">${e.nok.map((r) => `<li><b>${esc(r.muc)}:</b> ${esc(r.text)}</li>`).join('')}</ul>` : ''}
        ${e.reason ? `<div class="cap">Lý do: ${esc(e.reason)}</div>` : ''}
        ${e.cqcm && !e.own ? '<div class="cap">Nội dung phiếu của cơ quan khác không hiển thị (BR-DXMS-07-04).</div>' : ''}</div></li>`;
    }).join('')}</ul></div>`).join('');
  }

  /* Khu 1 — xem trực tuyến hồ sơ đang thẩm định, không tải tệp. */
  function hoSo(v) {
    const h = window.EVars.h, tt = h.tt(), d = window.EVars.doc(tt);
    const tabs = [['tt', `Tờ trình ${tt}`], ['cl', v.clName || h.clName()], ['bt', 'Bảng bóc tách'], ['rs', 'Kết quả rà soát tồn kho']];
    const tab = tabs.some(([k]) => k === T.tab) ? T.tab : 'tt';
    const body = {
      tt: () => (d ? `<div class="pdf-view td-view">${d.html}</div>` : '<div class="empty-t">Chưa có dự thảo tờ trình.</div>'),
      cl: () => table([['Nhóm', 160], ['Tài liệu', 280], ['Số / ký hiệu', 180], ['Yêu cầu', 100, 'c'], ['Tình trạng', 110, 'c']], v.checklist || [],
        (r) => `<td>${clamp(r.nhom)}</td><td>${clamp(r.muc)}</td><td>${clamp(r.so)}</td><td class="c">${esc(r.yeuCau || '')}</td><td class="c">${badge(r.tinhTrang, TONE[r.tinhTrang] || 'default')}</td>`),
      bt: () => `${(v.duToanChon || []).length ? `<div class="cap mb8">Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng (S8)</div>${table([['Loại chi phí', 180], ['Khoản mục', 260], ['ĐVT', 80], ['Số lượng', 90, 'num'], ['Giá trị dự tính (tỷ)', 130, 'num']], v.duToanChon,
        (r) => `<td>${clamp(r.loai)}</td><td>${clamp(r.khoanMuc)}</td><td>${esc(r.dvt)}</td><td class="num">${esc(r.sl)}</td><td class="num">${esc(r.giaTri)}</td>`)}<div class="cap mb8 mt16">Danh mục hàng hoá đề xuất</div>` : ''}
        ${table([['Hàng hoá', 300], ['ĐVT', 80], ['Nhóm', 90], ['Còn lại sau trừ lùi', 140, 'num'], ['Số lượng đề xuất', 130, 'num']], v.bocTach || [],
          (r) => `<td>${clamp(r.name)}</td><td>${esc(r.uom || '')}</td><td>${esc(r.nhom)}</td><td class="num">${esc(r.remainText)}</td><td class="num">${esc(r.prop)}</td>`)}`,
      rs: () => table([['Hàng hoá', 300], ['Số lượng đề xuất', 130, 'num'], ['Tồn khả dụng', 120, 'num'], ['Lấy từ kho', 110, 'num'], ['Cần mua', 100, 'num']], v.ruaSoatKho || [],
        (r) => `<td>${clamp(r.name)}</td><td class="num">${esc(r.prop)}</td><td class="num">${esc(r.avail)}</td><td class="num">${esc(r.fromStock)}</td><td class="num">${esc(Math.max(0, (Number(r.prop) || 0) - (Number(r.fromStock) || 0)))}</td>`),
    };
    return `<nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="tab ${tab === k ? 'on' : ''}" role="tab" aria-selected="${tab === k}" data-td-tab="${k}">${esc(l)}</button>`).join('')}</nav>
      <div data-td-body="${tab}">${body[tab]()}</div>`;
  }

  /* Khu 3 — phiếu BM-04 theo mục của cơ quan đang xử lý. */
  function phieuCard(tok, v) {
    const p = phieu(tok, v), kl = ketLuan(p.rows), step19 = String(tok.task) === '19';
    const st = step19 ? (p.draft ? badge('Đã ghi lại · Đang thẩm định', 'warning') : badge('Đang thẩm định', 'info')) : badge('Chờ chỉ huy CQCM', 'info');
    return `<div class="vcard-h"><h4>Phiếu nhận xét BM-04 — ${esc(v.cqcmTen || cqcmUnit(tok.cqcm))} · Lần ${esc(v.lan || pad2(1))}</h4><div class="row">${st}<span data-td-kl>${badge('Kết luận: ' + kl, kl === 'Đồng ý' ? 'success' : 'error')}</span></div></div>
      ${table([['Mục BM-01', 180], ['Đánh giá', 110, 'c'], ['Nội dung nhận xét', 260], ['Hướng dẫn sửa', 200]], p.rows,
        (r) => `<td>${esc(r.muc)}</td><td class="c">${badge(r.danhGia, TONE[r.danhGia] || 'default')}</td><td>${clamp(r.nhanXet)}</td><td>${clamp(r.huongDan)}</td>`)}
      <div class="cap mt8">${step19 ? 'Nhập, sửa phiếu bằng nút <b>Ghi lại</b> (lưu tạm, hồ sơ giữ Đang thẩm định) hoặc <b>Hoàn thành phiếu, trình chỉ huy</b>. Kết luận Đồng ý khi mọi mục OK; có mục Không OK thì kết luận Yêu cầu sửa, bắt buộc nhập nội dung.'
        : 'Chỉ huy CQCM xem phiếu chuyên viên đã lập: Đồng ý thì trình ký BM-04 với kết luận trên; Không đồng ý thì trả chuyên viên lập lại.'}</div>`;
  }

  function card(tok) {
    if (appliesK(tok)) return cardK(tok);
    if (!applies(tok)) return '';
    const v = window.EVars.of(tok);
    return `<section class="vcard pad24" data-td-card><h3>Thẩm định của cơ quan chuyên môn</h3>
      <div class="td-zone" data-td-zone="1"><h4>Hồ sơ thẩm định</h4>${hoSo(v)}</div>
      <div class="td-zone" data-td-zone="2"><h4>Lịch sử ý kiến thẩm định</h4>${timeline(tok)}</div>
      <div class="td-zone" data-td-zone="3">${phieuCard(tok, v)}</div></section>`;
  }

  /* Khu 4 — nút Ghi lại (bước 19, chuyên viên CQCM): mở eForm BM-04 chỉ có Hủy / Ghi lại. */
  const ghiLaiBtn = (tok, mine) => (mine && ((applies(tok) && String(tok.task) === '19') || appliesK(tok)) ? `<button type="button" class="vbtn secondary" data-td-save="${esc(tok.id)}">Ghi lại</button>` : '');

  const notes = () => ['Thẩm định bốn khu (T29 S9, YC-DXMS-PROTO §5): Hồ sơ thẩm định xem trực tuyến, Lịch sử ý kiến theo lần, Phiếu BM-04 theo mục, hàng nút. Phiếu vẫn nhập bằng eForm mở dialog (D-24).',
    'Đồng ý / Yêu cầu sửa là <b>kết luận</b> của phiếu BM-04 (mọi mục OK → Đồng ý; có mục Không OK → Yêu cầu sửa), không phải nút chuyển hồ sơ về ĐVĐX: hồ sơ về ĐV sau khi đủ BM-04 ở bước 23–25 theo BPMN (Q7, P-197).',
    'Lịch sử ý kiến: cơ quan mình thấy đủ nội dung các lần; cơ quan khác chỉ thấy sự kiện và kết luận (BR-DXMS-07-04, comment #14). YC-DXMS-PROTO §5 ghi "toàn bộ cây góp ý của các CQCM khác" → P-200.',
    'Nút <b>Hủy thẩm định</b> (YC §6) chưa dựng: BPMN MS01 không có nhánh này, đã đề xuất DX-09 (chờ BA).',
    'Xem trực tuyến tệp .docx cần dịch vụ chuyển PDF — cần dev riêng (như Văn bản đầu ra). Khu 1, 2 là card cấu hình của my-task-detail; khu 3 đọc biến eForm BM-04.'];
  /* ---------- T31 B4 (K5) — KĐT MS13: bước 27 / 29 / 46 / 55 (plan docs/dtms/prototype-T31-kdt-ia-chuan-bi.md §K5; SRS-KDT BR-KDT-08-04…06).
     Bước 27 Thẩm định nội dung hồ sơ và 46 / 55 Thẩm định, hoàn chỉnh hồ sơ của CQCM chủ trì (TTMS) thấy toàn bộ; bước 29 CQCM phối hợp chỉ thấy
     kết quả của cơ quan mình — dòng cơ quan khác chỉ có tên, trạng thái, ngày gửi (BR-KDT-08-06; khác ĐXMS: không hiện kết luận). Kết quả của
     CQCM chủ trì, họp, kết luận Thủ trưởng hiện cho mọi người. Bước 67 (Ban Tập đoàn) không áp; MS14 chưa chạy luồng (D-18) → TODO. */
  const K_TASKS = ['27', '29', '46', '55'];
  const K_DOC = { GOP: 'BM-00', CT: 'BM-01', KDT: 'BM-03' };
  const NEED_FIX = 'Cần sửa đổi, giải trình';
  const appliesK = (tok) => !!tok && !!Flow.state.kdt && !Flow.state.parent && K_TASKS.includes(String(tok.task));
  const unitK = (id) => (id === 'TTMS' ? 'TTMS (CQCM chủ trì)' : cqcmUnit(id));
  const klBadge = (fix) => badge(fix ? NEED_FIX : 'Đạt', fix ? 'error' : 'success');

  /* Kết quả của đơn vị `id` ở lượt `i` (0-based) của vòng `td`: bản ghi lúc Hoàn thành (eForm, kdtTdHist); tua nhanh → ý kiến mẫu D.kdtReview. */
  function resultK(td, i, id, nth) {
    const hs = (Flow.ui.kdtTdHist || []).filter((x) => x.td === td && x.luot === i && x.id === id);
    if (hs.length) return hs[Math.min(nth || 0, hs.length - 1)];
    const r = D.kdtReview(td, i)[id] || {}, fix = D.kdtFix(td, i, id, Flow.ui);
    return { fix, rows: (r.items || []).map((x) => ({ muc: x[0], text: x[1], guide: x[2] || '' })) };
  }

  /* Khu 2 — sự kiện theo vòng (BM-00 / BM-01 / BM-03) và lượt kiểm tra (mỗi lần tới bước 27 mở một lượt, BR-KDT-08-01). */
  function eventsK(tok) {
    const lead = String(tok.task) !== '29', me = tok.cqcm, out = [], luot = {}, seen = {};
    Flow.state.history.forEach((h) => {
      if (!h.who || h.system) return;
      const k = String(h.task), td = h.td || 'GOP';
      if (k === '27') luot[td] = (luot[td] || 0) + 1;
      const n = luot[td];
      if (!n) return;
      const base = { td, i: n - 1, t: h.t, who: h.who };
      if (k === '27' || k === '29') {
        const id = k === '27' ? 'TTMS' : h.cqcm, key = `${td}:${n}:${id}`;
        const nth = seen[key] = (seen[key] == null ? 0 : seen[key] + 1);
        const r = resultK(td, n - 1, id, nth), see = id === 'TTMS' || lead || id === me;
        out.push(Object.assign(base, { id, own: id === me || (lead && id === 'TTMS'), see,
          title: id === 'TTMS' ? 'CQCM chủ trì hoàn thành thẩm định nội dung hồ sơ' : 'Gửi ý kiến thẩm định',
          fix: see ? r.fix : null, rows: see ? r.rows : null }));
        return;
      }
      const t = { 31: /^Bổ sung/.test(h.action || '') ? 'Đơn vị đề xuất bổ sung hồ sơ theo ý kiến' : 'Đơn vị đề xuất giải trình, bảo lưu ý kiến',
        32: `CQCM chủ trì tổ chức họp — ${h.action || ''}`, 34: 'Chuyên quản đơn vị đề xuất xác nhận nội dung điều chỉnh sau họp',
        35: 'Chỉ huy đơn vị đề xuất xác nhận, cho phép cập nhật hồ sơ', 36: 'Đơn vị đề xuất cập nhật hồ sơ, gửi thẩm định lại',
        37: 'CQCM chủ trì báo cáo Thủ trưởng nội dung chưa thống nhất', 38: `Thủ trưởng ${(h.action || '').toLowerCase()}`,
        46: 'CQCM chủ trì hoàn thành thẩm định, hoàn chỉnh hồ sơ chủ trương', 55: 'CQCM chủ trì hoàn thành thẩm định, hoàn chỉnh hồ sơ KĐT' }[k];
      if (t) out.push(Object.assign(base, { title: t, reason: ['32', '38'].includes(k) ? h.reason : null }));
    });
    /* Việc đang mở của lượt hiện tại: bước 27 mở lượt mới (chưa có kết quả); CQCM phối hợp chưa gửi ý kiến — chỉ trạng thái. */
    const td = Flow.state.vars.td || 'GOP', done = luot[td] || 0;
    Flow.state.tokens.filter((t) => String(t.task) === '27' || (String(t.task) === '29' && t.cqcm)).forEach((t) => {
      const id = String(t.task) === '27' ? 'TTMS' : t.cqcm;
      out.push({ td, i: id === 'TTMS' ? done : Math.max(0, done - 1), t: t.since, who: t.who, id, own: id === me || (lead && id === 'TTMS'), see: false, pending: true, title: 'Đang thẩm định' });
    });
    return out;
  }

  function timelineK(tok) {
    const ev = eventsK(tok);
    if (!ev.length) return '<div class="empty-t">Chưa có ý kiến thẩm định.</div>';
    const order = ['GOP', 'CT', 'KDT'], keys = [];
    ev.forEach((e) => { const k = `${e.td}-${e.i + 1}`; if (!keys.includes(k)) keys.push(k); });
    keys.sort((a, b) => { const [ta, la] = a.split('-'), [tb, lb] = b.split('-'); return order.indexOf(tb) - order.indexOf(ta) || lb - la; });
    return keys.map((key, gi) => {
      const [td, l] = key.split('-');
      return `<div class="td-lan" data-td-lan="${key}"><div class="td-lan-h">Vòng ${esc(K_DOC[td])} · Lượt ${pad2(Number(l))}${gi === 0 ? ' ' + badge('Lượt hiện tại', 'info') : ''}</div><ul class="vtl">${ev.filter((e) => `${e.td}-${e.i + 1}` === key).map((e) => {
        const mk = e.id ? (e.own ? MK.own : e.id === 'TTMS' ? MK.info : MK.other) : MK.default;
        const unit = e.id ? ` — <b>${esc(unitK(e.id))}</b>${e.own ? ' (cơ quan mình)' : ''}` : '';
        const st = e.pending ? badge('Đang xử lý', 'warning') : e.fix != null ? klBadge(e.fix) + (e.fix && e.rows ? ` ${badge(`${e.rows.length} ý kiến`, 'default')}` : '') : e.id ? badge('Đã gửi', 'default') : '';
        return `<li data-td-ev="${e.id || ''}"><span class="mk" style="border-color:${mk}"></span><div>
          <div class="top"><span class="ti">${esc(e.title)}${unit}</span><span>${st}</span></div>
          <div class="cap">${esc(persona(e.who).name)} - ${esc(Flow.dateOf(e.t))}</div>
          ${e.rows && e.rows.length ? `<ul class="plain td-nok">${e.rows.map((r) => `<li><b>${esc(r.muc)}:</b> ${esc(r.text)}${r.guide ? ` <span class="cap">— Hướng dẫn: ${esc(r.guide)}</span>` : ''}</li>`).join('')}</ul>` : ''}
          ${e.reason ? `<div class="cap">Nội dung: ${esc(e.reason)}</div>` : ''}
          ${e.id && !e.see && !e.pending ? '<div class="cap">Kết luận, nội dung ý kiến của cơ quan khác không hiển thị (BR-KDT-08-06).</div>' : ''}</div></li>`;
      }).join('')}</ul></div>`;
    }).join('');
  }

  /* Khu 1 — hồ sơ của vòng đang thẩm định, xem trực tuyến. */
  function hoSoK(v) {
    const td = Flow.state.vars.td || 'GOP', code = K_DOC[td], d = window.EVars.doc(code);
    const cls = td === 'GOP' ? [['Checklist 01', v.checklist01], ['Checklist 02', v.checklist02]] : [[td === 'CT' ? 'Checklist 01' : 'Checklist 02', td === 'CT' ? v.checklist01 : v.checklist02]];
    const tabs = [['tt', `${code} ${d ? d.name : ''}`]].concat(td === 'KDT' ? [['pl', 'Phụ lục thuyết minh']] : [], [['cl', cls.map((c) => c[0]).join(', ')], ['hm', 'Bảng hạng mục'], ['rs', 'Kết quả rà soát tồn kho']]);
    const tab = tabs.some(([k]) => k === T.tab) ? T.tab : 'tt';
    const view = (x) => (x ? `<div class="pdf-view td-view">${x.html}</div>` : '<div class="empty-t">Chưa có văn bản.</div>');
    const body = {
      tt: () => view(d),
      pl: () => view(window.EVars.doc('PL-TM')),
      cl: () => cls.map(([n, rows]) => `${cls.length > 1 ? `<div class="cap mb8">${esc(n)}</div>` : ''}${table([['TT', 60], ['Tài liệu', 320], ['Số / ký hiệu', 180], ['Yêu cầu', 100, 'c'], ['Tình trạng', 110, 'c']],
        (rows || []).filter((r) => !r.header), (r) => `<td>${esc(r.tt)}</td><td>${clamp(r.muc)}</td><td>${clamp(r.so)}</td><td class="c">${esc(r.yeuCau || '')}</td><td class="c">${badge(r.tinhTrang, TONE[r.tinhTrang] || 'default')}</td>`)}`).join('<div class="mt16"></div>'),
      hm: () => `${(v.duToanChon || []).length ? `<div class="cap mb8">Dòng dự toán đề tài / dự án đã bóc tách khi tạo KĐT</div>${table([['Loại chi phí', 180], ['Khoản mục', 260], ['ĐVT', 80], ['Số lượng', 90, 'num'], ['Giá trị dự tính (tỷ)', 130, 'num']], v.duToanChon,
        (r) => `<td>${clamp(r.loai)}</td><td>${clamp(r.khoanMuc)}</td><td>${esc(r.dvt)}</td><td class="num">${esc(r.sl)}</td><td class="num">${esc(r.giaTri)}</td>`)}<div class="cap mb8 mt16">Danh mục hạng mục đầu tư</div>` : ''}
        ${table([['Hạng mục', 300], ['Số lượng', 120, 'num'], ['Đơn giá (tỷ)', 110, 'num'], ['Thành tiền (tỷ)', 120, 'num'], ['Loại chi phí', 140]], v.phuLucDanhMuc || [],
          (r) => `<td>${clamp(r.hang)}</td><td class="num">${esc(r.sl)}</td><td class="num">${esc(r.donGia)}</td><td class="num">${esc(r.thanhTien)}</td><td>${clamp(r.loai)}</td>`)}`,
      rs: () => table([['Hàng hoá', 300], ['Số lượng đề xuất', 130, 'num'], ['Tồn khả dụng', 120, 'num'], ['Lấy từ kho', 110, 'num'], ['Cần mua', 100, 'num']], v.ruaSoatKho || [],
        (r) => `<td>${clamp(r.name)}</td><td class="num">${esc(r.prop)}</td><td class="num">${esc(r.avail)}</td><td class="num">${esc(r.fromStock)}</td><td class="num">${esc(Math.max(0, (Number(r.prop) || 0) - (Number(r.fromStock) || 0)))}</td>`),
    };
    return `<nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="tab ${tab === k ? 'on' : ''}" role="tab" aria-selected="${tab === k}" data-td-tab="${k}">${esc(l)}</button>`).join('')}</nav>
      <div data-td-body="${tab}">${body[tab]()}</div>`;
  }

  /* Khu 3 — kết quả của người đang xử lý: 27 theo nội dung thẩm định (Đạt / Không đạt), 29 phiếu nhận xét, 46 / 55 tổng hợp kết quả vòng. */
  function ketQuaK(tok, v) {
    const k = String(tok.task), draft = (Flow.ui.efDraft || {})[tok.id], td = Flow.state.vars.td || 'GOP';
    const st = draft ? badge('Đã ghi lại · Đang thẩm định', 'warning') : badge('Đang thẩm định', 'info');
    const head = (title, kl) => `<div class="vcard-h"><h4>${title}</h4><div class="row">${st}${kl != null ? `<span data-td-kl>${badge('Kết luận: ' + (kl ? NEED_FIX : 'Đạt'), kl ? 'error' : 'success')}</span>` : ''}</div></div>`;
    const lv = `Vòng ${esc(K_DOC[td])} · Lượt ${esc(v.luot || pad2(1))}`;
    if (k === '27') {
      const rows = (draft && draft.thamDinh) || v.thamDinh || [], bad = rows.filter((r) => r.danhGia === 'Không đạt'), cs = Flow.cqcmSel();
      return `${head(`Kết quả thẩm định nội dung — ${esc(unitK('TTMS'))} · ${lv}`, !!bad.length)}
        ${table([['Nội dung thẩm định', 220], ['Đánh giá', 110, 'c'], ['Nội dung nhận xét', 260], ['Hướng dẫn sửa', 200]], rows,
          (r) => `<td>${esc(r.noiDung)}</td><td class="c">${badge(r.danhGia, r.danhGia === 'Đạt' ? 'success' : 'error')}</td><td>${r.danhGia === 'Đạt' ? dash : clamp(r.nhanXet)}</td><td>${r.danhGia === 'Đạt' ? dash : clamp(r.huongDan)}</td>`)}
        <div class="cap mt8">Lấy ý kiến CQCM phối hợp: <b>${cs.length ? `Có — ${esc(cs.map(cqcmUnit).join('; '))}` : 'Không'}</b>. Nhập, sửa kết quả bằng nút <b>Ghi lại</b> (lưu tạm, hồ sơ giữ Đang thẩm định) hoặc <b>Hoàn thành thẩm định</b>. Kết luận do hệ thống tính: Đạt khi mọi nội dung Đạt; có nội dung Không đạt thì Cần sửa đổi, giải trình, bắt buộc nhập nội dung nhận xét.</div>`;
    }
    if (k === '29') {
      const rows = (draft && draft.phieuNhanXet) || v.phieuNhanXet || [], kl = (draft && draft.ketLuanTd) || v.ketLuanTd;
      return `${head(`Phiếu nhận xét ${esc(window.EVars.h.stg().cq)} — ${esc(v.cqcmTen || cqcmUnit(tok.cqcm))} · ${lv}`, kl === NEED_FIX)}
        ${table([['Nội dung thẩm định', 200], ['Nội dung nhận xét', 300], ['Hướng dẫn sửa', 220]], rows,
          (r) => `<td>${esc(r.muc)}</td><td>${clamp(r.nhanXet)}</td><td>${clamp(r.huongDan)}</td>`)}
        <div class="cap mt8">Phiếu riêng của cơ quan mình — cơ quan phối hợp khác không xem được. Nhập, sửa bằng nút <b>Ghi lại</b> hoặc <b>Gửi ý kiến thẩm định</b>; Kết luận Cần sửa đổi, giải trình phải có ít nhất một ý kiến.</div>`;
    }
    /* 46 / 55: mọi lượt của vòng (CQCM chủ trì thấy toàn bộ). */
    const n = Flow.tdRound(), ids = ['TTMS'].concat(Flow.cqcmSel()), rows = [];
    for (let i = 0; i < n; i += 1) ids.forEach((id) => { const r = resultK(td, i, id); rows.push({ luot: pad2(i + 1), id, fix: r.fix, n: r.fix ? r.rows.length : 0 }); });
    const hc = draft ? draft.hoanChinhTd : v.hoanChinhTd;
    return `${head(`Tổng hợp kết quả thẩm định — Vòng ${esc(K_DOC[td])} · ${n} lượt`, false)}
      ${table([['Lượt', 70, 'c'], ['Đơn vị', 260], ['Kết luận', 200, 'c'], ['Số ý kiến cần sửa', 140, 'num']], rows,
        (r) => `<td class="c">${r.luot}</td><td>${esc(unitK(r.id))}</td><td class="c">${klBadge(r.fix)}</td><td class="num">${r.n || dash}</td>`)}
      <div class="cap mt8" data-td-hc>Nội dung hoàn chỉnh hồ sơ sau thẩm định: ${hc ? `<b>${esc(hc)}</b>` : 'chưa nhập'}. Lượt cuối các cơ quan đều Đạt — nội dung đã thống nhất. Nhập bằng nút <b>Ghi lại</b> hoặc <b>${k === '46' ? 'Hoàn thành thẩm định chủ trương' : 'Hoàn thành thẩm định KĐT'}</b>.</div>`;
  }

  function cardK(tok) {
    const v = window.EVars.of(tok);
    return `<section class="vcard pad24" data-td-card="kdt"><h3>Thẩm định của cơ quan chuyên môn</h3>
      <div class="td-zone" data-td-zone="1"><h4>Hồ sơ thẩm định</h4>${hoSoK(v)}</div>
      <div class="td-zone" data-td-zone="2"><h4>Lịch sử ý kiến thẩm định</h4>${timelineK(tok)}</div>
      <div class="td-zone" data-td-zone="3">${ketQuaK(tok, v)}</div></section>`;
  }

  const notesK = () => ['Thẩm định bốn khu cho KĐT (T31 B4, IA-DXMS dòng 19–22 và Luồng thao tác bước 5): áp bước 27, 29, 46, 55 của MS13; bước 67 (Ban chuyên môn Tập đoàn) không áp vì người thẩm định ở Tập đoàn. MS14 chưa chạy luồng trên prototype (D-18) — TODO khi dựng MS14 (bước 20, 23).',
    'Khu 3 giữ chữ SRS-KDT: bước 27 đánh giá <b>Đạt / Không đạt</b> từng nội dung thẩm định, kết luận hệ thống tính (BR-KDT-08-04); bước 29 kết luận Đạt / Cần sửa đổi, giải trình (BR-KDT-08-05). ĐXMS dùng OK / Không OK, Đồng ý / Yêu cầu sửa.',
    'Lịch sử theo vòng (BM-00 / BM-01 / BM-03) và lượt kiểm tra (BR-KDT-08-01). CQCM phối hợp chỉ thấy kết quả của cơ quan mình; dòng cơ quan khác chỉ có tên, trạng thái, ngày gửi, không có kết luận (BR-KDT-08-06 — chặt hơn P-200 của ĐXMS). Kết quả CQCM chủ trì, họp, kết luận Thủ trưởng hiện cho mọi người.',
    'Khu 4: <b>Ghi lại</b> = Lưu nháp eForm (hồ sơ giữ Đang thẩm định); nút chuyển bước giữ nhãn BPMN. <b>Hủy thẩm định</b> không có trong BPMN MS13 / MS14 — DX-09 mở rộng sang KĐT, chưa dựng.',
    'Hành động IA dòng 22 với KĐT: Cập nhật và giải trình = bước 31; Xem nội dung = Chi tiết hồ sơ KĐT; Lưu TTr đã ký = khối ký chung; Tạm dừng = Chỉ đạo dừng (bước 38); Cập nhật người xem chưa dựng (P-189). Xem .docx trực tuyến cần dịch vụ chuyển PDF (dev riêng).'];

  document.addEventListener('click', async (e) => {
    const tb = e.target.closest('[data-td-tab]');
    if (tb) { T.tab = tb.dataset.tdTab; window.App.render(); return; }
    const sv = e.target.closest('[data-td-save]');
    if (sv) {
      const tok = Flow.token(sv.dataset.tdSave);
      if (tok) await window.TaskForms.run(tok, null, { draftOnly: true });
    }
  });

  window.ThamDinh = { card, ghiLaiBtn, notes: (tok) => (tok && appliesK(tok) ? notesK() : notes()), applies: (tok) => applies(tok) || appliesK(tok), events, eventsK, ketLuan };
})();
