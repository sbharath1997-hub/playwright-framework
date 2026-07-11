import { test } from '../fixtures/baseTest';

/**
 * Day 2 / 3 — navigation on playwright.dev via Page Object Model.
 */
test.describe('@smoke Day 2 — playwright.dev navigation', () => {
  test('Docs link opens docs content with Installation', async ({ homePage }) => {
    await homePage.navigateToHome();
    await homePage.clickDocs();
    await homePage.verifyDocsPage();
  });
});
