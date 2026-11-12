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
  const sel = inp('select'), rad = inp('radio'), chkl = inp('checklist'), tags = inp('taglist'), chk = inp('checkbox'), file = inp('filepicker');
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
  /* Bảng quyết định hai lựa chọn (góp ý người dùng 06/11, task 11 / 12): Chấp nhận / Từ chối, lựa chọn nào cũng mở ô nhận xét.
     Chấp nhận → nhận xét không bắt buộc, Tờ trình dùng gợi ý AI. Từ chối → nhận xét bắt buộc = nội dung thay thế gợi ý (vào Tờ trình). */
  const AI2 = opts(['Chấp nhận', 'Từ chối']);
  /* Bước 26: quyết định của đơn vị với ý kiến Không OK của CQCM (giá trị giữ Tiếp thu / Bảo lưu cho gateway coBaoLuu). */
  const YK = [{ label: 'Đồng ý sửa', value: 'Tiếp thu' }, { label: 'Không đồng ý', value: 'Bảo lưu' }];
  const aiTable2 = (path, label) => dl(path, label, [
    txt('**{{this.muc}}**', 3), txt('{{this.goiY}}\n*Nguồn: {{this.nguon}}*', 8),
    rad('quyetDinh', 'Quyết định', { values: AI2, layout: { columns: 5 } }),
    ta('nhanXet', 'Nhận xét', { conditional: { hide: '=this.quyetDinh != "Chấp nhận"' } }),
    ta('noiDungSua', 'Nhận xét — nội dung thay thế gợi ý', req({ conditional: { hide: '=this.quyetDinh != "Từ chối"' } }))]);
  /* Bảng lặp người dùng thêm / xoá dòng (comment #3: NCC mới). */
  const dlAdd = (path, label, components) => ({ type: 'dynamiclist', path, label, isRepeating: true, allowAddRemove: true, defaultRepetitions: 0, components });
  /* Khung "Gợi ý AI" tĩnh (D-20): kết quả service task AI ghi vào biến, chỉ xem (S5) — group có custom property variant = ai
     (thuộc tính `properties` của Camunda form-js) bọc một text markdown có {{FEEL}}. */
  const aiBox = (title, text, h) => Object.assign({ type: 'group', label: '✦ Gợi ý AI — ' + title, properties: { variant: 'ai' }, components: [txt(text)] }, hide(h));
  const B = { L, hide, txt, banner, tbl, tf, ta, num, dt, sel, rad, chkl, tags, chk, file, req, grp, dl, dlAdd, opts, aiTable, aiTable2, aiBox };
  window.EForms = window.EForms || {};
  window.EForms.b = B;

  /* Review nhi 06/11 #29: bỏ cột Số văn bản; dòng đã có tệp thì tải về được. */
  const TT_COLS = [['nhom', 'Nhóm'], ['muc', 'Danh mục hồ sơ'], ['yeuCau', 'Yêu cầu'], ['tinhTrang', 'Tình trạng'], ['tep', 'Tệp']];
  const SIGN_COLS = [['nguoiKy', 'Người ký'], ['tuCach', 'Tư cách'], ['trangThai', 'Trạng thái'], ['thoiDiem', 'Thời điểm']];
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});

  const F = {
    /* T29 B12 (D-81, Huylx4 #15–19): bước 1 không chọn lại căn cứ — căn cứ đã chọn ở Thêm mới luồng (SCR-96); hộp thoại Hoàn thành chỉ xác nhận.
       Văn bản căn cứ và giá trị còn khả dụng là khối chỉ xem ở Thông tin chung của màn xử lý (screens.js basisAvail). BPMN không đổi, chỉ eForm. */
    1: { id: 'dtms-ms01-t01-can-cu', q: ['P-01', 'P-26'],
      schema: () => ({ components: [
        txt('Xác nhận căn cứ của hồ sơ — đã chọn khi tạo luồng mua sắm. Văn bản căn cứ và giá trị còn khả dụng xem ở **Thông tin chung**; giá trị vượt căn cứ bị chặn khi chốt báo giá.')] }),
      notes: () => ['<b>T29 B12 (D-81, review Huylx4 #15–19 "Bỏ")</b>: bước 1 không chọn lại căn cứ — căn cứ (tệp có Loại tài liệu căn cứ, dòng dự toán bóc tách) đã chọn ở Thêm mới luồng mua sắm (SCR-96). Hộp thoại Hoàn thành chỉ xác nhận; bỏ Loại căn cứ, Văn bản căn cứ đã phê duyệt, bảng căn cứ theo loại, căn cứ bổ sung, bảng căn cứ đã chọn.',
        '<b>Văn bản căn cứ và giá trị còn khả dụng</b> (Giá trị, Đã dùng ở ĐXMS khác, ĐXMS này đang giữ, Còn có thể sử dụng) và <b>Dòng dự toán đã bóc tách</b> là khối chỉ xem ở Thông tin chung của màn này. Vẫn chặn vượt căn cứ ở bước 10 (P1, BR-DXMS-04-11). BPMN không đổi, chỉ đổi eForm.',
        'Giá trị được kiểm tra sau báo giá (cổng "Giá trị khớp quy trình đã chọn?" sau task 10). Hoàn thành → hệ thống lấy dữ liệu (task 02), AI gợi ý thông tin cơ bản (task 03).'] },

    4: { id: 'dtms-ms01-t04-thong-tin-co-ban', q: ['P-02', 'P-26'],
      schema: () => ({ components: [
        banner('Giá trị dự kiến khoảng {{aiEstimate}} tỷ, lệch điều kiện của quy trình {{hoSo.quyTrinh}} ({{hoSo.dieuKien}}). Hệ thống sẽ kiểm tra lại sau khi có báo giá.', '=not(aiEstimateOff)'),
        tf('tenDeXuat', 'Tên đề xuất', req()),
        sel('purposeCode', 'Nhóm mục đích mua sắm', req({ values: opts([['DT', 'Duy trì hoạt động thường xuyên'], ['SX', 'Bảo đảm tính liên tục của hoạt động SXKD'], ['KHCN', 'Triển khai các hoạt động KHCN'], ['QP', 'Nhiệm vụ QP-AN, chính trị, nhiệm vụ đặc thù']]), layout: { columns: 8 }, description: 'Theo Khoản 4 Điều 2 Quy chế (QC-12868).' })),
        sel('fund', 'Nguồn vốn', req({ valuesKey: 'fundOptions', searchable: true, layout: { columns: 8 } })),
        rad('secret', 'Mật', req({ values: [{ label: 'Không', value: false }, { label: 'Có', value: true }], layout: { columns: 8 }, description: 'Mặc định theo lựa chọn khi tạo luồng mua sắm.' })),
        B.aiTable('aiGoiY', 'Thông tin cơ bản theo căn cứ (AI gợi ý) — Mục đích; Phạm vi, quy mô; Giá trị, Nguồn vốn, Thời gian; Biện pháp, Kế hoạch tổ chức thực hiện. Kết quả xác nhận là đầu vào Tờ trình BM-01 / BM-09')] }),
      notes: () => ['<b>Căn cứ</b>: BPMN MS01 v1.1 task 4 — "Rà soát, xác nhận mục đích; phạm vi/quy mô; giá trị, nguồn vốn, thời gian; biện pháp/kế hoạch thực hiện và độ Mật của ĐXMS trước khi lập dự thảo hồ sơ. Biểu mẫu: Thông tin cơ bản; đầu vào BM-01 (≥160 tỷ) / BM-09 (<160 tỷ)". Các dòng của bảng theo thứ tự mục 1–6 của BM-01 / BM-09 (BM-10.2.1): 1 Mục đích, 2 Phạm vi quy mô, 3 Giá trị, 4 Nguồn vốn và thời gian, 6 Biện pháp và kế hoạch tổ chức thực hiện.',
        'Gợi ý AI (G2): service task 03 ghi biến <code>aiGoiY</code> theo từng mục kèm nguồn trích; mỗi mục một dòng bảng lặp, mặc định Chấp nhận (= "Chấp nhận tất cả"), chọn lại là "Hoàn tác". Giá trị cuối của mục (Chấp nhận → gợi ý, Sửa → nội dung sửa, Bỏ → rỗng) điền sẵn các mục tương ứng của dự thảo Tờ trình ở task 11 / 12. ❓ AI phải trả kết quả theo từng mục kèm nguồn. <b>GIẢ LẬP</b>: nội dung gợi ý là dữ liệu mẫu của hồ sơ demo, không trích từ tài liệu thật.',
        'Biện pháp thực hiện theo hướng dẫn BM-01 mục 6: mua sắm theo Luật Đấu thầu hay theo Quy chế lựa chọn nhà thầu của Tập đoàn; Kế hoạch tổ chức thực hiện: các bước, đầu mối, thời hạn.',
        'Nhóm mục đích theo Khoản 4 Điều 2 Quy chế QC-12868 (BM-01 mục 1 yêu cầu "bám sát theo các mục đích tại Khoản 4 Điều 2 Quy chế"); nội dung mục đích chi tiết ở dòng Mục đích của bảng.',
        'Nguồn vốn chọn từ danh mục Nguồn vốn (BE nạp <code>fundOptions</code>, bỏ nguồn dừng hoạt động — P-33). Mặc định là nguồn vốn AI trích từ căn cứ.',
        'Cảnh báo mềm (không chặn) khi giá trị dự kiến lệch điều kiện quy trình (biến <code>aiEstimateOff</code> do task 03 ghi); kiểm tra chính thức ở cổng sau task 10.',
        'Mật mặc định theo lựa chọn khi tạo luồng, đổi được ở đây; hồ sơ Mật thì mặc định ký ngoài hệ thống (Ký tay). Mức ưu tiên không thuộc nội dung task 4 — chọn khi tạo luồng (kèm Lý do ưu tiên), hiện ở Thông tin chung. Tên, người phụ trách, quy trình nằm ở Thông tin chung.'] },

    5: { id: 'dtms-ms01-t05-boc-tach', q: ['P-03'],
      schema: () => ({ components: [
        tbl('Dòng dự toán đề tài / dự án đã bóc tách', 'duToanChon', [['loai', 'Loại chi phí'], ['khoanMuc', 'Khoản mục chi phí'], ['dvt', 'ĐVT'], ['sl', 'Số lượng đề xuất'],
          ['giaTri', 'Giá trị dự tính (tỷ)'], ['duToan', 'Giá trị dự toán (tỷ)'], ['goiThau', 'Hình thành gói thầu']], '=count(duToanChon) = 0'),
        txt('### Cấu trúc căn cứ\n{{basisTreeText}}\n*Nguồn bóc tách: {{bocTachNguon}}*'),
        B.dl('bocTach', 'Bóc tách danh mục hàng hoá', [
          txt('**{{this.n}}. {{this.name}}**\nĐVT: {{this.uom}} · {{this.nhom}}', 5),
          txt('SL gốc **{{this.bom}}** · đã dùng {{this.used}} · còn lại **{{this.remainText}}**', 5),
          num('prop', 'SL đề xuất', { validate: { required: true, min: 0 }, layout: { columns: 3 }, conditional: { hide: '=this.bo' } }),
          chk('bo', 'Bỏ hạng mục', { text: 'Bỏ khỏi ĐXMS', layout: { columns: 3 } }),
          txt('{{if not(this.bo) and this.remain != null and this.prop > this.remain then "**Vượt số còn lại**" else ""}}', 16, '=this.bo'),
          txt('*{{this.warn}}*', 16, '=this.warn = ""')]),
        /* T29 B12 (review Huylx4 #20): thêm hạng mục lấy từ dự toán đề tài / dự án của luồng. */
        B.dlAdd('hangMucThem', 'Thêm hạng mục từ dự toán đề tài / dự án', [
          sel('line', 'Khoản mục dự toán', req({ valuesKey: 'duToanLineOptions', searchable: true, layout: { columns: 12 } })),
          num('sl', 'SL đề xuất', { validate: { required: true, min: 1 }, layout: { columns: 4 } })])] }),
      notes: (h) => ['T29 S8 (D-60): bảng "Dòng dự toán đề tài / dự án đã bóc tách khi tạo luồng" là khối chỉ xem (loại 3) đọc biến <code>duToanChon</code> do BE ghi khi start từ hạng mục của ĐXMS (Thêm mới luồng mua sắm); ẩn khi không có dòng.',
        '<b>T29 B12 (review Huylx4 #20)</b>: ĐVĐX <b>bớt</b> hạng mục (ô Bỏ khỏi ĐXMS trên từng dòng) và <b>thêm</b> hạng mục từ dự toán đề tài / dự án của luồng (bảng lặp chọn Khoản mục dự toán — khoản mục TTMS đã tích Chi mua sắm, chưa Hoàn thành, nhãn có Loại chi phí, Nguồn vốn, ĐVT, khối lượng và giá trị dự toán; nhập SL đề xuất). Danh sách hạng mục mới dùng cho rà soát tồn kho, YCBG, báo giá (biến <code>bocTachEdit</code>; BE ghi lại danh mục hàng hoá của hồ sơ). Hạng mục thêm chưa có báo giá mẫu — nhập giá ở bước 10. Phải còn ít nhất một hạng mục. Đơn giá dự toán / Ngành hàng của hạng mục thêm: GIẢ LẬP.', `Trừ lùi: số đã dùng ở ĐXMS khác bị trừ khỏi số lượng gốc của căn cứ.${window.D.items.filter((i) => i.used).map((i) => ` Dòng ${i.n} đã dùng ${i.used} ở ĐXMS khác nên còn ${i.bom - i.used}.`).join('')}`,
        'G3: cột "Vượt số còn lại" là cảnh báo ngay trong dòng; chặn thật ở BE khi submit (validator theo quy trình) — luật hiển thị không có điều kiện theo biến.',
        'Dòng không có trong dự toán/eBOM: chỉ cảnh báo, không chặn (BBLV 09/09). Căn cứ thiếu thông tin → nút "Thiếu thông tin căn cứ" (quay lại task 04).'],
      write: (v) => {
        /* Hạng mục thêm: n từ 101, giá dự tính = đơn giá dự toán (giá trị / khối lượng), ngành hàng mặc định VTCNTT — GIẢ LẬP. */
        const nv = (window.Flow.findDxms(window.Flow.state.dxms) || {}).nv, lines = nv ? window.D.duToanOf(nv) : [];
        const add = (v.hangMucThem || []).filter((r) => r.line).map((r, i) => {
          const l = lines.find((x) => x.id === r.line) || {}, sl = Number(r.sl) || 0, price = l.qty ? l.value / l.qty : l.value || 0;
          return { n: 101 + i, name: l.item, uom: l.uom || 'Gói', bom: l.qty == null ? null : l.qty, used: 0, prop: sl, stock: null, buy: sl, price, amount: Math.round(price * sl * 100) / 100,
            group: 1, goods: 'VTCNTT', cost: 'TSCĐ', line: l.id, warn: 'Hạng mục thêm từ dự toán đề tài / dự án ở bước bóc tách' };
        });
        return { bocTach: v.bocTach, hangMucThem: v.hangMucThem || [], bocTachEdit: { drop: (v.bocTach || []).filter((r) => r.bo).map((r) => r.n), add } };
      } },

    7: { id: 'dtms-ms01-t07-ra-soat-ton-kho', q: ['P-04'],
      schema: () => ({ components: [
        txt('Kết quả rà soát tồn kho của Phòng Quản lý tài sản: **{{stock.trangThai}}** · {{stock.ma}} · {{stock.gui}}'),
        banner('Phòng Quản lý tài sản chưa nhập kết quả rà soát tồn kho — chưa xác nhận được bước này.', '=khoXong'),
        B.dl('ruaSoatKho', 'Kết quả rà soát', [
          txt('**{{this.n}}. {{this.name}}**\nSL đề xuất: {{this.prop}}', 5),
          txt('Tồn kho **{{this.book}}** · đang giữ {{this.held}} · khả dụng **{{this.avail}}** · Kho xuất **{{this.khoOut}}**', 5),
          num('fromStock', 'Dùng từ kho', { validate: { min: 0 }, layout: { columns: 3 }, conditional: { hide: '=not(this.coKho)' } }),
          txt('SL mua: **{{this.prop - this.fromStock}}**', 3)])] }),
      notes: () => ['<b>Review nhi 06/11 #21, #31–33:</b> nút <b>Cập nhật kết quả rà soát</b> trên màn xử lý mở SCR-105; Kho nhập ngay trên màn (bỏ hộp thoại), bấm <b>Gửi Chỉ huy Kho</b> là lưu kết quả và hoàn thành bước 07, không còn nút Hoàn thành riêng. Dùng từ kho = SL xuất kho Kho nhập.', '<b>T29 B16 — DX-10 (c):</b> bước 07 là việc của <b>Chuyên quản Kho</b> trên sơ đồ (trước đây ĐVĐX nhận kết quả, Kho làm ngoài sơ đồ); Kho nhập kết quả ở nút Cập nhật kết quả rà soát trên màn, rồi Hoàn thành → Chỉ huy Kho duyệt (07.1). Hồ sơ Điều chỉnh MS02 giữ cách cũ.', '<b>T29 B3a + B5 (D-82):</b> kết quả rà soát do <b>Phòng Quản lý tài sản / Thủ kho</b> nhập <b>một lần</b> ở việc Rà soát tồn kho (SCR-105, ngoài sơ đồ) theo cột biên bản BM-RSTK (SL tồn kho, SL xuất kho, SL điều chuyển, SL cần mua, hợp đồng đầu vào, vị trí) — lệch "hai lần" của BR-DXMS-03-01 / BPMN bước 7, câu hỏi DTMS_Q_0143. Bước này chỉ xác nhận được khi Kho đã nhập; Dùng từ kho mặc định bằng SL xuất kho Kho ghi, ĐVĐX chỉnh được trong tồn khả dụng. Mọi hạng mục dùng hết từ kho thì không xác nhận được (BR-DXMS-03-06). GIẢ LẬP P-196: Kho nhập tay, chưa tích hợp WMS / QLTS.', 'Biến <code>stock</code> do service task 06 ghi (tích hợp hệ thống kho — người dùng xác nhận 2026-10-07). Theo S5 màn hiện cả trạng thái "Chưa có kết quả / Lỗi tích hợp". ❓ Chi tiết hệ thống kho (API, mã hàng đối chiếu, tồn sổ sách / đang giữ) chưa rõ.',
        'Khả dụng = SL tồn kho − hàng đang giữ cho tờ trình khác; mặc định dùng từ kho = SL xuất kho Kho ghi (không vượt khả dụng, số đề xuất). Hạng mục dùng hết từ tồn kho: SL mua = 0, không đưa vào YCBG.',
        'Bước con Gửi yêu cầu → Kho trả kết quả → Xác nhận hiện ở card Quy trình và Lịch sử hồ sơ (khung chung).'],
      write: (v) => pick(v, ['ruaSoatKho']) },

    /* T29 B16 — DX-10 (D-83): bốn bước chỉ huy duyệt trên ĐTMS. Duyệt = hộp thoại xem tóm tắt + Ý kiến (không bắt buộc);
       Trả lại = nút có lý do bắt buộc (dialog nhận xét G6, không mở form). Nội dung chi tiết xem ở card trên màn xử lý (Kho, báo giá) hoặc Danh sách tài liệu. */
    '5.1': { id: 'dtms-ms01-t05-1-chi-huy-xac-nhan', q: ['P-210'],
      schema: () => ({ components: [
        txt('Xác nhận khởi tạo hồ sơ **{{tenHoSo}}** và danh mục bóc tách trước khi gửi Phòng Quản lý tài sản rà soát tồn kho.'),
        tbl('Danh mục hàng hoá đã bóc tách', 'bocTachXem', [['n', 'STT'], ['hang', 'Hàng hoá / dịch vụ'], ['dvt', 'ĐVT'], ['sl', 'SL đề xuất']]),
        ta('yKien', 'Ý kiến', { rows: 2, validate: { maxLength: 2000 } })] }),
      notes: () => ['<b>DX-10 (b), D-83:</b> bước mới — Chỉ huy ĐVĐX xác nhận khởi tạo trước khi gửi Kho; bỏ qua khi người khởi tạo là Chỉ huy ĐVĐX (biến <code>creatorCh</code>, cổng đọc vai trò người khởi tạo). Trả lại → Chuyên quản ĐVĐX sửa bóc tách. Chưa có trên BPMN MS01 v1.1 — chờ BA vẽ lại. GIẢ LẬP P-210 (vai trò, thời hạn).'],
      write: (v) => pick(v, ['yKien']) },
    '7.1': { id: 'dtms-ms01-t07-1-chi-huy-kho-duyet', q: ['P-210', 'P-187'],
      schema: () => ({ components: [
        /* [T59 Q9] bỏ "và Biên bản rà soát vật tư, linh kiện tồn kho" — không còn biên bản sinh. */
        txt('Duyệt kết quả rà soát tồn kho của hồ sơ **{{tenHoSo}}** (bảng kết quả, tệp kết quả và biên bản kiểm đếm ở tab Rà soát tồn kho).'),
        ta('yKien', 'Ý kiến', { rows: 2, validate: { maxLength: 2000 } })] }),
      notes: () => ['<b>DX-10 (d), D-83:</b> bước mới — Chỉ huy Kho duyệt kết quả rà soát (card Kết quả rà soát tồn kho trên màn) và biên bản; Trả lại → Kho rà soát lại (bước 07). Duyệt trên ĐTMS, không qua VOffice. Chân ký biên bản GIẢ LẬP P-187.'],
      write: (v) => pick(v, ['yKien']) },
    '10.1': { id: 'dtms-ms01-t10-1-chi-huy-thau-duyet', q: ['P-210'],
      schema: () => (window.D.quoteManual ? { components: [
        txt('Phê duyệt kết quả báo giá của Thầu TTMS: Giá trị báo giá cuối cùng **{{giaTriBaoGiaTxt}}** (gồm VAT).'),
        tbl('Tệp báo giá của nhà cung cấp', 'baoGiaTep', [['ncc', 'Nhà cung cấp'], ['tep', 'Tệp báo giá']]),
        txt('{{if ghiChuBaoGia = null or ghiChuBaoGia = "" then "" else "**Ghi chú của Thầu:** " + ghiChuBaoGia}}'),
        ta('yKien', 'Ý kiến', { rows: 2, validate: { maxLength: 2000 } })] } : { components: [
        txt('Duyệt kết quả báo giá của Thầu TTMS: Tổng giá trị theo cơ sở giá **{{tongBaoGia}} tỷ đồng** (gồm VAT). Bảng so sánh, cơ sở giá, đối chiếu phần căn cứ xem ở card Đánh giá báo giá trên màn.'),
        ta('yKien', 'Ý kiến', { rows: 2, validate: { maxLength: 2000 } })] }),
      title: 'Phê duyệt kết quả báo giá',
      notes: () => (window.D.quoteManual ? ['<b>Review nhi 06/11 #7:</b> Chỉ huy Thầu phê duyệt kết quả báo giá — <b>Đồng ý</b> → cổng Giá trị đặt luồng con theo Giá trị báo giá cuối cùng; <b>Từ chối</b> (lý do bắt buộc) → về bước 10 của nhân viên Thầu. Form chỉ xem: giá trị cuối cùng, tệp báo giá đã tải (Danh sách tài liệu), ghi chú của Thầu; card Đánh giá báo giá tạm ẩn (P-219).'] : []).concat(['<b>DX-10 (f), D-83:</b> bước mới — Chỉ huy Thầu TTMS duyệt báo giá tổng hợp (card Đánh giá báo giá chỉ xem); Duyệt → hệ thống đặt luồng con theo Tổng giá trị (cổng Giá trị), Trả lại → Thầu tổng hợp lại (bước 10). Duyệt trên ĐTMS.']),
      write: (v) => pick(v, ['yKien']) },
    /* Review nhi 06/11 #30, #38: form hiện đủ nội dung phiếu BM-03 để người duyệt đọc và góp ý ngay; một nút mở màn phê duyệt, trong màn chọn Đồng ý / Từ chối. */
    '16.1': { id: 'dtms-ms01-t16-1-chi-huy-duyet-bm03', q: ['P-210'], preview: () => ['BM-03'], title: 'Phê duyệt phiếu yêu cầu thẩm định',
      decide: { btn: 'Phê duyệt phiếu yêu cầu thẩm định', yes: 'Đồng ý', no: 'Từ chối', reasonKey: 'yKien' },
      schema: () => ({ components: [
        tbl('Cơ quan chuyên môn thẩm định — Kính gửi', 'cqcmXem', [['donVi', 'Đơn vị'], ['chucNang', 'Nội dung góp ý theo chức năng'], ['nguoi', 'Người thẩm định']]),
        grp('Phiếu yêu cầu thẩm định (BM-03)', [
          txt('**Trích yếu:** {{bm03Vv}}'),
          txt('**Căn cứ:**\n{{bm03CanCu}}'),
          txt('**Nội dung đề nghị góp ý:**\n{{bm03NoiDung}}'),
          txt('**Hạn góp ý:** {{hanGopY}}', 8),
          txt('**Đầu mối tiếp nhận:** {{dauMoiTen}}', 8),
          txt('**Điện thoại đầu mối:** {{dmDienThoai}}', 8),
          txt('**Email đầu mối:** {{dmEmail}}', 8),
          txt('**Nơi nhận:** {{bm03NoiNhan}}'),
          txt('**Phiếu BM-03 đã ký nháy:** {{bm03Tep}}')]),
        ta('yKien', 'Ý kiến', { rows: 3, validate: { maxLength: 2000 }, description: 'Bắt buộc khi Từ chối' })] }),
      notes: () => ['<b>Review nhi 06/11 #30, #38:</b> form hiện đủ các trường của phiếu BM-03 đã soạn ở bước 16 (chỉ xem), ô Ý kiến; nút <b>Đồng ý</b> / <b>Từ chối</b> trong màn phê duyệt (Từ chối bắt buộc Ý kiến, Ý kiến là lý do trả lại).', '<b>DX-10 (g), (h), D-83 — cách B:</b> dự thảo BM-01 / BM-09 (11 / 12) → Chỉ huy ĐVĐX duyệt dự thảo (13) → soạn BM-03 + chọn CQCM (16) → <b>Chỉ huy ĐVĐX duyệt BM-03 (16.1, bước mới)</b> → TTMS kiểm danh sách CQCM (17). Trả lại → Chuyên quản ĐVĐX sửa BM-03 / danh sách (16). Review Huylx4 #29, #30.'],
      write: (v) => pick(v, ['yKien']) },

    /* T29 B12 (Huylx4 #26, RV-PROTO-0511 #10): hộp thoại theo màn Thêm mới yêu cầu báo giá của hệ thống cũ (HT-DXMS-IMG; cùng bố cục SCR-106):
       Thông tin chung → Nhà cung cấp nhận yêu cầu → Danh mục hàng hoá (Model, ĐVT, Số lượng, Yêu cầu kỹ thuật) → Tài liệu kỹ thuật → Điều khoản. */
    8: { id: 'dtms-ms01-t08-ycbg', title: 'Yêu cầu báo giá', q: ['P-33', 'P-72', 'P-73', 'P-213', 'P-214', 'P-215', 'P-221'],
      schema: () => ({ components: [
        /* T29 B18 (màn Cập nhật YCBG cũ HT-DXMS-IMG 3 ảnh, BM-YCKT): lưu ý bảo mật; Thông tin dự án có Nguồn vốn; chọn đối tác → bảng có Email; Thời hạn tiếp nhận báo giá;
           tải mẫu Yêu cầu kỹ thuật; bảo hành / năm sản xuất (P-214); Đầu mối tiếp nhận báo giá nhiều người → bảng Họ tên, Đơn vị. */
        B.banner('<b>Lưu ý:</b> Khi Xác nhận, hệ thống tự động gửi yêu cầu báo giá cho nhà cung cấp, nên người soạn thảo chú ý đáp ứng yêu cầu bảo mật — nội dung cần bảo mật theo yêu cầu của VHT không nêu tên cụ thể.', null, 'info'),
        txt('### Thông tin chung'),
        tf('maYcbg', 'Mã yêu cầu báo giá', { disabled: true, layout: { columns: 5 } }),
        tf('tenYcbg', 'Tên yêu cầu báo giá', req({ validate: { required: true, maxLength: 500 }, layout: { columns: 11 }, description: 'Tiêu đề email gửi nhà cung cấp' })),
        dt('ngayYcbg', 'Ngày YCBG', req({ layout: { columns: 5 } })),
        dt('hanTraLoi', 'Thời hạn tiếp nhận báo giá', req({ layout: { columns: 5 }, description: 'Quá hạn mà nhà cung cấp chưa gửi báo giá → Không phản hồi' })),
        tbl('Thông tin dự án / đề tài', 'duAnRows', [['ma', 'Mã dự án / đề tài'], ['ten', 'Tên dự án / đề tài'], ['loai', 'Loại'], ['nguonVon', 'Nguồn vốn']], '=count(duAnRows) = 0'),
        txt('### Nhà cung cấp nhận yêu cầu'),
        tags('nccSel', 'Đối tác nhận YCBG', req({ valuesKey: 'nccOptions', searchable: true, description: 'Danh mục Nhà cung cấp lọc theo ngành hàng của các hạng mục; nhà cung cấp dừng hoạt động hoặc đang bị cấm không có trong danh sách.' })),
        tbl('Danh sách đối tác nhận yêu cầu báo giá', 'nccList[list contains(nccSel, item.ma)]', [['ma', 'Mã đối tác'], ['ten', 'Tên đối tác'], ['email', 'Email đối tác'], ['nganh', 'Ngành hàng'], ['tinhTrang', 'Tình trạng']]),
        txt('Đã chọn **{{count(nccSel)}}** nhà cung cấp'),
        dlAdd('nccMoi', 'Nhà cung cấp mới (chưa có trong danh mục) — thêm vào danh mục và nhận YCBG', [
          tf('ten', 'Tên nhà cung cấp', req({ layout: { columns: 5 } })), tf('mst', 'Mã số thuế', { layout: { columns: 3 } }),
          tf('email', 'Email nhận YCBG', { validate: { required: true, pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' }, layout: { columns: 4 } }),
          sel('nganh', 'Ngành hàng', req({ valuesKey: 'nganhOptions', layout: { columns: 4 } }))]),
        txt('### Danh mục hàng hoá yêu cầu báo giá'),
        /* Review nhi 06/11 #23 (GIẢ LẬP P-221): Thầu sửa tên, xoá, thêm hàng hoá trên phiếu YCBG. */
        dlAdd('ycbgHang', '', [
          tf('hang', 'Tên hàng hoá, dịch vụ', req({ validate: { required: true, maxLength: 500 }, layout: { columns: 6 } })),
          tf('model', 'Model / Mã NSX tham khảo', { layout: { columns: 4 }, description: 'Mã tham khảo, nhà cung cấp chọn mã khác được nếu đáp ứng yêu cầu kỹ thuật' }),
          tf('uom', 'ĐVT', req({ layout: { columns: 3 } })),
          num('sl', 'Số lượng', req({ validate: { required: true, min: 1 }, layout: { columns: 3 } })),
          ta('spec', 'Yêu cầu kỹ thuật', { rows: 1, validate: { maxLength: 1000 } }),
          txt('*{{this.nhom}} · {{this.nganh}}*', 16, '=this.nhom = null')]),
        txt('*{{group2Note}}*', 16, '=count(ycbgNhom2) = 0 or group2Note = ""'),
        txt('### Tài liệu kỹ thuật'),
        B.file('tepKyThuat', 'Yêu cầu kỹ thuật', { layout: { columns: 5 } }),
        B.file('tepBanVe', 'Danh mục bản vẽ', { layout: { columns: 5 } }),
        B.file('tepKhac', 'Tệp khác', { layout: { columns: 6 }, multiple: true }),
        { type: 'html', content: '<p class="cap">Yêu cầu kỹ thuật lập theo mẫu <a class="link-red" href="assets/mau/BM-YCKT.docx" download="Mau yeu cau ky thuat bao gia.docx" data-ycbg-tpl>Mẫu yêu cầu kỹ thuật để báo giá (BM-YCKT)</a>: nêu mã NSX tham khảo cho hàng thương mại, thời gian bảo hành, năm sản xuất và các yếu tố ảnh hưởng đến giá (lắp đặt, bảo quản, giấy phép, nghiệm thu).</p>' },
        /* T29 B4 P2 (BR-DXMS-04-06 sửa 04/11, DTMS_CN_0145 mục 7a–7d; BM-YCBG, HT-DXMS-IMG Yêu cầu báo giá): điều khoản in trên phiếu và email gửi NCC. */
        txt('### Điều khoản trên phiếu yêu cầu báo giá'),
        ta('dkThanhToan', 'Điều kiện thanh toán', { rows: 2, validate: { maxLength: 4000 }, layout: { columns: 16 } }),
        tf('diaDiemGiao', 'Địa điểm giao hàng', { validate: { maxLength: 500 }, layout: { columns: 8 } }),
        num('baoHanh', 'Bảo hành tối thiểu (tháng)', { validate: { min: 0, max: 120 }, layout: { columns: 4 } }),
        num('namSx', 'Năm sản xuất từ', { validate: { min: 2000, max: 2100 }, layout: { columns: 4 } }),
        ta('yeuCauKhac', 'Các yêu cầu khác', { rows: 2, validate: { maxLength: 2000 }, layout: { columns: 16 } }),
        tags('dauMoiBg', 'Đầu mối tiếp nhận báo giá', req({ valuesKey: 'dauMoiBgOptions', searchable: true,
          description: 'Người thuộc danh sách xử lý của hồ sơ; phiếu ghi Họ tên, Số điện thoại, Email theo hồ sơ người dùng.' })),
        tbl('', 'dauMoiList[list contains(dauMoiBg, item.id)]', [['ten', 'Họ và tên'], ['donVi', 'Đơn vị'], ['dienThoai', 'Điện thoại'], ['email', 'Email']])] }),
      notes: () => ['<b>Review nhi 06/11 #22–24:</b> nút mở form đổi tên <b>Tạo yêu cầu báo giá</b>. Danh mục hàng hoá: Thầu sửa tên, ĐVT, số lượng, xoá dòng, thêm dòng trên phiếu (<b>GIẢ LẬP P-221</b> — phiếu YCBG có thể khác danh mục ĐXMS đã xác nhận; danh mục hồ sơ dùng cho Tờ trình không đổi). Bỏ bảng Đối soát ĐXMS (biến <code>doiSoat</code> giữ trong vars, không hiện).', 'G1/E1: BE nạp <code>nccOptions</code> từ danh mục Nhà cung cấp — lọc theo ngành hàng của các hạng mục, bỏ NCC dừng hoạt động (P-33) và NCC đang bị cấm; NCC bị hạn chế vẫn chọn được. Bảng tình trạng chỉ xem để người dùng thấy lý do.',
        'Người dùng tạo YCBG, hệ thống gửi email thay TTMS (task 09); không có cổng nhà cung cấp, không có bước ký báo giá (BBLV 22/09, chốt 28/09/2026).',
        'Comment #3: bảng lặp "Nhà cung cấp mới" (thêm / xoá dòng). Xác nhận → BE thêm NCC vào danh mục Nhà cung cấp (ghi nguồn = mã hồ sơ) rồi gửi YCBG cùng các NCC đã chọn.',
        '<b>Điều khoản trên phiếu</b> (T29 B4 P2, BR-DXMS-04-06): Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác, Đầu mối tiếp nhận báo giá (mặc định người xử lý bước, chọn trong danh sách xử lý của hồ sơ) — in trên phiếu YCBG (mẫu BM-YCBG) và email gửi NCC ở task 09, hiện ở Chi tiết YCBG (SCR-74). Mapping <code>quotation.payment_terms</code>, <code>delivery_place</code>, <code>other_requirements</code>, <code>contact_user_id</code>. SRS mặc định rỗng; hồ sơ demo điền sẵn giá trị mẫu theo HT-DXMS-IMG. Số điện thoại, email của đầu mối: GIẢ LẬP.',
        '<b>T29 B12 (review Huylx4 #26, RV-PROTO-0511 #10)</b>: bố cục theo màn Thêm mới yêu cầu báo giá của hệ thống cũ (HT-DXMS-IMG, như SCR-106): Thông tin chung (Mã YCBG hệ thống sinh YCBG-{số ĐXMS}-{lần}, Tên YCBG = tiêu đề email, Dự án / Đề tài của luồng, Ngày YCBG, Hạn trả lời) → Nhà cung cấp nhận yêu cầu → Danh mục hàng hoá (hạng mục mua sau rà soát tồn kho; nhập Model, Yêu cầu kỹ thuật) → Tài liệu kỹ thuật (Yêu cầu kỹ thuật, Danh mục bản vẽ, Tệp khác — filepicker, gửi kèm email ở task 09) → Điều khoản. Nhóm 1 / nhóm 2 hiện ở từng dòng hàng hoá.',
        '<b>T29 B18</b> (màn Cập nhật YCBG cũ đủ 3 ảnh HT-DXMS-IMG, BM-YCKT): lưu ý bảo mật đầu form; Thông tin dự án / đề tài có <b>Nguồn vốn</b> (SCR-104); Chọn đối tác (taglist) → bảng <b>Danh sách đối tác nhận yêu cầu báo giá</b> có Email (biểu thức lọc <code>nccList[list contains(nccSel, item.ma)]</code>); <b>Thời hạn tiếp nhận báo giá</b> (biến <code>hanTraLoi</code>); Model → Model / Mã NSX tham khảo; link mẫu BM-YCKT (cũng ở Chọn mẫu tài liệu của bước 8, cùng BM-YCBG); Bảo hành tối thiểu, Năm sản xuất từ (P-214); <b>Đầu mối tiếp nhận báo giá chọn nhiều người</b> → bảng Họ tên, Đơn vị, Điện thoại, Email. Không đưa vào eForm (không phải loại trường form-js): Đặt giá trị mặc định (P-213 — giá trị điền sẵn khi mở phiếu), Soạn thảo công văn (P-215), Xem Logs (= Lịch sử xử lý của màn việc), Nhập danh mục hàng hoá từ Excel (cần dev riêng). Danh mục hàng hoá giữ bảng theo dòng (cần cho so sánh báo giá, BR-DXMS-04-09) thay cho ô soạn văn bản của hệ thống cũ.',
        'P-188: BM-YCBG đề nghị NCC báo đơn giá <b>chưa thuế</b>, thuế GTGT ở dòng tổng; SRS BR-DXMS-04-09 nhập đơn giá <b>gồm VAT</b> — prototype theo SRS, lệch chờ BA.',
        ],
      write: (v) => pick(v, ['nccSel', 'hanTraLoi', 'nccMoi', 'dkThanhToan', 'diaDiemGiao', 'baoHanh', 'namSx', 'dauMoiBg', 'yeuCauKhac', 'tenYcbg', 'ngayYcbg', 'ycbgHang', 'tepKyThuat', 'tepBanVe', 'tepKhac']) },

    /* Review nhi 06/11 #3 (D.quoteManual): popup Báo giá đạt chỉ còn tệp báo giá của các NCC (mục Tài liệu đính kèm) và giá trị báo giá cuối cùng;
       bảng so sánh, kết quả AI kiểm tra báo giá, dòng luồng gợi ý bỏ (Thầu so sánh, đánh giá ngoài hệ thống). Không đạt mở dialog lý do, không mở form. */
    10: { id: 'dtms-ms01-t10-bao-gia', q: ['P-06', 'P-219'],
      schema: () => (window.D.quoteManual ? { components: [
        txt('Lần gửi YCBG: **{{lanGuiYcbg}}**. Tải tệp báo giá của từng nhà cung cấp ở mục **Tài liệu đính kèm** bên dưới, nhập giá trị báo giá cuối cùng rồi Xác nhận.'),
        num('giaTriBaoGia', 'Giá trị báo giá cuối cùng (đồng, gồm VAT)', req({ validate: { required: true, min: 1 }, layout: { columns: 8 } })),
        ta('ghiChuBaoGia', 'Ghi chú', { rows: 2, validate: { maxLength: 2000 } })] } : { components: [
        txt('Lần gửi YCBG: **{{lanGuiYcbg}}**'),
        tbl('So sánh báo giá (đơn giá, tỷ đồng, gồm VAT)', 'baoGia', [['ncc', 'Nhà cung cấp'], ['ngay', 'Ngày báo giá'], ['tienTe', 'Loại tiền'], ['dong', 'Dòng hàng'], ['donGia', 'Đơn giá'], ['hieuLuc', 'Hiệu lực đến'], ['thapNhat', 'Giá thấp nhất']]),
        txt('### Kết quả AI kiểm tra báo giá: {{quoteCheck.ketQua}}\n{{quoteCheck.chiTiet}}'),
        sel('canCuDuyet', 'Căn cứ đã được phê duyệt', req({ values: opts(['Chưa phê duyệt', 'Đã phê duyệt']), layout: { columns: 6 } })),
        txt('Tổng giá trị **{{matchCheck.tong}} tỷ** (gồm VAT, sau khi trừ tồn kho) → luồng **{{matchCheck.goiY}}** ({{matchCheck.dieuKien}}) → {{matchCheck.nhanh}}.')] }),
      notes: (h) => [].concat(window.D.quoteManual ? ['<b>Review nhi 06/11 #25 (sửa D-77):</b> bỏ trường Căn cứ đã được phê duyệt ở popup — dùng giá trị đã chọn lúc tạo luồng (biến <code>basisTD</code>); Thầu không sửa ở bước này nữa.', '<b>Review nhi 06/11 #2, #3, #7 (GIẢ LẬP P-219):</b> Thầu so sánh, đánh giá báo giá ngoài hệ thống. Màn bước 10 <b>tạm ẩn</b> card Đánh giá báo giá và cơ sở giá (T29 B3b, B4 P1 — bật lại bằng cờ <code>D.quoteManual = false</code>). Hai nút: <b>Báo giá đạt</b> — tải tệp báo giá của từng NCC (bắt buộc, E3) và nhập <b>Giá trị báo giá cuối cùng</b> (biến <code>giaTriBaoGia</code>, đồng) = giá trị của hồ sơ cho cổng Giá trị (thay Tổng theo cơ sở giá); <b>Không đạt — tạo YCBG mới</b> — nhập lý do, về bước 8. Tiếp theo Chỉ huy Thầu TTMS phê duyệt (10.1, DX-10 (f)) Đồng ý / Từ chối. Khi ẩn card: không còn service task AI kiểm tra báo giá (DX-03) vì hệ thống không có dữ liệu đơn giá — cần BA xác nhận bỏ DX-03, chặn vượt phần căn cứ (P1) chuyển sang kiểm theo giá trị cuối cùng hay bỏ. Giá trị điền sẵn = tổng báo giá mẫu (GIẢ LẬP).'] : []).concat(['Bảng báo giá dạng dọc (NCC · dòng · đơn giá · hiệu lực) vì table của eForm có cột cố định. Tên, loại tiền NCC lấy từ danh mục; ngoại tệ quy đổi VNĐ.',
        'Comment #5: tệp báo giá của từng NCC nhận YCBG là tài liệu bắt buộc của nút "Báo giá đạt" (E3) — dòng "Báo giá — (NCC)" ở Danh sách tài liệu có nút Tải lên. Service task AI đọc tệp đã tải lên để lập bảng so sánh và kiểm tra báo giá.',
        'Kết quả AI kiểm tra báo giá = biến <code>quoteCheck</code> của service task. DX-03 (đã duyệt, chờ BA): cổng sau task 10 đọc <code>quoteCheck</code> — bấm "Báo giá đạt" mà AI Không đạt thì hồ sơ vẫn quay về task 09; không khoá nút trên giao diện.',
        window.D.caseRef.quoteFailFirst ? 'Kịch bản: lần gửi YCBG đầu Không đạt (NCC Gamma hết hiệu lực) → quay lại task 09; lần 2 Đạt.' : 'Kịch bản: báo giá đạt ngay lần gửi YCBG đầu.',
        'T29 B1 (D-54): cổng "Giá trị?" sau khi báo giá đạt — hệ thống đặt luồng con theo Tổng giá trị và ngưỡng hồ sơ giữ (P-34): dưới ngưỡng → MS01.03, task 11 (dự thảo BM-09); từ ngưỡng → MS01.01 / .02 dự kiến, task 12 (dự thảo BM-01). Không còn 10a / 10b.',
        '<b>Căn cứ đã được phê duyệt</b> (D-77, RV-PROTO-0511 mục 18): chọn sẵn theo luồng mua sắm, ĐVĐX sửa khi có báo giá cuối cùng; ghi biến <code>basisTD</code> — lựa chọn mặc định của task 48 (Đã phê duyệt → Không báo cáo Tập đoàn, MS01.02).']),
      write: (v) => pick(v, ['canCuDuyet', 'giaTriBaoGia', 'ghiChuBaoGia']) },

    11: 'draft', 12: 'draft',

    /* Review nhi 06/11 #10–12: tiêu đề hộp thoại rõ văn bản đang duyệt; mỗi phần hiện đủ nội dung đã điền ở bước 11 / 12; nút Xem trước Tờ trình. */
    /* Review nhi 06/11 #38, #39: một nút Phê duyệt trên màn; Đồng ý / Từ chối nằm trong màn phê duyệt (BPMN giữ hai nhánh Đồng ý / Không đồng ý). */
    13: { id: 'dtms-ms01-t13-chi-huy-duyet', title: 'Tờ trình đề xuất mua sắm', preview: (h) => [h.tt()],
      decide: { btn: 'Phê duyệt', yes: 'Đồng ý', no: 'Từ chối' },
      reasonOf: (v) => (v.duyetPhan || []).filter((r) => r.ketQua === 'Không đạt').map((r) => `${r.phan}${r.lyDo ? ': ' + r.lyDo : ''}`).join('; '),
      schema: () => ({ components: [
        txt('### AI kiểm tra hồ sơ: Đạt\n- Đủ mục bắt buộc {{tt}}, BM-02, {{clName}}.\n- Tổng giá trị khớp phụ lục chi phí ({{hoSo.tong}} tỷ).'),
        txt('### Tóm tắt dự thảo\n{{tomTat}}'),
        B.dl('duyetPhan', 'Duyệt từng phần — tất cả Đạt mới duyệt tổng thể được', [
          txt('**{{this.phan}}**\n{{this.noiDung}}\n*{{this.giaiTrinh}}*', 9),
          rad('ketQua', 'Kết quả', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 7 } })),
          /* Góp ý người dùng 06/11: Đạt hay Không đạt đều có ô Lý do, hướng dẫn / chỉ đạo, không bắt buộc. */
          ta('lyDo', 'Lý do, hướng dẫn / chỉ đạo', { rows: 2, layout: { columns: 7 }, conditional: { hide: '=this.ketQua = null' } })]),
        tbl('Lịch sử chỉnh sửa theo phần', 'lichSuSua', [['phienBan', 'Phiên bản'], ['phan', 'Phần'], ['noiDung', 'Nội dung cập nhật'], ['nguoi', 'Người sửa'], ['thoiDiem', 'Thời điểm']], '=count(lichSuSua) = 0'),
        B.aiBox('tóm tắt thay đổi', '{{aiTomTatSua}}', '=count(lichSuSua) = 0'),
        /* Review nhi 06/11 #28: đúng bảng Danh mục hàng hoá, dịch vụ đã lập ở bước soạn thảo Tờ trình. */
        tbl('Danh mục hàng hoá, dịch vụ', 'danhMucHang', [['n', 'TT'], ['hang', 'Tên hàng hóa, dịch vụ'], ['loai', 'Chủng loại'], ['dvt', 'ĐVT'], ['sl', 'Số lượng']]),
        tbl('Checklist hồ sơ', 'checklist', TT_COLS)] }),
      outputs: (h) => [h.tt(), 'BM-02'],
      notes: (h) => ['<b>Review nhi 06/11 #28, #29, #38, #39:</b> nút <b>Phê duyệt</b> mở màn duyệt, trong màn có <b>Đồng ý</b> / <b>Từ chối</b> (Từ chối = nhánh Không đồng ý của BPMN). Bảng Danh mục hàng hoá thay Cơ cấu chi phí; Checklist bỏ Số văn bản, dòng đã có tệp tải về được.', '<b>Review nhi 06/11 #10–12:</b> hộp thoại tên "Tờ trình đề xuất mua sắm"; bảng Duyệt từng phần theo mục 1–6 của mẫu, mỗi phần hiện đủ nội dung bước lập dự thảo đã điền (khối chỉ xem đọc biến của task 11 / 12); nút <b>Xem trước ' + h.tt() + '</b> mở Tờ trình theo mẫu.',
        'Kết quả AI = biến <code>aiCheck</code> của service task kiểm tra trước khi gửi (DX-01). AI Đạt nhưng chỉ huy vẫn phải xác nhận.',
        'Comment #6–8: bảng "Duyệt từng phần" — mỗi phần Đạt / Không đạt; <b>góp ý 06/11:</b> cả Đạt và Không đạt đều có ô Lý do, hướng dẫn / chỉ đạo, không bắt buộc (trước: chỉ Không đạt, bắt buộc). Mặc định Đạt theo kết quả AI kiểm tra, chỉ huy đổi khi cần. Cả hai nút mở cùng form.',
        `G3 (BE kiểm khi submit, vì luật hiển thị không có điều kiện theo biến): "Đồng ý" chỉ khi mọi phần Đạt; "Không đồng ý" cần ít nhất một phần Không đạt — các phần Không đạt thành nội dung trả lại, AI lọc (task 14), hồ sơ về task ${h.draftTask()}.`,
        'Comment #9: "Lịch sử chỉnh sửa theo phần" = biến <code>lichSuSua</code> BE ghi mỗi lần gửi lại (phần, người sửa, thời điểm, nội dung); xem trước / sau đầy đủ ở tab Lịch sử phiên bản (DEV-1). Dòng AI tóm tắt là Gợi ý AI tĩnh (D-20).'],
      write: (v) => pick(v, ['duyetPhan']) },

    /* Review nhi 06/11 #13–16: nút "Lập phiếu yêu cầu thẩm định"; CQCM chọn bằng danh sách thả xuống + bảng đã chọn; form điền các trường của
       BM-03 (Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS) theo mẫu; nút Xem trước BM-03. */
    16: { id: 'dtms-ms01-t16-chon-cqcm', q: ['P-05', 'P-220', 'P-224'], preview: () => ['BM-03'],
      schema: (h) => ({ components: [
        banner('TTMS trả lại danh sách CQCM: “{{traLai17.lyDo}}”. Cập nhật danh sách rồi gửi lại TTMS xác nhận.', '=traLai17 = null'),
        grp('Cơ quan chuyên môn (CQCM) góp ý — Kính gửi', [
          tags('cqcmSel', 'Chọn cơ quan chuyên môn', req(Object.assign({ valuesKey: 'cqcmValues', searchable: true }, h.small() ? { description: 'Hồ sơ dưới 160 tỷ: CQCM Tài chính bắt buộc (QT B8.2).' } : {}))),
          /* Review nhi 06/11 #40 (GIẢ LẬP P-224): mỗi CQCM đã chọn chọn đích danh Người thẩm định; bước 19 giao đúng người này. */
          Object.assign(dl('cqcmNguoiDs', 'Cơ quan chuyên môn đã chọn', [
            txt('**{{this.donVi}}**', 4), txt('{{this.chucNang}}', 6),
            sel('nguoi', 'Người thẩm định', req({ valuesExpression: '=this.nguoiOpts', layout: { columns: 6 } }))]),
          { properties: { rowHide: '=not(list contains(cqcmSel, this.value))' } })]),
        grp('Phiếu yêu cầu thẩm định (BM-03)', [
          tf('bm03Vv', 'Trích yếu', req({ validate: { required: true, maxLength: 500 } })),
          ta('bm03CanCu', 'Căn cứ', { rows: 3 }),
          ta('bm03NoiDung', 'Nội dung đề nghị góp ý', req({ rows: 4 })),
          dt('hanGopY', 'Hạn góp ý', req({ layout: { columns: 8 } })),
          sel('dauMoi', 'Đầu mối tiếp nhận phản hồi, góp ý', req({ valuesKey: 'nguoiDungOptions', searchable: true, layout: { columns: 8 } })),
          tf('dmDienThoai', 'Điện thoại đầu mối', { layout: { columns: 8 } }), tf('dmEmail', 'Email đầu mối', { layout: { columns: 8 } }),
          tf('bm03NoiNhan', 'Nơi nhận', { description: 'Các nơi nhận cách nhau bằng dấu chấm phẩy.' })]),
        txt('Phiếu BM-03 đã ký nháy: tải lên ở mục **Tài liệu đính kèm** bên dưới hoặc ở **Danh sách tài liệu** của hồ sơ (bắt buộc). Bấm **Xem trước BM-03** để xem phiếu theo mẫu với nội dung đang nhập.')] }),
      outputs: () => ['BM-03'],
      notes: (h) => ['<b>Review nhi 06/11 #40 (GIẢ LẬP P-224):</b> chọn đến Người thẩm định của từng CQCM (mặc định chuyên viên đầu danh sách); bước 19 giao đích danh người này, bước 20 vẫn là lãnh đạo CQCM. Thật: danh sách người theo đơn vị từ IAM.', 'Danh sách CQCM được chuyển TTMS xác nhận đúng chức năng, đủ thành phần (task 17, N07) trước khi hệ thống gửi yêu cầu thẩm định.',
        'E3: tệp BM-03 ký nháy là tài liệu bắt buộc của hành động — BE kiểm loại tài liệu trên hồ sơ trước khi chuyển bước (BBLV 22/09). ❓ Chưa thấy trường "tài liệu bắt buộc" trong luật hiển thị (display-rule.models.ts) → nếu BE chưa có thì DEV BE.']
        .concat(h.small() ? ['G3: hồ sơ < 160 tỷ có CQCM Tài chính chọn sẵn (defaultValue của form MS01.03); BE từ chối submit nếu bỏ chọn (P-25).'] : []),
      write: (v) => Object.assign(pick(v, ['cqcmSel', 'hanGopY', 'dauMoi', 'bm03Vv', 'bm03CanCu', 'bm03NoiDung', 'dmDienThoai', 'dmEmail', 'bm03NoiNhan']),
        { cqcmNguoi: (v.cqcmNguoiDs || []).reduce((o, r) => Object.assign(o, r.nguoi ? { [r.value]: r.nguoi } : {}), {}) }) },

    17: { id: 'dtms-ms01-t17-xac-nhan-cqcm', q: ['P-05', 'P-225'], title: 'Xác nhận danh sách CQCM',
      decide: { btn: 'Xác nhận danh sách CQCM', yes: 'Đồng ý', no: 'Từ chối', reasonKey: 'nhanXetDs' },
      schema: () => ({ components: [
        tbl('Danh sách CQCM do đơn vị đề xuất chọn', 'cqcmChon', [['cqcm', 'CQCM'], ['chucNang', 'Chức năng liên quan'], ['nguoiXuLy', 'Người xử lý']]),
        txt('### AI đối chiếu thành phần CQCM: {{aiCqcm.ketQua}}\n{{aiCqcm.chiTiet}}'),
        txt('**Phiếu yêu cầu thẩm định (BM-03):** hạn góp ý {{bm03.han}} · tệp ký nháy {{bm03.tep}} (Danh sách tài liệu)'),
        txt('Sau khi Đồng ý, hệ thống gửi yêu cầu thẩm định kèm BM-03 tới các CQCM trong danh sách. BM-03 đã được Đại diện đơn vị đề xuất trình ký khi duyệt phiếu yêu cầu thẩm định.'),
        /* T29 B15 (review Huylx4 #32): kết luận nào cũng phải kèm nhận xét. */
        ta('nhanXetDs', 'Nhận xét', req({ rows: 3, description: 'Bắt buộc khi Đồng ý và khi Từ chối' }))] }),
      outputs: () => ['BM-03'],
      write: (v) => pick(v, ['nhanXetDs']),
      notes: () => ['BPMN MS01 v1.1: <b>Đồng ý</b> → task 18; <b>Từ chối</b> → trả Đơn vị ĐXMS cập nhật danh sách (task 16). Một nút mở form, kết luận trong form như bước 16.1; hai nhánh BPMN giữ nguyên.',
        'Task 18 có tác nhân Hệ thống: gửi yêu cầu, trình ký BM-03, thông báo là service task, TTMS không thao tác trình ký. GIẢ LẬP người ký và hình thức ký: xem P-225.',
        'Cả hai kết luận đều bắt buộc nhận xét (review Huylx4 #32); nhận xét khi Từ chối là lý do trả lại.',
        'Kết quả đối chiếu thành phần = biến của service task AI.'] },

    /* T29 S9: nút Lưu nháp của bước 19 đổi nhãn Ghi lại (YC-DXMS-PROTO §6); kết luận Đồng ý / Yêu cầu sửa tính từ các mục (Q7). */
    19: { id: 'dtms-ms01-t19-bm04', q: ['P-22', 'P-197', 'P-200'], draftLabel: 'Ghi lại',
      draftToast: '<b>Thành công</b><br>Đã ghi lại phiếu BM-04. Hồ sơ vẫn ở trạng thái Đang thẩm định.',
      schema: () => ({ components: [
        txt('**{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}}\n*Phiếu riêng của {{cqcmTen}} — không hiển thị ý kiến của cơ quan khác.*'),
        B.dl('bm04Phieu', 'BM-04 Phiếu nhận xét theo mục BM-01', [
          txt('**{{this.muc}}**', 4),
          rad('danhGia', 'Đánh giá', req({ values: opts(['OK', 'Không OK']), layout: { columns: 4 } })),
          /* T29 B15 (review Huylx4 #1): OK hay Không OK đều bắt buộc nhận xét. */
          ta('nhanXet', 'Nội dung nhận xét', req({ rows: 2, layout: { columns: 8 } })),
          txt('Gợi ý AI: *{{this.aiGoiY}}*', 8, '=this.danhGia = "OK" or this.aiGoiY = ""'),
          rad('quyetDinhAi', 'Gợi ý AI', { values: AI, layout: { columns: 8 }, conditional: { hide: '=this.danhGia = "OK" or this.aiGoiY = ""' } }),
          ta('huongDan', 'Hướng dẫn sửa', { rows: 2, layout: { columns: 16 }, conditional: { hide: '=this.danhGia = "OK"' } })]),
        txt('**Kết luận phiếu: Đồng ý** — mọi mục OK.', 16, '=count(bm04Phieu[item.danhGia = "Không OK"]) > 0'),
        txt('**Kết luận phiếu: Yêu cầu sửa** — {{count(bm04Phieu[item.danhGia = "Không OK"])}} mục Không OK, mục OK cũng phải có nhận xét.', 16, '=count(bm04Phieu[item.danhGia = "Không OK"]) = 0')] }),
      notes: (h) => ['Mỗi CQCM một phiếu: multi-instance theo CQCM, biến cục bộ của từng instance — hai cơ quan không thấy phiếu của nhau (comment #14, S7). BM-04 đã ký vẫn có thể chứa ý kiến Không OK (N03).',
        'Gợi ý AI nhận xét (G2): service task AI chạy trước task 19, gợi ý cho mục Không OK; CQCM Chấp nhận / Sửa / Bỏ. Hồ sơ đang thẩm định: ĐVĐX bị khoá sửa tới khi nhận đủ BM-04 (UR-COM-03).']
        .concat(window.Flow.state.vars.round > 0 ? [`Vòng BM-04 lần ${h.bm04Round()}: ĐVĐX đã gửi giải trình (phụ lục 1 BM-02); CQCM xem giải trình và lập lại phiếu.`] : []),
      write: (v, tok, h) => {
        const all = Object.assign({}, window.Flow.ui.bm04), o = {};
        (v.bm04Phieu || []).forEach((r) => { o[r.muc] = { ok: r.danhGia === 'OK', text: r.nhanXet || (r.danhGia === 'OK' ? '' : 'Cần bổ sung, làm rõ.'), guide: r.danhGia === 'OK' ? '' : r.huongDan || '' }; });
        all[tok.cqcm] = o;
        /* Bản ghi phiếu theo lần cho Lịch sử ý kiến thẩm định (T29 S9, DTMS_CN_0159). */
        const rows = (v.bm04Phieu || []).map((r) => ({ muc: r.muc, ok: r.danhGia === 'OK', text: r.nhanXet || (r.danhGia === 'OK' ? '' : 'Cần bổ sung, làm rõ.') }));
        return { bm04: all, bm04Hist: (window.Flow.ui.bm04Hist || []).concat([{ cqcm: tok.cqcm, lan: h.bm04Round(), rows }]) };
      } },

    20: { id: 'dtms-ms01-t20-ky-bm04', q: ['P-197', 'P-200'],
      schema: () => ({ components: [txt('**{{cqcmTen}}** · Lần {{lan}} · Hồ sơ v{{phienBan}}'),
        tbl('BM-04 Phiếu nhận xét — chuyên viên đã lập', 'bm04KetQua', [['muc', 'Mục BM-01'], ['danhGia', 'Đánh giá'], ['nhanXet', 'Nội dung nhận xét'], ['huongDan', 'Hướng dẫn sửa']]),
        txt('**Kết luận phiếu: Đồng ý** — mọi mục OK.', 16, '=count(bm04KetQua[item.danhGia = "Không OK"]) > 0'),
        txt('**Kết luận phiếu: Yêu cầu sửa** — {{count(bm04KetQua[item.danhGia = "Không OK"])}} mục Không OK.', 16, '=count(bm04KetQua[item.danhGia = "Không OK"]) = 0')] }),
      notes: () => ['Comment #13, #15 (AI đồng bộ ý kiến hai cơ quan) không đặt ở task 20: theo #14 hai CQCM không được thấy ý kiến của nhau — khối AI đặt ở task 26 (ĐVĐX nhận kết quả).',
        'Form task 20 chỉ đọc kết quả task 19. Đồng ý → hệ thống trình ký BM-04 qua VOffice (task 22); Không đồng ý → dialog nhận xét, AI lọc nội dung cần sửa, trả chuyên viên (task 21).'] },

    26: { id: 'dtms-ms01-t26-ket-qua-bm04', q: ['P-22'],
      schema: () => ({ components: [
        banner('Hồ sơ bị trả lại ở bước “{{traLaiKy.buoc}}” — {{traLaiKy.nguoi}}: “{{traLaiKy.lyDo}}”', '=traLaiKy = null'),
        tbl('Trạng thái phiếu BM-04', 'bm04TrangThai', [['cqcm', 'CQCM'], ['nguoi', 'Người lập / chỉ huy'], ['lan', 'Lần'], ['tinhTrang', 'Tình trạng'], ['soNgay', 'Số ngày xử lý'], ['ky', 'Ký'], ['khongOk', 'Không OK']]),
        /* Góp ý 06/11: khung Gợi ý AI tĩnh (aiDongBo) thay bằng nút ✦ Gợi ý từ AI ở bảng quyết định → popup → Áp dụng (cùng mẫu màn Lập ĐXMS). */
        Object.assign(B.dl('quyetDinhYKien', 'Quyết định của đơn vị với từng ý kiến Không OK', [
          txt('**{{this.cqcmTen}}** · {{this.muc}}', 4), txt('{{this.yKien}}', 7),
          rad('quyetDinh', 'Quyết định', req({ values: YK, layout: { columns: 5 } })),
          ta('huongXuLy', 'Nội dung sửa (đồng ý) / giải trình (không đồng ý)', { rows: 2 })]),
        { properties: { aiSuggest: { title: 'Rà soát ý kiến BM-04', source: 'aiYKien', match: 'id', head: '**{{this.cqcmTen}}** · {{this.muc}}\n{{this.yKien}}',
          decision: { key: 'quyetDinh', label: 'Quyết định gợi ý', values: YK }, text: { key: 'huongXuLy', label: 'Nội dung sửa / giải trình' },
          strip: '**✦ Bước 24 · AI kiểm tra xung đột giữa các BM-04:** {{aiXungDot}}\n**✦ Bước 25 · AI tóm tắt và đồng bộ ý kiến theo mục BM-01:**\n{{aiDongBo}}' } } }),
        txt('Có ý kiến “Không đồng ý” → hồ sơ chuyển sang lập giải trình; đồng ý sửa toàn bộ → hoàn chỉnh hồ sơ.')] }),
      notes: () => ['DX-02 (đã duyệt, chờ BA): một nút "Hoàn thành"; gateway sau task 26 rẽ nhánh theo biến <code>coBaoLuu</code> (có dòng "Không đồng ý") — luật hiển thị không có điều kiện theo biến nên không chặn nút trên giao diện.',
        'AI kiểm tra xung đột (task 24), AI tóm tắt (task 25) là service task; kết quả chỉ xem ở đầu popup Gợi ý AI.',
        '<b>Góp ý 06/11:</b> nút <b>✦ Gợi ý từ AI</b> ở bảng quyết định → popup (cùng mẫu màn Lập ĐXMS): mỗi ý kiến Không OK có ô Áp dụng, quyết định gợi ý (Đồng ý sửa / Không đồng ý, đổi được) và nội dung gợi ý sửa được — đồng ý: hướng sửa đã đồng bộ theo mục BM-01; không đồng ý: dự thảo giải trình. Áp dụng → điền cột Quyết định và ô Nội dung sửa / giải trình (biến <code>huongXuLy</code>), vẫn sửa được trên form. Nội dung đi tiếp vào Việc cần sửa (bước 27) và bảng giải trình (bước 28). <b>GIẢ LẬP:</b> gợi ý = dữ liệu mẫu (biến <code>aiYKien</code> của service task 25); quyết định gợi ý lấy theo dự thảo phản hồi của đơn vị.',
        'Comment #13, #15: khối "Gợi ý AI — đồng bộ ý kiến" (biến <code>aiDongBo</code> của service task 25) gộp ý kiến các CQCM theo mục BM-01 thành một hướng dẫn sửa; mục có ý kiến trái nhau thì nêu phương án thống nhất. Chỉ ĐVĐX thấy (task 26); CQCM không thấy phiếu của nhau (#14).'],
      write: (v) => {
        const resp = Object.assign({}, window.Flow.ui.resp);
        (v.quyetDinhYKien || []).forEach((r) => { if (r.quyetDinh === 'Bảo lưu' || resp[r.cqcm] !== 'Bảo lưu') resp[r.cqcm] = r.quyetDinh; });
        const huongXuLy = Object.assign({}, window.Flow.ui.huongXuLy);
        (v.quyetDinhYKien || []).forEach((r) => { huongXuLy[r.id] = r.huongXuLy || ''; });
        return { resp, huongXuLy, coBaoLuu: (v.quyetDinhYKien || []).some((r) => r.quyetDinh === 'Bảo lưu') };
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
  /* Các ô AI soạn (review nhi 06/11 #34, #35): để trống tới khi bấm ✦ Gợi ý từ AI hoặc người soạn tự nhập. */
  const AI_KEYS = ['mucDich', 'suCanThiet', 'phamVi', 'phuongPhap', 'quanDiem', 'phuongAn', 'nguonNganSach', 'hieuQua', 'bienPhap', 'keHoach'];
  const DRAFT = { id: 'dtms-ms01-t11-12-du-thao', q: ['P-07', 'P-222'], ai: true, aiFill: { keys: AI_KEYS },
    schema: (h) => ({ components: [
      banner('Chỉ huy đơn vị trả lại: “{{traLai13.lyDo}}”. AI lọc nội dung chưa đạt: {{traLai13.loc}}', '=traLai13 = null'),
      Object.assign(B.dl('phanHoiChiHuy', 'Phản hồi chỉ đạo của chỉ huy — phần không sửa phải có giải trình', [
        txt('**{{this.phan}}**\n{{this.chiDao}}', 7),
        rad('xuLy', 'Xử lý', req({ values: opts(['Đã sửa', 'Không sửa']), layout: { columns: 4 } })),
        ta('giaiTrinh', 'Giải trình', req({ rows: 2, layout: { columns: 5 }, conditional: { hide: '=this.xuLy != "Không sửa"' } }))]), hide('=traLai13 = null')),
      banner('AI kiểm tra hồ sơ: Không đạt — {{aiCheck.lyDo}} Hồ sơ chưa được gửi.', '=aiCheck = null'),
      /* Review nhi 06/11 #8: ô nhập theo đúng mục 1–6 của mẫu Tờ trình (BM-10.2.1; BM-01 và BM-09 cùng bộ mục, khác đầu văn bản và chữ ký). */
      Object.assign(grp(`${h.tt()} — ${h.small() ? 'Tờ trình đề xuất mua sắm (ký trực tiếp)' : 'Tờ trình thẩm định, phê duyệt đề xuất mua sắm'}`, [
        grp('1. Mục đích', [ta('mucDich', 'Mục đích mua sắm', req())]),
        grp('2. Phạm vi, quy mô đề xuất mua sắm', [
          ta('suCanThiet', 'a) Sự cần thiết phải mua sắm', { description: 'Mục bắt buộc của Tờ trình — hệ thống kiểm tra khi gửi' }),
          txt('*Hiện trạng tồn kho (câu tự động từ kết quả rà soát):* “{{cauTonKho}}”'),
          ta('phamVi', 'b) Danh mục hàng hóa, dịch vụ — mô tả', req()),
          h.adj() ? tbl('Danh mục hàng hóa, dịch vụ', 'danhMucHang', [['n', 'TT'], ['hang', 'Tên hàng hóa, dịch vụ'], ['loai', 'Chủng loại'], ['dvt', 'ĐVT'], ['sl', 'Số lượng']])
            : tbl('Danh mục hàng hóa, dịch vụ', 'phuLucEd[item.sl > 0]', [['n', 'TT'], ['hang', 'Tên hàng hóa, dịch vụ'], ['chungLoai', 'Chủng loại'], ['dvt', 'ĐVT'], ['sl', 'Số lượng']])]),
        grp('3. Giá trị của đề xuất mua sắm', h.adj() ? [
          txt('{{giaTriTt}}'),
          tbl('Phụ lục chi phí', 'phuLucChiPhi', [['n', 'STT'], ['hang', 'Hàng hoá'], ['sl', 'SL mua'], ['donGia', 'Đơn giá'], ['thanhTien', 'Thành tiền'], ['coSo', 'Cơ sở giá'], ['loai', 'Loại chi phí']]),
          ta('phuongPhap', 'Phương pháp tính toán, cơ sở xác định đơn giá'),
          ta('quanDiem', 'Quan điểm thực hiện (nếu có)', { rows: 2 }),
          ta('phuongAn', 'Phương án kỹ thuật – công nghệ (hàng hóa), giải pháp triển khai (dịch vụ)')] : [
          /* Review nhi 06/11 #36 (GIẢ LẬP P-222): Phụ lục chi phí sửa được; thành tiền, tổng, bằng chữ tự tính; lệch giá đã duyệt / qua ngưỡng thì cảnh báo. */
          { type: 'expression', key: 'tongTt', expression: '=decimal(sum(phuLucEd.thanhTien), 2)' },
          txt('**Tổng kinh phí đề xuất: {{tienVnd(tongTt)}} VNĐ (đã bao gồm VAT)**\n*(Bằng chữ: {{bangChu(tongTt)}}./.)*'),
          banner('Tổng kinh phí lệch giá trị báo giá đã được Chỉ huy Thầu phê duyệt ({{giaTriDuyetTy}} tỷ).', '=abs(tongTt - giaTriDuyetTy) < 0.05', 'info'),
          banner(`Tổng kinh phí ${h.small() ? 'từ' : 'dưới'} {{nguongTy}} tỷ: khi gửi, hồ sơ chuyển sang ${h.small() ? 'BM-01 và Checklist 01' : 'BM-09 và Checklist 02'}, người soạn kiểm tra lại trước khi gửi tiếp.`, h.small() ? '=tongTt < nguongTy' : '=tongTt >= nguongTy', 'info'),
          B.dl('phuLucEd', 'Phụ lục chi phí', [
            { type: 'expression', key: 'thanhTien', expression: '=this.sl * this.donGia' },
            txt('**{{this.n}}. {{this.hang}}**\n*{{this.loai}}*', 5),
            num('sl', 'SL mua', { validate: { required: true, min: 0 }, layout: { columns: 2 } }),
            num('donGia', 'Đơn giá (tỷ)', { validate: { required: true, min: 0 }, layout: { columns: 3 } }),
            txt('Thành tiền (tỷ)\n**{{decimal(this.thanhTien, 2)}}**', 2),
            tf('coSo', 'Cơ sở giá', { layout: { columns: 4 } })]),
          ta('phuongPhap', 'Phương pháp tính toán, cơ sở xác định đơn giá'),
          ta('quanDiem', 'Quan điểm thực hiện (nếu có)', { rows: 2 }),
          ta('phuongAn', 'Phương án kỹ thuật – công nghệ (hàng hóa), giải pháp triển khai (dịch vụ)')]),
        grp('4. Nguồn vốn và thời gian thực hiện', [
          tf('nguonVonTt', 'a) Nguồn vốn', { layout: { columns: 8 } }), tf('nguonNganSach', 'Nguồn ngân sách', { layout: { columns: 8 } }),
          tf('thoiGianTh', 'b) Thời gian thực hiện mua sắm', { layout: { columns: 8 } })]),
        grp('5. Đánh giá hiệu quả của ĐXMS (nếu cần thiết)', [ta('hieuQua', 'Đánh giá hiệu quả', { rows: 2 })]),
        grp('6. Biện pháp và kế hoạch tổ chức thực hiện', [ta('bienPhap', 'Biện pháp thực hiện'), ta('keHoach', 'Kế hoạch tổ chức thực hiện')])]),
      { properties: { aiFill: { source: 'aiTt', title: 'Tờ trình' } } }),
      /* Review nhi 06/11 #4, #5, #9: Checklist 01 / 02 theo giá trị hồ sơ = danh mục hồ sơ kèm theo; 6 phụ lục (P-212) là dòng của bảng, chọn Kèm theo
         Có / Không ngay trên dòng; mỗi dòng hiện tệp đã có, tải thêm khi thiếu (phụ lục Có thì bắt buộc có tệp). */
      /* Review nhi 06/11 #27: mỗi dòng có Yêu cầu (bắt buộc hay không), Tình trạng là radio Có / Không, tệp đã có / vừa tải lên đều tải về được. */
      B.dl('checklistDs', `${h.clName()} — danh mục hồ sơ`, [
        txt('**{{this.muc}}**\n*Nhóm {{this.nhom}}*', 5),
        txt('Yêu cầu\n**{{if this.pl and this.kemTheo = "Có" then "Bắt buộc" else this.batBuoc}}**', 2),
        rad('kemTheo', 'Tình trạng', req({ values: opts(['Có', 'Không']), layout: { columns: 3 }, conditional: { hide: '=this.gen' } })),
        txt('Tình trạng\n**Có**', 3, '=not(this.gen)'),
        txt('Tệp đã có\n{{this.tepDa}}', 3),
        file('tepMoi', 'Tải thêm', { layout: { columns: 3 }, conditional: { hide: '=this.gen or this.kemTheo != "Có"' } })]),
      txt(`*Bấm **Xem trước ${h.tt()}** để xem Tờ trình theo mẫu với nội dung đang nhập; văn bản hoàn chỉnh và BM-02 (thuyết minh) ở Văn bản đầu ra.*`)] }),
    preview: (h) => [h.tt()],
    outputs: (h) => [h.tt(), 'BM-02'],
    notes: (h) => ['<b>Review nhi 06/11 #26, #27, #34–36:</b> nút và tiêu đề <b>Soạn thảo tờ trình ĐXMS</b>. Nút <b>✦ Gợi ý từ AI</b> ở đầu Tờ trình: hộp thoại tiến trình đóng được, AI chạy nền (GIẢ LẬP: chờ 2 giây, nội dung mẫu; thật: service task AI bất đồng bộ + thông báo); xong <b>AI tự điền</b> các ô đang trống, ô đã nhập giữ nguyên, mỗi ô ghi nguồn; bỏ bảng Chấp nhận / Từ chối. Đã đóng form thì kết quả vào bản nháp, mở lại thấy ngay.',
      '<b>Mục 3 sửa được (GIẢ LẬP P-222):</b> SL mua, Đơn giá, Cơ sở giá của Phụ lục chi phí; Thành tiền, Tổng, Bằng chữ tự tính. Lệch giá đã duyệt ở 10.1: cảnh báo, không chặn. Qua ngưỡng: gửi thì hồ sơ đổi sang biểu mẫu và Checklist theo giá trị mới, ở lại để kiểm tra (<code>Flow.applyDraftTotal</code>).',
      '<b>Checklist:</b> Yêu cầu, Tình trạng Có / Không, tệp tải về được. Dòng Bắt buộc phải chọn Có và có tệp mới gửi được. Dòng hệ thống sinh (Tờ trình, BM-02) luôn Có.',
      `G4: tab của bản cũ tách thành nội dung từng mục (trường form), Phụ lục chi phí và ${h.clName()} (khối chỉ xem, BE tính theo tài liệu đã có trên hồ sơ), văn bản hoàn chỉnh ở Văn bản đầu ra, tệp ở Danh sách tài liệu.`,
      'DX-01 (đã duyệt, chờ BA): bấm Gửi → service task AI kiểm tra hồ sơ → Không đạt thì quay lại chính task này, form hiện lý do (biến <code>aiCheck</code>). Prototype mô phỏng: hồ sơ ở lại bước dự thảo.',
      '"Sự cần thiết" không bắt buộc ở validate của form để demo được nhánh AI kiểm tra Không đạt (DX-01) khi gửi mà còn trống.',
      `Chỉ huy không đồng ý → AI lọc nội dung chưa đạt (task 14), hồ sơ về task ${h.draftTask()}.`,
      'T29 B17 (HT-DXMS-IMG, IA-DXMS dòng 18, GIẢ LẬP P-212): khối <b>Hồ sơ kèm theo và phụ lục</b> — 6 phụ lục Có / Không, mặc định theo lựa chọn khi tạo luồng. Phụ lục Có: tệp bắt buộc ở Danh sách tài liệu mới gửi được; Checklist ghi Bắt buộc, Không thì Không áp dụng. Tờ trình (xem trước và Xuất file Word theo mẫu HT-DXMS-TT) in các phụ lục Có ở mục Danh mục hồ sơ kèm theo.',
      'Comment #10: hồ sơ bị chỉ huy trả lại → bảng "Phản hồi chỉ đạo" theo từng phần Không đạt; chọn "Không sửa" thì Giải trình bắt buộc (validate của form). Lần duyệt sau, chỉ huy thấy giải trình ở task 13.']
      .concat(h.small() ? ['Luồng < 160 tỷ: Tờ trình BM-09 + Checklist 02 thay BM-01 + Checklist 01 (P-19). BM-09 thêm ô PHÊ DUYỆT và khối chữ ký thẩm định — Thủ trưởng phê duyệt ngay trên văn bản (task 60).'] : []),
    write: (v) => {
      const o = Object.assign(pick(v, ['mucDich', 'phamVi', 'phuongPhap', 'quanDiem', 'phuongAn', 'nguonVonTt', 'nguonNganSach', 'thoiGianTh', 'hieuQua', 'bienPhap', 'keHoach', 'phanHoiChiHuy', 'phuLucEd', 'tongTt']
        .concat(window.D.phuLuc.map(([k]) => 'pl_' + k))), { necessity: v.suCanThiet || '' });
      /* Bảng Checklist: Kèm theo → pl_<khoá>; tệp tải thêm → tệp phụ lục (cùng khoá Danh sách tài liệu) hoặc tệp bổ sung của dòng (clFiles). */
      const cl = Object.assign({}, (window.Flow.ui || {}).clFiles || {}), kem = {};
      (v.checklistDs || []).forEach((r) => {
        if (r.up) o['pl_' + r.up] = r.kemTheo || 'Không'; else if (!r.gen) kem[r.key] = r.kemTheo || 'Không';
        if (!r.tepMoi) return;
        if (r.up) o[r.up] = r.tepMoi; else cl[r.key] = [cl[r.key], r.tepMoi].filter(Boolean).join(', ');
      });
      if (v.checklistDs) Object.assign(o, { clFiles: cl, clKem: kem });
      return o;
    },
    /* Review nhi 06/11 #36: sau khi ghi biến — tổng mới là giá trị hồ sơ; qua ngưỡng thì đổi biểu mẫu, ở lại bước (Flow.applyDraftTotal). */
    after: (out, tok, h) => {
      const r = window.Flow.applyDraftTotal(tok.id, out.tongTt);
      return r ? { toast: `Giá trị mới ${out.tongTt.toLocaleString('vi-VN')} tỷ: hồ sơ chuyển sang ${h.tt()} và ${h.clName()}. Kiểm tra lại nội dung rồi gửi.` } : null;
    },
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
