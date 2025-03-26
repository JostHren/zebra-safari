export function retryLogsPlugin(on: Cypress.PluginEvents): void {
  on('task', {
    log: (param: unknown | unknown[]) => {
      // eslint-disable-next-line no-console
      console.log(...(Array.isArray(param) ? param : [param]));

      return null;
    },
  });
}

export function retryLogsConfig(): void {
  const config: Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions = Cypress.config();

  if (config.isInteractive || config.reporter === 'spec') return;

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    const test: Record<string, unknown> = (cy as any).state('runnable')?.ctx?.currentTest;

    // eslint-disable-next-line no-underscore-dangle
    if (test?.state === 'failed' && test?._currentRetry < test?._retries) {
      cy.task(
        'log',
        // eslint-disable-next-line no-underscore-dangle
        `    ❌ (Attempt ${(test._currentRetry as number) + 1} of ${(test._retries as number) + 1}) ${
          test.title as string
        }`,
        { log: false },
      );
    }
  });
}
