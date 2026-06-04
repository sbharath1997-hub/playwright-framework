# Framework Design and Page Object Model (POM)

## 1. What is POM

Page Object Model (POM) is a test design pattern where each screen or coherent UI area is represented by a class or module that encapsulates locators and actions.

In a Playwright framework, page objects expose methods such as `navigateToHome()`, `clickDocs()`, or `verifyDocsPage()` so test cases operate at the level of user intent instead of repeating raw `getByRole`, `locator`, and `click()` calls.

The page object becomes the contract between tests and the application UI.

---

## 2. Why POM

POM is valuable because it moves UI implementation details out of test scenarios and into a single, maintainable layer.

Key reasons:

- Reuse: the same page actions support multiple tests and flows.
- Maintainability: locator updates or UI flow changes are fixed in one location.
- Readability: tests read like business scenarios, not DOM wiring.
- Stability: stable selectors and methods reduce brittle duplicate locator chains.

Use POM when you have more than one test covering the same page or flow, or when selectors are non-trivial and likely to change.

---

## 3. Page Object Structure

A page object should contain:

- a constructor that accepts `Page` or a fixture context
- locators defined once, using stable selectors like `getByRole`, labels, or test IDs
- action methods for navigation and user interactions
- page-specific verification methods for expected page state

Example structure:

```ts
import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly docsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.docsLink = page.getByRole('link', { name: 'Docs', exact: true });
  }

  async navigateToHome() {
    await this.page.goto('https://example.com');
  }

  async clickDocs() {
    await this.docsLink.click();
  }

  async verifyDocsPage() {
    await expect(this.page).toHaveURL(/docs/);
    await expect(this.page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  }
}
```

Keep page objects concise. If a class grows too large, split it by screen, feature area, or reusable component.

---

## 4. Reusable Components

Reusable components are smaller pieces of UI that appear across pages, such as navigation bars, modals, forms, or status panels.

Use component classes or helper modules when a UI fragment is shared by multiple page objects. Example components:

- `HeaderNav` for top-level menu actions
- `LoginForm` for credential entry and submit
- `ModalDialog` for shared confirm/cancel behavior

Composition is usually better than inheritance: page objects can hold component instances and delegate work to them.

Also keep common framework utilities separate:

- selectors and locator helpers
- environment config and base URLs
- custom assertions or stable wait wrappers
- fixture setup for authenticated sessions

Reusable components should expose a clear API, not internal locator details.

---

## 5. Framework Folder Structure

A simple, practical folder layout for a Playwright SDET framework is:

- `tests/` — scenario files and test cases
- `pages/` — page objects and reusable page components
- `fixtures/` — shared setup, custom fixtures, base test extensions
- `utils/` — helper functions, assertions, wait utilities
- `config/` — environment and runner configuration
- `api-utils/` — API helper modules for hybrid or backend-driven workflows

For page objects, consider:

- `pages/homePage.ts`
- `pages/loginPage.ts`
- `pages/components/headerNav.ts`
- `pages/components/loginForm.ts`

This structure separates test intent, UI interaction logic, and shared tooling.

---

## 6. Design Principles

Practical principles for an SDET framework:

- Single Responsibility: page objects should model one page or one coherent UI area.
- High-level API: expose business-focused methods, not low-level DOM operations.
- Stable locators: prefer accessible selectors like `getByRole`, labels, and test IDs.
- Explicit boundaries: tests orchestrate flows; page objects implement the “how.”
- Avoid god objects: split large pages into smaller screen or component classes.
- Keep assertions balanced: page objects may include page-specific checks, but scenario-level business assertions can remain in tests.
- Leverage Playwright features: use auto-wait, retries, and fixtures instead of manual sleeps.

A good design keeps the test readable while making UI changes easier to manage.

---

## 7. Benefits and Limitations

Benefits:

- keeps tests DRY and easier to maintain
- centralizes selector updates and UI flow changes
- makes scenarios easier to scan and review
- supports parallel and stable Playwright execution by reusing consistent page APIs

Limitations:

- too much abstraction can hide test intent and make failures harder to diagnose
- god page objects or excessive page classes add complexity
- not ideal for one-off scripts or tiny suites where extraction overhead outweighs benefit
- assertion placement matters: overloading page objects with business rules reduces clarity

Use POM as a practical framework pattern, not a rigid rule.

---

## 8. Common Framework Interview Questions

Q1. What is the Page Object Model?
A. A pattern where each page or major UI section has a class that encapsulates locators and actions; tests call those methods instead of duplicating selectors.

Q2. Why use POM in a Playwright framework?
A. To reduce duplication, improve maintainability, and make tests read like scenarios by hiding selector and flow details behind page methods.

Q3. What should go into a page object?
A. page-specific locators, action methods, and often reusable verification methods. Keep business-specific assertions in tests when they do not belong to the page contract.

Q4. When is POM not worth it?
A. For very small one-off checks or a tiny suite with only one page; extraction costs outweigh the maintenance benefit.

Q5. How do you keep page objects stable?
A. Use stable selectors, prefer accessibility-style locators, and put retrying/assertion logic in test-friendly methods instead of brittle DOM chains.

Q6. How do reusable components fit into framework design?
A. Shared UI fragments become component classes or helper modules. Page objects compose those components rather than duplicating the same interaction logic.

Q7. What is a common POM pitfall?
A. Creating god objects that know too much about the app, or hiding too much so tests stop reflecting what the user actually does.

---

## Appendix: Recommendation

- Content duplicated across both source files:
  - the general idea that page objects centralize locators and actions
  - POM benefits such as maintainability, reuse, and readability
  - interview-style questions on POM and test design

- Unique content to preserve in the originals if retained:
  - `Page-Object-Model-and-Navigation.md`: navigation-specific Playwright behavior, click auto-wait mechanics, and action-level interview questions about `click()`/`goto()`/selectors
  - `Reusable-Page-Objects-and-Framework-Structure.md`: the core POM definition, directly framed page object example, and decision criteria for extracting page objects

- Recommendation:
  - Archive or delete the original files if you want a single current reference for framework design and POM.
  - If you keep them, retain `Page-Object-Model-and-Navigation.md` only as a separate Playwright navigation mechanics note, and consider archiving `Reusable-Page-Objects-and-Framework-Structure.md` because its core content is now captured in this merged note.
