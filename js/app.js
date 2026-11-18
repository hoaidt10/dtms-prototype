/* Khung ứng dụng: topbar + sidebar (layout VHT), router theo hash, sự kiện chung, công cụ demo. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, persona, avatar, toast, askReason, signDialog, modal } = window.UI;

  let collapsed = false;
  let demoOpen = false;
  const openGroups = new Set(D.menu.concat(D.dmdcMenu, D.sxMenu || []).filter((m) => m.open).map((m) => m.label));
  try { collapsed = localStorage.getItem('dtms-proto-sb') === '1'; } catch (e) { /* bỏ qua */ }

  const route = () => (location.hash.replace(/^#\/?/, '') || 'viec-cua-toi');
  /* D-42: khung theo phân hệ — Danh sách Phân hệ (không sidebar), Danh mục dùng chung (sidebar riêng), còn lại Đầu tư mua sắm. */
  /* T71 S0 (D-121): phân hệ Quản lý sản xuất — route #/sx/…, sidebar D.sxMenu. */
  const appOf = (r) => ((extRoute(r) || {}).app || (r === 'phan-he' || r.startsWith('ph/he-') ? 'picker'
    : r === 'sx' || r.startsWith('sx/') ? 'sx'
    : r === 'dmdc' || r.startsWith('dmdc/') || r === 'eform' || r.startsWith('eform/') || r.startsWith('ph/dm-') ? 'dmdc' : 'dtms'));

  /* T77 S3 (D-129): chỗ cắm route của phân hệ — màn MỚI tự đăng ký trong tệp của phân hệ, không thêm dòng vào app.js:
       (window.AppRoutes = window.AppRoutes || []).push({ id: 'kdt-vi-du', match: (r) => r.startsWith('kdt-vi-du'),
         active: (r) => 'kdt', render: (r) => '<div class="pg">…</div>' });
     match nhận route không có '#/'; active trả path mục menu cần sáng; render trả HTML trang; app (tuỳ chọn) = 'dtms' | 'sx' | 'dmdc'
     chọn khung topbar / sidebar. Route đã có giữ nguyên bên dưới. */
  const extRoute = (r) => (window.AppRoutes || []).find((m) => { try { return m.match(r); } catch { return false; } });

  /* Mục menu đang được chọn theo route. */
  function activePath(r) {
    const ext = extRoute(r);
    if (ext) return ext.active ? ext.active(r) : r;
    if (r.startsWith('sx/')) return window.Sx.activePath(r);
    if (r.startsWith('task/') || r.startsWith('viec-cua-toi')) return 'viec-cua-toi';
    /* T17 phương án Gộp: luồng, ĐXMS, hồ sơ ĐXMS cùng thuộc mục Luồng mua sắm. */
    if (r === 'luong' || r.startsWith('luong/')) return 'luong';
    if (window.Luong.isGop() && (r.startsWith('dxms') || r.startsWith('ho-so-dxms') || ((r === 'ho-so' || r.startsWith('ho-so/')) && !Flow.state.kdt))) return 'luong';
    if (r === 'de-tai' || r.startsWith('de-tai/')) return 'de-tai';
    /* T45 §1.7: hai mục Hồ sơ chủ trương KĐT / Hồ sơ phê duyệt KĐT; Chi tiết hồ sơ (#/ho-so-kdt/<mã>) sáng mục theo loại hồ sơ. */
    if (/^ho-so-(ct|pd)-kdt(\/create)?$/.test(r)) return r.split('/')[0];
    if (r.startsWith('ho-so-kdt')) return window.KdtB2.listOf(decodeURIComponent(r.split('/')[1] || ''));
    if (r.startsWith('khlcnt')) return 'khlcnt';
    if (r.startsWith('goi-thau')) return 'goi-thau';
    if (r.startsWith('cong-khai-thau')) return 'cong-khai-thau';
    /* T67: hồ sơ con MS18 (mã HSKH-) thuộc menu KHLCNT. */
    if (r.startsWith('ho-so-hd/HSKH-')) return 'khlcnt';
    /* T67 T5: hồ sơ con MS19 (mã HSLC-) thuộc menu Gói thầu. */
    if (r.startsWith('ho-so-hd/HSLC-')) return 'goi-thau';
    if (r.startsWith('hop-dong') || r.startsWith('ho-so-hd')) return 'hop-dong';
    if (r.startsWith('thoa-thuan-khung')) return 'thoa-thuan-khung';
    if (r.startsWith('mau-thong-bao')) return 'mau-thong-bao';
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

  function topbar(app) {
    const prod = app === 'dmdc' ? { code: 'DMDC', name: 'Danh mục dùng chung' } : app === 'sx' ? D.sxProduct : D.product;
    const p = persona(Flow.state.persona);
    /* T71 S9: chuông của phân hệ Sản xuất = việc chờ xử lý + công việc quá hạn / sắp đến hạn của người dùng (sx-cong-viec.js). */
    const n = app === 'sx' ? window.SxFlow.pending(p.id) + (window.SxCv ? window.SxCv.remindCount(p.id) : 0) : Flow.pendingCount(p.id);
    return `<header class="topbar">
      <a class="brand" href="#/phan-he" aria-label="Về Danh sách Phân hệ"><span class="brand-logo">VHT</span>
        <span class="brand-text"><span>${prod.code}</span><span>${prod.name}</span></span></a>
      <div class="topbar-right">
        ${window.Tour ? window.Tour.topBtn() : ''}
        <button class="bell" aria-label="Thông báo" data-go="${app === 'sx' ? 'sx/viec-cua-toi' : 'viec-cua-toi'}">${icon('bell')}${n ? `<span class="count">${n}</span>` : ''}</button>
        <span class="rule"></span>
        <button class="who" id="who">${avatar(p.id)}<span class="who-text"><span>${esc(p.name)}</span><span class="r">${esc(p.role)}</span></span></button></div></header>`;
  }

  function navItem(m, level, act) {
    /* Danh mục dùng chung: chỉ hiện danh mục vai hiện tại được xem (P-36). */
    const kids = (m.children || []).filter((k) => (!k.dmdc || window.Catalog.canSee(k.dmdc)) && !(k.show && !D.show[k.show]));
    const childActive = kids.some((k) => k.path === act);
    const isActive = m.path && m.path === act;
    const open = openGroups.has(m.label) || childActive;
    const badge = m.badge === 'tasks' ? Flow.pendingCount(Flow.state.persona) : m.badge === 'sx-tasks' ? window.SxFlow.pending(Flow.state.persona) : 0;
    const cls = ['nav', level ? 'child' : '', isActive ? 'active' : '', childActive ? 'has-active' : '', open ? 'open' : ''].join(' ');
    const btn = `<button class="${cls}" ${m.path ? `data-go="${m.path}"` : `data-toggle="${esc(m.label)}"`} title="${esc(m.label)}">
      ${m.icon ? `<span class="i">${icon(m.icon)}</span>` : ''}<span class="l">${esc(m.label)}</span>
      ${badge ? `<span class="badge-n">${badge}</span>` : ''}${kids.length ? `<span class="chev">${icon('chev')}</span>` : ''}</button>`;
    return btn + (kids.length && open ? kids.map((k) => navItem(k, level + 1, act)).join('') : '');
  }

  function sidebar(act, app) {
    const dm = app === 'dmdc', sx = app === 'sx';
    /* Danh mục dùng chung: mục phẳng và nhóm Đầu tư mua sắm cùng lọc theo vai (P-36). */
    const items = dm ? D.dmdcMenu.filter((m) => (m.dmdc ? window.Catalog.canSee(m.dmdc) : !m.dmdcGroup || m.children.some((k) => window.Catalog.canSee(k.dmdc))))
      : sx ? D.sxMenu
        : window.Luong.menu().filter((m) => !m.hidden && !(m.show && !D.show[m.show]));
    const head = dm ? ['danh_muc_dung_chung', 'Danh mục dùng chung'] : sx ? ['phan_he_hang_hoa', 'Quản lý sản xuất'] : ['phan_he_mua_sam', 'Đầu tư mua sắm'];
    return `<aside class="sidebar ${collapsed ? 'collapsed' : ''}">
      <div class="sb-head"><span class="ic">${icon(head[0])}</span><span class="t">${head[1]}</span></div>
      <div class="sb-rule"></div>
      <nav class="sb-nav">${items.map((m) => navItem(m, 0, act)).join('')}</nav>
      <div class="sb-foot">v1.0 - © 2026</div>
      <button class="sb-toggle" id="sbt" aria-label="${collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}">${icon('collapse')}</button></aside>`;
  }

  function findMenu(path) {
    for (const g of D.menu.concat(D.dmdcMenu)) {
      if (g.path === path) return { item: g, group: null };
      for (const k of g.children || []) if (k.path === path) return { item: k, group: g };
    }
    /* Mục bỏ khỏi menu theo D-15: route cũ vẫn mở trang Đang phát triển. */
    const old = D.oldMenu.find((k) => k.path === path);
    return old ? { item: old, group: null } : null;
  }

  /* Route cũ của Quy trình BPMN / Ma trận hành động trước khi tách menu Quản trị quy trình (D-2); E-Form, Khoản đầu tư trước khi có màn thật (D-4, D-9). */
  const MOVED = { 'ph/quy-trinh': 'quy-trinh', 'ph/ma-tran': 'ma-tran/display-rule', 'ma-tran': 'ma-tran/display-rule', 'ph/dieu-chinh': 'ho-so-dxms', 'ph/eform': 'eform', 'ph/kdt': 'kdt', 'ph/ycbg': 'ycbg',
    'ph/ho-so-kdt': 'ho-so-ct-kdt', 'ho-so-kdt': 'ho-so-ct-kdt', 'ph/ycbg-kdt': 'ycbg', 'ycbg-kdt': 'ycbg', 'ph/khlcnt': 'khlcnt', 'ph/goi-thau': 'goi-thau', 'ph/ds-cam': 'nha-thau', 'ph/cong-khai-thau': 'cong-khai-thau',
    'ph/hop-dong': 'hop-dong', 'ph/po': 'thoa-thuan-khung', 'ph/mau-thong-bao': 'mau-thong-bao', 'ph/kenh-thong-bao': 'kenh-thong-bao', 'ph/trigger-thong-bao': 'trigger-thong-bao',
    'ph/bao-cao': 'bao-cao/tong-hop', 'ph/bao-cao-dxms': 'bao-cao/dxms', 'ph/bao-cao-kdt': 'bao-cao/kdt', 'ph/bao-cao-lcnt': 'bao-cao/lcnt', 'ph/bao-cao-hop-dong': 'bao-cao/hop-dong', 'ph/bao-cao-tien-do': 'bao-cao/tien-do', 'bao-cao': 'bao-cao/tong-hop' };

  /* T34: route cũ của phương án Tách → thay hash (không thêm lịch sử), render lại theo route mới. */
  function redirect(h) {
    setTimeout(() => location.replace(h), 0);
    return '<div class="pg"></div>';
  }
  function content(r) {
    const ext = extRoute(r);
    if (ext) return ext.render(r);
    const [a, b, c] = r.split('/');
    if (a === 'phan-he') return window.PhanHe.page();
    /* T71 (D-121): phân hệ Quản lý sản xuất (sx.js). */
    if (a === 'sx') return b ? window.Sx.route(r.split('/').slice(1)) : redirect('#/sx/tong-quan');
    if (a === 'giam-sat-tien-trinh') return window.QuyTrinh.monitor();
    if (a === 'quy-trinh') return b ? window.QuyTrinh.detail(b) : window.QuyTrinh.list();
    if (a === 'ma-tran') return window.MaTran.route(r.split('/').slice(1));
    if (a === 'chon-vai') return S.chonVai();
    if (a === 'viec-cua-toi') return S.viecCuaToi(b);
    /* T17 phương án Gộp: SCR-95 Danh sách luồng, SCR-96 Tạo luồng (luong.js). */
    if (a === 'luong') return window.Luong.route(r.split('/'));
    /* T29 S6, S7: SCR-103 Danh sách đề tài / dự án, SCR-104 Chi tiết (de-tai.js). */
    if (a === 'de-tai') return window.DeTai.route(r.split('/'));
    /* T29 B3a: SCR-105 Rà soát tồn kho. T59 #54 (D-114 Q4): không còn màn riêng — chuyển hướng về màn xử lý việc bước 7, tab Rà soát tồn kho
       (không có việc bước 7 đang mở: Chi tiết ĐXMS tab Rà soát tồn kho). */
    if (a === 'ra-soat-kho') return redirect(window.RaSoatKho.target());
    /* T29 B12 (D-78): SCR-107 Quản lý hồ sơ — biểu mẫu / văn bản đã sinh của mọi luồng. */
    if (a === 'quan-ly-ho-so') return window.QuanLyHoSo.page();
    /* T54 (SRS 32 DTMS_CN_0274): màn Trình ký. */
    if (a === 'trinh-ky') return b === 'viec' && c ? window.TrinhKy.taskPage(c) : window.TrinhKy.page();
    /* ĐXMS (cha): SCR-27 danh sách, SCR-28 thêm mới / chỉnh sửa, SCR-29 chi tiết — theo task-management. */
    /* T34 (D-90): bỏ phương án Tách — SCR-27 / 28 / 29 comment; route cũ chuyển sang Luồng mua sắm (SCR-95 / 96 / 97). */
    // [T34 bỏ Tách] if (a === 'dxms' && b === 'create') return S.dxmsForm();
    // [T34 bỏ Tách] if (a === 'dxms' && b && c === 'edit') return S.dxmsForm();
    // [T34 bỏ Tách] if (a === 'dxms' && b) return S.dxmsDetail(decodeURIComponent(b));
    // [T34 bỏ Tách] if (a === 'dxms') return S.dxmsList();
    if (a === 'dxms') return redirect(b === 'create' ? '#/luong/create' : b ? '#/luong/' + b : '#/luong');
    /* Yêu cầu báo giá ĐXMS (T16 B1): SCR-73 danh sách, SCR-74 chi tiết. */
    /* T29 B3b: SCR-106 Thêm mới / Cập nhật yêu cầu báo giá (ycbg/create, ycbg/<mã>/edit). */
    if (a === 'ycbg' && b === 'create') return window.YcbgForm.form(null);
    if (a === 'ycbg' && b && r.split('/')[2] === 'edit') return window.YcbgForm.form(decodeURIComponent(b));
    if (a === 'ycbg') return b ? window.Ycbg.detail(decodeURIComponent(b)) : window.Ycbg.list('all');
    /* T16 B2: YCBG KĐT (SCR-76/77), Danh sách hồ sơ KĐT (SCR-75), Quản lý thầu (SCR-78…83, thau.js). */
    if (a === 'ycbg-kdt') return b ? window.Ycbg.detail(decodeURIComponent(b)) : redirect('#/ycbg'); /* 12/11: danh sách gộp vào #/ycbg */
    if (a === 'tai-lieu-ct-kdt') return window.KdtTaiLieu.page('CT');
    if (a === 'tai-lieu-pd-kdt') return window.KdtTaiLieu.page('KDT');
    if (a === 'ho-so-ct-kdt') return b === 'create' ? window.Kdt.caseCreateFrom('CT') : window.KdtB2.caseList('CT');
    if (a === 'ho-so-pd-kdt') return b === 'create' ? window.Kdt.caseCreateFrom('KDT') : window.KdtB2.caseList('KDT');
    if (a === 'ho-so-kdt' && !b) return redirect('#/ho-so-ct-kdt');
    if (a === 'khlcnt' || a === 'goi-thau' || a === 'nha-thau') return window.Thau.route(r.split('/'));
    if (a === 'cong-khai-thau') return window.CongKhai.route();
    /* T16 B3: Hợp đồng (SCR-84…87), Thông báo (SCR-88…91), Báo cáo (SCR-93). */
    if (a === 'hop-dong' || a === 'thoa-thuan-khung') return window.HopDong.route(r.split('/'));
    /* T25: hồ sơ con của hợp đồng (D-47), khuôn SCR-20. */
    if (a === 'ho-so-hd') return S.hdCaseDetail(b, c);
    if (a === 'mau-thong-bao' || a === 'kenh-thong-bao') return window.ThongBao.route(r.split('/'));
    if (a === 'bao-cao' && b) return window.BaoCao.report(b);
    /* Hồ sơ (con): SCR-02 danh sách, SCR-25 thêm mới [/<mã ĐXMS>], SCR-20 chi tiết hồ sơ mẫu — theo profile-management. */
    // [T34 bỏ Tách] if (a === 'ho-so-dxms' && b === 'create') return S.profileCreate();
    if (a === 'ho-so-dxms' && b === 'create') return redirect('#/luong/create' + (c ? '/' + c : ''));
    /* T34: SCR-108 Điều chỉnh đề xuất mua sắm — danh sách ĐXMS điều chỉnh; Thêm mới theo khuôn Lập ĐXMS (luong.js, D-91). */
    if (a === 'dieu-chinh-dxms' && b === 'create') return window.Luong.route(['luong', 'create']);
    if (a === 'dieu-chinh-dxms') return S.adjList();
    /* T34 v0.2 (D-92): hồ sơ ĐXMS không còn màn riêng — #/ho-so-dxms/<mã hồ sơ>[/bpmn] → Chi tiết đề xuất mua sắm (tab Tiến trình / BPMN). */
    if (a === 'ho-so-dxms' && b) {
      const hc = S.allCases().find((x) => x.code === decodeURIComponent(b));
      if (hc && hc.dxms) return redirect(`#/luong/${encodeURIComponent(hc.dxms)}/${c === 'bpmn' ? 'bpmn' : 'tien-trinh'}`);
      return S.sampleDetail(decodeURIComponent(b), c);
    }
    // [T34 bỏ Tách] if (a === 'ho-so-dxms') return S.profileList();
    if (a === 'ho-so-dxms') return redirect('#/luong');
    /* Hồ sơ KĐT (SCR-20 dùng lại, B5): #/ho-so-kdt/<mã>[/bpmn]; #/ho-so khi đang chạy hồ sơ KĐT cũng mở khuôn này. */
    if (a === 'ho-so-kdt' && b) return S.kdtCaseDetail(decodeURIComponent(b), c);
    if (a === 'ho-so' && !window.Flow.state.kdt && !window.Flow.state.parent && window.Flow.state.status !== 'new' && window.Flow.state.dxms) {
      return redirect(`#/luong/${encodeURIComponent(window.Flow.state.dxms)}/${b === 'bpmn' ? 'bpmn' : 'tien-trinh'}`);
    }
    if (a === 'ho-so') return S.caseDetail(b);
    if (a === 'task' && c === 'bpmn') return S.taskBpmn(b);
    /* T29 B19 (DX-11): việc bước 01 / 04 / 05 của hồ sơ MS01 mở màn Lập đề xuất mua sắm (bước 1–5 trên một màn), không mở popup eForm. */
    /* Việc bước 01 / 04 / 05 (hồ sơ chủ trương) hoặc 50 (hồ sơ phê duyệt KĐT) của hồ sơ tạo từ màn Thêm mới hồ sơ KĐT (khuôn SCR-96) mở lại màn đó. */
    if (a === 'task' && !c && window.Kdt.isLap(window.Flow.token(b))) return window.Kdt.lapScreen(window.Flow.token(b));
    if (a === 'task' && window.Luong.isLap(window.Flow.token(b))) return window.Luong.lapScreen(window.Flow.token(b));
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
    /* Bộ demo Hợp đồng: việc đang chờ đọc từ kho hồ sơ con (đang ở màn khác thì S là luồng chính). */
    const pendingDemo = set.hd ? Flow.caseTokens('admin', set.hd) : st.tokens;
    return `<div class="demo-fab"><button class="demo-btn ${demoOpen ? 'on' : ''}" id="demo" aria-label="Công cụ demo" title="Công cụ demo">${icon('tool')}</button>
      ${demoOpen ? `<div class="demo-panel">
        <h4>Công cụ demo (không thuộc giao diện app)</h4>
        <div class="row"><a class="btn sm secondary" href="#/chon-vai">Chọn vai</a></div>
        ${window.Tour ? window.Tour.demoRow() : ''}
        ${/* [T34 bỏ Tách] <h4>Phương án menu ĐXMS (T17)</h4> + nút Tách / Gộp (data-luong-mode) */ ''}
        ${/* [T34 bỏ Tách] <div class="row"><button class="btn sm ${window.Luong.isGop() ? 'secondary' : 'primary'}" data-luong-mode="tach">Tách: ĐXMS · Hồ sơ</button><button class="btn sm ${window.Luong.isGop() ? 'primary' : 'secondary'}" data-luong-mode="gop">Gộp: Luồng mua sắm</button></div> */ ''}
        <h4>Đồng bộ từ Camunda</h4>
        <div class="row">${window.QuyTrinh.syncDemo()}</div>
        <h4>Hồ sơ demo</h4>
        <div class="row">${D.demoSets.map((d) => `<button class="btn sm ${d.key === set.key ? 'primary' : 'secondary'}" data-demo-set="${d.key}">${esc(d.label)}</button>`).join('')}</div>
        <h4>Việc đang chờ</h4>
        <div class="scene-list">${pendingDemo.length ? pendingDemo.map((k) => `<button data-persona="${k.who}"><span class="n">${esc(persona(k.who).short.slice(0, 2))}</span>${esc(persona(k.who).short)} · ${esc(k.name || Flow.taskName(k.task))}<span class="tk">task ${String(k.task).padStart(2, '0')}</span></button>`).join('') : '<span class="faint" style="font-size:12px">Không có việc đang chờ.</span>'}</div>
        <h4>Nhảy tới cảnh · ${esc(set.label)}</h4>
        <div class="scene-list">${set.scenes.map((s) => `<button data-scene="${s.n}"><span class="n">${s.n}</span>${esc(s.name)}<span class="tk">task ${s.tasks}</span></button>`).join('')}</div>
        ${set.branches.length ? `<h4>Nhánh phụ (mở khi khách hỏi)</h4>
        <div class="scene-list">${set.branches.map((b, i) => `<button data-branch="${i}"><span class="n">↳</span>${esc(b.name)}<span class="tk">task ${b.tasks}</span></button>`).join('')}</div>` : ''}
        ${set.events ? `<h4>Sự kiện theo dõi hợp đồng</h4>
        <div class="scene-list">${set.events.map((v, i) => (v.hidden ? '' : `<button data-hd-event="${i}"><span class="n">↯</span>${esc(v.label)}<span class="tk">${v.tasks}</span></button>`)).join('')}</div>` : ''}
        <h4>Hồ sơ</h4>
        <div class="row"><button class="btn sm secondary" id="reset">Reset luồng</button><a class="btn sm secondary" href="#/ho-so">${window.Flow.state.kdt || window.Flow.state.parent ? 'Chi tiết hồ sơ' : 'Chi tiết ĐXMS'}</a><a class="btn sm secondary" href="#/cho-chot">Điểm ❓ (${Object.keys(st.qNotes).length}/${Object.keys(D.openPoints).length})</a></div>
        <div class="row"><button class="btn sm secondary" id="reset-eform">Khôi phục dữ liệu mẫu</button></div>
        <div class="faint" style="font-size:12px;margin-top:8px">Đổi hồ sơ demo hoặc nhảy cảnh sẽ chạy lại từ đầu theo nhánh chính và giữ nguyên ý kiến ❓ đã ghi.</div>
      </div>` : ''}</div>`;
  }

  /* Cảnh bắt đầu trước khi có hồ sơ: bộ MS01.01 mở Thêm mới ĐXMS (SCR-28); bộ có ĐXMS mẫu mở Thêm mới hồ sơ khoá ĐXMS đó (SCR-25). */
  function openStart(set) {
    /* Bộ Hợp đồng: cảnh 1 mở Chi tiết hợp đồng, tab Thương thảo & ký kết có nút Tạo hồ sơ. */
    if (set.hd) { window.HopDong.openTab(set.hd, set.tab || 'tt'); return; }
    if (set.dxms === D.dxmsCode0) { openCreate('dxms'); return; }
    /* T34 (D-90, D-91): ĐXMS mẫu chưa có hồ sơ → Lập ĐXMS trên chính ĐXMS đó; bộ MS02 → Thêm mới điều chỉnh ĐXMS. */
    /* Bộ KĐT: cảnh 1 bắt đầu từ Thêm mới KĐT (SCR-55). */
    if (set.kdt) { if (location.hash === '#/kdt/create') { window.Kdt.enter(['create']); render(); } else location.hash = '#/kdt/create'; return; }
    // [T34 bỏ Tách] const h = '#/ho-so-dxms/create/' + encodeURIComponent(set.dxms);
    const h = (set.key === 'MS02' ? '#/dieu-chinh-dxms/create/' : '#/luong/create/') + encodeURIComponent(set.dxms);
    if (location.hash === h) { window.Luong.enter(h.slice(2).split('/')); render(); } else location.hash = h;
  }

  /* Màn mở Chi tiết hồ sơ mẫu (#/ho-so-dxms/<mã>…): Giám sát tiến trình, Chi tiết/Chỉnh sửa ĐXMS thì nút quay lại về đó, còn lại về Danh sách hồ sơ. */
  let lastRoute = null, detailFrom = null;

  function render() {
    const r = route();
    if (MOVED[r]) { location.replace('#/' + MOVED[r]); return; }
    /* Việc đang chờ trên hồ sơ mẫu (Việc của tôi): nạp hồ sơ vào luồng chạy rồi mở màn xử lý việc. */
    const rm = /^chay-mau\/([^/]+)$/.exec(r);
    if (rm) {
      const code = decodeURIComponent(rm[1]), st = Flow.state;
      if (st.status === 'running' && st.code && st.code !== code) { location.replace('#/viec-cua-toi'); runSample(code); return; }
      const tok = Flow.runSample(code);
      location.replace(tok ? '#/task/' + tok.id : '#/viec-cua-toi');
      return;
    }
    /* D-47: màn của hồ sơ con nạp S của hồ sơ đó; màn khác dùng luồng chính. */
    Flow.focus(r);
    const base = r.split('/').slice(0, 2).join('/');
    if (((r.startsWith('ho-so-dxms/') && !r.startsWith('ho-so-dxms/create')) || r.startsWith('ho-so-kdt/')) && !(lastRoute || '').startsWith(base)) detailFrom = lastRoute;
    if (r !== lastRoute) { S.enter(r); if (r.split('/')[0] === 'kdt') window.Kdt.enter(r.split('/').slice(1)); if (/^ho-so-(ct|pd)-kdt\/create$/.test(r)) window.Kdt.enterFrom(r.startsWith('ho-so-pd') ? 'KDT' : 'CT'); window.Thau.enter(r.split('/')); window.Luong.enter(r.split('/')); window.HopDong.enter(r.split('/')); window.ThongBao.enter(r.split('/')); window.Sx.enter(r.split('/')); }
    lastRoute = r;
    const act = activePath(r);
    const main = document.querySelector('.main');
    const sameRoute = !!main && main.dataset.route === r;
    const keepScroll = sameRoute ? main.scrollTop : 0;
    const oldNav = document.querySelector('.sb-nav');
    const navScroll = oldNav ? oldNav.scrollTop : 0;
    const app = appOf(r);
    document.getElementById('app').innerHTML = topbar(app)
      + `<div class="shell">${app === 'picker' ? '' : sidebar(act, app)}<main class="main" data-route="${esc(r)}">${content(r)}</main></div>` + demoPanel();
    document.querySelector('.main').scrollTop = keepScroll;
    /* Giữ vị trí cuộn menu trái qua lần vẽ lại (mở/đóng nhóm không làm menu nhảy về đầu); chỉ khi đổi trang mới đưa mục đang chọn vào tầm nhìn
       (các mục cuối menu như Danh mục dùng chung). Chỉ cuộn khung .sb-nav — không dùng
       scrollIntoView vì nó cuộn cả trang/khung cha làm toàn trang bị dịch lên. */
    const nav = document.querySelector('.sb-nav');
    if (nav) {
      nav.scrollTop = navScroll;
      const on = !sameRoute && nav.querySelector('.nav.active');
      if (on) {
        const nr = nav.getBoundingClientRect(), or = on.getBoundingClientRect();
        if (or.top < nr.top) nav.scrollTop += or.top - nr.top;
        else if (or.bottom > nr.bottom) nav.scrollTop += or.bottom - nr.bottom;
      }
    }
    window.scrollTo(0, 0);
    if (window.BpmnView) window.BpmnView.mount();
    document.title = app === 'sx' ? 'QLSX' : 'ĐTMS';
  }

  /* Trang Thêm mới (rule B6) luôn mở với form trống: 'dxms' = SCR-28 Thêm mới ĐXMS, 'hs' = SCR-25 Thêm mới hồ sơ. */
  function openCreate(what) {
    // [T34 bỏ Tách] const h = what === 'hs' ? '#/ho-so-dxms/create' : '#/dxms/create';
    const h = '#/luong/create';
    if (location.hash === h) { window.Luong.enter(h.slice(2).split('/')); render(); } else location.hash = h;
  }

  function openReplacement() {
    Flow.openReplacement();
    const tok = Flow.state.tokens.find((t) => t.task === 1);
    location.hash = `#/task/${tok.id}`;
  }

  function switchTo(id, stay) {
    Flow.setPersona(id);
    toast(`Đã chuyển tài khoản: <b>${esc(persona(id).name)}</b> — ${esc(persona(id).role)}`, 'info');
    /* T71: đang ở phân hệ Quản lý sản xuất thì về trang đầu của phân hệ, không sang Việc của tôi của ĐTMS. */
    if (!stay) location.hash = appOf(route()) === 'sx' ? '#/sx/viec-cua-toi' : '#/viec-cua-toi'; else render();
  }

  async function act(tokenId, idx) {
    const tok = Flow.token(tokenId);
    /* T39 B1 (D-99): việc giao nhiều người — người khác đã xử lý trước thì BE trả 409, màn báo và giữ nguyên. */
    if (!tok) { window.Vct.stale(); return; }
    let choice = idx >= 0 ? Flow.choices(tok.task)[idx] : null;
    /* Rule A4 / D1: nút luôn hiện; điều kiện dữ liệu (lockWhen trả lý do) kiểm tra khi bấm và chặn kèm thông báo. */
    const lock = choice && choice.lockWhen && choice.lockWhen(Flow.state.vars);
    if (lock) { toast(esc(typeof lock === 'string' ? lock : 'Chưa đủ điều kiện thực hiện hành động này.'), 'warn'); return; }
    /* Review nhi 06/11 #21, #31: bước làm trên màn riêng (f.page, vd bước 7 → SCR-105): nút mở màn, Gửi trên màn mới hoàn thành bước. */
    const f0 = Flow.def()[tok.task] || {};
    /* [T59 Q4] trước: if (!choice && f0.page && …inFlow()) { location.hash = '#/' + f0.page; return; } — màn riêng SCR-105 đã bỏ.
       T59: bước nhập trên tab của màn việc (f.tab, bước 7): nút đóng việc kiểm và lưu dữ liệu của tab rồi hoàn thành bước (RaSoatKho.submit). */
    if (!choice && f0.tab === 'ton-kho' && window.RaSoatKho && window.RaSoatKho.inFlow()) { window.RaSoatKho.submit(tok); return; }
    /* Nút → eForm của task (dialog) hoặc dialog nhận xét (nút từ chối, G6) → trình ký → hoàn thành (task-forms.js). */
    const r = await window.TaskForms.run(tok, choice);
    if (!r) return;
    /* Review nhi 06/11 #38: kết luận Từ chối trong màn phê duyệt → nhánh có lý do của BPMN. */
    if (r.choice) choice = r.choice;
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
    /* Hồ sơ con của hợp đồng: kết thúc → Chi tiết hợp đồng. */
    if (Flow.state.parent) {
      if (Flow.state.status !== 'running') {
        const pr = D.hdProcesses[Flow.state.vars.process];
        ok(Flow.state.vars.endText || pr.done);
        /* T67: đối tượng cha khác hợp đồng (KHLCNT của MS18) → Chi tiết đối tượng đó. */
        if (pr.obj) { location.hash = '#/' + pr.obj.href(Flow.state.parent); return; }
        if (pr.tab) window.HopDong.setTab(Flow.state.parent, pr.tab);
        location.hash = '#/hop-dong/' + encodeURIComponent(Flow.state.parent);
        return;
      }
      ok(choice && choice.sign ? 'Đã gửi văn bản đi trình ký.' : 'Thực hiện hành động thành công.');
      location.hash = '#/viec-cua-toi';
      return;
    }
    if (kdt && Flow.state.status === 'moved') {
      ok(`Hồ sơ đã chuyển luồng ${esc(Flow.state.movedTo.process)}. Hồ sơ mới: <b>${esc(Flow.state.movedTo.code)}</b>.`);
      location.hash = `#/kdt/${encodeURIComponent(kdt)}/chuyen-luong`;
      return;
    }
    /* T45 (D-103): hồ sơ chủ trương (BM-01) duyệt → Chi tiết KĐT (Đã phê duyệt chủ trương, lập tiếp hồ sơ Phê duyệt KĐT ở Chỉnh sửa › Tạo hồ sơ);
       gộp BM-00 hoặc hồ sơ KĐT duyệt → Chi tiết KĐT (Đã phê duyệt). */
    if (kdt && Flow.state.status !== 'running') {
      const ctOk = Flow.state.status === 'approved' && Flow.kdtStage() === 'CT_OK';
      ok(ctOk ? 'Đã phê duyệt chủ trương khoản đầu tư.' : Flow.state.status === 'approved' ? 'Đã phê duyệt khoản đầu tư.' : 'Đã kết thúc hồ sơ.');
      location.hash = `#/kdt/${encodeURIComponent(kdt)}`;
      return;
    }
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
    ok(choice && choice.sign ? (kdt && sg && sg.mode === 'hard' ? 'Đã chuyển ký ngoài hệ thống (bước 77).' : 'Đã gửi văn bản đi trình ký.') : 'Thực hiện hành động thành công.');
    location.hash = '#/viec-cua-toi';
  }

  /* Hồ sơ mẫu (Screens.sampleBar, Việc của tôi): nạp vào luồng chạy tại bước đang chờ (Flow.runSample) rồi mở màn xử lý việc; choice = nút đã bấm
     trên thanh trạng thái (số = thực hiện luôn hành động đó, 'more' = chỉ mở màn). Hồ sơ khác đang chạy dở → hỏi trước vì prototype chạy một hồ sơ một lúc. */
  async function runSample(code, choice) {
    const st = Flow.state;
    if (st.status === 'running' && st.code && st.code !== code) {
      const ok = await new Promise((res) => {
        const m = window.UI.vModal({ title: 'Chạy hồ sơ mẫu', body: `<p>Hồ sơ <b>${esc(code)}</b> là hồ sơ mẫu. Để thao tác, prototype nạp hồ sơ này vào luồng chạy tại bước đang chờ.</p>
          <p>Prototype chạy một hồ sơ một lúc: hồ sơ đang chạy <b>${esc(st.code)}</b> sẽ dừng ở trạng thái hiện tại${st.kdt ? '' : ' (hồ sơ ĐXMS trở về dữ liệu mẫu)'}.</p>`,
          actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="rs-ok">Tiếp tục</button>' });
        m.el.querySelector('#rs-ok').onclick = () => { m.close(); res(true); };
        m.el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => res(false)));
      });
      if (!ok) return;
    }
    const tok = Flow.runSample(code);
    if (!tok) { toast('Hồ sơ này chưa chạy được trên prototype.', 'warn'); return; }
    const h = '#/task/' + tok.id, idx = Number(choice);
    const go = () => { if (choice != null && choice !== '' && !Number.isNaN(idx) && Flow.token(tok.id)) act(tok.id, idx); };
    if (location.hash === h) { render(); go(); } else { window.addEventListener('hashchange', () => setTimeout(go, 0), { once: true }); location.hash = h; }
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
    /* T71: vai Sản xuất (cờ sx) chỉ hiện khi đang ở phân hệ Quản lý sản xuất; ở đó chỉ có vai Sản xuất + Quản trị hệ thống + toàn quyền.
       Danh mục dùng chung là phân hệ chung nên hiện mọi vai. */
    const app = appOf(route());
    const list = D.personas.filter((p) => (app === 'dmdc' ? true : app === 'sx' ? p.sx || p.all || p.id === 'qt' : !p.sx));
    el.innerHTML = `<div class="hd"><b>Chuyển tài khoản</b></div>`
      + list.map((p) => { const n = Flow.pendingCount(p.id); return `<button data-persona="${p.id}" class="${p.id === Flow.state.persona ? 'on' : ''}">${avatar(p.id, 'sm')}<span style="flex:1">${esc(p.name)}<br><span class="faint" style="font-size:12px">${esc(p.role)}</span></span>${n ? `<span class="tag red">${n}</span>` : ''}</button>`; }).join('');
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
// [T34 bỏ Tách]     /* T17 D-25: công tắc phương án menu ĐXMS (Tách / Gộp). */
// [T34 bỏ Tách]     const lm = t.closest('[data-luong-mode]');
// [T34 bỏ Tách]     if (lm) {
// [T34 bỏ Tách]       window.Luong.setMode(lm.dataset.luongMode);
// [T34 bỏ Tách]       demoOpen = false;
// [T34 bỏ Tách]       toast(window.Luong.isGop() ? 'Phương án <b>Gộp</b>: menu Luồng mua sắm.' : 'Phương án <b>Tách</b>: menu Đề xuất mua sắm và Hồ sơ đề xuất mua sắm.', 'info');
// [T34 bỏ Tách]       const h = window.Luong.isGop() ? '#/luong' : '#/dxms';
// [T34 bỏ Tách]       if (location.hash === h) render(); else location.hash = h;
// [T34 bỏ Tách]       return;
// [T34 bỏ Tách]     }
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
      if (s.start === 'NEW' || s.start === 'BASE') { openStart(set); return; }
      const pool = set.hd ? Flow.caseTokens(Flow.state.persona, set.hd) : Flow.tokensFor(Flow.state.persona);
      const mine = pool.find((k) => String(k.task) === String(s.start)) || pool[0];
      if (set.tab || s.tab) window.HopDong.setTab(set.hd, s.tab || set.tab);
      location.hash = mine ? `#/task/${mine.id}` : s.go ? '#/' + s.go : '#/ho-so';
      render(); return;
    }
    /* D-49: sự kiện của MS23 Tổng quan (đến mốc, nhà thầu thông báo, đến hạn, biên bản đã ký) không có màn riêng. */
    const he = t.closest('[data-hd-event]');
    if (he) {
      const set = Flow.demoSet(), v = set.events[Number(he.dataset.hdEvent)];
      demoOpen = false;
      if (Flow.hdEvent(set.hd, v.key, v.data)) toast(`Sự kiện: ${esc(v.label)}`, 'info');
      else toast('Hợp đồng chưa ký đầy đủ, chưa có hồ sơ theo dõi.', 'warn');
      window.HopDong.openTab(set.hd, set.tab);
      render(); return;
    }
    const br = t.closest('[data-branch]');
    if (br) {
      const b = Flow.demoSet().branches[Number(br.dataset.branch)];
      Flow.jumpTo(b.task, b.who, b.vars, b.process, b.dxms, b.ui, b.settle, b.pre);
      demoOpen = false;
      const hdSet = Flow.demoSet().hd;
      const mine = (hdSet ? Flow.caseTokens(b.who, hdSet) : Flow.tokensFor(b.who)).find((k) => String(k.task) === String(b.task));
      toast(`Nhánh phụ: ${esc(b.name)} — vai ${esc(persona(b.who).name)}`, 'info');
      location.hash = `#/task/${mine.id}`;
      render(); return;
    }
    if (t.closest('#reset')) {
      const m = modal(`<div class="modal-h"><h3>Reset luồng?</h3></div><div class="modal-b">Xoá hồ sơ đang chạy và các ĐXMS, hồ sơ đã tạo trên prototype, đưa quy trình và luật hiển thị về mẫu, quay về trước bước Thêm mới ĐXMS (SCR-28). Ý kiến ❓ đã ghi được giữ lại.</div>
        <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="rs">Reset</button></div>`);
      m.el.querySelector('#rs').onclick = () => { m.close(); Flow.reset(); if (window.SxFlow) { window.SxFlow.reset(); window.SxDuAn.reset(); window.SxCg.reset(); window.SxMs.reset(); window.SxBtp.reset(); window.SxBt.reset(); window.SxTd.reset(); if (window.SxCv) window.SxCv.reset(); if (window.SxKh) window.SxKh.reset(); if (window.SxNc) window.SxNc.reset(); if (window.SxHs) window.SxHs.reset(); if (window.SxVmms) window.SxVmms.reset(); if (window.SxBc) window.SxBc.reset(); window.SxNt.reset(); } Flow.setPersona('minh'); demoOpen = false; location.hash = '#/viec-cua-toi'; toast('Đã reset luồng.'); };
      return;
    }
    /* Reset luồng không đụng dữ liệu DMDC, E-Form, thầu, hợp đồng, thông báo; khôi phục riêng ở đây. */
    if (t.closest('#reset-eform')) { window.Catalog.reset(); window.EForm.reset(); window.Thau.reset(); window.CongKhai.reset(); window.HopDong.reset(); window.ThongBao.reset(); window.MaTran.reset(); window.QuyTrinh.resetSync(); D.duToanReset(); demoOpen = false; render(); toast('Đã khôi phục dữ liệu DMDC, E-Form, thầu, hợp đồng, thông báo, quy trình, luật hiển thị, dự toán đề tài / dự án.'); return; }
    const a = t.closest('[data-act]');
    if (a && !a.disabled) { act(a.dataset.act, Number(a.dataset.choice)); return; }
    const rs = t.closest('[data-run-sample]');
    if (rs) { runSample(rs.dataset.runSample, rs.dataset.runChoice); return; }
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
  /* T33 B2: tour hướng dẫn — ?tour=n mở thẳng; bản gửi khách lần đầu hiện danh sách tour. */
  if (window.Tour) window.Tour.boot();
})();
