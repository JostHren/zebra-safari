export const browserScreenSize = (on: Cypress.PluginEvents): void => {
  on('before:browser:launch', (browser: Cypress.Browser, launchOptions: Cypress.BeforeBrowserLaunchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--window-size=1400,1200');
      launchOptions.args.push('--force-device-scale-factor=1');
    }

    if (browser.name === 'electron') {
      launchOptions.preferences.width = 1440;
      launchOptions.preferences.height = 1200;
    }

    if (browser.name === 'firefox') {
      launchOptions.args.push('--width=1440');
      launchOptions.args.push('--height=1200');
    }

    return launchOptions;
  });
};
