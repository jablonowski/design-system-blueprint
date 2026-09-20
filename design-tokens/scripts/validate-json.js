// @ts-check
'use strict';

/**
 * Layer 1 — tokens.json syntax validation
 *
 * JSON.parse is not enough. A JSON object may legally contain the same key twice,
 * and every parser silently keeps the last one — so a token group can be wiped out
 * by an accidental duplicate with no error anywhere in the pipeline. The token then
 * simply does not exist in the build, and the first sign of trouble is a component
 * referencing a CSS variable that was never emitted.
 *
 * That is not hypothetical: adding a `chevron.width` group to a component that
 * already had a `chevron.color` group did exactly this.
 *
 * So this file parses tokens.json with a parser that refuses duplicate keys, and
 * reports the line where the collision happens.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../tokens/tokens.json');

/**
 * Minimal JSON parser that records every object key and rejects duplicates
 * within the same object. Not a general-purpose parser — it handles exactly the
 * JSON subset a token file uses, and defers to JSON.parse for the final value.
 *
 * @param {string} text
 * @returns {string[]} error messages
 */
function findDuplicateKeys(text) {
  /** @type {string[]} */
  const errors = [];
  let i = 0;

  const lineAt = (index) => text.slice(0, index).split(/\r?\n/).length;

  function skipWhitespace() {
    while (i < text.length && /\s/.test(text[i])) i += 1;
  }

  function parseString() {
    // assumes text[i] === '"'
    let out = '';
    i += 1;
    while (i < text.length) {
      const ch = text[i];
      if (ch === '\\') {
        out += text[i] + text[i + 1];
        i += 2;
        continue;
      }
      if (ch === '"') {
        i += 1;
        return out;
      }
      out += ch;
      i += 1;
    }
    throw new Error('unterminated string');
  }

  function parseValue(trail) {
    skipWhitespace();
    const ch = text[i];

    if (ch === '{') return parseObject(trail);
    if (ch === '[') return parseArray(trail);
    if (ch === '"') return parseString();

    // number, true, false, null — consume until a structural character
    while (i < text.length && !/[,\]}\s]/.test(text[i])) i += 1;
    return null;
  }

  function parseArray(trail) {
    i += 1; // [
    skipWhitespace();
    if (text[i] === ']') { i += 1; return null; }
    let index = 0;
    for (;;) {
      parseValue(`${trail}[${index}]`);
      index += 1;
      skipWhitespace();
      if (text[i] === ',') { i += 1; continue; }
      if (text[i] === ']') { i += 1; return null; }
      throw new Error(`unexpected character '${text[i]}' in array at line ${lineAt(i)}`);
    }
  }

  function parseObject(trail) {
    i += 1; // {
    /** @type {Map<string, number>} */
    const seen = new Map();
    skipWhitespace();
    if (text[i] === '}') { i += 1; return null; }

    for (;;) {
      skipWhitespace();
      if (text[i] !== '"') {
        throw new Error(`expected a key at line ${lineAt(i)}`);
      }
      const keyStart = i;
      const key = parseString();

      if (seen.has(key)) {
        const where = trail ? `${trail}.${key}` : key;
        errors.push(
          `${where}: duplicate key — first defined at line ${seen.get(key)}, ` +
          `again at line ${lineAt(keyStart)}. The first definition is silently discarded.`
        );
      } else {
        seen.set(key, lineAt(keyStart));
      }

      skipWhitespace();
      if (text[i] !== ':') throw new Error(`expected ':' at line ${lineAt(i)}`);
      i += 1;

      parseValue(trail ? `${trail}.${key}` : key);

      skipWhitespace();
      if (text[i] === ',') { i += 1; continue; }
      if (text[i] === '}') { i += 1; return null; }
      throw new Error(`unexpected character '${text[i]}' at line ${lineAt(i)}`);
    }
  }

  skipWhitespace();
  parseValue('');
  return errors;
}

// ─── Run ──────────────────────────────────────────────────────────────────────

let raw;
try {
  raw = fs.readFileSync(FILE, 'utf8');
} catch (err) {
  console.error(`[validate-json] Cannot read ${FILE}`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

try {
  JSON.parse(raw);
} catch (err) {
  console.error(`[validate-json] ✗ tokens.json is not valid JSON`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

let duplicates;
try {
  duplicates = findDuplicateKeys(raw);
} catch (err) {
  console.error(`[validate-json] ✗ Could not scan tokens.json for duplicate keys`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

if (duplicates.length > 0) {
  console.error(`[validate-json] ✗ Found ${duplicates.length} duplicate key(s):\n`);
  for (const message of duplicates) {
    console.error(`  • ${message}`);
  }
  process.exit(1);
}

console.log('[validate-json] ✓ tokens.json is valid JSON with no duplicate keys');
