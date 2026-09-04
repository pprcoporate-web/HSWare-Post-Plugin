# HSWare Post — Public Submission v3.2.1

## Production endpoints after deployment
Replace `<worker-host>` with the deployed `workers.dev` hostname.

- MCP server: `https://<worker-host>/mcp`
- Health: `https://<worker-host>/health`
- Privacy policy: `https://<worker-host>/privacy`
- Terms of service: `https://<worker-host>/terms`
- Support: `https://<worker-host>/support`

## Proposed directory metadata
- App name: HSWare Post
- Category: Productivity
- Short description: Generate and validate HSWare software-post JSON using the HSWare runtime contract.
- Authentication: No app-specific account required (subject to the submission form/options available to your account).
- Data access: Inputs supplied directly to the MCP tools; no external account data is fetched.
- Write actions: None.
- Destructive actions: None.

## Tools
1. `get_hsware_contract` — read-only; returns a compact fast-default no-browse generation contract, or the full specification only when strict mode is explicitly requested.
2. `validate_hsware_json` — read-only; validates candidate JSON and returns findings; not called automatically during fast generation.
3. `hsware_health` — read-only diagnostic.

## Before submission
- Deploy v3.2.1 and verify `/health`, `/privacy`, `/terms`, `/support`, and `/mcp`.
- Replace any generic project-source wording with the exact public GitHub repository URL.
- Make sure the developer/publisher name in the OpenAI submission is the legal or public identity you want shown.
- Provide the required developer/support contact in the submission form.
- Use an original app icon you have rights to use.
- Test every tool in ChatGPT Developer Mode.
- Test malformed JSON, missing runtime prompts, long inputs, and unavailable-server behavior.
- Review OpenAI's current app developer guidelines immediately before submission because requirements can change.

## Important
This package prepares the server and public policy endpoints. It does not itself publish the app. Directory publication requires OpenAI's app submission/review flow and approval.
