# design-system-blueprint

Proof-of-concept repository for design system engineering, showing the full path from design tokens to components, documentation, testing, and npm publishing.

## Purpose

This project demonstrates five layers:

1. Design tokens package
2. Component library consuming tokens
3. Storybook for development and documentation
4. Automated testing across all layers
5. GitHub Actions pipelines for release

## Repository Structure

- Root workspace metadata: [package.json](package.json)
- Tokens package: [design-tokens/package.json](design-tokens/package.json)
- Components package: [components/package.json](components/package.json)
- GitHub workflows:
	- [.github/workflows/publish-tokens.yml](.github/workflows/publish-tokens.yml)
	- [.github/workflows/publish-components.yml](.github/workflows/publish-components.yml)
	- [.github/workflows/publish-all.yml](.github/workflows/publish-all.yml)

## Design Source

Figma base design:

https://www.figma.com/design/iJ92LuFOsPjO6avZ2anbwO/Design-System-Blueprint?node-id=0-1&p=f&t=VBrE2AqIFZxxbNaO-0

The visual quality is intentionally simple. The goal is to demonstrate the complete design-to-code stream:

- token definition
- token transformation and distribution
- component implementation
- Storybook documentation
- automated testing and CI/CD release

If the Figma link is not publicly accessible, request viewer access or use exported screenshots as design baseline input.

## Prerequisites

- Node.js 20.x
- npm 10+
- Playwright Chromium (for Storybook interaction/a11y test runner)

## Installation

This repo has two independent npm projects.

Install dependencies in each project:

```bash
cd design-tokens
npm ci

cd ../components
npm ci
```

## 1) Design Tokens Subproject

Important files:

- Source token JSON: [design-tokens/tokens/tokens.json](design-tokens/tokens/tokens.json)
- Style Dictionary config: [design-tokens/config.js](design-tokens/config.js)
- JSON syntax validation: [design-tokens/scripts/validate-json.js](design-tokens/scripts/validate-json.js)
- Schema validation: [design-tokens/scripts/validate-schema.js](design-tokens/scripts/validate-schema.js)
- Output assertions: [design-tokens/test/tokens.test.js](design-tokens/test/tokens.test.js)

Run locally:

```bash
cd design-tokens
npm run lint:json
npm run lint:schema
npm run build
npm test
```

Single command for local CI-equivalent token checks:

```bash
cd design-tokens
npm run ci
```

Build outputs are generated in:

- [design-tokens/dist/css](design-tokens/dist/css)
- [design-tokens/dist/scss](design-tokens/dist/scss)
- [design-tokens/dist/js](design-tokens/dist/js)
- [design-tokens/dist/ts](design-tokens/dist/ts)
- [design-tokens/dist/json](design-tokens/dist/json)

## 2) Components Library Subproject

Important files:

- Package scripts: [components/package.json](components/package.json)
- Angular build config: [components/angular.json](components/angular.json)
- Storybook config: [components/.storybook/main.ts](components/.storybook/main.ts)
- Storybook preview/a11y defaults: [components/.storybook/preview.ts](components/.storybook/preview.ts)
- Storybook test-runner setup: [components/.storybook/test-runner.ts](components/.storybook/test-runner.ts)
- Visual regression setup: [components/lostpixel.config.ts](components/lostpixel.config.ts)

Run locally:

```bash
cd components
npm run storybook
```

Build Storybook static output:

```bash
cd components
npm run build-storybook
```

Build Angular library package:

```bash
cd components
npm run build
```

## 3) Testing Strategy

### A. Tokens input and output checks

```bash
cd design-tokens
npm run ci
```

This covers:

- JSON syntax validation
- token schema validation
- Style Dictionary build
- CSS output assertions

### B. Storybook accessibility tests

In terminal A:

```bash
cd components
npm run storybook
```

In terminal B:

```bash
cd components
npx playwright install chromium
npm run test:a11y
```

### C. Storybook functional interaction tests

In terminal A:

