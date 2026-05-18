# Design Tokens — Component Implementation Reference

Extracted from actual component CSS. Use these as the basis for CSS custom properties in `styles.css`.

---

## Colors

### Text

| Token | Value | Used for |
|---|---|---|
| `--color-text-primary` | `#111` | Body text, labels, headings |
| `--color-text-body` | `#333` | Modal body text, table cell text |
| `--color-text-secondary` | `#555` | Ghost button, accordion body, avatar initials |
| `--color-text-muted` | `#666` | Breadcrumb links, footer links, list description |
| `--color-text-subtle` | `#888` | Hints, table header, icon chevrons, footer tagline |
| `--color-text-placeholder` | `#aaa` | Input placeholder, table empty state, list meta, footer copyright |
| `--color-text-disabled` | `#999` | Disabled input/label text |
| `--color-text-inverse` | `#fff` | Text on dark/primary backgrounds |

### Surfaces & Backgrounds

| Token | Value | Used for |
|---|---|---|
| `--color-surface` | `#fff` | All control backgrounds (inputs, dropdowns, cards) |
| `--color-surface-subtle` | `#fafafa` | Table header bg, striped rows |
| `--color-surface-hover` | `#f5f5f5` | Button/nav hover, disabled input bg |
| `--color-surface-hover-2` | `#f7f7f7` | Table row hover |
| `--color-surface-selected` | `#f0f0f0` | Dropdown selected option, modal close hover |
| `--color-surface-avatar` | `#e8e8e8` | Avatar initials background |

### Borders & Dividers

| Token | Value | Used for |
|---|---|---|
| `--color-border-control` | `#d4d4d4` | Input, checkbox, radio, dropdown borders |
| `--color-border-control-hover` | `#bbb` | Button secondary border hover |
| `--color-border-subtle` | `#ebebeb` | Header/footer borders, table outer border |
| `--color-border-hairline` | `#f0f0f0` | Table cell dividers, accordion, list dividers, footer bottom |
| `--color-border-separator` | `#c0c0c0` | Breadcrumbs chevron separator |

### Semantic — Error / Danger

| Token | Value | Used for |
|---|---|---|
| `--color-error` | `#d93025` | Error border, error text, error checkbox fill |
| `--color-error-hover` | `#b0261e` | Dropdown error border hover |
| `--color-error-bg` | `#fce8e6` | Tag danger background |
| `--color-error-text` | `#c5221f` | Tag danger text, list error dot/label |
| `--color-error-border-soft` | `#f0a9a4` | Button danger default border |
| `--color-error-surface` | `#fef2f2` | Button danger hover background |

### Semantic — Success

| Token | Value | Used for |
|---|---|---|
| `--color-success` | `#1a7f3c` | Tag success text, list success dot/label |
| `--color-success-bg` | `#e6f4ea` | Tag success background |

### Semantic — Warning

| Token | Value | Used for |
|---|---|---|
| `--color-warning` | `#92600a` | Tag warning text, list warning dot/label |
| `--color-warning-bg` | `#fef3cd` | Tag warning background |

### Semantic — Info

| Token | Value | Used for |
|---|---|---|
| `--color-info` | `#1a56db` | Tag info text, list info dot/label |
| `--color-info-bg` | `#e8f0fe` | Tag info background |

### Overlays & Shadows

| Token | Value | Used for |
|---|---|---|
| `--color-backdrop` | `rgba(0, 0, 0, 0.4)` | Modal backdrop |
| `--shadow-focus` | `0 0 0 3px rgba(0, 0, 0, 0.06)` | Input focus ring shadow |
| `--shadow-focus-error` | `0 0 0 3px rgba(217, 48, 37, 0.1)` | Error input focus ring shadow |
| `--shadow-dropdown` | `0 4px 12px rgba(0, 0, 0, 0.08)` | Dropdown menu |
| `--shadow-modal` | `0 8px 32px rgba(0, 0, 0, 0.14)` | Modal panel |

---

## Typography

### Font Sizes

| Token | Value | Used for |
|---|---|---|
| `--font-size-2xs` | `11px` | Tag sm, list meta, table column headers |
| `--font-size-xs` | `12px` | Tag md, hint/error text, footer secondary text |
| `--font-size-sm` | `13px` | Labels, breadcrumbs, footer links, list description |
| `--font-size-md` | `14px` | Default body, most controls (input md, button md) |
| `--font-size-lg` | `15px` | Button lg, input lg, brand name |
| `--font-size-xl` | `16px` | Modal title |

### Font Weights

| Token | Value | Used for |
|---|---|---|
| `--font-weight-medium` | `500` | Labels, button text, list labels, active nav |
| `--font-weight-semibold` | `600` | Brand names, modal title, table headers, footer column headings |

---

## Borders

### Widths

| Token | Value | Used for |
|---|---|---|
| `--border-width-hairline` | `1px` | Dividers (header, footer, table cells, list, accordion) |
| `--border-width-control` | `1.5px` | All interactive controls (inputs, checkbox, radio, dropdown, button) |
| `--border-width-focus` | `2px` | Focus ring outline |

### Radii

| Token | Value | Used for |
|---|---|---|
| `--radius-xs` | `3px` | Breadcrumb links, footer links, accordion focus |
| `--radius-sm` | `4px` | Checkbox, tag, logo areas, dropdown option |
| `--radius-md` | `5px` | Header nav link, modal close button |
| `--radius-lg` | `6px` | Button, input, dropdown trigger/menu, header CTA, avatar-rounded |
| `--radius-xl` | `8px` | Table wrapper, bordered list |
| `--radius-2xl` | `10px` | Modal panel |
| `--radius-full` | `50%` | Avatar circle, radio button, indicator dots |

---

## Motion

| Token | Value | Used for |
|---|---|---|
| `--duration-fast` | `0.1s` | Subtle hovers (dropdown option bg, table row bg) |
| `--duration-base` | `0.12s` | Standard transitions across all components |
| `--duration-slow` | `0.2s` | Accordion expand/collapse |
| `--easing-base` | `ease` | Used everywhere |

---

## Misc

| Token | Value | Used for |
|---|---|---|
| `--opacity-disabled` | `0.42` | Disabled state across all components |
| `--z-index-dropdown` | `100` | Dropdown menu |
| `--z-index-modal` | `1000` | Modal backdrop |
