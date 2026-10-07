# Components

[← docs index](start.md)

Fourteen standalone Angular 19 components consuming the token decisions layer, developed
and documented in Storybook, packaged with ng-packagr and versioned with semver.

```
accordion  avatar  breadcrumbs  button  checkbox  dropdown  footer
header     input   list         modal   radio     table     tag
```

Nothing exotic, on purpose — this is the boring set every product actually needs. Each one
ships `sm | md | lg` where a size makes sense, and every public input and output is
described by a contract that a test holds to the Angular source. See
[Agent contracts](ax-contracts.md).

Sub-components (`dsb-list-item`, `dsb-accordion-item`) are documented too and point at
their parent's stories for example usage.

## Important files

- Package scripts: [`components/package.json`](../components/package.json)
- Angular build config: [`components/angular.json`](../components/angular.json)
- Storybook config: [`components/.storybook/main.ts`](../components/.storybook/main.ts)
- Storybook preview / a11y defaults: [`components/.storybook/preview.ts`](../components/.storybook/preview.ts)
- Storybook test-runner setup: [`components/.storybook/test-runner.ts`](../components/.storybook/test-runner.ts)
- Unit test config: [`components/jest.config.unit.js`](../components/jest.config.unit.js)
- Visual regression setup: [`components/lostpixel.config.ts`](../components/lostpixel.config.ts)

## Run locally

```bash
cd components
npm run storybook          # develop
npm run build-storybook    # static build
npm run build              # Angular library package
```

## No raw design values in component source

A lint rule enforces token-first implementation, and it currently reports **zero errors and
zero warnings in strict mode**: every spacing, size, typography, radius, motion and z-index
value in component source resolves through a token. Where no token existed, the token was
added rather than the rule relaxed.

Details and severity model: [Agent contracts → raw value guard](ax-contracts.md#raw-value-guard).

---

Next: [Testing](testing.md).
