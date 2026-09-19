'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'llms.txt');
const CONTRACT_FILE = path.join(ROOT, 'components', 'mcp', 'contracts.json');
const TOKENS_FILE = path.join(ROOT, 'design-tokens', 'tokens', 'tokens.json');

function readContracts() {
  if (!fs.existsSync(CONTRACT_FILE)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(CONTRACT_FILE, 'utf8'));
    const items = Array.isArray(parsed.components) ? parsed.components : [];

    return items
      .map((item) => ({
        name: item.component || item.name || 'unknown',
        selector: item.selector || 'unknown',
        stability: item.stability || 'unknown',
      }))
      .filter((item) => item.name !== 'unknown' || item.selector !== 'unknown');
  } catch (error) {
    return [];
  }
}

/** Tier 2 families, read from the token source so this list cannot go stale. */
function readDecisionFamilies() {
  if (!fs.existsSync(TOKENS_FILE)) return [];

  try {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
    const decisions = tokens.decisions || {};
    const families = [];

    const walk = (node, trail) => {
      if (!node || typeof node !== 'object') return;
      if (typeof node.value === 'string') {
        // Family = the token's path without its leaf, capped at two levels:
        // color.text.primary -> color.text, space.xl -> space,
        // color.action.primary.background -> color.action.
        const family = trail.slice(0, -1).slice(0, 2).join('.');
        if (family) families.push(family);
        return;
      }
      for (const [key, child] of Object.entries(node)) {
        if (key === 'comment') continue;
        walk(child, [...trail, key]);
      }
    };

    walk(decisions, []);
    return [...new Set(families)].sort();
  } catch (error) {
    return [];
  }
}

function buildContent() {
  const contracts = readContracts();
  const families = readDecisionFamilies();

  const componentLines = contracts.length
    ? contracts.map((e) => `- ${e.name}: ${e.selector} (${e.stability})`).join('\n')
    : '- contracts unavailable (run `npm run mcp:contracts` in components/ first)';

  const familyLines = families.length
    ? families.map((f) => `- decisions.${f}.*`).join('\n')
    : '- token source unavailable';

  const lines = [
    '# Design System Blueprint - LLM Context',
    '',
    'Generated bootstrap context for coding assistants. Cheap to load, and enough to avoid',
    'the three mistakes an agent makes most often in this repository: recommending a raw',
    'value, recommending a private component token, and inventing a prop that does not exist.',
    '',
    '## Repository Scope',
    '- Monorepo with an Angular component library, design tokens, and MCP helpers.',
    '- Source of truth for agent policy: AGENTS.md',
    '',
    '## Decision Hierarchy (must follow)',
    '1. User request in the current task.',
    '2. AGENTS.md in the repository root.',
    '3. design-tokens/token-mcp-contract.md.',
    '4. tokens-mcp implementation and tests.',
    '5. components/mcp/contracts.json and components/src/storybook/mcp.ts.',
    '6. components source and stories.',
    '',
    'Levels 3-4 and 5-6 are co-normative: the document describes behaviour, the test asserts',
    'it. If they disagree, report the mismatch instead of picking a side.',
    '',
    '## Token Policy',
    '- Return only tier 2 `decisions.*` tokens as final recommendations.',
    '- Never return tier 1 (raw options) or tier 3 (`component.*`) as a final answer.',
    '- Tier 3 is precedent evidence only.',
    '- Value-based lookup is forbidden (hex, rgb, hsl, px, rem).',
    '- No coverage, or two candidates that fit equally well, means `no-coverage`. Do not guess',
    '  and do not fall back to `closestIntent`.',
    '- Tier boundaries are build-enforced: tier 2 may only reference tier 1, tier 3 only tier 2.',
    '',
    '## Tier 2 Families (the only valid answers)',
    familyLines,
    '',
    '`decisions.color.action.*` is what a button-like element resolves to. Do not describe an',
    'interactive surface with a `decisions.color.text.*` token.',
    '',
    '## Available Component Contracts',
    componentLines,
    '',
    '## Enforcement',
    '- Token schema and tier boundaries: design-tokens/scripts/validate-schema.js.',
    '- Raw value guard: components/scripts/lint-raw-values.js. Strict mode is the CI default',
    '  and currently passes with zero findings — keep it that way, and add the missing token',
    '  rather than a literal.',
    '- Component API contract: components/test/contracts.test.js asserts mcp.ts matches the',
    '  real @Input/@Output surface.',
    '- Token MCP contract: tokens-mcp/test/contract.test.js.',
    '- Every check above runs on push and pull request via .github/workflows/verify.yml.',
    '',
    '## Consuming Tokens From an Application',
    '- `@jablonowski/dsb-tokens/css` — tier 2 only. This is the entry point applications use.',
    '- `@jablonowski/dsb-tokens/css/full` — everything, for the component library itself.',
    '',
    '## Primary Entry Points',
    '- Token resolver: tokens-mcp/src/token-engine.js.',
    '- Token MCP server: tokens-mcp/src/server.js.',
    '- Storybook MCP metadata: components/src/storybook/mcp.ts.',
    '- Generated contracts: components/mcp/contracts.json.',
    '',
    '## Maintenance',
    '- Generated by scripts/generate-llms-txt.js.',
    '- Regenerate after contract, token or policy updates.',
    '',
  ];

  return lines.join('\n');
}

function main() {
  fs.writeFileSync(OUT_FILE, buildContent(), 'utf8');
  console.log(`Generated ${path.relative(ROOT, OUT_FILE)}.`);
}

main();
