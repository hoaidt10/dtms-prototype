/* T29 B3a + B5 — SCR-105 Rà soát tồn kho: việc của Phòng Quản lý tài sản / Thủ kho (persona qlts) — plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md
   §3.4 S4, §3.7 C1, §3.8 C2; review Huylx4 05/11 #21–24 (docs/dtms/prototype-T29-review-huylx4-0511.md).
   - Việc ngoài sơ đồ (SRS: "công việc này không thêm bước vào quy trình"): hồ sơ MS01 / MS02 đang ở bước 7 mà chưa có kết quả → Việc của tôi của Kho có
     "Rà soát tồn kho". Không phải User Task BPMN — cơ chế giao việc ngoài sơ đồ cần dev riêng (BR-DXMS-C-28).
   - D-82 (thay "hai lần" của D-58): Kho nhập kết quả MỘT lần, cột theo biên bản thật BM-RSTK — Mã hàng trong kho, Nhà sản xuất, SL tồn kho, SL xuất kho,
     SL điều chuyển, SL cần mua (= SL yêu cầu − SL xuất kho, công thức E − K của BM-RSTK), Hợp đồng đầu vào (Nguyên giá, Thuế GTGT, Số hợp đồng, Nguồn gốc
     Đề tài / Dự án), Đơn giá nhận, Ghi chú vị trí (thùng). Lệch BR-DXMS-03-01, DTMS_CN_0142, BPMN bước 7 ("theo sổ sách và thực tế") → DTMS_Q_0143.
   - Tồn khả dụng = SL tồn kho − Đang giữ cho ĐXMS khác, không âm (BR-DXMS-03-02); SL xuất kho không vượt Tồn khả dụng và SL yêu cầu.
   - C1 (D-56, P-187): Biên bản rà soát vật tư, linh kiện tồn kho (…/BBRS-MS) sinh từ kết quả; C2 (P-186): Phiếu yêu cầu rà soát (…/PYC) sinh khi gửi yêu cầu (bước 6).
   Kết quả lưu ở Flow.ui.rstk = { kq: { t, by, rows: [{ n, code, maker, stock, out, transfer, cost, vat, contract, origin, price, bin }] }, file }. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, badge, persona, vModal, toast, icon } = window.UI;
  const dash = '<span class="dash">-</span>';
  const num = (v) => (v == null || v === '' ? dash : esc(Number(v).toLocaleString('vi-VN')));
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const head2 = (groups, cols) => `<tr><th class="ord" rowspan="2">STT</th>${groups.map(([h, n, cls]) => `<th colspan="${n}" class="c ${cls || ''}">${h}</th>`).join('')}</tr>
    <tr>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr>`;
  const table2 = (groups, cols, rows, cell, foot) => `<div class="vtable-vp"><table class="vtable rsk-t"><thead>${head2(groups, cols)}</thead>
    <tbody>${rows.length ? rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r, i)}</tr>`).join('') : `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt=""><div>Không có dữ liệu</div></td></tr>`}</tbody>${foot || ''}</table></div>`;
  const kv = (k, v) => `<div><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
  const HAN = 7; // Hạn Rà soát tồn kho (mục 2.3.6 SRS-DXMS, mặc định 7 NLV)

  /* Hồ sơ đang chạy luồng MS01 / MS02 (không KĐT, không hồ sơ con hợp đồng). */
  const live = () => Flow.state.status === 'running' && !Flow.state.kdt && !Flow.state.parent;
  const tok7 = () => (live() ? Flow.state.tokens.find((t) => String(t.task) === '7') : null);
  const data = () => Flow.ui.rstk || {};
  const canKho = (pid) => pid === 'qlts' || D.allAccess(pid);
  /* D-82: một lần nhập — has() giữ tham số cũ ('p1' / 'p2' / 'kq') để nơi gọi cũ đọc cùng một kết quả. */
  const done = () => !!(data().kq && data().kq.rows);
  const has = () => done();
  const pending = () => !!tok7() && !done();
  const bbNo = () => `${String(Flow.ci().code || '').slice(-4)}/BBRS-MS`;
  const pycNo = () => `${String(Flow.ci().code || '').slice(-4)}/PYC-RS`;

  /* Bảng kết quả theo hạng mục của hồ sơ (D.items theo ĐXMS đang chạy, gồm hạng mục bước 5 thêm / bớt). Không có Mã hàng trong kho = không quản lý tồn. */
  function rows(src) {
    const d = src || data(), kq = (d.kq || {}).rows || [];
    return D.items.map((i) => {
      const a = kq.find((x) => x.n === i.n) || {}, managed = !!a.code, held = i.held || 0;
      const avail = managed && a.stock != null ? Math.max(0, a.stock - held) : null, out = managed ? a.out || 0 : 0;
      return { n: i.n, name: i.name, uom: i.uom, prop: i.prop, code: a.code || '', maker: a.maker || '', managed, held, heldFor: i.heldFor,
        stock: managed ? a.stock : null, out: managed ? a.out : null, transfer: managed ? a.transfer : null, buy: done() || src ? i.prop - out : null,
        cost: a.cost, vat: a.vat, contract: a.contract || '', origin: a.origin || '', price: a.price, bin: a.bin || '', avail,
        /* Tên cũ cho nơi đọc của bước 7 (vars.js): book / actual = SL tồn kho. */
        book: managed ? a.stock : null, actual: managed ? a.stock : null };
    });
  }

  /* T29 B16 — DX-10 (c): MS01 có bước 7 của Kho trên sơ đồ (token của Kho) → không còn việc ngoài sơ đồ; MS02 vẫn là việc ngoài sơ đồ. */
  const inFlow = () => ((Flow.def()[7] || {}).who === 'qlts');
  /* Dòng ở Việc của tôi (screens.myTasks). */
  function taskRows(pid, base) {
    if (!canKho(pid) || !live() || inFlow()) return [];
    const t = tok7(), d = data(), out = [];
    const row = (st, since, extra) => Object.assign({}, base, { name: 'Rà soát tồn kho', st, created: Flow.dateOf(since), due: Flow.dateOf(since + HAN), go: 'ra-soat-kho' }, extra || {});
    if (t && !done()) out.push(row(t.since + HAN < Flow.state.clock ? 'QUA_HAN' : 'CHUA_XU_LY', t.since));
    else if (done() && d.kq.by === 'qlts') out.push(row('HOAN_THANH', d.kq.t));
    return out;
  }
  const pendingFor = (pid) => (canKho(pid) && pending() && !inFlow() ? 1 : 0);
  const stateText = () => (!done() ? ['Chờ kết quả rà soát', 'info'] : tok7() ? ['Đã có kết quả — chờ đơn vị xác nhận bước 7', 'success'] : ['Đã chốt ở bước 7', 'default']);

  const GROUPS = [['Yêu cầu', 4], ['Kết quả rà soát', 6, 'rsk-g'], ['Hợp đồng đầu vào', 5], ['Ghi chú', 1]];
  const COLS = [['Mô tả', 240], ['ĐVT', 70], ['Số lượng', 90, 'r'], ['Đang giữ cho ĐXMS khác', 170], ['Mã hàng trong kho', 140], ['Nhà sản xuất', 140], ['SL tồn kho', 100, 'r'],
    ['SL xuất kho', 100, 'r'], ['SL điều chuyển', 110, 'r'], ['SL cần mua', 100, 'r'], ['Nguyên giá (VNĐ)', 140, 'r'], ['Thuế GTGT', 100, 'r'], ['Số hợp đồng', 140],
    ['Nguồn gốc Đề tài / Dự án', 200], ['Đơn giá nhận (VNĐ)', 140, 'r'], ['Vị trí (thùng)', 120]];

  /* ---------- SCR-105 trang #/ra-soat-kho ---------- */
  function page() {
    const ci = Flow.ci(), pid = Flow.state.persona, t = tok7(), d = data();
    const info = {
      scr: 'SCR-105', name: 'Rà soát tồn kho (việc của Phòng QLTS / Thủ kho)', uc: 'UC-07-02 · UR-PRE-10, UR-PRE-12', bpmn: 'Ngoài sơ đồ — trong lúc hồ sơ ở bước 07 (06 gửi yêu cầu)',
      notes: [
        '<b>T29 B3a (D-58 sửa theo Q5):</b> người nhập kết quả là <b>Phòng Quản lý tài sản / Thủ kho</b>, không phải đơn vị đề xuất. Hồ sơ tới bước 7 → Việc của tôi của Kho có việc này; SRS-DXMS ghi "không thêm bước vào quy trình" — cơ chế giao việc ngoài sơ đồ cần dev riêng (BR-DXMS-C-28).',
        '<b>T29 B5 — D-82 (review Huylx4 #21–24):</b> nhập kết quả <b>một lần</b>, bảng theo cột của biên bản thật <b>BM-RSTK</b>: Yêu cầu (Mô tả, ĐVT, Số lượng) · Kết quả rà soát (Mã hàng trong kho, Nhà sản xuất, SL tồn kho, SL xuất kho, SL điều chuyển, SL cần mua = Số lượng − SL xuất kho như công thức E − K của BM-RSTK) · Hợp đồng đầu vào (Nguyên giá, Thuế GTGT, Số hợp đồng, Nguồn gốc Đề tài / Dự án, Đơn giá nhận) · Ghi chú vị trí. Bỏ lựa chọn Lần rà soát Sổ sách / Thực tế. <b>Lệch</b> BR-DXMS-03-01, DTMS_CN_0142 và BPMN bước 7 ("RSTK theo sổ sách và RSTK thực tế") — đã ghi câu hỏi BA DTMS_Q_0143 và thay-doi.tsv SRS-DXMS.',
        '<b>Tồn khả dụng</b> = SL tồn kho − Đang giữ cho ĐXMS khác, không âm (BR-DXMS-03-02); SL xuất kho không vượt Tồn khả dụng và Số lượng yêu cầu. Bỏ trống Mã hàng = hạng mục không quản lý tồn (dịch vụ). Bước 7 của ĐVĐX chỉ xác nhận được khi Kho đã nhập kết quả.',
        '<b>Biên bản rà soát vật tư, linh kiện tồn kho</b> (C1, D-56): hệ thống sinh theo mẫu BM-RSTK từ kết quả (số …/BBRS-MS, thành phần TTMS + đơn vị đề xuất, căn cứ phiếu yêu cầu, câu hiệu lực giữ hàng 30 ngày), đưa vào Danh sách tài liệu của hồ sơ. Chân ký <b>GIẢ LẬP P-187</b> (Thủ kho → Chỉ huy bộ phận QLTS → GĐ TTMS, theo đề xuất trong ghi âm; biên bản thật chỉ có NV QLTS và GĐ TTMS); bước ký chờ DX-07. <b>Phiếu yêu cầu rà soát</b> (C2): hệ thống sinh khi gửi yêu cầu ở bước 6 — GIẢ LẬP P-186.',
        '<b>Tệp kết quả</b> (biên bản kiểm đếm có ký) bắt buộc. <b>GIẢ LẬP P-196:</b> số tồn do Kho nhập tay (BM-RSTK cho thấy kho dùng sổ Excel); khi có tích hợp WMS / QLTS thì điền sẵn (DTMS_Q_0080).',
      ],
      q: ['P-196', 'P-186', 'P-187'], src: 'my-task-detail (khung) · hộp thoại nhập bảng · BM-RSTK · SRS-DXMS 3.1.3.1',
    };
    const can = canKho(pid) && !!t;
    const right = can ? `<button type="button" class="vbtn primary" data-rsk-open>${icon('edit')} Cập nhật kết quả rà soát</button>` : '';
    const st = stateText();
    const head = window.Screens.head({ title: 'Rà soát tồn kho', back: 'viec-cua-toi', info, right });
    if (!live() && !done()) return `<div class="pg">${head}<section class="vcard pad24"><div class="empty-t">Không có hồ sơ cần rà soát tồn kho.</div></section></div>`;
    const since = t ? t.since : (d.kq || {}).t || 0;
    const R = rows();
    const res = done() ? `${Flow.dateOf(d.kq.t)} · ${esc((persona(d.kq.by) || {}).name || '')}` : 'Chưa có';
    const sum = (k) => R.reduce((s, r) => s + (Number(r[k]) || 0), 0);
    const foot = done() ? `<tfoot><tr><td></td><td><b>Tổng</b></td><td></td><td class="r num"><b>${num(sum('prop'))}</b></td><td></td><td></td><td></td><td class="r num"><b>${num(sum('stock'))}</b></td>
      <td class="r num"><b>${num(sum('out'))}</b></td><td class="r num"><b>${num(sum('transfer'))}</b></td><td class="r num"><b>${num(sum('buy'))}</b></td><td colspan="6"></td></tr></tfoot>` : '';
    return `<div class="pg" data-rsk>${head}
      <section class="vcard"><h3>Thông tin chung</h3><div class="ginfo c3">
        ${kv('Mã hồ sơ', esc(ci.code))}${kv('Mã ĐXMS', esc(ci.dxms))}${kv('Tên hồ sơ', esc(ci.name))}
        ${kv('Đơn vị đề xuất', esc(ci.unit))}${kv('Ngày giao', esc(Flow.dateOf(since)))}${kv('Hạn xử lý', esc(Flow.dateOf(since + HAN)))}
        ${kv('Trạng thái', badge(st[0], st[1]))}${kv('Kết quả rà soát', res)}${kv('Phiếu yêu cầu rà soát', `Số ${esc(pycNo())} — hệ thống gửi ở bước 06`)}
      </div></section>
      <section class="vcard"><div class="vcard-h"><h3>Kết quả rà soát vật tư, linh kiện tồn kho</h3><span class="cap">Theo biểu mẫu biên bản rà soát (BM-RSTK) · hạng mục ĐVĐX đã bóc tách ở bước 05</span></div>
        ${table2(GROUPS, COLS, R, (r) => `<td>${clamp(r.name)}</td><td>${esc(r.uom)}</td><td class="r num">${num(r.prop)}</td><td>${r.held ? esc(`${r.held} — ${r.heldFor}`) : dash}</td>
          <td>${r.code ? esc(r.code) : (done() ? dash : '')}</td><td>${clamp(r.maker)}</td><td class="r num">${r.managed ? num(r.stock) : dash}</td>
          <td class="r num">${r.managed ? num(r.out) : dash}</td><td class="r num">${r.managed ? num(r.transfer) : dash}</td><td class="r num">${r.buy == null ? dash : `<b>${num(r.buy)}</b>`}</td>
          <td class="r num">${num(r.cost)}</td><td class="r num">${num(r.vat)}</td><td>${clamp(r.contract)}</td><td>${clamp(r.origin)}</td><td class="r num">${num(r.price)}</td><td>${clamp(r.bin)}</td>`, foot)}
      </section>
      ${done() ? minutes(ci, d) : ''}
      <section class="vcard"><h3>Tài liệu kết quả</h3>
        ${d.file ? `<a class="link-red" href="#" data-dl="${esc(d.file)}">${esc(d.file)}</a>` : '<span class="dash">Chưa có tệp kết quả</span>'}</section></div>`;
  }

  /* C1 (D-56) — Biên bản rà soát theo BM-RSTK, sinh từ kết quả; chân ký GIẢ LẬP P-187. */
  const SIGNERS = [['Thủ kho', 'qlts'], ['Chỉ huy bộ phận QLTS', null], ['Giám đốc Trung tâm Mua sắm', null]];
  function minutes(ci, d) {
    const p = persona(d.kq.by) || {};
    return `<section class="vcard pad24" data-rsk-bb><div class="vcard-h"><h3>Biên bản rà soát vật tư, linh kiện tồn kho</h3>
        <div class="row"><button type="button" class="vbtn secondary" data-dl="${esc(bbFile())}">${icon('download')} Tải biên bản</button></div></div>
      <div class="ginfo c3">${kv('Số', esc(bbNo()))}${kv('Ngày', esc(Flow.dateOf(d.kq.t)))}${kv('Trạng thái ký', badge('Chờ ký — chờ DX-07', 'warning'))}
        ${kv('Đại diện Trung tâm Mua sắm', esc(`${p.name || ''} — ${p.role || ''}`))}${kv('Đại diện đơn vị yêu cầu', esc(ci.unit))}
        ${kv('Căn cứ', esc(`Phiếu yêu cầu rà soát vật tư, hàng hoá tồn kho số ${pycNo()} của ${ci.unit}`))}</div>
      <p class="cap mt8">Để đảm bảo kế hoạch sử dụng: nếu quá 30 ngày đơn vị không gửi đề xuất cấp hàng mà không xác nhận lại với bộ phận kho — TTMS để tiếp tục giữ hàng, biên bản này không còn giá trị và vật tư, thiết bị được đưa vào kế hoạch tái sử dụng cho đề tài / dự án khác.</p>
      <div class="ginfo c3">${SIGNERS.map(([r, id]) => kv(r, id ? esc((persona(id) || {}).name || '') : '<span class="faint">Chưa ký</span>')).join('')}</div></section>`;
  }
  const bbFile = () => `Bien-ban-ra-soat-ton-kho_${String(Flow.ci().code || '').replace('Đ', 'D')}.pdf`;

  /* ---------- Hộp thoại Cập nhật kết quả rà soát (một lần — D-82) ---------- */
  const KEYS = ['code', 'maker', 'stock', 'out', 'transfer', 'cost', 'vat', 'contract', 'origin', 'price', 'bin'];
  const NUMS = ['stock', 'out', 'transfer', 'cost', 'vat', 'price'];
  const DL = { vals: {}, file: '', err: {} };
  function openDialog() {
    const d = data();
    DL.file = d.file || '';
    DL.err = {};
    DL.vals = {};
    rows().forEach((r) => { DL.vals[r.n] = {}; KEYS.forEach((k) => { DL.vals[r.n][k] = r[k] == null ? '' : String(r[k]); }); });
    /* Chưa có kết quả: gợi ý Mã hàng trong kho theo danh mục kho (GIẢ LẬP — thật: chọn từ QLTS khi có tích hợp). */
    if (!done()) D.items.forEach((i) => { if (i.stock != null) DL.vals[i.n].code = D.rstkCode(i.n); });
    draw();
  }
  let dlg = null;
  function body() {
    const R = rows();
    const inp = (n, k, ph, dis, w) => `<input class="vctl ${DL.err[n + k] ? 'invalid' : ''}" data-rsk-in="${n}:${k}" value="${esc(DL.vals[n][k])}" placeholder="${ph}" ${dis ? 'disabled' : ''} style="min-width:${w || 90}px">${DL.err[n + k] ? `<p class="msg" role="alert">${esc(DL.err[n + k])}</p>` : ''}`;
    return `<div class="rsk-dlg">
      ${table2(GROUPS, COLS, R, (r) => { const v = DL.vals[r.n], m = !!(v.code || '').trim(), c = (k, ph, w) => `<td><div class="vfield">${inp(r.n, k, ph, !m, w)}</div></td>`;
        const out = numOf(v.out);
        return `<td>${clamp(r.name)}</td><td>${esc(r.uom)}</td><td class="r num">${num(r.prop)}</td><td>${r.held ? esc(`${r.held} — ${r.heldFor}`) : dash}</td>
          <td><div class="vfield">${inp(r.n, 'code', 'Bỏ trống nếu không quản lý tồn', false, 140)}</div></td>${c('maker', 'Nhà sản xuất', 120)}${c('stock', 'Nhập số')}${c('out', 'Nhập số')}${c('transfer', 'Nhập số')}
          <td class="r num" data-rsk-buy="${r.n}"><b>${num(r.prop - (m && out != null && !Number.isNaN(out) ? out : 0))}</b></td>
          ${c('cost', 'VNĐ', 120)}${c('vat', 'VNĐ')}${c('contract', 'Số hợp đồng', 120)}${c('origin', 'Đề tài / dự án', 160)}${c('price', 'VNĐ', 120)}${c('bin', 'Ví dụ: Thùng 31', 100)}`; })}
      <div class="vfield ${DL.err.file ? 'invalid' : ''}"><div class="lr"><label>Tệp kết quả (biên bản kiểm đếm có ký)</label><span class="req" aria-hidden="true">*</span></div>
        <div class="row"><button type="button" class="vbtn secondary" data-rsk-up>${icon('upload')} Tải tệp lên</button><input type="file" id="rsk-file" hidden>
          ${DL.file ? `<span class="rsk-file">${esc(DL.file)}</span>` : ''}</div>${DL.err.file ? `<p class="msg" role="alert">${esc(DL.err.file)}</p>` : ''}</div></div>`;
  }
  function draw() {
    const actions = '<button type="button" class="vbtn secondary grey" data-close>Hủy</button><button type="button" class="vbtn primary" data-rsk-save>Lưu</button>';
    if (dlg && document.body.contains(dlg.el)) { dlg.el.querySelector('.vmodal-b').innerHTML = body() + `<div class="vmodal-acts">${actions}</div>`; return; }
    dlg = vModal({ title: 'Cập nhật kết quả rà soát tồn kho', body: body(), actions, size: 'lg' });
  }
  function readInputs() {
    document.querySelectorAll('[data-rsk-in]').forEach((el) => { const [n, k] = el.dataset.rskIn.split(':'); DL.vals[n][k] = el.value; });
  }
  const numOf = (s) => (String(s == null ? '' : s).trim() === '' ? null : Number(String(s).trim().replace(/\./g, '').replace(',', '.')));
  function save() {
    readInputs();
    DL.err = {};
    const out = [];
    D.items.forEach((i) => {
      const v = DL.vals[i.n], code = (v.code || '').trim(), held = i.held || 0, r = { n: i.n, code };
      const bad = (k, label) => { DL.err[i.n + k] = `${label} không đúng định dạng.`; };
      if (code) {
        NUMS.forEach((k) => { const x = numOf(v[k]); r[k] = x; if (x != null && (Number.isNaN(x) || x < 0)) bad(k, { stock: 'SL tồn kho', out: 'SL xuất kho', transfer: 'SL điều chuyển', cost: 'Nguyên giá', vat: 'Thuế GTGT', price: 'Đơn giá nhận' }[k]); });
        if (r.stock == null) DL.err[i.n + 'stock'] = 'Vui lòng nhập SL tồn kho.';
        if (r.out == null) DL.err[i.n + 'out'] = 'Vui lòng nhập SL xuất kho.';
        else if (!DL.err[i.n + 'out'] && r.stock != null && r.out > Math.max(0, r.stock - held)) DL.err[i.n + 'out'] = `SL xuất kho không được lớn hơn tồn khả dụng (${Math.max(0, r.stock - held)}).`;
        else if (!DL.err[i.n + 'out'] && r.out > i.prop) DL.err[i.n + 'out'] = 'SL xuất kho không được lớn hơn Số lượng yêu cầu.';
        ['maker', 'contract', 'origin', 'bin'].forEach((k) => { r[k] = (v[k] || '').trim(); });
      }
      out.push(r);
    });
    if (!DL.file) DL.err.file = 'Vui lòng tải lên Tệp kết quả.';
    if (Object.keys(DL.err).length) { draw(); return; }
    Flow.setUi('rstk', { kq: { t: Flow.state.clock, by: Flow.state.persona, rows: out }, file: DL.file });
    if (dlg) dlg.close();
    toast('<b>Thành công</b><br>Đã lưu kết quả rà soát tồn kho và sinh biên bản rà soát. Hệ thống thông báo đơn vị đề xuất xác nhận bước 7.');
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-rsk-open]')) { openDialog(); return; }
    if (t.closest('[data-rsk-up]')) { document.getElementById('rsk-file').click(); return; }
    if (t.closest('[data-rsk-save]')) save();
  });
  /* SL cần mua cập nhật tại chỗ khi rời ô SL xuất kho. */
  document.addEventListener('change', (e) => {
    if (e.target.id === 'rsk-file' && e.target.files.length) { readInputs(); DL.file = e.target.files[0].name; delete DL.err.file; draw(); return; }
    const k = e.target.dataset && e.target.dataset.rskIn;
    if (!k || !/:out$|:code$/.test(k)) return;
    readInputs();
    if (/:code$/.test(k)) { draw(); return; }
    const n = k.split(':')[0], i = D.items.find((x) => String(x.n) === n), v = DL.vals[n], o = numOf(v.out);
    const cell = document.querySelector(`[data-rsk-buy="${n}"]`);
    if (cell && i) cell.innerHTML = `<b>${num(i.prop - ((v.code || '').trim() && o != null && !Number.isNaN(o) ? o : 0))}</b>`;
  });

  /* Card ở màn xử lý bước 7 / 7.1 (DX-10): bảng kết quả theo BM-RSTK + biên bản; nút nhập kết quả cho Kho ở bước 7. */
  function taskCard(tok) {
    const k = String(tok.task);
    if (!live() || !inFlow() || (k !== '7' && k !== '7.1')) return '';
    const mine = k === '7' && Flow.state.tokens.some((t) => t.id === tok.id) && (tok.who === Flow.state.persona || D.allAccess(Flow.state.persona));
    const R = rows(), d = data();
    return `<section class="vcard pad24" data-rsk-card><div class="vcard-h"><h3>Kết quả rà soát tồn kho</h3><div class="row">
        ${mine ? `<button type="button" class="vbtn secondary" data-rsk-open>${icon('edit')} Cập nhật kết quả rà soát</button>` : ''}<a class="vbtn ghost" data-go="ra-soat-kho">Xem đủ cột</a></div></div>
      ${table2([['Yêu cầu', 3], ['Kết quả rà soát', 4, 'rsk-g']], [['Mô tả', 240], ['ĐVT', 70], ['Số lượng', 90, 'r'], ['SL tồn kho', 100, 'r'], ['SL xuất kho', 100, 'r'], ['SL điều chuyển', 110, 'r'], ['SL cần mua', 100, 'r']], R,
        (r) => `<td>${clamp(r.name)}</td><td>${esc(r.uom)}</td><td class="r num">${num(r.prop)}</td><td class="r num">${r.managed ? num(r.stock) : dash}</td><td class="r num">${r.managed ? num(r.out) : dash}</td>
          <td class="r num">${r.managed ? num(r.transfer) : dash}</td><td class="r num">${r.buy == null ? dash : `<b>${num(r.buy)}</b>`}</td>`)}
      ${done() ? `<p class="cap mt8">Biên bản ${esc(bbNo())} · ${esc(Flow.dateOf(d.kq.t))} — <a class="link-red" href="#" data-dl="${esc(bbFile())}">${esc(bbFile())}</a></p>` : '<p class="cap mt8">Chưa có kết quả rà soát.</p>'}</section>`;
  }

  window.RaSoatKho = { page, rows, taskRows, pendingFor, pending, data, has, done, bbFile, pycNo, bbNo, taskCard, inFlow,
    fillSample() { Flow.setUi('rstk', D.rstkSample(D.items, Flow.state.clock)); } };
})();
