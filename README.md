# design-system-blueprint

Proof-of-concept repository for design system engineering, showing the full path from
design tokens to components, documentation, testing, agent-facing contracts, and npm
publishing.

## Purpose

This project demonstrates six layers:

1. Design tokens package with an enforced three-tier architecture
2. Component library consuming tokens
3. Storybook for development and documentation
4. Automated testing across all layers
5. Machine-readable contracts for coding agents (AX)
6. GitHub Actions pipelines for verification and release

## Repository Structure

- Root workspace metadata: [package.json](package.json)
- Tokens package: [design-tokens/package.json](design-tokens/package.json)
- Components package: [components/package.json](components/package.json)
- Token MCP server: [tokens-mcp/package.json](tokens-mcp/package.json)
- Agent policy: [AGENTS.md](AGENTS.md)
- GitHub workflows:
	- [.github/workflows/verify.yml](.github/workflows/verify.yml) — runs on every push and PR
	- [.github/workflows/publish-tokens.yml](.github/workflows/publish-tokens.yml)
	- [.github/workflows/publish-components.yml](.github/workflows/publish-components.yml)
	- [.github/workflows/publish-all.yml](.github/workflows/publish-all.yml)
	- [.github/workflows/visual-baseline.yml](.github/workflows/visual-baseline.yml)

## Design Source

Figma base design:

https://www.figma.com/design/iJ92LuFOsPjO6avZ2anbwO/Design-System-Blueprint?node-id=0-1&p=f&t=VBrE2AqIFZxxbNaO-0

The visual quality is intentionally simple. The goal is to demonstrate the complete
design-to-code stream, not to win a design award.

If the Figma link is not publicly accessible, request viewer access or use exported
screenshots as design baseline input.

## Prerequisites

- Node.js 20.x
- npm 10+
- Playwright Chromium (for the Storybook interaction, a11y and visual test runners)

## Installation

This repo contains three independent npm projects. `tokens-mcp` has no dependencies.

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
component unit tests, and the `llms.txt` generation. Everything except the three
browser-dependent suites, which need a Storybook build and a browser.

---

## 1) Design Tokens Subproject

### Three-tier architecture

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

### Tier boundaries are enforced

[design-tokens/scripts/validate-schema.js](design-tokens/scripts/validate-schema.js) fails
the build when:

- a reference does not resolve to an existing token
- a tier 2 token references anything other than tier 1
- a tier 3 token references anything other than tier 2

This is the architectural half of the firewall. The distribution half is below.

### The public token surface

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

### Figma is a generated view, not a second source

The design file carries the same three tiers as variable collections
(`01 / Options`, `02 / Decisions`, `03 / Components`). Keeping them in step used to be
somebody's memory, and it showed: an audit found the file behind the token source by
more than a hundred variables — a gap that had been widening since before the token
work started, because nothing checked.

So the Figma variable set is generated from `tokens.json`:

```bash
cd design-tokens
npm run generate:figma
```

Output, committed so a pull request shows exactly which variables the design file will
need:

- [design-tokens/figma/tokens.dtcg.json](design-tokens/figma/tokens.dtcg.json) — W3C DTCG,
  readable by Tokens Studio and the common variable-import plugins
- [design-tokens/figma/import-variables.js](design-tokens/figma/import-variables.js) —
  Figma Plugin API script. Idempotent, and by default it only creates what is missing;
  values of variables that already exist are left alone until you flip
  `OVERWRITE_EXISTING`
- [design-tokens/figma/report.md](design-tokens/figma/report.md) — what could not be
  represented and why

`npm test` fails when the committed export is behind `tokens.json`, so a token change
cannot merge while the design hand-off still describes the previous state. Variable names
match the convention already in the file, and a test pins the ones read off the live
Variables panel — get a name wrong and an import creates a parallel set beside the
originals instead of updating them.

Shadows, `em` tracking values and percentages are not exported: Figma variables hold
colour, number, string and boolean only. That is a limit of the target, not a gap in the
token set.

### Three measurements the audit left open, and how they were settled

