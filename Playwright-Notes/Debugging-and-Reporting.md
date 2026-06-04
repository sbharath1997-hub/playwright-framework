# Debugging and Reporting in Playwright

## 1. Why Debugging Matters

- Test failures reveal gaps between expectations and actual application behavior.
- Debugging is the fastest path to identifying whether failures are in test logic, timing, or product bugs.
- Effective debugging reduces cycle time: identify root cause early, prevent regression investment.
- In CI/CD pipelines, debugging without local reproduction requires robust artifacts (traces, screenshots, logs).
- Flaky tests damage test suite credibility; systematic debugging isolates root causes and fixes instability.

## 2. Playwright Debugging Tools

Playwright provides a toolkit for understanding test execution:

- **PWDEBUG**: Interactive mode to step through tests in real-time with browser developer tools.
- **UI Mode**: Visual test runner for development and debugging with live browser interaction.
- **Trace Viewer**: Detailed session replay with DOM snapshots, network events, and action timeline.
- **Screenshots**: Automatic capture at failure points for quick visual diagnosis.
- **Videos**: Full-session recording for understanding timing and interaction sequences.
- **HTML Reports**: Centralized triage interface with test metrics, artifacts, and quick access to traces.
- **Console/Network Logs**: Captured within traces for root-cause analysis.

## 3. PWDEBUG

### What is PWDEBUG?

- `PWDEBUG=1 npx playwright test` launches tests in debug mode with the browser DevTools open.
- Pauses before each action, allowing inspection of the page state and network.
- Best for development and interactive exploration; slower than headless execution.

### How to use PWDEBUG

- Run: `PWDEBUG=1 npx playwright test --headed`
- Inspect page state, network, and DOM before each step.
- Step through actions to validate locators and timing.
- Use for validating new test logic or reproducing timing issues locally.

### PWDEBUG vs UI Mode

- **PWDEBUG**: Low-level control; pauses before each action with browser DevTools.
- **UI Mode**: Higher-level visual runner; resume, step, or run to line with browser context visible.
- PWDEBUG suits deep investigation; UI Mode suits rapid test iteration.

## 4. UI Mode

### What is UI Mode?

- `npx playwright test --ui` opens a visual test runner in the browser.
- Shows all tests, execution status, and allows stepping through tests interactively.
- Live browser window shows the test's actions in real-time.

### Key Features

- View all tests and filter by name or tag.
- Step through test execution, watch actions in real-time.
- Inspect page state between steps.
- Re-run single tests or entire suites without CLI commands.
- Fast feedback loop for test development and debugging.

### When to Use UI Mode

- Developing new tests or validating locators.
- Quick iteration without switching between terminal and browser.
- Understanding test flow visually before investigating failures.
- Better for team demos and paired debugging.

## 5. Trace Viewer

### Trace Purpose

- Records a rich interactive session: DOM snapshots at each step, network timeline, console logs, and screenshots.
- Replay full execution step-by-step without re-running the test.
- Inspect what the browser actually received and rendered.

### How to Configure Traces

```typescript
// Capture traces on first retry (flaky tests only)
use: {
  trace: 'on-first-retry'
}

// OR capture all traces (storage-intensive)
use: {
  trace: 'on'
}

// OR capture on specific condition
use: {
  trace: process.env.CI ? 'on-first-retry' : 'off'
}
```

### Opening Traces

- `npx playwright show-trace trace.zip` opens the interactive viewer.
- Available in HTML reports: click the test, then click "View trace."

### Trace Viewer Capabilities

- **Action Timeline**: View all actions, waits, and navigations chronologically.
- **Network Inspector**: See requests, responses, and timing; correlate with test steps.
- **Console Logs**: Capture JavaScript console output for debugging.
- **DOM Snapshots**: Inspect page structure at each step; verify elements exist and are positioned.
- **Screenshots**: Visual checkpoints throughout execution.

### Practical Debugging with Trace Viewer

- **Timing issues**: Inspect timeline to find slow steps or unexpected delays.
- **Missing elements**: Check DOM snapshots to confirm elements are in the DOM when actions occur.
- **Network failures**: Review network tab to spot failed requests or redirects.
- **Flaky behavior**: Compare traces from passed vs failed runs to spot timing inconsistencies.

## 6. Screenshots and Videos

### Screenshots on Failure

- Configure: `screenshot: 'only-on-failure'` in `playwright.config.ts`.
- Automatically captured when a test fails.
- Quick visual check of application state at the moment of failure.
- Faster than trace but less detailed.

### When to Use Screenshots

- UI-level quick diagnosis: "Is the element visible?" "Is the page correct?"
- First triage step in HTML reports.
- Before opening a trace for deeper investigation.

### Videos

- Configure: `video: 'retain-on-failure'` to record videos only for failed tests.
- Shows browser automation in real-time with user perspective.
- Helpful for understanding timing or interaction sequences.
- Storage-intensive; use sparingly or only in CI.

### Screenshots vs Videos vs Traces

- **Screenshot**: Single image; instant diagnosis for UI issues.
- **Video**: Time-series images; shows interaction flow but no DOM/network details.
- **Trace**: Full interactive replay with DOM, network, and timeline; enables deep debugging.

## 7. HTML Reports

### Generating Reports

- Playwright generates HTML reports by default when using the HTML reporter.
- Run `npx playwright show-report` to open the latest report.
- Store reports in CI artifacts for team access.

### HTML Report Features

- Test list with pass/fail status and execution time.
- Failed tests highlighted with error messages.
- Quick access to screenshots and traces.
- Retry information (how many times a test ran before passing/failing).

### Triage Workflow

- **Step 1**: Open HTML report and locate failing test.
- **Step 2**: View screenshot for quick visual check.
- **Step 3**: Check error message for assertion or timeout details.
- **Step 4**: Open trace for step-by-step replay if screenshot/log insufficient.

