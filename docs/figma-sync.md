# Figma sync

[← docs index](start.md)

## The design file is a generated view, not a second source

The Figma file carries the same three tiers as variable collections (`01 / Options`,
`02 / Decisions`, `03 / Components`). Keeping them in step used to be somebody's memory,
and it showed: an audit found the file behind the token source by more than a hundred
variables — a gap that had been widening since before the token work started, because
nothing checked.

So the Figma variable set is generated from `tokens.json`:

```bash
cd design-tokens
npm run generate:figma
```

Output, committed so a pull request shows exactly which variables the design file will
need:

- [`design-tokens/figma/tokens.dtcg.json`](../design-tokens/figma/tokens.dtcg.json) — W3C
  DTCG, readable by Tokens Studio and the common variable-import plugins
- [`design-tokens/figma/import-variables.js`](../design-tokens/figma/import-variables.js) —
  Figma Plugin API script. Idempotent, and by default it only creates what is missing;
  values of variables that already exist are left alone until you flip `OVERWRITE_EXISTING`
- [`design-tokens/figma/report.md`](../design-tokens/figma/report.md) — what could not be
  represented, and why

`npm test` fails when the committed export is behind `tokens.json`, so a token change
cannot merge while the design hand-off still describes the previous state. Variable names
match the convention already in the file, and a test pins the ones read off the live
Variables panel — get a name wrong and an import creates a parallel set beside the
originals instead of updating them.

Shadows, `em` tracking values and percentages are not exported: Figma variables hold
colour, number, string and boolean only. That is a limit of the target, not a gap in the
token set.

## Three measurements the audit left open, and how they were settled

Comparing the components against the design file turned up three differences. All three are
decided, and the decision is recorded here rather than left as folklore.

**Form field gap: 5px in the design, 6px in code — 6 stands.**
The 5 was off the scale. Keeping it would mean the spacing scale has an exception on the
day it was introduced, and the next person would reasonably add a second one. Nothing
argues for 5 any more: the design file derives from these tokens now, so its old value was
a reading of the thing being generated, not an authority over it.

**Control heights: 33 and 37 in the design, 36 for both in code — 36 stands.**
The design's input was 33 tall and its select 37, both auto-height. That gap was not a
decision anybody made; it fell out of two different vertical paddings, 8 and 10, on
otherwise identical controls — same horizontal padding, same radius, same type size. An
input and a select sitting in one form row have to line up, so both now resolve through
`decisions.size.control.*`. Fixed heights rather than padding-driven ones, because a fixed
height is a thing a test can assert.

**Size variants exist in code but not in the design file.**
`sm | md | lg` has no counterpart in Figma, which documents one size per component and
varies only the state. After the variable import the *tokens* are there, so nothing is
blocked; what is missing is three frames per sized component. That is a drawing job, not a
token job, and it stays open deliberately — see [Known caveats](caveats.md).

## What is still manual

The export is generated and verified, but applying it needs a human to run the import
inside Figma. Nothing here can detect that the design file was edited by hand afterwards.
