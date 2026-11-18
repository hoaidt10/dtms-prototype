/*
 * Bộ chạy eForm của màn xử lý task (B0.4 (2), D-24) — bản rút gọn của `vht-e-form` (@khcn-core/ui) để prototype đọc đúng
 * schema Camunda Form: components[] với type, key, label, validate, conditional.hide, expression, dataSource, columns, path…
 * Theo: fe/repo-khcn-core-fe/projects/ui/src/custom/vht-e-form (mapComponent, table-block, text-block, dynamic-list)
 *       fe/repo-khcn-bpmn-fe/.../my-task-detail/my-task-eform-dialog (dialog 85vw, Hủy / Lưu nháp / Xác nhận).
 * Loại hỗ trợ: textfield, textarea, number, datetime, select, radio, checkbox, checklist, taglist, expression (ẩn, tính lại),
 * dynamiclist (mỗi dòng một khung, `this.` = dòng), group; khối tĩnh text (markdown + {{FEEL}}), html, table, separator, spacer.
 * Mở rộng chung chưa có ở vht-e-form (E1): `valuesKey` (options đọc từ biến) và `valuesExpression` (options = FEEL, lọc theo trường khác) —
 * cả hai là thuộc tính chuẩn của Camunda form-js cho select / radio / checklist / taglist.
 * FEEL rút gọn: đường dẫn a.b, this.x, item.x, so sánh (= != < > <= >=), and / or / not(), if … then … else …, + - * /,
 * count(), sum(), string(), list contains(), lọc danh sách xs[điều kiện theo item], chỉ số xs[1] (đếm từ 1).
 */
