import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 1,
  use: { browserName: 'chromium', launchOptions: { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }, baseURL: 'http://127.0.0.1:3000' },
  webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:3000', reuseExistingServer: true },
});
