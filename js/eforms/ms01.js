/*
 * eForm (Camunda Form schema) của các user task MS01.01 / .02 / .03 — B0.4 (2), phân loại theo docs/dtms/prototype-B04-phan-loai-task.md §4.1.
 * Mỗi task: { id (formId / formKey), schema(h) → { components } — hàm vì MS01.01/.02/.03 là 3 quy trình, mỗi quy trình 1 bộ form
 * (khác nhãn BM-01 / BM-09, Checklist 01 / 02); notes(h) — ghi chú BA cho nút (i); q — điểm ❓; outputs — Văn bản đầu ra (dự thảo) của bước;
 * reasonField — nút bắt buộc lý do nhưng lý do nằm trong form; write(values) — output mapping của task (biến ghi vào quy trình);
 * gate(values) — DX-01: kết quả service task AI kiểm tra trước khi gửi (Không đạt → quay lại chính task này) }.
 * Nút từ chối / không đồng ý (choice.reason) không mở form: dùng dialog nhận xét (G6).
 * Khối chỉ xem trong dòng của bảng lặp dùng component text với {{this.x}} (vht-e-form không có trường readonly).
 */
(function () {
  /* ---------- Builder: trả JSON đúng thuộc tính của Camunda Form / vht-e-form ---------- */
  const L = (n) => (n ? { layout: { columns: n } } : {});
  const hide = (h) => (h ? { conditional: { hide: h } } : {});
  const txt = (text, n, h) => Object.assign({ type: 'text', text }, L(n), hide(h));
  const banner = (content, h, kind) => Object.assign({ type: 'html', content: `<div class="banner-${kind || 'bad'}">${content}</div>` }, hide(h));
  const tbl = (label, ds, cols, h) => Object.assign({ type: 'table', label, dataSource: '=' + ds, columns: cols.map(([key, l]) => ({ key, label: l })) }, hide(h));
  const inp = (type) => (key, label, o) => Object.assign({ type, key, label }, type === 'textarea' ? { rows: 3 } : {}, o || {});
  const tf = inp('textfield'), ta = inp('textarea'), num = inp('number'), dt = (key, label, o) => Object.assign({ type: 'datetime', key, dateLabel: label, label, subtype: 'date' }, o || {});
  const sel = inp('select'), rad = inp('radio'), chkl = inp('checklist'), tags = inp('taglist'), chk = inp('checkbox');
  const req = (o) => Object.assign({ validate: { required: true } }, o || {});
  const grp = (label, components) => ({ type: 'group', label, components });
  const dl = (path, label, components) => ({ type: 'dynamiclist', path, label, isRepeating: false, allowAddRemove: false, components });
  const opts = (list) => list.map((x) => (Array.isArray(x) ? { label: x[1], value: x[0] } : { label: x, value: x }));
  const AI = opts(['Chấp nhận', 'Sửa', 'Bỏ']);
  /* G2 — bảng quyết định gợi ý AI: Mục, Gợi ý + Nguồn (chỉ xem), Quyết định, Nội dung sửa (chỉ hiện khi chọn Sửa). */
  const aiTable = (path, label) => dl(path, label, [
    txt('**{{this.muc}}**', 3), txt('{{this.goiY}}\n*Nguồn: {{this.nguon}}*', 8),
    rad('quyetDinh', 'Quyết định', { values: AI, layout: { columns: 5 } }),
    ta('noiDungSua', 'Nội dung sửa', req({ conditional: { hide: '=this.quyetDinh != "Sửa"' } }))]);
  /* Bảng lặp người dùng thêm / xoá dòng (comment #3: NCC mới). */
  const dlAdd = (path, label, components) => ({ type: 'dynamiclist', path, label, isRepeating: true, allowAddRemove: true, defaultRepetitions: 0, components });
  /* Khung "Gợi ý AI" tĩnh (D-20): kết quả service task AI ghi vào biến, chỉ xem (S5) — group có custom property variant = ai
     (thuộc tính `properties` của Camunda form-js) bọc một text markdown có {{FEEL}}. */
  const aiBox = (title, text, h) => Object.assign({ type: 'group', label: '✦ Gợi ý AI — ' + title, properties: { variant: 'ai' }, components: [txt(text)] }, hide(h));
  const B = { L, hide, txt, banner, tbl, tf, ta, num, dt, sel, rad, chkl, tags, chk, req, grp, dl, dlAdd, opts, aiTable, aiBox };
  window.EForms = window.EForms || {};
  window.EForms.b = B;

  const TT_COLS = [['nhom', 'Nhóm'], ['muc', 'Danh mục hồ sơ'], ['so', 'Số văn bản'], ['yeuCau', 'Yêu cầu'], ['tinhTrang', 'Tình trạng']];
  const SIGN_COLS = [['nguoiKy', 'Người ký'], ['tuCach', 'Tư cách'], ['trangThai', 'Trạng thái'], ['thoiDiem', 'Thời điểm']];
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});

  const F = {
    1: { id: 'dtms-ms01-t01-can-cu', q: ['P-01', 'P-26'],
      schema: (h) => ({ components: [
        tbl('Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng', 'duToanChon', [['loai', 'Loại chi phí'], ['khoanMuc', 'Khoản mục chi phí'], ['dvt', 'ĐVT'], ['sl', 'Số lượng đề xuất'], ['giaTri', 'Giá trị dự tính (tỷ)'], ['duToan', 'Giá trị dự toán (tỷ)'], ['goiThau', 'Hình thành gói thầu']], '=count(duToanChon) = 0'),
        sel('basisType', 'Loại căn cứ', req({ values: window.D.basisTypes.filter((b) => !(h.procOf(h.proc()).noTypes || []).includes(b.id)).map((b) => ({ label: b.name, value: b.id })), layout: { columns: 8 } })),
        sel('basisDoc', 'Văn bản căn cứ đã phê duyệt', req({ valuesExpression: '=basisDocOptions[item.type = basisType]', searchable: true, layout: { columns: 8 } })),
        tbl('Văn bản căn cứ hợp với quy trình, theo loại đã chọn', 'basisDocs[item.typeId = basisType]', [['so', 'Số'], ['ngay', 'Ngày'], ['loai', 'Loại'], ['trichYeu', 'Trích yếu'], ['giaTri', 'Giá trị (tỷ)'], ['conLai', 'Còn lại (tỷ)'], ['tdDuyet', 'CT/TGĐ TĐ đã duyệt']])] }),
      notes: (h) => ['T29 S8 (D-60): bảng "Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng" là khối chỉ xem (loại 3) đọc biến <code>duToanChon</code> do BE ghi khi start từ hạng mục của ĐXMS (Thêm mới luồng mua sắm); ẩn khi không có dòng. Danh mục hàng hoá để rà soát, báo giá chưa nối với dòng dự toán — B3 (S4).', `Quy trình ${h.proc()} (${h.condOf(h.proc())}): BE nạp vào biến <code>basisDocOptions</code> các văn bản căn cứ hợp với quy trình và còn giá trị; ô Văn bản căn cứ lọc theo Loại căn cứ bằng <code>valuesExpression</code> (E1); BE kiểm văn bản đúng loại khi submit; loại căn cứ không dùng cho quy trình không có trong form của quy trình này (mỗi quy trình MS01.01/.02/.03 một form).`,
        'Giá trị được kiểm tra sau báo giá (cổng "Giá trị khớp quy trình đã chọn?" sau task 10). Hoàn thành → hệ thống lấy dữ liệu (task 02), AI gợi ý thông tin cơ bản (task 03).'],
      write: (v) => pick(v, ['basisType', 'basisDoc']) },

    4: { id: 'dtms-ms01-t04-thong-tin-co-ban', q: ['P-02', 'P-26'],
      schema: () => ({ components: [
        banner('Giá trị dự kiến khoảng {{aiEstimate}} tỷ, lệch điều kiện của quy trình {{hoSo.quyTrinh}} ({{hoSo.dieuKien}}). Hệ thống sẽ kiểm tra lại sau khi có báo giá.', '=not(aiEstimateOff)'),
        tf('tenDeXuat', 'Tên đề xuất', req()),
        sel('purposeCode', 'Mục đích mua sắm', req({ values: opts([['DT', 'Duy trì thường xuyên'], ['SX', 'Liên tục SXKD'], ['KHCN', 'Triển khai hoạt động KHCN'], ['QP', 'QP-AN-CT']]), layout: { columns: 8 } })),
        sel('fund', 'Nguồn vốn', req({ valuesKey: 'fundOptions', searchable: true, layout: { columns: 8 } })),
        rad('secret', 'Mật', req({ values: [{ label: 'Không', value: false }, { label: 'Có', value: true }], layout: { columns: 8 }, description: 'Mặc định theo loại ĐXMS.' })),
        rad('priority', 'Mức ưu tiên', req({ values: opts(['Thường', 'Khẩn', 'Thượng khẩn']), layout: { columns: 8 } })),
        B.aiTable('aiGoiY', 'Gợi ý AI từ căn cứ — Mục đích, Phạm vi, Thời gian của hồ sơ lấy theo quyết định ở đây')] }),
      notes: () => ['Gợi ý AI (G2): service task 03 ghi biến <code>aiGoiY</code> theo từng mục kèm nguồn trích; mỗi mục một dòng bảng lặp, mặc định Chấp nhận (= "Chấp nhận tất cả"), chọn lại là "Hoàn tác". Giá trị cuối của mục do BE tính khi Xác nhận (Chấp nhận → gợi ý, Sửa → nội dung sửa, Bỏ → rỗng). ❓ AI phải trả kết quả theo từng mục kèm nguồn.',
        'Nguồn vốn chọn từ danh mục Nguồn vốn (BE nạp <code>fundOptions</code>, bỏ nguồn dừng hoạt động — P-33). Mặc định là nguồn vốn AI trích từ căn cứ.',
        'Cảnh báo mềm (không chặn) khi giá trị dự kiến lệch điều kiện quy trình (biến <code>aiEstimateOff</code> do task 03 ghi); kiểm tra chính thức ở cổng sau task 10.',
        'Tên, người phụ trách, quy trình nằm ở Thông tin chung. Bỏ trường "Loại xử lý" (Điều chỉnh thuộc MS02). Hồ sơ Mật thì mặc định ký cứng.'] },

    5: { id: 'dtms-ms01-t05-boc-tach', q: ['P-03'],
      schema: () => ({ components: [
        tbl('Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng', 'duToanChon', [['loai', 'Loại chi phí'], ['khoanMuc', 'Khoản mục chi phí'], ['dvt', 'ĐVT'], ['sl', 'Số lượng đề xuất'],
          ['giaTri', 'Giá trị dự tính (tỷ)'], ['duToan', 'Giá trị dự toán (tỷ)'], ['goiThau', 'Hình thành gói thầu']], '=count(duToanChon) = 0'),
        txt('### Cấu trúc căn cứ\n{{basisTreeText}}\n*Nguồn bóc tách: {{bocTachNguon}}*'),
        B.dl('bocTach', 'Bóc tách danh mục hàng hoá', [
          txt('**{{this.n}}. {{this.name}}**\nĐVT: {{this.uom}} · {{this.nhom}}', 6),
          txt('SL gốc **{{this.bom}}** · đã dùng {{this.used}} · còn lại **{{this.remainText}}**', 5),
          num('prop', 'SL đề xuất', req({ validate: { required: true, min: 0 }, layout: { columns: 3 } })),
          txt('{{if this.remain != null and this.prop > this.remain then "**Vượt số còn lại**" else ""}}', 2),
          txt('*{{this.warn}}*', 16, '=this.warn = ""')])] }),
      notes: (h) => ['T29 S8 (D-60): bảng "Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng" là khối chỉ xem (loại 3) đọc biến <code>duToanChon</code> do BE ghi khi start từ hạng mục của ĐXMS (Thêm mới luồng mua sắm); ẩn khi không có dòng. Danh mục hàng hoá để rà soát, báo giá chưa nối với dòng dự toán — B3 (S4).', `Trừ lùi: số đã dùng ở ĐXMS khác bị trừ khỏi số lượng gốc của căn cứ.${window.D.items.filter((i) => i.used).map((i) => ` Dòng ${i.n} đã dùng ${i.used} ở ĐXMS khác nên còn ${i.bom - i.used}.`).join('')}`,
        'G3: cột "Vượt số còn lại" là cảnh báo ngay trong dòng; chặn thật ở BE khi submit (validator theo quy trình) — luật hiển thị không có điều kiện theo biến.',
        'Dòng không có trong dự toán/eBOM: chỉ cảnh báo, không chặn (BBLV 09/09). Căn cứ thiếu thông tin → nút "Thiếu thông tin căn cứ" (quay lại task 04).'],
      write: (v) => pick(v, ['bocTach']) },

    7: { id: 'dtms-ms01-t07-ra-soat-ton-kho', q: ['P-04'],
      schema: () => ({ components: [
        txt('Kết quả rà soát tồn kho từ hệ thống kho: **{{stock.trangThai}}** · {{stock.ma}} · gửi yêu cầu {{stock.gui}}'),
        B.dl('ruaSoatKho', 'Kết quả rà soát', [
          txt('**{{this.n}}. {{this.name}}**\nSL đề xuất: {{this.prop}}', 5),
          txt('Tồn sổ sách **{{this.book}}** · đang giữ {{this.held}} · khả dụng **{{this.avail}}**', 5),
          num('fromStock', 'Dùng từ kho', { validate: { min: 0 }, layout: { columns: 3 }, conditional: { hide: '=not(this.coKho)' } }),
          txt('SL mua: **{{this.prop - this.fromStock}}**', 3)])] }),
      notes: () => ['Biến <code>stock</code> do service task 06 ghi (tích hợp hệ thống kho — người dùng xác nhận 2026-10-07). Theo S5 màn hiện cả trạng thái "Chưa có kết quả / Lỗi tích hợp". ❓ Chi tiết hệ thống kho (API, mã hàng đối chiếu, tồn sổ sách / đang giữ) chưa rõ.',
        'Khả dụng = tồn sổ sách − hàng đang giữ cho tờ trình khác; mặc định dùng từ kho tối đa bằng số đề xuất. Hạng mục dùng hết từ tồn kho: SL mua = 0, không đưa vào YCBG.',
        'Bước con Gửi yêu cầu → Kho trả kết quả → Xác nhận hiện ở card Quy trình và Lịch sử hồ sơ (khung chung).'],
      write: (v) => pick(v, ['ruaSoatKho']) },

    8: { id: 'dtms-ms01-t08-ycbg', q: ['P-33', 'P-72', 'P-73'],
      schema: () => ({ components: [
        tbl('YCBG nhóm 1 — Hàng hoá, dịch vụ mua sẵn', 'ycbgNhom1', [['n', 'STT'], ['hang', 'Hàng hoá / dịch vụ'], ['sl', 'SL mua'], ['nganh', 'Ngành hàng']]),
        tbl('YCBG nhóm 2 — Hàng hoá sản xuất theo yêu cầu', 'ycbgNhom2', [['n', 'STT'], ['hang', 'Hàng hoá / dịch vụ'], ['sl', 'SL mua'], ['nganh', 'Ngành hàng']], '=count(ycbgNhom2) = 0'),
        txt('*{{group2Note}}*', 16, '=count(ycbgNhom2) = 0 or group2Note = ""'),
        chkl('nccSel', 'Nhà cung cấp nhận YCBG', req({ valuesKey: 'nccOptions' })),
        txt('Đã chọn **{{count(nccSel)}}** nhà cung cấp'),
        tbl('Tình trạng nhà cung cấp (danh mục Nhà cung cấp, lọc theo ngành hàng)', 'nccList', [['ma', 'Mã nhà cung cấp'], ['ten', 'Tên nhà cung cấp'], ['email', 'Email nhận YCBG'], ['nganh', 'Ngành hàng'], ['tinhTrang', 'Tình trạng']]),
        dlAdd('nccMoi', 'Nhà cung cấp mới (chưa có trong danh mục) — thêm vào danh mục và nhận YCBG', [
          tf('ten', 'Tên nhà cung cấp', req({ layout: { columns: 5 } })), tf('mst', 'Mã số thuế', { layout: { columns: 3 } }),
          tf('email', 'Email nhận YCBG', { validate: { required: true, pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' }, layout: { columns: 4 } }),
          sel('nganh', 'Ngành hàng', req({ valuesKey: 'nganhOptions', layout: { columns: 4 } }))]),
        dt('hanTraLoi', 'Hạn trả lời', req({ layout: { columns: 8 } })),
        tbl('Đối soát ĐXMS', 'doiSoat', [['hang', 'Hạng mục'], ['de', 'ĐXMS đề xuất'], ['nguon', 'Theo nguồn'], ['ketQua', 'Kết quả'], ['ghiChu', 'Ghi chú']]),
        txt('*Nguồn đối soát: {{doiSoatNguon}}*')] }),
      notes: () => ['G1/E1: BE nạp <code>nccOptions</code> từ danh mục Nhà cung cấp — lọc theo ngành hàng của các hạng mục, bỏ NCC dừng hoạt động (P-33) và NCC đang bị cấm; NCC bị hạn chế vẫn chọn được. Bảng tình trạng chỉ xem để người dùng thấy lý do.',
        'Người dùng tạo YCBG, hệ thống gửi email thay TTMS (task 09); không có cổng nhà cung cấp, không có bước ký báo giá (BBLV 22/09, chốt 28/09/2026).',
        'Comment #3: bảng lặp "Nhà cung cấp mới" (thêm / xoá dòng). Xác nhận → BE thêm NCC vào danh mục Nhà cung cấp (ghi nguồn = mã hồ sơ) rồi gửi YCBG cùng các NCC đã chọn.',
        'Comment #4: bảng Đối soát = biến <code>doiSoat</code> của service task đối soát (chạy trước task 08). Nguồn theo nhiệm vụ / đề tài của ĐXMS: nhiệm vụ KHCN → MBOM + dự toán nhiệm vụ; dự án SXKD → dự toán dự án; mua sắm thường xuyên → KHN. Lệch chỉ cảnh báo, không chặn (BBLV 09/09).'],
      write: (v) => pick(v, ['nccSel', 'hanTraLoi', 'nccMoi']) },

    10: { id: 'dtms-ms01-t10-bao-gia', q: ['P-06', 'P-26'],
      schema: () => ({ components: [
        txt('Lần gửi YCBG: **{{lanGuiYcbg}}**'),
        tbl('So sánh báo giá (đơn giá, tỷ đồng, gồm VAT)', 'baoGia', [['ncc', 'Nhà cung cấp'], ['ngay', 'Ngày báo giá'], ['tienTe', 'Loại tiền'], ['dong', 'Dòng hàng'], ['donGia', 'Đơn giá'], ['hieuLuc', 'Hiệu lực đến'], ['thapNhat', 'Giá thấp nhất']]),
        txt('### Kết quả AI kiểm tra báo giá: {{quoteCheck.ketQua}}\n{{quoteCheck.chiTiet}}'),
        txt('Tổng giá trị **{{matchCheck.tong}} tỷ** (gồm VAT, sau khi trừ tồn kho) — **{{matchCheck.ketQua}}** quy trình {{matchCheck.quyTrinh}} ({{matchCheck.dieuKien}}) → {{matchCheck.nhanh}}.')] }),
      notes: (h) => ['Bảng báo giá dạng dọc (NCC · dòng · đơn giá · hiệu lực) vì table của eForm có cột cố định. Tên, loại tiền NCC lấy từ danh mục; ngoại tệ quy đổi VNĐ.',
        'Comment #5: tệp báo giá của từng NCC nhận YCBG là tài liệu bắt buộc của nút "Báo giá đạt" (E3) — dòng "Báo giá — (NCC)" ở Danh sách tài liệu có nút Tải lên. Service task AI đọc tệp đã tải lên để lập bảng so sánh và kiểm tra báo giá.',
        'Kết quả AI kiểm tra báo giá = biến <code>quoteCheck</code> của service task. DX-03 (đã duyệt, chờ BA): cổng sau task 10 đọc <code>quoteCheck</code> — bấm "Báo giá đạt" mà AI Không đạt thì hồ sơ vẫn quay về task 09; không khoá nút trên giao diện.',
        window.D.caseRef.quoteFailFirst ? 'Kịch bản: lần gửi YCBG đầu Không đạt (NCC Gamma hết hiệu lực) → quay lại task 09; lần 2 Đạt.' : 'Kịch bản: báo giá đạt ngay lần gửi YCBG đầu.',
        `Cổng "Giá trị khớp quy trình đã chọn?" chạy sau khi báo giá đạt: khớp → task ${h.small() ? '11 (dự thảo BM-09)' : '12 (dự thảo BM-01)'}; không khớp → task 10a.`] },

    '10a': { id: 'dtms-ms01-t10a-khong-khop', q: ['P-26'], reasonField: 'lyDo',
      schema: () => ({ components: [
        banner('Giá trị hồ sơ không khớp quy trình đã chọn. Hồ sơ chưa được chuyển sang bước dự thảo.'),
        txt('### Kết quả kiểm tra khớp quy trình\n**Quy trình đã chọn:** {{matchCheck.quyTrinh}} ({{matchCheck.dieuKien}}) · **Tổng giá trị hiện tại:** {{matchCheck.tong}} tỷ · **Quy trình phù hợp:** {{matchCheck.goiY}}'),
        txt('**Sửa lại** — dùng khi nhập sai báo giá hoặc giá trị; hồ sơ quay về bước Tổng hợp và kiểm tra báo giá, hệ thống kiểm tra khớp lại.\n**Chuyển quy trình → {{matchCheck.goiY}}** — hệ thống tạo hồ sơ {{hoSoMoi}} của cùng ĐXMS và sao chép:\n{{saoChep}}'),
        tbl('Lịch sử kiểm tra khớp', 'checks', [['lan', 'Lần'], ['ngay', 'Ngày'], ['giaTri', 'Giá trị (tỷ)'], ['quyTrinh', 'Quy trình'], ['ketQua', 'Kết quả']], '=count(checks) < 2'),
        ta('lyDo', 'Lý do', req({ rows: 4 }))] }),
      notes: () => ['Ngưỡng lấy từ Ngưỡng phân luồng tại ngày tạo hồ sơ, tính trên tổng kinh phí gồm VAT sau khi trừ tồn kho (biến <code>matchCheck</code> do cổng sau task 10 ghi).',
        'Hai nút đều bắt buộc lý do — lý do là trường của form (cả hai nút mở cùng form). Chuyển quy trình → task 10b tạo hồ sơ Phê duyệt mới của cùng ĐXMS; không dùng migration process instance của Camunda.'] },

    11: 'draft', 12: 'draft',

    13: { id: 'dtms-ms01-t13-chi-huy-duyet',
      reasonOf: (v) => (v.duyetPhan || []).filter((r) => r.ketQua === 'Không đạt').map((r) => `${r.phan}: ${r.lyDo}`).join('; '),
      schema: () => ({ components: [
        txt('### AI kiểm tra hồ sơ: Đạt\n- Đủ mục bắt buộc {{tt}}, BM-02, {{clName}}.\n- Tổng giá trị khớp phụ lục chi phí ({{hoSo.tong}} tỷ).'),
        txt('### Tóm tắt dự thảo\n{{tomTat}}'),
        B.dl('duyetPhan', 'Duyệt từng phần — tất cả Đạt mới duyệt tổng thể được', [
          txt('**{{this.phan}}**\n*{{this.giaiTrinh}}*', 5),
          rad('ketQua', 'Kết quả', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 4 } })),
          ta('lyDo', 'Lý do, hướng dẫn / chỉ đạo', req({ rows: 2, layout: { columns: 7 }, conditional: { hide: '=this.ketQua != "Không đạt"' } }))]),
        tbl('Lịch sử chỉnh sửa theo phần', 'lichSuSua', [['phienBan', 'Phiên bản'], ['phan', 'Phần'], ['noiDung', 'Nội dung cập nhật'], ['nguoi', 'Người sửa'], ['thoiDiem', 'Thời điểm']], '=count(lichSuSua) = 0'),
        B.aiBox('tóm tắt thay đổi', '{{aiTomTatSua}}', '=count(lichSuSua) = 0'),
        tbl('Cơ cấu chi phí', 'coCauChiPhi', [['n', 'STT'], ['hang', 'Hạng mục'], ['thanhTien', 'Thành tiền (tỷ)'], ['tyTrong', 'Tỷ trọng']]),
        tbl('Checklist hồ sơ', 'checklist', TT_COLS)] }),
      outputs: (h) => [h.tt(), 'BM-02'],
      notes: (h) => ['Kết quả AI = biến <code>aiCheck</code> của service task kiểm tra trước khi gửi (DX-01). AI Đạt nhưng chỉ huy vẫn phải xác nhận.',
        'Comment #6–8: bảng "Duyệt từng phần" — mỗi phần Đạt / Không đạt; Không đạt thì lý do, chỉ đạo bắt buộc. Mặc định Đạt theo kết quả AI kiểm tra, chỉ huy đổi khi cần. Cả hai nút mở cùng form.',
        `G3 (BE kiểm khi submit, vì luật hiển thị không có điều kiện theo biến): "Đồng ý" chỉ khi mọi phần Đạt; "Không đồng ý" cần ít nhất một phần Không đạt — các phần Không đạt thành nội dung trả lại, AI lọc (task 14), hồ sơ về task ${h.draftTask()}.`,
        'Comment #9: "Lịch sử chỉnh sửa theo phần" = biến <code>lichSuSua</code> BE ghi mỗi lần gửi lại (phần, người sửa, thời điểm, nội dung); xem trước / sau đầy đủ ở tab Lịch sử phiên bản (DEV-1). Dòng AI tóm tắt là Gợi ý AI tĩnh (D-20).'],
      write: (v) => pick(v, ['duyetPhan']) },

    16: { id: 'dtms-ms01-t16-chon-cqcm', q: ['P-05'],
      schema: (h) => ({ components: [
        banner('TTMS trả lại danh sách CQCM: “{{traLai17.lyDo}}”. Cập nhật danh sách rồi gửi lại TTMS xác nhận.', '=traLai17 = null'),
        chkl('cqcmSel', 'Chọn cơ quan chuyên môn (CQCM) góp ý', req(Object.assign({ valuesKey: 'cqcmValues' }, h.small() ? { description: 'Hồ sơ dưới 160 tỷ: CQCM Tài chính bắt buộc (QT B8.2).' } : {}))),
        dt('hanGopY', 'Hạn góp ý', req({ layout: { columns: 8 } })),
        sel('dauMoi', 'Đầu mối tiếp nhận', req({ valuesKey: 'nguoiDungOptions', searchable: true, layout: { columns: 8 } })),
        txt('Phiếu yêu cầu thẩm định (BM-03) đã ký nháy: tải lên ở **Danh sách tài liệu** (bắt buộc). Bản BM-03 sinh từ dữ liệu form này xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-03'],
      notes: (h) => ['Danh sách CQCM được chuyển TTMS xác nhận đúng chức năng, đủ thành phần (task 17, N07) trước khi hệ thống gửi yêu cầu thẩm định.',
        'E3: tệp BM-03 ký nháy là tài liệu bắt buộc của hành động — BE kiểm loại tài liệu trên hồ sơ trước khi chuyển bước (BBLV 22/09). ❓ Chưa thấy trường "tài liệu bắt buộc" trong luật hiển thị (display-rule.models.ts) → nếu BE chưa có thì DEV BE.']
        .concat(h.small() ? ['G3: hồ sơ < 160 tỷ có CQCM Tài chính chọn sẵn (defaultValue của form MS01.03); BE từ chối submit nếu bỏ chọn (P-25).'] : []),
      write: (v) => pick(v, ['cqcmSel', 'hanGopY', 'dauMoi']) },

    17: { id: 'dtms-ms01-t17-xac-nhan-cqcm', q: ['P-05'],
      schema: () => ({ components: [
        tbl('Danh sách CQCM do đơn vị đề xuất chọn', 'cqcmChon', [['cqcm', 'CQCM'], ['chucNang', 'Chức năng liên quan'], ['nguoiXuLy', 'Người xử lý']]),
        txt('### AI đối chiếu thành phần CQCM: {{aiCqcm.ketQua}}\n{{aiCqcm.chiTiet}}'),
        txt('**Phiếu yêu cầu thẩm định (BM-03):** hạn góp ý {{bm03.han}} · tệp ký nháy {{bm03.tep}} (Danh sách tài liệu)')] }),
      outputs: () => ['BM-03'],
      notes: () => ['Đúng, đủ → hệ thống trình ký BM-03 và gửi yêu cầu tới các CQCM (task 18). Chưa đúng/đủ → dialog nhận xét, trả ĐVĐX cập nhật (task 16).', 'Kết quả đối chiếu thành phần = biến của service task AI.'] },

    19: { id: 'dtms-ms01-t19-bm04', q: ['P-22'],
      schema: () => ({ components: [
        txt('**{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}}\n*Phiếu riêng của {{cqcmTen}} — không hiển thị ý kiến của cơ quan khác.*'),
        B.dl('bm04Phieu', 'BM-04 Phiếu nhận xét theo mục BM-01', [
          txt('**{{this.muc}}**', 4),
          rad('danhGia', 'Đánh giá', req({ values: opts(['OK', 'Không OK']), layout: { columns: 4 } })),
          ta('nhanXet', 'Nội dung nhận xét', req({ rows: 2, layout: { columns: 8 }, conditional: { hide: '=this.danhGia = "OK"' } })),
          txt('Gợi ý AI: *{{this.aiGoiY}}*', 8, '=this.danhGia = "OK" or this.aiGoiY = ""'),
          rad('quyetDinhAi', 'Gợi ý AI', { values: AI, layout: { columns: 8 }, conditional: { hide: '=this.danhGia = "OK" or this.aiGoiY = ""' } }),
          ta('huongDan', 'Hướng dẫn sửa', { rows: 2, layout: { columns: 16 }, conditional: { hide: '=this.danhGia = "OK"' } })])] }),
      notes: (h) => ['Mỗi CQCM một phiếu: multi-instance theo CQCM, biến cục bộ của từng instance — hai cơ quan không thấy phiếu của nhau (comment #14, S7). BM-04 đã ký vẫn có thể chứa ý kiến Không OK (N03).',
        'Gợi ý AI nhận xét (G2): service task AI chạy trước task 19, gợi ý cho mục Không OK; CQCM Chấp nhận / Sửa / Bỏ. Hồ sơ đang thẩm định: ĐVĐX bị khoá sửa tới khi nhận đủ BM-04 (UR-COM-03).']
        .concat(window.Flow.state.vars.round > 0 ? [`Vòng BM-04 lần ${h.bm04Round()}: ĐVĐX đã gửi giải trình (phụ lục 1 BM-02); CQCM xem giải trình và lập lại phiếu.`] : []),
      write: (v, tok) => {
        const all = Object.assign({}, window.Flow.ui.bm04), o = {};
        (v.bm04Phieu || []).forEach((r) => { o[r.muc] = { ok: r.danhGia === 'OK', text: r.danhGia === 'OK' ? '' : r.nhanXet || 'Cần bổ sung, làm rõ.', guide: r.danhGia === 'OK' ? '' : r.huongDan || '' }; });
        all[tok.cqcm] = o;
        return { bm04: all };
      } },

    20: { id: 'dtms-ms01-t20-ky-bm04',
      schema: () => ({ components: [txt('**{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}}'),
        tbl('BM-04 Phiếu nhận xét — chuyên viên đã lập', 'bm04KetQua', [['muc', 'Mục BM-01'], ['danhGia', 'Đánh giá'], ['nhanXet', 'Nội dung nhận xét'], ['huongDan', 'Hướng dẫn sửa']])] }),
      notes: () => ['Comment #13, #15 (AI đồng bộ ý kiến hai cơ quan) không đặt ở task 20: theo #14 hai CQCM không được thấy ý kiến của nhau — khối AI đặt ở task 26 (ĐVĐX nhận kết quả).',
        'Form task 20 chỉ đọc kết quả task 19. Đồng ý → hệ thống trình ký BM-04 qua VOffice (task 22); Không đồng ý → dialog nhận xét, AI lọc nội dung cần sửa, trả chuyên viên (task 21).'] },

    26: { id: 'dtms-ms01-t26-ket-qua-bm04', q: ['P-22'],
      schema: () => ({ components: [
        banner('Hồ sơ bị trả lại ở bước “{{traLaiKy.buoc}}” — {{traLaiKy.nguoi}}: “{{traLaiKy.lyDo}}”', '=traLaiKy = null'),
        tbl('Trạng thái phiếu BM-04', 'bm04TrangThai', [['cqcm', 'CQCM'], ['nguoi', 'Người lập / chỉ huy'], ['lan', 'Lần'], ['tinhTrang', 'Tình trạng'], ['soNgay', 'Số ngày xử lý'], ['ky', 'Ký'], ['khongOk', 'Không OK']]),
        txt('### AI kiểm tra xung đột giữa các BM-04: Không có xung đột\nKhông có cặp ý kiến mâu thuẫn giữa các CQCM trên cùng một mục của BM-01.'),
        B.aiBox('đồng bộ ý kiến các CQCM và hướng dẫn sửa', '{{aiDongBo}}'),
        B.dl('quyetDinhYKien', 'Quyết định của đơn vị với từng ý kiến Không OK (AI tóm tắt)', [
          txt('**{{this.cqcmTen}}** · {{this.muc}}', 4), txt('{{this.yKien}}', 7),
          rad('quyetDinh', 'Quyết định', req({ values: [{ label: 'Đồng ý sửa', value: 'Tiếp thu' }, { label: 'Không đồng ý', value: 'Bảo lưu' }], layout: { columns: 5 } }))]),
        txt('Có ý kiến “Không đồng ý” → hồ sơ chuyển sang lập giải trình; đồng ý sửa toàn bộ → hoàn chỉnh hồ sơ.')] }),
      notes: () => ['DX-02 (đã duyệt, chờ BA): một nút "Hoàn thành"; gateway sau task 26 rẽ nhánh theo biến <code>coBaoLuu</code> (có dòng "Không đồng ý") — luật hiển thị không có điều kiện theo biến nên không chặn nút trên giao diện.',
        'AI kiểm tra xung đột (task 24), AI tóm tắt (task 25) là service task; kết quả chỉ xem.',
        'Comment #13, #15: khối "Gợi ý AI — đồng bộ ý kiến" (biến <code>aiDongBo</code> của service task 25) gộp ý kiến các CQCM theo mục BM-01 thành một hướng dẫn sửa; mục có ý kiến trái nhau thì nêu phương án thống nhất. Chỉ ĐVĐX thấy (task 26); CQCM không thấy phiếu của nhau (#14).'],
      write: (v) => {
        const resp = Object.assign({}, window.Flow.ui.resp);
        (v.quyetDinhYKien || []).forEach((r) => { if (r.quyetDinh === 'Bảo lưu' || resp[r.cqcm] !== 'Bảo lưu') resp[r.cqcm] = r.quyetDinh; });
        return { resp, coBaoLuu: (v.quyetDinhYKien || []).some((r) => r.quyetDinh === 'Bảo lưu') };
      } },

    27: { id: 'dtms-ms01-t27-hoan-chinh',
      schema: () => ({ components: [txt('### Việc cần sửa theo ý kiến đã tiếp thu\n{{viecCanSua}}'),
        txt('So sánh với phiên bản CQCM đã nhận xét: tab **Lịch sử phiên bản** ở Chi tiết hồ sơ. Hệ thống tạo phiên bản mới khi gửi.')] }),
      outputs: (h) => [h.tt()],
      notes: (h) => [`Các phiên bản sửa phải được CQCM kiểm tra và ký lại BM-04 cùng ${h.clName()} (task 35–37). Sửa trên ${h.tt()} (Văn bản đầu ra).`, 'G9: bảng so sánh v1 → v2 là DEV-1 (tab ở Chi tiết hồ sơ, làm cùng B1 ĐXMS).'] },

    28: { id: 'dtms-ms01-t28-giai-trinh', q: ['P-08', 'P-22'],
      schema: () => ({ components: [txt('Vòng giải trình **{{vongGiaiTrinh}}/2** · {{tongHopGiaiTrinh}}'),
        B.dl('giaiTrinh', 'Phụ lục 1 BM-02 — Bảng giải trình ý kiến', [txt('{{this.yKien}}', 7), txt('**{{this.quyetDinh}}**\n*Tham chiếu: {{this.thamChieu}}*', 3),
          ta('noiDung', 'Nội dung giải trình', req({ rows: 2, layout: { columns: 6 } }))])] }),
      outputs: () => ['BM-02'],
      notes: () => ['Hệ thống tăng vòng khi nhận giải trình (task 29). ≤ 2 vòng: hồ sơ quay lại chỉ huy ĐVĐX (task 13) rồi gửi CQCM lập lại BM-04. > 2 vòng: cảnh báo và yêu cầu họp (task 30–31).'],
      write: (v) => pick(v, ['giaiTrinh']) },

    31: { id: 'dtms-ms01-t31-to-chuc-hop', q: ['P-09'],
      schema: () => ({ components: [
        txt('### Cảnh báo vượt số vòng giải trình\nHồ sơ {{hoSo.ma}} đã qua **{{vongGiaiTrinh}}** vòng giải trình, vượt ngưỡng 2. Đã gửi yêu cầu họp tới đơn vị đề xuất, các CQCM và TTMS.'),
        dt('thoiGianHop', 'Thời gian', req({ layout: { columns: 8 } })), tf('diaDiemHop', 'Địa điểm', req({ layout: { columns: 8 } })),
        tags('thanhPhanHop', 'Thành phần', req({ valuesKey: 'nguoiDungOptions' })),
        tbl('Nội dung còn vướng mắc', 'nokGiaiTrinh', [['yKien', 'Ý kiến nhận xét'], ['quyetDinh', 'Tiếp thu / Bảo lưu'], ['giaiTrinh', 'Nội dung giải trình'], ['thamChieu', 'Tham chiếu']])] }),
      notes: () => ['Task 30 (hệ thống) đã gửi cảnh báo và yêu cầu họp tới ĐVĐX, các CQCM, TTMS. Thành phần họp chọn từ danh sách người dùng (E1).'],
      write: (v) => pick(v, ['thoiGianHop', 'diaDiemHop', 'thanhPhanHop']) },

    32: { id: 'dtms-ms01-t32-ket-qua-hop', q: ['P-09'],
      schema: () => ({ components: [txt('Biên bản họp: tải lên ở **Danh sách tài liệu** (bắt buộc).'),
        ta('ketLuanHop', 'Kết luận', req({ defaultValue: 'Các bên thống nhất phương án xử lý các ý kiến còn vướng mắc; đơn vị hoàn chỉnh hồ sơ theo kết luận cuộc họp.' }))] }),
      notes: () => ['Đã thống nhất → ĐVĐX hoàn chỉnh hồ sơ (task 27). Chưa thống nhất → TTMS trình cấp cao hơn (task 33).', 'E3: Biên bản họp là tài liệu bắt buộc của hành động (G7).'],
      write: (v) => pick(v, ['ketLuanHop']) },

    33: { id: 'dtms-ms01-t33-trinh-cap-cao', q: ['P-09'],
      schema: () => ({ components: [tbl('Nội dung chưa thống nhất', 'nokGiaiTrinh', [['yKien', 'Ý kiến nhận xét'], ['quyetDinh', 'Tiếp thu / Bảo lưu'], ['giaiTrinh', 'Nội dung giải trình'], ['thamChieu', 'Tham chiếu']])] }),
      notes: () => ['Sau họp vẫn chưa thống nhất: hồ sơ, biên bản (Danh sách tài liệu) và bảng giải trình được trình Thủ trưởng VHT kết luận (task 34).'] },

    34: { id: 'dtms-ms01-t34-ket-luan', q: ['P-09'], reasonField: 'ketLuan',
      schema: () => ({ components: [tbl('Nội dung chưa thống nhất', 'nokGiaiTrinh', [['yKien', 'Ý kiến nhận xét'], ['quyetDinh', 'Tiếp thu / Bảo lưu'], ['giaiTrinh', 'Nội dung giải trình']]),
        ta('ketLuan', 'Kết luận', req({ rows: 4, defaultValue: 'Chấp nhận giải trình của đơn vị; đơn vị hoàn chỉnh hồ sơ theo kết luận.' }))] }),
      notes: (h) => [`Thống nhất phương án → ĐVĐX hoàn chỉnh hồ sơ (task 27). Yêu cầu xử lý lại → hồ sơ về bước hoàn thiện dự thảo (task ${h.draftTask()}). Hai nút đều cần kết luận — là trường của form.`] },

    35: { id: 'dtms-ms01-t35-kiem-tra-sua',
      schema: () => ({ components: [txt('Thay đổi so với phiên bản đã nhận xét: tab **Lịch sử phiên bản** ở Chi tiết hồ sơ.'),
        txt('**Ý kiến của {{cqcmTen}} ở BM-04 lần 01**'), tbl('', 'yKienLan01', [['muc', 'Mục'], ['yKien', 'Ý kiến'], ['trangThai', 'Trạng thái xử lý']])] }),
      notes: () => ['"Chưa đạt" mở dialog nhận xét → hồ sơ quay về ĐVĐX hoàn chỉnh (task 27), các phiếu kiểm tra song song bị huỷ.', 'G9: so sánh phiên bản là DEV-1.'] },

    36: { id: 'dtms-ms01-t36-ky-checklist',
      schema: () => ({ components: [B.aiBox('kiểm tra đủ hồ sơ', '**Kết quả: {{aiHoSo.ketQua}}**\n{{aiHoSo.chiTiet}}'),
        tbl('Checklist hồ sơ', 'checklist', TT_COLS), txt('Chữ ký CQCM trên {{clName}} gắn với phiên bản v{{phienBan}} (VOffice — nút Ký).')] }),
      notes: (h) => [`Ký theo phiên bản v${h.version()}; không dùng lại kết quả ký của phiên bản cũ (N05). ${h.small() ? 'Luồng < 160 tỷ ký BM-04 + Checklist 02; các CQCM ký đủ → TTMS ‖ Phó TGĐ ký trên BM-09 (task 38 ‖ 39).' : 'Luồng ≥ 160 tỷ dùng Checklist 01; các CQCM ký đủ → AI soạn BM-05 (task 41).'}`, 'Dòng checklist do BE tính theo loại tài liệu đã có trên hồ sơ (§5.6).',
      'Comment #17 (Gợi ý AI, D-20): "kiểm tra đủ hồ sơ" = biến <code>aiHoSo</code> của service task chạy trước task 36, đối chiếu Checklist với tài liệu trên hồ sơ; chỉ xem, CQCM vẫn quyết định ký.'] },

    38: 'sign09', 39: 'sign09',

    42: { id: 'dtms-ms01-t42-ra-soat-bm05', q: ['P-10'], ai: true,
      schema: () => ({ components: [B.aiTable('bm05', 'BM-05 Báo cáo kết quả thẩm định — dự thảo AI soạn'),
        txt('Bản BM-05 hoàn chỉnh (mẫu Word + quyết định ở bảng trên) xem ở **Văn bản đầu ra**.')] }),
      outputs: () => ['BM-05'],
      notes: () => ['G2: AI soạn dự thảo BM-05 theo từng mục (task 41) từ hồ sơ, BM-04 và bảng giải trình; TTMS Chấp nhận / Sửa / Bỏ từng mục.', 'Xác nhận đủ điều kiện → hệ thống trình ký BM-05 cho TTMS qua VOffice (task 44); TTMS ký xong mới giao ký các thành phần còn lại (task 45).'],
      write: (v) => pick(v, ['bm05']) },

    43: { id: 'dtms-ms01-t43-du-dieu-kien', q: ['P-10'],
      schema: () => ({ components: [txt('### Đủ điều kiện giao ký BM-05\n- BM-05 đã được TTMS rà soát, cập nhật trên phiên bản hồ sơ v{{phienBan}}.\n- {{clName}} đã được các CQCM ký theo phiên bản hiện tại.'),
        tbl('BM-05 Báo cáo kết quả thẩm định', 'bm05View', [['muc', 'Mục'], ['noiDung', 'Nội dung']])] }),
      outputs: () => ['BM-05'] },

    46: 'sign05', 47: 'sign05',

    48: { id: 'dtms-ms01-t48-bao-cao-td',
      schema: () => ({ components: [txt('### BM-05 đã ký đủ\n- TTMS ký với tư cách CQCM về ĐTXD.\n- CQCM Tài chính/liên quan và Phó TGĐ chuyên trách đã ký.'),
        txt('### Xác định có cần báo cáo TGĐ Tập đoàn\n**Căn cứ:** {{canCuTd}}')] }),
      outputs: () => ['BM-05'],
      q: ['P-24'],
      notes: () => ['TTMS tự quyết định có báo cáo TGĐ Tập đoàn hay không; hệ thống không tự suy theo giá trị (N06). Có → AI soạn Công văn BM-06 (task 49). Không → hệ thống sinh dự thảo Quyết định BM-08 (task 57).',
        'MS01.02 là quy trình riêng → luật hiển thị theo quy trình khoá nút "Có báo cáo TGĐ Tập đoàn" (không cần điều kiện theo biến) — P-24.'] },

    50: 'bm06', 51: 'bm06', 53: 'td', 54: 'td', 55: 'td', 56: 'td',
    58: 'bm08', 59: 'bm08',
  };

  /* Tờ trình BM-01 / BM-09 (task 11, 12): nội dung từng mục (L1), "Sự cần thiết" theo gợi ý AI (G2), phụ lục + checklist chỉ xem. */
  const DRAFT = { id: 'dtms-ms01-t11-12-du-thao', q: ['P-07'], ai: true,
    schema: (h) => ({ components: [
      banner('Chỉ huy đơn vị trả lại: “{{traLai13.lyDo}}”. AI lọc nội dung chưa đạt: {{traLai13.loc}}', '=traLai13 = null'),
      Object.assign(B.dl('phanHoiChiHuy', 'Phản hồi chỉ đạo của chỉ huy — phần không sửa phải có giải trình', [
        txt('**{{this.phan}}**\n{{this.chiDao}}', 7),
        rad('xuLy', 'Xử lý', req({ values: opts(['Đã sửa', 'Không sửa']), layout: { columns: 4 } })),
        ta('giaiTrinh', 'Giải trình', req({ rows: 2, layout: { columns: 5 }, conditional: { hide: '=this.xuLy != "Không sửa"' } }))]), hide('=traLai13 = null')),
      banner('AI kiểm tra hồ sơ: Không đạt — {{aiCheck.lyDo}} Hồ sơ chưa được gửi.', '=aiCheck = null'),
      grp(`Tờ trình ${h.tt()} — nội dung các mục`, [
        B.aiTable('aiSuCanThiet', '1. Sự cần thiết (gợi ý AI)'),
        ta('mucDich', '2. Mục đích', req()), ta('phamVi', '3. Phạm vi, quy mô', req()),
        txt('**4. Tổng kinh phí (gồm VAT):** {{tongKinhPhi}}'),
        ta('phuongPhap', '5. Phương pháp tính, cơ sở đơn giá'), ta('phuongAn', '6. Phương án kỹ thuật – công nghệ'),
        tf('nguonVonTt', '7. Nguồn vốn', { layout: { columns: 8 } }), txt('**8. Sử dụng hàng tồn kho** (câu tự động)\n“{{cauTonKho}}”', 8),
        ta('bienPhap', '9. Biện pháp thực hiện'), ta('keHoach', '10. Kế hoạch tổ chức thực hiện')]),
      tbl('Phụ lục chi phí', 'phuLucChiPhi', [['n', 'STT'], ['hang', 'Hàng hoá'], ['sl', 'SL mua'], ['donGia', 'Đơn giá'], ['thanhTien', 'Thành tiền'], ['coSo', 'Cơ sở giá'], ['loai', 'Loại chi phí']]),
      tbl(h.clName(), 'checklist', TT_COLS),
      txt(`*Văn bản ${h.tt()} hoàn chỉnh và BM-02 (thuyết minh) xem ở Văn bản đầu ra — sinh từ dữ liệu form này và mẫu Word.*`)] }),
    outputs: (h) => [h.tt(), 'BM-02'],
    notes: (h) => [`G4: tab của bản cũ tách thành nội dung từng mục (trường form), Phụ lục chi phí và ${h.clName()} (khối chỉ xem, BE tính theo tài liệu đã có trên hồ sơ), văn bản hoàn chỉnh ở Văn bản đầu ra, tệp ở Danh sách tài liệu.`,
      'DX-01 (đã duyệt, chờ BA): bấm Gửi → service task AI kiểm tra hồ sơ → Không đạt thì quay lại chính task này, form hiện lý do (biến <code>aiCheck</code>). Prototype mô phỏng: hồ sơ ở lại bước dự thảo.',
      '"Sự cần thiết" để trống tới khi người dùng chọn quyết định cho gợi ý AI (khác mặc định Chấp nhận của G2) — để demo được nhánh AI Không đạt.',
      `Chỉ huy không đồng ý → AI lọc nội dung chưa đạt (task 14), hồ sơ về task ${h.draftTask()}.`,
      'Comment #10: hồ sơ bị chỉ huy trả lại → bảng "Phản hồi chỉ đạo" theo từng phần Không đạt; chọn "Không sửa" thì Giải trình bắt buộc (validate của form). Lần duyệt sau, chỉ huy thấy giải trình ở task 13.']
      .concat(h.small() ? ['Luồng < 160 tỷ: Tờ trình BM-09 + Checklist 02 thay BM-01 + Checklist 01 (P-19). BM-09 thêm ô PHÊ DUYỆT và khối chữ ký thẩm định — Thủ trưởng phê duyệt ngay trên văn bản (task 60).'] : []),
    write: (v) => Object.assign(pick(v, ['aiSuCanThiet', 'mucDich', 'phamVi', 'phuongPhap', 'phuongAn', 'nguonVonTt', 'bienPhap', 'keHoach', 'phanHoiChiHuy']),
      { necessity: window.EVars.h.aiFinal((v.aiSuCanThiet || [])[0]) || '' }),
    gate: (out, h) => (out.necessity ? null : { key: 'aiCheck', lyDo: `${h.tt()} thiếu mục bắt buộc “Sự cần thiết” (QT 10.2.1, ${h.tt()} mục 1).`,
      toast: `AI kiểm tra hồ sơ: Fail — ${h.tt()} thiếu mục “Sự cần thiết”. Hồ sơ chưa được gửi.` }) };

  const SIGN09 = { id: 'dtms-ms01-t38-39-ky-bm09', q: ['P-20'],
    schema: () => ({ components: [tbl('Khối chữ ký BM-09 (kết quả ký từ VOffice)', 'kyBm09', SIGN_COLS), txt('BM-09 bản trình ký (phiên bản v{{phienBan}}) xem ở **Văn bản đầu ra**; Checklist 02, BM-04, BM-02 ở Danh sách tài liệu.')] }),
    outputs: () => ['BM-09'],
    notes: () => ['Luồng < 160 tỷ không lập BM-05: TTMS ‖ Phó TGĐ ký song song trên BM-09 (task 38 ‖ 39); hệ thống tổng hợp kết quả ký từ VOffice (task 40) rồi trình Thủ trưởng (task 60).',
      'Ô CQCM trên BM-09 không ký riêng: ý kiến đã thể hiện qua BM-04 + Checklist 02 (P-20). Không đồng ý → dialog nhận xét; hệ thống huỷ lượt ký còn lại, AI tóm tắt lý do, trả ĐVĐX (task 25 → 26 — P-18).'] };
  const SIGN05 = { id: 'dtms-ms01-t46-47-ky-bm05', q: ['P-11', 'P-12'],
    schema: () => ({ components: [tbl('Người ký BM-05 (kết quả ký từ VOffice)', 'kyBm05', [['nguoiKy', 'Người ký'], ['tuCach', 'Đơn vị / tư cách'], ['trangThai', 'Trạng thái'],
      ['trinhLuc', 'Trình ký lúc'], ['kyLuc', 'Ký lúc'], ['thoiGian', 'Thời gian xử lý'], ['kpi', 'KPI ký'], ['lyDo', 'Lý do từ chối (VOffice)']]),
      B.aiBox('đánh giá KPI người ký', '{{aiKpiKy}}')] }),
    outputs: () => ['BM-05'],
    notes: () => ['TTMS ký trước (task 44); CQCM Tài chính/liên quan (task 46) ‖ Phó TGĐ chuyên trách (task 47) ký song song. Ba trạng thái riêng: Không ký / Chưa ký / Không đồng ý. Một bên không đồng ý → hệ thống tóm tắt lý do, trả ĐVĐX (task 25).',
      'Comment #18, #19, #21: thời điểm trình ký, thời điểm ký và lý do từ chối lấy từ kết quả ký VOffice (tích hợp). Từ chối trên VOffice bắt buộc lý do; trên hệ thống, nút "Không đồng ý" mở dialog nhận xét (G6).',
      'Comment #20: Thời gian xử lý, KPI ký do BE tính theo lịch ngày làm việc (định mức ký 0,5 NLV — mẫu); dòng AI là Gợi ý AI tĩnh (D-20). Báo cáo KPI theo bước làm ở module Báo cáo (nhóm C).'] };
  const BM06 = { id: 'dtms-ms01-t50-51-bm06', ai: true,
    schema: (h, tok) => ({ components: [txt('AI soạn Công văn **BM-06** báo cáo TGĐ Tập đoàn từ BM-05 và hồ sơ — xem ở **Văn bản đầu ra**.')]
      .concat(tok.task === 51 ? [txt('Tệp đính kèm khi xác nhận: tải lên ở **Danh sách tài liệu** (bắt buộc ở cả hai lựa chọn).')] : []) }),
    outputs: () => ['BM-06'],
    notes: (h, tok) => ['Bước con báo cáo Tập đoàn (49–56) hiện ở card Quy trình.'].concat(tok.task === 51 ? ['BBLV 22/09: đính kèm tệp ở cả hai lựa chọn Đồng ý / Không đồng ý — E3, BE kiểm trước khi chuyển bước.'] : []) };
  const TD = { id: 'dtms-ms01-t53-56-tap-doan',
    schema: (h, tok) => ({ components: [txt(`### ${{ 53: 'Ban ĐTXD xem xét hồ sơ, lập BM-07', 54: 'Gửi BM-07 tới TGĐ Tập đoàn', 55: 'Thông báo đồng thời cho TTMS và đầu mối đơn vị', 56: 'TGĐ Tập đoàn xem xét, cho ý kiến' }[tok.task]}\n{{voffice}}`)] }),
    outputs: () => ['BM-06'],
    q: ['P-13'],
    notes: () => ['Giả lập phía Tập đoàn: trong thực tế kết quả về ĐTMS qua VOffice (tích hợp), không có người dùng Tập đoàn đăng nhập.'] };
  const BM08 = { id: 'dtms-ms01-t58-60-bm08', q: ['P-14'],
    schema: (h, tok) => ({ components: [txt('Dự thảo **Quyết định BM-08** do hệ thống sinh — xem ở **Văn bản đầu ra**. Hồ sơ kèm theo (Checklist, BM-02, BM-04, BM-05…) ở Danh sách tài liệu.')]
      .concat(tok.task === 60 ? [
        txt('### Ý kiến của TGĐ Tập đoàn\n{{yKienTd.tomTat}}\n*Phiếu nhận xét của Tập đoàn: {{yKienTd.tep}}*', 16, '=not(yKienTd.co)'),
        B.aiBox('đọc nhận xét Tập đoàn, hướng dẫn hoàn thiện', '{{yKienTd.ai}}', '=not(yKienTd.co)')] : []) }),
    outputs: () => ['BM-08'],
    notes: (h, tok) => ['Dự thảo BM-08 do hệ thống tự sinh (task 57) từ mẫu Word + dữ liệu hồ sơ.']
      .concat(tok.task === 60 ? ['Sau phê duyệt: "Tạo gói thầu (Đợt 2)" liên thông Kế hoạch LCNT — ngoài phạm vi. Yêu cầu hoàn chỉnh → dialog nhận xét, AI tóm tắt nội dung cần sửa, trả ĐVĐX (task 25).',
        'Comment #22: hồ sơ có báo cáo Tập đoàn → Danh sách tài liệu có dòng "Phiếu nhận xét của Tập đoàn" kèm nút Tải lên (khi không nhận được qua VOffice); không bắt buộc. Comment #23: khối Gợi ý AI đọc phiếu đã có (biến <code>yKienTd</code> của service task) và gợi ý nội dung cần hoàn thiện.'] : [])
      .concat(window.Flow.state.vars.process === 'MS01.02' ? ['MS01.02: hồ sơ kèm không có BM-06, BM-07 (không báo cáo Tập đoàn — P-24).'] : []) };
  const APPROVE09 = { id: 'dtms-ms01-t60-phe-duyet-bm09', q: ['P-18', 'P-21'],
    schema: () => ({ components: [txt('**KPI thẩm định:** {{kpi}} · **Phiên bản trình:** v{{phienBan}}'), tbl('Khối chữ ký BM-09', 'kyBm09', SIGN_COLS),
      txt('BM-09 đã đủ chữ ký thẩm định — xem ở **Văn bản đầu ra**.')] }),
    outputs: () => ['BM-09'],
    notes: (h) => ['Không có Quyết định riêng (BM-08): Thủ trưởng ký ô "PHÊ DUYỆT" trên Tờ trình BM-09. Yêu cầu hoàn chỉnh → dialog nhận xét, AI tóm tắt, trả ĐVĐX (task 25 → 26, P-18).',
      `KPI thẩm định MS01.03: ${window.D.kpiLimit[h.proc()] || 20} NLV từ lúc gửi CQCM (task 18) tới phê duyệt (task 60) — BE tính theo lịch ngày làm việc (P-21).`] };

  const ALIAS = { draft: DRAFT, sign09: SIGN09, sign05: SIGN05, bm06: BM06, td: TD, bm08: BM08 };
  window.EForms.MS01 = (tok, h) => {
    if (tok.task === 60) return h.small() ? APPROVE09 : BM08;
    const e = F[tok.task];
    return typeof e === 'string' ? ALIAS[e] : e || null;
  };
})();
