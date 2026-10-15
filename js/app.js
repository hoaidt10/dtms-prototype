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
    /* T17 phương án Gộp: luồng, ĐXMS, hồ sơ ĐXMS cùng thuộc mục Luồng mua sắm. */
    if (r === 'luong' || r.startsWith('luong/')) return 'luong';
    if (window.Luong.isGop() && (r.startsWith('dxms') || r.startsWith('ho-so-dxms') || ((r === 'ho-so' || r.startsWith('ho-so/')) && !Flow.state.kdt))) return 'luong';
    if (r.startsWith('ho-so-kdt')) return 'ho-so-kdt';
    if (r.startsWith('ycbg-kdt')) return 'ycbg-kdt';
    if (r.startsWith('khlcnt')) return 'khlcnt';
    if (r.startsWith('goi-thau')) return 'goi-thau';
    if (r.startsWith('cong-khai-thau')) return 'cong-khai-thau';
    if (r.startsWith('hop-dong')) return 'hop-dong';
    if (r.startsWith('thoa-thuan-khung')) return 'thoa-thuan-khung';
    if (r.startsWith('mau-thong-bao')) return 'mau-thong-bao';
    if (r.startsWith('trigger-thong-bao')) return 'trigger-thong-bao';
    if (r === 'ho-so' || r.startsWith('ho-so/')) return Flow.state.kdt ? 'kdt' : 'ho-so-dxms';
    if (r.startsWith('ho-so')) return 'ho-so-dxms';
    if (r.startsWith('dxms')) return 'dxms';
    if (r.startsWith('ycbg')) return 'ycbg';
    if (r.startsWith('dmdc')) return r.split('/').slice(0, 2).join('/');
    if (r.startsWith('quy-trinh')) return 'quy-trinh';
    if (r.startsWith('ma-tran')) return 'ma-tran';
    if (r.startsWith('eform')) return 'eform';
    if (r === 'kdt' || r.startsWith('kdt/')) return 'kdt';
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
    /* Danh mục dùng chung: chỉ hiện danh mục vai hiện tại được xem (P-36). */
    const kids = (m.children || []).filter((k) => !k.dmdc || window.Catalog.canSee(k.dmdc));
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
      <nav class="sb-nav">${window.Luong.menu().filter((m) => !m.hidden).map((m) => navItem(m, 0, act)).join('')}</nav>
      <div class="sb-foot">v1.0 - © 2026</div>
      <button class="sb-toggle" id="sbt" aria-label="${collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}">${icon('collapse')}</button></aside>`;
  }

  function findMenu(path) {
    for (const g of D.menu) {
      if (g.path === path) return { item: g, group: null };
      for (const k of g.children || []) if (k.path === path) return { item: k, group: g };
    }
    /* Mục bỏ khỏi menu theo D-15: route cũ vẫn mở trang Đang phát triển. */
    const old = D.oldMenu.find((k) => k.path === path);
    return old ? { item: old, group: null } : null;
  }

  /* Route cũ của Quy trình BPMN / Ma trận hành động trước khi tách menu Quản trị quy trình (D-2); E-Form, Khoản đầu tư trước khi có màn thật (D-4, D-9). */
  const MOVED = { 'ph/quy-trinh': 'quy-trinh', 'ph/ma-tran': 'ma-tran/display-rule', 'ma-tran': 'ma-tran/display-rule', 'ph/dieu-chinh': 'ho-so-dxms', 'ph/eform': 'eform', 'ph/kdt': 'kdt', 'ph/ycbg': 'ycbg',
    'ph/ho-so-kdt': 'ho-so-kdt', 'ph/ycbg-kdt': 'ycbg-kdt', 'ph/khlcnt': 'khlcnt', 'ph/goi-thau': 'goi-thau', 'ph/ds-cam': 'nha-thau', 'ph/cong-khai-thau': 'cong-khai-thau',
    'ph/hop-dong': 'hop-dong', 'ph/po': 'thoa-thuan-khung', 'ph/mau-thong-bao': 'mau-thong-bao', 'ph/kenh-thong-bao': 'kenh-thong-bao', 'ph/trigger-thong-bao': 'trigger-thong-bao',
    'ph/bao-cao': 'bao-cao/tong-hop', 'ph/bao-cao-dxms': 'bao-cao/dxms', 'ph/bao-cao-kdt': 'bao-cao/kdt', 'ph/bao-cao-lcnt': 'bao-cao/lcnt', 'ph/bao-cao-hop-dong': 'bao-cao/hop-dong', 'ph/bao-cao-tien-do': 'bao-cao/tien-do', 'bao-cao': 'bao-cao/tong-hop' };

  function content(r) {
    const [a, b, c] = r.split('/');
    if (a === 'giam-sat-tien-trinh') return window.QuyTrinh.monitor();
    if (a === 'quy-trinh') return b ? window.QuyTrinh.detail(b) : window.QuyTrinh.list();
    if (a === 'ma-tran') return window.MaTran.route(r.split('/').slice(1));
    if (a === 'chon-vai') return S.chonVai();
    if (a === 'viec-cua-toi') return S.viecCuaToi(b);
    /* T17 phương án Gộp: SCR-95 Danh sách luồng, SCR-96 Tạo luồng (luong.js). */
    if (a === 'luong') return window.Luong.route(r.split('/'));
    /* ĐXMS (cha): SCR-27 danh sách, SCR-28 thêm mới / chỉnh sửa, SCR-29 chi tiết — theo task-management. */
    if (a === 'dxms' && b === 'create') return S.dxmsForm();
    if (a === 'dxms' && b && c === 'edit') return S.dxmsForm();
    if (a === 'dxms' && b) return S.dxmsDetail(decodeURIComponent(b));
    if (a === 'dxms') return S.dxmsList();
    /* Yêu cầu báo giá ĐXMS (T16 B1): SCR-73 danh sách, SCR-74 chi tiết. */
    if (a === 'ycbg') return b ? window.Ycbg.detail(decodeURIComponent(b)) : window.Ycbg.list('dxms');
    /* T16 B2: YCBG KĐT (SCR-76/77), Danh sách hồ sơ KĐT (SCR-75), Quản lý thầu (SCR-78…83, thau.js). */
    if (a === 'ycbg-kdt') return b ? window.Ycbg.detail(decodeURIComponent(b)) : window.Ycbg.list('kdt');
    if (a === 'ho-so-kdt' && !b) return window.KdtB2.caseList();
    if (a === 'khlcnt' || a === 'goi-thau' || a === 'nha-thau') return window.Thau.route(r.split('/'));
    if (a === 'cong-khai-thau') return window.CongKhai.route();
    /* T16 B3: Hợp đồng (SCR-84…87), Thông báo (SCR-88…91), Báo cáo (SCR-93). */
    if (a === 'hop-dong' || a === 'thoa-thuan-khung') return window.HopDong.route(r.split('/'));
    if (a === 'mau-thong-bao' || a === 'kenh-thong-bao' || a === 'trigger-thong-bao') return window.ThongBao.route(r.split('/'));
    if (a === 'bao-cao' && b) return window.BaoCao.report(b);
    /* Hồ sơ (con): SCR-02 danh sách, SCR-25 thêm mới [/<mã ĐXMS>], SCR-20 chi tiết hồ sơ mẫu — theo profile-management. */
    if (a === 'ho-so-dxms' && b === 'create') return S.profileCreate();
    if (a === 'ho-so-dxms' && b) return S.sampleDetail(decodeURIComponent(b), c);
    if (a === 'ho-so-dxms') return S.profileList();
    /* Hồ sơ KĐT (SCR-20 dùng lại, B5): #/ho-so-kdt/<mã>[/bpmn]; #/ho-so khi đang chạy hồ sơ KĐT cũng mở khuôn này. */
    if (a === 'ho-so-kdt' && b) return S.kdtCaseDetail(decodeURIComponent(b), c);
    if (a === 'ho-so') return S.caseDetail(b);
    if (a === 'task' && c === 'bpmn') return S.taskBpmn(b);
    if (a === 'task') return S.taskScreen(b);
    if (a === 'tong-quan') return window.BaoCao.tongQuan();
    if (a === 'cho-chot') return S.choChot();
    if (a === 'dmdc') return b ? window.Catalog.list(b) : window.Catalog.overview();
    /* E-Form (D-4): SCR-49 danh sách; SCR-51 thiết kế eform/<id>/thiet-ke (B3). */
    if (a === 'eform' && b && c === 'thiet-ke') return window.EForm.design(b);
    if (a === 'eform') return window.EForm.list();
    /* Khoản đầu tư (D-9, D-12): SCR-54 danh sách, SCR-55 thêm mới / chỉnh sửa, SCR-56 chi tiết, Thêm mới hồ sơ KĐT. */
    if (a === 'kdt') return window.Kdt.route(r.split('/').slice(1));
    const m = findMenu(r);
    if (m) return S.phanHe(m.item, m.group);
    return S.viecCuaToi();
  }

  /* Công cụ demo: chọn hồ sơ demo (bộ D.demoSets — plan MS01.02/.03 §8.1), cảnh và nhánh phụ của bộ đang chọn. */
  function demoPanel() {
    const st = Flow.state, set = Flow.demoSet();
    return `<div class="demo-fab"><button class="demo-btn ${demoOpen ? 'on' : ''}" id="demo" aria-label="Công cụ demo" title="Công cụ demo">${icon('tool')}</button>
      ${demoOpen ? `<div class="demo-panel">
        <h4>Công cụ demo (không thuộc giao diện app)</h4>
        <div class="row"><a class="btn sm secondary" href="#/chon-vai">Chọn vai</a></div>
        <h4>Phương án menu ĐXMS (T17)</h4>
        <div class="row"><button class="btn sm ${window.Luong.isGop() ? 'secondary' : 'primary'}" data-luong-mode="tach">Tách: ĐXMS · Hồ sơ</button><button class="btn sm ${window.Luong.isGop() ? 'primary' : 'secondary'}" data-luong-mode="gop">Gộp: Luồng mua sắm</button></div>
        <h4>Hồ sơ demo</h4>
        <div class="row">${D.demoSets.map((d) => `<button class="btn sm ${d.key === set.key ? 'primary' : 'secondary'}" data-demo-set="${d.key}">${esc(d.label)}</button>`).join('')}</div>
        <h4>Việc đang chờ</h4>
        <div class="scene-list">${st.tokens.length ? st.tokens.map((k) => `<button data-persona="${k.who}"><span class="n">${esc(persona(k.who).short.slice(0, 2))}</span>${esc(persona(k.who).short)} · ${esc(Flow.taskName(k.task))}<span class="tk">task ${String(k.task).padStart(2, '0')}</span></button>`).join('') : '<span class="faint" style="font-size:12px">Không có việc đang chờ.</span>'}</div>
        <h4>Nhảy tới cảnh · ${esc(set.label)}</h4>
        <div class="scene-list">${set.scenes.map((s) => `<button data-scene="${s.n}"><span class="n">${s.n}</span>${esc(s.name)}<span class="tk">task ${s.tasks}</span></button>`).join('')}</div>
        ${set.branches.length ? `<h4>Nhánh phụ (mở khi khách hỏi)</h4>
        <div class="scene-list">${set.branches.map((b, i) => `<button data-branch="${i}"><span class="n">↳</span>${esc(b.name)}<span class="tk">task ${b.tasks}</span></button>`).join('')}</div>` : ''}
        <h4>Hồ sơ</h4>
        <div class="row"><button class="btn sm secondary" id="reset">Reset luồng</button><a class="btn sm secondary" href="#/ho-so">Chi tiết hồ sơ</a><a class="btn sm secondary" href="#/cho-chot">Điểm ❓ (${Object.keys(st.qNotes).length}/${Object.keys(D.openPoints).length})</a></div>
        <div class="row"><button class="btn sm secondary" id="reset-eform">Khôi phục dữ liệu mẫu</button></div>
        <div class="faint" style="font-size:12px;margin-top:8px">Đổi hồ sơ demo hoặc nhảy cảnh sẽ chạy lại từ đầu theo nhánh chính và giữ nguyên ý kiến ❓ đã ghi.</div>
      </div>` : ''}</div>`;
  }

  /* Cảnh bắt đầu trước khi có hồ sơ: bộ MS01.01 mở Thêm mới ĐXMS (SCR-28); bộ có ĐXMS mẫu mở Thêm mới hồ sơ khoá ĐXMS đó (SCR-25). */
  function openStart(set) {
    if (set.dxms === D.dxmsCode0) { openCreate('dxms'); return; }
    /* Bộ KĐT: cảnh 1 bắt đầu từ Thêm mới KĐT (SCR-55). */
    if (set.kdt) { if (location.hash === '#/kdt/create') { window.Kdt.enter(['create']); render(); } else location.hash = '#/kdt/create'; return; }
    const h = '#/ho-so-dxms/create/' + encodeURIComponent(set.dxms);
    if (location.hash === h) { S.enter(h.slice(2)); render(); } else location.hash = h;
  }

  /* Màn mở Chi tiết hồ sơ mẫu (#/ho-so-dxms/<mã>…): Giám sát tiến trình, Chi tiết/Chỉnh sửa ĐXMS thì nút quay lại về đó, còn lại về Danh sách hồ sơ. */
  let lastRoute = null, detailFrom = null;

  function render() {
    const r = route();
    if (MOVED[r]) { location.replace('#/' + MOVED[r]); return; }
    const base = r.split('/').slice(0, 2).join('/');
    if (((r.startsWith('ho-so-dxms/') && !r.startsWith('ho-so-dxms/create')) || r.startsWith('ho-so-kdt/')) && !(lastRoute || '').startsWith(base)) detailFrom = lastRoute;
    if (r !== lastRoute) { S.enter(r); if (r.split('/')[0] === 'kdt') window.Kdt.enter(r.split('/').slice(1)); window.Thau.enter(r.split('/')); window.Luong.enter(r.split('/')); window.HopDong.enter(r.split('/')); window.ThongBao.enter(r.split('/')); }
    lastRoute = r;
    const act = activePath(r);
    const main = document.querySelector('.main');
    const keepScroll = main && main.dataset.route === r ? main.scrollTop : 0;
    document.getElementById('app').innerHTML = topbar()
      + `<div class="shell">${sidebar(act)}<main class="main" data-route="${esc(r)}">${content(r)}</main></div>` + demoPanel();
    document.querySelector('.main').scrollTop = keepScroll;
    /* Đổi trang: đưa mục menu đang chọn vào tầm nhìn (các mục cuối menu như Danh mục dùng chung). */
    const on = !keepScroll && document.querySelector('.sb-nav .nav.active');
    if (on) on.scrollIntoView({ block: 'nearest' });
    if (window.BpmnView) window.BpmnView.mount();
    document.title = 'ĐTMS';
  }

  /* Trang Thêm mới (rule B6) luôn mở với form trống: 'dxms' = SCR-28 Thêm mới ĐXMS, 'hs' = SCR-25 Thêm mới hồ sơ. */
  function openCreate(what) {
    const h = what === 'hs' ? '#/ho-so-dxms/create' : '#/dxms/create';
    if (location.hash === h) { S.enter(h.slice(2)); render(); } else location.hash = h;
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
    const choice = idx >= 0 ? Flow.choices(tok.task)[idx] : null;
    if (choice && choice.lockWhen && choice.lockWhen(Flow.state.vars)) return;
    /* Nút → eForm của task (dialog) hoặc dialog nhận xét (nút từ chối, G6) → trình ký → hoàn thành (task-forms.js). */
    const r = await window.TaskForms.run(tok, choice);
    if (!r) return;
    let reason = r.reason || null;
    if (choice && choice.reason && !reason) { reason = await askReason(choice.label); if (!reason) return; }
    let sg = null;
    if (choice && choice.sign) {
      sg = await signDialog(choice.sign, tok.who);
      if (!sg) return;
      if (sg.mode === 'hard') Flow.state.vars.hardSigns = (Flow.state.vars.hardSigns || []).concat([{ task: tok.task, who: tok.who, doc: choice.sign, reason: sg.reason, t: Flow.state.clock }]);
    }
    const note = r.note || window.TaskForms.beforeComplete(tok, choice);
    /* Hồ sơ KĐT: hình thức ký đã chọn → khối ký chung 75–78 (D-34). */
    Flow.complete(tokenId, choice, reason, sg);
    if (note && Flow.state.status === 'running') { toast(esc(note), 'warn'); location.hash = '#/viec-cua-toi'; return; }
    /* Toast theo source (my-task-detail.facade: "Thành công" + successMessage); ai xử lý tiếp xem ở nút demo nổi. */
    const ok = (m) => toast(`<b>Thành công</b><br>${m}`);
    /* Hồ sơ KĐT: tổng mức vốn không thuộc MS13 → Thông báo chuyển luồng (SCR-66); kết thúc khác → Chi tiết KĐT. */
    const kdt = Flow.state.kdt;
    if (kdt && Flow.state.status === 'moved') {
      ok(`Hồ sơ đã chuyển luồng ${esc(Flow.state.movedTo.process)}. Hồ sơ mới: <b>${esc(Flow.state.movedTo.code)}</b>.`);
      location.hash = `#/kdt/${encodeURIComponent(kdt)}/chuyen-luong`;
      return;
    }
    if (kdt && Flow.state.status !== 'running') { ok(Flow.state.status === 'approved' ? 'Đã phê duyệt khoản đầu tư.' : 'Đã kết thúc hồ sơ.'); location.hash = `#/kdt/${encodeURIComponent(kdt)}`; return; }
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
    ok(choice && choice.sign ? (kdt && sg && sg.mode === 'hard' ? 'Đã chuyển ký bản cứng (bước 77).' : 'Đã gửi văn bản đi trình ký.') : 'Thực hiện hành động thành công.');
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
    if (t.closest('[data-create]')) { e.preventDefault(); openCreate(t.closest('[data-create]').dataset.create); return; }
    if (t.closest('[data-open-new]')) { e.preventDefault(); openReplacement(); return; }
    if (t.closest('[data-back]')) { e.preventDefault(); if (history.length > 1) history.back(); else location.hash = '#/viec-cua-toi'; return; }
    /* T17 D-25: công tắc phương án menu ĐXMS (Tách / Gộp). */
    const lm = t.closest('[data-luong-mode]');
    if (lm) {
      window.Luong.setMode(lm.dataset.luongMode);
      demoOpen = false;
      toast(window.Luong.isGop() ? 'Phương án <b>Gộp</b>: menu Luồng mua sắm.' : 'Phương án <b>Tách</b>: menu Đề xuất mua sắm và Hồ sơ đề xuất mua sắm.', 'info');
      const h = window.Luong.isGop() ? '#/luong' : '#/dxms';
      if (location.hash === h) render(); else location.hash = h;
      return;
    }
    const ds = t.closest('[data-demo-set]');
    if (ds) {
      const set = D.demoSets.find((d) => d.key === ds.dataset.demoSet);
      Flow.pickDemo(set.key);
      toast(`Hồ sơ demo: ${esc(set.label)} — vai ${esc(persona(Flow.state.persona).name)}`, 'info');
      demoOpen = false;
      openStart(set); return;
    }
    const sc = t.closest('[data-scene]');
    if (sc) {
      const set = Flow.demoSet();
      const s = Flow.jumpToScene(sc.dataset.scene, set.key);
      toast(`Cảnh ${s.n} · ${esc(s.name)} — vai ${esc(persona(Flow.state.persona).name)}`, 'info');
      demoOpen = false;
      if (s.start === 'NEW') { openStart(set); return; }
      const mine = Flow.tokensFor(Flow.state.persona).find((k) => String(k.task) === String(s.start)) || Flow.tokensFor(Flow.state.persona)[0];
      location.hash = mine ? `#/task/${mine.id}` : s.go ? '#/' + s.go : '#/ho-so';
      render(); return;
    }
    const br = t.closest('[data-branch]');
    if (br) {
      const b = Flow.demoSet().branches[Number(br.dataset.branch)];
      Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
      demoOpen = false;
      const mine = Flow.tokensFor(b.who).find((k) => String(k.task) === String(b.task));
      toast(`Nhánh phụ: ${esc(b.name)} — vai ${esc(persona(b.who).name)}`, 'info');
      location.hash = `#/task/${mine.id}`;
      render(); return;
    }
    if (t.closest('#reset')) {
      const m = modal(`<div class="modal-h"><h3>Reset luồng?</h3></div><div class="modal-b">Xoá hồ sơ đang chạy và các ĐXMS, hồ sơ đã tạo trên prototype, quay về trước bước Thêm mới ĐXMS (SCR-28). Ý kiến ❓ đã ghi được giữ lại.</div>
        <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="rs">Reset</button></div>`);
      m.el.querySelector('#rs').onclick = () => { m.close(); Flow.reset(); Flow.setPersona('minh'); demoOpen = false; location.hash = '#/viec-cua-toi'; toast('Đã reset luồng.'); };
      return;
    }
    /* Reset luồng không đụng dữ liệu DMDC, E-Form, thầu, hợp đồng, thông báo; khôi phục riêng ở đây. */
    if (t.closest('#reset-eform')) { window.Catalog.reset(); window.EForm.reset(); window.Thau.reset(); window.CongKhai.reset(); window.HopDong.reset(); window.ThongBao.reset(); demoOpen = false; render(); toast('Đã khôi phục dữ liệu DMDC, E-Form, thầu, hợp đồng, thông báo.'); return; }
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
