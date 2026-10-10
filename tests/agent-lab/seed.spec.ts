import { test, expect } from '../../fixtures/baseTest';

// Environment setup only. Planner and Generator start from this home page.
test('Playwright docs agent seed', { tag: '@agent-setup' }, async ({ homePage, page }) => {
  await homePage.navigateToHome();
  await expect(page).toHaveTitle(/Playwright/);
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Docs', exact: true }),
  ).toBeVisible();
});
