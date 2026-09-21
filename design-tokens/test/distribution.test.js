'use strict';

/**
 * Distribution boundary tests.
 *
 * The three-tier architecture is only an architecture if tier 1 and tier 3 are actually
 * absent from what a consumer installs. Until now that was asserted about the build
 * output — public.css contains no raw options — and never about the tarball, which also
 * carried tokens/tokens.json, the complete authoring source with all three tiers, plus
 * the whole Figma export. The supported surface said "decisions only" while the package
 * handed over everything.
 *
 * These tests assert the published artifact rather than the build directory:
 *
 *   - exactly which files are packed, so a new one has to be deliberate
 *   - the public artifacts contain no tier 1 and no tier 3
 *   - the full artifacts still do, so a broken filter cannot quietly make the pair
 *     identical and leave both tests green
 *   - every exports target is present in the tarball
 *   - exports offers no wildcard into dist, which is the only thing making a deep import
 *     fail at build time
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const PACKED = (() => {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return JSON.parse(output)[0].files.map((entry) => entry.path).sort();
})();

const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');

const TIER1 = /--ds-[a-z-]*options|\$ds-[a-z-]*options/;
const TIER3 = /--ds-component-|\$ds-component-/;

// ─── What ships ──────────────────────────────────────────────────────────────

test('the tarball contains exactly the intended files', () => {
  assert.deepEqual(PACKED, [
    'README.md',
    'dist/css/public.css',
    'dist/css/variables.css',
    'dist/js/tokens.js',
    'dist/json/decisions.json',
    'dist/json/tokens.json',
    'dist/scss/_public.scss',
    'dist/scss/_variables.scss',
    'dist/ts/tokens.d.ts',
    'dist/ts/tokens.ts',
    'package.json',
  ]);
});

test('the authoring source and the Figma export are not published', () => {
  const leaked = PACKED.filter(
    (file) => file.startsWith('tokens/') || file.includes('figma') || file.endsWith('.dtcg.json')
  );
  assert.deepEqual(
    leaked,
    [],
    'these are build inputs and a design hand-off, not runtime artifacts: ' + leaked.join(', ')
  );
});

test('a README ships with the package', () => {
  // Without one, npm shows an empty page and the boundary contract is stated nowhere a
  // consumer will look.
  assert.ok(PACKED.includes('README.md'));
  const readme = read('README.md');
  assert.match(readme, /distribution boundary/i);
  assert.match(readme, /not a sandbox/i, 'the README must not overstate what the boundary enforces');
});

// ─── The public surface ──────────────────────────────────────────────────────

test('the public CSS and SCSS expose decisions only', () => {
  for (const file of ['dist/css/public.css', 'dist/scss/_public.scss']) {
    const source = read(file);
    assert.doesNotMatch(source, TIER1, `${file} leaks tier 1`);
    assert.doesNotMatch(source, TIER3, `${file} leaks tier 3`);
    assert.match(source, /decisions/, `${file} contains no decisions at all`);
  }
});

test('the public JSON has a decisions root and nothing beside it', () => {
  const json = JSON.parse(read('dist/json/decisions.json'));
  assert.deepEqual(Object.keys(json), ['decisions']);
});

// ─── The full surface is genuinely different ─────────────────────────────────

test('the full artifacts still carry every tier', () => {
  // If a filter regression made the full and public artifacts identical, every assertion
  // above would pass while the component library silently lost tier 3.
  for (const file of ['dist/css/variables.css', 'dist/scss/_variables.scss']) {
    const source = read(file);
    assert.match(source, TIER1, `${file} lost tier 1 — the component library builds against this`);
    assert.match(source, TIER3, `${file} lost tier 3`);
  }

  const full = JSON.parse(read('dist/json/tokens.json'));
  assert.ok(Object.keys(full).length > 1, 'the full JSON collapsed to the decisions tree');
});

test('public and full are not the same file', () => {
  assert.notEqual(read('dist/css/public.css'), read('dist/css/variables.css'));
  assert.ok(
    read('dist/css/variables.css').length > read('dist/css/public.css').length,
    'the full CSS is not larger than the public one'
  );
});

// ─── The exports map is the contract ─────────────────────────────────────────

test('every exports target is present in the tarball', () => {
  const targets = [];
  const collect = (node) => {
    if (typeof node === 'string') targets.push(node);
    else if (node && typeof node === 'object') Object.values(node).forEach(collect);
  };
  collect(pkg.exports);

  const missing = targets
    .map((target) => target.replace(/^\.\//, ''))
    .filter((target) => target !== 'package.json' && !PACKED.includes(target));

  assert.deepEqual(missing, [], 'exports promises files the tarball does not contain');
});

test('exports offers no wildcard into dist', () => {
  // A single "./dist/*" entry would make every deep import resolve, and the boundary
  // would be a comment in a README.
  const keys = Object.keys(pkg.exports);
  assert.deepEqual(keys.filter((key) => key.includes('*')), []);
  assert.deepEqual(keys.filter((key) => key.startsWith('./dist')), []);
});

test('the tiered exports are the only route to tier 1', () => {
  const byTarget = new Map();
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (typeof target === 'string') byTarget.set(subpath, target);
  }

  assert.equal(byTarget.get('./css'), './dist/css/public.css');
  assert.equal(byTarget.get('./css/full'), './dist/css/variables.css');
  assert.equal(byTarget.get('./json'), './dist/json/decisions.json');
  assert.equal(byTarget.get('./json/full'), './dist/json/tokens.json');
});
