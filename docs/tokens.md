# Design tokens

[← docs index](start.md)

One source file, three tiers, and a distribution boundary that holds because of what the
package contains rather than because of what a document asks for.

## Three-tier architecture

| Tier | Namespace | Role | Valid in application code |
|------|-----------|------|---------------------------|
| 1 | `color.options.*`, `space.options.*`, `size.options.*`, `layout.options.*`, … | Raw values | No |
| 2 | `decisions.*` | Semantic decisions, named by intent | **Yes — only these** |
| 3 | `component.*` | Component-scoped, private to the library | No |

Tier 2 covers colour (text, surface, border, **action**, feedback, overlay), typography
(size, weight, line height, tracking), spacing, element size, layout width, radius, border
width, shadow, motion, opacity and z-index.

`decisions.color.action.*` is the family a button-like element resolves to. It exists
because without it a primary button's background has nowhere to point but a *text* colour
decision — an alias that builds fine, looks fine, and teaches every consumer the wrong
thing about the system.

## Tier boundaries are enforced

[`design-tokens/scripts/validate-schema.js`](../design-tokens/scripts/validate-schema.js)
fails the build when:

- a reference does not resolve to an existing token
- a tier 2 token references anything other than tier 1
- a tier 3 token references anything other than tier 2

That is the architectural half. The distribution half is next.

## The public token surface

Two artifacts are built per platform:

| Artifact | Contents | Who imports it |
|----------|----------|----------------|
| `dist/css/variables.css` | Everything, with `var()` references preserved | The component library (it needs tier 3) |
| `dist/css/public.css` | Tier 2 only, values resolved | Consumer applications |

The same split exists for SCSS (`_variables.scss` / `_public.scss`) and JSON
(`tokens.json` / `decisions.json`). Consumers import the public entry point and are
therefore *unable* to reach a raw option, rather than merely being asked not to:

```js
import '@jablonowski/dsb-tokens/css';        // decisions only
import '@jablonowski/dsb-tokens/css/full';   // everything, for the library itself
```

The token release pipeline greps `public.css` for `-options-` and fails if the boundary
ever leaks.

All five platforms share the `ds` prefix. One source of truth that emits three different
naming conventions is three sources of truth wearing a disguise.

> The boundary is a contract with a build-time check behind it, not a sandbox. What that
> does and does not stop is in [Known caveats](caveats.md).

## Important files

- Source token JSON: [`design-tokens/tokens/tokens.json`](../design-tokens/tokens/tokens.json)
- Style Dictionary config: [`design-tokens/config.js`](../design-tokens/config.js)
- JSON syntax validation: [`design-tokens/scripts/validate-json.js`](../design-tokens/scripts/validate-json.js)
- Schema and tier validation: [`design-tokens/scripts/validate-schema.js`](../design-tokens/scripts/validate-schema.js)
- Output assertions: [`design-tokens/test/tokens.test.js`](../design-tokens/test/tokens.test.js)
- Figma export generator: [`design-tokens/scripts/generate-figma-tokens.js`](../design-tokens/scripts/generate-figma-tokens.js)

## Run locally

```bash
cd design-tokens
npm run ci       # lint + schema + build + output tests
```

---

Next: [Figma sync](figma-sync.md) — how the design file is kept in step, and why it is the
generated side of that relationship.
