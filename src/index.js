import { HSWARE_SPEC, contractSummary, validateCandidate } from './hsware.js';

const VERSION = '2.1.0';
const SERVER_INFO = { name: 'hsware-post-mcp', version: VERSION };

const TOOLS = [
  {
    name: 'get_hsware_contract',
    title: 'Get HSWare Runtime Contract',
    description: 'Read HSWare production rules and inspect a runtime prompt before generating HSWare JSON.',
    inputSchema: {
      type: 'object',
      properties: {
        runtime_prompt: { type: 'string', description: 'Complete HSWare HSAI runtime prompt.' }
      },
      required: ['runtime_prompt'],
      additionalProperties: false
    }
  },
  {
    name: 'validate_hsware_json',
    title: 'Validate HSWare JSON',
    description: 'Validate candidate HSWare JSON for syntax, common hard gates, URLs, panels and focus-keyword density.',
    inputSchema: {
      type: 'object',
      properties: {
        candidate_json: { type: 'string', description: 'Complete candidate JSON string.' },
        runtime_prompt: { type: 'string', description: 'Original HSWare runtime prompt.' },
        focus_keyword: { type: 'string', description: 'Optional explicit focus keyword.' }
      },
      required: ['candidate_json'],
      additionalProperties: false
    }
  },
  {
    name: 'hsware_health',
    title: 'HSWare MCP Health',
    description: 'Check HSWare MCP server version and status.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  }
];

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,accept,mcp-protocol-version,mcp-session-id,authorization'
};

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, ...extra } });
}
function rpcResult(id, result) { return { jsonrpc: '2.0', id, result }; }
function rpcError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: '2.0', id: id ?? null, error };
}
function textContent(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return [{ type: 'text', text }];
}

async function handleRpc(msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    return rpcError(msg?.id, -32600, 'Invalid Request');
  }
  const { id, method, params = {} } = msg;

  if (method === 'initialize') {
    return rpcResult(id, {
      protocolVersion: params.protocolVersion || '2025-06-18',
      capabilities: { tools: { listChanged: false } },
      serverInfo: SERVER_INFO,
      instructions: 'Use get_hsware_contract before HSWare generation and validate_hsware_json before final output. The runtime prompt is authoritative.'
    });
  }
  if (method === 'notifications/initialized') return null;
  if (method === 'ping') return rpcResult(id, {});
  if (method === 'tools/list') return rpcResult(id, { tools: TOOLS });
  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};
    try {
      if (name === 'get_hsware_contract') {
        if (typeof args.runtime_prompt !== 'string' || !args.runtime_prompt.trim()) {
          return rpcResult(id, { content: textContent({ error: 'runtime_prompt is required' }), isError: true });
        }
        const payload = { ...contractSummary(args.runtime_prompt), full_specification: HSWARE_SPEC };
        return rpcResult(id, { content: textContent(payload), structuredContent: payload, isError: false });
      }
      if (name === 'validate_hsware_json') {
        if (typeof args.candidate_json !== 'string') {
          return rpcResult(id, { content: textContent({ error: 'candidate_json is required' }), isError: true });
        }
        const payload = validateCandidate({
          candidateJson: args.candidate_json,
          runtimePrompt: typeof args.runtime_prompt === 'string' ? args.runtime_prompt : '',
          focusKeyword: typeof args.focus_keyword === 'string' ? args.focus_keyword : ''
        });
        return rpcResult(id, { content: textContent(payload), structuredContent: payload, isError: false });
      }
      if (name === 'hsware_health') {
        const payload = { ok: true, name: 'HSWare Post MCP', version: VERSION, runtime: 'Cloudflare Workers' };
        return rpcResult(id, { content: textContent(payload), structuredContent: payload, isError: false });
      }
      return rpcResult(id, { content: textContent({ error: `Unknown tool: ${name}` }), isError: true });
    } catch (error) {
      return rpcResult(id, { content: textContent({ error: error?.message || 'Tool execution failed' }), isError: true });
    }
  }
  return rpcError(id, -32601, `Method not found: ${method}`);
}

async function handleMcp(request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method === 'GET') {
    return json({ name: 'HSWare Post MCP', version: VERSION, transport: 'Streamable HTTP', endpoint: '/mcp' });
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { allow: 'GET, POST, OPTIONS' });

  let body;
  try { body = await request.json(); }
  catch { return json(rpcError(null, -32700, 'Parse error'), 400); }

  if (Array.isArray(body)) {
    const results = (await Promise.all(body.map(handleRpc))).filter(Boolean);
    return results.length ? json(results) : new Response(null, { status: 202, headers });
  }
  const result = await handleRpc(body);
  return result ? json(result) : new Response(null, { status: 202, headers });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      return json({ name: 'HSWare Post MCP', version: VERSION, status: 'ok', mcp: '/mcp', health: '/health' });
    }
    if (url.pathname === '/health') return json({ ok: true, version: VERSION, runtime: 'Cloudflare Workers' });
    if (url.pathname === '/mcp' || url.pathname === '/sse') return handleMcp(request);
    return json({ error: 'Not found' }, 404);
  }
};
