/* Phân hệ Quản lý sản xuất (QLSX) — dữ liệu, menu, danh mục, dự án mẫu, luồng nháp. T71 S0 (D-121).
   Căn cứ (INDEX B12): CDS-BT-03COP (COP2), SX-KS-K1, SX-KS-K2, SX-VMMS-1111, BM-QLHDSX-01 / 04, SX-GA-K2.
   Chưa có BPMN sản xuất (C17): năm luồng ở SX.flows là bản nháp dựng từ mô tả trong SX-KS-K1 / SX-KS-K2 — GIẢ LẬP (P-238), nối vào engine ở S2+.
   Nạp sau data.js, trước catalog.js (catalog.js nối D.sxCatalogs vào phân hệ Danh mục dùng chung). */
(function () {
  const D = window.D;

  D.sxProduct = { code: 'QLSX', name: 'Hệ thống Quản lý sản xuất' };

  /* ---------- Vai demo (cờ sx: chỉ hiện trong menu đổi tài khoản khi đang ở phân hệ Sản xuất) ----------
     Tên hư cấu; vai theo SX-KS-K1 §2 (6 nhóm) và RBAC SX-KS-K2 §3. Mã vai R-SX-* GIẢ LẬP — thật: danh mục Vai trò thực hiện + IAM. */
  D.personas.push(
    { id: 'sxld', name: 'Nguyễn Hữu Phong', short: 'Phong', role: 'Phó Giám đốc Khối 1', unit: 'Ban Giám đốc Khối 1', urd: 'R-SX-LD', actor: '—', sx: true },
    { id: 'sxpm', name: 'Trần Quốc Việt', short: 'Việt', role: 'Giám đốc dự án sản xuất (PM)', unit: 'Trung tâm Sản xuất — Khối 1', urd: 'R-SX-PM', actor: '—', sx: true },
    { id: 'sxsub', name: 'Lê Minh Đức', short: 'Đức', role: 'Cán bộ phụ trách bán thành phẩm (Sub PM)', unit: 'Trung tâm Sản xuất — Khối 1', urd: 'R-SX-SUBPM', actor: '—', sx: true },
    { id: 'sxrd', name: 'Phạm Thu Hằng', short: 'Hằng', role: 'PM sản phẩm (Nghiên cứu phát triển)', unit: 'Trung tâm Nghiên cứu thiết kế — Khối 1', urd: 'R-SX-RD', actor: '—', sx: true },
    { id: 'sxqa', name: 'Đoàn Văn Khải', short: 'Khải', role: 'Kỹ sư Quản lý chất lượng', unit: 'Trung tâm Đảm bảo chất lượng', urd: 'R-SX-QA', actor: '—', sx: true },
    { id: 'sxk2', name: 'Vũ Thị Hương', short: 'Hương', role: 'Chuyên viên Quản lý sản xuất', unit: 'Phòng Quản lý sản xuất — Khối 2', urd: 'R-SX-PM', actor: '—', sx: true },
    { id: 'sxnm', name: 'Hoàng Văn Lực', short: 'Lực', role: 'Cán bộ điều hành sản xuất (nhà máy)', unit: 'Nhà máy đối tác', urd: 'R-SX-NM', actor: '—', sx: true },
    { id: 'sxgdtt', name: 'Bùi Thanh Sơn', short: 'Sơn', role: 'Giám đốc Trung tâm Nghiên cứu thiết kế', unit: 'Trung tâm Nghiên cứu thiết kế — Khối 1', urd: 'R-SX-GDTT', actor: '—', sx: true },
    /* Dashboard theo nhóm vai (nhánh hoaidt10, 25/11): Tổng Giám đốc — nhóm 1, xem toàn bộ VHT. */
    { id: 'sxceo', name: 'Lương Đình Bảo', short: 'Bảo', role: 'Tổng Giám đốc', unit: 'Ban Tổng Giám đốc', urd: 'R-SX-TGD', actor: '—', sx: true },
    { id: 'sxtgd', name: 'Đỗ Văn Khang', short: 'Khang', role: 'Phó Tổng Giám đốc', unit: 'Ban Tổng Giám đốc', urd: 'R-SX-TGD', actor: '—', sx: true },
    { id: 'sxkd', name: 'Mai Anh Tuấn', short: 'Tuấn', role: 'Chuyên viên Kinh doanh', unit: 'Trung tâm Kinh doanh', urd: 'R-SX-KD', actor: '—', sx: true },
  );

  /* ---------- Sidebar phân hệ (màn SX-xx theo plan T71 §4; lát dựng ghi ở `slice`) ---------- */
  const soon = (slice, scr) => [`Màn ${scr} dựng ở lát ${slice} của plan T71 (docs/sx/T71-prototype-qlsx-ke-hoach.md §5).`];
  D.sxMenu = [
    /* T74 #95: Tổng quan đổi tên Dashboard, đứng đầu menu như KHCN (repo-khcn-bpmn-fe management-sidebar). */
    { label: 'Tổng quan', icon: 'tong_quan', path: 'sx/tong-quan', scr: 'SX-01' },
    /* T74 #94 / #96 (Q1): Việc của tôi thành mục con (giữ số việc) của nhóm Quản lý nhiệm vụ, cùng Nhiệm vụ đơn vị và Việc cá nhân — như KHCN. */
    { label: 'Quản lý nhiệm vụ', icon: 'menu_square', open: true, children: [
      { label: 'Nhiệm vụ đơn vị', path: 'sx/cong-viec/don-vi', scr: 'SX-16' },
      /* Góp ý 26/11 (hoaidt10): Việc cá nhân gộp vào Việc của tôi — tổng hợp việc từ Kế hoạch và việc được giao từ quy trình; số = việc chưa xử lý. */
      { label: 'Việc của tôi', path: 'sx/viec-cua-toi', scr: 'SX-15', badge: () => (window.SxFlow ? window.SxFlow.openTotal(window.Flow.state.persona) : 0) }] },
    /* COP2 B1 (CDS-BT-03COP tr. 84–85): Nhiệm vụ → Phương án sản xuất kinh doanh (hoàn thiện đầu vào, phê duyệt) → Dự án — sx-pasxkd.js. */
    { label: 'Phương án sản xuất kinh doanh', icon: 'menu_square', path: 'sx/pasxkd', scr: 'SX-22', badge: () => (window.SxPa ? window.SxPa.myCount() : 0) },
    { label: 'Dự án sản xuất', icon: 'view_list', path: 'sx/du-an', scr: 'SX-02', notes: soon('S1', 'SX-02…04') },
    { label: 'Chuyển giao từ nghiên cứu', icon: 'view_flow', open: true, children: [
      { label: 'Hồ sơ chuyển giao', path: 'sx/chuyen-giao', scr: 'SX-06', notes: soon('S3', 'SX-06') },
      { label: 'Sản phẩm sẵn sàng sản xuất', path: 'sx/san-pham', scr: 'SX-07', notes: soon('S3', 'SX-07') }] },
    { label: 'Cung ứng vật tư', icon: 'phan_he_mua_sam', open: true, children: [
      { label: 'Nhu cầu vật tư', path: 'sx/nhu-cau', scr: 'SX-17' },
      { label: 'Đề xuất mua sắm', path: 'sx/mua-sam', scr: 'SX-10' }] },
    { label: 'Bất thường sản xuất', icon: 'menu_square', path: 'sx/bat-thuong', scr: 'SX-08', notes: soon('S6', 'SX-08') },
    { label: 'Thay đổi kỹ thuật', icon: 'phan_he_quy_trinh', path: 'sx/thay-doi', scr: 'SX-09', notes: soon('S7', 'SX-09') },
    { label: 'Nghiệm thu sản phẩm', icon: 'chuc_danh_khoa_hoc', path: 'sx/nghiem-thu', scr: 'SX-12', notes: soon('S8', 'SX-12') },
    { label: 'Hồ sơ, tài liệu', icon: 'view_list', children: [
      { label: 'Hồ sơ dự án', path: 'sx/ho-so', scr: 'SX-18' },
      { label: 'Biểu mẫu tài liệu', path: 'sx/bieu-mau', scr: 'SX-19' },
      { label: 'Bài học kinh nghiệm', path: 'sx/bai-hoc', scr: 'SX-20' }] },
    { label: 'Báo cáo', icon: 'view_grid', children: [
      /* T71 S13: 7 dashboard của SX-ULNL (dòng 2531–2537) + Đối chiếu quyết toán (công đoạn 6, mức nhẹ) — sx-bao-cao.js. */
      { label: 'Tiến độ sản xuất', path: 'sx/bao-cao/tien-do', scr: 'SX-14' },
      { label: 'Chất lượng', path: 'sx/bao-cao/chat-luong', scr: 'SX-14' },
      { label: 'Bất thường theo dự án', path: 'sx/bao-cao/bat-thuong', scr: 'SX-14' },
      { label: 'Thay đổi kỹ thuật', path: 'sx/bao-cao/thay-doi', scr: 'SX-14' },
      { label: 'Vật tư theo ngày cần', path: 'sx/bao-cao/vat-tu', scr: 'SX-14' },
      { label: 'KPI quy trình', path: 'sx/bao-cao/kpi', scr: 'SX-14' },
      { label: 'Thời gian chờ theo bên xử lý', path: 'sx/bao-cao/cho-xu-ly', scr: 'SX-14' },
      { label: 'Đối chiếu quyết toán', path: 'sx/bao-cao/quyet-toan', scr: 'SX-14' }] },
    /* 25/11 (nhánh hoaidt10): nhóm Quản lý quy trình dùng nguyên 3 màn của phân hệ ĐTMS (SCR-41 Quản lý quy trình, SCR-43 Ma trận hành động, SCR-48 Giám sát tiến trình),
       route #/sx/… để giữ sidebar Sản xuất; link trong màn tự thêm tiền tố sx/ (app.js sxShared, ma-tran.js BASE). Thật: cùng màn của engine BPMN, lọc theo phân hệ (app SX). */
    { label: 'Quản lý quy trình', icon: 'phan_he_quy_trinh', children: [
      { label: 'Quản lý quy trình', path: 'sx/quy-trinh', scr: 'SCR-41' },
      { label: 'Ma trận hành động', path: 'sx/ma-tran', scr: 'SCR-43' },
      { label: 'Giám sát tiến trình', path: 'sx/giam-sat-tien-trinh', scr: 'SCR-48' }] },
    /* T71 S12 (D-124): Mẫu thông báo của phân hệ (SX-ULNL "QL thông báo") — màn notification-template dùng chung. */
    { label: 'Mẫu thông báo', icon: 'view_list', path: 'sx/mau-thong-bao', scr: 'SX-21' },
  ];

  /* ---------- Danh mục SX-13 (nối vào phân hệ Danh mục dùng chung, nhóm "Quản lý sản xuất") ---------- */
  const code = (label, width) => ({ key: 'code', label, type: 'code', required: true, max: 50, width: width || 160 });
  const name = (label, minWidth) => ({ key: 'name', label, type: 'name', required: true, max: 255, minWidth: minWidth || 280 });
  const desc = () => ({ key: 'description', label: 'Mô tả', type: 'textarea', max: 500, minWidth: 200 });
  const QT = [{ value: '4A11', label: 'QT.VHT.TTSX.4A.1.1 Quản lý hoạt động sản xuất' }, { value: '4A12', label: 'QT.VHT.TTSX.4A.1.2 Xử lý bất thường' }, { value: '4A13', label: 'QT.VHT.TTSX.4A.1.3 Thay đổi kỹ thuật' }];
  /* Loại tài liệu của dự án (T71 S11): dùng ở danh mục Biểu mẫu, tab Tài liệu, Hồ sơ dự án. */
  const DOC_KIND = { KH: 'Kế hoạch sản xuất (BM.QLHDSX.01)', PA: 'Báo cáo phương án sản xuất', M4: 'Kiểm tra điều kiện sản xuất 4M (BM.QLHDSX.02)', BB: 'Biên bản làm việc với nhà máy (BM.QLHDSX.04)',
    BT: 'Phiếu báo cáo bất thường (BM.QLBT.01)', BTPA: 'Phương án xử lý bất thường (BM.QLBT.02)', ECR: 'Yêu cầu thay đổi kỹ thuật (SXL.07)', ECO: 'Lệnh thay đổi kỹ thuật (SXL.08)',
    ECN: 'Thông báo thay đổi kỹ thuật (SXL.09)', LOG: 'Nhật ký quản lý dự án (SXL.10)', NT: 'Biên bản nghiệm thu', PAKD: 'Phương án kinh doanh', NV: 'Quyết định giao nhiệm vụ', HD: 'Hợp đồng với khách hàng',
    /* (b) theo QT-TTSX-4A11 §5.4: đầu ra bước 3, 4, 5, 6, 10, 11, 13 */
    KO: 'Biên bản kick-off', QDGV: 'Quyết định giao nhiệm vụ PM, nhóm dự án', BGNM: 'Checklist bàn giao tài liệu cho nhà máy (BM.QLHDSX.03)', DT: 'Biên bản xác nhận nội dung đào tạo',
    NCC: 'Biên bản bàn giao, trả hàng với nhà cung cấp', IPQC: 'Hồ sơ kiểm soát chất lượng công đoạn (IPQC)', TN: 'Kết quả thử nghiệm thực tế', HOC: 'Biên bản bàn giao hàng hóa (HOC)', COCQ: 'Chứng nhận xuất xứ, chất lượng (CO, CQ)', KHAC: 'Khác' };
  const DOCK = Object.entries(DOC_KIND).map(([value, label]) => ({ value, label }));
  const UNIT = [{ value: 'QLSX', label: 'Đơn vị Quản lý sản xuất' }, { value: 'RD', label: 'Đơn vị Nghiên cứu phát triển' }, { value: 'NM', label: 'Nhà máy' }];
  const KHOI = [{ value: 'K1', label: 'Khối 1' }, { value: 'K2', label: 'Khối 2' }];
  const NHOM = [{ value: 'I', label: 'I. Hồ sơ pháp lý' }, { value: 'II', label: 'II. Sản phẩm và tài liệu kỹ thuật ngoại' },
    { value: 'III', label: 'III. Hồ sơ nghiên cứu, thiết kế' }, { value: 'IV', label: 'IV. Hồ sơ công nghệ và điều kiện sản xuất' }];
  const KIND = [{ value: 'NOI_BO', label: 'Nội bộ Tập đoàn' }, { value: 'DOI_TAC', label: 'Đối tác ngoài' }];
  const sla = (key, label) => ({ key, label, type: 'num', max: 3, placeholder: 'Ngày làm việc', width: 130 });

  /* Danh mục hồ sơ chuyển giao — Khối 1: 27 hạng mục đầu vào của QT-TTSX-4A11 §5.2, đúng tên và thứ tự; dấu * = bắt buộc (cột "x" của QT, 14 hạng mục — (b) Q3).
     Khối 2: 20 hồ sơ, SX-KS-K2 §2.1 nêu 8 tên, 12 tên còn lại GIẢ LẬP (P-239), đều bắt buộc. */
  const K1 = { I: ['*Tờ trình phương án sản xuất kinh doanh được cấp có thẩm quyền phê duyệt'],
    II: ['Sản phẩm mẫu và phụ kiện đồng bộ', '*Cấu hình đồng bộ 1 sản phẩm', '*Danh mục VTHH (eBOM) đồng nhất với cấu hình, kèm thời gian hỗ trợ của nhà sản xuất (Active time)',
      '*Danh mục VTHH yêu cầu export license, leadtime dài', '*Danh mục VTHH và bán thành phẩm dùng cho bảo hành sản phẩm', 'Chỉ tiêu ngoại (chỉ tiêu, tính năng chiến-kỹ thuật sản phẩm)',
      'Bài đo, phương pháp đo chỉ tiêu ngoại', 'Bảng đánh giá đo kiểm theo chỉ tiêu ngoại', 'Kết quả thử nghiệm thực tế sản phẩm', 'Hướng dẫn sử dụng (User manual)',
      'Hướng dẫn sửa chữa và bảo dưỡng (Factory service manual)'],
    III: ['*Thuyết minh kỹ thuật', '*Chỉ tiêu nội (chỉ tiêu sản xuất)', '*Chỉ tiêu và phương pháp kiểm tra cho các module cấu thành sản phẩm', '*Bài đo, phương pháp đo chỉ tiêu nội',
      '*Bảng đánh giá đo kiểm theo chỉ tiêu nội', 'Bộ tài liệu báo cáo giai đoạn sản xuất thử nghiệm', '*Lưu trình đo kiểm cho từng module, bán thành phẩm', '*Hồ sơ thiết kế'],
    IV: ['*Quy trình công nghệ lắp ráp, gia công, tích hợp, đồng điều chỉnh', 'Firmware và hướng dẫn nạp', 'Phần mềm và hướng dẫn cài đặt', 'Hồ sơ kiểm soát chất lượng sản xuất',
      '*Công cụ hỗ trợ chế thử, sản xuất (Jig, stencil…): công cụ, thiết kế, hướng dẫn cấu hình, sử dụng', 'Danh mục công cụ dụng cụ trong sản xuất thử nghiệm và sản xuất loạt',
      'Biên bản thống nhất thành phần đủ điều kiện sản xuất giữa QLSX và R&D'] };
  /* Mô tả hạng mục 20 theo QT: chỉ các phần có (*) là bắt buộc. */
  const K1DESC = { 'Hồ sơ thiết kế': 'Bắt buộc: thiết kế hệ thống tổng thể, thiết kế khối chức năng, hồ sơ thiết kế mạch in (gerbers, fab…), hồ sơ thiết kế cơ khí (3D, 2D). Không bắt buộc: thiết kế nguyên lý, hồ sơ quản lý điều chỉnh thiết kế, thiết kế tem nhãn, bao bì và đóng gói.' };
  const K2 = { II: ['Bản vẽ thiết kế phần cứng', 'Sơ đồ nguyên lý', 'Gerber file', 'BOM vật tư', 'Firmware, phần mềm đính kèm', 'Tài liệu hướng dẫn lắp ráp',
    'Quy trình đo kiểm', 'Hộp test, sân test mô phỏng', 'Chỉ tiêu kỹ thuật', 'Kết quả thử nghiệm', 'Hướng dẫn sử dụng', 'Thiết kế cơ khí vỏ', 'Thiết kế tem nhãn, bao bì'],
  III: ['Báo cáo đánh giá chất lượng sản phẩm', 'Ghi chú phát hành phiên bản'],
  IV: ['Danh mục linh kiện leadtime dài', 'Hướng dẫn cài đặt phần mềm', 'Hồ sơ kiểm soát chất lượng', 'Danh mục Jig, Fixture', 'Hướng dẫn sửa chữa, bảo hành'] };
  D.sxK2Simulated = 12;
  const hsRows = (khoi, src) => {
    const out = []; let n = 0;
    /* buoc 4 = hồ sơ lập ở bước 4 luồng chuyển giao (biên bản thống nhất), không tính khi R&D gửi thẩm định. bb = Bắt buộc (Y / N): Khối 1 theo dấu *, Khối 2 đều Y. */
    Object.entries(src).forEach(([nhom, names]) => names.forEach((t0) => {
      n += 1; const star = t0[0] === '*', t = star ? t0.slice(1) : t0;
      out.push([`${khoi}-HS${String(n).padStart(2, '0')}`, t, K1DESC[t] || '', true, 0, Object.assign({ khoi, nhom, bb: khoi === 'K2' || star ? 'Y' : 'N' }, /^Biên bản thống nhất/.test(t) ? { buoc: 4 } : {})]);
    }));
    return out;
  };

  D.sxCatalogs = [
    { key: 'sx-bat-thuong', scr: 'SX-13', title: 'Loại bất thường và SLA', entity: 'loại bất thường', icon: 'menu_square', roles: ['sxpm', 'sxqa'], built: true, q: ['P-240'],
      use: 'Phân loại phiếu bất thường (QT.VHT.TTSX.4A.1.2) và thời hạn xử lý theo mức độ nghiêm trọng; hạn của phiếu = ngày tiếp nhận + số ngày làm việc. Căn cứ SX-KS-K1 §3.2 Bảng 6, Bảng 7.',
      fields: [code('Mã loại', 120), name('Tên loại bất thường', 240),
        { key: 'unit', label: 'Đơn vị xử lý', type: 'select', required: true, options: UNIT, width: 220 },
        sla('sla1', 'Rất nghiêm trọng'), sla('sla2', 'Nghiêm trọng'), sla('sla3', 'Trung bình'), sla('sla4', 'Thấp'), desc()],
      seed: [
        ['L1', 'Loại 1 — Sai lệch quản lý sản xuất', 'Sai lệch cài đặt máy đo, cấu hình phần mềm công cụ, điều chuyển linh kiện tương đương đã được phê duyệt', true, 2, { unit: 'QLSX', sla1: 17, sla2: 14, sla3: 12, sla4: 10 }],
        ['L2', 'Loại 2 — Lỗi thiết kế', 'Lỗi thiết kế, sai quy trình công nghệ, dung sai cơ khí không phù hợp, linh kiện ngừng sản xuất cần thay đổi thiết kế; liên thông thay đổi kỹ thuật', true, 1, { unit: 'RD', sla1: 20, sla2: 17, sla3: 15, sla4: 13 }],
        ['L3', 'Loại 3 — Lỗi tại nhà máy', 'Lỗi thao tác, máy móc gia công, hàn dán SMT, phương tiện đo tại nhà máy; thời hạn theo quy trình của nhà máy', true, 1, { unit: 'NM' }],
      ] },
    /* Danh mục chuẩn của phiếu bất thường (nhánh hoaidt10): Nơi phát hiện, Đơn vị tính, Công đoạn, Ca sản xuất, Nhóm nguyên nhân — dùng ở form Thêm mới, danh sách và chi tiết phiếu. */
    { key: 'sx-noi-phat-hien', scr: 'SX-13', title: 'Nơi phát hiện bất thường', entity: 'nơi phát hiện', icon: 'menu_square', roles: ['sxpm', 'sxqa'], built: true,
      use: 'Nơi phát hiện bất thường trên phiếu báo cáo (BM.QLBT.01); người lập chọn từ danh mục thay cho nhập tự do.',
      fields: [code('Mã nơi phát hiện', 140), name('Nơi phát hiện', 300), desc()],
      seed: [['NPH-01', 'Kho vật tư (IQC)', '', true, 0], ['NPH-02', 'Dây chuyền SMT', '', true, 0], ['NPH-03', 'Lắp ráp, hàn tay', '', true, 0], ['NPH-04', 'Nạp firmware', '', true, 0],
        ['NPH-05', 'Trạm đo kiểm cuối (OQC)', '', true, 0], ['NPH-06', 'Phòng thử nghiệm môi trường', '', true, 0], ['NPH-07', 'Đóng gói, xuất kho', '', true, 0], ['NPH-08', 'Khách hàng, thực địa', '', true, 0], ['NPH-09', 'Khác', '', true, 0]] },
    { key: 'sx-don-vi-tinh', scr: 'SX-13', title: 'Đơn vị tính số lượng', entity: 'đơn vị tính', icon: 'view_list', roles: ['sxpm', 'sxqa'], built: true,
      use: 'Đơn vị tính của Số lượng ảnh hưởng trên phiếu bất thường.',
      fields: [code('Mã đơn vị tính', 140), name('Đơn vị tính', 240), desc()],
      seed: [['DVT-01', 'Chiếc', '', true, 0], ['DVT-02', 'Bộ', '', true, 0], ['DVT-03', 'Thiết bị', '', true, 0], ['DVT-04', 'Module', '', true, 0], ['DVT-05', 'Bo mạch', '', true, 0], ['DVT-06', 'Lô', '', true, 0], ['DVT-07', 'Cái', '', true, 0]] },
    { key: 'sx-cong-doan', scr: 'SX-13', title: 'Công đoạn sản xuất', entity: 'công đoạn', icon: 'view_flow', roles: ['sxpm', 'sxqa'], built: true,
      use: 'Công đoạn sản xuất nơi xảy ra bất thường.',
      fields: [code('Mã công đoạn', 140), name('Công đoạn', 280), desc()],
      seed: [['CD-01', 'IQC vật tư', '', true, 0], ['CD-02', 'SMT', '', true, 0], ['CD-03', 'Hàn xuyên lỗ, hàn tay', '', true, 0], ['CD-04', 'Lắp ráp cơ khí', '', true, 0],
        ['CD-05', 'Nạp firmware', '', true, 0], ['CD-06', 'Đo kiểm, hiệu chỉnh', '', true, 0], ['CD-07', 'Thử nghiệm môi trường', '', true, 0], ['CD-08', 'Đóng gói', '', true, 0]] },
    { key: 'sx-ca-san-xuat', scr: 'SX-13', title: 'Ca sản xuất', entity: 'ca sản xuất', icon: 'view_list', roles: ['sxpm', 'sxqa'], built: true,
      use: 'Ca sản xuất khi xảy ra bất thường.',
      fields: [code('Mã ca', 120), name('Ca sản xuất', 240), desc()],
      seed: [['CA-1', 'Ca 1 (06:00 – 14:00)', '', true, 0], ['CA-2', 'Ca 2 (14:00 – 22:00)', '', true, 0], ['CA-3', 'Ca 3 (22:00 – 06:00)', '', true, 0], ['CA-HC', 'Hành chính', '', true, 0]] },
    { key: 'sx-nhom-nguyen-nhan', scr: 'SX-13', title: 'Nhóm nguyên nhân bất thường', entity: 'nhóm nguyên nhân', icon: 'menu_square', roles: ['sxpm', 'sxqa'], built: true,
      use: 'Nhóm nguyên nhân (người, máy, vật liệu, phương pháp, môi trường…) chọn ở phần Phân tích sơ bộ của phiếu bất thường; dùng để thống kê.',
      fields: [code('Mã nhóm', 120), name('Nhóm nguyên nhân', 280), desc()],
      seed: [['NN1', 'Nhân viên sản xuất', '', true, 0], ['NN2', 'Máy móc, CCDC, PTĐ', 'Máy móc, công cụ dụng cụ, phương tiện đo', true, 0], ['NN3', 'An toàn lao động', '', true, 0], ['NN4', 'Phương pháp', '', true, 0],
        ['NN5', 'Nguyên vật liệu', '', true, 0], ['NN6', 'Môi trường sản xuất', '', true, 0], ['NN7', 'Khác', '', true, 0]] },
    { key: 'sx-ho-so-chuyen-giao', scr: 'SX-13', title: 'Danh mục hồ sơ chuyển giao', entity: 'hồ sơ chuyển giao', icon: 'view_list', roles: ['sxpm', 'sxrd', 'sxqa'], built: true, q: ['P-239'],
      use: 'Hồ sơ của gói chuyển giao từ nghiên cứu sang sản xuất; gói chỉ gửi thẩm định được khi đủ hồ sơ Bắt buộc của khối. Khối 1: 27 hạng mục, 14 bắt buộc (QT-TTSX-4A11 §5.2); Khối 2: 20 hồ sơ (SX-KS-K2 §2.1).',
      fields: [code('Mã hồ sơ', 120), name('Tên hồ sơ', 360),
        { key: 'khoi', label: 'Khối', type: 'select', required: true, options: KHOI, width: 110 },
        { key: 'nhom', label: 'Nhóm', type: 'select', required: true, options: NHOM, width: 280 },
        { key: 'bb', label: 'Bắt buộc', type: 'select', required: true, options: [{ value: 'Y', label: 'Có' }, { value: 'N', label: 'Không' }], width: 110 }, desc()],
      seed: hsRows('K1', K1).concat(hsRows('K2', K2)) },
    { key: 'sx-cap-duyet', scr: 'SX-13', title: 'Cấp phê duyệt thay đổi kỹ thuật', entity: 'cấp phê duyệt', icon: 'phan_he_quy_trinh', roles: ['sxpm', 'sxrd'], built: true,
      use: 'Cổng chọn người phê duyệt lệnh thay đổi kỹ thuật (ECO) theo phạm vi thay đổi. Căn cứ SX-KS-K1 §3.3.1 Bảng 8.',
      fields: [code('Mã cấp', 120), name('Cấp phê duyệt', 240), { key: 'description', label: 'Phạm vi thay đổi', type: 'textarea', max: 500, minWidth: 360 }],
      seed: [
        ['C1', 'Giám đốc dự án (PM đề tài)', 'Tài liệu mô tả, hướng dẫn sử dụng; không ảnh hưởng cấu hình phần cứng', true, 0],
        ['C2', 'Giám đốc Trung tâm nghiên cứu', 'Chi tiết mạch nội bộ bo mạch; không ảnh hưởng giao tiếp khối', true, 0],
        ['C3', 'Ban Giám đốc Khối', 'Thay đổi thiết kế hệ thống, chỉ tiêu kỹ thuật, BOM hoặc quy trình công nghệ', true, 1],
        ['C4', 'Ban Tổng Giám đốc', 'Vượt tổng mức đầu tư hoặc thay đổi chỉ tiêu chiến – kỹ thuật đã được cấp có thẩm quyền phê duyệt', true, 0],
      ] },
    { key: 'sx-don-vi', scr: 'SX-13', title: 'Đơn vị sản xuất', entity: 'đơn vị sản xuất', icon: 'doi_tac', roles: ['sxpm', 'sxk2'], built: true, q: ['P-241'],
      use: 'Nhà máy, đối tác gia công nhận gói sản xuất; tài khoản của đơn vị chỉ thấy dự án được giao. Danh sách tương ứng "Đơn vị sản xuất" của VMMS.',
      fields: [code('Mã đơn vị', 120), name('Tên đơn vị sản xuất', 300),
        { key: 'kind', label: 'Loại đơn vị', type: 'select', required: true, options: KIND, width: 160 }, desc()],
      seed: [
        ['VMC', 'Công ty Mua sắm Sản xuất Viettel', 'Tổng thầu chế tạo, tích hợp, đo kiểm', true, 2, { kind: 'NOI_BO' }],
        ['VMIC', 'Công ty Cơ khí Viettel', 'Gia công cơ khí, vỏ, kết cấu', true, 1, { kind: 'NOI_BO' }],
        ['NM-HL', 'Nhà máy điện tử Hòa Lạc', 'Hàn dán SMT, lắp ráp bo mạch', true, 1, { kind: 'DOI_TAC' }],
        ['NM-BN', 'Công ty Gia công Cơ khí chính xác Bắc Ninh', 'Gia công chi tiết cơ khí chính xác', true, 0, { kind: 'DOI_TAC' }],
        ['NM-HP', 'Nhà máy lắp ráp thiết bị viễn thông Hải Phòng', 'Lắp ráp thiết bị đầu cuối số lượng lớn', true, 1, { kind: 'DOI_TAC' }],
      ] },
    { key: 'sx-mo-hinh', scr: 'SX-13', title: 'Mô hình tổ chức sản xuất', entity: 'mô hình tổ chức sản xuất', icon: 'view_flow', roles: ['sxpm'], built: true,
      use: 'Thuộc tính của dự án sản xuất, quyết định độ chi tiết kế hoạch (theo mốc tổng hay theo từng bán thành phẩm). Căn cứ CDS-BT-03COP §2.4, SX-KS-K1 §1.1, SX-GA-0911 Phần 3.',
      fields: [code('Mã mô hình', 160), name('Tên mô hình', 280), desc()],
      seed: [
        ['VMC_TONG_THAU', 'VMC tổng thầu sản xuất', 'VHT lựa chọn nhà thầu các gói thành viên, VMC chế tạo, tích hợp, đo kiểm; theo dõi theo mốc tổng của gói', true, 2],
        ['VHT_TU_SX', 'VHT trực tiếp tổ chức sản xuất', 'VHT mua linh kiện, thuê gia công, tự tổ chức tích hợp, đo kiểm; theo dõi theo từng bán thành phẩm', true, 1],
        ['GIA_CONG', 'Thuê gia công trọn gói', 'Thuê nhà máy gia công trọn gói theo hợp đồng; nghiệm thu theo lô', true, 1],
      ] },
    /* T71 S11 (D-124): Biểu mẫu tài liệu — nguồn của nút Chọn mẫu tài liệu (tab Tài liệu của dự án, Hồ sơ dự án). Mã theo ký hiệu biểu mẫu thật (có dấu chấm) nên dùng kiểu trường văn bản. */
    { key: 'sx-bieu-mau', scr: 'SX-19', title: 'Biểu mẫu tài liệu sản xuất', entity: 'biểu mẫu tài liệu', icon: 'view_list', roles: ['sxpm', 'sxqa', 'sxk2'], built: true, q: ['P-261'],
      use: 'Biểu mẫu của các quy trình sản xuất QT.VHT.TTSX.4A.1.1 / 4A.1.2 / 4A.1.3; dùng ở nút Chọn mẫu tài liệu của dự án. Căn cứ SX-KS-K1 §3, BM-QLHDSX-01, BM-QLHDSX-04 (các biểu mẫu khác chưa có bản gốc — C17).',
      fields: [{ key: 'code', label: 'Mã biểu mẫu', type: 'tcode', required: true, max: 50, width: 220 }, name('Tên biểu mẫu', 300),
        { key: 'qt', label: 'Quy trình', type: 'select', required: true, options: QT, width: 300 },
        { key: 'kind', label: 'Loại tài liệu', type: 'select', required: true, options: DOCK, width: 280 },
        { key: 'ver', label: 'Lần ban hành', type: 'text', max: 50, width: 130 },
        { key: 'file', label: 'Tệp mẫu', type: 'text', max: 255, minWidth: 260 }, desc()],
      seed: [
        ['BM.QLHDSX.01', 'Kế hoạch dự án sản xuất', 'OKRs, yêu cầu, phương án tổ chức, mốc, rủi ro và 6 phụ lục', true, 3, { qt: '4A11', kind: 'KH', ver: 'Lần 01', file: 'BM.QLHDSX.01_Ke hoach du an.docx' }],
        ['BM.QLHDSX.02', 'Danh mục kiểm tra điều kiện sản xuất 4M', 'Nhân lực, máy móc, vật tư, phương pháp trước khi bắt đầu sản xuất', true, 0, { qt: '4A11', kind: 'M4', ver: 'Lần 01', file: '' }],
        ['BM.QLHDSX.04', 'Biên bản làm việc Tổng công ty với nhà máy', 'Thống nhất phương án tổ chức sản xuất, đầu mối, cấp ký', true, 1, { qt: '4A11', kind: 'BB', ver: 'Lần 01', file: 'BM.QLHDSX.04_Bien ban hop.docx' }],
        ['BM.QLBT.01', 'Phiếu báo cáo bất thường', 'Mô tả hiện tượng, nơi phát hiện, số lượng ảnh hưởng', true, 4, { qt: '4A12', kind: 'BT', ver: 'Lần 01', file: 'BM.QLBT.01_Phieu bao cao bat thuong.docx' }],
        ['BM.QLBT.02', 'Phương án xử lý bất thường', 'Nguyên nhân, biện pháp, hạn hoàn thành, kết quả kiểm tra', true, 2, { qt: '4A12', kind: 'BTPA', ver: 'Lần 01', file: 'BM.QLBT.02_Phuong an xu ly.docx' }],
        ['BM.VHT.TTSX.01-SXL.07', 'Yêu cầu thay đổi kỹ thuật ECR', 'Lý do, phạm vi, đề xuất thay đổi', true, 1, { qt: '4A13', kind: 'ECR', ver: 'Lần 01', file: 'SXL.07_Yeu cau thay doi ky thuat.docx' }],
        ['BM.VHT.TTSX.01-SXL.08', 'Lệnh thay đổi kỹ thuật ECO', 'Nội dung thay đổi được phê duyệt theo cấp', true, 1, { qt: '4A13', kind: 'ECO', ver: 'Lần 01', file: 'SXL.08_Lenh thay doi ky thuat.docx' }],
        ['BM.VHT.TTSX.01-SXL.09', 'Thông báo thay đổi kỹ thuật ECN', 'Ban hành tài liệu sau thay đổi, phiên bản áp dụng', true, 1, { qt: '4A13', kind: 'ECN', ver: 'Lần 01', file: 'SXL.09_Thong bao thay doi ky thuat.docx' }],
        ['BM.VHT.TTSX.01-SXL.10', 'Nhật ký quản lý dự án', 'Ghi mã ECO, ECN, phiên bản tài liệu theo dự án', true, 1, { qt: '4A13', kind: 'LOG', ver: 'Lần 01', file: '' }],
      ] },
  ];

  /* ---------- Dự án sản xuất mẫu (hư cấu; S1 dựng màn danh sách / chi tiết) ---------- */
  D.sxProjects = [
    { code: 'DA-SX-2026-001', name: 'Sản xuất loạt đài thu phát vô tuyến chiến thuật VT-25 — đợt 1', tier: 'TRONG_YEU', khoi: 'K1', model: 'VMC_TONG_THAU', product: 'VT-25', version: 'v2.1_HW_Rev3',
      qty: 40, unitName: 'bộ', pm: 'sxpm', factory: 'VMC', start: '2026-03-02', end: '2026-12-15', status: 'IN_PRODUCTION' },
    { code: 'DA-SX-2026-002', name: 'Sản xuất tổ hợp quan sát quang điện tử QĐ-12', tier: 'QUAN_TRONG', khoi: 'K1', model: 'VHT_TU_SX', product: 'QĐ-12', version: 'v1.0_HW_Rev2',
      qty: 12, unitName: 'bộ', pm: 'sxpm', factory: 'NM-HL', start: '2026-06-01', end: '2027-03-31', status: 'PREPARING' },
    { code: 'DA-SX-2026-003', name: 'Sản xuất bộ phát Wi-Fi Mesh WM-6 cho thị trường Lào', tier: 'QUAN_TRONG', khoi: 'K2', model: 'GIA_CONG', product: 'WM-6', version: 'v3.0.1_HW_Rev2',
      qty: 120000, unitName: 'thiết bị', pm: 'sxk2', factory: 'NM-HP', start: '2026-04-15', end: '2026-11-30', status: 'IN_PRODUCTION' },
    { code: 'DA-SX-2026-004', name: 'Sản xuất trạm 5G Macro gNB-M3 năm 2026', tier: 'TRONG_YEU', khoi: 'K2', model: 'VMC_TONG_THAU', product: 'gNB-M3', version: 'v1.2',
      qty: 3000, unitName: 'trạm', pm: 'sxk2', factory: 'VMC', start: '2026-12-01', end: '2027-06-30', status: 'PLANNING' },
    /* Dashboard (nhánh hoaidt10): thêm dự án ở trạng thái Nghiệm thu và Hoàn thành để biểu đồ trạng thái có đủ 5 trạng thái. */
    { code: 'DA-SX-2026-005', name: 'Sản xuất bộ phát Wi-Fi Mesh WM-6 cho thị trường Campuchia', tier: 'THUONG', khoi: 'K2', model: 'GIA_CONG', product: 'WM-6', version: 'v3.0.1_HW_Rev2',
      qty: 30000, unitName: 'thiết bị', pm: 'sxk2', factory: 'NM-HP', start: '2026-03-01', end: '2026-11-25', status: 'ACCEPTANCE' },
    { code: 'DA-SX-2025-011', name: 'Sản xuất loạt đài thu phát vô tuyến chiến thuật VT-25 — đợt thử nghiệm', tier: 'QUAN_TRONG', khoi: 'K1', model: 'VMC_TONG_THAU', product: 'VT-25', version: 'v2.0_HW_Rev2',
      qty: 10, unitName: 'bộ', pm: 'sxpm', factory: 'VMC', start: '2025-06-02', end: '2025-12-20', status: 'DONE' },
  ];
  /* T71 S1: thông tin bổ sung của dự án mẫu. perf = mức bám kế hoạch (sinh % hoàn thành theo ngày, xem sx-du-an.js planOf); cap = giai đoạn cuối đã bắt đầu
     (dự án chưa sản xuất thì giai đoạn sau 0%); baseline = ngày chốt kế hoạch gốc (luồng SX-KH bước 5, S2). Tài liệu / lịch sử hư cấu. */
  const EXTRA = {
    'DA-SX-2026-001': { basis: ['PAKD', 'PAKD số 214/PAKD-VHT ngày 12/01/2026'], pakd: 'PAKD-2026-214', khsxkd: 'KHSXKD-K1-2026', trial: true, customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', perf: 0.95, cap: 4, baseline: '2026-03-10',
      goal: 'Sản xuất, tích hợp, nghiệm thu 40 bộ đài thu phát VT-25 phiên bản v2.1 đạt chỉ tiêu kỹ thuật đã phê duyệt; bàn giao trước 15/12/2026.',
      creator: 'sxpm', created: '2026-02-20',
      docs: [['Kế hoạch sản xuất VT-25 đợt 1 (đã phê duyệt).pdf', 'KH', 'v1.2', 'sxpm', '2026-03-10'], ['Biên bản làm việc thống nhất phương án tổ chức sản xuất với VMC.pdf', 'BB', 'v1.0', 'sxpm', '2026-04-02'],
        ['PAKD 214-PAKD-VHT.pdf', 'PAKD', 'v1.0', 'sxpm', '2026-02-20']],
      hist: [['2026-02-20 09:12', 'sxpm', 'Tạo dự án', ''], ['2026-03-05 16:40', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.2'], ['2026-03-10 10:00', 'sxpm', 'Chốt kế hoạch gốc', 'Kick-off dự án'],
        ['2026-04-02 15:20', 'sxpm', 'Cập nhật tài liệu', 'Biên bản làm việc với VMC'], ['2026-09-18 08:30', 'sxpm', 'Cập nhật kế hoạch', 'Điều chỉnh mốc hoàn thành tích hợp do vật tư leadtime dài về chậm']] },
    'DA-SX-2026-002': { trial: true, basis: ['NV', 'Nhiệm vụ sản xuất giao tại Quyết định số 1520/QĐ-VHT ngày 15/05/2026'], customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', perf: 0.6, cap: 2, baseline: '2026-06-12',
      goal: 'Tự tổ chức sản xuất 12 tổ hợp QĐ-12: mua linh kiện, thuê gia công bo mạch và cơ khí, tích hợp, đo kiểm, thử nghiệm thực tế tại trận địa.',
      creator: 'sxpm', created: '2026-05-20',
      docs: [['Kế hoạch sản xuất QĐ-12 (đã phê duyệt).pdf', 'KH', 'v1.0', 'sxpm', '2026-06-12'], ['Quyết định giao nhiệm vụ 1520-QĐ-VHT.pdf', 'NV', 'v1.0', 'sxpm', '2026-05-20']],
      hist: [['2026-05-20 14:05', 'sxpm', 'Tạo dự án', ''], ['2026-06-10 11:30', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.0'], ['2026-06-12 09:00', 'sxpm', 'Chốt kế hoạch gốc', 'Kick-off dự án; giao Sub PM phụ trách bán thành phẩm']] },
    'DA-SX-2026-003': { trial: false, basis: ['HD', 'Hợp đồng cung cấp thiết bị số 88/2026/HĐ-VTL ngày 20/03/2026'], customer: 'Viettel Lào (khách hàng thị trường)', perf: 1, cap: 4, baseline: '2026-04-20', lot: 20000,
      goal: 'Thuê gia công trọn gói 120.000 bộ phát WM-6, nghiệm thu theo lô 20.000 thiết bị, nhập kho Tổng công ty để giao khách hàng trước 30/11/2026.',
      creator: 'sxk2', created: '2026-04-01',
      docs: [['Kế hoạch sản xuất WM-6 Lào (đã phê duyệt).pdf', 'KH', 'v1.1', 'sxk2', '2026-04-20'], ['Hợp đồng 88-2026-HĐ-VTL.pdf', 'HD', 'v1.0', 'sxk2', '2026-04-01']],
      hist: [['2026-04-01 08:45', 'sxk2', 'Tạo dự án', ''], ['2026-04-17 17:10', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.1'], ['2026-04-20 10:00', 'sxk2', 'Chốt kế hoạch gốc', 'Kick-off dự án']] },
    'DA-SX-2026-004': { basis: ['PAKD', 'PAKD số 352/PAKD-VHT ngày 28/10/2026'], pakd: 'PAKD-2026-352', khsxkd: 'KHSXKD-K2-2027', trial: false, customer: 'Tổng Công ty Viễn thông (khách hàng nội bộ Tập đoàn)', perf: 0, cap: 0, baseline: null,
      goal: 'Tổ chức sản xuất 3.000 trạm 5G Macro gNB-M3 qua VMC tổng thầu, triển khai theo kế hoạch năm 2027.',
      creator: 'sxk2', created: '2026-11-10', docs: [['PAKD 352-PAKD-VHT.pdf', 'PAKD', 'v1.0', 'sxk2', '2026-11-10']], hist: [['2026-11-10 10:20', 'sxk2', 'Tạo dự án', '']] },
  };
  Object.assign(EXTRA, {
    'DA-SX-2026-005': { trial: false, basis: ['HD', 'Hợp đồng cung cấp thiết bị số 41/2026/HĐ-MTC ngày 10/02/2026'], customer: 'Metfone Campuchia (khách hàng thị trường)', perf: 0.97, cap: 3, baseline: '2026-03-06', lot: 10000,
      goal: 'Thuê gia công 30.000 bộ phát WM-6, nghiệm thu theo lô 10.000 thiết bị, giao khách hàng trước 25/11/2026.',
      creator: 'sxk2', created: '2026-02-15', docs: [['Kế hoạch sản xuất WM-6 Campuchia (đã phê duyệt).pdf', 'KH', 'v1.0', 'sxk2', '2026-03-06']],
      hist: [['2026-02-15 09:00', 'sxk2', 'Tạo dự án', ''], ['2026-03-04 15:30', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.0'], ['2026-03-06 10:00', 'sxk2', 'Chốt kế hoạch gốc', 'Kick-off dự án'], ['2026-11-12 14:00', 'sxk2', 'Chuyển nghiệm thu', 'Hoàn thành sản xuất lô cuối']] },
    'DA-SX-2025-011': { trial: true, basis: ['NV', 'Nhiệm vụ sản xuất thử nghiệm tại Quyết định số 980/QĐ-VHT ngày 20/05/2025'], customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', perf: 1, cap: 4, baseline: '2025-06-10',
      goal: 'Sản xuất thử nghiệm 10 bộ VT-25 v2.0 phục vụ thử nghiệm thực tế, làm căn cứ sản xuất loạt.',
      creator: 'sxpm', created: '2025-05-25', docs: [['Kế hoạch sản xuất VT-25 đợt thử nghiệm (đã phê duyệt).pdf', 'KH', 'v1.0', 'sxpm', '2025-06-10']],
      hist: [['2025-05-25 08:30', 'sxpm', 'Tạo dự án', ''], ['2025-06-08 16:00', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.0'], ['2025-06-10 09:00', 'sxpm', 'Chốt kế hoạch gốc', 'Kick-off dự án'], ['2025-12-18 15:00', 'sxpm', 'Hoàn thành dự án', 'Nhập kho đủ 10 bộ']] },
  });
  D.sxProjects.forEach((p) => Object.assign(p, EXTRA[p.code]));
  D.sxStatus = { PLANNING: 'Lập kế hoạch', PREPARING: 'Chuẩn bị sản xuất', IN_PRODUCTION: 'Đang sản xuất', ACCEPTANCE: 'Nghiệm thu', DONE: 'Hoàn thành' };
  D.sxStatusV = { PLANNING: 'default', PREPARING: 'warning', IN_PRODUCTION: 'info', ACCEPTANCE: 'warning', DONE: 'success' };
  D.sxBasis = { PAKD: 'Phương án sản xuất kinh doanh', NV: 'Nhiệm vụ được giao', HD: 'Hợp đồng với khách hàng' };
  /* (b) Q14 — Phương án kinh doanh đã phê duyệt: nguồn căn cứ chọn khi Thêm mới dự án (QT-TTSX-4A11 §5.1 sự kiện bắt đầu, §5.2 đầu vào mục 1).
     GIẢ LẬP P-264: hệ thống nguồn của PAKD chưa rõ — thật: API tra cứu PAKD đã duyệt (hệ thống Kinh doanh / VOffice). Một PAKD lập một dự án. */
  D.sxPakd = [
    { code: 'PAKD-2026-214', no: '214/PAKD-VHT', date: '2026-01-12', title: 'Phương án sản xuất kinh doanh đài thu phát VT-25 năm 2026', khoi: 'K1', product: 'VT-25', qty: 40, unitName: 'bộ', customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', due: '2026-12-15', kh: 'KHSXKD-K1-2026' },
    { code: 'PAKD-2026-352', no: '352/PAKD-VHT', date: '2026-10-28', title: 'Phương án sản xuất kinh doanh trạm 5G Macro gNB-M3 năm 2027', khoi: 'K2', product: 'gNB-M3', qty: 3000, unitName: 'trạm', customer: 'Tổng Công ty Viễn thông (khách hàng nội bộ Tập đoàn)', due: '2027-06-30', kh: 'KHSXKD-K2-2027' },
    { code: 'PAKD-2026-388', no: '388/PAKD-VHT', date: '2026-11-03', title: 'Phương án sản xuất kinh doanh thiết bị đầu cuối quang ONT-X2 năm 2027', khoi: 'K2', product: 'ONT-X2', qty: 80000, unitName: 'thiết bị', customer: 'Tổng Công ty Viễn thông (khách hàng nội bộ Tập đoàn)', due: '2027-09-30', kh: 'KHSXKD-K2-2027' },
    { code: 'PAKD-2026-401', no: '401/PAKD-VHT', date: '2026-11-06', title: 'Phương án sản xuất kinh doanh thiết bị định tuyến biên ER-9', khoi: 'K2', product: 'ER-9', qty: 2000, unitName: 'thiết bị', customer: 'Viettel Campuchia (khách hàng thị trường)', due: '2027-08-31', kh: 'KHSXKD-K2-2027' },
    { code: 'PAKD-2026-409', no: '409/PAKD-VHT', date: '2026-11-09', title: 'Phương án sản xuất kinh doanh đài ra-đa cảnh giới tầm thấp RĐ-40 đợt 2', khoi: 'K1', product: 'RĐ-40', qty: 6, unitName: 'bộ', customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', due: '2027-10-31', kh: 'KHSXKD-K1-2027' },
    { code: 'PAKD-2026-415', no: '415/PAKD-VHT', date: '2026-11-12', title: 'Phương án sản xuất kinh doanh bộ phát Wi-Fi Mesh WM-6 thị trường Campuchia', khoi: 'K2', product: 'WM-6', qty: 50000, unitName: 'thiết bị', customer: 'Viettel Campuchia (khách hàng thị trường)', due: '2027-05-31', kh: 'KHSXKD-K2-2027' },
  ];
  /* Kế hoạch sản xuất kinh doanh năm (QT bước 1 đầu vào "KHSXKD năm (nếu có)") — GIẢ LẬP P-264. */
  D.sxKhsxkd = [
    { code: 'KHSXKD-K1-2026', title: 'Kế hoạch sản xuất kinh doanh năm 2026 — Khối 1', khoi: 'K1' }, { code: 'KHSXKD-K1-2027', title: 'Kế hoạch sản xuất kinh doanh năm 2027 — Khối 1', khoi: 'K1' },
    { code: 'KHSXKD-K2-2026', title: 'Kế hoạch sản xuất kinh doanh năm 2026 — Khối 2', khoi: 'K2' }, { code: 'KHSXKD-K2-2027', title: 'Kế hoạch sản xuất kinh doanh năm 2027 — Khối 2', khoi: 'K2' },
  ];
  D.sxDocKind = DOC_KIND;
  /* Nhóm hồ sơ của Hồ sơ dự án (SX-18) theo loại tài liệu. */
  D.sxDocGroup = { KH: 'Kế hoạch và căn cứ', PA: 'Kế hoạch và căn cứ', PAKD: 'Kế hoạch và căn cứ', NV: 'Kế hoạch và căn cứ', HD: 'Kế hoạch và căn cứ', M4: 'Chuẩn bị sản xuất', BB: 'Chuẩn bị sản xuất',
    BT: 'Bất thường và thay đổi', BTPA: 'Bất thường và thay đổi', ECR: 'Bất thường và thay đổi', ECO: 'Bất thường và thay đổi', ECN: 'Bất thường và thay đổi', LOG: 'Bất thường và thay đổi', NT: 'Nghiệm thu',
    KO: 'Kế hoạch và căn cứ', QDGV: 'Kế hoạch và căn cứ', BGNM: 'Chuẩn bị sản xuất', DT: 'Chuẩn bị sản xuất', NCC: 'Chuẩn bị sản xuất', IPQC: 'Nghiệm thu', TN: 'Nghiệm thu', HOC: 'Nghiệm thu', COCQ: 'Nghiệm thu', KHAC: 'Khác' };
  /* Ngày hiện tại của phân hệ (tính chậm mốc). GIẢ LẬP — thật: ngày hệ thống. */
  D.sxToday = '2026-11-16';
  /* Sản phẩm và phiên bản (S3 nối vào danh sách Sản phẩm sẵn sàng sản xuất; ready = đã qua cổng chuyển giao). */
  D.sxProducts = [
    { code: 'VT-25', name: 'Đài thu phát vô tuyến chiến thuật VT-25', version: 'v2.1_HW_Rev3', khoi: 'K1', ready: true, rel: '2026-01-28' },
    { code: 'QĐ-12', name: 'Tổ hợp quan sát quang điện tử QĐ-12', version: 'v1.0_HW_Rev2', khoi: 'K1', ready: true, rel: '2026-05-28' },
    { code: 'TS-08', name: 'Tổ hợp trinh sát điện tử TS-08', version: 'v1.0_HW_Rev1', khoi: 'K1', ready: false },
    { code: 'RĐ-40', name: 'Đài ra-đa cảnh giới tầm thấp RĐ-40', version: 'v1.3', khoi: 'K1', ready: true, rel: '2026-09-15' },
    { code: 'WM-6', name: 'Bộ phát Wi-Fi Mesh WM-6', version: 'v3.0.1_HW_Rev2', khoi: 'K2', ready: true, rel: '2026-03-30' },
    { code: 'gNB-M3', name: 'Trạm 5G Macro gNB-M3', version: 'v1.2', khoi: 'K2', ready: true, rel: '2026-10-25' },
    { code: 'ONT-X2', name: 'Thiết bị đầu cuối quang ONT-X2', version: 'v2.0', khoi: 'K2', ready: false },
  ];

  /* ---------- Luồng nháp (P-238, GIẢ LẬP — gửi BA xác nhận; danh sách bước cũng ở docs/sx/prototype-qlsx-chuan-bi.md §4) ----------
     Mỗi bước: id, tên, vai (mã R-SX-*), next hoặc choices [nhãn, tới]; 'svc' = service task (hệ thống). */
  D.sxFlows = {
    /* T71 S2: SX-KH chạy trên sx-flow.js. Thuộc tính bước (một bước = một dòng cấu hình): nlv = định mức ngày; label = nút khi không có choices;
       choices [nhãn, tới, kiểu?] — kiểu 'no' = nút từ chối (ý kiến bắt buộc); action = bộ xử lý hành động (SxFlow.ACT) chạy khi xong bước / theo lựa chọn;
       form = khoá eForm (js/eforms/sx-kh.js). Hồ sơ: mã HSKH-<mã dự án>-<lần>; onStart / onEnd = bộ xử lý lúc khởi tạo / kết thúc.
       T71 S12: sign = tên tài liệu ký số MySign ở bước (biến {{…}} theo ngữ cảnh hồ sơ) — bộ chạy mở hộp thoại ký trước khi hoàn thành bước (GIẢ LẬP P-258). */
    'SX-KH': { name: 'Phê duyệt kế hoạch sản xuất', short: 'HSKH', obj: 'project', tab: 'kh', src: 'QT-TTSX-4A11 §5.4 bước 1–3, §5.5; BM-QLHDSX-01',
      onStart: 'kh.start', onEnd: 'kh.baseline', endText: 'Kết thúc — kế hoạch gốc đã chốt, dự án chuyển Chuẩn bị sản xuất', steps: [
      /* (b) Q1: bước 1 không bắt buộc (QT lưu ý) — lựa chọn thứ hai bỏ qua bước 2, đi thẳng lập kế hoạch; form đổi theo lựa chọn (lý do bỏ qua). */
      [1, 'Lập báo cáo phương án sản xuất (không bắt buộc)', 'R-SX-PM', { nlv: 3, form: 'pa', choices: [['Trình Ban Giám đốc Khối', 2], ['Không lập báo cáo, lập kế hoạch ngay', 3]], action: 'kh.pa' }],
      [2, 'Ban Giám đốc Khối cho ý kiến chỉ đạo phương án sản xuất', 'R-SX-LD', { nlv: 2, form: 'cd', choices: [['Đồng ý phương án', 3], ['Yêu cầu chỉnh sửa', 1, 'no']], action: 'kh.direct' }],
      [3, 'Lập kế hoạch sản xuất dự án (BM.QLHDSX.01 và 6 phụ lục)', 'R-SX-PM', { next: 4, nlv: 5, label: 'Trình phê duyệt', form: 'kh', action: 'kh.submit' }],
      /* (b) Q5: một lần Ban Giám đốc Khối phê duyệt (QT §5.5: BGĐ Khối A) — bỏ bước Xem xét riêng. */
      [4, 'Ban Giám đốc Khối phê duyệt kế hoạch sản xuất', 'R-SX-LD', { nlv: 2, form: 'yk', choices: [['Phê duyệt', 5], ['Trả lại', 3, 'no']], action: 'kh.approve', sign: 'Kế hoạch sản xuất số {{khSo}}' }],
      /* (b) Q6: kick-off do Ban Giám đốc Khối chủ trì; biên bản kick-off, quyết định giao nhiệm vụ là đầu ra / đầu vào bắt buộc. */
      [5, 'Họp kick-off, giao nhiệm vụ PM và nhóm dự án, chốt mốc kế hoạch gốc', 'R-SX-PM', { next: 'end', nlv: 3, label: 'Chốt kế hoạch gốc', form: 'ko' }]] },
    /* T71 S3: đối tượng cha = gói chuyển giao (sx-chuyen-giao.js). Bước 2 song song 3a ‖ 3b; bước 4 hợp nhánh (join). guard bg.full = thiếu hồ sơ thì không gửi được. */
    'SX-BG': { name: 'Chuyển giao từ nghiên cứu sang sản xuất', short: 'HSCG', obj: 'package', tab: 'hs', src: 'SX-KS-K2 §4.1; SX-KS-K1 §4 (cổng chuyển giao)',
      onStart: 'bg.start', endText: 'Kết thúc — sản phẩm vào Kho sản phẩm sẵn sàng sản xuất', steps: [
      [1, 'Tạo gói chuyển giao, tải hồ sơ theo danh mục của khối', 'R-SX-RD', { next: 2, nlv: 5, label: 'Gửi thẩm định', form: 'gui', guard: 'bg.full', action: 'bg.submit' }],
      [2, 'Kiểm tra đủ hồ sơ bắt buộc (thiếu thì không gửi được)', 'svc', { next: ['3a', '3b'], label: 'Hệ thống kiểm tra đủ hồ sơ bắt buộc' }],
      ['3a', 'Thẩm định hồ sơ (Quản lý sản xuất)', 'R-SX-PM', { nlv: 3, form: 'td', choices: [['Đạt', 4], ['Yêu cầu bổ sung', 1, 'no']], action: 'bg.assess' }],
      ['3b', 'Thẩm định hồ sơ (Đảm bảo chất lượng)', 'R-SX-QA', { nlv: 3, form: 'td', choices: [['Đạt', 4], ['Yêu cầu bổ sung', 1, 'no']], action: 'bg.assess' }],
      [4, 'Lập biên bản thống nhất thành phần đủ điều kiện sản xuất', 'R-SX-PM', { next: 5, nlv: 2, join: true, label: 'Hoàn thành', form: 'bb', action: 'bg.minutes', sign: 'Biên bản thống nhất số {{bbSo}}' }],
      [5, 'Ghi vào danh sách sản phẩm sẵn sàng sản xuất, cấp mã phiên bản', 'svc', { next: 'end', label: 'Hệ thống ghi Kho sản phẩm sẵn sàng sản xuất', action: 'bg.release' }]] },
    /* (b) Q4: bàn giao tài liệu sản xuất cho đơn vị sản xuất (QT-TTSX-4A11 §5.4 bước 5, BM.QLHDSX.03) — sau cổng chuyển giao R&D → QLSX. Đối tượng cha = dự án.
       QT §5.5 bước 5: BGĐ Khối A (phê duyệt), QLSX R, NCPT S. Đơn vị sản xuất tiếp nhận (R-SX-NM). Xong thì tiêu chí 4M MD2 tự đạt. */
    'SX-BGNM': { name: 'Bàn giao tài liệu sản xuất cho đơn vị sản xuất', short: 'HSBGNM', obj: 'project', tab: 'cg', src: 'QT-TTSX-4A11 §5.4 bước 5, §5.5; BM-QLHDSX-XLS (BM.QLHDSX.03 ❓)',
      onStart: 'nm.start', endText: 'Kết thúc — tài liệu sản xuất đã bàn giao, lưu trên VMMS', steps: [
      [1, 'Lập checklist bàn giao tài liệu cho đơn vị sản xuất (BM.QLHDSX.03)', 'R-SX-PM', { next: 2, nlv: 3, label: 'Gửi đơn vị sản xuất', form: 'ck', guard: 'nm.factory', action: 'nm.send' }],
      [2, 'Đơn vị sản xuất tiếp nhận, rà soát tài liệu', 'R-SX-NM', { nlv: 2, form: 'tn', choices: [['Xác nhận tiếp nhận', 3], ['Yêu cầu bổ sung', 1, 'no']] }],
      [3, 'Kiểm tra quy trình công nghệ do đơn vị sản xuất thực hiện', 'R-SX-PM', { nlv: 5, form: 'kt', choices: [['Đạt', 4], ['Yêu cầu điều chỉnh', 2, 'no']] }],
      [4, 'Ban Giám đốc Khối phê duyệt bàn giao tài liệu sản xuất', 'R-SX-LD', { nlv: 2, form: 'yk', choices: [['Phê duyệt', 5], ['Trả lại', 3, 'no']] }],
      [5, 'Lưu tài liệu đã bàn giao lên VMMS, cập nhật điều kiện 4M', 'svc', { next: 'end', label: 'Hệ thống lưu tài liệu lên VMMS, cập nhật điều kiện 4M', action: 'nm.done' }]] },
    /* T71 S6: đối tượng cha = phiếu bất thường (sx-bat-thuong.js). Bước 1 = lập phiếu (người báo cáo, R-SX-REP), xong ngay khi Thêm mới; bước 5 giao theo loại (R-SX-XL: đơn vị xử lý của danh mục). */
    'SX-BT': { name: 'Xử lý bất thường trong sản xuất', short: 'HSBT', obj: 'issue', tab: 'xl', src: 'SX-KS-K1 §3.2 (QT.VHT.TTSX.4A.1.2), Bảng 6, Bảng 7',
      onStart: 'bt.start', endText: 'Kết thúc — phiếu bất thường đã đóng', steps: [
      /* T74 #100, #101: người lập chọn loại + mức độ ngay ở bước 1; bước 2 chỉ tiếp nhận, phân tích nguyên nhân, đính kèm — sai phân loại thì trả lại người lập (Q10). */
      [1, 'Lập phiếu báo cáo bất thường (BM.QLBT.01), phân loại và mức độ', 'R-SX-REP', { next: 2, nlv: 1, label: 'Gửi', form: 'lap', action: 'bt.lap' }],
      [2, 'Tiếp nhận (trong 24 giờ làm việc), phân tích nguyên nhân', 'R-SX-PM', { nlv: 1, form: 'pl', action: 'bt.classify', choices: [['Hoàn thành tiếp nhận', 3], ['Trả lại người lập', 1, 'no']] }],
      [3, 'Đề xuất phương án xử lý (BM.QLBT.02)', 'R-SX-PM', { next: 4, nlv: 2, label: 'Trình phê duyệt', form: 'pa' }],
      [4, 'Phê duyệt phương án', 'R-SX-LD', { nlv: 1, form: 'yk', choices: [['Phê duyệt', 5], ['Trả lại', 3, 'no']] }],
      [5, 'Triển khai theo loại: Loại 1 QLSX · Loại 2 R&D (có thể mở thay đổi kỹ thuật) · Loại 3 Nhà máy', 'R-SX-XL', { next: 6, nlv: 5, label: 'Hoàn thành triển khai', form: 'tk' }],
      [6, 'Kiểm tra kết quả', 'R-SX-QA', { nlv: 2, form: 'kt', choices: [['Đạt (OK)', 7], ['Không đạt (NOK)', 3, 'no']], action: 'bt.check' }],
      [7, 'Lưu hồ sơ và bài học kinh nghiệm', 'R-SX-PM', { next: 'end', nlv: 2, label: 'Đóng phiếu', form: 'bh', action: 'bt.close' }]] },
    /* T71 S7: đối tượng cha = yêu cầu thay đổi kỹ thuật ECR (sx-thay-doi.js). Bước 1 = lập ECR (người lập, xong khi Thêm mới); bước 4 giao theo cấp phê duyệt chọn ở bước 3
       (R-SX-CAP: danh mục Cấp phê duyệt thay đổi kỹ thuật); bước 5, 8 là service task ghi nhật ký quản lý dự án. */
    'SX-TD': { name: 'Thay đổi kỹ thuật (ECR → ECO → ECN)', short: 'HSTD', obj: 'change', tab: 'td', src: 'SX-KS-K1 §3.3 (QT.VHT.TTSX.4A.1.3), Bảng 8',
      onStart: 'td.start', endText: 'Kết thúc — thay đổi đã bàn giao nhà máy áp dụng', steps: [
      [1, 'Lập yêu cầu thay đổi kỹ thuật ECR (BM.VHT.TTSX.01-SXL.07)', 'R-SX-REP', { next: 2, nlv: 1, label: 'Gửi', form: 'ecr' }],
      [2, 'Phân tích khả thi, ảnh hưởng tới cấu hình, eBOM, tiến độ, chi phí', 'R-SX-RD', { next: 3, nlv: 3, label: 'Hoàn thành phân tích', form: 'pt' }],
      [3, 'Lập lệnh thay đổi ECO (SXL.08)', 'R-SX-RD', { next: 4, nlv: 2, label: 'Trình phê duyệt', form: 'eco', action: 'td.level' }],
      [4, 'Phê duyệt ECO theo cấp (danh mục Cấp phê duyệt thay đổi kỹ thuật)', 'R-SX-CAP', { nlv: 2, form: 'yk', choices: [['Phê duyệt', 5], ['Trả lại', 3, 'no']] }],
      [5, 'Ghi mã ECO vào nhật ký quản lý dự án (SXL.10)', 'svc', { next: 6, label: 'Hệ thống cấp mã ECO, ghi nhật ký quản lý dự án', action: 'td.eco' }],
      [6, 'Cập nhật bản vẽ, firmware, eBOM; lập thông báo thay đổi ECN (SXL.09)', 'R-SX-RD', { next: 7, nlv: 5, label: 'Gửi thẩm định', form: 'ecn' }],
      [7, 'Đo kiểm mẫu, thẩm định ECN', 'R-SX-QA', { nlv: 3, form: 'kt', choices: [['Đạt', 8], ['Không đạt', 6, 'no']] }],
      [8, 'Ghi mã ECN, ngày ban hành, phiên bản tài liệu vào nhật ký quản lý dự án', 'svc', { next: 9, label: 'Hệ thống cấp mã ECN, ghi nhật ký quản lý dự án', action: 'td.ecn' }],
      [9, 'Bàn giao nhà máy áp dụng, thu hồi tài liệu cũ', 'R-SX-PM', { next: 'end', nlv: 2, label: 'Hoàn thành bàn giao', form: 'bg', action: 'td.close' }]] },
    /* T71 S8: đối tượng cha = đề nghị nghiệm thu lô (sx-nghiem-thu.js). OQC Không đạt → kết thúc hồ sơ, hệ thống lập phiếu bất thường (nt.oqc); bước 5 chặn khi chưa có biên bản đạt (guard nt.minutes);
       bước 6 service task nhận phiếu nhập kho TCT (API-04 — GIẢ LẬP) và lưu hồ sơ theo số sê-ri. */
    'SX-NT': { name: 'Nghiệm thu sản phẩm', short: 'HSNT', obj: 'lot', tab: 'kq', src: 'QT-TTSX-4A11 §5.4 bước 12–14; SX-KS-K2 §4.3 bước 4–5 (nghiệm thu theo lô, API-04)',
      onStart: 'nt.start', endText: (c) => (c.vars.oqcNok ? 'Kết thúc — lô không đạt đánh giá xuất xưởng, đã lập phiếu bất thường' : 'Kết thúc — lô đã nhập kho, hồ sơ lưu theo số sê-ri'), steps: [
      [1, 'Đề nghị nghiệm thu lô (số lượng, danh sách số sê-ri)', 'R-SX-REP', { next: 2, nlv: 1, label: 'Gửi', form: 'dn' }],
      [2, 'Đánh giá chất lượng xuất xưởng (OQC)', 'R-SX-QA', { nlv: 2, form: 'oqc', choices: [['Đạt', 3], ['Không đạt — lập phiếu bất thường', 'end', 'no']], action: 'nt.oqc' }],
      [3, 'Lập biên bản nghiệm thu cấp Tổng công ty (theo lô), BBBG hàng hóa (HOC), CO, CQ', 'R-SX-QA', { next: 4, nlv: 2, label: 'Trình phê duyệt', form: 'bb' }],
      [4, 'Phê duyệt nghiệm thu, phát hành chứng chỉ chất lượng', 'R-SX-LD', { nlv: 1, form: 'yk', choices: [['Phê duyệt', 5], ['Trả lại', 3, 'no']], action: 'nt.cert', sign: 'Chứng chỉ chất lượng lô {{lo.code}}' }],
      [5, 'Bao gói, nghiệm thu sau bao gói, đề nghị nhập kho Tổng công ty', 'R-SX-PM', { next: 6, nlv: 1, label: 'Gửi đề nghị nhập kho', form: 'nk', guard: 'nt.minutes' }],
      [6, 'Nhận phiếu nhập kho đã duyệt (ĐTMS / ERP Kho), lưu hồ sơ theo số sê-ri', 'svc', { next: 'end', label: 'Hệ thống nhận phiếu nhập kho, lưu hồ sơ theo số sê-ri', action: 'nt.stock' }]] },
    /* T71 S10 (D-124): đối tượng cha = đề xuất mua sắm từ sản xuất (sx-mua-sam.js). Gửi phê duyệt ở màn đề xuất khởi tạo hồ sơ; Từ chối kết thúc hồ sơ, đề xuất về Bị từ chối để sửa và gửi lại;
       Duyệt → service task gửi sang ĐTMS (API-01) tạo ĐXMS. Cấp duyệt GIẢ LẬP P-255 (Lãnh đạo Khối). */
    'SX-MS': { name: 'Phê duyệt đề xuất mua sắm từ sản xuất', short: 'HSMS', obj: 'proposal', src: 'SX-ULNL (Lập đề xuất mua sắm: Gửi phê duyệt, Duyệt / Từ chối, Đồng bộ kết quả); SX-KS-K2 §2.1, §2.3 API-01',
      onStart: 'ms.start', endText: (c) => (c.vars.msRejected ? 'Kết thúc — đề xuất bị từ chối, trả về người lập' : 'Kết thúc — đề xuất đã gửi sang ĐTMS'), steps: [
      [1, 'Lãnh đạo Khối xem xét, phê duyệt đề xuất mua sắm', 'R-SX-LD', { nlv: 2, form: 'yk', choices: [['Duyệt', 2], ['Từ chối', 'end', 'no']], action: 'ms.review' }],
      [2, 'Gửi đề xuất sang ĐTMS (API-01), tạo ĐXMS', 'svc', { next: 'end', label: 'Hệ thống gửi sang ĐTMS, tạo ĐXMS', action: 'ms.send' }]] },
  };

  /* Người xử lý theo vai của bước (GIẢ LẬP P-244: thật = cấu hình nhân sự theo bước / vai của quy trình, như Nhân sự thực hiện ĐXMS).
     Giám đốc dự án = PM của dự án; Lãnh đạo = Ban Giám đốc Khối 1 cho cả hai khối (chưa có vai lãnh đạo Khối 2). */
  D.sxAssign = (role, p) => ({ 'R-SX-PM': p && p.pm, 'R-SX-LD': 'sxld', 'R-SX-QA': 'sxqa', 'R-SX-RD': (p && p.rd) || 'sxrd', 'R-SX-NM': 'sxnm', 'R-SX-REP': p && p.creator, 'R-SX-XL': p && p.handler, 'R-SX-CAP': p && p.approver }[role] || null);
  /* T71 S3 — gói chuyển giao mẫu: TS-08 R&D đang lập, còn thiếu 3 hồ sơ (cảnh B). (b) Q2: chuyển giao xong trước khi lập dự án (QT-TTSX-4A11 §5.2 mục 27) — chưa có dự án nào của TS-08. pm = cán bộ Quản lý sản xuất của khối thẩm định. */
  D.sxPackages = [{ code: 'GCG-TS-08-01', product: 'TS-08', version: 'v1.0_HW_Rev1', khoi: 'K1', rd: 'sxrd', pm: 'sxpm', created: '2026-10-20', missing: ['K1-HS19', 'K1-HS22', 'K1-HS25'] }];
  /* Điều kiện 4M theo QT-TTSX-4A11 §5.4 bước 4, 6, 7 (kết quả ghi theo BM.QLHDSX.02 — biểu mẫu chưa có, tiêu chí GIẢ LẬP P-246; (b) Q8 bổ sung theo QT).
     Phần tử thứ 3 = tiêu chí hệ thống tự xác định; thứ 4 = loại tài liệu bắt buộc đính kèm khi xác nhận Đạt (ghi vào tab Tài liệu). */
  D.sxM4 = [
    ['MAN', 'Nhân lực (Man)', [['MAN1', 'Nhân sự phục vụ sản xuất bảo đảm theo yêu cầu hồ sơ công nghệ'],
      ['MAN2', 'Đào tạo về sản phẩm, quy trình sản xuất, công cụ sản xuất cho đơn vị sản xuất', null, 'DT']]],
    ['MACHINE', 'Máy móc, thiết bị (Machine)', [['MC1', 'Số lượng, tình trạng máy móc, trang bị theo hợp đồng sản xuất, tài liệu thiết kế và yêu cầu của Tổng công ty'],
      ['MC4', 'Phương tiện đo lường, thử nghiệm còn hạn kiểm định / hiệu chuẩn'], ['MC5', 'Trạm đo, phần mềm đo kiểm tự động đã cài đặt (VMMS)'],
      ['MC2', 'Công cụ dụng cụ, Jig, Stencil do VHT bảo đảm đã qua QC dự án kiểm tra trước khi bàn giao đối tác'], ['MC3', 'Điều kiện môi trường sản xuất tại các công đoạn (ESD, nhiệt độ, độ ẩm)'],
      ['MC6', 'Nhà xưởng, vị trí công nghệ sản xuất, đo kiểm, thử nghiệm theo yêu cầu hồ sơ công nghệ']]],
    ['MATERIAL', 'Vật tư, kinh phí (Material)', [['MT1', 'Tờ trình kinh phí sản xuất được Tổng Giám đốc phê duyệt'], ['MT2', 'Vật tư, linh kiện đợt 1 về kho, đạt kiểm tra đầu vào (IQC)'],
      ['MT3', 'Điều kiện lưu trữ vật tư hàng hóa sau kiểm tra đầu vào đúng quy định, an toàn, sắp xếp phù hợp']]],
    ['METHOD', 'Tài liệu, phương pháp công nghệ (Method)', [['MD1', 'Phiên bản sản phẩm có trong Kho sản phẩm sẵn sàng sản xuất (gói chuyển giao đã duyệt)', 'release'], ['MD2', 'Tài liệu sản xuất, quy trình công nghệ bàn giao cho đơn vị sản xuất (BM.QLHDSX.03)', 'handover']]],
  ];
  /* Kết quả 4M đã xác nhận của DA-SX-2026-002: còn thiếu Jig / Stencil (sản phẩm QĐ-12 đã chuyển giao 28/05/2026, trước khi lập dự án). */
  D.sxM4Seed = { 'DA-SX-2026-002': Object.fromEntries(['MAN1', 'MAN2', 'MC1', 'MC3', 'MC4', 'MC5', 'MC6', 'MT1', 'MT2', 'MT3', 'MD2'].map((k) => [k, { ok: true, note: '', who: 'sxpm', at: '2026-10-28 10:00' }])
    .concat([['MC2', { ok: false, note: 'Stencil khối nguồn đang gia công, dự kiến 25/11/2026', who: 'sxpm', at: '2026-10-28 10:00' }]])) };
  /* Hồ sơ mẫu: DA-SX-2026-004 đã trình kế hoạch, đang chờ Ban Giám đốc Khối phê duyệt (bước 4). Ba dự án còn lại đã phê duyệt trước khi có hệ thống (chỉ có Lịch sử). */
  D.sxCases = [
    /* T71 S8 — đề nghị nghiệm thu mẫu: DA-003 lô 1–4 đã nhập kho (khớp phiếu nhập kho S4); DA-001 đợt 1 (12 bộ) chờ OQC. */
    { code: 'HSNT-NT-2026-001-01', flow: 'SX-NT', obj: 'NT-2026-001', status: 'done', started: '2026-06-16 08:00', ended: '2026-06-20 16:00', tokens: [], vars: { oqcKetQua: 'Đạt — lấy mẫu 125 / 20.000 theo AQL 0,65', bbSo: '41/BB-NT', bbKetLuan: 'Lô đạt yêu cầu, đồng ý nghiệm thu' },
      hist: [{ step: null, who: 'sxnm', act: 'Khởi tạo hồ sơ', at: '2026-06-16 08:00' }, { step: 1, who: 'sxnm', act: 'Gửi', at: '2026-06-16 08:00' }, { step: 2, who: 'sxqa', act: 'Đạt', at: '2026-06-16 15:00' },
        { step: 3, who: 'sxqa', act: 'Trình phê duyệt', at: '2026-06-18 10:00' }, { step: 4, who: 'sxld', act: 'Phê duyệt', at: '2026-06-18 14:00' }, { step: 5, who: 'sxk2', act: 'Gửi đề nghị nhập kho', at: '2026-06-20 09:00' },
        { step: 6, who: null, act: 'Hệ thống nhận phiếu nhập kho, lưu hồ sơ theo số sê-ri', at: '2026-06-20 16:00' }, { step: null, who: null, act: 'Kết thúc — lô đã nhập kho, hồ sơ lưu theo số sê-ri', at: '2026-06-20 16:00' }] },
    { code: 'HSNT-NT-2026-002-01', flow: 'SX-NT', obj: 'NT-2026-002', status: 'done', started: '2026-07-21 08:00', ended: '2026-07-25 16:00', tokens: [], vars: { oqcKetQua: 'Đạt — lấy mẫu 125 / 20.000 theo AQL 0,65', bbSo: '52/BB-NT', bbKetLuan: 'Lô đạt yêu cầu, đồng ý nghiệm thu' },
      hist: [{ step: null, who: 'sxnm', act: 'Khởi tạo hồ sơ', at: '2026-07-21 08:00' }, { step: 1, who: 'sxnm', act: 'Gửi', at: '2026-07-21 08:00' }, { step: 2, who: 'sxqa', act: 'Đạt', at: '2026-07-21 15:00' },
        { step: 3, who: 'sxqa', act: 'Trình phê duyệt', at: '2026-07-23 10:00' }, { step: 4, who: 'sxld', act: 'Phê duyệt', at: '2026-07-23 14:00' }, { step: 5, who: 'sxk2', act: 'Gửi đề nghị nhập kho', at: '2026-07-25 09:00' },
        { step: 6, who: null, act: 'Hệ thống nhận phiếu nhập kho, lưu hồ sơ theo số sê-ri', at: '2026-07-25 16:00' }, { step: null, who: null, act: 'Kết thúc — lô đã nhập kho, hồ sơ lưu theo số sê-ri', at: '2026-07-25 16:00' }] },
    { code: 'HSNT-NT-2026-003-01', flow: 'SX-NT', obj: 'NT-2026-003', status: 'done', started: '2026-08-25 08:00', ended: '2026-08-29 16:00', tokens: [], vars: { oqcKetQua: 'Đạt — lấy mẫu 125 / 20.000 theo AQL 0,65', bbSo: '63/BB-NT', bbKetLuan: 'Lô đạt yêu cầu, đồng ý nghiệm thu' },
      hist: [{ step: null, who: 'sxnm', act: 'Khởi tạo hồ sơ', at: '2026-08-25 08:00' }, { step: 1, who: 'sxnm', act: 'Gửi', at: '2026-08-25 08:00' }, { step: 2, who: 'sxqa', act: 'Đạt', at: '2026-08-25 15:00' },
        { step: 3, who: 'sxqa', act: 'Trình phê duyệt', at: '2026-08-27 10:00' }, { step: 4, who: 'sxld', act: 'Phê duyệt', at: '2026-08-27 14:00' }, { step: 5, who: 'sxk2', act: 'Gửi đề nghị nhập kho', at: '2026-08-29 09:00' },
        { step: 6, who: null, act: 'Hệ thống nhận phiếu nhập kho, lưu hồ sơ theo số sê-ri', at: '2026-08-29 16:00' }, { step: null, who: null, act: 'Kết thúc — lô đã nhập kho, hồ sơ lưu theo số sê-ri', at: '2026-08-29 16:00' }] },
    { code: 'HSNT-NT-2026-004-01', flow: 'SX-NT', obj: 'NT-2026-004', status: 'done', started: '2026-09-29 08:00', ended: '2026-10-03 16:00', tokens: [], vars: { oqcKetQua: 'Đạt — lấy mẫu 125 / 20.000 theo AQL 0,65', bbSo: '74/BB-NT', bbKetLuan: 'Lô đạt yêu cầu, đồng ý nghiệm thu' },
      hist: [{ step: null, who: 'sxnm', act: 'Khởi tạo hồ sơ', at: '2026-09-29 08:00' }, { step: 1, who: 'sxnm', act: 'Gửi', at: '2026-09-29 08:00' }, { step: 2, who: 'sxqa', act: 'Đạt', at: '2026-09-29 15:00' },
        { step: 3, who: 'sxqa', act: 'Trình phê duyệt', at: '2026-10-01 10:00' }, { step: 4, who: 'sxld', act: 'Phê duyệt', at: '2026-10-01 14:00' }, { step: 5, who: 'sxk2', act: 'Gửi đề nghị nhập kho', at: '2026-10-03 09:00' },
        { step: 6, who: null, act: 'Hệ thống nhận phiếu nhập kho, lưu hồ sơ theo số sê-ri', at: '2026-10-03 16:00' }, { step: null, who: null, act: 'Kết thúc — lô đã nhập kho, hồ sơ lưu theo số sê-ri', at: '2026-10-03 16:00' }] },
    { code: 'HSNT-NT-2026-005-01', flow: 'SX-NT', obj: 'NT-2026-005', status: 'running', started: '2026-11-13 09:00', tokens: [{ id: 's6', step: 2, who: 'sxqa', since: '2026-11-13 09:00' }], vars: {},
      hist: [{ step: null, who: 'sxpm', act: 'Khởi tạo hồ sơ', at: '2026-11-13 09:00' }, { step: 1, who: 'sxpm', act: 'Gửi', since: '2026-11-13 09:00', at: '2026-11-13 09:00' }] },
    /* T71 S7 — thay đổi kỹ thuật đã hoàn thành của DA-001 (đổi module PA sang bản RoHS). */
    { code: 'HSTD-ECR-2026-001-01', flow: 'SX-TD', obj: 'ECR-2026-001', status: 'done', started: '2026-06-22 09:00', ended: '2026-08-05 15:00', tokens: [],
      vars: { ptCauHinh: 'Không đổi giao tiếp khối; đổi footprint module PA trên bo mạch chính.', ptEbom: 'Thay mã RF-PA-25W rev A bằng rev B (RoHS).', ptTienDo: 10, ptChiPhi: 120000000,
        ecoNoiDung: 'Thay module PA rev A bằng rev B, cập nhật bản vẽ bo mạch chính rev 3.', ecoPhienBan: 'v2.1_HW_Rev3', ecnNoiDung: 'Ban hành bản vẽ bo mạch chính rev 3, eBOM v2.1.3.', bgNgay: '05/08/2026', bgSeri: 'VT25-0009' },
      hist: [{ step: null, who: 'sxpm', act: 'Khởi tạo hồ sơ', at: '2026-06-22 09:00' }, { step: 1, who: 'sxpm', act: 'Gửi', since: '2026-06-22 09:00', at: '2026-06-22 09:00' },
        { step: 2, who: 'sxrd', act: 'Hoàn thành phân tích', since: '2026-06-22 09:00', at: '2026-06-26 16:00' }, { step: 3, who: 'sxrd', act: 'Trình phê duyệt', since: '2026-06-26 16:00', at: '2026-07-01 10:00' },
        { step: 4, who: 'sxld', act: 'Phê duyệt', since: '2026-07-01 10:00', at: '2026-07-08 09:00' }, { step: 5, who: null, act: 'Hệ thống cấp mã ECO, ghi nhật ký quản lý dự án', at: '2026-07-08 09:00' },
        { step: 6, who: 'sxrd', act: 'Gửi thẩm định', since: '2026-07-08 09:00', at: '2026-07-24 17:00' }, { step: 7, who: 'sxqa', act: 'Đạt', since: '2026-07-24 17:00', at: '2026-07-30 11:00' },
        { step: 8, who: null, act: 'Hệ thống cấp mã ECN, ghi nhật ký quản lý dự án', at: '2026-07-30 11:00' }, { step: 9, who: 'sxpm', act: 'Hoàn thành bàn giao', since: '2026-07-30 11:00', at: '2026-08-05 15:00' },
        { step: null, who: null, act: 'Kết thúc — thay đổi đã bàn giao nhà máy áp dụng', at: '2026-08-05 15:00' }] },
    /* T71 S6 — hồ sơ xử lý bất thường mẫu. */
    { code: 'HSBT-BT-2026-001-01', flow: 'SX-BT', obj: 'BT-2026-001', status: 'done', started: '2026-09-02 09:20', ended: '2026-09-10 16:00', tokens: [],
      vars: { blNguyenNhan: 'Cấu hình suy hao cáp của máy đo công suất RF tại trạm đo VMC chưa cập nhật sau khi thay cáp.', paBienPhap: 'Cập nhật bảng suy hao cáp. Đo lại 8 bộ bị ảnh hưởng.', tkKetQua: 'Đã cập nhật bảng suy hao, đo lại 6 / 8 bộ đạt.' },
      hist: [{ step: null, who: 'sxqa', act: 'Khởi tạo hồ sơ', at: '2026-09-02 09:20' }, { step: 1, who: 'sxqa', act: 'Gửi', since: '2026-09-02 09:20', at: '2026-09-02 09:20' },
        { step: 2, who: 'sxpm', act: 'Hoàn thành tiếp nhận', since: '2026-09-02 09:20', at: '2026-09-03 08:40', note: 'Loại 1 · Trung bình' }, { step: 3, who: 'sxpm', act: 'Trình phê duyệt', since: '2026-09-03 08:40', at: '2026-09-04 10:00' },
        { step: 4, who: 'sxld', act: 'Phê duyệt', since: '2026-09-04 10:00', at: '2026-09-05 09:15' }, { step: 5, who: 'sxpm', act: 'Hoàn thành triển khai', since: '2026-09-05 09:15', at: '2026-09-09 15:00' },
        { step: 6, who: 'sxqa', act: 'Không đạt (NOK)', since: '2026-09-09 15:00', at: '2026-09-10 16:00', note: 'Còn 2 / 8 bộ suy hao vượt ngưỡng ±0,5 dB, cần xử lý lại cáp nối' },
        { step: null, who: null, act: 'Kết thúc vòng 1 — mở vòng xử lý mới do kiểm tra không đạt', at: '2026-09-10 16:00' }] },
    { code: 'HSBT-BT-2026-001-02', flow: 'SX-BT', obj: 'BT-2026-001', status: 'done', started: '2026-09-10 16:00', ended: '2026-09-15 16:30', tokens: [],
      vars: { blNguyenNhan: 'Cấu hình suy hao cáp của máy đo công suất RF tại trạm đo VMC chưa cập nhật sau khi thay cáp.', paBienPhap: 'Cập nhật bảng suy hao cáp. Đo lại 8 bộ bị ảnh hưởng. Thay 2 đoạn cáp nối suy hao cao.', tkKetQua: 'Đã cập nhật cấu hình, thay cáp nối, đo lại 8 / 8 bộ đạt.', bhBaiHoc: 'Bổ sung bước kiểm tra cấu hình suy hao vào checklist đầu ca của trạm đo.' },
      hist: [{ step: null, who: 'sxpm', act: 'Khởi tạo hồ sơ (vòng 2 sau NOK)', at: '2026-09-10 16:00' },
        { step: 1, who: 'sxqa', act: 'Kế thừa từ vòng 1', since: '2026-09-10 16:00', at: '2026-09-10 16:00' }, { step: 2, who: 'sxpm', act: 'Kế thừa từ vòng 1', since: '2026-09-10 16:00', at: '2026-09-10 16:00', note: 'Loại 1 · Trung bình' },
        { step: 3, who: 'sxpm', act: 'Trình phê duyệt', since: '2026-09-10 16:00', at: '2026-09-11 09:00' }, { step: 4, who: 'sxld', act: 'Phê duyệt', since: '2026-09-11 09:00', at: '2026-09-11 15:00' },
        { step: 5, who: 'sxpm', act: 'Hoàn thành triển khai', since: '2026-09-11 15:00', at: '2026-09-12 16:00' }, { step: 6, who: 'sxqa', act: 'Đạt (OK)', since: '2026-09-12 16:00', at: '2026-09-14 10:30' },
        { step: 7, who: 'sxpm', act: 'Đóng phiếu', since: '2026-09-14 10:30', at: '2026-09-15 16:30' },
        { step: null, who: null, act: 'Kết thúc — phiếu bất thường đã đóng', at: '2026-09-15 16:30' }] },
    { code: 'HSBT-BT-2026-002-01', flow: 'SX-BT', obj: 'BT-2026-002', status: 'running', started: '2026-10-19 14:00', tokens: [{ id: 's3', step: 5, who: 'sxrd', since: '2026-10-29 10:00' }],
      vars: { blNguyenNhan: 'Gá đỡ cụm thấu kính thiết kế dung sai ±0,05 mm không đủ cứng; sau thử rung trục quang lệch 0,3 mrad.', paBienPhap: 'R&D thiết kế lại gá đỡ (tăng gân cứng), đánh giá ảnh hưởng tới bản vẽ cơ khí và eBOM; đề xuất mở yêu cầu thay đổi kỹ thuật.' },
      hist: [{ step: null, who: 'sxqa', act: 'Khởi tạo hồ sơ', at: '2026-10-19 14:00' }, { step: 1, who: 'sxqa', act: 'Gửi', since: '2026-10-19 14:00', at: '2026-10-19 14:00' },
        { step: 2, who: 'sxpm', act: 'Hoàn thành tiếp nhận', since: '2026-10-19 14:00', at: '2026-10-20 09:00', note: 'Loại 2 · Nghiêm trọng' }, { step: 3, who: 'sxpm', act: 'Trình phê duyệt', since: '2026-10-20 09:00', at: '2026-10-23 16:00' },
        { step: 4, who: 'sxld', act: 'Phê duyệt', since: '2026-10-23 16:00', at: '2026-10-29 10:00' }] },
    { code: 'HSBT-BT-2026-003-01', flow: 'SX-BT', obj: 'BT-2026-003', status: 'running', started: '2026-11-05 07:50', tokens: [{ id: 's4', step: 6, who: 'sxqa', since: '2026-11-14 11:00' }],
      vars: { blNguyenNhan: 'Stencil dây chuyền 2 mòn, lượng thiếc in thiếu ở chân chip MT7981.', paBienPhap: 'Nhà máy thay stencil, hàn lại 64 thiết bị lỗi, tăng tần suất AOI sau in thiếc.', tkKetQua: 'Đã thay stencil 08/11, hàn lại 64 / 64 thiết bị, AOI 2 giờ / lần.' },
      hist: [{ step: null, who: 'sxnm', act: 'Khởi tạo hồ sơ', at: '2026-11-05 07:50' }, { step: 1, who: 'sxnm', act: 'Gửi', since: '2026-11-05 07:50', at: '2026-11-05 07:50' },
        { step: 2, who: 'sxk2', act: 'Hoàn thành tiếp nhận', since: '2026-11-05 07:50', at: '2026-11-05 15:00', note: 'Loại 3 · Thấp' }, { step: 3, who: 'sxk2', act: 'Trình phê duyệt', since: '2026-11-05 15:00', at: '2026-11-06 10:00' },
        { step: 4, who: 'sxld', act: 'Phê duyệt', since: '2026-11-06 10:00', at: '2026-11-07 08:30' }, { step: 5, who: 'sxnm', act: 'Hoàn thành triển khai', since: '2026-11-07 08:30', at: '2026-11-14 11:00' }] },
    { code: 'HSBT-BT-2026-004-01', flow: 'SX-BT', obj: 'BT-2026-004', status: 'running', started: '2026-11-16 08:10', tokens: [{ id: 's5', step: 2, who: 'sxpm', since: '2026-11-16 08:10' }], vars: {},
      hist: [{ step: null, who: 'sxqa', act: 'Khởi tạo hồ sơ', at: '2026-11-16 08:10' }, { step: 1, who: 'sxqa', act: 'Gửi', since: '2026-11-16 08:10', at: '2026-11-16 08:10' }] },
    { code: 'HSCG-GCG-TS-08-01-01', flow: 'SX-BG', obj: 'GCG-TS-08-01', status: 'running', started: '2026-10-20 08:30',
      tokens: [{ id: 's2', step: 1, who: 'sxrd', since: '2026-11-05 09:00' }], vars: {},
      hist: [{ step: null, who: 'sxrd', act: 'Khởi tạo hồ sơ', at: '2026-10-20 08:30' }] },
    /* T71 S12: ECR nhận từ KHCN — bước 1 do hệ thống ghi khi nhận yêu cầu (API), đang ở bước 2 Phân tích của R&D. */
    { code: 'HSTD-ECR-2026-002-01', flow: 'SX-TD', obj: 'ECR-2026-002', status: 'running', started: '2026-11-12 14:20', tokens: [{ id: 's6', step: 2, who: 'sxrd', since: '2026-11-12 14:20' }],
      vars: { tdProject: 'DA-SX-2026-002', tdTitle: 'Cải tiến thuật toán ổn định ảnh hồng ngoại khi rung (firmware xử lý ảnh)', tdLyDo: 'Đề tài KHCN cải tiến QĐ-12 hoàn thành thử nghiệm: ảnh rung khi gá xoay ở tốc độ cao; đề nghị áp dụng firmware mới cho lô sản xuất.',
        tdNoiDung: 'Cập nhật firmware bộ xử lý ảnh i.MX 8M Plus lên v1.4 (bộ lọc ổn định ảnh mới); không đổi phần cứng.' },
      hist: [{ step: null, who: null, act: 'Khởi tạo hồ sơ', note: 'Nhận yêu cầu YCTĐ-KHCN-2026-014 từ hệ thống KHCN', at: '2026-11-12 14:20' }, { step: 1, who: null, act: 'Nhận từ hệ thống KHCN', note: 'YCTĐ-KHCN-2026-014', since: '2026-11-12 14:20', at: '2026-11-12 14:20' }] },
    { code: 'HSKH-DA-SX-2026-004-01', flow: 'SX-KH', obj: 'DA-SX-2026-004', status: 'running', started: '2026-11-10 10:25',
      tokens: [{ id: 's1', step: 4, who: 'sxld', since: '2026-11-13 16:05' }],
      vars: { paTomTat: 'VMC tổng thầu chế tạo, tích hợp, đo kiểm 3.000 trạm gNB-M3; VHT mua sắm linh kiện leadtime dài (FPGA, khối RF) trước để bảo đảm tiến độ 2027.',
        paFile: 'Bao cao phuong an san xuat gNB-M3.pdf', paRangBuoc: [{ noiDung: 'FPGA Kintex-7 leadtime 40 tuần, cần Export License', anhHuong: 'Mốc ký hợp đồng tổng thầu 31/12/2026 trễ nếu chờ VMC tự mua', deXuat: 'VHT mua trước FPGA, khối RF bằng nguồn dự án 2026' }],
        paGoiMs: 'Gói 1: FPGA, khối RF (VHT mua, đợt 1). Gói 2: tổng thầu chế tạo, tích hợp, đo kiểm (VMC).', paPhoiHop: ['TTMS', 'NCPT'],
        cdNoiDung: 'Đồng ý VHT mua trước vật tư leadtime dài; Trung tâm Mua sắm lập kế hoạch lựa chọn nhà thầu ngay trong tháng 11.', khSo: '118/KH-TTSX', khMucTieu: 'Sản xuất, nghiệm thu 3.000 trạm 5G Macro gNB-M3 đáp ứng kế hoạch triển khai mạng năm 2027.',
        khKr1: 'Ký hợp đồng tổng thầu với VMC trước 31/12/2026', khKr2: '100% linh kiện leadtime dài về kho trước 31/03/2027', khKr3: 'Nghiệm thu đủ 3.000 trạm trước 30/06/2027',
        khYeuCau: 'Trạm đạt chỉ tiêu kỹ thuật phiên bản v1.2; tỷ lệ lỗi xuất xưởng dưới 0,5%.',
        khPhuongAn: 'VMC tổng thầu; VHT giám sát theo 4 mốc tổng; Trung tâm ĐBCL kiểm soát IQC, IPQC, OQC tại nhà máy VMC.',
        khToChuc: 'Trung tâm Sản xuất chủ trì; Trung tâm Mua sắm lựa chọn nhà thầu; Trung tâm ĐBCL kiểm soát chất lượng.',
        khNhanSu: [{ hoTen: 'Vũ Thị Hương', donVi: 'Phòng Quản lý sản xuất — Khối 2', vaiTro: 'Giám đốc dự án' }, { hoTen: 'Đoàn Văn Khải', donVi: 'Trung tâm Đảm bảo chất lượng', vaiTro: 'Phụ trách chất lượng' }],
        khMoc: [{ ten: 'Ký hợp đồng tổng thầu với VMC', han: '31/12/2026' }, { ten: 'Linh kiện leadtime dài về đủ', han: '31/03/2027' }, { ten: 'Hoàn thành chế tạo, tích hợp', han: '31/05/2027' }, { ten: 'Nghiệm thu, nhập kho', han: '30/06/2027' }],
        khRuiRo: 'FPGA có leadtime 40 tuần: đề xuất mua trước bằng nguồn dự án 2026.', khPl1: 'Phu luc I - Cau hinh san pham.pdf', khPl6: 'Phu luc VI - Ke hoach chi tiet.xlsx' },
      hist: [{ step: null, who: 'sxk2', act: 'Khởi tạo hồ sơ', at: '2026-11-10 10:25' },
        { step: 1, who: 'sxk2', act: 'Trình Ban Giám đốc Khối', since: '2026-11-10 10:25', at: '2026-11-11 09:40', note: '1 ràng buộc cần xin ý kiến' },
        { step: 2, who: 'sxld', act: 'Đồng ý phương án', since: '2026-11-11 09:40', at: '2026-11-11 15:40', note: 'Đồng ý VHT mua trước vật tư leadtime dài; Trung tâm Mua sắm lập kế hoạch lựa chọn nhà thầu ngay trong tháng 11.' },
        { step: 3, who: 'sxk2', act: 'Trình phê duyệt', since: '2026-11-11 15:40', at: '2026-11-13 16:05', note: 'Kế hoạch số 118/KH-TTSX' }] },
  ];

  /* ---------- T71 S4 — Mua sắm (SX-10) ----------
     MBOM dự toán theo sản phẩm (đồng bộ VMMS, chỉ xem — GIẢ LẬP P-248). Dòng: [mã vật tư, tên, ĐVT, định mức / bộ, đơn giá dự toán (đồng), leadtime (tuần), Export License]. */
  const mb = (rows) => rows.map(([code, name, unit, per, price, lt, el]) => ({ code, name, unit, per, price, lt, el: !!el }));
  D.sxMbom = {
    'VT-25': mb([['FPGA-XC7K325', 'FPGA Kintex-7 XC7K325T', 'chiếc', 1, 38500000, 40, 1], ['RF-PA-25W', 'Module khuếch đại công suất RF 25W', 'chiếc', 2, 12800000, 24, 1],
      ['PCB-VT25-MB', 'Bo mạch chính VT-25 (gia công)', 'chiếc', 1, 6200000, 8], ['BAT-LI-12V', 'Pin Li-ion 12V 10Ah', 'khối', 2, 4100000, 12], ['MECH-VT25', 'Vỏ cơ khí VT-25', 'bộ', 1, 9800000, 10], ['CON-MIL-38999', 'Đầu nối chuẩn MIL-DTL-38999', 'chiếc', 6, 1450000, 20, 1]]),
    'QĐ-12': mb([['IR-DET-640', 'Đầu thu hồng ngoại 640×512', 'chiếc', 1, 185000000, 36, 1], ['LENS-ZOOM-30X', 'Cụm ống kính zoom quang 30x', 'bộ', 1, 64000000, 28, 1],
      ['SOC-IMX8', 'Bộ xử lý ảnh i.MX 8M Plus', 'chiếc', 1, 3900000, 16], ['PSU-28V-200W', 'Khối nguồn 28V 200W', 'chiếc', 1, 7600000, 10], ['MECH-QD12', 'Vỏ cơ khí, gá xoay QĐ-12', 'bộ', 1, 42000000, 14]]),
    'RĐ-40': mb([['TRM-X-BAND', 'Module thu phát T/R băng X', 'chiếc', 16, 21500000, 32, 1], ['FPGA-ZU9EG', 'FPGA Zynq UltraScale+ ZU9EG', 'chiếc', 2, 52000000, 40, 1],
      ['ANT-ARRAY-40', 'Mảng anten RĐ-40', 'bộ', 1, 96000000, 20], ['MECH-RD40', 'Kết cấu cơ khí, bệ quay RĐ-40', 'bộ', 1, 135000000, 16]]),
    'WM-6': mb([['SOC-MT7981', 'Chip Wi-Fi 6 MT7981', 'chiếc', 1, 185000, 26], ['DDR4-512M', 'DDR4 512MB', 'chiếc', 1, 62000, 12], ['PCB-WM6', 'Bo mạch WM-6 (SMT trọn gói)', 'chiếc', 1, 98000, 6],
      ['ADAPTER-12V', 'Adapter 12V 1A', 'chiếc', 1, 41000, 8], ['CASE-WM6', 'Vỏ nhựa WM-6', 'bộ', 1, 36000, 6]]),
    'gNB-M3': mb([['FPGA-ZU47DR', 'RFSoC Zynq ZU47DR', 'chiếc', 2, 168000000, 52, 1], ['PA-GAN-80W', 'Module PA GaN 80W băng n78', 'chiếc', 4, 18500000, 30, 1],
      ['BBU-BOARD-M3', 'Bo mạch xử lý băng gốc gNB-M3', 'chiếc', 1, 42000000, 18], ['RRU-MECH-M3', 'Vỏ RRU tản nhiệt', 'bộ', 1, 12500000, 12], ['PSU-48V-1KW', 'Khối nguồn -48V 1kW', 'chiếc', 1, 8900000, 10]]),
    'ONT-X2': mb([['SOC-ONT-X2', 'Chip GPON SoC', 'chiếc', 1, 210000, 24], ['PCB-ONT-X2', 'Bo mạch ONT-X2', 'chiếc', 1, 76000, 6], ['CASE-ONT', 'Vỏ nhựa ONT', 'bộ', 1, 28000, 6]]),
  };
  /* Tồn kho khả dụng ERP Kho TCT theo mã vật tư (tra cứu trực tiếp — GIẢ LẬP P-248; thật: API tra cứu tồn kho do TTMS cung cấp, SX-KS-K1 §2.5). */
  D.sxStock = { 'FPGA-XC7K325': 6, 'RF-PA-25W': 0, 'BAT-LI-12V': 30, 'CON-MIL-38999': 120, 'IR-DET-640': 2, 'SOC-IMX8': 40, 'PSU-28V-200W': 5, 'TRM-X-BAND': 0, 'FPGA-ZU9EG': 3,
    'SOC-MT7981': 15000, 'DDR4-512M': 22000, 'FPGA-ZU47DR': 120, 'PA-GAN-80W': 600, 'PSU-48V-1KW': 250 };
  /* Đề xuất mua sắm đã gửi trước đây (dữ liệu chuyển đổi). sync = ảnh trạng thái ĐTMS nhận qua API-02 / 03 / 04 (ĐXMS gốc không nằm trong bộ dữ liệu mẫu ĐTMS — GIẢ LẬP).
     Góp ý 27/11: một mã — mã đề xuất là mã ĐXMS trên ĐTMS (bỏ mã ĐXSX riêng). api: 'ERR' = gọi API-01 lỗi, chưa có mã ĐXMS (ref = khoá nội bộ). */
  D.sxProposals = [
    { code: 'ĐXMS-2026-0058', project: 'DA-SX-2026-001', dot: 1, title: 'Mua sắm vật tư leadtime dài VT-25 đợt 1', creator: 'sxpm', created: '2026-03-18', sent: '2026-03-20', priority: 'Thường', period: '04/2026 – 12/2026',
      lines: [['FPGA-XC7K325', 34], ['RF-PA-25W', 80], ['CON-MIL-38999', 120]],
      sync: { dxms: ['ĐXMS-2026-0058', 'Đã phê duyệt', 'success', '2026-04-10'], kh: ['KHLCNT-2026-0004', 'Hoàn thành KHLCNT', 'success', '2026-05-06'],
        pkgs: [['GT-2026-0008', 'Tổng thầu chế tạo, tích hợp, đo kiểm VT-25 đợt 1 (VMC)', 'Đã có kết quả LCNT', 'success']],
        hd: [['HĐ-2026-0019', 'Hợp đồng tổng thầu VT-25 đợt 1 với VMC', 'Đang thực hiện', 'success', 'Công ty Mua sắm Sản xuất Viettel', 14650000000, '2026-05-28']],
        kho: [['PNK-2026-0311', 'Nhập kho vật tư leadtime dài đợt 1', '2026-08-14', 'Đã nhập kho']] } },
    { code: 'ĐXMS-2026-0066', project: 'DA-SX-2026-003', dot: 1, title: 'Thuê gia công trọn gói 120.000 bộ phát WM-6', creator: 'sxk2', created: '2026-04-03', sent: '2026-04-05', priority: 'Thường', period: '05/2026 – 12/2026',
      lines: [['SOC-MT7981', 105000], ['DDR4-512M', 98000], ['PCB-WM6', 120000], ['ADAPTER-12V', 120000], ['CASE-WM6', 120000]],
      sync: { dxms: ['ĐXMS-2026-0066', 'Đã phê duyệt', 'success', '2026-04-14'], kh: ['KHLCNT-2026-0006', 'Hoàn thành KHLCNT', 'success', '2026-04-22'],
        pkgs: [['GT-2026-0012', 'Gia công trọn gói bộ phát WM-6', 'Đã có kết quả LCNT', 'success']],
        hd: [['HĐ-2026-0024', 'Hợp đồng gia công WM-6 với Nhà máy lắp ráp Hải Phòng', 'Đang thực hiện', 'success', 'Nhà máy lắp ráp thiết bị viễn thông Hải Phòng', 51600000000, '2026-04-28']],
        kho: [['PNK-2026-0402', 'Nhập kho lô 1 (20.000 thiết bị)', '2026-06-20', 'Đã nhập kho'], ['PNK-2026-0455', 'Nhập kho lô 2 (20.000 thiết bị)', '2026-07-25', 'Đã nhập kho'],
          ['PNK-2026-0508', 'Nhập kho lô 3 (20.000 thiết bị)', '2026-08-29', 'Đã nhập kho'], ['PNK-2026-0561', 'Nhập kho lô 4 (20.000 thiết bị)', '2026-10-03', 'Đã nhập kho']] } },
    { ref: 'SXDX-MAU-01', code: '', api: 'ERR', apiErr: 'Không kết nối được ĐTMS (hết thời gian chờ). Bấm Gửi lại để gửi lại.', project: 'DA-SX-2026-001', dot: 1, title: 'Mua sắm bổ sung đầu nối MIL-DTL-38999 VT-25',
      creator: 'sxpm', created: '2026-11-12', priority: 'Thường', period: '12/2026 – 03/2027', lines: [['CON-MIL-38999', 24]] },
  ];

  /* ---------- T71 S5 — Bán thành phẩm & tiến độ (SX-11) ----------
     Nhật ký sản lượng mẫu: [hạng mục bước 9, ngày, số đạt (mốc: % hoàn thành), số lỗi, nguồn ('TAY' nhập tay | 'TRAM' trạm đo VMMS), người nhập, ghi chú].
     DA-001 VMC theo mốc (mốc 1 = ngày ký hợp đồng tổng thầu, mốc 2 = ngày nhập kho vật tư — khớp tab Mua sắm); DA-003 gia công theo lô (lô 1–4 khớp phiếu nhập kho). */
  D.sxOutput = {
    'DA-SX-2026-001': [['M1', '2026-05-28', 100, 0, 'TAY', 'sxpm', 'Ký hợp đồng tổng thầu HĐ-2026-0019'], ['M2', '2026-07-20', 70, 0, 'TAY', 'sxpm', 'FPGA về 34 / 34; module PA về 52 / 80'],
      ['M2', '2026-08-14', 100, 0, 'TAY', 'sxpm', 'Nhập kho đủ vật tư đợt 1'], ['M3', '2026-10-05', 30, 0, 'TAY', 'sxpm', 'VMC hoàn thành 12 / 40 bộ tích hợp'], ['M3', '2026-11-10', 55, 0, 'TAY', 'sxpm', 'Chậm do module PA về muộn 3 tuần']],
    'DA-SX-2026-003': [['L1', '2026-06-15', 20000, 210, 'TRAM', 'sxnm', ''], ['L2', '2026-07-20', 20000, 185, 'TRAM', 'sxnm', ''], ['L3', '2026-08-24', 20000, 160, 'TRAM', 'sxnm', ''],
      ['L4', '2026-09-28', 20000, 172, 'TRAM', 'sxnm', ''], ['L5', '2026-10-30', 8000, 64, 'TRAM', 'sxnm', ''], ['L5', '2026-11-12', 4000, 40, 'TRAM', 'sxnm', 'Dây chuyền dừng 2 ngày bảo trì lò hàn']],
  };
  /* Trạm đo VMMS (chỉ xem, đồng bộ — GIẢ LẬP P-250): số đạt / lỗi lũy kế của hạng mục tại trạm cuối công đoạn. */
  D.sxStations = {
    'DA-SX-2026-003': [{ code: 'HP-FCT-02', name: 'Trạm kiểm tra chức năng cuối (FCT) — dây chuyền 2', item: 'L5', ok: 12500, ng: 109, at: '2026-11-16 07:30' }],
    'DA-SX-2026-002': [{ code: 'HL-QH-01', name: 'Trạm đo kiểm khối quang học', item: 'BTP1', ok: 4, ng: 1, at: '2026-11-15 17:00' },
      { code: 'HL-XLA-01', name: 'Trạm đo kiểm khối xử lý ảnh', item: 'BTP2', ok: 6, ng: 0, at: '2026-11-15 17:00' }],
  };

  /* ---------- T71 S6 — Phiếu bất thường mẫu (BM.QLBT.01). type / sev: người lập chọn ở bước 1 (T74 #100; loại theo danh mục sx-bat-thuong, mức độ 1–4 = cột sla1–sla4);
     received: ngày tiếp nhận ở bước 2; guess: dự đoán sơ bộ nguyên nhân; files: tệp đính kèm theo mục BM.QLBT.01 (bm, iqc, qc, kd, khac). ---------- */
  D.sxSev = { 1: 'Rất nghiêm trọng', 2: 'Nghiêm trọng', 3: 'Trung bình', 4: 'Thấp' };
  D.sxIssues = [
    { code: 'BT-2026-005', draft: true, project: 'DA-SX-2026-001', title: 'Đầu nối MIL-38999 lô 12 lỏng chân tiếp xúc (nháp)', desc: 'Phát hiện 3 / 40 đầu nối lỏng chân khi lắp thử; đang chờ bổ sung số liệu trước khi gửi.', found: '2026-11-18', foundTime: '09:30', place: 'NPH-05', qty: 3, unit: 'DVT-02', sample: 40, spMa: 'VT-25', creator: 'sxqa' },
    { code: 'BT-2026-001', nok: 1, project: 'DA-SX-2026-001', title: 'Sai lệch cấu hình máy đo công suất RF tại trạm đo VMC', desc: '8 bộ VT-25 đo công suất phát thấp hơn chỉ tiêu 0,8 dB, đo lại bằng máy khác đạt.',
      found: '2026-09-02', foundTime: '14:20', place: 'NPH-05', qty: 8, unit: 'DVT-02', spMa: 'VT-25', serial: 'VT25-0003', sample: 20, stage: 'CD-06', op: 'ĐK-05', shift: 'CA-2',
      req: 'Công suất phát đo tại trạm đo kiểm cuối thấp hơn chỉ tiêu 0,8 dB', causes: ['NN2', 'NN4'], guess: 'Máy đo công suất sai lệch cấu hình sau lần cập nhật phần mềm công cụ.',
      actions: [{ hd: 'Dừng đo, cách ly 8 bộ nghi vấn', who: 'sxqa', han: '2026-09-02' }, { hd: 'Kiểm tra lại cấu hình, hiệu chuẩn máy đo công suất RF', who: 'sxqa', han: '2026-09-03' }],
      inspect: ['sxqa', 'sxpm'], partner: [], media: 'anh_man_hinh_may_do_VT25.jpg', creator: 'sxqa', type: 'L1', sev: 3, received: '2026-09-03', closed: '2026-09-15' },
    { code: 'BT-2026-002', project: 'DA-SX-2026-002', title: 'Khối quang học lệch trục quang sau thử rung', desc: 'Sau thử rung theo chỉ tiêu, 3 / 4 khối quang học lệch trục 0,3 mrad, vượt dung sai 0,1 mrad.',
      found: '2026-10-19', foundTime: '09:40', place: 'NPH-06', qty: 3, unit: 'DVT-02', spMa: 'QĐ-12', serial: 'QD12-0002', sample: 4, stage: 'CD-07', op: 'TN-02', shift: 'CA-HC',
      req: 'Độ lệch trục quang sau thử rung không vượt 0,1 mrad', causes: ['NN4'], guess: 'Gá cố định khối quang học chưa đủ cứng với tải rung theo chỉ tiêu.',
      actions: [{ hd: 'Dừng giao các khối quang học đã thử rung', who: 'sxqa', han: '2026-10-20' }, { hd: 'Đánh giá lại thiết kế gá khối quang học', who: 'sxrd', han: '2026-10-27' }],
      inspect: ['sxqa'], partner: [], media: 'video_thu_rung_QD12.mp4', creator: 'sxqa', type: 'L2', sev: 2, received: '2026-10-20' },
    { code: 'BT-2026-003', project: 'DA-SX-2026-003', title: 'Lỗi hàn thiếu thiếc chân chip Wi-Fi, lô 5', desc: 'AOI phát hiện 64 thiết bị thiếu thiếc chân chip MT7981 trong ca đêm 04/11.',
      found: '2026-11-05', foundTime: '02:15', place: 'NPH-02', qty: 64, unit: 'DVT-03', spMa: 'WM-6', serial: 'WM6-000123', sample: 500, stage: 'CD-02', op: 'SMT-12', shift: 'CA-3',
      req: 'Mối hàn chân chip đạt IPC-A-610 Class 2', causes: ['NN1', 'NN2'], guess: 'Lượng kem hàn in thiếu ở ca đêm, cần kiểm tra stencil và máy in.',
      actions: [{ hd: 'Dừng lô 5, kiểm tra stencil và máy in kem hàn', who: 'sxnm', han: '2026-11-05' }, { hd: 'Kiểm tra lại 100% thiết bị lô 5 bằng AOI', who: 'sxnm', han: '2026-11-06' }],
      inspect: ['sxqa'], partner: ['sxnm'], media: 'anh_AOI_lo5.png', creator: 'sxnm', type: 'L3', sev: 4, received: '2026-11-05' },
    { code: 'BT-2026-004', project: 'DA-SX-2026-001', title: 'Module khuếch đại công suất về thiếu chứng từ xuất xứ (CO)', desc: '28 module PA của lô hàng thứ 2 không kèm CO; IQC tạm dừng cấp phát.',
      found: '2026-11-16', foundTime: '10:05', place: 'NPH-01', qty: 28, unit: 'DVT-04', spMa: 'VT-25', serial: 'VT25-0007', sample: 40, stage: 'CD-01', op: 'IQC-01', shift: 'CA-HC',
      req: 'Mỗi lô linh kiện phải kèm CO, CQ theo hồ sơ IQC', causes: ['NN5'],
      actions: [{ hd: 'Tạm dừng cấp phát 28 module PA', who: 'sxqa', han: '2026-11-17' }, { hd: 'Yêu cầu nhà cung cấp bổ sung CO, CQ lô 2', who: 'sxpm', han: '2026-11-20' }],
      inspect: ['sxqa'], partner: [], media: 'anh_thung_hang_lo2.jpg', creator: 'sxqa', type: 'L1', sev: 2,
      guess: 'Nhà cung cấp giao thiếu chứng từ lô 2; cần xác minh với nhà cung cấp trước khi cấp phát.', files: { bm: 'BM.QLBT.01_BT-2026-004.pdf', iqc: 'IQC_lo2_module_PA.pdf' } },
  ];

  /* ---------- T71 S7 — Thay đổi kỹ thuật (SX-09) ---------- */
  D.sxChanges = [
    { code: 'ECR-2026-001', project: 'DA-SX-2026-001', title: 'Đổi module khuếch đại công suất RF sang phiên bản RoHS', reason: 'Nhà sản xuất ngừng bản rev A (EOL), bản rev B đạt RoHS.', issue: null,
      creator: 'sxpm', created: '2026-06-22', level: 'C3', eco: 'ECO-2026-001', ecoDate: '2026-07-08', ecn: 'ECN-2026-001', ecnDate: '2026-07-30', closed: '2026-08-05' },
    /* T71 S12 (D-124, P-257): ECR nhận từ hệ thống KHCN (đề tài nghiên cứu cải tiến sản phẩm đang sản xuất) qua API tích hợp — src KHCN, khcn = mã yêu cầu bên KHCN; ECN ban hành thì đồng bộ ngược. */
    { code: 'ECR-2026-002', project: 'DA-SX-2026-002', title: 'Cải tiến thuật toán ổn định ảnh hồng ngoại khi rung (firmware xử lý ảnh)', reason: 'Đề tài KHCN cải tiến QĐ-12 hoàn thành thử nghiệm: ảnh rung khi gá xoay ở tốc độ cao; đề nghị áp dụng firmware mới cho lô sản xuất.', issue: null,
      src: 'KHCN', khcn: 'YCTĐ-KHCN-2026-014', creator: 'sxrd', created: '2026-11-12' },
  ];
  /* Nhật ký quản lý dự án (Log QLDA, SXL.10): [ngày, loại ECO / ECN, mã, nội dung, phiên bản tài liệu, mã ECR]. */
  D.sxPmLog = { 'DA-SX-2026-001': [['2026-07-08', 'ECO', 'ECO-2026-001', 'Thay module PA rev A bằng rev B, cập nhật bản vẽ bo mạch chính rev 3.', '', 'ECR-2026-001'],
    ['2026-07-30', 'ECN', 'ECN-2026-001', 'Ban hành bản vẽ bo mạch chính rev 3, eBOM v2.1.3.', 'v2.1_HW_Rev3', 'ECR-2026-001']] };
  /* Người phê duyệt theo cấp (danh mục sx-cap-duyet) — GIẢ LẬP P-252: C1 = Giám đốc dự án, C2 = Giám đốc Trung tâm Nghiên cứu thiết kế, C3 = Ban Giám đốc Khối, C4 = Ban Tổng Giám đốc. */
  D.sxLevelWho = (level, p) => ({ C1: p && p.pm, C2: 'sxgdtt', C3: 'sxld', C4: 'sxtgd' }[level] || null);

  /* ---------- T71 S8 — Chất lượng & nghiệm thu (SX-12) ----------
     Tiền tố số sê-ri theo dự án (dải sê-ri của lô cấp liên tiếp — GIẢ LẬP P-253). */
  D.sxSerial = { 'DA-SX-2026-001': ['VT25-', 4], 'DA-SX-2026-002': ['QD12-', 4], 'DA-SX-2026-003': ['WM6-', 6], 'DA-SX-2026-004': ['GNB-', 5] };
  /* Đề nghị nghiệm thu mẫu: item = hạng mục bước 9; from / to = số thứ tự sê-ri; bb / cert / pnk = biên bản, chứng chỉ chất lượng, phiếu nhập kho (khớp phiếu nhập kho ở tab Mua sắm). */
  /* (b) Q9 — Kết quả kiểm soát chất lượng công đoạn IPQC (QT-TTSX-4A11 §5.4 bước 10; ĐV ĐBCL chủ trì, QC đơn vị sản xuất phối hợp). Không đạt → phiếu bất thường. */
  D.sxIpqcStages = ['Gia công bo mạch (SMT)', 'Gia công cơ khí', 'Đo kiểm module, bán thành phẩm', 'Lắp ráp, tích hợp', 'Đồng điều chỉnh', 'Đo kiểm sản phẩm hoàn chỉnh'];
  D.sxIpqc = [
    { code: 'IPQC-2026-001', project: 'DA-SX-2026-001', item: 'M3', stage: 'Lắp ráp, tích hợp', n: 12, ok: 12, kq: 'DAT', who: 'sxqa', at: '2026-10-05', note: '12 bộ tích hợp đầu tiên tại VMC đạt lưu trình đo kiểm.' },
    { code: 'IPQC-2026-002', project: 'DA-SX-2026-002', item: 'BTP1', stage: 'Đo kiểm module, bán thành phẩm', n: 4, ok: 1, kq: 'NOK', who: 'sxqa', at: '2026-10-19', note: '3 / 4 khối quang học lệch trục quang sau thử rung.', issue: 'BT-2026-002' },
    { code: 'IPQC-2026-003', project: 'DA-SX-2026-003', item: 'L4', stage: 'Gia công bo mạch (SMT)', n: 20000, ok: 19980, kq: 'DAT', who: 'sxqa', at: '2026-09-20', note: 'Tỷ lệ lỗi AOI 0,1%, trong ngưỡng.' },
    { code: 'IPQC-2026-004', project: 'DA-SX-2026-003', item: 'L5', stage: 'Gia công bo mạch (SMT)', n: 12500, ok: 12436, kq: 'NOK', who: 'sxqa', at: '2026-11-05', note: 'AOI phát hiện 64 thiết bị thiếu thiếc chân chip MT7981.', issue: 'BT-2026-003' },
  ];
  /* (b) Q10 — Thử nghiệm thực tế (QT bước 11, ĐV NCPT chủ trì): kịch bản, kế hoạch thử nghiệm được phê duyệt, kết quả. Chỉ dự án Có thử nghiệm thực tế. */
  D.sxTrial = { 'DA-SX-2026-001': { kb: 'Kich ban thu nghiem thuc te VT-25.pdf', kh: 'Ke hoach thu nghiem thuc te VT-25.pdf', duyet: '2026-10-20', place: 'Thao trường huấn luyện — đơn vị sử dụng', from: '2026-11-25', to: '2026-12-05', kq: null, who: 'sxrd' } };
  D.sxLots = [
    { code: 'NT-2026-001', project: 'DA-SX-2026-003', item: 'L1', qty: 20000, from: 1, to: 20000, creator: 'sxnm', created: '2026-06-16', oqc: 'DAT', bb: '41/BB-NT', cert: 'CQ-2026-0101', pnk: 'PNK-2026-0402', stocked: '2026-06-20' },
    { code: 'NT-2026-002', project: 'DA-SX-2026-003', item: 'L2', qty: 20000, from: 20001, to: 40000, creator: 'sxnm', created: '2026-07-21', oqc: 'DAT', bb: '52/BB-NT', cert: 'CQ-2026-0117', pnk: 'PNK-2026-0455', stocked: '2026-07-25' },
    { code: 'NT-2026-003', project: 'DA-SX-2026-003', item: 'L3', qty: 20000, from: 40001, to: 60000, creator: 'sxnm', created: '2026-08-25', oqc: 'DAT', bb: '63/BB-NT', cert: 'CQ-2026-0132', pnk: 'PNK-2026-0508', stocked: '2026-08-29' },
    { code: 'NT-2026-004', project: 'DA-SX-2026-003', item: 'L4', qty: 20000, from: 60001, to: 80000, creator: 'sxnm', created: '2026-09-29', oqc: 'DAT', bb: '74/BB-NT', cert: 'CQ-2026-0150', pnk: 'PNK-2026-0561', stocked: '2026-10-03' },
    { code: 'NT-2026-005', project: 'DA-SX-2026-001', item: 'M3', qty: 12, from: 1, to: 12, creator: 'sxpm', created: '2026-11-13' },
  ];
  /* Kết quả kiểm tra vật tư đầu vào IQC (đồng bộ VMMS, chỉ xem — GIẢ LẬP P-253): [lô vật tư, mã vật tư, số lượng, kết quả, ngày]. */
  /* T71 S13 (Q16) — mã vật tư tương đương có thể đổi chéo cho VTLK leadtime dài / Export License (QT-TTSX-4A11 §5.8: "dựa trên dữ liệu mua sắm các dự án").
     [mã, tên, ghi chú điều kiện đổi]. GIẢ LẬP P-267: thật = danh mục mã tương đương do ĐV NCPT xác nhận, nguồn dữ liệu mua sắm (ĐTMS) / VMMS. */
  D.sxAlt = {
    'FPGA-XC7K325': [['FPGA-XC7K410', 'FPGA Kintex-7 XC7K410T', 'Cùng chân, cần biên dịch lại bitstream']],
    'RF-PA-25W': [['RF-PA-25W-B', 'Module PA 25W nhà cung cấp B', 'Đã đo kiểm tương thích ở dự án VT-25 năm 2025']],
    'IR-DET-640': [['IR-DET-640-HD', 'Đầu thu hồng ngoại 640×512 bước điểm ảnh 12 µm', 'Cần hiệu chỉnh lại ống kính']],
    'FPGA-ZU9EG': [['FPGA-ZU7EV', 'FPGA Zynq UltraScale+ ZU7EV', 'Đủ tài nguyên cho bản firmware hiện tại']],
    'FPGA-ZU47DR': [['FPGA-ZU48DR', 'RFSoC Zynq ZU48DR', 'Cùng chân; khác số kênh ADC, cần cập nhật cấu hình']],
    'SOC-MT7981': [['SOC-MT7986', 'Chip Wi-Fi 6 MT7986', 'Đổi bo mạch, chỉ áp dụng từ phiên bản phần cứng mới']],
  };
  D.sxIqc = {
    'DA-SX-2026-001': [['IQC-2026-0712', 'FPGA-XC7K325', 34, 'Đạt', '2026-08-12'], ['IQC-2026-0713', 'RF-PA-25W', 52, 'Đạt', '2026-08-12'], ['IQC-2026-0901', 'RF-PA-25W', 28, 'Tạm dừng — thiếu CO', '2026-11-16']],
    'DA-SX-2026-003': [['IQC-2026-0455', 'SOC-MT7981', 105000, 'Đạt', '2026-05-20'], ['IQC-2026-0456', 'DDR4-512M', 98000, 'Đạt', '2026-05-20'], ['IQC-2026-0470', 'ADAPTER-12V', 120000, 'Đạt có điều kiện — 0,3% lỗi vỏ', '2026-05-28']],
  };

  /* ---------- T71 S9: Công việc (SX-16) — công việc (CN, Việc của tôi) và nhiệm vụ đơn vị (DV) ----------
     Dòng: mã, loại, tên, dự án, hạng mục kế hoạch (khoá bước của tab Kế hoạch & mốc), công việc cha, người thực hiện / đầu mối, người giao, bắt đầu, hạn,
     ưu tiên, nhắc trước (ngày), % (việc có việc con thì % tính từ việc con), ngày hoàn thành, nguồn (KH = từ kế hoạch, TAY = nhập tay, XLS = nhập Excel),
     nhật ký cập nhật tiến độ [thời gian, người, %, ghi chú]. Hư cấu.
     Góp ý 26/11 (hoaidt10): việc giao theo bước kế hoạch là CÔNG VIỆC (CN, Việc của tôi — công việc từ kế hoạch), không phải nhiệm vụ đơn vị; CV-SX-2026-006 phân rã 3 công việc con
     khớp Điều kiện 4M của DA-SX-2026-002 (thiếu Jig / Stencil). Nhiệm vụ đơn vị = nhiệm vụ sản xuất của đơn vị, theo dõi tiến độ dự án thuộc nhiệm vụ (NV-SX-2026-001…003, 008). */
  D.sxWork = [
    { code: 'NV-SX-2026-001', kind: 'DV', title: 'Nhiệm vụ sản xuất tổ hợp quan sát quang điện tử QĐ-12', project: 'DA-SX-2026-002', plan: null, parent: null, owner: 'sxpm', assigner: 'sxld',
      start: '2026-06-01', due: '2027-03-31', prio: 'CAO', remind: 3, pct: 0, src: 'TAY', created: '2026-05-20', desc: 'Nhiệm vụ sản xuất năm 2026 — Khối 1; tiến độ theo dự án DA-SX-2026-002.', log: [] },
    { code: 'NV-SX-2026-002', kind: 'DV', title: 'Nhiệm vụ sản xuất loạt đài thu phát vô tuyến chiến thuật VT-25 — đợt 1', project: 'DA-SX-2026-001', plan: null, parent: null, owner: 'sxpm', assigner: 'sxld',
      start: '2026-03-02', due: '2026-12-15', prio: 'CAO', remind: 3, pct: 0, src: 'TAY', created: '2026-02-20', desc: 'Nhiệm vụ sản xuất năm 2026 — Khối 1; tiến độ theo dự án DA-SX-2026-001.', log: [] },
    { code: 'NV-SX-2026-003', kind: 'DV', title: 'Nhiệm vụ sản xuất bộ phát Wi-Fi Mesh WM-6 cho thị trường Lào', project: 'DA-SX-2026-003', plan: null, parent: null, owner: 'sxk2', assigner: 'sxld',
      start: '2026-04-15', due: '2026-11-30', prio: 'TB', remind: 3, pct: 0, src: 'TAY', created: '2026-04-01', desc: 'Nhiệm vụ sản xuất năm 2026 — Khối 2; tiến độ theo dự án DA-SX-2026-003.', log: [] },
    { code: 'CV-SX-2026-006', kind: 'CN', title: 'Bảo đảm máy móc, công cụ dụng cụ, môi trường sản xuất', project: 'DA-SX-2026-002', plan: 'B7', parent: null, owner: 'sxpm', assigner: 'sxpm',
      start: '2026-06-15', due: '2026-11-20', prio: 'CAO', remind: 3, pct: 0, src: 'KH', created: '2026-06-12', desc: 'Giao khi kick-off dự án, theo bước 7 của kế hoạch gốc.', log: [] },
    { code: 'CV-SX-2026-001', kind: 'CN', title: 'Kiểm định phương tiện đo, máy đo quang học', project: 'DA-SX-2026-002', plan: null, parent: 'CV-SX-2026-006', owner: 'sxsub', assigner: 'sxpm',
      start: '2026-09-01', due: '2026-11-18', prio: 'CAO', remind: 2, pct: 50, src: 'TAY', created: '2026-08-28', desc: 'Kiểm định 6 phương tiện đo, máy đo trục quang trước khi tích hợp.',
      log: [['2026-10-05 16:20', 'sxsub', 20, 'Đã gửi 2 máy đi kiểm định'], ['2026-11-02 10:05', 'sxsub', 50, 'Hoàn thành 3/6 phương tiện']] },
    { code: 'CV-SX-2026-002', kind: 'CN', title: 'Chế tạo Jig, Stencil theo danh mục chuyển giao', project: 'DA-SX-2026-002', plan: null, parent: 'CV-SX-2026-006', owner: 'sxsub', assigner: 'sxpm',
      start: '2026-08-15', due: '2026-11-10', prio: 'CAO', remind: 2, pct: 40, src: 'TAY', created: '2026-08-12', desc: 'Jig đo khối quang học và Stencil bo mạch xử lý ảnh theo hồ sơ chuyển giao.',
      log: [['2026-09-20 09:40', 'sxsub', 40, 'Xong Stencil; Jig chờ bản vẽ gá đỡ rev B']] },
    { code: 'CV-SX-2026-003', kind: 'CN', title: 'Kiểm tra điều kiện ESD, nhiệt độ, độ ẩm khu tích hợp', project: 'DA-SX-2026-002', plan: null, parent: 'CV-SX-2026-006', owner: 'sxpm', assigner: 'sxpm',
      start: '2026-09-01', due: '2026-10-30', prio: 'TB', remind: 2, pct: 100, doneAt: '2026-10-28', src: 'TAY', created: '2026-08-28', desc: '',
      log: [['2026-10-28 15:00', 'sxpm', 100, 'Đạt, có biên bản kiểm tra']] },
    { code: 'CV-SX-2026-007', kind: 'CN', title: 'Bảo đảm nhân lực, đào tạo chuyển giao công nghệ', project: 'DA-SX-2026-002', plan: 'B6', parent: null, owner: 'sxpm', assigner: 'sxpm',
      start: '2026-06-15', due: '2026-09-30', prio: 'TB', remind: 3, pct: 100, doneAt: '2026-09-26', src: 'KH', created: '2026-06-12', desc: 'Giao khi kick-off dự án, theo bước 6 của kế hoạch gốc.',
      log: [['2026-09-26 11:00', 'sxpm', 100, 'Hoàn thành đào tạo 14 công nhân tích hợp, đo kiểm']] },
    { code: 'CV-SX-2026-008', kind: 'CN', title: 'Theo dõi VMC hoàn thành đo kiểm tại nhà máy', project: 'DA-SX-2026-001', plan: 'B12', parent: null, owner: 'sxpm', assigner: 'sxld',
      start: '2026-11-01', due: '2026-12-10', prio: 'TB', remind: 3, pct: 20, src: 'TAY', created: '2026-10-30', desc: 'Báo cáo tuần kết quả đo kiểm 40 bộ VT-25 tại VMC.',
      log: [['2026-11-09 17:00', 'sxpm', 20, 'VMC đo kiểm xong 8/40 bộ']] },
    { code: 'CV-SX-2026-009', kind: 'CN', title: 'Đối chiếu số sê-ri lô 6 trước nhập kho', project: 'DA-SX-2026-003', plan: 'B14', parent: null, owner: 'sxk2', assigner: 'sxk2',
      start: '2026-11-10', due: '2026-11-19', prio: 'CAO', remind: 3, pct: 30, src: 'TAY', created: '2026-11-09', desc: '', log: [['2026-11-13 09:30', 'sxk2', 30, 'Đã đối chiếu 6.000/20.000 sê-ri']] },
    { code: 'CV-SX-2026-004', kind: 'CN', title: 'Chuẩn bị báo cáo tiến độ tuần 47 gửi Ban Giám đốc Khối', project: 'DA-SX-2026-001', plan: 'B9', parent: null, owner: 'sxpm', assigner: 'sxpm',
      start: '2026-11-16', due: '2026-11-17', prio: 'TB', remind: 1, pct: 0, src: 'TAY', created: '2026-11-14', desc: '', log: [] },
    { code: 'CV-SX-2026-005', kind: 'CN', title: 'Rà soát bản vẽ gá đỡ cụm thấu kính rev B', project: 'DA-SX-2026-002', plan: 'B5', parent: null, owner: 'sxrd', assigner: 'sxpm',
      start: '2026-11-03', due: '2026-11-14', prio: 'CAO', remind: 2, pct: 70, src: 'TAY', created: '2026-11-02', desc: 'Đầu vào cho Jig đo khối quang học (CV-SX-2026-002).', log: [['2026-11-12 14:10', 'sxrd', 70, 'Chờ thử rung mẫu']] },
  ];
  /* Nhiệm vụ đơn vị giao trước khi có dự án (luồng Nhiệm vụ → PASXKD → Dự án, hoaidt10 23/11). */
  D.sxWork.push(
    { code: 'NV-SX-2026-005', kind: 'DV', title: 'Lập phương án sản xuất kinh doanh đài ra-đa RĐ-40 đợt 2', project: null, plan: null, parent: null, owner: 'sxpm', assigner: 'sxld',
      start: '2026-11-09', due: '2026-11-30', prio: 'CAO', remind: 3, pct: 40, src: 'TAY', created: '2026-11-09', desc: 'Nhiệm vụ sản xuất theo Kế hoạch SXKD 2027 — Khối 1: hoàn thiện đầu vào, lập PASXKD trình Ban Giám đốc Khối.', log: [['2026-11-13 16:00', 'sxpm', 40, 'Đã có cấu hình, lô; chờ báo giá vật tư chính']] },
    { code: 'NV-SX-2026-006', kind: 'DV', title: 'Lập phương án sản xuất kinh doanh thiết bị định tuyến biên ER-9', project: null, plan: null, parent: null, owner: 'sxk2', assigner: 'sxld',
      start: '2026-11-02', due: '2026-11-20', prio: 'TB', remind: 3, pct: 80, src: 'TAY', created: '2026-11-02', desc: 'Đơn hàng Viettel Campuchia; lập PASXKD làm căn cứ lập dự án.', log: [['2026-11-14 09:30', 'sxk2', 80, 'Đã trình phương án']] },
    { code: 'NV-SX-2026-007', kind: 'DV', title: 'Lập phương án sản xuất kinh doanh bộ phát Wi-Fi Mesh WM-6 thị trường Campuchia', project: null, plan: null, parent: null, owner: 'sxk2', assigner: 'sxld',
      start: '2026-11-05', due: '2026-11-15', prio: 'TB', remind: 3, pct: 100, doneAt: '2026-11-12', src: 'TAY', created: '2026-11-05', desc: '', log: [['2026-11-12 14:00', 'sxk2', 100, 'Phương án đã được phê duyệt']] },
    { code: 'NV-SX-2026-008', kind: 'DV', title: 'Lập phương án sản xuất kinh doanh trạm 5G Macro gNB-M3 năm 2027', project: 'DA-SX-2026-004', plan: null, parent: null, owner: 'sxk2', assigner: 'sxld',
      start: '2026-10-15', due: '2026-10-31', prio: 'TB', remind: 3, pct: 100, doneAt: '2026-10-28', src: 'TAY', created: '2026-10-15', desc: '', log: [['2026-10-28 16:30', 'sxk2', 100, 'Phương án đã được phê duyệt, lập dự án DA-SX-2026-004']] });
  D.sxPrio = { CAO: ['Cao', 'error'], TB: ['Trung bình', 'warning'], THAP: ['Thấp', 'default'] };
  D.sxWorkSrc = { KH: 'Từ kế hoạch', TAY: 'Nhập tay', XLS: 'Nhập Excel' };

  /* ---------- T71 S11: Bài học kinh nghiệm (SX-20) ----------
     Trạng thái DRAFT (nháp — người lập, PM, QA thấy) / PUB (đã ban hành — mọi người trong phân hệ thấy). Nguồn: phiếu bất thường đã đóng (tự tạo nháp) hoặc nhập tay. Hư cấu. */
  D.sxLessonKind = { TK: 'Thiết kế', CN: 'Công nghệ, quy trình', CL: 'Chất lượng, đo kiểm', CU: 'Cung ứng, nhà cung cấp', QL: 'Quản lý dự án' };
  D.sxLessons = [
    { code: 'BHKN-2026-001', title: 'Kiểm tra cấu hình suy hao trạm đo trước mỗi ca', project: 'DA-SX-2026-001', kind: 'CL', status: 'PUB', src: 'BT-2026-001', author: 'sxqa', created: '2026-09-15', pub: '2026-09-18', publisher: 'sxpm',
      context: '8 bộ VT-25 đo công suất phát thấp hơn chỉ tiêu 0,8 dB tại trạm đo cuối của VMC; đo lại bằng máy khác đạt.', cause: 'Cáp suy hao của trạm đo bị thay khi bảo trì nhưng cấu hình suy hao trong phần mềm đo chưa cập nhật.',
      lesson: 'Bổ sung bước kiểm tra cấu hình suy hao vào checklist đầu ca của trạm đo.', apply: 'Áp dụng cho mọi trạm đo công suất RF; đưa vào danh mục kiểm tra 4M của các dự án sau.' },
    { code: 'BHKN-2026-002', title: 'Đặt mua FPGA leadtime dài ngay sau khi có PAKD', project: 'DA-SX-2026-002', kind: 'CU', status: 'PUB', src: null, author: 'sxpm', created: '2026-10-05', pub: '2026-10-06', publisher: 'sxld',
      context: 'FPGA và đầu thu hồng ngoại có leadtime 36–40 tuần, về chậm làm dự án QĐ-12 chậm giai đoạn chuẩn bị sản xuất.', cause: 'Đề xuất mua sắm lập sau khi kế hoạch sản xuất được phê duyệt.',
      lesson: 'Vật tư leadtime từ 16 tuần đề xuất ở đợt 1 ngay khi có PAKD, không chờ phê duyệt kế hoạch.', apply: 'Dùng trạng thái Trễ hạn đặt hàng ở Nhu cầu vật tư để rà soát hằng tuần.' },
    { code: 'BHKN-2026-003', title: 'Gá đỡ cụm thấu kính cần thử rung ở mẫu thiết kế', project: 'DA-SX-2026-002', kind: 'TK', status: 'DRAFT', src: null, author: 'sxrd', created: '2026-11-12',
      context: '3/4 khối quang học lệch trục 0,3 mrad sau thử rung.', cause: 'Dung sai gá đỡ ±0,05 mm chưa được kiểm chứng bằng thử rung ở giai đoạn thiết kế.',
      lesson: 'Đưa thử rung cụm quang vào hồ sơ thiết kế trước khi chuyển giao.', apply: '' },
  ];

  /* ---------- Điểm ❓ của phân hệ (P-237…, D-121 Q10) ---------- */
  Object.assign(D.openPoints, {
    'P-270': { q: 'Kế hoạch dự án sản xuất (comment #97): cách đánh số mục 2.1 / 3.1 / 3.2.1 / 3.2.2 của người review; % mục Đề xuất mua sắm, Tiến độ cung ứng của bước 4 lấy từ đâu; thêm hạng mục kế hoạch sau khi kế hoạch gốc đã duyệt thì duyệt qua luồng nào, ai duyệt', src: 'Kho comment prototype #97 (hoaidt10, 17/11); QT-TTSX-4A11 §5.4 bước 4, 9', def: 'GIẢ LẬP — hiểu số mục theo cây Kế hoạch & mốc (giai đoạn.hạng mục); Đề xuất mua sắm = % dòng nhu cầu VHT mua đã gửi ĐTMS, Tiến độ cung ứng = % số lượng đã tập kết (Nhu cầu vật tư SX-17); Thêm kế hoạch gom thành lần bổ sung, PM trình, Lãnh đạo Khối phê duyệt / trả lại ngay trên danh sách', scr: 'SX-04' },
    'P-271': { q: 'Hồ sơ chuyển giao "đồng bộ từ mục QL hồ sơ của KHCN" (comment #97): API nào, đồng bộ lúc nào, phiên bản tài liệu lấy theo trường nào; COP1 có đúng là đơn vị nghiên cứu', src: 'Kho comment prototype #97; CDS-BT-03COP', def: 'GIẢ LẬP — tệp có sẵn của gói coi là đồng bộ từ Quản lý hồ sơ KHCN (v1.0), tệp tải lên ở QLSX ghi nguồn tải lên (v1.1); COP1 = đơn vị nghiên cứu', scr: 'SX-04, SX-06' },
    'P-269': { q: 'Độ trễ của việc / nhiệm vụ (comment #94 / #96): tính theo giờ đồng hồ hay giờ làm việc; mốc tính là cuối ngày hạn hay giờ cụ thể; làm tròn ngày thế nào', src: 'Kho comment prototype #94, #96 (hoaidt10, 17/11)', def: 'GIẢ LẬP — giờ đồng hồ, mốc = cuối ngày Hạn xử lý; dưới 24 giờ ghi số giờ (làm tròn lên), từ 24 giờ làm tròn số ngày; Nhiệm vụ đơn vị chỉ ghi số ngày', scr: 'SX-15, SX-16' },
    'P-268': { q: 'Dashboard "tự gợi ý" (comment #95): gợi ý theo quy tắc cố định hay do AI sinh; danh sách quy tắc, thứ tự ưu tiên, số gợi ý tối đa; người dùng có ẩn gợi ý không', src: 'Kho comment prototype #95 (hoaidt10, 17/11)', def: 'GIẢ LẬP — khối Gợi ý cho bạn trên Dashboard, tối đa 5 gợi ý theo quy tắc cố định, xếp theo mức khẩn: việc quá hạn / chưa xử lý của người đăng nhập, phiếu bất thường quá hạn hoặc sắp đến hạn, dự án chậm từ 15 điểm so với kế hoạch, vật tư trễ hạn đặt hàng, lô chờ nghiệm thu; thật: một dòng cấu hình quy tắc (cùng hướng D-117 AI gợi ý hồ sơ KĐT, có thể thay bằng AI)', scr: 'SX-01' },
    'P-267': { q: 'Báo cáo, KPI của phân hệ: mẫu báo cáo tiến độ định kỳ / đột xuất (kỳ, người nhận, gửi tự động); KPI bất thường đúng hạn ≥ 80% và thay đổi kỹ thuật đúng hạn ≥ 90% tính thế nào, hạn thay đổi kỹ thuật theo cấp; ngưỡng "dự án mới mở", "sắp đến hạn"; danh mục mã vật tư tương đương do ai xác nhận', src: 'SX-ULNL (Báo cáo thống kê, Dashboard điều hành dự án, Báo cáo tiến độ đột xuất / định kỳ); QT-TTSX-4A11 §5.4 bước 9, §5.7, §5.8', def: 'GIẢ LẬP — KPI tiến độ = thực hiện / kế hoạch đến ngày, trung bình dự án đang thực hiện; bất thường đúng hạn = đóng trong SLA / (đã đóng + đang quá hạn); thay đổi kỹ thuật hạn C1 10 / C2 20 / C3 40 / C4 60 ngày làm việc; mới mở = tạo trong 30 ngày; sắp đến hạn = dưới 3 ngày làm việc; kỳ báo cáo Đột xuất / tuần / tháng / quý xem và xuất trên màn, chưa gửi tự động; mã tương đương là dữ liệu mẫu', scr: 'SX-01, SX-14' },
    'P-263': { q: 'Có trường hợp lập dự án, kế hoạch sản xuất khi R&D chưa chuyển giao xong (biên bản thành phần đủ điều kiện sản xuất chưa ký) không', src: 'QT-TTSX-4A11 §5.2 đầu vào mục 27, §5.4 bước 1 cột (f)', def: 'GIẢ LẬP — theo QT: Thêm mới dự án chỉ chọn sản phẩm đã có trong Kho sản phẩm sẵn sàng sản xuất; tiêu chí 4M MD1 giữ làm kiểm tra lại', scr: 'SX-03' },
    'P-264': { q: 'Phương án kinh doanh đã phê duyệt và kế hoạch sản xuất kinh doanh năm nằm ở hệ thống nào; dữ liệu nào lấy sang dự án (sản phẩm, số lượng, khách hàng, thời hạn); một PAKD có lập nhiều dự án không', src: 'QT-TTSX-4A11 §5.1, §5.2 mục 1, §5.4 bước 1', def: 'GIẢ LẬP — danh sách PAKD đã duyệt (6 bản ghi); chọn PAKD tự điền sản phẩm, số lượng, khách hàng, ngày kết thúc, kế hoạch SXKD năm; một PAKD một dự án; căn cứ Nhiệm vụ / Hợp đồng nhập số văn bản và đính kèm tệp', scr: 'SX-03' },
    'P-265': { q: '"Có sản xuất đợt tiếp theo" sau bước 15: lặp lại từ bước nào; trong cùng dự án hay lập dự án mới', src: 'QT-TTSX-4A11-LD (lưu đồ)', def: 'GIẢ LẬP — lập dự án mới có liên kết Dự án đợt trước; dự án Hoàn thành có nút Lập dự án đợt tiếp theo (chép thông tin, chọn căn cứ mới)', scr: 'SX-03, SX-04' },
    'P-266': { q: 'Bước 1 báo cáo phương án: TT Mua sắm, ĐV NCPT, ĐV ĐBCL (S — hỗ trợ) góp ý trên hệ thống trước khi trình hay chỉ phối hợp ngoài hệ thống', src: 'QT-TTSX-4A11 §5.4 bước 1, §5.5', def: 'GIẢ LẬP — PM ghi Đơn vị đã phối hợp trên form; không mở việc góp ý cho các đơn vị', scr: 'SX-05' },
    'P-237': { q: 'Phân hệ Quản lý sản xuất chưa có trong danh sách phân hệ của nền tảng (core-fe subsystem.constants.ts có 6 phân hệ); tên, mô tả, icon, mã phân hệ', src: 'core-fe subsystem-list; CDS-DH-1210 §4.2', def: 'GIẢ LẬP — thêm thẻ "Quản lý sản xuất", mã QLSX, icon hàng hoá; thật: thêm một dòng SUBSYSTEMS + app con', scr: 'SCR-101' },
    'P-238': { q: 'Chưa có BPMN cho sản xuất: các luồng Phê duyệt kế hoạch, Chuyển giao, Bất thường, Thay đổi kỹ thuật, Nghiệm thu dựng nháp từ báo cáo khảo sát; QT.VHT.TTSX.4A.1.2, 4A.1.3 chưa có bản gốc; 4A.1.1 đã có (QT-TTSX-4A11, nhận 16/11) nhưng chưa có BPMN', src: 'QT-TTSX-4A11 §5.4; SX-KS-K1 §3, SX-KS-K2 §4; INDEX C17', def: 'GIẢ LẬP — luồng nháp SX-KH / SX-BG / SX-BGNM / SX-BT / SX-TD / SX-NT / SX-MS; SX-KH, bàn giao nhà máy, nghiệm thu chỉnh theo QT-TTSX-4A11 (plan T71 §10); chờ BA vẽ bản chuẩn', scr: 'SX-05, 06, 08, 09, 12' },
    'P-239': { q: 'Danh mục 20 hồ sơ chuyển giao Khối 2: báo cáo chỉ nêu 8 tên; 12 tên còn lại và cách chia nhóm', src: 'SX-KS-K2 §2.1, §4.1', def: 'GIẢ LẬP — 8 tên theo báo cáo + 12 tên theo bộ hồ sơ Khối 1 (SX-KS-K1 Bảng 10); nhóm theo cách chia 4 nhóm của Khối 1', scr: 'SX-13' },
    'P-240': { q: 'SLA bất thường Loại 3 "theo quy trình nhà máy": số ngày lấy từ đâu; ngày làm việc tính theo lịch nào', src: 'SX-KS-K1 §3.2.2 Bảng 7', def: 'GIẢ LẬP — Loại 3 không có số ngày trong danh mục, hạn = ngày nhà máy cam kết nhập trên phiếu; ngày làm việc theo lịch làm việc chung (trừ thứ 7, chủ nhật, ngày lễ)', scr: 'SX-13, SX-08' },
    'P-241': { q: 'Tài khoản nhà máy / đối tác gia công: cổng riêng hay dùng chung hệ thống với quyền hạn chế; dữ liệu Khối 1 (mật) có cho đối tác truy cập ngoài mạng nội bộ không', src: 'SX-KS-K1 §2.6, §6.3; SX-KS-K2 §5.1', def: 'GIẢ LẬP — vai Nhà máy đăng nhập chung hệ thống, chỉ thấy dự án được giao (phân quyền theo dữ liệu); không dựng cổng riêng (D-121 Q7)', scr: 'SX-13, SX-04' },
    'P-242': { q: 'Mã dự án sản xuất: tự sinh hay nhập theo mã nhiệm vụ / mã hợp đồng đầu ra', src: 'SX-KS-K2 §2.2 (dự án theo đơn hàng / thị trường)', def: 'GIẢ LẬP — hệ thống tự sinh DA-SX-<năm>-<số thứ tự>', scr: 'SX-03' },
    'P-246': { q: 'Tiêu chí điều kiện 4M (BM.QLHDSX.02 chưa có trong bộ tài liệu); ai xác nhận từng tiêu chí; dự án chỉ chuyển Đang sản xuất khi đạt đủ hay cho phép ngoại lệ', src: 'SX-KS-K1 §1.3, §2.3, §3.1 bước 4–7; INDEX C17', def: 'GIẢ LẬP — 9 tiêu chí theo 4 nhóm M, Giám đốc dự án xác nhận; tiêu chí gói chuyển giao hệ thống tự xác định; thiếu tiêu chí nào thì không chuyển Đang sản xuất được', scr: 'SX-04' },
    'P-247': { q: 'Thẩm định gói chuyển giao: Quản lý sản xuất và Đảm bảo chất lượng thẩm định song song hay tuần tự; một bên yêu cầu bổ sung thì bên kia dừng hay tiếp tục; Khối 1 có lập biên bản thống nhất như Khối 2 không', src: 'SX-KS-K2 §4.1; SX-KS-K1 §4 Bảng 10 (hồ sơ 27)', def: 'GIẢ LẬP — song song; một bên yêu cầu bổ sung thì huỷ bên còn lại, gói về R&D; cả hai khối lập biên bản ở bước 4', scr: 'SX-06' },
    'P-248': { q: 'Nguồn MBOM dự toán (VMMS) và tồn kho khả dụng (ERP Kho TCT): API nào, ai cung cấp, đơn giá dự toán lấy từ đâu; chia đợt mua sắm theo tiêu chí nào', src: 'SX-KS-K1 §2.5; SX-KS-K2 §2.3, §6 (API-01…04); SX-VMMS-1111', def: 'GIẢ LẬP — MBOM theo sản phẩm, tồn kho tra cứu tức thì theo mã vật tư; đề xuất mua = nhu cầu − tồn; đợt 1 gợi ý vật tư leadtime từ 16 tuần', scr: 'SX-10' },
    'P-249': { q: 'Đề xuất mua sắm gửi sang ĐTMS: ĐXMS tạo ở trạng thái nào, ai là người lập bên ĐTMS, Đề tài / dự án ghi gì; dữ liệu nào ĐTMS trả về (API-02/03/04) và khi nào', src: 'SX-KS-K2 §2.3, §6; INDEX C18', def: 'GIẢ LẬP — tạo ĐXMS Chưa khởi tạo, nguồn Phân hệ Sản xuất, Đơn vị đề xuất = Trung tâm Sản xuất; trạng thái ĐXMS / KHLCNT / gói thầu / hợp đồng đọc từ ĐTMS, nhập kho GIẢ LẬP', scr: 'SX-10' },
    'P-250': { q: 'Sản lượng: cập nhật tay hay lấy tự động từ trạm đo VMMS; trạm nào là trạm cuối của từng bán thành phẩm / lô; tần suất; ngưỡng "nguy cơ chậm"; nhà máy đối tác nhập qua cổng nào (mobile)', src: 'SX-KS-K2 §2.2 (Mobile, Web ngoài mạng), SX-KS-K1 §2.3; SX-VMMS-1111', def: 'GIẢ LẬP — nhập tay hoặc lấy số đạt từ trạm đo (chênh với lũy kế đã nhập); mốc VMC nhập % hoàn thành; nguy cơ chậm khi thực hiện thấp hơn kế hoạch đến hôm nay từ 15 điểm %; nhà máy dùng cùng màn ở khổ điện thoại', scr: 'SX-11' },
    'P-251': { q: 'Ai được lập phiếu bất thường (QA, nhà máy, Sub PM…); hạn xử lý tính từ lúc nào (lập phiếu / tiếp nhận) và lịch ngày làm việc nào; quá hạn thì nhắc ai, có chế tài không', src: 'SX-KS-K1 §3.2 Bảng 6, Bảng 7; SX-KS-K2 §2.2 (Incident Report)', def: 'GIẢ LẬP — QA, PM, Sub PM, Nhà máy lập phiếu; hạn = ngày tiếp nhận (bước 2) + số ngày làm việc của danh mục (bỏ thứ Bảy, Chủ nhật, chưa tính ngày lễ); quá hạn tô đỏ ở danh sách và tab dự án', scr: 'SX-08' },
    'P-252': { q: 'Thay đổi kỹ thuật: ai lập ECR (PM, R&D, QA); người phê duyệt từng cấp C1–C4 cụ thể là ai ở mỗi khối; mã ECO / ECN đánh theo quy tắc nào; ECN có làm đổi phiên bản sản phẩm trong Kho sản phẩm sẵn sàng sản xuất không', src: 'SX-KS-K1 §3.3, Bảng 8; BM.VHT.TTSX.01-SXL.07…10 (chưa có, INDEX C17)', def: 'GIẢ LẬP — PM, R&D lập ECR (từ phiếu bất thường Loại 2 hoặc trực tiếp); C1 PM dự án, C2 Giám đốc TT Nghiên cứu thiết kế, C3 Ban Giám đốc Khối, C4 Ban Tổng Giám đốc; mã ECO- / ECN-<năm>-<số>; ECN cập nhật phiên bản của dự án, chưa đổi Kho', scr: 'SX-09' },
    'P-253': { q: 'Nghiệm thu: cỡ lô, cách lấy mẫu OQC (AQL), dải số sê-ri cấp ở đâu (VMMS / nhà máy); chứng chỉ chất lượng do ai ký; phiếu nhập kho TCT trả về qua API-04 hay nhập tay; kết quả IQC lấy từ VMMS', src: 'SX-KS-K1 §3.1 bước 12–14; SX-KS-K2 §4.3, §6 (API-04); SX-VMMS-1111', def: 'GIẢ LẬP — đề nghị nghiệm thu không vượt số đã sản xuất chưa nghiệm thu; sê-ri liên tiếp theo tiền tố dự án; OQC không đạt tự lập phiếu bất thường; Lãnh đạo duyệt thì cấp chứng chỉ CQ-; hệ thống tự nhận phiếu nhập kho PNK-; IQC chỉ xem', scr: 'SX-12' },
    'P-244': { q: 'Người xử lý từng bước luồng sản xuất: chỉ định theo dự án hay theo vai; ai xem xét, phê duyệt kế hoạch sản xuất Khối 2', src: 'SX-KS-K1 §3.1 (Ban Giám đốc Khối 1 phê duyệt); SX-KS-K2 §4.3', def: 'GIẢ LẬP — Giám đốc dự án của dự án lập, Ban Giám đốc Khối 1 xem xét và phê duyệt cho cả hai khối', scr: 'SX-05' },
    'P-245': { q: 'Kế hoạch sản xuất (BM.QLHDSX.01) nhập trên form hay tải file; 6 phụ lục bắt buộc những phụ lục nào; kế hoạch chi tiết (Phụ lục VI) có thay khung 15 bước của tab Kế hoạch & mốc không', src: 'BM-QLHDSX-01; SX-KS-K1 §3.1 bước 2', def: 'GIẢ LẬP — phần chính nhập trên form, phụ lục tải file (Phụ lục I và VI bắt buộc); kế hoạch gốc = khung 15 bước theo ngày dự án, các mốc chính của kế hoạch ghi kèm', scr: 'SX-05' },
    'P-243': { q: 'Phạm vi phân hệ năm 2026: sản xuất toàn trình 6 công đoạn hay ưu tiên phương án kinh doanh (C18)', src: 'SX-KS-3NGAY §IV.2; SX-GA-K2; INDEX C18', def: 'GIẢ LẬP — prototype dựng khung đủ 6 công đoạn, công đoạn thanh quyết toán mức nhẹ (D-121 Q2), để khách chọn phạm vi trên prototype', scr: 'SX-01' },
    'P-254': { q: 'Quản lý công việc (việc cá nhân, nhiệm vụ đơn vị) là chức năng riêng của phân hệ Sản xuất hay dùng chung phân hệ công việc khác; kick-off giao nhiệm vụ cho những bước nào; nhắc hạn trước mấy ngày, qua kênh nào', src: 'SX-ULNL sheet NL Chuc nang (Quản lý công việc); SX-KS-K1 §3.1 bước 3', def: 'GIẢ LẬP — chức năng trong phân hệ: kick-off tự giao nhiệm vụ đơn vị cho bước 4–8; công việc con nhiều cấp, % việc cha tính trung bình việc con; % hạng mục kế hoạch (trừ bước 9) lấy từ công việc gắn hạng mục; nhắc trước hạn theo số ngày của từng việc (mặc định 2), hiện ở chuông và Việc của tôi', scr: 'SX-16' },
    'P-255': { q: 'Đề xuất mua sắm từ sản xuất có phải duyệt nội bộ trước khi gửi sang ĐTMS không; ai duyệt (Lãnh đạo Khối, Giám đốc Trung tâm Sản xuất), có phân cấp theo giá trị không', src: 'SX-ULNL sheet NL Chuc nang (Lập đề xuất mua sắm: Gửi phê duyệt, Duyệt / Từ chối, Đồng bộ kết quả Duyệt / Từ chối); SX-KS-K2 §2.1', def: 'GIẢ LẬP — một cấp: Lãnh đạo Khối Duyệt / Từ chối (bắt buộc ý kiến); Duyệt thì hệ thống gửi sang ĐTMS tạo ĐXMS; Từ chối trả về người lập sửa, gửi lại thành hồ sơ mới', scr: 'SX-10' },
    'P-260': { q: 'Nhu cầu vật tư: ngày cần lấy từ đâu (kế hoạch bước 9, MBOM, nhập tay); tồn kho dùng chung toàn Tổng công ty hay theo kho dự án; hạn đặt hàng = ngày cần − leadtime có đúng không', src: 'SX-ULNL (Nhu cầu vật tư, Tích hợp với module Kho); SX-KS-K2 §2.1 (tồn kho real-time)', def: 'GIẢ LẬP — nhu cầu = định mức MBOM × số lượng dự án; ngày cần = ngày bắt đầu giai đoạn Tổ chức sản xuất của kế hoạch; tồn khả dụng ERP Kho TCT dùng chung; hạn đặt hàng = ngày cần − leadtime (tuần × 7)', scr: 'SX-17' },
    'P-261': { q: 'Hồ sơ dự án, biểu mẫu, bài học kinh nghiệm: kho tài liệu dùng chung với hệ thống văn bản nào; danh sách biểu mẫu chính thức (BM.QLHDSX.02, .03, BM.QLBT.*, SXL.07…10 chưa có bản gốc); ai ban hành bài học, phạm vi chia sẻ', src: 'SX-ULNL (Bước 15: Hồ sơ dự án, Biểu mẫu tài liệu, Bài học kinh nghiệm); INDEX C17', def: 'GIẢ LẬP — Hồ sơ dự án gom tài liệu các dự án theo nhóm; biểu mẫu là danh mục trong Danh mục dùng chung (mẫu chưa có tệp không chọn được); bài học: người lập lưu nháp, PM / QA ban hành, đã ban hành thì mọi người trong phân hệ thấy; đóng phiếu bất thường tự tạo bài học nháp', scr: 'SX-18' },
    'P-256': { q: 'EBOM / MBOM, thiết bị, nhân công, lệnh sản xuất: QLSX chỉ xem dữ liệu đồng bộ từ VMMS hay dựng chức năng quản lý (SX-ULNL tính công Cấu trúc / thay đổi EBOM, MBOM, Quản lý thiết bị, nhân công, sản xuất); API VMMS nào, tần suất đồng bộ', src: 'SX-ULNL (Bước 5–6: EBOM, MBOM, Quản lý thiết bị, nhân công, sản xuất, Đồng bộ VMMS); D-121 Q5; SX-VMMS-1111', def: 'GIẢ LẬP — chỉ xem ở tab Dữ liệu VMMS của dự án (cấu trúc theo phiên bản + lịch sử ECN, thiết bị và nhân công của đơn vị sản xuất, lệnh sản xuất theo hạng mục bước 9); job đồng bộ 06:00 hằng ngày + nút Đồng bộ ngay; thay đổi EBOM chỉ qua ECR / ECN', scr: 'SX-04' },
    'P-257': { q: 'Thay đổi kỹ thuật tích hợp module KHCN: yêu cầu nào từ KHCN sang (đề tài cải tiến, kết quả nghiên cứu), dữ liệu gì, ai nhận; ECN có phải đồng bộ ngược về KHCN không', src: 'SX-ULNL (Thay đổi kỹ thuật — Tích hợp module KHCN); SX-KS-K1 §3.3', def: 'GIẢ LẬP — KHCN gửi yêu cầu thay đổi qua API (mã yêu cầu, dự án, lý do, nội dung); hệ thống tạo ECR nguồn "Hệ thống KHCN", ghi bước 1, giao R&D phân tích; bước 8 cấp ECN thì đồng bộ mã ECN, ngày, phiên bản về KHCN', scr: 'SX-09' },
    'P-258': { q: 'Ký số MySign: những tài liệu nào phải ký số (kế hoạch sản xuất, biên bản thống nhất, chứng chỉ chất lượng, biên bản nghiệm thu…), ai ký, ký đơn hay ký nhiều người; tích hợp MySign trực tiếp hay qua VOffice như ĐTMS; mẫu thông báo nào của phân hệ', src: 'SX-ULNL (Tích hợp ký số MySign; QL thông báo)', def: 'GIẢ LẬP — ký số MySign ở bước 4 Phê duyệt kế hoạch (Lãnh đạo Khối), bước 4 Lập biên bản thống nhất (Quản lý sản xuất), bước 4 Phê duyệt nghiệm thu (Lãnh đạo, chứng chỉ chất lượng); một người ký, xác nhận trên ứng dụng MySign; 8 mẫu thông báo SX_ trên màn Mẫu thông báo dùng chung', scr: 'SX-05, SX-06, SX-12, SX-21' },
    'P-262': { q: 'Xoá / Nhập / Xuất Excel: bản ghi nào được xoá (chỉ khi chưa khởi tạo quy trình?), xoá cứng hay xoá mềm; danh sách nào cần nhập Excel, mẫu file nhập', src: 'SX-ULNL (Xóa, Import, Export ở các chức năng)', def: 'GIẢ LẬP — xoá dự án / đề xuất mua sắm chỉ khi chưa khởi tạo quy trình nào và (dự án) chưa có bản ghi con; Xuất Excel mọi danh sách theo bộ lọc, đúng cột đang hiện; Nhập Excel dự án, nhu cầu vật tư, công việc theo file mẫu, kiểm lỗi từng dòng', scr: 'SX-02, SX-10, SX-17' },
  });
})();
