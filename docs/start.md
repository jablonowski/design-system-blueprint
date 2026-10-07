# Documentation

[← back to the README](../README.md)

Ten documents. Read them in any order; the map below says what is in each and why it
exists.

## How the pieces fit

```mermaid
flowchart TD
    F["Figma file<br/><i>generated view</i>"]
    T1["tier 1 · options<br/><i>raw values</i>"]
    T2["tier 2 · decisions<br/><i>the only tier an app may use</i>"]
    T3["tier 3 · component<br/><i>private to the library</i>"]
    C["14 Angular components<br/>Storybook · ng-packagr"]
    AX["Agent contracts<br/>.d.ts · contracts.json · llms.client.txt · AGENTS.md"]
    MCP["Token MCP resolver<br/><i>intent → decision token</i>"]
    N["npm<br/>dsb-tokens · dsb-components · dsb-tokens-mcp"]
    APP["Consumer application"]

    SRC["tokens.json<br/><b>single source of truth</b>"]

    SRC -->|generate:figma| F
    SRC --> T1 --> T2 --> T3
    T2 --> C
    T3 --> C
    C --> AX
    T2 --> MCP
    T3 --> N
    C --> N
    MCP --> N
    N --> APP
    AX -.->|read before writing| APP

    classDef src fill:#c3ded0,stroke:#2f5a3f,color:#161a17
    classDef tier fill:#eef7f1,stroke:#c3ded0,color:#161a17
    classDef ax fill:#fdf3d4,stroke:#f5d98a,color:#6b4e0a
    classDef dist fill:#2f5a3f,stroke:#1d3a28,color:#ffffff
    class SRC src
    class T1,T2,T3,C,F tier
    class AX,MCP ax
    class N dist
```

The same picture, drawn: [`assets/architecture.svg`](assets/architecture.svg).

## The documents

### Build and run

- **[Getting started](getting-started.md)** — prerequisites, the three npm projects, and
  `npm run verify`. Start here if you just cloned the repository.

### The system

- **[Design tokens](tokens.md)** — the three-tier architecture, how the boundary is
  enforced at build time, and what the published surface actually contains.
- **[Figma sync](figma-sync.md)** — why the design file is generated from the token source
  rather than feeding it, what the generator emits, and the three measurement differences
  an audit turned up.
- **[Components](components.md)** — the Angular library, how it is developed and packaged.

### What keeps it honest

- **[Testing](testing.md)** — seven layers, what each one catches, and which need a
  browser.
- **[Visual regression](visual-regression.md)** — Lost Pixel. Two rules about baselines
  that look like trivia and are not.
- **[CI and release](ci-release.md)** — the verify workflow, the four publish workflows,
  and how to consume unpublished token changes locally.

### Agent experience

- **[Agent contracts (AX)](ax-contracts.md)** — type declarations, the validated component
  contract, the raw-value guard, and the two `llms` artifacts.
- **[Token MCP](token-mcp.md)** — the resolver, its four gates, and why refusing to answer
  is the cheapest path through the code.

### The fine print

- **[Known caveats](caveats.md)** — what this repository does not do, and which of its own
  contracts has no test behind it.

## Related

The companion experiment — [demo-blueprint](https://github.com/jablonowski/demo-blueprint) —
measures whether any of this changes what a coding agent writes. Thirty scored runs, five
arms, raw data published per run, including the comparisons that went against this
repository's premise.
