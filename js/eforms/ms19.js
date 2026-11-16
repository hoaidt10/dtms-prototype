/*
 * eForm của các user task MS19 Tổ chức lựa chọn nhà thầu (T67 T5, D-118; plan docs/dtms/prototype-T67-thau-hop-dong.md §3 T5).
 * Nguồn: BPMN-MS19 (trang MS19 của BPMN-DTMS-1611) — luồng chính 24 bước, quy trình con theo hình thức chỉ có gạch đầu dòng;
 * THAU-TT-1311 §4.1 (backbone LC), §4.2 (rộng rãi 1 túi), §4.6 (chỉ định thầu). Q7 = A: chi tiết rộng rãi 1 túi (3.1–3.6) và chỉ định thầu (7.1–7.4),
 * các hình thức khác một bước gộp. Biểu mẫu HSMT / HSYC / báo cáo đánh giá / KQLCNT khách chưa gửi (THAU-TT-1311 §8) → trường GIẢ LẬP theo Quy chế.
 * Hồ sơ con của gói thầu (đối tượng cha). Mẫu hợp đồng chọn ở bước lập HSMT / HSYC (T66 L2, H-Q1 = A) — danh mục Mẫu hợp đồng (catalog mau-hop-dong).
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, ta, tf, num, sel, rad, chk, req, dl, opts, dt } = B;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const T = () => window.Thau;
  const g0 = () => T().pkOf(Flow.state.parent) || {};
  const ty = (v) => window.UI.ty(v, 2);
  const kit = () => T().kit;

  const head = () => txt('**{{goi.code}}** — {{goi.ten}} · {{goi.hinhThuc}}, {{goi.phuongThuc}} · giá gói thầu **{{goi.gia}} tỷ đồng** · KHLCNT {{goi.kh}}');
  const back = (label) => banner(`${label}: {{lyDoTra}}`, '=lyDoTra = ""', 'info');
  const hsKind = () => (['DTRR', 'DTHC'].includes(g0().form) ? 'HSMT' : g0().form === 'CGTT' ? 'HSMCG' : 'HSYC');
  /* Lập hồ sơ mời: mẫu hợp đồng là trường của HSMT / HSYC (QT-10.2.4 §5.2). Gợi ý theo loại gói (H-Q2, GIẢ LẬP), người lập chọn lại được. */
  const hsForm = (id, kind) => ({ id, outputs: () => ['LC-HS'],
    schema: () => ({ components: [head(), txt(`Lập **${kind === 'HSYC' ? 'hồ sơ yêu cầu (HSYC)' : 'hồ sơ mời thầu (HSMT)'}** từ dữ liệu gói thầu đã duyệt trong KHLCNT.`),
      ...(kind === 'HSYC' ? [sel('lcNhaThauDk', 'Nhà thầu dự kiến', req({ valuesKey: 'nccOptions', searchable: true, layout: { columns: 8 } }))] : []),
      sel('lcPpDanhGia', 'Phương pháp đánh giá', req({ values: opts(['Giá thấp nhất', 'Giá đánh giá', 'Kết hợp giữa kỹ thuật và giá']), layout: { columns: 8 } })),
      num('lcBaoDam', 'Bảo đảm dự thầu (% giá gói thầu)', req({ layout: { columns: 8 } })),
      dt('lcNgayDong', kind === 'HSYC' ? 'Hạn nộp HSĐX' : 'Thời điểm đóng thầu', req({ layout: { columns: 8 } })),
      sel('lcMauHd', 'Mẫu hợp đồng', req({ valuesKey: 'mauOptions', searchable: true, layout: { columns: 12 } })),
      txt('Phương thức thanh toán theo mẫu đã chọn: **{{lcTt}}**.'),
      ta('lcYeuCau', 'Yêu cầu kỹ thuật, phạm vi cung cấp', req())] }),
    notes: () => ['Biểu mẫu HSMT / HSYC khách chưa cung cấp (THAU-TT-1311 §8): trường GIẢ LẬP theo Quy chế (bảo đảm dự thầu ≤ 3% giá gói — Điều 27, kiểm khi xác nhận).',
      '<b>Mẫu hợp đồng</b> đọc danh mục Mẫu hợp đồng (BM-HD-2026); gợi ý theo Loại gói thầu và nhà thầu trong / ngoài nước (GIẢ LẬP, chờ BA chốt quy tắc), người lập chọn lại được. Phương thức thanh toán đi theo mẫu. MS22 bước 3 đọc lại mẫu này.'],
    write: (v) => pick(v, ['lcNhaThauDk', 'lcPpDanhGia', 'lcBaoDam', 'lcNgayDong', 'lcMauHd', 'lcYeuCau']) });
  const danhGia = (id, label) => ({ id, outputs: () => ['LC-BCDG'],
    schema: () => ({ components: [head(),
      dl('lcDanhGia', label, [txt('**{{this.ten}}** · giá dự thầu {{this.gia}} tỷ đồng', 8),
        rad('hopLe', 'Hợp lệ', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 4 } })), rad('kyThuat', 'Kỹ thuật', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 4 } })),
        ta('ghiChu', 'Nhận xét')]),
      ta('lcLamRo', 'Nội dung làm rõ (nếu có)')] }),
    notes: () => ['Kết quả đánh giá theo nhà thầu là bảng lặp eForm của Tổ chuyên gia (Backlog dòng 360–372). Danh sách nhà thầu lấy từ hồ sơ đã mở / HSĐX đã nhận.'],
    write: (v) => pick(v, ['lcDanhGia', 'lcLamRo']) });
  const thuongThao = (id) => ({ id, outputs: () => ['LC-BBTT'],
    schema: () => ({ components: [head(),
      sel('lcNhaThau', 'Nhà thầu đề nghị trúng thầu', req({ valuesKey: 'datOptions', layout: { columns: 10 } })),
      num('lcGiaTT', 'Giá sau thương thảo (tỷ đồng)', req({ layout: { columns: 6 } })), dt('lcNgayTT', 'Ngày biên bản thương thảo', req({ layout: { columns: 8 } })),
      ta('lcNoiDungTT', 'Nội dung thương thảo', req())] }),
    notes: () => ['Thương thảo hợp đồng với nhà thầu xếp hạng thứ nhất (Điều 36); không thành công thì mời nhà thầu kế tiếp — chọn lại ở ô Nhà thầu đề nghị trúng thầu. Ngày biên bản thương thảo là trường trộn của mẫu hợp đồng.'],
    write: (v) => pick(v, ['lcNhaThau', 'lcGiaTT', 'lcNgayTT', 'lcNoiDungTT']) });
  /* Hình thức chưa có sơ đồ con (Q7 = A): một bước gộp, liệt kê trình tự theo BPMN-MS19. */
  const gop = (n) => ({ id: `dtms-ms19-t${String(n).padStart(2, '0')}-gop`, outputs: () => ['LC-BCDG'],
    schema: () => ({ components: [head(), txt('Trình tự theo hình thức **{{goi.hinhThuc}}**:\n{{trinhTu}}'),
      sel('lcNhaThau', 'Nhà thầu / đơn vị được đề nghị', req({ valuesKey: 'nccOptions', searchable: true, layout: { columns: 10 } })),
      num('lcGiaTT', 'Giá đề nghị (tỷ đồng)', req({ layout: { columns: 6 } })), ta('lcNoiDungTT', 'Kết quả thực hiện', req())] }),
    notes: () => ['<b>GIẢ LẬP</b> (D-118 Q7 = A): BPMN-MS19 chỉ ghi gạch đầu dòng cho quy trình con của hình thức này, chưa có sơ đồ con — prototype gộp thành một bước, trình tự hiện chỉ xem. Chờ BA vẽ quy trình con (P-235).'],
    write: (v) => pick(v, ['lcNhaThau', 'lcGiaTT', 'lcNoiDungTT']) });
  const ky = () => ({ id: 'dtms-ms19-t16-van-ban-kq', outputs: () => ['LC-QD'],
    schema: () => ({ components: [head(), txt('Dự thảo **Quyết định phê duyệt KQLCNT** do hệ thống sinh từ hồ sơ KQLCNT. Người ký: **{{nguoiKy}}**.'),
      tbl('Kết quả lựa chọn nhà thầu', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcQdGhiChu', 'Ghi chú rà soát dự thảo')] }),
    notes: () => ['Chọn phương thức ký bằng nút: Trình ký VOffice (17 → 19 nhận kết quả) hoặc Trình ký cứng (18 tải bằng chứng ký). Lỗi kỹ thuật → 20 thử lại; người ký từ chối → 21 chỉnh sửa.'],
    write: (v) => pick(v, ['lcQdGhiChu']) });

  const F = {
    1: { id: 'dtms-ms19-t01-khoi-tao',
      schema: () => ({ components: [head(), tbl('Thông tin gói thầu đã duyệt trong KHLCNT', 'thongTin', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]),
        chk('lcDaKiemTra', 'Xác nhận', req({ text: 'Đã kiểm tra thông tin gói thầu, Tổ chuyên gia và Tổ thẩm định' }))] }),
      notes: () => ['Mỗi gói một tiến trình (BPMN-MS19 bước 1). Hoàn thành → bước 2 (hệ thống) đọc hình thức / phương thức đã duyệt trong KHLCNT và rẽ quy trình con theo hình thức.'],
      write: (v) => pick(v, ['lcDaKiemTra']) },
    3.1: hsForm('dtms-ms19-t03-1-lap-hsmt', 'HSMT'),
    3.2: { id: 'dtms-ms19-t03-2-tham-dinh-hsmt', outputs: () => ['LC-HS'],
      decide: { btn: 'Kết quả thẩm định HSMT', yes: 'Đạt — phê duyệt HSMT', no: 'Không đạt — trả sửa', reasonKey: 'lcYKienHs' },
      schema: () => ({ components: [head(), tbl('Hồ sơ mời thầu', 'hs', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcYKienHs', 'Ý kiến thẩm định')] }),
      notes: () => ['Không đạt → trả Tổ chuyên gia sửa (THAU-TT-1311 §4.2 bước 2), bắt buộc ý kiến.'], write: (v) => pick(v, ['lcYKienHs']) },
    3.3: { id: 'dtms-ms19-t03-3-phat-hanh',
      schema: () => ({ components: [head(), tf('lcTbmt', 'Số thông báo mời thầu', req({ layout: { columns: 8 } })), dt('lcNgayPh', 'Ngày phát hành', req({ layout: { columns: 8 } })),
        chk('lcDaDang', 'Xác nhận', req({ text: 'Đã đăng tải HSMT trên Cổng đấu thầu' }))] }),
      notes: () => ['Phát hành qua tích hợp Cổng đấu thầu (P-82): số TBMT do cổng trả về, GIẢ LẬP theo mã gói.'], write: (v) => pick(v, ['lcTbmt', 'lcNgayPh', 'lcDaDang']) },
    3.4: { id: 'dtms-ms19-t03-4-mo-thau',
      schema: () => ({ components: [head(), tbl('Hồ sơ dự thầu đã nhận', 'hsdt', [['ma', 'Mã nhà thầu'], ['ten', 'Tên nhà thầu'], ['gia', 'Giá dự thầu (tỷ đồng)']]),
        dt('lcNgayMo', 'Ngày mở thầu', req({ layout: { columns: 8 } }))] }),
      notes: () => ['Danh sách HSDT nhận từ Cổng đấu thầu khi đóng thầu (P-82, GIẢ LẬP theo dữ liệu nhà thầu của gói). Chỉ 01 HSDT → tình huống Điều 36 ở tab Tình huống & kiến nghị.'],
      write: (v) => pick(v, ['lcNgayMo']) },
    3.5: danhGia('dtms-ms19-t03-5-danh-gia', 'Đánh giá HSDT'),
    3.6: thuongThao('dtms-ms19-t03-6-thuong-thao'),
    7.1: hsForm('dtms-ms19-t07-1-lap-hsyc', 'HSYC'),
    7.2: { id: 'dtms-ms19-t07-2-gui-hsyc',
      schema: () => ({ components: [head(), txt('Gửi HSYC cho nhà thầu dự kiến **{{nhaThauDk}}**.'), dt('lcNgayGui', 'Ngày gửi HSYC', req({ layout: { columns: 8 } }))] }),
      notes: () => ['Chỉ định thầu: HSYC gửi một nhà thầu dự kiến (THAU-TT-1311 §4.6); trạng thái gói Chờ nhà thầu phản hồi.'], write: (v) => pick(v, ['lcNgayGui']) },
    7.3: danhGia('dtms-ms19-t07-3-danh-gia', 'Đánh giá HSĐX'),
    7.4: thuongThao('dtms-ms19-t07-4-thuong-thao'),
    4: gop(4), 5: gop(5), 6: gop(6), 8: gop(8), 9: gop(9), 10: gop(10), 11: gop(11), 12: gop(12),
    13: { id: 'dtms-ms19-t13-ho-so-kq', outputs: () => ['LC-BCKQ'],
      schema: () => ({ components: [head(), back('Yêu cầu chỉnh sửa'), tbl('Kết quả lựa chọn nhà thầu', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcKqGhiChu', 'Ghi chú hồ sơ KQLCNT')] }),
      notes: () => ['Tổng hợp từ quy trình con (nhà thầu, giá, ngày thương thảo) — chỉ xem; sửa thì sửa ở bước của quy trình con.'], write: (v) => pick(v, ['lcKqGhiChu']) },
    14: { id: 'dtms-ms19-t14-tham-dinh-kq', outputs: () => ['LC-BCKQ'],
      decide: { btn: 'Kết quả thẩm định KQLCNT', yes: 'Đạt', no: 'Không đạt — trả sửa', reasonKey: 'lcYKienKq' },
      schema: () => ({ components: [head(), tbl('Kết quả lựa chọn nhà thầu', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcYKienKq', 'Ý kiến thẩm định')] }),
      notes: () => ['Kiểm tra căn cứ, kết quả đánh giá / thương thảo và hồ sơ trình (BPMN-MS19 bước 14). Không đạt → 15 sửa, trình lại 13.'], write: (v) => pick(v, ['lcYKienKq']) },
    15: { id: 'dtms-ms19-t15-sua-kq', schema: () => ({ components: [head(), back('Ý kiến thẩm định'), ta('lcNoiDungSua', 'Nội dung đã chỉnh sửa', req())] }),
      notes: () => ['Sửa theo ý kiến thẩm định rồi trình lại (15 → 13).'], write: (v) => pick(v, ['lcNoiDungSua']) },
    16: ky(),
    18: { id: 'dtms-ms19-t18-ky-cung', schema: () => ({ components: [head(), tf('lcQdSo', 'Số Quyết định', req({ layout: { columns: 8 } })), dt('lcQdNgay', 'Ngày ký', req({ layout: { columns: 8 } })),
      txt('Bản Quyết định đã ký tải lên ở Danh sách tài liệu.')] }), notes: () => ['Ký ngoài hệ thống: tải bằng chứng ký → 19 nhận kết quả.'], write: (v) => pick(v, ['lcQdSo', 'lcQdNgay']) },
    21: { id: 'dtms-ms19-t21-tu-choi', schema: () => ({ components: [head(), back('Ý kiến từ chối của người ký'), ta('lcChuyenSua', 'Nội dung cần chỉnh sửa', req())] }),
      notes: () => ['Người ký từ chối → sửa văn bản phê duyệt (21 → 16).'], write: (v) => pick(v, ['lcChuyenSua']) },
    22: { id: 'dtms-ms19-t22-cong-khai', schema: () => ({ components: [head(), tbl('Thông tin công khai KQLCNT', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]),
      chk('lcDangTai', 'Xác nhận', req({ text: 'Đã kiểm tra dữ liệu trước khi đăng tải' }))] }),
      notes: () => ['Hoàn thành → 23 đăng tải qua Cổng đấu thầu → 24 đóng tổ chức LCNT, mở Hợp đồng (Tạo hợp đồng ở Chi tiết gói thầu).'], write: (v) => pick(v, ['lcDangTai']) },
  };
  window.EForms.MS19 = (tok) => F[tok.task] || null;

  const DOCS = [{ code: 'LC-HS', name: 'Hồ sơ mời thầu / hồ sơ yêu cầu', by: ['3.1', '7.1'] }, { code: 'LC-BCDG', name: 'Báo cáo đánh giá hồ sơ', by: ['3.5', '7.3', 4, 5, 6, 8, 9, 10, 11, 12] },
    { code: 'LC-BBTT', name: 'Biên bản thương thảo hợp đồng', by: ['3.6', '7.4'] }, { code: 'LC-BCKQ', name: 'Báo cáo kết quả lựa chọn nhà thầu', by: [13] },
    { code: 'LC-QD', name: 'Quyết định phê duyệt KQLCNT', by: [16] }];
  const REQ = { 18: [['lcQdKyFile', 'Quyết định phê duyệt KQLCNT đã ký']] };
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };
  const atAny = (ns) => ns.map(at).filter(Boolean).pop() || null;
  /* Nhà thầu tham dự: theo dữ liệu nhà thầu của gói; gói chưa có thì 3 nhà cung cấp đầu danh mục (GIẢ LẬP). */
  const bidders = (g) => (g.bidders && g.bidders.length ? g.bidders.map((b) => [b[0], b[1]]) : ['NCC-000001', 'NCC-000004', 'NCC-000009'].map((c, i) => [c, Math.round(g.price * (0.94 + i * 0.02) * 100) / 100]));

  function vars(tok) {
    const g = g0(), u = Flow.ui, k = T().khOf(g.kh) || {}, cat = kit().cat, ncc = (c) => { const r = D.nccOf(c); return r.name || r.short || c; };
    const mau = D.mauOf ? D.mauOf(u.lcMauHd || T().mauGoiY(g)) : null;
    const bs = bidders(g), dg = u.lcDanhGia || (String(tok && tok.task).startsWith('7') || u.lcNhaThauDk ? [[u.lcNhaThauDk || bs[0][0], bs[0][1]]] : bs)
      .map(([c, gia]) => ({ ma: c, ten: ncc(c), gia: ty(gia), giaSo: gia, hopLe: 'Đạt', kyThuat: 'Đạt', ghiChu: '' }));
    const dat = dg.filter((r) => r.hopLe === 'Đạt' && r.kyThuat === 'Đạt');
    const win = u.lcNhaThau || (dat[0] || {}).ma, td = k.level === 'TD';
    const lastBack = Flow.state.history.slice().reverse().find((h) => h.reason && ['3.2', '14', '21'].includes(String(h.task)) || (h.reason && String(h.task) === '19'));
    const kq = [{ muc: 'Nhà thầu đề nghị trúng thầu', giaTri: win ? ncc(win) : 'Chưa có' }, { muc: 'Giá đề nghị trúng thầu', giaTri: u.lcGiaTT != null ? ty(Number(u.lcGiaTT)) + ' tỷ đồng' : '-' },
      { muc: 'Loại hợp đồng', giaTri: cat('loai-hop-dong', g.contract) }, { muc: 'Thời gian thực hiện hợp đồng', giaTri: g.hdTime || g.execTime || '' },
      { muc: 'Mẫu hợp đồng', giaTri: mau ? `${mau.code} — ${mau.name}` : '-' }, { muc: 'Ngày biên bản thương thảo', giaTri: u.lcNgayTT || '-' }];
    const trinhTu = { 4: ['Lập/thẩm định/phê duyệt HSMT', 'Phát hành; nhận HSDT', 'Mở & đánh giá HSĐXKT', 'Phê duyệt DS đạt kỹ thuật', 'Mở & đánh giá HSĐXTC; thương thảo'],
      5: ['Lập/phê duyệt & công khai danh sách ngắn', 'Lập/thẩm định/phê duyệt HSMT', 'Phát hành cho danh sách ngắn', 'Nhận/mở/đánh giá HSDT', 'Thương thảo'],
      6: ['Lập/thẩm định/phê duyệt HSMCG', 'Đăng chào giá trên Cổng đấu thầu', 'Theo dõi nhà thầu chào giá', 'Nhận/xác nhận kết quả chào giá'],
      8: ['Lập & phê duyệt phương án đàm phán', 'Gửi thư mời hãng/nhà thầu', 'Tổ chức các phiên đàm phán', 'Lập Báo cáo kết quả đàm phán'],
      9: ['Lập/thẩm định/phê duyệt HSYC', 'Gửi HSYC; nhận HSĐX', 'Mở & đánh giá HSĐX', 'Thương thảo/hoàn thiện hợp đồng'],
      10: ['Giao đơn vị thành viên thực hiện', 'Nhận/đánh giá hồ sơ theo yêu cầu', 'Hoàn thiện điều kiện thực hiện'],
      11: ['Lập phương án tự thực hiện', 'Lập dự thảo thỏa thuận giao việc', 'Hoàn thiện phương án với đơn vị thực hiện'],
      12: ['Thực hiện đúng cách thức/trình tự đã duyệt trong KHLCNT', 'Theo dõi mốc theo cấu hình được duyệt'] }[tok && tok.task] || [];
    return Object.assign({}, u, {
      goi: { code: g.code, ten: g.name, gia: ty(g.price), hinhThuc: cat('hinh-thuc-lcnt', g.form), phuongThuc: cat('phuong-thuc-lcnt', g.method), kh: g.kh },
      thongTin: [{ muc: 'Loại gói thầu', giaTri: cat('loai-goi-thau', g.type) }, { muc: 'Hình thức / phương thức LCNT', giaTri: `${cat('hinh-thuc-lcnt', g.form)}, ${cat('phuong-thuc-lcnt', g.method)}` },
        { muc: 'Loại hợp đồng', giaTri: cat('loai-hop-dong', g.contract) }, { muc: 'Thời gian lựa chọn nhà thầu', giaTri: g.selTime || '' }, { muc: 'Thời gian thực hiện gói thầu', giaTri: g.execTime || '' }],
      nccOptions: (window.Catalog ? window.Catalog.rows('nha-cung-cap') : []).map((r) => ({ label: `${r.code} — ${r.name || r.short}`, value: r.code })),
      mauOptions: (window.Catalog ? window.Catalog.rows('mau-hop-dong') : []).filter((r) => r.active !== false).map((r) => ({ label: `${r.code} — ${r.name} (${r.tt})`, value: r.code })),
      lcMauHd: u.lcMauHd || T().mauGoiY(g), lcTt: mau ? mau.tt : '-', lcPpDanhGia: u.lcPpDanhGia || 'Giá thấp nhất', lcBaoDam: u.lcBaoDam != null ? u.lcBaoDam : 1.5,
      lcNgayDong: u.lcNgayDong || '', lcYeuCau: u.lcYeuCau || ((g.items || []).map((i) => `${i[0]}: ${i[2]} ${i[1]}`).join('; ')), lcNhaThauDk: u.lcNhaThauDk || bs[0][0],
      nhaThauDk: ncc(u.lcNhaThauDk || bs[0][0]),
      hs: [{ muc: 'Loại hồ sơ', giaTri: hsKind() }, { muc: 'Phương pháp đánh giá', giaTri: u.lcPpDanhGia || 'Giá thấp nhất' }, { muc: 'Bảo đảm dự thầu', giaTri: `${u.lcBaoDam != null ? u.lcBaoDam : 1.5}% giá gói thầu` },
        { muc: 'Mẫu hợp đồng', giaTri: mau ? `${mau.code} — ${mau.name}` : '-' }, { muc: 'Phương thức thanh toán', giaTri: mau ? mau.tt : '-' }],
      lcTbmt: u.lcTbmt || `IB26${g.code.slice(-4)}-00`, lcNgayPh: u.lcNgayPh || Flow.dateOf(Flow.state.clock),
      hsdt: bs.map(([c, gia]) => ({ ma: c, ten: ncc(c), gia: ty(gia) })), lcNgayMo: u.lcNgayMo || Flow.dateOf(Flow.state.clock), lcNgayGui: u.lcNgayGui || Flow.dateOf(Flow.state.clock),
      lcDanhGia: dg, datOptions: dat.map((r) => ({ label: `${r.ma} — ${r.ten}`, value: r.ma })), lcNhaThau: win || '', lcGiaTT: u.lcGiaTT != null ? u.lcGiaTT : ((dat.find((r) => r.ma === win) || {}).giaSo || g.price),
      lcNgayTT: u.lcNgayTT || Flow.dateOf(Flow.state.clock), kq, trinhTu: trinhTu.map((x) => '• ' + x).join('\n'),
      nguoiKy: td ? 'Tổng Giám đốc Tập đoàn' : `${(D.personas.find((p) => p.id === 'tgd') || {}).name} — Tổng Giám đốc Tổng Công ty`,
      lyDoTra: lastBack ? lastBack.reason : '' });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] })); }
  /* Kiểm tra phía BE (EVars.check): bảo đảm dự thầu ≤ 3% (Điều 27); có ít nhất một nhà thầu đạt mới thương thảo. */
  function check(tok, choice, vals) {
    if (!vals) return null;
    if (vals.lcBaoDam != null && Number(vals.lcBaoDam) > 3) return 'Bảo đảm dự thầu không vượt quá 3% giá gói thầu.';
    if (vals.lcDanhGia && !vals.lcDanhGia.some((r) => r.hopLe === 'Đạt' && r.kyThuat === 'Đạt')) return 'Cần ít nhất một nhà thầu Đạt để chuyển thương thảo.';
    return null;
  }
  const files = () => {
    const u = Flow.ui, no = (Flow.state.parent || '').replace('GT-', ''), rows = [];
    if (u.lcQdKyFile) rows.push({ name: `Quyet-dinh-KQLCNT-da-ky-${no}.pdf`, at: at(18) || Flow.dateOf(Flow.state.clock) });
    if (at(17)) rows.push({ name: `Quyet-dinh-KQLCNT-da-ky-VOffice-${no}.pdf`, at: at(17) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => atAny(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: atAny(d.by) }));
  function doc(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const v = vars(null), esc = window.UI.esc;
    const rows = (list) => list.map((r) => `<p><b>${esc(r.muc)}:</b> ${esc(r.giaTri)}</p>`).join('');
    const body = { 'LC-HS': rows(v.hs) + `<p><b>Yêu cầu kỹ thuật:</b> ${esc(v.lcYeuCau)}</p>`,
      'LC-BCDG': (v.lcDanhGia || []).map((r) => `<p>${esc(r.ten)}: hợp lệ ${esc(r.hopLe)}, kỹ thuật ${esc(r.kyThuat)} — giá ${esc(r.gia)} tỷ đồng.</p>`).join(''),
      'LC-BBTT': `<p>Thương thảo với ${esc((v.kq[0] || {}).giaTri)} ngày ${esc(v.lcNgayTT)}.</p><p>${esc(v.lcNoiDungTT || '')}</p>`,
      'LC-BCKQ': rows(v.kq), 'LC-QD': `<p><b>QUYẾT ĐỊNH</b> phê duyệt kết quả lựa chọn nhà thầu gói thầu ${esc(v.goi.ten)}.</p>${rows(v.kq)}<p>Người ký: ${esc(v.nguoiKy)}.</p>` }[code];
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(v.goi.ten || '')}</p>${body}</div>` };
  }
  window.EForms.hdBy.MS19 = { vars, reqDocs, files, outs, doc, version: () => 1 + Flow.doneCount(15), docs: DOCS, check };
})();
