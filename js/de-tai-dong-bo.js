/* T36 B1 (D-96) — Đồng bộ đề tài / dự án (plan docs/dtms/T36-srs-dong-bo-dadt-ke-hoach.md v0.2, B0 K1…K7; SRS docs/SRS/11-srs-dong-bo-dadt).
   Nút [Đồng bộ đề tài / dự án ▾] ở SCR-103: menu xổ Đồng bộ từ KHCN / Đồng bộ từ HR Tool / Xem lịch sử đồng bộ; hộp thoại Phạm vi;
   SCR-109 Lịch sử đồng bộ đề tài / dự án #/de-tai/dong-bo (khối trạng thái theo nguồn, bảng lần đồng bộ, hộp thoại chi tiết, Bỏ qua lỗi).
   11/11/2026: bỏ tab Lần nhập — người dùng bỏ hẳn chức năng Nhập đề tài / dự án theo mẫu (SRS-DADT DTMS_CN_0251).
   GIẢ LẬP: lần chạy kết thúc sau ~2 giây với kết quả mẫu, không đổi dữ liệu đề tài. Thật: job nền gọi API của nguồn (GT-01…03 KHCN, GT-H01…H03 HR Tool),
   bảng project_sync_run / project_sync_issue có cột source. Lịch sử giữ trong bộ nhớ trang (tải lại trang về dữ liệu mẫu). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, vSelect, vRadio, vModal, badge, pager, norm, toast } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => window.Screens.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;

  /* ---------- Nguồn, trạng thái ---------- */
  const SRC = {
    KHCN: { label: 'KHCN', full: 'phân hệ Quản lý Khoa học công nghệ', menu: 'Đồng bộ từ KHCN', cron: 'Hằng ngày lúc 01:00', full7: 'Hằng tuần, Chủ nhật lúc 02:00' },
    HRTOOL: { label: 'HR Tool', full: 'HR Tool', menu: 'Đồng bộ từ HR Tool', cron: 'Hằng ngày lúc 01:30', full7: 'Hằng tuần, Chủ nhật lúc 02:30' },
  };
  const RUN_ST = { 'Đang chạy': 'info', 'Thành công': 'success', 'Có lỗi': 'warning', 'Thất bại': 'error' };
  const RES_ST = { 'Lỗi': 'error', 'Cảnh báo': 'warning', 'Bỏ qua': 'default', 'Thêm mới': 'success', 'Cập nhật': 'info' };
  const SCOPE = { since: 'Thay đổi từ mốc', all: 'Toàn bộ', one: 'Một đề tài' };
  const runBadge = (s) => badge(s, RUN_ST[s] || 'default');
  /* GIẢ LẬP tham số "HR Tool đã có GT-H01" = Không (P-228). */
  const HR_GT_H01 = false;

  /* Quyền (K2, Q4): Quản trị hệ thống, TTMS; tài khoản demo toàn quyền. */
  const me = () => persona(Flow.state.persona) || {};
  const canSync = () => { const p = me(); return p.all || p.urd === 'R-TTMS' || p.urd === 'R-QTHT'; };

  /* ---------- Dữ liệu mẫu (GIẢ LẬP) ---------- */
  const I = (code, name, res, part, msg, closed) => ({ code, name, res, part: part || 'Thông tin chung', msg: msg || '', closed: closed || false });
  const SY = {
    seq: 40, menu: false, tab: 'run', kw: '', adv: false, f: { src: null, st: null, trig: null }, d: { src: null, st: null, trig: null }, page: 1, size: 10, psOpen: false,
    runs: [
      { code: 'DB-2026-00040', src: 'KHCN', trig: 'Theo lịch', scope: 'since', by: 'Hệ thống', start: '09/11/2026 01:00:00', end: '09/11/2026 01:03:12', st: 'Thành công', since: '08/11/2026 01:00',
        n: { fetch: 3, add: 0, upd: 2, same: 1, skip: 0, err: 0 },
        items: [I('NV-KHCN-2026-014', 'Phát triển trạm gNodeB thế hệ 2', 'Cập nhật', 'Khoản mục KM-06', 'Giá trị trước thuế 1,20 → 1,35 tỷ đồng.'), I('NV-KHCN-2025-031', 'Hệ thống mạng lõi 5G SA', 'Cập nhật', 'Văn bản 2210/QĐ-TĐ', 'Thêm tệp văn bản.')] },
      { code: 'DB-2026-00039', src: 'HRTOOL', trig: 'Theo lịch', scope: 'since', by: 'Hệ thống', start: '09/11/2026 01:30:00', end: '09/11/2026 01:30:41', st: 'Thành công', since: '08/11/2026 01:30',
        n: { fetch: 3, add: 0, upd: 1, same: 1, skip: 1, err: 0 },
        items: [I('DA-2026-002', 'Sản xuất module RRU 5G giai đoạn 2026–2028', 'Cập nhật', 'Thông tin chung', 'Tổng dự toán, Thời gian kết thúc.'),
          I('NV-KHCN-2026-006', 'Anten mảng pha băng Ka', 'Bỏ qua', 'Thông tin chung', 'Nhiệm vụ Khoa học công nghệ lấy từ phân hệ Quản lý Khoa học công nghệ, bỏ qua.')] },
      { code: 'DB-2026-00038', src: 'KHCN', trig: 'Theo lịch', scope: 'all', by: 'Hệ thống', start: '08/11/2026 02:00:00', end: '08/11/2026 02:11:05', st: 'Có lỗi', since: '',
        n: { fetch: 7, add: 0, upd: 1, same: 5, skip: 0, err: 1 },
        items: [I('009-26-VHT-RDP-DS', 'Nghiên cứu, phát triển mạng 5G dành cho đường sắt tốc độ cao', 'Lỗi', 'Khoản mục KM-03', 'Khoản mục KM-03: Giá trị trước thuế không được âm.'),
          I('004-26-VHT-RDP-DS', 'Nghiên cứu xây dựng hệ thống quản lý không phận tầm thấp và thử nghiệm giải pháp phục vụ kinh tế tầm thấp', 'Cập nhật', 'Thông tin chung', 'Chủ nhiệm.')] },
      { code: 'DB-2026-00037', src: 'HRTOOL', trig: 'Thủ công', scope: 'all', by: 'Phạm Thị Lan', start: '07/11/2026 15:12:40', end: '07/11/2026 15:28:02', st: 'Thất bại', since: '', retry: 3,
        err0: 'Không lấy được dữ liệu từ HR Tool sau 3 lần thử lại.', n: { fetch: 0, add: 0, upd: 0, same: 0, skip: 0, err: 0 }, items: [] },
    ],
  };
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = () => { const t = new Date(); return `${pad(t.getDate())}/${pad(t.getMonth() + 1)}/${t.getFullYear()} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`; };
  const running = (src) => SY.runs.some((r) => r.src === src && r.st === 'Đang chạy');
  const lastOf = (src) => SY.runs.find((r) => r.src === src && r.st !== 'Đang chạy');
  /* Mốc (BR-DADT-04-01): bắt đầu của lần gần nhất Thay đổi từ mốc / Toàn bộ, kết thúc Thành công hoặc Có lỗi. */
  const markOf = (src) => { const r = SY.runs.find((x) => x.src === src && x.scope !== 'one' && (x.st === 'Thành công' || x.st === 'Có lỗi')); return r ? r.start.slice(0, 16) : null; };
  const openErrs = (src) => new Set(SY.runs.filter((r) => r.src === src).flatMap((r) => r.items.filter((i) => i.res === 'Lỗi' && !i.closed).map((i) => i.code))).size;

  /* Kết quả mẫu khi chạy (GIẢ LẬP). Một đề tài: tra bản ghi theo nguồn dữ liệu của đề tài trên ĐTMS. */
  function simulate(run) {
    const nv = run.scope === 'one' ? D.nvOf(run.one) : null, k = run.src === 'KHCN';
    const n = { fetch: 0, add: 0, upd: 0, same: 0, skip: 0, err: 0 };
    let items = [];
    if (run.scope === 'one') {
      n.fetch = 1;
      if (!nv) { n.err = 1; items = [I(run.one, '', 'Lỗi', 'Thông tin chung', k ? `Không tìm thấy đề tài / dự án ${run.one} ở phân hệ Quản lý Khoa học công nghệ.` : `Không tìm thấy nhiệm vụ ${run.one} ở HR Tool.`)]; }
      else if (k && nv.nguon === 'khcn') n.same = 1;
      else if (!k && nv.nguon === 'hrtool') n.same = 1;
      else if (!k && nv.loai === 'KHCN') { n.skip = 1; items = [I(nv.code, nv.name, 'Bỏ qua', 'Thông tin chung', 'Nhiệm vụ Khoa học công nghệ lấy từ phân hệ Quản lý Khoa học công nghệ, bỏ qua.')]; }
      else { n.err = 1; items = [I(nv.code, nv.name, 'Lỗi', 'Thông tin chung', k ? `Mã dự án / đề tài đã có trên ĐTMS với Loại ${nv.loai}.` : 'Mã dự án / đề tài đã có trên ĐTMS, đồng bộ từ phân hệ KHCN.')]; }
    } else {
      const mine = D.nhiemVu.filter((x) => x.nguon === (k ? 'khcn' : 'hrtool'));
      n.fetch = run.scope === 'all' ? mine.length + (k ? 0 : 1) : Math.min(2, mine.length);
      n.same = n.fetch - (k ? 0 : 1);
      if (!k) { n.skip = 1; items = [I('NV-KHCN-2026-006', 'Anten mảng pha băng Ka', 'Bỏ qua', 'Thông tin chung', 'Nhiệm vụ Khoa học công nghệ lấy từ phân hệ Quản lý Khoa học công nghệ, bỏ qua.')]; }
    }
    Object.assign(run, { n, items, end: stamp(), st: n.err ? 'Có lỗi' : 'Thành công' });
  }
  function start(src, scope0, one) {
    /* HR Tool chưa có GT-H01 (tham số mục 2.3.6 SRS-DBDA): lần ghi phạm vi Toàn bộ. */
    const scope = src === 'HRTOOL' && !HR_GT_H01 && scope0 === 'since' ? 'all' : scope0;
    const run = { code: `DB-2026-${String(++SY.seq).padStart(5, '0')}`, src, trig: 'Thủ công', scope, one, by: me().name, start: stamp(), end: '', st: 'Đang chạy',
      since: scope === 'since' ? markOf(src) || '' : '', n: { fetch: 0, add: 0, upd: 0, same: 0, skip: 0, err: 0 }, items: [] };
    SY.runs.unshift(run);
    toast(`<b>Thành công</b><br>Đã bắt đầu lần đồng bộ ${run.code}.`);
    rerender();
    setTimeout(() => {
      simulate(run);
      const n = run.n;
      toast(`<b>Đồng bộ đề tài / dự án ${run.st === 'Thành công' ? 'thành công' : 'có lỗi'}</b><br>Lần ${run.code} (${SRC[src].label}): ${n.add} thêm mới, ${n.upd} cập nhật, ${n.err} lỗi.
        <a class="link" data-go="de-tai/dong-bo" data-sy-run="${run.code}">Xem chi tiết</a>`, run.st === 'Thành công' ? '' : 'warn');
      if (/^#\/de-tai/.test(location.hash)) rerender();
    }, 2000);
  }

  /* ---------- Nút + menu xổ (khuôn nút Thao tác khác của my-task-detail) ---------- */
  function button(o) {
    if (!canSync()) return '';
    const item = (src) => `<button type="button" class="vbtn ghost" data-sy-src="${src}" ${running(src) ? 'disabled title="Đang có lần đồng bộ chạy"' : ''}>${SRC[src].menu}</button>`;
    return `<div class="more dt-sync"><button type="button" class="vbtn secondary" data-sy-menu aria-expanded="${SY.menu}">Đồng bộ đề tài / dự án ${icon('chev')}</button>
      ${SY.menu ? `<div class="more-pop" data-sy-pop>${item('KHCN')}${item('HRTOOL')}${o && o.noHistory ? '' : '<button type="button" class="vbtn ghost" data-sy-hist>Xem lịch sử đồng bộ</button>'}</div>` : ''}</div>`;
  }
  /* Hộp thoại Đồng bộ (Q5): Phạm vi Thay đổi từ mốc / Toàn bộ / Một đề tài + Mã. */
  function dialog(src) {
    let scope = 'since';
    const mark = markOf(src);
    const body = () => `<div class="vfield"><div class="lr"><label>Phạm vi</label></div><div class="vradio" data-sy-scope>
        ${Object.entries(SCOPE).map(([k, l]) => vRadio(l, scope === k, `data-sy-sc="${k}"`)).join('')}</div>
        <p class="cap">${scope === 'since' && src === 'HRTOOL' && !HR_GT_H01 ? 'HR Tool chưa hỗ trợ lấy thay đổi, lần này lấy toàn bộ.' : scope === 'since' ? (mark ? `Lấy các đề tài / dự án thay đổi từ ${esc(mark)}.` : 'Chưa có mốc, lần này lấy toàn bộ.') : scope === 'all' ? `Lấy mọi đề tài / dự án của ${SRC[src].full}.` : ''}</p></div>
      <div class="vfield" id="sy-one" ${scope === 'one' ? '' : 'hidden'}><div class="lr"><label>Mã dự án / đề tài</label><span class="req">*</span></div>
        <input class="vctl" id="sy-code" maxlength="50" placeholder="Nhập mã dự án / đề tài"><p class="msg" hidden>Vui lòng nhập Mã dự án / đề tài.</p></div>`;
    const m = vModal({ title: `${SRC[src].menu === 'Đồng bộ từ KHCN' ? 'Đồng bộ đề tài / dự án từ KHCN' : 'Đồng bộ đề tài / dự án từ HR Tool'}`, size: 'sm',
      body: `<div data-sy-dlg>${body()}</div>`, actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" id="sy-ok">Đồng bộ</button>' });
    const box = m.el.querySelector('[data-sy-dlg]');
    box.addEventListener('click', (e) => { const r = e.target.closest('[data-sy-sc]'); if (!r) return; scope = r.dataset.sySc; box.innerHTML = body(); if (scope === 'one') box.querySelector('#sy-code').focus(); });
    m.el.querySelector('#sy-ok').onclick = () => {
      let one = null;
      if (scope === 'one') {
        const c = box.querySelector('#sy-code'), f = box.querySelector('#sy-one');
        one = c.value.trim();
        if (!one) { f.classList.add('invalid'); f.querySelector('.msg').hidden = false; return; }
      }
      if (running(src)) { toast('Đang có lần đồng bộ chạy. Vui lòng chờ lần này kết thúc.', 'error'); m.close(); return; }
      m.close(); start(src, scope, one);
    };
  }

  /* ---------- SCR-109 Lịch sử đồng bộ đề tài / dự án ---------- */
  const scopeText = (r) => (r.scope === 'one' ? `Một đề tài: ${r.one}` : SCOPE[r.scope]);
  const rowsF = () => SY.runs.filter((r) => (!SY.adv ? !SY.kw || norm(r.code).includes(norm(SY.kw))
    : (!SY.f.src || r.src === SY.f.src) && (!SY.f.st || r.st === SY.f.st) && (!SY.f.trig || r.trig === SY.f.trig)));
  const nb = (v) => `<td class="r num">${v}</td>`;
  const tbl = (attr, cols, body, n) => `<div class="vtable-vp"><table class="vtable" ${attr}><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${body || `<tr><td class="vtable-empty" colspan="${n + 1}"><img src="assets/empty-table.svg" alt="">Không có dữ liệu</td></tr>`}</tbody></table></div>`;
  function statusCard() {
    const body = Object.keys(SRC).map((s, i) => { const l = lastOf(s), e = openErrs(s), mk = markOf(s);
      return `<tr><td class="ord">${i + 1}</td><td>${esc(SRC[s].label)}</td><td>${esc(SRC[s].cron)}</td><td>${esc(SRC[s].full7)}</td>
        <td>${l ? `<a class="link" data-sy-run="${l.code}">${esc(l.code)}</a>` : dash}</td><td class="c">${running(s) ? runBadge('Đang chạy') : l ? runBadge(l.st) : dash}</td>
        <td class="num">${mk ? esc(mk) : 'Lần tới lấy toàn bộ'}</td><td class="r num">${e ? `<a class="link" data-sy-errsrc="${s}">${e}</a>` : 0}</td></tr>`; }).join('');
    return `<section class="vcard" data-sy-status><h3>Trạng thái đồng bộ</h3>${tbl('', [['Nguồn', 90], ['Lịch đồng bộ', 160], ['Lịch rà soát toàn bộ', 230], ['Lần gần nhất', 150], ['Trạng thái', 130, 'c'], ['Mốc lấy thay đổi', 150], ['Đề tài còn lỗi', 110, 'r']], body, 7)}</section>`;
  }
  function advPanel() {
    const d = SY.d;
    const sel = (k, label, ph, options) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect({ id: 'syf-' + k, value: d[k], clear: true, searchable: false, placeholder: ph,
      options, onChange: (v) => { d[k] = v; rerender(); } })}</div>`;
    return `<form class="adv" data-sy-adv><div class="grid3">
        ${sel('src', 'Nguồn', 'Tất cả nguồn', Object.keys(SRC).map((s) => ({ value: s, label: SRC[s].label })))}
        ${sel('st', 'Trạng thái', 'Tất cả trạng thái', Object.keys(RUN_ST).map((s) => ({ value: s, label: s })))}
        ${sel('trig', 'Cách chạy', 'Tất cả', ['Theo lịch', 'Thủ công'].map((s) => ({ value: s, label: s })))}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-sy="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function runsTab() {
    const rs = rowsF(), pages = Math.max(1, Math.ceil(rs.length / SY.size));
    if (SY.page > pages) SY.page = pages;
    const from = (SY.page - 1) * SY.size;
    const cols = [['Trạng thái', 130, 'c'], ['Mã lần', 150], ['Nguồn', 100], ['Cách chạy', 110], ['Phạm vi', 200], ['Người chạy', 160], ['Bắt đầu', 170], ['Kết thúc', 170],
      ['Lấy về', 80, 'r'], ['Thêm mới', 90, 'r'], ['Cập nhật', 90, 'r'], ['Không đổi', 100, 'r'], ['Bỏ qua', 80, 'r'], ['Lỗi', 70, 'r']];
    const body = rs.slice(from, from + SY.size).map((r, i) => `<tr><td class="ord">${from + i + 1}</td><td class="c">${runBadge(r.st)}</td>
        <td><a class="link" data-sy-run="${r.code}">${esc(r.code)}</a></td><td>${esc(SRC[r.src].label)}</td><td>${esc(r.trig)}</td><td>${clamp(scopeText(r))}</td><td>${clamp(r.by)}</td>
        <td class="num">${esc(r.start)}</td><td class="num">${r.end ? esc(r.end) : dash}</td>${nb(r.n.fetch)}${nb(r.n.add)}${nb(r.n.upd)}${nb(r.n.same)}${nb(r.n.skip)}${nb(r.n.err)}</tr>`).join('');
    return `<div class="vcard">
      <div class="pg-head"><span></span><div class="r">
        ${SY.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="sy-kw" maxlength="20" placeholder="Tìm kiếm theo mã lần" value="${esc(SY.kw)}"></label>`}
        <button type="button" class="vbtn ${SY.adv ? 'active' : 'secondary'}" data-sy="adv">${SY.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
      ${SY.adv ? advPanel() : ''}
      ${tbl('data-sy-list', cols, body, cols.length)}
      ${pager({ id: 'sy', total: rs.length, page: SY.page, size: SY.size, open: SY.psOpen })}</div>`;
  }
  function page() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (vht-table, ô tìm kiếm phải, panel nâng cao như SCR-27)
    //       + app-tabs (@khcn-core/ui); hộp thoại chi tiết vht-modal; nút menu xổ theo "Thao tác khác" của my-tasks/my-task-detail
    const info = {
      scr: 'SCR-109', name: 'Lịch sử đồng bộ đề tài / dự án', uc: 'SRS-DBDA DTMS_CN_0254 · plan T36 (D-96, B0 K1, K2, K4) · SRS-DADT BR-DADT-04-01…04, 04-10',
      notes: [
        '<b>Không có mục menu trái</b> (D-96): mở từ mục <b>Xem lịch sử đồng bộ</b> của nút Đồng bộ đề tài / dự án ở Danh sách đề tài / dự án và từ link <b>Xem chi tiết</b> trong thông báo kết quả. Thay màn Quản trị > Đồng bộ đề tài / dự án của SRS-DADT V1.1 (chưa từng có màn).',
        'Khối <b>Trạng thái đồng bộ</b>: mỗi nguồn một dòng — lịch đồng bộ, lịch rà soát toàn bộ (tham số, mặc định HR Tool lệch KHCN 30 phút, Q10), lần gần nhất, mốc lấy thay đổi (BR-DADT-04-01), số đề tài còn lỗi chưa đóng (bấm lọc chi tiết).',
        'Bảng <b>lần đồng bộ</b> (không còn tab Lần nhập — bỏ nhập theo mẫu 11/11/2026): cột Nguồn, lọc Nguồn / Trạng thái / Cách chạy. Lấy về = Thêm mới + Cập nhật + Không đổi + Bỏ qua + Lỗi; <b>Bỏ qua</b> = nhiệm vụ Loại KHCN ở HR Tool (Q2, <code>DTMS_Q_0438</code>), ghi Cảnh báo, không tính lỗi. Tab <b>Lần nhập</b> chuyển từ màn Quản trị (K4); nhập theo mẫu (DTMS_CN_0251) chưa dựng.',
        '<b>Bỏ qua lỗi</b>: Quản trị hệ thống và TTMS (K2), bắt buộc Lý do. GIẢ LẬP: dữ liệu lần mẫu; lần chạy thủ công kết thúc sau ~2 giây với kết quả mẫu, không đổi dữ liệu đề tài; lịch sử giữ trong bộ nhớ trang. <b>Cần dev riêng</b>: job đồng bộ theo nguồn, bảng <code>project_sync_run</code> / <code>project_sync_issue</code> thêm cột nguồn.',
      ],
      q: ['P-227', 'P-228'], src: 'task-management/task-management.component · /task-management · app-tabs · vht-modal',
    };
    if (!canSync()) return `<div class="pg">${head({ title: 'Lịch sử đồng bộ đề tài / dự án', back: 'de-tai', info })}<section class="vcard pad24"><div class="empty-t">Bạn không có quyền thực hiện chức năng này.</div></section></div>`;
    return `<div class="pg">
      ${head({ title: 'Lịch sử đồng bộ đề tài / dự án', back: 'de-tai', info, right: button({ noHistory: true }) })}
      ${statusCard()}
      ${runsTab()}</div>`;
  }
  /* Hộp thoại Chi tiết lần đồng bộ. Lọc Kết quả mặc định Lỗi, Cảnh báo khi có. */
  function detailDlg(r, kind, onlyErr) {
    const isRun = kind === 'run';
    const RES_ORDER = ['Lỗi', 'Cảnh báo', 'Bỏ qua', 'Thêm mới', 'Cập nhật'];
    let filt = onlyErr ? ['Lỗi'] : null;
    const items = () => r.items.filter((i) => !filt || filt.includes(i.res)).sort((a, b) => RES_ORDER.indexOf(a.res) - RES_ORDER.indexOf(b.res) || a.code.localeCompare(b.code));
    const codeCell = (i) => (D.nvOf(i.code) ? `<a class="link" data-go="de-tai/${encodeURIComponent(i.code)}" data-close>${esc(i.code)}</a>` : esc(i.code));
    const act = (i) => (isRun && i.res === 'Lỗi' && !i.closed && canSync() ? `<div class="acts"><button type="button" class="vbtn icon ghost" aria-label="Bỏ qua lỗi" title="Bỏ qua lỗi" data-sy-skip="${esc(i.code)}">${icon('x')}</button></div>` : '');
    const grid = () => tbl('data-sy-items', [['Mã dự án / đề tài', 170], ['Tên', 260], ['Kết quả', 110, 'c'], ['Phần', 150], ['Nội dung', 320], ['Đã đóng', 90, 'c'], ['Thao tác', 90, 'c']],
      items().map((i, n) => `<tr><td class="ord">${n + 1}</td><td>${codeCell(i)}</td><td>${clamp(i.name)}</td><td class="c">${badge(i.res, RES_ST[i.res] || 'default')}</td><td>${esc(i.part)}</td>
        <td>${clamp(i.msg)}</td><td class="c">${i.res === 'Lỗi' ? (i.closed ? 'Có' : 'Không') : dash}</td><td class="c">${act(i)}</td></tr>`).join(''), 7);
    const head0 = `${kv('Nguồn', esc(SRC[r.src].label))}${kv('Cách chạy', esc(r.trig))}${kv('Phạm vi', esc(scopeText(r)))}${kv('Người chạy', esc(r.by))}${kv('Bắt đầu', esc(r.start))}${kv('Kết thúc', r.end ? esc(r.end) : null)}
        ${kv('Trạng thái', runBadge(r.st))}${kv('Mốc đã dùng', r.scope === 'since' ? esc(r.since || 'Toàn bộ') : null)}${kv('Số lần thử lại', String(r.retry || 0))}
        ${kv('Lấy về / Thêm mới / Cập nhật / Không đổi / Bỏ qua / Lỗi', [r.n.fetch, r.n.add, r.n.upd, r.n.same, r.n.skip, r.n.err].join(' / '), 'span2')}${r.err0 ? kv('Lỗi chung', esc(r.err0), 'span3') : ''}`
    const filtSel = () => `<div class="vfield"><div class="lr"><label>Kết quả</label></div><div class="vradio h" data-sy-filt>
        ${[['all', 'Tất cả'], ['err', 'Lỗi'], ['warn', 'Lỗi, Cảnh báo']].map(([k, l]) => vRadio(l, (k === 'all' && !filt) || (k === 'err' && filt && filt.length === 1) || (k === 'warn' && filt && filt.length === 2), `data-sy-f="${k}"`)).join('')}</div></div>`;
    const m = vModal({ title: `Chi tiết lần đồng bộ ${r.code}`, size: 'xl',
      body: `<div class="ginfo c3">${head0}</div><div data-sy-dbody>${filtSel()}${grid()}</div>`, actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
    const box = m.el.querySelector('[data-sy-dbody]');
    const redraw = () => { box.innerHTML = filtSel() + grid(); };
    box.addEventListener('click', (e) => {
      const f = e.target.closest('[data-sy-f]');
      if (f) { filt = { all: null, err: ['Lỗi'], warn: ['Lỗi', 'Cảnh báo'] }[f.dataset.syF]; redraw(); return; }
      const s = e.target.closest('[data-sy-skip]');
      if (s) skipDlg(r.items.find((i) => i.code === s.dataset.sySkip && i.res === 'Lỗi'), r.src, redraw);
    });
    if (window.UI.vMaximize) window.UI.vMaximize(m, 'dtms-sy-max');
  }
  function skipDlg(item, src, after) {
    const m = vModal({ title: 'Bỏ qua lỗi', body: `<div class="vfield" id="sy-rf"><div class="lr"><label>Lý do</label><span class="req">*</span></div>
        <textarea class="vctl ta" id="sy-rsn" rows="4" maxlength="500" placeholder="Nhập lý do"></textarea><p class="msg" hidden>Vui lòng nhập Lý do.</p></div>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" id="sy-skip-ok">Đồng ý</button>' });
    const ta = m.el.querySelector('#sy-rsn');
    ta.focus();
    m.el.querySelector('#sy-skip-ok').onclick = () => {
      if (!ta.value.trim()) { m.el.querySelector('#sy-rf').classList.add('invalid'); m.el.querySelector('#sy-rf .msg').hidden = false; return; }
      SY.runs.filter((r) => r.src === src).forEach((r) => r.items.forEach((i) => { if (i.code === item.code && i.res === 'Lỗi') Object.assign(i, { closed: true, note: ta.value.trim() }); }));
      m.close(); toast('<b>Thành công</b><br>Cập nhật lỗi đồng bộ thành công.'); after(); rerender();
    };
  }
  /* Bấm số "Đề tài còn lỗi": mở lần gần nhất có lỗi chưa đóng của nguồn, lọc Lỗi. */
  function openErrsOf(src) {
    const r = SY.runs.find((x) => x.src === src && x.items.some((i) => i.res === 'Lỗi' && !i.closed));
    if (r) detailDlg(r, 'run', true);
  }

  /* ---------- Sự kiện ---------- */
  const onPage = () => /^#\/de-tai\/dong-bo\/?$/.test(location.hash);
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-sy-menu]')) { SY.menu = !SY.menu; rerender(); return; }
    const s = t.closest('[data-sy-src]');
    if (s) { SY.menu = false; rerender(); if (!running(s.dataset.sySrc)) dialog(s.dataset.sySrc); return; }
    if (t.closest('[data-sy-hist]')) { SY.menu = false; location.hash = '#/de-tai/dong-bo'; return; }
    if (SY.menu && !t.closest('[data-sy-pop]')) { SY.menu = false; rerender(); }
    const run = t.closest('[data-sy-run]');
    if (run) { const r = SY.runs.find((x) => x.code === run.dataset.syRun); if (r) setTimeout(() => detailDlg(r, 'run', false), run.closest('.toast') ? 50 : 0); return; }
    const es = t.closest('[data-sy-errsrc]');
    if (es) { openErrsOf(es.dataset.syErrsrc); return; }
    if (!onPage()) return;
    const pg = t.closest('[data-pager="sy"]');
    if (pg) {
      const b = t.closest('[data-pg]'), z = t.closest('[data-ps]');
      if (b) SY.page = Number(b.dataset.pg);
      else if (z) { SY.size = Number(z.dataset.ps); SY.page = 1; SY.psOpen = false; } else if (t.closest('[data-ps-open]')) SY.psOpen = !SY.psOpen;
      else return;
      rerender(); return;
    }
    const a = t.closest('[data-sy]');
    if (!a) return;
    if (a.dataset.sy === 'adv') { SY.adv = !SY.adv; SY.d = Object.assign({}, SY.f); SY.page = 1; }
    if (a.dataset.sy === 'reset') { SY.d = { src: null, st: null, trig: null }; SY.f = { src: null, st: null, trig: null }; SY.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-sy-adv]')) { e.preventDefault(); SY.f = Object.assign({}, SY.d); SY.page = 1; rerender(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'sy-kw') return;
    SY.kw = e.target.value.trim(); SY.page = 1; rerender();
  });

  window.DtSync = { button, page, SRC, state: SY };
})();
