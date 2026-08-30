# HSWare Post MCP v2.1 — Cloudflare Workers

This version is built specifically for Cloudflare Workers and does not require a custom domain or paid hosting.

## Deploy from GitHub in Cloudflare

1. Upload the contents of this folder to the ROOT of your GitHub repository.
2. In Cloudflare Workers & Pages, connect the repository.
3. Project name: `hsware-post-plugin`
4. Build command: leave blank.
5. Deploy command: `npx wrangler deploy`
6. Keep Cloudflare Access OFF while connecting ChatGPT.
7. Deploy.

Cloudflare will provide a free `workers.dev` URL. Use the MCP endpoint:

`https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/mcp`

## ChatGPT New Plugin

- Name: `HSWare Post`
- Description: `Generate and validate HSWare software-post JSON`
- Connection: Server URL
- Server URL: your `/mcp` workers.dev URL
- Authentication: choose **No authentication / None** if the ChatGPT form provides it.

## Endpoints

- `/` status
- `/health` health check
- `/mcp` Streamable HTTP MCP endpoint
- `/sse` compatibility alias routed to the same MCP handler

## MCP tools

- `get_hsware_contract`
- `validate_hsware_json`
- `hsware_health`

## Notes

The runtime HSWare prompt remains authoritative. This Worker contains the HSWare specification and deterministic checks for common blocking validation errors.
