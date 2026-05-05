import { test, expect } from '@playwright/test';

test.describe('Playwright setup smoke', () => {
  test('homepage has title mentioning Playwright', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('Get Started link is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });
});
