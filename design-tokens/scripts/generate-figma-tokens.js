'use strict';

/**
 * Figma variable export.
 *
 * Turns design-tokens/tokens/tokens.json into two artifacts:
 *
 *   figma/tokens.dtcg.json             W3C DTCG token file, one group per Figma
 *                                      collection, aliases preserved as references.
 *                                      Readable by Tokens Studio and the common
 *                                      variable-import plugins.
 *
 *   figma/import-variables.js          Figma Plugin API script that creates or
 *                                      updates the variables in place. Idempotent,
 *                                      and it never changes the type of a variable
 *                                      that already exists — it reports the clash
 *                                      instead.
 *
 *   figma/report.md                    What could not be represented, and why.
 *
 * The output is committed rather than built into dist/, so a pull request shows exactly
 * which variables the design file will need — "this change adds 71 Figma variables" is a
 * reviewable statement, and CI checks the committed copy is current.
 *
 * The point is not a one-off migration. The design file drifted from the token
 * source by more than a hundred variables precisely because keeping them in step
 * was somebody's memory rather than a build step. This is the build step: the
 * Figma variable set becomes a generated view of tokens.json, not a hand-maintained
 * twin of it.
 *
 * NAMING. The output must match the names already in the file, or an import creates
 * duplicates instead of updating. The existing convention, read off the file:
 *   - tier 1 lives under `options/`, tier 2 under `decisions/`, tier 3 under `component/`
 *   - scalar categories of two words are hyphenated into one segment:
 *     `font-size`, `border-radius`, `z-index` — but families that group by role keep
 *     their slash: `color/text/primary`, `motion/duration/fast`
 *   - leaf names are kebab-case: `rowHover` -> `row-hover`
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOKENS_FILE = path.join(ROOT, 'tokens', 'tokens.json');
const OUT_DIR = path.join(ROOT, 'figma');

const COLLECTIONS = {
  options: '01 / Options',
  decisions: '02 / Decisions',
  component: '03 / Components',
};

/** Two-word scalar categories the file writes as a single hyphenated segment. */
const COMPOUND_CATEGORIES = new Set([
  'font.size',
  'font.weight',
  'font.lineHeight',
  'font.tracking',
  'border.width',
  'border.radius',
  'layout.width',
]);

/** Tier 1 category names that differ from the token namespace. */
const TIER1_CATEGORY_ALIAS = {
  z: 'z-index',
};

const kebab = (segment) => segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// ─── Load and flatten ─────────────────────────────────────────────────────────

function flatten(tokens) {
  const leaves = [];
  const walk = (node, trail, comment) => {
    if (!node || typeof node !== 'object') return;
    const inherited = typeof node.comment === 'string' ? node.comment : comment;
    if (typeof node.value === 'string') {
      leaves.push({ path: trail.join('.'), value: node.value, comment: inherited || '' });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key === 'comment') continue;
      walk(child, [...trail, key], inherited);
    }
  };
  walk(tokens, [], '');
  return leaves;
}

// ─── Name mapping ─────────────────────────────────────────────────────────────

/** @returns {{collection: 'options'|'decisions'|'component', segments: string[]} | null} */
function toFigmaPath(tokenPath) {
  const parts = tokenPath.split('.');

  if (parts[0] === 'decisions' || parts[0] === 'component') {
    const collection = parts[0];
    const rest = parts.slice(1);
    const head = `${rest[0]}.${rest[1]}`;
    const segments =
      COMPOUND_CATEGORIES.has(head)
        ? [`${kebab(rest[0])}-${kebab(rest[1])}`, ...rest.slice(2).map(kebab)]
        : rest.map(kebab);
    return { collection, segments };
  }

  // tier 1: <category...>.options.<rest...>
  const optionsAt = parts.indexOf('options');
  if (optionsAt === -1) return null;

  const rawCategory = parts.slice(0, optionsAt).join('.');
  const category =
    TIER1_CATEGORY_ALIAS[rawCategory] ||
    parts.slice(0, optionsAt).map(kebab).join('-');

  return { collection: 'options', segments: [category, ...parts.slice(optionsAt + 1).map(kebab)] };
}

const figmaName = (mapped) => `${mapped.collection}/${mapped.segments.join('/')}`;
const dtcgPath = (mapped) => [mapped.collection, ...mapped.segments];

