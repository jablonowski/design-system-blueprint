'use strict';

const {
  loadTokens,
  parseReference,
  toCssUsage,
} = require('./token-loader');

/**
 * Intent → tier 2 token resolution.
 *
 * The contract this file implements (design-tokens/token-mcp-contract.md) says
 * no-coverage is always preferred over a speculative match. That is enforced by
 * three gates, in order:
 *
 *   1. VALUE GATE     — a query containing a literal value is rejected outright.
 *   2. FAMILY GATE    — the CSS property must map to a known token family, and
 *                       only tokens from that family are eligible. A question
 *                       about background-color can never be answered with a
 *                       font size, whatever the wording.
 *   3. EVIDENCE GATE  — the winning candidate must share at least one meaningful
 *                       word with the intent (in its path or its comment). Wording
 *                       that matches nothing in the system returns no-coverage
 *                       instead of the highest-scoring nonsense.
 *
 * Only after all three does the score threshold apply.
 */

const VALUE_LOOKUP_RE = /(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b\d+(?:\.\d+)?(?:px|rem|em|%)\b)/i;

/**
 * Words that carry no evidence about WHICH token is meant. They describe the
 * CSS property (already handled by the family gate) or are English filler.
 * A candidate that only matches these has not been evidenced at all.
 */
const STOPWORDS = new Set([
  // property / mechanism words
  'color', 'colour', 'background', 'backgrounds', 'border', 'borders', 'text', 'font',
  'size', 'width', 'height', 'spacing', 'space', 'padding', 'margin', 'gap', 'radius',
  'shadow', 'opacity', 'duration', 'easing', 'index', 'zindex', 'value', 'values',
  'token', 'tokens', 'style', 'styles', 'css', 'variable', 'property',
  // generic UI filler
  'component', 'components', 'custom', 'element', 'elements', 'ui', 'thing', 'item',
  'need', 'needs', 'want', 'use', 'using', 'should', 'would', 'which', 'what',
  // English function words
  'a', 'an', 'the', 'of', 'for', 'to', 'in', 'on', 'at', 'by', 'with', 'from', 'and',
  'or', 'is', 'are', 'be', 'it', 'its', 'this', 'that', 'these', 'those', 'my', 'me',
  'i', 'we', 'our', 'between', 'inside', 'outside', 'when', 'where', 'as', 'some',
]);

/**
 * Token families, keyed by the property group the question is about.
 * A candidate token path must match the family pattern to be eligible at all.
 */
const FAMILY = {
  background: /\.color\.(surface\.|action\.[a-z0-9]+\.background|feedback\.[a-z0-9]+\.surface)/i,
  'text-color': /\.color\.(text\.|action\.[a-z0-9]+\.text|feedback\.[a-z0-9]+\.(text|icon))/i,
  'border-color': /\.color\.(border\.|action\.[a-z0-9]+\.border|feedback\.[a-z0-9]+\.border)/i,
  overlay: /\.color\.overlay\./i,
  radius: /\.border\.radius\./i,
  'border-width': /\.border\.width\./i,
  shadow: /\.shadow\./i,
  'font-size': /\.font\.size\./i,
  'font-weight': /\.font\.weight\./i,
  'line-height': /\.font\.lineheight\./i,
  tracking: /\.font\.tracking\./i,
  spacing: /\.space\./i,
  size: /\.size\./i,
  'layout-width': /\.layout\.width\./i,
  'z-index': /\.zindex\./i,
  opacity: /\.opacity\./i,
  duration: /\.motion\.duration\./i,
  easing: /\.motion\.easing\./i,
};

/** Intent words that steer an ambiguous colour question towards a sub-family. */
const ACTION_WORDS = new Set([
  'action', 'actions', 'button', 'buttons', 'cta', 'click', 'clickable', 'press',
  'pressed', 'submit', 'trigger', 'checkbox', 'radio', 'toggle', 'checked',
]);
const FEEDBACK_WORDS = new Set([
  'alert', 'alerts', 'banner', 'banners', 'notification', 'notifications', 'toast',
  'message', 'messages', 'status', 'validation', 'error', 'errors', 'success',
  'warning', 'warnings', 'info', 'danger', 'destructive', 'invalid',
]);

