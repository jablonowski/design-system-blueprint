'use strict';

/**
 * Packaging and wire-surface tests.
 *
 * This server was only ever run from inside the monorepo: it resolved its tokens through
 * a relative path into a sibling directory, and it was not in any publish workflow. An
 * agent working in someone else's project — the whole premise of the AX claim — could
 * not have reached it at all.
 *
 * These tests cover the three things that have to hold for it to be a real package:
 * the bundled token snapshot matches the source it was taken from, the published tarball
 * contains what the server needs and nothing else, and the tools answer over stdio
 * without ever naming a tier 1 token.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const { BUNDLED_TOKENS, MONOREPO_TOKENS, describeTokenSource, getDefaultTokensPath } =
  require('../src/token-loader');

// ─── The snapshot cannot drift from the source ────────────────────────────────

test('the bundled token snapshot is identical to the token source', () => {
  assert.ok(fs.existsSync(BUNDLED_TOKENS), 'tokens/tokens.json is missing — run npm run sync:tokens');
  assert.ok(fs.existsSync(MONOREPO_TOKENS), 'the monorepo token source is missing');

  assert.equal(
    fs.readFileSync(BUNDLED_TOKENS, 'utf8'),
    fs.readFileSync(MONOREPO_TOKENS, 'utf8'),
    '\n  the bundled snapshot is stale. Run: npm run sync:tokens\n'
  );
});

// ─── Where the tokens come from is explicit ──────────────────────────────────

test('the monorepo source wins inside a checkout', () => {
  assert.equal(getDefaultTokensPath(), MONOREPO_TOKENS);
  assert.equal(describeTokenSource().origin, 'monorepo-source');
});

test('DSB_TOKENS_PATH overrides everything', () => {
  const previous = process.env.DSB_TOKENS_PATH;
  process.env.DSB_TOKENS_PATH = BUNDLED_TOKENS;
  try {
    assert.equal(getDefaultTokensPath(), BUNDLED_TOKENS);
    assert.equal(describeTokenSource().origin, 'override');
  } finally {
    if (previous === undefined) delete process.env.DSB_TOKENS_PATH;
    else process.env.DSB_TOKENS_PATH = previous;
  }
});

// ─── The tarball ─────────────────────────────────────────────────────────────

test('the published tarball carries the server and its tokens, and nothing else', () => {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const files = JSON.parse(output)[0].files.map((entry) => entry.path).sort();

  const required = [
    'package.json',
    'README.md',
    'tokens/tokens.json',
    'src/index.js',
    'src/server.js',
    'src/token-engine.js',
    'src/token-loader.js',
  ];
  assert.deepEqual(required.filter((file) => !files.includes(file)), [], `packed: ${files.join(', ')}`);

  // Development-only material has no business in a consumer's node_modules.
  const unwanted = files.filter((file) => file.startsWith('test/') || file.startsWith('scripts/'));
  assert.deepEqual(unwanted, []);
});

// ─── The wire surface ────────────────────────────────────────────────────────

/** Sends a batch of JSON-RPC requests to the real server binary over stdio. */
function callServer(requests) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'src', 'server.js')], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let out = '';
    let err = '';
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.stderr.on('data', (chunk) => { err += chunk; });
    child.on('error', reject);
    child.on('close', () => {
      const responses = out
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
      resolve({ responses, stderr: err });
    });

    for (const request of requests) child.stdin.write(`${JSON.stringify(request)}\n`);
    child.stdin.end();
  });
}

const call = (id, name, args) => ({
  jsonrpc: '2.0',
  id,
  method: 'tools/call',
  params: { name, arguments: args },
});

/** Every string anywhere in a response payload. */
function strings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const item of value) strings(item, out);
  else if (value && typeof value === 'object') for (const item of Object.values(value)) strings(item, out);
  return out;
}

test('the server answers over stdio', async () => {
  const { responses } = await callServer([
    { jsonrpc: '2.0', id: 1, method: 'initialize' },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  ]);

  assert.equal(responses.length, 2);
  assert.equal(responses[0].result.serverInfo.name, 'dsb-tokens-mcp');
  assert.deepEqual(
    responses[1].result.tools.map((tool) => tool.name).sort(),
    ['explain_component_tokens', 'resolve_token']
  );
});

test('no tool response ever names a tier 1 token or a raw value', async () => {
  const { responses } = await callServer([
    call(1, 'resolve_token', {
      intent: 'background for the primary action',
      context: 'custom-component',
      property: 'background-color',
    }),
    call(2, 'resolve_token', {
      intent: 'muted caption text',
      context: 'custom-component',
      property: 'color',
    }),
    call(3, 'resolve_token', {
      intent: 'padding inside a medium control',
      context: 'custom-component',
      property: 'padding',
    }),
    call(4, 'explain_component_tokens', { component: 'button', variant: 'primary' }),
    call(5, 'explain_component_tokens', { component: 'table' }),
  ]);

  assert.equal(responses.length, 5, 'the server dropped a request');

  const offenders = [];
  for (const response of responses) {
    assert.ok(response.result, `request ${response.id} failed: ${JSON.stringify(response.error)}`);

    for (const value of strings(response.result.structuredContent)) {
      if (/(^|[.\s(])[a-z]+\.options\./.test(value)) offenders.push(`tier 1 path: ${value}`);
      if (/--ds-[a-z]*options/.test(value)) offenders.push(`tier 1 variable: ${value}`);
      if (/#[0-9a-fA-F]{3,8}\b/.test(value)) offenders.push(`raw colour: ${value}`);
      if (/\b\d+(\.\d+)?(px|rem|em)\b/.test(value)) offenders.push(`raw measurement: ${value}`);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    '\n  the resolver handed a caller something the distribution boundary hides:\n    ' +
    offenders.join('\n    ') + '\n'
  );
});

test('a resolved answer is a tier 2 token marked public', async () => {
  const { responses } = await callServer([
    call(1, 'resolve_token', {
      intent: 'background for the primary action',
      context: 'custom-component',
      property: 'background-color',
    }),
  ]);

  const result = responses[0].result.structuredContent;
  assert.equal(result.status, 'resolved');
  assert.equal(result.tier, 2);
  assert.equal(result.visibility, 'public');
  assert.match(result.token, /^decisions\./);
});
