# CI/CD and GitHub Actions for Playwright

## 1. CI/CD Overview

- CI/CD is the automation of build, test, and delivery pipelines.
- In Playwright projects, CI runs tests on every commit or pull request; CD can publish releases or deploy test results.
- GitHub Actions is a common runner platform for Playwright CI because workflows are stored in the repo and executed automatically.

## 2. Why CI/CD Matters for Test Automation

- Ensures regression checks run consistently, not just on a developer machine.
- Finds failures early, before code merges or releases.
- Provides a repeatable environment for Playwright tests, including browser installation and configuration.
- In interviews, emphasize quality, speed, and confidence from automated CI feedback.

## 3. GitHub Actions Basics

- Workflows live in `.github/workflows/` and are defined in YAML files.
- Key workflow fields:
  - `name`: readable title.
  - `on`: triggers such as `push`, `pull_request`, `workflow_dispatch`, and schedule events.
  - `jobs`: separate units of work that run on runners.
- GitHub-hosted runners like `ubuntu-latest` are usually sufficient for Playwright.
- `npm ci` is the preferred install step in CI for deterministic dependency installs.

## 4. Workflow Structure

- A workflow starts with `on`, then defines one or more `jobs`.
- Jobs can run in parallel unless explicitly linked with `needs:`.
- Each job uses `runs-on` to choose the environment.
- Steps are the sequential actions inside a job.
- Typical steps for Playwright CI:
  1. Checkout code.
  2. Install dependencies.
  3. Install browsers: `npx playwright install --with-deps`.
  4. Run tests: `npx playwright test`.
  5. Upload reports/artifacts.

## 5. Running Playwright in CI

- Use `npx playwright test` in a workflow step.
- Common reporter options:
  - `--reporter=html` for a generated HTML report.
  - `--reporter=list` or built-in CI-friendly reporters for logs.
- Install browser dependencies before tests on fresh runners.
- Set `reporter` in `playwright.config.ts` or pass it on the command line.
- CI may differ from local execution in network, browser sandbox, headless mode, and IP address.
- Document local-vs-CI differences as part of debugging and explain in interviews.

## 6. Reports and Artifacts

- Reports are generated outputs from test runs and should not be committed to Git.
- Use GitHub Actions to upload artifacts, such as `playwright-report`, screenshots, traces, and logs.
- Example upload step:

```yaml
- name: Upload Playwright report
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report
    retention-days: 7
```

- Use `if: always()` for upload steps so reports are preserved even when tests fail.
- Artifacts are useful for debugging failures after the workflow completes.
- `retention-days` controls how long GitHub stores the files.

## 7. Common CI Failures

- YAML formatting errors from bad indentation or invalid keys.
- Missing browser installs, causing Playwright to fail on fresh runners.
- Environment mismatch issues:
  - Different OS, locale, fonts, or time zones.
  - Headless/browser configuration differences.
  - Network restrictions or bot protection.
- Shared GitHub runner IPs may trigger Cloudflare or site bot challenges.

## 8. Debugging CI Issues

- Download artifacts and inspect HTML reports, screenshots, and trace links.
- Reproduce the failing test locally using the same command and environment if possible.
- Compare CI logs and artifacts with local results.
- For failures that only occur in CI, check cloud/network factors first, especially on public sites.

## 9. Best Practices

- Keep workflows simple and focused on one purpose.
- Use `npm ci` for consistent installs.
- Add `if: always()` to artifact upload steps.
- Store workflows in `.github/workflows/` and keep YAML valid.
- Generate, upload, and preserve only the artifacts needed to debug failures.
- Prefer test-friendly endpoints and isolate external dependencies when possible.

## 10. Common Interview Questions

- What is `on` in a workflow? Answer: it defines the events that trigger the workflow.
- How do jobs and steps differ? Answer: jobs are separate runnable units on a runner, while steps are sequential actions inside a job.
- Why use `npm ci` in CI? Answer: for faster, reproducible installs from lockfile.
- How do you keep reports from bloating the repo? Answer: generate them in CI and upload them as artifacts, not commit them.
- How would you explain a Cloudflare/bot-protection failure in CI?
  - Say that hosted runners use shared IP ranges and public website security can block those IPs.
  - Explain that the test passed locally but failed in CI because the runner looked like a bot or rate-limited source.
  - Mention the fix: use a test-friendly endpoint, adjust firewall/rules for CI IPs, or use a self-hosted runner.

---

## Duplicate content found

- Basic CI/CD definitions and GitHub Actions purpose.
- Workflow structure explanations: `name`, `on`, `jobs`, `runs-on`, `steps`.
- Playwright run commands and report generation.
- Artifact upload example and `if: always()` rationale.
- CI vs local environment differences and hosted runner issues.

## Unique content worth preserving

- Practical pipeline flow for Playwright CI.
- Specific guidance on `npm ci` and `npx playwright install --with-deps`.
- Cloudflare/bot-protection issue with GitHub-hosted runners.
- Interview phrasing: artifacts as transient evidence, not repo files.
- Retention-days and report upload best practices.

## Recommendation

- Archive or delete the original files after migrating the key content into this consolidated note.
- Keep the repository lean by maintaining only `CI-CD-and-GitHub-Actions.md` for Playwright CI/CD interview prep.