# Token MCP - response contract (draft)

This document defines the pre-implementation contract for Token MCP, focused on intent-driven token resolution for custom components.

## Goal

Answer the question:

Which token should be used for this case?

for developers and agents building custom components outside the core component package.

## Global rules (system-level behavior)

1. Return only tier 2 semantic alias tokens as final answers.
2. Never return tier 1 global tokens as final answers.
3. Never return tier 3 component-scoped tokens as final answers.
4. Tier 3 is precedent corpus only (evidence), not output.
5. Input must be intent-based, not value-based (no reverse lookup by hex/rgb/px).
6. If no exact coverage exists, return no-coverage, not nearest token.
7. Every resolved answer must include precedent-backed rationale.

## Tool 1: resolve_token

### Input

- intent: natural language intent description
- context: custom-component or variant-of
- baseComponent: required when context is variant-of
- property: CSS property hint (for example background-color)
- state: optional state hint (default, hover, active, disabled, focus, etc.)

Example shape:

{
  "intent": "background for a primary action surface",
  "context": "custom-component",
  "property": "background-color",
  "state": "hover"
}

### Output: resolved

{
  "status": "resolved",
  "token": "semantic.action.primary.background.hover",
  "tier": 2,
  "visibility": "public",
  "rationale": "Core Button uses this alias for hover surface (component.button.primary.background.hover -> semantic.action.primary.background.hover). Same intent applies.",
  "precedent": ["component.button.primary.background.hover"],
  "usage": "background-color: var(--semantic-action-primary-background-hover);"
}

### Output: no coverage

{
  "status": "no-coverage",
  "token": null,
  "closestIntent": "semantic.action.primary.background",
  "rationale": "No semantic token exists for the requested state/surface combination.",
  "nextStep": "Define local component-scoped token in app, then propose promotion through contribution pipeline if repeated."
}

Field note:

- closestIntent is informational only and must never be treated as resolved token.

## Tool 2: explain_component_tokens

Used for variant-of flow where caller wants precedent mapping from core component tokens.

### Input

- component: component name
- variant: variant name

Example shape:

{
  "component": "Button",
  "variant": "primary"
}

### Output

{
  "component": "Button",
  "variant": "primary",
  "tokens": [
    {
      "role": "background",
      "componentToken": "component.button.primary.background",
      "resolvesTo": "semantic.action.primary.background",
      "useInYourCode": "semantic.action.primary.background",
      "visibility": "private"
    }
  ],
  "warning": "Component tokens are private. Use semantic token from useInYourCode. Importing component token creates coupling risk."
}

## Rejection behavior for value-based requests

{
  "status": "rejected",
  "reason": "value-based-lookup",
  "message": "Describe what value is for, not how it looks. Ask by intent."
}

## Contract tests for CI

1. No resolved response may return tier 1 or tier 3 token in token field.
2. Every tier 3 token used as precedent must resolve to an existing tier 2 token.
3. Queries containing explicit hex/rgb/px literals must return rejected with value-based-lookup reason.

## Packaging recommendation

Create separate tokens-mcp package in repository root, parallel to design-tokens and components.

Suggested responsibilities:

- parse and index token tiers
- resolve intent to tier 2 token
- expose MCP tools resolve_token and explain_component_tokens
- run contract test suite in CI
