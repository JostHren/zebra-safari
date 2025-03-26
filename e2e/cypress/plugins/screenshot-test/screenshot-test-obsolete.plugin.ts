/* eslint-disable no-undef */
import { existsSync, rmSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';

import { REFERENCE_SCREENSHOT_DIR, SCREENSHOT_DIR } from './utils';

class ScreenshotTestingObsoleteScreenshotsPlugin {
  /**
   * Handles checking (removing) of obsolete screenshots for current test run
   * - Skips if run has failed.
   * - Removes screenshots if screenshot generation is enabled (removal does not work on CI)
   */
  handleCypressRun(
    results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult,
    specFileConfig: string,
    isGenerateScreenshotsEnabled: boolean,
  ): void {
    if (results.status === 'failed' || results.totalFailed > 0) return;

    const specFileFolder: string = this.extractSpecFolderPathFromEnv(specFileConfig);
    const allScreenshots: string[] = this.getAllScreenshots(specFileFolder);
    const obsoleteScreenshots: string[] = this.findObsoleteScreenshots(allScreenshots);

    if (!isGenerateScreenshotsEnabled && obsoleteScreenshots.length > 0) {
      throw new Error(
        `Screenshot plugin: obsolete screenshots detected \n[\n   ${obsoleteScreenshots.join(',\n   ')}\n]\n\n
        To fix this issue, remove obsolete files and try again. \n`,
      );
    }

    if (isGenerateScreenshotsEnabled) {
      this.removeObsoleteScreenshots(obsoleteScreenshots);
    }
  }

  /**
   * Extracts spec's folder path from env variable
   */
  private extractSpecFolderPathFromEnv(specFileConfig: string): string {
    const lastIndexOf: number = specFileConfig.lastIndexOf('/*');

    if (lastIndexOf === -1) return `${specFileConfig}.spec.ts`;

    return specFileConfig.substring(0, lastIndexOf);
  }

  /**
   * Lists all screenshots for spec folder
   */
  private getAllScreenshots(specFileFolder: string): string[] {
    const folderPath: string = join(REFERENCE_SCREENSHOT_DIR, specFileFolder);

    if (!existsSync(folderPath)) return null;

    const subFoldersOrScreenshots: string[] = readdirSync(folderPath);
    const screenshots: string[] = [];

    for (const subFoldersOrScreenshot of subFoldersOrScreenshots) {
      const fileOrDirRelativePath: string = join(specFileFolder, subFoldersOrScreenshot);
      const fileOrDirAbsolutePath: string = join(REFERENCE_SCREENSHOT_DIR, fileOrDirRelativePath);

      if (lstatSync(fileOrDirAbsolutePath).isFile()) {
        screenshots.push(fileOrDirRelativePath);
      } else {
        screenshots.push(...this.getAllScreenshots(join(specFileFolder, subFoldersOrScreenshot)));
      }
    }

    return screenshots;
  }

  /**
   * Finds obsolete screenshots from array of screenshots
   */
  private findObsoleteScreenshots(screenshotPaths: string[]): string[] | null {
    const obsoleteScreenshots: string[] = screenshotPaths.filter((screenshotPath: string) => {
      const screenshotAbsolutePath: string = join(SCREENSHOT_DIR, screenshotPath);

      return !existsSync(screenshotAbsolutePath);
    });

    return obsoleteScreenshots;
  }

  /**
   * Removes all files from screenshot array
   */
  private removeObsoleteScreenshots(screenshotPaths: string[]): void {
    for (const screenshot of screenshotPaths) {
      const screenshotAbsolutePath: string = join(REFERENCE_SCREENSHOT_DIR, screenshot);

      rmSync(screenshotAbsolutePath);
    }
  }
}

/**
 * Registers after:run task that checks for obsolete screenshots in current run
 * - Also removes screenshots in generation mode (removal does not work on CI)
 */
export function screenshotTestObsoletePlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  const isGenerateScreenshotsEnabled: boolean = config.env.SCREENSHOT_TEST_GENERATE;
  const specFile: string = config.env.SPEC_FILE;
  const plugin: ScreenshotTestingObsoleteScreenshotsPlugin = new ScreenshotTestingObsoleteScreenshotsPlugin();

  on('after:run', (results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) => {
    plugin.handleCypressRun(results, specFile, isGenerateScreenshotsEnabled);
  });
}
