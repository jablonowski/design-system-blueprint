'use strict';

/**
 * Layer 3 — Style Dictionary output tests
 *
 * Asserts that the built dist/css/variables.css contains the expected
 * CSS custom property declarations. Requires `npm run build` to have
 * run first (the CI workflow handles this ordering).
 *
 * Variable names are verified against the actual component CSS files in
 * components/src/components/ — e.g. button.component.css uses
 * var(--ds-component-button-border-radius) and var(--ds-decisions-font-weight-medium).
 *
 * Test selection covers:
 *   • A raw color option (tier 1)
 *   • A raw non-color option to verify unit conversion (border-radius full → 50%)
 *   • A decision alias resolved via var() (tier 2, with outputReferences: true)
 *   • A component float alias resolved via var() (tier 3)
 *   • A three-tier alias chain: component → decision → option
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const fs     = require('fs');
const path   = require('path');

const CSS_FILE = path.resolve(__dirname, '../dist/css/variables.css');

let css = '';

describe('Style Dictionary output — dist/css/variables.css', () => {
  before(() => {
    assert.ok(
      fs.existsSync(CSS_FILE),
      `Build output not found at ${CSS_FILE}. Run 'npm run build' before running tests.`
    );
    css = fs.readFileSync(CSS_FILE, 'utf8');
    assert.ok(css.length > 0, 'CSS output file must not be empty');
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

    it('exports success green-700 as #1a7c3c', () => {
      assert.match(css, /--ds-color-options-green-700:\s*#1a7c3c/);
    });

    it('exports rgba black overlay (a40) with correct alpha', () => {
      // rgba(0, 0, 0, 0.4)  — used for modal backdrop
      assert.match(css, /--ds-color-options-black-a40:\s*rgba\(0,\s*0,\s*0,\s*0\.4\)/);
    });

    it('exports border-radius full as 50% (not 9999px)', () => {
      assert.match(css, /--ds-border-radius-options-full:\s*50%/);
    });

    it('exports easing standard as "ease"', () => {
      assert.match(css, /--ds-easing-options-standard:\s*ease/);
    });
  });

  // ─── Tier 2 — Decisions: alias references via var() ───────────────────────

  describe('Tier 2 — Decisions: var() alias references', () => {
    it('color.text.primary references options neutral-900', () => {
      // decisions.color.text.primary → {color.options.neutral.900}
      assert.match(
        css,
        /--ds-decisions-color-text-primary:\s*var\(--ds-color-options-neutral-900\)/
      );
    });

    it('color.text.inverse references options neutral-0', () => {
      // decisions.color.text.inverse → {color.options.neutral.0}
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
      // decisions.font.size.md → {font.size.options.14}
      assert.match(
        css,
        /--ds-decisions-font-size-md:\s*var\(--ds-font-size-options-14\)/
      );
    });

    it('font.weight.medium references options font-weight-medium', () => {
      assert.match(
        css,
        /--ds-decisions-font-weight-medium:\s*var\(--ds-font-weight-options-medium\)/
      );
    });

    it('border.radius.lg references options border-radius-6', () => {
      // decisions.border.radius.lg → {border.radius.options.6}
      assert.match(
        css,
        /--ds-decisions-border-radius-lg:\s*var\(--ds-border-radius-options-6\)/
      );
    });

    it('border.radius.full references options border-radius-full', () => {
      assert.match(
        css,
        /--ds-decisions-border-radius-full:\s*var\(--ds-border-radius-options-full\)/
      );
    });
  });

  // ─── Tier 3 — Components: three-tier alias chain ──────────────────────────

  describe('Tier 3 — Components: three-tier var() chains', () => {
    it('button.borderRadius references decisions border-radius-lg', () => {
      // component.button.borderRadius → {decisions.border.radius.lg}
      // camelCase borderRadius → kebab border-radius confirmed in button.component.css
      assert.match(
        css,
        /--ds-component-button-border-radius:\s*var\(--ds-decisions-border-radius-lg\)/
      );
    });

    it('button.primary.background references decisions color.text.primary', () => {
      // component.button.primary.background → {decisions.color.text.primary}
      assert.match(
        css,
        /--ds-component-button-primary-background:\s*var\(--ds-decisions-color-text-primary\)/
      );
    });

    it('button.primary.text references decisions color.text.inverse', () => {
      assert.match(
        css,
        /--ds-component-button-primary-text:\s*var\(--ds-decisions-color-text-inverse\)/
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
});
