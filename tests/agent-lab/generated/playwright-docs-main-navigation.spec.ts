// spec: specs/playwright-docs.plan.md
// review: specs/playwright-docs.plan-review.md
// seed: tests/agent-lab/seed.spec.ts
// Human-refactored into HomePage; original: evidence/agent-lab/raw/playwright-docs-main-navigation.initial.ts.txt
import { test, expect } from '../../../fixtures/baseTest';

test.describe('Documentation entry points — intentional comparison coverage', () => {
  test('Docs in Main navigation opens Installation — intentional comparison coverage', async ({ homePage, page }) => {
    // 1. Starting state: navigate to https://playwright.dev/ independently using the test-scoped page.
    await homePage.navigateToHome();
    await expect(page).toHaveURL('/');

    // 2. Within navigation named Main, locate the exact Docs link and verify visibility and href.
    // 3. Click the verified Docs link in Main navigation.
    await homePage.clickDocs();

    // 4. Verify the destination URL, title and exact visible Installation heading.
    await homePage.verifyDocsPage();
  });
});
