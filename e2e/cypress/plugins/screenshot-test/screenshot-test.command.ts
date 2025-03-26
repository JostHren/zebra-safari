import {
  ScreenshotTestDifference,
  ScreenshotTestPluginOptions,
  ScreenshotTestConfig,
  ScreenshotTestError,
  ScreenshotTestErrorType,
} from './screenshot-test.model';
import { getConfig } from './utils';

/// <reference types="cypress" />
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command that performs visual regression test
       */
      matchScreenshot(name?: string): void;
    }
  }
}

export function getSpecFolder(): string {
  const folder: string = Cypress.spec.relative.replace('cypress/integration/', '');

  return folder;
}

export function getTestName(): string {
  const testTitles: string[] = Cypress.currentTest.titlePath;

  const fileName: string = testTitles.join(' -- ');

  return fileName;
}

function handleReferenceImageNotFound(screenshotName: string): void {
  expect(null).to.equal(screenshotName, `Reference image [${screenshotName}] is missing`);
}

function handleImageRegenerated(screenshotName: string): void {
  expect(null).to.equal(screenshotName, `Reference image [${screenshotName}] was regenerated`);
  cy.task('log', `Screenshot [${screenshotName}] was regenerated, retrying test to verify new screenshot`);
}

function handleImageDifference(screenshotName: string, error: ScreenshotTestError): void {
  const difference: ScreenshotTestDifference = error as ScreenshotTestDifference;
  let differenceValue: number = 0;
  let differencePercentage: string = '0';

  if (difference) {
    differenceValue = difference.difference;
    differencePercentage = Number((difference.difference / difference.pixels) * 100).toFixed(2);
  }

  expect(differenceValue).to.equal(0, `[${screenshotName}], difference is ${differencePercentage}% in pixels`);
}

function matchScreenshot(name?: string, firstScreenshotTime?: number): void {
  const config: ScreenshotTestConfig = getConfig();
  const screenshotName: string = name ? `${getTestName()} [${name}]` : getTestName();
  const specDirectory: string = getSpecFolder();
  const options: ScreenshotTestPluginOptions = {
    screenshotName,
    specDirectory,
    config,
  };

  cy.task('screenshotTestPluginCleanup', options);

  cy.screenshot(`${specDirectory}/${screenshotName}`, { overwrite: true, capture: 'viewport' });

  cy.task('screenshotTestPlugin', options).then((error: ScreenshotTestError | null) => {
    const isTimeUp: boolean = Date.now() - firstScreenshotTime >= 5000;

    if (error?.error === ScreenshotTestErrorType.ImageRegenerated) {
      handleImageRegenerated(screenshotName);

      return;
    }

    if (error?.error && !isTimeUp) {
      matchScreenshot(name, firstScreenshotTime);

      return;
    }

    switch (error?.error) {
      case ScreenshotTestErrorType.ReferenceImageNotFound:
        handleReferenceImageNotFound(screenshotName);
        break;

      case ScreenshotTestErrorType.ImageDifference:
        handleImageDifference(screenshotName, error);
        break;

      default:
        break;
    }
  });
}

Cypress.Commands.add('matchScreenshot', (name?: string) => {
  const firstScreenshotTime: number = Date.now();

  matchScreenshot(name, firstScreenshotTime);
});
