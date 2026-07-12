# API Testing and Hybrid Flows

## 1. API Testing Overview

- Playwright supports API testing through `APIRequestContext` and `page.request`.
- API tests are useful for validating backend contracts, seeding test data, and stabilizing UI scenarios.
- Focus on real automation framework use:
  - API tests for fast validation of endpoints
  - API setup for UI tests
  - API verification after UI actions

## 2. APIRequestContext

- Create reusable request contexts in fixtures or helpers.
- Example pattern:
  - `const apiContext = await request.newContext({ baseURL, extraHTTPHeaders })`
  - `await apiContext.get('/users')`
- Use shared utilities to centralize headers, auth, and base URL configuration.
- Benefits:
  - consistent request behavior across tests
  - easier maintenance when API contracts change

## 3. GET Requests

- Use GET to retrieve data and validate that the backend returns expected resources.
- Always assert response status and relevant response fields.
- Example:
  - `const response = await apiContext.get('/users/1')`
  - `expect(response.status()).toBe(200)`
  - `const body = await response.json()`
  - `expect(body).toMatchObject({ id: 1 })`
- Validate structure and presence of required data, not just success status.

## 4. POST Requests

- Use POST to create resources and verify creation semantics.
- Common assertions:
  - `expect(response.status()).toBe(201)` for created resources
  - `const body = await response.json()`
  - `expect(body.id).toBeDefined()`
- Keep payloads clear and minimal for interview examples.
- Verify created data through response body or follow-up GET if needed.

## 5. Response Validation

- Core validation checklist:
  - status code
  - JSON payload shape
  - required fields and types
  - values and formats
- Useful assertions:
  - `expect(body).toHaveProperty('data')`
  - `expect(Array.isArray(body.items)).toBe(true)`
  - `expect(body.email).toMatch(/.+@.+\..+/)`
- Use partial matching with `toMatchObject` for important fields without strict full-object equality.
- Validate nested properties when contract requires it:
  - `expect(body.address.city).toBe('Gwenborough')`

## 6. Typed API Contracts

Typed API contracts describe the expected request and response payload shapes.
- Request types document what the test sends.
- Response types document what the API should return.
- Helper return types allow API data to stay typed when reused in hybrid UI flows.

Example:
```ts
export type CreateUserRequest = {
  name: string;
  job: string;
};

export type CreateUserResponse = CreateUserRequest & {
  id: number;
};
```

When parsing JSON, Playwright returns untyped data by default:

```ts
const responseBody = await response.json() as CreateUserResponse;
```

For reusable helpers:

```ts
export default async function createUser(
  request: APIRequestContext
): Promise<CreateUserResponse> {
  // request logic
}
```

Benefits:
- Tests get autocomplete and compile-time field checks.
- API helpers become self-documenting.
- Hybrid tests can safely reuse API-created data.
- Mistyped fields are easier to catch during TypeScript checks.

Trade-off:
- Type assertions do not validate the response at runtime.
- Runtime schema validation can be added later for stronger contract testing.

Interview point: typed API models improve reliability at the TypeScript level, while runtime validation tools verify the actual response during execution. They solve related but different problems.

## 7. API Chaining

- Chain API calls to keep tests efficient and maintain state.
- Example flows:
  - create resource with POST, then GET or DELETE with returned ID
  - login via API, then use session data in UI tests
- API chaining is a practical technique for building end-to-end scenarios without fragile UI setup.
- Use generated API data inside later steps to keep tests deterministic.

## 8. Hybrid API + UI Testing

- Hybrid tests combine backend setup/validation with UI verification.
- Common patterns:
  - API setup, then UI validation: create or seed data via API, then verify UI behavior
  - UI action, then API verification: perform UI steps and confirm backend state through API
- Advantages:
  - faster setup than pure UI flows
  - more stable tests by avoiding slow or brittle UI preconditions
  - broader coverage across frontend and backend
- Keep API and UI layers separate but interoperable.

## 9. Framework Integration

- Organize automation code for clarity:
  - `api-utils/` for request helpers and reusable API logic
  - `fixtures/` for shared setup, authenticated contexts, and injection of request contexts
  - `pages/` for UI page objects
  - separate `api-tests/` and `tests/` for focused coverage
- Shared helpers should manage:
  - base URL and headers
  - auth tokens
  - JSON parsing, typed payloads, and result assertions
- Reusable helpers reduce duplication and make failures easier to fix.

## 10. Best Practices

- Keep tests concise and behavior-focused.
- Use clear naming such as:
  - `should fetch users successfully`
  - `should create a new user and return 201`
- Validate backend contracts early to catch issues before UI reliance.
- Add TypeScript request and response models for important API payloads.
- Prefer real persistence for critical hybrid tests over mocks when verifying integration behavior.
- Archive stale compiled artifacts and restart the runner after major code changes if you encounter mysterious behavior.
- Use Copilot for draft code, but always verify generated requests and assertions against actual API contracts.

## 11. Common Interview Questions

- What is `APIRequestContext` and why is it useful in Playwright?
- How do you validate a response body in Playwright API tests?
- How do TypeScript API models improve Playwright API tests?
- What is the difference between TypeScript typing and runtime schema validation?
- When should you use `toMatchObject` instead of exact object matching?
- How do you combine API and UI testing in the same flow?
- What are the benefits of using API setup in UI tests?
- How do you organize API helpers in a hybrid framework?
- What is the difference between validating API contracts and using mock APIs?

---

## Duplicate content found across the source files

- Status code validation and the distinction between `200` and `201`.
- Response validation techniques: status assertions, JSON parsing, required keys, partial matching.
- Reusable API helper guidance and the value of shared utilities.
- Hybrid API + UI testing patterns: setup via API, validation via UI, and API verification after UI actions.

## Unique content worth preserving

- Debugging runtime issues and stale compiled artifact cleanup from `API-Testing-and-Hybrid-Frameworks.md`.
- Architecture guidance on folder structure (`api-utils/`, `fixtures/`, `pages/`, `tests/`) from `API-Testing-and-Hybrid-Frameworks.md`.
- Mock persistence vs real persistence insight from `API-UI-Chaining.md`.
- Interview-style naming guidance and use of Copilot as a drafting tool from `API-Response-Validation.md`.

## Recommendation on original files

- Archive or consolidate the originals once `API-Testing-and-Hybrid-Flows.md` is accepted as the single source of truth.
- Keep the originals only if you want file-specific history; otherwise delete them to reduce redundancy.
