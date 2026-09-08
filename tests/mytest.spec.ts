import { test, expect } from '@playwright/test';

/*
 * Lab 1 — Playwright UI Automation Tests (SauceDemo)
 *
 * Tests:
 *   1. Successful Login — logs in with valid credentials, verifies Products page
 *   2. Failed Login (negative test) — enters wrong password, verifies error message
 *   3. Add to Cart — adds "Sauce Labs Backpack" to cart, verifies in shopping cart
 *
 * Locator Strategy: Avoid XPath, use semantic locators for resilience.
 *   - getByPlaceholder: input fields by placeholder text
 *   - getByRole: elements by ARIA role and accessible name
 *   - getByText: elements by visible text (exact: true for precision)
 *   - getByTestId: elements by data-test attribute
 *
 * Why not XPath? XPath is tied to DOM structure; if DOM changes
 * (element reordering, new wrapper divs), XPath breaks. Semantic locators
 * are resilient and self-documenting — they describe WHAT to interact
 * with, not WHERE in the DOM it is.
 */

// Test 1: Successful login — verify we land on the Products page
test('successful login', async ({ page }) => {
  // 1. Navigate to login page
  await page.goto('/');

  // 2. Fill credentials (placeholder-based locators)
  //    Playwright auto-wait ensures elements are ready — no manual
  //    explicit waits needed (unlike Selenium's WebDriverWait).
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // 3. Click Login button (by role + accessible name)
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Assertions: Products heading visible + URL changed to inventory
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/.*inventory\.html/);

  // 5. Logout for test isolation (each test starts fresh)
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});

// Test 2: Failed login (negative test) — verify error message on wrong password
test('failed login shows error message', async ({ page }) => {
  // 1. Navigate to login page
  await page.goto('/');

  // 2. Enter valid username with incorrect password
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrongpassword123');

  // 3. Click Login
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Verify error message using data-test="error" (getByTestId)
  await expect(page.getByTestId('error')).toContainText(
    'Username and password do not match any user in this service'
  );
});

// Test 3: Add to cart — after login, add "Sauce Labs Backpack", verify in cart
test('add item to cart after login', async ({ page }) => {
  // 1. Login
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 2. Assert: Products page is visible
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

  // 3. Add "Sauce Labs Backpack" to cart using its specific data-test ID
  //    (avoid .first() which is fragile — depends on product order)
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // 4. Navigate to shopping cart (data-test="shopping-cart-link")
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/.*cart\.html/);

  // 5. Verify the item is in the cart
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

  // 6. Logout for test isolation
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
