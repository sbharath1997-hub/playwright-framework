import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { invalidLoginDatasets } from '../test-data/loginData';

test.describe('Day 5 — data-driven login validation', () => {
  for (const dataset of invalidLoginDatasets) {
    test(`shows login error for ${dataset.name}`, async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);

      await homePage.openHomePage();
      await homePage.verifyHomePageLoaded();
      await homePage.clickSignupLogin();
      await loginPage.verifyLoginPage();

      await loginPage.loginWithCredentials(dataset.email, dataset.password);

      if (dataset.expectedOutcome === 'empty_required_fields') {
  console.log('Validating required field behavior');

  await loginPage.verifyRequiredFieldValidationForEmptyCredentials();

} else {
  console.log(`Validating invalid login error for: ${dataset.email}`);

  await loginPage.verifyInvalidLoginError(
    dataset.expectedErrorMessage!
  );
}
    });
  }
});

