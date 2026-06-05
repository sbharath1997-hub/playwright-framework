# Playwright Tags and Selective Test Execution

## Purpose of Tags

- Tags group tests by intent, speed, or feature area.
- They make it easy to run only relevant tests during development, debugging, or CI.
- Good tagging improves suite organization and keeps feedback fast.

## Tag Categories

- `@smoke`: critical, fast checks of core application behavior.
- `@regression`: broader coverage for verifying existing functionality after changes.
- `@api`: backend-focused checks.
- `@ui`, `@critical`, `@slow`: use consistently for clarity and filtering.

## Writing Tagged Tests

- Keep tags consistent in names and suite descriptions.
- Use `test.describe` or test titles to make intent clear.

Example:

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

- Tag tests when they are added or refactored.
- Prefer explicit tag labels over relying on folder structure alone.

## Selective Execution Using `--grep`

- Run smoke tests: `npx playwright test --grep "@smoke"`
- Combine tags: `npx playwright test --grep "(@smoke|@api)"`
- Exclude tags: `npx playwright test --grep-invert "@slow"`

## CI Pipeline Strategy

- PR builds: run fast smoke checks.
- Merge or release pipelines: run broader regression suites.
- Nightly or full-validation: include `@api`, `@ui`, and critical regression coverage.

## Cross-Browser Execution

- Run across supported browsers: `npx playwright test --project=chromium --project=firefox --project=webkit`
- Use browser-specific tags for targeted checks: `@webkit`, `@firefox`, `@chromium`.
- Skip tests outside a browser context:

```ts
test('webkit-only: layout check', async ({ browserName }) => {
  test.skip(browserName !== 'webkit', 'Only WebKit layout is relevant');
  // ...
});
```

- Browser-specific failures often indicate rendering differences, feature support, or timing variations.
- Debug with project-specific runs, `--repeat-each`, Playwright traces, screenshots, and logs.

## API Test Categorization

- Tag API tests separately from UI tests when possible.
- Use `@api` for backend verification and `@smoke` or `@regression` when the API test supports a business flow.
- This helps choose fast API checks for quick validation and broader API regression for stability.

## Common Tagging Mistakes

- Inconsistent tag syntax (`smoke` vs `@smoke`).
- Tagging too many tests as smoke.
- Forgetting to update tags when test scope changes.
- Using structure alone instead of explicit tags.

## Common Interview Questions

- What is a test tag?  
  A label that lets you group and selectively run tests without changing implementation.

- How do you run a subset of tests?  
  Use `npx playwright test --grep "<tag>"` and `--grep-invert` to exclude.

- Smoke vs regression?  
  Smoke is fast, critical validation; regression is broader coverage after changes.

- How do you handle browser-specific tests?  
  Use browser tags or `test.skip(browserName !== '<browser>')`, and run targeted `--project` executions.

> Tip: In interviews, describe tags as a lightweight routing mechanism for development, CI staging, and suite reliability.