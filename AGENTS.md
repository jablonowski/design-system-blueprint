# AGENTS

Repository-wide operating policy for coding agents working with Design System Blueprint.

## Scope

This file defines:

- source-of-truth hierarchy for agent decisions
- token usage policy for custom components
- manual Figma pattern mapping to the Angular component library
- fallback behaviour when no direct mapping exists

## Source hierarchy

Always resolve decisions using this order (top to bottom):

1. User request in the current task.
2. This file: [AGENTS.md](AGENTS.md).
3. Token MCP contract: [design-tokens/token-mcp-contract.md](design-tokens/token-mcp-contract.md).
4. Token MCP implementation and tests:
- [tokens-mcp/src/token-engine.js](tokens-mcp/src/token-engine.js)
- [tokens-mcp/test/contract.test.js](tokens-mcp/test/contract.test.js)
5. Storybook MCP contracts for component API:
- [components/mcp/contracts.json](components/mcp/contracts.json)
- [components/src/storybook/mcp.ts](components/src/storybook/mcp.ts)
6. Component source code and stories:
- [components/src/components](components/src/components)

If two sources conflict, choose the one higher in this hierarchy — **with one exception**.
Levels 3 and 4 are co-normative: the contract describes behaviour, the contract test
asserts it. If they disagree, that is a bug in the repository, not a decision for an agent
to arbitrate. Report the mismatch and stop, rather than emitting a token namespace that
only one of the two believes in. The same applies to levels 5 and 6:
`npm run test:contracts` in `components/` exists precisely so that gap cannot open
silently.

## Token policy (mandatory)

1. Resolved token answers must return only tier 2 aliases from the `decisions.*` namespace.
2. Tier 1 (raw options) and tier 3 (`component.*`) are never valid final outputs for
   developer usage guidance.
3. Tier 3 is evidence only (precedent used for rationale).
4. Value-based lookup is forbidden (hex, rgb, hsl, px or rem driven queries).
5. If coverage is missing, return `no-coverage` — do not guess, and do not fall back to
   `closestIntent`.
6. An ambiguous intent — two tokens fit equally well — is also `no-coverage`. Name both
   candidates and ask for the distinguishing role or state.

### Tier boundaries are enforced, not requested

[design-tokens/scripts/validate-schema.js](design-tokens/scripts/validate-schema.js) fails
the build when tier 2 references anything but tier 1, or tier 3 references anything but
tier 2. Do not propose a token that crosses those boundaries; it will not build.

A component token that resolves to a semantically unrelated decision — a *background* that
aliases a *text* colour, for example — is the same class of bug one layer up. It means a
decision is missing from tier 2. Propose the missing decision; do not borrow a neighbouring
one.

## Routing policy for agent questions

### Question type: Which component should I use?

Action:

1. Match intent against the Figma pattern map in this file.
2. Validate the selected component API in [components/mcp/contracts.json](components/mcp/contracts.json).
3. Return component selector, minimal props, and story reference.

### Question type: Which token should I use?

Action:

1. Resolve through the tokens-mcp `resolve_token` behaviour.
2. Return only a tier 2 `decisions.*` token.
3. Include precedent rationale and the usage line.
4. Always pass `property`. Without it the family gate cannot fire and the honest answer
   degrades to `no-coverage`.

### Question type: I need a variant of an existing component

Action:

1. Use `explain_component_tokens`.
2. Expose the private component token mapping as evidence only.
3. Recommend only the `useInYourCode` semantic token for implementation.

## Manual Figma pattern map

This map is curated for intent routing. Pattern names are descriptive and can match close
wording from Figma layers. Every component named here has an entry in
`components/mcp/contracts.json`, including the sub-components.

### Actions

- Primary action button -> component Button, selector dsb-button, props variant=primary
- Secondary action button -> component Button, selector dsb-button, props variant=secondary
- Tertiary or text action button -> component Button, selector dsb-button, props variant=ghost
- Destructive action button -> component Button, selector dsb-button, props variant=danger

### Form controls

- Single-line text input -> component Input, selector dsb-input, props type=text
- Email input -> component Input, selector dsb-input, props type=email
- Password input -> component Input, selector dsb-input, props type=password
- Select or combobox field -> component Dropdown, selector dsb-dropdown
- Single boolean toggle with label -> component Checkbox, selector dsb-checkbox
- Single-choice option set -> component RadioGroup, selector dsb-radio-group

### Navigation and structure

- Breadcrumb navigation -> component Breadcrumbs, selector dsb-breadcrumbs
- Top app or site header -> component Header, selector dsb-header
- Footer with columns and legal links -> component Footer, selector dsb-footer

### Feedback and status

- Small status label or badge -> component Tag, selector dsb-tag
- User identity circle or photo -> component Avatar, selector dsb-avatar
- Blocking confirmation or dialog overlay -> component Modal, selector dsb-modal

### Data display

- Tabular records with columns -> component Table, selector dsb-table
- Vertical item stream or activity list -> component List, selector dsb-list, with one
  ListItem (selector dsb-list-item) per row
- Expand and collapse content sections -> component Accordion, selector dsb-accordion, with
  one AccordionItem (selector dsb-accordion-item) per section

## Mapping notes

1. If Figma naming is ambiguous, resolve by interaction behaviour first, then visual style.
2. If multiple components fit, return the primary match plus one alternative.
3. If no component fits exactly, return the closest base component and mark adaptation points.
4. If no semantic token exists for a required state, return `no-coverage` and propose a
   local app token with a contribution path.

## Response contract expectations

For token responses:

- include `status`
- include `token` only when status is `resolved`
- include `rationale` and `precedent` when resolved
- include `nextStep` when `no-coverage`

For component responses:

- include the selector
- include minimal required props
- include one story path for example usage

## Quality gates before final answer

1. Do not recommend a tier 1 or tier 3 token as the final token.
2. Do not answer a value-driven token query with a token.
3. Confirm the component exists in [components/mcp/contracts.json](components/mcp/contracts.json).
4. Prefer `no-coverage` over a speculative mapping, and over `closestIntent`.
5. Do not introduce raw colour literals (hex/rgb/hsl) in component source; use semantic tokens.
6. Do not introduce raw spacing, size, typography, radius, z-index or motion literals in
   component source. `npm run lint:raw-values:strict` in `components/` passes with zero
   findings today — keep it that way. If a value has no token, propose the token.
