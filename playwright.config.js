import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 2,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['line'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }]
  ],
  use: {
    baseURL: 'https://www.testerrank.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  /* Configure projects for major browsers */
  projects: [

    {
        name: 'setup',
        testMatch: /.*\.setup\.js/
    },

    {
        name: 'chromium',
        use: {
            browserName: 'chromium',
            storageState: 'auth/user.json'
        },
        dependencies: ['setup']
    }

]
});
