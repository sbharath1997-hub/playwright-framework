import { test } from '../fixtures/baseTest';

test.describe('Hooks and shared setup', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.openHomePage();
    await homePage.verifyHomePageLoaded();
  });

  test('navigate to signup / login and verify login page', async ({ homePage, loginPage }) => {
    await homePage.clickSignupLogin();

    await loginPage.verifyLoginPage();
  });

  test('verify required-field validation on empty login submission', async ({ homePage, loginPage }) => {
    await homePage.clickSignupLogin();

    // Attempt to submit empty credentials to trigger HTML5 required validation
    await loginPage.loginWithCredentials('', '');
    await loginPage.verifyRequiredFieldValidationForEmptyCredentials();
  });
});
