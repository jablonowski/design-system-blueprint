'use strict';

/**
 * Figma export tests.
 *
 * The design file drifted from tokens.json by more than a hundred variables because
 * keeping the two in step was somebody's memory rather than a build step. These tests
 * are that build step's guard rail:
 *
 *   - the committed export is current, so a token change cannot be merged while the
 *     design hand-off silently describes the previous state
 *   - every alias resolves, so an import cannot half-apply
 *   - names follow the convention already in the file, so an import updates variables
 *     instead of creating a second set beside them
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { buildArtifacts, OUT_DIR, COLLECTIONS } = require('../scripts/generate-figma-tokens');

const { result, files } = buildArtifacts();
const tokens = result.kept;

// ─── Freshness ────────────────────────────────────────────────────────────────

test('the committed Figma export matches the token source', () => {
  const stale = [];

  for (const [name, expected] of Object.entries(files)) {
    const file = path.join(OUT_DIR, name);
    if (!fs.existsSync(file)) {
      stale.push(`${name} is missing`);
      continue;
    }
    if (fs.readFileSync(file, 'utf8') !== expected) {
      stale.push(`${name} is out of date`);
    }
  }

  assert.deepEqual(
    stale,
    [],
    `\n  ${stale.join('\n  ')}\n  Run: npm run generate:figma\n`
  );
});

// ─── Integrity ────────────────────────────────────────────────────────────────

test('every exported variable has a unique name within its collection', () => {
  const seen = new Set();
  const duplicates = [];

  for (const token of tokens) {
    const key = `${token.mapped.collection}/${token.mapped.segments.join('/')}`;
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
  }

  assert.deepEqual(duplicates, []);
});

test('every alias points at a variable that is also exported', () => {
  const exported = new Set(tokens.map((t) => t.tokenPath));
  const dangling = tokens
    .filter((t) => t.aliasOf && !exported.has(t.aliasOf))
    .map((t) => `${t.tokenPath} -> ${t.aliasOf}`);

  assert.deepEqual(dangling, []);
});

test('collections match the ones that exist in the design file', () => {
  const used = new Set(tokens.map((t) => COLLECTIONS[t.mapped.collection]));
  assert.deepEqual(
    [...used].sort(),
    ['01 / Options', '02 / Decisions', '03 / Components']
  );
});

test('every variable resolves to a type Figma can hold', () => {
  const allowed = new Set(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']);
  const bad = tokens.filter((t) => !allowed.has(t.figmaType)).map((t) => `${t.tokenPath}: ${t.figmaType}`);
  assert.deepEqual(bad, []);
});

// ─── Naming convention ────────────────────────────────────────────────────────

test('names are kebab-case with no camelCase left over', () => {
  const offenders = tokens
    .map((t) => `${t.mapped.collection}/${t.mapped.segments.join('/')}`)
    .filter((name) => /[A-Z]/.test(name));

  assert.deepEqual(offenders, []);
});

test('names match the convention already used in the design file', () => {
  // Read off the Variables panel of the live file. If the generator stops producing
  // these exact strings, an import creates a parallel set instead of updating.
  const observed = [
    'options/color/neutral/900',
    'options/color/black/a40',
    'options/color/red-a10',
    'options/font-size/14',
    'options/border-width/1-5',
    'options/z-index/1000',
    'options/duration/fast',
    'options/easing/standard',
    'decisions/color/text/primary',
    'decisions/color/surface/row-hover',
    'decisions/color/border/control-hover',
    'decisions/color/feedback/error/surface-hover',
    'decisions/color/overlay/backdrop',
    'decisions/font-size/2xs',
    'decisions/font-weight/semibold',
    'decisions/border-radius/2xl',
    'decisions/opacity/disabled',
    'decisions/z-index/modal',
    'decisions/motion/duration/slow',
    'decisions/motion/easing/standard',
  ];

  const names = new Set(tokens.map((t) => `${t.mapped.collection}/${t.mapped.segments.join('/')}`));
  const missing = observed.filter((name) => !names.has(name));

  assert.deepEqual(
    missing,
    [],
    'these names exist in the Figma file but the generator no longer produces them — ' +
    'an import would duplicate rather than update'
  );
});

test('the families added during the token audit are all exported', () => {
  const names = new Set(tokens.map((t) => `${t.mapped.collection}/${t.mapped.segments.join('/')}`));
  const required = [
    'decisions/color/action/primary/background',
    'decisions/color/action/primary/background-hover',
    'decisions/color/action/danger/text',
    'decisions/color/action/selected/background',
    'decisions/color/surface/emphasis',
    'decisions/color/border/control-active',
    'decisions/space/xl',
    'decisions/size/control/md',
    'decisions/size/glyph/lg',
    'decisions/layout-width/3xl',
    'decisions/font-line-height/tight',
  ];

  assert.deepEqual(required.filter((name) => !names.has(name)), []);
});

// ─── What cannot be exported ──────────────────────────────────────────────────

test('only shadows, em units and percentages are left behind', () => {
  // If something else starts dropping out, the export is losing tokens silently.
  const reasons = new Set(result.unsupported.values());
  for (const reason of reasons) {
    assert.match(
      reason,
      /shadows|em units|percentage|aliases .* not exportable/,
      `unexpected reason for skipping a token: ${reason}`
    );
  }
});
