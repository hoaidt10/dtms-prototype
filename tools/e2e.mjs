// Chạy kịch bản demo §2.4 bằng click thật trên Chrome headless, chụp mỗi màn một ảnh, rồi thử 4 nhánh phụ.
// Chạy: node prototype/dtms/tools/e2e.mjs [thư-mục-ảnh]
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { launch, sleep } from './cdp.mjs';

const out = process.argv[2] || join(process.cwd(), 'e2e-shots');
mkdirSync(out, { recursive: true });
const b = await launch();
const { ev, shot, open, errors } = b;
const fails = [];
const check = (cond, msg) => { if (!cond) fails.push(msg); };
const click = (sel) => ev(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return false; e.click(); return true; })()`);
const clickText = (sel, text) => ev(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => x.textContent.includes(${JSON.stringify(text)})); if (!e) return false; e.click(); return true; })()`);
const lastToast = () => ev(`[...document.querySelectorAll('.toast')].map((t) => t.className + '|' + t.textContent).pop() || ''`);
const state = async () => JSON.parse(await ev(`JSON.stringify({ s: Flow.state.status, p: Flow.state.persona, mine: Flow.tokensFor(Flow.state.persona).map((t) => ({ id: t.id, task: t.task })), any: Flow.state.tokens.map((t) => t.who) })`));

// Bấm nút hành động chính; nếu mở hộp thoại lý do / trình ký thì điền và xác nhận.
async function primary(label) {
  const ok = label ? await clickText('.task-acts [data-act]', label) : await click('.task-acts [data-act].primary');
  if (!ok) return false;
  await sleep(120);
  for (let i = 0; i < 2; i++) {
    if (!(await ev(`!!document.querySelector('.overlay')`))) break;
    await ev(`(() => { const t = document.querySelector('.overlay textarea'); if (t) t.value = 'Nội dung thử'; (document.querySelector('.overlay #ok') || document.querySelector('.overlay #go')).click(); })()`);
    await sleep(150);
  }
  return true;
}

await open('#/viec-cua-toi');
await ev(`localStorage.clear()`);
await open('#/viec-cua-toi');
await shot(join(out, 'SCR-01.png'));

const seen = new Set();
let steps = 0;
while (steps++ < 200) {
  const s = await state();
  if (s.s !== 'running') break;
  if (!s.mine.length) { await click('#who'); await sleep(60); await click(`.menu-pop [data-persona="${s.any[0]}"]`); await sleep(100); continue; }
  const tok = s.mine[0];
  await ev(`location.hash = '#/task/${tok.id}'`); await sleep(150);
  const scr = await ev(`document.querySelector('.page-head .scr-id')?.textContent`);
  const key = `${scr}-t${String(tok.task).padStart(2, '0')}`;
  if (!seen.has(key)) { seen.add(key); await shot(join(out, `${key}.png`), true); }
  // Điều kiện trước của kịch bản
  if (tok.task === 4) await click('[data-ai-all]');
  if (tok.task === 10 && Number(await ev('Flow.doneCount(9)')) === 1) {
    await primary(); check((await lastToast()).includes('Không đạt'), 'T10 lần 1 phải chặn "Báo giá đạt"');
    await primary('Không đạt'); await sleep(100); continue;
  }
  if (tok.task === 11 && !(await ev('!!Flow.ui.necessity'))) {
    await primary(); check((await lastToast()).includes('Fail'), 'T11 phải báo AI Fail khi thiếu Sự cần thiết');
    await ev(`location.hash = '#/task/${tok.id}'`); await sleep(100);
    await shot(join(out, 'SCR-08-t11-ai-fail.png'), true);
    await click('[data-ui="necessity"]'); await sleep(100);
  }
  if (tok.task === 14) {
    await primary(); check((await lastToast()).includes('BM-03'), 'T14 phải yêu cầu đính kèm BM-03');
    await click('[data-ui="bm03File"]'); await sleep(100);
  }
  if (tok.task === 30) await click('[data-ui="minutesFile"]');
  if (tok.task === 48) await click('[data-ui="bm06File"]');
  await sleep(60);
  const ok = await primary();
  if (!ok) { fails.push(`Kẹt ở task ${tok.task}`); break; }
}
const fin = JSON.parse(await ev(`JSON.stringify({ s: Flow.state.status, kpi: Flow.kpiUsed(), round: Flow.state.vars.round, q9: Flow.doneCount(9) })`));
check(fin.s === 'approved', 'Luồng chính phải tới phê duyệt');
check(fin.q9 === 2, 'YCBG phải gửi 2 lần');
check(fin.kpi <= 20, `KPI ${fin.kpi} phải ≤ 20 NLV`);
for (const [h, name] of [['#/ho-so', 'SCR-20'], ['#/ho-so/bpmn', 'SCR-20-bpmn'], ['#/dxms', 'SCR-02'], ['#/chon-vai', 'SCR-00'], ['#/cho-chot', 'cho-chot'], ['#/ph/goi-thau', 'phan-he']]) {
  await ev(`location.hash = '${h}'`); await sleep(200); await shot(join(out, `${name}.png`), true);
}

// Nhánh phụ
const branches = [[0, 12, 13], [1, 26, 28], [2, 39, 38], [3, 57, 22]]; // nhánh 2: sau 39 vẫn chờ Tài chính (38), rồi mới đi 40 → 54
for (const [i, from, expect] of branches) {
  await click('#demo'); await sleep(80); await click(`[data-branch="${i}"]`); await sleep(250);
  const s = await state();
  check(s.mine.some((t) => t.task === from), `Nhánh ${i}: phải mở task ${from}`);
  if (i === 2) { await primary('Không báo cáo'); await sleep(100); check(await ev('Flow.state.vars.reportTD === false'), 'Nhánh 2: reportTD phải = false'); }
  else if (i === 0) await primary('Không đồng ý');
  else if (i === 1) await primary('Không chấp nhận');
  else await primary('Yêu cầu hoàn chỉnh');
  await sleep(150);
  const hit = await ev(`Flow.taskStatus(${expect}) !== 'todo' || Flow.state.tokens.some((t) => t.task === ${expect})`);
  check(hit, `Nhánh ${i}: phải tới task ${expect}`);
  if (i === 1) { await ev(`location.hash = '#/task/' + Flow.state.tokens[0].id`); await sleep(150); await shot(join(out, 'SCR-14-t29-hop.png'), true); }
}
// Hộp thoại trình ký
await click('#demo'); await sleep(80); await click('[data-scene="3"]'); await sleep(250);
console.log(JSON.stringify({ steps, screens: seen.size, fin, fails, errors }, null, 1));
b.close();
process.exit(fails.length || errors.length ? 1 : 0);
