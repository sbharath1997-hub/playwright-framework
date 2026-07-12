import { APIRequestContext, expect } from '@playwright/test';
import { Environment } from '../config/environment';

export default async function createUser(
  request: APIRequestContext
) {

  const requestBody = {
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

  return await response.json();
}
