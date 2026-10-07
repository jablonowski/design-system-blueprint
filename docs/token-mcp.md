# Token MCP

[← docs index](start.md)

A small MCP server that resolves an intent — *"background for the primary action"* — into
the right tier 2 decision token.

- Specification: [`design-tokens/token-mcp-contract.md`](../design-tokens/token-mcp-contract.md)
- Implementation: [`tokens-mcp/`](../tokens-mcp/)
- Published as `@jablonowski/dsb-tokens-mcp`

```bash
cd tokens-mcp
npm test
npm start
```

## Behaviour

- Resolved answers are always tier 2 `decisions.*` tokens.
- Tier 3 is precedent evidence only, mapped by direct alias — never by heuristic.
- Value-based lookups (hex, rgb, hsl, px, rem) are rejected.
- Four gates stand between a question and an answer: value, property family, vocabulary
  evidence, and ambiguity. Each one can only produce `rejected` or `no-coverage`.

**The point of the gates is that `no-coverage` is the easy path through the code.** A
resolver that always answers is not a firewall, it is a hallucination with a schema.

## Why it carries its own copy of the token source

The resolver needs the reference strings and comments that the build output no longer has,
and the token package deliberately stops shipping that source to consumers. So the publish
workflow refuses to release a token snapshot that differs from the source — see
[CI and release](ci-release.md#publish-token-mcp).

## A note on what it is worth

The companion experiment pre-registered the comparison between *the agent-facing document
alone* and *the document plus this resolver* as the decisive one. At n = 5 the two arms
are indistinguishable: ten runs, seventy check verdicts, every one a pass in both. Where
they differ at all, the resolver arm is the slightly worse and slightly more expensive one,
and on the weaker model it produced the only run in the study where an arm holding the
design system failed to use all thirteen components.

That result is published with the same prominence as the ones that went the other way:
[demo-blueprint](https://github.com/jablonowski/demo-blueprint). The server stays in the
repository because the measurement is the point, not because the measurement flattered it.

Scope: *for this task, with the agent-facing document already present, this layer added
nothing measurable.* Not "MCP is useless".
