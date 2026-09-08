import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  /* Retry on failure */
  retries: 1,
  /* Generate HTML report */
  reporter: 'html',
  use: {
    /* Base URL for the application */
    baseURL: 'https://www.saucedemo.com',
    /* Collect trace for every test */
    trace: 'on',
    /* Record video for every test */
    video: 'on',
    /* Take screenshot only when a test fails */
    screenshot: 'only-on-failure',
    /* Saucedemo uses data-test attribute (not data-testid) */
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