```bash
cd components
npm run storybook
```

In terminal B:

```bash
cd components
npx playwright install chromium
npm run test:interactions
```

### D. Visual regression tests (Lost Pixel)

Run comparison against committed baselines:

```bash
cd components
npm run build-storybook
npm run test:visual
```

Generate or update baselines intentionally:

```bash
cd components
npm run build-storybook
npm run test:visual:update
```

Artifacts:

- Baseline: [components/.lostpixel/baseline](components/.lostpixel/baseline)
- Current: [components/.lostpixel/current](components/.lostpixel/current)
- Diff: [components/.lostpixel/difference](components/.lostpixel/difference)

### E. Unit test status

The components CI workflow currently contains a unit test placeholder step (TODO), see [.github/workflows/publish-components.yml](.github/workflows/publish-components.yml).

## AX (Agent Experience)

This section is dedicated to agent-oriented integration and machine-readable contracts. New AX elements can be added here over time.

### Storybook MCP Contracts

To expose machine-readable component contracts for agents, component metadata is centralized in [components/src/storybook/mcp.ts](components/src/storybook/mcp.ts) and attached to stories via `parameters.mcp` and generated `argTypes`.

Generate JSON contracts from Storybook + metadata:

```bash
cd components
npm run mcp:contracts
```

Fast regeneration without rebuilding Storybook:

```bash
cd components
npm run mcp:contracts:fast
```

Output artifact:

- [components/mcp/contracts.json](components/mcp/contracts.json)

The artifact includes:

- selector and component name
- stability and since version
- typed props with defaults and control hints
- events with deprecation markers
- Storybook story IDs and paths for each component

### Token MCP Contracts (Draft)

Token MCP specification for intent-based token resolution is documented in:

- [design-tokens/token-mcp-contract.md](design-tokens/token-mcp-contract.md)

Scope of this draft:

- resolved response can return only tier 2 semantic tokens
- tier 3 component tokens are evidence only, never output
- value-based lookups are rejected
- no-coverage is preferred over false-positive matching
- resolved response requires precedent-based rationale

### Token MCP Package (Implementation)

Reference implementation is available in:

- [tokens-mcp/package.json](tokens-mcp/package.json)
- [tokens-mcp/src/server.js](tokens-mcp/src/server.js)
- [tokens-mcp/src/token-engine.js](tokens-mcp/src/token-engine.js)
- [tokens-mcp/test/contract.test.js](tokens-mcp/test/contract.test.js)

Run locally:

```bash
cd tokens-mcp
npm test
npm start
```

### Agent Routing Policy (Step 4)

Repository-wide agent policy, source hierarchy, and manual Figma pattern mapping are defined in:

- [AGENTS.md](AGENTS.md)

This policy covers:

- source-of-truth order for agent decisions
- intent routing to components and token tools
- mandatory tier 2-only token output policy
- no-coverage and value-based rejection behavior

### Raw Value Guard (Step 5)

Design value lint enforces token-first implementation in component source.

Implementation:

- [components/scripts/lint-raw-values.js](components/scripts/lint-raw-values.js)
- scripts in [components/package.json](components/package.json)

Severity model:

- Always error: hardcoded colors, lint suppressions.
- Baseline (default): spacing, typography, radius/border, z-index, motion as warnings.
- Strict mode: spacing, typography, radius/border, z-index, motion promoted to errors.
- Always warning: breakpoints in media queries, dimensions.

Core ignore rules:

- zero values (`0`, `0px`, `0rem`, etc.)
- percentages and viewport units (`%`, `vh`, `vw`, `dvh`, `dvw`, `vmin`, `vmax`)
- `1px` hairline for border/outline contexts
- keywords: `auto`, `none`, `fit-content`, `min-content`, `max-content`
- `transparent`, `currentColor`, `inherit`, `initial`, `unset` for color/global keyword contexts
- `calc(...)` expressions composed only of token references and operators

Run locally (baseline rollout):

