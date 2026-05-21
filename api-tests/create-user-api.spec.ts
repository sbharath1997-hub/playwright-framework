import { test, expect } from '@playwright/test';

test.describe('API Testing - Create User', () => {

  test('should create a user successfully', async ({ request }) => {

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

    const responseBody = await response.json();

    expect(responseBody.name).toBe('Bharath');

    expect(responseBody.job).toBe('SDET');

    console.log(responseBody);
  });
});