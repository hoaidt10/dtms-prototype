/* T30 — Comment review kiểu Figma (phương án A: lưu trên máy người review, xuất / nhập JSON).
   Công cụ review, KHÔNG thuộc giao diện app (rule prototype-solution): không sửa màn nào, chỉ phủ một lớp lên trên.
   Plan: docs/dtms/prototype-T30-review-comment.md. Gộp phía nhóm dự án: tools/review-merge.mjs. */
(function () {
  const STORE = 'dtms-review-v1';
  const AUTHOR = 'dtms-review-author';
  const BUILD = (document.querySelector('meta[name="proto-build"]') || {}).content || 'dev';
  const TYPES = ['Giao diện', 'Nghiệp vụ', 'Lỗi', 'Câu hỏi', 'Khác'];
  /* Dữ liệu prototype chụp kèm comment để mở lại đúng ngữ cảnh (khoá dtms-proto-*; không gồm khoá của chính công cụ review). */
  const SNAP_RE = /^dtms-proto-/;
  const README = [
    'Tệp comment review prototype ĐTMS (T30). Mỗi phần tử của "comments" là một ghim người review đặt trên màn.',
    'id: mã duy nhất (gộp nhiều tệp theo id). no: số thứ tự hiện trên ghim. type: Giao diện | Nghiệp vụ | Lỗi | Câu hỏi | Khác. status: open = chưa xử lý, resolved = đã xử lý.',
    'text: nội dung comment. replies: các trả lời {author, at, text}.',
    'where: ngữ cảnh lúc ghim — route (đường dẫn sau dấu # của prototype), app (phân hệ), menu (mục menu đang chọn), screen (mã SCR + tên màn theo nút (i)), title (tiêu đề màn),',
    '  tab (tab đang mở), dialog (tiêu đề hộp thoại đang mở, nếu ghim trong hộp thoại), persona (vai đang dùng), record (ĐXMS / hồ sơ / KĐT / quy trình / trạng thái của hồ sơ đang chạy luồng demo — có thể khác bản ghi đang xem; bản ghi đang xem nằm trong route),',
    '  task (bước BPMN đang xử lý nếu ở màn xử lý task: số bước, quy trình, tên, tác nhân), demoSet (bộ hồ sơ demo), viewport + scrollTop (khung nhìn).',
    'target: phần tử được ghim — selector (CSS), tag, text (chữ của phần tử), label (nhãn trường / tiêu đề cột / chữ nút gần nhất), section (tiêu đề khối chứa nó),',
    '  offset (vị trí ghim theo tỉ lệ 0–1 trong phần tử), rect (toạ độ phần tử trên khung nhìn, px).',
    'context: chữ quanh vùng ghim (≤ 400 ký tự) để đọc hiểu mà không cần mở prototype.',
    'snapshot: khoá trong "snapshots" — ảnh chụp dữ liệu prototype (localStorage) lúc ghim; nạp lại để thấy đúng màn người review đã thấy (prototype: nút "Mở đúng ngữ cảnh"; hoặc tools/review-merge.mjs --shots).',
  ];

  /* ---------- Kho chung (T52) ----------
     Có URL kho chung (meta review-api trong index.html, hoặc ?review-api=<url> — nhớ trong localStorage, 'off' để tắt) thì comment đọc / ghi
     qua Google Apps Script (tools/review-sheet/Code.gs): ai mở prototype cũng thấy toàn bộ. Không có URL thì như T30 — chỉ lưu trên máy. */
  const API = (() => {
    let u = '';
    try {
      const q = new URLSearchParams(location.search).get('review-api');
      if (q != null) localStorage.setItem('dtms-review-api', q);
      u = localStorage.getItem('dtms-review-api') || '';
    } catch (e) { /* bỏ qua */ }
    if (u === 'off') return '';
    if (u) return u.trim();
    /* Trình duyệt tự động hoá (Playwright: e2e, guide-shots, release-check) không ghi vào kho thật — chỉ dùng khi chỉ định rõ ?review-api=. */
    if (navigator.webdriver) return '';
    return ((document.querySelector('meta[name="review-api"]') || {}).content || '').trim();
  })();
  const REMOTE = /^https?:\/\//.test(API);
  const SHARED = 'dtms-review-shared-v1'; // bản sao kho chung trên máy (xem khi mất mạng)
  const OUTBOX = 'dtms-review-outbox';     // thao tác chưa gửi được lên kho chung

  /* ---------- Lưu trữ ---------- */
  const KEY = REMOTE ? SHARED : STORE;
  const load = (k) => { try { const raw = JSON.parse(localStorage.getItem(k) || 'null'); if (raw && Array.isArray(raw.comments)) return { comments: raw.comments, snapshots: raw.snapshots || {} }; } catch (e) { /* bỏ qua */ } return null; };
  let DB = load(KEY) || { comments: [], snapshots: {} };
  /* Comment ghi trước khi có kho chung (khoá T30) — gửi lên bằng menu "Gửi … comment trên máy lên kho chung". */
  let legacy = REMOTE ? load(STORE) : null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { toast(REMOTE ? 'Bộ nhớ trình duyệt đầy — comment vẫn gửi lên kho chung.' : 'Không lưu được vào trình duyệt (bộ nhớ đầy?). Hãy Xuất JSON ngay.'); } };
  let outbox = [];
  try { outbox = REMOTE ? JSON.parse(localStorage.getItem(OUTBOX) || '[]') : []; } catch (e) { outbox = []; }
  const saveOutbox = () => { try { localStorage.setItem(OUTBOX, JSON.stringify(outbox)); } catch (e) { /* bỏ qua */ } };
  const sync = { at: '', err: '', busy: false, loaded: false };
  let author = '';
  try { author = localStorage.getItem(AUTHOR) || ''; } catch (e) { /* bỏ qua */ }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clean = (s, n) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return n && t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const now = () => new Date().toISOString();
  const fmt = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } };
  const route = () => location.hash.replace(/^#\/?/, '') || 'viec-cua-toi';
  const toast = (m) => (window.UI && window.UI.toast ? window.UI.toast(m) : null);
  const slug = (s) => String(s || 'nguoi-review').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'nguoi-review';
  function hash(str) { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  const nextNo = () => DB.comments.reduce((m, c) => Math.max(m, c.no || 0), 0) + 1;

  /* ---------- Chụp ngữ cảnh ---------- */
  function snapshot() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (SNAP_RE.test(k)) data[k] = localStorage.getItem(k); }
    const key = 's' + hash(JSON.stringify(data));
    if (!DB.snapshots[key]) DB.snapshots[key] = data;
    return key;
  }
  const txt = (el) => (el ? clean(el.innerText || el.textContent, 160) : '');
  function where(target) {
    const F = window.Flow, D = window.D, st = (F && F.state) || {};
    const main = document.querySelector('.main');
    const dlg = target && target.closest('.overlay [role="dialog"], .modal, .vmodal');
    const scope = dlg || main || document.body;
    const info = scope.querySelector('.info-i[data-info]') || (main && main.querySelector('.info-i[data-info]'));
    const scr = info ? info.dataset.info : '';
    const scrName = (() => { try { const b = info && info.closest('h1, h2, h3, .pg-title'); return b ? txt(b) : ''; } catch (e) { return ''; } })();
    const p = D && D.personas ? D.personas.find((x) => x.id === st.persona) : null;
    const r = route();
    let task = null;
    if (r.startsWith('task/') && st.tokens) {
      const k = st.tokens.find((t) => String(t.id) === r.split('/')[1]);
      if (k) {
        /* Bảng bước theo quy trình của hồ sơ (như Flow T()): MS01 dùng BPMN_TASKS, MS13 / MS02 / MS22… dùng BPMN_FLOWS[họ].tasks. */
        const fam = D.familyOf ? D.familyOf(st.vars && st.vars.process) : 'MS01';
        const tasks = (fam === 'MS01' ? window.BPMN_TASKS : ((window.BPMN_FLOWS || {})[fam] || {}).tasks) || {};
        const b = tasks[k.task] || {};
        task = { token: k.id, no: k.task, process: fam, name: b.name || '', actor: b.actor || '' };
      }
    }
    let demoSet = '';
    try { const s = F.demoSet(); demoSet = s ? (s.label || s.name || s.dxms || s.kdt || '') : ''; } catch (e) { /* bỏ qua */ }
    const nav = document.querySelectorAll('.sb-nav .nav.has-active, .sb-nav .nav.active');
    return {
      route: '#/' + r,
      url: location.href.split('#')[0].split('/').slice(-2).join('/') + '#/' + r,
      app: clean((document.querySelector('.brand-text') || {}).innerText, 80),
      menu: Array.from(nav).map((x) => x.title || txt(x).replace(/\s+\d+$/, '')).filter(Boolean).join(' › '),
      screen: { scr, name: scrName },
      title: txt((main && main.querySelector('h1')) || null),
      tab: txt(scope.querySelector('.tab.on, .mt-tab.on, [role="tab"][aria-selected="true"]')),
      dialog: dlg ? txt(dlg.querySelector('h1, h2, h3, h4, .mh, .title, header')) : '',
      persona: p ? { id: p.id, name: p.name, role: p.role } : { id: st.persona || '' },
      record: { dxms: st.dxms || '', hoSo: st.code || '', kdt: st.kdt || '', process: (st.vars && st.vars.process) || '', name: clean(st.name, 160), status: st.status || '' },
      task,
      demoSet: clean(demoSet, 120),
      viewport: { w: innerWidth, h: innerHeight },
      scrollTop: main ? Math.round(main.scrollTop) : 0,
    };
  }
  /* CSS path ổn định: dừng ở phần tử có id; dùng nth-of-type cho phần còn lại. */
  function cssPath(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      if (el.id && !/^\d/.test(el.id)) { parts.unshift('#' + CSS.escape(el.id)); break; }
      let s = el.tagName.toLowerCase();
      const sib = el.parentElement ? Array.from(el.parentElement.children).filter((x) => x.tagName === el.tagName) : [];
      if (sib.length > 1) s += `:nth-of-type(${sib.indexOf(el) + 1})`;
      parts.unshift(s);
      el = el.parentElement;
    }
    return parts.join(' > ');
  }
  function labelOf(el) {
    const td = el.closest('td, th');
    if (td) {
      const table = td.closest('table'); const idx = Array.from(td.parentElement.children).indexOf(td);
      const th = table && table.querySelector(`thead tr:last-child > *:nth-child(${idx + 1})`);
      /* Tên dòng: ô đầu tiên có chữ (bỏ ô STT chỉ có số), kèm số thứ tự dòng. */
      const cells = Array.from(td.parentElement.children);
      const head = cells.find((x) => x !== td && clean(x.innerText) && !/^\d+$/.test(clean(x.innerText)));
      const stt = Array.from(td.parentElement.parentElement.children).indexOf(td.parentElement) + 1;
      if (td.closest('thead')) return 'Tiêu đề cột: ' + txt(td);
      return [th ? 'Cột: ' + txt(th) : '', `Dòng ${stt}${head ? ': ' + clean(head.innerText, 60) : ''}`].filter(Boolean).join(' · ');
    }
    const field = el.closest('.field, .fld, .form-row, .ir, label, .fg, .f');
    if (field) { const l = field.querySelector('label, .label, .k, .lbl'); if (l) return 'Trường: ' + txt(l); }
    const btn = el.closest('button, a, [role="button"]');
    if (btn) return 'Nút / liên kết: ' + (txt(btn) || btn.getAttribute('aria-label') || btn.title || '');
    return '';
  }
  function sectionOf(el) {
    const sec = el.closest('section, .vcard, .card, .panel, fieldset, .modal, .vmodal');
    if (!sec) return '';
    const h = sec.querySelector('h1, h2, h3, h4, legend') || sec.querySelector('.vcard-h, .card-h, .hd');
    return h ? txt(h) : '';
  }
  function contextOf(el) {
    let n = el;
    /* Leo lên khối cha tới khi đủ ~120 ký tự; dừng ở .main / hộp thoại để không lấy cả sidebar, topbar. */
    while (n && n.parentElement && clean(n.innerText).length < 120 && !n.matches('.main, .modal, .vmodal, #app, body')) n = n.parentElement;
    return clean(n ? n.innerText : '', 400);
  }
  function describe(el, cx, cy) {
    const r = el.getBoundingClientRect();
    return {
      selector: cssPath(el), tag: el.tagName.toLowerCase(), text: clean(el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder, 160),
      label: clean(labelOf(el), 160), section: sectionOf(el),
      offset: { x: r.width ? +((cx - r.left) / r.width).toFixed(3) : 0.5, y: r.height ? +((cy - r.top) / r.height).toFixed(3) : 0.5 },
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
      inDialog: !!el.closest('.overlay'),
    };
  }
  /* Tìm lại phần tử: theo selector + chữ; chữ lệch thì tìm phần tử cùng thẻ có đúng chữ đó. */
  function locate(c) {
    if (c.where.route !== '#/' + route()) return null;
    const t = c.target;
    if (t.inDialog && !document.querySelector('.overlay')) return null;
    let el = null;
    try { el = document.querySelector(t.selector); } catch (e) { el = null; }
    const same = (x) => !t.text || clean(x.innerText || x.value || x.getAttribute('aria-label') || x.placeholder, 160) === t.text;
    if (el && same(el)) return el;
    if (t.text) {
      const root = t.inDialog ? document.querySelector('.overlay') : document.getElementById('app');
      const hit = root && Array.from(root.querySelectorAll(t.tag)).find(same);
      if (hit) return hit;
    }
    return el && !t.text ? el : null;
  }

  /* ---------- Lớp phủ: nút nổi, ghim, popover, panel ---------- */
  const layer = document.createElement('div');
  layer.className = 'rv-layer';
  document.body.appendChild(layer);
  const hl = document.createElement('div'); hl.className = 'rv-hl'; layer.appendChild(hl);
  const pins = document.createElement('div'); pins.className = 'rv-pins'; layer.appendChild(pins);
  const fab = document.createElement('div'); fab.className = 'rv-fab'; layer.appendChild(fab);
  /* hoaidt10 25/11: ghim comment mặc định ẩn (không che giao diện); bật lại bằng menu comment › Hiện ghim, nhớ theo trình duyệt. Chế độ comment vẫn hiện ghim. */
  let pop = null, panel = null, menuOpen = false, mode = false, hidePins = (() => { try { return localStorage.getItem('dtms-review-hide-pins') !== '0'; } catch (e) { return true; } })(), panelFilter = 'screen';
  const SVG = {
    cmt: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  };
  const openCount = () => DB.comments.filter((c) => c.status !== 'resolved').length;
  const syncText = () => 'Kho chung · ' + (sync.err ? `lỗi: ${esc(sync.err)}` : sync.at ? `cập nhật ${fmt(sync.at)}` : 'đang tải…')
    + (outbox.length ? ` · ${outbox.length} chờ gửi` : '');
  function drawFab() {
    const n = openCount();
    fab.innerHTML = `<button class="rv-btn ${mode ? 'on' : ''}" id="rv-fab" title="Comment review (phím C)" aria-label="Comment review">${SVG.cmt}${n ? `<span class="rv-count">${n}</span>` : ''}</button>
      ${menuOpen ? `<div class="rv-menu" role="menu">
        <div class="rv-mh">Comment review <small>(không thuộc giao diện app)</small></div>
        ${REMOTE ? `<div class="rv-sync ${sync.err ? 'err' : ''}">${syncText()}</div>` : ''}
        <button data-rv="mode">${mode ? 'Tắt' : 'Bật'} chế độ comment <kbd>C</kbd></button>
        <button data-rv="panel">Danh sách comment (${DB.comments.length})</button>
        <button data-rv="pins">${hidePins ? 'Hiện' : 'Ẩn'} ghim</button>
        ${REMOTE ? `<button data-rv="refresh">Tải lại từ kho chung</button>
        ${legacy && legacy.comments.length ? `<button data-rv="legacy">Gửi ${legacy.comments.length} comment trên máy lên kho chung</button>` : ''}
        <button data-rv="export-shared">Tải JSON toàn bộ kho chung</button>`
        : '<button data-rv="export">Xuất JSON gửi nhóm dự án</button>'}
        <button data-rv="import">Nhập JSON…</button>
        <button data-rv="author">Tên người review: <b>${esc(author || 'chưa đặt')}</b></button>
      </div>` : ''}`;
  }
  function setMode(on) {
    mode = on; menuOpen = false;
    document.body.classList.toggle('rv-mode', on);
    if (!on) hl.style.display = 'none';
    drawFab(); schedule();
    if (on) toast('Chế độ comment: bấm vào chỗ cần góp ý. Esc để thoát.');
  }

  function place() {
    if (hidePins && !mode) { pins.innerHTML = ''; return; }
    const html = [];
    DB.comments.forEach((c) => {
      const el = locate(c);
      c._lost = !el && c.where.route === '#/' + route();
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      const x = r.left + r.width * (c.target.offset.x ?? 0.5), y = r.top + r.height * (c.target.offset.y ?? 0.5);
      if (y < 0 || y > innerHeight || x < 0 || x > innerWidth) return;
      html.push(`<button class="rv-pin ${c.status === 'resolved' ? 'done' : ''} ${pop && pop.dataset.id === c.id ? 'cur' : ''}" data-pin="${esc(c.id)}" style="left:${x}px;top:${y}px" title="${esc(c.author)}: ${esc(clean(c.text, 80))}">${c.no}</button>`);
    });
    pins.innerHTML = html.join('');
  }
  let raf = 0;
  const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; place(); if (panel) drawPanel(); }); };

  function closePop() { if (pop) { pop.remove(); pop = null; } schedule(); }
  function popAt(x, y, html, id) {
    closePop();
    pop = document.createElement('div');
    pop.className = 'rv-pop';
    if (id) pop.dataset.id = id;
    pop.innerHTML = html;
    layer.appendChild(pop);
    const w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.max(8, Math.min(x + 14, innerWidth - w - 8)) + 'px';
    pop.style.top = Math.max(8, Math.min(y - 10, innerHeight - h - 8)) + 'px';
    const ta = pop.querySelector('textarea, input'); if (ta) ta.focus();
    return pop;
  }
  const typeSel = (v) => `<select class="rv-type">${TYPES.map((t) => `<option ${t === v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  const whoInput = () => (author ? '' : `<input class="rv-author" placeholder="Tên của anh/chị (lưu cho các lần sau)" maxlength="80">`);
  function takeAuthor(root) {
    const a = root.querySelector('.rv-author');
    if (a) { const v = a.value.trim(); if (!v) { a.focus(); a.classList.add('err'); return false; } author = v; try { localStorage.setItem(AUTHOR, v); } catch (e) { /* bỏ qua */ } }
    return true;
  }

  function compose(el, cx, cy) {
    const tgt = describe(el, cx, cy);
    const ctx = where(el);
    const p = popAt(cx, cy, `<div class="rv-ph">Comment mới <span class="rv-where">${esc(ctx.screen.scr || ctx.title || ctx.route)}${tgt.label ? ' · ' + esc(clean(tgt.label, 50)) : ''}</span></div>
      ${whoInput()}${typeSel('Giao diện')}
      <textarea class="rv-text" rows="4" placeholder="Nhập góp ý… (Ctrl+Enter để lưu)"></textarea>
      <div class="rv-act"><button class="rv-b2" data-rv="cancel">Hủy</button><button class="rv-b1" data-rv="save">Lưu</button></div>`);
    p._new = { tgt, ctx, cx, cy, el };
    hl.style.display = 'none';
  }
  function saveNew() {
    const n = pop._new, text = pop.querySelector('.rv-text').value.trim();
    if (!takeAuthor(pop)) return;
    if (!text) { pop.querySelector('.rv-text').focus(); return; }
    const c = {
      id: `c-${slug(author)}-${Date.now().toString(36)}`, no: nextNo(), author, createdAt: now(), updatedAt: now(),
      type: pop.querySelector('.rv-type').value, status: 'open', text, replies: [],
      where: n.ctx, target: n.tgt, context: contextOf(n.el), snapshot: snapshot(), build: BUILD,
    };
    commit({ op: 'add', comment: c, snapshot: REMOTE ? { key: c.snapshot, data: DB.snapshots[c.snapshot] } : undefined, base: base() });
    closePop(); drawFab();
    toast(REMOTE ? `Đã lưu comment #${c.no} — đang gửi lên kho chung.` : `Đã lưu comment #${c.no}.`);
  }

  function thread(c, x, y) {
    const w = c.where;
    const meta = [w.screen.scr && `${w.screen.scr}${w.screen.name ? ' · ' + w.screen.name : ''}`, w.title && w.title !== w.screen.name ? w.title : '', w.tab && 'Tab: ' + w.tab, w.dialog && 'Hộp thoại: ' + w.dialog,
      w.persona && w.persona.name && `Vai: ${w.persona.name} (${w.persona.role || ''})`, w.task && `Bước ${w.task.no}: ${w.task.name}`,
      (w.record.hoSo || w.record.dxms || w.record.kdt) && [w.record.dxms, w.record.hoSo, w.record.kdt].filter(Boolean).join(' / '), c.target.label].filter(Boolean);
    popAt(x, y, `<div class="rv-ph"><b>#${c.no}</b> · ${esc(c.type)} <span class="rv-st ${c.status}">${c.status === 'resolved' ? 'Đã xử lý' : 'Chưa xử lý'}</span>
        <button class="rv-x" data-rv="close" aria-label="Đóng">×</button></div>
      <div class="rv-meta">${meta.map((m) => `<div>${esc(m)}</div>`).join('')}</div>
      <div class="rv-msg"><div class="rv-mh2"><b>${esc(c.author)}</b> <span>${fmt(c.createdAt)}</span></div><div class="rv-body">${esc(c.text)}</div></div>
      ${c.replies.map((r) => `<div class="rv-msg rep"><div class="rv-mh2"><b>${esc(r.author)}</b> <span>${fmt(r.at)}</span></div><div class="rv-body">${esc(r.text)}</div></div>`).join('')}
      ${whoInput()}<textarea class="rv-text" rows="2" placeholder="Trả lời… (Ctrl+Enter để gửi)"></textarea>
      <div class="rv-act">
        <button class="rv-b2" data-rv="ctx" title="Nạp lại dữ liệu prototype lúc ghim và mở đúng màn">Mở đúng ngữ cảnh</button>
        <button class="rv-b2" data-rv="toggle">${c.status === 'resolved' ? 'Mở lại' : 'Đã xử lý'}</button>
        ${c.author === author ? '<button class="rv-b2 danger" data-rv="del">Xoá</button>' : ''}
        <button class="rv-b1" data-rv="reply">Gửi</button></div>`, c.id);
    schedule();
  }
  const byId = (id) => DB.comments.find((c) => c.id === id);
  function reply() {
    const c = byId(pop.dataset.id), text = pop.querySelector('.rv-text').value.trim();
    if (!c || !takeAuthor(pop) || !text) return;
    commit({ op: 'reply', id: c.id, reply: { author, at: now(), text } });
    const r = pop.getBoundingClientRect(); thread(byId(c.id), r.left - 14, r.top + 10);
  }
  /* Nạp ảnh chụp dữ liệu prototype lúc ghim rồi tải lại trang ở đúng route. Kho chung: ảnh chụp tải về khi cần. */
  async function openContext(c) {
    let snap = DB.snapshots[c.snapshot];
    if (!snap && REMOTE && c.snapshot) {
      try { const r = await call('GET', null, 'op=snap&key=' + encodeURIComponent(c.snapshot)); snap = r && r.data; if (snap) { DB.snapshots[c.snapshot] = snap; save(); } }
      catch (e) { toast('Không tải được ảnh chụp dữ liệu từ kho chung — mở màn với dữ liệu hiện tại.'); }
    }
    if (snap && !confirm('Dữ liệu luồng hiện tại trên máy này sẽ được thay bằng dữ liệu lúc comment được ghim (comment không bị ảnh hưởng). Tiếp tục?')) return;
    if (snap) {
      for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (SNAP_RE.test(k)) localStorage.removeItem(k); }
      Object.keys(snap).forEach((k) => localStorage.setItem(k, snap[k]));
    }
    try { sessionStorage.setItem('dtms-review-focus', JSON.stringify({ id: c.id, scrollTop: c.where.scrollTop })); } catch (e) { /* bỏ qua */ }
    location.hash = c.where.route;
    location.reload();
  }

  /* ---------- Panel danh sách ---------- */
  function drawPanel() {
    if (!panel) return;
    const here = '#/' + route();
    const list = DB.comments.filter((c) => panelFilter === 'all' || (panelFilter === 'open' ? c.status !== 'resolved' : c.where.route === here))
      .slice().sort((a, b) => a.no - b.no);
    const sig = JSON.stringify([panelFilter, here, REMOTE ? syncText() : '', list.map((c) => [c.id, c.no, c.status, c.replies.length, !!c._lost])]);
    if (panel._sig === sig) return;
    panel._sig = sig;
    panel.innerHTML = `<div class="rv-ph">Comment review${REMOTE ? ' · kho chung' : ''} <button class="rv-x" data-rv="panel-close" aria-label="Đóng">×</button></div>
      ${REMOTE ? `<div class="rv-sync ${sync.err ? 'err' : ''}">${syncText()}</div>` : ''}
      <div class="rv-filt">${[['screen', 'Màn này'], ['open', 'Chưa xử lý'], ['all', 'Tất cả']].map(([k, l]) => `<button class="${panelFilter === k ? 'on' : ''}" data-filt="${k}">${l}</button>`).join('')}</div>
      <div class="rv-list">${list.length ? list.map((c) => `<button class="rv-item ${c.status}" data-item="${esc(c.id)}">
        <span class="rv-no">${c.no}</span><span class="rv-it"><span class="rv-l1">${esc(c.author)} · ${esc(c.type)}${c._lost ? ' · <i>mất neo</i>' : ''}</span>
        <span class="rv-l2">${esc(clean(c.text, 120))}</span><span class="rv-l3">${esc([c.where.screen.scr, c.where.title, c.target.label].filter(Boolean).join(' · '))}</span></span></button>`).join('')
        : '<div class="rv-empty">Chưa có comment.</div>'}</div>
      <div class="rv-act">${REMOTE ? '<button class="rv-b2" data-rv="refresh">Tải lại</button><button class="rv-b1" data-rv="export-shared">Tải JSON</button>'
        : '<button class="rv-b2" data-rv="import">Nhập JSON…</button><button class="rv-b1" data-rv="export">Xuất JSON</button>'}</div>`;
  }
  function togglePanel(on) {
    if (on && !panel) { panel = document.createElement('aside'); panel.className = 'rv-panel'; layer.appendChild(panel); drawPanel(); }
    if (!on && panel) { panel.remove(); panel = null; }
  }
  function goTo(c) {
    if (c.where.route !== '#/' + route()) {
      if (!confirm(`Comment #${c.no} ở màn khác (${c.where.screen.scr || c.where.route}). Mở màn đó? (Nếu màn cần đúng hồ sơ / vai lúc ghim, dùng "Mở đúng ngữ cảnh".)`)) return;
      location.hash = c.where.route;
    }
    setTimeout(() => {
      const el = locate(c);
      if (el) { el.scrollIntoView({ block: 'center' }); setTimeout(() => { const r = el.getBoundingClientRect(); thread(c, r.left + r.width * c.target.offset.x, r.top + r.height * c.target.offset.y); }, 50); }
      else thread(c, innerWidth - 720, 120);
    }, 80);
  }

  /* ---------- Xuất / nhập ---------- */
  function download(out, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
  function exportJson() {
    const used = new Set(DB.comments.map((c) => c.snapshot));
    const snaps = {}; used.forEach((k) => { if (DB.snapshots[k]) snaps[k] = DB.snapshots[k]; });
    const out = {
      format: 'dtms-prototype-review', version: 1, readme: README,
      prototype: { build: BUILD, exportedFrom: location.href.split('#')[0].split(/[\\/]/).slice(-2).join('/') },
      reviewer: author, exportedAt: now(),
      comments: DB.comments.map((c) => { const o = Object.assign({}, c); delete o._lost; return o; }),
      snapshots: snaps,
    };
    const name = `review-${slug(author)}-${stamp()}.json`;
    download(out, name);
    toast(`Đã xuất ${DB.comments.length} comment ra ${name} — gửi tệp này cho nhóm dự án.`);
    return out;
  }
  /* Kho chung: tải toàn bộ (kèm ảnh chụp dữ liệu) từ máy chủ — cùng định dạng, dùng được cho tools/review-merge.mjs. */
  async function exportShared() {
    try {
      const r = await call('GET', null, 'op=export');
      if (!r || !r.ok) throw new Error((r && r.error) || 'lỗi kho chung');
      delete r.ok; r.readme = README;
      const name = `review-kho-chung-${stamp()}.json`;
      download(r, name);
      toast(`Đã tải ${r.comments.length} comment của kho chung ra ${name}.`);
    } catch (e) { toast('Không tải được từ kho chung: ' + errText(e)); }
  }
  /* Gộp theo id: comment mới thì thêm (đổi số nếu trùng), comment đã có thì gộp trả lời và lấy trạng thái bản mới hơn. */
  function merge(data) {
    let add = 0, upd = 0;
    Object.assign(DB.snapshots, data.snapshots || {});
    data.comments.forEach((c) => {
      const old = byId(c.id);
      if (!old) { const n = JSON.parse(JSON.stringify(c)); n.replies = n.replies || []; if (DB.comments.some((x) => x.no === n.no)) n.no = nextNo(); DB.comments.push(n); add++; return; }
      const seen = new Set(old.replies.map((r) => r.at + '|' + r.text));
      (c.replies || []).forEach((r) => { if (!seen.has(r.at + '|' + r.text)) { old.replies.push(r); upd++; } });
      old.replies.sort((a, b) => (a.at < b.at ? -1 : 1));
      if ((c.updatedAt || '') > (old.updatedAt || '')) { old.status = c.status; old.text = c.text; old.updatedAt = c.updatedAt; }
    });
    return { add, upd };
  }
  function importData(data) {
    if (!data || data.format !== 'dtms-prototype-review' || !Array.isArray(data.comments)) throw new Error('Không phải tệp comment review prototype ĐTMS.');
    const comments = data.comments.map((c) => { const o = Object.assign({}, c); delete o._lost; return o; });
    return commit({ op: 'import', comments, snapshots: data.snapshots || {}, base: base() });
  }

  /* ---------- Thao tác ghi: áp ngay trên máy, có kho chung thì xếp hàng gửi lên ---------- */
  const base = () => (/^https?:$/.test(location.protocol) ? location.href.split('#')[0].split('?')[0] : '');
  /* Áp một thao tác lên DB — lặp lại không sao (dùng lại sau mỗi lần tải kho chung cho thao tác chưa gửi xong). */
  function apply(op) {
    if (op.op === 'add') {
      if (op.snapshot && op.snapshot.data) DB.snapshots[op.snapshot.key] = op.snapshot.data;
      if (!byId(op.comment.id)) DB.comments.push(JSON.parse(JSON.stringify(op.comment)));
      return null;
    }
    if (op.op === 'import') return merge(op);
    const c = byId(op.id);
    if (!c) return null;
    if (op.op === 'reply') { if (!c.replies.some((r) => r.at === op.reply.at && r.text === op.reply.text)) c.replies.push(op.reply); c.updatedAt = op.reply.at; }
    else if (op.op === 'status') { c.status = op.status; c.updatedAt = op.at; }
    else if (op.op === 'delete') DB.comments = DB.comments.filter((x) => x.id !== op.id);
    return null;
  }
  function commit(op) {
    const r = apply(op) || { add: 0, upd: 0 };
    save(); drawFab(); schedule();
    if (REMOTE) { outbox.push(op); saveOutbox(); flush(); }
    return r;
  }
  const errText = (e) => (e && e.name === 'AbortError' ? 'hết thời gian chờ' : e instanceof TypeError ? 'không kết nối được' : (e && e.message) || String(e));
  async function call(method, body, qs) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const t = setTimeout(() => ctl && ctl.abort(), 25000);
    try {
      const url = method === 'GET' ? `${API}${API.includes('?') ? '&' : '?'}${qs}&t=${Date.now()}` : API;
      const res = await fetch(url, method === 'GET' ? { signal: ctl && ctl.signal }
        : { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctl && ctl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } finally { clearTimeout(t); }
  }
  /* Gửi lần lượt hàng đợi; lỗi mạng thì giữ lại để lần sau gửi tiếp, máy chủ từ chối thì bỏ thao tác đó và báo. Xong thì tải lại kho chung. */
  async function flush() {
    if (!REMOTE) return;
    /* Đang gửi / tải dở: đánh dấu để chạy thêm một lượt ngay sau đó (thao tác mới không phải chờ tới lượt 30 giây sau). */
    if (sync.busy) { sync.again = true; return; }
    sync.busy = true;
    try {
      let failed = false;
      do {
        sync.again = false;
        while (outbox.length) {
          const op = outbox[0];
          let r;
          try { r = await call('POST', op); } catch (e) { sync.err = errText(e); failed = true; break; }
          outbox.shift(); saveOutbox();
          if (!r || !r.ok) toast('Kho chung từ chối: ' + ((r && r.error) || 'lỗi không rõ'));
        }
        await pull();
      } while (sync.again && !failed);
    } finally { sync.busy = false; drawFab(); }
  }
  async function pull() {
    try {
      const r = await call('GET', null, 'op=list');
      if (!r || !r.ok || !Array.isArray(r.comments)) throw new Error((r && r.error) || 'phản hồi không hợp lệ');
      DB = { comments: r.comments.map((c) => Object.assign({ replies: [] }, c)), snapshots: DB.snapshots };
      outbox.forEach(apply);
      save();
      sync.at = now(); sync.loaded = true;
      if (!outbox.length) sync.err = '';
    } catch (e) { sync.err = errText(e); }
    drawFab(); schedule(); focusLink();
  }
  /* Gửi comment ghi trước khi có kho chung; xong thì cất bản cũ sang khoá …-da-gui (không xoá). */
  function pushLegacy() {
    if (!legacy || !legacy.comments.length) return;
    if (!confirm(`Gửi ${legacy.comments.length} comment đang lưu riêng trên máy này lên kho chung? Mọi người sẽ thấy các comment này.`)) return;
    const r = importData({ format: 'dtms-prototype-review', comments: legacy.comments, snapshots: legacy.snapshots });
    try { localStorage.setItem(STORE + '-da-gui', localStorage.getItem(STORE)); localStorage.removeItem(STORE); } catch (e) { /* bỏ qua */ }
    legacy = null;
    toast(`Đang gửi ${r.add} comment lên kho chung.`);
  }
  /* Link ?rv=<id> (cột link trên Sheet): mở đúng comment — có ảnh chụp dữ liệu thì hỏi nạp lại ngữ cảnh. */
  let linkId = (() => { try { return new URLSearchParams(location.search).get('rv') || ''; } catch (e) { return ''; } })();
  function focusLink() {
    if (!linkId) return;
    const c = byId(linkId);
    if (!c) { if (!REMOTE || sync.loaded) { toast('Không thấy comment trong link (có thể đã bị xoá).'); linkId = ''; } return; }
    linkId = '';
    try { const u = new URL(location.href); u.searchParams.delete('rv'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) { /* bỏ qua */ }
    if (c.snapshot) openContext(c); else goTo(c);
  }
  function importFile() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.multiple = true;
    inp.onchange = async () => {
      let add = 0, upd = 0;
      for (const f of inp.files) {
        try { const r = importData(JSON.parse(await f.text())); add += r.add; upd += r.upd; } catch (e) { toast(`${f.name}: ${e.message}`); }
      }
      toast(`Đã nhập: ${add} comment mới, ${upd} trả lời mới.`);
      if (panel) { panel._sig = ''; drawPanel(); }
    };
    inp.click();
  }

  /* ---------- Sự kiện ---------- */
  const isUi = (t) => t.closest('.rv-layer');
  document.addEventListener('mousemove', (e) => {
    if (!mode) return;
    if (isUi(e.target)) { hl.style.display = 'none'; return; }
    const r = e.target.getBoundingClientRect();
    Object.assign(hl.style, { display: 'block', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  }, true);
  /* Ở chế độ comment: chặn mọi click vào app (capture) để bấm là ghim, không bấm nhầm nút của app. */
  ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach((ev) => document.addEventListener(ev, (e) => {
    if (!mode || isUi(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    if (ev === 'click') { if (pop) { closePop(); return; } compose(e.target, e.clientX, e.clientY); }
  }, true));
  layer.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rv], [data-pin], [data-item], [data-filt]');
    if (!b) return;
    e.stopPropagation();
    if (b.id === 'rv-fab') return;
    if (b.dataset.pin) { const c = byId(b.dataset.pin), r = b.getBoundingClientRect(); return thread(c, r.right, r.top); }
    if (b.dataset.item) return goTo(byId(b.dataset.item));
    if (b.dataset.filt) { panelFilter = b.dataset.filt; panel._sig = ''; return drawPanel(); }
    const a = b.dataset.rv;
    if (a !== 'export' && a !== 'import') menuOpen = false;
    if (a === 'refresh') { drawFab(); return flush(); }
    if (a === 'legacy') { drawFab(); return pushLegacy(); }
    if (a === 'export-shared') { drawFab(); return exportShared(); }
    if (a === 'mode') setMode(!mode);
    else if (a === 'panel') { togglePanel(!panel); drawFab(); }
    else if (a === 'panel-close') togglePanel(false);
    else if (a === 'pins') { hidePins = !hidePins; try { localStorage.setItem('dtms-review-hide-pins', hidePins ? '1' : '0'); } catch (e) { /* bỏ qua */ } drawFab(); schedule(); }
    else if (a === 'export') { menuOpen = false; drawFab(); exportJson(); }
    else if (a === 'import') { menuOpen = false; drawFab(); importFile(); }
    else if (a === 'author') { const v = prompt('Tên người review (hiện trên comment):', author); if (v != null && v.trim()) { author = v.trim(); try { localStorage.setItem(AUTHOR, author); } catch (err) { /* bỏ qua */ } } drawFab(); }
    else if (a === 'cancel' || a === 'close') closePop();
    else if (a === 'save') saveNew();
    else if (a === 'reply') reply();
    else if (a === 'toggle') { const c = byId(pop.dataset.id); commit({ op: 'status', id: c.id, status: c.status === 'resolved' ? 'open' : 'resolved', at: now() }); const r = pop.getBoundingClientRect(); thread(byId(c.id), r.left - 14, r.top + 10); }
    else if (a === 'del') { const c = byId(pop.dataset.id); if (confirm(`Xoá comment #${c.no}?`)) { closePop(); commit({ op: 'delete', id: c.id, author }); } }
    else if (a === 'ctx') openContext(byId(pop.dataset.id));
  });
  fab.addEventListener('click', (e) => { if (e.target.closest('#rv-fab')) { e.stopPropagation(); menuOpen = !menuOpen; drawFab(); } });
  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]');
    if (e.key === 'Escape' && (pop || mode)) { e.stopPropagation(); if (pop) closePop(); else setMode(false); return; }
    if (typing) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && pop && pop.contains(e.target)) { e.preventDefault(); if (pop._new) saveNew(); else reply(); }
      return;
    }
    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !e.altKey) setMode(!mode);
  }, true);
  document.addEventListener('click', (e) => { if (menuOpen && !isUi(e.target)) { menuOpen = false; drawFab(); } });
  /* App vẽ lại toàn bộ DOM sau mỗi thao tác: đặt lại ghim mỗi khi DOM đổi, khi cuộn, khi đổi cỡ cửa sổ. */
  new MutationObserver((list) => { if ((DB.comments.length || panel) && list.some((m) => !layer.contains(m.target))) schedule(); }).observe(document.body, { childList: true, subtree: true });
  const busy = () => { if (DB.comments.length || panel) schedule(); };
  document.addEventListener('scroll', busy, { capture: true, passive: true });
  addEventListener('resize', busy);
  addEventListener('hashchange', () => { closePop(); schedule(); });

  /* Sau "Mở đúng ngữ cảnh": cuộn về chỗ cũ và mở luồng trao đổi. */
  try {
    const f = JSON.parse(sessionStorage.getItem('dtms-review-focus') || 'null');
    if (f) { sessionStorage.removeItem('dtms-review-focus'); const c = byId(f.id); if (c) setTimeout(() => { const m = document.querySelector('.main'); if (m) m.scrollTop = f.scrollTop || 0; goTo(c); }, 300); }
  } catch (e) { /* bỏ qua */ }

  drawFab(); schedule();
  /* Kho chung: tải ngay, rồi 30 giây một lần khi tab đang mở; quay lại tab thì tải luôn. */
  if (REMOTE) {
    flush();
    setInterval(() => { if (!document.hidden) flush(); }, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) flush(); });
  } else focusLink();
  window.Review = { data: () => DB, exportJson, importData, setMode, locate, where, remote: REMOTE, sync: () => flush(), status: () => ({ ...sync, outbox: outbox.length }) };
})();
