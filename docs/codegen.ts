import { test, expect } from '@playwright/test';

/*
 * Энэ файл нь `npx playwright codegen https://www.saucedemo.com` командаар
 * автоматаар үүсгэгдсэн код юм. tests/mytest.spec.ts дахь гараар бичсэн
 * кодтой харьцуулах зорилгоор хадгалав.
 *
 * Гол ялгаа: Codegen нь semantic locator-ийн оронд CSS ID selector ашигладаг
 * ба тест тусгаарлалт (logout) болон нарийвчилсан assertion дутуу байдаг.
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
