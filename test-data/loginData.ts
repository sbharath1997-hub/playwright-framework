/**
 * Shared test data for login-related scenarios.
 * Uses placeholder values only; no real credentials.
 */

export type LoginDataset = {
  name: string;
  email: string;
  password: string;
  expectedOutcome: 'invalid_credentials' | 'empty_required_fields';
  expectedErrorMessage?: string;
};

export const invalidLoginDatasets: LoginDataset[] = [
  {
    name: 'invalid email and invalid password',
    email: 'invalid.user@example.test',
    password: 'WrongPass123!',
    expectedOutcome: 'invalid_credentials',
    expectedErrorMessage: 'Your email or password is incorrect!',
  },
  {
    name: 'valid-format email with incorrect password',
    email: 'registered.placeholder@example.test',
    password: 'IncorrectPassword!',
    expectedOutcome: 'invalid_credentials',
    expectedErrorMessage: 'Your email or password is incorrect!',
  },
  {
    name: 'empty email and password',
    email: '',
    password: '',
    expectedOutcome: 'empty_required_fields',
  },
];

