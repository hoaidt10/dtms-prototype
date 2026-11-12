/* T56 Q2 (review Phong BA 12/11 #30): Tài liệu chủ trương KĐT (#/tai-lieu-ct-kdt) và Tài liệu phê duyệt KĐT (#/tai-lieu-pd-kdt).
   Khuôn SCR-107 Quản lý tài liệu ĐXMS (profile-list: tìm nhanh + Tìm kiếm nâng cao + bảng + phân trang).
   Nguồn: văn bản đầu ra của hồ sơ KĐT (Flow.kdtCases() → c.docs), lọc theo loại hồ sơ (chủ trương / phê duyệt KĐT, D-103).
   Trạng thái: hồ sơ Hoàn thành → Đã ký; còn đang xử lý → Dự thảo; văn bản không có bước ký → Hoàn thành (cùng luật SCR-107, T56 Q8).
   GIẢ LẬP: chưa lọc phạm vi xem KĐT — như Danh sách khoản đầu tư của prototype. Thật: API tìm kiếm văn bản chung như SRS 29 mục 5. */
(function () {
  const Flow = window.Flow;
  const { esc, icon, vSelect, badge, norm, pager, toast } = window.UI;
  const S = () => window.Screens;
  const rerender = () => window.App.render();
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp" title="${esc(v)}">${esc(v)}</span>` : dash);
  /* Biểu mẫu của quy trình KĐT (MS13 / MS14) theo loại hồ sơ. */
  const FORMS = {
    CT: [['BM-00', 'Hồ sơ chủ trương và KĐT (văn bản gộp)'], ['BM-01', 'Tờ trình phê duyệt chủ trương KĐT']],
    KDT: [['BM-03', 'Tờ trình phê duyệt KĐT'], ['BM-14', 'Báo cáo kết quả thẩm định KĐT'], ['BM-18', 'Quyết định phê duyệt KĐT']],
  };
  const SIGNED = ['BM-00', 'BM-01', 'BM-03', 'BM-14', 'BM-18'];
  const ST = { 'Dự thảo': 'info', 'Đã ký': 'success', 'Hoàn thành': 'success' };
  const TITLE = { CT: 'Tài liệu chủ trương KĐT', KDT: 'Tài liệu phê duyệt KĐT' };
  const emptyF = () => ({ kdt: null, code: null, st: [], date: '' });
  const LS = { CT: null, KDT: null };
  const st0 = (k) => (LS[k] = LS[k] || { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false });
  let K = 'CT';
  const dk = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s || '')); return m ? `${m[3]}${m[2].padStart(2, '0')}${m[1].padStart(2, '0')}` : ''; };
  const rangeOf = (s) => { const m = String(s || '').match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || []; return [m[0] || '', m[1] || '']; };
  const kindOf = (c) => (c && c.kind === 'KDT' ? 'KDT' : 'CT');
  const nameOf = (code) => { const f = FORMS.CT.concat(FORMS.KDT).find(([v]) => v === code); return f ? f[1] : ''; };

  function all() {
    return Flow.kdtCases().filter((c) => kindOf(c) === K).flatMap((c) => {
      const x = Flow.findKdt(c.kdt) || {};
      return (c.docs || []).map(([code, at], n) => ({
        code, name: nameOf(code), at: String(at || c.updated || '').slice(0, 10), n, hs: c.code, kdt: c.kdt, title: x.title || c.title || '',
        st: !SIGNED.includes(code) ? 'Hoàn thành' : c.st === 'done' ? 'Đã ký' : 'Dự thảo',
      }));
    });
  }
  function rows() {
    const L = st0(K), f = L.f, [fr, to] = rangeOf(f.date);
    return all().filter((r) => (!L.adv ? !L.kw || norm(`${r.code} ${r.name} ${r.kdt} ${r.title} ${r.hs}`).includes(norm(L.kw))
      : (!f.kdt || r.kdt === f.kdt) && (!f.code || r.code === f.code) && (!f.st.length || f.st.includes(r.st)) && (!fr || dk(r.at) >= dk(fr)) && (!to || dk(r.at) <= dk(to))))
      .sort((a, b) => dk(b.at).localeCompare(dk(a.at)) || a.kdt.localeCompare(b.kdt) || a.n - b.n);
  }
  function advPanel() {
    const L = st0(K), d = L.d, src = all();
    const sel = (k, label, ph, opts, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'ktl-' + k, value: d[k], clear: true, searchable: true, placeholder: ph, options: opts, onChange: (v) => { d[k] = v; rerender(); } }, o || {}))}</div>`;
    const kd = [...new Map(src.map((r) => [r.kdt, r.title])).entries()];
    return `<form class="adv" data-ktladv><div class="grid3">
        ${sel('kdt', 'Khoản đầu tư', 'Chọn khoản đầu tư', kd.map(([v, t]) => ({ value: v, label: `${v} — ${t}` })))}
        ${sel('code', 'Loại biểu mẫu', 'Chọn loại biểu mẫu', FORMS[K].map(([v, n]) => ({ value: v, label: `${v} ${n}` })))}
        ${sel('st', 'Trạng thái', 'Tất cả', Object.keys(ST).map((v) => ({ value: v, label: v })), { multi: true, searchable: false })}
        ${window.UI.vDateRange({ label: 'Ngày cập nhật', combined: ['id="ktl-date"', d.date] })}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-ktl="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function page(kind) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html (khuôn SCR-107)
    K = kind === 'KDT' ? 'KDT' : 'CT';
    const L = st0(K), list = rows(), pages = Math.max(1, Math.ceil(list.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 90, 'c'], ['Mã biểu mẫu', 120], ['Tên văn bản', 300], ['Mã hồ sơ', 160], ['Mã KĐT', 160], ['Tên khoản đầu tư', 280], ['Trạng thái', 150, 'c'], ['Ngày cập nhật', 130, 'c']];
    const body = list.slice(from, from + L.size).map((r, i) => `<tr>
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts"><button type="button" class="vbtn icon ghost" aria-label="Tải xuống" title="Tải xuống" data-ktl-dl="${esc(`${r.code}-${r.kdt}.pdf`)}">${icon('download')}</button></div></td>
        <td>${esc(r.code)}</td><td>${clamp(r.name)}</td>
        <td><a class="link" data-go="ho-so-kdt/${encodeURIComponent(r.hs)}">${esc(r.hs)}</a></td><td><a class="link" data-go="kdt/${encodeURIComponent(r.kdt)}">${esc(r.kdt)}</a></td><td>${clamp(r.title)}</td>
        <td class="c">${badge(r.st, ST[r.st])}</td><td class="c">${esc(r.at)}</td></tr>`).join('');
    const empty = all().length ? 'Không tìm thấy dữ liệu phù hợp' : 'Chưa có dữ liệu';
    const info = {
      scr: 'SCR-107', name: TITLE[K], uc: 'Khuôn SRS 29 · DTMS_CN_0153 (áp cho KĐT)',
      notes: [
        `<b>T56 (review Phong BA 12/11 #30, Q2):</b> menu Quản lý khoản đầu tư gồm Khoản đầu tư · Chủ trương KĐT · Tài liệu chủ trương KĐT · Phê duyệt KĐT · Tài liệu phê duyệt KĐT. Màn này theo khuôn <b>Quản lý tài liệu ĐXMS</b> (SCR-107), chỉ văn bản của hồ sơ <b>${K === 'CT' ? 'phê duyệt chủ trương KĐT' : 'phê duyệt KĐT'}</b> (D-103).`,
        'Nguồn: văn bản đầu ra của hồ sơ KĐT. Trạng thái: hồ sơ Hoàn thành → Đã ký; đang xử lý → Dự thảo; văn bản không có bước ký → Hoàn thành. Mã hồ sơ mở Chi tiết hồ sơ, Mã KĐT mở Chi tiết khoản đầu tư.',
        'GIẢ LẬP: chưa lọc phạm vi xem KĐT; tải xuống chỉ báo thành công. Chưa có SRS cho màn này — lệch SRS 23–28 (ghi ở plan T56 §5).',
      ],
      src: 'SRS 29 (khuôn) · profile-management/profile-list · Flow.kdtCases().docs',
    };
    return `<div class="pg" data-ktl>
      ${S().head({ title: TITLE[K], info })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:320px">${icon('search')}<input id="ktl-kw" maxlength="255" placeholder="Tìm kiếm theo biểu mẫu, mã KĐT, tên khoản đầu tư" value="${esc(L.kw)}"></label>`}
          <button type="button" class="vbtn ${L.adv ? 'active' : 'secondary'}" data-ktl="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${empty}</td></tr>`}</tbody></table></div>
        ${pager({ id: 'ktl', total: list.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-ktladv]')) return;
    e.preventDefault();
    const L = st0(K); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  let kwTimer = null;
  document.addEventListener('input', (e) => {
    const L = st0(K);
    if (e.target.id === 'ktl-date') { L.d.date = e.target.value; return; }
    if (e.target.id !== 'ktl-kw') return;
    L.kw = e.target.value;
    clearTimeout(kwTimer);
    kwTimer = setTimeout(() => {
      L.page = 1; rerender();
      const el = document.getElementById('ktl-kw'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }, 500);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-ktl]')) return;
    const L = st0(K), t = e.target;
    const dl = t.closest('[data-ktl-dl]'); if (dl) { toast(`Đã tải ${esc(dl.dataset.ktlDl)}`); return; }
    const b = t.closest('[data-ktl]');
    if (b && b.dataset.ktl === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; rerender(); return; }
    if (b && b.dataset.ktl === 'reset') { L.d = emptyF(); L.f = emptyF(); L.page = 1; rerender(); return; }
    const pg = t.closest('[data-pager="ktl"]');
    if (pg) {
      const p = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (p && !p.disabled) { L.page = Number(p.dataset.pg); rerender(); return; }
      if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; rerender(); return; }
      if (t.closest('[data-ps-open]')) { L.psOpen = !L.psOpen; rerender(); }
    }
  });

  window.KdtTaiLieu = { page };
})();
