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

test('the public CSS and SCSS carry no raw palette', () => {
  // Tier 1 is the only layer holding literal values, and the only one an application has
  // no business reaching. Tier 3 holds no values at all — it is 215 pointers into tier 2,
  // and the compiled component CSS reads every one of them while defining none.
  for (const file of ['dist/css/public.css', 'dist/scss/_public.scss']) {
    const source = read(file);
    assert.doesNotMatch(source, TIER1, `${file} leaks the raw palette`);
    assert.match(source, /decisions/, `${file} contains no decisions at all`);
    assert.match(source, TIER3, `${file} omits the component layer the library needs to render`);
  }
});

test('component tokens in the public surface stay references, never literals', () => {
  const flattened = [...read('dist/css/public.css').matchAll(/^\s*(--ds-component-[\w-]+):\s*([^;]+);/gm)]
    .filter((m) => !m[2].trim().startsWith('var('))
    .map((m) => m[1]);

  assert.deepEqual(
    flattened,
    [],
    'a flattened component token ignores whatever decision the consumer overrides, ' +
    'which removes the only reason the layer exists'
  );
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
  // They now differ by exactly one layer: the raw palette.
  assert.notEqual(read('dist/css/public.css'), read('dist/css/variables.css'));
  assert.ok(
    read('dist/css/variables.css').length > read('dist/css/public.css').length,
    'the full CSS is not larger than the public one'
  );
});

test('the public stylesheet can actually run the component library', () => {
  // The assertion this file was missing. Every earlier test here described dist/, and
  // every one of them passed while the published public artifact left 215 of the 261
  // variables the components read undefined — a component library that renders with no
  // spacing, no control heights and no colour, shipped by the boundary meant to protect it.
  const declared = new Set(
    [...read('dist/css/public.css').matchAll(/^\s*(--ds-[\w-]+):/gm)].map((m) => m[1])
  );

  const src = path.resolve(ROOT, '..', 'components', 'src');
  const used = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(css|html)$/.test(entry.name)) {
        for (const m of fs.readFileSync(full, 'utf8').matchAll(/var\(\s*(--ds-[\w-]+)/g)) used.add(m[1]);
      }
    }
  };
  walk(src);

  const missing = [...used].filter((name) => !declared.has(name)).sort();
  assert.deepEqual(
    missing,
    [],
    `\n  ${missing.length} of ${used.size} variables are undefined in the public stylesheet:\n    ` +
    missing.slice(0, 10).join('\n    ') + '\n'
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
