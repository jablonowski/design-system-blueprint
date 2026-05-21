import type { CustomProjectConfig } from 'lost-pixel';

/**
 * Lost Pixel — visual regression configuration
 *
 * Workflow:
 *   Generate/update baselines (run locally after intentional design changes):
 *     npm run test:visual:update
 *   Commit the .lostpixel/baseline/ directory to the repo.
 *
 *   CI comparison (run on every PR that touches components):
 *     npm run test:visual
 *   Fails if any story screenshot differs from the committed baseline
 *   by more than the configured threshold.
 *
 * The storybook-static/ folder must be built before running lost-pixel:
 *     npm run build-storybook && npm run test:visual
 */
export const config: CustomProjectConfig = {
  storybookShots: {
    // Path to the built Storybook static folder.
    // Lost Pixel serves this folder internally — no separate server needed.
    storybookUrl: 'storybook-static',
  },

  // Regenerate baselines instead of comparing when LP_UPDATE=true
  generateOnly: process.env['LP_UPDATE'] === 'true',

  // Fail the pipeline if any visual difference is detected
  failOnDifference: true,

  // Pixel difference tolerance — 0.5% allows for minor anti-aliasing variance
  threshold: 0.005,

  // Where baseline, current and diff images are stored (committed to git)
  imagePathBaseline: '.lostpixel/baseline',
  imagePathCurrent: '.lostpixel/current',
  imagePathDifference: '.lostpixel/difference',
};
