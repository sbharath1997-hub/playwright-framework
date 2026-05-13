# Playwright Interview Preparation Guide

## 1. Playwright Basics

### Q1: What is Playwright and what are its key advantages over Selenium?
**A:** Playwright is a modern automation framework by Microsoft supporting multiple browsers (Chromium, Firefox, WebKit). Key advantages:
- **Single API** for all browsers (vs browser-specific drivers in Selenium)
- **Better speed** through multiple parallel test execution
- **Built-in waiting mechanisms** (auto-wait for elements)
- **Network interception** and request/response monitoring
- **Mobile emulation** and device testing built-in
- **Debugging tools** like Inspector and time-travel debugging

### Q2: What are the different ways to launch a browser in Playwright?
**A:** Three main approaches:
1. **Context-based** (recommended): `browser.newContext()` → isolated browser context per test
2. **Incognito mode**: Automatically clears cookies/storage between tests
3. **Service workers**: Persistent contexts for API testing scenarios
```typescript
const context = await browser.newContext();
const page = await context.newPage();
```

### Q3: How does Playwright handle implicit waits compared to Selenium?
**A:** Playwright has **built-in auto-wait** (30-second default):
- Elements are automatically waited for before actions (click, fill, etc.)
- No need for explicit `WebDriverWait` like Selenium
- Configurable via `page.goto()` options: `waitUntil: 'networkidle'`
- Reduces flaky tests caused by timing issues

### Q4: What is the purpose of `page.goto()` vs `page.navigate()`?
**A:** `page.goto()` is the standard method:
- Waits for page to load (configurable via `waitUntil`)
- Options: `'load'`, `'domcontentloaded'`, `'networkidle'`
- Returns the response object
- `page.navigate()` is less commonly used; `goto()` is the recommended practice

### Q5: How do you handle multiple browser tabs/windows in Playwright?
**A:** Use `page.context().pages()` or listen to new page events:
```typescript
const newPage = await context.waitForEvent('page');
await newPage.fill('#input', 'value');
```
This captures popup windows or new tabs automatically.

---

## 2. Page Object Model (POM)

### Q1: What is the Page Object Model and why is it important?
**A:** POM is a design pattern that:
- **Encapsulates** page elements and interactions in separate classes
- **Reduces duplication** - each element defined once
- **Improves maintainability** - UI changes require updates in one place
- **Enhances readability** - tests read like business logic, not technical details
- **Enables reusability** - page objects shared across multiple test files

### Q2: How do you structure a Page Object class in Playwright?
**A:** Typical structure:
```typescript
export class HomePage {
  constructor(private page: Page) {}
  
  // Selectors as private properties
  private searchBox = '#search';
  private submitBtn = 'button[type="submit"]';
  
  // Methods for interactions
  async search(term: string) {
    await this.page.fill(this.searchBox, term);
    await this.page.click(this.submitBtn);
  }
}
```
Keep selectors private, expose high-level business methods.

### Q3: What is the difference between a Page Object and a Business Object?
**A:** 
- **Page Object**: Represents a single page/view with UI elements and direct interactions
- **Business Object**: Higher-level abstraction combining multiple page objects to represent a business process
```typescript
// Page Object
class LoginPage { async login(user, pass) {} }

// Business Object using page objects
class UserJourney {
  async loginAndNavigateToDashboard(user) {
    await loginPage.login(user, pass);
    await navigationPage.clickDashboard();
  }
}
```

### Q4: How do you handle dynamic selectors in Page Objects?
**A:** Pass parameters to methods or use selector factories:
```typescript
async selectDropdownOption(optionText: string) {
  await this.page.click(`//option[text()="${optionText}"]`);
}

