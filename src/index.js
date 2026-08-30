import { HSWARE_SPEC, contractSummary, validateCandidate } from './hsware.js';

const VERSION = '3.1.0';
const SERVER_INFO = { name: 'hsware-post', version: VERSION };
const DEVELOPER = 'Hammad Shujra';
const CATEGORY = 'Productivity';

const APP_NAME = 'HSWare Post';
const APP_DESCRIPTION = 'Generate and validate HSWare software-post JSON using the HSWare runtime contract.';

const TOOLS = [
  {
    name: 'get_hsware_contract',
    title: 'Get HSWare Runtime Contract',
    description: 'Read the HSWare production rules using an input-first, research-gaps-only workflow. Supplied structured facts are authoritative unless the user asks for verification. This is read-only.',
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
    description: 'Validate candidate HSWare JSON for syntax, common hard gates, URLs, enabled panels, feature lengths, and focus-keyword density. This is a read-only validation action.',
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
    description: 'Check the public HSWare MCP service version and availability. This is a read-only diagnostic action.',
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
      instructions: 'Use get_hsware_contract before generation and validate_hsware_json before final output. Input-first workflow: preserve supplied structured facts and research only genuinely missing required fields.'
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
        const payload = { ok: true, name: 'HSWare Post MCP', developer: DEVELOPER, category: CATEGORY, version: VERSION, runtime: 'Cloudflare Workers' };
        return rpcResult(id, { content: textContent(payload), structuredContent: payload, isError: false });
      }
      return rpcResult(id, { content: textContent({ error: `Unknown tool: ${name}` }), isError: true });
    } catch (error) {
      return rpcResult(id, { content: textContent({ error: error?.message || 'Tool execution failed' }), isError: true });
    }
  }
  return rpcError(id, -32601, `Method not found: ${method}`);
}

function htmlPage(title, body) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - HSWare Post</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:820px;margin:48px auto;padding:0 22px;line-height:1.65;color:#171717}h1,h2{line-height:1.25}a{color:#175cd3}code{background:#f4f4f5;padding:2px 5px;border-radius:4px}.muted{color:#666}</style></head><body>${body}<hr><p class="muted">HSWare Post · Version ${VERSION}</p></body></html>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}

function privacyPage() {
  return htmlPage('Privacy Policy', `<h1>HSWare Post Privacy Policy</h1><p><strong>Effective:</strong> August 30, 2026</p><p>HSWare Post is an MCP-powered tool that provides HSWare content rules and validates candidate HSWare JSON. The service does not require an HSWare Post account.</p><h2>Data processed</h2><p>When you use the app, the service receives the tool inputs needed to perform the requested operation. These may include an HSWare runtime prompt, candidate JSON, and a focus keyword. The service processes this information to return the requested contract or validation result.</p><h2>Storage</h2><p>HSWare Post does not intentionally create a user profile or application database containing tool inputs. Requests are processed by the deployed Cloudflare Workers infrastructure. Infrastructure providers may process limited technical information such as network, security, and operational metadata under their own terms and policies.</p><h2>Sharing and sale</h2><p>HSWare Post does not sell personal information. Tool inputs are not intentionally shared with advertisers or data brokers.</p><h2>Security</h2><p>The public service uses HTTPS. Do not submit passwords, API keys, private credentials, or other secrets as HSWare runtime prompts or candidate JSON.</p><h2>Children</h2><p>The service is not designed to collect personal information from children.</p><h2>Changes</h2><p>This policy may be updated as the service changes. The effective date above identifies the current version.</p><h2>Contact</h2><p>For privacy or support questions, use the <a href="/support">HSWare Post support page</a>.</p>`);
}

function termsPage() {
  return htmlPage('Terms of Service', `<h1>HSWare Post Terms of Service</h1><p><strong>Effective:</strong> August 30, 2026</p><p>By using HSWare Post, you agree to use it lawfully and in accordance with applicable platform policies.</p><h2>Service</h2><p>HSWare Post supplies HSWare formatting rules and automated validation results. Outputs are provided for assistance and may require independent verification before publication.</p><h2>Acceptable use</h2><p>You may not use the service to submit secrets, abuse the service, interfere with its operation, bypass security controls, or violate applicable law or third-party rights.</p><h2>No warranty</h2><p>The service is provided on an “as is” and “as available” basis without warranties to the extent permitted by law. Availability and validation behavior may change as HSWare rules evolve.</p><h2>Responsibility for content</h2><p>You are responsible for the prompts, software information, URLs, and content you provide or publish. A successful validation result does not establish that third-party facts, downloads, licenses, or claims are accurate or legally permitted.</p><h2>Changes and termination</h2><p>The service may be changed, limited, suspended, or discontinued. These terms may also be updated, with the effective date shown above.</p><h2>Contact</h2><p>For questions about these terms, use the <a href="/support">HSWare Post support page</a>.</p>`);
}

function supportPage() {
  return htmlPage('Support', `<h1>HSWare Post Support</h1><p>HSWare Post provides the HSWare runtime contract and JSON validation through a public MCP endpoint.</p><h2>Connection</h2><p>MCP endpoint: <code>/mcp</code></p><h2>Before reporting a problem</h2><p>Confirm the MCP server is reachable at <a href="/health">/health</a>, then retry the action. Never include passwords, API keys, or private credentials in a support report.</p><h2>Project source</h2><p>Use the public HSWare Post GitHub repository used to deploy this service for issue reporting and project updates. Add the final repository URL to the submission metadata before submitting to OpenAI.</p>`);
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
      return json({ name: APP_NAME, description: APP_DESCRIPTION, developer: DEVELOPER, category: CATEGORY, version: VERSION, status: 'ok', mcp: '/mcp', health: '/health', privacy: '/privacy', terms: '/terms', support: '/support' });
    }
    if (url.pathname === '/health') return json({ ok: true, name: APP_NAME, developer: DEVELOPER, category: CATEGORY, version: VERSION, runtime: 'Cloudflare Workers' });
    if (url.pathname === '/privacy') return privacyPage();
    if (url.pathname === '/terms') return termsPage();
    if (url.pathname === '/support') return supportPage();
    if (url.pathname === '/mcp' || url.pathname === '/sse') return handleMcp(request);
    return json({ error: 'Not found' }, 404);
  }
};
