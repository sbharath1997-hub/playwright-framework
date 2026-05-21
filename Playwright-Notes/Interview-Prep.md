# Playwright Interview Revision Guide

## Playwright basics

### Q1: What is Playwright?
**A:** A browser automation framework for Chromium, Firefox, and WebKit.

### Q2: Why use Playwright over Selenium?
**A:** Playwright provides cross-browser automation using a single API, built-in auto-waiting, faster execution, and powerful debugging capabilities.

### Q3: How do you open a page?
**A:** `const page = await browser.newContext().newPage();`

### Q4: What is `page.goto()` for?
**A:** Navigating to a URL and waiting for the page to load.

### Q5: How does Playwright wait for elements?
**A:** It auto-waits before actions like click and fill.

## Page Object Model (POM)

### Q1: What is POM?
**A:** A pattern that keeps page selectors and actions in one class.

### Q2: Why use POM?
**A:** It makes tests easier to read and update.

### Q3: What should a page object contain?
**A:** Selectors and methods for page actions.

### Q4: How do you use a page object?
**A:** `const login = new LoginPage(page); await login.login(user, pass);`

### Q5: What is a business object?
**A:** A higher-level workflow using multiple page objects.

## Framework structure

### Q1: What folders are commonly used in a Playwright framework?
**A:** 
- `pages/` → Page objects
- `tests/` → Test files
- `fixtures/` → Reusable setup
- `utils/` → Common helpers
- `api-utils/` → API reusable methods
- `test-data/` → External datasets

### Q2: Why separate framework layers?
**A:** Better maintainability, reusability, and cleaner test design.

## Selectors

### Q1: What selector types are common?
**A:** Role, data-test-id, CSS, text, and XPath.

### Q2: Which selector is best?
**A:** Role or data-test-id for stability.

### Q3: Why avoid XPath?
**A:** It is brittle and hard to maintain.

### Q4: How do you select by text?
**A:** Use `text=Submit` or `page.locator('button', { hasText: 'Submit' })`.

### Q5: What is selector priority?
**A:** Prefer role/data-test-id, then CSS, then XPath.

## Waits and flaky test prevention

### Q1: What wait options should you use?
**A:** Auto-wait, `waitForSelector`, `waitForResponse`, and `waitForFunction`.

### Q2: Why avoid fixed waits?
**A:** They cause flakiness and slow tests.

### Q3: What causes flaky tests?
**A:** Timing issues, unstable selectors, or shared state.

### Q4: How do you reduce flakiness?
**A:** Use stable selectors and condition-based waits.

### Q5: What is the best practice for network tests?
**A:** Wait for specific responses or mock requests.

## Debugging

### Q1: What are the key tools?
**A:** Inspector, trace viewer, screenshots, and logs.

### Q2: How do you open debug mode?
**A:** `npx playwright test --debug`

### Q3: Why use `page.pause()`?
**A:** To inspect the browser state during a test.

### Q4: How do you analyze failures?
**A:** Check reports, screenshots, and traces.

### Q5: What is the common runtime issue?
**A:** `is not a function` from wrong imports or exports.

## Fixtures

### Q1: What are fixtures?
**A:** Reusable setup/teardown helpers injected into tests.

### Q2: How do you define fixtures?
**A:** With `test.extend()` and `use()`.

### Q3: What scopes do fixtures have?
**A:** Test, describe, or worker scope.

### Q4: Why use fixtures?
**A:** They reduce repeated setup code.

### Q5: How do tests consume fixtures?
**A:** Via test parameters like `async ({ page, loginPage }) => {}`.

## Data-driven testing

### Q1: What is data-driven testing?
**A:** Running one test with multiple data sets.

### Q2: How do you implement it?
**A:** Use arrays of data and loop over them.

### Q3: Why use external data?
**A:** To keep test logic separate from test data.

### Q4: What is the benefit?
**A:** Easier maintenance and better coverage.

### Q5: How do you handle secrets?
**A:** Use environment variables or ignored config files.

## Git basics

### Q1: What is version control?
**A:** A system that tracks code changes over time.

### Q2: What is `.gitignore` for?
**A:** To exclude files like `node_modules`, `.env`, and reports.

### Q3: What is `git commit` vs `git push`?
**A:** Commit saves changes locally; push sends them to remote.

### Q4: What is a branch?
**A:** An isolated line of development for features or fixes.

### Q5: How do you resolve conflicts?
**A:** Edit the conflict markers, stage the file, and commit.

## API GET and POST testing

### Q1: What is a GET request?
**A:** A request to retrieve data.

### Q2: What is a POST request?
**A:** A request to create or submit data.

### Q3: What is status 200?
**A:** Success for read operations.

### Q4: What is status 201?
**A:** Resource created after POST.

### Q5: What should API tests validate?
**A:** Status code, response body, and payload correctness.

### Q6: Why are APIs important in automation testing?
**A:** APIs help create faster, more stable, and scalable automation by reducing dependency on slow UI workflows.

## Reusable API utilities

### Q1: Why use API utilities?
**A:** To avoid repeating request logic.

### Q2: What do utilities include?
**A:** Base URL, headers, auth, and response parsing.

### Q3: How do they help?
**A:** They keep tests clean and consistent.

### Q4: Where do you place them?
**A:** In a shared `api-utils/` folder.

### Q5: How do they support hybrid tests?
**A:** By reusing setup and validation code.

## Hybrid API + UI framework concepts

### Q1: What is hybrid testing?
**A:** Combining API calls with UI checks in one workflow.

### Q2: Why use hybrid tests?
**A:** API setup is faster and UI validation is more realistic.

### Q3: How should code be organized?
**A:** Separate API helpers, page objects, fixtures, and tests.

### Q4: What is a common pattern?
**A:** Use API for setup and UI for end-to-end validation.

### Q5: Why keep API and UI separate?
**A:** Better maintainability and clarity.

## Runtime debugging and stale artifact cleanup

### Q1: What causes `is not a function`?
**A:** Incorrect import/export or a non-function value.

### Q2: How do you debug it?
**A:** Verify import paths and inspect the value before calling it.

### Q3: Why clean stale artifacts?
**A:** Old compiled files can hide recent source changes.

### Q4: How do you clean them?
**A:** Delete generated files and rerun tests.

### Q5: Why is this important?
**A:** It prevents false failures from stale code.

## Single browser debugging workflow

### Q1: What command is recommended?
**A:** `npx playwright test --project=chromium --workers=1`

### Q2: Why one worker?
**A:** It avoids parallel-state issues and simplifies logs.

### Q3: Why Chromium?
**A:** It is stable and consistent for debugging.

### Q4: What is the benefit?
**A:** Easier reproduction of defects.

### Q5: What else helps?
**A:** Use headed mode or Inspector if needed.

## GitHub Copilot debugging usage

### Q1: How should you use Copilot?
**A:** Use it for suggestions, not final answers.

### Q2: What should you check?
**A:** Confirm exports, imports, and logic manually.

### Q3: Can Copilot fix runtime bugs?
**A:** It can help identify patterns but not guarantee correctness.

### Q4: What is the best approach?
**A:** Treat suggestions as drafts and validate them.

### Q5: Why keep notes?
**A:** To remember common fixes and debugging steps.
