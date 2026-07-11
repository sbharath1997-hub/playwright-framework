import { test, expect } from '../fixtures/baseTest';
import createUser from '../api-utils/createUser';

test.describe('@regression API + UI chaining', () => {

  test('create user via API and use data in UI flow', async ({ request, homePage, loginPage }) => {

    const createdUser = await createUser(request);

    expect(createdUser.name).toBe('Bharath');

    console.log('Created API user:', createdUser);

    await homePage.openHomePage();

    await homePage.verifyHomePageLoaded();

    await homePage.clickSignupLogin();

    await loginPage.verifyLoginPage();

    console.log(
      `Using API-created user data in UI flow: ${createdUser.name}`
    );

  });

});
