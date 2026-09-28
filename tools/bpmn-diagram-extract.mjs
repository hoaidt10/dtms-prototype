// Sinh js/bpmn-diagram*.js — hình vẽ các trang BPMN của ĐTMS.drawio (toạ độ tuyệt đối, màu, nhãn) để màn Xem BPMN và
// Chi tiết quy trình vẽ lại bằng SVG, không cần bpmn-js/mạng. Mỗi phần tử bấm được (task, cổng, sự kiện) có `el` — thông tin
// cho panel phần tử (như GET .../elements/{id} của source). Chạy: node tools/bpmn-diagram-extract.mjs [trang…] (mặc định: tất cả).
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = new URL('../../../project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio', import.meta.url);
/* Trang → file. MS01 v1.1 giữ tên cũ bpmn-diagram.js (màn Xem BPMN của hồ sơ dùng BPMN_DIAGRAM). */
const PAGES = {
  'MS01 v1.1': { out: 'bpmn-diagram.js', tasks: [...Array.from({ length: 61 }, (_, k) => String(k + 1)), '10a', '10b'] },
  MS01: { out: 'bpmn-diagram-ms01-v1.js' },
  'MS02 ver1.1': { out: 'bpmn-diagram-ms02.js' },
  'MS13-TO BE': { out: 'bpmn-diagram-ms13.js' },
  'MS14-TO BE': { out: 'bpmn-diagram-ms14.js' },
};

