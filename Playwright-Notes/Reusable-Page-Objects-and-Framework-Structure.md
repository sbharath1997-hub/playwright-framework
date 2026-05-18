# Day 03 — Page Object Model (POM)

## What Page Object Model is

**Page Object Model** is a pattern where each screen (or cohesive part of the UI) gets a **class or module** that **hides** raw selectors and low-level Playwright calls behind **named methods** (`navigateToHome`, `clickDocs`, `verifyDocsPage`). Tests call those methods instead of repeating `getByRole` chains and `click()` everywhere.

---

## Why it is important

E2E tests mirror user journeys, but the **DOM is noisy**: labels move, roles stay stable. POM gives you **one place** to update when the UI changes. It also makes tests read like **specifications** (“go home, open docs, assert docs”) instead of implementation details.

---

## Benefits

| Benefit | What it means |
|--------|----------------|
| **Reusability** | The same page object can back many tests (smoke, regression, different data) without duplicating locators. |
| **Maintainability** | Selector or flow changes touch **one class**, not every test file that visited that page. |
| **Readability** | `homePage.clickDocs()` is easier to scan than a five-line locator chain in each test. |

---

## When to use it

Use POM when:

- You have **more than one test** hitting the same page or flow.
- **Selectors are non-trivial** or likely to change with redesigns.
- You want **clear boundaries** between “how we find/control the UI” (page object) and “what scenario we care about” (test).

For a **one-off throwaway script**, a tiny inline test can stay simple; as the suite grows, extract page objects.

---

## Simple example (this project)

**Page object** (`pages/homePage.ts`): owns navigation to home, the Docs link in the main nav, and assertions that the docs URL and main content look right.

**Test** (`tests/day2.spec.ts`): constructs `new HomePage(page)`, then calls `navigateToHome()`, `clickDocs()`, `verifyDocsPage()`.

---

## Interview questions

**Q1. What is the Page Object Model?**  
**A.** A design pattern where each page (or major UI area) is represented by a class that **encapsulates locators and actions**. Tests orchestrate user flows by calling methods on those objects instead of embedding selectors in every test.

**Q2. What problem does POM solve?**  
**A.** **Duplication and fragility**: without it, the same selectors and steps appear in many tests; one UI tweak breaks many files. POM centralizes that knowledge so fixes and refactors are localized.

**Q3. Should every assertion live in the page object?**  
**A.** **Often actions and page-specific checks** (e.g. “we landed on docs”) live in the page object for reuse. **High-level business rules** or scenario-specific expectations sometimes stay in the test for clarity. Teams vary; consistency matters more than dogma.

**Q4. How does POM improve test structure?**  
**A.** Tests become **short scenario descriptions**: arrange/act with page methods, assert with methods or explicit `expect` in the test. Implementation detail (roles, exact strings, chains) moves **down** into page objects.

**Q5. What is a downside or pitfall of POM?**  
**A.** **Over-large “god” page objects** or **too many tiny classes** can both hurt. Also, hiding *everything* can make failures harder to read if method names don’t match user language. Balance reuse with clarity and split pages when a class does too much.
