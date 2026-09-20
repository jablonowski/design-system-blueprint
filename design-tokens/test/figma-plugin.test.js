'use strict';

/**
 * Figma plugin script tests.
 *
 * The generated import script runs inside Figma, where nothing in this repository can
 * reach it. Shipping it unexecuted would mean handing someone a script whose first ever
 * run happens against their live design file.
 *
 * So it runs here, against a stub of the Plugin API surface it touches. The stub is not
 * Figma — it cannot catch a misunderstanding of Figma's semantics — but it does catch the
 * failures that actually bite: a syntax error, an alias that resolves to nothing, a second
 * run duplicating the first, or a dry run that quietly writes anyway.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { OUT_DIR } = require('../scripts/generate-figma-tokens');

const SCRIPT = fs.readFileSync(path.join(OUT_DIR, 'import-variables.js'), 'utf8');

// ─── Plugin API stub ──────────────────────────────────────────────────────────

function createFigmaStub(seed = []) {
  let nextId = 1;
  const collections = [];
  const variables = [];
  const notices = [];

  const makeCollection = (name) => {
    const collection = {
      id: `col:${nextId++}`,
      name,
      modes: [{ modeId: `mode:${nextId++}`, name: 'Mode 1' }],
    };
    collections.push(collection);
    return collection;
  };

  const makeVariable = (name, collection, type) => {
    const variable = {
      id: `var:${nextId++}`,
      name,
      variableCollectionId: collection.id,
      resolvedType: type,
      description: '',
      valuesByMode: {},
      setValueForMode(modeId, value) {
        this.valuesByMode[modeId] = value;
      },
    };
    variables.push(variable);
    return variable;
  };

  for (const entry of seed) {
    let collection = collections.find((c) => c.name === entry.collection);
    if (!collection) collection = makeCollection(entry.collection);
    makeVariable(entry.name, collection, entry.type);
  }

  return {
    figma: {
      variables: {
        getLocalVariableCollectionsAsync: async () => collections.slice(),
        getLocalVariablesAsync: async () => variables.slice(),
        createVariableCollection: makeCollection,
        createVariable: makeVariable,
        createVariableAlias: (target) => ({ type: 'VARIABLE_ALIAS', id: target.id }),
      },
      notify: (message) => notices.push(message),
    },
    state: { collections, variables, notices },
  };
}

/** Runs the generated script with the given flags flipped. */
async function runScript({ dryRun = true, overwrite = false, seed = [] } = {}) {
  const source = SCRIPT
    .replace('const DRY_RUN = true;', `const DRY_RUN = ${dryRun};`)
    .replace('const OVERWRITE_EXISTING = false;', `const OVERWRITE_EXISTING = ${overwrite};`)
    .replace(/\nrun\(\);\n?$/, '\nreturn run();\n');

  const { figma, state } = createFigmaStub(seed);
  const log = [];
  const consoleStub = { log: (line) => log.push(String(line)) };

  // eslint-disable-next-line no-new-func
  const factory = new Function('figma', 'console', source);
  await factory(figma, consoleStub);

  return { state, log: log.join('\n') };
}

const TOKEN_COUNT = (() => {
  const match = SCRIPT.match(/const TOKENS = (\[[\s\S]*?\n\]);/);
  return JSON.parse(match[1]).length;
})();

// ─── Tests ────────────────────────────────────────────────────────────────────

test('the generated script is syntactically valid', () => {
  assert.doesNotThrow(() => new Function('figma', 'console', SCRIPT.replace(/\nrun\(\);\n?$/, '')));
});

test('it ships with the dry run switched on', () => {
  assert.match(SCRIPT, /const DRY_RUN = true;/);
  assert.match(SCRIPT, /const OVERWRITE_EXISTING = false;/);
});

test('a dry run writes nothing at all', async () => {
  const { state, log } = await runScript({ dryRun: true });

  assert.equal(state.collections.length, 0, 'a dry run created a collection');
  assert.equal(state.variables.length, 0, 'a dry run created a variable');
  assert.match(log, /DRY RUN - nothing was written/);
  assert.match(log, new RegExp(`variables to create:\\s+${TOKEN_COUNT}`));
});

