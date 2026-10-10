# Playwright documentation navigation — Chromium comparison plan

## Application Overview

Scope: only playwright.dev documentation entry navigation via Docs in Main and Get started on the home page. Project: chromium. Seed: tests/agent-lab/seed.spec.ts; planner_setup_page completed before browser exploration. Live observations on 2026-10-10: both entry links advertise /docs/intro and both clicks reached https://playwright.dev/docs/intro with title Installation | Playwright and a visible Installation heading. Read pages/homePage.ts, fixtures/baseTest.ts, tests/playwright-docs.spec.ts, and tests/playwright-homepage-smoke.spec.ts using PowerShell Get-Content -LiteralPath. HomePage scopes Docs to navigation Main; verifyDocsPage currently checks a broad /docs/ URL and visible Installation heading. baseTest supplies HomePage without navigating. Assumptions: each scenario starts in a blank, fresh Chromium context with no retained cookies, local storage, prior navigation, or language choice; public site is reachable and uses default Node.js documentation; configured baseURL resolves to https://playwright.dev/ if relative navigation is used. Scenarios are independent and runnable in either order. Intentional comparison coverage: scenario 1 overlaps the Docs smoke test; scenario 2 overlaps the Get Started smoke test. Use the observed exact origin/path to strengthen destination comparison without changing existing tests. Negative checks are wrong-route and missing-content failure conditions within these two flows; no error injection or unrelated exploration. Proposed files are planning suggestions only; no tests are generated.

## Test Scenarios

### 1. Documentation entry points — intentional comparison coverage

**Seed:** `tests/agent-lab/seed.spec.ts`

#### 1.1. Docs in Main navigation opens Installation — intentional comparison coverage

**File:** `tests/agent-lab/generated/playwright-docs-main-navigation.spec.ts`

**Steps:**
  1. Starting state: create a blank, fresh Chromium browser context/page; navigate to https://playwright.dev/ independently of any other scenario.
    - expect: Home page URL is https://playwright.dev/; Main navigation is visible. Assumptions: public site reachable, default Node.js documentation, no saved state.
  2. Within navigation named Main, locate the link with exact accessible name Docs. Check it is visible and points to /docs/intro.
    - expect: The intended Docs link is uniquely identified in Main; unrelated API, MCP, CLI, or footer links are not selected.
  3. Click Docs in Main navigation and wait for navigation to settle.
    - expect: Destination URL is https://playwright.dev/docs/intro (observed live); title is Installation | Playwright (observed live).
  4. Verify the heading with exact accessible name Installation is visible on the destination.
    - expect: Installation heading is visible (verified live). Success requires correct origin/path and visible Installation content. Negative/failure conditions: missing or ambiguous Docs control, click failure, staying on home, wrong origin/path or language route, error page, missing/hidden Installation heading. Intentional comparison coverage with tests/playwright-docs.spec.ts: same entry route and heading, with exact destination comparison rather than HomePage.verifyDocsPage's broad /docs/ match.

#### 1.2. Home Get started opens Installation — intentional comparison coverage

**File:** `tests/agent-lab/generated/playwright-docs-get-started.spec.ts`

**Steps:**
  1. Starting state: create a separate blank, fresh Chromium browser context/page; navigate directly to https://playwright.dev/ without relying on scenario 1.
    - expect: Home page URL is https://playwright.dev/. Assumptions: public site reachable, default Node.js documentation, no retained state or language selection.
  2. Locate the home hero link with exact accessible name Get started; verify visibility and href /docs/intro. Do not select footer Getting started.
    - expect: Home Get started call to action is visible and identifies the intended documentation route.
  3. Click home Get started and wait for navigation to settle.
    - expect: Destination URL is https://playwright.dev/docs/intro (observed live); title is Installation | Playwright (observed live).
  4. Verify the heading with exact accessible name Installation is visible on the destination.
    - expect: Installation heading is visible (verified live). Success requires correct origin/path and visible Installation content. Negative/failure conditions: missing/ambiguous call to action, click failure, staying on home, unexpected origin/path or language route, error page, missing/hidden Installation heading. Intentional comparison coverage with tests/playwright-homepage-smoke.spec.ts, test Get Started link is visible: same click and heading checks, with exact origin/path comparison.
