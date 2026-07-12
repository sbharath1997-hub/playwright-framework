export type TestEnvironmentName = 'demo';

export type EnvironmentConfig = {
  name: TestEnvironmentName;
  ui: {
    playwrightBaseUrl: string;
    automationExerciseBaseUrl: string;
    exampleBaseUrl: string;
  };
  api: {
    jsonPlaceholderBaseUrl: string;
  };
};

export const Environment = {
  name: 'demo',
  ui: {
    playwrightBaseUrl: 'https://playwright.dev',
    automationExerciseBaseUrl: 'https://automationexercise.com/',
    exampleBaseUrl: 'https://example.com',
  },
  api: {
    jsonPlaceholderBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
} as const satisfies EnvironmentConfig;
