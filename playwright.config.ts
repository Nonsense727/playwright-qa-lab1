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
    screenshot: 'only-as-artifact',
    /* data-testid-ийн оронд data-test атрибут ашиглах */
    testIdAttribute: 'data-test',
    /* Хөтөч */
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Тест ажиллуулахаас өмнө локал серверийг асаах тохиргоо */
  // webServer: { command: 'npm run start', url: 'http://127.0.0.1:3000' },
});
