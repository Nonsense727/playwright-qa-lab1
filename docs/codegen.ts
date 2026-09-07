import { test, expect } from '@playwright/test';

/*
 * Энэ код нь `npx playwright codegen https://www.saucedemo.com` командын
 * дүрслэл (demonstration). Codegen интерактив орчинд ажилладаг болно:
 * хялуур нь браузер нээж, хурданын үйлдлүүдийг бичиж, кодыг автоматаар
 * үүсгэнэ. Энд кодчилолын үр дүнтэйжүүлсэн бичсэн тестийг үзүүллэв.
 *
 * Үйлчлэл: Codegen нь URL-ийн товч хаяг, CSS ID/selector locator-уудыг
 * ашигладаг. Hand-written кодтой дурсан: locator-уудаа бие даалнууд
 * сайжуулж, data-test аргумент, getByRole, getByText зэрэнд
 * солих боломжтой.
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
