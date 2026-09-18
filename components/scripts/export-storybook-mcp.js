'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX_FILE = path.join(ROOT, 'storybook-static', 'index.json');
const MCP_TS_FILE = path.join(ROOT, 'src', 'storybook', 'mcp.ts');
const OUT_DIR = path.join(ROOT, 'mcp');
const OUT_FILE = path.join(OUT_DIR, 'contracts.json');

function readContractsFromTs() {
  const source = fs.readFileSync(MCP_TS_FILE, 'utf8');
  const match = source.match(
    /const contracts:\s*Record<ComponentContractKey, ComponentContract>\s*=\s*(\{[\s\S]*?\n\});\n\nexport function getMcpContract/
  );

  if (!match) {
    throw new Error('Unable to locate contracts object in src/storybook/mcp.ts');
  }

  // Contracts object contains plain JS-compatible literals.
  return Function(`"use strict"; return (${match[1]});`)();
}

function groupStoriesByTitle(indexEntries) {
  const byTitle = {};

  for (const entry of Object.values(indexEntries)) {
    if (!entry || entry.type !== 'story') continue;
    if (!byTitle[entry.title]) byTitle[entry.title] = [];

    byTitle[entry.title].push({
      id: entry.id,
      name: entry.name,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      importPath: entry.importPath,
      componentPath: entry.componentPath,
    });
  }

  return byTitle;
}

function toStorybookTitle(contract) {
  const componentName = contract.name.replace(/Component$/, '');
  return `Components/${componentName}`;
}

function buildOutput(contracts, entries) {
  const storiesByTitle = groupStoriesByTitle(entries);

  const components = Object.entries(contracts).map(([key, contract]) => {
    const title = toStorybookTitle(contract);
    return {
      key,
      title,
      selector: contract.selector,
      name: contract.name,
      description: contract.description,
      stability: contract.stability,
      since: contract.since,
      props: contract.props,
      events: contract.events ?? {},
      stories: storiesByTitle[title] ?? [],
    };
  });

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      storybookIndex: path.relative(ROOT, INDEX_FILE),
      metadata: path.relative(ROOT, MCP_TS_FILE),
    },
    components,
  };
}

function main() {
  if (!fs.existsSync(INDEX_FILE)) {
    throw new Error('storybook-static/index.json not found. Run `npm run build-storybook` first.');
  }

  const indexJson = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  const contracts = readContractsFromTs();
  const output = buildOutput(contracts, indexJson.entries ?? {});

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  console.log(`[mcp] Exported ${output.components.length} component contracts to ${path.relative(ROOT, OUT_FILE)}`);
}

main();