const x = readFileSync(SRC, 'utf8');
const xmlDec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#xa;/gi, '\n').replace(/&amp;/g, '&');
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], xmlDec(m[2])]));
const styleOf = (s) => Object.fromEntries((s || '').split(';').filter(Boolean).map((p) => { const k = p.indexOf('='); return k < 0 ? [p, '1'] : [p.slice(0, k), p.slice(k + 1)]; }));
const color = (c) => { if (!c || c === 'none') return c || null; const m = /^light-dark\(([^,]+),/.exec(c); return (m ? m[1] : c).trim(); };
const num = (v, d = 0) => (v == null || v === '' ? d : Number(v));
const r1 = (v) => Math.round(v * 10) / 10;
const plain = (h) => h.replace(/<br\s*\/?>|<\/div>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const lines = (h) => plain(h).split('\n').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);

function extract(PAGE, conf) {
  const i = x.indexOf(`name="${PAGE}"`);
  if (i < 0) throw new Error(`Không thấy trang ${PAGE}`);
  const body = x.slice(i, x.indexOf('</diagram>', i));

  /* Mỗi ô: <object label=… id=…><mxCell …>…</mxCell></object> hoặc <mxCell id=… value=…>…</mxCell>. */
  const cells = {};
  const order = [];
  const put = (a, cellTag, inner) => {
    const c = attrs(cellTag);
    const id = a.id || c.id;
    const geo = /<mxGeometry\b([^>]*?)(\/>|>([\s\S]*?)<\/mxGeometry>)/.exec(inner || '');
    const g = geo ? attrs(geo[1]) : {};
    const gi = geo && geo[3] ? geo[3] : '';
    const pt = (as) => { const m = new RegExp(`<mxPoint\\b([^>]*as="${as}"[^>]*)/>`).exec(gi); return m ? attrs(m[1]) : null; };
    const arr = /<Array as="points">([\s\S]*?)<\/Array>/.exec(gi);
    cells[id] = {
      id, parent: c.parent, style: styleOf(c.style), vertex: c.vertex === '1', edge: c.edge === '1', source: c.source, target: c.target,
      label: a.label != null ? a.label : c.value || '', taskNo: a.TaskNo || null,
      g: { x: num(g.x), y: num(g.y), w: num(g.width), h: num(g.height), relative: g.relative === '1' },
      pts: arr ? [...arr[1].matchAll(/<mxPoint\b([^>]*)\/>/g)].map((m) => { const p = attrs(m[1]); return { x: num(p.x), y: num(p.y) }; }) : [],
      sp: pt('sourcePoint'), tp: pt('targetPoint'), off: pt('offset'),
    };
    order.push(id);
  };
  const objRe = /<(object|UserObject)\b([^>]*)>\s*(<mxCell\b[^>]*?)(\/>|>([\s\S]*?)<\/mxCell>)\s*<\/\1>/g;
  const rest = body.replace(objRe, (m, t, oa, ct, end, inner) => { put(attrs(oa), ct, inner); return ''; });
  for (const m of rest.matchAll(/(<mxCell\b[^>]*?)(\/>|>([\s\S]*?)<\/mxCell>)/g)) put({}, m[1], m[3]);

  /* Toạ độ tuyệt đối: cộng dồn gốc các container cha. */
  const abs = (id) => {
    let ox = 0, oy = 0, p = cells[id] && cells[id].parent;
    while (p && cells[p] && cells[p].vertex) { ox += cells[p].g.x; oy += cells[p].g.y; p = cells[p].parent; }
    return { ox, oy };
  };
  const box = (id) => { const c = cells[id], o = abs(id); return { x: c.g.x + o.ox, y: c.g.y + o.oy, w: c.g.w, h: c.g.h }; };

  const nodes = [];
  const nodeOf = {}; // cell id → node
  for (const id of order) {
    const c = cells[id];
    if (!c.vertex) continue;
    const s = c.style, b = box(id);
    if (s.edgeLabel) continue;
    let k = 'box';
    if (s.swimlane) k = s.horizontal === '0' ? 'lane' : 'pool';
    else if (s.shape === 'mxgraph.bpmn.task') k = 'task';
    else if (s.rhombus) k = 'gw';
    else if (s.ellipse) k = s.shape === 'doubleEllipse' ? 'ev2' : 'ev';
    else if (s.text) k = 'text';
    const label = c.label.trim() === '' || c.label === ' ' ? '' : c.label.replace(/&nbsp;/g, ' ');
    if (k === 'text' && !label.replace(/<[^>]+>/g, '').trim()) continue;
    const n = { k, x: r1(b.x), y: r1(b.y), w: r1(b.w), h: r1(b.h) };
    const fill = color(s.fillColor), stroke = color(s.strokeColor);
    if (fill && fill !== 'none') n.fill = fill;
    if (stroke && stroke !== 'none') n.stroke = stroke;
    if (s.strokeWidth) n.sw = Number(s.strokeWidth);
    if (s.dashed === '1') n.dash = 1;
    if (s.swimlaneFillColor) n.body = color(s.swimlaneFillColor);
    if (s.startSize) n.ss = Number(s.startSize);
    if (s.rounded === '1') n.rd = 1;
    if (label) n.html = label;
    if (s.fontSize) n.fs = Number(s.fontSize);
    if (s.fontColor) n.fc = color(s.fontColor);
    if (s.fontStyle && (Number(s.fontStyle) & 1)) n.b = 1;
    if (s.align) n.al = s.align;
    if (s.verticalAlign) n.va = s.verticalAlign;
    if (s.spacingLeft) n.pl = Number(s.spacingLeft);
    if (s.spacingTop) n.pt = Number(s.spacingTop);
    if (s.taskMarker) n.mk = s.taskMarker;
    const no = c.taskNo || (k === 'task' && (/^(\d{1,2}[ab]?)\.\s/.exec(label.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) || [])[1]);
    if (no && k === 'task') n.t = no;
    nodes.push(n);
    nodeOf[id] = n;
  }

  /* Cạnh: điểm đầu/cuối theo exitX/entryX (hoặc cạnh gần nhất), điểm gãy, bẻ vuông góc với edgeStyle=orthogonal. */
  const edges = [];
  const links = []; // [nguồn, đích] để phân loại sự kiện bắt đầu/kết thúc
  const side = (b, toward) => {
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = toward.x - cx, dy = toward.y - cy;
    if (Math.abs(dx) * b.h >= Math.abs(dy) * b.w) return { x: dx > 0 ? b.x + b.w : b.x, y: cy, hz: true };
    return { x: cx, y: dy > 0 ? b.y + b.h : b.y, hz: false };
  };
  const fixed = (b, fx, fy) => ({ x: b.x + b.w * Number(fx), y: b.y + b.h * Number(fy), hz: Number(fx) === 0 || Number(fx) === 1 });
  for (const id of order) {
    const c = cells[id];
    if (!c.edge) continue;
    if (c.style.dashed !== '1') links.push([nodeOf[c.source], nodeOf[c.target]]);
    const s = c.style, o = abs(id);
    const P = (p) => ({ x: p.x + o.ox, y: p.y + o.oy });
    const wp = c.pts.map(P);
    const sb = c.source && cells[c.source] ? box(c.source) : null, tb = c.target && cells[c.target] ? box(c.target) : null;
    const center = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
    let a, z;
    if (sb) a = s.exitX != null ? fixed(sb, s.exitX, s.exitY) : side(sb, wp[0] || (tb ? center(tb) : c.tp ? P(c.tp) : center(sb)));
    else if (c.sp) a = { ...P(c.sp), hz: true };
    if (tb) z = s.entryX != null ? fixed(tb, s.entryX, s.entryY) : side(tb, wp[wp.length - 1] || (sb ? center(sb) : a));
    else if (c.tp) z = { ...P(c.tp), hz: true };
    if (!a || !z) continue;
    const orth = s.edgeStyle === 'orthogonalEdgeStyle' || s.edgeStyle === 'elbowEdgeStyle';
    let pts = [a, ...wp, z];
    if (orth) {
      const out = [pts[0]];
      for (let j = 1; j < pts.length; j++) {
        const p = out[out.length - 1], q = pts[j];
        if (Math.abs(p.x - q.x) > 0.5 && Math.abs(p.y - q.y) > 0.5) {
          const first = j === 1 ? a.hz : !(out.length > 1 && Math.abs(out[out.length - 2].y - p.y) < 0.5);
          if (j === pts.length - 1 && wp.length === 0) {
            if (a.hz && z.hz) { const mx = (p.x + q.x) / 2; out.push({ x: mx, y: p.y }, { x: mx, y: q.y }); }
            else if (!a.hz && !z.hz) { const my = (p.y + q.y) / 2; out.push({ x: p.x, y: my }, { x: q.x, y: my }); }
            else out.push(a.hz ? { x: q.x, y: p.y } : { x: p.x, y: q.y });
          } else if (j === pts.length - 1) out.push(z.hz ? { x: p.x, y: q.y } : { x: q.x, y: p.y });
          else out.push(first ? { x: q.x, y: p.y } : { x: p.x, y: q.y });
        }
        out.push(q);
      }
      pts = out;
    }
    const e = { p: pts.map((p) => [r1(p.x), r1(p.y)]) };
    const st = color(s.strokeColor);
    if (st && st !== '#455F73') e.c = st;
    if (s.strokeWidth && Number(s.strokeWidth) !== 1.7) e.sw = Number(s.strokeWidth);
    if (s.dashed === '1') e.d = 1;
    if (s.endArrow === 'none') e.na = 1;
    const labels = [];
    if (c.label && c.label.trim()) labels.push({ t: c.label, gx: c.g.relative ? c.g.x : 0, off: c.off });
    for (const lid of order) {
      const l = cells[lid];
      if (l.parent === id && l.style.edgeLabel && l.label.trim()) labels.push({ t: l.label, gx: l.g.x, off: l.off });
    }
    if (labels.length) {
      /* Vị trí nhãn: gx ∈ [-1, 1] dọc đường (0 = giữa) + offset. */
      const seg = []; let tot = 0;
      for (let j = 1; j < pts.length; j++) { const L = Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y); seg.push(L); tot += L; }
      e.l = labels.map((lb) => {
        let d = ((lb.gx + 1) / 2) * tot, j = 0;
        while (j < seg.length - 1 && d > seg[j]) { d -= seg[j]; j++; }
        const f = seg[j] ? d / seg[j] : 0;
        const px = pts[j].x + (pts[j + 1].x - pts[j].x) * f + (lb.off ? num(lb.off.x) : 0);
        const py = pts[j].y + (pts[j + 1].y - pts[j].y) * f + (lb.off ? num(lb.off.y) : 0);
        return [r1(px), r1(py), lb.t.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()];
      });
    }
    edges.push(e);
  }

  /* Chỉ giữ phần một sơ đồ BPMN đã deploy có (như bpmn-js hiển thị): bỏ tiêu đề/chú giải trang, ghi chú N0x/Q0x và
     "Liên quan task" ngoài pool, ghi chú vàng "Trước Start"; task chỉ hiện tên (không số, không Tác nhân/Thực hiện/Biểu mẫu).
     Trang có nhiều pool (MS02) giữ phần nằm trong pool nào đó. */
  const pools = nodes.filter((n) => n.k === 'pool');
  if (!pools.length) throw new Error(`${PAGE}: không có pool`);
  const top = Math.min(...pools.map((p) => p.y));
  const inPool = (n) => pools.some((p) => n.y >= p.y - 0.5 && n.y < p.y + p.h && n.x < p.x + p.w && n.x + n.w > p.x);
  /* Trang MS02 ver1.1 còn bản MS01 cũ nằm khít dưới bản MS02 (cùng toạ độ, khác nhãn) → cùng loại + vị trí thì giữ hình vẽ sau
     (hình nằm trên, đúng cái drawio hiển thị); cạnh trùng hệt thì giữ một. */
  const lastAt = new Map();
  nodes.forEach((n) => lastAt.set(JSON.stringify([n.k, n.x, n.y, n.w, n.h]), n));
  const keep = nodes.filter((n) => {
    if (lastAt.get(JSON.stringify([n.k, n.x, n.y, n.w, n.h])) !== n) return false;
    if (n.k === 'pool') return true;
    if (n.y + n.h <= top) return n.k === 'box' && n.fill === '#DFEAF2';
    if (!inPool(n)) return false;
    if (n.k === 'box' && n.fill === '#FFF0CC') return false;
    return true;
  });
  const edgeSeen = new Set();
  for (let j = edges.length - 1; j >= 0; j--) {
    const sig = JSON.stringify(edges[j]);
    if (edgeSeen.has(sig)) edges.splice(j, 1); else edgeSeen.add(sig);
  }

  /* Thông tin phần tử cho panel Chi tiết quy trình. Tác nhân: dòng "Tác nhân:" của nhãn, không có thì lấy tên lane chứa task. */
  const lanes = keep.filter((n) => n.k === 'lane');
  const laneOf = (n) => {
    const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
    const l = lanes.find((m) => cx >= m.x && cx <= m.x + m.w && cy >= m.y && cy <= m.y + m.h);
    return l && l.html ? lines(l.html).join(' ') : '';
  };
  const outDeg = new Map(), inDeg = new Map();
  const flowNode = (n) => n && ['task', 'gw', 'ev', 'ev2'].includes(n.k);
  for (const [a, b] of links) {
    if (!flowNode(a) || !flowNode(b)) continue;
    outDeg.set(a, (outDeg.get(a) || 0) + 1); inDeg.set(b, (inDeg.get(b) || 0) + 1);
  }
  let gwN = 0, evN = 0;
  const taskIds = new Set();
  for (const n of keep) {
    if (n.k === 'task' && n.html) {
      const ls = lines(n.html);
      n.name = (ls[0] || '').replace(/^\d{1,2}[ab]?\.\s*/, '');
      const el = { name: n.name };
      const pick = (re) => { const l = ls.find((s) => re.test(s)); return l ? l.replace(re, '').trim() : ''; };
      el.actor = pick(/^Tác nhân:\s*/) || laneOf(n);
      el.form = pick(/^Biểu mẫu(?:\/Hồ sơ)?:\s*/).replace(/\.$/, '');
      el.doc = pick(/^Thực hiện:\s*/) || ls.slice(1).filter((s) => !/^(Tác nhân|Biểu mẫu[^:]*|User Task|Service Task)\b/.test(s) && !/^[A-Z0-9_]+$/.test(s)).join(' ');
      const kind = ls.find((s) => /^(User|Service) Task ·/.test(s));
      if (!el.form && kind && /BM/.test(kind)) el.form = kind.replace(/^(User|Service) Task ·\s*/, '');
      el.type = n.mk === 'service' || /Hệ thống/.test(el.actor) || (kind && /^Service/.test(kind)) ? 'serviceTask' : 'userTask';
      let id = 'Activity_' + (n.t || nodes.indexOf(n));
      while (taskIds.has(id)) id += '_';
      taskIds.add(id);
      el.id = id;
      n.el = el;
      delete n.html;
    } else if (n.k === 'gw') {
      const t = n.html ? lines(n.html).join(' ') : '';
      const par = t === '+' || /parallel/i.test(n.html || '');
      n.el = { id: 'Gateway_' + (++gwN), type: par ? 'parallelGateway' : 'exclusiveGateway', name: par || /^[XO]$/i.test(t) ? '' : t };
    } else if (n.k === 'ev' || n.k === 'ev2') {
      const t = n.html ? lines(n.html).join(' ') : '';
      const type = !inDeg.get(n) ? 'startEvent' : !outDeg.get(n) ? 'endEvent' : 'intermediateThrowEvent';
      n.el = { id: (type === 'startEvent' ? 'StartEvent_' : type === 'endEvent' ? 'EndEvent_' : 'Event_') + (++evN), type, name: t };
    }
    if (n.html) n.html = n.html.replace(/\s*\[Q\d+\]/g, '');
  }

  let W = 0, H = 0, X0 = Infinity, Y0 = Infinity;
  for (const n of keep) { X0 = Math.min(X0, n.x); Y0 = Math.min(Y0, n.y); W = Math.max(W, n.x + n.w); H = Math.max(H, n.y + n.h); }
  for (const e of edges) for (const [px, py] of e.p) { X0 = Math.min(X0, px); Y0 = Math.min(Y0, py); W = Math.max(W, px); H = Math.max(H, py); }
  for (const t of conf.tasks || []) if (!keep.some((n) => n.t === t && n.name)) throw new Error(`${PAGE}: thiếu hình task ${t}`);

  const data = { page: PAGE, box: [X0, Y0, W - X0, H - Y0], nodes: keep, edges };
  const alias = PAGE === 'MS01 v1.1' ? `\nwindow.BPMN_DIAGRAM = window.BPMN_DIAGRAMS[${JSON.stringify(PAGE)}];` : '';
  writeFileSync(new URL('../js/' + conf.out, import.meta.url), `/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio, trang "${PAGE}".
   Không sửa tay — chạy lại: node tools/bpmn-diagram-extract.mjs. k: pool/lane/task/gw/ev/ev2/text/box; t = số task; el = phần tử bấm được. */
(window.BPMN_DIAGRAMS = window.BPMN_DIAGRAMS || {})[${JSON.stringify(PAGE)}] = ${JSON.stringify(data)};${alias}
`);
  const tasks = keep.filter((n) => n.k === 'task');
  console.log(`${PAGE.padEnd(12)} → js/${conf.out.padEnd(24)} nodes ${keep.length} · task ${tasks.length} (service ${tasks.filter((n) => n.el.type === 'serviceTask').length}) · edges ${edges.length} · box ${Math.round(W - X0)}×${Math.round(H - Y0)}`);
}

const want = process.argv.slice(2);
for (const [page, conf] of Object.entries(PAGES)) if (!want.length || want.includes(page)) extract(page, conf);
