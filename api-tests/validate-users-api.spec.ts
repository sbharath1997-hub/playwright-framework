import { test, expect } from '@playwright/test';

test.describe('API Testing - Validate User', () => {
  test('should validate user response structure and data', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

    expect(response.status()).toBe(200);

    const user = await response.json();

    expect(user).toMatchObject({
      id: 1,
      username: 'Bret'
    });

    expect(user.email).toContain('@');
    expect(Array.isArray(user.address.geo.lat.split('.'))).toBeTruthy();
  });
});
