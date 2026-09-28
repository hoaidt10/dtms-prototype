// Nén JSON serialize thành dạng gọn để nhét vào một lần gọi use_figma.
// Dạng ra: { s: [style...], v: [svg...], m: [tên khung...], t: node }
//   node F: [0,x,y,w,h,styleIdx,nameIdx,[con]] · T: [1,x,y,w,h,styleIdx,"chữ"] · S: [2,x,y,w,h,svgIdx] · C: [3,x,y,w,h,on,radio]
// Chạy: node compact.mjs <thư-mục-capture>  → ghi <file>.c.json cạnh file gốc.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function compact(tree) {
  const S = [], V = [], M = [];
  const idx = (arr, v) => { const k = typeof v === 'string' ? v : JSON.stringify(v); let i = arr.findIndex((x) => (typeof x === 'string' ? x : JSON.stringify(x)) === k); if (i < 0) { arr.push(v); i = arr.length - 1; } return i; };
  const R = Math.round;
  const walk = (n) => {
    const [k, x, y, w, h, p, c] = n;
    if (k === 'F') {
      const { n: name, ...st } = p;
      return [0, R(x), R(y), R(w), R(h), idx(S, st), idx(M, name || ''), c.map(walk)];
    }
    if (k === 'T') return [1, R(x), R(y), Math.ceil(w), R(h), idx(S, p), c];
    if (k === 'S') return [2, R(x), R(y), R(w), R(h), idx(V, c.replace(/\s+/g, ' ').replace(/ class="[^"]*"/g, '').replace(/ aria-[a-z]+="[^"]*"/g, ''))];
    return [3, R(x), R(y), R(w), R(h), p.on, p.rd];
  };
  const t = walk(tree);
  return { s: S, v: V, m: M, t };
}

if (process.argv[2]) {
  const dir = process.argv[2];
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json') && !x.endsWith('.c.json') && x !== 'manifest.json')) {
    const d = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const o = {};
    if (d.main) { o.main = compact(d.main); if (d.overlay) o.overlay = compact(d.overlay); }
    if (d.topbar) { o.topbar = compact(d.topbar); o.sidebar = compact(d.sidebar); }
    const s = JSON.stringify(o);
    writeFileSync(join(dir, f.replace('.json', '.c.json')), s);
    console.log(f.padEnd(26), String(s.length).padStart(6));
  }
}
