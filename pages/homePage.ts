import { expect, type Locator, type Page } from '@playwright/test';
import { Environment } from '../config/environment';

/** Home page actions for supported training sites. */
export class HomePage {
  constructor(private readonly page: Page) {}

  private mainNav(): Locator {
    return this.page.getByRole('navigation', { name: 'Main', exact: true });
  }

  private docsNavLink(): Locator {
    return this.mainNav().getByRole('link', { name: 'Docs', exact: true });
  }

  private installationHeading(): Locator {
    return this.page.getByRole('main').getByRole('heading', { name: 'Installation', exact: true });
  }

  private getStartedLink(): Locator {
    return this.page.getByRole('banner').getByRole('link', { name: 'Get started', exact: true });
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
    const docsLink = this.docsNavLink();
    await expect(this.mainNav()).toBeVisible();
    await expect(docsLink).toBeVisible();
    await expect(docsLink).toHaveAttribute('href', '/docs/intro');
    await docsLink.click();
  }

  async clickGetStarted(): Promise<void> {
    const getStartedLink = this.getStartedLink();
    await expect(getStartedLink).toBeVisible();
    await expect(getStartedLink).toHaveAttribute('href', '/docs/intro');
    await getStartedLink.click();
  }

  async verifyDocsPage(): Promise<void> {
    await expect(this.page).toHaveURL(new URL('/docs/intro', Environment.ui.playwrightBaseUrl).href);
    await expect(this.page).toHaveTitle('Installation | Playwright');
    await expect(this.installationHeading()).toBeVisible();
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
