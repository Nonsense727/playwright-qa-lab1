# Лаборатори №1: UI автомат тест — Playwright

**Оюутан:** Амармэнд Төвшинбаяр (Amarmend Tuvshinbayar)  
**Хичсэл:** F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест  
**Ээлж:** 2027 улсарт судалгаа  

---

## Төслийн тухай

Энэ төсл нь [Playwright](https://playwright.dev/) UI автоматжуулалтын сан
аспацтайгаас [SauceDemo](https://www.saucedemo.com) вэбсайтыг тестлэх 3 тестийг
агнуулсан болно:

| № | Тест нэр | Тодорхолт |
|---|---|---|
| 1 | `Амжилттай нэвтрэх` | standard_user/secret_sauce эрхээр нэвтэрж Products хуудсыг харуулна |
| 2 | `Буруу нууц үгээр нэвтрэх` | Буруу нууц үгийг оруулсан үед алдааны мессежийг шалгана |
| 3 | `Нэвтэрсний дараа бараа сагслах` | Бараа нэмэлт сагсруулаа, саглаас дах шалгууран |

Бүр тест нь `logout` хийж, авсан URL-ийг шалган төгсдөг (test isolation).

---

## Суулгах ба ажиллуулах

```bash
npm install                  # хамааралыг суулгах
npx playwright install       # браузер суулгах
npm test                     # бүх тестийг ажиллуулах
npm run show-report          # HTML тайлан үзэх
```

---

## Тестийн код (tests/mytest.spec.ts)

```typescript
import { test, expect } from '@playwright/test';

test('Амжилттай нэвтрэх', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/.*inventory\.html/);

  // logout — test isolation
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});
```

### Локаторын сонголт

XPath-ийг ашиглаагүй — дараах шалтай:

1. **XPath нь DOM бүтэцтэй холбоотой.** Жишээ нь `//div[@id='login']/form/input[1]`
   гэж бичсон бол, DOM-той холдоо өөрчлөхөд дохоожиж болно.
2. **Семантик локаторууд нь бид урьдчилан сэцгэлдэг.** `getByRole`, `getByLabel`,
   `getByText` нь веб хуудсын доступibility tree-дэд үндэслэн олдог.
3. **Хянаххан таашитай.** `getByTestId('error')` гэж бичвэл `data-test="error"`
   атрибуттэй элементийг автоматаар олдог — хувьдал, өгөгдлийн сэсэгдлийг
   сайжруулдаг.

Хэрэглэсэн локаторуудаа:

| Локатор | Зориулалт |
|---|---|
| `getByPlaceholder('Username')` | Input талбарыг placeholder-аар |
| `getByRole('button', { name: 'Login' })` | Товчийг role+name-аар |
| `getByText('Products', { exact: true })` | Гарчмыг текстээр, exact match |
| `getByTestId('error')` | `data-test="error"` элементийг |
| `getByTestId('shopping-cart-link')` | Саглын линкийг |

> `exact: true` — true аргумент нь текст олдоход дэлгэрэнгүй утгатай.
> `getByText('Products')` үзөх болно `"Products Page"`-ийг тааруулж мөн
> элементийг нь match хийж болох. `exact: true` нь бүрэлдүүлсэн
> `"Products"`-г л тааруулах болно.

---

## Codegen ба Trace Viewer

### Codegen (`docs/codegen.ts`)

`npx playwright codegen https://www.saucedemo.com` команд нь интерактив
орчинд браузер нээж, үйлдлүүдийг бичиж автоматаар код болгодог. Миний
codegen үр дүнтэй `docs/codegen.ts`-д бичсэн болно.

**Codegen-ийн код vs Hand-written кодын Ялгаа:**

| Шинж | Codegen | Hand-written |
|---|---|---|
| Locator | `#user-name`, `#password`, `#login-button` (ID selector) | `getByPlaceholder`, `getByRole` (семантик) |
| Assertion | `toHaveTitle`, `toContainText` | `toBeVisible`, `toHaveURL`, `toContainText` |
| Test isolation | Logout биш | Бүр logout хийж, URL шалгана |
| Screenshot/trace | Алимаа | Trace, video, screenshot |

Codegen-ийн локатор нь ID (`#` selector) ашигладаг. ID сонгогч нь
элементийн ID-ээ салгичлалтын ашиглан олдог. Харин hand-written-д `getByRole`,
`getByTestId`, `getByPlaceholder` зэрэнд семантик локатор ашигласан нь
DOM-ийг өөрчлөхөд шулайж, хянаххан таашитай.

### Trace Viewer

Trace viewer-ийг ашиглан `docs/failed-login-trace.zip`-г нь үзжэв:

```bash
npx playwright show-trace docs/failed-login-trace.zip
```

Энд trace нь:
- DOM snapshot (алдаа гарсны үеийн вебсайт бүтэц)
- Action log (click, fill, etc. тулгууртай залгамжилт)
- Screenshots (алхам бүрийн вебсайт дүрслэл)
- Console messages (JS консол логууд)

Миний trace-ийн ашиглалт:
1. `Буруу нууц үгээр нэвтрэх` тестийг санаатай унагаж (`toContainText`
   assertion-ийг буруу утгаар авч үзьсэн)
2. Trace viewer-тэй trace-ыг нь нээж, алдааны чиглэлийг мөшгийн
3. assertion-ийг засаад, trace-ийг нь `docs/failed-login-trace.zip`-д
   хадгалсон

Энэ Trace-ийн алдаа:
- `getByTestId('error')` locator нь `data-test="error"` атрибуттэй
  `<h3>` элементийг илрүүлсэн
- Expected: `"ЭНЭ НЬ Буруу орсон алдааны мессеж"` (буруу assertion)
- Received: `"Epic sadface: Username and password do not match..."` (зөв
  алдааны текст)

---

## Нотолгоо (Evidence)

| Файл | Тодорхол |
|---|---|
| `docs/codegen.ts` | Codegen-ийн үр дүн |
| `docs/failed-login-trace.zip` | Буруу assertion-ийн trace |
| `docs/failed-login-video.webm` | Буруу тестийн видео |
| `docs/passed-login-trace.zip` | Амжилттай нэвтрэх trace |
| `docs/passed-login-video.webm` | Амжилттай нэвтрэх видео |
| `docs/add-to-cart-trace.zip` | Бараа сагслалтын trace |
| `playwright-report/index.html` | HTML тест тайлан |

---

## Playwright ба Selenium-ийн харьцуулсан

| Шинж | Selenium | Playwright |
|---|---|---|
| Лиценз | Apache 2.0 (open source) | Apache 2.0 (open source) |
| Хүлээлт (waits) | Гараар explicit wait бичих шаардлагатай | Auto-wait — элемент бэлэн болтол автоматаар хүлээнэ |
| Driver | Хөтөч бүрд тусдаа driver суулгана (ChromeDriver, GeckoDriver) | Хөтөчүүд нэг командаар суудаг (`playwright install`) |
| Тест бичих туслах | Selenium IDE — код болгодог | Codegen — үйлдлээ бичүүлж код болгодог |
| Дебаг | Лог, скриншот | Trace viewer — алхам бүрийн бичлэг, DOM snapshot |
| Хэл дэмжлэг | Java, Python, C#, JS | JS/TS, Python, Java, C# |

### Хувийн бүрэн ярилцлагаа

1. Selenium-тэй харьцуулбал, Playwright-ийн **auto-wait** нь маш чухал болсон.
   Selenium дээр `WebDriverWait` бичих нь алдартай, давтагдалтай ажил.
   Playwright дээр элемент бэлэн болох хүртэл үлдэнэ — урьдрал, код
   багатай.

2. Driver менеджерийн хувид, Selenium дээр ChromeDriver, GeckoDriver
   гээд тус тус суулгах ёстой. Ингэх нь орчингүй сайжруулах. Playwright дээр
   `npx playwright install` л гэсэн нэг командаар бүх браузер, FFmpeg,
   headless shell зэргийг суулгаж авдаг.

3. **Trace viewer** нь машинаа давуу шанс. Тест алдаа гарсан үед trace-г нь
   нээсэр DOM snapshot, action log, screenshot, console log гээд бүрэн
   мэдээллийг үзэж чаддаг. Selenium дээр лог маань зөндлөн, screenshot л
   зарим.

4. **Config** дээр `trace: 'on'`, `video: 'on'` гэж ашигласан бол Playwright
   бүр тестийг trace, video бичэх нь Selenium дээр миний алхам туслахгүй.
   Selenium дээр video бичихийг суулгах нь их ажл.

5. **Locators**-ийн хувид, Playwright-ийн `getByRole`, `getByText`,
   `getByTestId` нь семантик, хянаххан таашитай. Selenium дээр CSS selector,
   XPath ашигласан болохоор DOM-ийг өөрчлөхөд сул.

---

## AI туслах судалгаа (нэмэлт)

AI (ChatGPT, Claude, Copilot) ашиглан saucedemo-ийн login тестийг
үүсгүүлсэн. Дотоод `docs/codegen.ts`-д codegen-ийн үр дүнтэй.

AI-гээр үүсгэсэн/коджинг-ийн кодтой hand-written кодын ялгаа:

1. **Locator**: AI/Copilot нь ID selector (`#user-name`) ашигладаг.
   Hand-written кодтой дурсан `getByPlaceholder`, `getByRole` нь
   семантик, шуяртай.
2. **Assertion**: AI нь `toHaveTitle`, `toContainText`-ээр л шалгууралт
   хийдэг. Hand-written кодтой дурсан `toBeVisible`, `toHaveURL` зэрэг
   нэмж, баталгүйцүүлэлт өргөжим.
3. **Test isolation**: AI нь logout хийхгүй. Hand-written кодтой дурсан
   бүрийг logout-рүүлж, URL-ийг шалгайдаг.
4. **Error handling**: AI нь алдааны тестийг бичихгүй. Hand-written кодтой
   дурсан `getByTestId('error')`-р алдааны мессежийг шалгадаг.
5. **Trace/Video**: AI нь trace, video-ийг тохируулахгүй. Hand-written кодтой
   дурсан config-д `trace: 'on'`, `video: 'on'` бичсэн.

AI-г шүүмжтэй ашиглах нь заавал биш — миний ажил нь өөрийн 100% hand-written
болсон.

---

## Ажлын явц (Commits)

| Commit | Тодорхол |
|---|---|
| `feat: initialize Playwright TypeScript project` | package.json, playwright.config.ts, .gitignore |
| `feat: add first test — successful login with assertions` | mytest.spec.ts (test 1) |
| `feat: add negative test — error message verification on failed login` | mytest.spec.ts (test 2 нэмэлт) |
| `feat: add post-login test — add to cart and verify in shopping cart` | mytest.spec.ts (test 3 нэмэлт) |
| `feat: add codegen output and trace evidence` | docs/codegen.ts, docs/*.zip, docs/*.webm |
| `docs: add README with reflections and Selenium comparison` | README.md, ai-comparison.md |

### Commit хийхдээ анхаарсан зүйлс

1. **Бүх ажлыг нэг commit-д хийсэнгүй.** Ажлын явц: project setup → test 1 →
   test 2 → test 3 → codegen/trace → README.
2. **Commit author зөв:** Amarmend Tuvshinbayar / tobioshy727@gmail.com.
3. **Git history хянасан:** `git log --oneline` дээр 6 commit байна.

---

## .gitignore

```
node_modules/
test-results/
package-lock.json
.env
```

`node_modules/`, `test-results/` нь .gitignore-д бичсэн болно. Харин
`playwright-report/`, `docs/` нь repo-д багтаж байна.

---

## Лаборатори шаардлагын хангуулаас

| Шаардлага | Төлөв |
|---|---|
| GitHub public репозиторийн линк | ✅ https://github.com/Nonsense727/playwright-qa-lab1 |
| .gitignore (node_modules, test-results орсонгүй) | ✅ |
| 3+ утга төгөлдөр commit | ✅ 6 commit |
| Playwright project, `npx playwright test` ажилладаг | ✅ |
| ≥3 тест: амжилттай нэвтрэх, амжилтгүй, пост-логин үйлдэл | ✅ |
| Modern locator (getByRole/getByLabel/getByText/getByTestId) + assertion | ✅ |
| Trace / HTML report / бичлэг repo-д байгаа | ✅ |
| README: хийсэн ажил, Selenium харьцуулалт (5-10 өгүүлбэр) | ✅ |
| Кодонд коммент байгаа | ✅ |
| Бүр тест logout-оор төгсгөөд URL шалгадаг | ✅ |
| XPath-ийг зайлсхий | ✅ (getByRole, getByTestId хэрэглэсэн) |