const STATE_HINTS = [
  'hover', 'active', 'pressed', 'focus', 'disabled', 'selected', 'checked',
  'error', 'success', 'warning', 'info',
];

/**
 * A candidate must clear MIN_SCORE *and* beat the runner-up by MIN_MARGIN.
 * The margin is the important one: it encodes "the system can actually tell
 * these two tokens apart for this question". Two tokens that fit equally well
 * is not a resolved answer, it is an ambiguous one — and the contract says
 * ambiguity returns no-coverage.
 */
const MIN_SCORE = 3;
const MIN_MARGIN = 2;

/** Plain-language names for the t-shirt scale, so "medium" can find "md". */
const SCALE_SYNONYMS = {
  tiny: 'xs', small: 'sm', medium: 'md', large: 'lg', huge: 'xl',
  smaller: 'sm', larger: 'lg', big: 'lg',
};

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ' ')
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Crude singularisation so "overlays" matches "overlay". */
function stem(word) {
  if (word.length > 4 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function tokenize(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized.split(/[\s.,-]+/).filter(Boolean).map(stem);
}

/** Meaningful words only — the ones the evidence gate is allowed to count. */
function evidenceWords(words) {
  return words.filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Two words match if they are equal, or if one is a prefix of the other and the
 * shorter is at least 5 characters ("expand" matches "expanding").
 */
function wordsMatch(a, b) {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 5 && long.startsWith(short);
}

function countMatches(words, corpus) {
  let hits = 0;
  for (const word of words) {
    if (corpus.some((c) => wordsMatch(word, c))) hits += 1;
  }
  return hits;
}

/**
 * Path segments, with camelCase split apart: "backgroundHover" has to yield
 * ["background", "hover"] or a question about a hover state can never match the
 * token that carries it.
 */
function getPathSegments(path) {
  return path
    .split('.')
    .flatMap((segment) => segment.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/\s+/))
    .flatMap((x) => tokenize(x));
}

function createTokenEngine(tokensPath) {
  const { leaves, byPath } = loadTokens(tokensPath);
  const tier1 = leaves.filter((x) => x.tier === 1);
  const tier2 = leaves.filter((x) => x.tier === 2);
  const tier3 = leaves.filter((x) => x.tier === 3);

  /**
   * Map a private tier 3 token to the public tier 2 token a consumer should use.
   *
   * There is deliberately no heuristic fallback here. The token schema validator
   * enforces that every tier 3 token references tier 2, so a tier 3 token that
   * cannot be mapped is a real gap in the system and must surface as such in the
   * coverage report — not be papered over with a guess.
   */
  function inferTier2FromTier3(token3Path) {
    const token3 = byPath.get(token3Path);
    if (!token3) return null;

    const directRef = parseReference(token3.value);
    if (directRef && directRef.startsWith('decisions.') && byPath.has(directRef)) {
      return { resolvedTo: directRef, strategy: 'direct-alias' };
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

  /** Precedents ordered by how well they match the asked-about intent. */
  function rankPrecedents(tier2Path, signals) {
    const precedents = precedentsByTier2.get(tier2Path) || [];
    if (precedents.length < 2) return precedents.slice();

    const words = signals ? signals.evidence : [];
    return precedents
      .map((path) => ({ path, score: countMatches(words, getPathSegments(path)) }))
      .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
      .map((x) => x.path);
  }

  function detectPropertyGroup(property, intent) {
    const p = normalizeText(property);
    const i = normalizeText(intent);
    const both = `${p} ${i}`;

    if (/background|backdrop|surface|fill/.test(both) && !/border/.test(p)) {
      if (/backdrop|scrim/.test(both)) return 'overlay';
      return 'background';
    }
    if (/border-radius|corner|rounding/.test(both)) return 'radius';
    if (/border-width/.test(p)) return 'border-width';
    if (/border/.test(both) && !/border-radius|border-width/.test(p)) return 'border-color';
    if (/box-shadow|shadow|elevation|focus ring/.test(both)) return 'shadow';
    if (/font-size|type scale/.test(both)) return 'font-size';
    if (/font-weight|weight/.test(p)) return 'font-weight';
    if (/line-height|leading/.test(both)) return 'line-height';
    if (/letter-spacing|tracking/.test(both)) return 'tracking';
    if (/^(padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left)/.test(p)) return 'spacing';
    if (/max-width|min-width|container|panel width/.test(both)) return 'layout-width';
    if (/^(width|height|min-height|max-height)/.test(p)) return 'size';
    if (/z-index|stacking|layer/.test(both)) return 'z-index';
    if (/opacity|transparency/.test(both)) return 'opacity';
    if (/duration|transition|animation/.test(both)) return 'duration';
    if (/timing|easing|curve/.test(both)) return 'easing';
    if (/^color$/.test(p) || /text|label|caption|heading|title/.test(both)) return 'text-color';
    return 'unknown';
  }

  function extractSignals(input) {
    const intent = normalizeText(input.intent);
    const property = normalizeText(input.property);
    const state = normalizeText(input.state);
    const context = normalizeText(input.context);
    const baseComponent = normalizeText(input.baseComponent);

    const intentWords = tokenize([intent, state].join(' '));
    const allWords = tokenize([intent, property, state, context, baseComponent].join(' '));

    const states = new Set();
    for (const hint of STATE_HINTS) {
      if (allWords.includes(hint)) states.add(hint);
    }

    const evidence = evidenceWords(intentWords);
    for (const word of [...evidence]) {
      const synonym = SCALE_SYNONYMS[word];
      if (synonym && !evidence.includes(synonym)) evidence.push(synonym);
    }

    return {
      intent,
      property,
      context,
      baseComponent,
      words: allWords,
      evidence,
      states,
      propertyGroup: detectPropertyGroup(property, intent),
      prefersAction: evidence.some((w) => ACTION_WORDS.has(w)),
      prefersFeedback: evidence.some((w) => FEEDBACK_WORDS.has(w)),
    };
  }

  const tier2Index = tier2.map((token) => ({
    token,
    pathLc: token.path.toLowerCase(),
    segments: getPathSegments(token.path),
    commentWords: tokenize(token.comment),
  }));

  function isEligible(entry, signals) {
    const family = FAMILY[signals.propertyGroup];
    if (!family) return false;
    return family.test(entry.pathLc);
  }

  function scoreCandidate(entry, signals) {
    const { evidence, states } = signals;
    let score = 0;

    const pathHits = countMatches(evidence, entry.segments);
    const commentHits = countMatches(evidence, entry.commentWords);

    score += pathHits * 4;
    score += Math.min(6, commentHits * 3);

    for (const state of states) {
      // A requested state is decisive: a token that carries it wins, a token
      // that does not is actively wrong, not merely less good.
      if (entry.segments.some((s) => wordsMatch(s, state))) score += 6;
      else score -= 4;
    }

    // No state was asked for, so the default token is meant — not one of its
    // state variants. Without this, "primary action background" ties with
    // "primary action background on hover" and the answer becomes a coin flip.
    if (states.size === 0 && entry.segments.some((seg) => STATE_HINTS.includes(seg))) {
      score -= 5;
    }

    if (signals.prefersAction && /\.action\./.test(entry.pathLc)) score += 4;
    if (signals.prefersFeedback && /\.feedback\./.test(entry.pathLc)) score += 4;
    if (signals.prefersAction && /\.feedback\./.test(entry.pathLc)) score -= 2;
    if (signals.prefersFeedback && /\.action\./.test(entry.pathLc)) score -= 2;

    if (signals.context === 'variant-of' && signals.baseComponent) {
      const prefix = `component.${signals.baseComponent}.`;
      const precedents = precedentsByTier2.get(entry.token.path) || [];
      if (precedents.some((x) => x.startsWith(prefix))) score += 6;
    }

    return { score, pathHits, commentHits };
  }

  function containsValueLiteral(input) {
    const combined = [input.intent, input.property, input.state].join(' ');
    return VALUE_LOOKUP_RE.test(combined);
  }

  function noCoverage(closestIntent, rationale, nextStep) {
    return {
      status: 'no-coverage',
      token: null,
      closestIntent: closestIntent || null,
      rationale,
      nextStep,
    };
  }

  function resolveToken(input) {
    const normalizedInput = input || {};

    // Gate 1 — value-based lookup
    if (containsValueLiteral(normalizedInput)) {
      return {
        status: 'rejected',
        reason: 'value-based-lookup',
        message: 'Describe what the value is for, not what it looks like. Ask by intent.',
      };
    }

    const signals = extractSignals(normalizedInput);

    if (!signals.intent) {
      return noCoverage(
        null,
        'No intent was provided.',
        'Describe the role, property and state (for example: primary action background on hover).'
      );
    }

    // Gate 2 — property family
    if (signals.propertyGroup === 'unknown') {
      return noCoverage(
        null,
        'The CSS property this token is for could not be determined, so no token family could be selected.',
        'Pass an explicit property (for example property: "background-color") alongside the intent.'
      );
    }

    const eligible = tier2Index.filter((entry) => isEligible(entry, signals));
    if (eligible.length === 0) {
      return noCoverage(
        null,
        `No tier 2 tokens exist for the "${signals.propertyGroup}" family.`,
        'Propose a new decision token for this property through the contribution pipeline.'
      );
    }

    const scored = eligible
      .map((entry) => ({ entry, ...scoreCandidate(entry, signals) }))
      .sort((a, b) => b.score - a.score || a.entry.token.path.localeCompare(b.entry.token.path));

    const best = scored[0];
    const closestIntent = best.entry.token.path;

    // Gate 3 — evidence
    if (best.pathHits === 0 && best.commentHits === 0) {
      return noCoverage(
        closestIntent,
        'The intent shares no vocabulary with any token in this family, so any answer would be a guess.',
        'Rephrase using a role the system knows (primary, secondary, danger, muted, disabled, selected, hover), or propose a new decision token.'
      );
    }

    if (best.score < MIN_SCORE) {
      return noCoverage(
        closestIntent,
        `No semantic token reached the confidence threshold (best score ${best.score}, required ${MIN_SCORE}).`,
        'Refine the intent using role + state (for example: text color for a disabled secondary action).'
      );
    }

    // Gate 4 — ambiguity. Several tokens fit this wording equally well.
    const runnerUp = scored[1];
    if (runnerUp && best.score - runnerUp.score < MIN_MARGIN) {
      return noCoverage(
        closestIntent,
        `Intent is ambiguous: ${closestIntent} and ${runnerUp.entry.token.path} match it equally well (score ${best.score} vs ${runnerUp.score}).`,
        'Add the distinguishing role or state to the intent, or ask about the two candidates separately.'
      );
    }

    const precedents = rankPrecedents(best.entry.token.path, signals);
    const rationale = precedents.length > 0
      ? `Matched on ${signals.propertyGroup} family and role vocabulary; the same alias is the precedent behind ${precedents[0]}.`
      : `Matched on ${signals.propertyGroup} family and role vocabulary. No component uses this alias yet, so there is no precedent to cite.`;

    return {
      status: 'resolved',
      token: best.entry.token.path,
      tier: 2,
      visibility: 'public',
      confidence: best.score,
      rationale,
      precedent: precedents,
      usage: toCssUsage(best.entry.token.path, normalizedInput.property || undefined),
    };
  }

  function explainComponentTokens(input) {
    const component = normalizeText(input && input.component);
    const variant = normalizeText(input && input.variant);

    if (!component) {
      return { status: 'no-coverage', message: 'Component name is required.' };
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
    const unresolvedTier3 = tier3
      .filter((token) => !tier3ToTier2.has(token.path))
      .map((token) => token.path);

    const families = Object.keys(FAMILY).map((group) => ({
      family: group,
      tier2Count: tier2Index.filter((entry) => FAMILY[group].test(entry.pathLc)).length,
    }));

    return {
      tier1Count: tier1.length,
      tier2Count: tier2.length,
      tier3Count: tier3.length,
      unresolvedTier3,
      families,
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
