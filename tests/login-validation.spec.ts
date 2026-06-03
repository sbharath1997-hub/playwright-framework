import { test, expect } from '../fixtures/baseTest';

test.describe('@smoke @regression Day 4 — Automation Exercise login navigation', () => {
  test('home page loads and Signup / Login opens login page', async ({ homePage, loginPage }) => {

    await homePage.openHomePage();
    await homePage.verifyHomePageLoaded();
    await homePage.clickSignupLogin();
    await loginPage.verifyLoginPage();
  });
});
