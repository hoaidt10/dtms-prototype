// Sinh js/bpmn-tasks.js từ BPMN chuẩn: project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio, trang "MS01 v1.1".
// Mỗi nhãn task có dạng "NN. Tên Tác nhân: … Thực hiện: … Biểu mẫu[/Hồ sơ]: …". Chạy: node tools/bpmn-extract.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = new URL('../../../project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio', import.meta.url);
const PAGE = 'MS01 v1.1';
const OUT = new URL('../js/bpmn-tasks.js', import.meta.url);

/* 10a, 10b: nhánh không khớp quy trình (chốt 2026-09-28, N08), đánh số phụ để không đánh số lại 61 task. */
/* Số task tương ứng trong bản 58 task cũ (MS01_01_TO_BE_VHT), đối chiếu theo tên. Trống = task mới. */
const OLD = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '', 12: '11', 13: '12', 14: '13',
  15: '15', 16: '14', 17: '', 18: '15', 19: '16', 20: '17', 21: '18', 22: '19', 23: '20', 24: '', 25: '21', 26: '22', 27: '23', 28: '24',
  29: '27', 30: '28', 31: '29', 32: '30', 33: '31', 34: '32', 35: '33', 36: '34', 37: '35', 38: '', 39: '', 40: '', 41: '36', 42: '37',
  43: '40', 44: '42', 45: '41', 46: '', 47: '44', 48: '39', 49: '46', 50: '47', 51: '48', 52: '49', 53: '50', 54: '51', 55: '52', 56: '53',
  57: '54', 58: '55', 59: '56', 60: '57', 61: '58' };

// Nhãn drawio là HTML đã escape một lần trong thuộc tính XML: giải mã XML → bỏ thẻ HTML → giải mã thực thể HTML.
const ent = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const clean = (v) => ent(ent(v).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const x = readFileSync(SRC, 'utf8');
const i = x.indexOf(`name="${PAGE}"`);
if (i < 0) throw new Error(`Không thấy trang ${PAGE}`);
const body = x.slice(i, x.indexOf('</diagram>', i));

const tasks = {};
for (const m of body.matchAll(/(?:value|label)="([^"]+)"/g)) {
  const v = clean(m[1]);
  const t = /^(\d{1,2}[ab]?)\. (.+?) Tác nhân: (.+?) Thực hiện: (.+)$/.exec(v);
  if (!t) continue;
  const n = t[1];
  let doing = t[4], form = 'Không có';
  const f = /^(.*?)\s*Biểu mẫu(?:\/Hồ sơ)?: (.+)$/.exec(doing);
  if (f) { doing = f[1]; form = f[2].replace(/\.$/, ''); }
  if (tasks[n]) throw new Error(`Task ${n} trùng`);
  tasks[n] = { name: t[2].trim(), actor: t[3].trim(), type: /Hệ thống/.test(t[3]) ? 'service' : 'user', form, old: OLD[n] || '', note: doing.trim() };
}
for (const n of [...Array.from({ length: 61 }, (_, k) => String(k + 1)), '10a', '10b']) if (!tasks[n]) throw new Error(`Thiếu task ${n}`);

writeFileSync(OUT, `/* SINH TỰ ĐỘNG từ project-knowledge/03. Thiết kế (Tài liệu BA)/BPMN/ĐTMS.drawio, trang "${PAGE}" (61 task + 10a, 10b).
   Không sửa tay — chạy lại: node tools/bpmn-extract.mjs. \`old\` = số task ở bản 58 task cũ (MS01_01_TO_BE_VHT), trống = task mới. */
window.BPMN_SOURCE = ${JSON.stringify({ file: 'ĐTMS.drawio', page: PAGE, count: 61, extra: ['10a', '10b'] })};
window.BPMN_TASKS = ${JSON.stringify(tasks, null, 1)};
`);
console.log(Object.entries(tasks).map(([n, t]) => `${n.padStart(2)} ${t.type.padEnd(7)} ${t.actor.slice(0, 26).padEnd(26)} ${t.name.slice(0, 60)}`).join('\n'));
