/**
 * Unit test configuration.
 *
 * Deliberately named `jest.config.unit.js` rather than `jest.config.js`: the Storybook
 * test-runner also runs on Jest and picks up a root-level config, so a shared filename
 * makes the a11y and interaction suites fight with this one.
 *
 * Runs in jsdom — no browser binary required, so it works the same on a laptop and on a
 * CI runner. Browser-dependent behaviour is covered by the Storybook interaction and
 * accessibility suites instead.
 */
module.exports = {
  displayName: 'unit',
  preset: 'jest-preset-angular',
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  globalSetup: 'jest-preset-angular/global-setup',
  setupFilesAfterEnv: ['<rootDir>/test/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  collectCoverageFrom: ['src/components/**/*.ts', '!src/components/**/*.stories.ts'],
};
