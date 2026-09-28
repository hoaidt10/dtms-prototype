/*
 * Dữ liệu tĩnh của prototype ĐTMS.
 * Nguồn: docs/dtms/prototype-MS01-chuan-bi.md (persona §2.2, hồ sơ mẫu §2.3, cảnh §2.4, màn §4, điểm ❓ §6),
 *        docs/dtms/use-case-dtms.md (menu theo 13 phân hệ), BPMN chuẩn ĐTMS.drawio / MS01 v1.1 (61 task, xem bpmn-tasks.js).
 * Tên người, đơn vị, nhà cung cấp đều hư cấu.
 */
(function () {
  const D = {};

  D.product = { code: 'ĐTMS', name: 'Hệ thống Đầu tư mua sắm' };

  /* ---------- Persona (§2.2) ---------- */
  D.personas = [
    { id: 'minh', name: 'Nguyễn Văn Minh', short: 'Minh', role: 'Chuyên quản ĐVĐX', unit: 'Trung tâm Vô tuyến', urd: 'R-DVDX-CQ', actor: 'A01' },
    { id: 'hai', name: 'Trần Đức Hải', short: 'Hải', role: 'Chỉ huy ĐVĐX', unit: 'Giám đốc Trung tâm Vô tuyến', urd: 'R-DVDX-CH', actor: 'A02' },
    { id: 'lan', name: 'Phạm Thị Lan', short: 'Lan', role: 'Chuyên viên TTMS', unit: 'Trung tâm Mua sắm', urd: 'R-TTMS', actor: 'A04' },
    { id: 'hoa', name: 'Lê Thanh Hòa', short: 'Hòa', role: 'Chuyên viên CQCM', unit: 'Ban Pháp chế', urd: 'R-CQCM', actor: 'A03' },
    { id: 'tung', name: 'Đỗ Mạnh Tùng', short: 'Tùng', role: 'Trưởng ban CQCM', unit: 'Ban Pháp chế', urd: 'R-CQCM-CH', actor: 'A03' },
    { id: 'thu', name: 'Vũ Hoài Thu', short: 'Thu', role: 'Chuyên viên Tài chính (CQCM)', unit: 'Ban Tài chính', urd: 'R-TC', actor: 'A05' },
    { id: 'quang', name: 'Bùi Minh Quang', short: 'Quang', role: 'Chuyên viên CQCM', unit: 'Phòng Chất lượng', urd: 'R-CQCM', actor: 'A03' },
    { id: 'binh', name: 'Hoàng Quốc Bình', short: 'Bình', role: 'Phó Tổng Giám đốc', unit: 'Ban Giám đốc', urd: 'R-PTGD', actor: 'A22' },
    { id: 'tgd', name: 'Ngô Đình Khôi', short: 'TGĐ Khôi', role: 'Tổng Giám đốc VHT', unit: 'Ban Giám đốc', urd: 'R-TGD-VHT', actor: 'A06' },
    { id: 'qt', name: 'Đặng Thu Trang', short: 'Trang', role: 'Quản trị hệ thống', unit: 'Ban Công nghệ thông tin', urd: 'R-QTHT', actor: 'A21' },
    { id: 'td', name: 'Ban ĐTXD Tập đoàn', short: 'Tập đoàn', role: 'Ban ĐTXD + TGĐ Tập đoàn (giả lập)', unit: 'Tập đoàn — không đăng nhập thật', urd: 'R-BAN-DTXD, R-TGD-TD', actor: 'A08', simulated: true },
  ];

  /* CQCM tham gia góp ý hồ sơ mẫu. `doer` làm task 16/33/34/42, `signer` thông qua ở task 17. */
  D.cqcm = [
    { id: 'PC', unit: 'Ban Pháp chế', doer: 'hoa', signer: 'tung' },
    { id: 'TC', unit: 'Ban Tài chính', doer: 'thu', signer: 'thu' },
    { id: 'CL', unit: 'Phòng Chất lượng', doer: 'quang', signer: 'quang' },
  ];

  /* ---------- 5 giai đoạn theo nhãn trang MS01 v1.1 (dải task do nhóm suy ra từ vị trí trên sơ đồ) ---------- */
  D.stages = [
    { id: 1, name: 'Căn cứ • Tồn kho • Báo giá • Dự thảo', from: 1, to: 18, status: 'Đang lập dự thảo' },
    { id: 2, name: 'Góp ý CQCM • BM-04', from: 19, to: 25, status: 'Đang góp ý CQCM' },
    { id: 3, name: 'Hoàn chỉnh • Giải trình • Họp', from: 26, to: 34, status: 'Đang hoàn chỉnh & giải trình' },
    { id: 4, name: 'Rà soát lại • Checklist • BM-09 / BM-05', from: 35, to: 47, status: 'Đang thẩm định BM-05' },
    { id: 5, name: 'Báo cáo Tập đoàn • Quyết định phê duyệt', from: 48, to: 61, status: 'Báo cáo TĐ & phê duyệt' },
  ];
  /* Task của quy trình khác — hồ sơ không đi qua; timeline hiện "Không áp dụng". */
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  D.notApplicable = { 'MS01.01': [11, 38, 39, 40], 'MS01.02': [11, 38, 39, 40], 'MS01.03': [12].concat(range(41, 59)) };

  /* Quy trình người dùng chọn khi tạo ĐXMS (SCR-25, chốt 2026-09-28). Khoảng giá trị lấy từ Ngưỡng phân luồng (D.dxmsRules);
     basis = phần điều kiện về căn cứ; basisGroup = căn cứ hiện ở task 1 (true: đã được CT/TGĐ TĐ duyệt, false: chưa, null: mọi loại).
     name là tên process definition trong BPMN, không đổi theo ngưỡng. */
  D.processes = {
    'MS01.01': { name: 'Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ chưa được CT/TGĐ Tập đoàn phê duyệt', basis: 'căn cứ chưa được CT/TGĐ TĐ duyệt', basisGroup: false },
    'MS01.02': { name: 'Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ đã được CT/TGĐ Tập đoàn phê duyệt', basis: 'căn cứ đã được CT/TGĐ TĐ duyệt (không gồm Kế hoạch SXKD năm)', basisGroup: true, noTypes: ['khsx'],
      pending: 'Hồ sơ mẫu MS01.02 (ĐXMS-2026-0124) dựng ở đợt T6' },
    'MS01.03': { name: 'Phê duyệt ĐXMS < 160 tỷ', basis: 'mọi loại căn cứ', basisGroup: null },
  };
  /* Ngưỡng phân luồng ĐXMS: [từ, đến dưới) tỷ đồng → quy trình. Mặc định = 2 dòng ĐXMS của SCR-40 (§5.3); catalog.js thay bằng
     các ngưỡng đang hoạt động, đã có hiệu lực ở ngày `date`. Hồ sơ giữ bản chụp lúc tạo (P-34, Flow vars.th). */
  D.dxmsRules = () => [{ from: 0, to: 160, procs: ['MS01.03'] }, { from: 160, to: null, procs: ['MS01.01', 'MS01.02'] }];
  const tyNum = (n) => n.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  D.inRange = (process, total, rules) => rules.some((r) => r.procs.includes(process) && total >= r.from && (r.to == null || total < r.to));
  D.rangeText = (process, rules) => {
    const rs = rules.filter((r) => r.procs.includes(process));
    if (!rs.length) return 'chưa có ngưỡng';
    return rs.map((r) => (r.to == null ? `≥ ${tyNum(r.from)} tỷ` : r.from === 0 ? `< ${tyNum(r.to)} tỷ` : `${tyNum(r.from)} – dưới ${tyNum(r.to)} tỷ`)).join(' hoặc ');
  };
  /* Điều kiện hiển thị của quy trình (nhãn ở SCR-25, task 01, cổng kiểm tra khớp). */
  D.procCond = (process, rules) => `${D.rangeText(process, rules)} · ${(D.processes[process] || {}).basis || ''}`;
  /* Căn cứ hiện ở task 1 theo quy trình đã chọn. */
  D.basisFits = (process, doc) => {
    const p = D.processes[process];
    if (!p) return true;
    return (p.basisGroup == null || doc.group === p.basisGroup) && !(p.noTypes || []).includes(doc.type);
  };
  /* Mã hồ sơ: [0] sinh khi Lưu ở SCR-25, [1] hồ sơ mới tạo ở task 10b khi chuyển quy trình. */
  D.caseCodes = ['ĐXMS-2026-0117', 'ĐXMS-2026-0125'];

  /*
   * Điều hướng 61 task theo BPMN chuẩn ĐTMS.drawio / MS01 v1.1. Tên, actor, biểu mẫu lấy ở BPMN_TASKS; ở đây chỉ có phần prototype cần thêm:
   *  who     — persona xử lý ('cqcm:doer' | 'cqcm:signer' = theo CQCM của token)
   *  scr     — màn hình trong danh sách §4
   *  next    — task kế tiếp; choices — các nút hành động (main = nhánh chính của kịch bản demo;
   *            mainWhen(vars) = nhánh chính tuỳ trạng thái, dùng khi cùng một task được làm nhiều lần)
   *  fork    — tách token song song (also = thêm token khác vào cùng nhóm); join — chờ đủ token của nhóm
   *  gw      — cổng (không phải task BPMN): varGate / roundGate chọn nhánh; matchGate = cổng "Giá trị khớp quy trình đã chọn?"
 *  moves   — task hệ thống 10b: ghi hồ sơ mới (mã, quy trình đúng) trước khi kết thúc END_MOVED
   *  round   — task hệ thống tăng bộ đếm vòng giải trình
   *  sign    — hành động mở hộp thoại trình ký SCR-21; reason — bắt buộc nhập lý do
   *  nlv     — số ngày làm việc giả lập tiêu tốn (dùng cho KPI)
   */
  const F = {
    1: { who: 'minh', scr: 'SCR-03', next: 2, nlv: 0.5 },
    2: { next: 3 },
    3: { next: 4 },
    4: { who: 'minh', scr: 'SCR-04', next: 5, nlv: 0.5 },
    5: { who: 'minh', scr: 'SCR-05', nlv: 1, choices: [
      { label: 'Xác nhận danh mục', to: 6, main: true, set: { basisOk: true } },
      { label: 'Thiếu thông tin căn cứ', to: 6, kind: 'secondary', set: { basisOk: false } }] },
    6: { varGate: { basisOk: { true: 7, false: 4 } } },
    7: { who: 'minh', scr: 'SCR-06', next: 8, nlv: 1 },
    8: { who: 'minh', scr: 'SCR-07', next: 9, nlv: 0.5 },
    9: { next: 10 },
    10: { who: 'minh', scr: 'SCR-07', nlv: 3, choices: [
      { label: 'Báo giá đạt', to: 'gValue', main: true },
      { label: 'Không đạt — gửi lại YCBG', to: 9, kind: 'secondary' }] },
    /* Cổng "Giá trị khớp quy trình đã chọn?" (thay cổng "Giá trị?" của v1.1): khớp .01/.02 → 12, khớp .03 → 11, không khớp → 10a. */
    gValue: { gw: true, matchGate: { big: 12, small: 11, miss: '10a' } },
    '10a': { who: 'minh', scr: 'SCR-26', nlv: 0.5, q: ['P-26'], choices: [
      { label: 'Chuyển quy trình', to: '10b', main: true, reason: true },
      { label: 'Sửa lại', to: 10, kind: 'secondary', reason: true }] },
    '10b': { moves: true, next: 'END_MOVED' },
    11: { who: 'minh', scr: 'SCR-08', next: 13, nlv: 2, actionLabel: 'Gửi chỉ huy duyệt' },
    12: { who: 'minh', scr: 'SCR-08', next: 13, nlv: 2, actionLabel: 'Gửi chỉ huy duyệt' },
    13: { who: 'hai', scr: 'SCR-09', nlv: 0.5, choices: [
      { label: 'Đồng ý', to: 15, main: true },
      { label: 'Không đồng ý', to: 14, kind: 'danger', reason: true }] },
    14: { varGate: { big: { true: 12, false: 11 } } },
    15: { next: 16 },
    16: { who: 'minh', scr: 'SCR-10', next: 17, nlv: 0.5, actionLabel: 'Gửi TTMS xác nhận danh sách CQCM' },
    17: { who: 'lan', scr: 'SCR-22', nlv: 0.5, choices: [
      { label: 'Danh sách đúng, đủ — gửi yêu cầu thẩm định', to: 18, main: true, sign: 'BM-03' },
      { label: 'Chưa đúng/đủ — trả lại', to: 16, kind: 'danger', reason: true }] },
    18: { fork: 'cqcm', to: 19, kpiStart: true },
    19: { who: 'cqcm:doer', scr: 'SCR-11', next: 20, nlv: 1, actionLabel: 'Hoàn thành phiếu, trình chỉ huy' },
    20: { who: 'cqcm:signer', scr: 'SCR-11', nlv: 0.5, choices: [
      { label: 'Đồng ý & trình ký BM-04', to: 22, main: true, sign: 'BM-04' },
      { label: 'Không đồng ý', to: 21, kind: 'danger', reason: true }] },
    21: { next: 19 },
    22: { next: 23 },
    23: { join: 'cqcm', next: 24 },
    24: { next: 25 },
    25: { next: 26 },
    26: { who: 'minh', scr: 'SCR-12', nlv: 0.5, choices: [
      { label: 'Có ý kiến không đồng ý — lập giải trình', to: 28, mainWhen: (v) => v.round === 0 },
      { label: 'Đồng ý sửa theo ý kiến CQCM', to: 27, kind: 'secondary', mainWhen: (v) => v.round > 0 }] },
    27: { who: 'minh', scr: 'SCR-13', nlv: 1, next: 'fork35', actionLabel: 'Gửi hồ sơ hoàn chỉnh cho CQCM' },
    28: { who: 'minh', scr: 'SCR-13', next: 29, nlv: 0.5, actionLabel: 'Gửi giải trình' },
    29: { round: true, next: 'gRound' },
    gRound: { gw: true, roundGate: { over: 30, under: 13 } },
    30: { next: 31 },
    31: { who: 'lan', scr: 'SCR-14', next: 32, nlv: 1, actionLabel: 'Đã tổ chức họp' },
    32: { who: 'lan', scr: 'SCR-14', nlv: 0.5, choices: [
      { label: 'Đã thống nhất', to: 27, main: true },
      { label: 'Chưa thống nhất — trình cấp cao hơn', to: 33, kind: 'secondary' }] },
    33: { who: 'lan', scr: 'SCR-14', next: 34, nlv: 0.25 },
    34: { who: 'tgd', scr: 'SCR-14', nlv: 1, choices: [
      { label: 'Thống nhất phương án', to: 27, main: true, reason: true },
      { label: 'Yêu cầu xử lý lại', to: 14, kind: 'secondary', reason: true }] },
    fork35: { gw: true, fork: 'cqcm', to: 35 },
    35: { who: 'cqcm:doer', scr: 'SCR-15', nlv: 0.5, choices: [
      { label: 'Đạt', to: 36, main: true },
      { label: 'Chưa đạt', to: 27, kind: 'danger', reason: true, cancelGroup: true }] },
    36: { who: 'cqcm:doer', scr: 'SCR-15', nlv: 0.25, choices: [
      { label: 'Xác nhận ký BM-04 & Checklist 01', to: 37, main: true, sign: 'BM-04 + Checklist 01' }] },
    37: { join: 'cqcm', varGate: { big: { true: 41, false: 'fork38' } } },
    /* Nhánh < 160 tỷ (MS01.03) — chưa dựng màn chi tiết trong đợt này. */
    fork38: { gw: true, forkTo: [{ task: 38, who: 'lan' }, { task: 39, who: 'binh' }], group: 'bm09' },
    38: { who: 'lan', scr: 'SCR-23', nlv: 1, choices: [
      { label: 'Ký thẩm định BM-09', to: 40, main: true, sign: 'BM-09' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    39: { who: 'binh', scr: 'SCR-23', nlv: 1, choices: [
      { label: 'Ký thẩm định BM-09', to: 40, main: true, sign: 'BM-09' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    40: { join: 'bm09', next: 60 },
    41: { next: 42 },
    42: { who: 'lan', scr: 'SCR-16', nlv: 0.75, choices: [
      { label: 'Hoàn tất rà soát BM-05', to: 43, main: true },
      { label: 'Hồ sơ chưa đạt — trả đơn vị', to: 25, kind: 'danger', reason: true }] },
    43: { who: 'lan', scr: 'SCR-16', nlv: 0.25, q: ['P-10'], choices: [
      { label: 'Xác nhận đủ điều kiện & ký BM-05 (TTMS)', to: 44, main: true, sign: 'BM-05' }] },
    44: { next: 45 },
    45: { fork: 'cqcm', to: 46, also: [{ task: 47, who: 'binh' }] },
    46: { who: 'cqcm:doer', scr: 'SCR-17', nlv: 0.5, choices: [
      { label: 'Ký BM-05', to: 'j47', main: true, sign: 'BM-05' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    47: { who: 'binh', scr: 'SCR-17', nlv: 0.5, choices: [
      { label: 'Đồng ý, ký BM-05', to: 'j47', main: true, sign: 'BM-05' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    j47: { gw: true, join: 'cqcm', next: 48 },
    48: { who: 'lan', scr: 'SCR-16', nlv: 0.25, choices: [
      { label: 'Có báo cáo TGĐ Tập đoàn', to: 'gReport', main: true, set: { reportTD: true } },
      { label: 'Không báo cáo TGĐ Tập đoàn', to: 'gReport', kind: 'secondary', set: { reportTD: false } }] },
    gReport: { gw: true, varGate: { reportTD: { true: 49, false: 57 } } },
    49: { next: 50 },
    50: { who: 'lan', scr: 'SCR-18', next: 51, nlv: 0.5 },
    51: { who: 'tgd', scr: 'SCR-18', nlv: 0.5, choices: [
      { label: 'Đồng ý trình ký BM-06', to: 52, main: true, sign: 'BM-06' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true }] },
    52: { next: 53 },
    53: { who: 'td', scr: 'SCR-18', nlv: 1.5, choices: [
      { label: 'Chấp nhận hồ sơ, lập BM-07', to: 54, main: true },
      { label: 'Trả lại', to: 25, kind: 'danger', reason: true }] },
    54: { who: 'td', scr: 'SCR-18', next: 55, nlv: 0.5 },
    55: { who: 'td', scr: 'SCR-18', next: 56, nlv: 0.25 },
    56: { who: 'td', scr: 'SCR-18', nlv: 1.5, q: ['P-13'], choices: [
      { label: 'TGĐ Tập đoàn đồng ý', to: 57, main: true },
      { label: 'Trả lại', to: 25, kind: 'danger', reason: true }] },
    57: { next: 58 },
    58: { who: 'lan', scr: 'SCR-19', next: 59, nlv: 0.5 },
    59: { who: 'lan', scr: 'SCR-19', nlv: 0.25, choices: [{ label: 'Trình phê duyệt', to: 60, main: true }] },
    60: { who: 'tgd', scr: 'SCR-19', nlv: 1, kpiEnd: true, choices: [
      { label: 'Phê duyệt', to: 61, main: true, sign: 'BM-08' },
      { label: 'Yêu cầu hoàn chỉnh', to: 25, kind: 'secondary', reason: true },
      { label: 'Chỉ đạo khác — kết thúc', to: 'END_OTHER', kind: 'danger', reason: true }] },
    61: { next: 'END' },
  };
  D.flow = F;

  /* Cảnh demo §2.4: task bắt đầu của mỗi cảnh (dùng cho "Nhảy tới cảnh"). */
  D.scenes = [
    { n: 1, name: 'Tạo mới, chọn quy trình, khởi tạo', start: 'NEW', tasks: '—, 01–07', who: 'minh' },
    { n: 2, name: 'Báo giá', start: 8, tasks: '08–10', who: 'minh' },
    { n: 3, name: 'Dự thảo, chọn CQCM', start: 12, tasks: '12–18', who: 'minh' },
    { n: 4, name: 'Góp ý BM-04', start: 19, tasks: '19–25', who: 'hoa' },
    { n: 5, name: 'Giải trình, hoàn chỉnh, ký lại', start: 26, tasks: '26–37', who: 'minh' },
    { n: 6, name: 'BM-05', start: 42, tasks: '41–48', who: 'lan' },
    { n: 7, name: 'Nhánh Tập đoàn', start: 50, tasks: '49–56', who: 'lan' },
    { n: 8, name: 'Phê duyệt', start: 58, tasks: '57–61', who: 'lan' },
    { n: 9, name: 'Tổng kết', start: 'END', tasks: '—', who: 'lan' },
  ];

  /* Màn hình §4 — tên, và bước dựng chi tiết trong lộ trình T5. */
  D.screens = {
    'SCR-00': { name: 'Chọn vai demo', step: 1 }, 'SCR-01': { name: 'Việc của tôi', step: 1 },
    'SCR-02': { name: 'Danh sách ĐXMS', step: 1 }, 'SCR-03': { name: 'Chọn căn cứ', step: 2 },
    'SCR-04': { name: 'Thông tin cơ bản', step: 2 }, 'SCR-05': { name: 'Bóc tách danh mục', step: 2 },
    'SCR-06': { name: 'Kết quả rà soát tồn kho', step: 2 }, 'SCR-07': { name: 'YCBG & báo giá', step: 2 },
    'SCR-08': { name: 'Soạn hồ sơ ĐXMS', step: 2 }, 'SCR-09': { name: 'Duyệt dự thảo cấp đơn vị', step: 2 },
    'SCR-10': { name: 'Phiếu yêu cầu thẩm định & chọn CQCM', step: 2 }, 'SCR-11': { name: 'Phiếu nhận xét BM-04', step: 3 },
    'SCR-12': { name: 'Tổng hợp ý kiến', step: 3 }, 'SCR-13': { name: 'Hoàn chỉnh & giải trình', step: 3 },
    'SCR-14': { name: 'Xét giải trình, họp', step: 3 }, 'SCR-15': { name: 'Kiểm tra lại & ký Checklist 01', step: 3 },
    'SCR-16': { name: 'BM-05 & kiểm tra song song', step: 3 }, 'SCR-17': { name: 'Ký BM-05', step: 3 },
    'SCR-18': { name: 'Báo cáo Tập đoàn', step: 4 }, 'SCR-19': { name: 'Quyết định phê duyệt BM-08', step: 4 },
    'SCR-20': { name: 'Chi tiết hồ sơ', step: 1 }, 'SCR-21': { name: 'Hộp thoại trình ký', step: 1 },
    'SCR-22': { name: 'Xác nhận danh sách CQCM', step: 6 },
    'SCR-23': { name: 'Ký thẩm định trực tiếp BM-09 (MS01.03 — chưa dựng)', step: 7 },
    'SCR-25': { name: 'Tạo mới ĐXMS', step: 6 }, 'SCR-26': { name: 'Xử lý ĐXMS không khớp quy trình', step: 6 },
  };

  /* ---------- Hồ sơ mẫu §2.3 ---------- */
  /* Mã hồ sơ và quy trình do instance quyết định (Flow.ci()); ở đây là dữ liệu mẫu. */
  D.caseInfo = {
    title: 'Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2',
    unit: 'Trung tâm Vô tuyến',
    basis: 'QĐ phê duyệt nhiệm vụ KHCN "Phát triển trạm gNodeB thế hệ 2" (nguồn eBOM)',
    basisApprovedByGroup: false,
    purpose: 'Triển khai hoạt động KHCN',
    secret: false,
    priority: 'Khẩn',
    fund: 'Vốn KHCN, năm 2027',
    period: '01/2027 – 09/2027',
    total: 182.9,
  };
  D.items = [
    { n: 1, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 24, used: 4, prop: 20, stock: 0, buy: 20, price: 3.2, amount: 64, group: 1, goods: 'VTCNTT' },
    { n: 2, name: 'Máy phát tín hiệu vector', uom: 'Bộ', bom: 20, used: 0, prop: 20, stock: 0, buy: 20, price: 2.1, amount: 42, group: 1, goods: 'VTCNTT' },
    { n: 3, name: 'Hệ thống buồng đo OTA', uom: 'Hệ thống', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 28, amount: 56, group: 2, goods: 'NCSX' },
    { n: 4, name: 'Bộ kit hiệu chuẩn', uom: 'Bộ', bom: 40, used: 0, prop: 40, stock: 6, stockNote: '8 tồn, 2 đang giữ cho ĐXMS-2026-0098', buy: 34, price: 0.35, amount: 11.9, group: 1, goods: 'VTCNTT' },
    { n: 5, name: 'Dịch vụ đào tạo, chuyển giao', uom: 'Gói', bom: null, used: null, prop: 1, stock: null, buy: 1, price: 9, amount: 9, group: 1, goods: 'DVPTV', warn: 'Hạng mục không có trong dự toán/eBOM' },
  ];

  /* Hồ sơ khác trong Danh sách ĐXMS: không chạy luồng, mở được chi tiết ở trạng thái của nó (rule A5).
     st: processing | done | moved | stopped — ánh xạ sang nhãn/badge ở Screens.CASE_STATUS; task = số task BPMN đang chờ (step = tên task).
     late: quá hạn xử lý bước hiện tại (Giám sát tiến trình SCR-48 hiện Quá hạn). */
  D.otherCases = [
    { code: 'ĐXMS-2026-0121', title: 'Mua sắm máy chủ phục vụ phòng lab AI', unit: 'Trung tâm Phần mềm', total: 12.4, flow: 'MS01.03', st: 'processing', task: 4, step: 'Rà soát và xác nhận thông tin cơ bản', priority: 'Thường', created: '22/09/2026', updated: '26/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'ĐXMS-2026-0098', title: 'Mua sắm linh kiện RF cho mẫu thử nghiệm', unit: 'Trung tâm Vô tuyến', total: 45.2, flow: 'MS01.03', st: 'processing', task: 19, step: 'Rà soát, hoàn thiện BM-04', priority: 'Thường', created: '02/09/2026', updated: '24/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'ĐXMS-2026-0110', title: 'Mua sắm bộ đàm chuyên dụng cho đội thử nghiệm hiện trường', unit: 'Trung tâm Vô tuyến', total: 6.8, flow: 'MS01.03', st: 'processing', task: 16, step: 'Lập phiếu yêu cầu thẩm định và chọn CQCM', priority: 'Khẩn', created: '15/09/2026', updated: '23/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'ĐXMS-2026-0106', title: 'Mua sắm phần mềm thiết kế mạch in và mô phỏng tín hiệu', unit: 'Trung tâm Thiết kế vi mạch', total: 21.3, flow: 'MS01.03', st: 'processing', task: 27, step: 'Hoàn chỉnh hồ sơ trình ĐXMS', priority: 'Thường', created: '10/09/2026', updated: '22/09/2026', creator: 'Trịnh Quốc Việt' },
    { code: 'ĐXMS-2026-0103', title: 'Mua sắm hệ thống mô phỏng mạng lõi 5G', unit: 'Trung tâm Mạng lõi', total: 210.5, flow: 'MS01.02', st: 'done', step: '', priority: 'Thường', created: '28/07/2026', updated: '19/09/2026', creator: 'Đặng Thu Trang' },
    { code: 'ĐXMS-2026-0101', title: 'Mua sắm thiết bị đo kiểm tương thích điện từ (EMC)', unit: 'Phòng Chất lượng', total: 168.0, flow: 'MS01.01', st: 'processing', task: 53, late: true, step: 'Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn', priority: 'Khẩn', created: '21/07/2026', updated: '18/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'ĐXMS-2026-0095', title: 'Mua sắm vật tư tiêu hao cho xưởng sản xuất thử', unit: 'Nhà máy sản xuất thử nghiệm', total: 3.9, flow: 'MS01.03', st: 'stopped', step: '', priority: 'Thường', created: '12/08/2026', updated: '11/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'ĐXMS-2026-0089', title: 'Mua sắm thiết bị thử nghiệm môi trường', unit: 'Phòng Chất lượng', total: 18.7, flow: 'MS01.03', st: 'done', step: '', priority: 'Thượng khẩn', created: '04/08/2026', updated: '05/09/2026', creator: 'Bùi Minh Quang', secret: true },
    { code: 'ĐXMS-2026-0084', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', unit: 'Trung tâm Phần mềm', total: 9.6, flow: 'MS01.03', st: 'done', step: '', priority: 'Thường', created: '20/07/2026', updated: '28/08/2026', creator: 'Lương Thị Hạnh' },
    { code: 'ĐXMS-2026-0077', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', unit: 'Nhà máy sản xuất thử nghiệm', total: 236.4, flow: 'MS01.01', st: 'done', step: '', priority: 'Khẩn', created: '02/06/2026', updated: '14/08/2026', creator: 'Phan Văn Lộc' },
    { code: 'ĐXMS-2026-0074', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', unit: 'Trung tâm Vô tuyến', total: 152.0, flow: 'MS01.03', st: 'done', step: '', priority: 'Thường', created: '01/07/2026', updated: '08/08/2026', creator: 'Nguyễn Văn Minh', replaces: 'ĐXMS-2026-0072' },
    { code: 'ĐXMS-2026-0072', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', unit: 'Trung tâm Vô tuyến', total: 152.0, flow: 'MS01.01', st: 'moved', step: '', priority: 'Thường', created: '25/05/2026', updated: '30/06/2026', creator: 'Nguyễn Văn Minh', replacedBy: 'ĐXMS-2026-0074' },
  ];

  /* Việc đã xử lý trên hồ sơ mẫu (SCR-01 Việc của tôi) — mới nhất trước. Mở ra chi tiết hồ sơ ở chế độ xem. */
  D.sampleTasks = [
    { who: 'minh', code: 'ĐXMS-2026-0098', task: 28, created: '18/09/2026', due: '22/09/2026', done: '21/09/2026' },
    { who: 'minh', code: 'ĐXMS-2026-0110', task: 8, created: '17/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'minh', code: 'ĐXMS-2026-0110', task: 4, created: '15/09/2026', due: '17/09/2026', done: '16/09/2026' },
    { who: 'minh', code: 'ĐXMS-2026-0098', task: 16, created: '04/09/2026', due: '08/09/2026', done: '05/09/2026' },
    { who: 'minh', code: 'ĐXMS-2026-0074', task: 26, created: '22/07/2026', due: '24/07/2026', done: '24/07/2026' },
    { who: 'hai', code: 'ĐXMS-2026-0110', task: 13, created: '19/09/2026', due: '23/09/2026', done: '22/09/2026' },
    { who: 'hai', code: 'ĐXMS-2026-0098', task: 13, created: '03/09/2026', due: '05/09/2026', done: '04/09/2026' },
    { who: 'hai', code: 'ĐXMS-2026-0074', task: 13, created: '06/07/2026', due: '08/07/2026', done: '07/07/2026' },
    { who: 'lan', code: 'ĐXMS-2026-0098', task: 17, created: '08/09/2026', due: '10/09/2026', done: '09/09/2026' },
    { who: 'lan', code: 'ĐXMS-2026-0101', task: 48, created: '09/09/2026', due: '11/09/2026', done: '11/09/2026' },
    { who: 'lan', code: 'ĐXMS-2026-0103', task: 58, created: '12/09/2026', due: '15/09/2026', done: '15/09/2026' },
    { who: 'lan', code: 'ĐXMS-2026-0077', task: 17, created: '16/06/2026', due: '18/06/2026', done: '17/06/2026' },
    { who: 'hoa', code: 'ĐXMS-2026-0098', task: 19, created: '10/09/2026', due: '15/09/2026', done: '14/09/2026' },
    { who: 'hoa', code: 'ĐXMS-2026-0101', task: 19, created: '05/08/2026', due: '10/08/2026', done: '12/08/2026' },
    { who: 'tung', code: 'ĐXMS-2026-0098', task: 20, created: '14/09/2026', due: '16/09/2026', done: '15/09/2026' },
    { who: 'thu', code: 'ĐXMS-2026-0098', task: 19, created: '10/09/2026', due: '15/09/2026', done: '15/09/2026' },
    { who: 'quang', code: 'ĐXMS-2026-0101', task: 10, created: '28/07/2026', due: '31/07/2026', done: '30/07/2026' },
    { who: 'binh', code: 'ĐXMS-2026-0103', task: 47, created: '02/09/2026', due: '04/09/2026', done: '03/09/2026' },
    { who: 'binh', code: 'ĐXMS-2026-0077', task: 47, created: '24/07/2026', due: '28/07/2026', done: '27/07/2026' },
    { who: 'tgd', code: 'ĐXMS-2026-0103', task: 60, created: '16/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'tgd', code: 'ĐXMS-2026-0077', task: 60, created: '10/08/2026', due: '13/08/2026', done: '13/08/2026' },
    { who: 'tgd', code: 'ĐXMS-2026-0074', task: 60, created: '04/08/2026', due: '07/08/2026', done: '06/08/2026' },
  ];

  /* ---------- Điểm chưa chốt §6 ---------- */
  D.openPoints = {
    'P-01': { q: 'Danh sách loại căn cứ và mapping dữ liệu, API eBOM/mBOM', src: 'UR-PRE-01, 02', def: '5 loại theo CL01; dữ liệu giả', scr: 'SCR-03' },
    'P-02': { q: 'Danh mục mức ưu tiên và ảnh hưởng tới SLA', src: 'AMB-06, UR-COM-06', def: 'Thường / Khẩn / Thượng khẩn, chỉ hiển thị, không đổi SLA', scr: 'SCR-04' },
    'P-03': { q: 'Hạng mục ngoài dự toán: chặn hay chỉ cảnh báo', src: 'AMB-02, BR-07-01', def: 'Chỉ cảnh báo (BBLV 09/09, mới hơn 27/08)', scr: 'SCR-05' },
    'P-04': { q: 'Tích hợp kho: API, 2 bước sổ sách → kiểm đếm', src: 'UR-PRE-10, 12', def: 'Một bước; kết quả giả lập', scr: 'SCR-06' },
    'P-05': { q: 'ĐVĐX tự chọn CQCM hay cần TTMS/Pháp chế xác nhận', src: 'BBLV 22/09 bước 15; BPMN v1.1 N07', def: 'Theo BPMN v1.1 (N07): ĐVĐX chọn, TTMS xác nhận danh sách đúng/đủ ở task 17', scr: 'SCR-22' },
    'P-06': { q: 'Tiêu chí báo giá đạt/không đạt', src: 'UR-PRE-23', def: 'Hết hiệu lực hoặc thiếu dòng thì Không đạt', scr: 'SCR-07' },
    'P-07': { q: 'Câu tự động khi dùng hàng tồn kho', src: 'BBLV 09/09', def: 'Câu mẫu do BA soạn, gắn nhãn', scr: 'SCR-08' },
    'P-08': { q: 'Mẫu phiếu giải trình', src: 'URD T-24', def: 'Dùng phụ lục 1 BM-02', scr: 'SCR-13' },
    'P-09': { q: 'Người nhận email khi > 2 vòng; cấp kết luận', src: 'UR-COM-21, 23; AMB-05; BPMN v1.1 task 34', def: 'ĐVĐX, CQCM, TTMS; cấp kết luận là Thủ trưởng VHT (task 34)', scr: 'SCR-14' },
    'P-10': { q: 'Ai chủ trì rà soát BM-05 (TTMS hay CQCM)', src: 'OQ-16; BPMN v1.1 Q01 (đã chốt)', def: 'Theo Q01: TTMS rà soát, cập nhật và ký BM-05 trước với tư cách CQCM về ĐTXD', scr: 'SCR-16' },
    'P-11': { q: 'Một bên từ chối ký BM-05 khi bên kia còn xử lý: trả ngay hay chờ đủ', src: 'BPMN v1.1 Q03 (cần làm rõ), task 46–47', def: 'Bản vẽ tạm chờ đủ hai kết quả; prototype trả hồ sơ ngay khi một bên không đồng ý', scr: 'SCR-17' },
    'P-12': { q: 'Thứ tự ký BM-05; phân biệt Không ký / Chưa ký / Không đồng ý', src: 'UR-DX-14; BPMN v1.1 Q01', def: 'TTMS ký trước (task 44), sau đó CQCM Tài chính/liên quan ‖ Phó TGĐ (46 ‖ 47); 3 trạng thái hiển thị riêng', scr: 'SCR-17' },
    'P-13': { q: 'Có phải chờ TGĐ Tập đoàn đồng ý mới sinh BM-08', src: 'Q02, BRD Q-04', def: 'Có chờ (Q02: TO-BE giữ nguyên); nút giả lập "TGĐ TĐ đồng ý"', scr: 'SCR-18' },
    'P-14': { q: 'Ký thẳng hay phải tổ chức LCNT sau phê duyệt', src: 'OQ-14, UC-07-13', def: 'Không demo; nút "Tạo gói thầu" để mờ', scr: 'SCR-19' },
    'P-15': { q: 'Giá trị và mốc tính KPI tổng', src: 'OQ-13, UR-KPI-02', def: '20 NLV từ ngày gửi CQCM (task 18) đến ngày phê duyệt (task 60)', scr: 'SCR-20' },
    'P-16': { q: 'Quy tắc ủy quyền ký, tài khoản intern, API VOffice', src: 'OQ-11, UR-COM-13', def: 'Giả lập; không vẽ ủy quyền (N01)', scr: 'SCR-21' },
    'P-22': { q: 'Vòng giải trình: ≤ 2 vòng quay về chỉ huy ĐVĐX (task 13) rồi gửi lại CQCM, không còn bước TTMS xét giải trình; ghi chú N04 vẫn ghi "TTMS xem xét"', src: 'BPMN v1.1 task 28, 29, 13; N04', def: 'Theo hình vẽ v1.1', scr: 'SCR-13' },
    'P-26': { q: 'Người dùng chọn quy trình khi tạo ĐXMS (khác hình vẽ gốc: hệ thống tự phân luồng). Kèm: (a) chuyển quy trình thì hồ sơ mới vào thẳng bước sau báo giá hay làm lại từ task 1; (b) ngưỡng 160 tỷ tính trên tổng nào', src: 'Chốt nội bộ 28/09/2026; BPMN MS01 v1.1 N08, task 10a, 10b', def: 'Chọn tay ở SCR-25, start ngay khi Lưu; hồ sơ mới làm lại từ task 1 với dữ liệu đã sao chép sẵn; ngưỡng tính trên tổng kinh phí gồm VAT sau khi trừ tồn kho', scr: 'SCR-25' },
    /* Danh mục dùng chung — docs/dtms/prototype-DMDC-chuan-bi.md §7. */
    'P-27': { q: 'Danh sách giá trị thật của từng danh mục', src: 'BBLV 24/09 (VHT gửi qua email, chưa nhận)', def: 'Dữ liệu mẫu theo tài liệu chuẩn bị DMDC §3', scr: 'SCR-32' },
    'P-28': { q: 'Ngưỡng MS13/MS14: VT-CNTT < 160 và lĩnh vực khác < 90 (BBLV 24/09), hay ngược lại (BBLV 15/09)', src: 'BRD Q-01, UR-KDT-07', def: 'Theo BBLV 24/09', scr: 'SCR-40' },
    'P-29': { q: 'Loại khoản đầu tư có cần trường "Cấp xử lý" (SXKD luôn cấp Tập đoàn) không, hay chỉ dùng cho báo cáo', src: 'BBLV 15/09', def: 'Có trường Cấp xử lý', scr: 'SCR-34' },
    'P-30': { q: 'Mã nhà cung cấp do hệ thống tự sinh hay người dùng nhập', src: '—', def: 'Tự sinh NCC-000123; mã số thuế là khoá chống trùng', scr: 'SCR-31' },
    'P-31': { q: 'Có cần tài khoản ngân hàng, hồ sơ năng lực, đánh giá nhà cung cấp trong ĐTMS không', src: 'UC-10-07', def: 'Không có', scr: 'SCR-31' },
    'P-32': { q: 'Nhà cung cấp nước ngoài định danh bằng gì (mã thuế nước sở tại / số đăng ký kinh doanh), có bắt buộc không', src: 'Chốt nội bộ 28/09/2026 (có NCC nước ngoài)', def: 'Tuỳ chọn, nhập tự do', scr: 'SCR-31' },
    'P-33': { q: 'Bản ghi danh mục đã được hồ sơ dùng: chỉ Dừng hoạt động, không cho xoá', src: '—', def: 'Như vậy; bản ghi dừng hoạt động không hiện trong ô chọn, hồ sơ cũ vẫn hiện đúng giá trị', scr: 'SCR-32' },
    'P-34': { q: 'Ngưỡng có hiệu lực theo ngày; hồ sơ đang chạy giữ ngưỡng lúc tạo', src: '—', def: 'Như vậy', scr: 'SCR-40' },
    'P-35': { q: 'Phương thức LCNT và loại hợp đồng theo QĐ 12869 hay theo Luật Đấu thầu', src: 'BR-16', def: 'Theo Luật Đấu thầu', scr: 'SCR-38' },
    'P-36': { q: 'Ai quản trị từng danh mục (TTMS cho Nhà cung cấp; quản trị hệ thống cho phần còn lại?)', src: 'UC-12-05 (A21)', def: 'Vai Quản trị hệ thống thấy tất cả; vai TTMS chỉ thấy Nhà cung cấp và Loại hàng hoá', scr: 'SCR-30' },
    /* Quản trị quy trình — docs/dtms/prototype-PH02-quy-trinh-chuan-bi.md §4. */
    'P-37': { q: 'MS01.01 / .02 / .03 là một process definition (MS01 v1.1 có cổng giá trị) hay ba bản deploy riêng', src: 'Locked decision BPMN chuẩn + chọn quy trình', def: 'Một định nghĩa DTMS_MS01; .01/.02/.03 là biến processVariant', scr: 'SCR-41' },
    'P-38': { q: 'Hồ sơ đã Chuyển quy trình (10b) hiện trạng thái gì trên Giám sát tiến trình', src: 'P-26', def: 'Đã hủy (hồ sơ Dừng xử lý cũng vậy)', scr: 'SCR-48' },
    'P-39': { q: 'Luật hiển thị có quyết định thật nút trên màn xử lý task không (đổi tên hiển thị, vô hiệu hoá → ẩn nút)', src: 'UR-WF-11', def: 'Không nối; chỉ xem trước trong form luật', scr: 'SCR-44' },
    'P-40': { q: 'Ai được retry / xử lý incident, có cần phê duyệt không (UR-WF-05 retry có kiểm soát)', src: 'UR-WF-05', def: 'Không có — Giám sát tiến trình chỉ xem', scr: 'SCR-48' },
    'P-41': { q: 'Vai trò nào thấy menu Quản trị quy trình: chỉ Quản trị hệ thống, hay TTMS cũng xem Giám sát tiến trình', src: 'UC-02-01…03 (A21), UR-WF-12', def: 'Quản trị hệ thống thấy cả ba mục; Chuyên viên TTMS chỉ xem Giám sát tiến trình', scr: 'SCR-48' },
  };
  /* Màn → điểm ❓ gắn trên màn đó. */
  D.screenQ = {};
  Object.entries(D.openPoints).forEach(([id, p]) => { (D.screenQ[p.scr] = D.screenQ[p.scr] || []).push(id); });

  /* ---------- Menu toàn hệ — 13 phân hệ của use-case-dtms.md ---------- */
  D.menu = [
    { label: 'Tổng quan', icon: 'tong_quan', path: 'tong-quan', ph: '13', uc: ['UC-13-01'] },
    { label: 'Việc của tôi', icon: 'view_list', path: 'viec-cua-toi', scr: 'SCR-01', badge: 'tasks' },
    { label: 'Kế hoạch & nhu cầu', icon: 'view_grid', ph: '04', children: [
      { label: 'Kế hoạch năm', path: 'ph/ke-hoach', uc: ['UC-04-01'] },
      { label: 'Nhu cầu mua sắm', path: 'ph/nhu-cau', uc: ['UC-04-02'] }] },
    { label: 'Khoản đầu tư & Dự án', icon: 'view_flow', ph: '05', children: [
      { label: 'Khoản đầu tư', path: 'ph/kdt', uc: ['UC-05-01', 'UC-05-02', 'UC-05-03', 'UC-05-04', 'UC-05-05', 'UC-05-06'] },
      { label: 'Dự án đầu tư', path: 'ph/du-an', uc: ['UC-05-07', 'UC-05-08', 'UC-05-09', 'UC-05-10'] },
      { label: 'Giám sát & rủi ro đầu tư', path: 'ph/giam-sat', uc: ['UC-05-11', 'UC-05-12'] }] },
    { label: 'Dự toán & chi phí', icon: 'phan_he_chi_phi', ph: '06', children: [
      { label: 'Dự toán', path: 'ph/du-toan', uc: ['UC-06-01'] },
      { label: 'Tờ trình chi phí', path: 'ph/to-trinh', uc: ['UC-06-02', 'UC-06-03', 'UC-06-04'] },
      { label: 'Báo cáo CSGT', path: 'ph/csgt', uc: ['UC-06-05'] }] },
    { label: 'Đề xuất mua sắm', icon: 'phan_he_mua_sam', ph: '07', open: true, children: [
      { label: 'Danh sách ĐXMS', path: 'dxms', scr: 'SCR-02' },
      { label: 'Yêu cầu báo giá', path: 'ph/ycbg', uc: ['UC-07-03'] },
      { label: 'Cơ sở giá', path: 'ph/co-so-gia', uc: ['UC-07-04'] },
      { label: 'Điều chỉnh ĐXMS', path: 'ph/dieu-chinh', uc: ['UC-07-12'] }] },
    { label: 'Kế hoạch LCNT', icon: 'doi_tac', ph: '08', children: [
      { label: 'Gói thầu', path: 'ph/goi-thau', uc: ['UC-08-01'] },
      { label: 'Tờ trình & QĐ KHLCNT', path: 'ph/khlcnt', uc: ['UC-08-02', 'UC-08-03', 'UC-08-04'] },
      { label: 'Tổ chuyên gia / thẩm định', path: 'ph/to-chuyen-gia', uc: ['UC-08-05'] }] },
    { label: 'Tổ chức LCNT', icon: 'linh_vuc', ph: '09', children: [
      { label: 'HSMT / HSYC', path: 'ph/hsmt', uc: ['UC-09-01', 'UC-09-02'] },
      { label: 'Mở thầu & đánh giá', path: 'ph/mo-thau', uc: ['UC-09-03', 'UC-09-04', 'UC-09-05'] },
      { label: 'Kết quả LCNT', path: 'ph/kqlcnt', uc: ['UC-09-06', 'UC-09-07'] },
      { label: 'Danh sách cấm nhà thầu', path: 'ph/ds-cam', uc: ['UC-09-08'] }] },
    { label: 'Hợp đồng', icon: 'chuc_danh_khoa_hoc', ph: '10', children: [
      { label: 'Danh sách hợp đồng', path: 'ph/hop-dong', uc: ['UC-10-01', 'UC-10-02', 'UC-10-06'] },
      { label: 'PO & thanh toán', path: 'ph/po', uc: ['UC-10-03', 'UC-10-07'] },
      { label: 'Tiến độ & nghiệm thu', path: 'ph/tien-do', uc: ['UC-10-04', 'UC-10-05'] },
      { label: 'Thanh lý & quyết toán', path: 'ph/thanh-ly', uc: ['UC-10-08'] }] },
    { label: 'Kho & tài sản', icon: 'phan_he_hang_hoa', ph: '11', children: [
      { label: 'Danh mục vật tư', path: 'ph/vat-tu', uc: ['UC-11-01'] },
      { label: 'Nhập / xuất kho', path: 'ph/kho', uc: ['UC-11-02', 'UC-11-03', 'UC-11-11'] },
      { label: 'Tài sản', path: 'ph/tai-san', uc: ['UC-11-04', 'UC-11-05', 'UC-11-06', 'UC-11-07', 'UC-11-08', 'UC-11-09', 'UC-11-12'] },
      { label: 'Kiểm kê', path: 'ph/kiem-ke', uc: ['UC-11-10'] }] },
    { label: 'Hồ sơ & biểu mẫu', icon: 'phan_he_dmdc', ph: '12', children: [
      { label: 'Kho hồ sơ', path: 'ph/kho-ho-so', uc: ['UC-12-04'] },
      { label: 'E-Form & mẫu Word', path: 'ph/eform', uc: ['UC-12-01', 'UC-12-03'] },
      { label: 'Bộ hồ sơ & checklist', path: 'ph/checklist', uc: ['UC-12-02'] },
      { label: 'Trình ký VOffice', path: 'ph/voffice', uc: ['UC-12-06'] },
      { label: 'AI kiểm tra hồ sơ', path: 'ph/ai', uc: ['UC-12-07'] }] },
    { label: 'Báo cáo & KPI', icon: 'nguon_kinh_phi', ph: '13', children: [
      { label: 'KPI thẩm định', path: 'ph/kpi', uc: ['UC-13-02'] },
      { label: 'Cảnh báo & nhắc việc', path: 'ph/canh-bao', uc: ['UC-13-03'] },
      { label: 'Báo cáo phân tích', path: 'ph/bao-cao', uc: ['UC-13-04'] },
      { label: 'Truy vết chuỗi đầu tư', path: 'ph/truy-vet', uc: ['UC-13-05'] }] },
    /* D-2 (người dùng chốt 2026-09-28): tách 3 mục quy trình khỏi Quản trị hệ thống. B2–B4 thay 2 mục đầu bằng màn thật. */
    { label: 'Quản trị quy trình', icon: 'phan_he_quy_trinh', ph: '02, 03', children: [
      { label: 'Quy trình BPMN', path: 'quy-trinh', uc: ['UC-02-01'] },
      { label: 'Ma trận hành động', path: 'ma-tran', uc: ['UC-02-02'] },
      { label: 'Giám sát tiến trình', path: 'giam-sat-tien-trinh', scr: 'SCR-48' }] },
    { label: 'Quản trị hệ thống', icon: 'phan_he_iam', ph: '01', children: [
      { label: 'Người dùng & phân quyền', path: 'ph/nguoi-dung', uc: ['UC-01-02', 'UC-01-03'] },
      { label: 'Ủy quyền xử lý', path: 'ph/uy-quyen', uc: ['UC-01-04'] },
      { label: 'Danh mục dùng chung', path: 'dmdc', scr: 'SCR-30' },
      { label: 'Tích hợp hệ thống', path: 'ph/tich-hop', uc: ['UC-13-06'] }] },
  ];

  /* Tên UC (rút gọn) cho trang phân hệ chưa dựng. */
  D.ucNames = {
    'UC-01-02': 'Quản lý người dùng (SSO & nội bộ)', 'UC-01-03': 'Cây đơn vị, chức danh, vai trò, phân quyền dữ liệu', 'UC-01-04': 'Ủy quyền xử lý',
    'UC-02-01': 'Quản lý quy trình BPMN, phiên bản', 'UC-02-02': 'Cấu hình ma trận hành động', 'UC-02-03': 'Theo dõi process instance / incident',
    'UC-04-01': 'Lập, trình, phê duyệt, điều chỉnh kế hoạch năm', 'UC-04-02': 'Khởi tạo nhu cầu, ghi nhận căn cứ đã phê duyệt',
    'UC-05-01': 'Phân loại KĐT và chọn luồng', 'UC-05-02': 'Lập, trình hồ sơ chủ trương / KĐT', 'UC-05-03': 'Thẩm định chủ trương / KĐT',
    'UC-05-04': 'Cho ý kiến tham mưu HĐĐT', 'UC-05-05': 'Phê duyệt chủ trương / KĐT / dự án', 'UC-05-06': 'Điều chỉnh chủ trương / KĐT',
    'UC-05-07': 'Chuẩn bị dự án ĐTXD / ĐTMS', 'UC-05-08': 'Lập, trình chủ trương / dự án / thiết kế-dự toán', 'UC-05-09': 'Thẩm định dự án / thiết kế-dự toán',
    'UC-05-10': 'Điều chỉnh, gia hạn dự án', 'UC-05-11': 'Quản trị rủi ro đầu tư', 'UC-05-12': 'Giám sát, đánh giá đầu tư',
    'UC-06-01': 'Lập dự toán / khái toán', 'UC-06-02': 'Soạn, trình Tờ trình chi phí', 'UC-06-03': 'Thẩm định Tờ trình chi phí', 'UC-06-04': 'Phê duyệt Tờ trình chi phí', 'UC-06-05': 'Báo cáo CSGT',
    'UC-07-03': 'Tạo YCBG, nhận và kiểm tra báo giá', 'UC-07-04': 'Quản lý cơ sở giá', 'UC-07-12': 'Điều chỉnh ĐXMS (MS02)',
    'UC-08-01': 'Tạo gói thầu', 'UC-08-02': 'Lập, trình Tờ trình KHLCNT', 'UC-08-03': 'Kiểm tra KHLCNT', 'UC-08-04': 'Phê duyệt, đăng tải KHLCNT', 'UC-08-05': 'Tổ chuyên gia / Tổ thẩm định',
    'UC-09-01': 'Lập, thẩm định, phê duyệt HSMT / HSYC', 'UC-09-02': 'Phát hành hồ sơ, làm rõ', 'UC-09-03': 'Tiếp nhận HSDT, mở thầu', 'UC-09-04': 'Đánh giá, xếp hạng',
    'UC-09-05': 'Thương thảo', 'UC-09-06': 'Phê duyệt KQLCNT', 'UC-09-07': 'Hủy thầu, kiến nghị', 'UC-09-08': 'Danh sách cấm / hạn chế nhà thầu',
    'UC-10-01': 'Khởi tạo, soạn thảo hợp đồng', 'UC-10-02': 'Trình ký, ký hợp đồng', 'UC-10-03': 'Hợp đồng & PO, tạm ứng', 'UC-10-04': 'Theo dõi milestone, bảo lãnh',
    'UC-10-05': 'Tiếp nhận hàng, KCS, nghiệm thu', 'UC-10-06': 'Sửa đổi hợp đồng, phụ lục', 'UC-10-07': 'Thanh toán nhà thầu', 'UC-10-08': 'Thanh lý, quyết toán',
    'UC-11-01': 'Danh mục vật tư hàng hoá', 'UC-11-02': 'Nhập kho', 'UC-11-03': 'Xuất kho', 'UC-11-04': 'Điều chuyển tài sản', 'UC-11-05': 'Thu hồi tài sản',
    'UC-11-06': 'Sửa chữa tài sản', 'UC-11-07': 'Chủ trương xử lý tài sản', 'UC-11-08': 'Thanh lý, tiêu huỷ', 'UC-11-09': 'Báo mất, bồi thường', 'UC-11-10': 'Kiểm kê',
    'UC-11-11': 'Rà soát tồn kho (cho UC-07-02)', 'UC-11-12': 'Mượn tài sản ngắn hạn',
    'UC-12-01': 'Thiết kế E-Form và Word template', 'UC-12-02': 'Bộ hồ sơ, checklist theo loại', 'UC-12-03': 'Tự động sinh văn bản', 'UC-12-04': 'Lưu trữ, tìm kiếm hồ sơ',
    'UC-12-05': 'Danh mục nghiệp vụ', 'UC-12-06': 'Trình ký trên VOffice', 'UC-12-07': 'AI kiểm tra biểu mẫu',
    'UC-13-01': 'Dashboard giá trị, drill-down', 'UC-13-02': 'KPI thẩm định / phê duyệt', 'UC-13-03': 'Cảnh báo quá hạn, nhắc việc', 'UC-13-04': 'Báo cáo, phân tích (AI)',
    'UC-13-05': 'Truy vết kế hoạch → hợp đồng → tài sản', 'UC-13-06': 'Đồng bộ SAP, VOffice, Ariba, SSO',
  };


  /* ---------- Nội dung mẫu cho các màn chi tiết (bước 2–4) ---------- */
  D.basisTypes = [
    { id: 'khsx', name: 'Kế hoạch SXKD năm', src: 'Dự toán' },
    { id: 'pakd', name: 'Phương án kinh doanh', src: 'Dự toán' },
    { id: 'ttkp', name: 'Tờ trình kinh phí', src: 'Dự toán' },
    { id: 'khcn', name: 'QĐ nhiệm vụ KHCN', src: 'eBOM / mBOM' },
    { id: 'khac', name: 'Văn bản chỉ đạo khác', src: 'Không có' },
  ];
  D.basisDocs = [
    { id: 'qd1', no: '1482/QĐ-VHT', date: '12/03/2026', title: 'Phê duyệt nhiệm vụ KHCN "Phát triển trạm gNodeB thế hệ 2"', type: 'khcn', group: false, value: 412.5, remain: 189.4 },
    { id: 'qd2', no: '0917/QĐ-VHT', date: '20/01/2026', title: 'Phê duyệt nhiệm vụ KHCN "Anten mảng pha băng Ka"', type: 'khcn', group: false, value: 96.0, remain: 41.2 },
    { id: 'qd3', no: '2210/QĐ-TĐ', date: '05/12/2025', title: 'Phê duyệt nhiệm vụ KHCN "Hệ thống mạng lõi 5G SA"', type: 'khcn', group: true, value: 640.0, remain: 210.5 },
  ];
  D.aiBasic = [
    { key: 'purposeText', label: 'Mục đích', value: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển, thử nghiệm và hiệu chuẩn trạm gNodeB thế hệ 2 theo nhiệm vụ KHCN 1482/QĐ-VHT.', from: 'QĐ 1482/QĐ-VHT, mục 2' },
    { key: 'scope', label: 'Phạm vi, quy mô', value: '5 hạng mục: 20 máy phân tích phổ, 20 máy phát tín hiệu, 02 hệ thống buồng đo OTA, 40 bộ kit hiệu chuẩn, 01 gói đào tạo chuyển giao.', from: 'eBOM dự án gNodeB-G2, nhóm Đo kiểm' },
    { key: 'value', label: 'Giá trị dự kiến', value: 'Khoảng 183 tỷ đồng (gồm VAT)', from: 'Dự toán nhiệm vụ, phần còn lại 189,4 tỷ' },
    { key: 'fund', label: 'Nguồn vốn', value: 'Vốn KHCN, kế hoạch năm 2027', code: 'KHCN', from: 'QĐ 1482/QĐ-VHT, mục 5' },
    { key: 'period', label: 'Thời gian thực hiện', value: '01/2027 – 09/2027', from: 'Tiến độ nhiệm vụ, giai đoạn 2' },
  ];
  /* Giá trị dự kiến AI gợi ý ở task 03 (tỷ) — dùng cho cảnh báo mềm lệch ngưỡng quy trình ở task 04. */
  D.aiEstimate = 183;
  D.tree = [
    { name: 'Dự án gNodeB thế hệ 2', children: [
      { name: 'Đo kiểm RF', lines: [1, 2] }, { name: 'Đo kiểm OTA', lines: [3] }, { name: 'Hiệu chuẩn', lines: [4] }] },
    { name: 'Ngoài dự toán / eBOM', lines: [5], warn: true },
  ];
  D.usedIn = { 1: 'ĐXMS-2026-0042 (đã phê duyệt 03/2026)' };
  /* Báo giá theo NCC (mã trong danh mục Nhà cung cấp SCR-31: Alpha, Beta, Gamma), đơn giá (tỷ) theo dòng. Lần 1: Gamma dòng 3 hết hiệu lực.
     Tên và loại tiền lấy từ danh mục (D.nccOf — catalog.js thay bằng bản ghi của SCR-31). */
  D.quotes = [
    { ncc: 'NCC-000001', date: '08/10/2026', valid: '08/01/2027', prices: { 1: 3.2, 2: 2.1, 3: 28.0, 4: 0.35, 5: 9.0 } },
    { ncc: 'NCC-000002', date: '09/10/2026', valid: '09/12/2026', prices: { 1: 3.35, 2: 2.05, 3: 29.4, 4: 0.37, 5: 9.5 } },
    { ncc: 'NCC-000003', date: '07/10/2026', valid: '20/09/2026', validRetry: '15/01/2027', prices: { 1: 3.28, 2: 2.2, 3: 27.6, 4: 0.34, 5: 8.8 } },
  ];
  const NCC0 = { 'NCC-000001': ['NCC Alpha', 'VNĐ'], 'NCC-000002': ['NCC Beta', 'VNĐ'], 'NCC-000003': ['NCC Gamma', 'USD'] };
  D.nccOf = (code) => ({ code, short: (NCC0[code] || [code])[0], currency: (NCC0[code] || [])[1] || 'VNĐ' });
  D.checklist = [
    { g: 'I', name: 'Văn bản căn cứ (QĐ nhiệm vụ KHCN)', no: '1482/QĐ-VHT', req: 'Bắt buộc', by: 1 },
    { g: 'I', name: 'Tờ trình đề xuất mua sắm (BM-01)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
    { g: 'II', name: 'Phụ lục chi phí, cơ sở đơn giá', no: '3 báo giá', req: 'Bắt buộc', by: 10 },
    { g: 'II', name: 'Kết quả rà soát tồn kho', no: 'RSTK-2026-0311', req: 'Bắt buộc', by: 7 },
    { g: 'II', name: 'Thuyết minh (BM-02)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
    { g: 'III', name: 'Hợp đồng tương tự', no: '—', req: 'Nếu có', by: null },
  ];
  D.bm04Sections = ['Căn cứ', 'Sự cần thiết', 'Phạm vi, số lượng', 'Giá trị & cơ sở giá', 'Nguồn vốn', 'Biện pháp thực hiện', 'Phương án kỹ thuật – công nghệ'];
  D.opinions = {
    PC: { 'Căn cứ': { ok: true }, 'Biện pháp thực hiện': { ok: false, text: 'Chưa nêu rõ áp dụng Quy chế LCNT của Tập đoàn hay Luật Đấu thầu.', guide: 'Ghi rõ căn cứ áp dụng tại mục "Biện pháp thực hiện" của BM-01.' } },
    TC: { 'Giá trị & cơ sở giá': { ok: true }, 'Nguồn vốn': { ok: false, text: 'Cần tách chi phí CCDC và TSCĐ trong phụ lục chi phí.', guide: 'Bổ sung cột "Loại chi phí" tại Phụ lục chi phí.' } },
    CL: { 'Phương án kỹ thuật – công nghệ': { ok: true }, 'Phạm vi, số lượng': { ok: true } },
  };
  /* Tiếp thu / bảo lưu mặc định ở task 22 và nội dung giải trình (phụ lục 1 BM-02). */
  D.responses = {
    PC: { decision: 'Tiếp thu', text: 'Bổ sung: áp dụng Quy chế LCNT của Tập đoàn ban hành kèm QĐ 1105/QĐ-TĐ.', ref: 'BM-01 mục 9' },
    TC: { decision: 'Bảo lưu', text: 'Toàn bộ thiết bị là TSCĐ phục vụ nhiệm vụ KHCN, không có CCDC; đã ghi chú loại chi phí tại Phụ lục chi phí theo hướng dẫn 45/HD-TCKT.', ref: 'Phụ lục chi phí, cột 11' },
  };
  D.versionDiff = [
    { field: 'BM-01 · Biện pháp thực hiện', from: 'Tổ chức lựa chọn nhà thầu theo quy định', to: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)' },
    { field: 'Phụ lục chi phí · Loại chi phí', from: '(không có cột)', to: 'Thêm cột "Loại chi phí": 5/5 dòng là TSCĐ' },
    { field: 'BM-02 · Phụ lục 1 giải trình', from: '—', to: '1 ý kiến tiếp thu, 1 ý kiến bảo lưu' },
  ];
  D.bm05 = [
    ['Tuân thủ quy định', 'Hồ sơ lập theo QT 10.2.1; căn cứ QĐ 1482/QĐ-VHT còn hiệu lực.'],
    ['Sự cần thiết', 'Phục vụ trực tiếp giai đoạn 2 nhiệm vụ gNodeB thế hệ 2; chưa có thiết bị tương đương.'],
    ['Mục tiêu', 'Đủ năng lực đo kiểm RF/OTA cho 2 dòng sản phẩm trong năm 2027.'],
    ['Phạm vi, số lượng, tồn kho', 'Số lượng đã trừ phần đã dùng (4 máy phân tích phổ) và tồn kho khả dụng (6 bộ kit).'],
    ['Giá trị', '182,90 tỷ đồng gồm VAT; cơ sở giá từ 3 báo giá hợp lệ.'],
    ['Nguồn vốn', 'Vốn KHCN năm 2027; đơn vị giải trình toàn bộ là TSCĐ, TTMS chấp nhận.'],
    ['Biện pháp, kế hoạch', 'Áp dụng Quy chế LCNT của Tập đoàn; thực hiện 01–09/2027.'],
    ['Hiệu quả', 'Giảm thuê dịch vụ đo kiểm ngoài khoảng 14 tỷ đồng/năm.'],
  ];

  window.D = D;
})();
