import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const isCI = !!process.env.CI;
const authFile = 'auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  globalTimeout: isCI ? 45 * 60_000 : undefined,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
    ...(isCI ? [['github']] : [])
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.testerrank.com',
    headless: true,
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/
    },
    {
      name: 'health-check',
      testMatch: /health\.check\.js/
    },
    {
      name: 'chromium',
      testIgnore: ['**/login/**', /.*\.setup\.js/, /health\.check\.js/],
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      dependencies: ['health-check', 'setup']
    },
    {
      // Login tests must start from an unauthenticated session
      name: 'chromium-login',
      testMatch: '**/login/**/*.spec.js',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['health-check']
    },
    {
      name: 'firefox',
      grep: /@smoke/,
      testIgnore: ['**/login/**', /.*\.setup\.js/, /health\.check\.js/],
      use: { ...devices['Desktop Firefox'], storageState: authFile },
      dependencies: ['health-check', 'setup']
    },
    {
      name: 'webkit',
      grep: /@smoke/,
      testIgnore: ['**/login/**', /.*\.setup\.js/, /health\.check\.js/],
      use: { ...devices['Desktop Safari'], storageState: authFile },
      dependencies: ['health-check', 'setup']
    }
  ]
});
