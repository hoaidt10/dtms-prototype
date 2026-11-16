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
    { id: 'sxrd', name: 'Phạm Thu Hằng', short: 'Hằng', role: 'Kỹ sư thiết kế (R&D)', unit: 'Trung tâm Nghiên cứu thiết kế — Khối 1', urd: 'R-SX-RD', actor: '—', sx: true },
    { id: 'sxqa', name: 'Đoàn Văn Khải', short: 'Khải', role: 'Chuyên viên Đảm bảo chất lượng', unit: 'Trung tâm Đảm bảo chất lượng', urd: 'R-SX-QA', actor: '—', sx: true },
    { id: 'sxk2', name: 'Vũ Thị Hương', short: 'Hương', role: 'Chuyên viên Quản lý sản xuất', unit: 'Phòng Quản lý sản xuất — Khối 2', urd: 'R-SX-PM', actor: '—', sx: true },
    { id: 'sxnm', name: 'Hoàng Văn Lực', short: 'Lực', role: 'Cán bộ điều hành sản xuất (nhà máy)', unit: 'Nhà máy đối tác', urd: 'R-SX-NM', actor: '—', sx: true },
    { id: 'sxkd', name: 'Mai Anh Tuấn', short: 'Tuấn', role: 'Chuyên viên Kinh doanh', unit: 'Trung tâm Kinh doanh', urd: 'R-SX-KD', actor: '—', sx: true },
  );

  /* ---------- Sidebar phân hệ (màn SX-xx theo plan T71 §4; lát dựng ghi ở `slice`) ---------- */
  const soon = (slice, scr) => [`Màn ${scr} dựng ở lát ${slice} của plan T71 (docs/sx/T71-prototype-qlsx-ke-hoach.md §5).`];
  D.sxMenu = [
    { label: 'Việc của tôi', icon: 'view_list', path: 'sx/viec-cua-toi', scr: 'SX-15', badge: 'sx-tasks' },
    { label: 'Tổng quan', icon: 'tong_quan', path: 'sx/tong-quan', scr: 'SX-01', notes: soon('S9', 'SX-01') },
    { label: 'Dự án sản xuất', icon: 'view_list', path: 'sx/du-an', scr: 'SX-02', notes: soon('S1', 'SX-02…04') },
    { label: 'Chuyển giao từ nghiên cứu', icon: 'view_flow', open: true, children: [
      { label: 'Hồ sơ chuyển giao', path: 'sx/chuyen-giao', scr: 'SX-06', notes: soon('S3', 'SX-06') },
      { label: 'Sản phẩm sẵn sàng sản xuất', path: 'sx/san-pham', scr: 'SX-07', notes: soon('S3', 'SX-07') }] },
    { label: 'Đề xuất mua sắm', icon: 'phan_he_mua_sam', path: 'sx/mua-sam', scr: 'SX-10', notes: soon('S4', 'SX-10') },
    { label: 'Bất thường sản xuất', icon: 'menu_square', path: 'sx/bat-thuong', scr: 'SX-08', notes: soon('S6', 'SX-08') },
    { label: 'Thay đổi kỹ thuật', icon: 'phan_he_quy_trinh', path: 'sx/thay-doi', scr: 'SX-09', notes: soon('S7', 'SX-09') },
    { label: 'Nghiệm thu sản phẩm', icon: 'chuc_danh_khoa_hoc', path: 'sx/nghiem-thu', scr: 'SX-12', notes: soon('S8', 'SX-12') },
    { label: 'Báo cáo', icon: 'view_grid', children: [
      { label: 'Tiến độ dự án', path: 'sx/bao-cao/tien-do', scr: 'SX-14', notes: soon('S9', 'SX-14') },
      { label: 'Bất thường theo SLA', path: 'sx/bao-cao/bat-thuong', scr: 'SX-14', notes: soon('S9', 'SX-14') },
      { label: 'Vật tư leadtime dài', path: 'sx/bao-cao/vat-tu', scr: 'SX-14', notes: soon('S9', 'SX-14') }] },
  ];

  /* ---------- Danh mục SX-13 (nối vào phân hệ Danh mục dùng chung, nhóm "Quản lý sản xuất") ---------- */
  const code = (label, width) => ({ key: 'code', label, type: 'code', required: true, max: 50, width: width || 160 });
  const name = (label, minWidth) => ({ key: 'name', label, type: 'name', required: true, max: 255, minWidth: minWidth || 280 });
  const desc = () => ({ key: 'description', label: 'Mô tả', type: 'textarea', max: 500, minWidth: 200 });
  const UNIT = [{ value: 'QLSX', label: 'Đơn vị Quản lý sản xuất' }, { value: 'RD', label: 'Đơn vị Nghiên cứu phát triển' }, { value: 'NM', label: 'Nhà máy' }];
  const KHOI = [{ value: 'K1', label: 'Khối 1' }, { value: 'K2', label: 'Khối 2' }];
  const NHOM = [{ value: 'I', label: 'I. Hồ sơ pháp lý' }, { value: 'II', label: 'II. Sản phẩm và tài liệu kỹ thuật ngoại' },
    { value: 'III', label: 'III. Hồ sơ nghiên cứu, thiết kế' }, { value: 'IV', label: 'IV. Hồ sơ công nghệ và điều kiện sản xuất' }];
  const KIND = [{ value: 'NOI_BO', label: 'Nội bộ Tập đoàn' }, { value: 'DOI_TAC', label: 'Đối tác ngoài' }];
  const sla = (key, label) => ({ key, label, type: 'num', max: 3, placeholder: 'Ngày làm việc', width: 130 });

  /* Danh mục hồ sơ chuyển giao — Khối 1: 27 hồ sơ theo SX-KS-K1 §4 Bảng 10; Khối 2: 20 hồ sơ, SX-KS-K2 §2.1 nêu 8 tên, 12 tên còn lại GIẢ LẬP (P-239). */
  const K1 = { I: ['Tờ trình và phương án sản xuất kinh doanh đã được phê duyệt'],
    II: ['Sản phẩm mẫu, phụ kiện', 'Cấu hình sản phẩm', 'eBOM và vòng đời linh kiện', 'Danh mục linh kiện leadtime dài, Export License', 'Vật tư bảo hành',
      'Chỉ tiêu kỹ thuật ngoại', 'Bài đo, phương pháp đo', 'Kết quả đo', 'Kết quả thử nghiệm thực tế', 'Hướng dẫn sử dụng', 'Hướng dẫn sửa chữa, bảo dưỡng'],
    III: ['Thuyết minh kỹ thuật', 'Chỉ tiêu nội bộ', 'Chỉ tiêu và phương pháp đo module', 'Bài đo và bảng đánh giá chỉ tiêu nội', 'Hồ sơ sản xuất thử nghiệm',
      'Lưu trình đo kiểm module, bán thành phẩm', 'Hồ sơ thiết kế (bản vẽ hệ thống, sơ đồ nguyên lý, Gerber, bản vẽ cơ khí)', 'Thiết kế tem nhãn, bao bì'],
    IV: ['Quy trình công nghệ', 'Firmware và hướng dẫn nạp', 'Phần mềm và hướng dẫn cài đặt', 'Hồ sơ kiểm soát chất lượng', 'Danh mục Jig, Stencil và hướng dẫn',
      'Danh mục công cụ dụng cụ', 'Biên bản thống nhất thành phần đủ điều kiện sản xuất giữa QLSX và R&D'] };
  const K2 = { II: ['Bản vẽ thiết kế phần cứng', 'Sơ đồ nguyên lý', 'Gerber file', 'BOM vật tư', 'Firmware, phần mềm đính kèm', 'Tài liệu hướng dẫn lắp ráp',
    'Quy trình đo kiểm', 'Hộp test, sân test mô phỏng', 'Chỉ tiêu kỹ thuật', 'Kết quả thử nghiệm', 'Hướng dẫn sử dụng', 'Thiết kế cơ khí vỏ', 'Thiết kế tem nhãn, bao bì'],
  III: ['Báo cáo đánh giá chất lượng sản phẩm', 'Ghi chú phát hành phiên bản'],
  IV: ['Danh mục linh kiện leadtime dài', 'Hướng dẫn cài đặt phần mềm', 'Hồ sơ kiểm soát chất lượng', 'Danh mục Jig, Fixture', 'Hướng dẫn sửa chữa, bảo hành'] };
  D.sxK2Simulated = 12;
  const hsRows = (khoi, src) => {
    const out = []; let n = 0;
    /* buoc 4 = hồ sơ lập ở bước 4 luồng chuyển giao (biên bản thống nhất), không bắt buộc khi R&D gửi thẩm định. */
    Object.entries(src).forEach(([nhom, names]) => names.forEach((t) => { n += 1; out.push([`${khoi}-HS${String(n).padStart(2, '0')}`, t, '', true, 0, Object.assign({ khoi, nhom }, /^Biên bản thống nhất/.test(t) ? { buoc: 4 } : {})]); }));
    return out;
  };

  D.sxCatalogs = [
    { key: 'sx-bat-thuong', scr: 'SX-13', title: 'Loại bất thường và SLA', entity: 'loại bất thường', icon: 'menu_square', roles: ['sxpm', 'sxqa'], built: true, q: ['P-240'],
      use: 'Phân loại phiếu bất thường (QT.VHT.TTSX.4A.1.2) và thời hạn xử lý theo mức độ nghiêm trọng; hạn của phiếu = ngày tiếp nhận + số ngày làm việc. Căn cứ SX-KS-K1 §3.2 Bảng 6, Bảng 7.',
      fields: [code('Mã loại', 120), name('Tên loại bất thường', 240),
        { key: 'unit', label: 'Đơn vị xử lý', type: 'select', required: true, options: UNIT, width: 220 },
        sla('sla1', 'Rất nghiêm trọng'), sla('sla2', 'Nghiêm trọng'), sla('sla3', 'Trung bình'), sla('sla4', 'Ít nghiêm trọng'), desc()],
      seed: [
        ['L1', 'Loại 1 — Sai lệch quản lý sản xuất', 'Sai lệch cài đặt máy đo, cấu hình phần mềm công cụ, điều chuyển linh kiện tương đương đã được phê duyệt', true, 2, { unit: 'QLSX', sla1: 17, sla2: 14, sla3: 12, sla4: 10 }],
        ['L2', 'Loại 2 — Lỗi thiết kế', 'Lỗi thiết kế, sai quy trình công nghệ, dung sai cơ khí không phù hợp, linh kiện ngừng sản xuất cần thay đổi thiết kế; liên thông thay đổi kỹ thuật', true, 1, { unit: 'RD', sla1: 20, sla2: 17, sla3: 15, sla4: 13 }],
        ['L3', 'Loại 3 — Lỗi tại nhà máy', 'Lỗi thao tác, máy móc gia công, hàn dán SMT, phương tiện đo tại nhà máy; thời hạn theo quy trình của nhà máy', true, 1, { unit: 'NM' }],
      ] },
    { key: 'sx-ho-so-chuyen-giao', scr: 'SX-13', title: 'Danh mục hồ sơ chuyển giao', entity: 'hồ sơ chuyển giao', icon: 'view_list', roles: ['sxpm', 'sxrd', 'sxqa'], built: true, q: ['P-239'],
      use: 'Hồ sơ bắt buộc của gói chuyển giao từ nghiên cứu sang sản xuất; gói chỉ gửi thẩm định được khi đủ hồ sơ của khối. Khối 1: 27 hồ sơ (SX-KS-K1 §4 Bảng 10); Khối 2: 20 hồ sơ (SX-KS-K2 §2.1).',
      fields: [code('Mã hồ sơ', 120), name('Tên hồ sơ', 360),
        { key: 'khoi', label: 'Khối', type: 'select', required: true, options: KHOI, width: 110 },
        { key: 'nhom', label: 'Nhóm', type: 'select', required: true, options: NHOM, width: 280 }, desc()],
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
  ];

  /* ---------- Dự án sản xuất mẫu (hư cấu; S1 dựng màn danh sách / chi tiết) ---------- */
  D.sxProjects = [
    { code: 'DA-SX-2026-001', name: 'Sản xuất loạt đài thu phát vô tuyến chiến thuật VT-25 — đợt 1', khoi: 'K1', model: 'VMC_TONG_THAU', product: 'VT-25', version: 'v2.1_HW_Rev3',
      qty: 40, unitName: 'bộ', pm: 'sxpm', factory: 'VMC', start: '2026-03-02', end: '2026-12-15', status: 'IN_PRODUCTION' },
    { code: 'DA-SX-2026-002', name: 'Sản xuất tổ hợp quan sát quang điện tử QĐ-12', khoi: 'K1', model: 'VHT_TU_SX', product: 'QĐ-12', version: 'v1.0_HW_Rev2',
      qty: 12, unitName: 'bộ', pm: 'sxpm', factory: 'NM-HL', start: '2026-06-01', end: '2027-03-31', status: 'PREPARING' },
    { code: 'DA-SX-2026-003', name: 'Sản xuất bộ phát Wi-Fi Mesh WM-6 cho thị trường Lào', khoi: 'K2', model: 'GIA_CONG', product: 'WM-6', version: 'v3.0.1_HW_Rev2',
      qty: 120000, unitName: 'thiết bị', pm: 'sxk2', factory: 'NM-HP', start: '2026-04-15', end: '2026-11-30', status: 'IN_PRODUCTION' },
    { code: 'DA-SX-2026-004', name: 'Sản xuất trạm 5G Macro gNB-M3 năm 2026', khoi: 'K2', model: 'VMC_TONG_THAU', product: 'gNB-M3', version: 'v1.2',
      qty: 3000, unitName: 'trạm', pm: 'sxk2', factory: 'VMC', start: '2026-12-01', end: '2027-06-30', status: 'PLANNING' },
  ];
  /* T71 S1: thông tin bổ sung của dự án mẫu. perf = mức bám kế hoạch (sinh % hoàn thành theo ngày, xem sx-du-an.js planOf); cap = giai đoạn cuối đã bắt đầu
     (dự án chưa sản xuất thì giai đoạn sau 0%); baseline = ngày chốt kế hoạch gốc (luồng SX-KH bước 5, S2). Tài liệu / lịch sử hư cấu. */
  const EXTRA = {
    'DA-SX-2026-001': { basis: ['PAKD', 'PAKD số 214/PAKD-VHT ngày 12/01/2026'], customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', perf: 0.95, cap: 4, baseline: '2026-03-10',
      goal: 'Sản xuất, tích hợp, nghiệm thu 40 bộ đài thu phát VT-25 phiên bản v2.1 đạt chỉ tiêu kỹ thuật đã phê duyệt; bàn giao trước 15/12/2026.',
      creator: 'sxpm', created: '2026-02-20',
      docs: [['Kế hoạch sản xuất VT-25 đợt 1 (đã phê duyệt).pdf', 'KH', 'v1.2', 'sxpm', '2026-03-10'], ['Biên bản làm việc thống nhất phương án tổ chức sản xuất với VMC.pdf', 'BB', 'v1.0', 'sxpm', '2026-04-02'],
        ['PAKD 214-PAKD-VHT.pdf', 'PAKD', 'v1.0', 'sxpm', '2026-02-20']],
      hist: [['2026-02-20 09:12', 'sxpm', 'Tạo dự án', ''], ['2026-03-05 16:40', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.2'], ['2026-03-10 10:00', 'sxpm', 'Chốt kế hoạch gốc', 'Kick-off dự án'],
        ['2026-04-02 15:20', 'sxpm', 'Cập nhật tài liệu', 'Biên bản làm việc với VMC'], ['2026-09-18 08:30', 'sxpm', 'Cập nhật kế hoạch', 'Điều chỉnh mốc hoàn thành tích hợp do vật tư leadtime dài về chậm']] },
    'DA-SX-2026-002': { basis: ['NV', 'Nhiệm vụ sản xuất giao tại Quyết định số 1520/QĐ-VHT ngày 15/05/2026'], customer: 'Đơn vị sử dụng thuộc Bộ Quốc phòng', perf: 0.6, cap: 2, baseline: '2026-06-12',
      goal: 'Tự tổ chức sản xuất 12 tổ hợp QĐ-12: mua linh kiện, thuê gia công bo mạch và cơ khí, tích hợp, đo kiểm, thử nghiệm thực tế tại trận địa.',
      creator: 'sxpm', created: '2026-05-20',
      docs: [['Kế hoạch sản xuất QĐ-12 (đã phê duyệt).pdf', 'KH', 'v1.0', 'sxpm', '2026-06-12'], ['Quyết định giao nhiệm vụ 1520-QĐ-VHT.pdf', 'NV', 'v1.0', 'sxpm', '2026-05-20']],
      hist: [['2026-05-20 14:05', 'sxpm', 'Tạo dự án', ''], ['2026-06-10 11:30', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.0'], ['2026-06-12 09:00', 'sxpm', 'Chốt kế hoạch gốc', 'Kick-off dự án; giao Sub PM phụ trách bán thành phẩm']] },
    'DA-SX-2026-003': { basis: ['HD', 'Hợp đồng cung cấp thiết bị số 88/2026/HĐ-VTL ngày 20/03/2026'], customer: 'Viettel Lào (khách hàng thị trường)', perf: 1, cap: 4, baseline: '2026-04-20', lot: 20000,
      goal: 'Thuê gia công trọn gói 120.000 bộ phát WM-6, nghiệm thu theo lô 20.000 thiết bị, nhập kho Tổng công ty để giao khách hàng trước 30/11/2026.',
      creator: 'sxk2', created: '2026-04-01',
      docs: [['Kế hoạch sản xuất WM-6 Lào (đã phê duyệt).pdf', 'KH', 'v1.1', 'sxk2', '2026-04-20'], ['Hợp đồng 88-2026-HĐ-VTL.pdf', 'HD', 'v1.0', 'sxk2', '2026-04-01']],
      hist: [['2026-04-01 08:45', 'sxk2', 'Tạo dự án', ''], ['2026-04-17 17:10', 'sxld', 'Phê duyệt kế hoạch sản xuất', 'Kế hoạch v1.1'], ['2026-04-20 10:00', 'sxk2', 'Chốt kế hoạch gốc', 'Kick-off dự án']] },
    'DA-SX-2026-004': { basis: ['PAKD', 'PAKD số 352/PAKD-VHT ngày 28/10/2026'], customer: 'Tổng Công ty Viễn thông (khách hàng nội bộ Tập đoàn)', perf: 0, cap: 0, baseline: null,
      goal: 'Tổ chức sản xuất 3.000 trạm 5G Macro gNB-M3 qua VMC tổng thầu, triển khai theo kế hoạch năm 2027.',
      creator: 'sxk2', created: '2026-11-10', docs: [['PAKD 352-PAKD-VHT.pdf', 'PAKD', 'v1.0', 'sxk2', '2026-11-10']], hist: [['2026-11-10 10:20', 'sxk2', 'Tạo dự án', '']] },
  };
  D.sxProjects.forEach((p) => Object.assign(p, EXTRA[p.code]));
  D.sxStatus = { PLANNING: 'Lập kế hoạch', PREPARING: 'Chuẩn bị sản xuất', IN_PRODUCTION: 'Đang sản xuất', ACCEPTANCE: 'Nghiệm thu', DONE: 'Hoàn thành' };
  D.sxStatusV = { PLANNING: 'default', PREPARING: 'warning', IN_PRODUCTION: 'info', ACCEPTANCE: 'warning', DONE: 'success' };
  D.sxBasis = { PAKD: 'Phương án kinh doanh', NV: 'Nhiệm vụ được giao', HD: 'Hợp đồng với khách hàng' };
  D.sxDocKind = { KH: 'Kế hoạch sản xuất (BM.QLHDSX.01)', BB: 'Biên bản làm việc với nhà máy (BM.QLHDSX.04)', PAKD: 'Phương án kinh doanh', NV: 'Quyết định giao nhiệm vụ', HD: 'Hợp đồng với khách hàng', KHAC: 'Khác' };
  /* Ngày hiện tại của phân hệ (tính chậm mốc). GIẢ LẬP — thật: ngày hệ thống. */
  D.sxToday = '2026-11-16';
  /* Sản phẩm và phiên bản (S3 nối vào danh sách Sản phẩm sẵn sàng sản xuất; ready = đã qua cổng chuyển giao). */
  D.sxProducts = [
    { code: 'VT-25', name: 'Đài thu phát vô tuyến chiến thuật VT-25', version: 'v2.1_HW_Rev3', khoi: 'K1', ready: true, rel: '2026-01-28' },
    { code: 'QĐ-12', name: 'Tổ hợp quan sát quang điện tử QĐ-12', version: 'v1.0_HW_Rev2', khoi: 'K1', ready: false },
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
       form = khoá eForm (js/eforms/sx-kh.js). Hồ sơ: mã HSKH-<mã dự án>-<lần>; onStart / onEnd = bộ xử lý lúc khởi tạo / kết thúc. */
    'SX-KH': { name: 'Phê duyệt kế hoạch sản xuất', short: 'HSKH', obj: 'project', tab: 'kh', src: 'SX-KS-K1 §3.1 bước 1–3 (QT.VHT.TTSX.4A.1.1); BM-QLHDSX-01',
      onStart: 'kh.start', onEnd: 'kh.baseline', endText: 'Kết thúc — kế hoạch gốc đã chốt, dự án chuyển Chuẩn bị sản xuất', steps: [
      [1, 'Lập báo cáo phương án sản xuất', 'R-SX-PM', { next: 2, nlv: 3, label: 'Hoàn thành', form: 'pa' }],
      [2, 'Lập kế hoạch sản xuất dự án (BM.QLHDSX.01 và 6 phụ lục)', 'R-SX-PM', { next: 3, nlv: 5, label: 'Trình xem xét', form: 'kh', action: 'kh.submit' }],
      [3, 'Xem xét kế hoạch', 'R-SX-LD', { nlv: 2, form: 'yk', choices: [['Đồng ý', 4], ['Yêu cầu chỉnh sửa', 2, 'no']], action: 'kh.review' }],
      [4, 'Phê duyệt kế hoạch sản xuất', 'R-SX-LD', { nlv: 2, form: 'yk', choices: [['Phê duyệt', 5], ['Trả lại', 2, 'no']], action: 'kh.approve' }],
      [5, 'Kick-off, giao nhiệm vụ PM / Sub PM, chốt mốc kế hoạch gốc', 'R-SX-PM', { next: 'end', nlv: 3, label: 'Chốt kế hoạch gốc', form: 'ko' }]] },
    /* T71 S3: đối tượng cha = gói chuyển giao (sx-chuyen-giao.js). Bước 2 song song 3a ‖ 3b; bước 4 hợp nhánh (join). guard bg.full = thiếu hồ sơ thì không gửi được. */
    'SX-BG': { name: 'Chuyển giao từ nghiên cứu sang sản xuất', short: 'HSCG', obj: 'package', tab: 'hs', src: 'SX-KS-K2 §4.1; SX-KS-K1 §4 (cổng chuyển giao)',
      onStart: 'bg.start', endText: 'Kết thúc — sản phẩm vào Kho sản phẩm sẵn sàng sản xuất', steps: [
      [1, 'Tạo gói chuyển giao, tải hồ sơ theo danh mục của khối', 'R-SX-RD', { next: 2, nlv: 5, label: 'Gửi thẩm định', form: 'gui', guard: 'bg.full', action: 'bg.submit' }],
      [2, 'Kiểm tra đủ hồ sơ bắt buộc (thiếu thì không gửi được)', 'svc', { next: ['3a', '3b'], label: 'Hệ thống kiểm tra đủ hồ sơ bắt buộc' }],
      ['3a', 'Thẩm định hồ sơ (Quản lý sản xuất)', 'R-SX-PM', { nlv: 3, form: 'td', choices: [['Đạt', 4], ['Yêu cầu bổ sung', 1, 'no']], action: 'bg.assess' }],
      ['3b', 'Thẩm định hồ sơ (Đảm bảo chất lượng)', 'R-SX-QA', { nlv: 3, form: 'td', choices: [['Đạt', 4], ['Yêu cầu bổ sung', 1, 'no']], action: 'bg.assess' }],
      [4, 'Lập biên bản thống nhất thành phần đủ điều kiện sản xuất', 'R-SX-PM', { next: 5, nlv: 2, join: true, label: 'Hoàn thành', form: 'bb', action: 'bg.minutes' }],
      [5, 'Ghi vào danh sách sản phẩm sẵn sàng sản xuất, cấp mã phiên bản', 'svc', { next: 'end', label: 'Hệ thống ghi Kho sản phẩm sẵn sàng sản xuất', action: 'bg.release' }]] },
    'SX-BT': { name: 'Xử lý bất thường trong sản xuất', src: 'SX-KS-K1 §3.2 (QT.VHT.TTSX.4A.1.2), Bảng 6, Bảng 7', steps: [
      [1, 'Lập phiếu báo cáo bất thường (BM.QLBT.01)', 'R-SX-QA', { next: 2 }],
      [2, 'Tiếp nhận (trong 24 giờ làm việc), phân tích nguyên nhân, phân loại và mức độ', 'R-SX-PM', { next: 3 }],
      [3, 'Đề xuất phương án xử lý (BM.QLBT.02)', 'R-SX-PM', { next: 4 }],
      [4, 'Phê duyệt phương án', 'R-SX-LD', { choices: [['Phê duyệt', 5], ['Trả lại', 3]] }],
      [5, 'Triển khai theo loại: Loại 1 QLSX · Loại 2 R&D (có thể mở thay đổi kỹ thuật) · Loại 3 Nhà máy', 'theo loại', { next: 6 }],
      [6, 'Kiểm tra kết quả', 'R-SX-QA', { choices: [['Đạt (OK)', 7], ['Không đạt (NOK)', 3]] }],
      [7, 'Lưu hồ sơ và bài học kinh nghiệm', 'R-SX-PM', { next: 'end' }]] },
    'SX-TD': { name: 'Thay đổi kỹ thuật (ECR → ECO → ECN)', src: 'SX-KS-K1 §3.3 (QT.VHT.TTSX.4A.1.3), Bảng 8', steps: [
      [1, 'Lập yêu cầu thay đổi kỹ thuật ECR (BM.VHT.TTSX.01-SXL.07)', 'R-SX-PM', { next: 2 }],
      [2, 'Phân tích khả thi, ảnh hưởng tới cấu hình, eBOM, tiến độ, chi phí', 'R-SX-RD', { next: 3 }],
      [3, 'Lập lệnh thay đổi ECO (SXL.08)', 'R-SX-RD', { next: 4 }],
      [4, 'Phê duyệt ECO theo cấp (danh mục Cấp phê duyệt thay đổi kỹ thuật)', 'theo cấp', { choices: [['Phê duyệt', 5], ['Trả lại', 3]] }],
      [5, 'Ghi mã ECO vào nhật ký quản lý dự án (SXL.10)', 'svc', { next: 6 }],
      [6, 'Cập nhật bản vẽ, firmware, eBOM; lập thông báo thay đổi ECN (SXL.09)', 'R-SX-RD', { next: 7 }],
      [7, 'Đo kiểm mẫu, thẩm định ECN', 'R-SX-QA', { choices: [['Đạt', 8], ['Không đạt', 6]] }],
      [8, 'Ghi mã ECN, ngày ban hành, phiên bản tài liệu vào nhật ký quản lý dự án', 'svc', { next: 9 }],
      [9, 'Bàn giao nhà máy áp dụng, thu hồi tài liệu cũ', 'R-SX-PM', { next: 'end' }]] },
    'SX-NT': { name: 'Nghiệm thu sản phẩm', src: 'SX-KS-K1 §3.1 bước 12–14; SX-KS-K2 §4.3 bước 4–5 (nghiệm thu theo lô, API-04)', steps: [
      [1, 'Đề nghị nghiệm thu lô (số lượng, danh sách số sê-ri)', 'R-SX-NM', { next: 2 }],
      [2, 'Đánh giá chất lượng xuất xưởng (OQC)', 'R-SX-QA', { choices: [['Đạt', 3], ['Không đạt — lập phiếu bất thường', 'SX-BT']] }],
      [3, 'Lập biên bản nghiệm thu (cấp Tổng công ty hoặc theo lô)', 'R-SX-QA', { next: 4 }],
      [4, 'Phê duyệt nghiệm thu, phát hành chứng chỉ chất lượng', 'R-SX-LD', { choices: [['Phê duyệt', 5], ['Trả lại', 3]] }],
      [5, 'Đề nghị nhập kho Tổng công ty', 'R-SX-PM', { next: 6 }],
      [6, 'Nhận phiếu nhập kho đã duyệt (ĐTMS / ERP Kho), lưu hồ sơ theo số sê-ri', 'svc', { next: 'end' }]] },
  };

  /* Người xử lý theo vai của bước (GIẢ LẬP P-244: thật = cấu hình nhân sự theo bước / vai của quy trình, như Nhân sự thực hiện ĐXMS).
     Giám đốc dự án = PM của dự án; Lãnh đạo = Ban Giám đốc Khối 1 cho cả hai khối (chưa có vai lãnh đạo Khối 2). */
  D.sxAssign = (role, p) => ({ 'R-SX-PM': p && p.pm, 'R-SX-LD': 'sxld', 'R-SX-QA': 'sxqa', 'R-SX-RD': (p && p.rd) || 'sxrd', 'R-SX-NM': 'sxnm' }[role] || null);
  /* T71 S3 — gói chuyển giao mẫu: QĐ-12 (dùng cho DA-SX-2026-002) R&D đang lập, còn thiếu 3 hồ sơ (cảnh B). pm = cán bộ Quản lý sản xuất của khối thẩm định. */
  D.sxPackages = [{ code: 'GCG-QĐ-12-01', product: 'QĐ-12', version: 'v1.0_HW_Rev2', khoi: 'K1', rd: 'sxrd', pm: 'sxpm', created: '2026-10-20', missing: ['K1-HS19', 'K1-HS22', 'K1-HS25'] }];
  /* Điều kiện 4M (SX-KS-K1 §1.3, §3.1 bước 4–7; biểu mẫu BM.QLHDSX.02 chưa có — tiêu chí GIẢ LẬP P-246). Phần tử thứ 3 = tiêu chí hệ thống tự xác định. */
  D.sxM4 = [
    ['MAN', 'Nhân lực (Man)', [['MAN1', 'Bố trí nhân lực sản xuất, đo kiểm'], ['MAN2', 'Đào tạo chuyển giao công nghệ hoàn thành']]],
    ['MACHINE', 'Máy móc, thiết bị (Machine)', [['MC1', 'Máy móc, thiết bị, phương tiện đo sẵn sàng'], ['MC2', 'Jig, Stencil, công cụ dụng cụ theo danh mục chuyển giao'], ['MC3', 'Điều kiện môi trường sản xuất (ESD, nhiệt độ, độ ẩm)']]],
    ['MATERIAL', 'Vật tư, kinh phí (Material)', [['MT1', 'Kinh phí sản xuất được bảo đảm'], ['MT2', 'Vật tư, linh kiện đợt 1 về kho, đạt kiểm tra đầu vào (IQC)']]],
    ['METHOD', 'Tài liệu, phương pháp công nghệ (Method)', [['MD1', 'Phiên bản sản phẩm có trong Kho sản phẩm sẵn sàng sản xuất (gói chuyển giao đã duyệt)', 'release'], ['MD2', 'Quy trình công nghệ, lưu trình đo kiểm ban hành cho nhà máy']]],
  ];
  /* Kết quả 4M đã xác nhận của DA-SX-2026-002: còn thiếu Jig / Stencil và chưa có gói chuyển giao đã duyệt. */
  D.sxM4Seed = { 'DA-SX-2026-002': Object.fromEntries(['MAN1', 'MAN2', 'MC1', 'MC3', 'MT1', 'MT2', 'MD2'].map((k) => [k, { ok: true, note: '', who: 'sxpm', at: '2026-10-28 10:00' }])
    .concat([['MC2', { ok: false, note: 'Stencil khối nguồn đang gia công, dự kiến 25/11/2026', who: 'sxpm', at: '2026-10-28 10:00' }]])) };
  /* Hồ sơ mẫu: DA-SX-2026-004 đã trình kế hoạch, đang chờ Lãnh đạo xem xét (bước 3). Ba dự án còn lại đã phê duyệt trước khi có hệ thống (chỉ có Lịch sử). */
  D.sxCases = [
    { code: 'HSCG-GCG-QĐ-12-01-01', flow: 'SX-BG', obj: 'GCG-QĐ-12-01', status: 'running', started: '2026-10-20 08:30',
      tokens: [{ id: 's2', step: 1, who: 'sxrd', since: '2026-11-05 09:00' }], vars: {},
      hist: [{ step: null, who: 'sxrd', act: 'Khởi tạo hồ sơ', at: '2026-10-20 08:30' }] },
    { code: 'HSKH-DA-SX-2026-004-01', flow: 'SX-KH', obj: 'DA-SX-2026-004', status: 'running', started: '2026-11-10 10:25',
      tokens: [{ id: 's1', step: 3, who: 'sxld', since: '2026-11-13 16:05' }],
      vars: { paTomTat: 'VMC tổng thầu chế tạo, tích hợp, đo kiểm 3.000 trạm gNB-M3; VHT mua sắm linh kiện leadtime dài (FPGA, khối RF) trước để bảo đảm tiến độ 2027.',
        paFile: 'Bao cao phuong an san xuat gNB-M3.pdf', khSo: '118/KH-TTSX', khMucTieu: 'Sản xuất, nghiệm thu 3.000 trạm 5G Macro gNB-M3 đáp ứng kế hoạch triển khai mạng năm 2027.',
        khKr1: 'Ký hợp đồng tổng thầu với VMC trước 31/12/2026', khKr2: '100% linh kiện leadtime dài về kho trước 31/03/2027', khKr3: 'Nghiệm thu đủ 3.000 trạm trước 30/06/2027',
        khYeuCau: 'Trạm đạt chỉ tiêu kỹ thuật phiên bản v1.2; tỷ lệ lỗi xuất xưởng dưới 0,5%.',
        khPhuongAn: 'VMC tổng thầu; VHT giám sát theo 4 mốc tổng; Trung tâm ĐBCL kiểm soát IQC, IPQC, OQC tại nhà máy VMC.',
        khToChuc: 'Trung tâm Sản xuất chủ trì; Trung tâm Mua sắm lựa chọn nhà thầu; Trung tâm ĐBCL kiểm soát chất lượng.',
        khNhanSu: [{ hoTen: 'Vũ Thị Hương', donVi: 'Phòng Quản lý sản xuất — Khối 2', vaiTro: 'Giám đốc dự án' }, { hoTen: 'Đoàn Văn Khải', donVi: 'Trung tâm Đảm bảo chất lượng', vaiTro: 'Phụ trách chất lượng' }],
        khMoc: [{ ten: 'Ký hợp đồng tổng thầu với VMC', han: '31/12/2026' }, { ten: 'Linh kiện leadtime dài về đủ', han: '31/03/2027' }, { ten: 'Hoàn thành chế tạo, tích hợp', han: '31/05/2027' }, { ten: 'Nghiệm thu, nhập kho', han: '30/06/2027' }],
        khRuiRo: 'FPGA có leadtime 40 tuần: đề xuất mua trước bằng nguồn dự án 2026.', khPl1: 'Phu luc I - Cau hinh san pham.pdf', khPl6: 'Phu luc VI - Ke hoach chi tiet.xlsx' },
      hist: [{ step: null, who: 'sxk2', act: 'Khởi tạo hồ sơ', at: '2026-11-10 10:25' },
        { step: 1, who: 'sxk2', act: 'Hoàn thành', since: '2026-11-10 10:25', at: '2026-11-11 15:40' },
        { step: 2, who: 'sxk2', act: 'Trình xem xét', since: '2026-11-11 15:40', at: '2026-11-13 16:05' }] },
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
  /* Đề xuất mua sắm đã gửi trước đây (dữ liệu chuyển đổi). sync = ảnh trạng thái ĐTMS nhận qua API-02 / 03 / 04 (ĐXMS gốc không nằm trong bộ dữ liệu mẫu ĐTMS — GIẢ LẬP). */
  D.sxProposals = [
    { code: 'ĐXSX-2026-001', project: 'DA-SX-2026-001', dot: 1, title: 'Mua sắm vật tư leadtime dài VT-25 đợt 1', creator: 'sxpm', created: '2026-03-18', sent: '2026-03-20',
      lines: [['FPGA-XC7K325', 34], ['RF-PA-25W', 80], ['CON-MIL-38999', 120]],
      sync: { dxms: ['ĐXMS-2026-0058', 'Đã phê duyệt', 'success', '2026-04-10'], kh: ['KHLCNT-2026-0004', 'Hoàn thành KHLCNT', 'success', '2026-05-06'],
        pkgs: [['GT-2026-0008', 'Tổng thầu chế tạo, tích hợp, đo kiểm VT-25 đợt 1 (VMC)', 'Đã có kết quả LCNT', 'success']],
        hd: [['HĐ-2026-0019', 'Hợp đồng tổng thầu VT-25 đợt 1 với VMC', 'Đang thực hiện', 'success', 'Công ty Mua sắm Sản xuất Viettel', 14650000000, '2026-05-28']],
        kho: [['PNK-2026-0311', 'Nhập kho vật tư leadtime dài đợt 1', '2026-08-14', 'Đã nhập kho']] } },
    { code: 'ĐXSX-2026-002', project: 'DA-SX-2026-003', dot: 1, title: 'Thuê gia công trọn gói 120.000 bộ phát WM-6', creator: 'sxk2', created: '2026-04-03', sent: '2026-04-05',
      lines: [['SOC-MT7981', 105000], ['DDR4-512M', 98000], ['PCB-WM6', 120000], ['ADAPTER-12V', 120000], ['CASE-WM6', 120000]],
      sync: { dxms: ['ĐXMS-2026-0066', 'Đã phê duyệt', 'success', '2026-04-14'], kh: ['KHLCNT-2026-0006', 'Hoàn thành KHLCNT', 'success', '2026-04-22'],
        pkgs: [['GT-2026-0012', 'Gia công trọn gói bộ phát WM-6', 'Đã có kết quả LCNT', 'success']],
        hd: [['HĐ-2026-0024', 'Hợp đồng gia công WM-6 với Nhà máy lắp ráp Hải Phòng', 'Đang thực hiện', 'success', 'Nhà máy lắp ráp thiết bị viễn thông Hải Phòng', 51600000000, '2026-04-28']],
        kho: [['PNK-2026-0402', 'Nhập kho lô 1 (20.000 thiết bị)', '2026-06-20', 'Đã nhập kho'], ['PNK-2026-0455', 'Nhập kho lô 2 (20.000 thiết bị)', '2026-07-25', 'Đã nhập kho'],
          ['PNK-2026-0508', 'Nhập kho lô 3 (20.000 thiết bị)', '2026-08-29', 'Đã nhập kho'], ['PNK-2026-0561', 'Nhập kho lô 4 (20.000 thiết bị)', '2026-10-03', 'Đã nhập kho']] } },
  ];

  /* ---------- Điểm ❓ của phân hệ (P-237…, D-121 Q10) ---------- */
  Object.assign(D.openPoints, {
    'P-237': { q: 'Phân hệ Quản lý sản xuất chưa có trong danh sách phân hệ của nền tảng (core-fe subsystem.constants.ts có 6 phân hệ); tên, mô tả, icon, mã phân hệ', src: 'core-fe subsystem-list; CDS-DH-1210 §4.2', def: 'GIẢ LẬP — thêm thẻ "Quản lý sản xuất", mã QLSX, icon hàng hoá; thật: thêm một dòng SUBSYSTEMS + app con', scr: 'SCR-101' },
    'P-238': { q: 'Chưa có BPMN cho sản xuất: các luồng Phê duyệt kế hoạch, Chuyển giao, Bất thường, Thay đổi kỹ thuật, Nghiệm thu dựng nháp từ báo cáo khảo sát; ba quy trình QT.VHT.TTSX.4A.1.1–1.3 chưa có bản gốc (C17)', src: 'SX-KS-K1 §3, SX-KS-K2 §4; INDEX C17', def: 'GIẢ LẬP — 5 luồng nháp SX-KH / SX-BG / SX-BT / SX-TD / SX-NT theo docs/sx/prototype-qlsx-chuan-bi.md §4, chờ BA vẽ bản chuẩn', scr: 'SX-05, 06, 08, 09, 12' },
    'P-239': { q: 'Danh mục 20 hồ sơ chuyển giao Khối 2: báo cáo chỉ nêu 8 tên; 12 tên còn lại và cách chia nhóm', src: 'SX-KS-K2 §2.1, §4.1', def: 'GIẢ LẬP — 8 tên theo báo cáo + 12 tên theo bộ hồ sơ Khối 1 (SX-KS-K1 Bảng 10); nhóm theo cách chia 4 nhóm của Khối 1', scr: 'SX-13' },
    'P-240': { q: 'SLA bất thường Loại 3 "theo quy trình nhà máy": số ngày lấy từ đâu; ngày làm việc tính theo lịch nào', src: 'SX-KS-K1 §3.2.2 Bảng 7', def: 'GIẢ LẬP — Loại 3 không có số ngày trong danh mục, hạn = ngày nhà máy cam kết nhập trên phiếu; ngày làm việc theo lịch làm việc chung (trừ thứ 7, chủ nhật, ngày lễ)', scr: 'SX-13, SX-08' },
    'P-241': { q: 'Tài khoản nhà máy / đối tác gia công: cổng riêng hay dùng chung hệ thống với quyền hạn chế; dữ liệu Khối 1 (mật) có cho đối tác truy cập ngoài mạng nội bộ không', src: 'SX-KS-K1 §2.6, §6.3; SX-KS-K2 §5.1', def: 'GIẢ LẬP — vai Nhà máy đăng nhập chung hệ thống, chỉ thấy dự án được giao (phân quyền theo dữ liệu); không dựng cổng riêng (D-121 Q7)', scr: 'SX-13, SX-04' },
    'P-242': { q: 'Mã dự án sản xuất: tự sinh hay nhập theo mã nhiệm vụ / mã hợp đồng đầu ra', src: 'SX-KS-K2 §2.2 (dự án theo đơn hàng / thị trường)', def: 'GIẢ LẬP — hệ thống tự sinh DA-SX-<năm>-<số thứ tự>', scr: 'SX-03' },
    'P-246': { q: 'Tiêu chí điều kiện 4M (BM.QLHDSX.02 chưa có trong bộ tài liệu); ai xác nhận từng tiêu chí; dự án chỉ chuyển Đang sản xuất khi đạt đủ hay cho phép ngoại lệ', src: 'SX-KS-K1 §1.3, §2.3, §3.1 bước 4–7; INDEX C17', def: 'GIẢ LẬP — 9 tiêu chí theo 4 nhóm M, Giám đốc dự án xác nhận; tiêu chí gói chuyển giao hệ thống tự xác định; thiếu tiêu chí nào thì không chuyển Đang sản xuất được', scr: 'SX-04' },
    'P-247': { q: 'Thẩm định gói chuyển giao: Quản lý sản xuất và Đảm bảo chất lượng thẩm định song song hay tuần tự; một bên yêu cầu bổ sung thì bên kia dừng hay tiếp tục; Khối 1 có lập biên bản thống nhất như Khối 2 không', src: 'SX-KS-K2 §4.1; SX-KS-K1 §4 Bảng 10 (hồ sơ 27)', def: 'GIẢ LẬP — song song; một bên yêu cầu bổ sung thì huỷ bên còn lại, gói về R&D; cả hai khối lập biên bản ở bước 4', scr: 'SX-06' },
    'P-248': { q: 'Nguồn MBOM dự toán (VMMS) và tồn kho khả dụng (ERP Kho TCT): API nào, ai cung cấp, đơn giá dự toán lấy từ đâu; chia đợt mua sắm theo tiêu chí nào', src: 'SX-KS-K1 §2.5; SX-KS-K2 §2.3, §6 (API-01…04); SX-VMMS-1111', def: 'GIẢ LẬP — MBOM theo sản phẩm, tồn kho tra cứu tức thì theo mã vật tư; đề xuất mua = nhu cầu − tồn; đợt 1 gợi ý vật tư leadtime từ 16 tuần', scr: 'SX-10' },
    'P-249': { q: 'Đề xuất mua sắm gửi sang ĐTMS: ĐXMS tạo ở trạng thái nào, ai là người lập bên ĐTMS, Đề tài / dự án ghi gì; dữ liệu nào ĐTMS trả về (API-02/03/04) và khi nào', src: 'SX-KS-K2 §2.3, §6; INDEX C18', def: 'GIẢ LẬP — tạo ĐXMS Chưa khởi tạo, nguồn Phân hệ Sản xuất, Đơn vị đề xuất = Trung tâm Sản xuất; trạng thái ĐXMS / KHLCNT / gói thầu / hợp đồng đọc từ ĐTMS, nhập kho GIẢ LẬP', scr: 'SX-10' },
    'P-244': { q: 'Người xử lý từng bước luồng sản xuất: chỉ định theo dự án hay theo vai; ai xem xét, phê duyệt kế hoạch sản xuất Khối 2', src: 'SX-KS-K1 §3.1 (Ban Giám đốc Khối 1 phê duyệt); SX-KS-K2 §4.3', def: 'GIẢ LẬP — Giám đốc dự án của dự án lập, Ban Giám đốc Khối 1 xem xét và phê duyệt cho cả hai khối', scr: 'SX-05' },
    'P-245': { q: 'Kế hoạch sản xuất (BM.QLHDSX.01) nhập trên form hay tải file; 6 phụ lục bắt buộc những phụ lục nào; kế hoạch chi tiết (Phụ lục VI) có thay khung 15 bước của tab Kế hoạch & mốc không', src: 'BM-QLHDSX-01; SX-KS-K1 §3.1 bước 2', def: 'GIẢ LẬP — phần chính nhập trên form, phụ lục tải file (Phụ lục I và VI bắt buộc); kế hoạch gốc = khung 15 bước theo ngày dự án, các mốc chính của kế hoạch ghi kèm', scr: 'SX-05' },
    'P-243': { q: 'Phạm vi phân hệ năm 2026: sản xuất toàn trình 6 công đoạn hay ưu tiên phương án kinh doanh (C18)', src: 'SX-KS-3NGAY §IV.2; SX-GA-K2; INDEX C18', def: 'GIẢ LẬP — prototype dựng khung đủ 6 công đoạn, công đoạn thanh quyết toán mức nhẹ (D-121 Q2), để khách chọn phạm vi trên prototype', scr: 'SX-01' },
  });
})();
