## Debugging Approaches

### Headed Mode
Useful for visually observing browser execution.

### VS Code Breakpoints
Useful for pausing execution and inspecting flow step-by-step.

### Playwright Inspector
Useful for advanced debugging, locator inspection and flaky test analysis.

## Flaky Tests

- **Definition:** tests that pass or fail unpredictably without code changes.
- **Common causes:** timing issues, unstable selectors, async page updates, network dependencies, shared state.
- **Detection:** run tests repeatedly or use `--repeat-each` to spot intermittent failures.
- **Mitigation:** isolate state, avoid hard waits, use stable locators, capture traces on failure.
- **Best practice:** fix the root cause, not just retry the test.

## Wait Strategies

- **Auto-wait:** rely on Playwright's built-in waiting for actions like `click`, `fill`, and `goto`.
- **Explicit waits:** use `await page.waitForSelector(selector, { state: 'visible' })` only when needed.
- **Network waits:** use `await page.waitForResponse()` or `waitUntil: 'networkidle'` for API-driven pages.
- **Avoid:** `waitForTimeout` except for debugging; hard waits cause flakiness and slow tests.
- **Best pattern:** wait for an application-specific condition, then perform the action.

## Selector Best Practices

- **Prefer role selectors:** `role=button[name="Submit"]` is resilient and accessibility-friendly.
- **Use data-test ids:** `[data-testid="login-button"]` is stable and decoupled from styling.
- **Avoid brittle selectors:** do not depend on deeply nested XPath or CSS classes that change often.
- **Use text selectors carefully:** `text=Submit` is fine for unique labels, but avoid vague text.
- **Validate selectors:** test locators in Inspector or browser DevTools before adding them to code.