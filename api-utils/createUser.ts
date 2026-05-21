import { APIRequestContext, expect } from '@playwright/test';

export default async function createUser(
  request: APIRequestContext
) {

  const requestBody = {
    name: 'Bharath',
    job: 'SDET'
  };

  const response = await request.post(
    'https://jsonplaceholder.typicode.com/users',
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