// Kéo comment của file Figma demo → Markdown, nhóm theo frame (màn hình).
// Cần personal access token có scope `file_comments:read` + `file_content:read`, đặt ở biến môi trường FIGMA_TOKEN
// (không ghi token vào file/repo).
//   FIGMA_TOKEN=... node tools/figma-comments.mjs [fileKey] [out.md]
// Mặc định fileKey = FBFwYisdvDOjvJyRWIQbT3, out = ../../docs/dtms/figma-comments.md
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const KEY = process.argv[2] || 'FBFwYisdvDOjvJyRWIQbT3';
const OUT = process.argv[3] || resolve(here, '../../../docs/dtms/figma-comments.md');
const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) { console.error('Thiếu FIGMA_TOKEN'); process.exit(1); }

async function api(path) {
  const r = await fetch(`https://api.figma.com/v1${path}`, { headers: { 'X-Figma-Token': TOKEN } });
  if (!r.ok) throw new Error(`${r.status} ${path}: ${await r.text()}`);
  return r.json();
}

const { comments } = await api(`/files/${KEY}/comments`);
const roots = comments.filter(c => !c.parent_id);
const replies = id => comments.filter(c => c.parent_id === id).sort((a, b) => a.created_at.localeCompare(b.created_at));

// Tên node được ghim comment + trang chứa nó (lấy cây trang/frame cấp 1 để tra trang).
const ids = [...new Set(roots.map(c => c.client_meta?.node_id).filter(Boolean))];
const names = {};
for (let i = 0; i < ids.length; i += 50) {
  const { nodes } = await api(`/files/${KEY}/nodes?ids=${encodeURIComponent(ids.slice(i, i + 50).join(','))}&depth=1`);
  for (const [id, n] of Object.entries(nodes || {})) names[id] = n?.document?.name || '(node đã xoá)';
}
const { document } = await api(`/files/${KEY}?depth=2`);
const pageOf = {};
for (const p of document.children) for (const f of p.children || []) pageOf[f.id] = p.name;

const groups = new Map();
for (const c of roots) {
  const id = c.client_meta?.node_id;
  const k = id ? `${pageOf[id] ? pageOf[id] + ' / ' : ''}${names[id] || id}` : '(ghim trên canvas, không gắn frame)';
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(c);
}

const d = s => s.slice(0, 10);
let md = `# Comment Figma \`${KEY}\`\n\nKéo lúc ${new Date().toISOString()} — ${roots.length} luồng, `
  + `${roots.filter(c => !c.resolved_at).length} chưa resolve.\n`;
for (const [k, list] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) {
  md += `\n## ${k}\n\n`;
  for (const c of list.sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    md += `- [${c.resolved_at ? 'x' : ' '}] **#${c.order_id ?? ''} ${c.user.handle}** (${d(c.created_at)}): ${c.message.replace(/\n+/g, ' ')}\n`;
    for (const r of replies(c.id)) md += `  - ${r.user.handle} (${d(r.created_at)}): ${r.message.replace(/\n+/g, ' ')}\n`;
  }
}
writeFileSync(OUT, md);
console.log(`${roots.length} luồng comment → ${OUT}`);
