import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  private loginHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Login to your account' });
  }

  async verifyLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.loginHeading()).toBeVisible();
  }
}
