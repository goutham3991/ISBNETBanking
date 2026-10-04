import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['line'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['allure-playwright', {
      resultsDir: 'allure-results'
    }]
  ],
  use: {
    baseURL: 'https://www.testerrank.com',
    trace: 'on-first-retry',
    headless: true,
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

