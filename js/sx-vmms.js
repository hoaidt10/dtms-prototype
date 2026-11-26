/* Phân hệ Quản lý sản xuất — tab Dữ liệu VMMS của Chi tiết dự án (T71 S12, D-124; giữ D-121 Q5: chỉ xem).
   SX-ULNL tính công dựng Cấu trúc / thay đổi EBOM, MBOM, Quản lý thiết bị, nhân công, sản xuất và Đồng bộ VMMS (U7). Prototype không dựng các màn sửa đó ở QLSX:
   dữ liệu đọc từ VMMS (API đồng bộ — GIẢ LẬP P-256), thay đổi EBOM đi qua ECR / ECN của luồng Thay đổi kỹ thuật (SX-09).
   Năm phần: Cấu trúc EBOM / MBOM theo phiên bản, Lịch sử thay đổi (ECN), Thiết bị, Nhân công, Lệnh sản xuất. Nút Đồng bộ ngay gọi lại API (job định kỳ chạy 06:00 hằng ngày).
   Thời điểm đồng bộ lưu localStorage sx-proto-vmms. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, badge, toast, vSelect } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
  const rerender = () => window.App.render();
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;

  const KEY = 'sx-proto-vmms';
  let U = { at: {} };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const syncAt = (code) => U.at[code] || `${D.sxToday} 06:00`;

  /* ---------- Cấu trúc sản phẩm ----------
     EBOM = cấu trúc thiết kế (cụm → linh kiện, theo R&D); MBOM = cấu trúc sản xuất (công đoạn → vật tư, thêm vật tư tiêu hao, bao gói, tỷ lệ hao hụt).
     Dòng vật tư lấy từ MBOM dự toán (D.sxMbom, cùng nguồn Nhu cầu vật tư / Đề xuất mua sắm). */
  const CUM = [[/^(FPGA|SOC|DDR|BBU)/, 'Khối xử lý'], [/^(RF|PA|TRM|ANT)/, 'Khối cao tần'], [/^(IR|LENS)/, 'Khối quang học'], [/^(PSU|BAT|ADAPTER)/, 'Khối nguồn'],
    [/^PCB/, 'Bo mạch'], [/^(MECH|CASE|RRU)/, 'Cơ khí, vỏ'], [/^CON/, 'Đầu nối, cáp']];
  const cumOf = (code) => (CUM.find(([re]) => re.test(code)) || [null, 'Linh kiện khác'])[1];
  const STAGE = (code) => (/^(PCB|FPGA|SOC|DDR|BBU)/.test(code) ? 'Gia công bo mạch (SMT)' : 'Lắp ráp, tích hợp');
  /* Phiên bản EBOM theo sản phẩm (VMMS): [phiên bản, ngày ban hành, ECN, thay đổi {mã mới: [mã cũ, tên cũ]}]. Phiên bản cuối = phiên bản hiện hành. */
  const VERS = {
    'VT-25': [['v2.1_HW_Rev2', '2026-01-15', '', {}], ['v2.1_HW_Rev3', '2026-07-30', 'ECN-2026-001', { 'RF-PA-25W': ['RF-PA-25W-A', 'Module khuếch đại công suất RF 25W rev A (EOL)'] }]],
  };
  function versionsOf(p) {
    const base = VERS[p.product] ? VERS[p.product].slice() : [[p.version, p.created || p.start, '', {}]];
    /* ECN ban hành trên phân hệ (bước 8 luồng Thay đổi kỹ thuật) làm dự án đổi phiên bản → VMMS có phiên bản mới. */
    const ecn = window.SxTd ? window.SxTd.logOf(p.code).filter((r) => r[1] === 'ECN' && r[4] && !base.some((v) => v[0] === r[4])) : [];
    ecn.forEach((r) => base.push([r[4], r[0], r[2], {}]));
    if (!base.some((v) => v[0] === p.version)) base.push([p.version, D.sxToday, '', {}]);
    return base;
  }
  function bomRows(p, kind, ver) {
    const vs = versionsOf(p), vi = Math.max(0, vs.findIndex((v) => v[0] === ver)), later = vs.slice(vi + 1);
    /* Phiên bản cũ: dòng đã thay ở ECN sau đó hiện mã / tên cũ. */
    const items = (D.sxMbom[p.product] || []).map((m) => { const old = later.map((v) => v[3][m.code]).find(Boolean); return old ? Object.assign({}, m, { code: old[0], name: old[1] }) : Object.assign({}, m); });
    const chg = vs[vi][3];
    const leaf = (m, extra) => Object.assign({ key: `${kind}.${m.code}`, code: m.code, name: m.name, unit: m.unit, per: m.per, changed: !!chg[m.code] }, extra || {});
    if (kind === 'EBOM') {
      const groups = [...new Set(items.map((m) => cumOf(m.code)))];
      return groups.map((g, i) => ({ key: `E${i}`, code: `${p.product}-A${String(i + 1).padStart(2, '0')}`, name: g, unit: 'cụm', per: 1,
        children: items.filter((m) => cumOf(m.code) === g).map((m) => leaf(m, { loss: null })) }));
    }
    const stages = ['Gia công bo mạch (SMT)', 'Lắp ráp, tích hợp', 'Bao gói'];
    const extra = { 'Gia công bo mạch (SMT)': [{ code: 'CS-SOLDER-SAC', name: 'Kem hàn SAC305', unit: 'g', per: 4, loss: 8 }], 'Bao gói': [{ code: `PKG-${p.product}`, name: `Thùng, đệm xốp, nhãn ${p.product}`, unit: 'bộ', per: 1, loss: 2 }] };
    return stages.map((st, i) => ({ key: `M${i}`, code: `OP${(i + 1) * 10}`, name: st, unit: '', per: null,
      children: items.filter((m) => STAGE(m.code) === st).map((m) => leaf(m, { loss: m.per >= 4 ? 3 : 1 })).concat((extra[st] || []).map((m) => leaf(m))) })).filter((g) => g.children.length);
  }

  /* ---------- Thiết bị, nhân công theo đơn vị sản xuất; lệnh sản xuất theo dự án ---------- */
  const EQUIP = {
    VMC: [['TB-VMC-0112', 'Máy đo phân tích phổ R&S FSW43', 'Thiết bị đo', 'Trạm đo cao tần 2', 'Sẵn sàng', '2027-03-20'], ['TB-VMC-0145', 'Buồng thử nhiệt độ, độ ẩm ESPEC', 'Thiết bị thử nghiệm', 'Phòng thử môi trường', 'Sẵn sàng', '2027-01-08'],
      ['TB-VMC-0201', 'Dây chuyền SMT Fuji NXT III', 'Máy sản xuất', 'Xưởng SMT 1', 'Đang bảo trì', '2026-12-05'], ['TB-VMC-0233', 'Máy kiểm tra quang học AOI Koh Young', 'Thiết bị kiểm tra', 'Xưởng SMT 1', 'Sẵn sàng', '2027-02-14']],
    'NM-HL': [['TB-HL-0031', 'Bàn đo trục quang học', 'Thiết bị đo', 'Khu tích hợp quang', 'Chờ kiểm định', '2026-11-18'], ['TB-HL-0040', 'Máy hàn chọn lọc', 'Máy sản xuất', 'Xưởng lắp ráp', 'Sẵn sàng', '2027-04-30'],
      ['TB-HL-0052', 'Hệ thống đo độ phân giải ảnh hồng ngoại', 'Thiết bị đo', 'Khu tích hợp quang', 'Sẵn sàng', '2027-06-12']],
    'NM-HP': [['TB-HP-1010', 'Dây chuyền SMT 2 (Panasonic NPM)', 'Máy sản xuất', 'Dây chuyền SMT 2', 'Sẵn sàng', '2027-05-01'], ['TB-HP-1022', 'Máy kiểm tra ICT', 'Thiết bị kiểm tra', 'Dây chuyền SMT 2', 'Sẵn sàng', '2027-02-20'],
      ['TB-HP-1040', 'Trạm test RF Wi-Fi tự động', 'Thiết bị đo', 'Khu đo kiểm', 'Sẵn sàng', '2027-01-25']],
  };
  const LABOR = {
    VMC: [['Tổ SMT ca 1', 'Gia công bo mạch (SMT)', 18, 18, 'IPC-A-610'], ['Tổ tích hợp cao tần', 'Lắp ráp, tích hợp', 12, 10, 'Chứng chỉ ESD'], ['Tổ đo kiểm', 'Đo kiểm, thử nghiệm', 8, 8, 'Vận hành thiết bị đo RF']],
    'NM-HL': [['Tổ tích hợp quang', 'Lắp ráp, tích hợp', 6, 4, 'Chuyển giao công nghệ QĐ-12'], ['Tổ cơ khí', 'Gia công cơ khí', 5, 5, 'An toàn máy CNC']],
    'NM-HP': [['Tổ SMT ca 1', 'Gia công bo mạch (SMT)', 24, 24, 'IPC-A-610'], ['Tổ SMT ca 2', 'Gia công bo mạch (SMT)', 24, 22, 'IPC-A-610'], ['Tổ lắp ráp, bao gói', 'Lắp ráp, bao gói', 40, 40, '—']],
  };
  const EQ_V = { 'Sẵn sàng': 'success', 'Đang bảo trì': 'warning', 'Chờ kiểm định': 'warning' };
  /* Lệnh sản xuất: một lệnh theo hạng mục bước 9 của dự án đã chốt kế hoạch (lô / bán thành phẩm / mốc); số hoàn thành theo trạm cuối (VMMS). */
  function orders(p) {
    if (!p.baseline || !window.SxDuAn) return [];
    /* Mốc tổng của VMC tổng thầu (không có mục tiêu riêng) = lệnh sản xuất cả số lượng dự án tại VMC. */
    return window.SxDuAn.b9Items(p).map((it0, i) => { const it = Object.assign({}, it0, { target: it0.target || p.qty });
      const pr = window.SxBtp ? window.SxBtp.progress(p, it.key) : { pct: 0 };
      const done = Math.round(it.target * pr.pct / 100), st = pr.pct >= 100 ? ['Hoàn thành', 'success'] : pr.pct > 0 ? ['Đang sản xuất', 'info'] : ['Chưa bắt đầu', 'default'];
      return [`LSX-${p.code.slice(-3)}-${String(i + 1).padStart(2, '0')}`, it.name, it.target, done, pr.pct >= 100 ? 'Kho thành phẩm' : pr.pct > 0 ? 'Trạm đo kiểm cuối' : '—', st, it.s, it.e];
    });
  }

  /* ---------- Tab ---------- */
  const V = { part: {}, kind: {}, ver: {}, open: {} };
  const PARTS = [['bom', 'Cấu trúc sản phẩm'], ['ecn', 'Lịch sử thay đổi'], ['tb', 'Thiết bị'], ['nc', 'Nhân công'], ['lsx', 'Lệnh sản xuất']];
  function projectTab(p) {
    // Theo: task-create (mode detail) + app-tabs; bảng cây vht-tree-table (như Kế hoạch & mốc); tab pill như action-matrix (mt-tabs)
    const k = K(), part = V.part[p.code] || 'bom';
    const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const fac = p.factory, facN = fac ? (window.Catalog.rows('sx-don-vi').find((r) => r.code === fac) || {}).name || fac : '';
    let body = '';
    if (part === 'bom') {
      const kind = V.kind[p.code] || 'EBOM', vs = versionsOf(p), ver = V.ver[p.code] && vs.some((v) => v[0] === V.ver[p.code]) ? V.ver[p.code] : p.version, vr = vs.find((v) => v[0] === ver) || vs[vs.length - 1];
      const rows = bomRows(p, kind, ver), open = V.open[p.code] || (V.open[p.code] = new Set(rows.map((r) => r.key)));
      const cols = [
        { h: kind === 'EBOM' ? 'Cụm / linh kiện' : 'Công đoạn / vật tư', w: 360, toggler: true, cell: (r) => (r.children ? `<b>${esc(r.name)}</b>` : `${esc(r.name)}${r.changed ? ` ${badge('Thay đổi theo ' + vr[2], 'warning')}` : ''}`) },
        { h: 'Mã', w: 170, cell: (r) => esc(r.code) }, { h: 'ĐVT', w: 70, cell: (r) => esc(r.unit || '') },
        { h: 'Định mức / bộ', w: 120, align: 'r', cell: (r) => (r.per != null ? `<span class="num">${num(r.per)}</span>` : k.dash) },
      ].concat(kind === 'MBOM' ? [{ h: 'Hao hụt (%)', w: 110, align: 'r', cell: (r) => (r.loss != null ? `<span class="num">${r.loss}</span>` : k.dash) },
        { h: 'Nhu cầu dự án', w: 140, align: 'r', cell: (r) => (r.children ? k.dash : `<span class="num">${num(Math.ceil(r.per * p.qty * (1 + (r.loss || 0) / 100)))}</span>`) }] : []);
      const verOpts = vs.map((v) => ({ value: v[0], label: `${v[0]}${v[0] === p.version ? ' (đang dùng)' : ''}` }));
      body = `<div class="row" style="gap:12px;margin-bottom:12px;flex-wrap:wrap" data-vmms-bom="${kind}">
          <div class="vfield" style="width:200px"><div class="lr"><label>Loại cấu trúc</label></div>${vSelect({ id: 'vm-kind-' + p.code, value: kind, searchable: false, options: [{ value: 'EBOM', label: 'EBOM (thiết kế)' }, { value: 'MBOM', label: 'MBOM (sản xuất)' }], onChange: (x) => { V.kind[p.code] = x; V.open[p.code] = null; rerender(); } })}</div>
          <div class="vfield" style="width:260px"><div class="lr"><label>Phiên bản</label></div>${vSelect({ id: 'vm-ver-' + p.code, value: ver, searchable: false, options: verOpts, onChange: (x) => { V.ver[p.code] = x; V.open[p.code] = null; rerender(); } })}</div>
          <span class="cap" style="align-self:flex-end;padding-bottom:10px">Ban hành ${esc(dmy(vr[1]))}${vr[2] ? ` · theo ${esc(vr[2])}` : ''}</span></div>
        ${window.UI.vTreeTable({ id: 'vm-bom', columns: cols, rows, expanded: open, empty: 'Chưa có cấu trúc sản phẩm trên VMMS', onToggle: (key) => { if (open.has(key)) open.delete(key); else open.add(key); rerender(); } })}`;
    } else if (part === 'ecn') {
      const vs = versionsOf(p).slice().reverse();
      body = k.table([['Phiên bản', 180], ['Ngày ban hành', 130], ['Thông báo thay đổi (ECN)', 170], ['Nội dung thay đổi', 420]], vs, (v) => {
        const log = window.SxTd ? window.SxTd.logOf(p.code).find((r) => r[1] === 'ECN' && r[2] === v[2]) : null;
        const txt = log ? log[3] : Object.entries(v[3]).map(([n, o]) => `Thay ${o[0]} bằng ${n}`).join('; ');
        return `<td>${esc(v[0])}${v[0] === p.version ? ` ${badge('Đang dùng', 'info')}` : ''}</td><td class="num">${esc(dmy(v[1]))}</td><td>${v[2] ? esc(v[2]) : k.dash}</td><td>${txt ? k.clamp(txt) : 'Phiên bản phát hành ban đầu'}</td>`;
      });
    } else if (part === 'tb') {
      body = fac ? k.table([['Thiết bị', 380], ['Loại', 160], ['Trạm / dây chuyền', 200], ['Trạng thái', 150, 'c'], ['Hạn kiểm định', 130]], EQUIP[fac] || [],
        (r) => `<td>${NC(r[1], r[0])}</td><td>${esc(r[2])}</td><td>${k.clamp(r[3])}</td><td class="c">${badge(r[4], EQ_V[r[4]] || 'default')}</td><td class="num${r[5] < D.sxToday ? ' due-over' : ''}">${esc(dmy(r[5]))}</td>`)
        : '<p class="faint">Dự án chưa chọn đơn vị sản xuất.</p>';
    } else if (part === 'nc') {
      body = fac ? k.table([['Tổ / nhóm', 200], ['Công đoạn', 220], ['Số người', 100, 'r'], ['Đã đào tạo', 110, 'r'], ['Chứng chỉ, kỹ năng yêu cầu', 280]], LABOR[fac] || [],
        (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${r[2]}</td><td class="r num${r[3] < r[2] ? ' t-err' : ''}">${r[3]}</td><td>${k.clamp(r[4])}</td>`)
        : '<p class="faint">Dự án chưa chọn đơn vị sản xuất.</p>';
    } else {
      body = k.table([['Lệnh sản xuất (hạng mục / lô)', 340], ['Số lượng', 110, 'r'], ['Đã hoàn thành', 120, 'r'], ['Trạm hiện tại', 180], ['Trạng thái', 140, 'c'], ['Bắt đầu', 120], ['Kết thúc', 120]], orders(p),
        (r) => `<td>${NC(r[1], r[0])}</td><td class="r num">${num(r[2])}</td><td class="r num">${num(r[3])}</td><td>${esc(r[4])}</td><td class="c">${badge(...r[5])}</td><td class="num">${esc(dmy(iso(r[6])))}</td><td class="num">${esc(dmy(iso(r[7])))}</td>`);
    }
    return `<section class="vcard pad24" data-vmms="${esc(p.code)}">
      <div class="vcard-h"><h3>Dữ liệu VMMS</h3><div class="row"><span class="cap" data-vmms-at>Đồng bộ lần cuối ${esc(dmy(syncAt(p.code)))}</span>
        <button type="button" class="vbtn secondary" data-vmms-sync="${esc(p.code)}">Đồng bộ ngay</button></div></div>
      <p class="cap" style="margin:-4px 0 12px">Dữ liệu chỉ xem, quản lý trên VMMS${facN ? ` · Đơn vị sản xuất: ${esc(facN)}` : ''}. Thay đổi cấu trúc sản phẩm thực hiện qua yêu cầu thay đổi kỹ thuật.</p>
      <nav class="mt-tabs" style="margin-bottom:16px" aria-label="Dữ liệu VMMS">${PARTS.map(([x, l]) => `<button type="button" class="mt-tab ${x === part ? 'on' : ''}" data-vmms-part="${esc(p.code)}|${x}" ${x === part ? 'aria-current="page"' : ''}>${l}</button>`).join('')}</nav>
      <div data-vmms-body="${part}">${body}</div></section>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-vmms-part],[data-vmms-sync]');
    if (!b) return;
    if (b.dataset.vmmsPart) { const [code, part] = b.dataset.vmmsPart.split('|'); V.part[code] = part; rerender(); return; }
    /* Đồng bộ ngay: gọi API VMMS (GIẢ LẬP — dữ liệu mẫu không đổi, chỉ cập nhật thời điểm đồng bộ). */
    U.at[b.dataset.vmmsSync] = nowStamp(); persist();
    toast('<b>Thành công</b><br>Đồng bộ dữ liệu VMMS thành công');
    rerender();
  });
  function reset() { U = { at: {} }; persist(); }

  window.SxVmms = { projectTab, reset, versionsOf, bomRows };
})();
