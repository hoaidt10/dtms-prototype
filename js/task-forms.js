/*
 * Nối màn xử lý task (khung chung my-task-detail, screens.js) với eForm của từng user task (B0.4 (2), D-24, rule prototype-solution S2/S3).
 * Thay cho bodies.js: bước không còn nội dung riêng trên trang — bấm nút hành động → loadEform → dialog eForm (eform-run.js),
 * như handleActionButton → facade.loadEform → openEformDialog → submitEform của KHCN.
 * - Nút có `reason` (từ chối / không đồng ý / không OK) không mở form: dialog nhận xét có sẵn (G6), trừ khi lý do là trường của form (reasonField).
 * - Lưu nháp: giữ giá trị form theo token (performAction SAVE_DRAFT). Xác nhận: validate của form → kiểm tra phía BE (EVars.check) →
 *   ghi biến (output mapping `write`) → DX-01 (`gate`: service task AI kiểm tra trước khi gửi, Không đạt → ở lại bước;
 *   `pass` = BPMN đã vẽ nhánh Không đạt (MS13 bước 44 → cổng "AI kiểm tra đạt?"): vẫn gửi, cờ ui.ai44Fail cho cổng đọc).
 */
(function () {
  const Flow = window.Flow;
  const { esc, toast, vModal } = window.UI;
  const H = () => window.EVars.h;

  function raw(tok) {
    const pick = Flow.state.parent ? window.EForms[Flow.state.vars.process] : Flow.state.kdt ? window.EForms.MS13 : Flow.state.vars.adj ? window.EForms.MS02 : window.EForms.MS01;
    return pick ? pick(tok, H()) : null;
  }
  /* Schema đầy đủ như Camunda Web Modeler xuất (để chép sang Modeler được). */
  function schemaOf(tok, e) {
    const s = typeof e.schema === 'function' ? e.schema(H(), tok) : e.schema;
    return { id: e.id, type: 'default', executionPlatform: 'Camunda Cloud', executionPlatformVersion: '8.10.0',
      exporter: { name: 'Camunda Web Modeler', version: 'prototype' }, schemaVersion: 18, components: s.components };
  }
  const outputsOf = (tok, e) => (e && e.outputs ? e.outputs(H(), tok) : []);

  function info(tok) {
    const e = raw(tok);
    if (!e) return { notes: ['Nội dung chi tiết của task này chưa dựng (ngoài kịch bản demo).'], q: [] };
    const f = Flow.def()[tok.task] || {};
    const viaComment = (f.choices || []).filter((c) => c.reason && !e.reasonField && !e.reasonOf).map((c) => `"${esc(c.label)}"`);
    return {
      notes: [`eForm <code>${esc(e.id)}</code> — linked form của user task (một form cho mọi nút của task), mở bằng dialog khi bấm nút hành động.${viaComment.length ? ` Nút ${viaComment.join(', ')} mở dialog nhận xét (G6).` : ''} <button type="button" class="vbtn sm red" data-ef-schema="${esc(tok.id)}">Xem schema</button>`]
        .concat(e.notes ? e.notes(H(), tok) : []),
      q: e.q || [],
    };
  }

  /* Văn bản đầu ra (dự thảo) của bước: mẫu Word + dữ liệu eForm. */
  const outputs = (tok) => outputsOf(tok, raw(tok)).map((code) => { const d = window.EVars.doc(code); return d ? { code, name: `${code} ${d.name} (dự thảo v${version()})` } : null; }).filter(Boolean);
  const version = () => (Flow.state.parent ? window.EForms.hd.version() : Flow.state.kdt ? H().kdtVer() : H().version());

  /* Review nhi 06/11 #6, #12, #16: nút Xem trước <mã văn bản> trong popup — văn bản theo mẫu với giá trị form đang nhập (EVars.docLive). */
  const previewsOf = (tok, e) => (e.preview ? e.preview(H(), tok) : []).map((code) => ({ code, label: `Xem trước ${code}`,
    open: (vals) => { const d = window.EVars.docLive(code, tok, vals); window.Screens.docPreview({ title: d ? `${code} ${d.name} (dự thảo)` : code, code: Flow.ci().code,
      at: Flow.dateOf(Flow.state.clock), caseTitle: Flow.ci().name, doc: d, docCode: code, dl: d ? d.name : code }); } }));

  /* Review nhi 06/11 #38: task có e.decide và đúng hai nhánh (chính + có lý do) → một nút btn; null khi không áp dụng. */
  function decideOf(tok, e0) {
    const e = e0 || raw(tok);
    if (!e || !e.decide) return null;
    const cs = Flow.choices(tok.task) || [], yes = Flow.mainChoice(tok.task), noChoice = cs.find((c) => c.reason);
    return yes && noChoice ? { btn: e.decide.btn, yes, noChoice } : null;
  }
  /* Review nhi 06/11 #34: AI xong khi form đã đóng → điền ô trống vào bản nháp của bước; mở lại form thấy ngay. */
  function aiDoneClosed(tok, src) {
    if (!Flow.token(tok.id)) return;
    const drafts = Flow.ui.efDraft || {}, cur = Object.assign({}, drafts[tok.id] || {}), nguon = Object.assign({}, cur.aiNguon || {});
    Object.entries(src).forEach(([k, x]) => { if (!cur[k] && Flow.ui[k === 'suCanThiet' ? 'necessity' : k] == null && x.value) { cur[k] = x.value; nguon[k] = x.nguon || ''; } });
    cur.aiNguon = nguon;
    Flow.setUiMany({ efDraft: Object.assign({}, drafts, { [tok.id]: cur }) });
    toast('<b>✦ AI đã gợi ý xong Tờ trình</b><br>Mở lại Soạn thảo tờ trình ĐXMS để xem nội dung đã điền.');
  }

  /* Bấm nút hành động. Trả { reason } để chạy tiếp (lý do lấy từ form nếu có), null nếu huỷ / lưu nháp / bị trả lại. */
  async function run(tok, choice, opt) {
    const e = raw(tok);
    if (!e) return {};
    if (choice && choice.reason && !e.reasonField && !e.reasonOf) {
      const err = window.EVars.check(tok, choice, null);
      if (err) { toast(esc(err), 'warn'); return null; }
      return {};
    }
    const f = Flow.def()[tok.task] || {};
    const drafts = Flow.ui.efDraft || {};
    /* Review nhi 06/11 #38: màn phê duyệt — một nút mở form, Đồng ý / Từ chối trong form (e.decide); hai nhánh BPMN giữ nguyên (nhánh chính / nhánh có lý do). */
    const dec = decideOf(tok, e), noChoice = dec ? dec.noChoice : null;
    /* Review nhi 06/11 #34: ô AI soạn để trống tới khi bấm ✦ Gợi ý từ AI hoặc tự nhập. */
    const vars = window.EVars.of(tok);
    if (e.aiFill && !(Flow.state.vars || {}).adj) e.aiFill.keys.forEach((k) => { if (Flow.ui[k === 'suCanThiet' ? 'necessity' : k] == null) vars[k] = ''; });
    /* T29 S9: Ghi lại (bước 19) — cùng eForm, chỉ Hủy / Ghi lại (performAction SAVE_DRAFT). */
    /* T29 B18: e.title = tiêu đề riêng của hộp thoại eForm (vd bước 8 "Yêu cầu báo giá"), nút hành động vẫn theo actionLabel. */
    const r = await window.EFormRun.open({ title: opt && opt.draftOnly ? e.draftLabel || 'Lưu nháp' : e.title || (choice ? choice.label : f.actionLabel || 'Hoàn thành'), schema: schemaOf(tok, e), vars,
      values: drafts[tok.id], check: (vals, d) => {
        if (d === 'no' && e.decide.reasonKey && !String(vals[e.decide.reasonKey] || '').trim()) return 'Bạn cần nhập ý kiến khi từ chối.';
        return window.EVars.check(tok, d === 'no' ? noChoice : choice, vals);
      },
      decide: dec ? { yes: e.decide.yes, no: e.decide.no } : null, aiKey: `${Flow.state.code}:${tok.id}`, onAiDone: (src) => aiDoneClosed(tok, src),
      docs: (vals) => window.EVars.reqDocs(tok, vals).filter((x) => !x.inForm && (!x.only || x.only.test(choice ? choice.label : ''))), draftOnly: !!(opt && opt.draftOnly), draftLabel: e.draftLabel,
      preview: previewsOf(tok, e) });
    if (!r) return null;
    if (r.draft) {
      Flow.setUiMany({ efDraft: Object.assign({}, drafts, { [tok.id]: r.values }) });
      toast(e.draftToast || '<b>Thành công</b><br>Đã lưu nháp biểu mẫu.');
      return null;
    }
    const out = e.write ? e.write(r.values, tok, H()) : {};
    const rest = Object.assign({}, drafts); delete rest[tok.id];
    const fail = e.gate ? e.gate(out, H()) : null;
    const patch = Object.assign({}, out, { efDraft: rest });
    if (e.gate) patch[fail ? fail.key : (Flow.state.kdt ? 'aiCheckK' : 'aiCheck')] = fail ? { ketQua: 'Không đạt', lyDo: fail.lyDo } : null;
    if (fail && !Flow.state.kdt) patch.aiFail = true;
    if (fail && fail.pass) patch.ai44Fail = true;
    Flow.setUiMany(patch);
    if (fail && !fail.pass) { toast(esc(fail.toast), 'warn'); return null; }
    const moved = e.after ? e.after(out, tok, H()) : null;
    if (moved) { toast(esc(moved.toast), 'warn'); return null; }
    const no = r.decide === 'no';
    return { reason: e.reasonOf ? e.reasonOf(r.values) || null : no && e.decide.reasonKey ? r.values[e.decide.reasonKey] : e.reasonField ? r.values[e.reasonField] : null,
      note: fail ? fail.toast : null, choice: no ? noChoice : null };
  }

  /* Biến của service task chạy ngay sau task (prototype ghi trước khi hoàn thành token để gateway đọc được).
     DX-03: kết quả AI kiểm tra báo giá ở task 10 → cổng "Báo giá đạt?" (MS01) / "Báo giá đạt yêu cầu?" (MS13). */
  function beforeComplete(tok, choice) {
    if (String(tok.task) !== '10' || Flow.state.parent) return null;
    /* D-77: ĐVĐX sửa "Căn cứ đã được phê duyệt" ở task 10 → biến basisTD (cổng sau task 10, mặc định task 48). */
    /* T29 B3b (BR-DXMS-04-10): Tổng giá trị theo cơ sở giá là giá trị của hồ sơ — cổng sau task 10 đọc vars.totalQ. */
    if (choice && /^Báo giá đạt/.test(choice.label) && window.BaoGia && window.BaoGia.applies(tok)) Flow.state.vars.totalQ = window.BaoGia.total();
    const cd = (Flow.ui || {}).canCuDuyet;
    if (cd && !Flow.state.kdt) Flow.state.vars.basisTD = cd === 'Đã phê duyệt';
    /* Review nhi 06/11 #3 (D.quoteManual): giá trị báo giá cuối cùng Thầu nhập = giá trị của hồ sơ cho cổng Giá trị; không chạy AI kiểm tra báo giá (P-219). */
    if (window.D.quoteManual && !Flow.state.kdt && !Flow.state.vars.adj) {
      const g = Number((Flow.ui || {}).giaTriBaoGia);
      if (choice && /^Báo giá đạt/.test(choice.label) && g > 0) Flow.state.vars.totalQ = Math.round((g / 1e9) * 100) / 100;
      Flow.state.vars.quoteAi = true;
      return null;
    }
    const ok = !H().quoteFail();
    Flow.state.vars.quoteAi = ok;
    if (ok || !choice || !choice.main) return null;
    return Flow.state.kdt ? 'Kết quả AI kiểm tra báo giá: Không đạt — sau hai xác nhận, hồ sơ quay lại bước lập yêu cầu báo giá (DX-03).'
      : 'Kết quả AI kiểm tra báo giá: Không đạt — hồ sơ quay lại bước gửi lại YCBG (DX-03).';
  }

  function showSchema(tokId) {
    const tok = Flow.token(tokId), e = tok && raw(tok);
    if (!e) return;
    vModal({ title: `Schema eForm — ${e.id}`, size: 'lg', body: `<pre class="json">${esc(JSON.stringify(schemaOf(tok, e), null, 2))}</pre>`,
      actions: '<button class="vbtn secondary" data-close>Đóng</button>' });
  }
  document.addEventListener('click', (ev) => { const b = ev.target.closest('[data-ef-schema]'); if (b) { ev.preventDefault(); document.querySelectorAll('.info-pop').forEach((x) => x.remove()); showSchema(b.dataset.efSchema); } });

  /* Comment #24: trạng thái văn bản đầu ra đang soạn ở bước này — Lưu nháp → Đang làm; form có nội dung AI soạn chưa được xác nhận → AI đã gợi ý. */
  const draftState = (tok) => ((Flow.ui.efDraft || {})[tok.id] ? 'Đang làm' : (raw(tok) || {}).ai ? 'AI đã gợi ý' : 'Đang làm');

  window.TaskForms = { info, outputs, run, beforeComplete, version, draftState, decideOf, has: (tok) => !!raw(tok) };
})();
