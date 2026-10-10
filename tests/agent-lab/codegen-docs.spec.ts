// Human-refined Codegen recording; original: evidence/agent-lab/raw/codegen-docs.initial.ts.txt
import { test, expect } from '../../fixtures/baseTest';

test('Codegen comparison: Docs opens Installation using the existing POM', async ({ homePage, page }) => {
  await homePage.navigateToHome();
  await expect(page).toHaveURL('/');
  await homePage.clickDocs();
  // Human-added outcome checks: exact destination, title and visible heading.
  await homePage.verifyDocsPage();
});