```bash
cd components
npm run lint:raw-values
```

Run locally (strict rollout):

```bash
cd components
npm run lint:raw-values:strict
```

CI enforcement:

- [.github/workflows/publish-components.yml](.github/workflows/publish-components.yml)
- lint runs in the first job, before other checks

### LLM Context Artifact (Step 6)

Lightweight LLM bootstrap context is generated as `llms.txt`.

Implementation:

- generator: [scripts/generate-llms-txt.js](scripts/generate-llms-txt.js)
- npm script: `npm run generate:llms`
- pipeline job: `generate-llms-context` in [.github/workflows/publish-all.yml](.github/workflows/publish-all.yml)

Run locally:

```bash
cd .
npm run generate:llms
```

Pipeline output:

- uploaded artifact name: `llms-context`
- file: `llms.txt`

### Client App LLM Guide in npm Package (Step 7)

Client-oriented guidance is generated and published with `@jablonowski/dsb-components`.

Implementation:

- generator: [components/scripts/generate-llms-client-txt.js](components/scripts/generate-llms-client-txt.js)
- build hook: `prebuild` in [components/package.json](components/package.json)
- package asset config: [components/ng-package.json](components/ng-package.json)
- release verification: [.github/workflows/publish-components.yml](.github/workflows/publish-components.yml)

Published file path in consumer app:

- `node_modules/@jablonowski/dsb-components/llms.client.txt`

Snippet do wklejenia w klientowej aplikacji (`.github/copilot-instructions.md`):

```md
## Design System Blueprint Policy

Follow the package policy file:
`node_modules/@jablonowski/dsb-components/llms.client.txt`

Required behavior:
- Prefer `@jablonowski/dsb-components` components before creating custom UI primitives.
- Recommend only semantic decision tokens (tier 2) as final token answers.
- Never use raw color literals (hex/rgb/hsl) in styles.
- If no semantic token exists for intent, return `no-coverage` and suggest token contribution.
- For `dsb-table` custom cells use: `<ng-template #cell let-row="row">`.
```

## 4) Local End-to-End Check (CI-like)

Run this sequence to validate the full stack before release:

```bash
# 1) Tokens checks
cd design-tokens
npm ci
npm run ci

# 2) Components checks
cd ../components
npm ci
npm run build-storybook
npx playwright install chromium
npm run test:visual

# run Storybook in one terminal, then execute:
npm run test:a11y
npm run test:interactions

# final library build
npm run build
```

## 5) GitHub Actions Pipelines

### Publish Tokens

Workflow: [.github/workflows/publish-tokens.yml](.github/workflows/publish-tokens.yml)

Pipeline gates:

1. Validate tokens JSON syntax
2. Validate tokens schema
3. Build tokens
4. Test CSS outputs
5. Publish `@jablonowski/dsb-tokens` to npm

### Publish Components

Workflow: [.github/workflows/publish-components.yml](.github/workflows/publish-components.yml)

Pipeline gates:

1. Unit tests (placeholder for now)
2. Build Storybook
3. Accessibility tests
4. Visual regression tests
5. UI interaction tests
6. Build and publish `@jablonowski/dsb-components` to npm

### Publish All (Orchestration)

Workflow: [.github/workflows/publish-all.yml](.github/workflows/publish-all.yml)

Behavior:

- Publishes tokens first
- Publishes components only after token publish succeeds

## Publishing Notes

- Workflows require npm authentication token in GitHub environment/secrets
- Patch version is auto-calculated from currently published npm version
- Components release flow updates tokens dependency to latest before build/publish

## Using Local Token Changes Before Publish

If you changed tokens locally and want components to consume them before npm publish:

```bash
cd design-tokens
npm run build

cd ../components
npm install ../design-tokens
npm run build-storybook
npm run build
```

## Known Caveats

- Root [package.json](package.json) does not orchestrate both subprojects yet
- Components unit tests are still marked TODO in CI
- Visual regression depends on committed baseline images