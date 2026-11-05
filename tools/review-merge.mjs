// T30 — Gộp các tệp comment review do người review gửi về (xuất từ nút Comment review trên prototype).
// Chạy (trong prototype/dtms):
//   node tools/review-merge.mjs <thư-mục-ra> <tệp1.json> [tệp2.json …] [--shots] [--proto <đường dẫn index.html>]
// Ra: <thư-mục-ra>/review-merged.json (nhập lại vào prototype được), review.md (đọc theo màn),
//     với --shots: shots/<id>.png — Playwright nạp ảnh chụp dữ liệu lúc ghim, mở đúng route, khoanh phần tử + ghim.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (k) => { const i = args.indexOf(k); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const shots = args.includes('--shots'); if (shots) args.splice(args.indexOf('--shots'), 1);
const proto = resolve(flag('--proto') || fileURLToPath(new URL('../index.html', import.meta.url)));
const [outDir, ...files] = args;
if (!outDir || !files.length) { console.error('Dùng: node tools/review-merge.mjs <thư-mục-ra> <tệp1.json> [tệp2.json …] [--shots] [--proto index.html]'); process.exit(1); }

/* ---------- Gộp (cùng luật với nút Nhập JSON trên prototype) ---------- */
const comments = new Map(), snapshots = {}, sources = [];
for (const f of files) {
  const data = JSON.parse(readFileSync(f, 'utf8').replace(/^﻿/, ''));
  if (data.format !== 'dtms-prototype-review' || !Array.isArray(data.comments)) { console.error(`Bỏ qua ${f}: không phải tệp comment review prototype ĐTMS.`); continue; }
  sources.push({ file: basename(f), reviewer: data.reviewer, exportedAt: data.exportedAt, build: data.prototype && data.prototype.build, n: data.comments.length });
  Object.assign(snapshots, data.snapshots || {});
  for (const c of data.comments) {
    const old = comments.get(c.id);
    if (!old) { comments.set(c.id, JSON.parse(JSON.stringify(c))); continue; }
    const seen = new Set(old.replies.map((r) => r.at + '|' + r.text));
    (c.replies || []).forEach((r) => { if (!seen.has(r.at + '|' + r.text)) old.replies.push(r); });
    old.replies.sort((a, b) => (a.at < b.at ? -1 : 1));
    if ((c.updatedAt || '') > (old.updatedAt || '')) Object.assign(old, { status: c.status, text: c.text, updatedAt: c.updatedAt });
  }
}
/* Đánh số chung R01, R02… theo thời điểm tạo; giữ số gốc của người review trong ngoặc. */
const list = [...comments.values()].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
list.forEach((c, i) => { c.ref = 'R' + String(i + 1).padStart(2, '0'); });

mkdirSync(outDir, { recursive: true });
const merged = { format: 'dtms-prototype-review', version: 1, readme: JSON.parse(readFileSync(files[0], 'utf8').replace(/^﻿/, '')).readme,
  prototype: { build: 'merged' }, reviewer: 'merged', exportedAt: new Date().toISOString(), sources, comments: list, snapshots };
writeFileSync(join(outDir, 'review-merged.json'), JSON.stringify(merged, null, 1));

/* ---------- Ảnh chụp ---------- */
const shotOf = {};
if (shots) {
  const { chromium } = await import('@playwright/test');
  const b = await chromium.launch();
  mkdirSync(join(outDir, 'shots'), { recursive: true });
  const url = pathToFileURL(proto).href;
  const store = JSON.stringify({ comments: list, snapshots });
  for (const c of list) {
    const vp = (c.where && c.where.viewport) || { w: 1440, h: 900 };
    const page = await b.newPage({ viewport: { width: vp.w, height: vp.h } });
    try {
      await page.goto(url + '#/viec-cua-toi');
      await page.evaluate(([snap, st]) => { localStorage.clear(); Object.entries(snap || {}).forEach(([k, v]) => localStorage.setItem(k, v)); localStorage.setItem('dtms-review-v1', st); },
        [snapshots[c.snapshot], store]);
      await page.goto(url + c.where.route);
      await page.reload();
      await page.waitForTimeout(400);
      const found = await page.evaluate(([id, top]) => {
        const m = document.querySelector('.main'); if (m) m.scrollTop = top || 0;
        const c = window.Review.data().comments.find((x) => x.id === id);
        const el = window.Review.locate(c);
        if (!el) return false;
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect(), box = document.createElement('div');
        Object.assign(box.style, { position: 'fixed', left: r.left - 3 + 'px', top: r.top - 3 + 'px', width: r.width + 6 + 'px', height: r.height + 6 + 'px',
          outline: '3px solid #7B3FE4', borderRadius: '3px', zIndex: 999, pointerEvents: 'none' });
        document.body.appendChild(box);
        return true;
      }, [c.id, c.where.scrollTop]);
      await page.waitForTimeout(150);
      const f = `shots/${c.ref}.png`;
      await page.screenshot({ path: join(outDir, f) });
      shotOf[c.id] = { f, found };
    } catch (e) { shotOf[c.id] = { f: null, err: e.message }; }
    await page.close();
  }
  await b.close();
}

