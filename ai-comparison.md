# AI Assistance Comparison

This exercise compares AI-generated test code (via Playwright Codegen,
ChatGPT, Claude, Copilot) with hand-written tests to identify gaps and
improvements.

The codegen output is saved in `docs/codegen.ts`. Below is the comparison.

## 1. Locator Selection

AI/codegen uses **CSS ID selectors**:
```typescript
await page.locator('#user-name').fill('standard_user');
await page.locator('#login-button').click();
```

Hand-written code uses **semantic locators**:
```typescript
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByRole('button', { name: 'Login' }).click();
```

**Difference:** `getByPlaceholder`, `getByRole`, `getByTestId` are based on
the accessibility tree and are more resilient to DOM changes. ID selectors
break if the element's ID changes or is removed.

## 2. Assertions

AI code uses limited assertions:
```typescript
await expect(page.locator('h3')).toContainText('Products');
```

Hand-written code uses multiple, precise assertions:
```typescript
await expect(page.getByText('Products', { exact: true })).toBeVisible();
await expect(page).toHaveURL(/.*inventory\.html/);
```

**Difference:** Hand-written tests verify both content (visible) and state
(URL), providing stronger coverage. The `exact: true` flag prevents
false matches from partial text.

## 3. Error / Negative Test

AI code does not test the **error message** on failed login.
Hand-written code verifies the error element:
```typescript
await expect(page.getByTestId('error')).toContainText(
  'Username and password do not match any user in this service'
);
```

**Difference:** AI-generated code only covers the happy path. The
negative test is essential for robustness.

## 4. Test Isolation

AI code does **not** log out after tests — page state carries over
between tests, causing flaky failures.
Hand-written code logs out and verifies URL after each test:
```typescript
await page.getByRole('button', { name: 'Open Menu' }).click();
await page.getByRole('link', { name: 'Logout' }).click();
await expect(page).toHaveURL('/');
```

## 5. Trace & Video Configuration

AI code does not configure trace or video recording.
Hand-written config has `trace: 'on'` and `video: 'on'`, producing
debugging artifacts saved in `docs/`.

## Summary

AI-generated tests are functional but have gaps: (1) ID selectors instead
of semantic locators, (2) fewer assertion types, (3) no negative/error
test, (4) no test isolation, (5) no trace/video config. AI is useful for
rapid scaffolding, but **hand review and refinement is essential** — this
is a core principle of this course.
