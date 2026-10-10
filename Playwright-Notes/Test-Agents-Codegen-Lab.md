# Playwright Test Agents and Codegen lab

This is a personal practice exercise on the public Playwright documentation site.
The tooling is set up first; Planner exploration, test generation, and the manual
Codegen recording are separate steps to complete with human review.

Progress on 10 October 2026: the custom Planner saved the two-scenario docs plan,
the learner reviewed its expected outcomes, and the custom Generator saved both
initial tests. Independent execution: **2 passed (5.1s)** in Chromium with zero
retries; TypeScript checking passed. See
[Generator review and execution](../evidence/agent-lab/generator-results.md).
The learner also completed a manual Codegen recording. Its raw test passed
**1 passed (3.8s)** but contained extra clicks and no explicit assertions. The
initial output is preserved and compared in
[Codegen review](../evidence/agent-lab/codegen-review.md).
Human refinement and final POM integration are complete with coaching. Final
verification: **4 passed (13.7s)** (three business tests plus the seed); the three
existing smoke tests passed (2.7s), and TypeScript passed. See
[final verification and manual Git handoff](../evidence/agent-lab/final-verification.md).

## Quick understanding: what each tool did

| Tool | Input and purpose | What it produced in this exercise | Useful when |
| --- | --- | --- | --- |
| Planner | Explores the live application and reasons about scenarios | Two independent entry-point scenarios with starting state, actions, outcomes and assumptions | You want a draft plan before writing tests |
| Generator | Implements a reviewed plan using live browser actions and logs | Initial Docs/Get started tests with locators and assertions | You want an executable first draft for review |
| Codegen | Records user interactions and explicitly selected assertions | Docs navigation plus accidental clicks; no assertions were actually recorded | You want to capture interactions or inspect locator suggestions |

Planner does not know every requirement from exploring a page. Generator can
make code/tool mistakes. Codegen does not infer business outcomes or existing
framework conventions. Their output is a draft, not automatic production approval.

## What changed and why it works

- The original recording was kept before edits. We removed repeated heading,
  breadcrumb and paragraph clicks because they were not steps in the Docs flow.
- A refinement imported `test`/`expect` twice and produced real TS2300 errors.
  The completed spec has one import from the existing fixture module.
- Each test requests `homePage` and `page`. The existing fixture constructs a
  HomePage using that same test-scoped page; it does not navigate automatically.
  `navigateToHome()` runs independently in each test.
- `clickDocs()` uses an exact Docs link within Main navigation. `clickGetStarted()`
  uses the exact hero link in the banner. Both check visible links and `/docs/intro`
  hrefs before clicking. Role/name/landmark scoping avoids matching unrelated links.
- `verifyDocsPage()` now checks the exact configured-origin destination, the
  Installation page title and an exact visible Installation heading in main.
  These shared expectations are human refinement, not recorded Codegen assertions.
- `await` waits for actions/assertions to finish. Playwright actions wait for
  actionability; web-first `expect` assertions retry the required outcome. Neither
  makes a wrong locator or wrong expected result correct. No fixed sleeps were added.
- The existing constructor stores the Page privately; locator helpers are private,
  but public methods such as `clickDocs()` are available to tests. A POM does not
  mean everything in the class is private.
- Imports alone do not activate every custom fixture. Requesting `homePage` in
  the test callback makes that reusable fixture part of the test's setup.
- Repeated scenario coverage remains intentionally visible for the comparison.
  In a production suite, keep the useful coverage and avoid maintaining duplicate
  scenarios solely because multiple tools produced them.

## Practical limits demonstrated (and not demonstrated)

The original Codegen test passed without explicit assertions: a concrete reason
to inspect a green test. Its clicks still used actionability checks, but did not
explicitly validate the expected navigation/content requirements.

The Generator's first live-code call failed because `expect` was undefined in
that tool context. Human review corrected tool usage before successful generation.
Public-site route/title changes, ambiguous locators or network availability can
still cause failures; a passing local run is not a guarantee of future stability.

This exercise has no mutable data or login. It therefore depends on public-site
availability and default documentation routing, not stored authentication.
In authenticated applications, agents need a correctly scoped seed/session and
safe test data; expired state, shared accounts and destructive actions require
additional review. Those are considerations, not demonstrated lab results.
Healer, authenticated generation, cross-browser execution, negative/error
injection and lab CI execution remain unexercised. No speed/productivity claim
was measured. Final refinement was completed with coaching at the user's request.

## Deliverables

- Original plan: `specs/playwright-docs.plan.md`.
- Human plan review: `specs/playwright-docs.plan-review.md`.
- Initial sources: `evidence/agent-lab/raw/*.ts.txt`.
- Final tests: `tests/agent-lab/generated/` and `tests/agent-lab/codegen-docs.spec.ts`.
- Initial/final review and results: `evidence/agent-lab/`.
- [Career wording and five interview answers](Test-Agents-Career-Handoff.md).
- [Job Search Plan Update Prompt](Job-Search-Plan-Update-Prompt.md).
- [File inventory, commands and suggested manual commit](../evidence/agent-lab/final-verification.md).