Comparing the components against the design file turned up three differences. All three
are now decided, and the decision is recorded here rather than left as folklore.

**Form field gap: 5px in the design, 6px in code — 6 stands.**
The 5 was off the scale. Keeping it would mean the spacing scale has an exception on the
day it was introduced, and the next person would reasonably add a second one. Nothing
argues for 5 any more: the design file derives from these tokens now, so its old value
was a reading of the thing being generated, not an authority over it.

**Control heights: 33 and 37 in the design, 36 for both in code — 36 stands.**
The design's input was 33 tall and its select 37, both auto-height. That gap was not a
decision anybody made; it fell out of two different vertical paddings, 8 and 10, on
otherwise identical controls — same horizontal padding, same radius, same type size. An
input and a select sitting in one form row have to line up, so both now resolve through
`decisions.size.control.*`. Fixed heights rather than padding-driven ones, because a
fixed height is a thing a test can assert.

**Size variants exist in code but not in the design file.**
`sm | md | lg` has no counterpart in Figma, which documents one size per component and
varies only the state. After the variable import the *tokens* are there, so nothing is
blocked; what is missing is three frames per sized component. That is a drawing job, not
a token job, and it stays open deliberately — see the caveats at the end.

### Important files

- Source token JSON: [design-tokens/tokens/tokens.json](design-tokens/tokens/tokens.json)
- Figma export generator: [design-tokens/scripts/generate-figma-tokens.js](design-tokens/scripts/generate-figma-tokens.js)
- Style Dictionary config: [design-tokens/config.js](design-tokens/config.js)
- JSON syntax validation: [design-tokens/scripts/validate-json.js](design-tokens/scripts/validate-json.js)
- Schema and tier validation: [design-tokens/scripts/validate-schema.js](design-tokens/scripts/validate-schema.js)
- Output assertions: [design-tokens/test/tokens.test.js](design-tokens/test/tokens.test.js)

### Run locally

```bash
cd design-tokens
npm run ci       # lint + schema + build + output tests
```

---

## 2) Components Library Subproject

### Important files

- Package scripts: [components/package.json](components/package.json)
- Angular build config: [components/angular.json](components/angular.json)
- Storybook config: [components/.storybook/main.ts](components/.storybook/main.ts)
- Storybook preview / a11y defaults: [components/.storybook/preview.ts](components/.storybook/preview.ts)
- Storybook test-runner setup: [components/.storybook/test-runner.ts](components/.storybook/test-runner.ts)
- Unit test config: [components/jest.config.unit.js](components/jest.config.unit.js)
- Visual regression setup: [components/lostpixel.config.ts](components/lostpixel.config.ts)

### Run locally

```bash
cd components
npm run storybook          # develop
npm run build-storybook    # static build
npm run build              # Angular library package
```

---

## 3) Testing Strategy

Five layers, each catching something the others cannot.

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

### A. Tokens

```bash
cd design-tokens && npm run ci
```

### B. Token MCP contract

```bash
cd tokens-mcp && npm test
```

Asserts the guarantees in
[design-tokens/token-mcp-contract.md](design-tokens/token-mcp-contract.md). The negative
cases matter more than the positive ones: the failure mode this server exists to prevent
is a confident wrong answer, not a missing one.

### C. Static gates and unit tests

```bash
cd components
npm run lint:raw-values:strict   # 0 errors, 0 warnings
npm run test                     # unit tests + API contract test
```

Unit tests run on Jest + jsdom — no browser binary, so they behave identically on a laptop
and on a CI runner.

### D. Storybook accessibility tests

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

### E. Storybook interaction tests

```bash
cd components
npm run test:interactions
```

Every component has at least one `play()` function.

### F. Visual regression (Lost Pixel)

```bash
cd components
npm run build-storybook
npm run test:visual
```

**Baselines are committed to git, and they are generated in CI.** Two separate rules,
both load-bearing.

*Committed*, because Lost Pixel in OSS mode compares against files on disk — there is no
other store. A baseline that is not in the repository does not exist as far as CI is
concerned, and a visual gate with nothing to compare against passes everything. Documenting
how to generate one locally instead would mean every developer compares their machine
against their machine: green forever, protecting nothing. The comparison job therefore
fails outright when the baseline directory is empty.

