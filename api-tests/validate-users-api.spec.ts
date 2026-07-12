import { test, expect } from '@playwright/test';
import { Environment } from '../config/environment';

test.describe('@api @regression API Testing - Validate User', () => {
  test('should validate user response structure and data', async ({ request }) => {
    const response = await request.get(`${Environment.api.jsonPlaceholderBaseUrl}/users/1`);

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
