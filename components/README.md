# @jablonowski/dsb-components

Angular 19 standalone components built on `@jablonowski/dsb-tokens`.

## Install

```bash
npm install @jablonowski/dsb-components @jablonowski/dsb-tokens
```

The token package is a peer dependency, not a bundled one — you and this library must
resolve the same copy, because the custom properties these components read are the ones
your stylesheet defines.

## Import the stylesheet — this is not optional

```css
/* your global stylesheet */
@import '@jablonowski/dsb-tokens/css';
```

Or in `angular.json`:

```json
"styles": [
  "node_modules/@jablonowski/dsb-tokens/dist/css/public.css",
  "src/styles.css"
]
```

Every component in this library styles itself through `var(--ds-decisions-*)` and
`var(--ds-component-*)` — 261 custom properties in total. Without the stylesheet, each of
those declarations is dropped by the browser, and the components render with no padding,
no control heights and inherited colours. They look broken rather than unstyled, and
nothing reports an error: an undefined custom property is not a failure in CSS, it is a
declaration the browser quietly discards.

## Use

```ts
import { ButtonComponent, InputComponent } from '@jablonowski/dsb-components';

@Component({
  standalone: true,
  imports: [ButtonComponent, InputComponent],
  template: `<dsb-button variant="primary">Save changes</dsb-button>`,
})
export class MyComponent {}
```

Full component list, inputs, outputs and usage guidance for coding agents:
`llms.client.txt`, shipped inside this package.

## Theming

Do not override `--ds-component-*`. Those are internals of components you did not write,
and the component owner is free to repoint them.

Override the decisions layer instead:

```css
:root {
  --ds-decisions-color-action-primary-background: #0b5fff;
  --ds-decisions-space-md: 12px;
}
```

One decision reaches every component that expresses that intent, which is the entire
reason the layer exists.

## Versions

This library declares the oldest token release that carries every variable it references.
Installing an older one is the failure described above, and npm will warn you about the
unmet peer rather than let it happen quietly.
