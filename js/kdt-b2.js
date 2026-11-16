/* Quản lý KĐT — phần bổ sung theo Backlog W1_T10 (T16 B2, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2i):
   SCR-75 Danh sách hồ sơ chủ trương KĐT (#/ho-so-ct-kdt) / phê duyệt KĐT (#/ho-so-pd-kdt) và các tab của SCR-56 Chi tiết KĐT. Tab Căn cứ & hạng mục / Rà soát tồn kho / Yêu cầu báo giá
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

  /* ---------- SCR-75 Danh sách hồ sơ KĐT (khuôn profile-list, như SCR-02) ----------
     T45 §1.7 (D-103): hai màn cùng khuôn — Hồ sơ chủ trương KĐT (#/ho-so-ct-kdt, kind CT) và Hồ sơ phê duyệt KĐT (#/ho-so-pd-kdt, kind KDT). */
  const CASE_ST = { processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'], moved: ['Đã chuyển luồng', 'warning'], stopped: ['Dừng theo chỉ đạo', 'default'] };
  const kindOf = (c) => (c && c.kind === 'KDT' ? 'KDT' : 'CT');
  const KIND_TEXT = { CT: 'Phê duyệt chủ trương KĐT', KDT: 'Phê duyệt KĐT' };
  const kindText = (c) => KIND_TEXT[kindOf(c)];
  const SCOPE_TEXT = { CT: 'Chủ trương', CT_KDT: 'Chủ trương và KĐT' };
  const scopeText = (c) => SCOPE_TEXT[(c && c.scope) || (c && c.branch === 'BM00' ? 'CT_KDT' : 'CT')];
  const lechText = (c) => (c && c.lech ? `${c.lech.from} → ${c.lech.to}` : '');
  const LIST = { CT: { path: 'ho-so-ct-kdt', title: 'Danh sách hồ sơ chủ trương KĐT', file: 'danh-sach-ho-so-chu-truong-kdt.csv' },
    KDT: { path: 'ho-so-pd-kdt', title: 'Danh sách hồ sơ phê duyệt KĐT', file: 'danh-sach-ho-so-phe-duyet-kdt.csv' } };
  /* Mục menu / màn danh sách của một hồ sơ (Chi tiết hồ sơ KĐT quay lại, highlight menu). */
  const listOf = (code) => LIST[kindOf(Flow.kdtCases().find((c) => c.code === code))].path;
  const emptyF = () => ({ code: '', kdt: '', title: '', nv: null, block: null, unit: null, creator: null, secret: null, group: [], branch: [], st: [], from: '', to: '',
    cqcm: [], rvSt: [], rvFrom: '', rvTo: '', ttFrom: '', ttTo: '', scope: [], parent: '', lech: null });
  const newL = () => ({ kw: '', adv: false, f: emptyF(), d: emptyF(), page: 1, size: 10, psOpen: false });
  const LS = { CT: newL(), KDT: newL() };
  let L = LS.CT, K0 = 'CT';
  const use = (k) => { K0 = k; L = LS[k]; };
  function rows() {
    return Flow.kdtCases().filter((c) => kindOf(c) === K0).map((c) => {
      const x = Flow.findKdt(c.kdt) || {};
      return Object.assign({}, c, { title: c.title || x.title || '', nvs: x.nvs || (x.nv ? [x.nv] : []), nv: x.nv || null, unit: x.unit || '', secret: !!x.secret, step: window.Kdt.stepName(c) });
    }).sort((a, b) => b.code.localeCompare(a.code));
  }
  /* T31 K1 (IA dòng 19–20): CQCM, tình trạng, ngày thẩm định cùng thỏa trên một CQCM; ngày tờ trình (GIẢ LẬP P-191, P-192). */
  function advReview(c, f) {
    const K = window.Kdt;
    if (f.cqcm.length || f.rvSt.length || f.rvFrom || f.rvTo) {
      if (!K.reviewOf(c).some((r) => (!f.cqcm.length || f.cqcm.includes(r.id)) && (!f.rvSt.length || f.rvSt.includes(r.st)) && (!(f.rvFrom || f.rvTo) || K.inDate(r.at, f.rvFrom, f.rvTo)))) return false;
    }
    if (f.ttFrom || f.ttTo) { const t = K.ttOf(c); if (!t || !K.inDate(t.at, f.ttFrom, f.ttTo)) return false; }
    return true;
  }
  function filtered() {
    const f = L.f, n = norm;
    return rows().filter((c) => (!L.adv ? !L.kw || n(`${c.code} ${c.kdt} ${c.title} ${c.parent || ''}`).includes(n(L.kw))
      : (!f.code || n(c.code).includes(n(f.code))) && (!f.kdt || n(c.kdt).includes(n(f.kdt))) && (!f.title || n(c.title).includes(n(f.title))) && (!f.unit || c.unit === f.unit) && (!f.nv || c.nvs.includes(f.nv))
        && (!f.group.length || f.group.includes(c.flow || 'NONE')) && (!f.branch.length || f.branch.includes(c.branch || 'NONE')) && (!f.st.length || f.st.includes(c.st))
        && (!f.block || D.blockOf(c.unit) === f.block) && (!f.creator || c.creator === f.creator) && (!f.secret || (f.secret === 'Có') === c.secret)
        && (!f.scope.length || f.scope.includes(c.scope || 'CT')) && (!f.parent || n(c.parent || '').includes(n(f.parent))) && (!f.lech || (f.lech === 'Có') === !!c.lech)
        && window.Kdt.inDate(c.created, f.from, f.to) && advReview(c, f)));
  }
  const RV_ST = ['Chưa xem', 'Đang xem', 'Đã đồng ý', 'Yêu cầu sửa'];
  function advPanel() {
    const d = L.d, K = window.Kdt, kd = K0 === 'KDT';
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-hkf="${k}" maxlength="255" placeholder="Nhập ${label.toLowerCase()}" value="${esc(d[k])}"></div>`;
    /* T56: khoảng ngày = hai vht-calendar + "-" (UI.vDateRange). */
    const range = (a, b, label) => window.UI.vDateRange({ label, from: [`data-hkf="${a}"`, d[a]], to: [`data-hkf="${b}"`, d[b]] });
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'hkf-' + k, value: d[k], clear: true, searchable: true,
      placeholder: 'Chọn ' + label.toLowerCase(), onChange: (v) => { d[k] = v; rerender(); } }, o))}</div>`;
    const units = [...new Set(rows().map((c) => c.unit))].filter((u) => !d.block || D.blockOf(u) === d.block);
    return `<form class="adv" data-hk-adv><div class="grid3">
        ${txt('code', 'Mã hồ sơ')}${txt('kdt', 'Mã KĐT')}${txt('title', 'Tên hồ sơ')}
        ${kd ? txt('parent', 'Hồ sơ chủ trương') + sel('lech', 'Luồng khác chủ trương', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })
    : sel('scope', 'Phạm vi', { multi: true, searchable: false, placeholder: 'Tất cả', options: Object.entries(SCOPE_TEXT).map(([value, label]) => ({ value, label })) })}
        ${sel('nv', 'Đề tài / dự án', { options: D.nhiemVu.map((n) => ({ value: n.code, label: `${n.code} — ${n.name}` })) })}
        ${sel('block', 'Khối đơn vị', { searchable: false, options: D.blocks.map((b) => ({ value: b, label: b })),
    onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị đề xuất', { options: units.map((u) => ({ value: u, label: u })) })}
        ${sel('creator', 'Người tạo', { options: K.creatorsOf(rows()).map((u) => ({ value: u, label: u })) })}
        ${sel('group', 'Nhóm KĐT', { multi: true, searchable: false, options: [{ value: 'NONE', label: 'Chưa xác định' }].concat(Object.entries(D.kdtGroups).map(([value, label]) => ({ value, label }))) })}
        ${sel('branch', 'Nhánh hồ sơ', { multi: true, searchable: false, options: [{ value: 'NONE', label: 'Chưa xác định' }].concat(Object.entries(D.kdtBranches).map(([value, label]) => ({ value, label }))) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(CASE_ST).map(([value, [label]]) => ({ value, label })) })}
        ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
        ${sel('cqcm', 'Người thẩm định (CQCM)', { multi: true, placeholder: 'Chọn CQCM', options: D.cqcm.map((c) => ({ value: c.id, label: `${c.unit} — ${persona(c.doer).name}` })) })}
        ${sel('rvSt', 'Trạng thái với người thẩm định', { multi: true, searchable: false, placeholder: 'Tất cả', options: RV_ST.map((v) => ({ value: v, label: v })) })}
        ${range('from', 'to', 'Ngày tạo')}
        ${range('rvFrom', 'rvTo', 'Ngày thẩm định')}
        ${range('ttFrom', 'ttTo', 'Ngày tờ trình')}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-hk="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }
  const nvsCell = (c) => (c.nvs.length ? `<span class="clamp">${c.nvs.map((v) => window.Kdt.nvLink(v)).filter(Boolean).join(', ')}</span>` : dash);
  /* Cột theo loại hồ sơ: CT thêm Phạm vi; KĐT thêm Hồ sơ chủ trương, Luồng khác chủ trương (D-103). [tiêu đề, rộng, căn, ô HTML, giá trị CSV] */
  function colsOf(kind) {
    const K = window.Kdt;
    const own = kind === 'KDT'
      ? [['Hồ sơ chủ trương', 160, '', (c) => (c.parent ? `<a class="link" data-go="${caseHref({ code: c.parent })}">${esc(c.parent)}</a>` : dash), (c) => c.parent || ''],
        ['Luồng khác chủ trương', 180, 'c', (c) => (c.lech ? badge(lechText(c), 'warning') : dash), (c) => lechText(c)]]
      : [['Phạm vi', 170, '', (c) => esc(scopeText(c)), (c) => scopeText(c)]];
    return [['Trạng thái', 180, 'c', (c) => badge(...CASE_ST[c.st]), (c) => CASE_ST[c.st][0]],
      ['Mã hồ sơ', 160, '', (c) => `<a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a>`, (c) => c.code],
      ['Mã KĐT', 160, '', (c) => `<a class="link" data-go="kdt/${encodeURIComponent(c.kdt)}">${esc(c.kdt)}</a>`, (c) => c.kdt]]
      .concat(own, [
        ['Tên hồ sơ', 320, '', (c) => clamp(c.title), (c) => c.title],
        ['Đề tài / dự án', 260, '', nvsCell, (c) => c.nvs.map((v) => K.nvText(v)).join('; ')],
        ['Loại hồ sơ', 190, '', (c) => esc(kindText(c)), kindText],
        ['Đơn vị đề xuất', 200, '', (c) => clamp(c.unit), (c) => c.unit],
        ['Nhóm KĐT', 200, '', (c) => (c.flow ? esc(D.kdtGroups[c.flow]) : dash), (c) => (c.flow ? D.kdtGroups[c.flow] : 'Chưa xác định')],
        ['Nhánh hồ sơ', 220, '', (c) => (c.branch ? esc(D.kdtBranches[c.branch]) : dash), (c) => (c.branch ? D.kdtBranches[c.branch] : '')],
        [kind === 'KDT' ? 'Tổng mức vốn KĐT (tỷ đồng)' : 'Tổng mức vốn (tỷ đồng)', 190, 'r num', (c) => (c.total != null ? ty(c.total) : dash), (c) => (c.total != null ? ty(c.total) : '')],
        ['Bước hiện tại', 240, '', (c) => clamp(c.step), (c) => c.step || ''],
        ['Số tờ trình', 150, '', (c) => { const t = K.ttOf(c); return t ? esc(t.no) : dash; }, (c) => { const t = K.ttOf(c); return t ? t.no : ''; }],
        ['Ngày tờ trình', 130, 'num', (c) => { const t = K.ttOf(c); return t ? esc(t.at) : dash; }, (c) => { const t = K.ttOf(c); return t ? t.at : ''; }],
        ['Ngày gửi thẩm định', 160, 'num', (c) => { const t = K.ttOf(c); return t ? esc(t.at) : dash; }, (c) => { const t = K.ttOf(c); return t ? t.at : ''; }],
        ['Người tạo', 170, '', (c) => clamp(c.creator), (c) => c.creator || ''],
        ['Ngày tạo', 130, 'num', (c) => esc(c.created || ''), (c) => c.created || ''],
        ['Ngày cập nhật', 140, 'num', (c) => esc(c.updated || ''), (c) => c.updated || '']]);
  }
  function infoOf(kind) {
    const notes = kind === 'KDT' ? [
      '<b>T45 (D-103, §1.7)</b>: màn danh sách <b>Hồ sơ phê duyệt KĐT</b> — chỉ hồ sơ loại Phê duyệt KĐT (tạo ở Chỉnh sửa KĐT › Tạo hồ sơ: chọn đúng 1 hồ sơ chủ trương đã phê duyệt, nhập Tổng mức vốn KĐT, luồng tính lại MS13 / MS14 / MS15). Khuôn profile-list như SCR-02.',
      'Cột <b>Hồ sơ chủ trương</b>: mã hồ sơ chủ trương mà hồ sơ KĐT kế thừa (mở Chi tiết hồ sơ). Cột <b>Luồng khác chủ trương</b>: luồng của chủ trương → luồng theo Tổng mức vốn KĐT khi hai luồng khác nhau (D-103 — cảnh báo ở form, hộp xác nhận lúc Lưu, tag trên hồ sơ); trùng luồng thì "-". Tìm kiếm nâng cao thêm hai trường này.',
      'Hồ sơ MS13 chạy từ bước 49 (thẩm định KĐT), kế thừa dữ liệu của hồ sơ chủ trương; hồ sơ MS14 là bản ghi tĩnh ở bước 46 (prototype chưa có luồng MS14 chạy được). Tổng mức vốn KĐT = giá trị nhập lúc tạo hồ sơ.',
    ] : [
      '<b>T45 (D-103, §1.7)</b>: màn danh sách <b>Hồ sơ chủ trương KĐT</b> — chỉ hồ sơ loại Phê duyệt chủ trương KĐT (MS13 bước 1–48 hai giai đoạn BM-01, hoặc 1–38 + 61–62 gộp BM-00). Cột / bộ lọc <b>Phạm vi</b>: Chủ trương (BM-01, sau khi duyệt KĐT ở "Đã phê duyệt chủ trương", lập tiếp hồ sơ phê duyệt KĐT) / Chủ trương và KĐT (gộp BM-00, duyệt xong KĐT "Đã phê duyệt").',
      'T16 B2: khuôn profile-list như Danh sách hồ sơ ĐXMS (SCR-02); cột Mã nhiệm vụ của source thay bằng <b>Mã KĐT</b>, thêm Nhóm KĐT, Nhánh hồ sơ (gộp BM-00 / hai giai đoạn), Tổng mức vốn thực tế.',
    ];
    return {
      scr: 'SCR-75', name: LIST[kind].title, uc: 'UC-05-01 · Backlog W1_T10 › Hồ sơ KĐT (dòng 307–309) · IA-DXMS dòng 19–21 (plan T31 K1, K2, K3; D-67, D-69) · T45 (D-103, D-104)',
      notes: notes.concat([
        '<b>T56 (review minhnh57 BA 12/11 #28, #35, #38; Phong BA #30):</b> Nhóm KĐT ghi <b>Đơn giản</b> / <b>Thông thường</b> / <b>Phức tạp</b> (không ghi mã MS13 / MS14 / MS15); Nhánh hồ sơ <b>BM00</b> / <b>BM01→BM03</b>; chưa xác định thì "-". Menu đổi tên <b>Chủ trương KĐT</b> / <b>Phê duyệt KĐT</b>.',
        'Hồ sơ là đối tượng con của KĐT (D-12). <b>T45 §1.7</b>: nút <b>Thêm mới</b> mở Thêm mới hồ sơ với Loại hồ sơ cố định theo danh sách, chọn Khoản đầu tư (như Hồ sơ ĐXMS › Thêm mới); vẫn tạo được từ Chỉnh sửa KĐT › Tạo hồ sơ. Mã hồ sơ mở Chi tiết hồ sơ KĐT; Mã KĐT mở Chi tiết KĐT.',
        'Nhóm KĐT do hệ thống xác định sau bước 12 (trước đó "Chưa xác định"). Không có cột Thao tác (D-43, team BA 30/10/2026); xử lý việc mở từ Việc của tôi.',
        '<b>T31 — theo IA-DXMS</b> (màn Thẩm định TTr, dòng 19–21; D-67): Tìm kiếm nâng cao thêm Khối đơn vị (Đơn vị đề xuất hiện theo khối), Người tạo, Mật, Ngày tạo, <b>Người thẩm định (CQCM)</b>, <b>Trạng thái với người thẩm định</b> (Chưa xem / Đang xem / Đã đồng ý / Yêu cầu sửa), Ngày thẩm định, Ngày tờ trình — điều kiện CQCM, tình trạng, ngày thẩm định cùng thỏa trên một CQCM; cột Số / Ngày tờ trình, Ngày gửi thẩm định, Người tạo, Ngày tạo; <b>Xuất Excel</b>.',
        '<b>T31 B2</b> (D-69) + <b>T45 (D-104)</b>: cột và bộ lọc <b>Đề tài / dự án</b> — KĐT có nhiều đề tài / dự án, cột liệt kê đủ, bộ lọc khớp khi KĐT có chứa đề tài đã chọn; mã mở Chi tiết đề tài / dự án (SCR-104).',
        'Giả lập: hồ sơ được tính là đã gửi thẩm định khi qua bước 24 (nhánh gộp, ký phiếu yêu cầu thẩm định BM-00) hoặc bước 45 (hai giai đoạn, mở vòng chủ trương BM-01); Số tờ trình cấp lúc đó (P-192); tình trạng hai CQCM mặc định (P-191). Thật: tình trạng suy từ việc Camunda của bước 27 / 29 / 46 / 55, Số tờ trình lấy từ văn bản đầu ra đã ký.',
      ]),
      q: ['P-190', 'P-191', 'P-192', 'P-201'], src: 'profile-management/profile-list · /khcn-profile-management',
    };
  }
  function caseList(kind) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html (như SCR-02 Danh sách hồ sơ ĐXMS)
    use(kind === 'KDT' ? 'KDT' : 'CT');
    const all = filtered(), cols = colsOf(K0);
    const pages = Math.max(1, Math.ceil(all.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const body = all.slice(from, from + L.size).map((c, i) => `<tr class="click" data-go="${caseHref(c)}" data-code="${esc(c.code)}"><td class="ord">${from + i + 1}</td>
        ${cols.map(([, , a, cell]) => `<td class="${a || ''}">${cell(c)}</td>`).join('')}</tr>`).join('');
    return `<div class="pg" data-hk-list="${K0}">
      ${S.head({ title: LIST[K0].title, info: infoOf(K0), right: `<button type="button" class="vbtn secondary" data-hk="export">${icon('excel')} Xuất Excel</button><button type="button" class="vbtn primary" data-hk-new data-go="${K0 === 'KDT' ? 'ho-so-pd-kdt' : 'ho-so-ct-kdt'}/create">${icon('add')} Thêm mới</button>` })}
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
  const onList = () => { const m = /^#\/ho-so-(ct|pd)-kdt\/?$/.exec(location.hash); if (m) use(m[1] === 'pd' ? 'KDT' : 'CT'); return !!m; };
  document.addEventListener('click', (e) => {
    if (!onList()) return;
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
    if (h.dataset.hk === 'export') {
      const cols = colsOf(K0);
      window.Kdt.csv(LIST[K0].file, [['STT'].concat(cols.map((x) => x[0]))].concat(filtered().map((c, i) => [i + 1].concat(cols.map((x) => x[4](c))))));
      return;
    }
    rerender();
  });
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-hk-adv]') && onList()) { e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); } });
  document.addEventListener('input', (e) => { const f = e.target.closest && e.target.closest('[data-hkf]'); if (f && onList()) L.d[f.dataset.hkf] = f.value; });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'hk-kw' || !onList()) return;
    L.kw = e.target.value.trim(); L.page = 1; rerender();
    const k = document.getElementById('hk-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-56 Chi tiết KĐT: tab riêng của KĐT ---------- */
  /* T45 (D-103): hồ sơ chủ trương (kind CT) giữ bước 1–48 (căn cứ, tồn kho, báo giá, phân loại, thẩm định chủ trương); hồ sơ phê duyệt KĐT (kind KDT) giữ 49+.
     ctCase = CT đang xử lý → đã duyệt → bản ghi CT bất kỳ; kdtCase = KDT đang xử lý → đã duyệt → bản ghi KDT gần nhất.
     Hồ sơ đại diện (mainCase): hồ sơ KĐT còn hiệu lực, không có thì hồ sơ chủ trương. */
  const ofKind = (g, k) => g.cases.filter((c) => kindOf(c) === k);
  const pick = (cs) => cs.find((c) => c.st === 'processing') || cs.find((c) => c.st === 'done') || cs[0] || null;
  const ctCase = (g) => pick(ofKind(g, 'CT'));
  const kdtCase = (g) => { const k = pick(ofKind(g, 'KDT')); return k && k.st !== 'stopped' ? k : null; };
  const mainCase = (g) => kdtCase(g) || ctCase(g);
  /* Hồ sơ KĐT đã qua bước n (49+): hồ sơ đang chạy luồng đọc nhật ký (đã gồm lịch sử kế thừa), hồ sơ mẫu suy theo bước đang chờ. */
  const kdtDid = (g, kc, n) => !!kc && (kc.live && g.live ? g.did(n) : kc.st === 'done' || (kc.st === 'processing' && kc.flow !== 'MS14' && (kc.task || 49) > n));
  /* Ai, khi nào xác nhận bước n: hồ sơ chạy luồng lấy nhật ký; hồ sơ mẫu suy theo ngày tạo. */
  const by = (g, n, who, off) => {
    if (!g.did(n)) return null;
    const h = g.live && Flow.lastOf(n);
    return h ? `${persona(h.who).name} · ${Flow.dateOf(h.t)}` : `${persona(who).name} · ${Y.addDays(g.pd.created, off)}`;
  };
  /* Ngưỡng phân luồng (SCR-40) chứa tổng mức vốn: dòng ngưỡng áp dụng (để hiện); nhóm lấy từ Flow.kdtLuong (cùng ngưỡng với cổng phân luồng, T45). */
  function classify(x, total) {
    const rs = D.kdtRules();
    const fits = (r) => (r.field === '*' || r.field === x.field) && (r.asset === '*' || r.asset === x.nature);
    const rule = total == null ? null : rs.find((r) => fits(r) && total >= r.from && (r.to == null || total < r.to)) || null;
    return { rule, group: total == null ? null : Flow.kdtLuong(x, total) };
  }
  /* Cấp thẩm quyền theo nhóm (QT-8.6.5 chú thích 7) — MS14 / MS15. MS13: theo bước 13 (danh mục Phân cấp thẩm quyền KĐT, D-33). */
  const LV = { VHT: 'Tổng Giám đốc VHT', TD: 'Tổng Giám đốc Tập đoàn' };
  const AUTH = {
    MS13: ['Tổng Giám đốc VHT', 'Tổng Giám đốc VHT'],
    MS14: ['Chủ tịch / Tổng Giám đốc Tập đoàn (HĐĐT tham mưu)', 'Thủ trưởng VHT (theo phân cấp)'],
    MS15: ['Chủ tịch / Tổng Giám đốc Tập đoàn (HĐĐT tham mưu)', 'Chủ tịch / Tổng Giám đốc Tập đoàn (HĐĐT tham mưu)'],
  };
  function tabPhanLoai(g) {
    const x = g.x, c = ctCase(g), kc = kdtCase(g);
    if (!c) return Y.emptyCard('Phân loại và định danh', 'KĐT chưa có hồ sơ. Hệ thống phân loại KĐT sau khi chốt tổng mức vốn thực tế (bước 10) và TTMS xác nhận 04 yếu tố (bước 12) của hồ sơ phê duyệt chủ trương KĐT.');
    const total = g.did(10) ? (c.total != null ? c.total : g.live ? D.caseInfo.total : null) : null;
    const k = classify(x, total);
    const group = c.flow || (g.did(12) ? k.group : null);
    const conf = by(g, 12, 'lan', 12);
    const fx = [['Lĩnh vực', cat('linh-vuc', x.field), 'Trường của KĐT (DMDC Lĩnh vực đầu tư)'], ['Loại KĐT', cat('loai-kdt', x.type), 'Trường của KĐT (DMDC Loại KĐT)'],
      ['Tính chất tài sản', cat('tinh-chat-tai-san', x.nature), 'Trường của KĐT (DMDC Tính chất tài sản)'],
      ['Mức giá trị (tổng mức vốn thực tế)', total != null ? ty(total, 2) + ' tỷ đồng' : '', 'Cơ sở giá của YCBG đạt (bước 10)']];
    const merge = [['Mức vốn thuộc MS13', group === 'MS13'], ['Tính chất tài sản: Nguyên chiếc', x.nature === 'NGUYEN_CHIEC'], ['Loại KĐT: Trang bị nội bộ', x.type === 'TBNB']];
    /* MS13: kết quả bước 13 — hồ sơ chạy luồng lấy biến cap; hồ sơ mẫu tính theo danh mục hiện hành. */
    const cap = group === 'MS13' ? ((g.live && Flow.state.vars.cap) || D.kdtAuthOf({ type: x.type, field: x.field }, total)) : null;
    const auth = cap ? [LV[cap.ct], LV[cap.kdt]] : group ? AUTH[group] : null;
    return card('04 yếu tố định danh', Y.table([['Yếu tố', 250], ['Giá trị', 260], ['Nguồn', 300], ['Xác nhận của TTMS', 170, 'c']], fx,
        (r, i) => `${Y.ord(i)}<td>${esc(r[0])}</td><td>${r[1] ? esc(r[1]) : dash}</td><td>${esc(r[2])}</td><td class="c">${conf ? badge('OK', 'success') : badge('Chưa xác nhận', 'default')}</td>`),
      conf ? `TTMS xác nhận: ${esc(conf)}` : 'TTMS xác nhận OK / NOT OK ở bước 12 trước khi dùng để phân luồng')
      + card('Kết quả phân loại', `<div class="ginfo c3">
          ${kv('Nhóm KĐT', group ? esc(D.kdtGroups[group]) : 'Chưa xác định')}${kv('Ngưỡng áp dụng', k.rule ? esc(`${k.rule.field === '*' ? 'Tất cả lĩnh vực' : cat('linh-vuc', k.rule.field)}: từ ${ty(k.rule.from, 0)}${k.rule.to != null ? ' đến dưới ' + ty(k.rule.to, 0) : ''} tỷ đồng`) : null)}
          ${kv('Nhánh hồ sơ', c.branch ? esc(D.kdtBranches[c.branch]) : null)}
          ${kv('Hình thành TSCĐ', g.did(11) ? 'Có' : null)}${kv('Ban Tài chính xác nhận', by(g, 11, 'thu', 11))}${kv('Hồ sơ chủ trương', `<a class="link-red" href="#/${caseHref(c)}">${esc(c.code)}</a>`)}
          ${kc ? kv('Hồ sơ phê duyệt KĐT', `<a class="link-red" href="#/${caseHref(kc)}">${esc(kc.code)}</a>`) + kv('Tổng mức vốn KĐT', kc.est != null ? ty(kc.est, 2) + ' tỷ đồng' : null)
    + kv('Luồng của hồ sơ KĐT', kc.flow ? esc(D.kdtProcs[kc.flow]) : null) + (kc.lech ? kv('Luồng khác chủ trương', `${badge(lechText(kc), 'warning')}`) : '') : ''}</div>`,
        c.st === 'moved' || c.replaces ? 'Tổng mức vốn thực tế không thuộc MS13 — hồ sơ đã chuyển luồng' : kc && kc.lech ? `Tổng mức vốn KĐT thuộc ${esc(kc.lech.to)}, khác luồng chủ trương ${esc(kc.lech.from)}` : '')
      + card('Điều kiện áp dụng hồ sơ gộp (BM-00)', Y.table([['Điều kiện', 420], ['Kết quả', 160, 'c']], group ? merge : [],
        (r, i) => `${Y.ord(i)}<td>${esc(r[0])}</td><td class="c">${r[1] ? badge('Đạt', 'success') : badge('Không đạt', 'default')}</td>`),
        group ? (merge.every((m) => m[1]) ? 'Đủ 03 điều kiện → gộp chủ trương và KĐT (BM-00)' : 'Không đủ 03 điều kiện → hai giai đoạn (BM-01 → BM-03)') : 'Xác định sau khi phân loại')
      + card('Cấp có thẩm quyền phê duyệt', `<div class="ginfo c3">${kv('Phê duyệt chủ trương KĐT', auth ? esc(auth[0]) : null, 'span2')}${kv('Nhóm KĐT', group ? esc(group) : null)}
          ${kv('Phê duyệt KĐT', auth ? esc(auth[1]) : null, 'span2')}${kv('KPI thời gian phê duyệt', group ? { MS13: '≤ 10 ngày làm việc', MS14: '≤ 20 ngày làm việc', MS15: '≤ 35 ngày làm việc' }[group] : null)}
          ${cap ? kv('Căn cứ phân cấp', esc(cap.basis), 'span3') : ''}</div>`, cap ? 'Hệ thống xác định sau khi đủ hai xác nhận, tính lại trước khi trình ký' : '');
  }
  /* Vòng thẩm định và bước chọn CQCM (MS13 bản 12/10): gộp BM-00 → bước 22; hai giai đoạn → chủ trương bước 41, KĐT bước 52.
     CQCM chủ trì xác nhận danh sách ở bước kế tiếp (23 / 42 / 53). */
  function tabThanhPhan(g) {
    const c = ctCase(g), kc = kdtCase(g);
    const cq = (g.ref.cqcm || ['TC', 'PC']).map((id) => cqcmUnit(id)).filter(Boolean);
    /* Vòng chủ trương / gộp trên hồ sơ chủ trương; vòng KĐT (52) trên hồ sơ phê duyệt KĐT. */
    const st = !c ? [] : (c.branch === 'BM00' ? [['Thẩm định hồ sơ gộp (BM-00)', 22, c]] : c.branch === '2GD' ? [['Thẩm định chủ trương (BM-01)', 41, c]].concat(kc ? [['Thẩm định KĐT (BM-03)', 52, kc]] : []) : []);
    const rows = st.filter(([, n, h]) => (h === kc ? kdtDid(g, kc, n) : g.did(n))).map(([name, n, h]) => ({ name, n, h, at: by(g, n, 'minh', n) }));
    return card('CQCM tham gia thẩm định', Y.table([['Giai đoạn', 260], ['CQCM chủ trì', 200], ['CQCM phối hợp', 300], ['Đơn vị đề xuất chọn', 220], ['CQCM chủ trì xác nhận', 200, 'c']], rows,
        (r, i) => `${Y.ord(i)}<td>${esc(r.name)}</td><td>Trung tâm Mua sắm</td><td>${clamp(cq.join(', '))}</td><td>${esc(r.at)}</td><td class="c">${(r.h === kc ? kdtDid(g, kc, r.n + 1) : g.did(r.n + 1)) || !(r.h.st === 'processing' && r.h.task === r.n) ? badge('Đã xác nhận', 'success') : badge('Chờ xác nhận', 'warning')}</td>`),
      'Đơn vị đề xuất chọn CQCM theo tính chất KĐT; CQCM chủ trì (TTMS) xác nhận danh sách trước khi thẩm định')
      + card('Đầu mối xử lý hồ sơ', Y.table([['Vai trò', 260], ['Đơn vị', 260], ['Người thực hiện', 220]], c ? [['Đơn vị đề xuất KĐT', g.x.unit, c.creator || g.x.creator], ['Cơ quan chủ trì thẩm định', 'Trung tâm Mua sắm', persona('lan').name], ['Xác nhận hình thành TSCĐ', 'Ban Tài chính', persona('thu').name]] : [],
        (r, i) => `${Y.ord(i)}<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2] || '')}</td>`));
  }
  const DOC = { 'BM-00': 'Hồ sơ chủ trương và KĐT (văn bản gộp)', 'BM-01': 'Tờ trình phê duyệt chủ trương KĐT', 'BM-14': 'Báo cáo kết quả thẩm định KĐT', 'BM-18': 'Quyết định phê duyệt KĐT' };
  /* T45 (D-103): Kết quả phê duyệt chủ trương (hồ sơ CT — BM-01, hoặc BM-00 khi gộp) và Kết quả phê duyệt KĐT (hồ sơ KĐT — BM-14, BM-18; gộp: BM-00 duyệt cả KĐT). */
  function tabKetQua(g) {
    const x = g.x, m = window.Kdt.meta(x);
    const docs = [];
    m.hs.forEach((c) => (c.docs || []).forEach(([code, at]) => docs.push({ code, at, c })));
    const cts = m.hs.filter((c) => kindOf(c) === 'CT'), kds = m.hs.filter((c) => kindOf(c) === 'KDT');
    const ctDone = cts.find((c) => c.st === 'done') || null, stop = m.hs.find((c) => c.st === 'stopped');
    const gop = !!(ctDone && ctDone.scope === 'CT_KDT');
    const kdDone = kds.find((c) => c.st === 'done') || (gop ? ctDone : null);
    const kdOn = kds.find((c) => c.st === 'processing') || null;
    const ctDoc = docs.find((d) => kindOf(d.c) === 'CT' && (d.code === 'BM-01' || d.code === 'BM-00'));
    const no = (d) => `${String(400 + (Number(d.c.code.replace(/-\d$/, '').slice(-4)) * 13 + d.code.length * 7) % 500).padStart(4, '0')}/${d.code === 'BM-14' ? 'BC-TTMS' : d.code === 'BM-01' ? 'TTr-VHT' : 'QĐ-VHT'}`;
    const qd = kdDone ? docs.filter((d) => d.c.code === kdDone.code && (d.code === 'BM-18' || d.code === 'BM-00')).pop() || null : null;
    const bc = kdDone ? docs.filter((d) => d.c.code === kdDone.code && d.code === 'BM-14').pop() || null : null;
    const plans = window.Thau.khBy('KDT', x.code);
    const fund = (g.demo && g.demo.caseInfo && g.demo.caseInfo.fund) || cat('nguon-von', x.type === 'KHCN' ? 'KHCN' : x.type === 'TBNB' ? 'DTPT' : 'SXKD');
    const hsLink = (c) => (c ? `<a class="link-red" href="#/${caseHref(c)}">${esc(c.code)}</a>` : null);
    const ctSt = ctDone ? badge('Đã phê duyệt', 'success') : stop && kindOf(stop) === 'CT' ? badge('Dừng theo chỉ đạo', 'default') : badge('Chưa phê duyệt', 'default');
    const kdSt = kdDone ? badge('Đã phê duyệt', 'success') : kdOn ? badge('Đang xử lý', 'info') : badge('Chưa phê duyệt', 'default');
    const kdCap = kdDone ? (kdDone.flow === 'MS13' ? LV[(D.kdtAuthOf({ type: x.type, field: x.field }, kdDone.total) || {}).kdt] || LV.VHT : (AUTH[kdDone.flow] || AUTH.MS13)[1]) : null;
    const kdRef = gop ? null : kdDone || kdOn || kds[0] || null;
    return card('Kết quả phê duyệt chủ trương', `<div class="ginfo c3">
        ${kv('Chủ trương KĐT', ctSt)}${kv('Văn bản chủ trương', ctDoc ? `${esc(ctDoc.code)} ${esc(DOC[ctDoc.code])} · ${esc(ctDoc.at)}` : null, 'span2')}
        ${kv('Hồ sơ chủ trương', hsLink(ctDone || cts[0]))}${kv('Phạm vi', ctDone || cts[0] ? esc(scopeText(ctDone || cts[0])) : null)}${kv('Tổng mức vốn chủ trương', ctDone && ctDone.total != null ? ty(ctDone.total, 2) + ' tỷ đồng' : null)}</div>`,
        gop ? 'Hồ sơ gộp BM-00: phê duyệt chủ trương và KĐT cùng lúc' : ctDone ? 'Lập hồ sơ phê duyệt KĐT từ hồ sơ chủ trương đã phê duyệt' : '')
      + card('Kết quả phê duyệt KĐT', `<div class="ginfo c3">
        ${kv('Khoản đầu tư', kdSt)}${kv('Quyết định phê duyệt KĐT', qd ? `${esc(no(qd))} · ${esc(qd.at)}` : null, 'span2')}
        ${kv('Hồ sơ phê duyệt KĐT', gop ? hsLink(ctDone) : hsLink(kdRef))}${kv('Báo cáo thẩm định KĐT', bc ? `${esc(no(bc))} · ${esc(bc.at)}` : null)}${kv('Luồng khác chủ trương', kdRef && kdRef.lech ? badge(lechText(kdRef), 'warning') : null)}
        ${kv('Tổng mức vốn được duyệt', kdDone && kdDone.total != null ? ty(kdDone.total, 2) + ' tỷ đồng' : null)}${kv('Nguồn vốn được duyệt', kdDone ? esc(fund) : null)}${kv('Cấp phê duyệt', kdCap ? esc(kdCap) : null)}</div>`,
        gop ? 'Phê duyệt cùng chủ trương (BM-00)' : '')
      /* [12/11 chuyển sang tab Tài liệu & văn bản] card Văn bản đầu ra (Văn bản, Số văn bản, Hồ sơ, Loại hồ sơ, Ngày ký, Tệp). */
      + (stop ? card('Chỉ đạo dừng / bàn giao xử lý', `<div class="ginfo c3">${kv('Hồ sơ', `<a class="link-red" href="#/${caseHref(stop)}">${esc(stop.code)}</a>`)}${kv('Ngày', esc(stop.updated))}${kv('Người chỉ đạo', 'Thủ trưởng VHT')}
          ${kv('Nội dung chỉ đạo', 'Không ký chủ trương; dừng KĐT do nhu cầu đã được đáp ứng bằng thiết bị điều chuyển nội bộ. Bàn giao ' + esc(x.unit) + ' rà soát lại nhu cầu năm 2027.', 'span3')}</div>`) : '')
      + card('Triển khai mua sắm', Y.table([['Mã KHLCNT', 170], ['Tên KHLCNT', 360], ['Số gói thầu', 110, 'c'], ['Trạng thái', 200, 'c']], plans,
        (k, i) => `${Y.ord(i)}<td><a class="link" data-go="khlcnt/${encodeURIComponent(k.code)}">${esc(k.code)}</a></td><td>${clamp(k.title)}</td><td class="c">${window.Thau.pkgsOf(k).length}</td><td class="c">${badge(...window.Thau.khStLabel(k))}</td>`),
        kdDone ? 'BM-18 / BM-00 là căn cứ lập kế hoạch lựa chọn nhà thầu' : 'Lập KHLCNT sau khi KĐT được phê duyệt');
  }

  const TAB_LIST = [['info', 'Thông tin chung'], ['can-cu', 'Căn cứ & hạng mục'], ['ton-kho', 'Rà soát tồn kho'], ['ycbg', 'Yêu cầu báo giá'],
    ['phan-loai', 'Phân loại & định danh'], ['tai-lieu', 'Tài liệu & văn bản'], ['thanh-phan', 'Thành phần tham gia'], ['ket-qua-kdt', 'Kết quả & triển khai']];
  const TAB_INFO = [
    'Tab theo Backlog W1_T10 › Quản lý KĐT (T16 B2): app-tabs như Chi tiết ĐXMS; tab Thông tin chung giữ bố cục task-create mode detail. Các tab khác chỉ xem — dữ liệu do các bước MS13 ghi (S2, S4).',
    'Căn cứ & hạng mục (bước 1, 5), Rà soát tồn kho (bước 6, 7), Yêu cầu báo giá (bước 8–10): cùng cơ chế với ĐXMS (B1) — cần dev bảng giữ chỗ căn cứ, API giữ chỗ tồn kho + snapshot, bảng YCBG.',
    'Phân loại & định danh: 04 yếu tố (3 trường của KĐT + tổng mức vốn thực tế), xác nhận TSCĐ (bước 11, Ban Tài chính), xác nhận 04 yếu tố (bước 12, TTMS); nhóm theo Ngưỡng phân luồng (SCR-40); 3 điều kiện gộp BM-00; cấp thẩm quyền MS13 = kết quả bước 13 theo danh mục Phân cấp thẩm quyền KĐT (SCR-100, D-33, giả lập P-90); MS14 / MS15 theo QT-8.6.5 (chú thích 7: chủ trương KĐT thông thường / phức tạp do Chủ tịch / TGĐ Tập đoàn quyết định, HĐĐT tham mưu).',
    'Thành phần tham gia: CQCM phối hợp do ĐVĐX chọn ở bước 22 (gộp) hoặc 41 / 52 (hai giai đoạn), CQCM chủ trì xác nhận danh sách ở bước 23 / 42 / 53 (BPMN 12/10). Backlog "Quản lý Tổ chuyên gia" của KĐT: MS13 không có bước lập Tổ chuyên gia — Tổ chuyên gia hiện ở Gói thầu (P-75).',
    'Kết quả & triển khai: kết quả phê duyệt chủ trương (BM-01 / BM-00), Quyết định phê duyệt KĐT (BM-18 / BM-00), tổng mức vốn và nguồn vốn được duyệt, chỉ đạo dừng (hồ sơ Dừng theo chỉ đạo), KHLCNT lập từ KĐT. Nút Lập KHLCNT trên hàng tiêu đề khi KĐT đã phê duyệt.',
    '<b>T45 (D-103)</b>: KĐT có hai hồ sơ. Căn cứ & hạng mục, Rà soát tồn kho, Yêu cầu báo giá, Phân loại & định danh (bước 1–12) đọc <b>hồ sơ chủ trương</b>; Phân loại thêm Hồ sơ phê duyệt KĐT, Tổng mức vốn KĐT và luồng tính lại theo Tổng mức vốn KĐT (Flow.kdtLuong — cùng ngưỡng với cổng phân luồng), tag Luồng khác chủ trương khi lệch. Thành phần tham gia: vòng chủ trương (41) / gộp (22) trên hồ sơ chủ trương, vòng KĐT (52) trên hồ sơ phê duyệt KĐT. Kết quả tách hai card: <b>Kết quả phê duyệt chủ trương</b> (BM-01, gộp BM-00) và <b>Kết quả phê duyệt KĐT</b> (BM-14, BM-18; gộp: BM-00 duyệt cả KĐT); Văn bản đầu ra có cột Loại hồ sơ.',
  ];
  /* Tab Tài liệu & văn bản (người dùng 12/11: "giống Đề xuất mua sắm"): như tab cùng tên của Chi tiết ĐXMS — Văn bản đầu ra, Danh sách tài liệu,
     khối Trình ký — gom từ mọi hồ sơ của KĐT (chủ trương + phê duyệt KĐT), nên thêm cột Hồ sơ, Loại hồ sơ. Dữ liệu từng hồ sơ như Chi tiết hồ sơ (SCR-20). */
  function tabTaiLieu(g) {
    const x = g.x, hs = window.Kdt.meta(x).hs;
    const vms = hs.map((c) => ({ c, vm: S.kdtCaseVm(c.code) })).filter((o) => o.vm);
    const outs = vms.flatMap(({ c, vm }) => (vm.outs || []).map((r) => Object.assign({ c }, r)));
    /* Hồ sơ phê duyệt KĐT kế thừa tệp căn cứ / tồn kho / báo giá của hồ sơ chủ trương → mỗi tệp một dòng, ghi theo hồ sơ chủ trương (hồ sơ gốc). */
    const seen = new Set(), files = vms.slice().sort((p, q) => (kindOf(p.c) === 'CT' ? 0 : 1) - (kindOf(q.c) === 'CT' ? 0 : 1))
      .flatMap(({ c, vm }) => (vm.files || []).map((r) => Object.assign({ c }, r))).filter((r) => !seen.has(r.name) && seen.add(r.name));
    const dl = (name, label) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" data-dl="${esc(name)}">${icon(label === 'Tải xuống PDF' ? 'file' : 'download')}</button>`;
    const pdf = (name) => String(name).replace(/\.(docx?|xlsx?|pdf)$/i, '') + '.pdf';
    const hsCells = (c) => `<td><a class="link" data-go="${caseHref(c)}">${esc(c.code)}</a></td><td>${esc(kindText(c))}</td>`;
    /* [T72 #80, #81, D-122 Q3] như Chi tiết ĐXMS: bỏ cột Trạng thái và nút Tải xuống PDF (dl(pdf(r.name), …)); giữ Hồ sơ, Loại hồ sơ vì KĐT có hai hồ sơ. */
    void pdf;
    return card('Văn bản đầu ra', Y.table([['Thao tác', 100, 'c'], ['Văn bản', 300], ['Hồ sơ', 150], ['Loại hồ sơ', 200], ['Ngày', 110]], outs,
        (r, i) => `${Y.ord(i)}<td class="c"><div class="acts">${dl(r.name, 'Tải xuống')}</div></td>
          <td><button type="button" class="link-btn" data-preview-doc="${esc(r.name)}|${esc(r.at)}|${esc(r.c.code)}">${esc(r.name)}</button></td>${hsCells(r.c)}
          <td class="num">${esc(r.at || '')}</td>`))
      + card('Danh sách tài liệu', Y.table([['Thao tác', 100, 'c'], ['Tên tài liệu', 300], ['Hồ sơ', 150], ['Loại hồ sơ', 200], ['Ngày tạo', 110]], files,
        (r, i) => `${Y.ord(i)}<td class="c">${dl(r.name, 'Tải xuống')}</td><td>${clamp(r.name)}</td>${hsCells(r.c)}<td class="num">${esc(r.at || '')}</td>`))
      + window.TrinhKy.block(x.code, { pad: true });
  }
  const tabOpt = { list: TAB_LIST, bodies: { 'phan-loai': tabPhanLoai, 'tai-lieu': tabTaiLieu, 'thanh-phan': tabThanhPhan, 'ket-qua-kdt': tabKetQua } };

  window.KdtB2 = { caseList, listOf, kindText, scopeText, lechText, tabOpt, TAB_INFO };
})();
