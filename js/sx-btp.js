/* Phân hệ Quản lý sản xuất — Bán thành phẩm & tiến độ (T71 S5, D-121). Tab của Chi tiết dự án + SX-11 Cập nhật sản lượng (hộp thoại, dùng được ở khổ điện thoại).
   Hạng mục = bước 9 của kế hoạch theo Mô hình tổ chức: tự sản xuất → bán thành phẩm (số bộ), VMC tổng thầu → mốc tổng (% hoàn thành), gia công → lô (số thiết bị).
   Nhật ký sản lượng: nhập tay hoặc lấy số đạt từ trạm đo VMMS (chỉ xem, đồng bộ). % và ngày hoàn thành thực tế của bước 9 ở tab Kế hoạch & mốc đọc từ nhật ký (SxDuAn.leaf).
   Cảnh báo: Chậm tiến độ (quá hạn chưa xong), Có nguy cơ chậm (thấp hơn kế hoạch đến hôm nay ≥ 15 điểm % — GIẢ LẬP P-250). Lưu localStorage sx-proto-btp. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — tên kèm mã (SxChung.nameCode), dự án hiện tên kèm mã. */
  const NC = (n, c, o) => window.SxChung.nameCode(n, c, o), PJ = (c) => window.SxChung.projCell(c);
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

  /* ---------- Tab Tiến độ và chất lượng (Từ VMMS) — góp ý 26/11 mục 4 ----------
     Một bảng theo hạng mục: tiến độ (mục tiêu, thực hiện, % so kế hoạch) + chất lượng (số lỗi, tỷ lệ đạt theo trạm đo VMMS / nhật ký; kết quả IPQC).
     Bỏ Nhật ký sản lượng, Trạm đo, Định mức vật tư (Trạm đo, Định mức chuyển sang tab Dữ liệu VMMS). Số liệu đồng bộ từ VMMS — không có nút Cập nhật / Thêm mới
     (mục 5: dữ liệu đồng bộ về không thêm mới ở dự án); IPQC vẫn thêm được (kiểm soát chất lượng công đoạn của QA). */
  const KIND = { VHT_TU_SX: 'Theo dõi theo từng bán thành phẩm (đơn vị: bộ)', VMC_TONG_THAU: 'Theo dõi theo mốc tổng của gói tổng thầu (% hoàn thành)', GIA_CONG: 'Theo dõi theo lô gia công' };
  const ipqcOf = (p, key) => (window.SxNt ? window.SxNt.ipqcAll() : []).filter((x) => x.project === p.code && x.item === key).sort((a, b) => (a.at < b.at ? 1 : -1));
  /* Số lỗi / tỷ lệ đạt: trạm đo VMMS của hạng mục (lũy kế), không có trạm thì cộng nhật ký sản lượng. Mốc % (không có mục tiêu số lượng) không tính. */
  function quality(p, it) {
    if (it.target == null) return null;
    const st = stations(p).find((s) => s.item === it.key);
    const ok = st ? st.ok : it.r.done, ng = st ? st.ng : logsOf(p.code).filter((x) => x.item === it.key).reduce((a, x) => a + (x.ng || 0), 0);
    return { ng, rate: ok + ng ? ok / (ok + ng) * 100 : null };
  }
  function projectTab(p) {
    const k = K(), list = items(p), risk = list.filter((x) => x.st[0] === 'Có nguy cơ chậm');
    const alerts = risk.length ? `<div class="hd-alerts"><div class="hd-alert warning">${icon('info')}<span>${risk.length} hạng mục có nguy cơ chậm: ${esc(risk.map((x) => x.name).join('; '))}</span></div></div>` : '';
    const canQa = RUN.includes(p.status) && (isAdmin() || D.roleOf(pid()) === 'R-SX-QA');
    const tbl = k.table([['Hạng mục', 220], ['Phụ trách', 160], ['Kế hoạch', 120], ['Mục tiêu', 90, 'r'], ['Thực hiện', 90, 'r'], ['Hoàn thành', 100, 'r'], ['Kế hoạch đến hôm nay', 110, 'r'],
      ['Số lỗi', 80, 'r'], ['Tỷ lệ đạt', 90, 'r'], ['IPQC', 150], ['Trạng thái', 140, 'c']], list,
    (it) => {
      const q = quality(p, it), ip = ipqcOf(p, it.key), last = ip[0];
      const ipc = ip.length ? `<a class="link" data-btp-ipqc="${esc(p.code)}|${esc(it.key)}" title="Xem kết quả IPQC của hạng mục">${last.kq === 'DAT' ? 'Đạt' : 'Không đạt'} ${num(last.ok)}/${num(last.n)}</a><div class="faint">${ip.length} lần · ${esc(dmy(last.at))}</div>` : k.dash;
      return `<td>${k.clamp(it.name)}</td><td>${k.clamp(it.who)}</td><td class="num">${esc(dmy(iso(it.s)))} –<br>${esc(dmy(iso(it.e)))}</td>
        <td class="r num">${it.target == null ? '100%' : num(it.target)}</td><td class="r num">${it.target == null ? it.r.done + '%' : num(it.r.done)}</td><td class="r num">${it.r.pct}%</td><td class="r num">${it.exp}%</td>
        <td class="r num${q && q.ng ? ' t-err' : ''}">${q ? num(q.ng) : k.dash}</td><td class="r num">${q && q.rate != null ? q.rate.toFixed(1).replace('.', ',') + '%' : k.dash}</td><td>${ipc}</td><td class="c">${badge(...it.st)}</td>`;
    });
    const note = RUN.includes(p.status) ? '' : `<p class="cap">${p.status === 'DONE' ? 'Dự án đã hoàn thành.' : 'Dự án chưa bắt đầu sản xuất: số liệu đồng bộ khi dự án chuyển Đang sản xuất.'}</p>`;
    return `<div data-sx-btp><section class="vcard pad24"><div class="vcard-h"><h3>Tiến độ và chất lượng</h3><div class="row"><span class="cap">${esc(KIND[p.model] || '')} · đồng bộ từ VMMS</span>
        ${canQa ? `<button type="button" class="vbtn secondary" data-sxnt-ipqc-new="${esc(p.code)}">${icon('add')} Thêm kết quả IPQC</button>` : ''}</div></div>
      ${alerts}${note}${tbl}</section></div>`;
  }
  /* Kết quả IPQC của một hạng mục (bấm ô IPQC). */
  function ipqcDlg(code, key) {
    const k = K(), p = P().byCode(code), it = items(p).find((x) => x.key === key) || {};
    window.UI.vModal({ title: `Kết quả IPQC — ${it.name || key}`, size: 'xl', body: k.table([['Lần kiểm tra', 160], ['Công đoạn', 200], ['Số kiểm', 90, 'r'], ['Số đạt', 90, 'r'], ['Kết quả', 110, 'c'], ['Nội dung', 280], ['Phiếu bất thường', 140], ['Người kiểm', 160], ['Ngày', 110]], ipqcOf(p, key),
      (x) => `<td>${esc(x.code)}</td><td>${k.clamp(x.stage)}</td><td class="r num">${num(x.n)}</td><td class="r num">${num(x.ok)}</td><td class="c">${x.kq === 'DAT' ? badge('Đạt', 'success') : badge('Không đạt', 'error')}</td>
        <td>${x.note ? k.clamp(x.note) : k.dash}</td><td>${x.issue ? `<a class="link" data-go="sx/bat-thuong/${encodeURIComponent(x.issue)}" data-close title="Xem chi tiết phiếu bất thường">${esc(x.issue)}</a>` : k.dash}</td><td>${k.clamp(pName(x.who))}</td><td class="num">${esc(dmy(x.at))}</td>`),
    actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
  }
  document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-btp-ipqc]'); if (b) { const [c, key] = b.dataset.btpIpqc.split('|'); ipqcDlg(c, key); } });

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
