# Playwright API + UI Chaining

## Hybrid automation workflow

- Combine API setup with UI verification in the same test flow.
- Use API calls for fast preconditions, then validate the end-to-end experience in the UI.
- This approach reduces test runtime and increases coverage.

## API utility reuse

- Keep API helper functions in a shared folder like `api-utils/`.
- Reuse the same request, auth, and response parsing logic across tests.
- Reusable helpers reduce duplication and make failures easier to fix.

## Validating API responses

- Assert status codes, body structure, and important field values.
- Example: `expect(response.status()).toBe(201);` and `expect(data.id).toBeDefined();`
- Validating API results before UI steps catches backend issues early.

## Using API-generated data inside UI flow

- Create data with API calls, then use that data in the UI test.
- Example: create a user by API and then log in with that account through the UI.
- This keeps UI tests stable by avoiding brittle UI setup flows.

## Importance of reusable API helpers

- Reusable helpers make tests easier to read and maintain.
- They allow teams to standardize request headers, base URLs, auth, and payload shapes.
- When API contracts change, update helpers once instead of every test.

## API + UI integration patterns

- Setup via API, verify via UI: fast backend setup, strong frontend validation.
- UI action with API verification: perform UI steps, then confirm backend state via API.
- Data-driven hybrid tests: generate test cases from API data and validate through UI.

## Mock API limitations

- Mocks can speed tests, but they may not reflect real backend behavior.
- Mock persistence is temporary and often ignores business rules.
- Over-reliance on mocks can hide integration problems.

## Difference between mock persistence and real persistence

- Mock persistence simulates responses in memory or stubbed handlers.
- Real persistence writes to a database or service and follows actual workflows.
- For true end-to-end confidence, prefer real persistence for critical paths.

## Benefits of hybrid automation frameworks

- Faster setup and more reliable tests.
- Better coverage by combining API and UI checks.
- Easier maintenance through reusable helpers and clear separation of concerns.
- Hybrid frameworks are more resilient to UI instability and backend changes.
