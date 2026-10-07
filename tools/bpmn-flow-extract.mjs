// Sinh js/bpmn-tasks-ms13.js — task + cổng + sự kiện + mũi tên (nguồn → đích, nhãn) của trang BPMN "MS13-TO BE" trong ĐTMS.drawio,
// để viết luồng KĐT (D.flows.MS13) và kiểm lại thứ tự cụm của tài liệu chuẩn bị KĐT §1.2. Cổng trong drawio không có nhãn riêng:
// câu hỏi của cổng là ô chữ đặt cạnh hình thoi → gắn ô chữ gần nhất. Chạy: node tools/bpmn-flow-extract.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = new URL('../../../project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio', import.meta.url);
const PAGES = { 'MS13-TO BE': { key: 'MS13', out: 'bpmn-tasks-ms13.js', count: 64 } };

const x = readFileSync(SRC, 'utf8');
const xmlDec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#xa;/gi, '\n').replace(/&amp;/g, '&');
const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], xmlDec(m[2])]));
const styleOf = (s) => Object.fromEntries((s || '').split(';').filter(Boolean).map((p) => { const k = p.indexOf('='); return k < 0 ? [p, '1'] : [p.slice(0, k), p.slice(k + 1)]; }));
const plain = (h) => h.replace(/<br\s*\/?>|<\/div>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const lines = (h) => plain(h || '').split('\n').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
const one = (h) => lines(h).join(' ');

function extract(PAGE, conf) {
  const i = x.indexOf(`name="${PAGE}"`);
  if (i < 0) throw new Error(`Không thấy trang ${PAGE}`);
  const body = x.slice(i, x.indexOf('</diagram>', i));
  const cells = {};
  const put = (a, cellTag, inner) => {
    const c = attrs(cellTag);
    const id = a.id || c.id;
    const geo = /<mxGeometry\b([^>]*?)(\/>|>)/.exec(inner || '');
    const g = geo ? attrs(geo[1]) : {};
    cells[id] = { id, parent: c.parent, style: styleOf(c.style), vertex: c.vertex === '1', edge: c.edge === '1', source: c.source, target: c.target,
      label: a.label != null ? a.label : c.value || '', g: { x: Number(g.x || 0), y: Number(g.y || 0), w: Number(g.width || 0), h: Number(g.height || 0) } };
  };
  const objRe = /<(object|UserObject)\b([^>]*)>\s*(<mxCell\b[^>]*?)(\/>|>([\s\S]*?)<\/mxCell>)\s*<\/\1>/g;
  const rest = body.replace(objRe, (m, t, oa, ct, end, inner) => { put(attrs(oa), ct, inner); return ''; });
  for (const m of rest.matchAll(/(<mxCell\b[^>]*?)(\/>|>([\s\S]*?)<\/mxCell>)/g)) put({}, m[1], m[3]);

  const center = (id) => {
    const c = cells[id];
    let ox = 0, oy = 0, p = c.parent;
    while (p && cells[p] && cells[p].vertex) { ox += cells[p].g.x; oy += cells[p].g.y; p = cells[p].parent; }
    return { x: c.g.x + ox + c.g.w / 2, y: c.g.y + oy + c.g.h / 2, w: c.g.w, h: c.g.h };
  };
  const lanes = Object.values(cells).filter((c) => c.vertex && c.style.swimlane && c.style.horizontal === '0');
  const laneOf = (id) => {
    let p = cells[id].parent;
    while (p && cells[p]) { if (lanes.includes(cells[p])) return one(cells[p].label); p = cells[p].parent; }
    return '';
  };

  /* Nút luồng: task (số đầu nhãn), cổng G1…, sự kiện S (bắt đầu) / E1… (kết thúc). */
  const ref = {};
  const tasks = {}, gws = {}, evs = {};
  const texts = Object.values(cells).filter((c) => c.vertex && c.style.text && one(c.label));
  const usedText = new Set();
  const near = (id, maxD) => {
    const a = center(id);
    let best = null, bd = maxD;
    for (const t of texts) {
      if (usedText.has(t.id)) continue;
      const b = center(t.id), d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < bd) { bd = d; best = t; }
    }
    if (best) usedText.add(best.id);
    return best ? one(best.label) : '';
  };
  const ordered = Object.values(cells).filter((c) => c.vertex).sort((a, b) => center(a.id).x - center(b.id).x || center(a.id).y - center(b.id).y);
  for (const c of ordered) {
    const s = c.style;
    if (s.shape === 'mxgraph.bpmn.task') {
      /* Nhãn viết liền một dòng (task 64) → tách trước các từ khoá như nhãn nhiều dòng. */
      const ls = lines(c.label).flatMap((v) => v.split(/\s(?=(?:User Task|Service Task|Quy trình con) ·|Tác nhân:|Thực hiện:|Biểu mẫu(?:\/Hồ sơ)?:)/));
      const m = /^(\d{1,2}[ab]?)\.\s*(.*)$/.exec(ls[0] || '');
      if (!m) continue;
      const n = m[1];
      if (tasks[n]) throw new Error(`${PAGE}: task ${n} trùng`);
      const pick = (re) => { const l = ls.find((v) => re.test(v)); return l ? l.replace(re, '').trim() : ''; };
      const kind = ls.find((v) => /^(User Task|Service Task|Quy trình con) ·/.test(v)) || '';
      const who = (kind.split('·')[1] || '').trim();
      const actor = pick(/^Tác nhân:\s*/) || (who && who.length <= 40 && !/BM|Checklist|biểu mẫu|Hồ sơ|Văn bản/i.test(who) ? who : '') || laneOf(c.id);
      const form = pick(/^Biểu mẫu(?:\/Hồ sơ)?:\s*/) || (/BM|Checklist/.test(kind) ? kind.split('·')[1].trim() : '');
      const note = pick(/^Thực hiện:\s*/) || ls.slice(1).filter((v) => v !== kind && !/^(Tác nhân|Biểu mẫu)/.test(v) && !/^[A-Z0-9_]+$/.test(v)).join(' ')
        || (who.length > 40 ? who : '');
      const type = /^Quy trình con/.test(kind) ? 'sub' : s.taskMarker === 'service' ? 'service' : 'user';
      tasks[n] = { name: m[2].trim(), actor, type, form: form.replace(/\.$/, '') || 'Không có', note, lane: laneOf(c.id) };
      ref[c.id] = n;
    } else if (s.rhombus) {
      const id = 'G' + (Object.keys(gws).length + 1);
      const par = one(c.label) === '+';
      gws[id] = { kind: par ? 'and' : 'xor', name: near(c.id, 260) };
      ref[c.id] = id;
    } else if (s.ellipse) {
      ref[c.id] = c.id; // phân loại bắt đầu/kết thúc sau khi có mũi tên
    }
  }
  const edges = [];
  for (const c of Object.values(cells)) {
    if (!c.edge || !ref[c.source] || !ref[c.target]) continue;
    const lb = [one(c.label)].concat(Object.values(cells).filter((l) => l.parent === c.id && l.style.edgeLabel).map((l) => one(l.label))).filter(Boolean).join(' / ');
    edges.push([ref[c.source], ref[c.target], lb]);
  }
  /* Sự kiện: không có mũi tên vào = bắt đầu (S), không có mũi tên ra = kết thúc (E1…); tên = ô chữ gần nhất. */
  let en = 0;
  for (const c of ordered.filter((v) => v.style.ellipse && ref[v.id])) {
    const inn = edges.some((e) => e[1] === c.id), out = edges.some((e) => e[0] === c.id);
    const id = !inn ? 'S' : !out ? 'E' + (++en) : 'I' + (++en);
    evs[id] = { kind: !inn ? 'start' : !out ? 'end' : 'mid', name: near(c.id, 220) };
    edges.forEach((e) => { if (e[0] === c.id) e[0] = id; if (e[1] === c.id) e[1] = id; });
  }
  /* Ô "MS14,15 – Chuyển xử lý…" là hộp chữ, không phải sự kiện — vẫn giữ làm đích (X_MS14). */
  for (const c of Object.values(cells)) {
    if (!c.edge || ref[c.source] == null || ref[c.target] != null) continue;
    const t = cells[c.target];
    if (t && /MS14/.test(one(t.label))) edges.push([ref[c.source], 'X_MS14', Object.values(cells).filter((l) => l.parent === c.id && l.style.edgeLabel).map((l) => one(l.label)).join(' / ')]);
  }
  for (let n = 1; n <= conf.count; n++) if (!tasks[n]) throw new Error(`${PAGE}: thiếu task ${n}`);
  edges.sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'en', { numeric: true }));

  const data = { page: PAGE, count: conf.count, tasks, gateways: gws, events: evs, edges };
  writeFileSync(new URL('../js/' + conf.out, import.meta.url), `/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio, trang "${PAGE}".
   Không sửa tay — chạy lại: node tools/bpmn-flow-extract.mjs. tasks: số task → tên, tác nhân, loại (user/service/sub = quy trình con);
   gateways: G1… (xor/and, câu hỏi = ô chữ cạnh hình thoi); events: S bắt đầu, E1… kết thúc; edges: [nguồn, đích, nhãn]. */
(window.BPMN_FLOWS = window.BPMN_FLOWS || {})[${JSON.stringify(conf.key)}] = ${JSON.stringify(data, null, 1)};
`);
  const nm = (k) => (tasks[k] ? `${k}. ${tasks[k].name.slice(0, 38)}` : gws[k] ? `${k}〈${gws[k].kind === 'and' ? '+' : '×'} ${gws[k].name.slice(0, 40)}〉` : evs[k] ? `${k}(${evs[k].name})` : k);
  console.log(`${PAGE} → js/${conf.out}: task ${Object.keys(tasks).length}, cổng ${Object.keys(gws).length}, sự kiện ${Object.keys(evs).length}, mũi tên ${edges.length}`);
  for (const e of edges) console.log(`  ${nm(e[0])}  →  ${nm(e[1])}${e[2] ? `   [${e[2]}]` : ''}`);
}

for (const [page, conf] of Object.entries(PAGES)) extract(page, conf);
