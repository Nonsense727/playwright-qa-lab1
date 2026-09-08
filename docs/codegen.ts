import { test, expect } from '@playwright/test';

/*
 * This file is a RECORDING of `npx playwright codegen https://www.saucedemo.com`.
 * Codegen opens an interactive browser, records actions, and generates code
 * in TS/JS, Python, Java, or C#. This version was generated for comparison
 * with the hand-written tests in tests/mytest.spec.ts.
 *
 * Key difference: codegen uses CSS ID selectors (`#user-name`, `#login-button`)
 * instead of semantic locators. It also lacks test isolation (no logout),
 * assertions, and trace/video configuration.
 */

test('login flow (codegen)', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page).toHaveTitle(/Swag Labs/);
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('h3')).toContainText('Products');
  await page.locator('#add-to-cart-sauce-labs-backpack').click();
  await expect(page.locator('.shopping_cart_link')).toContainText('1');
});
