/* SCR-107 Quản lý tài liệu ĐXMS — theo SRS 29 (docs/SRS/29-srs-dxms-tai-lieu, DTMS_CN_0153). Tên cũ Quản lý hồ sơ (T29 B12, RV-PROTO-0511 bản 2 #19, D-78);
   người dùng 10/11 đổi tên menu (D-105), route giữ #/quan-ly-ho-so.
   Danh sách văn bản đầu ra (phiên bản hiện hành) của mọi ĐXMS; tìm nhanh (mã / tên biểu mẫu, mã ĐXMS, tên đề xuất) hoặc Tìm kiếm nâng cao
   (Đề xuất mua sắm, Loại biểu mẫu, Trạng thái nhiều lựa chọn, Loại ĐXMS, Ngày cập nhật); tải xuống; mã ĐXMS mở Chi tiết, tab Tài liệu & văn bản.
   Trạng thái (SRS 29 mục 2.3) suy từ Luong.docRows — cùng nguồn với tab Tài liệu & văn bản (BR-QTL-C-06):
   văn bản phê duyệt → Đang hiệu lực / Đã thay thế; hồ sơ đang chạy có lượt ký → Chờ ký / Đã ký; còn lại Dự thảo.
   GIẢ LẬP P-209: hồ sơ mẫu (không chạy) không có lượt ký → văn bản có bước ký trên ĐTMS (SIGNED) coi là Đã ký.
   GIẢ LẬP: chưa lọc phạm vi xem ĐXMS (BR-QTL-C-01) — như Danh sách đề xuất mua sắm của prototype. Thật: API tìm kiếm chung mọi hồ sơ (SRS 29 mục 5).
   Khuôn: profile-list (tìm kiếm + Tìm kiếm nâng cao + bảng + phân trang). */
