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
- Playwright Test Agents (Planner and Generator)
- Playwright Codegen
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
- Reviewed AI-generated and recorded tests with preserved plans, raw outputs and local execution evidence
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
- Documentation navigation through Docs and Get started, with an intentional Test Agents/Codegen comparison lab

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

The current GitHub Actions workflow runs API-tagged Playwright tests and uploads the HTML report as a workflow artifact.

- GitHub Actions runs on pushes to `main`, using `npx playwright test --grep "@api"`.
- The documentation UI lab is verified locally; it is not part of the current CI job.
- Report artifacts are produced for visibility and diagnostics.
- Local execution is useful for debugging and faster iteration.
- GitHub-hosted runners may encounter Cloudflare restrictions when targeting the Automation Exercise site, so local validation can be more reliable for that target.
- Google Photos storage scans are intentionally excluded from CI because they require a personal authenticated browser session.

---

## Learning and Documentation

- `Playwright-Notes/` for automation design, tagging, and framework strategy
- `README.md` for repository overview and practical engineering context

### Playwright Test Agents and Codegen practice

Playwright is pinned to `1.64.0`. Official Codex Planner and Generator definitions
are initialized in `.codex/agents/` (the initializer also supplies Healer).
The practice seed reuses `HomePage` and the existing typed fixture. A Chromium-only
lab configuration and commands are available:

```powershell
npm.cmd run agents:seed
npm.cmd run agents:check
npm.cmd run agents:codegen
npm.cmd run agents:test
```

Completed locally on 10 October 2026: Planner explored Docs and Get started and
saved a reviewed plan; Generator produced two initial tests; a manual Codegen
recording captured the Docs flow. Raw outputs were preserved before human,
coach-assisted refinement into the existing HomePage and typed fixtures.

Final verification: **4 lab tests passed (13.7s)** in Chromium with zero retries:
three business tests covering two distinct paths, plus one setup seed. The three
existing documentation smoke tests also passed (2.7s); TypeScript checking passed.
Comparison overlap is intentional, not additional unique scenario coverage.

- [Original Planner plan](specs/playwright-docs.plan.md) and [human review](specs/playwright-docs.plan-review.md)
- [Lab guide and learning notes](Playwright-Notes/Test-Agents-Codegen-Lab.md)
- [Generator execution evidence](evidence/agent-lab/generator-results.md)
- [Codegen comparison and missing-assertion lesson](evidence/agent-lab/codegen-review.md)
- [Final results and manual Git handoff](evidence/agent-lab/final-verification.md)
- [Machine-readable final results](evidence/agent-lab/final-results.json)
- [Career wording and interview answers](Playwright-Notes/Test-Agents-Career-Handoff.md)

Codegen requires manual browser interactions. Runtime reports/traces stay ignored;
sanitized evidence and original `.ts.txt` outputs can be tracked under
`evidence/agent-lab/`. This is personal-project experience, not a production rollout.
The lab was not run in CI; the existing GitHub Actions workflow runs the `@api`
subset. No GitHub publication is performed automatically.

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
