import { test, expect } from '@playwright/test';

test.describe('API Testing - GET Users', () => {
  test('should fetch users successfully', async ({ request }) => {

    const response = await request.get('https://jsonplaceholder.typicode.com/users');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.length).toBeGreaterThan(0);

    expect(responseBody[0].id).toBe(1);

    console.log(responseBody);
  });
});