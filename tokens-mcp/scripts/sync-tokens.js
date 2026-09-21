#!/usr/bin/env node
'use strict';

/**
 * Copies the token source into this package.
 *
 * The resolver needs the authoring source, not a build output: it reads the
 * {decisions.color.text.primary} reference strings to know what a tier 3 token aliases,
 * and the group comments to decide whether an intent has any evidence behind it. Style
 * Dictionary's JSON output has resolved every reference and dropped the per-token
 * comments, so it cannot answer either question.
 *
 * The token package no longer ships that source to consumers — an app that installs
 * tokens has no business holding tier 1 on disk. So the resolver carries its own copy,
 * and a test asserts the copy is identical to the source it was taken from.
 */

const fs = require('fs');
const path = require('path');

const SOURCE = path.resolve(__dirname, '..', '..', 'design-tokens', 'tokens', 'tokens.json');
const TARGET = path.resolve(__dirname, '..', 'tokens', 'tokens.json');

if (!fs.existsSync(SOURCE)) {
  console.error(`[sync-tokens] source not found: ${SOURCE}`);
  console.error('[sync-tokens] this script only runs inside the monorepo checkout.');
  process.exit(1);
}

const source = fs.readFileSync(SOURCE, 'utf8');
const changed = !fs.existsSync(TARGET) || fs.readFileSync(TARGET, 'utf8') !== source;

fs.mkdirSync(path.dirname(TARGET), { recursive: true });
fs.writeFileSync(TARGET, source);

const leaves = (() => {
  let count = 0;
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.value === 'string') { count += 1; return; }
    for (const [key, child] of Object.entries(node)) {
      if (key !== 'comment') walk(child);
    }
  };
  walk(JSON.parse(source));
  return count;
})();

console.log(
  `[sync-tokens] ${changed ? 'updated' : 'already current'}: tokens/tokens.json (${leaves} tokens)`
);
