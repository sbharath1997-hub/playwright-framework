# Playwright Hooks & Fixtures

## beforeAll vs beforeEach

- `beforeAll`: runs once before all tests in a file or describe block.
- `beforeEach`: runs before every single test.
- Use `beforeAll` for expensive one-time setup: launch browser, log in once, load test data.
- Use `beforeEach` for clean, isolated state before each test: reset page, navigate fresh, recreate data.

## When to use each hook

- `beforeEach` is best for test isolation and avoiding cross-test side effects.
- `beforeAll` is best when setup is expensive and the same shared state is acceptable.
- Prefer `beforeEach` for UI tests unless performance demands otherwise.

## Shared mutable state problem

- Shared state can leak between tests if you mutate objects in `beforeAll` or global variables.
- Example: one test changes `user.name` and the next test gets the modified value.
- This causes flaky tests and hidden dependencies.

## Test isolation

- Each test should run independently of others.
- Use `beforeEach` plus fresh page/fixture state to avoid order dependency.
- If a test needs a clean state, do not reuse mutated objects across tests.

## Fixture mental model

- Fixtures are setup values or objects provided to tests.
- Think of fixtures as named resources: browser, page, logged-in session, helper objects.
- Playwright builds them once per scope and injects them where needed.

## Dependency injection concept

- Dependency injection means a test requests what it needs instead of creating it.
- In Playwright, tests get fixture values from function arguments.
- This keeps tests simple and reusable.

## Automatic fixture injection with `async ({ homePage })`

- Playwright automatically passes fixtures by name into the test callback.
- Example:

```ts
test('example', async ({ homePage }) => {
  await homePage.goto('/');
});
```

- `homePage` is created by a fixture and injected automatically.

## Variable declaration vs object initialization

- Declaration: `let homePage: HomePage;` reserves a name.
- Initialization: `homePage = new HomePage(page);` creates the actual object.
- In fixtures, avoid declaring a shared variable outside the fixture callback.
- Instead initialize inside the fixture or `beforeEach` to ensure fresh state.

## Common fixture injection mistakes and fixes

- Mistake: using a fixture name that is not defined
  - Fix: declare the fixture in your `fixtures` or `baseTest` setup.

- Mistake: sharing a page object across tests via outer-scope variables
  - Fix: create or inject the page object in each test or fixture.

- Mistake: mutating fixture state in one test and expecting it unchanged later
  - Fix: use `beforeEach` or per-test fixture scope to rebuild state.

- Mistake: expecting `beforeAll` to reset state automatically
  - Fix: use `beforeEach` for reset logic and `beforeAll` only for expensive static setup.

## Practical interview-friendly summary

- `beforeAll` = one-time setup, good for expensive shared resources.
- `beforeEach` = repeatable setup, good for isolation and stable tests.
- Fixtures = dependency injection for reusable test data/resources.
- Keep setup inside fixture callbacks, not in global outer scope.
- Avoid shared mutable state; each test should get a fresh working context.
