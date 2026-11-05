/* T29 B3b — SCR-106 Thêm mới / Cập nhật yêu cầu báo giá (RV-PROTO-0511 #10, câu hỏi 7 "Có cần tạo / cập nhật YCBG không? — Có, bổ sung"; bố cục theo
   ảnh HT-DXMS-IMG "Yêu cầu báo giá / Cập nhật": Ngày YCBG, Dự án / Đề tài, Đối tác nhận, Danh mục hàng hoá, Yêu cầu kỹ thuật, Danh mục bản vẽ, Tệp khác,
   Điều kiện thanh toán…). Khuôn task-create (form 3 cột + card bảng) như SCR-96.
   - YCBG tạo trực tiếp (ngoài hồ sơ): khảo sát giá khi chưa có hồ sơ (vd lấy giá dự tính cho luồng mua sắm) — GIẢ LẬP P-205: SRS-DXMS chỉ có YCBG trong hồ sơ
     (bước 8–10, BR-DXMS-04-01); mục đích và liên kết với hồ sơ sau này hỏi BA.
   - Nháp: sửa được (Cập nhật). Lưu và gửi: hệ thống gửi email thay TTMS như bước 9 (BR-DXMS-04-06), trạng thái Đang chờ báo giá, không sửa nữa (BR-DXMS-04-01).
   - Mã YCBG-YYYY-NNNN (không gắn ĐXMS; YCBG trong hồ sơ giữ YCBG-{số ĐXMS}-{lần}).
   Lưu ở Flow.state.ycbgUser (giữ qua đổi cảnh, như dxmsUser). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, vSelect, toast, badge, persona } = window.UI;
  const S = () => window.Screens;
  const dash = '<span class="dash">-</span>';
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const list = () => (Flow.state.ycbgUser || (Flow.state.ycbgUser = []));
  const nccRows = () => window.Catalog.rows('nha-cung-cap').filter((r) => r.active);
  const nccOf = (c) => nccRows().find((r) => r.code === c) || { code: c, name: c };
  const dkey = (s) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}${m[2]}${m[1]}` : ''; };
  const addDays = (s, n) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s); if (!m) return s; const d = new Date(+m[3], +m[2] - 1, +m[1] + n); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };

  /* Dạng chung với YCBG của hồ sơ (ycbg.js ycbgOf) để dùng danh sách / chi tiết SCR-73, SCR-74. */
  function toY(u) {
    const nv = u.nv.map((c) => D.nvOf(c)).filter(Boolean);
    return { code: u.code, lan: '-', kdt: false, dxms: '', hs: '', hsHref: '', title: u.title, unit: u.unit, creator: u.creator, status: u.sent ? 'WAIT' : 'DRAFT',
      sent: u.sent || '', due: u.due, nv: u.nv.slice(), nvText: nv.map((n) => `${n.code} — ${n.name}`).join('; '), user: true, terms: u.terms, files: u.files, date: u.date,
      items: u.items.map((it, i) => ({ n: i + 1, name: it.name, model: it.model, uom: it.uom, buy: Number(it.qty) || 0, spec: it.spec })),
      ncc: u.ncc.map((c) => { const r = nccOf(c); return { code: c, name: r.name, short: r.name, email: r.email || '', currency: 'VNĐ', got: false, prices: {} }; }) };
  }
  const all = () => list().map(toY);
  const mineEdit = (u) => !u.sent && (u.by === Flow.state.persona || D.allAccess(Flow.state.persona));

  /* ---------- Form ---------- */
  const F = { code: null, v: null, err: {} };
  const empty = () => ({ date: Flow.dateOf(Flow.state.clock), nv: [], title: '', unit: (persona(Flow.state.persona) || {}).unit || 'Trung tâm Vô tuyến', ncc: [],
    due: addDays(Flow.dateOf(Flow.state.clock), 7), items: [{ name: '', model: '', uom: '', qty: '', spec: '' }], files: { kt: '', bv: '', khac: '' },
    terms: { payment: '', place: '', other: '', contact: (persona(Flow.state.persona) || {}).name || '' } });
  function enter(code) {
    const u = code && list().find((x) => x.code === code);
    F.code = u ? u.code : null;
    F.v = u ? JSON.parse(JSON.stringify(u)) : empty();
    if (!F.v.items.length) F.v.items.push({ name: '', model: '', uom: '', qty: '', spec: '' });
    F.err = {};
  }
  function form(code) {
    if (code !== undefined && F.code !== code) enter(code);
    if (!F.v) enter(code);
    const v = F.v, err = F.err, edit = !!F.code;
    const u = edit && list().find((x) => x.code === F.code);
    if (edit && (!u || !mineEdit(u))) return `<div class="pg">${S().head({ title: 'Cập nhật yêu cầu báo giá', back: 'ycbg' })}<section class="vcard pad24"><div class="empty-t">Yêu cầu báo giá đã gửi hoặc bạn không có quyền cập nhật.</div></section></div>`;
    const upd = (fn) => (x) => { read(); fn(x); window.App.render(); };
    const txt = (k, ph, max, obj) => `<input class="vctl" data-yc-in="${obj ? obj + '.' : ''}${k}" maxlength="${max || 255}" placeholder="${ph}" value="${esc(obj ? v[obj][k] : v[k])}">`;
    const ta = (k, ph, obj) => `<textarea class="vctl ta" data-yc-in="${obj}.${k}" maxlength="2000" placeholder="${ph}">${esc(v[obj][k])}</textarea>`;
    const up = (k, label) => field(label, `<div class="row"><button type="button" class="vbtn secondary" data-yc-up="${k}">${icon('upload')} Tải file lên</button>${v.files[k] ? `<span class="rsk-file">${esc(v.files[k])}</span>` : ''}</div>`);
    const info = {
      scr: 'SCR-106', name: edit ? 'Cập nhật yêu cầu báo giá' : 'Thêm mới yêu cầu báo giá', uc: 'UC-07-03 · UR-PRE-21/22',
      notes: [
        '<b>T29 B3b (RV-PROTO-0511 #10, câu hỏi 7):</b> tạo / cập nhật yêu cầu báo giá trực tiếp ở menu Yêu cầu báo giá ĐXMS, bố cục theo màn "Cập nhật yêu cầu báo giá" của hệ thống cũ (HT-DXMS-IMG): Ngày YCBG, Dự án / Đề tài, Đối tác nhận, Danh mục hàng hoá, Yêu cầu kỹ thuật, Danh mục bản vẽ, Tệp khác, Điều kiện thanh toán.',
        '<b>GIẢ LẬP P-205:</b> SRS-DXMS chỉ có YCBG trong hồ sơ (bước 8–10). YCBG tạo trực tiếp dùng khảo sát giá trước khi có hồ sơ; khi hồ sơ tới bước 8 hệ thống vẫn sinh YCBG riêng của hồ sơ. Mục đích, liên kết với hồ sơ: hỏi BA.',
        '<b>Lưu nháp</b> = sửa được về sau (nút Cập nhật ở danh sách / chi tiết). <b>Lưu và gửi</b> = hệ thống gửi email thay TTMS tới nhà cung cấp kèm phiếu theo mẫu BM-YCBG (BR-DXMS-04-06), trạng thái Đang chờ báo giá; yêu cầu đã gửi không sửa (BR-DXMS-04-01).',
        'Điều khoản trên phiếu (Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác, Đầu mối tiếp nhận báo giá) theo BR-DXMS-04-06 (P2). Mã YCBG-YYYY-NNNN, không gắn ĐXMS.',
      ],
      q: ['P-205', 'P-188'], src: 'task-management/components/task-create (khuôn form) · HT-DXMS-IMG Yêu cầu báo giá / Cập nhật',
    };
    const nvOpts = D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name}` }));
    const units = [...new Set(D.dxmsList.map((x) => x.unit).concat([v.unit]))];
    const items = `<section class="vcard" data-yc-items><div class="vcard-h"><h3>Danh mục hàng hoá yêu cầu báo giá</h3><div class="row"><button type="button" class="vbtn secondary" data-yc-add>${icon('add')} Thêm dòng</button></div></div>
      ${err.items ? `<p class="msg lf-err" role="alert">${esc(err.items)}</p>` : ''}
      <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th><th class="c" style="width:80px">Thao tác</th><th style="width:240px">Hàng hoá / dịch vụ *</th><th style="width:150px">Model</th><th style="width:100px">ĐVT</th><th style="width:110px">Số lượng *</th><th style="width:300px">Chỉ tiêu kỹ thuật</th></tr></thead>
      <tbody>${v.items.map((it, i) => `<tr><td class="ord">${i + 1}</td><td class="c"><button type="button" class="vbtn icon ghost" aria-label="Xóa dòng" data-yc-del="${i}">${icon('del')}</button></td>
        ${['name', 'model', 'uom', 'qty', 'spec'].map((k) => `<td><div class="vfield ${err['it' + i + k] ? 'invalid' : ''}"><input class="vctl" data-yc-it="${i}.${k}" maxlength="${k === 'spec' ? 1000 : 255}" placeholder="${{ name: 'Nhập hàng hoá', model: 'Nhập model', uom: 'ĐVT', qty: 'Số lượng', spec: 'Chỉ tiêu kỹ thuật' }[k]}" value="${esc(it[k])}">${err['it' + i + k] ? `<p class="msg" role="alert">${esc(err['it' + i + k])}</p>` : ''}</div></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
    return `<form class="pg" data-yc-form>
      ${S().head({ title: edit ? 'Cập nhật yêu cầu báo giá' : 'Thêm mới yêu cầu báo giá', back: edit ? `ycbg/${encodeURIComponent(F.code)}` : 'ycbg', lg: true, info,
        right: `<button type="button" class="vbtn secondary grey" data-go="${edit ? `ycbg/${encodeURIComponent(F.code)}` : 'ycbg'}">Huỷ</button><button type="button" class="vbtn secondary" data-yc-save="draft">Lưu nháp</button><button type="button" class="vbtn primary" data-yc-save="send">Lưu và gửi</button>` })}
      <section class="vcard"><h3>Thông tin chung</h3><div class="grid3">
        ${field('Mã yêu cầu báo giá', `<input class="vctl" value="${esc(F.code || '')}" placeholder="Hệ thống tự sinh" disabled>`)}
        ${field('Tên yêu cầu báo giá', txt('title', 'Nhập tên (tiêu đề email gửi nhà cung cấp)', 500), { req: true, err: err.title, cls: 'span2' })}
        ${field('Dự án / Đề tài', vSelect({ id: 'yc-nv', value: v.nv, multi: true, searchable: true, placeholder: 'Chọn dự án / đề tài', invalid: !!err.nv, options: nvOpts, onChange: upd((x) => { v.nv = x; delete err.nv; }) }), { req: true, err: err.nv, cls: 'span2' })}
        ${field('Ngày YCBG', txt('date', 'DD/MM/YYYY', 10), { req: true, err: err.date })}
        ${field('Đơn vị đề xuất', vSelect({ id: 'yc-unit', value: v.unit, options: units.map((x) => ({ value: x, label: x })), onChange: upd((x) => { v.unit = x; }) }))}
        ${field('Hạn trả lời', txt('due', 'DD/MM/YYYY', 10), { req: true, err: err.due })}
        ${field('Người tạo', `<input class="vctl" value="${esc((persona(v.by || Flow.state.persona) || {}).name || '')}" disabled>`)}
        ${field('Nhà cung cấp nhận yêu cầu', vSelect({ id: 'yc-ncc', value: v.ncc, multi: true, searchable: true, placeholder: 'Chọn nhà cung cấp', invalid: !!err.ncc,
          options: nccRows().filter((r) => !r.ban).map((r) => ({ value: r.code, label: `${r.code} — ${r.name}` })), onChange: upd((x) => { v.ncc = x; delete err.ncc; }) }), { req: true, err: err.ncc, cls: 'span3' })}
      </div></section>
      ${items}
      <section class="vcard"><h3>Tài liệu kỹ thuật</h3><div class="grid3">${up('kt', 'Yêu cầu kỹ thuật')}${up('bv', 'Danh mục bản vẽ')}${up('khac', 'Tệp khác')}</div><input type="file" id="yc-file" hidden></section>
      <section class="vcard"><h3>Điều khoản trên phiếu yêu cầu báo giá</h3><div class="grid3">
        ${field('Điều kiện thanh toán', ta('payment', 'Ví dụ: Thanh toán 02 đợt — 40 % khi ký hợp đồng, 60 % khi nghiệm thu', 'terms'), { cls: 'span3' })}
        ${field('Địa điểm giao hàng', txt('place', 'Ví dụ: Kho Viettel Hòa Lạc', 500, 'terms'))}
        ${field('Đầu mối tiếp nhận báo giá', txt('contact', 'Họ tên, điện thoại, email', 255, 'terms'), { cls: 'span2' })}
        ${field('Các yêu cầu khác', ta('other', 'Ví dụ: bảo hành tối thiểu theo hãng sản xuất; hiệu lực báo giá tối thiểu 90 ngày', 'terms'), { cls: 'span3' })}
      </div></section></form>`;
  }
  function read() {
    if (!F.v) return;
    document.querySelectorAll('[data-yc-in]').forEach((el) => { const [a, b] = el.dataset.ycIn.split('.'); if (b) F.v[a][b] = el.value; else F.v[a] = el.value; });
    document.querySelectorAll('[data-yc-it]').forEach((el) => { const [i, k] = el.dataset.ycIt.split('.'); if (F.v.items[i]) F.v.items[i][k] = el.value; });
  }
  function validate(send) {
    const v = F.v, err = F.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên yêu cầu báo giá.';
    if (!v.nv.length) err.nv = 'Bạn cần chọn Dự án / Đề tài.';
    if (!dkey(v.date)) err.date = 'Ngày YCBG không đúng định dạng.';
    if (!dkey(v.due)) err.due = 'Hạn trả lời không đúng định dạng.';
    else if (dkey(v.date) && dkey(v.due) < dkey(v.date)) err.due = 'Hạn trả lời không được nhỏ hơn Ngày YCBG.';
    if (send) {
      if (!v.ncc.length) err.ncc = 'Bạn cần chọn ít nhất một nhà cung cấp.';
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
    const y = (Flow.dateOf(Flow.state.clock).split('/')[2]) || '2026';
    const n = list().filter((u) => u.code.startsWith(`YCBG-${y}-`)).length + 1;
    return `YCBG-${y}-${String(n).padStart(4, '0')}`;
  }
  function save(mode) {
    read();
    if (!validate(mode === 'send')) { window.App.render(); toast('Vui lòng kiểm tra lại thông tin.', 'warn'); return; }
    const v = F.v, now = Flow.dateOf(Flow.state.clock);
    v.items = v.items.filter((it) => Object.values(it).some((x) => String(x).trim()));
    if (!F.code) { v.code = nextCode(); v.by = Flow.state.persona; v.creator = (persona(Flow.state.persona) || {}).name || ''; v.created = now; list().unshift(v); }
    else { const i = list().findIndex((x) => x.code === F.code); list()[i] = v; }
    v.updated = now;
    if (mode === 'send') v.sent = now;
    const code = v.code;
    F.code = null; F.v = null;
    Flow.setUi('_ycbgTouch', Date.now());
    toast(mode === 'send' ? `<b>Thành công</b><br>Đã gửi yêu cầu báo giá ${esc(code)} tới ${v.ncc.length} nhà cung cấp.` : `<b>Thành công</b><br>Đã lưu nháp yêu cầu báo giá ${esc(code)}.`);
    location.hash = `#/ycbg/${encodeURIComponent(code)}`;
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest('[data-yc-form]')) return;
    if (t.closest('[data-yc-add]')) { read(); F.v.items.push({ name: '', model: '', uom: '', qty: '', spec: '' }); window.App.render(); return; }
    const del = t.closest('[data-yc-del]');
    if (del) { read(); F.v.items.splice(Number(del.dataset.ycDel), 1); if (!F.v.items.length) F.v.items.push({ name: '', model: '', uom: '', qty: '', spec: '' }); window.App.render(); return; }
    const up = t.closest('[data-yc-up]');
    if (up) { read(); F.up = up.dataset.ycUp; document.getElementById('yc-file').click(); return; }
    const sv = t.closest('[data-yc-save]');
    if (sv) save(sv.dataset.ycSave);
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'yc-file' && e.target.files.length && F.v) { F.v.files[F.up] = e.target.files[0].name; window.App.render(); }
  });

  /* Rule B6: rời trang Thêm mới / Cập nhật thì bỏ dữ liệu đang nhập — mở lại luôn là form trống / theo bản đã lưu. */
  window.addEventListener('hashchange', () => { if (!/^#\/ycbg\/(create|[^/]+\/edit)$/.test(location.hash)) { F.v = null; F.code = null; } });
  window.YcbgForm = { all, form, enter, list, toY, canEdit: (code) => { const u = list().find((x) => x.code === code); return !!u && mineEdit(u); } };
})();
