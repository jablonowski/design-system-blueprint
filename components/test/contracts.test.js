'use strict';

/**
 * Contract drift test.
 *
 * components/src/storybook/mcp.ts is hand-written metadata, and it is what agents read
 * as the component API — through parameters.mcp, generated argTypes, and the exported
 * mcp/contracts.json. Nothing in the build forces it to match the Angular source, so
 * without this test it drifts silently and an agent starts recommending props that do
 * not exist.
 *
 * This reads the real @Input/@Output surface out of the component sources and asserts
 * the metadata describes exactly that surface — no missing props, no invented ones.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const MCP_TS_FILE = path.join(ROOT, 'src', 'storybook', 'mcp.ts');
const PUBLIC_API_FILE = path.join(ROOT, 'src', 'public-api.ts');

// ── Read the declared contracts ──────────────────────────────────────────────

function readContracts() {
  const source = fs.readFileSync(MCP_TS_FILE, 'utf8');
  const match = source.match(
    /const contracts:\s*Record<ComponentContractKey, ComponentContract>\s*=\s*(\{[\s\S]*?\n\});\n\nexport function getMcpContract/
  );
  assert.ok(match, 'Unable to locate the contracts object in src/storybook/mcp.ts');
  return Function(`"use strict"; return (${match[1]});`)();
}

// ── Read the real component API ──────────────────────────────────────────────

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function listComponentFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listComponentFiles(full, out);
      continue;
    }
    if (!entry.name.endsWith('.component.ts')) continue;
    if (/\.(spec|test|stories)\.ts$/.test(entry.name)) continue;
    out.push(full);
  }
  return out;
}

function parseComponent(filePath) {
  const source = stripComments(fs.readFileSync(filePath, 'utf8'));

  const classMatch = source.match(/export class (\w+Component)\b/);
  if (!classMatch) return null;

  const selectorMatch = source.match(/selector:\s*'([^']+)'/);

  const inputs = new Set();
  for (const m of source.matchAll(/@Input\s*\([^)]*\)\s*(?:public\s+|readonly\s+)?(?:set\s+)?(\w+)/g)) {
    inputs.add(m[1]);
  }

  const outputs = new Set();
  for (const m of source.matchAll(/@Output\s*\([^)]*\)\s*(?:public\s+|readonly\s+)?(\w+)/g)) {
    outputs.add(m[1]);
  }

  return {
    file: path.relative(ROOT, filePath),
    className: classMatch[1],
    selector: selectorMatch ? selectorMatch[1] : null,
    inputs,
    outputs,
  };
}

const contracts = readContracts();
const contractsByClass = new Map(Object.entries(contracts).map(([key, c]) => [c.name, { key, ...c }]));
const sources = listComponentFiles(COMPONENTS_DIR).map(parseComponent).filter(Boolean);
const sourcesByClass = new Map(sources.map((s) => [s.className, s]));

// ── Tests ────────────────────────────────────────────────────────────────────

test('every component exported from the public API has an MCP contract', () => {
  const publicApi = fs.readFileSync(PUBLIC_API_FILE, 'utf8');
  const exportedComponentFiles = [...publicApi.matchAll(/from '\.\/(components\/[^']+)'/g)]
    .map((m) => m[1])
    .filter((p) => p.endsWith('.component'));

  const missing = [];
  for (const rel of exportedComponentFiles) {
    const parsed = sourcesByClass.get(
      sources.find((s) => s.file === path.join('src', `${rel}.ts`))?.className
    );
    if (!parsed) continue;
    if (!contractsByClass.has(parsed.className)) missing.push(parsed.className);
  }

  assert.deepEqual(
    missing,
    [],
    `public but undocumented — an agent told to verify against contracts.json cannot use these: ${missing.join(', ')}`
  );
});

test('every contract points at a component that exists', () => {
  const orphans = [...contractsByClass.keys()].filter((name) => !sourcesByClass.has(name));
  assert.deepEqual(orphans, [], `contracts describe components with no source: ${orphans.join(', ')}`);
});

test('contract selectors match the component decorators', () => {
  const mismatched = [];
  for (const [className, contract] of contractsByClass) {
    const source = sourcesByClass.get(className);
    if (!source) continue;
    if (source.selector !== contract.selector) {
      mismatched.push(`${className}: contract "${contract.selector}" vs source "${source.selector}"`);
    }
  }
  assert.deepEqual(mismatched, []);
});

test('contract props match the @Input surface exactly', () => {
  const problems = [];

  for (const [className, contract] of contractsByClass) {
    const source = sourcesByClass.get(className);
    if (!source) continue;

    const declared = new Set(Object.keys(contract.props ?? {}));

    for (const input of source.inputs) {
      if (!declared.has(input)) {
        problems.push(`${className}.${input} is an @Input but is missing from the contract`);
      }
    }
    for (const prop of declared) {
      if (!source.inputs.has(prop)) {
        problems.push(`${className}.${prop} is in the contract but is not an @Input`);
      }
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
});

test('contract events match the @Output surface exactly', () => {
  const problems = [];

  for (const [className, contract] of contractsByClass) {
    const source = sourcesByClass.get(className);
    if (!source) continue;

    const declared = new Set(Object.keys(contract.events ?? {}));

    for (const output of source.outputs) {
      if (!declared.has(output)) {
        problems.push(`${className}.${output} is an @Output but is missing from the contract`);
      }
    }
    for (const event of declared) {
      if (!source.outputs.has(event)) {
        problems.push(`${className}.${event} is in the contract but is not an @Output`);
      }
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
});

test('every contract carries the metadata an agent needs to choose a component', () => {
  const problems = [];

  for (const [className, contract] of contractsByClass) {
    if (!contract.description) problems.push(`${className}: missing description`);
    if (!contract.stability) problems.push(`${className}: missing stability`);
    if (!contract.since) problems.push(`${className}: missing since`);

    for (const [prop, meta] of Object.entries(contract.props ?? {})) {
      if (!meta.description) problems.push(`${className}.${prop}: missing description`);
      if (!meta.type) problems.push(`${className}.${prop}: missing type`);
      if (meta.control === 'select' && !Array.isArray(meta.options)) {
        problems.push(`${className}.${prop}: select control without options`);
      }
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
});

test('the exported contracts.json artifact is in sync with mcp.ts', (t) => {
  const artifactPath = path.join(ROOT, 'mcp', 'contracts.json');
  if (!fs.existsSync(artifactPath)) {
    t.skip('mcp/contracts.json not generated yet — run npm run mcp:contracts');
    return;
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const artifactByName = new Map(artifact.components.map((c) => [c.name, c]));

  const problems = [];
  for (const [className, contract] of contractsByClass) {
    const exported = artifactByName.get(className);
    if (!exported) {
      problems.push(`${className} is missing from mcp/contracts.json — regenerate it`);
      continue;
    }
    const declared = Object.keys(contract.props ?? {}).sort();
    const shipped = Object.keys(exported.props ?? {}).sort();
    if (declared.join(',') !== shipped.join(',')) {
      problems.push(`${className}: props differ between mcp.ts and contracts.json`);
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join('\n  ')}\n`);
});
