/* T29 B12 — SCR-107 Quản lý hồ sơ (RV-PROTO-0511 bản 2 #19, D-78): menu dưới Luồng mua sắm; danh sách biểu mẫu / văn bản đã sinh của mọi luồng
   ("hồ sơ (hay được hiểu là các biểu mẫu)" — người dùng chọn 05/11; ❓ xác nhận lại với BA, P-209). Tìm theo từ khoá, luồng mua sắm, hồ sơ, loại biểu mẫu,
   trạng thái ký; tải về; bấm mã hồ sơ mở Chi tiết hồ sơ (SCR-20).
   Nguồn: Văn bản đầu ra của từng hồ sơ ĐXMS (hồ sơ đang chạy: văn bản đã sinh theo bước đã xong; hồ sơ mẫu: theo bước đã qua — như tab Văn bản đầu ra SCR-20).
   Thật: bảng văn bản đầu ra của hồ sơ (wf_profile_document / biểu mẫu sinh từ eForm) + trạng thái ký VOffice — cần dev API tìm kiếm chung mọi hồ sơ.
   Khuôn: profile-list (tìm kiếm + Tìm kiếm nâng cao + bảng + phân trang). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, vSelect, badge, norm, pager } = window.UI;
  const S = () => window.Screens;
  const rerender = () => window.App.render();
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  /* Văn bản có bước ký trên ĐTMS (lựa chọn có `sign` trong máy luồng MS01: BM-01, BM-03, BM-04 + Checklist, BM-05, BM-06, BM-08, BM-09).
     Văn bản không có bước ký riêng (thuyết minh BM-02, báo cáo của Ban ĐTXD Tập đoàn BM-07) → Không ký trên ĐTMS. GIẢ LẬP P-209. */
  const SIGNED = ['BM-01', 'BM-03', 'BM-04', 'BM-05', 'BM-06', 'BM-08', 'BM-09', 'CL01', 'CL02'];
  const SIGN_ST = { 'Đã ký': 'success', 'Không ký trên ĐTMS': 'default' };
  const signOf = (code) => (SIGNED.includes(code) ? 'Đã ký' : 'Không ký trên ĐTMS');
  const emptyF = () => ({ dxms: null, hs: '', code: null, sign: null });
  const L = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false };

  function all() {
    return S().allCases().flatMap((c) => S().caseDocs(c).map((d) => {
      const x = Flow.findDxms(c.dxms) || {};
      return { code: d.code, name: d.name, at: d.at, hs: c.code, kind: c.kind, dxms: c.dxms, title: x.title || c.dxmsTitle || '', href: S().caseHref(c), sign: signOf(d.code) };
    }));
  }
  const dk = (s) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(s || '')); return m ? `${m[3]}${m[2]}${m[1]}` : ''; };
  function rows() {
    const f = L.f;
    return all().filter((r) => (!L.adv ? !L.kw || norm(`${r.code} ${r.name} ${r.hs} ${r.dxms} ${r.title}`).includes(norm(L.kw))
      : (!f.dxms || r.dxms === f.dxms) && (!f.hs || norm(r.hs).includes(norm(f.hs))) && (!f.code || r.code === f.code) && (!f.sign || r.sign === f.sign)))
      .sort((a, b) => dk(b.at).localeCompare(dk(a.at)) || a.hs.localeCompare(b.hs));
  }
  function advPanel() {
    const d = L.d, src = all();
    const sel = (k, label, ph, opts) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect({ id: 'qh-' + k, value: d[k], clear: true, searchable: true, placeholder: ph, options: opts, onChange: (v) => { d[k] = v; rerender(); } })}</div>`;
    const dx = [...new Map(src.map((r) => [r.dxms, r.title])).entries()];
    const codes = [...new Map(src.map((r) => [r.code, r.name])).entries()];
    return `<form class="adv" data-qhadv><div class="grid3">
        ${sel('dxms', 'Luồng mua sắm', 'Chọn luồng mua sắm', dx.map(([v, t]) => ({ value: v, label: `${v} — ${t}` })))}
        <div class="vfield"><div class="lr"><label>Mã hồ sơ</label></div><input class="vctl" id="qh-hs" maxlength="50" placeholder="Nhập mã hồ sơ" value="${esc(d.hs)}"></div>
        ${sel('code', 'Loại biểu mẫu', 'Chọn loại biểu mẫu', codes.map(([v, n]) => ({ value: v, label: n })))}
        ${sel('sign', 'Trạng thái ký', 'Tất cả', Object.keys(SIGN_ST).map((v) => ({ value: v, label: v })))}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-qh="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function page() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
    const list = rows(), pages = Math.max(1, Math.ceil(list.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 90, 'c'], ['Mã biểu mẫu', 120], ['Tên biểu mẫu / văn bản', 320], ['Mã hồ sơ', 140], ['Loại hồ sơ', 150], ['Mã ĐXMS', 160], ['Tên luồng mua sắm', 280], ['Trạng thái ký', 170, 'c'], ['Ngày tạo', 120]];
    const body = list.slice(from, from + L.size).map((r, i) => `<tr data-qh-row="${esc(r.hs + ':' + r.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts"><button type="button" class="vbtn icon ghost" aria-label="Tải xuống" data-dl="${esc(`${r.code}-${r.hs}.pdf`)}">${icon('download')}</button></div></td>
        <td>${esc(r.code)}</td><td>${clamp(r.name)}</td><td><a class="link" data-go="${esc(r.href)}">${esc(r.hs)}</a></td><td>${esc((D.kinds[r.kind] || D.kinds.PD).label)}</td>
        <td><a class="link" data-go="luong/${encodeURIComponent(r.dxms)}">${esc(r.dxms)}</a></td><td>${clamp(r.title)}</td><td class="c">${badge(r.sign, SIGN_ST[r.sign])}</td><td class="num">${esc(r.at)}</td></tr>`).join('');
    const info = {
      scr: 'SCR-107', name: 'Quản lý hồ sơ', uc: 'UC-12-04 · UR-DX-20',
      notes: [
        '<b>D-78</b> (RV-PROTO-0511 bản 2 #19, người dùng chọn 05/11): menu <b>Quản lý hồ sơ</b> dưới Luồng mua sắm = danh sách <b>biểu mẫu / văn bản đã sinh</b> của mọi luồng (BM-01 / BM-09 Tờ trình, BM-02, Checklist, BM-03, BM-04, BM-05, BM-06, BM-08…). BA viết "hồ sơ (hay được hiểu là các biểu mẫu)" — ❓ xác nhận lại với BA (P-209).',
        'Tìm kiếm theo từ khoá (mã / tên biểu mẫu, mã hồ sơ, mã ĐXMS, tên luồng) hoặc Tìm kiếm nâng cao: Luồng mua sắm, Mã hồ sơ, Loại biểu mẫu, Trạng thái ký. Tải về từng văn bản; mã hồ sơ mở Chi tiết hồ sơ, mã ĐXMS mở Chi tiết luồng.',
        'Nguồn: Văn bản đầu ra của từng hồ sơ (như tab Văn bản đầu ra của Chi tiết hồ sơ, SCR-20). <b>Trạng thái ký</b>: văn bản có bước ký trên ĐTMS là Đã ký khi đã sinh; văn bản không có bước ký riêng (BM-02, BM-07) là Không ký trên ĐTMS — GIẢ LẬP P-209. Thật: bảng văn bản đầu ra của hồ sơ + trạng thái ký VOffice; <b>cần dev</b> API tìm kiếm chung mọi hồ sơ (S3).',
        'Khuôn: profile-list (tìm kiếm + Tìm kiếm nâng cao + bảng + phân trang).',
      ],
      q: ['P-209'], src: 'profile-management/profile-list (khuôn) · danh sách văn bản đầu ra của hồ sơ',
    };
    return `<div class="pg" data-qh>
      ${S().head({ title: 'Quản lý hồ sơ', info })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:300px">${icon('search')}<input id="qh-kw" maxlength="255" placeholder="Tìm kiếm theo biểu mẫu, mã hồ sơ, luồng" value="${esc(L.kw)}"></label>`}
          <button type="button" class="vbtn ${L.adv ? 'active' : 'secondary'}" data-qh="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'qh', total: list.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-qhadv]')) return;
    e.preventDefault();
    const hs = document.getElementById('qh-hs'); if (hs) L.d.hs = hs.value;
    L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'qh-hs') L.d.hs = e.target.value;
    if (e.target.id !== 'qh-kw') return;
    L.kw = e.target.value; L.page = 1; rerender();
    const el = document.getElementById('qh-kw'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  });
  document.addEventListener('click', (e) => {
    const t = e.target, q = t.closest('[data-qh]');
    if (q && q.dataset.qh) {
      if (q.dataset.qh === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
      if (q.dataset.qh === 'reset') { L.d = emptyF(); L.f = emptyF(); L.page = 1; }
      rerender(); return;
    }
    const pg = t.closest('[data-pager="qh"]');
    if (pg) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender();
    }
  });

  window.QuanLyHoSo = { page, rows };
})();
