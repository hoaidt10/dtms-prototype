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
    /* T29 S9: Ghi lại (bước 19) — cùng eForm, chỉ Hủy / Ghi lại (performAction SAVE_DRAFT). */
    const r = await window.EFormRun.open({ title: opt && opt.draftOnly ? e.draftLabel || 'Lưu nháp' : choice ? choice.label : f.actionLabel || 'Hoàn thành', schema: schemaOf(tok, e), vars: window.EVars.of(tok),
      values: drafts[tok.id], check: (vals) => window.EVars.check(tok, choice, vals), draftOnly: !!(opt && opt.draftOnly), draftLabel: e.draftLabel });
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
    return { reason: e.reasonOf ? e.reasonOf(r.values) || null : e.reasonField ? r.values[e.reasonField] : null, note: fail ? fail.toast : null };
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

  window.TaskForms = { info, outputs, run, beforeComplete, version, draftState, has: (tok) => !!raw(tok) };
})();
