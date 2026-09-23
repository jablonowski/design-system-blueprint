'use strict';

/**
 * Style Dictionary output tests.
 *
 * Asserts that the built artifacts contain what the architecture promises. Requires
 * `npm run build` to have run first (the CI workflow handles the ordering).
 *
 * Three kinds of assertion live here:
 *   • spot checks on tier 1, 2 and 3 output, including a full three-tier alias chain
 *   • structural checks that hold for the whole file — no duplicate variable names, no
 *     unresolved references
 *   • distribution boundary checks — the public artifact must not expose raw options
 *
 * The structural ones are the valuable ones. A spot check tells you one token is right;
 * a structural check tells you the build did not quietly collide two tokens into one
 * variable name, which Style Dictionary only warns about.
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '../dist');
const CSS_FILE = path.join(DIST, 'css/variables.css');
const PUBLIC_CSS_FILE = path.join(DIST, 'css/public.css');

let css = '';
let publicCss = '';

describe('Style Dictionary output', () => {
  before(() => {
    assert.ok(
      fs.existsSync(CSS_FILE),
      `Build output not found at ${CSS_FILE}. Run 'npm run build' before running tests.`
    );
    css = fs.readFileSync(CSS_FILE, 'utf8');
    assert.ok(css.length > 0, 'CSS output file must not be empty');

    assert.ok(fs.existsSync(PUBLIC_CSS_FILE), `Public output not found at ${PUBLIC_CSS_FILE}`);
    publicCss = fs.readFileSync(PUBLIC_CSS_FILE, 'utf8');
  });

  // ─── Tier 1 — Options: raw values ─────────────────────────────────────────

  describe('Tier 1 — Options: raw values', () => {
    it('exports neutral-900 as #111111 (darkest neutral)', () => {
      assert.match(css, /--ds-color-options-neutral-900:\s*#111111/);
    });

    it('exports neutral-0 as #ffffff (white)', () => {
      assert.match(css, /--ds-color-options-neutral-0:\s*#ffffff/);
    });

    it('exports error red-500 as #d93025', () => {
      assert.match(css, /--ds-color-options-red-500:\s*#d93025/);
    });

    it('exports rgba black overlay (a40) with correct alpha', () => {
      assert.match(css, /--ds-color-options-black-a40:\s*rgba\(0,\s*0,\s*0,\s*0\.4\)/);
    });

    it('exports border-radius full as 50% (not 9999px)', () => {
      assert.match(css, /--ds-border-radius-options-full:\s*50%/);
    });

    it('exports easing standard as "ease"', () => {
      assert.match(css, /--ds-easing-options-standard:\s*ease/);
    });

    it('exports the spacing scale', () => {
      assert.match(css, /--ds-space-options-1:\s*1px/);
      assert.match(css, /--ds-space-options-16:\s*16px/);
      assert.match(css, /--ds-space-options-64:\s*64px/);
    });

    it('exports the element size and layout width scales', () => {
      assert.match(css, /--ds-size-options-36:\s*36px/);
      assert.match(css, /--ds-layout-options-1200:\s*1200px/);
    });
  });

  // ─── Tier 2 — Decisions: alias references via var() ───────────────────────

  describe('Tier 2 — Decisions: var() alias references', () => {
    it('color.text.primary references options neutral-900', () => {
      assert.match(
        css,
        /--ds-decisions-color-text-primary:\s*var\(--ds-color-options-neutral-900\)/
      );
    });

    it('color.text.inverse references options neutral-0', () => {
      assert.match(
        css,
        /--ds-decisions-color-text-inverse:\s*var\(--ds-color-options-neutral-0\)/
      );
    });

    it('color.feedback.error.icon references options red-500', () => {
      assert.match(
        css,
        /--ds-decisions-color-feedback-error-icon:\s*var\(--ds-color-options-red-500\)/
      );
    });

    it('font.size.md references options font-size-14', () => {
      assert.match(css, /--ds-decisions-font-size-md:\s*var\(--ds-font-size-options-14\)/);
    });

    it('font.weight.medium references options font-weight-medium', () => {
      assert.match(
        css,
        /--ds-decisions-font-weight-medium:\s*var\(--ds-font-weight-options-medium\)/
      );
    });

    it('border.radius.lg references options border-radius-6', () => {
      assert.match(
        css,
        /--ds-decisions-border-radius-lg:\s*var\(--ds-border-radius-options-6\)/
      );
    });

    it('space.xl references options space-16', () => {
      assert.match(css, /--ds-decisions-space-xl:\s*var\(--ds-space-options-16\)/);
    });

    it('size.control shares one height scale across every form control', () => {
      assert.match(css, /--ds-decisions-size-control-sm:\s*var\(--ds-size-options-30\)/);
      assert.match(css, /--ds-decisions-size-control-md:\s*var\(--ds-size-options-36\)/);
      assert.match(css, /--ds-decisions-size-control-lg:\s*var\(--ds-size-options-44\)/);
    });

    it('exposes an action family for interactive surfaces', () => {
      assert.match(
        css,
        /--ds-decisions-color-action-primary-background:\s*var\(--ds-color-options-neutral-900\)/
      );
      assert.match(
        css,
        /--ds-decisions-color-action-primary-background-hover:\s*var\(--ds-color-options-neutral-800\)/
      );
      assert.match(
        css,
        /--ds-decisions-color-action-danger-text:\s*var\(--ds-color-options-red-500\)/
      );
    });
  });

  // ─── Tier 3 — Components: three-tier alias chain ──────────────────────────

  describe('Tier 3 — Components: three-tier var() chains', () => {
    it('button.borderRadius references decisions border-radius-lg', () => {
      assert.match(
        css,
        /--ds-component-button-border-radius:\s*var\(--ds-decisions-border-radius-lg\)/
      );
    });

    it('button.primary.background references the action family, not a text colour', () => {
      // A primary action surface described by decisions.color.text.* means the semantic
      // layer is missing a decision. This assertion is the regression guard for that.
      assert.match(
        css,
        /--ds-component-button-primary-background:\s*var\(--ds-decisions-color-action-primary-background\)/
      );
      assert.doesNotMatch(
        css,
        /--ds-component-button-primary-background:\s*var\(--ds-decisions-color-text-/
      );
    });

    it('button.primary.text references the action family label colour', () => {
      assert.match(
        css,
        /--ds-component-button-primary-text:\s*var\(--ds-decisions-color-action-primary-text\)/
      );
    });

    it('checked controls reference the selected action tokens', () => {
      assert.match(
        css,
        /--ds-component-checkbox-checked-background:\s*var\(--ds-decisions-color-action-selected-background\)/
      );
      assert.match(
        css,
        /--ds-component-radio-dot-color:\s*var\(--ds-decisions-color-action-selected-background\)/
      );
    });

    it('input.borderRadius references decisions border-radius-lg', () => {
      assert.match(
        css,
        /--ds-component-input-border-radius:\s*var\(--ds-decisions-border-radius-lg\)/
      );
    });

    it('modal.backdrop references decisions color.overlay.backdrop', () => {
      assert.match(
        css,
        /--ds-component-modal-backdrop:\s*var\(--ds-decisions-color-overlay-backdrop\)/
      );
    });

    it('tag.success.background references decisions feedback.success.surface', () => {
      assert.match(
        css,
        /--ds-component-tag-success-background:\s*var\(--ds-decisions-color-feedback-success-surface\)/
      );
    });
  });

  // ─── Structural guarantees ────────────────────────────────────────────────

  describe('Structural guarantees', () => {
    const declarations = () =>
      [...css.matchAll(/^\s*(--ds-[\w-]+):\s*([^;]+);/gm)].map((m) => ({
        name: m[1],
        value: m[2].trim(),
      }));

    it('declares no custom property twice', () => {
      // Style Dictionary only *warns* about name collisions, and the loser is silently
      // overwritten. Two tokens flattening to one variable name is a data-loss bug.
      const seen = new Map();
      const duplicates = [];

      for (const { name, value } of declarations()) {
        if (seen.has(name) && seen.get(name) !== value) {
          duplicates.push(`${name}: "${seen.get(name)}" then "${value}"`);
        }
        seen.set(name, value);
      }

      assert.deepEqual(duplicates, [], `colliding variable names:\n  ${duplicates.join('\n  ')}`);
    });

    it('leaves no var() reference pointing at an undeclared variable', () => {
      const declared = new Set(declarations().map((d) => d.name));
      const dangling = new Set();

      for (const match of css.matchAll(/var\((--ds-[\w-]+)\)/g)) {
        if (!declared.has(match[1])) dangling.add(match[1]);
      }

      assert.deepEqual([...dangling], []);
    });

    it('keeps every component variable one hop from a decision', () => {
      const offenders = declarations()
        .filter((d) => d.name.startsWith('--ds-component-'))
        .filter((d) => d.value.startsWith('var('))
        .filter((d) => !d.value.startsWith('var(--ds-decisions-'));

      assert.deepEqual(
        offenders.map((d) => `${d.name}: ${d.value}`),
        [],
        'a component variable reached past the semantic layer'
      );
    });
  });

  // ─── Distribution boundary ────────────────────────────────────────────────

  describe('Public surface (dist/css/public.css)', () => {
    it('exposes decision tokens', () => {
      assert.match(publicCss, /--ds-decisions-color-action-primary-background:/);
      assert.match(publicCss, /--ds-decisions-space-xl:/);
    });

    it('exposes no raw options', () => {
      // The distribution half of the firewall: a consumer importing the public entry
      // point cannot reach tier 1, rather than merely being asked not to.
      const leaks = [...publicCss.matchAll(/^\s*(--ds-[\w-]*-options-[\w-]+):/gm)].map((m) => m[1]);
      assert.deepEqual(leaks, []);
    });

    it('carries the component layer, because the library cannot render without it', () => {
      // Tier 3 is private in the sense that applications must not author against it.
      // It is not absent at runtime: a component's compiled CSS reads these and defines
      // none of them. A public artifact without them renders every component with no
      // spacing, no control heights and no colour.
      const component = [...publicCss.matchAll(/^\s*(--ds-component-[\w-]+):/gm)];
      assert.ok(component.length > 200, `only ${component.length} component tokens in the public surface`);
    });

    it('keeps component tokens pointing at decisions rather than flattening them', () => {
      // A component token resolved to a literal ignores any decision the consumer
      // overrides, which removes the only reason the layer exists.
      const flattened = [...publicCss.matchAll(/^\s*(--ds-component-[\w-]+):\s*([^;]+);/gm)]
        .filter((m) => !m[2].trim().startsWith('var('))
        .map((m) => `${m[1]}: ${m[2].trim()}`);

      assert.deepEqual(flattened, [], '\n  ' + flattened.slice(0, 5).join('\n  ') + '\n');
    });

    it('resolves decision values so the file stands alone', () => {
      // Decisions may not reference tier 1 here: tier 1 is not in this file, so a
      // reference would resolve to nothing.
      const dangling = [...publicCss.matchAll(/^\s*(--ds-decisions-[\w-]+):\s*var\(([^)]+)\)/gm)]
        .map((m) => `${m[1]} -> ${m[2]}`);
      assert.deepEqual(dangling, []);
      assert.match(publicCss, /--ds-decisions-color-text-primary:\s*#111111/);
    });

    it('defines every variable the component source reads', () => {
      // The assertion that actually matters, and the one that was missing: an
      // application importing the public stylesheet gets a component library that works.
      const declared = new Set(
        [...publicCss.matchAll(/^\s*(--ds-[\w-]+):/gm)].map((m) => m[1])
      );

      const componentsDir = path.resolve(__dirname, '..', '..', 'components', 'src');
      const used = new Set();
      const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/\.(css|html)$/.test(entry.name)) {
            for (const m of fs.readFileSync(full, 'utf8').matchAll(/var\(\s*(--ds-[\w-]+)/g)) {
              used.add(m[1]);
            }
          }
        }
      };
      walk(componentsDir);

      const missing = [...used].filter((name) => !declared.has(name)).sort();
      assert.deepEqual(
        missing,
        [],
        `\n  the public stylesheet leaves ${missing.length} of ${used.size} variables ` +
        `undefined; every one of them is a declaration the browser will discard:\n    ` +
        missing.slice(0, 10).join('\n    ') + '\n'
      );
    });
  });
});