At the original learning handoff, no files had been committed or pushed. Review the shared POM's full diff because it
contains earlier learner changes as well as this exercise's refinements.

## Setup

- Project: `B:\Playwright-Projects\pw-framework`
- Playwright: pinned to `1.64.0` (previously installed `1.59.1`).
- Codex CLI discovered on the machine: `0.160.0`.
- Existing POM: `pages/homePage.ts`.
- Existing typed fixture: `fixtures/baseTest.ts` provides `homePage`.
- New seed: `tests/agent-lab/seed.spec.ts` starts at the home page using that fixture.
- Lab configuration: `playwright.agents.config.ts` inherits framework settings,
  uses Chromium only, one worker, zero retries, and separate report/output folders.
- Agent definitions: `.codex/agents/playwright_test_planner.toml`,
  `.codex/agents/playwright_test_generator.toml`, and the initializer's healer file.
- Official prompt templates are under `.codex/prompts/`. They contain example
  shopping-cart wording; use the workflow-specific prompts below instead.

Commands used for initialization:

```powershell
npm.cmd install --save-dev --save-exact @playwright/test@1.64.0
npx.cmd playwright install
npx.cmd playwright init-agents --loop=codex --project=chromium --prompts
```

The initializer was rerun after moving its new root seed into `tests/agent-lab`
so its templates point to the correct file. Regenerate definitions after a future
Playwright upgrade. Existing working UI tests and page objects were preserved.

## Start or repeat the lab

Open this repository as the Codex project so its project-scoped agents can be
discovered. A task opened in `B:\Resume` may not load this repository's agents.
If the agents do not appear in an existing session, start a fresh session in this
project. For the CLI:

```powershell
cd 'B:\Playwright-Projects\pw-framework'
codex
```

On this machine, regular PowerShell did not have `codex` on PATH. The app-bundled
binary also required foreground mode. The user successfully opened it with:

```powershell
& 'C:\Users\sbhar\AppData\Local\OpenAI\Codex\bin\f544b3844e0f14e9\codex.exe' --no-daemon
```

That app-managed binary path can change after an app update. Use the installed
CLI's current path if it changes.

The official TOML agent names use underscores. The built-in prompt templates use
hyphenated labels, so explicitly request `playwright_test_planner` and
`playwright_test_generator` by the TOML names below.

The repository's `.codex/config.toml` explicitly registers the official local
Playwright Test MCP server for the parent session. The agent definitions use the
same direct Node transport with the lab configuration and headless Chromium.
No global MCP registration or separate OpenAI API key was added for this lab.
Browser/process approval may be required by the host's sandbox. Confirm tool
availability in the fresh session before beginning exploration; a diagnostics
pass does not prove that a new session has loaded the custom agents.

### Connection check after restarting Codex

Type `/mcp` in the interactive Codex session and confirm `playwright-test` is
connected before submitting the Planner prompt. If it is absent or fails to
start, preserve the displayed error and fix registration/startup first.

On 10 October, the first user Planner invocation discovered the custom agent
but reported unavailable `planner_setup_page` and `planner_save_plan` tools.
It stopped without saving a plan. The initial agent-only configuration was
supplemented with project-level MCP registration, and the three generated agent
transports were changed from `cmd /c npx` to direct Node launch. They now pass
`--headless --config playwright.agents.config.ts`, require successful MCP startup,
and allow 30 seconds for startup and 90 seconds per tool. The direct server
diagnostic passed after these edits; connection in the restarted interactive
CLI must still be confirmed. Regenerating agent definitions resets these local
transport adjustments, so review them after running `init-agents` again.

### Step 1: Planner prompt

```text
Use the project custom agent playwright_test_planner and its official Playwright
Test MCP tools to explore only the public playwright.dev documentation navigation.
Seed: tests/agent-lab/seed.spec.ts. Project: chromium.
Existing references: tests/playwright-docs.spec.ts, pages/homePage.ts,
and fixtures/baseTest.ts.

Call planner_setup_page before exploring. Start from a fresh home page, click
the Docs link in the Main navigation, and separately the home Get started link.
Observe each destination URL and Installation heading. Propose no more than two
useful, independent scenarios for this workflow.
Do not invent login, form-validation, or data-creation scenarios for this page.
Separate observed behavior from assumptions and out-of-scope cases. Recognize
existing coverage and label any duplication intentionally used for comparison.
Use planner_save_plan to save specs/playwright-docs.plan.md. Put proposed test
file paths under tests/agent-lab/generated/. Stop after the plan is saved so I
can review the steps and expected results. Do not generate tests yet.
```

Review that each scenario has a fresh starting state, precise actions, observable
expected results, and real UI support. Choose one or two scenarios to generate.
Preserve the original plan before applying human corrections.

### Step 2: Generator prompt (after plan review)

