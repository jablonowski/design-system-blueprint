'use strict';

/**
 * Visual baseline coverage.
 *
 * Lost Pixel compares each story against a PNG on disk. It has no opinion about the
 * stories it was never given a baseline for — a story with no baseline is simply not
 * protected, and nothing says so out loud. Rename a story and the old baseline is
 * orphaned while the new story silently joins the unprotected set.
 *
 * That is the same failure the whole repository keeps running into: a gate that is
 * green because it is looking at less than it claims to. So the baseline set is
 * checked against the story set here.
 *
 * While no baselines are committed the comparison cannot run, and the CI job fails
 * on that separately (see publish-components.yml). This test asserts the story
 * derivation still works so the gate is live the moment the first baselines land.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const BASELINE_DIR = path.join(ROOT, '.lostpixel', 'baseline');

/** Mirrors Storybook's id derivation: 'Components/Button' + 'WithIcon' -> components-button--with-icon */
function slug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s/_]+/g, '-')
    .toLowerCase();
}

function storyIds() {
  const ids = [];

  for (const dir of fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const componentDir = path.join(COMPONENTS_DIR, dir.name);

    for (const entry of fs.readdirSync(componentDir)) {
      if (!entry.endsWith('.stories.ts')) continue;
      const source = fs.readFileSync(path.join(componentDir, entry), 'utf8');

      const title = source.match(/title:\s*'([^']+)'/);
      assert.ok(title, `${entry} declares no title — Storybook cannot derive an id from it`);

      for (const match of source.matchAll(/^export const (\w+)\s*:\s*Story\s*=/gm)) {
        ids.push(`${slug(title[1])}--${slug(match[1])}`);
      }
    }
  }

  return ids.sort();
}

function baselineIds() {
  if (!fs.existsSync(BASELINE_DIR)) return [];
  return fs
    .readdirSync(BASELINE_DIR)
    .filter((name) => name.endsWith('.png'))
    .map((name) => name.replace(/\.png$/, ''))
    .sort();
}

test('the story set can still be derived', () => {
  const ids = storyIds();
  assert.ok(ids.length > 20, `only ${ids.length} stories found — the parser has drifted from the source`);
  assert.deepEqual(
    ids.filter((id) => ids.indexOf(id) !== ids.lastIndexOf(id)),
    [],
    'two stories resolve to the same id'
  );
});

test('every story has a committed baseline, and every baseline has a story', () => {
  const baselines = baselineIds();

  if (baselines.length === 0) {
    // Not an assertion failure: the CI job refuses to run the comparison at all in
    // this state. Stated here so a local run does not read as coverage.
    console.log(
      '  ! no committed baselines — visual regression is not protecting anything yet.\n' +
      '    Run the "Generate Visual Baselines" workflow and merge the PR it opens.'
    );
    return;
  }

  const stories = storyIds();
  const unprotected = stories.filter((id) => !baselines.includes(id));
  const orphaned = baselines.filter((id) => !stories.includes(id));

  assert.deepEqual(
    unprotected,
    [],
    '\n  stories with no baseline (silently unprotected):\n    ' + unprotected.join('\n    ') + '\n'
  );
  assert.deepEqual(
    orphaned,
    [],
    '\n  baselines with no story (renamed or deleted, now dead weight):\n    ' + orphaned.join('\n    ') + '\n'
  );
});
