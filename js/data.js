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
  D.notApplicable = { 'MS01.01': [11, 38, 39, 40], 'MS01.02': [11, 38, 39, 40].concat(range(49, 56)), 'MS01.03': [12].concat(range(41, 59)) };
  /* Ngưỡng KPI thẩm định (NLV, từ task 18 tới task 60): MS01.03 theo QT 10.2.1 — v1.1 không ghi (P-21). */
  D.kpiLimit = { 'MS01.01': 20, 'MS01.02': 20, 'MS01.03': 10 };

  /* Quy trình người dùng chọn khi tạo ĐXMS (SCR-25, chốt 2026-09-28). Khoảng giá trị lấy từ Ngưỡng phân luồng (D.dxmsRules);
     basis = phần điều kiện về căn cứ; basisGroup = căn cứ hiện ở task 1 (true: đã được CT/TGĐ TĐ duyệt, false: chưa, null: mọi loại).
     name là tên process definition trong BPMN, không đổi theo ngưỡng. */
  D.processes = {
    'MS01.01': { name: 'Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ chưa được CT/TGĐ Tập đoàn phê duyệt', basis: 'căn cứ chưa được CT/TGĐ TĐ duyệt', basisGroup: false },
    'MS01.02': { name: 'Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ đã được CT/TGĐ Tập đoàn phê duyệt', basis: 'căn cứ đã được CT/TGĐ TĐ duyệt (không gồm Kế hoạch SXKD năm)', basisGroup: true, noTypes: ['khsx'] },
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
  /* Quy trình của loại hồ sơ Điều chỉnh (P-63: MS02 hiện là một quy trình, trang MS02 ver1.1 gộp MS02.01/.02/.03). */
  D.adjProcesses = { MS02: { name: 'Điều chỉnh đề xuất mua sắm', page: 'MS02 ver1.1' } };
  D.procName = (k) => ((D.processes[k] || D.adjProcesses[k] || {}).name || '');
  /* Loại hồ sơ của ĐXMS (D-10, như ProfileType XET_DUYET / DIEU_CHINH của KHCN) → các quy trình chọn được. */
  D.kinds = {
    PD: { label: 'Phê duyệt ĐXMS', procs: ['MS01.01', 'MS01.02', 'MS01.03'] },
    DC: { label: 'Điều chỉnh ĐXMS', procs: ['MS02'] },
  };
  D.kindOfProc = (k) => (D.adjProcesses[k] ? 'DC' : 'PD');
  /* Mã: ĐXMS tạo ở SCR-28 đầu tiên là 0117 (luồng demo); hồ sơ Phê duyệt đầu tiên giữ 4 số của ĐXMS (HS-2026-0117);
     [1] = hồ sơ mới của cùng ĐXMS tạo ở task 10b khi chuyển quy trình. */
  D.dxmsCode0 = 'ĐXMS-2026-0117';
  D.caseCodes = ['HS-2026-0117', 'HS-2026-0125'];

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
   *  small   — nhãn / văn bản ký thay thế khi hồ sơ đi nhánh < 160 tỷ (MS01.03); scrSmall — màn thay thế (Flow.choiceOf, Flow.scrOf)
   *  lockWhen(vars) — lý do khoá nút (nút vẫn hiện, không bấm được); mainWhen(vars, ui) — nhánh chính tuỳ trạng thái
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
      { label: 'Có ý kiến không đồng ý — lập giải trình', to: 28, mainWhen: (v, u) => v.round === 0 && D.keepAny(u) },
      { label: 'Đồng ý sửa theo ý kiến CQCM', to: 27, kind: 'secondary', mainWhen: (v, u) => !(v.round === 0 && D.keepAny(u)) }] },
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
      { label: 'Xác nhận ký BM-04 & Checklist 01', to: 37, main: true, sign: 'BM-04 + Checklist 01',
        small: { label: 'Xác nhận ký BM-04 & Checklist 02', sign: 'BM-04 + Checklist 02' } }] },
    37: { join: 'cqcm', varGate: { big: { true: 41, false: 'fork38' } } },
    /* Nhánh < 160 tỷ (MS01.03): TTMS ‖ Phó TGĐ ký thẳng trên BM-09 (SCR-23), chờ đủ hai kết quả ở task 40 (P-20). */
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
      { label: 'Có báo cáo TGĐ Tập đoàn', to: 'gReport', mainWhen: (v) => v.process !== 'MS01.02', set: { reportTD: true },
        lockWhen: (v) => (v.process === 'MS01.02' ? 'Căn cứ đã được CT/TGĐ Tập đoàn phê duyệt (MS01.02) — không báo cáo Tập đoàn.' : null) },
      { label: 'Không báo cáo TGĐ Tập đoàn', to: 'gReport', kind: 'secondary', mainWhen: (v) => v.process === 'MS01.02', set: { reportTD: false } }] },
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
    60: { who: 'tgd', scr: 'SCR-19', scrSmall: 'SCR-24', nlv: 1, kpiEnd: true, choices: [
      { label: 'Phê duyệt', to: 61, main: true, sign: 'BM-08', small: { sign: 'BM-09' } },
      { label: 'Yêu cầu hoàn chỉnh', to: 25, kind: 'secondary', reason: true },
      { label: 'Chỉ đạo khác — kết thúc', to: 'END_OTHER', kind: 'danger', reason: true }] },
    61: { next: 'END' },
  };
  D.flow = F;

  /* Cảnh demo §2.4: task bắt đầu của mỗi cảnh (dùng cho "Nhảy tới cảnh"). */
  D.scenes = [
    { n: 1, name: 'Tạo ĐXMS, tạo hồ sơ, chọn quy trình', start: 'NEW', tasks: '—, 01–07', who: 'minh' },
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
    'SCR-02': { name: 'Danh sách hồ sơ ĐXMS', step: 1 }, 'SCR-03': { name: 'Chọn căn cứ', step: 2 },
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
    'SCR-23': { name: 'Ký thẩm định trực tiếp BM-09', step: 'T6' }, 'SCR-24': { name: 'Phê duyệt Tờ trình BM-09', step: 'T6' },
    'SCR-25': { name: 'Thêm mới hồ sơ', step: 6 }, 'SCR-26': { name: 'Xử lý ĐXMS không khớp quy trình', step: 6 },
    'SCR-27': { name: 'Danh sách ĐXMS', step: 12 }, 'SCR-28': { name: 'Thêm mới / Chỉnh sửa ĐXMS', step: 12 }, 'SCR-29': { name: 'Chi tiết ĐXMS', step: 12 },
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
  /* stock = tồn khả dụng; book = tồn sổ sách, held = đang giữ cho tờ trình khác (heldFor); cost = loại chi phí ghi ở Phụ lục chi phí từ v2. */
  D.items = [
    { n: 1, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 24, used: 4, prop: 20, stock: 0, buy: 20, price: 3.2, amount: 64, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    { n: 2, name: 'Máy phát tín hiệu vector', uom: 'Bộ', bom: 20, used: 0, prop: 20, stock: 0, buy: 20, price: 2.1, amount: 42, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    { n: 3, name: 'Hệ thống buồng đo OTA', uom: 'Hệ thống', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 28, amount: 56, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
    { n: 4, name: 'Bộ kit hiệu chuẩn', uom: 'Bộ', bom: 40, used: 0, prop: 40, stock: 6, book: 8, held: 2, heldFor: 'ĐXMS-2026-0098', buy: 34, price: 0.35, amount: 11.9, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    { n: 5, name: 'Dịch vụ đào tạo, chuyển giao', uom: 'Gói', bom: null, used: null, prop: 1, stock: null, buy: 1, price: 9, amount: 9, group: 1, goods: 'DVPTV', cost: 'TSCĐ', warn: 'Hạng mục không có trong dự toán/eBOM' },
  ];

  /* ĐXMS mẫu (đối tượng cha, D-10 — như nhiệm vụ KHCN wf_tasks). est = giá trị dự kiến nhập khi tạo ĐXMS;
     giá trị hiệu lực suy từ hồ sơ Hoàn thành gần nhất (R4). Trạng thái ĐXMS suy từ hồ sơ (R5). */
  D.dxmsList = [
    { code: 'ĐXMS-2026-0124', title: 'Mua sắm hệ thống đo kiểm sản xuất loạt module RRU 5G', unit: 'Trung tâm Vô tuyến', est: 176.4, priority: 'Thường', period: '02/2027 – 10/2027', creator: 'Nguyễn Văn Minh', created: '25/09/2026', updated: '25/09/2026', purpose: 'Đo kiểm cuối dây chuyền cho sản xuất loạt module RRU 5G theo PAKD 1876/QĐ-TĐ.' },
    { code: 'ĐXMS-2026-0121', title: 'Mua sắm máy chủ phục vụ phòng lab AI', unit: 'Trung tâm Phần mềm', est: 12.4, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Lương Thị Hạnh', created: '22/09/2026', updated: '22/09/2026', purpose: 'Bổ sung năng lực tính toán cho phòng lab AI.' },
    { code: 'ĐXMS-2026-0119', title: 'Mua sắm máy in 3D kim loại cho xưởng mẫu', unit: 'Nhà máy sản xuất thử nghiệm', est: 28.5, priority: 'Thường', period: '01/2027 – 06/2027', creator: 'Phan Văn Lộc', created: '21/09/2026', updated: '21/09/2026', purpose: 'Chế tạo nhanh chi tiết cơ khí cho mẫu thử.' },
    { code: 'ĐXMS-2026-0110', title: 'Mua sắm bộ đàm chuyên dụng cho đội thử nghiệm hiện trường', unit: 'Trung tâm Vô tuyến', est: 6.8, priority: 'Khẩn', period: '10/2026 – 12/2026', creator: 'Nguyễn Văn Minh', created: '15/09/2026', updated: '15/09/2026' },
    { code: 'ĐXMS-2026-0106', title: 'Mua sắm phần mềm thiết kế mạch in và mô phỏng tín hiệu', unit: 'Trung tâm Thiết kế vi mạch', est: 21.3, priority: 'Thường', period: '11/2026 – 12/2026', creator: 'Trịnh Quốc Việt', created: '01/09/2026', updated: '01/09/2026' },
    { code: 'ĐXMS-2026-0103', title: 'Mua sắm hệ thống mô phỏng mạng lõi 5G', unit: 'Trung tâm Mạng lõi', est: 210.5, priority: 'Thường', period: '10/2026 – 06/2027', creator: 'Đặng Thu Trang', created: '28/07/2026', updated: '28/07/2026' },
    { code: 'ĐXMS-2026-0101', title: 'Mua sắm thiết bị đo kiểm tương thích điện từ (EMC)', unit: 'Phòng Chất lượng', est: 168.0, priority: 'Khẩn', period: '01/2027 – 12/2027', creator: 'Bùi Minh Quang', created: '21/07/2026', updated: '21/07/2026' },
    { code: 'ĐXMS-2026-0098', title: 'Mua sắm linh kiện RF cho mẫu thử nghiệm', unit: 'Trung tâm Vô tuyến', est: 45.2, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '02/09/2026', updated: '02/09/2026', purpose: 'Linh kiện RF và vỏ cơ khí cho lô mẫu thử nghiệm module RRU.' },
    { code: 'ĐXMS-2026-0095', title: 'Mua sắm vật tư tiêu hao cho xưởng sản xuất thử', unit: 'Nhà máy sản xuất thử nghiệm', est: 3.9, priority: 'Thường', period: '09/2026 – 12/2026', creator: 'Phan Văn Lộc', created: '12/08/2026', updated: '12/08/2026' },
    { code: 'ĐXMS-2026-0089', title: 'Mua sắm thiết bị thử nghiệm môi trường', unit: 'Phòng Chất lượng', est: 18.7, priority: 'Thượng khẩn', period: '10/2026 – 03/2027', creator: 'Bùi Minh Quang', created: '04/08/2026', updated: '04/08/2026', secret: true },
    { code: 'ĐXMS-2026-0084', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', unit: 'Trung tâm Phần mềm', est: 9.6, priority: 'Thường', period: '09/2026 – 08/2027', creator: 'Lương Thị Hạnh', created: '20/07/2026', updated: '20/07/2026' },
    { code: 'ĐXMS-2026-0077', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', unit: 'Nhà máy sản xuất thử nghiệm', est: 236.4, priority: 'Khẩn', period: '09/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '02/06/2026', updated: '02/06/2026' },
    { code: 'ĐXMS-2026-0072', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', unit: 'Trung tâm Vô tuyến', est: 152.0, priority: 'Thường', period: '09/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '25/05/2026', updated: '25/05/2026' },
  ];

  /* ĐXMS-2026-0124 (MS01.02) và ĐXMS-2026-0098 (MS01.03) chưa có hồ sơ: hồ sơ của hai ĐXMS này chạy luồng trên prototype (T6, D.demoCases).
     Hồ sơ mẫu (đối tượng con, như wf_profile): không chạy luồng, mở được chi tiết ở trạng thái của nó (rule A5).
     kind: PD (Phê duyệt, MS01.0x) | DC (Điều chỉnh, MS02). total = giá trị trình trong hồ sơ (với DC: giá trị sau điều chỉnh).
     st: processing | done | moved | stopped — ánh xạ sang nhãn/badge ở Screens.CASE_STATUS; task = số task BPMN đang chờ (step = tên task,
     hồ sơ MS02 lấy tên từ sơ đồ). late: quá hạn xử lý bước hiện tại (Giám sát tiến trình SCR-48 hiện Quá hạn). */
  D.otherCases = [
    { code: 'HS-2026-0126', dxms: 'ĐXMS-2026-0077', kind: 'DC', title: 'Điều chỉnh lần 1 — Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', total: 248.9, flow: 'MS02', st: 'processing', task: 19, created: '15/09/2026', updated: '25/09/2026', creator: 'Phan Văn Lộc', reason: 'Bổ sung 02 trạm hàn chọn lọc theo thiết kế bo mạch mới; giá linh kiện tăng.' },
    { code: 'HS-2026-0121', dxms: 'ĐXMS-2026-0121', kind: 'PD', title: 'Mua sắm máy chủ phục vụ phòng lab AI', total: 12.4, flow: 'MS01.03', st: 'processing', task: 4, step: 'Rà soát và xác nhận thông tin cơ bản', created: '22/09/2026', updated: '26/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0112', dxms: 'ĐXMS-2026-0084', kind: 'DC', title: 'Điều chỉnh lần 1 — Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', total: 11.2, flow: 'MS02', st: 'done', created: '02/09/2026', updated: '20/09/2026', creator: 'Lương Thị Hạnh', reason: 'Tăng dung lượng lưu trữ theo số trạm tăng thêm năm 2027.' },
    { code: 'HS-2026-0110', dxms: 'ĐXMS-2026-0110', kind: 'PD', title: 'Mua sắm bộ đàm chuyên dụng cho đội thử nghiệm hiện trường', total: 6.8, flow: 'MS01.03', st: 'processing', task: 16, step: 'Lập phiếu yêu cầu thẩm định và chọn CQCM', created: '15/09/2026', updated: '23/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0106', dxms: 'ĐXMS-2026-0106', kind: 'PD', title: 'Mua sắm phần mềm thiết kế mạch in và mô phỏng tín hiệu', total: 21.3, flow: 'MS01.03', st: 'processing', task: 27, step: 'Hoàn chỉnh hồ sơ trình ĐXMS', created: '01/09/2026', updated: '22/09/2026', creator: 'Trịnh Quốc Việt' },
    { code: 'HS-2026-0103', dxms: 'ĐXMS-2026-0103', kind: 'PD', title: 'Mua sắm hệ thống mô phỏng mạng lõi 5G', total: 210.5, flow: 'MS01.02', st: 'done', created: '28/07/2026', updated: '19/09/2026', creator: 'Đặng Thu Trang' },
    { code: 'HS-2026-0101', dxms: 'ĐXMS-2026-0101', kind: 'PD', title: 'Mua sắm thiết bị đo kiểm tương thích điện từ (EMC)', total: 168.0, flow: 'MS01.01', st: 'processing', task: 53, late: true, step: 'Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn', created: '21/07/2026', updated: '18/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0095', dxms: 'ĐXMS-2026-0095', kind: 'PD', title: 'Mua sắm vật tư tiêu hao cho xưởng sản xuất thử', total: 3.9, flow: 'MS01.03', st: 'stopped', created: '12/08/2026', updated: '11/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0089', dxms: 'ĐXMS-2026-0089', kind: 'PD', title: 'Mua sắm thiết bị thử nghiệm môi trường', total: 18.7, flow: 'MS01.03', st: 'done', created: '04/08/2026', updated: '05/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0084', dxms: 'ĐXMS-2026-0084', kind: 'PD', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', total: 9.6, flow: 'MS01.03', st: 'done', created: '20/07/2026', updated: '28/08/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0077', dxms: 'ĐXMS-2026-0077', kind: 'PD', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', total: 236.4, flow: 'MS01.01', st: 'done', created: '02/06/2026', updated: '14/08/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0074', dxms: 'ĐXMS-2026-0072', kind: 'PD', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', total: 152.0, flow: 'MS01.03', st: 'done', created: '01/07/2026', updated: '08/08/2026', creator: 'Nguyễn Văn Minh', replaces: 'HS-2026-0072' },
    { code: 'HS-2026-0072', dxms: 'ĐXMS-2026-0072', kind: 'PD', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', total: 152.0, flow: 'MS01.01', st: 'moved', created: '25/05/2026', updated: '30/06/2026', creator: 'Nguyễn Văn Minh', replacedBy: 'HS-2026-0074' },
  ];

  /* Việc đã xử lý trên hồ sơ mẫu (SCR-01 Việc của tôi) — mới nhất trước. Mở ra chi tiết hồ sơ ở chế độ xem. */
  D.sampleTasks = [
    { who: 'minh', code: 'HS-2026-0106', task: 26, created: '18/09/2026', due: '22/09/2026', done: '21/09/2026' },
    { who: 'minh', code: 'HS-2026-0110', task: 8, created: '17/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'minh', code: 'HS-2026-0110', task: 4, created: '15/09/2026', due: '17/09/2026', done: '16/09/2026' },
    { who: 'minh', code: 'HS-2026-0106', task: 16, created: '04/09/2026', due: '08/09/2026', done: '05/09/2026' },
    { who: 'minh', code: 'HS-2026-0074', task: 26, created: '22/07/2026', due: '24/07/2026', done: '24/07/2026' },
    { who: 'hai', code: 'HS-2026-0110', task: 13, created: '19/09/2026', due: '23/09/2026', done: '22/09/2026' },
    { who: 'hai', code: 'HS-2026-0106', task: 13, created: '03/09/2026', due: '05/09/2026', done: '04/09/2026' },
    { who: 'hai', code: 'HS-2026-0074', task: 13, created: '06/07/2026', due: '08/07/2026', done: '07/07/2026' },
    { who: 'lan', code: 'HS-2026-0106', task: 17, created: '08/09/2026', due: '10/09/2026', done: '09/09/2026' },
    { who: 'lan', code: 'HS-2026-0101', task: 48, created: '09/09/2026', due: '11/09/2026', done: '11/09/2026' },
    { who: 'lan', code: 'HS-2026-0103', task: 58, created: '12/09/2026', due: '15/09/2026', done: '15/09/2026' },
    { who: 'lan', code: 'HS-2026-0077', task: 17, created: '16/06/2026', due: '18/06/2026', done: '17/06/2026' },
    { who: 'hoa', code: 'HS-2026-0106', task: 19, created: '10/09/2026', due: '15/09/2026', done: '14/09/2026' },
    { who: 'hoa', code: 'HS-2026-0101', task: 19, created: '05/08/2026', due: '10/08/2026', done: '12/08/2026' },
    { who: 'tung', code: 'HS-2026-0106', task: 20, created: '14/09/2026', due: '16/09/2026', done: '15/09/2026' },
    { who: 'thu', code: 'HS-2026-0106', task: 19, created: '10/09/2026', due: '15/09/2026', done: '15/09/2026' },
    { who: 'quang', code: 'HS-2026-0101', task: 10, created: '28/07/2026', due: '31/07/2026', done: '30/07/2026' },
    { who: 'binh', code: 'HS-2026-0103', task: 47, created: '02/09/2026', due: '04/09/2026', done: '03/09/2026' },
    { who: 'binh', code: 'HS-2026-0077', task: 47, created: '24/07/2026', due: '28/07/2026', done: '27/07/2026' },
    { who: 'tgd', code: 'HS-2026-0103', task: 60, created: '16/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'tgd', code: 'HS-2026-0077', task: 60, created: '10/08/2026', due: '13/08/2026', done: '13/08/2026' },
    { who: 'tgd', code: 'HS-2026-0074', task: 60, created: '04/08/2026', due: '07/08/2026', done: '06/08/2026' },
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
    /* MS01.02 / MS01.03 — docs/dtms/prototype-MS01-02-03-chuan-bi.md §7. flows: chỉ gắn lên màn khi hồ sơ theo quy trình đó. */
    'P-17': { q: 'MS01.03: góp ý dự thảo bằng BM-04 hay trao đổi không cần văn bản', src: 'GAP-31; QT B8.3', def: 'BM-04, theo MS01 v1.1 (task 19–23, 36); Diễn giải BA v1.2 §B.5 cũng vậy', scr: 'SCR-11', flows: ['MS01.03'] },
    'P-18': { q: 'MS01.03: bị trả lại sau khi đã ký (TTMS, Phó TGĐ, Thủ trưởng) thì quay về đâu', src: 'BRD Q-03; URD §12 #25', def: 'Về task 25 → 26: ĐVĐX cập nhật BM-09 rồi CQCM kiểm tra, ký lại BM-04 + Checklist 02 (MS01 v1.1)', scr: 'SCR-12', flows: ['MS01.03'] },
    'P-19': { q: 'Tên văn bản ở B9–B10: "BM-01B" hay BM-09', src: 'URD §6.5', def: 'BM-09, theo MS01 v1.1 và Diễn giải BA v1.2', scr: 'SCR-08', flows: ['MS01.03'] },
    'P-20': { q: 'Thành phần và thứ tự ký BM-09: chỉ TTMS ‖ Phó TGĐ (v1.1) hay thêm ô CQCM TCKT, CQCM liên quan như mẫu; Phó TGĐ ký song song hay "tiếp tục" ký sau; một bên từ chối khi bên kia chưa ký thì trả ngay hay chờ đủ', src: 'Task 38, 39; BM-09; Diễn giải BA §C.3.3, D.2 #1', def: 'TTMS ‖ Phó TGĐ luôn ký, song song; TCKT và CQCM liên quan thể hiện qua BM-04 + Checklist 02; một bên không đồng ý thì trả hồ sơ ngay (như BM-05, P-11)', scr: 'SCR-23', flows: ['MS01.03'] },
    'P-21': { q: 'KPI MS01.03: ngưỡng 10 NLV và mốc bắt đầu tính', src: 'QT; QĐ 16026/QĐ-VHT; v1.1 không ghi', def: '10 NLV, từ task 18 (gửi CQCM) đến task 60 — cùng quy ước với P-15', scr: 'SCR-24', flows: ['MS01.03'] },
    'P-23': { q: 'Task 34 "Yêu cầu xử lý lại" chỉ vẽ nối về task 12 (≥ 160 tỷ); nhánh < 160 tỷ chưa vẽ', src: 'BPMN v1.1 task 34', def: '< 160 tỷ về task 11 (dự thảo BM-09)', scr: 'SCR-14', flows: ['MS01.03'] },
    'P-24': { q: 'MS01.02 không có nhánh riêng trên v1.1 (trang MS01.02 trong file là bản cũ 37 task)', src: 'URD §6.4; Diễn giải BA v1.2 §C.2', def: 'Nhánh ≥ 160 tỷ của v1.1, task 48 luôn "Không báo cáo Tập đoàn" (bỏ 49–56)', scr: 'SCR-16', flows: ['MS01.02'] },
    'P-25': { q: '< 160 tỷ: CQCM Tài chính bắt buộc (QT B8.2) do hệ thống khoá hay do TTMS kiểm soát ở task 17', src: 'QT B8.2; N07; Diễn giải BA D.2 #2', def: 'Hệ thống tích sẵn và khoá Ban Tài chính; TTMS vẫn xác nhận toàn bộ danh sách', scr: 'SCR-22', flows: ['MS01.03'] },
    'P-22': { q: 'Vòng giải trình: ≤ 2 vòng quay về chỉ huy ĐVĐX (task 13) rồi gửi lại CQCM, không còn bước TTMS xét giải trình; ghi chú N04 vẫn ghi "TTMS xem xét"', src: 'BPMN v1.1 task 28, 29, 13; N04', def: 'Theo hình vẽ v1.1', scr: 'SCR-13' },
    'P-26': { q: 'Người dùng chọn quy trình khi tạo hồ sơ (khác hình vẽ gốc: hệ thống tự phân luồng). Kèm: (a) chuyển quy trình thì hồ sơ mới vào thẳng bước sau báo giá hay làm lại từ task 1; (b) ngưỡng 160 tỷ tính trên tổng nào', src: 'Chốt nội bộ 28/09/2026; BPMN MS01 v1.1 N08, task 10a, 10b', def: 'Chọn tay ở SCR-25, start ngay khi Lưu; chuyển quy trình tạo hồ sơ mới của cùng ĐXMS, làm lại từ task 1 với dữ liệu đã sao chép sẵn; ngưỡng tính trên tổng kinh phí gồm VAT sau khi trừ tồn kho', scr: 'SCR-25' },
    /* Mô hình ĐXMS ↔ Hồ sơ (D-10…D-12) — docs/dtms/prototype-DXMS-ho-so-chuan-bi.md §5. */
    'P-63': { q: 'MS02 có tách ba quy trình MS02.01 / .02 / .03 như MS01 (P-37) không', src: 'Diễn giải MS02 §B.3; P-37', def: 'Một quy trình MS02 (trang MS02 ver1.1 gộp ba luồng con)', scr: 'SCR-25' },
    'P-64': { q: 'Hồ sơ Phê duyệt kết thúc theo chỉ đạo khác: ĐXMS có được tạo hồ sơ Phê duyệt mới không, hay ĐXMS cũng dừng', src: '—', def: 'Được tạo hồ sơ Phê duyệt mới', scr: 'SCR-25' },
    'P-65': { q: 'Sửa ĐXMS khi đang có hồ sơ chạy: trường nào bị khoá; thông tin trên ĐXMS và trên hồ sơ (task 04) lệch nhau thì lấy bên nào', src: '—', def: 'Sửa được trừ Mã ĐXMS và giá trị hiệu lực; hồ sơ giữ thông tin lúc tạo', scr: 'SCR-28' },
    'P-66': { q: 'Giá trị hiệu lực của ĐXMS lấy từ hồ sơ Hoàn thành gần nhất (kể cả hồ sơ Điều chỉnh)', src: 'Diễn giải MS02 §B.2 (giá trị sau điều chỉnh)', def: 'Như vậy; chưa có hồ sơ Hoàn thành thì dùng giá trị dự kiến', scr: 'SCR-29' },
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
    /* P-37 đã chốt 2026-09-28: MS01.01 / .02 / .03 là ba quy trình riêng (Locked decision "MS01 deploy"). */
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
      { label: 'Danh sách ĐXMS', path: 'dxms', scr: 'SCR-27' },
      { label: 'Hồ sơ ĐXMS', path: 'ho-so-dxms', scr: 'SCR-02' },
      { label: 'Yêu cầu báo giá', path: 'ph/ycbg', uc: ['UC-07-03'] },
      { label: 'Cơ sở giá', path: 'ph/co-so-gia', uc: ['UC-07-04'] }] },
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
    { id: 'qd4', no: '1876/QĐ-TĐ', date: '14/04/2026', title: 'Phê duyệt Phương án kinh doanh "Sản xuất module RRU 5G giai đoạn 2026–2028"', type: 'pakd', group: true, value: 420.0, remain: 205.3 },
    { id: 'qd5', no: '0412/QĐ-VHT', date: '15/01/2026', title: 'Phê duyệt Kế hoạch SXKD năm 2026 của Trung tâm Vô tuyến', type: 'khsx', group: false, value: 320.0, remain: 58.6 },
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

  /* ---------- Dữ liệu theo hồ sơ chạy luồng (T6 — plan MS01.02/.03 §3.3, §8.3 việc 3) ----------
     Mỗi ĐXMS demo có bộ dữ liệu riêng; D.useCase(mã ĐXMS) gán bộ dữ liệu của hồ sơ đang chạy vào các khoá D.caseInfo, D.items…
     (Flow gọi khi tạo / nạp hồ sơ). ĐXMS khác (tạo trên prototype) dùng bộ dữ liệu của ĐXMS-2026-0117.
     ref: basisType/basisDoc — căn cứ chọn sẵn ở task 01; cqcm — CQCM chọn sẵn ở task 16; purposeCode — mục đích ở task 04;
     rstk, ebom, src — mã kết quả rà soát tồn kho, tệp eBOM/dự toán, nguồn bóc tách; quoteFailFirst — lần YCBG đầu Không đạt;
     doc — nội dung Tờ trình (BM-01 / BM-09); giá trị dạng mảng [v1, v2] = trước / sau hoàn chỉnh ở task 27. */
  const CASE_KEYS = ['caseInfo', 'items', 'aiBasic', 'aiEstimate', 'tree', 'usedIn', 'quotes', 'checklist', 'opinions', 'responses', 'versionDiff', 'bm05'];
  const pick = () => CASE_KEYS.reduce((o, k) => { o[k] = D[k]; return o; }, {});
  D.demoCases = {};
  D.demoCases[D.dxmsCode0] = Object.assign(pick(), { ref: {
    basisType: 'khcn', basisDoc: 'qd1', cqcm: ['PC', 'TC', 'CL'], purposeCode: 'KHCN', rstk: 'RSTK-2026-0311', ebom: 'eBOM-gNodeB-G2-Do-kiem.xlsx',
    src: 'eBOM dự án gNodeB-G2', quoteFailFirst: true, group2Note: 'Kèm chỉ tiêu kỹ thuật và bản vẽ buồng đo (tệp BOM).',
    doc: {
      necessity: 'Nhiệm vụ gNodeB thế hệ 2 bước vào giai đoạn thử nghiệm hệ thống (2027). Năng lực đo kiểm RF/OTA hiện có chỉ đáp ứng 30% nhu cầu, phải thuê ngoài khoảng 14 tỷ đồng/năm.',
      total: '<b>182.900.000.000 đồng</b> <i>(Một trăm tám mươi hai tỷ, chín trăm triệu đồng)</i>. Trong đó: thiết bị 173,90 tỷ; dịch vụ 9,00 tỷ.',
      tech: 'Thiết bị đo đến 44 GHz, hỗ trợ FR1/FR2; buồng đo OTA đạt chuẩn 3GPP TS 38.141-2.',
      stock: 'Đơn vị sử dụng 06 bộ kit hiệu chuẩn tồn kho khả dụng theo kết quả rà soát RSTK-2026-0311; số lượng đề xuất mua giảm tương ứng.',
      measures: ['Tổ chức lựa chọn nhà thầu theo quy định', 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)'],
      plan: 'LCNT: 01–03/2027 · Ký HĐ: 04/2027 · Giao hàng, nghiệm thu: 05–09/2027.',
      files: ['1482-QD-VHT.pdf (căn cứ)', 'Bao-gia-Alpha.pdf, Bao-gia-Beta.pdf, Bao-gia-Gamma.pdf', 'RSTK-2026-0311.xlsx (kết quả tồn kho)', 'eBOM-gNodeB-G2-Do-kiem.xlsx'],
    },
  } });

  /* MS01.02 — ĐXMS-2026-0124: căn cứ PAKD đã được TGĐ Tập đoàn duyệt; ≥ 160 tỷ; task 48 luôn "Không" (P-24). */
  D.demoCases['ĐXMS-2026-0124'] = {
    caseInfo: { title: 'Mua sắm hệ thống đo kiểm sản xuất loạt module RRU 5G', unit: 'Trung tâm Vô tuyến',
      basis: 'Phương án kinh doanh "Sản xuất module RRU 5G giai đoạn 2026–2028" (1876/QĐ-TĐ, đã được TGĐ Tập đoàn duyệt)', basisApprovedByGroup: true,
      purpose: 'Liên tục SXKD', secret: false, priority: 'Thường', fund: 'Vốn SXKD năm 2027', period: '02/2027 – 10/2027', total: 176.4 },
    items: [
      { n: 1, name: 'Hệ thống đo kiểm tự động cuối dây chuyền (ATE)', uom: 'Hệ thống', bom: 4, used: 0, prop: 4, stock: 0, buy: 4, price: 24.5, amount: 98, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 2, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 12, used: 0, prop: 12, stock: 0, buy: 12, price: 3.2, amount: 38.4, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 3, name: 'Buồng che chắn RF sản xuất', uom: 'Bộ', bom: 10, used: 0, prop: 10, stock: 0, buy: 10, price: 3.6, amount: 36, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 4, name: 'Dịch vụ tích hợp, chuyển giao', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 4, amount: 4, group: 1, goods: 'DVPTV', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục đích', value: 'Trang bị hệ thống đo kiểm cuối dây chuyền cho sản xuất loạt module RRU 5G theo Phương án kinh doanh 1876/QĐ-TĐ.', from: 'PAKD 1876/QĐ-TĐ, mục 3' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 04 hệ thống ATE, 12 máy phân tích phổ, 10 buồng che chắn RF, 01 gói dịch vụ tích hợp, chuyển giao.', from: 'Dự toán PAKD, hạng mục Đầu tư dây chuyền' },
      { key: 'value', label: 'Giá trị dự kiến', value: 'Khoảng 176 tỷ đồng (gồm VAT)', from: 'Dự toán PAKD, phần còn lại 205,3 tỷ' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn SXKD, kế hoạch năm 2027', code: 'SXKD', from: 'PAKD 1876/QĐ-TĐ, mục 6' },
      { key: 'period', label: 'Thời gian thực hiện', value: '02/2027 – 10/2027', from: 'Tiến độ PAKD, giai đoạn 2' },
    ],
    aiEstimate: 176,
    tree: [{ name: 'PAKD module RRU 5G 2026–2028', children: [{ name: 'Dây chuyền đo kiểm', lines: [1, 3] }, { name: 'Thiết bị đo', lines: [2] }, { name: 'Dịch vụ', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '12/10/2026', valid: '12/01/2027', prices: { 1: 24.5, 2: 3.2, 3: 3.72, 4: 4.0 } },
      { ncc: 'NCC-000002', date: '13/10/2026', valid: '13/01/2027', prices: { 1: 25.1, 2: 3.35, 3: 3.6, 4: 4.3 } },
      { ncc: 'NCC-000003', date: '12/10/2026', valid: '20/01/2027', prices: { 1: 24.9, 2: 3.28, 3: 3.65, 4: 4.2 } },
    ],
    checklist: [
      { g: 'I', name: 'Văn bản căn cứ (PAKD đã được TGĐ Tập đoàn duyệt)', no: '1876/QĐ-TĐ', req: 'Bắt buộc', by: 1 },
      { g: 'I', name: 'Tờ trình đề xuất mua sắm (BM-01)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
      { g: 'II', name: 'Phụ lục chi phí, cơ sở đơn giá', no: '3 báo giá', req: 'Bắt buộc', by: 10 },
      { g: 'II', name: 'Kết quả rà soát tồn kho', no: 'RSTK-2026-0342', req: 'Bắt buộc', by: 7 },
      { g: 'II', name: 'Thuyết minh (BM-02)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
      { g: 'III', name: 'Hợp đồng tương tự', no: '—', req: 'Nếu có', by: null },
    ],
    opinions: {
      TC: { 'Nguồn vốn': { ok: false, text: 'Cần ghi rõ nguồn vốn thuộc kế hoạch vốn SXKD năm 2027 đã giao cho Trung tâm.', guide: 'Bổ sung số, ngày văn bản giao kế hoạch vốn tại mục "Nguồn vốn" của BM-01.' } },
      PC: { 'Căn cứ': { ok: true } },
      CL: { 'Phương án kỹ thuật – công nghệ': { ok: true } },
    },
    responses: { TC: { decision: 'Tiếp thu', text: 'Bổ sung: kế hoạch vốn SXKD năm 2027 giao tại văn bản 2215/VHT-KH.', ref: 'BM-01 mục 7' } },
    versionDiff: [{ field: 'BM-01 · Nguồn vốn', from: 'Vốn SXKD năm 2027', to: 'Vốn SXKD năm 2027, kế hoạch vốn giao tại văn bản 2215/VHT-KH' }],
    bm05: [
      ['Tuân thủ quy định', 'Hồ sơ lập theo QT 10.2.1; căn cứ PAKD 1876/QĐ-TĐ đã được TGĐ Tập đoàn phê duyệt, còn hiệu lực.'],
      ['Sự cần thiết', 'Đáp ứng công suất đo kiểm cho sản xuất loạt module RRU 5G từ quý II/2027.'],
      ['Phạm vi, số lượng, tồn kho', 'Không có tồn kho khả dụng (RSTK-2026-0342); số lượng theo dự toán PAKD.'],
      ['Giá trị', '176,40 tỷ đồng gồm VAT; cơ sở giá từ 3 báo giá hợp lệ.'],
      ['Nguồn vốn', 'Vốn SXKD năm 2027 theo kế hoạch vốn đã giao.'],
      ['Biện pháp, kế hoạch', 'Áp dụng Quy chế LCNT của Tập đoàn; thực hiện 02–10/2027.'],
      ['Báo cáo Tập đoàn', 'Không báo cáo: căn cứ đã được TGĐ Tập đoàn phê duyệt (MS01.02).'],
    ],
    ref: { basisType: 'pakd', basisDoc: 'qd4', cqcm: ['PC', 'TC', 'CL'], purposeCode: 'SX', rstk: 'RSTK-2026-0342', ebom: 'Du-toan-PAKD-RRU5G.xlsx',
      src: 'Dự toán PAKD 1876/QĐ-TĐ', quoteFailFirst: false, group2Note: 'Kèm chỉ tiêu kỹ thuật dây chuyền ATE và buồng che chắn.',
      doc: {
        necessity: 'Kế hoạch sản xuất loạt module RRU 5G năm 2027 cần 04 dây chuyền đo kiểm cuối; năng lực hiện có chỉ đáp ứng một dây chuyền thử nghiệm.',
        total: '<b>176.400.000.000 đồng</b> <i>(Một trăm bảy mươi sáu tỷ, bốn trăm triệu đồng)</i>. Trong đó: thiết bị 172,40 tỷ; dịch vụ 4,00 tỷ.',
        tech: 'Hệ thống ATE đo đồng thời 8 cổng RF; buồng che chắn đạt suy hao ≥ 80 dB đến 6 GHz.',
        stock: 'Không có hàng tồn kho khả dụng theo kết quả rà soát RSTK-2026-0342.',
        fund: ['Vốn SXKD năm 2027', 'Vốn SXKD năm 2027, kế hoạch vốn giao tại văn bản 2215/VHT-KH'],
        measures: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)',
        plan: 'LCNT: 02–04/2027 · Ký HĐ: 05/2027 · Giao hàng, nghiệm thu: 06–10/2027.',
        files: ['1876-QD-TD.pdf (căn cứ)', 'Bao-gia-Alpha.pdf, Bao-gia-Beta.pdf, Bao-gia-Gamma.pdf', 'RSTK-2026-0342.xlsx (kết quả tồn kho)', 'Du-toan-PAKD-RRU5G.xlsx'],
      } },
  };

  /* MS01.03 — ĐXMS-2026-0098: < 160 tỷ, căn cứ Kế hoạch SXKD năm; BM-09 + Checklist 02; góp ý bằng BM-04 (P-17); 2 CQCM (Tài chính bắt buộc — P-25).
     Dòng 3 dùng 2 bộ kit tồn kho — chính là 2 bộ hồ sơ MS01.01 thấy "đang giữ cho ĐXMS-2026-0098". */
  D.demoCases['ĐXMS-2026-0098'] = {
    caseInfo: { title: 'Mua sắm linh kiện RF cho mẫu thử nghiệm', unit: 'Trung tâm Vô tuyến',
      basis: 'Kế hoạch SXKD năm 2026 của Trung tâm Vô tuyến (0412/QĐ-VHT, nguồn Dự toán)', basisApprovedByGroup: false,
      purpose: 'Liên tục SXKD', secret: false, priority: 'Thường', fund: 'Chi phí SXKD năm 2026', period: '11/2026 – 03/2027', total: 45.2 },
    items: [
      { n: 1, name: 'Bộ linh kiện RF front-end', uom: 'Bộ', bom: 200, used: 0, prop: 200, stock: 0, buy: 200, price: 0.085, amount: 17, group: 1, goods: 'VTCNTT', cost: 'Hàng hoá' },
      { n: 2, name: 'Module khuếch đại công suất GaN', uom: 'Bộ', bom: 120, used: 0, prop: 120, stock: 0, buy: 120, price: 0.13, amount: 15.6, group: 1, goods: 'VTCNTT', cost: 'Hàng hoá' },
      { n: 3, name: 'Bộ kit hiệu chuẩn', uom: 'Bộ', bom: 2, used: 0, prop: 2, stock: 8, book: 8, held: 0, buy: 0, price: 0.35, amount: 0, group: null, goods: 'VTCNTT', cost: 'Hàng hoá' },
      { n: 4, name: 'Dịch vụ gia công vỏ cơ khí mẫu', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 12.6, amount: 12.6, group: 1, goods: 'NCSX', cost: 'Chi phí SXKD' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục đích', value: 'Cung cấp linh kiện RF và gia công vỏ cơ khí cho lô mẫu thử nghiệm module RRU theo Kế hoạch SXKD năm 2026.', from: 'Kế hoạch SXKD 0412/QĐ-VHT, mục II.3' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 200 bộ linh kiện RF front-end, 120 module khuếch đại GaN, 02 bộ kit hiệu chuẩn (dùng tồn kho), 01 gói gia công vỏ cơ khí.', from: 'Dự toán Kế hoạch SXKD 2026, nhóm Vật tư mẫu thử' },
      { key: 'value', label: 'Giá trị dự kiến', value: 'Khoảng 45 tỷ đồng (gồm VAT)', from: 'Dự toán Kế hoạch SXKD 2026, phần còn lại 58,6 tỷ' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Chi phí SXKD năm 2026', code: 'SXKD', from: 'Kế hoạch SXKD 0412/QĐ-VHT, mục IV' },
      { key: 'period', label: 'Thời gian thực hiện', value: '11/2026 – 03/2027', from: 'Tiến độ Kế hoạch SXKD 2026' },
    ],
    aiEstimate: 45,
    tree: [{ name: 'Kế hoạch SXKD 2026 — Vật tư mẫu thử', children: [{ name: 'Linh kiện RF', lines: [1, 2] }, { name: 'Hiệu chuẩn', lines: [3] }, { name: 'Gia công cơ khí', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '20/10/2026', valid: '20/01/2027', prices: { 1: 0.085, 2: 0.134, 4: 12.6 } },
      { ncc: 'NCC-000002', date: '21/10/2026', valid: '21/01/2027', prices: { 1: 0.089, 2: 0.13, 4: 13.1 } },
      { ncc: 'NCC-000003', date: '20/10/2026', valid: '15/02/2027', prices: { 1: 0.087, 2: 0.132, 4: 12.9 } },
    ],
    /* Checklist 02: nhóm I Văn bản trình ký, nhóm II Văn bản đính kèm (plan §6.2). */
    checklist: [
      { g: 'I', name: 'Tờ trình BM-09 kèm phụ lục chi phí', no: 'Dự thảo', req: 'Bắt buộc', by: 11 },
      { g: 'I', name: 'Thuyết minh (BM-02)', no: 'Dự thảo', req: 'Tuỳ chọn', by: 11 },
      { g: 'I', name: 'Checklist 02', no: 'Dự thảo', req: 'Bắt buộc', by: 11 },
      { g: 'II', name: 'Tài liệu đầu vào (Kế hoạch SXKD năm, kết quả rà soát tồn kho)', no: '0412/QĐ-VHT · RSTK-2026-0287', req: 'Bắt buộc', by: 7 },
      { g: 'II', name: 'Sở cứ giá', no: '3 báo giá', req: 'Bắt buộc', by: 10 },
      { g: 'II', name: 'Tài liệu khác', no: '—', req: 'Tuỳ chọn', by: null },
    ],
    opinions: {
      TC: { 'Giá trị & cơ sở giá': { ok: false, text: 'Dịch vụ gia công vỏ cơ khí là chi phí SXKD, chưa tách khỏi chi phí mua sắm hàng hoá.', guide: 'Tách dòng 4 sang mục "Chi phí sản xuất kinh doanh" trong cơ cấu chi phí BM-09.' }, 'Nguồn vốn': { ok: true } },
      CL: { 'Phương án kỹ thuật – công nghệ': { ok: true } },
    },
    responses: { TC: { decision: 'Tiếp thu', text: 'Tách dòng 4 (12,60 tỷ) sang mục "Chi phí sản xuất kinh doanh" trong cơ cấu chi phí BM-09.', ref: 'BM-09 mục 4; Phụ lục chi phí',
      keepText: 'Gia công vỏ cơ khí là một phần của mẫu thử, đề nghị giữ trong chi phí mua sắm.' } },
    versionDiff: [
      { field: 'BM-09 · Tổng kinh phí', from: 'Hàng hoá, dịch vụ: 45,20 tỷ', to: 'Mua sắm hàng hoá 32,60 tỷ; chi phí SXKD 12,60 tỷ (dòng 4)' },
      { field: 'Phụ lục chi phí · Loại chi phí', from: '(không có cột)', to: 'Thêm cột "Loại chi phí": dòng 4 là Chi phí SXKD' },
    ],
    bm05: [],
    ref: { basisType: 'khsx', basisDoc: 'qd5', cqcm: ['TC', 'CL'], purposeCode: 'SX', rstk: 'RSTK-2026-0287', ebom: 'Du-toan-KH-SXKD-2026.xlsx',
      src: 'Dự toán Kế hoạch SXKD 2026 (0412/QĐ-VHT)', quoteFailFirst: false, group2Note: '',
      doc: {
        necessity: 'Lô mẫu thử nghiệm module RRU (quý I/2027) cần linh kiện RF front-end, module khuếch đại GaN và vỏ cơ khí theo thiết kế mới; kho chỉ còn đủ kit hiệu chuẩn.',
        total: ['<b>45.200.000.000 đồng</b> <i>(Bốn mươi lăm tỷ, hai trăm triệu đồng)</i>. Trong đó: hàng hoá, dịch vụ 45,20 tỷ.',
          '<b>45.200.000.000 đồng</b> <i>(Bốn mươi lăm tỷ, hai trăm triệu đồng)</i>. Trong đó: mua sắm hàng hoá 32,60 tỷ; chi phí sản xuất kinh doanh 12,60 tỷ (gia công vỏ cơ khí).'],
        tech: 'Linh kiện RF băng n78/n79; module GaN công suất ra 40 W; vỏ nhôm đúc đạt IP65.',
        stock: 'Đơn vị sử dụng 02 bộ kit hiệu chuẩn tồn kho khả dụng theo kết quả rà soát RSTK-2026-0287; không đề xuất mua dòng 3.',
        measures: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)',
        plan: 'LCNT: 11–12/2026 · Ký HĐ: 12/2026 · Giao hàng, nghiệm thu: 01–03/2027.',
        files: ['0412-QD-VHT.pdf (căn cứ)', 'Bao-gia-Alpha.pdf, Bao-gia-Beta.pdf, Bao-gia-Gamma.pdf', 'RSTK-2026-0287.xlsx (kết quả tồn kho)', 'Du-toan-KH-SXKD-2026.xlsx'],
      } },
  };
  D.useCase = (dxms) => {
    const c = D.demoCases[dxms] || D.demoCases[D.dxmsCode0];
    CASE_KEYS.forEach((k) => { D[k] = c[k]; });
    D.caseRef = c.ref;
  };
  D.useCase(D.dxmsCode0);
  /* Có ý kiến Không OK mà ĐVĐX chọn "Không đồng ý" (bảo lưu) → task 26 đi nhánh lập giải trình. u = Flow.ui (lựa chọn trên SCR-12). */
  D.keepAny = (u) => Object.keys(D.responses).some((c) => (((u || {}).resp || {})[c] || D.responses[c].decision) === 'Bảo lưu');

  /* Bộ demo (công cụ demo › Chọn hồ sơ demo, plan §8.1): mỗi bộ = một ĐXMS + quy trình, cảnh (§3.4) và nhánh phụ. Cảnh start 'NEW' mở SCR-25. */
  D.demoSets = [
    { key: 'MS01.01', dxms: D.dxmsCode0, label: 'ĐXMS-2026-0117 · MS01.01', scenes: D.scenes, branches: [
      { name: 'Chọn nhầm quy trình MS01.03 → chuyển quy trình (B-3e)', tasks: '10 → 10a → 10b', task: '10a', who: 'minh', process: 'MS01.03' },
      { name: 'Chỉ huy ĐVĐX không đồng ý', tasks: '13 → 14 → 12', task: 13, who: 'hai' },
      { name: 'TTMS trả lại danh sách CQCM', tasks: '17 → 16', task: 17, who: 'lan' },
      { name: 'Giải trình vòng 3/2 → cảnh báo, họp', tasks: '28 → 29–34', task: 28, who: 'minh', vars: { round: 2 } },
      { name: 'TTMS chọn Không báo cáo Tập đoàn', tasks: '48 → 57', task: 48, who: 'lan' },
      { name: 'Thủ trưởng VHT yêu cầu hoàn chỉnh', tasks: '60 → 25 → 26', task: 60, who: 'tgd' }] },
    { key: 'MS01.02', dxms: 'ĐXMS-2026-0124', label: 'ĐXMS-2026-0124 · MS01.02', scenes: [
      { n: '2-1', name: 'Chọn quy trình MS01.02, căn cứ đã được TĐ duyệt', start: 'NEW', tasks: '—, 01, 10', who: 'minh' },
      { n: '2-2', name: 'Không báo cáo Tập đoàn', start: 48, tasks: '48', who: 'lan' },
      { n: '2-3', name: 'Phê duyệt (BM-08 không kèm BM-06, BM-07)', start: 58, tasks: '57–61', who: 'lan' },
      { n: '2-4', name: 'Tổng kết', start: 'END', tasks: '—', who: 'lan' }], branches: [] },
    { key: 'MS01.03', dxms: 'ĐXMS-2026-0098', label: 'ĐXMS-2026-0098 · MS01.03', scenes: [
      { n: '3-1', name: 'Tạo hồ sơ MS01.03, căn cứ Kế hoạch SXKD', start: 'NEW', tasks: '—, 01–10', who: 'minh' },
      { n: '3-2', name: 'Dự thảo BM-09 + Checklist 02, chọn CQCM', start: 11, tasks: '11, 13, 15–18', who: 'minh' },
      { n: '3-3', name: 'Góp ý BM-04', start: 19, tasks: '19–25', who: 'thu' },
      { n: '3-4', name: 'Hoàn chỉnh, ký lại BM-04 + Checklist 02', start: 26, tasks: '26, 27, 35–37', who: 'minh' },
      { n: '3-5', name: 'TTMS ‖ Phó TGĐ ký BM-09', start: 38, tasks: '38–40', who: 'lan' },
      { n: '3-6', name: 'Thủ trưởng phê duyệt trên BM-09', start: 60, tasks: '60–61', who: 'tgd' },
      { n: '3-7', name: 'Tổng kết', start: 'END', tasks: '—', who: 'tgd' }], branches: [
      { name: 'Thủ trưởng yêu cầu hoàn chỉnh (B-3a)', tasks: '60 → 25 → 26', task: 60, who: 'tgd' },
      { name: 'Phó TGĐ không đồng ý BM-09 (B-3b)', tasks: '39 → 25 → 26', task: 39, who: 'binh' },
      { name: 'TTMS trả lại danh sách CQCM (B-3c)', tasks: '17 → 16', task: 17, who: 'lan' },
      { name: 'Không đồng ý sửa → giải trình vòng 3/2, họp (B-3d)', tasks: '28 → 29–34', task: 28, who: 'minh', vars: { round: 2 }, ui: { resp: { TC: 'Bảo lưu' } } }] },
  ];
  D.demoSets.forEach((d) => { if (d.key !== 'MS01.01') d.branches.forEach((b) => { b.process = d.key; b.dxms = d.dxms; }); });

  window.D = D;
})();
