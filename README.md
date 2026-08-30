# HSWare Post MCP — Public Submission v3.0

Cloudflare Worker MCP service prepared as a public-submission candidate for HSWare Post.

## Deploy
```bash
npm install
npm run check
npx wrangler deploy
```

No custom domain is required; Cloudflare's `workers.dev` hostname can serve the MCP and policy pages.

## Endpoints
- `/mcp` — remote MCP endpoint
- `/health` — service health
- `/privacy` — public privacy policy
- `/terms` — public terms of service
- `/support` — public support page

## MCP tools
- `get_hsware_contract`
- `validate_hsware_json`
- `hsware_health`

See `PUBLIC-SUBMISSION.md` before submitting the app for directory review.
