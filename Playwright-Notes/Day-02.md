# Day 02 — Navigation, clicks, and stability

## What navigation testing is

**Navigation testing** checks that users can move through your app the way you expect: links and buttons load the right URLs, the browser history updates, and the **next screen shows the right content**. In Playwright you usually combine **`page.goto`** or **`click`** with **`expect(page).toHaveURL`** and **content assertions** (`toContainText`, locators) to prove the journey worked end-to-end.

---

## How Playwright performs click actions

When you call **`locator.click()`**, Playwright does not fire one instant DOM event and hope for the best. It roughly:

1. **Finds** the element using your locator (role, text, test id, etc.).
2. **Waits** until the element is **attached**, **visible**, **stable** (not animating), **enabled**, and **not obscured** — so the click targets what a human would hit.
3. **Scrolls** the element into view if needed.
4. Sends **trusted** pointer events (mouse/touch) like a real user.

That pipeline is why clicks tend to be more reliable than “fire click in JS” approaches.

---

## What auto-waiting is (simple explanation)

**Auto-waiting** means Playwright **automatically waits** (up to a timeout) before acting or asserting:

- **Actions** (click, fill, …): wait until the target can be used safely.
- **`expect` assertions**: **retry** until they pass or time out.

So you rarely need manual `sleep()` calls; you describe **what** should be true, and Playwright keeps checking briefly until it is.

---

## Why Playwright is often more stable than Selenium (high level)

| Idea | Playwright | Classic Selenium (typical) |
|------|------------|----------------------------|
| Waiting model | Built-in **auto-wait** on actions and **retrying** web assertions | Often relied more on **explicit waits** you configure yourself |
| Browser alignment | **Single vendor stack** tuned to Chromium/Firefox/WebKit engines | Works across drivers/browsers; behavior varies more |
| Locators | Pushes **accessibility-style** locators (`getByRole`, labels, test ids) | Historically more CSS/XPath-heavy tests |
| Test runner | **`@playwright/test`** includes traces, parallel runs, fixtures | Selenium is lower-level; extra tooling for parallel/trace |

Neither is “magic,” but Playwright’s defaults reduce timing flakes **when used with good locators** (`getByRole`, etc.).

---

## Interview questions

**Q1. What does `await locator.click()` wait for before clicking?**  
**A.** At minimum that the element is **visible, stable, enabled, and receiving events** (not covered). Playwright waits until those conditions hold or a timeout is hit.

**Q2. What is auto-waiting?**  
**A.** Playwright **automatically waits** for elements to be ready before actions, and **retries** web assertions for a period instead of checking once. That reduces flaky tests caused by slow networks or rendering.

**Q3. Why prefer `getByRole('link', { name: 'Docs' })` over a long CSS selector?**  
**A.** Roles and accessible names reflect **how assistive tech and users perceive** the UI. They survive harmless markup/CSS refactors better than brittle chains like `div.header > a:nth-child(2)`.

**Q4. What’s the difference between `page.goto()` and clicking a link?**  
**A.** **`goto`** navigates to a URL directly (full load semantics). A **link click** follows **user intent** and may trigger SPA routing, analytics, or middleware; you assert **URL + content** afterward either way.

**Q5. What happens if an element never becomes clickable?**  
**A.** Playwright **times out**: the action throws, the test **fails**, and you get an error (timeout / strict mode violation). Fix locators, timing assumptions, or app bugs.

---

## Code Explanation

*Walkthrough of `tests/day2.spec.ts` — plain language, interview-ready.*

### What this test does (big picture)

The test opens the Playwright marketing site home page, clicks the **Docs** link in the main navigation, then checks that the URL looks like a docs page and that the main content mentions **Installation**. That proves **navigation works** the way a user would expect.

### What `test()` does

`test('title', async () => { ... })` **registers one scenario** with the Playwright Test runner. The string is the **test name** (shown in reports). The runner executes the async function body, counts pass/fail, and can run many tests in parallel. `test.describe(...)` groups related tests under one heading without changing that idea—each inner `test(...)` is still one case.

### What `page` is

`page` is **one browser tab**. In `async ({ page }) => { ... }`, the **`page` fixture** gives you a fresh tab managed by the runner (isolation between tests). You call `page.goto(...)`, create locators from `page`, and pass `page` into `expect(page)` for URL-level checks.

### How `click` works here

`await docsLink.click()` does **not** instantly poke the DOM. Playwright waits until the located element is **usable** (visible, stable, enabled, not covered), scrolls if needed, then sends **real pointer events**. So the click mimics a user and stays reliable across slower loads.

### How Playwright finds elements

The code chains locators:

1. `page.getByRole('navigation', { name: 'Main' })` narrows to the **main nav** landmark users (and assistive tech) recognize.
2. `.getByRole('link', { name: 'Docs', exact: true })` finds a **link** whose accessible name is exactly **Docs**.

Playwright resolves these **when you act or assert**, using the accessibility tree and roles—not just raw CSS—so tests align with how the UI is labeled.

### What auto-waiting is (in this file)

- **`await docsLink.click()`**: auto-waits until the Docs link matches and is ready to click (or times out).
- **`await expect(page).toHaveURL(/docs/)`** and **`await expect(...).toContainText(...)`**: Playwright **retries** these assertions until they pass or hit the assertion timeout.

So you avoid sprinkling fixed `sleep()` calls; the runner polls until conditions hold.

### What happens if the element is not found

If no element matches the locator within the **action timeout**, **`click()` throws** (timeout error), the test **fails**, and you get a traceback and (per config) screenshots/traces. If **multiple** elements match and the locator is not unique, Playwright may throw a **strict mode violation** until you tighten the locator. Fix by improving selectors, waiting on the right state, or fixing UI bugs—not by arbitrary long sleeps.
