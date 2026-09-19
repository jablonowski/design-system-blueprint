'use strict';

/**
 * Contract tests for the Token MCP.
 *
 * These assert the guarantees written in design-tokens/token-mcp-contract.md.
 * The negative cases matter more than the positive ones: the failure mode this
 * server exists to prevent is a confident wrong answer, not a missing one.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { createTokenEngine } = require('../src/token-engine');

const engine = createTokenEngine();

const CUSTOM = 'custom-component';

// ── Rule 1-4: tier discipline ────────────────────────────────────────────────

test('a resolved answer is always a tier 2 decision token', () => {
  const result = engine.resolveToken({
    intent: 'primary text color for high emphasis body content',
    context: CUSTOM,
    property: 'color',
  });

  assert.equal(result.status, 'resolved');
  assert.ok(result.token.startsWith('decisions.'), `got ${result.token}`);
  assert.equal(result.tier, 2);
  assert.equal(result.visibility, 'public');
});

test('no reachable intent can produce a tier 1 or tier 3 token', () => {
  const probes = [
    { intent: 'primary action background', property: 'background-color' },
    { intent: 'disabled control text', property: 'color', state: 'disabled' },
    { intent: 'error border on a field', property: 'border-color', state: 'error' },
    { intent: 'checked control fill', property: 'background-color', state: 'checked' },
    { intent: 'modal elevation shadow', property: 'box-shadow' },
    { intent: 'page container maximum width', property: 'max-width' },
  ];

  for (const probe of probes) {
    const result = engine.resolveToken({ ...probe, context: CUSTOM });
    if (result.status !== 'resolved') continue;
    assert.ok(
      result.token.startsWith('decisions.'),
      `${probe.intent} returned non-tier-2 token ${result.token}`
    );
  }
});

test('tier 3 tokens are precedent only and every one maps to a tier 2 token', () => {
  const report = engine.getCoverageReport();
  assert.deepEqual(report.unresolvedTier3, []);

  for (const [tier3Path, resolution] of engine.data.tier3ToTier2) {
    assert.ok(
      resolution.resolvedTo.startsWith('decisions.'),
      `${tier3Path} maps to ${resolution.resolvedTo}, which is not tier 2`
    );
    assert.equal(
      resolution.strategy,
      'direct-alias',
      `${tier3Path} was mapped by "${resolution.strategy}" — only direct aliases are allowed, ` +
      'a guessed mapping is a false precedent'
    );
  }
});

// ── Rule 5: intent, not value ────────────────────────────────────────────────

test('value-based lookup is rejected in every notation', () => {
  const literals = [
    'I need #111111 for title text',
    'which token is rgb(17, 17, 17)',
    'what maps to rgba(0, 0, 0, 0.4)',
    'the one that is hsl(0, 0%, 7%)',
    'I want 12px of space here',
    'give me the 1.5rem token',
  ];

  for (const intent of literals) {
    const result = engine.resolveToken({ intent, context: CUSTOM, property: 'color' });
    assert.equal(result.status, 'rejected', `not rejected: ${intent}`);
    assert.equal(result.reason, 'value-based-lookup');
    assert.equal(result.token, undefined);
  }
});

// ── Rule 6: no-coverage beats a false positive ───────────────────────────────

test('intent that matches no vocabulary in the system returns no-coverage', () => {
  const nonsense = [
    { intent: 'banana color for the flux capacitor', property: 'color' },
    { intent: 'surface for a tooltip popup', property: 'background-color' },
    { intent: 'spacing between form fields', property: 'margin-bottom' },
    { intent: 'make it look nice' },
  ];

  for (const probe of nonsense) {
    const result = engine.resolveToken({ ...probe, context: CUSTOM });
    assert.equal(
      result.status,
      'no-coverage',
      `"${probe.intent}" resolved to ${result.token} — the system guessed instead of declining`
    );
    assert.equal(result.token, null);
    assert.ok(result.nextStep, 'no-coverage must tell the caller what to do next');
  }
});

test('closestIntent is informational and never presented as the answer', () => {
  const result = engine.resolveToken({
    intent: 'surface for a tooltip popup',
    context: CUSTOM,
    property: 'background-color',
  });

  assert.equal(result.status, 'no-coverage');
  assert.equal(result.token, null);
  assert.notEqual(result.closestIntent, result.token);
});

test('a question about one property is never answered from another family', () => {
  const result = engine.resolveToken({
    intent: 'primary action emphasis',
    context: CUSTOM,
    property: 'font-size',
  });

  if (result.status === 'resolved') {
    assert.match(result.token, /^decisions\.font\.size\./, `crossed families: ${result.token}`);
  }
});

test('an ambiguous intent returns no-coverage rather than picking a winner by tiebreak', () => {
  const result = engine.resolveToken({
    intent: 'corner rounding for a card',
    context: CUSTOM,
    property: 'border-radius',
  });

  assert.equal(result.status, 'no-coverage');
  assert.match(result.rationale, /ambiguous/i);
});

// ── Rule 7: precedent-backed rationale ───────────────────────────────────────

test('a resolved answer cites a precedent that actually uses that alias', () => {
  const result = engine.resolveToken({
    intent: 'primary action background',
    context: CUSTOM,
    property: 'background-color',
  });

  assert.equal(result.status, 'resolved');
  assert.equal(result.token, 'decisions.color.action.primary.background');
  assert.ok(result.precedent.length > 0, 'expected at least one precedent');

  for (const precedent of result.precedent) {
    const mapping = engine.data.tier3ToTier2.get(precedent);
    assert.ok(mapping, `${precedent} is not a known tier 3 token`);
    assert.equal(
      mapping.resolvedTo,
      result.token,
      `${precedent} was cited as precedent but resolves to ${mapping.resolvedTo}`
    );
  }

  assert.ok(result.rationale.includes(result.precedent[0]));
});

test('the cited precedent is the most relevant one, not an arbitrary first entry', () => {
  const result = engine.resolveToken({
    intent: 'primary action background',
    context: 'variant-of',
    baseComponent: 'button',
    property: 'background-color',
  });

  assert.equal(result.status, 'resolved');
  assert.ok(
    result.precedent[0].startsWith('component.button.'),
    `asked about a Button variant but cited ${result.precedent[0]}`
  );
});

// ── State handling ───────────────────────────────────────────────────────────

test('a requested state resolves to the state variant, not the default', () => {
  const result = engine.resolveToken({
    intent: 'primary action background',
    context: CUSTOM,
    property: 'background-color',
    state: 'hover',
  });

  assert.equal(result.status, 'resolved');
  assert.equal(result.token, 'decisions.color.action.primary.backgroundHover');
});

test('no requested state resolves to the default, not a state variant', () => {
  const result = engine.resolveToken({
    intent: 'primary action background',
    context: CUSTOM,
    property: 'background-color',
  });

  assert.equal(result.status, 'resolved');
  assert.equal(result.token, 'decisions.color.action.primary.background');
});

// ── explain_component_tokens ─────────────────────────────────────────────────

test('component explanation maps every private token to a public tier 2 token', () => {
  const result = engine.explainComponentTokens({ component: 'Button', variant: 'primary' });

  assert.ok(Array.isArray(result.tokens));
  assert.ok(result.tokens.length > 0);

  for (const item of result.tokens) {
    assert.equal(item.visibility, 'private');
    assert.ok(
      item.useInYourCode && item.useInYourCode.startsWith('decisions.'),
      `${item.componentToken} → ${item.useInYourCode}`
    );
  }
});

test('a button background never resolves to a text colour decision', () => {
  const result = engine.explainComponentTokens({ component: 'Button', variant: 'primary' });
  const background = result.tokens.find((t) => t.role === 'background');

  assert.ok(background, 'Button primary has no background token');
  assert.doesNotMatch(
    background.useInYourCode,
    /\.color\.text\./,
    'a primary action surface is being described by a text colour decision — ' +
    'that is a missing decision in tier 2, not a valid alias'
  );
  assert.match(background.useInYourCode, /\.color\.action\./);
});

test('usage line is a copy-pasteable CSS declaration', () => {
  const result = engine.resolveToken({
    intent: 'primary action background',
    context: CUSTOM,
    property: 'background-color',
  });

  assert.equal(
    result.usage,
    'background-color: var(--ds-decisions-color-action-primary-background);'
  );
});
