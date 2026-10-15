/* Helper giao diện dùng chung: escape, icon, định dạng số, nhãn ❓, modal, toast, SCR-21 trình ký. */
(function () {
  const D = window.D;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const SVG = {
    bell: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18.999 9.704V9c0-3.866-3.134-7-7-7s-7 3.134-7 7v.704a4.5 4.5 0 0 1-.719 2.374L3.131 13.8c-1.049 1.574-.248 3.713 1.577 4.21a30.6 30.6 0 0 0 14.582 0c1.824-.497 2.625-2.636 1.576-4.21l-1.148-1.722a4.5 4.5 0 0 1-.719-2.374Z" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 19c.655 1.748 2.422 3 4.5 3s3.845-1.252 4.5-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    chev: '<svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    right: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m14 14 3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m2.5 6.2 2.2 2.2 4.8-4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    spark: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8l5.1-1.4L8 1.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    sign: '<svg viewBox="0 0 16 16" fill="none"><path d="M2 12.5c2-3 3.5-5 4.5-5S6 11 7 11s2-3 3-3 1 2 2 2 1.5-1 2-1.5M2 14.5h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.4"/></svg>',
    play: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 3v10l8-5-8-5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    /* Icon của @khcn-core/ui (bộ Hugeicons: vht-add-01, vht-edit-02, vht-delete-02, vht-arrow-left-02, vht-upload-04). */
    add: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m16.214 4.982 1.402-1.401a1.982 1.982 0 0 1 2.803 2.803l-1.401 1.402m-2.804-2.804-5.234 5.234c-1.045 1.046-1.568 1.568-1.924 2.205S8.842 14.366 8.5 15.5c1.134-.342 1.782-.698 2.419-1.054s1.16-.879 2.205-1.924l5.234-5.234m-2.804-2.804 2.804 2.804" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M21 12c0 4.243 0 6.364-1.318 7.682S16.242 21 12 21s-6.364 0-7.682-1.318S3 16.242 3 12s0-6.364 1.318-7.682S7.758 3 12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    del: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m19.5 5.5-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5M3 5.5h18m-4.944 0-.683-1.408c-.453-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.035 2c-1.066 0-1.599 0-2.04.234a2 2 0 0 0-.278.18c-.395.303-.616.788-1.058 1.757L8.053 5.5M9.5 16.5v-6M14.5 16.5v-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h16M8.5 16.5S4 13.186 4 12s4.5-4.5 4.5-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upload: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4v12M16 7.5S13.054 4 12 4 8 7.5 8 7.5M20 16c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 14.5v-10M16 11s-2.946 3.5-4 3.5S8 11 8 11M20 16.5c0 2.482-.518 3-3 3H7c-2.482 0-3-.518-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    file: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2.5V3c0 2.828 0 4.243.879 5.121C14.757 9 16.172 9 19 9h.5M20 10.657V14c0 3.771 0 5.657-1.172 6.828S15.771 22 12 22s-5.657 0-6.828-1.172S4 17.771 4 14V9.456c0-3.245 0-4.868.886-5.967a4 4 0 0 1 .603-.603C6.59 2 8.211 2 11.456 2c.705 0 1.058 0 1.381.114q.1.036.197.082c.31.148.559.397 1.058.896l4.736 4.736c.577.577.866.866 1.018 1.233S20 9.841 20 10.657Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 16.5v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="1.1" fill="currentColor"/></svg>',
    tool: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.5 7.3 16.7 3.5l-2.3 2.3a3 3 0 0 0 0 4.2l.1.1-8.7 8.7a1.5 1.5 0 0 0 2.1 2.1l8.7-8.7.1.1a3 3 0 0 0 4.2 0l2.3-2.3-3.8-3.8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    /* E-Form (ecat e-form-list): vht-tablet-pen (Thiết kế), vht-clock-02 (Xem lịch sử), ic-excel.svg (Xuất excel). */
    pen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.5 21H11c-3.3 0-4.95 0-5.975-1.025S4 17.3 4 14V8c0-3.3 0-4.95 1.025-5.975S7.7 1 11 1h1c3.3 0 4.95 0 5.975 1.025S19 4.7 19 8v2M9.5 5h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="m20.1 13.6-5.6 5.6-1.9.5.5-1.9 5.6-5.6a1 1 0 0 1 1.4 0 1 1 0 0 1 0 1.4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    excel: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#1D6F42"/><path d="m8 8 8 8M16 8l-8 8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
    reload: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.5 12a8.5 8.5 0 1 1-2.49-6.01M20.5 4v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rocket: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M13.5 17.5 10 14l-.8-.8c-.6-.6-.6-1.2 0-2.2C11 8 13.5 4 20 4c0 6.5-4 9-7 10.8-1 .6-1.6.6-2.2 0" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 12.5 6.5 12l2-3h3.5M11.5 14.5l.5 3 3-2V12" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.5 17.5c-1 1-1.5 3-1.5 3s2-.5 3-1.5a1.4 1.4 0 0 0-1.5-1.5Z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  };
  const icon = (name) => SVG[name] || (window.ICONS && window.ICONS[name]) || '';

  const persona = (id) => D.personas.find((p) => p.id === id);
  const initials = (p) => (p ? p.short.replace('TGĐ ', '').slice(0, 2).toUpperCase() : '?');
  const avatar = (id, cls) => {
    const p = persona(id);
    return `<span class="avatar ${cls || ''}" title="${esc(p ? p.name : '')}">${esc(initials(p))}</span>`;
  };
  const ty = (n, d) => (n == null ? '—' : n.toLocaleString('vi-VN', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }));
  const pad2 = (n) => String(n).padStart(2, '0');
  const cqcmUnit = (id) => { const c = D.cqcm.find((x) => x.id === id); return c ? c.unit : ''; };

  /* ---------- Nhãn ❓ ---------- */
  function qChip(id) {
    const has = window.Flow.state.qNotes[id];
    return `<button type="button" class="q${has ? ' has-note' : ''}" data-q="${id}" title="Giả định — cần VHT xác nhận">❓ ${id}${has ? ' ✓' : ''}</button>`;
  }
  function qStrip(ids) {
    if (!ids || !ids.length) return '';
    return `<div class="q-strip"><span class="faint" style="font-size:12px">Giả định — cần VHT xác nhận:</span>${ids.map(qChip).join('')}</div>`;
  }

  /* ---------- Modal ---------- */
  function modal(html, opts) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = opts && opts.v
      ? `<div class="vmodal ${opts.v}" role="dialog" aria-modal="true">${html}</div>`
      : `<div class="modal ${opts && opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) close(); });
    const onKey = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    return { el: ov, close };
  }

  function toast(msg, kind) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.innerHTML = msg;
    wrap.appendChild(t);
    while (wrap.children.length > 3) wrap.firstChild.remove();
    setTimeout(() => t.remove(), 3800);
  }

  /* ---------- vht-modal: header 60 có vạch, tiêu đề 20/600, thân 20/24/24 gap 16, nút căn phải gap 12 ----------
     o: { title, body, actions, size: 'sm' | 'md' | 'lg' } */
  function vModal(o) {
    return modal(`<div class="vmodal-h"><h3>${esc(o.title)}</h3><button class="vmodal-x" data-close aria-label="Đóng">${icon('x')}</button></div>
      <div class="vmodal-b">${o.body}${o.actions ? `<div class="vmodal-acts">${o.actions}</div>` : ''}</div>`, { v: o.size || 'sm' });
  }

  /* vht-radio: nút 16px, viền #cfd4dc; chọn → viền và chấm #ff3045. attrs: thuộc tính data-* của lựa chọn. */
  const vRadio = (label, on, attrs, dis) => `<label class="vradio-opt ${on ? 'on' : ''} ${dis ? 'dis' : ''}" ${dis ? '' : attrs || ''}><span class="rb"></span><span>${label}</span></label>`;

  /* Hộp thoại nhập nhận xét khi hành động bắt buộc lý do (my-task-add-comment-dialog). */
  function askReason(title) {
    return new Promise((resolve) => {
      const m = vModal({ title, body: `<div class="vfield" id="rf"><div class="lr"><label>Nội dung nhận xét</label><span class="req">*</span></div>
          <textarea class="vctl ta" id="rsn" rows="4" placeholder="Nội dung"></textarea><p class="msg" hidden>Bạn cần nhập Nội dung nhận xét.</p></div>`,
        actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="ok">Xác nhận</button>' });
      const ta = m.el.querySelector('#rsn');
      ta.focus();
      m.el.querySelector('#ok').onclick = () => {
        if (!ta.value.trim()) { m.el.querySelector('#rf').classList.add('invalid'); m.el.querySelector('#rf .msg').hidden = false; return; }
        m.close(); resolve(ta.value.trim());
      };
      m.el.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target === m.el) resolve(null); });
    });
  }

  /* ---------- Hộp thoại trình ký (vht-modal) ----------
     MS01: ký cứng ghi lý do + bản scan ngay tại hộp thoại (comment #11). Hồ sơ KĐT (MS13): hộp thoại là bước 75 "Chọn hình thức ký" của khối ký chung
     (D-34, B3-1) — hồ sơ Mật khoá VOffice (G1 bắt buộc bản cứng); Bản cứng thì in, trình ký ở bước 77 và người phụ trách hồ sơ đính scan ở bước 78. */
  function signDialog(doc, who) {
    return new Promise((resolve) => {
      const p = persona(who);
      const F = window.Flow, kdt = !!F.state.kdt;
      /* Hồ sơ Mật: mặc định ký cứng (bản giấy) — P-60; KĐT: bắt buộc. */
      const secret = kdt ? F.isMat() : !!F.ci().secret;
      const kv = (k, v) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`;
      const hardMs01 = `<div class="vfield"><div class="lr"><label>Lý do ký cứng</label><span class="req">*</span></div><textarea class="vctl ta" id="hr" rows="3" placeholder="Nội dung"></textarea></div>
            <div class="vfield"><div class="lr"><label>Bản scan đã ký</label><span class="req">*</span></div><div><button class="vbtn sm red" id="up">${icon('upload')} Tải file lên</button></div></div>`;
      const hardKdt = `<div class="banner-moved">${secret ? '<b>Hồ sơ Mật</b> — bắt buộc ký bản cứng, không gửi qua VOffice. ' : ''}Sau khi xác nhận: in và trình bản cứng theo đúng người ký, thứ tự ký (bước 77); người phụ trách hồ sơ cập nhật kết quả, đính kèm bản scan (bước 78), xong mới đi tiếp.</div>
            ${secret ? '' : '<div class="vfield"><div class="lr"><label>Lý do ký bản cứng</label></div><textarea class="vctl ta" id="hr" rows="2" placeholder="Nội dung"></textarea></div>'}`;
      const m = vModal({ title: `Trình ký ${doc}`, size: 'md', body: `
          <div class="ginfo">${kv('Mã hồ sơ', esc(F.ci().code))}${kv('Người ký', esc(p ? p.name + ' — ' + p.role : ''))}
            ${kv('Phiên bản trình ký', 'v' + (window.TaskForms ? window.TaskForms.version() : 1))}${kdt ? kv('Mật', secret ? 'Có' : 'Không') : kv('Người sửa hồ sơ sau khi CQCM nhất trí', 'Không có')}</div>
          <div class="vfield"><div class="lr"><label>Hình thức ký</label></div>
            <div class="vradio">${vRadio(kdt ? 'VOffice' : 'Ký mềm qua VOffice', !secret, 'data-mode="soft"', kdt && secret)}${vRadio(kdt ? 'Bản cứng' : 'Ký cứng (bản giấy)', secret, 'data-mode="hard"')}</div></div>
          <div id="hard" class="stack" ${secret ? '' : 'style="display:none"'}>${kdt ? hardKdt : hardMs01}</div>`,
        actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="go">Trình ký</button>` });
      let mode = secret ? 'hard' : 'soft', file = false;
      m.el.querySelectorAll('[data-mode]').forEach((c) => c.onclick = (e) => {
        e.preventDefault();
        if (kdt && secret) return;
        m.el.querySelectorAll('[data-mode]').forEach((x) => x.classList.remove('on'));
        c.classList.add('on'); mode = c.dataset.mode;
        m.el.querySelector('#hard').style.display = mode === 'hard' ? '' : 'none';
      });
      const up = m.el.querySelector('#up');
      if (up) up.onclick = (e) => { file = true; e.currentTarget.outerHTML = `<span class="file">${icon('file')} ban-scan-da-ky.pdf</span>`; };
      m.el.querySelector('#go').onclick = () => {
        const hrEl = m.el.querySelector('#hr'), hr = hrEl ? hrEl.value.trim() : '';
        if (!kdt && mode === 'hard' && (!hr || !file)) { toast('Bạn cần nhập lý do ký cứng và tải lên bản scan đã ký.', 'warn'); return; }
        /* Comment #11: trả hình thức ký + lý do ký cứng để lưu theo task (thống kê số lần ký cứng — module Báo cáo). */
        m.close(); resolve({ mode, reason: mode === 'hard' ? (hr || (secret ? 'Hồ sơ Mật' : null)) : null });
      };
      m.el.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target === m.el) resolve(null); });
    });
  }

  /* ---------- vht-steps: rút gọn thành chip +N (buildStepViews của @khcn-core/ui) ----------
     o: { id, steps: [{ title, sub, state: 'completed' | 'active' | 'upcoming' }] }. Chip bấm để bung, nhớ theo id. */
  const STEPS_OPEN = new Set();
  function stepViews(steps) {
    const v = (s, i) => ({ kind: 'step', s, i, done: s.state === 'completed' });
    const first = steps.findIndex((s) => s.state === 'active');
    if (first === -1) return steps.map(v);
    const lastA = steps.map((s) => s.state).lastIndexOf('active'), last = steps.length - 1;
    const anchors = new Set([0, last, first - 1, lastA + 1]);
    for (let i = first; i <= lastA; i++) anchors.add(i);
    const out = []; let gap = [];
    const flush = () => {
      if (gap.length >= 2) { const l = gap[gap.length - 1]; out.push({ kind: 'chip', gap, key: `${gap[0].i + 1}-${l.i + 1}`, done: l.s.state === 'completed' }); }
      else if (gap.length === 1) out.push(gap[0]);
      gap = [];
    };
    steps.forEach((s, i) => { if (anchors.has(i)) { flush(); out.push(v(s, i)); } else gap.push(v(s, i)); });
    flush();
    return out;
  }
  function vSteps(o) {
    const views = [];
    stepViews(o.steps).forEach((x) => { if (x.kind === 'chip' && STEPS_OPEN.has(o.id + ':' + x.key)) views.push(...x.gap); else views.push(x); });
    const item = (x) => (x.kind === 'chip'
      ? `<div class="vsteps-item"><button type="button" class="vsteps-chip ${x.done ? '' : 'muted'}" data-steps="${esc(o.id + ':' + x.key)}">+${x.gap.length}</button><div class="vsteps-range">Bước ${x.key.replace('-', ' - ')}</div></div>`
      : `<div class="vsteps-item"><div class="vsteps-c ${x.s.state}">${x.s.state === 'completed' ? icon('check') : x.i + 1}</div>
          <div class="vsteps-l ${x.s.state}">${esc(x.s.title)}</div>${x.s.sub ? `<div class="vsteps-s">${esc(x.s.sub)}</div>` : ''}</div>`);
    return `<div class="vsteps">${views.map((x, i) => item(x) + (i < views.length - 1 ? `<div class="vsteps-line ${x.done ? 'done' : ''}"></div>` : '')).join('')}</div>`;
  }
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-steps]');
    if (!c) return;
    const k = c.dataset.steps;
    if (STEPS_OPEN.has(k)) STEPS_OPEN.delete(k); else STEPS_OPEN.add(k);
    window.App.render();
  });

  /* ---------- Hộp thoại ghi ý kiến cho điểm ❓ ---------- */
  function qDialog(id) {
    const p = D.openPoints[id];
    const note = window.Flow.state.qNotes[id] || '';
    const m = modal(`
      <div class="modal-h"><div><h3>❓ ${id} · ${esc(p.q)}</h3><div class="muted" style="font-size:13px;margin-top:2px">Nguồn: ${esc(p.src)} · Màn: ${esc(p.scr)}</div></div>
        <button class="x" data-close aria-label="Đóng">${icon('x')}</button></div>
      <div class="modal-b">
        <div class="field"><label>Mặc định đang dựng trên prototype</label><div class="note">${esc(p.def)}</div></div>
        <div class="field"><label>Ý kiến / quyết định của VHT</label><textarea class="input" id="qn" placeholder="Ghi lại ý kiến khi review">${esc(note)}</textarea></div>
      </div>
      <div class="modal-f"><button class="btn secondary" data-close>Đóng</button><button class="btn primary" id="sv">Lưu ý kiến</button></div>`);
    m.el.querySelector('#sv').onclick = () => { window.Flow.setNote(id, m.el.querySelector('#qn').value.trim()); m.close(); toast(`Đã lưu ý kiến cho ${id}.`); };
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) { e.preventDefault(); qDialog(b.dataset.q); } });

  /* ---------- Nút (i) cạnh tiêu đề màn: nơi duy nhất chứa ghi chú BA (rule A2) ----------
     spec: { scr, name, uc, bpmn, notes: [], q: [], src } — mọi trường tuỳ chọn trừ scr. */
  const INFO = new Map();
  function infoBtn(spec) {
    INFO.set(spec.scr, spec);
    return `<button type="button" class="info-i" data-info="${esc(spec.scr)}" aria-label="Thông tin màn hình">${icon('info')}</button>`;
  }
  function infoPop(anchor) {
    const s = INFO.get(anchor.dataset.info);
    if (!s) return;
    document.querySelectorAll('.info-pop').forEach((x) => x.remove());
    const r = anchor.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'info-pop';
    const row = (k, v) => (v ? `<div class="ir"><div class="k">${k}</div><div class="v">${v}</div></div>` : '');
    const qs = (s.q || []).filter((id) => D.openPoints[id]);
    el.innerHTML = `<div class="ih"><b>${esc(s.scr)}${s.name ? ' · ' + esc(s.name) : ''}</b><button class="x" data-close-info aria-label="Đóng">${icon('x')}</button></div>
      <div class="ib">${row('Use case', esc(s.uc || ''))}${row('BPMN', esc(s.bpmn || ''))}
        ${row('Ghi chú', (s.notes || []).length ? `<ul class="plain">${s.notes.map((n) => `<li>${n}</li>`).join('')}</ul>` : '')}
        ${row('Điểm chưa chốt', qs.length ? qs.map((id) => `<div class="iq">${qChip(id)} ${esc(D.openPoints[id].q)}</div>`).join('') : '')}
        ${row('Màn tương đương', s.src ? `<code>${esc(s.src)}</code>` : '')}</div>`;
    document.body.appendChild(el);
    const left = Math.min(r.left, window.innerWidth - el.offsetWidth - 16);
    el.style.top = (r.bottom + 8) + 'px';
    el.style.left = Math.max(16, left) + 'px';
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-info]');
    if (b) { e.preventDefault(); e.stopPropagation(); infoPop(b); return; }
    if (e.target.closest('[data-close-info]') || (!e.target.closest('.info-pop') && !e.target.closest('.overlay'))) document.querySelectorAll('.info-pop').forEach((x) => x.remove());
  }, true);

  /* ---------- vht-select / vht-multi-select (p-select có ô lọc) ----------
     o: { id, options: [{ value, label, disabled }], value, multi, placeholder, searchable, clear, invalid, disabled, onChange } */
  const SEL = new Map();
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  function selLabel(o) {
    if (o.multi) return (o.value || []).map((v) => (o.options.find((x) => x.value === v) || {}).label).filter(Boolean).join(', ');
    const f = o.options.find((x) => x.value === o.value);
    return f ? (f.short || f.label) : '';
  }
  function vSelect(o) {
    SEL.set(o.id, o);
    const lab = selLabel(o);
    const empty = !lab;
    return `<div class="vsel ${o.invalid ? 'invalid' : ''} ${o.disabled ? 'dis' : ''}" data-vsel="${esc(o.id)}" ${o.disabled ? '' : 'tabindex="0"'} role="combobox" aria-haspopup="listbox">
      <span class="vsel-label ${empty ? 'ph' : ''}">${esc(empty ? (o.placeholder || '') : lab)}</span>
      ${o.clear && !empty && !o.disabled ? `<span class="vsel-clear" data-vsel-clear="${esc(o.id)}" aria-label="Xoá">${icon('x')}</span>` : ''}
      <span class="vsel-chev">${icon('chev')}</span></div>`;
  }
  let selOpen = null;
  function selClose() { document.querySelectorAll('.vsel-panel').forEach((x) => x.remove()); selOpen = null; }
  function selPanel(id, keepFilter) {
    const o = SEL.get(id);
    const trig = document.querySelector(`[data-vsel="${CSS.escape(id)}"]`);
    if (!o || !trig) { selClose(); return; }
    const old = document.querySelector('.vsel-panel');
    const q = keepFilter && old ? (old.querySelector('input') || {}).value || '' : '';
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'vsel-panel';
    const r = trig.getBoundingClientRect();
    el.style.top = (r.bottom + 4) + 'px'; el.style.left = r.left + 'px'; el.style.width = Math.max(r.width, o.panelWidth || 0) + 'px';
    const list = () => o.options.filter((x) => norm(x.label).includes(norm(el.querySelector('input') ? el.querySelector('input').value : ''))).map((x) => {
      const on = o.multi ? (o.value || []).includes(x.value) : o.value === x.value;
      return `<div class="vsel-opt ${on ? 'on' : ''} ${x.disabled ? 'dis' : ''}" data-opt="${esc(x.value)}" role="option" aria-selected="${on}">${o.multi ? `<span class="cb">${on ? icon('check') : ''}</span>` : ''}<span>${esc(x.label)}</span></div>`;
    }).join('') || '<div class="vsel-empty">Không có dữ liệu</div>';
    el.innerHTML = `${o.searchable ? `<div class="vsel-filter"><input placeholder="Tìm kiếm" value="${esc(q)}">${icon('search')}</div>` : ''}<div class="vsel-list"></div>`;
    document.body.appendChild(el);
    const fill = () => { el.querySelector('.vsel-list').innerHTML = list(); };
    fill();
    const inp = el.querySelector('input');
    if (inp) { inp.oninput = fill; inp.focus(); }
    el.onclick = (e) => {
      e.stopPropagation();
      const opt = e.target.closest('[data-opt]');
      if (!opt || opt.classList.contains('dis')) return;
      const v = o.options.find((x) => String(x.value) === opt.dataset.opt).value;
      if (o.multi) {
        const cur = (o.value || []).slice();
        const i = cur.indexOf(v); if (i >= 0) cur.splice(i, 1); else cur.push(v);
        o.value = cur; if (o.onChange) o.onChange(cur);
        selPanel(id, true);
      } else { o.value = v; selClose(); if (o.onChange) o.onChange(v); }
    };
    selOpen = id;
  }
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-vsel-clear]');
    if (c) { e.stopPropagation(); const o = SEL.get(c.dataset.vselClear); selClose(); o.value = o.multi ? [] : null; if (o.onChange) o.onChange(o.value); return; }
    const t = e.target.closest('[data-vsel]');
    if (t && !t.classList.contains('dis')) { const id = t.dataset.vsel; if (selOpen === id) selClose(); else selPanel(id); return; }
    if (!e.target.closest('.vsel-panel')) selClose();
  });
  window.addEventListener('hashchange', () => { selClose(); document.querySelectorAll('.info-pop').forEach((x) => x.remove()); });

  /* ---------- badge (trạng thái) — biến thể theo components/badge của repo-khcn-bpmn-fe ---------- */
  const badge = (text, variant) => `<span class="vbadge ${variant || 'default'}"><span class="d"></span>${esc(text)}</span>`;

  /* ---------- vht-paginator ---------- (o.sizes: bước số bản ghi/trang, mặc định 10/20/50; danh mục ecat dùng 10/25/50) */
  function pager(o) {
    const pages = Math.max(1, Math.ceil(o.total / o.size));
    const p = Math.min(o.page, pages);
    let items;
    if (pages <= 6) items = Array.from({ length: pages }, (_, i) => i + 1);
    else if (p <= 4) items = [1, 2, 3, 4, '…', pages];
    else { const a = Math.max(1, p - 2); items = ['…'].concat(Array.from({ length: Math.min(4, pages - a + 1) }, (_, i) => a + i)); if (items[items.length - 1] < pages) items.push('…', pages); }
    const b = (to, dis, lbl, svg) => `<button type="button" ${dis ? 'disabled' : `data-pg="${to}"`} aria-label="${lbl}">${svg}</button>`;
    return `<nav class="vpager" aria-label="Phân trang" data-pager="${esc(o.id)}">
      <div class="size"><span>Hiển thị bản ghi/trang:</span><div class="ps"><button type="button" class="ps-t" data-ps-open>${o.size}<svg viewBox="0 0 20 20"><path d="m6 8 4 4 4-4"/></svg></button>
        ${o.open ? `<ul class="ps-l">${(o.sizes || [10, 20, 50]).map((n) => `<li data-ps="${n}" class="${n === o.size ? 'on' : ''}">${n}</li>`).join('')}</ul>` : ''}</div></div>
      <div class="end"><span class="tot">Tổng số bản ghi: ${o.total}</span><div class="pages">
        ${b(1, p === 1, 'Trang đầu', '<svg viewBox="0 0 24 24"><path d="m13 5-6 7 6 7M17 5l-6 7 6 7"/></svg>')}${b(p - 1, p === 1, 'Trang trước', '<svg viewBox="0 0 20 20"><path d="m12.5 4.2-5 5.8 5 5.8"/></svg>')}
        ${items.map((i) => (i === '…' ? '<span class="ell">…</span>' : `<button type="button" class="pgn ${i === p ? 'on' : ''}" data-pg="${i}" ${i === p ? 'aria-current="page"' : ''}>${i}</button>`)).join('')}
        ${b(p + 1, p === pages, 'Trang sau', '<svg viewBox="0 0 20 20"><path d="m7.5 4.2 5 5.8-5 5.8"/></svg>')}${b(pages, p === pages, 'Trang cuối', '<svg viewBox="0 0 24 24"><path d="m11 5 6 7-6 7M7 5l6 7-6 7"/></svg>')}
      </div></div></nav>`;
  }

  /* Tooltip chỉ khi chữ bị cắt (profile-list: line-clamp-2 so chiều cao, truncate so chiều rộng). */
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest && e.target.closest('.clamp, .vtable .link, .vsel-label');
    if (!el) return;
    const cut = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    if (cut) el.title = el.textContent.trim(); else el.removeAttribute('title');
  });

  /* ---------- vht-tree-table (p-treeTable: dòng cha/con, STT 1 / 1.1, toggler trong cột showToggler) ----------
     o: { id, columns: [{ h, w, align, toggler, cell(row) }], rows: [{ key, children, hasChildren }], expanded: Set, from (STT bắt đầu),
          click (dòng có con trỏ), empty, onToggle(key) }. Trạng thái mở/đóng do màn giữ (như expandedKeys). */
  const TT = new Map();
  const CHEV = (up) => `<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="${up ? 'm5 12.5 5-5 5 5' : 'm5 7.5 5 5 5-5'}"/></svg>`;
  function vTreeTable(o) {
    TT.set(o.id, o);
    const cols = o.columns;
    const row = (r, stt, level) => {
      const open = o.expanded.has(r.key);
      const canOpen = r.hasChildren || (r.children && r.children.length);
      const tds = cols.map((c) => {
        let v = c.cell(r);
        if (c.toggler) {
          const tg = canOpen ? `<button type="button" class="vtt-tg" data-vtt="${esc(o.id)}" data-vtt-key="${esc(r.key)}" aria-expanded="${open}" aria-label="${open ? 'Thu gọn' : 'Mở rộng'}">${CHEV(open)}</button>`
            : '<span class="vtt-tg ghost"></span>';
          v = `<span class="vtt-inl" style="margin-left:${level * 16}px">${tg}<span class="vtt-c">${v}</span></span>`;
        }
        return `<td class="${c.align || ''}" style="width:${c.w ? c.w + 'px' : 'auto'}">${v}</td>`;
      }).join('');
      const self = `<tr class="${o.click ? 'click' : ''} ${level ? 'child' : ''}" data-vtt-row="${esc(r.key)}"><td class="ord">${stt}</td>${tds}</tr>`;
      return self + (open && r.children ? r.children.map((k, i) => row(k, `${stt}.${i + 1}`, level + 1)).join('') : '');
    };
    const body = o.rows.map((r, i) => row(r, (o.from || 0) + i + 1, 0)).join('');
    return `<div class="vtable-vp vtt" data-vtt-table="${esc(o.id)}"${o.maxH ? ` style="max-height:${o.maxH}"` : ''}><table class="vtable" style="table-layout:fixed">
      <thead><tr><th class="ord">STT</th>${cols.map((c) => `<th class="${c.align || ''}" style="width:${c.w ? c.w + 'px' : 'auto'}${c.min ? `;min-width:${c.min}px` : ''}">${esc(c.h)}</th>`).join('')}</tr></thead>
      <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">${esc(o.empty || 'Chưa có dữ liệu')}</td></tr>`}</tbody></table></div>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-vtt]');
    if (!b) return;
    e.stopPropagation();
    const o = TT.get(b.dataset.vtt);
    if (o && o.onToggle) o.onToggle(b.dataset.vttKey);
  });

  /* ---------- p-accordion (multiple) — panel phần tử của Chi tiết quy trình ----------
     o: { id, items: [{ key, label, body }], closed: Set, onToggle(key) }. Mặc định mở hết (source [value] = tất cả nhóm). */
  const ACC = new Map();
  function vAccordion(o) {
    ACC.set(o.id, o);
    return `<div class="vacc">${o.items.map((it) => {
      const open = !o.closed.has(it.key);
      return `<div class="vacc-p ${open ? 'open' : ''}" data-acc-panel="${esc(it.key)}"><button type="button" class="vacc-h" data-acc="${esc(o.id)}" data-acc-key="${esc(it.key)}" aria-expanded="${open}">
        ${CHEV(open)}<span>${esc(it.label)}</span></button>${open ? `<div class="vacc-b">${it.body}</div>` : ''}</div>`;
    }).join('')}</div>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-acc]');
    if (!b) return;
    const o = ACC.get(b.dataset.acc);
    if (o && o.onToggle) o.onToggle(b.dataset.accKey);
  });

  window.UI = { esc, icon, persona, avatar, initials, ty, pad2, cqcmUnit, qChip, qStrip, modal, vModal, vRadio, vSteps, toast, askReason, signDialog, qDialog, infoBtn, vSelect, badge, pager, norm, vTreeTable, vAccordion };
})();
