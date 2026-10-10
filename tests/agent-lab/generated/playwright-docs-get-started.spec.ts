// spec: specs/playwright-docs.plan.md
// review: specs/playwright-docs.plan-review.md
// seed: tests/agent-lab/seed.spec.ts
// Human-refactored into HomePage; original: evidence/agent-lab/raw/playwright-docs-get-started.initial.ts.txt
import { test, expect } from '../../../fixtures/baseTest';

test.describe('Documentation entry points — intentional comparison coverage', () => {
  test('Home Get started opens Installation — intentional comparison coverage', async ({ homePage, page }) => {
    // 1. Starting state: independently navigate directly to https://playwright.dev/ using the test-scoped page.
    await homePage.navigateToHome();
    await expect(page).toHaveURL('/');

    // 2. Locate the home hero link with exact accessible name Get started and verify visibility and href.
    // 3. Click the verified home Get started link.
    await homePage.clickGetStarted();

    // 4. Verify the destination URL, title and exact visible Installation heading.
    await homePage.verifyDocsPage();
  });
});
