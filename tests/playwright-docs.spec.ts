import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';

/**
 * Day 2 / 3 — navigation on playwright.dev via Page Object Model.
 */
test.describe('Day 2 — playwright.dev navigation', () => {
  test('Docs link opens docs content with Installation', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateToHome();
    await homePage.clickDocs();
    await homePage.verifyDocsPage();
  });
});
