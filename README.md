# Lab 1: UI Automation Testing with Playwright

**Student:** Amarmend Tuvshinbayar  
**Course:** F.CSA313 — Software Quality Assurance & Testing  
**Assignment:** Playwright UI automated testing lab  

---

## Project Overview

This project contains Playwright UI automation tests for the
[SauceDemo](https://www.saucedemo.com) demo e-commerce site. Tests cover
login functionality, error handling, and post-login interactions.

## Prerequisites

- Node.js v18+
- npm (comes with Node.js)

## Setup & Run

```bash
npm install                   # install dependencies
npx playwright install        # download browsers (Chromium, Firefox, WebKit)
npm test                      # run all tests
npm run show-report           # open HTML test report
npm run test:headed           # run tests in headed (visible) mode
```

## Test Suite

| # | Test Name | Description |
|---|---|---|
| 1 | Successful Login | Logs in with standard_user/secret_sauce, verifies Products page |
| 2 | Failed Login | Enters wrong password, verifies error message displayed |
| 3 | Add to Cart | After login, adds "Sauce Labs Backpack" to cart, verifies in cart |

Each test ends with a **logout** and URL assertion to ensure test isolation
(tests don't share state).

---

## Test Code (`tests/mytest.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test('successful login', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/.*inventory\.html/);

  // Logout for test isolation
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
```

### Locator Strategy

This project uses Playwright's **semantic locators** exclusively — no XPath:

| Locator | Use Case |
|---|---|
| `getByPlaceholder('Username')` | Input field by placeholder text |
| `getByRole('button', { name: 'Login' })` | Button by ARIA role + accessible name |
| `getByText('Products', { exact: true })` | Element by visible text (exact match) |
| `getByTestId('error')` | Element by `data-test` attribute (configured in `playwright.config.ts`) |

**Why avoid XPath:** XPath is tightly coupled to DOM structure. If the DOM
changes (element reordering, wrapping divs), XPath breaks. Semantic locators
are resilient and self-documenting — they describe *what* to interact with,
not *where* it is in the tree.

---

## Codegen & Trace Viewer

### Codegen (`docs/codegen.ts`)

`npx playwright codegen https://www.saucedemo.com` opens an interactive browser
that records actions and generates test code. The output is saved in
`docs/codegen.ts` as a reference.

| Aspect | Codegen Output | Hand-Written Code |
|---|---|---|
| Locator | `#user-name`, `#password`, `#login-button` (ID/ CSS selectors) | `getByPlaceholder`, `getByRole` (semantic locators) |
| Assertion | `toHaveTitle`, `toContainText` | `toBeVisible`, `toHaveURL`, `toContainText` |
| Test isolation | No logout | Each test logs out, verifies URL |
| Trace/Video | Not configured | `trace: 'on'`, `video: 'on'` in config |
| Negative test | Not included | Error message verification test present |

**Key differences:** Codegen generates ID-based selectors (`#user-name`) and
lacks test isolation (no logout), error handling, and configuration. Hand-written
code uses semantic locators that are more maintainable and includes proper
assertions, logout cleanup, and trace/video recording.

### Trace Viewer

Traces were used to debug a deliberately broken test:

```bash
npx playwright show-trace docs/failed-login-trace.zip
```

The trace viewer provides:
- **DOM snapshot** — what the page looked like at each step
- **Action log** — every click, fill, navigation with timestamps
- **Screenshots** — visual record of each step
- **Console messages** — JS console output and errors

**Debugging workflow:**
1. Temporarily changed the expected error message text to an incorrect value
2. Ran the test with `--trace on` — test failed as expected
3. Opened the trace in trace viewer — confirmed `getByTestId('error')` correctly
   located the `<h3 data-test="error">` element
4. The trace showed "Expected" (wrong text) vs "Received" (correct text),
   confirming the locator was working — only the assertion text was wrong
5. Fixed the assertion and saved the failing trace to `docs/failed-login-trace.zip`

---

## Evidence Files

| File | Description |
|---|---|
| `docs/codegen.ts` | Codegen-generated test output for comparison |
| `docs/failed-login-trace.zip` | Trace from deliberately broken assertion |
| `docs/failed-login-video.webm` | Video of the failing test run |
| `docs/passed-login-trace.zip` | Trace from successful login test |
| `docs/passed-login-video.webm` | Video of successful login test |
| `docs/add-to-cart-trace.zip` | Trace from add-to-cart test |
| `playwright-report/index.html` | Full HTML test report with embedded traces |

---

## Playwright vs Selenium Comparison

| Feature | Selenium | Playwright |
|---|---|---|
| License | Apache 2.0 (free, open source) | Apache 2.0 (free, open source) |
| Wait handling | Manual explicit waits required (`WebDriverWait`) | Auto-wait — waits for element readiness automatically |
| Browser setup | Separate driver per browser (ChromeDriver, GeckoDriver) | Single command: `npx playwright install` |
| Test recording | Selenium IDE (browser extension) | Codegen (built-in) |
| Debugging | Logs, screenshots | Trace viewer with DOM snapshots, action log, console |
| Language support | Java, Python, C#, JavaScript | TS/JS, Python, Java, C# |

### Personal Assessment (5 key points)

1. **Auto-wait is a game-changer.** Playwright's auto-wait automatically
   waits for elements to be ready before interacting. In Selenium, I had
   to manually write `WebDriverWait` everywhere — tedious, error-prone,
   and made tests much longer. With Playwright, `await page.getByRole('button',
   { name: 'Login' }).click()` just works.

2. **Browser setup is significantly simpler.** Selenium requires downloading
   the correct ChromeDriver/GeckoDriver per browser version — a common
   source of "session not created" errors. Playwright bundles everything
   with `npx playwright install` — one command, all browsers ready.

3. **Trace viewer is invaluable for debugging.** When a test fails, the
   trace gives me a DOM snapshot, action timeline, screenshots, and console
   logs all in one interactive viewer. Selenium debugging was limited to
   static screenshots and log files that were hard to correlate.

4. **Built-in test config.** Playwright's config file (`playwright.config.ts`)
   elegantly handles base URLs, trace/video settings, retries, and parallel
   execution. In Selenium, these required custom framework code or TestNG/JUnit
   XML configuration files.

5. **Better locator API.** Playwright's locators (`getByRole`, `getByLabelText`,
   `getByTestId`) are designed around web accessibility standards. They read
   like English and are far more maintainable than the CSS selectors and XPath
   expressions I had to use in Selenium.

---

## AI Assistance Comparison (optional extra)

AI tools (ChatGPT, Claude, Copilot) can generate test code, but the output
typically differs from hand-written code in important ways. See
`ai-comparison.md` for the full comparison.

**Key differences AI-generated tests would have:**
1. ID/CSS selectors instead of semantic locators
2. Fewer assertion types (just `toContainText`, missing `toBeVisible`/`toHaveURL`)
3. No test isolation (no logout between tests)
4. No negative test case (error message verification)
5. No trace/video configuration

---

## Commit History

| Commit | Description |
|---|---|
| `feat: initialize Playwright TypeScript project` | package.json, playwright.config.ts, .gitignore |
| `feat: add first test - successful login with assertions` | tests/mytest.spec.ts (test 1) |
| `feat: add negative test - error message verification on failed login` | tests/mytest.spec.ts (test 2) |
| `feat: add post-login test - add to cart and verify in shopping cart` | tests/mytest.spec.ts (test 3) |
| `feat: add codegen output, trace evidence, and HTML test report` | docs/, playwright-report/ |
| `docs: add README with reflections and Playwright vs Selenium comparison` | README.md, ai-comparison.md |
| `chore: add tsconfig.json and fix README commit references` | tsconfig.json |
| `docs: translate all comments and READMEs to English` | README.md, ai-comparison.md, tests/mytest.spec.ts, docs/codegen.ts |

---

## .gitignore

```
node_modules/
test-results/
package-lock.json
.env
QA_lab1.pdf
```

`node_modules/` and `test-results/` are excluded. `playwright-report/`,
`docs/`, and all source files are tracked.
