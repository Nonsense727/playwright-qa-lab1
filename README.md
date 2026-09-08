# Лаборатори 1: Playwright ашиглан UI автомат тест хийх (UI Automation Testing with Playwright)

**Оюутан:** Амармаэнд Түвшинбаяр (Amarmend Tuvshinbayar)  
**Хичээл:** F.CSA313 — Програм хангамжийн чанарын баталгаажуулалт ба тестчлэл (Software Quality Assurance & Testing)  
**Даалгавар:** Playwright UI автомат тестийн лабораторийн ажил  

---

## Төслийн тойм (Project Overview)

Энэхүү төсөл нь [SauceDemo](https://www.saucedemo.com) цахим худалдааны демо вебсайтад зориулсан Playwright UI автомат тестийг агуулна. Тестүүд нь системд нэвтрэх (login), алдаа барих (error handling) болон нэвтэрсний дараах үйлдлүүдийг шалгана.

## Тавигдах шаардлага (Prerequisites)

- Node.js v18 буюу түүнээс дээш хувилбар
- npm (Node.js дагалдаж ирдэг)

## Суулгах болон Ажиллуулах заавар (Setup & Run)

```bash
npm install                   # хамааралтай сангуудыг суулгах (install dependencies)
npx playwright install        # хөтчүүдийг татах (Chromium, Firefox, WebKit)
npm test                      # бүх тестүүдийг ажиллуулах
npm run show-report           # HTML тестийн тайланг нээж харах
npm run test:headed           # тестүүдийг browser-той харагдах (headed) горимд ажиллуулах
```

## Тестийн цуглуулга (Test Suite)

| # | Тестийн нэр | Тайлбар |
|---|---|---|
| 1 | Амжилттай нэвтрэх (Successful Login) | `standard_user`/`secret_sauce` эрхээр нэвтэрч, Products хуудас гарч ирж буйг шалгана |
| 2 | Амжилтгүй нэвтрэх (Failed Login) | Буруу нууц үг оруулж, алдааны мессеж зөв гарч ирж буйг шалгана |
| 3 | Сагсанд бараа нэмэх (Add to Cart) | Нэвтэрсний дараа "Sauce Labs Backpack" барааг сагсанд хийж, сагсан дотор орсныг шалгана |

Тест бүр нь дараагийн тестэд нөлөөлөхгүй байх (**test isolation**) үүднээс төгсгөлдөө системээс гарч (**logout** хийж), URL-ийг баталгаажуулдаг.

---

## Тестийн код (`tests/mytest.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test('successful login', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/.*inventory\.html/);

  // Тест тусгаарлалтыг хангах үүднээс Logout хийнэ
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
```

### Locator-ийн стратеги (Locator Strategy)

Энэхүү төсөлд XPath огт ашиглаагүй ба зөвхөн Playwright-ийн **semantic locator**-уудыг ашигласан:

| Locator | Хэрэглээний зориулалт |
|---|---|
| `getByPlaceholder('Username')` | Оруулах талбарыг placeholder текстээр нь олох |
| `getByRole('button', { name: 'Login' })` | Товчийг ARIA role болон нэрээр нь олох |
| `getByText('Products', { exact: true })` | Элементийг дэлгэц дээрх харагдах текстээр нь (яг таарсан / exact match) олох |
| `getByTestId('error')` | Элементийг `data-test` атрибутаар нь олох (`playwright.config.ts`-д тохируулсан) |

**Яагаад XPath-аас татгалзсан бэ:** XPath нь DOM бүтцээс шууд хамааралтай байдаг. Хэрэв хуудасны DOM бүтцэд багахан өөрчлөлт орвол (элементийн дараалал өөрчлөгдөх, div-ээр хүрээлэх г.м.) XPath шууд ажиллахаа больдог. Харин Semantic locator-ууд нь илүү найдвартай (resilient) бөгөөд элементийн мод дахь байршлыг бус *юутай харьцах гэж байгааг* илэрхийлдэг.

---

## Codegen болон Trace Viewer

### Codegen (`docs/codegen.ts`)

`npx playwright codegen https://www.saucedemo.com` командыг ажиллуулснаар хэрэглэгчийн хийсэн үйлдлийг бичиж, тестийн код автоматаар үүсгэдэг интерактив browser нээгдэнэ. Үүсгэсэн кодыг харьцуулалт хийх зорилгоор `docs/codegen.ts` файлд хадгалсан.

| Харьцуулалт | Codegen-ийн үүсгэсэн код | Гараар бичсэн код (Hand-Written) |
|---|---|---|
| Locator | `#user-name`, `#password`, `#login-button` (ID/CSS selector) | `getByPlaceholder`, `getByRole` (Semantic locator) |
| Assertion | `toHaveTitle`, `toContainText` | `toBeVisible`, `toHaveURL`, `toContainText` |
| Тест тусгаарлалт (Test isolation) | Logout хийдэггүй | Тест бүр Logout хийж, URL-ийг шалгана |
| Trace/Video | Тохируулаагүй | Тохиргоонд `trace: 'on'`, `video: 'on'` заасан |
| Сөрөг тест (Negative test) | Ороогүй | Алдааны мессежийг шалгах тест орсон |

**Гол ялгаа:** Codegen нь ID-д суурилсан сонгогч (`#user-name`) үүсгэдэг бөгөөд тестийн тусгаарлалт (logout хийхгүй), алдаа шалгах нөхцөл, нарийвчилсан тохиргоо дутмаг байдаг. Гараар бичсэн код нь урт хугацаанд авч явахад хялбар semantic locator ашигладаг, шалгалтууд (assertion) бүрэн, logout цэвэрлэгээ болон trace/video бичлэгтэй.

### Trace Viewer (Мөшгөгч)

Санаатайгаар алдаатай болгосон тестийг оношлох (debug хийх)-д Trace-ийг ашигласан:

```bash
npx playwright show-trace docs/failed-login-trace.zip
```

Trace Viewer-ээс дараах мэдээллийг харах боломжтой:
- **DOM snapshot** — алхам бүрт хуудасны бүтэц ямар байсан төлөв
- **Action log** — товшилт (click), бичилт (fill), хуудас шилжилт бүрийн цагийн тэмдэглэл
- **Screenshots** — алхам бүрийн дэлгэцийн зурган баримт
- **Console messages** — JS консолын гаралт болон алдааны лог

**Debug хийсэн алхам:**
1. Хүлээгдэж буй алдааны текстийг туршилтын шугамаар буруу болгож өөрчилсөн
2. Тестийг `--trace on` сонголттой ажиллуулахад тест төлөвлөсний дагуу унасан
3. Trace-ийг Trace Viewer дээр нээж харахад `getByTestId('error')` нь `<h3 data-test="error">` элементийг зөв олж буйг баталгаажуулсан
4. Trace дээр "Expected" (бидний бичсэн буруу текст) болон "Received" (бодит зөв текст) хоёрыг харуулсан тул locator зөв, харин assertion текст буруу байсныг тогтоосон
5. Assertion-ийг засаж, тухайн унасан үеийн trace-ийг `docs/failed-login-trace.zip` болгон хадгалсан

---

## Баримт файлууд (Evidence Files)

| Файл | Тайлбар |
|---|---|
| `docs/codegen.ts` | Харьцуулах зорилгоор Codegen-ээр үүсгэсэн тестийн код |
| `docs/failed-login-trace.zip` | Санаатайгаар алдаатай болгосон assertion-ий trace файл |
| `docs/failed-login-video.webm` | Алдаатай ажилласан тестийн бичлэг |
| `docs/passed-login-trace.zip` | Амжилттай нэвтэрсэн тестийн trace файл |
| `docs/passed-login-video.webm` | Амжилттай нэвтэрсэн тестийн бичлэг |
| `docs/add-to-cart-trace.zip` | Сагсанд бараа нэмсэн тестийн trace файл |
| `playwright-report/index.html` | Trace бичлэгүүд агуулсан бүрэн HTML тестийн тайлан |

---

## Playwright болон Selenium харьцуулалт (Comparison)

| Онцлог шинж | Selenium | Playwright |
|---|---|---|
| Лиценз (License) | Apache 2.0 (үнэгүй, нээлттэй эх) | Apache 2.0 (үнэгүй, нээлттэй эх) |
| Хүлээлтийн зохицуулалт (Wait handling) | Гараар explicit wait бичих шаардлагатай (`WebDriverWait`) | Auto-wait — элемент бэлэн болохыг автоматаар хүлээнэ |
| Хөтчийн тохиргоо (Browser setup) | Хөтөч бүрт тусдаа драйвер суулгана (ChromeDriver, GeckoDriver) | Нэг л команд: `npx playwright install` |
| Тест бичигч (Test recording) | Selenium IDE (хөтчийн нэмэлт өргөтгөл) | Codegen (системдээ суурилагдсан) |
| Алдаа оношилгоо (Debugging) | Лог файлууд, дэлгэцийн зураг | DOM snapshot, action log, консол бүхий Trace viewer |
| Дэмждэг хэлнүүд | Java, Python, C#, JavaScript | TS/JS, Python, Java, C# |

### Хувийн дүгнэлт (5 гол дүгнэлт)

1. **Auto-wait бол хамгийн том давуу тал:** Playwright нь аливаа элементтэй харьцахаас өмнө түүнийг бэлэн болохыг автоматаар хүлээдэг (auto-wait). Selenium дээр газар бүрт `WebDriverWait` гараар бичдэг байсан нь цаг авсан, алдаа гарах магадлалтай бөгөөд кодыг хэт урт болгодог байв. Харин Playwright-д `await page.getByRole('button', { name: 'Login' }).click()` гэхэд шууд найдвартай ажилладаг.

2. **Хөтчийн тохиргоо хамаагүй хялбар:** Selenium нь тухайн браузерын хувилбарт тохирсон ChromeDriver/GeckoDriver татаж тохируулахыг шаарддаг ба "session not created" алдаа байнга гардаг. Playwright дээр `npx playwright install` ганц коммандаар бүх хөтчийг автоматаар бэлдчихдэг.

3. **Trace Viewer нь алдаа оношлоход үнэлж баршгүй хэрэгсэл:** Тест унах үед Trace нь DOM snapshot, үйлдлийн дараалал, дэлгэцийн зураг, консолын логуудыг нэг дор интерактив байдлаар харуулдаг. Selenium дээрх зөвхөн статик зураг болон лог файл харахтай харьцуулахад хамаагүй давуу.

4. **Суурилуулсан төслийн тохиргоо (Config):** Playwright-ийн тохиргооны файл (`playwright.config.ts`) нь үндсэн URL, trace/video тохиргоо, дахин оролдох (retry) болон зэрэгцээ ажиллуулах горимыг маш цэгцтэй шийдсэн. Selenium-д эдгээрийг шийдэхийн тулд нэмэлт фреймворк эсвэл TestNG/JUnit XML файл үүсгэх шаардлагатай болдог.

5. **Илүү боловсронгуй Locator API:** Playwright-ийн сонгогчууд (`getByRole`, `getByPlaceholder`, `getByTestId`) нь вебийн хүртээмжтэй байдлын (accessibility) стандартууд дээр тулгуурласан. Уншихад ойлгомжтой бөгөөд Selenium-д ашигладаг байсан төвөгтэй CSS selector, XPath-уудтай харьцуулахад өөрчлөлтөд тэсвэртэй.

---

## AI туслахын харьцуулалт (AI Assistance Comparison)

Хэдийгээр AI хэрэгслүүд (ChatGPT, Claude, Copilot) тестийн кодыг хурдан үүсгэж чаддаг ч тэдгээрийн үүсгэсэн код нь гараар бичсэн чанартай кодоос хэд хэдэн чухал зүйлээр дутмаг байдаг. Дэлгэрэнгүйг `ai-comparison.md`-ээс үзнэ үү.

**AI-ийн үүсгэсэн кодод ихэвчлэн гардаг дутагдал:**
1. Semantic locator-ийн оронд энгийн ID/CSS selector ашигладаг
2. Шалгах нөхцөл (assertion) цөөн (зөвхөн `toContainText` бичиж, `toBeVisible`/`toHaveURL`-ийг орхигдуулдаг)
3. Тестийн тусгаарлалт хийдэггүй (тест хооронд logout хийдэггүй)
4. Сөрөг тест (алдааны мессеж шалгах) дутуу
5. Trace/video бичлэгийн тохиргоог тусгадаггүй

---

## Commit түүх (Commit History)

| Commit | Тайлбар |
|---|---|
| `feat: initialize Playwright TypeScript project` | package.json, playwright.config.ts, .gitignore үүсгэсэн |
| `feat: add first test - successful login with assertions` | tests/mytest.spec.ts (1-р тест) |
| `feat: add negative test - error message verification on failed login` | tests/mytest.spec.ts (2-р тест) |
| `feat: add post-login test - add to cart and verify in shopping cart` | tests/mytest.spec.ts (3-р тест) |
| `feat: add codegen output, trace evidence, and HTML test report` | docs/, playwright-report/ |
| `docs: add README with reflections and Playwright vs Selenium comparison` | README.md, ai-comparison.md |
| `chore: add tsconfig.json and fix README commit references` | tsconfig.json |
| `docs: translate all comments and READMEs to English` | README.md, ai-comparison.md, tests/mytest.spec.ts, docs/codegen.ts |

---

## .gitignore

```
node_modules/
test-results/
package-lock.json
.env
QA_lab1.pdf
```

`node_modules/` болон `test-results/` хавтаснуудыг git-д оруулахгүй. `playwright-report/`, `docs/`, болон бүх эх файлууд git дээр хадгалагдана.
