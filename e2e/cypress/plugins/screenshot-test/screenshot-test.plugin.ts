import { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, renameSync } from 'fs';
import { join } from 'path';

import pixelmatch from 'pixelmatch';
import { PNG, PNGWithMetadata } from 'pngjs';

import { REFERENCE_SCREENSHOT_DIR, SCREENSHOT_DIFF_DIR, SCREENSHOT_DIR } from './utils';
import {
  ScreenshotTestPluginOptions,
  ScreenshotTestDifference,
  ScreenshotTestError,
  ScreenshotTestErrorType,
} from './screenshot-test.model';

class ScreenshotTestingPlugin {
  /**
   * Cleans up current screenshots before running test, ensures previous test will not affect screenshot testing.
   */
  removeScreenshots(options: ScreenshotTestPluginOptions): null {
    const screenshotPath: string = join(SCREENSHOT_DIR, options.specDirectory);

    if (!existsSync(screenshotPath)) return null;

    for (const image of readdirSync(screenshotPath)) {
      if (image.startsWith(options.screenshotName)) {
        rmSync(join(screenshotPath, image));
      }
    }

    return null;
  }

  /**
   * Since Cypress v10, screenshot path may be different depending on the way of running tests (watch mode, run mode)
   * to ensure it always works, we need to move files from cypress location to our expected location.
   *
   * This function is called by `after:screenshot` event
   */
  moveFiles(oldFilePath: string, fullScreenshotName: string): void {
    if (!fullScreenshotName) return;

    const specDirectory: string = fullScreenshotName.split('/').slice(0, -1).join('/');
    const screenshotName: string = fullScreenshotName.split('/').splice(-1)[0];
    const specDirAbsolute: string = join(SCREENSHOT_DIR, specDirectory);
    const screenshotPath: string = join(specDirAbsolute, `${screenshotName}.png`);

    if (oldFilePath === screenshotPath) return;

    if (!existsSync(specDirAbsolute)) mkdirSync(specDirAbsolute, { recursive: true });
    renameSync(oldFilePath, screenshotPath);
  }

  /**
   * Performs a screenshot test, checks screenshot against reference image.
   *
   * Generates reference image if missing, generates diff image if difference exists
   *
   * @returns null if no diff, diff details otherwise
   */
  screenshotTest(options: ScreenshotTestPluginOptions): ScreenshotTestError | null {
    const referencePath: string = join(
      REFERENCE_SCREENSHOT_DIR,
      options.specDirectory,
      `${options.screenshotName}.png`,
    );
    const screenshotPath: string = this.findImageFullPath(options);

    if (!existsSync(referencePath)) {
      if (!options.config.generate) return { error: ScreenshotTestErrorType.ReferenceImageNotFound };

      this.saveReferenceImage(options.specDirectory, screenshotPath, referencePath, options.config.generate);

      return null;
    }

    return this.performDifferenceMatching(options, referencePath, screenshotPath);
  }

  /**
   * Saves current screenshot image to reference directory.
   */
  private saveReferenceImage(
    specDirectory: string,
    screenshotPath: string,
    referencePath: string,
    generate: boolean,
  ): void {
    if (!generate) return;

    const referenceDirPath: string = join(REFERENCE_SCREENSHOT_DIR, specDirectory);

    if (!existsSync(referenceDirPath)) mkdirSync(referenceDirPath, { recursive: true });
    copyFileSync(screenshotPath, referencePath);
  }

  /**
   * Saves calculated diff image to diff directory.
   */
  private saveDiffImage(specDirectory: string, diffPath: string, diffImage: PNG): void {
    const diffDirectoryPath: string = join(SCREENSHOT_DIFF_DIR, specDirectory);

    if (!existsSync(diffDirectoryPath)) mkdirSync(diffDirectoryPath, { recursive: true });

    writeFileSync(diffPath, PNG.sync.write(diffImage));
  }

  private performDifferenceMatching(
    options: ScreenshotTestPluginOptions,
    referencePath: string,
    screenshotPath: string,
  ): ScreenshotTestDifference | ScreenshotTestError | null {
    const diffPath: string = join(SCREENSHOT_DIFF_DIR, options.specDirectory, `${options.screenshotName}.png`);

    const referenceImage: PNGWithMetadata = PNG.sync.read(readFileSync(referencePath));
    const newImage: PNGWithMetadata = PNG.sync.read(readFileSync(screenshotPath));
    const diffImage: PNG = new PNG({ width: referenceImage.width, height: referenceImage.height });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const diff: number = pixelmatch(
      referenceImage.data,
      newImage.data,
      diffImage.data,
      referenceImage.width,
      referenceImage.height,
      { threshold: options.config.threshold },
    );

    if (options.config.generate && diff > 0) {
      this.saveReferenceImage(options.specDirectory, screenshotPath, referencePath, options.config.generate);

      return {
        error: ScreenshotTestErrorType.ImageRegenerated,
      };
    }

    if (diff > 0) {
      this.saveDiffImage(options.specDirectory, diffPath, diffImage);

      return {
        error: ScreenshotTestErrorType.ImageDifference,
        difference: diff,
        pixels: referenceImage.width * referenceImage.height,
      };
    }

    return null;
  }

  /**
   * During retries image name can be generated differently, full path is generated from getting first matching image for the test.
   * There should only be one, since we do cleanup before this.
   */
  private findImageFullPath(options: ScreenshotTestPluginOptions): string {
    const screenshotPath: string = join(SCREENSHOT_DIR, options.specDirectory);

    for (const image of readdirSync(screenshotPath)) {
      if (image.startsWith(options.screenshotName)) return join(screenshotPath, image);
    }
  }
}

export function screenshotTestPlugin(on: Cypress.PluginEvents): void {
  const plugin: ScreenshotTestingPlugin = new ScreenshotTestingPlugin();

  on('task', { screenshotTestPlugin: plugin.screenshotTest.bind(plugin) });
  on('task', { screenshotTestPluginCleanup: plugin.removeScreenshots.bind(plugin) });
  on('after:screenshot', (details: Cypress.ScreenshotDetails) => {
    plugin.moveFiles(details.path, details.name);
  });
  on('task', { screenshotTestPluginMoveFiles: plugin.moveFiles.bind(plugin) });
}
