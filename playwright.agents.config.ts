import { defineConfig } from '@playwright/test';
import frameworkConfig from './playwright.config';

// Reuse the framework's settings, but keep the learning exercise on Chromium.
export default defineConfig({
  ...frameworkConfig,
  testDir: './tests/agent-lab',
  projects: frameworkConfig.projects?.filter((project) => project.name === 'chromium'),
  workers: 1,
  retries: 0,
  outputDir: './test-results/agent-lab',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report/agent-lab' }],
    ['json', { outputFile: 'test-results/agent-lab/results.json' }],
  ],
  use: {
    ...frameworkConfig.use,
    trace: 'retain-on-failure',
  },
});
