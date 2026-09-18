'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createTokenEngine } = require('../src/token-engine');

const engine = createTokenEngine();

test('resolved result never returns tier1 or tier3 token', () => {
  const result = engine.resolveToken({
    intent: 'primary text color for high emphasis body content',
    context: 'custom-component',
    property: 'color',
    state: 'default',
  });

  assert.equal(result.status, 'resolved');
  assert.ok(result.token.startsWith('decisions.'));
  assert.equal(result.tier, 2);
});

test('value-based lookup request is rejected', () => {
  const result = engine.resolveToken({
    intent: 'I need #111111 for title text',
    context: 'custom-component',
    property: 'color',
  });

  assert.equal(result.status, 'rejected');
  assert.equal(result.reason, 'value-based-lookup');
});

test('tier3 precedents resolve to tier2 tokens without orphans', () => {
  const report = engine.getCoverageReport();
  assert.deepEqual(report.unresolvedTier3, []);
});

test('component explanation maps private tokens to public tier2 usage', () => {
  const result = engine.explainComponentTokens({ component: 'Button', variant: 'primary' });

  assert.ok(Array.isArray(result.tokens));
  assert.ok(result.tokens.length > 0);

  for (const item of result.tokens) {
    assert.equal(item.visibility, 'private');
    assert.ok(item.useInYourCode && item.useInYourCode.startsWith('decisions.'));
  }
});
