/*
 * Chạy trong trang prototype: chuyển DOM đã render thành cây gọn để dựng lại layer trong Figma.
 * Nút: [kind, x, y, w, h, props, children|text]
 *   kind 'F' khung (có nền/viền/bóng/bo góc/cắt), 'T' chữ, 'S' icon SVG (markup), 'C' checkbox/radio.
 * Toạ độ tương đối so với khung cha gần nhất. Div chỉ để bố cục (không có gì để vẽ) bị bỏ, con được đưa lên.
 */
window.__serialize = function (rootSel, opts) {
  opts = opts || {};
  const root = document.querySelector(rootSel);
  const hex = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((s) => parseFloat(s));
    const a = p.length > 3 ? p[3] : 1;
    if (a === 0) return null;
    const h = '#' + p.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    return a < 1 ? h + Math.round(a * 255).toString(16).padStart(2, '0') : h;
  };
  const px = (v) => Math.round(parseFloat(v) || 0);
  const r1 = (v) => Math.round(v * 10) / 10;
  const skip = (el, cs) => cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0 || (opts.skip && el.matches(opts.skip));

  function boxProps(el, cs) {
    const p = {};
    let bg = hex(cs.backgroundColor);
    if (!bg && cs.backgroundImage && cs.backgroundImage.includes('gradient')) {
      const m = cs.backgroundImage.match(/rgba?\([^)]+\)/); if (m) bg = hex(m[0]);
    }
    if (bg) p.bg = bg;
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map((s) => (cs['border' + s + 'Style'] !== 'none' ? parseFloat(cs['border' + s + 'Width']) : 0));
    if (sides.some((w) => w > 0)) {
      const colIdx = sides.findIndex((w) => w > 0);
      p.bo = hex(cs['border' + ['Top', 'Right', 'Bottom', 'Left'][colIdx] + 'Color']);
      p.bw = sides.every((w) => w === sides[0]) ? sides[0] : sides;
      if (cs['border' + ['Top', 'Right', 'Bottom', 'Left'][colIdx] + 'Style'] === 'dashed') p.dash = 1;
      if (!p.bo) { delete p.bo; delete p.bw; delete p.dash; }
    }
    const rad = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map((k) => px(cs['border' + k + 'Radius']));
    if (rad.some((v) => v)) p.r = rad.every((v) => v === rad[0]) ? rad[0] : rad;
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      const m = cs.boxShadow.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px(?:\s+(-?[\d.]+)px)?/);
      if (m) p.sh = [hex(m[1]) || '#0000001a', px(m[2]), px(m[3]), px(m[4]), px(m[5] || 0)];
    }
    if (cs.overflow !== 'visible' && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) p.clip = 1;
    if (parseFloat(cs.opacity) < 1) p.op = r1(parseFloat(cs.opacity));
    return p;
  }
  const visual = (p) => p.bg || p.bo || p.sh || p.clip;

  function textProps(cs) {
    const p = { s: px(cs.fontSize), w: parseInt(cs.fontWeight, 10) || 400, c: hex(cs.color) || '#000000' };
    const lh = parseFloat(cs.lineHeight); if (lh) p.lh = r1(lh);
    const f0 = cs.fontFamily.split(',')[0];
    if (/Times|serif/i.test(f0) && !/sans/i.test(f0)) p.ff = 'serif';
    if (cs.fontStyle === 'italic') p.it = 1;
    if (cs.textDecorationLine && cs.textDecorationLine.includes('line-through')) p.st = 1;
    if (cs.textDecorationLine && cs.textDecorationLine.includes('underline')) p.ul = 1;
    if (cs.textTransform === 'uppercase') p.up = 1;
    return p;
  }

  // Tách một text node thành các dòng theo toạ độ thực tế.
  function textLines(node) {
    const txt = node.textContent;
    const range = document.createRange();
    const lines = [];
    let cur = null;
    for (let i = 0; i < txt.length; i++) {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const rs = range.getClientRects();
      if (!rs.length) { if (cur) cur.t += txt[i]; continue; }
      const r = rs[rs.length - 1];
      // Không bắt đầu một dòng bằng khoảng trắng (toạ độ x phải là chữ đầu tiên nhìn thấy).
      if (/\s/.test(txt[i]) && (!cur || Math.abs(r.top - cur.top) > r.height * 0.5)) continue;
      if (!cur || Math.abs(r.top - cur.top) > r.height * 0.5) {
        cur = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, t: txt[i] };
        lines.push(cur);
      } else { cur.t += txt[i]; cur.right = Math.max(cur.right, r.right); cur.bottom = Math.max(cur.bottom, r.bottom); }
    }
    return lines.map((l) => ({ x: l.left, y: l.top, w: l.right - l.left, h: l.bottom - l.top, t: l.t.replace(/\s+$/, '') })).filter((l) => l.t.trim());
  }

  function walk(el, origin, out) {
    const cs = getComputedStyle(el);
    if (skip(el, cs)) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0 && el.tagName !== 'svg') return;
    const tag = el.tagName.toLowerCase();

    if (tag === 'svg') {
      const clone = el.cloneNode(true);
      clone.setAttribute('width', r1(rect.width)); clone.setAttribute('height', r1(rect.height));
      clone.setAttribute('color', cs.color);
      let s = clone.outerHTML.replace(/currentColor/g, hex(cs.color) || '#000000');
      out.push(['S', r1(rect.left - origin.x), r1(rect.top - origin.y), r1(rect.width), r1(rect.height), {}, s]);
      return;
    }
    if (tag === 'input' && (el.type === 'checkbox' || el.type === 'radio')) {
      out.push(['C', r1(rect.left - origin.x), r1(rect.top - origin.y), r1(rect.width), r1(rect.height), { on: el.checked ? 1 : 0, rd: el.type === 'radio' ? 1 : 0 }]);
      return;
    }

    const p = boxProps(el, cs);
    const isCtrl = tag === 'input' || tag === 'textarea' || tag === 'select';
    let target = out, o = origin;
    if (visual(p) || isCtrl || el.dataset.figName) {
      const cls = (el.getAttribute('class') || '').trim().split(/\s+/).slice(0, 2).join(' ');
      p.n = el.dataset.figName || (tag + (cls ? '.' + cls.replace(/ /g, '.') : ''));
      if (el.dataset.figLink) p.link = el.dataset.figLink;
      const node = ['F', r1(rect.left - origin.x), r1(rect.top - origin.y), r1(rect.width), r1(rect.height), p, []];
      out.push(node);
      target = node[6]; o = { x: rect.left, y: rect.top };
    }
    if (isCtrl) {
      let v = tag === 'select' ? (el.options[el.selectedIndex] || {}).text : el.value;
      const ph = !v && el.placeholder;
      if (ph) v = el.placeholder;
      if (v) {
        const tp = textProps(cs); if (ph) tp.c = '#aaabae';
        const pl = parseFloat(cs.paddingLeft), pt = tag === 'textarea' ? parseFloat(cs.paddingTop) : (rect.height - (tp.lh || tp.s * 1.5)) / 2;
        tp.wrap = tag === 'textarea' ? 1 : 0;
        target.push(['T', r1(pl), r1(pt), r1(rect.width - pl - parseFloat(cs.paddingRight) - (tag === 'select' ? 20 : 0)), r1(tp.lh || tp.s * 1.5), tp, v]);
      }
      if (tag === 'select') target.push(['S', r1(rect.width - 26), r1(rect.height / 2 - 6), 12, 12, {}, '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="#5d5e61" stroke-width="1.6" stroke-linecap="round"/></svg>']);
      return;
    }
    const tp = textProps(cs);
    const align = cs.textAlign;
    const onlyText = [...el.childNodes].every((n) => n.nodeType === 3) && el.textContent.trim();
    for (const child of el.childNodes) {
      if (child.nodeType === 3) {
        if (!child.textContent.trim()) continue;
        const lines = textLines(child);
        if (onlyText && lines.length > 1 && align !== 'center' && align !== 'right') {
          // Khối văn bản thuần: một layer chữ tự xuống dòng, dễ sửa trong Figma.
          const x0 = Math.min(...lines.map((l) => l.x)), y0 = lines[0].y;
          const w = rect.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth) - x0;
          const q = Object.assign({ wrap: 1 }, tp);
          target.push(['T', r1(x0 - o.x), r1(y0 - o.y), r1(w + 2), r1(lines[lines.length - 1].y + lines[lines.length - 1].h - y0), q, child.textContent.replace(/\s+/g, ' ').trim()]);
        } else {
          for (const l of lines) target.push(['T', r1(l.x - o.x), r1(l.y - o.y), r1(l.w + 1), r1(l.h), tp, l.t.replace(/\s+/g, ' ').trim()]);
        }
      } else if (child.nodeType === 1) {
        walk(child, o, target);
      }
    }
  }

  const rr = root.getBoundingClientRect();
  const out = [];
  walk(root, { x: rr.left, y: rr.top }, out);
  // Gốc luôn là một khung bao đủ các con (gốc có thể không có gì để vẽ).
  if (out.length === 1 && out[0][0] === 'F' && out[0][1] === 0 && out[0][2] === 0) return out[0];
  return ['F', 0, 0, Math.round(rr.width), Math.round(rr.height), { n: rootSel }, out];
};
