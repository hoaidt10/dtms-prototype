/*
 * eForm (Camunda Form schema) của các user task MS13-TO BE (hồ sơ Phê duyệt KĐT) — B0.4 (2), docs/dtms/prototype-B04-phan-loai-task.md §4.2.
 * Cùng khuôn với eforms/ms01.js (xem chú thích ở đó). Bước 1, 5, 7, 8 dùng lại form MS01 với căn cứ KĐT; bước 10 thêm nhãn KĐT.
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, tf, ta, dt, sel, rad, chkl, tags, req, grp, dl, opts } = B;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const SIGN_COLS = [['nguoiKy', 'Người ký'], ['tuCach', 'Tư cách'], ['trangThai', 'Trạng thái'], ['thoiDiem', 'Thời điểm']];
  const KET_LUAN = opts(['Đồng ý', 'Cần sửa đổi, giải trình']);
  const PEND_COLS = [['donVi', 'Đơn vị'], ['muc', 'Mục'], ['yKien', 'Ý kiến'], ['traLoi', 'Đơn vị đề xuất trả lời']];
  const CL_ROW = [txt('**{{this.tt}}**', 1), txt('{{if this.header then "**" + this.muc + "**" else this.muc}}', 6),
    txt('{{this.so}}', 3, '=this.header'), txt('{{this.yeuCau}}', 2, '=this.header'), txt('**{{this.tinhTrang}}**', 2, '=this.header'),
    tf('ghiChu', 'Ghi chú', { layout: { columns: 16 }, conditional: { hide: '=this.header or this.tinhTrang = "Đủ"' } })];
  const checklistKdt = (path, label) => dl(path, label, CL_ROW);
  /* Ghi kết luận TTMS / CQCM của lượt thẩm định vào ý kiến theo lượt (op['td-lượt-đơn vị'] — đọc ở cổng "Cần sửa đổi hoặc giải trình?"). */
  const writeOp = (id) => (v, tok, h) => {
    const op = Object.assign({}, window.Flow.ui.op);
    op[`${h.tdKey()}-${h.rvIdx(tok.task === 24)}-${id === 'cqcm' ? tok.cqcm : id}`] = v.ketLuanTd === 'Cần sửa đổi, giải trình';
    return { op };
  };

  const F = {
    1: { id: 'dtms-ms13-b01-can-cu', q: ['P-59'],
      schema: () => ({ components: [
        sel('basisType', 'Loại căn cứ', req({ values: window.D.kdtBasisTypes.map((b) => ({ label: b.name, value: b.id })), layout: { columns: 8 } })),
        sel('basisDoc', 'Văn bản căn cứ đã phê duyệt', req({ valuesExpression: '=basisDocOptions[item.type = basisType]', searchable: true, layout: { columns: 8 } })),
        tbl('Văn bản căn cứ theo loại đã chọn', 'basisDocs[item.typeId = basisType]', [['so', 'Số'], ['ngay', 'Ngày'], ['loai', 'Loại'], ['trichYeu', 'Trích yếu'], ['giaTri', 'Giá trị (tỷ)'], ['conLai', 'Còn lại (tỷ)']])] }),
      notes: () => ['Căn cứ KĐT theo 3 loại: Kế hoạch SXKD / PAKD / đề tài hàng năm · Hợp đồng / thoả thuận hợp tác · Chỉ đạo Ban TGĐ (plan KĐT §4.1, UR-KDT-01). Văn bản căn cứ là options đọc từ biến (E1).',
        'Không lọc căn cứ theo quy trình: nhóm KĐT (MS13 / MS14 / MS15) do hệ thống xác định sau khi Ban Tài chính và TTMS xác nhận (D-7). Hoàn thành → task 02 lấy dữ liệu, task 03 AI gợi ý thông tin cơ bản KĐT.'],
      write: (v) => pick(v, ['basisType', 'basisDoc']) },

    4: { id: 'dtms-ms13-b04-thong-tin-co-ban', q: ['P-60'],
      schema: () => ({ components: [
        tf('tenDeXuat', 'Tên KĐT', req()),
        sel('fund', 'Nguồn vốn', req({ valuesKey: 'fundOptions', searchable: true, layout: { columns: 8 } })),
        rad('secret', 'Mật', req({ values: [{ label: 'Không', value: false }, { label: 'Có', value: true }], layout: { columns: 8 }, description: 'Mặc định theo khoản đầu tư.' })),
        B.aiTable('aiGoiY', 'Gợi ý AI từ căn cứ — Mục tiêu, sự cần thiết; Phạm vi, quy mô; Thời gian lấy theo quyết định ở đây')] }),
      notes: () => ['Lĩnh vực, Loại KĐT, Tính chất tài sản lấy từ khoản đầu tư — hiện ở Thông tin chung (khoá), là 3 trong 04 yếu tố phân luồng; yếu tố thứ tư là tổng mức vốn thực tế chốt sau báo giá (task 10).',
        'Không có Mức ưu tiên (từ điển dữ liệu KĐT §4.1). Hồ sơ Mật: mặc định ký cứng như ĐXMS (P-60).', 'Gợi ý AI (G2): như task 04 của MS01 — bảng quyết định Chấp nhận / Sửa / Bỏ theo từng mục.'] },

    10: { id: 'dtms-ms13-b10-bao-gia', q: ['P-06'],
      schema: () => ({ components: [
        txt('Lần gửi YCBG: **{{lanGuiYcbg}}**'),
        tbl('So sánh báo giá (đơn giá, tỷ đồng, gồm VAT)', 'baoGia', [['ncc', 'Nhà cung cấp'], ['ngay', 'Ngày báo giá'], ['tienTe', 'Loại tiền'], ['dong', 'Dòng hàng'], ['donGia', 'Đơn giá'], ['hieuLuc', 'Hiệu lực đến'], ['thapNhat', 'Giá thấp nhất']]),
        txt('### Kết quả AI kiểm tra báo giá: {{quoteCheck.ketQua}}\n{{quoteCheck.chiTiet}}'),
        txt('{{kdtLabel}}')] }),
      notes: () => ['Chốt tổng mức vốn → hệ thống gửi đồng thời 02 yêu cầu xác nhận: Ban Tài chính (task 11) ‖ TTMS (task 12). Nhóm KĐT và nhánh hồ sơ xác định sau khi cả hai xác nhận OK.',
        'DX-03 (đã duyệt, chờ BA): cổng "Báo giá đạt yêu cầu?" đọc thêm kết quả AI kiểm tra báo giá (<code>quoteCheck</code>) — AI Không đạt thì quay về bước 08 dù người dùng bấm "Chốt"; không khoá nút trên giao diện.',
        'Theo mũi tên BPMN, cổng "Báo giá đạt yêu cầu?" nằm sau phân luồng (plan KĐT §1.2a mục 1): hồ sơ vẫn qua hai xác nhận rồi mới quay về bước 08.'] },

    11: { id: 'dtms-ms13-b11-xac-nhan-tscd', q: ['P-52'],
      schema: () => ({ components: [txt('### Thông tin khoản đầu tư\n{{kdtTomTat}}'),
        tbl('Danh mục đầu tư', 'danhMuc', [['n', 'STT'], ['hang', 'Hàng hoá / dịch vụ'], ['sl', 'SL mua'], ['thanhTien', 'Thành tiền (tỷ)'], ['loai', 'Loại chi phí']]),
        rad('tscd', 'Hình thành tài sản cố định', req({ values: [{ label: 'Có', value: true }, { label: 'Không', value: false }], layout: { columns: 8 } })),
        ta('tscdNote', 'Ghi chú', { placeholder: 'Nhập ghi chú' })] }),
      notes: () => ['Ban Tài chính xác nhận Có / Không hình thành TSCĐ và trả kết quả OK / Không OK (task 11), song song với TTMS xác nhận 04 yếu tố (task 12); hệ thống chờ đủ 02 kết quả (cổng AND).',
        '"Không OK" mở dialog nhận xét (lý do bắt buộc — G6) → AI gợi ý thông tin cần chỉnh sửa (task 13) → ĐVĐX tổng hợp lại báo giá ở task 10.'],
      write: (v) => pick(v, ['tscd', 'tscdNote']) },

    12: { id: 'dtms-ms13-b12-xac-nhan-yeu-to', q: ['P-51', 'P-52', 'P-56', 'P-28'],
      schema: () => ({ components: [
        dl('yeuTo', 'Xác nhận 04 yếu tố định danh', [txt('**{{this.yeuTo}}**', 4), txt('{{this.giaTri}}', 6), txt('*Nguồn: {{this.nguon}}*', 4), B.chk('dung', 'Đúng', { layout: { columns: 2 } })]),
        txt('**Xác nhận hình thành TSCĐ (Ban Tài chính):** {{tscdKetQua}}'),
        banner('{{phanLuong.canhBao}}', '=phanLuong.ms13'),
        txt('### Kết quả phân luồng\n**Nhóm khoản đầu tư:** {{phanLuong.nhom}} · **Ngưỡng MS13 áp dụng:** {{phanLuong.nguong}} · **Cấp xử lý:** VHT · **Nhánh hồ sơ:** {{phanLuong.nhanh}}'),
        tbl('Điều kiện gộp hồ sơ (BM-00)', 'mergeConds', [['dieuKien', 'Điều kiện'], ['ketQua', 'Kết quả']], '=not(phanLuong.ms13)'),
        txt('*Báo giá chưa đạt yêu cầu: sau khi đủ hai xác nhận, hồ sơ quay lại bước lập yêu cầu báo giá.*', 16, '=not(phanLuong.baoGiaChuaDat)')] }),
      notes: () => ['TTMS đối chiếu 04 yếu tố định danh: Lĩnh vực, Loại KĐT, Tính chất tài sản (khoản đầu tư) và tổng mức vốn thực tế (báo giá đã chốt ở task 10).',
        'Bỏ chọn "Đúng" ở yếu tố sai thì phải chọn "Không OK" (dialog nhận xét): nút "Xác nhận OK" mở form, BE từ chối submit khi còn yếu tố bỏ chọn (cùng cơ chế G3) — P-52.',
        'Kết quả phân luồng, điều kiện gộp = DMN (business rule task) đọc Ngưỡng phân luồng (VT-CNTT < 160 tỷ, lĩnh vực khác < 90 tỷ — P-28) → biến <code>kdtGroup</code>, <code>mergeConds</code> (S6). Gộp BM-00 khi đủ 03 điều kiện (P-51); cấp xử lý luôn VHT (P-56).'],
      write: (v) => { const bad = {}; (v.yeuTo || []).forEach((r) => { if (!r.dung) bad[r.key] = true; }); return { factorBad: bad }; } },

    14: { id: 'dtms-ms13-b14-du-thao',
      schema: () => ({ components: [B.aiTable('aiDuThao', 'Mục do AI gợi ý từ thông tin cơ bản'),
        txt('**Tổng mức vốn thực tế (gồm VAT):** {{tongMucVon}} tỷ đồng · **Hàng tồn kho sử dụng:** {{tonKhoKdt}}'),
        tf('nguonVonKdt', 'Nguồn vốn', req({ layout: { columns: 8 } })), tf('thoiGianKdt', 'Thời gian thực hiện', req({ layout: { columns: 8 } })),
        ta('bienPhapKdt', 'Biện pháp, kế hoạch thực hiện')] }),
      notes: () => ['Nội dung dự thảo lấy từ thông tin cơ bản (bước 04) và tổng mức vốn thực tế đã chốt (bước 10). Hoàn thành → AI hỗ trợ soạn nội dung (bước 15) → ĐVĐX rà soát, hoàn thiện (bước 16).'],
      write: (v) => pick(v, ['aiDuThao', 'nguonVonKdt', 'thoiGianKdt', 'bienPhapKdt']) },

    16: { id: 'dtms-ms13-b16-hoan-thien', q: ['P-51'],
      schema: () => ({ components: [B.aiTable('aiSoan', 'AI hỗ trợ soạn nội dung đề xuất'), txt('### Hình thức hồ sơ\n{{hinhThuc}}')] }),
      notes: () => ['G2: mặc định Chấp nhận = "Áp dụng tất cả" của bản cũ. Hoàn thiện → DMN kiểm tra 03 điều kiện gộp: đủ → văn bản gộp BM-00; còn lại → Tờ trình chủ trương BM-01 rồi hồ sơ KĐT BM-03.'],
      write: (v) => Object.assign(pick(v, ['aiSoan']), { kAi: (v.aiSoan || []).every((r) => r.quyetDinh === 'Chấp nhận') }) },

    18: { id: 'dtms-ms13-b18-bm00', q: ['P-50'],
      schema: () => ({ components: [tbl('AI hỗ trợ lập dự thảo văn bản gộp', 'bm00Nguon', [['phan', 'Phần'], ['nguon', 'Nguồn'], ['trangThai', 'Trạng thái']]),
        grp('Nội dung sửa được của BM-00', [ta('mucTieuK', 'Mục tiêu đầu tư'), ta('suCanThietK', 'Sự cần thiết', req()), ta('toChucK', 'Tổ chức thực hiện')]),
        txt('Văn bản gộp **BM-00** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-00'],
      notes: () => ['Đủ 03 điều kiện gộp → chủ trương và KĐT lập chung một văn bản BM-00 (mẫu giả — P-50). AI lập dự thảo từ căn cứ, kết quả tồn kho, báo giá (bước 17); ĐVĐX rà soát, sửa trước khi xin ý kiến Chỉ huy.'],
      write: (v) => pick(v, ['mucTieuK', 'suCanThietK', 'toChucK']) },
    19: { id: 'dtms-ms13-b19-xin-y-kien', q: ['P-50'],
      schema: () => ({ components: [txt('**Người cho ý kiến:** {{nguoiChoYKien}}'), txt('Văn bản gộp **BM-00** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-00'], notes: () => ['ĐVĐX gửi dự thảo văn bản gộp BM-00 xin ý kiến Chỉ huy ĐVĐX trước khi chuyển thẩm định.'] },
    20: { id: 'dtms-ms13-b20-y-kien-chi-huy', q: ['P-50'],
      schema: () => ({ components: [txt('Văn bản gộp **BM-00** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.'), ta('yKienChiHuy', 'Ý kiến của Chỉ huy đơn vị đề xuất', req({ rows: 4 }))] }),
      outputs: () => ['BM-00'],
      notes: () => ['BPMN không có cổng đồng ý / không đồng ý ở bước này: ĐVĐX tiếp thu, hoàn thiện theo ý kiến trước khi chọn CQCM (bước 21).'],
      write: (v) => pick(v, ['yKienChiHuy']) },

    21: 'chonCqcm', 38: 'chonCqcm', 48: 'chonCqcm',

    39: { id: 'dtms-ms13-b39-trinh', q: ['P-62', 'P-57'],
      schema: () => ({ components: [
        banner('Kiểm tra trước khi gửi: Không đạt — {{aiCheckK.lyDo}} Hồ sơ chưa được gửi.', '=aiCheckK = null'),
        tbl('Đầu mối nhận hồ sơ', 'dsDauMoi[item.ma = "TTMS" or list contains(cqcmSel, item.ma)]', [['nguoi', 'Người nhận'], ['vaiTro', 'Vai trò'], ['donVi', 'Đơn vị']]),
        B.aiTable('aiSuCanThietK', 'Mục bắt buộc của Tờ trình BM-01 (gợi ý AI)'),
        txt('Tờ trình chủ trương **BM-01** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-01'],
      notes: () => ['DX-01 (đã duyệt, chờ BA): bước 40 (HT/AI kiểm tra trước khi gửi) thêm nhánh Không đạt quay về bước 39; form hiện lý do (biến <code>aiCheckK</code>). Đạt → chuyển đúng đầu mối, bắt đầu thẩm định (quy trình con bước 41).'],
      write: (v) => Object.assign(pick(v, ['aiSuCanThietK']), { kNeed: !!window.EVars.h.aiFinal((v.aiSuCanThietK || [])[0]) }),
      gate: (out) => (out.kNeed || window.Flow.doneCount(39) > 0 ? null : { key: 'aiCheckK', lyDo: 'Tờ trình BM-01 thiếu mục bắt buộc “Sự cần thiết” (mục 4.2).',
        toast: 'Kiểm tra trước khi gửi: Không đạt — Tờ trình BM-01 thiếu mục “Sự cần thiết”. Hồ sơ chưa được gửi.' }) },

    36: { id: 'dtms-ms13-b36-to-trinh-bm01',
      schema: () => ({ components: [
        grp('Tờ trình chủ trương KĐT (BM-01) — nội dung các mục', [ta('mucTieuK', '4.1. Mục đích, mục tiêu', req()), B.aiTable('aiSuCanThietK', '4.2. Sự cần thiết (gợi ý AI)'),
          ta('phuongPhapK', '5.2. Phương pháp tính toán'), ta('toChucK', 'II. Tổ chức thực hiện')]),
        tbl('Phụ lục danh mục', 'phuLucDanhMuc', [['n', 'STT'], ['hang', 'Hàng hoá / dịch vụ'], ['sl', 'SL mua'], ['donGia', 'Đơn giá (tỷ)'], ['thanhTien', 'Thành tiền (tỷ)'], ['loai', 'Loại chi phí']]),
        tbl('Checklist số 01', 'checklist01', [['tt', 'TT'], ['muc', 'Danh mục hồ sơ'], ['so', 'Số văn bản'], ['yeuCau', 'Yêu cầu'], ['tinhTrang', 'Tình trạng'], ['ghiChu', 'Ghi chú']]),
        txt('Tờ trình **BM-01** hoàn chỉnh (mẫu Word + dữ liệu form) xem ở **Văn bản đầu ra**; căn cứ, eBOM, kết quả tồn kho, báo giá ở Danh sách tài liệu.')] }),
      outputs: () => ['BM-01'],
      notes: () => ['Tờ trình chủ trương KĐT (ký trực tiếp) BM-01 theo bộ biểu mẫu KĐT (BM-8.6.5): Thủ trưởng ký ô PHÊ DUYỆT ngay trên tờ trình, cơ quan chủ trì thẩm định ký thẩm định trên cùng văn bản.',
        'G4: tab của bản cũ tách thành nội dung từng mục (trường form), Phụ lục và Checklist 01 (khối chỉ xem), văn bản hoàn chỉnh ở Văn bản đầu ra, tệp ở Danh sách tài liệu.'],
      write: (v) => Object.assign(pick(v, ['mucTieuK', 'aiSuCanThietK', 'phuongPhapK', 'toChucK']), { kNeed: !!window.EVars.h.aiFinal((v.aiSuCanThietK || [])[0]) }) },
    37: { id: 'dtms-ms13-b37-kiem-tra-cl01',
      schema: () => ({ components: [txt('**Đại diện đơn vị kiểm tra:** Phòng Kế hoạch – Tổng hợp, Trung tâm Vô tuyến · **Đại diện đơn vị lập hồ sơ:** Nguyễn Văn Minh'),
        checklistKdt('checklist01', 'Checklist số 01 — Kiểm tra hồ sơ trình phê duyệt chủ trương KĐT đơn giản'), ta('ketLuanCl', 'Kết luận', req())] }),
      outputs: () => ['BM-01'],
      notes: () => ['Đầu mối kiểm tra độc lập của đơn vị kiểm tra tính đầy đủ, hợp lệ theo Checklist 01; không xoá dòng khi thiếu tài liệu, ghi rõ lý do ở cột Ghi chú (BM-8.6.5). Tình trạng do BE tính theo tài liệu đã có.'],
      write: (v) => pick(v, ['checklist01', 'ketLuanCl']) },

    24: { id: 'dtms-ms13-b24-ttms-tham-dinh', q: ['P-54'],
      schema: () => ({ components: [
        banner('{{banner24}}', '=banner24 = "" or banner24 = null', 'moved'),
        txt('### Rà soát tính hợp lệ & danh sách CQCM · {{demVong}}\n{{raSoat}}'),
        txt('**Thẩm định nội dung hồ sơ** — lượt {{luot}}'),
        dl('thamDinh', '', [txt('{{this.stt}}. {{this.noiDung}}', 10), rad('danhGia', 'Đánh giá', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 6 } }))]),
        ta('nhanXetTtms', 'Nhận xét của TTMS'),
        rad('ketLuanTd', 'Kết luận', req({ values: KET_LUAN })),
        tbl('Ý kiến các lượt trước', 'yKienTruoc', [['luot', 'Lượt'], ['donVi', 'Đơn vị'], ['noiDung', 'Nội dung cần sửa'], ['traLoi', 'Đơn vị đề xuất trả lời']], '=count(yKienTruoc) = 0')] }),
      notes: (h) => ['Khi nhận hồ sơ, TTMS rà soát tính hợp lệ và danh sách CQCM: chưa đạt → "Danh sách CQCM chưa đạt" (dialog nhận xét, trả lại chọn CQCM); chưa đủ điều kiện → AI gợi ý, ĐVĐX bổ sung (bước 22–23). Đủ → thẩm định; hệ thống gửi hồ sơ tới CQCM phối hợp (bước 25–26).',
        'Bộ đếm vòng check / lần họp do engine tăng (script task), đếm riêng cho từng giai đoạn (hồ sơ gộp, chủ trương, KĐT). Kết luận "Cần sửa đổi, giải trình" là biến cổng "Cần sửa đổi hoặc giải trình?".'],
      write: (v, tok, h) => Object.assign(pick(v, ['thamDinh', 'nhanXetTtms']), writeOp('TTMS')(v, tok, h)) },
    26: { id: 'dtms-ms13-b26-cqcm-y-kien',
      schema: (h) => ({ components: [txt('### AI gợi ý phản hồi\n{{aiPhanHoi}}'),
        txt('**{{cqcmTen}}** · Lượt {{luot}} · Hồ sơ v{{phienBan}}'),
        dl('phieuNhanXet', `Phiếu nhận xét (${h.stg().cq})`, [txt('**{{this.muc}}**', 3), ta('nhanXet', 'Nhận xét', { rows: 2, layout: { columns: 7 } }), ta('huongDan', 'Hướng dẫn sửa', { rows: 2, layout: { columns: 6 } })]),
        rad('ketLuanTd', 'Kết luận', req({ values: KET_LUAN }))] }),
      notes: (h) => [`CQCM phối hợp gửi ý kiến trực tiếp cho ĐVĐX và TTMS (không phát hành công văn đề nghị phối hợp riêng); phiếu nhận xét theo ${h.stg().cq}. Bản cũ vẽ chỉ xem — nay là bảng lặp CQCM nhập; multi-instance theo CQCM.`,
        'Một CQCM kết luận cần sửa → ĐVĐX bổ sung hoặc giải trình (bước 28).'],
      write: (v, tok, h) => Object.assign(pick(v, ['phieuNhanXet']), writeOp('cqcm')(v, tok, h)) },

    23: 'boSung', 53: 'boSung',
    28: { id: 'dtms-ms13-b28-giai-trinh', q: ['P-54'],
      schema: () => ({ components: [banner('{{chiDao}}', '=chiDao = ""', 'moved'),
        txt('### AI tổng hợp {{soNoiDung}} nội dung cần sửa đổi, giải trình · {{demVong}}\n{{aiTongHop}}'),
        dl('traLoi', 'Bảng tiếp thu, giải trình ý kiến', [txt('**{{this.donVi}}** · {{this.muc}}', 4), txt('{{this.yKien}}', 5), ta('traLoi', 'Nội dung trả lời', req({ rows: 3, layout: { columns: 7 } }))])] }),
      notes: () => ['ĐVĐX tiếp thu, bổ sung toàn bộ → TTMS rà soát lại (bước 24); còn giải trình, bảo lưu ý kiến → nội dung chưa thống nhất, TTMS tổ chức họp (tối đa 02 lần).'],
      write: (v) => pick(v, ['traLoi']) },
    29: { id: 'dtms-ms13-b29-hop', q: ['P-54'],
      schema: () => ({ components: [txt('### Chưa thống nhất sau {{soVongCheck}} vòng check — tổ chức họp lần {{lanHop}}/2\nĐã gửi yêu cầu họp tới đơn vị đề xuất và các CQCM phối hợp. {{demVong}}'),
        dt('thoiGianHop', 'Thời gian', req({ layout: { columns: 8 } })), tf('diaDiemHop', 'Địa điểm', req({ layout: { columns: 8 } })),
        tags('thanhPhanHop', 'Thành phần', req({ valuesKey: 'nguoiDungOptions' })),
        tbl('Nội dung chưa thống nhất', 'noiDungChuaTn', PEND_COLS),
        txt('Biên bản họp: tải lên ở **Danh sách tài liệu** (bắt buộc).'),
        ta('ketLuanHop', 'Kết luận', req())] }),
      notes: () => ['Tối đa 02 lần họp cho mỗi giai đoạn; hệ thống ghi nhận lần họp và kết quả (bước 30). Chặn họp lần 3 = gateway theo biến bộ đếm (đã có ở BPMN, P-54).', 'E3: Biên bản họp là tài liệu bắt buộc (G7). "Chưa thống nhất" mở dialog nhận xét.'],
      write: (v) => pick(v, ['thoiGianHop', 'diaDiemHop', 'thanhPhanHop', 'ketLuanHop']) },
    31: 'sauHop', 32: 'sauHop',
    33: { id: 'dtms-ms13-b33-cap-nhat',
      schema: () => ({ components: [txt(`### Đủ xác nhận sau họp\n- ${window.UI.persona('minh').name} — Chuyên quản ĐVĐX: đã xác nhận.\n- ${window.UI.persona('hai').name} — Chỉ huy ĐVĐX: đã xác nhận.`),
        tbl('Cập nhật hồ sơ theo nội dung đã xác nhận', 'dieuChinh', [['noiDung', 'Nội dung'], ['truoc', 'Trước họp'], ['sau', 'Sau họp (đã thống nhất)']]),
        txt('Hệ thống tạo phiên bản v{{phienBan + 1}} khi gửi.')] }),
      notes: () => ['Đã đủ xác nhận của Chuyên quản và Chỉ huy ĐVĐX: cập nhật hồ sơ theo nội dung đã thống nhất, hệ thống tạo phiên bản mới và chuyển TTMS rà soát lại (bước 24).'] },
    34: { id: 'dtms-ms13-b34-bao-cao',
      schema: () => ({ components: [txt('### Đã họp đủ 02 lần, vẫn chưa thống nhất\nKhông được tổ chức họp lần thứ 3. {{demVong}}'), tbl('Báo cáo nội dung chưa thống nhất', 'noiDungChuaTn', PEND_COLS),
        txt('**Biên bản họp** (Danh sách tài liệu):\n{{bienBan}}')] }),
      notes: () => ['Đã họp đủ 02 lần vẫn chưa thống nhất → CQCM chủ trì (TTMS) báo cáo người có thẩm quyền xem xét, kết luận (bước 35).'] },
    35: { id: 'dtms-ms13-b35-ket-luan', q: ['P-61'], reasonField: 'ketLuanTt',
      schema: () => ({ components: [tbl('Báo cáo của TTMS — nội dung chưa thống nhất', 'noiDungChuaTn', PEND_COLS), txt('**Biên bản họp** (Danh sách tài liệu):\n{{bienBan}}'),
        ta('ketLuanTt', 'Nội dung kết luận', req({ rows: 4 }))] }),
      notes: () => ['Thủ trưởng VHT xem xét, kết luận: chỉ đạo xử lý tiếp → ĐVĐX bổ sung / giải trình theo kết luận (bước 28); chỉ đạo dừng → kết thúc hồ sơ "Dừng theo chỉ đạo". Kết luận là trường của form (cả hai nút).'] },

    42: 'kyBm01', 44: 'kyBm01',
    46: { id: 'dtms-ms13-b46-ho-so-kdt',
      schema: () => ({ components: [banner('{{traLai51}}', '=traLai51 = ""', 'moved'),
        tbl('AI gợi ý từ chủ trương đã phê duyệt', 'keThua', [['noiDung', 'Nội dung'], ['tu', 'Kế thừa từ'], ['trangThai', 'Trạng thái']]), txt('*{{chuTruong}}*'),
        grp('Tờ trình BM-03 và Phụ lục thuyết minh — nội dung sửa được', [tf('diaDiem', 'Địa điểm đầu tư', { layout: { columns: 8 } }), ta('hienTrang', 'Đánh giá hiện trạng'), ta('ruiRo', 'Rủi ro')]),
        tbl('Checklist số 02', 'checklist02', [['tt', 'TT'], ['muc', 'Danh mục hồ sơ'], ['so', 'Số văn bản'], ['yeuCau', 'Yêu cầu'], ['tinhTrang', 'Tình trạng'], ['ghiChu', 'Ghi chú']]),
        txt('Tờ trình **BM-03** và **Phụ lục thuyết minh** (mẫu Word + dữ liệu form) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-03', 'PL-TM'],
      notes: () => ['AI tổng hợp, gợi ý từ chủ trương đã được Thủ trưởng ký duyệt (bước 45) để lập Tờ trình thẩm định, phê duyệt KĐT BM-03 và Checklist 02; ĐVĐX rà soát, bổ sung hồ sơ.', 'G4: tab của bản cũ tách thành trường form + khối chỉ xem + Văn bản đầu ra + Danh sách tài liệu.'],
      write: (v) => pick(v, ['diaDiem', 'hienTrang', 'ruiRo']) },
    47: { id: 'dtms-ms13-b47-kiem-tra-cl02',
      schema: () => ({ components: [txt('**Đại diện đơn vị kiểm tra:** Phòng Kế hoạch – Tổng hợp, Trung tâm Vô tuyến · **Đại diện đơn vị lập hồ sơ:** Nguyễn Văn Minh'),
        checklistKdt('checklist02', 'Checklist số 02 — Kiểm tra hồ sơ trình thẩm định, phê duyệt KĐT đơn giản'), ta('ketLuanCl', 'Kết luận', req())] }),
      outputs: () => ['BM-03', 'PL-TM'],
      notes: () => ['Đầu mối kiểm tra độc lập của đơn vị kiểm tra tính đầy đủ, hợp lệ của hồ sơ KĐT theo Checklist 02 rồi gửi CQCM chủ trì; không xoá dòng khi thiếu tài liệu (BM-8.6.5).'],
      write: (v) => pick(v, ['checklist02', 'ketLuanCl']) },
    51: { id: 'dtms-ms13-b51-bm14', q: ['P-56'],
      schema: () => ({ components: [txt('### Kết quả thẩm định KĐT\n{{ketQuaTd}}'), txt('**BM-14** Báo cáo kết quả thẩm định và dự thảo **Quyết định BM-18** xem ở **Văn bản đầu ra**; hồ sơ thẩm định ở Danh sách tài liệu.')] }),
      outputs: () => ['BM-14', 'BM-18'],
      notes: () => ['TTMS tổng hợp kết quả thẩm định, lập BM-14. Thông qua → Thủ trưởng ký Quyết định BM-18 (không phát hành công văn thẩm định riêng); chưa thông qua → dialog nhận xét, AI tóm tắt phản hồi, ĐVĐX hoàn chỉnh hồ sơ.', 'Cấp xử lý VHT: không xin ý kiến Tổng GĐ Tập đoàn (bước 50).'] },
    54: { id: 'dtms-ms13-b54-ky-bm18', q: ['P-60', 'P-61'],
      schema: () => ({ components: [txt('### Kết quả thẩm định KĐT\n{{ketQuaTd}}'), tbl('Khối chữ ký', 'kyBm18', SIGN_COLS), txt('**BM-18** (bản trình ký) và **BM-14** xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-18', 'BM-14'],
      notes: () => ['Thủ trưởng VHT ký chính thức Quyết định BM-18 trên VOffice; không chèn bước phát hành công văn giữa BM-14 và BM-18. Không ký → dialog nhận xét, hồ sơ quay lại bước chọn hình thức hồ sơ (sau bước 16).'] },
    55: 'kyBm00', 56: 'kyBm00',
  };

  const CHON_CQCM = { id: 'dtms-ms13-b21-38-48-chon-cqcm', q: ['P-57'],
    schema: (h, tok) => ({ components: [
      banner('TTMS trả lại danh sách CQCM: “{{traLai24.lyDo}}”. Cập nhật danh sách rồi trình lại.', '=traLai24 = null'),
      banner('{{yKienLead}}', '=yKienLead = ""', 'moved'),
      txt('{{chuTri}}'),
      chkl('cqcmSel', `Chọn CQCM phối hợp thẩm định ${{ 21: 'hồ sơ gộp', 38: 'chủ trương', 48: 'KĐT' }[tok.task]}`, { valuesKey: 'cqcmValuesK' }),
      rad('host', 'Đơn vị chủ trì lựa chọn nhà thầu, ký hợp đồng', req({ values: opts(window.EVars.h.HOSTS), description: 'Bắt buộc với KĐT KHCN.', conditional: { hide: '=not(canDonViChuTri)' } })),
      txt('Loại KĐT: {{loaiKdt}}.', 16, '=not(canDonViChuTri)')]
      .concat(tok.task === 38 ? [] : [tbl('Đầu mối nhận hồ sơ (tính lại theo CQCM đang chọn)', 'dsDauMoi[item.ma = "TTMS" or list contains(cqcmSel, item.ma)]', [['nguoi', 'Người nhận'], ['vaiTro', 'Vai trò'], ['donVi', 'Đơn vị']])]) }),
    notes: (h, tok) => [{ 38: 'ĐVĐX chủ động chọn CQCM phối hợp thẩm định theo tính chất KĐT; hệ thống không cố định danh sách. TTMS rà soát danh sách khi nhận hồ sơ (bước 24).',
      21: 'ĐVĐX tiếp thu ý kiến của Chỉ huy (bước 20), chủ động chọn CQCM cho hồ sơ gộp BM-00. TTMS rà soát tính hợp lệ và phê duyệt danh sách khi nhận hồ sơ (bước 24).',
      48: 'Sau khi kiểm tra hồ sơ (bước 47), ĐVĐX chọn CQCM thẩm định KĐT; danh sách chủ trương được chọn sẵn. Luồng tiếp theo áp dụng cơ chế thẩm định / giải trình như khâu dự thảo (quy trình con bước 49).' }[tok.task],
      'Đơn vị chủ trì: radio ẩn bằng conditional.hide theo loại KĐT (ẩn thì bỏ luôn required — đúng luật "chỉ bắt buộc khi KĐT KHCN"). Đầu mối nhận hồ sơ: table với dataSource FEEL lọc theo CQCM đang chọn, tính lại khi đổi lựa chọn.'],
    write: (v) => pick(v, ['cqcmSel', 'host']) };
  const BO_SUNG = { id: 'dtms-ms13-b23-53-bo-sung',
    schema: (h, tok) => ({ components: [txt(`### ${tok.task === 53 ? 'AI tóm tắt phản hồi và gợi ý điều chỉnh' : 'AI gợi ý thông tin cần chỉnh sửa'}\n{{goiYSua}}`), txt('### {{giaiDoan.title}}\n{{hoSoGd}}')] }),
    notes: (h, tok) => [tok.task === 53 ? 'Báo cáo kết quả thẩm định chưa được thông qua → AI tóm tắt phản hồi, gợi ý điều chỉnh (bước 52); ĐVĐX hoàn chỉnh hồ sơ rồi lập lại hồ sơ phê duyệt KĐT (bước 46).'
      : 'TTMS xác định hồ sơ chưa đủ điều kiện thẩm định → AI gợi ý thông tin cần chỉnh sửa (bước 22); ĐVĐX kiểm tra lại trước khi gửi lại TTMS.'] };
  const SAU_HOP = { id: 'dtms-ms13-b31-32-xac-nhan-sau-hop', q: ['P-55'],
    schema: () => ({ components: [tbl('Nội dung điều chỉnh đã thống nhất sau họp', 'dieuChinh', [['noiDung', 'Nội dung'], ['truoc', 'Trước họp'], ['sau', 'Sau họp (đã thống nhất)']]),
      txt('*{{ketLuanHop}}* · Họp {{soLanHop}}/2'), tbl('Xác nhận sau họp', 'xacNhanSauHop', [['nguoi', 'Người xác nhận'], ['vaiTro', 'Vai trò'], ['trangThai', 'Trạng thái']])] }),
    notes: () => ['Sau họp: Chuyên quản ĐVĐX xác nhận nội dung điều chỉnh, sau đó Chỉ huy ĐVĐX xác nhận lại. Chỉ khi đủ hai xác nhận, ĐVĐX mới được cập nhật hồ sơ (bước 33).'] };
  const KY_BM01 = { id: 'dtms-ms13-b42-44-ky-bm01', q: ['P-60', 'P-56', 'P-61'],
    schema: () => ({ components: [txt('### Kết quả thẩm định chủ trương\n**Kết luận:** Đủ điều kiện trình ký · **Phiên bản trình ký:** v{{phienBan}} · {{demVong}}\n**Cấp xử lý:** VHT — không cần ý kiến Tập đoàn'), tbl('Khối chữ ký BM-01', 'kyBm01', SIGN_COLS),
      txt('**BM-01** (bản trình ký) xem ở **Văn bản đầu ra**; Checklist 01, phiếu nhận xét BM-09, sở cứ giá, biên bản họp ở Danh sách tài liệu.')] }),
    outputs: () => ['BM-01'],
    notes: (h, tok) => [tok.task === 42 ? 'Hồ sơ đạt sau thẩm định: TTMS (và cấp phó phụ trách nếu có) ký thẩm định trực tiếp trên tờ trình BM-01 qua VOffice. Cấp xử lý VHT → Thủ trưởng ký duyệt (bước 44).'
      : 'Thủ trưởng VHT ký ô PHÊ DUYỆT trên tờ trình BM-01. Không ký (dialog nhận xét): chỉ đạo dừng → kết thúc; chỉ đạo xử lý → quay lại bước chọn hình thức hồ sơ (sau bước 16).'] };
  const KY_BM00 = { id: 'dtms-ms13-b55-56-ky-bm00', q: ['P-60', 'P-56'],
    schema: () => ({ components: [txt('### Kết quả thẩm định hồ sơ gộp\n**Kết luận:** CQCM thống nhất — đủ điều kiện trình ký · **Phiên bản trình ký:** v{{phienBan}} · {{demVong}}'), tbl('Khối chữ ký BM-00', 'kyBm00', SIGN_COLS),
      txt('**BM-00** (bản trình ký) xem ở **Văn bản đầu ra**; hồ sơ kèm theo ở Danh sách tài liệu.')] }),
    outputs: () => ['BM-00'],
    notes: (h, tok) => [tok.task === 55 ? 'Sau khi CQCM thống nhất, cấp xử lý VHT → Đơn vị đề xuất trình ký hồ sơ gộp BM-00 trên VOffice; cấp Tập đoàn → AI soạn công văn báo cáo TGĐ Tập đoàn (bước 57, chưa dựng).'
      : 'Thủ trưởng VHT ký chính thức hồ sơ gộp BM-00. Không ký → dialog nhận xét, hồ sơ quay lại bước chọn hình thức hồ sơ (sau bước 16).'] };

  const ALIAS = { chonCqcm: CHON_CQCM, boSung: BO_SUNG, sauHop: SAU_HOP, kyBm01: KY_BM01, kyBm00: KY_BM00 };
  /* Bước 5, 7, 8 dùng nguyên form MS01 (cùng nội dung bóc tách, tồn kho, YCBG). */
  const SAME = { 5: true, 7: true, 8: true };
  window.EForms.MS13 = (tok, h) => {
    if (SAME[tok.task]) return window.EForms.MS01(tok, h);
    const e = F[tok.task];
    return typeof e === 'string' ? ALIAS[e] : e || null;
  };
})();
