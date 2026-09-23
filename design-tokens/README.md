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
@import '@jablonowski/dsb-tokens/css';                /* everything but the raw palette */
```

```scss
@use '@jablonowski/dsb-tokens/scss' as tokens;        /* everything but the raw palette */
```

```js
import decisions from '@jablonowski/dsb-tokens/json'; /* decisions tree */
```

The CSS and SCSS entry points also declare the component layer the library needs at
runtime — see below. What you write against is **tier 2 — decisions**: `--ds-decisions-color-text-primary`,
`--ds-decisions-space-md`, `--ds-decisions-size-control-md`. 137 of them. They are named
for what they mean, not what they look like, which is the only reason a colour or a
spacing step can be changed centrally without a search-and-replace across every app.

## The distribution boundary

Tier 1 — the raw palette, `color.options.neutral.900`, `space.options.16` — is **not**
published in any form an application can reach. That is the boundary, and it is the whole
of it.

An app that reaches into the palette has hard-coded a hex value with extra steps: the name
says nothing about intent, so nothing can be re-themed later. `exports` enforces this.
`@jablonowski/dsb-tokens/dist/json/tokens.json` does not resolve — Node refuses subpaths
that are not exported, so a deep import fails at build time rather than working until
someone notices.

### Tier 3 is in the public stylesheet, on purpose

`--ds-component-button-primary-background` and its 214 siblings are in `./css`. They have
to be. A component's compiled CSS reads them and defines none of them:

```css
/* inside @jablonowski/dsb-components */
.btn--primary { background: var(--ds-component-button-primary-background); }

/* declared here, in this package */
--ds-component-button-primary-background: var(--ds-decisions-color-action-primary-background);
```

Ship the stylesheet without them and every one of those declarations is discarded by the
browser. The components render with no spacing, no control heights and no colour — which
is exactly the failure the boundary exists to prevent, delivered by the boundary itself.

Tier 3 carries no values. It is 215 pointers into tier 2, which is why publishing it
reveals nothing the decisions layer does not already state — only which component uses
which decision.

**"Private" means do not author against it, not "absent at runtime".** Those are different
claims, and conflating them ships a package that cannot render.

So: do not write `var(--ds-component-*)` in your application. It will work, which is the
problem — you will have tied your code to a decision the component's owner is free to
repoint without telling you, and nothing will warn you when they do. Use the decisions
layer, and if it cannot express what you need, that is a gap worth an issue.

| Export | Contains | For |
|---|---|---|
| `./css`, `./scss` | decisions + component, no palette | applications, and the component library |
| `./css/full`, `./scss/full` | all three tiers | building this design system itself |
| `./json` | decisions only | reasoning about the semantic layer |
| `./json/full` | all three tiers | tooling that needs the whole graph |

`./json` stays decisions-only because nothing renders from JSON. It is a surface for
writing code against, not one a browser resolves.

**Be clear about what this boundary is.** It is a contract with a build-time check behind
it, not a sandbox. Once the tarball is in your `node_modules`, a CSS path or four lines of
`fs` will read anything in it. A boundary you can step over on purpose is still worth
having: it makes the supported surface obvious, it fails the accidental case, and it gives
a reviewer something to point at. It is not a wall, and calling it one would be dishonest.

## Agent usage

`@jablonowski/dsb-tokens-mcp` answers "which token expresses this intent" over MCP, and
returns tier 2 or refuses. See that package for setup.

## Contents of the tarball

```
dist/css/variables.css    all tiers               (./css/full)
dist/css/public.css       decisions + component   (./css)
dist/scss/_variables.scss all tiers               (./scss/full)
dist/scss/_public.scss    decisions + component   (./scss)
dist/json/tokens.json     all tiers    (./json/full)
dist/json/decisions.json  decisions    (./json)
dist/js/tokens.js         decisions    (.)
dist/ts/tokens.d.ts       types        (.)
```

The authoring source (`tokens/tokens.json`) and the Figma export (`figma/`) are **not**
published. They are build inputs and a design hand-off; they live in the repository.
