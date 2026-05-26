
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';

test.describe('Hooks and shared setup', () => {
    	let home: HomePage;
	test.beforeEach(async ({ page }) => {
		home = new HomePage(page);
		await home.openHomePage();
		await home.verifyHomePageLoaded();
	});

	test('navigate to signup / login and verify login page', async ({ page }) => {
		
		await home.clickSignupLogin();
        
		const login = new LoginPage(page);
		await login.verifyLoginPage();
	});

	test('verify required-field validation on empty login submission', async ({ page }) => {
		
		await home.clickSignupLogin();
        
		const login = new LoginPage(page);
		// Attempt to submit empty credentials to trigger HTML5 required validation
		await login.loginWithCredentials('', '');
		await login.verifyRequiredFieldValidationForEmptyCredentials();
	});
});

