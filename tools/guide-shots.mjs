// T33 B1 — chụp ảnh cho HUONG-DAN.html (plan docs/dtms/T33-goi-prototype-khach-ke-hoach.md §3.2).
//   node tools/guide-shots.mjs            → huong-dan/<id>.jpg + tools/release/guide-shots.json (tiêu đề, vai, nút thật của từng màn)
// Menu theo phương án Gộp (khách chọn, như bản gửi — meta proto-menu). Chụp ở ?capture=1 (ẩn nút (i), công cụ demo, toast) trừ ảnh công cụ demo; hồ sơ demo ĐXMS-2026-0117.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'huong-dan');
fs.mkdirSync(OUT, { recursive: true });
const URL0 = pathToFileURL(path.join(ROOT, 'index.html')).href;

/* task: tua tới bước rồi mở màn việc của người được giao; form: mở hộp thoại nút chính; scene: Flow.jumpToScene; branch: nhánh phụ theo tên. */
const SHOTS = [
  { id: 'viec-cua-toi', hash: '#/viec-cua-toi', who: 'minh' },
  { id: 'cong-cu-demo', hash: '#/viec-cua-toi', who: 'minh', nocap: true, click: '#demo' },
  { id: 'luong-danh-sach', hash: '#/luong', who: 'minh' },
  { id: 'luong-them-moi', hash: '#/luong/create', who: 'minh' },
  { id: 't01-can-cu', task: 1, form: true },
  { id: 't05-boc-tach', task: 5, form: true, scrollText: ['.lf-sub-h h4', 'Bóc tách'] },
  { id: 'kho-ra-soat', scene: '1b', after: '#/ra-soat-kho' },
  /* Review nhi 06/11 #21: bước 7 mở thẳng màn Rà soát tồn kho (= ảnh kho-ra-soat) → chụp việc Chỉ huy Kho duyệt (7.1). */
  { id: 't07-1-chi-huy-kho', task: '7.1' },
  { id: 't08-ycbg', task: 8, form: true, scrollTo: '[data-ef-field="dkThanhToan"]' },
  /* Review nhi 06/11 #2, #3 (P-219, D.quoteManual): bỏ card Đánh giá báo giá — chụp hộp thoại Báo giá đạt và việc Chỉ huy Thầu duyệt (10.1). */
  { id: 't10-bao-gia', task: 10, form: true },
  { id: 't10-1-chi-huy-thau', task: '10.1' },
  { id: 't12-du-thao', task: 12 },
  { id: 't13-chi-huy', task: 13 },
  { id: 't17-ttms-cqcm', task: 17 },
  { id: 't19-tham-dinh', task: 19 },
  { id: 't28-giai-trinh', task: 28, form: true },
  { id: 't42-bm05', task: 42 },
  { id: 't60-phe-duyet', task: 60 },
  /* T34 D-95: tab Tài liệu & văn bản (Danh sách tài liệu + Văn bản đầu ra) của màn việc. */
  { id: 't60-tai-lieu', task: 60, tab: 'tai-lieu', full: true },
  { id: 'bpmn', task: 10, bpmnBtn: true },
  /* T33 B2: tour 3 ở bước 10 Tổng hợp báo giá (không ở ?capture=1 vì capture ẩn tour). */
  { id: 'tour', nocap: true, tour: [3, 4] },
];

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
const info = {};
const go = async (cap, hash) => { await page.goto('about:blank'); await page.goto(`${URL0}${cap ? '?capture=1' : ''}${hash}`); await page.waitForSelector('#app .sidebar'); };
await go(true, '#/viec-cua-toi');
await page.evaluate(() => localStorage.clear());

