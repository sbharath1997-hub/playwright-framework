# Reporting, Trace & Debugging (Playwright)

## Playwright HTML reports

- Built-in HTML report shows tests, suites, failures, and artifacts.
- Run `npx playwright show-report` to open the latest report.
- Use reports as the first place to triage failures and access screenshots/traces.

## Screenshot on failure

- Capture screenshots automatically on failure (`--reporter=html` or `screenshot: 'only-on-failure'`).
- Screenshots give a quick visual of the browser state at failure.
- Use them for fast UI-level checks before deeper trace analysis.

## Trace viewer purpose

- Trace records a rich timeline: DOM snapshots, network, console, events, and screenshots.
- Open traces with `npx playwright show-trace trace.zip` to replay and inspect steps.
- Trace is for deep debugging when screenshots or logs aren't enough.

## Screenshot vs Trace

- Screenshot: single image at a moment — quick, lightweight diagnostic.
- Trace: full interactive session replay with network, DOM, and action timeline — heavyweight but powerful.

## Retries and trace relationship

- Configure retries to capture flaky failures; combine with `trace: 'on-first-retry'` to record only when a test flakes.
- This reduces storage while keeping traces for flaky cases that need investigation.

## Debugging workflow using reports and traces

- Step 1: Open HTML report and locate failing test.
- Step 2: View screenshot for a quick check.
- Step 3: Open trace for step-by-step replay when screenshot/log is insufficient.
- Step 4: Inspect network/console/DOM in trace, reproduce locally, then fix test or product bug.

## Execution timeline concept

- Timeline shows actions, waits, navigations, and network events in chronological order.
- Use timeline to find slow steps, unexpected redirects, or missing waits.

## Flaky test debugging

- Use retries with traces on retry to capture intermittent failures.
- Correlate trace data with network errors, timeouts, or shared state leaks.
- Isolate flaky behavior by running single-worker, headed, and `--debug` sessions.

## Logs and failure analysis

- Capture console logs and network events in traces for root-cause analysis.
- Combine Playwright logs with backend logs for full-stack debugging.

## Practical use cases for trace viewer

- Investigate actions that silently miss elements or fail intermittently.
- Diagnose complex timing issues involving network and DOM updates.
- Validate what the browser actually received and rendered versus test assumptions.

## Quick interview-friendly summary

- HTML reports: first triage point. Screenshots: fast visual checks. Traces: detailed replay for hard bugs.
- Use `retries + trace-on-retry` to capture flakiness without over-recording.
- Read timeline, inspect network/console, and reproduce locally to fix flaky tests.