/* ---------- review.md ---------- */
const md = [];
const q = (s) => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fmt = (iso) => (iso ? iso.replace('T', ' ').slice(0, 16) : '');
const open = list.filter((c) => c.status !== 'resolved').length;
md.push('# Comment review prototype ĐTMS — tổng hợp', '',
  `Gộp ${files.length} tệp, ${list.length} comment (${open} chưa xử lý). Tạo lúc ${fmt(new Date().toISOString())} bằng \`tools/review-merge.mjs\`.`, '',
  '| Tệp | Người review | Xuất lúc | Bản prototype | Số comment |', '|---|---|---|---|---|',
  ...sources.map((s) => `| ${q(s.file)} | ${q(s.reviewer)} | ${fmt(s.exportedAt)} | ${q(s.build)} | ${s.n} |`), '');
const keyOf = (c) => (c.where.screen && c.where.screen.scr ? `${c.where.screen.scr} · ${c.where.screen.name || c.where.title}` : c.where.title || c.where.route);
const groups = new Map();
list.forEach((c) => { const k = keyOf(c); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); });
md.push('## Mục lục', '', ...[...groups].map(([k, cs]) => `- ${k} — ${cs.length} comment (${cs.filter((c) => c.status !== 'resolved').length} chưa xử lý)`), '');
for (const [k, cs] of groups) {
  md.push(`## ${k}`, '');
  for (const c of cs) {
    const w = c.where, t = c.target, r = w.record || {};
    md.push(`### ${c.ref} · ${c.type} · ${c.status === 'resolved' ? '✅ Đã xử lý' : '🟣 Chưa xử lý'} — ${c.author} (#${c.no}, ${fmt(c.createdAt)})`, '',
      ...c.text.split('\n').map((l) => '> ' + l), '',
      '| Ở đâu | |', '|---|---|',
      `| Màn | ${q([w.app, w.menu].filter(Boolean).join(' › '))} · **${q(w.title)}** (\`${q(w.route)}\`) |`,
      w.tab ? `| Tab | ${q(w.tab)} |` : null,
      w.dialog ? `| Hộp thoại | ${q(w.dialog)} |` : null,
      `| Vai | ${q(w.persona && w.persona.name)} — ${q(w.persona && w.persona.role)} |`,
      (r.dxms || r.hoSo || r.kdt) ? `| Hồ sơ luồng demo | ${q([r.dxms, r.hoSo, r.kdt].filter(Boolean).join(' / '))}${r.process ? ' · ' + q(r.process) : ''}${r.status ? ' · ' + q(r.status) : ''} |` : null,
      w.task ? `| Bước BPMN | ${w.task.process ? q(w.task.process) + ' ' : ''}${q(w.task.no)} — ${q(w.task.name)}${w.task.actor ? ' (' + q(w.task.actor) + ')' : ''} |` : null,
      w.demoSet ? `| Bộ demo | ${q(w.demoSet)} |` : null,
      `| Phần tử | \`<${t.tag}>\` “${q(t.text)}”${t.label ? ' · ' + q(t.label) : ''}${t.section ? ' · khối **' + q(t.section) + '**' : ''} |`,
      `| Chữ xung quanh | ${q(c.context)} |`,
      shotOf[c.id] ? `| Ảnh | ${shotOf[c.id].f ? `![${c.ref}](${shotOf[c.id].f})${shotOf[c.id].found ? '' : ' ⚠ không tìm lại được phần tử (màn đã đổi?) — ảnh là màn lúc mở route'}` : 'lỗi chụp: ' + q(shotOf[c.id].err)} |` : null,
      '');
    if (c.replies.length) md.push('**Trả lời**', '', ...c.replies.map((x) => `- ${x.author} (${fmt(x.at)}): ${x.text.replace(/\n/g, ' ')}`), '');
  }
}
writeFileSync(join(outDir, 'review.md'), md.filter((l) => l !== null).join('\n'));
console.log(`Gộp ${list.length} comment từ ${sources.length} tệp → ${join(outDir, 'review.md')}${shots ? ` + ${Object.values(shotOf).filter((s) => s.f).length} ảnh` : ''}`);
