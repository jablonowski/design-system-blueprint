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

// ─── Run ──────────────────────────────────────────────────────────────────────

let tokens;
try {
  tokens = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch (err) {
  console.error(`[validate-schema] Cannot read/parse ${FILE}`);
  console.error(err.message);
  process.exit(1);
}

const errors = [];
validateNode(tokens, '', errors);

if (errors.length === 0) {
  console.log(`[validate-schema] ✓ Token schema is valid`);
} else {
  console.error(`[validate-schema] ✗ Found ${errors.length} schema error(s):\n`);
  for (const e of errors) {
    console.error(`  • ${e}`);
  }
  process.exit(1);
}
