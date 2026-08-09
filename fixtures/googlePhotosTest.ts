import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import type { GooglePhotosAuthMode, GooglePhotosBrowserName } from '../models/googlePhotosStorageModels';

type GooglePhotosSession = {
  authMode: GooglePhotosAuthMode;
  browserName: GooglePhotosBrowserName;
  storageStatePath: string;
  persistentProfilePath: string;
  cdpEndpoint?: string;
  hadExistingStorageState: boolean;
  saveStorageState: () => Promise<void>;
};

type GooglePhotosFixtures = {
  googlePhotosContext: BrowserContext;
  googlePhotosPage: Page;
  googlePhotosSession: GooglePhotosSession;
};

const cdpEndpoint = process.env.GOOGLE_PHOTOS_CDP_ENDPOINT ?? 'http://127.0.0.1:9222';

export const test = base.extend<GooglePhotosFixtures>({
  googlePhotosContext: async ({ browser, playwright }, use) => {
    const authMode = readAuthMode();
    const browserName = readBrowserName();
    const storageStatePath = getStorageStatePath(browserName);
    const persistentProfilePath = getPersistentProfilePath(browserName);

    mkdirSync(path.dirname(storageStatePath), { recursive: true });
    mkdirSync(persistentProfilePath, { recursive: true });

    if (authMode === 'persistent') {
      const context =
        browserName === 'firefox'
          ? await playwright.firefox.launchPersistentContext(persistentProfilePath, {
              headless: false,
              viewport: { width: 1440, height: 1000 },
            })
          : await playwright.chromium.launchPersistentContext(persistentProfilePath, {
              channel: browserName === 'edge' ? 'msedge' : 'chrome',
              headless: false,
              viewport: { width: 1440, height: 1000 },
            });

      await use(context);
      await context.close();
      return;
    }

    if (authMode === 'cdp') {
      if (browserName === 'firefox') {
        throw new Error('GOOGLE_PHOTOS_AUTH_MODE=cdp is only supported for Chrome and Edge. Use GOOGLE_PHOTOS_AUTH_MODE=persistent for Firefox.');
      }

      const connectedBrowser = await playwright.chromium.connectOverCDP(cdpEndpoint);
      const context = connectedBrowser.contexts()[0];

      if (!context) {
        throw new Error(
          `No browser context found at ${cdpEndpoint}. Launch ${browserName} manually with --remote-debugging-port=9222 and --user-data-dir=${persistentProfilePath}.`
        );
      }

      await use(context);
      return;
    }

    const context = await browser.newContext({
      ...(existsSync(storageStatePath) ? { storageState: storageStatePath } : {}),
      viewport: { width: 1440, height: 1000 },
    });
    await use(context);
    await context.close();
  },

  googlePhotosPage: async ({ googlePhotosContext }, use) => {
    const page = await googlePhotosContext.newPage();
    await use(page);
    await page.close();
  },

  googlePhotosSession: async ({ googlePhotosContext }, use) => {
    const authMode = readAuthMode();
    const browserName = readBrowserName();
    const storageStatePath = getStorageStatePath(browserName);
    const persistentProfilePath = getPersistentProfilePath(browserName);

    await use({
      authMode,
      browserName,
      storageStatePath,
      persistentProfilePath,
      ...(authMode === 'cdp' ? { cdpEndpoint } : {}),
      hadExistingStorageState: existsSync(storageStatePath),
      saveStorageState: async () => {
        if (authMode === 'storageState') {
          await googlePhotosContext.storageState({ path: storageStatePath });
        }
      },
    });
  },
});

export { expect };

function readBrowserName(): GooglePhotosBrowserName {
  const browserName = process.env.GOOGLE_PHOTOS_BROWSER?.toLowerCase();

  if (browserName === 'edge' || browserName === 'msedge') {
    return 'edge';
  }

  if (browserName === 'firefox') {
    return 'firefox';
  }

  return 'chrome';
}

function readAuthMode(): GooglePhotosAuthMode {
  if (process.env.GOOGLE_PHOTOS_AUTH_MODE === 'persistent') {
    return 'persistent';
  }

  if (process.env.GOOGLE_PHOTOS_AUTH_MODE === 'cdp') {
    return 'cdp';
  }

  return 'storageState';
}

function getStorageStatePath(browserName: GooglePhotosBrowserName): string {
  return path.join(process.cwd(), '.auth', 'google-photos', browserName, 'storage-state.json');
}

function getPersistentProfilePath(browserName: GooglePhotosBrowserName): string {
  return path.join(process.cwd(), '.browser-profiles', 'google-photos', browserName);
}
