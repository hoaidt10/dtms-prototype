/* PH09 Khoản đầu tư (plan docs/dtms/prototype-KDT-chuan-bi.md v0.3, B1–B2).
   KĐT là đối tượng cha (D-12, như ĐXMS ↔ Hồ sơ và Nhiệm vụ ↔ Hồ sơ của KHCN): SCR-54 danh sách #/kdt, SCR-55 thêm mới / chỉnh sửa
   #/kdt/create, #/kdt/<mã>/edit (không start quy trình), SCR-56 chi tiết #/kdt/<mã>. Hồ sơ Phê duyệt KĐT tạo ở Chỉnh sửa › Tạo hồ sơ
   (#/kdt/<mã>/tao-ho-so — khuôn SCR-25), Lưu = start instance MS13; nhóm MS13 / MS14 / MS15 do hệ thống xác định sau bước 11 ‖ 12 (D-7).
   SCR-66 #/kdt/<mã>/chuyen-luong: thông báo hồ sơ chuyển luồng MS14 (P-53). Layout theo task-management. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, persona, ty, vSelect, badge, pager, norm, toast } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => window.Screens.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" ${attrs}>${icon(ic)}</button>`;
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v || '-'}</div></div>`;
  const table = (cols, rows, cell, empty) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r)}</tr>`).join('') : `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${empty || 'Chưa có dữ liệu'}</td></tr>`}</tbody></table></div>`;
  const href = (code) => 'kdt/' + encodeURIComponent(code);

  /* Nhãn danh mục (DMDC SCR-33/34/35); ô chọn chỉ có bản ghi đang hoạt động, trừ giá trị KĐT đang giữ. */
  const CAT = { field: 'linh-vuc', type: 'loai-kdt', nature: 'tinh-chat-tai-san' };
  const catLabel = (k, code) => { const r = window.Catalog.rows(CAT[k]).find((x) => x.code === code); return r ? r.name : code || ''; };
  /* D-45: KĐT xuất phát từ nhiệm vụ / đề tài, dự án của Kế hoạch năm — cùng danh sách D.nhiemVu với ĐXMS (SCR-28). */
  const nvText = (c) => { const n = c && D.nvOf(c); return n ? `${n.code} — ${n.name}` : ''; };
  /* T31 B2 (D-69): nhãn "Đề tài / dự án", mã mở Chi tiết đề tài / dự án (SCR-104), như màn ĐXMS (D-66). */
  const nvLink = (c) => (nvText(c) ? `<a class="link" data-go="${window.DeTai.href(c)}">${esc(nvText(c))}</a>` : null);
  const nvOptions = (kind) => D.nhiemVu.map((n) => ({ value: n.code, label: kind ? `${n.code} — ${n.name} (${n.kind})` : `${n.code} — ${n.name}` }));
  const catOptions = (k, cur) => window.Catalog.rows(CAT[k]).filter((r) => r.active || r.code === cur).map((r) => ({ value: r.code, label: r.name }));
  const UNITS = [...new Set(D.personas.slice(0, 1).map((p) => p.unit).concat(D.kdtList.map((x) => x.unit), D.dxmsList.map((x) => x.unit)))];

  /* ---------- Trạng thái KĐT suy từ hồ sơ (§4.1). Bước → trạng thái theo cụm của BPMN MS13 (§1.2). ---------- */
  const KDT_STAGE = {
    NEW: ['Chưa có hồ sơ', 'default'], LAP: ['Đang lập', 'info'], PL: ['Chờ xác nhận phân loại', 'info'],
    GOP: ['Đang lập hồ sơ gộp', 'info'], TDGOP: ['Đang thẩm định hồ sơ gộp', 'info'],
    CT: ['Đang lập chủ trương', 'info'], TDCT: ['Đang thẩm định chủ trương', 'info'], KYCT: ['Chờ ký chủ trương', 'warning'],
    HS: ['Đang lập hồ sơ KĐT', 'info'], TDKDT: ['Đang thẩm định KĐT', 'info'], KYQD: ['Chờ ký quyết định', 'warning'], KYGOP: ['Chờ ký hồ sơ gộp', 'warning'],
    OK: ['Đã phê duyệt', 'success'], MS14: ['Chuyển MS14', 'warning'], STOP: ['Dừng theo chỉ đạo', 'default'],
    TD: ['Đang trình Tập đoàn', 'warning'], TDTD: ['Tập đoàn thẩm định, phê duyệt', 'warning'],
  };
  const stageBadge = (s) => badge(KDT_STAGE[s][0], KDT_STAGE[s][1]);
  const CASE_ST = { processing: ['Đang xử lý', 'info'], done: ['Hoàn thành', 'success'], moved: ['Đã chuyển luồng', 'warning'], stopped: ['Dừng theo chỉ đạo', 'default'] };
  const GROUP = D.kdtGroups;
  const BRANCH = D.kdtBranches;

  /* Tên bước: MS13 từ BPMN_FLOWS (trang MS13); MS14 từ sơ đồ trang MS14. Hồ sơ chưa xác định nhóm đi phần đầu MS13 (bước 1–12). */
  function stepName(c) {
    if (c.st !== 'processing') return '';
    const ks = c.tasks || [c.task];
    if (c.flow === 'MS14') {
      const g = (window.BPMN_DIAGRAMS || {})['MS14'];
      const n = g && g.nodes.find((x) => x.k === 'task' && String(x.t) === String(c.task));
      return n ? n.name : '';
    }
    const T = window.BPMN_FLOWS.MS13.tasks;
    return ks.map((k) => (T[k] || {}).name).filter(Boolean).join(', ');
  }
  const flowLabel = (c) => (c.flow ? GROUP[c.flow] : 'Chưa xác định nhóm');

  function meta(x) {
    const hs = Flow.kdtCases().filter((c) => c.kdt === x.code).map((c) => Object.assign({ title: x.title }, c));
    const run = hs.find((c) => c.st === 'processing');
    const done = hs.find((c) => c.st === 'done');
    const last = run || done || hs[0];
    const stage = last ? last.stage : 'NEW';
    return { hs, stage, group: last ? last.flow : null, branch: last ? last.branch : null, value: done ? done.total : x.est, approved: !!done, main: last || null };
  }
  const rowsAll = () => Flow.kdtAll().map((x) => Object.assign({}, x, meta(x)));

  /* ---------- T31 K1, K2 — trường theo IA-DXMS dòng 10–12, 19–21 (plan prototype-T31-kdt-ia-chuan-bi.md §3; D-67). ----------
     Giả lập dùng chung với ĐXMS (T29): Khối đơn vị P-190, tình trạng từng CQCM P-191, Số / Ngày tờ trình P-192.
     Thật: BE thêm tham số lọc cho API danh sách KĐT / hồ sơ KĐT; tình trạng CQCM suy từ việc Camunda của bước thẩm định 27 / 29 / 46 / 55. */
  const toTime = (s) => { const [d, m, y] = String(s || '').split('/').map(Number); return new Date(y, m - 1, d).getTime(); };
  const dk = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}${m[2].padStart(2, '0')}${m[1].padStart(2, '0')}` : ''; };
  const addDays = (s, k) => { const d = new Date(toTime(s)); d.setDate(d.getDate() + k); return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  function workDays(a, b) {
    let n = 0;
    for (let d = new Date(toTime(a)); d.getTime() < toTime(b); d.setDate(d.getDate() + 1)) if (d.getDay() % 6) n += 1;
    return n;
  }
  /* Hồ sơ đã gửi thẩm định khi qua bước mở vòng đầu tiên: nhánh gộp ký phiếu yêu cầu thẩm định BM-00 ở bước 24, hai giai đoạn mở vòng chủ trương BM-01 ở bước 45. */
  const sentStep = (c) => (c.branch === 'BM00' ? 24 : 45);
  function sentAt(c) {
    if (!c || c.kind === 'DC') return null;
    const reached = c.st === 'done' || (c.st === 'stopped' && !!c.branch) || (c.st === 'processing' && c.flow === 'MS13' && (c.task || 0) >= sentStep(c));
    if (!reached) return null;
    return addDays(c.created, Math.round(Math.max(4, workDays(c.created, c.updated)) * 0.4));
  }
  const RV_TONE = { 'Chưa xem': 'default', 'Đang xem': 'info', 'Đã đồng ý': 'success', 'Yêu cầu sửa': 'warning' };
  /* Tình trạng của từng CQCM với hồ sơ (GIẢ LẬP P-191): hai CQCM mặc định; hồ sơ đang ở giai đoạn thẩm định thì CQCM thứ hai Đang xem. */
  function reviewOf(c) {
    const sent = sentAt(c);
    if (!sent) return [];
    const open = c.st === 'processing' && /^TD/.test(c.stage || '');
    return ['PC', 'TC'].map((id, i) => {
      const q = D.cqcm.find((x) => x.id === id), at = open && i ? null : addDays(sent, 3 + i * 2);
      const st = open && i ? 'Đang xem' : (Number(c.code.slice(-1)) + i) % 3 === 0 ? 'Yêu cầu sửa' : 'Đã đồng ý';
      return { id, unit: q.unit, who: persona(q.doer).name, st, sent, at };
    });
  }
  /* Số, Ngày tờ trình — cấp khi gửi thẩm định (GIẢ LẬP P-192). Ký hiệu đơn vị = chữ đầu các từ. */
  const unitSign = (u) => (u || '').split(/\s+/).map((w) => w[0]).join('').toUpperCase();
  const ttOf = (c, unit) => { const at = sentAt(c); return at ? { no: `${c.code.slice(-3)}/TTr-${unitSign(unit || c.unit)}`, at } : null; };
  const unitsOf = (block) => UNITS.filter((u) => !block || D.blockOf(u) === block);
  const creatorsOf = (rows) => [...new Set(rows.map((x) => x.creator).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
  /* Nhóm trạng thái (IA dòng 10): Đang trong quá trình thực hiện / Không trong quá trình thực hiện (chưa có hồ sơ, đã phê duyệt, dừng). */
  const STAGE_IDLE = ['NEW', 'OK', 'STOP'];
  const STAGE_GROUP = { run: 'Đang trong quá trình thực hiện', idle: 'Không trong quá trình thực hiện' };
  const inDate = (v, from, to) => (!from || (v && dk(v) >= dk(from))) && (!to || (v && dk(v) <= dk(to)));
  const csv = (name, lines) => {
    const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = name;
    a.click();
    toast('<b>Thành công</b><br>Xuất file thành công');
  };

  /* ---------- SCR-54 Danh sách KĐT ---------- */
  const emptyFilter = () => ({ code: '', title: '', nv: null, block: null, unit: null, creator: null, field: null, type: null, group: [], stGroup: null, stage: [], secret: null, from: '', to: '' });
  const L = { kw: '', adv: false, f: emptyFilter(), d: emptyFilter(), page: 1, size: 10, psOpen: false };
  function filtered() {
    const f = L.f;
    return rowsAll().filter((x) => (!L.adv
      ? !L.kw || norm(x.code + ' ' + x.title).includes(norm(L.kw))
      : (!f.code || norm(x.code).includes(norm(f.code))) && (!f.title || norm(x.title).includes(norm(f.title))) && (!f.nv || x.nv === f.nv) && (!f.unit || x.unit === f.unit)
        && (!f.field || x.field === f.field) && (!f.type || x.type === f.type) && (!f.group.length || f.group.includes(x.group || 'NONE'))
        && (!f.stage.length || f.stage.includes(x.stage))
        && (!f.block || D.blockOf(x.unit) === f.block) && (!f.creator || x.creator === f.creator) && (!f.secret || (f.secret === 'Có') === !!x.secret)
        && (!f.stGroup || (f.stGroup === 'idle') === STAGE_IDLE.includes(x.stage)) && inDate(x.created, f.from, f.to)));
  }
  function advPanel() {
    const d = L.d;
    const set = (k) => (v) => { d[k] = v; rerender(); };
    const txt = (k, label, ph) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-kf="${k}" maxlength="${ph ? 10 : 255}" ${ph ? `placeholder="${ph}"` : ''} value="${esc(d[k])}"></div>`;
    const sel = (k, label, o) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: 'kf-' + k, value: d[k], clear: true, searchable: true, onChange: set(k) }, o))}</div>`;
    return `<form class="adv" data-kdt-adv>
      <div class="grid3">
        ${txt('code', 'Mã KĐT')}${txt('title', 'Tên KĐT')}
        ${sel('nv', 'Đề tài / dự án', { placeholder: 'Chọn đề tài / dự án', options: nvOptions() })}
        ${sel('block', 'Khối đơn vị', { searchable: false, placeholder: 'Chọn khối đơn vị', options: D.blocks.map((b) => ({ value: b, label: b })),
    onChange: (v) => { d.block = v; if (d.unit && D.blockOf(d.unit) !== v) d.unit = null; rerender(); } })}
        ${sel('unit', 'Đơn vị đề xuất', { options: unitsOf(d.block).map((u) => ({ value: u, label: u })) })}
        ${sel('creator', 'Người tạo', { placeholder: 'Chọn người tạo', options: creatorsOf(Flow.kdtAll()).map((u) => ({ value: u, label: u })) })}
        ${sel('field', 'Lĩnh vực', { searchable: false, options: catOptions('field') })}
        ${sel('type', 'Loại KĐT', { options: catOptions('type') })}
        ${sel('group', 'Nhóm KĐT', { multi: true, searchable: false, options: [{ value: 'NONE', label: 'Chưa xác định' }].concat(Object.entries(GROUP).map(([v, label]) => ({ value: v, label }))) })}
        ${sel('stGroup', 'Nhóm trạng thái', { searchable: false, placeholder: 'Tất cả', options: Object.entries(STAGE_GROUP).map(([value, label]) => ({ value, label })) })}
        ${sel('stage', 'Trạng thái', { multi: true, options: Object.entries(KDT_STAGE).map(([v, s]) => ({ value: v, label: s[0] })) })}
        ${sel('secret', 'Mật', { searchable: false, placeholder: 'Tất cả', options: ['Có', 'Không'].map((p) => ({ value: p, label: p })) })}
        ${txt('from', 'Ngày tạo từ', 'DD/MM/YYYY')}${txt('to', 'Ngày tạo đến', 'DD/MM/YYYY')}
      </div>
      <div class="acts"><button type="button" class="vbtn secondary" data-kl="reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
  }

  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (như SCR-27 Danh sách ĐXMS)
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const cols = [['Thao tác', 100, 'c'], ['Trạng thái', 200, 'c'], ['Mã KĐT', 150], ['Tên KĐT', 320], ['Đề tài / dự án', 280], ['Đơn vị đề xuất', 200], ['Loại KĐT', 170],
      ['Nhóm KĐT', 170], ['Tổng mức vốn (tỷ đồng)', 170, 'r'], ['Ngày gửi thẩm định', 160], ['Người tạo', 170], ['Ngày tạo', 130], ['Ngày cập nhật', 140]];
    const body = rows.slice(from, from + L.size).map((x, i) => { const sent = sentAt(x.main); return `<tr class="click" data-go="${href(x.code)}" data-code="${esc(x.code)}">
        <td class="ord">${from + i + 1}</td><td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-go="${href(x.code)}/edit"`)}${x.stage === 'NEW' ? `<span class="sep"></span>${iconBtn('del', 'Xoá', `data-del-kdt="${esc(x.code)}"`)}` : ''}</div></td>
        <td class="c">${stageBadge(x.stage)}</td><td><a class="link" data-go="${href(x.code)}">${esc(x.code)}</a></td><td>${clamp(x.title)}</td><td>${nvText(x.nv) ? `<span class="clamp">${nvLink(x.nv)}</span>` : dash}</td><td>${clamp(x.unit)}</td>
        <td>${clamp(catLabel('type', x.type))}</td><td>${x.group ? esc(x.group) : '<span class="faint">Chưa xác định</span>'}</td>
        <td class="r num">${x.value != null ? ty(x.value) : dash}</td><td class="num">${sent ? esc(sent) : dash}</td><td>${clamp(x.creator)}</td><td class="num">${esc(x.created || '')}</td><td class="num">${esc(x.updated)}</td></tr>`; }).join('');
    const info = {
      scr: 'SCR-54', name: 'Danh sách khoản đầu tư', uc: 'UC-05-01 · WBS PH09 #172, 173 · UR-COM-01, UR-COM-09 · IA-DXMS dòng 10–12 (plan T31 K1, K2; D-67)',
      notes: [
        '<b>KĐT là đối tượng cha</b> (D-12), như ĐXMS: mỗi KĐT có các hồ sơ — hồ sơ <b>Phê duyệt KĐT</b> (MS13 / MS14 / MS15) và sau này hồ sơ Điều chỉnh KĐT. Bố cục theo task-management (như Danh sách ĐXMS).',
        'Thêm mới chỉ tạo KĐT, <b>không khởi tạo quy trình</b>; không chọn quy trình (D-7). Hồ sơ tạo ở Chỉnh sửa KĐT › Danh sách hồ sơ › Tạo hồ sơ.',
        'Trạng thái KĐT suy từ hồ sơ đang xử lý (hoặc hồ sơ Hoàn thành gần nhất): Đang lập → Chờ xác nhận phân loại → nhánh gộp (Đang lập / thẩm định hồ sơ gộp) hoặc hai giai đoạn (chủ trương → hồ sơ KĐT) → Chờ ký quyết định → Đã phê duyệt; Chuyển MS14; Dừng theo chỉ đạo.',
        '<b>Nhóm KĐT</b> (MS13 / MS14 / MS15) do hệ thống xác định sau khi TTMS xác nhận 04 yếu tố (bước 12) — trước đó hiện "Chưa xác định". Tổng mức vốn = của hồ sơ Hoàn thành gần nhất, chưa có thì là tổng mức vốn dự kiến.',
        'Khác source: thêm <b>Tìm kiếm nâng cao</b> (WBS PH09 #173 "Tìm kiếm và bộ lọc nâng cao"; task-management chỉ có ô tìm kiếm). Cột Thao tác: Sửa; Xoá chỉ khi KĐT chưa có hồ sơ.',
        '<b>T31 — theo IA-DXMS</b> (màn Soạn thảo TTr, dòng 10–12; KĐT "cũng chạy như thế" — GA-KDT-0411; D-67): Tìm kiếm nâng cao thêm Khối đơn vị (Đơn vị đề xuất hiện theo khối), Người tạo, Nhóm trạng thái, Mật, Ngày tạo từ – đến; cột Ngày gửi thẩm định, Người tạo, Ngày tạo; <b>Xuất Excel</b> theo các cột đang hiện, mọi dòng thỏa bộ lọc. IA ghi Khối, Đơn vị "chọn nhiều": giữ chọn một như Danh sách ĐXMS (T29) cho thống nhất.',
        'Ánh xạ IA: "Loại biểu mẫu TTr" → Nhóm KĐT (hệ thống xác định, D-7); 12 Trạng thái TTr → Trạng thái KĐT; "Kinh phí đề xuất" → Tổng mức vốn. Bộ lọc "Chi phí năm" chưa dựng (P-202). Lọc theo người thẩm định ở Danh sách hồ sơ KĐT.',
      ],
      q: ['P-59', 'P-190', 'P-192', 'P-201', 'P-202'], src: 'task-management/task-management.component · /task-management',
    };
    return `<div class="pg">
      ${head({ title: 'Danh sách khoản đầu tư', info, right: `<button type="button" class="vbtn secondary" data-kl="export">${icon('excel')} Xuất Excel</button><button class="vbtn primary" data-go="kdt/create">${icon('add')} Thêm mới</button>` })}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="kdt-kw" maxlength="255" placeholder="Tìm kiếm theo mã, tên KĐT" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-kl="adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? advPanel() : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'kdt', total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }

  /* Xuất Excel SCR-54: các cột đang hiện (trừ Thao tác), mọi dòng thỏa tìm kiếm / bộ lọc. */
  function exportList() {
    const head = ['STT', 'Trạng thái', 'Mã KĐT', 'Tên KĐT', 'Đề tài / dự án', 'Đơn vị đề xuất', 'Loại KĐT', 'Nhóm KĐT', 'Tổng mức vốn (tỷ đồng)', 'Ngày gửi thẩm định', 'Người tạo', 'Ngày tạo', 'Ngày cập nhật'];
    csv('danh-sach-khoan-dau-tu.csv', [head].concat(filtered().map((x, i) => [i + 1, KDT_STAGE[x.stage][0], x.code, x.title, nvText(x.nv), x.unit, catLabel('type', x.type),
      x.group ? GROUP[x.group] : 'Chưa xác định', x.value != null ? ty(x.value) : '', sentAt(x.main) || '', x.creator || '', x.created || '', x.updated || ''])));
  }
  document.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-pager="kdt"]')) {
      const b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    if (L.psOpen) { L.psOpen = false; rerender(); }
    const l = t.closest('[data-kl]');
    if (l) {
      if (l.dataset.kl === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
      if (l.dataset.kl === 'reset') { L.d = emptyFilter(); L.f = emptyFilter(); L.page = 1; }
      if (l.dataset.kl === 'export') { exportList(); return; }
      rerender(); return;
    }
    const del = t.closest('[data-del-kdt]');
    if (!del) return;
    /* Nút nằm trong dòng có data-go: chặn listener mở chi tiết của app.js. */
    e.stopImmediatePropagation();
    const x = Flow.findKdt(del.dataset.delKdt);
    const yes = await window.Catalog.confirm({ sev: 'danger', title: 'Xóa khoản đầu tư', desc: `Bạn có chắc chắn muốn xóa khoản đầu tư ${x.title} - ${x.code} không? Thao tác này không thể hoàn tác.`,
      hl: x.title, cancel: 'Hủy', ok: 'Xóa' });
    if (!yes) return;
    Flow.deleteKdt(x.code);
    toast('<b>Thành công</b><br>Xóa khoản đầu tư thành công');
  });
    document.addEventListener('click', (e) => {
    if (e.target.closest('[data-kc-cadd]') && XF.pick.line) { XF.rseq += 1; XF.cost.push({ id: 'c' + XF.rseq, line: XF.pick.line, qty: '', value: '', pkg: '' }); XF.pick.line = null; rerender(); return; }
    const cd = e.target.closest('[data-kc-cdel]');
    if (cd) { XF.cost = XF.cost.filter((r) => r.id !== cd.dataset.kcCdel); if (XF.err.cost) delete XF.err.cost[cd.dataset.kcCdel]; rerender(); }
  });
  document.addEventListener('submit', (e) => {
    if (e.target.matches('[data-kdt-adv]')) { e.preventDefault(); L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender(); }
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest('[data-kf]');
    if (f) L.d[f.dataset.kf] = f.value;
    const x = e.target.closest('[data-kx]');
    if (x) XF.v[x.dataset.kx] = x.value;
    /* Không vẽ lại khi đang gõ: Cấp phê duyệt dự kiến theo Tổng mức vốn dự kiến, tổng bóc tách cập nhật tại chỗ; cảnh báo vượt hiện ở lần vẽ lại sau (như SCR-96). */
    if (e.target.id === 'k-est' && e.target.closest('[data-kdt-form]')) {
      const lv = document.getElementById('k-level');
      if (lv) lv.value = derivedK(XF.v, XF.mode === 'edit' && Flow.findKdt(XF.code) ? meta(Flow.findKdt(XF.code)) : null).level;
    }
    /* Card bóc tách: ghi thẳng vào dòng; cảnh báo vượt vẽ lại khi rời ô (change). */
    const ci = e.target.closest('[data-kc-cqty], [data-kc-cval], [data-kc-cpkg]');
    if (ci) {
      const d = ci.dataset, id = d.kcCqty || d.kcCval || d.kcCpkg, r = XF.cost.find((y) => y.id === id);
      if (r) r[d.kcCqty ? 'qty' : d.kcCval ? 'value' : 'pkg'] = ci.value;
      const sm = document.querySelector('[data-kc-sum]');
      if (sm && d.kcCval) sm.innerHTML = sumHtml();
    }
    if (e.target.id === 'kc-name') { C.name = e.target.value; }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.id !== 'kdt-kw') return;
    L.kw = e.target.value.trim(); L.page = 1; rerender();
    const k = document.getElementById('kdt-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* ---------- SCR-55 Thêm mới / Chỉnh sửa KĐT ---------- */
  const XF = { mode: 'create', code: null, v: {}, err: {} };
  const tyIn = (n) => (n == null || n === '' ? '' : String(n).replace('.', ','));
  function resetForm(mode, code) {
    const x = code && Flow.findKdt(code);
    const u = persona(Flow.state.persona).unit;
    Object.assign(XF, { mode, code: code || null, err: {}, pick: { type: null, line: null }, rseq: 0 });
    XF.v = x ? { title: x.title, nv: x.nv || null, unit: x.unit, field: x.field, type: x.type, nature: x.nature, est: tyIn(x.est), period: x.period || '', secret: x.secret ? 'Có' : 'Không', purpose: x.purpose || '', legal: x.legal || '' }
      : { title: '', nv: null, unit: UNITS.includes(u) ? u : null, field: null, type: null, nature: null, est: '', period: '', secret: 'Không', purpose: '', legal: '' };
    XF.cost = ((x && x.cost) || []).map((r) => { XF.rseq += 1; return { id: 'c' + XF.rseq, line: r.line, qty: tyIn(r.qty), value: tyIn(r.value), pkg: r.pkg || '' }; });
  }

  /* ---------- T31 B3 — K4 (IA dòng 13; D-68): bóc tách từ dự toán đề tài / dự án khi tạo KĐT ----------
     Cùng card và luật với Thêm mới luồng mua sắm SCR-96 (T29 B9): Loại chi phí → Khoản mục chi phí (chỉ khoản mục Chi mua sắm còn khả dụng) → + Thêm vào KĐT.
     Khả dụng tính chung ĐXMS + KĐT trên cùng bảng dự toán (DeTai.usesOf, D.duToanStats); KĐT đang sửa không tự trừ phần của chính nó. */
  const estNum = (s) => (String(s == null ? '' : s).trim() === '' ? null : Number(String(s).trim().replace(/\./g, '').replace(',', '.')));
  const typeName = (t) => (D.costTypes.find(([k]) => k === t) || [t, t])[1];
  const costLine = (id) => (XF.v.nv ? D.duToanOf(XF.v.nv) : []).find((l) => l.id === id) || null;
  const availOf = (l) => {
    const us = ((window.DeTai.usesOf(l.code)[l.id]) || []).filter((u) => !(u.kdt && u.x.code === XF.code));
    const s = D.duToanStats(l, us);
    return { value: s.remain, qty: l.qty == null ? null : l.qty - s.qty };
  };
  const avTxt = (l) => { const a = availOf(l); return `${a.qty == null ? '' : `${a.qty} ${l.uom || ''} · `}${ty(a.value)} tỷ đồng`; };
  const sumHtml = () => {
    const sum = XF.cost.reduce((a, r) => { const n = estNum(r.value); return a + (n && !Number.isNaN(n) ? n : 0); }, 0);
    return `Tổng giá trị dự tính đã bóc tách: <b>${ty(Math.round(sum * 100) / 100)} tỷ đồng</b> — tham khảo cho Tổng mức vốn dự kiến; tổng mức vốn thực tế chốt sau báo giá (bước 10).`;
  };
  function costCard(lock) {
    const nv = XF.v.nv, all = nv ? D.duToanOf(nv) : [], p = XF.pick, err = XF.err.cost || {}, ent = D.nvOf(nv) || {};
    const head = `<div class="vcard-h"><h3>Thông tin đề tài / dự án</h3>${nv && ent.loai !== 'KHCN' ? `<span class="cap">Dự toán tham khảo — căn cứ của loại ${esc(ent.loai)} là tài liệu căn cứ đính kèm</span>` : ''}</div>`;
    if (!nv) return `<section class="vcard" data-kc-cost>${head}<div class="lf-empty">Chọn Đề tài / dự án để bóc tách chi phí từ dự toán.</div></section>`;
    const foot = XF.cost.length ? `<div class="cap mt8" data-kc-sum>${sumHtml()}</div>` : '';
    if (lock) {
      return `<section class="vcard" data-kc-cost>${head}${table([['Loại chi phí', 200], ['Khoản mục chi phí', 240], ['ĐVT', 80], ['Số lượng đề xuất', 140, 'r'], ['Giá trị dự tính (tỷ đồng)', 170, 'r'], ['Hình thành gói thầu', 220]], XF.cost, (r) => {
        const l = costLine(r.line) || {};
        return `<td>${clamp(typeName(l.type))}</td><td>${clamp(l.item)}</td><td>${esc(l.uom || '')}</td><td class="r num">${esc(r.qty || '-')}</td><td class="r num">${esc(r.value || '-')}</td><td>${clamp(r.pkg)}</td>`;
      }, 'Chưa bóc tách chi phí từ dự toán')}<div class="cap mt8">KĐT đã có hồ sơ: dòng bóc tách đã chuyển thành hạng mục của hồ sơ ở bước 01, 05 — sửa trong hồ sơ.</div></section>`;
    }
    /* Góp ý 05/11: khoản mục TTMS đặt Hoàn thành không bóc tách thêm (GIẢ LẬP P-203). */
    const lines = all.filter((l) => l.buy && l.status !== 'Hoàn thành' && availOf(l).value > 0);
    const types = [...new Set(lines.map((l) => l.type))];
    const pickUpd = (fn) => (x) => { fn(x); rerender(); };
    return `<section class="vcard" data-kc-cost>${head}
      <div class="grid3">
        ${field('Loại chi phí', vSelect({ id: 'kc-ctype', value: p.type, placeholder: 'Chọn loại chi phí', options: types.map((t) => ({ value: t, label: typeName(t) })),
    onChange: pickUpd((x) => { p.type = x; p.line = null; }) }))}
        ${field('Khoản mục chi phí', vSelect({ id: 'kc-cline', value: p.line, searchable: true, disabled: !p.type, placeholder: p.type ? 'Chọn khoản mục chi phí' : 'Chọn loại chi phí trước',
    options: lines.filter((l) => l.type === p.type).map((l) => ({ value: l.id, label: `${l.item} — còn ${avTxt(l)}` })), onChange: pickUpd((x) => { p.line = x; }) }))}
        <div class="vfield"><div class="lr"><label>&nbsp;</label></div><div class="row"><button type="button" class="vbtn secondary" data-kc-cadd ${p.line ? '' : 'disabled'}>${icon('add')} Thêm vào KĐT</button></div></div>
      </div>
      ${table([['Thao tác', 80, 'c'], ['Nguồn vốn', 170], ['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80], ['Còn lại khả dụng', 180, 'r'],
    ['Số lượng đề xuất', 140], ['Giá trị dự tính (tỷ đồng)', 170], ['Hình thành gói thầu', 220]], XF.cost, (r) => {
    const l = costLine(r.line) || {}, e = err[r.id] || {}, a = availOf(l), q = estNum(r.qty), n = estNum(r.value);
    /* Vượt phần còn lại: cảnh báo, không chặn khi tạo (BR-KDT-02-04); chặn khi chốt báo giá (P1, BR-KDT-04-11 — T29 B4, K6). Vượt dự toán của dòng: chặn Lưu. */
    const warn = [q != null && !Number.isNaN(q) && a.qty != null && q > a.qty ? `Vượt khối lượng còn lại (${a.qty}).` : '',
      n != null && !Number.isNaN(n) && n > a.value && n <= l.value ? `Vượt giá trị còn lại khả dụng (${ty(a.value)} tỷ đồng).` : ''].filter(Boolean).join(' ');
    const inp = (k, ph, max) => `<div class="vfield ${e[k] ? 'invalid' : ''}"><input class="vctl" data-kc-c${k}="${r.id}" maxlength="${max}" placeholder="${ph}" value="${esc(k === 'val' ? r.value : r[k])}" ${e[k] ? 'aria-invalid="true"' : ''}>${e[k] ? `<p class="msg" role="alert">${esc(e[k])}</p>` : ''}</div>`;
    return `<td class="c">${iconBtn('del', 'Xóa dòng', `data-kc-cdel="${r.id}"`)}</td><td>${clamp(l.fund)}</td>
        <td>${clamp(typeName(l.type))}</td><td>${clamp(l.item)}${warn ? `<div class="t-err" data-kc-cwarn>${esc(warn)}</div>` : ''}</td><td>${esc(l.uom || '')}</td><td class="r num">${avTxt(l)}</td>
        <td>${inp('qty', 'Nhập số lượng', 10)}</td><td>${inp('val', 'Nhập giá trị', 15)}</td>
        <td><input class="vctl" data-kc-cpkg="${r.id}" maxlength="500" placeholder="Nhập tên gói thầu dự kiến" value="${esc(r.pkg)}"></td>`;
  }, 'Chưa bóc tách chi phí — chọn Loại chi phí, Khoản mục chi phí rồi Thêm vào KĐT')}${foot}</section>`;
  }
  /* Trường chỉ đọc (IA dòng 13): hệ thống suy, không chọn (D-7). Cấp phê duyệt dự kiến theo phân cấp thẩm quyền (D-33, GIẢ LẬP P-90) với Tổng mức vốn dự kiến; chốt ở bước 13. */
  const LEVEL = { VHT: 'Tổng Giám đốc VHT', TD: 'Tập đoàn' };
  function derivedK(v, m) {
    const e = estNum(v.est), r = v.type && e != null && !Number.isNaN(e) ? D.kdtAuthOf({ type: v.type, field: v.field }, e) : null;
    return {
      form: m && m.group ? GROUP[m.group] : 'Chưa xác định — hệ thống xác định sau bước 12',
      level: r ? `Chủ trương: ${LEVEL[r.ct]} · KĐT: ${LEVEL[r.kdt]} — dự kiến, chốt ở bước 13` : 'Theo tổng mức vốn sau báo giá — chốt ở bước 13',
      sign: v.secret === 'Có' ? 'Bản cứng (hồ sơ Mật)' : 'VOffice — đổi được khi trình ký',
    };
  }
  /* SCR-56: bảng chỉ xem các dòng đã bóc tách. */
  function costView(x) {
    return `<section class="vcard" data-kdt-cost><h3>Thông tin đề tài / dự án</h3>${table([['Mã đề tài / dự án', 150], ['Nguồn vốn', 170], ['Loại chi phí', 200], ['Khoản mục chi phí', 220], ['ĐVT', 80],
      ['Số lượng đề xuất', 130, 'r'], ['Giá trị dự toán (tỷ đồng)', 150, 'r'], ['Giá trị dự tính (tỷ đồng)', 150, 'r'], ['Hình thành gói thầu', 200]], x.cost || [], (r) =>
      `<td><a class="link" data-go="${window.DeTai.href(r.code)}">${esc(r.code)}</a></td><td>${clamp(r.fund)}</td><td>${clamp(typeName(r.type))}</td><td>${clamp(r.item)}</td>
        <td>${esc(r.uom || '')}</td><td class="r num">${r.qty == null ? '-' : esc(String(r.qty))}</td><td class="r num">${ty(r.budget)}</td><td class="r num">${ty(r.value)}</td><td>${clamp(r.pkg)}</td>`, 'Chưa bóc tách chi phí từ dự toán')}</section>`;
  }
  const notFound = (title) => `<div class="pg">${head({ title, back: 'kdt', lg: true })}<section class="vcard pad24"><div class="empty-t">Không tìm thấy khoản đầu tư.</div></section></div>`;

  function form() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create / edit), như SCR-28
    const edit = XF.mode === 'edit', x = edit && Flow.findKdt(XF.code);
    if (edit && !x) return notFound('Chỉnh sửa khoản đầu tư');
    const v = XF.v, err = XF.err, back = edit ? href(XF.code) : 'kdt';
    const m = edit ? meta(x) : null;
    const lock = edit && m.stage !== 'NEW';
    const upd = (k) => (val) => { v[k] = val; delete err[k]; rerender(); };
    const txt = (k, ph, o) => `<input class="vctl" data-kx="${k}" id="k-${k}" maxlength="${(o && o.max) || 255}" placeholder="${ph}" value="${esc(v[k])}" ${err[k] ? 'aria-invalid="true"' : ''}>`;
    const dk3 = derivedK(v, m);
    const cat = (k, label) => field(label, vSelect({ id: 'k-' + k, value: v[k], placeholder: 'Chọn ' + label.toLowerCase(), invalid: !!err[k], disabled: lock, options: catOptions(k, v[k]), onChange: upd(k) }), { req: true, err: err[k] });
    const info = {
      scr: 'SCR-55', name: edit ? 'Chỉnh sửa khoản đầu tư' : 'Thêm mới khoản đầu tư', uc: 'UC-05-01 · WBS PH09 #175 · UR-KDT-01, UR-KDT-02, UR-KDT-11 · IA-DXMS dòng 13 (plan T31 K3, K4; D-68, D-69)',
      notes: [
        'Theo task-create (mode create / edit), như Thêm mới ĐXMS: card <b>Thông tin chung KĐT</b>. Lưu chỉ tạo / cập nhật KĐT, <b>không khởi tạo quy trình</b> (D-12); về Danh sách KĐT. Mã KĐT tự sinh.',
        '<b>Không có trường Quy trình</b> (D-7): Lĩnh vực, Loại KĐT, Tính chất tài sản là 3 trong 04 yếu tố phân luồng (lấy từ Danh mục dùng chung); yếu tố thứ tư là tổng mức vốn thực tế sau báo giá. Hệ thống xác định nhóm MS13 / MS14 / MS15 và nhánh gộp BM-00 sau khi TTMS xác nhận ở bước 12.',
        'Tổng mức vốn dự kiến là giá trị ban đầu; tổng mức vốn hiệu lực lấy từ hồ sơ Hoàn thành gần nhất.',
        '<b>Đề tài / dự án</b> bắt buộc (D-45, team BA 30/10/2026: KĐT xuất phát từ một nhiệm vụ hoặc đề tài, dự án của Kế hoạch năm) — cùng danh mục Đề tài / dự án với ĐXMS (D-66; nhiệm vụ KHCN là Loại KHCN); ô chọn ghi Loại, ô <b>Loại</b> chỉ đọc theo đề tài đã chọn; chọn xong thì Lĩnh vực mặc định theo đề tài (sửa được khi chưa có hồ sơ).',
        '<b>T31 B2</b> (D-69, mở rộng D-66 sang KĐT): nhãn "Nhiệm vụ / Đề tài, dự án" đổi thành "Đề tài / dự án" ở Danh sách KĐT, Thêm mới / Chỉnh sửa, Chi tiết KĐT và Danh sách hồ sơ KĐT; mã đề tài mở Chi tiết đề tài / dự án (SCR-104), ở đó tab ĐXMS / KĐT liên quan liệt kê KĐT này.',
        '<b>T31 B3 — Thông tin đề tài / dự án</b> (IA-DXMS dòng 13, D-68 mở rộng D-60 sang KĐT): cùng card với Thêm mới luồng mua sắm (SCR-96) — Loại chi phí → Khoản mục chi phí → <b>+ Thêm vào KĐT</b>, nhập Số lượng đề xuất, Giá trị dự tính, Hình thành gói thầu. Chỉ khoản mục TTMS đã tích <b>Chi mua sắm</b> và còn khả dụng; <b>khả dụng tính chung ĐXMS + KĐT</b> (dự toán − đã phê duyệt − đang giữ của mọi ĐXMS và KĐT dùng dòng; KĐT đã Lưu là đang giữ kể cả khi chưa có hồ sơ, dừng theo chỉ đạo thì trả lại). Vượt phần còn lại: cảnh báo đỏ, không chặn (BR-KDT-02-04); vượt giá trị dự toán của dòng: chặn Lưu; chặn vượt căn cứ khi chốt báo giá là P1 (BR-KDT-04-11, làm ở T29 B4). Đề tài Loại KHCN: dòng là hạng mục căn cứ, BE ghi bảng giữ chỗ khi Lưu và biến <code>duToanChon</code> cho bước 01, 05 (chỉ xem); loại khác chỉ tham khảo, căn cứ là tệp (D-30). KĐT đã có hồ sơ: card chỉ xem, sửa trong hồ sơ. Đổi Đề tài / dự án thì bỏ các dòng đã chọn. <b>Cần dev riêng</b>: bảng giữ chỗ dùng chung ĐXMS / KĐT (GIẢ LẬP P-193).',
        '<b>Trường chỉ đọc</b> (IA dòng 13, D-7 không chọn quy trình): <b>Loại biểu mẫu</b> = Nhóm KĐT, "Chưa xác định" tới khi TTMS xác nhận 04 yếu tố ở bước 12; <b>Cấp phê duyệt</b> dự kiến theo phân cấp thẩm quyền (D-33, GIẢ LẬP P-90) với Loại KĐT và Tổng mức vốn dự kiến, chốt ở bước 13; <b>Hình thức trình ký</b> theo Mật (Mật → bản cứng, khối ký chung D-34). <b>Nội dung căn cứ pháp lý</b> nhập text; tệp căn cứ chọn ở bước 01 (Văn bản căn cứ đã phê duyệt) và Tài liệu đính kèm. Không có Danh sách người thẩm định dự kiến (D-71 — MS13 có bước chọn CQCM 22 / 41 / 52).',
      ].concat(edit ? ['Khi KĐT đã có hồ sơ, 3 yếu tố phân luồng bị khoá (hồ sơ giữ giá trị lúc TTMS xác nhận). Card <b>Danh sách hồ sơ</b> có nút <b>Tạo hồ sơ</b> như source (chỉ ở mode edit).'] : []),
      q: ['P-51', 'P-59', 'P-113', 'P-193', 'P-90'], src: 'task-management/components/task-create · /task-management/' + (edit ? 'edit/:id' : 'create'),
    };
    return `<form class="pg" data-kdt-form>
      ${head({ title: edit ? 'Chỉnh sửa khoản đầu tư' : 'Thêm mới khoản đầu tư', back, lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="k-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung KĐT</h3>
        <div class="grid3">
          ${field('Mã KĐT', `<input class="vctl" placeholder="Hệ thống tự sinh" value="${esc(XF.code || '')}" disabled>`)}
          ${field('Tên KĐT', txt('title', 'Nhập tên khoản đầu tư', { max: 500 }), { req: true, err: err.title, cls: 'span2' })}
          ${field('Đề tài / dự án', vSelect({ id: 'k-nv', value: v.nv, searchable: true, placeholder: 'Chọn đề tài / dự án', invalid: !!err.nv,
            options: nvOptions(true), onChange: (val) => { if (val !== v.nv && !lock) { XF.cost = []; XF.pick = { type: null, line: null }; delete err.cost; } v.nv = val; delete err.nv; const n = D.nvOf(val); if (n && !v.field && !lock) v.field = n.field; rerender(); } }), { req: true, err: err.nv, cls: 'span2' })}
          ${field('Loại', `<input class="vctl" value="${esc((D.nvOf(v.nv) || {}).kind || '')}" placeholder="Theo đề tài / dự án đã chọn" disabled>`)}
          ${field('Đơn vị đề xuất', vSelect({ id: 'k-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị đề xuất', invalid: !!err.unit, options: UNITS.map((u) => ({ value: u, label: u })), onChange: upd('unit') }), { req: true, err: err.unit })}
          ${cat('field', 'Lĩnh vực')}${cat('type', 'Loại KĐT')}${cat('nature', 'Tính chất tài sản')}
          ${field('Tổng mức vốn dự kiến (tỷ đồng)', txt('est', 'Nhập tổng mức vốn dự kiến'), { err: err.est })}
          ${field('Thời gian thực hiện', txt('period', 'Ví dụ: 01/2027 – 12/2027'))}
          ${field('Mật', vSelect({ id: 'k-sec', value: v.secret, options: ['Không', 'Có'].map((p) => ({ value: p, label: p })), onChange: upd('secret') }))}
          ${field('Người tạo', `<input class="vctl" value="${esc(edit ? x.creator || '' : persona(Flow.state.persona).name)}" disabled>`)}
          ${field('Loại biểu mẫu (Nhóm KĐT)', `<input class="vctl" id="k-form" value="${esc(dk3.form)}" disabled>`)}
          ${field('Cấp phê duyệt', `<input class="vctl" id="k-level" value="${esc(dk3.level)}" disabled>`)}
          ${field('Hình thức trình ký', `<input class="vctl" id="k-sign" value="${esc(dk3.sign)}" disabled>`)}
          ${field('Mục tiêu', `<textarea class="vctl ta" data-kx="purpose" id="k-purpose" maxlength="2000" placeholder="Nhập mục tiêu đầu tư">${esc(v.purpose)}</textarea>`, { cls: 'span3' })}
          ${field('Nội dung căn cứ pháp lý', `<textarea class="vctl ta" data-kx="legal" id="k-legal" maxlength="4000" placeholder="Nhập căn cứ pháp lý (số, ngày, trích yếu văn bản)">${esc(v.legal)}</textarea>`, { cls: 'span3' })}
        </div></section>
      ${costCard(lock)}
      ${edit ? casesCard(x, true) + docsCard(x) : ''}</form>`;
  }

  function save() {
    ['title', 'est', 'period', 'purpose', 'legal'].forEach((k) => { const el = document.getElementById('k-' + k); if (el) XF.v[k] = el.value; });
    const v = XF.v, err = XF.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên KĐT.';
    if (!v.nv) err.nv = 'Bạn cần chọn Đề tài / dự án.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị đề xuất.';
    if (!v.field) err.field = 'Bạn cần chọn Lĩnh vực.';
    if (!v.type) err.type = 'Bạn cần chọn Loại KĐT.';
    if (!v.nature) err.nature = 'Bạn cần chọn Tính chất tài sản.';
    const est = v.est.trim() === '' ? null : Number(v.est.trim().replace(/\./g, '').replace(',', '.'));
    if (est != null && (Number.isNaN(est) || est < 0)) err.est = 'Tổng mức vốn dự kiến không đúng định dạng.';
    const x0 = XF.mode === 'edit' && Flow.findKdt(XF.code), locked = !!x0 && meta(x0).stage !== 'NEW';
    const ce = {};
    if (!locked) {
      XF.cost.forEach((r) => {
        const n = estNum(r.value), q = estNum(r.qty), l = costLine(r.line), e = {};
        if (q == null) e.qty = 'Bạn cần nhập Số lượng đề xuất.';
        else if (Number.isNaN(q) || q <= 0) e.qty = 'Số lượng đề xuất không đúng định dạng.';
        if (n == null) e.val = 'Bạn cần nhập Giá trị dự tính.';
        else if (Number.isNaN(n) || n <= 0) e.val = 'Giá trị dự tính không đúng định dạng.';
        else if (l && n > l.value) e.val = `Vượt giá trị dự toán (${ty(l.value)} tỷ đồng).`;
        if (Object.keys(e).length) ce[r.id] = e;
      });
    }
    if (Object.keys(ce).length) err.cost = ce;
    if (Object.keys(err).length) { rerender(); return; }
    const data = { title: v.title.trim(), nv: v.nv, unit: v.unit, field: v.field, type: v.type, nature: v.nature, est, period: v.period.trim(), secret: v.secret === 'Có', purpose: v.purpose.trim(), legal: v.legal.trim() };
    if (!locked) data.cost = XF.cost.map((r) => Object.assign({}, costLine(r.line), { line: r.line, qty: estNum(r.qty), value: estNum(r.value), budget: costLine(r.line).value, pkg: r.pkg.trim() }));
    if (XF.mode === 'edit') { Flow.updateKdt(XF.code, data); toast('<b>Thành công</b><br>Cập nhật khoản đầu tư thành công!'); } else { Flow.createKdt(data); toast('<b>Thành công</b><br>Thêm mới khoản đầu tư thành công!'); }
    location.hash = '#/kdt';
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-kdt-form]')) { e.preventDefault(); save(); } });

  /* Danh sách hồ sơ của KĐT (TASK_PROFILE_COLUMNS + Loại hồ sơ, Nhóm KĐT). Mã hồ sơ mở Chi tiết hồ sơ KĐT (SCR-20, #/ho-so-kdt/<mã>);
     hồ sơ đã chuyển luồng có liên kết "Kết thúc — đã chuyển luồng" mở Thông báo chuyển luồng (SCR-66). */
  const caseLink = (code) => `<a class="link" data-go="ho-so-kdt/${encodeURIComponent(code)}">${esc(code)}</a>`;
  function casesCard(x, edit) {
    const hs = meta(x).hs;
    const cols = [['Mã Camunda', 160], ['Mã hồ sơ', 150], ['Loại hồ sơ', 150], ['Nhóm KĐT', 200], ['Nhánh hồ sơ', 220], ['Bước hiện tại', 260], ['Ngày tạo', 130], ['Trạng thái', 169, 'c']];
    return `<section class="vcard" data-kdt-profiles><div class="vcard-h"><h3>Danh sách hồ sơ</h3>${edit ? `<button type="button" class="vbtn red" data-go="${href(x.code)}/tao-ho-so">Tạo hồ sơ</button>` : ''}</div>
      ${table(cols, hs, (c) => `<td class="num">${esc(window.QuyTrinh.camundaKey(c.code))}</td><td>${caseLink(c.code)}</td><td>${c.kind === 'PD' ? 'Phê duyệt KĐT' : 'Điều chỉnh KĐT'}</td>
        <td>${esc(flowLabel(c))}</td><td>${c.branch ? esc(BRANCH[c.branch]) : dash}</td><td>${c.st === 'moved' ? `<a class="link" data-go="${href(x.code)}/chuyen-luong">${esc('Kết thúc — đã chuyển luồng' + (c.replacedBy ? ' (' + c.replacedBy + ')' : ''))}</a>`
          : clamp(stepName(c) || (c.st === 'done' ? 'Kết thúc — đã phê duyệt' : c.st === 'stopped' ? 'Kết thúc theo chỉ đạo' : ''))}</td>
        <td class="num">${esc(c.created)}</td><td class="c">${badge(CASE_ST[c.st][0], CASE_ST[c.st][1])}</td>`)}</section>`;
  }
  const DOC_NAME = { 'BM-00': 'Hồ sơ chủ trương và KĐT (văn bản gộp)', 'BM-01': 'Tờ trình phê duyệt chủ trương KĐT', 'BM-14': 'Báo cáo kết quả thẩm định KĐT', 'BM-18': 'Quyết định phê duyệt KĐT' };
  function docsCard(x) {
    const rows = [];
    meta(x).hs.forEach((c) => (c.docs || []).forEach(([code, at]) => rows.push({ name: `${code} ${DOC_NAME[code] || ''}`.trim(), at, c })));
    return `<section class="vcard"><h3>Tài liệu đính kèm</h3>
      ${table([['Thao tác', 80, 'c'], ['Tên tài liệu', 340], ['Mã hồ sơ', 160], ['Ngày tạo', 150], ['Ngày cập nhật', 150]], rows, (r) => `<td class="c">${iconBtn('download', 'Tải xuống', `data-dl="${esc(r.name)}"`)}</td>
        <td><span class="clamp">${esc(r.name)}</span></td><td>${esc(r.c.code)}</td><td class="num">${esc(r.at)}</td><td class="num">${esc(r.at)}</td>`)}</section>`;
  }

  /* ---------- SCR-56 Chi tiết KĐT ---------- */
  function detail(code) {
    // Theo: task-create (mode detail), như SCR-29 Chi tiết ĐXMS
    const x = Flow.findKdt(code);
    if (!x) return notFound('Xem chi tiết khoản đầu tư');
    const m = meta(x);
    const info = {
      scr: 'SCR-56', name: 'Chi tiết khoản đầu tư', uc: 'UC-05-01 · WBS PH09 #174, 180 · IA-DXMS dòng 13 (plan T31 K3, K4; D-68, D-69)',
      notes: [
        'Theo task-create (mode detail): nút <b>Chỉnh sửa</b> trên hàng tiêu đề; cards Thông tin chung KĐT · <b>Danh sách hồ sơ</b> · Tài liệu đính kèm. Nút Tạo hồ sơ chỉ có ở Chỉnh sửa (như source).',
        'Nhóm KĐT và Nhánh hồ sơ lấy từ hồ sơ gần nhất — hệ thống xác định sau bước 12 (D-7). Trạng thái suy từ hồ sơ. Tổng mức vốn hiệu lực = của hồ sơ Hoàn thành gần nhất.',
        'Mã hồ sơ trong Danh sách hồ sơ mở <b>Chi tiết hồ sơ</b> (khuôn profile-detail: Quy trình MS13, Lịch sử, văn bản đầu ra, Xem BPMN MS13 tô bước hiện tại); quay lại về màn này. Hồ sơ đã chuyển luồng: bấm "Kết thúc — đã chuyển luồng" mở Thông báo chuyển luồng.',
        '<b>T31</b> (IA-DXMS dòng 13; D-69, D-68): ô <b>Đề tài / dự án</b> mở Chi tiết đề tài / dự án, kèm Loại của đề tài; card <b>Thông tin đề tài / dự án</b> chỉ xem các dòng dự toán KĐT đã bóc tách (sửa ở Chỉnh sửa khi chưa có hồ sơ); <b>Nội dung căn cứ pháp lý</b> nhập ở Thêm mới / Chỉnh sửa.',
        'KĐT đã phê duyệt (BM-18 hoặc BM-00 đã ký): nút <b>Lập KHLCNT</b> mở Thêm mới KHLCNT chọn sẵn KĐT (T16 B2; thay nút Tạo gói thầu mờ — gói thầu là dòng của KHLCNT). Tài liệu đính kèm gồm văn bản đầu ra của hồ sơ (BM-01, BM-14, BM-18 / BM-00).',
      ].concat(window.KdtB2.TAB_INFO),
      q: ['P-59'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id',
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết khoản đầu tư', back: 'kdt', lg: true, info, right: `<div class="row">${m.approved && !window.Thau.khBy('KDT', x.code).length ? `<button type="button" class="vbtn secondary" data-go="khlcnt/create/KDT/${encodeURIComponent(x.code)}">Lập KHLCNT</button>` : ''}<button type="button" class="vbtn primary" data-go="${href(x.code)}/edit">Chỉnh sửa</button></div>` })}
      ${window.Ycbg.tabs(x.code, `<section class="vcard pad24 gen"><h3>Thông tin chung KĐT</h3><div class="ginfo c3">
        ${kv('Mã KĐT', esc(x.code))}${kv('Tên KĐT', esc(x.title), 'span2')}
        ${kv('Đề tài / dự án', nvLink(x.nv), 'span2')}${kv('Loại', esc((D.nvOf(x.nv) || {}).kind || ''))}
        ${kv('Đơn vị đề xuất', esc(x.unit))}${kv('Người tạo', esc(x.creator))}${kv('Trạng thái', stageBadge(m.stage))}
        ${kv('Lĩnh vực', esc(catLabel('field', x.field)))}${kv('Loại KĐT', esc(catLabel('type', x.type)))}${kv('Tính chất tài sản', esc(catLabel('nature', x.nature)))}
        ${kv('Nhóm KĐT', m.group ? esc(GROUP[m.group]) : 'Chưa xác định')}${kv('Nhánh hồ sơ', m.branch ? esc(BRANCH[m.branch]) : null)}${kv('Tổng mức vốn hiệu lực', m.value != null ? ty(m.value) + ' tỷ đồng' : null)}
        ${kv('Tổng mức vốn dự kiến', x.est != null ? ty(x.est) + ' tỷ đồng' : null)}${kv('Thời gian thực hiện', esc(x.period))}${kv('Mật', x.secret ? 'Có' : 'Không')}
        ${kv('Ngày cập nhật', esc(x.updated))}
        ${kv('Mục tiêu', esc(x.purpose), 'span3')}${x.legal ? kv('Nội dung căn cứ pháp lý', esc(x.legal), 'span3') : ''}</div></section>
      ${costView(x)}${casesCard(x, false)}${docsCard(x)}`, window.KdtB2.tabOpt)}</div>`;
  }

  /* ---------- Thêm mới hồ sơ KĐT (khuôn SCR-25 / profile-form, ô KĐT khoá như route create/:taskId) ---------- */
  const C = { kdt: null, kind: 'PD', name: '', err: {} };
  function resetCase(code) { const x = Flow.findKdt(code); Object.assign(C, { kdt: code, kind: 'PD', name: x ? x.title : '', err: {} }); }
  /* Lý do không tạo được hồ sơ Phê duyệt cho KĐT, hoặc null (như R1, R2 của ĐXMS). */
  function block(x) {
    const m = meta(x);
    if (m.hs.some((c) => c.st === 'processing')) return 'Khoản đầu tư đang có hồ sơ đang xử lý.';
    if (m.approved) return 'Khoản đầu tư đã được phê duyệt. Hồ sơ Điều chỉnh KĐT làm ở đợt sau.';
    return null;
  }
  function caseCreate(code) {
    const x = Flow.findKdt(code);
    if (!x) return notFound('Thêm mới hồ sơ');
    const back = href(code) + '/edit';
    const info = {
      scr: 'SCR-25', name: 'Thêm mới hồ sơ (khoản đầu tư)', uc: 'UC-05-01 · WBS PH09 #175, 176; PH02 #29, 30 · UR-KDT-11', bpmn: 'Ngoài BPMN — trước bước 01 (MS13)',
      notes: [
        'Dùng lại khuôn Thêm mới hồ sơ (profile-form): ô <b>Khoản đầu tư</b> khoá vì mở từ nút Tạo hồ sơ của KĐT.',
        'Loại hồ sơ <b>Phê duyệt KĐT</b>; Điều chỉnh KĐT (MS13.02/.04, MS14.02/.04) chưa có BPMN TO-BE nên chưa chọn được.',
        '<b>Quy trình không chọn tay</b> (D-7): Lưu = khởi tạo quy trình MS13, mở ngay bước 01 (giao người tạo); hệ thống xác định nhóm MS13 / MS14 / MS15 và nhánh gộp BM-00 / hai giai đoạn sau khi chốt tổng mức vốn (bước 10), Ban Tài chính xác nhận TSCĐ (bước 11) và TTMS xác nhận 04 yếu tố (bước 12). Khác cách tạo hồ sơ ĐXMS (chọn MS01.01/.02/.03 lúc tạo).',
        'Prototype chạy một hồ sơ tại một thời điểm: hồ sơ đang chạy trước đó (ĐXMS hoặc KĐT) được thay; hồ sơ KĐT cũ giữ lại ở bước đang chờ trong danh sách hồ sơ của KĐT đó.',
        'Luật: một KĐT chỉ có một hồ sơ đang xử lý; hồ sơ Phê duyệt chỉ khi KĐT chưa được phê duyệt. Không thoả thì báo dưới ô Loại hồ sơ.',
      ],
      q: ['P-59', 'P-53'], src: 'profile-management/profile-form (mode create) · /khcn-profile-management/create/:taskId',
    };
    return `<form class="pg" data-kdt-case-form>
      ${head({ title: 'Thêm mới hồ sơ', back, info, right: `<button type="button" class="vbtn secondary grey" data-go="${back}">Huỷ</button><button type="submit" class="vbtn primary" id="kc-save">Lưu</button>` })}
      <section class="vcard"><h2>Thông tin chung</h2>
        <div class="grid3">
          ${field('Mã hồ sơ', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên hồ sơ', `<input class="vctl" id="kc-name" maxlength="500" placeholder="Nhập tên hồ sơ" value="${esc(C.name)}" ${C.err.name ? 'aria-invalid="true"' : ''}>`, { req: true, err: C.err.name, cls: 'span2' })}
          ${field('Loại hồ sơ', vSelect({ id: 'kc-kind', value: C.kind, invalid: !!C.err.kind, options: [{ value: 'PD', label: 'Phê duyệt KĐT' }, { value: 'DC', label: 'Điều chỉnh KĐT', disabled: true }],
    onChange: (val) => { C.kind = val; delete C.err.kind; rerender(); } }), { req: true, err: C.err.kind })}
          ${field('Quy trình', '<input class="vctl" id="kc-proc" value="MS13 · MS14 · MS15 — hệ thống xác định sau bước 12" disabled>')}
          ${field('Khoản đầu tư', vSelect({ id: 'kc-kdt', value: code, disabled: true, options: [{ value: code, label: `${x.code} - ${x.title}` }] }), { req: true })}
          ${field('Người tạo', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section></form>`;
  }
  function saveCase() {
    const t = document.getElementById('kc-name');
    if (t) C.name = t.value;
    C.err = {};
    const x = Flow.findKdt(C.kdt);
    if (!C.name.trim()) C.err.name = 'Bạn cần nhập Tên hồ sơ.';
    if (block(x)) C.err.kind = block(x);
    if (Object.keys(C.err).length) { rerender(); return; }
    Flow.createKdtCase({ kdt: C.kdt, name: C.name.trim() });
    toast('Thêm mới thành công');
    /* Như Thêm mới hồ sơ ĐXMS (SCR-25): Lưu = start quy trình, mở ngay việc đầu tiên của người tạo. */
    const tok = Flow.state.tokens.find((t) => t.who === Flow.state.persona) || Flow.state.tokens[0];
    location.hash = tok ? '#/task/' + tok.id : '#/' + href(C.kdt) + '/edit';
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-kdt-case-form]')) { e.preventDefault(); saveCase(); } });

  /* ---------- SCR-66 Thông báo chuyển luồng (cổng "Tổng mức vốn thực tế thuộc MS13?" = Không, P-53) ----------
     Hồ sơ MS13 kết thúc "Đã chuyển luồng", hồ sơ mới của cùng KĐT theo MS14 (luồng MS14 chưa dựng — bước hiện tại lấy từ sơ đồ MS14). */
  function moved(code) {
    // Theo: profile-management/profile-detail (card Thông tin chung + bảng) — source không có màn tương đương riêng
    const x = Flow.findKdt(code);
    if (!x) return notFound('Thông báo chuyển luồng');
    const hs = meta(x).hs, old = hs.find((c) => c.st === 'moved');
    const info = {
      scr: 'SCR-66', name: 'Thông báo chuyển luồng MS14 / MS15', uc: 'UC-05-01 · WBS PH09 #176; PH02 #30 · UR-KDT-06', bpmn: 'Cổng "Tổng mức vốn thực tế thuộc MS13?" = Không → ô "MS14,15 – Chuyển xử lý" (MS13)',
      notes: [
        'Tổng mức vốn thực tế sau báo giá không thuộc ngưỡng MS13 của lĩnh vực: hồ sơ MS13 kết thúc ở trạng thái <b>Đã chuyển luồng</b>, hệ thống tạo <b>hồ sơ mới của cùng KĐT</b> theo nhóm đúng và liên kết hai hồ sơ (mặc định P-53, như 10b của ĐXMS).',
        'Đích của nhánh trong BPMN là ô chữ "MS14,15 – Chuyển xử lý", không phải sự kiện kết thúc (plan KĐT §1.2a mục 7). Dữ liệu căn cứ, danh mục, báo giá, kết quả xác nhận được sao chép sang hồ sơ mới.',
        'Luồng MS14 chưa dựng trên prototype (đợt 2): hồ sơ mới hiện bước đầu tiên theo sơ đồ MS14. Source không có màn tương đương — bố cục theo profile-detail (card Thông tin chung + bảng).',
      ],
      q: ['P-53'], src: 'profile-management/profile-detail (bố cục) · —',
    };
    const kvs = (k, v, cls) => kv(k, v, cls);
    if (!old) {
      return `<div class="pg">${head({ title: 'Thông báo chuyển luồng', back: href(code), lg: true, info })}
        <section class="vcard pad24"><div class="empty-t">Khoản đầu tư chưa có hồ sơ chuyển luồng.</div></section></div>`;
    }
    const nw = hs.find((c) => c.replaces === old.code) || hs.find((c) => c.code === old.replacedBy) || null;
    const live = old.live && Flow.state.kdt === code;
    const r = live ? Flow.kdtCheck() : null;
    const by = (n) => { const h = live && Flow.lastOf(n); return h ? `OK — ${esc(persona(h.who).name)}, ${Flow.dateOf(h.t)}` : null; };
    const th = r && r.ms13 ? `${catLabel('field', r.ms13.field)}: dưới ${ty(r.ms13.to, 0)} tỷ đồng` : null;
    const to = nw ? nw.flow : 'MS14';
    return `<div class="pg">
      ${head({ title: 'Thông báo chuyển luồng', back: href(code), lg: true, info })}
      <section class="vcard pad24 gen"><h3>Hồ sơ đã chuyển luồng</h3>
        <div class="banner-bad">Tổng mức vốn thực tế ${old.total != null ? ty(old.total) + ' tỷ đồng ' : ''}không thuộc ngưỡng khoản đầu tư đơn giản (MS13). Hồ sơ ${esc(old.code)} đã kết thúc và chuyển xử lý theo ${esc(GROUP[to] || to)}.</div>
        <div class="ginfo c3">
        ${kvs('Mã hồ sơ', esc(old.code))}${kvs('Tên hồ sơ', esc(old.title || x.title), 'span2')}
        ${kvs('Mã KĐT', `<a class="link-red" href="#/${href(code)}">${esc(code)}</a>`)}${kvs('Lĩnh vực', esc(catLabel('field', x.field)))}${kvs('Trạng thái', badge(CASE_ST.moved[0], CASE_ST.moved[1]))}
        ${kvs('Tổng mức vốn thực tế (gồm VAT)', old.total != null ? ty(old.total) + ' tỷ đồng' : null)}${kvs('Ngưỡng MS13 áp dụng', th ? esc(th) : null)}${kvs('Nhóm khoản đầu tư', esc(GROUP[to] || to))}
        ${kvs('Xác nhận hình thành TSCĐ', by(11))}${kvs('Xác nhận 04 yếu tố', by(12))}${kvs('Ngày chuyển luồng', esc(old.updated))}</div></section>
      <section class="vcard"><h3>Hồ sơ mới</h3>
        ${table([['Mã hồ sơ', 150], ['Loại hồ sơ', 150], ['Nhóm KĐT', 220], ['Bước hiện tại', 300], ['Ngày tạo', 130], ['Trạng thái', 150, 'c']], nw ? [nw] : [], (c) => `<td>${caseLink(c.code)}</td><td>Phê duyệt KĐT</td>
          <td>${esc(flowLabel(c))}</td><td>${clamp(stepName(c))}</td><td class="num">${esc(c.created)}</td><td class="c">${badge(CASE_ST[c.st][0], CASE_ST[c.st][1])}</td>`)}</section></div>`;
  }

  /* Router: #/kdt, #/kdt/create, #/kdt/<mã>, #/kdt/<mã>/edit, #/kdt/<mã>/tao-ho-so, #/kdt/<mã>/chuyen-luong. enter() khi đổi route (form mở trống / nạp bản ghi). */
  function route(parts) {
    const [b, c] = parts;
    if (!b) return list();
    if (b === 'create') return form();
    const code = decodeURIComponent(b);
    if (c === 'edit') return form();
    if (c === 'tao-ho-so') return caseCreate(code);
    if (c === 'chuyen-luong') return moved(code);
    return detail(code);
  }
  function enter(parts) {
    const [b, c] = parts;
    if (b === 'create') resetForm('create');
    else if (b && c === 'edit') resetForm('edit', decodeURIComponent(b));
    else if (b && c === 'tao-ho-so') resetCase(decodeURIComponent(b));
  }

  window.Kdt = { nvText, nvLink, route, enter, meta, costView, stepName, KDT_STAGE, sentAt, reviewOf, ttOf, RV_TONE, unitsOf, creatorsOf, inDate, csv };
})();