test('applying to an empty file creates every variable, and every alias resolves', async () => {
  const { state, log } = await runScript({ dryRun: false });

  assert.equal(state.collections.length, 3);
  assert.equal(state.variables.length, TOKEN_COUNT);
  assert.match(log, /aliases that would not resolve:\s+0/);
  assert.match(log, /type clashes, skipped:\s+0/);

  const byId = new Map(state.variables.map((v) => [v.id, v]));
  const unset = [];
  const brokenAlias = [];

  for (const variable of state.variables) {
    const values = Object.values(variable.valuesByMode);
    if (values.length === 0) {
      unset.push(variable.name);
      continue;
    }
    const value = values[0];
    if (value && value.type === 'VARIABLE_ALIAS' && !byId.has(value.id)) {
      brokenAlias.push(variable.name);
    }
  }

  assert.deepEqual(unset, [], 'variables left without a value');
  assert.deepEqual(brokenAlias, [], 'aliases pointing at nothing');
});

test('colours become rgba in 0..1, with alpha preserved', async () => {
  const { state } = await runScript({ dryRun: false });
  const find = (name) => state.variables.find((v) => v.name === name);

  const white = find('options/color/neutral/0');
  const whiteValue = Object.values(white.valuesByMode)[0];
  assert.deepEqual(whiteValue, { r: 1, g: 1, b: 1, a: 1 });

  const backdrop = find('options/color/black/a40');
  const backdropValue = Object.values(backdrop.valuesByMode)[0];
  assert.equal(backdropValue.r, 0);
  assert.ok(Math.abs(backdropValue.a - 0.4) < 0.01, `alpha was ${backdropValue.a}`);
});

test('a second run changes nothing', async () => {
  const first = await runScript({ dryRun: false });
  const seed = first.state.variables.map((v) => ({
    collection: first.state.collections.find((c) => c.id === v.variableCollectionId).name,
    name: v.name,
    type: v.resolvedType,
  }));

  const second = await runScript({ dryRun: false, seed });

  assert.equal(second.state.variables.length, TOKEN_COUNT, 'the second run duplicated variables');
  assert.equal(second.state.collections.length, 3);
  assert.match(second.log, new RegExp(`variables to create:\\s+0`));
  assert.match(second.log, new RegExp(`left untouched:\\s+${TOKEN_COUNT}`));
});

test('an existing variable of the wrong type is reported and left alone', async () => {
  const seed = [
    { collection: '01 / Options', name: 'options/color/neutral/0', type: 'STRING' },
  ];
  const { state, log } = await runScript({ dryRun: false, seed });

  assert.match(log, /type clashes, skipped:\s+1/);
  assert.match(log, /options\/color\/neutral\/0 \(is STRING, wanted COLOR\)/);

  const clashing = state.variables.filter((v) => v.name === 'options/color/neutral/0');
  assert.equal(clashing.length, 1, 'a second variable was created beside the clashing one');
  assert.equal(clashing[0].resolvedType, 'STRING', 'the existing type was changed');
});

test('existing values survive unless OVERWRITE_EXISTING is set', async () => {
  const seed = [
    { collection: '02 / Decisions', name: 'decisions/color/text/primary', type: 'COLOR' },
  ];

  const kept = await runScript({ dryRun: false, seed, overwrite: false });
  const existing = kept.state.variables.find((v) => v.name === 'decisions/color/text/primary');
  assert.deepEqual(existing.valuesByMode, {}, 'an existing value was overwritten');

  const rewritten = await runScript({ dryRun: false, seed, overwrite: true });
  const updated = rewritten.state.variables.find((v) => v.name === 'decisions/color/text/primary');
  assert.equal(Object.values(updated.valuesByMode).length, 1, 'OVERWRITE_EXISTING did not write');
});

test('descriptions from the token comments are carried over', async () => {
  const { state } = await runScript({ dryRun: false });
  const described = state.variables.filter((v) => v.description);
  assert.ok(described.length > 50, `only ${described.length} variables carry a description`);
});