// Or use parametrized selectors
private getTabSelector(tabName: string) {
  return `//div[@role="tab" and text()="${tabName}"]`;
}
```

### Q5: How do you initialize Page Objects in tests?
**A:** Pass `page` object from test context:
```typescript
test('example', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  
  await homePage.navigate();
  await homePage.clickLogin();
  await loginPage.login('user', 'pass');
});
```
Alternatively, use fixtures to auto-inject page objects.

---

## 3. Selectors

### Q1: What are the different types of selectors in Playwright?
**A:** Six main types:
1. **CSS selectors**: `'#id'`, `'.class'`, `'button[type="submit"]'`
2. **XPath**: `'//button[@id="submit"]'`, `'//text()="Login"'`
3. **Text selectors**: `'text=Submit'`, `'text=/Submit|Sign In/'`
4. **Placeholder selectors**: Locate by placeholder text
5. **Role-based selectors**: `'role=button[name="Submit"]'` (accessibility-based)
6. **Data test ID**: `'[data-testid="submit-btn"]'`

### Q2: Which selector strategy is best for automation and why?
**A:** **Role-based selectors** are recommended:
- Based on accessibility tree (ARIA roles)
- Resilient to UI changes
- Encourages accessible design
- Example: `'role=button[name="Login"]'` instead of `'.btn.primary'`
- **Fallback order**: Role > Data test ID > CSS > XPath

### Q3: What are the drawbacks of XPath selectors?
**A:** 
- **Hard to maintain** - brittle with DOM structure changes
- **Poor performance** - slower than CSS selectors
- **Difficult to read** - complex expressions reduce clarity
- **Not SEO-friendly** - doesn't align with accessibility
- **Use only when necessary** - for complex scenarios unavoidable with other methods

### Q4: How do you locate elements by text in Playwright?
**A:** Multiple approaches:
```typescript
// Exact text
page.locator('text=Login');

// Partial text
page.locator('text=/Log/');

// Text within element type
page.locator('button', { hasText: 'Submit' });

// Combining with other selectors
page.locator('//button[contains(text(), "Login")]');
```

### Q5: What is selector priority in Playwright and how do you test selectors?
**A:** Use `page.locator()` to test selector robustness:
```typescript
// Test if selector works
await page.locator('role=button[name="Login"]').click();

// Debug selectors with Playwright Inspector
// Run: npx playwright test --debug
```
Priority: Test selectors in browser DevTools first, then implement in code.

---

## 4. Data-Driven Testing

### Q1: What is data-driven testing and when should you use it?
**A:** Data-driven testing:
- **Runs same test** with multiple datasets
- **Reduces code duplication** - one test logic, many inputs
- **Improves coverage** - tests multiple scenarios efficiently
- **Ideal for**: Form validation, login scenarios, checkout flows
```typescript
test.describe.configure({ mode: 'parallel' });
test('login with various credentials', async ({ page }, testInfo) => {
  const data = testInfo.title; // Test title contains the data
  // Run test with different data
});
```

### Q2: How do you parametrize tests in Playwright?
**A:** Using `test.describe()` with loop or `for...of`:
```typescript
const loginData = [
  { user: 'valid@email.com', pass: 'Correct123' },
  { user: 'invalid@email.com', pass: 'WrongPass' }
];

loginData.forEach(({ user, pass }) => {
  test(`Login with ${user}`, async ({ page }) => {
    await loginPage.login(user, pass);
    // Assertions
  });
});
```

### Q3: How do you load test data from external sources?
**A:** Fetch from JSON/CSV files:
```typescript
import fs from 'fs';

const loginData = JSON.parse(
  fs.readFileSync('./test-data/loginData.ts', 'utf-8')
);

loginData.forEach(data => {
  test(`Login - ${data.scenario}`, async ({ page }) => {
    // Test execution with data
  });
});
```

### Q4: What is the benefit of data-driven testing over hardcoding test data?
**A:** 
- **Maintainability** - change data without touching test code
- **Scalability** - easily add new test cases
- **Reusability** - same data used across multiple tests
- **Documentation** - data file serves as test case documentation
- **Reduced maintenance** - UI changes affect only test logic, not data

### Q5: How do you handle sensitive data (credentials) in data-driven tests?
**A:** Best practices:
- **Environment variables**: `process.env.TEST_USER`
- **Separate config file**: Not committed to git (add to `.gitignore`)
- **Secrets manager**: Use Azure Key Vault, AWS Secrets Manager
- **.env file**: Use `dotenv` package to load credentials
```typescript
import dotenv from 'dotenv';
dotenv.config();

