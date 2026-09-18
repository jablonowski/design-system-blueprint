'use strict';

const {
  loadTokens,
  parseReference,
  toCssUsage,
} = require('./token-loader');

const VALUE_LOOKUP_RE = /(#[0-9a-f]{3,8}\b|rgba?\(|\b\d+(?:\.\d+)?(?:px|rem|em|%)\b)/i;

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ' ')
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}

function getPathSegments(path) {
  return path.split('.').map((x) => x.toLowerCase());
}

function createTokenEngine(tokensPath) {
  const { leaves, byPath } = loadTokens(tokensPath);
  const tier1 = leaves.filter((x) => x.tier === 1);
  const tier2 = leaves.filter((x) => x.tier === 2);
  const tier3 = leaves.filter((x) => x.tier === 3);

  const memoTerminal = new Map();

  function resolveTerminal(path, visited = new Set()) {
    if (memoTerminal.has(path)) return memoTerminal.get(path);
    if (visited.has(path)) return null;
    visited.add(path);

    const token = byPath.get(path);
    if (!token) return null;

    const ref = parseReference(token.value);
    if (!ref) {
      const terminal = { type: 'literal', value: token.value, path };
      memoTerminal.set(path, terminal);
      return terminal;
    }

    const target = byPath.get(ref);
    if (!target) return null;

    if (target.tier === 1) {
      const terminal = { type: 'tier1', value: target.value, path: target.path };
      memoTerminal.set(path, terminal);
      return terminal;
    }

    const terminal = resolveTerminal(target.path, visited);
    memoTerminal.set(path, terminal);
    return terminal;
  }

  const tier2Terminals = tier2.map((token) => ({
    path: token.path,
    terminal: resolveTerminal(token.path),
    segments: getPathSegments(token.path),
  }));

  function keywordOverlapScore(a, b) {
    const aSet = new Set(a);
    const bSet = new Set(b);
    let score = 0;
    for (const item of aSet) {
      if (bSet.has(item)) score += 1;
    }
    return score;
  }

  function inferTier2FromTier3(token3Path) {
    const token3 = byPath.get(token3Path);
    if (!token3) return null;

    const directRef = parseReference(token3.value);
    if (directRef && directRef.startsWith('decisions.') && byPath.has(directRef)) {
      return {
        resolvedTo: directRef,
        strategy: 'direct-alias',
      };
    }

    const terminal = resolveTerminal(token3Path);
    const matches = [];

    for (const candidate of tier2Terminals) {
      if (!candidate.terminal || !terminal) continue;
      if (candidate.terminal.path === terminal.path || candidate.terminal.value === terminal.value) {
        matches.push(candidate.path);
      }
    }

    if (matches.length === 1) {
      return {
        resolvedTo: matches[0],
        strategy: 'terminal-match',
      };
    }

    if (matches.length > 1) {
      const token3Words = getPathSegments(token3Path);
      let best = null;
      let bestScore = -1;

      for (const candidatePath of matches) {
        const score = keywordOverlapScore(token3Words, getPathSegments(candidatePath));
        if (score > bestScore) {
          bestScore = score;
          best = candidatePath;
        }
      }

      return {
        resolvedTo: best,
        strategy: 'terminal-match-overlap',
      };
    }

    const heuristics = [
      { re: /background|surface/, tier2: 'decisions.color.surface.base' },
      { re: /text|label|title|caption/, tier2: 'decisions.color.text.primary' },
      { re: /border/, tier2: 'decisions.color.border.control' },
      { re: /focus|ring|shadow/, tier2: 'decisions.shadow.focus' },
      { re: /radius/, tier2: 'decisions.border.radius.lg' },
      { re: /disabled/, tier2: 'decisions.opacity.disabled' },
    ];

    for (const rule of heuristics) {
      if (rule.re.test(token3Path) && byPath.has(rule.tier2)) {
        return {
          resolvedTo: rule.tier2,
          strategy: 'heuristic',
        };
      }
    }

    return null;
  }

  const tier3ToTier2 = new Map();
  const precedentsByTier2 = new Map();

  for (const token of tier3) {
    const resolution = inferTier2FromTier3(token.path);
    if (!resolution) continue;

    tier3ToTier2.set(token.path, resolution);
    if (!precedentsByTier2.has(resolution.resolvedTo)) {
      precedentsByTier2.set(resolution.resolvedTo, []);
    }
    precedentsByTier2.get(resolution.resolvedTo).push(token.path);
  }

  function extractSignals(input) {
    const intent = normalizeText(input.intent);
    const property = normalizeText(input.property);
    const state = normalizeText(input.state);
    const context = normalizeText(input.context);
    const baseComponent = normalizeText(input.baseComponent);
    const words = tokenize([intent, property, state, context, baseComponent].join(' '));

    const states = new Set();
    const stateHints = ['hover', 'active', 'pressed', 'focus', 'disabled', 'selected', 'error', 'success', 'warning', 'info'];
    for (const hint of stateHints) {
      if (words.includes(hint)) states.add(hint);
    }

    let propertyGroup = 'unknown';
    if (/background/.test(property) || /background/.test(intent)) propertyGroup = 'background';
    else if (/border-radius/.test(property)) propertyGroup = 'radius';
    else if (/border-color/.test(property) || (/border/.test(property) && /color/.test(property))) propertyGroup = 'border-color';
    else if (/^color$/.test(property) || (/color/.test(property) && !/background/.test(property))) propertyGroup = 'text-color';
    else if (/shadow/.test(property)) propertyGroup = 'shadow';
    else if (/font-size/.test(property)) propertyGroup = 'font-size';
    else if (/font-weight/.test(property)) propertyGroup = 'font-weight';
    else if (/z-index/.test(property)) propertyGroup = 'z-index';
    else if (/opacity/.test(property)) propertyGroup = 'opacity';
    else if (/duration/.test(property)) propertyGroup = 'duration';
    else if (/timing|easing/.test(property)) propertyGroup = 'easing';

    return {
      intent,
      property,
      context,
      baseComponent,
      words,
      states,
      propertyGroup,
    };
  }

  function scoreTier2Candidate(candidate, signals) {
    const path = candidate.path;
    const pathLc = path.toLowerCase();
    const commentWords = tokenize(candidate.comment);
    let score = 0;

    const propertyBoost = {
      background: '.color.surface.',
      'text-color': '.color.text.',
      'border-color': '.color.border.',
      radius: '.border.radius.',
      shadow: '.shadow.',
      'font-size': '.font.size.',
      'font-weight': '.font.weight.',
      'z-index': '.zindex.',
      opacity: '.opacity.',
      duration: '.motion.duration.',
      easing: '.motion.easing.',
    };

    const boosted = propertyBoost[signals.propertyGroup];
    if (boosted && pathLc.includes(boosted)) score += 6;

    const roleHints = [
      'primary',
      'secondary',
      'inverse',
      'muted',
      'subtle',
      'placeholder',
      'surface',
      'background',
      'border',
      'text',
      'icon',
      'overlay',
      'backdrop',
      'focus',
      'disabled',
      'success',
      'warning',
      'error',
      'info',
    ];

    for (const hint of roleHints) {
      if (signals.words.includes(hint) && pathLc.includes(hint)) score += 3;
    }

    for (const state of signals.states) {
      if (pathLc.includes(state)) score += 4;
    }

    const pathWords = getPathSegments(pathLc);
    score += Math.min(5, keywordOverlapScore(signals.words, pathWords));
    score += Math.min(3, keywordOverlapScore(signals.words, commentWords));

    const precedents = precedentsByTier2.get(candidate.path) || [];
    if (signals.context === 'variant-of' && signals.baseComponent) {
      const prefix = `component.${signals.baseComponent}.`;
      const matching = precedents.filter((x) => x.startsWith(prefix));
      score += matching.length > 0 ? 7 : 0;
    } else if (signals.context === 'custom-component') {
      score += Math.min(3, precedents.length);
    }

    return score;
  }

  function containsValueLiteral(input) {
    const combined = [input.intent, input.property, input.state].join(' ');
    return VALUE_LOOKUP_RE.test(combined);
  }

  function resolveToken(input) {
    const normalizedInput = input || {};

    if (containsValueLiteral(normalizedInput)) {
      return {
        status: 'rejected',
        reason: 'value-based-lookup',
        message: 'Describe what the value is for, not what it looks like. Ask by intent.',
      };
    }

    const signals = extractSignals(normalizedInput);
    if (!signals.intent) {
      return {
        status: 'no-coverage',
        token: null,
        closestIntent: null,
        rationale: 'No intent was provided.',
        nextStep: 'Describe the role, property and state (for example: primary action background on hover).',
      };
    }

    const scored = tier2
      .map((candidate) => ({
        candidate,
        score: scoreTier2Candidate(candidate, signals),
      }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    const closestIntent = best ? best.candidate.path : null;

    if (!best || best.score < 7) {
      return {
        status: 'no-coverage',
        token: null,
        closestIntent,
        rationale: 'No semantic token reached confidence threshold for this intent.',
        nextStep: 'Refine intent using role + state (for example: text color for disabled secondary action).',
      };
    }

    const precedents = precedentsByTier2.get(best.candidate.path) || [];
    let rationale = 'Matched semantic intent by property and role hints.';
    if (precedents.length > 0) {
      rationale = `Matched by semantic hints and existing component precedent (${precedents[0]} -> ${best.candidate.path}).`;
    }

    return {
      status: 'resolved',
      token: best.candidate.path,
      tier: 2,
      visibility: 'public',
      rationale,
      precedent: precedents,
      usage: toCssUsage(best.candidate.path, normalizedInput.property || undefined),
    };
  }

  function explainComponentTokens(input) {
    const component = normalizeText(input && input.component);
    const variant = normalizeText(input && input.variant);

    if (!component) {
      return {
        status: 'no-coverage',
        message: 'Component name is required.',
      };
    }

    const componentPrefix = `component.${component}`;
    const variantPrefix = variant ? `${componentPrefix}.${variant}` : componentPrefix;

    const matchedTier3 = tier3
      .filter((token) => token.path.startsWith(variantPrefix))
      .sort((a, b) => a.path.localeCompare(b.path));

    const tokens = matchedTier3.map((token) => {
      const resolution = tier3ToTier2.get(token.path);
      const useInYourCode = resolution ? resolution.resolvedTo : null;
      const role = token.path.replace(`${variantPrefix}.`, '');

      return {
        role,
        componentToken: token.path,
        resolvesTo: useInYourCode,
        useInYourCode,
        visibility: 'private',
        resolutionStrategy: resolution ? resolution.strategy : 'none',
      };
    });

    return {
      component: input.component,
      variant: input.variant || null,
      tokens,
      warning:
        'Component tokens are private. Use tier 2 semantic tokens from useInYourCode to avoid coupling to internal component implementation.',
    };
  }

  function getCoverageReport() {
    const unresolvedTier3 = tier3.filter((token) => !tier3ToTier2.has(token.path)).map((token) => token.path);
    return {
      tier1Count: tier1.length,
      tier2Count: tier2.length,
      tier3Count: tier3.length,
      unresolvedTier3,
    };
  }

  return {
    resolveToken,
    explainComponentTokens,
    getCoverageReport,
    data: {
      tier1,
      tier2,
      tier3,
      precedentsByTier2,
      tier3ToTier2,
    },
  };
}

module.exports = {
  createTokenEngine,
};
