/* Phân hệ Quản lý sản xuất — Chuyển giao từ nghiên cứu sang sản xuất (T71 S3, D-121).
   SX-06 Hồ sơ chuyển giao: danh sách gói, chi tiết gói (danh sách hồ sơ theo danh mục của khối 27 / 20, thẩm định, tiến trình); luồng SX-BG chạy trên sx-flow.js.
   SX-07 Sản phẩm sẵn sàng sản xuất (Kho Release): chỉ xem, sản phẩm có phiên bản đã qua cổng chuyển giao.
   Chi tiết dự án: tab Hồ sơ chuyển giao (gói của sản phẩm · phiên bản dự án), tab Điều kiện 4M; dự án chỉ Bắt đầu sản xuất khi đủ cổng (4M đạt hết, gồm tiêu chí Kho Release).
   Route: #/sx/chuyen-giao, #/sx/chuyen-giao/<mã gói>, #/sx/san-pham. Thay đổi lưu localStorage (sx-proto-cg). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vModal, vSelect } = window.UI;
  const K = () => window.Thau.kit;
  const head = (o) => window.Screens.head(o);
  const rerender = () => window.App.render();
  const F = () => window.SxFlow;
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const KHOI = { K1: 'Khối 1', K2: 'Khối 2' };
  const NHOM = { I: 'I. Hồ sơ pháp lý', II: 'II. Sản phẩm và tài liệu kỹ thuật ngoại', III: 'III. Hồ sơ nghiên cứu, thiết kế', IV: 'IV. Hồ sơ công nghệ và điều kiện sản xuất' };

  /* ---------- Lưu thay đổi ---------- */
  const KEY = 'sx-proto-cg';
  const blank = () => ({ pkgs: [], files: {}, need: {}, rel: {}, m4: {}, started: {} });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };

  /* ---------- Gói chuyển giao ---------- */
  const all = () => U.pkgs.concat(D.sxPackages);
  const byCode = (code) => { const g = all().find((x) => x.code === code); return g ? Object.assign({}, g, { name: `Gói chuyển giao ${g.product} ${g.version}` }) : null; };
  const prod = (code) => D.sxProducts.find((x) => x.code === code) || null;
  const caseOf = (g) => { const l = F().cases(g.code, 'SX-BG'); return l[l.length - 1] || null; };
  /* Danh sách hồ sơ của gói = danh mục hồ sơ chuyển giao (SX-13) theo khối, bản ghi đang hiệu lực. */
  function docs(g) {
    const rows = window.Catalog.rows('sx-ho-so-chuyen-giao').filter((r) => r.khoi === g.khoi && r.active !== false);
    const seedFile = (r) => (D.sxPackages.some((x) => x.code === g.code) && !(g.missing || []).includes(r.code) && r.buoc !== 4 ? `${r.code} ${r.name}.pdf` : null);
    const up = U.files[g.code] || {}, need = U.need[g.code] || [];
    return rows.map((r) => ({ code: r.code, name: r.name, nhom: r.nhom, req: r.buoc !== 4, buoc: r.buoc, file: up[r.code] || seedFile(r), need: need.includes(r.code) }));
  }
  const reqDocs = (g) => docs(g).filter((d) => d.req);
  const lacking = (g) => reqDocs(g).filter((d) => !d.file || d.need);
  const docCount = (g) => { const r = reqDocs(g); return [r.length - lacking(g).length, r.length]; };
  /* Trạng thái gói theo hồ sơ luồng đang chạy. */
  function stOf(g) {
    const c = caseOf(g);
    if (!c) return ['Đang lập', 'default'];
    if (c.status === 'done') return ['Đã duyệt', 'success'];
    const s = c.tokens.map((t) => String(t.step));
    if (s.includes('3a') || s.includes('3b')) return ['Đang thẩm định', 'info'];
    if (s.includes('4')) return ['Đang lập biên bản', 'info'];
    return (U.need[g.code] || []).length ? ['Yêu cầu bổ sung', 'warning'] : ['Đang lập', 'default'];
  }
  /* R&D tải / thay hồ sơ khi gói đang ở bước 1 và việc giao cho mình. */
  const canUpload = (g) => { const c = caseOf(g); return !!c && c.tokens.some((t) => String(t.step) === '1' && (t.who === pid() || isAdmin())); };
  /* Phạm vi xem: vai Khối 1 / Khối 2 thấy gói của khối; Nhà máy không xem hồ sơ thiết kế (GIẢ LẬP P-241); Kinh doanh, QA, Quản trị thấy hết. */
  const SCOPE = { sxld: 'K1', sxpm: 'K1', sxsub: 'K1', sxrd: 'K1', sxk2: 'K2' };
  const visible = () => (pid() === 'sxnm' ? [] : all().filter((g) => !SCOPE[pid()] || SCOPE[pid()] === g.khoi || F().cases(g.code).some((c) => c.tokens.some((t) => t.who === pid()))));

  /* ---------- Kho sản phẩm sẵn sàng sản xuất ---------- */
  const relOf = (code) => { const p = prod(code); return U.rel[code] || (p && p.ready ? { date: p.rel || null, pkg: null, ver: p.version } : null); };
  const ready = (code) => !!relOf(code);

  /* ---------- Bộ chặn và bộ xử lý hành động của SX-BG (đăng ký vào bộ chạy chung) ---------- */
  Object.assign(F().GUARD, {
    'bg.full': (c) => {
      const l = lacking(byCode(c.obj));
      return l.length ? `Còn ${l.length} hồ sơ bắt buộc chưa tải lên hoặc cần bổ sung: ${l.slice(0, 3).map((d) => d.code).join(', ')}${l.length > 3 ? '…' : ''}. Bạn cần tải đủ hồ sơ trước khi gửi thẩm định.` : null;
    },
  });
  Object.assign(F().ACT, {
    'bg.start': () => {},
    'bg.submit': (c) => { U.need[c.obj] = []; persist(); },
    /* Kết quả thẩm định theo từng nhánh (3a / 3b); yêu cầu bổ sung đánh dấu hồ sơ cần sửa ở danh sách hồ sơ của gói. */
    'bg.assess': (c, ch, x) => {
      const no = ch && ch[2] === 'no', v = x.values || {};
      c.vars.td = Object.assign({}, c.vars.td, { [x.step]: { kq: ch ? ch[0] : '', yk: v.tdYk || '', bs: no ? v.tdBoSung || [] : [], who: pid(), at: nowStamp() } });
      if (no) { U.need[c.obj] = [...new Set((U.need[c.obj] || []).concat(v.tdBoSung || []))]; persist(); }
    },
    /* Biên bản thống nhất (BM của QLSX + R&D) là hồ sơ cuối của danh mục (Khối 1: hồ sơ 27). */
    'bg.minutes': (c) => {
      const g = byCode(c.obj), d = docs(g).find((x) => x.buoc === 4);
      if (d) { U.files[g.code] = Object.assign({}, U.files[g.code], { [d.code]: c.vars.bbFile || 'Biên bản thống nhất.pdf' }); persist(); }
    },
    'bg.release': (c) => { const g = byCode(c.obj); U.rel[g.product] = { date: D.sxToday, pkg: g.code, ver: g.version }; persist(); },
  });

  /* ---------- SX-06 Danh sách gói chuyển giao ---------- */
  const href = (g) => 'sx/chuyen-giao/' + encodeURIComponent(g.code);
  const projectsOf = (g) => window.SxDuAn.all().filter((p) => p.product === g.product && p.version === g.version);
  const canCreate = () => isAdmin() || D.roleOf(pid()) === 'R-SX-RD';
  function list() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (gói chuyển giao = đối tượng cha của hồ sơ SX-BG)
    const k = K();
    const info = {
      scr: 'SX-06', name: 'Danh sách gói chuyển giao', uc: 'SX-KS-K2 §4.1 (cổng chuyển giao R&D → sản xuất); SX-KS-K1 §4 Bảng 10; CDS-BT-03COP COP2 A04',
      notes: [
        'Gói chuyển giao theo <b>sản phẩm · phiên bản</b>: R&D tải hồ sơ theo <b>Danh mục hồ sơ chuyển giao</b> của khối (Khối 1: 27, Khối 2: 20 — danh mục SX-13), gửi thẩm định; Quản lý sản xuất và Đảm bảo chất lượng thẩm định song song (GIẢ LẬP P-247); đạt thì lập biên bản thống nhất, sản phẩm vào Kho sản phẩm sẵn sàng sản xuất.',
        'Cột Hồ sơ = số hồ sơ bắt buộc đã tải / tổng (biên bản thống nhất lập ở bước 4, không tính khi gửi). Không có cột Thao tác: mở chi tiết bằng mã.',
        'Nhà máy không xem gói chuyển giao (hồ sơ thiết kế, GIẢ LẬP P-241).',
      ],
      q: ['P-238', 'P-239', 'P-247'], src: 'task-management/task-management.component · /task-management',
    };
    const ST = ['Đang lập', 'Yêu cầu bổ sung', 'Đang thẩm định', 'Đang lập biên bản', 'Đã duyệt'];
    return k.listPage({
      id: 'sxcg', exp: 'Danh sach goi chuyen giao', title: 'Danh sách gói chuyển giao', ph: 'Tìm kiếm theo mã gói, sản phẩm', info,
      right: canCreate() ? `<button class="vbtn primary" data-sx-cg-new>${icon('add')} Thêm mới</button>` : '',
      rows: () => visible().map((g) => { const x = byCode(g.code), [a, b] = docCount(x); return Object.assign(x, { st: stOf(x), du: a, tong: b, used: projectsOf(x).map((p) => p.code).join(', ') }); }),
      kwText: (g) => `${g.code} ${g.product} ${g.version}`,
      empty: () => ({ code: '', product: '', khoi: null, st: [] }),
      match: (g, f) => k.has(f.code, g.code) && k.has(f.product, g.product) && (!f.khoi || g.khoi === f.khoi) && k.inSet(f.st, g.st[0]),
      adv: (txt, sel) => `${txt('code', 'Mã gói')}${txt('product', 'Sản phẩm')}
        ${sel('khoi', 'Khối', { searchable: false, options: Object.entries(KHOI).map(([value, label]) => ({ value, label })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: ST.map((x) => ({ value: x, label: x })) })}`,
      cols: [['Trạng thái', 170, 'c'], ['Mã gói', 160], ['Sản phẩm', 260], ['Phiên bản', 150], ['Khối', 90], ['Hồ sơ', 100, 'c'], ['Cán bộ R&D', 180], ['Ngày tạo', 120], ['Dự án sử dụng', 200]],
      href,
      cell: (g) => `<td class="c">${badge(...g.st)}</td><td><a class="link" data-go="${href(g)}">${esc(g.code)}</a></td><td>${k.clamp(`${g.product} — ${(prod(g.product) || {}).name || ''}`)}</td>
        <td>${esc(g.version)}</td><td>${esc(KHOI[g.khoi])}</td><td class="c num">${g.du} / ${g.tong}</td><td>${k.clamp(pName(g.rd))}</td><td class="num">${esc(dmy(g.created))}</td><td>${g.used ? k.clamp(g.used) : k.dash}</td>`,
    });
  }
  /* Thêm mới gói: chọn sản phẩm · phiên bản chưa có trong Kho, chưa có gói đang lập → tạo gói + khởi tạo hồ sơ SX-BG, mở việc bước 1. */
  function createDlg() {
    const opts = D.sxProducts.filter((p) => !ready(p.code) && !all().some((g) => g.product === p.code && g.version === p.version))
      .map((p) => ({ value: p.code, label: `${p.code} — ${p.name} (${p.version}) · ${KHOI[p.khoi]}` }));
    let val = null;
    const m = vModal({ title: 'Thêm mới gói chuyển giao', size: 'md',
      body: `<div class="vfield" data-cg-new-f><div class="lr"><label>Sản phẩm · phiên bản <span class="req">*</span></label></div><div data-cg-new-sel></div><div class="msg" data-cg-new-err></div></div>
        <p class="cap">Danh sách hồ sơ của gói lấy theo Danh mục hồ sơ chuyển giao của khối sản phẩm.</p>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-cg-new-ok>Lưu</button>' });
    const host = m.el.querySelector('[data-cg-new-sel]');
    const draw = () => { host.innerHTML = vSelect({ id: 'sxcg-new-prod', value: val, searchable: true, placeholder: opts.length ? 'Chọn sản phẩm · phiên bản' : 'Không còn sản phẩm chưa chuyển giao', options: opts, onChange: (v) => { val = v; draw(); } }); };
    draw();
    m.el.querySelector('[data-cg-new-ok]').onclick = () => {
      if (!val) { m.el.querySelector('[data-cg-new-f]').classList.add('invalid'); m.el.querySelector('[data-cg-new-err]').textContent = 'Bạn cần chọn Sản phẩm · phiên bản.'; return; }
      const p = prod(val), n = all().filter((g) => g.product === p.code).length + 1;
      const g = { code: `GCG-${p.code}-${String(n).padStart(2, '0')}`, product: p.code, version: p.version, khoi: p.khoi, rd: pid() === 'admin' || pid() === 'qt' ? 'sxrd' : pid(), pm: p.khoi === 'K1' ? 'sxpm' : 'sxk2', created: D.sxToday };
      U.pkgs.unshift(g); persist();
      const c = F().start('SX-BG', g.code);
      m.close(); toast('<b>Thành công</b><br>Thêm mới thành công!');
      location.hash = `#/sx/viec/${encodeURIComponent(c.code)}/${c.tokens[0].id}`;
    };
  }

  /* ---------- SX-06 Chi tiết gói (cũng là thân màn xử lý việc của SX-BG) ---------- */
  const tabKey = (code) => 'cg:' + code;
  function docTable(g, editable) {
    const k = K(), rows = docs(g);
    const st = (d) => (d.need ? badge('Cần bổ sung', 'warning') : d.file ? badge('Đã tải lên', 'success') : d.req ? badge('Chưa tải lên', 'error') : badge('Lập ở bước 4', 'default'));
    return k.table([['Mã hồ sơ', 100], ['Tên hồ sơ', 300], ['Nhóm', 180], ['Tệp', 220], ['Trạng thái', 130, 'c']].concat(editable ? [['', 130, 'c']] : []), rows,
      (d) => `<td>${esc(d.code)}</td><td>${k.clamp(d.name)}</td><td>${k.clamp(NHOM[d.nhom] || d.nhom)}</td><td>${d.file ? k.clamp(d.file) : k.dash}</td><td class="c">${st(d)}</td>
        ${editable ? `<td class="c">${d.req ? `<label class="vbtn sm secondary">${icon('upload')} ${d.file ? 'Tải lại' : 'Tải file lên'}<input type="file" hidden data-cg-up="${esc(g.code)}|${esc(d.code)}"></label>` : ''}</td>` : ''}`);
  }
  function detail(code, opt) {
    // Theo: task-create (mode detail) + app-tabs (@khcn-core/ui); danh sách hồ sơ theo card Danh sách tài liệu (profile-detail)
    const o = opt || {}, k = K(), g = byCode(code);
    if (!g || !visible().some((x) => x.code === code)) {
      return `<div class="pg">${head({ title: o.title || 'Xem chi tiết gói chuyển giao', back: o.back || 'sx/chuyen-giao', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy gói chuyển giao hoặc bạn không có quyền xem.')}</div>`;
    }
    const c = caseOf(g), [du, tong] = docCount(g), edit = canUpload(g), p = prod(g.product) || {};
    const info = {
      scr: 'SX-06', name: 'Chi tiết gói chuyển giao', uc: 'SX-KS-K2 §4.1; SX-KS-K1 §4 Bảng 10',
      notes: [
        'Khuôn task-create (mode detail) + app-tabs; màn xử lý việc của luồng chuyển giao dùng chính thân màn này + thanh trạng thái (my-task-detail).',
        '<b>Hồ sơ chuyển giao</b>: dòng theo Danh mục hồ sơ chuyển giao của khối (cấu hình SX-13); R&D tải tệp ở bước 1. Nút <b>Gửi thẩm định</b> bị chặn khi còn hồ sơ bắt buộc chưa tải hoặc đang "Cần bổ sung" (bộ chặn bg.full — điều kiện ở bộ xử lý hành động, không ở giao diện).',
        '<b>Thẩm định</b>: Quản lý sản xuất và Đảm bảo chất lượng song song; một bên Yêu cầu bổ sung (chọn hồ sơ cần sửa) thì huỷ bên còn lại, gói về R&D (GIẢ LẬP P-247). Đạt cả hai → Quản lý sản xuất lập biên bản thống nhất → hệ thống ghi Kho sản phẩm sẵn sàng sản xuất.',
        '12 tên hồ sơ Khối 2 GIẢ LẬP (P-239).',
      ],
      q: ['P-238', 'P-239', 'P-247', 'P-258'], src: 'task-management/components/task-create (mode detail) · @khcn-core/ui app-tabs · profile-detail (Danh sách tài liệu)',
    };
    const alert = edit && lacking(g).length ? `<div class="hd-alerts"><div class="hd-alert warning">${icon('info')}<span>Còn ${lacking(g).length} hồ sơ bắt buộc chưa tải lên hoặc cần bổ sung.</span></div></div>` : '';
    const tInfo = () => k.card('Thông tin chung', `<div class="ginfo c3">
        ${k.kv('Mã gói', esc(g.code))}${k.kv('Sản phẩm', esc(`${g.product} — ${p.name || ''}`))}${k.kv('Phiên bản', esc(g.version))}
        ${k.kv('Trạng thái', badge(...stOf(g)))}${k.kv('Khối', esc(KHOI[g.khoi]))}${k.kv('Hồ sơ bắt buộc', `${du} / ${tong}`)}
        ${k.kv('Cán bộ R&D', esc(pName(g.rd)))}${k.kv('Quản lý sản xuất thẩm định', esc(pName(g.pm)))}${k.kv('Ngày tạo', esc(dmy(g.created)))}
        ${k.kv('Dự án sử dụng', projectsOf(g).map((x) => `<a class="link" data-go="sx/du-an/${encodeURIComponent(x.code)}">${esc(x.code)}</a>`).join(', ') || null, 'span3')}</div>`);
    const tHs = () => `<section class="vcard pad24" data-cg-docs><div class="vcard-h"><h3>Danh sách hồ sơ chuyển giao</h3><span class="cap">${du} / ${tong} hồ sơ bắt buộc</span></div>${docTable(g, edit)}</section>`;
    const tTd = () => {
      const td = (c && c.vars.td) || {}, v = (c && c.vars) || {};
      const row = (key, label) => { const x = td[key]; return [label, x]; };
      const rows = [row('3a', 'Quản lý sản xuất'), row('3b', 'Đảm bảo chất lượng')];
      return `<div data-cg-td>${k.card('Kết quả thẩm định', k.table([['Đơn vị thẩm định', 200], ['Người thẩm định', 200], ['Kết quả', 160, 'c'], ['Ý kiến', 360], ['Hồ sơ cần bổ sung', 240], ['Thời gian', 150]], rows,
        ([l, x]) => `<td>${esc(l)}</td><td>${x ? k.clamp(pName(x.who)) : k.dash}</td><td class="c">${x ? badge(x.kq, x.bs.length ? 'warning' : 'success') : badge('Chưa thẩm định', 'default')}</td>
          <td>${x && x.yk ? k.clamp(x.yk) : k.dash}</td><td>${x && x.bs.length ? k.clamp(x.bs.join(', ')) : k.dash}</td><td class="num">${x ? esc(dmy(x.at)) : k.dash}</td>`))}
        ${k.card('Biên bản thống nhất thành phần đủ điều kiện sản xuất', v.bbSo ? `<div class="ginfo c3">${k.kv('Số biên bản', esc(v.bbSo))}${k.kv('Ngày lập', esc(v.bbNgay || ''))}${k.kv('Tệp', esc(v.bbFile || ''))}
          ${k.kv('Thành phần đủ điều kiện sản xuất', esc(v.bbThanhPhan || ''), 'span3')}</div>` : '<p class="faint">Chưa lập biên bản.</p>')}</div>`;
    };
    const tTt = () => { if (!c) return k.card('Tiến trình', '<p class="faint">Chưa khởi tạo hồ sơ.</p>'); const pr = F().progress(c); return k.card('Hồ sơ chuyển giao', pr.top + pr.steps) + k.card('Lịch sử xử lý', pr.hist); };
    return `<div class="pg" data-cg-detail="${esc(g.code)}">
      ${head({ title: o.title || 'Xem chi tiết gói chuyển giao', back: o.back || 'sx/chuyen-giao', lg: true, info })}
      ${o.bar || ''}${alert}
      ${k.tabs(tabKey(g.code), [['info', 'Thông tin chung'], ['hs', 'Hồ sơ chuyển giao'], ['td', 'Thẩm định'], ['tt', 'Tiến trình']], { info: tInfo, hs: tHs, td: tTd, tt: tTt })}</div>`;
  }
  /* Biến ngữ cảnh eForm của SX-BG. */
  function ctx(code) {
    const g = byCode(code), [du, tong] = docCount(g);
    return { goi: { code: g.code, product: g.product, version: g.version, khoiText: KHOI[g.khoi] }, hsDu: du, hsTong: tong, hsOpts: reqDocs(g).map((d) => [d.code, `${d.code} — ${d.name}`]) };
  }

  /* ---------- SX-07 Sản phẩm sẵn sàng sản xuất ---------- */
  function release() {
    // Theo: ecat catalog-list (chỉ xem) — Kho CSDL Release (SX-KS-K2 §4.1, §5)
    const k = K();
    const info = {
      scr: 'SX-07', name: 'Sản phẩm sẵn sàng sản xuất', uc: 'SX-KS-K2 §4.1 (Kho CSDL Release tập trung); SX-KS-K1 §4',
      notes: ['Chỉ xem: sản phẩm · phiên bản vào danh sách khi gói chuyển giao được duyệt (luồng chuyển giao bước 5, hệ thống ghi). Sản phẩm phát hành trước khi có hệ thống không có gói chuyển giao (dữ liệu chuyển đổi).',
        'Kinh doanh, Lãnh đạo tra cứu sản phẩm sẵn sàng bán / sản xuất và tải bộ tài liệu chuẩn từ gói (SX-KS-K2 §5).'],
      q: ['P-243'], src: 'ecat catalog-list (chỉ xem)',
    };
    return k.listPage({
      id: 'sxsp', exp: 'San pham san sang san xuat', title: 'Sản phẩm sẵn sàng sản xuất', ph: 'Tìm kiếm theo mã, tên sản phẩm', info,
      rows: () => D.sxProducts.filter((p) => ready(p.code)).map((p) => Object.assign({}, p, { r: relOf(p.code) })),
      kwText: (p) => `${p.code} ${p.name}`,
      empty: () => ({ code: '', name: '', khoi: null }),
      match: (p, f) => k.has(f.code, p.code) && k.has(f.name, p.name) && (!f.khoi || p.khoi === f.khoi),
      adv: (txt, sel) => `${txt('code', 'Mã sản phẩm')}${txt('name', 'Tên sản phẩm')}${sel('khoi', 'Khối', { searchable: false, options: Object.entries(KHOI).map(([value, label]) => ({ value, label })) })}`,
      cols: [['Mã sản phẩm', 140], ['Tên sản phẩm', 320], ['Phiên bản', 160], ['Khối', 90], ['Ngày phát hành', 140], ['Gói chuyển giao', 180], ['Trạng thái', 190, 'c']],
      href: (p) => (p.r.pkg ? href({ code: p.r.pkg }) : 'sx/san-pham'),
      cell: (p) => `<td>${esc(p.code)}</td><td>${k.clamp(p.name)}</td><td>${esc(p.r.ver || p.version)}</td><td>${esc(KHOI[p.khoi])}</td><td class="num">${p.r.date ? esc(dmy(p.r.date)) : k.dash}</td>
        <td>${p.r.pkg ? `<a class="link" data-go="${href({ code: p.r.pkg })}">${esc(p.r.pkg)}</a>` : k.dash}</td><td class="c">${badge('Sẵn sàng sản xuất', 'success')}</td>`,
    });
  }

  /* ---------- Chi tiết dự án: tab Hồ sơ chuyển giao, tab Điều kiện 4M, nút Bắt đầu sản xuất ---------- */
  const pkgOf = (p) => all().find((g) => g.product === p.product && g.version === p.version) || null;
  function projectCg(p) {
    const k = K(), g = pkgOf(p), r = relOf(p.product);
    if (!g) {
      return `<div data-sx-cg>${k.card('Hồ sơ chuyển giao', r ? `<p>Sản phẩm ${esc(p.product)} · ${esc(p.version)} đã có trong Kho sản phẩm sẵn sàng sản xuất${r.date ? ` từ ${esc(dmy(r.date))}` : ''} (phát hành trước khi có hệ thống).</p>`
        : '<p class="faint">Chưa có gói chuyển giao cho sản phẩm · phiên bản của dự án.</p>')}</div>`;
    }
    const x = byCode(g.code), [du, tong] = docCount(x);
    return `<div data-sx-cg>${k.card('Gói chuyển giao', `<div class="ginfo c3">${k.kv('Mã gói', `<a class="link" data-go="${href(x)}">${esc(x.code)}</a>`)}${k.kv('Trạng thái', badge(...stOf(x)))}${k.kv('Hồ sơ bắt buộc', `${du} / ${tong}`)}</div>`)}
      ${k.card('Danh sách hồ sơ chuyển giao', docTable(x, false))}</div>`;
  }
  /* 4M: dự án đã sản xuất trước khi có hệ thống coi như đạt (dữ liệu chuyển đổi); tiêu chí auto đọc từ Kho Release. */
  const LATER = ['IN_PRODUCTION', 'ACCEPTANCE', 'DONE'];
  function m4Of(p) {
    const saved = Object.assign({}, D.sxM4Seed[p.code], U.m4[p.code]);
    return D.sxM4.map(([gk, gn, items]) => [gk, gn, items.map(([ik, iname, auto]) => {
      if (auto === 'release') { const r = relOf(p.product); return { ik, iname, auto: true, ok: !!r, note: r ? `Phát hành ${r.date ? dmy(r.date) : ''}${r.pkg ? ` theo gói ${r.pkg}` : ''}` : 'Chưa có gói chuyển giao đã duyệt', who: null, at: r && r.date }; }
      if (LATER.includes(p.status)) return { ik, iname, ok: true, note: 'Đạt trước khi đưa vào hệ thống', who: p.pm, at: p.start };
      return Object.assign({ ik, iname, ok: false, note: '', who: null, at: null }, saved[ik] || {});
    })]);
  }
  const gate = (p) => { const it = m4Of(p).flatMap((g) => g[2]); return { ok: it.filter((x) => x.ok).length, all: it.length, miss: it.filter((x) => !x.ok) }; };
  const gateBadge = (p) => { const x = gate(p); return x.ok === x.all ? badge('Sẵn sàng sản xuất', 'success') : badge(`Chưa đủ điều kiện (${x.ok}/${x.all})`, 'warning'); };
  const canM4 = (p) => ['PLANNING', 'PREPARING'].includes(p.status) && (p.pm === pid() || isAdmin());
  function projectM4(p) {
    const k = K(), x = gate(p), edit = canM4(p);
    const body = m4Of(p).map(([gk, gn, items]) => `<h4 class="ginfo-sub">${esc(gn)}</h4>${k.table([['Tiêu chí', 330], ['Kết quả', 110, 'c'], ['Ghi chú', 240], ['Người xác nhận', 160], ['Thời gian', 140]].concat(edit ? [['', 110, 'c']] : []), items,
      (i) => `<td>${k.clamp(i.iname)}</td><td class="c">${i.ok ? badge('Đạt', 'success') : badge('Chưa đạt', 'error')}</td><td>${i.note ? k.clamp(i.note) : k.dash}</td>
        <td>${i.auto ? 'Hệ thống' : i.who ? k.clamp(pName(i.who)) : k.dash}</td><td class="num">${i.at ? esc(dmy(i.at)) : k.dash}</td>
        ${edit ? `<td class="c">${i.auto ? '' : `<button type="button" class="vbtn sm secondary" data-m4="${esc(p.code)}|${esc(i.ik)}">Cập nhật</button>`}</td>` : ''}`)}`).join('');
    const sum = x.ok === x.all ? `<div class="hd-alert info">${icon('check')}<span>Đủ điều kiện sản xuất: ${x.all} / ${x.all} tiêu chí đạt.</span></div>`
      : `<div class="hd-alert warning">${icon('info')}<span>Chưa đủ điều kiện sản xuất: ${x.ok} / ${x.all} tiêu chí đạt. Còn: ${esc(x.miss.map((i) => i.iname).join('; '))}.</span></div>`;
    return `<section class="vcard pad24" data-sx-m4><div class="vcard-h"><h3>Điều kiện 4M</h3><span class="cap">Theo BM.QLHDSX.02</span></div><div class="hd-alerts">${sum}</div>${body}</section>`;
  }
  async function m4Dlg(code, ik) {
    const { rad, ta, txt, req, opts } = window.EForms.b;
    const p = window.SxDuAn.byCode(code), it = m4Of(p).flatMap((g) => g[2]).find((i) => i.ik === ik);
    const r = await window.EFormRun.open({ title: 'Cập nhật điều kiện 4M', schema: { id: 'sx-m4', components: [txt(`**${it.iname}**`), rad('kq', 'Kết quả', req({ values: opts([['DAT', 'Đạt'], ['CHUA', 'Chưa đạt']]) })), ta('note', 'Ghi chú')] },
      values: { kq: it.ok ? 'DAT' : 'CHUA', note: it.note } });
    if (!r || !r.submit) return;
    U.m4[code] = Object.assign({}, U.m4[code], { [ik]: { ok: r.values.kq === 'DAT', note: r.values.note || '', who: pid(), at: nowStamp() } });
    persist();
    window.SxDuAn.log(code, 'Cập nhật điều kiện 4M', `${it.iname}: ${r.values.kq === 'DAT' ? 'Đạt' : 'Chưa đạt'}`);
    toast('<b>Thành công</b><br>Cập nhật thành công!'); rerender();
  }
  /* Bắt đầu sản xuất: dự án Chuẩn bị sản xuất, Giám đốc dự án; chỉ khi đủ cổng (4M đạt hết). */
  const headBtn = (p) => (p.status === 'PREPARING' && (p.pm === pid() || isAdmin()) ? `<button type="button" class="vbtn secondary" data-sx-go-prod="${esc(p.code)}">Bắt đầu sản xuất</button>` : '');
  function goProd(code) {
    const p = window.SxDuAn.byCode(code), x = gate(p);
    if (x.ok !== x.all) { toast(esc(`Chưa đủ điều kiện sản xuất: còn ${x.all - x.ok} tiêu chí 4M chưa đạt (${x.miss.map((i) => i.iname).slice(0, 2).join('; ')}${x.miss.length > 2 ? '…' : ''}).`), 'warn'); return; }
    window.SxDuAn.patch(code, { status: 'IN_PRODUCTION' }, 'Bắt đầu sản xuất', 'Đủ điều kiện 4M');
    toast('<b>Thành công</b><br>Dự án chuyển sang Đang sản xuất!'); rerender();
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    if (t.closest('[data-sx-cg-new]')) { createDlg(); return; }
    const m = t.closest('[data-m4]');
    if (m) { const [c, i] = m.dataset.m4.split('|'); m4Dlg(c, i); return; }
    const gp = t.closest('[data-sx-go-prod]');
    if (gp) goProd(gp.dataset.sxGoProd);
  });
  document.addEventListener('change', (e) => {
    const u = e.target.closest && e.target.closest('[data-cg-up]');
    if (!u || !u.files || !u.files[0]) return;
    const [g, hs] = u.dataset.cgUp.split('|');
    U.files[g] = Object.assign({}, U.files[g], { [hs]: u.files[0].name });
    U.need[g] = (U.need[g] || []).filter((x) => x !== hs);
    persist(); toast('<b>Thành công</b><br>Tải lên thành công!'); rerender();
  });

  function route(parts) {
    if (parts[0] === 'san-pham') return release();
    return parts[1] ? detail(decodeURIComponent(parts[1])) : list();
  }
  function enter(parts) { if (parts[0] === 'chuyen-giao' && parts[1]) K().setTab(tabKey(decodeURIComponent(parts[1])), 'info'); }
  function reset() { U = blank(); persist(); }

  window.SxCg = { route, enter, reset, all, byCode, detail, ctx, tabKey, viewTitle: 'Xem chi tiết gói chuyển giao', ready, relOf, docs, lacking, gate, gateBadge, projectCg, projectM4, headBtn, stOf };
})();
