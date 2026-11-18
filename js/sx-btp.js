/* Phân hệ Quản lý sản xuất — Bán thành phẩm & tiến độ (T71 S5, D-121). Tab của Chi tiết dự án + SX-11 Cập nhật sản lượng (hộp thoại, dùng được ở khổ điện thoại).
   Hạng mục = bước 9 của kế hoạch theo Mô hình tổ chức: tự sản xuất → bán thành phẩm (số bộ), VMC tổng thầu → mốc tổng (% hoàn thành), gia công → lô (số thiết bị).
   Nhật ký sản lượng: nhập tay hoặc lấy số đạt từ trạm đo VMMS (chỉ xem, đồng bộ). % và ngày hoàn thành thực tế của bước 9 ở tab Kế hoạch & mốc đọc từ nhật ký (SxDuAn.leaf).
   Cảnh báo: Chậm tiến độ (quá hạn chưa xong), Có nguy cơ chậm (thấp hơn kế hoạch đến hôm nay ≥ 15 điểm % — GIẢ LẬP P-250). Lưu localStorage sx-proto-btp. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  const P = () => window.SxDuAn;
  const rerender = () => window.App.render();
  const DAY = 86400000;
  const ms = (iso) => Date.parse(String(iso).slice(0, 10) + 'T00:00:00');
  const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const num = (n) => Number(n || 0).toLocaleString('vi-VN');
  const today = () => ms(D.sxToday);
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const RISK = 15;

  /* ---------- Nhật ký ---------- */
  const KEY = 'sx-proto-btp';
  let U = { logs: {} };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const logsOf = (code) => (D.sxOutput[code] || []).concat(U.logs[code] || []).map(([item, date, qty, ng, src, by, note]) => ({ item, date, qty, ng, src, by, note }));
  /* Mục tiêu theo mã hạng mục (không gọi planOf để tránh vòng lặp với SxDuAn.leaf): BTP → số bộ dự án; L<n> → cỡ lô; M<n> → mốc (null, theo %). */
  function targetOf(p, ck) {
    if (/^M\d/.test(ck)) return null;
    if (/^L\d/.test(ck)) { const lot = p.lot || Math.ceil(p.qty / 6), i = Number(ck.slice(1)) - 1; return Math.min(lot, p.qty - i * lot); }
    return p.qty;
  }
  /* % hoàn thành và ngày hoàn thành thực tế của hạng mục từ nhật ký. */
  function progress(p, ck) {
    const t = targetOf(p, ck), l = logsOf(p.code).filter((x) => x.item === ck).sort((a, b) => (a.date < b.date ? -1 : 1));
    if (t == null) { const last = l.reduce((a, x) => Math.max(a, x.qty), 0), hit = l.find((x) => x.qty >= 100); return { pct: Math.min(100, last), done: last, act: hit ? ms(hit.date) : null }; }
    let sum = 0, act = null;
    l.forEach((x) => { sum += x.qty; if (act == null && sum >= t) act = ms(x.date); });
    return { pct: Math.min(100, Math.round(sum / t * 100)), done: sum, act };
  }
  /* Trạng thái hạng mục: Hoàn thành / Chậm tiến độ / Có nguy cơ chậm / Đang thực hiện / Chưa bắt đầu. */
  function stOf(it, r) {
    const exp = Math.round(Math.max(0, Math.min(1, (today() - it.s) / Math.max(DAY, it.e - it.s))) * 100);
    if (r.pct >= 100) return { exp, st: ['Hoàn thành', 'success'] };
    if (today() > it.e) return { exp, st: ['Chậm tiến độ', 'error'] };
    if (exp - r.pct >= RISK) return { exp, st: ['Có nguy cơ chậm', 'warning'] };
    if (today() < it.s && !r.done) return { exp, st: ['Chưa bắt đầu', 'default'] };
    return { exp, st: ['Đang thực hiện', 'info'] };
  }
  const items = (p) => P().b9Items(p).map((it) => { const r = progress(p, it.key); return Object.assign(it, { r }, stOf(it, r)); });
  const stations = (p) => D.sxStations[p.code] || [];
  const RUN = ['IN_PRODUCTION', 'ACCEPTANCE'];
  /* Ai cập nhật: Giám đốc dự án; Sub PM với bán thành phẩm Khối 1; Nhà máy với dự án giao cho nhà máy mình (lô, mốc). */
  const canUpdate = (p, it) => RUN.includes(p.status) && (isAdmin() || p.pm === pid() || (pid() === 'sxsub' && /^BTP/.test(it.key) && p.khoi === 'K1') || (pid() === 'sxnm' && p.factory === 'NM-HP'));

  /* ---------- Tab Bán thành phẩm & tiến độ ---------- */
  const KIND = { VHT_TU_SX: 'Theo dõi theo từng bán thành phẩm (đơn vị: bộ)', VMC_TONG_THAU: 'Theo dõi theo mốc tổng của gói tổng thầu (% hoàn thành)', GIA_CONG: 'Theo dõi theo lô gia công' };
  function projectTab(p) {
    const k = K(), list = items(p), risk = list.filter((x) => x.st[0] === 'Có nguy cơ chậm');
    const unit = (it) => (it.target == null ? '%' : p.unitName);
    /* Hạng mục chậm đã có cảnh báo đầu trang (Chi tiết dự án); trong tab chỉ thêm cảnh báo nguy cơ chậm. */
    const alerts = [
      risk.length ? `<div class="hd-alert warning">${icon('info')}<span>${risk.length} hạng mục có nguy cơ chậm: ${esc(risk.map((x) => x.name).join('; '))}</span></div>` : ''].join('');
    const note = RUN.includes(p.status) ? '' : `<p class="cap">${p.status === 'DONE' ? 'Dự án đã hoàn thành.' : 'Dự án chưa bắt đầu sản xuất: cập nhật sản lượng mở khi dự án chuyển Đang sản xuất (đủ điều kiện sản xuất).'}</p>`;
    const tbl = k.table([['Hạng mục', 200], ['Phụ trách', 160], ['Kế hoạch', 120], ['Mục tiêu', 90, 'r'], ['Thực hiện', 90, 'r'], ['Hoàn thành', 90, 'r'], ['Kế hoạch đến hôm nay', 110, 'r'], ['Trạng thái', 140, 'c'], ['', 100, 'c']], list,
      (it) => `<td>${k.clamp(it.name)}</td><td>${k.clamp(it.who)}</td><td class="num">${esc(dmy(iso(it.s)))} –<br>${esc(dmy(iso(it.e)))}</td>
        <td class="r num">${it.target == null ? '100%' : num(it.target)}</td><td class="r num">${it.target == null ? it.r.done + '%' : num(it.r.done)}</td><td class="r num">${it.r.pct}%</td>
        <td class="r num">${it.exp}%</td><td class="c">${badge(...it.st)}</td>
        <td class="c">${canUpdate(p, it) && it.r.pct < 100 ? `<button type="button" class="vbtn sm secondary" data-btp-up="${esc(p.code)}|${esc(it.key)}">Cập nhật</button>` : ''}</td>`);
    const logs = logsOf(p.code).slice().sort((a, b) => (a.date < b.date ? 1 : -1)), name = (ck) => (list.find((x) => x.key === ck) || {}).name || ck;
    const logTbl = k.table([['Ngày', 120], ['Hạng mục', 260], ['Số đạt / % hoàn thành', 160, 'r'], ['Số lỗi', 90, 'r'], ['Nguồn', 150], ['Người cập nhật', 180], ['Ghi chú, sự cố', 300]], logs,
      (x) => { const t = targetOf(p, x.item); return `<td class="num">${esc(dmy(x.date))}</td><td>${k.clamp(name(x.item))}</td><td class="r num">${t == null ? x.qty + '%' : num(x.qty)}</td><td class="r num">${t == null ? '-' : num(x.ng)}</td>
        <td>${x.src === 'TRAM' ? 'Trạm đo VMMS' : 'Nhập tay'}</td><td>${k.clamp(pName(x.by))}</td><td>${x.note ? k.clamp(x.note) : k.dash}</td>`; });
    const st = stations(p);
    const stTbl = st.length ? k.table([['Mã trạm', 130], ['Trạm đo', 320], ['Hạng mục', 220], ['Số đạt (lũy kế)', 140, 'r'], ['Số lỗi', 100, 'r'], ['Tỷ lệ đạt', 110, 'r'], ['Đồng bộ lúc', 150]], st,
      (s) => `<td>${esc(s.code)}</td><td>${k.clamp(s.name)}</td><td>${k.clamp(name(s.item))}</td><td class="r num">${num(s.ok)}</td><td class="r num">${num(s.ng)}</td><td class="r num">${(s.ok / Math.max(1, s.ok + s.ng) * 100).toFixed(1).replace('.', ',')}%</td><td class="num">${esc(dmy(s.at))}</td>`)
      : '<p class="faint">Dự án không có trạm đo đồng bộ từ VMMS.</p>';
    const bom = (D.sxMbom[p.product] || []);
    const bomTbl = k.table([['Mã vật tư', 140], ['Tên vật tư', 300], ['ĐVT', 70], ['Định mức / bộ', 120, 'r'], ['Leadtime (tuần)', 120, 'r']], bom,
      (r) => `<td>${esc(r.code)}</td><td>${k.clamp(r.name)}</td><td>${esc(r.unit)}</td><td class="r num">${num(r.per)}</td><td class="r num">${r.lt}</td>`);
    return `<div data-sx-btp>
      <section class="vcard pad24"><div class="vcard-h"><h3>Tiến độ sản xuất</h3><span class="cap">${esc(KIND[p.model] || '')}</span></div>
        ${alerts ? `<div class="hd-alerts">${alerts}</div>` : ''}${note}${tbl}</section>
      ${k.card('Nhật ký sản lượng', logTbl)}
      <section class="vcard pad24" data-btp-vmms><div class="vcard-h"><h3>Trạm đo (VMMS)</h3><span class="cap">Chỉ xem — đồng bộ từ VMMS</span></div>${stTbl}</section>
      <section class="vcard pad24"><div class="vcard-h"><h3>Định mức vật tư (VMMS)</h3><span class="cap">Chỉ xem — đồng bộ từ VMMS</span></div>${bomTbl}</section></div>`;
  }

  /* ---------- SX-11 Cập nhật sản lượng ---------- */
  async function updateDlg(code, ck) {
    const { txt, dt, num: nf, ta, rad, req, opts } = window.EForms.b;
    const p = P().byCode(code), it = items(p).find((x) => x.key === ck), st = stations(p).find((s) => s.item === ck);
    const ms0 = it.target == null, left = ms0 ? null : it.target - it.r.done;
    const fromSt = st ? Math.max(0, st.ok - it.r.done) : 0;
    const comps = [txt(`**${it.name}** · ${ms0 ? `đã hoàn thành ${it.r.done}%` : `đã thực hiện ${num(it.r.done)} / ${num(it.target)} ${p.unitName}, còn ${num(left)}`}`),
      dt('ngay', 'Ngày', req({ layout: { columns: 8 } }))];
    if (ms0) comps.push(nf('qty', '% hoàn thành lũy kế', req({ validate: { required: true, min: it.r.done + 1, max: 100 }, layout: { columns: 8 } })));
    else {
      if (st) comps.push(rad('src', 'Nguồn số liệu', req({ values: opts([['TAY', 'Nhập tay'], ['TRAM', `Trạm đo ${st.code} (chênh lệch ${num(fromSt)})`]]) })));
      const viaSt = st ? { conditional: { hide: '=src = "TRAM"' } } : {};
      comps.push(nf('qty', `Số đạt (${p.unitName})`, Object.assign(req({ validate: { required: true, min: 1, max: left }, layout: { columns: 8 } }), viaSt)), nf('ng', 'Số lỗi', Object.assign({ validate: { min: 0 }, layout: { columns: 8 } }, viaSt)));
    }
    comps.push(ta('note', 'Ghi chú, sự cố'));
    const dk = `${code}|${ck}`;
    const r = await window.EFormRun.open({ title: 'Cập nhật sản lượng', schema: { id: 'sx-btp-cap-nhat', components: comps }, values: Object.assign({ ngay: dmy(D.sxToday), src: 'TAY', ng: 0 }, (U.drafts || {})[dk] || {}),
      check: (v) => { const d = fromDmy(v.ngay); if (!d) return 'Ngày phải đúng định dạng DD/MM/YYYY.'; if (d > D.sxToday) return 'Ngày cập nhật không được sau ngày hiện tại.'; return null; } });
    /* Lưu nháp: giữ nội dung đã nhập, mở lại hộp thoại của hạng mục thì điền lại. */
    if (r && r.draft) { U.drafts = Object.assign({}, U.drafts, { [dk]: r.values }); persist(); toast('<b>Thành công</b><br>Lưu nháp thành công!'); return; }
    if (!r || !r.submit) return;
    if (U.drafts) delete U.drafts[dk];
    const v = r.values, src = !ms0 && st && v.src === 'TRAM' ? 'TRAM' : 'TAY';
    const qty = src === 'TRAM' ? Math.min(left, fromSt) : Number(v.qty);
    (U.logs[code] = U.logs[code] || []).push([ck, fromDmy(v.ngay), qty, Number(v.ng) || 0, src, pid(), (v.note || '').trim()]);
    persist();
    P().log(code, 'Cập nhật sản lượng', `${it.name}: ${ms0 ? qty + '%' : '+' + num(qty) + ' ' + p.unitName}`);
    const after = items(p).find((x) => x.key === ck);
    toast(after.st[0] === 'Chậm tiến độ' || after.st[0] === 'Có nguy cơ chậm' ? `Đã cập nhật sản lượng. Hạng mục vẫn ${after.st[0].toLowerCase()} (${after.r.pct}% / kế hoạch ${after.exp}%).` : '<b>Thành công</b><br>Cập nhật sản lượng thành công!',
      after.st[0] === 'Chậm tiến độ' || after.st[0] === 'Có nguy cơ chậm' ? 'warn' : undefined);
    rerender();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-btp-up]');
    if (!b) return;
    const [c, k] = b.dataset.btpUp.split('|');
    updateDlg(c, k);
  });
  function reset() { U = { logs: {} }; persist(); }

  window.SxBtp = { progress, items, projectTab, logsOf, reset };
})();
