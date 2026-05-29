# Test Tagging and Selective Execution

## Purpose of Test Tagging

- Tagging groups tests by purpose, speed, or feature.
- It makes it easy to run only relevant tests during development, debugging, or CI.
- Tags help keep large suites organized and reduce wasted execution time.

## Smoke vs Regression Tests

- **Smoke tests**: fast checks for core app health and critical flows.
- **Regression tests**: broader coverage that verifies existing functionality after changes.
- Use smoke for quick validations and regression for full verification.

## Using Tags in `test.describe`

- Add tags to suites or individual tests with `test.describe` and custom names.
- Example:

```ts
import { test } from '@playwright/test';

test.describe('login', () => {
  test('smoke: can sign in', async ({ page }) => {
    // ...
  });

  test('regression: invalid password shows error', async ({ page }) => {
    // ...
  });
});
```

- Keep tags consistent: `smoke`, `regression`, `api`, `ui`, `critical`, etc.

## Running Tests with `--grep`

- Use `npx playwright test --grep "smoke"` to run tagged smoke tests.
- Combine multiple tags with regex, for example: `--grep "(smoke|critical)"`.
- Exclude tags with `--grep-invert "@slow"` when you want a quick run.

## Benefits of Selective Execution

- Faster feedback loop for developers.
- Easier isolation of failures.
- Reduced CI cost and quicker builds.
- Better focus on high-value tests during pull request validation.

## Cross-Browser Execution Considerations

- Run tagged tests across supported browsers: `--project=chromium`, `--project=firefox`, `--project=webkit`.
- Use browser-specific tags or describe blocks for known differences.
- Example:

```ts
test('webkit-only: layout check', async ({ browserName }) => {
  test.skip(browserName !== 'webkit', 'Only WebKit layout is relevant');
  // ...
});
```

## Identifying Browser-Specific Failures

- Compare test outcomes across browser projects.
- If a failure appears only in one browser, mark it as browser-specific.
- Add targeted tags like `@webkit` or `@firefox` to help reproduce and triage.

## Debugging Flaky Cross-Browser Tests

- Re-run failures on the same browser with `--project` and `--repeat-each`.
- Use Playwright trace and screenshot artifacts.
- Focus on flaky tests in smoke or critical paths first.
- Isolate environment factors: viewport, locale, network, timing.

## Practical Tagging Strategy for Automation Frameworks

- Define a small set of stable tags: `smoke`, `regression`, `api`, `ui`, `critical`, `slow`.
- Tag tests when they are added or refactored.
- Use `--grep` for local development and CI stages.
- Keep smoke tests lean and reliable.
- Use regression tags for broader coverage and nightly runs.

> Tip: A good tagging strategy makes tests easier to run for both interviews and real-world automation teams.
