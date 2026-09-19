# Token MCP — response contract

This document defines the response contract for Token MCP, focused on intent-driven
token resolution for custom components.

It is normative. `tokens-mcp/test/contract.test.js` asserts every rule below, and the
namespaces used here are the namespaces that exist in `design-tokens/tokens/tokens.json`.
If this document and the implementation ever disagree, the contract test is the tiebreak —
a spec that describes tokens the system does not have is worse than no spec at all.

## Goal

Answer the question:

> Which token should be used for this case?

for developers and agents building custom components outside the core component package.

## Tier namespaces

| Tier | Namespace     | Role                                    | Valid as a final answer |
|------|---------------|-----------------------------------------|-------------------------|
| 1    | everything else (`color.options.*`, `space.options.*`, `size.options.*`, …) | Raw values | No |
| 2    | `decisions.*` | Semantic decisions, named by intent      | **Yes — only these**    |
| 3    | `component.*` | Component-scoped, private                | No (precedent only)     |

Reference direction is enforced by `design-tokens/scripts/validate-schema.js`:
tier 2 may only reference tier 1, tier 3 may only reference tier 2. That check is the
architectural firewall; the rules below are its runtime half.

## Global rules (system-level behaviour)

1. Return only tier 2 `decisions.*` tokens as final answers.
2. Never return tier 1 raw options as a final answer.
3. Never return tier 3 `component.*` tokens as a final answer.
4. Tier 3 is a precedent corpus only (evidence), not output.
5. Input must be intent-based, not value-based (no reverse lookup by hex, rgb, hsl, px or rem).
6. If no exact coverage exists, return `no-coverage`, not the nearest token.
7. Every resolved answer must include a precedent-backed rationale.

## Resolution gates

A query passes through four gates in order. Each one can only produce `rejected` or
`no-coverage` — never a token. This is what makes rule 6 real rather than aspirational.

| Gate | Name     | Fails when | Result |
|------|----------|------------|--------|
| 1 | Value    | The query contains a literal value (`#111`, `rgb(...)`, `12px`, `1.5rem`) | `rejected`, reason `value-based-lookup` |
| 2 | Family   | The CSS property cannot be mapped to a token family, or the family is empty | `no-coverage` |
| 3 | Evidence | The intent shares no meaningful vocabulary with any token in the family (path segments or comments) | `no-coverage` |
| 4 | Ambiguity | The best candidate does not beat the runner-up by the required margin | `no-coverage`, rationale names both candidates |

Only a candidate that clears all four and meets the score threshold is returned as `resolved`.

Notes on gate 3. Property words (`color`, `background`, `padding`, `size`, …) are stopwords
for the purpose of evidence: the family gate has already used them, so they cannot also
count as evidence about *which* token in that family is meant. An intent built only from
property words and English filler therefore has zero evidence and returns `no-coverage`.

Notes on gate 4. Two tokens that fit a question equally well is not a resolved answer, it is
an ambiguous one. `corner rounding for a card` matches `border.radius.xl` and
`border.radius.2xl` equally, so the answer is `no-coverage` with both named — not a coin flip
dressed up as a recommendation.

## Token families

The family gate maps a CSS property to exactly one family. A question about
`background-color` can never be answered with a font size, whatever the wording.

| Property group  | Eligible tier 2 paths |
|-----------------|-----------------------|
| `background`    | `decisions.color.surface.*`, `decisions.color.action.*.background*`, `decisions.color.feedback.*.surface*` |
| `text-color`    | `decisions.color.text.*`, `decisions.color.action.*.text*`, `decisions.color.feedback.*.{text,icon}` |
| `border-color`  | `decisions.color.border.*`, `decisions.color.action.*.border*`, `decisions.color.feedback.*.border` |
| `overlay`       | `decisions.color.overlay.*` |
| `radius`        | `decisions.border.radius.*` |
| `border-width`  | `decisions.border.width.*` |
| `shadow`        | `decisions.shadow.*` |
| `font-size`     | `decisions.font.size.*` |
| `font-weight`   | `decisions.font.weight.*` |
| `line-height`   | `decisions.font.lineHeight.*` |
| `tracking`      | `decisions.font.tracking.*` |
| `spacing`       | `decisions.space.*` |
| `size`          | `decisions.size.*` |
| `layout-width`  | `decisions.layout.width.*` |
| `z-index`       | `decisions.zIndex.*` |
| `opacity`       | `decisions.opacity.*` |
| `duration`      | `decisions.motion.duration.*` |
| `easing`        | `decisions.motion.easing.*` |

