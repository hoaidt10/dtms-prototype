// Điều khiển Chrome headless qua DevTools Protocol (không cần Playwright). Dùng chung cho e2e.mjs và capture.mjs.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const INDEX = new URL('../index.html', import.meta.url).href;
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch({ width = 1440, height = 900, port = 9333 } = {}) {
  const profile = join(tmpdir(), `dtms-proto-chrome-${port}`);
  mkdirSync(profile, { recursive: true });
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${width},${height}`, 'about:blank']);
  let url;
  for (let i = 0; i < 60 && !url; i++) {
    try { const j = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); url = (j.find((x) => x.type === 'page') || {}).webSocketDebuggerUrl; } catch { /* chưa sẵn sàng */ }
    if (!url) await sleep(250);
  }
  if (!url) throw new Error('Không khởi động được Chrome');
  const ws = new WebSocket(url);
  await new Promise((r) => { ws.onopen = r; });
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(JSON.stringify(d.params.args.map((a) => a.value || a.description)));
  };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || JSON.stringify(r.result.exceptionDetails));
    return r.result.result.value;
  };
  const shot = async (file, full) => {
    let clip;
    if (full) { const h = await ev(`Math.max(document.querySelector('.main')?.scrollHeight || 0, ${height}) + 60`); clip = { x: 0, y: 0, width, height: h, scale: 1 }; await send('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(150); }
    const r = await send('Page.captureScreenshot', clip ? { format: 'png', clip } : { format: 'png' });
    writeFileSync(file, Buffer.from(r.result.data, 'base64'));
    if (full) await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  };
  const open = async (hash = '') => { await send('Page.navigate', { url: INDEX + hash }); await sleep(800); };
  return { ev, send, shot, open, errors, close: () => { ws.close(); proc.kill(); } };
}
