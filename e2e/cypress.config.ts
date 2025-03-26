import { defineConfig } from 'cypress';
import failFast from 'cypress-fail-fast/plugin';
import terminalReportLogsPrinter, { PluginOptions } from 'cypress-terminal-report/src/installLogsPrinter';

import { browserScreenSize } from './cypress/plugins/browser-screen-size/browser-screen-size.plugin';
import { screenshotTestPlugin } from './cypress/plugins/screenshot-test/screenshot-test.plugin';
import { retryLogsPlugin } from './cypress/plugins/retry-logs/retry-logs';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/integration/**/*.spec.ts',
    chromeWebSecurity: false,
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1200,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      SCREENSHOT_TEST_GENERATE: false,
      SCREENSHOT_TEST_THRESHOLD: 0,
    },

    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      failFast(on, config);
      browserScreenSize(on);
      screenshotTestPlugin(on);
      retryLogsPlugin(on);
      terminalReportLogsPrinter(on, { logToFilesOnAfterRun: true } as unknown as PluginOptions);
    },
  },
});