// ─── Value typing ─────────────────────────────────────────────────────────────

const REFERENCE_RE = /^\{([\w.-]+)\}$/;

function toHex8(value) {
  const rgba = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgba) {
    const [, r, g, b, a] = rgba;
    const alpha = Math.round((a === undefined ? 1 : Number(a)) * 255);
    const hex = [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
    return `#${hex}${alpha.toString(16).padStart(2, '0')}`;
  }
  if (value === 'transparent') return '#00000000';
  return value;
}

/**
 * @returns {{kind: 'color'|'number'|'string'|'unsupported', dtcgType: string,
 *            figmaType: string|null, value: unknown, reason?: string}}
 */
function classify(tokenPath, value) {
  if (/^#[0-9a-fA-F]{3,8}$/.test(value) || /^rgba?\(/.test(value) || value === 'transparent') {
    return { kind: 'color', dtcgType: 'color', figmaType: 'COLOR', value: toHex8(value) };
  }

  if (/^-?\d+(\.\d+)?px$/.test(value)) {
    return { kind: 'number', dtcgType: 'dimension', figmaType: 'FLOAT', value: parseFloat(value) };
  }

  if (/^-?\d+(\.\d+)?em$/.test(value)) {
    return {
      kind: 'unsupported',
      dtcgType: 'dimension',
      figmaType: null,
      value,
      reason: 'em units have no Figma variable equivalent (letter spacing is a percentage there)',
    };
  }

  if (/^-?\d+(\.\d+)?s$/.test(value)) {
    return {
      kind: 'number',
      dtcgType: 'duration',
      figmaType: 'FLOAT',
      value: Math.round(parseFloat(value) * 1000),
      unit: 'ms',
    };
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return { kind: 'number', dtcgType: 'number', figmaType: 'FLOAT', value: parseFloat(value) };
  }

  if (/^-?\d+(\.\d+)?%$/.test(value)) {
    return {
      kind: 'unsupported',
      dtcgType: 'dimension',
      figmaType: null,
      value,
      reason: 'percentage values cannot be bound to a Figma numeric variable',
    };
  }

  if (/\d+px\s+\d+px|\s0\s0\s0\s/.test(value) || tokenPath.startsWith('shadow.')) {
    return {
      kind: 'unsupported',
      dtcgType: 'shadow',
      figmaType: null,
      value,
      reason: 'Figma variables support colour, number, string and boolean only — not shadows',
    };
  }

  return { kind: 'string', dtcgType: 'other', figmaType: 'STRING', value };
}

// ─── Build ────────────────────────────────────────────────────────────────────

function build() {
  const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  const leaves = flatten(tokens);

  const byTokenPath = new Map(leaves.map((leaf) => [leaf.path, leaf]));
  const mappedByTokenPath = new Map();
  for (const leaf of leaves) {
    const mapped = toFigmaPath(leaf.path);
    if (mapped) mappedByTokenPath.set(leaf.path, mapped);
  }

  /** A token is exportable only if it, and everything it resolves through, is. */
  const unsupported = new Map();

  const classifyResolved = (tokenPath, seen = new Set()) => {
    if (seen.has(tokenPath)) return { kind: 'unsupported', reason: 'circular reference' };
    seen.add(tokenPath);
    const leaf = byTokenPath.get(tokenPath);
    if (!leaf) return { kind: 'unsupported', reason: 'unresolved reference' };
    const ref = leaf.value.match(REFERENCE_RE);
    if (ref) return classifyResolved(ref[1], seen);
    return classify(tokenPath, leaf.value);
  };

  const exportable = [];
  for (const leaf of leaves) {
    const mapped = mappedByTokenPath.get(leaf.path);
    if (!mapped) {
      unsupported.set(leaf.path, 'token path does not fit the options/decisions/component shape');
      continue;
    }
    const resolved = classifyResolved(leaf.path);
    if (resolved.kind === 'unsupported') {
      unsupported.set(leaf.path, resolved.reason);
      continue;
    }
    const ref = leaf.value.match(REFERENCE_RE);
    exportable.push({
      tokenPath: leaf.path,
      mapped,
      comment: leaf.comment,
      figmaType: resolved.figmaType,
      dtcgType: resolved.dtcgType,
      aliasOf: ref ? ref[1] : null,
      literal: ref ? null : classify(leaf.path, leaf.value).value,
    });
  }

  // Drop aliases whose target was itself dropped.
  const exportableSet = new Set(exportable.map((t) => t.tokenPath));
  const kept = exportable.filter((token) => {
    if (!token.aliasOf) return true;
    if (exportableSet.has(token.aliasOf)) return true;
    unsupported.set(token.tokenPath, `aliases ${token.aliasOf}, which is not exportable`);
    return false;
  });

  return { kept, unsupported, mappedByTokenPath };
}

