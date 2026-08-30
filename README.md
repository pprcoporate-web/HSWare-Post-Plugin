# HSWare Post MCP v3.1

Developer: **Hammad Shujra**  
Category: **Productivity**  
Version: **3.1.0**

Cloudflare Workers remote MCP server for the HSWare HSAI workflow.

## v3.1 Fast Workflow

- Input-first: user-supplied structured software data is authoritative for the job.
- No redundant web verification of supplied versions, dates, hashes, requirements, or URLs.
- Research only genuinely missing fields required by active HSWare panels.
- One focused research pass by default.
- Local validation does not trigger research.
- Repair only failed fields/sections instead of regenerating the whole article.
- Existing HSWare word-count, JSON, URL, feature, FAQ, category, ALT, and keyword-density gates remain in force.

## Deploy

Push these files to the existing GitHub repository connected to Cloudflare Workers. Cloudflare can redeploy using `npx wrangler deploy`. The Worker name remains `hsware-post-plugin`, so the existing `/mcp` endpoint can remain unchanged.

## Endpoints

- `/mcp` — MCP endpoint
- `/health` — health/version metadata
- `/privacy` — privacy policy
- `/terms` — terms
- `/support` — support
