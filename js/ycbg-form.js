/* T29 B3b — SCR-106 Thêm mới / Cập nhật yêu cầu báo giá (RV-PROTO-0511 #10, câu hỏi 7 "Có cần tạo / cập nhật YCBG không? — Có, bổ sung"; bố cục theo
   ảnh HT-DXMS-IMG "Yêu cầu báo giá / Cập nhật": Ngày YCBG, Dự án / Đề tài, Đối tác nhận, Danh mục hàng hoá, Yêu cầu kỹ thuật, Danh mục bản vẽ, Tệp khác,
   Điều kiện thanh toán…). Khuôn task-create (form 3 cột + card bảng) như SCR-96.
   - YCBG tạo trực tiếp (ngoài hồ sơ): khảo sát giá khi chưa có hồ sơ (vd lấy giá dự tính cho luồng mua sắm) — GIẢ LẬP P-205: SRS-DXMS chỉ có YCBG trong hồ sơ
     (bước 8–10, BR-DXMS-04-01); mục đích và liên kết với hồ sơ sau này hỏi BA.
   - Nháp: sửa được (Cập nhật). Lưu (T37, trước: Lưu và gửi — hệ thống gửi email thay TTMS, BR-DXMS-04-06): trạng thái Đang chờ báo giá, không sửa nữa (BR-DXMS-04-01);
     chưa gửi email, TTMS xuất công văn và gửi ngoài hệ thống.
   - Mã YCBG-YYYY-NNNN (không gắn ĐXMS; YCBG trong hồ sơ giữ YCBG-{số ĐXMS}-{lần}).
   T29 B18 (plan §3.11 Y1–Y12, đủ 3 ảnh màn cũ + BM-YCKT, cùng mẫu với eForm bước 8): lưu ý bảo mật; bảng Dự án có Nguồn vốn; bảng đối tác có Email
   (thiếu email chặn Gửi); Model / Mã NSX tham khảo; Nhập từ Excel (.csv); Tải mẫu BM-YCKT; Thời hạn tiếp nhận báo giá; Đầu mối chọn nhiều người → bảng;
   Bảo hành / Năm sản xuất (P-214); Đặt giá trị mặc định (P-213); Soạn thảo công văn BM-YCBG (.doc, P-215); Xem lịch sử (chế độ Cập nhật).
   Lưu ở Flow.state.ycbgUser (giữ qua đổi cảnh, như dxmsUser). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, vSelect, vModal, toast, persona } = window.UI;
  const S = () => window.Screens;
  const dash = '<span class="dash">-</span>';
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const list = () => (Flow.state.ycbgUser || (Flow.state.ycbgUser = []));
  const nccRows = () => window.Catalog.rows('nha-cung-cap').filter((r) => r.active);
  const nccOf = (c) => nccRows().find((r) => r.code === c) || { code: c, name: c };
  const dkey = (s) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}${m[2]}${m[1]}` : ''; };
  const addDays = (s, n) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s); if (!m) return s; const d = new Date(+m[3], +m[2] - 1, +m[1] + n); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
  const today = () => Flow.dateOf(Flow.state.clock);
  const yearNow = () => Number(today().split('/')[2]) || 2026;
  const blankItem = () => ({ name: '', model: '', uom: '', qty: '', spec: '' });
  const ITEM_KEYS = ['name', 'model', 'uom', 'qty', 'spec'];
  const ITEM_HEAD = ['Hàng hoá / dịch vụ', 'Model / Mã NSX tham khảo', 'ĐVT', 'Số lượng', 'Chỉ tiêu kỹ thuật'];
  /* Bản lưu trước B18: đầu mối là chuỗi tự do → giữ nguyên chuỗi khi hiển thị, form mở lại thì để trống cho người dùng chọn. */
  const contactIds = (c) => (Array.isArray(c) ? c : []);
  const contactText = (c) => (Array.isArray(c) ? D.contactOf(c) : c || '');
  const nvFund = (n) => D.fundNames[n.fund] || '';
  const ACT = { create: 'Tạo mới (lưu nháp)', update: 'Cập nhật', send: 'Lưu' };

  /* Dạng chung với YCBG của hồ sơ (ycbg.js ycbgOf) để dùng danh sách / chi tiết SCR-73, SCR-74. */
  function toY(u) {
    const nv = u.nv.map((c) => D.nvOf(c)).filter(Boolean);
    return { code: u.code, lan: '-', kdt: false, dxms: '', hs: '', hsHref: '', title: u.title, unit: u.unit, creator: u.creator, status: u.sent ? 'WAIT' : 'DRAFT',
      sent: u.sent || '', due: u.due, nv: u.nv.slice(), nvText: nv.map((n) => `${n.code} — ${n.name}`).join('; '), user: true, date: u.date, files: u.files,
      terms: Object.assign({}, u.terms, { contact: contactText(u.terms.contact) }),
      items: u.items.map((it, i) => ({ n: i + 1, name: it.name, model: it.model, uom: it.uom, buy: Number(it.qty) || 0, spec: it.spec })),
      ncc: u.ncc.map((c) => { const r = nccOf(c); return { code: c, name: r.name, short: r.name, email: r.email || '', currency: 'VNĐ', got: false, prices: {} }; }) };
  }
  const all = () => list().map(toY);
  const mineEdit = (u) => !u.sent && (u.by === Flow.state.persona || D.allAccess(Flow.state.persona));

  /* ---------- Form ---------- */
  const F = { code: null, v: null, err: {} };
  const empty = () => ({ date: today(), nv: [], title: '', unit: (persona(Flow.state.persona) || {}).unit || 'Trung tâm Vô tuyến', ncc: [],
    due: addDays(today(), 7), items: [blankItem()], files: { kt: '', bv: '', khac: '' }, log: [],
    terms: { payment: '', place: '', other: '', contact: [Flow.state.persona], warranty: '12', year: String(yearNow() - 1) } });
  function enter(code) {
    const u = code && list().find((x) => x.code === code);
    F.code = u ? u.code : null;
    F.v = u ? JSON.parse(JSON.stringify(u)) : empty();
    if (!F.v.items.length) F.v.items.push(blankItem());
    F.v.terms.contact = contactIds(F.v.terms.contact);
    ['warranty', 'year'].forEach((k) => { if (F.v.terms[k] == null) F.v.terms[k] = ''; });
    F.err = {};
  }
  function form(code) {
    if (code !== undefined && F.code !== code) enter(code);
    if (!F.v) enter(code);
    const v = F.v, err = F.err, edit = !!F.code;
    const u = edit && list().find((x) => x.code === F.code);
    if (edit && (!u || !mineEdit(u))) return `<div class="pg">${S().head({ title: 'Cập nhật yêu cầu báo giá', back: 'ycbg' })}<section class="vcard pad24"><div class="empty-t">Yêu cầu báo giá đã gửi hoặc bạn không có quyền cập nhật.</div></section></div>`;
    const upd = (fn) => (x) => { read(); fn(x); window.App.render(); };
    const txt = (k, ph, max, obj, attrs) => `<input class="vctl" data-yc-in="${obj ? obj + '.' : ''}${k}" maxlength="${max || 255}" placeholder="${ph}" value="${esc(obj ? v[obj][k] : v[k])}" ${attrs || ''}>`;
    const ta = (k, ph, obj) => `<textarea class="vctl ta" data-yc-in="${obj}.${k}" maxlength="2000" placeholder="${ph}">${esc(v[obj][k])}</textarea>`;
    const up = (k, label, extra) => field(label, `<div class="row"><button type="button" class="vbtn secondary" data-yc-up="${k}">${icon('upload')} Tải file lên</button>${v.files[k] ? `<span class="rsk-file">${esc(v.files[k])}</span>` : ''}${extra || ''}</div>`);
    const rm = (kind, id) => `<td class="c"><button type="button" class="vbtn icon ghost" aria-label="Xóa" title="Xóa" data-yc-rm="${kind}" data-id="${esc(id)}">${icon('del')}</button></td>`;
    const table = (attr, head, rows) => `<div class="vtable-vp yc-sub" ${attr}><table class="vtable"><thead><tr><th class="ord">STT</th><th class="c" style="width:80px">Thao tác</th>${head.map(([h, w]) => `<th style="min-width:${w}px">${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.join('') || `<tr><td class="vtable-empty" colspan="${head.length + 2}">Chưa chọn</td></tr>`}</tbody></table></div>`;
    const info = {
      scr: 'SCR-106', name: edit ? 'Cập nhật yêu cầu báo giá' : 'Thêm mới yêu cầu báo giá', uc: 'UC-07-03 · UR-PRE-21/22',
      notes: [
        '<b>T29 B3b (RV-PROTO-0511 #10, câu hỏi 7):</b> tạo / cập nhật yêu cầu báo giá trực tiếp ở menu Yêu cầu báo giá (gộp ĐXMS / KĐT 12/11), bố cục theo màn "Cập nhật yêu cầu báo giá" của hệ thống cũ (HT-DXMS-IMG).',
        '<b>T29 B18 (HT-DXMS-IMG đủ 3 ảnh, BM-YCKT; cùng mẫu với eForm bước 8):</b> lưu ý bảo mật đầu form; Dự án / Đề tài → bảng Mã, Tên, Loại, <b>Nguồn vốn</b> (SCR-104); Đối tác → bảng Mã, Tên, <b>Email nhận yêu cầu báo giá</b>, Email CC (danh mục Nhà cung cấp SCR-31) — đối tác thiếu email thì không Gửi được; <b>Thời hạn tiếp nhận báo giá</b> (ngày, dùng nhắc hạn); Model → Model / Mã NSX tham khảo; <b>Đầu mối tiếp nhận báo giá</b> chọn nhiều người dùng (mặc định người tạo) → bảng Họ tên, Đơn vị, Điện thoại, Email; Bảo hành tối thiểu, Năm sản xuất từ.',
        '<b>Danh mục hàng hoá</b> giữ bảng theo dòng (cần cho so sánh báo giá theo dòng, BR-DXMS-04-09) thay ô soạn văn bản của hệ thống cũ. <b>Nhập từ Excel</b>: prototype đọc tệp .csv theo mẫu tải về (cột Hàng hoá / dịch vụ, Model / Mã NSX tham khảo, ĐVT, Số lượng, Chỉ tiêu kỹ thuật), thêm vào cuối bảng; bản thật đọc .xlsx phía BE — cần dev riêng.',
        '<b>GIẢ LẬP P-213 — Đặt giá trị mặc định:</b> điền Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác, Bảo hành, Năm sản xuất từ một bộ giá trị mẫu (D.ycbgTerms0). Giá trị mặc định cấu hình theo toàn hệ thống / đơn vị / loại hàng: hỏi BA.',
        '<b>GIẢ LẬP P-215 — Soạn thảo công văn:</b> xuất .doc theo mẫu BM-YCBG (công văn + Phụ lục Mẫu báo giá), điền Danh mục hàng hoá, điều khoản, thời hạn và đầu mối từ form. Đối tác nhận công văn do TTMS gửi (hệ thống chưa gửi email, T37); công văn TGĐ ký có bắt buộc kèm không: hỏi BA.',
        '<b>GIẢ LẬP P-214:</b> Bảo hành tối thiểu (tháng) và Năm sản xuất từ là trường chung của phiếu, áp cho mọi dòng hàng (BM-YCKT bắt buộc nêu).',
        '<b>Xem lịch sử</b> (= Xem Logs của màn cũ, chỉ ở chế độ Cập nhật): Tạo mới, Cập nhật, Lưu — người, thời điểm. Điều kiện thanh toán, Các yêu cầu khác: prototype dùng ô văn bản; bản thật dùng ô soạn có định dạng, nội dung HTML đưa vào email.',
        '<b>GIẢ LẬP P-205:</b> SRS-DXMS chỉ có YCBG trong hồ sơ (bước 8–10). YCBG tạo trực tiếp dùng khảo sát giá trước khi có hồ sơ; khi hồ sơ tới bước 8 hệ thống vẫn sinh YCBG riêng của hồ sơ. Mục đích, liên kết với hồ sơ: hỏi BA.',
        '<b>T37 (RV-PROTO-0911 #6):</b> phạm vi hiện tại chỉ soạn thảo và xuất, <b>chưa tự gửi email</b> — nút <b>Lưu và gửi</b> đổi thành <b>Lưu</b>, không bắt Email đối tác. Lệch BR-DXMS-04-06 (email thay TTMS).',
        '<b>Lưu nháp</b> = sửa được về sau (nút Cập nhật ở danh sách / chi tiết). <b>Lưu</b> = chốt yêu cầu, trạng thái Đang chờ báo giá; TTMS xuất công văn (Soạn thảo công văn) và gửi đối tác ngoài hệ thống; yêu cầu đã Lưu không sửa (BR-DXMS-04-01). Mã YCBG-YYYY-NNNN, không gắn ĐXMS.',
      ],
      q: ['P-205', 'P-188', 'P-213', 'P-214', 'P-215'], src: 'task-management/components/task-create (khuôn form) · HT-DXMS-IMG Yêu cầu báo giá / Cập nhật · BM-YCKT · BM-YCBG',
    };
    const nvOpts = D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name}` }));
    const units = [...new Set(D.dxmsList.map((x) => x.unit).concat([v.unit]))];
    const nvRows = v.nv.map((c, i) => { const n = D.nvOf(c) || { code: c, name: c }; return `<tr><td class="ord">${i + 1}</td>${rm('nv', c)}<td>${esc(n.code)}</td><td>${esc(n.name)}</td><td>${esc(n.loaiCt || n.kind || '') || dash}</td><td>${esc(nvFund(n)) || dash}</td></tr>`; });
    const nccTRows = v.ncc.map((c, i) => { const r = nccOf(c); return `<tr><td class="ord">${i + 1}</td>${rm('ncc', c)}<td>${esc(r.code)}</td><td>${esc(r.name)}</td><td>${r.email ? esc(r.email) : '<span class="yc-bad">Chưa có email</span>'}</td><td>${esc(r.cc || '') || dash}</td></tr>`; });
    const ctRows = v.terms.contact.map((id, i) => { const c = D.contactParts(id) || { ten: id }; return `<tr><td class="ord">${i + 1}</td>${rm('contact', id)}<td>${esc(c.ten)}</td><td>${esc(c.donVi || '') || dash}</td><td>${esc(c.dienThoai || '') || dash}</td><td>${esc(c.email || '') || dash}</td></tr>`; });
    const items = `<section class="vcard" data-yc-items><div class="vcard-h"><h3>Danh mục hàng hoá yêu cầu báo giá</h3><div class="row">
        <button type="button" class="vbtn secondary" data-yc-xtpl>${icon('download')} Tải mẫu nhập</button><button type="button" class="vbtn secondary" data-yc-xls>${icon('excel')} Nhập từ Excel</button><button type="button" class="vbtn secondary" data-yc-add>${icon('add')} Thêm dòng</button></div></div>
      ${err.items ? `<p class="msg lf-err" role="alert">${esc(err.items)}</p>` : ''}
      <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th><th class="c" style="width:80px">Thao tác</th><th style="width:240px">Hàng hoá / dịch vụ *</th><th style="width:170px">Model / Mã NSX tham khảo</th><th style="width:100px">ĐVT</th><th style="width:110px">Số lượng *</th><th style="width:300px">Chỉ tiêu kỹ thuật</th></tr></thead>
      <tbody>${v.items.map((it, i) => `<tr><td class="ord">${i + 1}</td><td class="c"><button type="button" class="vbtn icon ghost" aria-label="Xóa dòng" data-yc-del="${i}">${icon('del')}</button></td>
        ${ITEM_KEYS.map((k) => `<td><div class="vfield ${err['it' + i + k] ? 'invalid' : ''}"><input class="vctl" data-yc-it="${i}.${k}" maxlength="${k === 'spec' ? 1000 : 255}" placeholder="${{ name: 'Nhập hàng hoá', model: 'Nhập model / mã NSX', uom: 'ĐVT', qty: 'Số lượng', spec: 'Chỉ tiêu kỹ thuật' }[k]}" value="${esc(it[k])}">${err['it' + i + k] ? `<p class="msg" role="alert">${esc(err['it' + i + k])}</p>` : ''}</div></td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <input type="file" id="yc-xls" accept=".csv,.xlsx,.xls" hidden></section>`;
    const back = edit ? `ycbg/${encodeURIComponent(F.code)}` : 'ycbg';
    return `<form class="pg" data-yc-form>
      ${S().head({ title: edit ? 'Cập nhật yêu cầu báo giá' : 'Thêm mới yêu cầu báo giá', back, lg: true, info,
        right: `${edit ? `<button type="button" class="vbtn secondary" data-yc-log>Xem lịch sử</button>` : ''}<button type="button" class="vbtn secondary" data-yc-word>${icon('download')} Soạn thảo công văn</button><button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="button" class="vbtn secondary" data-yc-save="draft">Lưu nháp</button><button type="button" class="vbtn primary" data-yc-save="send">Lưu</button>` })}
      <div class="banner-info yc-note" data-yc-note><b>Lưu ý:</b> Hệ thống chưa tự gửi email — sau khi Lưu, dùng Soạn thảo công văn để xuất yêu cầu báo giá và gửi đối tác. Người soạn thảo chú ý đáp ứng yêu cầu bảo mật — nội dung cần bảo mật theo yêu cầu của VHT không nêu tên cụ thể.</div>
      <section class="vcard"><h3>Thông tin chung</h3><div class="grid3">
        ${field('Mã yêu cầu báo giá', `<input class="vctl" value="${esc(F.code || '')}" placeholder="Hệ thống tự sinh" disabled>`)}
        ${field('Tên yêu cầu báo giá', txt('title', 'Nhập tên (tiêu đề email gửi đối tác)', 500), { req: true, err: err.title, cls: 'span2' })}
        ${field('Ngày YCBG', window.UI.vDate('data-yc-in="date"', v.date), { req: true, err: err.date })}
        ${field('Đơn vị đề xuất', vSelect({ id: 'yc-unit', value: v.unit, options: units.map((x) => ({ value: x, label: x })), onChange: upd((x) => { v.unit = x; }) }))}
        ${field('Thời hạn tiếp nhận báo giá', window.UI.vDate('data-yc-in="due"', v.due), { req: true, err: err.due })}
        ${field('Người tạo', `<input class="vctl" value="${esc((persona(v.by || Flow.state.persona) || {}).name || '')}" disabled>`)}
        ${field('Dự án / Đề tài', vSelect({ id: 'yc-nv', value: v.nv, multi: true, searchable: true, placeholder: 'Chọn dự án / đề tài', invalid: !!err.nv, options: nvOpts, onChange: upd((x) => { v.nv = x; delete err.nv; }) }), { req: true, err: err.nv, cls: 'span2' })}
        <div class="span3">${table('data-yc-nvt', [['Mã dự án / đề tài', 160], ['Tên dự án / đề tài', 260], ['Loại', 140], ['Nguồn vốn', 180]], nvRows)}</div>
        ${field('Đối tác nhận yêu cầu báo giá', vSelect({ id: 'yc-ncc', value: v.ncc, multi: true, searchable: true, placeholder: 'Chọn đối tác', invalid: !!err.ncc,
          options: nccRows().filter((r) => !r.ban).map((r) => ({ value: r.code, label: `${r.code} — ${r.name}` })), onChange: upd((x) => { v.ncc = x; delete err.ncc; }) }), { req: true, err: err.ncc, cls: 'span3' })}
        <div class="span3">${table('data-yc-ncct', [['Mã đối tác', 130], ['Tên đối tác', 240], ['Email nhận yêu cầu báo giá', 220], ['Email CC', 200]], nccTRows)}</div>
      </div></section>
      ${items}
      <section class="vcard"><h3>Tài liệu kỹ thuật</h3><div class="grid3">${up('kt', 'Yêu cầu kỹ thuật', `<a class="link-red" href="assets/mau/BM-YCKT.docx" download="BM-YCKT_Mau-yeu-cau-ky-thuat-de-bao-gia.docx" data-yc-tpl>Tải mẫu yêu cầu kỹ thuật</a>`)}${up('bv', 'Danh mục bản vẽ')}${up('khac', 'Tệp khác')}</div><input type="file" id="yc-file" hidden></section>
      <section class="vcard"><div class="vcard-h"><h3>Điều khoản trên phiếu yêu cầu báo giá</h3><div class="row"><button type="button" class="vbtn secondary" data-yc-def>Đặt giá trị mặc định</button></div></div><div class="grid3">
        ${field('Điều kiện thanh toán', ta('payment', 'Ví dụ: Thanh toán 02 đợt — 40 % khi ký hợp đồng, 60 % khi nghiệm thu', 'terms'), { cls: 'span3' })}
        ${field('Địa điểm giao hàng', txt('place', 'Ví dụ: Kho Viettel Hòa Lạc', 500, 'terms'))}
        ${field('Bảo hành tối thiểu (tháng)', txt('warranty', 'Ví dụ: 12', 3, 'terms', 'inputmode="numeric"'), { err: err.warranty })}
        ${field('Năm sản xuất từ', txt('year', 'YYYY', 4, 'terms', 'inputmode="numeric"'), { err: err.year })}
        ${field('Các yêu cầu khác', ta('other', 'Ví dụ: hiệu lực báo giá tối thiểu 90 ngày; lắp đặt, hiệu chuẩn tại kho nhận', 'terms'), { cls: 'span3' })}
        ${field('Đầu mối tiếp nhận báo giá', vSelect({ id: 'yc-contact', value: v.terms.contact, multi: true, searchable: true, placeholder: 'Chọn người dùng', invalid: !!err.contact,
          options: D.personas.map((p) => ({ value: p.id, label: `${p.name} — ${p.unit}` })), onChange: upd((x) => { v.terms.contact = x; delete err.contact; }) }), { req: true, err: err.contact, cls: 'span3' })}
        <div class="span3">${table('data-yc-ctt', [['Họ và tên', 200], ['Đơn vị', 220], ['Điện thoại', 140], ['Email', 220]], ctRows)}</div>
      </div></section></form>`;
  }
  function read() {
    if (!F.v) return;
    document.querySelectorAll('[data-yc-in]').forEach((el) => { const [a, b] = el.dataset.ycIn.split('.'); if (b) F.v[a][b] = el.value; else F.v[a] = el.value; });
    document.querySelectorAll('[data-yc-it]').forEach((el) => { const [i, k] = el.dataset.ycIt.split('.'); if (F.v.items[i]) F.v.items[i][k] = el.value; });
  }
  function validate(send) {
    const v = F.v, err = F.err = {}, t = v.terms;
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên yêu cầu báo giá.';
    if (!v.nv.length) err.nv = 'Bạn cần chọn Dự án / Đề tài.';
    if (!dkey(v.date)) err.date = 'Ngày YCBG không đúng định dạng.';
    if (!dkey(v.due)) err.due = 'Thời hạn tiếp nhận báo giá không đúng định dạng.';
    else if (dkey(v.date) && dkey(v.due) < dkey(v.date)) err.due = 'Thời hạn tiếp nhận báo giá không được nhỏ hơn Ngày YCBG.';
    if (String(t.warranty).trim() && !/^\d{1,3}$/.test(String(t.warranty).trim())) err.warranty = 'Bảo hành tối thiểu phải là số tháng.';
    if (String(t.year).trim() && (!/^\d{4}$/.test(String(t.year).trim()) || Number(t.year) > yearNow())) err.year = 'Năm sản xuất không đúng định dạng.';
    if (send) {
      if (!v.ncc.length) err.ncc = 'Bạn cần chọn ít nhất một đối tác.';
      /* [T37 RV-PROTO-0911 #6] chưa gửi email nên không bắt Email đối tác — trước: đối tác thiếu Email chặn Lưu và gửi. */
      if (!t.contact.length) err.contact = 'Bạn cần chọn đầu mối tiếp nhận báo giá.';
      const rows = v.items.filter((it) => Object.values(it).some((x) => String(x).trim()));
      if (!rows.length) err.items = 'Bạn cần nhập ít nhất một hàng hoá.';
      v.items.forEach((it, i) => {
        if (!Object.values(it).some((x) => String(x).trim())) return;
        if (!it.name.trim()) err['it' + i + 'name'] = 'Bạn cần nhập Hàng hoá.';
        const q = Number(String(it.qty).replace(',', '.'));
        if (!String(it.qty).trim()) err['it' + i + 'qty'] = 'Bạn cần nhập Số lượng.';
        else if (Number.isNaN(q) || q <= 0) err['it' + i + 'qty'] = 'Số lượng không đúng định dạng.';
      });
    }
    return !Object.keys(err).length;
  }
  function nextCode() {
    const y = (today().split('/')[2]) || '2026';
    const n = list().filter((u) => u.code.startsWith(`YCBG-${y}-`)).length + 1;
    return `YCBG-${y}-${String(n).padStart(4, '0')}`;
  }
  function save(mode) {
    read();
    if (!validate(mode === 'send')) { window.App.render(); toast('Vui lòng kiểm tra lại thông tin.', 'warn'); return; }
    const v = F.v, now = today(), at = Flow.state.clock, hm = new Date().toTimeString().slice(0, 5);
    v.items = v.items.filter((it) => Object.values(it).some((x) => String(x).trim()));
    v.log = v.log || [];
    if (!F.code) { v.code = nextCode(); v.by = Flow.state.persona; v.creator = (persona(Flow.state.persona) || {}).name || ''; v.created = now; list().unshift(v); v.log.push({ act: 'create', who: Flow.state.persona, t: at, hm }); }
    else { const i = list().findIndex((x) => x.code === F.code); list()[i] = v; v.log.push({ act: 'update', who: Flow.state.persona, t: at, hm }); }
    v.updated = now;
    if (mode === 'send') { v.sent = now; v.log.push({ act: 'send', who: Flow.state.persona, t: at, hm }); }
    const code = v.code;
    F.code = null; F.v = null;
    Flow.setUi('_ycbgTouch', Date.now());
    toast(mode === 'send' ? `<b>Thành công</b><br>Đã lưu yêu cầu báo giá ${esc(code)} (${v.ncc.length} đối tác nhận).` : `<b>Thành công</b><br>Đã lưu nháp yêu cầu báo giá ${esc(code)}.`);
    location.hash = `#/ycbg/${encodeURIComponent(code)}`;
  }

  /* Y8 — Đặt giá trị mặc định (P-213). */
  function setDefaults() {
    read();
    const t0 = D.ycbgTerms0, t = F.v.terms;
    Object.assign(t, { payment: t0.payment, place: t0.place, other: t0.other, warranty: '12', year: String(yearNow() - 1) });
    if (!t.contact.length) t.contact = [Flow.state.persona];
    delete F.err.warranty; delete F.err.year;
    window.App.render();
    toast('<b>Thành công</b><br>Đã điền giá trị mặc định cho điều khoản trên phiếu.');
  }

  /* Y4 — Nhập từ Excel: mẫu .csv + đọc .csv (prototype). */
  const csvCell = (x) => `"${String(x == null ? '' : x).replace(/"/g, '""')}"`;
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  function parseCsv(text) {
    const rows = []; let row = [], cell = '', q = false;
    const s = text.replace(/^﻿/, '');
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (q) { if (ch === '"' && s[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; continue; }
      if (ch === '"') q = true;
      else if (ch === ',' || ch === ';') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && s[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim()));
  }
  function importCsv(file) {
    if (!/\.csv$/i.test(file.name)) { toast('Prototype chỉ đọc tệp .csv theo mẫu nhập. Tải mẫu nhập, điền rồi lưu dạng CSV.', 'warn'); return; }
    const r = new FileReader();
    r.onload = () => {
      const rows = parseCsv(String(r.result));
      const head = (rows[0] || []).map((h) => h.trim().toLowerCase());
      const body = head[0] && head[0].startsWith('hàng hoá') ? rows.slice(1) : rows;
      const got = body.map((c) => ITEM_KEYS.reduce((o, k, j) => { o[k] = (c[j] || '').trim(); return o; }, {})).filter((it) => it.name || it.qty);
      if (!got.length) { toast('Tệp không có dòng hàng hoá nào.', 'warn'); return; }
      read();
      F.v.items = F.v.items.filter((it) => Object.values(it).some((x) => String(x).trim())).concat(got);
      delete F.err.items;
      window.App.render();
      toast(`<b>Thành công</b><br>Đã nhập ${got.length} dòng hàng hoá từ ${esc(file.name)}.`);
    };
    r.readAsText(file, 'utf-8');
  }

  /* Y9 — Soạn thảo công văn theo BM-YCBG (P-215). */
  function word() {
    read();
    const v = F.v, t = v.terms;
    const p = (s) => `<p>${s}</p>`, e = (s) => esc(s || '…');
    const cts = t.contact.map((id) => D.contactParts(id)).filter(Boolean);
    const ct = cts.length ? cts.map((c) => `${esc(c.ten)} - Số điện thoại: ${esc(c.dienThoai)} - Email: ${esc(c.email)}`).join('; ') : '…';
    const rows = v.items.filter((it) => it.name || it.qty);
    const cell = 'border:1px solid #000;padding:3pt';
    const body = `<table class="hd"><tr><td>TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI<br><b>TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL</b><br>Số: ……/VHT<br>Về việc yêu cầu báo giá.</td>
        <td><b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br><b><u>Độc lập - Tự do - Hạnh phúc</u></b><br><i>Hà Nội, ngày … tháng … năm ${yearNow()}</i></td></tr></table>
      ${p('Kính gửi: Quý đối tác quan tâm.')}
      ${p('Trước tiên, Tổng Công ty Công nghiệp Công nghệ cao Viettel (TCT VHT) xin gửi lời cảm ơn chân thành tới sự quan tâm của Quý đối tác.')}
      ${p('Căn cứ nhu cầu tại đơn vị, Chúng tôi xin gửi đến Quý đối tác nhu cầu báo giá như sau:')}
      ${p('<b>1. Danh mục nội dung yêu cầu báo giá:</b>')}${p(`${esc(v.title || '')}. Cụ thể yêu cầu kỹ thuật theo Phụ lục đính kèm.`)}
      ${p('<b>2. Các yêu cầu khác:</b>')}
      ${p(`<b><i>* Điều kiện thanh toán:</i></b> ${e(t.payment)}`)}${p(`<b><i>* Địa điểm giao hàng:</i></b> ${e(t.place)}`)}
      ${p(`<b><i>* Các yêu cầu khác:</i></b> ${e(t.other)}`)}
      ${t.warranty ? p(`- Thời gian bảo hành tối thiểu ${esc(t.warranty)} tháng và không thấp hơn điều kiện bảo hành của nhà sản xuất.`) : ''}${t.year ? p(`- Hàng hoá sản xuất từ năm ${esc(t.year)} trở về sau.`) : ''}
      ${p('- Đối tác báo giá theo mẫu đính kèm.')}
      ${p(`Đề nghị Quý đối tác phản hồi báo giá cho chúng tôi trước ngày ${e(v.due)} theo đầu mối sau: ${ct}`)}
      ${p('Trân trọng cám ơn./.')}
      <table class="hd"><tr><td style="text-align:left"><b><i>Nơi nhận:</i></b><br>- Như trên;<br>- Lưu: VT; ${esc((cts[0] || {}).ten || '…')}.</td><td><b>TỔNG GIÁM ĐỐC</b></td></tr></table>
      <br style="page-break-before:always">
      <p class="c"><b>Phụ lục</b></p><p class="c"><b>MẪU BÁO GIÁ</b></p><p class="c"><i>(Kèm theo Công văn số ……/VHT ngày …/…/${yearNow()})</i></p>
      ${p('<b>Đối tác có thể làm theo mẫu báo giá của đối tác tuy nhiên tối thiểu phải đảm bảo các thông tin dưới đây</b>')}
      <p class="c"><b>BÁO GIÁ</b></p>${p('Kính gửi: Tổng Công ty Công nghiệp Công nghệ cao Viettel')}${p('Đầu mối liên hệ: …….')}${p('Chúng tôi xin gửi tới Quý Công ty báo giá có nội dung như sau:')}
      <table style="border-collapse:collapse;width:100%"><tr>${['STT', 'Hàng hóa', 'Model/ Ký mã hiệu', 'Nhà sản xuất', 'Chỉ tiêu kỹ thuật chi tiết', 'Đơn vị tính', 'Số lượng', 'Đơn giá (VNĐ)', 'Thành tiền (VNĐ)'].map((h) => `<th style="${cell}">${h}</th>`).join('')}</tr>
        ${(rows.length ? rows : [blankItem()]).map((it, i) => `<tr><td style="${cell};text-align:center">${i + 1}</td><td style="${cell}">${esc(it.name)}</td><td style="${cell}">${esc(it.model)}</td><td style="${cell}"></td><td style="${cell}">${esc(it.spec)}</td><td style="${cell}">${esc(it.uom)}</td><td style="${cell};text-align:right">${esc(it.qty)}</td><td style="${cell}"></td><td style="${cell}"></td></tr>`).join('')}
        ${['Cộng (chưa bao gồm thuế GTGT)', 'Thuế GTGT(…..%)', 'TỔNG CỘNG (đã bao gồm thuế GTGT)'].map((s) => `<tr><td colspan="7" style="${cell};text-align:center"><b>${s}</b></td><td style="${cell}"></td><td style="${cell}"></td></tr>`).join('')}</table>
      ${p('<b>Điều khoản thương mại:</b>')}${p('1. Thời gian giao hàng: ….. từ ngày ký hợp đồng')}${p(`2. Địa điểm giao hàng: ${e(t.place)}`)}${p(`3. Điều kiện thanh toán: ${e(t.payment)}`)}
      ${p(`4. Thời gian bảo hành: ${t.warranty ? esc(t.warranty) : '…'} tháng từ ngày nghiệm thu hàng hóa`)}`;
    const css = 'body{font-family:"Times New Roman";font-size:13pt}p{margin:0 0 6pt;text-align:justify}.c{text-align:center}table.hd{width:100%}table.hd td{text-align:center;vertical-align:top;width:50%}';
    const name = `BM-YCBG_Cong-van-yeu-cau-bao-gia_${F.code || 'du-thao'}.doc`;
    download(name, `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Công văn yêu cầu báo giá</title><style>${css}</style></head><body>${body}</body></html>`, 'application/msword');
    toast(`<b>Thành công</b><br>Đã xuất file Word ${esc(name)}.`);
  }

  /* Y10 — Xem lịch sử (chế độ Cập nhật). */
  function showLog() {
    const u = list().find((x) => x.code === F.code);
    const log = (u && u.log) || [];
    const at = (h) => `${Flow.dateOf(h.t || 0)} ${h.hm || ''}`.trim();
    const rows = log.map((h, i) => `<tr><td class="ord">${i + 1}</td><td>${esc(ACT[h.act] || h.act)}</td><td>${esc((persona(h.who) || {}).name || h.who)}</td><td>${esc(at(h))}</td></tr>`).join('')
      || '<tr><td class="vtable-empty" colspan="4">Chưa có dữ liệu</td></tr>';
    vModal({ title: `Lịch sử yêu cầu báo giá ${F.code}`, size: 'md', body: `<div class="vtable-vp" data-yc-logt><table class="vtable"><thead><tr><th class="ord">STT</th><th>Thao tác</th><th>Người thực hiện</th><th>Thời điểm</th></tr></thead><tbody>${rows}</tbody></table></div>`,
      actions: '<button type="button" class="vbtn secondary grey" data-close>Đóng</button>' });
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest('[data-yc-form]')) return;
    if (t.closest('[data-yc-add]')) { read(); F.v.items.push(blankItem()); window.App.render(); return; }
    const del = t.closest('[data-yc-del]');
    if (del) { read(); F.v.items.splice(Number(del.dataset.ycDel), 1); if (!F.v.items.length) F.v.items.push(blankItem()); window.App.render(); return; }
    const rmb = t.closest('[data-yc-rm]');
    if (rmb) { read(); const k = rmb.dataset.ycRm, id = rmb.dataset.id, arr = k === 'contact' ? F.v.terms : F.v; const key = k === 'contact' ? 'contact' : k; arr[key] = arr[key].filter((x) => x !== id); window.App.render(); return; }
    const up = t.closest('[data-yc-up]');
    if (up) { read(); F.up = up.dataset.ycUp; document.getElementById('yc-file').click(); return; }
    if (t.closest('[data-yc-xls]')) { read(); document.getElementById('yc-xls').click(); return; }
    if (t.closest('[data-yc-xtpl]')) { download('Mau-nhap-danh-muc-hang-hoa-YCBG.csv', [ITEM_HEAD].concat([['Máy phân tích phổ', 'N9020B', 'Bộ', '1', 'Dải tần 10 Hz – 26,5 GHz']]).map((r) => r.map(csvCell).join(',')).join('\n'), 'text/csv;charset=utf-8;'); toast('<b>Thành công</b><br>Đã tải mẫu nhập danh mục hàng hoá.'); return; }
    if (t.closest('[data-yc-def]')) { setDefaults(); return; }
    if (t.closest('[data-yc-word]')) { word(); return; }
    if (t.closest('[data-yc-log]')) { showLog(); return; }
    const sv = t.closest('[data-yc-save]');
    if (sv) save(sv.dataset.ycSave);
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'yc-file' && e.target.files.length && F.v) { F.v.files[F.up] = e.target.files[0].name; window.App.render(); }
    if (e.target.id === 'yc-xls' && e.target.files.length && F.v) { importCsv(e.target.files[0]); e.target.value = ''; }
  });

  /* Rule B6: rời trang Thêm mới / Cập nhật thì bỏ dữ liệu đang nhập — mở lại luôn là form trống / theo bản đã lưu. */
  window.addEventListener('hashchange', () => { if (!/^#\/ycbg\/(create|[^/]+\/edit)$/.test(location.hash)) { F.v = null; F.code = null; } });
  window.YcbgForm = { all, form, enter, list, toY, canEdit: (code) => { const u = list().find((x) => x.code === code); return !!u && mineEdit(u); } };
})();