*Generated in CI*, because font rasterisation differs enough between macOS and the CI
image to blow past any sane pixel threshold. A locally generated baseline produces
failures that have nothing to do with the change under review — which is how a visual gate
ends up permanently red and then permanently ignored. `npm run test:visual:update` refuses
to run outside CI rather than relying on this paragraph having been read.

And one ordering rule: **generate baselines from a branch that is already correct.** A
baseline taken while something renders wrongly makes the breakage the specification, and
the gate then defends it.

After an intentional visual change, run the **Generate Visual Baselines** workflow. It
renders on `ubuntu-latest` and opens a pull request with the new images for review — every
changed image in that diff is a design change being accepted as the new truth.

The baseline set is itself tested. `test/visual-baseline.test.js` derives the story ids
from source and fails when a story has no baseline, or a baseline has no story. Without it,
renaming a story quietly drops it out of the gate and leaves a dead image behind.

Artifacts:

- Baseline: [components/.lostpixel/baseline](components/.lostpixel/baseline) — committed
- Current and diff: generated, git-ignored

---

## AX (Agent Experience)

Machine-readable contracts for agents. This is the part of the repository that decides
whether an agent writing UI against this system produces correct code or plausible-looking
nonsense.

### Storybook MCP contracts

Component metadata is centralised in
[components/src/storybook/mcp.ts](components/src/storybook/mcp.ts) and attached to stories
via `parameters.mcp` and generated `argTypes`.

```bash
cd components
npm run mcp:contracts        # rebuild Storybook, then export
npm run mcp:contracts:fast   # export only
```

Output: [components/mcp/contracts.json](components/mcp/contracts.json) — selector,
component name, stability, since version, typed props with defaults and control hints,
events with deprecation markers, and Storybook story IDs.

That metadata is hand-written, and nothing in the build forces it to match the Angular
source. So [components/test/contracts.test.js](components/test/contracts.test.js) reads the
real `@Input`/`@Output` surface out of the components and asserts the metadata describes
exactly that surface — no missing props, no invented ones, selectors matching, every
public component documented, and the exported JSON in sync with its source. A contract for
agents without a contract test is documentation with better branding.

Sub-components (`dsb-list-item`, `dsb-accordion-item`) are documented too, and point at
their parent's stories for example usage. AGENTS.md routes to them, and the quality gate
says "confirm the component exists in contracts.json" — those two statements have to be
able to both be true.

### Token MCP

Specification: [design-tokens/token-mcp-contract.md](design-tokens/token-mcp-contract.md)
Implementation: [tokens-mcp/](tokens-mcp/)

```bash
cd tokens-mcp
npm test
npm start
```

Behaviour:

- resolved answers are always tier 2 `decisions.*` tokens
- tier 3 is precedent evidence only, mapped by direct alias — never by heuristic
- value-based lookups (hex, rgb, hsl, px, rem) are rejected
- four gates stand between a question and an answer: value, property family, vocabulary
  evidence, and ambiguity. Each one can only produce `rejected` or `no-coverage`

The point of the gates is that `no-coverage` is the *easy* path through the code. A
resolver that always answers is not a firewall, it is a hallucination with a schema.

### Agent routing policy

[AGENTS.md](AGENTS.md) defines the source-of-truth hierarchy, the token policy, the manual
Figma pattern map, and the quality gates an agent applies before answering.

### Raw value guard

Design value lint enforces token-first implementation in component source.

Implementation: [components/scripts/lint-raw-values.js](components/scripts/lint-raw-values.js)

Severity model:

- Always error: hardcoded colours, lint suppressions
- Baseline: spacing, typography, radius/border, z-index, motion as warnings
- Strict: the above promoted to errors
- Always warning: breakpoints in media queries, dimensions

```bash
cd components
npm run lint:raw-values          # baseline rollout
npm run lint:raw-values:strict   # strict — this is what CI runs, and it passes clean
```

