# Playwright API Response Validation

## Validating response status codes

- Always assert expected HTTP status codes.
- `expect(response.status()).toBe(200)` for successful GET.
- `expect(response.status()).toBe(201)` for successful POST-created resources.

## Validating JSON response bodies

- Parse JSON with `await response.json()`.
- Assert key fields and values.
- Example:
  - `expect(body.id).toBe(1)`
  - `expect(body.email).toContain('@')`

## `toMatchObject` usage

- Use `expect(body).toMatchObject({ ... })` for partial object matching.
- Good for validating important fields without exact payload shape.
- Example:
  - `expect(body).toMatchObject({ id: 1, username: 'Bret' })`

## Nested object validation

- Validate nested fields directly.
- Example:
  - `expect(body.address.city).toBe('Gwenborough')`
  - `expect(body.company.name).toContain('Group')`

## Validating API response structure

- Check required keys exist and types match.
- Example:
  - `expect(body).toHaveProperty('data')`
  - `expect(Array.isArray(body.items)).toBe(true)`

## Data quality validation examples

- Validate required values are not empty:
  - `expect(body.name).not.toBe('')`
- Validate formats:
  - `expect(body.email).toMatch(/.+@.+\..+/)`
- Validate counts:
  - `expect(body.length).toBeGreaterThan(0)`

## Why API validation is important in automation testing

- Confirms backend behavior before UI relies on it.
- Detects broken contracts early.
- Makes tests faster and more stable.
- Improves confidence in end-to-end scenarios.

## Good API test naming practices

- Use clear, action-oriented names.
- Example:
  - `should fetch users successfully`
  - `should create a new user and return 201`
  - `should validate user details for existing user`
- Keep names focused on behavior and expected result.

## Using GitHub Copilot for API test generation and refinement

- Use Copilot to draft request and assertion code quickly.
- Review generated code carefully for actual API contract.
- Refine variable names and assertions to match your test data.
- Treat Copilot output as a starting point, not a finished test.
