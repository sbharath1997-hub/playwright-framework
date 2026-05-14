# Stable Waits and Flaky Test Prevention

## Flaky Tests

Flaky tests are tests that pass or fail unpredictably without code changes. Common causes:
- Timing issues with element loading
- Unstable selectors that change with UI updates
- Network dependencies causing intermittent failures
- Shared state between tests (cookies, local storage)
- Race conditions in asynchronous operations

**Prevention strategies:**
- Use stable selectors (role-based, data-test IDs)
- Isolate test state with fresh browser contexts
- Avoid hard waits; rely on smart waits
- Mock external dependencies
- Run tests in parallel with proper isolation

## Hard Waits vs Smart Waits

### Hard Waits
- **Definition:** Fixed time delays like `waitForTimeout(5000)`
- **Problems:** Cause unnecessary delays, increase test execution time, still fail if element takes longer than expected
- **When to avoid:** Almost always; leads to flaky tests and slow suites

### Smart Waits
- **Definition:** Wait for specific conditions or element states
- **Examples:** `waitForSelector()`, `waitForFunction()`, auto-waiting in actions
- **Benefits:** Faster execution, more reliable, adapt to varying load times
- **Best practice:** Prefer smart waits over hard waits in all scenarios

## Playwright Auto-Waiting

Playwright automatically waits for elements before performing actions:
- **Built-in for actions:** `click()`, `fill()`, `selectOption()` wait up to 30 seconds for element to be ready
- **Element states checked:** Visible, stable, enabled, and not animating
- **Configurable:** Set `actionTimeout` in config or per action
- **Benefits:** Reduces flakiness, eliminates most explicit waits
- **Override when needed:** Use `force: true` for immediate actions (rare)

## Condition-Based Waits

Wait for specific application conditions rather than arbitrary time:
- **waitForFunction:** `await page.waitForFunction(() => document.querySelector('.loaded').textContent === 'Ready')`
- **waitForSelector:** `await page.waitForSelector('.success-message', { state: 'visible' })`
- **waitForResponse:** `await page.waitForResponse(response => response.url().includes('/api/data'))`
- **Custom conditions:** Combine with page.evaluate for complex logic
- **Best practice:** Wait for meaningful state changes, not just element presence

## Network Idle Load State

`networkidle` is a load state option for `page.goto()`:
- **Definition:** Page is considered loaded when there are no network connections for at least 500ms
- **Usage:** `await page.goto(url, { waitUntil: 'networkidle' })`
- **When to use:** For pages with heavy JavaScript or multiple API calls
- **Alternatives:** `'load'` (DOM ready), `'domcontentloaded'` (HTML parsed)
- **Caution:** May wait too long for chatty applications; prefer `'load'` for most cases