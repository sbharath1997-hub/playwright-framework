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
- Local-only browser session tooling

---

## Framework Features

- Page Object Model structure for UI clarity and reuse
- Typed fixtures and centralized environment configuration for consistent setup
- Data-driven testing with shared datasets
- Typed API request/response models for safer API validation
- API testing and hybrid API + UI flows
- Tagging and selective execution with `--grep`
- Retry and timeout management for stability
- Debugging and reporting with traces and HTML artifacts
- GitHub Actions CI integration for automated runs
- Cross-browser execution support (Chromium, Firefox, WebKit)
- Local-only Google Photos Storage Cleanup Assistant for read-only storage review

---

## Why This Project

This repository was built to demonstrate modern SDET and automation engineering practices using Playwright and TypeScript. The focus is on framework design, maintainability, API and UI automation, CI/CD integration, test stability, and scalable automation patterns commonly used in enterprise projects.

---

## Automated Scenarios

- Smoke and regression validation flows
- Login and authentication workflows
- Data-driven invalid login verification
- API endpoint validation and service checks
- Hybrid API + UI test chaining
- Cross-browser execution across Chromium, Firefox, and WebKit
- Read-only Google Photos Large photos & videos metadata scan with local JSON output

---

## Google Photos Storage Cleanup Assistant

This framework includes a local-only, read-only assistant for reviewing Google Photos storage usage in the Large photos & videos cleanup category.

The assistant is designed for personal local execution only:

- Manual Google authentication only; no username or password is stored in code
- Dedicated local browser profiles under `.browser-profiles/google-photos/`
- Optional Playwright `storageState` under `.auth/google-photos/`
- Runtime logs and raw JSON output under `google-photos-results/`
- No screenshots, traces, or videos for the Google Photos project
- No media selection, delete, trash, or destructive confirmation actions
- Skipped automatically in CI and requires `GOOGLE_PHOTOS_READONLY_ACK=true`

Supported local browser modes:

- Edge or Chrome through manual browser launch plus CDP attach
- Firefox through a dedicated persistent Firefox profile

Example Edge flow:

```powershell
Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -ArgumentList "--remote-debugging-port=9222","--user-data-dir=B:\Playwright-Projects\pw-framework\.browser-profiles\google-photos\edge","https://photos.google.com/quotamanagement"

$env:GOOGLE_PHOTOS_BROWSER='edge'
$env:GOOGLE_PHOTOS_AUTH_MODE='cdp'
$env:GOOGLE_PHOTOS_CDP_ENDPOINT='http://127.0.0.1:9222'
$env:GOOGLE_PHOTOS_READONLY_ACK='true'
npm.cmd run google-photos:scan
```

Optional date filtering:

```powershell
$env:GOOGLE_PHOTOS_START_DATE='2024-01-01'
$env:GOOGLE_PHOTOS_END_DATE='2024-12-31'
```

The scan writes local-only output:

```text
google-photos-results/<run-id>/
|-- runtime-events.jsonl
|-- raw-scan.json
|-- failure-context.json   # only when a run fails
```

These folders are ignored by Git and should not be committed.

---

## Project Structure

```text
pw-framework/
|-- api-tests/             # API-focused test cases
|-- api-utils/             # API helpers and typed API payload models
|-- config/                # Environment and test configuration
|-- fixtures/              # Reusable typed Playwright fixtures
|-- models/                # Typed domain models for framework features
|-- pages/                 # Page Object Model classes
|-- test-data/             # Reusable datasets
|-- tests/                 # UI and hybrid test specifications
|-- utils/                 # Assertion and wait utilities
|-- Playwright-Notes/      # Learning notes
|-- playwright.config.ts   # Playwright configuration
```

---

## CI/CD

The repository is intended for GitHub Actions-based CI. The workflow runs Playwright tests, collects artifacts, and publishes HTML reports for results review.

- GitHub Actions executes tests on push and PR events.
- Report artifacts are produced for visibility and diagnostics.
- Local execution is useful for debugging and faster iteration.
- GitHub-hosted runners may encounter Cloudflare restrictions when targeting the Automation Exercise site, so local validation can be more reliable for that target.
- Google Photos storage scans are intentionally excluded from CI because they require a personal authenticated browser session.

---

## Learning and Documentation

- `Playwright-Notes/` for automation design, tagging, and framework strategy
- `README.md` for repository overview and practical engineering context

---

## Future Improvements

- Expand API coverage and service-level workflows
- Add additional hybrid API + UI scenarios
- Add runtime schema validation for stronger API contract checks
- Add review-friendly HTML output for Google Photos scan results
- Explore safe duplicate/similarity analysis as a later read-only phase
- Implement Jenkins pipeline support for enterprise CI

---

## How to Run Tests

```bash
npm install
npx playwright test
npx playwright show-report
```

Use `--project=chromium|firefox|webkit` for browser-specific runs and `--grep` to execute tagged subsets.

For Google Photos local-only scanning, use the dedicated scripts:

```bash
npm run google-photos:scan
npm run google-photos:scan:firefox
```

---

## Author

### Bharath S

QA Automation Engineer  
Playwright | Selenium | API Testing

LinkedIn:
https://www.linkedin.com/in/bharath-s-76936724b/

GitHub:
https://github.com/sbharath1997-hub/playwright-framework
