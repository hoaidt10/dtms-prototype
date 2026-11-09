/* T29 S6, S7 — Đề tài / dự án (plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md v0.5 §3.10; YC-DXMS-PROTO §2, §3;
   HT-DXMS-NOTE màn 1, 2, 4, 5, 6; TPL-DADT-EX). SCR-103 Danh sách #/de-tai, SCR-104 Chi tiết #/de-tai/<mã> (tab Thông tin chung, Dự toán chi phí,
   ĐXMS / KĐT liên quan, Gói thầu / Hợp đồng, Văn bản pháp lý — T31 B2). Danh mục = D.nhiemVu (D-66: nhiệm vụ KHCN là Loại KHCN; cùng nguồn ô Đề tài / dự án của ĐXMS và KĐT).
   Thông tin chung chỉ xem (Loại KHCN đồng bộ từ phân hệ KHCN — D-60, GIẢ LẬP tới DTMS_Q_0070). Dự toán chi phí nhập tại ĐTMS cho mọi Loại
   (D-65, bảng D.duToanOf dùng chung với card bóc tách chi phí SCR-96); cờ Chi mua sắm chỉ TTMS đổi (D-64). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, ty, vSelect, badge, pager, norm, toast, vTreeTable } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => window.Screens.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" ${attrs}>${icon(ic)}</button>`;
  const table = (cols, rows, cell, empty) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r)}</tr>`).join('') : `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${empty || 'Chưa có dữ liệu'}</td></tr>`}</tbody></table></div>`;
  const href = (code) => 'de-tai/' + encodeURIComponent(code);
  const r2 = (v) => Math.round(v * 100) / 100;
  const num = (v) => (v == null ? dash : ty(r2(v)));
  const parse = (s) => { const t = String(s == null ? '' : s).trim(); if (!t) return null; const n = Number(t.replace(/\./g, '').replace(',', '.')); return Number.isNaN(n) ? NaN : n; };
  const csv = (name, lines) => {
    const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = name;
    a.click();
    toast('<b>Thành công</b><br>Xuất file thành công');
  };

  /* ---------- Danh mục lọc (HT-DXMS-NOTE màn 1) ---------- */
  const LEVELS = ['Tổng Công ty', 'Tập đoàn'];
  const FUNDS = ['Đầu tư phát triển', 'Chi phí sản xuất kinh doanh', 'Quỹ phát triển KHCN', 'Vốn góp của chủ sở hữu'];
  const STATUS = { 'Đang thực hiện': 'info', 'Hoàn thành': 'success', 'Dừng thực hiện': 'default' };
  const LOAI = ['SXKD', 'Dự án đầu tư', 'KHCN', 'Hoạt động TX', 'Dự án đầu tư khác', 'Dự án kinh doanh khác'];
  const LOAI_CT_ALL = ['Thường xuyên', 'Chương trình KHCN', 'Đề án khoa học', 'Dự án KHCN', 'Đề tài KHCN', 'Dự án SX thử nghiệm', 'Nghiên cứu thăm dò',
    'Hình thức nghiên cứu KHCN khác', 'Dự án Kinh doanh', 'Dự án sản xuất', 'Chương trình nội bộ', 'Dự án đầu tư mua sắm tài sản',
    'Dự án đầu tư xây dựng Kinh doanh thử nghiệm', 'Hỗ trợ KHCN'];
  /* Ánh xạ Loại → Loại chi tiết (plan S6): KHCN theo Note màn 4; còn lại GIẢ LẬP P-198. Hai Loại "khác" chưa có → toàn bộ 14 giá trị. */
  const LOAI_CT = {
    KHCN: ['Đề tài KHCN', 'Nghiên cứu thăm dò', 'Dự án SX thử nghiệm', 'Hình thức nghiên cứu KHCN khác', 'Dự án KHCN', 'Đề án khoa học', 'Chương trình KHCN'],
    'Hoạt động TX': ['Thường xuyên'], SXKD: ['Dự án Kinh doanh', 'Dự án sản xuất', 'Chương trình nội bộ'],
    'Dự án đầu tư': ['Dự án đầu tư mua sắm tài sản', 'Dự án đầu tư xây dựng Kinh doanh thử nghiệm'],
  };
  const loaiCtOf = (loai) => (loai && LOAI_CT[loai]) || LOAI_CT_ALL;
  const BLOCKS = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối cơ quan'];

  /* ---------- Thuộc tính thông tin chung (HT-DXMS-NOTE màn 3, TPL-DADT-EX sheet1, sheet5) — thật: bảng đề tài / dự án của ĐTMS. ---------- */
  const L = (no, date, signer, content) => ({ no, date, signer, content });
  const INFO = {
    'NV-KHCN-2026-014': { sap: 'RD-93011', level: 'Tổng Công ty', group: 'B', unit: 'Trung tâm Vô tuyến', block: 'Khối 1', owner: 'Nguyễn Quang Huy', start: '12/03/2026', end: '31/12/2027',
      status: 'Đang thực hiện', legal: [L('1482/QĐ-VHT', '12/03/2026', 'Tổng Giám đốc Tổng Công ty', 'Phê duyệt nhiệm vụ KHCN "Phát triển trạm gNodeB thế hệ 2"')] },
    'NV-KHCN-2026-006': { sap: 'RD-92874', level: 'Tổng Công ty', group: 'C', unit: 'Trung tâm Vô tuyến', block: 'Khối 1', owner: 'Lê Minh Châu', start: '20/01/2026', end: '30/06/2027',
      status: 'Đang thực hiện', secret: true, legal: [L('0917/QĐ-VHT', '20/01/2026', 'Tổng Giám đốc Tổng Công ty', 'Phê duyệt nhiệm vụ KHCN "Anten mảng pha băng Ka"')] },
    'NV-KHCN-2025-031': { sap: 'RD-91520', level: 'Tập đoàn', group: 'A', unit: 'Trung tâm Mạng lõi', block: 'Khối 1', owner: 'Trịnh Văn Đức', start: '05/12/2025', end: '30/11/2027',
      status: 'Đang thực hiện', legal: [L('2210/QĐ-TĐ', '05/12/2025', 'Tổng Giám đốc Tập đoàn', 'Phê duyệt nhiệm vụ KHCN "Hệ thống mạng lõi 5G SA"')] },
    'DA-2026-002': { sap: 'PO-91877', level: 'Tập đoàn', group: 'A', unit: 'Nhà máy sản xuất thử nghiệm', block: 'Khối 3', owner: 'Phạm Hồng Sơn', start: '01/05/2026', end: '31/12/2028',
      status: 'Đang thực hiện', legal: [L('1876/QĐ-TĐ', '14/04/2026', 'Tổng Giám đốc Tập đoàn', 'Phê duyệt Phương án kinh doanh "Sản xuất module RRU 5G giai đoạn 2026–2028"')] },
    'KHN-2026-TTVT': { sap: '', level: 'Tổng Công ty', group: 'C', unit: 'Trung tâm Vô tuyến', block: 'Khối 1', owner: 'Hoàng Thu Hà', start: '01/01/2026', end: '31/12/2026',
      status: 'Đang thực hiện', legal: [L('0412/QĐ-VHT', '15/01/2026', 'Tổng Giám đốc Tổng Công ty', 'Phê duyệt Kế hoạch SXKD năm 2026 của Trung tâm Vô tuyến')] },
    'KHN-2026-VHT': { sap: '', level: 'Tổng Công ty', group: 'C', unit: 'Ban Kế hoạch đầu tư', block: 'Khối cơ quan', owner: 'Đỗ Thanh Tâm', start: '01/01/2026', end: '31/12/2026',
      status: 'Đang thực hiện', legal: [] },
    'DT-KHCN-2027-002': { sap: '', level: 'Tổng Công ty', group: 'B', unit: 'Trung tâm Vô tuyến', block: 'Khối 1', owner: 'Nguyễn Quang Huy', start: '01/01/2027', end: '31/12/2028',
      status: 'Đang thực hiện', legal: [L('2391/QĐ-VHT', '28/10/2026', 'Tổng Giám đốc Tổng Công ty', 'Giao nhiệm vụ KHCN cấp cơ sở năm 2027 "Đề tài phát triển trạm 5G-Advanced"')] },
    'KHN-2027-DTPT': { sap: '', level: 'Tổng Công ty', group: 'B', unit: 'Ban Kế hoạch đầu tư', block: 'Khối cơ quan', owner: 'Đỗ Thanh Tâm', start: '01/01/2027', end: '31/12/2027',
      status: 'Đang thực hiện', legal: [L('2410/QĐ-VHT', '30/10/2026', 'Tổng Giám đốc Tổng Công ty', 'Phê duyệt Kế hoạch đầu tư phát triển năm 2027')] },
    /* TPL-DADT-EX sheet1 dòng 1–4, sheet5; tên chủ nhiệm đổi thành tên mẫu. */
    '009-26-VHT-RDP-DS': { sap: 'RD-93103', level: 'Tổng Công ty', group: 'B', unit: 'Trung tâm Giải pháp và tích hợp', block: 'Khối 2', owner: 'Đỗ Hoài Nam', start: '12/08/2026', end: '31/01/2028',
      status: 'Đang thực hiện', legal: [L('16558/QĐ-VHT', '12/08/2026', 'Tổng Giám đốc Tập đoàn', 'QĐ giao nhiệm vụ thực hiện nhiệm vụ KHCN cấp cơ sở "Nghiên cứu, phát triển mạng 5G dành cho đường sắt tốc độ cao"')] },
    '020-26-VHT-BP-C': { sap: 'PO-92220', level: 'Tổng Công ty', group: 'C', unit: 'Trung tâm Giải pháp và tích hợp', block: 'Khối 2', owner: 'Ngô Thị Linh', start: '02/07/2026', end: '30/09/2026',
      status: 'Đang thực hiện', legal: [L('12922/TTr-KD', '02/07/2026', 'Tổng Giám đốc Tổng Công ty', 'PAKD hệ thống 5G Private Network cho đối tác Công ty JST (Thái Lan)')] },
    '004-26-VHT-RDP-DS': { sap: 'RD-92150', level: 'Tổng Công ty', group: 'C', unit: 'Trung tâm Nghiên cứu công nghệ kinh tế tầm thấp', block: 'Khối 3', owner: 'Vũ Đình Hùng', start: '08/05/2026', end: '30/04/2028',
      status: 'Đang thực hiện', legal: [L('8952B/QĐ-VHT', '07/05/2026', 'Tổng Giám đốc Tổng Công ty', 'Phê duyệt đề tài KHCN cấp cơ sở "Nghiên cứu xây dựng hệ thống quản lý không phận tầm thấp và thử nghiệm giải pháp phục vụ nền kinh tế tầm thấp"'),
        L('9050/QĐ-VHT', '08/05/2026', 'Tổng Giám đốc Tổng Công ty', 'Giao nhiệm vụ thực hiện đề tài KHCN cấp cơ sở')] },
    '005-26-VHT-BP-M': { sap: '', level: 'Tổng Công ty', group: 'B', unit: 'Trung tâm Giải pháp và tích hợp', block: 'Khối 2', owner: 'Ngô Thị Linh', start: '01/03/2026', end: '31/12/2026',
      status: 'Đang thực hiện', dtms: 431.95, legal: [L('25A/TTr-K2-KD', '27/02/2026', 'Tổng Giám đốc Tổng Công ty', 'Phương án kinh doanh VHT.26.GP.MX.5G.26')] },
  };

  /* T31 B2 — trường IA-DXMS dòng 5–7 còn thiếu (plan T31 §1a K3). Hệ thống cũ có, TPL-DADT-EX không xuất → giá trị mẫu GIẢ LẬP.
     Người phê duyệt là text như IA (mặc định "Tổng Giám đốc" cho chủ trương, dự án); SRS-KDT lấy người phê duyệt theo profile_classification. */
  const X = (o) => o;
  const EXTRA = {
    'NV-KHCN-2026-014': X({ plan: true, product: 'Thiết bị vô tuyến', khdt: 'KHĐT26-KHCN-014', portal: '', ttrCt: ['1320/TTr-TTVT', '02/03/2026'], qdDt: ['1483/QĐ-VHT', '12/03/2026'],
      scope: 'Thiết kế, chế tạo 02 mẫu trạm gNodeB thế hệ 2 (băng n78, n41); bộ phần mềm điều khiển; tài liệu thiết kế và quy trình đo kiểm.', reporter: 'Hoàng Thu Hà',
      apDt: 'Tổng Giám đốc Tổng Công ty', place: 'Hòa Lạc, Hà Nội' }),
    'NV-KHCN-2026-006': X({ plan: true, product: 'Thiết bị vô tuyến', khdt: 'KHĐT26-KHCN-006', ttrCt: ['0611/TTr-TTVT', '08/01/2026'], qdDt: ['0918/QĐ-VHT', '20/01/2026'],
      scope: 'Nghiên cứu, chế tạo 04 anten mảng pha băng Ka 256 phần tử và bộ điều khiển chùm tia.', reporter: 'Lê Minh Châu', apDt: 'Tổng Giám đốc Tổng Công ty', place: 'Hòa Lạc, Hà Nội' }),
    'NV-KHCN-2025-031': X({ plan: true, product: 'Phần mềm, hệ thống', khdt: 'KHĐT26-KHCN-031', portal: 'PL2600012345', ttrCt: ['2104/TTr-VHT', '20/11/2025'], qdDt: ['2211/QĐ-TĐ', '05/12/2025'],
      scope: 'Hệ thống mạng lõi 5G SA (AMF, SMF, UPF) đạt chuẩn 3GPP Rel-16; thử nghiệm tại 02 tỉnh.', reporter: 'Phạm Thị Lan', apDt: 'Tổng Giám đốc Tập đoàn', place: 'Hà Nội; TP Hồ Chí Minh' }),
    'DA-2026-002': X({ plan: false, product: 'Sản phẩm công nghiệp', khdt: 'KHĐT26-DA-002', portal: 'PL2600056789', ttrCt: ['1702/TTr-NMSX', '28/03/2026'], qdDt: ['1877/QĐ-TĐ', '14/04/2026'],
      scope: 'Sản xuất 1.200 module RRU 5G mỗi năm giai đoạn 2026–2028.', reporter: 'Phạm Hồng Sơn', apDt: 'Tổng Giám đốc Tập đoàn', place: 'Nhà máy sản xuất thử nghiệm, Hòa Lạc' }),
    'DT-KHCN-2027-002': X({ plan: true, product: 'Thiết bị vô tuyến', khdt: 'KHĐT27-KHCN-002', ttrCt: ['2280/TTr-TTVT', '15/10/2026'], qdDt: ['2392/QĐ-VHT', '28/10/2026'],
      scope: 'Phát triển trạm 5G-Advanced; trang bị hệ thống đo kiểm anten trong buồng vi sóng phục vụ đề tài.', reporter: 'Nguyễn Quang Huy', apDt: 'Tổng Giám đốc Tổng Công ty', place: 'Hòa Lạc, Hà Nội' }),
    'KHN-2027-DTPT': X({ plan: true, product: 'Hạ tầng, trang thiết bị', khdt: 'KHĐT27', scope: 'Danh mục đầu tư phát triển năm 2027 của Tổng Công ty.', reporter: 'Đỗ Thanh Tâm', place: 'Các đơn vị Tổng Công ty' }),
    'KHN-2026-TTVT': X({ plan: true, reporter: 'Hoàng Thu Hà', place: 'Trung tâm Vô tuyến' }),
    'KHN-2026-VHT': X({ plan: true, reporter: 'Đỗ Thanh Tâm' }),
  };
  const DEF_AP = 'Tổng Giám đốc';
  const pair = (p) => (p && p[0] ? `${esc(p[0])} ngày ${esc(p[1])}` : null);

  /* ---------- Đợt ĐXMS theo dòng dự toán (accordion, YC-DXMS-PROTO §3.2) ----------
     Thật: bảng giữ chỗ dòng dự toán ↔ hạng mục ĐXMS do BE ghi ở bước 1, 5. ĐXMS mẫu (GIẢ LẬP): mã → [số thứ tự dòng, số lượng].
     ĐXMS tạo trên prototype: lấy từ bảng bóc tách chi phí đã lưu (x.cost, cách 1 SCR-96 — chỉ có giá trị). */
  const USES = {
    'ĐXMS-2026-0117': { nv: 'NV-KHCN-2026-014', lines: [[1, 2], [6, 3]] },
    'ĐXMS-2026-0101': { nv: 'NV-KHCN-2026-014', lines: [[1, 1], [6, 2]] },
    'ĐXMS-2026-0072': { nv: 'NV-KHCN-2026-006', lines: [[1, 4], [2, 1], [6, 2]] },
    'ĐXMS-2026-0103': { nv: 'NV-KHCN-2025-031', lines: [[1, 3], [2, 1]] },
    /* T37 (RV-PROTO-0911 #2): ĐXMS mẫu Đã phê duyệt còn lại có bảng bóc tách để màn Điều chỉnh điền sẵn. */
    'ĐXMS-2026-0089': { nv: 'KHN-2026-VHT', lines: [[1, 2], [2, 1]] },
    'ĐXMS-2026-0112': { nv: 'KHN-2026-VHT', lines: [[3, 1]] },
  };
  const HELD = ['PD', 'DC'];
  /* ĐXMS có bảng bóc tách đã lưu (tạo trên prototype, kể cả khi nhận lại mã của ca demo) thì dùng bảng đó, không dùng USES. */
  const own = (x) => Array.isArray(x.cost) && x.cost.length > 0;
  const nvOfDxms = (x) => (!own(x) && USES[x.code] ? USES[x.code].nv : x.nv);
  const dxmsOf = (code) => Flow.dxmsAll().filter((x) => nvOfDxms(x) === code);
  /* Giá trị đã lưu là số (Lưu đã chuyển); chỉ chuỗi nhập tay mới đọc theo dấu phẩy thập phân. */
  const valOf = (v) => (typeof v === 'number' ? v : parse(v) || 0);
  function usesOf(code) {
    const lines = D.duToanOf(code), cases = window.Screens.allCases(), out = {};
    lines.forEach((l) => { out[l.id] = []; });
    dxmsOf(code).forEach((x) => {
      const st = window.Screens.dxmsMeta(x, cases).state, dot = window.Screens.s5.dotOf(x);
      const add = (id, qty, value) => { if (out[id]) out[id].push({ x, st, dot, qty, value }); };
      if (!own(x) && USES[x.code]) USES[x.code].lines.forEach(([n, qty]) => { const l = lines.find((y) => y.id === `${code}-${n}`); if (l) add(l.id, qty, r2((l.value / l.qty) * qty)); });
      else (x.cost || []).forEach((r) => add(r.line || r.id, r.qty == null ? null : r.qty, valOf(r.value)));
    });
    /* T31 B3 (D-68): KĐT bóc tách từ cùng bảng dự toán — khả dụng tính chung ĐXMS + KĐT. KĐT đã lưu là đang giữ (kể cả chưa có hồ sơ:
       BE ghi bảng giữ chỗ khi Lưu SCR-55); đã phê duyệt = đã đăng ký; dừng theo chỉ đạo thì trả lại phần giữ. */
    kdtOf(code).filter((x) => Array.isArray(x.cost) && x.cost.length).forEach((x) => {
      const stage = window.Kdt.meta(x).stage, st = stage === 'OK' ? 'OK' : stage === 'STOP' ? 'STOP' : 'PD';
      x.cost.forEach((r) => { const id = r.line || r.id; if (out[id]) out[id].push({ x, st, kdt: true, stage, qty: r.qty == null ? null : r.qty, value: valOf(r.value) }); });
    });
    return out;
  }
  function totals(code) {
    const lines = D.duToanOf(code), uses = usesOf(code);
    const t = { value: 0, buy: 0, ok: 0, held: 0, exec: 0, saving: 0, remain: 0 };
    lines.forEach((l) => {
      t.value += l.value;
      if (!l.buy) return;
      const s = D.duToanStats(l, uses[l.id]);
      t.buy += l.value; t.ok += s.ok; t.held += s.held; t.exec += s.exec; t.saving += s.saving; t.remain += s.remain;
    });
    Object.keys(t).forEach((k) => { t[k] = r2(t[k]); });
    return t;
  }

  /* Quyền: Thêm / Copy / Cập nhật / Xoá dòng dự toán — đơn vị lập đề tài (luật theo vai trò, D-65); Chi mua sắm — TTMS (D-64). */
  const me = () => persona(Flow.state.persona);
  const canTick = () => me().urd === 'R-TTMS';

  /* ---------- Bản ghi đề tài / dự án ---------- */
  const today = new Date(2026, 10, 4); /* ngày demo cố định: số ngày còn lại không đổi theo máy */
  const toDate = (s) => { const [d, m, y] = String(s || '').split('/').map(Number); return y ? new Date(y, m - 1, d) : null; };
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m.padStart(2, '0')}${d.padStart(2, '0')}` : ''; };
  function rowOf(nv) {
    const i = INFO[nv.code] || {}, legal = i.legal || [];
    const qd = legal[legal.length - 1] || {};
    const end = toDate(i.end), cases = window.Screens.allCases();
    const ok = dxmsOf(nv.code).map((x) => window.Screens.dxmsMeta(x, cases)).filter((m) => m.state === 'OK' || m.state === 'DC');
    return Object.assign({ code: nv.code, name: nv.name, nv, loai: nv.loai, loaiCt: nv.loaiCt, nguon: nv.nguon, fund: D.fundNames[nv.fund] || '', qdNo: qd.no || '', qdDate: qd.date || '',
      value: r2(D.duToanOf(nv.code).reduce((s, l) => s + l.value, 0)),
      dtms: i.dtms != null ? i.dtms : r2(ok.reduce((s, m) => s + (m.value || 0), 0)),
      days: end ? Math.max(0, Math.ceil((end - today) / 86400000)) : null }, i, { x: Object.assign({ apCt: DEF_AP, apDa: DEF_AP }, EXTRA[nv.code] || {}) });
  }
  const rows = () => D.nhiemVu.map(rowOf);
  /* T36 (D-96, Q8): Nguồn dữ liệu tách theo nguồn đồng bộ; 'cu' = chuyển một lần từ hệ thống cũ (BR-DADT-C-01). */
  const SRC_LABEL = { khcn: 'Đồng bộ KHCN', hrtool: 'Đồng bộ HR Tool', mau: 'Nhập theo mẫu', cu: 'Chuyển từ hệ thống cũ' };
  const srcLabel = (r) => SRC_LABEL[r.nguon] || SRC_LABEL.cu;
  const fieldName = (c) => { const x = (window.Catalog.rows('linh-vuc') || []).find((y) => y.code === c); return x ? x.name : c || ''; };
  const stBadge = (s) => badge(s, STATUS[s] || 'default');

  /* ---------- SCR-103 Danh sách đề tài / dự án ---------- */
  const emptyF = () => ({ level: null, block: null, unit: null, from: '', to: '', fund: null, st: null, loai: null, loaiCt: null, secret: null, src: null });
  const S = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false };
  function filtered() {
    const f = S.f;
    return rows().filter((r) => (!S.adv ? !S.kw || norm(r.code + ' ' + r.name).includes(norm(S.kw))
      : (!f.level || r.level === f.level) && (!f.block || r.block === f.block) && (!f.unit || r.unit === f.unit)
        && (!f.from || dk(r.qdDate) >= dk(f.from)) && (!f.to || dk(r.qdDate) <= dk(f.to)) && (!f.fund || r.fund === f.fund) && (!f.st || r.status === f.st)
        && (!f.loai || r.loai === f.loai) && (!f.loaiCt || r.loaiCt === f.loaiCt) && (!f.secret || (f.secret === 'Mật') === !!r.secret)
        && (!f.src || srcLabel(r) === f.src)));
  }
  const unitsOf = (block) => [...new Set(rows().filter((r) => !block || r.block === block).map((r) => r.unit))].sort((a, b) => a.localeCompare(b, 'vi'));
  function advPanel() {
    const d = S.d;
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-dtf="${k}" maxlength="10" placeholder="DD/MM/YYYY" value="${esc(d[k])}"></div>`;
    const sel = (k, label, ph, options, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'dtf-' + k, value: d[k], clear: true, searchable: options.length > 6, placeholder: ph,
      options: options.map((v) => ({ value: v, label: v })), onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
    return `<form class="adv" data-dt-adv><div class="grid3">
        ${sel('level', 'Cấp phê duyệt', 'Tất cả', LEVELS)}
        ${sel('block', 'Khối đơn vị', 'Chọn khối đơn vị', BLOCKS, { onChange: (v) => { d.block = v; if (d.unit && !unitsOf(v).includes(d.unit)) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị lập ĐT/DA', 'Chọn đơn vị lập', unitsOf(d.block))}
        ${txt('from', 'Ngày QĐ đầu tư từ')}${txt('to', 'Ngày QĐ đầu tư đến')}
        ${sel('fund', 'Nguồn vốn', 'Chọn nguồn vốn', FUNDS)}
        ${sel('st', 'Trạng thái', 'Tất cả trạng thái', Object.keys(STATUS))}
        ${sel('loai', 'Loại dự án / đề tài', 'Chọn loại dự án / đề tài', LOAI, { onChange: (v) => { d.loai = v; if (d.loaiCt && !loaiCtOf(v).includes(d.loaiCt)) d.loaiCt = null; rerender(); } })}
        ${sel('loaiCt', 'Loại dự án (chi tiết)', 'Chọn loại dự án (chi tiết)', loaiCtOf(d.loai))}
        ${sel('secret', 'DA Mật / Không Mật', 'Tất cả', ['Mật', 'Không Mật'])}
        ${sel('src', 'Nguồn dữ liệu', 'Tất cả nguồn dữ liệu', Object.values(SRC_LABEL))}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-dt="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html
    //       + utils/task-management-columns.utils.ts (vht-table, ô tìm kiếm phải); panel nâng cao theo profile-list (như SCR-27)
    const rs = filtered();
    const pages = Math.max(1, Math.ceil(rs.length / S.size));
    if (S.page > pages) S.page = pages;
    const from = (S.page - 1) * S.size;
    const cols = [['Trạng thái', 140, 'c'], ['Loại dự án / đề tài', 150], ['Mã dự án / đề tài', 170], ['Tên dự án / đề tài', 320], ['Đơn vị lập', 220], ['Chủ nhiệm', 160],
      ['Nguồn vốn', 190], ['Tổng dự toán (tỷ đồng)', 170, 'r'], ['TG bắt đầu', 120], ['TG kết thúc', 120], ['Số ngày còn thực hiện', 160, 'r'], ['Nguồn dữ liệu', 160]];
    const body = rs.slice(from, from + S.size).map((r, i) => `<tr class="click" data-go="${href(r.code)}">
        <td class="ord">${from + i + 1}</td><td class="c">${stBadge(r.status)}</td><td>${esc(r.loai)}</td><td><a class="link" data-go="${href(r.code)}">${esc(r.code)}</a></td>
        <td>${clamp(r.name)}</td><td>${clamp(r.unit)}</td><td>${clamp(r.owner)}</td><td>${clamp(r.fund)}</td><td class="r num">${num(r.value)}</td>
        <td class="num">${esc(r.start)}</td><td class="num">${esc(r.end)}</td><td class="r num">${r.days == null ? dash : r.days}</td><td>${esc(srcLabel(r))}</td></tr>`).join('');
    const info = {
      scr: 'SCR-103', name: 'Danh sách đề tài / dự án', uc: 'YC-DXMS-PROTO §2.2 · HT-DXMS-NOTE màn 1, 2 · plan T29 S6 (D-60, D-61, D-63, D-66)',
      notes: [
        '<b>Đề tài / dự án là thực thể chung, nhiệm vụ KHCN là Loại KHCN</b> (D-66). Danh mục này cũng là nguồn ô Đề tài / dự án của ĐXMS và KĐT. ĐTMS không khởi tạo đề tài / dự án (YC-DXMS-PROTO §2.1) nên không có Thêm mới, Sửa, Xoá; form Thêm mới / Cập nhật đề tài của hệ thống cũ (Note màn 3) chưa dựng (TODO).',
        'Loại KHCN: thông tin chung đồng bộ từ phân hệ KHCN — GIẢ LẬP tới khi có trả lời <code>DTMS_Q_0070</code> (KHCN FE hiện chỉ có Tổng kinh phí); <b>cần dev riêng</b>: job đồng bộ + API danh sách. Loại khác: "Nhập ở hệ thống cũ" (P-195). Danh sách hiện mọi Loại (D-61).',
        '<b>T36 (D-96)</b>: nút <b>Đồng bộ đề tài / dự án ▾</b> (khuôn nút Thao tác khác của my-task-detail), chỉ Quản trị hệ thống và TTMS (K2): <b>Đồng bộ từ KHCN</b>, <b>Đồng bộ từ HR Tool</b> mở hộp thoại Phạm vi (Thay đổi từ mốc / Toàn bộ / Một đề tài); <b>Xem lịch sử đồng bộ</b> mở SCR-109. Mỗi nguồn khoá riêng khi đang có lần chạy (Q6). Chạy nền, thông báo bắt đầu và kết quả kèm link Xem chi tiết. Nguồn dữ liệu: Đồng bộ KHCN / Đồng bộ HR Tool / Nhập theo mẫu / Chuyển từ hệ thống cũ, thêm ô lọc (Q8). HR Tool cấp Loại SXKD, Dự án đầu tư (GIẢ LẬP P-227); API HR Tool cần làm thêm (P-228). SRS: <code>docs/SRS/11-srs-dong-bo-dadt</code>.',
        'Tìm kiếm nâng cao theo Note màn 1: Cấp phê duyệt, Khối đơn vị → Đơn vị lập (theo khối), Ngày QĐ đầu tư, Nguồn vốn, Trạng thái, Loại → Loại chi tiết (theo Loại, ánh xạ P-198), Mật. Cột theo Note màn 2; bỏ cột Hành động vì không có thao tác trên dòng, mở chi tiết bằng mã (như D-43). Thêm cột Nguồn dữ liệu (D-61).',
        'Tổng dự toán = tổng giá trị sau thuế của bảng dự toán nhập tại ĐTMS (D-65). Xuất Excel theo TPL-DADT-EX sheet1 (18 cột, có 6 cột danh sách không hiện: Mã SAP, Cấp phê duyệt, Nhóm, Số / Ngày QĐ, Tổng giá trị ĐTMS). Lọc Mật, Khối, Loại chi tiết không có cột tương ứng ở danh sách lẫn mẫu xuất. Note có 6 Loại, TPL-DADT-IM chỉ 4.',
        'Số ngày còn thực hiện = TG kết thúc − ngày hiện tại, hết hạn thì 0 (dòng mẫu TPL thứ 2 hết hạn vẫn Đang thực hiện).',
      ],
      q: ['P-195', 'P-198', 'P-227', 'P-228'], src: 'task-management/task-management.component · /task-management · nút menu xổ: my-tasks/my-task-detail (Thao tác khác)',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách đề tài / dự án', info, right: `${window.DtSync.button()}<button type="button" class="vbtn secondary" data-dt="export">${icon('excel')} Xuất Excel</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${S.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="dt-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên dự án / đề tài" value="${esc(S.kw)}"></label>`}
          <button type="button" class="vbtn ${S.adv ? 'active' : 'secondary'}" data-dt="adv">${S.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${S.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable" data-dt-list><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Không có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'dt', total: rs.length, page: S.page, size: S.size, open: S.psOpen })}
      </div></div>`;
  }
  /* Mẫu xuất = TPL-DADT-EX sheet1 (tiền theo đồng). */
  const EXPORT_HEAD = ['STT', 'Dự án/ Đề tài/ …', 'Tên dự án/ đề tài', 'Mã dự án/ đề tài', 'Mã dự án/ đề tài SAP', 'Cấp phê duyệt', 'Nguồn vốn', 'Nhóm dự án/ đề tài', 'Số quyết định',
    'Ngày quyết định', 'Tổng dự toán được duyệt', 'Tổng Giá trị đầu tư mua sắm', 'Bắt đầu', 'Kết thúc', 'Số ngày còn lại', 'Đơn vị lập dự án/ đề tài', 'Chủ nhiệm dự án/ đề tài', 'Trạng thái'];
  const exportRow = (r, i) => [i + 1, r.loai, r.name, r.code, r.sap, r.level, r.fund, r.group, r.qdNo, r.qdDate, Math.round(r.value * 1e9), Math.round((r.dtms || 0) * 1e9),
    r.start, r.end, r.days == null ? '' : r.days, r.block ? `${r.unit} - ${r.block}` : r.unit, r.owner, r.status];
  const exportList = () => csv('Danh sach Du an De tai.csv', [['DANH SÁCH DỰ ÁN ĐỀ TÀI - TCT CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL'], [], EXPORT_HEAD].concat(filtered().map(exportRow)));

  /* ---------- SCR-104 Chi tiết đề tài / dự án ---------- */
  const T = { code: null, tab: 'info', open: new Set(), seen: false };
  const typeName = (t) => (D.costTypes.find(([k]) => k === t) || [t, t])[1];
  const dxmsHref = (code) => (window.Luong.isGop() ? 'luong/' : 'dxms/') + encodeURIComponent(code);
  const dxBadge = (s) => badge(window.Screens.DXMS_STATUS[s][0], window.Screens.DXMS_STATUS[s][1]);
  function infoTab(r) {
    return `<section class="vcard pad24 gen"><h3>Thông tin chung</h3><div class="ginfo c3">
      ${kv('Mã dự án / đề tài', esc(r.code))}${kv('Tên dự án / đề tài', esc(r.name), 'span2')}
      ${kv('Loại dự án / đề tài', esc(r.loai))}${kv('Loại dự án (chi tiết)', esc(r.loaiCt))}${kv('Mã dự án SAP', esc(r.sap))}
      ${kv('Cấp phê duyệt', esc(r.level))}${kv('Nhóm dự án', esc(r.group))}${kv('Nguồn vốn', esc(r.fund))}
      ${kv('Lĩnh vực', esc(fieldName(r.nv.field)))}${kv('Đơn vị chủ trì', esc(r.unit))}${kv('Khối đơn vị', esc(r.block))}
      ${kv('Chủ nhiệm', esc(r.owner))}${kv('Người phụ trách báo cáo', esc(r.x.reporter || ''))}${kv('Lập theo kế hoạch năm', r.x.plan == null ? null : r.x.plan ? 'Có' : 'Không')}
      ${kv('Loại sản phẩm', esc(r.x.product || ''))}${kv('Mã dự án theo KHĐT năm', esc(r.x.khdt || ''))}${kv('ID dự án trên cổng Đấu thầu QG', esc(r.x.portal || ''))}
      ${kv('Tổng dự toán (gồm VAT)', ty(r.value) + ' tỷ đồng')}${kv('Tổng giá trị đầu tư mua sắm', ty(r.dtms || 0) + ' tỷ đồng')}${kv('Địa điểm đầu tư', esc(r.x.place || ''))}
      ${kv('Thời gian thực hiện', r.start ? `${esc(r.start)} – ${esc(r.end)}` : null)}
      ${kv('Số ngày còn thực hiện', r.days == null ? null : String(r.days))}${kv('Trạng thái (tình trạng dự án)', stBadge(r.status))}
      ${kv('Mật', r.secret ? 'Có' : 'Không')}${kv('Ngày nghiệm thu', esc(r.x.accept || ''))}${kv('Nguồn dữ liệu', esc(srcLabel(r)))}
      ${kv('Nội dung, quy mô dự án (thông tin sản phẩm)', esc(r.x.scope || ''), 'span3')}</div></section>
      <section class="vcard pad24 gen" data-dt-approve><h3>Phê duyệt</h3><div class="ginfo c3">
      ${kv('Số / ngày TTr chủ trương', pair(r.x.ttrCt))}${kv('Số / ngày QĐ phê duyệt dự án', pair([r.qdNo, r.qdDate]))}${kv('Số / ngày QĐ phê duyệt dự toán', pair(r.x.qdDt))}
      ${kv('Người phê duyệt chủ trương', esc(r.x.apCt || ''))}${kv('Người phê duyệt dự án', esc(r.x.apDa || ''))}${kv('Người phê duyệt dự toán', esc(r.x.apDt || ''))}
      ${kv('Người phê duyệt quyết toán', esc(r.x.apQt || ''))}</div></section>`;
  }
  /* T29 B15 (D-79, Huylx4 #7; thay phần chọn tay của D-72): Trạng thái khoản mục Chi mua sắm do hệ thống suy từ các ĐXMS / KĐT bóc tách khoản mục —
     Chưa mua sắm (chưa có, hoặc chỉ có bản Dừng xử lý) / Đang mua sắm (có bản đang xử lý) / Đã phê duyệt (mọi bản đã phê duyệt). TTMS chỉ đặt thêm
     Hoàn thành = không bóc tách thêm (GIẢ LẬP P-203); bỏ Hoàn thành thì về trạng thái suy. Thật: BE tính khi đọc dự toán từ bảng giữ chỗ (S4). */
  const LINE_BADGE = { 'Chưa mua sắm': 'default', 'Đang mua sắm': 'info', 'Đã phê duyệt': 'success', 'Hoàn thành': 'warning' };
  function lineState(l, us) {
    if (l.status === 'Hoàn thành') return 'Hoàn thành';
    const live = (us || []).filter((u) => u.st !== 'STOP');
    if (!live.length) return 'Chưa mua sắm';
    return live.every((u) => u.st === 'OK') ? 'Đã phê duyệt' : 'Đang mua sắm';
  }
  const lineBadge = (s) => badge(s, LINE_BADGE[s] || 'default');
  const stSel = (l, us) => { const auto = lineState(Object.assign({}, l, { status: '' }), us);
    return vSelect({ id: 'dts-' + l.id, value: l.status === 'Hoàn thành' ? 'Hoàn thành' : 'auto', searchable: false,
      options: [{ value: 'auto', label: auto }, { value: 'Hoàn thành', label: 'Hoàn thành' }],
      onChange: (v) => { const nv = v === 'Hoàn thành' ? 'Hoàn thành' : ''; if (nv === (l.status === 'Hoàn thành' ? 'Hoàn thành' : '')) return;
        D.duToanSave(T.code, Object.assign({}, l, { status: nv })); toast('<b>Thành công</b><br>Cập nhật Trạng thái thành công'); rerender(); } }); };
  function duToanTab(r) {
    const lines = D.duToanOf(r.code), uses = usesOf(r.code), t = totals(r.code), tick = canTick();
    const groups = [...new Set(lines.map((l) => l.type))].sort().map((type) => {
      const ls = lines.filter((l) => l.type === type);
      return { key: 'g:' + type, kind: 'g', type, pre: ls.reduce((s, l) => s + l.pre, 0), tax: ls.reduce((s, l) => s + l.tax, 0), value: ls.reduce((s, l) => s + l.value, 0),
        children: ls.map((l) => ({ key: l.id, kind: 'l', l, s: D.duToanStats(l, uses[l.id]), children: uses[l.id].map((u, i) => ({ key: `${l.id}:${u.x.code}`, kind: 'u', u, n: i + 1 })) })) };
    });
    if (!T.seen) { groups.forEach((g) => T.open.add(g.key)); T.seen = true; }
    const cell = (f) => (x) => (f[x.kind] ? f[x.kind](x) : '');
    const columns = [
      { h: 'Loại chi phí / Khoản mục chi phí', w: 320, toggler: true, pin: true, cell: cell({ g: (g) => `<b>${esc(typeName(g.type))}</b>`, l: (x) => clamp(x.l.item),
        u: (x) => (x.u.kdt ? `KĐT — <a class="link" data-go="kdt/${encodeURIComponent(x.u.x.code)}">${esc(x.u.x.code)}</a>`
          : `Đợt ${x.u.dot || x.n} — <a class="link" data-go="${dxmsHref(x.u.x.code)}">${esc(x.u.x.code)}</a>`) }) },
    ].concat([
      /* T29 B15 (Huylx4 #6): số lượng đứng trước ĐVT. */
      { h: 'Khối lượng cần thực hiện', w: 150, align: 'r', cell: cell({ l: (x) => (x.l.qty == null ? dash : String(x.l.qty)) }) },
      { h: 'ĐVT', w: 80, cell: cell({ l: (x) => esc(x.l.uom || '') }) },
      { h: 'Giá trị trước thuế', w: 130, align: 'r', cell: cell({ g: (g) => num(g.pre), l: (x) => num(x.l.pre) }) },
      { h: '%VAT', w: 70, align: 'r', cell: cell({ l: (x) => x.l.vat + '%' }) },
      { h: 'Thuế GTGT', w: 110, align: 'r', cell: cell({ g: (g) => num(g.tax), l: (x) => num(x.l.tax) }) },
      { h: 'Giá trị sau thuế', w: 130, align: 'r', cell: cell({ g: (g) => num(g.value), l: (x) => num(x.l.value), u: (x) => num(x.u.value) }) },
      { h: 'Giá trị thực hiện', w: 130, align: 'r', cell: cell({ l: (x) => (x.l.buy ? num(x.s.exec) : dash), u: (x) => (x.u.st === 'OK' ? num(x.u.value * D.duToanExecRate) : dash) }) },
      { h: 'Giá trị tiết kiệm', w: 130, align: 'r', cell: cell({ l: (x) => (x.l.buy ? num(x.s.saving) : dash) }) },
      { h: 'Khối lượng đã thực hiện', w: 150, align: 'r', cell: cell({ l: (x) => (x.l.buy ? String(x.s.qty) : dash), u: (x) => (x.u.qty == null ? dash : String(x.u.qty)) }) },
      { h: 'Còn lại khả dụng', w: 130, align: 'r', cell: cell({ l: (x) => (x.l.buy ? `<span class="${x.s.remain < 0 ? 't-err' : ''}">${num(x.s.remain)}</span>` : dash) }) },
      { h: 'Chi mua sắm', w: 110, align: 'c', cell: cell({ l: (x) => `<label class="check"><input type="checkbox" data-dt-buy="${esc(x.l.id)}" aria-label="Chi mua sắm" ${x.l.buy ? 'checked' : ''} ${tick ? '' : 'disabled'}></label>` }) },
      { h: 'Trạng thái', w: 170, align: 'c', cell: cell({ l: (x) => (!x.l.buy ? dash : tick ? stSel(x.l, uses[x.l.id]) : lineBadge(lineState(x.l, uses[x.l.id]))), u: (x) => (x.u.kdt ? badge(window.Kdt.KDT_STAGE[x.u.stage][0], window.Kdt.KDT_STAGE[x.u.stage][1]) : dxBadge(x.u.st)) }) },
      { h: 'Ghi chú', w: 200, cell: cell({ l: (x) => clamp(x.l.note) }) },
    ]);
    const pct = t.buy ? Math.round(((t.ok + t.held) / t.buy) * 1000) / 10 : 0;
    return `<section class="vcard pad24 gen" data-dt-kpi><h3>Chỉ số thực hiện</h3><div class="ginfo c3">
        ${kv('Tổng dự toán (gồm VAT)', ty(t.value) + ' tỷ đồng')}${kv('Giá trị chi mua sắm', ty(t.buy) + ' tỷ đồng')}${kv('Đã đăng ký mua (ĐXMS / KĐT đã phê duyệt)', ty(t.ok) + ' tỷ đồng')}
        ${kv('Đang giữ (ĐXMS / KĐT đang xử lý)', ty(t.held) + ' tỷ đồng')}${kv('Còn lại khả dụng', ty(t.remain) + ' tỷ đồng')}${kv('Giá trị thực hiện (hợp đồng)', ty(t.exec) + ' tỷ đồng')}
        ${kv('Giá trị tiết kiệm', ty(t.saving) + ' tỷ đồng')}${kv('Tỷ lệ đã đăng ký mua', String(pct).replace('.', ',') + '%')}</div></section>
      <section class="vcard" data-dt-dutoan><div class="vcard-h"><h3>Dự toán chi phí</h3><div class="row"><span class="cap">Đơn vị tiền: tỷ đồng</span>
        <button type="button" class="vbtn secondary" data-dt-x="export">${icon('excel')} Xuất Excel</button></div></div>
        ${vTreeTable({ id: 'dt-dutoan', columns, rows: groups, expanded: T.open, empty: 'Chưa có dự toán',
          onToggle: (k) => { if (T.open.has(k)) T.open.delete(k); else T.open.add(k); rerender(); } })}</section>`;
  }
  /* Xuất dự toán theo cột Note màn 4. */
  function exportDuToan(code) {
    const uses = usesOf(code);
    csv(`Du toan ${code}.csv`, [['STT', 'Loại chi phí', 'Khoản mục chi phí', 'Khối lượng cần thực hiện', 'ĐVT', 'Giá trị trước thuế', '%VAT', 'Thuế GTGT', 'Giá trị sau thuế', 'Giá trị thực hiện', 'Giá trị tiết kiệm',
      'Khối lượng đã thực hiện', 'Chi mua sắm', 'Trạng thái', 'Ghi chú']].concat(D.duToanOf(code).map((l, i) => {
      const s = D.duToanStats(l, uses[l.id]);
      return [i + 1, typeName(l.type), l.item, l.qty, l.uom, l.pre, l.vat, l.tax, l.value, l.buy ? s.exec : '', l.buy ? s.saving : '', l.buy ? s.qty : '', l.buy ? 'Có' : 'Không', l.buy ? lineState(l, uses[l.id]) : '', l.note];
    })));
  }
  function dxmsTab(r) {
    const cases = window.Screens.allCases();
    const list0 = dxmsOf(r.code).map((x) => Object.assign({ m: window.Screens.dxmsMeta(x, cases) }, x));
    return `<section class="vcard"><h3>ĐXMS liên quan</h3>
      ${table([['Trạng thái', 150, 'c'], ['Mã ĐXMS', 170], ['Tên ĐXMS', 340], ['Đợt', 70, 'c'], ['Đơn vị đề xuất', 200], ['Giá trị hiệu lực (tỷ đồng)', 180, 'r'], ['Người tạo', 170], ['Ngày cập nhật', 140]], list0,
    (x) => `<td class="c">${dxBadge(x.m.state)}</td><td><a class="link" data-go="${dxmsHref(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
        <td class="c">${window.Screens.s5.dotOf(x) || dash}</td><td>${clamp(x.unit)}</td><td class="r num">${x.m.value != null ? ty(x.m.value) : dash}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td>`, 'Chưa có ĐXMS')}</section>
    ${D.show.dtKdt ? kdtTab(r) : ''}`;
  }
  /* T31 B2 (D-69): KĐT chọn đề tài / dự án này (D-45). Trạng thái, tổng mức vốn hiệu lực suy từ hồ sơ như SCR-54. */
  const kdtOf = (code) => Flow.kdtAll().filter((x) => x.nv === code);
  function kdtTab(r) {
    const K = window.Kdt, list0 = kdtOf(r.code).map((x) => Object.assign({ m: K.meta(x) }, x));
    return `<section class="vcard" data-dt-kdt><h3>KĐT liên quan</h3>
      ${table([['Trạng thái', 200, 'c'], ['Mã KĐT', 150], ['Tên KĐT', 340], ['Đơn vị đề xuất', 200], ['Nhóm KĐT', 170], ['Tổng mức vốn (tỷ đồng)', 170, 'r'], ['Người tạo', 170], ['Ngày cập nhật', 140]], list0,
    (x) => `<td class="c">${badge(K.KDT_STAGE[x.m.stage][0], K.KDT_STAGE[x.m.stage][1])}</td><td><a class="link" data-go="kdt/${encodeURIComponent(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
        <td>${clamp(x.unit)}</td><td>${x.m.group ? esc(D.kdtGroups[x.m.group]) : '<span class="faint">Chưa xác định</span>'}</td><td class="r num">${x.m.value != null ? ty(x.m.value) : dash}</td>
        <td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td>`, 'Chưa có KĐT')}</section>`;
  }
  /* T31 B2 — IA dòng 4, TPL-DADT-EX Sheet2, Sheet6: gói thầu của KHLCNT lập từ ĐXMS / KĐT của đề tài; hợp đồng của gói thầu. Gói có nhiều nguồn
     (srcs) lấy giá trị phân bổ cho nguồn thuộc đề tài. Hợp đồng không qua gói thầu (Sheet3) chưa có trên prototype. */
  function thauOf(code) {
    const T = window.Thau, H = window.HopDong;
    const mine = dxmsOf(code).map((x) => ['DXMS', x.code]).concat(kdtOf(code).map((x) => ['KDT', x.code]));
    const pk = [];
    T.khAll().forEach((k) => T.pkgsOf(k).forEach((g) => {
      const hits = (g.srcs || [k.src]).filter(([kind, c]) => mine.some(([a, b]) => a === kind && b === c));
      if (hits.length) pk.push({ g: T.pkRow(g), k, hits, alloc: g.srcs ? r2(hits.reduce((s0, h) => s0 + (h[2] || 0), 0)) : g.price });
    }));
    return { pk, hd: pk.map((p) => ({ p, h: H.byPkg(p.g.code) })).filter((x) => x.h) };
  }
  function thauTab(r) {
    const T = window.Thau, H = window.HopDong, k = T.kit, { pk, hd } = thauOf(r.code);
    const srcLink = (h) => `<a class="link" data-go="${h[0] === 'KDT' ? 'kdt/' : 'dxms/'}${encodeURIComponent(h[1])}">${esc(h[1])}</a>`;
    const win = (g) => { const b = (g.bidders || []).find((x) => x[0] === g.winner); return b ? b[1] : null; };
    const qd = (kh) => (kh.docs || {}).bm03 || [];
    return `<section class="vcard" data-dt-pk><div class="vcard-h"><h3>Gói thầu</h3><span class="cap">Đơn vị tiền: tỷ đồng</span></div>
      ${table([['Trạng thái', 190, 'c'], ['Số gói thầu', 150], ['Tên gói thầu', 300], ['Nguồn', 170], ['Lĩnh vực', 170], ['Hình thức LCNT', 190], ['Giá gói thầu', 120, 'r'], ['Giá trị phân bổ', 130, 'r'],
      ['Giá trúng thầu', 130, 'r'], ['Người phụ trách', 170], ['KHLCNT', 160], ['Số / ngày QĐ phê duyệt KHLCNT', 230]], pk,
    (p) => `<td class="c">${badge(...T.PK_ST[p.g.stx])}</td><td><a class="link" data-go="goi-thau/${encodeURIComponent(p.g.code)}">${esc(p.g.code)}</a></td><td>${clamp(p.g.name)}</td>
        <td>${p.hits.map(srcLink).join(', ')}</td><td>${clamp(k.cat('loai-goi-thau', p.g.type))}</td><td>${clamp(k.cat('hinh-thuc-lcnt', p.g.form))}</td><td class="r num">${num(p.g.price)}</td>
        <td class="r num">${num(p.alloc)}</td><td class="r num">${win(p.g) == null ? dash : num(win(p.g))}</td><td>${clamp(p.k.owner || p.k.creator)}</td>
        <td><a class="link" data-go="khlcnt/${encodeURIComponent(p.k.code)}">${esc(p.k.code)}</a></td><td>${qd(p.k)[0] ? `${esc(qd(p.k)[0])} ngày ${esc(qd(p.k)[1])}` : dash}</td>`, 'Chưa có gói thầu')}</section>
      <section class="vcard" data-dt-hd><div class="vcard-h"><h3>Hợp đồng</h3><span class="cap">Đơn vị tiền: tỷ đồng</span></div>
      ${table([['Trạng thái', 170, 'c'], ['Mã hợp đồng', 150], ['Số hợp đồng', 190], ['Tên hợp đồng', 300], ['Gói thầu', 150], ['Ngày ký', 120], ['Đối tác ký HĐ', 220], ['Giá trị ký HĐ', 130, 'r'],
      ['Loại HĐ', 170], ['Người theo dõi HĐ', 170]], hd,
    (x) => `<td class="c">${badge(...H.HD_ST[x.h.st])}</td><td><a class="link" data-go="hop-dong/${encodeURIComponent(x.h.code)}">${esc(x.h.code)}</a></td><td>${x.h.no ? esc(x.h.no) : dash}</td>
        <td>${clamp(x.h.title)}</td><td><a class="link" data-go="goi-thau/${encodeURIComponent(x.p.g.code)}">${esc(x.p.g.code)}</a></td><td class="num">${x.h.sign ? esc(x.h.sign) : dash}</td>
        <td>${clamp(k.nccName(x.h.ncc))}</td><td class="r num">${num(x.h.value)}</td><td>${clamp(k.cat('loai-hop-dong', x.h.type))}</td><td>${clamp(x.h.owner)}</td>`, 'Chưa có hợp đồng')}</section>`;
  }
  /* Góp ý 05/11: cột tải file văn bản pháp lý (tệp bản ký; nguồn: KHCN đồng bộ / hệ thống cũ — GIẢ LẬP tên tệp). */
  const legalFile = (v) => `${String(v.no).replace(/\//g, '-')}.pdf`;
  function phapLyTab(r) {
    return `<section class="vcard"><h3>Văn bản pháp lý</h3>
      ${table([['Thao tác', 90, 'c'], ['Số văn bản', 160], ['Ngày văn bản', 130], ['Người ký', 220], ['Nội dung', 520]], r.legal || [],
    (v) => `<td class="c"><div class="acts">${iconBtn('download', 'Tải file', `data-dl="${esc(legalFile(v))}"`)}</div></td><td>${esc(v.no)}</td><td class="num">${esc(v.date)}</td><td>${clamp(v.signer)}</td><td>${clamp(v.content)}</td>`)}</section>`;
  }
  function detail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode detail) + app-tabs, vht-tree-table (@khcn-core/ui)
    const nv = D.nvOf(code);
    if (!nv) return `<div class="pg">${head({ title: 'Xem chi tiết đề tài / dự án', back: 'de-tai', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy đề tài / dự án.</div></section></div>`;
    const r = rowOf(nv);
    /* T29 B15 (D-80): bản demo ĐXMS ẩn KĐT liên quan và tab Gói thầu / Hợp đồng theo cờ D.show. */
    const tabs = [['info', 'Thông tin chung'], ['du-toan', 'Dự toán chi phí'], ['dxms', D.show.dtKdt ? 'ĐXMS / KĐT liên quan' : 'ĐXMS liên quan'],
      ['thau', 'Gói thầu / Hợp đồng'], ['phap-ly', 'Văn bản pháp lý']].filter(([k]) => k !== 'thau' || D.show.dtThau);
    if (T.code !== code) Object.assign(T, { code, tab: 'info', open: new Set(), seen: false });
    if (!tabs.some(([k]) => k === T.tab)) T.tab = 'info';
    const body = { info: infoTab, 'du-toan': duToanTab, dxms: dxmsTab, thau: thauTab, 'phap-ly': phapLyTab }[T.tab](r);
    const info = {
      scr: 'SCR-104', name: 'Chi tiết đề tài / dự án', uc: 'YC-DXMS-PROTO §2.2, §3 · HT-DXMS-NOTE màn 3–6 · TPL-DADT-EX sheet2, 5, 6 · IA-DXMS dòng 4–9 · plan T29 S6, S7 (D-60, D-64, D-65, D-66), plan T31 K3 (D-69)',
      notes: [
        'Thông tin chung chỉ xem: Loại KHCN đồng bộ từ phân hệ KHCN (GIẢ LẬP, <code>DTMS_Q_0070</code>), loại khác từ hệ thống cũ (P-195). Trường theo YC-DXMS-PROTO §2.2 (Tên, Mã, Chủ nhiệm, Đơn vị chủ trì, Tổng kinh phí, Thời gian, Lĩnh vực) và Note màn 3. Lĩnh vực chỉ YC-DXMS-PROTO có.',
        '<b>Dự toán chi phí chỉ xem</b> (góp ý người dùng 05/11, thay phần nhập tại ĐTMS của D-65): không có Thêm mới / Sao chép / Sửa / Xoá; mọi người xem và Xuất Excel. Nguồn dữ liệu chờ trả lời P-204 (GIẢ LẬP: dữ liệu mẫu). Cột <b>Loại chi phí / Khoản mục chi phí</b> ghim khi cuộn ngang. Một bảng dự toán dùng chung với card bóc tách ở Thêm mới luồng mua sắm và Thêm mới KĐT.',
        'Khối lượng cần thực hiện = số lượng dự toán; Khối lượng đã thực hiện, Giá trị thực hiện, Giá trị tiết kiệm tính từ ĐXMS / KĐT, hợp đồng.',
        'Khuôn bảng <code>vht-tree-table</code>: Loại chi phí (PL1–PL6) → Khoản mục → <b>các đợt ĐXMS</b> của khoản mục (YC-DXMS-PROTO §3.2), mã ĐXMS mở chi tiết.',
        '<b>Chi mua sắm</b> (YC-DXMS-PROTO §3.1): chỉ TTMS tích / bỏ tích, lưu ở ĐTMS. Không bỏ tích được khi khoản mục đang có ĐXMS giữ (D-64). Đơn vị đề xuất chỉ bóc tách được khoản mục đã tích (B9). Dòng không tích thì không có Trạng thái (Note màn 4). <b>Trạng thái</b> (góp ý 05/11): TTMS chọn Đang thực hiện / Hoàn thành ngay trên bảng, chỉ hiện khi đã tích Chi mua sắm; vai khác xem nhãn. Hoàn thành thì khoản mục không còn bóc tách được ở ĐXMS / KĐT (GIẢ LẬP P-203).',
        'Chỉ số (YC-DXMS-PROTO §3.3, BG-0411 mục 4), trên khoản mục Chi mua sắm: Đã đăng ký mua = ĐXMS đã phê duyệt; Đang giữ = ĐXMS đang xử lý; Còn lại khả dụng = dự toán − đã đăng ký − đang giữ (cùng cách tính cột "Còn có thể sử dụng" của căn cứ, BR-DXMS-02-04). Giá trị thực hiện từ hợp đồng, quyết toán từ SAP: GIẢ LẬP 94 % phần đã phê duyệt; tiết kiệm = đã phê duyệt − thực hiện. <b>Cần dev riêng</b>: bảng giữ chỗ dòng dự toán ↔ hạng mục ĐXMS và truy vấn tổng hợp.',
        'Đợt của ĐXMS mẫu GIẢ LẬP; ĐXMS tạo ở Thêm mới luồng lấy từ bảng bóc tách chi phí đã lưu (chưa có số lượng — B9). Tab Văn bản pháp lý theo TPL-DADT-EX sheet5, thêm cột <b>Thao tác</b> tải file văn bản (góp ý 05/11; tên tệp GIẢ LẬP theo số văn bản).',
        '<b>T31 B2</b> (IA-DXMS dòng 4–7; D-69): Thông tin chung thêm các trường IA còn thiếu — Lập theo kế hoạch năm, Loại sản phẩm, Mã dự án theo KHĐT năm, ID dự án trên cổng Đấu thầu QG, Người phụ trách báo cáo, Địa điểm đầu tư, Ngày nghiệm thu, Nội dung, quy mô dự án; card <b>Phê duyệt</b>: Số / ngày TTr chủ trương, QĐ phê duyệt dự án, QĐ phê duyệt dự toán, Người phê duyệt chủ trương / dự án / dự toán / quyết toán. "Tình trạng dự án" = Trạng thái. Người phê duyệt là <b>text</b> như IA (mặc định Tổng Giám đốc cho chủ trương, dự án) — khác SRS-KDT (người phê duyệt theo <code>profile_classification</code>). GIẢ LẬP: giá trị mẫu; IA không cho danh sách giá trị Loại sản phẩm, Nhóm dự án.',
        '<b>T31 B2</b>: tab <b>ĐXMS / KĐT liên quan</b> thêm bảng KĐT chọn đề tài này (D-45; trạng thái, nhóm, tổng mức vốn như Danh sách KĐT). Tab <b>Gói thầu / Hợp đồng</b> (IA dòng 4, TPL-DADT-EX Sheet2, Sheet6): gói thầu của các KHLCNT lập từ ĐXMS / KĐT của đề tài, gói có nhiều nguồn hiện Giá trị phân bổ cho đề tài; hợp đồng của các gói đó. Thật: truy vấn liên kết KHLCNT ↔ nguồn ↔ đề tài, không dev riêng. Hợp đồng không qua gói thầu (Sheet3) chưa có trên prototype.',
        '<b>T29 B15</b> (review Huylx4 05/11): cột Khối lượng cần thực hiện đứng trước ĐVT (#6). <b>Trạng thái khoản mục do hệ thống suy</b> từ ĐXMS / KĐT bóc tách khoản mục — Chưa mua sắm / Đang mua sắm / Đã phê duyệt; TTMS chỉ đặt thêm Hoàn thành (D-79, thay phần chọn tay của D-72). Bản demo ĐXMS <b>ẩn bảng KĐT liên quan và tab Gói thầu / Hợp đồng</b> theo cờ cấu hình (D-80; bật lại khi demo KĐT / Thầu).',
      ],
      q: ['P-195', 'P-198', 'P-203', 'P-204'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs, vht-tree-table',
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết đề tài / dự án', back: 'de-tai', lg: true, info })}
      <nav class="tabs dx-tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="tab ${T.tab === k ? 'on' : ''}" role="tab" aria-selected="${T.tab === k}" data-dt-tab="${k}">${l}</button>`).join('')}</nav>
      ${body}</div>`;
  }

  /* ---------- Sự kiện ---------- */
  const onList = () => /^#\/de-tai\/?$/.test(location.hash);
  const lineOf = (id) => D.duToanOf(T.code).find((x) => x.id === id);
  document.addEventListener('click', async (e) => {
    const t = e.target;
    const tb = t.closest('[data-dt-tab]');
    if (tb) { T.tab = tb.dataset.dtTab; rerender(); return; }
    const x = t.closest('[data-dt-x]');
    if (x) { exportDuToan(T.code); return; }
    if (!onList()) return;
    const pg = t.closest('[data-pager="dt"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) S.page = Number(b.dataset.pg);
      else if (s) { S.size = Number(s.dataset.ps); S.page = 1; S.psOpen = false; } else if (t.closest('[data-ps-open]')) S.psOpen = !S.psOpen;
      else return;
      rerender(); return;
    }
    if (S.psOpen) { S.psOpen = false; rerender(); }
    const a = t.closest('[data-dt]');
    if (!a) return;
    if (a.dataset.dt === 'export') { exportList(); return; }
    if (a.dataset.dt === 'adv') { S.adv = !S.adv; S.d = JSON.parse(JSON.stringify(S.f)); S.page = 1; }
    if (a.dataset.dt === 'reset') { S.d = emptyF(); S.f = emptyF(); S.page = 1; }
    rerender();
  });
  document.addEventListener('change', (e) => {
    const c = e.target.closest && e.target.closest('[data-dt-buy]');
    if (!c) return;
    const l = lineOf(c.dataset.dtBuy);
    if (!l || !canTick()) { rerender(); return; }
    if (!c.checked) {
      const held = usesOf(T.code)[l.id].filter((u) => HELD.includes(u.st));
      if (held.length) {
        c.checked = true;
        toast(`<b>Không thể bỏ Chi mua sắm</b><br>Khoản mục đang được giữ bởi ${held.map((u) => esc(u.x.code)).join(', ')}.`, 'error');
        return;
      }
    }
    D.duToanSave(T.code, Object.assign({}, l, { buy: c.checked }));
    toast('<b>Thành công</b><br>Cập nhật Chi mua sắm thành công');
    rerender();
  });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-dt-adv]')) { e.preventDefault(); S.f = JSON.parse(JSON.stringify(S.d)); S.page = 1; rerender(); } });
  document.addEventListener('input', (e) => { const f = e.target.closest && e.target.closest('[data-dtf]'); if (f) S.d[f.dataset.dtf] = f.value; });
  /* vht-search-input: tìm khi Enter (như SCR-27). */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'dt-kw') return;
    S.kw = e.target.value.trim(); S.page = 1;
    rerender();
    const k = document.getElementById('dt-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  function route(parts) {
    if (parts[1] === 'dong-bo') return window.DtSync.page();
    const code = parts[1] ? decodeURIComponent(parts[1]) : null;
    return code ? detail(code) : list();
  }
  /* B9 (S8) đọc phần còn lại khả dụng và đợt ĐXMS khi bóc tách dòng dự toán vào ĐXMS. */
  /* T34 (người dùng 09/11): bản ghi Đề tài / dự án theo mã — Thông tin chung của Chi tiết luồng mua sắm (SCR-97) lấy Nguồn vốn, Số / ngày TTr, QĐ. */
  const info = (code) => { const nv = D.nvOf(code); return nv ? rowOf(nv) : null; };
  /* T37 (RV-PROTO-0911 #2): bảng bóc tách của một ĐXMS — bảng đã lưu (x.cost) hoặc dòng mẫu USES; dùng khi Điều chỉnh điền sẵn từ ĐXMS cũ. */
  function costOf(x) {
    if (!x) return [];
    if (own(x)) return x.cost.map((r) => ({ line: r.line || r.id, qty: r.qty, value: valOf(r.value), pkg: r.pkg || '' }));
    const u = USES[x.code];
    if (!u) return [];
    const lines = D.duToanOf(u.nv);
    return u.lines.map(([n, qty]) => { const l = lines.find((y) => y.id === `${u.nv}-${n}`); return l ? { line: l.id, qty: l.qty == null ? null : qty, value: r2((l.value / (l.qty || 1)) * qty), pkg: '' } : null; }).filter(Boolean);
  }
  window.DeTai = { route, usesOf, rows, href, kdtOf, thauOf, info, pair, costOf };
})();
