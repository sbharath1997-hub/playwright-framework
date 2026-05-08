# Playwright Automation Framework

Playwright automation framework built with TypeScript and Page Object Model (POM). It contains foundational checks and realistic end-to-end navigation flows.

## Technologies Used

- `@playwright/test`
- TypeScript
- Page Object Model (POM)
- Data-driven test design
- Playwright HTML and list reporters

## Current Scenarios Automated

- Day 1: Basic smoke test on `example.com`
- Day 2/3: Navigation and content verification on `playwright.dev`
- Day 4: Login navigation flow on `automationexercise.com`
- Day 5: Data-driven invalid login validation using reusable datasets

## Test Data Approach

Reusable datasets live in `test-data/` and are consumed by specs in loops.
This keeps input variations separate from test flow logic and makes coverage easier to extend.

## How to Run Tests

Install dependencies:

```bash
npm install
```

Run all tests:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/day4-login.spec.ts
```

Run headed Chromium for Day 4 flow:

```bash
npx playwright test tests/day4-login.spec.ts --project=chromium --headed
```

Run headed Chromium for Day 5 data-driven login flow:

```bash
npx playwright test tests/day5-login-data-driven.spec.ts --project=chromium --headed
```

Work in progress. Additional scenarios will be added incrementally.
