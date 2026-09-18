# tokens-mcp

Intent-based MCP server for design token resolution.

## What it does

- resolves intent to tier 2 semantic token only
- uses tier 3 component tokens as precedent evidence only
- rejects value-based lookup by hex/rgb/px
- returns no-coverage instead of guessing when confidence is low

## Tools

### resolve_token

Input fields:

- intent
- context (custom-component or variant-of)
- baseComponent (required when context is variant-of)
- property
- state

Behavior:

- status resolved -> token always from decisions.*
- status no-coverage -> token is null
- status rejected -> value-based-lookup

### explain_component_tokens

Input fields:

- component
- variant (optional)

Behavior:

- lists private component tokens used as precedent
- maps each one to public tier 2 token in useInYourCode

## Run

Start server over stdio:

```bash
npm start
```

Run contract tests:

```bash
npm test
```

## Source of truth

- token input: ../design-tokens/tokens/tokens.json
- contract spec: ../design-tokens/token-mcp-contract.md
