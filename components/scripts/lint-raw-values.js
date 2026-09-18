'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.join(ROOT, 'src', 'components');

const FILE_EXTENSIONS = new Set(['.css', '.html', '.ts']);
const FILE_IGNORE_RE = /\.(spec|test|stories|mock)\.[^.]+$/;
const SUPPRESSION_RE = /eslint-disable(?:-next-line|-line)?/;

const HEX_COLOR_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const FUNC_COLOR_RE = /\b(?:rgb|rgba|hsl|hsla|oklch)\s*\(/gi;
const NUMBER_WITH_UNIT_RE = /(-?\d*\.?\d+)(px|rem|em|ms|s|%|vh|vw|dvh|dvw|vmin|vmax)\b/gi;
const INTEGER_RE = /-?\d+\b/g;

const ROLLOUT_MODE = (process.env.DS_LINT_ROLLOUT || 'baseline').toLowerCase();
const STRICT_BLOCK = ROLLOUT_MODE === 'strict';

const NAMED_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black',
  'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
  'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
  'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon',
  'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
  'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick',
  'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
  'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo',
  'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
  'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
  'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta',
  'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
  'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
  'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite',
  'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
  'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue',
  'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
  'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan',
  'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow',
  'yellowgreen',
]);

const ALLOWED_COLOR_KEYWORDS = new Set(['transparent', 'currentcolor', 'inherit', 'initial', 'unset']);
const ALLOWED_GLOBAL_KEYWORDS = new Set(['auto', 'none', 'fit-content', 'min-content', 'max-content']);

const SPACING_PROPS = new Set([
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'margin-inline',
  'margin-inline-start', 'margin-inline-end', 'margin-block', 'margin-block-start', 'margin-block-end',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'padding-inline',
  'padding-inline-start', 'padding-inline-end', 'padding-block', 'padding-block-start', 'padding-block-end',
  'gap', 'row-gap', 'column-gap', 'inset', 'inset-top', 'inset-right', 'inset-bottom', 'inset-left',
  'top', 'right', 'bottom', 'left', 'translate', 'translatex', 'translatey', 'translatez',
]);

const TYPOGRAPHY_PROPS = new Set(['font-size', 'font-weight', 'line-height', 'letter-spacing', 'font-family']);
const RADIUS_BORDER_PROPS = new Set(['border-radius', 'border-width', 'outline-width', 'outline-offset', 'box-shadow']);
const MOTION_PROPS = new Set([
  'transition-duration', 'transition-timing-function', 'animation-duration', 'animation-timing-function',
]);
const DIMENSION_WARN_PROPS = new Set(['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height']);

function blockSeverity(defaultLevel) {
  if (defaultLevel === 'error') return 'error';
  return STRICT_BLOCK ? 'error' : 'warn';
}

const RULES = {
  color: { id: 'no-hardcoded-color', severity: 'error' },
  spacing: { id: 'no-hardcoded-spacing', severity: blockSeverity('warn') },
  typography: { id: 'no-hardcoded-typography', severity: blockSeverity('warn') },
  border: { id: 'no-hardcoded-border', severity: blockSeverity('warn') },
  zindex: { id: 'no-hardcoded-zindex', severity: blockSeverity('warn') },
  motion: { id: 'no-hardcoded-motion', severity: blockSeverity('warn') },
  breakpoints: { id: 'no-hardcoded-breakpoints', severity: 'warn' },
  dimensions: { id: 'no-hardcoded-dimensions', severity: 'warn' },
  suppression: { id: 'no-lint-suppression', severity: 'error' },
};

function walk(dirPath, out) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }

    if (!FILE_EXTENSIONS.has(path.extname(entry.name))) continue;
    if (FILE_IGNORE_RE.test(entry.name)) continue;

    if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }
}

