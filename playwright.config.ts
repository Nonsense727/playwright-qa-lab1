import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  /* Capture trace on first retry and on failures */
  retries: 1,
  /* Reporter to use */
  reporter: 'html',
  use: {
    /* Base URL for the application */
    baseURL: 'https://www.saucedemo.com',
    /* Collect trace when retrying a test or on failure */
    trace: 'on',
    /* Record video for all tests */
    video: 'on',
    /* Take screenshot on failure */
    screenshot: 'only-as-artifact',
    /* Saucedemo uses data-test attribute (not data-testid) */
    testIdAttribute: 'data-test',
    /* Browser to use */
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Run your local dev server before the tests */
  // webServer: { command: 'npm run start', url: 'http://127.0.0.1:3000' },
});
