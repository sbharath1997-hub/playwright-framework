# Fixtures and Reusable Setup

## What are Fixtures?

Fixtures are reusable setup and teardown components in Playwright.

## Why are Fixtures useful?

- Reduce duplication
- Improve maintainability
- Provide reusable objects

## Example

```ts
test('sample', async ({ homePage }) => {
});

## What changed today?

- Replaced Playwright test import with custom fixture test
- Removed manual page object creation
- Used fixture-injected page objects

## Why are fixtures useful?

- Reduce duplicated setup
- Improve maintainability
- Centralize reusable objects
- Make tests cleaner

# Key learning

Fixtures allow reusable setup logic to be injected into tests automatically