# AGENTS

Repository-wide operating policy for coding agents working with Design System Blueprint.

## Scope

This file defines:

- source-of-truth hierarchy for agent decisions
- token usage policy for custom components
- manual Figma pattern mapping to Angular component library
- fallback behavior when no direct mapping exists

## Source hierarchy

Always resolve decisions using this order (top to bottom):

1. User request in current task.
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

If two sources conflict, choose the one higher in this hierarchy.

## Token policy (mandatory)

1. Resolved token answers must return only tier 2 semantic aliases from decisions.
2. Tier 1 and tier 3 are never valid final outputs for developer usage guidance.
3. Tier 3 is evidence only (precedent used for rationale).
4. Value-based lookup is forbidden (hex/rgb/px-driven queries).
5. If coverage is missing, return no-coverage (do not guess).

## Routing policy for agent questions

### Question type: Which component should I use?

Action:

1. Match intent against Figma pattern map in this file.
2. Validate selected component API in [components/mcp/contracts.json](components/mcp/contracts.json).
3. Return component selector, minimal props, and story reference.

### Question type: Which token should I use?

Action:

1. Resolve through tokens-mcp resolve_token behavior.
2. Return only tier 2 decision token.
3. Include precedent rationale and usage line.

### Question type: I need a variant of existing component

Action:

1. Use explain_component_tokens behavior.
2. Expose private component token mapping as evidence only.
3. Recommend only useInYourCode semantic token for implementation.

## Manual Figma pattern map

This map is curated for intent routing. Pattern names are descriptive and can match close wording from Figma layers.

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
- Vertical item stream or activity list -> component List, selector dsb-list plus dsb-list-item
- Expand and collapse content sections -> component Accordion, selector dsb-accordion plus dsb-accordion-item

## Mapping notes

1. If Figma naming is ambiguous, resolve by interaction behavior first, then visual style.
2. If multiple components fit, return the primary match plus one alternative.
3. If no component fits exactly, return closest base component and mark adaptation points.
4. If no semantic token exists for required state, return no-coverage and propose local app token with contribution path.

## Response contract expectations

For token responses:

- include status
- include token only when status is resolved
- include rationale and precedent when resolved
- include nextStep when no-coverage

For component responses:

- include selector
- include minimal required props
- include one story path for example usage

## Quality gates before final answer

1. Do not recommend tier 1 or tier 3 token as final token.
2. Do not answer value-driven token query with a token.
3. Confirm component exists in [components/mcp/contracts.json](components/mcp/contracts.json).
4. Prefer no-coverage over speculative mapping.
5. Do not introduce raw color literals (hex/rgb/hsl) in component source; use semantic tokens.
