'use strict';

/**
 * What a consumer actually gets.
 *
 * The published package referenced 261 CSS variables and declared no dependency that
 * supplies a single one of them. `npm install @jablonowski/dsb-components` produced a
 * component library in which every colour, every padding and every control height
 * resolved to nothing — the same picture as the Storybook that was broken for a day,
 * except in someone else's application and with no gate anywhere that would notice.
 *
 * The cause was ordinary: the token package sat in devDependencies as a `file:` link,
 * because that is what the monorepo build needs, and ng-packagr has no reason to carry a
 * dev dependency into the published manifest. Nothing was wrong with the build. The
 * manifest simply never said what the library needs to run.
 *
 * These tests read the manifest the way a consumer's package manager will.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const TOKENS = '@jablonowski/dsb-tokens';

test('the published manifest requires the token package', () => {
  const range = (pkg.peerDependencies || {})[TOKENS];
  assert.ok(
    range,
    `${TOKENS} must be a peerDependency. It cannot be a dependency: the consumer has to ` +
    'resolve one copy of the tokens, the same copy their own stylesheet imports.'
  );
});

test('the token package is not a plain dependency as well', () => {
  // Two copies of the token package means two sets of custom properties, one of which
  // the consumer's stylesheet does not import.
  assert.equal((pkg.dependencies || {})[TOKENS], undefined);
});

test('the required token range has a concrete floor', () => {
  const range = pkg.peerDependencies[TOKENS];

  // `^1.0.0` or `*` would accept 1.0.2, which predates 174 of the variables this library
  // uses — precisely the combination that renders every component with collapsed spacing.
  assert.match(
    range,
    /^\^\d+\.\d+\.\d+$/,
    `the range must name the oldest token release that actually carries every variable ` +
    `this library references, not a wildcard. Got: ${range}`
  );

  const [, minor, patch] = range.slice(1).split('.').map(Number);
  assert.ok(
    minor > 0 || patch > 0,
    `${range} has a floor of x.0.0, which accepts the first release of that major line. ` +
    'Name the release the components were verified against.'
  );
});

test('the monorepo still links the token package for the build', () => {
  // It belongs in devDependencies too: Storybook, the unit tests and the token-usage gate
  // all read the built stylesheet out of node_modules. Losing this link is how the
  // components came to be built against a published version months behind the source.
  assert.ok(
    (pkg.devDependencies || {})[TOKENS],
    `${TOKENS} must stay in devDependencies so the workspace build resolves it`
  );
});

test('a README ships, and it tells the consumer to import the stylesheet', () => {
  const readme = path.join(ROOT, 'README.md');
  assert.ok(fs.existsSync(readme), 'no README — the npm page would be blank');

  const source = fs.readFileSync(readme, 'utf8');
  // Installing both packages is not enough: nothing imports the custom properties on the
  // consumer's behalf, and a component library whose variables are undefined looks broken
  // rather than unconfigured.
  assert.match(source, new RegExp(`${TOKENS}/css`), 'the README never names the stylesheet to import');
  assert.match(source, /npm install/);
});
