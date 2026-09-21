#!/usr/bin/env node
'use strict';

/**
 * Refuses to regenerate visual baselines outside CI.
 *
 * The README says baselines must come from the CI image. Documentation is not a
 * control: the script sat one npm command away, and the only thing standing between a
 * developer and a set of macOS baselines that fail every subsequent CI run was whether
 * they had read the README that week.
 *
 * So the wrong path is made hard rather than merely discouraged. The escape hatch
 * exists, but it has to be typed on purpose.
 */

const CI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const OVERRIDE = process.env.LP_UPDATE_LOCALLY === 'i-understand';

if (CI) process.exit(0);

if (OVERRIDE) {
  console.warn(
    '\n  ! Regenerating baselines locally. These will almost certainly fail in CI:\n' +
    '    font rasterisation differs between this machine and ubuntu-latest.\n' +
    '    Do not commit them.\n'
  );
  process.exit(0);
}

console.error(
  '\n  Refusing to regenerate visual baselines on this machine.\n\n' +
  '  Baselines are the specification, and they are only valid on the image that\n' +
  '  renders them. Generate them where the comparison runs:\n\n' +
  '    GitHub -> Actions -> "Generate Visual Baselines" -> Run workflow\n\n' +
  '  It renders on ubuntu-latest and opens a PR with the images for review.\n\n' +
  '  To compare against the committed baselines locally instead:\n\n' +
  '    npm run build-storybook && npm run test:visual\n\n' +
  '  If you really need local baselines (to inspect, not to commit):\n\n' +
  '    LP_UPDATE_LOCALLY=i-understand npm run test:visual:update\n'
);
process.exit(1);
