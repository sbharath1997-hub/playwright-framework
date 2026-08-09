import { defineConfig, devices } from '@playwright/test';
import { Environment } from './config/environment';

const googlePhotosManualSpec = /.*google-photos-storage-cleanup\.spec\.ts/;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 30000,
  use: {
    baseURL: Environment.ui.playwrightBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', testIgnore: googlePhotosManualSpec, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testIgnore: googlePhotosManualSpec, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testIgnore: googlePhotosManualSpec, use: { ...devices['Desktop Safari'] } },
    {
      name: 'google-photos-chromium',
      testMatch: googlePhotosManualSpec,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: Environment.ui.googlePhotosBaseUrl,
        headless: false,
        actionTimeout: 15000,
        navigationTimeout: 30000,
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'google-photos-firefox',
      testMatch: googlePhotosManualSpec,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: Environment.ui.googlePhotosBaseUrl,
        headless: false,
        actionTimeout: 15000,
        navigationTimeout: 30000,
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
  ],
});
