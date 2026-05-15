import { expect, Locator, Page } from '@playwright/test';

export class AssertionHelpers {
  static async verifyElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  static async verifyURLContains(page: Page, text: string) {
    await expect(page).toHaveURL(new RegExp(text));
  }

  static async verifyText(locator: Locator, expectedText: string) {
    await expect(locator).toContainText(expectedText, {
  timeout: 10000
});
  }
}