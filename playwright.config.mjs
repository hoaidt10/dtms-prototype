// Cấu hình Playwright cho prototype ĐTMS. Chạy: npm run test:e2e (trong prototype/dtms).
// Prototype mở bằng file:// nên không cần web server.
import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

// T77 S4: ca e2e cách ly (e2e/quarantine.json) — mặc định bỏ qua; QUARANTINE=only chỉ chạy các ca này.
const Q = JSON.parse(fs.readFileSync(new URL('./e2e/quarantine.json', import.meta.url), 'utf8')).tests;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const qRe = Q.length ? new RegExp(Q.map((t) => esc(t.title) + '$').join('|')) : null;
const qOnly = process.env.QUARANTINE === 'only';

export default defineConfig({
  testDir: 'e2e',
  ...(qRe ? (qOnly ? { grep: qRe } : { grepInvert: qRe }) : {}),
  outputDir: 'test-results',
  fullyParallel: true,
  // CI (GitHub Actions) chạy lại 1 lần ca lỗi — vài ca dài chập chờn khi máy tải nặng (vd b2-backlog Gói thầu).
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    viewport: { width: 1440, height: 900 },
    locale: 'vi-VN',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    // Chromium do Playwright tải về. Đổi sang { channel: 'chrome' } hoặc 'msedge' để dùng trình duyệt có sẵn trên máy.
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