const user = process.env.TEST_USER;
const pass = process.env.TEST_PASSWORD;
```

---

## 5. Fixtures and Reusable Setup

### Q1: What are fixtures in Playwright and why are they important?
**A:** Fixtures provide:
- **Reusable setup/teardown** across multiple tests
- **Dependency injection** - fixtures injected as test parameters
- **Code reusability** - define once, use everywhere
- **Cleaner tests** - focus on test logic, not setup
- **Common use cases**: Authenticated users, pre-configured pages, database connections
```typescript
test('example', async ({ page, customFixture }) => {
  // Fixtures injected automatically
});
```

### Q2: How do you create custom fixtures in Playwright?
**A:** Use `test.extend()`:
```typescript
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
    // Teardown here if needed
  }
});
```
Then use in tests: `test('example', async ({ loginPage }) => {})`

### Q3: What is the lifecycle of a fixture (setup and teardown)?
**A:** Fixtures have automatic lifecycle management:
```typescript
export const test = base.extend({
  myFixture: async ({ page }, use) => {
    // Setup: Runs before each test
    console.log('Setting up fixture');
    
    // Use: Passes fixture to test
    await use(myFixture);
    
    // Teardown: Runs after each test
    console.log('Cleaning up fixture');
  }
});
```
Teardown ensures cleanup even if test fails.

### Q4: How do you scope fixtures (test vs describe vs worker)?
**A:** Three scopes:
1. **Test scope** (default): New fixture instance per test
2. **Describe scope**: Fixture shared across tests in one describe block
   ```typescript
   test.describe.configure({ scope: 'describe' });
   ```
3. **Worker scope**: Fixture shared across all tests in a worker
   ```typescript
   test.describe.configure({ scope: 'worker' });
   ```

### Q5: How do you pass parameters to fixtures?
**A:** Fixtures can't directly accept parameters, but can use test context:
```typescript
// Option 1: Create multiple fixtures
export const test = base.extend({
  chromiumContext: async ({ browser }, use) => {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    await use(context);
  },
  mobileContext: async ({ browser }, use) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    await use(context);
  }
});

