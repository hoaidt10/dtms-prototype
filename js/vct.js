/* T39 B1 (D-99) — Hành động chung của màn xử lý việc (my-task-detail, Thao tác khác), theo code KHCN be/workflow:
   - Yêu cầu thay người xử lý = TaskActionEnum.REQUEST_REPLACE_APPROVER: bắt buộc lý do, biến bắt buộc `assignee`, đóng việc hiện tại,
     outcome Yeu_cau_thay_nguoi_xu_ly_phe_duyet → BPMN tạo lại việc cho người mới. Theo: my-task-detail/my-task-transfer-dialog.
   - Bổ sung ý kiến = ADD_COMMENT: không đóng việc, ý kiến hiện ở Lịch sử xử lý.
   Hai nút này đến từ luật hiển thị như mọi nút (mã hành động, bộ xử lý thuộc SRS Luật hiển thị nút — D-98). GIẢ LẬP: prototype coi đây là luật
   chung cho mọi bước (màn TASK, không gắn bước) và giao lại chính việc đang mở cho người mới thay cho việc BPMN tạo việc mới.
   Ghi sự kiện vào Flow ui `vctEvents` (lưu localStorage cùng trạng thái luồng). */
(function () {
  const { esc, persona, vModal, vSelect, toast } = window.UI;
  const D = window.D;

  const events = () => ((window.Flow.state.ui || {}).vctEvents || []);
  const push = (ev) => window.Flow.setUi('vctEvents', events().concat([ev]));

  function actions(tok) {
    return [
      `<button type="button" class="vbtn ghost" data-vct="replace" data-vct-tok="${esc(tok.id)}">Yêu cầu thay người xử lý</button>`,
      `<button type="button" class="vbtn ghost" data-vct="comment" data-vct-tok="${esc(tok.id)}">Bổ sung ý kiến</button>`,
    ];
  }

  const req = (id, label, ctl, msg) => `<div class="vfield" id="${id}"><div class="lr"><label>${label}</label><span class="req">*</span></div>${ctl}<p class="msg" hidden>${msg}</p></div>`;
  const bad = (m, id, on) => { const f = m.el.querySelector('#' + id); f.classList.toggle('invalid', on); f.querySelector('.msg').hidden = !on; return on; };

  /* Bổ sung ý kiến: không đóng việc. */
  function comment(tok) {
    const m = vModal({ title: 'Bổ sung ý kiến',
      body: req('vc-f', 'Nội dung ý kiến', '<textarea class="vctl ta" id="vc-t" rows="4" maxlength="1000" placeholder="Nội dung"></textarea>', 'Bạn cần nhập Nội dung ý kiến.'),
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="vc-ok">Xác nhận</button>' });
    m.el.querySelector('#vc-t').focus();
    m.el.querySelector('#vc-ok').onclick = () => {
      const v = m.el.querySelector('#vc-t').value.trim();
      if (bad(m, 'vc-f', !v)) return;
      if (!window.Flow.token(tok.id)) { m.close(); stale(); return; }
      m.close();
      push({ kind: 'comment', task: tok.task, who: window.Flow.state.persona, at: window.Flow.state.clock, text: v });
      toast('<b>Thành công</b><br>Bổ sung ý kiến thành công.');
    };
  }

  /* Yêu cầu thay người xử lý: chọn người mới (biến assignee) + lý do bắt buộc; việc chuyển cho người mới, người cũ không còn thấy. */
  function replace(tok) {
    const cur = tok.who;
    const opts = D.personas.filter((p) => p.id !== cur && !p.all && !p.simulated).map((p) => ({ value: p.id, label: `${p.name} — ${p.role}` }));
    let to = null;
    const m = vModal({ title: 'Yêu cầu thay người xử lý',
      body: `<div class="vfield"><div class="lr"><label>Người đang xử lý</label></div><input class="vctl" disabled value="${esc(persona(cur).name)}"></div>
        ${req('vr-p', 'Người xử lý mới', vSelect({ id: 'vr-who', value: null, searchable: true, placeholder: 'Chọn người xử lý', options: opts, onChange: (v) => { to = v; } }), 'Bạn cần chọn Người xử lý mới.')}
        ${req('vr-f', 'Lý do', '<textarea class="vctl ta" id="vr-t" rows="3" maxlength="1000" placeholder="Nội dung"></textarea>', 'Bạn cần nhập Lý do.')}`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="vr-ok">Xác nhận</button>' });
    m.el.querySelector('#vr-ok').onclick = () => {
      const why = m.el.querySelector('#vr-t').value.trim();
      const e1 = bad(m, 'vr-p', !to), e2 = bad(m, 'vr-f', !why);
      if (e1 || e2) return;
      const live = window.Flow.token(tok.id);
      if (!live) { m.close(); stale(); return; }
      m.close();
      live.who = to; delete live.cands;
      push({ kind: 'replace', task: tok.task, who: window.Flow.state.persona, at: window.Flow.state.clock, from: cur, to, text: why });
      toast(`<b>Thành công</b><br>Đã chuyển công việc cho ${esc(persona(to).name)}.`);
      location.hash = '#/viec-cua-toi';
    };
  }

  /* Việc đã được người khác xử lý / chuyển bước (BE trả 409) — câu chữ theo MyTaskService. */
  const STALE = 'Công việc này đã được hoàn thành hoặc chuyển bước. Vui lòng tải lại trang.';
  function stale() { toast(STALE, 'warn'); }

  /* Dòng Lịch sử xử lý cho các sự kiện trên (caseHistory của screens.js). */
  function historyItems(taskName) {
    return events().map((ev) => ({
      title: ev.kind === 'comment' ? `Bổ sung ý kiến — ${taskName(ev.task)}` : `Yêu cầu thay người xử lý — ${taskName(ev.task)} (${persona(ev.from).name} → ${persona(ev.to).name})`,
      st: 'COMPLETED', who: ev.who, at: ev.at, note: ev.text,
    }));
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-vct]');
    if (!b) return;
    const tok = window.Flow.token(b.dataset.vctTok);
    if (!tok) { stale(); return; }
    if (b.dataset.vct === 'comment') comment(tok); else replace(tok);
  });

  window.Vct = { actions, historyItems, events, STALE, stale };
})();
