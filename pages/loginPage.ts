import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  private emailInput(): Locator {
    return this.page.locator('input[data-qa="login-email"]');
  }

  private passwordInput(): Locator {
    return this.page.locator('input[data-qa="login-password"]');
  }

  private loginButton(): Locator {
    return this.page.locator('button[data-qa="login-button"]');
  }

  private loginErrorBanner(): Locator {
    return this.page.locator('form[action="/login"] p');
  }

  private loginHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Login to your account' });
  }

  async verifyLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.loginHeading()).toBeVisible();
    await expect(this.emailInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
  }

  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async verifyInvalidLoginError(expectedMessage: string): Promise<void> {
    await expect(this.loginErrorBanner()).toContainText(expectedMessage);
  }

  async verifyRequiredFieldValidationForEmptyCredentials(): Promise<void> {
    const emailValueMissing = await this.emailInput().evaluate((element) => {
      const input = element as HTMLInputElement;
      return input.validity.valueMissing;
    });

    const emailValidationMessage = await this.emailInput().evaluate((element) => {
      const input = element as HTMLInputElement;
      return input.validationMessage;
    });

    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput()).toBeFocused();
    expect(emailValueMissing).toBe(true);
    expect(emailValidationMessage.length).toBeGreaterThan(0);
    await expect(this.loginErrorBanner()).toHaveCount(0);
  }
}
