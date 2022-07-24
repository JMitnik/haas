// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    REACT_APP_ENV: 'test',
  },

  videosFolder: 'outputs/videos',
  screenshotsFolder: 'outputs/screenshots',
  fixturesFolder: false,
  supportFolder: 'src/tests/e2e/support',

  userAgent:
    'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/86.0',

  e2e: {
    specPattern: 'src/tests/e2e/**/*.spec.tsx',
    supportFile: 'src/tests/e2e/support/e2e.ts',
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
