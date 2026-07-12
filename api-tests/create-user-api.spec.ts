import { test, expect } from '@playwright/test';
import { Environment } from '../config/environment';
import type { CreateUserRequest, CreateUserResponse } from '../api-utils/userApiTypes';

test.describe('API Testing - Create User', () => {

  test('should create a user successfully', async ({ request }) => {

    const requestBody: CreateUserRequest = {
      name: 'Bharath',
      job: 'SDET'
    };

    const response = await request.post(
      `${Environment.api.jsonPlaceholderBaseUrl}/users`,
      {
        data: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    expect(response.status()).toBe(201);

    const responseBody = await response.json() as CreateUserResponse;

    expect(responseBody.name).toBe('Bharath');

    expect(responseBody.job).toBe('SDET');

    console.log(responseBody);
  });
});
