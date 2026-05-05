import { test, expect } from '@playwright/test';

/**
 * Day 2 — navigation on playwright.dev
 *
 * Uses baseURL from playwright.config.ts, role-based locators, and
 * built-in assertions that retry (auto-wait).
 */
test.describe('Day 2 — playwright.dev navigation', () => {
  test('Docs link opens docs content with Installation', async ({ page }) => {
    await page.goto('/');

    const docsLink = page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Docs', exact: true });

    await docsLink.click();

    await expect(page).toHaveURL(/docs/);
    await expect(page.getByRole('main')).toContainText('Installation');
  });
});
