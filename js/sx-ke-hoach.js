/* Phân hệ Quản lý sản xuất — T74 #97 (comment hoaidt10 17/11): phần kế hoạch của Chi tiết dự án sản xuất (SX-04).
   - Thêm kế hoạch: thêm hạng mục / mốc vào cây Kế hoạch & mốc; hạng mục mới "Chưa phê duyệt" cho tới khi lần bổ sung được duyệt (Q5).
   - Phê duyệt kế hoạch: danh sách các lần phê duyệt (kế hoạch gốc = hồ sơ luồng SX-KH; các lần bổ sung kế hoạch); dòng chưa duyệt đứng đầu.
   - Nhân sự: người phụ trách trong kế hoạch (BM-QLHDSX-01 §3 "Nhân sự chính thực hiện"); Thêm / Sửa / Xoá; người phụ trách của hạng mục thêm mới chọn từ danh sách này.
   GIẢ LẬP P-270: duyệt lần bổ sung bằng nút trên dòng (thật: luồng điều chỉnh kế hoạch trên Camunda). Lưu localStorage sx-proto-kh2. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast } = window.UI;
  const K = () => window.Thau.kit;
  const P = () => window.SxDuAn;
  const rerender = () => window.App.render();
  const DAY = 86400000;
  const ms = (s) => Date.parse(String(s).slice(0, 10) + 'T00:00:00');
  const dmy = (s) => { if (!s) return ''; const [d, t] = String(s).split(' '); const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}${t ? ' ' + t : ''}`; };
  const fromDmy = (s) => { const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim()); return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;
  const pid = () => Flow.state.persona;
  const isAdmin = () => D.allAccess(pid()) || pid() === 'qt';
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const byName = (n) => D.personas.find((x) => x.name === n) || null;

  const KEY = 'sx-proto-kh2';
  const blank = () => ({ staff: {}, adds: {}, batches: {}, adj: {}, seq: 0 });
  let U = blank();
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  function reset() { U = blank(); persist(); SEL.row = {}; }

  const canPlan = (p) => p.status !== 'DONE' && (isAdmin() || p.pm === pid());
  const canApprove = () => isAdmin() || D.roleOf(pid()) === 'R-SX-LD';

  /* ---------- Hạng mục thêm mới (đọc ở SxDuAn.planOf) ---------- */
  const BT_ST = { DRAFT: ['Nháp', 'default'], PENDING: ['Chờ phê duyệt', 'warning'], APPROVED: ['Đã phê duyệt', 'success'], RETURNED: ['Trả lại', 'error'] };
  const batches = (code) => U.batches[code] || [];
  const batchOf = (code, id) => batches(code).find((b) => b.id === id) || null;
  /* Hạng mục thêm vào nhóm / bước có mã parent; pending = lần bổ sung chưa được duyệt. */
  function extra(p, parent) {
    return (U.adds[p.code] || []).filter((a) => a.parent === parent).map((a) => {
      const b = batchOf(p.code, a.batch) || {};
      return Object.assign({}, a, { pending: b.st !== 'APPROVED' });
    });
  }

  /* ---------- Nhân sự ---------- */
  /* Mặc định: người phụ trách trong cây kế hoạch + Nhân sự chính của kế hoạch đã lập (form BM-QLHDSX-01 ở luồng SX-KH). */
  function staffDefault(p) {
    const l = [], seen = new Set();
    const push = (name, unit, role) => { if (!name || seen.has(name)) return; seen.add(name); l.push({ id: 'd' + l.length, name, unit, role }); /* id mặc định d…, thêm mới n… (không trùng) */ };
    const c = window.SxFlow.cases(p.code, 'SX-KH').slice(-1)[0];
    ((c && c.vars.khNhanSu) || []).forEach((m) => push(m.hoTen, m.donVi || (byName(m.hoTen) || {}).unit || '', m.vaiTro || ''));
    P().leaves(P().planOf(p, true)).forEach((r) => { const ps = byName(r.who); push(r.who, ps ? ps.unit : r.who, ps ? ps.role : 'Đơn vị sản xuất'); });
    return l;
  }
  const staff = (p) => U.staff[p.code] || staffDefault(p);
  /* Hạng mục người đó đang phụ trách (lá của cây, kể cả hạng mục thêm mới). */
  const itemsOf = (p, name) => P().leaves(P().planOf(p)).filter((r) => r.who === name);

  function tabStaff(p) {
    const k = K(), l = staff(p), can = canPlan(p);
    const iconBtn = (ic, label, attrs) => `<button type="button" class="vbtn icon ghost" aria-label="${label}" title="${label}" ${attrs}>${icon(ic)}</button>`;
    return `<section class="vcard pad24" data-sx-ns><div class="vcard-h"><h3>Nhân sự</h3><div class="row"><span class="cap">Người phụ trách trong kế hoạch (BM.QLHDSX.01 — Nhân sự chính thực hiện)</span>
        ${can ? `<button type="button" class="vbtn secondary" data-sxns-add="${esc(p.code)}">${icon('add')} Thêm nhân sự</button>` : ''}</div></div>
      ${k.table([['Họ và tên', 220], ['Đơn vị', 260], ['Vai trò', 220], ['Hạng mục phụ trách', 360]].concat(can ? [['Thao tác', 110, 'c']] : []), l, (m) => {
    const it = itemsOf(p, m.name);
    return `<td>${k.clamp(m.name)}</td><td>${m.unit ? k.clamp(m.unit) : k.dash}</td><td>${m.role ? k.clamp(m.role) : k.dash}</td>
          <td>${it.length ? k.clamp(it.map((r) => r.name).join('; ')) : k.dash}</td>
          ${can ? `<td class="c"><div class="acts">${iconBtn('edit', 'Sửa', `data-sxns-edit="${esc(p.code)}|${esc(m.id)}"`)}<span class="sep"></span>${iconBtn('del', 'Xoá', `data-sxns-del="${esc(p.code)}|${esc(m.id)}"`)}</div></td>` : ''}`;
  })}</section>`;
  }
  async function staffDlg(code, id) {
    const p = P().byCode(code), l = staff(p).slice(), cur = l.find((m) => m.id === id);
    const { sel, tf, req, opts } = window.EForms.b;
    const people = D.personas.filter((x) => x.sx).map((x) => [x.name, `${x.name} — ${x.unit}`]);
    const r = await window.EFormRun.open({ title: cur ? 'Sửa nhân sự' : 'Thêm nhân sự', schema: { id: 'sx-ns', components: [
      sel('nsTen', 'Họ và tên', req({ searchable: true, values: opts(cur && !people.some((x) => x[0] === cur.name) ? people.concat([[cur.name, cur.name]]) : people) })),
      tf('nsVaiTro', 'Vai trò', req({ validate: { required: true, maxLength: 200 } }))] },
    values: { nsTen: cur ? cur.name : null, nsVaiTro: cur ? cur.role : '' },
    check: (v) => (l.some((m) => m.name === v.nsTen && m.id !== id) ? 'Người này đã có trong danh sách nhân sự.' : null) });
    if (!r || !r.submit) return;
    const ps = byName(r.values.nsTen), row = { id: id || 'n' + (U.seq += 1), name: r.values.nsTen, unit: ps ? ps.unit : (cur ? cur.unit : ''), role: r.values.nsVaiTro.trim() };
    /* Đổi tên người đang phụ trách hạng mục thêm mới → hạng mục đổi theo. */
    if (cur && cur.name !== row.name) (U.adds[code] || []).forEach((a) => { if (a.who === cur.name) a.who = row.name; });
    U.staff[code] = cur ? l.map((m) => (m.id === id ? row : m)) : l.concat([row]);
    persist();
    P().log(code, cur ? 'Sửa nhân sự dự án' : 'Thêm nhân sự dự án', `${row.name} — ${row.role}`);
    toast(`<b>Thành công</b><br>${cur ? 'Cập nhật' : 'Thêm mới'} thành công!`); rerender();
  }
  function staffDel(code, id) {
    const p = P().byCode(code), l = staff(p), m = l.find((x) => x.id === id);
    if (!m) return;
    const it = itemsOf(p, m.name);
    if (it.length) { toast(esc(`Không xoá được: ${m.name} đang phụ trách ${it.length} hạng mục kế hoạch (${it.slice(0, 2).map((r) => r.name).join('; ')}${it.length > 2 ? '…' : ''}).`), 'warn'); return; }
    U.staff[code] = l.filter((x) => x.id !== id); persist();
    P().log(code, 'Xoá nhân sự dự án', m.name);
    toast('<b>Thành công</b><br>Xoá thành công!'); rerender();
  }

  /* ---------- Điều chỉnh kế hoạch từng dòng (cột Thao tác › Sửa) ----------
     Sửa người phụ trách / ngày bắt đầu / ngày kết thúc của một hạng mục lá, bắt buộc có lý do; [Gửi duyệt] tạo lần điều chỉnh chờ duyệt (tab Phê duyệt kế hoạch);
     được duyệt mới đổi trên cây Kế hoạch & mốc (SxDuAn.leaf đọc override). GIẢ LẬP P-270: duyệt bằng nút trên dòng; thật: luồng điều chỉnh kế hoạch trên Camunda. */
  const adjOf = (code) => U.adj[code] || [];
  const override = (p, key) => adjOf(p.code).filter((a) => a.key === key && a.st === 'APPROVED').pop() || null;
  const pendingAdj = (p, key) => adjOf(p.code).find((a) => a.key === key && a.st === 'PENDING') || null;
  const canEdit = (p, key) => canPlan(p) && !pendingAdj(p, key);
  const findRow = (rows, key) => { for (const r of rows) { if (r.key === key) return r; const c = r.children && findRow(r.children, key); if (c) return c; } return null; };
  const fld = (label, ctl, o) => `<div class="vfield"${o && o.id ? ` id="${o.id}"` : ''}><div class="lr"><label>${esc(label)}</label>${o && o.req ? '<span class="req">*</span>' : ''}</div>${ctl}<p class="msg" hidden></p></div>`;
  function editDlg(code, key) {
    const p = P().byCode(code), row = p && findRow(P().planOf(p), key);
    if (!row || row.children || !canEdit(p, key)) return;
    const names = staff(p).map((m) => m.name); if (!names.includes(row.who)) names.unshift(row.who);
    const m = window.UI.vModal({ title: 'Sửa kế hoạch', size: 'md', body: `<div class="stack" data-sxkh-edit-form>
        <p class="cap">${esc(row.name)} · điều chỉnh được gửi duyệt ở tab Phê duyệt kế hoạch, được duyệt mới có hiệu lực.</p>
        ${fld('Người phụ trách', `<select class="vctl" id="ae-who">${names.map((n) => `<option ${n === row.who ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`, { req: 1 })}
        <div class="row" style="gap:16px">${fld('Bắt đầu kế hoạch', `<input class="vctl" type="date" id="ae-s" value="${iso(row.s)}">`, { req: 1 })}${fld('Kết thúc kế hoạch', `<input class="vctl" type="date" id="ae-e" value="${iso(row.e)}">`, { req: 1 })}</div>
        ${fld('Lý do sửa', '<textarea class="vctl ta" id="ae-why" rows="4" placeholder="Nhập lý do sửa kế hoạch"></textarea>', { req: 1 })}</div>`,
    actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" id="ae-send">Gửi duyệt</button>' });
    const q = (id) => m.el.querySelector(id);
    const fail = (id, msg) => { const f = q(id).closest('.vfield'); f.classList.add('invalid'); const e = f.querySelector('.msg'); e.textContent = msg; e.hidden = false; };
    q('#ae-send').onclick = () => {
      m.el.querySelectorAll('.vfield').forEach((f) => { f.classList.remove('invalid'); f.querySelector('.msg').hidden = true; });
      const who = q('#ae-who').value, s = q('#ae-s').value, e = q('#ae-e').value, why = q('#ae-why').value.trim();
      let bad = false;
      if (!s) { fail('#ae-s', 'Bạn cần nhập Bắt đầu kế hoạch.'); bad = true; }
      if (!e) { fail('#ae-e', 'Bạn cần nhập Kết thúc kế hoạch.'); bad = true; } else if (s && e < s) { fail('#ae-e', 'Ngày kết thúc không được trước ngày bắt đầu.'); bad = true; }
      if (!why) { fail('#ae-why', 'Bạn cần nhập Lý do sửa.'); bad = true; }
      if (!bad && who === row.who && s === iso(row.s) && e === iso(row.e)) { fail('#ae-why', 'Chưa có thay đổi nào so với kế hoạch hiện tại.'); bad = true; }
      if (bad) return;
      const l = U.adj[code] || (U.adj[code] = []);
      l.push({ id: 'ad' + (U.seq += 1), no: l.length + 1, key, name: row.name, old: { who: row.who, s: row.s, e: row.e }, who, s: ms(s), e: ms(e), reason: why, st: 'PENDING', by: pid(), at: nowStamp() });
      persist(); m.close();
      P().log(code, 'Gửi duyệt điều chỉnh kế hoạch', `${row.name} — ${why}`);
      toast('<b>Thành công</b><br>Gửi duyệt thành công!'); rerender();
    };
  }
  function adjDiff(a) {
    const o = [];
    if (a.who !== a.old.who) o.push(`Người phụ trách: ${a.old.who} → ${a.who}`);
    if (a.s !== a.old.s) o.push(`Bắt đầu: ${dmy(iso(a.old.s))} → ${dmy(iso(a.s))}`);
    if (a.e !== a.old.e) o.push(`Kết thúc: ${dmy(iso(a.old.e))} → ${dmy(iso(a.e))}`);
    return o;
  }
  function viewDlg(code, key) {
    const p = P().byCode(code), row = p && findRow(P().planOf(p), key); if (!row) return;
    const k = K(), st = P().stOf(row), hist = adjOf(code).filter((a) => a.key === key);
    window.UI.vModal({ title: 'Xem chi tiết hạng mục', size: 'md', body: `<div class="stack" data-sxkh-view-form><div class="ginfo c2">
        ${k.kv('Hạng mục / mốc', esc(row.name), 'span2')}${k.kv('Người / đơn vị phụ trách', esc(row.who))}${k.kv('Trạng thái', badge(...st))}
        ${k.kv('Bắt đầu kế hoạch', esc(dmy(iso(row.s))))}${k.kv('Kết thúc kế hoạch', esc(dmy(iso(row.e))))}${k.kv('Kết thúc thực tế', row.act ? esc(dmy(iso(row.act))) : null)}${k.kv('Hoàn thành', `${row.pct}%`)}</div>
      ${hist.length ? `<h4>Lịch sử điều chỉnh</h4>${k.table([['Lần', 60], ['Người gửi', 160], ['Ngày gửi', 130], ['Thay đổi', 260], ['Lý do', 220], ['Trạng thái', 130, 'c']], hist.slice().reverse(),
    (a) => `<td>${a.no}</td><td>${k.clamp(pName(a.by))}</td><td class="num">${esc(dmy(a.at))}</td><td>${k.clamp(adjDiff(a).join('; '))}</td><td>${k.clamp(a.reason)}</td><td class="c">${badge(...BT_ST[a.st])}</td>`)}` : ''}</div>`,
    actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
  }
  function setAdj(code, id, st, extraData, act) {
    const a = adjOf(code).find((x) => x.id === id); if (!a) return;
    Object.assign(a, { st }, extraData || {}); persist();
    P().log(code, act, `${a.name} (điều chỉnh lần ${a.no})`);
  }

  /* ---------- Thêm kế hoạch ---------- */
  const planBtn = (p) => (canPlan(p) ? `<button type="button" class="vbtn secondary" data-sxkh-add="${esc(p.code)}">${icon('add')} Thêm kế hoạch</button>` : '');
  async function addDlg(code) {
    const p = P().byCode(code), g = P().planOf(p, true);
    const { sel, tf, dt, req, opts, txt } = window.EForms.b;
    /* Thuộc: giai đoạn, hoặc bước đã có mục con (bước 4, bước 9) — hạng mục mới là lá của nhóm đó. */
    const parents = g.flatMap((x) => [[x.key, `Giai đoạn ${x.key.slice(1)}. ${x.name}`]].concat(x.children.filter((c) => c.children).map((c) => [c.key, `— ${c.name}`])));
    const names = staff(p).map((m) => [m.name, m.role ? `${m.name} — ${m.role}` : m.name]);
    const r = await window.EFormRun.open({ title: 'Thêm kế hoạch', schema: { id: 'sx-kh-add', components: [
      txt('Hạng mục mới được thêm vào cây Kế hoạch & mốc ở trạng thái **Chưa phê duyệt**; trình phê duyệt ở tab Phê duyệt kế hoạch.'),
      tf('khTen', 'Tên hạng mục / mốc', req({ validate: { required: true, maxLength: 500 } })),
      sel('khCha', 'Thuộc', req({ searchable: true, values: opts(parents) })),
      sel('khNguoi', 'Người phụ trách', req({ searchable: true, values: opts(names), description: 'Chọn trong danh sách tab Nhân sự' })),
      dt('khBd', 'Ngày bắt đầu', req({ layout: { columns: 8 } })), dt('khKt', 'Ngày kết thúc', req({ layout: { columns: 8 } }))] },
    values: { khBd: dmy(D.sxToday) },
    check: (v) => { const a = fromDmy(v.khBd), b = fromDmy(v.khKt); if (!a || !b) return 'Ngày phải đúng định dạng DD/MM/YYYY.'; if (b < a) return 'Ngày kết thúc không được trước ngày bắt đầu.'; return null; } });
    if (!r || !r.submit) return;
    const v = r.values;
    const l = U.batches[code] || (U.batches[code] = []);
    let b = l.find((x) => x.st === 'DRAFT' || x.st === 'RETURNED');
    if (!b) { b = { id: 'bs' + (U.seq += 1), no: l.length + 1, st: 'DRAFT', by: pid(), created: nowStamp() }; l.push(b); }
    (U.adds[code] || (U.adds[code] = [])).push({ key: 'X' + (U.seq += 1), name: v.khTen.trim(), parent: v.khCha, who: v.khNguoi, s: ms(fromDmy(v.khBd)), e: ms(fromDmy(v.khKt)), batch: b.id });
    persist();
    P().log(code, 'Thêm kế hoạch', `${v.khTen.trim()} (chưa phê duyệt)`);
    toast('<b>Thành công</b><br>Thêm kế hoạch thành công!'); rerender();
  }

  /* ---------- Phê duyệt kế hoạch: danh sách các lần phê duyệt ---------- */
  const SEL = { row: {} };
  function approvalRows(p) {
    const rows = window.SxFlow.cases(p.code, 'SX-KH').map((c, i) => {
      const sub = c.hist.find((h) => /Trình kế hoạch/.test(h.act || '')), ok = c.status === 'done';
      return { id: 'c:' + c.code, no: `Kế hoạch gốc${i ? ` (lần ${i + 1})` : ''}`, what: `Kế hoạch sản xuất${c.vars.khSo ? ` số ${c.vars.khSo}` : ''} — hồ sơ ${c.code}`,
        by: sub ? sub.who : null, at: sub ? sub.at : c.started, st: ok ? BT_ST.APPROVED : ['Đang phê duyệt', 'warning'], ap: ok ? (c.hist.filter((h) => /Phê duyệt/.test(h.act || '')).pop() || {}).who : null, open: !ok };
    });
    if (!rows.length && p.baseline) rows.push({ id: 'c:-', no: 'Kế hoạch gốc', what: 'Phê duyệt trước khi đưa vào hệ thống', by: p.pm, at: p.baseline, st: BT_ST.APPROVED, ap: null, open: false });
    batches(p.code).forEach((b) => {
      const it = (U.adds[p.code] || []).filter((a) => a.batch === b.id);
      rows.push({ id: 'b:' + b.id, no: `Bổ sung kế hoạch lần ${b.no}`, what: it.map((a) => a.name).join('; ') || 'Chưa có hạng mục', by: b.by, at: b.sentAt || b.created, st: BT_ST[b.st], ap: b.ap || null, open: b.st !== 'APPROVED', b, it });
    });
    adjOf(p.code).forEach((a) => rows.push({ id: 'a:' + a.id, no: `Điều chỉnh kế hoạch lần ${a.no}`, what: `${a.name}: ${adjDiff(a).join('; ') || 'Không đổi'}`, by: a.by, at: a.at, st: BT_ST[a.st], ap: a.ap || null, open: a.st !== 'APPROVED', adj: a }));
    return rows.sort((a, b) => (a.open === b.open ? 0 : a.open ? -1 : 1));
  }
  function tabApproval(p) {
    const k = K(), rows = approvalRows(p);
    if (!rows.length) return window.SxFlow.planTab(p);
    const cur = rows.find((r) => r.id === SEL.row[p.code]) || rows.find((r) => r.id.startsWith('c:')) || rows[0];
    const acts = (r) => {
      if (r.adj) {
        if (r.adj.st !== 'PENDING' || !canApprove()) return '';
        return `<span class="row" style="gap:8px;justify-content:center"><button type="button" class="vbtn sm secondary" data-sxkh-aback="${esc(p.code)}|${esc(r.adj.id)}">Trả lại</button><button type="button" class="vbtn sm primary" data-sxkh-aok="${esc(p.code)}|${esc(r.adj.id)}">Phê duyệt</button></span>`;
      }
      if (!r.b) return '';
      const b = r.b, out = [];
      if ((b.st === 'DRAFT' || b.st === 'RETURNED') && canPlan(p) && r.it.length) out.push(`<button type="button" class="vbtn sm primary" data-sxkh-send="${esc(p.code)}|${esc(b.id)}">Trình phê duyệt</button>`);
      if (b.st === 'PENDING' && canApprove()) out.push(`<button type="button" class="vbtn sm secondary" data-sxkh-back="${esc(p.code)}|${esc(b.id)}">Trả lại</button>`, `<button type="button" class="vbtn sm primary" data-sxkh-ok="${esc(p.code)}|${esc(b.id)}">Phê duyệt</button>`);
      return `<span class="row" style="gap:8px;justify-content:center">${out.join('')}</span>`;
    };
    const list = k.card('Danh sách phê duyệt kế hoạch', k.table([['Lần phê duyệt', 200], ['Nội dung', 380], ['Người trình', 180], ['Ngày trình', 140], ['Trạng thái', 150, 'c'], ['Người duyệt', 180], ['Thao tác', 220, 'c']], rows,
      (r) => `<td><a class="link" data-sxkh-sel="${esc(p.code)}|${esc(r.id)}">${esc(r.no)}</a></td><td>${k.clamp(r.what)}</td><td>${r.by ? k.clamp(pName(r.by)) : k.dash}</td>
        <td class="num">${r.at ? esc(dmy(r.at)) : k.dash}</td><td class="c">${badge(...r.st)}</td><td>${r.ap ? k.clamp(pName(r.ap)) : k.dash}</td><td class="c">${acts(r)}</td>`), 'Lần chưa phê duyệt đứng đầu; bấm tên lần phê duyệt để xem chi tiết');
    let det;
    if (cur.b) {
      det = k.card(`Chi tiết: ${cur.no}`, `${cur.b.note ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Lý do trả lại: ${esc(cur.b.note)}</span></div></div>` : ''}
        ${k.table([['Hạng mục / mốc', 360], ['Thuộc', 300], ['Người phụ trách', 200], ['Bắt đầu', 120], ['Kết thúc', 120]], cur.it,
    (a) => `<td>${k.clamp(a.name)}</td><td>${k.clamp(parentName(p, a.parent))}</td><td>${k.clamp(a.who)}</td><td class="num">${esc(dmy(iso(a.s)))}</td><td class="num">${esc(dmy(iso(a.e)))}</td>`)}`);
    } else if (cur.adj) {
      const a = cur.adj;
      det = k.card(`Chi tiết: ${cur.no}`, `${a.note ? `<div class="hd-alerts"><div class="hd-alert error">${icon('info')}<span>Lý do trả lại: ${esc(a.note)}</span></div></div>` : ''}
        ${k.table([['Hạng mục / mốc', 300], ['Nội dung thay đổi', 460], ['Lý do sửa', 300]], [a], (x) => `<td>${k.clamp(x.name)}</td><td>${k.clamp(adjDiff(x).join('; '))}</td><td>${k.clamp(x.reason)}</td>`)}`);
    } else det = window.SxFlow.planTab(p);
    return `<div data-sx-kh-list>${list}${det}</div>`;
  }
  const iso = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  function parentName(p, key) {
    for (const g of P().planOf(p, true)) { if (g.key === key) return `Giai đoạn ${g.key.slice(1)}. ${g.name}`; const c = g.children.find((x) => x.key === key); if (c) return c.name; }
    return key;
  }
  function setBatch(code, id, st, extraData, act) {
    const b = batchOf(code, id); if (!b) return;
    Object.assign(b, { st }, extraData || {}); persist();
    P().log(code, act, `Bổ sung kế hoạch lần ${b.no}`);
  }

  document.addEventListener('click', async (e) => {
    const t = e.target; if (!t.closest) return;
    const g = (a) => { const x = t.closest(`[${a}]`); return x ? x.getAttribute(a).split('|') : null; };
    let v;
    if ((v = g('data-sxns-add'))) { staffDlg(v[0], null); return; }
    if ((v = g('data-sxns-edit'))) { staffDlg(v[0], v[1]); return; }
    if ((v = g('data-sxns-del'))) { staffDel(v[0], v[1]); return; }
    if ((v = g('data-sxkh-add'))) { addDlg(v[0]); return; }
    if ((v = g('data-sxkh-edit'))) { editDlg(v[0], v[1]); return; }
    if ((v = g('data-sxkh-view'))) { viewDlg(v[0], v[1]); return; }
    if ((v = g('data-sxkh-aok'))) { setAdj(v[0], v[1], 'APPROVED', { ap: pid(), apAt: nowStamp() }, 'Phê duyệt điều chỉnh kế hoạch'); toast('<b>Thành công</b><br>Phê duyệt thành công!'); rerender(); return; }
    if ((v = g('data-sxkh-aback'))) {
      const { ta, req } = window.EForms.b;
      const r = await window.EFormRun.open({ title: 'Trả lại', schema: { id: 'sx-kh-aback', components: [ta('lyDo', 'Lý do trả lại', req({ rows: 3 }))] }, values: {} });
      if (!r || !r.submit) return;
      setAdj(v[0], v[1], 'RETURNED', { ap: pid(), note: r.values.lyDo.trim() }, 'Trả lại điều chỉnh kế hoạch'); toast('<b>Thành công</b><br>Trả lại thành công!'); rerender(); return;
    }
    if ((v = g('data-sxkh-sel'))) { SEL.row[v[0]] = v[1]; rerender(); return; }
    if ((v = g('data-sxkh-send'))) { setBatch(v[0], v[1], 'PENDING', { sentAt: nowStamp(), by: pid(), note: '' }, 'Trình phê duyệt bổ sung kế hoạch'); toast('<b>Thành công</b><br>Trình phê duyệt thành công!'); rerender(); return; }
    if ((v = g('data-sxkh-ok'))) { setBatch(v[0], v[1], 'APPROVED', { ap: pid(), apAt: nowStamp() }, 'Phê duyệt bổ sung kế hoạch'); toast('<b>Thành công</b><br>Phê duyệt thành công!'); rerender(); return; }
    if ((v = g('data-sxkh-back'))) {
      const { ta, req } = window.EForms.b;
      const r = await window.EFormRun.open({ title: 'Trả lại', schema: { id: 'sx-kh-back', components: [ta('lyDo', 'Lý do trả lại', req({ rows: 3 }))] }, values: {} });
      if (!r || !r.submit) return;
      setBatch(v[0], v[1], 'RETURNED', { ap: pid(), note: r.values.lyDo.trim() }, 'Trả lại bổ sung kế hoạch'); toast('<b>Thành công</b><br>Trả lại thành công!'); rerender();
    }
  });

  window.SxKh = { override, pendingAdj, canEdit, reset, extra, staff, tabStaff, tabApproval, planBtn, approvalRows };
})();
