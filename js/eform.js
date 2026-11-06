/* Quản lý E-Form — Hồ sơ & biểu mẫu › E-Form & mẫu Word (#/eform, D-4). Tài liệu: docs/dtms/prototype-EFORM-chuan-bi.md.
   Theo fe/repo-khcn-ecat-fe/src/app/features/common-catalog/catalogs/e-form (e-form-list, e-form.facade, e-form-history-dialog,
   constants/e-form.constants.ts, e-form-dialog, e-form-designer). B1: SCR-49 Danh sách + SCR-53 Lịch sử; B2: SCR-50 hộp thoại Thêm mới / Chỉnh sửa;
   B3: SCR-51 Thiết kế + SCR-52 Xem trước; B4: mở SCR-51 từ panel "Biểu mẫu phần tử" của SCR-42 (chỉ xem khi Dừng hoạt động), biểu mẫu cho SCR-44. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, infoBtn, vSelect, vModal, toast, pager, norm, badge } = window.UI;
  const rerender = () => window.App.render();
  const STORE = 'dtms-proto-eform';
  const ROLES = ['qt'];
  const ENTITY = 'biểu mẫu e-form';

  /* E_FORM_STATUS_OPTIONS */
  const STATUS = [{ value: 'ACTIVE', label: 'Đang hoạt động' }, { value: 'INACTIVE', label: 'Dừng hoạt động' }];

  /* ---------- Dữ liệu mẫu (§3.2): biểu mẫu của luồng MS01, trường theo CanvasField của designer ---------- */
  let fid = 0;
  const fld = (type, label, key, extra) => Object.assign({ id: 'f' + (++fid), type, label, key, required: false }, extra);
  const req = { required: true };
  const TA = (label, key, extra) => fld('TEXTAREA', label, key, extra);
  const TX = (label, key, extra) => fld('TEXT', label, key, extra);
  const KET_LUAN = () => fld('RADIO', 'Kết luận', 'ketLuan', { required: true, options: ['Đồng ý', 'Không đồng ý'] });
  const camel = (s) => norm(s).replace(/[^a-z0-9 ]/g, ' ').trim().split(/\s+/).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join('');

  const QT = () => { const p = D.personas.find((x) => x.id === 'qt'); return `${p.name} (Quản trị hệ thống)`; };
  const created = (at, extra) => [{ version: 'v1.0', at, action: 'Tạo mới biểu mẫu', desc: 'Khởi tạo biểu mẫu e-form trong hệ thống.' }].concat(extra || []);
  const cfg = (version, at, desc) => ({ version, at, action: 'Cập nhật cấu hình biểu mẫu', desc });

  function seed() {
    fid = 0;
    const bm04 = D.bm04Sections.map((s) => TA(s, camel(s), req)).concat(KET_LUAN());
    const rows = [
      ['BM-01', 'Tờ trình đề xuất mua sắm', 'Tờ trình', 'BM-01_To-trinh-DXMS.docx',
        [TA('Căn cứ', 'canCu', req), TA('Sự cần thiết', 'suCanThiet', req), fld('NUMBER', 'Tổng giá trị (tỷ đồng)', 'tongGiaTri', req),
          fld('DROPDOWN', 'Nguồn vốn', 'nguonVon', { required: true, options: ['Vốn KHCN', 'Vốn đầu tư phát triển', 'Vốn SXKD'] }),
          fld('DATETIME', 'Thời gian thực hiện', 'thoiGianThucHien', { dateFormat: 'MM/YYYY' }), fld('FILE', 'Tệp phụ lục chi phí', 'tepPhuLucChiPhi', { multiple: true })],
        created('02/03/2026 09:10:00', [cfg('v1.1', '30/06/2026 15:20:00', 'Thêm trường Tệp phụ lục chi phí theo trang MS01 v1.1.')])],
      ['BM-02', 'Thuyết minh / phụ lục giải trình', 'Thuyết minh', 'BM-02_Thuyet-minh-giai-trinh.docx',
        [TA('Nội dung giải trình', 'noiDungGiaiTrinh', req), TA('Ý kiến tiếp thu', 'yKienTiepThu'), fld('FILE', 'Phụ lục kèm theo', 'phuLuc', { multiple: true })],
        created('02/03/2026 09:15:00')],
      ['BM-03', 'Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS', 'Công văn', 'BM-03_CV-de-nghi-gop-y-du-thao-DXMS.docx',
        [fld('TAGLIST', 'Danh sách CQCM', 'danhSachCqcm', { required: true, options: D.cqcm.map((c) => c.unit) }),
          fld('DATETIME', 'Hạn góp ý', 'hanGopY', { required: true, dateFormat: 'DD/MM/YYYY' }), TA('Nội dung đề nghị thẩm định', 'noiDungDeNghi')],
        created('02/03/2026 09:20:00', [cfg('v1.1', '30/06/2026 15:25:00', 'Danh sách CQCM chuyển sang Nhận nhiều chọn.')])],
      ['BM-04', 'Phiếu nhận xét', 'Phiếu', 'BM-04_Phieu-nhan-xet.docx', bm04,
        created('02/03/2026 09:25:00', [cfg('v1.1', '30/06/2026 15:30:00', 'Thêm trường Kết luận (key ketLuan).'),
          cfg('v1.2', '15/07/2026 10:05:00', 'Tách mục Phương án kỹ thuật – công nghệ.')])],
      ['BM-05', 'Báo cáo kết quả thẩm định', 'Báo cáo', 'BM-05_Bao-cao-ket-qua-tham-dinh.docx',
        [TA('Tổng hợp ý kiến CQCM', 'tongHopYKien', req), TA('Kết quả thẩm định', 'ketQuaThamDinh', req), TA('Kiến nghị', 'kienNghi'), KET_LUAN()],
        created('02/03/2026 09:30:00')],
      ['BM-06', 'Công văn báo cáo TGĐ Tập đoàn', 'Công văn', 'BM-06_Cong-van-bao-cao-TGD.docx',
        [TX('Số công văn', 'soCongVan', req), TX('Trích yếu', 'trichYeu', req), TA('Nội dung báo cáo', 'noiDungBaoCao', req), fld('DATETIME', 'Ngày ban hành', 'ngayBanHanh')],
        created('02/03/2026 09:35:00')],
      ['BM-07', 'Báo cáo của Ban ĐTXD Tập đoàn', 'Báo cáo', 'BM-07_Bao-cao-Ban-DTXD.docx',
        [TA('Ý kiến của Ban ĐTXD', 'yKienBanDtxd', req), TA('Đề xuất', 'deXuat'), KET_LUAN()],
        created('02/03/2026 09:40:00')],
      ['BM-08', 'Quyết định phê duyệt ĐXMS', 'Quyết định', 'BM-08_Quyet-dinh-phe-duyet.docx',
        [TX('Số quyết định', 'soQuyetDinh', req), fld('DATETIME', 'Ngày quyết định', 'ngayQuyetDinh', req), fld('NUMBER', 'Giá trị phê duyệt (tỷ đồng)', 'giaTriPheDuyet', req),
          TA('Nội dung phê duyệt', 'noiDungPheDuyet', req), fld('FILE', 'Quyết định đã ký', 'quyetDinhDaKy')],
        created('02/03/2026 09:45:00')],
      ['BM-09', 'Tờ trình ĐXMS (< 160 tỷ)', 'Tờ trình', 'BM-09_To-trinh-DXMS-duoi-160-ty.docx',
        [TA('Căn cứ', 'canCu', req), TA('Sự cần thiết', 'suCanThiet', req), fld('NUMBER', 'Tổng giá trị (tỷ đồng)', 'tongGiaTri', req),
          TA('Ý kiến thẩm định', 'yKienThamDinh'), fld('RADIO', 'Kết luận', 'ketLuan', { required: true, options: ['Phê duyệt', 'Yêu cầu hoàn chỉnh'] })],
        created('01/07/2026 08:30:00')],
      ['CL-01', 'Checklist 01 — danh mục hồ sơ (≥ 160 tỷ)', 'Checklist', 'CL-01_Checklist-hoso-tu-160-ty.xlsx',
        [fld('CHECKLIST', 'Thành phần hồ sơ', 'thanhPhanHoSo', { required: true, options: ['Tờ trình BM-01', 'Kết quả RSTK', 'Báo giá', 'Thuyết minh / phụ lục'] }), TA('Ghi chú', 'ghiChu')],
        created('02/03/2026 10:00:00')],
      ['CL-02', 'Checklist 02 — danh mục hồ sơ (< 160 tỷ)', 'Checklist', 'CL-02_Checklist-hoso-duoi-160-ty.xlsx',
        [fld('CHECKLIST', 'Thành phần hồ sơ', 'thanhPhanHoSo', { required: true, options: ['Tờ trình BM-09', 'Kết quả RSTK', 'Báo giá'] }), TA('Ghi chú', 'ghiChu')],
        created('01/07/2026 08:35:00')],
      ['BM-01-V0', 'Tờ trình đề xuất mua sắm (mẫu 2025)', 'Tờ trình', 'BM-01_To-trinh-DXMS-2025.docx',
        [TA('Căn cứ', 'canCu', req), TA('Sự cần thiết', 'suCanThiet', req), fld('NUMBER', 'Tổng giá trị (tỷ đồng)', 'tongGiaTri', req)],
        created('10/01/2025 14:00:00', [{ version: 'v1.1', at: '02/03/2026 09:05:00', action: 'Dừng hoạt động biểu mẫu', desc: 'Thay bằng BM-01 theo quy chế mới.' }]), false],
    ];
    return rows.map(([code, name, type, file, fields, history, active], i) => ({
      id: i + 1, code, name, type, docType: 'Phê duyệt ĐXMS', file, description: '', fields,
      history: history.map((h) => Object.assign({ by: QT() }, h)).reverse(), active: active !== false,
    }));
  }

  let DATA = null;
  try { DATA = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { DATA = null; }
  const rows = () => (DATA = DATA || seed());
  function save() { try { localStorage.setItem(STORE, JSON.stringify(DATA)); } catch (e) { /* bỏ qua */ } }
  function reset() { DATA = seed(); save(); }
  const fieldCount = (r) => r.fields.length;
  const version = (r) => (r.history[0] || {}).version || 'v1.0';

  /* P-47 — biểu mẫu đang dùng: mã có trong cột biểu mẫu của bước quy trình BPMN (trang MS01 v1.1). Checklist 01/02 ↔ CL-01/02. */
  function usedIn(code) {
    const m = /^(BM|CL)-(\d+)$/.exec(code);
    if (!m) return [];
    const re = m[1] === 'BM' ? new RegExp(`\\bBM-${m[2]}(?!\\d)`) : new RegExp(`Checklist\\s*${m[2]}(?!\\d)`, 'i');
    return Object.entries(window.BPMN_TASKS || {}).filter(([, t]) => re.test(t.form || '')).map(([n]) => n);
  }

  /* B4 — biểu mẫu nhắc trong chữ của BPMN ("BM-04; Checklist 01 (≥160 tỷ)…"): mã BM-xx / Checklist xx ↔ biểu mẫu ĐXMS (CL-xx).
     P-44: mã trùng được ở Loại hồ sơ khác — bước của MS01.0x dùng biểu mẫu Phê duyệt ĐXMS. */
  const REF_RE = /\bBM-(\d{2})(?!\d)|\bChecklist\s*(\d{2})(?!\d)/g;
  const byCode = (code) => rows().find((r) => r.code === code && r.docType === 'Phê duyệt ĐXMS') || null;
  /* Chữ BPMN → HTML: mã có biểu mẫu thì thành link mở màn Thiết kế (data-ef-open). */
  function linkRefs(text) {
    const s = String(text || '');
    let out = '', last = 0, m;
    REF_RE.lastIndex = 0;
    while ((m = REF_RE.exec(s))) {
      const r = byCode(m[1] ? 'BM-' + m[1] : 'CL-' + m[2]);
      if (!r) continue;
      out += esc(s.slice(last, m.index)) + `<a class="link" href="#/eform/${r.id}/thiet-ke" data-ef-open="${r.id}" title="${esc(r.code + ' - ' + r.name)}">${esc(m[0])}</a>`;
      last = m.index + m[0].length;
    }
    return out + esc(s.slice(last));
  }
  /* Ô "Biểu mẫu sử dụng" (SCR-44): biểu mẫu đang hoạt động; giữ giá trị đang chọn nếu biểu mẫu đó đã dừng. */
  function activeOptions(cur) {
    const out = rows().filter((r) => r.active).map((r) => ({ value: r.code, label: `${r.code} - ${r.name}` }));
    if (cur && !out.some((o) => o.value === cur)) {
      const r = rows().find((x) => x.code === cur);
      out.push({ value: cur, label: r ? `${r.code} - ${r.name} (Dừng hoạt động)` : cur });
    }
    return out;
  }
  /* Mở màn Thiết kế từ màn khác (SCR-42): quay lại / Huỷ về màn đó; biểu mẫu Dừng hoạt động thì chỉ xem. */
  let FROM = null;
  function openFrom(id, back) { FROM = { id: String(id), back }; location.hash = `#/eform/${id}/thiet-ke`; }

  /* ---------- SCR-49 Danh sách biểu mẫu e-form ---------- */
  const S = { kw: '', st: null, page: 1, size: 20, psOpen: false };
  function filtered() {
    const k = norm(S.kw.trim());
    return rows().filter((r) => (!k || [r.code, r.name, r.type].some((v) => norm(v).includes(k)))
      && (!S.st || r.active === (S.st === 'ACTIVE')));
  }

  const noAccess = (title) => `<div class="pg ef">${title}<div class="vcard pad24"><p class="ov-empty">Bạn chưa được cấp quyền truy cập chức năng này</p></div></div>`;
  const INFO = {
    scr: 'SCR-49', name: 'Danh sách biểu mẫu e-form', uc: 'UC-12-01 · UR-DOC-01, UR-WF-03, BR-02, BR-04',
    notes: [
      'Vị trí theo D-4: mục E-Form & mẫu Word của menu Hồ sơ & biểu mẫu (PH12) — trong ecat là một mục của Danh mục dùng chung, có màn riêng (không dùng khuôn danh mục chung).',
      'Lọc Trạng thái áp ngay; ô tìm (mã, tên, loại) lọc ngay khi gõ. Phân trang mặc định 20, chọn 10 / 20 / 50 / 100 — như e-form.facade.',
      'Thao tác: Thiết kế (mở trang Thiết kế biểu mẫu) · Chỉnh sửa · Xem lịch sử · Xoá. Bấm Mã biểu mẫu mở Chỉnh sửa.',
      'Hộp thoại Thêm mới / Chỉnh sửa (SCR-50, e-form-dialog): Loại biểu mẫu, Loại hồ sơ theo danh mục ĐTMS (P-43); Mã tự bỏ dấu, viết hoa, khoá khi sửa; mã duy nhất theo cặp (Loại hồ sơ, Mã) — trùng báo lỗi dưới ô Mã (P-44). File mẫu .xlsx .xls .doc .docx ≤ 5MB, chỉ lưu tệp, chưa map biến (D-5, P-46). Tạo & thiết kế → mở màn Thiết kế của biểu mẫu mới.',
      'Khác source: lỗi bỏ trống ghi "Bạn cần chọn / nhập …" (source dùng chung câu "… không đúng định dạng."); Chỉnh sửa hiện File mẫu đã tải để xoá / thay.',
      'Xuất excel tải tệp CSV của danh sách đang lọc (cột STT, Mã, Tên, Loại, Số trường, Trạng thái) như source.',
      'Nhập biểu mẫu (Backlog "Import biểu mẫu Eform", T16 B1): ecat chưa có. Theo vht-import-dialog: chọn tệp schema Camunda Form (.form / .json, mỗi tệp một hoặc nhiều biểu mẫu) → bảng kiểm tra từng biểu mẫu (mã trùng theo cặp Loại hồ sơ + Mã thì lỗi, P-44) → Xác nhận nhập. Biểu mẫu nhập vào ở trạng thái Dừng hoạt động để Quản trị rà lại thiết kế trước khi kích hoạt. Cần dev: API nhập schema (BE kiểm tra JSON, mã trùng).',
      'Khác source: biểu mẫu đang gắn với bước quy trình BPMN không xoá được, chỉ Dừng hoạt động (P-47). Số trường tính từ thiết kế.',
      'Loại hồ sơ theo D-10 (Phê duyệt ĐXMS / Điều chỉnh ĐXMS); không có ô quy trình áp dụng — biểu mẫu dùng ở bước nào lấy từ BPMN (D-13).',
      'Không có nút Nhân bản (source có xử lý nhưng chưa có nút — P-49). Quyền: chỉ Quản trị hệ thống (P-48).',
      'Dữ liệu mẫu là biểu mẫu của luồng MS01; thay đổi được lưu trên trình duyệt, khôi phục ở nút công cụ demo.',
    ],
    q: ['P-47', 'P-48', 'P-43', 'P-44', 'P-46', 'P-45', 'P-49'], src: 'ecat common-catalog/catalogs/e-form/e-form-list · /common-catalog/e-form',
  };

  function list() {
    // Theo: fe/repo-khcn-ecat-fe/src/app/features/common-catalog/catalogs/e-form/e-form-list.component.html
    //       + e-form.facade.ts setupListColumns (Thao tác 150 → Trạng thái 120 → Mã 140 → Tên min 280 → Loại 160 → Số trường 100)
    const title = `<div class="pg-head"><div class="l"><h1 class="pg-title">Danh sách biểu mẫu e-form${infoBtn(INFO)}</h1></div>`;
    if (!(ROLES.includes(Flow.state.persona) || D.allAccess(Flow.state.persona))) return noAccess(title + '</div>');
    const all = filtered();
    const pages = Math.max(1, Math.ceil(all.length / S.size));
    if (S.page > pages) S.page = pages;
    const from = (S.page - 1) * S.size;
    const ic = (act, id, name, label, cls) => `<button type="button" class="cat-ic ${cls || ''}" data-ef-${act}="${id}" title="${label}" aria-label="${label}">${icon(name)}</button>`;
    const body = all.slice(from, from + S.size).map((r, i) => `<tr data-id="${r.id}" data-code="${esc(r.code)}">
      <td class="ord">${from + i + 1}</td>
      <td class="c"><div class="acts ef-acts">${ic('design', r.id, 'pen', 'Thiết kế')}${ic('edit', r.id, 'edit', 'Chỉnh sửa')}${ic('hist', r.id, 'clock', 'Xem lịch sử')}${ic('del', r.id, 'del', 'Xoá', 'del')}</div></td>
      <td class="c"><button type="button" class="vswitch ${r.active ? 'on' : ''}" role="switch" aria-checked="${r.active}" data-ef-tg="${r.id}"
        title="${r.active ? 'Dừng hoạt động' : 'Kích hoạt'}" aria-label="${r.active ? 'Dừng hoạt động' : 'Kích hoạt'}"><span></span></button></td>
      <td><a class="link ef-code" href="#" data-ef-edit="${r.id}" title="${esc(r.code)}">${esc(r.code)}</a></td>
      <td><span class="clamp" title="${esc(r.name)}">${esc(r.name)}</span></td>
      <td>${esc(r.type)}</td>
      <td class="c">${fieldCount(r)}</td></tr>`).join('');
    return `<div class="pg ef">
      ${title}<div class="r"><button class="vbtn secondary" data-ef-import>${icon('upload')} Nhập biểu mẫu</button><button class="vbtn secondary" data-ef-export>${icon('excel')} Xuất excel</button><button class="vbtn primary" data-ef-new>${icon('add')} Thêm mới</button></div></div>
      <div class="vcard">
        <div class="cat-filter ef-filter">
          <div class="ef-st">${vSelect({ id: 'ef-st', options: STATUS, value: S.st, placeholder: 'Trạng thái', clear: true, onChange: (v) => { S.st = v; S.page = 1; rerender(); } })}</div>
          <label class="vsearch h36 ef-kw">${icon('search')}<input id="ef-kw" maxlength="255" placeholder="Tìm kiếm theo mã biểu mẫu, tên..." value="${esc(S.kw)}"></label>
        </div>
        <div class="vtable-vp"><table class="vtable cat ef-table"><thead><tr><th class="ord">STT</th>
          <th class="c" style="width:150px;min-width:150px;max-width:150px">Thao tác</th><th class="c" style="width:120px;min-width:120px;max-width:120px">Trạng thái</th>
          <th style="width:140px;min-width:140px">Mã biểu mẫu</th><th style="min-width:280px">Tên biểu mẫu</th><th style="width:160px;min-width:160px">Loại</th>
          <th class="c" style="width:100px;min-width:100px">Số trường</th></tr></thead>
          <tbody>${body || '<tr><td class="vtable-empty" colspan="7"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>'}</tbody></table></div>
        ${pager({ id: 'eform', total: all.length, page: S.page, size: S.size, open: S.psOpen, sizes: [10, 20, 50, 100] })}
      </div></div>`;
  }

  /* ---------- Nhập biểu mẫu từ tệp schema (vht-import-dialog 2 bước, như Nhập nhà cung cấp của DMDC) ----------
     Tệp mẫu chứa 3 biểu mẫu: BM-10, BM-11 mới; BM-04 trùng mã với biểu mẫu đang có → lỗi. */
  const IMPORT_FILE = { name: 'bieu-mau-dtms-bo-sung.form', size: '24,6 KB' };
  const importForms = () => {
    fid = 1000;
    return [
      ['BM-10', 'Phiếu đề nghị gửi yêu cầu báo giá', 'Phiếu', [TA('Danh mục hàng hoá, dịch vụ', 'danhMucHangHoa', req), fld('TAGLIST', 'Nhà cung cấp nhận yêu cầu', 'nhaCungCap', req),
        fld('DATETIME', 'Hạn gửi báo giá', 'hanBaoGia', { required: true, dateFormat: 'DD/MM/YYYY' }), TA('Ghi chú', 'ghiChu')]],
      ['BM-11', 'Biên bản so sánh báo giá', 'Báo cáo', [TA('Bảng so sánh', 'bangSoSanh', req), TA('Đề xuất cơ sở giá', 'deXuatCoSoGia', req), KET_LUAN()]],
      ['BM-04', 'Phiếu nhận xét', 'Phiếu', D.bm04Sections.map((x) => TA(x, camel(x), req))],
    ].map(([code, name, type, fields]) => ({ code, name, type, fields, err: byCode(code) ? `Mã biểu mẫu ${code} đã tồn tại.` : '' }));
  };
  function importDlg() {
    let file = null;
    const pick = () => {
      const m = vModal({ title: 'Nhập biểu mẫu', size: 'w780', body: `<div class="imp">
          <div class="imp-banner"><span class="imp-bl">${icon('file')}Tệp schema biểu mẫu (Camunda Form)</span>
            <button type="button" class="imp-tpl" data-imp-tpl>${icon('download')}Tải tệp mẫu</button></div>
          <button type="button" class="imp-zone" data-imp-zone><span class="imp-glyph">${icon('upload')}</span>
            <span class="imp-hint">${file ? esc(file.name) : 'Kéo thả file vào đây hoặc bấm để chọn'}</span>
            <span class="imp-sub">${file ? esc(file.size) : 'Hỗ trợ định dạng .form, .json (tối đa 5MB)'}</span></button></div>`,
        actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-go" ${file ? '' : 'disabled'}>Nhập dữ liệu</button>` });
      m.el.querySelector('[data-imp-tpl]').onclick = () => toast('<b>Thành công</b><br>Đã tải file mau-bieu-mau.form');
      m.el.querySelector('[data-imp-zone]').onclick = () => { file = IMPORT_FILE; m.close(); pick(); };
      m.el.querySelector('#imp-go').onclick = () => { m.close(); result(); };
    };
    const result = () => {
      const res = importForms(), ok = res.filter((r) => !r.err);
      const body = res.map((r, i) => `<tr><td class="ord">${i + 1}</td><td class="c">${r.err ? badge('Lỗi', 'error') : badge('Hợp lệ', 'success')}</td>
          <td>${r.err ? `<span class="imp-err">${esc(r.err)}</span>` : '<span class="dash">-</span>'}</td><td>${esc(r.code)}</td><td>${esc(r.name)}</td><td>${esc(r.type)}</td><td class="c">${r.fields.length}</td></tr>`).join('');
      const m = vModal({ title: 'Kết quả nhập dữ liệu', size: 'xl', body: `<div class="imp-res">
          <div class="imp-top"><span class="imp-sum">${ok.length}/${res.length} biểu mẫu hợp lệ</span><button type="button" class="vbtn primary" data-imp-again>${icon('upload')} Nhập file mới</button></div>
          <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th><th class="c" style="min-width:110px">Kết quả</th><th style="min-width:220px">Nội dung lỗi</th>
            <th style="min-width:120px">Mã biểu mẫu</th><th style="min-width:260px">Tên biểu mẫu</th><th style="min-width:120px">Loại</th><th class="c" style="min-width:100px">Số trường</th></tr></thead>
            <tbody>${body}</tbody></table></div></div>`,
        actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-ok" ${ok.length ? '' : 'disabled'}>Xác nhận nhập</button>` });
      m.el.querySelector('[data-imp-again]').onclick = () => { file = null; m.close(); pick(); };
      m.el.querySelector('#imp-ok').onclick = () => {
        const list = rows(), now = Flow.dateOf(Flow.state.clock) + ' 09:00:00';
        ok.forEach((r) => list.unshift({ id: Math.max(0, ...list.map((x) => x.id)) + 1, code: r.code, name: r.name, type: r.type, docType: 'Phê duyệt ĐXMS', file: '',
          description: '', fields: r.fields, active: false,
          history: [{ version: 'v1.0', at: now, by: QT(), action: 'Nhập biểu mẫu', desc: `Nhập từ tệp ${IMPORT_FILE.name}.` }] }));
        save(); m.close(); S.page = 1;
        toast(`<b>Thành công</b><br>Nhập biểu mẫu thành công (${ok.length} biểu mẫu)`);
        rerender();
      };
    };
    pick();
  }

  /* ---------- SCR-53 Lịch sử cập nhật biểu mẫu (e-form-history-dialog, vht-modal 580) ---------- */
  function historyDlg(r) {
    // Theo: fe/repo-khcn-ecat-fe/src/app/features/common-catalog/catalogs/e-form/components/e-form-history-dialog/e-form-history-dialog.component.html
    const items = r.history.map((h) => `<div class="ef-tl-i"><span class="ef-tl-dot"></span>
        <div class="ef-tl-h"><span class="a">${esc(h.action)} (${esc(h.version)})</span><span class="t">${esc(h.at)}</span></div>
        <div class="ef-tl-by">Người thực hiện: <b>${esc(h.by)}</b></div>
        ${h.desc ? `<div class="ef-tl-d">${esc(h.desc)}</div>` : ''}</div>`).join('');
    vModal({ title: `Lịch sử cập nhật biểu mẫu - ${r.code}`, size: 'w580', body: `<div class="ef-hist">
        <div class="ef-hist-box"><div><span class="k">Tên biểu mẫu:</span><b>${esc(r.name)}</b></div><div><span class="k">Loại:</span><span>${esc(r.type)}</span></div></div>
        <div class="ef-tl">${items}</div></div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button>' });
  }

  /* ---------- Hành động (e-form.facade) ---------- */
  const subject = (r) => `${r.name} - ${r.code}`;
  async function del(r) {
    const hl = subject(r);
    const ok = await window.Catalog.confirm({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa ${ENTITY}: ${hl} không?`, hl, cancel: 'Hủy', ok: 'Xoá' });
    if (!ok) return;
    const used = usedIn(r.code);
    if (used.length) {
      // P-47: biểu mẫu đang gắn bước quy trình không xoá được.
      toast(`<b>Lỗi</b><br>Biểu mẫu ${esc(hl)} đang được sử dụng trong ${used.length} bước quy trình, không thể xoá. Bạn có thể dừng hoạt động.`, 'warn');
      return;
    }
    DATA.splice(DATA.indexOf(r), 1);
    save();
    toast(`<b>Thành công</b><br>Xoá ${ENTITY} thành công`);
    rerender();
  }

  async function toggle(r) {
    const off = r.active, hl = subject(r);
    const ok = await window.Catalog.confirm(off
      ? { sev: 'warning', title: 'Dừng hoạt động', desc: `Bạn có chắc chắn muốn dừng hoạt động ${ENTITY}: ${hl} không?`, hl, cancel: 'Không', ok: 'Có' }
      : { sev: 'info', title: 'Kích hoạt', desc: `Bạn có chắc chắn muốn kích hoạt ${ENTITY}: ${hl} không?`, hl, cancel: 'Không', ok: 'Có' });
    if (!ok) return;
    r.active = !off;
    save();
    toast(`<b>Thành công</b><br>${off ? 'Dừng hoạt động' : 'Kích hoạt'} ${ENTITY} thành công`);
    rerender();
  }

  /* handleExportExcel: CSV có BOM, danh sách đang lọc. */
  function exportCsv() {
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const text = '﻿' + 'STT,Mã biểu mẫu,Tên biểu mẫu,Loại,Số trường,Trạng thái\n'
      + filtered().map((r, i) => `${i + 1},${q(r.code)},${q(r.name)},${q(r.type)},${fieldCount(r)},${q(r.active ? 'Hoạt động' : 'Không hoạt động')}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8;' }));
    a.download = `Danh_sach_bieu_mau_eform_${Date.now()}.csv`;
    a.click();
    toast('<b>Thành công</b><br>Xuất file thành công');
  }

  /* ---------- SCR-50 Hộp thoại Thêm mới / Chỉnh sửa (e-form-dialog, vht-modal 560) ---------- */
  const opts = (xs) => xs.map((x) => ({ value: x, label: x }));
  /* E_FORM_TYPE_OPTIONS / E_FORM_DOC_TYPE_OPTIONS thay bằng danh mục ĐTMS (§3.1, P-43; Loại hồ sơ theo D-10). */
  const FORM_TYPES = opts(['Tờ trình', 'Thuyết minh', 'Phiếu', 'Báo cáo', 'Công văn', 'Quyết định', 'Checklist']);
  const DOC_TYPES = opts(['Phê duyệt ĐXMS', 'Điều chỉnh ĐXMS']);
  const LABELS = { formType: 'Loại biểu mẫu', docType: 'Loại hồ sơ', code: 'Mã biểu mẫu', name: 'Tên biểu mẫu', description: 'Mô tả' };
  const SELECTS = ['formType', 'docType'];
  const CODE_RE = /^[A-Z0-9_-]+$/;
  const EXTS = ['.xlsx', '.xls', '.doc', '.docx'];
  const MAX_FILE = 5 * 1024 * 1024;
  /* Mã: bỏ dấu, bỏ khoảng trắng, viết hoa (như ô mã của DMDC). */
  const codeFilter = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\s+/g, '').toUpperCase();
  const now = () => {
    const d = new Date(), p = (n) => String(n).padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  };
  const designHref = (r) => `#/eform/${r.id}/thiet-ke`;

  function openForm(row) {
    // Theo: fe/repo-khcn-ecat-fe/src/app/features/common-catalog/catalogs/e-form/components/e-form-dialog/e-form-dialog.component.html (+ .ts)
    const v = { formType: row ? row.type : null, docType: row ? row.docType : null, code: row ? row.code : '', name: row ? row.name : '',
      description: row ? row.description || '' : '', file: row ? row.file || null : null };
    let dirty = false, dragging = false, fileErr = '';
    const touched = new Set();
    const selHtml = (k, invalid) => vSelect({ id: 'eff-' + k, options: k === 'formType' ? FORM_TYPES : DOC_TYPES, value: v[k], placeholder: 'Chọn ' + LABELS[k].toLowerCase(), invalid,
      onChange: (x) => { v[k] = x; dirty = true; touched.add(k); check(k); } });
    const field = (k, ctl, req) => `<div class="vfield" data-eff="${k}"><div class="lr"><label>${LABELS[k]}</label>${req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}<p class="msg" role="alert" hidden></p></div>`;
    const zone = () => (v.file
      ? `<div class="ef-file"><span class="ic">${icon('file')}</span><span class="nm" title="${esc(v.file)}">${esc(v.file)}</span>
          <button type="button" class="ef-file-x" data-ef-file-rm aria-label="Xóa file">${icon('x')}</button></div>`
      : `<span class="ef-up-ic">${icon('upload')}</span><p class="t"><span>Tải lên</span> hoặc kéo tài liệu</p>
          <p class="h">Hệ thống cho phép tải lên tập tin dạng .xlsx, .xls, .doc, .docx dung lượng tập tin không vượt quá 5MB.</p>`);
    const m = vModal({
      title: row ? 'Chỉnh sửa biểu mẫu e-form' : 'Thêm mới biểu mẫu', size: 'w560',
      body: `<form class="cat-form ef-form" novalidate>
          ${field('formType', `<div data-effs="formType">${selHtml('formType')}</div>`, true)}
          ${field('docType', `<div data-effs="docType">${selHtml('docType')}</div>`, true)}
          ${field('code', `<input class="vctl" data-effi="code" maxlength="50" value="${esc(v.code)}" ${row ? 'disabled' : ''}>`, true)}
          ${field('name', `<input class="vctl" data-effi="name" maxlength="255" value="${esc(v.name)}">`, true)}
          ${field('description', `<textarea class="vctl ta" data-effi="description" maxlength="500" rows="3">${esc(v.description)}</textarea>`)}
          <div class="vfield"><div class="lr"><label>File mẫu</label></div>
            <div class="ef-drop" data-ef-drop role="button" tabindex="0" aria-label="Tải lên hoặc kéo tài liệu">${zone()}</div>
            <input type="file" class="ef-file-in" data-ef-file accept="${EXTS.join(',')}" tabindex="-1" aria-hidden="true">
            <p class="ef-file-err" role="alert" hidden></p></div></form>`,
      actions: `<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" id="ef-save">${row ? 'Lưu' : 'Tạo &amp; thiết kế'}</button>`,
    });
    const q = (s) => m.el.querySelector(s);
    const wrap = (k) => q(`[data-eff="${k}"]`);
    const show = (k, err) => {
      const w = wrap(k);
      w.classList.toggle('invalid', !!err);
      if (SELECTS.includes(k)) q(`[data-effs="${k}"]`).innerHTML = selHtml(k, !!err);
      else q(`[data-effi="${k}"]`).setAttribute('aria-invalid', err ? 'true' : 'false');
      const msg = w.querySelector('.msg'); msg.hidden = !err; msg.textContent = err || '';
    };
    const errOf = (k) => {
      const x = String(v[k] || '').trim();
      if (SELECTS.includes(k)) return x ? '' : `Bạn cần chọn ${LABELS[k]}.`;
      if ((k === 'code' || k === 'name') && !x) return `Bạn cần nhập ${LABELS[k]}.`;
      if (k === 'code' && !CODE_RE.test(x)) return `${LABELS.code} không đúng định dạng.`;
      return '';
    };
    const check = (k) => { const err = touched.has(k) ? errOf(k) : ''; show(k, err); return !err; };

    ['code', 'name', 'description'].forEach((k) => {
      const inp = q(`[data-effi="${k}"]`);
      inp.addEventListener('input', () => {
        if (k === 'code') { const p = inp.selectionStart, before = inp.value.length; inp.value = codeFilter(inp.value); const at = Math.max(0, p - (before - inp.value.length)); inp.setSelectionRange(at, at); }
        v[k] = inp.value; dirty = true;
        if (wrap(k).classList.contains('invalid')) check(k);
      });
      inp.addEventListener('blur', () => { touched.add(k); check(k); });
    });

    /* File mẫu: bấm vùng để chọn tệp hoặc kéo-thả; sai đuôi / quá 5MB → lỗi dưới vùng tải (processFile). */
    const drop = q('[data-ef-drop]'), fin = q('[data-ef-file]'), ferr = q('.ef-file-err');
    const paint = () => {
      drop.innerHTML = zone();
      drop.classList.toggle('drag', dragging);
      drop.classList.toggle('has', !!v.file);
      ferr.hidden = !fileErr; ferr.textContent = fileErr;
    };
    const take = (f) => {
      fileErr = '';
      const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
      if (!EXTS.includes(ext) || f.name.indexOf('.') < 0) fileErr = 'Tập tin không đúng định dạng (.xlsx, .xls, .doc, .docx)';
      else if (f.size > MAX_FILE) fileErr = 'Dung lượng tập tin vượt quá 5MB';
      else { v.file = f.name; dirty = true; }
      paint();
    };
    drop.addEventListener('click', (e) => {
      if (e.target.closest('[data-ef-file-rm]')) { v.file = null; fileErr = ''; dirty = true; paint(); return; }
      if (!e.target.closest('.ef-file')) fin.click();
    });
    drop.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !v.file) { e.preventDefault(); fin.click(); } });
    fin.addEventListener('change', () => { if (fin.files.length) take(fin.files[0]); fin.value = ''; });
    drop.addEventListener('dragover', (e) => { e.preventDefault(); if (!dragging) { dragging = true; paint(); } });
    drop.addEventListener('dragleave', (e) => { e.preventDefault(); if (!drop.contains(e.relatedTarget)) { dragging = false; paint(); } });
    drop.addEventListener('drop', (e) => {
      e.preventDefault(); dragging = false;
      const f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) take(f); else paint();
    });
    paint();

    /* handleClose: chưa sửa gì thì đóng luôn; có thay đổi thì hỏi xác nhận (X, Hủy, bấm nền, Esc). */
    async function tryClose() {
      if (!dirty) { m.close(); return; }
      const ok = await window.Catalog.confirm({ sev: 'warning', title: 'Bạn có chắc muốn đóng popup này?', desc: 'Các thay đổi bạn vừa thực hiện sẽ không được lưu lại.',
        hl: '', cancel: 'Tiếp tục chỉnh sửa', ok: 'Đóng' });
      if (ok) m.close();
    }
    m.el.addEventListener('click', (e) => {
      if (e.target === m.el || e.target.closest('[data-close]')) { e.stopImmediatePropagation(); tryClose(); }
    }, true);
    const onEsc = (e) => {
      if (e.key !== 'Escape') return;
      if (!m.el.isConnected) { window.removeEventListener('keydown', onEsc, true); return; }
      e.stopPropagation();
      const top = Array.from(document.querySelectorAll('.overlay')).pop();
      if (top === m.el) tryClose(); else top.remove();
    };
    window.addEventListener('keydown', onEsc, true);

    q('form').addEventListener('submit', (e) => e.preventDefault());
    q('#ef-save').addEventListener('mousedown', (e) => e.preventDefault());
    q('#ef-save').onclick = () => {
      Object.keys(LABELS).forEach((k) => touched.add(k));
      if (!Object.keys(LABELS).map(check).every(Boolean)) return;
      const code = v.code.trim();
      // P-44: mã duy nhất theo cặp (Loại hồ sơ, Mã) — backend trả lỗi, hiện dưới ô Mã.
      if (rows().some((r) => r !== row && r.code === code && r.docType === v.docType)) { show('code', `${LABELS.code} ${code} đã tồn tại.`); return; }
      const val = { type: v.formType, docType: v.docType, name: v.name.trim(), description: v.description.trim(), file: v.file };
      if (row) {
        Object.assign(row, val);
        save(); m.close();
        toast(`<b>Thành công</b><br>Cập nhật ${ENTITY} thành công`);
        rerender();
        return;
      }
      const r = Object.assign({ id: Math.max(0, ...rows().map((x) => x.id)) + 1, code, fields: [], active: true,
        history: [{ version: 'v1.0', at: now(), action: 'Tạo mới biểu mẫu', desc: 'Khởi tạo biểu mẫu e-form trong hệ thống.', by: QT() }] }, val);
      DATA.unshift(r);
      save(); m.close();
      S.page = 1;
      toast(`<b>Thành công</b><br>Thêm mới ${ENTITY} thành công`);
      location.hash = designHref(r);
    };
  }

  /* ---------- SCR-51 Thiết kế biểu mẫu (e-form-designer, trang riêng #/eform/<id>/thiet-ke) + SCR-52 Xem trước ---------- */
  /* DEFAULT_INPUT_COMPONENTS / DEFAULT_CHOICE_COMPONENTS */
  const DOCK = [
    { key: 'input', label: 'Nhập liệu', items: [['text', 'Ô chữ', 'TEXT'], ['textarea', 'Ô nhiều dòng', 'TEXTAREA'], ['number', 'Số', 'NUMBER'],
      ['datetime', 'Ngày / giờ', 'DATETIME'], ['formula', 'Biểu thức (tự tính)', 'FORMULA'], ['file', 'Tải tệp', 'FILE']] },
    { key: 'choice', label: 'Lựa chọn', items: [['checkbox', 'Hộp kiểm', 'CHECKBOX'], ['checklist', 'Danh sách kiểm', 'CHECKLIST'], ['radio', 'Chọn một (radio)', 'RADIO'],
      ['dropdown', 'Danh sách thả xuống', 'DROPDOWN'], ['taglist', 'Nhận nhiều chọn', 'TAGLIST']] },
  ].map((g) => Object.assign(g, { items: g.items.map(([id, label, type]) => ({ id, label, type })) }));
  const DOCK_ITEMS = DOCK.flatMap((g) => g.items);
  const kindOf = (type) => DOCK_ITEMS.find((x) => x.type === type) || DOCK_ITEMS[0];
  /* E_FORM_DATE_FORMAT_OPTIONS */
  const DATE_FMT = [{ value: 'DD/MM/YYYY', label: 'Ngày (dd/mm/yyyy)' }, { value: 'DD/MM/YYYY HH:mm', label: 'Ngày và giờ (dd/mm/yyyy HH:mm)' },
    { value: 'MM/YYYY', label: 'Tháng và năm (mm/yyyy)' }, { value: 'YYYY', label: 'Năm (yyyy)' }];
  const ORG = 'Tổng Công ty Công nghiệp Công nghệ cao Viettel (TCT VHT)';

  /* Icon của designer (E_FORM_FIELD_ICON_CLASS: vht-text-font, vht-text-align-justify-center, vht-grid, vht-calendar-03, vht-not-equal-sign-square,
     vht-attachment-01, vht-checkmark-square-02, vht-check-list, vht-checkmark-circle-02, vht-arrow-down-01, vht-layers-02; vht-arrow-turn-*-sharp, vht-info-square-rounded). */
  const sv = (d, w) => `<svg width="${w || 20}" height="${w || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const SQ = '<rect x="3" y="3" width="18" height="18" rx="4"/>';
  const FIC = {
    text: sv('<path d="M5 7V5h14v2M12 5v14M9 19h6"/>'),
    textarea: sv('<path d="M4 6h16M4 10h16M4 14h16M7 18h10"/>'),
    number: sv(SQ + '<path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
    datetime: sv('<rect x="3" y="4" width="18" height="17" rx="4"/><path d="M3 9h18M8 2v4M16 2v4"/>'),
    formula: sv(SQ + '<path d="M8 10h8M8 14h8M14 7l-4 10"/>'),
    file: sv('<path d="M20 11.5 12.5 19a5 5 0 0 1-7-7L13 4.5a3.3 3.3 0 0 1 4.7 4.7l-7.4 7.4a1.7 1.7 0 0 1-2.4-2.4L15 7.1"/>'),
    checkbox: sv(SQ + '<path d="m8 12.5 2.5 2.5L16 9.5"/>'),
    checklist: sv('<path d="M11 6h9M11 12h9M11 18h9M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>'),
    radio: sv('<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>'),
    dropdown: sv('<path d="m6 9 6 6 6-6"/>'),
    taglist: sv('<path d="M12 3 2 8l10 5 10-5-10-5ZM2 12.5l10 5 10-5M2 17l10 5 10-5"/>'),
    undo: sv('<path d="M4 9h11a5 5 0 0 1 0 10H9M8 5 4 9l4 4"/>'),
    redo: sv('<path d="M20 9H9a5 5 0 0 0 0 10h6M16 5l4 4-4 4"/>'),
    infoSq: sv('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 16.5v-5"/><circle cx="12" cy="8" r=".6" fill="currentColor"/>'),
    cal: sv('<rect x="3" y="4" width="18" height="17" rx="4"/><path d="M3 9h18M8 2v4M16 2v4"/>', 18),
  };

  /* Trạng thái màn thiết kế (bản nháp canvas): tạo khi vào route, bỏ khi rời route. */
  let DS = null, seq = 0;
  const clone = (x) => JSON.parse(JSON.stringify(x));
  function dsFor(r) {
    if (!DS || DS.id !== r.id) {
      const fields = clone(r.fields);
      const from = FROM && FROM.id === String(r.id) ? FROM : null;
      DS = { id: r.id, fields, base: JSON.stringify(fields), sel: fields.length ? fields[0].id : null, undo: [], redo: [], editKey: null,
        meta: true, open: { input: true, choice: true }, kw: '', back: from ? from.back : 'eform', ro: !!from && !r.active };
    }
    return DS;
  }
  const dirty = () => !!DS && JSON.stringify(DS.fields) !== DS.base;
  const selField = () => (DS && DS.fields.find((f) => f.id === DS.sel)) || null;
  const onDesign = () => /^#\/eform\/[^/]+\/thiet-ke$/.test(location.hash);
  window.addEventListener('hashchange', () => { if (!onDesign()) { DS = null; FROM = null; } });

  /* Hoàn tác / Làm lại: source có nút nhưng chưa gắn xử lý — làm thật bằng ngăn xếp ảnh chụp canvas (rule A7). */
  const shot = () => JSON.stringify({ fields: DS.fields, sel: DS.sel });
  function snap() { DS.undo.push(shot()); if (DS.undo.length > 100) DS.undo.shift(); DS.redo = []; DS.editKey = null; }
  function travel(from, to) {
    if (!from.length) return;
    to.push(shot());
    const s = JSON.parse(from.pop());
    DS.fields = s.fields; DS.sel = s.sel; DS.editKey = null;
    rerender();
  }

  /* Ô xem trước của trường trên canvas (disabled, như @switch (field.type) trong template). */
  const optsOf = (f) => (f.options && f.options.length ? f.options : ['Lựa chọn 1', 'Lựa chọn 2']);
  const ph = (f, dflt) => esc(f.placeholder || dflt);
  function canvasCtl(f) {
    switch (f.type) {
      case 'TEXTAREA': return `<textarea class="vctl ta" disabled placeholder="${ph(f, 'Gợi ý nhập liệu...')}"></textarea>`;
      case 'CHECKBOX': return '<span class="efd-cb"><span class="bx"></span>Đồng ý / Chấp nhận</span>';
      case 'CHECKLIST': return `<div class="efd-opts">${optsOf(f).map((o) => `<span class="efd-cb"><span class="bx"></span>${esc(o)}</span>`).join('')}</div>`;
      case 'RADIO': return `<div class="efd-opts row">${optsOf(f).map((o, i) => `<span class="vradio-opt ${i ? '' : 'on'}"><span class="rb"></span><span>${esc(o)}</span></span>`).join('')}</div>`;
      case 'DROPDOWN': case 'TAGLIST':
        return `<div class="vsel dis"><span class="vsel-label ph">${ph(f, '-- Chọn giá trị --')}</span><span class="vsel-chev">${icon('chev')}</span></div>`;
      case 'DATETIME': return `<div class="efd-ic-in"><input class="vctl" disabled value="${esc(f.defaultValue || '')}" placeholder="${esc(f.placeholder || f.dateFormat || 'dd/mm/yyyy')}">${FIC.cal}</div>`;
      case 'FORMULA': return `<div class="efd-ic-in"><input class="vctl mono" disabled value="${esc(f.formula || '')}" placeholder="= field1+ field2">${FIC.formula}</div>`;
      case 'FILE': return `<div class="efd-filebox"><span>Chọn tệp đính kèm...</span><span class="pill">${FIC.file}Tải tệp</span></div>`;
      default: return `<input class="vctl" disabled placeholder="${esc(f.placeholder || 'Nhập ' + f.label)}">`;
    }
  }
  const canvas = () => DS.fields.map((f) => `<div class="efd-f ${DS.sel === f.id ? 'on' : ''}" draggable="${!DS.ro}" data-efd-field="${esc(f.id)}">
      <div class="efd-f-h"><div><div class="lb">${esc(f.label)}${f.required ? '<span class="req">*</span>' : ''}</div>${f.description ? `<p>${esc(f.description)}</p>` : ''}</div>
        ${DS.ro ? '' : `<button type="button" class="efd-rm" data-efd-rm="${esc(f.id)}" aria-label="Xoá trường này" title="Xoá trường này">${icon('del')}</button>`}</div>
      ${canvasCtl(f)}</div>`).join('')
    + (DS.ro ? '' : `<div class="efd-drop-end">${icon('add')}<span>Kéo thành phần vào đây</span></div>`);

  /* Dock trái "Thành phần": tìm (lọc theo nhãn), hai nhóm thu gọn được. */
  const cats = () => DOCK.map((g) => {
    const kw = DS.kw.trim().toLowerCase();
    const items = g.items.filter((it) => !kw || it.label.toLowerCase().includes(kw));
    const open = DS.open[g.key];
    return `<div class="efd-cat"><button type="button" class="efd-cat-h ${open ? 'open' : ''}" data-efd-cat="${g.key}" aria-expanded="${open}"><span>${g.label}</span>${icon('chev')}</button>
      ${open ? `<div class="efd-cat-l">${items.map((it) => `<div class="efd-dock-i ${DS.ro ? 'dis' : ''}" draggable="${!DS.ro}" ${DS.ro ? 'aria-disabled="true"' : ''} data-efd-new="${it.id}"><span class="ic">${FIC[it.id]}</span><span>${esc(it.label)}</span></div>`).join('')}</div>` : ''}</div>`;
  }).join('');

  /* Dock phải "Thuộc tính trường" — nhóm hiện theo loại trường như template. */
  const idRow = (f) => `<span class="efd-badge">${esc(f.label)}</span><span class="efd-key">id: ${esc(f.key || f.id)}</span>`;
  function right() {
    const f = selField();
    if (!f) {
      return `<div class="efd-right empty">${FIC.infoSq}<span class="t">Chưa chọn trường nào</span><span class="s">Bấm chọn một trường trên biểu mẫu để chỉnh sửa thuộc tính</span></div>`;
    }
    const noPh = ['DATETIME', 'FORMULA', 'FILE'].includes(f.type);
    const dis = DS.ro ? 'disabled' : '';
    const inp = (p, label, phd, cls) => `<div class="efd-p"><label for="efd-p-${p}">${label}</label><input class="vctl ${cls || ''}" id="efd-p-${p}" data-efd-p="${p}" value="${esc(f[p] == null ? '' : f[p])}" placeholder="${esc(phd)}" ${dis}></div>`;
    const ta = (p, label, phd, rows, cls) => `<div class="efd-p">${label ? `<label for="efd-p-${p}">${label}</label>` : ''}<textarea class="vctl ta ${cls || ''}" id="efd-p-${p}" data-efd-p="${p}" rows="${rows}" placeholder="${esc(phd)}" ${dis}>${esc(f[p] || '')}</textarea></div>`;
    const sw = (p, label) => `<div class="efd-sw"><button type="button" class="vswitch ${f[p] ? 'on' : ''} ${DS.ro ? 'ro' : ''}" role="switch" aria-checked="${!!f[p]}" id="efd-sw-${p}" ${DS.ro ? 'disabled' : `data-efd-sw="${p}"`}><span></span></button><label for="efd-sw-${p}">${label}</label></div>`;
    const sec = (title, body, sub) => `<div class="efd-sec-p"><h4>${title}</h4>${sub || ''}<div class="efd-sec-b">${body}</div></div>`;
    return `<div class="efd-right"><div>
        <div class="efd-right-h"><h3>Thuộc tính trường</h3><button type="button" class="efd-x" data-efd-close aria-label="Đóng thuộc tính">${icon('x')}</button></div>
        <div class="efd-id" id="efd-id">${idRow(f)}</div>
        ${sec('Chung', inp('key', 'Khóa dữ liệu (key)', 'Decision', 'mono') + inp('label', 'Nhãn hiển thị', 'Tên trường...')
          + ta('description', 'Mô tả', 'Ghi chú cho trường...', 2) + (noPh ? '' : inp('placeholder', 'Placeholder', 'Gợi ý nhập liệu...')))}
        ${f.type === 'DATETIME' ? sec('Cài đặt ngày giờ', `<div class="efd-p"><label for="efd-p-defaultValue">Ngày mặc định</label><div class="efd-ic-in"><input class="vctl" id="efd-p-defaultValue" data-efd-p="defaultValue" value="${esc(f.defaultValue || '')}" placeholder="${esc(f.dateFormat || 'DD/MM/YYYY')}">${FIC.cal}</div></div>
          <div class="efd-p"><label>Định dạng hiển thị</label>${vSelect({ id: 'efd-fmt', options: DATE_FMT, value: f.dateFormat || 'DD/MM/YYYY', disabled: DS.ro, onChange: (v) => { edit('dateFormat', v, true); rerender(); } })}</div>`) : ''}
        ${f.type === 'FORMULA' ? sec('Biểu thức', inp('formula', 'Công thức', '= field1+ field2', 'mono')) : ''}
        ${f.type === 'FILE' ? sec('Cài đặt', sw('multiple', 'Nhiều tệp')) : ''}
        ${sec('Kiểm tra hợp lệ', sw('required', 'Bắt buộc nhập') + (noPh ? '' : inp('minLength', 'Độ dài tối thiểu', '0') + inp('maxLength', 'Độ dài tối đa', '255')))}
        ${sec('Ẩn/hiện có điều kiện (feel)', ta('conditionFeel', '', '', 3, 'mono'), '<p class="efd-hint">VaiTro = "chu_nhiem"</p>')}
      </div>
      ${DS.ro ? '' : `<div class="efd-right-f"><button type="button" class="vbtn secondary efd-del" data-efd-del>${icon('del')}<span>Xoá thành phần</span></button></div>`}</div>`;
  }

  const DINFO = {
    scr: 'SCR-51', name: 'Thiết kế biểu mẫu (và SCR-52 Xem trước)', uc: 'UC-12-01 · UR-DOC-01, UR-WF-03, BR-02, BR-04',
    notes: [
      'Trang riêng, mở từ icon Thiết kế ở danh sách hoặc Tạo & thiết kế của hộp thoại Thêm mới. Card Thông tin biểu mẫu thu gọn được.',
      'Kéo thành phần từ dock trái vào tờ giấy (thả ở vạch đỏ); kéo trường trên tờ giấy để đổi thứ tự. Bấm trường để sửa thuộc tính ở dock phải; nhóm thuộc tính theo loại trường như source.',
      'Hoàn tác / Làm lại: source có nút nhưng chưa gắn xử lý — prototype làm thật.',
      'Lưu thiết kế: nếu có thay đổi thì tăng phiên bản (v1.0 → v1.1), thêm dòng "Cập nhật cấu hình biểu mẫu" vào lịch sử, Số trường ở danh sách tính lại. Hồ sơ đã tạo giữ phiên bản cũ (P-45).',
      'Quay lại / Huỷ khi còn thay đổi chưa lưu → hỏi xác nhận như source.',
      'Khác source: trường Chọn một / Danh sách kiểm hiện đúng các lựa chọn đã khai báo (source vẽ cố định "Lựa chọn 1 / 2"). Dock phải chưa có ô khai báo danh sách lựa chọn (source không có) — P-49.',
      'Biểu thức và điều kiện FEEL nhập tự do, không kiểm tra cú pháp (P-49). Khóa dữ liệu không kiểm tra trùng (như source).',
      'Xem trước (SCR-52, vht-modal "Xem trước biểu mẫu"): tờ giấy với các trường nhập thử được, không lưu, không kiểm tra hợp lệ.',
      'Mở từ panel "Biểu mẫu phần tử" của Chi tiết quy trình (SCR-42): quay lại / Huỷ về Chi tiết quy trình. Biểu mẫu đang Dừng hoạt động thì chỉ xem: không kéo-thả, thuộc tính khoá, chỉ còn Xem trước (source không có chế độ này). Mở từ danh sách thì sửa được như cũ.',
    ],
    q: ['P-45', 'P-49', 'P-48'], src: 'ecat common-catalog/catalogs/e-form/components/e-form-designer · /common-catalog/e-form/design',
  };

  function design(id) {
    // Theo: fe/repo-khcn-ecat-fe/src/app/features/common-catalog/catalogs/e-form/components/e-form-designer/e-form-designer.component.html (+ .ts)
    const r = rowOf(id);
    if (!r) { location.hash = '#/eform'; return ''; }
    if (!(ROLES.includes(Flow.state.persona) || D.allAccess(Flow.state.persona))) return noAccess(`<div class="pg-head"><div class="l"><h1 class="pg-title">Thiết kế biểu mẫu</h1></div></div>`);
    const ds = dsFor(r);
    const meta = (k, v, cls) => `<div><span class="k">${k}</span><span class="v ${cls || ''}">${v}</span></div>`;
    const tools = ds.ro ? '<button type="button" class="vbtn secondary" data-efd-preview>Xem trước</button>'
      : `<div class="efd-ur"><button type="button" data-efd-undo aria-label="Hoàn tác" title="Hoàn tác" ${ds.undo.length ? '' : 'disabled'}>${FIC.undo}</button><span class="sep"></span>
            <button type="button" data-efd-redo aria-label="Làm lại" title="Làm lại" ${ds.redo.length ? '' : 'disabled'}>${FIC.redo}</button></div>
          <button type="button" class="vbtn secondary" data-efd-leave>Huỷ</button><button type="button" class="vbtn secondary" data-efd-preview>Xem trước</button>
          <button type="button" class="vbtn primary" data-efd-save>Lưu thiết kế</button>`;
    const tip = ds.ro
      ? `<div class="efd-tip warn" data-efd-ro>${FIC.infoSq}<span>Biểu mẫu đang <strong>Dừng hoạt động</strong> — chỉ xem, không chỉnh sửa được thiết kế.</span></div>`
      : `<div class="efd-tip">${FIC.infoSq}<span>Kéo-thả các trường từ dock <strong>Thành phần</strong> (trái), chỉnh thuộc tính ở dock phải. Đặt <code>key = ketLuan</code> cho trường kết luận để hệ thống tự nhận Đồng ý/Đạt/Thông qua/Phê duyệt.</span></div>`;
    return `<div class="pg efd ${ds.ro ? 'ro' : ''}">
      <div class="efd-bar"><div class="l"><button type="button" class="efd-back" data-efd-leave aria-label="Quay lại">${icon('back')}</button>
          <h1 class="efd-title">Thiết kế biểu mẫu${infoBtn(DINFO)}</h1></div>
        <div class="r">${tools}</div></div>
      <div class="efd-meta"><div class="efd-meta-h" data-efd-meta><h2>Thông tin biểu mẫu</h2><button type="button" class="efd-x ${ds.meta ? '' : 'up'}" aria-label="Thu gọn/mở rộng thông tin" aria-expanded="${ds.meta}">${icon('chev')}</button></div>
        ${ds.meta ? `<div class="efd-meta-g">${meta('Loại biểu mẫu', esc(r.type))}${meta('Loại hồ sơ', esc(r.docType))}${meta('Mã biểu mẫu', esc(r.code))}${meta('Tên biểu mẫu', esc(r.name))}
          ${meta('Mô tả', esc(r.description || '--'), 'n')}${meta('File đính kèm', r.file ? `<span class="efd-att">${FIC.file}${esc(r.file)}</span>` : '<span class="none">--</span>', 'n')}</div>` : ''}</div>
      ${tip}
      <div class="efd-ws">
        <aside class="efd-left"><h3>Thành phần</h3><label class="vsearch h36 efd-kw">${icon('search')}<input id="efd-kw" placeholder="Tìm thành phần" value="${esc(ds.kw)}"></label>
          <div id="efd-cats">${cats()}</div></aside>
        <div class="efd-canvas"><div class="efd-paper"><div class="efd-paper-h"><h3>${esc(r.code)} — ${esc(r.name)}</h3><p>${ORG}</p></div>
          <div><h4 class="efd-sec">1. Thông tin ${esc(r.type.toLowerCase())}</h4><div class="efd-list" id="efd-list">${canvas()}</div></div></div></div>
        <aside class="efd-rwrap" id="efd-right">${right()}</aside></div></div>`;
  }

  /* Sửa một thuộc tính của trường đang chọn; gõ liên tục vào cùng ô chỉ tạo một bước hoàn tác. */
  function edit(p, v, once) {
    const f = selField();
    if (!f) return;
    const k = f.id + ':' + p;
    if (once || DS.editKey !== k) { snap(); DS.editKey = once ? null : k; }
    f[p] = v;
  }

  function newField(it) {
    const keys = new Set(DS.fields.map((f) => f.key));
    let n = Number(String(Date.now()).slice(-4)), key;
    do { key = 'field_' + String(n).padStart(4, '0'); n = (n + 1) % 10000; } while (keys.has(key));
    const f = { id: `f_${Date.now()}_${++seq}`, label: it.label, type: it.type, required: false, key, description: '',
      placeholder: it.type === 'DATETIME' ? 'Chọn ngày / giờ' : (it.type === 'FORMULA' || it.type === 'FILE' ? '' : 'Gợi ý nhập liệu...') };
    if (it.type === 'FORMULA') f.formula = '= field1+ field2';
    if (it.type === 'FILE') f.multiple = false;
    return f;
  }

  const bump = (v) => { const m = /^v(\d+)\.(\d+)$/.exec(v); return m ? `v${m[1]}.${Number(m[2]) + 1}` : 'v1.1'; };
  function summary(a, b) {
    const A = new Map(a.map((f) => [f.id, JSON.stringify(f)])), B = new Set(b.map((f) => f.id));
    const add = b.filter((f) => !A.has(f.id)).length, del = a.filter((f) => !B.has(f.id)).length;
    const upd = b.filter((f) => A.has(f.id) && A.get(f.id) !== JSON.stringify(f)).length;
    const parts = [add && `thêm ${add} trường`, del && `xoá ${del} trường`, upd && `sửa ${upd} trường`].filter(Boolean);
    return `Cập nhật thiết kế: ${parts.length ? parts.join(', ') : 'đổi thứ tự trường'} (tổng ${b.length} trường).`;
  }
  /* onSave: toast thành công; prototype lưu thật — phiên bản + lịch sử khi thiết kế có thay đổi (P-45). */
  function saveDesign() {
    const r = rowOf(DS.id);
    if (dirty()) {
      const desc = summary(r.fields, DS.fields);
      r.fields = clone(DS.fields);
      r.history.unshift({ version: bump(version(r)), at: now(), action: 'Cập nhật cấu hình biểu mẫu', desc, by: QT() });
      save();
      DS.base = JSON.stringify(DS.fields);
    }
    toast('<b>Thành công</b><br>Lưu thiết kế biểu mẫu thành công!');
    rerender();
  }

  /* goBack: chưa sửa → về danh sách; có thay đổi → USER.DIALOG.UNSAVED_CHANGES_*. */
  async function leave() {
    if (dirty()) {
      const ok = await window.Catalog.confirm({ sev: 'warning', title: 'Bạn có chắc muốn đóng popup này?', desc: 'Các thay đổi bạn vừa thực hiện sẽ không được lưu lại.',
        hl: '', cancel: 'Tiếp tục chỉnh sửa', ok: 'Đóng' });
      if (!ok) return;
    }
    const back = DS ? DS.back : 'eform';
    DS = null;
    location.hash = '#/' + back;
  }

  /* SCR-52 Xem trước biểu mẫu (vht-modal, cỡ mặc định md 520): tờ giấy, trường render theo loại, nhập thử được. */
  function preview() {
    // Theo: e-form-designer.component.html khối "Preview Modal" (vht-form-field theo field.type)
    const r = rowOf(DS.id);
    const sel = (f, value) => vSelect({ id: 'efp-' + f.id, options: opts(f.options || []), value, multi: f.type === 'TAGLIST', placeholder: f.placeholder || '-- Chọn giá trị --',
      onChange: (v) => { const el = document.querySelector(`[data-vsel="efp-${CSS.escape(f.id)}"]`); if (el) el.outerHTML = sel(f, v); } });
    const ctl = (f) => {
      switch (f.type) {
        case 'TEXTAREA': return `<textarea class="vctl ta" rows="3" placeholder="${esc(f.placeholder || 'Nhập ' + f.label)}"></textarea>`;
        case 'CHECKBOX': return `<label class="efd-cb live"><input type="checkbox"><span class="bx">${icon('check')}</span>${esc(f.label)}</label>`;
        case 'CHECKLIST': return `<div class="efd-opts">${optsOf(f).map((o) => `<label class="efd-cb live"><input type="checkbox"><span class="bx">${icon('check')}</span>${esc(o)}</label>`).join('')}</div>`;
        case 'RADIO': return `<div class="efd-opts row" data-efp-radio>${optsOf(f).map((o) => `<label class="vradio-opt" data-efp-r><span class="rb"></span><span>${esc(o)}</span></label>`).join('')}</div>`;
        case 'DROPDOWN': return sel(f, null);
        case 'TAGLIST': return sel(f, []);
        case 'DATETIME': return `<div class="efd-ic-in"><input class="vctl" placeholder="${esc(f.placeholder || f.dateFormat || 'dd/mm/yyyy')}">${FIC.cal}</div>`;
        case 'NUMBER': return `<input class="vctl" inputmode="decimal" placeholder="${esc(f.placeholder || 'Nhập ' + f.label)}">`;
        case 'FORMULA': return `<div class="efd-ic-in"><input class="vctl mono" disabled value="${esc(f.formula || '')}">${FIC.formula}</div>`;
        case 'FILE': return `<div class="efd-filebox"><span>Chọn tệp đính kèm...</span><span class="pill">${FIC.file}Tải tệp</span></div>`;
        default: return `<input class="vctl" placeholder="${esc(f.placeholder || 'Nhập ' + f.label)}">`;
      }
    };
    const m = vModal({ title: 'Xem trước biểu mẫu', size: 'w520', body: `<div class="efp">
        <div class="efd-paper-h"><h3>${esc(r.code)} — ${esc(r.name)}</h3><p>TCT VHT</p></div>
        <div class="efp-l">${DS.fields.map((f) => `<div class="vfield" data-efp="${esc(f.key || f.id)}"><div class="lr"><label>${esc(f.label)}</label>${f.required ? '<span class="req">*</span>' : ''}</div>${ctl(f)}</div>`).join('')}</div></div>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
    m.el.addEventListener('click', (e) => {
      const o = e.target.closest('[data-efp-r]');
      if (!o) return;
      e.preventDefault();
      o.parentElement.querySelectorAll('[data-efp-r]').forEach((x) => x.classList.toggle('on', x === o));
    });
  }

  /* Kéo-thả HTML5: thành phần từ dock → canvas (thêm), trường trên canvas → vị trí mới (đổi thứ tự); vạch đỏ chỉ vị trí thả. */
  let drag = null;
  function indexAt(list, y) {
    const cards = Array.from(list.querySelectorAll('[data-efd-field]'));
    const i = cards.findIndex((c) => { const b = c.getBoundingClientRect(); return b.height && y < b.top + b.height / 2; });
    return { i: i < 0 ? cards.length : i, cards };
  }
  function endDrag() {
    drag = null;
    document.querySelectorAll('.efd-ph').forEach((x) => x.remove());
    document.querySelectorAll('.efd-f.dragging').forEach((x) => x.classList.remove('dragging'));
  }
  function dropInto(d, at) {
    if (d.kind === 'new') {
      const it = DOCK_ITEMS.find((x) => x.id === d.type);
      snap();
      const f = newField(it);
      DS.fields.splice(at, 0, f);
      DS.sel = f.id;
      toast(`<b>Thành công</b><br>Đã thêm trường "${esc(it.label)}" vào biểu mẫu`);
    } else {
      const from = DS.fields.findIndex((x) => x.id === d.id);
      const to = at > from ? at - 1 : at;
      if (from < 0 || to === from) return;
      snap();
      DS.fields.splice(to, 0, DS.fields.splice(from, 1)[0]);
    }
    rerender();
  }
  document.addEventListener('dragstart', (e) => {
    if (!DS || !onDesign() || !e.target.closest) return;
    if (DS.ro) { if (e.target.closest('[data-efd-new], [data-efd-field]')) e.preventDefault(); return; }
    const n = e.target.closest('[data-efd-new]'), c = e.target.closest('[data-efd-field]');
    if (!n && !c) return;
    drag = n ? { kind: 'new', type: n.dataset.efdNew } : { kind: 'move', id: c.dataset.efdField };
    const f = c && DS.fields.find((x) => x.id === drag.id);
    const kind = n ? DOCK_ITEMS.find((x) => x.id === drag.type) : kindOf(f.type);
    e.dataTransfer.effectAllowed = n ? 'copy' : 'move';
    e.dataTransfer.setData('text/plain', n ? kind.label : f.label);
    // *cdkDragPreview: thẻ đen chì nghiêng nhẹ.
    const g = document.createElement('div');
    g.className = 'efd-ghost';
    g.innerHTML = `${FIC[kind.id]}<span>${esc(n ? kind.label : f.label)}</span>`;
    document.body.appendChild(g);
    if (e.dataTransfer.setDragImage) e.dataTransfer.setDragImage(g, 20, 20);
    setTimeout(() => { g.remove(); if (c) c.classList.add('dragging'); }, 0);
  });
  document.addEventListener('dragover', (e) => {
    if (!drag) return;
    const list = e.target.closest && e.target.closest('#efd-list');
    if (!list) { document.querySelectorAll('.efd-ph').forEach((x) => x.remove()); return; }
    e.preventDefault();
    e.dataTransfer.dropEffect = drag.kind === 'new' ? 'copy' : 'move';
    const { i, cards } = indexAt(list, e.clientY);
    let line = list.querySelector('.efd-ph');
    if (!line) { line = document.createElement('div'); line.className = 'efd-ph'; line.innerHTML = '<i></i><i></i>'; }
    const before = cards[i] || list.querySelector('.efd-drop-end');
    if (line.nextElementSibling !== before) list.insertBefore(line, before);
  });
  document.addEventListener('drop', (e) => {
    if (!drag) return;
    const list = e.target.closest && e.target.closest('#efd-list');
    const d = drag;
    if (list) { e.preventDefault(); const at = indexAt(list, e.clientY).i; endDrag(); dropInto(d, at); } else endDrag();
  });
  document.addEventListener('dragend', () => { if (drag) endDrag(); });

  document.addEventListener('click', (e) => {
    if (!DS || !onDesign()) return;
    const t = e.target;
    if (t.closest('.overlay')) return;
    if (t.closest('[data-efd-leave]')) { leave(); return; }
    if (DS.ro && t.closest('[data-efd-rm], [data-efd-del], [data-efd-sw], [data-efd-undo], [data-efd-redo], [data-efd-save]')) return;
    if (t.closest('[data-efd-undo]')) { travel(DS.undo, DS.redo); return; }
    if (t.closest('[data-efd-redo]')) { travel(DS.redo, DS.undo); return; }
    if (t.closest('[data-efd-preview]')) { preview(); return; }
    if (t.closest('[data-efd-save]')) { saveDesign(); return; }
    if (t.closest('[data-efd-meta]')) { DS.meta = !DS.meta; rerender(); return; }
    const cat = t.closest('[data-efd-cat]');
    if (cat) { DS.open[cat.dataset.efdCat] = !DS.open[cat.dataset.efdCat]; rerender(); return; }
    const rm = t.closest('[data-efd-rm]');
    if (rm) {
      // removeField: nút xoá hiện khi rê chuột trên trường, không có toast.
      snap();
      DS.fields = DS.fields.filter((f) => f.id !== rm.dataset.efdRm);
      if (DS.sel === rm.dataset.efdRm) DS.sel = null;
      rerender(); return;
    }
    if (t.closest('[data-efd-close]')) { DS.sel = null; DS.editKey = null; rerender(); return; }
    if (t.closest('[data-efd-del]')) {
      snap();
      DS.fields = DS.fields.filter((f) => f.id !== DS.sel);
      DS.sel = null;
      toast('<b>Thành công</b><br>Đã xoá thành phần khỏi biểu mẫu');
      rerender(); return;
    }
    const sw = t.closest('[data-efd-sw]');
    if (sw) { const f = selField(); edit(sw.dataset.efdSw, !f[sw.dataset.efdSw], true); rerender(); return; }
    const fc = t.closest('[data-efd-field]');
    if (fc && DS.sel !== fc.dataset.efdField) { DS.sel = fc.dataset.efdField; DS.editKey = null; rerender(); }
  });
  /* Gõ ở dock phải: cập nhật canvas + badge tại chỗ (giữ con trỏ); gõ ô tìm thành phần: lọc dock trái. */
  document.addEventListener('input', (e) => {
    if (!DS || !onDesign()) return;
    const t = e.target;
    if (t.id === 'efd-kw') { DS.kw = t.value; document.getElementById('efd-cats').innerHTML = cats(); return; }
    const p = t.dataset && t.dataset.efdP;
    if (!p || DS.ro) return;
    let v = t.value;
    if (p === 'minLength' || p === 'maxLength') { v = v.replace(/\D/g, ''); if (t.value !== v) t.value = v; v = v ? Number(v) : null; }
    edit(p, v);
    document.getElementById('efd-list').innerHTML = canvas();
    document.getElementById('efd-id').innerHTML = idRow(selField());
    const u = document.querySelector('[data-efd-undo]'), rd = document.querySelector('[data-efd-redo]');
    if (u) u.disabled = !DS.undo.length;
    if (rd) rd.disabled = !DS.redo.length;
  });

  /* ---------- Sự kiện ---------- */
  /* Link mã biểu mẫu ở màn khác (SCR-42, data-ef-open = id): mở màn Thiết kế, quay lại về màn đang đứng. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('[data-ef-open]');
    if (!a) return;
    e.preventDefault();
    openFrom(a.dataset.efOpen, location.hash.replace(/^#\/?/, ''));
  });
  const onPage = () => /^#\/eform(\/|$)/.test(location.hash);
  const rowOf = (id) => rows().find((r) => String(r.id) === String(id));
  document.addEventListener('click', (e) => {
    if (!onPage()) return;
    const t = e.target;
    const pg = t.closest('[data-pager="eform"]');
    if (pg) {
      const b = t.closest('[data-pg]'), z = t.closest('[data-ps]');
      if (b) S.page = Number(b.dataset.pg);
      else if (z) { S.size = Number(z.dataset.ps); S.page = 1; S.psOpen = false; } else if (t.closest('[data-ps-open]')) S.psOpen = !S.psOpen;
      else return;
      rerender(); return;
    }
    if (S.psOpen) { S.psOpen = false; rerender(); }
    if (t.closest('[data-ef-export]')) { exportCsv(); return; }
    if (t.closest('[data-ef-import]')) { importDlg(); return; }
    if (t.closest('[data-ef-new]')) { openForm(null); return; }
    const ed = t.closest('[data-ef-edit]');
    if (ed) { e.preventDefault(); openForm(rowOf(ed.dataset.efEdit)); return; }
    const ds = t.closest('[data-ef-design]');
    if (ds) { location.hash = designHref(rowOf(ds.dataset.efDesign)); return; }
    const h = t.closest('[data-ef-hist]');
    if (h) { historyDlg(rowOf(h.dataset.efHist)); return; }
    const dl = t.closest('[data-ef-del]');
    if (dl) { del(rowOf(dl.dataset.efDel)); return; }
    const tg = t.closest('[data-ef-tg]');
    if (tg) toggle(rowOf(tg.dataset.efTg));
  });
  /* Ô tìm lọc ngay khi gõ (ngModelChange → handleSearch), giữ con trỏ sau khi vẽ lại. */
  document.addEventListener('input', (e) => {
    if (!e.target.matches || !e.target.matches('#ef-kw')) return;
    S.kw = e.target.value; S.page = 1;
    rerender();
    const n = document.getElementById('ef-kw');
    if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
  });

  window.EForm = { list, design, reset, rows, usedIn, linkRefs, activeOptions, openFrom };
})();
