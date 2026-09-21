import type { CustomProjectConfig } from 'lost-pixel';

/**
 * Lost Pixel — visual regression configuration
 *
 * A baseline is not a screenshot. It is the specification: every pixel in it has been
 * accepted as correct, and every future run is judged against it. Two things follow.
 *
 * 1. Baselines are generated in CI, never on a laptop.
 *    Font rasterisation on macOS and on ubuntu-latest differ by far more than any
 *    sane threshold. A baseline taken locally fails in CI for reasons unrelated to the
 *    change under review — which is how a visual gate ends up permanently red and then
 *    permanently ignored. Run the "Generate Visual Baselines" workflow; it renders on
 *    the same image the comparison job uses and opens a PR for review.
 *    `npm run test:visual:update` refuses to run outside CI for this reason.
 *
 * 2. Baselines are generated from the branch you intend to ship, after it is correct.
 *    Baselines taken while something is broken make the breakage the specification,
 *    and the gate then defends it.
 *
 * Comparison (CI, and locally against committed baselines):
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

  // baseline/ is committed — it is the specification. current/ and difference/ are run
  // output and are ignored (see .lostpixel/.gitignore).
  imagePathBaseline: '.lostpixel/baseline',
  imagePathCurrent: '.lostpixel/current',
  imagePathDifference: '.lostpixel/difference',
};
