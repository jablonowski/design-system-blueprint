'use strict';

const readline = require('readline');
const { createTokenEngine } = require('./token-engine');

const engine = createTokenEngine();

const TOOL_DEFS = [
  {
    name: 'resolve_token',
    description:
      'Resolve intent into a tier-2 semantic token. Rejects value-based lookup and returns no-coverage when confidence is low.',
    inputSchema: {
      type: 'object',
      properties: {
        intent: { type: 'string' },
        context: { type: 'string', enum: ['custom-component', 'variant-of'] },
        baseComponent: { type: 'string' },
        property: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['intent', 'context'],
      additionalProperties: false,
    },
  },
  {
    name: 'explain_component_tokens',
    description:
      'Explain internal component token precedent and map each private tier-3 token to the public tier-2 token to use.',
    inputSchema: {
      type: 'object',
      properties: {
        component: { type: 'string' },
        variant: { type: 'string' },
      },
      required: ['component'],
      additionalProperties: false,
    },
  },
];

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function ok(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

function fail(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

function handleToolCall(name, args) {
  if (name === 'resolve_token') {
    return engine.resolveToken(args || {});
  }
  if (name === 'explain_component_tokens') {
    return engine.explainComponentTokens(args || {});
  }
  throw new Error(`Unknown tool: ${name}`);
}

function handleRequest(request) {
  const id = request.id ?? null;

  try {
    switch (request.method) {
      case 'initialize': {
        return ok(id, {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'dsb-tokens-mcp',
            version: '0.1.0',
          },
          capabilities: {
            tools: {},
          },
        });
      }
      case 'tools/list': {
        return ok(id, { tools: TOOL_DEFS });
      }
      case 'tools/call': {
        const params = request.params || {};
        const toolName = params.name;
        const args = params.arguments || {};
        const response = handleToolCall(toolName, args);
        return ok(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
          structuredContent: response,
        });
      }
      case 'ping': {
        return ok(id, {});
      }
      default:
        return fail(id, -32601, `Method not found: ${request.method}`);
    }
  } catch (error) {
    return fail(id, -32000, error.message || 'Internal server error');
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (error) {
    send({
      jsonrpc: '2.0',
      error: { code: -32700, message: 'Parse error' },
    });
    return;
  }

  handleRequest(request);
});
