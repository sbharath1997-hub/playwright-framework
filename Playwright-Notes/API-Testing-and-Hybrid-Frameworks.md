# Playwright API Testing & Hybrid Framework Notes

## Core API Testing Concepts

- **GET requests**: used to retrieve data. Validate response status, JSON shape, and expected fields.
- **POST requests**: used to create resources. Send payloads in `request.post({ data })` and verify response body and creation details.
- **Status 200 vs 201**:
  - `200 OK`: successful retrieval or generic success.
  - `201 Created`: successful resource creation after POST.

## Reusable API Utilities

- Centralize request helpers in a shared module.
- Example utility responsibilities:
  - building base URLs
  - setting headers
  - sending authenticated requests
  - parsing JSON responses
- Benefits:
  - avoids repeated code
  - improves readability
  - makes tests easier to maintain

## Hybrid API + UI Framework Architecture

- Keep API and UI layers separate but interoperable.
- Common pattern:
  1. `api-utils/` for API helper functions
  2. `fixtures/` for shared setup and data injection
  3. `pages/` for UI page objects
  4. `tests/` and `api-tests/` for scenario coverage
- Hybrid tests use API calls for setup or validation, then UI for end-to-end checks.
- Use API setup to seed state faster and keep UI tests stable.

## Debugging Runtime Issues

- **"is not a function"** usually means:
  - wrong import or exported value
  - default vs named export mismatch
  - using a value before it is defined
- Fix by:
  - checking import paths and names
  - verifying the module actually exports a function
  - using `console.log` or debugger to inspect the value before calling it

## Stale Compiled Artifact Cleanup

- Remove stale build/output files before running tests after code changes.
- Typical cleanup steps:
  - delete generated `.js` or `.tsbuildinfo` files
  - restart the test runner
- This prevents old compiled code from masking fresh changes.

## Recommended Debugging Workflow

- Run with **Chromium** and **single worker** for reliable debugging.
- Example command:
  - `npx playwright test --project=chromium --workers=1`
- Benefits:
  - easier to reproduce failures
  - consistent browser behavior
  - simpler logs and trace output

## GitHub Copilot Debugging Learnings

- Use Copilot suggestions to inspect imports and recognize common errors.
- Validate generated helpers manually before relying on them.
- Treat Copilot as an assistant, not an autopilot, especially when debugging runtime issues.
- Keep notes concise and focused on the actual failure mode.
