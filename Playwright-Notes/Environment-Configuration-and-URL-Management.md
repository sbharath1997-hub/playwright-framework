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

## Typed Environment Config in This Framework

The framework now keeps supported UI and API base URLs in `config/environment.ts`.

```ts
export type EnvironmentConfig = {
  name: TestEnvironmentName;
  ui: {
    playwrightBaseUrl: string;
    automationExerciseBaseUrl: string;
    exampleBaseUrl: string;
  };
  api: {
    jsonPlaceholderBaseUrl: string;
  };
};
```

The exported config is checked with TypeScript:

```ts
export const Environment = {
  name: 'demo',
  ui: {
    playwrightBaseUrl: 'https://playwright.dev',
    automationExerciseBaseUrl: 'https://automationexercise.com/',
    exampleBaseUrl: 'https://example.com',
  },
  api: {
    jsonPlaceholderBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
} as const satisfies EnvironmentConfig;
```

Why this is useful:
- `playwright.config.ts` reads `Environment.ui.playwrightBaseUrl` for `baseURL`.
- Page objects read UI URLs from `Environment.ui`.
- API tests and API helpers read service URLs from `Environment.api`.
- URL changes happen in one file instead of across multiple tests.

TypeScript point: `satisfies EnvironmentConfig` confirms that the config has the required shape. `as const` keeps the values readonly and preserves literal inference.

## Playwright `baseURL` Concept

- `baseURL` is configured in `playwright.config.ts`.
- It lets tests use relative paths like `page.goto('/')`.
- This makes browser navigation environment-independent.

## Single Source of Truth Principle

- One config file should govern URLs and environment settings.
- Avoid multiple copies of the same URL across tests.
- Keeps framework changes easy and low-risk.
- Separate UI URLs from API URLs so tests communicate intent clearly.

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

## Interview Explanation

In this framework, environment configuration was centralized before adding advanced multi-environment switching. This is intentional.
- First, remove scattered hardcoded URLs.
- Next, keep the config typed and grouped by purpose.
- Later, add runtime selection for QA, UAT, or production only when the project genuinely needs it.

Good interview answer:

> I centralized UI and API base URLs in a typed `environment.ts` file. Playwright's `baseURL`, page objects, API tests, and API utilities now read from the same config object. This reduces duplication, makes environment changes safer, and prepares the framework for future QA/UAT/prod switching without redesigning the test suite.
