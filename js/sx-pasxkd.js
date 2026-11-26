/* Phân hệ Quản lý sản xuất — Phương án sản xuất kinh doanh (PASXKD) — COP2 B1 (CDS-BT-03COP tr. 84–85). SX-22 danh sách, SX-23 chi tiết.
   Luồng: Nhiệm vụ đơn vị (sx-cong-viec.js, chưa có dự án) → Lập PASXKD (hoàn thiện đầu vào B1.1–B1.4) → Trình → Ban Giám đốc Khối phê duyệt / trả lại
   → PASXKD đã phê duyệt là căn cứ duy nhất để Thêm mới dự án sản xuất (sx-du-an.js) → dự án gắn ngược vào nhiệm vụ.
   Đầu vào: B1.1 giao trách nhiệm, tổ chức chuẩn bị; B1.2 tiếp nhận hồ sơ theo cấu hình, lô; B1.3 phạm vi, trách nhiệm các bên; B1.4 chi phí, kế hoạch tổng thể có căn cứ.
   Chỉ trình được khi đủ 4 nội dung. Phê duyệt trên màn (GIẢ LẬP — thật: luồng duyệt Camunda + ký số MySign).
   Route: #/sx/pasxkd, #/sx/pasxkd/create[/<mã nhiệm vụ>], #/sx/pasxkd/<mã>. Lưu localStorage sx-proto-pasxkd. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const P = () => window.SxDuAn;
  const CV = () => window.SxCv;
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const pid = () => Flow.state.persona;
  const role = () => D.roleOf(pid());
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const whoTxt = (x) => (x.who ? pName(x.who) || x.who : x.unit || '');
  const today = () => D.sxToday;
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;
  const KHOI = { K1: 'Khối 1', K2: 'Khối 2' };
  const LT_LONG = 16; // tuần — vật tư leadtime dài phải đưa vào kế hoạch từ đầu (GIẢ LẬP)
  const prodOf = (code) => D.sxProducts.find((x) => x.code === code) || null;
  const catName = (key, code) => { const r = window.Catalog.rows(key).find((x) => x.code === code); return r ? r.name : (code || ''); };

  /* ---------- Danh mục trạng thái ---------- */
  const STATUS = { DRAFT: ['Đang chuẩn bị', 'warning'], SUBMITTED: ['Chờ phê duyệt', 'info'], RETURNED: ['Trả lại', 'error'], APPROVED: ['Đã phê duyệt', 'success'] };
  const ST_IN = { CHUA: ['Chưa nhận', 'default'], DANG: ['Đang chuẩn bị', 'info'], THIEU: ['Thiếu căn cứ', 'error'], DU: ['Đủ căn cứ', 'success'] };
  const ST_CFG = { CHUA: ['Chưa tiếp nhận', 'default'], THIEU: ['Thiếu hồ sơ', 'error'], DAT: ['Tiếp nhận đủ', 'success'] };
  const SIDE = { VHT: 'VHT thực hiện', VMC: 'Giao VMC', THUE: 'Thuê ngoài' };
  const ST_SC = { CHUA: ['Chưa chốt', 'warning'], CHOT: ['Đã chốt', 'success'] };
  const DOCS = [['bom', 'BOM'], ['hskt', 'Hồ sơ kỹ thuật'], ['dm', 'Định mức'], ['ct', 'Chỉ tiêu được duyệt']];
  const SEC = [['B11', 'B1.1 Giao trách nhiệm, tổ chức chuẩn bị'], ['B12', 'B1.2 Tiếp nhận hồ sơ theo cấu hình, lô'], ['B13', 'B1.3 Phạm vi sản xuất, trách nhiệm các bên'], ['B14', 'B1.4 Chi phí, kế hoạch tổng thể có căn cứ']];

  /* ---------- Dữ liệu mẫu: thông tin quản lý của các PASXKD (D.sxPakd) ---------- */
  const EXTRA = {
    'PAKD-2026-214': { status: 'APPROVED', pm: 'sxpm', model: 'VMC_TONG_THAU', start: '2026-03-02', budget: 0, nv: null, approver: 'sxld', approvedAt: '2026-01-12 15:00', created: '2025-12-20' },
    'PAKD-2026-352': { status: 'APPROVED', pm: 'sxk2', model: 'VMC_TONG_THAU', start: '2026-12-01', budget: 330000, nv: 'NV-SX-2026-008', approver: 'sxld', approvedAt: '2026-10-28 16:30', created: '2026-10-15' },
    'PAKD-2026-388': { status: 'APPROVED', pm: 'sxk2', model: 'GIA_CONG', start: '2027-01-15', budget: 0, nv: null, approver: 'sxld', approvedAt: '2026-11-03 10:00', created: '2026-10-20' },
    'PAKD-2026-401': { status: 'SUBMITTED', pm: 'sxk2', model: 'GIA_CONG', start: '2027-03-01', budget: 52000, nv: 'NV-SX-2026-006', submittedAt: '2026-11-14 09:30', created: '2026-11-02' },
    'PAKD-2026-409': { status: 'DRAFT', pm: 'sxpm', model: 'VHT_TU_SX', start: '2027-01-04', budget: 96000, nv: 'NV-SX-2026-005', created: '2026-11-09' },
    'PAKD-2026-415': { status: 'APPROVED', pm: 'sxk2', model: 'GIA_CONG', start: '2026-12-15', budget: 0, nv: 'NV-SX-2026-007', approver: 'sxld', approvedAt: '2026-11-12 14:00', created: '2026-11-05' },
  };
  /* Đầu vào chi tiết có điểm thiếu (minh hoạ) — PASXKD RĐ-40 đợt 2 đang chuẩn bị. */
  const B1SEED = {
    'PAKD-2026-409': {
      items: [
        { name: 'Nhiệm vụ được giao (NV-SX-2026-005)', who: 'sxld', src: 'Kế hoạch SXKD 2027 — Khối 1', due: '2026-11-09', st: 'DU' },
        { name: 'Sản phẩm, số lượng, mốc yêu cầu của đơn vị sử dụng', who: 'sxkd', src: 'Văn bản đặt hàng của đơn vị sử dụng', due: '2026-11-12', st: 'DU' },
        { name: 'Danh sách cấu hình, chia lô sản xuất', who: 'sxrd', src: 'Kho sản phẩm sẵn sàng sản xuất RĐ-40 v1.3', due: '2026-11-14', st: 'DU' },
        { name: 'Hồ sơ kỹ thuật, BOM, định mức theo từng cấu hình', who: 'sxrd', src: 'Gói chuyển giao từ nghiên cứu', due: '2026-11-20', st: 'DANG', note: 'Cấu hình cơ động chưa có định mức; cấu hình cố định đợt 2 chưa bàn giao' },
        { name: 'Báo giá, giá tham chiếu vật tư chính', unit: 'Trung tâm Mua sắm', src: 'Báo giá nhà cung cấp; giá hợp đồng đợt 1', due: '2026-11-15', st: 'THIEU', note: 'Thiếu báo giá module T/R, FPGA; báo giá đợt 1 hết hiệu lực 31/10/2026' },
        { name: 'Năng lực tích hợp, đo kiểm của nhà máy', who: 'sxnm', src: 'Xác nhận năng lực nhà máy', due: '2026-11-25', st: 'CHUA' },
        { name: 'Nguồn kinh phí, chi phí vốn', unit: 'Phòng Tài chính', src: 'Kế hoạch tài chính năm 2027', due: '2026-11-22', st: 'DANG' },
      ],
      cfgs: [
        { cfg: 'Cấu hình cố định trên tháp', lot: 'Lô 1 — 3 bộ', bom: 'v1.3', hskt: 'v1.3', dm: 'v1.3', ct: 'QĐ 285/QĐ-VHT', scope: 'Trận địa cố định', kq: 'DAT' },
        { cfg: 'Cấu hình cơ động trên xe', lot: 'Lô 2 — 2 bộ', bom: 'v1.3', hskt: 'v1.2', dm: '', ct: 'QĐ 285/QĐ-VHT', scope: 'Cơ động', kq: 'THIEU', note: 'Thiếu định mức; hồ sơ kỹ thuật lệch phiên bản với BOM' },
        { cfg: 'Cấu hình huấn luyện', lot: 'Lô 3 — 1 bộ', bom: '', hskt: '', dm: '', ct: '', scope: 'Huấn luyện', kq: 'CHUA' },
      ],
      scope: [
        { name: 'Mua vật tư leadtime dài (module T/R, FPGA)', side: 'VHT', unit: 'Trung tâm Mua sắm', check: 'IQC khi nhập kho VHT', st: 'CHOT' },
        { name: 'Gia công kết cấu cơ khí, giá anten', side: 'THUE', unit: 'Nhà cung cấp gia công', check: 'Nghiệm thu đầu vào theo bản vẽ rev C', st: 'CHOT' },
        { name: 'Tích hợp, đo kiểm, thử nghiệm thực tế', side: 'VHT', who: 'sxpm', check: '', st: 'CHUA' },
        { name: 'Vận chuyển, lắp đặt tại trận địa', side: '', check: '', st: 'CHUA', note: 'Chưa thống nhất VHT tự lắp đặt hay thuê ngoài' },
      ],
      cost: [
        { name: 'Vật tư leadtime dài (module T/R, FPGA)', amount: 54000, basis: 'Báo giá nhà cung cấp 09/2026', src: 'Vốn lưu động 2027', at: '2026-09-20', valid: '2026-10-31', lt: 30, early: true },
        { name: 'Vật tư còn lại theo mBOM', amount: 21500, basis: 'Định mức mBOM v1.3 × giá hợp đồng đợt 1', src: 'Vốn lưu động 2027', at: '2026-11-08', valid: '2027-03-31', lt: 10 },
        { name: 'Gia công cơ khí, giá anten', amount: 14000, basis: '', src: 'Vốn lưu động 2027', at: '', valid: '', lt: 12 },
        { name: 'Thử nghiệm thực tế, đo kiểm', amount: 6800, basis: 'Báo giá Trung tâm Đo lường 10/2026', src: 'Chi phí dự án', at: '2026-10-15', valid: '2027-01-31', lt: 0 },
        { name: 'Vận chuyển, lắp đặt', amount: 2900, basis: 'Định mức 3% giá trị hàng', src: 'Chi phí dự án', at: '2026-11-08', valid: '2027-06-30', lt: 0 },
      ],
    },
  };
  /* Đầu vào khung (PASXKD tạo mới hoặc dữ liệu mẫu không có chi tiết): đã trình / đã phê duyệt → coi như đủ căn cứ. */
  function template(x, done) {
    const s = (ok) => (done ? ok : 'CHUA'), pr = prodOf(x.product), ver = (pr && pr.version) || 'v1.0';
    const items = [
      { name: x.nv ? `Nhiệm vụ được giao (${x.nv})` : 'Văn bản giao nhiệm vụ', who: x.pm, src: 'Quản lý nhiệm vụ', st: x.nv || done ? 'DU' : 'CHUA' },
      { name: 'Sản phẩm, số lượng, mốc yêu cầu của khách hàng', who: 'sxkd', src: 'Yêu cầu khách hàng / đơn vị sử dụng', st: s('DU') },
      { name: 'Hồ sơ kỹ thuật, BOM, định mức theo cấu hình', who: 'sxrd', src: 'Gói chuyển giao từ nghiên cứu', st: s('DU') },
      { name: 'Báo giá, giá tham chiếu vật tư chính', unit: 'Trung tâm Mua sắm', src: 'Báo giá nhà cung cấp', st: s('DU') },
      { name: 'Năng lực đơn vị sản xuất', unit: 'Trung tâm Sản xuất', src: 'Xác nhận năng lực', st: s('DU') },
      { name: 'Nguồn kinh phí', unit: 'Phòng Tài chính', src: 'Kế hoạch tài chính', st: s('DU') },
    ].map((i) => Object.assign({ due: x.created || today() }, i));
    const cfgs = [{ cfg: `Cấu hình chuẩn ${ver}`, lot: `Toàn bộ — ${num(x.qty)} ${x.unitName || ''}`, scope: 'Theo yêu cầu khách hàng',
      bom: done ? ver : '', hskt: done ? ver : '', dm: done ? ver : '', ct: done ? 'Đã phê duyệt' : '', kq: done ? 'DAT' : 'CHUA' }];
    const SC = {
      VHT_TU_SX: [['Mua linh kiện, vật tư', 'VHT', 'Trung tâm Mua sắm', 'IQC khi nhập kho'], ['Gia công bo mạch, cơ khí', 'THUE', 'Nhà cung cấp gia công', 'Nghiệm thu đầu vào theo lô'], ['Tích hợp, đo kiểm', 'VHT', 'Trung tâm Sản xuất', 'Đạt chỉ tiêu tại trạm đo']],
      VMC_TONG_THAU: [['Mua vật tư leadtime dài', 'VHT', 'Trung tâm Mua sắm', 'Cấp cho VMC theo phiếu xuất kho'], ['Sản xuất trọn gói', 'VMC', 'VMC', 'OQC trước bàn giao']],
      GIA_CONG: [['Cấp vật tư chính', 'VHT', 'Trung tâm Mua sắm', 'Biên bản giao nhận vật tư'], ['Gia công trọn gói', 'THUE', 'Nhà máy gia công', 'Nghiệm thu theo lô']],
    }[x.model] || [['Tổ chức sản xuất', '', '', '']];
    const scope = SC.map(([name, side, unit, check]) => ({ name, side: done ? side : '', unit: done ? unit : '', check: done ? check : '', st: done ? 'CHOT' : 'CHUA' }));
    const cost = [['Vật tư theo định mức', 'Định mức mBOM × giá hợp đồng'], ['Gia công, chế tạo', 'Báo giá đơn vị sản xuất'], ['Thử nghiệm, đo kiểm', 'Báo giá đơn vị đo lường']]
      .map(([name, basis]) => ({ name, amount: 0, basis: done ? basis : '', src: done ? 'Theo kế hoạch tài chính' : '', at: done ? (x.created || today()) : '', valid: done ? '2099-12-31' : '', lt: 0 }));
    return { items, cfgs, scope, cost };
  }

  /* ---------- Kho dữ liệu ---------- */
  const KEY = 'sx-proto-pasxkd';
  const blank = () => ({ created: [], edit: {}, b1: {}, hist: {} });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const SEED_HIST = (x) => [[`${x.created} 09:00`, x.pm, 'Lập phương án sản xuất kinh doanh', x.nv ? `Từ nhiệm vụ ${x.nv}` : '']]
    .concat(x.submittedAt || x.approvedAt ? [[x.submittedAt || `${(x.approvedAt || '').slice(0, 10)} 08:30`, x.pm, 'Trình phê duyệt', '']] : [])
    .concat(x.approvedAt ? [[x.approvedAt, x.approver, 'Phê duyệt', '']] : []);
  function all() {
    const seeds = (D.sxPakd || []).map((x) => Object.assign({}, x, EXTRA[x.code] || { status: 'APPROVED', pm: null, created: x.date }));
    return U.created.concat(seeds).map((x) => {
      const r = Object.assign({}, x, U.edit[x.code] || {});
      r.hist = (U.created.includes(x) ? [] : SEED_HIST(x)).concat(U.hist[x.code] || []);
      return r;
    });
  }
  const byCode = (code) => all().find((x) => x.code === code) || null;
  const projectOf = (code) => (P() ? P().all().find((p) => p.pakd === code) : null) || null;
  const addHist = (code, act, note) => { (U.hist[code] = U.hist[code] || []).push([nowStamp(), pid(), act, note || '']); };
  const ids = (l, pre) => l.map((x, i) => Object.assign({ id: `${pre}${i + 1}` }, x));
  function b1Of(x) {
    if (!U.b1[x.code]) {
      const s = B1SEED[x.code] ? JSON.parse(JSON.stringify(B1SEED[x.code])) : template(x, x.status !== 'DRAFT' && x.status !== 'RETURNED');
      U.b1[x.code] = { items: ids(s.items, 'I'), cfgs: ids(s.cfgs, 'C'), scope: ids(s.scope, 'S'), cost: ids(s.cost, 'P') };
    }
    return U.b1[x.code];
  }

  /* ---------- Phạm vi, quyền (GIẢ LẬP P-241: thật = IAM theo đơn vị) ---------- */
  const SCOPE = { sxpm: 'K1', sxsub: 'K1', sxrd: 'K1', sxqa: 'K1', sxgdtt: 'K1', sxk2: 'K2' };
  const visible = () => all().filter((x) => isAdmin() || !SCOPE[pid()] || SCOPE[pid()] === x.khoi || x.pm === pid());
  const isOwner = (x) => isAdmin() || x.pm === pid();
  const isApprover = () => isAdmin() || role() === 'R-SX-LD';
  const canCreate = () => isAdmin() || role() === 'R-SX-PM';
  const editable = (x) => ['DRAFT', 'RETURNED'].includes(x.status) && isOwner(x);
  const canUpdItem = (x, it) => ['DRAFT', 'RETURNED'].includes(x.status) && (isOwner(x) || it.who === pid());
  const canMakeProject = (x) => x.status === 'APPROVED' && !projectOf(x.code) && (isAdmin() || role() === 'R-SX-PM');
  /* Số việc chờ tôi: Lãnh đạo — PASXKD chờ phê duyệt; người lập — PASXKD đang chuẩn bị / bị trả lại / đã duyệt chưa lập dự án. */
  const myCount = () => visible().filter((x) => (x.status === 'SUBMITTED' && isApprover() && !isAdmin()) || (x.pm === pid() && (['DRAFT', 'RETURNED'].includes(x.status) || canMakeProject(x)))).length;

  /* ---------- Đánh giá đủ / thiếu ---------- */
  const expired = (c) => !!c.valid && c.valid < today();
  const verMismatch = (c) => { const v = [c.bom, c.hskt, c.dm].filter(Boolean); return v.length > 1 && new Set(v).size > 1; };
  const docsMissing = (c) => DOCS.filter(([k]) => !String(c[k] || '').trim()).map(([, l]) => l);
  const costIssues = (c) => [!c.basis ? 'chưa có căn cứ giá' : '', expired(c) ? `căn cứ hết hiệu lực ${dmy(c.valid)}` : '', c.lt >= LT_LONG && !c.early ? `leadtime ${c.lt} tuần chưa đưa vào kế hoạch sớm` : ''].filter(Boolean);
  function check(x) {
    const d = b1Of(x);
    const s11 = d.items.filter((i) => i.st !== 'DU').map((i) => `${i.name} — ${ST_IN[i.st][0].toLowerCase()}`);
    const late = d.items.filter((i) => i.st !== 'DU' && i.due && i.due < today());
    const s12 = d.cfgs.filter((i) => i.kq !== 'DAT').map((i) => `${i.cfg} · ${i.lot} — ${ST_CFG[i.kq][0].toLowerCase()}`);
    if (!d.cfgs.length) s12.push('Chưa có cấu hình, lô nào');
    const s13 = d.scope.filter((i) => i.st !== 'CHOT').map((i) => `${i.name} — chưa chốt`);
    const s14 = d.cost.map((c) => [c, costIssues(c)]).filter(([, i]) => i.length).map(([c, i]) => `${c.name} — ${i.join('; ')}`);
    const total = d.cost.reduce((a, c) => a + Number(c.amount || 0), 0), budget = Number(x.budget || 0), diff = budget ? total - budget : 0;
    if (budget && diff > 0) s14.push(`Tổng chi phí ${num(total)} triệu vượt dự toán ${num(diff)} triệu (${(diff / budget * 100).toFixed(1).replace('.', ',')}%) — cần xử lý chênh lệch`);
    const pct = (ok, n) => (n ? Math.round(ok / n * 100) : 0);
    const sec = {
      B11: { miss: s11, pct: pct(d.items.length - s11.length, d.items.length), late },
      B12: { miss: s12, pct: pct(d.cfgs.filter((i) => i.kq === 'DAT').length, d.cfgs.length) },
      B13: { miss: s13, pct: pct(d.scope.length - s13.length, d.scope.length) },
      B14: { miss: s14, pct: pct(d.cost.filter((c) => !costIssues(c).length).length, d.cost.length) },
    };
    Object.values(sec).forEach((s) => { s.ok = !s.miss.length; s.pct = s.ok ? 100 : Math.min(99, s.pct); });
    const okN = Object.values(sec).filter((s) => s.ok).length;
    return { d, sec, okN, ready: okN === 4, total, diff, budget };
  }
  const stBadge = (x) => (x.status === 'APPROVED' && projectOf(x.code) ? badge('Đã lập dự án', 'success') : badge(...STATUS[x.status]));
  const href = (x) => 'sx/pasxkd/' + encodeURIComponent(x.code);

  /* ---------- SX-22 Danh sách ---------- */
  const F = { st: 'ALL' };
  const GROUP = { ALL: () => true, DRAFT: (x) => ['DRAFT', 'RETURNED'].includes(x.status), SUBMITTED: (x) => x.status === 'SUBMITTED', APPROVED: (x) => x.status === 'APPROVED' && !projectOf(x.code), PROJECT: (x) => !!projectOf(x.code) };
  function list() {
    const k = K(), rows = visible().sort((a, b) => (a.created < b.created ? 1 : -1));
    const show = rows.filter(GROUP[F.st]);
    const info = { scr: 'SX-22', name: 'Danh sách phương án sản xuất kinh doanh', uc: 'CDS-BT-03COP COP2 B1 (B1.1–B1.4, tr. 84–85); QT-TTSX-4A11 §5.1 (đầu vào: phương án được phê duyệt)',
      notes: ['<b>Luồng</b>: Nhiệm vụ đơn vị (chưa có dự án) → <b>Lập PASXKD</b> (hoàn thiện đầu vào B1.1–B1.4) → Trình → Ban Giám đốc Khối phê duyệt / trả lại → <b>Lập dự án sản xuất</b> từ PASXKD đã phê duyệt (một PASXKD một dự án) → dự án gắn vào nhiệm vụ.',
        'Chỉ trình được khi đủ 4 nội dung đầu vào. % đủ căn cứ = số dòng đủ / tổng số dòng của từng nội dung.',
        'Ô chỉ số lọc nhanh. Thêm mới: người có vai Giám đốc dự án, chọn nhiệm vụ đơn vị chưa có dự án và chưa có PASXKD.',
        'GIẢ LẬP: phê duyệt ngay trên màn (thật: luồng duyệt Camunda của phân hệ, ký số MySign); báo giá, nguồn vốn, hồ sơ chuyển giao nhập tay (thật: đồng bộ từ ĐTMS / Tài chính / Quản lý hồ sơ KHCN).'], q: [] };
    const cnt = (g) => rows.filter(GROUP[g]).length;
    const kpi = [['ALL', 'Tổng số', ''], ['DRAFT', 'Đang chuẩn bị / trả lại', 'warn'], ['SUBMITTED', 'Chờ phê duyệt', 'info'], ['APPROVED', 'Đã duyệt, chưa lập dự án', 'ok'], ['PROJECT', 'Đã lập dự án', '']]
      .map(([g, l, cls]) => `<button type="button" class="sxpa-kpi ${cls} ${F.st === g ? 'on' : ''}" data-sxpa-f="${g}"><span>${l}</span><b>${cnt(g)}</b></button>`).join('');
    const pcs = (x) => { if (x.status === 'APPROVED') return '<span class="faint">Đã đủ</span>'; const r = check(x); return `<span class="num ${r.ready ? '' : 't-err'}">${r.okN}/4</span>`; };
    const tbl = k.table([['Phương án sản xuất kinh doanh', 380], ['Nhiệm vụ', 300], ['Sản phẩm', 110], ['Số lượng', 110, 'r'], ['Người lập', 160], ['Đủ đầu vào', 100, 'c'], ['Trạng thái', 150, 'c'], ['Dự án sản xuất', 300]], show,
      (x) => { const p = projectOf(x.code); return `<td>${NC(x.title, x.no, { go: href(x), tip: 'Xem chi tiết phương án sản xuất kinh doanh' })}</td>
        <td>${x.nv ? NC(((CV() && CV().byCode(x.nv)) || {}).title, x.nv, { go: `sx/cong-viec/${encodeURIComponent(x.nv)}`, tip: 'Xem chi tiết nhiệm vụ' }) : k.dash}</td><td>${esc(x.product)}</td><td class="r num">${num(x.qty)} ${esc(x.unitName || '')}</td>
        <td>${k.clamp(pName(x.pm))}</td><td class="c">${pcs(x)}</td><td class="c">${stBadge(x)}</td><td>${p ? NC(p.name, p.code, { go: `sx/du-an/${encodeURIComponent(p.code)}`, tip: 'Xem chi tiết dự án' }) : k.dash}</td>`; });
    const right = canCreate() ? `<button type="button" class="vbtn primary" data-sxpa-new="">${icon('add')} Thêm mới</button>` : '';
    return `<div class="pg" data-sx-pa-list>${head({ title: 'Phương án sản xuất kinh doanh', info, right })}<div class="sxpa-kpis">${kpi}</div>${k.card('Danh sách phương án sản xuất kinh doanh', tbl)}</div>`;
  }

  /* ---------- SX-23 Chi tiết ---------- */
  const btn = (attr, label, cls) => `<button type="button" class="vbtn sm ${cls || 'secondary'}" ${attr}>${label}</button>`;
  function detail(code) {
    const k = K(), x = byCode(code);
    if (!x || !visible().some((y) => y.code === code)) return `<div class="pg">${head({ title: 'Chi tiết phương án sản xuất kinh doanh', back: 'sx/pasxkd', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy phương án hoặc bạn không có quyền xem.')}</div>`;
    const r = check(x), p = projectOf(x.code), pr = prodOf(x.product), c = esc(x.code), ed = editable(x);
    const info = { scr: 'SX-23', name: 'Chi tiết phương án sản xuất kinh doanh', uc: 'CDS-BT-03COP COP2 B1.1–B1.4',
      notes: ['Tab <b>Hoàn thiện đầu vào</b>: B1.1 người / đơn vị cung cấp, nguồn, hạn, trạng thái (việc thiếu giữ "Đang chuẩn bị", không mất nhiệm vụ); B1.2 hồ sơ theo cấu hình × lô, chỉ "Tiếp nhận đủ" khi đủ BOM / hồ sơ kỹ thuật / định mức / chỉ tiêu cùng phiên bản; B1.3 phạm vi VHT / VMC / thuê ngoài, chỉ chốt khi có đầu mối + điều kiện bàn giao; B1.4 chi phí có căn cứ, hiệu lực, leadtime dài, chênh lệch với giá trị dự toán.',
        'Sửa được khi Đang chuẩn bị / Trả lại (người lập); người được giao ở B1.1 cập nhật dòng của mình. Chờ phê duyệt / Đã phê duyệt: chỉ xem.',
        'Đã phê duyệt → nút <b>Lập dự án sản xuất</b> mở Thêm mới dự án, điền sẵn từ phương án; sản phẩm phải có trong Kho sản phẩm sẵn sàng sản xuất.'], q: [] };
    const right = (ed ? `<button type="button" class="vbtn secondary" data-sxpa-edit="${c}">${icon('edit')} Chỉnh sửa</button>` : '')
      + (ed ? `<button type="button" class="vbtn primary" data-sxpa-submit="${c}" ${r.ready ? '' : 'disabled title="Chưa đủ 4 nội dung đầu vào"'}>Trình phê duyệt</button>` : '')
      + (x.status === 'SUBMITTED' && isApprover() ? `<button type="button" class="vbtn secondary" data-sxpa-return="${c}">Trả lại</button><button type="button" class="vbtn primary" data-sxpa-approve="${c}">Phê duyệt</button>` : '')
      + (canMakeProject(x) ? `<button type="button" class="vbtn primary" data-go="sx/du-an/create/${encodeURIComponent(x.code)}">${icon('add')} Lập dự án sản xuất</button>` : '');
    const lastRet = x.status === 'RETURNED' ? x.hist.slice().reverse().find((h) => h[2] === 'Trả lại') : null;
    const alerts = [
      lastRet ? `<div class="hd-alert error">${icon('info')}<span>Ban Giám đốc Khối trả lại ngày ${esc(dmy(lastRet[0]))}: ${esc(lastRet[3])}</span></div>` : '',
      ed && !r.ready ? `<div class="hd-alert warning">${icon('info')}<span>Chưa đủ căn cứ để trình: ${r.okN}/4 nội dung đầu vào đủ. Xem tab Hoàn thiện đầu vào.</span></div>` : '',
      x.status === 'SUBMITTED' ? `<div class="hd-alert info">${icon('info')}<span>Đang chờ Ban Giám đốc Khối phê duyệt${x.submittedAt ? ` (trình ngày ${esc(dmy(x.submittedAt))})` : ''}.</span></div>` : '',
      x.status === 'APPROVED' && !p ? `<div class="hd-alert ${pr && window.SxCg.ready(pr.code) ? 'info' : 'warning'}">${icon('info')}<span>${pr && window.SxCg.ready(pr.code) ? 'Phương án đã phê duyệt — sẵn sàng lập dự án sản xuất.' : `Phương án đã phê duyệt nhưng sản phẩm ${esc(x.product)} chưa có trong Kho sản phẩm sẵn sàng sản xuất — chưa lập được dự án.`}</span></div>` : '',
    ].join('');
    const tInfo = () => k.card('Thông tin chung', `<div class="ginfo c3">
      ${k.kv('Số phương án', esc(x.no))}${k.kv('Tên phương án', esc(x.title), 'span2')}
      ${k.kv('Trạng thái', stBadge(x))}${k.kv('Khối', esc(KHOI[x.khoi] || ''))}${k.kv('Nhiệm vụ được giao', x.nv ? `<a class="link" data-go="sx/cong-viec/${encodeURIComponent(x.nv)}">${esc(x.nv)}</a>` : null)}
      ${k.kv('Sản phẩm', esc(`${x.product}${pr ? ' — ' + pr.name : ''}`), 'span2')}${k.kv('Phiên bản', pr ? esc(pr.version) : null)}
      ${k.kv('Số lượng', `${num(x.qty)} ${esc(x.unitName || '')}`)}${k.kv('Khách hàng / đơn vị sử dụng', esc(x.customer || ''), 'span2')}
      ${k.kv('Mô hình tổ chức dự kiến', x.model ? esc(catName('sx-mo-hinh', x.model)) : null)}${k.kv('Bắt đầu dự kiến', x.start ? esc(dmy(x.start)) : null)}${k.kv('Hạn giao hàng', esc(dmy(x.due)))}
      ${k.kv('Giá trị dự toán (triệu đồng)', x.budget ? num(x.budget) : null)}${k.kv('Kế hoạch SXKD năm', x.kh ? esc(((D.sxKhsxkd || []).find((y) => y.code === x.kh) || {}).title || x.kh) : null, 'span2')}
      ${k.kv('Người lập', esc(pName(x.pm)))}${k.kv('Ngày lập', esc(dmy(x.created)))}${k.kv('Đủ đầu vào', `${r.okN}/4 nội dung`)}
      ${k.kv('Người phê duyệt', x.approver ? esc(pName(x.approver)) : null)}${k.kv('Ngày phê duyệt', x.approvedAt ? esc(dmy(x.approvedAt)) : null)}
      ${k.kv('Dự án sản xuất', p ? `<a class="link" data-go="sx/du-an/${encodeURIComponent(p.code)}">${esc(p.code)} — ${esc(p.name)}</a>` : null)}</div>`);
    const tHist = () => k.card('Lịch sử', k.table([['Thời gian', 160], ['Người thực hiện', 200], ['Hành động', 220], ['Nội dung', 420]], x.hist.slice().sort((a, b) => (a[0] < b[0] ? 1 : -1)),
      (h) => `<td class="num">${esc(dmy(h[0]))}</td><td>${k.clamp(pName(h[1]))}</td><td>${k.clamp(h[2])}</td><td>${h[3] ? k.clamp(h[3]) : k.dash}</td>`));
    return `<div class="pg" data-sx-pa="${c}">${head({ title: 'Chi tiết phương án sản xuất kinh doanh', back: 'sx/pasxkd', lg: true, info, right })}
      ${alerts ? `<div class="hd-alerts">${alerts}</div>` : ''}
      ${k.tabs('pa:' + x.code, [['info', 'Thông tin chung'], ['dv', 'Hoàn thiện đầu vào'], ['hist', 'Lịch sử']], { info: tInfo, dv: () => inputs(x, r), hist: tHist })}</div>`;
  }

  /* Tab Hoàn thiện đầu vào: tổng quan + B1.1–B1.4. */
  function secHead(code, r, extra) {
    const s = r.sec[code], name = SEC.find((y) => y[0] === code)[1];
    return `<div class="vcard-h"><h3>${esc(name)}</h3><div class="row">${badge(s.ok ? 'Đủ' : `Còn ${s.miss.length} điểm thiếu`, s.ok ? 'success' : 'warning')}${extra || ''}</div></div>`;
  }
  function inputs(x, r) {
    const k = K(), d = r.d, ed = editable(x), c = esc(x.code);
    const tiles = SEC.map(([code, name]) => { const s = r.sec[code]; return `<div class="sxpa-tile ${s.ok ? 'ok' : ''}"><div class="t">${esc(name)}</div><div class="v">${s.pct}%</div>
      <div class="bar"><span style="width:${s.pct}%"></span></div><div class="m">${s.ok ? 'Đủ căn cứ' : `${s.miss.length} điểm thiếu`}</div></div>`; }).join('');
    const miss = SEC.flatMap(([code]) => r.sec[code].miss.map((m) => `<li><b>${code.replace('B1', 'B1.')}</b> ${esc(m)}</li>`));
    const gate = r.ready ? `<div class="hd-alert success">${icon('info')}<span>Đủ 4 nội dung đầu vào${ed ? ' — có thể trình phê duyệt' : ''}.</span></div>`
      : `<div class="hd-alert warning">${icon('info')}<span><b>Chưa đủ căn cứ để trình phương án</b> — ${miss.length} điểm còn thiếu:<ul class="sxpa-miss">${miss.slice(0, 8).join('')}${miss.length > 8 ? `<li>… và ${miss.length - 8} điểm khác</li>` : ''}</ul></span></div>`;
    const top = `<section class="vcard pad24" data-sxpa-sum><div class="vcard-h"><h3>Mức độ đủ căn cứ</h3><span class="cap">${r.okN}/4 nội dung đủ căn cứ</span></div>
      <div class="sxpa-tiles">${tiles}</div><div class="hd-alerts">${gate}</div></section>`;
    const lateIds = new Set(r.sec.B11.late.map((i) => i.id));
    const t11 = k.table([['Hạng mục đầu vào', 280], ['Người / đơn vị cung cấp', 190], ['Nguồn, căn cứ', 220], ['Hạn trả kết quả', 120], ['Trạng thái', 140, 'c'], ['Ghi chú', 240], ['', 90, 'c']], d.items,
      (i) => `<td>${k.clamp(i.name)}</td><td>${k.clamp(whoTxt(i))}</td><td>${k.clamp(i.src)}</td><td class="num ${lateIds.has(i.id) ? 't-err' : ''}">${esc(dmy(i.due))}${lateIds.has(i.id) ? '<br><small>Quá hạn</small>' : ''}</td>
        <td class="c">${badge(...ST_IN[i.st])}</td><td>${i.note ? k.clamp(i.note) : k.dash}</td><td class="c">${canUpdItem(x, i) ? btn(`data-sxpa-item="${c}|${i.id}"`, 'Cập nhật') : ''}</td>`);
    const s11 = `<section class="vcard pad24" data-sxpa="B11">${secHead('B11', r, ed ? btn(`data-sxpa-item="${c}|"`, `${icon('add')} Giao đầu vào`) : '')}
      <p class="cap">Giao việc làm rõ đầu ra, rà đầu vào kỹ thuật, nguồn lực, nguồn và căn cứ áp dụng; việc còn thiếu giữ "Đang chuẩn bị", không làm mất nhiệm vụ khỏi theo dõi.</p>${t11}</section>`;
    const docCell = (i, key) => (String(i[key] || '').trim() ? esc(i[key]) : '<span class="t-err">Thiếu</span>');
    const t12 = k.table([['Cấu hình', 200], ['Lô sản xuất', 160], ['BOM', 80], ['Hồ sơ kỹ thuật', 110], ['Định mức', 90], ['Chỉ tiêu được duyệt', 150], ['Phạm vi áp dụng', 170], ['Kết quả tiếp nhận', 150, 'c'], ['', 90, 'c']], d.cfgs,
      (i) => `<td>${k.clamp(i.cfg)}${verMismatch(i) ? `<br>${badge('Lệch phiên bản', 'warning')}` : ''}</td><td>${k.clamp(i.lot)}</td><td>${docCell(i, 'bom')}</td><td>${docCell(i, 'hskt')}</td><td>${docCell(i, 'dm')}</td><td>${docCell(i, 'ct')}</td>
        <td>${k.clamp(i.scope)}</td><td class="c">${badge(...ST_CFG[i.kq])}${i.note ? `<br><small class="faint">${esc(i.note)}</small>` : ''}</td><td class="c">${ed ? btn(`data-sxpa-cfg="${c}|${i.id}"`, 'Tiếp nhận') : ''}</td>`);
    const s12 = `<section class="vcard pad24" data-sxpa="B12">${secHead('B12', r, ed ? btn(`data-sxpa-cfg="${c}|"`, `${icon('add')} Thêm cấu hình / lô`) : '')}
      <p class="cap">Gắn hồ sơ với cấu hình, lô, phiên bản; chỉ "Tiếp nhận đủ" khi đủ BOM, hồ sơ kỹ thuật, định mức, chỉ tiêu và cùng phiên bản — không dùng một mốc "đã bàn giao" chung.</p>${t12}</section>`;
    const t13 = k.table([['Hạng mục / gói', 280], ['Bên thực hiện', 140], ['Đầu mối', 190], ['Điều kiện kiểm tra, bàn giao', 280], ['Trạng thái', 120, 'c'], ['', 90, 'c']], d.scope,
      (i) => `<td>${k.clamp(i.name)}${i.note ? `<br><small class="faint">${esc(i.note)}</small>` : ''}</td><td>${i.side ? esc(SIDE[i.side]) : '<span class="t-err">Chưa xác định</span>'}</td><td>${whoTxt(i) ? k.clamp(whoTxt(i)) : '<span class="t-err">Chưa có</span>'}</td>
        <td>${i.check ? k.clamp(i.check) : '<span class="t-err">Chưa có</span>'}</td><td class="c">${badge(...ST_SC[i.st])}</td><td class="c">${ed ? btn(`data-sxpa-scope="${c}|${i.id}"`, 'Cập nhật') : ''}</td>`);
    const s13 = `<section class="vcard pad24" data-sxpa="B13">${secHead('B13', r, ed ? btn(`data-sxpa-scope="${c}|"`, `${icon('add')} Thêm hạng mục`) : '')}
      <p class="cap">Phân biệt phần VHT thực hiện, giao VMC hoặc thuê ngoài; mỗi gói có đầu mối và điều kiện kiểm tra, bàn giao. Gói chưa chốt chưa được chuẩn bị chính thức.</p>${t13}</section>`;
    const t14 = k.table([['Khoản chi phí', 240], ['Giá trị (triệu đồng)', 140, 'r'], ['Căn cứ giá', 220], ['Nguồn kinh phí', 150], ['Cập nhật', 100], ['Hiệu lực đến', 110], ['Leadtime (tuần)', 110, 'r'], ['Đánh giá', 220], ['', 90, 'c']], d.cost,
      (i) => { const is = costIssues(i); return `<td>${k.clamp(i.name)}</td><td class="r num">${num(i.amount)}</td><td>${i.basis ? k.clamp(i.basis) : '<span class="t-err">Chưa có căn cứ</span>'}</td><td>${i.src ? k.clamp(i.src) : k.dash}</td>
        <td class="num">${i.at ? esc(dmy(i.at)) : k.dash}</td><td class="num ${expired(i) ? 't-err' : ''}">${i.valid && i.valid < '2099' ? esc(dmy(i.valid)) : k.dash}</td>
        <td class="r num">${i.lt || k.dash}${i.lt >= LT_LONG ? `<br>${badge(i.early ? 'Đã đưa vào KH sớm' : 'Leadtime dài', i.early ? 'info' : 'warning')}` : ''}</td>
        <td>${is.length ? `<span class="t-err">${esc(is.join('; '))}</span>` : badge('Đủ căn cứ', 'success')}</td><td class="c">${ed ? btn(`data-sxpa-cost="${c}|${i.id}"`, 'Cập nhật') : ''}</td>`; },
      `<tfoot><tr class="sum"><td></td><td><b>Tổng cộng</b></td><td class="r num"><b>${num(r.total)}</b></td><td colspan="7">${r.budget ? `Giá trị dự toán ${num(r.budget)} triệu · chênh lệch <b class="${r.diff > 0 ? 't-err' : ''}">${r.diff > 0 ? '+' : ''}${num(r.diff)}</b> triệu` : ''}</td></tr></tfoot>`);
    const s14 = `<section class="vcard pad24" data-sxpa="B14">${secHead('B14', r, ed ? btn(`data-sxpa-cost="${c}|"`, `${icon('add')} Thêm khoản chi phí`) : '')}
      <p class="cap">Mỗi khoản có căn cứ giá, nguồn, ngày cập nhật và còn hiệu lực; vật tư leadtime ≥ ${LT_LONG} tuần đưa vào kế hoạch từ đầu; chênh lệch với giá trị dự toán nêu để cấp có thẩm quyền quyết định.</p>${t14}</section>`;
    return `<div data-sxpa-inputs>${top}${s11}${s12}${s13}${s14}</div>`;
  }

  /* ---------- Hộp thoại ---------- */
  const B = () => window.EForms.b;
  const personOpts = () => D.personas.filter((p) => p.sx).map((p) => [p.id, `${p.name} — ${p.role}`]);
  /* Nhiệm vụ đơn vị lập được PASXKD: chưa gắn dự án, chưa có PASXKD (bị trả lại vẫn là PASXKD đó), người đầu mối là tôi (hoặc quản trị). */
  const freeTasks = () => (CV() ? CV().all() : []).filter((t) => t.kind === 'DV' && !t.project && !t.parent && !all().some((x) => x.nv === t.code) && (isAdmin() || t.owner === pid()));
  async function infoDlg(code, nv) {
    const { tf, ta, sel, num: nf, dt, req, opts, L, txt } = B(), x = code ? byCode(code) : null;
    const tasks = freeTasks();
    if (!x && !tasks.length) { toast('Bạn không có nhiệm vụ đơn vị nào chưa có dự án để lập phương án. Giao nhiệm vụ ở Quản lý nhiệm vụ › Nhiệm vụ đơn vị trước.', 'warn'); return; }
    const kh = SCOPE[pid()];
    const comps = [x ? txt(`Nhiệm vụ: **${x.nv || '—'}**`) : sel('nv', 'Nhiệm vụ được giao', req({ values: opts(tasks.map((t) => [t.code, `${t.code} — ${t.title}`])) })),
      tf('title', 'Tên phương án', req()), sel('khoi', 'Khối', req({ values: opts(Object.entries(KHOI)), layout: { columns: 8 } })),
      sel('product', 'Sản phẩm', req({ values: opts(D.sxProducts.map((p) => [p.code, `${p.code} — ${p.name} (${p.version})`])), layout: { columns: 8 } })),
      nf('qty', 'Số lượng', req({ validate: { required: true, min: 1 }, layout: { columns: 8 } })), sel('unitName', 'Đơn vị tính', req({ values: opts(['bộ', 'thiết bị', 'trạm', 'chiếc']), layout: { columns: 8 } })),
      tf('customer', 'Khách hàng / đơn vị sử dụng'), sel('model', 'Mô hình tổ chức dự kiến', req({ values: opts(window.Catalog.rows('sx-mo-hinh').map((r) => [r.code, r.name])), layout: { columns: 8 } })),
      nf('budget', 'Giá trị dự toán (triệu đồng)', Object.assign({ validate: { min: 0 } }, L(8))), dt('start', 'Bắt đầu dự kiến', req(L(8))), dt('due', 'Hạn giao hàng', req(L(8))),
      sel('kh', 'Kế hoạch SXKD năm', Object.assign({ values: opts((D.sxKhsxkd || []).map((y) => [y.code, y.title])) }, L(16))), ta('note', 'Ghi chú')];
    const t0 = nv && tasks.find((t) => t.code === nv);
    const v0 = x ? Object.assign({}, x, { start: dmy(x.start), due: dmy(x.due) })
      : { nv: t0 ? t0.code : null, title: t0 ? t0.title.replace(/^Lập phương án sản xuất kinh doanh\s*/i, 'Phương án sản xuất kinh doanh ') : '', khoi: kh || null, unitName: 'bộ' };
    const r = await window.EFormRun.open({ title: x ? 'Chỉnh sửa phương án sản xuất kinh doanh' : 'Lập phương án sản xuất kinh doanh', schema: { id: 'sx-pa-info', components: comps }, values: v0,
      check: (v) => { const s = fromDmy(v.start), e = fromDmy(v.due); if (!s || !e) return 'Ngày phải đúng định dạng DD/MM/YYYY.'; if (e <= s) return 'Hạn giao hàng phải sau ngày bắt đầu dự kiến.';
        const pr = prodOf(v.product); if (pr && pr.khoi !== v.khoi) return `Sản phẩm ${pr.code} không thuộc ${KHOI[v.khoi]}.`; return null; } });
    if (!r || !r.submit) return;
    const v = r.values, data = { title: v.title.trim(), khoi: v.khoi, product: v.product, qty: Number(v.qty), unitName: v.unitName, customer: (v.customer || '').trim(), model: v.model,
      budget: Number(v.budget) || 0, start: fromDmy(v.start), due: fromDmy(v.due), kh: v.kh || null, note: v.note || '' };
    if (x) {
      const own = U.created.find((y) => y.code === x.code);
      if (own) Object.assign(own, data); else U.edit[x.code] = Object.assign(U.edit[x.code] || {}, data);
      addHist(x.code, 'Cập nhật thông tin phương án', ''); persist(); toast('<b>Thành công</b><br>Cập nhật thành công!'); rerender(); return;
    }
    const n = Math.max(0, ...all().map((y) => Number(y.code.slice(-3)) || 0)) + 1, codeN = 'PAKD-2026-' + String(n).padStart(3, '0');
    const rec = Object.assign({ code: codeN, no: `${n}/PASXKD-VHT`, nv: v.nv, status: 'DRAFT', pm: pid(), created: today(), date: today() }, data);
    U.created.unshift(rec); addHist(codeN, 'Lập phương án sản xuất kinh doanh', `Từ nhiệm vụ ${v.nv}`); persist();
    toast('<b>Thành công</b><br>Đã lập phương án. Hoàn thiện đầu vào B1.1–B1.4 rồi trình phê duyệt.');
    window.Thau.kit.setTab('pa:' + codeN, 'dv');
    location.hash = '#/' + href(rec);
  }
  async function itemDlg(code, id) {
    const { tf, ta, sel, dt, req, opts, L, txt } = B(), x = byCode(code), d = b1Of(x), it = d.items.find((i) => i.id === id), own = isOwner(x);
    const comps = (own ? [tf('name', 'Hạng mục đầu vào', req()), sel('who', 'Người cung cấp', Object.assign({ values: opts(personOpts()) }, L(8))), tf('unit', 'Hoặc đơn vị cung cấp', L(8)),
      tf('src', 'Nguồn, căn cứ', L(8)), dt('due', 'Hạn trả kết quả', req(L(8)))] : [txt(`**${it.name}**`)])
      .concat([sel('st', 'Trạng thái', req({ values: opts(Object.entries(ST_IN).map(([v, l]) => [v, l[0]])), layout: { columns: 8 } })), ta('note', 'Ghi chú (thiếu gì, cần ai hỗ trợ)')]);
    const r = await window.EFormRun.open({ title: it ? 'Cập nhật đầu vào' : 'Giao chuẩn bị đầu vào', schema: { id: 'sx-pa-item', components: comps }, values: it ? Object.assign({}, it, { due: dmy(it.due) }) : { st: 'CHUA', due: dmy(today()) },
      check: (v) => { if (own && !fromDmy(v.due)) return 'Hạn trả kết quả phải đúng định dạng DD/MM/YYYY.'; if (own && !v.who && !String(v.unit || '').trim()) return 'Cần chọn người hoặc nhập đơn vị cung cấp — việc chưa có người nhận chưa được coi là đã giao.'; if (v.st === 'THIEU' && !String(v.note || '').trim()) return 'Ghi rõ căn cứ còn thiếu.'; return null; } });
    if (!r || !r.submit) return;
    const v = r.values, n = own ? { name: v.name, who: v.who || '', unit: v.who ? '' : v.unit, src: v.src, due: fromDmy(v.due), st: v.st, note: v.note } : { st: v.st, note: v.note };
    if (it) Object.assign(it, n); else d.items.push(Object.assign({ id: `I${Date.now()}` }, n));
    addHist(code, it ? 'Cập nhật đầu vào (B1.1)' : 'Giao chuẩn bị đầu vào (B1.1)', `${n.name || it.name}: ${ST_IN[n.st][0]}`); persist();
    toast('<b>Thành công</b><br>Cập nhật đầu vào thành công!'); rerender();
  }
  async function cfgDlg(code, id) {
    const { tf, ta, sel, req, opts, L } = B(), x = byCode(code), d = b1Of(x), it = d.cfgs.find((i) => i.id === id);
    const comps = [tf('cfg', 'Cấu hình', req(L(8))), tf('lot', 'Lô sản xuất', req(L(8))), tf('bom', 'Phiên bản BOM', L(4)), tf('hskt', 'Phiên bản hồ sơ kỹ thuật', L(4)), tf('dm', 'Phiên bản định mức', L(4)), tf('ct', 'Chỉ tiêu được duyệt (số QĐ)', L(4)),
      tf('scope', 'Phạm vi áp dụng'), sel('kq', 'Kết quả tiếp nhận', req({ values: opts(Object.entries(ST_CFG).map(([v, l]) => [v, l[0]])), layout: { columns: 8 } })), ta('note', 'Ghi nhận phần thiếu, người bổ sung')];
    const r = await window.EFormRun.open({ title: it ? 'Tiếp nhận hồ sơ cấu hình, lô' : 'Thêm cấu hình / lô', schema: { id: 'sx-pa-cfg', components: comps }, values: it ? Object.assign({}, it) : { kq: 'CHUA' },
      check: (v) => {
        if (v.kq !== 'DAT') return v.kq === 'THIEU' && !String(v.note || '').trim() ? 'Ghi rõ phần thiếu và người bổ sung.' : null;
        const m = docsMissing(v); if (m.length) return `Chưa thể ghi "Tiếp nhận đủ": còn thiếu ${m.join(', ')}.`;
        if (verMismatch(v)) return 'Chưa thể ghi "Tiếp nhận đủ": BOM, hồ sơ kỹ thuật, định mức không cùng phiên bản.';
        if (!String(v.scope || '').trim()) return 'Chưa thể ghi "Tiếp nhận đủ": chưa có phạm vi áp dụng.'; return null; } });
    if (!r || !r.submit) return;
    const n = {}; ['cfg', 'lot', 'bom', 'hskt', 'dm', 'ct', 'scope', 'kq', 'note'].forEach((f) => { n[f] = r.values[f] || ''; });
    if (it) Object.assign(it, n); else d.cfgs.push(Object.assign({ id: `C${Date.now()}` }, n));
    addHist(code, 'Tiếp nhận hồ sơ cấu hình, lô (B1.2)', `${n.cfg} · ${n.lot}: ${ST_CFG[n.kq][0]}`); persist();
    toast('<b>Thành công</b><br>Cập nhật tiếp nhận hồ sơ thành công!'); rerender();
  }
  async function scopeDlg(code, id) {
    const { tf, ta, sel, req, opts, L } = B(), x = byCode(code), d = b1Of(x), it = d.scope.find((i) => i.id === id);
    const comps = [tf('name', 'Hạng mục / gói', req()), sel('side', 'Bên thực hiện', Object.assign({ values: opts(Object.entries(SIDE)) }, L(8))), sel('who', 'Đầu mối (người)', Object.assign({ values: opts(personOpts()) }, L(8))),
      tf('unit', 'Hoặc đơn vị đầu mối', L(8)), sel('st', 'Trạng thái', req({ values: opts(Object.entries(ST_SC).map(([v, l]) => [v, l[0]])), layout: { columns: 8 } })), ta('check', 'Điều kiện kiểm tra, bàn giao'), ta('note', 'Ghi chú')];
    const r = await window.EFormRun.open({ title: it ? 'Cập nhật phạm vi, trách nhiệm' : 'Thêm hạng mục phạm vi', schema: { id: 'sx-pa-scope', components: comps }, values: it ? Object.assign({}, it) : { st: 'CHUA' },
      check: (v) => (v.st === 'CHOT' && (!v.side || (!v.who && !String(v.unit || '').trim()) || !String(v.check || '').trim()) ? 'Chỉ chốt khi đã có bên thực hiện, đầu mối và điều kiện kiểm tra, bàn giao.' : null) });
    if (!r || !r.submit) return;
    const v = r.values, n = { name: v.name, side: v.side || '', who: v.who || '', unit: v.who ? '' : v.unit || '', check: v.check || '', st: v.st, note: v.note || '' };
    if (it) Object.assign(it, n); else d.scope.push(Object.assign({ id: `S${Date.now()}` }, n));
    addHist(code, 'Cập nhật phạm vi, trách nhiệm (B1.3)', `${n.name}: ${ST_SC[n.st][0]}`); persist();
    toast('<b>Thành công</b><br>Cập nhật phạm vi thành công!'); rerender();
  }
  async function costDlg(code, id) {
    const { tf, num: nf, dt, chk, req, L } = B(), x = byCode(code), d = b1Of(x), it = d.cost.find((i) => i.id === id);
    const comps = [tf('name', 'Khoản chi phí', req()), nf('amount', 'Giá trị (triệu đồng)', req({ validate: { required: true, min: 0 }, layout: { columns: 8 } })), tf('src', 'Nguồn kinh phí', L(8)),
      tf('basis', 'Căn cứ giá (báo giá, định mức, hợp đồng…)'), dt('at', 'Ngày cập nhật', L(8)), dt('valid', 'Hiệu lực đến', L(8)), nf('lt', 'Leadtime (tuần)', Object.assign({ validate: { min: 0 } }, L(8))),
      chk('early', 'Đã đưa vào kế hoạch sớm (vật tư leadtime dài)', L(8))];
    const v0 = it ? Object.assign({}, it, { at: dmy(it.at), valid: it.valid && it.valid < '2099' ? dmy(it.valid) : '' }) : { at: dmy(today()), lt: 0 };
    const r = await window.EFormRun.open({ title: it ? 'Cập nhật chi phí' : 'Thêm khoản chi phí', schema: { id: 'sx-pa-cost', components: comps }, values: v0,
      check: (v) => { for (const f of ['at', 'valid']) if (String(v[f] || '').trim() && !fromDmy(v[f])) return 'Ngày phải đúng định dạng DD/MM/YYYY.'; return null; } });
    if (!r || !r.submit) return;
    const v = r.values, n = { name: v.name, amount: Number(v.amount) || 0, src: v.src || '', basis: v.basis || '', at: fromDmy(v.at) || '', valid: fromDmy(v.valid) || '', lt: Number(v.lt) || 0, early: !!v.early };
    if (it) Object.assign(it, n); else d.cost.push(Object.assign({ id: `P${Date.now()}` }, n));
    addHist(code, 'Cập nhật chi phí (B1.4)', `${n.name}: ${num(n.amount)} triệu`); persist();
    const is = costIssues(n);
    toast(is.length ? `Đã lưu. Khoản chi phí còn ${is.join('; ')}.` : '<b>Thành công</b><br>Cập nhật chi phí thành công!', is.length ? 'warn' : undefined); rerender();
  }
  const setStatus = (code, data) => { const own = U.created.find((y) => y.code === code); if (own) Object.assign(own, data); else U.edit[code] = Object.assign(U.edit[code] || {}, data); };
  function submit(code) {
    const x = byCode(code);
    if (!check(x).ready) { toast('Chưa đủ 4 nội dung đầu vào.', 'warn'); return; }
    setStatus(code, { status: 'SUBMITTED', submittedAt: nowStamp() }); addHist(code, 'Trình phê duyệt', 'Đủ 4 nội dung đầu vào B1.1–B1.4'); persist();
    toast('<b>Thành công</b><br>Đã trình Ban Giám đốc Khối phê duyệt.'); rerender();
  }
  function approve(code) {
    setStatus(code, { status: 'APPROVED', approver: pid(), approvedAt: nowStamp() }); addHist(code, 'Phê duyệt', ''); persist();
    toast('<b>Thành công</b><br>Đã phê duyệt phương án sản xuất kinh doanh.'); rerender();
  }
  async function giveBack(code) {
    const why = await window.UI.askReason('Trả lại phương án sản xuất kinh doanh');
    if (!why) return;
    setStatus(code, { status: 'RETURNED' }); addHist(code, 'Trả lại', why); persist();
    toast('Đã trả lại phương án cho người lập.'); rerender();
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sxpa-f],[data-sxpa-new],[data-sxpa-edit],[data-sxpa-submit],[data-sxpa-approve],[data-sxpa-return],[data-sxpa-item],[data-sxpa-cfg],[data-sxpa-scope],[data-sxpa-cost]');
    if (!t || t.disabled) return;
    const ds = t.dataset;
    if (ds.sxpaF) { F.st = ds.sxpaF; rerender(); return; }
    if (ds.sxpaNew != null) { infoDlg(null, ds.sxpaNew || null); return; }
    if (ds.sxpaEdit) { infoDlg(ds.sxpaEdit); return; }
    if (ds.sxpaSubmit) { submit(ds.sxpaSubmit); return; }
    if (ds.sxpaApprove) { approve(ds.sxpaApprove); return; }
    if (ds.sxpaReturn) { giveBack(ds.sxpaReturn); return; }
    const [kind, val] = [['item', ds.sxpaItem], ['cfg', ds.sxpaCfg], ['scope', ds.sxpaScope], ['cost', ds.sxpaCost]].find(([, v]) => v != null);
    const [code, id] = val.split('|');
    ({ item: itemDlg, cfg: cfgDlg, scope: scopeDlg, cost: costDlg })[kind](code, id || null);
  });

  function route(parts) {
    if (!parts[0]) return list();
    if (parts[0] === 'create') return list();
    return detail(decodeURIComponent(parts[0]));
  }

  const css = document.createElement('style');
  css.textContent = `.sxpa-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:4px 0 12px}
.sxpa-tile{border:1px solid #F6B3C0;background:#FFF0F3;border-radius:12px;padding:12px 14px}.sxpa-tile.ok{border-color:#5FE495;background:#E6F7EC}
.sxpa-tile .t{font-size:13px;color:#475467;min-height:36px}.sxpa-tile .v{font-size:24px;font-weight:700;margin:4px 0}
.sxpa-tile .bar{height:6px;background:#E4E7EC;border-radius:4px;overflow:hidden}.sxpa-tile .bar span{display:block;height:100%;background:#E5002D}.sxpa-tile.ok .bar span{background:#067647}
.sxpa-tile .m{font-size:12px;color:#667085;margin-top:6px}.sxpa-miss{margin:6px 0 0 18px;padding:0}.sxpa-miss li{margin:2px 0}
.sxpa-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:16px}
.sxpa-kpi{display:flex;flex-direction:column;align-items:flex-start;gap:4px;background:#fff;border:1px solid #E4E7EC;border-radius:12px;padding:12px 16px;cursor:pointer;font:inherit;text-align:left}
.sxpa-kpi b{font-size:24px}.sxpa-kpi.on{border-color:#E5002D;box-shadow:0 0 0 1px #E5002D}.sxpa-kpi.warn b{color:#B54708}.sxpa-kpi.info b{color:#2E5BDB}.sxpa-kpi.ok b{color:#067647}
.hd-alert.success{background:#E6F7EC;border-color:#5FE495;color:#067647}
@media(max-width:900px){.sxpa-tiles,.sxpa-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);

  function reset() { U = blank(); persist(); }
  window.SxPa = { route, list, detail, all, byCode, visible, check, projectOf, myCount, reset };
})();
