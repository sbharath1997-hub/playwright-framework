import { test, expect } from '@playwright/test';
import createUser from '../api-utils/createUser';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';

test.describe('@smoke API + UI chaining', () => {

  test('create user via API and use data in UI flow', async ({ request, page }) => {

    const createdUser = await createUser(request);

    expect(createdUser.name).toBe('Bharath');

    console.log('Created API user:', createdUser);

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.openHomePage();

    await homePage.verifyHomePageLoaded();

    await homePage.clickSignupLogin();

    await loginPage.verifyLoginPage();

    console.log(
      `Using API-created user data in UI flow: ${createdUser.name}`
    );

  });

});