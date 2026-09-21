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
 *    `npm run test:visual:update` (which runs `lost-pixel update`) refuses to run
 *    outside CI for this reason.
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

  // Despite the name, this is not "generate instead of compare" — it is the flag that
  // marks the OSS mode, as opposed to the hosted platform. It has to be constant,
  // because failOnDifference below is only honoured while it is set: with it false,
  // lost-pixel logs every difference it found and then exits 0. It was previously bound
  // to an environment variable the comparison run does not set, so the visual gate
  // reported differences and passed anyway.
  //
  // Updating baselines is a separate CLI mode: `lost-pixel update`.
  generateOnly: true,

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
