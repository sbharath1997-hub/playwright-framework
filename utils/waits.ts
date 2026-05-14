import { expect, Page, Locator } from '@playwright/test';

export class WaitHelpers {
  static async waitForURLContains(page: Page, text: string) {
    await expect(page).toHaveURL(new RegExp(text));
  }

  static async waitForElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  static async waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}
}