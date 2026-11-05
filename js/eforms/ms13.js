/*
 * eForm (Camunda Form schema) của các user task MS13 (hồ sơ Phê duyệt KĐT) — B0.4 (2), docs/dtms/prototype-B04-phan-loai-task.md §4.2.
 * Cùng khuôn với eforms/ms01.js (xem chú thích ở đó). Bước 1, 5, 7, 8 dùng lại form MS01 với căn cứ KĐT; bước 10 thêm nhãn KĐT.
 * Số bước theo BPMN bản 12/10 (78 bước, plan T18 §1): khối chung 25–38 dùng một form cho cả ba vòng thẩm định (giaiDoan theo vars.td).
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, tf, ta, dt, sel, rad, chkl, tags, req, grp, dl, opts } = B;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const SIGN_COLS = [['nguoiKy', 'Người ký'], ['tuCach', 'Tư cách'], ['trangThai', 'Trạng thái'], ['thoiDiem', 'Thời điểm']];
  /* T31 B4 (K5): kết luận theo SRS-KDT BR-KDT-08-04 / 05 — Đạt hoặc Cần sửa đổi, giải trình (không dùng Đồng ý / OK). */
  const KET_LUAN = opts(['Đạt', 'Cần sửa đổi, giải trình']);
  const NEED_FIX = 'Cần sửa đổi, giải trình';
  /* Bản ghi kết quả theo vòng / lượt / đơn vị cho Lịch sử ý kiến thẩm định (thẻ bốn khu, js/tham-dinh.js). */
  const hist = (tok, h, id, fix, rows) => ({ kdtTdHist: (window.Flow.ui.kdtTdHist || []).concat([{ td: h.tdKey(), luot: h.rvIdx(tok.task === 27), id, fix, rows }]) });
  const GHI_LAI = { draftLabel: 'Ghi lại', draftToast: '<b>Thành công</b><br>Đã ghi lại kết quả thẩm định. Hồ sơ vẫn ở trạng thái Đang thẩm định.' };
  const PEND_COLS = [['donVi', 'Đơn vị'], ['muc', 'Mục'], ['yKien', 'Ý kiến'], ['traLoi', 'Đơn vị đề xuất trả lời']];
  const CL_ROW = [txt('**{{this.tt}}**', 1), txt('{{if this.header then "**" + this.muc + "**" else this.muc}}', 6),
    txt('{{this.so}}', 3, '=this.header'), txt('{{this.yeuCau}}', 2, '=this.header'), txt('**{{this.tinhTrang}}**', 2, '=this.header'),
    tf('ghiChu', 'Ghi chú', { layout: { columns: 16 }, conditional: { hide: '=this.header or this.tinhTrang = "Đủ"' } })];
  const checklistKdt = (path, label) => dl(path, label, CL_ROW);
  /* Ghi kết luận TTMS / CQCM của lượt thẩm định vào ý kiến theo lượt (op['td-lượt-đơn vị'] — đọc ở cổng "Cần sửa đổi hoặc giải trình?"). */
  const writeOp = (id) => (v, tok, h) => {
    const op = Object.assign({}, window.Flow.ui.op);
    op[`${h.tdKey()}-${h.rvIdx(tok.task === 27)}-${id === 'cqcm' ? tok.cqcm : id}`] = v.ketLuanTd === NEED_FIX;
    return { op };
  };

  /* Khối ký chung 75–78 (D-34): ghi chú chung của các bước ký (P-91) và form của 76 (gửi lại), 77, 78. */
  const KY_NOTE = 'Nút ký mở hộp thoại Trình ký = bước 75 "Chọn hình thức ký" của khối ký chung (D-34; Camunda: call activity <code>DTMS_KY_CHUNG</code>, biến <code>hinhThucKy</code>, <code>mat</code>). '
    + 'Hồ sơ Mật → bắt buộc Bản cứng (bước 77 → 78); không Mật chọn VOffice (bước 76: gửi, callback trả trạng thái + PDF) hoặc Bản cứng. Có kết quả ký mới đi tiếp nhánh Đồng ý của bước này. '
    + 'Prototype gộp 75 vào hộp thoại của người bấm ký (điểm tự quyết B3-1).';
  const KY_HIST = tbl('Các lần ký đã qua khối ký chung', 'kyLichSu', [['buoc', 'Bước ký'], ['vanBan', 'Văn bản'], ['hinhThuc', 'Hình thức'], ['luc', 'Ngày']], '=count(kyLichSu) = 0');

  const F = {
    76: { id: 'dtms-ms13-b76-gui-lai-voffice', q: ['P-94'],
      schema: () => ({ components: [banner('Gửi VOffice không thành công — văn bản chưa được trình ký. Kiểm tra lại kết nối rồi bấm Gửi lại.'), txt('### Văn bản trình ký\n{{kyChung}}'), KY_HIST] }),
      notes: () => ['Bước 76 là service task (API gửi hồ sơ và luồng ký sang VOffice; webhook trả trạng thái + PDF đã ký, ĐTMS lưu tự động, không xác nhận thủ công). Bình thường không thành việc của ai.',
        'GIẢ LẬP P-94: gửi lỗi → việc "Gửi lại VOffice" cho người trình (thật: incident của job worker, retry). Từ chối ký trên VOffice = nhánh Không đồng ý của bước ký chính.'] },
    77: { id: 'dtms-ms13-b77-ky-ban-cung', q: ['P-60'],
      schema: () => ({ components: [txt('### Văn bản trình ký bản cứng\n{{kyChung}}'), ta('yKienXuLy', 'Ý kiến xử lý', { rows: 3 }), KY_HIST] }),
      notes: () => ['Bước 77: in và trình bản cứng theo đúng người ký, thứ tự ký của bước ký chính; hồ sơ Mật bắt buộc nhánh này (G1 "Hồ sơ Mật?"), không gửi qua VOffice.',
        'Đã xử lý ký → người phụ trách hồ sơ cập nhật kết quả, đính kèm bản scan (bước 78).'],
      write: (v) => pick(v, ['yKienXuLy']) },
    78: { id: 'dtms-ms13-b78-cap-nhat-ket-qua-ky', q: ['P-60'],
      schema: () => ({ components: [txt('### Kết quả ký bản cứng\n{{kyChung}}'),
        rad('trangThaiKy', 'Trạng thái', req({ values: opts(['Đã ký']), layout: { columns: 8 } })), ta('yKienXuLy', 'Ý kiến xử lý', { rows: 2 }),
        txt('Bản scan văn bản đã ký: tải lên ở **Danh sách tài liệu** (bắt buộc).'), KY_HIST] }),
      notes: () => ['Bước 78: người phụ trách hồ sơ cập nhật trạng thái, đính kèm bản scan, ý kiến xử lý. Hồ sơ Mật: lưu tài liệu trong phạm vi được phép theo quy định bảo mật.',
        'Đã lưu → G3 "Đã ghi nhận kết quả ký?" → trở về bước ký chính, đi tiếp nhánh Đồng ý. Bản scan là tài liệu bắt buộc theo hành động (E3), mỗi lần ký một tệp.'],
      write: (v) => pick(v, ['trangThaiKy', 'yKienXuLy']) },
    1: { id: 'dtms-ms13-b01-can-cu', q: ['P-59'],
      schema: () => ({ components: [
        sel('basisType', 'Loại căn cứ', req({ values: window.D.kdtBasisTypes.map((b) => ({ label: b.name, value: b.id })), layout: { columns: 8 } })),
        sel('basisDoc', 'Văn bản căn cứ đã phê duyệt', req({ valuesExpression: '=basisDocOptions[item.type = basisType]', searchable: true, layout: { columns: 8 } })),
        tbl('Văn bản căn cứ theo loại đã chọn', 'basisDocs[item.typeId = basisType]', [['so', 'Số'], ['ngay', 'Ngày'], ['loai', 'Loại'], ['trichYeu', 'Trích yếu'], ['giaTri', 'Giá trị (tỷ)'], ['conLai', 'Còn lại (tỷ)']]),
        tbl('Dòng dự toán đề tài / dự án đã bóc tách khi tạo KĐT', 'duToanChon', [['loai', 'Loại chi phí'], ['khoanMuc', 'Khoản mục chi phí'], ['dvt', 'ĐVT'], ['sl', 'Số lượng đề xuất'], ['giaTri', 'Giá trị dự tính (tỷ)'], ['duToan', 'Giá trị dự toán (tỷ)'], ['goiThau', 'Hình thành gói thầu']], '=count(duToanChon) = 0')] }),
      notes: () => ['T31 B3 (D-68): bảng "Dòng dự toán đề tài / dự án đã bóc tách khi tạo KĐT" là khối chỉ xem (loại 3) đọc biến <code>duToanChon</code> do BE ghi khi start từ các dòng bóc tách của KĐT (Thêm mới / Chỉnh sửa KĐT, SCR-55); ẩn khi không có dòng. Bước 05 hiện cùng bảng (form MS01).',
        'Căn cứ KĐT theo 3 loại: Kế hoạch SXKD / PAKD / đề tài hàng năm · Hợp đồng / thoả thuận hợp tác · Chỉ đạo Ban TGĐ (plan KĐT §4.1, UR-KDT-01). Văn bản căn cứ là options đọc từ biến (E1).',
        'Không lọc căn cứ theo quy trình: nhóm KĐT (MS13 / MS14 / MS15) do hệ thống xác định sau khi Ban Tài chính và TTMS xác nhận (D-7). Hoàn thành → task 02 lấy dữ liệu, task 03 AI gợi ý thông tin cơ bản KĐT.'],
      write: (v) => pick(v, ['basisType', 'basisDoc']) },

    4: { id: 'dtms-ms13-b04-thong-tin-co-ban', q: ['P-60'],
      schema: () => ({ components: [
        tf('tenDeXuat', 'Tên KĐT', req()),
        sel('fund', 'Nguồn vốn', req({ valuesKey: 'fundOptions', searchable: true, layout: { columns: 8 } })),
        rad('secret', 'Mật', req({ values: [{ label: 'Không', value: false }, { label: 'Có', value: true }], layout: { columns: 8 }, description: 'Mặc định theo khoản đầu tư.' })),
        B.aiTable('aiGoiY', 'Gợi ý AI từ căn cứ — Mục tiêu, sự cần thiết; Phạm vi, quy mô; Thời gian lấy theo quyết định ở đây')] }),
      notes: () => ['Lĩnh vực, Loại KĐT, Tính chất tài sản lấy từ khoản đầu tư — hiện ở Thông tin chung (khoá), là 3 trong 04 yếu tố phân luồng; yếu tố thứ tư là tổng mức vốn thực tế chốt sau báo giá (task 10).',
        'Không có Mức ưu tiên (từ điển dữ liệu KĐT §4.1). Hồ sơ Mật (biến <code>mat</code>): các bước ký bắt buộc bản cứng qua khối ký chung 75–78 (D-34).', 'Gợi ý AI (G2): như task 04 của MS01 — bảng quyết định Chấp nhận / Sửa / Bỏ theo từng mục.'],
      write: (v) => pick(v, ['secret']) },

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
        '"Không OK" mở dialog nhận xét (lý do bắt buộc — G6) → AI gợi ý thông tin cần chỉnh sửa (task 14) → ĐVĐX tổng hợp lại báo giá ở task 10. Cả hai OK → xác định thẩm quyền phê duyệt (task 13, service).'],
      write: (v) => pick(v, ['tscd', 'tscdNote']) },

    12: { id: 'dtms-ms13-b12-xac-nhan-yeu-to', q: ['P-51', 'P-52', 'P-56', 'P-28'],
      schema: () => ({ components: [
        dl('yeuTo', 'Xác nhận 04 yếu tố định danh', [txt('**{{this.yeuTo}}**', 4), txt('{{this.giaTri}}', 6), txt('*Nguồn: {{this.nguon}}*', 4), B.chk('dung', 'Đúng', { layout: { columns: 2 } })]),
        txt('**Xác nhận hình thành TSCĐ (Ban Tài chính):** {{tscdKetQua}}'),
        banner('{{phanLuong.canhBao}}', '=phanLuong.ms13'),
        txt('### Kết quả phân luồng\n**Nhóm khoản đầu tư:** {{phanLuong.nhom}} · **Ngưỡng MS13 áp dụng:** {{phanLuong.nguong}} · **Nhánh hồ sơ:** {{phanLuong.nhanh}}'),
        tbl('Điều kiện gộp hồ sơ (BM-00)', 'mergeConds', [['dieuKien', 'Điều kiện'], ['ketQua', 'Kết quả']], '=not(phanLuong.ms13)'),
        txt('*Báo giá chưa đạt yêu cầu: sau khi đủ hai xác nhận, hồ sơ quay lại bước lập yêu cầu báo giá.*', 16, '=not(phanLuong.baoGiaChuaDat)')] }),
      notes: () => ['TTMS đối chiếu 04 yếu tố định danh: Lĩnh vực, Loại KĐT, Tính chất tài sản (khoản đầu tư) và tổng mức vốn thực tế (báo giá đã chốt ở task 10).',
        'Bỏ chọn "Đúng" ở yếu tố sai thì phải chọn "Không OK" (dialog nhận xét): nút "Xác nhận OK" mở form, BE từ chối submit khi còn yếu tố bỏ chọn (cùng cơ chế G3) — P-52.',
        'Kết quả phân luồng, điều kiện gộp = DMN (business rule task) đọc Ngưỡng phân luồng (VT-CNTT < 160 tỷ, lĩnh vực khác < 90 tỷ — P-28) → biến <code>kdtGroup</code>, <code>mergeConds</code> (S6). Gộp BM-00 khi đủ 03 điều kiện (P-51). Cấp duyệt chủ trương / KĐT do bước 13 xác định sau hai xác nhận (D-33, P-90).'],
      write: (v) => { const bad = {}; (v.yeuTo || []).forEach((r) => { if (!r.dung) bad[r.key] = true; }); return { factorBad: bad }; } },

    15: { id: 'dtms-ms13-b15-du-thao',
      schema: () => ({ components: [B.aiTable('aiDuThao', 'Mục do AI gợi ý từ thông tin cơ bản'),
        txt('**Tổng mức vốn thực tế (gồm VAT):** {{tongMucVon}} tỷ đồng · **Hàng tồn kho sử dụng:** {{tonKhoKdt}}'),
        tf('nguonVonKdt', 'Nguồn vốn', req({ layout: { columns: 8 } })), tf('thoiGianKdt', 'Thời gian thực hiện', req({ layout: { columns: 8 } })),
        ta('bienPhapKdt', 'Biện pháp, kế hoạch thực hiện')] }),
      notes: () => ['Nội dung dự thảo lấy từ thông tin cơ bản (bước 04) và tổng mức vốn thực tế đã chốt (bước 10). Hoàn thành → AI hỗ trợ soạn nội dung (bước 16) → ĐVĐX rà soát, hoàn thiện (bước 17).'],
      write: (v) => pick(v, ['aiDuThao', 'nguonVonKdt', 'thoiGianKdt', 'bienPhapKdt']) },

    17: { id: 'dtms-ms13-b17-hoan-thien', q: ['P-51', 'P-90'],
      schema: () => ({ components: [B.aiTable('aiSoan', 'AI hỗ trợ soạn nội dung đề xuất'), txt('### Hình thức hồ sơ\n{{hinhThuc}}'), txt('### Thẩm quyền phê duyệt\n{{thamQuyen}}')] }),
      notes: () => ['G2: mặc định Chấp nhận = "Áp dụng tất cả" của bản cũ. Hoàn thiện → DMN kiểm tra 03 điều kiện gộp: đủ → văn bản gộp BM-00 (bước 18); còn lại → Tờ trình chủ trương BM-01 (bước 39) rồi hồ sơ KĐT BM-03.',
        'Thẩm quyền phê duyệt = kết quả bước 13 (service task đọc danh mục Phân cấp thẩm quyền KĐT — D-33), chỉ xem; hệ thống tính lại ở cổng cấp duyệt trước khi trình ký.'],
      write: (v) => Object.assign(pick(v, ['aiSoan']), { kAi: (v.aiSoan || []).every((r) => r.quyetDinh === 'Chấp nhận') }) },

    19: { id: 'dtms-ms13-b19-bm00', q: ['P-50'],
      schema: () => ({ components: [tbl('AI hỗ trợ lập dự thảo văn bản gộp', 'bm00Nguon', [['phan', 'Phần'], ['nguon', 'Nguồn'], ['trangThai', 'Trạng thái']]),
        grp('Nội dung sửa được của BM-00', [ta('mucTieuK', 'Mục tiêu đầu tư'), ta('suCanThietK', 'Sự cần thiết', req()), ta('toChucK', 'Tổ chức thực hiện')]),
        txt('Văn bản gộp **BM-00** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-00'],
      notes: () => ['Đủ 03 điều kiện gộp → chủ trương và KĐT lập chung một văn bản BM-00 (mẫu giả — P-50). AI lập dự thảo từ căn cứ, kết quả tồn kho, báo giá (bước 18); ĐVĐX rà soát, sửa trước khi xin ý kiến Chỉ huy.',
        'TGĐ VHT không ký hồ sơ gộp (bước 62) → hồ sơ quay lại bước này để sửa BM-00.'],
      write: (v) => pick(v, ['mucTieuK', 'suCanThietK', 'toChucK']) },
    20: { id: 'dtms-ms13-b20-xin-y-kien', q: ['P-50'],
      schema: () => ({ components: [txt('**Người cho ý kiến:** {{nguoiChoYKien}}'), txt('Văn bản gộp **BM-00** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-00'], notes: () => ['ĐVĐX gửi dự thảo văn bản gộp BM-00 xin ý kiến Chỉ huy ĐVĐX trước khi chọn CQCM.'] },
    21: { id: 'dtms-ms13-b21-y-kien-chi-huy', q: ['P-50', 'P-92'],
      schema: () => ({ components: [txt('Văn bản gộp **BM-00** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.'), ta('yKienChiHuy', 'Ý kiến của Chỉ huy đơn vị đề xuất', req({ rows: 4 }))] }),
      outputs: () => ['BM-00'],
      notes: () => ['BPMN không có cổng đồng ý / không đồng ý ở bước này (P-92): ĐVĐX tiếp thu, hoàn thiện theo ý kiến trước khi chọn CQCM (bước 22).'],
      write: (v) => pick(v, ['yKienChiHuy']) },

    22: 'chonCqcm', 41: 'chonCqcm', 52: 'chonCqcm',
    23: 'xacNhanDs', 42: 'xacNhanDs', 53: 'xacNhanDs',

    24: { id: 'dtms-ms13-b24-ky-phieu-yeu-cau', q: ['P-91'],
      schema: () => ({ components: [txt('### Phiếu yêu cầu thẩm định hồ sơ gộp\n**Hồ sơ:** Văn bản gộp BM-00 v{{phienBan}} · {{chuTri}}'),
        tbl('CQCM phối hợp thẩm định (đã được xác nhận)', 'dsCqcm', [['donVi', 'Đơn vị'], ['chucNang', 'Nội dung thẩm định'], ['nguoi', 'Người xử lý']]),
        tbl('Khối chữ ký', 'kyPhieu', SIGN_COLS),
        txt('**Phiếu yêu cầu thẩm định** và văn bản gộp **BM-00** xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['PYC', 'BM-00'],
      notes: () => ['Bước mới của BPMN 12/10: sau khi CQCM chủ trì xác nhận danh sách CQCM (bước 23), Chỉ huy ĐVĐX ký phiếu yêu cầu thẩm định → mở vòng thẩm định hồ sơ gộp (vòng BM-00) ở khối chung 25–38.',
        KY_NOTE] },

    /* Khối chung 25–38 (D-32): cùng form cho mọi vòng, nội dung theo vòng (giaiDoan). */
    26: 'boSung', 59: 'boSung',
    27: Object.assign({ id: 'dtms-ms13-b27-ttms-tham-dinh', q: ['P-54'] }, GHI_LAI, {
      schema: () => ({ components: [
        banner('{{banner27}}', '=banner27 = "" or banner27 = null', 'moved'),
        txt('### Rà soát tính hợp lệ · {{giaiDoan.title}} · {{demVong}}\n{{raSoat}}'),
        txt('**Thẩm định nội dung hồ sơ** — lượt {{luot}}'),
        dl('thamDinh', '', [txt('{{this.stt}}. {{this.noiDung}}', 10), rad('danhGia', 'Đánh giá', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 6 } })),
          ta('nhanXet', 'Nội dung nhận xét', req({ rows: 2, layout: { columns: 8 }, conditional: { hide: '=this.danhGia = "Đạt"' } })),
          ta('huongDan', 'Hướng dẫn sửa', { rows: 2, layout: { columns: 8 }, conditional: { hide: '=this.danhGia = "Đạt"' } })]),
        ta('nhanXetTtms', 'Nhận xét chung của TTMS'),
        txt('**Kết luận: Đạt** — mọi nội dung thẩm định Đạt.', 16, '=count(thamDinh[item.danhGia = "Không đạt"]) > 0'),
        txt('**Kết luận: Cần sửa đổi, giải trình** — {{count(thamDinh[item.danhGia = "Không đạt"])}} nội dung Không đạt, bắt buộc nhập nội dung nhận xét.', 16, '=count(thamDinh[item.danhGia = "Không đạt"]) = 0'),
        tbl('Ý kiến các lượt trước', 'yKienTruoc', [['luot', 'Lượt'], ['donVi', 'Đơn vị'], ['noiDung', 'Nội dung cần sửa'], ['traLoi', 'Đơn vị đề xuất trả lời']], '=count(yKienTruoc) = 0')] }),
      notes: (h) => ['Khối chung 25–38 dùng cho cả ba vòng (BM-00 / BM-01 / BM-03 — D-32): cổng "Hồ sơ đủ điều kiện thẩm định?" do hệ thống kiểm tra khi mở vòng (chưa đủ → AI gợi ý, ĐVĐX sửa ở bước 26 rồi chọn lại CQCM của vòng). Đủ → TTMS thẩm định; có CQCM phối hợp → hệ thống gửi hồ sơ (bước 28–29).',
        'Danh sách CQCM đã được CQCM chủ trì xác nhận ở bước 23 / 42 / 53 — bước này không còn nút trả lại danh sách. Bộ đếm vòng check / lần họp do engine tăng (script task), đếm riêng cho từng vòng. Kết luận "Cần sửa đổi, giải trình" là biến cổng "Cần sửa đổi hoặc giải trình?".',
        'T31 B4 (IA-DXMS dòng 19–22, BR-KDT-08-04): mỗi nội dung thẩm định Đạt / Không đạt; Không đạt bắt buộc Nội dung nhận xét, có Hướng dẫn sửa; Kết luận do hệ thống tính (Đạt khi mọi nội dung Đạt). Ghi lại = Lưu nháp, hồ sơ giữ Đang thẩm định.'],
      write: (v, tok, h) => {
        const bad = (v.thamDinh || []).filter((r) => r.danhGia === 'Không đạt'), w = Object.assign({}, v, { ketLuanTd: bad.length ? NEED_FIX : 'Đạt' });
        return Object.assign(pick(v, ['thamDinh', 'nhanXetTtms']), writeOp('TTMS')(w, tok, h),
          hist(tok, h, 'TTMS', !!bad.length, bad.map((r) => ({ muc: r.noiDung, text: r.nhanXet || '', guide: r.huongDan || '' }))));
      } }),
    29: Object.assign({ id: 'dtms-ms13-b29-cqcm-y-kien' }, GHI_LAI, {
      schema: (h) => ({ components: [txt('### AI gợi ý phản hồi\n{{aiPhanHoi}}'),
        txt('**{{cqcmTen}}** · Lượt {{luot}} · Hồ sơ v{{phienBan}}'),
        dl('phieuNhanXet', `Phiếu nhận xét (${h.stg().cq})`, [txt('**{{this.muc}}**', 3), ta('nhanXet', 'Nhận xét', { rows: 2, layout: { columns: 7 } }), ta('huongDan', 'Hướng dẫn sửa', { rows: 2, layout: { columns: 6 } })]),
        rad('ketLuanTd', 'Kết luận', req({ values: KET_LUAN }))] }),
      notes: (h) => [`CQCM phối hợp gửi ý kiến trực tiếp cho ĐVĐX và TTMS (không phát hành công văn đề nghị phối hợp riêng); phiếu nhận xét theo ${h.stg().cq}. Multi-instance theo CQCM.`,
        'Một CQCM kết luận cần sửa → ĐVĐX bổ sung hoặc giải trình (bước 31).',
        'T31 B4 (IA-DXMS dòng 19–22, BR-KDT-08-05): Kết luận Đạt / Cần sửa đổi, giải trình; Ghi lại = Lưu nháp. Thẻ thẩm định trên màn việc: CQCM phối hợp chỉ thấy kết quả của cơ quan mình (BR-KDT-08-06).'],
      write: (v, tok, h) => Object.assign(pick(v, ['phieuNhanXet']), writeOp('cqcm')(v, tok, h),
        hist(tok, h, tok.cqcm, v.ketLuanTd === NEED_FIX, (v.phieuNhanXet || []).filter((r) => r.nhanXet).map((r) => ({ muc: r.muc, text: r.nhanXet, guide: r.huongDan || '' })))) }),
    31: { id: 'dtms-ms13-b31-giai-trinh', q: ['P-54'],
      schema: () => ({ components: [banner('{{chiDao}}', '=chiDao = ""', 'moved'),
        txt('### AI tổng hợp {{soNoiDung}} nội dung cần sửa đổi, giải trình · {{demVong}}\n{{aiTongHop}}'),
        dl('traLoi', 'Bảng tiếp thu, giải trình ý kiến', [txt('**{{this.donVi}}** · {{this.muc}}', 4), txt('{{this.yKien}}', 5), ta('traLoi', 'Nội dung trả lời', req({ rows: 3, layout: { columns: 7 } }))])] }),
      notes: () => ['ĐVĐX tiếp thu, bổ sung toàn bộ → TTMS thẩm định lại (bước 27); còn giải trình, bảo lưu ý kiến → nội dung chưa thống nhất, TTMS tổ chức họp (tối đa 02 lần mỗi vòng).'],
      write: (v) => pick(v, ['traLoi']) },
    32: { id: 'dtms-ms13-b32-hop', q: ['P-54'],
      schema: () => ({ components: [txt('### Chưa thống nhất sau {{soVongCheck}} vòng check — tổ chức họp lần {{lanHop}}/2\nĐã gửi yêu cầu họp tới đơn vị đề xuất và các CQCM phối hợp. {{demVong}}'),
        dt('thoiGianHop', 'Thời gian', req({ layout: { columns: 8 } })), tf('diaDiemHop', 'Địa điểm', req({ layout: { columns: 8 } })),
        tags('thanhPhanHop', 'Thành phần', req({ valuesKey: 'nguoiDungOptions' })),
        tbl('Nội dung chưa thống nhất', 'noiDungChuaTn', PEND_COLS),
        txt('Biên bản họp: tải lên ở **Danh sách tài liệu** (bắt buộc).'),
        ta('ketLuanHop', 'Kết luận', req())] }),
      notes: () => ['Tối đa 02 lần họp cho mỗi vòng; hệ thống ghi nhận lần họp và kết quả (bước 33). Chặn họp lần 3 = gateway theo biến bộ đếm (đã có ở BPMN, P-54).', 'E3: Biên bản họp là tài liệu bắt buộc (G7). "Chưa thống nhất" mở dialog nhận xét.'],
      write: (v) => pick(v, ['thoiGianHop', 'diaDiemHop', 'thanhPhanHop', 'ketLuanHop']) },
    34: 'sauHop', 35: 'sauHop',
    36: { id: 'dtms-ms13-b36-cap-nhat',
      schema: () => ({ components: [txt(`### Đủ xác nhận sau họp\n- ${window.UI.persona('minh').name} — Chuyên quản ĐVĐX: đã xác nhận.\n- ${window.UI.persona('hai').name} — Chỉ huy ĐVĐX: đã xác nhận.`),
        tbl('Cập nhật hồ sơ theo nội dung đã xác nhận', 'dieuChinh', [['noiDung', 'Nội dung'], ['truoc', 'Trước họp'], ['sau', 'Sau họp (đã thống nhất)']]),
        txt('Hệ thống tạo phiên bản v{{phienBan + 1}} khi gửi.')] }),
      notes: () => ['Đã đủ xác nhận của Chuyên quản và Chỉ huy ĐVĐX: cập nhật hồ sơ theo nội dung đã thống nhất, hệ thống tạo phiên bản mới và chuyển TTMS thẩm định lại (bước 27).'] },
    37: { id: 'dtms-ms13-b37-bao-cao',
      schema: () => ({ components: [txt('### Đã họp đủ 02 lần, vẫn chưa thống nhất\nKhông được tổ chức họp lần thứ 3. {{demVong}}'), tbl('Báo cáo nội dung chưa thống nhất', 'noiDungChuaTn', PEND_COLS),
        txt('**Biên bản họp** (Danh sách tài liệu):\n{{bienBan}}')] }),
      notes: () => ['Đã họp đủ 02 lần vẫn chưa thống nhất → CQCM chủ trì (TTMS) báo cáo người có thẩm quyền xem xét, kết luận (bước 38).'] },
    38: { id: 'dtms-ms13-b38-ket-luan', q: ['P-61'], reasonField: 'ketLuanTt',
      schema: () => ({ components: [tbl('Báo cáo của TTMS — nội dung chưa thống nhất', 'noiDungChuaTn', PEND_COLS), txt('**Biên bản họp** (Danh sách tài liệu):\n{{bienBan}}'),
        ta('ketLuanTt', 'Nội dung kết luận', req({ rows: 4 }))] }),
      notes: () => ['TGĐ VHT xem xét, kết luận: chỉ đạo xử lý tiếp → ĐVĐX bổ sung / giải trình theo kết luận (bước 31); chỉ đạo dừng → kết thúc hồ sơ "Dừng theo chỉ đạo". Kết luận là trường của form (cả hai nút).'] },

    39: { id: 'dtms-ms13-b39-to-trinh-bm01', q: ['P-62'],
      schema: () => ({ components: [
        banner('Kiểm tra hồ sơ trước khi gửi: Không đạt — {{aiCheckK.lyDo}} Hồ sơ được trả về để hoàn thiện.', '=aiCheckK = null'),
        grp('Tờ trình chủ trương KĐT (BM-01) — nội dung các mục', [ta('mucTieuK', '4.1. Mục đích, mục tiêu', req()), B.aiTable('aiSuCanThietK', '4.2. Sự cần thiết (gợi ý AI)'),
          ta('phuongPhapK', '5.2. Phương pháp tính toán'), ta('hieuQuaK', '7. Đánh giá hiệu quả', { description: 'Nếu cần (BM-8.6.5).' }), ta('toChucK', 'II. Tổ chức thực hiện')]),
        tbl('Phụ lục danh mục', 'phuLucDanhMuc', [['n', 'STT'], ['hang', 'Hàng hoá / dịch vụ'], ['sl', 'SL mua'], ['donGia', 'Đơn giá (tỷ)'], ['thanhTien', 'Thành tiền (tỷ)'], ['loai', 'Loại chi phí']]),
        tbl('Checklist số 01', 'checklist01', [['tt', 'TT'], ['muc', 'Danh mục hồ sơ'], ['so', 'Số văn bản'], ['yeuCau', 'Yêu cầu'], ['tinhTrang', 'Tình trạng'], ['ghiChu', 'Ghi chú']]),
        txt('Tờ trình **BM-01** hoàn chỉnh (mẫu Word + dữ liệu form) xem ở **Văn bản đầu ra**; căn cứ, eBOM, kết quả tồn kho, báo giá ở Danh sách tài liệu.')] }),
      outputs: () => ['BM-01'],
      notes: () => ['Tờ trình chủ trương KĐT (ký trực tiếp) BM-01 theo bộ biểu mẫu KĐT (BM-8.6.5): TGĐ VHT ký ô PHÊ DUYỆT ngay trên tờ trình, cơ quan chủ trì thẩm định ký thẩm định trên cùng văn bản.',
        'Cổng "AI kiểm tra đạt?" (sau bước 44, BPMN 12/10 — trước là DX-01) Không đạt → hồ sơ về bước này, banner hiện lý do (biến <code>aiCheckK</code>, P-62). TGĐ VHT không ký chủ trương, chỉ đạo xử lý tiếp → hồ sơ cũng quay về đây (qua cổng gộp).',
        'G4: tab của bản cũ tách thành nội dung từng mục (trường form), Phụ lục và Checklist 01 (khối chỉ xem), văn bản hoàn chỉnh ở Văn bản đầu ra, tệp ở Danh sách tài liệu.',
        'T31 B3 (K4b, IA-DXMS dòng 16): thêm mục <b>7. Đánh giá hiệu quả</b> của BM-01 (BM-8.6.5 — "nếu cần") thành trường sửa được; mặc định theo dữ liệu hồ sơ.'],
      write: (v) => Object.assign(pick(v, ['mucTieuK', 'aiSuCanThietK', 'phuongPhapK', 'hieuQuaK', 'toChucK']), { kNeed: !!window.EVars.h.aiFinal((v.aiSuCanThietK || [])[0]) }) },
    40: { id: 'dtms-ms13-b40-kiem-tra-cl01',
      schema: () => ({ components: [txt('**Đại diện đơn vị kiểm tra:** Phòng Kế hoạch – Tổng hợp, Trung tâm Vô tuyến · **Đại diện đơn vị lập hồ sơ:** Nguyễn Văn Minh'),
        checklistKdt('checklist01', 'Checklist số 01 — Kiểm tra hồ sơ trình phê duyệt chủ trương KĐT đơn giản'), ta('ketLuanCl', 'Kết luận', req())] }),
      outputs: () => ['BM-01'],
      notes: () => ['Đầu mối kiểm tra độc lập của đơn vị kiểm tra tính đầy đủ, hợp lệ theo Checklist 01; không xoá dòng khi thiếu tài liệu, ghi rõ lý do ở cột Ghi chú (BM-8.6.5). Tình trạng do BE tính theo tài liệu đã có.'],
      write: (v) => pick(v, ['checklist01', 'ketLuanCl']) },
    43: { id: 'dtms-ms13-b43-trinh', q: ['P-62', 'P-57'],
      schema: () => ({ components: [
        tbl('Đầu mối nhận hồ sơ', 'dsDauMoi[item.ma = "TTMS" or list contains(cqcmSel, item.ma)]', [['nguoi', 'Người nhận'], ['vaiTro', 'Vai trò'], ['donVi', 'Đơn vị']]),
        B.aiTable('aiSuCanThietK', 'Mục bắt buộc của Tờ trình BM-01 (gợi ý AI)'),
        txt('Tờ trình chủ trương **BM-01** (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-01'],
      notes: () => ['Trình hồ sơ → HT/AI kiểm tra (bước 44) → cổng "AI kiểm tra đạt?": Không đạt → về lập tờ trình (bước 39, banner lý do); Đạt → mở vòng thẩm định chủ trương (bước 45) ở khối chung 25–38.',
        'Bản 12/10 vẽ nhánh Không đạt trên BPMN (trước là DX-01): form không chặn gửi, kết quả kiểm tra là biến của service task 44 (giả lập: tờ trình thiếu mục "Sự cần thiết" ở lần trình đầu).'],
      write: (v) => Object.assign(pick(v, ['aiSuCanThietK']), { kNeed: !!window.EVars.h.aiFinal((v.aiSuCanThietK || [])[0]) }),
      gate: (out) => (out.kNeed || window.Flow.doneCount(43) > 0 ? null : { key: 'aiCheckK', pass: true, lyDo: 'Tờ trình BM-01 thiếu mục bắt buộc “Sự cần thiết” (mục 4.2).',
        toast: 'Kiểm tra hồ sơ trước khi gửi: Không đạt — Tờ trình BM-01 thiếu mục “Sự cần thiết”. Hồ sơ được trả về để hoàn thiện.' }) },

    46: 'hoanChinh', 55: 'hoanChinh',
    47: 'kyBm01', 48: 'kyBm01',

    50: { id: 'dtms-ms13-b50-ho-so-kdt',
      schema: () => ({ components: [banner('{{traLai57}}', '=traLai57 = ""', 'moved'),
        tbl('AI gợi ý từ chủ trương đã phê duyệt', 'keThua', [['noiDung', 'Nội dung'], ['tu', 'Kế thừa từ'], ['trangThai', 'Trạng thái']]), txt('*{{chuTruong}}*'),
        grp('1. Mục đích / mục tiêu, sự cần thiết (Phụ lục thuyết minh mục 1)', [ta('hienTrang', 'Đánh giá hiện trạng'), ta('phanTichNhuCau', 'Phân tích nhu cầu'),
          ta('ketLuanCanThiet', 'Kết luận về sự cần thiết')]),
        tbl('Kết quả rà soát tồn kho (chỉ xem)', 'ruaSoatKho', [['name', 'Hàng hoá'], ['prop', 'SL đề xuất'], ['avail', 'Tồn kho khả dụng'], ['fromStock', 'Lấy từ kho']]),
        grp('2. Phương án thiết kế công nghệ, giải pháp triển khai', [ta('quanDiem', 'Quan điểm, định hướng'), ta('phuongAnTk', 'Phương án thiết kế'),
          tf('diaDiem', 'Địa điểm đầu tư', { layout: { columns: 8 } }), ta('giaiPhap', 'Giải pháp triển khai'), ta('ruiRo', 'Rủi ro')]),
        grp('3. Tổng mức vốn, quy mô, hiệu quả', [ta('phuongPhapTinh', 'Phương pháp tính, cơ sở đơn giá'), ta('danhGiaHieuQua', 'Đánh giá hiệu quả', { description: 'Nếu cần (BM-8.6.5).' })]),
        grp('4. Tổ chức thực hiện', [ta('toChucTh', 'Tổ chức thực hiện'), ta('cacMoc', 'Các mốc thời gian chính', { description: 'Mỗi dòng một mốc: phê duyệt KĐT, KHLCNT, nghiệm thu.' })]),
        tbl('Checklist số 02', 'checklist02', [['tt', 'TT'], ['muc', 'Danh mục hồ sơ'], ['so', 'Số văn bản'], ['yeuCau', 'Yêu cầu'], ['tinhTrang', 'Tình trạng'], ['ghiChu', 'Ghi chú']]),
        txt('Tờ trình **BM-03** và **Phụ lục thuyết minh** (mẫu Word + dữ liệu form) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-03', 'PL-TM'],
      notes: () => ['AI tổng hợp, gợi ý từ chủ trương đã được TGĐ VHT ký duyệt (bước 48, AI ở bước 49) để lập Tờ trình thẩm định, phê duyệt KĐT BM-03 và Checklist 02; ĐVĐX rà soát, bổ sung hồ sơ.',
        'Quay lại bước này khi: báo cáo thẩm định chưa được thông qua (57 → 58 → 59), hoặc TGĐ VHT không ký Quyết định BM-18 (bước 60).', 'G4: tab của bản cũ tách thành trường form + khối chỉ xem + Văn bản đầu ra + Danh sách tài liệu.',
        'T31 B3 (K4b, D-67): mục của Tờ trình BM-03 và Phụ lục thuyết minh theo <b>BM-8.6.5</b>, xếp theo 5 nhóm của IA-DXMS dòng 14–18 — (14) Lý do cần thiết: Đánh giá hiện trạng, <b>Phân tích nhu cầu</b>, <b>Kết luận về sự cần thiết</b> + khối chỉ xem Kết quả rà soát tồn kho (bước 07; "Đánh giá tồn kho" của IA không phải mục BM); (15) Quan điểm: <b>Quan điểm, định hướng</b>, <b>Phương án thiết kế</b>, Địa điểm, <b>Giải pháp triển khai</b>; (16) Nội dung đề xuất: hạng mục, tổng mức vốn từ bước 05–10, <b>Phương pháp tính, cơ sở đơn giá</b>, <b>Đánh giá hiệu quả</b>; (17) Biện pháp, kế hoạch: <b>Tổ chức thực hiện</b>, <b>Các mốc thời gian chính</b>; (18) Hồ sơ kèm theo: Checklist 02 + phụ lục tải lên theo <b>Loại tài liệu</b> ở Danh sách tài liệu (không bắt buộc, như F7 của ĐXMS; không cố định 6 ô Có / Không). "Rủi ro" không có trong BM-03 — giữ theo prototype cũ. Mặc định của các trường lấy từ chủ trương đã duyệt và dữ liệu hồ sơ (GIẢ LẬP).'],
      write: (v) => pick(v, ['diaDiem', 'hienTrang', 'ruiRo', 'phanTichNhuCau', 'ketLuanCanThiet', 'quanDiem', 'phuongAnTk', 'giaiPhap', 'phuongPhapTinh', 'danhGiaHieuQua', 'toChucTh', 'cacMoc']) },
    51: { id: 'dtms-ms13-b51-kiem-tra-cl02',
      schema: () => ({ components: [txt('**Đại diện đơn vị kiểm tra:** Phòng Kế hoạch – Tổng hợp, Trung tâm Vô tuyến · **Đại diện đơn vị lập hồ sơ:** Nguyễn Văn Minh'),
        checklistKdt('checklist02', 'Checklist số 02 — Kiểm tra hồ sơ trình thẩm định, phê duyệt KĐT đơn giản'), ta('ketLuanCl', 'Kết luận', req())] }),
      outputs: () => ['BM-03', 'PL-TM'],
      notes: () => ['Đầu mối kiểm tra độc lập của đơn vị kiểm tra tính đầy đủ, hợp lệ của hồ sơ KĐT theo Checklist 02 rồi chọn CQCM thẩm định (bước 52); không xoá dòng khi thiếu tài liệu (BM-8.6.5).'],
      write: (v) => pick(v, ['checklist02', 'ketLuanCl']) },
    56: { id: 'dtms-ms13-b56-ky-to-trinh-bm03', q: ['P-91'],
      schema: () => ({ components: [txt('### Kết quả thẩm định KĐT\n{{ketQuaTd}}'), tbl('Khối chữ ký Tờ trình BM-03', 'kyBm03', SIGN_COLS),
        txt('Tờ trình **BM-03** và **Phụ lục thuyết minh** (bản trình ký) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-03', 'PL-TM'],
      notes: () => ['Bước mới của BPMN 12/10: cấp duyệt KĐT là VHT (cổng sau bước 55 tính lại thẩm quyền) → Chỉ huy ĐVĐX ký tờ trình phê duyệt KĐT BM-03 trước khi TTMS lập báo cáo thẩm định BM-14 (bước 57).', KY_NOTE] },
    57: 'bm14', 61: 'bm14',
    60: { id: 'dtms-ms13-b60-ky-bm18', q: ['P-60', 'P-61'],
      schema: () => ({ components: [txt('### Kết quả thẩm định KĐT\n{{ketQuaTd}}'), tbl('Khối chữ ký', 'kyBm18', SIGN_COLS), txt('**BM-18** (bản trình ký) và **BM-14** xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-18', 'BM-14'],
      notes: () => ['TGĐ VHT ký ban hành Quyết định BM-18. Không đồng ý → dialog nhận xét, hồ sơ quay lại lập hồ sơ phê duyệt KĐT BM-03 (bước 50).', KY_NOTE] },
    62: { id: 'dtms-ms13-b62-ky-bm00', q: ['P-60', 'P-50'],
      schema: () => ({ components: [txt('### Kết quả thẩm định hồ sơ gộp\n{{ketQuaTd}}'), tbl('Khối chữ ký BM-00', 'kyBm00', SIGN_COLS),
        txt('**BM-00** (bản trình ký), **BM-14** và dự thảo **BM-18** xem ở **Văn bản đầu ra**; hồ sơ kèm theo ở Danh sách tài liệu.')] }),
      outputs: () => ['BM-00', 'BM-18', 'BM-14'],
      notes: () => ['TGĐ VHT ký phê duyệt hồ sơ gộp BM-00 và ban hành Quyết định BM-18 (bản 12/10: BM-00 dùng BM-14 + BM-18). Không đồng ý → dialog nhận xét, hồ sơ quay lại lập BM-00 (bước 19).', KY_NOTE] },

    /* Tuyến Tập đoàn 63–74 (T18 B4): một bộ form cho cả ba loại hồ sơ trình (chủ trương BM-01 / KĐT BM-03 / gộp BM-00 — biến tdKind). */
    64: { id: 'dtms-ms13-b64-cong-van-tap-doan', q: ['P-96'],
      schema: () => ({ components: [txt('{{tdHoSo}}'),
        tf('trichYeuCv', 'Trích yếu công văn', req()), ta('noiDungCv', 'Nội dung đề nghị', req({ rows: 4 })),
        tbl('Bộ hồ sơ gửi Tập đoàn', 'boHoSoTd', [['taiLieu', 'Tài liệu'], ['tinhTrang', 'Tình trạng']]),
        txt('**Công văn trình Tập đoàn** (AI dự thảo ở bước 63) và dự thảo hồ sơ xem ở **Văn bản đầu ra**.')] }),
      outputs: (h) => ['CV-TD', h.tdk().code],
      notes: () => ['Cổng cấp duyệt (sau 46 / 55 / vòng BM-00) tính lại thẩm quyền theo danh mục Phân cấp thẩm quyền KĐT ra Tập đoàn → AI hỗ trợ dự thảo công văn và tập hợp dự thảo hồ sơ (bước 63, service) → ĐVĐX rà soát, hoàn thiện ở bước này.',
        'Giai đoạn thẩm định tại VHT không ký: TGĐ VHT ký công văn trình (bước 65) là ký trình, không phải VHT phê duyệt thay Tập đoàn. TGĐ VHT không đồng ý → quay lại bước này.'],
      write: (v) => pick(v, ['trichYeuCv', 'noiDungCv']) },
    65: { id: 'dtms-ms13-b65-ky-cong-van', q: ['P-91', 'P-99'],
      schema: () => ({ components: [txt('{{tdHoSo}}'), txt('**Trích yếu:** {{trichYeuCv}}'), tbl('Khối chữ ký công văn', 'kyCv', SIGN_COLS),
        txt('**Công văn trình Tập đoàn** (bản trình ký) và dự thảo hồ sơ xem ở **Văn bản đầu ra**.')] }),
      outputs: (h) => ['CV-TD', h.tdk().code],
      notes: () => ['TGĐ VHT ký công văn kèm dự thảo hồ sơ đề nghị Tập đoàn xử lý theo thẩm quyền. Đồng ý → hệ thống chuyển hồ sơ đã ký lên Tập đoàn (bước 66, service): VOffice gửi qua tích hợp; bản cứng ghi nhận chuyển bộ hồ sơ giấy, bản scan cập nhật ở bước 78 (P-99).',
        'Không đồng ý → dialog nhận xét, ĐVĐX hoàn thiện công văn (bước 64).', KY_NOTE] },
    67: { id: 'dtms-ms13-b67-tap-doan-nhan-xet', q: ['P-96'],
      schema: (h) => ({ components: [txt('{{tdHoSo}}'),
        dl('phieuTd', `Phiếu nhận xét ${h.tdk().cq} của các Ban chuyên môn Tập đoàn`, [txt('**{{this.ban}}** · {{this.muc}}', 4), ta('nhanXet', 'Nhận xét', { rows: 2, layout: { columns: 6 } }), ta('yeuCau', 'Yêu cầu bổ sung, giải trình', { rows: 2, layout: { columns: 6 } })]),
        txt('Phiếu nhận xét bản ký (nếu có): tải lên ở **Danh sách tài liệu**.')] }),
      outputs: (h) => [h.tdk().code],
      notes: (h) => [`Các Ban chuyên môn Tập đoàn xem xét hồ sơ theo chức năng, lập và gửi phiếu nhận xét về VHT — ${h.tdk().cq} (chủ trương BM-09, KĐT BM-10; hồ sơ gộp dùng BM-09 như vòng BM-00 nội bộ). ĐVĐX tiếp thu, giải trình ở bước 68.`,
        'GIẢ LẬP P-96: người Tập đoàn xử lý trên ĐTMS bằng tài khoản giả lập (như MS01 bước 53–56). Nếu Tập đoàn không dùng ĐTMS: phiếu về qua VOffice, ĐVĐX cập nhật thay (bước này thành service task nhận văn bản).'],
      write: (v) => pick(v, ['phieuTd']) },
    68: { id: 'dtms-ms13-b68-tiep-thu-tap-doan', q: ['P-98'],
      schema: () => ({ components: [banner('{{traLaiTd}}', '=traLaiTd = ""', 'moved'), txt('{{tdHoSo}}'),
        dl('giaiTrinhTd', 'Báo cáo giải trình, tiếp thu ý kiến Tập đoàn (BM-06)', [txt('**{{this.ban}}** · {{this.muc}}', 4), txt('{{this.nhanXet}}', 5), ta('traLoi', 'Nội dung tiếp thu, giải trình', req({ rows: 3, layout: { columns: 7 } }))]),
        txt('Báo cáo giải trình **BM-06** và hồ sơ đã sửa xem ở **Văn bản đầu ra**.')] }),
      outputs: (h) => ['BM-06', h.tdk().code],
      notes: () => ['ĐVĐX trực tiếp tiếp thu ý kiến Tập đoàn, sửa hồ sơ và lập báo cáo giải trình BM-06; hoàn thiện bộ hồ sơ để TGĐ VHT ký trình lại (bước 69).',
        'Hồ sơ bị Tập đoàn trả ở khâu sau (Ban ĐTXD kiểm tra chưa đạt — bước 70, TGĐ Tập đoàn không đồng ý — bước 73) cũng quay lại bước này, không qua đầu mối trung gian; banner ghi lý do (P-98).'],
      write: (v) => pick(v, ['giaiTrinhTd']) },
    69: { id: 'dtms-ms13-b69-ky-trinh-lai', q: ['P-91', 'P-97'],
      schema: () => ({ components: [txt('{{tdHoSo}}'), tbl('Báo cáo giải trình đã tiếp thu', 'giaiTrinhTd', [['ban', 'Ban'], ['muc', 'Mục'], ['traLoi', 'Tiếp thu, giải trình']]),
        tbl('Khối chữ ký BM-06', 'kyBm06', SIGN_COLS), txt('**BM-06** (bản trình ký) và bộ hồ sơ hoàn thiện xem ở **Văn bản đầu ra**.')] }),
      outputs: (h) => ['BM-06', h.tdk().code],
      notes: () => ['TGĐ VHT (hoặc lãnh đạo được ủy quyền với hồ sơ KĐT — P-97) ký trình lại báo cáo giải trình và bộ hồ sơ hoàn thiện lên Tập đoàn → Ban ĐTXD Tập đoàn tiếp nhận, kiểm tra (bước 70). BPMN không có nhánh không đồng ý ở bước này.', KY_NOTE] },
    70: { id: 'dtms-ms13-b70-ban-dtxd-kiem-tra', q: ['P-96', 'P-98'],
      schema: () => ({ components: [txt('{{tdHoSo}}'), tbl('Tiếp thu, giải trình ý kiến các Ban (BM-06)', 'giaiTrinhTd', [['ban', 'Ban'], ['nhanXet', 'Ý kiến'], ['traLoi', 'VHT tiếp thu, giải trình']]),
        ta('ketLuanKt', 'Kết luận kiểm tra', req({ rows: 2 }))] }),
      outputs: (h) => ['BM-06', h.tdk().code],
      notes: (h) => [`Ban Đầu tư – Xây dựng Tập đoàn kiểm tra hồ sơ VHT ký trình lại, việc tiếp thu và giải trình. Chưa đạt → dialog nhận xét, trả trực tiếp ĐVĐX bổ sung (bước 68) và VHT ký trình lại.`,
        `Đạt → cổng "Hồ sơ chủ trương riêng?" theo loại hồ sơ trình: ${h.tdk().code === 'BM-01' ? 'chủ trương → hoàn thiện hồ sơ, các Ban ký BM-01 (bước 71)' : 'KĐT / hồ sơ gộp → lập báo cáo thẩm định BM-14 và dự thảo BM-18 (bước 72)'}.`],
      write: (v) => pick(v, ['ketLuanKt']) },
    71: { id: 'dtms-ms13-b71-chu-truong-ky-cac-ban', q: ['P-96'],
      schema: () => ({ components: [txt('{{tdHoSo}}'), tbl('Chân ký các Ban trên Tờ trình BM-01', 'chanKyBan', [['ban', 'Ban'], ['noiDung', 'Nội dung'], ['trangThai', 'Trạng thái']]),
        txt('Tờ trình **BM-01** (bản trình TGĐ Tập đoàn) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-01'],
      notes: () => ['Hồ sơ chủ trương MS13: các Ban chuyên môn / Ban ĐTXD Tập đoàn hoàn thiện hồ sơ và ký chân trang BM-01 trước khi TGĐ Tập đoàn ký trực tiếp (bước 73). Không lập báo cáo thẩm định chủ trương hoặc quyết định riêng.'] },
    72: { id: 'dtms-ms13-b72-tap-doan-bm14', q: ['P-96'],
      schema: () => ({ components: [txt('{{tdHoSo}}'), txt('{{tdLapBc}}'),
        txt('**BM-14** Báo cáo kết quả thẩm định (Ban ĐTXD Tập đoàn) và dự thảo **Quyết định BM-18** xem ở **Văn bản đầu ra**.')] }),
      outputs: (h) => ['BM-14', 'BM-18'].concat(h.tdk().code === 'BM-00' ? ['BM-00'] : ['BM-03']),
      notes: () => ['Hồ sơ KĐT hoặc hồ sơ gộp BM-00: Ban ĐTXD Tập đoàn tổng hợp ý kiến, lập và ký Báo cáo kết quả thẩm định BM-14, soạn dự thảo Quyết định BM-18 để TGĐ Tập đoàn phê duyệt (bước 73). BM-00 vẫn là một giai đoạn gộp.'] },
    73: { id: 'dtms-ms13-b73-tgd-tap-doan-ky', q: ['P-96', 'P-98'],
      schema: () => ({ components: [txt('{{tdHoSo}}'), tbl('Khối chữ ký cấp Tập đoàn', 'kyTd', SIGN_COLS), txt('{{tdTraVe}}')] }),
      outputs: (h) => (h.tdk().code === 'BM-01' ? ['BM-01'] : ['BM-18', 'BM-14']),
      notes: (h) => [h.tdk().code === 'BM-01' ? 'Chủ trương MS13: TGĐ Tập đoàn ký trực tiếp BM-01 đã có chân ký các Ban → kết quả lưu ở bước 74, hồ sơ chuyển sang lập hồ sơ KĐT (bước 49).'
        : 'KĐT / hồ sơ gộp BM-00: TGĐ Tập đoàn xem xét BM-14 và ký ban hành BM-18 → kết quả lưu ở bước 74, hồ sơ hoàn tất phê duyệt cấp Tập đoàn.',
        'Không quay về TGĐ VHT phê duyệt thay Tập đoàn. Không đồng ý / yêu cầu sửa → dialog nhận xét, ĐVĐX tiếp thu (bước 68). Bước ký của Tập đoàn không đi qua khối ký chung 75–78 của VHT (P-91).'] },
  };

  const CHON_CQCM = { id: 'dtms-ms13-b22-41-52-chon-cqcm', q: ['P-57'],
    schema: (h, tok) => ({ components: [
      banner('CQCM chủ trì không đồng ý danh sách CQCM: “{{traLaiDs.lyDo}}”. Cập nhật danh sách rồi gửi lại.', '=traLaiDs = null'),
      banner('{{yKienLead}}', '=yKienLead = ""', 'moved'),
      txt('{{chuTri}}'),
      chkl('cqcmSel', `Chọn CQCM phối hợp thẩm định ${{ 22: 'hồ sơ gộp', 41: 'chủ trương', 52: 'KĐT' }[tok.task]}`, { valuesKey: 'cqcmValuesK' }),
      rad('host', 'Đơn vị chủ trì lựa chọn nhà thầu, ký hợp đồng', req({ values: opts(window.EVars.h.HOSTS), description: 'Bắt buộc với KĐT KHCN.', conditional: { hide: '=not(canDonViChuTri)' } })),
      txt('Loại KĐT: {{loaiKdt}}.', 16, '=not(canDonViChuTri)')]
      .concat(tok.task === 41 ? [] : [tbl('Đầu mối nhận hồ sơ (tính lại theo CQCM đang chọn)', 'dsDauMoi[item.ma = "TTMS" or list contains(cqcmSel, item.ma)]', [['nguoi', 'Người nhận'], ['vaiTro', 'Vai trò'], ['donVi', 'Đơn vị']])]) }),
    notes: (h, tok) => [{ 41: 'Sau khi kiểm tra Checklist 01 (bước 40), ĐVĐX chủ động chọn CQCM phối hợp thẩm định chủ trương; hệ thống không cố định danh sách. CQCM chủ trì xác nhận danh sách ở bước 42.',
      22: 'ĐVĐX tiếp thu ý kiến của Chỉ huy (bước 21), chủ động chọn CQCM cho hồ sơ gộp BM-00. CQCM chủ trì xác nhận danh sách ở bước 23.',
      52: 'Sau khi kiểm tra hồ sơ (bước 51), ĐVĐX chọn CQCM thẩm định KĐT; danh sách chủ trương được chọn sẵn. CQCM chủ trì xác nhận ở bước 53, mở vòng thẩm định KĐT (bước 54).' }[tok.task],
      'Quay lại bước này khi CQCM chủ trì không đồng ý danh sách, hoặc khi hệ thống xác định hồ sơ chưa đủ điều kiện thẩm định và ĐVĐX đã sửa (bước 26, cổng "Hồ sơ cần sửa thuộc vòng nào?").',
      'Đơn vị chủ trì: radio ẩn bằng conditional.hide theo loại KĐT (ẩn thì bỏ luôn required — đúng luật "chỉ bắt buộc khi KĐT KHCN"). Đầu mối nhận hồ sơ: table với dataSource FEEL lọc theo CQCM đang chọn, tính lại khi đổi lựa chọn.'],
    write: (v) => pick(v, ['cqcmSel', 'host']) };
  const XAC_NHAN_DS = { id: 'dtms-ms13-b23-42-53-xac-nhan-ds-cqcm', q: ['P-57'],
    schema: () => ({ components: [txt('### Xác nhận danh sách CQCM · {{giaiDoan.title}}\n{{chuTri}}'),
      tbl('CQCM phối hợp do đơn vị đề xuất chọn', 'dsCqcm', [['donVi', 'Đơn vị'], ['chucNang', 'Nội dung thẩm định'], ['nguoi', 'Người xử lý']]),
      txt('**Đơn vị chủ trì lựa chọn nhà thầu:** {{hostTen}}')] }),
    notes: (h, tok) => [`Bước mới của BPMN 12/10: CQCM chủ trì (TTMS) xác nhận danh sách CQCM do ĐVĐX chọn (bước ${tok.task - 1}). Đồng ý → ${{ 23: 'Chỉ huy ĐVĐX ký phiếu yêu cầu thẩm định (bước 24)', 42: 'ĐVĐX trình hồ sơ (bước 43)', 53: 'mở vòng thẩm định KĐT (bước 54)' }[tok.task]}; Không đồng ý → dialog nhận xét (G6), quay lại chọn CQCM.`,
      'Trước bản 12/10 việc rà soát danh sách nằm trong bước TTMS thẩm định (nút "Danh sách CQCM chưa đạt") — nay tách thành bước riêng có cổng.'] };
  const BO_SUNG = { id: 'dtms-ms13-b26-59-bo-sung',
    schema: (h, tok) => ({ components: [txt(`### ${tok.task === 59 ? 'AI tóm tắt phản hồi và gợi ý điều chỉnh' : 'AI gợi ý thông tin cần chỉnh sửa'}\n{{goiYSua}}`), txt('### {{giaiDoan.title}}\n{{hoSoGd}}')] }),
    notes: (h, tok) => [tok.task === 59 ? 'Báo cáo kết quả thẩm định chưa được thông qua (bước 57) → AI tóm tắt phản hồi, gợi ý điều chỉnh (bước 58); ĐVĐX hoàn chỉnh hồ sơ rồi lập lại hồ sơ phê duyệt KĐT (bước 50).'
      : 'Cổng "Hồ sơ đủ điều kiện thẩm định?" (hệ thống kiểm tra khi mở vòng — giả lập bằng Công cụ demo, B1-2) = Chưa → AI gợi ý thông tin cần chỉnh sửa (bước 25); ĐVĐX sửa hồ sơ rồi chọn lại CQCM của vòng (bước 22 / 41 / 52).'] };
  const SAU_HOP = { id: 'dtms-ms13-b34-35-xac-nhan-sau-hop', q: ['P-55'],
    schema: () => ({ components: [tbl('Nội dung điều chỉnh đã thống nhất sau họp', 'dieuChinh', [['noiDung', 'Nội dung'], ['truoc', 'Trước họp'], ['sau', 'Sau họp (đã thống nhất)']]),
      txt('*{{ketLuanHop}}* · Họp {{soLanHop}}/2'), tbl('Xác nhận sau họp', 'xacNhanSauHop', [['nguoi', 'Người xác nhận'], ['vaiTro', 'Vai trò'], ['trangThai', 'Trạng thái']])] }),
    notes: () => ['Sau họp: Chuyên quản ĐVĐX xác nhận nội dung điều chỉnh (bước 34), sau đó Chỉ huy ĐVĐX xác nhận lại (bước 35). Chỉ khi đủ hai xác nhận, ĐVĐX mới được cập nhật hồ sơ (bước 36).'] };
  const HOAN_CHINH = { id: 'dtms-ms13-b46-55-tham-dinh-hoan-chinh', q: ['P-90'], draftLabel: GHI_LAI.draftLabel, draftToast: GHI_LAI.draftToast,
    schema: (h, tok) => ({ components: [txt('### Kết quả thẩm định {{giaiDoan.title}}\n{{ketQuaTd}}'),
      tbl('Ý kiến thẩm định đã xử lý trong vòng', 'yKienVong', [['luot', 'Lượt'], ['donVi', 'Đơn vị'], ['noiDung', 'Nội dung'], ['traLoi', 'Đơn vị đề xuất tiếp thu, giải trình']], '=count(yKienVong) = 0'),
      txt('*Không có ý kiến cần sửa đổi, giải trình trong vòng này.*', 16, '=count(yKienVong) > 0'),
      txt('### Thẩm quyền phê duyệt\n{{thamQuyen}}'),
      ta('hoanChinhTd', 'Nội dung hoàn chỉnh hồ sơ sau thẩm định', { rows: 3 })] }),
    outputs: (h, tok) => (tok.task === 46 ? ['BM-01'] : ['BM-03', 'PL-TM']),
    notes: (h, tok) => [`Bước mới của BPMN 12/10: sau khi CQCM thống nhất, TTMS thẩm định và hoàn chỉnh hồ sơ ${tok.task === 46 ? 'chủ trương' : 'KĐT'}. Cổng tiếp theo tính lại thẩm quyền (bước 13 đọc danh mục Phân cấp thẩm quyền KĐT — D-33): VHT → ${tok.task === 46 ? 'TTMS ký thẩm định (bước 47)' : 'Chỉ huy ĐVĐX ký tờ trình (bước 56)'}; Tập đoàn → bước 63 (tuyến Tập đoàn: công văn, Tập đoàn nhận xét, ký trình lại, TGĐ Tập đoàn phê duyệt).`,
      'Ý kiến các lượt chỉ xem (biến của bước 27–31 trong vòng hiện tại).'],
    write: (v) => pick(v, ['hoanChinhTd']) };
  const KY_BM01 = { id: 'dtms-ms13-b47-48-ky-bm01', q: ['P-60', 'P-61', 'P-91'],
    schema: () => ({ components: [txt('### Kết quả thẩm định chủ trương\n**Kết luận:** Đủ điều kiện trình ký · **Phiên bản trình ký:** v{{phienBan}} · {{demVong}}\n{{thamQuyen}}'), tbl('Khối chữ ký BM-01', 'kyBm01', SIGN_COLS),
      txt('**BM-01** (bản trình ký) xem ở **Văn bản đầu ra**; Checklist 01, phiếu nhận xét BM-09, sở cứ giá, biên bản họp ở Danh sách tài liệu.')] }),
    outputs: () => ['BM-01'],
    notes: (h, tok) => [tok.task === 47 ? 'Cấp duyệt chủ trương VHT: TTMS (và cấp phó phụ trách nếu có) ký thẩm định trực tiếp trên tờ trình BM-01. TGĐ VHT ký duyệt ở bước 48.'
      : 'TGĐ VHT ký ô PHÊ DUYỆT trên tờ trình BM-01 → AI hỗ trợ lập hồ sơ KĐT (bước 49). Không đồng ý (dialog nhận xét): chỉ đạo dừng → kết thúc; chỉ đạo xử lý tiếp → quay về cổng gộp (sau bước 17).',
      KY_NOTE] };
  const BM14 = { id: 'dtms-ms13-b57-61-bm14', q: ['P-56', 'P-91'],
    schema: (h, tok) => ({ components: [txt(`### Kết quả thẩm định ${tok.task === 61 ? 'hồ sơ gộp' : 'KĐT'}\n{{ketQuaTd}}`),
      txt('**BM-14** Báo cáo kết quả thẩm định và dự thảo **Quyết định BM-18** xem ở **Văn bản đầu ra**; hồ sơ thẩm định ở Danh sách tài liệu.')] }),
    outputs: () => ['BM-14', 'BM-18'],
    notes: (h, tok) => [tok.task === 61 ? 'Hồ sơ gộp cấp VHT (cổng sau vòng BM-00): TTMS ký báo cáo thẩm định BM-14 và trình dự thảo Quyết định BM-18 (bản 12/10 — BM-00 dùng BM-14 + BM-18) → TGĐ VHT ký (bước 62). Bước ghi tác nhân "ĐVĐX; TTMS / CQCM chủ trì" — giao TTMS (B1-3).'
      : 'TTMS ký báo cáo thẩm định BM-14 và trình dự thảo Quyết định BM-18 (TTMS không ký quyết định) → TGĐ VHT ký (bước 60). Không được thông qua → dialog nhận xét, AI tóm tắt phản hồi (bước 58), ĐVĐX hoàn chỉnh hồ sơ (bước 59).', KY_NOTE] };

  const ALIAS = { chonCqcm: CHON_CQCM, xacNhanDs: XAC_NHAN_DS, boSung: BO_SUNG, sauHop: SAU_HOP, hoanChinh: HOAN_CHINH, kyBm01: KY_BM01, bm14: BM14 };
  /* Bước 5, 7, 8 dùng nguyên form MS01 (cùng nội dung bóc tách, tồn kho, YCBG). */
  const SAME = { 5: true, 7: true, 8: true };
  window.EForms.MS13 = (tok, h) => {
    if (SAME[tok.task]) return window.EForms.MS01(tok, h);
    const e = F[tok.task];
    return typeof e === 'string' ? ALIAS[e] : e || null;
  };
})();
