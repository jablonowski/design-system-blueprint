# CI and release

[← docs index](start.md)

## Verify — every push and pull request

[`verify.yml`](../.github/workflows/verify.yml)

Runs the browser-free half of the suite: token schema and tier boundaries, Token MCP
contract, strict raw-value lint, component API contract, unit tests, `llms.txt` generation.

Before this existed the publish workflows were the only CI, and they are manual — which
means every gate in the repository was opt-in at release time, the point in the process
where a red build is most expensive and most likely to be waved through.

## Publish Tokens

[`publish-tokens.yml`](../.github/workflows/publish-tokens.yml)

1. Validate tokens JSON syntax
2. Validate token schema and tier boundaries
3. Token MCP contract tests
4. Build tokens
5. Test CSS outputs
6. Verify the public surface leaks no raw options
7. Publish `@jablonowski/dsb-tokens` to npm

The published tarball carries `dist/` and the README, and nothing else. The authoring
source and the Figma export are build inputs and a design hand-off — they stay in the
repository. `test/distribution.test.js` asserts the packed file list, so adding one back
has to be deliberate.

## Publish Token MCP

[`publish-tokens-mcp.yml`](../.github/workflows/publish-tokens-mcp.yml)

1. Contract, packaging and wire-surface tests
2. Refuse to publish a token snapshot that differs from the source
3. Publish `@jablonowski/dsb-tokens-mcp` to npm

## Publish Components

[`publish-components.yml`](../.github/workflows/publish-components.yml)

1. Static gates — strict raw-value lint + API contract test
2. Unit tests
3. Build Storybook (shared artifact)
4. Accessibility tests
5. Visual regression (fails if no baselines are committed)
6. UI interaction tests
7. Build and publish `@jablonowski/dsb-components` to npm

## Publish All

[`publish-all.yml`](../.github/workflows/publish-all.yml) — tokens first; the Token MCP and
the components both wait for the token publish to succeed; then the `llms.txt` artifact.

## Generate Visual Baselines

[`visual-baseline.yml`](../.github/workflows/visual-baseline.yml) — manual. Regenerates
Lost Pixel baselines on the CI image and opens a PR for review. See
[Visual regression](visual-regression.md).

## Publishing notes

- Workflows require an npm authentication token in the GitHub environment/secrets
- Patch version is auto-calculated from the currently published npm version
- All workflows use `npm ci`, and both lockfiles are committed — the published artifact is
  reproducible from this repository

## Using local token changes before publish

```bash
cd design-tokens
npm run build

cd ../components
npm install ../design-tokens
npm run build-storybook
npm run build
```
