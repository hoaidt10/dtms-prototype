// Chụp ảnh nhanh vài trạng thái để kiểm tra bằng mắt. Chạy: node tools/shots-check.mjs <thư-mục-ra>
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = process.argv[2] || 'shots';
mkdirSync(out, { recursive: true });
const INDEX = new URL('../index.html', import.meta.url).href;
const until = (task) => `(() => { let g = 0; while (!Flow.state.tokens.some((k) => k.task === ${task}) && g++ < 300) { const t = Flow.state.tokens[0]; Flow.complete(t.id, Flow.mainChoice(t.task), 'x'); } })()`;
const go = (task, cqcm) => `location.hash = '#/task/' + Flow.state.tokens.find((k) => k.task === ${task}${cqcm ? ` && k.cqcm === '${cqcm}'` : ''}).id`;
const cases = [
  ['scr22', [`Flow.jumpTo(17, 'lan', {})`, go(17)]],
  ['scr12b', [`Flow.jumpTo(28, 'minh', {})`, until(26), `Flow.setPersona('minh')`, go(26)]],
  ['scr17a', [`Flow.jumpTo(46, 'hoa', {})`, go(46, 'PC')]],
  ['scr16c', [`Flow.jumpTo(48, 'lan', {})`, go(48)]],
  ['timeline', [`Flow.jumpToScene(9)`, `location.hash = '#/ho-so'`]],
];
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(INDEX + '#/viec-cua-toi');
await page.evaluate(() => localStorage.clear());
await page.reload();
for (const [name, steps] of cases) {
  for (const s of steps) await page.evaluate(s);
  await page.waitForTimeout(250);
  await page.evaluate(() => document.querySelectorAll('.toast-wrap').forEach((t) => t.remove()));
  const h = await page.evaluate(() => document.querySelector('.main').scrollHeight + 60);
  await page.setViewportSize({ width: 1440, height: Math.min(h, 2600) });
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.setViewportSize({ width: 1440, height: 900 });
}
console.log('errors', errors);
await b.close();
