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
