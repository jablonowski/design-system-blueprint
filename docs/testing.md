# Testing

[← docs index](start.md)

Seven layers, each catching something the others cannot.

| Layer | Command | Catches | Needs a browser |
|-------|---------|---------|-----------------|
| Token input/output | `npm run ci` (design-tokens) | Malformed tokens, broken references, tier violations, wrong build output | No |
| Token MCP contract | `npm test` (tokens-mcp) | The resolver guessing, crossing tiers, or citing a false precedent | No |
| Raw value guard | `npm run lint:raw-values:strict` | Hardcoded design values in component source | No |
| Component API contract | `npm run test:contracts` | Agent-facing metadata drifting from the Angular source | No |
| Unit tests | `npm run test:unit` | Component logic and DOM contracts | No |
| Accessibility | `npm run test:a11y` | WCAG violations in every story | Yes |
| Interactions | `npm run test:interactions` | Behaviour: play functions per story | Yes |
| Visual regression | `npm run test:visual` | Unintended pixel changes | Yes |

The browser-free rows are what `npm run verify` runs from the repository root, and what CI
runs on every push and pull request.

## A. Tokens

```bash
cd design-tokens && npm run ci
```

Lint, schema and tier validation, build, and assertions on the CSS output. See
[Design tokens](tokens.md).

## B. Token MCP contract

```bash
cd tokens-mcp && npm test
```

Asserts the guarantees in
[`design-tokens/token-mcp-contract.md`](../design-tokens/token-mcp-contract.md). The
negative cases matter more than the positive ones: the failure mode this server exists to
prevent is a confident wrong answer, not a missing one. See [Token MCP](token-mcp.md).

## C. Static gates and unit tests

```bash
cd components
npm run lint:raw-values:strict   # 0 errors, 0 warnings
npm run test                     # unit tests + API contract test
```

Unit tests run on Jest + jsdom — no browser binary, so they behave identically on a laptop
and on a CI runner.

## D. Storybook accessibility tests

Terminal A:

```bash
cd components && npm run storybook
```

Terminal B:

```bash
cd components
npx playwright install chromium
npm run test:a11y
```

axe runs against every story by default. Per-story opt-out:
`parameters: { a11y: { disable: true } }`. There are currently zero opt-outs.

## E. Storybook interaction tests

```bash
cd components
npm run test:interactions
```

Every component has at least one `play()` function.

## F. Visual regression

```bash
cd components
npm run build-storybook
npm run test:visual
```

Lost Pixel, with two rules about baselines that are easy to get wrong —
[Visual regression](visual-regression.md).
