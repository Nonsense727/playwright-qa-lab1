import { test, expect } from '@playwright/test';

/*
 * Лаборатори №1 — Playwright UI автомат тест
 *
 * Энэ файл нь https://www.saucedemo.com вэбсайт дээрх үйлдлүүдийг
 * автоматжуулсан болно.
 *
 * Локаторуудын сонголт (XPath-ийг зайлсхий):
 *   - getByPlaceholder — placeholder тексттэй input уруу нь зориулсон
 *   - getByRole — элементийн дүрэм (role) ба нэртэй button/link-ийг олох
 *   - getByText — хуудасны текстээр элементийг олох (exact: true)
 *   - getByTestId — data-test аргументтэй элементүүдийг олох
 */

/*
 * Тест 1: Амжилттай нэвтрэх
 *
 * standard_user / secret_sauce хэрэглэгчийг нэвтрүүлж,
 * "Products" хуудсанд очсонд баталгүйцүүлэх.
 */
test('Амжилттай нэвтрэх', async ({ page }) => {
  // 1. Бакетсайтруу очих
  await page.goto('/');

  // 2. Нэр ба нууц үгийг оруулж авах (placeholder текстээр олох)
  //    Playwright-ийн Auto-wait нь элемент бэлэн болох хүртэл үлдэнэ —
  //    энэ нь Selenium-ийн гараарын explicit wait-с аль болох давуу тал.
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // 3. "Login" товчийг дарах (role ба name-аар)
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Баталгүйцүүлэх:
  //    - "Products" гарчиг үзүүлсэн байгааг шалгах (exact: true)
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  //    - URL "/inventory.html"-руу солигдсон болно
  await expect(page).toHaveURL(/.*inventory\.html/);

  // 5. Logout хийх (тестийн чист байдал — test isolation)
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
