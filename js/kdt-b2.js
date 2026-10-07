/* Quản lý KĐT — phần bổ sung theo Backlog W1_T10 (T16 B2, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2i):
   SCR-75 Danh sách hồ sơ KĐT (#/ho-so-kdt) và các tab của SCR-56 Chi tiết KĐT. Tab Căn cứ & hạng mục / Rà soát tồn kho / Yêu cầu báo giá
   dùng chung ycbg.js (MS13 cùng số bước 1–10 với MS01); tab Phân loại & định danh, Thành phần tham gia, Kết quả & triển khai ở đây. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, pager, norm, persona, cqcmUnit } = window.UI;
  const rerender = () => window.App.render();
  const Y = window.Ycbg;
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v == null || v === '' ? '-' : v}</div></div>`;
  const card = (title, body, cap) => `<section class="vcard pad24">${cap ? `<div class="vcard-h"><h3>${title}</h3><span class="cap">${cap}</span></div>` : `<h3>${title}</h3>`}${body}</section>`;
  const cat = (key, code) => ((window.Catalog.rows(key).find((r) => r.code === code) || {}).name || code || '');
  const caseHref = (c) => 'ho-so-kdt/' + encodeURIComponent(c.code);

  /* ---------- SCR-75 Danh sách hồ sơ KĐT (khuôn profile-list, như SCR-02) ---------- */
  const CASE_ST = { processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'], moved: ['Đã chuyển luồng', 'warning'], stopped: ['Dừng theo chỉ đạo', 'default'] };
  const emptyF = () => ({ code: '', kdt: '', title: '', unit: null, group: [], branch: [], st: [] });
  const L = { kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false };
  function rows() {
    return Flow.kdtCases().map((c) => { const x = Flow.findKdt(c.kdt) || {}; return Object.assign({}, c, { title: c.title || x.title || '', unit: x.unit || '', step: window.Kdt.stepName(c) }); })
      .sort((a, b) => b.code.localeCompare(a.code));
  }
  function filtered() {
    const f = L.f, n = norm;
    return rows().filter((c) => (!L.adv ? !L.kw || n(`${c.code} ${c.kdt} ${c.title}`).includes(n(L.kw))
      : (!f.code || n(c.code).includes(n(f.code))) && (!f.kdt || n(c.kdt).includes(n(f.kdt))) && (!f.title || n(c.title).includes(n(f.title))) && (!f.unit || c.unit === f.unit)
        && (!f.group.length || f.group.includes(c.flow || 'NONE')) && (!f.branch.length || f.branch.includes(c.branch || 'NONE')) && (!f.st.length || f.st.includes(c.st))));
  }
  function advPanel() {
    const d = L.d;
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-hkf="${k}" maxlength="255" placeholder="Nhập ${label.toLowerCase()}" value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'hkf-' + k, value: d[k], clear: true, searchable: true,
      placeholder: 'Chọn ' + label.toLowerCase(), onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
    return `<form class="adv" data-hk-adv><div class="grid3">
        ${txt('code', 'Mã hồ sơ')}${txt('kdt', 'Mã KĐT')}${txt('title', 'Tên hồ sơ')}
        ${sel('unit', 'Đơn vị đề xuất', { options: [...new Set(rows().map((c) => c.unit))].map((u) => ({ value: u, label: u })) })}
        ${sel('group', 'Nhóm KĐT', { multi: true, searchable: false, options: [{ value: 'NONE', label: 'Chưa xác định' }].concat(Object.entries(D.kdtGroups).map(([value, label]) => ({ value, label }))) })}
        ${sel('branch', 'Nhánh hồ sơ', { multi: true, searchable: false, options: [{ value: 'NONE', label: 'Chưa xác định' }].concat(Object.entries(D.kdtBranches).map(([value, label]) => ({ value, label }))) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(CASE_ST).map(([value, [label]]) => ({ value, label })) })}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-hk="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  function caseList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html (như SCR-02 Danh sách hồ sơ ĐXMS)
    const all = filtered();
    const pages = Math.max(1, Math.ceil(all.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const mine = Flow.tokensFor(Flow.state.persona);
    const cols = [['Thao tác', 80, 'c'], ['Trạng thái', 180, 'c'], ['Mã hồ sơ', 150], ['Mã KĐT', 160], ['Tên hồ sơ', 320], ['Loại hồ sơ', 150], ['Đơn vị đề xuất', 200],
      ['Nhóm KĐT', 200], ['Nhánh hồ sơ', 220], ['Tổng mức vốn (tỷ đồng)', 170, 'r'], ['Bước hiện tại', 240], ['Ngày cập nhật', 140]];
    const body = all.slice(from, from + L.size).map((c, i) => {
      const edit = c.live && Flow.state.kdt === c.kdt && mine.length ? `<button class="vbtn ghost icon" data-go="task/${mine[0].id}" title="Sửa" aria-label="Sửa">${icon('edit')}</button>` : '';
      return `<tr class="click" data-go="${caseHref(c)}" data-code="${esc(c.code)}"><td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${edit}</div></td>
        <td class="c">${badge(...CASE_ST[c.st])}</td><td><a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a></td><td><a class="link" data-go="kdt/${encodeURIComponent(c.kdt)}">${esc(c.kdt)}</a></td>
        <td>${clamp(c.title)}</td><td>${c.kind === 'DC' ? 'Điều chỉnh KĐT' : 'Phê duyệt KĐT'}</td><td>${clamp(c.unit)}</td><td>${c.flow ? esc(D.kdtGroups[c.flow]) : '<span class="faint">Chưa xác định</span>'}</td>
        <td>${c.branch ? esc(D.kdtBranches[c.branch]) : dash}</td><td class="r num">${c.total != null ? ty(c.total) : dash}</td><td>${clamp(c.step)}</td><td class="num">${esc(c.updated)}</td></tr>`;
    }).join('');
    const info = {
      scr: 'SCR-75', name: 'Danh sách hồ sơ khoản đầu tư', uc: 'UC-05-01 · Backlog W1_T10 › Hồ sơ KĐT (dòng 307–309)',
      notes: [
        'T16 B2: khuôn profile-list như Danh sách hồ sơ ĐXMS (SCR-02); cột Mã nhiệm vụ của source thay bằng <b>Mã KĐT</b>, thêm Nhóm KĐT, Nhánh hồ sơ (gộp BM-00 / hai giai đoạn), Tổng mức vốn thực tế.',
        'Hồ sơ là đối tượng con của KĐT (D-12): không có nút Thêm mới ở đây — hồ sơ tạo ở Chỉnh sửa KĐT › Tạo hồ sơ (Lưu = khởi tạo MS13-TO BE). Mã hồ sơ mở Chi tiết hồ sơ KĐT; Mã KĐT mở Chi tiết KĐT.',
        'Nhóm KĐT do hệ thống xác định sau bước 12 (trước đó "Chưa xác định"). Cột Thao tác: Sửa chỉ khi người đăng nhập có việc trên hồ sơ, mở màn xử lý việc đó.',
      ],
      src: 'profile-management/profile-list · /khcn-profile-management',
    };
    return `<div class="pg">
      ${S.head({ title: 'Danh sách hồ sơ khoản đầu tư', info })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="hk-kw" maxlength="255" placeholder="Tìm kiếm theo mã hồ sơ, mã KĐT, tên hồ sơ" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-hk="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'hkdt', total: all.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }
  document.addEventListener('click', (e) => {
    if (!/^#\/ho-so-kdt\/?$/.test(location.hash)) return;
    const t = e.target;
    if (t.closest('[data-pager="hkdt"]')) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (L.psOpen) { L.psOpen = false; rerender(); }
    const h = t.closest('[data-hk]');
    if (!h) return;
    if (h.dataset.hk === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
    if (h.dataset.hk === 'reset') { L.d = emptyF(); L.f = emptyF(); L.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-hk-adv]')) { e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); } });
  document.addEventListener('input', (e) => { const f = e.target.closest && e.target.closest('[data-hkf]'); if (f) L.d[f.dataset.hkf] = f.value; });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'hk-kw') return;
    L.kw = e.target.value.trim(); L.page = 1; rerender();
    const k = document.getElementById('hk-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-56 Chi tiết KĐT: tab riêng của KĐT ---------- */
  /* Hồ sơ đại diện: đang xử lý → Hoàn thành gần nhất → đã chuyển luồng (hồ sơ mới MS14 mang nhóm đúng). */
  const mainCase = (g) => g.cases.find((c) => c.st === 'processing') || g.cases.find((c) => c.st === 'done') || g.cases[0] || null;
  /* Ai, khi nào xác nhận bước n: hồ sơ chạy luồng lấy nhật ký; hồ sơ mẫu suy theo ngày tạo. */
  const by = (g, n, who, off) => {
    if (!g.did(n)) return null;
    const h = g.live && Flow.lastOf(n);
    return h ? `${persona(h.who).name} · ${Flow.dateOf(h.t)}` : `${persona(who).name} · ${Y.addDays(g.pd.created, off)}`;
  };
  /* Ngưỡng phân luồng (SCR-40) chứa tổng mức vốn: nhóm và quy tắc áp dụng. */
  function classify(x, total) {
    const rs = D.kdtRules();
    const fits = (r) => (r.field === '*' || r.field === x.field) && (r.asset === '*' || r.asset === x.nature);
    const rule = total == null ? null : rs.find((r) => fits(r) && total >= r.from && (r.to == null || total < r.to)) || null;
    return { rule, group: rule ? rule.procs[0] : total == null ? null : 'MS14' };
  }
  const AUTH = {
    MS13: ['Thủ trưởng VHT', 'Thủ trưởng VHT'],
    MS14: ['Chủ tịch / Tổng Giám đốc Tập đoàn (HĐĐT tham mưu)', 'Thủ trưởng VHT (theo phân cấp)'],
    MS15: ['Chủ tịch / Tổng Giám đốc Tập đoàn (HĐĐT tham mưu)', 'Chủ tịch / Tổng Giám đốc Tập đoàn (HĐĐT tham mưu)'],
  };
  function tabPhanLoai(g) {
    const x = g.x, c = mainCase(g);
    if (!c) return Y.emptyCard('Phân loại và định danh', 'KĐT chưa có hồ sơ. Hệ thống phân loại KĐT sau khi chốt tổng mức vốn thực tế (bước 10) và TTMS xác nhận 04 yếu tố (bước 12) của hồ sơ Phê duyệt KĐT.');
    const total = g.did(10) ? (c.total != null ? c.total : g.live ? D.caseInfo.total : null) : null;
    const k = classify(x, total);
    const group = c.flow || (g.did(12) ? k.group : null);
    const conf = by(g, 12, 'lan', 12);
    const fx = [['Lĩnh vực', cat('linh-vuc', x.field), 'Trường của KĐT (DMDC Lĩnh vực đầu tư)'], ['Loại KĐT', cat('loai-kdt', x.type), 'Trường của KĐT (DMDC Loại KĐT)'],
      ['Tính chất tài sản', cat('tinh-chat-tai-san', x.nature), 'Trường của KĐT (DMDC Tính chất tài sản)'],
      ['Mức giá trị (tổng mức vốn thực tế)', total != null ? ty(total, 2) + ' tỷ đồng' : '', 'Cơ sở giá của YCBG đạt (bước 10)']];
    const merge = [['Mức vốn thuộc MS13', group === 'MS13'], ['Tính chất tài sản: Nguyên chiếc', x.nature === 'NGUYEN_CHIEC'], ['Loại KĐT: Trang bị nội bộ', x.type === 'TBNB']];
    const auth = group ? AUTH[group] : null;
    return card('04 yếu tố định danh', Y.table([['Yếu tố', 250], ['Giá trị', 260], ['Nguồn', 300], ['Xác nhận của TTMS', 170, 'c']], fx,
        (r, i) => `${Y.ord(i)}<td>${esc(r[0])}</td><td>${r[1] ? esc(r[1]) : dash}</td><td>${esc(r[2])}</td><td class="c">${conf ? badge('OK', 'success') : badge('Chưa xác nhận', 'default')}</td>`),
      conf ? `TTMS xác nhận: ${esc(conf)}` : 'TTMS xác nhận OK / NOT OK ở bước 12 trước khi dùng để phân luồng')
      + card('Kết quả phân loại', `<div class="ginfo c3">
          ${kv('Nhóm KĐT', group ? esc(D.kdtGroups[group]) : 'Chưa xác định')}${kv('Ngưỡng áp dụng', k.rule ? esc(`${k.rule.field === '*' ? 'Tất cả lĩnh vực' : cat('linh-vuc', k.rule.field)}: từ ${ty(k.rule.from, 0)}${k.rule.to != null ? ' đến dưới ' + ty(k.rule.to, 0) : ''} tỷ đồng`) : null)}
          ${kv('Nhánh hồ sơ', c.branch ? esc(D.kdtBranches[c.branch]) : null)}
          ${kv('Hình thành TSCĐ', g.did(11) ? 'Có' : null)}${kv('Ban Tài chính xác nhận', by(g, 11, 'thu', 11))}${kv('Hồ sơ', `<a class="link-red" href="#/${caseHref(c)}">${esc(c.code)}</a>`)}</div>`,
        c.st === 'moved' || c.replaces ? 'Tổng mức vốn thực tế không thuộc MS13 — hồ sơ đã chuyển luồng' : '')
      + card('Điều kiện áp dụng hồ sơ gộp (BM-00)', Y.table([['Điều kiện', 420], ['Kết quả', 160, 'c']], group ? merge : [],
        (r, i) => `${Y.ord(i)}<td>${esc(r[0])}</td><td class="c">${r[1] ? badge('Đạt', 'success') : badge('Không đạt', 'default')}</td>`),
        group ? (merge.every((m) => m[1]) ? 'Đủ 03 điều kiện → gộp chủ trương và KĐT (BM-00)' : 'Không đủ 03 điều kiện → hai giai đoạn (BM-01 → BM-03)') : 'Xác định sau khi phân loại')
      + card('Cấp có thẩm quyền phê duyệt', `<div class="ginfo c3">${kv('Phê duyệt chủ trương KĐT', auth ? esc(auth[0]) : null, 'span2')}${kv('Nhóm KĐT', group ? esc(group) : null)}
          ${kv('Phê duyệt KĐT', auth ? esc(auth[1]) : null, 'span2')}${kv('KPI thời gian phê duyệt', group ? { MS13: '≤ 10 ngày làm việc', MS14: '≤ 20 ngày làm việc', MS15: '≤ 35 ngày làm việc' }[group] : null)}</div>`);
  }
  /* Giai đoạn thẩm định và bước chọn CQCM (MS13): gộp BM-00 → bước 21; hai giai đoạn → chủ trương bước 38, KĐT bước 48. */
  function tabThanhPhan(g) {
    const c = mainCase(g);
    const cq = (g.ref.cqcm || ['TC', 'PC']).map((id) => cqcmUnit(id)).filter(Boolean);
    const st = !c ? [] : (c.branch === 'BM00' ? [['Thẩm định hồ sơ gộp (BM-00)', 21]] : c.branch === '2GD' ? [['Thẩm định chủ trương (BM-01)', 38], ['Thẩm định KĐT (BM-03)', 48]] : []);
    const rows = st.filter(([, n]) => g.did(n)).map(([name, n]) => ({ name, n, at: by(g, n, 'minh', n) }));
    return card('CQCM tham gia thẩm định', Y.table([['Giai đoạn', 260], ['CQCM chủ trì', 200], ['CQCM phối hợp', 300], ['Đơn vị đề xuất chọn', 220], ['TTMS phê duyệt danh sách', 200, 'c']], rows,
        (r, i) => `${Y.ord(i)}<td>${esc(r.name)}</td><td>Trung tâm Mua sắm</td><td>${clamp(cq.join(', '))}</td><td>${esc(r.at)}</td><td class="c">${g.did(r.n + 1) || !(c.st === 'processing' && c.task === r.n) ? badge('Đã phê duyệt', 'success') : badge('Chờ phê duyệt', 'warning')}</td>`),
      'Đơn vị đề xuất chọn CQCM theo tính chất KĐT; TTMS rà soát trước khi thẩm định')
      + card('Đầu mối xử lý hồ sơ', Y.table([['Vai trò', 260], ['Đơn vị', 260], ['Người thực hiện', 220]], c ? [['Đơn vị đề xuất KĐT', g.x.unit, c.creator || g.x.creator], ['Cơ quan chủ trì thẩm định', 'Trung tâm Mua sắm', persona('lan').name], ['Xác nhận hình thành TSCĐ', 'Ban Tài chính', persona('thu').name]] : [],
        (r, i) => `${Y.ord(i)}<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2] || '')}</td>`));
  }
  const DOC = { 'BM-00': 'Hồ sơ chủ trương và KĐT (văn bản gộp)', 'BM-01': 'Tờ trình phê duyệt chủ trương KĐT', 'BM-14': 'Báo cáo kết quả thẩm định KĐT', 'BM-18': 'Quyết định phê duyệt KĐT' };
  function tabKetQua(g) {
    const x = g.x, m = window.Kdt.meta(x);
    const docs = [];
    m.hs.forEach((c) => (c.docs || []).forEach(([code, at]) => docs.push({ code, at, c })));
    const done = m.hs.find((c) => c.st === 'done'), stop = m.hs.find((c) => c.st === 'stopped');
    const ct = docs.find((d) => d.code === 'BM-01' || d.code === 'BM-00');
    const no = (d) => `${String(400 + (Number(d.c.code.slice(-4)) * 13 + d.code.length * 7) % 500).padStart(4, '0')}/${d.code === 'BM-14' ? 'BC-TTMS' : d.code === 'BM-01' ? 'TTr-VHT' : 'QĐ-VHT'}`;
    const plans = window.Thau.khBy('KDT', x.code);
    const fund = (g.demo && g.demo.caseInfo && g.demo.caseInfo.fund) || cat('nguon-von', x.type === 'KHCN' ? 'KHCN' : x.type === 'TBNB' ? 'DTPT' : 'SXKD');
    return card('Kết quả phê duyệt', `<div class="ginfo c3">
        ${kv('Chủ trương KĐT', ct ? badge('Đã phê duyệt', 'success') : stop ? badge('Dừng theo chỉ đạo', 'default') : badge('Chưa phê duyệt', 'default'))}${kv('Văn bản chủ trương', ct ? `${esc(ct.code)} ${esc(DOC[ct.code])} · ${esc(ct.at)}` : null, 'span2')}
        ${kv('Khoản đầu tư', done ? badge('Đã phê duyệt', 'success') : badge('Chưa phê duyệt', 'default'))}${kv('Quyết định phê duyệt KĐT', done ? (docs.filter((d) => d.code === 'BM-18' || d.code === 'BM-00').map((d) => `${esc(no(d))} · ${esc(d.at)}`).pop() || null) : null, 'span2')}
        ${kv('Tổng mức vốn được duyệt', done ? ty(done.total, 2) + ' tỷ đồng' : null)}${kv('Nguồn vốn được duyệt', done ? esc(fund) : null)}${kv('Cấp phê duyệt', done ? esc((AUTH[done.flow] || AUTH.MS13)[1]) : null)}</div>`)
      + card('Văn bản đầu ra', Y.table([['Văn bản', 340], ['Số văn bản', 160], ['Hồ sơ', 150], ['Ngày ký', 120], ['Tệp', 80, 'c']], docs,
        (d, i) => `${Y.ord(i)}<td>${esc(d.code + ' ' + DOC[d.code])}</td><td>${esc(no(d))}</td><td><a class="link" data-go="${caseHref(d.c)}">${esc(d.c.code)}</a></td><td class="num">${esc(d.at)}</td>
          <td class="c"><button type="button" class="vbtn icon ghost" aria-label="Tải xuống" data-dl="${esc(no(d).replace(/\//g, '-'))}.pdf">${icon('download')}</button></td>`))
      + (stop ? card('Chỉ đạo dừng / bàn giao xử lý', `<div class="ginfo c3">${kv('Hồ sơ', `<a class="link-red" href="#/${caseHref(stop)}">${esc(stop.code)}</a>`)}${kv('Ngày', esc(stop.updated))}${kv('Người chỉ đạo', 'Thủ trưởng VHT')}
          ${kv('Nội dung chỉ đạo', 'Không ký chủ trương; dừng KĐT do nhu cầu đã được đáp ứng bằng thiết bị điều chuyển nội bộ. Bàn giao ' + esc(x.unit) + ' rà soát lại nhu cầu năm 2027.', 'span3')}</div>`) : '')
      + card('Triển khai mua sắm', Y.table([['Mã KHLCNT', 170], ['Tên KHLCNT', 360], ['Số gói thầu', 110, 'c'], ['Trạng thái', 200, 'c']], plans,
        (k, i) => `${Y.ord(i)}<td><a class="link" data-go="khlcnt/${encodeURIComponent(k.code)}">${esc(k.code)}</a></td><td>${clamp(k.title)}</td><td class="c">${window.Thau.pkgsOf(k).length}</td><td class="c">${badge(...window.Thau.KH_ST[k.st])}</td>`),
        done ? 'BM-18 / BM-00 là căn cứ lập kế hoạch lựa chọn nhà thầu' : 'Lập KHLCNT sau khi KĐT được phê duyệt');
  }

  const TAB_LIST = [['info', 'Thông tin chung'], ['can-cu', 'Căn cứ & hạng mục'], ['ton-kho', 'Rà soát tồn kho'], ['ycbg', 'Yêu cầu báo giá'],
    ['phan-loai', 'Phân loại & định danh'], ['thanh-phan', 'Thành phần tham gia'], ['ket-qua-kdt', 'Kết quả & triển khai']];
  const TAB_INFO = [
    'Tab theo Backlog W1_T10 › Quản lý KĐT (T16 B2): app-tabs như Chi tiết ĐXMS; tab Thông tin chung giữ bố cục task-create mode detail. Các tab khác chỉ xem — dữ liệu do các bước MS13 ghi (S2, S4).',
    'Căn cứ & hạng mục (bước 1, 5), Rà soát tồn kho (bước 6, 7), Yêu cầu báo giá (bước 8–10): cùng cơ chế với ĐXMS (B1) — cần dev bảng giữ chỗ căn cứ, API giữ chỗ tồn kho + snapshot, bảng YCBG.',
    'Phân loại & định danh: 04 yếu tố (3 trường của KĐT + tổng mức vốn thực tế), xác nhận TSCĐ (bước 11, Ban Tài chính), xác nhận 04 yếu tố (bước 12, TTMS); nhóm theo Ngưỡng phân luồng (SCR-40); 3 điều kiện gộp BM-00; cấp thẩm quyền theo QT-8.6.5 (chú thích 7: chủ trương KĐT thông thường / phức tạp do Chủ tịch / TGĐ Tập đoàn quyết định, HĐĐT tham mưu).',
    'Thành phần tham gia: CQCM chủ trì / phối hợp chọn ở bước 21 (gộp) hoặc 38 / 48 (hai giai đoạn), TTMS rà soát danh sách. Backlog "Quản lý Tổ chuyên gia" của KĐT: MS13 không có bước lập Tổ chuyên gia — Tổ chuyên gia hiện ở Gói thầu (P-75).',
    'Kết quả & triển khai: kết quả phê duyệt chủ trương (BM-01 / BM-00), Quyết định phê duyệt KĐT (BM-18 / BM-00), tổng mức vốn và nguồn vốn được duyệt, chỉ đạo dừng (hồ sơ Dừng theo chỉ đạo), KHLCNT lập từ KĐT. Nút Lập KHLCNT trên hàng tiêu đề khi KĐT đã phê duyệt.',
  ];
  const tabOpt = { list: TAB_LIST, bodies: { 'phan-loai': tabPhanLoai, 'thanh-phan': tabThanhPhan, 'ket-qua-kdt': tabKetQua } };

  window.KdtB2 = { caseList, tabOpt, TAB_INFO };
})();
