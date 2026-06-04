# Hooks and Fixtures

## Hooks Overview

Playwright hooks are test lifecycle callbacks used for setup and teardown.
- `beforeAll` / `afterAll`: run once for a file or `describe` block.
- `beforeEach` / `afterEach`: run before or after every test.
- Use hooks to keep tests focused on assertions instead of navigation or state setup.
- Prefer hooks for shared behavior and fixtures for reusable resources.

## beforeAll

Use `beforeAll` for expensive one-time setup and shared resources.
- Good for browser launch, database seed, API login token retrieval.
- Avoid storing mutable state that tests may alter.

Example:
```ts
import { test } from '@playwright/test';

let authToken: string;

test.beforeAll(async () => {
  authToken = await getAuthToken();
});

test('uses shared auth', async ({ request }) => {
  const response = await request.get('/api/data', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  expect(response.ok()).toBeTruthy();
});
```

Interview point: `beforeAll` is for setup that can safely be shared and is too slow to repeat per test.

## beforeEach

Use `beforeEach` for test isolation and repeatable state.
- Initialize page objects and navigate to the starting page.
- Reset state between tests.
- Keep it fast so the suite remains stable.

Example:
```ts
import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';

let home: HomePage;

test.beforeEach(async ({ page }) => {
  home = new HomePage(page);
  await home.openHomePage();
});

test('shows signup link', async () => {
  await home.verifyHomePageLoaded();
});
```

Interview point: `beforeEach` is the default choice for UI tests because it rebuilds a clean test context.

## afterEach

Use `afterEach` to clean up per-test side effects.
- Close popups, clear cookies/localStorage, or log failure details.
- Use it when a test changes the environment and the next test needs a fresh start.

Example:
```ts
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
  }
  await page.context().clearCookies();
});
```

Interview point: `afterEach` ensures tear-down logic is applied consistently, reducing flakiness.

## afterAll

Use `afterAll` for final cleanup of shared resources.
- Close browser instances opened in `beforeAll`.
- Release test-wide fixtures or global test data.

Example:
```ts
import { Browser } from '@playwright/test';
let browser: Browser;

test.beforeAll(async ({ playwright }) => {
  browser = await playwright.chromium.launch();
});

test.afterAll(async () => {
  await browser.close();
});
```

Interview point: `afterAll` pairs with `beforeAll` and is the place to free expensive resources.

## Fixtures

Fixtures are Playwright’s dependency injection mechanism.
- Tests declare what they need in the callback signature.
- Playwright resolves fixture values by name.
- Fixtures are useful for reusable pages, logged-in sessions, database helpers, and custom setup.

Example:
```ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.openHomePage();
    await use(homePage);
  },
});

test('uses homePage fixture', async ({ homePage }) => {
  await homePage.verifyHomePageLoaded();
});
```

Interview point: fixtures reduce duplication and centralize creation logic. Avoid outer-scope initialization; keep state inside fixture callbacks.

## Shared Setup

Shared setup is about reusable test foundations.
- Use fixtures for common objects and page object creation.
- Use hooks for repetitive flow steps specific to a file or scenario.
- Combine both when a reusable fixture needs extra per-test navigation.

Example pattern:
- Custom `baseTest` defines fixtures for `homePage`, `loggedInUser`, `apiClient`.
- Individual spec files use `beforeEach` for page-specific navigation and cleanup.

Interview point: shared setup helps teams maintain consistent test structure and removes duplicate boilerplate.

## Best Practices

- Prefer `beforeEach` for isolation; use `beforeAll` only when repeated setup is too expensive.
- Keep hooks short and intention-revealing.
- Avoid sharing mutable objects across tests.
- Initialize variables inside hooks or fixtures, not in outer scope.
- Use `afterEach` to revert state and `afterAll` to release shared resources.
- Choose fixtures for reusable resources instead of embedding logic in every test.
- Document what each hook guarantees: starting URL, logged-in state, seeded data, etc.

## Common Interview Questions

- `when should you use beforeAll instead of beforeEach?`
  - One-time expensive setup or shared resource creation, when tests can safely use the same state.

- `what is a Playwright fixture?`
  - A reusable setup resource injected into tests by name, often located in `baseTest` or a fixture file.

- `how do you avoid flaky tests with hooks?`
  - Use `beforeEach` for clean state, avoid shared mutable state, and keep teardown in `afterEach`.

- `what is the difference between hooks and fixtures?`
  - Hooks control lifecycle timing, fixtures provide injected resources and reusable setup.

- `how would you structure page object initialization?`
  - Declare the variable at file scope if needed, but initialize inside `beforeEach` or a fixture so each test gets a fresh instance.
