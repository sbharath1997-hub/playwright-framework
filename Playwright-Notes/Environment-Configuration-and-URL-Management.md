# Environment Configuration and URL Management

## Purpose of Centralized Configuration

- Keep environment values in one place for consistency.
- Reduce duplication and make changes safe.
- Makes tests easier to read and maintain.

## Avoiding Hardcoded URLs

- Never hardcode environment URLs directly in tests.
- Use variables or a configuration file instead.
- This prevents broken tests when environments change.

## `environment.ts` Usage

- Define environment settings in `environment.ts`.
- Example contents:

```ts
export const environment = {
  baseUrl: 'https://qa.example.com',
  apiUrl: 'https://api.qa.example.com',
};
```

- Import it in tests or fixtures for consistent values.

## Playwright `baseURL` Concept

- `baseURL` is configured in `playwright.config.ts`.
- It lets tests use relative paths like `page.goto('/')`.
- This makes browser navigation environment-independent.

## Single Source of Truth Principle

- One config file should govern URLs and environment settings.
- Avoid multiple copies of the same URL across tests.
- Keeps framework changes easy and low-risk.

## Benefits for Framework Maintenance

- Faster environment switches.
- Fewer brittle tests due to hardcoded values.
- Easier onboarding for new team members.
- Cleaner CI and local execution setup.

## QA / UAT / Production Environment Management

- Store separate configs for each environment:
  - QA
  - UAT
  - Production
- Choose environment with a CLI variable or config flag.
- Example: `npx playwright test --project=chromium --config=playwright.config.ts --env=qa`

## Framework Scalability Considerations

- Central config scales with more environments and app versions.
- Use named environments instead of scattered constants.
- Keep environment-specific settings separate from test logic.

## Practical Implementation Using `environment.ts`

- Create `environment.ts` with environment map.
- Export a function or object for the active environment.
- Use it in fixtures and `baseURL` configuration.
- Example:

```ts
const envs = {
  qa: { baseUrl: 'https://qa.example.com' },
  uat: { baseUrl: 'https://uat.example.com' },
  prod: { baseUrl: 'https://www.example.com' },
};

export const getEnv = (name = 'qa') => envs[name];
```

- In `playwright.config.ts`, set `baseURL` from the selected environment.

> Tip: A simple environment config keeps Playwright tests portable and interview-ready.