import { expect, type Locator, type Page } from '@playwright/test';
import { Environment } from '../config/environment';

type GooglePhotosPageProgressLogger = (phase: string, message: string, details?: Record<string, string | number | boolean | null | undefined>) => void;

const largePhotosAndVideosPattern = /large photos\s*(?:&|and)\s*videos/i;
const exactLargePhotosAndVideosPattern = /^Large photos\s*(?:&|and)\s*videos$/i;
const knownWrongCleanupCategoryPattern = /\/quotamanagement\/(?:blurry|screenshots|other|otherapps|unsupported)/i;

export class GooglePhotosStoragePage {
  constructor(
    private readonly page: Page,
    private readonly logProgress: GooglePhotosPageProgressLogger = () => {}
  ) {}

  private largePhotosAndVideosCategory(): Locator {
    return this.page
      .getByRole('link', { name: largePhotosAndVideosPattern })
      .or(this.page.getByRole('button', { name: largePhotosAndVideosPattern }));
  }

  async openGooglePhotos(): Promise<void> {
    this.logProgress('navigation', 'Opening Google Photos home page.');
    await this.page.goto(Environment.ui.googlePhotosBaseUrl, { waitUntil: 'domcontentloaded' });
    this.logProgress('navigation', 'Google Photos home navigation completed.', { url: this.page.url() });
  }

  async waitForManualAuthenticationIfNeeded(timeoutMs = 30 * 60 * 1000): Promise<boolean> {
    this.throwIfGoogleRejectedAuthentication();

    if (!this.isAuthenticationUrl()) {
      return false;
    }

    this.logProgress('auth', 'Manual Google login is required. Complete login in the opened browser window.', {
      timeoutMinutes: Math.round(timeoutMs / 60000),
    });
    this.logProgress('auth', 'Waiting until the browser returns to photos.google.com.');

    const startedAt = Date.now();
    let nextHeartbeatAt = startedAt + 30000;

    while (Date.now() - startedAt < timeoutMs) {
      this.throwIfGoogleRejectedAuthentication();

      if (new URL(this.page.url()).hostname === 'photos.google.com') {
        await this.page.waitForLoadState('domcontentloaded');
        this.logProgress('auth', 'Manual authentication completed.', {
          waitedSeconds: Math.round((Date.now() - startedAt) / 1000),
        });
        return true;
      }

      if (Date.now() >= nextHeartbeatAt) {
        this.logProgress('auth', 'Still waiting for manual authentication to complete.', {
          waitedSeconds: Math.round((Date.now() - startedAt) / 1000),
          currentHost: new URL(this.page.url()).hostname,
        });
        nextHeartbeatAt += 30000;
      }

      await this.page.waitForTimeout(1000);
    }

    throw new Error(`Timed out after ${Math.round(timeoutMs / 60000)} minutes waiting for manual Google authentication.`);
  }

  async openStorageManagement(): Promise<void> {
    this.logProgress('navigation', 'Opening Google Photos storage management.');
    await this.page.goto(Environment.ui.googlePhotosStorageManagementUrl, { waitUntil: 'domcontentloaded' });
    this.logProgress('navigation', 'Storage management navigation completed.', { url: this.page.url() });
  }

  async validateStorageManagementReady(): Promise<void> {
    this.logProgress('validation', 'Validating Google Photos storage management host.');
    await expect(this.page).toHaveURL((url) => url.hostname === 'photos.google.com');
  }

  async openLargePhotosAndVideos(): Promise<void> {
    this.logProgress('navigation', 'Opening Large photos and videos category.');
    await this.openLargePhotosAndVideosDirectly();
    return;
  }

  private async openLargePhotosAndVideosDirectly(): Promise<void> {
    this.logProgress('navigation', 'Navigating directly to Large photos and videos page.', {
      url: Environment.ui.googlePhotosLargePhotosVideosUrl,
    });

    await this.page.goto(Environment.ui.googlePhotosLargePhotosVideosUrl, { waitUntil: 'domcontentloaded' });
    await this.assertLargePhotosAndVideosRoute();
    this.logProgress('navigation', 'Large photos and videos category opened.', {
      strategy: 'direct url',
      url: this.page.url(),
    });
  }

