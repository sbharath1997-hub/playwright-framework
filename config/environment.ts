export type TestEnvironmentName = 'demo';

export type EnvironmentConfig = {
  name: TestEnvironmentName;
  ui: {
    playwrightBaseUrl: string;
    automationExerciseBaseUrl: string;
    exampleBaseUrl: string;
    googlePhotosBaseUrl: string;
    googlePhotosStorageManagementUrl: string;
    googlePhotosLargePhotosVideosUrl: string;
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
    googlePhotosBaseUrl: 'https://photos.google.com/',
    googlePhotosStorageManagementUrl: 'https://photos.google.com/quotamanagement',
    googlePhotosLargePhotosVideosUrl: 'https://photos.google.com/quotamanagement/large',
  },
  api: {
    jsonPlaceholderBaseUrl: 'https://jsonplaceholder.typicode.com',
  },
} as const satisfies EnvironmentConfig;
