'use strict';

const { createTokenEngine } = require('./token-engine');

function createEngine(tokensPath) {
  return createTokenEngine(tokensPath);
}

function resolveToken(input, tokensPath) {
  return createTokenEngine(tokensPath).resolveToken(input);
}

function explainComponentTokens(input, tokensPath) {
  return createTokenEngine(tokensPath).explainComponentTokens(input);
}

module.exports = {
  createEngine,
  resolveToken,
  explainComponentTokens,
};
