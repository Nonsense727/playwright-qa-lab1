# AI туслахтай харьцуулсан
## (Optional — Нэмэлт даалгавар)

Энэ судалгаа нь AI туслах (ChatGPT, Claude, Copilot) ашиглан нэвтрэх
хуудасны тестийг үүсгэж, hand-written тесттэй харьцуулах даалгаврыг
гүйцэтгэсэн болно.

Хаяг: `docs/codegen.ts` нь `npx playwright codegen` (Playwright-ийн
бүртгэлийн хэрэгслүүд) үр дүн юм. AI туслахтай харьцуулахад бид уг
codegen-ийн кодыг AI-гээр үүсгэсэн код хэлбэрээр үзнэ үнүү.

## AI-гээр үүсгэсэн тестийн давуу тал, дутагдал

AI (codegen/Copilot/ChatGPT) ашиглан `docs/codegen.ts` үүсгэсэн кодтой
миний hand-written `tests/mytest.spec.ts`-тэй дурсан агуулгууд:

### 1. Locator-ын сонголт

AI/codegen нь **ID selector**-ийг ашигладаг:
```typescript
await page.locator('#user-name').fill('standard_user');
await page.locator('#login-button').click();
```

Hand-written кодтой дурсан **семантик locator** ашигласан байна:
```typescript
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByRole('button', { name: 'Login' }).click();
```

**Ялгаа:** `getByPlaceholder`, `getByRole`, `getByTestId` нь accessibility tree-д
үндэслэлтэй, XPath мэт ID-сонгогчоос сул. ID нь хувьдарсан боломжтой —
веб хуудасыг шинэчлэхэд ID-ийг нь өөрчлөх нь локаторыг сулдавтал.

### 2. Assertion-ын өргөжим

AI кодтой дурсан `toHaveTitle`, `toContainText` л шалгууралт гарч байгаа:
```typescript
await expect(page.locator('h3')).toContainText('Products');
```

Hand-written кодтой дурсан `toBeVisible`, `toHaveURL`, `toContainText` зэрэг
нэр хүчирхэг assertion-тэй:
```typescript
await expect(page.getByText('Products', { exact: true })).toBeVisible();
await expect(page).toHaveURL(/.*inventory\.html/);
```

**Ялгаа:** Hand-written нь хувьд, өргөдөлт, URL шалгацаас илүүтэй.
`exact: true` нь текстэд дэлгэрэнгүй утгатай match-ийг алдах.

### 3. Error message тест

AI-гээр үүсгэсэн кодтой буруу нууц үгийн алдааг шалгах тестгүй.
Hand-written кодтой дурсан `getByTestId('error')`-р алдааны мессежийг
төлөвлдсөн байна:
```typescript
await expect(page.getByTestId('error')).toContainText(
  'Username and password do not match any user in this service'
);
```

**Ялгаа:** AI нь алдааны болон сөрөг тестийг үзээгүй. Hand-written нь
error element-ийг `data-test="error"` аргументаас `getByTestId` давж
олдсон.

### 4. Test isolation (logout)

AI кодтой дурсан **logout** болон test isolation-г зөрчсөн.
Hand-written кодтой дурсан бүр тестийг logout-рүүлж,
URL-ийг шалгасан байна:
```typescript
await page.getByRole('button', { name: 'Open Menu' }).click();
await page.getByRole('link', { name: 'Logout' }).click();
await expect(page).toHaveURL('/');
```

### 5. Code generation ба trace

AI нь `trace: 'on'`, `video: 'on'` тохиргоог ашиглахгүй.
Hand-written кодтой дурсан config-д `trace: 'on'`, `video: 'on'` бичиж,
`docs/failed-login-trace.zip`-г нь trace viewer-рүү үзж, алдааг
мөшгийн болсон.

## Дүгнэлт

AI-гээр үүсгэсэн тест нь ахан түгай багтсан код болох ч: (1) локатор
сонголт нь дурсан сайжруулж чаддаг (ID → семантик), (2) assertion-ын
нарист ажиглал байхгүй, (3) тест isolation-г (logout) зөрчсөн болдог,
(4) сөрөг тест (error message) бичихгүй. AI-г зөрөн автомат код бичих,
хяналт хянахад ашиглах нь заагүй, гэхдээ **шүүмжтэй** үзэх, засварыг
нь өөрийнх нь оролцон оролцогдох нь энэ хичээлийн гол зарчим юм.