## Tool 1: resolve_token

### Input

- `intent` — natural language intent description (required)
- `context` — `custom-component` or `variant-of` (required)
- `baseComponent` — required when context is `variant-of`
- `property` — CSS property hint, for example `background-color`. Strongly recommended:
  without it the family gate often cannot fire and the answer is `no-coverage`.
- `state` — optional state hint (`hover`, `active`, `focus`, `disabled`, `selected`,
  `checked`, `error`, `success`, `warning`, `info`)

```json
{
  "intent": "background for a primary action surface",
  "context": "custom-component",
  "property": "background-color",
  "state": "hover"
}
```

State handling is symmetric and deliberate: a requested state resolves to the state
variant, and **no** requested state resolves to the default rather than to one of its
variants.

### Output: resolved

```json
{
  "status": "resolved",
  "token": "decisions.color.action.primary.backgroundHover",
  "tier": 2,
  "visibility": "public",
  "confidence": 28,
  "rationale": "Matched on background family and role vocabulary; the same alias is the precedent behind component.button.primary.backgroundHover.",
  "precedent": [
    "component.button.primary.backgroundHover",
    "component.header.cta.backgroundHover"
  ],
  "usage": "background-color: var(--ds-decisions-color-action-primary-background-hover);"
}
```

`precedent` is ordered by relevance to the question asked, not by token path. Asking about
a Button variant cites a Button precedent. `rationale` always quotes `precedent[0]`, so the
justification and the evidence can never drift apart.

### Output: no coverage

```json
{
  "status": "no-coverage",
  "token": null,
  "closestIntent": "decisions.color.surface.base",
  "rationale": "The intent shares no vocabulary with any token in this family, so any answer would be a guess.",
  "nextStep": "Rephrase using a role the system knows (primary, secondary, danger, muted, disabled, selected, hover), or propose a new decision token."
}
```

Field note: `closestIntent` is informational only and must never be treated as a resolved
token. It exists so a human can judge how far off the system is, not so a caller can fall
back to it.

### Output: rejected

```json
{
  "status": "rejected",
  "reason": "value-based-lookup",
  "message": "Describe what the value is for, not what it looks like. Ask by intent."
}
```

## Tool 2: explain_component_tokens

Used for the `variant-of` flow when the caller wants the precedent mapping from core
component tokens.

### Input

```json
{ "component": "Button", "variant": "primary" }
```

### Output

```json
{
  "component": "Button",
  "variant": "primary",
  "tokens": [
    {
      "role": "background",
      "componentToken": "component.button.primary.background",
      "resolvesTo": "decisions.color.action.primary.background",
      "useInYourCode": "decisions.color.action.primary.background",
      "visibility": "private",
      "resolutionStrategy": "direct-alias"
    }
  ],
  "warning": "Component tokens are private. Use tier 2 semantic tokens from useInYourCode to avoid coupling to internal component implementation."
}
```

`resolutionStrategy` is always `direct-alias`. There is no heuristic fallback: the schema
validator guarantees every tier 3 token references a tier 2 token, so a tier 3 token that
cannot be mapped is a genuine gap and must appear in `getCoverageReport().unresolvedTier3`
rather than being papered over with a guess. A guessed mapping is a false precedent, and a
false precedent poisons every rationale built on it.

## Contract tests for CI

Asserted in `tokens-mcp/test/contract.test.js`:

1. No resolved response returns a tier 1 or tier 3 token.
2. Every tier 3 token maps to an existing tier 2 token, by direct alias only.
3. Queries containing hex, rgb, hsl, px or rem literals return `rejected` with
   `value-based-lookup`.
4. Intent with no vocabulary overlap returns `no-coverage`, never a nearest match.
5. `closestIntent` is never returned as `token`.
6. A question about one property is never answered from another family.
7. An ambiguous intent returns `no-coverage` naming both candidates.
8. A cited precedent actually resolves to the returned token, and `precedent[0]` is the
   most relevant one.
9. A requested state resolves to the state variant; no state resolves to the default.
10. A component's background never resolves to a text colour decision — that pattern means
    a decision is missing from tier 2, not that an alias is valid.

## Packaging

`tokens-mcp` lives in the repository root, parallel to `design-tokens` and `components`.

Responsibilities:

- parse and index token tiers
- resolve intent to a tier 2 token, or decline
- expose MCP tools `resolve_token` and `explain_component_tokens`
- run this contract test suite in CI
