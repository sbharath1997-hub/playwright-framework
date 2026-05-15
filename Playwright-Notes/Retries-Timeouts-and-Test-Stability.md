# Retries, Timeouts, and Test Stability in Playwright

## Retries

- **Test Retries**: Automatically rerun failed tests up to a specified number of times
- **Configuration**: Set via `retries` in playwright.config.ts or per test with `test.describe.configure({ retries: n })`
- **Use Case**: Handle intermittent failures due to network issues, timing, or external dependencies
- **Default**: 0 retries (no retries)

## Test Timeouts

- **Global Test Timeout**: Maximum time for entire test execution (default: 30 seconds)
- **Configuration**: `timeout` in playwright.config.ts
- **Per-Test Timeout**: Override with `test.setTimeout(ms)` or in test options
- **Purpose**: Prevent tests from hanging indefinitely

## Assertion Timeouts

- **Auto-waiting Assertions**: Playwright waits for conditions before asserting (e.g., `expect(page.locator).toBeVisible()`)
- **Timeout Control**: Configure with `expect.configure({ timeout: ms })`
- **Default**: 5 seconds for most assertions
- **Custom Assertions**: Use `expect().toPass({ timeout: ms })` for retry logic

## Flaky Test Handling

- **Identification**: Tests that pass/fail inconsistently without code changes
- **Common Causes**: Race conditions, network latency, animation delays, browser inconsistencies
- **Detection**: Run tests multiple times, use `--repeat-each` flag
- **Mitigation**: Add proper waits, use stable selectors, avoid timing assumptions

## Good Retry Practices

- **Strategic Retries**: Use retries sparingly, target specific flaky tests rather than blanket retrying
- **Root Cause Analysis**: Investigate why tests fail before adding retries
- **Timeout Tuning**: Set appropriate timeouts based on application performance
- **Parallel Execution**: Combine with parallel runs to reduce total execution time
- **Retry Limits**: Keep retry count low (1-2) to avoid masking real issues

## Playwright Stability Strategies

- **Stable Selectors**: Prefer `data-testid`, `role`, or semantic locators over CSS/XPath
- **Explicit Waits**: Use `waitFor` methods instead of `sleep()` or arbitrary timeouts
- **Network Handling**: Mock external APIs, handle loading states properly
- **Browser Context**: Use fresh contexts for isolation, configure viewport consistently
- **Test Isolation**: Ensure tests don't depend on each other's state
- **CI/CD Optimization**: Use `--shard` for parallel execution, configure appropriate timeouts for CI environments