## 8. Common Automation Failures

### Timing Issues

- **Symptom**: Test passes locally but fails in CI; intermittent failures.
- **Root cause**: Page not fully loaded, network delay, or insufficient wait time.
- **Debug approach**: Inspect trace timeline for delays; use `waitForLoadState()` or `waitForSelector()`.

### Stale Element References

- **Symptom**: "Target page, context or browser has been closed."
- **Root cause**: Page navigated or reloaded; element reference no longer valid.
- **Debug approach**: Ensure page stays in scope; refetch elements after navigation.

### Selector Fragility

- **Symptom**: Test fails when DOM structure changes slightly.
- **Root cause**: Selectors rely on brittle XPath or CSS paths.
- **Debug approach**: Use semantic selectors (role, text, testid); inspect DOM snapshot in trace.

### Network Failures in CI

- **Symptom**: Test fails to load pages or API endpoints in CI but works locally.
- **Root cause**: Network timeout, DNS resolution, or firewall rules.
- **Debug approach**: Inspect trace network tab; check CI environment configuration.

### Flaky Failures from Shared State

- **Symptom**: Tests pass alone but fail when run together.
- **Root cause**: Tests interfere with each other (shared database, cache, or API state).
- **Debug approach**: Run single worker (`--workers=1`); isolate test data; clean up after tests.

## 9. Troubleshooting Approach

### Systematic Debugging Steps

1. **Reproduce locally**: Run test in UI Mode or PWDEBUG to confirm failure.
2. **Check error message**: Read the assertion or timeout error; often points to root cause.
3. **Take screenshot**: Inspect HTML reports screenshot; quick visual diagnosis.
4. **Open trace**: Replay step-by-step; focus on action timeline and network tab.
5. **Inspect DOM snapshot**: Verify element exists and is in expected state at time of action.
6. **Check network requests**: Spot failed requests, redirects, or slow responses.
7. **Correlate with backend logs**: Combine browser events with server-side logs for full context.
8. **Isolate the issue**: Run test with `--workers=1`, `--headed`, or single browser to rule out concurrency/timing issues.

### Key Questions When Debugging

- Did the selector match the intended element?
- Was the page fully loaded before the action?
- Did the network request complete successfully?
- Is there shared state between tests?
- Does the issue reproduce consistently or intermittently?

### Using Retries Strategically

- Configure retries to capture flaky behavior: `retries: 2` in config or specific project.
- Combine with `trace: 'on-first-retry'` to trace only on retry, reducing storage.
- Use retries in CI pipelines; avoid relying on them in development.

## 10. Common Interview Questions

### "How do you approach debugging a flaky test in CI?"

**Answer**: First, reproduce locally using UI Mode or PWDEBUG to confirm the failure. Then, open the trace from the CI run to inspect the action timeline, network requests, and DOM snapshots. Look for timing inconsistencies (waits not completing) or network failures. Check if the test has shared state dependencies with other tests by running it in isolation (`--workers=1`). Finally, add strategic waits like `waitForLoadState()` or isolate test data to prevent state leaks.

### "What's the difference between screenshots, videos, and traces?"

**Answer**: A **screenshot** is a single image at the moment of failure—quick but limited detail. A **video** is a time-series of images showing the full interaction but no DOM or network context. A **trace** is an interactive replay of the entire session with DOM snapshots, network timeline, console logs, and screenshots at each step—most powerful for debugging but storage-intensive. Screenshots are first triage; traces are for deep investigation.

### "When would you use PWDEBUG vs UI Mode?"

**Answer**: **PWDEBUG** provides low-level control—it pauses before each action and opens browser DevTools, making it ideal for deep investigation or validating new test logic. **UI Mode** is a visual test runner that lets you step through, resume, or run to a line, making it better for rapid iteration and development. Use PWDEBUG when you need direct browser inspection; use UI Mode for faster feedback loops.

### "How do you debug timing issues in automation tests?"

**Answer**: Use the trace viewer's timeline to identify slow steps or unexpected delays. Check if the page has fully loaded using `waitForLoadState()` or `waitForSelector()` before acting. In CI, timing issues often stem from network variance; inspect the trace network tab for slow requests or retries. Consider using `waitForNavigation()` explicitly if the test triggers navigation. Run tests locally with `--headed` to observe actual timing; compare with CI runs.

### "What's your strategy for reducing test flakiness?"

**Answer**: Build stability in three layers: **Selectors** should be semantic (role, text, testid) not fragile DOM paths. **Waits** should be explicit—use `waitForSelector()`, `waitForLoadState()`, or custom conditions instead of fixed sleeps. **Isolation** ensures tests don't share state—clean up after each test, run with `--workers=1` if investigating, and use independent test data. Combine retries with `trace: 'on-first-retry'` to investigate flaky failures without over-recording.

### "How do you debug API test failures in hybrid tests?"

**Answer**: Use `trace.viewer` to capture the full session including network requests. Inspect the trace network tab to verify API requests and responses. Compare the API response with test assertions. Correlate browser behavior with network events—check for timing issues or failed requests that cause DOM inconsistencies. Combine browser traces with backend logs for full-stack debugging. For complex scenarios, extract the API call into a separate unit test to isolate the issue.

### "What do you do when you can't reproduce a failure locally?"

**Answer**: This often signals a CI-specific issue (environment, network, or concurrency). Review the CI logs and trace carefully. Check if the test passes when run alone (`--workers=1`) or if it's a flaky failure. Inspect environment variables, proxy settings, or DNS differences between local and CI. If the trace shows a network error, investigate CI network configuration. Add more verbose logging or screenshots to narrow down the point of failure. Run the test multiple times in CI to determine if it's intermittent or consistent.

