# @jablonowski/dsb-tokens

Three-tier design tokens: raw options → semantic decisions → component tokens.

```bash
npm install @jablonowski/dsb-tokens
```

## What you import

```js
import tokens from '@jablonowski/dsb-tokens';        // typed decision values
```

```css
@import '@jablonowski/dsb-tokens/css';                /* --ds-decisions-* only */
```

```scss
@use '@jablonowski/dsb-tokens/scss' as tokens;        /* $ds-decisions-* only */
```

```js
import decisions from '@jablonowski/dsb-tokens/json'; /* decisions tree */
```

Every one of those gives you **tier 2 — decisions**: `--ds-decisions-color-text-primary`,
`--ds-decisions-space-md`, `--ds-decisions-size-control-md`. 137 of them. They are named
for what they mean, not what they look like, which is the only reason a colour or a
spacing step can be changed centrally without a search-and-replace across every app.

## The distribution boundary

Tier 1 (`color.options.neutral.900`, `space.options.16`) and tier 3
(`component.button.primary.background`) are **not** part of this package's public surface.

- Tier 1 is a palette. An app that reaches into it has hard-coded a hex value with extra
  steps: the name says nothing about intent, so nothing can be re-themed later.
- Tier 3 is the internals of components you did not write. Using
  `component.button.primary.background` in your own card couples your card to a decision
  the button owner is free to change without telling you.

The `exports` map is what enforces this. `@jablonowski/dsb-tokens/dist/json/tokens.json`
does not resolve — Node refuses subpaths that are not exported, so a deep import fails at
build time rather than working until someone notices.

Two artifacts do carry all three tiers, and they are exported deliberately:

| Export | Contains | Who it is for |
|---|---|---|
| `./css/full`, `./scss/full` | all three tiers | the component library in this repository |
| `./json/full` | all three tiers | tooling that has to reason about the whole graph |

**Be clear about what this boundary is.** It is a contract with a build-time check behind
it, not a sandbox. Once the tarball is in your `node_modules`, a CSS path, a bundler
config or four lines of `fs` will read anything in it — this repository's own component
library loads `dist/css/variables.css` by path, because it needs tier 3 to build
components. A boundary you can step over on purpose is still worth having: it makes the
supported surface obvious, it fails the accidental case, and it gives a reviewer something
to point at. It is not a wall, and calling it one would be dishonest.

If your app needs a value that tier 2 does not express, that is a gap in the decisions
layer. Open an issue against this package. Reaching past it moves the gap into your
codebase, where nobody can see it.

## Agent usage

`@jablonowski/dsb-tokens-mcp` answers "which token expresses this intent" over MCP, and
returns tier 2 or refuses. See that package for setup.

## Contents of the tarball

```
dist/css/variables.css    all tiers    (./css/full)
dist/css/public.css       decisions    (./css)
dist/scss/_variables.scss all tiers    (./scss/full)
dist/scss/_public.scss    decisions    (./scss)
dist/json/tokens.json     all tiers    (./json/full)
dist/json/decisions.json  decisions    (./json)
dist/js/tokens.js         decisions    (.)
dist/ts/tokens.d.ts       types        (.)
```

The authoring source (`tokens/tokens.json`) and the Figma export (`figma/`) are **not**
published. They are build inputs and a design hand-off; they live in the repository.
