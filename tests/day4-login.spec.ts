import { test } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';

test.describe('Day 4 — Automation Exercise login navigation', () => {
  test('home page loads and Signup / Login opens login page', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.openHomePage();
    await homePage.verifyHomePageLoaded();
    await homePage.clickSignupLogin();
    await loginPage.verifyLoginPage();
  });
});
