import { checkA11y, injectAxe } from 'axe-playwright';
import { getStoryContext } from '@storybook/test-runner';
import type { TestRunnerConfig } from '@storybook/test-runner';

/**
 * Set TEST_A11Y=false to skip axe checks and only run play functions.
 * This lets the CI split accessibility and interaction testing into separate jobs
 * while reusing the same test-runner infrastructure.
 *
 *   test:a11y         → TEST_A11Y unset  (default = enabled)
 *   test:interactions → TEST_A11Y=false  (play functions only, no axe)
 */
const A11Y_ENABLED = process.env['TEST_A11Y'] !== 'false';

const config: TestRunnerConfig = {
  async preVisit(page) {
    if (A11Y_ENABLED) {
      await injectAxe(page);
    }
  },

  async postVisit(page, context) {
    if (!A11Y_ENABLED) return;

    // Respect per-story opt-out:  parameters: { a11y: { disable: true } }
    const storyContext = await getStoryContext(page, context);
    if (storyContext.parameters?.['a11y']?.disable) return;

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
