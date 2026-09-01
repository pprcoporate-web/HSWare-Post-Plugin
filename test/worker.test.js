import test from 'node:test';
import assert from 'node:assert/strict';

import worker from '../src/index.js';

const runtimePrompt = [
  'ACTIVE HSWare PANELS',
  '- Enabled: info, download, features, old_versions, faq, seo.',
  'Focus Keyword: Example Download',
  'ALT Text Count: 0'
].join('\n');

async function rpc(method, params = {}) {
  const request = new Request('https://hsware.test/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  });
  const response = await worker.fetch(request);
  return { response, body: await response.json() };
}

function toolPayload(body) {
  const text = body.result.content.find(item => item.type === 'text')?.text;
  assert.equal(typeof text, 'string');
  return JSON.parse(text);
}

test('initialize advertises fast mode without mandatory validation', async () => {
  const { response, body } = await rpc('initialize', { protocolVersion: '2025-06-18' });
  assert.equal(response.status, 200);
  assert.match(body.result.instructions, /FAST MODE IS DEFAULT/);
  assert.match(body.result.instructions, /Do not call validate_hsware_json/);
  assert.equal(body.result.serverInfo.version, '3.2.0');
});

test('tool schema defaults contract preparation to fast mode', async () => {
  const { body } = await rpc('tools/list');
  const prepare = body.result.tools.find(tool => tool.name === 'get_hsware_contract');
  assert.ok(prepare);
  assert.equal(prepare.inputSchema.properties.mode.default, 'fast');
  assert.deepEqual(prepare.inputSchema.properties.mode.enum, ['fast', 'strict']);

  const validate = body.result.tools.find(tool => tool.name === 'validate_hsware_json');
  assert.match(validate.description, /Never call this automatically/);
});

test('fast contract is compact and ends the tool chain', async () => {
  const started = performance.now();
  const { response, body } = await rpc('tools/call', {
    name: 'get_hsware_contract',
    arguments: { runtime_prompt: runtimePrompt, mode: 'fast' }
  });
  const elapsedMs = performance.now() - started;
  const payload = toolPayload(body);
  const serialized = JSON.stringify(body);

  assert.equal(response.status, 200);
  assert.equal(payload.mode, 'fast');
  assert.equal(payload.full_specification, undefined);
  assert.match(payload.next_action, /Do not call another HSWare tool/);
  assert.equal(body.result.structuredContent, undefined);
  assert.ok(new TextEncoder().encode(serialized).length < 5_000);
  assert.ok(elapsedMs < 250, `local fast contract took ${elapsedMs.toFixed(1)} ms`);
});

test('strict mode retains the full specification on explicit request', async () => {
  const { body } = await rpc('tools/call', {
    name: 'get_hsware_contract',
    arguments: { runtime_prompt: runtimePrompt, mode: 'strict' }
  });
  const payload = toolPayload(body);

  assert.equal(payload.mode, 'strict');
  assert.match(payload.full_specification, /# HSWare Post Skill/);
  assert.match(payload.next_action, /validate_hsware_json once/);
});

test('validator remains available for explicit candidate checks', async () => {
  const candidate = JSON.stringify({ downloads: { url: '[https://example.com](https://example.com)' } });
  const { body } = await rpc('tools/call', {
    name: 'validate_hsware_json',
    arguments: { candidate_json: candidate }
  });
  const payload = toolPayload(body);

  assert.equal(payload.valid, false);
  assert.ok(payload.errors.some(error => error.includes('raw HTTP/HTTPS URL')));
});

test('health endpoint reports the fast default release', async () => {
  const response = await worker.fetch(new Request('https://hsware.test/health'));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.version, '3.2.0');
  assert.equal(body.default_mode, 'fast');
});