(function () {
  const { esc, icon, vRadio, vSelect, vModal, toast, badge } = window.UI;

  /* ---------- FEEL rút gọn ---------- */
  const FN = {
    count: (l) => (Array.isArray(l) ? l.length : 0),
    sum: (l) => (Array.isArray(l) ? l.reduce((a, b) => a + (Number(b) || 0), 0) : 0),
    string: (x) => (x == null ? '' : String(x)),
    contains: (l, x) => (Array.isArray(l) ? l.includes(x) : typeof l === 'string' && typeof x === 'string' && l.includes(x)),
    /* Review nhi 06/11 #36: tổng tiền tính lại ngay trên form. abs, decimal là hàm chuẩn của FEEL; tienVnd, bangChu là hàm mở rộng của vht-e-form (cần dev). */
    abs: (x) => Math.abs(Number(x) || 0),
    decimal: (x, n) => { const k = 10 ** (n || 0); return Math.round((Number(x) || 0) * k) / k; },
    tienVnd: (ty) => Math.round((Number(ty) || 0) * 1e9).toLocaleString('vi-VN'),
    bangChu: (ty) => window.UI.inWords(Number(ty) || 0),
  };
  const get = (o, path) => {
    /* Đường dẫn trên danh sách lấy giá trị của từng phần tử (FEEL: list.key), vd sum(phuLucEd.thanhTien). */
    const v = String(path).split('.').reduce((a, k) => (a == null ? null : Array.isArray(a) && !/^\d+$/.test(k) ? a.map((x) => (x == null ? null : x[k])) : a[k]), o);
    return v === undefined ? null : v;
  };
  const TOK = /\s*("(?:[^"\\]|\\.)*"|\d+(?:\.\d+)?|[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*|<=|>=|!=|=|<|>|\+|-|\*|\/|\(|\)|\[|\]|,)/y;
  function tokens(src) {
    const out = [];
    TOK.lastIndex = 0;
    let m;
    while (TOK.lastIndex < src.length && (m = TOK.exec(src))) out.push(m[1]);
    if (TOK.lastIndex < src.trim().length && src.slice(TOK.lastIndex).trim()) throw new Error('FEEL: ' + src);
    return out;
  }
  const isValue = (t) => t && (t === ')' || t === ']' || /^[A-Za-z_"\d]/.test(t));
  function tr(ts) {
    let js = '', ifs = 0;
    for (let i = 0; i < ts.length; i++) {
      const t = ts[i], nx = ts[i + 1];
      if (t === 'list' && nx === 'contains') { js += 'FN.contains'; i++; continue; }
      if (t === 'and') { js += '&&'; continue; }
      if (t === 'or') { js += '||'; continue; }
      if (t === 'not') { js += '!'; continue; }
      if (t === 'if') { js += '(('; ifs++; continue; }
      if (t === 'then') { js += ')?('; continue; }
      if (t === 'else') { js += '):('; continue; }
      if (t === '=') { js += '=='; continue; }
      if (t === 'true' || t === 'false' || t === 'null') { js += t; continue; }
      if (t === '[') {
        let d = 1, j = i + 1;
        for (; j < ts.length && d; j++) { if (ts[j] === '[') d++; if (ts[j] === ']') d--; }
        const inner = ts.slice(i + 1, j - 1);
        if (isValue(ts[i - 1])) js += inner.length === 1 && /^\d+$/.test(inner[0]) ? `[${Number(inner[0]) - 1}]` : `.filter((item)=>(${tr(inner)}))`;
        else js += `[${tr(inner)}]`;
        i = j - 1; continue;
      }
      if (/^[A-Za-z_]/.test(t)) {
        if (nx === '(' && FN[t]) { js += 'FN.' + t; continue; }
        const [head, ...rest] = t.split('.');
        if (head === 'this') js += rest.length ? `get(row,${JSON.stringify(rest.join('.'))})` : 'row';
        else if (head === 'item') js += rest.length ? `get(item,${JSON.stringify(rest.join('.'))})` : 'item';
        else js += `get(ctx,${JSON.stringify(t)})`;
        continue;
      }
      js += t;
    }
    return js + '))'.repeat(ifs);
  }
  const CACHE = new Map();
  /* expr: chuỗi FEEL (có hoặc không có '=' đầu). Lỗi → null (fail open như evaluateFeelExpression). */
  function feel(expr, ctx, row) {
    if (expr == null) return null;
    const src = String(expr).replace(/^\s*=/, '');
    let fn = CACHE.get(src);
    if (!fn) {
      try { fn = new Function('get', 'FN', 'ctx', 'row', `return (${tr(tokens(src))});`); } catch (e) { fn = () => null; }
      CACHE.set(src, fn);
    }
    try { const v = fn(get, FN, ctx || {}, row || {}); return v === undefined ? null : v; } catch (e) { return null; }
  }
  const fmt = (v) => (v == null ? '' : Array.isArray(v) ? v.join(', ') : typeof v === 'number' ? v.toLocaleString('vi-VN', { maximumFractionDigits: 2 }) : String(v));
  const interpolate = (s, ctx, row) => String(s || '').replace(/\{\{([\s\S]+?)\}\}/g, (_, e) => esc(fmt(feel(e, ctx, row))));

  /* Liên kết tải tệp [tên](dl:tên) — cú pháp liên kết markdown của component text (Camunda form-js); thật: URL tải tệp từ MinIO. */
  const dlLinks = (x) => String(x).replace(/\[([^\]]+)\]\(dl:([^)]+)\)/g, '<a class="link-red" href="#" data-dl="$2">$1</a>');
  /* Markdown của component text (text-block): # / ## / ### tiêu đề, - gạch đầu dòng, **đậm**, *nghiêng*, [tên](dl:tên). */
  function md(s) {
    const inl = (x) => dlLinks(x).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*]+?)\*/g, '$1<i>$2</i>');
    const out = []; let ul = null;
    String(s).split('\n').forEach((ln) => {
      const t = ln.trim();
      if (/^- /.test(t)) { if (!ul) { ul = []; out.push(ul); } ul.push(`<li>${inl(t.slice(2))}</li>`); return; }
      ul = null;
      if (!t) return;
      const h = t.match(/^(#{1,3})\s+(.*)$/);
      out.push(h ? `<h4 class="h${h[1].length}">${inl(h[2])}</h4>` : `<p>${inl(t)}</p>`);
    });
    return out.map((x) => (Array.isArray(x) ? `<ul class="plain">${x.join('')}</ul>` : x)).join('');
  }

  /* Ô bảng (eformTableCell): giá trị trạng thái quen thuộc hiện thành badge. */
  const TONE = { 'Đạt': 'success', 'Không đạt': 'error', 'Đủ': 'success', 'Thiếu': 'warning', 'Không có': 'default', 'OK': 'success', 'Không OK': 'error',
    'Đã ký': 'success', 'Chưa ký': 'warning', 'Không ký': 'default', 'Không đồng ý': 'error', 'Đã trình': 'success', 'Chưa trình': 'default',
    'Đã xác nhận': 'success', 'Chờ xác nhận': 'warning', 'Chưa đến lượt': 'default', 'Đã duyệt': 'success', 'Chưa duyệt': 'default',
    'Bình thường': 'default', 'Hạn chế': 'warning', 'Khớp': 'success', 'Không khớp': 'error', 'Tiếp thu': 'success', 'Bảo lưu': 'warning',
    'Đã điền': 'success', 'Chưa trình ký': 'default', 'Thấp nhất': 'success' };
  const cell = (v) => (typeof v === 'string' && (TONE[v] || /^Cấm đến /.test(v)) ? badge(v, TONE[v] || 'error') : dlLinks(esc(fmt(v))));

  /* ---------- Duyệt schema ---------- */
  const INPUT = new Set(['textfield', 'textarea', 'number', 'datetime', 'select', 'radio', 'checkbox', 'checklist', 'taglist', 'filepicker']);
  const span = (c) => `style="grid-column:span ${Math.min(16, (c.layout && c.layout.columns) || 16)}"`;
  const empty = (c) => (c.type === 'checklist' || c.type === 'taglist' ? [] : c.type === 'checkbox' ? false : c.type === 'number' ? null : '');
  const optsOf = (c, ctx, row) => (c.valuesExpression ? feel(c.valuesExpression, ctx, row) || [] : c.valuesKey ? get(ctx, c.valuesKey) || [] : c.values || []);
  const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && !v.length);

  /* Giá trị ban đầu: biến cùng key (Camunda điền form từ biến quy trình) → defaultValue → rỗng. */
  function initValues(comps, vars, out) {
    (comps || []).forEach((c) => {
      if (c.type === 'group') return initValues(c.components, vars, out);
      if (c.type === 'dynamiclist') {
        const src = get(vars, c.path);
        const n = Array.isArray(src) ? src.length : c.defaultRepetitions || 0;
        out[c.path] = Array.from({ length: n }, (_, i) => {
          const r = Object.assign({}, (src || [])[i] || {});
          (c.components || []).forEach((x) => { if (INPUT.has(x.type) && r[x.key] === undefined) r[x.key] = x.defaultValue !== undefined ? x.defaultValue : empty(x); });
          return r;
        });
        return;
      }
      if (INPUT.has(c.type) || c.type === 'expression') {
        const v = get(vars, c.key);
        out[c.key] = v != null ? JSON.parse(JSON.stringify(v)) : c.defaultValue !== undefined ? c.defaultValue : empty(c);
      }
    });
    return out;
  }

  /* Tính lại các trường expression (ẩn), hai lượt như VhtEFormRuntime.recompute. */
  function recompute(form) {
    const run = (comps, ctx, row) => (comps || []).forEach((c) => {
      if (c.type === 'group') run(c.components, ctx, row);
      else if (c.type === 'dynamiclist') (form.values[c.path] || []).forEach((r) => run(c.components, ctx, r));
      else if (c.type === 'expression') { const v = feel(c.expression, ctx, row); if (row) row[c.key] = v; else form.values[c.key] = v; }
    });
    for (let k = 0; k < 2; k++) run(form.schema.components, form.ctx(), null);
  }

  function field(c, fk, ctl, form) {
    const req = c.validate && c.validate.required;
    const err = form.errors[fk];
    return `<div class="vfield ${err ? 'invalid' : ''}" ${span(c)} data-ef-field="${esc(fk)}"><div class="lr"><label>${esc(c.label || '')}</label>${req ? '<span class="req">*</span>' : ''}</div>
      ${ctl}${err ? `<p class="msg">${esc(err)}</p>` : (form.values.aiNguon || {})[fk] ? `<p class="msg hint" data-ef-ai-src>✦ AI gợi ý · Nguồn: ${esc(form.values.aiNguon[fk])}</p>` : c.description ? `<p class="msg hint">${esc(c.description)}</p>` : ''}</div>`;
  }

  /* fk = khoá đầy đủ của ô: key (cấp form) hoặc path::chỉ số::key (dòng của dynamiclist). */
  function control(c, fk, v, ctx, form, row) {
    const dis = form.readOnly || c.disabled ? 'disabled' : '';
    const ph = esc(c.placeholder || '');
    if (c.type === 'textfield') return `<input class="vctl" data-ef="${esc(fk)}" value="${esc(v == null ? '' : v)}" placeholder="${ph}" ${dis}>`;
    if (c.type === 'datetime') return `<input class="vctl" data-ef="${esc(fk)}" value="${esc(v == null ? '' : v)}" placeholder="dd/mm/yyyy" ${dis}>`;
    if (c.type === 'number') return `<input class="vctl num-in" type="number" data-ef="${esc(fk)}" data-num="1" value="${v == null ? '' : v}" ${c.validate && c.validate.min != null ? `min="${c.validate.min}"` : ''} ${dis}>`;
    if (c.type === 'textarea') return `<textarea class="vctl ta" rows="${c.rows || 3}" data-ef="${esc(fk)}" placeholder="${ph}" ${dis}>${esc(v == null ? '' : v)}</textarea>`;
    if (c.type === 'checkbox') return `<label class="check"><input type="checkbox" data-ef-chk="${esc(fk)}" ${v ? 'checked' : ''} ${dis}> ${esc(c.text || '')}</label>`;
    /* filepicker (Camunda form-js): giá trị = tên tệp đã chọn; thật: tệp tải lên MinIO, biến giữ id tệp. */
    if (c.type === 'filepicker') return `<div class="row ef-file"><label class="vbtn sm secondary ${dis ? 'dis' : ''}">${icon('upload')} Tải file lên<input type="file" hidden data-ef-file="${esc(fk)}" ${c.multiple ? 'multiple' : ''} ${dis}></label>${v ? `<span class="rsk-file">${String(v).split(', ').map((n) => `<a class="link-red" href="#" data-dl="${esc(n)}">${esc(n)}</a>`).join(', ')}</span>` : ''}</div>`;
    const opts = optsOf(c, ctx, row);
    if (c.type === 'radio') return `<div class="vradio ${opts.length <= 4 ? 'h' : ''}">${opts.map((o) => vRadio(esc(o.label), v === o.value, `data-ef-radio="${esc(fk)}" data-v='${esc(JSON.stringify(o.value))}'`, !!dis)).join('')}</div>`;
    if (c.type === 'checklist') {
      return `<div class="checks col">${opts.map((o) => `<label class="check"><input type="checkbox" data-ef-list="${esc(fk)}" data-v='${esc(JSON.stringify(o.value))}' ${(v || []).includes(o.value) ? 'checked' : ''} ${dis}> ${esc(o.label)}</label>`).join('')}</div>`;
    }
    /* select, taglist → vht-select / vht-multi-select */
    return vSelect({ id: 'ef-' + fk, value: v, multi: c.type === 'taglist', searchable: c.searchable || opts.length > 8, placeholder: c.type === 'taglist' ? 'Chọn' : 'Chọn ' + String(c.label || '').toLowerCase(),
      options: opts.map((o) => ({ value: o.value, label: o.label })), disabled: !!dis, invalid: !!form.errors[fk],
      /* [T72 #89] mở rộng E2 (chưa có ở vht-e-form, cần dev nhỏ): option có `fill` ({ key: giá trị }) → chọn thì điền các ô cùng dòng / cùng cấp, vẫn sửa được.
         Vd Cơ sở giá (NCC) của Phụ lục chi phí điền Đơn giá theo báo giá của NCC đó. */
      onChange: (x) => {
        const o = opts.find((y) => y.value === x);
        if (o && o.fill) Object.entries(o.fill).forEach(([k, val]) => form.set(fk.includes('::') ? fk.replace(/[^:]+$/, k) : k, val, false));
        form.set(fk, x, true);
      } });
  }

  function renderList(comps, ctx, form, row, prefix) {
    return (comps || []).map((c) => {
      if (c.conditional && c.conditional.hide && feel(c.conditional.hide, ctx, row)) return '';
      if (c.type === 'expression') return '';
      if (c.type === 'text') return `<div class="ef-text" ${span(c)}>${md(interpolate(c.text, ctx, row))}</div>`;
      if (c.type === 'html') return `<div class="ef-html" ${span(c)}>${String(c.content || '').replace(/\{\{([\s\S]+?)\}\}/g, (_, e) => esc(fmt(feel(e, ctx, row))))}</div>`;
      if (c.type === 'separator') return `<hr class="ef-sep" ${span(c)}>`;
      if (c.type === 'spacer') return `<div ${span(c)} style="height:${c.height || 16}px"></div>`;
      if (c.type === 'table') {
        const rows = feel(c.dataSource, ctx, row) || [];
        return `<div class="ef-table" ${span(c)}>${c.label ? `<div class="ef-lbl">${esc(c.label)}</div>` : ''}<div class="vtable-vp"><table class="vtable form"><thead><tr>${(c.columns || []).map((k) => `<th>${esc(k.label || k.key)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${(c.columns || []).map((k) => `<td>${cell(r[k.key])}</td>`).join('')}</tr>`).join('') || `<tr><td class="vtable-empty" colspan="${(c.columns || []).length}">Chưa có dữ liệu</td></tr>`}</tbody></table></div></div>`;
      }
      /* Review nhi 06/11 #34: nhóm có properties.aiFill → nút ✦ Gợi ý từ AI ở tiêu đề, AI chạy nền rồi tự điền ô trống (aiFillStart). */
      const fillBtn = c.type === 'group' && c.properties && c.properties.aiFill && !form.readOnly
        ? `<button type="button" class="vbtn sm secondary lf-ai-btn" data-ef-aifill ${form.aiBusy() ? 'disabled' : ''}>✦ ${form.aiBusy() ? 'AI đang gợi ý…' : 'Gợi ý từ AI'}</button>` : '';
      if (c.type === 'group') return `<div class="ef-group${c.properties && c.properties.variant === 'ai' ? ' ai-box' : ''}" ${span(c)}>${c.label ? `<div class="ef-gh${fillBtn ? ' ef-gh-ai' : ''}"><span>${esc(c.label)}</span>${fillBtn}</div>` : ''}<div class="ef-grid">${renderList(c.components, ctx, form, row, prefix)}</div></div>`;
      if (c.type === 'dynamiclist') {
        /* properties.rowHide: FEEL theo dòng — dòng thoả điều kiện không hiện, không kiểm tra (vd CQCM chưa được chọn). */
        const rh = c.properties && c.properties.rowHide;
        const rows = form.values[c.path] || [];
        const add = c.isRepeating !== false && c.allowAddRemove && !form.readOnly;
        /* Góp ý 06/11 (bước 26): bảng lặp có properties.aiSuggest → nút ✦ Gợi ý từ AI ở tiêu đề, mở popup chọn / sửa gợi ý rồi Áp dụng vào bảng. */
        const ai = c.properties && c.properties.aiSuggest && !form.readOnly
          ? `<button type="button" class="vbtn sm secondary lf-ai-btn" data-ef-ai="${esc(c.path)}">✦ ${form.aiDone[c.path] ? 'Gợi ý lại' : 'Gợi ý từ AI'}</button>` : '';
        const gh = c.label || ai ? `<div class="ef-gh${ai ? ' ef-gh-ai' : ''}"><span>${esc(c.label || '')}</span>${ai}</div>` : '';
        return `<div class="ef-dl" ${span(c)}>${gh}<div class="ef-list">
          ${rows.map((r, i) => (rh && feel(rh, ctx, r) ? '' : `<div class="ef-row">${c.properties && c.properties.rowNo ? `<div class="ef-rowno" style="font-weight:600;margin-bottom:6px">TT ${i + 1}</div>` : ''}<div class="ef-grid">${renderList(c.components, ctx, form, r, `${c.path}::${i}::`)}</div>
            ${add ? `<div class="row end"><button type="button" class="vbtn sm secondary red-t" data-ef-dup="${esc(c.path)}" data-i="${i}">Nhân bản</button><button type="button" class="vbtn sm ghost" data-ef-del="${esc(c.path)}" data-i="${i}">Xoá</button></div>` : ''}</div>`)).join('')}
          ${add ? `<div><button type="button" class="vbtn sm secondary" data-ef-add="${esc(c.path)}">Thêm dòng</button></div>` : ''}
          ${!rows.length && !add ? '<div class="empty-t">Chưa có dữ liệu</div>' : ''}</div></div>`;
      }
      if (!INPUT.has(c.type)) return '';
      const fk = (prefix || '') + c.key;
      const v = row ? row[c.key] : form.values[c.key];
      return field(c, fk, control(c, fk, v, ctx, form, row), form);
    }).join('');
  }

  /* Kiểm tra validate tĩnh (required / min / max / minLength / maxLength / pattern) của các ô đang hiện. */
  function validate(form) {
    const errs = {}, ctx = form.ctx();
    const walk = (comps, row, prefix) => (comps || []).forEach((c) => {
      if (c.conditional && c.conditional.hide && feel(c.conditional.hide, ctx, row)) return;
      if (c.type === 'group') return walk(c.components, row, prefix);
      if (c.type === 'dynamiclist') return (form.values[c.path] || []).forEach((r, i) => { if (!(c.properties && c.properties.rowHide && feel(c.properties.rowHide, ctx, r))) walk(c.components, r, `${c.path}::${i}::`); });
      if (!INPUT.has(c.type) || !c.validate) return;
      const v = row ? row[c.key] : form.values[c.key], fk = (prefix || '') + c.key, va = c.validate;
      const pick = ['select', 'radio', 'checklist', 'taglist'].includes(c.type);
      if (va.required && (isEmpty(v) || (c.type === 'checkbox' && !v))) errs[fk] = `Bạn cần ${pick ? 'chọn' : 'nhập'} ${String(c.label || '').toLowerCase()}`;
      else if (c.type === 'number' && v != null && v !== '' && va.min != null && Number(v) < va.min) errs[fk] = `Giá trị tối thiểu là ${va.min}`;
      else if (c.type === 'number' && v != null && v !== '' && va.max != null && Number(v) > va.max) errs[fk] = `Giá trị tối đa là ${va.max}`;
      else if (va.maxLength && String(v || '').length > va.maxLength) errs[fk] = `Tối đa ${va.maxLength} ký tự`;
      else if (va.pattern && v && !new RegExp(va.pattern).test(String(v))) errs[fk] = 'Sai định dạng';
    });
    walk(form.schema.components, null, '');
    return errs;
  }

  /* ---------- Dialog (my-task-eform-dialog) ----------
     o: { title, schema, vars, values (bản nháp đã lưu), readOnly, check(values, decide) → lỗi BE hoặc null, draftLabel (nhãn nút Lưu nháp), draftOnly (chỉ Hủy / Lưu nháp),
          decide: { yes, no } (nhãn hai nút kết luận thay cho Xác nhận — màn phê duyệt), aiKey + onAiDone(kết quả) (AI chạy nền xong khi form đã đóng) }.
     Trả Promise: { submit: true, values, decide: 'yes' | 'no' } khi Xác nhận hợp lệ; { draft: true, values } khi Lưu nháp; null khi Hủy. */
  /* Review nhi 06/11 #34: việc AI đang chạy nền theo aiKey (hồ sơ + bước) — sống qua lúc đóng / mở lại form. Thật: service task AI bất đồng bộ, xong thì ghi biến và gửi thông báo. */
  const AI_JOBS = {};
  function open(o) {
    return new Promise((resolve) => {
      const form = {
        schema: o.schema, readOnly: !!o.readOnly, errors: {}, aiDone: {},
        values: Object.assign(initValues(o.schema.components, o.vars || {}, {}), o.values || {}),
        ctx() { return Object.assign({}, o.vars || {}, this.values); },
        set(fk, v, again) {
          if (form.values.aiNguon) delete form.values.aiNguon[fk];
          const p = fk.split('::');
          if (p.length === 3) form.values[p[0]][Number(p[1])][p[2]] = v; else form.values[fk] = v;
          delete form.errors[fk];
          if (again) draw();
        },
        get(fk) { const p = fk.split('::'); return p.length === 3 ? form.values[p[0]][Number(p[1])][p[2]] : form.values[fk]; },
        aiBusy() { return !!AI_JOBS[o.aiKey || o.schema.id]; },
      };
      let done = false;
      const finish = (r) => { if (done) return; done = true; form.closed = true; resolve(r); };
      /* Review nhi 06/11 #6, #12, #16: o.preview = [{ code, label }] → nút Xem trước văn bản (bên trái nút đóng), dựng từ giá trị form đang nhập — chưa lưu.
         Thật: gọi API xem trước của mẫu tài liệu (ProfileTaskFormService preview) với biến form hiện tại. */
      const pv = (o.preview || []).map((x, i) => `<button type="button" class="vbtn secondary ef-pv" data-ef-pv="${i}">${icon('file')} ${esc(x.label)}</button>`).join('');
      const acts = form.readOnly ? `${pv}<button class="vbtn secondary" data-close>Đóng</button>`
        : `${pv}<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn ${o.draftOnly ? 'primary' : 'secondary'}" id="ef-draft">${esc(o.draftLabel || 'Lưu nháp')}</button>${o.draftOnly ? '' : o.decide ? `<button class="vbtn red" id="ef-no">${esc(o.decide.no)}</button><button class="vbtn primary" id="ok">${esc(o.decide.yes)}</button>` : '<button class="vbtn primary" id="ok">Xác nhận</button>'}`;
      const m = vModal({ title: o.title, size: 'ef', body: `<div class="ef-scroll"><div class="ef-grid ef-body" data-ef-form="${esc(o.schema.id || '')}"></div><div class="ef-docs"></div></div>`, actions: acts });
      const body = m.el.querySelector('.ef-body'), scroller = m.el.querySelector('.ef-scroll'), docsEl = m.el.querySelector('.ef-docs');
      /* Tài liệu bắt buộc của hành động (E3): tải lên ngay trong hộp thoại — cùng khoá với dòng "chưa tải lên" ở Danh sách tài liệu của màn xử lý task. */
      function drawDocs() {
        const list = !form.readOnly && o.docs ? o.docs(JSON.parse(JSON.stringify(form.values))) : [];
        docsEl.innerHTML = list.length ? `<div class="ef-docs-h">Tài liệu đính kèm</div>${list.map((d) => `<div class="ef-doc"><span class="${d.have ? '' : 'doc-req'}">${esc(d.name)}${d.opt ? ' (nếu có)' : ' <span class="req">*</span>'}</span>
          <div class="row ef-file"><label class="vbtn sm secondary">${icon('upload')} ${d.have ? 'Tải lại' : 'Tải file lên'}<input type="file" hidden data-ef-doc="${esc(d.key)}"></label>${d.have ? `<span class="rsk-file">${esc(typeof d.have === 'string' ? d.have : 'Đã tải lên')}</span>` : ''}</div></div>`).join('')}` : '';
      }
      /* T29 B18 (người dùng 05/11): nút Toàn màn hình cạnh nút đóng (màn cũ có nút phóng to) — vht-modal thật: thêm cờ maximizable / class full-screen.
         Lựa chọn nhớ theo người xem (localStorage, chỉ là tiện ích hiển thị). */
      window.UI.vMaximize(m, 'dtms-proto-ef-max', 'data-ef-max');
      function draw() {
        recompute(form);
        const top = scroller.scrollTop;
        body.innerHTML = renderList(form.schema.components, form.ctx(), form, null, '');
        drawDocs();
        scroller.scrollTop = top;
      }
      draw();
      function redraw() {
        const a = document.activeElement, k = a && body.contains(a) && a.dataset ? a.dataset.ef : null, pos = k && a.selectionStart;
        draw();
        const n = k && body.querySelector(`[data-ef="${CSS.escape(k)}"]`);
        if (n) { n.focus(); try { if (pos != null) n.setSelectionRange(pos, pos); } catch (e) { /* number */ } }
      }
      const parse = (v) => { try { return JSON.parse(v); } catch (e) { return v; } };
      m.el.addEventListener('input', (e) => { const k = e.target.dataset.ef; if (k) form.set(k, e.target.dataset.num ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value); });
      m.el.addEventListener('change', (e) => {
        const t = e.target;
        /* Ô nhập: vẽ lại sau khi sự kiện focus sang ô kế tiếp chạy xong, giữ con trỏ ở ô đang nhập (không mất chữ đang gõ). */
        if (t.dataset.ef) { form.set(t.dataset.ef, t.dataset.num ? (t.value === '' ? null : Number(t.value)) : t.value); setTimeout(redraw, 0); return; }
        if (t.dataset.efChk) { form.set(t.dataset.efChk, t.checked, true); return; }
        if (t.dataset.efDoc) { if (t.files.length) { window.Flow.setUi(t.dataset.efDoc, true); toast('<b>Thành công</b><br>Đã tải tài liệu lên hồ sơ.'); drawDocs(); } return; }
        if (t.dataset.efFile) { form.set(t.dataset.efFile, [...t.files].map((f) => f.name).join(', '), true); return; }
        if (t.dataset.efList) {
          const cur = (form.get(t.dataset.efList) || []).slice(), v = parse(t.dataset.v), i = cur.indexOf(v);
          if (t.checked && i < 0) cur.push(v); if (!t.checked && i >= 0) cur.splice(i, 1);
          form.set(t.dataset.efList, cur, true);
        }
      });
      m.el.addEventListener('click', (e) => {
        const t = e.target;
        const r = t.closest('[data-ef-radio]');
        if (r) { e.preventDefault(); form.set(r.dataset.efRadio, parse(r.dataset.v), true); return; }
        const add = t.closest('[data-ef-add]'), dup = t.closest('[data-ef-dup]'), del = t.closest('[data-ef-del]');
        if (add) { form.values[add.dataset.efAdd] = (form.values[add.dataset.efAdd] || []).concat([{}]); draw(); return; }
        if (dup) { const l = form.values[dup.dataset.efDup]; l.splice(Number(dup.dataset.i) + 1, 0, Object.assign({}, l[Number(dup.dataset.i)])); draw(); return; }
        if (del) { form.values[del.dataset.efDel].splice(Number(del.dataset.i), 1); draw(); return; }
        const pvb = t.closest('[data-ef-pv]');
        if (pvb) { recompute(form); o.preview[Number(pvb.dataset.efPv)].open(JSON.parse(JSON.stringify(form.values))); return; }
        const aib = t.closest('[data-ef-ai]');
        if (aib) { aiPopup(aib.dataset.efAi); return; }
        if (t.closest('[data-ef-aifill]')) { aiFillStart(); return; }
        if (t.closest('[data-close]') || t === m.el) finish(null);
      });
      /* Popup Gợi ý AI của bảng lặp (cùng mẫu màn Lập ĐXMS — luong.js aiModal): mỗi gợi ý có ô Áp dụng, quyết định gợi ý (đổi được),
         nội dung gợi ý (sửa được) + nguồn. Áp dụng → ghi vào dòng cùng khoá `match` của bảng; Hủy: form giữ nguyên; sau khi áp dụng vẫn sửa được trên form.
         cfg = properties.aiSuggest: { title, source (biến danh sách gợi ý của service task AI), match, head (markdown + {{this.x}}),
         decision: { key, label, values }, text: { key, label }, strip (markdown kết quả AI chạy trước, chỉ xem) }. */
      function aiPopup(path) {
        const find = (comps) => { for (const c of comps || []) { if (c.type === 'dynamiclist' && c.path === path) return c; const x = c.type === 'group' && find(c.components); if (x) return x; } return null; };
        const c = find(form.schema.components), cfg = c.properties.aiSuggest, ctx = form.ctx(), mk = cfg.match || 'id';
        const sug = (get(ctx, cfg.source) || []).map((x) => JSON.parse(JSON.stringify(x))), dec = cfg.decision, tx = cfg.text;
        const rows = sug.map((x, i) => {
          const d = dec ? `<div class="vradio">${dec.values.map((v) => vRadio(esc(v.label), x[dec.key] === v.value, `data-ai-rad="${i}" data-v='${esc(JSON.stringify(v.value))}'`)).join('')}</div>` : '';
          return `<tr data-ai-row="${i}"><td class="c"><input type="checkbox" data-ai-on="${i}" checked aria-label="Áp dụng"></td><td>${md(interpolate(cfg.head, ctx, x))}</td>
            ${dec ? `<td>${d}</td>` : ''}<td><textarea class="vctl ta" rows="3" maxlength="4000" data-ai-txt="${i}">${esc(x[tx.key] || '')}</textarea>${x.nguon ? `<div class="cap">Nguồn: ${esc(x.nguon)}</div>` : ''}</td></tr>`;
        }).join('') || '<tr><td colspan="4" class="faint">AI không có gợi ý</td></tr>';
        const th = [['Áp dụng', 70, 'c'], ['Ý kiến', 320]].concat(dec ? [[dec.label, 170]] : [], [[`${tx.label} (sửa được)`, 440]]);
        const pm = vModal({ title: `✦ Gợi ý từ AI — ${cfg.title}`, size: 'xl',
          body: `<div data-ef-ai-pop>${cfg.strip ? `<div class="lf-ai2">${md(interpolate(cfg.strip, ctx))}</div>` : ''}
            <div class="vtable-vp"><table class="vtable"><thead><tr>${th.map(([h, w, k]) => `<th style="width:${w}px" class="${k || ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
            <p class="cap">Bỏ chọn ý kiến không dùng gợi ý, đổi quyết định hoặc sửa nội dung nếu cần, rồi bấm Áp dụng để điền vào form.</p></div>`,
          actions: '<button type="button" class="vbtn secondary" data-close>Hủy</button><button type="button" class="vbtn primary" data-ef-ai-apply>Áp dụng vào form</button>' });
        pm.el.addEventListener('click', (e) => {
          const r = e.target.closest('[data-ai-rad]');
          if (!r) return;
          e.preventDefault();
          const i = Number(r.dataset.aiRad);
          sug[i][dec.key] = parse(r.dataset.v);
          pm.el.querySelectorAll(`[data-ai-rad="${i}"]`).forEach((x) => x.classList.toggle('on', x === r));
        });
        pm.el.querySelector('[data-ef-ai-apply]').addEventListener('click', () => {
          const list = form.values[path] || [];
          let n = 0;
          sug.forEach((x, i) => {
            if (!pm.el.querySelector(`[data-ai-on="${i}"]`).checked) return;
            const k = list.findIndex((y) => y[mk] === x[mk]);
            if (k < 0) return;
            if (dec) { list[k][dec.key] = x[dec.key]; delete form.errors[`${path}::${k}::${dec.key}`]; }
            list[k][tx.key] = pm.el.querySelector(`[data-ai-txt="${i}"]`).value.trim();
            delete form.errors[`${path}::${k}::${tx.key}`];
            n += 1;
          });
          form.aiDone[path] = true;
          pm.close();
          toast(`Đã áp dụng gợi ý AI: ${n} / ${sug.length} ý kiến — vẫn sửa được trên form.`, 'success');
          draw();
        });
      }
      /* Review nhi 06/11 #34, #35: bấm ✦ Gợi ý từ AI → hộp thoại tiến trình đóng được bất cứ lúc nào, AI vẫn chạy nền; xong thì tự điền các ô đang trống
         (ô người dùng đã nhập giữ nguyên), mỗi ô ghi nguồn gợi ý. Form đã đóng: kết quả ghi vào bản nháp qua o.onAiDone. */
      const aiKey = o.aiKey || o.schema.id;
      if (AI_JOBS[aiKey]) Object.assign(AI_JOBS[aiKey], { form, redraw, onDone: o.onAiDone });
      function findFill(comps) { for (const c of comps || []) { if (c.type === 'group' && c.properties && c.properties.aiFill) return c.properties.aiFill; const x = c.type === 'group' && findFill(c.components); if (x) return x; } return null; }
      function aiFillStart() {
        const cfg = findFill(form.schema.components);
        if (!cfg || AI_JOBS[aiKey]) return;
        const src = get(form.ctx(), cfg.source) || {};
        const pop = vModal({ title: `✦ Gợi ý từ AI — ${cfg.title}`, size: 'md', body: `<div class="ef-ai-wait" data-ef-ai-wait><span class="ef-spin" aria-hidden="true"></span><div><b>AI đang soạn nội dung ${esc(cfg.title)}…</b><p class="cap">Bạn có thể đóng cửa sổ này để làm việc khác. Khi xong, nội dung tự điền vào các ô đang trống.</p></div></div>`,
          actions: '<button type="button" class="vbtn secondary" data-close>Đóng</button>' });
        const job = AI_JOBS[aiKey] = { form, redraw, onDone: o.onAiDone };
        draw();
        setTimeout(() => {
          delete AI_JOBS[aiKey];
          if (document.body.contains(pop.el)) pop.close();
          if (job.form.closed) { if (job.onDone) job.onDone(src); return; }
          const nguon = job.form.values.aiNguon || (job.form.values.aiNguon = {});
          let n = 0;
          Object.entries(src).forEach(([k, x]) => { if (isEmpty(job.form.values[k]) && x.value) { job.form.values[k] = x.value; nguon[k] = x.nguon || ''; delete job.form.errors[k]; n += 1; } });
          job.redraw();
          toast(n ? `Đã điền gợi ý AI vào ${n} trường — vẫn sửa được trên form.` : 'Các trường đã có nội dung, AI không điền thêm.', 'success');
        }, window.D && window.D.aiDelay != null ? window.D.aiDelay : 2000);
      }
      const out = () => JSON.parse(JSON.stringify(form.values));
      const dr = m.el.querySelector('#ef-draft');
      if (dr) dr.onclick = () => { m.close(); finish({ draft: true, values: out() }); };
      const ok = m.el.querySelector('#ok'), no = m.el.querySelector('#ef-no');
      if (ok) {
        const submit = (dec) => {
          recompute(form);
          form.errors = validate(form);
          if (Object.keys(form.errors).length) {
            draw();
            const first = m.el.querySelector('.vfield.invalid');
            if (first) first.scrollIntoView({ block: 'center' });
            return;
          }
          const err = o.check ? o.check(out(), dec) : null;
          if (err) { toast(esc(err), 'warn'); return; }
          m.close(); finish({ submit: true, values: out(), decide: dec });
        };
        ok.onclick = () => submit('yes');
        if (no) no.onclick = () => submit('no');
      }
    });
  }

  window.EFormRun = { open, feel, interpolate, md, initValues };
})();
