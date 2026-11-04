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

  /* Khu 2 — sự kiện theo lần thẩm định. Lần tăng khi TTMS xác nhận danh sách CQCM và gửi yêu cầu (bước 17, BM-03). */
  function events(tok) {
    const me = tok.cqcm, out = [], seen = {};
    let lan = 0;
    Flow.state.history.forEach((h) => {
      const k = String(h.task);
      if (k === '17' && /^Danh sách đúng/.test(h.action || '')) { lan += 1; out.push({ lan, t: h.t, who: h.who, title: 'TTMS gửi yêu cầu thẩm định (BM-03)', tone: 'info' }); return; }
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
    if (!applies(tok)) return '';
    const v = window.EVars.of(tok);
    return `<section class="vcard pad24" data-td-card><h3>Thẩm định của cơ quan chuyên môn</h3>
      <div class="td-zone" data-td-zone="1"><h4>Hồ sơ thẩm định</h4>${hoSo(v)}</div>
      <div class="td-zone" data-td-zone="2"><h4>Lịch sử ý kiến thẩm định</h4>${timeline(tok)}</div>
      <div class="td-zone" data-td-zone="3">${phieuCard(tok, v)}</div></section>`;
  }

  /* Khu 4 — nút Ghi lại (bước 19, chuyên viên CQCM): mở eForm BM-04 chỉ có Hủy / Ghi lại. */
  const ghiLaiBtn = (tok, mine) => (mine && applies(tok) && String(tok.task) === '19' ? `<button type="button" class="vbtn secondary" data-td-save="${esc(tok.id)}">Ghi lại</button>` : '');

  const notes = () => ['Thẩm định bốn khu (T29 S9, YC-DXMS-PROTO §5): Hồ sơ thẩm định xem trực tuyến, Lịch sử ý kiến theo lần, Phiếu BM-04 theo mục, hàng nút. Phiếu vẫn nhập bằng eForm mở dialog (D-24).',
    'Đồng ý / Yêu cầu sửa là <b>kết luận</b> của phiếu BM-04 (mọi mục OK → Đồng ý; có mục Không OK → Yêu cầu sửa), không phải nút chuyển hồ sơ về ĐVĐX: hồ sơ về ĐV sau khi đủ BM-04 ở bước 23–25 theo BPMN (Q7, P-197).',
    'Lịch sử ý kiến: cơ quan mình thấy đủ nội dung các lần; cơ quan khác chỉ thấy sự kiện và kết luận (BR-DXMS-07-04, comment #14). YC-DXMS-PROTO §5 ghi "toàn bộ cây góp ý của các CQCM khác" → P-200.',
    'Nút <b>Hủy thẩm định</b> (YC §6) chưa dựng: BPMN MS01 không có nhánh này, đã đề xuất DX-09 (chờ BA).',
    'Xem trực tuyến tệp .docx cần dịch vụ chuyển PDF — cần dev riêng (như Văn bản đầu ra). Khu 1, 2 là card cấu hình của my-task-detail; khu 3 đọc biến eForm BM-04.'];

  document.addEventListener('click', async (e) => {
    const tb = e.target.closest('[data-td-tab]');
    if (tb) { T.tab = tb.dataset.tdTab; window.App.render(); return; }
    const sv = e.target.closest('[data-td-save]');
    if (sv) {
      const tok = Flow.token(sv.dataset.tdSave);
      if (tok) await window.TaskForms.run(tok, null, { draftOnly: true });
    }
  });

  window.ThamDinh = { card, ghiLaiBtn, notes, applies, events, ketLuan };
})();
