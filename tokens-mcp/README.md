# @jablonowski/dsb-tokens-mcp

Intent-based MCP server for design token resolution.

```bash
npm install -g @jablonowski/dsb-tokens-mcp
```

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

As an installed binary over stdio:

```bash
dsb-tokens-mcp
```

Registered with an MCP client:

```json
{
  "mcpServers": {
    "dsb-tokens": {
      "command": "npx",
      "args": ["-y", "@jablonowski/dsb-tokens-mcp"]
    }
  }
}
```

From a checkout:

```bash
npm start          # server over stdio
npm test           # contract, packaging and wire-surface tests
npm run sync:tokens  # refresh the bundled token snapshot after editing tokens.json
```

## Where the tokens come from

The resolver needs the authoring source, not a build output: it reads the
`{decisions.color.text.primary}` reference strings to know what a tier 3 token aliases,
and the group comments to decide whether an intent has any evidence behind it. Style
Dictionary's JSON output has resolved the references and dropped the comments, so it
cannot answer either question.

`@jablonowski/dsb-tokens` deliberately does not publish that source — an app has no
business holding tier 1 on disk. So this package carries its own snapshot, and resolution
order is:

1. `DSB_TOKENS_PATH` — explicit override, for tests or a forked token set
2. the monorepo source, when a sibling `design-tokens` package is actually present
3. `tokens/tokens.json` bundled in this package — what an installed copy uses

The snapshot cannot drift: a test asserts it is byte-identical to the source, and the
release workflow runs that test before publishing. After editing `tokens.json`, run
`npm run sync:tokens`.

## What a caller can and cannot see

A resolved answer is always a tier 2 decision token, marked `visibility: "public"`. Tier 3
tokens appear only in `explain_component_tokens`, marked `visibility: "private"`, each
mapped to the tier 2 token to use instead — with a warning that says why the rule needs
stating: those variables *are* declared in the public stylesheet, because the component
library cannot render without them, so misusing one works and couples you silently. **No response carries a tier 1 path, a raw
colour or a raw measurement** — asserted by driving the real server over stdio and
scanning every string in every payload.

That is the same boundary the token package draws, held in the channel an agent actually
uses. Contract spec: `../design-tokens/token-mcp-contract.md`.
