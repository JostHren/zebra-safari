import { join } from 'path';

import { ScreenshotTestConfig } from './screenshot-test.model';

export const REFERENCE_SCREENSHOT_DIR: string = join(__dirname, '..', '..', '..', 'cypress', 'reference-screenshots');
export const SCREENSHOT_DIR: string = join(__dirname, '..', '..', '..', 'cypress', 'screenshots');
export const SCREENSHOT_DIFF_DIR: string = join(__dirname, '..', '..', '..', 'cypress', 'screenshots', 'diffs');

export function getConfig(): ScreenshotTestConfig {
  const threshold: number = Number(Cypress.env('SCREENSHOT_TEST_THRESHOLD') || 0.12);
  const generate: boolean = Boolean(Cypress.env('SCREENSHOT_TEST_GENERATE'));

  return {
    threshold,
    generate,
  };
}
