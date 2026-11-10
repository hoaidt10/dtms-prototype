/* Quản lý thầu theo Backlog W1_T10 (T16 B2, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2i) — màn tĩnh, không chạy luồng (D-17).
   KHLCNT là đối tượng cha (như ĐXMS / KĐT, D-12): lập từ một đối tượng nguồn đã phê duyệt (ĐXMS / KĐT), quy trình MS18 (BPMN-MS18, bản nháp).
   Gói thầu là dòng gói của KHLCNT; tổ chức LCNT theo hình thức (QC-12869 Điều 12–21) — MS19 chưa có BPMN (P-77).
   SCR-78 #/khlcnt, SCR-79 #/khlcnt/create[/<loại>/<mã nguồn>], SCR-80 #/khlcnt/<mã>, SCR-81 #/goi-thau, SCR-82 #/goi-thau/<mã>, SCR-83 #/nha-thau. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, pager, norm, toast, persona, modal } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => S.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const money = (v) => (v == null ? dash : ty(v, 2));
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v == null || v === '' ? '-' : v}</div></div>`;
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const table = (cols, rows, cell, foot) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r, i)}</tr>`).join('') || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody>${foot || ''}</table></div>`;
  const card = (title, body, cap) => `<section class="vcard pad24">${cap ? `<div class="vcard-h"><h3>${title}</h3><span class="cap">${cap}</span></div>` : `<h3>${title}</h3>`}${body}</section>`;
  const emptyCard = (title, text) => card(title, `<div class="empty-t">${text}</div>`);
  const cat = (key, code) => ((window.Catalog.rows(key).find((r) => r.code === code) || {}).name || code || '');
  const nccName = (code) => { const r = D.nccOf(code); return r.name || r.short || code; };
  const dkey = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const sum = (a) => Math.round(a.reduce((s, x) => s + (x || 0), 0) * 100) / 100;
  /* Trường theo hệ thống cũ (T24 B3, HT-THAU-IMG): Quy chế áp dụng, Cấp phê duyệt, Người phụ trách. law = Theo luật (đăng tải mạng đấu thầu quốc gia, P-83). */
  const QC = { MSTX: 'Mua sắm thường xuyên', LUAT: 'Theo luật' };
  const LEVEL = { TCT: 'Tổng Công ty', TD: 'Tập đoàn' };
  const qcOf = (k) => (k.law ? 'LUAT' : 'MSTX');
  const levelOf = (k) => k.level || 'TCT';
  const ownerOf = (k) => k.owner || k.creator;
  /* Tiền bằng chữ cho dòng Tổng của bảng gói thầu (như hệ thống cũ, IMG 7212) — dùng UI.inWords (chung với Tờ trình BM-01 / BM-09). */
  const inWords = window.UI.inWords;

  /* ---------- Đối tượng nguồn (S4): giá trị được phê duyệt lấy từ hồ sơ Hoàn thành gần nhất của ĐXMS / KĐT ---------- */
  const SRC = { DXMS: 'Đề xuất mua sắm', KDT: 'Khoản đầu tư', DADT: 'Dự án đầu tư' };
  const srcHref = (kind, code) => (kind === 'KDT' ? 'kdt/' : 'dxms/') + encodeURIComponent(code);
  /* T45 (D-104): KĐT có thể chọn nhiều đề tài / dự án. */
  const nvText = (codes) => (codes || []).map((c) => D.nvOf(c)).filter(Boolean).map((n) => `${n.code} — ${n.name}`).join('; ');
  function srcInfo(kind, code) {
    if (kind === 'KDT') {
      const x = Flow.findKdt(code);
      if (!x) return null;
      /* T45 (D-103): KĐT đã duyệt = hồ sơ phê duyệt KĐT Hoàn thành hoặc hồ sơ chủ trương gộp (CT_KDT) Hoàn thành — chủ trương BM-01 chưa đủ. */
      const m = window.Kdt.meta(x), done = !m.approved ? null
        : m.hs.find((c) => c.kind === 'KDT' && c.st === 'done') || (m.ct && m.ct.st === 'done' && m.ct.scope === 'CT_KDT' ? m.ct : null);
      const d = done && (done.docs || []).filter(([k]) => k === 'BM-18' || k === 'BM-00').pop();
      return { kind, code, nv: x.nv, nvText: nvText(x.nvs || [x.nv]), title: x.title, unit: x.unit, approved: m.approved, value: m.approved ? m.value : null,
        doc: d ? `${d[0] === 'BM-18' ? 'BM-18 Quyết định phê duyệt KĐT' : 'BM-00 Hồ sơ chủ trương và KĐT'} ngày ${d[1]}` : '',
        fund: x.type === 'KHCN' ? 'KHCN' : x.type === 'TBNB' ? 'DTPT' : 'SXKD' };
    }
    const x = Flow.findDxms(code);
    if (!x) return null;
    const done = S.allCases().filter((c) => c.dxms === code && c.st === 'done').sort((a, b) => dkey(b.updated).localeCompare(dkey(a.updated)))[0];
    const doc = done ? (done.kind === 'DC' ? 'QĐ điều chỉnh ĐXMS' : done.flow === 'MS01.03' ? 'BM-09 Tờ trình ĐXMS (đã phê duyệt)' : 'BM-08 Quyết định phê duyệt ĐXMS') + ' ngày ' + done.updated : '';
    return { kind, code, nv: x.nv, nvText: nvText([x.nv]), title: x.title, unit: x.unit, approved: !!done, value: done ? done.total : null, doc, fund: (x.est || 0) < 20 ? 'CPTX' : 'DTPT' };
  }
  const approvedSources = (kind) => (kind === 'KDT' ? Flow.kdtAll() : Flow.dxmsAll()).map((x) => srcInfo(kind, x.code)).filter((s) => s && s.approved);

  /* ---------- Dữ liệu mẫu ----------
     KH_ST theo 4 luồng con MS18: 18.1 lập thông tin gói → 18.2 Tờ trình (BM-01, VOffice) → 18.3 Báo cáo kiểm tra (Q02) → 18.4 Quyết định (BM-03) & đăng tải. */
  const KH_ST = { DRAFT: ['Dự thảo', 'default'], SIGN: ['Đang trình ký tờ trình', 'info'], CHECK: ['Đang kiểm tra', 'info'], APPROVE: ['Chờ phê duyệt', 'warning'],
    OK: ['Đã phê duyệt', 'success'], ADJ: ['Đang điều chỉnh', 'warning'] };
  const KH_STEP = { DRAFT: 'MS18.1 · Lập thông tin gói thầu', SIGN: 'MS18.2 · Lập Tờ trình KHLCNT', CHECK: 'MS18.3 · Lập Báo cáo kiểm tra KHLCNT', APPROVE: 'MS18.4 · Quyết định phê duyệt & đăng tải',
    OK: 'Hoàn tất MS18', ADJ: 'MS18.1 · Lập thông tin gói thầu (điều chỉnh)' };
  const KH0 = [
    { code: 'KHLCNT-2026-0017', src: ['DXMS', 'ĐXMS-2026-0084'], title: 'KHLCNT thuê hạ tầng điện toán đám mây cho hệ thống OSS', st: 'DRAFT', creator: 'Lương Thị Hạnh', created: '29/09/2026', updated: '30/09/2026',
      basis: 'Một gói: dịch vụ thuê hạ tầng liên tục 12 tháng, một nhà cung cấp trong Tập đoàn đáp ứng.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0034'] },
    { code: 'KHLCNT-2026-0016', src: ['DXMS', 'ĐXMS-2026-0103'], title: 'KHLCNT hệ thống mô phỏng mạng lõi 5G', st: 'CHECK', level: 'TD', creator: 'Phạm Thị Lan', created: '22/09/2026', updated: '03/10/2026',
      basis: 'Tách theo tính chất kỹ thuật: thiết bị mô phỏng (thị trường có nhiều nhà thầu), bản quyền phần mềm lõi độc quyền, phần tích hợp do Trung tâm Mạng lõi đủ năng lực tự thực hiện.',
      parts: { done: [], na: [{ name: 'Chi phí quản lý, giám sát nội bộ', value: 4.5, why: 'Chi phí của Chủ đầu tư, không hình thành gói thầu' }], pending: [] },
      pkgs: ['GT-2026-0032', 'GT-2026-0035', 'GT-2026-0033'], docs: { bm01: ['0981/TTr-TTMS', '28/09/2026', 'Hoàng Quốc Bình'] },
      checkNok: { 'Hình thức lựa chọn nhà thầu': 'Gói bản quyền phần mềm lõi áp dụng trường hợp đặc biệt cần văn bản chấp thuận chủ trương của TGĐ Tập đoàn (Điều 21).' } },
    { code: 'KHLCNT-2026-0014', src: ['DXMS', 'ĐXMS-2026-0089'], title: 'KHLCNT thiết bị thử nghiệm môi trường', st: 'OK', owner: 'Phạm Thị Lan', creator: 'Bùi Minh Quang', created: '09/09/2026', updated: '24/09/2026', post: ['KH202609-071-00', '25/09/2026'], sap: '1000009871',
      basis: 'Tách 2 gói theo tính chất thị trường: buồng thử nhiệt ẩm (ít nhà thầu, cần đấu thầu) và thiết bị đo rung thông dụng (chào giá trực tuyến).',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0029', 'GT-2026-0030'],
      docs: { bm01: ['0866/TTr-PCL', '12/09/2026', 'Bùi Minh Quang'], bm02: ['0873/BC-TTMS', '17/09/2026', 'Phạm Thị Lan'], bm03: ['0889/QĐ-VHT', '24/09/2026', 'Hoàng Quốc Bình'] } },
    { code: 'KHLCNT-2026-0013', src: ['KDT', 'KĐT-2026-0012'], title: 'KHLCNT hệ thống đo kiểm anten trong buồng vi sóng', st: 'OK', creator: 'Nguyễn Văn Minh', created: '18/07/2026', updated: '04/08/2026', post: ['KH202608-019-00', '05/08/2026'], sap: '1000009644',
      basis: 'Tách theo trình tự thực hiện và năng lực thị trường: hệ thống buồng đo (hãng sản xuất chiến lược, đàm phán trực tiếp), phần mềm đo mở rộng từ gói đã có KQLCNT (mua sắm trực tiếp), hiệu chuẩn giao đơn vị đo lường của Tập đoàn.',
      parts: { done: [{ name: 'Tư vấn lập hồ sơ khoản đầu tư', value: 0.7, legal: 'HĐ 112/2026/HĐTV ngày 02/02/2026' }], na: [],
        pending: [{ name: 'Mở rộng dải đo 110 GHz (giai đoạn 2)', value: 3.5, why: 'Chưa đủ thông số kỹ thuật; lập KHLCNT bổ sung khi có kết quả thử nghiệm giai đoạn 1' }] },
      pkgs: ['GT-2026-0026', 'GT-2026-0027', 'GT-2026-0028'],
      docs: { bm01: ['0598/TTr-TTVT', '22/07/2026', 'Trần Đức Hải'], bm02: ['0611/BC-TTMS', '29/07/2026', 'Phạm Thị Lan'], bm03: ['0632/QĐ-VHT', '04/08/2026', 'Ngô Đình Khôi'] } },
    { code: 'KHLCNT-2026-0011', src: ['DXMS', 'ĐXMS-2026-0072'], title: 'KHLCNT anten mảng pha phục vụ đo kiểm', st: 'OK', creator: 'Nguyễn Văn Minh', created: '12/08/2026', updated: '26/08/2026', law: true, post: ['IB2600118042-00', '27/08/2026'], sap: '1000009752',
      basis: 'Tách 2 gói: anten mảng pha có yêu cầu kỹ thuật đặc thù (chỉ một số nhà thầu chiến lược đáp ứng) và phụ kiện gá lắp phụ thuộc thiết kế anten trúng thầu.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0024', 'GT-2026-0031'],
      docs: { bm01: ['0744/TTr-TTVT', '14/08/2026', 'Trần Đức Hải'], bm02: ['0756/BC-TTMS', '20/08/2026', 'Phạm Thị Lan'], bm03: ['0779/QĐ-VHT', '26/08/2026', 'Ngô Đình Khôi'] } },
    { code: 'KHLCNT-2026-0009', src: ['DXMS', 'ĐXMS-2026-0077'], title: 'KHLCNT dây chuyền lắp ráp bo mạch trạm thu phát', st: 'OK', owner: 'Phạm Thị Lan', creator: 'Phan Văn Lộc', created: '18/08/2026', updated: '30/09/2026', post: ['KH202609-006-00', '03/09/2026'], sap: '1000009790',
      basis: 'Tách theo tính chất kỹ thuật: dây chuyền thiết bị (đấu thầu rộng rãi, hai túi hồ sơ) và dịch vụ lắp đặt, đào tạo (chỉ định thầu, phụ thuộc thiết bị trúng thầu).',
      parts: { done: [{ name: 'Tư vấn khảo sát, lập đề xuất mua sắm', value: 0.4, legal: 'HĐ 067/2026/HĐTV ngày 15/04/2026' }],
        na: [{ name: 'Chi phí quản lý, giám sát nội bộ', value: 1.2, why: 'Chi phí của Chủ đầu tư, không hình thành gói thầu' }],
        pending: [{ name: 'Vật tư dự phòng năm thứ hai', value: 21.2, why: 'Chưa xác định được chủng loại; lập KHLCNT khi dây chuyền vận hành ổn định' }] },
      pkgs: ['GT-2026-0021', 'GT-2026-0022'],
      docs: { bm01: ['0688/TTr-NMSX', '21/08/2026', 'Phan Văn Lộc'], bm02: ['0701/BC-TTMS', '27/08/2026', 'Phạm Thị Lan'], bm03: ['0719/QĐ-VHT', '02/09/2026', 'Ngô Đình Khôi'] },
      versions: [{ v: 'v1', at: '02/09/2026', why: 'Phê duyệt lần đầu', no: '0719/QĐ-VHT' },
        { v: 'v2', at: '30/09/2026', why: 'Điều chỉnh giá gói dây chuyền theo dự toán được duyệt; phần vật tư dự phòng tăng tương ứng', no: '0912/QĐ-VHT' }],
      diff: [['GT-2026-0021 · Giá gói thầu', '198,00 tỷ đồng', '195,00 tỷ đồng'], ['GT-2026-0021 · Cơ sở xác định giá', 'Báo giá của 3 nhà cung cấp', 'Dự toán được duyệt sau KHLCNT (QĐ 0905/QĐ-VHT)'],
        ['Phần chưa đủ điều kiện lập KHLCNT', '18,20 tỷ đồng', '21,20 tỷ đồng']] },
  ];
  /* Gói thầu: st = giai đoạn tổ chức LCNT; giá, hình thức, phương thức, loại HĐ, tiến độ là nội dung bắt buộc của KHLCNT (Điều 22 khoản 2). */
  const PK_ST = { KH: ['Chờ phê duyệt KHLCNT', 'default'], HS: ['Đang lập hồ sơ mời', 'info'], MOI: ['Đang mời thầu', 'info'], DG: ['Đang đánh giá', 'info'],
    TH: ['Đang xử lý tình huống', 'warning'], KQ_CHO: ['Chờ phê duyệt KQLCNT', 'warning'], KQ: ['Đã có KQLCNT', 'success'], HUY: ['Đã huỷ thầu', 'error'] };
  const LV = { KH: 0, HS: 1, MOI: 2, DG: 3, TH: 3, KQ_CHO: 4, KQ: 5, HUY: 3 };
  const PK = [
    { code: 'GT-2026-0021', kh: 'KHLCNT-2026-0009', name: 'Cung cấp dây chuyền lắp ráp bo mạch trạm thu phát', type: 'HH_LD', price: 195.0, priceBasis: 'Dự toán được duyệt sau KHLCNT', est: ['0905/QĐ-VHT', '25/09/2026', 195.0],
      form: 'DTRR', method: '1GD2T', intl: true, online: true, start: 'Quý IV/2026', selTime: '60 ngày', execTime: '240 ngày', contract: 'TRON_GOI', st: 'KQ',
      lots: [['Phần 1: Thiết bị gắn linh kiện SMT', 128.0], ['Phần 2: Thiết bị kiểm tra quang học, X-ray', 67.0]],
      items: [['Máy gắn linh kiện tốc độ cao', 'Máy', 4], ['Lò hàn đối lưu 10 vùng nhiệt', 'Máy', 2], ['Máy kiểm tra quang học tự động (AOI)', 'Máy', 2], ['Máy kiểm tra X-ray 3D', 'Máy', 1]],
      bidders: [['NCC-000003', 186.4, 'Đạt', 'Đạt', 88, 'Thương thảo không thành công: không chấp nhận tiến độ giao hàng 240 ngày'], ['NCC-000009', 191.2, 'Đạt', 'Đạt', 85], ['NCC-000002', 152.0, 'Đạt', 'Không đạt', 61], ['NCC-000008', 199.8, 'Đạt', 'Đạt', 82]],
      winner: 'NCC-000009', kq: ['0961/QĐ-VHT', '05/10/2026'],
      events: [['Thương thảo', '22/09/2026', 'Thương thảo không thành công với nhà thầu xếp hạng thứ nhất (Gamma Technologies) — mời nhà thầu xếp hạng thứ hai (Iota Electronics) vào thương thảo (Điều 36).', 'Đã xử lý'],
        ['Kiến nghị về KQLCNT', '07/10/2026', 'Công ty Cổ phần Thiết bị Beta kiến nghị về việc đánh giá kỹ thuật không đạt.', 'Đang giải quyết'],
        ['Tạm dừng ký hợp đồng', '07/10/2026', 'Người có thẩm quyền tạm dừng ký hợp đồng đến khi có văn bản giải quyết kiến nghị (Điều 38).', 'Đang hiệu lực']] },
    { code: 'GT-2026-0022', kh: 'KHLCNT-2026-0009', name: 'Dịch vụ lắp đặt, đào tạo vận hành dây chuyền lắp ráp', type: 'PTV', price: 18.6, priceBasis: 'Báo giá', form: 'CDT_TT', method: '1GD1T',
      intl: false, online: false, start: 'Quý IV/2026', selTime: '30 ngày', execTime: '90 ngày', contract: 'TRON_GOI', st: 'DG',
      items: [['Lắp đặt, căn chỉnh dây chuyền', 'Gói', 1], ['Đào tạo vận hành, bảo trì', 'Khoá', 3]], bidders: [['NCC-000011', 18.1, 'Đạt', 'Đạt', null]] },
    { code: 'GT-2026-0024', kh: 'KHLCNT-2026-0011', secret: true, hdTime: '150 ngày', name: 'Cung cấp anten mảng pha băng Ka phục vụ đo kiểm', type: 'MS_HH', price: 148.5, priceBasis: 'Báo giá và giá niêm yết của hãng', form: 'DTHC', method: '1GD1T',
      intl: true, online: true, start: 'Quý III/2026', selTime: '50 ngày', execTime: '180 ngày', contract: 'TRON_GOI', st: 'MOI', short: ['NCC-000003', 'NCC-000008', 'NCC-000009'],
      items: [['Anten mảng pha băng Ka 256 phần tử', 'Bộ', 4], ['Bộ điều khiển chùm tia', 'Bộ', 4]],
      events: [['Kiến nghị trước KQLCNT', '28/09/2026', 'Theta Messtechnik kiến nghị yêu cầu kinh nghiệm 03 hợp đồng tương tự là hạn chế cạnh tranh.', 'Đã giải quyết — giữ nguyên HSMT']] },
    { code: 'GT-2026-0026', kh: 'KHLCNT-2026-0013', name: 'Cung cấp hệ thống buồng đo anten vi sóng', type: 'HH_LD', price: 120.0, priceBasis: 'Giá niêm yết của hãng sản xuất chiến lược', form: 'DPTT', method: '1GD1T',
      intl: true, online: false, start: 'Quý III/2026', selTime: '45 ngày', execTime: '300 ngày', contract: 'TRON_GOI', st: 'KQ_CHO', short: ['NCC-000008', 'NCC-000003'],
      items: [['Buồng đo không phản xạ 18–110 GHz', 'Hệ thống', 1], ['Bàn xoay định vị đa trục', 'Bộ', 1]], bidders: [['NCC-000008', 116.4, 'Đạt', 'Đạt', null], ['NCC-000003', 119.0, 'Đạt', 'Đạt', null]], winner: 'NCC-000008' },
    { code: 'GT-2026-0027', kh: 'KHLCNT-2026-0013', name: 'Mở rộng bản quyền phần mềm điều khiển đo', type: 'PM', price: 12.5, priceBasis: 'KQLCNT gói tương tự GT-2025-0118', form: 'MSTT', method: '1GD1T',
      intl: false, online: false, start: 'Quý III/2026', selTime: '20 ngày', execTime: '30 ngày', contract: 'DG_CD', st: 'KQ', prior: ['GT-2025-0118', '14/11/2025', 'Đơn giá không cao hơn, khối lượng 120% (≤ 150%)'],
      items: [['Bản quyền mô-đun đo trường xa', 'Bản quyền', 6]], bidders: [['NCC-000001', 12.3, 'Đạt', 'Đạt', null]], winner: 'NCC-000001', kq: ['0655/QĐ-VHT', '21/08/2026'] },
    { code: 'GT-2026-0028', kh: 'KHLCNT-2026-0013', name: 'Hiệu chuẩn hệ thống đo sau lắp đặt', type: 'PTV', price: 1.8, priceBasis: 'Đơn giá dịch vụ nội bộ Tập đoàn', form: 'GIAO_NV', method: '1GD1T',
      intl: false, online: false, start: 'Quý I/2027', selTime: '10 ngày', execTime: '30 ngày', contract: 'TRON_GOI', st: 'KQ', assignee: 'Trung tâm Đo lường Viettel', kq: ['0660/QĐ-VHT', '24/08/2026'],
      items: [['Hiệu chuẩn buồng đo, cấp chứng chỉ', 'Gói', 1]] },
    { code: 'GT-2026-0029', kh: 'KHLCNT-2026-0014', name: 'Cung cấp buồng thử nhiệt ẩm', type: 'MS_HH', price: 14.2, priceBasis: 'Báo giá', form: 'DTRR', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '45 ngày', execTime: '120 ngày', contract: 'TRON_GOI', st: 'TH', items: [['Buồng thử nhiệt ẩm 1.000 lít', 'Buồng', 2]], bidders: [['NCC-000004', 13.9, 'Đạt', null, null]],
      events: [['Chỉ có 01 nhà thầu nộp hồ sơ', '02/10/2026', 'Tại thời điểm đóng thầu chỉ có 01 HSDT. Tổ chuyên gia đề xuất gia hạn thời điểm đóng thầu 05 ngày để thu hút thêm nhà thầu (Điều 36).', 'Chờ Chủ đầu tư quyết định']] },
    { code: 'GT-2026-0030', kh: 'KHLCNT-2026-0014', name: 'Cung cấp thiết bị đo rung', type: 'MS_HH', price: 4.5, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '15 ngày', execTime: '60 ngày', contract: 'TRON_GOI', st: 'HUY', items: [['Bộ đo rung 3 trục', 'Bộ', 5]],
      bidders: [['NCC-000004', 4.92, 'Đạt', 'Đạt', null], ['NCC-000001', 5.10, 'Đạt', 'Đạt', null]],
      events: [['Tất cả giá chào vượt giá gói thầu', '30/09/2026', 'Hai HSCG đều có giá vượt giá gói thầu 4,50 tỷ đồng. Chủ đầu tư quyết định huỷ thầu, cập nhật giá gói theo báo giá mới và tổ chức chào giá lại.', 'Đã xử lý'],
        ['Huỷ thầu', '01/10/2026', 'Quyết định huỷ thầu 0931/QĐ-VHT — lý do: tất cả HSCG vượt giá gói thầu (Điều 34).', 'Đã ban hành']] },
    { code: 'GT-2026-0031', kh: 'KHLCNT-2026-0011', name: 'Cung cấp bộ gá lắp, cáp RF cho anten mảng pha', type: 'MS_HH', price: 3.5, priceBasis: 'Báo giá', form: 'CDT_RG', method: '1GD1T', intl: false, online: false,
      start: 'Quý IV/2026', selTime: '15 ngày', execTime: '45 ngày', contract: 'TRON_GOI', st: 'HS', items: [['Bộ gá lắp anten trên tháp đo', 'Bộ', 4], ['Cáp RF tổn hao thấp 40 GHz', 'Sợi', 16]] },
    { code: 'GT-2026-0032', kh: 'KHLCNT-2026-0016', srcs: [['DXMS', 'ĐXMS-2026-0103', 150.0], ['DXMS', 'ĐXMS-2026-0089', 40.0]], name: 'Cung cấp hệ thống mô phỏng mạng lõi 5G', type: 'HH_LD', price: 190.0, priceBasis: 'Báo giá', form: 'DTRR', method: '1GD2T', intl: true, online: true,
      start: 'Quý I/2027', selTime: '60 ngày', execTime: '210 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Hệ thống mô phỏng lưu lượng mạng lõi', 'Hệ thống', 1], ['Máy chủ mô phỏng', 'Máy', 12]] },
    { code: 'GT-2026-0035', kh: 'KHLCNT-2026-0016', cur: 'USD', rate: 25400, name: 'Bản quyền phần mềm lõi mô phỏng giao thức', type: 'PM', price: 6.0, priceBasis: 'Giá niêm yết của hãng (độc quyền)', form: 'DAC_BIET', method: '1GD1T', intl: true, online: false,
      start: 'Quý I/2027', selTime: '30 ngày', execTime: '30 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Bản quyền phần mềm mô phỏng giao thức 5GC', 'Bản quyền', 1]] },
    { code: 'GT-2026-0033', kh: 'KHLCNT-2026-0016', name: 'Tích hợp hệ thống mô phỏng vào phòng lab mạng lõi', type: 'PTV', price: 10.0, priceBasis: 'Dự toán', form: 'TU_TH', method: '1GD1T', intl: false, online: false,
      start: 'Quý II/2027', selTime: '10 ngày', execTime: '90 ngày', contract: 'TRON_GOI', st: 'KH', assignee: 'Trung tâm Mạng lõi', items: [['Tích hợp, kiểm thử hệ thống', 'Gói', 1]] },
    { code: 'GT-2026-0034', kh: 'KHLCNT-2026-0017', name: 'Dịch vụ thuê hạ tầng điện toán đám mây 12 tháng', type: 'PTV', price: 11.2, priceBasis: 'Đơn giá dịch vụ của đơn vị thành viên', form: 'DAT_HANG', method: '1GD1T', intl: false, online: false,
      start: 'Tháng 11/2026', selTime: '15 ngày', execTime: '365 ngày', contract: 'DG_CD', st: 'KH', assignee: 'Viettel IDC (đơn vị thành viên)', items: [['Thuê máy chủ ảo, lưu trữ', 'Tháng', 12]] },
  ];

  /* Trường gói theo form hệ thống cũ (HT-THAU-IMG 7213–7221) — thật là trường eForm MS18.1; mẫu suy từ dữ liệu gói. */
  const FIELD_LB = { HANG_HOA: 'Hàng hóa', XAY_LAP: 'Xây lắp', TU_VAN: 'Tư vấn', PHI_TU_VAN: 'Phi tư vấn', HON_HOP: 'Hỗn hợp' };
  const COST = { MS_HH: 'Chi phí thiết bị', HH_LD: 'Chi phí thiết bị, lắp đặt', PM: 'Chi phí bản quyền phần mềm', PTV: 'Chi phí dịch vụ', TV: 'Chi phí tư vấn', XL: 'Chi phí xây lắp' };
  function pkExtra(g, k) {
    const row = window.Catalog.rows('loai-goi-thau').find((r) => r.code === g.type) || {};
    return { no: `${g.code.slice(-2)}-2026-VHT-K2`, summary: (g.items || []).map((i) => i[0]).join('; '), sign: !['GIAO_NV', 'TU_TH'].includes(g.form),
      cur: g.cur || 'VND', rate: g.rate || 1, field: FIELD_LB[row.field] || '', net: !g.online ? 'Không qua mạng' : k && k.law ? 'Qua mạng đấu thầu quốc gia' : 'Qua mạng Viettel',
      hdTime: g.hdTime || g.execTime, cost: COST[g.type] || 'Chi phí khác', authority: k && levelOf(k) === 'TD' ? 'TGĐ Tập đoàn' : 'TGĐ Tổng Công ty' };
  }
  const OWNER_ORG = 'Tổng Công ty Công nghiệp Công nghệ cao Viettel';

  /* Bản ghi tạo trên prototype + điều chỉnh (localStorage riêng, như E-Form). */
  const KEY = 'dtms-proto-thau';
  let U = { kh: [], adj: {} };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const khAll = () => U.kh.concat(KH0).map((k) => Object.assign({}, k, U.adj[k.code] || {}));
  const khOf = (code) => khAll().find((k) => k.code === code) || null;
  const pkOf = (code) => PK.find((p) => p.code === code) || null;
  const pkgsOf = (k) => (k.pkgs || []).map(pkOf).filter(Boolean);
  /* Tổng các phần công việc (Điều 23 khoản 2 điểm e): a đã thực hiện + b không áp dụng + c thuộc KHLCNT (giá gói) + d chưa đủ điều kiện. */
  function totals(k) {
    const p = k.parts || {}, a = sum((p.done || []).map((x) => x.value)), b = sum((p.na || []).map((x) => x.value)), c = sum(pkgsOf(k).map((g) => g.price)), d = sum((p.pending || []).map((x) => x.value));
    const s = srcInfo(k.src[0], k.src[1]), all = sum([a, b, c, d]);
    return { a, b, c, d, all, approved: s ? s.value : null, diff: s && s.value != null ? Math.round((all - s.value) * 100) / 100 : null, s };
  }
  const khBy = (kind, code) => khAll().filter((k) => k.src[0] === kind && k.src[1] === code);

  /* ---------- Khuôn danh sách dùng chung (profile-list / task-management): ô tìm + Tìm kiếm nâng cao, phân trang ---------- */
  const LST = {};
  const st = (id, empty) => (LST[id] = LST[id] || { kw: '', adv: false, f: empty(), d: empty(), page: 1, size: 10, psOpen: false, empty });
  function listPage(o) {
    const L = st(o.id, o.empty);
    const rows = o.rows().filter((r) => (!L.adv ? !L.kw || norm(o.kwText(r)).includes(norm(L.kw)) : o.match(r, L.f)));
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-tf="${o.id}:${k}" maxlength="255" placeholder="Nhập ${label.toLowerCase()}" value="${esc(L.d[k])}"></div>`;
    const sel = (k, label, opt) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: `tf-${o.id}-${k}`, value: L.d[k], clear: true, searchable: true,
      placeholder: 'Chọn ' + label.toLowerCase(), onChange: (v) => { L.d[k] = v; rerender(); } }, opt))}</div>`;
    const adv = `<form class="adv" data-tadv="${o.id}"><div class="grid3">${o.adv(txt, sel)}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-tl="${o.id}:reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
    const body = rows.slice(from, from + L.size).map((r, i) => `<tr class="click" data-go="${o.href(r)}" data-code="${esc(r.code)}"><td class="ord">${from + i + 1}</td>${o.cell(r)}</tr>`).join('');
    return `<div class="pg">
      ${head({ title: o.title, info: o.info, right: o.right || '' })}
      ${o.top || ''}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="${o.id}-kw" data-tkw="${o.id}" maxlength="255" placeholder="${o.ph}" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-tl="${o.id}:adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? adv : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${o.cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${o.cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: o.id, total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }
  const has = (v, x) => !v || norm(x).includes(norm(v));
  const inSet = (arr, v) => !arr || !arr.length || arr.includes(v);
  const catOpts = (key) => window.Catalog.rows(key).map((r) => ({ value: r.code, label: r.name }));

  /* ---------- SCR-78 Danh sách KHLCNT ---------- */
  const khHref = (k) => 'khlcnt/' + encodeURIComponent(k.code);
  const khRow = (k) => { const t = totals(k), qd = (k.docs || {}).bm03 || []; return Object.assign({}, k, { kind: k.src[0], srcCode: k.src[1], unit: t.s ? t.s.unit : '', n: pkgsOf(k).length, total: t.c,
    qc: qcOf(k), lv: levelOf(k), owner: ownerOf(k), fund: t.s ? t.s.fund : '', qdNo: qd[0], qdDate: qd[1], postDate: (k.post || [])[1] }); };
  const inRange = (d, from, to) => (!from || (d && dkey(d) >= dkey(from))) && (!to || (d && dkey(d) <= dkey(to)));
  function khList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (KHLCNT = đối tượng cha như ĐXMS / KĐT)
    return listPage({
      id: 'khl', title: 'Danh sách kế hoạch lựa chọn nhà thầu', ph: 'Tìm kiếm theo mã, tên KHLCNT, mã đối tượng nguồn',
      right: `<button class="vbtn primary" data-go="khlcnt/create">${icon('add')} Thêm mới</button>`,
      rows: () => khAll().map(khRow), kwText: (k) => `${k.code} ${k.title} ${k.srcCode}`,
      empty: () => ({ code: '', title: '', src: '', kind: [], unit: null, st: [], qc: null, lv: null, fund: null, owner: [], from: '', to: '' }),
      match: (k, f) => has(f.code, k.code) && has(f.title, k.title) && has(f.src, k.srcCode) && inSet(f.kind, k.kind) && (!f.unit || k.unit === f.unit) && inSet(f.st, k.st)
        && (!f.qc || k.qc === f.qc) && (!f.lv || k.lv === f.lv) && (!f.fund || k.fund === f.fund) && inSet(f.owner, k.owner) && inRange(k.qdDate, f.from, f.to),
      adv: (txt, sel) => `${txt('code', 'Mã KHLCNT')}${txt('title', 'Tên KHLCNT')}${txt('src', 'Mã đối tượng nguồn')}
        ${sel('kind', 'Loại đối tượng nguồn', { multi: true, searchable: false, options: [['DXMS', SRC.DXMS], ['KDT', SRC.KDT]].map(([value, label]) => ({ value, label })) })}
        ${sel('unit', 'Đơn vị lập', { options: [...new Set(khAll().map(khRow).map((k) => k.unit))].map((u) => ({ value: u, label: u })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(KH_ST).map(([value, [label]]) => ({ value, label })) })}
        ${sel('qc', 'Quy chế áp dụng', { searchable: false, options: Object.entries(QC).map(([value, label]) => ({ value, label })) })}
        ${sel('lv', 'Cấp phê duyệt', { searchable: false, options: Object.entries(LEVEL).map(([value, label]) => ({ value, label })) })}
        ${sel('fund', 'Nguồn vốn', { options: catOpts('nguon-von') })}
        ${sel('owner', 'Người phụ trách', { multi: true, options: [...new Set(khAll().map(ownerOf))].map((u) => ({ value: u, label: u })) })}
        ${txt('from', 'Ngày QĐ KHLCNT từ')}${txt('to', 'Ngày QĐ KHLCNT đến')}`,
      cols: [['Trạng thái', 190, 'c'], ['Mã KHLCNT', 170], ['Tên KHLCNT', 320], ['Quy chế áp dụng', 170], ['Cấp phê duyệt', 130], ['Người phụ trách', 170], ['Loại đối tượng nguồn', 170], ['Mã đối tượng nguồn', 160], ['Đơn vị lập', 200],
        ['Số QĐ KHLCNT', 140], ['Ngày QĐ KHLCNT', 130], ['Ngày đăng tải KHLCNT', 160], ['Số gói thầu', 100, 'c'], ['Tổng giá gói thầu (tỷ đồng)', 190, 'r'], ['Ngày cập nhật', 130]],
      href: khHref,
      cell: (k) => `<td class="c">${badge(...KH_ST[k.st])}</td><td><a class="link" data-go="${khHref(k)}">${esc(k.code)}</a></td><td>${clamp(k.title)}</td><td>${esc(QC[k.qc])}</td><td>${esc(LEVEL[k.lv])}</td><td>${clamp(k.owner)}</td><td>${esc(SRC[k.kind])}</td>
        <td><a class="link" data-go="${srcHref(k.kind, k.srcCode)}">${esc(k.srcCode)}</a></td><td>${clamp(k.unit)}</td><td>${k.qdNo ? esc(k.qdNo) : dash}</td><td class="num">${k.qdDate ? esc(k.qdDate) : dash}</td><td class="num">${k.postDate ? esc(k.postDate) : dash}</td><td class="c">${k.n}</td><td class="r num">${money(k.total)}</td><td class="num">${esc(k.updated)}</td>`,
      info: {
        scr: 'SCR-78', name: 'Danh sách kế hoạch lựa chọn nhà thầu', uc: 'UC-08-01 · Backlog W1_T10 › Quản lý thầu › KHLCNT (dòng 314–318)', bpmn: 'MS18 Lập KHLCNT (BPMN-MS18, bản nháp — nguồn MS18 duy nhất)',
        notes: [
          'KHLCNT là <b>đối tượng cha</b> như ĐXMS / KĐT (D-12): lập trên cơ sở một ĐXMS / KĐT đã phê duyệt (QC-12869 Điều 22 khoản 1a); Dự án đầu tư chưa có phân hệ. Bố cục task-management.',
          'Trạng thái theo 4 luồng con MS18: Dự thảo (18.1 lập thông tin gói) → Đang trình ký tờ trình (18.2) → Đang kiểm tra (18.3) → Chờ phê duyệt (18.4) → Đã phê duyệt; Đang điều chỉnh khi lập phiên bản mới (không ghi đè bản đã duyệt).',
          'Màn tĩnh (D-17): luồng MS18 chưa chạy trên prototype; dữ liệu mẫu nối với các ĐXMS / KĐT đã phê duyệt.',
          'Không có cột Thao tác (D-43, team BA 30/10/2026: chưa có thao tác trên dòng).',
          'Cột và bộ lọc Quy chế áp dụng, Cấp phê duyệt, Nguồn vốn, Người phụ trách, Số / Ngày QĐ, Ngày đăng tải theo màn KHLCNT của hệ thống cũ (HT-THAU-IMG, T24). Số / Ngày QĐ lấy từ BM-03 đã ký; Ngày đăng tải từ tích hợp đăng tải (bước 59).',
        ],
        q: ['P-76', 'P-110', 'P-115'], src: 'task-management/task-management.component · /task-management',
      },
    });
  }

  /* ---------- SCR-79 Thêm mới KHLCNT ---------- */
  const F = { v: {}, err: {} };
  function resetForm(kind, code) {
    F.err = {};
    const s = kind && code ? srcInfo(kind, code) : null;
    F.v = { title: s ? 'KHLCNT ' + s.title.replace(/^(Mua sắm|Đầu tư|Trang bị)\s+/i, '').replace(/^./, (c) => c.toLowerCase()) : '', kind: kind || 'DXMS', src: s ? code : null, qc: 'MSTX', level: 'TCT', owner: persona(Flow.state.persona).name };
  }
  function khForm() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create)
    const v = F.v, err = F.err, s = v.src ? srcInfo(v.kind, v.src) : null;
    const upd = (k) => (val) => { v[k] = val; delete err[k]; if (k === 'kind') v.src = null; rerender(); };
    const info = {
      scr: 'SCR-79', name: 'Thêm mới kế hoạch lựa chọn nhà thầu', uc: 'Backlog W1_T10 › KHLCNT › Tạo KHLCNT từ DADT/KĐT/ĐXMS; Lấy giá trị được phê duyệt (dòng 317–318)', bpmn: 'MS18 bước 1 "Khởi tạo lập KHLCNT", bước 2 kiểm tra căn cứ, bước 2–4 (mua sắm thường xuyên, Luật Đấu thầu)',
      notes: [
        'Theo task-create (mode create). Lưu = tạo KHLCNT ở trạng thái Dự thảo và khởi tạo MS18 (prototype không chạy luồng, D-17); mở Chi tiết KHLCNT.',
        '<b>Đối tượng nguồn</b> chỉ liệt kê ĐXMS / KĐT đã phê duyệt (MS18 bước 2 "Kiểm tra căn cứ" — chặn ngay ở ô chọn). <b>Giá trị được duyệt</b> và văn bản phê duyệt lấy từ hồ sơ Hoàn thành gần nhất, chỉ xem; tổng giá trị các phần công việc phải khớp giá trị này (Điều 23 khoản 2e).',
        'Mỗi đối tượng nguồn chỉ có một KHLCNT đang hiệu lực; thay đổi sau phê duyệt làm bằng <b>Điều chỉnh KHLCNT</b>.',
        '<b>Quy chế áp dụng</b> (thay hai ô Mua sắm thường xuyên / Áp dụng Luật Đấu thầu, theo hệ thống cũ — T24), không đổi sau khi tạo: Mua sắm thường xuyên → hệ thống kiểm tra nhu cầu 06–12 tháng và nguy cơ chia nhỏ gói (MS18 bước 2, Điều 22 khoản 1b); Theo luật → KHLCNT riêng kèm điều, khoản áp dụng (bước 4, Điều 22 khoản 3).',
        '<b>Cấp phê duyệt</b>, <b>Người phụ trách</b> theo hệ thống cũ; Người phụ trách mặc định là người tạo. Nhánh trình Tập đoàn (Phiếu trình GQCV, nhận xét Ban ĐTXD) chưa có trong BPMN-MS18 — đề xuất DX-05.',
      ],
      q: ['P-115'], src: 'task-management/components/task-create · /task-management/create',
    };
    const opts = approvedSources(v.kind).map((x) => ({ value: x.code, label: `${x.code} - ${x.title}` }));
    return `<form class="pg" data-kh-form>
      ${head({ title: 'Thêm mới kế hoạch lựa chọn nhà thầu', back: 'khlcnt', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="khlcnt">Huỷ</button><button type="submit" class="vbtn primary" id="kh-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung KHLCNT</h3>
        <div class="grid3">
          ${field('Mã KHLCNT', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên KHLCNT', `<input class="vctl" id="kh-title" maxlength="500" placeholder="Nhập tên kế hoạch lựa chọn nhà thầu" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span2' })}
          ${field('Loại đối tượng nguồn', vSelect({ id: 'kh-kind', value: v.kind, options: [{ value: 'DXMS', label: SRC.DXMS }, { value: 'KDT', label: SRC.KDT }, { value: 'DADT', label: SRC.DADT, disabled: true }], onChange: upd('kind') }), { req: true })}
          ${field('Đối tượng nguồn', vSelect({ id: 'kh-src', value: v.src, searchable: true, placeholder: 'Chọn ' + SRC[v.kind].toLowerCase() + ' đã phê duyệt', invalid: !!err.src, options: opts, onChange: upd('src') }), { req: true, err: err.src, cls: 'span2' })}
          ${field('Giá trị được duyệt (tỷ đồng)', `<input class="vctl" id="kh-approved" value="${s ? ty(s.value, 2) : ''}" placeholder="Lấy từ đối tượng nguồn" disabled>`)}
          ${field('Văn bản phê duyệt', `<input class="vctl" value="${esc(s ? s.doc : '')}" placeholder="Lấy từ đối tượng nguồn" disabled>`, { cls: 'span2' })}
          ${field('Đơn vị lập', `<input class="vctl" value="${esc(s ? s.unit : '')}" placeholder="Lấy từ đối tượng nguồn" disabled>`)}
          ${field('Quy chế áp dụng', vSelect({ id: 'kh-qc', value: v.qc, options: Object.entries(QC).map(([value, label]) => ({ value, label })), onChange: upd('qc') }), { req: true })}
          ${field('Cấp phê duyệt', vSelect({ id: 'kh-level', value: v.level, options: Object.entries(LEVEL).map(([value, label]) => ({ value, label })), onChange: upd('level') }), { req: true })}
          ${field('Người phụ trách', vSelect({ id: 'kh-owner', value: v.owner, searchable: true, options: D.personas.filter((x) => !['admin', 'td'].includes(x.id)).map((x) => ({ value: x.name, label: `${x.name} - ${x.unit}` })), onChange: upd('owner') }), { req: true })}
          ${field('Người lập', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section></form>`;
  }
  function saveKh() {
    const t = document.getElementById('kh-title');
    if (t) F.v.title = t.value;
    const v = F.v, err = F.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên KHLCNT.';
    if (!v.src) err.src = 'Bạn cần chọn Đối tượng nguồn.';
    else if (khBy(v.kind, v.src).length) err.src = `Đối tượng nguồn đã có ${khBy(v.kind, v.src)[0].code}. Thay đổi kế hoạch thực hiện bằng Điều chỉnh KHLCNT.`;
    if (Object.keys(err).length) { rerender(); return; }
    const n = Math.max(...khAll().map((k) => Number(k.code.slice(-4)))) + 1;
    const now = Flow.dateOf(Flow.state.clock);
    const code = 'KHLCNT-2026-' + String(n).padStart(4, '0');
    U.kh.unshift({ code, src: [v.kind, v.src], title: v.title.trim(), st: 'DRAFT', creator: persona(Flow.state.persona).name, created: now, updated: now,
      law: v.qc === 'LUAT', level: v.level, owner: v.owner, basis: '', parts: { done: [], na: [], pending: [] }, pkgs: [] });
    persist();
    toast('<b>Thành công</b><br>Thêm mới kế hoạch lựa chọn nhà thầu thành công!');
    location.hash = '#/khlcnt/' + encodeURIComponent(code);
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-kh-form]')) { e.preventDefault(); saveKh(); } });

  /* ---------- Tab chung (app-tabs) ---------- */
  const TB = { key: null, tab: 'info' };
  function tabs(key, list, bodies) {
    if (TB.key !== key || !list.some(([k]) => k === TB.tab)) { TB.key = key; TB.tab = list[0][0]; }
    return `<nav class="tabs dx-tabs" role="tablist">${list.map(([k, l]) => `<button type="button" class="tab ${TB.tab === k ? 'on' : ''}" role="tab" aria-selected="${TB.tab === k}" data-ttab="${k}">${l}</button>`).join('')}</nav>${bodies[TB.tab]()}`;
  }

  /* ---------- SCR-80 Chi tiết KHLCNT ---------- */
  const pkHref = (g) => 'goi-thau/' + encodeURIComponent(g.code);
  const pkLink = (g) => `<a class="link" data-go="${pkHref(g)}">${esc(g.code)}</a>`;
  function khDetail(code) {
    // Theo: task-create (mode detail) + app-tabs, như SCR-29 Chi tiết ĐXMS
    const k = khOf(code);
    if (!k) return `<div class="pg">${head({ title: 'Xem chi tiết kế hoạch lựa chọn nhà thầu', back: 'khlcnt', lg: true })}${emptyCard('Thông tin chung', 'Không tìm thấy kế hoạch lựa chọn nhà thầu.')}</div>`;
    const t = totals(k), gs = pkgsOf(k), s = t.s || {};
    const ok = t.diff === 0;
    const vs = k.versions || (k.st === 'OK' || k.st === 'ADJ' ? [{ v: 'v1', at: (k.docs && k.docs.bm03 || [])[1] || k.updated, why: 'Phê duyệt lần đầu', no: (k.docs && k.docs.bm03 || [])[0] }] : []);
    const curV = vs.length ? vs[vs.length - 1].v : 'v1';
    const info = {
      scr: 'SCR-80', name: 'Chi tiết kế hoạch lựa chọn nhà thầu', uc: 'Backlog W1_T10 › KHLCNT (dòng 316, 319–331)', bpmn: 'MS18.1–18.4 (BPMN-MS18)',
      notes: [
        'Theo task-create (mode detail) + app-tabs như Chi tiết ĐXMS. Các tab chỉ xem — dữ liệu do các bước MS18 ghi (eForm bảng lặp phần công việc / gói thầu ở MS18.1, Tờ trình MS18.2, Báo cáo kiểm tra MS18.3, Quyết định MS18.4).',
        '<b>Phân bổ công việc</b> theo Tờ trình KHLCNT (QC-12869 Điều 23 khoản 2): a) đã thực hiện, b) không áp dụng LCNT, c) thuộc KHLCNT (các gói thầu), d) chưa đủ điều kiện lập KHLCNT; e) tổng a–d phải khớp giá trị được duyệt của đối tượng nguồn — service task MS18 bước 24 / 33 kiểm tra, lệch thì không chuyển bước.',
        '<b>Gói thầu</b>: cơ sở phân chia theo kỹ thuật, trình tự thực hiện, năng lực thị trường (Điều 22 khoản 1c); một gói / nhiều gói theo số dòng gói (biểu mẫu Tập đoàn khác nhau).',
        '<b>Phiên bản & điều chỉnh</b>: KHLCNT đã duyệt không ghi đè; Điều chỉnh tạo phiên bản mới chạy lại MS18 (giá, phạm vi, hình thức thay đổi trước đóng thầu). So sánh trước / sau = DEV-1 như ĐXMS.',
        '<b>Tờ trình KHLCNT</b> (T24, theo tab TTr của hệ thống cũ và BM01.QCLCNT): Tổ thẩm định, giải trình a)–i), văn bản kèm theo, danh mục hạng mục — eForm MS18.2 (bảng lặp + ô nhập), giải trình gợi ý từ dữ liệu gói. Không chép ô soạn HTML tự do và nút Export rời: văn bản sinh ở Văn bản đầu ra của bước.',
        '<b>Kết quả</b>: BM-01 Tờ trình (MS18.2, VOffice), BM-02 Báo cáo kiểm tra (MS18.3 — 16 tiêu chí 3 nhóm theo BM02.QCLCNT của hệ thống cũ, trả lời một phần Q02; kết quả là bảng lặp eForm, không mặc định Đáp ứng), BM-03 Quyết định phê duyệt (MS18.4). Số, ngày văn bản nhận từ VOffice, không nhập lại như tab Checklist cũ. Dòng Đăng tải lấy từ Công khai & tích hợp (bước 59); Mã KHLCNT trên SAP chỉ xem.',
      ],
      q: ['P-76', 'P-116'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id',
    };
    const right = k.st === 'OK' ? `<button type="button" class="vbtn primary" data-kh-adj="${esc(k.code)}">Điều chỉnh KHLCNT</button>` : '';
    const infoCards = card('Thông tin chung KHLCNT', `<div class="ginfo c3">
        ${kv('Mã KHLCNT', esc(k.code))}${kv('Tên KHLCNT', esc(k.title), 'span2')}
        ${kv('Loại đối tượng nguồn', esc(SRC[k.src[0]]))}${kv('Đối tượng nguồn', `<a class="link-red" href="#/${srcHref(k.src[0], k.src[1])}">${esc(k.src[1])}</a> - ${esc(s.title || '')}`, 'span2')}
        ${kv('Đơn vị lập', esc(s.unit))}${kv('Người lập', esc(k.creator))}${kv('Trạng thái', badge(...KH_ST[k.st]))}
        ${kv('Bước hiện tại', esc(KH_STEP[k.st]))}${kv('Phiên bản hiện hành', esc(curV))}${kv('Ngày cập nhật', esc(k.updated))}
        ${kv('Quy chế áp dụng', esc(QC[qcOf(k)]))}${kv('Cấp phê duyệt', esc(LEVEL[levelOf(k)]))}${kv('Người phụ trách', esc(ownerOf(k)))}
        ${kv('Số gói thầu', String(gs.length))}</div>`)
      + card('Kiểm soát giá trị', `<div class="ginfo c3">
        ${kv('Giá trị được duyệt của đối tượng nguồn', t.approved != null ? ty(t.approved, 2) + ' tỷ đồng' : null)}${kv('Văn bản phê duyệt', esc(s.doc), 'span2')}
        ${kv('Tổng giá trị các phần công việc', ty(t.all, 2) + ' tỷ đồng')}${kv('Chênh lệch', t.diff == null ? null : ty(t.diff, 2) + ' tỷ đồng')}
        ${kv('Kết quả đối chiếu', !gs.length && !t.all ? badge('Chưa lập phân bổ', 'default') : ok ? badge('Khớp giá trị được duyệt', 'success') : badge('Lệch giá trị được duyệt', 'error'))}</div>`);
    const partT = (title, rows, cols, cell, total) => card(title, table(cols, rows, cell, rows.length ? `<tfoot><tr><td></td><td colspan="${cols.length - 1}"><b>Cộng</b></td><td class="r num"><b>${ty(total, 2)}</b></td></tr></tfoot>` : ''));
    const p = k.parts || {};
    const phanBo = () => partT('a) Phần công việc đã thực hiện', p.done || [], [['Nội dung công việc', 420], ['Căn cứ pháp lý', 320], ['Giá trị (tỷ đồng)', 160, 'r']],
      (r) => `<td>${clamp(r.name)}</td><td>${clamp(r.legal)}</td><td class="r num">${money(r.value)}</td>`, t.a)
      + partT('b) Phần công việc không áp dụng hình thức lựa chọn nhà thầu', p.na || [], [['Nội dung công việc', 420], ['Lý do', 320], ['Giá trị (tỷ đồng)', 160, 'r']],
        (r) => `<td>${clamp(r.name)}</td><td>${clamp(r.why)}</td><td class="r num">${money(r.value)}</td>`, t.b)
      + partT('c) Phần công việc thuộc KHLCNT', gs, [['Mã gói thầu', 150], ['Tên gói thầu', 420], ['Hình thức LCNT', 200], ['Giá gói thầu (tỷ đồng)', 170, 'r']],
        (g) => `<td>${pkLink(g)}</td><td>${clamp(g.name)}</td><td>${clamp(cat('hinh-thuc-lcnt', g.form))}</td><td class="r num">${money(g.price)}</td>`, t.c)
      + partT('d) Phần công việc chưa đủ điều kiện lập KHLCNT', p.pending || [], [['Nội dung công việc', 420], ['Lý do', 320], ['Giá trị (tỷ đồng)', 160, 'r']],
        (r) => `<td>${clamp(r.name)}</td><td>${clamp(r.why)}</td><td class="r num">${money(r.value)}</td>`, t.d)
      + card('e) Tổng hợp giá trị', table([['Phần công việc', 520], ['Giá trị (tỷ đồng)', 180, 'r']],
        [['a) Đã thực hiện', t.a], ['b) Không áp dụng hình thức LCNT', t.b], ['c) Thuộc KHLCNT', t.c], ['d) Chưa đủ điều kiện lập KHLCNT', t.d]],
        (r) => `<td>${esc(r[0])}</td><td class="r num">${money(r[1])}</td>`,
        `<tfoot><tr><td></td><td><b>Tổng cộng</b> · giá trị được duyệt ${t.approved != null ? ty(t.approved, 2) : '-'}</td><td class="r num"><b>${ty(t.all, 2)}</b></td></tr></tfoot>`));
    const goiWords = inWords(t.c);
    const goi = () => card('Cơ sở phân chia gói thầu', `<div class="ginfo c3">${kv('Hình thức kế hoạch', gs.length > 1 ? 'KHLCNT nhiều gói thầu' : 'KHLCNT một gói thầu')}${kv('Cơ sở phân chia', esc(k.basis), 'span2')}</div>`)
      + card('Danh sách gói thầu', table([['Mã gói thầu', 140], ['Số gói thầu', 190], ['Tên gói thầu', 320], ['Loại gói thầu', 200], ['Giá gói thầu (tỷ đồng)', 170, 'r'], ['Hình thức LCNT', 190], ['Phương thức LCNT', 220],
        ['Loại hợp đồng', 170], ['Thời gian bắt đầu LCNT', 160], ['Thời gian thực hiện HĐ', 170], ['Thời gian thực hiện gói thầu', 190], ['Trạng thái', 200, 'c']], gs,
      (g) => `<td>${pkLink(g)}</td><td>${esc(pkExtra(g, k).no)}</td><td>${clamp(g.name)}</td><td>${clamp(cat('loai-goi-thau', g.type))}</td><td class="r num">${money(g.price)}</td><td>${clamp(cat('hinh-thuc-lcnt', g.form))}</td>
        <td>${clamp(cat('phuong-thuc-lcnt', g.method))}</td><td>${clamp(cat('loai-hop-dong', g.contract))}</td><td>${esc(g.start)}</td><td>${esc(pkExtra(g, k).hdTime)}</td><td>${esc(g.execTime)}</td><td class="c">${badge(...(k.st === 'OK' ? PK_ST[g.st] : PK_ST.KH))}</td>`,
      gs.length ? `<tfoot><tr><td></td><td colspan="4"><b>Tổng</b></td><td class="r num"><b>${ty(t.c, 2)}</b></td><td colspan="7" data-kh-words>${esc(goiWords)}</td></tr></tfoot>` : ''));
    /* Tờ trình KHLCNT (MS18.2): theo tab TTr của hệ thống cũ + BM01.QCLCNT; giá trị gợi ý từ dữ liệu gói, người lập sửa trên eForm. */
    const toTrinh = () => {
      if (!gs.length) return emptyCard('Tờ trình KHLCNT', 'Tờ trình được lập sau khi có thông tin gói thầu.');
      const off = Number(k.code.slice(-2));
      const P = (i) => PEOPLE[(off + i) % PEOPLE.length];
      const team = [[P(0), 'Phó Tổng Giám đốc chuyên trách', 'Tổ trưởng', 'Chỉ đạo chung'], [P(1), 'Trưởng phòng Chiến lược - KHCN', 'Thành viên', 'Kỹ thuật'], [P(2), 'Trưởng phòng Tài chính Kế toán', 'Thành viên', 'Tài chính'],
        [P(3), 'Bộ phận Bảo vệ An ninh', 'Thành viên', 'An ninh chính trị nội bộ'], [P(4), 'Giám đốc Trung tâm Mua sắm', 'Thành viên', 'Pháp lý']];
      const perG = (fn) => gs.map((g) => `${pkExtra(g, k).no}: ${fn(g)}`).join('; ');
      const why = [['a) Cơ sở phân chia các gói thầu', k.basis], ['b) Giá gói thầu', perG((g) => `${ty(g.price, 2)} tỷ đồng — ${g.priceBasis}`)], ['c) Nguồn vốn', cat('nguon-von', s.fund)],
        ['d) Hình thức lựa chọn nhà thầu', perG((g) => `${cat('hinh-thuc-lcnt', g.form)} — ${COND[g.form] || ''}`)], ['đ) Phương thức lựa chọn nhà thầu', perG((g) => cat('phuong-thuc-lcnt', g.method))],
        ['e) Thời gian bắt đầu tổ chức lựa chọn nhà thầu', perG((g) => g.start)], ['g) Thời gian lựa chọn nhà thầu', perG((g) => g.selTime)], ['h) Loại hợp đồng', perG((g) => cat('loai-hop-dong', g.contract))], ['i) Thời gian thực hiện gói thầu', perG((g) => g.execTime)]];
      const attach = [[s.doc || 'Văn bản phê duyệt đối tượng nguồn', 'Bản chụp'], ['Báo giá, cơ sở xác định giá gói thầu', 'Bản chụp'], ['Tờ trình đề xuất / khoản đầu tư đã phê duyệt', 'Bản chụp']];
      const lines = gs.flatMap((g) => (g.items || []).map((i) => [pkExtra(g, k).no, i[0], i[1], i[2]]));
      return card('Thành viên Tổ thẩm định', table([['Họ và tên', 220], ['Chức vụ', 300], ['Vai trò trong Tổ thẩm định', 200], ['Phân công công việc', 240]], team,
          (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td>`))
        + card('Mô tả tóm tắt', `<div class="ginfo c3">${kv('Đối tượng nguồn', esc(`${k.src[1]} - ${s.title || ''}`), 'span2')}${kv('Giá trị được duyệt', t.approved != null ? ty(t.approved, 2) + ' tỷ đồng' : null)}
          ${kv('Nhiệm vụ / Đề tài, dự án', s.nvText ? esc(s.nvText) : null, 'span2')}${kv('Đơn vị đề xuất', esc(s.unit))}</div>`)
        + card('Giải trình nội dung KHLCNT', table([['Nội dung', 320], ['Giải trình', 760]], why, (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td>`))
        + card('Văn bản kèm theo', table([['Nội dung', 620], ['Ghi chú', 160]], attach, (r) => `<td>${clamp(r[0])}</td><td>${esc(r[1])}</td>`))
        + card('Chi tiết danh mục mua sắm thuộc gói thầu', table([['Số gói thầu', 200], ['Hạng mục', 460], ['Đơn vị tính', 130], ['Khối lượng', 110, 'r']], lines,
          (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td class="r num">${ty(r[3], 0)}</td>`));
    };
    const phienBan = () => {
      if (!vs.length) return emptyCard('Lịch sử phiên bản', 'KHLCNT chưa được phê duyệt. Phiên bản đầu được ghi nhận khi có Quyết định phê duyệt KHLCNT.');
      const rows = vs.map((x, i) => Object.assign({ cur: i === vs.length - 1 && k.st !== 'ADJ' }, x)).concat(k.st === 'ADJ' ? [{ v: 'v' + (vs.length + 1), at: k.updated, why: k.adjWhy, no: '', draft: true }] : []);
      return card('Lịch sử phiên bản KHLCNT', table([['Phiên bản', 110], ['Ngày', 130], ['Nội dung', 420], ['Quyết định', 170], ['Trạng thái', 170, 'c']], rows.reverse(),
        (x) => `<td>${esc(x.v)}</td><td class="num">${esc(x.at)}</td><td>${clamp(x.why)}</td><td>${x.no ? esc(x.no) : dash}</td><td class="c">${x.draft ? badge('Đang điều chỉnh', 'warning') : x.cur ? badge('Hiện hành', 'success') : badge('Đã thay thế', 'default')}</td>`), `Phiên bản hiện hành: ${esc(curV)}`)
        + (k.diff ? card('So sánh KHLCNT trước / sau điều chỉnh', table([['Nội dung', 300], ['Trước điều chỉnh (v1)', 360], ['Sau điều chỉnh (v2)', 360]], k.diff,
          (d) => `<td>${clamp(d[0])}</td><td><span class="diff-old">${esc(d[1])}</span></td><td><span class="diff-new">${esc(d[2])}</span></td>`), 'Chỉ liệt kê nội dung thay đổi') : '');
    };
    const ketQua = () => {
      const d = k.docs || {};
      const rows = [['Tờ trình xin phê duyệt KHLCNT (BM-01)', d.bm01, 'MS18.2'], ['Báo cáo kiểm tra KHLCNT (BM-02)', d.bm02, 'MS18.3'], ['Quyết định phê duyệt KHLCNT (BM-03)', d.bm03, 'MS18.4']];
      const docT = card('Văn bản của KHLCNT', table([['Văn bản', 320], ['Bước', 100], ['Số văn bản', 180], ['Ngày văn bản', 120], ['Người ký', 200], ['Trạng thái', 160, 'c'], ['Tệp', 80, 'c']], rows,
        (r) => `<td>${esc(r[0])}</td><td>${esc(r[2])}</td><td>${r[1] ? esc(r[1][0]) : dash}</td><td class="num">${r[1] ? esc(r[1][1]) : dash}</td><td>${r[1] ? esc(r[1][2]) : dash}</td>
          <td class="c">${r[1] ? badge('Đã ký', 'success') : badge('Chưa có', 'default')}</td><td class="c">${r[1] ? `<button type="button" class="vbtn icon ghost" aria-label="Tải xuống" data-dl="${esc(r[1][0].replace(/\//g, '-'))}.pdf">${icon('download')}</button>` : dash}</td>`,
        `<tbody data-kh-ext><tr><td class="ord">4</td><td>Đăng tải KHLCNT</td><td>MS18.4</td><td>${k.post ? esc(k.post[0]) : dash}</td><td class="num">${k.post ? esc(k.post[1]) : dash}</td><td>${dash}</td><td class="c">${k.post ? badge('Đã đăng tải', 'success') : badge('Chưa có', 'default')}</td><td class="c">${dash}</td></tr>
          <tr><td class="ord">5</td><td>Mã KHLCNT trên SAP</td><td>${dash}</td><td>${k.sap ? esc(k.sap) : dash}</td><td>${dash}</td><td>${dash}</td><td class="c">${k.sap ? badge('Đã đồng bộ', 'success') : badge('Chưa có', 'default')}</td><td class="c">${dash}</td></tr></tbody>`));
      /* BM02.QCLCNT: 16 tiêu chí, 3 nhóm (Đáp ứng / Không đáp ứng). */
      const CRIT = [['Căn cứ pháp lý', ['Đầy đủ hồ sơ', 'Phù hợp căn cứ', 'Tuân thủ cấu trúc và biểu mẫu', 'Chính xác thông tin']],
        ['Phần công việc không thuộc KHLCNT', ['Phần công việc đã thực hiện', 'Phần công việc không áp dụng được hình thức lựa chọn nhà thầu', 'Phần công việc chưa đủ điều kiện lập KHLCNT']],
        ['Phần công việc thuộc KHLCNT', ['Phân chia gói thầu', 'Tên gói thầu', 'Giá gói thầu', 'Hình thức lựa chọn nhà thầu', 'Phương thức lựa chọn nhà thầu', 'Thời gian tổ chức lựa chọn nhà thầu', 'Thời gian bắt đầu tổ chức lựa chọn nhà thầu', 'Loại hợp đồng', 'Thời gian thực hiện gói thầu']]];
      const nok = k.checkNok || {};
      const chk = d.bm02 || k.checkNok ? CRIT.flatMap(([grp, list]) => list.map((c) => [grp, c, nok[c]])) : [];
      return docT + card('Kết quả kiểm tra KHLCNT', table([['Nhóm', 280], ['Tiêu chí', 360], ['Kết quả', 140, 'c'], ['Nội dung không đáp ứng / gợi ý sửa', 420]], chk,
        (c) => `<td>${clamp(c[0])}</td><td>${clamp(c[1])}</td><td class="c">${c[2] ? badge('Không đáp ứng', 'error') : badge('Đáp ứng', 'success')}</td><td>${clamp(c[2])}</td>`), 'Theo BM02.QCLCNT — 16 tiêu chí (MS18 bước 32–33)');
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết kế hoạch lựa chọn nhà thầu', back: 'khlcnt', lg: true, info, right })}
      ${tabs('kh:' + k.code, [['info', 'Thông tin chung'], ['phan-bo', 'Phân bổ công việc'], ['goi', 'Gói thầu'], ['to-trinh', 'Tờ trình KHLCNT'], ['phien-ban', 'Phiên bản & điều chỉnh'], ['ket-qua', 'Kết quả KHLCNT']],
        { info: () => infoCards, 'phan-bo': phanBo, goi, 'to-trinh': toTrinh, 'phien-ban': phienBan, 'ket-qua': ketQua })}</div>`;
  }
  /* Điều chỉnh KHLCNT: lý do bắt buộc → phiên bản mới ở trạng thái Đang điều chỉnh (chạy lại MS18), bản đã duyệt giữ nguyên. */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-kh-adj]');
    if (!b) return;
    const code = b.dataset.khAdj;
    const m = modal(`<div class="modal-h"><h3>Điều chỉnh kế hoạch lựa chọn nhà thầu</h3></div><div class="modal-b">
      <div class="vfield"><div class="lr"><label>Lý do điều chỉnh</label><span class="req" aria-hidden="true">*</span></div><textarea class="vctl ta" id="adj-why" maxlength="1000" placeholder="Nhập lý do điều chỉnh (giá, phạm vi, hình thức lựa chọn nhà thầu…)"></textarea><p class="msg" id="adj-err" role="alert" hidden>Bạn cần nhập Lý do điều chỉnh.</p></div></div>
      <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="adj-ok">Xác nhận</button></div>`);
    m.el.querySelector('#adj-ok').onclick = () => {
      const why = m.el.querySelector('#adj-why').value.trim();
      if (!why) { m.el.querySelector('#adj-err').hidden = false; m.el.querySelector('.vfield').classList.add('invalid'); return; }
      U.adj[code] = { st: 'ADJ', adjWhy: why, updated: Flow.dateOf(Flow.state.clock) };
      persist(); m.close();
      toast('<b>Thành công</b><br>Đã tạo phiên bản điều chỉnh KHLCNT.');
      rerender();
    };
  });


  /* ---------- SCR-81 Danh sách gói thầu ---------- */
  const pkRow = (g) => { const k = khOf(g.kh); return Object.assign({}, g, { stx: k && k.st === 'OK' ? g.st : 'KH', unit: k ? (totals(k).s || {}).unit : '' }); };
  function pkList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
    return listPage({
      id: 'gtl', title: 'Danh sách gói thầu', ph: 'Tìm kiếm theo mã, tên gói thầu, mã KHLCNT',
      rows: () => PK.map(pkRow), kwText: (g) => `${g.code} ${g.name} ${g.kh}`,
      empty: () => ({ code: '', name: '', kh: '', type: null, form: [], method: null, st: [] }),
      match: (g, f) => has(f.code, g.code) && has(f.name, g.name) && has(f.kh, g.kh) && (!f.type || g.type === f.type) && inSet(f.form, g.form) && (!f.method || g.method === f.method) && inSet(f.st, g.stx),
      adv: (txt, sel) => `${txt('code', 'Mã gói thầu')}${txt('name', 'Tên gói thầu')}${txt('kh', 'Mã KHLCNT')}
        ${sel('type', 'Loại gói thầu', { options: catOpts('loai-goi-thau') })}${sel('form', 'Hình thức LCNT', { multi: true, options: catOpts('hinh-thuc-lcnt') })}
        ${sel('method', 'Phương thức LCNT', { searchable: false, options: catOpts('phuong-thuc-lcnt') })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(PK_ST).map(([value, [label]]) => ({ value, label })) })}`,
      cols: [['Trạng thái', 200, 'c'], ['Mã gói thầu', 150], ['Tên gói thầu', 320], ['Mã KHLCNT', 170], ['Loại gói thầu', 200], ['Giá gói thầu (tỷ đồng)', 170, 'r'],
        ['Hình thức LCNT', 190], ['Phương thức LCNT', 210], ['Thời gian bắt đầu LCNT', 160], ['Đơn vị', 200]],
      href: pkHref,
      cell: (g) => `<td class="c">${badge(...PK_ST[g.stx])}</td><td>${pkLink(g)}</td><td>${clamp(g.name)}</td><td><a class="link" data-go="khlcnt/${encodeURIComponent(g.kh)}">${esc(g.kh)}</a></td>
        <td>${clamp(cat('loai-goi-thau', g.type))}</td><td class="r num">${money(g.price)}</td><td>${clamp(cat('hinh-thuc-lcnt', g.form))}</td><td>${clamp(cat('phuong-thuc-lcnt', g.method))}</td>
        <td>${esc(g.start)}</td><td>${clamp(g.unit)}</td>`,
      info: {
        scr: 'SCR-81', name: 'Danh sách gói thầu', uc: 'Backlog W1_T10 › Quản lý gói thầu › Tra cứu gói thầu (dòng 334–335)',
        notes: [
          'Khuôn profile-list. Gói thầu là dòng gói của KHLCNT (tạo ở MS18.1, không thêm mới ở đây); trạng thái theo giai đoạn tổ chức LCNT. Gói của KHLCNT chưa phê duyệt hiện "Chờ phê duyệt KHLCNT".',
          'Trạng thái: Đang lập hồ sơ mời → Đang mời thầu → Đang đánh giá / Đang xử lý tình huống → Chờ phê duyệt KQLCNT → Đã có KQLCNT; Đã huỷ thầu. Luồng tổ chức LCNT (MS19) chưa có BPMN — P-77.',
        ],
        q: ['P-77'], src: 'profile-management/profile-list · /khcn-profile-management',
      },
    });
  }

  /* ---------- SCR-82 Chi tiết gói thầu ---------- */
  /* Trình tự theo hình thức (QC-12869 Điều 12–21); lv = giai đoạn gói đạt tới khi bước hoàn thành. */
  const STEPS = {
    DTRR: [['Lập, thẩm định, phê duyệt HSMT', 1], ['Phát hành, sửa đổi, làm rõ HSMT; tiếp nhận HSDT', 2], ['Mở thầu, đánh giá HSDT', 3], ['Thương thảo hợp đồng', 4], ['Thẩm định, phê duyệt, công khai KQLCNT', 5]],
    DTRR2: [['Lập, thẩm định, phê duyệt HSMT', 1], ['Phát hành, sửa đổi, làm rõ HSMT; tiếp nhận HSDT', 2], ['Mở thầu, đánh giá HSĐXKT', 3], ['Phê duyệt danh sách nhà thầu đáp ứng kỹ thuật', 3],
      ['Mở thầu, đánh giá HSĐXTC', 3], ['Thương thảo hợp đồng', 4], ['Thẩm định, phê duyệt, công khai KQLCNT', 5]],
    DTHC: [['Phê duyệt danh sách ngắn (tối thiểu 03 nhà thầu)', 1], ['Lập, thẩm định, phê duyệt HSMT', 1], ['Phát hành HSMT cho danh sách ngắn; tiếp nhận HSDT', 2], ['Mở thầu, đánh giá HSDT', 3], ['Thương thảo hợp đồng', 4], ['Thẩm định, phê duyệt, công khai KQLCNT', 5]],
    CGTT: [['Lập HSMCG (giá thấp nhất, không bảo đảm dự thầu)', 1], ['Đăng tải, chào giá trên Cổng đấu thầu Viettel', 2], ['Đánh giá HSCG, xếp hạng theo giá', 3], ['Phê duyệt, công khai KQLCNT', 5]],
    MSTT: [['Kiểm tra điều kiện: KQLCNT cũ trong 12 tháng, khối lượng ≤ 150%, đơn giá không cao hơn', 1], ['Lập HSYC gửi nhà thầu đã trúng thầu', 1], ['Đánh giá HSĐX, thương thảo', 3], ['Phê duyệt, công khai KQLCNT', 5]],
    CDT_TT: [['Lập, phê duyệt HSYC', 1], ['Phát hành HSYC cho nhà thầu được đề nghị', 2], ['Đánh giá HSĐX', 3], ['Thương thảo hợp đồng', 4], ['Phê duyệt, công khai KQLCNT', 5]],
    CDT_RG: [['Chuẩn bị, gửi dự thảo hợp đồng', 1], ['Thương thảo, hoàn thiện hợp đồng', 3], ['Phê duyệt, công khai KQLCNT', 5]],
    DPTT: [['Lập danh sách nhà thầu / hãng, đoàn đàm phán, phương án đàm phán', 1], ['Phê duyệt phương án đàm phán', 2], ['Tổ chức đàm phán', 3], ['Phê duyệt KQLCNT', 5]],
    DAT_HANG: [['Lập phương án đặt hàng', 1], ['Phê duyệt phương án, gửi đơn vị nhận đặt hàng', 2], ['Ký hợp đồng đặt hàng', 5]],
    GIAO_NV: [['Lập phương án giao nhiệm vụ', 1], ['Phê duyệt, ban hành văn bản giao nhiệm vụ', 5]],
    TU_TH: [['Kiểm tra điều kiện tự thực hiện (năng lực, giới hạn chuyển giao công việc)', 1], ['Phê duyệt phương án tự thực hiện', 2], ['Giao đơn vị thực hiện', 5]],
    DAC_BIET: [['Chấp thuận chủ trương áp dụng trường hợp đặc biệt (TGĐ Tập đoàn)', 1], ['Phê duyệt phương án lựa chọn nhà thầu', 2], ['Tổ chức thực hiện theo phương án', 3], ['Phê duyệt KQLCNT', 5]],
  };
  const COND = {
    DTRR: 'Không hạn chế số lượng nhà thầu (Điều 12).', DTHC: 'Gói có yêu cầu cao hoặc đặc thù về kỹ thuật, hoặc chọn trong danh sách Nhà thầu chiến lược; danh sách ngắn tối thiểu 03 nhà thầu (Điều 13).',
    CGTT: 'Giá gói không quá 05 tỷ đồng; hàng hoá thông dụng, sẵn có, dịch vụ phi tư vấn, xây lắp / hỗn hợp đơn giản (Điều 14).',
    MSTT: 'Có KQLCNT gói tương tự trong 12 tháng; khối lượng không quá 150% hạng mục tương ứng; đơn giá không cao hơn (Điều 15).',
    CDT_TT: 'Thuộc trường hợp chỉ định thầu (Điều 16); có HSYC, HSĐX, đánh giá và thương thảo.', CDT_RG: 'Thuộc trường hợp chỉ định thầu theo trình tự rút gọn (Điều 16 khoản 3).',
    DPTT: 'Có danh sách nhà thầu / hãng sản xuất chiến lược, đoàn đàm phán và phương án đàm phán được duyệt (Điều 17).',
    DAT_HANG: 'Giữa Đơn vị phụ thuộc và Đơn vị thành viên theo điều kiện của Quy chế (Điều 18).', GIAO_NV: 'Nguyên tắc, trình tự tương tự Đặt hàng (Điều 19).',
    TU_TH: 'Đơn vị có năng lực; không chuyển giao công việc vượt giới hạn của Quy chế (Điều 20).',
    DAC_BIET: 'Không áp dụng được các hình thức khác; lưu lý do, căn cứ và phương án được chấp thuận (Điều 21).',
  };
  const DOCK = { DTRR: 'HSMT', DTHC: 'HSMT', CGTT: 'HSMCG', MSTT: 'HSYC', CDT_TT: 'HSYC', CDT_RG: 'Dự thảo hợp đồng', DPTT: 'Phương án đàm phán' };
  const PEOPLE = ['Nguyễn Hữu Nam', 'Trần Thị Ngọc', 'Lê Quang Vinh', 'Phạm Thu Hương', 'Đỗ Văn Khánh', 'Vũ Minh Châu', 'Hồ Thanh Tâm'];
  function pkDetail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-detail/profile-detail.component.html + app-tabs
    const g0 = pkOf(code);
    if (!g0) return `<div class="pg">${head({ title: 'Xem chi tiết gói thầu', back: 'goi-thau', lg: true })}${emptyCard('Thông tin chung', 'Không tìm thấy gói thầu.')}</div>`;
    const g = pkRow(g0), k = khOf(g.kh) || {}, lv = LV[g.stx], s = totals(k).s || {};
    const steps = STEPS[g.form === 'DTRR' && g.method === '1GD2T' ? 'DTRR2' : g.form] || [];
    const docKind = DOCK[g.form];
    const hasBid = !!docKind && !['DAT_HANG', 'GIAO_NV', 'TU_TH'].includes(g.form);
    const info = {
      scr: 'SCR-82', name: 'Chi tiết gói thầu', uc: 'Backlog W1_T10 › Quản lý gói thầu, Lựa chọn nhà thầu, Hồ sơ LCNT, Tổ chức LCNT, Đánh giá & KQLCNT, Tình huống & Kiến nghị (dòng 336–402)',
      bpmn: 'MS18.1 (thông tin gói); tổ chức LCNT MS19 — chưa có BPMN',
      notes: [
        'Màn tổng hợp xuyên suốt từ KHLCNT đến KQLCNT (Backlog dòng 336). Khuôn profile-detail + app-tabs; các tab chỉ xem.',
        'Trường theo form Cập nhật gói thầu của hệ thống cũ (HT-THAU-IMG 7213–7221, T24): Số gói thầu, Tóm tắt công việc, Ký hợp đồng, Mật, Người phụ trách, Tiền tệ + tỷ giá, Phạm vi chia phần, Đơn vị sử dụng / giám sát, Sơ tuyển, qua mạng, Danh sách ngắn, Lĩnh vực, Thời gian thực hiện HĐ, Chủ đầu tư / Bên mời thầu / Người có thẩm quyền — trường eForm MS18.1. Trạng thái do quy trình cập nhật, không chọn tay như hệ thống cũ. <b>Nguồn gói thầu</b> n-n có Giá trị phân bổ; TTr kinh phí của hệ thống cũ tương ứng ĐXMS / KĐT.',
        '<b>Thông tin chung</b>: nội dung bắt buộc của KHLCNT (Điều 22 khoản 2) — loại gói (DMDC Loại gói thầu), nguồn 1..n ĐXMS / KĐT, phạm vi + chia phần, giá gói + cơ sở xác định giá + giá từng phần, dự toán được duyệt sau KHLCNT thay giá gói, nguồn vốn, tiến độ, loại hợp đồng.',
        '<b>Phương án LCNT</b>: hình thức (DMDC Hình thức LCNT, 11 dòng) là khoá chọn <b>quy trình Camunda</b> tổ chức LCNT — mỗi hình thức một trình tự (Điều 12–21); điều kiện áp dụng do service task MS18 bước 11 kiểm tra.',
        '<b>Thành phần tham gia</b>: Tổ chuyên gia, Tổ thẩm định và vai trò; kiểm tra xung đột vai trò (đề xuất – thẩm định – phê duyệt độc lập) = validate khi lưu thành phần; danh sách ngắn ≥ 03 nhà thầu với đấu thầu hạn chế.',
        '<b>Hồ sơ mời</b>: loại hồ sơ theo hình thức (HSMT / HSYC / HSMCG); bảo đảm dự thầu ≤ 3% giá gói (Điều 27) = validate; phiên bản khi sửa đổi sau phát hành. <b>Đánh giá & KQLCNT</b>: kết quả theo nhà thầu là bảng lặp eForm của Tổ chuyên gia; cảnh báo giá thấp bất thường theo ngưỡng cấu hình (P-79).',
        '<b>Tình huống & kiến nghị</b>: huỷ thầu (Điều 34), tình huống (Điều 36), kiến nghị (Điều 37–38), tạm dừng ký hợp đồng. KQLCNT chuyển sang Quản lý hợp đồng bằng nút Tạo hợp đồng (phân hệ dựng ở B3).',
      ],
      q: ['P-77', 'P-78', 'P-79', 'P-114'], src: 'profile-management/profile-detail · /khcn-profile-management/:id/view',
    };
    /* KQLCNT → Quản lý hợp đồng (T16 B3): gói đã có hợp đồng thì mở hợp đồng; tạm dừng ký thì không tạo. */
    const hd = window.HopDong && window.HopDong.byPkg(g.code);
    const right = hd ? `<button type="button" class="vbtn secondary" data-go="hop-dong/${encodeURIComponent(hd.code)}">Xem hợp đồng</button>`
      : g.stx === 'KQ' && hasBid && !(g.events || []).some((e) => /Tạm dừng/.test(e[0]) && /hiệu lực/.test(e[3])) ? `<button type="button" class="vbtn primary" data-go="hop-dong/create/${encodeURIComponent(g.code)}">Tạo hợp đồng</button>` : '';
    const srcs = (g0.srcs || [[k.src ? k.src[0] : 'DXMS', k.src ? k.src[1] : '', g.price]]);
    const x = pkExtra(g0, k);
    const tInfo = () => card('Thông tin chung gói thầu', `<div class="ginfo c3">
        ${kv('Mã gói thầu', esc(g.code))}${kv('Tên gói thầu', esc(g.name), 'span2')}
        ${kv('Số gói thầu', esc(x.no))}${kv('Ký hợp đồng', x.sign ? 'Có' : 'Không')}${kv('Mật', g.secret ? 'Mật' : 'Không mật')}
        ${kv('Lĩnh vực', esc(x.field))}${kv('Người phụ trách', esc(ownerOf(k)))}${kv('Đơn vị sử dụng', esc(s.unit))}
        ${kv('Đơn vị giám sát', 'Trung tâm Mua sắm')}${kv('Chủ đầu tư', OWNER_ORG)}${kv('Bên mời thầu', OWNER_ORG)}
        ${kv('Người có thẩm quyền', esc(x.authority))}${kv('Tóm tắt công việc chính', esc(x.summary), 'span2')}
        ${kv('Loại gói thầu', esc(cat('loai-goi-thau', g.type)))}${kv('KHLCNT', `<a class="link-red" href="#/khlcnt/${encodeURIComponent(g.kh)}">${esc(g.kh)}</a>`)}${kv('Trạng thái', badge(...PK_ST[g.stx]))}
        ${kv('Loại hợp đồng dự kiến', esc(cat('loai-hop-dong', g.contract)))}${kv('Nguồn vốn', esc(cat('nguon-von', s.fund)))}${kv('Đơn vị', esc(s.unit))}</div>`)
      + card('Nguồn gói thầu', table([['Loại đối tượng', 170], ['Mã', 160], ['Tên', 340], ['Nhiệm vụ / Đề tài, dự án', 280], ['Nguồn vốn', 200], ['Khoản mục chi phí', 200], ['Giá trị phân bổ (tỷ đồng)', 180, 'r']], srcs,
        (r) => { const o = srcInfo(r[0], r[1]) || {}; return `<td>${esc(SRC[r[0]])}</td><td><a class="link" data-go="${srcHref(r[0], r[1])}">${esc(r[1])}</a></td><td>${clamp(o.title)}</td><td>${clamp(o.nvText)}</td><td>${clamp(cat('nguon-von', o.fund))}</td><td>${esc(x.cost)}</td><td class="r num">${money(r[2])}</td>`; },
        `<tfoot><tr><td></td><td colspan="6"><b>Tổng</b></td><td class="r num"><b>${ty(sum(srcs.map((r) => r[2])), 2)}</b></td></tr></tfoot>`))
      + card('Phạm vi gói thầu', table([['Hàng hoá / dịch vụ / công việc', 460], ['Đơn vị tính', 140], ['Khối lượng', 120, 'r']], g.items || [],
        (r) => `<td>${clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${ty(r[2], 0)}</td>`), g.lots ? `Có chia phần · ${g.lots.length} phần` : 'Không chia phần')
      + card('Giá gói thầu', `<div class="ginfo c3">${kv('Giá gói thầu', ty(g.price, 2) + ' tỷ đồng')}${kv('Đơn vị tiền tệ', esc(x.cur))}${kv('Tỷ giá', x.cur === 'VND' ? '1' : Number(x.rate).toLocaleString('vi-VN'))}
        ${kv('Cơ sở xác định giá', esc(g.priceBasis), 'span3')}
        ${kv('Dự toán được duyệt sau KHLCNT', g.est ? `${esc(g.est[0])} ngày ${esc(g.est[1])} · ${ty(g.est[2], 2)} tỷ đồng (thay giá gói thầu)` : null, 'span3')}</div>`
        + (g.lots ? table([['Phần', 460], ['Giá từng phần (tỷ đồng)', 200, 'r']], g.lots, (r) => `<td>${esc(r[0])}</td><td class="r num">${money(r[1])}</td>`) : ''))
      + card('Tiến độ', `<div class="ginfo c3">${kv('Thời gian bắt đầu tổ chức LCNT', esc(g.start))}${kv('Thời gian lựa chọn nhà thầu', esc(g.selTime))}${kv('Thời gian thực hiện gói thầu', esc(g.execTime))}
        ${kv('Thời gian thực hiện hợp đồng theo KHLCNT', esc(x.hdTime))}</div>`);
    const tPa = () => card('Phương án lựa chọn nhà thầu', `<div class="ginfo c3">
        ${kv('Hình thức lựa chọn nhà thầu', esc(cat('hinh-thuc-lcnt', g.form)))}${kv('Phương thức lựa chọn nhà thầu', esc(cat('phuong-thuc-lcnt', g.method)))}${kv('Phạm vi', g.intl ? 'Quốc tế' : 'Trong nước')}
        ${kv('Sơ tuyển', 'Không sơ tuyển')}${kv('Lựa chọn nhà thầu qua mạng', esc(x.net))}${kv('Áp dụng danh sách ngắn', g.short ? 'Có' : 'Không')}
        ${kv('Mua sắm tập trung', g.central ? esc(g.central) : 'Không')}${kv('Đơn vị thực hiện', g.assignee ? esc(g.assignee) : null)}
        ${kv('Điều kiện áp dụng', esc(COND[g.form]), 'span2')}${kv('Kết quả kiểm tra theo Quy chế', lv > 0 || k.st === 'OK' ? badge('Phù hợp', 'success') : g.form === 'DAC_BIET' ? badge('Chờ chấp thuận chủ trương', 'warning') : badge('Phù hợp', 'success'))}</div>`)
      + card('Trình tự thực hiện', table([['Bước', 520], ['Trạng thái', 170, 'c']], steps,
        (r, i) => { const done = g.stx === 'KQ' || lv > r[1];
          const cur = !done && !['KH', 'HUY'].includes(g.stx) && steps.slice(0, i).every((p) => lv > p[1]);
          return `<td>${esc(r[0])}</td><td class="c">${done ? badge('Hoàn thành', 'success') : cur ? badge('Đang thực hiện', 'info') : g.stx === 'HUY' ? badge('Đã huỷ', 'default') : badge('Chưa thực hiện', 'default')}</td>`; }), 'Theo hình thức LCNT');
    const tTp = () => {
      if (lv < 1) return emptyCard('Thành phần tham gia', 'Thành phần tham gia được thành lập sau khi KHLCNT được phê duyệt.');
      const off = Number(g.code.slice(-2));
      const P = (i) => PEOPLE[(off + i) % PEOPLE.length];
      const team = [[P(0), 'Tổ chuyên gia', 'Tổ trưởng'], [P(1), 'Tổ chuyên gia', 'Thành viên — kỹ thuật'], [P(2), 'Tổ chuyên gia', 'Thành viên — tài chính, thương mại'],
        [P(3), 'Tổ thẩm định', 'Tổ trưởng'], [P(4), 'Tổ thẩm định', 'Thành viên — pháp lý']];
      const shortL = g.short ? card('Danh sách ngắn', table([['Mã nhà thầu', 140], ['Tên nhà thầu', 340], ['Nguồn', 220], ['Tình trạng', 180, 'c']], g.short,
        (c) => `<td>${esc(c)}</td><td>${clamp(nccName(c))}</td><td>${STRAT.some((x) => x[0] === c) ? 'Nhà thầu chiến lược Tập đoàn' : 'Đề xuất của Tổ chuyên gia'}</td><td class="c">${D.nccOf(c).ban ? badge('Bị cấm', 'error') : badge('Hợp lệ', 'success')}</td>`),
        g.short.length >= 3 ? `${g.short.length} nhà thầu · đạt tối thiểu 03` : `${g.short.length} nhà thầu · ít hơn 03 — xử lý tình huống (Điều 36 khoản 3)`) : '';
      return card('Tổ chuyên gia và Tổ thẩm định', table([['Họ và tên', 220], ['Tổ', 160], ['Vai trò', 260], ['Quyết định thành lập', 200]], team,
        (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(`${(r[1] === 'Tổ chuyên gia' ? 600 : 601) + off * 2}/QĐ-VHT`)}</td>`))
        + card('Kiểm tra xung đột vai trò', `<div class="ginfo c3">${kv('Kết quả', badge('Không có xung đột', 'success'))}${kv('Nội dung kiểm tra', 'Thành viên Tổ chuyên gia không đồng thời thuộc Tổ thẩm định, không là người phê duyệt KQLCNT', 'span2')}</div>`)
        + shortL;
    };
    const bidders = (g.bidders || []).map((b, i) => ({ ncc: b[0], price: b[1], valid: b[2], cap: b[3], tech: b[4], note: b[5], i }));
    const ranked = bidders.filter((b) => b.valid === 'Đạt' && b.cap === 'Đạt' && (b.tech == null || b.tech >= 70)).sort((a, b) => a.price - b.price);
    const low = (b) => b.price < g.price * 0.8;
    const tHs = () => {
      if (!hasBid) return emptyCard('Hồ sơ mời', `Hình thức ${esc(cat('hinh-thuc-lcnt', g.form))} không phát hành hồ sơ mời thầu.`);
      if (lv < 1) return emptyCard('Hồ sơ mời', 'Hồ sơ mời được lập sau khi KHLCNT được phê duyệt.');
      const pp = g.form === 'CGTT' || ['MSTT', 'CDT_TT', 'CDT_RG'].includes(g.form) ? 'GIA_THAP_NHAT' : g.method === '1GD2T' ? 'GIA_DANH_GIA' : 'GIA_THAP_NHAT';
      const guar = ['DTRR', 'DTHC'].includes(g.form);
      const issued = lv >= 2;
      const vs = [['v1', issued ? 'Phát hành' : 'Đang lập', issued ? '15/09/2026' : '-']].concat(g.code === 'GT-2026-0024' ? [['v2', 'Sửa đổi sau phát hành (làm rõ yêu cầu kỹ thuật bộ điều khiển chùm tia)', '24/09/2026']] : []);
      const clar = g.code === 'GT-2026-0024' ? [['Iota Electronics Co., Ltd.', '20/09/2026', 'Làm rõ dải quét chùm tia yêu cầu', 'Đã trả lời — sửa đổi HSMT v2']] : lv >= 2 && guar ? [[nccName((bidders[0] || {}).ncc || 'NCC-000001'), '18/09/2026', 'Làm rõ điều kiện bảo hành', 'Đã trả lời']] : [];
      return card('Thông tin ' + docKind, `<div class="ginfo c3">${kv('Loại hồ sơ', esc(docKind))}${kv('Phiên bản hiện hành', esc(vs[vs.length - 1][0]))}${kv('Trạng thái phát hành', issued ? badge('Đã phát hành', 'success') : badge('Đang lập', 'info'))}
          ${kv('Phương pháp đánh giá', esc(cat('phuong-phap-danh-gia', pp)))}${kv('Bảo đảm dự thầu', guar ? `${esc(cat('hinh-thuc-bao-dam', 'BL_NH'))} · ${ty(Math.round(g.price * 0.015 * 1000) / 1000, 3)} tỷ đồng (1,5% giá gói)` : 'Không yêu cầu')}
          ${kv('Thời điểm đóng thầu', issued ? '30/09/2026 09:00' : null)}</div>`)
        + card('Tiêu chuẩn đánh giá', table([['Nội dung', 260], ['Phương pháp', 260], ['Yêu cầu', 420]],
          [['Tính hợp lệ', 'Đạt / Không đạt', 'Tư cách hợp lệ (Điều 24), không thuộc danh sách cấm, bảo đảm dự thầu hợp lệ'], ['Năng lực, kinh nghiệm', cat('phuong-phap-danh-gia', 'DAT_KHONG_DAT'), 'Tối thiểu 02 hợp đồng tương tự trong 03 năm'],
            ['Kỹ thuật', g.method === '1GD2T' ? cat('phuong-phap-danh-gia', 'CHAM_DIEM') + ' (tối thiểu 70/100)' : cat('phuong-phap-danh-gia', 'DAT_KHONG_DAT'), 'Đáp ứng thông số kỹ thuật, tiến độ, bảo hành'], ['Tài chính', cat('phuong-phap-danh-gia', pp), 'Xếp hạng theo ' + cat('phuong-phap-danh-gia', pp).toLowerCase()]],
          (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${clamp(r[2])}</td>`))
        + card('Phiên bản hồ sơ', table([['Phiên bản', 110], ['Nội dung', 520], ['Ngày', 140]], vs, (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td><td class="num">${esc(r[2])}</td>`))
        + card('Làm rõ / sửa đổi hồ sơ mời', table([['Nhà thầu đề nghị', 300], ['Ngày', 120], ['Nội dung', 360], ['Kết quả', 260]], clar, (r) => `<td>${clamp(r[0])}</td><td class="num">${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(r[3])}</td>`))
        + card('Hồ sơ dự thầu đã nộp', table([['Nhà thầu', 340], ['Thời điểm nộp', 160], ['Giá dự thầu (tỷ đồng)', 170, 'r'], ['Bảo đảm dự thầu', 180, 'c']], lv >= 3 ? bidders : [],
          (b) => `<td>${clamp(nccName(b.ncc))}</td><td class="num">29/09/2026 ${String(10 + b.i).padStart(2, '0')}:15</td><td class="r num">${money(b.price)}</td><td class="c">${guar ? badge('Hợp lệ', 'success') : dash}</td>`), lv >= 3 ? `${bidders.length} hồ sơ` : 'Chưa đến thời điểm đóng thầu')
        + card('Biên bản mở thầu', lv >= 3 && bidders.length ? `<div class="ginfo c3">${kv('Thời điểm mở thầu', '30/09/2026 09:30')}${kv('Số hồ sơ', String(bidders.length))}${kv('Tệp', `<a class="link-red" href="#" data-dl="Bien-ban-mo-thau-${esc(g.code)}.pdf">Bien-ban-mo-thau-${esc(g.code)}.pdf</a>`)}</div>` : '<div class="empty-t">Chưa mở thầu.</div>');
    };
    const tDg = () => {
      if (!bidders.length || lv < 3) return emptyCard('Đánh giá hồ sơ', 'Chưa có hồ sơ tham dự để đánh giá.');
      const rk = (b) => { const r = ranked.indexOf(b); return r < 0 ? dash : String(r + 1); };
      const res = (v) => (v == null ? dash : v === 'Đạt' ? badge('Đạt', 'success') : typeof v === 'number' ? (v >= 70 ? badge(v + ' điểm', 'success') : badge(v + ' điểm', 'error')) : badge(v, 'error'));
      const win = g.winner && D.nccOf(g.winner);
      const lose = bidders.filter((b) => b.ncc !== g.winner).map((b) => [nccName(b.ncc), b.note || (b.cap !== 'Đạt' && b.cap != null ? 'Không đạt năng lực, kinh nghiệm' : b.tech != null && b.tech < 70 ? 'Không đạt điểm kỹ thuật tối thiểu' : 'Xếp hạng thấp hơn nhà thầu trúng thầu')]);
      return card('Kết quả đánh giá nhà thầu', table([['Nhà thầu', 250], ['Hợp lệ', 100, 'c'], ['Năng lực', 120, 'c'], ['Kỹ thuật', 110, 'c'], ['Giá dự thầu (tỷ đồng)', 150, 'r'], ['Xếp hạng', 90, 'c'], ['Cảnh báo', 190]], bidders,
          (b) => `<td>${clamp(nccName(b.ncc))}</td><td class="c">${res(b.valid)}</td><td class="c">${res(b.cap)}</td><td class="c">${res(b.tech)}</td><td class="r num">${money(b.price)}</td><td class="c">${rk(b)}</td>
            <td>${low(b) ? badge('Giá thấp bất thường', 'warning') : b.price > g.price ? badge('Vượt giá gói thầu', 'error') : dash}</td>`), `Giá gói thầu ${ty(g.price, 2)} tỷ đồng`)
        + card('Làm rõ hồ sơ dự thầu', table([['Nhà thầu', 300], ['Ngày', 120], ['Nội dung yêu cầu làm rõ', 380], ['Trả lời', 260]],
          bidders.filter(low).map((b) => [nccName(b.ncc), '03/10/2026', 'Giải trình giá dự thầu thấp hơn 20% giá gói thầu', 'Đã giải trình — chưa chứng minh được khả năng thực hiện']),
          (r) => `<td>${clamp(r[0])}</td><td class="num">${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(r[3])}</td>`))
        + card('Kết quả lựa chọn nhà thầu', win && lv >= 4 ? `<div class="ginfo c3">${kv('Nhà thầu đề nghị trúng thầu', esc(win.name))}${kv('Giá trúng thầu', ty(bidders.find((b) => b.ncc === g.winner).price, 2) + ' tỷ đồng')}${kv('Loại hợp đồng', esc(cat('loai-hop-dong', g.contract)))}
            ${kv('Thời gian thực hiện', esc(g.execTime))}${kv('Quyết định phê duyệt KQLCNT', g.kq ? `${esc(g.kq[0])} ngày ${esc(g.kq[1])}` : badge('Chờ phê duyệt', 'warning'))}${kv('Thương thảo hợp đồng', badge('Thành công', 'success'))}</div>`
          + table([['Nhà thầu không trúng thầu', 340], ['Lý do', 520]], lose, (r) => `<td>${clamp(r[0])}</td><td>${clamp(r[1])}</td>`) : '<div class="empty-t">Chưa có kết quả lựa chọn nhà thầu.</div>');
    };
    const tTh = () => card('Tình huống & kiến nghị', table([['Loại', 220], ['Ngày', 120], ['Nội dung', 520], ['Trạng thái', 220]], g.events || [],
      (r) => `<td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(r[3])}</td>`), 'Huỷ thầu, xử lý tình huống, kiến nghị, tạm dừng ký hợp đồng');
    const kq = g.form === 'GIAO_NV' || g.form === 'TU_TH' || g.form === 'DAT_HANG';
    const kqCard = () => (g.kq ? card('Kết quả', `<div class="ginfo c3">${kv('Đơn vị thực hiện', esc(g.assignee))}${kv('Văn bản', `${esc(g.kq[0])} ngày ${esc(g.kq[1])}`)}${kv('Giá trị', ty(g.price, 2) + ' tỷ đồng')}</div>`) : emptyCard('Kết quả', 'Chưa có văn bản giao thực hiện.'));
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết gói thầu', back: 'goi-thau', lg: true, info, right })}
      ${tabs('gt:' + g.code, [['info', 'Thông tin chung'], ['pa', 'Phương án LCNT'], ['tp', 'Thành phần tham gia'], ['hs', 'Hồ sơ mời thầu'], ['dg', kq ? 'Kết quả' : 'Đánh giá & KQLCNT'], ['th', 'Tình huống & kiến nghị']],
        { info: tInfo, pa: tPa, tp: tTp, hs: tHs, dg: kq ? kqCard : tDg, th: tTh })}</div>`;
  }

  /* ---------- SCR-83 Nhà thầu & kiểm soát rủi ro (ecat catalog-list chỉ xem + app-tabs) ---------- */
  const STRAT = [['NCC-000003', 'Thiết bị đo kiểm vô tuyến, anten', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027'], ['NCC-000008', 'Thiết bị đo kiểm, buồng đo', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027'],
    ['NCC-000009', 'Thiết bị điện tử, dây chuyền SMT', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027'], ['NCC-000001', 'Thiết bị CNTT, viễn thông', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027']];
  const MAKERS = [['Hãng Sigma Instruments', 'Đức', 'Máy phân tích phổ, máy đo vector', 'NCC-000008'], ['Omega RF Systems', 'Hàn Quốc', 'Anten mảng pha, buồng đo', 'NCC-000009'],
    ['Tau Antenna Lab', 'Singapore', 'Anten băng Ka, bộ điều khiển chùm tia', 'NCC-000003']];
  const VIOL = [['NCC-000007', 'Không thực hiện bảo đảm thực hiện hợp đồng sau khi trúng thầu', 'GT-2025-0142', '0415/QĐ-VHT', '02/01/2026', 'Cấm tham gia đến 31/12/2026'],
    ['NCC-000010', 'Chậm tiến độ giao hàng quá 60 ngày, không thông báo', 'GT-2025-0098', '0311/QĐ-VHT', '15/11/2025', 'Hạn chế: chỉ tham gia khi có bảo đảm 10%'],
    ['NCC-000007', 'Nộp HSDT có thông tin không trung thực về kinh nghiệm', 'GT-2024-0211', '0902/QĐ-VHT', '10/09/2024', 'Cảnh cáo (hết hiệu lực)']];
  const NT = { tab: 'cl' };
  function ntPage() {
    // Theo: ecat common-catalog/base/catalog-list.component (chỉ xem) + app-tabs
    const info = {
      scr: 'SCR-83', name: 'Nhà thầu & kiểm soát rủi ro', uc: 'Backlog W1_T10 › Nhà thầu & Kiểm soát rủi ro (dòng 403–406)',
      notes: [
        'Tra cứu chỉ xem, khuôn catalog-list của ecat + app-tabs. Nhà thầu / hãng chiến lược do Tập đoàn công bố (QC-12869 Điều 13 khoản 2) — nguồn ưu tiên cho đấu thầu hạn chế, đàm phán trực tiếp.',
        'Nhà thầu bị cấm / hạn chế = cờ Tình trạng của danh mục Nhà cung cấp (SCR-31); khi đưa nhà thầu vào danh sách ngắn hoặc đánh giá, hệ thống chặn / cảnh báo theo cờ này. Lịch sử vi phạm ghi theo quyết định xử lý.',
        'Cảnh báo gian lận, thông thầu, chia nhỏ gói bất thường (dòng 407–408) để sau.',
      ],
      q: ['P-78'], src: 'ecat common-catalog/base/catalog-list.component · /common-catalog',
    };
    const ban = window.Catalog.rows('nha-cung-cap').filter((r) => r.ban);
    const body = {
      cl: () => card('Nhà thầu chiến lược', table([['Mã nhà thầu', 140], ['Tên nhà thầu', 320], ['Lĩnh vực', 280], ['Quyết định công bố', 200], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120]], STRAT,
        (r) => `<td>${esc(r[0])}</td><td>${clamp(nccName(r[0]))}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td class="num">${esc(r[3])}</td><td class="num">${esc(r[4])}</td>`)),
      hang: () => card('Hãng sản xuất chiến lược', table([['Tên hãng', 260], ['Quốc gia', 140], ['Sản phẩm', 340], ['Nhà thầu đại diện', 300]], MAKERS,
        (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(nccName(r[3]))}</td>`)),
      cam: () => card('Nhà thầu bị cấm / hạn chế', table([['Mã nhà thầu', 140], ['Tên nhà thầu', 320], ['Tình trạng', 200, 'c'], ['Mã số thuế', 160]], ban,
        (r) => `<td>${esc(r.code)}</td><td>${clamp(r.name)}</td><td class="c">${r.ban.until ? badge('Cấm đến ' + r.ban.until, 'error') : badge('Hạn chế', 'warning')}</td><td>${esc(r.tax)}</td>`))
        + card('Lịch sử vi phạm và chế tài', table([['Nhà thầu', 280], ['Hành vi vi phạm', 340], ['Gói thầu', 140], ['Quyết định xử lý', 160], ['Ngày', 120], ['Chế tài', 260]], VIOL,
          (r) => `<td>${clamp(nccName(r[0]))}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td class="num">${esc(r[4])}</td><td>${clamp(r[5])}</td>`)),
    };
    return `<div class="pg">${head({ title: 'Nhà thầu & kiểm soát rủi ro', info })}
      <nav class="tabs dx-tabs" role="tablist">${[['cl', 'Nhà thầu chiến lược'], ['hang', 'Hãng sản xuất chiến lược'], ['cam', 'Nhà thầu bị cấm']].map(([k, l]) => `<button type="button" class="tab ${NT.tab === k ? 'on' : ''}" role="tab" aria-selected="${NT.tab === k}" data-nttab="${k}">${l}</button>`).join('')}</nav>
      ${body[NT.tab]()}</div>`;
  }

  /* ---------- Sự kiện danh sách / tab ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const tb = t.closest('[data-ttab]');
    if (tb) { TB.tab = tb.dataset.ttab; rerender(); return; }
    const nt = t.closest('[data-nttab]');
    if (nt) { NT.tab = nt.dataset.nttab; rerender(); return; }
    const pg = t.closest('[data-pager]');
    if (pg && LST[pg.dataset.pager]) {
      const L = LST[pg.dataset.pager], b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    const tl = t.closest('[data-tl]');
    if (!tl) return;
    const [id, act] = tl.dataset.tl.split(':'), L = LST[id];
    if (act === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
    if (act === 'reset') { L.d = L.empty(); L.f = L.empty(); L.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-tadv]');
    if (!f) return;
    e.preventDefault();
    const L = LST[f.dataset.tadv];
    L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-tf]');
    if (f) { const [id, k] = f.dataset.tf.split(':'); LST[id].d[k] = f.value; }
  });
  document.addEventListener('keydown', (e) => {
    const id = e.key === 'Enter' && e.target.dataset && e.target.dataset.tkw;
    if (!id) return;
    LST[id].kw = e.target.value.trim(); LST[id].page = 1; rerender();
    const k = document.getElementById(id + '-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* Router: #/khlcnt, #/khlcnt/create[/<loại>/<mã>], #/khlcnt/<mã>, #/goi-thau[/<mã>], #/nha-thau. */
  function route(parts) {
    const [a, b] = parts;
    if (a === 'khlcnt') return b === 'create' ? khForm() : b ? khDetail(decodeURIComponent(b)) : khList();
    if (a === 'goi-thau') return b ? pkDetail(decodeURIComponent(b)) : pkList();
    return ntPage();
  }
  function enter(parts) {
    if (parts[0] === 'khlcnt' && parts[1] === 'create') resetForm(parts[2], parts[3] && decodeURIComponent(parts[3]));
  }
  function reset() { U = { kh: [], adj: {} }; persist(); }

  /* Khuôn dùng chung cho các phân hệ B3 (hop-dong.js, thong-bao.js, bao-cao.js): danh sách, bảng, card, tab, trường. */
  const setTab = (key, tab) => { TB.key = key; TB.tab = tab; };
  const kit = { listPage, table, card, emptyCard, tabs, setTab, kv, field, money, clamp, dash, has, inSet, catOpts, cat, nccName, sum, dkey, LST };
  window.Thau = { route, enter, reset, khBy, srcInfo, khAll, pkgsOf, pkOf, PK, KH_ST, PK_ST, pkRow, srcHref, kit };
})();
