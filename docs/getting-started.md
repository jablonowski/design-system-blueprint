# Getting started

[← docs index](start.md)

## Prerequisites

- Node.js 20.x
- npm 10+
- Playwright Chromium, for the Storybook interaction, accessibility and visual runners

## Install

This repository contains three independent npm projects. `tokens-mcp` has no dependencies.

```bash
npm run install:all
```

Or individually:

```bash
cd design-tokens && npm ci
cd ../components && npm ci
```

## One command to verify everything

```bash
npm run verify
```

Runs, in order: token lint and schema/tier validation, token build, CSS output assertions,
the Token MCP contract suite, the strict raw-value guard, the component API contract test,
component unit tests, and `llms.txt` generation.

Everything except the three browser-dependent suites, which need a Storybook build and a
browser — those are in [Testing](testing.md).

## Run each subproject

**Tokens**

```bash
cd design-tokens
npm run ci        # lint + schema + build + output tests
npm run build     # build only
```

**Components**

```bash
cd components
npm run storybook          # develop
npm run build-storybook    # static build
npm run build              # Angular library package
```

**Token MCP**

```bash
cd tokens-mcp
npm test
npm start
```

## Repository structure

| | |
|---|---|
| Root workspace metadata | [package.json](../package.json) |
| Tokens package | [design-tokens/package.json](../design-tokens/package.json) |
| Components package | [components/package.json](../components/package.json) |
| Token MCP server | [tokens-mcp/package.json](../tokens-mcp/package.json) |
| Agent policy | [AGENTS.md](../AGENTS.md) |
| Repository bootstrap for agents | [llms.txt](../llms.txt) |

Workflows:

- [verify.yml](../.github/workflows/verify.yml) — every push and pull request
- [publish-tokens.yml](../.github/workflows/publish-tokens.yml)
- [publish-tokens-mcp.yml](../.github/workflows/publish-tokens-mcp.yml)
- [publish-components.yml](../.github/workflows/publish-components.yml)
- [publish-all.yml](../.github/workflows/publish-all.yml)
- [visual-baseline.yml](../.github/workflows/visual-baseline.yml)

See [CI and release](ci-release.md) for what each one does.

## Design source

[Figma file](https://www.figma.com/design/iJ92LuFOsPjO6avZ2anbwO/Design-System-Blueprint?node-id=0-1&p=f&t=VBrE2AqIFZxxbNaO-0)

The visual quality is intentionally simple — the goal is to demonstrate the complete
design-to-code stream, not to win a design award. If the link is not publicly accessible,
request viewer access or use exported screenshots as the design baseline input.

The design file does not feed the token source; it is generated from it. See
[Figma sync](figma-sync.md).
