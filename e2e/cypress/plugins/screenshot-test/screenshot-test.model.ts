export interface ScreenshotTestPluginOptions {
  screenshotName: string;
  specDirectory: string;
  config: ScreenshotTestConfig;
}

export enum ScreenshotTestErrorType {
  ReferenceImageNotFound = 'reference-image-not-found',
  ImageDifference = 'image-difference',
  ImageRegenerated = 'image-regenerated',
}

export interface ScreenshotTestError {
  error: ScreenshotTestErrorType;
}

export interface ScreenshotTestDifference extends ScreenshotTestError {
  error: ScreenshotTestErrorType.ImageDifference;
  difference: number;
  pixels: number;
}

export interface ScreenshotTestConfig {
  threshold: number;
  generate: boolean;
}
