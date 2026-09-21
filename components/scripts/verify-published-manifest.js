#!/usr/bin/env node
'use strict';

/**
 * Checks the built package before it becomes permanent.
 *
 * The source manifest is asserted by test/distribution.test.js on every pull request.
 * This runs against `dist/`, because what reaches npm is not the file we wrote — it is
 * whatever ng-packagr produced from it, and the previous release lost the token
 * dependency somewhere in exactly that gap.
 *
 * It also checks the token version this build was actually compiled against, which is the
 * one question the source manifest cannot answer: a floor of ^1.0.8 means nothing if CI
 * built the library against 1.0.2.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TOKENS = '@jablonowski/dsb-tokens';

const problems = [];
const fail = (message) => problems.push(message);

// ── The manifest that ships ──────────────────────────────────────────────────

const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const declared = (source.peerDependencies || {})[TOKENS];

if (!fs.existsSync(path.join(DIST, 'package.json'))) {
  fail('dist/package.json is missing — the library was not built');
} else {
  const built = JSON.parse(fs.readFileSync(path.join(DIST, 'package.json'), 'utf8'));
  const shipped = (built.peerDependencies || {})[TOKENS];

  if (!shipped) {
    fail(
      `dist/package.json does not require ${TOKENS}. Every component in this library reads ` +
      'custom properties that only that package defines; without the requirement a consumer ' +
      'installs a library whose styles silently resolve to nothing.'
    );
  } else if (shipped !== declared) {
    fail(`dist requires ${TOKENS}@${shipped} but the source declares ${declared}`);
  }

  if (!built.exports || !built.exports['.']) {
    fail('dist/package.json has no main export');
  }
}

if (!fs.existsSync(path.join(DIST, 'README.md'))) {
  fail('dist/README.md is missing — the npm page would be blank and nothing would tell a consumer to import the stylesheet');
}

if (!fs.existsSync(path.join(DIST, 'llms.client.txt'))) {
  fail('dist/llms.client.txt is missing — the agent-facing guide is not in the package');
}

// ── The tokens this build was compiled against ───────────────────────────────

if (declared) {
  const installed = path.join(ROOT, 'node_modules', TOKENS, 'package.json');
  if (!fs.existsSync(installed)) {
    fail(`${TOKENS} is not installed — the build cannot have resolved its stylesheet`);
  } else {
    const version = JSON.parse(fs.readFileSync(installed, 'utf8')).version;
    if (!satisfiesCaret(version, declared)) {
      fail(
        `built against ${TOKENS}@${version}, which does not satisfy the declared ${declared}. ` +
        'Publish the tokens first, or lower the floor to the release the components were verified against.'
      );
    } else {
      console.log(`[verify-manifest] built against ${TOKENS}@${version}, satisfies ${declared}`);
    }
  }
}

/** Minimal caret check. Enough for ^x.y.z, which is the only shape the tests permit. */
function satisfiesCaret(version, range) {
  const match = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range);
  if (!match) return false;

  const floor = match.slice(1, 4).map(Number);
  const actual = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!actual) return false;
  const current = actual.slice(1, 4).map(Number);

  if (current[0] !== floor[0]) return false;
  for (let i = 1; i < 3; i += 1) {
    if (current[i] > floor[i]) return true;
    if (current[i] < floor[i]) return false;
  }
  return true;
}

if (problems.length > 0) {
  console.error('\n[verify-manifest] the package about to be published is not consumable:\n');
  for (const problem of problems) console.error(`  • ${problem}`);
  console.error('');
  process.exit(1);
}

console.log('[verify-manifest] PASS — the built package declares what it needs and carries its docs.');
