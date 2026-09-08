import { test, expect } from '@playwright/test';

/*
 * Lab 1 - Playwright UI Automation Test
 *
 * This file contains 3 automated tests for https://www.saucedemo.com:
 *   1. Successful Login - logs in with valid credentials and verifies
 *      the Products page is displayed.
 *   2. Failed Login - enters incorrect credentials and verifies the
 *      error message is displayed.
 *   3. Add to Cart - after login, adds "Sauce Labs Backpack" to cart
 *      and verifies it appears in the shopping cart.
 *
 * Locator Strategy (avoiding XPath):
 *   - getByPlaceholder: Targets input fields by their placeholder text
 *     (e.g., "Username", "Password").
 *   - getByRole: Locates elements by their ARIA role and name
 *     (e.g., button "Login", link "Logout").
 *   - getByText: Finds elements by visible text (exact: true for precision)
 *     (e.g., "Products" heading).
 *   - getByTestId: Targets elements with a `data-test` attribute
 *     (e.g., "error", "shopping-cart-link").
 *
 * Why not XPath: XPath is tightly coupled to DOM structure; if the DOM
 * changes (element reordering, wrapping divs), XPath breaks easily.
 * Semantic locators are more resilient and self-documenting.
 */

/*
 * Test 1: Successful Login
 *
 * Logs in with standard_user / secret_sauce and verifies we reach the
 * Products (inventory) page.
 */
test('successful login', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('/');

  // 2. Fill in username and password using placeholder-based locators.
  //    Playwright's auto-wait waits for elements to be ready before
  //    interacting — no need for manual explicit waits like Selenium.
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // 3. Click the Login button by role and accessible name
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Assertions:
  //    - "Products" heading is visible (exact match)
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  //    - URL changed to inventory page
  await expect(page).toHaveURL(/.*inventory\.html/);

  // 5. Logout to ensure test isolation (each test starts fresh)
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});

/*
 * Test 2: Failed Login (negative test)
 *
 * Enters incorrect credentials and verifies the error message
 * "Username and password do not match any user in this service"
 * is displayed.
 */
test('failed login shows error message', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('/');

  // 2. Enter a valid username with an incorrect password
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrongpassword123');

  // 3. Click Login
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Verify the error message using getByTestId (data-test="error")
  await expect(page.getByTestId('error')).toContainText(
    'Username and password do not match any user in this service'
  );
});

/*
 * Test 3: Add to Cart (post-login action)
 *
 * After logging in, adds "Sauce Labs Backpack" to the cart and verifies
 * it appears in the shopping cart page.
 */
test('add item to cart after login', async ({ page }) => {
  // 1. Login
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 2. Assert: Products page is visible
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

  // 3. Click "Add to cart" for the first product (Sauce Labs Backpack)
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // 4. Navigate to shopping cart (data-test="shopping-cart-link")
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/.*cart\.html/);

  // 5. Verify the item is in the cart
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

  // 6. Logout to clean up (test isolation)
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
