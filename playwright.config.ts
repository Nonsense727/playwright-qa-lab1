import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  /* Тест унавал 1 удаа дахин оролдох */
  retries: 1,
  /* HTML тайлан үүсгэх */
  reporter: 'html',
  use: {
    /* Үндсэн URL */
    baseURL: 'https://www.saucedemo.com',
    /* Trace мөшгилтийг хадгалах */
    trace: 'on',
    /* Видео бичлэг хийх */
    video: 'on',
    /* Унасан үед дэлгэцийн зураг авах */
    screenshot: 'only-on-failure',
    /* data-testid-ийн оронд data-test атрибут ашиглах */
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
