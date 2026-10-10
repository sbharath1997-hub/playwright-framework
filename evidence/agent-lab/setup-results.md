# Test Agents and Codegen setup verification

Verified on 9 October 2026 (Asia/Calcutta).

## Environment

- Node.js: `v24.13.0`.
- npm: `11.6.2`.
- Codex CLI: `0.160.0`.
- Playwright: upgraded from installed `1.59.1` to pinned `1.64.0`.
- `npm install` reported zero vulnerabilities in the installed dependency set.
- Installed matching Chromium, Chromium Headless Shell, Firefox, WebKit, and
  FFmpeg binaries. The installer removed old cached browser revisions; those
  are downloadable binaries and can be restored with the corresponding version's
  `playwright install` command if needed.

## Actual checks and results

| Command/check | Actual result |
| --- | --- |
| `npx.cmd playwright --version` | `Version 1.64.0` |
| `npx.cmd playwright init-agents --help` | `codex` is an accepted loop provider |
| `npx.cmd playwright init-agents --loop=codex --project=chromium --prompts` | Agent TOML definitions, official prompt templates, specs directory, and initial seed created successfully |
| `npm.cmd run typecheck` | Passed after setup changes |
| `node --check scripts/verify-playwright-agents.cjs` | Passed |
| `npx.cmd playwright test --config=playwright.agents.config.ts --list` | One Chromium seed discovered |
| `npm.cmd run agents:seed` | **1 passed (10.4s)**; the seed test took 9.3s |
| `npx.cmd playwright test tests/playwright-docs.spec.ts tests/playwright-homepage-smoke.spec.ts --project=chromium --reporter=list --output=test-results/agent-baseline` | **3 passed (5.9s)** |
| `npm.cmd run agents:check` | Passed MCP handshake, seven required tool checks, Planner seed setup, live snapshot, Generator seed setup/log, and browser cleanup |
| `npx.cmd playwright codegen --help` | Confirmed recorder supports Chromium, `playwright-test`, and file output |

The three existing tests executed were:

1. Docs link opens docs content with Installation.
2. Homepage has title mentioning Playwright.
3. Get Started link is visible (including navigation/heading checks).

The machine-readable MCP setup evidence is [setup-mcp.json](setup-mcp.json).
The tests were run outside the tool sandbox to permit browser/process launch and
network access. This does not prove every test in the framework still passes;
the selected docs workflow and setup seed were the verification scope.

## A real setup issue corrected

The first diagnostic reached the live page but failed when closing the browser:
`browser_close` required an `intent` string. The diagnostic now supplies an intent
for each cleanup call; the next complete diagnostic passed. This correction was
to the setup helper, not an AI-generated business test.

## Ready artifacts

- `.codex/agents/playwright_test_planner.toml`
- `.codex/agents/playwright_test_generator.toml`
- `.codex/agents/playwright_test_healer.toml` (initializer output; not exercised)
- `.codex/prompts/` official templates
- `tests/agent-lab/seed.spec.ts` using the existing fixture/POM
- `playwright.agents.config.ts`
- `scripts/verify-playwright-agents.cjs`
- `Playwright-Notes/Test-Agents-Codegen-Lab.md` with exact morning prompts/commands
- README setup section

## Outstanding after setup on 9 October (historical)

Planner, Generator, manual Codegen and final verification were subsequently
completed on 10 October. See [final verification](final-verification.md).
The checklist below preserves the original setup boundary; publication is still
pending the user's manual commit/push.

- Start a Codex session in this repository and confirm discovery of the custom
  agent names. The setup diagnostic directly calls their server, not an LLM agent.
- Invoke Planner, explore the workflow, and save/review its actual plan.
- Invoke Generator using that reviewed plan and preserve its initial output.
- Perform a manual Codegen recording and preserve the raw recorded output.
- Compare, refactor into the existing POM/fixtures, and execute those new tests.
- Document actual generated-test results and prepare career statements/handoff.
- Publish evidence to GitHub if requested. No commit or push was performed.

No AI-generated test plan, AI-generated business test, or manually recorded
Codegen test is claimed as completed by this setup verification.
