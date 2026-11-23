/* Phân hệ Quản lý sản xuất — Tiếp nhận nhiệm vụ, hoàn thiện đầu vào (COP2 B1, CDS-BT-03COP tr. 84–85): SX-22 danh sách, tab "Đầu vào (B1)" của Chi tiết dự án.
   Bốn nội dung: B1.1 Giao trách nhiệm, tổ chức chuẩn bị (danh mục đầu vào có người cung cấp, nguồn / căn cứ, hạn, trạng thái "đang chuẩn bị");
   B1.2 Tiếp nhận hồ sơ theo từng cấu hình và lô (BOM, hồ sơ kỹ thuật, định mức, chỉ tiêu, phiên bản, phạm vi áp dụng, kết quả tiếp nhận);
   B1.3 Phạm vi sản xuất và trách nhiệm các bên (VHT / VMC / thuê ngoài, đầu mối, điều kiện kiểm tra và bàn giao);
   B1.4 Chi phí và kế hoạch tổng thể có căn cứ (căn cứ giá, nguồn, ngày cập nhật, hiệu lực, leadtime dài, chênh lệch so với PAKD).
   Cổng chuyển tiếp: đủ 4 nội dung mới "Chốt đầu vào" → lập phương án / kế hoạch (luồng SX-KH). GIẢ LẬP Q-SX-01: cổng chỉ cảnh báo, chưa chặn nút Khởi tạo phê duyệt kế hoạch.
   Route: #/sx/dau-vao. Lưu localStorage sx-proto-dau-vao. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  const P = () => window.SxDuAn;
  const rerender = () => window.App.render();
  const dmy = (s) => { if (!s) return ''; const [y, m, d] = String(s).slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const whoTxt = (x) => (x.who ? pName(x.who) || x.who : x.unit || '');
  const today = () => D.sxToday;
  const LT_LONG = 16; // tuần — vật tư leadtime dài phải đưa vào kế hoạch từ đầu (GIẢ LẬP)

  /* ---------- Danh mục trạng thái ---------- */
  const ST_IN = { CHUA: ['Chưa nhận', 'default'], DANG: ['Đang chuẩn bị', 'info'], THIEU: ['Thiếu căn cứ', 'error'], DU: ['Đủ căn cứ', 'success'] };
  const ST_CFG = { CHUA: ['Chưa tiếp nhận', 'default'], THIEU: ['Thiếu hồ sơ', 'error'], DAT: ['Tiếp nhận đủ', 'success'] };
  const SIDE = { VHT: 'VHT thực hiện', VMC: 'Giao VMC', THUE: 'Thuê ngoài' };
  const ST_SC = { CHUA: ['Chưa chốt', 'warning'], CHOT: ['Đã chốt', 'success'] };
  const DOCS = [['bom', 'BOM'], ['hskt', 'Hồ sơ kỹ thuật'], ['dm', 'Định mức'], ['ct', 'Chỉ tiêu được duyệt']];
  const SEC = [['B11', 'B1.1 Giao trách nhiệm, tổ chức chuẩn bị'], ['B12', 'B1.2 Tiếp nhận hồ sơ theo cấu hình, lô'], ['B13', 'B1.3 Phạm vi sản xuất, trách nhiệm các bên'], ['B14', 'B1.4 Chi phí, kế hoạch tổng thể có căn cứ']];

  /* ---------- Dữ liệu mẫu ---------- */
  const SEED = {
    'DA-SX-2026-004': {
      budget: 330000,
      items: [
        { name: 'Văn bản căn cứ (PAKD 352/PAKD-VHT)', who: 'sxk2', src: 'Hệ thống PAKD (đã phê duyệt 28/10/2026)', due: '2026-11-10', st: 'DU' },
        { name: 'Sản phẩm, số lượng, mốc yêu cầu của khách hàng', who: 'sxkd', src: 'PAKD; yêu cầu khách hàng nội bộ', due: '2026-11-12', st: 'DU' },
        { name: 'Danh sách cấu hình, chia lô sản xuất', who: 'sxrd', src: 'Kho sản phẩm sẵn sàng sản xuất gNB-M3 v1.2', due: '2026-11-14', st: 'DU' },
        { name: 'Hồ sơ kỹ thuật, BOM, định mức theo từng cấu hình', who: 'sxrd', src: 'Gói chuyển giao từ nghiên cứu', due: '2026-11-20', st: 'DANG', note: 'Cấu hình 32T32R chưa có định mức; cấu hình indoor chưa bàn giao' },
        { name: 'Báo giá, giá tham chiếu vật tư chính', unit: 'Trung tâm Mua sắm', src: 'Báo giá nhà cung cấp; giá hợp đồng gần nhất', due: '2026-11-15', st: 'THIEU', note: 'Thiếu báo giá FPGA, module RF; báo giá cũ hết hiệu lực 31/10/2026' },
        { name: 'Năng lực, phương án sản xuất của VMC', who: 'sxnm', src: 'Xác nhận năng lực VMC', due: '2026-11-25', st: 'CHUA' },
        { name: 'Nguồn kinh phí, chi phí vốn', unit: 'Phòng Tài chính', src: 'Kế hoạch tài chính năm 2027', due: '2026-11-22', st: 'DANG' },
      ],
      cfgs: [
        { cfg: 'Cấu hình 3 sector 64T64R', lot: 'Lô 1 — 1.000 trạm', bom: 'v1.2', hskt: 'v1.2', dm: 'v1.2', ct: 'QĐ 412/QĐ-VHT', scope: 'Trạm macro đô thị', kq: 'DAT' },
        { cfg: 'Cấu hình 3 sector 32T32R', lot: 'Lô 2 — 1.200 trạm', bom: 'v1.2', hskt: 'v1.1', dm: '', ct: 'QĐ 412/QĐ-VHT', scope: 'Trạm macro nông thôn', kq: 'THIEU', note: 'Thiếu định mức; hồ sơ kỹ thuật lệch phiên bản với BOM' },
        { cfg: 'Cấu hình 1 sector indoor', lot: 'Lô 3 — 800 trạm', bom: '', hskt: '', dm: '', ct: '', scope: 'Phủ sóng trong nhà', kq: 'CHUA' },
      ],
      scope: [
        { name: 'Mua vật tư leadtime dài (FPGA, module RF, PA)', side: 'VHT', unit: 'Trung tâm Mua sắm', check: 'Nhập kho VHT, cấp cho VMC theo phiếu xuất kho', st: 'CHOT' },
        { name: 'Sản xuất, lắp ráp, đo kiểm trọn gói', side: 'VMC', who: 'sxnm', check: 'OQC theo AQL 0,65 trước bàn giao từng lô', st: 'CHOT' },
        { name: 'Nạp phần mềm, cấp license', side: 'VHT', who: 'sxrd', check: '', st: 'CHUA' },
        { name: 'Đóng gói, vận chuyển tới kho khách hàng', side: '', check: '', st: 'CHUA', note: 'Chưa thống nhất VMC hay VHT thuê vận chuyển' },
      ],
      cost: [
        { name: 'Vật tư leadtime dài (FPGA, module RF)', amount: 182000, basis: 'Báo giá nhà cung cấp 09/2026', src: 'Vốn lưu động 2027', at: '2026-09-20', valid: '2026-10-31', lt: 26, early: true },
        { name: 'Vật tư còn lại theo mBOM', amount: 96500, basis: 'Định mức mBOM v1.2 × giá hợp đồng 2026', src: 'Vốn lưu động 2027', at: '2026-11-08', valid: '2027-03-31', lt: 8 },
        { name: 'Phí tổng thầu VMC (lắp ráp, đo kiểm)', amount: 54000, basis: '', src: 'Vốn lưu động 2027', at: '', valid: '', lt: 0 },
        { name: 'Thử nghiệm, chứng nhận hợp chuẩn', amount: 3200, basis: 'Báo giá Trung tâm Đo lường 10/2026', src: 'Chi phí dự án', at: '2026-10-15', valid: '2027-01-31', lt: 6 },
        { name: 'Vận chuyển, bảo hiểm', amount: 2100, basis: 'Định mức 2% giá trị hàng', src: 'Chi phí dự án', at: '2026-11-08', valid: '2027-06-30', lt: 0 },
      ],
    },
  };
  /* Dự án không có dữ liệu mẫu: sinh khung theo căn cứ, mô hình tổ chức. Đã chốt kế hoạch gốc → coi như đã chốt đầu vào (đủ). */
  function template(p) {
    const done = !!p.baseline, s = (ok) => (done ? ok : 'CHUA');
    const basisTxt = (p.basis || [])[1] || 'Văn bản căn cứ hình thành';
    const items = [
      { name: `Văn bản căn cứ (${basisTxt})`, who: p.pm, src: 'Căn cứ hình thành dự án', st: p.basis && p.basis[1] ? 'DU' : 'CHUA' },
      { name: 'Sản phẩm, số lượng, mốc yêu cầu của khách hàng', who: 'sxkd', src: 'PAKD / nhiệm vụ / hợp đồng', st: s('DU') },
      { name: 'Hồ sơ kỹ thuật, BOM, định mức theo cấu hình', who: 'sxrd', src: 'Gói chuyển giao từ nghiên cứu', st: s('DU') },
      { name: 'Báo giá, giá tham chiếu vật tư chính', unit: 'Trung tâm Mua sắm', src: 'Báo giá nhà cung cấp', st: s('DU') },
      { name: 'Năng lực đơn vị sản xuất', unit: p.factory ? 'Đơn vị sản xuất' : 'Trung tâm Sản xuất', src: 'Xác nhận năng lực', st: s('DU') },
      { name: 'Nguồn kinh phí', unit: 'Phòng Tài chính', src: 'Kế hoạch tài chính', st: s('DU') },
    ].map((x) => Object.assign({ due: p.baseline || p.start }, x));
    const cfgs = [{ cfg: `Cấu hình chuẩn ${p.version || ''}`.trim(), lot: `Toàn bộ — ${num(p.qty)} ${p.unitName || ''}`, scope: 'Theo PAKD / hợp đồng',
      bom: done ? p.version || 'v1.0' : '', hskt: done ? p.version || 'v1.0' : '', dm: done ? p.version || 'v1.0' : '', ct: done ? 'Đã phê duyệt' : '', kq: done ? 'DAT' : 'CHUA' }];
    const SC = {
      VHT_TU_SX: [['Mua linh kiện, vật tư', 'VHT', 'Trung tâm Mua sắm', 'IQC khi nhập kho'], ['Gia công bo mạch, cơ khí', 'THUE', 'Nhà cung cấp gia công', 'Nghiệm thu đầu vào theo lô'], ['Tích hợp, đo kiểm', 'VHT', 'Trung tâm Sản xuất', 'Đạt chỉ tiêu tại trạm đo']],
      VMC_TONG_THAU: [['Mua vật tư leadtime dài', 'VHT', 'Trung tâm Mua sắm', 'Cấp cho VMC theo phiếu xuất kho'], ['Sản xuất trọn gói', 'VMC', 'VMC', 'OQC trước bàn giao']],
      GIA_CONG: [['Cấp vật tư chính', 'VHT', 'Trung tâm Mua sắm', 'Biên bản giao nhận vật tư'], ['Gia công trọn gói', 'THUE', 'Nhà máy gia công', 'Nghiệm thu theo lô']],
    }[p.model] || [];
    const scope = SC.map(([name, side, unit, check]) => ({ name, side: done ? side : '', unit: done ? unit : '', check: done ? check : '', st: done ? 'CHOT' : 'CHUA' }));
    const cost = [['Vật tư theo định mức', 'Định mức mBOM × giá hợp đồng'], ['Gia công, chế tạo', 'Báo giá đơn vị sản xuất'], ['Thử nghiệm, đo kiểm', 'Báo giá đơn vị đo lường']]
      .map(([name, basis]) => ({ name, amount: 0, basis: done ? basis : '', src: done ? 'Theo PAKD' : '', at: done ? p.baseline : '', valid: done ? '2099-12-31' : '', lt: 0 }));
    return { budget: 0, items, cfgs, scope, cost, closed: done ? p.baseline : null };
  }

  /* ---------- Lưu thay đổi ---------- */
  const KEY = 'sx-proto-dau-vao';
  let U = {};
  try { U = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { U = {}; }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const ids = (l, pre) => l.map((x, i) => Object.assign({ id: `${pre}${i + 1}` }, x));
  function dataOf(p) {
    if (!U[p.code]) {
      const s = SEED[p.code] ? JSON.parse(JSON.stringify(SEED[p.code])) : template(p);
      U[p.code] = { budget: s.budget || 0, closed: s.closed || null, items: ids(s.items, 'I'), cfgs: ids(s.cfgs, 'C'), scope: ids(s.scope, 'S'), cost: ids(s.cost, 'P') };
    }
    return U[p.code];
  }

  /* ---------- Đánh giá đủ / thiếu ---------- */
  const expired = (c) => !!c.valid && c.valid < today();
  const verMismatch = (c) => { const v = [c.bom, c.hskt, c.dm].filter(Boolean); return v.length > 1 && new Set(v).size > 1; };
  const docsMissing = (c) => DOCS.filter(([k]) => !String(c[k] || '').trim()).map(([, l]) => l);
  const costIssues = (c) => [!c.basis ? 'chưa có căn cứ giá' : '', expired(c) ? `căn cứ hết hiệu lực ${dmy(c.valid)}` : '', c.lt >= LT_LONG && !c.early ? `leadtime ${c.lt} tuần chưa đưa vào kế hoạch sớm` : ''].filter(Boolean);
  function check(p) {
    const d = dataOf(p);
    const s11 = d.items.filter((x) => x.st !== 'DU').map((x) => `${x.name} — ${ST_IN[x.st][0].toLowerCase()}`);
    const late = d.items.filter((x) => x.st !== 'DU' && x.due && x.due < today());
    const s12 = d.cfgs.filter((x) => x.kq !== 'DAT').map((x) => `${x.cfg} · ${x.lot} — ${ST_CFG[x.kq][0].toLowerCase()}`);
    const s13 = d.scope.filter((x) => x.st !== 'CHOT').map((x) => `${x.name} — chưa chốt`);
    const s14 = d.cost.map((c) => [c, costIssues(c)]).filter(([, i]) => i.length).map(([c, i]) => `${c.name} — ${i.join('; ')}`);
    const total = d.cost.reduce((a, c) => a + Number(c.amount || 0), 0), diff = d.budget ? total - d.budget : 0;
    if (d.budget && diff > 0) s14.push(`Tổng chi phí ${num(total)} triệu vượt PAKD ${num(diff)} triệu (${(diff / d.budget * 100).toFixed(1).replace('.', ',')}%) — cần PM xử lý chênh lệch`);
    const pct = (ok, n) => (n ? Math.round(ok / n * 100) : 100);
    const sec = {
      B11: { miss: s11, pct: pct(d.items.length - s11.length, d.items.length), late },
      B12: { miss: s12, pct: pct(d.cfgs.length - s12.length, d.cfgs.length) },
      B13: { miss: s13, pct: pct(d.scope.length - s13.length, d.scope.length) },
      B14: { miss: s14, pct: pct(d.cost.filter((c) => !costIssues(c).length).length, d.cost.length) - (d.budget && diff > 0 ? 10 : 0) },
    };
    Object.values(sec).forEach((x) => { x.ok = !x.miss.length && (x !== sec.B12 || d.cfgs.length > 0); x.pct = Math.max(0, x.ok ? 100 : Math.min(99, x.pct)); });
    const okN = Object.values(sec).filter((x) => x.ok).length;
    return { d, sec, okN, ready: okN === 4, total, diff, closed: d.closed };
  }
  const stateBadge = (r) => (r.closed ? badge('Đã chốt đầu vào', 'success') : r.ready ? badge('Sẵn sàng chốt', 'info') : badge('Đang chuẩn bị', 'warning'));

  /* ---------- Quyền ---------- */
  const isPm = (p) => isAdmin() || p.pm === pid();
  const canEdit = (p) => isPm(p) && !check(p).closed && p.status === 'PLANNING';
  const canUpdItem = (p, x) => !check(p).closed && p.status === 'PLANNING' && (isPm(p) || x.who === pid());

  /* ---------- Tab Đầu vào (B1) của Chi tiết dự án ---------- */
  const btn = (attr, label, cls) => `<button type="button" class="vbtn sm ${cls || 'secondary'}" ${attr}>${label}</button>`;
  function secHead(code, r, extra) {
    const s = r.sec[code], name = SEC.find((x) => x[0] === code)[1];
    return `<div class="vcard-h"><h3>${esc(name)}</h3><div class="row">${badge(s.ok ? 'Đủ' : `Còn ${s.miss.length} điểm thiếu`, s.ok ? 'success' : 'warning')}${extra || ''}</div></div>`;
  }
  function projectTab(p) {
    const k = K(), r = check(p), d = r.d, ed = canEdit(p), c = esc(p.code);
    /* Tổng quan + cổng chuyển tiếp */
    const tiles = SEC.map(([code, name]) => { const s = r.sec[code]; return `<div class="sxdv-tile ${s.ok ? 'ok' : ''}"><div class="t">${esc(name)}</div><div class="v">${s.pct}%</div>
      <div class="bar"><span style="width:${s.pct}%"></span></div><div class="m">${s.ok ? 'Đủ căn cứ' : `${s.miss.length} điểm thiếu`}</div></div>`; }).join('');
    const miss = SEC.flatMap(([code]) => r.sec[code].miss.map((m) => `<li><b>${code.replace('B1', 'B1.')}</b> ${esc(m)}</li>`));
    const gate = r.closed
      ? `<div class="hd-alert success">${icon('info')}<span>Đã chốt đầu vào ngày ${esc(dmy(r.closed))}. Chuyển sang lập phương án / kế hoạch sản xuất (tab Phê duyệt kế hoạch).</span></div>`
      : r.ready
        ? `<div class="hd-alert info">${icon('info')}<span>Đủ 4 nội dung đầu vào. Giám đốc dự án chốt đầu vào để chuyển lập phương án sản xuất kinh doanh.</span></div>`
        : `<div class="hd-alert warning">${icon('info')}<span><b>Chưa đủ căn cứ để chuyển lập PASXKD</b> — ${miss.length} điểm còn thiếu (giữ trạng thái "Đang chuẩn bị"):<ul class="sxdv-miss">${miss.slice(0, 8).join('')}${miss.length > 8 ? `<li>… và ${miss.length - 8} điểm khác</li>` : ''}</ul></span></div>`;
    const gateBtn = !r.closed && isPm(p) && p.status === 'PLANNING' ? `<button type="button" class="vbtn primary" data-sxdv-close="${c}" ${r.ready ? '' : 'disabled title="Chưa đủ 4 nội dung đầu vào"'}>Chốt đầu vào</button>` : '';
    const top = `<section class="vcard pad24" data-sxdv-sum><div class="vcard-h"><h3>Tiếp nhận nhiệm vụ, hoàn thiện đầu vào</h3><div class="row">${stateBadge(r)}<span class="cap">${r.okN}/4 nội dung đủ căn cứ</span>${gateBtn}</div></div>
      <div class="sxdv-tiles">${tiles}</div><div class="hd-alerts">${gate}</div></section>`;

    /* B1.1 */
    const lateIds = new Set(r.sec.B11.late.map((x) => x.id));
    const t11 = k.table([['Hạng mục đầu vào', 280], ['Người / đơn vị cung cấp', 190], ['Nguồn, căn cứ', 220], ['Hạn trả kết quả', 120], ['Trạng thái', 140, 'c'], ['Ghi chú', 240], ['', 90, 'c']], d.items,
      (x) => `<td>${k.clamp(x.name)}</td><td>${k.clamp(whoTxt(x))}</td><td>${k.clamp(x.src)}</td><td class="num ${lateIds.has(x.id) ? 't-err' : ''}">${esc(dmy(x.due))}${lateIds.has(x.id) ? '<br><small>Quá hạn</small>' : ''}</td>
        <td class="c">${badge(...ST_IN[x.st])}</td><td>${x.note ? k.clamp(x.note) : k.dash}</td><td class="c">${canUpdItem(p, x) ? btn(`data-sxdv-item="${c}|${x.id}"`, 'Cập nhật') : ''}</td>`);
    const s11 = `<section class="vcard pad24" data-sxdv="B11">${secHead('B11', r, ed ? btn(`data-sxdv-item="${c}|"`, `${icon('add')} Giao đầu vào`) : '')}
      <p class="cap">PM giao việc làm rõ đầu ra, rà đầu vào kỹ thuật, nguồn lực, nguồn và căn cứ áp dụng; việc còn thiếu giữ trạng thái "Đang chuẩn bị", không làm mất nhiệm vụ.</p>${t11}</section>`;

    /* B1.2 */
    const docCell = (x, key) => (String(x[key] || '').trim() ? esc(x[key]) : '<span class="t-err">Thiếu</span>');
    const t12 = k.table([['Cấu hình', 200], ['Lô sản xuất', 160], ['BOM', 80], ['Hồ sơ kỹ thuật', 110], ['Định mức', 90], ['Chỉ tiêu được duyệt', 150], ['Phạm vi áp dụng', 170], ['Kết quả tiếp nhận', 150, 'c'], ['', 90, 'c']], d.cfgs,
      (x) => `<td>${k.clamp(x.cfg)}${verMismatch(x) ? `<br>${badge('Lệch phiên bản', 'warning')}` : ''}</td><td>${k.clamp(x.lot)}</td><td>${docCell(x, 'bom')}</td><td>${docCell(x, 'hskt')}</td><td>${docCell(x, 'dm')}</td><td>${docCell(x, 'ct')}</td>
        <td>${k.clamp(x.scope)}</td><td class="c">${badge(...ST_CFG[x.kq])}${x.note ? `<br><small class="faint">${esc(x.note)}</small>` : ''}</td><td class="c">${ed ? btn(`data-sxdv-cfg="${c}|${x.id}"`, 'Tiếp nhận') : ''}</td>`);
    const s12 = `<section class="vcard pad24" data-sxdv="B12">${secHead('B12', r, ed ? btn(`data-sxdv-cfg="${c}|"`, `${icon('add')} Thêm cấu hình / lô`) : '')}
      <p class="cap">Gắn hồ sơ với cấu hình, lô và phiên bản; chỉ ghi "Tiếp nhận đủ" khi đủ BOM, hồ sơ kỹ thuật, định mức, chỉ tiêu và cùng phiên bản — không dùng một mốc "đã bàn giao" chung.</p>${t12}</section>`;

    /* B1.3 */
    const t13 = k.table([['Hạng mục / gói', 280], ['Bên thực hiện', 140], ['Đầu mối', 190], ['Điều kiện kiểm tra, bàn giao', 280], ['Trạng thái', 120, 'c'], ['', 90, 'c']], d.scope,
      (x) => `<td>${k.clamp(x.name)}${x.note ? `<br><small class="faint">${esc(x.note)}</small>` : ''}</td><td>${x.side ? esc(SIDE[x.side]) : '<span class="t-err">Chưa xác định</span>'}</td><td>${whoTxt(x) ? k.clamp(whoTxt(x)) : '<span class="t-err">Chưa có</span>'}</td>
        <td>${x.check ? k.clamp(x.check) : '<span class="t-err">Chưa có</span>'}</td><td class="c">${badge(...ST_SC[x.st])}</td><td class="c">${ed ? btn(`data-sxdv-scope="${c}|${x.id}"`, 'Cập nhật') : ''}</td>`);
    const s13 = `<section class="vcard pad24" data-sxdv="B13">${secHead('B13', r, ed ? btn(`data-sxdv-scope="${c}|"`, `${icon('add')} Thêm hạng mục`) : '')}
      <p class="cap">Phân biệt phần VHT thực hiện, giao VMC hoặc thuê ngoài; mỗi gói có đầu mối và điều kiện kiểm tra, bàn giao. Gói chưa chốt chưa được chuẩn bị chính thức.</p>${t13}</section>`;

    /* B1.4 */
    const t14 = k.table([['Khoản chi phí', 240], ['Giá trị (triệu đồng)', 140, 'r'], ['Căn cứ giá', 220], ['Nguồn kinh phí', 150], ['Cập nhật', 100], ['Hiệu lực đến', 110], ['Leadtime (tuần)', 110, 'r'], ['Đánh giá', 220], ['', 90, 'c']], d.cost,
      (x) => { const is = costIssues(x); return `<td>${k.clamp(x.name)}</td><td class="r num">${num(x.amount)}</td><td>${x.basis ? k.clamp(x.basis) : '<span class="t-err">Chưa có căn cứ</span>'}</td><td>${x.src ? k.clamp(x.src) : k.dash}</td>
        <td class="num">${x.at ? esc(dmy(x.at)) : k.dash}</td><td class="num ${expired(x) ? 't-err' : ''}">${x.valid && x.valid < '2099' ? esc(dmy(x.valid)) : k.dash}</td>
        <td class="r num">${x.lt || k.dash}${x.lt >= LT_LONG ? `<br>${badge(x.early ? 'Đã đưa vào KH sớm' : 'Leadtime dài', x.early ? 'info' : 'warning')}` : ''}</td>
        <td>${is.length ? `<span class="t-err">${esc(is.join('; '))}</span>` : badge('Đủ căn cứ', 'success')}</td><td class="c">${ed ? btn(`data-sxdv-cost="${c}|${x.id}"`, 'Cập nhật') : ''}</td>`; },
      `<tfoot><tr class="sum"><td></td><td><b>Tổng cộng</b></td><td class="r num"><b>${num(r.total)}</b></td><td colspan="7">${d.budget ? `PAKD duyệt ${num(d.budget)} triệu · chênh lệch <b class="${r.diff > 0 ? 't-err' : ''}">${r.diff > 0 ? '+' : ''}${num(r.diff)}</b> triệu` : ''}</td></tr></tfoot>`);
    const s14 = `<section class="vcard pad24" data-sxdv="B14">${secHead('B14', r, ed ? btn(`data-sxdv-cost="${c}|"`, `${icon('add')} Thêm khoản chi phí`) : '')}
      <p class="cap">Mỗi khoản phải có căn cứ giá, nguồn, ngày cập nhật và còn hiệu lực; vật tư leadtime ≥ ${LT_LONG} tuần phải đưa vào kế hoạch từ đầu; chênh lệch so với PAKD được nêu để cấp có thẩm quyền quyết định.</p>${t14}</section>`;
    return `<div data-sx-dau-vao="${c}">${top}${s11}${s12}${s13}${s14}</div>`;
  }

  /* Cảnh báo đầu trang Chi tiết dự án (dự án đang Lập kế hoạch, chưa chốt đầu vào). */
  function headAlert(p) {
    if (p.status !== 'PLANNING') return '';
    const r = check(p);
    if (r.closed) return '';
    return `<div class="hd-alert warning">${icon('info')}<span>Đầu vào (B1): ${r.okN}/4 nội dung đủ căn cứ — ${r.ready ? 'sẵn sàng chốt đầu vào' : 'chưa đủ căn cứ để lập phương án sản xuất kinh doanh'}. <a class="link" data-sxda-tab="dv" data-sxda-code="${esc(p.code)}">Xem tab Đầu vào</a></span></div>`;
  }

  /* ---------- SX-22 Danh sách tiếp nhận nhiệm vụ ---------- */
  const F = { st: 'ALL' };
  function list() {
    const k = K(), head = (o) => window.Screens.head(o);
    const rows = P().visible().map((p) => ({ p, r: check(p) })).sort((a, b) => (a.r.closed ? 1 : 0) - (b.r.closed ? 1 : 0) || (a.p.code < b.p.code ? 1 : -1));
    const cnt = { ALL: rows.length, PREP: rows.filter((x) => !x.r.closed && !x.r.ready).length, READY: rows.filter((x) => !x.r.closed && x.r.ready).length, DONE: rows.filter((x) => x.r.closed).length };
    const show = rows.filter((x) => F.st === 'ALL' || (F.st === 'PREP' && !x.r.closed && !x.r.ready) || (F.st === 'READY' && !x.r.closed && x.r.ready) || (F.st === 'DONE' && x.r.closed));
    const info = { scr: 'SX-22', name: 'Tiếp nhận nhiệm vụ, hoàn thiện đầu vào', uc: 'CDS-BT-03COP COP2 B1 (B1.1–B1.4, tr. 84–85)',
      notes: ['Mỗi dự án có 4 nội dung B1.1–B1.4; % = số dòng đủ căn cứ / tổng số dòng. Dự án đã chốt kế hoạch gốc coi như đã chốt đầu vào.',
        '<b>Cổng chuyển tiếp</b>: đủ 4 nội dung mới bật nút Chốt đầu vào. GIẢ LẬP Q-SX-01: chưa chặn nút Khởi tạo phê duyệt kế hoạch, chỉ cảnh báo đầu trang chi tiết dự án — cần chốt có chặn cứng hay không.',
        'Dữ liệu cung cấp từ hệ thống khác (báo giá — Mua sắm/ĐTMS, nguồn vốn — Tài chính, hồ sơ — chuyển giao từ nghiên cứu) GIẢ LẬP nhập tay; thật: đồng bộ qua tích hợp.'], q: [] };
    const kpi = [['ALL', 'Tổng dự án', ''], ['PREP', 'Đang chuẩn bị', 'warn'], ['READY', 'Sẵn sàng chốt', 'info'], ['DONE', 'Đã chốt đầu vào', 'ok']]
      .map(([key, l, cls]) => `<button type="button" class="sxdv-kpi ${cls} ${F.st === key ? 'on' : ''}" data-sxdv-f="${key}"><span>${l}</span><b>${cnt[key]}</b></button>`).join('');
    const pc = (s) => `<span class="num ${s.ok ? '' : 't-err'}">${s.pct}%</span>`;
    const tbl = k.table([['Mã dự án', 150], ['Tên dự án', 320], ['Giám đốc dự án', 170], ['B1.1 Đầu vào', 100, 'r'], ['B1.2 Hồ sơ cấu hình, lô', 120, 'r'], ['B1.3 Phạm vi', 100, 'r'], ['B1.4 Chi phí', 100, 'r'], ['Trạng thái', 150, 'c']], show,
      ({ p, r }) => `<td><a class="link" data-go="sx/du-an/${encodeURIComponent(p.code)}/dv">${esc(p.code)}</a></td><td>${k.clamp(p.name)}</td><td>${k.clamp(pName(p.pm))}</td>
        <td class="r">${pc(r.sec.B11)}</td><td class="r">${pc(r.sec.B12)}</td><td class="r">${pc(r.sec.B13)}</td><td class="r">${pc(r.sec.B14)}</td><td class="c">${stateBadge(r)}</td>`);
    return `<div class="pg" data-sx-dv-list>${head({ title: 'Tiếp nhận nhiệm vụ, hoàn thiện đầu vào', info })}<div class="sxdv-kpis">${kpi}</div>${k.card('Danh sách dự án', tbl, 'Bấm mã dự án để mở tab Đầu vào (B1)')}</div>`;
  }

  /* ---------- Hộp thoại cập nhật ---------- */
  const B = () => window.EForms.b;
  const personOpts = () => D.personas.filter((x) => x.sx).map((x) => [x.id, `${x.name} — ${x.role}`]);
  async function itemDlg(code, id) {
    const { tf, ta, sel, dt, req, opts, L } = B(), p = P().byCode(code), d = dataOf(p), x = d.items.find((i) => i.id === id), pm = isPm(p);
    const comps = (pm ? [tf('name', 'Hạng mục đầu vào', req()), sel('who', 'Người cung cấp', Object.assign({ values: opts(personOpts()) }, L(8))), tf('unit', 'Hoặc đơn vị cung cấp', L(8)),
      tf('src', 'Nguồn, căn cứ', L(8)), dt('due', 'Hạn trả kết quả', req(L(8)))] : [B().txt(`**${x.name}**`)])
      .concat([sel('st', 'Trạng thái', req({ values: opts(Object.entries(ST_IN).map(([v, l]) => [v, l[0]])), layout: { columns: 8 } })), ta('note', 'Ghi chú (thiếu gì, cần ai hỗ trợ)')]);
    const v0 = x ? Object.assign({}, x, { due: dmy(x.due) }) : { st: 'CHUA', due: dmy(today()) };
    const r = await window.EFormRun.open({ title: x ? 'Cập nhật đầu vào' : 'Giao chuẩn bị đầu vào', schema: { id: 'sx-dv-item', components: comps }, values: v0,
      check: (v) => { if (pm && !fromDmy(v.due)) return 'Hạn trả kết quả phải đúng định dạng DD/MM/YYYY.'; if (pm && !v.who && !String(v.unit || '').trim()) return 'Cần chọn người hoặc nhập đơn vị cung cấp — việc chưa có người nhận chưa được coi là đã giao.'; if (v.st === 'THIEU' && !String(v.note || '').trim()) return 'Ghi rõ căn cứ còn thiếu.'; return null; } });
    if (!r || !r.submit) return;
    const v = r.values, n = pm ? { name: v.name, who: v.who || '', unit: v.who ? '' : v.unit, src: v.src, due: fromDmy(v.due), st: v.st, note: v.note } : { st: v.st, note: v.note };
    if (x) Object.assign(x, n); else d.items.push(Object.assign({ id: `I${Date.now()}` }, n));
    persist(); P().log(code, x ? 'Cập nhật đầu vào (B1.1)' : 'Giao chuẩn bị đầu vào (B1.1)', `${n.name || x.name}: ${ST_IN[n.st][0]}`);
    toast('<b>Thành công</b><br>Cập nhật đầu vào thành công!'); rerender();
  }
  async function cfgDlg(code, id) {
    const { tf, ta, sel, req, opts, L } = B(), p = P().byCode(code), d = dataOf(p), x = d.cfgs.find((i) => i.id === id);
    const comps = [tf('cfg', 'Cấu hình', req(L(8))), tf('lot', 'Lô sản xuất', req(L(8))), tf('bom', 'Phiên bản BOM', L(4)), tf('hskt', 'Phiên bản hồ sơ kỹ thuật', L(4)), tf('dm', 'Phiên bản định mức', L(4)), tf('ct', 'Chỉ tiêu được duyệt (số QĐ)', L(4)),
      tf('scope', 'Phạm vi áp dụng'), sel('kq', 'Kết quả tiếp nhận', req({ values: opts(Object.entries(ST_CFG).map(([v, l]) => [v, l[0]])), layout: { columns: 8 } })), ta('note', 'Ghi nhận phần thiếu, người bổ sung')];
    const r = await window.EFormRun.open({ title: x ? 'Tiếp nhận hồ sơ cấu hình, lô' : 'Thêm cấu hình / lô', schema: { id: 'sx-dv-cfg', components: comps }, values: x ? Object.assign({}, x) : { kq: 'CHUA' },
      check: (v) => {
        if (v.kq !== 'DAT') return v.kq === 'THIEU' && !String(v.note || '').trim() ? 'Ghi rõ phần thiếu và người bổ sung.' : null;
        const m = docsMissing(v); if (m.length) return `Chưa thể ghi "Tiếp nhận đủ": còn thiếu ${m.join(', ')}.`;
        if (verMismatch(v)) return 'Chưa thể ghi "Tiếp nhận đủ": BOM, hồ sơ kỹ thuật, định mức không cùng phiên bản.';
        if (!String(v.scope || '').trim()) return 'Chưa thể ghi "Tiếp nhận đủ": chưa có phạm vi áp dụng.'; return null; } });
    if (!r || !r.submit) return;
    const n = {}; ['cfg', 'lot', 'bom', 'hskt', 'dm', 'ct', 'scope', 'kq', 'note'].forEach((f) => { n[f] = r.values[f] || ''; });
    if (x) Object.assign(x, n); else d.cfgs.push(Object.assign({ id: `C${Date.now()}` }, n));
    persist(); P().log(code, 'Tiếp nhận hồ sơ cấu hình, lô (B1.2)', `${n.cfg} · ${n.lot}: ${ST_CFG[n.kq][0]}`);
    toast('<b>Thành công</b><br>Cập nhật tiếp nhận hồ sơ thành công!'); rerender();
  }
  async function scopeDlg(code, id) {
    const { tf, ta, sel, req, opts, L } = B(), p = P().byCode(code), d = dataOf(p), x = d.scope.find((i) => i.id === id);
    const comps = [tf('name', 'Hạng mục / gói', req()), sel('side', 'Bên thực hiện', Object.assign({ values: opts(Object.entries(SIDE)) }, L(8))), sel('who', 'Đầu mối (người)', Object.assign({ values: opts(personOpts()) }, L(8))),
      tf('unit', 'Hoặc đơn vị đầu mối', L(8)), sel('st', 'Trạng thái', req({ values: opts(Object.entries(ST_SC).map(([v, l]) => [v, l[0]])), layout: { columns: 8 } })), ta('check', 'Điều kiện kiểm tra, bàn giao'), ta('note', 'Ghi chú')];
    const r = await window.EFormRun.open({ title: x ? 'Cập nhật phạm vi, trách nhiệm' : 'Thêm hạng mục phạm vi', schema: { id: 'sx-dv-scope', components: comps }, values: x ? Object.assign({}, x) : { st: 'CHUA' },
      check: (v) => (v.st === 'CHOT' && (!v.side || (!v.who && !String(v.unit || '').trim()) || !String(v.check || '').trim()) ? 'Chỉ chốt khi đã có bên thực hiện, đầu mối và điều kiện kiểm tra, bàn giao.' : null) });
    if (!r || !r.submit) return;
    const v = r.values, n = { name: v.name, side: v.side || '', who: v.who || '', unit: v.who ? '' : v.unit || '', check: v.check || '', st: v.st, note: v.note || '' };
    if (x) Object.assign(x, n); else d.scope.push(Object.assign({ id: `S${Date.now()}` }, n));
    persist(); P().log(code, 'Cập nhật phạm vi, trách nhiệm (B1.3)', `${n.name}: ${ST_SC[n.st][0]}`);
    toast('<b>Thành công</b><br>Cập nhật phạm vi thành công!'); rerender();
  }
  async function costDlg(code, id) {
    const { tf, num: nf, dt, chk, req, L } = B(), p = P().byCode(code), d = dataOf(p), x = d.cost.find((i) => i.id === id);
    const comps = [tf('name', 'Khoản chi phí', req()), nf('amount', 'Giá trị (triệu đồng)', req({ validate: { required: true, min: 0 }, layout: { columns: 8 } })), tf('src', 'Nguồn kinh phí', L(8)),
      tf('basis', 'Căn cứ giá (báo giá, định mức, hợp đồng…)'), dt('at', 'Ngày cập nhật', L(8)), dt('valid', 'Hiệu lực đến', L(8)), nf('lt', 'Leadtime (tuần)', Object.assign({ validate: { min: 0 } }, L(8))),
      chk('early', 'Đã đưa vào kế hoạch sớm (vật tư leadtime dài)', L(8))];
    const v0 = x ? Object.assign({}, x, { at: dmy(x.at), valid: x.valid && x.valid < '2099' ? dmy(x.valid) : '' }) : { at: dmy(today()), lt: 0 };
    const r = await window.EFormRun.open({ title: x ? 'Cập nhật chi phí' : 'Thêm khoản chi phí', schema: { id: 'sx-dv-cost', components: comps }, values: v0,
      check: (v) => { for (const f of ['at', 'valid']) if (String(v[f] || '').trim() && !fromDmy(v[f])) return 'Ngày phải đúng định dạng DD/MM/YYYY.'; return null; } });
    if (!r || !r.submit) return;
    const v = r.values, n = { name: v.name, amount: Number(v.amount) || 0, src: v.src || '', basis: v.basis || '', at: fromDmy(v.at) || '', valid: fromDmy(v.valid) || '', lt: Number(v.lt) || 0, early: !!v.early };
    if (x) Object.assign(x, n); else d.cost.push(Object.assign({ id: `P${Date.now()}` }, n));
    persist(); P().log(code, 'Cập nhật chi phí (B1.4)', `${n.name}: ${num(n.amount)} triệu`);
    const is = costIssues(n);
    toast(is.length ? `Đã lưu. Khoản chi phí còn ${is.join('; ')}.` : '<b>Thành công</b><br>Cập nhật chi phí thành công!', is.length ? 'warn' : undefined); rerender();
  }
  function closeGate(code) {
    const p = P().byCode(code), r = check(p);
    if (!r.ready) { toast('Chưa đủ 4 nội dung đầu vào.', 'warn'); return; }
    r.d.closed = today(); persist();
    P().log(code, 'Chốt đầu vào (B1)', 'Đủ căn cứ: giao trách nhiệm, hồ sơ theo cấu hình / lô, phạm vi, chi phí');
    toast('<b>Thành công</b><br>Đã chốt đầu vào. Chuyển lập phương án / kế hoạch sản xuất.'); rerender();
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sxdv-item],[data-sxdv-cfg],[data-sxdv-scope],[data-sxdv-cost],[data-sxdv-close],[data-sxdv-f]');
    if (!t) return;
    if (t.dataset.sxdvF) { F.st = t.dataset.sxdvF; rerender(); return; }
    if (t.dataset.sxdvClose) { closeGate(t.dataset.sxdvClose); return; }
    const [kind, val] = ['item', 'cfg', 'scope', 'cost'].map((x) => [x, t.dataset['sxdv' + x[0].toUpperCase() + x.slice(1)]]).find(([, v]) => v != null);
    const [code, id] = val.split('|');
    ({ item: itemDlg, cfg: cfgDlg, scope: scopeDlg, cost: costDlg })[kind](code, id || null);
  });

  /* CSS riêng của màn (ô tổng quan 4 nội dung, KPI lọc). */
  const css = document.createElement('style');
  css.textContent = `.sxdv-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:4px 0 12px}
.sxdv-tile{border:1px solid #F6B3C0;background:#FFF0F3;border-radius:12px;padding:12px 14px}.sxdv-tile.ok{border-color:#5FE495;background:#E6F7EC}
.sxdv-tile .t{font-size:13px;color:#475467;min-height:36px}.sxdv-tile .v{font-size:24px;font-weight:700;margin:4px 0}
.sxdv-tile .bar{height:6px;background:#E4E7EC;border-radius:4px;overflow:hidden}.sxdv-tile .bar span{display:block;height:100%;background:#E5002D}.sxdv-tile.ok .bar span{background:#067647}
.sxdv-tile .m{font-size:12px;color:#667085;margin-top:6px}.sxdv-miss{margin:6px 0 0 18px;padding:0}.sxdv-miss li{margin:2px 0}
.sxdv-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
.sxdv-kpi{display:flex;flex-direction:column;align-items:flex-start;gap:4px;background:#fff;border:1px solid #E4E7EC;border-radius:12px;padding:12px 16px;cursor:pointer;font:inherit;text-align:left}
.sxdv-kpi b{font-size:24px}.sxdv-kpi.on{border-color:#E5002D;box-shadow:0 0 0 1px #E5002D}.sxdv-kpi.warn b{color:#B54708}.sxdv-kpi.info b{color:#2E5BDB}.sxdv-kpi.ok b{color:#067647}
`
  + `.hd-alert.success{background:#E6F7EC;border-color:#5FE495;color:#067647}
@media(max-width:900px){.sxdv-tiles,.sxdv-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);

  function reset() { U = {}; persist(); }
  window.SxDv = { projectTab, headAlert, list, check, reset };
})();
