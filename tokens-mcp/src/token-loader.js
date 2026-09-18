'use strict';

const fs = require('fs');
const path = require('path');

const REFERENCE_RE = /^\{([\w.-]+)\}$/;

function getDefaultTokensPath() {
  return path.resolve(__dirname, '..', '..', 'design-tokens', 'tokens', 'tokens.json');
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function detectTier(pathString) {
  if (pathString.startsWith('decisions.')) return 2;
  if (pathString.startsWith('component.')) return 3;
  return 1;
}

function walkTokens(node, pathParts, inheritedComment, out) {
  if (!isObject(node)) return;

  const nodeComment = typeof node.comment === 'string' ? node.comment : inheritedComment;

  if (typeof node.value === 'string') {
    const tokenPath = pathParts.join('.');
    out.push({
      path: tokenPath,
      tier: detectTier(tokenPath),
      value: node.value,
      comment: nodeComment || '',
    });
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key === 'comment') continue;
    walkTokens(child, [...pathParts, key], nodeComment, out);
  }
}

function parseReference(value) {
  const match = value.match(REFERENCE_RE);
  return match ? match[1] : null;
}

function toKebabSegment(segment) {
  return segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCssVariableName(tokenPath) {
  const normalized = tokenPath
    .split('.')
    .map(toKebabSegment)
    .join('-');
  return `--ds-${normalized}`;
}

function toCssUsage(tokenPath, property) {
  const cssVar = toCssVariableName(tokenPath);
  if (property && typeof property === 'string' && property.trim().length > 0) {
    return `${property}: var(${cssVar});`;
  }
  return `var(${cssVar})`;
}

function loadTokens(tokensPath = getDefaultTokensPath()) {
  const raw = fs.readFileSync(tokensPath, 'utf8');
  const root = JSON.parse(raw);
  const leaves = [];
  walkTokens(root, [], '', leaves);

  const byPath = new Map(leaves.map((entry) => [entry.path, entry]));
  return { leaves, byPath, tokensPath };
}

module.exports = {
  getDefaultTokensPath,
  loadTokens,
  parseReference,
  toCssVariableName,
  toCssUsage,
};
