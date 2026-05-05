# Day 01 — Playwright basics

## What Playwright is

Playwright is a **browser automation and end-to-end testing** library. You write scripts that open real browsers (Chromium, Firefox, WebKit), navigate pages, click, type, and **assert** what the user would see. The test runner (`@playwright/test`) runs those scripts, reports pass/fail, and can capture traces or screenshots when something goes wrong.

---

## Key pieces: `test`, `page`, `expect`

### `test`

`test` is a **function you call to register one automated scenario**. Each `test('...', async () => { ... })` block is one case the runner will execute (often in parallel with other tests). You give it a **title** (what you are checking) and a **function** (the steps and checks).

### `page`

`page` is a **single browser tab** (think one window in Chrome). Playwright creates it for you via **fixtures**: you write `async ({ page }) => { ... }` and the runner injects a fresh `page` so tests stay isolated. On `page` you call methods like `goto`, `click`, `fill`, and you pass `page` into `expect` for page-level assertions.

### `expect`

`expect` is Playwright’s **assertion** API (from the test runner). It checks conditions (`toHaveTitle`, `toContainText`, etc.) and **retries** for a short time, because the web is asynchronous: the title or text might appear a moment after load. If the condition never becomes true before the timeout, the **test fails** and the runner marks it red.

---

## Why `async` / `await`

Browser work is **asynchronous**: `page.goto()` does not finish instantly; it returns a **Promise**.  

- `async` on the test function means “this function can use `await` inside.”  
- `await` means “**wait** until this Promise finishes before moving to the next line.”  

Without `await`, the next line might run before navigation completes, so assertions could run too early and flake or fail.

---

## What `page.goto()` does

`page.goto(url)` tells the browser to **navigate** to that URL (like typing it in the address bar and pressing Enter). It waits for the page to reach a **load** state by default. You typically `await page.goto(...)` so the rest of the test runs **after** navigation has settled enough for reliable checks.

---

## Assertions (what they do when they pass or fail)

An **assertion** is a check that must be true for the test to pass.

- **Pass:** Playwright moves on to the next line (or ends the test).  
- **Fail:** Playwright **throws an error**, stops that test, records the failure (which assertion, expected vs received if applicable), and can attach **screenshots** or **traces** depending on config. Other tests may still run.

Playwright’s `expect(...)` assertions **retry** until success or timeout, which reduces flaky failures compared to a single snapshot check.

---

## Sample test file (reference)

File: `tests/day1.spec.ts` — opens `https://example.com`, checks title **contains** “Example Domain”, checks body **contains** that text.

---

## Interview questions

**Q1. What is the difference between Playwright and a unit test framework?**  
**A.** Unit tests usually test **functions or modules in isolation** (often with mocks). Playwright runs **real browsers** against URLs or deployed apps and checks **UI and behavior** from the user’s perspective—true end-to-end (E2E) testing.

**Q2. Why do Playwright tests use `async`/`await`?**  
**A.** Because almost all browser operations return **Promises**. `await` ensures navigation, clicks, and waits complete before assertions run, so checks are not racing ahead of the UI.

**Q3. What is a fixture, and why is `page` often shown as `({ page })`?**  
**A.** A **fixture** is setup the test runner provides (browser, context, page, etc.). `{ page }` **destructures** the injected `page` object so the test can use one isolated tab per test without manual browser lifecycle code.

**Q4. Why use `expect(page).toHaveTitle(/Example Domain/)` instead of reading `document.title` yourself?**  
**A.** `expect` integrates with Playwright’s **retry and timeout** behavior and clear failure messages. Manual reads are easy to do **too early** and do not retry automatically.

**Q5. What happens when an assertion fails?**  
**A.** The assertion throws, the **current test stops** (later lines in that test do not run), the run is marked failed, and you get logs and optionally screenshots/traces to debug.
