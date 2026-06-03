import { test, expect } from '@playwright/test';
import createUser from '../api-utils/createUser';

test.describe('@api @regression Hybrid API + UI Testing', () => {

  test('should create user using API utility', async ({ request }) => {

    const createdUser = await createUser(request);

    expect(createdUser.name).toBe('Bharath');

    console.log(createdUser);
  });
});