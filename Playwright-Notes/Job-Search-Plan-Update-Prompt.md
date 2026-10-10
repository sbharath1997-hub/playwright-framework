# Job Search Plan Update Prompt

Copy the prompt below into the main Job Search Plan chat.

```text
Update my job-search materials based on the following verified personal-project
experience. Use it in my Playwright framework/project section, not as invented
enterprise production experience at IBM or Infosys. Do not fabricate metrics,
claim Healer use, or imply advanced autonomous-agent expertise.

Background: approximately five years in QA automation, strongest professional
stack Selenium + Java, Cucumber BDD, API and integration testing. My personal
Playwright + TypeScript framework already had POM and typed fixtures.

Completed on 10 October 2026 in B:\Playwright-Projects\pw-framework:
- Upgraded the installed Playwright 1.59.1 to pinned 1.64.0 for the official
  Codex Test Agents setup. Initialized Planner, Generator and Healer definitions;
  exercised Planner and Generator only. Registered the local Playwright Test
  MCP server with a Chromium-only lab configuration and a fixture/POM-based seed.
- Used the custom playwright_test_planner in the Codex CLI to explore Docs in
  Main navigation and the homepage Get started link. Both reached
  https://playwright.dev/docs/intro with title Installation | Playwright and a
  visible Installation heading. Saved specs/playwright-docs.plan.md via the
  Planner tool and reviewed it in specs/playwright-docs.plan-review.md.
- Used the custom playwright_test_generator with the reviewed plan, Chromium
  and tests/agent-lab/seed.spec.ts. Its CLI completion report states it used live
  tools, generator_read_log and generator_write_test to save one test per scenario.
- Manually recorded the Docs flow with Codegen. The actual recording contained
  extra clicks and no explicit assertions. Preserved that source before edits.
- Completed a coached refinement: removed recording noise, corrected imports,
  used the existing homePage fixture/POM, and checked exact destination URL,
  page title and Installation visibility with web-first assertions. Generator
  tests were also refactored into the existing POM; no duplicate fixture or
  page-object class was introduced. The coach completed final edits at my request.

Tools/commands actually used:
npm.cmd install --save-dev --save-exact @playwright/test@1.64.0
npx.cmd playwright install
npx.cmd playwright init-agents --loop=codex --project=chromium --prompts
App-bundled Codex CLI 0.160.0 launched with --no-daemon from the repository.
node node_modules/playwright/cli.js run-test-mcp-server --headless --config playwright.agents.config.ts
MCP setup diagnostic: npm.cmd run agents:check
Planner: planner_setup_page, live browser tools, planner_save_plan
Generator: generator_setup_page, live browser tools, generator_read_log, generator_write_test
npm.cmd run agents:codegen
npm.cmd run typecheck
npm.cmd run agents:test
npx.cmd playwright test tests/playwright-docs.spec.ts tests/playwright-homepage-smoke.spec.ts --project=chromium --reporter=list --output=test-results/agent-baseline

Scenarios and actual execution:
- Initial Generator Docs and Get started tests: 2 passed (5.1s), local Chromium.
- Raw Codegen Docs recording: 1 passed (3.8s), despite having no explicit assertions.
- Final POM-refined lab: 4 passed (13.7s latest rerun; 5.3s earlier run), comprising
  THREE business tests covering
  TWO distinct navigation paths plus ONE setup seed. The recorded Docs test is
  intentional comparison overlap, not an additional distinct business scenario.
- Existing documentation/homepage smoke tests after the shared POM changes:
  3 passed (2.7s). Final TypeScript checking passed.
- Final lab used one worker and zero retries. No whole-framework pass is claimed.

Actual failures/limitations:
- Initially the CLI could not access the required MCP tools; project registration
  and transport settings were corrected before successful agent use.
- rg was absent in the CLI PATH; known files were read with PowerShell Get-Content.
- A Generator browser_run_code_unsafe call failed: ReferenceError: expect is not
  defined. The retry used dedicated browser/visibility tools and snapshots;
  saved test code correctly imports expect from the existing fixture module.
- A learner refinement produced TS2300 duplicate test/expect imports; corrected
  before final verification. Final refactoring was coach-assisted.
- This exercise was public read-only navigation. It did not exercise agent-driven
  authentication/storageState, mutable test data, error injection, Healer,
  cross-browser execution or production deployment.
- Existing GitHub Actions runs an @api subset; these new lab tests were verified
  locally, not in CI. No productivity measurement was performed.
- These results describe local execution, not GitHub CI execution. Check remote
  Git history separately before claiming the artifacts are published. Publication
  was pending at the original learning handoff; the user subsequently requested
  a reviewed commit, merge and push.

Evidence and deliverables:
specs/playwright-docs.plan.md
specs/playwright-docs.plan-review.md
tests/agent-lab/generated/playwright-docs-main-navigation.spec.ts
tests/agent-lab/generated/playwright-docs-get-started.spec.ts
tests/agent-lab/codegen-docs.spec.ts
evidence/agent-lab/raw/ (initial Generator and Codegen sources as .ts.txt)
evidence/agent-lab/generator-results.md
evidence/agent-lab/codegen-review.md
evidence/agent-lab/final-results.json
evidence/agent-lab/final-verification.md
Playwright-Notes/Test-Agents-Codegen-Lab.md
Playwright-Notes/Test-Agents-Career-Handoff.md
README.md updated with completed scope, results and links.

Verified resume-ready wording options:
1. Used Playwright Test Agents (Planner and Generator) and Codegen in a TypeScript
   automation framework to create and review documentation-navigation tests,
   integrating final coverage with existing POM and typed fixtures.
2. Implemented a personal AI-assisted Playwright test-generation exercise,
   reviewing test plans, refining recorded/generated locators and web-first
   assertions, and verifying Chromium tests with preserved execution evidence.

Skills I can discuss: Planner versus Generator versus Codegen, AI-assisted test
generation with human review, accessible-role locator scoping, auto-waiting versus
explicit outcome assertions, fixtures/test isolation, POM reuse, generated test
duplication, raw-output provenance and interpreting actual test results.

Please update the relevant personal-project resume wording, LinkedIn description,
GitHub portfolio wording and interview talking points using only this scope.
Keep all existing professional experience truthful. Do not invent RestAssured
experience or deep Jenkins ownership. Flag gaps instead of filling them with
unsupported claims, and suggest the next small practice task if needed.
```