function getLineNumber(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function getLine(content, lineNumber) {
  return content.split(/\r?\n/)[lineNumber - 1] || '';
}

function hasTokenReference(value) {
  return /var\(\s*--[\w-]+\s*\)/.test(value);
}

function isZeroLiteral(token) {
  return /^0(?:px|rem|em|ms|s|%|vh|vw|dvh|dvw|vmin|vmax)?$/i.test(token.trim());
}

function isAllowedGlobalKeyword(token) {
  return ALLOWED_GLOBAL_KEYWORDS.has(token.trim().toLowerCase());
}

function isIgnoredDimensionToken(token, prop) {
  const normalized = token.trim().toLowerCase();
  if (isZeroLiteral(normalized)) return true;
  if (/^-?\d*\.?\d+(%|vh|vw|dvh|dvw|vmin|vmax)$/.test(normalized)) return true;
  if (normalized === '1px' && /border|outline/.test(prop)) return true;
  if (isAllowedGlobalKeyword(normalized)) return true;
  return false;
}

function allCalcOperandsAreTokens(value) {
  const calcMatches = [...value.matchAll(/calc\(([^)]*)\)/g)];
  if (calcMatches.length === 0) return false;

  for (const match of calcMatches) {
    const body = match[1];
    const withoutTokenVars = body.replace(/var\(\s*--[\w-]+\s*\)/g, '').trim();
    if (!withoutTokenVars) continue;

    const stripped = withoutTokenVars.replace(/[+\-*/()\s]/g, '');
    if (stripped.length > 0) return false;
  }

  return true;
}