  async openLargePhotosAndVideosFromStorageOverview(): Promise<void> {
    this.logProgress('navigation', 'Opening Large photos and videos category from storage overview.');
    const originalUrl = this.page.url();
    const categoryLocators = [
      { name: 'exact visible category text', locator: this.page.getByText(exactLargePhotosAndVideosPattern).first() },
      { name: 'role link/button', locator: this.largePhotosAndVideosCategory().first() },
      {
        name: 'exact interactive row',
        locator: this.page
          .locator('a, button, [role="button"], [role="link"], [tabindex="0"]')
          .filter({ hasText: exactLargePhotosAndVideosPattern })
          .first(),
      },
    ];

    let lastError: unknown;

    for (const candidate of categoryLocators) {
      try {
        this.logProgress('navigation', 'Trying Large photos and videos opener.', { strategy: candidate.name });
        await candidate.locator.click({ timeout: 8000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForCategoryPageAfterClick(originalUrl);
        await this.assertLargePhotosAndVideosRoute();
        this.logProgress('navigation', 'Large photos and videos category opened.', {
          strategy: candidate.name,
          url: this.page.url(),
        });
        return;
      } catch (error) {
        lastError = error;
        this.logProgress('navigation', 'Large photos and videos opener did not complete.', {
          strategy: candidate.name,
          reason: error instanceof Error ? error.message.split('\n')[0] : String(error),
        });
      }
    }

    throw new Error(
      `Unable to open Large photos and videos from storage management. Last error: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`
    );
  }

  private async waitForCategoryPageAfterClick(originalUrl: string): Promise<void> {
    await this.page.waitForFunction(
      ({ startingUrl, labelPattern, wrongCategoryPattern }) => {
        const bodyText = document.body.innerText;
        const urlChanged = window.location.href !== startingUrl;
        const wrongCategory = new RegExp(wrongCategoryPattern, 'i').test(window.location.href);
        const hasCategoryHeading = new RegExp(labelPattern, 'i').test(bodyText);
        const stillOnStorageOverview = /Manage storage/i.test(bodyText) && /Review and delete/i.test(bodyText);

        return !wrongCategory && (urlChanged || (hasCategoryHeading && !stillOnStorageOverview));
      },
      {
        startingUrl: originalUrl,
        labelPattern: 'large photos\\s*(?:&|and)\\s*videos',
        wrongCategoryPattern: '\\/quotamanagement\\/(?:blurry|screenshots|other|otherapps|unsupported)',
      },
      { timeout: 15000 }
    );
  }

  async validateLargePhotosAndVideosReady(): Promise<void> {
    this.logProgress('validation', 'Validating Large photos and videos page readiness.');
    await this.assertLargePhotosAndVideosRoute();
    await expect(
      this.page.getByText(largePhotosAndVideosPattern).first()
    ).toBeVisible({ timeout: 30000 });
    this.logProgress('validation', 'Large photos and videos page is ready.');
  }

  private async assertLargePhotosAndVideosRoute(): Promise<void> {
    const currentUrl = this.page.url();

    if (knownWrongCleanupCategoryPattern.test(currentUrl)) {
      throw new Error(`Refusing to scan wrong Google Photos cleanup category: ${currentUrl}`);
    }

    await expect(this.page).toHaveURL((url) => url.hostname === 'photos.google.com' && /\/quotamanagement\/large/.test(url.pathname));
  }

  private isAuthenticationUrl(): boolean {
    return /accounts\.google\.com|signin|ServiceLogin/i.test(this.page.url());
  }

  private throwIfGoogleRejectedAuthentication(): void {
    if (/accounts\.google\.com\/.*\/rejected/i.test(this.page.url())) {
      throw new Error(
        [
          'Google rejected sign-in for this automated browser surface.',
          'For Chrome or Edge, launch the browser manually with a dedicated profile and use GOOGLE_PHOTOS_AUTH_MODE=cdp.',
          'For Firefox, use GOOGLE_PHOTOS_BROWSER=firefox with GOOGLE_PHOTOS_AUTH_MODE=persistent.',
          'All supported modes use only .browser-profiles/google-photos/<browser> and never your normal browser profile.',
        ].join(' ')
      );
    }
  }
}
