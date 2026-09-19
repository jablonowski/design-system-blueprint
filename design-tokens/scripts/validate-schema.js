// @ts-check
'use strict';

/**
 * Layer 2 — Token schema validation
 *
 * Recursively walks tokens.json and enforces the Style Dictionary
 * three-tier token schema:
 *
 *   Token leaf:  { "value": string, "comment"?: string }  — no other keys
 *   Group node:  any key whose value is an object (not a leaf)
 *   Group comment: a "comment" string on a group node — allowed, skipped
 *
 * Additional format rules applied to leaf values:
 *   • References  — must match  {path.to.token}  (curly-brace syntax)
 *   • Hex colors  — must be     #rrggbb  (6-digit lowercase hex)
 *   • RGBA colors — must match  rgba(r, g, b, a)
 *
 * Tier boundaries (see validateTierBoundaries):
 *   tier 2 may only reference tier 1, tier 3 may only reference tier 2.
 *
 * Implements the validation step recommended by:
 * https://martinfowler.com/articles/design-token-based-ui-architecture.html
 */

const fs   = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../tokens/tokens.json');

// ─── Regex patterns ───────────────────────────────────────────────────────────

const RE_REFERENCE = /^\{[\w./#-]+\}$/;
const RE_HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const RE_RGBA      = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;

// ─── Recursive validator ──────────────────────────────────────────────────────

/**
 * @param {unknown} node
 * @param {string}  nodePath  Dot-notation path for error reporting
 * @param {string[]} errors   Accumulated error messages
 */
function validateNode(node, nodePath, errors) {
  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    errors.push(`${nodePath}: expected an object node, got ${Array.isArray(node) ? 'array' : typeof node}`);
    return;
  }

  const obj = /** @type {Record<string, unknown>} */ (node);

  if ('value' in obj) {
    validateLeaf(obj, nodePath, errors);
  } else {
    // Group node — recurse into every child except the optional 'comment' string
    for (const [key, child] of Object.entries(obj)) {
      if (key === 'comment') {
        if (typeof child !== 'string') {
          errors.push(`${nodePath}.comment: group comment must be a string`);
        }
        continue;
      }
      validateNode(child, nodePath ? `${nodePath}.${key}` : key, errors);
    }
  }
}

/**
 * @param {Record<string, unknown>} token
 * @param {string}  tokenPath
 * @param {string[]} errors
 */
function validateLeaf(token, tokenPath, errors) {
  // 1. Value must be a string (Style Dictionary uses string values for all types)
  if (typeof token.value !== 'string') {
    errors.push(`${tokenPath}: 'value' must be a string, got ${typeof token.value}`);
  }

  // 2. No unexpected keys — only 'value' and 'comment' are allowed on a leaf
  const ALLOWED = new Set(['value', 'comment']);
  for (const key of Object.keys(token)) {
    if (!ALLOWED.has(key)) {
      errors.push(`${tokenPath}: unexpected key '${key}' on token leaf (only 'value' and 'comment' are allowed)`);
    }
  }

  if (typeof token.value !== 'string') return; // already reported above

  const val = token.value;

  // 3. Reference syntax: value is entirely a {path.to.token} reference
  if (val.startsWith('{')) {
    if (!RE_REFERENCE.test(val)) {
      errors.push(`${tokenPath}: malformed reference '${val}' — expected format: {category.group.name}`);
    }
    return; // no further format checks on references
  }

  // 4. Hex color format
  if (val.startsWith('#')) {
    if (!RE_HEX_COLOR.test(val)) {
      errors.push(`${tokenPath}: hex color '${val}' must be exactly 6 hex digits (e.g. #1a7f3c)`);
    }
    return;
  }

  // 5. RGBA color format
  if (val.startsWith('rgba')) {
    if (!RE_RGBA.test(val)) {
      errors.push(`${tokenPath}: rgba value '${val}' is malformed`);
    }
    return;
  }

  // All other formats (px, %, s, plain numbers, keywords like 'ease', 'transparent') are valid as-is
}

// ─── Load ─────────────────────────────────────────────────────────────────────

let tokens;
try {
  tokens = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch (err) {
  console.error(`[validate-schema] Cannot read/parse ${FILE}`);
  console.error(err.message);
  process.exit(1);
}

// ─── Tier boundary validation ─────────────────────────────────────────────────

/**
 * Tier is derived from the root namespace:
 *   decisions.*  → tier 2 (semantic decisions)
 *   component.*  → tier 3 (component-scoped, private)
 *   everything else → tier 1 (raw options)
 *
 * Allowed reference directions (this is the architectural firewall — not a
 * README promise):
 *   tier 1 → tier 1   (composite raw values, e.g. a shadow built from a colour)
 *   tier 2 → tier 1   only
 *   tier 3 → tier 2   only
 *
 * A tier 3 token referencing tier 1 means a component reached past the
 * semantic layer. A tier 2 token referencing tier 2 means a decision was
 * aliased instead of made. Both are blocked here.
 */

const REF_RE = /\{([\w./#-]+)\}/g;

/** @param {string} tokenPath */
function tierOf(tokenPath) {
  if (tokenPath.startsWith('decisions.')) return 2;
  if (tokenPath.startsWith('component.')) return 3;
  return 1;
}

/**
 * @param {unknown} node
 * @param {string[]} pathParts
 * @param {Map<string, string>} out
 */
function collectLeaves(node, pathParts, out) {
  if (typeof node !== 'object' || node === null || Array.isArray(node)) return;
  const obj = /** @type {Record<string, unknown>} */ (node);

  if (typeof obj.value === 'string') {
    out.set(pathParts.join('.'), obj.value);
    return;
  }
  for (const [key, child] of Object.entries(obj)) {
    if (key === 'comment') continue;
    collectLeaves(child, [...pathParts, key], out);
  }
}

/** @param {string[]} errors */
function validateTierBoundaries(errors) {
  /** @type {Map<string, string>} */
  const leaves = new Map();
  collectLeaves(tokens, [], leaves);

  for (const [tokenPath, value] of leaves) {
    const fromTier = tierOf(tokenPath);

    for (const match of value.matchAll(REF_RE)) {
      const target = match[1];

      if (!leaves.has(target)) {
        errors.push(`${tokenPath}: reference '{${target}}' does not resolve to any token`);
        continue;
      }

      const toTier = tierOf(target);

      if (fromTier === 3 && toTier !== 2) {
        errors.push(
          `${tokenPath}: tier 3 may only reference tier 2, but '{${target}}' is tier ${toTier}. ` +
          `A component token must go through a semantic decision.`
        );
      }

      if (fromTier === 2 && toTier !== 1) {
        errors.push(
          `${tokenPath}: tier 2 may only reference tier 1, but '{${target}}' is tier ${toTier}. ` +
          `A decision must resolve to a raw option, not to another decision.`
        );
      }

      if (fromTier === 1 && toTier !== 1) {
        errors.push(
          `${tokenPath}: tier 1 may only reference tier 1, but '{${target}}' is tier ${toTier}.`
        );
      }
    }
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const errors = [];
validateNode(tokens, '', errors);
validateTierBoundaries(errors);

if (errors.length === 0) {
  console.log(`[validate-schema] ✓ Token schema and tier boundaries are valid`);
} else {
  console.error(`[validate-schema] ✗ Found ${errors.length} schema error(s):\n`);
  for (const e of errors) {
    console.error(`  • ${e}`);
  }
  process.exit(1);
}
