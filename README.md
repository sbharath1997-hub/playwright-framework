# Playwright Automation Framework

A learning-focused Playwright automation framework built with TypeScript and Page Object Model (POM) design principles. The project is evolving from basic navigation checks into realistic end-to-end web flows.

## Technologies Used

- `@playwright/test`
- TypeScript
- Page Object Model (POM)
- Playwright HTML and list reporters

## Current Scenarios Automated

- Day 1: Basic smoke test on `example.com`
- Day 2/3: Navigation and content verification on `playwright.dev`
- Day 4: Realistic login navigation flow on `automationexercise.com`

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

*Work in progress - initial version will be pushed soon.*