// Option 2: Use factory function pattern in tests
test('example', async ({ browser }) => {
  const context = await browser.newContext({ /* options */ });
});
```

---

## 6. Git Basics

### Q1: What is version control and why is it essential for test automation?
**A:** Version control:
- **Tracks changes** to code over time
- **Enables collaboration** among team members
- **Allows rollback** to previous versions
- **Maintains history** of who changed what and when
- **For SDET**: Critical for managing test scripts, tracking fixes, code reviews

### Q2: What is the purpose of a `.gitignore` file?
**A:** `.gitignore` specifies files Git should ignore:
```
node_modules/
.env
test-results/
playwright-report/
*.log
coverage/
```
Prevents committing sensitive data (credentials, node_modules), build artifacts, and temporary files.

### Q3: What is the difference between `git commit` and `git push`?
**A:** 
- **Commit**: Saves changes to **local repository** with a message
  ```bash
  git commit -m "Add login test fixtures"
  ```
- **Push**: Uploads committed changes to **remote repository** (GitHub, GitLab)
  ```bash
  git push origin main
  ```
Workflow: `git add` → `git commit` → `git push`

### Q4: How do you handle merge conflicts in Git?
**A:** Steps to resolve:
1. **Identify conflicts**: Git marks conflicting sections with `<<<<<<<` and `>>>>>>>`
2. **Resolve conflicts**: Edit file to keep desired changes
3. **Stage resolved file**: `git add <file>`
4. **Complete merge**: `git commit -m "Resolve merge conflict"`
```bash
git merge feature-branch  # Creates conflict
git status               # See conflicting files
# Edit files, then:
git add .
git commit -m "Resolve conflicts"
```

### Q5: What is a branch and when do you create one?
**A:** A branch is an independent development line:
- **Main/Master**: Production-ready code
- **Feature branches**: For new features (`feature/login-test`)
- **Bugfix branches**: For bug fixes (`bugfix/selector-issue`)
- **Create branch**: `git checkout -b feature/new-test`
- **Merge branch**: `git merge feature/new-test`
Best practice: One feature/bugfix per branch for clean history.

---

## 7. Debugging Concepts

### Q1: What are the main debugging tools available in Playwright?
**A:** Debugging tools:
1. **Playwright Inspector**: `npx playwright test --debug` - step through code
2. **Trace Viewer**: Records execution with screenshots/videos
3. **Browser DevTools**: Standard browser inspector
4. **Logs/Console**: `console.log()` and test report logs
5. **VS Code Debugger**: Breakpoints and variable inspection

### Q2: How do you enable and use Playwright Inspector?
**A:** Run tests in debug mode:
```bash
npx playwright test --debug
```
Inspector opens with:
- **Pause/Step Over/Step Into**: Control execution
- **Selectors**: Test selectors in real-time
- **Console**: Execute code during pause
- **Network tab**: Monitor API calls
Essential for understanding test flow and selector issues.

### Q3: How do you record a trace for debugging failed tests?
**A:** Enable trace recording in config:
```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry',  // Record only on retry
  // or
  trace: 'retain-on-failure' // Keep trace on failure
}
```
View trace: `npx playwright show-trace trace.zip`
Shows screenshots, DOM snapshots, and actions timeline.

### Q4: What is the purpose of using `page.pause()` in tests?
**A:** `page.pause()` halts test execution:
```typescript
test('example', async ({ page }) => {
  await page.goto('https://example.com');
  await page.pause(); // Test pauses here, browser stays open
  // You can interact manually with browser for inspection
});
```
Useful for:
- **Manual inspection** during test execution
- **Understanding element states** at specific points
- **Quick debugging** without setting breakpoints

### Q5: How do you handle and analyze test failures in Playwright?
**A:** Comprehensive failure handling:
1. **Test report**: `npx playwright test` generates HTML report with screenshots
2. **Screenshots**: Automatically captured on failure
3. **Video**: Record videos (config option `video: 'retain-on-failure'`)
4. **Logs**: Check test output for error messages
5. **Trace**: Use trace viewer for detailed investigation
```typescript
// Take manual screenshot
await page.screenshot({ path: 'screenshot.png' });
```
Review report: `npx playwright show-report`

---

## 8. Debugging Strategies, Flaky Tests, and Waits

### Q1: What are common causes of flaky tests in Playwright?
**A:** Common causes include:
- **Timing issues**: Elements not ready when actions are performed
- **Unstable selectors**: CSS classes or XPath that change with UI updates
- **Network dependencies**: Tests failing due to slow API responses
- **Shared state**: Tests affecting each other through cookies or local storage
- **Race conditions**: Asynchronous operations not properly awaited
Mitigation: Use stable selectors, avoid hard waits, isolate test state.

### Q2: How do you debug a failing test in Playwright?
**A:** Step-by-step debugging approach:
1. **Run in headed mode**: `npx playwright test --headed` to visually observe
2. **Use Playwright Inspector**: `npx playwright test --debug` for step-through debugging
3. **Enable traces**: `trace: 'retain-on-failure'` to record execution
4. **Check test report**: `npx playwright show-report` for screenshots and logs
5. **Add console logs**: `console.log()` or `page.pause()` for manual inspection
6. **Validate selectors**: Test locators in browser DevTools first

### Q3: What are the different wait strategies in Playwright?
**A:** Four main strategies:
1. **Auto-wait**: Built-in waiting for actions (click, fill) - default 30s timeout
2. **Explicit waits**: `await page.waitForSelector(selector, { state: 'visible' })`
3. **Network waits**: `await page.waitForResponse()` or `waitUntil: 'networkidle'`
4. **Custom waits**: `await page.waitForFunction(() => condition)`
Avoid `waitForTimeout` as it causes flakiness; prefer application-specific conditions.

### Q4: How do you handle network-dependent tests that are flaky?
**A:** Strategies for network-dependent tests:
- **Mock API calls**: Use `page.route()` to intercept and mock responses
- **Wait for specific responses**: `await page.waitForResponse('**/api/login')`
- **Use retry logic**: Configure `retries: 2` in config for intermittent failures
- **Increase timeouts**: Set higher `actionTimeout` for slow networks
- **Isolate network state**: Use fresh contexts to avoid cached responses
- **Test offline scenarios**: Mock network failures to ensure graceful handling

### Q5: What tools does Playwright provide for debugging flaky tests?
**A:** Comprehensive debugging toolkit:
- **Trace Viewer**: `npx playwright show-trace` - time-travel debugging with screenshots
- **Video recording**: `video: 'retain-on-failure'` - visual execution recording
- **Screenshots**: Automatic on failure + manual `page.screenshot()`
- **Playwright Inspector**: Interactive debugging with locator testing
- **Test retries**: `retries: 2` to identify truly flaky vs broken tests
- **Parallel execution control**: Run tests serially to isolate state issues

---

## Quick Reference: Common Playwright Commands

```bash
# Run tests
npx playwright test

# Run specific test file
npx playwright test tests/day4-login.spec.ts

# Run with specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Show test report
npx playwright show-report

# Record new traces
npx playwright test --trace on

# View traces
npx playwright show-trace trace.zip
```
