/**
 * Style Dictionary build.
 *
 * Two things here are load-bearing, not cosmetic:
 *
 * 1. Every platform carries the same `ds` prefix. One source of truth that emits three
 *    different naming conventions is three sources of truth wearing a disguise.
 *
 * 2. The `css` and `scss` platforms each emit a second, filtered artifact: everything
 *    except the raw palette. That is the distribution boundary — tier 1 never leaves this
 *    package in a form an application can reach.
 *
 *    It is not tier 2 only, and the difference matters. A component's compiled CSS reads
 *    215 `component.*` custom properties and defines none of them; they are declared here.
 *    A public artifact carrying decisions alone leaves every one of those undefined in the
 *    consumer's document, and the component library renders with no spacing, no control
 *    heights and no colour — the failure this boundary was drawn to prevent, delivered by
 *    the boundary itself.
 *
 *    Tier 3 is private in the sense that applications must not author against it. It is
 *    not absent at runtime, because the library cannot run without it. Those are different
 *    claims and conflating them ships a broken package. The authoring rule is held by
 *    lint:raw-values and by the MCP resolver, which is where a naming rule belongs.
 *
 *    `json` stays decisions-only: nothing renders from it. It is a surface for writing
 *    code against, not for the browser to resolve.
 *
 * 3. Tier 3 is emitted with its references intact, tier 2 with its values resolved.
 *    A component token flattened to a literal would ignore any decision the consumer
 *    overrides, which is the entire point of having the layer.
 */

/** Tier 2 and tier 3: everything an application or the library needs at runtime. */
const notRawOptions = (token) => token.path[0] === 'decisions' || token.path[0] === 'component';

/** Tier 2 only: an authoring surface, never resolved by a browser. */
const decisionsOnly = (token) => token.path[0] === 'decisions';

/** Keep `component.*` pointing at `decisions.*`; resolve everything else. */
const referencesForTier3 = (token) => token.path[0] === 'component';

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      prefix: 'ds',
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
        {
          // Public surface: everything but the raw palette.
          destination: 'public.css',
          format: 'css/variables',
          filter: notRawOptions,
          options: { outputReferences: referencesForTier3 },
        },
      ],
    },
    scss: {
      prefix: 'ds',
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
        {
          destination: '_public.scss',
          format: 'scss/variables',
          filter: notRawOptions,
          options: { outputReferences: referencesForTier3 },
        },
      ],
    },
    js: {
      prefix: 'ds',
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    ts: {
      prefix: 'ds',
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    json: {
      prefix: 'ds',
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
        {
          destination: 'decisions.json',
          format: 'json/nested',
          filter: decisionsOnly,
        },
      ],
    },
  },
};
