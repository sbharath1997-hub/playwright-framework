import { test, expect } from '@playwright/test';
import { Environment } from '../config/environment';

test.describe('Day 1 — example.com', () => {
  test('loads with expected title and body copy', async ({ page }) => {
    await page.goto(Environment.exampleUrl);

    await expect(page).toHaveTitle(/Example Domain/);

    await expect(page.locator('body')).toContainText('Example Domain');
  });
});
