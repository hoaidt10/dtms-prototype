/*
 * eForm của MS23.01 Văn bản phát sinh (T25 B5). Theo DG-MS23.01 §C; sửa đổi hợp đồng đối chiếu QT-10.2.4 Bước 9. Mỗi văn bản một hồ sơ con; bước 4, 5, 7, 12 là service task.
 * Căn cứ, tờ trình, bản đã ký nằm ở Danh sách tài liệu (loại 4), không đặt trong form.
 */
(function () {
  const { txt, banner, ta, tf, num, sel, chk, req, opts, aiBox, dt } = window.EForms.b;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const hd = () => window.HopDong.find(Flow.state.parent) || {};
  const r3 = (n) => Math.round(n * 1000) / 1000;
  const when = (c, h) => Object.assign(c, { conditional: { hide: h } });

  const head = () => txt('**{{hd.code}}** — {{hd.ten}} · nhà thầu {{hd.ncc}} · giá trị **{{hd.gia}} tỷ đồng**');
  const doc = () => txt('**{{vbLoai}}** — {{vbNoiDung}}');
  const change = () => when(txt('Điều chỉnh giá trị **{{vbGiaTriHien}} tỷ đồng** · gia hạn **{{vbGiaHanHien}} ngày** · giá trị sau điều chỉnh **{{vbSau}} tỷ đồng**'), '=not(laSua)');

  const F = {
    1: { id: 'dtms-ms2301-t01-lap-thong-tin', q: ['P-161', 'P-166'],
      schema: () => ({ components: [head(), banner('AI kiểm tra căn cứ lần trước không đạt: sửa thông tin, tài liệu rồi thực hiện lại.', '=not(aiLoi)'), sel('vbLoai', 'Loại văn bản', req({ values: opts(D.hdVbTypes) })), ta('vbNoiDung', 'Nội dung / sự việc phát sinh', req())] }),
      notes: () => ['Căn cứ tải lên ở Danh sách tài liệu (bắt buộc). <b>Giả lập P-161</b>: chỉ Phụ lục hợp đồng là sửa đổi hợp đồng (cổng "Là sửa đổi hợp đồng?") → bước 2, 3; loại khác hợp nhất tới bước 4.', 'Đây cũng là nơi quay lại khi AI bước 4 không đạt; phụ lục đi lại bước 2, 3.'],
      write: (v) => pick(v, ['vbLoai', 'vbNoiDung']) },
    2: { id: 'dtms-ms2301-t02-de-xuat-sua-doi', q: ['P-162', 'P-173'], outputs: () => ['VB-TTR'],
      schema: () => ({ components: [head(), doc(), chk('vbDuocPhep', 'Xác nhận', req({ text: 'Nội dung thuộc trường hợp được phép sửa đổi theo pháp luật, Quy chế lựa chọn nhà thầu' })), ta('vbThongNhat', 'Nội dung sửa đổi đã thống nhất với Đơn vị sử dụng', req()),
        num('vbGiaTri', 'Giá trị điều chỉnh (tỷ đồng)', { layout: { columns: 8 } }), num('vbGiaHan', 'Gia hạn (ngày)', { validate: { min: 0 }, layout: { columns: 8 } }), txt('Giới hạn giá trị (giá gói thầu / nguồn): **{{hd.cap}} tỷ đồng**')] }),
      notes: () => ['Hệ thống chặn khi giá trị sau điều chỉnh vượt giới hạn (Backlog 473). <b>Giả lập P-162</b>: chuyên viên xác nhận, Đơn vị sử dụng không có việc riêng. <b>Giả lập P-173</b>: kế hoạch thanh toán giữ nguyên.'],
      write: (v) => pick(v, ['vbDuocPhep', 'vbThongNhat', 'vbGiaTri', 'vbGiaHan']) },
    3: { id: 'dtms-ms2301-t03-duyet-de-xuat', q: ['P-163'],
      schema: () => ({ components: [head(), doc(), change(), txt('Nội dung đã thống nhất: {{vbThongNhat}}'), ta('vbYKienCm', 'Ý kiến chuyên môn (nếu có)')] }),
      notes: () => ['<b>Giả lập P-163</b>: Người có thẩm quyền = Tổng Giám đốc VHT. Chưa duyệt → bước 2 hoàn thiện tờ trình, trình lại.'], write: (v) => pick(v, ['vbYKienCm']) },
    6: { id: 'dtms-ms2301-t06-hoan-thien', q: ['P-168'], outputs: () => ['VB-DT'],
      schema: () => ({ components: [head(), doc(), change(), aiBox('dự thảo đúng loại văn bản', 'Dự thảo **{{vbLoai}}** từ căn cứ đã có; phụ lục dùng nội dung đề xuất đã được duyệt.'), ta('vbDuThao', 'Nội dung văn bản', req()), ta('vbThongNhatNcc', 'Nội dung thống nhất với nhà thầu (khi áp dụng)'),
        when(num('vbGiaPhat', 'Giá trị phạt (tỷ đồng)', req({ validate: { required: true, min: 0 }, layout: { columns: 8 } })), '=not(laPhat)')] }),
      notes: () => ['Rà soát dự thảo của AI (bước 5), hoàn thiện hồ sơ trình duyệt. Đây cũng là nơi quay lại khi Trưởng phòng Hợp đồng không duyệt; hoàn thiện xong qua lại AI bước 7. <b>Giả lập P-168</b>: một mẫu dự thảo chung.'],
      write: (v) => pick(v, ['vbDuThao', 'vbThongNhatNcc', 'vbGiaPhat']) },
    8: { id: 'dtms-ms2301-t08-phe-duyet', q: ['P-164', 'P-167'],
      schema: () => ({ components: [head(), doc(), change(), banner('AI cảnh báo: có nội dung cần rà soát trước khi trình ký.', '=not(aiCanhBao)'), aiBox('kiểm tra văn bản trước duyệt', 'Kết quả: **{{aiTruocDuyet}}**'), ta('vbYKien8', 'Ý kiến')] }),
      notes: () => ['Không duyệt → bước 6, rồi qua AI bước 7 trước khi duyệt lại. <b>Giả lập P-164</b>: mọi loại văn bản đều qua bước này. <b>Giả lập P-167</b>: cảnh báo AI không chặn, bản vẽ không có nhánh không đạt ở bước 7.'], write: (v) => pick(v, ['vbYKien8']) },
    9: { id: 'dtms-ms2301-t09-trinh-ky', q: ['P-169'],
      schema: () => ({ components: [head(), doc(), change(), sel('vbHinhThucKy', 'Hình thức ký', req({ values: opts(['VContract', 'Ký cứng', 'Hình thức khác']), layout: { columns: 8 } }))] }),
      notes: () => ['Chọn hình thức ký, lập bộ hồ sơ trình ký từ văn bản đã phê duyệt. Cũng là nơi quay lại khi Người có thẩm quyền không ký. Như B3-2: các cấp bấm Đồng ý và ký, không gọi tích hợp.'], write: (v) => pick(v, ['vbHinhThucKy']) },
    10: { id: 'dtms-ms2301-t10-ky', q: ['P-163', 'P-165'],
      schema: () => ({ components: [head(), doc(), change(), txt('Hình thức ký: **{{vbHinhThucKy}}**'), ta('vbYKien10', 'Ý kiến')] }),
      notes: () => ['<b>Giả lập P-163</b>: Tổng Giám đốc VHT ký mọi loại văn bản. <b>Giả lập P-165</b>: mọi loại không ký đều về bước 9 theo mũi tên bản vẽ.'], write: (v) => pick(v, ['vbYKien10']) },
    11: { id: 'dtms-ms2301-t11-cap-nhat', q: ['P-169', 'P-172'],
      schema: () => ({ components: [head(), doc(), tf('vbSo', 'Số văn bản', req({ layout: { columns: 8 } })), dt('vbNgayKy', 'Ngày ký', req({ layout: { columns: 8 } })), chk('vbNccKy', 'Chữ ký nhà thầu', { text: 'Đã nhận chữ ký của nhà thầu (khi áp dụng)' }),
        tf('vbBenNhan', 'Bên nhận', req({ layout: { columns: 8 } })), sel('vbHinhThucGui', 'Hình thức gửi', req({ values: opts(['Email', 'VContract', 'Bưu chính', 'Bàn giao trực tiếp']), layout: { columns: 8 } }))] }),
      notes: () => ['Bản ký đầy đủ tải lên ở Danh sách tài liệu (bắt buộc). Hình thức gửi khác hình thức ký (DG-MS23.01 §B.5). Hoàn thành → AI bước 12 cập nhật thông tin hợp đồng. <b>Giả lập P-169, P-172</b>: bằng chứng gửi, gửi lỗi chưa dựng.'],
      write: (v) => pick(v, ['vbSo', 'vbNgayKy', 'vbNccKy', 'vbBenNhan', 'vbHinhThucGui']) },
  };
  window.EForms['MS23.01'] = (tok) => F[tok.task] || null;

  /* Mã tạm (P-168); số văn bản gợi ý theo loại, như dữ liệu mẫu BBLV-HĐ0012-01. */
  const DOCS = [{ code: 'VB-TTR', name: 'Tờ trình đề xuất sửa đổi', by: 2 }, { code: 'VB-DT', name: 'Dự thảo văn bản', by: 5 }];
  const SO = ['PL', 'BBLV', 'BBP', 'VB'];
  const REQ = { 1: [['vbCanCu', 'Căn cứ, hồ sơ liên quan']], 11: [['vbBanKy', 'Văn bản đã ký đầy đủ']] };
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };
  const seq = () => Flow.state.code.slice(-2);

  /* Bước 1 để trống Loại văn bản cho người dùng chọn; bước sau mặc định theo cổng G1 (đã tua ở công cụ demo). */
  function vars(tok) {
    const h = hd(), u = Flow.ui, k = window.HopDong.kit(), v = Flow.state.vars, first = !!tok && String(tok.task) === '1', add = Number(u.vbGiaTri) || 0, loai = u.vbLoai || (first ? undefined : D.hdVbTypes[0]), i = D.hdVbTypes.indexOf(loai);
    return Object.assign({}, u, { vbLoai: loai, vbNoiDung: u.vbNoiDung || (first ? undefined : Flow.state.name), laSua: D.hdVbSua(u), laPhat: loai === D.hdVbTypes[2], aiLoi: !!(v.aiVbIn && !v.aiVbIn.ok), aiCanhBao: !!(v.aiVbOut && v.aiVbOut.warn), aiTruocDuyet: v.aiVbOut && v.aiVbOut.warn ? 'Có cảnh báo' : 'Đạt',
      vbGiaTriHien: add, vbGiaHanHien: Number(u.vbGiaHan) || 0, vbSau: r3(h.value + add), vbDuThao: u.vbDuThao || u.vbThongNhat || u.vbNoiDung, vbHinhThucKy: u.vbHinhThucKy || 'VContract', vbHinhThucGui: u.vbHinhThucGui || 'Email', vbBenNhan: u.vbBenNhan || k.nccName(h.ncc),
      vbSo: u.vbSo || `${SO[Math.max(i, 0)]}${seq()}/${h.no || h.code}`, vbNgayKy: u.vbNgayKy || Flow.dateOf(Flow.state.clock), hd: { code: h.code, ten: h.title, ncc: k.nccName(h.ncc), gia: h.value, cap: h.cap } });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] })); }
  const files = () => {
    const u = Flow.ui, no = Flow.state.code, rows = [];
    if (u.vbCanCu || at(1)) rows.push({ name: `Can-cu-${no}.pdf`, at: at(1) || Flow.dateOf(Flow.state.clock) });
    if (u.vbBanKy || at(11)) rows.push({ name: `Van-ban-da-ky-${no}.pdf`, at: at(11) || Flow.dateOf(Flow.state.clock) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => at(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: at(d.by) }));
  function docOf(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const u = Flow.ui, esc = window.UI.esc;
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(hd().title)}</p><p>Loại văn bản: ${esc(u.vbLoai || D.hdVbTypes[0])}.</p><p>${esc(u.vbDuThao || u.vbThongNhat || u.vbNoiDung || 'Nội dung theo mẫu.')}</p></div>` };
  }
  /* Kiểm soát điều chỉnh (Backlog 473): chặn ở bước 2, đọc giá trị hợp đồng đã gồm các phụ lục đã ký. */
  function check(tok, choice, vals) {
    if (String(tok.task) !== '2' || !vals) return null;
    const h = hd(), sau = r3(h.value + (Number(vals.vbGiaTri) || 0));
    return sau > h.cap ? `Giá trị hợp đồng sau điều chỉnh ${window.UI.ty(sau, 2)} tỷ đồng vượt giới hạn ${window.UI.ty(h.cap, 2)} tỷ đồng.` : null;
  }
  window.EForms.hdBy['MS23.01'] = { vars, reqDocs, files, outs, doc: docOf, version: () => 1 + Flow.doneCount(6), docs: DOCS, check };
})();
