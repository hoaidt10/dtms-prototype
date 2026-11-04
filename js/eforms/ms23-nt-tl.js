/*
 * eForm của MS23.03 Nghiệm thu và MS23.04 Thanh lý (T25 B4). Theo DG-MS23.03, DG-MS23.04 §C. Hai hồ sơ con báo cho nhau qua G1, G2, G3 (flow.js sendSignal, data.js D.hdSignals).
 * Báo cáo KCS, hồ sơ quyết toán, bản đã ký nằm ở Danh sách tài liệu (loại 4), không đặt trong form.
 */
(function () {
  const { txt, banner, ta, tf, num, sel, chk, req, opts, aiBox, dt } = window.EForms.b;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const hd = () => window.HopDong.find(Flow.state.parent) || {};
  const peer = (p) => Flow.caseOf(D.hdCaseCode(Flow.state.parent, p));
  const PA = { CHUNG: 'Ký chung nghiệm thu và thanh lý', RIENG: 'Ký riêng', KHONG: 'Không yêu cầu thanh lý' };

  const head = () => txt('**{{hd.code}}** — {{hd.ten}} · nhà thầu {{hd.ncc}} · giá trị **{{hd.gia}} tỷ đồng**');
  const planLine = () => txt('Phương án ký: **{{phuongAn}}**');
  const chungBanner = () => banner('Ký chung: hồ sơ gồm biên bản nghiệm thu và biên bản thanh lý, một tuyến ký.', '=not(laChung)', 'moved');
  /* Tuyến ký: Không đồng ý mở dialog nhận xét. */
  const ky = (id, n, key, note, q) => ({ id, q: q || [],
    schema: () => ({ components: [head(), planLine(), chungBanner(), aiBox('kết quả kiểm tra trước khi trình ký', 'Kết quả: **Đạt**'), ta(`${key}YKien${n}`, 'Ý kiến')] }),
    notes: () => [note], write: (v) => pick(v, [`${key}YKien${n}`]) });

  const NT = {
    1: { id: 'dtms-ms2303-t01-kcs-tai-san',
      schema: () => ({ components: [head(), ta('tnKcsNoiDung', 'Kết quả kiểm tra chất lượng', req())] }),
      notes: () => ['Báo cáo KCS đã ký tải lên ở Danh sách tài liệu (bắt buộc). Hoàn thành → bước 3. Loại KCS theo đối tượng nghiệm thu (cổng G1): hợp đồng thiết bị là tài sản.'], write: (v) => pick(v, ['tnKcsNoiDung']) },
    2: { id: 'dtms-ms2303-t02-kcs-dich-vu',
      schema: () => ({ components: [head(), ta('tnKcsNoiDung', 'Kết quả, khối lượng dịch vụ', req())] }),
      notes: () => ['Báo cáo KCS đã ký tải lên ở Danh sách tài liệu (bắt buộc). Hoàn thành → bước 3.'], write: (v) => pick(v, ['tnKcsNoiDung']) },
    3: { id: 'dtms-ms2303-t03-tiep-nhan',
      schema: () => ({ components: [head(), txt('Kết quả kiểm tra chất lượng: {{tnKcsNoiDung}}'), sel('tnLoai', 'Loại hồ sơ nghiệm thu', req({ values: opts(['PAC / TAM', 'FAC / TAC', 'Nghiệm thu dịch vụ']) }))] }),
      notes: () => ['Cổng "Hồ sơ / KCS đủ điều kiện?" chọn bằng nút: thiếu chứng từ ở lại bước 3 chờ bổ sung, KCS chưa đạt sang Đơn vị sử dụng khắc phục.'], write: (v) => pick(v, ['tnLoai']) },
    4: { id: 'dtms-ms2303-t04-khac-phuc',
      schema: () => ({ components: [head(), ta('tnKhacPhuc', 'Kết quả khắc phục, kiểm tra lại', req())] }),
      notes: () => ['Nội dung chưa đạt xem ở Lịch sử hồ sơ. Hoàn thành → về đơn vị chủ quản ký lại báo cáo KCS (bước 1 hoặc 2), rồi bước 3.'], write: (v) => pick(v, ['tnKhacPhuc']) },
    6: { id: 'dtms-ms2303-t06-hoan-thien', q: ['P-155'], outputs: () => ['NT-BB'],
      schema: () => ({ components: [head(), banner('AI kiểm tra lần trước không đạt: rà soát căn cứ và phiên bản biên bản.', '=not(aiLoi)'), aiBox('dự thảo biên bản theo mẫu', 'Dự thảo theo loại hồ sơ **{{tnLoai}}**, căn cứ báo cáo KCS đã ký.'), ta('tnNoiDung', 'Nội dung biên bản nghiệm thu', req()),
        sel('tnPhuongAn', 'Phương án ký', req({ values: opts(Object.entries(PA)), conditional: { hide: '=daChotPa' } })), Object.assign(txt('Phương án ký đã chốt: **{{phuongAn}}**'), { conditional: { hide: '=not(daChotPa)' } })] }),
      notes: () => ['Tại đây biên bản mới hoàn thiện nội dung, CHƯA KÝ. Hoàn thành lần đầu → G1: khởi tạo hồ sơ MS23.04.', '<b>Giả lập P-155</b>: phương án ký chốt một lần ở bước này; lần sửa sau chỉ xem.', 'Đây cũng là nơi quay lại khi AI hoặc cấp ký trả hồ sơ (P-156: ký chung cũng sửa ở đây).'],
      write: (v) => pick(v, ['tnNoiDung', 'tnPhuongAn']) },
    7: { id: 'dtms-ms2303-t07-tap-hop',
      schema: () => ({ components: [head(), chungBanner(), txt('Biên bản thanh lý đã hoàn thiện từ MS23.04: **{{tlHoSo}}**'), chk('tnDaTapHop', 'Xác nhận', req({ text: 'Đã tập hợp biên bản nghiệm thu và biên bản thanh lý vào cùng bộ hồ sơ' }))] }),
      notes: () => ['Việc này chỉ có sau khi MS23.04 hoàn thiện biên bản thanh lý (G2). Một tuyến ký tại MS23.03, không chạy tuyến thanh lý song song.'], write: (v) => pick(v, ['tnDaTapHop']) },
    9: ky('dtms-ms2303-t09-ky', 9, 'tn', 'Trưởng phòng Hợp đồng ký duyệt. Không đồng ý → bước 6.', ['P-156']),
    10: ky('dtms-ms2303-t10-ky', 10, 'tn', 'Giám đốc ký. <b>Giả lập P-157</b>: Phó Tổng Giám đốc. Không đồng ý → bước 6.', ['P-156', 'P-157']),
    11: ky('dtms-ms2303-t11-kiem-tra', 11, 'tn', 'Văn thư kiểm tra. <b>Giả lập P-154</b>: bản vẽ để nhánh không đạt treo, diễn giải chỉ ghi trả Phòng Hợp đồng; prototype về bước 6.', ['P-154']),
    12: ky('dtms-ms2303-t12-ky', 12, 'tn', 'Tổng Giám đốc ký. <b>Giả lập P-157</b>: Tổng Giám đốc VHT. Không đồng ý → bước 6.', ['P-156', 'P-157']),
    13: { id: 'dtms-ms2303-t13-cap-nhat', outputs: () => [],
      schema: () => ({ components: [head(), planLine(), chk('tnNccKy', 'Chữ ký nhà thầu', req({ text: 'Đã nhận chữ ký của nhà thầu theo hợp đồng' })), dt('tnNgay', 'Ngày nghiệm thu thực tế', req({ layout: { columns: 8 } }))] }),
      notes: () => ['Biên bản đã ký đầy đủ tải lên ở Danh sách tài liệu (bắt buộc). Ký chung: gửi kết quả về MS23.04 (G3). Hoàn thành → service task 14 cập nhật ngày thực tế, dùng chung với MS23 bước 5.'], write: (v) => pick(v, ['tnNccKy', 'tnNgay']) },
  };
  window.EForms['MS23.03'] = (tok) => NT[tok.task] || null;

  const TL = {
    1: { id: 'dtms-ms2304-t01-kiem-tra', q: ['P-155'],
      schema: () => ({ components: [head(), planLine(), chk('tlDaKiemTra', 'Xác nhận', req({ text: 'Đã kiểm tra yêu cầu thanh lý, điều kiện ký chung và bảo lãnh theo hợp đồng' }))] }),
      notes: () => ['Nhận thông tin từ G1: biên bản nghiệm thu đã hoàn thiện, chưa ký. <b>Giả lập P-155</b>: phương án ký đã chốt ở MS23.03 bước 6, bước này xác nhận.'], write: (v) => pick(v, ['tlDaKiemTra']) },
    2: { id: 'dtms-ms2304-t02-chuan-bi-chung',
      schema: () => ({ components: [head(), chungBanner(), ta('tlGhiChu', 'Ghi chú chuẩn bị biên bản thanh lý')] }),
      notes: () => ['Dựa trên biên bản nghiệm thu chưa ký, không chờ nghiệm thu ký xong. Hoàn thành → AI soạn dự thảo (bước 6).'], write: (v) => pick(v, ['tlGhiChu']) },
    3: { id: 'dtms-ms2304-t03-cho-nghiem-thu',
      schema: () => ({ components: [head(), txt('Hồ sơ nghiệm thu: **{{ntTrangThai}}**'), chk('tlBaoLanh', 'Bảo lãnh', { text: 'Đã đủ bảo lãnh theo hợp đồng' })] }),
      notes: () => ['Cổng "Nghiệm thu đã ký xong hẳn và đầy đủ bảo lãnh?" chọn bằng nút; hệ thống chặn khi hồ sơ MS23.03 chưa hoàn tất. Tiếp tục chờ thì ở lại bước 3.'], write: (v) => pick(v, ['tlBaoLanh']) },
    4: { id: 'dtms-ms2304-t04-chuan-bi-rieng',
      schema: () => ({ components: [head(), ta('tlGhiChu', 'Ghi chú hồ sơ thanh lý')] }),
      notes: () => ['Tập hợp biên bản nghiệm thu đã ký, bảo lãnh và căn cứ thanh lý. Hoàn thành → bước 5 quyết toán.'], write: (v) => pick(v, ['tlGhiChu']) },
    5: { id: 'dtms-ms2304-t05-quyet-toan', q: ['P-159'],
      schema: () => ({ components: [head(), num('tlQuyetToan', 'Giá trị quyết toán (tỷ đồng)', req({ validate: { required: true, min: 0 } })), ta('tlQtGhiChu', 'Ghi chú quyết toán')] }),
      notes: () => ['Hồ sơ quyết toán tải lên ở Danh sách tài liệu (bắt buộc). Bản vẽ bước 5 không có mũi tên ra; theo diễn giải sang bước 6. <b>Giả lập P-159</b>.'], write: (v) => pick(v, ['tlQuyetToan', 'tlQtGhiChu']) },
    7: { id: 'dtms-ms2304-t07-hoan-thien', outputs: () => ['TL-BB'],
      schema: () => ({ components: [head(), banner('AI kiểm tra lần trước không đạt: rà soát căn cứ và phiên bản biên bản.', '=not(aiLoi)'), aiBox('dự thảo biên bản thanh lý theo mẫu', 'Dự thảo theo hợp đồng, căn cứ bàn giao, nghiệm thu, bảo lãnh.'), ta('tlNoiDung', 'Nội dung biên bản thanh lý', req())] }),
      notes: () => ['Cần thống nhất nội dung thì trao đổi nhà thầu qua email. Nơi quay lại khi AI hoặc cấp ký riêng trả hồ sơ. Hoàn thành → AI kiểm tra (bước 8) → ký chung: G2 về MS23.03; ký riêng: bước 9.'], write: (v) => pick(v, ['tlNoiDung']) },
    9: ky('dtms-ms2304-t09-ky', 9, 'tl', 'Trưởng phòng Hợp đồng ký duyệt, chỉ nhánh ký riêng. Không đồng ý → bước 7.'),
    10: ky('dtms-ms2304-t10-ky', 10, 'tl', 'Giám đốc VHT ký. <b>Giả lập P-157</b>. Không đồng ý → bước 7.', ['P-157']),
    11: ky('dtms-ms2304-t11-kiem-tra', 11, 'tl', 'Văn thư kiểm tra. Không đạt → bước 7.'),
    12: ky('dtms-ms2304-t12-ky', 12, 'tl', 'Tổng Giám đốc ký. <b>Giả lập P-157</b>. Không đồng ý → bước 7.', ['P-157']),
    13: { id: 'dtms-ms2304-t13-cap-nhat', q: ['P-160'],
      schema: () => ({ components: [head(), planLine(), chk('tlNccKy', 'Chữ ký nhà thầu', req({ text: 'Đã nhận biên bản có chữ ký nhà thầu, gửi lại bản ký đầy đủ' })), dt('tlNgay', 'Ngày thanh lý', req({ layout: { columns: 8 } }))] }),
      notes: () => ['Ký chung nhận kết quả từ G3, ký riêng nhận sau tuyến ký MS23.04. Biên bản đã ký tải lên ở Danh sách tài liệu (bắt buộc). <b>Giả lập P-160</b>: không chặn khi chưa thanh toán đủ. Bản vẽ bước 13 không có mũi tên ra; theo diễn giải sang bước 14.'], write: (v) => pick(v, ['tlNccKy', 'tlNgay']) },
  };
  window.EForms['MS23.04'] = (tok) => TL[tok.task] || null;

  const vars = (key) => () => {
    const h = hd(), u = Flow.ui, k = window.HopDong.kit(), v = Flow.state.vars, nt = peer('MS23.03'), tl = peer('MS23.04'), plan = v.plan || u.tnPhuongAn || 'RIENG';
    const ms = (Flow.caseOf(D.hdCaseCode(Flow.state.parent, 'MS23')).vars.track.ms || []).find((m) => m.kind === 'NT') || {};
    return Object.assign({}, u, { tnKcsNoiDung: u.tnKcsNoiDung || 'Thiết bị đạt yêu cầu kỹ thuật theo hợp đồng', tnLoai: u.tnLoai || 'PAC / TAM', tnPhuongAn: u.tnPhuongAn || plan, phuongAn: PA[plan], laChung: plan === 'CHUNG', daChotPa: !!v.plan,
      tnNgay: u.tnNgay || ms.plan, tlNgay: u.tlNgay || Flow.dateOf(Flow.state.clock), tlQuyetToan: u.tlQuyetToan != null ? u.tlQuyetToan : h.value, aiLoi: key === 'nt' ? !!(v.aiNt && !v.aiNt.ok) : !!(v.aiTl && !v.aiTl.ok),
      tlHoSo: tl ? tl.code : '', ntTrangThai: !nt ? 'Chưa có' : nt.status === 'approved' ? 'Đã ký đầy đủ, đã cập nhật ngày thực tế' : 'Đang xử lý',
      hd: { code: h.code, ten: h.title, ncc: k.nccName(h.ncc), gia: h.value } });
  };
  const at = (n) => { const x = Flow.lastOf(n); return x ? Flow.dateOf(x.t) : null; };
  const reqOf = (map) => (tok) => (map[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] }));
  const filesOf = (list) => () => { const u = Flow.ui, no = Flow.state.code, rows = [];
    list.forEach(([key, name, by]) => { if (u[key] || (at(by) && Flow.state.history.some((x) => String(x.task) === String(by) && x.who))) rows.push({ name: `${name}-${no}.pdf`, at: at(by) || Flow.dateOf(Flow.state.clock) }); });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows; };
  const docOf = (docs) => (code) => { const d = docs.find((x) => x.code === code); if (!d) return null; const h = hd(), esc = window.UI.esc, u = Flow.ui;
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(h.title)}</p><p>${esc(u.tnNoiDung && code === 'NT-BB' ? u.tnNoiDung : u.tlNoiDung || 'Nội dung theo mẫu.')}</p></div>` }; };
  const outsOf = (docs) => () => docs.filter((d) => at(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: at(d.by) }));
  const ND = [{ code: 'NT-BB', name: 'Biên bản nghiệm thu', by: 6 }], LD = [{ code: 'TL-BB', name: 'Biên bản thanh lý', by: 7 }];
  window.EForms.hdBy['MS23.03'] = { vars: vars('nt'), reqDocs: reqOf({ 1: [['tnKcs', 'Báo cáo KCS đã ký']], 2: [['tnKcs', 'Báo cáo KCS đã ký']], 13: [['tnBanKy', 'Biên bản nghiệm thu đã ký đầy đủ']] }),
    files: filesOf([['tnKcs', 'Bao-cao-KCS', 1], ['tnBanKy', 'Bien-ban-nghiem-thu-da-ky', 13]]), outs: outsOf(ND), doc: docOf(ND), version: () => 1 + Flow.doneCount(6), docs: ND, check: () => null };
  window.EForms.hdBy['MS23.04'] = { vars: vars('tl'), reqDocs: reqOf({ 5: [['tlQtFile', 'Hồ sơ quyết toán']], 13: [['tlBanKy', 'Biên bản thanh lý đã ký đầy đủ']] }),
    files: filesOf([['tlQtFile', 'Ho-so-quyet-toan', 5], ['tlBanKy', 'Bien-ban-thanh-ly-da-ky', 13]]), outs: outsOf(LD), doc: docOf(LD), version: () => 1 + Flow.doneCount(7), docs: LD,
    /* Ký riêng: nghiệm thu phải đi hết MS23.03 trước (DG-MS23.03 §B.5). */
    check: (tok, choice) => (String(tok.task) === '3' && choice && choice.main && (peer('MS23.03') || {}).status !== 'approved' ? 'Nghiệm thu chưa ký xong: hồ sơ MS23.03 phải hoàn tất trước khi chuẩn bị thanh lý riêng.' : null) };
})();