```text
Use the project custom agent playwright_test_generator and its official
Playwright Test MCP tools for the reviewed scenario(s) in
specs/playwright-docs.plan.md. Seed: tests/agent-lab/seed.spec.ts; project: chromium.
Call generator_setup_page for each selected scenario, execute its steps and
assertions against the live UI, read generator_read_log, and save each test
using generator_write_test. Put one test per file in tests/agent-lab/generated/.
Keep the initial output so we can compare it with Codegen. Import the existing
fixture using the correct relative path. Do not create duplicate page classes
or fixtures, modify working specs, or use fixed sleeps. Report any assumptions
or failures honestly. Stop for human review before refactoring generated output.
```

Do not label manually drafted tests as output of the official Generator. After
generation, examine locator scope, assertions, repeated steps, and fixture use.
Preserve a raw copy as `.ts.txt` if useful, then reuse existing POM methods in
the executable version rather than adding a second HomePage implementation.

The first actual Generator attempt failed with `ReferenceError: expect is not
defined` in `browser_run_code_unsafe`. That tool's code context does not inject
Playwright Test's assertion library. The successful retry used dedicated browser
actions/visibility verification and snapshots to observe URL/title. The saved
tests correctly import `expect` through the existing fixture module. This is a
practical example of AI-generated tool usage requiring human review; it did not
require changing the application's working tests.

### Step 3: Manual Codegen recording

```powershell
cd 'B:\Playwright-Projects\pw-framework'
npm.cmd run agents:codegen
```

This opens a Chromium browser and Playwright Inspector and writes to
`tests/agent-lab/codegen-docs.spec.ts`. It does not consume the fixture or the
lab configuration. It starts at the explicit public URL supplied by the command.

1. In the recording browser, click **Docs** in the main navigation.
2. Use the assertion toolbar's visibility assertion on **Installation**.
3. Stop recording, inspect the code, and close the Inspector/browser.
4. Confirm the generated file is saved. Do not replace it with handwritten code
   and describe that as a recording.
5. Compare the recorded actions/assertions with the Generator output. Review
   URL validation, locator quality, unnecessary clicks, and reusable structure.

Keep the raw recording before editing, then add any missing business assertions
and integrate useful actions into the existing POM. Codegen's generated test name
may need to be renamed for readability.

### Step 4: Execute and preserve evidence

```powershell
npm.cmd run typecheck
npm.cmd run agents:test
npx.cmd playwright show-report playwright-report/agent-lab
```

`agents:test` includes the seed and any subsequently generated/recorded lab specs.
The seed is setup validation, not an AI-generated business test. Report the
business-test count separately. Failed tests retain traces under
`test-results/agent-lab`; the report lives under `playwright-report/agent-lab`.
These runtime folders are Git-ignored. Preserve sanitized results and review
notes in `evidence/agent-lab/`, which can be tracked. Nothing is pushed automatically.

## Repeatable setup verification

```powershell
npm.cmd run typecheck
npm.cmd run agents:seed
npm.cmd run agents:check
```

`agents:check` performs a local MCP handshake, checks the required tool names,
runs Planner seed setup, checks the live browser snapshot, runs Generator seed
setup, reads its recording log, and closes the diagnostic browser.
It produces `evidence/agent-lab/setup-mcp.json`. It does not invoke an LLM agent,
produce a test plan, write a generated test, or record user interactions.

## Honest completion boundary

Tooling setup alone supports saying "configured Playwright Test Agents for Codex".
Claims about exploring with Planner, generating with Generator, recording with
Codegen, or passing those generated tests require completion of the steps above.
Resume bullets, LinkedIn wording, and the Job Search Plan handoff should be written
after those results are known. No productivity metrics or enterprise ownership
should be inferred from this personal exercise.

## Required deliverables at the end of learning

On completion, prepare the repository changes for the user's review and manual
Git commit/push. Do not commit or push automatically.

- Add practical learning notes covering Planner, Generator, and Codegen: commands
  actually used, what each tool produced, limitations observed, and the user's
  corrections to locators, assertions, waits, fixtures, and POM structure.
- Preserve the original Planner plan, the reviewed plan (or a documented review),
  raw Generator/Codegen outputs where useful, and final executable test examples.
- Update README links and run instructions with the completed implementation and
  actual execution results. Distinguish passing tests from incomplete work.
- Save sanitized execution evidence and a comparison of generated versus recorded
  tests in trackable repository files. Keep credentials, authentication state,
  personal browser data, and unrelated runtime artifacts excluded from Git.
- Provide the requested career outputs and Job Search Plan Update Prompt based
  only on the completed and verified exercise.
- Finish with a concise file/change inventory, exact verification commands and
  results, remaining gaps, and a suggested commit message. Review `git status`
  and relevant diffs so the user can select the intended files for manual commit
  and push while preserving unrelated existing changes.

## Official references

- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright Codegen](https://playwright.dev/docs/codegen-intro)
- [Playwright release notes](https://playwright.dev/docs/release-notes)
- [Codex custom agents](https://developers.openai.com/codex/subagents)
- [Codex MCP configuration](https://developers.openai.com/codex/mcp)
