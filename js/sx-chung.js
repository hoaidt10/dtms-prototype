/* Phân hệ Quản lý sản xuất — phần dùng chung (T71 S12, D-124; SX-ULNL "Xóa, Import, Export", "Tích hợp ký số MySign").
   - importDlg: Nhập Excel theo khuôn vht-import-dialog + bảng Kết quả nhập dữ liệu (như Nhập nhà cung cấp, Nhập công việc S9): file mẫu, kiểm lỗi từng dòng, chỉ ghi khi Xác nhận nhập.
   - mySign: hộp thoại Ký số MySign (khuôn vht-modal như SCR-21 Trình ký) — GIẢ LẬP P-258: thật = service ký số gọi MySign (Viettel-CA), người ký xác nhận trên ứng dụng điện thoại,
     hệ thống hỏi trạng thái đến khi có kết quả rồi đóng dấu chữ ký vào tệp PDF.
   Xuất Excel dùng chung nằm ở khuôn danh sách Thau.kit.listPage (tham số exp). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, badge, toast, vModal } = window.UI;
  const pid = () => Flow.state.persona;
  const pName = (id) => { const p = D.personas.find((x) => x.id === id); return p ? p.name : ''; };
  const nowStamp = () => `${D.sxToday} ${new Date().toTimeString().slice(0, 5)}`;

  /* ---------- Nhập Excel ----------
     o = { entity (vd 'dự án sản xuất'), tpl (tên file mẫu), file (tên file giả lập chọn), cols [[nhãn, rộng]], rows() → [{ cells: [chuỗi], errs: [chuỗi], data }], commit(dòng hợp lệ) → số bản ghi, done(n) }. */
  function importDlg(o) {
    let file = null;
    const pick = () => {
      const m = vModal({ title: 'Nhập dữ liệu', size: 'w780', body: `<div class="imp" data-sx-imp-pick>
          <div class="imp-banner"><span class="imp-bl">${icon('file')}File mẫu nhập ${esc(o.entity)}</span>
            <button type="button" class="imp-tpl" data-imp-tpl>${icon('download')}Tải file mẫu</button></div>
          <button type="button" class="imp-zone" data-imp-zone><span class="imp-glyph">${icon('upload')}</span>
            <span class="imp-hint">${file ? esc(file) : 'Kéo thả file vào đây hoặc bấm để chọn'}</span>
            <span class="imp-sub">${file ? '14,2 KB' : 'Hỗ trợ định dạng .xlsx, .csv (tối đa 10MB)'}</span></button></div>`,
      actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-go" ${file ? '' : 'disabled'}>Nhập dữ liệu</button>` });
      m.el.querySelector('[data-imp-tpl]').onclick = () => toast(`<b>Thành công</b><br>Đã tải file ${esc(o.tpl)}`);
      m.el.querySelector('[data-imp-zone]').onclick = () => { file = o.file; m.close(); pick(); };
      m.el.querySelector('#imp-go').onclick = () => { m.close(); result(); };
    };
    const result = () => {
      const res = o.rows(), ok = res.filter((r) => !r.errs.length), cell = (v) => (v != null && v !== '' ? esc(v) : '<span class="dash">-</span>');
      const body = res.map((r, i) => `<tr><td class="ord">${i + 1}</td><td class="c">${r.errs.length ? badge('Lỗi', 'error') : badge('Hợp lệ', 'success')}</td>
          <td>${r.errs.length ? `<span class="imp-err">${esc(r.errs.join(' '))}</span>` : '<span class="dash">-</span>'}</td>${r.cells.map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('');
      const m = vModal({ title: 'Kết quả nhập dữ liệu', size: 'xl', body: `<div class="imp-res" data-sx-imp>
          <div class="imp-top"><span class="imp-sum">${ok.length}/${res.length} dòng hợp lệ</span><button type="button" class="vbtn primary" data-imp-again>${icon('upload')} Nhập file mới</button></div>
          <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th><th class="c" style="min-width:110px">Kết quả</th><th style="min-width:260px">Nội dung lỗi</th>
            ${o.cols.map(([h, w]) => `<th style="min-width:${w}px">${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>${body}</tbody></table></div></div>`,
      actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-ok" ${ok.length ? '' : 'disabled'}>Xác nhận nhập</button>` });
      m.el.querySelector('[data-imp-again]').onclick = () => { file = null; m.close(); pick(); };
      m.el.querySelector('#imp-ok').onclick = () => {
        const n = o.commit(ok);
        m.close();
        toast(`<b>Thành công</b><br>Nhập dữ liệu thành công (${n} ${o.unit || 'bản ghi'})`);
        if (o.done) o.done(n);
        window.App.render();
      };
    };
    pick();
  }

  /* ---------- Ký số MySign (GIẢ LẬP P-258) ----------
     o = { doc (tên tài liệu ký), reason (lý do ký) } → Promise { cert, serial, at, who } hoặc null khi huỷ.
     Bước 1: chọn chứng thư số + xác nhận; bước 2: chờ người ký xác nhận trên ứng dụng MySign (hệ thống hỏi trạng thái), xong thì trả kết quả. */
  const CERT = (id) => ({ serial: `54 03 ${String(id).length.toString(16).padStart(2, '0').toUpperCase()} 7A 1C ${(pName(id).length * 7).toString(16).toUpperCase().padStart(2, '0')} E2 91`, ca: 'Viettel-CA', to: '31/12/2027' });
  function mySign(o) {
    return new Promise((resolve) => {
      const who = pid(), c = CERT(who);
      let done = false;
      const end = (v) => { if (!done) { done = true; resolve(v); } };
      const m = vModal({ title: 'Ký số', size: 'md', body: `<div data-mysign>
          <div class="ginfo c2">
            <div class="span2"><div class="k">Tài liệu ký</div><div class="v">${esc(o.doc)}</div></div>
            <div class=""><div class="k">Người ký</div><div class="v">${esc(pName(who))}</div></div>
            <div class=""><div class="k">Hình thức ký</div><div class="v">Ký số MySign</div></div>
            <div class="span2"><div class="k">Chứng thư số</div><div class="v">${esc(`${pName(who)} — ${c.ca}, số sê-ri ${c.serial}, hiệu lực đến ${c.to}`)}</div></div>
            <div class="span2"><div class="k">Lý do ký</div><div class="v">${esc(o.reason || 'Phê duyệt')}</div></div></div>
          <p class="cap" data-mysign-st>Hệ thống gửi yêu cầu ký đến ứng dụng MySign trên điện thoại của bạn. Mở ứng dụng và xác nhận để hoàn tất.</p></div>`,
      actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-mysign-ok>Ký số</button>' });
      m.el.addEventListener('click', (e) => { if (e.target === m.el || e.target.closest('[data-close]')) end(null); });
      new MutationObserver((_, ob) => { if (!m.el.isConnected) { ob.disconnect(); end(null); } }).observe(document.body, { childList: true });
      const ok = m.el.querySelector('[data-mysign-ok]');
      ok.onclick = () => {
        ok.disabled = true; ok.textContent = 'Đang chờ xác nhận…';
        m.el.querySelector('[data-mysign-st]').innerHTML = `${icon('info')} Đã gửi yêu cầu ký đến ứng dụng MySign. Đang chờ bạn xác nhận trên điện thoại (tối đa 120 giây)…`;
        /* Hỏi trạng thái yêu cầu ký (GIẢ LẬP: người ký xác nhận sau khoảng 1 giây). */
        setTimeout(() => { if (done) return; const r = { cert: `${c.ca} · ${c.serial}`, at: nowStamp(), who }; done = true; m.close(); toast('<b>Thành công</b><br>Ký số thành công!'); resolve(r); }, 900);
      };
    });
  }
  /* Nhãn "Đã ký số" cho tài liệu / bước đã ký. */
  const signedBadge = (s) => `<span class="sx-signed" title="${esc(`${pName(s.who)} · ${s.cert} · ${s.at}`)}">${badge('Đã ký số', 'success')}</span>`;

  /* Góp ý 26/11 mục 3: không hiện cột mã riêng — ô tên kèm mã (tên trên, là link nếu mở được chi tiết; mã dòng nhỏ bên dưới). Dùng chung mọi bảng của phân hệ. */
  function nameCode(name, code, o) {
    const k = window.Thau.kit, opt = o || {}, label = name ? k.clamp(name) : esc(code || '');
    const head = opt.go ? `<a class="link" data-go="${opt.go}" title="${esc(opt.tip || 'Xem chi tiết')}">${label}</a>` : label;
    return name && code ? `${head}<div class="faint">${esc(code)}</div>` : head || k.dash;
  }
  /* Dự án: tên dự án kèm mã (không link — điều hướng dự án ở màn Dự án sản xuất). */
  const projCell = (code) => { const p = code && window.SxDuAn && window.SxDuAn.byCode(code); return p ? nameCode(p.name, p.code) : code ? esc(code) : window.Thau.kit.dash; };
  window.SxChung = { importDlg, mySign, signedBadge, nameCode, projCell };
})();
