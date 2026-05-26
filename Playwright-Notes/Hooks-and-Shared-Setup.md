# Hooks and Shared Setup — Playwright (concise)

Purpose: give tests a small, repeatable foundation so each test focuses on assertions, not navigation or setup.

- **beforeEach:** Ensures each test starts from a known state (e.g., open home page or reset data). Use for per-test navigation and lightweight state setup.

- **Reduce repeated setup code:** Move common steps (go to page, log basic telemetry, clear localStorage) into hooks instead of copying them into every test.

- **Shared object usage:** Instantiate page objects inside hooks or pass them via fixtures so tests can reuse methods like `home.openHomePage()` or `login.loginWithCredentials()`.

- **Declaration vs initialization:** Declare variables at top scope (`let home: HomePage;`) but initialize inside the hook (`home = new HomePage(page);`). This prevents cross-test reuse of the same instance and keeps test scope explicit.

- **Reusable test setup:** Prefer `beforeEach` for per-test setup, `beforeAll` for expensive one-time setup (seed DB, auth once), and fixtures for parametrized or reusable resources.

- **Cleaner framework structure:** Keep hooks and small shared helpers in `fixtures/` or `Playwright-Notes` and keep tests focused; this reduces noise and eases onboarding.

- **Why hooks improve maintainability:**
	- Less duplicated code → fewer bugs when flows change.
	- Centralized changes: update navigation in one place.
	- Clear intent: tests read like assertions, not choreography.

Quick interview-ready example:

```ts
// tests/example.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';

test.beforeEach(async ({ page }) => {
	// declare at top if needed between hooks/tests
	const home = new HomePage(page);
	await home.openHomePage();
});

test('shows signup link', async ({ page }) => {
	const home = new HomePage(page);
	await home.verifyHomePageLoaded();
});
```

Practical tips (1-line each):
- Keep `beforeEach` fast; slow setup belongs in `beforeAll` or external fixtures.
- Use page objects inside hooks to avoid test-level selectors.
- Declare variables outside hooks only when you intentionally share state per test run (not across tests).
- Document what each hook guarantees (URL, logged-in, seeded data).

Where to put this file: keep it next to other notes in `Playwright-Notes` for quick interview prep.

