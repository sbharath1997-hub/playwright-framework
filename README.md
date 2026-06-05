# Playwright Automation Framework

A practical Playwright automation framework built with TypeScript and Page Object Model patterns. The repository combines UI and API coverage, reusable fixtures, and documentation for automation engineering and interview preparedness.

---

## Tech Stack

- Playwright (`@playwright/test`)
- TypeScript
- Node.js
- Git
- GitHub Actions
- API Testing
- Page Object Model

---

## Framework Features

- Page Object Model structure for UI clarity and reuse
- Fixtures and environment configuration for consistent setup
- Data-driven testing with shared datasets
- API testing and hybrid API + UI flows
- Tagging and selective execution with `--grep`
- Retry and timeout management for stability
- Debugging and reporting with traces and HTML artifacts
- GitHub Actions CI integration for automated runs
- Cross-browser execution support (Chromium, Firefox, WebKit)

---

## Automated Scenarios

- Smoke and regression validation flows
- Login and authentication workflows
- Data-driven invalid login verification
- API endpoint validation and service checks
- Hybrid API + UI test chaining
- Cross-browser execution across Chromium, Firefox, and WebKit

---

## Project Structure

```text
pw-framework/
├── api-tests/             # API-focused test cases
├── api-utils/             # API helper functions and request setup
├── config/                # Environment and test configuration
├── fixtures/              # Reusable Playwright fixtures
├── pages/                 # Page Object Model classes
├── test-data/             # Reusable datasets
├── tests/                 # UI test specifications
├── utils/                 # Assertion and wait utilities
├── Playwright-Notes/      # Learning notes
├── playwright.config.ts   # Playwright configuration
```

---

## CI/CD

The repository is intended for GitHub Actions-based CI. The workflow runs Playwright tests, collects artifacts, and publishes HTML reports for results review.

- GitHub Actions executes tests on push and PR events.
- Report artifacts are produced for visibility and diagnostics.
- Local execution is useful for debugging and faster iteration.
- GitHub-hosted runners may encounter Cloudflare restrictions when targeting the Automation Exercise site, so local validation can be more reliable for that target.

---

## Learning and Documentation

- `Playwright-Notes/` for automation design, tagging, and framework strategy
- `private-notes/` for interview preparation and study material
- `README.md` for repository overview and practical engineering context

---

## Future Improvements

- Expand API coverage and service-level workflows
- Add additional hybrid API + UI scenarios
- Improve TypeScript typings and reusable helpers
- Implement Jenkins pipeline support for enterprise CI

---

## How to Run Tests

```bash
npm install
npx playwright test
npx playwright show-report
```

Use `--project=chromium|firefox|webkit` for browser-specific runs and `--grep` to execute tagged subsets.

---

## Author

Bharath S
QA Automation Engineer | Playwright | Selenium | API Testing

LinkedIn:  
https://www.linkedin.com/in/bharath-s-76936724b/

GitHub:  
https://github.com/sbharath1997-hub/playwright-framework
