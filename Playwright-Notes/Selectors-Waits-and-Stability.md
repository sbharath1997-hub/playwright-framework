# Selectors, Waits, and Stability in Playwright

## 1. Locator Strategy
- Prefer stable selectors: `data-testid`, `data-test`, `role`, and semantic locators.
- Use `role=` selectors when possible for accessibility-compatible tests.
- Avoid brittle selectors: deep CSS/XPath, positional selectors, and class names that change with UI updates.
- Validate locators in Inspector or DevTools before adding them to code.
- Stable locators are the first line of defense against flaky automation.

## 2. Playwright Auto Waiting
- Playwright auto-waits for actions like `click()`, `fill()`, `selectOption()`, and `goto()`.
- Auto-wait checks element visibility, enabled state, and stability before acting.
- Use built-in waiting instead of manual polling for most interactions.
- Example: `await page.click('button:has-text("Submit")')` waits until the button is actionable.
- Avoid `force: true` unless you intentionally bypass waiting for a special case.

## 3. Explicit Waits
- Use explicit waits only when the default auto-wait does not cover the application behavior.
- Common explicit waits:
  - `await page.waitForSelector(selector, { state: 'visible' })`
  - `await page.waitForResponse(response => response.url().includes('/api'))`
  - `await page.waitForLoadState('networkidle')`
  - `await page.waitForFunction(() => window.appReady === true)`
- Explicit waits are best for app-specific conditions, async updates, or network-driven state changes.
- Avoid hard waits like `waitForTimeout(5000)` except for temporary debugging.

## 4. Wait Types and When to Use Them
- Auto wait: use for most element actions and navigation.
- `waitForSelector(...)`: when you need a specific state such as `visible`, `attached`, or `hidden`.
- `waitForResponse(...)` / `waitForRequest(...)`: when you depend on a backend call.
- `waitForLoadState('load'|'domcontentloaded'|'networkidle')`: when page load is tied to a lifecycle event.
- `waitForFunction(...)`: when you need a custom condition beyond a simple element state.
- Use `networkidle` for pages with multiple API calls, but prefer lighter states for simple pages.
- Prefer application-specific conditions over generic timing assumptions.

## 5. Timeouts
- Global test timeout: limits full test duration and avoids hanging suites.
- Action timeout: controls how long Playwright waits for actions such as click or fill.
- Assertion timeout: Playwright retries assertions until the condition is met or the timeout expires.
- Configurable values:
  - `timeout` in `playwright.config.ts`
  - `test.setTimeout(ms)` for individual tests
  - `expect(locator).toBeVisible({ timeout: 10000 })`
- Keep timeouts realistic for your application and CI environment; avoid making them excessively large.

## 6. Retries
- Retries are a safeguard for intermittent failures, not a substitute for stability.
- Configure retries in `playwright.config.ts` or with `test.describe.configure({ retries: 1 })`.
- Use retries sparingly and keep the count low (typically 1-2).
- Prefer fixing the underlying cause before relying on retries.
- Good use cases: transient network glitches, unstable external services, CI infrastructure noise.

## 7. Flaky Tests
- A flaky test passes or fails unpredictably without code changes.
- Common causes:
  - Timing issues and race conditions
  - Unstable selectors or changing DOM structure
  - Network latency and asynchronous API responses
  - Shared state between tests
  - Animations or transitions that alter element readiness
- Detect flakiness with repeated runs or `--repeat-each`.
- Fix the root cause instead of masking it with retries or long sleeps.

## 8. Stability Best Practices
- Use fresh browser contexts and isolate state between tests.
- Avoid shared state from cookies, local storage, or previous test data.
- Prefer stable selectors and avoid fragile DOM structure assumptions.
- Mock or stub external dependencies when possible.
- Bake waiting into page object methods and test utilities.
- Capture traces, screenshots, or logs when failures occur to diagnose flaky behavior.
- Tune CI-specific settings for slower or noisier environments.

## 9. Common Mistakes
- Relying on `waitForTimeout()` or hard sleeps to solve flakiness.
- Using fragile selectors based on CSS classes, indexes, or dynamic structure.
- Ignoring Playwright auto-wait and manually waiting for every action.
- Applying `force: true` broadly to bypass built-in waiting.
- Adding retries before understanding the failure mode.
- Mixing test setup and assertions without clear isolation.

## 10. Common Interview Questions
- Why do Playwright tests become flaky?
  - Because of timing issues, unstable selectors, network variability, shared state, and async UI updates.
- What is the difference between auto-waiting and explicit waits?
  - Auto-waiting is built into Playwright actions and waits for readiness automatically; explicit waits are developer-controlled waits for specific conditions.
- Why are hard waits discouraged?
  - They slow down tests, do not adapt to actual load times, and still fail when conditions take longer than expected.
- How should retries be used?
  - Use retries sparingly for transient failures after investigating root causes; keep retry counts low.
- How do you stabilize tests in CI environments?
  - Use isolation, stable selectors, proper timeouts, targeted retries, mocked dependencies, and CI-tuned configuration.

## Source Review Notes
### Duplicate content found across the source files
- Definitions and causes of flaky tests repeated in all three files.
- Guidance to avoid hard waits and prefer smart waits / auto-wait.
- Stable selector recommendations: role selectors, data-test ids, and avoiding brittle CSS/XPath.
- Retry advice: use sparingly, low count, and fix root causes.
- Playwright auto-wait behavior and the benefit of waiting for actionable elements.

### Unique content worth preserving
- `waitForFunction()` and `waitForResponse()` use cases from `Stable-Waits-and-Flaky-Test-Prevention.md`.
- `expect.configure({ timeout: ms })` and assertion timeout details from `Retries-Timeouts-and-Test-Stability.md`.
- Debugging tools and trace/capture guidance from `Playwright-Waits-Selectors-and-Debugging.md`.
- Specific CI stability notes: fresh contexts, network handling, and `--shard` or parallel execution strategies.

### Recommendation on original files
- Archive or delete the original files after verifying the merged note contains the needed content.
- Keep the new merged file as the primary reference for waits, selectors, retries, and stability.
- Preserve original files only if there is a need to keep historical versions; otherwise, they can be removed to reduce duplication.
