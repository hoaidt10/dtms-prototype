/* T33 B2 — Tour hướng dẫn (plan docs/dtms/T33-goi-prototype-khach-ke-hoach.md §3.3). Lớp phủ của prototype như Công cụ demo,
   KHÔNG có trong hệ thống thật (rule prototype-ui A6): ẩn khi ?capture=1 và khi đang ở chế độ comment (T30).
   - 7 tour theo 7 tác vụ của HUONG-DAN.html (thứ tự trên hồ sơ ĐXMS-2026-0117 · MS01.01).
   - Nút "Hướng dẫn" luôn hiện trên thanh trên cùng; ô "Tự hiện danh sách tour mỗi lần mở prototype" (danh sách tour, Công cụ demo) lưu localStorage 'dtms-tour' (bọc try/catch).
   - Bản gửi khách (meta proto-build là ngày, không phải "dev"): mỗi lần mở tự hiện hộp chào. Bản dev / e2e không tự hiện.
   - Bắt đầu tour đưa hồ sơ demo tới bước cần xem (Flow.jumpToScene / jumpTo); hồ sơ đang chạy dở thì hỏi xác nhận trước.
   - Bước có `wait`: tự sang bước sau khi người xem làm xong; nút "Làm hộ" chạy `do`. Không thấy phần tử: popover giữa màn, ghi màn đã đổi.
   - index.html?tour=<1..7>: mở thẳng tour (liên kết từ HUONG-DAN.html). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc } = window.UI;
  const KEY = 'dtms-tour';
  const SET = 'MS01.01';

  /* ---------- Lưu lựa chọn ---------- */
  function pref() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function setPref(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* không lưu được: vẫn chạy trong phiên */ } MEM = p; }
  let MEM = null;
  const enabled = () => { const p = pref() || MEM; return !p || p.on !== false; };
  /* Bản gửi khách: proto-build là ngày (index.html nguồn ghi "dev"). */
  const release = () => { const m = document.querySelector('meta[name="proto-build"]'); return !!m && !!m.content && m.content !== 'dev'; };
  const hidden = () => document.body.classList.contains('cap') || document.body.classList.contains('rv-mode');

  /* ---------- Thao tác dùng chung ---------- */
  const go = (h) => { if (location.hash !== h) location.hash = h; else window.App.render(); };
  const tokOf = (n, cqcm) => Flow.state.tokens.find((k) => String(k.task) === String(n) && (!cqcm || k.cqcm === cqcm));
  /* Tua hồ sơ demo tới bước n, đứng ở vai được giao, mở màn việc. */
  function goTask(n, cqcm) {
    Flow.jumpTo(n, 'minh');
    const t = tokOf(n, cqcm);
    if (!t) return;
    Flow.setPersona(t.who);
    go('#/task/' + t.id);
  }
  const closeModals = () => document.querySelectorAll('.overlay').forEach((o) => { if (!o.closest('.tour-layer')) o.remove(); });
  const branch = (name) => (Flow.demoSet().branches || []).find((b) => b.name.startsWith(name));
  const visible = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  /* sel: chuỗi CSS, hoặc [CSS, chữ phải có] — lấy phần tử hiện đầu tiên khớp. */
  function find(sel) {
    if (!sel) return null;
    const [q, txt] = Array.isArray(sel) ? sel : [sel, null];
    return [...document.querySelectorAll(q)].find((e) => visible(e) && (!txt || e.textContent.includes(txt))) || null;
  }
  const act = (label) => ['.task-acts [data-act]', label];
  const actPrimary = '.task-acts [data-act].primary';
  const modalOpen = () => !!document.querySelector('.overlay .vmodal.ef');
  const route = (re) => () => re.test(location.hash);
  const click = (sel) => () => { const e = find(sel); if (e) e.click(); };
  /* Màn Lập ĐXMS: bấm ✦ Gợi ý từ AI của khối rồi Áp dụng popup (popup đang mở thì chỉ Áp dụng). */
  const aiDo = (sec) => () => { if (!find('[data-lf-ai-apply]')) click(`[data-lf-ai-sec="${sec}"]`)(); click('[data-lf-ai-apply]')(); };

  /* ---------- 7 tour ---------- */
  const TOURS = [
    { n: 1, name: 'Khởi tạo luồng và hồ sơ', who: 'Chuyên quản ĐVĐX', steps: [
      { enter: () => { Flow.jumpToScene(1, SET); if (!window.Luong.isGop()) window.Luong.setMode('gop'); Flow.setPersona('minh'); go('#/luong'); },
        sel: '.sb-nav [data-go="luong"]', title: 'Đề xuất mua sắm', text: 'Danh sách đề xuất mua sắm (ĐXMS) nằm ở menu <b>Quản lý đề xuất mua sắm &gt; Đề xuất mua sắm</b>.' },
      { sel: '[data-go="luong/create"]', title: 'Thêm mới', text: '<b>Bấm vào đây</b> để lập đề xuất mua sắm mới.', wait: route(/#\/luong\/create$/), do: () => go('#/luong/create') },
      { sel: '#lf-title', title: 'Thông tin chung', text: 'Nhập Tên đề xuất mua sắm. Các trường có dấu <b>*</b> là bắt buộc.' },
      { sel: '[data-vsel="lf-nv"]', title: 'Bước 1 — Đề tài / dự án', text: 'Chọn đề tài / dự án và văn bản căn cứ. Chọn xong, mỗi khối hiện nút <b>✦ Gợi ý từ AI</b> — AI chỉ chạy khi bấm. Bước 1 đến 5 làm trên cùng màn này.' },
      { sel: '#lf-draft', title: 'Lưu nháp', text: '<b>Bấm Lưu nháp</b>: hệ thống tạo luồng (mã ĐXMS tự sinh), hồ sơ Phê duyệt và giữ việc <b>Lập đề xuất mua sắm</b> để làm tiếp. Bấm <i>Làm hộ</i> để dùng hồ sơ mẫu.',
        wait: route(/#\/task\//), do: () => goTask(1) },
      { enter: () => { if (!tokOf(1)) goTask(1); }, sel: '[data-lf-ai-sec="boc"]', title: 'Bước 2, 6 — Gợi ý từ AI: Bóc tách và đối chiếu',
        text: 'Mỗi khối có nút <b>✦ Gợi ý từ AI</b> riêng. <b>Bấm vào đây</b>: popup hiện dữ liệu căn cứ AI đã lấy (bước 2) và bảng bóc tách, đối chiếu (bước 6). Chọn hạng mục, chỉnh SL rồi <b>Áp dụng vào màn</b>.',
        wait: () => !!find('[data-lf-boc] [data-lf-ai2]'), do: aiDo('boc') },
      { sel: '[data-lf-boc]', title: 'Bước 5 — Bóc tách và đối chiếu', text: 'Áp dụng xong, AI ghép hàng hoá vào khoản mục dự toán và điền <b>bảng Loại chi phí</b> ở trên; ở đây chỉ còn dòng tóm tắt. Muốn xem / sửa danh mục bóc tách (SL, bỏ hạng mục) thì bấm <b>✦ Gợi ý lại</b>.' },
      /* Review nhi 06/11 #1: bỏ khối Thông tin cơ bản — Nhóm mục đích, Nguồn vốn ở Thông tin chung. */
      { sel: '[data-lf-chung]', title: 'Bước 3, 4 — Thông tin chung', text: '<b>Nhóm mục đích mua sắm</b> và <b>Nguồn vốn</b> điền sẵn theo đề tài / dự án, sửa được; nút <b>✦ Gợi ý từ AI</b> của khối gợi ý cả Tên luồng, Giá trị dự kiến, Thời gian thực hiện. Nội dung các mục Tờ trình nhập ở bước lập dự thảo (tour 4).' },
      { sel: '#lf-save', title: 'Gửi', text: '<b>Bấm Gửi</b>: hoàn thành bước 1–5, hồ sơ chuyển <b>Chỉ huy ĐVĐX xác nhận khởi tạo</b>, rồi Phòng Quản lý tài sản rà soát tồn kho (tour 2).',
        wait: route(/#\/viec-cua-toi$/), do: click('#lf-save') }] },

    { n: 2, name: 'Thủ kho rà soát tồn kho', who: 'Phòng Quản lý tài sản / Thủ kho', steps: [
      { enter: () => { Flow.jumpToScene('1b', SET); const t = tokOf(7); if (t) go('#/task/' + t.id); }, sel: actPrimary, title: 'Việc Rà soát tồn kho',
        text: 'Vai <b>Hà Văn Tiến — Phòng Quản lý tài sản</b>. <b>Bấm Cập nhật kết quả rà soát</b> để mở màn nhập kết quả; danh mục là các hạng mục ĐVĐX đã bóc tách ở bước 5.', wait: () => !!find('[data-rsk-ed]'), do: click(actPrimary) },
      { sel: '[data-rsk-ed]', title: 'Kết quả rà soát', text: 'Nhập <b>một lần</b> theo biên bản rà soát: Mã hàng trong kho, SL tồn kho, SL xuất kho (không vượt tồn khả dụng), SL điều chuyển, hợp đồng đầu vào, vị trí; SL cần mua tự tính. Tải Tệp kết quả (bắt buộc, ở trên bảng) — tệp Excel theo mẫu thì hệ thống điền sẵn bảng; nút Toàn màn hình để xem đủ cột. Lưu xong hệ thống sinh Biên bản rà soát.' },
      { sel: '[data-rsk-save]', title: 'Gửi Chỉ huy Kho', text: 'Nhập xong bấm <b>Gửi Chỉ huy Kho</b>: hệ thống lưu kết quả, sinh biên bản và chuyển <b>Chỉ huy Kho duyệt</b>. Phần còn phải mua là đầu vào của yêu cầu báo giá.' },
      { enter: () => { closeModals(); goTask('7.1'); }, sel: act('Duyệt'), title: 'Chỉ huy Kho duyệt', text: 'Vai <b>Lưu Văn Thắng</b>. Xem kết quả rà soát và biên bản; <b>Duyệt</b> thì Thầu TTMS lấy báo giá, <b>Trả lại</b> (có lý do) thì Kho rà soát lại.' }] },

    { n: 3, name: 'Tổng hợp yêu cầu báo giá', who: 'Thầu Trung tâm Mua sắm', steps: [
      { enter: () => goTask(8), sel: actPrimary, title: 'Bước 8 — Khởi tạo YCBG', text: '<b>Bấm Hoàn thành</b> để mở phiếu yêu cầu báo giá.', wait: modalOpen, do: click(actPrimary) },
      { sel: '.vmodal.ef [data-ef-field="nccSel"]', title: 'Nhà cung cấp nhận YCBG', text: 'Danh sách lọc theo ngành hàng của hạng mục; nhà cung cấp bị cấm không hiện. Thêm được nhà cung cấp mới.' },
      { sel: '.vmodal.ef [data-ef-field="dkThanhToan"]', title: 'Điều khoản trên phiếu', text: 'Điều kiện thanh toán, Địa điểm giao hàng, Đầu mối tiếp nhận báo giá, Các yêu cầu khác — in trên phiếu và email gửi nhà cung cấp.' },
      /* Review nhi 06/11 #2, #3, #7: không so sánh báo giá trên hệ thống — Thầu tải tệp báo giá, nhập giá trị cuối cùng; Chỉ huy Thầu Đồng ý / Từ chối. */
      { enter: () => { closeModals(); goTask(10); }, sel: act('Báo giá đạt'), title: 'Bước 10 — Tổng hợp báo giá',
        text: 'Hệ thống đã gửi email (bước 9). Thầu so sánh, đánh giá báo giá ngoài hệ thống. <b>Báo giá đạt</b>: tải tệp báo giá của từng nhà cung cấp và nhập giá trị báo giá cuối cùng; <b>Không đạt — tạo YCBG mới</b> kèm lý do.' },
      { enter: () => { closeModals(); goTask('10.1'); }, sel: act('Đồng ý'), title: 'Chỉ huy Thầu TTMS phê duyệt', text: 'Vai <b>Phí Đức Long</b>. Xem tệp báo giá và giá trị cuối cùng; <b>Đồng ý</b> thì hệ thống rẽ theo tổng giá trị (dưới 160 tỷ sang bước 11, từ 160 tỷ sang bước 12), <b>Từ chối</b> kèm lý do thì về bước 10.' }] },

    { n: 4, name: 'Soạn thảo hồ sơ ĐXMS', who: 'Chuyên quản, Chỉ huy ĐVĐX', steps: [
      { enter: () => goTask(12), sel: act('Soạn thảo tờ trình ĐXMS'), title: 'Bước 12 — Soạn thảo tờ trình', text: 'Hoàn thiện tờ trình, phụ lục theo mẫu (điền sẵn từ các bước trước), tải tài liệu bắt buộc rồi <b>Gửi chỉ huy duyệt</b>.' },
      /* T34 v0.2 (D-92): lịch sử nằm ở tab Tiến trình, khối "Lịch sử xử lý". */
      { enter: () => { const tb = find('[data-ltab="tien-trinh"]'); if (tb) tb.click(); }, sel: ['.vcard', 'Lịch sử xử lý'], title: 'Lịch sử xử lý', text: 'Tab <b>Tiến trình</b>: các bước đã xử lý, ai xử lý, khi nào.' },
      { enter: () => goTask(13), sel: act('Phê duyệt'), title: 'Bước 13 — Chỉ huy ĐVĐX duyệt', text: 'Vai <b>Trần Đức Hải</b>. Duyệt từng phần: mọi phần Đạt thì Đồng ý; có phần Không đạt thì <b>Không đồng ý</b> kèm lý do, hồ sơ về bước 12.' },
      { enter: () => goTask(16), sel: actPrimary, title: 'Bước 16 — Phiếu yêu cầu thẩm định', text: 'Chọn cơ quan chuyên môn thẩm định, hạn góp ý, đầu mối tiếp nhận; bấm <b>Lập phiếu yêu cầu thẩm định</b>, điền nội dung BM-03 (xem trước được) rồi trình Chỉ huy ĐVĐX phê duyệt trước khi chuyển TTMS (tour 5).' },
      { enter: () => goTask('16.1'), sel: act('Phê duyệt phiếu yêu cầu thẩm định'), title: 'Chỉ huy ĐVĐX phê duyệt phiếu', text: 'Vai <b>Trần Đức Hải</b>. Phê duyệt phiếu yêu cầu thẩm định và các bên thẩm định; Trả lại thì về bước 16.' }] },

    { n: 5, name: 'TTMS rà soát', who: 'Chuyên viên TTMS', steps: [
      { enter: () => goTask(17), sel: act('Xác nhận danh sách CQCM'), title: 'Bước 17 — Xác nhận danh sách CQCM', text: 'Vai <b>Phạm Thị Lan</b>. Kiểm danh sách rồi nhập nhận xét: <b>Đồng ý</b> thì hệ thống tự gửi yêu cầu thẩm định và trình ký BM-03; <b>Từ chối</b> thì về bước 16.' },
      { enter: () => goTask(42), sel: act('Hoàn tất rà soát BM-05'), title: 'Bước 42 — Rà soát BM-05', text: 'Sau thẩm định: rà soát Báo cáo kết quả thẩm định (BM-05) do AI soạn từ ý kiến các CQCM.' },
      { enter: () => goTask(43), sel: actPrimary, title: 'Bước 43 — Đủ điều kiện', text: 'Xác nhận hồ sơ đủ điều kiện và ký BM-05 — sang trình ký (tour 7).' }] },

    { n: 6, name: 'Thẩm định và giải trình', who: 'CQCM, Chuyên quản ĐVĐX', steps: [
      { enter: () => goTask(19, 'PC'), sel: ['.vcard', 'Thẩm định của cơ quan chuyên môn'], title: 'Bước 19 — CQCM thẩm định',
        text: 'Vai <b>Lê Thanh Hòa — Ban Pháp chế</b> (mỗi CQCM một việc). Xem hồ sơ thẩm định theo tab, ghi ý kiến theo từng mục, xem lịch sử ý kiến các lần.' },
      { sel: act('Hoàn thành phiếu'), title: 'Hoàn thành phiếu', text: '<b>Ghi lại</b> để lưu dở; <b>Hoàn thành phiếu, trình chỉ huy</b> khi xong. Trưởng ban CQCM đồng ý và trình ký BM-04 ở bước 20.' },
      { enter: () => goTask(28), sel: act('Gửi giải trình'), title: 'Bước 28 — ĐVĐX giải trình', text: 'ĐVĐX tiếp thu hoặc giải trình từng ý kiến, hoàn chỉnh hồ sơ. Quá số vòng cho phép thì hệ thống cảnh báo, yêu cầu họp.' },
      { enter: () => goTask(35, 'PC'), sel: act('Đạt'), title: 'Bước 35 — Kiểm tra lại', text: 'CQCM kiểm tra hồ sơ đã hoàn chỉnh: Đạt thì xác nhận ký BM-04 và Checklist.' }] },

    { n: 7, name: 'Trình ký và phê duyệt', who: 'TTMS, Tổng Giám đốc VHT', steps: [
      { enter: () => goTask(48), sel: act('Có báo cáo TGĐ Tập đoàn'), title: 'Bước 48 — Báo cáo Tập đoàn?', text: 'Sau khi BM-05 được ký (bước 43–47), TTMS chọn có báo cáo TGĐ Tập đoàn hay không. Chọn sẵn theo "Căn cứ đã được phê duyệt" của luồng.' },
      { enter: () => goTask(59), sel: act('Trình phê duyệt'), title: 'Bước 59 — Trình phê duyệt', text: 'Hệ thống sinh dự thảo Quyết định phê duyệt; TTMS rà soát và <b>Trình phê duyệt</b>.' },
      { enter: () => goTask(60), sel: act('Phê duyệt'), title: 'Bước 60 — Tổng Giám đốc', text: 'Vai <b>Ngô Đình Khôi</b>. <b>Phê duyệt</b>, hoặc Yêu cầu hoàn chỉnh. Bước 61 hệ thống gửi ký duyệt trên VOffice; hồ sơ Hoàn thành.' }] },
  ];

  /* ---------- Chạy tour ---------- */
  let cur = null; /* { t: tour, i: chỉ số bước, scrolled } */
  let timer = null;
  let layer = null;

  function ensureLayer() {
    if (layer && document.body.contains(layer)) return layer;
    layer = document.createElement('div');
    layer.className = 'tour-layer';
    layer.innerHTML = '<div class="tour-ring"></div><div class="tour-pop" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(layer);
    layer.addEventListener('click', onClick);
    return layer;
  }
  const running = () => !!cur;
  const busy = () => (Flow.state.history || []).some((h) => h.who) && !cur;

  function start(n, opts) {
    const t = TOURS.find((x) => x.n === Number(n));
    if (!t) return false;
    const go0 = () => { stop(); cur = { t, i: -1 }; ensureLayer(); next(); timer = setInterval(tick, 250); };
    if (opts && opts.force) { go0(); return true; }
    if (busy()) {
      const m = window.UI.modal(`<div class="modal-h"><h3>Bắt đầu tour "${esc(t.name)}"?</h3></div>
        <div class="modal-b">Tour đưa hồ sơ demo ĐXMS-2026-0117 tới bước cần xem. Hồ sơ đang chạy dở trên máy này sẽ được thay bằng trạng thái của tour.</div>
        <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="tour-go">Bắt đầu</button></div>`);
      m.el.classList.add('tour-confirm');
      m.el.querySelector('#tour-go').onclick = () => { m.close(); go0(); };
      return true;
    }
    go0();
    return true;
  }
  function stop() {
    cur = null;
    if (timer) clearInterval(timer);
    timer = null;
    if (layer) layer.remove();
    layer = null;
  }
  function next() {
    if (!cur) return;
    cur.i += 1;
    if (cur.i >= cur.t.steps.length) { finish(); return; }
    const s = cur.t.steps[cur.i];
    cur.scrolled = false;
    if (s.enter) { try { s.enter(); } catch (e) { /* bước vẫn hiện, popover báo không thấy phần tử */ } }
    tick();
  }
  function prev() {
    if (!cur || cur.i <= 0) return;
    /* Lùi về bước gần nhất có enter (dựng lại màn), rồi tiến tới bước trước bước hiện tại. */
    const target = cur.i - 1;
    let k = target;
    while (k > 0 && !cur.t.steps[k].enter) k -= 1;
    cur.i = k - 1;
    next();
    while (cur && cur.i < target) { const s = cur.t.steps[cur.i]; if (s.do) s.do(); cur.i += 1; cur.scrolled = false; }
    tick();
  }
  function finish() {
    const t = cur.t;
    stop();
    const m = window.UI.modal(`<div class="modal-h"><h3>Xong tour ${t.n}: ${esc(t.name)}</h3></div>
      <div class="modal-b">${t.n < TOURS.length ? `Tour tiếp theo: <b>${TOURS[t.n].n}. ${esc(TOURS[t.n].name)}</b>.` : 'Đã xem hết 7 tác vụ.'} Mở lại danh sách tour bằng nút <b>Hướng dẫn</b> trên thanh trên cùng.</div>
      <div class="modal-f"><button class="btn secondary" data-close>Đóng</button>${t.n < TOURS.length ? `<button class="btn primary" id="tour-next">Tour tiếp theo</button>` : ''}</div>`);
    m.el.classList.add('tour-done');
    const b = m.el.querySelector('#tour-next');
    if (b) b.onclick = () => { m.close(); start(t.n + 1, { force: true }); };
  }

  function tick() {
    if (!cur) return;
    ensureLayer();
    layer.classList.toggle('off', hidden());
    const s = cur.t.steps[cur.i];
    if (s.wait && s.wait()) { next(); return; }
    const el = find(s.sel);
    if (el && !cur.scrolled) { el.scrollIntoView({ block: 'center', inline: 'nearest' }); cur.scrolled = true; }
    place(s, el);
  }

  function place(s, el) {
    const ring = layer.querySelector('.tour-ring'), pop = layer.querySelector('.tour-pop');
    const last = cur.i === cur.t.steps.length - 1;
    const html = `<div class="tp-h"><span class="tp-n">${cur.t.n}</span><b>${esc(cur.t.name)}</b><span class="tp-c">${cur.i + 1} / ${cur.t.steps.length}</span></div>
      <div class="tp-t">${esc(s.title)}</div><div class="tp-b">${s.text}${el ? '' : '<div class="tp-miss">Không thấy phần tử cần chỉ — màn này có thể đã thay đổi. Bấm Tiếp để đi tiếp.</div>'}</div>
      <div class="tp-f"><button type="button" class="tp-x" data-tour="stop">Thoát</button><span class="sp"></span>
        ${cur.i > 0 ? '<button type="button" class="btn sm secondary" data-tour="prev">Quay lại</button>' : ''}
        ${s.wait && s.do ? '<button type="button" class="btn sm secondary" data-tour="do">Làm hộ</button>' : ''}
        <button type="button" class="btn sm primary" data-tour="next">${last ? 'Kết thúc' : 'Tiếp'}</button></div>`;
    const sig = `${cur.t.n}:${cur.i}:${!!el}`;
    if (pop.dataset.sig !== sig) { pop.innerHTML = html; pop.dataset.sig = sig; }
    pop.dataset.step = String(cur.i + 1);
    layer.dataset.tour = String(cur.t.n);
    const W = innerWidth, H = innerHeight, pw = Math.min(360, W - 32);
    pop.style.width = pw + 'px';
    if (!el) { ring.style.display = 'none'; pop.style.left = Math.round((W - pw) / 2) + 'px'; pop.style.top = Math.round(H / 2 - pop.offsetHeight / 2) + 'px'; pop.classList.add('center'); return; }
    pop.classList.remove('center');
    const r = el.getBoundingClientRect(), pad = 6;
    Object.assign(ring.style, { display: 'block', left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    const ph = pop.offsetHeight;
    let top = r.bottom + 14;
    if (top + ph > H - 8) top = r.top - ph - 14;
    if (top < 8) top = Math.min(H - ph - 8, Math.max(8, r.top + 8));
    const left = Math.max(16, Math.min(W - pw - 16, r.left + r.width / 2 - pw / 2));
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
  }

  function onClick(e) {
    const b = e.target.closest('[data-tour]');
    if (!b || !cur) return;
    const k = b.dataset.tour, s = cur.t.steps[cur.i];
    if (k === 'stop') stop();
    else if (k === 'next') { if (s.wait && s.do && !s.wait()) s.do(); next(); }
    else if (k === 'prev') prev();
    else if (k === 'do' && s.do) { s.do(); setTimeout(tick, 50); }
  }

  /* ---------- Danh sách tour, hộp chào, bật / tắt ---------- */
  function listHtml() {
    return `<ol class="tour-list">${TOURS.map((t) => `<li><button type="button" data-tour-start="${t.n}"><span class="n">${t.n}</span><span class="l"><b>${esc(t.name)}</b><span>${esc(t.who)} · ${t.steps.length} bước</span></span></button></li>`).join('')}</ol>`;
  }
  function menu() {
    /* Không mở chồng: đang có danh sách tour thì giữ cái đó. */
    const open0 = document.querySelector('.overlay.tour-menu');
    if (open0) return { el: open0, close: () => open0.remove() };
    const m = window.UI.modal(`<div class="modal-h"><h3>Hướng dẫn theo tác vụ</h3></div>
      <div class="modal-b"><p class="tour-note">Chọn tác vụ muốn xem. Tour đưa hồ sơ demo tới đúng bước và chỉ từng chỗ cần bấm. Đây là công cụ của prototype, không có trong hệ thống thật.</p>${listHtml()}</div>
      <div class="modal-f"><label class="check tour-auto"><input type="checkbox" data-tour-auto ${enabled() ? 'checked' : ''}> Tự hiện danh sách tour mỗi lần mở prototype</label><button class="btn secondary" data-close>Đóng</button></div>`);
    m.el.classList.add('tour-menu');
    m.el.addEventListener('click', (e) => {
      const s = e.target.closest('[data-tour-start]');
      if (s) { m.close(); start(s.dataset.tourStart); return; }
    });
    m.el.addEventListener('change', (e) => { const c = e.target.closest('[data-tour-auto]'); if (c) setOn(c.checked); });
    return m;
  }
  /* on = tự hiện danh sách tour mỗi lần mở prototype (bản gửi khách). Nút Hướng dẫn luôn hiện — người dùng góp ý 05/11: tắt mà mất hẳn nút là khó hiểu. */
  function setOn(on) { const p = Object.assign({}, pref() || MEM || {}, { on, seen: true }); setPref(p); window.App.render(); }
  const topBtn = () => '<button class="tour-btn" id="tour-btn" title="Hướng dẫn theo tác vụ (công cụ của prototype)">Hướng dẫn</button>';
  const demoRow = () => `<h4>Hướng dẫn (tour)</h4><div class="row"><button class="btn sm secondary" data-tour-menu>Danh sách tour</button><label class="check sm"><input type="checkbox" data-tour-auto ${enabled() ? 'checked' : ''}> Tự hiện khi mở</label></div>`;

  document.addEventListener('click', (e) => {
    if (e.target.closest('#tour-btn')) { menu(); return; }
    if (e.target.closest('[data-tour-menu]')) menu();
  });
  document.addEventListener('change', (e) => { const c = e.target.closest('.demo-panel [data-tour-auto]'); if (c) setOn(c.checked); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cur && !document.querySelector('.overlay')) stop(); });
  addEventListener('resize', () => tick());
  addEventListener('hashchange', () => setTimeout(tick, 0));

  /* Khởi động: ?tour=n mở thẳng; bản gửi khách hiện danh sách tour mỗi lần mở, trừ khi người xem bỏ chọn "Tự hiện". */
  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    const m = /[?&]tour=(\d+)/.exec(location.search);
    if (m && !document.body.classList.contains('cap')) { setTimeout(() => start(m[1]), 0); return; }
    const p = pref();
    if (release() && (!p || p.on !== false) && !document.body.classList.contains('cap')) setTimeout(menu, 300);
  }

  window.Tour = { TOURS, start, stop, running, menu, topBtn, demoRow, enabled, setOn, boot, _reboot: () => { booted = false; boot(); }, state: () => (cur ? { tour: cur.t.n, step: cur.i + 1, total: cur.t.steps.length } : null) };
})();
