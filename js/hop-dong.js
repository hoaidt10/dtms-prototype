/* Quản lý hợp đồng theo Backlog W1_T10 (T16 B3, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2k) — màn tĩnh, không chạy luồng (D-17, D-22).
   Hợp đồng là đối tượng cha (như KHLCNT): hình thành từ KQLCNT của gói thầu (MS22 bước 1) hoặc nhập từ dữ liệu cũ (Backlog 427).
   Vòng đời theo BPMN-DTMS 07/10: MS22 Thương thảo & ký → MS23 Theo dõi thực hiện (.01 Văn bản phát sinh, .02 Bàn giao, .03 Nghiệm thu, .04 Thanh lý) → MS24 Thanh toán theo đợt.
   SCR-84 #/hop-dong, SCR-85 #/hop-dong/create[/<mã gói>], SCR-86 #/hop-dong/<mã>, SCR-87 #/thoa-thuan-khung[/<mã>]. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, toast, vModal, persona } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => S.head(o);
  const K = () => window.Thau.kit;
  const T = () => window.Thau;
  const TODAY = '07/10/2026';
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const days = (a, b) => { const p = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d).getTime(); }; return Math.round((p(b) - p(a)) / 86400000); };
  const r2 = (n) => Math.round(n * 1000) / 1000;
  const m3 = (v) => (v == null ? K().dash : ty(v, 2));

  const HD_ST = { TT: ['Đang thương thảo', 'info'], KY: ['Đang trình ký', 'warning'], TH: ['Đang thực hiện', 'success'], TL: ['Đang thanh lý', 'warning'], DONG: ['Đã thanh lý', 'default'], CD: ['Chấm dứt', 'error'] };
  const HD_STEP = { TT: 'MS22 · Thương thảo, soạn thảo hợp đồng', KY: 'MS22 · Trình ký hợp đồng', TH: 'MS23 · Theo dõi thực hiện hợp đồng', TL: 'MS23.04 · Thanh lý hợp đồng', DONG: 'Kết thúc', CD: 'Kết thúc' };
  const SRC_HD = { KQ: 'Từ KQLCNT', IMPORT: 'Nhập từ dữ liệu cũ' };

  /* ---------- Dữ liệu mẫu ----------
     Tiền: tỷ đồng (đã gồm thuế GTGT). items: [tên, ĐVT, số lượng, đơn giá (tỷ đồng), hạng mục gói thầu tương ứng]. */
  const H0 = [
    { code: 'HĐ-2026-0052', src: 'KQ', pkg: 'GT-2026-0021', title: 'Hợp đồng cung cấp dây chuyền lắp ráp bo mạch trạm thu phát', ncc: 'NCC-000009',
      jv: [['NCC-000009', 'Thành viên đứng đầu — cung cấp thiết bị', 82], ['NCC-000011', 'Thành viên — lắp đặt, chuyển giao', 18]],
      type: 'TRON_GOI', form: 'DTRR', value: 191.2, cap: 195.0, cur: 'VND', vat: 10, unit: 'Nhà máy sản xuất thử nghiệm', owner: 'Phan Văn Lộc', st: 'TT', held: 'Tạm dừng ký hợp đồng đến khi có văn bản giải quyết kiến nghị về KQLCNT (07/10/2026).',
      created: '05/10/2026', updated: '07/10/2026', exec: '210 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Máy gắn linh kiện tốc độ cao', 'Máy', 4, 24.5], ['Lò hàn đối lưu 10 vùng nhiệt', 'Máy', 2, 9.3], ['Máy kiểm tra quang học tự động (AOI)', 'Máy', 2, 11.8], ['Máy kiểm tra X-ray 3D', 'Máy', 1, 51.0]],
      neg: { rounds: [['1', '06/10/2026', 'Phụ lục kỹ thuật (đơn vị sử dụng) và body, phụ lục giá (Phòng Hợp đồng)', 'Danh mục, cấu hình thiết bị; đơn giá theo HSDT; điều kiện thanh toán', 'Tiến độ giao hàng đợt 2; thời gian bảo hành lò hàn', 'BB-TT01-HĐ-2026-0052.pdf'],
        ['2', '07/10/2026', 'Thương thảo qua email về tiến độ và bảo hành', 'Tiến độ giao hàng đợt 2: 210 ngày', 'Bảo hành lò hàn: nhà thầu đề xuất 18 tháng (HSMT yêu cầu tối thiểu 24 tháng)', '']],
        check: [['KQLCNT', 'Giá hợp đồng bằng giá trúng thầu 191,20 tỷ đồng', 'Khớp'], ['KQLCNT', 'Phạm vi 4 hạng mục bằng phạm vi gói thầu', 'Khớp'], ['HSMT', 'Bảo hành thiết bị tối thiểu 24 tháng — dự thảo ghi 18 tháng cho lò hàn', 'Lệch'],
          ['HSDT trúng thầu', 'Tiến độ cam kết 240 ngày — dự thảo 210 ngày (rút ngắn)', 'Khớp'], ['KQLCNT', 'Loại hợp đồng Trọn gói', 'Khớp']],
        ai: ['Chưa đạt', 'Dự thảo v2 có 01 điều khoản trái HSMT (bảo hành lò hàn 18 tháng). Đề nghị thương thảo lại với nhà thầu trước khi trình ký nháy.'],
        versions: [['v1', '06/10/2026', 'Dự thảo theo mẫu hợp đồng mua sắm thiết bị (theo loại HĐ Trọn gói)', 'Phòng Hợp đồng'], ['v2', '07/10/2026', 'Cập nhật sau thương thảo vòng 2', 'Phòng Hợp đồng']],
        diff: [['Điều 5 — Tiến độ giao hàng đợt 2', '240 ngày kể từ ngày hợp đồng có hiệu lực', '210 ngày kể từ ngày hợp đồng có hiệu lực'], ['Điều 9 — Bảo hành lò hàn đối lưu', '24 tháng kể từ ngày nghiệm thu', '18 tháng kể từ ngày nghiệm thu']],
        sign: [] } },
    { code: 'HĐ-2025-0187', src: 'IMPORT', pkgText: 'GT-2025-0161', khText: 'KHLCNT-2025-0044', originText: 'ĐXMS-2025-0213', title: 'Hợp đồng cung cấp máy phân tích phổ và máy phân tích mạng vector', ncc: 'NCC-000008',
      type: 'TRON_GOI', form: 'DTRR', value: 45.6, cap: 47.0, cur: 'EUR', fx: 27450, vat: 10, unit: 'Phòng Chất lượng', owner: 'Bùi Minh Quang', st: 'TH', esign: false, no: '187/2025/HĐMB-VHT',
      sign: '15/12/2025', eff: '22/12/2025', end: '30/11/2026', created: '12/12/2025', updated: '05/09/2026', exec: '11 tháng kể từ ngày hợp đồng có hiệu lực',
      items: [['Máy phân tích phổ 50 GHz', 'Máy', 3, 6.2], ['Máy phân tích mạng vector 4 cổng', 'Máy', 2, 9.8], ['Bộ hiệu chuẩn điện tử', 'Bộ', 2, 1.5], ['Lắp đặt, đào tạo vận hành', 'Gói', 1, 4.4]],
      ms: [['Giao đợt 1: máy phân tích phổ', '30/04/2026', '28/04/2026', 40], ['Giao đợt 2: máy phân tích mạng vector, bộ hiệu chuẩn', '30/08/2026', null, 50], ['Lắp đặt, đào tạo vận hành', '30/10/2026', null, 10], ['Nghiệm thu tổng thể', '15/11/2026', null, 0]],
      dl: [['BG-01', 'Đợt 1', '30/04/2026', '28/04/2026', 'Phòng đo RF — Khu CNC Hòa Lạc', 'Máy phân tích phổ 50 GHz × 3', 'Đạt'], ['BG-02', 'Đợt 2', '30/08/2026', null, 'Phòng đo RF — Khu CNC Hòa Lạc', 'Máy phân tích mạng vector × 2; Bộ hiệu chuẩn × 2', null]],
      acc: [['NT-01', 'Đợt 1', '10/05/2026', 'Máy phân tích phổ 50 GHz × 3', 18.6, 'Đạt', '']],
      guar: [['BL_NH', 4.56, 10, '20/12/2025', '31/10/2026', 'Deutsche Bank AG — Chi nhánh Singapore']], adv: [['BL_NH', 13.68, '20/12/2025', '31/08/2026', 'Deutsche Bank AG — Chi nhánh Singapore', 'Đã hết hạn — đã thu hồi một phần tạm ứng']],
      warr: [['Máy phân tích phổ 50 GHz × 3', '24 tháng', '10/05/2026', '10/05/2028', 'Sửa chữa, thay thế trong 07 ngày làm việc']],
      plan: [['Tạm ứng', 'Ký hợp đồng và nộp bảo lãnh tạm ứng', 30, 13.68], ['Thanh toán đợt 1', 'Nghiệm thu đợt 1', 40, 18.6], ['Thanh toán đợt 2', 'Nghiệm thu đợt 2', 50, 22.6], ['Thanh toán cuối', 'Nghiệm thu tổng thể, hết hạn bảo hành phần giữ lại', 10, 4.4]],
      pays: [['TT-2026-0031', 'Tạm ứng', null, 13.68, 0, 0, 0, 'PAID', '05/01/2026'], ['TT-2026-0118', 'Thanh toán đợt 1', 'NT-01', 18.6, 5.58, 0, 0.93, 'PAID', '05/06/2026']],
      docs: [['Biên bản làm việc', 'BBLV-HĐ0187-02', '05/09/2026', 'Làm việc với nhà thầu về chậm giao đợt 2: nhà thầu nêu lý do chờ giấy phép xuất khẩu, cam kết giao trước 15/10/2026', null, 'Đã ký'],
        ['Biên bản phạt', 'BBP-HĐ0187-01', '07/10/2026', 'Phạt chậm giao đợt 2: 0,1%/ngày × 38 ngày × 22,60 tỷ đồng (tối đa 8% giá trị phần chậm)', -0.859, 'Dự thảo']],
      penalty: [['Phạt chậm tiến độ giao đợt 2', 0.859, 'Khấu trừ khi thanh toán đợt 2', 'Chưa khấu trừ']] },
    { code: 'HĐ-2026-0012', src: 'IMPORT', pkgText: 'GT-2026-0007', khText: 'KHLCNT-2026-0003', originText: 'ĐXMS-2025-0198', title: 'Hợp đồng cung cấp thiết bị mạng cho phòng lab kiểm thử 5G', ncc: 'NCC-000003',
      type: 'DG_DC', form: 'DTHC', value: 30.5, value0: 28.4, cap: 32.0, cur: 'VND', vat: 10, unit: 'Trung tâm Mạng lõi', owner: 'Đặng Thu Trang', st: 'TH', esign: true, no: '012/2026/HĐMB-VHT',
      sign: '20/03/2026', eff: '20/03/2026', end: '31/01/2027', end0: '31/12/2026', created: '16/03/2026', updated: '03/10/2026', exec: '10 tháng 11 ngày (sau Phụ lục 01)',
      items: [['Switch lõi 400G', 'Bộ', 5, 2.1], ['Router biên 100G', 'Bộ', 2, 4.5], ['Bộ phát lưu lượng kiểm thử', 'Bộ', 2, 5.5]],
      ms: [['Giao đợt 1: switch lõi, router biên', '30/05/2026', '25/05/2026', 45], ['Giao đợt 2: bộ phát lưu lượng', '30/09/2026', '26/09/2026', 36], ['Giao switch bổ sung (Phụ lục 01)', '30/11/2026', null, 7], ['Nghiệm thu tổng thể', '20/12/2026', null, 12]],
      dl: [['BG-01', 'Đợt 1', '30/05/2026', '25/05/2026', 'Lab 5G — Tòa nhà VHT, Hòa Lạc', 'Switch lõi 400G × 4; Router biên 100G × 2', 'Đạt'], ['BG-02', 'Đợt 2', '30/09/2026', '26/09/2026', 'Lab 5G — Tòa nhà VHT, Hòa Lạc', 'Bộ phát lưu lượng kiểm thử × 2', 'Không đạt 01 bộ'], ['BG-03', 'Bổ sung', '30/11/2026', null, 'Lab 5G — Tòa nhà VHT, Hòa Lạc', 'Switch lõi 400G × 1', null]],
      acc: [['NT-01', 'Đợt 1', '05/06/2026', 'Switch lõi × 4; Router biên × 2', 17.4, 'Đạt', ''], ['NT-02', 'Đợt 2', '03/10/2026', 'Bộ phát lưu lượng × 2', 11.0, 'Chưa đạt', '01 bộ lỗi cổng 100G số 3 — nhà thầu thay thế trong 07 ngày, nghiệm thu lại']],
      guar: [['BL_NH', 1.525, 5, '18/03/2026', '28/02/2027', 'Ngân hàng TMCP Quân đội']], warr: [['Thiết bị đợt 1', '12 tháng', '05/06/2026', '05/06/2027', 'Đổi mới thiết bị lỗi phần cứng']],
      plan: [['Thanh toán đợt 1', 'Nghiệm thu đợt 1', 57, 17.4], ['Thanh toán đợt 2', 'Nghiệm thu đợt 2', 36, 11.0], ['Thanh toán đợt 3', 'Nghiệm thu tổng thể (gồm thiết bị bổ sung)', 7, 2.1]],
      pays: [['TT-2026-0109', 'Thanh toán đợt 1', 'NT-01', 17.4, 0, 0, 0, 'PAID', '25/06/2026']],
      docs: [['Phụ lục hợp đồng', 'PL01/012/2026', '05/08/2026', 'Bổ sung 01 switch lõi 400G cho mở rộng phòng lab; gia hạn thời gian thực hiện 31 ngày', 2.1, 'Đã ký'],
        ['Biên bản làm việc', 'BBLV-HĐ0012-01', '03/10/2026', 'Thống nhất phương án thay thế bộ phát lưu lượng lỗi cổng 100G', null, 'Đã ký']],
      annex: [['Giá trị hợp đồng', '28,40 tỷ đồng', '30,50 tỷ đồng'], ['Switch lõi 400G — số lượng', '4 bộ', '5 bộ'], ['Ngày kết thúc hợp đồng', '31/12/2026', '31/01/2027']] },
    { code: 'HĐ-2026-0021', src: 'IMPORT', pkgText: 'GT-2026-0011', khText: 'KHLCNT-2026-0004', originText: 'ĐXMS-2026-0031', title: 'Hợp đồng cung cấp máy chủ, lưu trữ cho phòng lab AI giai đoạn 1', ncc: 'NCC-000001',
      type: 'TRON_GOI', form: 'CGTT', value: 9.6, cap: 10.0, cur: 'VND', vat: 10, unit: 'Trung tâm Phần mềm', owner: 'Lương Thị Hạnh', st: 'TL', esign: true, no: '021/2026/HĐMB-VHT',
      sign: '15/04/2026', eff: '15/04/2026', end: '15/09/2026', created: '10/04/2026', updated: '02/10/2026', exec: '5 tháng',
      items: [['Máy chủ GPU 8 card', 'Máy', 2, 3.6], ['Hệ thống lưu trữ NVMe 200 TB', 'Hệ thống', 1, 2.4]],
      ms: [['Giao hàng, lắp đặt', '30/07/2026', '22/07/2026', 90], ['Nghiệm thu tổng thể', '10/09/2026', '10/09/2026', 10]],
      dl: [['BG-01', 'Đợt 1', '30/07/2026', '22/07/2026', 'Phòng máy chủ — Tòa nhà VHT', 'Máy chủ GPU × 2; Hệ thống lưu trữ × 1', 'Đạt']],
      acc: [['NT-01', 'Tổng thể', '10/09/2026', 'Toàn bộ hạng mục', 9.6, 'Đạt', '']],
      guar: [['BL_NH', 0.48, 5, '12/04/2026', '15/10/2026', 'Ngân hàng TMCP Ngoại thương Việt Nam']], warr: [['Máy chủ GPU, hệ thống lưu trữ', '36 tháng', '10/09/2026', '10/09/2029', 'Hỗ trợ tại chỗ 4 giờ']],
      plan: [['Thanh toán', 'Nghiệm thu tổng thể', 95, 9.12], ['Giữ lại', 'Hết thời hạn bảo hành năm đầu', 5, 0.48]],
      pays: [['TT-2026-0207', 'Thanh toán theo nghiệm thu tổng thể', 'NT-01', 9.6, 0, 0, 0.48, 'SIGN', null]],
      docs: [], liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', false], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0009', '02/10/2026', 'Đang lập — chờ thanh toán đợt cuối (MS24) trước khi ký biên bản thanh lý'], final: 9.6 } },
    { code: 'HĐ-2025-0152', src: 'IMPORT', pkgText: 'GT-2025-0102', khText: 'KHLCNT-2025-0031', originText: 'ĐXMS-2025-0127', title: 'Hợp đồng dịch vụ bảo trì, hiệu chuẩn hệ thống buồng đo anten', ncc: 'NCC-000004',
      type: 'TRON_GOI', form: 'CDT_TT', value: 3.8, cap: 4.0, cur: 'VND', vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Nguyễn Văn Minh', st: 'DONG', esign: true, no: '152/2025/HĐDV-VHT',
      sign: '05/06/2025', eff: '05/06/2025', end: '05/06/2026', created: '30/05/2025', updated: '20/08/2026', exec: '12 tháng',
      items: [['Bảo trì định kỳ buồng đo (4 quý)', 'Quý', 4, 0.75], ['Hiệu chuẩn hệ thống đo, cấp chứng chỉ', 'Lần', 2, 0.4]],
      ms: [['Bảo trì quý III/2025', '30/09/2025', '26/09/2025', 20], ['Bảo trì quý IV/2025, hiệu chuẩn lần 1', '31/12/2025', '19/12/2025', 30], ['Bảo trì quý I/2026', '31/03/2026', '27/03/2026', 20], ['Bảo trì quý II/2026, hiệu chuẩn lần 2', '05/06/2026', '03/06/2026', 30]],
      dl: [], acc: [['NT-01', 'Quý III/2025', '02/10/2025', 'Bảo trì quý III/2025', 0.75, 'Đạt', ''], ['NT-02', 'Quý IV/2025', '24/12/2025', 'Bảo trì quý IV/2025; hiệu chuẩn lần 1', 1.15, 'Đạt', ''],
        ['NT-03', 'Quý I/2026', '31/03/2026', 'Bảo trì quý I/2026', 0.75, 'Đạt', ''], ['NT-04', 'Quý II/2026', '10/06/2026', 'Bảo trì quý II/2026 (hiệu chuẩn lần 2 không thực hiện do buồng đo đang nâng cấp)', 1.07, 'Đạt', 'Giảm trừ 0,08 tỷ đồng phần hiệu chuẩn lần 2']],
      guar: [['BL_NH', 0.19, 5, '03/06/2025', '05/07/2026', 'Ngân hàng TMCP Quân đội']], warr: [],
      plan: [['Thanh toán theo quý', 'Nghiệm thu từng quý', 100, 3.8]],
      pays: [['TT-2025-0281', 'Quý III/2025', 'NT-01', 0.75, 0, 0, 0, 'PAID', '15/10/2025'], ['TT-2026-0004', 'Quý IV/2025', 'NT-02', 1.15, 0, 0, 0, 'PAID', '08/01/2026'],
        ['TT-2026-0098', 'Quý I/2026', 'NT-03', 0.75, 0, 0, 0, 'PAID', '15/04/2026'], ['TT-2026-0161', 'Quý II/2026 (quyết toán)', 'NT-04', 1.07, 0, 0, 0, 'PAID', '15/08/2026']],
      docs: [['Biên bản làm việc', 'BBLV-HĐ0152-01', '20/05/2026', 'Thống nhất không thực hiện hiệu chuẩn lần 2, giảm trừ giá trị tương ứng khi quyết toán', -0.08, 'Đã ký']],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0007', '20/08/2026', 'Đã ký biên bản thanh lý — hợp đồng đã đóng'], final: 3.72, closed: '20/08/2026' } },
  ];

  const FW = [
    { code: 'TTK-2026-0003', title: 'Thỏa thuận khung cung cấp linh kiện điện tử cho sản xuất thử nghiệm', ncc: 'NCC-000009', value: 30.0, from: '01/02/2026', to: '31/01/2028', unit: 'Nhà máy sản xuất thử nghiệm', basis: 'KQLCNT GT-2025-0177 (0042/QĐ-VHT ngày 20/01/2026)',
      orders: [['ĐH-2026-0003-01', '15/03/2026', 'Linh kiện thụ động, IC nguồn cho lô mẫu RRU', 6.2, 'Đã giao đủ'], ['ĐH-2026-0003-02', '20/05/2026', 'FPGA, bộ nhớ DDR cho lô sản xuất thử', 8.4, 'Đã giao đủ'],
        ['ĐH-2026-0003-03', '25/08/2026', 'Linh kiện RF, bộ lọc cho lô RRU tháng 9', 7.1, 'Đang giao'], ['ĐH-2026-0003-04', '02/10/2026', 'Linh kiện bổ sung lô RRU tháng 11', 5.0, 'Chờ nhà thầu xác nhận']] },
    { code: 'TTK-2025-0007', title: 'Thỏa thuận khung cung cấp vật tư tiêu hao cho phòng đo kiểm', ncc: 'NCC-000004', value: 4.5, from: '01/01/2025', to: '31/12/2026', unit: 'Phòng Chất lượng', basis: 'KQLCNT GT-2024-0230 (0918/QĐ-VHT ngày 20/12/2024)',
      orders: [['ĐH-2025-0007-01', '10/02/2025', 'Cáp RF, đầu nối đo kiểm năm 2025', 1.4, 'Đã giao đủ'], ['ĐH-2025-0007-02', '15/09/2025', 'Bộ suy hao, tải giả', 1.1, 'Đã giao đủ'], ['ĐH-2025-0007-03', '12/03/2026', 'Cáp RF, đầu nối đo kiểm năm 2026', 1.4, 'Đã giao đủ']] },
    { code: 'TTK-2026-0005', title: 'Thỏa thuận khung dịch vụ vận chuyển thiết bị đo kiểm', ncc: 'NCC-000005', value: 2.0, from: '01/06/2026', to: '31/05/2027', unit: 'Phòng Chất lượng', basis: 'KQLCNT GT-2026-0009 (0398/QĐ-VHT ngày 25/05/2026)',
      orders: [['ĐH-2026-0005-01', '18/07/2026', 'Vận chuyển buồng đo di động đến hiện trường Đà Nẵng', 0.35, 'Đã hoàn thành']] },
  ];

  /* Số lượng theo hạng mục (chỉ số dòng items) của từng biên bản bàn giao / nghiệm thu — dữ liệu biên bản do MS23.02 / 23.03 ghi. */
  const QTY = {
    'HĐ-2025-0187': { 'BG-01': [[0, 3]], 'BG-02': [[1, 2], [2, 2]], 'NT-01': [[0, 3]] },
    'HĐ-2026-0012': { 'BG-01': [[0, 4], [1, 2]], 'BG-02': [[2, 2]], 'BG-03': [[0, 1]], 'NT-01': [[0, 4], [1, 2]], 'NT-02': [[2, 2]] },
    'HĐ-2026-0021': { 'BG-01': [[0, 2], [1, 1]], 'NT-01': [[0, 2], [1, 1]] },
    'HĐ-2025-0152': { 'NT-01': [[0, 1]], 'NT-02': [[0, 1], [1, 1]], 'NT-03': [[0, 1]], 'NT-04': [[0, 1]] },
  };
  const qtyOf = (h, doc, i) => ((QTY[h.code] || {})[doc] || []).filter((x) => x[0] === i).reduce((s0, x) => s0 + x[1], 0);

  /* Bản ghi tạo trên prototype (localStorage riêng). */
  const KEY = 'dtms-proto-hop-dong';
  let U = { hd: [], add: {} };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const all = () => U.hd.concat(H0).map((h) => { const a = U.add[h.code] || {}; return Object.assign({}, h, { docs: (h.docs || []).concat(a.docs || []), pays: (h.pays || []).concat(a.pays || []) }); });
  const hdOf = (code) => all().find((h) => h.code === code) || null;
  const byPkg = (pkg) => all().find((h) => h.pkg === pkg) || null;

  /* ---------- Chỉ số suy ra (S4: từ mốc / nghiệm thu / thanh toán của chính hợp đồng) ---------- */
  function eff(h) {
    if (h.st === 'TT' || h.st === 'KY') return ['Chưa hiệu lực', 'default'];
    if (h.st === 'CD') return ['Chấm dứt', 'error'];
    if (h.st === 'DONG' || dk(h.end) < dk(TODAY)) return ['Hết hiệu lực', 'default'];
    return ['Đang hiệu lực', 'success'];
  }
  const lateMs = (h) => (h.ms || []).filter((m) => !m[2] && dk(m[1]) < dk(TODAY));
  function prog(h) {
    if (h.st === 'TT' || h.st === 'KY') return ['Chưa thực hiện', 'default'];
    if ((h.ms || []).length && h.ms.every((m) => m[2])) return ['Hoàn thành', 'success'];
    return lateMs(h).length ? ['Chậm tiến độ', 'error'] : ['Đúng tiến độ', 'info'];
  }
  const doneRate = (h) => (h.ms || []).filter((m) => m[2]).reduce((s, m) => s + m[3], 0);
  const accSum = (h) => r2((h.acc || []).filter((a) => a[5] === 'Đạt').reduce((s, a) => s + a[4], 0));
  const net = (p) => r2(p[3] - p[4] - p[5] - p[6]);
  const paidSum = (h) => r2((h.pays || []).filter((p) => p[7] === 'PAID').reduce((s, p) => s + net(p), 0));
  const advOf = (h) => (h.pays || []).filter((p) => p[1] === 'Tạm ứng' && p[7] === 'PAID').reduce((s, p) => s + p[3], 0);
  const advBack = (h) => r2((h.pays || []).filter((p) => p[7] === 'PAID').reduce((s, p) => s + p[4], 0));
  /* Đã thanh toán (ròng) gồm tạm ứng; còn phải thanh toán = giá trị HĐ - đã thanh toán ròng - phạt / giảm trừ đã chốt. */
  const remain = (h) => r2(h.value - paidSum(h));
  /* P-80 (giả lập): ngưỡng cảnh báo = số ngày "Trước hạn" của Trigger thông báo tương ứng (SCR-91), mặc định 30 / 90 / 90 ngày. */
  const WARN = { guar: ['CONTRACT_GUARANTEE_EXPIRING', 30], hd: ['CONTRACT_EXPIRING', 90], fw: ['FRAMEWORK_EXPIRING', 90] };
  const warnDays = (k) => (window.ThongBao ? window.ThongBao.warnDays(...WARN[k]) : WARN[k][1]);
  const guarWarn = (h) => (h.guar || []).filter((g) => ['TH', 'TL'].includes(h.st) && dk(g[4]) >= dk(TODAY) && days(TODAY, g[4]) <= warnDays('guar'));
  const hdSoon = (h) => !!h.end && ['TH', 'TL'].includes(h.st) && dk(h.end) >= dk(TODAY) && days(TODAY, h.end) <= warnDays('hd');
  const nccName = (c) => K().nccName(c);
  const pkgLink = (h) => (h.pkg ? `<a class="link" data-go="goi-thau/${encodeURIComponent(h.pkg)}">${esc(h.pkg)}</a>` : esc(h.pkgText || '-'));
  function srcObj(h) {
    if (!h.pkg) return { kh: h.khText, origin: h.originText, originHref: null };
    const g = T().pkOf(h.pkg), k = g && T().khAll().find((x) => x.code === g.kh);
    return { g, kh: g && g.kh, origin: k ? k.src[1] : '', originHref: k ? T().srcHref(k.src[0], k.src[1]) : null };
  }
  const row = (h) => Object.assign({}, h, { eff: eff(h)[0], prog: prog(h)[0], nccN: nccName(h.ncc) });

  /* ---------- SCR-84 Danh sách hợp đồng ---------- */
  const hdHref = (h) => 'hop-dong/' + encodeURIComponent(h.code);
  function hdList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (hợp đồng = đối tượng cha)
    const k = K();
    const units = [...new Set(all().map((h) => h.unit))];
    return k.listPage({
      id: 'hdl', title: 'Danh sách hợp đồng', ph: 'Tìm kiếm theo mã, tên hợp đồng, nhà thầu',
      right: `<button class="vbtn secondary" data-hd-import>${icon('upload')} Nhập hợp đồng</button><button class="vbtn primary" data-go="hop-dong/create">${icon('add')} Thêm mới</button>`,
      rows: () => all().map(row), kwText: (h) => `${h.code} ${h.title} ${h.nccN}`,
      empty: () => ({ code: '', title: '', pkg: '', ncc: null, type: null, st: [], eff: null, prog: null, unit: null }),
      match: (h, f) => k.has(f.code, h.code) && k.has(f.title, h.title) && k.has(f.pkg, h.pkg || h.pkgText) && (!f.ncc || h.ncc === f.ncc) && (!f.type || h.type === f.type)
        && k.inSet(f.st, h.st) && (!f.eff || h.eff === f.eff) && (!f.prog || h.prog === f.prog) && (!f.unit || h.unit === f.unit),
      adv: (txt, sel) => `${txt('code', 'Mã hợp đồng')}${txt('title', 'Tên hợp đồng')}${txt('pkg', 'Mã gói thầu')}
        ${sel('ncc', 'Nhà thầu', { options: [...new Set(all().map((h) => h.ncc))].map((c) => ({ value: c, label: nccName(c) })) })}
        ${sel('type', 'Loại hợp đồng', { options: k.catOpts('loai-hop-dong') })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(HD_ST).map(([value, [label]]) => ({ value, label })) })}
        ${sel('eff', 'Hiệu lực', { searchable: false, options: ['Chưa hiệu lực', 'Đang hiệu lực', 'Hết hiệu lực', 'Chấm dứt'].map((x) => ({ value: x, label: x })) })}
        ${sel('prog', 'Tiến độ', { searchable: false, options: ['Chưa thực hiện', 'Đúng tiến độ', 'Chậm tiến độ', 'Hoàn thành'].map((x) => ({ value: x, label: x })) })}
        ${sel('unit', 'Đơn vị quản lý', { options: units.map((u) => ({ value: u, label: u })) })}`,
      cols: [['Thao tác', 80, 'c'], ['Trạng thái', 170, 'c'], ['Mã hợp đồng', 150], ['Tên hợp đồng', 320], ['Nhà thầu', 240], ['Gói thầu', 140], ['Loại hợp đồng', 180],
        ['Giá trị (tỷ đồng)', 140, 'r'], ['Ngày ký', 120], ['Hiệu lực', 150, 'c'], ['Tiến độ', 150, 'c'], ['Đơn vị quản lý', 200]],
      href: hdHref,
      cell: (h) => `<td class="c"><div class="acts">${h.st === 'TT' && U.hd.some((x) => x.code === h.code) ? `<button type="button" class="vbtn icon ghost" aria-label="Xoá" data-hd-del="${esc(h.code)}">${icon('del')}</button>` : ''}</div></td>
        <td class="c">${badge(...HD_ST[h.st])}</td><td><a class="link" data-go="${hdHref(h)}">${esc(h.code)}</a></td><td>${k.clamp(h.title)}</td><td>${k.clamp(h.nccN)}</td><td>${h.pkg ? pkgLink(h) : esc(h.pkgText)}</td>
        <td>${k.clamp(k.cat('loai-hop-dong', h.type))}</td><td class="r num">${m3(h.value)}</td><td class="num">${h.sign ? esc(h.sign) : k.dash}</td><td class="c">${badge(...eff(h))}</td><td class="c">${badge(...prog(h))}</td><td>${k.clamp(h.unit)}</td>`,
      info: {
        scr: 'SCR-84', name: 'Danh sách hợp đồng', uc: 'Backlog W1_T10 › Quản lý hợp đồng › Thông tin hợp đồng (dòng 422–429)', bpmn: 'MS22 → MS23 → MS24 (BPMN-DTMS 07/10)',
        notes: [
          'Hợp đồng là <b>đối tượng cha</b> (như KHLCNT): hình thành từ KQLCNT của gói thầu (Thêm mới / nút Tạo hợp đồng ở Chi tiết gói thầu = MS22 bước 1 tiếp nhận) hoặc <b>Nhập hợp đồng</b> cho hợp đồng đã ký trước khi có hệ thống (migration, Backlog 427 — không phải luồng chính; gói thầu của hợp đồng nhập là mã văn bản, không liên kết).',
          'Trạng thái theo BPMN: Đang thương thảo (MS22) → Đang trình ký (MS22 ký nháy, Thủ trưởng ký, VContract) → Đang thực hiện (MS23 / MS24) → Đang thanh lý (MS23.04) → Đã thanh lý. <b>Hiệu lực</b> và <b>Tiến độ</b> là chỉ số suy ra: hiệu lực theo ngày hiệu lực / hết hạn; chậm tiến độ khi có mốc quá ngày kế hoạch chưa hoàn thành (job quét mốc, sự kiện CONTRACT_MILESTONE_LATE).',
          'Màn tĩnh (D-22): MS22 chạy luồng sau W1 nếu cần demo.',
        ],
        q: ['P-80'], src: 'task-management/task-management.component · /task-management',
      },
    });
  }

  /* ---------- SCR-85 Khởi tạo hợp đồng từ KQLCNT ---------- */
  const F = { v: {}, err: {} };
  const eligible = () => T().PK.filter((g) => T().pkRow(g).stx === 'KQ' && g.bidders && g.winner && !byPkg(g.code) && !(g.events || []).some((e) => /Tạm dừng/.test(e[0]) && /hiệu lực/.test(e[3])));
  function resetForm(pkg) { F.err = {}; F.v = { pkg: pkg || null, title: '', unit: null, cur: 'VND' }; if (pkg) fill(pkg); }
  function fill(pkg) {
    const g = T().pkOf(pkg);
    if (!g) return;
    F.v.title = 'Hợp đồng ' + g.name.replace(/^./, (c) => c.toLowerCase());
    F.v.unit = (T().srcInfo(...(T().khAll().find((k) => k.code === g.kh) || { src: ['DXMS', ''] }).src) || {}).unit || null;
  }
  function hdForm() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create)
    const k = K(), v = F.v, err = F.err;
    const g = v.pkg ? T().pkOf(v.pkg) : null, win = g && g.bidders.find((b) => b[0] === g.winner);
    const units = [...new Set(T().khAll().map((x) => (T().srcInfo(...x.src) || {}).unit).filter(Boolean))];
    const info = {
      scr: 'SCR-85', name: 'Thêm mới hợp đồng', uc: 'Backlog W1_T10 › Hợp đồng › Khởi tạo hợp đồng từ KQLCNT; Sao chép thông tin từ gói thầu / KQLCNT; Liên kết gói thầu, đối tượng nguồn (dòng 425–429)', bpmn: 'MS22 bước 1 — Tiếp nhận kết quả LCNT',
      notes: [
        'Theo task-create (mode create). Chỉ chọn được gói thầu <b>Đã có KQLCNT</b>, chưa có hợp đồng, không bị tạm dừng ký (kiến nghị). Nhà thầu, giá trúng thầu, phạm vi (hạng mục), hình thức LCNT, loại hợp đồng <b>sao chép từ KQLCNT, chỉ xem</b> — tránh nhập lại (Backlog 426).',
        'Lưu = tạo hợp đồng ở trạng thái Đang thương thảo và khởi tạo MS22 (prototype không chạy luồng). Số hợp đồng cấp khi ký.',
        'Giá trị hợp đồng không được vượt giá trúng thầu / giá gói thầu (kiểm tra ở bước đối chiếu MS22 và khi lập phụ lục).',
      ],
      src: 'task-management/components/task-create · /task-management/create',
    };
    const opts = eligible().concat(g && !eligible().includes(g) ? [g] : []).map((x) => ({ value: x.code, label: `${x.code} - ${x.name}` }));
    return `<form class="pg" data-hd-form>
      ${head({ title: 'Thêm mới hợp đồng', back: 'hop-dong', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="hop-dong">Huỷ</button><button type="submit" class="vbtn primary" id="hd-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung hợp đồng</h3>
        <div class="grid3">
          ${k.field('Mã hợp đồng', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${k.field('Gói thầu (đã có KQLCNT)', vSelect({ id: 'hd-pkg', value: v.pkg, searchable: true, placeholder: 'Chọn gói thầu', invalid: !!err.pkg, options: opts, onChange: (x) => { v.pkg = x; delete err.pkg; fill(x); rerender(); } }), { req: true, err: err.pkg, cls: 'span2' })}
          ${k.field('Tên hợp đồng', `<input class="vctl" id="hd-title" maxlength="500" placeholder="Nhập tên hợp đồng" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span3' })}
          ${k.field('Nhà thầu ký hợp đồng', `<input class="vctl" value="${esc(win ? nccName(win[0]) : '')}" placeholder="Lấy từ KQLCNT" disabled>`, { cls: 'span2' })}
          ${k.field('Giá trúng thầu (tỷ đồng)', `<input class="vctl" value="${win ? ty(win[1], 2) : ''}" placeholder="Lấy từ KQLCNT" disabled>`)}
          ${k.field('Hình thức lựa chọn nhà thầu', `<input class="vctl" value="${esc(g ? k.cat('hinh-thuc-lcnt', g.form) : '')}" placeholder="Lấy từ gói thầu" disabled>`)}
          ${k.field('Loại hợp đồng', `<input class="vctl" value="${esc(g ? k.cat('loai-hop-dong', g.contract) : '')}" placeholder="Lấy từ gói thầu" disabled>`)}
          ${k.field('Quyết định phê duyệt KQLCNT', `<input class="vctl" value="${esc(g && g.kq ? g.kq[0] + ' ngày ' + g.kq[1] : '')}" placeholder="Lấy từ KQLCNT" disabled>`)}
          ${k.field('Đơn vị quản lý hợp đồng', vSelect({ id: 'hd-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị', invalid: !!err.unit, options: units.map((u) => ({ value: u, label: u })), onChange: (x) => { v.unit = x; delete err.unit; rerender(); } }), { req: true, err: err.unit })}
          ${k.field('Tiền tệ', vSelect({ id: 'hd-cur', value: v.cur, options: k.catOpts('tien-te'), onChange: (x) => { v.cur = x; rerender(); } }))}
          ${k.field('Người lập', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section>
      ${g ? k.card('Hạng mục hợp đồng (sao chép từ phạm vi gói thầu)', k.table([['Hàng hoá / dịch vụ / công việc', 460], ['Đơn vị tính', 140], ['Khối lượng', 120, 'r']], g.items || [],
        (r) => `<td>${k.clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${ty(r[2], 0)}</td>`), 'Đơn giá cập nhật khi thương thảo') : ''}</form>`;
  }
  function saveHd() {
    const t = document.getElementById('hd-title');
    if (t) F.v.title = t.value;
    const v = F.v, err = F.err = {};
    if (!v.pkg) err.pkg = 'Bạn cần chọn Gói thầu.';
    else if (byPkg(v.pkg)) err.pkg = `Gói thầu đã có hợp đồng ${byPkg(v.pkg).code}.`;
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên hợp đồng.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị quản lý hợp đồng.';
    if (Object.keys(err).length) { rerender(); return; }
    const g = T().pkOf(v.pkg), win = g.bidders.find((b) => b[0] === g.winner);
    const n = Math.max(...all().filter((h) => h.code.startsWith('HĐ-2026')).map((h) => Number(h.code.slice(-4)))) + 1;
    const code = 'HĐ-2026-' + String(n).padStart(4, '0'), now = Flow.dateOf(Flow.state.clock);
    const q = (g.items || []).reduce((s, r) => s + r[2], 0) || 1;
    U.hd.unshift({ code, src: 'KQ', pkg: g.code, title: v.title.trim(), ncc: g.winner, type: g.contract, form: g.form, value: win[1], cap: g.price, cur: v.cur, vat: 10, unit: v.unit,
      owner: persona(Flow.state.persona).name, st: 'TT', created: now, updated: now, exec: g.execTime,
      items: (g.items || []).map((r) => [r[0], r[1], r[2], r2(win[1] / q)]), neg: { rounds: [], check: [], versions: [], diff: [], sign: [] } });
    persist();
    toast('<b>Thành công</b><br>Thêm mới hợp đồng thành công!');
    location.hash = '#/hop-dong/' + encodeURIComponent(code);
  }

  /* ---------- SCR-86 Chi tiết hợp đồng ---------- */
  const PAY_ST = { DRAFT: ['Đang lập', 'default'], SIGN: ['Đang ký đề nghị', 'warning'], PAID: ['Đã thanh toán', 'success'] };
  function hdDetail(code) {
    // Theo: task-create (mode detail) + app-tabs, như SCR-80 Chi tiết KHLCNT
    const k = K(), h = hdOf(code);
    if (!h) return `<div class="pg">${head({ title: 'Xem chi tiết hợp đồng', back: 'hop-dong', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy hợp đồng.')}</div>`;
    const s = srcObj(h), locked = h.st === 'DONG', fx = h.cur !== 'VND' && h.fx;
    const info = {
      scr: 'SCR-86', name: 'Chi tiết hợp đồng', uc: 'Backlog W1_T10 › Quản lý hợp đồng (dòng 424–504)', bpmn: 'MS22 Thương thảo & ký; MS23 Theo dõi thực hiện (.01–.04); MS24 Thanh toán theo đợt',
      notes: [
        'Khuôn task-create (mode detail) + app-tabs; các tab chỉ xem, dữ liệu do bước BPMN ghi: <b>Thương thảo & ký kết</b> = MS22 (vòng thương thảo email, AI kiểm tra dự thảo — Not OK thì làm lại với NCC / sửa nội bộ, ký nháy TTMS + ĐVSD, Thủ trưởng VHT ký, gửi NCC ký VContract / giấy); <b>Tiến độ</b> = MS23 tổng quan (AI đọc HĐ trích mốc, đôn đốc giao hàng, cập nhật ngày thực tế); <b>Bàn giao & nghiệm thu</b> = MS23.02 / 23.03; <b>Văn bản phát sinh</b> = MS23.01; <b>Thanh lý</b> = MS23.04; <b>Thanh toán</b> = MS24 (hồ sơ thanh toán → đề nghị chuyển tiền ký 4 cấp → thanh toán → đồng bộ SAP).',
        'Bản đã ký là <b>bất biến</b>; thay đổi sau ký chỉ bằng phụ lục (MS23.01). Kiểm soát điều chỉnh: giá trị sau điều chỉnh không vượt giá gói thầu / giá trị nguồn; thời gian phù hợp dự án — validate khi lập phụ lục.',
        'So sánh phiên bản dự thảo / phụ lục = DEV-1 (như ĐXMS). Đồng bộ SAP = tích hợp tài chính (chưa giao PIC).',
        `Cảnh báo: bảo đảm thực hiện sắp hết hạn trong ${warnDays('guar')} ngày khi nghĩa vụ chưa xong; hợp đồng sắp hết hạn trong ${warnDays('hd')} ngày; mốc quá hạn → Chậm tiến độ (Trigger CONTRACT_GUARANTEE_EXPIRING / CONTRACT_EXPIRING / CONTRACT_MILESTONE_LATE).`,
        '<b>Giả lập P-80</b>: ngưỡng lấy theo số ngày "Trước hạn" của Trigger thông báo (sửa ở Trigger thông báo thì cảnh báo đổi theo). Khách chưa chốt số ngày, chưa chốt có tách theo loại hợp đồng hay không.',
      ],
      q: ['P-80'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id',
    };
    const warn = [];
    if (h.held) warn.push(['error', h.held]);
    guarWarn(h).forEach((g) => warn.push(['warning', `Bảo đảm thực hiện hợp đồng hết hiệu lực ngày ${g[4]} (còn ${days(TODAY, g[4])} ngày) trong khi nghĩa vụ hợp đồng chưa hoàn thành.`]));
    if (hdSoon(h)) warn.push(['warning', `Hợp đồng hết hạn ngày ${h.end} (còn ${days(TODAY, h.end)} ngày) — rà soát nghĩa vụ còn lại, lập phụ lục gia hạn hoặc chuẩn bị thanh lý.`]);
    lateMs(h).forEach((m) => warn.push(['error', `Mốc "${m[0]}" quá hạn ${days(m[1], TODAY)} ngày (kế hoạch ${m[1]}).`]));
    if (locked) warn.push(['info', `Hợp đồng đã thanh lý ngày ${h.liq.closed} — dữ liệu đã khoá chỉnh sửa.`]);
    const alerts = warn.length ? `<div class="hd-alerts">${warn.map(([t, x]) => `<div class="hd-alert ${t}">${icon('info')}<span>${esc(x)}</span></div>`).join('')}</div>` : '';

    const tInfo = () => k.card('Thông tin chung hợp đồng', `<div class="ginfo c3">
        ${k.kv('Mã hợp đồng', esc(h.code))}${k.kv('Tên hợp đồng', esc(h.title), 'span2')}
        ${k.kv('Số hợp đồng', h.no ? esc(h.no) : null)}${k.kv('Trạng thái', badge(...HD_ST[h.st]))}${k.kv('Bước hiện tại', esc(HD_STEP[h.st]))}
        ${k.kv('Nguồn hình thành', esc(SRC_HD[h.src]))}${k.kv('Gói thầu', pkgLink(h))}${k.kv('KHLCNT', h.pkg && s.kh ? `<a class="link-red" href="#/khlcnt/${encodeURIComponent(s.kh)}">${esc(s.kh)}</a>` : esc(s.kh || '-'))}
        ${k.kv('Đối tượng nguồn (ĐXMS / KĐT)', s.originHref ? `<a class="link-red" href="#/${s.originHref}">${esc(s.origin)}</a>` : esc(s.origin || '-'))}${k.kv('Hình thức lựa chọn nhà thầu', esc(k.cat('hinh-thuc-lcnt', h.form)))}${k.kv('Loại hợp đồng', esc(k.cat('loai-hop-dong', h.type)))}
        ${k.kv('Đơn vị quản lý hợp đồng', esc(h.unit))}${k.kv('Đầu mối theo dõi', esc(h.owner))}${k.kv('Hình thức ký', h.sign ? (h.esign ? 'Ký điện tử (VContract)' : 'Ký giấy') : null)}</div>`)
      + k.card('Giá trị hợp đồng', `<div class="ginfo c3">
        ${k.kv('Giá trị hợp đồng (đã gồm thuế GTGT)', ty(h.value, 2) + ' tỷ đồng')}${k.kv('Thuế GTGT', h.vat + '%')}${k.kv('Tiền tệ', esc(k.cat('tien-te', h.cur)))}
        ${k.kv('Giá trị theo nguyên tệ', fx ? `${Math.round(h.value * 1e9 / h.fx).toLocaleString('vi-VN')} ${esc(h.cur)}` : null)}${k.kv('Tỷ giá quy đổi', fx ? `${h.fx.toLocaleString('vi-VN')} VNĐ/${esc(h.cur)} (ngày ký)` : null)}
        ${k.kv('Giá trị ban đầu (trước phụ lục)', h.value0 ? ty(h.value0, 2) + ' tỷ đồng' : null)}
        ${k.kv('Giới hạn giá trị (giá gói thầu / nguồn)', ty(h.cap, 2) + ' tỷ đồng')}${k.kv('Đã thanh toán', ty(paidSum(h), 2) + ' tỷ đồng')}${k.kv('Còn phải thanh toán', ty(remain(h), 2) + ' tỷ đồng')}</div>`)
      + k.card('Thời gian', `<div class="ginfo c3">
        ${k.kv('Ngày ký', h.sign || null)}${k.kv('Ngày hiệu lực', h.eff || null)}${k.kv('Ngày hết hạn', h.end ? esc(h.end) + (h.end0 ? ` (ban đầu ${esc(h.end0)})` : '') : null)}
        ${k.kv('Thời gian thực hiện', esc(h.exec))}${k.kv('Hiệu lực', badge(...eff(h)))}${k.kv('Tiến độ', badge(...prog(h)))}</div>`);
    const tDt = () => {
      const jv = h.jv || [[h.ncc, 'Nhà thầu ký hợp đồng', 100]];
      return k.card(h.jv ? 'Liên danh nhà thầu' : 'Nhà thầu ký hợp đồng', k.table([['Mã nhà thầu', 140], ['Tên nhà thầu', 320], ['Vai trò', 300], ['Tỷ lệ phần việc', 140, 'r'], ['Giá trị phần việc (tỷ đồng)', 190, 'r']], jv,
        (r) => `<td>${esc(r[0])}</td><td>${k.clamp(nccName(r[0]))}</td><td>${esc(r[1])}</td><td class="r num">${r[2]}%</td><td class="r num">${m3(r2(h.value * r[2] / 100))}</td>`), h.jv ? 'Thỏa thuận liên danh ghi trong HSDT trúng thầu' : 'Nhà thầu trúng thầu trở thành bên ký hợp đồng')
        + k.card('Đại diện ký hợp đồng', `<div class="ginfo c3">${k.kv('Bên mua', 'Tổng công ty Công nghiệp Công nghệ cao Viettel')}${k.kv('Người đại diện bên mua', 'Thủ trưởng VHT (hoặc người được uỷ quyền)')}${k.kv('Bên bán', esc(nccName(h.ncc)))}</div>`);
    };
    const tHm = () => {
      const accQ = (i) => (h.acc || []).filter((a) => a[5] === 'Đạt').reduce((s0, a) => s0 + qtyOf(h, a[0], i), 0);
      const tot = r2(h.items.reduce((s0, r) => s0 + r[2] * r[3], 0));
      return k.card('Danh sách hàng hoá / dịch vụ / công việc', k.table([['Hàng hoá / dịch vụ / công việc', 340], ['Đơn vị tính', 110], ['Số lượng', 100, 'r'], ['Đơn giá (tỷ đồng)', 140, 'r'], ['Thành tiền (tỷ đồng)', 150, 'r'], ['Hạng mục gói thầu', 200], ['Đã nghiệm thu', 130, 'r']], h.items,
        (r, i) => `<td>${k.clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${ty(r[2], 0)}</td><td class="r num">${ty(r[3], 3)}</td><td class="r num">${ty(r2(r[2] * r[3]), 3)}</td>
          <td>${h.pkg ? esc(h.pkg + ' · ' + r[0]) : esc((h.pkgText || '') + ' · ' + r[0])}</td><td class="r num">${accQ(i)} / ${r[2]}</td>`,
        `<tfoot><tr><td></td><td colspan="4"><b>Cộng</b></td><td class="r num"><b>${ty(tot, 3)}</b></td><td colspan="2">${Math.abs(tot - h.value) < 0.01 ? badge('Khớp giá trị hợp đồng', 'success') : badge('Lệch giá trị hợp đồng', 'error')}</td></tr></tfoot>`),
        'Hạng mục hợp đồng liên kết hạng mục gói thầu — không vượt phạm vi KQLCNT');
    };
    const tTt = () => {
      const n = h.neg;
      if (!n) {
        return k.emptyCard('Thương thảo & ký kết', 'Hợp đồng nhập từ dữ liệu cũ: không có hồ sơ thương thảo trên hệ thống.')
          + k.card('Hợp đồng đã ký', `<div class="ginfo c3">${k.kv('Số hợp đồng', esc(h.no))}${k.kv('Ngày ký', esc(h.sign))}${k.kv('Bản chính thức', `<a class="link-red" href="#" data-dl="${esc(h.no.replace(/\//g, '-'))}.pdf">${esc(h.no.replace(/\//g, '-'))}.pdf</a> · bất biến`)}</div>`);
      }
      return k.card('Các vòng thương thảo', k.table([['Vòng', 70, 'c'], ['Ngày', 110], ['Nội dung', 300], ['Đã thống nhất', 280], ['Chưa thống nhất', 280], ['Biên bản', 200]], n.rounds,
          (r) => `<td class="c">${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td>${k.clamp(r[2])}</td><td>${k.clamp(r[3])}</td><td>${k.clamp(r[4])}</td><td>${r[5] ? `<a class="link-red" href="#" data-dl="${esc(r[5])}">${esc(r[5])}</a>` : k.dash}</td>`), 'Chưa có vòng thương thảo thì để trống')
        + k.card('Đối chiếu dự thảo hợp đồng', k.table([['Căn cứ', 160], ['Nội dung đối chiếu', 560], ['Kết quả', 120, 'c']], n.check,
          (r) => `<td>${esc(r[0])}</td><td>${k.clamp(r[1])}</td><td class="c">${r[2] === 'Khớp' ? badge('Khớp', 'success') : badge('Lệch', 'error')}</td>`), 'Với KQLCNT, HSMT / HSYC / HSMCG, HSDT / HSĐX / HSCG trúng thầu')
        + (n.ai ? k.card('Gợi ý AI — kiểm tra dự thảo hợp đồng', `<div class="ginfo c3">${k.kv('Kết quả', n.ai[0] === 'Đạt' ? badge('Đạt', 'success') : badge('Chưa đạt', 'error'))}${k.kv('Nhận xét', esc(n.ai[1]), 'span2')}</div>`) : '')
        + k.card('Phiên bản dự thảo hợp đồng', k.table([['Phiên bản', 100], ['Ngày', 120], ['Nội dung', 460], ['Người soạn', 200]], n.versions,
          (r) => `<td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td>${k.clamp(r[2])}</td><td>${esc(r[3])}</td>`))
        + (n.diff.length ? k.card('So sánh dự thảo v1 / v2', k.table([['Điều khoản', 280], ['Phiên bản trước', 360], ['Phiên bản sau', 360]], n.diff,
          (d) => `<td>${k.clamp(d[0])}</td><td><span class="diff-old">${esc(d[1])}</span></td><td><span class="diff-new">${esc(d[2])}</span></td>`), 'Chỉ liệt kê điều khoản thay đổi') : '')
        + k.card('Trình ký hợp đồng', k.table([['Bước ký', 260], ['Người ký', 220], ['Trình ký lúc', 150], ['Ký lúc', 150], ['Kết quả', 140, 'c']], n.sign,
          (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="num">${esc(r[2] || '-')}</td><td class="num">${esc(r[3] || '-')}</td><td class="c">${badge(r[4], r[4] === 'Đã ký' ? 'success' : r[4] === 'Từ chối' ? 'error' : 'info')}</td>`),
          h.held ? 'Tạm dừng trình ký theo kiến nghị' : 'Ký nháy TTMS + đơn vị sử dụng → Thủ trưởng VHT → nhà thầu (VContract / giấy)');
    };
    const tBd = () => k.card('Bảo đảm thực hiện hợp đồng', k.table([['Hình thức', 260], ['Giá trị (tỷ đồng)', 150, 'r'], ['Tỷ lệ', 80, 'r'], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120], ['Tổ chức phát hành', 280], ['Tình trạng', 190, 'c']], h.guar || [],
        (g) => { const left = days(TODAY, g[4]); return `<td>${esc(k.cat('hinh-thuc-bao-dam', g[0]))}</td><td class="r num">${ty(g[1], 3)}</td><td class="r num">${g[2]}%</td><td class="num">${esc(g[3])}</td><td class="num">${esc(g[4])}</td><td>${k.clamp(g[5])}</td>
          <td class="c">${h.st === 'DONG' ? badge('Đã giải toả', 'default') : left < 0 ? badge('Hết hiệu lực', 'default') : left <= warnDays('guar') && ['TH', 'TL'].includes(h.st) ? badge(`Sắp hết hạn (${left} ngày)`, 'warning') : badge('Còn hiệu lực', 'success')}</td>`; }),
        h.guar ? 'Tỷ lệ theo Quy chế, tính trên giá trị hợp đồng' : 'Lập khi ký hợp đồng')
      + (h.adv ? k.card('Bảo lãnh tạm ứng', k.table([['Hình thức', 260], ['Giá trị (tỷ đồng)', 150, 'r'], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120], ['Tổ chức phát hành', 280], ['Ghi chú', 260]], h.adv,
        (g) => `<td>${esc(k.cat('hinh-thuc-bao-dam', g[0]))}</td><td class="r num">${ty(g[1], 3)}</td><td class="num">${esc(g[2])}</td><td class="num">${esc(g[3])}</td><td>${k.clamp(g[4])}</td><td>${k.clamp(g[5])}</td>`)) : '')
      + k.card('Bảo hành', k.table([['Hạng mục', 300], ['Thời gian bảo hành', 150], ['Từ ngày', 120], ['Đến ngày', 120], ['Điều kiện', 300], ['Trạng thái', 160, 'c']], h.warr || [],
        (w) => `<td>${k.clamp(w[0])}</td><td>${esc(w[1])}</td><td class="num">${esc(w[2])}</td><td class="num">${esc(w[3])}</td><td>${k.clamp(w[4])}</td><td class="c">${dk(w[3]) >= dk(TODAY) ? badge('Đang bảo hành', 'info') : badge('Hết bảo hành', 'default')}</td>`), 'Nghĩa vụ kéo dài sau nghiệm thu');
    const tTd = () => {
      if (!(h.ms || []).length) return k.emptyCard('Kế hoạch / mốc thực hiện', 'Mốc thực hiện được lập sau khi hợp đồng có hiệu lực (AI đọc hợp đồng trích mốc — MS23).');
      const rate = doneRate(h);
      return k.card('Tình hình thực hiện', `<div class="ginfo c3">${k.kv('Tỷ lệ hoàn thành (theo khối lượng mốc)', rate + '%')}${k.kv('Giá trị đã nghiệm thu', ty(accSum(h), 2) + ' tỷ đồng (' + Math.round(accSum(h) / h.value * 100) + '%)')}${k.kv('Tiến độ', badge(...prog(h)))}</div>
          <div class="hd-bar" role="img" aria-label="Tỷ lệ hoàn thành ${rate}%"><span style="width:${rate}%"></span></div>`)
        + k.card('Kế hoạch / mốc thực hiện', k.table([['Mốc', 360], ['Kế hoạch', 120], ['Thực tế', 120], ['Khối lượng', 110, 'r'], ['Trạng thái', 190, 'c']], h.ms,
          (m) => { const late = !m[2] && dk(m[1]) < dk(TODAY), lateDone = m[2] && dk(m[2]) > dk(m[1]);
            return `<td>${k.clamp(m[0])}</td><td class="num">${esc(m[1])}</td><td class="num">${m[2] ? esc(m[2]) : k.dash}</td><td class="r num">${m[3]}%</td>
            <td class="c">${m[2] ? (lateDone ? badge(`Hoàn thành chậm ${days(m[1], m[2])} ngày`, 'warning') : badge('Hoàn thành', 'success')) : late ? badge(`Quá hạn ${days(m[1], TODAY)} ngày`, 'error') : badge('Chưa đến hạn', 'default')}</td>`; }), 'So sánh kế hoạch và thực tế')
        + k.card('Kết quả kiểm tra chất lượng (KCS)', k.table([['Đợt', 100], ['Ngày', 120], ['Hàng hoá', 360], ['Kết quả', 170, 'c']], (h.dl || []).filter((d) => d[3]),
          (d) => `<td>${esc(d[1])}</td><td class="num">${esc(d[3])}</td><td>${k.clamp(d[5])}</td><td class="c">${d[6] === 'Đạt' ? badge('Đạt', 'success') : badge(d[6] || 'Chưa kiểm tra', d[6] ? 'error' : 'default')}</td>`));
    };
    const tBg = () => {
      const remainItems = h.items.map((r, i) => [r[0], r[1], r[2], (h.dl || []).filter((d) => d[3]).reduce((s0, d) => s0 + qtyOf(h, d[0], i), 0)]);
      return k.card('Đợt bàn giao', k.table([['Mã', 90], ['Đợt', 100], ['Kế hoạch', 110], ['Thực tế', 110], ['Địa điểm giao nhận', 260], ['Hàng hoá / dịch vụ bàn giao', 320], ['KCS', 150, 'c']], h.dl || [],
          (d) => `<td>${esc(d[0])}</td><td>${esc(d[1])}</td><td class="num">${esc(d[2])}</td><td class="num">${d[3] ? esc(d[3]) : k.dash}</td><td>${k.clamp(d[4])}</td><td>${k.clamp(d[5])}</td>
            <td class="c">${!d[3] ? badge('Chưa giao', 'default') : d[6] === 'Đạt' ? badge('Đạt', 'success') : badge(d[6], 'error')}</td>`), 'MS23.02 — hàng không đạt xử lý trong 07 ngày')
        + (h.dl && h.dl.length ? k.card('Phần còn phải bàn giao', k.table([['Hàng hoá', 360], ['Đơn vị tính', 120], ['Theo hợp đồng', 140, 'r'], ['Đã bàn giao', 140, 'r'], ['Còn lại', 120, 'r']], remainItems,
          (r) => `<td>${k.clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${r[2]}</td><td class="r num">${r[3]}</td><td class="r num">${r[2] - r[3]}</td>`)) : '')
        + k.card('Đợt nghiệm thu', k.table([['Mã', 90], ['Đợt', 120], ['Ngày', 110], ['Khối lượng nghiệm thu', 320], ['Giá trị (tỷ đồng)', 140, 'r'], ['Kết quả', 120, 'c'], ['Nội dung chưa đạt / cần khắc phục', 300]], h.acc || [],
          (a) => `<td>${esc(a[0])}</td><td>${esc(a[1])}</td><td class="num">${esc(a[2])}</td><td>${k.clamp(a[3])}</td><td class="r num">${m3(a[4])}</td><td class="c">${a[5] === 'Đạt' ? badge('Đạt', 'success') : badge('Chưa đạt', 'error')}</td><td>${k.clamp(a[6])}</td>`),
          `Lũy kế đã nghiệm thu: ${ty(accSum(h), 2)} / ${ty(h.value, 2)} tỷ đồng (${h.value ? Math.round(accSum(h) / h.value * 100) : 0}%)`);
    };
    const tPay = () => {
      const can = ['TH', 'TL'].includes(h.st) && payable(h).length;
      return k.card('Tổng hợp thanh toán', `<div class="ginfo c3">${k.kv('Giá trị hợp đồng', ty(h.value, 2) + ' tỷ đồng')}${k.kv('Đã tạm ứng', ty(advOf(h), 2) + ' tỷ đồng')}${k.kv('Đã thu hồi tạm ứng', ty(advBack(h), 2) + ' tỷ đồng')}
          ${k.kv('Đã thanh toán (lũy kế, ròng)', ty(paidSum(h), 2) + ' tỷ đồng')}${k.kv('Còn phải thanh toán', ty(remain(h), 2) + ' tỷ đồng')}${k.kv('Tỷ lệ thanh toán', (h.value ? Math.round(paidSum(h) / h.value * 100) : 0) + '%')}</div>`)
        + k.card('Kế hoạch thanh toán', k.table([['Mốc', 220], ['Điều kiện thanh toán', 380], ['Tỷ lệ', 90, 'r'], ['Giá trị (tỷ đồng)', 150, 'r']], h.plan || [],
          (p) => `<td>${esc(p[0])}</td><td>${k.clamp(p[1])}</td><td class="r num">${p[2]}%</td><td class="r num">${m3(p[3])}</td>`))
        + `<section class="vcard pad24"><div class="vcard-h"><h3>Hồ sơ thanh toán</h3>${can ? `<button type="button" class="vbtn primary" data-hd-pay="${esc(h.code)}">${icon('add')} Tạo hồ sơ thanh toán</button>` : ''}</div>
          ${k.table([['Mã hồ sơ', 130], ['Đợt', 200], ['Căn cứ nghiệm thu', 130], ['Đề nghị (tỷ đồng)', 130, 'r'], ['Khấu trừ tạm ứng', 130, 'r'], ['Phạt', 100, 'r'], ['Giữ lại', 100, 'r'], ['Thanh toán ròng', 130, 'r'], ['Trạng thái', 160, 'c'], ['Đồng bộ SAP', 150, 'c']], h.pays || [],
            (p) => `<td>${esc(p[0])}</td><td>${k.clamp(p[1])}</td><td>${p[2] ? esc(p[2]) : k.dash}</td><td class="r num">${ty(p[3], 3)}</td><td class="r num">${ty(p[4], 3)}</td><td class="r num">${ty(p[5], 3)}</td><td class="r num">${ty(p[6], 3)}</td>
              <td class="r num">${ty(net(p), 3)}</td><td class="c">${badge(...PAY_ST[p[7]])}</td><td class="c">${p[7] === 'PAID' ? badge('Đã đồng bộ ' + p[8], 'success') : badge('Chưa đồng bộ', 'default')}</td>`)}</section>`
        + ((h.penalty || []).length ? k.card('Phạt / bồi thường', k.table([['Nội dung', 360], ['Giá trị (tỷ đồng)', 150, 'r'], ['Cách xử lý', 260], ['Trạng thái', 160, 'c']], h.penalty,
          (p) => `<td>${k.clamp(p[0])}</td><td class="r num">${ty(p[1], 3)}</td><td>${k.clamp(p[2])}</td><td class="c">${badge(p[3], 'warning')}</td>`)) : '');
    };
    const tVb = () => {
      const can = h.st === 'TH';
      return `<section class="vcard pad24"><div class="vcard-h"><h3>Văn bản phát sinh</h3>${can ? `<button type="button" class="vbtn primary" data-hd-annex="${esc(h.code)}">${icon('add')} Thêm phụ lục</button>` : ''}</div>
          ${k.table([['Loại văn bản', 170], ['Số văn bản', 170], ['Ngày', 110], ['Nội dung', 400], ['Ảnh hưởng giá trị (tỷ đồng)', 180, 'r'], ['Trạng thái', 130, 'c']], h.docs || [],
            (d) => `<td>${esc(d[0])}</td><td>${esc(d[1])}</td><td class="num">${esc(d[2])}</td><td>${k.clamp(d[3])}</td><td class="r num">${d[4] == null ? k.dash : (d[4] > 0 ? '+' : '') + ty(d[4], 3)}</td><td class="c">${badge(d[5], d[5] === 'Đã ký' ? 'success' : 'default')}</td>`)}</section>`
        + (h.annex ? k.card('So sánh trước / sau điều chỉnh (Phụ lục 01)', k.table([['Nội dung', 300], ['Trước điều chỉnh', 300], ['Sau điều chỉnh', 300]], h.annex,
          (d) => `<td>${k.clamp(d[0])}</td><td><span class="diff-old">${esc(d[1])}</span></td><td><span class="diff-new">${esc(d[2])}</span></td>`)) : '')
        + k.card('Kiểm soát điều chỉnh', `<div class="ginfo c3">${k.kv('Giá trị hợp đồng sau điều chỉnh', ty(h.value, 2) + ' tỷ đồng')}${k.kv('Giới hạn (giá gói thầu / nguồn)', ty(h.cap, 2) + ' tỷ đồng')}
          ${k.kv('Kết quả kiểm tra giá trị', h.value <= h.cap ? badge('Không vượt giới hạn', 'success') : badge('Vượt giới hạn', 'error'))}${k.kv('Ngày kết thúc sau điều chỉnh', h.end ? esc(h.end) : null)}${k.kv('Kết quả kiểm tra thời gian', h.end ? badge('Phù hợp thời gian thực hiện dự án', 'success') : null)}</div>`);
    };
    const tTl = () => {
      const l = h.liq;
      const docs = [].concat(h.neg ? h.neg.rounds.filter((r) => r[5]).map((r) => ['Biên bản thương thảo vòng ' + r[0], r[1]]) : [], h.no ? [['Hợp đồng ' + h.no + ' (bản chính thức)', h.sign]] : [],
        (h.dl || []).filter((d) => d[3]).map((d) => ['Biên bản bàn giao ' + d[0], d[3]]), (h.acc || []).map((a) => ['Biên bản nghiệm thu ' + a[0], a[2]]),
        (h.pays || []).map((p) => ['Hồ sơ thanh toán ' + p[0], p[8] || '-']), (h.docs || []).map((d) => [d[0] + ' ' + d[1], d[2]]), l && l.file ? [['Hồ sơ thanh lý ' + l.file[0], l.file[1]]] : []);
      return (l ? k.card('Điều kiện thanh lý', k.table([['Nghĩa vụ', 520], ['Kết quả', 160, 'c']], l.cond, (c) => `<td>${esc(c[0])}</td><td class="c">${c[1] ? badge('Đã hoàn thành', 'success') : badge('Chưa hoàn thành', 'warning')}</td>`))
          + k.card('Hồ sơ thanh lý', `<div class="ginfo c3">${k.kv('Mã hồ sơ thanh lý', esc(l.file[0]))}${k.kv('Ngày lập', esc(l.file[1]))}${k.kv('Tình trạng', esc(l.file[2]))}
            ${k.kv('Giá trị quyết toán cuối cùng', ty(l.final, 2) + ' tỷ đồng')}${k.kv('Biên bản thanh lý', l.closed ? `<a class="link-red" href="#" data-dl="BB-thanh-ly-${esc(h.code)}.pdf">BB-thanh-ly-${esc(h.code)}.pdf</a>` : null)}${k.kv('Trạng thái dữ liệu', l.closed ? badge('Đã khoá chỉnh sửa', 'default') : badge('Đang mở', 'info'))}</div>`)
        : k.emptyCard('Thanh lý hợp đồng', 'Hồ sơ thanh lý được lập khi các nghĩa vụ của hợp đồng đã hoàn thành (MS23.04).'))
        + k.card('Hồ sơ vòng đời hợp đồng', k.table([['Văn bản / hồ sơ', 520], ['Ngày', 140]], docs, (d) => `<td>${k.clamp(d[0])}</td><td class="num">${esc(d[1])}</td>`), 'Phục vụ hậu kiểm, audit và tra cứu');
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết hợp đồng', back: 'hop-dong', lg: true, info })}${alerts}
      ${k.tabs('hd:' + h.code, [['info', 'Thông tin chung'], ['dt', 'Đối tác'], ['hm', 'Hạng mục'], ['tt', 'Thương thảo & ký kết'], ['bd', 'Bảo đảm & bảo hành'], ['td', 'Tiến độ thực hiện'],
        ['bg', 'Bàn giao & nghiệm thu'], ['pay', 'Thanh toán'], ['vb', 'Văn bản phát sinh'], ['tl', 'Thanh lý']],
        { info: tInfo, dt: tDt, hm: tHm, tt: tTt, bd: tBd, td: tTd, bg: tBg, pay: tPay, vb: tVb, tl: tTl })}</div>`;
  }
  /* Nghiệm thu Đạt chưa có hồ sơ thanh toán → khởi tạo hồ sơ thanh toán (Backlog 491: lấy trực tiếp khối lượng đã nghiệm thu). */
  const payable = (h) => (h.acc || []).filter((a) => a[5] === 'Đạt' && !(h.pays || []).some((p) => p[2] === a[0]));
  function payDlg(code) {
    const h = hdOf(code), list = payable(h);
    let pick = list[0][0];
    const calc = () => { const a = list.find((x) => x[0] === pick), advLeft = r2(advOf(h) - advBack(h)), ded = r2(Math.min(advLeft, a[4] * (advOf(h) / h.value || 0))), pen = r2((h.penalty || []).filter((p) => p[3] !== 'Đã khấu trừ').reduce((s0, p) => s0 + p[1], 0));
      return { a, ded, pen, hold: r2(a[4] * 0.05) }; };
    const body = () => { const c = calc(); return `<div class="tb-grid2">
        <div class="vfield"><div class="lr"><label>Căn cứ nghiệm thu</label><span class="req">*</span></div>${vSelect({ id: 'pay-acc', value: pick, options: list.map((a) => ({ value: a[0], label: `${a[0]} — ${a[1]} (${ty(a[4], 2)} tỷ đồng)` })), onChange: (x) => { pick = x; m.el.querySelector('.vmodal-b').firstElementChild.outerHTML = body(); } })}</div>
        <div class="vfield"><div class="lr"><label>Giá trị đề nghị (tỷ đồng)</label></div><input class="vctl" value="${ty(c.a[4], 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Khấu trừ tạm ứng</label></div><input class="vctl" value="${ty(c.ded, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Khấu trừ phạt</label></div><input class="vctl" value="${ty(c.pen, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Giữ lại bảo hành (5%)</label></div><input class="vctl" value="${ty(c.hold, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Thanh toán ròng</label></div><input class="vctl" value="${ty(r2(c.a[4] - c.ded - c.pen - c.hold), 3)}" disabled></div></div>`; };
    const m = vModal({ title: 'Tạo hồ sơ thanh toán', size: 'w780', body: body(), actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="pay-ok">Lưu</button>' });
    m.el.querySelector('#pay-ok').onclick = () => {
      const c = calc(), a = U.add[code] = U.add[code] || {};
      const n = 300 + Object.values(U.add).reduce((s0, x) => s0 + (x.pays || []).length, 0);
      a.pays = (a.pays || []).concat([[`TT-2026-0${n}`, 'Thanh toán ' + c.a[1].toLowerCase(), c.a[0], c.a[4], c.ded, c.pen, c.hold, 'DRAFT', null]]);
      persist(); m.close();
      toast('<b>Thành công</b><br>Tạo hồ sơ thanh toán thành công');
      rerender();
    };
  }
  /* Phụ lục điều chỉnh (MS23.01): kiểm tra giá trị sau điều chỉnh không vượt giới hạn (Backlog 473). */
  function annexDlg(code) {
    const h = hdOf(code);
    const m = vModal({ title: 'Thêm phụ lục hợp đồng', size: 'w580', body: `
        <div class="vfield" id="ax-f1"><div class="lr"><label>Nội dung điều chỉnh</label><span class="req">*</span></div><textarea class="vctl ta" id="ax-c" rows="3" maxlength="1000" placeholder="Nhập nội dung điều chỉnh"></textarea><p class="msg" hidden>Bạn cần nhập Nội dung điều chỉnh.</p></div>
        <div class="tb-grid2"><div class="vfield" id="ax-f2"><div class="lr"><label>Giá trị điều chỉnh (tỷ đồng)</label></div><input class="vctl" id="ax-v" type="number" step="0.001" value="0"><p class="msg" hidden></p></div>
        <div class="vfield"><div class="lr"><label>Gia hạn (ngày)</label></div><input class="vctl" id="ax-d" type="number" min="0" value="0"></div></div>
        <p class="tb-hint">Giá trị hiện tại ${ty(h.value, 2)} tỷ đồng · giới hạn ${ty(h.cap, 2)} tỷ đồng (giá gói thầu / nguồn).</p>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="ax-ok">Lưu</button>' });
    m.el.querySelector('#ax-ok').onclick = () => {
      const c = m.el.querySelector('#ax-c').value.trim(), v = Number(m.el.querySelector('#ax-v').value || 0), d = Number(m.el.querySelector('#ax-d').value || 0);
      const f1 = m.el.querySelector('#ax-f1'), f2 = m.el.querySelector('#ax-f2');
      f1.classList.toggle('invalid', !c); f1.querySelector('.msg').hidden = !!c;
      const over = h.value + v > h.cap + 1e-9;
      f2.classList.toggle('invalid', over); f2.querySelector('.msg').hidden = !over;
      f2.querySelector('.msg').textContent = `Giá trị hợp đồng sau điều chỉnh ${ty(r2(h.value + v), 2)} tỷ đồng vượt giới hạn ${ty(h.cap, 2)} tỷ đồng.`;
      if (!c || over) return;
      const a = U.add[code] = U.add[code] || {};
      const no = `PL${String((h.docs || []).filter((x) => x[0] === 'Phụ lục hợp đồng').length + 1).padStart(2, '0')}/${(h.no || h.code).split('/')[0]}`;
      a.docs = (a.docs || []).concat([['Phụ lục hợp đồng', no, Flow.dateOf(Flow.state.clock), c + (d ? `; gia hạn ${d} ngày` : ''), v || null, 'Dự thảo']]);
      persist(); m.close();
      toast('<b>Thành công</b><br>Thêm phụ lục hợp đồng thành công');
      rerender();
    };
  }
  /* Nhập hợp đồng (vht-import-dialog 2 bước, như Nhập biểu mẫu). */
  function importDlg() {
    const rows = [['HĐ-2024-0233', 'Hợp đồng thuê kênh truyền dẫn phòng lab', 'NCC-000012', 1.8, ''], ['HĐ-2025-0055', 'Hợp đồng cung cấp tủ rack, PDU phòng máy chủ', 'NCC-000001', 2.6, ''],
      ['HĐ-2025-0187', 'Hợp đồng cung cấp máy phân tích phổ và máy phân tích mạng vector', 'NCC-000008', 45.6, 'Mã hợp đồng HĐ-2025-0187 đã tồn tại.']];
    const m = vModal({ title: 'Kết quả nhập dữ liệu', size: 'xl', body: `<div class="imp-res"><div class="imp-top"><span class="imp-sum">2/3 hợp đồng hợp lệ · tệp hop-dong-da-ky-2024-2025.xlsx</span></div>
        <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th><th class="c" style="min-width:110px">Kết quả</th><th style="min-width:220px">Nội dung lỗi</th><th style="min-width:140px">Mã hợp đồng</th><th style="min-width:300px">Tên hợp đồng</th><th style="min-width:240px">Nhà thầu</th><th class="r" style="min-width:140px">Giá trị (tỷ đồng)</th></tr></thead>
        <tbody>${rows.map((r, i) => `<tr><td class="ord">${i + 1}</td><td class="c">${r[4] ? badge('Lỗi', 'error') : badge('Hợp lệ', 'success')}</td><td>${r[4] ? `<span class="imp-err">${esc(r[4])}</span>` : K().dash}</td><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(nccName(r[2]))}</td><td class="r num">${ty(r[3], 2)}</td></tr>`).join('')}</tbody></table></div></div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-ok">Xác nhận nhập</button>' });
    m.el.querySelector('#imp-ok').onclick = () => {
      rows.filter((r) => !r[4] && !hdOf(r[0])).forEach((r) => U.hd.push({ code: r[0], src: 'IMPORT', pkgText: '-', khText: '-', originText: '-', title: r[1], ncc: r[2], type: 'TRON_GOI', form: 'CGTT', value: r[3], cap: r[3], cur: 'VND', vat: 10,
        unit: 'Trung tâm Phần mềm', owner: persona(Flow.state.persona).name, st: 'DONG', esign: false, no: r[0].replace('HĐ-', '') + '/HĐ-VHT', sign: '15/03/2025', eff: '15/03/2025', end: '15/12/2025', created: Flow.dateOf(Flow.state.clock), updated: Flow.dateOf(Flow.state.clock),
        exec: '9 tháng', items: [[r[1].replace(/^Hợp đồng /, ''), 'Gói', 1, r[3]]], ms: [], dl: [], acc: [], plan: [], pays: [], docs: [], liq: { cond: [['Đã thanh lý trước khi nhập hệ thống', true]], file: ['-', '-', 'Nhập từ dữ liệu cũ'], final: r[3], closed: '15/12/2025' } }));
      persist(); m.close();
      toast('<b>Thành công</b><br>Nhập hợp đồng thành công (2 hợp đồng)');
      rerender();
    };
  }

  /* ---------- SCR-87 Thỏa thuận khung & đơn hàng ---------- */
  /* P-81 (giả lập): đơn hàng tạo trên prototype lưu ở U.ord[mã khung], trạng thái đã chuyển ở U.ordSt[mã đơn]. */
  const ORD_ST = ['Chờ nhà thầu xác nhận', 'Đang giao', 'Đã giao đủ', 'Đã thanh toán'];
  const ordersOf = (f) => f.orders.concat((U.ord || {})[f.code] || []).map((o) => (U.ordSt && U.ordSt[o[0]] ? o.slice(0, 4).concat([U.ordSt[o[0]]]) : o));
  const ordBadge = (st) => badge(st, /Đã/.test(st) ? 'success' : /Chờ/.test(st) ? 'warning' : 'info');
  const called = (f) => r2(ordersOf(f).reduce((s0, o) => s0 + o[3], 0));
  const fwSt = (f) => (dk(f.to) < dk(TODAY) ? ['Hết hạn', 'default'] : days(TODAY, f.to) <= warnDays('fw') ? [`Sắp hết hạn (${days(TODAY, f.to)} ngày)`, 'warning'] : ['Đang hiệu lực', 'success']);
  function fwList() {
    // Theo: task-management (danh sách đối tượng cha)
    const k = K();
    return k.listPage({
      id: 'ttk', title: 'Danh sách thỏa thuận khung', ph: 'Tìm kiếm theo mã, tên thỏa thuận khung, nhà thầu',
      rows: () => FW.map((f) => Object.assign({}, f, { nccN: nccName(f.ncc) })), kwText: (f) => `${f.code} ${f.title} ${f.nccN}`,
      empty: () => ({ code: '', title: '', ncc: null }),
      match: (f, x) => k.has(x.code, f.code) && k.has(x.title, f.title) && (!x.ncc || f.ncc === x.ncc),
      adv: (txt, sel) => `${txt('code', 'Mã thỏa thuận khung')}${txt('title', 'Tên thỏa thuận khung')}${sel('ncc', 'Nhà thầu', { options: FW.map((f) => ({ value: f.ncc, label: nccName(f.ncc) })) })}`,
      cols: [['Trạng thái', 200, 'c'], ['Mã thỏa thuận khung', 160], ['Tên thỏa thuận khung', 320], ['Nhà thầu', 240], ['Giá trị khung (tỷ đồng)', 160, 'r'], ['Đã gọi (tỷ đồng)', 140, 'r'], ['Còn lại (tỷ đồng)', 140, 'r'], ['Thời hạn', 200]],
      href: (f) => 'thoa-thuan-khung/' + encodeURIComponent(f.code),
      cell: (f) => `<td class="c">${badge(...fwSt(f))}</td><td><a class="link" data-go="thoa-thuan-khung/${encodeURIComponent(f.code)}">${esc(f.code)}</a></td><td>${k.clamp(f.title)}</td><td>${k.clamp(f.nccN)}</td>
        <td class="r num">${m3(f.value)}</td><td class="r num">${m3(called(f))}</td><td class="r num">${m3(r2(f.value - called(f)))}</td><td class="num">${esc(f.from)} – ${esc(f.to)}</td>`,
      info: {
        scr: 'SCR-87', name: 'Thỏa thuận khung & đơn hàng', uc: 'Backlog W1_T10 › Thỏa thuận khung & Đơn hàng (dòng 465–469)',
        notes: ['Khuôn task-management. Thỏa thuận khung hình thành từ KQLCNT (Quy chế cho phép); đơn hàng là các lần gọi hàng trong phạm vi khung. BE chặn đơn hàng làm tổng giá trị đã gọi vượt giá trị khung.',
          `Cảnh báo sắp hết hạn trong ${warnDays('fw')} ngày (= số ngày "Trước hạn" của Trigger FRAMEWORK_EXPIRING — giả lập P-80).`,
          '<b>Giả lập P-81</b>: quy trình đơn hàng chưa có BPMN. Prototype đặt luồng 4 bước Chờ nhà thầu xác nhận → Đang giao → Đã giao đủ → Đã thanh toán, chuyển bước ở hộp thoại đơn hàng; đơn hàng là dòng của thỏa thuận khung, không phải hợp đồng con.'],
        q: ['P-81'], src: 'task-management/task-management.component · /task-management',
      },
    });
  }
  function fwDetail(code) {
    const k = K(), f = FW.find((x) => x.code === code);
    if (!f) return `<div class="pg">${head({ title: 'Xem chi tiết thỏa thuận khung', back: 'thoa-thuan-khung', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy thỏa thuận khung.')}</div>`;
    const c = called(f), left = r2(f.value - c);
    const info = { scr: 'SCR-87', name: 'Chi tiết thỏa thuận khung', uc: 'Backlog W1_T10 › Thỏa thuận khung & Đơn hàng (dòng 465–469)',
      notes: ['Khuôn task-create (detail). Bấm mã đơn hàng mở hộp thoại chi tiết (vht-modal). Giá trị đã gọi = tổng đơn hàng; còn lại = giá trị khung − đã gọi.'], q: ['P-81'], src: 'task-management/components/task-create (mode detail)' };
    return `<div class="pg">${head({ title: 'Xem chi tiết thỏa thuận khung', back: 'thoa-thuan-khung', lg: true, info })}
      ${k.card('Thông tin chung', `<div class="ginfo c3">${k.kv('Mã thỏa thuận khung', esc(f.code))}${k.kv('Tên thỏa thuận khung', esc(f.title), 'span2')}${k.kv('Nhà thầu', esc(nccName(f.ncc)))}${k.kv('Căn cứ', esc(f.basis), 'span2')}
        ${k.kv('Hiệu lực từ', esc(f.from))}${k.kv('Hiệu lực đến', esc(f.to))}${k.kv('Tình trạng', badge(...fwSt(f)))}${k.kv('Đơn vị quản lý', esc(f.unit))}</div>`)}
      ${k.card('Giá trị thỏa thuận khung', `<div class="ginfo c3">${k.kv('Giá trị khung', ty(f.value, 2) + ' tỷ đồng')}${k.kv('Đã gọi (tổng đơn hàng)', ty(c, 2) + ' tỷ đồng (' + Math.round(c / f.value * 100) + '%)')}${k.kv('Còn lại', ty(left, 2) + ' tỷ đồng')}</div>
        <div class="hd-bar" role="img" aria-label="Đã gọi ${Math.round(c / f.value * 100)}%"><span style="width:${Math.round(c / f.value * 100)}%"></span></div>`)}
      ${k.card('Danh sách đơn hàng', `${dk(f.to) >= dk(TODAY) ? `<div class="ord-act"><button class="vbtn primary" data-fw-new="${esc(f.code)}">Thêm đơn hàng</button></div>` : ''}${k.table([['Mã đơn hàng', 170], ['Ngày đặt', 120], ['Nội dung', 380], ['Giá trị (tỷ đồng)', 150, 'r'], ['Trạng thái', 200, 'c']], ordersOf(f),
        (o) => `<td><a class="link" href="#" data-fw-order="${esc(f.code)}|${esc(o[0])}">${esc(o[0])}</a></td><td class="num">${esc(o[1])}</td><td>${k.clamp(o[2])}</td><td class="r num">${ty(o[3], 2)}</td><td class="c">${ordBadge(o[4])}</td>`)}`, `${ordersOf(f).length} đơn hàng`)}</div>`;
  }
  function orderDlg(fc, oc) {
    const f = FW.find((x) => x.code === fc), o = ordersOf(f).find((x) => x[0] === oc), k = K();
    const i = ORD_ST.indexOf(o[4]), next = i >= 0 && i < ORD_ST.length - 1 ? ORD_ST[i + 1] : null;
    const steps = `<ol class="ord-steps">${ORD_ST.map((st, j) => `<li class="${i < 0 || j <= i ? 'done' : ''}${j === i ? ' cur' : ''}">${esc(st)}</li>`).join('')}</ol>`;
    const m = vModal({ title: 'Chi tiết đơn hàng ' + o[0], size: 'w580', body: `${steps}<div class="ginfo">${k.kv('Thỏa thuận khung', esc(f.code))}${k.kv('Nhà thầu', esc(nccName(f.ncc)))}${k.kv('Ngày đặt', esc(o[1]))}${k.kv('Giá trị', ty(o[3], 2) + ' tỷ đồng')}
      ${k.kv('Nội dung', esc(o[2]), 'full')}${k.kv('Trạng thái', ordBadge(o[4]))}${k.kv('Địa điểm giao', esc(f.unit))}</div>
      <p class="tb-hint">Luồng đơn hàng giả lập (P-81 — chưa có BPMN): Chờ nhà thầu xác nhận → Đang giao → Đã giao đủ → Đã thanh toán.</p>`,
      actions: `<button class="vbtn secondary" data-close>Đóng</button>${next ? `<button class="vbtn primary" id="ord-next">Chuyển: ${esc(next)}</button>` : ''}` });
    const b = m.el.querySelector('#ord-next');
    if (b) b.onclick = () => {
      U.ordSt = U.ordSt || {}; U.ordSt[o[0]] = next; persist(); m.close();
      toast(`<b>Thành công</b><br>Đơn hàng ${esc(o[0])} chuyển sang ${esc(next)}`);
      rerender();
    };
  }
  /* Thêm đơn hàng (P-81 giả lập): BE chặn tổng giá trị đã gọi vượt giá trị khung. */
  function orderNewDlg(fc) {
    const f = FW.find((x) => x.code === fc), left = r2(f.value - called(f));
    const m = vModal({ title: 'Thêm đơn hàng', size: 'w580', body: `
        <div class="vfield" id="od-f1"><div class="lr"><label>Nội dung đơn hàng</label><span class="req">*</span></div><textarea class="vctl ta" id="od-c" rows="3" maxlength="1000" placeholder="Nhập hàng hoá / dịch vụ gọi"></textarea><p class="msg" hidden>Bạn cần nhập Nội dung đơn hàng.</p></div>
        <div class="vfield" id="od-f2"><div class="lr"><label>Giá trị đơn hàng (tỷ đồng)</label><span class="req">*</span></div><input class="vctl" id="od-v" type="number" step="0.001" min="0" placeholder="Nhập giá trị"><p class="msg" hidden></p></div>
        <p class="tb-hint">Giá trị còn lại của thỏa thuận khung: ${ty(left, 2)} tỷ đồng.</p>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="od-ok">Lưu</button>' });
    m.el.querySelector('#od-ok').onclick = () => {
      const c = m.el.querySelector('#od-c').value.trim(), v = Number(m.el.querySelector('#od-v').value || 0);
      const f1 = m.el.querySelector('#od-f1'), f2 = m.el.querySelector('#od-f2');
      f1.classList.toggle('invalid', !c); f1.querySelector('.msg').hidden = !!c;
      const e2 = !(v > 0) ? 'Bạn cần nhập Giá trị đơn hàng.' : v > left + 1e-9 ? `Giá trị đơn hàng vượt giá trị còn lại ${ty(left, 2)} tỷ đồng của thỏa thuận khung.` : '';
      f2.classList.toggle('invalid', !!e2); f2.querySelector('.msg').hidden = !e2; f2.querySelector('.msg').textContent = e2;
      if (!c || e2) return;
      U.ord = U.ord || {};
      const list = U.ord[f.code] = U.ord[f.code] || [];
      const no = `ĐH-${f.code.slice(4)}-${String(ordersOf(f).length + 1).padStart(2, '0')}`;
      list.push([no, Flow.dateOf(Flow.state.clock), c, r2(v), ORD_ST[0]]);
      persist(); m.close();
      toast(`<b>Thành công</b><br>Thêm đơn hàng ${esc(no)} thành công`);
      rerender();
    };
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-hd-form]')) { e.preventDefault(); saveHd(); } });
  document.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-hd-import]')) { importDlg(); return; }
    const p = t.closest('[data-hd-pay]');
    if (p) { payDlg(p.dataset.hdPay); return; }
    const a = t.closest('[data-hd-annex]');
    if (a) { annexDlg(a.dataset.hdAnnex); return; }
    const nw = t.closest('[data-fw-new]');
    if (nw) { orderNewDlg(nw.dataset.fwNew); return; }
    const o = t.closest('[data-fw-order]');
    if (o) { e.preventDefault(); e.stopImmediatePropagation(); orderDlg(...o.dataset.fwOrder.split('|')); return; }
    const d = t.closest('[data-hd-del]');
    if (d) {
      e.stopImmediatePropagation();
      const h = hdOf(d.dataset.hdDel);
      const ok = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa hợp đồng', desc: `Bạn có chắc chắn muốn xóa ${h.title} - ${h.code} không? Thao tác này không thể hoàn tác.`, hl: h.title, cancel: 'Hủy', ok: 'Xóa' });
      if (!ok) return;
      U.hd = U.hd.filter((x) => x.code !== h.code); persist();
      toast('<b>Thành công</b><br>Xóa hợp đồng thành công');
      rerender();
    }
  }, true);

  function route(parts) {
    const [a, b] = parts;
    if (a === 'thoa-thuan-khung') return b ? fwDetail(decodeURIComponent(b)) : fwList();
    return b === 'create' ? hdForm() : b ? hdDetail(decodeURIComponent(b)) : hdList();
  }
  function enter(parts) { if (parts[0] === 'hop-dong' && parts[1] === 'create') resetForm(parts[2] && decodeURIComponent(parts[2])); }
  function reset() { U = { hd: [], add: {}, ord: {}, ordSt: {} }; persist(); }
  /* Cho Tổng quan / Báo cáo (S4: cùng một nguồn dữ liệu). */
  window.HopDong = { route, enter, reset, byPkg, all, eff, prog, paidSum, remain, advOf, accSum, lateMs, guarWarn, doneRate, HD_ST, FW, called, ordersOf, hdSoon, warnDays, TODAY, days, dk };
})();
