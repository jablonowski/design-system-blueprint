/**
 * Style Dictionary build.
 *
 * Two things here are load-bearing, not cosmetic:
 *
 * 1. Every platform carries the same `ds` prefix. One source of truth that emits three
 *    different naming conventions is three sources of truth wearing a disguise.
 *
 * 2. The `css` and `json` platforms each emit a second, filtered artifact containing only
 *    tier 2 `decisions.*` tokens. That is the distribution boundary: consumer applications
 *    import the public artifact and are therefore *unable* to reach a raw option, rather
 *    than merely being asked not to. The full artifact stays available for the component
 *    library itself, which legitimately needs tier 3.
 */

/** @param {{path: string[]}} token */
const decisionsOnly = (token) => token.path[0] === 'decisions';

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
          // Public surface: tier 2 only, values resolved so the file stands alone.
          destination: 'public.css',
          format: 'css/variables',
          filter: decisionsOnly,
          options: { outputReferences: false },
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
          filter: decisionsOnly,
          options: { outputReferences: false },
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
