/* Vẽ BPMN (các trang ĐTMS.drawio, js/bpmn-diagram*.js) bằng SVG — thay cho app-bpmn-viewer (bpmn-js NavigatedViewer) của source:
   kéo để di chuyển, cuộn chuột để phóng to/thu nhỏ; bước đang xử lý tô theo ACTIVE_STEP_PAINT. Tuỳ chọn (Chi tiết quy trình):
   toolbar Phóng to/Thu nhỏ, bấm chọn phần tử (viền SELECTED_MARKER) → phát sự kiện 'bpmn-element' trên document. */
(function () {
  /* Nhãn cạnh lấy từ drawio còn thực thể HTML (&lt;160 tỷ) — giải mã trước khi escape, tránh hiện "&lt;" (T33 B1). */
  const unent = (t) => String(t == null ? '' : t).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const DEF_PAGE = 'MS01 v1.1';
  const diagram = (page) => window.BPMN_DIAGRAMS[page || DEF_PAGE];
  let G = diagram();
  const ACTIVE = { fill: '#e9fbf0', stroke: '#5fe495', sw: 3 }; // bpmn-viewer/constants ACTIVE_STEP_PAINT
  const SELECTED = { stroke: '#ee0033', sw: 3.5 }; // .app-bpmn-selected
  const ZOOM_MIN = 0.02, ZOOM_MAX = 4, ZOOM_FACTOR = 1.25;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const views = {}; // key → { tx, ty, s } giữ vị trí khi màn vẽ lại
  let svgCache = { key: null, html: '' };

  const fo = (n, x, y, w, h, extra) => {
    const va = n.va === 'top' ? 'flex-start' : n.va === 'bottom' ? 'flex-end' : 'center';
    const al = n.al === 'left' ? 'left' : n.al === 'right' ? 'right' : 'center';
    return `<foreignObject x="${x}" y="${y}" width="${Math.max(1, w)}" height="${Math.max(1, h)}"><div xmlns="http://www.w3.org/1999/xhtml" class="bp-l" style="justify-content:${va};text-align:${al};font-size:${n.fs || 12}px;color:${n.fc || '#193449'};${n.b ? 'font-weight:700;' : ''}${extra || ''}"><div>${n.html}</div></div></foreignObject>`;
  };
  const marker = (n) => (n.mk === 'user'
    ? `<g transform="translate(${n.x + 10},${n.y + 8})" fill="none" stroke="#51799E" stroke-width="1.3"><circle cx="7" cy="5" r="3.5"/><path d="M1 15c0-4 3-6 6-6s6 2 6 6z"/></g>`
    : n.mk === 'service' ? `<g transform="translate(${n.x + 10},${n.y + 8})" fill="none" stroke="#3E7B52" stroke-width="1.3"><circle cx="7" cy="7" r="5.5" stroke-dasharray="2.2 1.6" stroke-width="3"/><circle cx="7" cy="7" r="2.2"/></g>` : '');

  function node(n, on, sel, pick) {
    const fill = on ? ACTIVE.fill : n.fill || 'none';
    const stroke = sel ? SELECTED.stroke : on ? ACTIVE.stroke : n.stroke || 'none', sw = sel ? SELECTED.sw : on ? ACTIVE.sw : n.sw || 1;
    const S = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${n.dash ? ' stroke-dasharray="6 4"' : ''}`;
    const id = (n.t ? ` data-task="${esc(n.t)}"` : '') + (pick && n.el ? ` data-el="${esc(n.el.id)}" class="bp-pick"` : '');
    switch (n.k) {
      case 'pool': return `<g><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="${n.body || '#fff'}" stroke="${n.stroke || '#899BAA'}"/>
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.ss || 40}" fill="${n.fill || '#E2EAF0'}" stroke="${n.stroke || '#899BAA'}"/>${n.html ? fo(n, n.x + (n.pl || 0), n.y, n.w, n.ss || 40) : ''}</g>`;
      case 'lane': return `<g><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="${n.body || '#fff'}" stroke="${n.stroke || '#B8C5D1'}"/>
        <rect x="${n.x}" y="${n.y}" width="${n.ss || 40}" height="${n.h}" fill="${n.fill || '#ECF1F5'}" stroke="${n.stroke || '#B8C5D1'}"/>${n.html ? fo(n, n.x, n.y, n.ss || 40, n.h, 'padding:12px;') : ''}</g>`;
      case 'task': return `<g${id}><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="12" ${S}/>${marker(n)}${fo({ html: esc(n.name), fs: 16, fc: '#193449' }, n.x + 16, n.y + 24, n.w - 32, n.h - 36)}</g>`;
      case 'gw': { const cx = n.x + n.w / 2, cy = n.y + n.h / 2; return `<g${id}><polygon points="${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}" ${S}/>${n.html ? `<text x="${cx}" y="${cy}" dy="0.35em" text-anchor="middle" font-size="${Math.min(n.fs || 20, 24)}" font-weight="700" fill="${n.stroke || '#AC8136'}">${esc(n.html.replace(/<[^>]+>/g, ''))}</text>` : ''}</g>`; }
      case 'ev': case 'ev2': { const cx = n.x + n.w / 2, cy = n.y + n.h / 2, r = n.w / 2; return `<g${id}><circle cx="${cx}" cy="${cy}" r="${r}" ${S}/>${n.k === 'ev2' ? `<circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>` : ''}${n.html ? fo(n, n.x - 40, n.y + n.h + 2, n.w + 80, 40, 'align-items:center;') : ''}</g>`; }
      case 'text': return fo(n, n.x + (n.pl || 0), n.y, n.w - (n.pl || 0), n.h);
      default: return `<g><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" ${n.rd ? 'rx="8"' : ''} ${S}/>${n.html ? fo(n, n.x + (n.pl || 6), n.y, n.w - (n.pl || 6) - 6, n.h) : ''}</g>`;
    }
  }

  function svg(active, o) {
    const key = [o.page, active.join(','), o.select ? 1 : 0, o.selected || ''].join('|');
    if (svgCache.key === key) return svgCache.html;
    const on = new Set(active.map(String));
    const colors = [...new Set(G.edges.map((e) => e.c || '#455F73'))];
    const mid = (c) => 'bpa' + colors.indexOf(c);
    const defs = colors.map((c) => `<marker id="${mid(c)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('');
    const back = G.nodes.filter((n) => n.k === 'pool' || n.k === 'lane' || (n.k === 'box' && n.w > 1000));
    const front = G.nodes.filter((n) => !back.includes(n));
    const edges = G.edges.map((e) => {
      const c = e.c || '#455F73';
      const d = 'M' + e.p.map((p) => p.join(' ')).join(' L');
      const lab = (e.l || []).map(([x, y, t]) => `<text x="${x}" y="${y}" dy="0.35em" text-anchor="middle" class="bp-el" fill="${c}">${esc(unent(t))}</text>`).join('');
      return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${e.sw || 1.7}"${e.d ? ' stroke-dasharray="6 4"' : ''}${e.na ? '' : ` marker-end="url(#${mid(c)})"`}/>${lab}`;
    }).join('');
    const html = `<svg class="bp-svg" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs><g class="bp-root">${back.map((n) => node(n, false)).join('')}${edges}${front.map((n) => node(n, on.has(String(n.t)), !!(o.selected && n.el && n.el.id === o.selected), o.select)).join('')}</g></svg>`;
    svgCache = { key, html };
    return html;
  }

  /* Khung xem: key giữ vị trí pan/zoom theo màn; active = số task đang xử lý (có thể nhiều task song song).
     o: { page (trang drawio, mặc định MS01 v1.1), toolbar, select (bấm chọn phần tử), selected (id phần tử đang chọn),
          focus (task để canh giữa khi mở — mặc định mọi task active; dùng khi các task active nằm xa nhau, vd. quy trình con KĐT 41 + bước 24) }. */
  function html(key, active, height, o) {
    o = Object.assign({ page: DEF_PAGE }, o);
    G = diagram(o.page);
    if (!G) return `<div class="bp-vp bp-msg" style="height:${height || 520}px">Chưa có sơ đồ để hiển thị.</div>`;
    if (document.body.classList.contains('cap')) return `<div class="bp-vp" style="height:${height || 520}px">${capSvg(active, height || 520, o.focus)}</div>`;
    const tb = o.toolbar ? `<div class="bp-tb"><button type="button" class="bp-tbb" data-bpz="in" aria-label="Phóng to">${ZOOM_IN}</button><button type="button" class="bp-tbb" data-bpz="out" aria-label="Thu nhỏ">${ZOOM_OUT}</button><button type="button" class="bp-tbb" data-bpz="mini" aria-label="Bản đồ thu nhỏ">${MINI}</button></div>` : '';
    return `<div class="bp-vp${o.select ? ' pick' : ''}" data-bpmn="${esc(key)}" data-page="${esc(o.page)}" data-active="${esc(active.join(','))}"${o.focus ? ` data-focus="${esc(o.focus.join(','))}"` : ''} style="height:${height || 520}px">${svg(active, o)}${tb}</div>`;
  }
  const MINI = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="11" y="11" width="7" height="5" rx="1"/></svg>';
  const ZOOM_IN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>';
  const ZOOM_OUT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6"/></svg>';

  /* ?capture=1 (xuất Figma): Figma không đọc foreignObject và sơ đồ đầy đủ quá nặng → chỉ vẽ vùng đang nhìn, chữ bằng <text>. */
  const plain = (h) => h.replace(/<br\s*\/?>|<\/div>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const wrap = (t, n) => { const out = []; let line = ''; for (const w of t.split(/\s+/)) { if ((line + ' ' + w).trim().length > n && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); } if (line) out.push(line); return out; };
  function capSvg(active, H, focus) {
    const W = 1100, v = initial({ clientWidth: W, clientHeight: H }, (focus || active).map(String));
    const vx = -v.tx / v.s, vy = -v.ty / v.s, vw = W / v.s, vh = H / v.s;
    const hit = (x, y, w, h) => x < vx + vw && x + w > vx && y < vy + vh && y + h > vy;
    const on = new Set(active.map(String));
    const lines = (x, y, arr, fs, fc, bold, anchor) => arr.map((l, i) => `<text x="${x}" y="${y + i * fs * 1.2}" font-family="Arial" font-size="${fs}" fill="${fc}"${bold ? ' font-weight="700"' : ''}${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(l)}</text>`).join('');
    const parts = [];
    const isBack = (n) => n.k === 'pool' || n.k === 'lane' || (n.k === 'box' && n.w > 1000);
    for (const n of G.nodes.filter(isBack).concat(G.nodes.filter((x) => !isBack(x)))) {
      if (!hit(n.x, n.y, n.w, n.h)) continue;
      const a = on.has(String(n.t)), fill = a ? ACTIVE.fill : n.fill || 'none', stroke = a ? ACTIVE.stroke : n.stroke || 'none', sw = a ? ACTIVE.sw : n.sw || 1;
      const txt = n.html ? plain(n.html).split('\n').map((x) => x.trim()).filter(Boolean) : [];
      if (n.k === 'pool' || n.k === 'lane' || n.k === 'box') {
        parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="${n.body || fill}" stroke="${stroke}"/>`);
        if (n.k === 'box' && txt.length) parts.push(lines(n.x + (n.pl || 6), n.y + n.h / 2 + (n.fs || 12) * 0.35, txt.slice(0, 1), n.fs || 12, n.fc || '#193449', n.b));
      } else if (n.k === 'task') {
        parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
        const tl = wrap(n.name, 26);
        parts.push(lines(n.x + n.w / 2, n.y + n.h / 2 - ((tl.length - 1) * 19) / 2 + 6, tl, 16, '#193449', false, 'middle'));
      } else if (n.k === 'gw') {
        const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
        parts.push(`<polygon points="${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
        if (txt.length) parts.push(lines(cx, cy + 8, txt.slice(0, 1), 22, stroke, true, 'middle'));
      } else if (n.k === 'ev' || n.k === 'ev2') {
        parts.push(`<circle cx="${n.x + n.w / 2}" cy="${n.y + n.h / 2}" r="${n.w / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
      } else if (n.k === 'text' && txt.length) {
        const fs = n.fs || 12, cx = n.al === 'left' ? n.x + (n.pl || 0) : n.x + n.w / 2;
        parts.push(lines(cx, n.y + fs, txt.flatMap((r) => wrap(r, Math.max(8, Math.floor(n.w / (fs * 0.55))))).slice(0, 4), fs, n.fc || '#193449', n.b, n.al === 'left' ? null : 'middle'));
      }
    }
    for (const e of G.edges) {
      const xs = e.p.map((p) => p[0]), ys = e.p.map((p) => p[1]);
      if (!hit(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs) + 1, Math.max(...ys) - Math.min(...ys) + 1)) continue;
      const c = e.c || '#455F73';
      parts.push(`<path d="M${e.p.map((p) => p.join(' ')).join(' L')}" fill="none" stroke="${c}" stroke-width="${e.sw || 1.7}"${e.d ? ' stroke-dasharray="6 4"' : ''}/>`);
      if (!e.na) {
        const [x2, y2] = e.p[e.p.length - 1], [x1, y1] = e.p[e.p.length - 2], ang = Math.atan2(y2 - y1, x2 - x1), L = 9;
        const pt = (d) => `${x2 - L * Math.cos(ang + d)},${y2 - L * Math.sin(ang + d)}`;
        parts.push(`<polygon points="${x2},${y2} ${pt(0.45)} ${pt(-0.45)}" fill="${c}"/>`);
      }
      (e.l || []).forEach(([x, y, t]) => parts.push(`<text x="${x}" y="${y + 4}" font-family="Arial" font-size="12" fill="${c}" text-anchor="middle">${esc(unent(t))}</text>`));
    }
    return `<svg class="bp-svg" xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid slice">${parts.join('')}</svg>`;
  }

  const apply = (vp, v) => {
    vp.querySelector('.bp-root').setAttribute('transform', `translate(${v.tx} ${v.ty}) scale(${v.s})`);
    const f = vp.querySelector('.bp-mini-vw');
    if (f) { f.setAttribute('x', -v.tx / v.s); f.setAttribute('y', -v.ty / v.s); f.setAttribute('width', vp.clientWidth / v.s); f.setAttribute('height', vp.clientHeight / v.s); }
  };

  /* Bản đồ thu nhỏ (diagram-js-minimap của bpmn-viewer: đóng khi mở, góc dưới trái, 200×112): toàn sơ đồ + khung vùng đang xem; bấm để nhảy tới. */
  function toggleMini(vp, v, g) {
    const old = vp.querySelector('.bp-mini');
    if (old) old.remove();
    if (!v.mini) return;
    const [x, y, w, h] = g.box, parts = g.nodes.filter((n) => ['task', 'gw', 'ev', 'ev2'].includes(n.k))
      .map((n) => `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="#76777A"/>`).join('');
    vp.insertAdjacentHTML('beforeend', `<div class="bp-mini"><svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet">${parts}<rect class="bp-mini-vw"/></svg></div>`);
    const box = vp.querySelector('.bp-mini'), svg = box.querySelector('svg');
    box.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
      v.tx = vp.clientWidth / 2 - p.x * v.s; v.ty = vp.clientHeight / 2 - p.y * v.s;
      apply(vp, v);
    });
  }

  /* Lần đầu: canh giữa bước đang xử lý ở mức đọc được chữ; không có bước nào thì vừa khung (fit-viewport). */
  function initial(vp, active) {
    const W = vp.clientWidth || 1000, H = vp.clientHeight || 520;
    const hit = G.nodes.filter((n) => n.t && active.includes(String(n.t)));
    if (!hit.length) { const [x, y, w, h] = G.box, s = Math.min(W / w, H / h); return { s, tx: (W - w * s) / 2 - x * s, ty: (H - h * s) / 2 - y * s }; }
    const x1 = Math.min(...hit.map((n) => n.x)), x2 = Math.max(...hit.map((n) => n.x + n.w));
    const y1 = Math.min(...hit.map((n) => n.y)), y2 = Math.max(...hit.map((n) => n.y + n.h));
    const s = Math.min(1, (W - 80) / (x2 - x1 + 600), (H - 60) / (y2 - y1 + 200));
    return { s, tx: W / 2 - ((x1 + x2) / 2) * s, ty: H / 2 - ((y1 + y2) / 2) * s };
  }

  function mount() {
    document.querySelectorAll('.bp-vp[data-bpmn]').forEach((vp) => {
      const key = vp.dataset.bpmn, active = vp.dataset.active ? vp.dataset.active.split(',') : [];
      G = diagram(vp.dataset.page);
      const vk = key + '|' + vp.dataset.page + '|' + vp.dataset.active;
      const v = views[vk] || (views[vk] = initial(vp, vp.dataset.focus ? vp.dataset.focus.split(',') : active));
      const g = G;
      toggleMini(vp, v, g);
      apply(vp, v);
      /* Toolbar (bpmn-viewer handleZoomIn/Out): phóng quanh tâm khung. Source cộng/trừ 0,1 mức zoom; sơ đồ ĐTMS mở ở ~0,04 nên nhân 1,25. */
      vp.querySelectorAll('[data-bpz]').forEach((b) => {
        b.addEventListener('pointerdown', (e) => e.stopPropagation());
        b.addEventListener('click', () => {
          if (b.dataset.bpz === 'mini') { v.mini = !v.mini; toggleMini(vp, v, g); apply(vp, v); return; }
          const s2 = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, b.dataset.bpz === 'in' ? v.s * ZOOM_FACTOR : v.s / ZOOM_FACTOR));
          const mx = vp.clientWidth / 2, my = vp.clientHeight / 2;
          v.tx = mx - ((mx - v.tx) * s2) / v.s; v.ty = my - ((my - v.ty) * s2) / v.s; v.s = s2;
          apply(vp, v);
        });
      });
      vp.addEventListener('wheel', (e) => {
        e.preventDefault();
        const r = vp.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
        const s2 = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, v.s * Math.exp(-e.deltaY * 0.0015)));
        v.tx = mx - ((mx - v.tx) * s2) / v.s; v.ty = my - ((my - v.ty) * s2) / v.s; v.s = s2;
        apply(vp, v);
      }, { passive: false });
      vp.addEventListener('pointerdown', (e) => {
        const sx = e.clientX, sy = e.clientY, ox = v.tx, oy = v.ty;
        /* Bấm (không kéo) vào phần tử → chọn phần tử (element.click của bpmn-js); pointer capture làm mất target nên lấy trước. */
        const hit = vp.classList.contains('pick') && e.target.closest('[data-el]');
        let moved = false;
        vp.setPointerCapture(e.pointerId); vp.classList.add('drag');
        const move = (m) => { if (Math.abs(m.clientX - sx) + Math.abs(m.clientY - sy) > 4) moved = true; v.tx = ox + m.clientX - sx; v.ty = oy + m.clientY - sy; apply(vp, v); };
        const up = () => {
          vp.classList.remove('drag'); vp.removeEventListener('pointermove', move); vp.removeEventListener('pointerup', up);
          if (hit && !moved) document.dispatchEvent(new CustomEvent('bpmn-element', { detail: { key, page: vp.dataset.page, id: hit.dataset.el } }));
        };
        vp.addEventListener('pointermove', move); vp.addEventListener('pointerup', up);
      });
    });
  }

  window.BpmnView = { html, mount };
})();
