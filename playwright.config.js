import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5001',
    browserName: 'chromium',
    channel: process.platform === 'win32' ? 'msedge' : undefined,
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:5001/examples/preview.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