for (const s of SHOTS) {
  await go(!s.nocap, '#/viec-cua-toi');
  await page.evaluate(() => { localStorage.clear(); Luong.setMode('gop'); Flow.reset(); Flow.setPersona('minh'); });
  let who = s.who || 'minh';
  if (s.task != null) {
    who = await page.evaluate((n) => { Flow.jumpTo(n, 'minh'); const t = Flow.state.tokens.find((k) => k.task === n); Flow.setPersona(t.who); return t.who; }, s.task);
    const hash = await page.evaluate((n) => '#/task/' + Flow.state.tokens.find((k) => k.task === n).id, s.task);
    await page.evaluate((h) => { location.hash = h; }, hash);
  } else if (s.scene) {
    who = await page.evaluate((n) => { Flow.jumpToScene(n); return Flow.state.persona; }, s.scene);
    await page.evaluate((h) => { location.hash = h; }, s.after);
  } else if (s.tour) {
    await page.evaluate(([n, k]) => { Tour.start(n, { force: true }); for (let i = 1; i < k; i++) document.querySelector('.tour-pop [data-tour="next"]').click(); }, s.tour);
    await page.waitForTimeout(600);
    who = await page.evaluate(() => Flow.state.persona);
  } else if (s.branch) {
    await go(false, '#/viec-cua-toi');
    await page.locator('#demo').click();
    await page.locator('[data-branch]', { hasText: s.branch }).click();
    await page.waitForURL(/#\/task\//);
    await page.evaluate(() => document.body.classList.add('cap'));
    who = await page.evaluate(() => Flow.state.persona);
  } else {
    await page.evaluate((w) => Flow.setPersona(w), who);
    await page.evaluate((h) => { location.hash = h; }, s.hash);
  }
  await page.waitForTimeout(300);
  if (s.click) await page.locator(s.click).click();
  if (s.tab) { await page.locator(`[data-ltab="${s.tab}"]`).click(); await page.waitForTimeout(300); }
  const acts = await page.locator('.task-acts [data-act]').allTextContents();
  const title = (await page.locator('.pg-title').first().textContent().catch(() => '')) || '';
  /* Bước có form ngay trên màn (Lập / bóc tách ĐXMS, v0.2) không có nút [data-act] mở hộp thoại → chụp nguyên màn. */
  const modal = s.form && (await page.locator('.task-acts [data-act].primary').count()) > 0;
  /* Nút chính có thể mở hộp thoại eForm hoặc chuyển sang màn riêng (bước 7 → Rà soát kho). */
  if (modal) { await page.locator('.task-acts [data-act].primary').first().click(); await page.waitForSelector('.vmodal.ef', { timeout: 3000 }).catch(() => {}); await page.waitForTimeout(300); }
  if (s.scrollTo) await page.locator(modal ? `.vmodal.ef ${s.scrollTo}` : s.scrollTo).first().scrollIntoViewIfNeeded().catch(() => {});
  if (s.scrollTo && !modal) await page.evaluate((q) => { const el = document.querySelector(q); if (el) el.scrollIntoView({ block: 'start' }); }, s.scrollTo);
  if (s.scrollText) await page.evaluate(([q, t]) => { const el = [...document.querySelectorAll(q)].find((e) => e.textContent.trim().startsWith(t) || e.textContent.includes(t)); if (el) el.closest('.lf-sub-h').scrollIntoView({ block: 'center' }); }, s.scrollText);
  await page.waitForTimeout(200);
  const formTitle = modal ? (await page.locator('.vmodal.ef .modal-h, .vmodal.ef h3').first().textContent().catch(() => '')) : '';
  if (s.bpmnBtn) { await page.locator('button, a', { hasText: 'Xem BPMN' }).first().click(); await page.waitForTimeout(800); }
  if (s.el) await page.addStyleTag({ content: '.topbar{visibility:hidden!important}' });
  if (s.el) await page.locator(s.el).first().screenshot({ path: path.join(OUT, s.id + '.jpg'), type: 'jpeg', quality: 72 });
  else await page.screenshot({ path: path.join(OUT, s.id + '.jpg'), type: 'jpeg', quality: 72, fullPage: !!s.full });
  info[s.id] = { who, persona: await page.evaluate((w) => { const p = UI.persona(w); return `${p.name} — ${p.role}`; }, who), title: title.trim(), acts: acts.map((a) => a.trim()), formTitle: (formTitle || '').trim() };
}
await b.close();
fs.writeFileSync(path.join(ROOT, 'tools', 'release', 'guide-shots.json'), JSON.stringify(info, null, 1));
const total = fs.readdirSync(OUT).reduce((a, f) => a + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${SHOTS.length} ảnh → huong-dan/ (${(total / 1048576).toFixed(2)} MB)`);
if (errs.length) { console.error('Lỗi trang:', [...new Set(errs)]); process.exit(1); }
