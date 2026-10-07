/*
 * Dữ liệu tĩnh của prototype ĐTMS.
 * Nguồn: docs/dtms/prototype-MS01-chuan-bi.md (persona §2.2, hồ sơ mẫu §2.3, cảnh §2.4, màn §4, điểm ❓ §6),
 *        menu theo 12 module Backlog (D-15, BA-TD), use-case-dtms.md, BPMN chuẩn ĐTMS.drawio / MS01 v1.1 (61 task, xem bpmn-tasks.js).
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
    /* Tài khoản demo toàn quyền (all): thấy mọi việc đang chờ, xử lý thay mọi vai, vào mọi màn quản trị. Không phải vai nghiệp vụ. */
    { id: 'admin', name: 'Tài khoản toàn quyền', short: 'Toàn quyền', role: 'Toàn quyền (demo)', unit: 'Tài khoản demo — không phải vai nghiệp vụ', urd: '—', actor: '—', all: true },
    { id: 'td', name: 'Ban ĐTXD Tập đoàn', short: 'Tập đoàn', role: 'Ban ĐTXD + TGĐ Tập đoàn (giả lập)', unit: 'Tập đoàn — không đăng nhập thật', urd: 'R-BAN-DTXD, R-TGD-TD', actor: 'A08', simulated: true },
  ];

  /* Vai có cờ all (Tài khoản toàn quyền) qua mọi kiểm tra quyền và thấy toàn bộ dữ liệu. */
  D.allAccess = (pid) => !!(D.personas.find((p) => p.id === pid) || {}).all;

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
      { label: 'Báo giá đạt', to: 'gQuote', main: true },
      { label: 'Không đạt — gửi lại YCBG', to: 9, kind: 'secondary' }] },
    /* DX-03 (duyệt 2026-10-07, chờ BA): cổng "Báo giá đạt?" đọc thêm kết quả AI kiểm tra báo giá (vars.quoteAi, ghi trước khi hoàn thành task 10). */
    gQuote: { gw: true, when: (v) => (v.quoteAi === false ? 9 : 'gValue') },
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
    /* DX-02 (duyệt 2026-10-07, chờ BA): một nút "Hoàn thành"; gateway rẽ nhánh theo biến coBaoLuu (bảng quyết định trong eForm task 26). */
    26: { who: 'minh', scr: 'SCR-12', nlv: 0.5, next: 'g26', actionLabel: 'Hoàn thành' },
    g26: { gw: true, when: (v, u) => (v.round === 0 && D.keepAny(u) ? 28 : 27) },
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

  /*
   * Luồng MS13-TO BE (plan KĐT §1.2; mũi tên trong BPMN_FLOWS.MS13). B2: cụm A–B (task 1–13) + cổng phân luồng, cổng báo giá, cổng gộp.
   * B3: cụm C (14–16), F (36–44) và khối thẩm định E (22–35) — nhánh hai giai đoạn chạy khối E trong quy trình con 41.
   * B4: cụm G (45–54, khối E chạy lại trong quy trình con 49), nhánh gộp D (17–21 → khối E) và ký H cấp VHT (55–56).
   * Khoá như D.flow, thêm:
   *  when(vars, ui) — cổng chọn nhánh theo biến / lựa chọn trên màn (g4 "Cả 02 xác nhận đều OK?", g11 "Cần sửa đổi hoặc giải trình?")
   *  sub         — bước Quy trình con (41, 49): token của khối E mang số bước này
   *  td          — giai đoạn thẩm định của bộ đếm, văn bản, phiên bản (GOP hồ sơ gộp, CT chủ trương, KDT hồ sơ KĐT); cổng gộp đặt GOP / CT, bước 45 đặt KDT
   *  endSub      — ra khỏi quy trình con; bump — tăng bộ đếm của giai đoạn (chk = vòng check ở bước 28, meet = lần họp ở bước 30)
   *  groupGate   — cổng "Tổng mức vốn thực tế thuộc MS13?" (Flow.kdtCheck: ghi Nhóm KĐT + nhánh hồ sơ dự kiến)
   *  mergeGate   — cổng "Mức vốn MS13 AND Nguyên chiếc AND Trang bị nội bộ?" (ghi nhánh hồ sơ)
   *  wip         — task chưa dựng màn: không có nút hành động, tua nhanh dừng ở đây (B4 không còn task wip)
   * Cổng "Báo giá đạt yêu cầu?" nằm sau phân luồng (§1.2a mục 1): ĐVĐX ghi kết quả kiểm tra báo giá ở task 10 (quoteOk), cổng đọc lại sau 11 ‖ 12.
   */
  const K = {
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
      { label: 'Chốt tổng mức vốn, gửi xác nhận', to: 'g2', main: true, set: { quoteOk: true } },
      { label: 'Báo giá chưa đạt yêu cầu', to: 'g2', kind: 'secondary', reason: true, set: { quoteOk: false } }] },
    /* AND: Ban Tài chính xác nhận TSCĐ (11) ‖ TTMS xác nhận 04 yếu tố (12). */
    g2: { gw: true, forkTo: [{ task: 11, who: 'thu' }, { task: 12, who: 'lan' }], group: 'xn' },
    11: { who: 'thu', scr: 'SCR-57', nlv: 1, choices: [
      { label: 'Xác nhận OK', to: 'g3', main: true, set: { tscdOk: true } },
      { label: 'Không OK', to: 'g3', kind: 'danger', reason: true, set: { tscdOk: false } }] },
    12: { who: 'lan', scr: 'SCR-58', nlv: 1, choices: [
      { label: 'Xác nhận OK', to: 'g3', main: true, set: { factorsOk: true } },
      { label: 'Không OK', to: 'g3', kind: 'danger', reason: true, set: { factorsOk: false } }] },
    g3: { gw: true, join: 'xn', next: 'g4' },
    g4: { gw: true, when: (v) => (v.tscdOk && v.factorsOk ? 'g6' : 13) },
    13: { next: 10 },
    g6: { gw: true, groupGate: { yes: 'g5', no: 'X_MS14' } },
    /* DX-03: "Báo giá đạt yêu cầu?" đọc lựa chọn ở bước 10 và kết quả AI kiểm tra báo giá (vars.quoteAi). */
    g5: { gw: true, when: (v) => (v.quoteOk && v.quoteAi !== false ? 14 : 8) },
    /* Ô chữ "MS14,15 – Chuyển xử lý" (không phải End): kết thúc hồ sơ MS13 "Đã chuyển luồng", hồ sơ mới của cùng KĐT theo nhóm đúng (P-53). */
    X_MS14: { gw: true, moves: true, next: 'END_MOVED' },
    14: { who: 'minh', scr: 'SCR-59', next: 15, nlv: 2, actionLabel: 'Hoàn thành dự thảo' },
    15: { next: 16 },
    16: { who: 'minh', scr: 'SCR-59', next: 'g7', nlv: 1, actionLabel: 'Hoàn thiện đề xuất' },
    g7: { gw: true, mergeGate: { yes: 17, no: 36 } },
    /* D. Nhánh gộp BM-00: AI lập dự thảo (17) → ĐVĐX rà soát (18) → xin ý kiến Chỉ huy (19, 20 — BPMN không có cổng Đồng ý / không:
       ĐVĐX tiếp thu ý kiến ở bước 21) → chọn CQCM (21) → TTMS nhận hồ sơ ở bước 24 (khối E, giai đoạn GOP). */
    17: { next: 18 },
    18: { who: 'minh', scr: 'SCR-59', next: 19, nlv: 1, actionLabel: 'Hoàn thành dự thảo BM-00' },
    19: { who: 'minh', scr: 'SCR-59', next: 20, nlv: 0.5, actionLabel: 'Gửi xin ý kiến Chỉ huy' },
    20: { who: 'hai', scr: 'SCR-59', next: 21, nlv: 1, actionLabel: 'Gửi ý kiến cho đơn vị' },
    21: { who: 'minh', scr: 'SCR-60', next: 24, nlv: 0.5, actionLabel: 'Xác nhận danh sách CQCM, gửi thẩm định' },
    /* F. Chủ trương BM-01: lập tờ trình + Checklist 01, kiểm tra độc lập, chọn CQCM / đơn vị chủ trì, trình; 40 (HT/AI) chỉ vẽ nhánh Đạt —
       Không đạt trả lại bước 39 (P-62, DX-01 — task-forms.js). */
    36: { who: 'minh', scr: 'SCR-59', next: 37, nlv: 2, actionLabel: 'Hoàn thành tờ trình chủ trương' },
    37: { who: 'minh', scr: 'SCR-59', next: 38, nlv: 0.5, actionLabel: 'Xác nhận hồ sơ đủ điều kiện trình' },
    38: { who: 'minh', scr: 'SCR-60', next: 39, nlv: 0.5, actionLabel: 'Xác nhận danh sách CQCM' },
    39: { who: 'minh', scr: 'SCR-60', next: 40, nlv: 0.5, actionLabel: 'Trình hồ sơ' },
    40: { next: 41 },
    41: { gw: true, sub: 41, td: 'CT', next: 24 },
    /* E. Khối thẩm định (vẽ cho hồ sơ gộp; 41 / 49 chạy lại). TTMS nhận hồ sơ ở bước 24: cổng "TTMS rà soát hợp lệ & phê duyệt danh sách CQCM?"
       và "Hồ sơ đủ điều kiện thẩm định?" (không có task riêng) là hai nút trả lại của bước này. */
    22: { next: 23 },
    23: { who: 'minh', scr: 'SCR-62', next: 24, nlv: 1, actionLabel: 'Gửi lại hồ sơ' },
    24: { who: 'lan', scr: 'SCR-61', nlv: 1, choices: [
      { label: 'Hoàn thành thẩm định', to: 'g10', main: true },
      { label: 'Hồ sơ chưa đủ điều kiện thẩm định', to: 22, kind: 'secondary', reason: true },
      { label: 'Danh sách CQCM chưa đạt — trả lại', to: 'gBack', kind: 'danger', reason: true }] },
    gBack: { gw: true, when: (v) => (v.sub === 41 ? 'x41b' : v.sub === 49 ? 'x49b' : 21) },
    x41b: { gw: true, endSub: true, next: 38 },
    x49b: { gw: true, endSub: true, next: 48 },
    /* "ĐVĐX cần ý kiến CQCM liên quan?" = đã chọn CQCM phối hợp (bước 38 / 21 / 48). */
    g10: { gw: true, when: () => (window.Flow.cqcmSel().length ? 25 : 'g11') },
    25: { fork: 'cqcm', to: 26 },
    26: { who: 'cqcm:doer', scr: 'SCR-61', next: 'j26', nlv: 1, actionLabel: 'Gửi ý kiến thẩm định' },
    j26: { gw: true, join: 'cqcm', next: 'g11' },
    g11: { gw: true, when: (v, u) => (D.kdtNeedFix(v, u) ? 27 : v.sub === 41 ? 'x41' : v.sub === 49 ? 'x49' : 'g22') },
    27: { next: 28 },
    /* "Đã thống nhất nội dung?" sau bước 28: ĐVĐX tiếp thu, bổ sung toàn bộ → thống nhất, TTMS rà soát lại (24); còn giải trình, bảo lưu → chưa. */
    28: { who: 'minh', scr: 'SCR-62', nlv: 1, bump: 'chk', choices: [
      { label: 'Bổ sung hồ sơ theo ý kiến', to: 'g12', set: { agreed: true, directed: false }, mainWhen: (v) => !!v.directed || !D.kdtCnt(v, 'chk') },
      { label: 'Giải trình, bảo lưu ý kiến', to: 'g12', kind: 'secondary', set: { agreed: false, directed: false }, mainWhen: (v) => !v.directed && D.kdtCnt(v, 'chk') > 0 }] },
    g12: { gw: true, when: (v) => (v.agreed ? 24 : 'g13') },
    /* "Số lần check thẩm định gián tiếp <= 02?" — theo mũi tên đếm lần họp: lần 1, 2 → họp; đủ 02 lần → báo cáo (P-54). */
    g13: { gw: true, when: (v) => (D.kdtCnt(v, 'meet') < 2 ? 29 : 34) },
    29: { who: 'lan', scr: 'SCR-62', nlv: 1, choices: [
      { label: 'Đã thống nhất sau họp', to: 30, main: true, set: { meetOk: true } },
      { label: 'Chưa thống nhất', to: 30, kind: 'secondary', reason: true, set: { meetOk: false } }] },
    30: { bump: 'meet', next: 'g14' },
    g14: { gw: true, when: (v) => (v.meetOk ? 31 : 'g13') },
    31: { who: 'minh', scr: 'SCR-62', next: 32, nlv: 0.5, actionLabel: 'Xác nhận nội dung điều chỉnh' },
    32: { who: 'hai', scr: 'SCR-62', next: 33, nlv: 0.5, actionLabel: 'Xác nhận, cho phép cập nhật hồ sơ' },
    33: { who: 'minh', scr: 'SCR-62', next: 24, nlv: 1, actionLabel: 'Cập nhật hồ sơ, gửi rà soát lại' },
    34: { who: 'lan', scr: 'SCR-62', next: 35, nlv: 0.5, actionLabel: 'Gửi báo cáo Thủ trưởng' },
    35: { who: 'tgd', scr: 'SCR-62', nlv: 1, choices: [
      { label: 'Kết luận, chỉ đạo xử lý tiếp', to: 28, main: true, reason: true, set: { directed: true } },
      { label: 'Chỉ đạo dừng', to: 'END_OTHER', kind: 'danger', reason: true }] },
    x41: { gw: true, endSub: true, next: 42 },
    /* Ký BM-01 (ký trực tiếp, VOffice): TTMS ký thẩm định trên tờ trình (42); cấp VHT (P-56) → Thủ trưởng ký duyệt (44).
       Không ký: chỉ đạo dừng → kết thúc; chỉ đạo xử lý → về cổng gộp sau 16 (§1.2a mục 5, P-61). */
    42: { who: 'lan', scr: 'SCR-21', nlv: 0.5, choices: [
      { label: 'Ký thẩm định trên tờ trình', to: 'g16', main: true, sign: 'BM-01' }] },
    g16: { gw: true, next: 44 },
    44: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký duyệt chủ trương', to: 45, main: true, sign: 'BM-01' },
      { label: 'Không ký — chỉ đạo xử lý', to: 'g7', kind: 'secondary', reason: true },
      { label: 'Không ký — chỉ đạo dừng', to: 'END_OTHER', kind: 'danger', reason: true }] },
    /* G. Hồ sơ KĐT BM-03: AI gợi ý từ chủ trương đã duyệt (45) → lập BM-03 + Checklist 02 (46) → kiểm tra (47) → chọn CQCM (48) → quy trình con 49
       (khối E, giai đoạn KDT) → cấp VHT (P-56) → BM-14 (51): thông qua → Thủ trưởng ký BM-18 (54); chưa thông qua → AI (52) → hoàn chỉnh (53) → 46.
       Cổng "Báo cáo được thông qua?" không có task riêng → hai nút của bước 51. Không ký BM-18 → về cổng gộp (G21, theo mũi tên). */
    45: { td: 'KDT', next: 46 },
    46: { who: 'minh', scr: 'SCR-64', next: 47, nlv: 2, actionLabel: 'Hoàn thành hồ sơ phê duyệt KĐT' },
    47: { who: 'minh', scr: 'SCR-64', next: 48, nlv: 0.5, actionLabel: 'Xác nhận hồ sơ đủ điều kiện trình' },
    48: { who: 'minh', scr: 'SCR-60', next: 49, nlv: 0.5, actionLabel: 'Trình hồ sơ thẩm định KĐT' },
    49: { gw: true, sub: 49, next: 24 },
    x49: { gw: true, endSub: true, next: 'g19' },
    g19: { gw: true, next: 51 },
    51: { who: 'lan', scr: 'SCR-65', nlv: 1, choices: [
      { label: 'Trình báo cáo, dự thảo Quyết định', to: 54, main: true },
      { label: 'Báo cáo chưa được thông qua — yêu cầu hoàn chỉnh', to: 52, kind: 'secondary', reason: true }] },
    52: { next: 53 },
    53: { who: 'minh', scr: 'SCR-62', next: 46, nlv: 1, actionLabel: 'Hoàn chỉnh hồ sơ' },
    54: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký Quyết định phê duyệt KĐT', to: 'END', main: true, sign: 'BM-18' },
      { label: 'Không ký — chỉ đạo xử lý', to: 'g7', kind: 'secondary', reason: true }] },
    /* H. Ký hồ sơ gộp: "Phân cấp: VHT hay xin ý kiến Tập đoàn?" luôn VHT (P-56) → ĐVĐX trình ký (55) → Thủ trưởng ký BM-00 (56).
       "Kết quả phê duyệt / chỉ đạo?" Không → về cổng gộp (theo mũi tên). */
    g22: { gw: true, next: 55 },
    55: { who: 'minh', scr: 'SCR-21', next: 56, nlv: 0.5, actionLabel: 'Trình ký VOffice' },
    56: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký duyệt hồ sơ gộp', to: 'END', main: true, sign: 'BM-00' },
      { label: 'Không ký — chỉ đạo xử lý', to: 'g7', kind: 'secondary', reason: true }] },
  };
  /* Bộ đếm của giai đoạn thẩm định hiện tại (chk, meet) — Flow.tdCount đọc cùng cách. */
  D.kdtCnt = (v, k) => ((v[k] || {})[v.td || 'GOP'] || 0);
  /* Ý kiến thẩm định mẫu theo giai đoạn và lượt TTMS thẩm định (i = 0, 1, …; hết mẫu thì dùng lượt cuối). id = TTMS hoặc mã CQCM.
     fix = cần sửa đổi / giải trình; lựa chọn trên màn (ui.op['td-i-id']) được ưu tiên. */
  D.kdtReview = (td, i) => { const a = ((D.caseRef.review || {})[td]) || []; return a.length ? a[Math.min(i, a.length - 1)] : {}; };
  D.kdtFix = (td, i, id, u) => { const o = ((u || {}).op || {})[td + '-' + i + '-' + id]; return o != null ? o : !!(D.kdtReview(td, i)[id] || {}).fix; };
  /* Cổng "Cần sửa đổi hoặc giải trình?": TTMS hoặc một CQCM phối hợp của lượt vừa thẩm định kết luận cần sửa. */
  D.kdtNeedFix = (v, u) => {
    const td = v.td || 'GOP', i = Math.max(0, window.Flow.tdRound() - 1);
    return ['TTMS'].concat(window.Flow.cqcmSel()).some((id) => D.kdtFix(td, i, id, u));
  };
  /* Định nghĩa luồng theo quy trình (plan KĐT §6 #2): MS01.01 / .02 / .03 chung D.flow; MS13 = trang MS13-TO BE. */
  D.flows = { MS01: F, MS13: K };
  D.familyOf = (process) => (/^MS13/.test(process || '') ? 'MS13' : 'MS01');
  /* Task MS13 hồ sơ không đi qua (timeline "Không áp dụng"): nhánh Tập đoàn (P-56, luôn VHT); sau cổng gộp là nhánh còn lại
     (khối thẩm định 22–35 vẽ cho nhánh gộp, nhánh hai giai đoạn chạy lại qua quy trình con 41 / 49). */
  D.kdtNa = (v) => [43, 50].concat(range(57, 64), v.branch === 'BM00' ? range(36, 54) : v.branch === '2GD' ? range(17, 35).concat([55, 56]) : []);
  /* Ngưỡng phân luồng KĐT: lĩnh vực + tính chất tài sản + [từ, đến dưới) tỷ → nhóm. Mặc định = 4 dòng KĐT của SCR-40 (BBLV 24/09, P-28);
     catalog.js thay bằng ngưỡng đang hoạt động. Hồ sơ giữ bản chụp lúc tạo (như P-34). */
  D.kdtRules = () => [
    { field: 'VTCNTT', asset: '*', from: 0, to: 160, procs: ['MS13'] }, { field: 'KHAC', asset: '*', from: 0, to: 90, procs: ['MS13'] },
    { field: 'VTCNTT', asset: '*', from: 160, to: 1000, procs: ['MS14'] }, { field: 'KHAC', asset: '*', from: 90, to: 500, procs: ['MS14'] }];
  D.kdtGroups = { MS13: 'MS13 · KĐT đơn giản', MS14: 'MS14 · KĐT thông thường', MS15: 'MS15 · KĐT phức tạp' };
  D.kdtBranches = { BM00: 'Gộp BM-00', '2GD': 'Hai giai đoạn (BM-01 → BM-03)' };

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
    'SCR-57': { name: 'Xác nhận hình thành TSCĐ', step: 'T11' }, 'SCR-58': { name: 'Xác nhận 04 yếu tố & kết quả phân luồng', step: 'T11' },
    'SCR-59': { name: 'Soạn dự thảo KĐT', step: 'T11' }, 'SCR-66': { name: 'Thông báo chuyển luồng', step: 'T11' },
    'SCR-60': { name: 'Chọn CQCM, đơn vị chủ trì & trình hồ sơ', step: 'T11' }, 'SCR-61': { name: 'Thẩm định', step: 'T11' },
    'SCR-62': { name: 'Sửa, giải trình, họp', step: 'T11' }, 'SCR-64': { name: 'Lập hồ sơ phê duyệt KĐT', step: 'T11' },
    'SCR-65': { name: 'Báo cáo kết quả thẩm định BM-14 & dự thảo BM-18', step: 'T11' },
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
    { code: 'ĐXMS-2026-0124', nv: 'DA-2026-002', title: 'Mua sắm hệ thống đo kiểm sản xuất loạt module RRU 5G', unit: 'Trung tâm Vô tuyến', est: 176.4, priority: 'Thường', period: '02/2027 – 10/2027', creator: 'Nguyễn Văn Minh', created: '25/09/2026', updated: '25/09/2026', purpose: 'Đo kiểm cuối dây chuyền cho sản xuất loạt module RRU 5G theo PAKD 1876/QĐ-TĐ.' },
    { code: 'ĐXMS-2026-0121', nv: 'KHN-2026-VHT', title: 'Mua sắm máy chủ phục vụ phòng lab AI', unit: 'Trung tâm Phần mềm', est: 12.4, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Lương Thị Hạnh', created: '22/09/2026', updated: '22/09/2026', purpose: 'Bổ sung năng lực tính toán cho phòng lab AI.' },
    { code: 'ĐXMS-2026-0119', nv: 'KHN-2026-VHT', title: 'Mua sắm máy in 3D kim loại cho xưởng mẫu', unit: 'Nhà máy sản xuất thử nghiệm', est: 28.5, priority: 'Thường', period: '01/2027 – 06/2027', creator: 'Phan Văn Lộc', created: '21/09/2026', updated: '21/09/2026', purpose: 'Chế tạo nhanh chi tiết cơ khí cho mẫu thử.' },
    { code: 'ĐXMS-2026-0110', nv: 'KHN-2026-TTVT', title: 'Mua sắm bộ đàm chuyên dụng cho đội thử nghiệm hiện trường', unit: 'Trung tâm Vô tuyến', est: 6.8, priority: 'Khẩn', period: '10/2026 – 12/2026', creator: 'Nguyễn Văn Minh', created: '15/09/2026', updated: '15/09/2026' },
    { code: 'ĐXMS-2026-0106', nv: 'KHN-2026-VHT', title: 'Mua sắm phần mềm thiết kế mạch in và mô phỏng tín hiệu', unit: 'Trung tâm Thiết kế vi mạch', est: 21.3, priority: 'Thường', period: '11/2026 – 12/2026', creator: 'Trịnh Quốc Việt', created: '01/09/2026', updated: '01/09/2026' },
    { code: 'ĐXMS-2026-0103', nv: 'NV-KHCN-2025-031', title: 'Mua sắm hệ thống mô phỏng mạng lõi 5G', unit: 'Trung tâm Mạng lõi', est: 210.5, priority: 'Thường', period: '10/2026 – 06/2027', creator: 'Đặng Thu Trang', created: '28/07/2026', updated: '28/07/2026' },
    { code: 'ĐXMS-2026-0101', nv: 'KHN-2026-VHT', title: 'Mua sắm thiết bị đo kiểm tương thích điện từ (EMC)', unit: 'Phòng Chất lượng', est: 168.0, priority: 'Khẩn', period: '01/2027 – 12/2027', creator: 'Bùi Minh Quang', created: '21/07/2026', updated: '21/07/2026' },
    { code: 'ĐXMS-2026-0098', nv: 'KHN-2026-TTVT', title: 'Mua sắm linh kiện RF cho mẫu thử nghiệm', unit: 'Trung tâm Vô tuyến', est: 45.2, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '02/09/2026', updated: '02/09/2026', purpose: 'Linh kiện RF và vỏ cơ khí cho lô mẫu thử nghiệm module RRU.' },
    { code: 'ĐXMS-2026-0095', nv: 'KHN-2026-VHT', title: 'Mua sắm vật tư tiêu hao cho xưởng sản xuất thử', unit: 'Nhà máy sản xuất thử nghiệm', est: 3.9, priority: 'Thường', period: '09/2026 – 12/2026', creator: 'Phan Văn Lộc', created: '12/08/2026', updated: '12/08/2026' },
    { code: 'ĐXMS-2026-0089', nv: 'KHN-2026-VHT', title: 'Mua sắm thiết bị thử nghiệm môi trường', unit: 'Phòng Chất lượng', est: 18.7, priority: 'Thượng khẩn', period: '10/2026 – 03/2027', creator: 'Bùi Minh Quang', created: '04/08/2026', updated: '04/08/2026', secret: true },
    { code: 'ĐXMS-2026-0084', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', unit: 'Trung tâm Phần mềm', est: 9.6, priority: 'Thường', period: '09/2026 – 08/2027', creator: 'Lương Thị Hạnh', created: '20/07/2026', updated: '20/07/2026' },
    { code: 'ĐXMS-2026-0077', nv: 'DA-2026-002', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', unit: 'Nhà máy sản xuất thử nghiệm', est: 236.4, priority: 'Khẩn', period: '09/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '02/06/2026', updated: '02/06/2026' },
    { code: 'ĐXMS-2026-0072', nv: 'NV-KHCN-2026-006', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', unit: 'Trung tâm Vô tuyến', est: 152.0, priority: 'Thường', period: '09/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '25/05/2026', updated: '25/05/2026' },
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

  /* ---------- Khoản đầu tư (PH09, plan KĐT v0.3) ----------
     KĐT là đối tượng cha (D-12), tạo ở SCR-55 không start quy trình. Trường KĐT: lĩnh vực / loại KĐT / tính chất tài sản = mã DMDC SCR-33/34/35;
     est = tổng mức vốn dự kiến (tỷ đồng). KĐT-2026-0032 (kịch bản chính) chưa có — tạo trên prototype ở cảnh 1; 0033 (nhánh chuyển MS14) chưa có hồ sơ. */
  D.kdtCode0 = 'KĐT-2026-0032';
  D.kdtList = [
    { code: 'KĐT-2026-0033', title: 'Mở rộng dây chuyền SMT cho nhà máy sản xuất thử nghiệm', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'KHAC', nature: 'TICH_HOP', est: 85.0, period: '01/2027 – 12/2027', creator: 'Phan Văn Lộc', created: '26/09/2026', updated: '26/09/2026', purpose: 'Tăng công suất lắp ráp bo mạch cho sản xuất loạt.' },
    { code: 'KĐT-2026-0031', title: 'Trang bị máy trạm thiết kế cho Trung tâm Vô tuyến', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'TBNB', nature: 'NGUYEN_CHIEC', est: 12.4, period: '11/2026 – 02/2027', creator: 'Nguyễn Văn Minh', created: '21/09/2026', updated: '25/09/2026', purpose: 'Thay máy trạm thiết kế RF đã hết khấu hao.' },
    { code: 'KĐT-2026-0030', title: 'Đầu tư phòng đo tương thích điện từ di động', unit: 'Phòng Chất lượng', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 64.0, period: '01/2027 – 09/2027', creator: 'Bùi Minh Quang', created: '18/09/2026', updated: '24/09/2026', purpose: 'Đo EMC tại hiện trường cho sản phẩm trạm thu phát.' },
    { code: 'KĐT-2026-0029', title: 'Đầu tư hệ thống kiểm thử phần mềm tự động cho OSS', unit: 'Trung tâm Phần mềm', field: 'VTCNTT', type: 'TBNB', nature: 'TICH_HOP', est: 22.8, period: '12/2026 – 06/2027', creator: 'Lương Thị Hạnh', created: '10/09/2026', updated: '23/09/2026', purpose: 'Tự động hoá kiểm thử hồi quy hệ thống OSS.' },
    { code: 'KĐT-2026-0028', title: 'Đầu tư dây chuyền đóng gói module quang', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'KHCN', nature: 'TICH_HOP', est: 74.5, period: '10/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '12/06/2026', updated: '22/09/2026', purpose: 'Đóng gói module quang tốc độ cao phục vụ đề tài KHCN.' },
    { code: 'KĐT-2026-0027', title: 'Đầu tư hệ thống mô phỏng kênh vô tuyến MIMO', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 128.0, period: '01/2027 – 12/2027', creator: 'Nguyễn Văn Minh', created: '02/07/2026', updated: '21/09/2026', purpose: 'Mô phỏng kênh MIMO kích thước lớn cho nghiên cứu 5G-A.' },
    { code: 'KĐT-2026-0026', title: 'Đầu tư phòng thí nghiệm an toàn thông tin', unit: 'Trung tâm Phần mềm', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 58.0, period: '11/2026 – 08/2027', creator: 'Lương Thị Hạnh', created: '20/06/2026', updated: '19/09/2026', purpose: 'Kiểm thử bảo mật thiết bị mạng và phần mềm.' },
    { code: 'KĐT-2026-0025', title: 'Đầu tư nền tảng dữ liệu sản xuất thông minh (MES)', unit: 'Nhà máy sản xuất thử nghiệm', field: 'VTCNTT', type: 'TBNB', nature: 'TICH_HOP', est: 44.6, period: '10/2026 – 05/2027', creator: 'Phan Văn Lộc', created: '05/06/2026', updated: '18/09/2026', purpose: 'Thu thập, truy vết dữ liệu sản xuất theo lô.' },
    { code: 'KĐT-2026-0024', title: 'Đầu tư trạm thử nghiệm vệ tinh mặt đất', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 97.3, period: '01/2027 – 12/2027', creator: 'Nguyễn Văn Minh', created: '28/05/2026', updated: '17/09/2026', purpose: 'Thử nghiệm kết nối vệ tinh quỹ đạo thấp.' },
    { code: 'KĐT-2026-0021', title: 'Đầu tư hệ thống in 3D kim loại công nghiệp', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'TBNB', nature: 'TICH_HOP', est: 35.0, period: '09/2026 – 03/2027', creator: 'Phan Văn Lộc', created: '14/04/2026', updated: '28/08/2026', purpose: 'Chế tạo chi tiết cơ khí phức tạp cho mẫu thử.' },
    { code: 'KĐT-2026-0018', title: 'Đầu tư dây chuyền SMT thế hệ mới', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'KHAC', nature: 'TICH_HOP', est: 82.0, period: '10/2026 – 09/2027', creator: 'Phan Văn Lộc', created: '02/04/2026', updated: '26/08/2026', purpose: 'Thay dây chuyền SMT cũ, tăng độ chính xác gắn linh kiện.' },
    { code: 'KĐT-2026-0015', title: 'Trang bị máy đo phổ cầm tay cho đội thử nghiệm hiện trường', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'TBNB', nature: 'NGUYEN_CHIEC', est: 8.6, period: '07/2026 – 09/2026', creator: 'Nguyễn Văn Minh', created: '11/03/2026', updated: '30/07/2026', purpose: 'Đo kiểm vùng phủ tại hiện trường.' },
    { code: 'KĐT-2026-0012', title: 'Đầu tư hệ thống đo kiểm anten trong buồng vi sóng', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 136.0, period: '06/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '20/01/2026', updated: '15/07/2026', purpose: 'Đo đồ thị bức xạ anten mảng pha.', secret: true },
  ];
  /* Hồ sơ mẫu của KĐT (đối tượng con). flow: MS13 / MS14, null = chưa xác định nhóm (trước bước 12, D-7). branch: BM00 (gộp) / 2GD (BM-01 → BM-03).
     stage = trạng thái KĐT suy từ hồ sơ (kdt.js KDT_STAGE); task = bước đang chờ (tên lấy từ BPMN_FLOWS.MS13, MS14 từ sơ đồ);
     total = tổng mức vốn thực tế sau báo giá (task 10). docs = văn bản đầu ra đã có. Luồng MS13 chạy được từ B2. */
  D.kdtCases = [
    { code: 'HS-2026-0031', kdt: 'KĐT-2026-0031', kind: 'PD', flow: 'MS13', branch: 'BM00', stage: 'GOP', st: 'processing', task: 18, total: 12.4, created: '21/09/2026', updated: '25/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0030', kdt: 'KĐT-2026-0030', kind: 'PD', flow: null, stage: 'LAP', st: 'processing', task: 8, created: '18/09/2026', updated: '24/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0029', kdt: 'KĐT-2026-0029', kind: 'PD', flow: null, stage: 'PL', st: 'processing', task: 11, tasks: [11, 12], total: 23.5, created: '10/09/2026', updated: '23/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0028', kdt: 'KĐT-2026-0028', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'KYQD', st: 'processing', task: 54, total: 76.2, created: '12/06/2026', updated: '22/09/2026', creator: 'Phan Văn Lộc', docs: [['BM-01', '14/08/2026'], ['BM-14', '19/09/2026']] },
    { code: 'HS-2026-0027', kdt: 'KĐT-2026-0027', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'TDKDT', st: 'processing', task: 49, late: true, total: 131.2, created: '02/07/2026', updated: '21/09/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-01', '28/08/2026']] },
    { code: 'HS-2026-0026', kdt: 'KĐT-2026-0026', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'HS', st: 'processing', task: 46, total: 57.4, created: '20/06/2026', updated: '19/09/2026', creator: 'Lương Thị Hạnh', docs: [['BM-01', '16/09/2026']] },
    { code: 'HS-2026-0025', kdt: 'KĐT-2026-0025', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'KYCT', st: 'processing', task: 44, total: 45.1, created: '05/06/2026', updated: '18/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0024', kdt: 'KĐT-2026-0024', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'TDCT', st: 'processing', task: 41, total: 98.6, created: '28/05/2026', updated: '17/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0021', kdt: 'KĐT-2026-0021', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'STOP', st: 'stopped', total: 35.0, created: '14/04/2026', updated: '28/08/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0019', kdt: 'KĐT-2026-0018', kind: 'PD', flow: 'MS14', stage: 'MS14', st: 'processing', task: 14, total: 118.0, created: '26/08/2026', updated: '26/08/2026', creator: 'Phan Văn Lộc', replaces: 'HS-2026-0018' },
    { code: 'HS-2026-0018', kdt: 'KĐT-2026-0018', kind: 'PD', flow: 'MS13', stage: 'MS14', st: 'moved', total: 118.0, created: '02/04/2026', updated: '26/08/2026', creator: 'Phan Văn Lộc', replacedBy: 'HS-2026-0019' },
    { code: 'HS-2026-0015', kdt: 'KĐT-2026-0015', kind: 'PD', flow: 'MS13', branch: 'BM00', stage: 'OK', st: 'done', total: 8.6, created: '11/03/2026', updated: '30/07/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-00', '30/07/2026']] },
    { code: 'HS-2026-0012', kdt: 'KĐT-2026-0012', kind: 'PD', flow: 'MS13', branch: '2GD', stage: 'OK', st: 'done', total: 138.5, created: '20/01/2026', updated: '15/07/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-01', '12/04/2026'], ['BM-14', '02/07/2026'], ['BM-18', '15/07/2026']] },
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
  /* Việc đã xử lý trên hồ sơ KĐT mẫu (B5) — tên việc theo BPMN_FLOWS.MS13; mở Chi tiết hồ sơ KĐT ở chế độ xem. */
  D.sampleKdtTasks = [
    { who: 'minh', code: 'HS-2026-0027', task: 46, created: '31/08/2026', due: '02/09/2026', done: '02/09/2026' },
    { who: 'minh', code: 'HS-2026-0026', task: 36, created: '20/07/2026', due: '22/07/2026', done: '22/07/2026' },
    { who: 'minh', code: 'HS-2026-0012', task: 46, created: '05/05/2026', due: '07/05/2026', done: '06/05/2026' },
    { who: 'minh', code: 'HS-2026-0015', task: 18, created: '06/04/2026', due: '08/04/2026', done: '07/04/2026' },
    { who: 'hai', code: 'HS-2026-0015', task: 20, created: '09/04/2026', due: '13/04/2026', done: '10/04/2026' },
    { who: 'thu', code: 'HS-2026-0024', task: 11, created: '15/06/2026', due: '17/06/2026', done: '16/06/2026' },
    { who: 'thu', code: 'HS-2026-0012', task: 11, created: '10/02/2026', due: '12/02/2026', done: '11/02/2026' },
    { who: 'lan', code: 'HS-2026-0028', task: 51, created: '16/09/2026', due: '20/09/2026', done: '19/09/2026' },
    { who: 'lan', code: 'HS-2026-0024', task: 12, created: '15/06/2026', due: '17/06/2026', done: '17/06/2026' },
    { who: 'lan', code: 'HS-2026-0012', task: 51, created: '29/06/2026', due: '03/07/2026', done: '02/07/2026' },
    { who: 'hoa', code: 'HS-2026-0027', task: 26, created: '14/09/2026', due: '18/09/2026', done: '17/09/2026' },
    { who: 'tgd', code: 'HS-2026-0012', task: 54, created: '13/07/2026', due: '16/07/2026', done: '15/07/2026' },
    { who: 'tgd', code: 'HS-2026-0015', task: 56, created: '28/07/2026', due: '31/07/2026', done: '30/07/2026' },
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
    /* Khoản đầu tư MS13 — docs/dtms/prototype-KDT-chuan-bi.md §5 (v0.3, B1: đối chiếu mũi tên trang MS13-TO BE). */
    'P-50': { q: 'Mẫu BM-00 (văn bản gộp chủ trương + KĐT) chưa có trong bộ biểu mẫu KĐT của VHT', src: 'OQ-17, URD §12 #2', def: 'Mẫu giả ghép cấu trúc BM-01 + BM-03', scr: 'SCR-59' },
    'P-51': { q: 'Điều kiện gộp BM-00: trường dữ liệu làm căn cứ cho "Trang bị nội bộ" và "Nguyên chiếc"', src: 'OQ-17, diễn giải MS13 §D.2', def: 'Loại KĐT = Trang bị nội bộ và Tính chất tài sản = Nguyên chiếc (DMDC, nhập ở KĐT)', scr: 'SCR-58' },
    'P-52': { q: 'Tiêu chí OK / NOT OK của xác nhận TSCĐ và 04 yếu tố; NOT OK quay về đâu', src: 'Diễn giải MS13 §D.3, §D.7; BPMN MS13-TO BE', def: 'NOT OK bắt buộc lý do → AI gợi ý cần sửa (13) → ĐVĐX tổng hợp lại báo giá (10), theo mũi tên của BPMN', scr: 'SCR-57' },
    'P-53': { q: 'Tổng mức vốn không thuộc MS13: tạo hồ sơ mới theo MS14/MS15 hay giữ hồ sơ', src: 'Diễn giải MS13 §B.2', def: 'Kết thúc hồ sơ MS13 "Đã chuyển luồng", tạo hồ sơ mới của cùng KĐT theo MS14/MS15, liên kết hai hồ sơ', scr: 'SCR-66' },
    'P-54': { q: 'Giới hạn "02 vòng check": BPMN đặt cổng "Số lần check ≤ 02?" trước họp (đếm lần họp), ghi chú trang ghi "tối đa 02 vòng check, vượt thì họp"', src: 'Diễn giải MS13 §D.8, URD §12 #5, BPMN MS13-TO BE', def: 'Theo mũi tên BPMN: chưa thống nhất → họp (lần 1, 2); sau 02 lần họp vẫn chưa thống nhất → báo cáo; đếm riêng mỗi giai đoạn, không đặt lại khi trả sửa', scr: 'SCR-62' },
    'P-55': { q: 'Dữ liệu, thứ tự xác nhận sau họp của Chuyên quản và Chỉ huy ĐVĐX', src: 'Diễn giải MS13 §D.9', def: 'Tuần tự Chuyên quản → Chỉ huy; đủ cả hai mới mở sửa', scr: 'SCR-62' },
    'P-56': { q: 'Ma trận phân cấp VHT / Tập đoàn cho KĐT', src: 'Diễn giải MS13 §D.11, URD §12 #4', def: 'Luôn cấp VHT; nhánh Tập đoàn chưa dựng', scr: 'SCR-58' },
    'P-57': { q: 'Có danh sách / ma trận CQCM bắt buộc không; đơn vị chủ trì cho KĐT KHCN / quốc phòng', src: 'Diễn giải MS13 §D.4, UR-KDT-09', def: 'ĐVĐX tự chọn, TTMS duyệt; KĐT KHCN / quốc phòng chọn thêm đơn vị chủ trì', scr: 'SCR-60' },
    'P-58': { q: 'Số task 64 "Trình ký VOffice để Thủ trưởng VHT ký sau ý kiến Tập đoàn": nhãn đã đổi từ 60 thành 64 nhưng thuộc tính TaskNo vẫn là 60', src: 'BPMN MS13-TO BE', def: 'Dùng số trên nhãn (64)', scr: 'SCR-42' },
    'P-59': { q: 'KĐT không chọn quy trình lúc tạo hồ sơ — hệ thống xác định nhóm MS13 / MS14 / MS15 sau bước 12 (khác ĐXMS chọn tay)', src: 'D-7, D-12; WBS PH09 #175, 176', def: 'Tạo KĐT trước; hồ sơ Phê duyệt KĐT không chọn nhóm', scr: 'SCR-55' },
    'P-60': { q: 'Hồ sơ KĐT Mật ký bản giấy (MS14 ghi rõ, MS13 không nêu)', src: 'Diễn giải MS14 §C.11', def: 'Mật → hộp thoại ký mặc định ký cứng như ĐXMS', scr: 'SCR-21' },
    'P-61': { q: '"Thực hiện theo chỉ đạo" khi Thủ trưởng không ký: dừng hay bàn giao, trạng thái và dữ liệu lưu', src: 'Diễn giải MS13 §D.14', def: 'Ghi nội dung chỉ đạo; chỉ đạo dừng → "Dừng theo chỉ đạo", chỉ đạo xử lý → quay lại cổng chọn nhánh hồ sơ (theo BPMN)', scr: 'SCR-21' },
    'P-62': { q: 'Tiêu chí không đạt của "HT/AI kiểm tra trước khi gửi" (bước 40); BPMN chỉ vẽ nhánh Đạt', src: 'Diễn giải MS13 §D.10, BPMN MS13-TO BE', def: 'Thiếu mục bắt buộc của BM-01 / Checklist 01 → trả lại người gửi tại bước hiện tại', scr: 'SCR-60' },
    /* Danh mục dùng chung — docs/dtms/prototype-DMDC-chuan-bi.md §7. */
    'P-27': { q: 'Danh sách giá trị thật của từng danh mục', src: 'BB-2409 (VHT gửi qua email, chưa nhận)', def: 'Dữ liệu mẫu theo tài liệu chuẩn bị DMDC §3', scr: 'SCR-32' },
    'P-28': { q: 'Ngưỡng MS13/MS14: VT-CNTT < 160 và lĩnh vực khác < 90 (BB-2409), hay ngược lại (BB-1509)', src: 'BRD Q-01, UR-KDT-07; QT-8.6.5 trường hợp 1–3 ghi như BB-2409 (QT-8.6.5 chưa có bản PDF ban hành, INDEX C5)', def: 'Theo QT-8.6.5 / BB-2409', scr: 'SCR-40' },
    'P-29': { q: 'Loại khoản đầu tư có cần trường "Cấp xử lý" (SXKD luôn cấp Tập đoàn) không, hay chỉ dùng cho báo cáo', src: 'BB-1509 §2.5', def: 'Có trường Cấp xử lý', scr: 'SCR-34' },
    'P-30': { q: 'Mã nhà cung cấp do hệ thống tự sinh hay người dùng nhập', src: '—', def: 'Tự sinh NCC-000123; mã số thuế là khoá chống trùng', scr: 'SCR-31' },
    'P-31': { q: 'Có cần tài khoản ngân hàng, hồ sơ năng lực, đánh giá nhà cung cấp trong ĐTMS không', src: 'UC-10-07', def: 'Không có', scr: 'SCR-31' },
    'P-32': { q: 'Nhà cung cấp nước ngoài định danh bằng gì (mã thuế nước sở tại / số đăng ký kinh doanh), có bắt buộc không', src: 'Chốt nội bộ 28/09/2026 (có NCC nước ngoài)', def: 'Tuỳ chọn, nhập tự do', scr: 'SCR-31' },
    'P-33': { q: 'Bản ghi danh mục đã được hồ sơ dùng: chỉ Dừng hoạt động, không cho xoá', src: '—', def: 'Như vậy; bản ghi dừng hoạt động không hiện trong ô chọn, hồ sơ cũ vẫn hiện đúng giá trị', scr: 'SCR-32' },
    'P-34': { q: 'Ngưỡng có hiệu lực theo ngày; hồ sơ đang chạy giữ ngưỡng lúc tạo', src: '—', def: 'Như vậy', scr: 'SCR-40' },
    'P-35': { q: 'Phương thức LCNT và loại hợp đồng theo QĐ 12869 hay theo Luật Đấu thầu', src: 'BR-16; QC-12869 Điều 11 (2 phương thức), Điều 43 khoản 2 (8 loại hợp đồng)', def: 'Theo QC-12869: 2 phương thức một giai đoạn, 8 loại hợp đồng', scr: 'SCR-38' },
    'P-67': { q: 'Lĩnh vực đầu tư có những giá trị nào: QT-8.6.5 chỉ chia "VT-CNTT" / "lĩnh vực khác"; Quốc phòng (BB-2209) và Bất động sản (là loại KĐT theo QT-8.6.5) có cần là lĩnh vực riêng', src: 'QT-8.6.5 trường hợp 1–3, BB-1509, BB-2209', def: 'Giữ 4 lĩnh vực mẫu; Quốc phòng chưa có dòng ngưỡng', scr: 'SCR-40' },
    'P-68': { q: 'Loại KĐT "Hoạt động thường xuyên" (BB-1509 §2.2, §2.5) không có trong 6 loại của QT-8.6.5 (kinh doanh, bất động sản, phương tiện vận tải, trang bị nội bộ, KHCN, khác)', src: 'QT-8.6.5, BB-1509', def: 'Theo QT-8.6.5 (6 loại)', scr: 'SCR-34' },
    /* B0.5 — comment Figma nhóm A (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2d). */
    'P-69': { q: 'ĐXMS chọn từ nhiệm vụ / đề tài, dự án (comment #1): danh sách lấy ở đâu (module Quản lý nhiệm vụ KHCN, dự án SXKD, kế hoạch mua sắm thường xuyên)', src: 'Comment Figma #1', def: 'Danh sách mẫu 6 mục, chỉ mục đã phê duyệt', scr: 'SCR-28' },
    'P-70': { q: 'Bộ quy tắc bảo mật cho ĐXMS Mật (comment #12): ai ban hành, gồm những quy tắc nào', src: 'Comment Figma #12', def: '4 quy tắc mẫu, AI chỉ cảnh báo, không chặn Lưu', scr: 'SCR-28' },
    'P-71': { q: '"Ký tồn kho VO" (comment #2) nghĩa là gì: VO ký xác nhận kết quả rà soát tồn kho trên VOffice?', src: 'Comment Figma #2', def: 'Chưa dựng — hỏi lại khách', scr: 'SCR-05' },
    'P-72': { q: 'Nhà cung cấp thêm mới ngay trong hồ sơ (comment #3) có cần Quản trị danh mục duyệt trước khi gửi YCBG không', src: 'Comment Figma #3', def: 'Thêm vào danh mục ở trạng thái Hoạt động, gửi YCBG ngay', scr: 'SCR-07' },
    'P-73': { q: 'Đối soát ĐXMS (comment #4): MBOM, dự toán nhiệm vụ / dự án, KHN lấy từ hệ thống nào, đối soát theo mã hàng hay theo tên', src: 'Comment Figma #4', def: 'Dữ liệu mẫu, đối soát theo dòng hạng mục', scr: 'SCR-07' },
    'P-74': { q: 'Backlog "Import yêu cầu báo giá cho các nhà cung cấp": nhập gì (danh sách hạng mục, NCC nhận, hay báo giá NCC trả về), ở bước nào, theo mẫu tệp nào', src: 'BA-TD Backlog dòng 210', def: 'Chưa dựng; YCBG tạo trong task 08', scr: 'SCR-73' },
    'P-75': { q: 'Backlog KĐT "Thành phần tham gia — Quản lý Tổ chuyên gia" (dòng 263): KĐT có Tổ chuyên gia riêng không? MS13-TO BE không có bước lập Tổ chuyên gia', src: 'BA-TD Backlog dòng 263, BPMN-DTMS MS13-TO BE', def: 'Tab Thành phần tham gia của KĐT hiện CQCM thẩm định; Tổ chuyên gia ở Gói thầu', scr: 'SCR-56' },
    'P-76': { q: 'Báo cáo kiểm tra KHLCNT (MS18.3): tên / biểu mẫu chính thức, nội dung bắt buộc, người ký, có trình ký VOffice không (Q02 của BPMN-MS18)', src: 'BPMN-MS18 Q02', def: 'Tạm gọi BM-02 Báo cáo kiểm tra KHLCNT, ký VOffice', scr: 'SCR-80' },
    'P-77': { q: 'Tổ chức LCNT (MS19) chưa có BPMN: trình tự theo từng hình thức (Điều 12–21) có tách một quy trình Camunda cho mỗi hình thức không', src: 'QC-12869 Điều 12–21; INDEX MS18 / MS19', def: 'Mỗi hình thức một trình tự (bảng Trình tự thực hiện ở Chi tiết gói thầu), chọn quy trình theo mã hình thức', scr: 'SCR-82' },
    'P-78': { q: 'Danh sách nhà thầu / hãng sản xuất chiến lược và nhà thầu bị cấm: tích hợp từ Tập đoàn hay nhập tay trên ĐTMS; ai cập nhật', src: 'QC-12869 Điều 13 khoản 2; Backlog dòng 403–406', def: 'Chiến lược: dữ liệu mẫu theo QĐ công bố; cấm: cờ Tình trạng của danh mục NCC', scr: 'SCR-83' },
    'P-79': { q: 'Ngưỡng cảnh báo giá dự thầu thấp bất thường (QC-12869 không nêu tỷ lệ)', src: 'Backlog dòng 389', def: 'Thấp hơn 20% giá gói thầu → cảnh báo, yêu cầu nhà thầu giải trình', scr: 'SCR-82' },
    'P-80': { q: 'Ngưỡng cảnh báo hợp đồng: bảo đảm thực hiện sắp hết hạn (bao nhiêu ngày trước), hợp đồng sắp hết hạn; có cấu hình theo loại hợp đồng không', src: 'Backlog dòng 456, 597', def: 'GIẢ LẬP — ngưỡng = số ngày "Trước hạn" của Trigger thông báo: bảo đảm 30 ngày (CONTRACT_GUARANTEE_EXPIRING), hợp đồng 90 ngày (CONTRACT_EXPIRING), thỏa thuận khung 90 ngày (FRAMEWORK_EXPIRING); sửa ở Trigger thì cảnh báo ở Hợp đồng / Thỏa thuận khung / Báo cáo đổi theo. Chưa tách theo loại hợp đồng', scr: 'SCR-84, SCR-86' },
    'P-81': { q: 'Quy trình đơn hàng thuộc thỏa thuận khung (đặt, xác nhận, giao nhận, thanh toán từng đơn) chưa có BPMN; đơn hàng có theo dõi như một hợp đồng con không', src: 'Backlog dòng 465–469', def: 'GIẢ LẬP — đơn hàng là dòng của thỏa thuận khung (không phải hợp đồng con); Thêm đơn hàng chặn vượt giá trị còn lại; luồng 4 bước Chờ nhà thầu xác nhận → Đang giao → Đã giao đủ → Đã thanh toán, chuyển bước ở hộp thoại đơn hàng', scr: 'SCR-87' },
    'P-82': { q: 'Tích hợp Cổng đấu thầu Viettel (có phải SAP Ariba?) và Hệ thống mạng đấu thầu quốc gia: API, định dạng tin, mã tin, chiều đồng bộ tiến độ / KQLCNT về ĐTMS', src: 'Backlog dòng 413–415; QC-12869 Điều 26', def: 'GIẢ LẬP — hai hệ thống nối qua API của trục tích hợp: ĐTMS đẩy tin khi Chủ đầu tư xác nhận, nhận tiến độ / kết quả mở thầu / kiến nghị định kỳ 60 phút; lỗi trả về được ghi và cho Gửi lại (MS18 bước 60); mã tin VTB-… (Cổng Viettel), IB… / PL… (mạng ĐTQG)', scr: 'SCR-94' },
    'P-83': { q: 'Chọn hệ thống đăng tải theo tiêu chí nào (gói áp dụng Luật Đấu thầu, gói tổ chức qua mạng…); lịch ngày làm việc (nghỉ lễ, Tết) để tính hạn 05 ngày làm việc lấy từ đâu', src: 'QC-12869 Điều 26 khoản 1–2; BPMN-MS18 N02', def: 'GIẢ LẬP — KHLCNT có cờ "Áp dụng Luật Đấu thầu cho gói cụ thể" → mạng đấu thầu quốc gia, còn lại → Cổng đấu thầu Viettel; ngày làm việc chỉ trừ thứ Bảy, Chủ nhật (chưa có danh mục ngày nghỉ lễ)', scr: 'SCR-94' },
    'P-36': { q: 'Ai quản trị từng danh mục (TTMS cho Nhà cung cấp; quản trị hệ thống cho phần còn lại?)', src: 'UC-12-05 (A21)', def: 'Vai Quản trị hệ thống thấy tất cả; vai TTMS chỉ thấy Nhà cung cấp và Loại hàng hoá', scr: 'SCR-30' },
    /* Quản trị quy trình — docs/dtms/prototype-PH02-quy-trinh-chuan-bi.md §4. */
    /* P-37 đã chốt 2026-09-28: MS01.01 / .02 / .03 là ba quy trình riêng (Locked decision "MS01 deploy"). */
    'P-38': { q: 'Hồ sơ đã Chuyển quy trình (10b) hiện trạng thái gì trên Giám sát tiến trình', src: 'P-26', def: 'Đã hủy (hồ sơ Dừng xử lý cũng vậy)', scr: 'SCR-48' },
    'P-39': { q: 'Luật hiển thị có quyết định thật nút trên màn xử lý task không (đổi tên hiển thị, vô hiệu hoá → ẩn nút)', src: 'UR-WF-11', def: 'Không nối; chỉ xem trước trong form luật', scr: 'SCR-44' },
    'P-40': { q: 'Ai được retry / xử lý incident, có cần phê duyệt không (UR-WF-05 retry có kiểm soát)', src: 'UR-WF-05', def: 'Không có — Giám sát tiến trình chỉ xem', scr: 'SCR-48' },
    'P-41': { q: 'Vai trò nào thấy menu Quản trị quy trình: chỉ Quản trị hệ thống, hay TTMS cũng xem Giám sát tiến trình', src: 'UC-02-01…03 (A21), UR-WF-12', def: 'Quản trị hệ thống thấy cả ba mục; Chuyên viên TTMS chỉ xem Giám sát tiến trình', scr: 'SCR-48' },
    /* Quản lý E-Form — docs/dtms/prototype-EFORM-chuan-bi.md §4. */
    'P-43': { q: 'Danh sách Loại biểu mẫu và Loại hồ sơ cho ĐTMS; Loại hồ sơ của Khoản đầu tư (MS13/MS14)', src: 'ecat option KHCN, D-10', def: 'Loại biểu mẫu: Tờ trình, Thuyết minh, Phiếu, Báo cáo, Công văn, Quyết định, Checklist; Loại hồ sơ: Phê duyệt ĐXMS / Điều chỉnh ĐXMS', scr: 'SCR-50' },
    'P-44': { q: 'Mã biểu mẫu dùng mã BM trong quy chế (BM-01): nếu MS02, MS13 cũng có "BM-01" thì mã duy nhất theo cặp (Loại hồ sơ, Mã) hay thêm tiền tố (MS01-BM-01)', src: 'QT ĐXMS, QT DADT/KĐT', def: 'Duy nhất theo cặp (Loại hồ sơ, Mã)', scr: 'SCR-50' },
    'P-45': { q: 'Sửa thiết kế biểu mẫu đang dùng: hồ sơ đang chạy giữ phiên bản cũ hay nhận bản mới; có cần xem/khôi phục bản cũ', src: 'UR-DOC-01 (phiên bản)', def: 'Mỗi lần lưu thiết kế tăng phiên bản; hồ sơ đã tạo giữ bản cũ; lịch sử chỉ xem', scr: 'SCR-53' },
    'P-46': { q: 'Word template: map biến ↔ khoá trường E-Form ở đâu, ai cấu hình, định dạng biến (${soCongVan})', src: 'UR-DOC-03, file chức năng r416–423', def: 'Chỉ tải File mẫu; chưa có màn map biến (D-5)', scr: 'SCR-50' },
    'P-47': { q: 'Biểu mẫu đang gắn bước quy trình BPMN / hồ sơ đang chạy có được xoá không', src: 'P-33 (DMDC)', def: 'Không; chỉ Dừng hoạt động', scr: 'SCR-49' },
    'P-48': { q: 'Vai nào quản lý E-Form: chỉ Quản trị hệ thống, hay TTMS (chủ quy chế biểu mẫu) cũng được sửa', src: 'R-ADMIN, UC-12-01 (A21)', def: 'Chỉ Quản trị hệ thống', scr: 'SCR-49' },
    'P-49': { q: 'Cần nút Nhân bản biểu mẫu không (source có xử lý, chưa có nút); Biểu thức tự tính và điều kiện FEEL do BA hay dev cấu hình', src: 'ecat handleDuplicate, dock thuộc tính', def: 'Không có Nhân bản; Biểu thức/FEEL nhập tự do', scr: 'SCR-49' },
  };
  /* Màn → điểm ❓ gắn trên màn đó. */
  D.screenQ = {};
  Object.entries(D.openPoints).forEach(([id, p]) => { (D.screenQ[p.scr] = D.screenQ[p.scr] || []).push(id); });

  /* ---------- Menu toàn hệ — 12 module của Backlog (D-15, plan T16 docs/dtms/prototype-W1T10-backlog-chuan-bi.md) ----------
     Nguồn: BA-TD sheet "Backlog (051026)", cột Module → Tính năng; thứ tự và tên theo Backlog. bl = module Backlog, due = bước plan T16 sẽ dựng.
     Bỏ khỏi menu (D-15): Kế hoạch & nhu cầu, Dự án, Dự toán & chi phí, Kho & tài sản, Hồ sơ & biểu mẫu, Quản trị hệ thống — không có trong Backlog.
     Route cũ của các mục này vẫn mở trang Đang phát triển (D.oldMenu) để không gãy liên kết cũ.
     Thầu / Hợp đồng: tính năng "trong từng gói thầu / hợp đồng" (Lựa chọn NT, HSMT, Tổ chức LCNT, Đánh giá & KQLCNT, Tình huống & Kiến nghị;
     Thương thảo, Ký kết, Bảo đảm, Theo dõi, VB phát sinh, Bàn giao & NT, Thanh toán, Thanh lý) là tab của màn chi tiết (B2/B3), không là mục menu. */
  D.menu = [
    { label: 'Tổng quan', icon: 'tong_quan', path: 'tong-quan', scr: 'SCR-92' },
    { label: 'Việc của tôi', icon: 'view_list', path: 'viec-cua-toi', scr: 'SCR-01', badge: 'tasks' },
    { label: 'Quản lý đề xuất mua sắm', icon: 'phan_he_mua_sam', open: true, bl: 'Quản lý đề xuất mua sắm', due: 'B1 (07/10)', children: [
      { label: 'Đề xuất mua sắm', path: 'dxms', scr: 'SCR-27' },
      { label: 'Hồ sơ đề xuất mua sắm', path: 'ho-so-dxms', scr: 'SCR-02' },
      { label: 'Yêu cầu báo giá ĐXMS', path: 'ycbg', scr: 'SCR-73' }] },
    { label: 'Quản lý khoản đầu tư', icon: 'view_flow', bl: 'Quản lý khoản đầu tư', due: 'B2 (08/10)', children: [
      { label: 'Khoản đầu tư', path: 'kdt', scr: 'SCR-54' },
      { label: 'Hồ sơ khoản đầu tư', path: 'ho-so-kdt', scr: 'SCR-75' },
      { label: 'Yêu cầu báo giá KĐT', path: 'ycbg-kdt', scr: 'SCR-76' }] },
    { label: 'Quản lý thầu', icon: 'doi_tac', bl: 'Quản lý thầu', due: 'B2 (08/10)', children: [
      { label: 'Kế hoạch lựa chọn nhà thầu', path: 'khlcnt', scr: 'SCR-78' },
      { label: 'Gói thầu', path: 'goi-thau', scr: 'SCR-81' },
      { label: 'Nhà thầu & kiểm soát rủi ro', path: 'nha-thau', scr: 'SCR-83' },
      { label: 'Công khai & tích hợp đấu thầu', path: 'cong-khai-thau', scr: 'SCR-94' },
      { label: 'Giám sát hoạt động thầu', path: 'ph/giam-sat-thau' }] },
    { label: 'Quản lý hợp đồng', icon: 'chuc_danh_khoa_hoc', children: [
      { label: 'Hợp đồng', path: 'hop-dong', scr: 'SCR-84' },
      { label: 'Thỏa thuận khung & đơn hàng', path: 'thoa-thuan-khung', scr: 'SCR-87' }] },
    { label: 'Báo cáo', icon: 'nguon_kinh_phi', children: [
      { label: 'Báo cáo tổng hợp', path: 'bao-cao/tong-hop', scr: 'SCR-93' },
      { label: 'Báo cáo ĐXMS', path: 'bao-cao/dxms', scr: 'SCR-93' },
      { label: 'Báo cáo khoản đầu tư', path: 'bao-cao/kdt', scr: 'SCR-93' },
      { label: 'Báo cáo lựa chọn nhà thầu', path: 'bao-cao/lcnt', scr: 'SCR-93' },
      { label: 'Báo cáo hợp đồng', path: 'bao-cao/hop-dong', scr: 'SCR-93' },
      { label: 'Báo cáo tiến độ & tồn đọng', path: 'bao-cao/tien-do', scr: 'SCR-93' }] },
    /* Cấu hình hệ thống — sau nhóm vận hành (người dùng yêu cầu 2026-10-07). */
    /* D-2: 3 mục quy trình; tên nhóm và mục đầu theo Backlog "Quản lý quy trình". */
    { label: 'Quản lý quy trình', icon: 'phan_he_quy_trinh', children: [
      { label: 'Quản lý quy trình', path: 'quy-trinh', scr: 'SCR-41' },
      { label: 'Ma trận hành động', path: 'ma-tran', scr: 'SCR-43' },
      { label: 'Giám sát tiến trình', path: 'giam-sat-tien-trinh', scr: 'SCR-48' }] },
    /* D-14: menu cấp cha như ecat common-catalog; catalog.js nối các danh mục sau 2 mục đầu và lọc theo vai (P-36).
       D-16 (thay D-4): Quản lý E-form nằm trong Danh mục dùng chung như Backlog; route #/eform giữ nguyên. */
    { label: 'Danh mục dùng chung', icon: 'danh_muc_dung_chung', dmdc: true, children: [
      { label: 'Tổng quan', path: 'dmdc', scr: 'SCR-30' },
      { label: 'Quản lý E-form', path: 'eform', scr: 'SCR-49' }] },
    { label: 'Thông báo', icon: 'menu_square', children: [
      { label: 'Mẫu thông báo', path: 'mau-thong-bao', scr: 'SCR-88' },
      { label: 'Kênh thông báo', path: 'kenh-thong-bao', scr: 'SCR-90' },
      { label: 'Trigger thông báo', path: 'trigger-thong-bao', scr: 'SCR-91' }] },
    /* Ẩn khỏi menu (hidden, người dùng yêu cầu 2026-10-07) — route vẫn mở trang Đang phát triển. */
    { label: 'Tích hợp', hidden: true, icon: 'phan_he_iam', bl: 'Tích hợp', due: 'chưa giao PIC', children: [
      { label: 'Tích hợp Camunda', path: 'ph/tich-hop' },
      { label: 'Tích hợp SAP / Tài chính', path: 'ph/tich-hop-sap' },
      { label: 'Tích hợp VContract', path: 'ph/tich-hop-vcontract' },
      { label: 'Tích hợp VOffice', path: 'ph/tich-hop-voffice' },
      { label: 'Tích hợp PML', path: 'ph/tich-hop-pml' }] },
    { label: 'Trợ lý AI', hidden: true, icon: 'vai_tro_thuc_hien', path: 'ph/ai', bl: 'Trợ lý AI', due: 'chưa giao PIC' },
  ];

  /* Mục menu cũ (13 phân hệ use-case) bỏ theo D-15 — route #/ph/… vẫn mở trang Đang phát triển để không gãy liên kết cũ. */
  D.oldMenu = [
    { label: 'Kế hoạch năm', path: 'ph/ke-hoach', uc: ['UC-04-01'] },
    { label: 'Nhu cầu mua sắm', path: 'ph/nhu-cau', uc: ['UC-04-02'] },
    { label: 'Dự án đầu tư', path: 'ph/du-an', uc: ['UC-05-07', 'UC-05-08', 'UC-05-09', 'UC-05-10'] },
    { label: 'Giám sát & rủi ro đầu tư', path: 'ph/giam-sat', uc: ['UC-05-11', 'UC-05-12'] },
    { label: 'Dự toán', path: 'ph/du-toan', uc: ['UC-06-01'] },
    { label: 'Tờ trình chi phí', path: 'ph/to-trinh', uc: ['UC-06-02', 'UC-06-03', 'UC-06-04'] },
    { label: 'Báo cáo CSGT', path: 'ph/csgt', uc: ['UC-06-05'] },
    { label: 'Cơ sở giá', path: 'ph/co-so-gia', uc: ['UC-07-04'] },
    { label: 'Tổ chuyên gia / thẩm định', path: 'ph/to-chuyen-gia', uc: ['UC-08-05'] },
    { label: 'HSMT / HSYC', path: 'ph/hsmt', uc: ['UC-09-01', 'UC-09-02'] },
    { label: 'Mở thầu & đánh giá', path: 'ph/mo-thau', uc: ['UC-09-03', 'UC-09-04', 'UC-09-05'] },
    { label: 'Kết quả LCNT', path: 'ph/kqlcnt', uc: ['UC-09-06', 'UC-09-07'] },
    { label: 'Tiến độ & nghiệm thu', path: 'ph/tien-do', uc: ['UC-10-04', 'UC-10-05'] },
    { label: 'Thanh lý & quyết toán', path: 'ph/thanh-ly', uc: ['UC-10-08'] },
    { label: 'Danh mục vật tư', path: 'ph/vat-tu', uc: ['UC-11-01'] },
    { label: 'Nhập / xuất kho', path: 'ph/kho', uc: ['UC-11-02', 'UC-11-03', 'UC-11-11'] },
    { label: 'Tài sản', path: 'ph/tai-san', uc: ['UC-11-04', 'UC-11-05', 'UC-11-06', 'UC-11-07', 'UC-11-08', 'UC-11-09', 'UC-11-12'] },
    { label: 'Kiểm kê', path: 'ph/kiem-ke', uc: ['UC-11-10'] },
    { label: 'Kho hồ sơ', path: 'ph/kho-ho-so', uc: ['UC-12-04'] },
    { label: 'Bộ hồ sơ & checklist', path: 'ph/checklist', uc: ['UC-12-02'] },
    { label: 'Trình ký VOffice', path: 'ph/voffice', uc: ['UC-12-06'] },
    { label: 'KPI thẩm định', path: 'ph/kpi', uc: ['UC-13-02'] },
    { label: 'Cảnh báo & nhắc việc', path: 'ph/canh-bao', uc: ['UC-13-03'] },
    { label: 'Truy vết chuỗi đầu tư', path: 'ph/truy-vet', uc: ['UC-13-05'] },
    { label: 'Người dùng & phân quyền', path: 'ph/nguoi-dung', uc: ['UC-01-02', 'UC-01-03'] },
    { label: 'Ủy quyền xử lý', path: 'ph/uy-quyen', uc: ['UC-01-04'] },
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
  /* Nhiệm vụ / đề tài, dự án mà ĐXMS phải chọn khi tạo (comment Figma #1, P-69): nhiệm vụ KHCN, dự án SXKD (PAKD) hoặc kế hoạch mua sắm
     thường xuyên năm (KHN). basis = văn bản căn cứ phê duyệt nhiệm vụ (D.basisDocs); src = nguồn đối soát ở task 08 (comment #4, P-73). */
  D.nhiemVu = [
    { code: 'NV-KHCN-2026-014', name: 'Phát triển trạm gNodeB thế hệ 2', kind: 'Nhiệm vụ KHCN', basis: 'qd1', src: 'mbom', field: 'VTCNTT', fund: 'KHCN' },
    { code: 'NV-KHCN-2026-006', name: 'Anten mảng pha băng Ka', kind: 'Nhiệm vụ KHCN', basis: 'qd2', src: 'mbom', field: 'QP', fund: 'KHCN' },
    { code: 'NV-KHCN-2025-031', name: 'Hệ thống mạng lõi 5G SA', kind: 'Nhiệm vụ KHCN', basis: 'qd3', src: 'mbom', field: 'VTCNTT', fund: 'KHCN' },
    { code: 'DA-2026-002', name: 'Sản xuất module RRU 5G giai đoạn 2026–2028', kind: 'Dự án SXKD', basis: 'qd4', src: 'dutoan', field: 'VTCNTT', fund: 'SXKD' },
    { code: 'KHN-2026-TTVT', name: 'Mua sắm thường xuyên năm 2026 — Trung tâm Vô tuyến', kind: 'Mua sắm thường xuyên (KHN)', basis: 'qd5', src: 'khn', field: 'VTCNTT', fund: 'CPTX' },
    { code: 'KHN-2026-VHT', name: 'Mua sắm thường xuyên năm 2026 — các đơn vị VHT', kind: 'Mua sắm thường xuyên (KHN)', basis: null, src: 'khn', field: 'KHAC', fund: 'CPTX' },
  ];
  D.nvOf = (code) => D.nhiemVu.find((x) => x.code === code) || null;
  /* Quy tắc bảo mật mẫu cho ĐXMS Mật (comment Figma #12, P-70) — AI kiểm tra khi Lưu, chỉ cảnh báo. */
  D.secRules = [
    { id: 'title', name: 'Tên ĐXMS không chứa số hiệu, tên mã thiết bị / dự án mật' },
    { id: 'purpose', name: 'Mục đích không nêu thông số kỹ thuật, địa điểm triển khai cụ thể' },
    { id: 'unit', name: 'Đơn vị đề xuất được phép xử lý hồ sơ Mật' },
    { id: 'sign', name: 'Hồ sơ Mật ký cứng (bản giấy), không gửi YCBG qua email hệ thống khi chưa được duyệt' },
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
  /* ---------- Hồ sơ KĐT chạy luồng MS13 (plan KĐT §2.3) ----------
     Căn cứ KĐT theo 3 loại của §4.1; bộ dữ liệu theo mã KĐT (D.useCase). KĐT khác tạo trên prototype dùng bộ của KĐT-2026-0032. */
  D.kdtBasisTypes = [
    { id: 'kh', name: 'Kế hoạch SXKD / PAKD / đề tài hàng năm', src: 'Dự toán / eBOM' },
    { id: 'hd', name: 'Hợp đồng / thoả thuận hợp tác', src: 'Hợp đồng' },
    { id: 'cd', name: 'Chỉ đạo Ban TGĐ', src: 'Không có' },
  ];
  D.kdtBasisDocs = [
    { id: 'kd1', no: '2318/QĐ-VHT', date: '18/08/2026', title: 'Phê duyệt đề tài KHCN năm 2027 "Phát triển trạm 5G-Advanced"', type: 'kh', value: 260.0, remain: 142.3 },
    { id: 'kd2', no: '0521/QĐ-VHT', date: '02/09/2026', title: 'Phê duyệt Kế hoạch SXKD năm 2027 của Nhà máy sản xuất thử nghiệm', type: 'kh', value: 410.0, remain: 188.6 },
    { id: 'kd3', no: '1135/TTHT-VHT', date: '11/06/2026', title: 'Thoả thuận hợp tác phát triển module quang tốc độ cao với đối tác Hàn Quốc', type: 'hd', value: 90.0, remain: 90.0 },
    { id: 'kd4', no: '0712/TB-VHT', date: '24/07/2026', title: 'Kết luận giao ban Ban TGĐ về năng lực đo kiểm dùng chung', type: 'cd', value: 0, remain: 0 },
    { id: 'kd5', no: '0633/QĐ-VHT', date: '09/09/2026', title: 'Phê duyệt Kế hoạch trang bị nội bộ năm 2027 của Trung tâm Vô tuyến', type: 'kh', value: 38.0, remain: 24.6 },
  ];
  D.basisTypesFor = (process) => (D.familyOf(process) === 'MS13' ? D.kdtBasisTypes : D.basisTypes);
  D.basisDocsFor = (process) => (D.familyOf(process) === 'MS13' ? D.kdtBasisDocs : D.basisDocs);
  /* KĐT của kịch bản chính — tạo ở SCR-55 (cảnh 1); nhảy cảnh thì hệ thống tạo sẵn. */
  D.kdtDemo = { code: D.kdtCode0, title: 'Đầu tư hệ thống đo kiểm OTA tích hợp phục vụ nhiệm vụ KHCN 5G-A', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN',
    nature: 'TICH_HOP', est: 120, period: '01/2027 – 12/2027', secret: false, purpose: 'Đo kiểm OTA cho trạm 5G-Advanced theo đề tài KHCN năm 2027.',
    creator: 'Nguyễn Văn Minh', created: '01/10/2026', updated: '01/10/2026' };
  D.demoCases[D.kdtCode0] = {
    caseInfo: { title: D.kdtDemo.title, unit: 'Trung tâm Vô tuyến', basis: 'Đề tài KHCN năm 2027 "Phát triển trạm 5G-Advanced" (2318/QĐ-VHT, nguồn eBOM)',
      basisApprovedByGroup: false, purpose: 'Triển khai hoạt động KHCN', secret: false, priority: 'Thường', fund: 'Vốn KHCN, năm 2027', period: '01/2027 – 12/2027', total: 118.5 },
    items: [
      { n: 1, name: 'Hệ thống buồng đo OTA tích hợp', uom: 'Hệ thống', bom: 1, used: 0, prop: 1, stock: 0, buy: 1, price: 56, amount: 56, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 2, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 12, used: 0, prop: 12, stock: 2, book: 2, held: 0, buy: 10, price: 3.2, amount: 32, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 3, name: 'Phần mềm điều khiển đo tự động', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 18.5, amount: 18.5, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 4, name: 'Dịch vụ tích hợp, hiệu chuẩn', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 12, amount: 12, group: 1, goods: 'DVPTV', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục tiêu', value: 'Hình thành hệ thống đo kiểm OTA tích hợp phục vụ thử nghiệm trạm 5G-Advanced theo đề tài KHCN năm 2027.', from: 'QĐ 2318/QĐ-VHT, mục 2' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 01 hệ thống buồng đo OTA, 12 máy phân tích phổ 44 GHz, 01 gói phần mềm điều khiển đo, 01 gói dịch vụ tích hợp, hiệu chuẩn.', from: 'eBOM đề tài 5G-Advanced, nhóm Đo kiểm' },
      { key: 'value', label: 'Tổng mức vốn sơ bộ', value: 'Khoảng 120 tỷ đồng (gồm VAT)', from: 'Dự toán đề tài, phần còn lại 142,3 tỷ' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn KHCN, kế hoạch năm 2027', code: 'KHCN', from: 'QĐ 2318/QĐ-VHT, mục 5' },
      { key: 'period', label: 'Thời gian thực hiện', value: '01/2027 – 12/2027', from: 'Tiến độ đề tài' },
    ],
    aiEstimate: 120,
    tree: [{ name: 'Đề tài 5G-Advanced 2027', children: [{ name: 'Đo kiểm OTA', lines: [1, 3] }, { name: 'Đo kiểm RF', lines: [2] }, { name: 'Tích hợp, hiệu chuẩn', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '09/10/2026', valid: '09/01/2027', prices: { 1: 56.0, 2: 3.25, 3: 18.5, 4: 12.4 } },
      { ncc: 'NCC-000002', date: '10/10/2026', valid: '10/01/2027', prices: { 1: 57.2, 2: 3.2, 3: 19.1, 4: 12.0 } },
      { ncc: 'NCC-000003', date: '09/10/2026', valid: '20/01/2027', prices: { 1: 56.8, 2: 3.3, 3: 18.9, 4: 12.3 } },
    ],
    checklist: [], opinions: {}, responses: {}, versionDiff: [], bm05: [],
    ref: { basisType: 'kh', basisDoc: 'kd1', cqcm: ['TC', 'PC'], purposeCode: 'KHCN', rstk: 'RSTK-2026-0405', ebom: 'eBOM-5GA-Do-kiem-OTA.xlsx',
      src: 'eBOM đề tài 5G-Advanced', quoteFailFirst: false, group2Note: 'Kèm chỉ tiêu kỹ thuật buồng đo OTA tích hợp (tệp BOM).',
      host: 'Trung tâm Mua sắm',
      /* BM-01 Tờ trình chủ trương KĐT (ký trực tiếp) — mục theo BM-8.6.5. */
      doc: {
        necessity: 'Đề tài 5G-Advanced năm 2027 cần đo kiểm OTA cho khối anten tích hợp. VHT chưa có buồng đo OTA, chỉ còn 02 máy phân tích phổ 44 GHz khả dụng; năm 2025–2026 phải thuê đo ngoài, mỗi lượt chờ 4–6 tuần. Đầu tư hệ thống đo kiểm OTA tích hợp là cần thiết để bảo đảm tiến độ đề tài và dùng chung cho các nhiệm vụ 5G sau.',
        tech: 'Buồng đo OTA dải 0,4–44 GHz, đo trường gần và trường xa; máy phân tích phổ vector đến 44 GHz; phần mềm điều khiển đo tự động theo 3GPP TS 38.141-2.',
        method: 'Khối lượng theo eBOM đề tài sau khi trừ tồn kho khả dụng; đơn giá thấp nhất trong 03 báo giá hợp lệ.',
        fund: 'Vốn KHCN, kế hoạch năm 2027 (QĐ 2318/QĐ-VHT)',
        period: 'Dự kiến mua sắm từ tháng 01/2027 đến tháng 12/2027; bố trí vốn trong năm 2027.',
        effect: 'Chủ động đo kiểm OTA cho sản phẩm 5G-A, giảm thời gian chờ đo ngoài; dùng chung cho các nhiệm vụ KHCN khác của VHT.',
        org: 'Trung tâm Vô tuyến lập hồ sơ KĐT trình phê duyệt sau khi chủ trương được duyệt; đơn vị chủ trì tổ chức lựa chọn nhà thầu, ký hợp đồng; Trung tâm Vô tuyến tiếp nhận, lắp đặt, nghiệm thu và đưa vào sử dụng.',
      },
      /* Thẩm định chủ trương (quy trình con 41) — plan KĐT §2.3: lượt 1 Ban Tài chính cần sửa, ĐVĐX bổ sung; lượt 2 còn chưa thống nhất,
         ĐVĐX giải trình → họp lần 1 → xác nhận → cập nhật; lượt 3 thống nhất. items: [mục, nhận xét, hướng dẫn sửa]. */
      review: { CT: [
        { TTMS: { items: [['Pháp lý', 'Căn cứ đề tài KHCN 2318/QĐ-VHT còn hiệu lực, phần vốn còn lại 142,3 tỷ đủ cho KĐT.']] },
          TC: { fix: true, items: [['Tổng mức vốn', 'Chưa tách chi phí TSCĐ / CCDC trong tổng mức vốn: phần mềm điều khiển đo 18,50 tỷ chưa xác định là TSCĐ vô hình hay CCDC.', 'Phân loại phần mềm theo quy chế tài chính, cập nhật phụ lục danh mục.']] },
          PC: { items: [['Pháp lý', 'Căn cứ và thẩm quyền phê duyệt phù hợp; không có ý kiến.']] },
          CL: { items: [['Phạm vi, quy mô', 'Chỉ tiêu kỹ thuật buồng đo phù hợp yêu cầu đo 3GPP.']] } },
        { TTMS: { items: [['Tổng mức vốn', 'Đã phân loại phần mềm là TSCĐ vô hình; tổng mức vốn không đổi.']] },
          TC: { fix: true, items: [['Tổng mức vốn', 'Gói dịch vụ tích hợp, hiệu chuẩn 12,00 tỷ ghi toàn bộ là TSCĐ; phần hiệu chuẩn định kỳ năm thứ hai là chi phí hoạt động.', 'Tách phần hiệu chuẩn định kỳ khỏi giá trị TSCĐ.']] },
          PC: { items: [['Pháp lý', 'Không có ý kiến bổ sung.']] },
          CL: { items: [['Phạm vi, quy mô', 'Không có ý kiến bổ sung.']] } },
        { TTMS: { items: [['Kết luận', 'Hồ sơ đã cập nhật theo kết luận họp; đủ điều kiện ký thẩm định.']] },
          TC: { items: [['Tổng mức vốn', 'Thống nhất với phụ lục danh mục đã cập nhật sau họp.']] },
          PC: { items: [['Pháp lý', 'Không có ý kiến bổ sung.']] },
          CL: { items: [['Phạm vi, quy mô', 'Không có ý kiến bổ sung.']] } }],
        /* Thẩm định KĐT (quy trình con 49) — plan KĐT §2.4 cảnh 7: 1 vòng, thống nhất. */
        KDT: [
          { TTMS: { items: [['Pháp lý', 'BM-03 kế thừa đúng chủ trương đã được Thủ trưởng VHT phê duyệt; căn cứ đề tài 2318/QĐ-VHT còn hiệu lực.'], ['Tổng mức vốn', '118,50 tỷ đồng, không vượt tổng mức vốn của chủ trương; cơ cấu TSCĐ / chi phí hoạt động theo kết luận họp.']] },
            TC: { items: [['Tổng mức vốn', 'Cơ cấu TSCĐ 116,10 tỷ, chi phí hoạt động 2,40 tỷ phù hợp quy chế tài chính; nguồn vốn KHCN 2027 đủ bố trí.']] },
            PC: { items: [['Pháp lý', 'Thẩm quyền phê duyệt thuộc Thủ trưởng VHT; tổ chức LCNT theo Quy chế LCNT của Tập đoàn.']] },
            CL: { items: [['Quy mô', 'Chỉ tiêu kỹ thuật buồng đo OTA và máy phân tích phổ phù hợp 3GPP TS 38.141-2.']] } }] },
      /* BM-03 Tờ trình thẩm định, phê duyệt KĐT (kế thừa chủ trương), BM-14 Báo cáo kết quả thẩm định, BM-18 Quyết định phê duyệt KĐT — mục theo BM-8.6.5. */
      bm03: { no: '1452/TTr-TTVT', ctNo: '1387/TTr-TTVT', decider: 'Tổng Giám đốc VHT',
        place: 'Phòng đo kiểm OTA, tòa nhà R&D — Khu Công nghệ cao Hòa Lạc',
        state: 'Năm 2025–2026 VHT thuê đo OTA bên ngoài 11 lượt, mỗi lượt chờ 4–6 tuần; tồn kho còn 02 máy phân tích phổ 44 GHz khả dụng (RSTK-2026-0405).',
        risk: 'Rủi ro chậm giao buồng đo OTA (nhập khẩu, 20–24 tuần): ký hợp đồng trong tháng 02/2027, giao hàng theo 2 đợt.',
        milestones: [['Phê duyệt KĐT', '12/2026'], ['Phê duyệt KHLCNT, tổ chức LCNT', '01–03/2027'], ['Lắp đặt, hiệu chuẩn, nghiệm thu', '06–11/2027']] },
      bm14: { no: '0925/BC-TTMS', agreed: ['Căn cứ pháp lý trình phê duyệt KĐT phù hợp chủ trương đã được phê duyệt.', 'Sự cần thiết, mục tiêu đầu tư phù hợp đề tài KHCN 5G-Advanced năm 2027.', 'Quy mô, tổng mức vốn 118,50 tỷ đồng, nguồn vốn KHCN 2027, thời gian thực hiện 01–12/2027.'],
        explain: 'Trung tâm Vô tuyến đã làm việc với Ban Tài chính, thống nhất tách 2,40 tỷ đồng hiệu chuẩn định kỳ năm thứ hai sang chi phí hoạt động (biên bản họp lần 1, giai đoạn chủ trương).' },
      bm18: { no: '2107/QĐ-VHT', owner: 'Trung tâm Vô tuyến', costs: [['Chi phí thiết bị', 88], ['Chi phí phần mềm (TSCĐ vô hình)', 18.5], ['Chi phí tích hợp, hiệu chuẩn ban đầu', 9.6], ['Chi phí hiệu chuẩn định kỳ năm thứ hai (chi phí hoạt động)', 2.4]] },
      /* Trả lời của ĐVĐX ở bước 28 theo vòng check; nội dung họp và điều chỉnh đã thống nhất (bước 29–33). */
      reply: [
        'Tiếp thu: phần mềm điều khiển đo có bản quyền vĩnh viễn, phân loại TSCĐ vô hình; đã cập nhật phụ lục danh mục.',
        'Giải trình: hiệu chuẩn thuộc gói lắp đặt ban đầu, là chi phí hình thành tài sản; đề nghị giữ toàn bộ 12,00 tỷ là TSCĐ.'],
      meeting: { place: 'Phòng họp 2, tầng 4 — Trung tâm Mua sắm', time: '14:00',
        result: 'Thống nhất tách 2,40 tỷ hiệu chuẩn định kỳ năm thứ hai sang chi phí hoạt động; 9,60 tỷ tích hợp, hiệu chuẩn ban đầu giữ là TSCĐ. Tổng mức vốn không đổi 118,50 tỷ đồng.',
        changes: [['Phụ lục danh mục — dòng 4', 'Dịch vụ tích hợp, hiệu chuẩn 12,00 tỷ (TSCĐ)', 'Tích hợp, hiệu chuẩn ban đầu 9,60 tỷ (TSCĐ) · Hiệu chuẩn định kỳ năm 2: 2,40 tỷ (chi phí hoạt động)'],
          ['Tờ trình BM-01 — mục 5.2', 'Chưa nêu phân loại chi phí', 'Bổ sung cơ cấu: TSCĐ 116,10 tỷ; chi phí hoạt động 2,40 tỷ']] } },
  };
  /* Nhánh phụ — KĐT-2026-0033: lĩnh vực Khác, báo giá chốt 96,00 tỷ ≥ 90 → không thuộc MS13 → chuyển MS14 (SCR-66). */
  D.demoCases['KĐT-2026-0033'] = {
    caseInfo: { title: 'Mở rộng dây chuyền SMT cho nhà máy sản xuất thử nghiệm', unit: 'Nhà máy sản xuất thử nghiệm',
      basis: 'Kế hoạch SXKD năm 2027 của Nhà máy sản xuất thử nghiệm (0521/QĐ-VHT, nguồn Dự toán)', basisApprovedByGroup: false,
      purpose: 'Liên tục SXKD', secret: false, priority: 'Thường', fund: 'Vốn đầu tư phát triển, năm 2027', period: '01/2027 – 12/2027', total: 96.0 },
    items: [
      { n: 1, name: 'Máy gắn linh kiện tốc độ cao', uom: 'Hệ thống', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 28, amount: 56, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 2, name: 'Lò hàn reflow 10 vùng nhiệt', uom: 'Hệ thống', bom: 1, used: 0, prop: 1, stock: 0, buy: 1, price: 14, amount: 14, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 3, name: 'Máy in kem hàn kèm kiểm tra SPI', uom: 'Bộ', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 8, amount: 16, group: 1, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 4, name: 'Dịch vụ lắp đặt, chạy thử dây chuyền', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 10, amount: 10, group: 1, goods: 'DVPTV', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục tiêu', value: 'Tăng công suất lắp ráp bo mạch cho sản xuất loạt theo Kế hoạch SXKD năm 2027.', from: 'Kế hoạch SXKD 0521/QĐ-VHT, mục III.2' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 02 máy gắn linh kiện, 01 lò hàn reflow, 02 máy in kem hàn kèm SPI, 01 gói lắp đặt chạy thử.', from: 'Dự toán Kế hoạch SXKD 2027, nhóm Dây chuyền SMT' },
      { key: 'value', label: 'Tổng mức vốn sơ bộ', value: 'Khoảng 85 tỷ đồng (gồm VAT)', from: 'Dự toán Kế hoạch SXKD 2027' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn đầu tư phát triển, năm 2027', code: 'DTPT', from: 'Kế hoạch SXKD 0521/QĐ-VHT, mục V' },
      { key: 'period', label: 'Thời gian thực hiện', value: '01/2027 – 12/2027', from: 'Tiến độ Kế hoạch SXKD 2027' },
    ],
    aiEstimate: 85,
    tree: [{ name: 'Kế hoạch SXKD 2027 — Dây chuyền SMT', children: [{ name: 'Thiết bị dây chuyền', lines: [1, 2, 3] }, { name: 'Dịch vụ', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '12/10/2026', valid: '12/01/2027', prices: { 1: 28.0, 2: 14.6, 3: 8.0, 4: 10.4 } },
      { ncc: 'NCC-000002', date: '13/10/2026', valid: '13/01/2027', prices: { 1: 28.9, 2: 14.0, 3: 8.3, 4: 10.0 } },
      { ncc: 'NCC-000003', date: '12/10/2026', valid: '20/01/2027', prices: { 1: 28.4, 2: 14.2, 3: 8.1, 4: 10.2 } },
    ],
    checklist: [], opinions: {}, responses: {}, versionDiff: [], bm05: [],
    ref: { basisType: 'kh', basisDoc: 'kd2', cqcm: ['TC', 'PC'], purposeCode: 'SX', rstk: 'RSTK-2026-0411', ebom: 'Du-toan-KH-SXKD-2027-SMT.xlsx',
      src: 'Dự toán Kế hoạch SXKD 2027 (0521/QĐ-VHT)', quoteFailFirst: false, group2Note: 'Kèm thông số dây chuyền SMT theo thiết kế nhà xưởng.', doc: {} },
  };

  /* Nhánh gộp — KĐT-2026-0031 (plan KĐT §2.3, cảnh 9): Trang bị nội bộ · Nguyên chiếc · 12,40 tỷ → đủ 03 điều kiện gộp → BM-00.
     Hồ sơ mẫu HS-2026-0031 đang ở bước 18; cảnh K9 chạy lại hồ sơ này (Flow.startKdt dùng lại mã). BM-00 là mẫu giả ghép BM-01 + BM-03 (P-50). */
  D.demoCases['KĐT-2026-0031'] = {
    caseInfo: { title: 'Trang bị máy trạm thiết kế cho Trung tâm Vô tuyến', unit: 'Trung tâm Vô tuyến',
      basis: 'Kế hoạch trang bị nội bộ năm 2027 của Trung tâm Vô tuyến (0633/QĐ-VHT, nguồn Dự toán)', basisApprovedByGroup: false,
      purpose: 'Trang bị nội bộ', secret: false, priority: 'Thường', fund: 'Vốn đầu tư phát triển, năm 2027', period: '11/2026 – 02/2027', total: 12.4 },
    items: [
      { n: 1, name: 'Máy trạm thiết kế RF (CPU 32 nhân, RAM 256 GB, GPU chuyên dụng)', uom: 'Bộ', bom: 24, used: 0, prop: 24, stock: 2, book: 2, held: 0, buy: 22, price: 0.46, amount: 10.12, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 2, name: 'Màn hình đồ họa 32 inch 4K', uom: 'Chiếc', bom: 24, used: 0, prop: 24, stock: 0, buy: 24, price: 0.045, amount: 1.08, group: 1, goods: 'VTCNTT', cost: 'CCDC' },
      { n: 3, name: 'Nâng cấp bản quyền phần mềm mô phỏng trường điện từ (22 máy)', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 1.2, amount: 1.2, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục tiêu', value: 'Thay thế 24 máy trạm thiết kế RF đã hết khấu hao, bảo đảm năng lực mô phỏng anten, mạch RF cho các dự án năm 2027.', from: 'Kế hoạch trang bị nội bộ 0633/QĐ-VHT, mục II.1' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '3 hạng mục: 24 máy trạm thiết kế RF (dùng lại 02 máy tồn kho), 24 màn hình đồ họa 4K, 01 gói nâng cấp bản quyền phần mềm mô phỏng.', from: 'Dự toán Kế hoạch trang bị nội bộ 2027' },
      { key: 'value', label: 'Tổng mức vốn sơ bộ', value: 'Khoảng 12,4 tỷ đồng (gồm VAT)', from: 'Dự toán Kế hoạch trang bị nội bộ 2027' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn đầu tư phát triển, năm 2027', code: 'DTPT', from: 'Kế hoạch trang bị nội bộ 0633/QĐ-VHT, mục IV' },
      { key: 'period', label: 'Thời gian thực hiện', value: '11/2026 – 02/2027', from: 'Tiến độ Kế hoạch trang bị nội bộ 2027' },
    ],
    aiEstimate: 12.4,
    tree: [{ name: 'Kế hoạch trang bị nội bộ 2027 — Trung tâm Vô tuyến', children: [{ name: 'Máy trạm, màn hình', lines: [1, 2] }, { name: 'Phần mềm', lines: [3] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '05/10/2026', valid: '05/01/2027', prices: { 1: 0.46, 2: 0.047, 3: 1.2 } },
      { ncc: 'NCC-000002', date: '06/10/2026', valid: '06/01/2027', prices: { 1: 0.47, 2: 0.045, 3: 1.24 } },
      { ncc: 'NCC-000003', date: '05/10/2026', valid: '15/01/2027', prices: { 1: 0.48, 2: 0.046, 3: 1.22 } },
    ],
    checklist: [], opinions: {}, responses: {}, versionDiff: [], bm05: [],
    ref: { basisType: 'kh', basisDoc: 'kd5', cqcm: ['TC', 'PC'], purposeCode: 'TB', rstk: 'RSTK-2026-0398', ebom: 'Du-toan-trang-bi-noi-bo-2027-TTVT.xlsx',
      src: 'Dự toán Kế hoạch trang bị nội bộ 2027 (0633/QĐ-VHT)', quoteFailFirst: false, group2Note: 'Kèm cấu hình máy trạm theo yêu cầu phần mềm mô phỏng.',
      host: null,
      /* BM-00 văn bản gộp (mẫu giả, P-50): phần A chủ trương, phần B khoản đầu tư. */
      doc: {
        necessity: '24 máy trạm thiết kế RF trang bị năm 2020 đã hết khấu hao, cấu hình không đáp ứng phần mềm mô phỏng trường điện từ phiên bản mới (thời gian mô phỏng một mẫu anten tăng từ 6 lên 20 giờ). Tồn kho còn 02 máy cùng cấu hình khả dụng. Trang bị thay thế là cần thiết để bảo đảm tiến độ thiết kế các dự án năm 2027.',
        tech: 'Máy trạm CPU 32 nhân, RAM 256 GB, GPU chuyên dụng mô phỏng; màn hình 32 inch 4K; nâng cấp bản quyền phần mềm mô phỏng lên phiên bản 2026.',
        method: 'Số lượng theo định biên kỹ sư thiết kế RF (24 người) sau khi trừ 02 máy tồn kho; đơn giá thấp nhất trong 03 báo giá hợp lệ.',
        fund: 'Vốn đầu tư phát triển, kế hoạch năm 2027 (QĐ 0633/QĐ-VHT)',
        period: 'Dự kiến mua sắm từ tháng 11/2026 đến tháng 02/2027.',
        effect: 'Rút ngắn thời gian mô phỏng thiết kế anten, mạch RF khoảng 3 lần; bảo đảm năng lực thiết kế cho các dự án vô tuyến năm 2027.',
        org: 'Trung tâm Vô tuyến là chủ đầu tư, tổ chức lựa chọn nhà thầu, ký hợp đồng, tiếp nhận, nghiệm thu và đưa vào sử dụng.',
        plan: [['Phê duyệt hồ sơ gộp', '10/2026'], ['Lựa chọn nhà thầu, ký hợp đồng', '11–12/2026'], ['Giao hàng, nghiệm thu', '01–02/2027']],
      },
      /* Ý kiến Chỉ huy ĐVĐX trên dự thảo BM-00 (bước 20). */
      lead: 'Đồng ý nội dung dự thảo. Bổ sung cấu hình tối thiểu của máy trạm vào phụ lục danh mục trước khi gửi thẩm định.',
      /* Thẩm định hồ sơ gộp (khối E, giai đoạn GOP) — cảnh 9: 1 vòng, thống nhất. */
      review: { GOP: [
        { TTMS: { items: [['Pháp lý', 'Căn cứ Kế hoạch trang bị nội bộ 2027 (0633/QĐ-VHT) còn hiệu lực, phần vốn còn lại 24,6 tỷ đủ cho KĐT.'], ['Tổng mức vốn', '12,40 tỷ đồng thuộc ngưỡng MS13; đủ 03 điều kiện gộp BM-00.']] },
          TC: { items: [['Tổng mức vốn', 'Phân loại TSCĐ / CCDC phù hợp: màn hình 1,08 tỷ là CCDC, còn lại là TSCĐ.']] },
          PC: { items: [['Pháp lý', 'Thẩm quyền phê duyệt thuộc Thủ trưởng VHT; không có ý kiến.']] } }] } },
  };

  D.useCase = (code) => {
    const c = D.demoCases[code] || D.demoCases[/^KĐT/.test(code || '') ? D.kdtCode0 : D.dxmsCode0];
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
    /* KĐT (plan KĐT §2.4): cảnh 1 mở Thêm mới KĐT; nhánh phụ settle = tua xong nhánh song song còn lại (Ban Tài chính đã xác nhận). */
    { key: 'MS13', kdt: D.kdtCode0, also: ['KĐT-2026-0033', 'KĐT-2026-0031'], label: 'KĐT-2026-0032 · MS13', scenes: [
      { n: 'K1', name: 'Khởi tạo KĐT, hồ sơ, căn cứ', start: 'NEW', tasks: '—, 01–05', who: 'minh' },
      { n: 'K2', name: 'Tồn kho, báo giá', start: 7, tasks: '06–10', who: 'minh' },
      { n: 'K3', name: 'Xác nhận song song, phân luồng', start: 11, tasks: '11–12', who: 'thu' },
      { n: 'K4', name: 'Chủ trương: dự thảo, BM-01, chọn CQCM, trình', start: 14, tasks: '14–16, 36–40', who: 'minh' },
      { n: 'K5', name: 'Thẩm định chủ trương (quy trình con 41)', start: 24, tasks: '41: 24–33', who: 'lan' },
      { n: 'K6', name: 'Ký chủ trương BM-01', start: 42, tasks: '42, 44', who: 'lan' },
      { n: 'K7', name: 'Hồ sơ KĐT BM-03 + Checklist 02, thẩm định (quy trình con 49)', start: 46, tasks: '45–49', who: 'minh' },
      { n: 'K8', name: 'Báo cáo BM-14, Thủ trưởng ký Quyết định BM-18', start: 51, tasks: '51, 54', who: 'lan' },
      { n: 'K9', name: 'Nhánh gộp BM-00 — KĐT-2026-0031', start: 18, tasks: '17–21, 24–26, 55–56', who: 'minh', kdt: 'KĐT-2026-0031' },
      { n: 'K10', name: 'Tổng kết: Chi tiết KĐT, hồ sơ, BPMN', start: 'END', tasks: '—', who: 'lan', go: 'kdt/' + encodeURIComponent(D.kdtCode0) }], branches: [
      { name: 'KĐT-2026-0033 vượt ngưỡng MS13 → chuyển MS14', tasks: '12 → MS14', task: 12, who: 'lan', dxms: 'KĐT-2026-0033', settle: true },
      { name: 'TTMS: 04 yếu tố Không OK → AI gợi ý, về bước 10', tasks: '12 → 13 → 10', task: 12, who: 'lan', settle: true },
      { name: 'TTMS trả lại danh sách CQCM', tasks: '24 → 38', task: 24, who: 'lan' },
      { name: 'Họp lần 2 vẫn chưa thống nhất → báo cáo, Thủ trưởng kết luận', tasks: '29 → 34 → 35', task: 29, who: 'lan', vars: { meet: { CT: 1 } } },
      { name: 'Thủ trưởng không ký chủ trương — chỉ đạo', tasks: '44 → dừng / 36', task: 44, who: 'tgd' },
      { name: 'Báo cáo BM-14 chưa được thông qua → ĐVĐX hoàn chỉnh', tasks: '51 → 52 → 53 → 46', task: 51, who: 'lan' },
      { name: 'KĐT-2026-0031: Thủ trưởng không ký hồ sơ gộp — chỉ đạo xử lý', tasks: '56 → 17 → 18', task: 56, who: 'tgd', dxms: 'KĐT-2026-0031' }] },
  ];
  D.demoSets.forEach((d) => { if (d.key !== 'MS01.01') d.branches.forEach((b) => { b.process = d.key; b.dxms = b.dxms || d.dxms || d.kdt; }); });

  window.D = D;
})();