// ─── DTCG output ──────────────────────────────────────────────────────────────

function toDtcg({ kept, mappedByTokenPath }) {
  const root = {};

  for (const token of kept) {
    const segments = dtcgPath(token.mapped);
    let node = root;
    for (const segment of segments.slice(0, -1)) {
      node[segment] = node[segment] || {};
      node = node[segment];
    }
    const leafName = segments[segments.length - 1];

    const value = token.aliasOf
      ? `{${dtcgPath(mappedByTokenPath.get(token.aliasOf)).join('.')}}`
      : token.literal;

    node[leafName] = {
      $type: token.dtcgType,
      $value: value,
      ...(token.comment ? { $description: token.comment } : {}),
      $extensions: {
        'com.figma': {
          collection: COLLECTIONS[token.mapped.collection],
          name: figmaName(token.mapped),
          resolvedType: token.figmaType,
        },
        'pl.jablonowski.dsb': { source: token.tokenPath },
      },
    };
  }

  return root;
}

// ─── Plugin script output ─────────────────────────────────────────────────────

function toPluginScript({ kept, mappedByTokenPath }) {
  const rows = kept.map((token) => ({
    collection: COLLECTIONS[token.mapped.collection],
    name: figmaName(token.mapped),
    type: token.figmaType,
    description: token.comment || '',
    alias: token.aliasOf
      ? figmaName(mappedByTokenPath.get(token.aliasOf))
      : null,
    value: token.aliasOf ? null : token.literal,
  }));

  return `// Generated by design-tokens/scripts/generate-figma-tokens.js — do not edit.
//
// Run this inside Figma with a plugin that evaluates the Plugin API (Scripter, or a
// local dev plugin). It creates missing variables and updates existing ones in place.
//
// It is idempotent and deliberately conservative.
//
// By default it only CREATES what is missing. Values of variables that already exist are
// left untouched, because this repository cannot know how the existing ones were entered
// — a duration may be stored as 0.12 seconds or 120 milliseconds, and silently rewriting
// one into the other changes the design without anybody deciding to. Descriptions are the
// exception; those are safe to refresh.
//
// Flip OVERWRITE_EXISTING to true only after reading the diff the dry run prints, and
// only once you have accepted that tokens.json is the source of truth for values too.
//
// A variable that exists with a different resolvedType is always reported and left alone:
// changing a variable's type detaches every binding in the file.

const OVERWRITE_EXISTING = false;

const TOKENS = ${JSON.stringify(rows, null, 2)};

function hexToRgba(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = (i) => parseInt(full.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: full.length >= 8 ? n(6) : 1 };
}

async function run() {
  const created = [];
  const updated = [];
  const untouched = [];
  const skipped = [];

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const byName = new Map(collections.map((c) => [c.name, c]));

  for (const name of [...new Set(TOKENS.map((t) => t.collection))]) {
    if (!byName.has(name)) {
      byName.set(name, figma.variables.createVariableCollection(name));
      created.push('collection ' + name);
    }
  }

  const existing = await figma.variables.getLocalVariablesAsync();
  const index = new Map(existing.map((v) => [v.variableCollectionId + '::' + v.name, v]));
  const resolve = (collectionName, variableName) =>
    index.get(byName.get(collectionName).id + '::' + variableName);

  // Pass 1 — create every variable with a placeholder so aliases can find targets.
  for (const token of TOKENS) {
    const collection = byName.get(token.collection);
    const found = resolve(token.collection, token.name);
    if (found) {
      if (found.resolvedType !== token.type) {
        skipped.push(token.name + ' (exists as ' + found.resolvedType + ', wanted ' + token.type + ')');
      }
      continue;
    }
    const variable = figma.variables.createVariable(token.name, collection, token.type);
    index.set(collection.id + '::' + token.name, variable);
    created.push(token.name);
  }

  const isNew = new Set(created);

  // Pass 2 — set values and aliases.
  for (const token of TOKENS) {
    const variable = resolve(token.collection, token.name);
    if (!variable || variable.resolvedType !== token.type) continue;

    const modeId = byName.get(token.collection).modes[0].modeId;

    if (!isNew.has(token.name) && !OVERWRITE_EXISTING) {
      if (token.description && variable.description !== token.description) {
        variable.description = token.description;
      }
      untouched.push(token.name);
      continue;
    }

    if (token.alias) {
      const target =
        resolve('${COLLECTIONS.options}', token.alias) ||
        resolve('${COLLECTIONS.decisions}', token.alias) ||
        resolve('${COLLECTIONS.component}', token.alias);
      if (!target) {
        skipped.push(token.name + ' (alias target ' + token.alias + ' not found)');
        continue;
      }
      variable.setValueForMode(modeId, figma.variables.createVariableAlias(target));
    } else if (token.type === 'COLOR') {
      variable.setValueForMode(modeId, hexToRgba(token.value));
    } else {
      variable.setValueForMode(modeId, token.value);
    }

    if (token.description && variable.description !== token.description) {
      variable.description = token.description;
    }
    updated.push(token.name);
  }

  console.log('created:   ' + created.length);
  console.log('written:   ' + updated.length);
  console.log('untouched: ' + untouched.length + (OVERWRITE_EXISTING ? '' : ' (already existed; set OVERWRITE_EXISTING to rewrite)'));
  console.log('skipped:   ' + skipped.length);
  skipped.forEach((s) => console.log('  skipped ' + s));
  figma.notify(
    'Tokens: ' + created.length + ' created, ' + updated.length + ' written, ' +
    untouched.length + ' untouched, ' + skipped.length + ' skipped'
  );
}

run();
`;
}

