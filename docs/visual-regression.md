# Visual regression

[← docs index](start.md)

Lost Pixel, in OSS mode.

```bash
cd components
npm run build-storybook
npm run test:visual
```

## Baselines are committed to git, and they are generated in CI

Two separate rules, both load-bearing.

**Committed**, because Lost Pixel in OSS mode compares against files on disk — there is no
other store. A baseline that is not in the repository does not exist as far as CI is
concerned, and a visual gate with nothing to compare against passes everything.
Documenting how to generate one locally instead would mean every developer compares their
machine against their machine: green forever, protecting nothing. The comparison job
therefore fails outright when the baseline directory is empty.

**Generated in CI**, because font rasterisation differs enough between macOS and the CI
image to blow past any sane pixel threshold. A locally generated baseline produces failures
that have nothing to do with the change under review — which is how a visual gate ends up
permanently red and then permanently ignored. `npm run test:visual:update` refuses to run
outside CI rather than relying on this paragraph having been read.

## Generate baselines from a branch that is already correct

A baseline taken while something renders wrongly makes the breakage the specification, and
the gate then defends it.

After an intentional visual change, run the **Generate Visual Baselines** workflow
([`visual-baseline.yml`](../.github/workflows/visual-baseline.yml)). It renders on
`ubuntu-latest` and opens a pull request with the new images for review — every changed
image in that diff is a design change being accepted as the new truth.

## The baseline set is itself tested

`test/visual-baseline.test.js` derives the story ids from source and fails when a story has
no baseline, or a baseline has no story. Without it, renaming a story quietly drops it out
of the gate and leaves a dead image behind.

## Artifacts

- Baseline: [`components/.lostpixel/baseline`](../components/.lostpixel/baseline) — committed
- Current and diff: generated, git-ignored
