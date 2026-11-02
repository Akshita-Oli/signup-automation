import { defineConfig, devices } from '@playwright/test';
import { env } from './automation/config/env';

export default defineConfig({
  testDir: './automation/tests',
  outputDir: './test-results',
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: 'reports/playwright-report', open: 'never' }]],
    use: {
    baseURL: env.baseUrl,
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
     launchOptions: { slowMo: env.slowMo },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});