function extractDeclarations(content, filePath) {
  const declarations = [];
  const ext = path.extname(filePath);

  if (ext === '.css') {
    const declRe = /([a-zA-Z-]+)\s*:\s*([^;{}]+);/g;
    let match;
    while ((match = declRe.exec(content)) !== null) {
      const prop = match[1].toLowerCase();
      const value = match[2].trim();
      const line = getLineNumber(content, match.index);
      declarations.push({ prop, value, line, snippet: getLine(content, line).trim() });
    }

    const mediaRe = /@media\s*([^\{]+)/g;
    while ((match = mediaRe.exec(content)) !== null) {
      const query = match[1].trim();
      const line = getLineNumber(content, match.index);
      declarations.push({ prop: '@media', value: query, line, snippet: getLine(content, line).trim() });
    }
    return declarations;
  }

  const styleAttrRe = /style\s*=\s*(["'])([\s\S]*?)\1/g;
  let styleMatch;
  while ((styleMatch = styleAttrRe.exec(content)) !== null) {
    const styleBody = styleMatch[2];
    const line = getLineNumber(content, styleMatch.index);

    const chunks = styleBody
      .split(';')
      .map((x) => x.trim())
      .filter(Boolean);

    for (const chunk of chunks) {
      const idx = chunk.indexOf(':');
      if (idx === -1) continue;
      const prop = chunk.slice(0, idx).trim().toLowerCase();
      const value = chunk.slice(idx + 1).trim();
      declarations.push({ prop, value, line, snippet: chunk });
    }
  }

  return declarations;
}

function pushViolation(list, filePath, line, rule, found, why, suggestion, snippet) {
  list.push({
    filePath,
    line,
    severity: rule.severity,
    ruleId: rule.id,
    found,
    why,
    suggestion,
    snippet,
  });
}

function tokenSuggestionForProp(prop) {
  if (prop.includes('background')) return '--ds-decisions-color-surface-base';
  if (prop.includes('color') || prop === 'fill' || prop === 'stroke') return '--ds-decisions-color-text-primary';
  if (prop.includes('radius')) return '--ds-decisions-border-radius-lg';
  if (prop.includes('border')) return '--ds-decisions-color-border-control';
  if (prop === 'font-size') return '--ds-decisions-font-size-md';
  if (prop === 'font-weight') return '--ds-decisions-font-weight-medium';
  if (prop === 'line-height') return '--ds-decisions-font-size-md';
  if (prop === 'letter-spacing') return '--ds-decisions-font-size-xs';
  if (prop.includes('duration')) return '--ds-decisions-motion-duration-base';
  if (prop.includes('timing')) return '--ds-decisions-motion-easing-standard';
  if (prop.includes('z-index') || prop === 'z-index') return '--ds-decisions-z-index-dropdown';
  return '--ds-decisions-color-text-primary';
}

function findNamedColor(value) {
  const tokens = value.toLowerCase().match(/[a-z-]+/g) || [];
  for (const token of tokens) {
    if (ALLOWED_COLOR_KEYWORDS.has(token)) continue;
    if (NAMED_COLORS.has(token)) return token;
  }
  return null;
}

function checkColorRule(violations, filePath, declaration) {
  const value = declaration.value;
  const prop = declaration.prop;

  if (ALLOWED_COLOR_KEYWORDS.has(value.toLowerCase())) return;
  if (allCalcOperandsAreTokens(value)) return;

  const hex = value.match(HEX_COLOR_RE);
  const fn = value.match(FUNC_COLOR_RE);
  const named = findNamedColor(value);
  if (!hex && !fn && !named) return;

  const found = hex?.[0] || fn?.[0] || named;
  pushViolation(
    violations,
    filePath,
    declaration.line,
    RULES.color,
    `Hardcoded color ${found}`,
    'Literal colors bypass design-token governance and drift from semantic intent.',
    `Use semantic token instead, e.g. var(${tokenSuggestionForProp(prop)}). No matching token? Ask Token MCP by intent; do not use tier 1 or tier 3 as final answer.`,
    declaration.snippet
  );
}

function checkSpacingRule(violations, filePath, declaration) {
  const prop = declaration.prop;
  if (!(SPACING_PROPS.has(prop) || prop.startsWith('margin-') || prop.startsWith('padding-') || prop.startsWith('inset-'))) {
    if (!(prop === 'transform' && /translate/i.test(declaration.value))) {
      return;
    }
  }

  if (allCalcOperandsAreTokens(declaration.value)) return;

  const values = declaration.value.match(NUMBER_WITH_UNIT_RE) || [];
  for (const token of values) {
    if (!/(px|rem|em)/i.test(token)) continue;
    if (isIgnoredDimensionToken(token, prop)) continue;

    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.spacing,
      `Hardcoded spacing literal ${token}`,
      'Spacing decisions must come from token scale for consistency across components.',
      'Use spacing token alias (decision tier) mapped for this context; if missing, open token contribution instead of hardcoding.',
      declaration.snippet
    );
  }
}

function checkTypographyRule(violations, filePath, declaration) {
  const prop = declaration.prop;
  if (!TYPOGRAPHY_PROPS.has(prop)) return;
  if (allCalcOperandsAreTokens(declaration.value)) return;

  const value = declaration.value.toLowerCase().trim();
  if (hasTokenReference(value) || isAllowedGlobalKeyword(value) || value === 'inherit' || value === 'normal') return;

  if (prop === 'font-family') {
    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.typography,
      `Hardcoded font-family ${declaration.value}`,
      'Typography family must be tokenized to keep platform typography aligned.',
      'Use semantic typography token (font family decision) instead of literal family stack.',
      declaration.snippet
    );
    return;
  }

  const units = declaration.value.match(NUMBER_WITH_UNIT_RE) || [];
  const hasUnits = units.some((token) => !isIgnoredDimensionToken(token, prop));
  const hasNumeric = /\b\d+(?:\.\d+)?\b/.test(declaration.value);
  if (!hasUnits && !hasNumeric) return;

  pushViolation(
    violations,
    filePath,
    declaration.line,
    RULES.typography,
    `Hardcoded typography value ${declaration.value}`,
    'Typography rhythm should resolve through token scales.',
    `Use semantic typography token, e.g. var(${tokenSuggestionForProp(prop)}).`,
    declaration.snippet
  );
}

function checkBorderRule(violations, filePath, declaration) {
  const prop = declaration.prop;
  if (!RADIUS_BORDER_PROPS.has(prop)) return;
  if (allCalcOperandsAreTokens(declaration.value)) return;

  if (prop === 'box-shadow') {
    if (hasTokenReference(declaration.value) || declaration.value.trim().toLowerCase() === 'none') return;
    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.border,
      `Hardcoded box-shadow ${declaration.value}`,
      'Shadow composition (offset/blur/spread/color) must come from token decisions.',
      'Use a semantic shadow token alias (for example decision.shadow.*).',
      declaration.snippet
    );
    return;
  }

  const units = declaration.value.match(NUMBER_WITH_UNIT_RE) || [];
  for (const token of units) {
    if (!/(px|rem|em)/i.test(token)) continue;
    if (isIgnoredDimensionToken(token, prop)) continue;

    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.border,
      `Hardcoded border/radius literal ${token}`,
      'Border and radius values must come from token scale to keep shape language consistent.',
      `Use semantic token, e.g. var(${tokenSuggestionForProp(prop)}).`,
      declaration.snippet
    );
  }
}

function checkZIndexRule(violations, filePath, declaration) {
  if (declaration.prop !== 'z-index') return;
  const value = declaration.value.trim().toLowerCase();
  if (hasTokenReference(value) || value === 'auto') return;

  const numbers = declaration.value.match(INTEGER_RE) || [];
  for (const token of numbers) {
    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.zindex,
      `Hardcoded z-index ${token}`,
      'Stacking order must use elevation scale tokens to avoid local z-index wars.',
      `Use semantic token, e.g. var(${tokenSuggestionForProp('z-index')}).`,
      declaration.snippet
    );
  }
}

