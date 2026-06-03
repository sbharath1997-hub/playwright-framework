# Playwright Tags and Selective Test Execution

## Purpose of Tags

- Tags categorize tests by intent, speed, or layer.
- They make it easy to run only relevant tests during development or CI.
- Good tags keep large suites organized and fast to execute.

## `@smoke`, `@regression`, and `@api`

- `@smoke`: critical, fast checks for core application flows.
- `@regression`: broader coverage to catch bugs after changes.
- `@api`: tests focused on API endpoints or backend behavior.
- Use the right tag for the test’s purpose, not just its location.

## Selective Execution Using `--grep`

- Run tagged tests with `npx playwright test --grep "@smoke"`.
- Combine tags with regex: `--grep "(@smoke|@api)"`.
- Exclude tags with `--grep-invert "@slow"` for quick runs.

## Benefits of Organizing Test Suites

- Faster feedback loops.
- Easier triage of failures.
- Better CI staging and targeted validation.
- Clearer test ownership and maintenance.

## Smoke vs Regression Strategy

- Keep smoke suites small and stable.
- Use regression for deeper coverage and change impact.
- Run smoke on every commit; run regression on nightly or before release.

## API Test Categorization

- Tag API tests separately from UI tests.
- Use `@api` for backend-only verification and `@smoke` or `@regression` when API tests support a business flow.
- Helps choose fast API checks for quick validation and broader API regression for stability.

## Real-World Framework Usage

- Define tags consistently in test names or `describe` blocks.
- Use tags in CI to control stages: smoke on PRs, regression on merge or nightly.
- Keep tag conventions documented for new team members.

## Common Tagging Mistakes

- Using inconsistent tag names like `smoke` and `@smoke` interchangeably.
- Tagging too many tests as smoke, which dilutes its purpose.
- Relying on folder structure instead of explicit tags.
- Forgetting to update tags when test scope changes.

## CI Pipeline Execution Using Tags

- Use tags to limit CI runs and save resources.
- Example: PR builds run `--grep "@smoke"`, full pipelines run `--grep "@regression"`.
- Tag-driven CI makes test runs more predictable and efficient.

> Tip: In interviews, explain tags as a lightweight way to route tests through development and CI without changing code structure.