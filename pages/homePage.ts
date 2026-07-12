import { expect, type Locator, type Page } from '@playwright/test';
import { Environment } from '../config/environment';

/** Home page actions for supported training sites. */
export class HomePage {
  

  constructor(private readonly page: Page) {}

  private mainNav(): Locator {
    return this.page.getByRole('navigation', { name: 'Main' });
  }

  private docsNavLink(): Locator {
    return this.mainNav().getByRole('link', { name: 'Docs', exact: true });
  }

  private mainContent(): Locator {
    return this.page.getByRole('main');
  }

  private signupLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Signup / Login' });
  }

  private automationExerciseHeader(): Locator {
    return this.page.locator('header');
  }

  // playwright.dev
  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
  }

  async clickDocs(): Promise<void> {
    await this.docsNavLink().click();
  }

  async verifyDocsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/docs/);
    await expect(this.mainContent()).toContainText('Installation');
  }

  // automationexercise.com
  async openHomePage(): Promise<void> {
    await this.page.goto(Environment.ui.automationExerciseBaseUrl);
  }

  async verifyHomePageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Exercise/);
    await expect(this.automationExerciseHeader()).toBeVisible();
    await expect(this.signupLoginLink()).toBeVisible();
  }

  async clickSignupLogin(): Promise<void> {
    await this.signupLoginLink().click();
  }
}