function checkMotionRule(violations, filePath, declaration) {
  const prop = declaration.prop;
  if (!MOTION_PROPS.has(prop)) return;

  const value = declaration.value.trim().toLowerCase();
  if (hasTokenReference(value) || value === 'inherit' || value === 'initial' || value === 'unset') return;

  pushViolation(
    violations,
    filePath,
    declaration.line,
    RULES.motion,
    `Hardcoded motion value ${declaration.value}`,
    'Durations and timing functions should be centralized in motion tokens.',
    `Use semantic motion token, e.g. var(${tokenSuggestionForProp(prop)}).`,
    declaration.snippet
  );
}

function checkBreakpointRule(violations, filePath, declaration) {
  if (declaration.prop !== '@media') return;
  const matches = declaration.value.match(/\b\d*\.?\d+(px|rem|em)\b/gi) || [];
  for (const token of matches) {
    if (isZeroLiteral(token)) continue;
    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.breakpoints,
      `Literal breakpoint ${token} in @media`,
      'Breakpoint literals hide scale semantics and are hard to audit.',
      'Prefer documented breakpoint token naming in message/docs. If CSS var cannot be used in media query, keep literal only with explicit mapping note.',
      declaration.snippet
    );
  }
}

function checkDimensionRule(violations, filePath, declaration) {
  const prop = declaration.prop;
  if (!DIMENSION_WARN_PROPS.has(prop)) return;
  if (allCalcOperandsAreTokens(declaration.value)) return;

  const matches = declaration.value.match(NUMBER_WITH_UNIT_RE) || [];
  for (const token of matches) {
    if (!/(px|rem|em)/i.test(token)) continue;
    if (isIgnoredDimensionToken(token, prop)) continue;

    pushViolation(
      violations,
      filePath,
      declaration.line,
      RULES.dimensions,
      `Hardcoded component dimension ${token}`,
      'Dimensions often become implicit scale decisions; keep them visible via tokens where possible.',
      'Use a size token when available; otherwise keep as temporary warning and consider contribution to token scale.',
      declaration.snippet
    );
  }
}

function findViolationsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!SUPPRESSION_RE.test(line)) continue;

    pushViolation(
      violations,
      filePath,
      i + 1,
      RULES.suppression,
      `Lint suppression detected (${line.trim()})`,
      'Suppressions are forbidden in design system source. Core code must resolve with tokens, not bypass policy.',
      'Remove suppression and fix value through token usage. If missing token, route through DS contribution process.',
      line.trim()
    );
  }

  const declarations = extractDeclarations(content, filePath);
  for (const declaration of declarations) {
    if (!declaration.value) continue;

    checkColorRule(violations, filePath, declaration);
    checkSpacingRule(violations, filePath, declaration);
    checkTypographyRule(violations, filePath, declaration);
    checkBorderRule(violations, filePath, declaration);
    checkZIndexRule(violations, filePath, declaration);
    checkMotionRule(violations, filePath, declaration);
    checkBreakpointRule(violations, filePath, declaration);
    checkDimensionRule(violations, filePath, declaration);
  }

  return violations;
}

function main() {
  const files = [];
  walk(TARGET_DIR, files);

  const violations = files.flatMap(findViolationsInFile);
  const errors = violations.filter((x) => x.severity === 'error');
  const warnings = violations.filter((x) => x.severity === 'warn');

  if (violations.length === 0) {
    console.log('[lint:raw-values] PASS - no design-value violations found in components source.');
    return;
  }

  console.log(`[lint:raw-values] mode=${ROLLOUT_MODE}; errors=${errors.length}; warnings=${warnings.length}`);
  console.log('Every visual decision should resolve to a design token.\n');

  for (const issue of violations) {
    const relPath = path.relative(ROOT, issue.filePath);
    const level = issue.severity.toUpperCase();
    const stream = issue.severity === 'error' ? console.error : console.warn;

    stream(`[${level}] ${issue.ruleId} at ${relPath}:${issue.line}`);
    stream(`  Found: ${issue.found}`);
    stream(`  Why blocked: ${issue.why}`);
    stream(`  Use instead: ${issue.suggestion}`);
    stream(`  Snippet: ${issue.snippet}\n`);
  }

  if (errors.length > 0) {
    console.error(`[lint:raw-values] FAIL - ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`[lint:raw-values] PASS with warnings - ${warnings.length} warning(s).`);
}

main();
