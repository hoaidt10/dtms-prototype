/*
 * eForm của MS23 Tổng quan (T25 B2): chỉ bước 3 là user task (DG-MS23 §A.4); bước 1, 2, 4, 5 là service task, kết quả xem ở tab Tiến độ thực hiện của Chi tiết hợp đồng.
 * Dữ liệu đọc từ hợp đồng cha và hồ sơ theo dõi (vars.track). Thông báo của nhà thầu nằm ở Danh sách tài liệu (loại 4), không đặt trong form.
 */
(function () {
  const { txt, ta, tf, sel, req, opts, dt } = window.EForms.b;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const hd = () => window.HopDong.find(Flow.state.parent) || {};
  const giao = () => ((Flow.state.vars.track || {}).ms || []).filter((m) => m.kind === 'GIAO' && !m.actual);
  /* Giả lập P-137: kênh tiếp nhận tự đặt. */
  const KENH = opts(['Email', 'Công văn', 'Điện thoại']);

  const F = {
    3: { id: 'dtms-ms23-t03-ghi-nhan-giao-hang', q: ['P-137', 'P-138'],
      schema: () => ({ components: [txt('**{{hd.code}}** — {{hd.ten}} · nhà thầu {{hd.ncc}}'),
        sel('tdDot', 'Đợt giao hàng', req({ values: opts(giao().map((m) => m.name)) })),
        dt('tdNgayDuKien', 'Ngày dự kiến giao', req({ layout: { columns: 8 } })),
        sel('tdKenh', 'Kênh tiếp nhận', req({ values: KENH, layout: { columns: 8 } })),
        tf('tdDiaDiem', 'Địa điểm giao hàng', req()),
        ta('tdNoiDung', 'Nội dung thông báo')] }),
      notes: () => ['Bước duy nhất người dùng xử lý của MS23 Tổng quan. Hoàn thành → service task 4: thông báo các bộ phận liên quan, chuyển hồ sơ giao hàng sang MS23.02 (dựng ở B6).',
        '<b>Giả lập P-137</b>: Phòng Hợp đồng nhập tay, chọn kênh tiếp nhận. <b>Giả lập P-138</b>: bộ phận nhận thông báo tự đặt.'],
      write: (v) => pick(v, ['tdDot', 'tdNgayDuKien', 'tdKenh', 'tdDiaDiem', 'tdNoiDung']) },
  };
  window.EForms.MS23 = (tok) => F[tok.task] || null;

  const REQ = { 3: [['tdTb', 'Thông báo giao hàng của nhà thầu']] };
  function vars() {
    const h = hd(), u = Flow.ui, k = window.HopDong.kit(), m = giao().find((x) => x.name === u.tdDot) || giao()[0] || {};
    return Object.assign({}, u, { tdDot: u.tdDot || m.name, tdNgayDuKien: u.tdNgayDuKien || m.plan, tdDiaDiem: u.tdDiaDiem || m.site, tdKenh: u.tdKenh || 'Email', hd: { code: h.code, ten: h.title, ncc: k.nccName(h.ncc) } });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] })); }
  const files = () => {
    const v = Flow.state.vars, u = Flow.ui, no = hd().code.replace('Đ', 'D'), rows = [{ name: `Hop-dong-da-ky-${no}.pdf`, at: v.signed }];
    (v.notices || []).filter((n) => n.file).forEach((n, i) => rows.push({ name: `Thong-bao-giao-hang-${i + 1}-${no}.pdf`, at: n.at }));
    if (u.tdTb) rows.push({ name: `Thong-bao-giao-hang-${(v.notices || []).length + 1}-${no}.pdf`, at: Flow.dateOf(Flow.state.clock) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  window.EForms.hdBy.MS23 = { vars, reqDocs, files, outs: () => [], doc: () => null, version: () => 1, docs: [], check: () => null };
})();
