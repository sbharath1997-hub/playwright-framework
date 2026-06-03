# GitHub Actions and CI/CD for Playwright

## CI vs CD Concepts

- **CI (Continuous Integration)**: automatically build and test code when changes are pushed.
- **CD (Continuous Delivery/Deployment)**: automatically release code to staging or production.
- CI is about quality checks; CD is about delivering working code safely.

## Purpose of GitHub Actions

- Automates workflows in GitHub using YAML files.
- Runs builds, tests, deployments, and other tasks on every push or PR.
- Lets teams enforce consistent automation for Playwright tests.

## `.github/workflows` Folder Structure

- Stores workflow YAML files for GitHub Actions.
- Each file defines one or more automation workflows.
- Common files: `playwright.yml`, `ci.yml`, `deploy.yml`.

## Workflow File Purpose

- Describes when the automation should run and what it should do.
- Contains metadata, triggers, jobs, and steps.
- Makes the pipeline visible and version-controlled.

## Meaning of `name`, `on`, `jobs`, `runs-on`, and `steps`

- `name`: human-friendly workflow title.
- `on`: events that trigger the workflow, like `push` or `pull_request`.
- `jobs`: separate tasks that can run in parallel or sequentially.
- `runs-on`: runner environment, e.g. `ubuntu-latest`.
- `steps`: individual commands or actions inside a job.

## GitHub-hosted Runners

- Pre-provisioned virtual machines provided by GitHub.
- Common options: `ubuntu-latest`, `windows-latest`, `macos-latest`.
- No self-hosting required for standard Playwright CI.

## `npm ci` Usage in Pipelines

- Installs dependencies from `package-lock.json` consistently.
- Faster and more reliable than `npm install` in CI.
- Use it to ensure reproducible installs before running tests.

## Playwright Test Execution in CI

- Run Playwright with `npx playwright test` in a workflow step.
- Use `--reporter=html` or `--reporter=list` for CI-friendly output.
- Add `npx playwright install --with-deps` if browser binaries are needed.

## Benefits of Automated Test Execution

- Catches regressions early on every commit.
- Provides fast, consistent feedback to developers.
- Reduces manual test effort and improves release confidence.

## Common YAML Formatting Mistakes

- Incorrect indentation is the most common error.
- Missing dashes for list items or wrong spacing around keys.
- Invalid keys or typoed property names like `runs_on` instead of `runs-on`.

## Real-World Automation Pipeline Flow

1. Developer pushes code or opens a pull request.
2. GitHub Actions triggers the workflow via `on: push` or `pull_request`.
3. Job runs on a GitHub-hosted runner.
4. Pipeline installs dependencies with `npm ci`.
5. Playwright tests execute and report results.
6. Workflow uploads reports or stops the merge if tests fail.

> Tip: In interview answers, emphasize that GitHub Actions makes Playwright CI repeatable and easy to inspect.