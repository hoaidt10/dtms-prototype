/* T29 S6, S7 — Đề tài / dự án (plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md v0.5 §3.10; YC-DXMS-PROTO §2, §3;
   HT-DXMS-NOTE màn 1, 2, 4, 5, 6; TPL-DADT-EX). SCR-103 Danh sách #/de-tai, SCR-104 Chi tiết #/de-tai/<mã> (tab Thông tin chung, Dự toán chi phí,
   ĐXMS liên quan, Văn bản pháp lý). Danh mục = D.nhiemVu (D-66: nhiệm vụ KHCN là Loại KHCN; cùng nguồn ô Đề tài / dự án của ĐXMS và KĐT).
   Thông tin chung chỉ xem (Loại KHCN đồng bộ từ phân hệ KHCN — D-60, GIẢ LẬP tới DTMS_Q_0070). Dự toán chi phí nhập tại ĐTMS cho mọi Loại
   (D-65, bảng D.duToanOf dùng chung với card bóc tách chi phí SCR-96); cờ Chi mua sắm chỉ TTMS đổi (D-64). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, ty, vSelect, vModal, badge, pager, norm, toast, vTreeTable } = window.UI;
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
  const inNum = (n) => (n == null || n === '' ? '' : String(n).replace('.', ','));
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

  /* ---------- Đợt ĐXMS theo dòng dự toán (accordion, YC-DXMS-PROTO §3.2) ----------
     Thật: bảng giữ chỗ dòng dự toán ↔ hạng mục ĐXMS do BE ghi ở bước 1, 5. ĐXMS mẫu (GIẢ LẬP): mã → [số thứ tự dòng, số lượng].
     ĐXMS tạo trên prototype: lấy từ bảng bóc tách chi phí đã lưu (x.cost, cách 1 SCR-96 — chỉ có giá trị). */
  const USES = {
    'ĐXMS-2026-0117': { nv: 'NV-KHCN-2026-014', lines: [[1, 2], [6, 3]] },
    'ĐXMS-2026-0101': { nv: 'NV-KHCN-2026-014', lines: [[1, 1], [6, 2]] },
    'ĐXMS-2026-0072': { nv: 'NV-KHCN-2026-006', lines: [[1, 4], [2, 1], [6, 2]] },
    'ĐXMS-2026-0103': { nv: 'NV-KHCN-2025-031', lines: [[1, 3], [2, 1]] },
  };
  const HELD = ['PD', 'DC'];
  /* ĐXMS có bảng bóc tách đã lưu (tạo trên prototype, kể cả khi nhận lại mã của ca demo) thì dùng bảng đó, không dùng USES. */
  const own = (x) => Array.isArray(x.cost) && x.cost.length > 0;
  const nvOfDxms = (x) => (!own(x) && USES[x.code] ? USES[x.code].nv : x.nv);
  const dxmsOf = (code) => Flow.dxmsAll().filter((x) => nvOfDxms(x) === code);
  function usesOf(code) {
    const lines = D.duToanOf(code), cases = window.Screens.allCases(), out = {};
    lines.forEach((l) => { out[l.id] = []; });
    dxmsOf(code).forEach((x) => {
      const st = window.Screens.dxmsMeta(x, cases).state, dot = window.Screens.s5.dotOf(x);
      const add = (id, qty, value) => { if (out[id]) out[id].push({ x, st, dot, qty, value }); };
      if (!own(x) && USES[x.code]) USES[x.code].lines.forEach(([n, qty]) => { const l = lines.find((y) => y.id === `${code}-${n}`); if (l) add(l.id, qty, r2((l.value / l.qty) * qty)); });
      else (x.cost || []).forEach((r) => add(r.line || r.id, r.qty == null ? null : r.qty, parse(r.value) || 0));
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
  const canEdit = (r) => me().unit === r.unit;

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
      days: end ? Math.max(0, Math.ceil((end - today) / 86400000)) : null }, i);
  }
  const rows = () => D.nhiemVu.map(rowOf);
  const srcLabel = (r) => (r.nguon === 'khcn' ? 'KHCN (đồng bộ)' : 'Nhập ở hệ thống cũ');
  const fieldName = (c) => { const x = (window.Catalog.rows('linh-vuc') || []).find((y) => y.code === c); return x ? x.name : c || ''; };
  const stBadge = (s) => badge(s, STATUS[s] || 'default');

  /* ---------- SCR-103 Danh sách đề tài / dự án ---------- */
  const emptyF = () => ({ level: null, block: null, unit: null, from: '', to: '', fund: null, st: null, loai: null, loaiCt: null, secret: null });
  const S = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false };
  function filtered() {
    const f = S.f;
    return rows().filter((r) => (!S.adv ? !S.kw || norm(r.code + ' ' + r.name).includes(norm(S.kw))
      : (!f.level || r.level === f.level) && (!f.block || r.block === f.block) && (!f.unit || r.unit === f.unit)
        && (!f.from || dk(r.qdDate) >= dk(f.from)) && (!f.to || dk(r.qdDate) <= dk(f.to)) && (!f.fund || r.fund === f.fund) && (!f.st || r.status === f.st)
        && (!f.loai || r.loai === f.loai) && (!f.loaiCt || r.loaiCt === f.loaiCt) && (!f.secret || (f.secret === 'Mật') === !!r.secret)));
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
        ${sel('secret', 'DA Mật / Không Mật', 'Tất cả', ['Mật', 'Không Mật'])}</div>
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
        'Tìm kiếm nâng cao theo Note màn 1: Cấp phê duyệt, Khối đơn vị → Đơn vị lập (theo khối), Ngày QĐ đầu tư, Nguồn vốn, Trạng thái, Loại → Loại chi tiết (theo Loại, ánh xạ P-198), Mật. Cột theo Note màn 2; bỏ cột Hành động vì không có thao tác trên dòng, mở chi tiết bằng mã (như D-43). Thêm cột Nguồn dữ liệu (D-61).',
        'Tổng dự toán = tổng giá trị sau thuế của bảng dự toán nhập tại ĐTMS (D-65). Xuất Excel theo TPL-DADT-EX sheet1 (18 cột, có 6 cột danh sách không hiện: Mã SAP, Cấp phê duyệt, Nhóm, Số / Ngày QĐ, Tổng giá trị ĐTMS). Lọc Mật, Khối, Loại chi tiết không có cột tương ứng ở danh sách lẫn mẫu xuất. Note có 6 Loại, TPL-DADT-IM chỉ 4.',
        'Số ngày còn thực hiện = TG kết thúc − ngày hiện tại, hết hạn thì 0 (dòng mẫu TPL thứ 2 hết hạn vẫn Đang thực hiện).',
      ],
      q: ['P-195', 'P-198'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách đề tài / dự án', info, right: `<button type="button" class="vbtn secondary" data-dt="export">${icon('excel')} Xuất Excel</button>` })}
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
      ${kv('Chủ nhiệm', esc(r.owner))}${kv('Số quyết định phê duyệt', esc(r.qdNo))}${kv('Ngày quyết định', esc(r.qdDate))}
      ${kv('Tổng dự toán (gồm VAT)', ty(r.value) + ' tỷ đồng')}${kv('Tổng giá trị đầu tư mua sắm', ty(r.dtms || 0) + ' tỷ đồng')}
      ${kv('Thời gian thực hiện', r.start ? `${esc(r.start)} – ${esc(r.end)}` : null)}
      ${kv('Số ngày còn thực hiện', r.days == null ? null : String(r.days))}${kv('Trạng thái', stBadge(r.status))}${kv('Mật', r.secret ? 'Có' : 'Không')}
      ${kv('Nguồn dữ liệu', esc(srcLabel(r)))}</div></section>`;
  }
  function duToanTab(r) {
    const lines = D.duToanOf(r.code), uses = usesOf(r.code), t = totals(r.code), tick = canTick(), edit = canEdit(r);
    const groups = [...new Set(lines.map((l) => l.type))].sort().map((type) => {
      const ls = lines.filter((l) => l.type === type);
      return { key: 'g:' + type, kind: 'g', type, pre: ls.reduce((s, l) => s + l.pre, 0), tax: ls.reduce((s, l) => s + l.tax, 0), value: ls.reduce((s, l) => s + l.value, 0),
        children: ls.map((l) => ({ key: l.id, kind: 'l', l, s: D.duToanStats(l, uses[l.id]), children: uses[l.id].map((u, i) => ({ key: `${l.id}:${u.x.code}`, kind: 'u', u, n: i + 1 })) })) };
    });
    if (!T.seen) { groups.forEach((g) => T.open.add(g.key)); T.seen = true; }
    const cell = (f) => (x) => (f[x.kind] ? f[x.kind](x) : '');
    const acts = (l) => `<div class="acts">${iconBtn('file', 'Sao chép', `data-dt-copy="${esc(l.id)}"`)}<span class="sep"></span>${iconBtn('edit', 'Sửa', `data-dt-edit="${esc(l.id)}"`)}<span class="sep"></span>${iconBtn('del', 'Xoá', `data-dt-del="${esc(l.id)}"`)}</div>`;
    const columns = [
      { h: 'Loại chi phí / Khoản mục chi phí', w: 320, toggler: true, cell: cell({ g: (g) => `<b>${esc(typeName(g.type))}</b>`, l: (x) => clamp(x.l.item),
        u: (x) => `Đợt ${x.u.dot || x.n} — <a class="link" data-go="${dxmsHref(x.u.x.code)}">${esc(x.u.x.code)}</a>` }) },
    ].concat(edit ? [{ h: 'Thao tác', w: 130, align: 'c', cell: cell({ l: (x) => acts(x.l) }) }] : [], [
      { h: 'ĐVT', w: 80, cell: cell({ l: (x) => esc(x.l.uom || '') }) },
      { h: 'Giá trị trước thuế', w: 130, align: 'r', cell: cell({ g: (g) => num(g.pre), l: (x) => num(x.l.pre) }) },
      { h: '%VAT', w: 70, align: 'r', cell: cell({ l: (x) => x.l.vat + '%' }) },
      { h: 'Thuế GTGT', w: 110, align: 'r', cell: cell({ g: (g) => num(g.tax), l: (x) => num(x.l.tax) }) },
      { h: 'Giá trị sau thuế', w: 130, align: 'r', cell: cell({ g: (g) => num(g.value), l: (x) => num(x.l.value), u: (x) => num(x.u.value) }) },
      { h: 'Giá trị thực hiện', w: 130, align: 'r', cell: cell({ l: (x) => (x.l.buy ? num(x.s.exec) : dash), u: (x) => (x.u.st === 'OK' ? num(x.u.value * D.duToanExecRate) : dash) }) },
      { h: 'Giá trị tiết kiệm', w: 130, align: 'r', cell: cell({ l: (x) => (x.l.buy ? num(x.s.saving) : dash) }) },
      { h: 'Khối lượng cần thực hiện', w: 150, align: 'r', cell: cell({ l: (x) => (x.l.qty == null ? dash : String(x.l.qty)) }) },
      { h: 'Khối lượng đã thực hiện', w: 150, align: 'r', cell: cell({ l: (x) => (x.l.buy ? String(x.s.qty) : dash), u: (x) => (x.u.qty == null ? dash : String(x.u.qty)) }) },
      { h: 'Còn lại khả dụng', w: 130, align: 'r', cell: cell({ l: (x) => (x.l.buy ? `<span class="${x.s.remain < 0 ? 't-err' : ''}">${num(x.s.remain)}</span>` : dash) }) },
      { h: 'Chi mua sắm', w: 110, align: 'c', cell: cell({ l: (x) => `<label class="check"><input type="checkbox" data-dt-buy="${esc(x.l.id)}" aria-label="Chi mua sắm" ${x.l.buy ? 'checked' : ''} ${tick ? '' : 'disabled'}></label>` }) },
      { h: 'Trạng thái', w: 150, align: 'c', cell: cell({ l: (x) => (x.l.buy ? stBadge(x.l.status) : dash), u: (x) => dxBadge(x.u.st) }) },
      { h: 'Ghi chú', w: 200, cell: cell({ l: (x) => clamp(x.l.note) }) },
    ]);
    const pct = t.buy ? Math.round(((t.ok + t.held) / t.buy) * 1000) / 10 : 0;
    return `<section class="vcard pad24 gen" data-dt-kpi><h3>Chỉ số thực hiện</h3><div class="ginfo c3">
        ${kv('Tổng dự toán (gồm VAT)', ty(t.value) + ' tỷ đồng')}${kv('Giá trị chi mua sắm', ty(t.buy) + ' tỷ đồng')}${kv('Đã đăng ký mua (ĐXMS đã phê duyệt)', ty(t.ok) + ' tỷ đồng')}
        ${kv('Đang giữ (ĐXMS đang xử lý)', ty(t.held) + ' tỷ đồng')}${kv('Còn lại khả dụng', ty(t.remain) + ' tỷ đồng')}${kv('Giá trị thực hiện (hợp đồng)', ty(t.exec) + ' tỷ đồng')}
        ${kv('Giá trị tiết kiệm', ty(t.saving) + ' tỷ đồng')}${kv('Tỷ lệ đã đăng ký mua', String(pct).replace('.', ',') + '%')}</div></section>
      <section class="vcard" data-dt-dutoan><div class="vcard-h"><h3>Dự toán chi phí</h3><div class="row"><span class="cap">Đơn vị tiền: tỷ đồng</span>
        <button type="button" class="vbtn secondary" data-dt-x="export">${icon('excel')} Xuất Excel</button>${edit ? `<button type="button" class="vbtn primary" data-dt-x="add">${icon('add')} Thêm mới</button>` : ''}</div></div>
        ${vTreeTable({ id: 'dt-dutoan', columns, rows: groups, expanded: T.open, empty: 'Chưa có dự toán',
          onToggle: (k) => { if (T.open.has(k)) T.open.delete(k); else T.open.add(k); rerender(); } })}</section>`;
  }
  /* Xuất dự toán theo cột Note màn 4. */
  function exportDuToan(code) {
    const uses = usesOf(code);
    csv(`Du toan ${code}.csv`, [['STT', 'Loại chi phí', 'Khoản mục chi phí', 'ĐVT', 'Giá trị trước thuế', '%VAT', 'Thuế GTGT', 'Giá trị sau thuế', 'Giá trị thực hiện', 'Giá trị tiết kiệm',
      'Khối lượng cần thực hiện', 'Khối lượng đã thực hiện', 'Chi mua sắm', 'Trạng thái', 'Ghi chú']].concat(D.duToanOf(code).map((l, i) => {
      const s = D.duToanStats(l, uses[l.id]);
      return [i + 1, typeName(l.type), l.item, l.uom, l.pre, l.vat, l.tax, l.value, l.buy ? s.exec : '', l.buy ? s.saving : '', l.qty, l.buy ? s.qty : '', l.buy ? 'Có' : 'Không', l.buy ? l.status : '', l.note];
    })));
  }
  function dxmsTab(r) {
    const cases = window.Screens.allCases();
    const list0 = dxmsOf(r.code).map((x) => Object.assign({ m: window.Screens.dxmsMeta(x, cases) }, x));
    return `<section class="vcard"><h3>ĐXMS liên quan</h3>
      ${table([['Trạng thái', 150, 'c'], ['Mã ĐXMS', 170], ['Tên ĐXMS', 340], ['Đợt', 70, 'c'], ['Đơn vị đề xuất', 200], ['Giá trị hiệu lực (tỷ đồng)', 180, 'r'], ['Người tạo', 170], ['Ngày cập nhật', 140]], list0,
    (x) => `<td class="c">${dxBadge(x.m.state)}</td><td><a class="link" data-go="${dxmsHref(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td>
        <td class="c">${window.Screens.s5.dotOf(x) || dash}</td><td>${clamp(x.unit)}</td><td class="r num">${x.m.value != null ? ty(x.m.value) : dash}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.updated)}</td>`, 'Chưa có ĐXMS')}</section>`;
  }
  function phapLyTab(r) {
    return `<section class="vcard"><h3>Văn bản pháp lý</h3>
      ${table([['Số văn bản', 160], ['Ngày văn bản', 130], ['Người ký', 220], ['Nội dung', 520]], r.legal || [],
    (v) => `<td>${esc(v.no)}</td><td class="num">${esc(v.date)}</td><td>${clamp(v.signer)}</td><td>${clamp(v.content)}</td>`)}</section>`;
  }
  function detail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode detail) + app-tabs, vht-tree-table (@khcn-core/ui)
    const nv = D.nvOf(code);
    if (!nv) return `<div class="pg">${head({ title: 'Xem chi tiết đề tài / dự án', back: 'de-tai', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy đề tài / dự án.</div></section></div>`;
    const r = rowOf(nv);
    const tabs = [['info', 'Thông tin chung'], ['du-toan', 'Dự toán chi phí'], ['dxms', 'ĐXMS liên quan'], ['phap-ly', 'Văn bản pháp lý']];
    if (T.code !== code) Object.assign(T, { code, tab: 'info', open: new Set(), seen: false });
    const body = { info: infoTab, 'du-toan': duToanTab, dxms: dxmsTab, 'phap-ly': phapLyTab }[T.tab](r);
    const info = {
      scr: 'SCR-104', name: 'Chi tiết đề tài / dự án', uc: 'YC-DXMS-PROTO §2.2, §3 · HT-DXMS-NOTE màn 3–6 · TPL-DADT-EX sheet5 · plan T29 S6, S7 (D-60, D-64, D-65, D-66)',
      notes: [
        'Thông tin chung chỉ xem: Loại KHCN đồng bộ từ phân hệ KHCN (GIẢ LẬP, <code>DTMS_Q_0070</code>), loại khác từ hệ thống cũ (P-195). Trường theo YC-DXMS-PROTO §2.2 (Tên, Mã, Chủ nhiệm, Đơn vị chủ trì, Tổng kinh phí, Thời gian, Lĩnh vực) và Note màn 3. Lĩnh vực chỉ YC-DXMS-PROTO có.',
        '<b>Dự toán chi phí nhập tại ĐTMS cho mọi Loại</b> (D-65; Note sheet "KHCN Thông tin Dự toán" ghi KHCN không cung cấp). Đơn vị lập đề tài Thêm mới / Copy / Cập nhật / Xoá (luật hiển thị theo vai trò); mọi người xem và Xuất Excel. Khi KHCN đồng bộ được thì dòng Loại KHCN chuyển sang chỉ đọc (trừ Chi mua sắm, Trạng thái, Ghi chú). Một bảng dự toán dùng chung với card bóc tách chi phí ở Thêm mới luồng mua sắm. <b>Cần dev riêng</b>: bảng dự toán + API CRUD.',
        'Form Thêm mới / Cập nhật theo Note màn 5: Thuế GTGT, Giá trị sau thuế tự tính (biểu thức trong form); ô Nhập tay tick thì tự nhập Thuế GTGT (P-199). Khối lượng cần thực hiện = số lượng dự toán; Khối lượng đã thực hiện, Giá trị thực hiện, Giá trị tiết kiệm chỉ đọc (từ ĐXMS, hợp đồng). Xoá bị chặn khi dòng đã có ĐXMS dùng.',
        'Khuôn bảng <code>vht-tree-table</code>: Loại chi phí (PL1–PL6) → Khoản mục → <b>các đợt ĐXMS</b> của khoản mục (YC-DXMS-PROTO §3.2), mã ĐXMS mở chi tiết.',
        '<b>Chi mua sắm</b> (YC-DXMS-PROTO §3.1): chỉ TTMS tích / bỏ tích, lưu ở ĐTMS. Không bỏ tích được khi khoản mục đang có ĐXMS giữ (D-64). Đơn vị đề xuất chỉ bóc tách được khoản mục đã tích (B9). Dòng không tích thì không có Trạng thái (Note màn 4).',
        'Chỉ số (YC-DXMS-PROTO §3.3, BG-0411 mục 4), trên khoản mục Chi mua sắm: Đã đăng ký mua = ĐXMS đã phê duyệt; Đang giữ = ĐXMS đang xử lý; Còn lại khả dụng = dự toán − đã đăng ký − đang giữ (cùng cách tính cột "Còn có thể sử dụng" của căn cứ, BR-DXMS-02-04). Giá trị thực hiện từ hợp đồng, quyết toán từ SAP: GIẢ LẬP 94 % phần đã phê duyệt; tiết kiệm = đã phê duyệt − thực hiện. <b>Cần dev riêng</b>: bảng giữ chỗ dòng dự toán ↔ hạng mục ĐXMS và truy vấn tổng hợp.',
        'Đợt của ĐXMS mẫu GIẢ LẬP; ĐXMS tạo ở Thêm mới luồng lấy từ bảng bóc tách chi phí đã lưu (chưa có số lượng — B9). Tab Văn bản pháp lý theo TPL-DADT-EX sheet5; Gói thầu / Hợp đồng của đề tài (sheet2–4) chưa dựng (TODO).',
      ],
      q: ['P-195', 'P-198', 'P-199'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id · @khcn-core/ui app-tabs, vht-tree-table',
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết đề tài / dự án', back: 'de-tai', lg: true, info })}
      <nav class="tabs dx-tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="tab ${T.tab === k ? 'on' : ''}" role="tab" aria-selected="${T.tab === k}" data-dt-tab="${k}">${l}</button>`).join('')}</nav>
      ${body}</div>`;
  }

  /* ---------- Hộp thoại Thêm mới / Cập nhật dòng dự toán (Note màn 5; khuôn catalog-form-dialog, vht-modal) ---------- */
  const VATS = [0, 5, 8, 10];
  function lineDialog(code, line, copy) {
    const r = rowOf(D.nvOf(code)), uses = line && !copy ? usesOf(code)[line.id] : [];
    const s = line && !copy ? D.duToanStats(line, uses) : null;
    const v = line ? { type: line.type, item: line.item + (copy ? ' (bản sao)' : ''), uom: line.uom || '', qty: inNum(line.qty), pre: inNum(line.pre), vat: line.vat, manual: !!line.manual,
      tax: inNum(line.tax), status: line.status, note: line.note || '' } : { type: null, item: '', uom: '', qty: '', pre: '', vat: 10, manual: false, tax: '', status: 'Đang thực hiện', note: '' };
    const buy = line ? line.buy : false, err = {};
    const title = line && !copy ? 'Cập nhật dòng dự toán' : 'Thêm mới dòng dự toán';
    const fld = (k, label, ctl, o) => `<div class="vfield ${err[k] ? 'invalid' : ''} ${o && o.span ? 'span2' : ''}" data-ff="${k}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req">*</span>' : ''}</div>${ctl}${err[k] ? `<p class="msg" role="alert">${esc(err[k])}</p>` : ''}</div>`;
    const inp = (k, ph, o) => `<input class="vctl" data-lf="${k}" ${o && o.dec ? 'inputmode="decimal"' : ''} maxlength="${(o && o.max) || 255}" placeholder="${ph}" value="${esc(v[k])}" ${o && o.dis ? 'disabled' : ''}>`;
    const ro = (val) => `<input class="vctl" value="${esc(val)}" disabled>`;
    const read = (m) => { m.el.querySelectorAll('[data-lf]').forEach((el) => { v[el.dataset.lf] = el.type === 'checkbox' ? el.checked : el.value; }); };
    const calc = () => { const pre = parse(v.pre), c = D.duToanCalc({ pre: pre || 0, vat: v.vat, manual: v.manual, tax: parse(v.tax) }); return pre == null || Number.isNaN(pre) ? null : c; };
    const form = () => {
      const c = calc(), q = parse(v.qty);
      return `<form class="cat-form g2" novalidate data-dt-form>
        ${fld('type', 'Loại chi phí', vSelect({ id: 'dtl-type', value: v.type, placeholder: 'Chọn loại chi phí', invalid: !!err.type, options: D.costTypes.map(([k, l]) => ({ value: k, label: l })), onChange: (x) => { v.type = x; delete err.type; draw(); } }), { req: true })}
        ${fld('item', 'Khoản mục chi phí', inp('item', 'Nhập khoản mục chi phí', { max: 500 }), { req: true })}
        ${fld('uom', 'Đơn vị tính', inp('uom', 'Nhập đơn vị tính', { max: 50 }))}
        ${fld('qty', 'Khối lượng cần thực hiện', inp('qty', 'Nhập khối lượng', { dec: true, max: 15 }), { req: true })}
        ${fld('pre', 'Giá trị trước thuế (tỷ đồng)', inp('pre', 'Nhập giá trị trước thuế', { dec: true, max: 18 }), { req: true })}
        ${fld('vat', '%VAT', vSelect({ id: 'dtl-vat', value: v.vat, options: VATS.map((x) => ({ value: x, label: x + '%' })), onChange: (x) => { v.vat = x; draw(); } }))}
        ${fld('manual', 'Nhập tay', `<label class="check"><input type="checkbox" data-lf="manual" ${v.manual ? 'checked' : ''}> Tự nhập Thuế GTGT</label>`)}
        ${fld('tax', 'Thuế GTGT (tỷ đồng)', v.manual ? inp('tax', 'Nhập thuế GTGT', { dec: true, max: 18 }) : ro(c ? ty(c.tax) : ''), { req: v.manual })}
        ${fld('value', 'Giá trị sau thuế (tỷ đồng)', ro(c ? ty(c.value) : ''))}
        ${fld('price', 'Đơn giá (tỷ đồng)', ro(c && q ? ty(r2(c.value / q)) : ''))}
        ${fld('exec', 'Giá trị thực hiện (tỷ đồng)', ro(s && buy ? ty(s.exec) : ''))}
        ${fld('saving', 'Giá trị tiết kiệm (tỷ đồng)', ro(s && buy ? ty(s.saving) : ''))}
        ${fld('done', 'Khối lượng đã thực hiện', ro(s && buy ? String(s.qty) : ''))}
        ${fld('buy', 'Chi mua sắm', ro(buy ? 'Có' : 'Không'))}
        ${buy ? fld('status', 'Trạng thái', vSelect({ id: 'dtl-st', value: v.status, options: ['Đang thực hiện', 'Hoàn thành'].map((x) => ({ value: x, label: x })), onChange: (x) => { v.status = x; draw(); } })) : ''}
        ${fld('note', 'Ghi chú', `<textarea class="vctl ta" data-lf="note" maxlength="1000" rows="2" placeholder="Nhập ghi chú">${esc(v.note)}</textarea>`, { span: true })}</form>`;
    };
    const m = vModal({ title, size: 'lg', body: `<div data-dt-dlg>${form()}</div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="dtl-save">Lưu</button>' });
    function draw() { read(m); m.el.querySelector('[data-dt-dlg]').innerHTML = form(); }
    m.el.addEventListener('change', (e) => { if (e.target.matches('[data-lf="manual"]')) draw(); });
    m.el.addEventListener('input', (e) => { if (e.target.matches('[data-lf="pre"], [data-lf="qty"], [data-lf="tax"]')) { const k = e.target.dataset.lf, pos = e.target.selectionStart; draw(); const el = m.el.querySelector(`[data-lf="${k}"]`); if (el) { el.focus(); el.setSelectionRange(pos, pos); } } });
    m.el.querySelector('#dtl-save').onclick = () => {
      read(m);
      Object.keys(err).forEach((k) => delete err[k]);
      const pre = parse(v.pre), qty = parse(v.qty), tax = parse(v.tax);
      if (!v.type) err.type = 'Bạn cần chọn Loại chi phí.';
      if (!v.item.trim()) err.item = 'Bạn cần nhập Khoản mục chi phí.';
      if (qty == null) err.qty = 'Bạn cần nhập Khối lượng cần thực hiện.'; else if (Number.isNaN(qty) || qty <= 0) err.qty = 'Khối lượng phải là số lớn hơn 0.';
      if (pre == null) err.pre = 'Bạn cần nhập Giá trị trước thuế.'; else if (Number.isNaN(pre) || pre < 0) err.pre = 'Giá trị trước thuế không đúng định dạng.';
      if (v.manual && (tax == null || Number.isNaN(tax) || tax < 0)) err.tax = 'Bạn cần nhập Thuế GTGT đúng định dạng.';
      if (!err.qty && s && buy && qty < s.qty) err.qty = `Khối lượng không được nhỏ hơn khối lượng đã thực hiện (${s.qty}).`;
      if (Object.keys(err).length) { m.el.querySelector('[data-dt-dlg]').innerHTML = form(); return; }
      D.duToanSave(code, Object.assign({}, line && !copy ? line : {}, { id: line && !copy ? line.id : undefined, type: v.type, item: v.item.trim(), uom: v.uom.trim(), qty, pre, vat: v.vat,
        manual: v.manual, tax: v.manual ? tax : null, status: buy ? v.status : 'Đang thực hiện', note: v.note.trim(), buy: line && !copy ? line.buy : false }));
      m.close();
      toast(line && !copy ? '<b>Thành công</b><br>Cập nhật thành công' : '<b>Thành công</b><br>Thêm mới thành công');
      rerender();
    };
    return r;
  }

  /* ---------- Sự kiện ---------- */
  const onList = () => /^#\/de-tai\/?$/.test(location.hash);
  const lineOf = (id) => D.duToanOf(T.code).find((x) => x.id === id);
  document.addEventListener('click', async (e) => {
    const t = e.target;
    const tb = t.closest('[data-dt-tab]');
    if (tb) { T.tab = tb.dataset.dtTab; rerender(); return; }
    const x = t.closest('[data-dt-x]');
    if (x) { if (x.dataset.dtX === 'add') lineDialog(T.code, null); else exportDuToan(T.code); return; }
    const cp = t.closest('[data-dt-copy]'), ed = t.closest('[data-dt-edit]'), dl = t.closest('[data-dt-del]');
    if (cp || ed) { e.stopPropagation(); lineDialog(T.code, lineOf((cp || ed).dataset[cp ? 'dtCopy' : 'dtEdit']), !!cp); return; }
    if (dl) {
      e.stopPropagation();
      const l = lineOf(dl.dataset.dtDel), us = usesOf(T.code)[l.id];
      if (us.length) { toast(`<b>Không thể xoá</b><br>Khoản mục đã được dùng ở ${us.map((u) => esc(u.x.code)).join(', ')}.`, 'error'); return; }
      const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa dòng dự toán', desc: `Bạn có chắc chắn muốn xóa khoản mục ${l.item} không? Thao tác này không thể hoàn tác.`, hl: l.item, cancel: 'Hủy', ok: 'Xóa' });
      if (!yes) return;
      D.duToanDel(T.code, l.id);
      toast('<b>Thành công</b><br>Xóa thành công');
      rerender(); return;
    }
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
    const code = parts[1] ? decodeURIComponent(parts[1]) : null;
    return code ? detail(code) : list();
  }
  /* B9 (S8) đọc phần còn lại khả dụng và đợt ĐXMS khi bóc tách dòng dự toán vào ĐXMS. */
  window.DeTai = { route, usesOf, rows, href };
})();
