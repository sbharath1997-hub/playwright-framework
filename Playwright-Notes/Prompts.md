# Playwright learning prompts

## How to reuse these prompts

Copy a **Day N Prompt** block into Cursor (or any AI assistant) when you want a structured recap, deeper explanation, or help extending that day’s work. Paste the prompt as-is, or trim sections you do not need. You can also prepend your repo path or paste relevant files (`playwright.config.ts`, spec files) so answers stay accurate to your project.

## When to use them

- **Starting or revisiting a day**: Run the matching prompt after you finish the exercises to consolidate concepts and spot gaps.
- **Before interviews**: Use Day 1–2 prompts to rehearse how you explain setup, first test, navigation, locators, and stability trade-offs.
- **Extending the course**: Reuse the same prompt shape for later days by swapping in new specs and topics—keep the structure (goal, context, tasks, success criteria).

---

## Day 1 Prompt

```text
You are helping me learn Playwright (Day 1).

Context:
- Project uses @playwright/test with playwright.config.ts (testDir ./tests, baseURL may be set for later days).
- First test file tests/day1.spec.ts:
  - test.describe groups “Day 1 — example.com”.
  - One test navigates to https://example.com/, asserts title matches /Example Domain/, asserts body contains “Example Domain”.
  - Uses async ({ page }) fixtures and await on goto + expect.

Goals:
1. Explain in simple terms: what Playwright is, what test / page / expect do, and why async/await matters.
2. Walk through day1.spec.ts line by line for an interviewer-style explanation.
3. Note how assertions retry (auto-wait on expect) vs one-shot checks.
4. Give 3–5 interview questions with short answers on E2E vs unit tests, fixtures, and failure behavior.

Constraints:
- Keep language beginner-friendly; avoid jargon unless defined.
- Do not run terminal commands unless I ask; focus on concepts and the code I described.
```

---

## Day 2 Prompt

```text
You are helping me learn Playwright (Day 2).

Context:
- Config: playwright.config.ts sets baseURL https://playwright.dev, multi-browser projects (chromium, firefox, webkit), HTML + list reporters, trace on first retry, screenshot on failure.
- Test file tests/day2.spec.ts:
  - Group: “Day 2 — playwright.dev navigation”.
  - Test: goto “/” (uses baseURL), locates Main navigation via getByRole('navigation', { name: 'Main' }), then link getByRole('link', { name: 'Docs', exact: true }), clicks it, expects URL matches /docs/, expects main landmark contains text “Installation”.
  - Relies on role-based locators and retrying assertions.

Concepts to reinforce (align with my notes):
- Navigation testing: URLs + content after user actions.
- click(): waits for actionable state; trusted events.
- Auto-waiting on actions and expect retries.
- Why Playwright often feels more stable than typical Selenium setups (waiting model, stack, locators).

Goals:
1. Explain the Day 2 test clearly for an interview: test(), page, click pipeline, how locators resolve, auto-wait, what happens on timeout or missing element.
2. Compare navigation via page.goto vs clicking a link for SPAs vs full page loads.
3. Give 3–5 interview Q&A on click waits, getByRole vs brittle CSS, and stability vs Selenium at a high level.
4. Brief git workflow reminder for this repo: init if needed, meaningful commits per exercise (e.g. “Add playwright config”, “Day 1 smoke test”, “Day 2 navigation test”), and why small commits help review and bisection—without needing to run commands for me.

Constraints:
- Reusable wording; I may paste this into a new chat—summarize file paths as placeholders if paths differ.
- Do not run terminal commands unless I explicitly ask.
```
