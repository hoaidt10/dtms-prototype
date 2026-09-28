// Cấu hình Playwright cho prototype ĐTMS. Chạy: npm run test:e2e (trong prototype/dtms).
// Prototype mở bằng file:// nên không cần web server.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  fullyParallel: true,
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
