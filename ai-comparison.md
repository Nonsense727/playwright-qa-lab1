# AI туслахын харьцуулалт (AI Assistance Comparison)

Энэхүү хэсэгт AI хэрэгслүүдийн (Playwright Codegen, ChatGPT, Claude, Copilot) үүсгэсэн тестийн кодыг гараар бичсэн тесттэй харьцуулж, дутагдалтай талууд болон сайжруулалтыг тодорхойлов.

Codegen-ийн үүсгэсэн код `docs/codegen.ts` файлд хадгалагдсан байгаа бөгөөд доорх байдлаар харьцуулав.

## 1. Locator сонголт (Locator Selection)

AI/codegen нь **CSS ID сонгогч (selectors)** ашигладаг:
```typescript
await page.locator('#user-name').fill('standard_user');
await page.locator('#login-button').click();
```

Гараар бичсэн код нь **Semantic locator**-ууд ашигладаг:
```typescript
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByRole('button', { name: 'Login' }).click();
```

**Ялгаа:** `getByPlaceholder`, `getByRole`, `getByTestId` нь вебийн хүртээмжтэй байдлын мод (accessibility tree) дээр суурилсан тул DOM бүтэц өөрчлөгдөхөд илүү тэсвэртэй. Харин ID selector нь элементийн ID өөрчлөгдөх эсвэл устахад шууд ажиллахаа больдог.

## 2. Шалгах нөхцөлүүд (Assertions)

AI-ийн код нь хязгаарлагдмал цөөн assertion ашигладаг:
```typescript
await expect(page.locator('h3')).toContainText('Products');
```

Гараар бичсэн код нь олон бөгөөд нарийн тодорхой шалгалтууд хийдэг:
```typescript
await expect(page.getByText('Products', { exact: true })).toBeVisible();
await expect(page).toHaveURL(/.*inventory\.html/);
```

**Ялгаа:** Гараар бичсэн тест нь агуулга (дэлгэцэнд харагдаж буй эсэх) болон төлөв (хуудасны URL)-ийг давхар баталгаажуулж, илүү бүрэн шалгадаг. `exact: true` тохиргоо нь текст хагас таарснаас үүсэх хуурамч эерэг үр дүнгээс сэргийлдэг.

## 3. Алдаа шалгах буюу Сөрөг тест (Negative Test)

AI-ийн код нь нэвтрэлт амжилтгүй болох үеийн **алдааны мессежийг** шалгадаггүй.  
Гараар бичсэн код нь алдааны элементийг бүрэн шалгадаг:
```typescript
await expect(page.getByTestId('error')).toContainText(
  'Username and password do not match any user in this service'
);
```

**Ялгаа:** AI-ийн үүсгэсэн код нь зөвхөн амжилттай тохиолдлыг (happy path) хамардаг. Системийн найдвартай ажиллагааг шалгахад сөрөг тест зайлшгүй шаардлагатай.

## 4. Тестийн тусгаарлалт (Test Isolation)

AI-ийн код нь тест дууссаны дараа **системээс гардаггүй (logout хийдэггүй)** — улмаар тухайн төлөв дараагийн тестэд шилжиж, тестүүд тогтворгүй унах (flaky failure) эрсдэл дагуулдаг.  
Гараар бичсэн код нь тест бүрийн төгсгөлд logout хийж, үндсэн URL руу шилжсэнийг баталгаажуулдаг:
```typescript
await page.getByRole('button', { name: 'Open Menu' }).click();
await page.getByRole('link', { name: 'Logout' }).click();
await expect(page).toHaveURL('/');
```

## 5. Trace болон Video тохиргоо

AI-ийн кодод Trace болон Video бичлэгийн тохиргоо байдаггүй.  
Гараар бичсэн тохиргоонд `trace: 'on'`, `video: 'on'` зааж өгснөөр тест унах үед оношлох бүх баримтууд `docs/` хавтсанд хадгалагддаг.

## Дүгнэлт (Summary)

AI-ийн үүсгэсэн тест нь ерөнхийдөө ажиллах боловч дараах дутагдалтай талуудтай: (1) Semantic locator-ийн оронд ID selector ашигладаг, (2) Assertion-ий төрөл цөөн, (3) Сөрөг тест байхгүй, (4) Тестийн тусгаарлалт дутуу, (5) Trace/video тохиргоо ороогүй. AI нь суурь кодыг хурдан гаргахад тустай ч **хүн өөрөө нягтлан шалгаж сайжруулах нь нэн чухал** бөгөөд энэ нь тус хичээлийн гол зарчим юм.
