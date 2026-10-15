/*
 * eForm của các user task MS02 Điều chỉnh ĐXMS (T21 B2, plan §4 K1). Trang "MS02 ver1.1" cùng topo MS01 v1.1 (D-37): mỗi bước dùng lại
 * eForm MS01 cùng số, formId đổi sang dtms-ms02-…, thêm dòng thông tin lần điều chỉnh và cảnh báo chuyển ngưỡng (luật hiển thị theo
 * family = MS02). Riêng: bước 1 (ĐXMS cũ, chỉ xem — P-100), bước 4 (lý do, phạm vi, bảng trước – sau, giá trị sau điều chỉnh — P-103),
 * bước 7 / 10 (kết quả cũ chỉ xem cạnh kết quả mới — P-108). Văn bản đầu ra BM-01 / BM-09 / BM-08 sinh bản điều chỉnh (vars.js docAdj).
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, ta, num, sel, chkl, chk, req, dl, tf, opts } = B;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});

  /* Dòng đầu mọi form MS02 + banner chuyển ngưỡng (D-39). */
  const head = () => txt('**Điều chỉnh lần {{adj.lan}}** · ĐXMS {{adj.dxms}} · căn cứ hồ sơ {{adj.from}} · giá trị đã phê duyệt **{{adj.before}} tỷ** → sau điều chỉnh **{{adj.total}} tỷ** ({{adj.chenhLech}}) · luồng {{adj.nhanh}}');
  const cross = () => banner('{{adj.cross}}', '=adj.cross = ""', 'moved');
  const LY_DO = opts(['Thay đổi giá thị trường', 'Thay đổi quy mô, số lượng', 'Thay đổi yêu cầu kỹ thuật', 'Thay đổi nguồn vốn, thời gian', 'Khác']);
  const PHAM_VI = opts(['Giá trị', 'Danh mục hàng hoá / số lượng', 'Thời gian thực hiện', 'Nguồn vốn', 'Nội dung kỹ thuật']);

  const F = {
    1: { id: 'dtms-ms02-t01-dxms-dieu-chinh', q: ['P-100'],
      schema: () => ({ components: [
        txt('### ĐXMS cần điều chỉnh\n**{{adj.dxms}}** — {{hoSo.ten}}\nHồ sơ căn cứ: **{{adj.from}}** (quy trình {{adj.fromFlow}}, hoàn thành {{adj.fromAt}}) · giá trị hiệu lực **{{adj.before}} tỷ đồng**'),
        tbl('Văn bản phê duyệt của hồ sơ căn cứ', 'adjOldDocs', [['ma', 'Văn bản'], ['ten', 'Tên'], ['hoSo', 'Hồ sơ'], ['ngay', 'Ngày']]),
        tbl('Kết quả đã thực hiện của ĐXMS (hệ thống lấy về)', 'adjDone', [['loai', 'Loại'], ['ma', 'Mã'], ['noiDung', 'Nội dung'], ['trangThai', 'Trạng thái']]),
        txt('*ĐXMS chưa có KHLCNT, gói thầu hay hợp đồng.*', 16, '=count(adjDone) > 0'),
        chk('xacNhanDxms', 'Xác nhận', req({ text: 'Đây là ĐXMS cần điều chỉnh' }))] }),
      notes: () => ['ĐXMS đã chọn ở SCR-25 (Tạo hồ sơ, loại Điều chỉnh ĐXMS) — form chỉ xem, không đổi được ĐXMS ở đây (D-36). Hồ sơ căn cứ = hồ sơ Hoàn thành gần nhất của ĐXMS (Phê duyệt hoặc Điều chỉnh lần trước).',
        'Văn bản phê duyệt cũ theo quy trình của hồ sơ căn cứ: MS01.03 → BM-09; MS01.01 / .02 → BM-08 + BM-05 (MS01.01 thêm BM-06). Kết quả đã thực hiện đọc từ phân hệ Thầu / Hợp đồng theo nguồn hình thành = ĐXMS (GIẢ LẬP P-100).',
        'Hoàn thành → service task 02 lấy dữ liệu ĐXMS cũ, 03 AI gợi ý thông tin điều chỉnh.'],
      write: (v) => pick(v, ['xacNhanDxms']) },

    4: { id: 'dtms-ms02-t04-noi-dung-dieu-chinh', q: ['P-101', 'P-103', 'P-105'], ai: true,
      schema: () => ({ components: [head(),
        B.aiBox('thông tin điều chỉnh', '{{adjAi}}'),
        sel('lyDoNhom', 'Nhóm lý do', req({ values: LY_DO, layout: { columns: 8 } })),
        chkl('phamViDc', 'Phạm vi điều chỉnh', req({ values: PHAM_VI, layout: { columns: 8 } })),
        ta('lyDoDc', 'Lý do điều chỉnh', req()),
        num('giaTriSau', 'Giá trị sau điều chỉnh (tỷ đồng, gồm VAT)', req({ validate: { required: true, min: 0.01 }, layout: { columns: 8 } })),
        txt('Đã phê duyệt **{{adj.before}} tỷ** · chênh lệch **{{giaTriSau - giaTriTruoc}} tỷ**', 8),
        banner('Giá trị sau điều chỉnh qua ngưỡng {{adj.nguong}} tỷ so với ĐXMS cũ — hồ sơ sẽ đi luồng khác (hệ thống kiểm tra lại sau khi có báo giá).',
          '=not((giaTriTruoc >= adj.nguong and giaTriSau < adj.nguong) or (giaTriTruoc < adj.nguong and giaTriSau >= adj.nguong))', 'moved'),
        dl('adjRows', 'So sánh trước – sau điều chỉnh', [txt('**{{this.noiDung}}**', 4), txt('Đã phê duyệt: {{this.truoc}}', 6), tf('sau', 'Sau điều chỉnh', { layout: { columns: 6 } })]),
        ta('nganSach', 'Ghi chú ngân sách (điều chỉnh / bổ sung ngân sách thực hiện song song)')] }),
      notes: () => ['Gợi ý AI (service task 03) chỉ xem; người dùng nhập lý do, phạm vi và giá trị sau điều chỉnh. Giá trị sau điều chỉnh là giá trị của hồ sơ (Thông tin chung, văn bản) — cổng 160 tỷ đọc giá trị này khi qua bước 10 (D-39, B1-1).',
        'Cảnh báo mềm khi giá trị qua ngưỡng so với ĐXMS cũ; không chặn. Dòng giá trị của bảng trước – sau lấy từ ô Giá trị sau điều chỉnh.',
        'P-101: hạng mục đã có gói thầu / hợp đồng không bị khoá — BE cảnh báo khi giảm dưới số đã ký (GIẢ LẬP). P-103: điều chỉnh ngân sách không chặn phê duyệt điều chỉnh, chỉ ghi chú. P-105: phạm vi chọn ở đây là gợi ý CQCM ở bước 16.'],
      write: (v) => {
        window.Flow.setAdj({ total: Number(v.giaTriSau), reason: v.lyDoDc || '' });
        return pick(v, ['lyDoNhom', 'phamViDc', 'lyDoDc', 'giaTriSau', 'adjRows', 'nganSach']);
      } },
  };

  /* Bước 7: kết quả rà soát cũ chỉ xem cạnh kết quả mới. */
  function stock(e) {
    return Object.assign({}, e, { id: 'dtms-ms02-t07-ra-soat-ton-kho', q: (e.q || []).concat(['P-100']),
      schema: (h, tok) => ({ components: [head(),
        txt('Kết quả rà soát tồn kho cập nhật tại thời điểm điều chỉnh: **{{stock.trangThai}}** · {{stock.ma}} · gửi yêu cầu {{stock.gui}} — kết quả cũ: {{stockCu}}'),
        dl('ruaSoatKho', 'Kết quả rà soát (mới) và kết quả cũ (chỉ xem)', [
          txt('**{{this.n}}. {{this.name}}**\nSL đề xuất: {{this.prop}}', 4),
          txt('Tồn sổ sách **{{this.book}}** · đang giữ {{this.held}} · khả dụng **{{this.avail}}**', 4),
          txt('*Cũ: khả dụng {{this.cuAvail}} · dùng từ kho {{this.cuDung}}*', 3),
          num('fromStock', 'Dùng từ kho', { validate: { min: 0 }, layout: { columns: 3 }, conditional: { hide: '=not(this.coKho)' } }),
          txt('SL mua: **{{this.prop - this.fromStock}}**', 2)])] }),
      notes: (h) => ['MS02: service task 06 gửi lại yêu cầu rà soát tại thời điểm điều chỉnh; kết quả của hồ sơ cũ chỉ để so sánh, không dùng lại (plan §4 K1). Kết quả cũ GIẢ LẬP (P-100).'].concat(e.notes ? e.notes(h) : []) });
  }
  /* Bước 10: báo giá mới + bảng so với báo giá của hồ sơ cũ; dòng cuối nói nhánh theo giá trị sau điều chỉnh. */
  function quote(e) {
    return Object.assign({}, e, { id: 'dtms-ms02-t10-bao-gia', q: (e.q || []).filter((x) => x !== 'P-26').concat(['P-108']),
      schema: (h, tok) => ({ components: [head(), cross()].concat(e.schema(h, tok).components.slice(0, -1), [
        tbl('So với báo giá của hồ sơ cũ — đơn giá thấp nhất, tỷ đồng, chỉ xem', 'baoGiaCu', [['dong', 'Dòng'], ['hang', 'Hàng hoá'], ['giaCu', 'Đơn giá cũ'], ['giaMoi', 'Mới'], ['chenhLech', 'Chênh lệch']]),
        txt('Báo giá cũ: hồ sơ {{adj.from}}, hoàn thành {{baoGiaCuNgay}}. {{quoteAfter}}'),
        txt('Giá trị sau điều chỉnh **{{adj.total}} tỷ** (gồm VAT) → {{if adj.nhanh = "MS02.03" then "< " + string(adj.nguong) + " tỷ: dự thảo Tờ trình BM-09 điều chỉnh" else "≥ " + string(adj.nguong) + " tỷ: dự thảo Tờ trình BM-01 điều chỉnh"}}.')]) }),
      notes: (h) => ['MS02: không có cổng "khớp quy trình" và 10a / 10b — cổng sau bước 10 rẽ 11 / 12 theo giá trị sau điều chỉnh (trang MS02 ver1.1, D-39). Báo giá cũ chỉ để so sánh (P-108); đơn giá cũ GIẢ LẬP.']
        .concat((e.notes ? e.notes(h) : []).slice(0, -1)) });
  }

  /* Bước khác: form MS01 cùng số + dòng điều chỉnh; bước dự thảo / phê duyệt thêm banner chuyển ngưỡng. */
  const CROSS_AT = [11, 12, 13, 16, 60];
  function reuse(e, tok) {
    return Object.assign({}, e, { id: e.id.replace('-ms01-', '-ms02-'),
      schema: (h, t) => { const s = typeof e.schema === 'function' ? e.schema(h, t) : e.schema;
        return { components: [head()].concat(CROSS_AT.includes(tok.task) ? [cross()] : [], s.components) }; },
      notes: (h, t) => [`MS02: dùng lại eForm MS01 bước ${tok.task} (D-37), formId riêng, thêm dòng thông tin lần điều chỉnh. Văn bản đầu ra là bản điều chỉnh (BM-01 / BM-09 / BM-08 có mục Nội dung điều chỉnh).`]
        .concat(e.notes ? e.notes(h, t) : []) });
  }

  window.EForms.MS02 = (tok, h) => {
    if (F[tok.task]) return F[tok.task];
    const e = window.EForms.MS01(tok, h);
    if (!e) return null;
    if (tok.task === 7) return stock(e);
    if (String(tok.task) === '10') return quote(e);
    return reuse(e, tok);
  };
})();
