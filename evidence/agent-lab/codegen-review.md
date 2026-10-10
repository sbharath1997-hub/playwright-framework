# Manual Codegen recording: initial review

Reviewed and executed on 10 October 2026 (Asia/Calcutta).

The user reported completing the manual Codegen recording. The saved file is
`tests/agent-lab/codegen-docs.spec.ts`. Its unedited source is preserved in
`raw/codegen-docs.initial.ts.txt` (source content retained; line endings normalized).
Later human edits must not be represented as Codegen-recorded assertions.

## What the recording actually contains

- Default test name `test`, with imports from `@playwright/test`.
- Homepage navigation and an unscoped Docs role-link click.
- Extra clicks on the homepage heading, Installation heading, breadcrumbs and
  paragraph text, including double/triple clicks.
- No `expect` assertion, despite importing `expect`.
- No existing POM/typed fixture use.

The intended visibility assertion was not recorded. Clicking a heading is an
action, not a `toBeVisible` assertion. Playwright's actionability checks still
check whether click targets are actionable; those checks do not replace explicit
assertions about the required destination and visible page content.

## Comparison against the initial Generator Docs test

| Area | Generator output | Codegen recording |
| --- | --- | --- |
| Source | Reviewed plan plus agent live exploration | User browser interactions |
| Docs locator | Exact Docs link scoped to Main navigation | Unscoped Docs role-link |
| Outcomes | URL, title, Installation visibility, link href | No explicit assertions |
| Noise | Plan-related steps only | Extra heading, breadcrumb and paragraph clicks |
| Structure | Descriptive scenario and existing fixture import, but direct page use | Generic name and standard Playwright import |
| Waiting | Awaited actions and web-first assertions | Awaited actions; no fixed sleeps |

Both initial versions require human review and contain intentional overlap with
existing smoke coverage. The Generator output is more complete for this reviewed
plan; that is an observation from this exercise, not a guarantee about AI output.
Neither version uses login/test data here: this is a public read-only workflow.
It does not demonstrate authentication-dependent generation or data cleanup.

## Actual raw-recording execution

```powershell
npx.cmd playwright test --config=playwright.agents.config.ts tests/agent-lab/codegen-docs.spec.ts --project=chromium
```

Result: **1 passed (3.8s)**, test duration 2.8s, exit code 0, Chromium,
one worker, zero retries. A non-failing NO_COLOR/FORCE_COLOR warning was emitted.

This pass confirms that the recorded actions completed on the current site.
It does not establish that explicit destination/content assertions passed,
because none exist in this recording. This is the practical reason to review
a green generated test instead of accepting it as production-ready.

## Human correction (completed after this initial review)

The learner began the correction but added a second import without removing the
first. TypeScript reported `TS2300: Duplicate identifier 'test'` and the same
error for `expect`. The recorded extra clicks and missing assertions remained.
At the learner's request, the coach completed the fix: one fixture import,
descriptive name, existing `homePage` actions and human-added outcome checks in
the POM. The raw recording remains unchanged. The corrected recording passed
as part of the final four-test lab run. See [final verification](final-verification.md).

The initial review did not edit executable source; the subsequent refinement
did. No commit or push occurred.