// ─── Report ───────────────────────────────────────────────────────────────────

function toReport({ kept, unsupported }) {
  const perCollection = {};
  for (const token of kept) {
    const name = COLLECTIONS[token.mapped.collection];
    perCollection[name] = (perCollection[name] || 0) + 1;
  }

  const grouped = new Map();
  for (const [tokenPath, reason] of unsupported) {
    if (!grouped.has(reason)) grouped.set(reason, []);
    grouped.get(reason).push(tokenPath);
  }

  const lines = [
    '# Figma variable export',
    '',
    'Generated by `design-tokens/scripts/generate-figma-tokens.js`. Do not edit by hand.',
    '',
    '## Exported',
    '',
    '| Collection | Variables |',
    '|---|---:|',
    ...Object.entries(perCollection).map(([name, count]) => `| ${name} | ${count} |`),
    `| **Total** | **${kept.length}** |`,
    '',
    '## Not exported',
    '',
    'Figma variables hold colour, number, string and boolean values. Anything else stays',
    'a Figma style or a code-only token — that is a limitation of the target, not a gap',
    'in the token set.',
    '',
    '## Conversions worth knowing about',
    '',
    '- Durations are exported in **milliseconds** (`0.12s` becomes `120`), because Figma',
    '  has no time unit and its prototyping fields are in ms. If the variables already in',
    '  the file hold seconds, the import leaves them alone — see `OVERWRITE_EXISTING` in',
    '  the plugin script.',
    '- `rgba()` colours are exported as 8-digit hex so the alpha survives.',
    '',
  ];

  for (const [reason, paths] of [...grouped].sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`### ${reason} (${paths.length})`, '');
    for (const tokenPath of paths.sort()) lines.push(`- \`${tokenPath}\``);
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Run ──────────────────────────────────────────────────────────────────────

/** Build every artifact in memory. Exported so the freshness test can compare without writing. */
function buildArtifacts() {
  const result = build();
  return {
    result,
    files: {
      'tokens.dtcg.json': `${JSON.stringify(toDtcg(result), null, 2)}\n`,
      'import-variables.js': toPluginScript(result),
      'report.md': toReport(result),
    },
  };
}

function main() {
  const { result, files } = buildArtifacts();

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(OUT_DIR, name), contents, 'utf8');
  }

  console.log(
    `[figma] Exported ${result.kept.length} variables, ` +
    `${result.unsupported.size} not representable. See figma/report.md`
  );
}

module.exports = { buildArtifacts, OUT_DIR, COLLECTIONS };

if (require.main === module) main();
