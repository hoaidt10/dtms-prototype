/*
 * Nội dung nhập liệu riêng của từng màn xử lý task (SCR-03…19, 22, 26) — các card đặt giữa "Quy trình" và
 * "Danh sách tài liệu" của khung my-task-detail (screens.js). Card cùng khuôn: vcard p-6, tiêu đề 18/600.
 * render(tok) trả HTML; validate(tok, choice) trả thông báo lỗi nếu hành động chưa được phép (theo kịch bản §2.4).
 * Ghi chú BA và điểm ❓ không hiện trên màn: gom qua ba() / qChip() rồi đưa vào nút (i) (rule A1–A3), đọc bằng notes().
 * Dữ liệu người dùng nhập lưu ở Flow.ui qua các thuộc tính data-ui-*.
 */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, avatar, ty, pad2, cqcmUnit, badge, vRadio, vSteps, vSelect } = window.UI;

  /* Ghi chú BA của màn đang dựng — nút (i) đọc qua notes(). */
  let BA = { notes: [], q: [] };
  const ba = (html) => { BA.notes.push(html); return ''; };
  const qChip = (id) => { if (!BA.q.includes(id)) BA.q.push(id); return ''; };

  const U = () => Flow.ui;
  const card = (title, inner, right) => `<section class="vcard pad24"><div class="vcard-h"><h3>${title}</h3>${right ? `<div class="row">${right}</div>` : ''}</div>${inner}</section>`;
  const table = (head, rows) => `<div class="vtable-vp"><table class="vtable form"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  /* Kết quả AI: card cùng khuôn, badge kết quả bên phải tiêu đề. */
  const ai = (title, inner, kind, label) => card(`<span class="ai-t">${icon('spark')}${title}</span>`, `<div class="ai-body">${inner}</div>`,
    kind ? badge(label || (kind === 'pass' ? 'Đạt' : 'Không đạt'), kind === 'pass' ? 'success' : 'error') : '');
  const tick = (ok) => (ok ? badge('OK', 'success') : badge('Không OK', 'error'));
  const field = (label, ctl, req, msg) => `<div class="vfield"><div class="lr"><label>${label}</label>${req ? '<span class="req">*</span>' : ''}</div>${ctl}${msg ? `<p class="msg">${msg}</p>` : ''}</div>`;
  const input = (v, attrs) => `<input class="vctl" value="${esc(v)}" ${attrs || ''}>`;
  const area = (v, attrs) => `<textarea class="vctl ta" rows="3" ${attrs || ''}>${esc(v)}</textarea>`;
  const radios = (items) => `<div class="vradio h">${items.join('')}</div>`;
  const opt = (key, val, label, on) => vRadio(label, on, `data-ui="${key}" data-v='${JSON.stringify(val)}'`);
  const kv = (k, v, full) => `<div class="${full ? 'full' : ''}"><div class="k">${k}</div><div class="v">${v}</div></div>`;
  const fileBtn = (key, name) => (U()[key]
    ? `<span class="file">${icon('file')} ${esc(name)} <button class="x" data-ui="${key}" data-v="false" aria-label="Xóa tệp">${icon('x')}</button></span>`
    : `<button type="button" class="vbtn sm red" data-ui="${key}" data-v="true">${icon('upload')} Tải file lên</button>`);
  const roundBadge = () => { const r = Flow.state.vars.round; return badge(`Vòng giải trình ${r}/2`, r > 2 ? 'error' : 'warning'); };

  /* ---------- Hồ sơ đang chạy (T6): dữ liệu theo ĐXMS (D.caseRef), nhánh < 160 tỷ (MS01.03) đổi văn bản ---------- */
  const R = () => D.caseRef;
  const small = () => Flow.isSmall();
  const draftTask = () => (small() ? 11 : 12);
  const tt = () => (small() ? 'BM-09' : 'BM-01');
  const clName = () => (small() ? 'Checklist 02' : 'Checklist 01');
  const buyItems = () => D.items.filter((i) => i.buy > 0);
  /* Nội dung có hai bản [v1, v2]: trước / sau hoàn chỉnh ở task 27. */
  const vv = (x) => (Array.isArray(x) ? x[Flow.doneCount(27) ? 1 : 0] : x);
  const vnd = (t) => Math.round(t * 1e9).toLocaleString('vi-VN');
  const selCqcm = () => D.cqcm.filter((c) => Flow.cqcmSel().includes(c.id));

  /* Ý kiến BM-04 của một CQCM. Từ vòng BM-04 thứ hai (sau khi ĐVĐX giải trình, task 28–29 → 13 → 18), ý kiến
     mà ĐVĐX đã bảo lưu được coi là CQCM chấp nhận giải trình — theo kịch bản demo. */
  function opinionsOf(c) {
    const edits = (U().bm04 || {})[c] || {}, base = D.opinions[c] || {};
    const accepted = Flow.state.vars.round > 0 && respOf(c) === 'Bảo lưu';
    return D.bm04Sections.filter((s) => base[s] || edits[s]).map((s) => {
      const o = Object.assign({ sec: s }, base[s] || {}, edits[s] || {});
      return accepted && !o.ok ? Object.assign({}, o, { ok: true, text: 'Chấp nhận giải trình của đơn vị.', guide: '' }) : o;
    });
  }
  const bm04Round = () => 1 + Flow.state.vars.round;
  const nok = () => selCqcm().flatMap((c) => opinionsOf(c.id).filter((o) => !o.ok).map((o) => Object.assign({ cqcm: c.id }, o)));
  const respOf = (c) => ((U().resp || {})[c]) || (D.responses[c] || {}).decision || 'Tiếp thu';
  const version = () => 1 + Flow.doneCount(27);

  /* ---------- Quy trình đã chọn (SCR-25) — kiểm tra khớp ---------- */
  const proc = () => Flow.state.vars.process;
  const procOf = (k) => D.processes[k] || {};
  const fileCode = () => Flow.ci().code.replace('Đ', 'D');
  /* Điều kiện của quy trình theo Ngưỡng phân luồng hồ sơ giữ lúc tạo (SCR-40, P-34). */
  const condOf = (k) => Flow.condOf(k);
  /* Văn bản căn cứ hiện ở task 1: đúng loại đang chọn và hợp với quy trình. */
  const basisList = (bt) => D.basisDocs.filter((d) => d.type === bt && D.basisFits(proc(), d));
  function basisSel() {
    const u = U(), bt = u.basisType || R().basisType, list = basisList(bt);
    const doc = list.find((d) => d.id === u.basisDoc) || (u.basisDoc ? null : list.find((d) => d.id === R().basisDoc) || list[0]) || null;
    return { bt, list, doc };
  }
  /* Căn cứ của hồ sơ: văn bản đang chọn ở task 01, chưa hợp lệ thì văn bản của hồ sơ mẫu. */
  const basisDoc = () => basisSel().doc || D.basisDocs.find((d) => d.id === R().basisDoc);
  const cmpBox = (r) => `<div class="cmp">
    ${kv('Quy trình đã chọn', esc(r.process))}${kv('Điều kiện của quy trình', esc(condOf(r.process)))}
    ${kv('Tổng giá trị hiện tại', ty(r.total) + ' tỷ')}${kv('Quy trình phù hợp', esc(r.suggest))}</div>`;

  /* ---------- Giai đoạn 1 ---------- */
  function scr03() {
    const { bt, list, doc } = basisSel();
    const p = procOf(proc());
    const hidden = D.basisDocs.filter((d) => !D.basisFits(proc(), d)).length;
    ba(`Quy trình ${esc(proc())} (${esc(condOf(proc()))}): danh sách căn cứ chỉ hiện văn bản hợp với quy trình đã chọn${hidden ? ` — ẩn ${hidden} văn bản không hợp` : ''}; loại căn cứ không dùng cho quy trình bị khoá trong ô chọn.`);
    ba('Giá trị được kiểm tra sau báo giá (cổng "Giá trị khớp quy trình đã chọn?" sau task 10). Hoàn thành → hệ thống lấy dữ liệu (task 02), AI gợi ý thông tin cơ bản (task 03).');
    if (Flow.state.replaces) ba(`Hồ sơ thay thế: dữ liệu sao chép từ <b>${esc(Flow.state.replaces)}</b> (task 10b) — căn cứ, thông tin cơ bản, danh mục, kết quả RSTK, báo giá; người dùng kiểm tra lại rồi xác nhận từng bước.`);
    qChip('P-01'); qChip('P-26');
    const types = D.basisTypes.map((b) => ({ value: b.id, label: b.name, disabled: (p.noTypes || []).includes(b.id) }));
    return `${card('Căn cứ đề xuất', `<div class="grid2">
        ${field('Loại căn cứ', vSelect({ id: 'b-type', value: bt, options: types, onChange: (v) => Flow.setUi('basisType', v) }), true, esc((D.basisTypes.find((b) => b.id === bt) || {}).src ? 'Nguồn: ' + D.basisTypes.find((b) => b.id === bt).src : ''))}
        ${field('Quy trình', input(`${proc()} — ${p.name || ''}`, 'disabled'))}</div>`)}
      ${card('Văn bản căn cứ đã phê duyệt', table('<th class="ord"></th><th style="width:150px">Số / ngày</th><th>Trích yếu</th><th class="r" style="width:110px">Giá trị (tỷ)</th><th class="r" style="width:110px">Còn lại (tỷ)</th><th style="width:170px">CT/TGĐ TĐ đã duyệt</th>',
        list.map((d) => { const on = doc && d.id === doc.id; return `<tr class="click ${on ? 'sel' : ''}" data-ui="basisDoc" data-v='"${d.id}"'><td class="ord">${vRadio('', on)}</td><td><b>${d.no}</b><div class="sub">${d.date}</div></td><td><span class="clamp">${esc(d.title)}</span></td><td class="r num">${ty(d.value)}</td><td class="r num">${ty(d.remain)}</td><td>${d.group ? badge('Đã duyệt', 'success') : badge('Chưa duyệt', 'default')}</td></tr>`; }).join('')
        || '<tr><td class="vtable-empty" colspan="6">Không có dữ liệu</td></tr>'))}`;
  }

  /* Nguồn vốn chọn từ danh mục Nguồn vốn (SCR-32): chỉ bản ghi đang hoạt động, trừ giá trị hồ sơ đang giữ (P-33).
     Chấp nhận gợi ý AI thì chọn nguồn vốn AI trích từ căn cứ. */
  const fundOf = (u, st) => (u.fund !== undefined ? u.fund : st.fund === 'accepted' ? D.aiBasic.find((a) => a.key === 'fund').code : null);
  const fundOptions = (cur) => window.Catalog.rows('nguon-von').filter((r) => r.active || r.code === cur).map((r) => ({ value: r.code, label: r.name }));

  function scr04() {
    const u = U(), st = u.ai || {};
    const val = (k, d) => (st[k] === 'accepted' ? (D.aiBasic.find((a) => a.key === k) || {}).value : st[k] === 'edited' ? (u['ed_' + k] || '') : d);
    /* Cảnh báo mềm (không chặn): giá trị dự kiến AI gợi ý đã lệch ngưỡng của quy trình đã chọn. */
    const est = D.aiEstimate;
    const off = !Flow.inRange(proc(), est);
    if (off) ba('Cảnh báo mềm (không chặn) khi giá trị dự kiến lệch điều kiện quy trình; kiểm tra chính thức ở cổng sau task 10.');
    ba('Nguồn vốn chọn từ danh mục Nguồn vốn (Quản trị hệ thống › Danh mục dùng chung); nguồn vốn dừng hoạt động không hiện trong ô chọn (P-33). Chấp nhận gợi ý AI thì tự chọn nguồn vốn AI trích từ căn cứ.');
    ba('Bỏ trường "Loại xử lý" (Tạo mới / Điều chỉnh): Điều chỉnh thuộc MS02, ngoài phạm vi. Hồ sơ Mật thì mặc định ký cứng.');
    qChip('P-02'); qChip('P-26');
    return `${off ? `<div class="banner-bad">Giá trị dự kiến khoảng ${ty(est, 0)} tỷ, lệch điều kiện của quy trình ${esc(proc())} (${esc(condOf(proc()))}). Hệ thống sẽ kiểm tra lại sau khi có báo giá.</div>` : ''}
      ${card('Thông tin cơ bản ĐXMS', `<div class="grid2">
        <div class="span2">${field('Tên đề xuất', input(Flow.ci().title), true)}</div>
        ${field('Mục đích mua sắm', vSelect({ id: 'b-purpose', value: R().purposeCode, options: [['DT', 'Duy trì thường xuyên'], ['SX', 'Liên tục SXKD'], ['KHCN', 'Triển khai hoạt động KHCN'], ['QP', 'QP-AN-CT']].map(([v, l]) => ({ value: v, label: l })) }), true)}
        ${field('Người phụ trách', input(`${persona('minh').name} — ${D.caseInfo.unit}`, 'disabled'))}
        <div class="span2">${field('Mục đích (thuyết minh)', area(val('purposeText', '')), true)}</div>
        <div class="span2">${field('Phạm vi, quy mô', area(val('scope', '')), true)}</div>
        ${field('Nguồn vốn', vSelect({ id: 'b-fund', value: fundOf(u, st), searchable: true, placeholder: 'Chọn nguồn vốn', options: fundOptions(fundOf(u, st)), onChange: (v) => Flow.setUi('fund', v) }), true)}${field('Thời gian thực hiện', input(val('period', '')), true)}
        ${field('Mật', radios([opt('secret', false, 'Không', !u.secret), opt('secret', true, 'Có', !!u.secret)]), true, 'Mặc định theo loại ĐXMS.')}
        ${field('Mức ưu tiên', radios(['Thường', 'Khẩn', 'Thượng khẩn'].map((x) => opt('priority', x, x, (u.priority || D.caseInfo.priority) === x))), true)}</div>`)}
      ${ai(`AI gợi ý từ căn cứ ${esc(basisDoc().no)}`, D.aiBasic.map((a) => {
        const s = st[a.key];
        return `<div class="ai-item ${s || ''}"><div class="k">${esc(a.label)}</div>
          ${s === 'edited' ? `<textarea class="vctl ta" rows="3" data-ui-in="ed_${a.key}">${esc(u['ed_' + a.key] || a.value)}</textarea>` : `<div class="v">${esc(a.value)}</div>`}
          <div class="src">Nguồn: ${esc(a.from)}</div>
          <div class="row">${s ? `${badge(s === 'accepted' ? 'Đã chấp nhận' : s === 'edited' ? 'Đang sửa' : 'Đã bỏ', s === 'dropped' ? 'default' : 'success')}<button class="vbtn sm ghost" data-uimap="ai" data-k="${a.key}" data-v="null">Hoàn tác</button>`
            : `<button class="vbtn sm primary" data-uimap="ai" data-k="${a.key}" data-v='"accepted"'>Chấp nhận</button><button class="vbtn sm secondary" data-uimap="ai" data-k="${a.key}" data-v='"edited"'>Sửa</button><button class="vbtn sm ghost" data-uimap="ai" data-k="${a.key}" data-v='"dropped"'>Bỏ</button>`}</div></div>`;
      }).join(''), null, null).replace('</section>', '')}<div class="row"><button class="vbtn sm secondary" data-ai-all="1">Chấp nhận tất cả</button></div></section>`;
  }

  function lineRemain(i) { return i.bom == null ? null : i.bom - i.used; }
  const propOf = (i) => { const p = (U().prop || {})[i.n]; return p == null ? i.prop : p; };

  function scr05() {
    ba('Trừ lùi: số đã dùng ở ĐXMS khác bị trừ khỏi số lượng gốc của căn cứ.'
      + D.items.filter((i) => i.used).map((i) => ` Dòng ${i.n} đã dùng ${i.used} ở ĐXMS khác nên còn ${i.bom - i.used}.`).join(''));
    D.items.filter((i) => i.warn).forEach((i) => ba(`Dòng ${i.n} không có trong dự toán/eBOM: chỉ cảnh báo, không chặn (mặc định theo BBLV 09/09).`));
    ba(`Căn cứ thiếu thông tin → chọn "Thiếu thông tin căn cứ" để quay lại task 04. Nguồn bóc tách (${esc(R().src)}) là dữ liệu giả lập.`);
    qChip('P-03');
    const rows = D.items.map((i) => {
      const rem = lineRemain(i), p = propOf(i), bad = rem != null && p > rem;
      return `<tr ${i.warn ? 'class="warn-row"' : ''}><td class="ord">${i.n}</td><td><span class="clamp">${esc(i.name)}</span>${i.warn ? `<div class="sub warn">${esc(i.warn)}</div>` : ''}</td><td>${esc(i.uom)}</td>
        <td class="r num">${i.bom == null ? '-' : i.bom}</td>
        <td class="r num">${i.used ? `<span class="used" title="${esc(D.usedIn[i.n] || '')}">${i.used}</span>` : i.used == null ? '-' : 0}</td>
        <td class="r num"><b>${rem == null ? '-' : rem}</b></td>
        <td class="r"><input class="vctl num-in ${bad ? 'err' : ''}" type="number" min="0" value="${p}" data-uimap-in="prop" data-k="${i.n}">${bad ? '<div class="err-t">Vượt số còn lại</div>' : ''}</td>
        <td>${i.group ? 'Nhóm ' + i.group : '-'}</td></tr>`;
    }).join('');
    return `${card('Cấu trúc căn cứ', `<ul class="tree">${D.tree.map((n) => `<li class="${n.warn ? 'warn' : ''}"><b>${esc(n.name)}</b>${n.children ? `<ul>${n.children.map((c) => `<li>${esc(c.name)} <span class="faint">(${c.lines.length} dòng)</span></li>`).join('')}</ul>` : ` <span class="faint">(${n.lines.length} dòng)</span>`}</li>`).join('')}</ul>
        <p class="msg">Nguồn: ${esc(R().src)}.</p>`)}
      ${card('Bóc tách danh mục hàng hoá', table('<th class="ord">STT</th><th>Hàng hoá / dịch vụ</th><th style="width:80px">ĐVT</th><th class="r" style="width:80px">SL gốc</th><th class="r" style="width:80px">Đã dùng</th><th class="r" style="width:80px">Còn lại</th><th class="r" style="width:110px">SL đề xuất</th><th style="width:100px">Nhóm YCBG</th>', rows))}`;
  }

  function scr06() {
    ba('Khả dụng = tồn sổ sách − hàng đang giữ cho tờ trình khác; mặc định dùng từ kho tối đa bằng số đề xuất.'
      + D.items.filter((i) => i.stock).map((i) => ` Dòng ${i.n}: ${i.book != null ? i.book : i.stock} − ${i.held || 0} = ${i.stock}, SL mua ${i.prop} → ${i.buy}.`).join('')
      + ' ĐTMS gửi yêu cầu rà soát ở task 06, ĐVĐX xác nhận ở task 07.');
    if (D.items.some((i) => i.stock && !i.buy)) ba('Hạng mục dùng hết từ tồn kho: SL mua = 0, không đưa vào YCBG (nhóm YCBG để trống).');
    qChip('P-04');
    const fs = U().fromStock || {};
    const rows = D.items.map((i) => {
      const avail = i.stock == null ? null : i.stock, max = Math.min(avail || 0, propOf(i));
      const use = fs[i.n] != null ? fs[i.n] : max, buy = propOf(i) - use;
      const book = i.book != null ? i.book : avail;
      return `<tr ${avail ? 'class="hl-row"' : ''}><td class="ord">${i.n}</td><td><span class="clamp">${esc(i.name)}</span></td><td class="r num">${propOf(i)}</td>
        <td class="r num">${book == null ? '-' : book}</td><td class="r num">${i.held ? `${i.held} <div class="sub">${esc(i.heldFor)}</div>` : i.stock == null ? '-' : 0}</td>
        <td class="r num"><b>${avail == null ? '-' : avail}</b></td>
        <td class="r">${avail ? `<input class="vctl num-in" type="number" min="0" max="${max}" value="${use}" data-uimap-in="fromStock" data-k="${i.n}">` : '<span class="faint">-</span>'}</td>
        <td class="r num"><b>${buy}</b>${buy !== propOf(i) ? `<div class="sub">${propOf(i)} → ${buy}</div>` : ''}</td></tr>`;
    }).join('');
    return `${card('Trạng thái rà soát tồn kho', vSteps({ id: 'rstk', steps: [
        { title: 'Gửi yêu cầu rà soát', sub: Flow.dateOf(Math.max(0, Flow.state.clock - 1)), state: 'completed' },
        { title: 'Quản lý kho trả kết quả', sub: R().rstk, state: 'completed' },
        { title: 'Xác nhận số dùng từ kho', sub: 'ĐVĐX', state: 'active' }] }))}
      ${card('Kết quả rà soát', table('<th class="ord">STT</th><th>Hàng hoá</th><th class="r" style="width:90px">SL đề xuất</th><th class="r" style="width:90px">Tồn sổ sách</th><th class="r" style="width:110px">Đang giữ</th><th class="r" style="width:80px">Khả dụng</th><th class="r" style="width:110px">Dùng từ kho</th><th class="r" style="width:90px">SL mua</th>', rows))}`;
  }

  /* Nhà cung cấp nhận YCBG chọn từ danh mục Nhà cung cấp (SCR-31), lọc theo ngành hàng của các hạng mục. Nhà cung cấp dừng hoạt động
     không hiện (P-33); đang bị cấm hiện nhưng không chọn được; bị hạn chế chọn được, kèm badge. Mặc định chọn 3 NCC của kịch bản. */
  const nccName = (code) => { const n = D.nccOf(code); return n.short || n.name || code; };
  const nccDefault = () => D.quotes.map((q) => q.ncc);
  const nccSel = () => U().nccSel || nccDefault();
  const itemGoods = () => [...new Set(D.items.map((i) => i.goods))];
  const goodsName = (code) => (window.Catalog.rows('loai-hang-hoa').find((r) => r.code === code) || {}).name || code;
  function scr07a() {
    // Theo: ecat common-catalog partner (cột Mã / Tên / Email / Tình trạng) — bảng chọn nhiều trong card của my-task-detail;
    // email xuống dòng phụ dưới tên để bảng vừa cột chính (không cuộn ngang).
    ba('Người dùng tạo YCBG, hệ thống gửi email thay TTMS (task 09). Theo BBLV 22/09, không có bước ký báo giá.');
    ba('Nhà cung cấp lấy từ danh mục Nhà cung cấp / Nhà thầu, lọc theo ngành hàng của các hạng mục (Viễn thông - CNTT, Nghiên cứu sản xuất, Dịch vụ phi tư vấn). Không có cổng nhà cung cấp: YCBG gửi tới Email nhận yêu cầu báo giá (chốt 28/09/2026).');
    ba('Nhà cung cấp dừng hoạt động không hiện (P-33); đang bị cấm hiện nhưng không chọn được; bị hạn chế vẫn chọn được. Mặc định chọn NCC Alpha, Beta, Gamma — 3 báo giá của kịch bản.');
    qChip('P-33');
    const u = U(), ns = nccSel(), want = u.nccGoods ? [u.nccGoods] : itemGoods();
    const list = window.Catalog.rows('nha-cung-cap').filter((r) => r.active && (r.goods || []).some((x) => want.includes(x)));
    const banned = (r) => !!(r.ban && r.ban.until);
    const g = (n) => buyItems().filter((i) => i.group === n).map((i) => `<li>${i.n}. ${esc(i.name)} — ${i.buy} ${esc(i.uom)} <span class="faint">· ${esc(goodsName(i.goods))}</span></li>`).join('');
    const rows = list.map((r) => `<tr data-ncc="${r.code}"><td class="ord"><label class="check"><input type="checkbox" ${ns.includes(r.code) && !banned(r) ? 'checked' : ''} ${banned(r) ? 'disabled' : ''}
        data-uitoggle="nccSel" data-k="${r.code}" data-all='${JSON.stringify(nccDefault())}' aria-label="Chọn ${esc(r.name)}"></label></td>
      <td>${esc(r.code)}</td><td><span class="clamp">${esc(r.name)}</span><div class="sub">${esc(r.email)}</div></td>
      <td><span class="clamp">${esc(r.goods.filter((x) => itemGoods().includes(x)).map(goodsName).join(', '))}</span></td>
      <td>${!r.ban ? badge('Bình thường', 'default') : r.ban.until ? badge('Cấm đến ' + r.ban.until, 'error') : badge('Hạn chế', 'warning')}</td></tr>`).join('');
    const picked = ns.filter((c) => list.some((r) => r.code === c && !banned(r))).length;
    return `${card('YCBG nhóm 1 — Hàng hoá, dịch vụ mua sẵn', `<ul class="plain">${g(1)}</ul>`)}
      ${g(2) ? card('YCBG nhóm 2 — Hàng hoá sản xuất theo yêu cầu', `<ul class="plain">${g(2)}</ul>${R().group2Note ? `<p class="msg">${esc(R().group2Note)}</p>` : ''}`) : ''}
      ${card('Nhà cung cấp nhận YCBG', `<div class="ycbg-filter">${vSelect({ id: 'b-ncc-goods', value: u.nccGoods || null, clear: true, placeholder: 'Tất cả ngành hàng của hạng mục',
          options: itemGoods().map((c) => ({ value: c, label: goodsName(c) })), onChange: (v) => Flow.setUi('nccGoods', v) })}</div>
        ${table('<th class="ord"></th><th style="width:130px">Mã nhà cung cấp</th><th style="min-width:220px">Tên nhà cung cấp</th><th style="min-width:150px">Ngành hàng</th><th style="width:170px">Tình trạng</th>',
          rows || '<tr><td class="vtable-empty" colspan="5">Không có dữ liệu</td></tr>')}
        <div class="grid2">${field('Hạn trả lời', input(Flow.dateOf(Flow.state.clock + 3)))}${field('Người gửi', input('Hệ thống (gửi thay TTMS)', 'disabled'))}</div>`, badge(`Đã chọn ${picked} nhà cung cấp`, 'info'))}`;
  }

  function quoteAttempt() { return Math.max(1, Flow.doneCount(9)); }
  /* Kịch bản: lần YCBG đầu Không đạt. Báo giá đã từng đạt (quay lại từ 10a) hoặc sao chép từ hồ sơ cũ thì không lặp lại. */
  function quoteFail() {
    return R().quoteFailFirst && quoteAttempt() === 1 && !Flow.state.replaces && !Flow.state.history.some((h) => h.task === 10 && h.action === 'Báo giá đạt');
  }

  function scr07b() {
    const fail = quoteFail();
    qChip('P-06');
    ba('Tên và loại tiền của nhà cung cấp lấy từ danh mục Nhà cung cấp; báo giá bằng ngoại tệ được quy đổi sang VNĐ.');
    ba(R().quoteFailFirst ? 'Kịch bản: lần gửi YCBG đầu Không đạt (NCC Gamma hết hiệu lực) → "Không đạt — gửi lại YCBG" về task 09; lần 2 Đạt.' : 'Kịch bản: báo giá đạt ngay lần gửi YCBG đầu.');
    if (buyItems().length < D.items.length) ba('Chỉ so sánh các dòng có SL mua > 0 (dòng dùng hết từ tồn kho không gửi YCBG).');
    const head = buyItems().map((i) => `<th class="r">Dòng ${i.n}</th>`).join('');
    const rows = D.quotes.map((q) => {
      const expired = fail && q.ncc === 'NCC-000003', cur = D.nccOf(q.ncc).currency || 'VNĐ';
      return `<tr><td><b>${esc(nccName(q.ncc))}</b><div class="sub">Ngày ${q.date} · ${esc(cur === 'VNĐ' ? cur : cur + ' → VNĐ')}</div></td>
        <td class="${expired ? 'bad' : ''}">${expired ? q.valid : (q.validRetry && !fail ? q.validRetry : q.valid)}</td>
        ${buyItems().map((i) => { const p = q.prices[i.n]; const min = Math.min(...D.quotes.map((x) => x.prices[i.n])); return `<td class="r num ${p === min ? 'best' : ''} ${expired && i.n === 3 ? 'bad' : ''}">${ty(p)}</td>`; }).join('')}</tr>`;
    }).join('');
    return `${card('So sánh báo giá (đơn giá, tỷ đồng, gồm VAT)', table(`<th>Nhà cung cấp</th><th style="width:110px">Hiệu lực đến</th>${head}`, rows), `${badge(`Lần gửi YCBG: ${quoteAttempt()}`, 'info')}${badge('3/3 NCC đã phản hồi', 'default')}`)}
      ${fail ? ai('Kết quả kiểm tra báo giá', `<ul class="plain"><li>${esc(nccName('NCC-000003'))}: báo giá hết hiệu lực từ 20/09/2026, dùng cho dòng 3 (buồng đo OTA).</li><li>Cần ít nhất 3 báo giá còn hiệu lực cho mỗi dòng.</li></ul><p class="msg">Chọn “Không đạt — gửi lại YCBG” để gửi lại yêu cầu báo giá cho ${esc(nccName('NCC-000003'))}.</p>`, 'fail')
        : ai('Kết quả kiểm tra báo giá', `<ul class="plain"><li>3/3 báo giá còn hiệu lực, đủ ${buyItems().length} dòng.</li><li>Đơn giá thấp nhất mỗi dòng được tô xanh, dùng làm cơ sở giá.</li></ul>`, 'pass')}
      ${flowLabel()}`;
  }
  /* Xem trước cổng "Giá trị khớp quy trình đã chọn?" chạy ngay sau khi bấm "Báo giá đạt". */
  const flowLabel = () => {
    const r = Flow.matchCheck();
    qChip('P-26');
    ba(`Cổng "Giá trị khớp quy trình đã chọn?" chạy khi bấm "Báo giá đạt": khớp → task ${r.process === 'MS01.03' ? '11 (dự thảo BM-09)' : '12 (dự thảo BM-01)'}; không khớp → task 10a (ĐVĐX xử lý).`);
    return `<div class="flow-label">Tổng giá trị ${ty(r.total)} tỷ (gồm VAT, sau khi trừ tồn kho) ${r.ok ? badge('Khớp', 'success') : badge('Không khớp', 'error')}
      ${r.ok ? `quy trình ${esc(r.process)}` : `điều kiện của quy trình ${esc(r.process)} (${esc(condOf(r.process))})`}</div>`;
  };

  /* SCR-26 — task 10a: hồ sơ không khớp quy trình đã chọn. Sửa lại → task 10; Chuyển quy trình → 10b tạo hồ sơ mới của cùng ĐXMS (D-10). */
  function scr26() {
    const r = Flow.matchCheck(), checks = Flow.state.vars.checks;
    qChip('P-26');
    ba(`Ngưỡng lấy từ Ngưỡng phân luồng tại ngày tạo hồ sơ (${esc(condOf(r.process))}), tính trên tổng kinh phí gồm VAT, sau khi đã trừ tồn kho. Quy trình phù hợp dựa trên giá trị và căn cứ đang chọn (${esc((basisSel().doc || {}).no || '—')}).`);
    ba(`Sửa lại → task 10. Hồ sơ mẫu có giá trị cố định ${ty(r.total)} tỷ nên trên prototype sẽ lại không khớp.`);
    ba('Chuyển quy trình → task 10b tạo hồ sơ Phê duyệt mới <b>của cùng ĐXMS</b> (không tạo ĐXMS mới), làm lại từ task 01 với dữ liệu đã sao chép sẵn. Không dùng migration process instance của Camunda. Lựa chọn nào cũng bắt buộc ghi lý do.');
    const copy = ['Căn cứ và phạm vi', 'Thông tin cơ bản', 'Danh mục hàng hoá sau trừ lùi', `Kết quả rà soát tồn kho ${R().rstk}`, 'Yêu cầu báo giá và 3 báo giá'];
    return `<div class="banner-bad">Giá trị hồ sơ không khớp quy trình đã chọn. Hồ sơ chưa được chuyển sang bước dự thảo.</div>
      ${card('Kết quả kiểm tra khớp quy trình', cmpBox(r))}
      ${card('Sửa lại', '<p>Dùng khi nhập sai báo giá hoặc giá trị. Hồ sơ quay về bước Tổng hợp và kiểm tra báo giá; sau khi sửa, hệ thống kiểm tra khớp lại.</p>')}
      ${card(`Chuyển quy trình → ${esc(r.suggest)}`, `<p>Hệ thống tạo hồ sơ <b>${esc(D.caseCodes[1])}</b> của ĐXMS ${esc(Flow.ci().dxms)} theo quy trình ${esc(r.suggest)} và sao chép:</p><ul class="plain">${copy.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        <p>Hai hồ sơ được liên kết (“Thay thế cho” / “Được thay bởi”). Hồ sơ này kết thúc với trạng thái <b>Đã chuyển quy trình</b> và không tính KPI.</p>`)}
      ${checks.length > 1 ? card('Lịch sử kiểm tra khớp', table('<th class="ord">Lần</th><th>Ngày</th><th class="r">Giá trị (tỷ)</th><th>Quy trình</th><th>Kết quả</th>',
        checks.map((c, i) => `<tr><td class="ord">${i + 1}</td><td class="num">${Flow.dateOf(c.t)}</td><td class="r num">${ty(c.total)}</td><td>${esc(c.process)}</td><td>${c.ok ? badge('Khớp', 'success') : badge('Không khớp', 'error')}</td></tr>`).join(''))) : ''}`;
  }

  /* Tờ trình BM-01 (≥ 160 tỷ) hoặc BM-09 (< 160 tỷ, P-19) — cùng 10 mục nội dung; BM-09 có thêm ô PHÊ DUYỆT ở đầu và khối chữ ký
     thẩm định ở cuối. ro = bản trình ký (không còn nút bổ sung). */
  function docBody(ro) {
    const u = U(), d = R().doc;
    const sec = (n, title, inner, req) => `<div class="doc-sec"><h4>${n}. ${title}${req ? ' <span class="req">*</span>' : ''}</h4>${inner}</div>`;
    const need = ro || u.necessity ? `<p>${esc(d.necessity)}</p>`
      : `<p class="missing">Chưa có nội dung.</p><button class="vbtn sm secondary" data-ui="necessity" data-v="true">${icon('spark')} Bổ sung theo gợi ý AI</button>`;
    const s = small() ? bm09Signs() : null;
    return `<div class="doc">
      ${s ? `<div class="doc-sec"><h4>PHÊ DUYỆT</h4><p>${esc(persona('tgd').name)} — Tổng Giám đốc · ${esc(s.tgd.st)}${s.tgd.at ? ' ' + s.tgd.at : ''}</p></div>` : ''}
      ${sec(1, 'Sự cần thiết', need, true)}
      ${sec(2, 'Mục đích', `<p>${esc(D.aiBasic[0].value)}</p>`)}
      ${sec(3, 'Phạm vi, quy mô', `<p>${esc(D.aiBasic[1].value)}</p>`)}
      ${sec(4, 'Tổng kinh phí (gồm VAT)', `<p>${vv(d.total)}</p>`)}
      ${sec(5, 'Phương pháp tính, cơ sở đơn giá', `<p>Đơn giá thấp nhất trong 3 báo giá hợp lệ (${esc(D.quotes.map((q) => nccName(q.ncc)).join(', '))}).</p>`)}
      ${sec(6, 'Phương án kỹ thuật – công nghệ', `<p>${esc(d.tech)}</p>`)}
      ${sec(7, 'Nguồn vốn', `<p>${esc(d.fund ? vv(d.fund) : D.caseInfo.fund)}.</p>`)}
      ${sec(8, 'Sử dụng hàng tồn kho', `<p class="auto">“${esc(d.stock)}” <span class="faint">(câu tự động)</span></p>`)}
      ${sec(9, 'Biện pháp thực hiện', `<p>${esc(vv(d.measures))}.</p>`)}
      ${sec(10, 'Kế hoạch tổ chức thực hiện', `<p>${esc(d.plan)}</p>`)}
      ${s ? `<div class="doc-sec"><h4>Thẩm định</h4><p>CQCM về ĐTXD (TTMS): ${esc(persona('lan').name)} · ${esc(s.ttms.st)}</p><p>Phó Tổng Giám đốc: ${esc(persona('binh').name)} · ${esc(s.ptgd.st)}</p></div>` : ''}</div>`;
  }

  function scr08() {
    const u = U(), tab = u.t08 || 'bm01';
    const rej = Flow.lastOf(13);
    qChip('P-07');
    if (small()) { qChip('P-19'); ba('Luồng < 160 tỷ: Tờ trình BM-09 + Checklist 02 thay BM-01 + Checklist 01 (task 11). BM-09 cùng các mục nội dung với BM-01, thêm ô PHÊ DUYỆT ở đầu và khối chữ ký thẩm định ở cuối — Thủ trưởng phê duyệt ngay trên văn bản này (task 60).'); }
    ba(`AI kiểm tra hồ sơ khi bấm Gửi: Fail thì trả lại ngay (hồ sơ chưa gửi); Pass thì người vẫn phải xác nhận. Chỉ huy không đồng ý → AI lọc nội dung chưa đạt (task 14), hồ sơ về task ${pad2(draftTask())}.`);
    const tabs = [['bm01', `${tt()} Tờ trình`], ['cp', 'Phụ lục chi phí'], ['bm02', 'BM-02'], ['cl01', clName()], ['files', 'Tài liệu đính kèm']];
    let body = '';
    if (tab === 'bm01') {
      body = docBody(false);
    } else if (tab === 'cp') {
      const t = Flow.doneCount(27);
      body = table(`<th class="ord">STT</th><th>Hàng hoá</th><th class="r">SL mua</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th><th>Cơ sở giá</th>${t ? '<th>Loại chi phí</th>' : ''}`,
        D.items.map((i) => `<tr><td class="ord">${i.n}</td><td>${esc(i.name)}</td><td class="r num">${i.buy}</td><td class="r num">${ty(i.price)}</td><td class="r num">${ty(i.amount)}</td><td>${i.buy ? `Báo giá ${esc(nccName('NCC-000001'))}` : 'Dùng tồn kho'}</td>${t ? `<td>${esc(i.cost)}</td>` : ''}</tr>`).join('')
        + `<tr><td></td><td colspan="3"><b>Tổng</b></td><td class="r num"><b>${ty(D.caseInfo.total)}</b></td><td></td>${t ? '<td></td>' : ''}</tr>`);
    } else if (tab === 'bm02') {
      body = `<div class="doc"><div class="doc-sec"><h4>Thuyết minh ĐXMS (BM-02)</h4><p>Hệ thống sinh sẵn từ ${tt()} và phụ lục chi phí. Phụ lục 1 (giải trình ý kiến) được điền khi lập giải trình.</p></div></div>`;
    } else if (tab === 'cl01') {
      body = checklistTable();
    } else {
      body = `<ul class="plain files">${R().doc.files.map((x) => `<li>${icon('file')} ${esc(x)}</li>`).join('')}</ul>`;
    }
    return `${rej && rej.action === 'Không đồng ý' && Flow.doneCount(draftTask()) === Flow.doneCount(13) ? ai(`Chỉ huy đơn vị trả lại: “${esc(rej.reason || '')}”`, '<ul class="plain"><li>AI lọc nội dung chưa đạt: mục “Kế hoạch tổ chức thực hiện” chưa có mốc giao hàng từng lô.</li></ul>', 'fail', 'Trả lại') : ''}
      ${u.aiFail && !u.necessity ? ai('AI kiểm tra hồ sơ', `<ul class="plain"><li>${tt()} thiếu mục bắt buộc <b>“Sự cần thiết”</b> (QT 10.2.1, ${tt()} mục 1).</li></ul><p class="msg">Hồ sơ chưa được gửi. Bổ sung rồi bấm gửi lại.</p>`, 'fail', 'Fail') : ''}
      ${u.necessity ? ai('AI kiểm tra hồ sơ', `<p class="msg">Đủ 10/10 mục bắt buộc của ${tt()}. Khi bấm Gửi, AI kiểm tra lại lần cuối.</p>`, 'pass', 'Sẵn sàng') : ''}
      <section class="vcard pad24"><div class="vcard-h"><h3>Hồ sơ ĐXMS</h3><span class="faint">Phiên bản v${version()}</span></div>
        <div class="tabs in-card">${tabs.map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-ui="t08" data-v='"${k}"'>${l}</button>`).join('')}</div>${body}</section>`;
  }

  function checklistTable(signed) {
    ba('Dòng checklist tự điền từ tài liệu đã có trên hồ sơ (§5.6).');
    return table('<th style="width:60px">Nhóm</th><th>Danh mục hồ sơ</th><th style="width:130px">Số văn bản</th><th style="width:90px">Yêu cầu</th><th style="width:130px">Tình trạng</th>',
      D.checklist.map((c) => { const ok = c.by == null ? null : Flow.taskStatus(c.by) !== 'todo' || c.by === draftTask(); return `<tr><td>${c.g}</td><td>${esc(c.name)}</td><td>${esc(c.no)}</td><td>${c.req}</td><td>${ok == null ? badge('Không có', 'default') : ok ? badge('Đủ', 'success') : badge('Thiếu', 'warning')}</td></tr>`; }).join(''))
      + (signed ? `<p class="msg">${signed}</p>` : '');
  }

  function scr09() {
    const total = D.caseInfo.total;
    ba(`AI Pass nhưng chỉ huy vẫn phải xác nhận. Không đồng ý → AI liệt kê nội dung chưa đạt cho ĐVĐX (task 14), hồ sơ về task ${pad2(draftTask())}.`);
    return `${ai('AI kiểm tra hồ sơ', `<ul class="plain"><li>Đủ mục bắt buộc ${tt()}, BM-02, ${clName()}.</li><li>Tổng giá trị khớp phụ lục chi phí (${ty(total)} tỷ).</li></ul>`, 'pass', 'Pass')}
      ${card('Tóm tắt dự thảo', `<div class="ginfo">${kv('Tên', esc(Flow.ci().title), true)}${kv('Căn cứ', esc(basisDoc().no))}${kv('Giá trị', `${ty(total)} tỷ (${buyItems().length} hạng mục)`)}
        ${kv('Nguồn vốn', esc(D.caseInfo.fund))}${kv('Thời gian', esc(D.caseInfo.period))}${kv('Quy trình', `${esc(proc())}${small() ? ` · ${tt()} + ${clName()}` : ''} ${badge('Khớp giá trị', 'success')}`)}</div>`)}
      ${card('Cơ cấu chi phí', table('<th class="ord">STT</th><th>Hạng mục</th><th class="r" style="width:140px">Thành tiền (tỷ)</th><th class="r" style="width:100px">Tỷ trọng</th>',
        buyItems().map((i) => `<tr><td class="ord">${i.n}</td><td>${esc(i.name)}</td><td class="r num">${ty(i.amount)}</td><td class="r num">${ty((i.amount / total) * 100, 1)}%</td></tr>`).join('')))}
      ${card(clName(), checklistTable())}`;
  }

  function scr10() {
    const cs = Flow.cqcmSel(), must = small() ? ['TC'] : [];
    const back = Flow.lastOf(17);
    qChip('P-05');
    ba('Danh sách CQCM được chuyển TTMS xác nhận đúng chức năng, đủ thành phần (task 17, N07) trước khi hệ thống gửi yêu cầu thẩm định. Ban Kế hoạch, Ban ĐTXD không dùng trong demo nên không hiện.');
    if (must.length) { qChip('P-25'); ba('Hồ sơ < 160 tỷ: Ban Tài chính bắt buộc theo QT B8.2 — hệ thống tích sẵn và khoá; TTMS vẫn xác nhận toàn bộ danh sách ở bước sau (P-25).'); }
    ba('BBLV 22/09: trình chỉ huy ĐVĐX phải kèm phiếu yêu cầu thẩm định (BM-03) đã ký nháy.');
    return `${back && /^Chưa/.test(back.action) && Flow.doneCount(16) === Flow.doneCount(17) ? ai(`TTMS trả lại danh sách CQCM: “${esc(back.reason || '')}”`, '<p class="msg">Cập nhật danh sách rồi gửi lại TTMS xác nhận.</p>', 'fail', 'Trả lại') : ''}
      ${card('Chọn cơ quan chuyên môn (CQCM) góp ý', `<div class="checks col">${D.cqcm.map((c) => { const lock = must.includes(c.id); return `<label class="check"><input type="checkbox" ${cs.includes(c.id) || lock ? 'checked' : ''} ${lock ? 'disabled' : ''} data-uitoggle="cqcmSel" data-k="${c.id}" data-all='${JSON.stringify(cs)}'> ${esc(c.unit)} <span class="faint">— ${esc(persona(c.doer).name)}${lock ? ' · bắt buộc' : ''}</span></label>`; }).join('')}</div>
        <div class="grid2">${field('Hạn góp ý', input(Flow.dateOf(Flow.state.clock + 5)))}${field('Đầu mối tiếp nhận', input(persona('minh').name))}</div>`)}
      ${card('Phiếu yêu cầu thẩm định đã ký nháy (BM-03) <span class="req">*</span>', `<div>${fileBtn('bm03File', `BM-03_${fileCode()}_ky-nhay.pdf`)}</div>`)}
      ${card('BM-03 — Phiếu yêu cầu thẩm định', `<div class="doc paper"><p class="c"><b>PHIẾU YÊU CẦU THẨM ĐỊNH</b><br>Số: ……/PYC-TTVT · Ngày ${Flow.dateOf(Flow.state.clock)}</p>
        <p>Kính gửi: ${cs.map(cqcmUnit).join('; ') || '<i>chưa chọn</i>'}.</p><p>${esc(D.caseInfo.unit)} đề nghị thẩm định hồ sơ <b>${esc(Flow.ci().code)}</b> — ${esc(Flow.ci().title)}, giá trị ${ty(D.caseInfo.total)} tỷ đồng.</p>
        <p>Hạn gửi ý kiến (BM-04): ${Flow.dateOf(Flow.state.clock + 5)}.</p><p class="r">GIÁM ĐỐC TRUNG TÂM<br><br><i>${esc(persona('hai').name)}</i></p></div>`)}`;
  }

  /* ---------- Giai đoạn 2–4 ---------- */
  /* SCR-22 — TTMS xác nhận danh sách CQCM (task 17, N07). */
  function scr22() {
    const cs = Flow.cqcmSel();
    const fn = { PC: 'Pháp lý, hợp đồng, quy chế LCNT', TC: 'Tài chính kế toán, nguồn vốn, cơ cấu chi phí', CL: 'Chất lượng, chỉ tiêu kỹ thuật thiết bị đo' };
    /* Thành phần AI đối chiếu: < 160 tỷ cần Tài chính (bắt buộc, QT B8.2) và Chất lượng; ≥ 160 tỷ cần thêm Ban Pháp chế. */
    const need = [['TC', small() ? 'Hồ sơ dưới 160 tỷ → CQCM Tài chính bắt buộc (QT B8.2)' : 'Hồ sơ có hạng mục dịch vụ và nguồn vốn → cần CQCM Tài chính'],
      ['CL', 'Có hàng hoá cần chỉ tiêu kỹ thuật → cần CQCM Chất lượng']].concat(small() ? [] : [['PC', 'Áp dụng Quy chế LCNT → cần Ban Pháp chế']]);
    const full = need.every(([id]) => cs.includes(id));
    qChip('P-05');
    if (small()) qChip('P-25');
    ba('Đúng, đủ → hệ thống trình ký BM-03 và gửi yêu cầu tới các CQCM (task 18). Chưa đúng/đủ → trả ĐVĐX cập nhật (task 16).');
    return `${card('Danh sách CQCM do đơn vị đề xuất chọn', table('<th>CQCM</th><th>Chức năng liên quan</th><th style="width:170px">Người xử lý</th><th style="width:150px">Đánh giá</th>',
        D.cqcm.filter((c) => cs.includes(c.id)).map((c) => `<tr><td><b>${esc(c.unit)}</b></td><td>${esc(fn[c.id] || '')}</td><td><span class="row">${avatar(c.doer, 'sm')} ${esc(persona(c.doer).short)}</span></td><td>${badge('Đúng chức năng', 'success')}</td></tr>`).join('')))}
      ${ai('AI đối chiếu thành phần CQCM', `<ul class="plain">${need.map(([id, t]) => `<li>${esc(t)}: <b>${cs.includes(id) ? 'có' : 'chưa có'}</b>.</li>`).join('')}</ul>`, full ? 'pass' : 'fail', full ? 'Đủ thành phần' : 'Thiếu thành phần')}
      ${card('Phiếu yêu cầu thẩm định (BM-03)', `<div class="ginfo">${kv('Hồ sơ', esc(Flow.ci().code))}${kv('Hạn góp ý', Flow.dateOf(Flow.state.clock + 5))}${kv('Tệp ký nháy', `<span class="file">${icon('file')} BM-03_${fileCode()}_ky-nhay.pdf</span>`, true)}</div>`)}`;
  }

  function scr11(tok) {
    const c = tok.cqcm, signer = tok.task === 20, rows = opinionsOf(c);
    const all = D.bm04Sections.map((s) => rows.find((r) => r.sec === s) || { sec: s, ok: true, blank: true });
    const aiOn = (U().ai04 || {})[c];
    ba('Hồ sơ đang thẩm định: ĐVĐX bị khoá sửa cho tới khi nhận đủ BM-04 (UR-COM-03). Mỗi CQCM một phiếu riêng; BM-04 đã ký vẫn có thể chứa ý kiến Không OK (N03).');
    if (Flow.state.vars.round > 0) ba(`Vòng BM-04 lần ${pad2(bm04Round())}: ĐVĐX đã gửi giải trình (phụ lục 1 BM-02); CQCM xem giải trình và lập lại phiếu.`);
    if (signer) ba('Chỉ huy CQCM đồng ý → hệ thống trình ký BM-04 qua VOffice (task 22); không đồng ý → AI lọc nội dung cần sửa, trả chuyên viên (task 21).');
    return card(`BM-04 Phiếu nhận xét — ${esc(cqcmUnit(c))}`, table('<th style="width:190px">Mục BM-01</th><th style="width:190px">Đánh giá</th><th>Nội dung nhận xét</th><th>Hướng dẫn sửa</th>',
      all.map((r) => `<tr><td><b>${esc(r.sec)}</b></td><td>${signer ? tick(r.ok) : radios(['OK', 'Không OK'].map((l) => vRadio(l, (l === 'OK') === r.ok, `data-bm04="${c}" data-sec="${esc(r.sec)}" data-ok="${l === 'OK'}"`)))}</td>
        <td>${r.text ? esc(r.text) : '<span class="faint">-</span>'}${aiOn && !r.ok ? `<div class="ai-inline">${icon('spark')} AI: đối chiếu QT 10.2.1 mục 5.3 — nhận xét phù hợp</div>` : ''}</td>
        <td>${r.guide ? esc(r.guide) : '<span class="faint">-</span>'}</td></tr>`).join('')),
      `${badge(`Lần ${pad2(bm04Round())}`, 'info')}${badge(`Hồ sơ v${version()}`, 'default')}${signer ? '' : `<button class="vbtn sm secondary" data-uimap="ai04" data-k="${c}" data-v="true">${icon('spark')} AI gợi ý nhận xét</button>`}`);
  }

  function signStatus(taskDone, name) {
    return taskDone ? badge('Đã ký', 'success') : badge(name || 'Đang chờ', 'warning');
  }

  /* Hồ sơ vừa bị trả về task 25 → 26 từ bước ký / phê duyệt (BM-05, BM-09, Tập đoàn, Thủ trưởng): lượt xử lý có lý do ngay trước task 25. */
  function returnedFrom() {
    const h = Flow.state.history, i = h.map((x) => x.task).lastIndexOf(25);
    for (let k = i - 1; k >= 0; k--) {
      if (h[k].system) { if (h[k].task === 24 || h[k].task === 23) return null; continue; }
      return h[k].reason ? h[k] : null;
    }
    return null;
  }

  function scr12() {
    const list = nok(), back = returnedFrom();
    const signedBy = Flow.state.history.filter((h) => h.task === 20 && /^Đồng ý/.test(h.action)).map((h) => h.cqcm);
    qChip('P-22');
    ba('Có ý kiến "Không đồng ý" → lập giải trình (task 28), hồ sơ quay lại chỉ huy ĐVĐX (task 13) rồi gửi CQCM lập lại BM-04; đồng ý sửa toàn bộ → hoàn chỉnh hồ sơ (task 27). AI kiểm tra xung đột ở task 24, tóm tắt ở task 25.');
    if (Flow.state.vars.round > 0) ba(`Đây là kết quả BM-04 lần ${pad2(bm04Round())}, sau khi ĐVĐX giải trình.`);
    if (back) {
      if (small()) qChip('P-18');
      ba(`Hồ sơ bị trả lại từ task ${esc(String(back.task))} → AI tóm tắt nội dung cần sửa (task 25) → ĐVĐX cập nhật ${tt()} (task 26, 27), CQCM kiểm tra và ký lại theo phiên bản mới (MS01 v1.1).`);
    }
    return `${back ? `<div class="banner-bad">Hồ sơ bị trả lại ở bước “${esc(Flow.taskName(back.task))}” — ${esc(persona(back.who).name)}: “${esc(back.reason)}”</div>` : ''}
      ${card('Trạng thái phiếu BM-04', table('<th>CQCM</th><th>Người lập / chỉ huy</th><th style="width:70px">Lần</th><th style="width:120px">Ký</th><th style="width:100px">Không OK</th>',
        selCqcm().map((c) => `<tr><td><b>${esc(c.unit)}</b></td><td>${esc(persona(c.doer).short)} / ${esc(persona(c.signer).short)}</td><td>${pad2(bm04Round())}</td><td>${signStatus(signedBy.includes(c.id))}</td><td>${opinionsOf(c.id).filter((o) => !o.ok).length}</td></tr>`).join('')),
        Flow.state.vars.round > 0 ? roundBadge() : '')}
      ${ai('AI kiểm tra xung đột giữa các BM-04', '<p class="msg">Không có cặp ý kiến mâu thuẫn giữa các CQCM trên cùng một mục của BM-01.</p>', 'pass', 'Không có xung đột')}
      ${ai(`AI tóm tắt ${list.length} ý kiến Không OK`, table('<th style="width:150px">CQCM</th><th style="width:130px">Mục</th><th>Ý kiến</th><th style="width:210px">Quyết định của đơn vị</th>',
        list.map((o) => { const d = respOf(o.cqcm); return `<tr><td>${esc(cqcmUnit(o.cqcm))}</td><td>${esc(o.sec)}</td><td>${esc(o.text)}</td>
          <td>${radios(['Tiếp thu', 'Bảo lưu'].map((l) => vRadio(l === 'Tiếp thu' ? 'Đồng ý sửa' : 'Không đồng ý', d === l, `data-uimap="resp" data-k="${o.cqcm}" data-v='"${l}"'`)))}</td></tr>`; }).join('')))}`;
  }

  function explainTable(editable) {
    const list = nok();
    return table('<th class="ord">STT</th><th>Ý kiến nhận xét</th><th style="width:130px">Tiếp thu / Bảo lưu</th><th>Nội dung giải trình</th><th style="width:130px">Tham chiếu</th>',
      list.map((o, i) => { const d = respOf(o.cqcm); const r = D.responses[o.cqcm] || {}; const txt = (d === 'Bảo lưu' && r.keepText) || r.text || ''; return `<tr><td class="ord">${i + 1}</td><td><b>${esc(cqcmUnit(o.cqcm))}</b> · ${esc(o.sec)}<div class="sub">${esc(o.text)}</div></td>
        <td>${d === 'Bảo lưu' ? badge('Bảo lưu', 'warning') : badge('Tiếp thu', 'success')}</td>
        <td>${editable ? `<textarea class="vctl ta" rows="2">${esc(txt)}</textarea>` : esc(txt)}</td><td>${esc(r.ref || '')}</td></tr>`; }).join(''));
  }

  function diffTable() {
    return table('<th style="width:170px">Nội dung</th><th>v1 (CQCM đã nhận xét)</th><th>v2 (sau hoàn chỉnh)</th>',
      D.versionDiff.map((d) => `<tr><td><b>${esc(d.field)}</b></td><td class="del">${esc(d.from)}</td><td class="ins">${esc(d.to)}</td></tr>`).join(''));
  }

  function scr13(tok) {
    if (tok.task === 27) {
      ba(`Các phiên bản sửa phải được CQCM kiểm tra và ký lại BM-04 cùng ${clName()} (task 35–37). Sửa trên ${tt()}.`);
      const accepted = Flow.state.vars.round > 0 ? selCqcm().filter((c) => respOf(c.id) === 'Bảo lưu') : [];
      return `${ai('Việc cần sửa theo ý kiến đã tiếp thu', `<ul class="plain">${nok().filter((o) => respOf(o.cqcm) === 'Tiếp thu').map((o) => `<li>${esc(o.sec)}: ${esc(o.guide || o.text)}</li>`).join('')}${accepted.map((c) => `<li>${esc(c.unit)} đã chấp nhận giải trình: ghi chú làm rõ trong hồ sơ.</li>`).join('')}</ul>`)}
        ${card('So sánh phiên bản', diffTable(), badge('Tạo phiên bản mới khi gửi', 'info'))}`;
    }
    qChip('P-08'); qChip('P-22');
    ba('Hệ thống tăng vòng khi nhận giải trình (task 29). ≤ 2 vòng: hồ sơ quay lại chỉ huy ĐVĐX (task 13) rồi gửi CQCM lập lại BM-04. > 2 vòng: cảnh báo và yêu cầu họp (task 30–31).');
    const keep = nok().filter((o) => respOf(o.cqcm) === 'Bảo lưu').length, take = nok().filter((o) => respOf(o.cqcm) === 'Tiếp thu').length;
    return card('Phụ lục 1 BM-02 — Bảng giải trình ý kiến', `${explainTable(tok.task === 28)}<p class="msg">Tổng hợp: ${take} ý kiến tiếp thu, ${keep} ý kiến bảo lưu.</p>`, roundBadge());
  }

  function scr14(tok) {
    const n = tok.task;
    qChip('P-09');
    if (n === 31) {
      ba('Task 30 (hệ thống) đã gửi cảnh báo và yêu cầu họp tới ĐVĐX, các CQCM, TTMS.');
      return `${ai('Cảnh báo vượt số vòng giải trình', `<p>Hồ sơ ${esc(Flow.ci().code)} đã qua <b>${Flow.state.vars.round}</b> vòng giải trình, vượt ngưỡng 2. Đã gửi yêu cầu họp tới đơn vị đề xuất, các CQCM và TTMS.</p>`, 'fail', 'Vượt ngưỡng')}
        ${card('Tổ chức họp thống nhất', `<div class="grid2">${field('Thời gian', input(`${Flow.dateOf(Flow.state.clock + 1)} · 14:00`))}${field('Địa điểm', input('Phòng họp 3, tầng 5'))}</div>
          ${field('Thành phần', `<div class="row">${['minh', 'hai'].concat(selCqcm().map((c) => c.doer), ['lan']).map((p) => `<span class="chip">${avatar(p, 'sm')} ${esc(persona(p).short)}</span>`).join('')}</div>`)}`)}
        ${card('Nội dung còn vướng mắc', explainTable(false))}`;
    }
    if (n === 32) {
      ba('Đã thống nhất → ĐVĐX hoàn chỉnh hồ sơ (task 27). Chưa thống nhất → TTMS trình cấp cao hơn (task 33).');
      return card('Cập nhật kết quả cuộc họp', `${field('Biên bản họp', `<div>${fileBtn('minutesFile', `Bien-ban-hop-${fileCode()}.pdf`)}</div>`, true)}
        ${field('Kết luận', area('Các bên thống nhất phương án xử lý các ý kiến còn vướng mắc; đơn vị hoàn chỉnh hồ sơ theo kết luận cuộc họp.'))}`);
    }
    if (n === 33) {
      ba('Sau họp vẫn chưa thống nhất: hồ sơ, biên bản và bảng giải trình được trình Thủ trưởng VHT kết luận (task 34).');
      return card('Trình cấp cao hơn kết luận', explainTable(false));
    }
    ba(`Thống nhất phương án → ĐVĐX hoàn chỉnh hồ sơ (task 27). Yêu cầu xử lý lại → hồ sơ về bước hoàn thiện dự thảo (task ${pad2(draftTask())}).`);
    if (small()) { qChip('P-23'); ba('BPMN v1.1 chỉ vẽ "Yêu cầu xử lý lại" nối về task 12 (≥ 160 tỷ); hồ sơ < 160 tỷ về task 11 (dự thảo BM-09) — P-23.'); }
    return card('Kết luận nội dung chưa thống nhất', `${explainTable(false)}${field('Kết luận', area('Chấp nhận giải trình của đơn vị; đơn vị hoàn chỉnh hồ sơ theo kết luận.'))}`);
  }

  function scr15(tok) {
    const c = tok.cqcm;
    if (tok.task === 36) {
      ba(`Ký theo phiên bản v${version()}; không dùng lại kết quả ký của phiên bản cũ (N05). ` + (small()
        ? 'Luồng < 160 tỷ ký BM-04 + Checklist 02. Các CQCM ký đủ → TTMS ‖ Phó TGĐ ký thẩm định trực tiếp trên BM-09 (task 38 ‖ 39).'
        : 'Luồng ≥ 160 tỷ dùng Checklist 01. Các CQCM ký đủ → AI soạn BM-05 (task 41).'));
      return card(`${clName()} — ${esc(cqcmUnit(c))}`, checklistTable(`Chữ ký CQCM trên ${clName()} gắn với phiên bản v${version()}.`), badge(`Phiên bản v${version()}`, 'info'));
    }
    ba('Chưa đạt → hồ sơ quay về ĐVĐX hoàn chỉnh (task 27) và các phiếu kiểm tra song song bị huỷ.');
    const firstNok = Object.entries(D.opinions[c] || {}).filter(([, o]) => !o.ok);
    return `${card('Thay đổi so với phiên bản đã nhận xét', diffTable())}
      ${card(`Ý kiến của ${esc(cqcmUnit(c))} ở BM-04 lần 01`, firstNok.length ? `<ul class="plain">${firstNok.map(([sec, o]) => `<li><b>${esc(sec)}:</b> ${esc(o.text)} ${respOf(c) === 'Bảo lưu' ? badge('Đã giải trình, CQCM chấp nhận', 'warning') : badge('Đã tiếp thu, sửa ở v' + version(), 'success')}</li>`).join('')}</ul>` : '<p class="msg">Không có ý kiến Không OK.</p>')}`;
  }

  function signRow(who, unit, task) {
    const done = Flow.state.history.find((h) => String(h.task) === String(task) && h.who === who && !h.system);
    const open = Flow.state.tokens.some((t) => String(t.task) === String(task) && t.who === who);
    const st = done ? (/^Không/.test(done.action) ? badge('Không đồng ý', 'error') : badge('Đã ký', 'success')) : open ? badge('Chưa ký', 'warning') : badge('Không ký', 'default');
    return `<tr><td><span class="row">${avatar(who, 'sm')} ${esc(persona(who).name)}</span></td><td>${esc(unit)}</td><td>${st}</td></tr>`;
  }

  function scr16(tok) {
    const n = tok.task;
    if (n === 48) {
      const doc = basisDoc(), lock = (Flow.choices(48).find((c) => c.lockWhen) || { lockWhen: () => null }).lockWhen(Flow.state.vars);
      ba('TTMS tự quyết định có báo cáo TGĐ Tập đoàn hay không; hệ thống không tự suy theo giá trị (N06). Có → AI soạn Công văn BM-06 (task 49). Không → hệ thống sinh dự thảo Quyết định BM-08 (task 57).');
      if (lock) { qChip('P-24'); ba('MS01.02: căn cứ đã được CT/TGĐ Tập đoàn phê duyệt nên lựa chọn "Có báo cáo TGĐ Tập đoàn" bị khoá; hồ sơ bỏ task 49–56 (P-24 — v1.1 không có nhánh riêng cho MS01.02).'); }
      return `${ai('BM-05 đã ký đủ', '<ul class="plain"><li>TTMS ký với tư cách CQCM về ĐTXD.</li><li>CQCM Tài chính/liên quan và Phó TGĐ chuyên trách đã ký.</li></ul>', 'pass', 'Đã ký đủ')}
        ${lock ? `<div class="banner-moved">${esc(lock)}</div>` : ''}
        ${card('Xác định có cần báo cáo TGĐ Tập đoàn', `<div class="ginfo">${kv('Căn cứ', `${esc(doc.no)} — <b>${doc.group ? 'đã' : 'chưa'}</b> được CT/TGĐ Tập đoàn phê duyệt`, true)}${kv('Tổng giá trị', `${ty(D.caseInfo.total)} tỷ đồng (≥ 160 tỷ)`)}</div>`)}`;
    }
    qChip('P-10');
    ba('AI soạn dự thảo BM-05 từ hồ sơ, BM-04 và bảng giải trình (task 41). Xác nhận đủ điều kiện → hệ thống trình ký BM-05 cho TTMS qua VOffice (task 44); TTMS ký xong mới giao ký các thành phần còn lại (task 45).');
    return `${n === 43 ? ai('Đủ điều kiện giao ký BM-05', `<ul class="plain"><li>BM-05 đã được TTMS rà soát, cập nhật trên phiên bản hồ sơ v${version()}.</li><li>Checklist 01 đã được các CQCM ký theo phiên bản hiện tại.</li></ul>`, 'pass', 'Đủ điều kiện') : ''}
      ${card('BM-05 Báo cáo kết quả thẩm định', `<div class="ai-inline">${icon('spark')} AI soạn dự thảo từ hồ sơ v${version()}, BM-04 và bảng giải trình</div>
        ${table('<th style="width:220px">Mục</th><th>Nội dung</th>', D.bm05.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${n === 42 ? `<textarea class="vctl ta" rows="2">${esc(v)}</textarea>` : esc(v)}</td></tr>`).join('')
          + '<tr><td><b>Kết luận</b></td><td>Đủ điều kiện trình phê duyệt ĐXMS.</td></tr>')}`)}`;
  }

  function scr17() {
    const cs = Flow.cqcmSel();
    const ttms = Flow.lastOf(43);
    qChip('P-11'); qChip('P-12');
    ba('TTMS ký trước (task 44); CQCM Tài chính/liên quan (task 46) ‖ Phó TGĐ chuyên trách (task 47) ký song song. Ba trạng thái hiển thị riêng: Không ký / Chưa ký / Không đồng ý. Một bên không đồng ý → hệ thống tóm tắt lý do, trả ĐVĐX (task 25).');
    return `${card('Người ký BM-05', table('<th style="width:230px">Người ký</th><th>Đơn vị / tư cách</th><th style="width:140px">Trạng thái</th>',
        `<tr><td><span class="row">${avatar('lan', 'sm')} ${esc(persona('lan').name)}</span></td><td>TTMS — CQCM chủ trì về ĐTXD (ký trước)</td><td>${ttms ? badge('Đã ký', 'success') : badge('Không ký', 'default')}</td></tr>
        ${D.cqcm.filter((c) => cs.includes(c.id)).map((c) => signRow(c.doer, c.unit, 46)).join('')}${signRow('binh', 'Phó TGĐ chuyên trách', 47)}`))}
      ${card('BM-05 (bản trình ký)', table('<th style="width:220px">Mục</th><th>Nội dung</th>', D.bm05.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')))}`;
  }

  function scr18(tok) {
    const n = tok.task;
    const vo = [[49, 'AI soạn BM-06'], [50, 'TTMS rà soát'], [51, 'Thủ trưởng VHT xác nhận'], [52, 'Trình ký, chuyển Ban ĐTXD'], [53, 'Ban ĐTXD xem xét'], [54, 'Gửi BM-07 tới TGĐ TĐ'], [56, 'TGĐ TĐ cho ý kiến']];
    const steps = vSteps({ id: 'td', steps: vo.map(([t, l]) => { const s = Flow.taskStatus(t); return { title: l, state: s === 'done' ? 'completed' : s === 'active' ? 'active' : 'upcoming' }; }) });
    let body = '';
    if (n === 50 || n === 51) {
      ba('AI soạn BM-06 từ BM-05 và hồ sơ (task 49).');
      if (n === 51) ba('BBLV 22/09: đính kèm tệp ở cả hai lựa chọn Đồng ý / Không đồng ý.');
      body = `${card('BM-06 Công văn báo cáo TGĐ Tập đoàn', `<div class="ai-inline">${icon('spark')} AI soạn từ BM-05 và hồ sơ</div><div class="doc paper">
        <p>Kính gửi: Tổng Giám đốc Tập đoàn (qua Ban Đầu tư - Xây dựng)</p><p>VHT báo cáo đề xuất mua sắm <b>${esc(Flow.ci().title)}</b>, giá trị ${ty(D.caseInfo.total)} tỷ đồng, căn cứ ${esc(basisDoc().no)} (${basisDoc().group ? 'đã' : 'chưa'} được CT/TGĐ Tập đoàn phê duyệt), đã được thẩm định theo BM-05.</p>
        <p>VHT kính đề nghị Tổng Giám đốc Tập đoàn cho ý kiến để VHT phê duyệt ĐXMS.</p></div>`)}
        ${n === 51 ? card('Tệp đính kèm khi xác nhận <span class="req">*</span>', `<div>${fileBtn('bm06File', 'BM-06_ky-nhay.pdf')}</div>`) : ''}`;
    } else {
      const td = { 53: 'Ban ĐTXD xem xét hồ sơ, lập BM-07', 54: 'Gửi BM-07 tới TGĐ Tập đoàn', 55: 'Thông báo đồng thời cho TTMS và đầu mối đơn vị', 56: 'TGĐ Tập đoàn xem xét, cho ý kiến' }[n];
      if (n === 56) qChip('P-13');
      ba('Giả lập phía Tập đoàn: trong thực tế kết quả về ĐTMS qua VOffice, không có người dùng Tập đoàn đăng nhập.');
      body = card(td, `<div class="ginfo">${kv('BM-06', 'Số 3321/VHT-TTMS · đã ký VOffice')}${kv('BM-07', n >= 54 ? 'Số 1187/BC-ĐTXD · ' + Flow.dateOf(Flow.state.clock) : 'Đang lập')}${kv('Nhận qua', 'VOffice (mã VO-2026-558812)')}</div>`);
    }
    return `${card('Theo dõi báo cáo Tập đoàn', steps)}${body}`;
  }

  function scr19(tok) {
    const n = tok.task;
    if (n === 60) { qChip('P-14'); ba('Sau phê duyệt: nút "Tạo gói thầu (Đợt 2)" liên thông sang Kế hoạch LCNT — ngoài phạm vi nên không hiện. Yêu cầu hoàn chỉnh → AI tóm tắt nội dung cần sửa, trả ĐVĐX (task 25).'); }
    ba('Dự thảo BM-08 do hệ thống tự sinh (task 57).');
    if (Flow.state.vars.process === 'MS01.02') ba('MS01.02: hồ sơ kèm không có BM-06, BM-07 (không báo cáo Tập đoàn — P-24).');
    const attach = [`Checklist 01 (đã ký v${version()})`, 'BM-02 kèm phụ lục giải trình', `BM-04 × ${selCqcm().length} CQCM`, 'BM-05 Báo cáo thẩm định (đã ký đủ)'].concat(Flow.state.vars.reportTD ? ['BM-06, BM-07, ý kiến TGĐ Tập đoàn'] : []);
    return `${card('BM-08 Quyết định phê duyệt ĐXMS (dự thảo)', `<div class="doc paper"><p class="c"><b>QUYẾT ĐỊNH</b><br>Về việc phê duyệt đề xuất mua sắm ${esc(Flow.ci().title.toLowerCase())}</p>
        <p><b>Điều 1.</b> Phê duyệt đề xuất mua sắm với nội dung: tên ${esc(Flow.ci().title)}; tổng giá trị ${vnd(D.caseInfo.total)} đồng (gồm VAT); nguồn vốn ${esc(D.caseInfo.fund)}; thời gian ${esc(D.caseInfo.period)}; danh mục ${buyItems().length} hạng mục (phụ lục kèm theo).</p>
        <p><b>Điều 2.</b> ${esc(D.caseInfo.unit)} chủ trì tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn; TTMS, Ban Tài chính phối hợp.</p>
        <p><b>Điều 3.</b> Quyết định có hiệu lực từ ngày ký.</p><p class="r">TỔNG GIÁM ĐỐC<br><br><i>${esc(persona('tgd').name)}</i></p></div>`)}
      ${card('Hồ sơ kèm theo', `<ul class="plain files">${attach.map((a) => `<li>${icon('file')} ${esc(a)}</li>`).join('')}</ul>`)}`;
  }

  /* ---------- Nhánh < 160 tỷ (MS01.03): ký thẩm định và phê duyệt trực tiếp trên BM-09 ---------- */
  /* Kết quả ký của phiên bản hiện tại: chỉ tính lượt sau lần dự thảo / hoàn chỉnh gần nhất (task 11, 27) — N05. */
  function signOf(task) {
    const h = Flow.state.history;
    let from = 0;
    h.forEach((x, i) => { if ((x.task === 11 || x.task === 27) && x.who) from = i + 1; });
    const done = h.slice(from).filter((x) => String(x.task) === String(task) && x.who).pop();
    if (done) return { st: /^Không|^Yêu cầu|^Chỉ đạo/.test(done.action) ? 'Không đồng ý' : 'Đã ký', at: Flow.dateOf(done.t) };
    return { st: Flow.state.tokens.some((t) => String(t.task) === String(task)) ? 'Chưa ký' : 'Chưa trình ký', at: null };
  }
  const bm09Signs = () => ({ ttms: signOf(38), ptgd: signOf(39), tgd: signOf(60) });
  const signBadge = (s) => badge(s.st, { 'Đã ký': 'success', 'Không đồng ý': 'error', 'Chưa ký': 'warning' }[s.st] || 'default');

  function bm09SignCard(approve) {
    const s = bm09Signs();
    const row = (who, role, st, at) => `<tr><td><span class="row">${avatar(who, 'sm')} ${esc(persona(who).name)}</span></td><td>${esc(role)}</td><td>${st}</td><td class="num">${at || '-'}</td></tr>`;
    return card('Khối chữ ký BM-09', table('<th style="width:230px">Người ký</th><th>Tư cách</th><th style="width:230px">Trạng thái</th><th style="width:120px">Thời điểm</th>',
      row('lan', 'CQCM về ĐTXD (TTMS)', signBadge(s.ttms), s.ttms.at) + row('binh', 'Phó Tổng Giám đốc', signBadge(s.ptgd), s.ptgd.at)
      + selCqcm().map((c) => row(c.doer, `CQCM ${c.unit}`, badge('Đã thể hiện qua BM-04 + Checklist 02', 'info'), null)).join('')
      + (approve ? row('tgd', 'Người có thẩm quyền — ô PHÊ DUYỆT', signBadge(s.tgd), s.tgd.at) : '')));
  }

  /* SCR-23 — task 38 (TTMS) ‖ 39 (Phó TGĐ): ký thẩm định trực tiếp trên BM-09. */
  function scr23() {
    qChip('P-20');
    ba('Luồng < 160 tỷ không lập BM-05: sau khi các CQCM ký BM-04 + Checklist 02 (task 36–37), TTMS và Phó TGĐ ký song song trên BM-09 (task 38 ‖ 39); hệ thống tổng hợp kết quả ký từ VOffice (task 40) rồi trình Thủ trưởng (task 60).');
    ba('Ô CQCM Tài chính và CQCM liên quan trên mẫu BM-09 không ký riêng: ý kiến đã thể hiện qua BM-04 + Checklist 02 (P-20). Không đồng ý → hệ thống huỷ lượt ký còn lại, AI tóm tắt lý do, trả ĐVĐX (task 25 → 26 — P-18).');
    return `${bm09SignCard(false)}
      ${card('BM-09 Tờ trình đề xuất mua sắm (bản trình ký)', docBody(true), badge(`Phiên bản v${version()}`, 'info'))}
      ${card('Hồ sơ kèm theo', `<ul class="plain files">${[`Checklist 02 (đã ký v${version()})`, `BM-04 × ${selCqcm().length} CQCM`, 'BM-02 kèm phụ lục chi phí'].map((a) => `<li>${icon('file')} ${esc(a)}</li>`).join('')}</ul>`)}`;
  }

  /* SCR-24 — task 60 nhánh < 160 tỷ: Thủ trưởng phê duyệt trên chính Tờ trình BM-09 (không có Quyết định BM-08). */
  function scr24() {
    const kpi = Flow.kpiUsed(), lim = D.kpiLimit[proc()] || 20;
    qChip('P-18'); qChip('P-21');
    ba('Không có Quyết định riêng (BM-08): Thủ trưởng ký vào ô "PHÊ DUYỆT" trên Tờ trình BM-09 đã đủ chữ ký thẩm định. Yêu cầu hoàn chỉnh → AI tóm tắt nội dung cần sửa, trả ĐVĐX (task 25 → 26, P-18).');
    ba(`KPI thẩm định MS01.03: ${lim} NLV từ lúc gửi CQCM (task 18) tới phê duyệt (task 60) — QT 10.2.1, v1.1 không ghi (P-21).`);
    return `${card('Tình trạng hồ sơ', `<div class="ginfo">${kv('KPI thẩm định', kpi === null ? '-' : `${ty(kpi, 1)} / ${lim} ngày làm việc ${kpi <= lim ? badge('Trong hạn', 'success') : badge('Quá hạn', 'error')}`)}${kv('Phiên bản trình', 'v' + version())}</div>`)}
      ${bm09SignCard(true)}
      ${card('BM-09 Tờ trình đề xuất mua sắm (đã đủ chữ ký thẩm định)', docBody(true))}
      ${card('Hồ sơ kèm theo', `<ul class="plain files">${[`Checklist 02 (đã ký v${version()})`, `BM-04 × ${selCqcm().length} CQCM`, 'BM-02 kèm phụ lục chi phí'].map((a) => `<li>${icon('file')} ${esc(a)}</li>`).join('')}</ul>`)}`;
  }

  const MAP = { 1: scr03, '10a': scr26, 4: scr04, 5: scr05, 7: scr06, 8: scr07a, 10: scr07b, 11: scr08, 12: scr08, 13: scr09, 16: scr10, 17: scr22, 19: scr11, 20: scr11, 26: scr12,
    27: scr13, 28: scr13, 31: scr14, 32: scr14, 33: scr14, 34: scr14, 35: scr15, 36: scr15, 38: scr23, 39: scr23, 42: scr16, 43: scr16, 48: scr16,
    46: scr17, 47: scr17, 50: scr18, 51: scr18, 53: scr18, 54: scr18, 55: scr18, 56: scr18, 58: scr19, 59: scr19, 60: (tok) => (small() ? scr24(tok) : scr19(tok)) };

  function validate(tok, choice) {
    const n = tok.task, lbl = choice ? choice.label : '';
    if (n === 1 && !basisSel().doc) return 'Bạn cần chọn Văn bản căn cứ.';
    if (n === 8 && !nccSel().length) return 'Bạn cần chọn ít nhất một nhà cung cấp.';
    if (n === 5 && D.items.some((i) => lineRemain(i) != null && propOf(i) > lineRemain(i)) && lbl.startsWith('Xác nhận')) return 'Có dòng vượt số lượng còn lại sau trừ lùi.';
    if (n === 10 && quoteFail() && lbl.startsWith('Báo giá đạt')) return 'Kết quả kiểm tra báo giá: Không đạt. Chọn “Không đạt — gửi lại YCBG”.';
    if ((n === 11 || n === 12) && !U().necessity) { Flow.setUi('aiFail', true); return `AI kiểm tra hồ sơ: Fail — ${tt()} thiếu mục “Sự cần thiết”. Hồ sơ chưa được gửi.`; }
    if (n === 16) {
      if (!(U().cqcmSel || ['x']).length) return 'Bạn cần chọn ít nhất một CQCM.';
      if (!U().bm03File) return 'Bạn cần tải lên Phiếu yêu cầu thẩm định (BM-03) đã ký nháy.';
    }
    if (n === 26) {
      const hasKeep = nok().some((o) => respOf(o.cqcm) === 'Bảo lưu');
      if (hasKeep && lbl.startsWith('Đồng ý sửa')) return 'Có ý kiến “Không đồng ý” — cần lập giải trình.';
      if (!hasKeep && lbl.startsWith('Có ý kiến')) return 'Không có ý kiến bảo lưu — chọn “Đồng ý sửa theo ý kiến CQCM”.';
    }
    if (n === 32 && !U().minutesFile) return 'Bạn cần tải lên Biên bản họp.';
    if (n === 51 && !U().bm06File) return 'Bạn cần tải lên tệp đính kèm trước khi xác nhận.';
    return null;
  }

  /* ---------- Sự kiện nhập liệu ---------- */
  const parse = (v) => { try { return JSON.parse(v); } catch (e) { return v; } };
  document.addEventListener('click', (e) => {
    const t = e.target;
    const a = t.closest('[data-ui]'); if (a) { e.preventDefault(); Flow.setUi(a.dataset.ui, parse(a.dataset.v)); return; }
    const m = t.closest('[data-uimap]');
    if (m) { e.preventDefault(); const o = Object.assign({}, U()[m.dataset.uimap]); const v = parse(m.dataset.v); if (v === null) delete o[m.dataset.k]; else o[m.dataset.k] = v; Flow.setUi(m.dataset.uimap, o); return; }
    const tg = t.closest('[data-uitoggle]');
    if (tg) { const all = parse(tg.dataset.all); const cur = (U()[tg.dataset.uitoggle] || all).slice(); const i = cur.indexOf(tg.dataset.k); if (i >= 0) cur.splice(i, 1); else cur.push(tg.dataset.k); Flow.setUi(tg.dataset.uitoggle, cur); return; }
    const b = t.closest('[data-bm04]');
    if (b) { e.preventDefault(); const all = Object.assign({}, U().bm04); const c = b.dataset.bm04; all[c] = Object.assign({}, all[c]); all[c][b.dataset.sec] = Object.assign({}, all[c][b.dataset.sec], { ok: b.dataset.ok === 'true' }); if (b.dataset.ok === 'false' && !((D.opinions[c] || {})[b.dataset.sec] || {}).text) all[c][b.dataset.sec].text = 'Cần bổ sung, làm rõ.'; Flow.setUi('bm04', all); return; }
    if (t.closest('[data-ai-all]')) { const o = {}; D.aiBasic.forEach((x) => { o[x.key] = 'accepted'; }); Flow.setUi('ai', o); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.uiIn) Flow.setUi(t.dataset.uiIn, t.value);
    if (t.dataset.uimapIn) { const o = Object.assign({}, U()[t.dataset.uimapIn]); o[t.dataset.k] = Number(t.value); Flow.setUi(t.dataset.uimapIn, o); }
  });

  window.Bodies = {
    render: (tok) => { BA = { notes: [], q: [] }; return MAP[tok.task] ? MAP[tok.task](tok) : (ba('Nội dung chi tiết của task này chưa dựng (ngoài kịch bản demo).'), ''); },
    notes: () => BA, validate, version,
  };
})();
