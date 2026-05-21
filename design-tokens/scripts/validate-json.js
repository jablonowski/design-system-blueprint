// @ts-check
'use strict';

/**
 * Layer 1 — JSON syntax validation
 * Checks that tokens/tokens.json is well-formed JSON.
 * Exits with code 1 and prints the parse error on failure.
 */

const fs   = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../tokens/tokens.json');

let raw;
try {
  raw = fs.readFileSync(FILE, 'utf8');
} catch (err) {
  console.error(`[validate-json] Cannot read file: ${FILE}`);
  console.error(err.message);
  process.exit(1);
}

try {
  JSON.parse(raw);
  console.log('[validate-json] ✓ tokens.json is valid JSON');
} catch (err) {
  console.error('[validate-json] ✗ tokens.json is not valid JSON');
  console.error(err.message);
  process.exit(1);
}