`npm run lint` is strict. Strict mode currently reports **zero errors and zero warnings**:
every spacing, size, typography, radius, motion and z-index value in component source
resolves through a token. Where no token existed, the token was added rather than the rule
relaxed — a linter that reports findings nobody can fix is a linter nobody reads.

### LLM context artifacts

- Repository bootstrap: `llms.txt`, generated by
  [scripts/generate-llms-txt.js](scripts/generate-llms-txt.js) (`npm run generate:llms`)
- Client application guide: `llms.client.txt`, generated by
  [components/scripts/generate-llms-client-txt.js](components/scripts/generate-llms-client-txt.js)
  and published inside `@jablonowski/dsb-components`

Snippet for a client app's `.github/copilot-instructions.md`:

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

---

## 4) GitHub Actions Pipelines

### Verify (every push and pull request)

[.github/workflows/verify.yml](.github/workflows/verify.yml)

Runs the browser-free half of the suite: token schema and tier boundaries, Token MCP
contract, strict raw-value lint, component API contract, unit tests, `llms.txt` generation.

Before this existed the publish workflows were the only CI, and they are manual — which
means every gate in the repository was opt-in at release time, the point in the process
where a red build is most expensive and most likely to be waved through.

### Publish Tokens

[.github/workflows/publish-tokens.yml](.github/workflows/publish-tokens.yml)

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

### Publish Token MCP

[.github/workflows/publish-tokens-mcp.yml](.github/workflows/publish-tokens-mcp.yml)

1. Contract, packaging and wire-surface tests
2. Refuse to publish a token snapshot that differs from the source
3. Publish `@jablonowski/dsb-tokens-mcp` to npm

The resolver carries its own copy of the token source, because it needs the reference
strings and comments that the build output no longer has, and because the token package
deliberately stops shipping that source to consumers.

### Publish Components

[.github/workflows/publish-components.yml](.github/workflows/publish-components.yml)

1. Static gates — strict raw-value lint + API contract test
2. Unit tests
3. Build Storybook (shared artifact)
4. Accessibility tests
5. Visual regression (fails if no baselines are committed)
6. UI interaction tests
7. Build and publish `@jablonowski/dsb-components` to npm

### Publish All

[.github/workflows/publish-all.yml](.github/workflows/publish-all.yml) — tokens first;
the Token MCP and the components both wait for the token publish to succeed; then the
`llms.txt` artifact.

### Generate Visual Baselines

[.github/workflows/visual-baseline.yml](.github/workflows/visual-baseline.yml) — manual,
regenerates Lost Pixel baselines on the CI image and opens a PR for review.

## Publishing Notes

- Workflows require an npm authentication token in the GitHub environment/secrets
- Patch version is auto-calculated from the currently published npm version
- All workflows use `npm ci`, and both lockfiles are committed — the published artifact is
  reproducible from this repository

## Using Local Token Changes Before Publish

```bash
cd design-tokens
npm run build

cd ../components
npm install ../design-tokens
npm run build-storybook
npm run build
```

## Known Caveats

- The distribution boundary is a contract with a build-time check behind it, not a
  sandbox. `exports` makes a deep import fail — `@jablonowski/dsb-tokens/dist/json/tokens.json`
  does not resolve — and the public artifacts contain no tier 1 or tier 3. But
  `dist/css/variables.css` ships with all three tiers because the component library builds
  against it, and once the tarball is in `node_modules` a CSS path or four lines of `fs`
  reads anything in it. Closing that would mean splitting the package in two, public and
  internal, with the component library depending on the internal one. That is a topology
  decision, not a patch
- Lost Pixel baselines must be generated by the CI workflow before the visual gate does
  anything useful; the gate fails with instructions until they are committed
- The Figma export is generated and verified, but applying it still needs a human to run
  the import inside Figma. Nothing here can detect that the design file was edited by hand
  afterwards
- The design file documents one size per component. The `sm | md | lg` scale lives only in
  code and in the variables, not in any frame a designer can look at
- The Figma pattern map in AGENTS.md is maintained by hand. Nothing verifies it against
  Figma, so it is the one contract in this repository without a test behind it
