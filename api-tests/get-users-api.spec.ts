import { test, expect } from '@playwright/test';
import { Environment } from '../config/environment';

test.describe('@api API Testing - GET Users', () => {
  test('should fetch users successfully', async ({ request }) => {

    const response = await request.get(`${Environment.api.jsonPlaceholderBaseUrl}/users`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.length).toBeGreaterThan(0);

    expect(responseBody[0].id).toBe(1);

    console.log(responseBody);
  });
});
