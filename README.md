# HSWare Post MCP v3.2

Developer: **Hammad Shujra**  
Category: **Productivity**  
Version: **3.2.0**

Cloudflare Workers remote MCP server for the HSWare HSAI workflow.

## v3.2 Fast-Default Workflow

- `fast` is the default mode for normal generation.
- One preparation tool call, followed by immediate JSON generation.
- No automatic second validation tool call in fast mode.
- User-supplied structured software data and URLs remain authoritative.
- Research is limited to genuinely missing critical fields, with one focused pass by default.
- Supplied links are not opened merely to reconfirm them.
- Validation is performed internally once; only failed fields are repaired.
- The contract response is compact and is no longer duplicated in both text and structured output.
- `strict` remains available when the user explicitly requests deep verification or tool validation.

The Worker itself does not browse the web or call an AI model. It supplies instructions and performs local JSON validation. Final response time is controlled partly by the ChatGPT model and its web-search workload, so exact latency cannot be guaranteed.

## Modes

### Fast (default)

Use for ordinary HSWare generation. The client calls `get_hsware_contract` once with `mode: "fast"`, performs at most one focused research pass for missing critical facts, and returns the final JSON without calling `validate_hsware_json`.

### Strict (opt-in)

Use only when the user explicitly requests deep verification, link-by-link checking, or strict tool validation. Strict mode returns the full specification and may call `validate_hsware_json` once after drafting, so it can take longer.

## Local verification

```bash
npm install
npm run check
```

## Deploy

Push these files to the existing GitHub repository connected to Cloudflare Workers. Cloudflare can redeploy using `npm run deploy`. The Worker name remains `hsware-post-plugin`, so the existing `/mcp` endpoint can remain unchanged.

## Endpoints

- `/mcp` — MCP endpoint
- `/health` — health/version metadata
- `/privacy` — privacy policy
- `/terms` — terms
- `/support` — support