(function () {
  const Flow = window.Flow;
  const { esc, icon, vSelect, badge, norm, pager } = window.UI;
  const S = () => window.Screens;
  const rerender = () => window.App.render();
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp" title="${esc(v)}">${esc(v)}</span>` : dash);
  /* Danh mục biểu mẫu của quy trình ĐXMS (BR-QTL-01-02: nguồn ô Loại biểu mẫu theo danh mục, không theo dữ liệu đang có). */
  const FORMS = [['BM-01', 'Tờ trình đề xuất mua sắm'], ['BM-02', 'Thuyết minh / phụ lục giải trình'], ['BM-03', 'Công văn đề nghị góp ý dự thảo hồ sơ ĐXMS'],
    ['BM-04', 'Phiếu nhận xét'], ['BM-05', 'Báo cáo kết quả thẩm định'], ['BM-06', 'Công văn báo cáo TGĐ Tập đoàn'], ['BM-07', 'Báo cáo của Ban ĐTXD Tập đoàn'],
    ['BM-08', 'Quyết định phê duyệt ĐXMS'], ['BM-09', 'Tờ trình đề xuất mua sắm (thẩm định, phê duyệt trực tiếp)'], ['CL01', 'Checklist 01 — danh mục hồ sơ'], ['CL02', 'Checklist 02 — danh mục hồ sơ']];
  const SIGNED = ['BM-01', 'BM-03', 'BM-04', 'BM-05', 'BM-06', 'BM-08', 'BM-09', 'CL01', 'CL02'];
  /* SRS 29 mục 2.3 + màu mục 4. */
  const ST = { 'Dự thảo': 'info', 'Chờ ký': 'warning', 'Đã ký': 'success', 'Từ chối': 'error', 'Lỗi gửi': 'error', 'Đã hủy': 'default', 'Đang hiệu lực': 'success', 'Đã thay thế': 'default' };
  const KINDS = ['Tạo mới', 'Điều chỉnh'];
  const emptyF = () => ({ dxms: null, code: null, st: [], kind: null, date: '' });
  const L = { kw: '', adv: false, f: emptyF(), d: emptyF(), err: '', page: 1, size: 10, psOpen: false };
  const dk = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s || '')); return m ? `${m[3]}${m[2].padStart(2, '0')}${m[1].padStart(2, '0')}` : ''; };
  const rangeOf = (s) => { const m = String(s || '').match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || []; return [m[0] || '', m[1] || '']; };
  const validDate = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s); if (!m) return false; const d = new Date(+m[3], +m[2] - 1, +m[1]); return d.getMonth() === +m[2] - 1 && d.getDate() === +m[1]; };
  /* Ngày cập nhật hợp lệ: rỗng, một ngày, hoặc "từ – đến" với từ ≤ đến. */
  function dateOk(s) {
    const t = String(s || '').trim();
    if (!t) return true;
    const parts = t.split(/\s*[–-]\s*(?=\d)/).map((x) => x.trim()).filter(Boolean);
    if (parts.length > 2 || !parts.every(validDate)) return false;
    return parts.length < 2 || dk(parts[0]) <= dk(parts[1]);
  }
  function stateOf(r, live) {
    if (r.res) return r.res.cur ? 'Đang hiệu lực' : 'Đã thay thế';
    if (r.signs.some((sg) => sg.st === 'PENDING')) return 'Chờ ký';
    if (r.signs.some((sg) => sg.st === 'REJECTED')) return 'Từ chối';
    if (r.signs.length) return 'Đã ký';
    return !live && SIGNED.includes(r.code) ? 'Đã ký' : 'Dự thảo';
  }
  const kindOf = (x) => {
    if (!x.adjFrom) return 'Tạo mới';
    const n = Flow.dxmsChain(x.code).findIndex((o) => o.code === x.code);
    return n > 0 ? `Điều chỉnh lần ${n}` : 'Điều chỉnh';
  };

  function all() {
    return S().allCases().flatMap((c) => {
      const x = Flow.findDxms(c.dxms) || { code: c.dxms, title: c.dxmsTitle || '' };
      return window.Luong.docRows(x, S().caseDocs(c)).map((r) => {
        const at = r.signs.length ? r.signs[r.signs.length - 1].at : r.res ? r.res.c.updated : r.at;
        const name = String(r.name || '').replace(new RegExp(`^${r.code}\\s+`), '');
        return { code: r.code, name, at: String(at || '').slice(0, 10), n: r.n, dxms: c.dxms, title: x.title || c.dxmsTitle || '', kind: kindOf(x), st: stateOf(r, !!c.live) };
      });
    });
  }
  function rows() {
    const f = L.f, [fr, to] = rangeOf(f.date);
    return all().filter((r) => (!L.adv ? !L.kw || norm(`${r.code} ${r.name} ${r.dxms} ${r.title}`).includes(norm(L.kw))
      : (!f.dxms || r.dxms === f.dxms) && (!f.code || r.code === f.code) && (!f.st.length || f.st.includes(r.st))
        && (!f.kind || r.kind.startsWith(f.kind)) && (!fr || dk(r.at) >= dk(fr)) && (!to || dk(r.at) <= dk(to))))
      /* BR-QTL-01-03: Ngày cập nhật giảm dần → Mã ĐXMS tăng dần → thứ tự sinh văn bản. */
      .sort((a, b) => dk(b.at).localeCompare(dk(a.at)) || a.dxms.localeCompare(b.dxms) || a.n - b.n);
  }
  function advPanel() {
    const d = L.d, src = all();
    const sel = (k, label, ph, opts, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'qh-' + k, value: d[k], clear: true, searchable: true, placeholder: ph, options: opts, onChange: (v) => { d[k] = v; rerender(); } }, o || {}))}</div>`;
    /* BR-QTL-01-02: ĐXMS có ít nhất một văn bản. */
    const dx = [...new Map(src.map((r) => [r.dxms, r.title])).entries()];
    return `<form class="adv" data-qhadv><div class="grid3">
        ${sel('dxms', 'Đề xuất mua sắm', 'Chọn đề xuất mua sắm', dx.map(([v, t]) => ({ value: v, label: `${v} — ${t}` })))}
        ${sel('code', 'Loại biểu mẫu', 'Chọn loại biểu mẫu', FORMS.map(([v, n]) => ({ value: v, label: `${v} ${n}` })))}
        ${sel('st', 'Trạng thái', 'Tất cả', Object.keys(ST).map((v) => ({ value: v, label: v })), { multi: true, searchable: false })}
        ${sel('kind', 'Loại ĐXMS', 'Tất cả', KINDS.map((v) => ({ value: v, label: v })), { searchable: false })}
        <div class="vfield ${L.err ? 'invalid' : ''}"><div class="lr"><label>Ngày cập nhật</label></div><input class="vctl" id="qh-date" maxlength="25" placeholder="DD/MM/YYYY – DD/MM/YYYY" value="${esc(d.date)}">
          ${L.err ? `<div class="msg">${esc(L.err)}</div>` : ''}</div></div>
      <div class="acts"><button type="button" class="vbtn secondary" data-qh="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function page() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
    const list = rows(), pages = Math.max(1, Math.ceil(list.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 90, 'c'], ['Mã biểu mẫu', 120], ['Tên văn bản', 300], ['Mã ĐXMS', 160], ['Tên đề xuất mua sắm', 280], ['Loại ĐXMS', 150], ['Trạng thái', 150, 'c'], ['Ngày cập nhật', 130, 'c']];
    const body = list.slice(from, from + L.size).map((r, i) => `<tr data-qh-row="${esc(r.dxms + ':' + r.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts"><button type="button" class="vbtn icon ghost" aria-label="Tải xuống" title="Tải xuống" data-dl="${esc(`${r.code}-${r.dxms}.pdf`)}">${icon('download')}</button></div></td>
        <td>${esc(r.code)}</td><td>${clamp(r.name)}</td>
        <td><a class="link" data-go="luong/${encodeURIComponent(r.dxms)}/tai-lieu">${esc(r.dxms)}</a></td><td>${clamp(r.title)}</td><td>${esc(r.kind)}</td>
        <td class="c">${badge(r.st, ST[r.st])}</td><td class="c">${esc(r.at)}</td></tr>`).join('');
    const empty = all().length ? 'Không tìm thấy dữ liệu phù hợp' : 'Chưa có dữ liệu';
    const info = {
      scr: 'SCR-107', name: 'Quản lý tài liệu ĐXMS', uc: 'SRS 29 · DTMS_CN_0153 · UC-07-14',
      notes: [
        '<b>D-105</b> (người dùng 10/11): đổi tên menu Quản lý hồ sơ → <b>Quản lý tài liệu ĐXMS</b>; đặc tả SRS 29 (<code>docs/SRS/29-srs-dxms-tai-lieu</code>). Nghĩa màn giữ <b>D-78</b>: danh sách văn bản đầu ra (phiên bản hiện hành) của mọi ĐXMS.',
        'Tìm nhanh theo mã / tên biểu mẫu, mã ĐXMS, tên đề xuất; Tìm kiếm nâng cao: Đề xuất mua sắm, Loại biểu mẫu (theo danh mục), Trạng thái (nhiều lựa chọn), Loại ĐXMS, Ngày cập nhật. Tải xuống từng văn bản ("{Mã biểu mẫu}-{Mã ĐXMS}"); mã ĐXMS mở Chi tiết, tab Tài liệu & văn bản.',
        '<b>Trạng thái</b> theo SRS 29 mục 2.3 (Dự thảo, Chờ ký, Đã ký, Từ chối, Lỗi gửi, Đã hủy; văn bản phê duyệt Đang hiệu lực / Đã thay thế), cùng nguồn với tab Tài liệu & văn bản. GIẢ LẬP P-209: hồ sơ mẫu chưa có lượt ký — văn bản có bước ký coi là Đã ký.',
        'GIẢ LẬP: chưa lọc phạm vi xem ĐXMS (BR-QTL-C-01), như Danh sách đề xuất mua sắm. Thật: API tìm kiếm chung, thêm cột vào <code>wf_profile_documents</code> (SRS 29 mục 5, câu hỏi 4).',
        'Câu hỏi mở SRS 29: tài liệu tải lên có vào màn không (0593), tải nhiều (0594), quyền vào màn (0595), bảng lưu văn bản (0596).',
      ],
      q: ['P-209'], src: 'SRS 29 · profile-management/profile-list (khuôn) · Luong.docRows',
    };
    return `<div class="pg" data-qh>
      ${S().head({ title: 'Quản lý tài liệu ĐXMS', info })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:320px">${icon('search')}<input id="qh-kw" maxlength="255" placeholder="Tìm kiếm theo biểu mẫu, mã ĐXMS, tên đề xuất" value="${esc(L.kw)}"></label>`}
          <button type="button" class="vbtn ${L.adv ? 'active' : 'secondary'}" data-qh="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${empty}</td></tr>`}</tbody></table></div>
        ${pager({ id: 'qh', total: list.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  document.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-qhadv]')) return;
    e.preventDefault();
    if (!dateOk(L.d.date)) { L.err = 'Ngày cập nhật không hợp lệ.'; rerender(); return; }
    L.err = ''; L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  let kwTimer = null;
  document.addEventListener('input', (e) => {
    if (e.target.id === 'qh-date') { L.d.date = e.target.value; return; }
    if (e.target.id !== 'qh-kw') return;
    L.kw = e.target.value;
    /* SRS 29 thành phần 2: tự tìm sau 500 ms ngừng gõ (Enter tìm ngay). */
    clearTimeout(kwTimer);
    kwTimer = setTimeout(() => {
      L.page = 1; rerender();
      const el = document.getElementById('qh-kw'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }, 500);
  });
  document.addEventListener('keydown', (e) => {
    if (e.target.id !== 'qh-kw' || e.key !== 'Enter') return;
    clearTimeout(kwTimer); L.kw = e.target.value; L.page = 1; rerender();
    const el = document.getElementById('qh-kw'); if (el) el.focus();
  });
  document.addEventListener('click', (e) => {
    const t = e.target, q = t.closest('[data-qh]');
    if (q && q.dataset.qh) {
      if (q.dataset.qh === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.err = ''; L.page = 1; }
      if (q.dataset.qh === 'reset') { L.d = emptyF(); L.f = emptyF(); L.err = ''; L.page = 1; }
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

  window.QuanLyHoSo = { page, rows, dateOk };
})();
