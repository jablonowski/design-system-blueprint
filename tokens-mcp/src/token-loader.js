'use strict';

const fs = require('fs');
const path = require('path');

const REFERENCE_RE = /^\{([\w.-]+)\}$/;

const BUNDLED_TOKENS = path.resolve(__dirname, '..', 'tokens', 'tokens.json');
const MONOREPO_TOKENS = path.resolve(__dirname, '..', '..', 'design-tokens', 'tokens', 'tokens.json');
const MONOREPO_MARKER = path.resolve(__dirname, '..', '..', 'design-tokens', 'package.json');

/**
 * Where the resolver reads its tokens from, in order:
 *
 *   1. DSB_TOKENS_PATH          — an explicit override, for tests and for pointing the
 *                                 resolver at a fork of the token set.
 *   2. the monorepo source      — only when a sibling design-tokens package is actually
 *                                 there. Inside a checkout this is what you want: edit
 *                                 tokens.json and the resolver answers from the edit,
 *                                 with no sync step in between.
 *   3. the bundled snapshot     — what an installed copy of this package uses.
 *
 * The snapshot and the source cannot drift: a test asserts they are byte-identical, and
 * `npm run sync:tokens` regenerates it. It had to be a snapshot rather than a dependency
 * because the token package deliberately stops shipping the three-tier source to
 * consumers — see the distribution boundary in the token package README.
 */
function isMonorepoCheckout() {
  if (!fs.existsSync(MONOREPO_TOKENS) || !fs.existsSync(MONOREPO_MARKER)) return false;
  try {
    return JSON.parse(fs.readFileSync(MONOREPO_MARKER, 'utf8')).name === '@jablonowski/dsb-tokens';
  } catch {
    return false;
  }
}

function getDefaultTokensPath() {
  const override = process.env.DSB_TOKENS_PATH;
  if (override) return path.resolve(override);
  if (isMonorepoCheckout()) return MONOREPO_TOKENS;
  return BUNDLED_TOKENS;
}

function describeTokenSource(tokensPath = getDefaultTokensPath()) {
  if (process.env.DSB_TOKENS_PATH) return { origin: 'override', tokensPath };
  if (tokensPath === MONOREPO_TOKENS) return { origin: 'monorepo-source', tokensPath };
  if (tokensPath === BUNDLED_TOKENS) return { origin: 'bundled-snapshot', tokensPath };
  return { origin: 'explicit-argument', tokensPath };
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function detectTier(pathString) {
  if (pathString.startsWith('decisions.')) return 2;
  if (pathString.startsWith('component.')) return 3;
  return 1;
}

function walkTokens(node, pathParts, inheritedComment, out) {
  if (!isObject(node)) return;

  const nodeComment = typeof node.comment === 'string' ? node.comment : inheritedComment;

  if (typeof node.value === 'string') {
    const tokenPath = pathParts.join('.');
    out.push({
      path: tokenPath,
      tier: detectTier(tokenPath),
      value: node.value,
      comment: nodeComment || '',
    });
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key === 'comment') continue;
    walkTokens(child, [...pathParts, key], nodeComment, out);
  }
}

function parseReference(value) {
  const match = value.match(REFERENCE_RE);
  return match ? match[1] : null;
}

function toKebabSegment(segment) {
  return segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCssVariableName(tokenPath) {
  const normalized = tokenPath
    .split('.')
    .map(toKebabSegment)
    .join('-');
  return `--ds-${normalized}`;
}

function toCssUsage(tokenPath, property) {
  const cssVar = toCssVariableName(tokenPath);
  if (property && typeof property === 'string' && property.trim().length > 0) {
    return `${property}: var(${cssVar});`;
  }
  return `var(${cssVar})`;
}

function loadTokens(tokensPath = getDefaultTokensPath()) {
  const raw = fs.readFileSync(tokensPath, 'utf8');
  const root = JSON.parse(raw);
  const leaves = [];
  walkTokens(root, [], '', leaves);

  const byPath = new Map(leaves.map((entry) => [entry.path, entry]));
  return { leaves, byPath, tokensPath };
}

module.exports = {
  getDefaultTokensPath,
  describeTokenSource,
  BUNDLED_TOKENS,
  MONOREPO_TOKENS,
  loadTokens,
  parseReference,
  toCssVariableName,
  toCssUsage,
};
