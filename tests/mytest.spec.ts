import { test, expect } from '@playwright/test';

/*
 * Лаборатори 1 - Playwright UI автомат тест (SauceDemo)
 * 1. Амжилттай нэвтрэх (Successful Login)
 * 2. Буруу нууц үгээр нэвтрэх (Failed Login / Negative test)
 * 3. Сагсанд бараа нэмэх (Add to Cart)
 *
 * Locator стратеги: XPath-аас зайлсхийж, илүү найдвартай
 * semantic locator-ууд (getByPlaceholder, getByRole, getByText, getByTestId) ашиглав.
 */

// Тест 1: Амжилттай нэвтэрч, Products хуудас харагдаж буйг шалгах
test('successful login', async ({ page }) => {
  // 1. Нэвтрэх хуудас руу шилжих
  await page.goto('/');

  // 2. Хэрэглэгчийн нэр, нууц үг оруулах (Auto-wait автоматаар хүлээнэ)
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // 3. Login товч дээр дарах
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Products гарчиг болон URL-ийг баталгаажуулах (Assertions)
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/.*inventory\.html/);

  // 5. Тест тусгаарлалт (Test isolation) - Системээс гарах
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});

// Тест 2: Буруу нууц үг оруулахад алдааны мессеж гарч ирэхийг шалгах (Negative test)
test('failed login shows error message', async ({ page }) => {
  // 1. Нэвтрэх хуудас руу шилжих
  await page.goto('/');

  // 2. Буруу нууц үг оруулах
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('wrongpassword123');

  // 3. Login товч дээр дарах
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Алдааны мессежийг data-test="error" атрибутаар шалгах
  await expect(page.getByTestId('error')).toContainText(
    'Username and password do not match any user in this service'
  );
});

// Тест 3: Нэвтэрсний дараа бараа сагсанд нэмэхийг шалгах
test('add item to cart after login', async ({ page }) => {
  // 1. Нэвтрэх
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 2. Products хуудас харагдаж буйг шалгах
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

  // 3. Sauce Labs Backpack-г сагсанд нэмэх (getByTestId-р зэрэмлэлт)
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // 4. Сагс руу шилжих
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/.*cart\.html/);

  // 5. Сонгосон бараа сагсанд орсон эсэхийг шалгах
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

  // 6. Тест тусгаарлалт - Системээс гарах (Logout)
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
