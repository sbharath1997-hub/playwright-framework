# Playwright Test Agents / Codegen career handoff

Completed personal-project exercise, 10 October 2026. See
[verified results](../evidence/agent-lab/final-verification.md).
Use these statements only as personal portfolio experience, not as claims about
IBM/Infosys enterprise production work. Final refinements were coach-assisted.

## Resume bullet options

Choose the wording that best fits the personal-project section:

1. Used Playwright Test Agents (Planner and Generator) and Codegen in a TypeScript
   automation framework to create and review documentation-navigation tests,
   integrating final coverage with existing POM and typed fixtures.
2. Implemented a personal AI-assisted Playwright test-generation exercise,
   reviewing test plans, refining recorded/generated locators and web-first
   assertions, and verifying Chromium tests with preserved execution evidence.

No productivity metric, enterprise deployment or independent mastery is implied.

## Relevant skills keywords

Playwright, TypeScript, Playwright Test Agents, Planner, Generator, Codegen,
AI-assisted test generation, Page Object Model (POM), typed fixtures,
accessible-role locators, web-first assertions, auto-waiting, test isolation,
Chromium UI smoke testing, test-plan review, HTML reporting, JSON reporting,
Git, Codex, MCP tooling.

Only claim hands-on scope appropriate to this small exercise. Broader API,
authentication, hybrid automation and GitHub Actions skills may be supported by
other existing project work, but were not demonstrated by this agent lab.

## LinkedIn profile update

Strengthened my personal Playwright + TypeScript framework with a hands-on
Playwright Test Agents and Codegen exercise. Used Planner to explore documentation
navigation and produce a test plan, Generator to create initial tests, and Codegen
to record the same UI flow. Reviewed and refined the outputs into existing POM
and typed fixtures, with reliable locators, web-first assertions and locally
verified Chromium results. Preserved plans, raw outputs and review evidence.

## GitHub portfolio description

Playwright + TypeScript automation framework with a documented Test Agents
(Planner/Generator) and Codegen lab: original test plan, preserved generated and
recorded sources, human-refined POM/fixture integration, and local Chromium
execution evidence. Demonstrates AI-assisted test creation with explicit human
review rather than accepting generated code as production-ready.

This is suggested portfolio wording. Confirm publication separately from remote
Git history; local test results alone are not proof of GitHub publication.

## 30-second interview answer

"In my personal Playwright TypeScript framework, I used Planner to explore two
documentation entry points and produce a test plan. Generator created tests from
the reviewed plan, and I separately recorded the Docs flow with Codegen. The
recording had extra clicks and no assertions, so we refined it with URL, title
and heading checks and reused my existing POM and fixtures. All three final
business tests passed in Chromium. It taught me why generated tests still need
human review."

If asked about support: "I completed this as a coached hands-on exercise. I ran
the agent workflows and recorder, reviewed the results, and received help with
the final refactoring and verification."

## Five likely interview questions

### 1. How are Planner, Generator and Codegen different?

"Planner explores the application and proposes scenarios, steps and outcomes.
Generator takes that reviewed plan and uses live browser interactions to create
tests. Codegen records my interactions and any assertions I explicitly select.
I used Planner for coverage thinking, Generator for an initial implementation,
and Codegen to capture a UI flow. None removes the need to review the result."

### 2. What did you actually improve in the generated tests?

"I reviewed locator scope and the expected outcomes. The Generator tests already
had URL, title and heading assertions, but used direct page actions. We moved
useful actions and checks into the existing HomePage and requested the homePage
fixture. For Codegen, we removed accidental clicks, fixed duplicate imports,
named the test clearly and added the missing outcome assertions."

### 3. Why did a Codegen test pass without assertions?

"The recorded interactions completed successfully. Playwright checked that click
targets were actionable, but the test did not explicitly validate the required
URL, title or visible heading. A click passing is not the same as the business
outcome passing. That is why I inspected the code instead of relying on green."

### 4. How did you avoid unreliable locators and waits?

"We used exact accessible names, scoped Docs to Main navigation and Get started
to the home banner, and scoped Installation to main content. Actions use
Playwright's auto-waiting and outcome assertions retry until they pass or time
out. We did not add fixed sleeps or retries to hide failures. The public site's
wording and routes can still change, so the expectations need maintenance."

### 5. What are the limits of this experience?

"This was a small public, read-only navigation exercise in Chromium, not an
enterprise production rollout. It covered two distinct navigation paths, with
intentional duplicate tests for comparison. I did not exercise Healer, login,
test-data management, cross-browser generation or these tests in CI. A Generator
tool call also failed because expect wasn't defined in its runtime, which showed
that tool usage itself needs review."

## Skills to explain confidently

- How a plan, an AI-generated test and a recorded test differ.
- Why expected outcomes and human review matter.
- Accessible-role/name locator scoping and web-first assertions.
- Existing fixture injection and per-test page/context isolation.
- POM reuse rather than duplicate page classes.
- Preserving raw outputs separately from human-refined tests.
- Distinguishing local execution evidence from CI or production claims.

## Remaining gaps not to claim

Advanced agent orchestration; Healer use; production AI testing ownership;
complete autonomous test generation; agent-driven authenticated/data-heavy
workflows; measured productivity gains; lab cross-browser/CI execution;
exhaustive coverage; GitHub publication without verifying the remote commit.
