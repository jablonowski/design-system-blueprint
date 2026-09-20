'use strict';

/**
 * Token usage test.
 *
 * Every var(--ds-*) in component source must resolve to a token this repository
 * actually defines. Without this, a component can reference a variable that was
 * never emitted — the declaration is simply dropped by the browser and the element
 * renders with no width, no colour, or an inherited value that happens to look
 * plausible in Storybook.
 *
 * This is how a chevron lost its dimensions: a token group was added to
 * component.accordion under a key that already existed, JSON kept the last one, the
 * variable was never built, and the only symptom was an SVG with no size. No lint
 * rule, no schema check and no visual baseline caught it.
 *
 * Reads the token SOURCE rather than a build output, so it needs no build step and
 * cannot go stale against one.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const GLOBAL_STYLES = path.join(ROOT, 'src', 'styles.css');
const TOKENS_FILE = path.resolve(ROOT, '..', 'design-tokens', 'tokens', 'tokens.json');
const ANGULAR_JSON = path.join(ROOT, 'angular.json');

/** Mirrors the Style Dictionary css transform: dot path + camelCase -> kebab, ds prefix. */
function toCssVariableName(tokenPath) {
  return (
    '--ds-' +
    tokenPath
      .split('.')
      .map((segment) => segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
      .join('-')
  );
}

function declaredVariables() {
  const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
  const names = new Set();

  const walk = (node, trail) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.value === 'string') {
      names.add(toCssVariableName(trail.join('.')));
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key === 'comment') continue;
      walk(child, [...trail, key]);
    }
  };

  walk(tokens, []);
  return names;
}

function styleFiles() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.css') || entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(COMPONENTS_DIR);
  if (fs.existsSync(GLOBAL_STYLES)) out.push(GLOBAL_STYLES);
  return out;
}

test('every token referenced by a component exists in the token source', () => {
  const declared = declaredVariables();
  const problems = [];

  for (const file of styleFiles()) {
    const source = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    for (const match of source.matchAll(/var\(\s*(--ds-[\w-]+)\s*[,)]/g)) {
      const name = match[1];
      if (!declared.has(name)) {
        const line = source.slice(0, match.index).split(/\r?\n/).length;
        problems.push(`${rel}:${line} references ${name}, which no token defines`);
      }
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
});

test('component source reaches no further than tier 3', () => {
  // Components may use component.* and decisions.*; reaching into a raw option
  // from a component stylesheet bypasses the semantic layer entirely.
  const problems = [];

  for (const file of styleFiles()) {
    const source = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    for (const match of source.matchAll(/var\(\s*(--ds-[\w-]+)\s*[,)]/g)) {
      const name = match[1];
      if (/^--ds-(?!decisions-|component-)/.test(name)) {
        const line = source.slice(0, match.index).split(/\r?\n/).length;
        problems.push(`${rel}:${line} uses ${name}, a tier 1 raw option`);
      }
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
});

// ─── The artifact the browser actually loads ──────────────────────────────────

/**
 * Checking component CSS against the token SOURCE proves the token exists in this
 * repository. It does not prove it exists in the stylesheet Storybook and the app
 * actually load — and those are different files.
 *
 * They drifted exactly that way: angular.json pulled the token CSS out of
 * node_modules, where the published package sat several releases behind the source.
 * Every new variable resolved to nothing, so paddings, gaps, control heights and the
 * whole action colour family silently collapsed. Source-level checks were green the
 * entire time, because the tokens were right where they were written and missing only
 * where they were read.
 *
 * So this reads the stylesheet angular.json names, follows it to disk, and asserts the
 * component source can only use variables that file declares.
 */

function resolvedTokenStylesheet() {
  const angular = JSON.parse(fs.readFileSync(ANGULAR_JSON, 'utf8'));
  const styles = [];

  const collect = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node.styles)) styles.push(...node.styles.filter((s) => typeof s === 'string'));
    for (const child of Object.values(node)) collect(child);
  };
  collect(angular);

  const tokenStyle = styles.find((s) => /dsb-tokens.*\.css$/.test(s));
  assert.ok(tokenStyle, 'angular.json declares no dsb-tokens stylesheet');
  return path.join(ROOT, tokenStyle);
}

test('the token stylesheet angular.json loads exists on disk', () => {
  const stylesheet = resolvedTokenStylesheet();
  assert.ok(
    fs.existsSync(stylesheet),
    `${path.relative(ROOT, stylesheet)} is missing — run npm ci, or point the dependency ` +
    'at the local token build with: npm install ../design-tokens'
  );
});

test('every token a component uses is present in the stylesheet that gets loaded', () => {
  const stylesheet = resolvedTokenStylesheet();
  if (!fs.existsSync(stylesheet)) return; // reported by the test above

  const css = fs.readFileSync(stylesheet, 'utf8');
  const shipped = new Set([...css.matchAll(/^\s*(--ds-[\w-]+)\s*:/gm)].map((m) => m[1]));

  const problems = [];
  for (const file of styleFiles()) {
    const source = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    for (const match of source.matchAll(/var\(\s*(--ds-[\w-]+)\s*[,)]/g)) {
      if (!shipped.has(match[1])) {
        const line = source.slice(0, match.index).split(/\r?\n/).length;
        problems.push(`${rel}:${line} uses ${match[1]}`);
      }
    }
  }

  const unique = [...new Set(problems)];
  assert.deepEqual(
    unique,
    [],
    `\n  ${unique.slice(0, 15).join('\n  ')}\n  ${unique.length > 15 ? `... and ${unique.length - 15} more\n  ` : ''}` +
    `The loaded stylesheet (${path.relative(ROOT, stylesheet)}) is behind the token source.\n  ` +
    'Rebuild the tokens and relink: cd ../design-tokens && npm run build && cd ../components && npm install ../design-tokens\n'
  );
});
