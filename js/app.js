/* Khung ứng dụng: topbar + sidebar (layout VHT), router theo hash, sự kiện chung, công cụ demo. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, persona, avatar, toast, askReason, signDialog, modal } = window.UI;

  let collapsed = false;
  let demoOpen = false;
  const openGroups = new Set(D.menu.filter((m) => m.open).map((m) => m.label));
  try { collapsed = localStorage.getItem('dtms-proto-sb') === '1'; } catch (e) { /* bỏ qua */ }

  const route = () => (location.hash.replace(/^#\/?/, '') || 'viec-cua-toi');

  /* Mục menu đang được chọn theo route. */
  function activePath(r) {
    if (r.startsWith('task/') || r.startsWith('viec-cua-toi')) return 'viec-cua-toi';
    if (r.startsWith('ho-so') || r.startsWith('dxms')) return 'dxms';
    if (r.startsWith('dmdc')) return 'dmdc';
    if (r.startsWith('quy-trinh')) return 'quy-trinh';
    if (r.startsWith('ma-tran')) return 'ma-tran';
    return r;
  }

  function topbar() {
    const p = persona(Flow.state.persona);
    const n = Flow.tokensFor(p.id).length;
    return `<header class="topbar">
      <a class="brand" href="#/viec-cua-toi" aria-label="Về trang chủ"><span class="brand-logo">VHT</span>
        <span class="brand-text"><span>${D.product.code}</span><span>${D.product.name}</span></span></a>
      <div class="topbar-right">
        <button class="bell" aria-label="Thông báo" data-go="viec-cua-toi">${icon('bell')}${n ? `<span class="count">${n}</span>` : ''}</button>
        <span class="rule"></span>
        <button class="who" id="who">${avatar(p.id)}<span class="who-text"><span>${esc(p.name)}</span><span class="r">${esc(p.role)}</span></span></button></div></header>`;
  }

  function navItem(m, level, act) {
    const kids = m.children || [];
    const childActive = kids.some((k) => k.path === act);
    const isActive = m.path && m.path === act;
    const open = openGroups.has(m.label) || childActive;
    const badge = m.badge === 'tasks' ? Flow.tokensFor(Flow.state.persona).length : 0;
    const cls = ['nav', level ? 'child' : '', isActive ? 'active' : '', childActive ? 'has-active' : '', open ? 'open' : ''].join(' ');
    const btn = `<button class="${cls}" ${m.path ? `data-go="${m.path}"` : `data-toggle="${esc(m.label)}"`} title="${esc(m.label)}">
      ${m.icon ? `<span class="i">${icon(m.icon)}</span>` : ''}<span class="l">${esc(m.label)}</span>
      ${badge ? `<span class="badge-n">${badge}</span>` : ''}${kids.length ? `<span class="chev">${icon('chev')}</span>` : ''}</button>`;
    return btn + (kids.length && open ? kids.map((k) => navItem(k, level + 1, act)).join('') : '');
  }

  function sidebar(act) {
    return `<aside class="sidebar ${collapsed ? 'collapsed' : ''}">
      <div class="sb-head"><span class="ic">${icon('phan_he_mua_sam')}</span><span class="t">Đầu tư mua sắm</span></div>
      <div class="sb-rule"></div>
      <nav class="sb-nav">${D.menu.map((m) => navItem(m, 0, act)).join('')}</nav>
      <div class="sb-foot">v1.0 - © 2026</div>
      <button class="sb-toggle" id="sbt" aria-label="${collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}">${icon('collapse')}</button></aside>`;
  }

  function findMenu(path) {
    for (const g of D.menu) {
      if (g.path === path) return { item: g, group: null };
      for (const k of g.children || []) if (k.path === path) return { item: k, group: g };
    }
    return null;
  }

  /* Route cũ của Quy trình BPMN / Ma trận hành động trước khi tách menu Quản trị quy trình (D-2). */
  const MOVED = { 'ph/quy-trinh': 'quy-trinh', 'ph/ma-tran': 'ma-tran/display-rule', 'ma-tran': 'ma-tran/display-rule' };

  function content(r) {
    const [a, b, c] = r.split('/');
    if (a === 'giam-sat-tien-trinh') return window.QuyTrinh.monitor();
    if (a === 'quy-trinh') return b ? window.QuyTrinh.detail(b) : window.QuyTrinh.list();
    if (a === 'ma-tran') return window.MaTran.route(r.split('/').slice(1));
    if (a === 'chon-vai') return S.chonVai();
    if (a === 'viec-cua-toi') return S.viecCuaToi(b);
    if (a === 'dxms' && b === 'create') return S.dxmsCreate();
    if (a === 'dxms' && b) return S.sampleDetail(decodeURIComponent(b), c);
    if (a === 'dxms') return S.dxmsList();
    if (a === 'ho-so') return S.caseDetail(b);
    if (a === 'task' && c === 'bpmn') return S.taskBpmn(b);
    if (a === 'task') return S.taskScreen(b);
    if (a === 'tong-quan') return S.tongQuan();
    if (a === 'cho-chot') return S.choChot();
    if (a === 'dmdc') return b ? window.Catalog.list(b) : window.Catalog.overview();
    const m = findMenu(r);
    if (m) return S.phanHe(m.item, m.group);
    return S.viecCuaToi();
  }

  function demoPanel() {
    const st = Flow.state;
    return `<div class="demo-fab"><button class="demo-btn ${demoOpen ? 'on' : ''}" id="demo" aria-label="Công cụ demo" title="Công cụ demo">${icon('tool')}</button>
      ${demoOpen ? `<div class="demo-panel">
        <h4>Công cụ demo (không thuộc giao diện app)</h4>
        <div class="row"><a class="btn sm secondary" href="#/chon-vai">Chọn vai</a></div>
        <h4>Việc đang chờ</h4>
        <div class="scene-list">${st.tokens.length ? st.tokens.map((k) => `<button data-persona="${k.who}"><span class="n">${esc(persona(k.who).short.slice(0, 2))}</span>${esc(persona(k.who).short)} · ${esc(Flow.taskName(k.task))}<span class="tk">task ${String(k.task).padStart(2, '0')}</span></button>`).join('') : '<span class="faint" style="font-size:12px">Không có việc đang chờ.</span>'}</div>
        <h4>Nhảy tới cảnh (§2.4)</h4>
        <div class="scene-list">${D.scenes.map((s) => `<button data-scene="${s.n}"><span class="n">${s.n}</span>${esc(s.name)}<span class="tk">task ${s.tasks}</span></button>`).join('')}</div>
        <h4>Nhánh phụ (mở khi khách hỏi)</h4>
        <div class="scene-list">${BRANCHES.map((b, i) => `<button data-branch="${i}"><span class="n">↳</span>${esc(b.name)}<span class="tk">task ${b.tasks}</span></button>`).join('')}</div>
        <h4>Hồ sơ</h4>
        <div class="row"><button class="btn sm secondary" id="reset">Reset luồng</button><a class="btn sm secondary" href="#/ho-so">Chi tiết hồ sơ</a><a class="btn sm secondary" href="#/cho-chot">Điểm ❓ (${Object.keys(st.qNotes).length}/${Object.keys(D.openPoints).length})</a></div>
        <div class="faint" style="font-size:12px;margin-top:8px">Nhảy cảnh sẽ chạy lại từ đầu theo nhánh chính và giữ nguyên ý kiến ❓ đã ghi.</div>
      </div>` : ''}</div>`;
  }

  const BRANCHES = [
    { name: 'Chọn nhầm quy trình MS01.03 → chuyển quy trình (B-3e)', tasks: '10 → 10a → 10b', task: '10a', who: 'minh', process: 'MS01.03' },
    { name: 'Chỉ huy ĐVĐX không đồng ý', tasks: '13 → 14 → 12', task: 13, who: 'hai' },
    { name: 'TTMS trả lại danh sách CQCM', tasks: '17 → 16', task: 17, who: 'lan' },
    { name: 'Giải trình vòng 3/2 → cảnh báo, họp', tasks: '28 → 29–34', task: 28, who: 'minh', vars: { round: 2 } },
    { name: 'TTMS chọn Không báo cáo Tập đoàn', tasks: '48 → 57', task: 48, who: 'lan' },
    { name: 'Thủ trưởng VHT yêu cầu hoàn chỉnh', tasks: '60 → 25 → 26', task: 60, who: 'tgd' },
  ];

  /* Màn mở Chi tiết hồ sơ mẫu (#/dxms/<mã>…): Giám sát tiến trình thì nút quay lại về đó, còn lại về Danh sách ĐXMS. */
  let lastRoute = null, detailFrom = null;

  function render() {
    const r = route();
    if (MOVED[r]) { location.replace('#/' + MOVED[r]); return; }
    const base = r.split('/').slice(0, 2).join('/');
    if (r.startsWith('dxms/') && r !== 'dxms/create' && !(lastRoute || '').startsWith(base)) detailFrom = lastRoute;
    lastRoute = r;
    const act = activePath(r);
    const main = document.querySelector('.main');
    const keepScroll = main && main.dataset.route === r ? main.scrollTop : 0;
    document.getElementById('app').innerHTML = topbar()
      + `<div class="shell">${sidebar(act)}<main class="main" data-route="${esc(r)}">${content(r)}</main></div>` + demoPanel();
    document.querySelector('.main').scrollTop = keepScroll;
    /* Đổi trang: đưa mục menu đang chọn vào tầm nhìn (Danh mục dùng chung nằm cuối menu). */
    const on = !keepScroll && document.querySelector('.sb-nav .nav.active');
    if (on) on.scrollIntoView({ block: 'nearest' });
    if (window.BpmnView) window.BpmnView.mount();
    document.title = 'ĐTMS';
  }

  /* SCR-25 Tạo mới ĐXMS là trang riêng #/dxms/create (rule B6), luôn mở với form trống. */
  function openCreate() {
    S.resetCreate();
    if (location.hash === '#/dxms/create') render(); else location.hash = '#/dxms/create';
  }

  function openReplacement() {
    Flow.openReplacement();
    const tok = Flow.state.tokens.find((t) => t.task === 1);
    location.hash = `#/task/${tok.id}`;
  }

  function switchTo(id, stay) {
    Flow.setPersona(id);
    toast(`Đã chuyển tài khoản: <b>${esc(persona(id).name)}</b> — ${esc(persona(id).role)}`, 'info');
    if (!stay) location.hash = '#/viec-cua-toi'; else render();
  }

  async function act(tokenId, idx) {
    const tok = Flow.token(tokenId);
    if (!tok) return;
    const f = D.flow[tok.task];
    const choice = idx >= 0 ? f.choices[idx] : null;
    const err = window.Bodies && window.Bodies.validate(tok, choice);
    if (err) { toast(esc(err), 'warn'); return; }
    let reason = null;
    if (choice && choice.reason) { reason = await askReason(choice.label); if (!reason) return; }
    if (choice && choice.sign) { const ok = await signDialog(choice.sign, tok.who); if (!ok) return; }
    Flow.complete(tokenId, choice, reason);
    /* Toast theo source (my-task-detail.facade: "Thành công" + successMessage); ai xử lý tiếp xem ở nút demo nổi. */
    const ok = (m) => toast(`<b>Thành công</b><br>${m}`);
    if (Flow.state.status === 'moved') {
      ok(`Đã chuyển quy trình. Hồ sơ mới: <b>${esc(Flow.state.movedTo.code)}</b>.`);
      location.hash = '#/ho-so';
      return;
    }
    if (Flow.state.status !== 'running') {
      ok(Flow.state.status === 'approved' ? 'Đã phê duyệt đề xuất mua sắm.' : 'Đã kết thúc hồ sơ.');
      location.hash = '#/ho-so';
      return;
    }
    ok(choice && choice.sign ? 'Đã gửi văn bản đi trình ký.' : 'Thực hiện hành động thành công.');
    location.hash = '#/viec-cua-toi';
  }

  function exportNotes(kind) {
    const rows = Object.entries(D.openPoints).map(([id, p]) => ({ id, q: p.q, src: p.src, def: p.def, scr: p.scr, note: Flow.state.qNotes[id] || '' }));
    let text, name, type;
    if (kind === 'csv') {
      const c = (s) => `"${String(s).replace(/"/g, '""')}"`;
      text = '﻿' + ['Mã,Điểm chưa chốt,Nguồn,Mặc định,Màn,Ý kiến'].concat(rows.map((r) => [r.id, r.q, r.src, r.def, r.scr, r.note].map(c).join(','))).join('\r\n');
      name = 'y-kien-diem-chua-chot.csv'; type = 'text/csv';
    } else {
      text = '# Ý kiến điểm chưa chốt — prototype ĐTMS MS01.01\n\n| Mã | Điểm chưa chốt | Mặc định | Màn | Ý kiến |\n|---|---|---|---|---|\n'
        + rows.map((r) => `| ${r.id} | ${r.q} | ${r.def} | ${r.scr} | ${r.note.replace(/\n/g, ' ') || '—'} |`).join('\n') + '\n';
      name = 'y-kien-diem-chua-chot.md'; type = 'text/markdown';
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; a.click();
  }

  function personaMenu(anchor) {
    const r = anchor.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'menu-pop';
    el.style.top = (r.bottom + 8) + 'px';
    el.style.right = (window.innerWidth - r.right) + 'px';
    el.innerHTML = `<div class="hd"><b>Chuyển tài khoản</b></div>`
      + D.personas.map((p) => { const n = Flow.tokensFor(p.id).length; return `<button data-persona="${p.id}" class="${p.id === Flow.state.persona ? 'on' : ''}">${avatar(p.id, 'sm')}<span style="flex:1">${esc(p.name)}<br><span class="faint" style="font-size:12px">${esc(p.role)}</span></span>${n ? `<span class="tag red">${n}</span>` : ''}</button>`; }).join('');
    document.body.appendChild(el);
    setTimeout(() => document.addEventListener('click', function off() { el.remove(); document.removeEventListener('click', off); }), 0);
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    const go = t.closest('[data-go]');
    const per = t.closest('[data-persona]');
    if (per) { e.preventDefault(); switchTo(per.dataset.persona, !!per.dataset.stay); return; }
    if (t.closest('#who')) { e.stopPropagation(); personaMenu(t.closest('#who')); return; }
    const tg = t.closest('[data-toggle]');
    if (tg) {
      const k = tg.dataset.toggle;
      if (collapsed) { collapsed = false; openGroups.add(k); } else if (openGroups.has(k)) openGroups.delete(k); else openGroups.add(k);
      render(); return;
    }
    if (t.closest('#sbt')) { collapsed = !collapsed; try { localStorage.setItem('dtms-proto-sb', collapsed ? '1' : '0'); } catch (err) { /* bỏ qua */ } render(); return; }
    if (t.closest('#demo')) { demoOpen = !demoOpen; render(); return; }
    if (t.closest('[data-create]')) { e.preventDefault(); openCreate(); return; }
    if (t.closest('[data-open-new]')) { e.preventDefault(); openReplacement(); return; }
    if (t.closest('[data-back]')) { e.preventDefault(); if (history.length > 1) history.back(); else location.hash = '#/viec-cua-toi'; return; }
    const sc = t.closest('[data-scene]');
    if (sc) {
      Flow.jumpToScene(Number(sc.dataset.scene));
      const s = D.scenes.find((x) => x.n === Number(sc.dataset.scene));
      toast(`Cảnh ${s.n} · ${esc(s.name)} — vai ${esc(persona(Flow.state.persona).name)}`, 'info');
      demoOpen = false;
      if (s.start === 'NEW') { openCreate(); return; }
      const mine = Flow.tokensFor(Flow.state.persona)[0];
      location.hash = mine ? `#/task/${mine.id}` : '#/ho-so';
      render(); return;
    }
    const br = t.closest('[data-branch]');
    if (br) {
      const b = BRANCHES[Number(br.dataset.branch)];
      Flow.jumpTo(b.task, b.who, b.vars, b.process);
      demoOpen = false;
      const mine = Flow.tokensFor(b.who).find((k) => String(k.task) === String(b.task));
      toast(`Nhánh phụ: ${esc(b.name)} — vai ${esc(persona(b.who).name)}`, 'info');
      location.hash = `#/task/${mine.id}`;
      render(); return;
    }
    if (t.closest('#reset')) {
      const m = modal(`<div class="modal-h"><h3>Reset luồng?</h3></div><div class="modal-b">Xoá hồ sơ đang chạy, quay về trước bước Tạo mới ĐXMS (SCR-25). Ý kiến ❓ đã ghi được giữ lại.</div>
        <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="rs">Reset</button></div>`);
      m.el.querySelector('#rs').onclick = () => { m.close(); Flow.reset(); Flow.setPersona('minh'); demoOpen = false; location.hash = '#/viec-cua-toi'; toast('Đã reset luồng.'); };
      return;
    }
    const a = t.closest('[data-act]');
    if (a && !a.disabled) { act(a.dataset.act, Number(a.dataset.choice)); return; }
    const ex = t.closest('[data-export]');
    if (ex) { exportNotes(ex.dataset.export); return; }
    if (go) { e.preventDefault(); location.hash = '#/' + go.dataset.go; }
  });

  /* ?capture=1: chụp cho Figma — ẩn nút (i), nút công cụ demo, toast (rule A6, C4). */
  if (/[?&]capture=1(&|$)/.test(location.search)) document.body.classList.add('cap');
  window.App = { openCreate, render, detailFrom: () => detailFrom };
  window.addEventListener('hashchange', render);
  Flow.init();
  Flow.onChange(render);
  render();
})();
